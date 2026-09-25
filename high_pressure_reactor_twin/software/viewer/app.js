/**
 * SREdesigns Parr 4560 / 4848 Reactor — Interactive Application Controller (app.js)
 * 
 * Features:
 * - Three.js WebGL scene with shadow mapping and realistic lab lighting
 * - Dynamic CanvasTexture UI_LCD on Parr 4848 Controller (strictly enforced texture.flipY = false)
 * - Full thermal PID simulation, Gay-Lussac gas expansion, closed-loop tachometer regulation
 * - Analog pressure gauge needle sweep, thermal mantle glow shader, and magnetic stirrer rotation
 * - Procedural Web Audio API sound synthesis (sfx.js)
 * - Automated classroom demonstration workflow
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildReactor3D, REACTOR_CAMERAS } from './reactor3d.js';
import { sfx } from './sfx.js';

// ---------------------------------------------------------------------------
// Simulation State
// ---------------------------------------------------------------------------
const state = {
  // Thermal parameters (Parr 4566 300 mL vessel)
  pv_temp_c: 22.0,
  sv_temp_c: 150.0,
  ambient_temp_c: 22.0,
  heater_on: false,
  heater_power_pct: 0.0,
  cooling_active: false,

  // Motor & Stirrer parameters
  pv_rpm: 0.0,
  sv_rpm: 600,
  stirrer_on: false,
  stirrer_angle: 0.0,

  // Pressure parameters
  pressure_bar: 1.0,
  charge_pressure: 1.0,
  charge_temp: 22.0,
  inlet_open: false,
  vent_open: false,
  burst_disc_ruptured: false,

  // PID controller registers
  kp: 4.5,
  ki: 0.08,
  kd: 12.0,
  integral_err: 0.0,
  prev_err: 0.0,

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
camera.position.set(...REACTOR_CAMERAS.CAM_ISO.pos);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(viewport.clientWidth, viewport.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
viewport.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(...REACTOR_CAMERAS.CAM_ISO.target);

// ---------------------------------------------------------------------------
// Lighting
// ---------------------------------------------------------------------------
const ambLight = new THREE.AmbientLight(0xdde5f0, 0.60);
scene.add(ambLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
dirLight.position.set(10, 16, -12);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 40;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 15;
dirLight.shadow.camera.bottom = -2;
scene.add(dirLight);

const rimLight = new THREE.DirectionalLight(0x7090b0, 0.5);
rimLight.position.set(-10, 12, 10);
scene.add(rimLight);

// Tabletop grid datum (Y = 0)
const gridHelper = new THREE.GridHelper(20, 20, 0x2a3545, 0x18202c);
gridHelper.position.y = -0.01;
scene.add(gridHelper);

// ---------------------------------------------------------------------------
// Build Procedural 3D Twin
// ---------------------------------------------------------------------------
const twin = buildReactor3D();
scene.add(twin.root);

// ---------------------------------------------------------------------------
// Dynamic CanvasTexture LCD Screen (Parr 4848 Dual-LED Display)
// Strict Rule: texture.flipY = false
// ---------------------------------------------------------------------------
const lcdCanvas = document.createElement('canvas');
lcdCanvas.width = 512;
lcdCanvas.height = 384;
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
  ctx.fillStyle = '#06080c';
  ctx.fillRect(0, 0, 512, 384);

  // Controller Header
  ctx.fillStyle = '#101722';
  ctx.fillRect(0, 0, 512, 45);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 16px -apple-system, sans-serif';
  ctx.fillText('PARR 4848 CONTROLLER', 20, 28);

  ctx.fillStyle = state.heater_on ? '#f59e0b' : '#3dd68c';
  ctx.font = '14px -apple-system, sans-serif';
  ctx.fillText(state.heater_on ? 'HEATING (SSR ON)' : 'READY', 350, 28);

  // Dual 7-Segment / LED Displays (PTM Module)
  // PV (Process Value): Red LED Readout
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(20, 60, 220, 110);
  ctx.strokeStyle = '#243041';
  ctx.strokeRect(20, 60, 220, 110);

  ctx.fillStyle = '#f87171';
  ctx.font = '13px monospace';
  ctx.fillText('PROCESS TEMP (PV)', 32, 82);

  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 42px monospace';
  ctx.fillText(`${state.pv_temp_c.toFixed(1)}°C`, 32, 140);

  // SV (Setpoint Value): Green LED Readout
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(265, 60, 225, 110);
  ctx.strokeStyle = '#243041';
  ctx.strokeRect(265, 60, 225, 110);

  ctx.fillStyle = '#4ade80';
  ctx.font = '13px monospace';
  ctx.fillText('SETPOINT TEMP (SV)', 277, 82);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 42px monospace';
  ctx.fillText(`${state.sv_temp_c.toFixed(1)}°C`, 277, 140);

  // Secondary Row: Tachometer RPM & Transducer Pressure
  // Tachometer (TDM/MCM Module)
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(20, 185, 220, 110);
  ctx.strokeStyle = '#243041';
  ctx.strokeRect(20, 185, 220, 110);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '13px monospace';
  ctx.fillText('STIRRER SPEED', 32, 208);

  ctx.fillStyle = '#00d4e8';
  ctx.font = 'bold 38px monospace';
  ctx.fillText(`${Math.round(state.pv_rpm)} RPM`, 32, 262);

  // Pressure (PDM Module)
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(265, 185, 225, 110);
  ctx.strokeStyle = '#243041';
  ctx.strokeRect(265, 185, 225, 110);

  ctx.fillStyle = state.pressure_bar > 180 ? '#ef4444' : '#fbbf24';
  ctx.font = '13px monospace';
  ctx.fillText('TRANSDUCER PRESSURE', 277, 208);

  ctx.fillStyle = state.pressure_bar > 180 ? '#ef4444' : '#f59e0b';
  ctx.font = 'bold 38px monospace';
  ctx.fillText(`${state.pressure_bar.toFixed(1)} BAR`, 277, 262);

  // Bottom Status Bar & Heater Power %
  ctx.fillStyle = '#101722';
  ctx.fillRect(20, 310, 470, 55);
  ctx.strokeStyle = '#243041';
  ctx.strokeRect(20, 310, 470, 55);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px -apple-system, sans-serif';
  ctx.fillText(`HEATER OUTPUT: ${state.heater_power_pct.toFixed(0)}%`, 35, 342);

  // Power Bar graph
  ctx.fillStyle = '#243041';
  ctx.fillRect(230, 328, 240, 18);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(230, 328, (state.heater_power_pct / 100.0) * 240, 18);

  lcdTexture.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Physical Dynamics Simulation Loop
// ---------------------------------------------------------------------------
function updatePhysics(dt) {
  // 1. Motor speed ramp & impeller rotation
  if (state.stirrer_on) {
    const ramp = 300.0 * dt;
    if (state.pv_rpm < state.sv_rpm) state.pv_rpm = Math.min(state.sv_rpm, state.pv_rpm + ramp);
    else if (state.pv_rpm > state.sv_rpm) state.pv_rpm = Math.max(state.sv_rpm, state.pv_rpm - ramp);
    sfx.updateMotorRpm(state.pv_rpm);
  } else {
    state.pv_rpm = Math.max(0, state.pv_rpm - 400.0 * dt);
    if (state.pv_rpm <= 5.0 && sfx.motorNode) {
      sfx.stopMotorHum();
    }
  }

  state.stirrer_angle += (state.pv_rpm / 60.0) * Math.PI * 2 * dt;
  twin.setStirrerRotation(state.stirrer_angle);

  // 2. Temperature PID loop (Parr PTM Module)
  if (state.heater_on && !state.burst_disc_ruptured) {
    const err = state.sv_temp_c - state.pv_temp_c;
    state.integral_err = Math.max(-100.0, Math.min(100.0, state.integral_err + err * dt));
    const derivative = dt > 0 ? (err - state.prev_err) / dt : 0;
    state.prev_err = err;

    const rawOutput = (state.kp * err) + (state.ki * state.integral_err) + (state.kd * derivative);
    state.heater_power_pct = Math.max(0.0, Math.min(100.0, rawOutput));
  } else {
    state.heater_power_pct = 0.0;
  }

  // Thermal heat transfer: 780W mantle vs convective loss & cooling coil
  const pIn = (state.heater_power_pct / 100.0) * 780.0;
  const qLoss = 1.85 * (state.pv_temp_c - state.ambient_temp_c);
  const qCool = state.cooling_active ? 450.0 : 0.0;
  const netQ = pIn - qLoss - qCool;
  const deltaT = (netQ / 1200.0) * dt;
  state.pv_temp_c = Math.max(state.ambient_temp_c, state.pv_temp_c + deltaT);

  // 3. Pressure dynamics: Gas Inlet, Vent, and Gay-Lussac thermal expansion
  if (state.burst_disc_ruptured) {
    state.pressure_bar = 1.0;
  } else if (state.inlet_open) {
    state.pressure_bar = Math.min(180.0, state.pressure_bar + 25.0 * dt);
    state.charge_pressure = state.pressure_bar;
    state.charge_temp = state.pv_temp_c;
  }

  if (state.vent_open) {
    state.pressure_bar = Math.max(1.0, state.pressure_bar - 30.0 * dt);
    state.charge_pressure = state.pressure_bar;
    state.charge_temp = state.pv_temp_c;
    if (state.pressure_bar <= 1.05) {
      state.vent_open = false;
      sfx.stopVentHiss();
      document.getElementById('btn-vent').classList.remove('active');
      document.getElementById('btn-vent').textContent = 'VENT VALVE: CLOSED';
    }
  }

  if (!state.inlet_open && !state.vent_open && !state.burst_disc_ruptured) {
    const tempK = state.pv_temp_c + 273.15;
    const chargeK = Math.max(273.15, state.charge_temp + 273.15);
    let thermalP = state.charge_pressure * (tempK / chargeK);
    if (state.pv_temp_c > 100.0) {
      thermalP += Math.pow((state.pv_temp_c - 100.0) / 50.0, 2.0) * 2.5;
    }
    state.pressure_bar = Math.max(1.0, thermalP);
  }

  // 4. Burst Disc Rupture Interlock (Rated 250 bar)
  if (state.pressure_bar >= 250.0 && !state.burst_disc_ruptured) {
    state.burst_disc_ruptured = true;
    state.heater_on = false;
    state.heater_power_pct = 0.0;
    state.stirrer_on = false;
    state.pressure_bar = 1.0;
    sfx.playRuptureBlast();
    sfx.playAlarm();
    alert('CRITICAL SAFETY INTERLOCK: Rupture Disc burst at 250 bar! System depressurized.');
  }

  // 5. Update 3D Visual Effects
  twin.updateThermalGlow(state.pv_temp_c);
  twin.setPressureGaugeSweep(state.pressure_bar);

  // 6. Update Telemetry UI
  updateTelemetryUI();
}

function updateTelemetryUI() {
  document.getElementById('telem-temp').textContent = `${state.pv_temp_c.toFixed(1)} °C`;
  document.getElementById('telem-sv-temp').textContent = `${state.sv_temp_c.toFixed(1)} °C`;
  document.getElementById('telem-pressure').textContent = `${state.pressure_bar.toFixed(1)} bar`;
  document.getElementById('telem-rpm').textContent = `${Math.round(state.pv_rpm)} RPM`;
  document.getElementById('telem-power').textContent = `${state.heater_power_pct.toFixed(0)}%`;

  const statusPill = document.getElementById('status-pill');
  if (state.burst_disc_ruptured) {
    statusPill.className = 'pill alarm';
    statusPill.textContent = 'DISC RUPTURED';
  } else if (state.pressure_bar > 180.0) {
    statusPill.className = 'pill alarm';
    statusPill.textContent = 'OVERPRESSURE';
  } else if (state.heater_on && state.stirrer_on) {
    statusPill.className = 'pill running';
    statusPill.textContent = 'RUNNING';
  } else if (state.heater_on) {
    statusPill.className = 'pill heating';
    statusPill.textContent = 'HEATING';
  } else {
    statusPill.className = 'pill idle';
    statusPill.textContent = 'STANDBY';
  }
}

// ---------------------------------------------------------------------------
// Camera Presets
// ---------------------------------------------------------------------------
function setCameraView(presetName) {
  const cfg = REACTOR_CAMERAS[presetName];
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
    // Step 1: Camera Front view
    setCameraView('CAM_FRONT');
    statusDetail.textContent = 'Step 1/6: Vessel bolted with 6-bolt split-ring closure. Checking ambient datum...';
    await wait(2200);

    // Step 2: Open gas inlet, charge to 50 bar
    statusDetail.textContent = 'Step 2/6: Opening high-pressure H₂ gas supply. Pressurizing cylinder to 50 bar...';
    state.inlet_open = true;
    sfx.startGasInletHiss();
    await wait(2500);

    state.inlet_open = false;
    sfx.stopGasInletHiss();
    statusDetail.textContent = 'Step 3/6: H₂ gas supply sealed at 50 bar. Starting magnetic drive stirrer at 600 RPM...';
    await wait(1500);

    // Step 3: Turn on stirrer
    state.stirrer_on = true;
    sfx.startMotorHum(600);
    document.getElementById('btn-stirrer').classList.add('active');
    document.getElementById('btn-stirrer').textContent = 'STIRRER: 600 RPM';
    await wait(2400);

    // Step 4: Turn on heater to 160°C setpoint
    statusDetail.textContent = 'Step 4/6: Engaging 780W electric mantle. Observing thermal glow and Gay-Lussac expansion...';
    state.sv_temp_c = 160.0;
    state.heater_on = true;
    sfx.playRelayClick(true);
    document.getElementById('btn-heater').classList.add('active');
    document.getElementById('btn-heater').textContent = 'HEATER: ON';
    await wait(4500);

    // Step 5: Activate cooling coil to demonstrate thermal control
    statusDetail.textContent = 'Step 5/6: Hydrogenation reaction complete. Engaging serpentine cooling water loop...';
    state.cooling_active = true;
    state.heater_on = false;
    sfx.playRelayClick(false);
    document.getElementById('btn-heater').classList.remove('active');
    document.getElementById('btn-heater').textContent = 'HEATER: OFF';
    await wait(3200);

    // Step 6: Vent residual pressure
    statusDetail.textContent = 'Step 6/6: Temperature stabilized. Opening vent needle valve to relieve pressure safely...';
    state.cooling_active = false;
    state.vent_open = true;
    sfx.startVentHiss();
    await wait(3000);

    state.vent_open = false;
    sfx.stopVentHiss();
    state.stirrer_on = false;
    sfx.stopMotorHum();
    document.getElementById('btn-stirrer').classList.remove('active');
    document.getElementById('btn-stirrer').textContent = 'STIRRER: OFF';
    statusDetail.textContent = 'Demo Complete: High-pressure hydrogenation test successfully executed and depressurized.';

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

// Actuator Controls
document.getElementById('btn-heater').addEventListener('click', (e) => {
  state.heater_on = !state.heater_on;
  e.currentTarget.classList.toggle('active', state.heater_on);
  e.currentTarget.textContent = state.heater_on ? 'HEATER: ON' : 'HEATER: OFF';
  sfx.playRelayClick(state.heater_on);
});

document.getElementById('btn-stirrer').addEventListener('click', (e) => {
  state.stirrer_on = !state.stirrer_on;
  e.currentTarget.classList.toggle('active', state.stirrer_on);
  e.currentTarget.textContent = state.stirrer_on ? `STIRRER: ${state.sv_rpm} RPM` : 'STIRRER: OFF';
  if (state.stirrer_on) {
    sfx.startMotorHum(state.sv_rpm);
  } else {
    sfx.stopMotorHum();
  }
});

document.getElementById('btn-cooling').addEventListener('click', (e) => {
  state.cooling_active = !state.cooling_active;
  e.currentTarget.classList.toggle('active', state.cooling_active);
  e.currentTarget.textContent = state.cooling_active ? 'COOLING: ACTIVE' : 'COOLING: OFF';
  sfx.playTouchBeep(520);
});

document.getElementById('btn-inlet').addEventListener('click', (e) => {
  state.inlet_open = !state.inlet_open;
  e.currentTarget.classList.toggle('active-warn', state.inlet_open);
  e.currentTarget.textContent = state.inlet_open ? 'INLET: OPEN (PRESSURIZING)' : 'INLET: CLOSED';
  if (state.inlet_open) sfx.startGasInletHiss();
  else sfx.stopGasInletHiss();
});

document.getElementById('btn-vent').addEventListener('click', (e) => {
  state.vent_open = !state.vent_open;
  e.currentTarget.classList.toggle('active-warn', state.vent_open);
  e.currentTarget.textContent = state.vent_open ? 'VENT: OPEN (RELIEVING)' : 'VENT: CLOSED';
  if (state.vent_open) sfx.startVentHiss();
  else sfx.stopVentHiss();
});

document.getElementById('slider-temp').addEventListener('input', (e) => {
  state.sv_temp_c = parseFloat(e.target.value);
  document.getElementById('val-temp').textContent = `${state.sv_temp_c.toFixed(0)}°C`;
});

document.getElementById('slider-rpm').addEventListener('input', (e) => {
  state.sv_rpm = parseInt(e.target.value, 10);
  document.getElementById('val-rpm').textContent = `${state.sv_rpm} RPM`;
  if (state.stirrer_on) {
    document.getElementById('btn-stirrer').textContent = `STIRRER: ${state.sv_rpm} RPM`;
  }
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
