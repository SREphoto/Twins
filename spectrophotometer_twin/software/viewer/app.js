/**
 * UV-Vis Spectrophotometer Web Application Controller (Three.js Web Runtime)
 * High-Fidelity Interactive Digital Twin for Shimadzu UV-1900i
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  createSpectrophotometerModel,
  wavelengthToRGB,
} from './spectrophotometer3d.js';
import { sfx } from './sfx.js';

// --- State Engine ---
const state = {
  power: true,
  stateName: 'READY', // 'READY', 'SCANNING', 'ZEROING', 'FAULT_LID_OPEN'
  mode: 'SPECTRUM',   // 'SPECTRUM', 'PHOTOMETRIC'
  currentWl: 525.0,
  scanStartWl: 400.0,
  scanEndWl: 700.0,
  scanSpeedNmMin: 1200.0,
  scanCurrentWl: 400.0,
  scanData: [],       // Array of { wl, abs }
  activeCell: 2,      // 1 to 6 (Cell 2 = KMnO4 default)
  chamberOpen: false,
  targetLidAngle: 0.0,
  currentLidAngle: 0.0,
  targetCarouselAngle: -(1 * Math.PI) / 3, // Cell 2
  currentCarouselAngle: -(1 * Math.PI) / 3,
  globalZeroOffset: 0.0,
  currentAbs: 1.2500,
  currentTrans: 5.62,
  exploded: false,
  wireframe: false,
  autoRotate: false,
  orbitSpeed: 1.0,
  isOpticsView: false,
  touchRipples: [],   // Active capacitive touch ripples on LCD
  keycapAnims: [],    // Active physical button depressions
};

// Chemical sample Gaussian peak profiles
const SAMPLES = {
  1: { name: 'Deionized Water Blank', bands: [], offset: 0.000 },
  2: { name: 'KMnO4 (Potassium Permanganate)', bands: [[508, 0.62, 22], [525, 1.25, 26], [546, 0.95, 24]], offset: 0.002 },
  3: { name: 'Calf Thymus DNA (TE Buffer)', bands: [[260, 1.15, 34], [280, 0.62, 40]], offset: 0.003 },
  4: { name: 'BSA Protein (Bradford Assay)', bands: [[595, 1.42, 55]], offset: 0.002 },
  5: { name: 'Methylene Blue Dye', bands: [[612, 0.45, 30], [664, 1.68, 38]], offset: 0.002 },
  6: { name: 'Empty Chamber Slot', bands: [], offset: 0.001 },
};

function calculateAbsorbance(cellNum, wl) {
  const smp = SAMPLES[cellNum] || SAMPLES[1];
  let val = smp.offset;
  for (const [center, peak, fwhm] of smp.bands) {
    const sigma = fwhm / 2.35482;
    val += peak * Math.exp(-0.5 * Math.pow((wl - center) / sigma, 2));
  }
  const corrected = Math.max(0.0, val - state.globalZeroOffset);
  return corrected;
}

// --- Dynamic Canvas Texture LCD (Capacitive Interactive Touchscreen) ---
const lcdCanvas = document.createElement('canvas');
lcdCanvas.width = 1024;
lcdCanvas.height = 640;
const lcdCtx = lcdCanvas.getContext('2d');

const lcdTexture = new THREE.CanvasTexture(lcdCanvas);
lcdTexture.flipY = false;
lcdTexture.minFilter = THREE.LinearFilter;
lcdTexture.magFilter = THREE.LinearFilter;

function renderLCD() {
  const ctx = lcdCtx;
  const w = lcdCanvas.width;
  const h = lcdCanvas.height;

  // Background
  ctx.fillStyle = state.power ? '#080d14' : '#040608';
  ctx.fillRect(0, 0, w, h);

  if (!state.power) {
    lcdTexture.needsUpdate = true;
    return;
  }

  // 1. Top Header Status Bar
  ctx.fillStyle = '#0f1724';
  ctx.fillRect(0, 0, w, 56);
  ctx.fillStyle = '#1e2d42';
  ctx.fillRect(0, 56, w, 2);

  // Brand Header
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", monospace';
  ctx.fillStyle = '#00d4e8';
  ctx.fillText('SHIMADZU UV-1900i', 24, 37);

  // Interactive Mode Tab (Header Button)
  const modeTabX = 290;
  const modeTabY = 10;
  const modeTabW = 190;
  const modeTabH = 36;
  ctx.fillStyle = state.mode === 'SPECTRUM' ? '#1e3a5f' : '#162235';
  ctx.beginPath();
  ctx.roundRect(modeTabX, modeTabY, modeTabW, modeTabH, 6);
  ctx.fill();
  ctx.strokeStyle = state.mode === 'SPECTRUM' ? '#38bdf8' : '#334155';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = '700 15px -apple-system, sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.fillText(`MODE: ${state.mode}`, modeTabX + modeTabW / 2, modeTabY + 23);
  ctx.textAlign = 'left';

  // Lamp status
  const isUV = state.currentWl < 340;
  ctx.font = '600 16px -apple-system, sans-serif';
  ctx.fillStyle = isUV ? '#c084fc' : '#fbbf24';
  ctx.fillText(isUV ? 'LAMP: D2 [UV 190-340]' : 'LAMP: WI [Vis 340-1100]', 520, 36);

  // System status pill
  let statusColor = '#3dd68c';
  let statusBg = 'rgba(61, 214, 140, 0.15)';
  if (state.stateName === 'FAULT_LID_OPEN') {
    statusColor = '#f04460';
    statusBg = 'rgba(240, 68, 96, 0.2)';
  } else if (state.stateName === 'SCANNING') {
    statusColor = '#a855f7';
    statusBg = 'rgba(168, 85, 247, 0.2)';
  } else if (state.stateName === 'ZEROING') {
    statusColor = '#f0b429';
    statusBg = 'rgba(240, 180, 41, 0.2)';
  }

  const statPillX = 770;
  ctx.fillStyle = statusBg;
  ctx.beginPath();
  ctx.roundRect(statPillX, 10, 230, 36, 18);
  ctx.fill();
  ctx.strokeStyle = statusColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = statusColor;
  ctx.font = '700 15px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`STATUS: ${state.stateName}`, statPillX + 115, 33);
  ctx.textAlign = 'left';

  // 2. Right-Hand Capacitive Softkey Column (Touch targets on screen)
  const softkeyX = 845;
  const softkeyW = 160;
  const softkeys = [
    { label: 'AUTO ZERO', sub: 'Baseline Blank', y: 72, bg: '#1e3a8a', border: '#3b82f6', action: 'zero' },
    { label: 'START SCAN', sub: 'Acquire Spectrum', y: 148, bg: '#581c87', border: '#a855f7', action: 'scan' },
    { label: 'CYCLE MODE', sub: 'Spec / Photo', y: 224, bg: '#1e293b', border: '#06b6d4', action: 'mode' },
    { label: 'CHAMBER LID', sub: state.chamberOpen ? 'Close Lid' : 'Open Lid', y: 300, bg: '#1e293b', border: '#64748b', action: 'lid' },
    { label: 'OPTICS RAY', sub: state.isOpticsView ? 'Active View' : 'Inspect Ray', y: 376, bg: state.isOpticsView ? '#0d9488' : '#134e4a', border: '#14b8a6', action: 'optics' },
    { label: 'EXPORT GLP', sub: 'Save Audit Log', y: 452, bg: '#334155', border: '#94a3b8', action: 'glp' },
  ];

  softkeys.forEach((sk) => {
    ctx.fillStyle = sk.bg;
    ctx.beginPath();
    ctx.roundRect(softkeyX, sk.y, softkeyW, 64, 8);
    ctx.fill();
    ctx.strokeStyle = sk.border;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.fillText(sk.label, softkeyX + softkeyW / 2, sk.y + 28);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 12px monospace';
    ctx.fillText(sk.sub, softkeyX + softkeyW / 2, sk.y + 48);
  });
  ctx.textAlign = 'left';

  // 3. Main Center Telemetry & Graph Area (X = 30 to 825)
  if (state.stateName === 'FAULT_LID_OPEN') {
    // Interlock warning screen
    ctx.fillStyle = '#f04460';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SAFETY INTERLOCK TRIGGERED', 420, 240);

    ctx.font = '22px -apple-system, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Sample chamber lid is currently OPEN.', 420, 300);
    ctx.fillText('Optical beam shuttered to protect photodiode detector from ambient light saturation.', 420, 340);

    ctx.font = '600 17px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Tap "CHAMBER LID" softkey or click physical lid handle to close.', 420, 410);
    ctx.textAlign = 'left';
  } else if (state.mode === 'SPECTRUM') {
    // Spectrum scan screen with Cartesian axes and curve
    const plotX = 75;
    const plotY = 75;
    const plotW = 745;
    const plotH = 440;

    // Grid box
    ctx.fillStyle = '#0a101a';
    ctx.fillRect(plotX, plotY, plotW, plotH);
    ctx.strokeStyle = '#1e2b3e';
    ctx.lineWidth = 1;
    ctx.strokeRect(plotX, plotY, plotW, plotH);

    // Subtle hint for user
    ctx.font = '500 13px -apple-system, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Tap plot area to seek wavelength · Tap cell buttons below to switch sample', plotX + 10, plotY - 8);

    // Horizontal grid lines (Absorbance: 0.0 to 2.0 AU)
    ctx.font = '13px monospace';
    ctx.fillStyle = '#64748b';
    for (let i = 0; i <= 4; i++) {
      const gy = plotY + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(plotX, gy);
      ctx.lineTo(plotX + plotW, gy);
      ctx.stroke();

      const absLabel = (2.0 - i * 0.5).toFixed(2);
      ctx.fillText(absLabel, plotX - 44, gy + 4);
    }
    ctx.fillText('AU', plotX - 40, plotY - 10);

    // Vertical grid lines (Wavelength)
    const startWl = state.scanStartWl;
    const endWl = state.scanEndWl;
    for (let j = 0; j <= 5; j++) {
      const gx = plotX + (plotW / 5) * j;
      ctx.beginPath();
      ctx.moveTo(gx, plotY);
      ctx.lineTo(gx, plotY + plotH);
      ctx.stroke();

      const wlLabel = Math.round(startWl + ((endWl - startWl) / 5) * j);
      ctx.fillText(`${wlLabel}`, gx - 14, plotY + plotH + 20);
    }
    ctx.fillText('nm', plotX + plotW + 8, plotY + plotH + 20);

    // Spectrum curve
    if (state.scanData.length > 1) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      state.scanData.forEach((pt, idx) => {
        const px = plotX + ((pt.wl - startWl) / (endWl - startWl)) * plotW;
        const py = plotY + plotH - (Math.min(2.0, pt.abs) / 2.0) * plotH;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // Active wavelength seek cursor
    const curX = plotX + ((state.currentWl - startWl) / (endWl - startWl)) * plotW;
    if (curX >= plotX && curX <= plotX + plotW) {
      ctx.strokeStyle = '#00d4e8';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(curX, plotY);
      ctx.lineTo(curX, plotY + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Current fixed readout in upper right of plot
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`λ: ${state.currentWl.toFixed(1)} nm`, plotX + plotW - 250, plotY + 35);
    ctx.fillText(`A: ${state.currentAbs.toFixed(4)} AU`, plotX + plotW - 250, plotY + 68);
    ctx.fillStyle = '#3dd68c';
    ctx.fillText(`T: ${state.currentTrans.toFixed(2)} %T`, plotX + plotW - 250, plotY + 101);
  } else {
    // Photometric mode large numeric readouts
    ctx.fillStyle = '#64748b';
    ctx.font = '600 18px -apple-system, sans-serif';
    ctx.fillText('FIXED WAVELENGTH PHOTOMETRIC MEASUREMENT', 80, 115);

    ctx.fillStyle = '#00d4e8';
    ctx.font = 'bold 64px monospace';
    ctx.fillText(`${state.currentWl.toFixed(1)} nm`, 80, 195);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 84px monospace';
    ctx.fillText(`${state.currentAbs.toFixed(4)} AU`, 80, 305);

    ctx.fillStyle = '#3dd68c';
    ctx.font = 'bold 44px monospace';
    ctx.fillText(`${state.currentTrans.toFixed(2)} %T`, 80, 385);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px -apple-system, sans-serif';
    ctx.fillText(`Active Cuvette: Cell ${state.activeCell} - ${SAMPLES[state.activeCell]?.name}`, 80, 465);
  }

  // 4. Footer Carousel Cell Buttons (Touch Targets)
  ctx.fillStyle = '#0b1118';
  ctx.fillRect(0, h - 70, w, 70);
  ctx.fillStyle = '#1e2d42';
  ctx.fillRect(0, h - 70, w, 2);

  const cellBtnW = 152;
  const cellBtnH = 54;
  const cellBtnY = h - 62;

  for (let c = 1; c <= 6; c++) {
    const cbX = 24 + (c - 1) * 164;
    const isAct = c === state.activeCell;

    if (isAct) {
      const grad = ctx.createLinearGradient(cbX, cellBtnY, cbX, cellBtnY + cellBtnH);
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(1, '#0369a1');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(cbX, cellBtnY, cellBtnW, cellBtnH, 8);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`[CELL ${c}]`, cbX + cellBtnW / 2, cellBtnY + 24);

      ctx.fillStyle = '#e0f2fe';
      ctx.font = '600 12px monospace';
      const shortName = SAMPLES[c]?.name.split(' ')[0] || '';
      ctx.fillText(shortName, cbX + cellBtnW / 2, cellBtnY + 44);
    } else {
      ctx.fillStyle = '#141d28';
      ctx.beginPath();
      ctx.roundRect(cbX, cellBtnY, cellBtnW, cellBtnH, 8);
      ctx.fill();
      ctx.strokeStyle = '#223249';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`CELL ${c}`, cbX + cellBtnW / 2, cellBtnY + 24);

      ctx.fillStyle = '#64748b';
      ctx.font = '500 12px monospace';
      const shortName = SAMPLES[c]?.name.split(' ')[0] || '';
      ctx.fillText(shortName, cbX + cellBtnW / 2, cellBtnY + 44);
    }
  }
  ctx.textAlign = 'left';

  // 5. Capacitive Touch Visual Feedback (Ripples)
  const now = performance.now();
  for (let i = state.touchRipples.length - 1; i >= 0; i--) {
    const rip = state.touchRipples[i];
    const age = now - rip.birth;
    if (age > 400) {
      state.touchRipples.splice(i, 1);
    } else {
      const prog = age / 400;
      const radius = 10 + prog * 45;
      const alpha = 1.0 - prog;

      ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  lcdTexture.needsUpdate = true;
}

// --- Three.js Scene Setup ---
const container = document.getElementById('viewport3d');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(5.6, 4.2, -7.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0.0, 1.15, -0.2);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI / 2 + 0.05;
controls.minDistance = 1.5;
controls.maxDistance = 14.0;

window.camera = camera;
window.controls = controls;

// Studio Lighting Setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.6);
dirLight.position.set(4.5, 12.0, -6.0);
dirLight.target.position.set(0.0, 1.1, -0.2);
scene.add(dirLight.target);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 25;
dirLight.shadow.bias = -0.0005;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0x90b0e0, 0.55);
fillLight.position.set(-6, 8, 6);
scene.add(fillLight);

// Build 3D Spectrophotometer Model
const { root: machineRoot, interactiveObjects, animTargets, setOpticsView } = createSpectrophotometerModel({ includeLab: true });
scene.add(machineRoot);

// Bind dynamic LCD canvas to UI_LCD mesh
if (animTargets.lcdMesh) {
  animTargets.lcdMesh.material = new THREE.MeshBasicMaterial({
    map: lcdTexture,
    side: THREE.FrontSide,
  });
}

// Initial measurement update
function performMeasurement() {
  if (state.chamberOpen) {
    state.stateName = 'FAULT_LID_OPEN';
  } else {
    state.currentAbs = calculateAbsorbance(state.activeCell, state.currentWl);
    state.currentTrans = 100.0 * Math.pow(10, -state.currentAbs);
    if (state.stateName === 'FAULT_LID_OPEN') state.stateName = 'READY';
  }

  // Update DOM UI readouts
  const absEl = document.getElementById('val-abs');
  const transEl = document.getElementById('val-trans');
  const lampEl = document.getElementById('val-lamp');
  const cellEl = document.getElementById('val-cell');

  if (absEl) absEl.textContent = `${state.currentAbs.toFixed(4)} AU`;
  if (transEl) transEl.textContent = `${state.currentTrans.toFixed(2)} %`;
  if (cellEl) cellEl.textContent = `Position ${state.activeCell} (${SAMPLES[state.activeCell]?.name.split(' ')[0]})`;

  if (lampEl) {
    if (state.currentWl < 340) {
      lampEl.textContent = 'Deuterium Arc (UV, 190–340 nm)';
      lampEl.style.color = '#c084fc';
    } else {
      lampEl.textContent = 'Tungsten-Halogen (Vis, 340–1100 nm)';
      lampEl.style.color = '#fbbf24';
    }
  }

  // Update Status Pill
  const statusPill = document.getElementById('status-pill');
  const statusDetail = document.getElementById('status-detail');
  if (statusPill && statusDetail) {
    statusPill.className = `pill ${state.stateName === 'READY' ? 'run' : state.stateName === 'SCANNING' ? 'scan' : state.stateName === 'FAULT_LID_OPEN' ? 'fault' : 'open'}`;
    statusPill.textContent = state.stateName;
    statusDetail.textContent = state.stateName === 'READY' ? 'Ready for photometric scan' : state.stateName === 'SCANNING' ? 'Acquiring spectrum...' : state.stateName === 'FAULT_LID_OPEN' ? 'Chamber lid open - interlock engaged' : 'Zeroing baseline...';
  }

  // Probe Beam Emissive Color Update
  if (animTargets.probeBeamMat) {
    if (state.chamberOpen || !state.power) {
      animTargets.probeBeamMat.opacity = 0.0;
    } else {
      animTargets.probeBeamMat.opacity = 0.85;
      animTargets.probeBeamMat.color = wavelengthToRGB(state.currentWl);
    }
  }

  renderLCD();
}

function initDefaultSpectrum() {
  state.scanData = [];
  const start = state.scanStartWl;
  const end = state.scanEndWl;
  const step = 2.0;
  for (let wl = start; wl <= end; wl += step) {
    state.scanData.push({
      wl,
      abs: calculateAbsorbance(state.activeCell, wl),
    });
  }
}

function logGLP(message) {
  const logEl = document.getElementById('glp-log');
  if (!logEl) return;
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  logEl.textContent += `[${timeStr}] ${message}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

function triggerKeycapPress(keyId) {
  const cap = animTargets.keycaps[keyId];
  if (cap) {
    state.keycapAnims.push({
      cap,
      startTime: performance.now(),
      baseY: 0.038,
      pressY: 0.018,
      duration: 160,
    });
  }
  sfx.click();
}

function toggleOpticsView(forcedState) {
  state.isOpticsView = typeof forcedState === 'boolean' ? forcedState : !state.isOpticsView;
  if (setOpticsView) setOpticsView(state.isOpticsView);
  const btn = document.getElementById('btn-optics-view');
  if (btn) btn.classList.toggle('active', state.isOpticsView);
  logGLP(`OPTICS: ${state.isOpticsView ? 'Optics inspection view activated. Internal ray path visible.' : 'Optics inspection view deactivated.'}`);
  sfx.click();
  renderLCD();
}

// Controller Handlers
function handleAutoZero() {
  if (state.chamberOpen) {
    sfx.error();
    logGLP('ERROR: Cannot Auto-Zero with chamber lid open!');
    return;
  }
  sfx.beep(900, 0.08);
  state.stateName = 'ZEROING';
  performMeasurement();

  setTimeout(() => {
    state.globalZeroOffset = calculateAbsorbance(state.activeCell, state.currentWl);
    state.stateName = 'READY';
    sfx.chime();
    logGLP(`AUTO-ZERO: Baseline zeroed at λ=${state.currentWl.toFixed(1)} nm on Cell ${state.activeCell}.`);
    performMeasurement();
  }, 600);
}

function handleStartScan() {
  if (state.chamberOpen) {
    sfx.error();
    logGLP('ERROR: Cannot start spectrum scan with chamber lid open!');
    return;
  }
  if (state.stateName === 'SCANNING') return;

  sfx.shutter();
  state.mode = 'SPECTRUM';
  state.stateName = 'SCANNING';
  state.scanCurrentWl = state.scanStartWl;
  state.scanData = [];
  logGLP(`SPECTRUM SCAN: Commencing scan ${state.scanStartWl} → ${state.scanEndWl} nm on Cell ${state.activeCell}.`);
  performMeasurement();
}

function handleAdvanceCell() {
  state.activeCell = (state.activeCell % 6) + 1;
  state.targetCarouselAngle = -((state.activeCell - 1) * Math.PI) / 3;
  sfx.click();
  const selectEl = document.getElementById('select-cell');
  if (selectEl) selectEl.value = state.activeCell.toString();
  const descEl = document.getElementById('sample-desc');
  if (descEl) descEl.textContent = SAMPLES[state.activeCell]?.name;

  logGLP(`CAROUSEL: Rotated to Cell ${state.activeCell} (${SAMPLES[state.activeCell]?.name}).`);
  performMeasurement();
}

function handleToggleDoor() {
  state.chamberOpen = !state.chamberOpen;
  state.targetLidAngle = state.chamberOpen ? 1.35 : 0.0;
  sfx.lid();

  const doorBtn = document.getElementById('btn-door-toggle');
  if (doorBtn) doorBtn.textContent = state.chamberOpen ? 'Close Chamber' : 'Open Chamber';

  if (state.chamberOpen) {
    state.stateName = 'FAULT_LID_OPEN';
    logGLP('INTERLOCK: Chamber lid opened. Beam shuttered.');
  } else {
    state.stateName = 'READY';
    logGLP('INTERLOCK: Chamber lid closed. Beam restored.');
  }
  performMeasurement();
}

function handleWavelengthChange(newWl) {
  state.currentWl = Math.max(190, Math.min(1100, Math.round(newWl * 10) / 10));
  sfx.stepperStep();

  const slider = document.getElementById('slider-wl');
  const input = document.getElementById('input-wl');
  if (slider) slider.value = Math.round(state.currentWl);
  if (input) input.value = state.currentWl.toFixed(1);

  performMeasurement();
}

// --- Wire DOM Event Listeners ---
document.getElementById('btn-zero')?.addEventListener('click', handleAutoZero);
document.getElementById('btn-scan')?.addEventListener('click', handleStartScan);
document.getElementById('btn-measure')?.addEventListener('click', () => {
  sfx.beep(1200, 0.08);
  performMeasurement();
  logGLP(`FIXED READ: λ=${state.currentWl.toFixed(1)}nm, A=${state.currentAbs.toFixed(4)} AU, T=${state.currentTrans.toFixed(2)}%`);
});
document.getElementById('btn-mode')?.addEventListener('click', () => {
  sfx.click();
  state.mode = state.mode === 'SPECTRUM' ? 'PHOTOMETRIC' : 'SPECTRUM';
  renderLCD();
});
document.getElementById('btn-cell-next')?.addEventListener('click', handleAdvanceCell);
document.getElementById('btn-door-toggle')?.addEventListener('click', handleToggleDoor);
document.getElementById('btn-power')?.addEventListener('click', () => {
  sfx.click();
  state.power = !state.power;
  performMeasurement();
});

document.getElementById('slider-wl')?.addEventListener('input', (e) => {
  handleWavelengthChange(parseFloat(e.target.value));
});
document.getElementById('input-wl')?.addEventListener('change', (e) => {
  handleWavelengthChange(parseFloat(e.target.value));
});

document.getElementById('scan-start')?.addEventListener('change', (e) => {
  state.scanStartWl = parseFloat(e.target.value) || 400;
  initDefaultSpectrum();
  renderLCD();
});
document.getElementById('scan-end')?.addEventListener('change', (e) => {
  state.scanEndWl = parseFloat(e.target.value) || 700;
  initDefaultSpectrum();
  renderLCD();
});

document.getElementById('select-cell')?.addEventListener('change', (e) => {
  state.activeCell = parseInt(e.target.value, 10);
  state.targetCarouselAngle = -((state.activeCell - 1) * Math.PI) / 3;
  sfx.click();
  const descEl = document.getElementById('sample-desc');
  if (descEl) descEl.textContent = SAMPLES[state.activeCell]?.name;
  logGLP(`CAROUSEL: Selected Cell ${state.activeCell} (${SAMPLES[state.activeCell]?.name}).`);
  initDefaultSpectrum();
  performMeasurement();
});

document.getElementById('btn-export-glp')?.addEventListener('click', () => {
  sfx.chime();
  const logContent = document.getElementById('glp-log')?.textContent || '';
  const blob = new Blob([logContent], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `GLP_UV1900i_${Date.now()}.txt`;
  a.click();
});

// Stage Toolbar Controls
document.getElementById('btn-explode')?.addEventListener('click', () => {
  state.exploded = !state.exploded;
  document.getElementById('btn-explode')?.classList.toggle('active', state.exploded);
  sfx.click();
});

document.getElementById('btn-optics-view')?.addEventListener('click', () => {
  toggleOpticsView();
});

document.getElementById('btn-wireframe')?.addEventListener('click', () => {
  state.wireframe = !state.wireframe;
  document.getElementById('btn-wireframe')?.classList.toggle('active', state.wireframe);
  machineRoot.traverse((child) => {
    if (child.isMesh && child.material && child !== animTargets.lcdMesh) {
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => (m.wireframe = state.wireframe));
      } else {
        child.material.wireframe = state.wireframe;
      }
    }
  });
  sfx.click();
});

document.getElementById('btn-auto-rotate')?.addEventListener('click', () => {
  state.autoRotate = !state.autoRotate;
  controls.autoRotate = state.autoRotate;
  document.getElementById('btn-auto-rotate')?.classList.toggle('active', state.autoRotate);
  sfx.click();
});

document.getElementById('orbit-speed')?.addEventListener('input', (e) => {
  state.orbitSpeed = parseFloat(e.target.value);
  controls.autoRotateSpeed = state.orbitSpeed * 2.0;
  const valEl = document.getElementById('orbit-speed-val');
  if (valEl) valEl.textContent = `${state.orbitSpeed.toFixed(1)}×`;
});

document.getElementById('camera-zoom')?.addEventListener('input', (e) => {
  const zPct = parseInt(e.target.value, 10);
  const zoomFactor = 1.0 + (zPct - 45) / 50.0;
  camera.zoom = Math.max(0.4, Math.min(3.0, zoomFactor));
  camera.updateProjectionMatrix();
  const valEl = document.getElementById('camera-zoom-val');
  if (valEl) valEl.textContent = `${zPct}%`;
});

document.getElementById('lab-light')?.addEventListener('input', (e) => {
  const lVal = parseFloat(e.target.value);
  dirLight.intensity = 1.6 * lVal;
  ambientLight.intensity = 0.65 * lVal;
  const valEl = document.getElementById('lab-light-val');
  if (valEl) valEl.textContent = `${lVal.toFixed(1)}×`;
});

document.getElementById('btn-sfx-mute')?.addEventListener('click', () => {
  const isMuted = !sfx.muted;
  sfx.setMuted(isMuted);
  const btn = document.getElementById('btn-sfx-mute');
  if (btn) {
    btn.textContent = isMuted ? 'Unmute SFX' : 'Mute SFX';
    btn.classList.toggle('active', isMuted);
  }
});

// Raycasting Interaction (Screen Touch, Keycaps, Lid, Cuvettes)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('hud-tooltip');

window.addEventListener('mousemove', (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
    if (tooltip) tooltip.style.display = 'none';
    return;
  }

  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects, true);

  if (intersects.length > 0) {
    let obj = intersects[0].object;
    while (obj && !obj.userData.name && obj.parent) {
      obj = obj.parent;
    }
    if (obj && obj.userData.name) {
      container.style.cursor = 'pointer';
      if (tooltip) {
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.clientX + 14}px`;
        tooltip.style.top = `${e.clientY + 14}px`;
        tooltip.textContent = obj.userData.action || obj.userData.name;
      }
      return;
    }
  }
  container.style.cursor = 'default';
  if (tooltip) tooltip.style.display = 'none';
});

window.addEventListener('click', (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;

  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects, true);

  if (intersects.length > 0) {
    let obj = intersects[0].object;
    while (obj && !obj.userData.name && obj.parent) {
      obj = obj.parent;
    }

    if (obj && obj.userData.name) {
      const name = obj.userData.name;

      if (name === 'Btn_Power') {
        triggerKeycapPress('Btn_Power');
        document.getElementById('btn-power')?.click();
      } else if (name === 'Btn_Zero') {
        triggerKeycapPress('Btn_Zero');
        handleAutoZero();
      } else if (name === 'Btn_Scan') {
        triggerKeycapPress('Btn_Scan');
        handleStartScan();
      } else if (name === 'Btn_Mode') {
        triggerKeycapPress('Btn_Mode');
        document.getElementById('btn-mode')?.click();
      } else if (name === 'Btn_CellNext') {
        triggerKeycapPress('Btn_CellNext');
        handleAdvanceCell();
      } else if (name === 'Btn_Lid') {
        handleToggleDoor();
      } else if (obj.userData.cellNumber) {
        state.activeCell = obj.userData.cellNumber;
        state.targetCarouselAngle = -((state.activeCell - 1) * Math.PI) / 3;
        sfx.click();
        const selectEl = document.getElementById('select-cell');
        if (selectEl) selectEl.value = state.activeCell.toString();
        logGLP(`CAROUSEL: Clicked Cell ${state.activeCell} directly.`);
        performMeasurement();
      } else if (name === 'UI_LCD_TOUCH' || obj.name === 'UI_LCD') {
        // Capacitive Touchscreen Digitizer
        const hit = intersects.find(h => h.object.name === 'UI_LCD' || h.object.userData.name === 'UI_LCD_TOUCH') || intersects[0];
        const localPoint = animTargets.lcdMesh.worldToLocal(hit.point.clone());
        const normX = Math.max(0, Math.min(1, (0.82 - localPoint.x) / 1.64));
        const normY = Math.max(0, Math.min(1, (0.47 - localPoint.z) / 0.94));
        const touchX = normX * lcdCanvas.width;
        const touchY = normY * lcdCanvas.height;

        state.touchRipples.push({
          x: touchX,
          y: touchY,
          birth: performance.now(),
        });
        sfx.beep(1600, 0.035);

        if (touchY >= 570) {
          // Footer cell buttons: 6 cells
          const cellIdx = Math.min(6, Math.max(1, Math.floor(normX * 6) + 1));
          state.activeCell = cellIdx;
          state.targetCarouselAngle = -((state.activeCell - 1) * Math.PI) / 3;
          const selectEl = document.getElementById('select-cell');
          if (selectEl) selectEl.value = state.activeCell.toString();
          logGLP(`TOUCHSCREEN: Cell ${state.activeCell} selected via capacitive touch.`);
          performMeasurement();
        } else if (touchX >= 830) {
          // Right softkey column
          if (touchY >= 70 && touchY < 145) {
            handleAutoZero();
          } else if (touchY >= 145 && touchY < 220) {
            handleStartScan();
          } else if (touchY >= 220 && touchY < 295) {
            document.getElementById('btn-mode')?.click();
          } else if (touchY >= 295 && touchY < 370) {
            handleToggleDoor();
          } else if (touchY >= 370 && touchY < 445) {
            toggleOpticsView();
          } else if (touchY >= 445 && touchY < 520) {
            document.getElementById('btn-export-glp')?.click();
          }
        } else if (touchY <= 60) {
          // Header tabs
          if (touchX >= 280 && touchX < 500) {
            document.getElementById('btn-mode')?.click();
          } else if (touchX >= 750) {
            document.getElementById('btn-power')?.click();
          }
        } else if (state.mode === 'SPECTRUM' && touchX >= 75 && touchX <= 820 && touchY >= 75 && touchY <= 520) {
          // Spectrum plot tap-to-seek
          const frac = (touchX - 75) / (820 - 75);
          const targetWl = Math.round((state.scanStartWl + frac * (state.scanEndWl - state.scanStartWl)) * 2) / 2;
          const clampedWl = Math.max(state.scanStartWl, Math.min(state.scanEndWl, targetWl));
          state.currentWl = clampedWl;
          const sliderEl = document.getElementById('slider-wl');
          if (sliderEl) sliderEl.value = clampedWl.toString();
          const inputEl = document.getElementById('input-wl');
          if (inputEl) inputEl.value = clampedWl.toFixed(1);
          logGLP(`TOUCHSCREEN: Tuned monochromator to ${clampedWl.toFixed(1)} nm.`);
          performMeasurement();
        } else {
          document.getElementById('btn-mode')?.click();
        }
      }
    }
  }
});

// --- Standard Camera Presets ---
const CAMERA_PRESETS = {
  iso: {
    pos: new THREE.Vector3(5.6, 4.2, -7.2),
    target: new THREE.Vector3(0.0, 1.15, -0.2),
  },
  front: {
    pos: new THREE.Vector3(0.0, 1.6, -8.2),
    target: new THREE.Vector3(0.0, 1.15, -0.2),
  },
  side: {
    pos: new THREE.Vector3(8.6, 1.8, -0.1),
    target: new THREE.Vector3(0.0, 1.1, -0.1),
  },
  top: {
    pos: new THREE.Vector3(0.0, 11.2, -0.21),
    target: new THREE.Vector3(0.0, 1.0, -0.2),
    up: new THREE.Vector3(0.0, 0.0, 1.0),
  },
  exploded: {
    pos: new THREE.Vector3(6.5, 5.5, -8.5),
    target: new THREE.Vector3(0.0, 1.6, -0.2),
  },
};

function setCameraPreset(presetName) {
  const p = CAMERA_PRESETS[presetName];
  if (!p) return;

  camera.position.copy(p.pos);
  controls.target.copy(p.target);
  if (p.up) {
    camera.up.copy(p.up);
  } else {
    camera.up.set(0, 1, 0);
  }
  controls.update();

  ['iso', 'front', 'side', 'top'].forEach((key) => {
    document.getElementById(`btn-cam-${key}`)?.classList.remove('active');
  });
  document.getElementById(`btn-cam-${presetName}`)?.classList.add('active');
  sfx.click();
}

window.setCameraPreset = setCameraPreset;

['iso', 'front', 'side', 'top'].forEach((key) => {
  document.getElementById(`btn-cam-${key}`)?.addEventListener('click', () => {
    setCameraPreset(key);
  });
});

// Window resize
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// --- Main Render / Animation Loop ---
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dt = Math.min(0.1, (now - lastTime) / 1000.0);
  lastTime = now;

  // 1. Chamber Lid Kinematic Interpolation
  state.currentLidAngle += (state.targetLidAngle - state.currentLidAngle) * Math.min(1.0, dt * 8.0);
  if (animTargets.chamberLidPivot) {
    animTargets.chamberLidPivot.rotation.x = state.currentLidAngle;
  }

  // 2. Carousel Stepper Rotation Interpolation
  state.currentCarouselAngle += (state.targetCarouselAngle - state.currentCarouselAngle) * Math.min(1.0, dt * 6.0);
  if (animTargets.carouselPivot) {
    animTargets.carouselPivot.rotation.y = state.currentCarouselAngle;
  }

  // 3. Spectrum Scan Simulation Tick
  if (state.stateName === 'SCANNING') {
    const stepWl = (state.scanSpeedNmMin / 60.0) * dt;
    state.scanCurrentWl += stepWl;
    state.currentWl = Math.min(state.scanEndWl, Math.round(state.scanCurrentWl * 10) / 10);

    const ptAbs = calculateAbsorbance(state.activeCell, state.currentWl);
    state.scanData.push({ wl: state.currentWl, abs: ptAbs });

    if (Math.random() < 0.25) sfx.stepperStep();

    if (state.scanCurrentWl >= state.scanEndWl) {
      state.stateName = 'READY';
      sfx.beep(880, 0.15);
      logGLP(`SPECTRUM SCAN: Acquisition complete. Data points: ${state.scanData.length}.`);
    }

    performMeasurement();
  }

  // 4. Exploded View Kinematics
  const targetExplodeFactor = state.exploded ? 1.0 : 0.0;
  animTargets.explodedParts.forEach((item) => {
    item.currentFactor = item.currentFactor || 0.0;
    item.currentFactor += (targetExplodeFactor - item.currentFactor) * Math.min(1.0, dt * 6.0);
    item.obj.position.y = item.originY + (item.deltaY * item.currentFactor);
  });

  // 5. Lamp Glow & Oscillations
  if (animTargets.deuteriumLampGlow && animTargets.tungstenLampGlow) {
    if (state.power) {
      if (state.currentWl < 340) {
        animTargets.deuteriumLampGlow.scale.setScalar(1.0 + 0.08 * Math.sin(now * 0.01));
        animTargets.tungstenLampGlow.scale.setScalar(0.4);
      } else {
        animTargets.tungstenLampGlow.scale.setScalar(1.0 + 0.06 * Math.sin(now * 0.008));
        animTargets.deuteriumLampGlow.scale.setScalar(0.4);
      }
    } else {
      animTargets.deuteriumLampGlow.scale.setScalar(0.01);
      animTargets.tungstenLampGlow.scale.setScalar(0.01);
    }
  }

  // 6. Holographic Diffraction Grating Rotation
  if (animTargets.diffractionGrating) {
    const gratingAngle = ((state.currentWl - 190.0) / (1100.0 - 190.0)) * 0.45;
    animTargets.diffractionGrating.rotation.y = gratingAngle;
  }

  // 7. Dual-Beam Chopper Wheel Continuous Rotation
  if (animTargets.chopperWheel) {
    const spinSpeed = state.stateName === 'SCANNING' ? 18.0 : 6.0;
    animTargets.chopperWheel.rotation.z += spinSpeed * dt;
  }

  // 8. Rear Cooling Fan Rotation
  if (animTargets.coolingFanHub && state.power) {
    animTargets.coolingFanHub.rotation.z += 12.0 * dt;
  }

  // 9. Source Selection Mirror Arm Pivot
  if (animTargets.sourceSelectorArm) {
    const targetArmAngle = state.currentWl < 340 ? 0.0 : 0.70;
    animTargets.sourceSelectorArm.rotation.y += (targetArmAngle - animTargets.sourceSelectorArm.rotation.y) * Math.min(1.0, dt * 10.0);
  }

  // 10. Animated 3D Optical Ray Flow & Wavelength Colors
  if (animTargets.opticalRayMats && animTargets.opticalRayMats.length > 0) {
    const beamColor = wavelengthToRGB(state.currentWl);
    animTargets.opticalRayMats.forEach((mat) => {
      mat.color.copy(beamColor);
      mat.opacity = 0.75 + 0.15 * Math.sin(now * 0.008);
    });
  }

  // 11. Tactile Keycap Depression Animation Loop
  for (let i = state.keycapAnims.length - 1; i >= 0; i--) {
    const anim = state.keycapAnims[i];
    const elapsed = now - anim.startTime;
    if (elapsed >= anim.duration) {
      anim.cap.position.y = anim.baseY;
      state.keycapAnims.splice(i, 1);
    } else {
      const prog = elapsed / anim.duration;
      const delta = Math.sin(prog * Math.PI);
      anim.cap.position.y = anim.baseY - (anim.baseY - anim.pressY) * delta;
    }
  }

  // 12. Touchscreen Ripple Updates
  if (state.touchRipples.length > 0) {
    renderLCD();
  }

  controls.update();
  renderer.render(scene, camera);
}

// Initial setup call
initDefaultSpectrum();
performMeasurement();
logGLP('SYSTEM: Shimadzu UV-1900i Twin Initialized. proFACT calibrated.');
animate();
