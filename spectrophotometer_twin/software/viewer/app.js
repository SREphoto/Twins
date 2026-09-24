/**
 * UV-Vis Spectrophotometer Web Application Controller (Three.js Web Runtime)
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
  pressedKey: null,
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

// --- Dynamic Canvas Texture LCD ---
const lcdCanvas = document.createElement('canvas');
lcdCanvas.width = 1024;
lcdCanvas.height = 640;
const lcdCtx = lcdCanvas.getContext('2d');

const lcdTexture = new THREE.CanvasTexture(lcdCanvas);
// Crucial rule: Canvas textures must set flipY = false
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

  // Top header status bar
  ctx.fillStyle = '#0f1724';
  ctx.fillRect(0, 0, w, 56);
  ctx.fillStyle = '#223249';
  ctx.fillRect(0, 56, w, 2);

  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = '#00d4e8';
  ctx.fillText('SHIMADZU UV-1900i', 24, 37);

  // Mode badge
  ctx.font = '600 18px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`MODE: ${state.mode}`, 320, 36);

  // Lamp status
  const isUV = state.currentWl < 340;
  ctx.fillStyle = isUV ? '#c084fc' : '#fbbf24';
  ctx.fillText(isUV ? 'LAMP: D2 [UV]' : 'LAMP: WI [Vis]', 580, 36);

  // System status badge
  let statusColor = '#3dd68c';
  if (state.stateName === 'FAULT_LID_OPEN') statusColor = '#f04460';
  else if (state.stateName === 'SCANNING') statusColor = '#a855f7';
  else if (state.stateName === 'ZEROING') statusColor = '#f0b429';

  ctx.fillStyle = statusColor;
  ctx.fillText(`STATUS: ${state.stateName}`, 780, 36);

  if (state.stateName === 'FAULT_LID_OPEN') {
    // Interlock warning screen
    ctx.fillStyle = '#f04460';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SAFETY INTERLOCK TRIGGERED', w / 2, 260);
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Sample chamber lid is open.', w / 2, 320);
    ctx.fillText('Optical beam shuttered to protect detector from stray light.', w / 2, 360);
    ctx.textAlign = 'left';
  } else if (state.mode === 'SPECTRUM') {
    // Spectrum scan screen with Cartesian axes and curve
    const plotX = 90;
    const plotY = 90;
    const plotW = 840;
    const plotH = 430;

    // Grid box
    ctx.fillStyle = '#0a101a';
    ctx.fillRect(plotX, plotY, plotW, plotH);
    ctx.strokeStyle = '#1e2b3e';
    ctx.lineWidth = 1;
    ctx.strokeRect(plotX, plotY, plotW, plotH);

    // Horizontal grid lines (Absorbance: 0.0 to 2.0 AU)
    ctx.font = '14px monospace';
    ctx.fillStyle = '#64748b';
    for (let i = 0; i <= 4; i++) {
      const gy = plotY + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(plotX, gy);
      ctx.lineTo(plotX + plotW, gy);
      ctx.stroke();

      const absLabel = (2.0 - i * 0.5).toFixed(2);
      ctx.fillText(absLabel, plotX - 52, gy + 5);
    }
    ctx.fillText('AU', plotX - 45, plotY - 10);

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
      ctx.fillText(`${wlLabel} nm`, gx - 22, plotY + plotH + 24);
    }

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

    // Current scan cursor
    if (state.stateName === 'SCANNING') {
      const curX = plotX + ((state.scanCurrentWl - startWl) / (endWl - startWl)) * plotW;
      ctx.strokeStyle = '#00d4e8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(curX, plotY);
      ctx.lineTo(curX, plotY + plotH);
      ctx.stroke();
    }

    // Current fixed readout in upper right of plot
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`λ: ${state.currentWl.toFixed(1)} nm`, plotX + plotW - 240, plotY + 40);
    ctx.fillText(`A: ${state.currentAbs.toFixed(4)} AU`, plotX + plotW - 240, plotY + 75);
  } else {
    // Photometric mode large numeric readouts
    ctx.fillStyle = '#64748b';
    ctx.font = '20px sans-serif';
    ctx.fillText('FIXED WAVELENGTH PHOTOMETRIC MEASUREMENT', 80, 130);

    ctx.fillStyle = '#00d4e8';
    ctx.font = 'bold 64px monospace';
    ctx.fillText(`${state.currentWl.toFixed(1)} nm`, 80, 210);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 84px monospace';
    ctx.fillText(`${state.currentAbs.toFixed(4)} AU`, 80, 320);

    ctx.fillStyle = '#3dd68c';
    ctx.font = 'bold 44px monospace';
    ctx.fillText(`${state.currentTrans.toFixed(2)} %T`, 80, 400);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Sample: Cell ${state.activeCell} - ${SAMPLES[state.activeCell]?.name}`, 80, 480);
  }

  // Footer bar with carousel cell indicator
  ctx.fillStyle = '#0c131d';
  ctx.fillRect(0, h - 52, w, 52);
  ctx.fillStyle = '#223249';
  ctx.fillRect(0, h - 52, w, 2);

  ctx.font = 'bold 18px monospace';
  for (let c = 1; c <= 6; c++) {
    const cx = 80 + (c - 1) * 150;
    const isAct = c === state.activeCell;
    ctx.fillStyle = isAct ? '#00d4e8' : '#475569';
    ctx.fillText(`[CELL ${c}]`, cx, h - 20);
  }

  lcdTexture.needsUpdate = true;
}

// --- Three.js Scene Setup ---
const container = document.getElementById('viewport3d');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(4.8, 3.8, 4.8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.2, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent dipping beneath lab table
controls.minDistance = 1.5;
controls.maxDistance = 12.0;

// Lighting Setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.7);
dirLight.position.set(5, 12, 6);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 25;
dirLight.shadow.bias = -0.0005;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0x90b0e0, 0.65);
fillLight.position.set(-6, 8, -5);
scene.add(fillLight);

// Build 3D Spectrophotometer Model
const { root: machineRoot, interactiveObjects, animTargets } = createSpectrophotometerModel({ includeLab: true });
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
      animTargets.probeBeamMat.visible = false;
    } else {
      animTargets.probeBeamMat.visible = true;
      animTargets.probeBeamMat.color.setHex(wavelengthToRGB(state.currentWl));
    }
  }

  renderLCD();
}

function logGLP(message) {
  const glpLog = document.getElementById('glp-log');
  if (!glpLog) return;
  const time = new Date().toISOString().substring(11, 19);
  glpLog.textContent += `\n[${time}] ${message}`;
  glpLog.scrollTop = glpLog.scrollHeight;
}

// Initial full spectrum calculation for KMnO4 default
function initDefaultSpectrum() {
  state.scanData = [];
  for (let w = state.scanStartWl; w <= state.scanEndWl; w += 2.0) {
    state.scanData.push({ wl: w, abs: calculateAbsorbance(state.activeCell, w) });
  }
}
initDefaultSpectrum();
performMeasurement();
logGLP(`System Initialized: Shimadzu UV-1900i Twin · proFACT Calibrated.`);
logGLP(`Loaded Cell 2: KMnO4 Solution. λmax = 525.0 nm.`);

// --- Action Handlers ---
function handleAutoZero() {
  if (state.chamberOpen) {
    sfx.beep(400, 0.15, 'sawtooth');
    return;
  }
  sfx.chime();
  state.stateName = 'ZEROING';
  performMeasurement();

  setTimeout(() => {
    state.globalZeroOffset = calculateAbsorbance(state.activeCell, state.currentWl);
    state.stateName = 'READY';
    performMeasurement();
    sfx.beep(880, 0.1, 'sine');
    logGLP(`AUTO ZERO: Baseline zeroed at λ = ${state.currentWl.toFixed(1)} nm with Cell ${state.activeCell}.`);
  }, 600);
}

function handleStartScan() {
  if (state.chamberOpen) {
    sfx.beep(400, 0.15, 'sawtooth');
    return;
  }
  if (state.stateName === 'SCANNING') {
    state.stateName = 'READY';
    performMeasurement();
    return;
  }

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
  state.targetLidAngle = state.chamberOpen ? -1.35 : 0.0;
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

document.getElementById('btn-wireframe')?.addEventListener('click', () => {
  state.wireframe = !state.wireframe;
  document.getElementById('btn-wireframe')?.classList.toggle('active', state.wireframe);
  machineRoot.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.wireframe = state.wireframe;
    }
  });
  sfx.click();
});

document.getElementById('btn-auto-rotate')?.addEventListener('click', () => {
  state.autoRotate = !state.autoRotate;
  document.getElementById('btn-auto-rotate')?.classList.toggle('active', state.autoRotate);
  controls.autoRotate = state.autoRotate;
  sfx.click();
});

document.getElementById('orbit-speed')?.addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  state.orbitSpeed = val;
  controls.autoRotateSpeed = val * 2.0;
  document.getElementById('orbit-speed-val').textContent = `${val.toFixed(1)}×`;
});

document.getElementById('camera-zoom')?.addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  document.getElementById('camera-zoom-val').textContent = `${val}%`;
  const dist = 8.0 - (val / 100) * 5.5;
  const dir = camera.position.clone().sub(controls.target).normalize();
  camera.position.copy(controls.target).add(dir.multiplyScalar(dist));
});

document.getElementById('lab-light')?.addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  document.getElementById('lab-light-val').textContent = `${val.toFixed(1)}×`;
  dirLight.intensity = 1.7 * val;
  ambientLight.intensity = 0.85 * val;
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

// Panel Collapse Toggles
document.querySelectorAll('.panel-collapse-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const panelId = btn.getAttribute('data-collapse');
    const panel = document.getElementById(`panel-${panelId}`);
    if (panel) {
      panel.classList.toggle('collapsed');
      const expanded = !panel.classList.contains('collapsed');
      btn.setAttribute('aria-expanded', expanded.toString());
      btn.textContent = expanded ? '▾' : '▸';
    }
  });
});

// --- Raycasting & 3D Interactive Clicks ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('hud-tooltip');

window.addEventListener('mousemove', (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects, true);

  if (intersects.length > 0) {
    let topHit = intersects[0].object;
    while (topHit && !topHit.userData.name && topHit.parent) {
      topHit = topHit.parent;
    }
    if (topHit && topHit.userData.name) {
      container.style.cursor = 'pointer';
      if (tooltip) {
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.clientX - rect.left}px`;
        tooltip.style.top = `${e.clientY - rect.top}px`;
        tooltip.textContent = `${topHit.userData.name}: ${topHit.userData.action || topHit.userData.sample || topHit.userData.role || ''}`;
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
        document.getElementById('btn-power')?.click();
      } else if (name === 'Btn_Zero') {
        handleAutoZero();
      } else if (name === 'Btn_Scan') {
        handleStartScan();
      } else if (name === 'Btn_Mode') {
        document.getElementById('btn-mode')?.click();
      } else if (name === 'Btn_CellNext') {
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
      } else if (name === 'UI_LCD_TOUCH') {
        // Toggle mode on touch
        document.getElementById('btn-mode')?.click();
      }
    }
  }
});

// --- Standard Camera Presets (Mandatory Visual QA Gate) ---
window.setCameraPreset = function(preset) {
  controls.autoRotate = false;
  document.getElementById('btn-auto-rotate')?.classList.remove('active');
  const target = new THREE.Vector3(0, 1.2, 0);
  controls.target.copy(target);

  switch (preset) {
    case 'iso':
      camera.position.set(4.8, 3.8, 4.8);
      break;
    case 'front':
      camera.position.set(0, 1.6, 5.0);
      break;
    case 'side':
      camera.position.set(5.2, 1.5, 0);
      break;
    case 'top':
      camera.position.set(0, 5.8, 0.2);
      break;
  }
  controls.update();
};

// Window resize handler
window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// --- Main Animation & Simulation Loop ---
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.1);
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

  // 5. Lamp Glow Oscillations
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

  controls.update();
  renderer.render(scene, camera);
}

animate();
