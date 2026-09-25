/**
 * SREdesigns THERMO-1200 Muffle Furnace App Controller (app.js)
 * Full state engine, dynamic Eurotherm Canvas LCD renderer, Stefan-Boltzmann thermal physics,
 * 4-bar parallel lift door kinematics, sound synthesis, and calcination workflows.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  createMuffleFurnaceModel,
  setDoorOpen,
  setChamberTemperature,
  setCrucibleInChamber,
  setLcdTexture,
  setExplodeAmount,
  setWireframe,
  buildLabRoom,
  BENCH,
  CAM_ISO,
  CAM_FRONT,
  CAM_SIDE,
  CAM_TOP,
} from './muffle_furnace3d.js?v=20260925-gold1';
import { sfx } from './sfx.js?v=20260925-gold1';

// ---------------------------------------------------------------------------
// Thermal & Operational Profiles Database
// ---------------------------------------------------------------------------
const PROFILES = {
  copperOxide: {
    id: 'copperOxide',
    label: "Dalton's Copper(II) Oxide Calcination (850°C)",
    targetTemp: 850.0,
    rampRate: 15.0,
    soakMin: 45.0,
    desc: 'Thermal decomposition of copper(II) carbonate basic Cu2CO3(OH)2 to CuO black powder',
  },
  sintering: {
    id: 'sintering',
    label: 'Zirconia Ceramic Sintering (1150°C)',
    targetTemp: 1150.0,
    rampRate: 10.0,
    soakMin: 60.0,
    desc: 'Solid-state diffusion and grain boundary densification of dental ceramic crowns',
  },
  ashContent: {
    id: 'ashContent',
    label: 'Standard Biomass Ash Analysis (575°C)',
    targetTemp: 575.0,
    rampRate: 20.0,
    soakMin: 30.0,
    desc: 'Complete combustion of organic volatile matter leaving inorganic oxide ash residue',
  },
  custom: {
    id: 'custom',
    label: 'Manual User Program',
    targetTemp: 800.0,
    rampRate: 10.0,
    soakMin: 30.0,
    desc: 'Custom operator-defined thermal ramp & soak profile',
  },
};

// ---------------------------------------------------------------------------
// State Machine Engine
// ---------------------------------------------------------------------------
const state = {
  power: true,
  running: false,
  status: 'IDLE', // 'IDLE', 'HEATING', 'SOAKING', 'COOLING', 'FAULT_DOOR_OPEN', 'FAULT_OVERTEMP'

  // Temperatures & Trajectory
  currentPV: 22.0,      // Actual Process Variable (°C)
  setpointSV: 800.0,    // Target Setpoint (°C)
  rampSV: 22.0,         // Current dynamic ramp trajectory (°C)
  rampRate: 15.0,       // °C / minute
  soakTimeMin: 30.0,    // Minutes
  remainingSoakSec: 0,  // Seconds
  heatingPowerPct: 0.0, // 0 to 100%

  // Kinematics & Physical Accessories
  doorOpenRatio: 0.0,
  targetDoorOpenRatio: 0.0,
  crucibleLoaded: true,
  damperOpen: false,

  // Selected Profile
  currentProfile: PROFILES.copperOxide,

  // Demo sequence
  demoRunning: false,
  demoTimer: 0,

  // Visual Controls
  exploded: false,
  explodeAmount: 0.0,
  wireframe: false,
  autoRotate: false,
  orbitSpeed: 1.0,
};

// ---------------------------------------------------------------------------
// 3D Scene Architecture
// ---------------------------------------------------------------------------
let scene, camera, renderer, controls;
let viewportEl;
let furnaceModel;
let ambientLight, dirLight, fillLight;
let raycaster, mouse;
let clock;

// Off-screen Eurotherm LCD Canvas & Texture
let lcdCanvas, lcdCtx, lcdTexture;

function initLCD() {
  lcdCanvas = document.createElement('canvas');
  lcdCanvas.width = 512;
  lcdCanvas.height = 256;
  lcdCtx = lcdCanvas.getContext('2d');

  lcdTexture = new THREE.CanvasTexture(lcdCanvas);
  lcdTexture.flipY = false; // Strictly prevents inverted text
  lcdTexture.colorSpace = THREE.SRGBColorSpace;
  lcdTexture.minFilter = THREE.LinearFilter;
  lcdTexture.magFilter = THREE.LinearFilter;

  setLcdTexture(lcdTexture);
}

function updateLCD() {
  if (!lcdCtx) return;
  const w = lcdCanvas.width;
  const h = lcdCanvas.height;

  // Background
  if (!state.power) {
    lcdCtx.fillStyle = '#05070a';
    lcdCtx.fillRect(0, 0, w, h);
    lcdTexture.needsUpdate = true;
    return;
  }

  // Eurotherm 3216 Bezel Faceplate
  lcdCtx.fillStyle = '#0f172a';
  lcdCtx.fillRect(0, 0, w, h);

  // Status Annunciator LED bar at top
  lcdCtx.fillStyle = '#1e293b';
  lcdCtx.fillRect(16, 12, w - 32, 32);

  // Annunciator 1: OP1 (Heating Output Active)
  const op1Active = state.heatingPowerPct > 0.5 && state.running;
  lcdCtx.fillStyle = op1Active ? '#22c55e' : '#334155';
  lcdCtx.font = 'bold 16px monospace';
  lcdCtx.fillText('OP1', 28, 34);

  // Annunciator 2: RUN (Program Active)
  lcdCtx.fillStyle = state.running ? '#38bdf8' : '#334155';
  lcdCtx.fillText('RUN', 90, 34);

  // Annunciator 3: SOAK
  lcdCtx.fillStyle = state.status === 'SOAKING' ? '#fbbf24' : '#334155';
  lcdCtx.fillText('SOAK', 155, 34);

  // Annunciator 4: ALARM (Door Open or Overtemp)
  const isAlarm = state.status.startsWith('FAULT');
  lcdCtx.fillStyle = isAlarm ? '#ef4444' : '#334155';
  lcdCtx.fillText('ALM', 235, 34);

  // Brand on top right
  lcdCtx.fillStyle = '#64748b';
  lcdCtx.font = '600 14px sans-serif';
  lcdCtx.textAlign = 'right';
  lcdCtx.fillText('EUROTHERM 3216', w - 24, 33);
  lcdCtx.textAlign = 'left';

  // Upper Display: Process Variable (PV) - 7-Segment High-Intensity Green
  lcdCtx.fillStyle = '#022c22';
  lcdCtx.fillRect(16, 52, w - 32, 92);

  if (isAlarm) {
    lcdCtx.fillStyle = '#ef4444';
    lcdCtx.font = '700 58px monospace';
    const errMsg = state.status === 'FAULT_DOOR_OPEN' ? 'dOOr' : 'AL.01';
    lcdCtx.fillText(errMsg, 36, 120);
  } else {
    lcdCtx.fillStyle = '#4ade80'; // Brilliant green LED
    lcdCtx.font = '700 78px monospace';
    const pvStr = Math.round(state.currentPV).toString().padStart(4, ' ');
    lcdCtx.fillText(pvStr, 36, 126);

    lcdCtx.font = '600 28px monospace';
    lcdCtx.fillText('°C', w - 75, 95);
  }

  // Lower Display: Setpoint (SP) - 7-Segment Amber
  lcdCtx.fillStyle = '#1c1917';
  lcdCtx.fillRect(16, 152, w - 32, 80);

  lcdCtx.fillStyle = '#fbbf24'; // Amber LED
  lcdCtx.font = '700 64px monospace';
  const spStr = Math.round(state.setpointSV).toString().padStart(4, ' ');
  lcdCtx.fillText(spStr, 36, 214);

  lcdCtx.font = '500 22px monospace';
  if (state.status === 'SOAKING') {
    const minRem = Math.ceil(state.remainingSoakSec / 60);
    lcdCtx.fillText(`T:${minRem}m`, w - 125, 205);
  } else if (state.running) {
    lcdCtx.fillText(`P:${Math.round(state.heatingPowerPct)}%`, w - 125, 205);
  } else {
    lcdCtx.fillText('SP', w - 75, 205);
  }

  lcdTexture.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Thermal Physics & Stefan-Boltzmann Radiative Dynamics
// ---------------------------------------------------------------------------
function calculateThermalPhysics() {
  if (!state.power) {
    // Natural ambient cooling
    if (state.currentPV > 22.0) {
      state.currentPV = Math.max(22.0, state.currentPV - 0.25 * clock.getDelta());
    }
    setChamberTemperature(state.currentPV);
    return;
  }

  const dt = Math.min(0.1, clock.getDelta());

  // 1. Door Open Safety Interlock
  if (state.doorOpenRatio > 0.05 && state.running) {
    state.running = false;
    state.status = 'FAULT_DOOR_OPEN';
    state.heatingPowerPct = 0.0;
    sfx.stopHeatingHum();
    sfx.playAlarmBuzzer();
    updateStatusPill('DOOR OPEN', 'Door interlock tripped; power cut', 'fault');
  }

  // 2. Firing Cycle Execution
  if (state.running && state.doorOpenRatio <= 0.05) {
    if (state.status === 'HEATING') {
      // Dynamic ramp progression
      const rampPerSec = state.rampRate / 60.0;
      if (state.rampSV < state.setpointSV) {
        state.rampSV = Math.min(state.setpointSV, state.rampSV + rampPerSec * dt);
      }

      // PID thermal power calculation
      const err = state.rampSV - state.currentPV;
      const feedforward = (state.rampRate / 30.0) * 45.0;
      state.heatingPowerPct = Math.max(0.0, Math.min(100.0, 18.0 * err + feedforward));

      // Transition to Soak
      if (state.currentPV >= state.setpointSV - 2.0) {
        state.status = 'SOAKING';
        state.remainingSoakSec = state.soakTimeMin * 60;
        updateStatusPill('SOAKING', `Holding at ${state.setpointSV}°C`, 'run');
      }
    } else if (state.status === 'SOAKING') {
      state.rampSV = state.setpointSV;
      const err = state.setpointSV - state.currentPV;
      const radBase = Math.min(45.0, Math.pow(state.setpointSV / 1200.0, 3) * 40.0);
      state.heatingPowerPct = Math.max(0.0, Math.min(100.0, 18.0 * err + radBase));

      state.remainingSoakSec -= dt;
      if (state.remainingSoakSec <= 0) {
        state.status = 'COOLING';
        state.running = false;
        state.heatingPowerPct = 0.0;
        sfx.stopHeatingHum();
        sfx.playContactorClack();
        updateStatusPill('COOLING', 'Soak cycle finished; cooling down', 'run');
      }
    }
  }

  // 3. Solve Net Thermal Power
  const pElec = (state.heatingPowerPct / 100.0) * 3000.0; // 3 kW elements
  const tChamberK = state.currentPV + 273.15;
  const tAmbK = 22.0 + 273.15;

  // Stefan-Boltzmann radiation
  const pRadiation = 0.88 * 5.67e-8 * 0.38 * (Math.pow(tChamberK, 4) - Math.pow(tAmbK, 4));

  // Convective cooling rush if door is open
  const coolingMultiplier = state.doorOpenRatio > 0.05 ? 12.0 : (state.damperOpen ? 3.0 : 1.0);
  const pConvective = 8.5 * coolingMultiplier * (state.currentPV - 22.0);

  const pNet = pElec - pRadiation - pConvective;
  const deltaTemp = (pNet / 6000.0) * dt;

  state.currentPV = Math.max(22.0, state.currentPV + deltaTemp);

  // Over-temperature limit
  if (state.currentPV > 1220.0 && state.status !== 'FAULT_OVERTEMP') {
    state.status = 'FAULT_OVERTEMP';
    state.running = false;
    state.heatingPowerPct = 0.0;
    sfx.stopHeatingHum();
    sfx.playAlarmBuzzer();
    updateStatusPill('OVERTEMP', 'Chamber limit 1200°C exceeded; power cut', 'fault');
  }

  // Update dynamic chamber glow and light
  setChamberTemperature(state.currentPV);
}

// ---------------------------------------------------------------------------
// 3D Scene Initialization
// ---------------------------------------------------------------------------
function init3D() {
  viewportEl = document.getElementById('viewport3d');
  const w = viewportEl.clientWidth || window.innerWidth;
  const h = viewportEl.clientHeight || window.innerHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c1017);
  scene.fog = new THREE.Fog(0x0c1017, 20, 65);

  camera = new THREE.PerspectiveCamera(40, w / h, 0.05, 100);
  camera.position.copy(CAM_ISO.position);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.10;
  viewportEl.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(CAM_ISO.target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.02;
  controls.minDistance = 1.2;
  controls.maxDistance = 18.0;

  // Photorealistic Lab Lighting
  ambientLight = new THREE.AmbientLight(0xdbeafe, 0.55);
  scene.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xfffbf0, 1.4);
  dirLight.position.set(4.0, 16.0, -5.0);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.setScalar(2048);
  dirLight.shadow.bias = -0.0001;
  scene.add(dirLight);

  fillLight = new THREE.DirectionalLight(0x93c5fd, 0.65);
  fillLight.position.set(-6.0, 12.0, 4.0);
  scene.add(fillLight);

  // Build lab room and epoxy workbench
  const labRoot = new THREE.Group();
  scene.add(labRoot);
  buildLabRoom(labRoot);

  // Build Muffle Furnace Model
  furnaceModel = createMuffleFurnaceModel();
  furnaceModel.position.set(0, BENCH.surfaceY, 0);
  scene.add(furnaceModel);

  // Initialize Dynamic Canvas LCD
  initLCD();

  clock = new THREE.Clock();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener('resize', onResize);
  renderer.domElement.addEventListener('click', onSceneClick);
}

function onResize() {
  const w = viewportEl.clientWidth || window.innerWidth;
  const h = viewportEl.clientHeight || window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function onSceneClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(furnaceModel.children, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    handlePartInteraction(hit.name);
  }
}

function handlePartInteraction(partName) {
  if (!partName) return;

  if (partName.includes('DoorHandle') || partName.includes('DoorOuterPanel')) {
    toggleDoor();
  } else if (partName.includes('Btn_RunStop')) {
    toggleRun();
  } else if (partName.includes('Btn_MainsSwitch')) {
    togglePower();
  } else if (partName.includes('Crucible')) {
    toggleCrucible();
  } else if (partName.includes('Damper')) {
    toggleDamper();
  } else if (partName.includes('Btn_Up')) {
    adjustTemp(25.0);
  } else if (partName.includes('Btn_Down')) {
    adjustTemp(-25.0);
  }
}

// ---------------------------------------------------------------------------
// Action Handlers
// ---------------------------------------------------------------------------
function updateStatusPill(label, detail, cls = 'run') {
  const pill = document.getElementById('status-pill');
  const det = document.getElementById('status-detail');
  if (pill) {
    pill.textContent = label;
    pill.className = `pill ${cls}`;
  }
  if (det) det.textContent = detail;
}

function togglePower() {
  state.power = !state.power;
  sfx.playTouchBeep(state.power ? 880 : 380, 0.08);
  const btn = document.getElementById('btn-power');
  if (btn) btn.textContent = state.power ? 'MAINS: ON' : 'MAINS: OFF';
  if (!state.power) {
    state.running = false;
    sfx.stopHeatingHum();
    updateStatusPill('OFFLINE', 'Mains power disconnected', 'muted');
  } else {
    updateStatusPill('IDLE', 'Furnace ready in standby mode', 'run');
  }
}

function toggleDoor() {
  state.targetDoorOpenRatio = state.targetDoorOpenRatio > 0.5 ? 0.0 : 1.0;
  sfx.playDoorGlide(0.45);
  const btn = document.getElementById('btn-door');
  if (btn) btn.textContent = state.targetDoorOpenRatio > 0.5 ? 'DOOR: OPEN' : 'DOOR: SEALED';

  if (state.targetDoorOpenRatio > 0.5 && state.running) {
    sfx.playContactorClack();
  }
}

function toggleRun() {
  if (!state.power) return;
  sfx.playTouchBeep(1046, 0.05);

  if (state.running) {
    // Stop running
    state.running = false;
    state.status = 'IDLE';
    state.heatingPowerPct = 0.0;
    sfx.stopHeatingHum();
    sfx.playContactorClack();
    const btn = document.getElementById('btn-run');
    if (btn) btn.textContent = 'RUN: OFF';
    updateStatusPill('IDLE', 'Program paused; heaters off', 'run');
  } else {
    // Start running
    if (state.doorOpenRatio > 0.05) {
      sfx.playAlarmBuzzer();
      updateStatusPill('FAULT', 'Close and seal door before starting run', 'fault');
      return;
    }

    state.running = true;
    state.status = 'HEATING';
    state.rampSV = state.currentPV;
    sfx.playContactorClack();
    sfx.startHeatingHum();

    const btn = document.getElementById('btn-run');
    if (btn) btn.textContent = 'RUN: ACTIVE';
    updateStatusPill('HEATING', `Ramping to ${state.setpointSV}°C at ${state.rampRate}°C/min`, 'run');
  }
}

function adjustTemp(delta) {
  state.setpointSV = Math.max(20.0, Math.min(1200.0, state.setpointSV + delta));
  sfx.playTouchBeep(780, 0.04);
  const slider = document.getElementById('slider-temp');
  if (slider) slider.value = state.setpointSV;
  const valEl = document.getElementById('val-temp');
  if (valEl) valEl.textContent = `${Math.round(state.setpointSV)}°C`;
}

function toggleCrucible() {
  state.crucibleLoaded = !state.crucibleLoaded;
  setCrucibleInChamber(state.crucibleLoaded);
  sfx.playCrucibleClink();
  const btn = document.getElementById('btn-crucible');
  if (btn) btn.textContent = state.crucibleLoaded ? 'CRUCIBLE: IN CHAMBER' : 'CRUCIBLE: EXTRACTED';
}

function toggleDamper() {
  state.damperOpen = !state.damperOpen;
  sfx.playTouchBeep(650, 0.04);
  const btn = document.getElementById('btn-damper');
  if (btn) btn.textContent = state.damperOpen ? 'DAMPER: OPEN' : 'DAMPER: CLOSED';
}

function selectProfile(profKey) {
  if (!PROFILES[profKey]) return;
  state.currentProfile = PROFILES[profKey];
  state.setpointSV = state.currentProfile.targetTemp;
  state.rampRate = state.currentProfile.rampRate;
  state.soakTimeMin = state.currentProfile.soakMin;

  const sliderTemp = document.getElementById('slider-temp');
  if (sliderTemp) sliderTemp.value = state.setpointSV;
  const valTemp = document.getElementById('val-temp');
  if (valTemp) valTemp.textContent = `${Math.round(state.setpointSV)}°C`;

  const sliderRamp = document.getElementById('slider-ramp');
  if (sliderRamp) sliderRamp.value = state.rampRate;
  const valRamp = document.getElementById('val-ramp');
  if (valRamp) valRamp.textContent = `${Math.round(state.rampRate)}°C/min`;

  sfx.playTouchBeep(920, 0.04);
  updateStatusPill('LOADED', state.currentProfile.label, 'run');
}

function runClassroomDemo() {
  if (state.demoRunning) return;
  state.demoRunning = true;
  updateStatusPill('DEMO', 'Running automated Dalton Copper Oxide calcination demo', 'run');

  // Step 1: Open door
  state.targetDoorOpenRatio = 1.0;
  sfx.playDoorGlide(0.45);

  setTimeout(() => {
    // Step 2: Load crucible into chamber
    state.crucibleLoaded = true;
    setCrucibleInChamber(true);
    sfx.playCrucibleClink();

    setTimeout(() => {
      // Step 3: Seal door
      state.targetDoorOpenRatio = 0.0;
      sfx.playDoorGlide(0.45);

      setTimeout(() => {
        // Step 4: Configure Copper Oxide calcination (850°C) and start firing
        selectProfile('copperOxide');
        toggleRun();

        // Accelerate simulation for classroom visualization
        const simInterval = setInterval(() => {
          if (!state.demoRunning) {
            clearInterval(simInterval);
            return;
          }
          if (state.currentPV < 850.0) {
            state.currentPV += 35.0; // Fast-forward ramp
          } else {
            clearInterval(simInterval);
            state.demoRunning = false;
            updateStatusPill('READY', 'Demo complete! Chamber heated to 850°C glowing orange-red', 'run');
          }
        }, 120);
      }, 1400);
    }, 1200);
  }, 1000);
}

// ---------------------------------------------------------------------------
// UI & Control Event Wiring
// ---------------------------------------------------------------------------
function initUI() {
  // Toolbar buttons
  document.getElementById('btn-cam-iso')?.addEventListener('click', () => setCamView(CAM_ISO));
  document.getElementById('btn-cam-front')?.addEventListener('click', () => setCamView(CAM_FRONT));
  document.getElementById('btn-cam-side')?.addEventListener('click', () => setCamView(CAM_SIDE));
  document.getElementById('btn-cam-top')?.addEventListener('click', () => setCamView(CAM_TOP));

  document.getElementById('btn-auto-rotate')?.addEventListener('click', (e) => {
    state.autoRotate = !state.autoRotate;
    e.target.classList.toggle('active', state.autoRotate);
  });

  document.getElementById('orbit-speed')?.addEventListener('input', (e) => {
    state.orbitSpeed = parseFloat(e.target.value);
    const valEl = document.getElementById('orbit-speed-val');
    if (valEl) valEl.textContent = `${state.orbitSpeed.toFixed(1)}×`;
  });

  document.getElementById('btn-wireframe')?.addEventListener('click', (e) => {
    state.wireframe = !state.wireframe;
    setWireframe(state.wireframe);
    e.target.classList.toggle('active', state.wireframe);
  });

  document.getElementById('btn-explode')?.addEventListener('click', (e) => {
    state.exploded = !state.exploded;
    state.explodeAmount = state.exploded ? 1.0 : 0.0;
    setExplodeAmount(state.explodeAmount);
    e.target.classList.toggle('active', state.exploded);
  });

  document.getElementById('btn-sfx-mute')?.addEventListener('click', (e) => {
    sfx.setMuted(!sfx.isMuted());
    e.target.textContent = sfx.isMuted() ? 'Unmute SFX' : 'Mute SFX';
  });

  // Sidebar Controls
  document.getElementById('btn-run')?.addEventListener('click', toggleRun);
  document.getElementById('btn-door')?.addEventListener('click', toggleDoor);
  document.getElementById('btn-power')?.addEventListener('click', togglePower);
  document.getElementById('btn-crucible')?.addEventListener('click', toggleCrucible);
  document.getElementById('btn-damper')?.addEventListener('click', toggleDamper);
  document.getElementById('btn-demo')?.addEventListener('click', runClassroomDemo);

  document.getElementById('select-profile')?.addEventListener('change', (e) => {
    selectProfile(e.target.value);
  });

  document.getElementById('slider-temp')?.addEventListener('input', (e) => {
    state.setpointSV = parseFloat(e.target.value);
    const valEl = document.getElementById('val-temp');
    if (valEl) valEl.textContent = `${Math.round(state.setpointSV)}°C`;
  });

  document.getElementById('slider-ramp')?.addEventListener('input', (e) => {
    state.rampRate = parseFloat(e.target.value);
    const valEl = document.getElementById('val-ramp');
    if (valEl) valEl.textContent = `${Math.round(state.rampRate)}°C/min`;
  });

  document.getElementById('slider-soak')?.addEventListener('input', (e) => {
    state.soakTimeMin = parseFloat(e.target.value);
    const valEl = document.getElementById('val-soak');
    if (valEl) valEl.textContent = `${Math.round(state.soakTimeMin)} min`;
  });

  // Collapsible panels
  document.querySelectorAll('.panel-collapse-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.panel-collapsible');
      if (panel) {
        panel.classList.toggle('collapsed');
        btn.setAttribute('aria-expanded', !panel.classList.contains('collapsed'));
      }
    });
  });
}

function setCamView(preset) {
  sfx.playTouchBeep(980, 0.03);
  controls.target.copy(preset.target);
  camera.position.copy(preset.position);
}

// ---------------------------------------------------------------------------
// Animation Loop
// ---------------------------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);

  // Smooth Door Kinematics Interpolation
  if (Math.abs(state.doorOpenRatio - state.targetDoorOpenRatio) > 0.005) {
    state.doorOpenRatio += (state.targetDoorOpenRatio - state.doorOpenRatio) * 0.12;
    setDoorOpen(state.doorOpenRatio);
  }

  // Physics calculation
  calculateThermalPhysics();

  // Dynamic LCD Canvas redraw
  updateLCD();

  // Orbit controls & auto rotation
  if (state.autoRotate) {
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.8 * state.orbitSpeed;
  } else {
    controls.autoRotate = false;
  }
  controls.update();

  renderer.render(scene, camera);
}

// Start application
init3D();
initUI();
animate();
