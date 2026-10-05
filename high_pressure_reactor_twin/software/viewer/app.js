/**
 * SREdesigns Parr 4560 / 4848 Reactor — Interactive Application Controller (app.js)
 * 
 * Gold-Tier Implementation adhering to the Centrifuge Standard:
 * - Three.js WebGL scene with realistic laboratory lighting, shadow mapping, and PBR materials
 * - Standardized lab room & black epoxy benchtop (INSTRUMENT_BENCH at Y = 0) with perimeter trim
 * - Heavy-duty bench duplex receptacle (Power_Receptacle_Duplex) & SJTOW power cord
 * - Strict Physical Circuit Continuity (DIAG-014): unplugging cuts 100% power (screen black, RPM = 0)
 * - Dynamic CanvasTexture UI_LCD on Parr 4848 Controller (strictly enforced texture.flipY = false)
 * - Full 3-panel collapsible layout (Instrument Controls, Part Explorer with 40+ parts, Lab Bench)
 * - Part Explorer click-to-isolate and wireframe inspection mode
 * - Full thermal PID simulation, Gay-Lussac gas expansion, closed-loop tachometer regulation
 * - Analog Bourdon pressure gauge needle sweep, mantle thermal glow, and magnetic stirrer rotation
 * - Procedural Web Audio API sound synthesis (sfx.js) with plug, switch, relay, and motor sounds
 * - Interactive toolbar sliders: Camera Zoom, Lab Light, Lighting Mood, Orbit Speed, Reset View
 * - GLP analytical batch run audit logging with CSV export
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildReactor3D, REACTOR_CAMERAS, INSTRUMENT_BENCH } from './reactor3d.js';
import { sfx } from './sfx.js';

// ---------------------------------------------------------------------------
// Simulation State Engine
// ---------------------------------------------------------------------------
const state = {
  // Electrical continuity & mains power
  is_plugged_in: true,
  mains_power: true,

  // Thermal parameters (Parr 4566 300 mL 316SS vessel)
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
  motor_torque_nm: 0.0,

  // Pressure & Gas parameters
  pressure_bar: 1.0,
  charge_pressure: 30.0,
  inlet_open: false,
  vent_open: false,
  sample_open: false,
  burst_disc_ruptured: false,

  // Reactant fluids
  solvent: 'water',
  gas: 'h2',
  catalyst: 'pd_c',

  // PID controller registers
  kp: 4.5,
  ki: 0.08,
  kd: 12.0,
  integral_err: 0.0,
  prev_err: 0.0,

  // View & UI controls
  exploded: false,
  wireframe: false,
  autoRotate: false,
  orbitSpeed: 1.0,
  cameraZoom: 45,
  labLightIntensity: 1.0,
  labLightMood: 'neutral',
  muted: false,
  focusedPart: null,
  demoRunning: false,
};

// Solvent vapor pressure / boiling parameters
const SOLVENTS = {
  water: { name: 'Water', bp: 100.0, visc: 1.0, pCrit: 220.6 },
  ethanol: { name: 'Ethanol', bp: 78.4, visc: 1.2, pCrit: 63.8 },
  cyclohexane: { name: 'Cyclohexane', bp: 80.7, visc: 0.9, pCrit: 40.7 },
  toluene: { name: 'Toluene', bp: 110.6, visc: 0.6, pCrit: 41.2 },
  mineral_oil: { name: 'Mineral Oil', bp: 310.0, visc: 80.0, pCrit: 25.0 },
};

// GLP Log records
const glpLog = [];
let lastLogTime = 0;

// ---------------------------------------------------------------------------
// Three.js Scene Setup
// ---------------------------------------------------------------------------
const viewport = document.getElementById('viewport3d');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0c1016);

const camera = new THREE.PerspectiveCamera(
  REACTOR_CAMERAS.CAM_ISO.fov || 42,
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
controls.maxPolarAngle = Math.PI / 2 + 0.08; // Prevent seeing underneath bench

// ---------------------------------------------------------------------------
// Lighting Setup (Studio 3-Point + Rim + Ceiling + Mood)
// ---------------------------------------------------------------------------
const ambLight = new THREE.AmbientLight(0xe2e8f0, 0.75);
scene.add(ambLight);

const dirLightKey = new THREE.DirectionalLight(0xfff7ed, 1.35);
dirLightKey.position.set(-4, 9, -7);
dirLightKey.target.position.set(1.35, 2.3, 0);
scene.add(dirLightKey.target);
dirLightKey.castShadow = true;
dirLightKey.shadow.mapSize.width = 2048;
dirLightKey.shadow.mapSize.height = 2048;
dirLightKey.shadow.camera.near = 1;
dirLightKey.shadow.camera.far = 30;
dirLightKey.shadow.camera.left = -6;
dirLightKey.shadow.camera.right = 6;
dirLightKey.shadow.camera.top = 8;
dirLightKey.shadow.camera.bottom = -2;
dirLightKey.shadow.bias = -0.0005;
scene.add(dirLightKey);

const dirLightFill = new THREE.DirectionalLight(0xa5b4fc, 0.85);
dirLightFill.position.set(7, 7, -6);
dirLightFill.target.position.set(1.35, 2.3, 0);
scene.add(dirLightFill.target);
scene.add(dirLightFill);

const dirLightRim = new THREE.DirectionalLight(0x38bdf8, 0.55);
dirLightRim.position.set(0, 10, 7);
scene.add(dirLightRim);

const ceilingTube = new THREE.PointLight(0xffffff, 0.65, 30);
ceilingTube.position.set(1.35, 14, 0);
scene.add(ceilingTube);

function updateLightingMood(mood, intensity) {
  const baseI = intensity;
  dirLightKey.intensity = 1.35 * baseI;
  dirLightFill.intensity = 0.85 * baseI;
  dirLightRim.intensity = 0.55 * baseI;
  ceilingTube.intensity = 0.65 * baseI;
  ambLight.intensity = 0.75 * baseI;

  switch (mood) {
    case 'bright':
      dirLightKey.color.setHex(0xffffff);
      dirLightFill.color.setHex(0xdbeafe);
      ambLight.color.setHex(0xf8fafc);
      renderer.toneMappingExposure = 1.35;
      break;
    case 'dim':
      dirLightKey.color.setHex(0xfed7aa);
      dirLightFill.color.setHex(0x60a5fa);
      ambLight.color.setHex(0x334155);
      renderer.toneMappingExposure = 0.85;
      break;
    case 'cool':
      dirLightKey.color.setHex(0xe0f2fe);
      dirLightFill.color.setHex(0x38bdf8);
      ambLight.color.setHex(0x0284c7);
      renderer.toneMappingExposure = 1.15;
      break;
    case 'warm':
      dirLightKey.color.setHex(0xffedd5);
      dirLightFill.color.setHex(0xfb923c);
      ambLight.color.setHex(0xd97706);
      renderer.toneMappingExposure = 1.15;
      break;
    case 'neutral':
    default:
      dirLightKey.color.setHex(0xfff7ed);
      dirLightFill.color.setHex(0xa5b4fc);
      ambLight.color.setHex(0xe2e8f0);
      renderer.toneMappingExposure = 1.18;
      break;
  }
}

// ---------------------------------------------------------------------------
// Build Procedural 3D Twin Architecture
// ---------------------------------------------------------------------------
const twin = buildReactor3D();
scene.add(twin.root);

// ---------------------------------------------------------------------------
// Dynamic CanvasTexture LCD Screen on Parr 4848 Controller
// Strict Rule: texture.flipY = false & Invert geometry UV coordinates
// ---------------------------------------------------------------------------
const lcdCanvas = document.createElement('canvas');
lcdCanvas.width = 512;
lcdCanvas.height = 384;
const ctx = lcdCanvas.getContext('2d');

const lcdTexture = new THREE.CanvasTexture(lcdCanvas);
lcdTexture.flipY = false; // MANDATORY GOVERNANCE RULE
lcdTexture.colorSpace = THREE.SRGBColorSpace;

if (twin.refs.lcdMesh) {
  twin.refs.lcdMesh.material = new THREE.MeshBasicMaterial({
    map: lcdTexture,
    toneMapped: false,
    side: THREE.DoubleSide,
  });

  // Explicitly invert UV Y attribute on buffer geometry
  const uv = twin.refs.lcdMesh.geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setY(i, 1.0 - uv.getY(i));
  }
  uv.needsUpdate = true;
}

function updateLCD() {
  const hasPower = state.is_plugged_in && state.mains_power;

  if (!hasPower) {
    // Unpowered blackout state (DIAG-014)
    ctx.fillStyle = '#020406';
    ctx.fillRect(0, 0, 512, 384);
    ctx.fillStyle = '#0d131a';
    ctx.fillRect(20, 20, 472, 344);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(20, 20, 472, 344);
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NO POWER (DISCONNECTED)', 256, 190);
    lcdTexture.needsUpdate = true;
    return;
  }

  // Active Powered State
  ctx.fillStyle = '#06080c';
  ctx.fillRect(0, 0, 512, 384);

  // Controller Header
  ctx.fillStyle = '#101722';
  ctx.fillRect(0, 0, 512, 45);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PARR 4848 CONTROLLER', 20, 28);

  ctx.fillStyle = state.heater_on ? '#f59e0b' : '#3dd68c';
  ctx.font = '14px -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(state.heater_on ? 'HEATING (SSR ACTIVE)' : 'STANDBY · READY', 492, 28);

  // Dual LED Displays (PTM Module)
  // PV (Process Value): High-visibility Red LED
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(20, 60, 220, 110);
  ctx.strokeStyle = '#243041';
  ctx.strokeRect(20, 60, 220, 110);

  ctx.fillStyle = '#f87171';
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('PROCESS TEMP (PV)', 32, 82);

  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 40px monospace';
  ctx.fillText(`${state.pv_temp_c.toFixed(1)}°C`, 32, 140);

  // SV (Setpoint Value): High-visibility Green LED
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(272, 60, 220, 110);
  ctx.strokeStyle = '#243041';
  ctx.strokeRect(272, 60, 220, 110);

  ctx.fillStyle = '#4ade80';
  ctx.font = '12px monospace';
  ctx.fillText('SETPOINT TEMP (SV)', 284, 82);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 40px monospace';
  ctx.fillText(`${state.sv_temp_c.toFixed(1)}°C`, 284, 140);

  // Secondary Row: Tachometer RPM & Pressure Transducer
  // MCM Motor Tachometer
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(20, 185, 220, 110);
  ctx.strokeStyle = '#243041';
  ctx.strokeRect(20, 185, 220, 110);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '12px monospace';
  ctx.fillText('STIRRER TACH (MCM)', 32, 208);

  ctx.fillStyle = '#00d4e8';
  ctx.font = 'bold 36px monospace';
  ctx.fillText(`${Math.round(state.pv_rpm)} RPM`, 32, 262);

  // PDM Pressure Module
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(272, 185, 220, 110);
  ctx.strokeStyle = '#243041';
  ctx.strokeRect(272, 185, 220, 110);

  const isHighP = state.pressure_bar > 180.0;
  ctx.fillStyle = isHighP ? '#ef4444' : '#fbbf24';
  ctx.font = '12px monospace';
  ctx.fillText('TRANSDUCER (PDM)', 284, 208);

  ctx.fillStyle = isHighP ? '#ef4444' : '#f59e0b';
  ctx.font = 'bold 36px monospace';
  ctx.fillText(`${state.pressure_bar.toFixed(1)} BAR`, 284, 262);

  // Bottom Status Bar & SSR Output %
  ctx.fillStyle = '#101722';
  ctx.fillRect(20, 310, 472, 55);
  ctx.strokeStyle = '#243041';
  ctx.strokeRect(20, 310, 472, 55);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px -apple-system, sans-serif';
  ctx.fillText(`SSR HEATER OUTPUT: ${state.heater_power_pct.toFixed(0)}%`, 35, 342);

  // Horizontal Power Bar
  ctx.fillStyle = '#243041';
  ctx.fillRect(235, 328, 240, 18);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(235, 328, (state.heater_power_pct / 100.0) * 240, 18);

  lcdTexture.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Physical Dynamics Simulation Engine
// ---------------------------------------------------------------------------
function updatePhysics(dt) {
  const hasPower = state.is_plugged_in && state.mains_power;

  // 1. Motor Speed Ramp & Impeller Rotation
  if (hasPower && state.stirrer_on) {
    const ramp = 280.0 * dt;
    if (state.pv_rpm < state.sv_rpm) state.pv_rpm = Math.min(state.sv_rpm, state.pv_rpm + ramp);
    else if (state.pv_rpm > state.sv_rpm) state.pv_rpm = Math.max(state.sv_rpm, state.pv_rpm - ramp);
    sfx.updateMotorRpm(state.pv_rpm);
  } else {
    state.pv_rpm = Math.max(0, state.pv_rpm - 420.0 * dt);
    if (state.pv_rpm <= 5.0 && sfx.motorNode) {
      sfx.stopMotorHum();
    }
  }

  // Calculate impeller shaft rotation
  if (state.pv_rpm > 0) {
    const radPerSec = (state.pv_rpm * 2 * Math.PI) / 60.0;
    state.stirrer_angle += radPerSec * dt;
    twin.setStirrerRotation(state.stirrer_angle);

    // Fluid drag torque estimation
    const solventData = SOLVENTS[state.solvent] || SOLVENTS.water;
    state.motor_torque_nm = 0.0015 * Math.pow(state.pv_rpm / 1000.0, 2) * solventData.visc;
  } else {
    state.motor_torque_nm = 0.0;
  }

  // 2. Closed-Loop PID Thermal Regulation
  if (hasPower && state.heater_on && !state.burst_disc_ruptured) {
    const err = state.sv_temp_c - state.pv_temp_c;
    state.integral_err += err * dt;
    state.integral_err = Math.max(-50, Math.min(50, state.integral_err));
    const derivative = (err - state.prev_err) / Math.max(0.001, dt);
    state.prev_err = err;

    const rawOutput = state.kp * err + state.ki * state.integral_err + state.kd * derivative;
    state.heater_power_pct = Math.max(0.0, Math.min(100.0, rawOutput));
  } else {
    state.heater_power_pct = 0.0;
    state.integral_err = 0.0;
  }

  // 3. Thermal Energy Balance & Process Temp (PV)
  const powerInWatts = (state.heater_power_pct / 100.0) * 780.0; // 780 W mantle
  const heatLossWatts = (state.pv_temp_c - state.ambient_temp_c) * 1.85; // Convective loss
  const coolingWatts = state.cooling_active ? 450.0 : 0.0; // Water coil dissipation
  const netPowerWatts = powerInWatts - heatLossWatts - coolingWatts;

  const thermalMass = 1200.0; // J/K
  state.pv_temp_c += (netPowerWatts / thermalMass) * dt;
  state.pv_temp_c = Math.max(state.ambient_temp_c, state.pv_temp_c);

  // Dynamic mantle thermal glow
  twin.updateThermalGlow(state.pv_temp_c, hasPower && (state.heater_power_pct > 0 || state.pv_temp_c > 50));

  // 4. Pressure Dynamics: Gay-Lussac Thermal Expansion + Solvent Vapor Pressure
  if (state.burst_disc_ruptured) {
    state.pressure_bar = Math.max(1.0, state.pressure_bar - 80.0 * dt);
  } else if (state.vent_open) {
    state.pressure_bar = Math.max(1.0, state.pressure_bar - 15.0 * dt);
    state.charge_pressure = state.pressure_bar;
  } else if (state.inlet_open) {
    state.pressure_bar = Math.min(100.0, state.pressure_bar + 20.0 * dt);
    state.charge_pressure = state.pressure_bar;
  } else {
    // Ideal Gas Law P2 = P1 * (T2/T1)
    const tInitK = 273.15 + 22.0;
    const tCurK  = 273.15 + state.pv_temp_c;
    const gasP   = state.charge_pressure * (tCurK / tInitK);

    // Antoine approximation for solvent vapor pressure
    const solventData = SOLVENTS[state.solvent] || SOLVENTS.water;
    let vP = 0.0;
    if (state.pv_temp_c > 40.0) {
      const frac = (state.pv_temp_c - 40.0) / (solventData.bp - 40.0);
      vP = Math.pow(Math.max(0, frac), 2.8) * 2.2;
    }
    state.pressure_bar = gasP + vP;
  }

  // 5. Overpressure Safety Interlock & Burst Disc
  if (state.pressure_bar >= 250.0 && !state.burst_disc_ruptured) {
    state.burst_disc_ruptured = true;
    state.heater_on = false;
    sfx.playRuptureBlast();
    sfx.playAlarm();
  }

  // Update analog Bourdon gauge needle sweep
  twin.setPressureGaugeSweep(state.pressure_bar);

  // 6. Periodic GLP Audit Logging (every 4 seconds)
  const now = performance.now();
  if (now - lastLogTime > 4000) {
    lastLogTime = now;
    recordGLPEntry();
  }
}

// ---------------------------------------------------------------------------
// GLP Batch Run Audit Logging & CSV Export
// ---------------------------------------------------------------------------
function recordGLPEntry() {
  const d = new Date();
  const timeStr = d.toTimeString().split(' ')[0];
  const entry = {
    time: timeStr,
    temp: state.pv_temp_c.toFixed(1),
    pressure: state.pressure_bar.toFixed(1),
    rpm: Math.round(state.pv_rpm),
    power: Math.round(state.heater_power_pct),
  };
  glpLog.push(entry);

  const tbody = document.getElementById('log-tbody');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entry.time}</td>
      <td>${entry.temp}</td>
      <td>${entry.pressure} bar</td>
      <td>${entry.rpm}</td>
      <td>${entry.power}%</td>
    `;
    tbody.appendChild(tr);
    tbody.parentElement.parentElement.scrollTop = tbody.parentElement.parentElement.scrollHeight;
  }
}

function exportGLPLogCSV() {
  if (glpLog.length === 0) {
    recordGLPEntry();
  }
  let csv = 'Timestamp,Process_Temp_C,Vessel_Pressure_Bar,Stirrer_RPM,Heater_SSR_Power_Pct\n';
  glpLog.forEach((row) => {
    csv += `${row.time},${row.temp},${row.pressure},${row.rpm},${row.power}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Parr4560_Reaction_Log_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// UI DOM Synchronization
// ---------------------------------------------------------------------------
function updateUI() {
  const hasPower = state.is_plugged_in && state.mains_power;

  // Topbar Status
  const statusPill = document.getElementById('status-pill');
  const statusDetail = document.getElementById('status-detail');
  if (statusPill && statusDetail) {
    if (!state.is_plugged_in) {
      statusPill.className = 'pill unpowered';
      statusPill.textContent = 'UNPLUGGED';
      statusDetail.textContent = 'Mains power disconnected at bench outlet';
    } else if (!state.mains_power) {
      statusPill.className = 'pill unpowered';
      statusPill.textContent = 'POWER OFF';
      statusDetail.textContent = 'Controller mains switch is OFF';
    } else if (state.burst_disc_ruptured) {
      statusPill.className = 'pill fault';
      statusPill.textContent = 'RUPTURED';
      statusDetail.textContent = 'Rupture disc burst! Vessel vented to atmosphere';
    } else if (state.heater_on || state.stirrer_on) {
      statusPill.className = 'pill run';
      statusPill.textContent = 'RUNNING';
      statusDetail.textContent = state.heater_on && state.stirrer_on
        ? 'Active Heating & Magnetic Agitation'
        : state.heater_on ? 'Heating Mantle Active' : 'Magnetic Agitation Active';
    } else {
      statusPill.className = 'pill ready';
      statusPill.textContent = 'READY';
      statusDetail.textContent = 'Vessel sealed · Standby mode';
    }
  }

  // Buttons
  const btnHeater = document.getElementById('btn-heater');
  if (btnHeater) {
    btnHeater.textContent = `HEATER: ${state.heater_on ? 'ON' : 'OFF'}`;
    btnHeater.className = `btn ${state.heater_on ? 'btn-primary active' : 'btn-primary'}`;
  }

  const btnStirrer = document.getElementById('btn-stirrer');
  if (btnStirrer) {
    btnStirrer.textContent = `STIRRER: ${state.stirrer_on ? 'ON' : 'OFF'}`;
    btnStirrer.className = `btn ${state.stirrer_on ? 'btn-primary active' : 'btn-primary'}`;
  }

  const btnInlet = document.getElementById('btn-inlet');
  if (btnInlet) {
    btnInlet.textContent = `INLET: ${state.inlet_open ? 'OPEN' : 'CLOSED'}`;
    btnInlet.className = `btn ${state.inlet_open ? 'active' : ''}`;
  }

  const btnVent = document.getElementById('btn-vent');
  if (btnVent) {
    btnVent.textContent = `VENT: ${state.vent_open ? 'OPEN' : 'CLOSED'}`;
    btnVent.className = `btn ${state.vent_open ? 'active' : ''}`;
  }

  const btnSample = document.getElementById('btn-sample');
  if (btnSample) {
    btnSample.textContent = `SAMPLE: ${state.sample_open ? 'OPEN' : 'CLOSED'}`;
    btnSample.className = `btn ${state.sample_open ? 'active' : ''}`;
  }

  const btnCooling = document.getElementById('btn-cooling');
  if (btnCooling) {
    btnCooling.textContent = `COOLING: ${state.cooling_active ? 'ON' : 'OFF'}`;
    btnCooling.className = `btn ${state.cooling_active ? 'active' : ''}`;
  }

  // Plug button
  const btnPlug = document.getElementById('btn-toggle-plug');
  const plugPill = document.getElementById('plug-status-pill');
  if (btnPlug && plugPill) {
    btnPlug.textContent = state.is_plugged_in ? 'Disconnect Power Plug' : 'Connect Power Plug';
    btnPlug.className = state.is_plugged_in ? 'btn btn-primary' : 'btn btn-primary active';
    plugPill.textContent = state.is_plugged_in ? 'PLUGGED IN' : 'DISCONNECTED';
    plugPill.className = state.is_plugged_in ? 'pill ready' : 'pill unpowered';
  }

  // Telemetry Readouts
  const telemTemp = document.getElementById('telem-temp');
  if (telemTemp) telemTemp.textContent = `${state.pv_temp_c.toFixed(1)} °C`;

  const telemSvTemp = document.getElementById('telem-sv-temp');
  if (telemSvTemp) telemSvTemp.textContent = `${state.sv_temp_c.toFixed(1)} °C`;

  const telemPressure = document.getElementById('telem-pressure');
  if (telemPressure) {
    telemPressure.textContent = `${state.pressure_bar.toFixed(1)} bar`;
    telemPressure.className = state.pressure_bar > 180 ? 'telem-value alarm' : 'telem-value highlight';
  }

  const telemRpm = document.getElementById('telem-rpm');
  if (telemRpm) telemRpm.textContent = `${Math.round(state.pv_rpm)} RPM`;

  const telemPower = document.getElementById('telem-power');
  if (telemPower) telemPower.textContent = `${Math.round(state.heater_power_pct)}%`;

  const telemTorque = document.getElementById('telem-torque');
  if (telemTorque) telemTorque.textContent = `${state.motor_torque_nm.toFixed(2)} N·m`;

  const telemBurst = document.getElementById('telem-burst');
  if (telemBurst) {
    telemBurst.textContent = state.burst_disc_ruptured ? '250 bar (RUPTURED)' : '250 bar (INTACT)';
    telemBurst.className = state.burst_disc_ruptured ? 'telem-value alarm' : 'telem-value warn';
  }
}

// ---------------------------------------------------------------------------
// Physical Circuit Continuity Controller (DIAG-014)
// ---------------------------------------------------------------------------
function togglePowerPlug() {
  state.is_plugged_in = !state.is_plugged_in;

  if (twin.refs.powerPlug && twin.refs.powerCord) {
    if (state.is_plugged_in) {
      twin.refs.powerPlug.position.set(INSTRUMENT_BENCH.outlet.x, 0.48, INSTRUMENT_BENCH.outlet.z - 0.40 - 0.22);
      sfx.playPlugConnect();
    } else {
      // Disconnect: pull plug forward out of the receptacle onto desk surface
      twin.refs.powerPlug.position.set(INSTRUMENT_BENCH.outlet.x - 0.20, 0.10, INSTRUMENT_BENCH.outlet.z - 0.40 - 0.85);
      sfx.playPlugDisconnect();

      // Immediate power cutoff
      state.heater_on = false;
      state.stirrer_on = false;
      state.heater_power_pct = 0.0;
      sfx.stopContinuousSounds();
    }
  }
  updateUI();
  updateLCD();
}

function toggleMainsPower() {
  state.mains_power = !state.mains_power;
  sfx.playRelayClick(state.mains_power);

  if (!state.mains_power) {
    state.heater_on = false;
    state.stirrer_on = false;
    state.heater_power_pct = 0.0;
    sfx.stopContinuousSounds();
  }
  updateUI();
  updateLCD();
}

// ---------------------------------------------------------------------------
// Part Explorer Implementation
// ---------------------------------------------------------------------------
function initPartExplorer() {
  const partsListContainer = document.getElementById('parts-list');
  const countEl = document.getElementById('parts-count');
  const searchInput = document.getElementById('parts-search');
  const statusEl = document.getElementById('parts-focus-status');
  const clearBtn = document.getElementById('btn-parts-clear');

  if (!partsListContainer) return;

  function renderList(filter = '') {
    partsListContainer.innerHTML = '';
    const filtered = twin.partsList.filter((p) =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.category.toLowerCase().includes(filter.toLowerCase()) ||
      p.description.toLowerCase().includes(filter.toLowerCase())
    );

    if (countEl) countEl.textContent = `${filtered.length} of ${twin.partsList.length} components`;

    filtered.forEach((part) => {
      const item = document.createElement('div');
      item.className = `part-item ${state.focusedPart === part.name ? 'active' : ''}`;
      item.innerHTML = `
        <div class="part-header">
          <span class="part-name">${part.name}</span>
          <span class="part-cat">${part.category}</span>
        </div>
        <div class="part-desc">${part.description}</div>
      `;

      item.addEventListener('click', () => {
        state.focusedPart = part.name;
        document.querySelectorAll('.part-item').forEach((el) => el.classList.remove('active'));
        item.classList.add('active');

        const focusInfo = twin.focusPart(part.name);
        if (focusInfo && statusEl) {
          statusEl.textContent = `Focused: ${part.name}`;
          statusEl.classList.remove('muted');

          // Smoothly pan camera target to focused part
          controls.target.copy(focusInfo.center);
        }
      });

      partsListContainer.appendChild(item);
    });
  }

  renderList();

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderList(e.target.value);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.focusedPart = null;
      twin.clearFocus();
      controls.target.set(...REACTOR_CAMERAS.CAM_ISO.target);
      if (statusEl) {
        statusEl.textContent = 'No part focused';
        statusEl.classList.add('muted');
      }
      document.querySelectorAll('.part-item').forEach((el) => el.classList.remove('active'));
    });
  }
}

// ---------------------------------------------------------------------------
// Camera Presets & Toolbar Controls
// ---------------------------------------------------------------------------
window.setCameraPreset = function(presetKey) {
  const pKey = `CAM_${presetKey.toUpperCase()}`;
  const preset = REACTOR_CAMERAS[pKey] || REACTOR_CAMERAS.CAM_ISO;
  camera.position.set(...preset.pos);
  controls.target.set(...preset.target);
  if (preset.fov && camera.fov !== preset.fov) {
    camera.fov = preset.fov;
    camera.updateProjectionMatrix();
  }
  controls.update();

  document.querySelectorAll('.view-toolbar .view-btn').forEach((b) => b.classList.remove('active'));
  const btn = document.getElementById(`btn-cam-${presetKey.toLowerCase()}`);
  if (btn) btn.classList.add('active');
};

function initToolbarControls() {
  document.getElementById('btn-cam-iso')?.addEventListener('click', () => window.setCameraPreset('iso'));
  document.getElementById('btn-cam-front')?.addEventListener('click', () => window.setCameraPreset('front'));
  document.getElementById('btn-cam-side')?.addEventListener('click', () => window.setCameraPreset('side'));
  document.getElementById('btn-cam-top')?.addEventListener('click', () => window.setCameraPreset('top'));

  document.getElementById('btn-explode')?.addEventListener('click', (e) => {
    state.exploded = !state.exploded;
    e.target.classList.toggle('active', state.exploded);
    twin.setExploded(state.exploded);
    if (state.exploded) {
      window.setCameraPreset('exploded');
    } else {
      window.setCameraPreset('iso');
    }
  });

  document.getElementById('btn-wireframe')?.addEventListener('click', (e) => {
    state.wireframe = !state.wireframe;
    e.target.classList.toggle('active', state.wireframe);
    twin.setWireframe(state.wireframe);
  });

  document.getElementById('btn-auto-rotate')?.addEventListener('click', (e) => {
    state.autoRotate = !state.autoRotate;
    controls.autoRotate = state.autoRotate;
    e.target.classList.toggle('active', state.autoRotate);
  });

  const orbitSlider = document.getElementById('orbit-speed');
  const orbitVal = document.getElementById('orbit-speed-val');
  if (orbitSlider && orbitVal) {
    orbitSlider.addEventListener('input', (e) => {
      state.orbitSpeed = parseFloat(e.target.value);
      controls.autoRotateSpeed = state.orbitSpeed * 2.0;
      orbitVal.textContent = `${state.orbitSpeed.toFixed(1)}×`;
    });
  }

  const zoomSlider = document.getElementById('camera-zoom');
  const zoomVal = document.getElementById('camera-zoom-val');
  if (zoomSlider && zoomVal) {
    zoomSlider.addEventListener('input', (e) => {
      const zPct = parseInt(e.target.value, 10);
      zoomVal.textContent = `${zPct}%`;
      const dist = 8.5 - (zPct / 100.0) * 5.5;
      const dir = camera.position.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target).add(dir.multiplyScalar(dist));
    });
  }

  const lightSlider = document.getElementById('lab-light');
  const lightVal = document.getElementById('lab-light-val');
  if (lightSlider && lightVal) {
    lightSlider.addEventListener('input', (e) => {
      state.labLightIntensity = parseFloat(e.target.value);
      lightVal.textContent = `${state.labLightIntensity.toFixed(1)}×`;
      updateLightingMood(state.labLightMood, state.labLightIntensity);
    });
  }

  const moodSelect = document.getElementById('lab-light-mood');
  if (moodSelect) {
    moodSelect.addEventListener('change', (e) => {
      state.labLightMood = e.target.value;
      updateLightingMood(state.labLightMood, state.labLightIntensity);
    });
  }

  document.getElementById('btn-view-reset')?.addEventListener('click', () => {
    window.setCameraPreset('iso');
  });

  document.getElementById('btn-sfx-mute')?.addEventListener('click', (e) => {
    state.muted = !state.muted;
    sfx.setMuted(state.muted);
    e.target.textContent = state.muted ? 'Unmute SFX' : 'Mute SFX';
    e.target.classList.toggle('active', state.muted);
  });
}

// ---------------------------------------------------------------------------
// Collapsible Panels Event Handlers
// ---------------------------------------------------------------------------
function initPanelCollapse() {
  document.querySelectorAll('.panel-collapse-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panelId = btn.getAttribute('data-collapse');
      const panel = document.querySelector(`.panel-collapsible[data-panel="${panelId}"]`);
      if (panel) {
        panel.classList.toggle('is-collapsed');
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Instrument User Interactions
// ---------------------------------------------------------------------------
function initInstrumentControls() {
  document.getElementById('btn-heater')?.addEventListener('click', () => {
    if (!state.is_plugged_in || !state.mains_power) return;
    state.heater_on = !state.heater_on;
    sfx.playRelayClick(state.heater_on);
    updateUI();
    updateLCD();
  });

  document.getElementById('btn-stirrer')?.addEventListener('click', () => {
    if (!state.is_plugged_in || !state.mains_power) return;
    state.stirrer_on = !state.stirrer_on;
    if (state.stirrer_on) {
      sfx.startMotorHum(state.sv_rpm);
    } else {
      sfx.stopMotorHum();
    }
    updateUI();
    updateLCD();
  });

  document.getElementById('btn-inlet')?.addEventListener('click', () => {
    state.inlet_open = !state.inlet_open;
    if (state.inlet_open) sfx.startGasInletHiss();
    else sfx.stopGasInletHiss();
    updateUI();
  });

  document.getElementById('btn-vent')?.addEventListener('click', () => {
    state.vent_open = !state.vent_open;
    if (state.vent_open) sfx.startVentHiss();
    else sfx.stopVentHiss();
    updateUI();
  });

  document.getElementById('btn-sample')?.addEventListener('click', () => {
    state.sample_open = !state.sample_open;
    sfx.playTouchBeep(1200, 0.05);
    updateUI();
  });

  document.getElementById('btn-cooling')?.addEventListener('click', () => {
    state.cooling_active = !state.cooling_active;
    sfx.playTouchBeep(880, 0.06);
    updateUI();
  });

  const sliderTemp = document.getElementById('slider-temp');
  const valTemp = document.getElementById('val-temp');
  if (sliderTemp && valTemp) {
    sliderTemp.addEventListener('input', (e) => {
      state.sv_temp_c = parseFloat(e.target.value);
      valTemp.textContent = `${state.sv_temp_c.toFixed(0)}°C`;
      updateLCD();
    });
  }

  const sliderRpm = document.getElementById('slider-rpm');
  const valRpm = document.getElementById('val-rpm');
  if (sliderRpm && valRpm) {
    sliderRpm.addEventListener('input', (e) => {
      state.sv_rpm = parseInt(e.target.value, 10);
      valRpm.textContent = `${state.sv_rpm} RPM`;
      if (state.stirrer_on) {
        sfx.updateMotorRpm(state.sv_rpm);
      }
      if (twin.refs.speedKnob) {
        // Rotate potentiometer dial clockwise (DIAG-021)
        const rad = (state.sv_rpm / 1700.0) * (Math.PI * 1.5);
        twin.refs.speedKnob.rotation.z = -rad;
      }
      updateLCD();
    });
  }

  const sliderCharge = document.getElementById('slider-charge');
  const valCharge = document.getElementById('val-charge');
  if (sliderCharge && valCharge) {
    sliderCharge.addEventListener('input', (e) => {
      state.charge_pressure = parseFloat(e.target.value);
      valCharge.textContent = `${state.charge_pressure.toFixed(1)} bar`;
    });
  }

  document.getElementById('btn-charge-gas')?.addEventListener('click', () => {
    state.pressure_bar = state.charge_pressure;
    sfx.startGasInletHiss();
    setTimeout(() => sfx.stopGasInletHiss(), 600);
    updateUI();
  });

  // Power Plug Toggle Button
  document.getElementById('btn-toggle-plug')?.addEventListener('click', () => {
    togglePowerPlug();
  });

  // Export CSV Log Button
  document.getElementById('btn-export-log')?.addEventListener('click', () => {
    exportGLPLogCSV();
  });

  // Demonstrations
  document.getElementById('btn-demo')?.addEventListener('click', () => {
    runHydrogenationDemo();
  });

  document.getElementById('btn-quench')?.addEventListener('click', () => {
    emergencyQuench();
  });

  // Solvent & Gas Selectors
  document.getElementById('select-solvent')?.addEventListener('change', (e) => {
    state.solvent = e.target.value;
  });
  document.getElementById('select-gas')?.addEventListener('change', (e) => {
    state.gas = e.target.value;
  });
  document.getElementById('select-catalyst')?.addEventListener('change', (e) => {
    state.catalyst = e.target.value;
  });
}

// ---------------------------------------------------------------------------
// Automated Demonstration Sequences
// ---------------------------------------------------------------------------
function runHydrogenationDemo() {
  if (state.demoRunning) return;
  state.demoRunning = true;

  if (!state.is_plugged_in) togglePowerPlug();
  if (!state.mains_power) toggleMainsPower();

  state.charge_pressure = 35.0;
  state.pressure_bar = 35.0;
  state.sv_temp_c = 135.0;
  state.sv_rpm = 950;

  const sliderTemp = document.getElementById('slider-temp');
  if (sliderTemp) sliderTemp.value = 135;
  const valTemp = document.getElementById('val-temp');
  if (valTemp) valTemp.textContent = '135°C';

  const sliderRpm = document.getElementById('slider-rpm');
  if (sliderRpm) sliderRpm.value = 950;
  const valRpm = document.getElementById('val-rpm');
  if (valRpm) valRpm.textContent = '950 RPM';

  state.heater_on = true;
  state.stirrer_on = true;
  sfx.playRelayClick(true);
  sfx.startMotorHum(950);

  updateUI();
  updateLCD();

  setTimeout(() => {
    state.demoRunning = false;
  }, 10000);
}

function emergencyQuench() {
  state.heater_on = false;
  state.cooling_active = true;
  state.vent_open = true;
  sfx.startVentHiss();
  sfx.playAlarm();

  setTimeout(() => {
    state.vent_open = false;
    sfx.stopVentHiss();
    state.cooling_active = false;
    updateUI();
  }, 4000);

  updateUI();
  updateLCD();
}

// ---------------------------------------------------------------------------
// 3D Raycasting & Tooltip Interaction
// ---------------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('hud-tooltip');

viewport.addEventListener('mousemove', (e) => {
  const rect = viewport.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const targets = twin.interactiveMeshes.map((i) => i.mesh);
  const hits = raycaster.intersectObjects(targets, true);

  if (hits.length > 0) {
    viewport.style.cursor = 'pointer';
    let hitItem = null;
    for (const item of twin.interactiveMeshes) {
      if (item.mesh === hits[0].object || item.mesh.children.includes(hits[0].object)) {
        hitItem = item;
        break;
      }
    }
    if (hitItem && tooltip) {
      tooltip.style.display = 'block';
      tooltip.textContent = hitItem.hint;
    }
  } else {
    viewport.style.cursor = 'default';
    if (tooltip) tooltip.style.display = 'none';
  }
});

viewport.addEventListener('click', (e) => {
  const rect = viewport.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const targets = twin.interactiveMeshes.map((i) => i.mesh);
  const hits = raycaster.intersectObjects(targets, true);

  if (hits.length > 0) {
    let hitItem = null;
    for (const item of twin.interactiveMeshes) {
      if (item.mesh === hits[0].object || item.mesh.children.includes(hits[0].object)) {
        hitItem = item;
        break;
      }
    }
    if (hitItem) {
      switch (hitItem.id) {
        case 'powerPlug':
          togglePowerPlug();
          break;
        case 'powerRocker':
          toggleMainsPower();
          break;
        case 'heaterRocker':
          if (!state.is_plugged_in || !state.mains_power) return;
          state.heater_on = !state.heater_on;
          sfx.playRelayClick(state.heater_on);
          updateUI();
          updateLCD();
          break;
        case 'speedKnob':
          state.sv_rpm = (state.sv_rpm + 200) % 1800;
          document.getElementById('slider-rpm').value = state.sv_rpm;
          document.getElementById('val-rpm').textContent = `${state.sv_rpm} RPM`;
          if (state.stirrer_on) sfx.updateMotorRpm(state.sv_rpm);
          updateLCD();
          break;
        case 'inlet':
          document.getElementById('btn-inlet')?.click();
          break;
        case 'vent':
          document.getElementById('btn-vent')?.click();
          break;
        case 'sample':
          document.getElementById('btn-sample')?.click();
          break;
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Window Resize Handling
// ---------------------------------------------------------------------------
window.addEventListener('resize', () => {
  const width = viewport.clientWidth;
  const height = viewport.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// ---------------------------------------------------------------------------
// Main Animation & Render Loop
// ---------------------------------------------------------------------------
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dt = Math.min(0.1, (now - lastTime) / 1000.0);
  lastTime = now;

  updatePhysics(dt);
  updateUI();
  updateLCD();

  controls.update();
  renderer.render(scene, camera);
}

// ---------------------------------------------------------------------------
// System Initialization
// ---------------------------------------------------------------------------
initToolbarControls();
initPanelCollapse();
initInstrumentControls();
initPartExplorer();
updateLightingMood('neutral', 1.0);
updateUI();
updateLCD();
recordGLPEntry();
animate();
