/**
 * SREdesigns THERMO-1200 Muffle Furnace App Controller (app.js)
 * Full state engine, dynamic Eurotherm Canvas LCD renderer, Stefan-Boltzmann thermal physics,
 * 4-bar parallel lift door kinematics, sound synthesis, Part Explorer, and interactive touchscreen.
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
  setMainsSwitchRotation,
  animateButtonDepress,
  focusPart,
  clearPartFocus,
  buildLabRoom,
  BENCH,
  CAM_ISO,
  CAM_FRONT,
  CAM_CONSOLE,
  CAM_SIDE,
  CAM_TOP,
  CAM_REAR,
  CAM_EXPLODED,
  PART_CATALOG,
} from './muffle_furnace3d.js?v=20261019-gold8';
import { sfx } from './sfx.js?v=20260925-gold1';
import { initChemMateTheme } from '../../../lab_viewer/shared/chemmate_theme_manager.js';

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
  isPluggedIn: true,    // Physical bench receptacle continuity
  power: true,          // Rotary mains disconnect switch
  running: false,
  status: 'IDLE',       // 'IDLE', 'HEATING', 'SOAKING', 'COOLING', 'FAULT_DOOR_OPEN', 'FAULT_OVERTEMP', 'OFFLINE'

  // Temperatures & Trajectory
  currentPV: 22.0,      // Actual Process Variable (°C)
  setpointSV: 850.0,    // Target Setpoint (°C)
  rampSV: 22.0,         // Current dynamic ramp trajectory (°C)
  rampRate: 15.0,       // °C / minute
  soakTimeMin: 45.0,    // Minutes
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

  // Visual Controls
  exploded: false,
  explodeAmount: 0.0,
  wireframe: false,
  autoRotate: false,
  orbitSpeed: 1.0,
  labLightIntensity: 1.0,

  // Part Explorer
  activePartId: null,
};

// ---------------------------------------------------------------------------
// 3D Scene Architecture
// ---------------------------------------------------------------------------
let scene, camera, renderer, controls;
let viewportEl;
let furnaceModel;
let ambientLight, dirLight, fillLight;
let plugGroupRef = null;
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
  lcdTexture.flipY = true; // Upright matching makeOperatorFacingQuadGeo
  lcdTexture.colorSpace = THREE.SRGBColorSpace;
  lcdTexture.minFilter = THREE.LinearFilter;
  lcdTexture.magFilter = THREE.LinearFilter;

  setLcdTexture(lcdTexture);
}

function updateLCD() {
  if (!lcdCtx) return;
  const w = lcdCanvas.width;
  const h = lcdCanvas.height;

  // Strict Physical Circuit Continuity: If unplugged or switch OFF -> Blackout
  const hasPower = state.isPluggedIn && state.power;
  if (!hasPower) {
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
  lcdCtx.fillRect(12, 10, w - 24, 30);

  // Annunciator 1: OP1 (Heating Output Active)
  const op1Active = state.heatingPowerPct > 0.5 && state.running;
  lcdCtx.fillStyle = op1Active ? '#22c55e' : '#334155';
  lcdCtx.font = 'bold 15px monospace';
  lcdCtx.fillText('OP1', 24, 31);

  // Annunciator 2: RUN (Program Active)
  lcdCtx.fillStyle = state.running ? '#38bdf8' : '#334155';
  lcdCtx.fillText('RUN', 80, 31);

  // Annunciator 3: SOAK
  lcdCtx.fillStyle = state.status === 'SOAKING' ? '#fbbf24' : '#334155';
  lcdCtx.fillText('SOAK', 140, 31);

  // Annunciator 4: ALARM (Door Open or Overtemp)
  const isAlarm = state.status.startsWith('FAULT');
  lcdCtx.fillStyle = isAlarm ? '#ef4444' : '#334155';
  lcdCtx.fillText('ALM', 210, 31);

  // Brand on top right
  lcdCtx.fillStyle = '#64748b';
  lcdCtx.font = '600 13px sans-serif';
  lcdCtx.textAlign = 'right';
  lcdCtx.fillText('EUROTHERM 3216', w - 20, 30);
  lcdCtx.textAlign = 'left';

  // Upper Display: Process Variable (PV) - 7-Segment High-Intensity Green
  lcdCtx.fillStyle = '#022c22';
  lcdCtx.fillRect(12, 46, w - 24, 88);

  if (isAlarm) {
    lcdCtx.fillStyle = '#ef4444';
    lcdCtx.font = '700 54px monospace';
    const errMsg = state.status === 'FAULT_DOOR_OPEN' ? 'dOOr' : 'AL.01';
    lcdCtx.fillText(errMsg, 30, 110);

    lcdCtx.font = '600 18px sans-serif';
    lcdCtx.fillStyle = '#f87171';
    lcdCtx.fillText('DOOR INTERLOCK OPEN', w - 240, 95);
  } else {
    lcdCtx.fillStyle = '#4ade80'; // Brilliant green LED
    lcdCtx.font = '700 74px monospace';
    const pvStr = Math.round(state.currentPV).toString().padStart(4, ' ');
    lcdCtx.fillText(pvStr, 30, 116);

    lcdCtx.font = '600 28px monospace';
    lcdCtx.fillText('°C', w - 70, 88);
  }

  // Lower Display: Setpoint (SP) - 7-Segment Amber
  lcdCtx.fillStyle = '#1c1917';
  lcdCtx.fillRect(12, 140, w - 24, 68);

  lcdCtx.fillStyle = '#fbbf24'; // Amber LED
  lcdCtx.font = '700 58px monospace';
  const spStr = Math.round(state.setpointSV).toString().padStart(4, ' ');
  lcdCtx.fillText(spStr, 30, 194);

  lcdCtx.font = '500 20px monospace';
  if (state.status === 'SOAKING') {
    const minRem = Math.ceil(state.remainingSoakSec / 60);
    lcdCtx.fillText(`T:${minRem}m`, w - 110, 185);
  } else if (state.running) {
    lcdCtx.fillText(`P:${Math.round(state.heatingPowerPct)}%`, w - 110, 185);
  } else {
    lcdCtx.fillText('SP', w - 60, 185);
  }

  // Bottom Touchscreen Interactive Softkey Bar (DIAG-015 / Interactive Touch)
  lcdCtx.fillStyle = '#111827';
  lcdCtx.fillRect(12, 214, w - 24, 34);

  // Softkey 1: [▲ UP]
  lcdCtx.fillStyle = '#1e293b';
  lcdCtx.fillRect(20, 218, 85, 26);
  lcdCtx.fillStyle = '#38bdf8';
  lcdCtx.font = 'bold 14px monospace';
  lcdCtx.fillText('▲ UP', 38, 236);

  // Softkey 2: [▼ DOWN]
  lcdCtx.fillStyle = '#1e293b';
  lcdCtx.fillRect(115, 218, 85, 26);
  lcdCtx.fillStyle = '#38bdf8';
  lcdCtx.fillText('▼ DOWN', 128, 236);

  // Softkey 3: [RUN/STOP]
  lcdCtx.fillStyle = state.running ? '#7f1d1d' : '#14532d';
  lcdCtx.fillRect(220, 218, 120, 26);
  lcdCtx.fillStyle = state.running ? '#fca5a5' : '#86efac';
  lcdCtx.fillText(state.running ? '■ STOP' : '▶ RUN', 246, 236);

  // Softkey 4: [PROG]
  lcdCtx.fillStyle = '#1e293b';
  lcdCtx.fillRect(360, 218, 130, 26);
  lcdCtx.fillStyle = '#cbd5e1';
  lcdCtx.fillText('⛭ PROGRAM', 374, 236);

  lcdTexture.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Thermal Physics & Stefan-Boltzmann Radiative Dynamics
// ---------------------------------------------------------------------------
function calculateThermalPhysics() {
  const hasPower = state.isPluggedIn && state.power;

  if (!hasPower) {
    if (state.running) {
      state.running = false;
      state.heatingPowerPct = 0.0;
      sfx.stopHeatingHum();
    }
    // Natural ambient cooling
    if (state.currentPV > 22.0) {
      state.currentPV = Math.max(22.0, state.currentPV - 0.25 * clock.getDelta());
    }
    setChamberTemperature(state.currentPV);
    return;
  }

  const dt = Math.min(0.1, clock.getDelta());

  // 1. Door Open Safety Interlock via Microswitch in throat jamb
  if (state.doorOpenRatio > 0.05 && state.running) {
    state.running = false;
    state.status = 'FAULT_DOOR_OPEN';
    state.heatingPowerPct = 0.0;
    sfx.stopHeatingHum();
    sfx.playAlarmBuzzer();
    updateStatusPill('DOOR OPEN', 'Door interlock tripped; power cut to elements', 'fault');
  }

  // 2. Firing Cycle Execution
  if (state.running && state.doorOpenRatio <= 0.05) {
    if (state.status === 'HEATING') {
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
        updateStatusPill('SOAKING', `Holding at ${Math.round(state.setpointSV)}°C`, 'run');
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
  const pElec = (state.heatingPowerPct / 100.0) * 3000.0; // 3 kW Kanthal elements
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
  window.__camera = camera;
  window.__controls = controls;

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
  const labEnv = buildLabRoom(labRoot);
  plugGroupRef = labEnv.plugGroup;

  // Build Muffle Furnace Model
  furnaceModel = createMuffleFurnaceModel();
  furnaceModel.position.set(0, BENCH.surfaceY, 0);
  scene.add(furnaceModel);
  window.__scene = scene;
  window.__furnace = furnaceModel;

  // Initialize Dynamic Canvas LCD
  initLCD();

  // ChemMate Theme Controller (Modern, Retro, Night)
  const themeManager = initChemMateTheme({
    twinName: 'MuffleFurnaceTwin',
    scene,
    ambLight: ambientLight,
    dirLight,
    rimLight: fillLight,
    onThemeChange: () => {
      updateLCD();
    },
  });

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

// ---------------------------------------------------------------------------
// Raycasting & Capacitive Touchscreen Pointer Handling
// ---------------------------------------------------------------------------
function onSceneClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const hit = intersects[0];
    const hitName = hit.object.name || '';

    // 1. Direct Touchscreen Interaction (UI_LCD)
    if (hitName === 'UI_LCD' && hit.uv) {
      handleLcdTouch(hit.uv.x, hit.uv.y);
      return;
    }

    // 2. Physical Button & Kinematic Part Interaction
    handlePartInteraction(hitName, hit.object);
  }
}

/**
 * Handles capacitive touch coordinates on Eurotherm LCD screen
 * UV x, y ∈ [0, 1] mapped across 512x256 canvas
 */
function handleLcdTouch(uvX, uvY) {
  if (!state.isPluggedIn || !state.power) {
    sfx.playTouchBeep(320, 0.04);
    return;
  }

  // Pixel coordinates in 512x256 canvas
  const px = uvX * 512;
  const py = uvY * 256;

  // Bottom softkey bar (Y ∈ [210, 256])
  if (py >= 210) {
    if (px >= 15 && px <= 105) {
      // [▲ UP]
      adjustTemp(25.0);
    } else if (px >= 110 && px <= 205) {
      // [▼ DOWN]
      adjustTemp(-25.0);
    } else if (px >= 215 && px <= 345) {
      // [RUN / STOP]
      toggleRun();
    } else if (px >= 355 && px <= 500) {
      // [PROG]
      cycleNextProfile();
    }
  } else if (py >= 46 && py <= 134) {
    // Upper PV region: Zoom into console or toggle profile
    sfx.playTouchBeep(880, 0.04);
    setCamView(CAM_CONSOLE);
  } else if (py >= 140 && py <= 208) {
    // Lower SP region: Step setpoint +50°C
    adjustTemp(50.0);
  } else {
    sfx.playTouchBeep(1040, 0.03);
  }
}

function handlePartInteraction(partName, meshObj) {
  if (!partName) return;

  if (partName.includes('DoorHandle') || partName.includes('DoorOuterPanel') || partName.includes('DoorRefractoryPlug')) {
    toggleDoor();
  } else if (partName.includes('Btn_RunStop')) {
    animateButtonDepress(meshObj);
    toggleRun();
  } else if (partName.includes('Btn_MainsSwitch')) {
    toggleMainsSwitch();
  } else if (partName.includes('Btn_Up')) {
    animateButtonDepress(meshObj);
    adjustTemp(25.0);
  } else if (partName.includes('Btn_Down')) {
    animateButtonDepress(meshObj);
    adjustTemp(-25.0);
  } else if (partName.includes('Btn_Page') || partName.includes('Btn_Scroll')) {
    animateButtonDepress(meshObj);
    cycleNextProfile();
  } else if (partName.includes('Crucible')) {
    toggleCrucible();
  } else if (partName.includes('Damper')) {
    toggleDamper();
  } else if (partName.includes('Power_Plug_NEMA') || partName.includes('Power_Receptacle_Duplex')) {
    togglePlugContinuity();
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

function togglePlugContinuity() {
  state.isPluggedIn = !state.isPluggedIn;
  sfx.playContactorClack();
  const btn = document.getElementById('btn-plug');
  if (btn) btn.textContent = state.isPluggedIn ? 'CORD: PLUGGED IN' : 'CORD: UNPLUGGED';

  if (plugGroupRef) {
    plugGroupRef.position.z = state.isPluggedIn
      ? (BENCH.cz + BENCH.sz / 2 - 0.05 - 0.20 + 0.05)
      : (BENCH.cz + BENCH.sz / 2 - 0.05 - 0.20 - 0.40);
  }

  if (!state.isPluggedIn) {
    state.running = false;
    sfx.stopHeatingHum();
    updateStatusPill('NO POWER', 'Mains cord disconnected from bench duplex outlet', 'fault');
  } else {
    updateStatusPill('STANDBY', 'Mains power restored to furnace line', 'run');
  }
}

function toggleMainsSwitch() {
  state.power = !state.power;
  setMainsSwitchRotation(state.power);
  sfx.playContactorClack();
  sfx.playTouchBeep(state.power ? 880 : 380, 0.08);

  const btn = document.getElementById('btn-power');
  if (btn) btn.textContent = state.power ? 'MAINS: ON' : 'MAINS: OFF';

  if (!state.power) {
    state.running = false;
    sfx.stopHeatingHum();
    updateStatusPill('OFFLINE', 'Rotary disconnect switch turned OFF', 'muted');
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
  if (!state.isPluggedIn || !state.power) {
    sfx.playAlarmBuzzer();
    updateStatusPill('NO POWER', 'Connect power and switch on mains before starting run', 'fault');
    return;
  }
  sfx.playTouchBeep(1046, 0.05);

  if (state.running) {
    state.running = false;
    state.status = 'IDLE';
    state.heatingPowerPct = 0.0;
    sfx.stopHeatingHum();
    sfx.playContactorClack();
    const btn = document.getElementById('btn-run');
    if (btn) btn.textContent = 'RUN: OFF';
    updateStatusPill('IDLE', 'Program paused; heaters off', 'run');
  } else {
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
    updateStatusPill('HEATING', `Ramping to ${Math.round(state.setpointSV)}°C at ${state.rampRate}°C/min`, 'run');
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

function cycleNextProfile() {
  const keys = Object.keys(PROFILES);
  const currIdx = keys.indexOf(state.currentProfile.id);
  const nextKey = keys[(currIdx + 1) % keys.length];
  selectProfile(nextKey);
  const selEl = document.getElementById('select-profile');
  if (selEl) selEl.value = nextKey;
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
// Part Explorer Implementation
// ---------------------------------------------------------------------------
function initPartExplorer() {
  const listEl = document.getElementById('parts-list');
  if (!listEl) return;

  listEl.innerHTML = '';
  PART_CATALOG.forEach((part) => {
    const item = document.createElement('div');
    item.className = 'part-item';
    item.dataset.partId = part.id;
    item.innerHTML = `
      <span>${part.label}</span>
      <span class="part-cat-badge">${part.cat}</span>
    `;

    item.addEventListener('click', () => {
      document.querySelectorAll('.part-item').forEach((el) => el.classList.remove('active'));
      item.classList.add('active');
      state.activePartId = part.id;
      const res = focusPart(part.id, controls, camera);
      const stEl = document.getElementById('parts-focus-status');
      if (stEl) {
        stEl.textContent = res ? `Focused: ${part.label}` : `Part: ${part.label}`;
      }
      sfx.playTouchBeep(840, 0.03);
    });

    listEl.appendChild(item);
  });

  document.getElementById('btn-parts-clear')?.addEventListener('click', () => {
    clearPartFocus();
    state.activePartId = null;
    document.querySelectorAll('.part-item').forEach((el) => el.classList.remove('active'));
    const stEl = document.getElementById('parts-focus-status');
    if (stEl) stEl.textContent = 'No part focused';
    setCamView(CAM_ISO);
  });
}

// ---------------------------------------------------------------------------
// UI & Control Event Wiring
// ---------------------------------------------------------------------------
function initUI() {
  // Toolbar camera presets
  document.getElementById('btn-cam-iso')?.addEventListener('click', () => setCamView(CAM_ISO));
  document.getElementById('btn-cam-front')?.addEventListener('click', () => setCamView(CAM_FRONT));
  document.getElementById('btn-cam-console')?.addEventListener('click', () => setCamView(CAM_CONSOLE));
  document.getElementById('btn-cam-side')?.addEventListener('click', () => setCamView(CAM_SIDE));
  document.getElementById('btn-cam-top')?.addEventListener('click', () => setCamView(CAM_TOP));
  document.getElementById('btn-cam-rear')?.addEventListener('click', () => setCamView(CAM_REAR));

  document.getElementById('btn-auto-rotate')?.addEventListener('click', (e) => {
    state.autoRotate = !state.autoRotate;
    e.target.classList.toggle('active', state.autoRotate);
  });

  document.getElementById('orbit-speed')?.addEventListener('input', (e) => {
    state.orbitSpeed = parseFloat(e.target.value);
    const valEl = document.getElementById('orbit-speed-val');
    if (valEl) valEl.textContent = `${state.orbitSpeed.toFixed(1)}×`;
  });

  document.getElementById('lab-light')?.addEventListener('input', (e) => {
    state.labLightIntensity = parseFloat(e.target.value);
    ambientLight.intensity = 0.55 * state.labLightIntensity;
    dirLight.intensity = 1.4 * state.labLightIntensity;
    fillLight.intensity = 0.65 * state.labLightIntensity;
    const valEl = document.getElementById('lab-light-val');
    if (valEl) valEl.textContent = `${state.labLightIntensity.toFixed(1)}×`;
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
    if (state.exploded) {
      setCamView(CAM_EXPLODED);
    } else {
      setCamView(CAM_ISO);
    }
  });

  document.getElementById('btn-sfx-mute')?.addEventListener('click', (e) => {
    sfx.setMuted(!sfx.isMuted());
    e.target.textContent = sfx.isMuted() ? 'Unmute SFX' : 'Mute SFX';
  });

  // Sidebar Controls
  document.getElementById('btn-run')?.addEventListener('click', toggleRun);
  document.getElementById('btn-door')?.addEventListener('click', toggleDoor);
  document.getElementById('btn-power')?.addEventListener('click', toggleMainsSwitch);
  document.getElementById('btn-plug')?.addEventListener('click', togglePlugContinuity);
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

  initPartExplorer();
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

window.__testState = state;
window.setChamberTemperature = setChamberTemperature;
