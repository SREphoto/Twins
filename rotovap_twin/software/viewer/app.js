/**
 * SREdesigns BÜCHI Rotavapor R-300 Application Controller (app.js)
 * Full state engine, dynamic Canvas LCD renderer, interactive 3D physics,
 * sound effects, Part Explorer, and physical circuit continuity.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  createRotovapModel,
  buildLabRoom,
  BENCH,
  CAM_ISO,
  CAM_FRONT,
  CAM_SIDE,
  CAM_TOP,
  CAM_EXPLODED,
  CAM_CONSOLE,
  CAM_MOTOR_INTERIOR,
} from './rotovap3d.js?v=20261018-gold';
import {
  playLiftMotor,
  setRotationSound,
  playDripSound,
  playVacuumHiss,
  playKnobClick,
  setSfxMuted,
  isSfxMuted,
} from './sfx.js?v=20261018-gold';
import { initChemMateTheme } from '../../../lab_viewer/shared/chemmate_theme_manager.js';

// ---------------------------------------------------------------------------
// Solvent Vapor Pressure Database (Antoine Equation: log10(P_bar) = A - B/(T + C))
// ---------------------------------------------------------------------------
const SOLVENTS = {
  ethanol: {
    id: 'ethanol',
    name: 'Ethanol (EtOH)',
    normalBp: 78.4,
    color: 0xf59e0b,
    antoine: { A: 5.24677, B: 1598.673, C: -46.424 },
    desc: 'Common extraction solvent (MW 46.07 g/mol). Target 40°C bath at 175 mbar.',
  },
  acetone: {
    id: 'acetone',
    name: 'Acetone',
    normalBp: 56.1,
    color: 0xfde047,
    antoine: { A: 4.42448, B: 1312.253, C: -32.445 },
    desc: 'Fast evaporating polar solvent (MW 58.08 g/mol). Target 40°C bath at 556 mbar.',
  },
  methanol: {
    id: 'methanol',
    name: 'Methanol (MeOH)',
    normalBp: 64.7,
    color: 0xfb923c,
    antoine: { A: 5.20409, B: 1581.341, C: -33.50 },
    desc: 'Polar protic solvent (MW 32.04 g/mol). Target 40°C bath at 337 mbar.',
  },
  ethyl_acetate: {
    id: 'ethyl_acetate',
    name: 'Ethyl Acetate (EtOAc)',
    normalBp: 77.1,
    color: 0xeab308,
    antoine: { A: 4.22809, B: 1245.702, C: -55.21 },
    desc: 'Versatile ester solvent (MW 88.11 g/mol). Target 40°C bath at 240 mbar.',
  },
  water: {
    id: 'water',
    name: 'Water (H2O)',
    normalBp: 100.0,
    color: 0x38bdf8,
    antoine: { A: 5.11564, B: 1687.537, C: -42.98 },
    desc: 'High latent heat of vaporization (MW 18.02 g/mol). Target 40°C bath at 72 mbar.',
  },
};

// ---------------------------------------------------------------------------
// Operational State
// ---------------------------------------------------------------------------
const state = {
  // Physical Continuity (DIAG-014)
  isPluggedIn: true,
  power: true,

  currentSolvent: SOLVENTS.ethanol,

  // Mechanical States
  rpm: 120.0,
  targetRpm: 120.0,
  liftPos: 0.0, // 0 = lowered in bath, 1 = raised
  targetLiftPos: 0.0,

  // Thermal & Vacuum Parameters
  bathTemp: 22.0,
  targetBathTemp: 45.0,
  heatingOn: false,
  vacuumMbar: 1013.0,
  targetVacuumMbar: 175.0,

  // Liquid Volumes
  evapFlaskVol: 0.85,
  recvFlaskVol: 0.05,

  // Distillation Dynamics
  isDistilling: false,
  dripRate: 0.0,
  dripTimer: 0.0,

  // View States
  wireframe: false,
  exploded: false,
  autoRotate: false,
};

// ---------------------------------------------------------------------------
// Canvas LCD Generator (I-300 Pro Controller Display)
// ---------------------------------------------------------------------------
let lcdCanvas, lcdCtx, lcdTexture;

function initLCD() {
  lcdCanvas = document.createElement('canvas');
  lcdCanvas.width = 1024;
  lcdCanvas.height = 512;
  lcdCtx = lcdCanvas.getContext('2d');

  lcdTexture = new THREE.CanvasTexture(lcdCanvas);
  lcdTexture.flipY = false; // Strictly non-inverted UV convention
  lcdTexture.colorSpace = THREE.SRGBColorSpace;
  lcdTexture.minFilter = THREE.LinearFilter;
  lcdTexture.magFilter = THREE.LinearFilter;
}

function renderLCD() {
  if (!lcdCtx) return;

  // Physical Circuit Continuity: Blackout when unpowered (DIAG-014)
  if (!state.isPluggedIn || !state.power) {
    lcdCtx.fillStyle = '#05080c';
    lcdCtx.fillRect(0, 0, 1024, 512);
    lcdTexture.needsUpdate = true;
    return;
  }

  // Deep tech gradient background
  const bgGrad = lcdCtx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#091322');
  bgGrad.addColorStop(1, '#040812');
  lcdCtx.fillStyle = bgGrad;
  lcdCtx.fillRect(0, 0, 1024, 512);

  // Top header bar
  lcdCtx.fillStyle = '#0f1c30';
  lcdCtx.fillRect(0, 0, 1024, 64);
  lcdCtx.strokeStyle = '#1e3048';
  lcdCtx.lineWidth = 2;
  lcdCtx.strokeRect(0, 0, 1024, 64);

  lcdCtx.textAlign = 'left';
  lcdCtx.font = 'bold 26px -apple-system, sans-serif';
  lcdCtx.fillStyle = '#00d4e8';
  lcdCtx.fillText('BUCHI I-300 PRO', 32, 42);

  lcdCtx.font = 'bold 18px -apple-system, sans-serif';
  lcdCtx.fillStyle = '#38bdf8';
  lcdCtx.fillText('◆ SREdesigns', 285, 42);

  lcdCtx.font = '600 20px monospace';
  lcdCtx.fillStyle = '#94a3b8';
  lcdCtx.fillText(state.currentSolvent.name, 450, 42);

  // Distillation Status Badge
  const isBoiling = state.isDistilling;
  lcdCtx.fillStyle = isBoiling ? '#14532d' : (state.heatingOn ? '#78350f' : '#1e293b');
  lcdCtx.beginPath();
  lcdCtx.roundRect(780, 14, 210, 36, 6);
  lcdCtx.fill();

  lcdCtx.fillStyle = isBoiling ? '#4ade80' : (state.heatingOn ? '#f59e0b' : '#38bdf8');
  lcdCtx.font = 'bold 18px -apple-system, sans-serif';
  lcdCtx.textAlign = 'center';
  const statusTxt = isBoiling ? 'DISTILLING' : (state.heatingOn ? 'HEATING' : 'STANDBY');
  lcdCtx.fillText(statusTxt, 885, 39);

  // 3 Primary Metric Cards (Rotation | Bath Temp | Vacuum)
  const colW = 300;
  const metrics = [
    {
      label: 'FLASK ROTATION',
      val: `${Math.round(state.rpm)}`,
      unit: 'RPM',
      set: `Target: ${Math.round(state.targetRpm)} RPM`,
      color: state.rpm > 5 ? '#f8fafc' : '#64748b',
    },
    {
      label: 'BATH TEMPERATURE',
      val: `${state.bathTemp.toFixed(1)}`,
      unit: '°C',
      set: `Setpoint: ${state.targetBathTemp.toFixed(1)} °C`,
      color: state.heatingOn ? '#f59e0b' : '#f8fafc',
    },
    {
      label: 'VACUUM PRESSURE',
      val: `${Math.round(state.vacuumMbar)}`,
      unit: 'mbar',
      set: `Setpoint: ${Math.round(state.targetVacuumMbar)} mbar`,
      color: state.vacuumMbar < 950 ? '#00d4e8' : '#f8fafc',
    },
  ];

  metrics.forEach((m, i) => {
    const bx = 32 + i * 324;
    const by = 84;
    lcdCtx.fillStyle = '#111d2e';
    lcdCtx.strokeStyle = '#22354e';
    lcdCtx.lineWidth = 2;
    lcdCtx.beginPath();
    lcdCtx.roundRect(bx, by, colW, 250, 10);
    lcdCtx.fill();
    lcdCtx.stroke();

    lcdCtx.textAlign = 'left';
    lcdCtx.font = 'bold 18px -apple-system, sans-serif';
    lcdCtx.fillStyle = '#94a3b8';
    lcdCtx.fillText(m.label, bx + 20, by + 36);

    lcdCtx.font = '700 70px monospace';
    lcdCtx.fillStyle = m.color;
    lcdCtx.fillText(m.val, bx + 20, by + 128);

    lcdCtx.font = 'bold 26px -apple-system, sans-serif';
    lcdCtx.fillStyle = '#38bdf8';
    lcdCtx.fillText(m.unit, bx + 205, by + 120);

    lcdCtx.font = '500 18px -apple-system, sans-serif';
    lcdCtx.fillStyle = '#64748b';
    lcdCtx.fillText(m.set, bx + 20, by + 215);
  });

  // Lower Process & Telemetry Card
  lcdCtx.fillStyle = '#0f1c30';
  lcdCtx.fillRect(32, 354, 960, 126);
  lcdCtx.strokeStyle = '#1e3048';
  lcdCtx.strokeRect(32, 354, 960, 126);

  lcdCtx.font = '600 20px -apple-system, sans-serif';
  lcdCtx.fillStyle = '#94a3b8';
  lcdCtx.fillText('Vapor Temp (Est):', 54, 400);
  lcdCtx.fillStyle = '#4ade80';
  const estVapor = state.isDistilling ? (state.bathTemp - 3.2).toFixed(1) : '21.5';
  lcdCtx.fillText(`${estVapor} °C`, 250, 400);

  lcdCtx.fillStyle = '#94a3b8';
  lcdCtx.fillText('Condensate Flow:', 420, 400);
  lcdCtx.fillStyle = '#00d4e8';
  lcdCtx.fillText(`${(state.dripRate * 12).toFixed(1)} mL/min`, 610, 400);

  lcdCtx.fillStyle = '#94a3b8';
  lcdCtx.fillText('Lift Carriage:', 770, 400);
  lcdCtx.fillStyle = state.liftPos > 0.5 ? '#f59e0b' : '#4ade80';
  lcdCtx.fillText(state.liftPos > 0.5 ? '▲ RAISED' : '▼ IN BATH', 900, 400);

  // Softkey Navigation Indicators
  lcdCtx.fillStyle = '#64748b';
  lcdCtx.font = '500 18px -apple-system, sans-serif';
  lcdCtx.fillText('◆ START / STOP', 60, 452);
  lcdCtx.fillText('◆ MODE SELECT', 420, 452);
  lcdCtx.fillText('◆ AERATE / VENT', 770, 452);

  lcdTexture.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// 3D Scene Initialization & Camera Controls
// ---------------------------------------------------------------------------
let scene, camera, renderer, controls;
let viewportEl;
let rotovapModel = null;
let raycaster, mouse;
let clock;

function init3D() {
  viewportEl = document.getElementById('viewport3d');
  if (!viewportEl) return;

  const w = viewportEl.clientWidth || window.innerWidth;
  const h = viewportEl.clientHeight || window.innerHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c1017);
  scene.fog = new THREE.Fog(0x0c1017, 20, 60);

  camera = new THREE.PerspectiveCamera(38, w / h, 0.05, 120);
  camera.position.copy(CAM_ISO.position);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  viewportEl.innerHTML = '';
  viewportEl.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(CAM_ISO.target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.02;
  controls.minDistance = 1.5;
  controls.maxDistance = 25.0;

  // Calibrated Lab Lighting
  const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.55);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfffbf0, 1.4);
  dirLight.position.set(4.0, 24.0, -8.0);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.setScalar(2048);
  dirLight.shadow.bias = -0.0001;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.65);
  fillLight.position.set(-6.0, 18.0, 6.0);
  scene.add(fillLight);

  // Build Epoxy Countertop & Room Environment
  const labRoot = new THREE.Group();
  scene.add(labRoot);
  buildLabRoom(labRoot);

  // Create Rotovap Model seated at Y = 9.00 world (datum Y = 0 local)
  rotovapModel = createRotovapModel();
  rotovapModel.root.position.set(0, BENCH.surfaceY, 0);
  scene.add(rotovapModel.root);

  // Initialize Canvas LCD & Bind Texture
  initLCD();
  rotovapModel.setControllerTexture(lcdTexture);

  // ChemMate Theme Manager
  initChemMateTheme({
    twinName: 'RotovapTwin',
    scene,
    ambLight: ambientLight,
    dirLight,
    rimLight: fillLight,
    onThemeChange: () => {
      renderLCD();
    },
  });

  // Populate Part Explorer
  initPartExplorer();

  clock = new THREE.Clock();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener('resize', onResize);
  renderer.domElement.addEventListener('click', onSceneClick);
}

function onResize() {
  if (!viewportEl || !camera || !renderer) return;
  const w = viewportEl.clientWidth || window.innerWidth;
  const h = viewportEl.clientHeight || window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

// ---------------------------------------------------------------------------
// Camera Presets View Handler
// ---------------------------------------------------------------------------
function setCamView(preset) {
  if (!preset || !camera || !controls) return;
  camera.position.copy(preset.position);
  controls.target.copy(preset.target);
  controls.update();

  document.querySelectorAll('.view-btn').forEach(b => {
    if (b.id.startsWith('btn-cam-')) b.classList.remove('active');
  });
}

// ---------------------------------------------------------------------------
// Part Explorer Implementation
// ---------------------------------------------------------------------------
function initPartExplorer() {
  const listEl = document.getElementById('parts-list');
  const searchInput = document.getElementById('input-part-search');
  const filterBtns = document.querySelectorAll('.part-filter-btn');
  const statusEl = document.getElementById('parts-focus-status');
  const clearBtn = document.getElementById('btn-parts-clear');

  if (!listEl || !rotovapModel || !rotovapModel.partsList) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function renderList() {
    listEl.innerHTML = '';
    const filtered = rotovapModel.partsList.filter(p => {
      const matchCat = currentCategory === 'all' || p.cat.toLowerCase() === currentCategory.toLowerCase();
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery) || p.desc.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    filtered.forEach(p => {
      const item = document.createElement('div');
      item.className = 'part-item';
      item.innerHTML = `<span>${p.name}</span><span class="part-cat-badge">${p.cat}</span>`;
      item.title = p.desc;
      item.addEventListener('click', () => {
        document.querySelectorAll('.part-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        const res = rotovapModel.focusPart(p.name);
        if (statusEl) statusEl.textContent = `Focused: ${p.name} (${p.desc})`;
        if (res && res.center) {
          controls.target.copy(res.center);
          camera.position.set(res.center.x + 1.6, res.center.y + 1.0, res.center.z - 2.0);
          controls.update();
        }
      });
      listEl.appendChild(item);
    });
  }

  renderList();

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderList();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-cat');
      renderList();
    });
  });

  clearBtn?.addEventListener('click', () => {
    document.querySelectorAll('.part-item').forEach(el => el.classList.remove('active'));
    rotovapModel.clearFocus();
    if (statusEl) statusEl.textContent = 'No part focused';
    setCamView(CAM_ISO);
  });
}

// ---------------------------------------------------------------------------
// 3D Interaction & Raycasting
// ---------------------------------------------------------------------------
function onSceneClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(rotovapModel.root.children, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    handlePartInteraction(hit.name);
  }
}

function handlePartInteraction(partName) {
  if (!partName) return;

  if (partName.includes('Power_Plug') || partName.includes('Receptacle')) {
    togglePlug();
  } else if (partName.includes('Btn_MainsSwitch')) {
    togglePower();
  } else if (partName.includes('UI_LCD') || partName.includes('Dial_RotaryPush')) {
    playKnobClick();
    toggleRotation();
  } else if (partName.includes('Btn_Controller_Start')) {
    toggleRotation();
  } else if (partName.includes('Btn_Controller_Mode')) {
    cycleSolvent();
  } else if (partName.includes('Btn_Controller_Aerate') || partName.includes('Valve_AerationStopcock')) {
    aerateVacuum();
  } else if (partName.includes('Clip_CombiClip') || partName.includes('Flask_Evaporating')) {
    playKnobClick();
    state.targetRpm = state.targetRpm === 0 ? 120 : (state.targetRpm === 120 ? 240 : 0);
    const sliderRpm = document.getElementById('slider-rpm');
    if (sliderRpm) sliderRpm.value = state.targetRpm;
    updateUI();
  } else if (partName.includes('Flask_Receiving')) {
    playDripSound();
    state.recvFlaskVol = 0.05;
    updateUI();
  } else if (partName.includes('Bath') || partName.includes('Element_HeaterRing')) {
    toggleHeating();
  } else if (partName.includes('Tower') || partName.includes('Carriage')) {
    toggleLift();
  }
}

// ---------------------------------------------------------------------------
// Physical Circuit Continuity & Action Handlers
// ---------------------------------------------------------------------------
function togglePlug() {
  state.isPluggedIn = !state.isPluggedIn;
  if (rotovapModel && rotovapModel.setPluggedIn) {
    rotovapModel.setPluggedIn(state.isPluggedIn);
  }
  playKnobClick();
  const btn = document.getElementById('btn-plug');
  if (btn) btn.textContent = state.isPluggedIn ? 'CORD: PLUGGED IN' : 'CORD: UNPLUGGED';

  if (!state.isPluggedIn) {
    state.rpm = 0;
    state.heatingOn = false;
    state.isDistilling = false;
    state.dripRate = 0;
    setRotationSound(0);
    updateStatusPill('UNPLUGGED', 'No AC mains electrical continuity', 'fault');
  } else {
    updateStatusPill(state.power ? 'STANDBY' : 'OFF', state.power ? 'Ready for distillation sequence' : 'Mains switch off');
  }
  updateUI();
}

function togglePower() {
  state.power = !state.power;
  playKnobClick();
  const btn = document.getElementById('btn-power');
  if (btn) btn.textContent = state.power ? 'POWER: ON' : 'POWER: OFF';

  if (!state.power) {
    state.rpm = 0;
    state.heatingOn = false;
    state.isDistilling = false;
    state.dripRate = 0;
    setRotationSound(0);
    updateStatusPill('OFF', 'Mains power off', 'fault');
  } else {
    updateStatusPill('STANDBY', 'Ready for distillation sequence');
  }
  updateUI();
}

function updateStatusPill(label, detail, cls = 'open') {
  const pill = document.getElementById('status-pill');
  const det = document.getElementById('status-detail');
  if (pill) {
    pill.textContent = label;
    pill.className = `pill ${cls}`;
  }
  if (det) det.textContent = detail;
}

function toggleLift() {
  if (!state.isPluggedIn || !state.power) return;
  const isUp = state.targetLiftPos < 0.5;
  state.targetLiftPos = isUp ? 1.0 : 0.0;
  playLiftMotor(isUp);
  const btnLift = document.getElementById('btn-lift');
  if (btnLift) btnLift.textContent = state.targetLiftPos > 0.5 ? 'Lower into Bath' : 'Raise Motorized Lift';
  updateUI();
}

function toggleRotation() {
  if (!state.isPluggedIn || !state.power) return;
  state.targetRpm = state.targetRpm === 0 ? 120 : (state.targetRpm === 120 ? 0 : 120);
  const sliderRpm = document.getElementById('slider-rpm');
  if (sliderRpm) sliderRpm.value = state.targetRpm;
  updateUI();
}

function toggleHeating() {
  if (!state.isPluggedIn || !state.power) return;
  state.heatingOn = !state.heatingOn;
  playKnobClick();
  updateUI();
}

function aerateVacuum() {
  playVacuumHiss();
  state.targetVacuumMbar = 1013;
  const sliderVac = document.getElementById('slider-vac');
  if (sliderVac) sliderVac.value = 1013;
  updateUI();
}

function cycleSolvent() {
  const keys = Object.keys(SOLVENTS);
  const curIdx = keys.indexOf(state.currentSolvent.id);
  const nextKey = keys[(curIdx + 1) % keys.length];
  state.currentSolvent = SOLVENTS[nextKey];

  const sel = document.getElementById('solvent-select');
  if (sel) sel.value = nextKey;
  const desc = document.getElementById('solvent-desc');
  if (desc) desc.textContent = state.currentSolvent.desc;
  playKnobClick();
  updateUI();
}

// ---------------------------------------------------------------------------
// Thermodynamics & Vapor Physics Simulation
// ---------------------------------------------------------------------------
function calculateBoilingPoint(solvent, pMbar) {
  const pBar = Math.max(0.01, pMbar / 1000.0);
  const logP = Math.log10(pBar);
  const { A, B, C } = solvent.antoine;
  const tKelvin = B / (A - logP) - C;
  return tKelvin - 273.15;
}

function updatePhysics(dt) {
  if (!state.isPluggedIn || !state.power) {
    if (state.rpm > 0) {
      state.rpm = Math.max(0, state.rpm - dt * 60.0);
      rotovapModel.rotateDriveShaft((state.rpm * (Math.PI * 2) / 60) * dt);
    }
    if (state.bathTemp > 22.0) {
      state.bathTemp = Math.max(22.0, state.bathTemp - dt * 0.10);
    }
    return;
  }

  // 1. Motorized Lift Translation
  if (Math.abs(state.liftPos - state.targetLiftPos) > 0.005) {
    const dir = Math.sign(state.targetLiftPos - state.liftPos);
    state.liftPos += dir * dt * 0.75;
    rotovapModel.setLiftHeight(state.liftPos);
  }

  // 2. BLDC Drive Motor Rotation Acceleration / Braking
  const rpmDiff = state.targetRpm - state.rpm;
  state.rpm += rpmDiff * Math.min(1.0, dt * 3.5);
  if (state.rpm > 5) {
    rotovapModel.rotateDriveShaft((state.rpm * (Math.PI * 2) / 60) * dt);
    setRotationSound(state.rpm);
  } else {
    setRotationSound(0);
  }

  // 3. Heating Bath Thermodynamics
  if (state.heatingOn) {
    if (state.bathTemp < state.targetBathTemp) {
      state.bathTemp += dt * 0.85;
    } else {
      state.bathTemp += (state.targetBathTemp - state.bathTemp) * dt * 0.4;
    }
  } else {
    if (state.bathTemp > 22.0) {
      state.bathTemp -= dt * 0.12;
    }
  }

  // 4. Vacuum System Dynamics
  const vacDiff = state.targetVacuumMbar - state.vacuumMbar;
  state.vacuumMbar += vacDiff * Math.min(1.0, dt * 1.5);

  // 5. Evaporation Physics (Clausius-Clapeyron)
  const currentBp = calculateBoilingPoint(state.currentSolvent, state.vacuumMbar);
  const flaskImmersed = state.liftPos < 0.35;

  if (flaskImmersed && state.bathTemp > currentBp && state.evapFlaskVol > 0.01 && state.rpm > 20) {
    state.isDistilling = true;
    const deltaT = state.bathTemp - currentBp;
    state.dripRate = Math.min(1.0, (deltaT * 0.04) * (0.5 + (state.rpm / 280) * 0.8));

    const transferred = state.dripRate * dt * 0.008;
    state.evapFlaskVol = Math.max(0.0, state.evapFlaskVol - transferred);
    state.recvFlaskVol = Math.min(0.95, state.recvFlaskVol + transferred);

    state.dripTimer += dt * state.dripRate * 4.0;
    if (state.dripTimer > 1.0) {
      state.dripTimer = 0.0;
      playDripSound();
    }
  } else {
    state.isDistilling = false;
    state.dripRate = 0.0;
  }

  rotovapModel.updateLiquidLevels(state.evapFlaskVol, state.recvFlaskVol);
  rotovapModel.updateDripAnimation(performance.now() / 1000, state.dripRate);
}

// ---------------------------------------------------------------------------
// UI DOM Binding
// ---------------------------------------------------------------------------
function updateUI() {
  if (state.isPluggedIn && state.power) {
    if (state.isDistilling) {
      updateStatusPill('DISTILLING', `Evaporating at ${(state.dripRate * 12).toFixed(1)} mL/min`, 'run');
    } else if (state.heatingOn) {
      updateStatusPill('HEATING', `Bath warming to ${state.targetBathTemp}°C`, 'open');
    } else {
      updateStatusPill('STANDBY', 'Ready for distillation sequence', '');
    }
  }

  const btnHeat = document.getElementById('btn-heat');
  if (btnHeat) {
    btnHeat.textContent = state.heatingOn ? 'Turn Heating OFF' : 'Turn Heating ON';
    btnHeat.classList.toggle('btn-primary', state.heatingOn);
  }

  const rpmVal = document.getElementById('val-rpm');
  if (rpmVal) rpmVal.textContent = `${Math.round(state.targetRpm)} RPM`;

  const tempVal = document.getElementById('val-temp');
  if (tempVal) tempVal.textContent = `${state.targetBathTemp}°C`;

  const vacVal = document.getElementById('val-vac');
  if (vacVal) vacVal.textContent = `${Math.round(state.targetVacuumMbar)} mbar`;

  renderLCD();
}

function bindDOMControls() {
  document.getElementById('btn-power')?.addEventListener('click', togglePower);
  document.getElementById('btn-plug')?.addEventListener('click', togglePlug);

  document.getElementById('btn-lift')?.addEventListener('click', toggleLift);
  document.getElementById('btn-heat')?.addEventListener('click', toggleHeating);
  document.getElementById('btn-aerate')?.addEventListener('click', aerateVacuum);
  document.getElementById('btn-refill')?.addEventListener('click', () => {
    playKnobClick();
    state.evapFlaskVol = 0.85;
    state.recvFlaskVol = 0.05;
    updateUI();
  });

  // Camera preset buttons
  document.getElementById('btn-cam-iso')?.addEventListener('click', () => setCamView(CAM_ISO));
  document.getElementById('btn-cam-front')?.addEventListener('click', () => setCamView(CAM_FRONT));
  document.getElementById('btn-cam-side')?.addEventListener('click', () => setCamView(CAM_SIDE));
  document.getElementById('btn-cam-top')?.addEventListener('click', () => setCamView(CAM_TOP));
  document.getElementById('btn-cam-console')?.addEventListener('click', () => setCamView(CAM_CONSOLE));
  document.getElementById('btn-cam-exploded')?.addEventListener('click', () => setCamView(CAM_EXPLODED));

  // Sliders
  document.getElementById('slider-rpm')?.addEventListener('input', (e) => {
    state.targetRpm = parseInt(e.target.value);
    updateUI();
  });
  document.getElementById('slider-temp')?.addEventListener('input', (e) => {
    state.targetBathTemp = parseInt(e.target.value);
    updateUI();
  });
  document.getElementById('slider-vac')?.addEventListener('input', (e) => {
    state.targetVacuumMbar = parseInt(e.target.value);
    updateUI();
  });

  // Solvent Select
  const solventSelect = document.getElementById('solvent-select');
  if (solventSelect) {
    Object.keys(SOLVENTS).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = SOLVENTS[key].name;
      solventSelect.appendChild(opt);
    });
    solventSelect.addEventListener('change', (e) => {
      state.currentSolvent = SOLVENTS[e.target.value] || SOLVENTS.ethanol;
      const desc = document.getElementById('solvent-desc');
      if (desc) desc.textContent = state.currentSolvent.desc;
      updateUI();
    });
  }

  // Preset button: Auto "Delta 20" Rule
  document.getElementById('btn-preset-40')?.addEventListener('click', () => {
    playKnobClick();
    state.heatingOn = true;
    state.targetBathTemp = 45.0;
    if (state.currentSolvent === SOLVENTS.ethanol) state.targetVacuumMbar = 175;
    else if (state.currentSolvent === SOLVENTS.acetone) state.targetVacuumMbar = 556;
    else if (state.currentSolvent === SOLVENTS.methanol) state.targetVacuumMbar = 337;
    else if (state.currentSolvent === SOLVENTS.ethyl_acetate) state.targetVacuumMbar = 240;
    else if (state.currentSolvent === SOLVENTS.water) state.targetVacuumMbar = 72;

    const sliderVac = document.getElementById('slider-vac');
    if (sliderVac) sliderVac.value = state.targetVacuumMbar;
    const sliderTemp = document.getElementById('slider-temp');
    if (sliderTemp) sliderTemp.value = state.targetBathTemp;
    updateUI();
  });

  // View Toolbar Buttons
  document.getElementById('btn-explode')?.addEventListener('click', (e) => {
    state.exploded = !state.exploded;
    e.currentTarget.classList.toggle('active', state.exploded);
    e.currentTarget.textContent = state.exploded ? 'Assemble Mesh' : 'Explode Mesh';
    rotovapModel.setExplodeAmount(state.exploded ? 1.0 : 0.0);
  });

  document.getElementById('btn-wireframe')?.addEventListener('click', (e) => {
    state.wireframe = !state.wireframe;
    e.currentTarget.classList.toggle('active', state.wireframe);
    rotovapModel.setWireframe(state.wireframe);
  });

  document.getElementById('btn-auto-rotate')?.addEventListener('click', (e) => {
    state.autoRotate = !state.autoRotate;
    e.currentTarget.classList.toggle('active', state.autoRotate);
    controls.autoRotate = state.autoRotate;
  });

  document.getElementById('orbit-speed')?.addEventListener('input', (e) => {
    controls.autoRotateSpeed = parseFloat(e.target.value);
    const lbl = document.getElementById('orbit-speed-val');
    if (lbl) lbl.textContent = `${e.target.value}×`;
  });

  document.getElementById('lab-light')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    const lbl = document.getElementById('lab-light-val');
    if (lbl) lbl.textContent = `${val.toFixed(1)}×`;
    renderer.toneMappingExposure = 1.15 * val;
  });

  document.getElementById('btn-sfx-mute')?.addEventListener('click', (e) => {
    const muted = !isSfxMuted();
    setSfxMuted(muted);
    e.currentTarget.textContent = muted ? 'Unmute SFX' : 'Mute SFX';
    e.currentTarget.classList.toggle('active', muted);
  });

  // Collapsible panels
  document.querySelectorAll('.panel-collapse-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.getAttribute('data-collapse');
      const panel = document.getElementById(`panel-${panelId}`);
      if (panel) {
        panel.classList.toggle('collapsed');
        const isCollapsed = panel.classList.contains('collapsed');
        btn.textContent = isCollapsed ? '▸' : '▾';
        btn.setAttribute('aria-expanded', !isCollapsed);
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Animation Loop
// ---------------------------------------------------------------------------
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  updatePhysics(dt);
  renderLCD();
  controls.update();
  renderer.render(scene, camera);
}

function boot() {
  init3D();
  bindDOMControls();
  updateUI();
  animate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
