/**
 * SREdesigns STIR-HEAT 500-D — Application Controller
 * 
 * Manages:
 * - Three.js WebGL rendering pipeline & camera controls
 * - Real-time Thermal ODE + PID heating control loop
 * - Motor speed acceleration ramp & magnetic stir bar physics
 * - Live dynamic CanvasTexture for UI_LCD
 * - Raycaster 3D scene picking on instrument buttons and knobs
 * - Web Audio procedural SFX coordination
 * - Guided classroom demonstration workflow
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  createHotplateModel,
  buildLabRoom,
  BENCH,
} from './hotplate3d.js?v=20260922-gold1';
import {
  playEncoderClick,
  playRelayClick,
  playGlassClink,
  playStirDecoupleRattle,
  playSafetyAlarm,
  updateMotorHum,
  setSfxMuted,
  isSfxMuted,
} from './sfx.js?v=20260922-gold1';

// ---------------------------------------------------------------------------
// Physical Constants & Simulation Parameters
// ---------------------------------------------------------------------------
const AMBIENT_TEMP_C = 22.0;
const MAX_TEMP_C = 310.0;
const MAX_RPM = 1500;
const HEATER_MAX_POWER_W = 600.0;
const PLATE_THERMAL_CAPACITY_J_K = 450.0; // Aluminum/ceramic plate mass
const PLATE_CONVECTIVE_LOSS_W_K = 1.15;
const FLUID_HEAT_TRANSFER_W_K = 2.40;

const SOLVENTS = {
  water:    { name: 'Water (H2O)', bp: 100.0, cp: 4184, visc: 1.0, color: 0x38bdf8 },
  ethanol:  { name: 'Ethanol (EtOH)', bp: 78.3, cp: 2440, visc: 1.2, color: 0xa5f3fc },
  glycerol: { name: 'Glycerol 85%', bp: 290.0, cp: 2400, visc: 15.0, color: 0xfef08a },
};

// ---------------------------------------------------------------------------
// Machine State Engine
// ---------------------------------------------------------------------------
const state = {
  powerOn: true,
  heatingActive: false,
  stirringActive: false,

  setTempC: 80.0,
  plateTempC: AMBIENT_TEMP_C,
  fluidTempC: AMBIENT_TEMP_C,
  safeTempC: 320.0,

  setRPM: 450,
  currentRPM: 0.0,
  stirBarDecoupled: false,

  beakerLoaded: true,
  probeDipped: true,
  solventKey: 'water',

  // PID variables
  pidIntegral: 0.0,
  pidPrevError: 0.0,
  heaterDutyCycle: 0.0,
  relayEngaged: false,

  // UI & Viewport
  exploded: 0.0,
  wireframe: false,
  autoRotate: false,
  orbitSpeed: 1.0,
  zoomLevel: 50,
  lightIntensity: 1.0,

  demoRunning: false,
};

// ---------------------------------------------------------------------------
// DOM Elements
// ---------------------------------------------------------------------------
const viewportEl = document.getElementById('viewport3d');
const statusPill = document.getElementById('status-pill');
const statusDetail = document.getElementById('status-detail');

// 3D Runtime Objects
let scene, camera, renderer, controls;
let twin3d;
let dirLight, fillLight, ambientLight;
let raycaster, mouse;

// Offscreen LCD Canvas
const lcdCanvas = document.createElement('canvas');
lcdCanvas.width = 512;
lcdCanvas.height = 220;
const lcdCtx = lcdCanvas.getContext('2d');
const lcdTexture = new THREE.CanvasTexture(lcdCanvas);
lcdTexture.colorSpace = THREE.SRGBColorSpace;

// ---------------------------------------------------------------------------
// Dynamic LCD Renderer
// ---------------------------------------------------------------------------
function renderLCD() {
  const w = lcdCanvas.width;
  const h = lcdCanvas.height;

  // Dark LCD background
  lcdCtx.fillStyle = '#050c16';
  lcdCtx.fillRect(0, 0, w, h);

  if (!state.powerOn) {
    // If unit is in standby but plate is still hot (> 50°C), flash residual heat warning!
    if (state.plateTempC > 50.0 && Math.floor(Date.now() / 600) % 2 === 0) {
      lcdCtx.fillStyle = '#f04460';
      lcdCtx.font = 'bold 36px "IBM Plex Sans", sans-serif';
      lcdCtx.textAlign = 'center';
      lcdCtx.fillText('⚠️ HOT! RESIDUAL HEAT', w / 2, h / 2 - 10);
      lcdCtx.font = '24px "IBM Plex Mono", monospace';
      lcdCtx.fillStyle = '#f87171';
      lcdCtx.fillText(`${state.plateTempC.toFixed(1)} °C`, w / 2, h / 2 + 30);
    }
    lcdTexture.needsUpdate = true;
    return;
  }

  // Header Bar
  lcdCtx.fillStyle = '#0f172a';
  lcdCtx.fillRect(0, 0, w, 38);
  lcdCtx.fillStyle = '#00f3ff';
  lcdCtx.font = '600 16px "IBM Plex Sans", sans-serif';
  lcdCtx.textAlign = 'left';
  lcdCtx.fillText('SREdesigns STIR-HEAT 500-D', 16, 25);

  // Safety Limit Indicator
  lcdCtx.textAlign = 'right';
  lcdCtx.fillStyle = '#94a3b8';
  lcdCtx.font = '500 14px "IBM Plex Mono", monospace';
  lcdCtx.fillText(`SAFE: ${state.safeTempC.toFixed(0)}°C`, w - 16, 25);

  // Divider line
  lcdCtx.strokeStyle = '#1e293b';
  lcdCtx.lineWidth = 2;
  lcdCtx.strokeRect(8, 42, w - 16, h - 48);

  // --- Left Column: Temperature ---
  const leftX = 24;
  lcdCtx.textAlign = 'left';
  lcdCtx.fillStyle = state.heatingActive ? '#ffb700' : '#64748b';
  lcdCtx.font = 'bold 15px "IBM Plex Sans", sans-serif';
  lcdCtx.fillText(state.heatingActive ? 'HEATER [ACTIVE]' : 'HEATER [OFF]', leftX, 68);

  // Actual Temperature
  const actualTemp = (state.probeDipped && state.beakerLoaded) ? state.fluidTempC : state.plateTempC;
  lcdCtx.font = '700 46px "IBM Plex Mono", monospace';
  lcdCtx.fillStyle = state.heatingActive ? '#fef08a' : '#cbd5e1';
  lcdCtx.fillText(`${actualTemp.toFixed(1)}°`, leftX, 120);

  // Setpoint & Sensor Source
  lcdCtx.font = '14px "IBM Plex Mono", monospace';
  lcdCtx.fillStyle = '#94a3b8';
  lcdCtx.fillText(`SET: ${state.setTempC.toFixed(0)} °C`, leftX, 150);
  const sensorSource = (state.probeDipped && state.beakerLoaded) ? 'PROBE (PT1000)' : 'INTERNAL RTD';
  lcdCtx.fillStyle = (state.probeDipped && state.beakerLoaded) ? '#38bdf8' : '#64748b';
  lcdCtx.fillText(`SRC: ${sensorSource}`, leftX, 172);

  // --- Right Column: Stirring RPM ---
  const rightX = w / 2 + 16;
  lcdCtx.fillStyle = state.stirringActive ? '#00ff88' : '#64748b';
  lcdCtx.font = 'bold 15px "IBM Plex Sans", sans-serif';
  lcdCtx.fillText(state.stirringActive ? 'STIRRER [ACTIVE]' : 'STIRRER [OFF]', rightX, 68);

  // Actual RPM
  lcdCtx.font = '700 46px "IBM Plex Mono", monospace';
  lcdCtx.fillStyle = state.stirringActive ? '#a7f3d0' : '#cbd5e1';
  lcdCtx.fillText(`${Math.round(state.currentRPM)}`, rightX, 120);

  // Setpoint & Coupling status
  lcdCtx.font = '14px "IBM Plex Mono", monospace';
  lcdCtx.fillStyle = '#94a3b8';
  lcdCtx.fillText(`SET: ${state.setRPM} RPM`, rightX, 150);

  if (state.stirBarDecoupled) {
    lcdCtx.fillStyle = '#f04460';
    lcdCtx.fillText('STATUS: SPIN-OUT DECOUPLE', rightX, 172);
  } else {
    lcdCtx.fillStyle = state.stirringActive ? '#34d399' : '#64748b';
    lcdCtx.fillText(state.stirringActive ? 'STATUS: MAGNETIC LOCK' : 'STATUS: IDLE', rightX, 172);
  }

  // --- Bottom Alert Strip ---
  if (state.plateTempC > 50.0) {
    const flash = Math.floor(Date.now() / 450) % 2 === 0;
    lcdCtx.fillStyle = flash ? '#f04460' : '#b91c1c';
    lcdCtx.beginPath();
    lcdCtx.roundRect(16, 184, w - 32, 24, 4);
    lcdCtx.fill();

    lcdCtx.fillStyle = '#ffffff';
    lcdCtx.font = 'bold 13px "IBM Plex Sans", sans-serif';
    lcdCtx.textAlign = 'center';
    lcdCtx.fillText('⚠️ CAUTION: HOT SURFACE RESIDUAL HEAT (>50°C)', w / 2, 201);
  }

  lcdTexture.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Physics & Thermal Dynamics Simulation
// ---------------------------------------------------------------------------
let lastTime = performance.now();
let decoupleTimer = 0;

function updatePhysics() {
  const now = performance.now();
  const dt = Math.min(0.1, (now - lastTime) / 1000.0);
  lastTime = now;

  // 1. STIRRING MOTOR ACCELERATION RAMP
  const targetRPM = (state.powerOn && state.stirringActive && !state.stirBarDecoupled) ? state.setRPM : 0.0;
  const rampRate = 220.0 * dt; // RPM per second

  if (Math.abs(state.currentRPM - targetRPM) < rampRate) {
    state.currentRPM = targetRPM;
  } else if (state.currentRPM < targetRPM) {
    state.currentRPM += rampRate;
  } else {
    state.currentRPM -= rampRate * 1.5;
  }

  // Magnetic decoupling detection:
  // If viscosity of glycerol or extreme RPM acceleration, stir bar can decouple
  const solvent = SOLVENTS[state.solventKey];
  if (state.stirringActive && state.currentRPM > 1100 && solvent.visc > 5.0 && !state.stirBarDecoupled) {
    state.stirBarDecoupled = true;
    playStirDecoupleRattle();
  }

  if (state.stirBarDecoupled) {
    decoupleTimer += dt;
    // Decoupled bar rattles and precesses erratically
    const wobbleAngle = now * 0.025;
    twin3d.setStirBarRotation(wobbleAngle, Math.sin(now * 0.015) * 0.08);
    if (state.setRPM <= 250 || !state.stirringActive) {
      state.stirBarDecoupled = false;
      decoupleTimer = 0;
    }
  } else {
    // Normal synchronized spinning
    const stirAngle = (now * 0.001 * state.currentRPM * 0.1047) % (Math.PI * 2);
    twin3d.setStirBarRotation(stirAngle, 0);
  }

  // Update motor sound & vortex depth
  updateMotorHum(state.currentRPM);
  const vortexRatio = Math.pow(state.currentRPM / MAX_RPM, 2) * (1.0 / Math.max(1, solvent.visc * 0.2));
  twin3d.setVortexDepth(vortexRatio);

  // 2. THERMAL PID & HEAT TRANSFER ODE
  const controlTemp = (state.probeDipped && state.beakerLoaded) ? state.fluidTempC : state.plateTempC;

  if (state.powerOn && state.heatingActive) {
    const error = state.setTempC - controlTemp;
    state.pidIntegral += error * dt;
    state.pidIntegral = Math.max(-50, Math.min(50, state.pidIntegral)); // Anti-windup
    const derivative = (error - state.pidPrevError) / Math.max(0.001, dt);
    state.pidPrevError = error;

    const Kp = 0.045;
    const Ki = 0.002;
    const Kd = 0.080;

    let duty = Kp * error + Ki * state.pidIntegral + Kd * derivative;
    duty = Math.max(0.0, Math.min(1.0, duty));
    state.heaterDutyCycle = duty;

    // Safety circuit cutoff
    if (state.plateTempC >= state.safeTempC) {
      duty = 0.0;
      state.heatingActive = false;
      playSafetyAlarm();
    }

    const heaterInputPower = duty * HEATER_MAX_POWER_W;
    const plateLoss = PLATE_CONVECTIVE_LOSS_W_K * (state.plateTempC - AMBIENT_TEMP_C);
    const fluidHeatTransfer = state.beakerLoaded ? FLUID_HEAT_TRANSFER_W_K * (state.plateTempC - state.fluidTempC) : 0;

    // Plate ODE
    const dPlateTemp = (heaterInputPower - plateLoss - fluidHeatTransfer) / PLATE_THERMAL_CAPACITY_J_K;
    state.plateTempC += dPlateTemp * dt;

    // Fluid ODE
    if (state.beakerLoaded) {
      const fluidLoss = 1.2 * (state.fluidTempC - AMBIENT_TEMP_C);
      const fluidMass = 0.15; // 150 mL
      const dFluidTemp = (fluidHeatTransfer - fluidLoss) / (fluidMass * solvent.cp * 0.001);
      state.fluidTempC += dFluidTemp * dt;
      // Cap at boiling point
      if (state.fluidTempC > solvent.bp) state.fluidTempC = solvent.bp;
    }

    // Relay clicking simulation
    const shouldEngage = duty > 0.15;
    if (shouldEngage !== state.relayEngaged) {
      state.relayEngaged = shouldEngage;
      playRelayClick(shouldEngage);
    }
  } else {
    // Passive Newton cooling
    const plateLoss = PLATE_CONVECTIVE_LOSS_W_K * (state.plateTempC - AMBIENT_TEMP_C);
    state.plateTempC -= (plateLoss / PLATE_THERMAL_CAPACITY_J_K) * dt * 0.7;

    if (state.beakerLoaded) {
      const fluidLoss = 0.8 * (state.fluidTempC - AMBIENT_TEMP_C);
      state.fluidTempC -= fluidLoss * dt * 0.5;
    }
    state.heaterDutyCycle = 0;
  }

  // Update plate glow
  twin3d.setPlateThermalGlow(state.plateTempC);

  // Update UI Topbar Status Pill
  updateStatusPill();
}

function updateStatusPill() {
  if (!state.powerOn) {
    statusPill.className = 'pill';
    statusPill.textContent = state.plateTempC > 50 ? 'HOT! STANDBY' : 'STANDBY';
    statusDetail.textContent = state.plateTempC > 50 ? 'Warning: Residual hot surface (>50°C)' : 'Instrument switched off';
  } else if (state.plateTempC >= state.safeTempC) {
    statusPill.className = 'pill fault';
    statusPill.textContent = 'E01 OVERTEMP';
    statusDetail.textContent = `Safety circuit tripped (${state.safeTempC}°C cutoff)`;
  } else if (state.heatingActive && state.stirringActive) {
    statusPill.className = 'pill run';
    statusPill.textContent = 'HEAT & STIR';
    statusDetail.textContent = `Target: ${state.setTempC}°C @ ${state.setRPM} RPM`;
  } else if (state.heatingActive) {
    statusPill.className = 'pill run';
    statusPill.textContent = 'HEATING';
    statusDetail.textContent = `Target: ${state.setTempC}°C (Actual: ${state.plateTempC.toFixed(1)}°C)`;
  } else if (state.stirringActive) {
    statusPill.className = 'pill run';
    statusPill.textContent = 'STIRRING';
    statusDetail.textContent = `Speed: ${Math.round(state.currentRPM)} RPM`;
  } else {
    statusPill.className = 'pill';
    statusPill.textContent = state.plateTempC > 50 ? 'HOT! READY' : 'READY';
    statusDetail.textContent = 'Controls active; idle';
  }
}

// ---------------------------------------------------------------------------
// 3D Scene Initialization
// ---------------------------------------------------------------------------
function init3D() {
  const w = viewportEl.clientWidth || window.innerWidth;
  const h = viewportEl.clientHeight || window.innerHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c1016);
  scene.fog = new THREE.Fog(0x0c1016, 12, 35);

  camera = new THREE.PerspectiveCamera(40, w / h, 0.05, 50);
  camera.position.set(0.0, BENCH.sy + 2.4, 3.8);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  viewportEl.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, BENCH.sy + 0.65, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going below tabletop

  // Lighting
  ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xfff8f0, 1.2);
  dirLight.position.set(3, BENCH.sy + 8, 4);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 25;
  dirLight.shadow.bias = -0.0001;
  scene.add(dirLight);

  fillLight = new THREE.DirectionalLight(0x93c5fd, 0.45);
  fillLight.position.set(-4, BENCH.sy + 4, -3);
  scene.add(fillLight);

  // Laboratory Room
  buildLabRoom(scene);

  // Hotplate 3D Model seated squarely on tabletop (Y = 9.000)
  twin3d = createHotplateModel();
  twin3d.root.position.set(0, BENCH.sy, 0);
  twin3d.setLcdTexture(lcdTexture);
  scene.add(twin3d.root);

  // Raycaster for 3D interactions
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener('resize', onResize);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
}

function onResize() {
  const w = viewportEl.clientWidth;
  const h = viewportEl.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function onPointerDown(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(twin3d.root.children, true);

  if (intersects.length > 0) {
    let obj = intersects[0].object;
    while (obj && obj !== twin3d.root) {
      if (obj.name === 'Pivot_KnobTemp') {
        toggleHeating();
        playEncoderClick();
        return;
      }
      if (obj.name === 'Pivot_KnobSpeed') {
        toggleStirring();
        playEncoderClick();
        return;
      }
      if (obj.name === 'Btn_Power') {
        togglePower();
        return;
      }
      if (obj.name === 'Glass_Beaker') {
        toggleBeaker();
        return;
      }
      if (obj.name === 'Probe_PT1000' || obj.name === 'Clamp_BossHead') {
        toggleProbe();
        return;
      }
      obj = obj.parent;
    }
  }
}

// ---------------------------------------------------------------------------
// User Action Handlers
// ---------------------------------------------------------------------------
export function togglePower() {
  state.powerOn = !state.powerOn;
  twin3d.setPowerSwitch(state.powerOn);
  playRelayClick(state.powerOn);
  updateUI();
}

export function toggleHeating() {
  if (!state.powerOn) return;
  state.heatingActive = !state.heatingActive;
  playRelayClick(state.heatingActive);
  updateUI();
}

export function toggleStirring() {
  if (!state.powerOn) return;
  state.stirringActive = !state.stirringActive;
  playEncoderClick();
  updateUI();
}

export function toggleBeaker() {
  state.beakerLoaded = !state.beakerLoaded;
  twin3d.setBeakerLoaded(state.beakerLoaded);
  playGlassClink();
  updateUI();
}

export function toggleProbe() {
  state.probeDipped = !state.probeDipped;
  twin3d.setProbeDipped(state.probeDipped);
  playEncoderClick();
  updateUI();
}

export function setTempSetpoint(temp) {
  state.setTempC = Math.max(20, Math.min(MAX_TEMP_C, temp));
  twin3d.setTempKnobRotation(((state.setTempC - 20) / (MAX_TEMP_C - 20)) * Math.PI * 1.5);
  playEncoderClick();
  updateUI();
}

export function setStirSetpoint(rpm) {
  state.setRPM = Math.max(0, Math.min(MAX_RPM, rpm));
  twin3d.setSpeedKnobRotation((state.setRPM / MAX_RPM) * Math.PI * 1.5);
  playEncoderClick();
  updateUI();
}

export function setSolvent(key) {
  if (SOLVENTS[key]) {
    state.solventKey = key;
    updateUI();
  }
}

// ---------------------------------------------------------------------------
// HTML UI Synchronizer
// ---------------------------------------------------------------------------
function updateUI() {
  const btnHeat = document.getElementById('btn-heat-toggle');
  const btnStir = document.getElementById('btn-stir-toggle');
  const btnPower = document.getElementById('btn-power-toggle');
  const btnBeaker = document.getElementById('btn-beaker-toggle');
  const btnProbe = document.getElementById('btn-probe-toggle');

  if (btnHeat) btnHeat.textContent = state.heatingActive ? 'HEATER: ON' : 'HEATER: OFF';
  if (btnHeat) btnHeat.classList.toggle('active', state.heatingActive);

  if (btnStir) btnStir.textContent = state.stirringActive ? 'STIRRER: ON' : 'STIRRER: OFF';
  if (btnStir) btnStir.classList.toggle('active', state.stirringActive);

  if (btnPower) btnPower.textContent = state.powerOn ? 'POWER: ON' : 'POWER: STANDBY';
  if (btnBeaker) btnBeaker.textContent = state.beakerLoaded ? 'Unload Beaker' : 'Place Beaker';
  if (btnProbe) btnProbe.textContent = state.probeDipped ? 'Raise PT1000 Probe' : 'Lower PT1000 Probe';

  const tempSlider = document.getElementById('slider-temp');
  const tempVal = document.getElementById('val-temp');
  if (tempSlider) tempSlider.value = state.setTempC;
  if (tempVal) tempVal.textContent = `${state.setTempC}°C`;

  const rpmSlider = document.getElementById('slider-rpm');
  const rpmVal = document.getElementById('val-rpm');
  if (rpmSlider) rpmSlider.value = state.setRPM;
  if (rpmVal) rpmVal.textContent = `${state.setRPM} RPM`;
}

// ---------------------------------------------------------------------------
// Continuous / Guided Classroom Demonstration
// ---------------------------------------------------------------------------
let demoStep = 0;
let demoTimer = 0;

export function runDemoWorkflow() {
  state.demoRunning = true;
  demoStep = 1;
  demoTimer = 0;
  state.powerOn = true;
  twin3d.setPowerSwitch(true);
  updateUI();
}

function processDemo(dt) {
  if (!state.demoRunning) return;
  demoTimer += dt;

  if (demoStep === 1) {
    // Step 1: Place beaker, lower probe
    state.beakerLoaded = true;
    twin3d.setBeakerLoaded(true);
    state.probeDipped = true;
    twin3d.setProbeDipped(true);
    setTempSetpoint(65);
    setStirSetpoint(350);
    if (demoTimer > 1.5) {
      demoStep = 2;
      demoTimer = 0;
      toggleHeating();
    }
  } else if (demoStep === 2) {
    // Step 2: Engage heat
    if (demoTimer > 1.2) {
      demoStep = 3;
      demoTimer = 0;
      toggleStirring();
    }
  } else if (demoStep === 3) {
    // Step 3: Ramp stir speed to create dynamic vortex
    if (demoTimer > 4.0) {
      setStirSetpoint(750);
      demoStep = 4;
      demoTimer = 0;
    }
  } else if (demoStep === 4) {
    if (demoTimer > 6.0) {
      state.demoRunning = false;
    }
  }
}

// ---------------------------------------------------------------------------
// Render Animation Loop
// ---------------------------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);

  const dt = 0.016;
  updatePhysics();
  renderLCD();
  processDemo(dt);

  if (state.autoRotate) {
    twin3d.root.rotation.y += 0.008 * state.orbitSpeed;
  }

  controls.update();
  renderer.render(scene, camera);
}

// ---------------------------------------------------------------------------
// DOM Event Listeners & Binding
// ---------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  init3D();
  animate();

  // Control Buttons
  document.getElementById('btn-heat-toggle')?.addEventListener('click', toggleHeating);
  document.getElementById('btn-stir-toggle')?.addEventListener('click', toggleStirring);
  document.getElementById('btn-power-toggle')?.addEventListener('click', togglePower);
  document.getElementById('btn-beaker-toggle')?.addEventListener('click', toggleBeaker);
  document.getElementById('btn-probe-toggle')?.addEventListener('click', toggleProbe);
  document.getElementById('btn-demo')?.addEventListener('click', runDemoWorkflow);

  // Sliders
  document.getElementById('slider-temp')?.addEventListener('input', (e) => {
    setTempSetpoint(parseFloat(e.target.value));
  });
  document.getElementById('slider-rpm')?.addEventListener('input', (e) => {
    setStirSetpoint(parseInt(e.target.value, 10));
  });

  // Solvent Picker
  document.getElementById('select-solvent')?.addEventListener('change', (e) => {
    setSolvent(e.target.value);
  });

  // Stage View Toolbar
  document.getElementById('btn-explode')?.addEventListener('click', () => {
    state.exploded = state.exploded > 0.05 ? 0.0 : 1.0;
    twin3d.setExplodeAmount(state.exploded);
    document.getElementById('btn-explode').classList.toggle('active', state.exploded > 0.05);
  });

  document.getElementById('btn-wireframe')?.addEventListener('click', () => {
    state.wireframe = !state.wireframe;
    twin3d.setWireframe(state.wireframe);
    document.getElementById('btn-wireframe').classList.toggle('active', state.wireframe);
  });

  document.getElementById('btn-auto-rotate')?.addEventListener('click', () => {
    state.autoRotate = !state.autoRotate;
    document.getElementById('btn-auto-rotate').classList.toggle('active', state.autoRotate);
  });

  document.getElementById('orbit-speed')?.addEventListener('input', (e) => {
    state.orbitSpeed = parseFloat(e.target.value);
    document.getElementById('orbit-speed-val').textContent = `${state.orbitSpeed.toFixed(1)}×`;
  });

  document.getElementById('camera-zoom')?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    camera.position.z = 2.0 + (100 - val) * 0.035;
    document.getElementById('camera-zoom-val').textContent = `${val}%`;
  });

  document.getElementById('lab-light')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    dirLight.intensity = 1.2 * val;
    ambientLight.intensity = 0.55 * val;
    document.getElementById('lab-light-val').textContent = `${val.toFixed(1)}×`;
  });

  document.getElementById('btn-sfx-mute')?.addEventListener('click', () => {
    const muted = !isSfxMuted();
    setSfxMuted(muted);
    const btn = document.getElementById('btn-sfx-mute');
    btn.textContent = muted ? 'Unmute SFX' : 'Mute SFX';
    btn.classList.toggle('active', muted);
  });

  // Collapsible panels
  document.querySelectorAll('.panel-collapse-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.panel-collapsible');
      if (panel) {
        panel.classList.toggle('collapsed');
        btn.textContent = panel.classList.contains('collapsed') ? '▸' : '▾';
      }
    });
  });

  updateUI();
});
