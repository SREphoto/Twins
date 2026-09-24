/**
 * Mettler Toledo XSE204 Analytical Balance App
 * Working Touchscreen LCD + Physical EMFR Physics + Sample Workflows + 3D Twin
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  createBalanceModel,
  setDoorOpen,
  setExplodeAmount,
  setWireframe,
  setLcdTexture,
  setSpiritBubblePosition,
  setBoatOnPan,
  setCalWeightOnPan,
  setSamplePowder,
  setPowerState,
  rotateFootKnob,
} from './balance3d.js?v=20260922-cleanchamber10';
import {
  playTouchBeep,
  playDoorSlide,
  playPanClink,
  playStableChime,
  playMotorCalibHum,
  playOverloadAlarm,
  setSfxMuted,
  isSfxMuted,
} from './sfx.js?v=20260906-gold5';

// ---------------------------------------------------------------------------
// Physical Constants & Limits
// ---------------------------------------------------------------------------
const MAX_CAPACITY_G = 220.0000;
const READABILITY_G  = 0.0001; // 0.1 mg
const SETTLING_TAU   = 0.45;   // Exponential settling time constant (seconds)

// Chemical Reagent Database
const SAMPLES = {
  nacl: {
    id: 'nacl',
    name: 'Sodium Chloride (NaCl)',
    mass: 2.4512,
    color: 0xffffff,
    desc: 'Analytical grade NaCl crystals (molar mass 58.44 g/mol)',
  },
  cuso4: {
    id: 'cuso4',
    name: 'Copper(II) Sulfate Pentahydrate',
    mass: 1.8324,
    color: 0x1e88e5,
    desc: 'Bright blue CuSO4·5H2O crystalline prism (molar mass 249.68 g/mol)',
  },
  aspirin: {
    id: 'aspirin',
    name: 'Acetylsalicylic Acid (Aspirin)',
    mass: 0.5008,
    color: 0xf5f5f5,
    desc: 'Fine white crystalline pharmaceutical powder (molar mass 180.16 g/mol)',
  },
  tube: {
    id: 'tube',
    name: '1.5 mL Microcentrifuge Tube',
    mass: 1.0256,
    color: 0xcccccc,
    desc: 'Standard polypropylene microcentrifuge tube with cap',
  },
};

const BOAT_MASS_G = 1.3420; // Mass of the glass weigh boat
const CAL_MASS_G  = 100.0000; // Class E2 100g test weight

// ---------------------------------------------------------------------------
// State Management
// ---------------------------------------------------------------------------
const state = {
  power: true,
  cordPlugged: true,
  standby: false,
  unit: 'g', // 'g', 'mg', 'ct', '%'
  tareOffset: 0.0,
  isNet: false,
  rawMass: 0.0,
  indicatedMass: 0.0,
  isStable: true,
  stableTimer: 0.0,
  lastStableVal: 0.0,

  // Hardware states
  doorLeft: 0.0,
  doorRight: 0.0,
  doorTop: 0.0,
  currentDoorLeft: 0.0,
  currentDoorRight: 0.0,
  currentDoorTop: 0.0,
  boatOnPan: false,
  sampleLoaded: false,
  currentSample: SAMPLES.nacl,
  calWeightOnPan: false,
  isCalibrating: false,
  calStep: 0,

  // Leveling
  pitchTilt: 0.0,
  rollTilt: 0.0,

  // GLP Log
  glpRecords: [],
};

// ---------------------------------------------------------------------------
// HTML5 Canvas LCD Generator (Mettler Toledo SmartScreen)
// ---------------------------------------------------------------------------
const lcdCanvas = document.createElement('canvas');
lcdCanvas.width = 1536;
lcdCanvas.height = 512;
const lcdCtx = lcdCanvas.getContext('2d');
const lcdTexture = new THREE.CanvasTexture(lcdCanvas);
lcdTexture.colorSpace = THREE.SRGBColorSpace;
lcdTexture.minFilter = THREE.LinearFilter;

let touchHighlight = { key: null, expiry: 0 };

export function triggerTouchHighlight(key) {
  touchHighlight = { key, expiry: performance.now() + 160 };
  renderLCD();
}

function renderLCD() {
  if (!lcdCtx) return;

  // Background when powered off
  if (!state.power) {
    lcdCtx.fillStyle = '#060a10';
    lcdCtx.fillRect(0, 0, 1536, 512);

    lcdCtx.textAlign = 'center';
    lcdCtx.font = '22px "IBM Plex Sans", sans-serif';
    lcdCtx.fillStyle = '#1e2c40';
    lcdCtx.fillText('STANDBY · TAP SCREEN TO WAKE', 768, 256);
    lcdTexture.needsUpdate = true;
    return;
  }

  // Deep tech navy gradient
  const grad = lcdCtx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#0c1524');
  grad.addColorStop(1, '#080d16');
  lcdCtx.fillStyle = grad;
  lcdCtx.fillRect(0, 0, 1536, 512);

  // Status Bar (Top)
  lcdCtx.fillStyle = '#142033';
  lcdCtx.fillRect(0, 0, 1536, 62);

  lcdCtx.textAlign = 'left';
  lcdCtx.font = 'bold 26px "IBM Plex Sans", sans-serif';
  lcdCtx.fillStyle = '#00d4e8';
  lcdCtx.fillText('METTLER TOLEDO', 40, 42);

  lcdCtx.font = '20px "IBM Plex Mono", monospace';
  lcdCtx.fillStyle = '#8b9bb0';
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  lcdCtx.fillText(timeStr, 380, 42);

  // SREdesigns Official Brand Mark on Screen
  lcdCtx.fillStyle = '#fbbf24';
  lcdCtx.font = 'bold 20px "IBM Plex Sans", sans-serif';
  lcdCtx.fillText('◆ SREdesigns LAB', 580, 42);

  // Level & proFACT status pills
  const levelOk = Math.hypot(state.pitchTilt, state.rollTilt) < 0.2;
  lcdCtx.fillStyle = levelOk ? '#103824' : '#4a151b';
  lcdCtx.fillRect(880, 12, 150, 38);
  lcdCtx.fillStyle = levelOk ? '#3dd68c' : '#f04460';
  lcdCtx.font = 'bold 16px "IBM Plex Sans"';
  lcdCtx.fillText(levelOk ? 'LEVEL OK' : 'LEVEL REQ', 915, 37);

  lcdCtx.fillStyle = '#1c2838';
  lcdCtx.fillRect(1050, 12, 140, 38);
  lcdCtx.fillStyle = '#00d4e8';
  lcdCtx.fillText('proFACT', 1085, 37);

  if (state.isNet) {
    lcdCtx.fillStyle = '#f0b429';
    lcdCtx.fillRect(1210, 12, 85, 38);
    lcdCtx.fillStyle = '#121418';
    lcdCtx.fillText('NET', 1235, 37);
  }

  // Standby Touch Softkey (Top Right)
  lcdCtx.fillStyle = '#1c2838';
  lcdCtx.fillRect(1385, 12, 115, 38);
  lcdCtx.fillStyle = '#8b9bb0';
  lcdCtx.font = 'bold 16px "IBM Plex Sans"';
  lcdCtx.fillText('STANDBY', 1405, 37);

  // Main Weight Readout Zone
  let displayVal = state.indicatedMass - state.tareOffset;
  let unitLabel = 'g';
  let formattedDigits = '0.0000';

  if (state.unit === 'mg') {
    displayVal *= 1000;
    unitLabel = 'mg';
    formattedDigits = displayVal.toFixed(1);
  } else if (state.unit === 'ct') {
    displayVal *= 5;
    unitLabel = 'ct';
    formattedDigits = displayVal.toFixed(4);
  } else if (state.unit === '%') {
    displayVal = (displayVal / (state.currentSample.mass || 1)) * 100;
    unitLabel = '%';
    formattedDigits = displayVal.toFixed(2);
  } else {
    formattedDigits = displayVal.toFixed(4);
  }

  if (state.isCalibrating) {
    formattedDigits = 'CAL ...';
  } else if (state.indicatedMass > MAX_CAPACITY_G) {
    formattedDigits = 'OVERLOAD';
  }

  // Stability Circle Ring on Left
  const cx = 140, cy = 230;
  lcdCtx.beginPath();
  lcdCtx.arc(cx, cy, 34, 0, Math.PI * 2);
  lcdCtx.strokeStyle = state.isStable ? '#3dd68c' : '#2a3b50';
  lcdCtx.lineWidth = 6;
  lcdCtx.stroke();

  if (state.isStable) {
    lcdCtx.fillStyle = '#3dd68c';
    lcdCtx.beginPath();
    lcdCtx.arc(cx, cy, 15, 0, Math.PI * 2);
    lcdCtx.fill();

    // Stability Star Mark
    lcdCtx.font = 'bold 36px "IBM Plex Mono", monospace';
    lcdCtx.fillText('*', 190, 240);
  }

  // Large Digits
  lcdCtx.font = 'bold 124px "IBM Plex Mono", monospace';
  lcdCtx.textAlign = 'right';
  lcdCtx.fillStyle = state.isCalibrating ? '#f0b429' : (state.isStable ? '#e6edf5' : '#7e90a6');
  lcdCtx.fillText(formattedDigits, 1260, 265);

  // Unit Symbol
  lcdCtx.textAlign = 'left';
  lcdCtx.font = 'bold 54px "IBM Plex Sans", sans-serif';
  lcdCtx.fillStyle = '#00d4e8';
  lcdCtx.fillText(unitLabel, 1290, 258);

  // Capacity Bar Graph (Bottom middle)
  const capPct = Math.max(0, Math.min(1, state.indicatedMass / MAX_CAPACITY_G));
  lcdCtx.fillStyle = '#141d2c';
  lcdCtx.fillRect(240, 315, 1050, 14);
  lcdCtx.fillStyle = capPct > 0.95 ? '#f04460' : '#00d4e8';
  lcdCtx.fillRect(240, 315, 1050 * capPct, 14);

  // Touch Softkeys Row (Bottom) — 5 Wide Action Keys across 1536 width
  const buttons = ['TARE', 'ZERO', 'CAL', 'DOORS', 'PRINT'];
  const btnW = 270, btnH = 86, btnY = 390;
  const isHighlightActive = performance.now() < touchHighlight.expiry;

  buttons.forEach((name, i) => {
    const bx = 45 + i * 295;
    const isPressed = isHighlightActive && touchHighlight.key === name;

    lcdCtx.fillStyle = isPressed ? '#00d4e8' : '#182436';
    lcdCtx.strokeStyle = isPressed ? '#ffffff' : '#2a3b50';
    lcdCtx.lineWidth = isPressed ? 3 : 2;
    lcdCtx.beginPath();
    lcdCtx.roundRect(bx, btnY, btnW, btnH, 12);
    lcdCtx.fill();
    lcdCtx.stroke();

    lcdCtx.textAlign = 'center';
    lcdCtx.font = 'bold 26px "IBM Plex Sans", sans-serif';
    lcdCtx.fillStyle = isPressed ? '#08101a' : '#e6edf5';
    lcdCtx.fillText(name, bx + btnW / 2, btnY + 52);
  });

  lcdTexture.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// 3D Scene Initialization
// ---------------------------------------------------------------------------
let scene, camera, renderer, controls;
let model;

const CAM0 = { x: 3.4, y: 12.5, z: -5.4 };
const TGT0 = { x: 0.0, y: 10.45, z: 0.1 };

function cameraDistance() {
  return camera.position.distanceTo(controls.target);
}

function distToZoomPct(dist) {
  const minD = 2.0;
  const maxD = 14.0;
  return THREE.MathUtils.clamp(Math.round(((maxD - dist) / (maxD - minD)) * 100), 0, 100);
}

function zoomPctToDist(pct) {
  const minD = 2.0;
  const maxD = 14.0;
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
    let label = found.target.userData.label || found.target.name;

    // Detailed hover breakdown for touchscreen buttons (1536x512 canvas)
    if (found.target.userData.action === 'touchscreen' && found.hit.uv) {
      const px = (1 - found.hit.uv.x) * 1536;
      const py = found.hit.uv.y * 512;
      if (py >= 370 && py <= 490) {
        if (px >= 35 && px < 325) label = 'Touchscreen: TARE (Zero Container)';
        else if (px >= 325 && px < 620) label = 'Touchscreen: ZERO (Center Zero Scale)';
        else if (px >= 620 && px < 915) label = 'Touchscreen: CAL (proFACT Auto-Calibration)';
        else if (px >= 915 && px < 1210) label = 'Touchscreen: DOORS (Motorized Draft Shield Toggle)';
        else if (px >= 1210 && px <= 1505) label = 'Touchscreen: PRINT (Output GLP Record)';
      } else if (py >= 10 && py <= 55) {
        if (px >= 870 && px <= 1040) label = 'Touchscreen: Level Status (Click to Level)';
        else if (px >= 1045 && px <= 1200) label = 'Touchscreen: proFACT Calibration';
        else if (px >= 550 && px <= 780) label = 'SREdesigns Certified Digital Twin';
      }
    }

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

  if (action === 'touchscreen') {
    if (!state.power) {
      actionTogglePower();
      return;
    }
    const uv = found.hit.uv;
    if (!uv) return;
    const px = (1 - uv.x) * 1536;
    const py = uv.y * 512;

    if (py >= 370 && py <= 490) {
      if (px >= 35 && px < 325) { triggerTouchHighlight('TARE'); actionTare(); }
      else if (px >= 325 && px < 620) { triggerTouchHighlight('ZERO'); actionZero(); }
      else if (px >= 620 && px < 915) { triggerTouchHighlight('CAL'); actionRunCalibration(); }
      else if (px >= 915 && px < 1210) { triggerTouchHighlight('DOORS'); actionToggleDoor('all'); }
      else if (px >= 1210 && px <= 1505) { triggerTouchHighlight('PRINT'); actionPrintGLP(); }
    } else if (py >= 10 && py <= 55) {
      if (px >= 870 && px <= 1040) { actionAdjustLevel(); }
      else if (px >= 1045 && px <= 1200) { actionRunCalibration(); }
      else if (px >= 1380 && px <= 1510) { actionTogglePower(); }
      else if (px >= 550 && px <= 780) { playTouchBeep(1800); }
    }
  } else if (action === 'power_button' || action === 'power_switch') {
    actionTogglePower();
  } else if (action === 'sredesigns_badge') {
    playTouchBeep(1800);
    console.log('SREdesigns Certified Digital Twin: Precision Engineering & Operational Fidelity Standard.');
  } else if (action === 'sensor_bar') {
    actionSmartSensor();
  } else if (action === 'door_left') {
    actionToggleDoor('left');
  } else if (action === 'door_right') {
    actionToggleDoor('right');
  } else if (action === 'door_top') {
    actionToggleDoor('top');
  } else if (action === 'weigh_boat') {
    actionToggleWeighBoat();
  } else if (action === 'spatula') {
    actionToggleSample();
  } else if (action === 'cal_weight') {
    actionToggleCalWeight();
  } else if (action === 'level_left') {
    actionAdjustLevel('left');
  } else if (action === 'level_right') {
    actionAdjustLevel('right');
  } else if (action === 'level_bubble') {
    actionAdjustLevel('left');
  } else if (action === 'power_cord') {
    actionTogglePowerCord();
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
  scene.fog = new THREE.Fog(0xd0d8e0, 30, 70);

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
  controls.minDistance = 2.0;
  controls.maxDistance = 18.0;
  controls.update();

  // Balanced PBR Studio Lighting
  const ambientL = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientL);

  const keyL = new THREE.DirectionalLight(0xfff8f0, 1.1);
  keyL.position.set(4, 25, -7);
  keyL.target.position.set(0, 10.45, -0.3);
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

  const fillL = new THREE.DirectionalLight(0xe8f0ff, 0.5);
  fillL.position.set(-8, 18, 4);
  scene.add(fillL);

  const hemiL = new THREE.HemisphereLight(0xeef4ff, 0x8a9098, 0.55);
  scene.add(hemiL);

  const topL = new THREE.DirectionalLight(0xf0f6ff, 0.65);
  topL.position.set(0, 27, 0);
  scene.add(topL);

  // Model creation
  model = createBalanceModel();
  scene.add(model);

  // Connect Canvas Texture to procedural balance screen
  setLcdTexture(lcdTexture);

  // 3D Pointer Events
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerleave', () => {
    renderer.domElement.style.cursor = 'default';
    if (tooltipEl) tooltipEl.style.display = 'none';
  });

  // ResizeObserver
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
// Physics Engine & State Machine Loop
// ---------------------------------------------------------------------------
let lastTime = performance.now();

function updatePhysics(dt) {
  // 0. Smooth animated draft shield doors
  const doorSpeed = 4.5;
  state.currentDoorLeft += (state.doorLeft - state.currentDoorLeft) * Math.min(1.0, dt * doorSpeed);
  state.currentDoorRight += (state.doorRight - state.currentDoorRight) * Math.min(1.0, dt * doorSpeed);
  state.currentDoorTop += (state.doorTop - state.currentDoorTop) * Math.min(1.0, dt * doorSpeed);

  // Snap to target when very close to eliminate asymptotic floating tails
  if (Math.abs(state.currentDoorLeft - state.doorLeft) < 0.002) state.currentDoorLeft = state.doorLeft;
  if (Math.abs(state.currentDoorRight - state.doorRight) < 0.002) state.currentDoorRight = state.doorRight;
  if (Math.abs(state.currentDoorTop - state.doorTop) < 0.002) state.currentDoorTop = state.doorTop;

  setDoorOpen('left', state.currentDoorLeft);
  setDoorOpen('right', state.currentDoorRight);
  setDoorOpen('top', state.currentDoorTop);

  if (!state.power) {
    state.indicatedMass = 0.0;
    if (state.isStable) {
      state.isStable = false;
      updateUI();
    }
    return;
  }

  // 1. Calculate target mass on pan
  let target = 0.0;
  if (state.boatOnPan) target += BOAT_MASS_G;
  if (state.boatOnPan && state.sampleLoaded) target += state.currentSample.mass;
  if (state.calWeightOnPan) target += CAL_MASS_G;

  state.rawMass = target;

  // 2. Air Draft Turbulence calculation
  const doorsOpenAmount = state.currentDoorLeft + state.currentDoorRight + state.currentDoorTop;
  const anyDoorOpen = (state.currentDoorLeft > 0.03 || state.currentDoorRight > 0.03 || state.currentDoorTop > 0.03);
  let draftJitter = 0.0;
  if (anyDoorOpen) {
    const jitterMag = doorsOpenAmount * 0.0035;
    draftJitter = (Math.random() * 2 - 1) * jitterMag + Math.sin(performance.now() * 0.01) * (jitterMag * 0.5);
  }

  // 3. EMFR Exponential Settling
  const error = (target + draftJitter) - state.indicatedMass;
  state.indicatedMass += error * (dt / SETTLING_TAU);

  // 4. Stability Detection
  const deltaFromLast = Math.abs(state.indicatedMass - state.lastStableVal);
  if (deltaFromLast < 0.0002 && !anyDoorOpen) {
    state.stableTimer += dt;
    if (state.stableTimer > 0.8 && !state.isStable) {
      state.isStable = true;
      playStableChime();
      updateUI();
    }
  } else {
    if (state.isStable) {
      state.isStable = false;
      updateUI();
    }
    state.stableTimer = 0.0;
    state.lastStableVal = state.indicatedMass;
  }

  // 5. Update Spirit Level Position
  setSpiritBubblePosition(state.pitchTilt, state.rollTilt);
}

// ---------------------------------------------------------------------------
// Operational Actions
// ---------------------------------------------------------------------------

export function actionTare() {
  playTouchBeep(1400);
  state.tareOffset = state.indicatedMass;
  state.isNet = true;
  renderLCD();
  updateUI();
}

export function actionZero() {
  playTouchBeep(1200);
  state.tareOffset = 0.0;
  state.isNet = false;
  renderLCD();
  updateUI();
}

export function actionCycleUnits() {
  playTouchBeep(1600);
  const units = ['g', 'mg', 'ct', '%'];
  const nextIdx = (units.indexOf(state.unit) + 1) % units.length;
  state.unit = units[nextIdx];
  renderLCD();
  updateUI();
}

export function actionToggleDoor(doorName) {
  playDoorSlide();
  if (doorName === 'left') {
    state.doorLeft = state.doorLeft > 0.5 ? 0.0 : 1.0;
  } else if (doorName === 'right') {
    state.doorRight = state.doorRight > 0.5 ? 0.0 : 1.0;
  } else if (doorName === 'top') {
    state.doorTop = state.doorTop > 0.5 ? 0.0 : 1.0;
  } else if (doorName === 'all') {
    const openAll = (state.doorLeft + state.doorRight + state.doorTop) < 1.5;
    state.doorLeft = openAll ? 1.0 : 0.0;
    state.doorRight = openAll ? 1.0 : 0.0;
    state.doorTop = openAll ? 1.0 : 0.0;
  }
  updateUI();
}

export function actionToggleWeighBoat() {
  playPanClink();
  state.boatOnPan = !state.boatOnPan;
  setBoatOnPan(state.boatOnPan);
  updateUI();
}

export function actionToggleSample() {
  if (!state.boatOnPan) {
    alert('Please place a weigh boat on the pan first!');
    return;
  }
  playPanClink();
  state.sampleLoaded = !state.sampleLoaded;
  setSamplePowder(state.sampleLoaded, state.currentSample.color);
  updateUI();
}

export function actionToggleCalWeight() {
  playPanClink();
  state.calWeightOnPan = !state.calWeightOnPan;
  setCalWeightOnPan(state.calWeightOnPan);
  updateUI();
}

export function actionRunCalibration() {
  if (state.isCalibrating) return;
  state.isCalibrating = true;
  playMotorCalibHum();
  renderLCD();

  setTimeout(() => {
    state.tareOffset = 0.0;
    state.isNet = false;
    state.isCalibrating = false;
    playStableChime();
    renderLCD();
    updateUI();
  }, 3200);
}

export function actionTogglePower() {
  state.power = !state.power;
  setPowerState(state.power);
  if (state.power) {
    playTouchBeep(1200);
    setTimeout(() => playStableChime(), 160);
  } else {
    playTouchBeep(400);
  }
  renderLCD();
  updateUI();
}

export function actionAdjustLevel(side = 'left') {
  playTouchBeep(950);
  rotateFootKnob(side, 0.4);
  state.pitchTilt = 0.0;
  state.rollTilt = 0.0;
  setSpiritBubblePosition(0.0, 0.0);
  renderLCD();
  updateUI();
}

export function actionSmartSensor() {
  playStableChime();
  actionTare();
}

export function actionTogglePowerCord() {
  state.cordPlugged = !state.cordPlugged;
  if (!state.cordPlugged) {
    playTouchBeep(300);
    state.power = false;
    setPowerState(false);
  } else {
    playTouchBeep(1200);
    state.power = true;
    setPowerState(true);
  }
  renderLCD();
  updateUI();
}

export function actionPrintGLP() {
  playTouchBeep(2000);
  const now = new Date();
  const netG = (state.indicatedMass - state.tareOffset).toFixed(4);
  const grossG = state.indicatedMass.toFixed(4);
  const tareG = state.tareOffset.toFixed(4);

  const entry = `--- GLP WEIGHING RECORD ---
Date: ${now.toLocaleDateString()}  Time: ${now.toLocaleTimeString()}
Instrument: METTLER TOLEDO XSE204
Serial: B849204192  Status: ${state.isStable ? 'STABLE' : 'UNSTABLE'}
Gross:  ${grossG.padStart(10)} g
Tare:   ${tareG.padStart(10)} g
Net:    ${netG.padStart(10)} g
Sample: ${state.sampleLoaded ? state.currentSample.name : 'Unknown / Empty'}
Signature: ____________________
---------------------------`;

  state.glpRecords.unshift(entry);
  const logEl = document.getElementById('glp-log');
  if (logEl) {
    logEl.textContent = state.glpRecords.join('\n\n');
  }
}

// ---------------------------------------------------------------------------
// UI DOM Binding
// ---------------------------------------------------------------------------
function updateUI() {
  const statusPill = document.getElementById('status-pill');
  const statusDetail = document.getElementById('status-detail');

  if (statusPill && statusDetail) {
    if (!state.cordPlugged) {
      statusPill.textContent = 'NO AC';
      statusPill.className = 'pill fault';
      statusDetail.textContent = 'Power cord disconnected';
    } else if (!state.power) {
      statusPill.textContent = 'POWER OFF';
      statusPill.className = 'pill fault';
      statusDetail.textContent = 'Instrument in standby mode';
    } else if (state.isCalibrating) {
      statusPill.textContent = 'CALIBRATING';
      statusPill.className = 'pill open';
      statusDetail.textContent = 'Internal proFACT motor active';
    } else if (state.isStable) {
      statusPill.textContent = 'STABLE';
      statusPill.className = 'pill run';
      statusDetail.textContent = state.isNet ? 'Net weight locked' : 'Ready to tare / weigh';
    } else {
      const anyDoorOpen = (state.currentDoorLeft > 0.03 || state.currentDoorRight > 0.03 || state.currentDoorTop > 0.03);
      if (anyDoorOpen) {
        statusPill.textContent = 'UNSTABLE';
        statusPill.className = 'pill warn';
        statusDetail.textContent = 'Air draft detected (draft shield open)';
      } else {
        statusPill.textContent = 'MEASURING';
        statusPill.className = 'pill';
        statusDetail.textContent = 'Settling EMFR coil...';
      }
    }
  }

  // Update button texts
  const btnBoat = document.getElementById('btn-boat');
  if (btnBoat) btnBoat.textContent = state.boatOnPan ? 'Remove Weigh Boat' : 'Place Weigh Boat on Pan';

  const btnSample = document.getElementById('btn-sample');
  if (btnSample) {
    btnSample.disabled = !state.boatOnPan;
    btnSample.textContent = state.sampleLoaded ? 'Remove Chemical Powder' : 'Add Powder via Spatula';
  }

  const btnDoors = document.getElementById('btn-doors');
  if (btnDoors) {
    const anyOpen = (state.doorLeft > 0.5 || state.doorRight > 0.5 || state.doorTop > 0.5);
    btnDoors.textContent = anyOpen ? 'Close All Draft Doors' : 'Open Draft Doors';
  }

  const btnPower = document.getElementById('btn-power');
  if (btnPower) {
    btnPower.textContent = state.power ? 'Power (Turn OFF)' : 'Power (Turn ON)';
  }
}

function bindDOMControls() {
  // Keypad & Touch buttons
  document.getElementById('btn-tare')?.addEventListener('click', actionTare);
  document.getElementById('btn-zero')?.addEventListener('click', actionZero);
  document.getElementById('btn-unit')?.addEventListener('click', actionCycleUnits);
  document.getElementById('btn-cal')?.addEventListener('click', actionRunCalibration);
  document.getElementById('btn-print')?.addEventListener('click', actionPrintGLP);
  document.getElementById('btn-doors')?.addEventListener('click', () => actionToggleDoor('all'));
  document.getElementById('btn-boat')?.addEventListener('click', actionToggleWeighBoat);
  document.getElementById('btn-sample')?.addEventListener('click', actionToggleSample);
  document.getElementById('btn-cal-weight')?.addEventListener('click', actionToggleCalWeight);
  document.getElementById('btn-power')?.addEventListener('click', actionTogglePower);
  document.getElementById('btn-level')?.addEventListener('click', () => actionAdjustLevel('left'));

  // Sample selector
  const sampleSelect = document.getElementById('sample-select');
  if (sampleSelect) {
    Object.keys(SAMPLES).forEach((key) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = SAMPLES[key].name;
      sampleSelect.appendChild(opt);
    });
    sampleSelect.addEventListener('change', (e) => {
      state.currentSample = SAMPLES[e.target.value] || SAMPLES.nacl;
      const desc = document.getElementById('sample-desc');
      if (desc) desc.textContent = state.currentSample.desc;
      if (state.sampleLoaded) {
        setSamplePowder(true, state.currentSample.color);
      }
    });
  }

  // View Toolbar controls
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
    renderer.toneMappingExposure = 1.1 * val;
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
// Main Animation Loop
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

// Boot
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
