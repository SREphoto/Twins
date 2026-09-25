/**
 * Digital Precision Vortex Mixer Twin — Web Application & State Controller
 *
 * Implements interactive 3D WebGL runtime, dynamic offscreen CanvasTexture LCD,
 * raycasting user interactions, real-time Navier-Stokes forced vortex fluid dynamics,
 * procedural Web Audio synthesis, and GLP audit logging.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VortexMixer3D } from './vortex_mixer3d.js';
import { VortexSFX } from './sfx.js';

// --- State Definition ---
const state = {
  power: true,
  mode: 'CONTINUOUS', // Default to CONTINUOUS so high-frequency forced vortex is immediately active on load!
  stateName: 'RUNNING', // 'STANDBY', 'RUNNING', 'PULSE', 'DONE', 'OFF'
  setpointRpm: 2400,
  currentRpm: 2400.0,
  touchPressed: false,

  // Timer configuration
  timerEnabled: false,
  timerDurationSec: 30,
  timerRemainingSec: 30.0,

  // Pulse agitation configuration
  pulseEnabled: false,
  pulsePhase: 'ACTIVE', // 'ACTIVE', 'REST'
  pulseTimer: 0.0,
  pulseActivePeriod: 2.0,
  pulseRestPeriod: 1.0,

  // Sample setup
  currentVessel: 'falcon15',
  currentLiquid: 'water',
  vortexDepthMm: 0.0,

  // Thermal & metrics
  motorTempC: 24.0,
  sessionRunTimeSec: 0.0,
  mixRunCount: 0,

  // Camera presets
  isExploded: false,
  explodeProgress: 0.0,
  isWireframe: false,
  autoRotate: true,
  autoRotateSpeed: 1.0,

  // GLP Run Log
  logs: [],
};

const LIQUIDS = {
  water: { label: 'Deionized Water', viscCp: 1.0, density: 1.0, colorHex: 0x38bdf8 },
  ethanol: { label: 'Absolute Ethanol', viscCp: 1.2, density: 0.789, colorHex: 0x7dd3fc },
  glycerol_50: { label: '50% Glycerol', viscCp: 6.0, density: 1.13, colorHex: 0xfdba74 },
  cell_lysate: { label: 'Cell Lysis Buffer', viscCp: 2.5, density: 1.04, colorHex: 0x86efac },
  blood: { label: 'Whole Blood', viscCp: 4.0, density: 1.06, colorHex: 0x991b1b },
};

// --- Web Audio SFX ---
const sfx = new VortexSFX();

// --- Three.js Scene Setup ---
const container = document.getElementById('viewport3d');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0e14);

const camera = new THREE.PerspectiveCamera(
  36,
  container.clientWidth / container.clientHeight,
  1,
  1000
);
// Default 3/4 Isometric Perspective (CAM_ISO)
camera.position.set(240, 280, 290);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 95, -16); // Center framing on machine body, top deck, and sample tube
controls.maxPolarAngle = Math.PI / 2 - 0.01; // Prevent going below tabletop datum Y = 0
controls.minDistance = 80;
controls.maxDistance = 800;

// Lighting Rig
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
keyLight.position.set(120, 260, 180);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.bias = -0.0001;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffeedd, 1.1);
fillLight.position.set(-140, 150, 120);
scene.add(fillLight);

const rimLight = new THREE.PointLight(0x38bdf8, 25, 400);
rimLight.position.set(0, 180, -180);
scene.add(rimLight);

// Tabletop Bench Surface (Y = 0 mm datum plane)
const benchGeo = new THREE.PlaneGeometry(800, 800);
const benchMat = new THREE.MeshStandardMaterial({
  color: 0x121720,
  roughness: 0.7,
  metalness: 0.1,
});
const benchMesh = new THREE.Mesh(benchGeo, benchMat);
benchMesh.rotation.x = -Math.PI / 2;
benchMesh.position.y = -0.05; // Placed at 0 datum
benchMesh.receiveShadow = true;
scene.add(benchMesh);

// Bench grid guide
const grid = new THREE.GridHelper(600, 30, 0x2a3545, 0x18202c);
grid.position.y = 0.0;
scene.add(grid);

// Instantiate Procedural 3D Vortex Mixer Model
const mixer3d = new VortexMixer3D();
scene.add(mixer3d.root);

// --- High-DPI Dynamic CanvasTexture for UI_LCD ---
const lcdCanvas = document.createElement('canvas');
lcdCanvas.width = 1024;
lcdCanvas.height = 512;
const lcdCtx = lcdCanvas.getContext('2d');

const lcdTexture = new THREE.CanvasTexture(lcdCanvas);
lcdTexture.flipY = false; // DIAG-005: Enforce flipY = false
lcdTexture.minFilter = THREE.LinearFilter;
lcdTexture.magFilter = THREE.LinearFilter;

if (mixer3d.uiLcdMesh) {
  mixer3d.uiLcdMesh.material = new THREE.MeshBasicMaterial({
    map: lcdTexture,
    side: THREE.FrontSide,
  });
}

function renderLCD() {
  const ctx = lcdCtx;
  const w = lcdCanvas.width;
  const h = lcdCanvas.height;

  // Background
  ctx.fillStyle = state.power ? '#060a0f' : '#020406';
  ctx.fillRect(0, 0, w, h);

  if (!state.power) {
    lcdTexture.needsUpdate = true;
    return;
  }

  // Header Bar
  ctx.fillStyle = '#0f1724';
  ctx.fillRect(0, 0, w, 64);
  ctx.fillStyle = '#1e2d42';
  ctx.fillRect(0, 64, w, 3);

  // Brand Name
  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 24px -apple-system, sans-serif';
  ctx.fillText('SRE DESIGNS', 32, 42);

  // Model & Mode Badge
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 20px -apple-system, sans-serif';
  ctx.fillText(`VORTEX-GENIE PRO · [${state.mode}]`, 240, 42);

  // Status Indicator Pill
  const statusColor = state.stateName === 'RUNNING' || state.stateName === 'PULSE'
    ? '#38bdf8'
    : state.stateName === 'DONE'
    ? '#3dd68c'
    : '#f59e0b';

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(w - 220, 14, 188, 36, 18);
  ctx.fill();
  ctx.strokeStyle = statusColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = statusColor;
  ctx.font = '700 18px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(state.stateName, w - 126, 39);
  ctx.textAlign = 'left';

  // 1. Primary Digital Tachometer (Exact RPM)
  const isRunning = state.currentRpm > 30;
  ctx.fillStyle = isRunning ? '#38bdf8' : '#e2e8f0';
  ctx.font = '700 130px "IBM Plex Mono", monospace';
  const rpmStr = Math.round(state.currentRpm).toString().padStart(4, ' ');
  ctx.fillText(rpmStr, 40, 210);

  ctx.fillStyle = '#64748b';
  ctx.font = '600 36px -apple-system, sans-serif';
  ctx.fillText('RPM', 420, 150);

  ctx.font = '400 22px -apple-system, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`SET: ${state.setpointRpm} RPM`, 420, 195);

  // 2. Countdown Timer & Pulse Badge
  ctx.fillStyle = '#141c2b';
  ctx.beginPath();
  ctx.roundRect(640, 95, 340, 140, 12);
  ctx.fill();
  ctx.strokeStyle = '#223249';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 20px -apple-system, sans-serif';
  ctx.fillText('TIMER DURATION', 665, 130);

  ctx.fillStyle = state.timerEnabled ? '#3dd68c' : '#64748b';
  ctx.font = '700 52px "IBM Plex Mono", monospace';
  const timerText = state.timerEnabled
    ? `${Math.ceil(state.timerRemainingSec).toString().padStart(2, '0')}s`
    : 'CONT';
  ctx.fillText(timerText, 665, 190);

  if (state.pulseEnabled) {
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.roundRect(830, 145, 130, 36, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PULSE', 895, 170);
    ctx.textAlign = 'left';
  }

  // 3. Dynamic RPM Speed Bar Gauge (500 to 3200 RPM)
  const barX = 40;
  const barY = 250;
  const barW = 940;
  const barH = 22;

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 6);
  ctx.fill();

  const fillRatio = Math.max(0, (state.currentRpm - 500) / (3200 - 500));
  if (fillRatio > 0) {
    const grad = ctx.createLinearGradient(barX, barY, barX + barW * fillRatio, barY);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * fillRatio, barH, 6);
    ctx.fill();
  }

  // 4. Lower Telemetry Panel (Viscosity, Vortex Depth, Temperature)
  const infoY = 320;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(40, infoY, 940, 2);

  ctx.font = '600 22px -apple-system, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('SAMPLE FLUID:', 40, infoY + 45);
  ctx.fillStyle = '#e2e8f0';
  const liq = LIQUIDS[state.currentLiquid];
  ctx.fillText(`${liq.label} (${liq.viscCp} cP)`, 205, infoY + 45);

  ctx.fillStyle = '#94a3b8';
  ctx.fillText('VORTEX DEPTH:', 40, infoY + 95);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`${state.vortexDepthMm.toFixed(1)} mm`, 205, infoY + 95);

  ctx.fillStyle = '#94a3b8';
  ctx.fillText('MOTOR TEMP:', 580, infoY + 45);
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(`${state.motorTempC.toFixed(1)} °C`, 730, infoY + 45);

  ctx.fillStyle = '#94a3b8';
  ctx.fillText('SESSION TIME:', 580, infoY + 95);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText(`${Math.round(state.sessionRunTimeSec)} s`, 730, infoY + 95);

  // 5. Bottom Diagnostic Status Bar
  ctx.fillStyle = '#0b1320';
  ctx.fillRect(0, h - 44, w, 44);
  ctx.fillStyle = '#64748b';
  ctx.font = '500 18px "IBM Plex Mono", monospace';
  ctx.fillText('ISO 9001 / GLP COMPLIANT · HIGH-FREQUENCY ECCENTRIC DRIVE', 40, h - 16);

  lcdTexture.needsUpdate = true;
}

// Initial render of LCD screen
renderLCD();

// --- Fluid Dynamics & Real-Time Vortex Model ---
function calculateVortexDepth(rpm, liquidKey) {
  if (rpm < 200.0) return 0.0;
  const rpmRatio = rpm / 3200.0;
  const baseH = 36.0 * Math.pow(rpmRatio, 2);
  const mu = LIQUIDS[liquidKey]?.viscCp || 1.0;
  const viscDamping = 1.0 + 0.28 * (mu - 1.0);
  const depth = baseH / Math.max(0.8, viscDamping);
  return Math.min(38.0, depth);
}

// --- GLP Run Logging System ---
function recordGLPLog(durationSec) {
  if (durationSec < 0.5) return;
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const entry = {
    time: timeStr,
    mode: state.mode,
    rpm: Math.round(state.currentRpm || state.setpointRpm),
    duration: `${durationSec.toFixed(1)} s`,
    sample: LIQUIDS[state.currentLiquid].label,
  };
  state.logs.unshift(entry);
  if (state.logs.length > 20) state.logs.pop();

  const tbody = document.getElementById('log-tbody');
  if (tbody) {
    tbody.innerHTML = state.logs
      .map(
        (log) => `
      <tr>
        <td>${log.time}</td>
        <td>${log.mode}</td>
        <td>${log.rpm}</td>
        <td>${log.duration}</td>
        <td>${log.sample}</td>
      </tr>
    `
      )
      .join('');
  }
}

// --- UI Sync & Event Listeners ---
function updateDOMUI() {
  const pill = document.getElementById('status-pill');
  const detail = document.getElementById('status-detail');
  if (pill && detail) {
    if (state.stateName === 'RUNNING' || state.stateName === 'PULSE') {
      pill.className = 'pill run';
      pill.textContent = state.stateName;
      detail.textContent = `Vortex active at ${Math.round(state.currentRpm)} RPM`;
    } else if (state.stateName === 'DONE') {
      pill.className = 'pill ready';
      pill.textContent = 'DONE';
      detail.textContent = 'Countdown cycle complete';
    } else {
      pill.className = 'pill standby';
      pill.textContent = 'STANDBY';
      detail.textContent = 'Ready for touch or continuous run';
    }
  }

  // Mode button text
  const modeBtn = document.getElementById('btn-mode-toggle');
  if (modeBtn) modeBtn.textContent = `MODE: ${state.mode}`;

  // Pulse button text
  const pulseBtn = document.getElementById('btn-pulse-toggle');
  if (pulseBtn) {
    pulseBtn.textContent = `PULSE: ${state.pulseEnabled ? 'ON' : 'OFF'}`;
    pulseBtn.className = `btn ${state.pulseEnabled ? 'btn-pulse' : ''}`;
  }

  // Timer button text
  const timerBtn = document.getElementById('btn-timer-toggle');
  if (timerBtn) {
    timerBtn.textContent = `TIMER: ${state.timerEnabled ? `${state.timerDurationSec}s` : 'CONT'}`;
  }

  // Telemetry cards
  const telemRpm = document.getElementById('telem-rpm');
  const telemDepth = document.getElementById('telem-depth');
  const telemTimer = document.getElementById('telem-timer');
  const telemTemp = document.getElementById('telem-temp');
  const telemRuntime = document.getElementById('telem-runtime');

  if (telemRpm) telemRpm.textContent = `${Math.round(state.currentRpm)} RPM`;
  if (telemDepth) telemDepth.textContent = `${state.vortexDepthMm.toFixed(1)} mm`;
  if (telemTimer) {
    telemTimer.textContent = state.timerEnabled
      ? `${Math.ceil(state.timerRemainingSec)} s`
      : 'CONT';
  }
  if (telemTemp) telemTemp.textContent = `${state.motorTempC.toFixed(1)} °C`;
  if (telemRuntime) telemRuntime.textContent = `${state.sessionRunTimeSec.toFixed(1)} s`;

  // Speed slider values
  const speedText = document.getElementById('speed-display-text');
  if (speedText) speedText.textContent = `${state.setpointRpm} RPM`;

  renderLCD();
}

// 1. Touch-Action (Hold-to-Vortex)
const touchBtn = document.getElementById('btn-touch-action');
let activeRunStartSec = 0;

function startTouchAction() {
  sfx.init();
  state.touchPressed = true;
  mixer3d.setTouchPressed(true);
  sfx.playTubeContact();
  activeRunStartSec = performance.now();
  updateDOMUI();
}

function stopTouchAction() {
  if (state.touchPressed) {
    const elapsedSec = (performance.now() - activeRunStartSec) / 1000.0;
    recordGLPLog(elapsedSec);
  }
  state.touchPressed = false;
  mixer3d.setTouchPressed(false);
  updateDOMUI();
}

if (touchBtn) {
  touchBtn.addEventListener('mousedown', startTouchAction);
  touchBtn.addEventListener('mouseup', stopTouchAction);
  touchBtn.addEventListener('mouseleave', stopTouchAction);
  touchBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startTouchAction(); });
  touchBtn.addEventListener('touchend', (e) => { e.preventDefault(); stopTouchAction(); });
}

// 2. Mode Toggle
const modeBtn = document.getElementById('btn-mode-toggle');
if (modeBtn) {
  modeBtn.addEventListener('click', () => {
    sfx.init();
    sfx.playToggleClick();
    if (state.mode === 'TOUCH') state.mode = 'OFF';
    else if (state.mode === 'OFF') state.mode = 'CONTINUOUS';
    else state.mode = 'TOUCH';

    mixer3d.setModeSwitchState(state.mode);
    if (state.mode === 'CONTINUOUS') {
      activeRunStartSec = performance.now();
    } else if (activeRunStartSec > 0) {
      const elapsedSec = (performance.now() - activeRunStartSec) / 1000.0;
      recordGLPLog(elapsedSec);
      activeRunStartSec = 0;
    }
    updateDOMUI();
  });
}

// 3. Pulse Toggle
const pulseBtn = document.getElementById('btn-pulse-toggle');
if (pulseBtn) {
  pulseBtn.addEventListener('click', () => {
    sfx.init();
    sfx.playButtonBeep();
    state.pulseEnabled = !state.pulseEnabled;
    state.pulseTimer = 0.0;
    state.pulsePhase = 'ACTIVE';
    updateDOMUI();
  });
}

// 4. Timer Toggle
const timerBtn = document.getElementById('btn-timer-toggle');
if (timerBtn) {
  timerBtn.addEventListener('click', () => {
    sfx.init();
    sfx.playButtonBeep();
    state.timerEnabled = !state.timerEnabled;
    if (state.timerEnabled) {
      state.timerRemainingSec = state.timerDurationSec;
    }
    updateDOMUI();
  });
}

// 5. Speed Slider & Input
const sliderRpm = document.getElementById('slider-rpm');
const inputRpm = document.getElementById('input-rpm');

function onRpmChange(val) {
  state.setpointRpm = Math.max(500, Math.min(3200, parseInt(val, 10)));
  if (sliderRpm) sliderRpm.value = state.setpointRpm;
  if (inputRpm) inputRpm.value = state.setpointRpm;

  // Normalized 0 to 1 for dial rotation
  const norm = (state.setpointRpm - 500) / (3200 - 500);
  mixer3d.setSpeedKnobAngle(norm);
  sfx.playDialTick();
  updateDOMUI();
}

if (sliderRpm) sliderRpm.addEventListener('input', (e) => onRpmChange(e.target.value));
if (inputRpm) inputRpm.addEventListener('change', (e) => onRpmChange(e.target.value));

// 6. Vessel & Liquid Selectors
const selectVessel = document.getElementById('select-vessel');
if (selectVessel) {
  selectVessel.addEventListener('change', (e) => {
    state.currentVessel = e.target.value;
    mixer3d.setTubeType(state.currentVessel);
  });
}

const selectLiquid = document.getElementById('select-liquid');
if (selectLiquid) {
  selectLiquid.addEventListener('change', (e) => {
    state.currentLiquid = e.target.value;
    mixer3d.setLiquid(state.currentLiquid);
    updateDOMUI();
  });
}

// 7. Timer Duration Input
const inputTimerSec = document.getElementById('input-timer-sec');
if (inputTimerSec) {
  inputTimerSec.addEventListener('change', (e) => {
    state.timerDurationSec = Math.max(1, parseInt(e.target.value, 10) || 30);
    state.timerRemainingSec = state.timerDurationSec;
    updateDOMUI();
  });
}

// 8. GLP Export CSV
const exportBtn = document.getElementById('btn-export-log');
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    if (state.logs.length === 0) {
      alert('No GLP agitation entries recorded yet.');
      return;
    }
    let csv = 'Timestamp,Mode,Speed (RPM),Duration,Sample Liquid\n';
    state.logs.forEach((l) => {
      csv += `"${l.time}","${l.mode}",${l.rpm},"${l.duration}","${l.sample}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vortex_GLP_Log_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// --- Raycaster Interactions ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('hud-tooltip');

function onPointerMove(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(mixer3d.interactiveMeshes, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const data = hit.userData || {};
    renderer.domElement.style.cursor = 'pointer';
    if (tooltip && data.hint) {
      tooltip.style.display = 'block';
      tooltip.style.left = `${e.clientX + 14}px`;
      tooltip.style.top = `${e.clientY + 14}px`;
      tooltip.textContent = data.hint;
    }
  } else {
    renderer.domElement.style.cursor = 'default';
    if (tooltip) tooltip.style.display = 'none';
  }
}

function onPointerDown(e) {
  sfx.init();
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(mixer3d.interactiveMeshes, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const data = hit.userData || {};

    if (data.type === 'switch') {
      // Toggle mode
      if (state.mode === 'TOUCH') state.mode = 'OFF';
      else if (state.mode === 'OFF') state.mode = 'CONTINUOUS';
      else state.mode = 'TOUCH';
      mixer3d.setModeSwitchState(state.mode);
      sfx.playToggleClick();
      updateDOMUI();
    } else if (data.type === 'knob') {
      // Step RPM
      let newRpm = state.setpointRpm + 200;
      if (newRpm > 3200) newRpm = 500;
      onRpmChange(newRpm);
    } else if (data.type === 'cup' || data.type === 'tube') {
      // Press & hold cup head or tube
      startTouchAction();
      const onUp = () => {
        stopTouchAction();
        window.removeEventListener('pointerup', onUp);
      };
      window.addEventListener('pointerup', onUp);
    } else if (data.name === 'Btn_Timer') {
      state.timerEnabled = !state.timerEnabled;
      sfx.playButtonBeep();
      updateDOMUI();
    } else if (data.name === 'Btn_Pulse') {
      state.pulseEnabled = !state.pulseEnabled;
      sfx.playButtonBeep();
      updateDOMUI();
    } else if (data.name === 'Btn_Power') {
      state.power = !state.power;
      sfx.playButtonBeep();
      updateDOMUI();
    }
  }
}

renderer.domElement.addEventListener('pointermove', onPointerMove);
renderer.domElement.addEventListener('pointerdown', onPointerDown);

// --- Viewport Camera Presets & Exploded View ---
function setCameraView(preset) {
  controls.autoRotate = false;
  const btnRotate = document.getElementById('btn-auto-rotate');
  if (btnRotate) btnRotate.classList.remove('active');

  document.querySelectorAll('.view-btn').forEach((b) => b.classList.remove('active'));

  if (preset === 'iso') {
    camera.position.set(240, 280, 290);
    controls.target.set(0, 95, -16);
    document.getElementById('btn-cam-iso')?.classList.add('active');
  } else if (preset === 'front') {
    camera.position.set(0, 115, 410);
    controls.target.set(0, 95, -16);
    document.getElementById('btn-cam-front')?.classList.add('active');
  } else if (preset === 'side') {
    camera.position.set(410, 115, -16);
    controls.target.set(0, 95, -16);
    document.getElementById('btn-cam-side')?.classList.add('active');
  } else if (preset === 'top') {
    camera.position.set(0, 420, -16.01);
    controls.target.set(0, 95, -16);
    document.getElementById('btn-cam-top')?.classList.add('active');
  }
}

// Expose on window for automated CDP Visual QA harness
window.setCameraPreset = setCameraView;
window.state = state;
window.mixer3d = mixer3d;

document.getElementById('btn-cam-iso')?.addEventListener('click', () => setCameraView('iso'));
document.getElementById('btn-cam-front')?.addEventListener('click', () => setCameraView('front'));
document.getElementById('btn-cam-side')?.addEventListener('click', () => setCameraView('side'));
document.getElementById('btn-cam-top')?.addEventListener('click', () => setCameraView('top'));

// Exploded View
const explodeBtn = document.getElementById('btn-explode');
if (explodeBtn) {
  explodeBtn.addEventListener('click', () => {
    state.isExploded = !state.isExploded;
    explodeBtn.classList.toggle('active', state.isExploded);
  });
}

// Wireframe Toggle
const wireframeBtn = document.getElementById('btn-wireframe');
if (wireframeBtn) {
  wireframeBtn.addEventListener('click', () => {
    state.isWireframe = !state.isWireframe;
    wireframeBtn.classList.toggle('active', state.isWireframe);
    scene.traverse((o) => {
      if (o.isMesh && o.material && o.material !== benchMat) {
        o.material.wireframe = state.isWireframe;
      }
    });
  });
}

// Auto-Rotate Toggle & Speed
const rotateBtn = document.getElementById('btn-auto-rotate');
if (rotateBtn) {
  rotateBtn.addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    rotateBtn.classList.toggle('active', controls.autoRotate);
  });
}

const orbitSpeedSlider = document.getElementById('orbit-speed');
if (orbitSpeedSlider) {
  orbitSpeedSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    controls.autoRotateSpeed = val * 0.8;
    const lbl = document.getElementById('orbit-speed-val');
    if (lbl) lbl.textContent = `${val.toFixed(1)}×`;
  });
}

// Camera Zoom
const zoomSlider = document.getElementById('camera-zoom');
if (zoomSlider) {
  zoomSlider.addEventListener('input', (e) => {
    const pct = parseInt(e.target.value, 10);
    const dist = THREE.MathUtils.lerp(380, 100, pct / 100.0);
    const dir = camera.position.clone().sub(controls.target).normalize();
    camera.position.copy(controls.target).addScaledVector(dir, dist);
    const lbl = document.getElementById('camera-zoom-val');
    if (lbl) lbl.textContent = `${pct}%`;
  });
}

// Lab Light Slider
const lightSlider = document.getElementById('lab-light');
if (lightSlider) {
  lightSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    ambientLight.intensity = 0.7 * val;
    keyLight.intensity = 2.2 * val;
    fillLight.intensity = 1.1 * val;
    const lbl = document.getElementById('lab-light-val');
    if (lbl) lbl.textContent = `${val.toFixed(1)}×`;
  });
}

// Mute SFX
const muteBtn = document.getElementById('btn-sfx-mute');
if (muteBtn) {
  muteBtn.addEventListener('click', () => {
    sfx.setMuted(!sfx.muted);
    muteBtn.textContent = sfx.muted ? 'Unmute SFX' : 'Mute SFX';
    muteBtn.classList.toggle('active', sfx.muted);
  });
}

// Collapsible Panels
document.querySelectorAll('.panel-collapse-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const panel = btn.closest('.instrument');
    if (panel) {
      panel.classList.toggle('collapsed');
      btn.textContent = panel.classList.contains('collapsed') ? '◂' : '▾';
    }
  });
});

// Window Resize
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// --- Main Simulation & Animation Loop ---
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dt = Math.min(0.1, (now - lastTime) / 1000.0);
  lastTime = now;
  const timeSec = now / 1000.0;

  // 1. Determine Target RPM
  let targetRpm = 0.0;
  if (!state.power || state.mode === 'OFF') {
    targetRpm = 0.0;
    state.stateName = state.power ? 'STANDBY' : 'OFF';
  } else {
    // Pulse Cycle Logic
    let isPulseActive = true;
    if (state.pulseEnabled) {
      state.pulseTimer += dt;
      if (state.pulsePhase === 'ACTIVE') {
        if (state.pulseTimer >= state.pulseActivePeriod) {
          state.pulsePhase = 'REST';
          state.pulseTimer = 0.0;
        }
      } else {
        isPulseActive = false;
        if (state.pulseTimer >= state.pulseRestPeriod) {
          state.pulsePhase = 'ACTIVE';
          state.pulseTimer = 0.0;
        }
      }
    }

    // Operating Mode Logic
    if (state.mode === 'CONTINUOUS') {
      if (state.timerEnabled && state.timerRemainingSec <= 0.001) {
        targetRpm = 0.0;
        state.stateName = 'DONE';
      } else {
        targetRpm = isPulseActive ? state.setpointRpm : 0.0;
        state.stateName = state.pulseEnabled ? 'PULSE' : 'RUNNING';
      }
    } else if (state.mode === 'TOUCH') {
      if (state.touchPressed) {
        if (state.timerEnabled && state.timerRemainingSec <= 0.001) {
          targetRpm = 0.0;
          state.stateName = 'DONE';
        } else {
          targetRpm = isPulseActive ? state.setpointRpm : 0.0;
          state.stateName = state.pulseEnabled ? 'PULSE' : 'RUNNING';
        }
      } else {
        targetRpm = 0.0;
        state.stateName = 'STANDBY';
      }
    }
  }

  // 2. Exponential Motor Speed Ramping: dω/dt = (ω_target - ω) / tau
  const tau = 0.12;
  const alpha = 1.0 - Math.exp(-dt / tau);
  state.currentRpm += (targetRpm - state.currentRpm) * alpha;
  if (Math.abs(state.currentRpm) < 1.0) state.currentRpm = 0.0;

  // 3. Timer Countdown & Telemetry Updates
  if (state.currentRpm > 30.0) {
    state.sessionRunTimeSec += dt;
    state.motorTempC += 0.015 * Math.pow(state.currentRpm / 3200.0, 2) * dt;

    if (state.timerEnabled && state.timerRemainingSec > 0.0) {
      state.timerRemainingSec = Math.max(0.0, state.timerRemainingSec - dt);
    }
  } else {
    state.motorTempC = Math.max(24.0, state.motorTempC - 0.005 * dt);
  }

  // 4. Vortex Depth Calculation
  state.vortexDepthMm = calculateVortexDepth(state.currentRpm, state.currentLiquid);

  // 5. Update Procedural 3D Kinematics & Liquid Meniscus
  mixer3d.updateKinematics(timeSec, state.currentRpm, dt, state.vortexDepthMm);

  // 6. Update Audio Synthesizer
  const hasTube = state.currentVessel !== 'none';
  sfx.updateMotorSound(state.currentRpm, hasTube);

  // 7. Update Status LED Color
  if (!state.power) {
    mixer3d.setLEDState(0x000000, 0.0);
  } else if (state.currentRpm > 50) {
    mixer3d.setLEDState(0x22c55e, 1.2); // Bright green active mixing
  } else {
    mixer3d.setLEDState(0xf59e0b, 0.8); // Amber standby
  }

  // 8. Handle Exploded View Transition
  const targetExplode = state.isExploded ? 1.0 : 0.0;
  state.explodeProgress += (targetExplode - state.explodeProgress) * 0.1;
  mixer3d.setExploded(state.explodeProgress);

  // 9. Update Controls & Render Scene
  controls.update();
  renderer.render(scene, camera);
}

// Synchronize 3D mixer controls to initial continuous running state
mixer3d.setModeSwitchState('CONTINUOUS');
mixer3d.setSpeedKnobAngle((state.setpointRpm - 200) / 3000.0);
mixer3d.setLEDState(0x22c55e, 1.2);
updateDOMUI();

// Start simulation loop
animate();

// Periodic LCD redraw (10 FPS for high-performance telemetry display)
setInterval(() => {
  renderLCD();
  updateDOMUI();
}, 100);
