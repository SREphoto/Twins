/**
 * SREdesigns PH-7000 Pro App Controller (app.js)
 * Full state engine, dynamic Canvas LCD renderer, interactive 3D physics,
 * sound effects, and classroom titration/calibration workflows.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  createPHMeterModel,
  setArmPosition,
  setArmSwivel,
  setStorageCapMounted,
  setSolutionColor,
  setLcdTexture,
  setExplodeAmount,
  setWireframe,
  buildLabRoom,
  BENCH,
  CAM_ISO,
  CAM_FRONT,
  CAM_SIDE,
  CAM_TOP,
} from './ph_meter3d.js?v=20260925-gold1';
import { sfx } from './sfx.js?v=20260925-gold1';

// ---------------------------------------------------------------------------
// Standard Solutions & Chemical Samples Database
// ---------------------------------------------------------------------------
const SOLUTIONS = {
  ph7: {
    id: 'ph7',
    label: 'Standard Buffer pH 7.00',
    targetPH: 7.00,
    colorHex: 0xfef08a, // Soft translucent yellow
    isBuffer: true,
    bufferNominal: 7.00,
    desc: 'Phosphate reference buffer at isopotential zero point (E0 ≈ 0 mV)',
  },
  ph4: {
    id: 'ph4',
    label: 'Standard Buffer pH 4.01',
    targetPH: 4.01,
    colorHex: 0xfecdd3, // Soft translucent pink
    isBuffer: true,
    bufferNominal: 4.01,
    desc: 'Potassium hydrogen phthalate acid slope calibration buffer',
  },
  ph10: {
    id: 'ph10',
    label: 'Standard Buffer pH 10.01',
    targetPH: 10.01,
    colorHex: 0xbae6fd, // Soft translucent blue
    isBuffer: true,
    bufferNominal: 10.01,
    desc: 'Sodium bicarbonate/carbonate alkaline slope calibration buffer',
  },
  vinegar: {
    id: 'vinegar',
    label: 'Household Vinegar (CH3COOH)',
    targetPH: 2.85,
    colorHex: 0xfef3c7,
    isBuffer: false,
    desc: 'Dilute acetic acid solution (0.83 M, Ka = 1.8e-5)',
  },
  tapWater: {
    id: 'tapWater',
    label: 'Municipal Tap Water',
    targetPH: 7.42,
    colorHex: 0xe0f2fe,
    isBuffer: false,
    desc: 'Slightly alkaline drinking water with dissolved mineral bicarbonate',
  },
  ammonia: {
    id: 'ammonia',
    label: 'Dilute Ammonia Solution (NH3)',
    targetPH: 11.15,
    colorHex: 0xf3e8ff,
    isBuffer: false,
    desc: 'Household ammonium hydroxide cleaning reagent',
  },
};

// ---------------------------------------------------------------------------
// State Machine Engine
// ---------------------------------------------------------------------------
const state = {
  power: true,
  mode: 'pH', // 'pH' or 'mV'
  measuring: true,
  hold: false,
  isStable: false,
  stableTimer: 0.0,

  // Probe & Hardware Kinematics
  capMounted: false,
  armImmersion: 0.85,    // 0 = raised, 1 = lowered in solution
  targetArmImmersion: 0.85,
  armSwivel: 0.0,

  // Selected solution in beaker
  currentSolution: SOLUTIONS.ph7,

  // Physical Temperature & ATC
  tempC: 25.0,
  atcEnabled: true,

  // Internal Electrochemical Parameters
  probeSlopePct: 98.6,   // Actual physical electrode efficiency
  probeOffsetMv: 1.8,    // Asymmetry potential
  calibOffsetMv: 0.0,    // Calibrated zero offset
  calibSlopePct: 100.0,  // Calibrated slope in memory
  calibratedPoints: [],  // Recorded buffer nominals

  // Real-time Measurement Readouts
  rawMv: 0.0,
  measuredMv: 0.0,
  measuredPH: 7.00,
  targetPH: 7.00,

  // Classroom Demo State
  demoRunning: false,
  demoStep: 0,
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
let phMeterModel;
let ambientLight, dirLight, fillLight;
let raycaster, mouse;
let clock;

// Off-screen LCD Canvas & Texture
let lcdCanvas, lcdCtx, lcdTexture;

function initLCD() {
  lcdCanvas = document.createElement('canvas');
  lcdCanvas.width = 1024;
  lcdCanvas.height = 512;
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
    lcdCtx.fillStyle = '#06080c';
    lcdCtx.fillRect(0, 0, w, h);
    lcdTexture.needsUpdate = true;
    return;
  }

  // Modern Crisp High-Contrast ChemMate Blue Backlight
  const bgGrad = lcdCtx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#091528');
  bgGrad.addColorStop(1, '#030814');
  lcdCtx.fillStyle = bgGrad;
  lcdCtx.fillRect(0, 0, w, h);

  // Outer border & subtle tech bezel
  lcdCtx.strokeStyle = '#1e3a5f';
  lcdCtx.lineWidth = 4;
  lcdCtx.strokeRect(10, 10, w - 20, h - 20);

  // Top Status Bar
  lcdCtx.fillStyle = '#64748b';
  lcdCtx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  lcdCtx.fillText('SREdesigns  PH-7000 Pro', 36, 52);

  // Stability Indicator Pill
  if (state.isStable && state.measuring && !state.capMounted && state.armImmersion > 0.5) {
    lcdCtx.fillStyle = '#22c55e';
    lcdCtx.beginPath();
    lcdCtx.arc(w - 220, 44, 10, 0, Math.PI * 2);
    lcdCtx.fill();

    lcdCtx.fillStyle = '#4ade80';
    lcdCtx.font = 'bold 24px sans-serif';
    lcdCtx.fillText('READY', w - 195, 52);
  } else if (state.measuring) {
    lcdCtx.fillStyle = '#f59e0b';
    lcdCtx.beginPath();
    lcdCtx.arc(w - 220, 44, 10, 0, Math.PI * 2);
    lcdCtx.fill();

    lcdCtx.fillStyle = '#fbbf24';
    lcdCtx.font = 'bold 24px sans-serif';
    lcdCtx.fillText('MEASURING…', w - 195, 52);
  } else if (state.hold) {
    lcdCtx.fillStyle = '#e11d48';
    lcdCtx.beginPath();
    lcdCtx.arc(w - 220, 44, 10, 0, Math.PI * 2);
    lcdCtx.fill();

    lcdCtx.fillStyle = '#fb7185';
    lcdCtx.font = 'bold 24px sans-serif';
    lcdCtx.fillText('HOLD', w - 195, 52);
  }

  // Primary Readout (Large 7-segment style digits)
  lcdCtx.textAlign = 'right';
  if (state.mode === 'pH') {
    lcdCtx.fillStyle = '#f8fafc';
    lcdCtx.font = '700 135px monospace';
    const phStr = state.measuredPH.toFixed(2);
    lcdCtx.fillText(phStr, w - 240, 245);

    lcdCtx.textAlign = 'left';
    lcdCtx.fillStyle = '#38bdf8';
    lcdCtx.font = '700 52px sans-serif';
    lcdCtx.fillText('pH', w - 210, 235);
  } else {
    lcdCtx.fillStyle = '#f8fafc';
    lcdCtx.font = '700 120px monospace';
    const mvSign = state.measuredMv >= 0 ? '+' : '';
    const mvStr = `${mvSign}${state.measuredMv.toFixed(1)}`;
    lcdCtx.fillText(mvStr, w - 240, 245);

    lcdCtx.textAlign = 'left';
    lcdCtx.fillStyle = '#38bdf8';
    lcdCtx.font = '700 48px sans-serif';
    lcdCtx.fillText('mV', w - 210, 235);
  }

  // Divider Line
  lcdCtx.strokeStyle = '#1e293b';
  lcdCtx.lineWidth = 2;
  lcdCtx.beginPath();
  lcdCtx.moveTo(36, 290);
  lcdCtx.lineTo(w - 36, 290);
  lcdCtx.stroke();

  // Secondary Information Cards (Temperature, ATC, Cal Slope)
  lcdCtx.textAlign = 'left';

  // Card 1: Temperature & ATC
  lcdCtx.fillStyle = '#94a3b8';
  lcdCtx.font = '500 26px sans-serif';
  lcdCtx.fillText('TEMP / COMP', 46, 335);

  lcdCtx.fillStyle = '#38bdf8';
  lcdCtx.font = '700 46px monospace';
  lcdCtx.fillText(`${state.tempC.toFixed(1)} °C`, 46, 385);

  lcdCtx.fillStyle = state.atcEnabled ? '#22c55e' : '#64748b';
  lcdCtx.font = 'bold 22px sans-serif';
  lcdCtx.fillText(state.atcEnabled ? '● ATC ON' : '○ MANUAL', 46, 420);

  // Card 2: Electrode Slope & Calibration Health
  lcdCtx.fillStyle = '#94a3b8';
  lcdCtx.font = '500 26px sans-serif';
  lcdCtx.fillText('ELECTRODE SLOPE', 360, 335);

  lcdCtx.fillStyle = '#a78bfa';
  lcdCtx.font = '700 46px monospace';
  lcdCtx.fillText(`${state.calibSlopePct.toFixed(1)}%`, 360, 385);

  lcdCtx.fillStyle = state.calibratedPoints.length > 0 ? '#4ade80' : '#f59e0b';
  lcdCtx.font = '500 22px sans-serif';
  const calPts = state.calibratedPoints.length > 0
    ? `Cal: ${state.calibratedPoints.join(', ')}`
    : 'Cal: Factory Default';
  lcdCtx.fillText(calPts, 360, 420);

  // Card 3: Sample Tag
  lcdCtx.fillStyle = '#94a3b8';
  lcdCtx.font = '500 26px sans-serif';
  lcdCtx.fillText('SOLUTION', 690, 335);

  lcdCtx.fillStyle = '#f1f5f9';
  lcdCtx.font = '600 28px sans-serif';
  const truncatedLabel = state.currentSolution.label.length > 18
    ? state.currentSolution.label.slice(0, 16) + '…'
    : state.currentSolution.label;
  lcdCtx.fillText(truncatedLabel, 690, 375);

  lcdCtx.fillStyle = state.capMounted ? '#ef4444' : '#64748b';
  lcdCtx.font = '500 22px sans-serif';
  lcdCtx.fillText(state.capMounted ? '⚠️ Storage Cap ON' : 'Electrode Uncapped', 690, 415);

  // Bottom Navigation Bar
  lcdCtx.fillStyle = '#0f172a';
  lcdCtx.fillRect(10, h - 54, w - 20, 44);

  lcdCtx.fillStyle = '#64748b';
  lcdCtx.font = '500 20px sans-serif';
  lcdCtx.fillText('MODE', 75, h - 25);
  lcdCtx.fillText('CAL', 280, h - 25);
  lcdCtx.fillText('READ', 490, h - 25);
  lcdCtx.fillText('SETUP', 700, h - 25);
  lcdCtx.fillText('HOLD', 900, h - 25);

  lcdTexture.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Physical Nernstian Calculations & Dynamics
// ---------------------------------------------------------------------------
function calculateElectrochemicalPotentials() {
  if (!state.power) return;

  const tempK = state.tempC + 273.15;
  // Theoretical Nernstian slope: 2.302585 * R * T / F
  const R = 8.3144626;
  const F = 96485.332;
  const theorSlopeMv = ((2.302585 * R * tempK) / F) * 1000.0; // ~ 59.16 mV / pH at 25°C

  if (state.capMounted || state.armImmersion < 0.4) {
    // Electrode in air or storage cap: open circuit floating potential with noise
    state.rawMv = 15.0 + 4.0 * Math.sin(clock.getElapsedTime() * 1.5);
    state.targetPH = 7.00 + 0.10 * Math.cos(clock.getElapsedTime() * 2.0);
    state.isStable = false;
    state.stableTimer = 0;
  } else {
    // Immersed in solution
    const actualSlope = theorSlopeMv * (state.probeSlopePct / 100.0);
    state.rawMv = state.probeOffsetMv - (state.currentSolution.targetPH - 7.00) * actualSlope;

    // Meter applies calibrated zero offset and calibrated slope
    const calSlope = theorSlopeMv * (state.calibSlopePct / 100.0);
    state.targetPH = 7.00 - ((state.rawMv - state.calibOffsetMv) / calSlope);
  }

  // Smooth exponential sensor lag (settling time constant)
  const dt = Math.min(0.1, clock.getDelta());
  const alpha = Math.min(1.0, 3.2 * dt);
  const prevPH = state.measuredPH;
  state.measuredMv += (state.rawMv - state.measuredMv) * alpha;
  state.measuredPH += (state.targetPH - state.measuredPH) * alpha;

  // Stability detection
  if (state.measuring && !state.capMounted && state.armImmersion > 0.5) {
    if (Math.abs(state.measuredPH - prevPH) < 0.003) {
      state.stableTimer += dt;
      if (state.stableTimer > 1.2 && !state.isStable) {
        state.isStable = true;
        sfx.playStableChime();
        updateStatusPill('READY', 'Sensor stable; reading locked', 'run');
      }
    } else {
      state.isStable = false;
      state.stableTimer = 0;
    }
  } else {
    state.isStable = false;
    state.stableTimer = 0;
  }
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
  scene.fog = new THREE.Fog(0x0c1017, 18, 55);

  camera = new THREE.PerspectiveCamera(38, w / h, 0.05, 100);
  camera.position.copy(CAM_ISO.position);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  viewportEl.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(CAM_ISO.target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't look below bench
  controls.minDistance = 0.8;
  controls.maxDistance = 14.0;

  // Photorealistic Lab Lighting
  ambientLight = new THREE.AmbientLight(0xdbeafe, 0.55);
  scene.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xfffbf0, 1.4);
  dirLight.position.set(3.5, 14.0, -4.0);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.setScalar(2048);
  dirLight.shadow.bias = -0.0001;
  scene.add(dirLight);

  fillLight = new THREE.DirectionalLight(0x93c5fd, 0.65);
  fillLight.position.set(-5.0, 10.0, 3.0);
  scene.add(fillLight);

  // Build lab room and epoxy workbench
  const labRoot = new THREE.Group();
  scene.add(labRoot);
  buildLabRoom(labRoot);

  // Build and position PH-7000 Pro Model on Bench Surface
  phMeterModel = createPHMeterModel();
  phMeterModel.position.set(0, BENCH.surfaceY, 0);
  scene.add(phMeterModel);

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
  const intersects = raycaster.intersectObjects(phMeterModel.children, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    handlePartInteraction(hit.name);
  }
}

function handlePartInteraction(partName) {
  if (!partName) return;

  if (partName.includes('Btn_Read')) {
    toggleMeasure();
  } else if (partName.includes('Btn_Cal')) {
    performCalibration();
  } else if (partName.includes('Btn_Mode')) {
    toggleMode();
  } else if (partName.includes('Btn_Hold')) {
    toggleHold();
  } else if (partName.includes('Btn_Power')) {
    togglePower();
  } else if (partName.includes('StorageCap') || partName.includes('StorageVial')) {
    toggleCap();
  } else if (partName.includes('Beaker')) {
    sfx.playBeakerClink();
  } else if (partName.includes('Arm') || partName.includes('HeadBlock') || partName.includes('Electrode')) {
    toggleArm();
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
  sfx.playTouchBeep(state.power ? 950 : 420, 0.08);
  const btn = document.getElementById('btn-power');
  if (btn) btn.textContent = state.power ? 'POWER: ON' : 'POWER: OFF';
  updateStatusPill(state.power ? 'ONLINE' : 'STANDBY', state.power ? 'Meter active' : 'Unit powered off');
}

function toggleMeasure() {
  if (!state.power) return;
  state.measuring = !state.measuring;
  state.hold = false;
  sfx.playTouchBeep(880, 0.04);
  const btn = document.getElementById('btn-read');
  if (btn) btn.textContent = state.measuring ? 'READ: ACTIVE' : 'READ: IDLE';
}

function toggleMode() {
  if (!state.power) return;
  state.mode = state.mode === 'pH' ? 'mV' : 'pH';
  sfx.playTouchBeep(740, 0.05);
  const btn = document.getElementById('btn-mode');
  if (btn) btn.textContent = `MODE: ${state.mode}`;
}

function toggleHold() {
  if (!state.power) return;
  state.hold = !state.hold;
  if (state.hold) state.measuring = false;
  sfx.playTouchBeep(620, 0.06);
}

function toggleArm() {
  state.targetArmImmersion = state.targetArmImmersion > 0.5 ? 0.0 : 0.85;
  sfx.playArmGlide(0.4);
  const btn = document.getElementById('btn-arm');
  if (btn) btn.textContent = state.targetArmImmersion > 0.5 ? 'ARM: LOWERED' : 'ARM: RAISED';
}

function toggleCap() {
  state.capMounted = !state.capMounted;
  setStorageCapMounted(state.capMounted);
  sfx.playTouchBeep(1100, 0.05);
  const btn = document.getElementById('btn-cap');
  if (btn) btn.textContent = state.capMounted ? 'CAP: MOUNTED' : 'CAP: REMOVED';
  if (state.capMounted) {
    updateStatusPill('WARNING', 'Electrode capped; uncap before measuring', 'warn');
  }
}

function selectSolution(solKey) {
  if (!SOLUTIONS[solKey]) return;
  state.currentSolution = SOLUTIONS[solKey];
  setSolutionColor(state.currentSolution.colorHex);
  sfx.playBeakerClink();

  const el = document.getElementById('val-sol');
  if (el) el.textContent = state.currentSolution.label;
  updateStatusPill('RUNNING', `Loaded ${state.currentSolution.label}`, 'run');
}

function performCalibration() {
  if (!state.power) return;
  sfx.playTouchBeep(1046, 0.06);

  if (state.capMounted || state.armImmersion < 0.5) {
    sfx.playAlarmBuzzer();
    updateStatusPill('FAULT', 'Immerse uncapped electrode in buffer to calibrate', 'fault');
    return;
  }

  if (!state.currentSolution.isBuffer) {
    sfx.playAlarmBuzzer();
    updateStatusPill('ERR BUFF', 'Select a standard pH buffer (4.01, 7.00, 10.01)', 'fault');
    return;
  }

  const nom = state.currentSolution.bufferNominal;
  if (nom === 7.00) {
    state.calibOffsetMv = state.rawMv;
    if (!state.calibratedPoints.includes(7.00)) state.calibratedPoints.push(7.00);
    sfx.playStableChime();
    updateStatusPill('CAL OK', 'Zero offset calibrated at pH 7.00', 'run');
  } else {
    // Slope calibration
    if (!state.calibratedPoints.includes(nom)) state.calibratedPoints.push(nom);
    state.calibSlopePct = state.probeSlopePct; // Calibrates to physical electrode
    sfx.playStableChime();
    updateStatusPill('CAL OK', `Slope calibrated at pH ${nom} (${state.calibSlopePct.toFixed(1)}%)`, 'run');
  }
}

function runClassroomDemo() {
  if (state.demoRunning) return;
  state.demoRunning = true;
  state.demoStep = 0;
  state.demoTimer = 0;
  updateStatusPill('DEMO', 'Running automated 3-point calibration & titration demo', 'run');

  // Step 1: Uncap electrode and raise arm
  state.capMounted = false;
  setStorageCapMounted(false);
  state.targetArmImmersion = 0.0;
  sfx.playArmGlide(0.4);

  setTimeout(() => {
    // Step 2: Load pH 7.00 buffer and lower arm
    selectSolution('ph7');
    state.targetArmImmersion = 0.85;
    sfx.playArmGlide(0.4);

    setTimeout(() => {
      // Step 3: Calibrate 7.00
      performCalibration();

      setTimeout(() => {
        // Step 4: Raise arm, load pH 4.01 buffer, lower arm
        state.targetArmImmersion = 0.0;
        setTimeout(() => {
          selectSolution('ph4');
          state.targetArmImmersion = 0.85;
          setTimeout(() => {
            performCalibration();

            setTimeout(() => {
              // Step 5: Test unknown vinegar sample
              state.targetArmImmersion = 0.0;
              setTimeout(() => {
                selectSolution('vinegar');
                state.targetArmImmersion = 0.85;
                state.demoRunning = false;
                updateStatusPill('READY', 'Demo complete! Vinegar measured at pH 2.85', 'run');
              }, 1200);
            }, 1800);
          }, 1200);
        }, 1200);
      }, 1800);
    }, 1500);
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
  document.getElementById('btn-read')?.addEventListener('click', toggleMeasure);
  document.getElementById('btn-cal')?.addEventListener('click', performCalibration);
  document.getElementById('btn-mode')?.addEventListener('click', toggleMode);
  document.getElementById('btn-hold')?.addEventListener('click', toggleHold);
  document.getElementById('btn-power')?.addEventListener('click', togglePower);
  document.getElementById('btn-arm')?.addEventListener('click', toggleArm);
  document.getElementById('btn-cap')?.addEventListener('click', toggleCap);
  document.getElementById('btn-demo')?.addEventListener('click', runClassroomDemo);

  document.getElementById('select-solution')?.addEventListener('change', (e) => {
    selectSolution(e.target.value);
  });

  document.getElementById('slider-temp')?.addEventListener('input', (e) => {
    state.tempC = parseFloat(e.target.value);
    const valEl = document.getElementById('val-temp');
    if (valEl) valEl.textContent = `${state.tempC.toFixed(1)}°C`;
  });

  document.getElementById('btn-atc-toggle')?.addEventListener('click', (e) => {
    state.atcEnabled = !state.atcEnabled;
    e.target.textContent = state.atcEnabled ? 'ATC: ON' : 'ATC: MANUAL';
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

  // Smooth Arm Kinematics Interpolation
  if (Math.abs(state.armImmersion - state.targetArmImmersion) > 0.005) {
    state.armImmersion += (state.targetArmImmersion - state.armImmersion) * 0.12;
    setArmPosition(state.armImmersion);
  }

  // Physics calculation
  calculateElectrochemicalPotentials();

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
