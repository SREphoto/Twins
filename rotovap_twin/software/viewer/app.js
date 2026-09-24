/**
 * Büchi R-300 Rotary Evaporator App
 * Interactive Three.js Twin + Clausius-Clapeyron Vapor Physics + I-300 Pro Controller
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  createRotovapModel,
  setLiftHeight,
  rotateDriveShaft,
  updateDripAnimation,
  updateLiquidLevels,
  setControllerTexture,
  setExplodeAmount,
  setWireframe,
} from './rotovap3d.js?v=20260906-buchi3';
import {
  playLiftMotor,
  setRotationSound,
  playDripSound,
  playVacuumHiss,
  playKnobClick,
  setSfxMuted,
  isSfxMuted,
} from './sfx.js?v=20260906-gold5';

// ---------------------------------------------------------------------------
// Solvent Vapor Pressure Database (Antoine Equation: log10(P_bar) = A - B/(T + C))
// ---------------------------------------------------------------------------
const SOLVENTS = {
  ethanol: {
    name: 'Ethanol (EtOH)',
    normalBp: 78.4,
    color: 0xf59e0b,
    antoine: { A: 5.24677, B: 1598.673, C: -46.424 }, // P in bar, T in K
    desc: 'Common extraction solvent (MW 46.07 g/mol). Target 40°C bath at 175 mbar.',
  },
  acetone: {
    name: 'Acetone',
    normalBp: 56.1,
    color: 0xfde047,
    antoine: { A: 4.42448, B: 1312.253, C: -32.445 },
    desc: 'Fast evaporating polar solvent (MW 58.08 g/mol). Target 40°C bath at 556 mbar.',
  },
  methanol: {
    name: 'Methanol (MeOH)',
    normalBp: 64.7,
    color: 0xfb923c,
    antoine: { A: 5.20409, B: 1581.341, C: -33.50 },
    desc: 'Polar protic solvent (MW 32.04 g/mol). Target 40°C bath at 337 mbar.',
  },
  ethyl_acetate: {
    name: 'Ethyl Acetate (EtOAc)',
    normalBp: 77.1,
    color: 0xeab308,
    antoine: { A: 4.22809, B: 1245.702, C: -55.21 },
    desc: 'Versatile ester solvent (MW 88.11 g/mol). Target 40°C bath at 240 mbar.',
  },
  water: {
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
  power: true,
  currentSolvent: SOLVENTS.ethanol,

  // Mechanical states
  rpm: 120,
  targetRpm: 120,
  liftPos: 0.0, // 0 = lowered in bath, 1 = raised
  targetLiftPos: 0.0,

  // Thermal & Pressure Parameters
  bathTemp: 22.0,
  targetBathTemp: 45.0,
  heatingOn: false,
  vacuumMbar: 1013,
  targetVacuumMbar: 175,

  // Liquid volumes (fractions 0 to 1)
  evapFlaskVol: 0.8,
  recvFlaskVol: 0.05,

  // Distillation physics
  isDistilling: false,
  dripRate: 0.0,
  dripTimer: 0.0,
};

// ---------------------------------------------------------------------------
// Canvas LCD Generator (I-300 Pro Controller Display)
// ---------------------------------------------------------------------------
const lcdCanvas = document.createElement('canvas');
lcdCanvas.width = 1024;
lcdCanvas.height = 512;
const lcdCtx = lcdCanvas.getContext('2d');
const lcdTexture = new THREE.CanvasTexture(lcdCanvas);
lcdTexture.colorSpace = THREE.SRGBColorSpace;
lcdTexture.minFilter = THREE.LinearFilter;

function renderLCD() {
  if (!lcdCtx) return;

  // Background
  lcdCtx.fillStyle = '#0a101d';
  lcdCtx.fillRect(0, 0, 1024, 512);

  // Top header bar
  lcdCtx.fillStyle = '#111c30';
  lcdCtx.fillRect(0, 0, 1024, 64);

  lcdCtx.font = 'bold 26px "IBM Plex Sans", sans-serif';
  lcdCtx.fillStyle = '#00d4e8';
  lcdCtx.fillText('BUCHI I-300 PRO', 30, 42);

  lcdCtx.font = 'bold 18px "IBM Plex Sans", sans-serif';
  lcdCtx.fillStyle = '#fbbf24';
  lcdCtx.fillText('◆ SREdesigns', 275, 42);

  lcdCtx.font = '20px "IBM Plex Mono", monospace';
  lcdCtx.fillStyle = '#8b9bb0';
  lcdCtx.fillText(state.currentSolvent.name, 440, 42);

  // Status badge
  const isBoiling = state.isDistilling;
  lcdCtx.fillStyle = isBoiling ? '#103824' : '#1c2838';
  lcdCtx.fillRect(780, 14, 210, 36);
  lcdCtx.fillStyle = isBoiling ? '#3dd68c' : '#00d4e8';
  lcdCtx.font = 'bold 18px "IBM Plex Sans"';
  lcdCtx.fillText(isBoiling ? 'DISTILLING' : 'STANDBY', 835, 39);

  // 3 Primary Gauges: Rotation | Bath Temp | Vacuum
  const colW = 320;
  const metrics = [
    { label: 'ROTATION', val: `${Math.round(state.rpm)}`, unit: 'rpm', set: `Set: ${state.targetRpm}`, color: '#e6edf5' },
    { label: 'BATH TEMP', val: `${state.bathTemp.toFixed(1)}`, unit: '°C', set: `Set: ${state.targetBathTemp.toFixed(1)}°C`, color: state.heatingOn ? '#f0b429' : '#e6edf5' },
    { label: 'VACUUM', val: `${Math.round(state.vacuumMbar)}`, unit: 'mbar', set: `Set: ${state.targetVacuumMbar}`, color: '#00d4e8' },
  ];

  metrics.forEach((m, i) => {
    const bx = 30 + i * 330;
    const by = 90;
    lcdCtx.fillStyle = '#141d2c';
    lcdCtx.strokeStyle = '#2a3b50';
    lcdCtx.lineWidth = 2;
    lcdCtx.beginPath();
    lcdCtx.roundRect(bx, by, colW, 250, 12);
    lcdCtx.fill();
    lcdCtx.stroke();

    lcdCtx.font = 'bold 20px "IBM Plex Sans"';
    lcdCtx.fillStyle = '#8b9bb0';
    lcdCtx.fillText(m.label, bx + 24, by + 38);

    lcdCtx.font = 'bold 74px "IBM Plex Mono", monospace';
    lcdCtx.fillStyle = m.color;
    lcdCtx.fillText(m.val, bx + 24, by + 130);

    lcdCtx.font = 'bold 30px "IBM Plex Sans"';
    lcdCtx.fillStyle = '#00d4e8';
    lcdCtx.fillText(m.unit, bx + 230, by + 125);

    lcdCtx.font = '18px "IBM Plex Sans"';
    lcdCtx.fillStyle = '#64748b';
    lcdCtx.fillText(m.set, bx + 24, by + 215);
  });

  // Bottom telemetry bar
  lcdCtx.fillStyle = '#111c30';
  lcdCtx.fillRect(30, 360, 960, 120);

  lcdCtx.font = '22px "IBM Plex Sans"';
  lcdCtx.fillStyle = '#8b9bb0';
  lcdCtx.fillText('Vapor Temp (Est):', 60, 410);
  lcdCtx.fillStyle = '#3dd68c';
  const estVapor = state.isDistilling ? (state.bathTemp - 3.2).toFixed(1) : '21.5';
  lcdCtx.fillText(`${estVapor} °C`, 260, 410);

  lcdCtx.fillStyle = '#8b9bb0';
  lcdCtx.fillText('Condensate Flow:', 420, 410);
  lcdCtx.fillStyle = '#00d4e8';
  lcdCtx.fillText(`${(state.dripRate * 12).toFixed(1)} mL/min`, 620, 410);

  lcdCtx.fillStyle = '#8b9bb0';
  lcdCtx.fillText('Lift Position:', 780, 410);
  lcdCtx.fillStyle = state.liftPos > 0.5 ? '#f0b429' : '#3dd68c';
  lcdCtx.fillText(state.liftPos > 0.5 ? 'RAISED' : 'IN BATH', 900, 410);

  lcdTexture.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// 3D Scene Initialization & Raycasting
// ---------------------------------------------------------------------------
let scene, camera, renderer, controls;
let model;

const CAM0 = { x: 5.5, y: 16.0, z: -10.5 };
const TGT0 = { x: 0.15, y: 12.0, z: 0.0 };

function cameraDistance() {
  return camera.position.distanceTo(controls.target);
}

function distToZoomPct(dist) {
  const minD = 2.5;
  const maxD = 16.0;
  return THREE.MathUtils.clamp(Math.round(((maxD - dist) / (maxD - minD)) * 100), 0, 100);
}

function zoomPctToDist(pct) {
  const minD = 2.5;
  const maxD = 16.0;
  return maxD - (pct / 100) * (maxD - minD);
}

// Raycasting & Interaction state
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const downPos = { x: 0, y: 0 };
let tooltipEl = null;

function findInteractiveObject(intersects) {
  for (const hit of intersects) {
    let curr = hit.object;
    while (curr && curr !== model && curr !== scene) {
      if (curr.userData && curr.userData.interactive) {
        return { mesh: hit.object, target: curr, hit };
      }
      curr = curr.parent;
    }
  }
  return null;
}

function onPointerMove(e) {
  if (!renderer || !model) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(model.children, true);
  const found = findInteractiveObject(intersects);

  if (found) {
    renderer.domElement.style.cursor = 'pointer';
    const label = found.target.userData.label || found.target.name;
    if (tooltipEl) {
      tooltipEl.textContent = label;
      tooltipEl.style.display = 'block';
      tooltipEl.style.left = `${e.clientX - rect.left}px`;
      tooltipEl.style.top = `${e.clientY - rect.top}px`;
    }
  } else {
    renderer.domElement.style.cursor = 'default';
    if (tooltipEl) tooltipEl.style.display = 'none';
  }
}

function onPointerDown(e) {
  downPos.x = e.clientX;
  downPos.y = e.clientY;
}

function onPointerUp(e) {
  if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) {
    return; // User was dragging to orbit camera
  }
  if (!renderer || !model) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(model.children, true);
  const found = findInteractiveObject(intersects);
  if (!found) return;

  const action = found.target.userData.action;

  if (action === 'controller_lcd' || action === 'controller_knob') {
    playKnobClick();
    state.heatingOn = !state.heatingOn;
    if (state.heatingOn) state.targetBathTemp = 45.0;
    updateUI();
  } else if (action === 'lift_toggle') {
    playLiftMotor();
    state.targetLiftPos = state.targetLiftPos > 0.5 ? 0.0 : 1.0;
    const btnLift = document.getElementById('btn-lift');
    if (btnLift) btnLift.textContent = state.targetLiftPos > 0.5 ? 'Lower Into Bath' : 'Raise Motorized Lift';
    updateUI();
  } else if (action === 'heating_bath') {
    playKnobClick();
    state.heatingOn = !state.heatingOn;
    updateUI();
  } else if (action === 'evap_flask' || action === 'combi_clip') {
    playKnobClick();
    state.targetRpm = state.targetRpm === 0 ? 120 : (state.targetRpm === 120 ? 240 : 0);
    const sliderRpm = document.getElementById('slider-rpm');
    if (sliderRpm) sliderRpm.value = state.targetRpm;
    updateUI();
  } else if (action === 'recv_flask') {
    playDripSound();
    state.recvFlaskVol = 0.0;
    updateUI();
  } else if (action === 'stopcock') {
    playVacuumHiss();
    state.targetVacuumMbar = 1013;
    const sliderVac = document.getElementById('slider-vac');
    if (sliderVac) sliderVac.value = 1013;
    updateUI();
  } else if (action === 'sredesigns_badge') {
    playKnobClick();
    console.log('SREdesigns Certified Digital Twin: Precision Engineering & Operational Fidelity Standard.');
  } else if (action === 'foot_level') {
    playKnobClick();
  }
}

function init3D() {
  const container = document.getElementById('viewport3d');
  if (!container) return;

  tooltipEl = document.getElementById('hud-tooltip');

  const w = container.clientWidth || 800;
  const h = container.clientHeight || 600;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xd0d8e0);
  scene.fog = new THREE.Fog(0xd0d8e0, 32, 75);

  camera = new THREE.PerspectiveCamera(38, w / h, 0.05, 140);
  camera.position.set(CAM0.x, CAM0.y, CAM0.z);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(TGT0.x, TGT0.y, TGT0.z);
  controls.maxPolarAngle = Math.PI / 2 - 0.01;
  controls.minDistance = 2.2;
  controls.maxDistance = 20.0;
  controls.update();

  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);

  // Studio & Lab Lighting (Balanced PBR highlights)
  const ambientL = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientL);

  const keyL = new THREE.DirectionalLight(0xfff8f0, 1.15);
  keyL.position.set(4, 25, -8);
  keyL.target.position.set(0.15, 12.35, 0.0);
  scene.add(keyL.target);
  keyL.castShadow = true;
  keyL.shadow.mapSize.width = 2048;
  keyL.shadow.mapSize.height = 2048;
  keyL.shadow.camera.near = 1;
  keyL.shadow.camera.far = 40;
  keyL.shadow.camera.left = -6;
  keyL.shadow.camera.right = 6;
  keyL.shadow.camera.top = 8;
  keyL.shadow.camera.bottom = -4;
  scene.add(keyL);

  const fillL = new THREE.DirectionalLight(0xe8f0ff, 0.55);
  fillL.position.set(-6, 20, 4);
  scene.add(fillL);

  const hemiL = new THREE.HemisphereLight(0xeef4ff, 0x8a9098, 0.55);
  scene.add(hemiL);

  const topL = new THREE.DirectionalLight(0xf0f6ff, 0.7);
  topL.position.set(0, 27, 0);
  scene.add(topL);

  // Model creation
  model = createRotovapModel();
  scene.add(model);

  // Bind LCD Texture
  setControllerTexture(lcdTexture);

  // Robust ResizeObserver
  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      const cr = e.contentRect;
      const nw = Math.max(1, Math.floor(cr.width));
      const nh = Math.max(1, Math.floor(cr.height));
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    }
  });
  ro.observe(container);
}

// ---------------------------------------------------------------------------
// Physics Engine (Thermodynamics & Evaporation Rate)
// ---------------------------------------------------------------------------
let lastTime = performance.now();

function calculateBoilingPoint(solvent, pMbar) {
  // Antoine Equation: log10(P_bar) = A - B / (T + C)
  // P in bar = pMbar / 1000
  const pBar = Math.max(0.01, pMbar / 1000);
  const logP = Math.log10(pBar);
  const { A, B, C } = solvent.antoine;
  const tKelvin = B / (A - logP) - C;
  return tKelvin - 273.15; // Return in Celsius
}

function updatePhysics(dt) {
  // 1. Motorized lift translation
  if (Math.abs(state.liftPos - state.targetLiftPos) > 0.005) {
    const dir = Math.sign(state.targetLiftPos - state.liftPos);
    state.liftPos += dir * dt * 0.8;
    setLiftHeight(state.liftPos);
  }

  // 2. Flask rotation ramp
  const rpmDiff = state.targetRpm - state.rpm;
  state.rpm += rpmDiff * Math.min(1.0, dt * 3.0);
  if (state.rpm > 5) {
    rotateDriveShaft((state.rpm * (Math.PI * 2) / 60) * dt);
    setRotationSound(state.rpm);
  } else {
    setRotationSound(0);
  }

  // 3. Heating bath PID ramp
  if (state.heatingOn) {
    if (state.bathTemp < state.targetBathTemp) {
      state.bathTemp += dt * 0.8; // Heats at ~0.8°C per second
    } else {
      state.bathTemp += (state.targetBathTemp - state.bathTemp) * dt * 0.5;
    }
  } else {
    // Passive cooling to ambient (22°C)
    if (state.bathTemp > 22.0) {
      state.bathTemp -= dt * 0.15;
    }
  }

  // 4. Vacuum ramp
  const vacDiff = state.targetVacuumMbar - state.vacuumMbar;
  state.vacuumMbar += vacDiff * Math.min(1.0, dt * 1.5);

  // 5. Boiling & Evaporation Rate (Clausius-Clapeyron)
  const currentBp = calculateBoilingPoint(state.currentSolvent, state.vacuumMbar);
  const flaskInBath = state.liftPos < 0.25;

  if (flaskInBath && state.bathTemp > currentBp && state.evapFlaskVol > 0.01) {
    state.isDistilling = true;
    const deltaT = state.bathTemp - currentBp;
    // Rate proportional to deltaT and rotational film renewal
    state.dripRate = Math.min(1.0, (deltaT * 0.04) * (0.5 + (state.rpm / 280) * 0.8));

    // Transfer volume from evap flask to receiver flask
    const transferred = state.dripRate * dt * 0.008;
    state.evapFlaskVol = Math.max(0.0, state.evapFlaskVol - transferred);
    state.recvFlaskVol = Math.min(0.95, state.recvFlaskVol + transferred);

    // Drip ping sound
    state.dripTimer += dt * state.dripRate * 4.0;
    if (state.dripTimer > 1.0) {
      state.dripTimer = 0.0;
      playDripSound();
    }
  } else {
    state.isDistilling = false;
    state.dripRate = 0.0;
  }

  updateLiquidLevels(state.evapFlaskVol, state.recvFlaskVol);
  updateDripAnimation(performance.now() / 1000, state.dripRate);
}

// ---------------------------------------------------------------------------
// Operational Actions
// ---------------------------------------------------------------------------

export function actionToggleLift() {
  playKnobClick();
  const isUp = state.targetLiftPos < 0.5;
  state.targetLiftPos = isUp ? 1.0 : 0.0;
  playLiftMotor(isUp);
  updateUI();
}

export function actionToggleHeating() {
  playKnobClick();
  state.heatingOn = !state.heatingOn;
  updateUI();
}

export function actionSetRpm(rpm) {
  state.targetRpm = Math.max(0, Math.min(280, rpm));
  updateUI();
}

export function actionSetBathTemp(temp) {
  state.targetBathTemp = Math.max(20, Math.min(100, temp));
  updateUI();
}

export function actionSetVacuum(vac) {
  state.targetVacuumMbar = Math.max(20, Math.min(1013, vac));
  updateUI();
}

export function actionAerateVacuum() {
  playVacuumHiss();
  state.targetVacuumMbar = 1013;
  updateUI();
}

export function actionRefillFlask() {
  playKnobClick();
  state.evapFlaskVol = 0.85;
  state.recvFlaskVol = 0.05;
  updateUI();
}

// ---------------------------------------------------------------------------
// UI DOM Binding
// ---------------------------------------------------------------------------
function updateUI() {
  const statusPill = document.getElementById('status-pill');
  const statusDetail = document.getElementById('status-detail');

  if (statusPill && statusDetail) {
    if (state.isDistilling) {
      statusPill.textContent = 'DISTILLING';
      statusPill.className = 'pill run';
      statusDetail.textContent = `Evaporating at ${(state.dripRate * 12).toFixed(1)} mL/min`;
    } else if (state.heatingOn) {
      statusPill.textContent = 'HEATING';
      statusPill.className = 'pill open';
      statusDetail.textContent = `Bath warming to ${state.targetBathTemp}°C`;
    } else {
      statusPill.textContent = 'STANDBY';
      statusPill.className = 'pill';
      statusDetail.textContent = 'Ready for distillation sequence';
    }
  }

  // Update button states
  const btnLift = document.getElementById('btn-lift');
  if (btnLift) btnLift.textContent = state.targetLiftPos > 0.5 ? 'Lower into Bath' : 'Raise Motorized Lift';

  const btnHeat = document.getElementById('btn-heat');
  if (btnHeat) {
    btnHeat.textContent = state.heatingOn ? 'Turn Heating OFF' : 'Turn Heating ON';
    btnHeat.classList.toggle('btn-primary', state.heatingOn);
  }

  // Update readouts
  const rpmVal = document.getElementById('val-rpm');
  if (rpmVal) rpmVal.textContent = `${Math.round(state.targetRpm)} RPM`;

  const tempVal = document.getElementById('val-temp');
  if (tempVal) tempVal.textContent = `${state.targetBathTemp}°C`;

  const vacVal = document.getElementById('val-vac');
  if (vacVal) vacVal.textContent = `${state.targetVacuumMbar} mbar`;

  renderLCD();
}

function bindDOMControls() {
  document.getElementById('btn-lift')?.addEventListener('click', actionToggleLift);
  document.getElementById('btn-heat')?.addEventListener('click', actionToggleHeating);
  document.getElementById('btn-aerate')?.addEventListener('click', actionAerateVacuum);
  document.getElementById('btn-refill')?.addEventListener('click', actionRefillFlask);

  // Sliders
  document.getElementById('slider-rpm')?.addEventListener('input', (e) => {
    actionSetRpm(parseInt(e.target.value));
  });

  document.getElementById('slider-temp')?.addEventListener('input', (e) => {
    actionSetBathTemp(parseInt(e.target.value));
  });

  document.getElementById('slider-vac')?.addEventListener('input', (e) => {
    actionSetVacuum(parseInt(e.target.value));
  });

  // Solvent Select
  const solventSelect = document.getElementById('solvent-select');
  if (solventSelect) {
    Object.keys(SOLVENTS).forEach((key) => {
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

  // Preset button: 40°C rule
  document.getElementById('btn-preset-40')?.addEventListener('click', () => {
    playKnobClick();
    state.heatingOn = true;
    state.targetBathTemp = 45.0;
    // Set recommended vacuum to boil at 40°C
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

  // View Toolbar
  document.getElementById('btn-explode')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    btn.classList.toggle('active');
    const isAct = btn.classList.contains('active');
    btn.textContent = isAct ? 'Assemble' : 'Exploded view';
    let t = 0;
    const animateExplode = () => {
      t += 0.05;
      const amount = isAct ? Math.min(1, t) : Math.max(0, 1 - t);
      setExplodeAmount(amount);
      if (t < 1) requestAnimationFrame(animateExplode);
    };
    animateExplode();
  });

  document.getElementById('btn-wireframe')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    btn.classList.toggle('active');
    setWireframe(btn.classList.contains('active'));
  });

  document.getElementById('btn-auto-rotate')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    btn.classList.toggle('active');
    controls.autoRotate = btn.classList.contains('active');
  });

  document.getElementById('orbit-speed')?.addEventListener('input', (e) => {
    controls.autoRotateSpeed = parseFloat(e.target.value);
    const lbl = document.getElementById('orbit-speed-val');
    if (lbl) lbl.textContent = `${e.target.value}×`;
  });

  document.getElementById('camera-zoom')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    const lbl = document.getElementById('camera-zoom-val');
    if (lbl) lbl.textContent = `${Math.round(val)}%`;
    const targetDist = zoomPctToDist(val);
    const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
    offset.setLength(targetDist);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  });

  document.getElementById('lab-light')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    const lbl = document.getElementById('lab-light-val');
    if (lbl) lbl.textContent = `${val.toFixed(1)}×`;
    renderer.toneMappingExposure = 1.15 * val;
  });

  document.getElementById('btn-sfx-mute')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const muted = !isSfxMuted();
    setSfxMuted(muted);
    btn.textContent = muted ? 'Unmute SFX' : 'Mute SFX';
    btn.classList.toggle('active', muted);
  });

  // Collapsible panels
  document.querySelectorAll('.panel-collapse-btn').forEach((btn) => {
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
