/**
 * SREdesigns UNI-9000 Pro Glove Box — Interactive Application Controller (app.js)
 * 
 * Features:
 * - Three.js WebGL scene with shadow mapping and realistic lab lighting
 * - Dynamic CanvasTexture UI_LCD with strictly enforced texture.flipY = false
 * - Full electro-pneumatic simulation: differential pressure loop, auto-purge,
 *   3-cycle vacuum/refill antechamber sequences, door interlocks, foot pedal assist
 * - Smooth kinematic animations for doors, foot pedal, and analog vacuum gauge needle
 * - Procedural Web Audio API sound synthesis (sfx.js)
 * - Automated classroom demonstration workflow
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildGloveBox3D, GLOVE_BOX_CAMERAS } from './glove_box3d.js';
import { sfx } from './sfx.js';

// ---------------------------------------------------------------------------
// Application State
// ---------------------------------------------------------------------------
const state = {
  // Atmosphere sensors
  o2_ppm: 0.18,
  h2o_ppm: 0.12,
  pressure_mbar: 3.5,
  pressure_setpoint: 3.5,
  gas_type: 'Argon',
  purging: false,
  circulation: true,
  blower_flow: 150.0,

  // Antechamber state
  ante_vacuum_mbar: 1013.0,
  outer_door_open: false,
  inner_door_open: false,
  ante_cycling: false,
  ante_cycle_count: 0,
  target_cycles: 3,

  // Foot pedal
  foot_pedal: false,

  // Kinematic target angles
  outer_door_angle: 0.0,
  inner_door_angle: 0.0,
  foot_pedal_angle: 0.0,

  // UI & View
  exploded: false,
  wireframe: false,
  autoRotate: false,
  orbitSpeed: 1.0,
  muted: false,
  demoRunning: false,
};

// ---------------------------------------------------------------------------
// Three.js Scene Setup
// ---------------------------------------------------------------------------
const viewport = document.getElementById('viewport3d');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0c1016);

const camera = new THREE.PerspectiveCamera(
  42,
  viewport.clientWidth / viewport.clientHeight,
  0.1,
  100
);
camera.position.set(...GLOVE_BOX_CAMERAS.CAM_ISO.pos);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(viewport.clientWidth, viewport.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
viewport.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(...GLOVE_BOX_CAMERAS.CAM_ISO.target);

// ---------------------------------------------------------------------------
// Lighting
// ---------------------------------------------------------------------------
const ambLight = new THREE.AmbientLight(0xdde5f0, 0.65);
scene.add(ambLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(12, 22, -15);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 60;
dirLight.shadow.camera.left = -16;
dirLight.shadow.camera.right = 16;
dirLight.shadow.camera.top = 22;
dirLight.shadow.camera.bottom = -4;
scene.add(dirLight);

const rimLight = new THREE.DirectionalLight(0x7090b0, 0.5);
rimLight.position.set(-14, 15, 12);
scene.add(rimLight);

// Floor grid datum (Y = 0)
const gridHelper = new THREE.GridHelper(30, 30, 0x2a3545, 0x18202c);
gridHelper.position.y = -0.01;
scene.add(gridHelper);

// ---------------------------------------------------------------------------
// Build Procedural 3D Twin
// ---------------------------------------------------------------------------
const twin = buildGloveBox3D();
scene.add(twin.root);

// ---------------------------------------------------------------------------
// Dynamic CanvasTexture LCD Screen (10" TFT PLC HMI)
// Strict Rule: texture.flipY = false
// ---------------------------------------------------------------------------
const lcdCanvas = document.createElement('canvas');
lcdCanvas.width = 1024;
lcdCanvas.height = 768;
const ctx = lcdCanvas.getContext('2d');

const lcdTexture = new THREE.CanvasTexture(lcdCanvas);
lcdTexture.flipY = false; // MANDATORY CAD GOVERNANCE RULE
lcdTexture.colorSpace = THREE.SRGBColorSpace;

if (twin.refs.lcdMesh) {
  twin.refs.lcdMesh.material = new THREE.MeshBasicMaterial({
    map: lcdTexture,
    toneMapped: false,
  });
}

function updateLCD() {
  ctx.fillStyle = '#0a1018';
  ctx.fillRect(0, 0, 1024, 768);

  // Top header bar
  ctx.fillStyle = '#141c28';
  ctx.fillRect(0, 0, 1024, 75);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('SREdesigns UNI-9000 PRO', 35, 48);

  ctx.fillStyle = '#8b9bb0';
  ctx.font = '22px -apple-system, sans-serif';
  ctx.fillText(`GAS: ${state.gas_type.toUpperCase()} (99.999%)  |  MODE: AUTO PURITY`, 480, 48);

  // Divider line
  ctx.strokeStyle = '#2a3545';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 75);
  ctx.lineTo(1024, 75);
  ctx.stroke();

  // Primary Metrics Card 1: Oxygen (O2)
  drawMetricCard(35, 110, 460, 240, 'OXYGEN CONTENT', `${state.o2_ppm.toFixed(2)}`, 'ppm', state.o2_ppm < 1.0 ? '#3dd68c' : '#f04460');

  // Primary Metrics Card 2: Moisture (H2O)
  drawMetricCard(525, 110, 460, 240, 'MOISTURE LEVEL', `${state.h2o_ppm.toFixed(2)}`, 'ppm', state.h2o_ppm < 1.0 ? '#3dd68c' : '#f04460');

  // Secondary Metrics Card 3: Differential Pressure
  const pColor = Math.abs(state.pressure_mbar - state.pressure_setpoint) < 1.0 ? '#00d4e8' : (state.pressure_mbar < 0 ? '#f0b429' : '#3dd68c');
  drawMetricCard(35, 380, 460, 210, 'CHAMBER PRESSURE', `${state.pressure_mbar >= 0 ? '+' : ''}${state.pressure_mbar.toFixed(2)}`, 'mbar', pColor);

  // Secondary Metrics Card 4: Transfer Antechamber
  let anteStatus = `${state.ante_vacuum_mbar.toFixed(0)} mbar`;
  let anteColor = '#8b9bb0';
  if (state.ante_vacuum_mbar < 50.0) {
    anteStatus = `VAC: ${state.ante_vacuum_mbar.toFixed(1)} mbar`;
    anteColor = '#f0b429';
  } else if (state.ante_cycling) {
    anteStatus = `CYCLE ${state.ante_cycle_count + 1}/${state.target_cycles}`;
    anteColor = '#00d4e8';
  }
  drawMetricCard(525, 380, 460, 210, 'ANTECHAMBER VACUUM', anteStatus, '', anteColor);

  // Bottom Status Bar
  ctx.fillStyle = '#111722';
  ctx.fillRect(0, 620, 1024, 148);

  ctx.strokeStyle = '#2a3545';
  ctx.strokeRect(35, 635, 950, 105);

  ctx.fillStyle = '#e6edf5';
  ctx.font = 'bold 22px -apple-system, sans-serif';
  ctx.fillText('PURIFIER: CATALYTIC RECIRCULATION [ACTIVE 150 L/min]', 60, 675);

  ctx.fillStyle = state.purging ? '#00d4e8' : (state.foot_pedal ? '#f0b429' : '#3dd68c');
  ctx.font = '20px -apple-system, sans-serif';
  const statusMsg = state.purging
    ? 'HIGH-VOLUME PURGE IN PROGRESS (45 L/min Ar)'
    : (state.foot_pedal ? 'FOOT PEDAL ASSIST: NEGATIVE PRESSURE ENGAGED' : 'ATMOSPHERE STABLE: ULTRA-PURE INERT ENVIRONMENT');
  ctx.fillText(statusMsg, 60, 715);

  lcdTexture.needsUpdate = true;
}

function drawMetricCard(x, y, w, h, title, val, unit, color) {
  ctx.fillStyle = '#141c28';
  ctx.strokeStyle = '#2a3545';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#8b9bb0';
  ctx.font = '600 20px -apple-system, sans-serif';
  ctx.fillText(title, x + 25, y + 42);

  ctx.fillStyle = color;
  ctx.font = 'bold 64px -apple-system, "SF Pro Display", sans-serif';
  ctx.fillText(val, x + 25, y + 135);

  if (unit) {
    ctx.fillStyle = '#8b9bb0';
    ctx.font = '24px -apple-system, sans-serif';
    ctx.fillText(unit, x + 25 + ctx.measureText(val).width + 15, y + 135);
  }

  // Small indicator bar
  ctx.fillStyle = color;
  ctx.fillRect(x + 25, y + 165, w - 50, 6);
}

// ---------------------------------------------------------------------------
// Simulation Physics Loop
// ---------------------------------------------------------------------------
function updatePhysics(dt) {
  // 1. Purging dynamics
  if (state.purging) {
    state.o2_ppm = Math.max(0.08, state.o2_ppm - 0.45 * dt);
    state.h2o_ppm = Math.max(0.06, state.h2o_ppm - 0.40 * dt);
    if (state.o2_ppm <= 0.15 && state.h2o_ppm <= 0.15) {
      state.purging = false;
      sfx.stopPurgeHiss();
      document.getElementById('btn-purge').classList.remove('active');
      document.getElementById('btn-purge').textContent = 'PURGE: OFF';
    }
  }

  // 2. Catalytic scrubber circulation
  if (state.circulation && !state.purging) {
    if (state.o2_ppm > 0.05) state.o2_ppm = Math.max(0.05, state.o2_ppm - 0.015 * dt);
    if (state.h2o_ppm > 0.05) state.h2o_ppm = Math.max(0.05, state.h2o_ppm - 0.015 * dt);
  }

  // 3. Differential pressure regulation
  const targetP = state.foot_pedal ? -1.5 : state.pressure_setpoint;
  const pDiff = targetP - state.pressure_mbar;
  state.pressure_mbar += pDiff * Math.min(1.0, 1.2 * dt);

  // 4. Antechamber Evacuation & Refill loop
  if (state.ante_cycling) {
    if (state.ante_vacuum_mbar > 1.5) {
      // Pulling vacuum
      state.ante_vacuum_mbar = Math.max(0.5, state.ante_vacuum_mbar - 220.0 * dt);
    } else {
      // Reached vacuum, refill with inert gas
      state.ante_cycle_count++;
      if (state.ante_cycle_count < state.target_cycles) {
        state.ante_vacuum_mbar = 1013.0; // Simulated quick refill step in demo
      } else {
        state.ante_cycling = false;
        state.ante_vacuum_mbar = 1013.0;
        sfx.stopVacuumPump();
        document.getElementById('btn-ante-cycle').classList.remove('active');
        document.getElementById('btn-ante-cycle').textContent = '3-CYCLE XFER: IDLE';
      }
    }
  }

  // 5. Leak ingress if inner door opened to unpurged antechamber
  if (state.inner_door_open && state.ante_cycle_count === 0) {
    state.o2_ppm = Math.min(500.0, state.o2_ppm + 12.0 * dt);
    state.h2o_ppm = Math.min(500.0, state.h2o_ppm + 10.0 * dt);
  }

  // 6. Kinematics interpolation
  const outerTarget = state.outer_door_open ? 1.85 : 0.0;
  state.outer_door_angle += (outerTarget - state.outer_door_angle) * Math.min(1.0, 6.0 * dt);
  twin.setOuterDoorAngle(state.outer_door_angle);

  const innerTarget = state.inner_door_open ? -1.85 : 0.0;
  state.inner_door_angle += (innerTarget - state.inner_door_angle) * Math.min(1.0, 6.0 * dt);
  twin.setInnerDoorAngle(state.inner_door_angle);

  const pedalTarget = state.foot_pedal ? 0.16 : 0.0;
  state.foot_pedal_angle += (pedalTarget - state.foot_pedal_angle) * Math.min(1.0, 10.0 * dt);
  twin.setFootPedalAngle(state.foot_pedal_angle);

  // Antechamber vacuum gauge needle
  const vacRatio = Math.max(0.0, Math.min(1.0, (1013.0 - state.ante_vacuum_mbar) / 1013.0));
  twin.setVacuumGaugeNeedle(vacRatio);

  // Update HTML telemetry readouts
  updateTelemetryUI();
}

function updateTelemetryUI() {
  document.getElementById('telem-o2').textContent = `${state.o2_ppm.toFixed(2)} ppm`;
  document.getElementById('telem-h2o').textContent = `${state.h2o_ppm.toFixed(2)} ppm`;
  document.getElementById('telem-pressure').textContent = `${state.pressure_mbar >= 0 ? '+' : ''}${state.pressure_mbar.toFixed(2)} mbar`;
  document.getElementById('telem-gas').textContent = state.gas_type;
  document.getElementById('telem-ante').textContent = `${state.ante_vacuum_mbar.toFixed(0)} mbar`;

  const statusPill = document.getElementById('status-pill');
  if (state.purging) {
    statusPill.className = 'pill purging';
    statusPill.textContent = 'PURGING';
  } else if (state.ante_cycling) {
    statusPill.className = 'pill evac';
    statusPill.textContent = 'ANTECHAMBER EVAC';
  } else if (state.o2_ppm > 5.0) {
    statusPill.className = 'pill alarm';
    statusPill.textContent = 'O2 ALARM';
  } else {
    statusPill.className = 'pill purged';
    statusPill.textContent = 'INERT PURGED';
  }
}

// ---------------------------------------------------------------------------
// Camera Presets
// ---------------------------------------------------------------------------
function setCameraView(presetName) {
  const cfg = GLOVE_BOX_CAMERAS[presetName];
  if (!cfg) return;

  const startPos = camera.position.clone();
  const endPos = new THREE.Vector3(...cfg.pos);
  const startTgt = controls.target.clone();
  const endTgt = new THREE.Vector3(...cfg.target);

  const dur = 800;
  const t0 = performance.now();

  function anim(now) {
    const elapsed = now - t0;
    const p = Math.min(1, elapsed / dur);
    const ease = 0.5 - 0.5 * Math.cos(Math.PI * p);

    camera.position.lerpVectors(startPos, endPos, ease);
    controls.target.lerpVectors(startTgt, endTgt, ease);
    controls.update();

    if (p < 1) requestAnimationFrame(anim);
  }
  requestAnimationFrame(anim);

  document.querySelectorAll('.view-btn').forEach((b) => b.classList.remove('active'));
  const idMap = {
    CAM_ISO: 'btn-cam-iso',
    CAM_FRONT: 'btn-cam-front',
    CAM_SIDE: 'btn-cam-side',
    CAM_TOP: 'btn-cam-top',
  };
  const btn = document.getElementById(idMap[presetName]);
  if (btn) btn.classList.add('active');
}

// ---------------------------------------------------------------------------
// Classroom Demonstration Workflow
// ---------------------------------------------------------------------------
async function runClassroomDemo() {
  if (state.demoRunning) return;
  state.demoRunning = true;
  const demoBtn = document.getElementById('btn-demo');
  demoBtn.classList.add('active');
  demoBtn.textContent = 'Demo Running...';

  const statusDetail = document.getElementById('status-detail');

  try {
    // Step 1: Switch to Side view to highlight antechamber
    setCameraView('CAM_SIDE');
    statusDetail.textContent = 'Step 1/6: Verifying baseline ultra-pure inert atmosphere (<0.2 ppm O2/H2O)...';
    await wait(2200);

    // Step 2: Open outer loading door
    statusDetail.textContent = 'Step 2/6: Opening outer antechamber door for air-sensitive vial ingress...';
    state.outer_door_open = true;
    sfx.playDoorLatch(false);
    await wait(2000);

    // Step 3: Close outer door
    statusDetail.textContent = 'Step 3/6: Sealing outer door clamp with silicone O-ring gasket...';
    state.outer_door_open = false;
    sfx.playDoorLatch(true);
    await wait(1800);

    // Step 4: Initiate 3-Cycle Antechamber Evacuate & Inert Refill
    statusDetail.textContent = 'Step 4/6: Initiating 3-cycle vacuum roughing (<0.5 mbar) and Argon refill...';
    state.ante_cycling = true;
    state.ante_cycle_count = 0;
    sfx.startVacuumPump();
    await wait(4500);

    // Step 5: Switch to Front view, open inner transfer door
    setCameraView('CAM_FRONT');
    statusDetail.textContent = 'Step 5/6: Equalized pressure confirmed. Opening inner door into sealed chamber...';
    state.inner_door_open = true;
    sfx.playDoorLatch(false);
    await wait(2400);

    // Step 6: Depress foot pedal for glove entry assist
    statusDetail.textContent = 'Step 6/6: Operator depressing foot switch for negative pressure assist...';
    state.foot_pedal = true;
    sfx.playPedalClick(true);
    await wait(2600);

    state.foot_pedal = false;
    sfx.playPedalClick(false);
    state.inner_door_open = false;
    sfx.playDoorLatch(true);
    statusDetail.textContent = 'Demo Complete: Organometallic transfer completed under continuous <0.2 ppm purity.';

  } finally {
    state.demoRunning = false;
    demoBtn.classList.remove('active');
    demoBtn.textContent = 'Run Classroom Demo';
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Event Listeners & UI Binding
// ---------------------------------------------------------------------------
document.getElementById('btn-cam-iso').addEventListener('click', () => setCameraView('CAM_ISO'));
document.getElementById('btn-cam-front').addEventListener('click', () => setCameraView('CAM_FRONT'));
document.getElementById('btn-cam-side').addEventListener('click', () => setCameraView('CAM_SIDE'));
document.getElementById('btn-cam-top').addEventListener('click', () => setCameraView('CAM_TOP'));

document.getElementById('btn-explode').addEventListener('click', (e) => {
  state.exploded = !state.exploded;
  e.currentTarget.classList.toggle('active', state.exploded);
  twin.setExploded(state.exploded);
  sfx.playTouchBeep(state.exploded ? 600 : 400);
});

document.getElementById('btn-wireframe').addEventListener('click', (e) => {
  state.wireframe = !state.wireframe;
  e.currentTarget.classList.toggle('active', state.wireframe);
  twin.root.traverse((c) => {
    if (c.isMesh && c.material && c.name !== 'UI_LCD') {
      c.material.wireframe = state.wireframe;
    }
  });
  sfx.playTouchBeep(700);
});

document.getElementById('btn-auto-rotate').addEventListener('click', (e) => {
  state.autoRotate = !state.autoRotate;
  e.currentTarget.classList.toggle('active', state.autoRotate);
  controls.autoRotate = state.autoRotate;
  controls.autoRotateSpeed = state.orbitSpeed;
});

document.getElementById('orbit-speed').addEventListener('input', (e) => {
  state.orbitSpeed = parseFloat(e.target.value);
  document.getElementById('orbit-speed-val').textContent = `${state.orbitSpeed.toFixed(1)}×`;
  controls.autoRotateSpeed = state.orbitSpeed;
});

document.getElementById('btn-sfx-mute').addEventListener('click', (e) => {
  state.muted = !state.muted;
  sfx.setMuted(state.muted);
  e.currentTarget.classList.toggle('active', state.muted);
  e.currentTarget.textContent = state.muted ? 'Unmute SFX' : 'Mute SFX';
});

// Control Buttons
document.getElementById('btn-purge').addEventListener('click', (e) => {
  state.purging = !state.purging;
  e.currentTarget.classList.toggle('active', state.purging);
  e.currentTarget.textContent = state.purging ? 'PURGE: ACTIVE' : 'PURGE: OFF';
  if (state.purging) {
    sfx.startPurgeHiss();
    sfx.playValveClick(true);
  } else {
    sfx.stopPurgeHiss();
    sfx.playValveClick(false);
  }
});

document.getElementById('btn-ante-cycle').addEventListener('click', (e) => {
  if (state.outer_door_open || state.inner_door_open) {
    sfx.playAlarm();
    alert('Cannot cycle antechamber: Both doors must be sealed first!');
    return;
  }
  state.ante_cycling = !state.ante_cycling;
  e.currentTarget.classList.toggle('active', state.ante_cycling);
  e.currentTarget.textContent = state.ante_cycling ? '3-CYCLE XFER: RUNNING' : '3-CYCLE XFER: IDLE';
  if (state.ante_cycling) {
    state.ante_cycle_count = 0;
    sfx.startVacuumPump();
  } else {
    sfx.stopVacuumPump();
    state.ante_vacuum_mbar = 1013.0;
  }
});

document.getElementById('btn-outer-door').addEventListener('click', (e) => {
  if (state.inner_door_open) {
    sfx.playAlarm();
    alert('Door Interlock: Inner transfer door is open. Outer door locked!');
    return;
  }
  if (state.ante_vacuum_mbar < 950.0) {
    sfx.playAlarm();
    alert('Vacuum Interlock: Antechamber is under vacuum (< 950 mbar). Equalize before opening!');
    return;
  }
  state.outer_door_open = !state.outer_door_open;
  if (state.outer_door_open) {
    state.ante_cycle_count = 0; // Exposing antechamber to room air invalidates prior cycles
  }
  e.currentTarget.classList.toggle('active', state.outer_door_open);
  e.currentTarget.textContent = state.outer_door_open ? 'OUTER DOOR: OPEN' : 'OUTER DOOR: SEALED';
  sfx.playDoorLatch(!state.outer_door_open);
});

document.getElementById('btn-inner-door').addEventListener('click', (e) => {
  if (state.outer_door_open) {
    sfx.playAlarm();
    alert('Door Interlock: Outer door is open. Inner door locked!');
    return;
  }
  if (state.ante_vacuum_mbar < 950.0) {
    sfx.playAlarm();
    alert('Vacuum Interlock: Antechamber is under vacuum (< 950 mbar). Equalize before opening!');
    return;
  }
  state.inner_door_open = !state.inner_door_open;
  e.currentTarget.classList.toggle('active', state.inner_door_open);
  e.currentTarget.textContent = state.inner_door_open ? 'INNER DOOR: OPEN' : 'INNER DOOR: SEALED';
  sfx.playDoorLatch(!state.inner_door_open);
});

document.getElementById('btn-foot-pedal').addEventListener('click', (e) => {
  state.foot_pedal = !state.foot_pedal;
  e.currentTarget.classList.toggle('active', state.foot_pedal);
  e.currentTarget.textContent = state.foot_pedal ? 'PEDAL: ENGAGED (-P)' : 'PEDAL: IDLE (+P)';
  sfx.playPedalClick(state.foot_pedal);
});

document.getElementById('btn-gas-type').addEventListener('click', (e) => {
  state.gas_type = state.gas_type === 'Argon' ? 'Nitrogen' : 'Argon';
  e.currentTarget.textContent = `GAS: ${state.gas_type.toUpperCase()}`;
  sfx.playTouchBeep(850);
});

document.getElementById('btn-demo').addEventListener('click', () => {
  runClassroomDemo();
});

// Panel Collapse Toggles
document.querySelectorAll('.panel-collapse-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const panelKey = e.currentTarget.getAttribute('data-collapse');
    const panel = document.getElementById(`panel-${panelKey}`);
    if (panel) {
      panel.classList.toggle('collapsed');
      e.currentTarget.textContent = panel.classList.contains('collapsed') ? '◂' : '▾';
    }
  });
});

// Window resize
window.addEventListener('resize', () => {
  camera.aspect = viewport.clientWidth / viewport.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(viewport.clientWidth, viewport.clientHeight);
});

// ---------------------------------------------------------------------------
// Render Animation Loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);

  updatePhysics(dt);
  updateLCD();
  controls.update();
  renderer.render(scene, camera);
}

// Initial LCD render & camera viewpoint
updateLCD();
setCameraView('CAM_ISO');
animate();
