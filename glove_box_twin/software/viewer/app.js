/**
 * SREdesigns UNI-9000 Pro Glove Box — Interactive Application Controller (app.js)
 * 
 * Features:
 * - Three.js WebGL scene with shadow mapping and realistic lab lighting
 * - Dynamic CanvasTexture UI_LCD with strictly enforced texture.flipY = false and inverted UV Y coords
 * - Interactive Capacitive Touchscreen (UI_LCD): Direct raycasted touch on screen softkeys
 * - Physical Circuit Continuity: Duplex bench receptacle, NEMA plug, power switch
 * - Full electro-pneumatic simulation: differential pressure loop, auto-purge,
 *   3-cycle vacuum/refill antechamber sequences, door interlocks, foot pedal assist
 * - Smooth kinematic animations for doors, foot pedal, fan, and analog vacuum gauge needle
 * - Procedural Web Audio API sound synthesis (sfx.js)
 * - Gold Standard Part Explorer with complete taxonomy isolation
 * - Automated classroom demonstration workflow
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildGloveBox3D, GLOVE_BOX_CAMERAS, PART_CATALOG } from './glove_box3d.js';
import { sfx } from './sfx.js';
import { initChemMateTheme } from '../../../lab_viewer/shared/chemmate_theme_manager.js';

// ---------------------------------------------------------------------------
// Application State
// ---------------------------------------------------------------------------
const state = {
  // Power & Circuit Continuity
  isPluggedIn: true,
  powered: true,

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

  // Foot pedal & PLC door
  foot_pedal: false,
  plc_door_open: false,

  // Kinematic target angles
  outer_door_angle: 0.0,
  inner_door_angle: 0.0,
  foot_pedal_angle: 0.0,
  plc_door_angle: 0.0,

  // UI & View
  exploded: false,
  wireframe: false,
  autoRotate: false,
  orbitSpeed: 1.0,
  muted: false,
  demoRunning: false,
  activePartId: null,
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
// ChemMate Theme Controller (Modern, Retro, Night)
// ---------------------------------------------------------------------------
const themeManager = initChemMateTheme({
  twinName: 'GloveBoxTwin',
  scene,
  ambLight,
  dirLight,
  rimLight,
  gridHelper,
  onThemeChange: () => {
    drawLcdUi();
  },
});

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
lcdTexture.flipY = false; // MANDATORY CAD GOVERNANCE RULE (DIAG-005)
lcdTexture.colorSpace = THREE.SRGBColorSpace;

if (twin.refs.lcdMesh) {
  twin.refs.lcdMesh.material = new THREE.MeshBasicMaterial({
    map: lcdTexture,
    toneMapped: false,
    side: THREE.FrontSide,
  });
}

function updateLCD() {
  const hasPower = state.isPluggedIn && state.powered;

  if (!hasPower) {
    // Unpowered blackout state
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, 1024, 768);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('STANDBY · NO MAINS POWER', 512, 384);
    ctx.textAlign = 'start';
    lcdTexture.needsUpdate = true;
    return;
  }

  // Active HMI Screen
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
  drawMetricCard(35, 105, 460, 240, 'OXYGEN CONTENT', `${state.o2_ppm.toFixed(2)}`, 'ppm', state.o2_ppm < 1.0 ? '#3dd68c' : '#f04460');

  // Primary Metrics Card 2: Moisture (H2O)
  drawMetricCard(525, 105, 460, 240, 'MOISTURE LEVEL', `${state.h2o_ppm.toFixed(2)}`, 'ppm', state.h2o_ppm < 1.0 ? '#3dd68c' : '#f04460');

  // Secondary Metrics Card 3: Differential Pressure
  const pColor = Math.abs(state.pressure_mbar - state.pressure_setpoint) < 1.0 ? '#00d4e8' : (state.pressure_mbar < 0 ? '#f0b429' : '#3dd68c');
  drawMetricCard(35, 370, 460, 220, 'CHAMBER PRESSURE', `${state.pressure_mbar >= 0 ? '+' : ''}${state.pressure_mbar.toFixed(2)}`, 'mbar', pColor);

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
  drawMetricCard(525, 370, 460, 220, 'ANTECHAMBER VACUUM', anteStatus, '', anteColor);

  // Bottom Touchscreen Interactive Softkey Bar (DIAG-017 / Interactive Touch)
  ctx.fillStyle = '#111722';
  ctx.fillRect(0, 620, 1024, 148);

  // Softkey 1: [PURGE]
  drawTouchSoftkey(35, 635, 175, 95, state.purging ? 'PURGE: ON' : 'PURGE: OFF', state.purging ? '#00d4e8' : '#243041', state.purging ? '#0a1018' : '#38bdf8');

  // Softkey 2: [3-CYCLE XFER]
  drawTouchSoftkey(230, 635, 185, 95, state.ante_cycling ? 'CYCLING...' : '3-CYCLE XFER', state.ante_cycling ? '#00d4e8' : '#243041', state.ante_cycling ? '#0a1018' : '#e6edf5');

  // Softkey 3: [GAS TYPE]
  drawTouchSoftkey(435, 635, 175, 95, `GAS: ${state.gas_type.toUpperCase()}`, '#243041', '#e6edf5');

  // Softkey 4: [CIRCULATION]
  drawTouchSoftkey(630, 635, 175, 95, state.circulation ? 'SCRUBBER: ON' : 'SCRUBBER: OFF', state.circulation ? '#14532d' : '#243041', state.circulation ? '#86efac' : '#8b9bb0');

  // Softkey 5: [PRESSURE +/-]
  drawTouchSoftkey(825, 635, 165, 95, `SET-P: ${state.pressure_setpoint > 0 ? '+' : ''}${state.pressure_setpoint.toFixed(1)}`, '#243041', '#38bdf8');

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

function drawTouchSoftkey(x, y, w, h, label, bg, fg) {
  ctx.fillStyle = bg;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = fg;
  ctx.font = 'bold 18px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + w / 2, y + h / 2 + 7);
  ctx.textAlign = 'start';
}

// ---------------------------------------------------------------------------
// Simulation Physics Loop
// ---------------------------------------------------------------------------
function updatePhysics(dt) {
  const hasPower = state.isPluggedIn && state.powered;

  if (!hasPower) {
    if (state.purging) {
      state.purging = false;
      sfx.stopPurgeHiss();
    }
    if (state.ante_cycling) {
      state.ante_cycling = false;
      sfx.stopVacuumPump();
    }
    state.blower_flow = 0.0;
    updateTelemetryUI();
    return;
  }

  // 1. Purging dynamics
  if (state.purging) {
    state.o2_ppm = Math.max(0.08, state.o2_ppm - 0.45 * dt);
    state.h2o_ppm = Math.max(0.06, state.h2o_ppm - 0.40 * dt);
    if (state.o2_ppm <= 0.15 && state.h2o_ppm <= 0.15) {
      state.purging = false;
      sfx.stopPurgeHiss();
      document.getElementById('btn-purge')?.classList.remove('active');
      if (document.getElementById('btn-purge')) document.getElementById('btn-purge').textContent = 'PURGE: OFF';
    }
  }

  // 2. Catalytic scrubber circulation
  if (state.circulation && !state.purging) {
    state.blower_flow = 150.0;
    if (state.o2_ppm > 0.05) state.o2_ppm = Math.max(0.05, state.o2_ppm - 0.015 * dt);
    if (state.h2o_ppm > 0.05) state.h2o_ppm = Math.max(0.05, state.h2o_ppm - 0.015 * dt);
  } else {
    state.blower_flow = 0.0;
  }

  // 3. Differential pressure regulation
  const targetP = state.foot_pedal ? -1.5 : state.pressure_setpoint;
  const pDiff = targetP - state.pressure_mbar;
  state.pressure_mbar += pDiff * Math.min(1.0, 1.2 * dt);

  // 4. Antechamber Evacuation & Refill loop
  if (state.ante_cycling) {
    if (state.ante_vacuum_mbar > 1.5) {
      state.ante_vacuum_mbar = Math.max(0.5, state.ante_vacuum_mbar - 220.0 * dt);
    } else {
      state.ante_cycle_count++;
      if (state.ante_cycle_count < state.target_cycles) {
        state.ante_vacuum_mbar = 1013.0; // Simulated quick refill step
      } else {
        state.ante_cycling = false;
        state.ante_vacuum_mbar = 1013.0;
        sfx.stopVacuumPump();
        document.getElementById('btn-ante-cycle')?.classList.remove('active');
        if (document.getElementById('btn-ante-cycle')) document.getElementById('btn-ante-cycle').textContent = '3-CYCLE XFER: IDLE';
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

  // Spin cabinet cooling fan if powered
  twin.setCabinetFanRunning(hasPower);

  // Update HTML telemetry readouts
  updateTelemetryUI();
}

function updateTelemetryUI() {
  const hasPower = state.isPluggedIn && state.powered;

  const o2El = document.getElementById('telem-o2');
  const h2oEl = document.getElementById('telem-h2o');
  const pEl = document.getElementById('telem-pressure');
  const gasEl = document.getElementById('telem-gas');
  const anteEl = document.getElementById('telem-ante');
  const blowerEl = document.getElementById('telem-blower');
  const fanEl = document.getElementById('telem-fan');
  const plcEl = document.getElementById('telem-plc');
  const pwrEl = document.getElementById('telem-power');
  const statusPill = document.getElementById('status-pill');

  if (!state.isPluggedIn) {
    if (statusPill) {
      statusPill.className = 'pill alarm';
      statusPill.textContent = 'NO MAINS POWER';
    }
    if (pwrEl) pwrEl.textContent = 'CORD UNPLUGGED';
    if (plcEl) plcEl.textContent = 'OFFLINE (0V)';
    if (fanEl) fanEl.textContent = 'STOPPED (0 RPM)';
    if (blowerEl) blowerEl.textContent = 'OFF (0 L/min)';
    return;
  }

  if (!state.powered) {
    if (statusPill) {
      statusPill.className = 'pill alarm';
      statusPill.textContent = 'POWER SWITCH OFF';
    }
    if (pwrEl) pwrEl.textContent = '120V AC (STANDBY)';
    if (plcEl) plcEl.textContent = 'STOPPED';
    if (fanEl) fanEl.textContent = 'STOPPED';
    if (blowerEl) blowerEl.textContent = 'OFF (0 L/min)';
    return;
  }

  if (o2El) o2El.textContent = `${state.o2_ppm.toFixed(2)} ppm`;
  if (h2oEl) h2oEl.textContent = `${state.h2o_ppm.toFixed(2)} ppm`;
  if (pEl) pEl.textContent = `${state.pressure_mbar >= 0 ? '+' : ''}${state.pressure_mbar.toFixed(2)} mbar`;
  if (gasEl) gasEl.textContent = state.gas_type;
  if (anteEl) anteEl.textContent = `${state.ante_vacuum_mbar.toFixed(0)} mbar`;
  if (blowerEl) blowerEl.textContent = `${state.blower_flow.toFixed(0)} L/min`;
  if (fanEl) fanEl.textContent = 'Active (3200 RPM)';
  if (plcEl) plcEl.textContent = 'S7-1200 RUN';
  if (pwrEl) pwrEl.textContent = '120V AC 60Hz';

  if (statusPill) {
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
    CAM_CONSOLE: 'btn-cam-console',
    CAM_SIDE: 'btn-cam-side',
    CAM_TOP: 'btn-cam-top',
    CAM_REAR: 'btn-cam-rear',
  };
  const btn = document.getElementById(idMap[presetName]);
  if (btn) btn.classList.add('active');
}

// ---------------------------------------------------------------------------
// Direct Raycasting & Capacitive Touchscreen Pointer Handling
// ---------------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const hit = intersects[0];
    const hitName = hit.object.name || '';

    // 1. Direct Touchscreen Interaction (UI_LCD)
    if (hitName === 'UI_LCD' && hit.uv) {
      handleLcdTouch(hit.uv.x, hit.uv.y);
      return;
    }

    // 2. Physical Button & Kinematic Part Interaction
    handlePartInteraction(hitName, hit.object);
  }
});

/**
 * Handles capacitive touch coordinates on 10" TFT LCD screen
 * UV x, y ∈ [0, 1] mapped across 1024x768 canvas
 */
function handleLcdTouch(uvX, uvY) {
  if (!state.isPluggedIn || !state.powered) {
    sfx.playTouchBeep(320, 0.04);
    return;
  }

  // Pixel coordinates in 1024x768 canvas
  const px = uvX * 1024;
  const py = uvY * 768;

  // Bottom Softkey Bar: Y ∈ [620, 740]
  if (py >= 620 && py <= 740) {
    if (px >= 35 && px <= 210) {
      // Softkey 1: [PURGE]
      togglePurge();
    } else if (px >= 230 && px <= 415) {
      // Softkey 2: [3-CYCLE XFER]
      toggleAnteCycle();
    } else if (px >= 435 && px <= 610) {
      // Softkey 3: [GAS TYPE]
      toggleGasType();
    } else if (px >= 630 && px <= 805) {
      // Softkey 4: [CIRCULATION]
      toggleCirculation();
    } else if (px >= 825 && px <= 990) {
      // Softkey 5: [PRESSURE +/-]
      cyclePressureSetpoint();
    }
  } else if (py >= 105 && py <= 345) {
    // Upper Metric Card Tap -> zoom to console or acknowledge
    sfx.playTouchBeep(940, 0.03);
    setCameraView('CAM_CONSOLE');
  } else {
    sfx.playTouchBeep(780, 0.03);
  }
}

function handlePartInteraction(name, obj) {
  if (!name) return;

  if (name.includes('Btn_Power')) {
    togglePower();
  } else if (name.includes('Power_Plug_NEMA') || name.includes('Power_Receptacle')) {
    togglePlug();
  } else if (name.includes('DoorOuter') || name.includes('DoorClampOuter')) {
    toggleOuterDoor();
  } else if (name.includes('DoorInner') || name.includes('DoorClampInner')) {
    toggleInnerDoor();
  } else if (name.includes('FootPedal')) {
    toggleFootPedal();
  } else if (name.includes('PLCCabinetDoor') || name.includes('QuarterTurnLock')) {
    togglePlcDoor();
  }
}

// ---------------------------------------------------------------------------
// Action Handlers
// ---------------------------------------------------------------------------
function togglePower() {
  state.powered = !state.powered;
  sfx.playTouchBeep(state.powered ? 880 : 440, 0.05);
  const btn = document.getElementById('btn-power');
  if (btn) {
    btn.classList.toggle('active', state.powered);
    btn.textContent = state.powered ? 'POWER: ON' : 'POWER: OFF';
  }
}

function togglePlug() {
  state.isPluggedIn = !state.isPluggedIn;
  sfx.playTouchBeep(600, 0.04);
  const btn = document.getElementById('btn-plug');
  if (btn) {
    btn.classList.toggle('active', state.isPluggedIn);
    btn.textContent = state.isPluggedIn ? 'CORD: PLUGGED IN' : 'CORD: UNPLUGGED';
  }
  if (twin.refs.plugGroup) {
    twin.refs.plugGroup.position.z = state.isPluggedIn ? -6.10 / 2 + 0.40 - 0.05 : -6.10 / 2 + 0.40 - 0.45;
  }
}

function togglePurge() {
  state.purging = !state.purging;
  const btn = document.getElementById('btn-purge');
  if (btn) {
    btn.classList.toggle('active', state.purging);
    btn.textContent = state.purging ? 'PURGE: ACTIVE' : 'PURGE: OFF';
  }
  if (state.purging) {
    sfx.startPurgeHiss();
    sfx.playValveClick(true);
  } else {
    sfx.stopPurgeHiss();
    sfx.playValveClick(false);
  }
}

function toggleAnteCycle() {
  if (state.outer_door_open || state.inner_door_open) {
    sfx.playAlarm();
    alert('Cannot cycle antechamber: Both doors must be sealed first!');
    return;
  }
  state.ante_cycling = !state.ante_cycling;
  const btn = document.getElementById('btn-ante-cycle');
  if (btn) {
    btn.classList.toggle('active', state.ante_cycling);
    btn.textContent = state.ante_cycling ? '3-CYCLE XFER: RUNNING' : '3-CYCLE XFER: IDLE';
  }
  if (state.ante_cycling) {
    state.ante_cycle_count = 0;
    sfx.startVacuumPump();
  } else {
    sfx.stopVacuumPump();
    state.ante_vacuum_mbar = 1013.0;
  }
}

function toggleOuterDoor() {
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
    state.ante_cycle_count = 0;
  }
  const btn = document.getElementById('btn-outer-door');
  if (btn) {
    btn.classList.toggle('active', state.outer_door_open);
    btn.textContent = state.outer_door_open ? 'OUTER DOOR: OPEN' : 'OUTER DOOR: SEALED';
  }
  sfx.playDoorLatch(!state.outer_door_open);
}

function toggleInnerDoor() {
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
  const btn = document.getElementById('btn-inner-door');
  if (btn) {
    btn.classList.toggle('active', state.inner_door_open);
    btn.textContent = state.inner_door_open ? 'INNER DOOR: OPEN' : 'INNER DOOR: SEALED';
  }
  sfx.playDoorLatch(!state.inner_door_open);
}

function toggleFootPedal() {
  state.foot_pedal = !state.foot_pedal;
  const btn = document.getElementById('btn-foot-pedal');
  if (btn) {
    btn.classList.toggle('active', state.foot_pedal);
    btn.textContent = state.foot_pedal ? 'PEDAL: ENGAGED (-P)' : 'PEDAL: IDLE (+P)';
  }
  sfx.playPedalClick(state.foot_pedal);
}

function toggleGasType() {
  state.gas_type = state.gas_type === 'Argon' ? 'Nitrogen' : 'Argon';
  const btn = document.getElementById('btn-gas-type');
  if (btn) btn.textContent = `GAS: ${state.gas_type.toUpperCase()}`;
  sfx.playTouchBeep(850, 0.04);
}

function toggleCirculation() {
  state.circulation = !state.circulation;
  const btn = document.getElementById('btn-circulation');
  if (btn) {
    btn.classList.toggle('active', state.circulation);
    btn.textContent = state.circulation ? 'CIRCULATION: ON' : 'CIRCULATION: OFF';
  }
  sfx.playTouchBeep(740, 0.04);
}

function togglePlcDoor() {
  state.plc_door_open = !state.plc_door_open;
  if (twin.refs.plcDoor) {
    twin.refs.plcDoor.rotation.y = state.plc_door_open ? -2.10 : 0.0;
  }
  const btn = document.getElementById('btn-plc-door');
  if (btn) {
    btn.classList.toggle('active', state.plc_door_open);
    btn.textContent = state.plc_door_open ? 'PLC DOOR: OPEN' : 'PLC DOOR: CLOSED';
  }
  sfx.playDoorLatch(!state.plc_door_open);
}

function cyclePressureSetpoint() {
  state.pressure_setpoint = state.pressure_setpoint === 3.5 ? 5.0 : (state.pressure_setpoint === 5.0 ? 2.0 : 3.5);
  sfx.playTouchBeep(880, 0.04);
}

// ---------------------------------------------------------------------------
// Part Explorer Implementation
// ---------------------------------------------------------------------------
function initPartExplorer() {
  const listEl = document.getElementById('parts-list');
  if (!listEl) return;

  listEl.innerHTML = '';
  PART_CATALOG.forEach((part) => {
    const item = document.createElement('div');
    item.className = 'part-item';
    item.dataset.partId = part.id;
    item.innerHTML = `
      <span>${part.label}</span>
      <span class="part-cat-badge">${part.cat}</span>
    `;

    item.addEventListener('click', () => {
      document.querySelectorAll('.part-item').forEach((el) => el.classList.remove('active'));
      item.classList.add('active');
      state.activePartId = part.id;
      focusPart(part.id);
      sfx.playTouchBeep(840, 0.03);
    });

    listEl.appendChild(item);
  });

  document.getElementById('btn-parts-clear')?.addEventListener('click', () => {
    clearPartFocus();
    state.activePartId = null;
    document.querySelectorAll('.part-item').forEach((el) => el.classList.remove('active'));
    const stEl = document.getElementById('parts-focus-status');
    if (stEl) stEl.textContent = 'No part focused';
    setCameraView('CAM_ISO');
  });
}

function focusPart(partId) {
  let targetObj = null;
  twin.root.traverse((node) => {
    if (node.name === partId) {
      targetObj = node;
    }
  });

  const stEl = document.getElementById('parts-focus-status');
  if (!targetObj) {
    if (stEl) stEl.textContent = `Part: ${partId}`;
    return;
  }

  const foundPart = PART_CATALOG.find((p) => p.id === partId);
  if (stEl) stEl.textContent = `Focused: ${foundPart ? foundPart.label : partId}`;

  const box3 = new THREE.Box3().setFromObject(targetObj);
  const center = box3.getCenter(new THREE.Vector3());
  const size = box3.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.5);

  controls.target.copy(center);
  camera.position.set(center.x + maxDim * 2.2, center.y + maxDim * 1.5, center.z - maxDim * 2.8);
  controls.update();
}

function clearPartFocus() {
  twin.root.traverse((node) => {
    if (node.isMesh && node.material) {
      node.material.wireframe = state.wireframe;
    }
  });
}

// ---------------------------------------------------------------------------
// Classroom Demonstration Workflow
// ---------------------------------------------------------------------------
async function runClassroomDemo() {
  if (state.demoRunning) return;
  state.demoRunning = true;
  const demoBtn = document.getElementById('btn-demo');
  if (demoBtn) {
    demoBtn.classList.add('active');
    demoBtn.textContent = 'Demo Running...';
  }

  const statusDetail = document.getElementById('status-detail');

  try {
    setCameraView('CAM_SIDE');
    if (statusDetail) statusDetail.textContent = 'Step 1/6: Verifying baseline ultra-pure inert atmosphere (<0.2 ppm O2/H2O)...';
    await wait(2200);

    if (statusDetail) statusDetail.textContent = 'Step 2/6: Opening outer antechamber door for air-sensitive vial ingress...';
    toggleOuterDoor();
    await wait(2000);

    if (statusDetail) statusDetail.textContent = 'Step 3/6: Sealing outer door clamp with silicone O-ring gasket...';
    toggleOuterDoor();
    await wait(1800);

    if (statusDetail) statusDetail.textContent = 'Step 4/6: Initiating 3-cycle vacuum roughing (<0.5 mbar) and Argon refill...';
    toggleAnteCycle();
    await wait(4500);

    setCameraView('CAM_FRONT');
    if (statusDetail) statusDetail.textContent = 'Step 5/6: Equalized pressure confirmed. Opening inner door into sealed chamber...';
    toggleInnerDoor();
    await wait(2400);

    if (statusDetail) statusDetail.textContent = 'Step 6/6: Operator depressing foot switch for negative pressure assist...';
    toggleFootPedal();
    await wait(2600);

    toggleFootPedal();
    toggleInnerDoor();
    if (statusDetail) statusDetail.textContent = 'Demo Complete: Organometallic transfer completed under continuous <0.2 ppm purity.';

  } finally {
    state.demoRunning = false;
    if (demoBtn) {
      demoBtn.classList.remove('active');
      demoBtn.textContent = 'Run Classroom Demo';
    }
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Event Listeners & UI Binding
// ---------------------------------------------------------------------------
document.getElementById('btn-cam-iso')?.addEventListener('click', () => setCameraView('CAM_ISO'));
document.getElementById('btn-cam-front')?.addEventListener('click', () => setCameraView('CAM_FRONT'));
document.getElementById('btn-cam-console')?.addEventListener('click', () => setCameraView('CAM_CONSOLE'));
document.getElementById('btn-cam-side')?.addEventListener('click', () => setCameraView('CAM_SIDE'));
document.getElementById('btn-cam-top')?.addEventListener('click', () => setCameraView('CAM_TOP'));
document.getElementById('btn-cam-rear')?.addEventListener('click', () => setCameraView('CAM_REAR'));

document.getElementById('btn-explode')?.addEventListener('click', (e) => {
  state.exploded = !state.exploded;
  e.currentTarget.classList.toggle('active', state.exploded);
  twin.setExploded(state.exploded);
  sfx.playTouchBeep(state.exploded ? 600 : 400, 0.05);
  if (state.exploded) {
    setCameraView('CAM_EXPLODED');
  } else {
    setCameraView('CAM_ISO');
  }
});

document.getElementById('btn-wireframe')?.addEventListener('click', (e) => {
  state.wireframe = !state.wireframe;
  e.currentTarget.classList.toggle('active', state.wireframe);
  twin.root.traverse((c) => {
    if (c.isMesh && c.material && c.name !== 'UI_LCD') {
      c.material.wireframe = state.wireframe;
    }
  });
  sfx.playTouchBeep(700, 0.04);
});

document.getElementById('btn-auto-rotate')?.addEventListener('click', (e) => {
  state.autoRotate = !state.autoRotate;
  e.currentTarget.classList.toggle('active', state.autoRotate);
  controls.autoRotate = state.autoRotate;
  controls.autoRotateSpeed = state.orbitSpeed;
});

document.getElementById('orbit-speed')?.addEventListener('input', (e) => {
  state.orbitSpeed = parseFloat(e.target.value);
  const valEl = document.getElementById('orbit-speed-val');
  if (valEl) valEl.textContent = `${state.orbitSpeed.toFixed(1)}×`;
  controls.autoRotateSpeed = state.orbitSpeed;
});

document.getElementById('btn-sfx-mute')?.addEventListener('click', (e) => {
  state.muted = !state.muted;
  sfx.setMuted(state.muted);
  e.currentTarget.classList.toggle('active', state.muted);
  e.currentTarget.textContent = state.muted ? 'Unmute SFX' : 'Mute SFX';
});

// Sidebar Control Buttons
document.getElementById('btn-power')?.addEventListener('click', togglePower);
document.getElementById('btn-plug')?.addEventListener('click', togglePlug);
document.getElementById('btn-purge')?.addEventListener('click', togglePurge);
document.getElementById('btn-ante-cycle')?.addEventListener('click', toggleAnteCycle);
document.getElementById('btn-outer-door')?.addEventListener('click', toggleOuterDoor);
document.getElementById('btn-inner-door')?.addEventListener('click', toggleInnerDoor);
document.getElementById('btn-foot-pedal')?.addEventListener('click', toggleFootPedal);
document.getElementById('btn-gas-type')?.addEventListener('click', toggleGasType);
document.getElementById('btn-circulation')?.addEventListener('click', toggleCirculation);
document.getElementById('btn-plc-door')?.addEventListener('click', togglePlcDoor);
document.getElementById('btn-demo')?.addEventListener('click', runClassroomDemo);

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

// Start Application
initPartExplorer();
updateLCD();
setCameraView('CAM_ISO');
animate();

window.__testState = state;
window.__setCustomCam = (pos, tgt) => {
  camera.position.set(...pos);
  controls.target.set(...tgt);
  controls.update();
};
