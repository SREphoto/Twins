/**
 * SREdesigns KNF Laboport N820 / N840 Diaphragm Vacuum Pump Twin
 * Complete Client-Side Controller, Physics Simulation & 3D Interactive Runtime
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  createVacuumPumpModel,
  buildLabRoom,
  BENCH,
  CAM_ISO,
  CAM_FRONT,
  CAM_SIDE,
  CAM_TOP,
  CAM_CONSOLE,
  CAM_EXPLODED,
  CAM_MOTOR_INTERIOR,
  CAM_HEAD_INTERIOR,
} from './vacuum_pump3d.js?v=20261018-1';
import { initChemMateTheme } from '../../../lab_viewer/shared/chemmate_theme_manager.js';
import {
  playClick,
  playKnobTick,
  startMotorHum,
  updateMotorPitch,
  stopMotorHum,
  setGasBallastSound,
  startAlarm,
  stopAlarm,
  setSfxMuted,
  isSfxMuted,
} from './sfx.js?v=20261018-1';

// ---------------------------------------------------------------------------
// Physical Controller State Engine (Dual-Truth Python Mirror)
// ---------------------------------------------------------------------------
const STATE = {
  state: 'OFF', // UNPOWERED, OFF, IDLE, STARTING, RUNNING, RUNNING_BALLAST, STOPPING, FAULT_OVERHEAT
  is_plugged_in: true,
  power_on: false,
  gas_ballast_open: false,
  system_vacuum_mbar: 1013.0,
  motor_speed_rpm: 0.0,
  target_rpm: 1500.0,
  motor_temp_c: 22.0,
  ambient_temp_c: 22.0,
  overheat_temp_c: 130.0,
  reset_temp_c: 80.0,
  ultimate_vacuum_mbar: 80.0,
  max_flow_lmin: 15.0,
};

// 3D Scene Globals
let scene, camera, renderer, controls;
let viewportEl;
let pumpModel = null;
let raycaster, mouse;
let clock;
let ambientLight, dirLight, fillLight;

// Real-time Trend Graph Variables
let graphCanvas, graphCtx;
const pressureHistory = [];
const maxHistoryPoints = 140;

// Explode & Wireframe State
let explodeVal = 0.0;
let isExploding = false;
let isWireframe = false;
let autoRotate = false;
let autoRotateSpeed = 1.0;

// Demo Loop State
let isDemoRunning = false;
let demoStep = 0;
let demoTimer = 0;

// ---------------------------------------------------------------------------
// Main Application Entry Point
// ---------------------------------------------------------------------------
function init() {
  viewportEl = document.getElementById('canvas-container');
  if (!viewportEl) return;

  const w = viewportEl.clientWidth || window.innerWidth;
  const h = viewportEl.clientHeight || window.innerHeight;

  // 1. Scene & Calibrated Lighting
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c1017);
  scene.fog = new THREE.Fog(0x0c1017, 15, 50);

  camera = new THREE.PerspectiveCamera(40, w / h, 0.05, 100);
  camera.position.copy(CAM_ISO.position);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  viewportEl.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(CAM_ISO.target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.02; // Restrict camera above floor
  controls.minDistance = 0.8;
  controls.maxDistance = 20.0;

  ambientLight = new THREE.AmbientLight(0xdbeafe, 0.55);
  scene.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xfffbf0, 1.4);
  dirLight.position.set(3.0, 20.0, -6.0);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.setScalar(2048);
  dirLight.shadow.bias = -0.0001;
  scene.add(dirLight);

  fillLight = new THREE.DirectionalLight(0x93c5fd, 0.65);
  fillLight.position.set(-5.0, 16.0, 5.0);
  scene.add(fillLight);

  // 2. Build Laboratory Countertop & Environment
  const labRoot = new THREE.Group();
  scene.add(labRoot);
  buildLabRoom(labRoot);

  // 3. Create Vacuum Pump Model seated at datum Y = 9.00 world (Y = 0 local)
  pumpModel = createVacuumPumpModel();
  pumpModel.root.position.set(0, BENCH.surfaceY, 0);
  scene.add(pumpModel.root);

  // 4. ChemMate Theme Manager
  initChemMateTheme({
    twinName: 'VacuumPumpTwin',
    scene,
    ambLight: ambientLight,
    dirLight,
    rimLight: fillLight,
    onThemeChange: () => {},
  });

  // 5. Setup Trend Graph, Part Explorer, SFX & Controls
  initTrendGraph();
  initPartExplorer();
  initEventListeners();

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  clock = new THREE.Clock();

  window.addEventListener('resize', onWindowResize);
  renderer.domElement.addEventListener('pointerdown', onSceneClick);

  animate();
}

// ---------------------------------------------------------------------------
// Camera Presets View Handler
// ---------------------------------------------------------------------------
function setCamView(preset) {
  if (!preset || !camera || !controls) return;
  camera.position.copy(preset.position);
  controls.target.copy(preset.target);
  controls.update();

  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  if (preset === CAM_ISO) document.getElementById('btn-cam-iso')?.classList.add('active');
  else if (preset === CAM_FRONT) document.getElementById('btn-cam-front')?.classList.add('active');
  else if (preset === CAM_SIDE) document.getElementById('btn-cam-side')?.classList.add('active');
  else if (preset === CAM_TOP) document.getElementById('btn-cam-top')?.classList.add('active');
  else if (preset === CAM_CONSOLE) document.getElementById('btn-cam-console')?.classList.add('active');
  else if (preset === CAM_EXPLODED) document.getElementById('btn-cam-exploded')?.classList.add('active');
}

// ---------------------------------------------------------------------------
// Trend Graph Canvas
// ---------------------------------------------------------------------------
function initTrendGraph() {
  graphCanvas = document.getElementById('graph-canvas');
  if (graphCanvas) graphCtx = graphCanvas.getContext('2d');
}

function updateTrendGraph() {
  if (!graphCtx || !graphCanvas) return;
  const w = graphCanvas.width;
  const h = graphCanvas.height;

  pressureHistory.push(STATE.system_vacuum_mbar);
  if (pressureHistory.length > maxHistoryPoints) pressureHistory.shift();

  graphCtx.fillStyle = '#080d14';
  graphCtx.fillRect(0, 0, w, h);

  // Grid Lines
  graphCtx.strokeStyle = '#1e293b';
  graphCtx.lineWidth = 1;
  for (let gy = 20; gy < h; gy += 25) {
    graphCtx.beginPath();
    graphCtx.moveTo(0, gy);
    graphCtx.lineTo(w, gy);
    graphCtx.stroke();
  }

  // Draw Pressure Trace Line
  graphCtx.strokeStyle = STATE.gas_ballast_open ? '#f59e0b' : '#00d4e8';
  graphCtx.lineWidth = 2;
  graphCtx.beginPath();

  pressureHistory.forEach((p, idx) => {
    const x = (idx / (maxHistoryPoints - 1)) * w;
    // Map 1013 mbar -> h - 4, 0 mbar -> 4
    const norm = (1013.0 - p) / 1013.0;
    const y = h - 6 - norm * (h - 12);
    if (idx === 0) graphCtx.moveTo(x, y);
    else graphCtx.lineTo(x, y);
  });
  graphCtx.stroke();

  // Current Point Dot
  if (pressureHistory.length > 0) {
    const lastP = pressureHistory[pressureHistory.length - 1];
    const norm = (1013.0 - lastP) / 1013.0;
    const dotX = ((pressureHistory.length - 1) / (maxHistoryPoints - 1)) * w;
    const dotY = h - 6 - norm * (h - 12);

    graphCtx.fillStyle = '#4ade80';
    graphCtx.beginPath();
    graphCtx.arc(dotX, dotY, 4, 0, Math.PI * 2);
    graphCtx.fill();
  }
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

  if (!listEl || !pumpModel || !pumpModel.partsList) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function renderList() {
    listEl.innerHTML = '';
    const filtered = pumpModel.partsList.filter(p => {
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
        const res = pumpModel.focusPart(p.name);
        if (statusEl) statusEl.textContent = `Focused: ${p.name} (${p.desc})`;
        if (res && res.center) {
          controls.target.copy(res.center);
          const maxDim = res.size ? Math.max(res.size.x, res.size.y, res.size.z) : 0.6;
          const dist = Math.max(1.4, maxDim * 2.8);
          camera.position.set(res.center.x + dist * 0.7, res.center.y + dist * 0.4, res.center.z - dist * 0.8);
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
    pumpModel.clearFocus();
    if (statusEl) statusEl.textContent = 'No part focused';
    setCamView(CAM_ISO);
  });
}

// ---------------------------------------------------------------------------
// 3D Raycasting & Direct Part Interaction
// ---------------------------------------------------------------------------
function onSceneClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(pumpModel.root.children, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    handlePartInteraction(hit.name);
  }
}

function handlePartInteraction(partName) {
  if (!partName) return;

  if (partName.includes('Power_Plug') || partName.includes('Receptacle')) {
    togglePlug();
  } else if (partName.includes('Btn_Power_Switch') || partName.includes('Rocker')) {
    togglePower();
  } else if (partName.includes('Knob_GasBallast')) {
    toggleBallast();
  } else if (partName.includes('Dial_Speed') || partName.includes('Gauge')) {
    // Jump to console view
    setCamView(CAM_CONSOLE);
  }
}

// ---------------------------------------------------------------------------
// Interactive Action Handlers
// ---------------------------------------------------------------------------
function togglePower() {
  playClick();
  STATE.power_on = !STATE.power_on;
  if (!STATE.is_plugged_in) {
    STATE.state = 'UNPOWERED';
  } else if (!STATE.power_on) {
    STATE.state = 'STOPPING';
    stopMotorHum();
  } else {
    if (STATE.motor_temp_c >= STATE.overheat_temp_c) {
      STATE.state = 'FAULT_OVERHEAT';
      startAlarm();
    } else {
      STATE.state = 'IDLE';
    }
  }
  updateUI();
}

function togglePlug() {
  playClick();
  STATE.is_plugged_in = !STATE.is_plugged_in;
  pumpModel.setPluggedIn(STATE.is_plugged_in);

  if (!STATE.is_plugged_in) {
    STATE.state = 'UNPOWERED';
    STATE.motor_speed_rpm = 0.0;
    stopMotorHum();
    stopAlarm();
  } else {
    if (STATE.power_on) {
      STATE.state = 'IDLE';
    } else {
      STATE.state = 'OFF';
    }
  }
  updateUI();
}

function toggleBallast() {
  playKnobTick();
  STATE.gas_ballast_open = !STATE.gas_ballast_open;
  setGasBallastSound(STATE.gas_ballast_open && STATE.state === 'RUNNING');
  if (STATE.state === 'RUNNING' && STATE.gas_ballast_open) {
    STATE.state = 'RUNNING_BALLAST';
  } else if (STATE.state === 'RUNNING_BALLAST' && !STATE.gas_ballast_open) {
    STATE.state = 'RUNNING';
  }
  updateUI();
}

function triggerOverheatFault() {
  STATE.motor_temp_c = STATE.overheat_temp_c + 2.0;
  STATE.state = 'FAULT_OVERHEAT';
  stopMotorHum();
  startAlarm();
  updateUI();
}

// ---------------------------------------------------------------------------
// UI Event Listeners & Sliders
// ---------------------------------------------------------------------------
function initEventListeners() {
  // Power & Plug Buttons
  document.getElementById('btn-power')?.addEventListener('click', togglePower);
  document.getElementById('btn-plug')?.addEventListener('click', togglePlug);
  document.getElementById('btn-ballast')?.addEventListener('click', toggleBallast);
  document.getElementById('btn-fault')?.addEventListener('click', triggerOverheatFault);

  // Speed Slider
  const speedSlider = document.getElementById('slider-speed');
  speedSlider?.addEventListener('input', (e) => {
    STATE.target_rpm = parseFloat(e.target.value);
    document.getElementById('val-speed-pot').textContent = `${Math.round(STATE.target_rpm)} RPM`;
  });

  // Camera Presets
  document.getElementById('btn-cam-iso')?.addEventListener('click', () => setCamView(CAM_ISO));
  document.getElementById('btn-cam-front')?.addEventListener('click', () => setCamView(CAM_FRONT));
  document.getElementById('btn-cam-side')?.addEventListener('click', () => setCamView(CAM_SIDE));
  document.getElementById('btn-cam-top')?.addEventListener('click', () => setCamView(CAM_TOP));
  document.getElementById('btn-cam-console')?.addEventListener('click', () => setCamView(CAM_CONSOLE));
  document.getElementById('btn-cam-exploded')?.addEventListener('click', () => setCamView(CAM_EXPLODED));

  // Explode & Wireframe Toggles
  document.getElementById('btn-explode')?.addEventListener('click', () => {
    isExploding = !isExploding;
    const btn = document.getElementById('btn-explode');
    if (btn) btn.textContent = isExploding ? 'Assemble Mesh' : 'Explode Mesh';
  });

  document.getElementById('btn-wireframe')?.addEventListener('click', () => {
    isWireframe = !isWireframe;
    pumpModel.setWireframe(isWireframe);
    document.getElementById('btn-wireframe')?.classList.toggle('active', isWireframe);
  });

  // Auto-rotate & Sliders
  document.getElementById('btn-auto-rotate')?.addEventListener('click', () => {
    autoRotate = !autoRotate;
    controls.autoRotate = autoRotate;
    document.getElementById('btn-auto-rotate')?.classList.toggle('active', autoRotate);
  });

  document.getElementById('orbit-speed')?.addEventListener('input', (e) => {
    autoRotateSpeed = parseFloat(e.target.value);
    controls.autoRotateSpeed = autoRotateSpeed * 2.0;
    const lbl = document.getElementById('orbit-speed-val');
    if (lbl) lbl.textContent = `${autoRotateSpeed.toFixed(1)}×`;
  });

  document.getElementById('lab-light')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    dirLight.intensity = 1.4 * val;
    fillLight.intensity = 0.65 * val;
    ambientLight.intensity = 0.55 * val;
    const lbl = document.getElementById('lab-light-val');
    if (lbl) lbl.textContent = `${val.toFixed(1)}×`;
  });

  document.getElementById('btn-mute-sfx')?.addEventListener('click', () => {
    const muted = !isSfxMuted();
    setSfxMuted(muted);
    const btn = document.getElementById('btn-mute-sfx');
    if (btn) btn.classList.toggle('active', muted);
  });

  // Educational Demo Loop
  document.getElementById('btn-demo')?.addEventListener('click', () => {
    isDemoRunning = !isDemoRunning;
    demoStep = 0;
    demoTimer = 0;
    const btn = document.getElementById('btn-demo');
    if (btn) btn.textContent = isDemoRunning ? 'Stop Demo' : 'Demo Loop';
  });
}

// ---------------------------------------------------------------------------
// Educational Demo Loop Sequence
// ---------------------------------------------------------------------------
function tickDemo(dt) {
  if (!isDemoRunning) return;
  demoTimer += dt;

  if (demoStep === 0 && demoTimer > 1.0) {
    // Step 1: Ensure plugged in and turn ON
    if (!STATE.is_plugged_in) togglePlug();
    if (!STATE.power_on) togglePower();
    setCamView(CAM_FRONT);
    demoStep = 1;
    demoTimer = 0;
  } else if (demoStep === 1 && demoTimer > 5.0) {
    // Step 2: Set speed to 2500 RPM & Zoom to Console
    STATE.target_rpm = 2500;
    document.getElementById('slider-speed').value = 2500;
    document.getElementById('val-speed-pot').textContent = '2500 RPM';
    setCamView(CAM_CONSOLE);
    demoStep = 2;
    demoTimer = 0;
  } else if (demoStep === 2 && demoTimer > 6.0) {
    // Step 3: Open Gas Ballast to purge vapors
    if (!STATE.gas_ballast_open) toggleBallast();
    setCamView(CAM_ISO);
    demoStep = 3;
    demoTimer = 0;
  } else if (demoStep === 3 && demoTimer > 6.0) {
    // Step 4: Close Ballast & Observe Deep Evacuation
    if (STATE.gas_ballast_open) toggleBallast();
    demoStep = 4;
    demoTimer = 0;
  } else if (demoStep === 4 && demoTimer > 6.0) {
    // Step 5: Explode Mesh to inspect interior
    isExploding = true;
    setCamView(CAM_EXPLODED);
    demoStep = 5;
    demoTimer = 0;
  } else if (demoStep === 5 && demoTimer > 7.0) {
    // Step 6: Assemble, return to ISO, and shut down
    isExploding = false;
    setCamView(CAM_ISO);
    if (STATE.power_on) togglePower();
    demoStep = 0;
    demoTimer = 0;
    isDemoRunning = false;
    const btn = document.getElementById('btn-demo');
    if (btn) btn.textContent = 'Demo Loop';
  }
}

// ---------------------------------------------------------------------------
// Physical Physics & State Machine Tick
// ---------------------------------------------------------------------------
function tickPhysics(dt) {
  // Physical Circuit Continuity
  if (!STATE.is_plugged_in) {
    STATE.state = 'UNPOWERED';
    STATE.motor_speed_rpm = Math.max(0.0, STATE.motor_speed_rpm - 2000.0 * dt);
    STATE.motor_temp_c = Math.max(STATE.ambient_temp_c, STATE.motor_temp_c - 0.5 * dt);
    // Passive leak-back
    const leakRate = 0.08;
    STATE.system_vacuum_mbar += (1013.0 - STATE.system_vacuum_mbar) * (1.0 - Math.exp(-leakRate * dt));
    return;
  }

  // Thermal Simulation
  if (STATE.state === 'STARTING' || STATE.state === 'RUNNING' || STATE.state === 'RUNNING_BALLAST') {
    const rpmRatio = STATE.motor_speed_rpm / 3000.0;
    const heatRate = 1.2 * (rpmRatio * rpmRatio) + 0.2;
    STATE.motor_temp_c += heatRate * dt;
  } else {
    const coolRate = 0.5;
    STATE.motor_temp_c = Math.max(STATE.ambient_temp_c, STATE.motor_temp_c - coolRate * dt);
  }

  // Thermal Overheat Safety Interlock
  if (STATE.motor_temp_c >= STATE.overheat_temp_c && STATE.state !== 'FAULT_OVERHEAT') {
    STATE.state = 'FAULT_OVERHEAT';
    stopMotorHum();
    startAlarm();
  }

  if (STATE.state === 'FAULT_OVERHEAT') {
    STATE.motor_speed_rpm = Math.max(0.0, STATE.motor_speed_rpm - 1500.0 * dt);
    if (STATE.motor_temp_c <= STATE.reset_temp_c) {
      stopAlarm();
      STATE.state = STATE.power_on ? 'STARTING' : 'OFF';
    }
  }

  // Motor Acceleration / Deceleration
  if (STATE.state === 'OFF') {
    STATE.motor_speed_rpm = Math.max(0.0, STATE.motor_speed_rpm - 1500.0 * dt);
  } else if (STATE.state === 'IDLE') {
    STATE.motor_speed_rpm = Math.max(0.0, STATE.motor_speed_rpm - 1500.0 * dt);
    if (STATE.power_on) STATE.state = 'STARTING';
  } else if (STATE.state === 'STARTING') {
    if (!STATE.power_on) {
      STATE.state = 'STOPPING';
    } else {
      STATE.motor_speed_rpm = Math.min(STATE.target_rpm, STATE.motor_speed_rpm + 1000.0 * dt);
      if (STATE.motor_speed_rpm >= STATE.target_rpm) {
        STATE.state = STATE.gas_ballast_open ? 'RUNNING_BALLAST' : 'RUNNING';
        startMotorHum();
      }
    }
  } else if (STATE.state === 'RUNNING' || STATE.state === 'RUNNING_BALLAST') {
    if (!STATE.power_on) {
      STATE.state = 'STOPPING';
    } else {
      if (STATE.motor_speed_rpm < STATE.target_rpm) {
        STATE.motor_speed_rpm = Math.min(STATE.target_rpm, STATE.motor_speed_rpm + 1000.0 * dt);
      } else if (STATE.motor_speed_rpm > STATE.target_rpm) {
        STATE.motor_speed_rpm = Math.max(STATE.target_rpm, STATE.motor_speed_rpm - 1000.0 * dt);
      }
      updateMotorPitch(STATE.motor_speed_rpm);
    }
  } else if (STATE.state === 'STOPPING') {
    STATE.motor_speed_rpm = Math.max(0.0, STATE.motor_speed_rpm - 1500.0 * dt);
    if (STATE.motor_speed_rpm <= 0.0) {
      STATE.state = STATE.power_on ? 'IDLE' : 'OFF';
      stopMotorHum();
    }
  }

  // Evacuation & Boyle-Mariotte Curves
  const isPumping = (STATE.state === 'STARTING' || STATE.state === 'RUNNING' || STATE.state === 'RUNNING_BALLAST');
  if (isPumping && STATE.motor_speed_rpm > 100.0) {
    const limitP = STATE.gas_ballast_open ? (STATE.ultimate_vacuum_mbar + 40.0) : STATE.ultimate_vacuum_mbar;
    const rpmFactor = STATE.motor_speed_rpm / 1500.0;
    const evacRate = 0.18 * rpmFactor;
    STATE.system_vacuum_mbar += (limitP - STATE.system_vacuum_mbar) * (1.0 - Math.exp(-evacRate * dt));
  } else {
    // Passive vacuum leak-back
    const leakRate = 0.08;
    STATE.system_vacuum_mbar += (1013.0 - STATE.system_vacuum_mbar) * (1.0 - Math.exp(-leakRate * dt));
  }

  STATE.system_vacuum_mbar = Math.max(STATE.ultimate_vacuum_mbar, Math.min(1013.0, STATE.system_vacuum_mbar));
}

// ---------------------------------------------------------------------------
// Telemetry & UI Display Sync
// ---------------------------------------------------------------------------
function updateUI() {
  const pill = document.getElementById('status-pill');
  const detail = document.getElementById('status-detail');

  if (pill && detail) {
    pill.className = 'pill';
    if (!STATE.is_plugged_in) {
      pill.textContent = 'UNPLUGGED';
      detail.textContent = 'Disconnected from bench electrical receptacle';
    } else if (STATE.state === 'FAULT_OVERHEAT') {
      pill.textContent = 'OVERHEAT';
      pill.classList.add('fault');
      detail.textContent = 'Motor thermal cutout tripped (>130°C)';
    } else if (STATE.state === 'RUNNING_BALLAST') {
      pill.textContent = 'BALLAST OPEN';
      pill.classList.add('ballast');
      detail.textContent = 'Purging condensable vapors at elevated limit';
    } else if (STATE.state === 'RUNNING' || STATE.state === 'STARTING') {
      pill.textContent = 'RUNNING';
      pill.classList.add('run');
      detail.textContent = `Evacuating system at ${Math.round(STATE.motor_speed_rpm)} RPM`;
    } else {
      pill.textContent = STATE.state;
      detail.textContent = 'Ready for operation';
    }
  }

  // Button text sync
  const pBtn = document.getElementById('btn-power');
  if (pBtn) {
    pBtn.textContent = `POWER: ${STATE.power_on ? 'ON' : 'OFF'}`;
    pBtn.classList.toggle('on', STATE.power_on);
  }

  const cordBtn = document.getElementById('btn-plug');
  if (cordBtn) {
    cordBtn.textContent = `CORD: ${STATE.is_plugged_in ? 'PLUGGED IN' : 'UNPLUGGED'}`;
    cordBtn.classList.toggle('unplugged', !STATE.is_plugged_in);
  }

  const bBtn = document.getElementById('btn-ballast');
  if (bBtn) {
    bBtn.textContent = `GAS BALLAST: ${STATE.gas_ballast_open ? 'OPEN' : 'CLOSED'}`;
    bBtn.classList.toggle('btn-primary', STATE.gas_ballast_open);
  }

  // Metric displays
  const vacMbar = Math.round(STATE.system_vacuum_mbar);
  const vacMmHg = Math.round(STATE.system_vacuum_mbar * 0.750062);
  const dispVac = document.getElementById('disp-vacuum');
  if (dispVac) dispVac.innerHTML = `${vacMbar} <span class="unit">mbar</span>`;

  const dispMmHg = document.getElementById('disp-vacuum-mmhg');
  if (dispMmHg) dispMmHg.textContent = `${vacMmHg} mmHg`;

  // Flow rate
  const pRatio = Math.max(0.0, Math.min(1.0, (STATE.system_vacuum_mbar - STATE.ultimate_vacuum_mbar) / (1013.0 - STATE.ultimate_vacuum_mbar)));
  const speedFactor = STATE.motor_speed_rpm / 1500.0;
  const flow = (STATE.motor_speed_rpm > 100) ? (STATE.max_flow_lmin * speedFactor * pRatio).toFixed(2) : '0.00';

  const dispFlow = document.getElementById('disp-flow');
  if (dispFlow) dispFlow.innerHTML = `${flow} <span class="unit">L/min</span>`;

  const dispRpm = document.getElementById('disp-rpm');
  if (dispRpm) dispRpm.innerHTML = `${Math.round(STATE.motor_speed_rpm)} <span class="unit">RPM</span>`;

  const dispTemp = document.getElementById('disp-temp');
  if (dispTemp) dispTemp.innerHTML = `${STATE.motor_temp_c.toFixed(1)} <span class="unit">°C</span>`;
}

// ---------------------------------------------------------------------------
// Main Animation & Render Loop
// ---------------------------------------------------------------------------
let graphTimer = 0;

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.1);

  // Physics & Demo ticks
  tickPhysics(dt);
  tickDemo(dt);

  // Smooth Explode Mesh animation
  if (isExploding && explodeVal < 1.0) {
    explodeVal = Math.min(1.0, explodeVal + dt * 2.0);
    pumpModel.setExplodeAmount(explodeVal);
  } else if (!isExploding && explodeVal > 0.0) {
    explodeVal = Math.max(0.0, explodeVal - dt * 2.0);
    pumpModel.setExplodeAmount(explodeVal);
  }

  // Model Kinematics (Shaft rotation, diaphragm stroke, poppet fluttering, gauge needle)
  if (pumpModel) {
    pumpModel.updateKinematics(dt, STATE);
  }

  // UI & Trend Graph Ticks (at ~10Hz)
  graphTimer += dt;
  if (graphTimer >= 0.10) {
    graphTimer = 0;
    updateUI();
    updateTrendGraph();
  }

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  if (!viewportEl || !camera || !renderer) return;
  const w = viewportEl.clientWidth;
  const h = viewportEl.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', init);
