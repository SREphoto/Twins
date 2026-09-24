/**
 * Ultrasonic Cleaner Twin — App Controller (Procedural)
 *
 * Fully procedural 3D model consumed from ultrasonic3d.js.
 * No GLB loaded at runtime.
 *
 * Preserved: simulation state, LCD drawing, showcase demo,
 * keypad events, toolbar events, raycasting, sfx integration.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildLabRoom, INSTRUMENT_BENCH } from '../../../centrifuge_twin/software/viewer/centrifuge3d.js?v=20260726-proc';
import { createUltrasonicCleanerModel } from './ultrasonic3d.js?v=20260726-proc';
import { sfx } from './sfx.js';

// DOM Elements
const viewportEl = document.getElementById('viewport3d');
const lcdCanvas = document.getElementById('lcd');
const lcdCtx = lcdCanvas.getContext('2d');
const statusPill = document.getElementById('status-pill');
const statusDetail = document.getElementById('status-detail');
const cleanLog = document.getElementById('clean-log');

// Simulation State
const state = {
  powerOn: true,
  running: false,
  degas: false,
  heaterOn: false,
  fault: null,
  lidOpen: false,
  targetTemp: 50,
  currentTemp: 22,
  timerSetMin: 15,
  timerSecRemaining: 900,
  powerPct: 100,
  basketLocation: 'bench', // 'bench', 'raised', 'lowered'
  sampleLoaded: false,
  sampleLocation: 'bench', // 'bench', 'basket'
  cleanlinessPct: 0,
  autoRotate: false,
  orbitSpeed: 1.1,
  exploded: false,
  wireframe: false,
  focusedPart: null,
  currentSampleType: 'grease',
  pressed: {}
};

// 3D Scene references
let scene, camera, renderer, controls;
let modelRoot = null;
let allMeshes = [], originalMaterials = new Map();
let dirLight, fillLight, ambientLight;

// Procedural model handles (set in init3D)
let mdl = null;        // full return from createUltrasonicCleanerModel
let sampleGroup = null, contaminantMesh = null;
let dragControls = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Dynamic LCD Canvas Texture
const lcdTexture = new THREE.CanvasTexture(lcdCanvas);

// ─── INIT ────────────────────────────────────────────────────────────────────

function init3D() {
  const w = viewportEl.clientWidth || window.innerWidth;
  const h = viewportEl.clientHeight || window.innerHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc5d0dc);
  scene.fog = new THREE.Fog(0xd0d8e0, 32, 70);

  camera = new THREE.PerspectiveCamera(38, w / h, 0.05, 140);
  camera.position.set(3.6, 3.5, -4.6);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  viewportEl.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(-0.25, 1.75, -0.1);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI * 0.495;

  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  dirLight = new THREE.DirectionalLight(0xfff8f0, 0.95);
  dirLight.position.set(2, 16, -5);
  dirLight.castShadow = true;
  scene.add(dirLight);
  fillLight = new THREE.DirectionalLight(0xf0f6ff, 0.65);
  fillLight.position.set(0, 18, 0);
  scene.add(fillLight);

  // Environment map for realistic metallic reflections (SS304, aluminum, copper)
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment(renderer);
  scene.environment = pmremGenerator.fromScene(roomEnv).texture;
  scene.environmentIntensity = 0.7;
  pmremGenerator.dispose();

  // Build lab room (shared from centrifuge)
  const labRoot = new THREE.Group();
  scene.add(labRoot);
  const labInfo = buildLabRoom(labRoot);

  // Build procedural ultrasonic cleaner model
  mdl = createUltrasonicCleanerModel(lcdTexture);
  modelRoot = mdl.root;

  // Scale and position on the workbench
  modelRoot.scale.set(1, 1, 1);
  const bbox = new THREE.Box3().setFromObject(modelRoot);
  const center = bbox.getCenter(new THREE.Vector3());
  modelRoot.position.set(
    INSTRUMENT_BENCH.cx - center.x,
    labInfo.surfaceY - bbox.min.y,
    INSTRUMENT_BENCH.cz - center.z
  );
  scene.add(modelRoot);

  // Build power cord in absolute scene coords
  createPowerCord(labInfo.outlet, labInfo.surfaceY);

  // Rebuild 3D sample inside basket
  rebuild3DSample(state.currentSampleType);

  // Initialize basket to bench position
  if (mdl.basket) {
    // Offset basket to open bench on the right
    mdl.basket.position.set(2.0, 0.0, -0.2); 
  }

  // Collect all meshes for wireframe/focus/raycasting
  modelRoot.traverse((child) => {
    if (child.isMesh) {
      allMeshes.push(child);
      originalMaterials.set(child.uuid, child.material);
    }
  });

  // Expose for debugging
  window.THREE = THREE;
  window.model = modelRoot;
  window.camera = camera;
  window.controls = controls;
  window.state = state;
  window.mdl = mdl;

  document.getElementById('viewport-status').textContent =
    `Procedural model loaded (${allMeshes.length} meshes) in wet-lab room.`;
  populatePartsExplorer();
  logEvent('System initialized — procedural model (no GLB).');

  viewportEl.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('resize', onResize);

  setupDragControls();
}

function getRootDragObject(obj) {
  if (!obj) return null;
  let curr = obj;
  while (curr) {
    if (curr === mdl?.basket || curr === sampleGroup) return curr;
    curr = curr.parent;
  }
  return obj;
}

let activeDraggedGroup = null;
let lastDragWorldPos = new THREE.Vector3();

function setupDragControls() {
  const dragObjects = [mdl.basket, sampleGroup].filter(Boolean);
  dragControls = new DragControls(dragObjects, camera, renderer.domElement);
  dragControls.transformGroup = true;

  dragControls.addEventListener('dragstart', function (event) {
    controls.enabled = false;
    activeDraggedGroup = getRootDragObject(event.object);
    if (activeDraggedGroup) {
      activeDraggedGroup.getWorldPosition(lastDragWorldPos);
    }
  });

  dragControls.addEventListener('drag', function (event) {
    const rootObj = activeDraggedGroup || getRootDragObject(event.object);
    if (rootObj && rootObj !== event.object) {
      const currentWorldPos = new THREE.Vector3();
      event.object.getWorldPosition(currentWorldPos);
      const delta = currentWorldPos.clone().sub(lastDragWorldPos);
      rootObj.position.add(delta);
      lastDragWorldPos.copy(currentWorldPos);
      event.object.position.set(0, 0, 0);
    }
  });

  dragControls.addEventListener('dragend', function (event) {
    controls.enabled = true;
    const obj = activeDraggedGroup || getRootDragObject(event.object);
    activeDraggedGroup = null;

    const basinX = mdl.basinOffsetX || -0.48;

    if (obj === mdl.basket) {
      // Snap Basket
      const distToBasin = Math.hypot(mdl.basket.position.x - basinX, mdl.basket.position.z);
      if (distToBasin < 1.0) {
        if (mdl.basket.position.y > 1.2) {
          mdl.basket.position.set(basinX, 1.82, 0);
          state.basketLocation = 'raised';
        } else {
          mdl.basket.position.set(basinX, 0.72, 0);
          state.basketLocation = 'lowered';
        }
      } else {
        mdl.basket.position.set(2.0, 0.0, -0.2);
        state.basketLocation = 'bench';
      }
      sfx.playBeep(750);
      updateBasketUI();
      logEvent(`Basket moved to ${state.basketLocation}`);
    } else if (obj === sampleGroup) {
      // Snap Sample using world coordinates
      const sampleWorld = new THREE.Vector3();
      sampleGroup.getWorldPosition(sampleWorld);
      const basketWorld = new THREE.Vector3();
      mdl.basket.getWorldPosition(basketWorld);
      
      const distToBasket = sampleWorld.distanceTo(basketWorld);
      if (distToBasket < 1.0) {
        // Snap into basket
        state.sampleLocation = 'basket';
        mdl.basket.add(sampleGroup);
        sampleGroup.position.set(0, 0.02, 0);
        logEvent('Sample loaded into basket.');
      } else {
        // Snap to bench in front of basket
        state.sampleLocation = 'bench';
        modelRoot.add(sampleGroup);
        sampleGroup.position.set(2.0, 0.0, -0.9);
        logEvent('Sample moved to lab bench.');
      }
      sfx.playBeep(750);
    }
  });
}

// ─── POWER CORD ──────────────────────────────────────────────────────────────

function createPowerCord(outletPos, surfaceY) {
  // Get IEC exit point in world coords
  const iecWorld = new THREE.Vector3(
    mdl.iecExit.x, mdl.iecExit.y, mdl.iecExit.z
  );
  modelRoot.localToWorld(iecWorld);

  const curve = new THREE.CatmullRomCurve3([
    iecWorld,
    new THREE.Vector3(iecWorld.x - 0.15, surfaceY + 0.06, iecWorld.z + 0.06),
    new THREE.Vector3(iecWorld.x - 0.3, surfaceY + 0.035, iecWorld.z + 0.3),
    new THREE.Vector3(outletPos.x - 0.3, surfaceY + 0.03, outletPos.z - 0.3),
    new THREE.Vector3(outletPos.x, outletPos.y - 0.05, outletPos.z - 0.12),
  ]);

  const cordGeo = new THREE.TubeGeometry(curve, 48, 0.024, 8, false);
  const cordMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
  const cordMesh = new THREE.Mesh(cordGeo, cordMat);
  cordMesh.castShadow = true;
  cordMesh.name = "Power_Cord";
  scene.add(cordMesh);

  // Molded IEC C13 plug at machine end
  const iecPlug = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, 0.14),
    new THREE.MeshStandardMaterial({ color: 0x0f0f10, roughness: 0.6 })
  );
  iecPlug.position.copy(iecWorld).add(new THREE.Vector3(0, 0, 0.04));
  iecPlug.name = "IEC_Plug";
  scene.add(iecPlug);

  // Wall outlet plug
  const plug = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.07, 0.14),
    new THREE.MeshStandardMaterial({ color: 0x0a0a0b, roughness: 0.6 })
  );
  plug.position.set(outletPos.x, outletPos.y - 0.05, outletPos.z - 0.08);
  plug.name = "Wall_Plug";
  scene.add(plug);
}

// ─── SAMPLE SYSTEM ───────────────────────────────────────────────────────────

function rebuild3DSample(type) {
  if (!mdl || !mdl.basket) return;
  if (!sampleGroup) {
    sampleGroup = new THREE.Group();
    modelRoot.add(sampleGroup);
  } else {
    sampleGroup.clear();
  }
  
  // Position on the bench in front of basket
  sampleGroup.position.set(2.0, 0.0, -0.9);
  state.sampleLocation = 'bench';

  if (type === 'grease') {
    // 1. High-Fidelity 250mL Beaker
    const beakerG = new THREE.Group();
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true,
      roughness: 0.05, ior: 1.5, thickness: 0.02, side: THREE.DoubleSide, depthWrite: false
    });
    // Main cylinder (open top)
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 32, 1, true), glassMat);
    wall.position.y = 0.175;
    beakerG.add(wall);
    // Bottom
    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.01, 32), glassMat);
    bottom.position.y = 0.005;
    beakerG.add(bottom);
    // Rim
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.015, 16, 32), glassMat);
    rim.position.y = 0.35;
    rim.rotation.x = Math.PI / 2;
    beakerG.add(rim);
    sampleGroup.add(beakerG);

    // Grease Contaminant (thick irregular layer at bottom)
    const greaseMat = new THREE.MeshStandardMaterial({
      color: 0x3d1c04, roughness: 0.8, metalness: 0.1, transparent: true, opacity: 0.95
    });
    contaminantMesh = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 16), greaseMat);
    contaminantMesh.scale.set(1, 0.4, 1);
    contaminantMesh.position.y = 0.06;
    contaminantMesh.name = "Contaminant_Grease";
    sampleGroup.add(contaminantMesh);

  } else if (type === 'flux') {
    // 2. High-Fidelity PCB
    const pcbG = new THREE.Group();
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7, metalness: 0.1 });
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.4), pcbMat);
    board.position.y = 0.01;
    pcbG.add(board);
    
    // Add SMD chips
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const positions = [[0, 0], [0.15, -0.05], [-0.15, 0.1], [0.2, 0.12]];
    positions.forEach(pos => {
      const chip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.08), chipMat);
      chip.position.set(pos[0], 0.035, pos[1]);
      pcbG.add(chip);
    });
    sampleGroup.add(pcbG);

    // Flux Contaminant (amber semi-transparent layer coating the board)
    const fluxMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706, transmission: 0.6, opacity: 1, transparent: true,
      roughness: 0.3, ior: 1.4, thickness: 0.01, depthWrite: false
    });
    contaminantMesh = new THREE.Group();
    positions.forEach(pos => {
      const fluxBlob = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.12), fluxMat);
      fluxBlob.position.set(pos[0], 0.025, pos[1]);
      contaminantMesh.add(fluxBlob);
    });
    contaminantMesh.name = "Contaminant_Flux";
    sampleGroup.add(contaminantMesh);

  } else if (type === 'residue') {
    // 3. Test Tube Rack with 3 Tubes
    const rackG = new THREE.Group();
    const rackMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
    // Base and Top Plate
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.15), rackMat);
    base.position.y = 0.01;
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.15), rackMat);
    top.position.y = 0.15;
    rackG.add(base, top);
    // Legs
    for (const x of [-0.18, 0.18]) {
      for (const z of [-0.06, 0.06]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.16), rackMat);
        leg.position.set(x, 0.08, z);
        rackG.add(leg);
      }
    }
    
    // Tubes
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true,
      roughness: 0.05, side: THREE.DoubleSide, depthWrite: false
    });
    const resMat = new THREE.MeshStandardMaterial({
      color: 0xdb2777, roughness: 0.6, transparent: true, opacity: 0.95
    });
    
    contaminantMesh = new THREE.Group(); // Group for 3 residue chunks
    contaminantMesh.name = "Contaminant_Residue";

    [-0.12, 0, 0.12].forEach(x => {
      // Glass Tube
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.25, 16, 1, true), glassMat);
      tube.position.set(x, 0.15, 0);
      const tubeBot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), glassMat);
      tubeBot.position.set(x, 0.025, 0);
      rackG.add(tube, tubeBot);
      
      // Pink Residue inside
      const residue = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.033, 0.1, 16, 1, false), resMat);
      residue.position.set(x, 0.08, 0);
      contaminantMesh.add(residue);
    });

    sampleGroup.add(rackG);
    sampleGroup.add(contaminantMesh);
  }

  // Handle fading out contaminant during cleaning by updating materials
  // Since contaminantMesh might be a Group now, we need to apply opacity recursively
  contaminantMesh.userData.setOpacity = (op) => {
    contaminantMesh.traverse(child => {
      if (child.isMesh) child.material.opacity = op;
    });
  };

  sampleGroup.visible = state.sampleLoaded;
}

// ─── LCD ─────────────────────────────────────────────────────────────────────

function drawLCD() {
  lcdCtx.fillStyle = '#020b14';
  lcdCtx.fillRect(0, 0, 1024, 512);
  if (!state.powerOn) {
    lcdCtx.fillStyle = '#1e293b';
    lcdCtx.font = 'bold 36px monospace';
    lcdCtx.fillText('POWER OFF', 40, 60);
    lcdTexture.needsUpdate = true;
    return;
  }
  lcdCtx.fillStyle = '#00d4e8';
  lcdCtx.font = 'bold 36px monospace';
  lcdCtx.fillText('ULTRASONIC 3000-PRO', 40, 60);

  if (state.fault === 'DRY_RUN') {
    lcdCtx.fillStyle = '#f04460';
    lcdCtx.font = 'bold 72px monospace';
    lcdCtx.fillText('ERR: DRY RUN DETECTED!', 40, 200);
    lcdCtx.font = 'bold 36px monospace';
    lcdCtx.fillText('FLUID TANK EMPTY — TRANSDUCTORS HALTED', 40, 300);
    lcdTexture.needsUpdate = true;
    return;
  }

  lcdCtx.fillStyle = state.running ? '#3dd68c' : '#8b9bb0';
  lcdCtx.font = 'bold 80px monospace';
  lcdCtx.fillText(`${Math.round(state.currentTemp)}°C`, 40, 180);
  const minStr = String(Math.floor(state.timerSecRemaining / 60)).padStart(2, '0');
  const secStr = String(Math.floor(state.timerSecRemaining % 60)).padStart(2, '0');
  lcdCtx.fillText(`${minStr}:${secStr}`, 450, 180);

  lcdCtx.fillStyle = state.running ? '#3dd68c' : '#64748b';
  lcdCtx.font = 'bold 40px monospace';
  lcdCtx.fillText(
    state.running
      ? `CAVITATION 40kHz (${state.powerPct}%) ACTIVE`
      : `STANDBY (POWER: ${state.powerPct}%)`,
    40, 270
  );

  if (state.degas) {
    lcdCtx.fillStyle = '#f0b429';
    lcdCtx.fillText('PULSE DEGAS MODE ACTIVE', 40, 350);
  }
  if (state.heaterOn) {
    lcdCtx.fillStyle = '#f04460';
    lcdCtx.fillText('HEATER ON', 40, 420);
  }
  if (state.sampleLoaded) {
    lcdCtx.fillStyle = '#38bdf8';
    lcdCtx.font = 'bold 28px monospace';
    lcdCtx.fillText(`SAMPLE CLEANLINESS: ${Math.round(state.cleanlinessPct)}%`, 40, 470);
  }

  lcdCtx.strokeStyle = '#1e3a5f';
  lcdCtx.lineWidth = 12;
  lcdCtx.strokeRect(10, 10, 1004, 492);
  lcdTexture.needsUpdate = true;
}

// ─── STATUS ──────────────────────────────────────────────────────────────────

function logEvent(msg) {
  const time = new Date().toLocaleTimeString();
  cleanLog.textContent = `[${time}] ${msg}\n` + cleanLog.textContent;
}

function updateStatusPill() {
  if (!state.powerOn) {
    statusPill.textContent = 'POWER OFF';
    statusPill.className = 'pill';
    statusDetail.textContent = 'Press POWER to start';
  } else if (state.fault) {
    statusPill.textContent = 'DRY RUN FAULT';
    statusPill.className = 'pill fault';
    statusDetail.textContent = 'Add fluid water to tank';
  } else if (state.running) {
    statusPill.textContent = `CAVITATING ${state.powerPct}%`;
    statusPill.className = 'pill run';
    statusDetail.textContent = `Sonic clean at ${state.powerPct}% power`;
  } else if (state.heaterOn) {
    statusPill.textContent = 'HEATING';
    statusPill.className = 'pill open';
    statusDetail.textContent = `Warming to ${state.targetTemp}°C`;
  } else if (state.lidOpen) {
    statusPill.textContent = 'LID OPEN';
    statusPill.className = 'pill open';
    statusDetail.textContent = 'Tank lid open';
  } else {
    statusPill.textContent = 'BATH IDLE';
    statusPill.className = 'pill';
    statusDetail.textContent = 'Ready to load samples';
  }
}

// ─── PARTS EXPLORER ──────────────────────────────────────────────────────────

function populatePartsExplorer() {
  const list = document.getElementById('parts-list');
  list.innerHTML = '';
  const catalog = mdl.partCatalog;
  document.getElementById('parts-count').textContent =
    `${catalog.length} CAD assemblies registered`;

  // Group by category
  const groups = {};
  for (const part of catalog) {
    if (!groups[part.group]) groups[part.group] = [];
    groups[part.group].push(part);
  }

  for (const [groupName, parts] of Object.entries(groups)) {
    const header = document.createElement('div');
    header.className = 'part-item';
    header.style.fontWeight = 'bold';
    header.style.color = '#38bdf8';
    header.textContent = `── ${groupName} (${parts.length}) ──`;
    list.appendChild(header);

    for (const part of parts) {
      const item = document.createElement('div');
      item.className = 'part-item';
      item.innerHTML = `<span>${part.name}</span><span>🔍</span>`;
      item.onclick = () => focusPart(part.mesh);
      list.appendChild(item);
    }
  }
}

function focusPart(mesh) {
  state.focusedPart = mesh;
  sfx.playBeep(950);
  document.getElementById('parts-focus-status').textContent = `Focused: ${mesh.name}`;
  const wireMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true });
  allMeshes.forEach((m) => {
    m.material = m === mesh ? originalMaterials.get(m.uuid) : wireMat;
  });
  const worldPos = new THREE.Vector3();
  mesh.getWorldPosition(worldPos);
  controls.target.copy(worldPos);
  logEvent(`Part focus: ${mesh.name}`);
}

function clearPartFocus() {
  state.focusedPart = null;
  document.getElementById('parts-focus-status').textContent = 'No part focused';
  allMeshes.forEach((m) => {
    m.material = originalMaterials.get(m.uuid);
  });
}

// ─── RAYCASTING ──────────────────────────────────────────────────────────────

function onPointerDown(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(allMeshes, true);
  if (intersects.length > 0) {
    const hitMesh = intersects[0].object;
    let targetMesh = hitMesh;
    let keyId = null;
    let curr = hitMesh;
    while (curr && curr !== scene) {
      if (curr.userData && curr.userData.keyId) {
        keyId = curr.userData.keyId;
        targetMesh = curr;
        break;
      }
      curr = curr.parent;
    }
    const nm = (targetMesh.name || hitMesh.name || '').toLowerCase();

    if (keyId) {
      // Glow support
      const htmlId = keyId.startsWith('btn-') ? keyId : `btn-${keyId}`;
      state.pressed[htmlId] = true;
      flash3DButton(targetMesh, 0xffffff);

      // Actions
      if (keyId === 'power') togglePower();
      else if (keyId === 'start') handleStartStop();
      else if (keyId === 'degas') toggleDegas();
      else if (keyId === 'heat') toggleHeater();
      else if (keyId === 'btn-time-up' && state.powerOn) {
        state.timerSetMin = Math.min(60, state.timerSetMin + 1);
        state.timerSecRemaining = state.timerSetMin * 60;
        sfx.playBeep(900);
        drawLCD();
      } else if (keyId === 'btn-time-down' && state.powerOn) {
        state.timerSetMin = Math.max(1, state.timerSetMin - 1);
        state.timerSecRemaining = state.timerSetMin * 60;
        sfx.playBeep(900);
        drawLCD();
      } else if (keyId === 'btn-temp-up' && state.powerOn) {
        state.targetTemp = Math.min(80, state.targetTemp + 5);
        sfx.playBeep(900);
        drawLCD();
      } else if (keyId === 'btn-temp-down' && state.powerOn) {
        state.targetTemp = Math.max(20, state.targetTemp - 5);
        sfx.playBeep(900);
        drawLCD();
      }
    }
    // Handle lid click
    else if (nm.includes('lid') || nm.includes('hinge')) {
      toggleLid();
    }
    // Handle basket click
    else if (nm.includes('basket')) {
      if (state.basketLocation === 'bench') moveBasket();
      else liftBasket();
    }
  }
}

function onPointerUp(event) {
  // Clear all pressed states when mouse comes up
  for (const k of Object.keys(state.pressed)) {
    state.pressed[k] = false;
  }
}

function flash3DButton(mesh, colorHex) {
  const origZ = mesh.position.z;
  mesh.position.z += 0.006;
  if (mesh.userData.labelMesh) {
    mesh.userData.labelMesh.material.color.setHex(colorHex);
  }
  setTimeout(() => {
    mesh.position.z = origZ;
    if (mesh.userData.labelMesh) {
      mesh.userData.labelMesh.material.color.setHex(0xffffff);
    }
  }, 150);
}

// ─── STATE TOGGLES ───────────────────────────────────────────────────────────

function toggleLid() {
  if (state.basketLocation === 'raised' && !state.lidOpen) {
    alert('Cannot close lid while the basket is raised in the machine.');
    return;
  }
  state.lidOpen = !state.lidOpen;
  sfx.playBeep(850);
  const btn = document.getElementById('btn-open-lid');
  if (btn) btn.textContent = state.lidOpen ? 'Close Lid' : 'Open Lid (65° Hinge)';
  updateStatusPill();
  logEvent(state.lidOpen ? '3D Lid opened (65° hinged).' : '3D Lid closed flush.');
}

function moveBasket() {
  if (!state.lidOpen) return alert('Please open the lid first to move the basket.');
  const basinX = mdl.basinOffsetX || -0.48;
  
  if (state.basketLocation === 'bench') {
    state.basketLocation = 'raised';
    mdl.basket.position.set(basinX, 1.82, 0); // Position above bath
    logEvent('Basket moved from lab bench to machine (raised).');
  } else if (state.basketLocation === 'raised') {
    state.basketLocation = 'bench';
    mdl.basket.position.set(2.0, 0.0, -0.2); // Position on lab bench
    logEvent('Basket moved from machine to lab bench.');
  } else {
    alert('Basket must be raised before moving it to the bench.');
  }
  sfx.playBeep(750);
  updateBasketUI();
}

function liftBasket() {
  if (!state.lidOpen && state.basketLocation !== 'lowered') return alert('Please open the lid first to lift/lower the basket.');
  const basinX = mdl.basinOffsetX || -0.48;
  
  if (state.basketLocation === 'raised') {
    state.basketLocation = 'lowered';
    mdl.basket.position.set(basinX, 0.72, 0); // Lowered into bath
    logEvent('Basket lowered into fluid bath.');
  } else if (state.basketLocation === 'lowered') {
    if (!state.lidOpen) return alert('Lid must be open to raise the basket!');
    state.basketLocation = 'raised';
    mdl.basket.position.set(basinX, 1.82, 0);
    logEvent('Basket raised above bath.');
  } else {
    alert('Basket must be in the machine to lower it.');
  }
  sfx.playBeep(750);
  updateBasketUI();
}

function updateBasketUI() {
  const btnMove = document.getElementById('btn-move-basket');
  const btnLift = document.getElementById('btn-lift-basket');
  const btnLower = document.getElementById('btn-lower-basket');
  
  const updateBtns = (moveText, moveShow, liftText, liftShow) => {
    if (btnMove) {
      if (moveText) btnMove.textContent = moveText;
      btnMove.style.display = moveShow ? 'block' : 'none';
    }
    for (const b of [btnLift, btnLower]) {
      if (b) {
        if (liftText) b.textContent = liftText;
        b.style.display = liftShow ? 'block' : 'none';
      }
    }
  };

  if (state.basketLocation === 'bench') {
    updateBtns('Move Basket to Machine', true, 'Lower Basket into Bath', false);
  } else if (state.basketLocation === 'raised') {
    updateBtns('Return Basket to Bench', true, 'Lower Basket into Bath', true);
  } else if (state.basketLocation === 'lowered') {
    updateBtns('Return Basket to Bench', false, 'Raise Basket from Bath', true);
  }
}

function togglePower() {
  state.powerOn = !state.powerOn;
  sfx.playRelayClick();
  if (!state.powerOn) {
    state.running = false;
    state.heaterOn = false;
    sfx.setTransducerHum(false);
    if (mdl.cavitationParticles) mdl.cavitationParticles.visible = false;
  }
  drawLCD();
  updateStatusPill();
  logEvent(state.powerOn ? 'Mains power ON.' : 'Mains power OFF.');
}

function toggleDegas() {
  if (!state.powerOn) return;
  state.degas = !state.degas;
  sfx.playBeep(850);
  drawLCD();
  logEvent(state.degas ? 'Pulse degassing mode ENABLED.' : 'Pulse degassing mode DISABLED.');
}

function toggleHeater() {
  if (!state.powerOn) return;
  state.heaterOn = !state.heaterOn;
  sfx.playRelayClick();
  drawLCD();
  updateStatusPill();
  logEvent(state.heaterOn ? `Tank heater ON → Target ${state.targetTemp}°C.` : 'Tank heater OFF.');
}

function handleStartStop() {
  if (!state.powerOn) return;
  if (state.fault === 'DRY_RUN') {
    sfx.playFaultAlarm();
    logEvent('Cannot start: DRY RUN FAULT active!');
    return;
  }
  state.running = !state.running;
  sfx.playRelayClick();
  sfx.setTransducerHum(state.running, state.powerPct);
  if (mdl.cavitationParticles) mdl.cavitationParticles.visible = state.running;
  drawLCD();
  updateStatusPill();
  logEvent(state.running
    ? `Ultrasonic cycle started @ ${state.powerPct}% power.`
    : 'Ultrasonic cycle stopped.'
  );
}

// ─── CAVITATION PARTICLES ────────────────────────────────────────────────────

function updateCavitationParticles() {
  if (!mdl.cavitationParticles || !state.running) return;
  const pos = mdl.cavitationParticles.geometry.attributes.position.array;
  const count = pos.length / 3;
  for (let i = 0; i < count; i++) {
    pos[i * 3 + 1] += 0.003 * (state.powerPct / 100);
    pos[i * 3] += (Math.random() - 0.5) * 0.004;
    pos[i * 3 + 2] += (Math.random() - 0.5) * 0.004;
    if (pos[i * 3 + 1] > mdl.basinFloorY + 1.0) {
      pos[i * 3 + 1] = mdl.basinFloorY + 0.05;
      pos[i * 3] = mdl.basinOffsetX + (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
    }
  }
  mdl.cavitationParticles.geometry.attributes.position.needsUpdate = true;
  mdl.cavitationParticles.material.opacity = 0.85;
}

// ─── TOOLBAR EVENTS ──────────────────────────────────────────────────────────

function bindToolbarEvents() {
  // Explode — assembly-based
  document.getElementById('btn-explode').onclick = () => {
    state.exploded = !state.exploded;
    sfx.playBeep(800);
    document.getElementById('btn-explode').classList.toggle('active', state.exploded);

    for (const [key, group] of Object.entries(mdl.assemblies)) {
      const rest = mdl.restPositions[key];
      const offset = mdl.explodeOffsets[key];
      if (state.exploded) {
        group.position.copy(rest).add(offset);
      } else {
        group.position.copy(rest);
      }
    }
    logEvent(state.exploded ? 'Exploded CAD view enabled.' : 'Exploded view reset.');
  };

  // Wireframe
  document.getElementById('btn-wireframe').onclick = () => {
    state.wireframe = !state.wireframe;
    sfx.playBeep(800);
    document.getElementById('btn-wireframe').classList.toggle('active', state.wireframe);
    allMeshes.forEach((m) => {
      if (m.material && m.material.wireframe !== undefined) {
        m.material.wireframe = state.wireframe;
      }
    });
  };

  // Auto rotate
  document.getElementById('btn-auto-rotate').onclick = () => {
    state.autoRotate = !state.autoRotate;
    sfx.playBeep(800);
    document.getElementById('btn-auto-rotate').classList.toggle('active', state.autoRotate);
  };

  // Orbit speed
  document.getElementById('orbit-speed').oninput = (e) => {
    state.orbitSpeed = parseFloat(e.target.value);
    document.getElementById('orbit-speed-val').textContent = `${state.orbitSpeed.toFixed(1)}×`;
  };

  // Camera zoom
  document.getElementById('camera-zoom').oninput = (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('camera-zoom-val').textContent = `${Math.round(val)}%`;
    camera.position.setLength(6.5 - (val / 100) * 4.5);
  };

  // Lab lighting
  document.getElementById('lab-light').oninput = (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('lab-light-val').textContent = `${val.toFixed(1)}×`;
    dirLight.intensity = 0.95 * val;
    ambientLight.intensity = 0.5 * val;
  };

  // Light mood
  document.getElementById('lab-light-mood').onchange = (e) => {
    const mood = e.target.value;
    if (mood === 'bright') scene.background = new THREE.Color(0xdce6f0);
    else if (mood === 'dim') scene.background = new THREE.Color(0x1a2430);
    else if (mood === 'cool') scene.background = new THREE.Color(0xc0d2e8);
    else if (mood === 'warm') scene.background = new THREE.Color(0xd8cbb8);
    else scene.background = new THREE.Color(0xc5d0dc);
  };

  // View reset
  document.getElementById('btn-view-reset').onclick = () => {
    sfx.playBeep(700);
    camera.position.set(3.6, 3.5, -4.6);
    controls.target.set(-0.25, 1.75, -0.1);
    clearPartFocus();
  };

  // SFX mute
  document.getElementById('btn-sfx-mute').onclick = () => {
    const muted = sfx.toggleMute();
    document.getElementById('btn-sfx-mute').classList.toggle('active', muted);
  };

  // Parts clear
  document.getElementById('btn-parts-clear').onclick = clearPartFocus;

  // Showcase
  const runShowcase = () => startFullShowcase();
  document.getElementById('btn-full-showcase').onclick = runShowcase;
  document.getElementById('btn-showcase-panel').onclick = runShowcase;
}

// ─── KEYPAD EVENTS ───────────────────────────────────────────────────────────

function bindPanelEvents() {
  document.querySelectorAll(".panel-collapse-btn").forEach((btn) => {
    btn.onclick = () => {
      const targetId = btn.getAttribute("data-collapse");
      const panel = document.querySelector(`[data-panel="${targetId}"]`);
      if (!panel) return;
      const isCollapsed = panel.classList.contains("is-collapsed");
      panel.classList.toggle("is-collapsed", !isCollapsed);
      btn.title = isCollapsed ? "Collapse panel" : "Expand panel";
      // Force resize to fix any layout issues
      setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
    };
  });
}

function bindKeypadEvents() {
  const addPressListeners = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('mousedown', () => state.pressed[id] = true);
    el.addEventListener('mouseup', () => state.pressed[id] = false);
    el.addEventListener('mouseleave', () => state.pressed[id] = false);
  };
  ['btn-power', 'btn-start', 'btn-degas', 'btn-heat',
   'btn-temp-up', 'btn-temp-down', 'btn-time-up', 'btn-time-down',
   'btn-power-up', 'btn-power-down'].forEach(addPressListeners);

  document.getElementById('btn-power').onclick = togglePower;
  document.getElementById('btn-start').onclick = handleStartStop;
  document.getElementById('btn-degas').onclick = toggleDegas;
  document.getElementById('btn-heat').onclick = toggleHeater;

  document.getElementById('btn-temp-up').onclick = () => {
    if (!state.powerOn) return;
    state.targetTemp = Math.min(80, state.targetTemp + 5);
    sfx.playBeep(900);
    drawLCD();
  };
  document.getElementById('btn-temp-down').onclick = () => {
    if (!state.powerOn) return;
    state.targetTemp = Math.max(20, state.targetTemp - 5);
    sfx.playBeep(900);
    drawLCD();
  };
  document.getElementById('btn-time-up').onclick = () => {
    if (!state.powerOn) return;
    state.timerSetMin = Math.min(60, state.timerSetMin + 1);
    state.timerSecRemaining = state.timerSetMin * 60;
    sfx.playBeep(900);
    drawLCD();
  };
  document.getElementById('btn-time-down').onclick = () => {
    if (!state.powerOn) return;
    state.timerSetMin = Math.max(1, state.timerSetMin - 1);
    state.timerSecRemaining = state.timerSetMin * 60;
    sfx.playBeep(900);
    drawLCD();
  };
  document.getElementById('btn-power-up').onclick = () => {
    if (!state.powerOn) return;
    state.powerPct = Math.min(100, state.powerPct + 10);
    sfx.playBeep(950);
    if (state.running) sfx.setTransducerHum(true, state.powerPct);
    drawLCD();
  };
  document.getElementById('btn-power-down').onclick = () => {
    if (!state.powerOn) return;
    state.powerPct = Math.max(10, state.powerPct - 10);
    sfx.playBeep(950);
    if (state.running) sfx.setTransducerHum(true, state.powerPct);
    drawLCD();
  };

  document.getElementById('btn-open-lid').addEventListener('click', toggleLid);
  
  const btnMoveBasket = document.getElementById('btn-move-basket');
  if (btnMoveBasket) btnMoveBasket.addEventListener('click', moveBasket);
  
  const btnLiftBasket = document.getElementById('btn-lift-basket');
  if (btnLiftBasket) btnLiftBasket.addEventListener('click', liftBasket);

  document.getElementById('btn-quick-clean').onclick = () => {
    if (!state.powerOn) return;
    state.timerSetMin = 3;
    state.timerSecRemaining = 180;
    state.targetTemp = 50;
    state.powerPct = 100;
    state.heaterOn = true;
    state.running = true;
    sfx.playRelayClick();
    sfx.setTransducerHum(true, 100);
    if (mdl.cavitationParticles) mdl.cavitationParticles.visible = true;
    drawLCD();
    updateStatusPill();
    logEvent('Quick 3-minute 40kHz cleaning cycle launched.');
  };

  document.getElementById('btn-dry-run').onclick = () => {
    if (state.fault === 'DRY_RUN') {
      state.fault = null;
      logEvent('Fluid tank refilled. Dry-run fault CLEARED.');
    } else {
      state.fault = 'DRY_RUN';
      state.running = false;
      sfx.setTransducerHum(false);
      if (mdl.cavitationParticles) mdl.cavitationParticles.visible = false;
      sfx.playFaultAlarm();
      logEvent('DRY RUN FAULT TRIGGERED: Tank operates without fluid!');
    }
    drawLCD();
    updateStatusPill();
  };

  const loadSample = (type, desc) => {
    state.currentSampleType = type;
    state.sampleLoaded = true;
    state.cleanlinessPct = 0;
    sfx.playBeep(850);
    document.getElementById('material-desc').textContent = desc;
    rebuild3DSample(type);
    
    if (sampleGroup) {
      sampleGroup.visible = true;
      if (contaminantMesh) contaminantMesh.userData.setOpacity(0.9);
    }
    drawLCD();
    logEvent(`Sample loaded: ${type}`);
  };

  document.getElementById('btn-sample-grease').onclick = () => {
    loadSample('grease', 'Grease removal via 40 kHz acoustic cavitation shear forces.');
  };
  document.getElementById('btn-sample-flux').onclick = () => {
    loadSample('flux', 'Solder flux cleaning using pulse degassing and cavitation.');
  };
  document.getElementById('btn-sample-residue').onclick = () => {
    loadSample('residue', 'Chemical residue removal from cuvettes.');
  };

  // btn-unload-sample was removed in favor of the new dynamic basket workflow
}

// ─── SHOWCASE DEMO ───────────────────────────────────────────────────────────

function startFullShowcase() {
  logEvent('=== FULL SHOWCASE DEMO LAUNCHED ===');
  state.powerOn = true;
  state.fault = null;
  const basinX = mdl.basinOffsetX || -0.48;
  state.basketLocation = 'lowered';
  if (mdl.basket) mdl.basket.position.set(basinX, 0.72, 0);
  state.sampleLoaded = true;
  state.cleanlinessPct = 0;
  state.degas = true;
  state.heaterOn = true;
  state.targetTemp = 50;
  state.powerPct = 100;
  state.running = true;
  sfx.setTransducerHum(true, 100);
  if (mdl.cavitationParticles) mdl.cavitationParticles.visible = true;
  if (sampleGroup) {
    sampleGroup.visible = true;
    if (contaminantMesh) contaminantMesh.userData.setOpacity(0.9);
  }
  drawLCD();
  updateStatusPill();

  let step = 0;
  const timer = setInterval(() => {
    step++;
    if (step === 1) {
      logEvent('Showcase Step 1: Degassing complete. Ramping 40kHz cavitation.');
    } else if (step === 2) {
      state.degas = false;
      logEvent('Showcase Step 2: Cavitation dismantling contaminant layer.');
      drawLCD();
    } else if (step === 3) {
      state.cleanlinessPct = 100;
      state.running = false;
      sfx.setTransducerHum(false);
      if (mdl.cavitationParticles) mdl.cavitationParticles.visible = false;
      state.basketLocation = 'raised';
      if (mdl.basket) mdl.basket.position.set(basinX, 1.82, 0);
      if (contaminantMesh) contaminantMesh.userData.setOpacity(0.0);
      drawLCD();
      updateStatusPill();
      updateBasketUI();
      logEvent('Showcase Step 3: Cleaning complete! Sample 100% clean.');
      clearInterval(timer);
    }
  }, 3000);
}

// ─── RESIZE ──────────────────────────────────────────────────────────────────

function onResize() {
  const w = viewportEl.clientWidth || window.innerWidth;
  const h = viewportEl.clientHeight || window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

// ─── ANIMATION LOOP ──────────────────────────────────────────────────────────

function animateLoop() {
  requestAnimationFrame(animateLoop);

  // Smooth Lid Hinge Pivot Animation — positive rotation.x lifts front up
  const targetLidAngle = state.lidOpen ? (Math.PI * 100) / 180 : 0.0;
  if (mdl.lid) {
    mdl.lid.rotation.x += (targetLidAngle - mdl.lid.rotation.x) * 0.1;
  }

  // No physical knobs (replaced with up/down buttons) — skip rotation
  // if (mdl.knobTimer) { ... }
  // if (mdl.knobTemp) { ... }

  // Physical Button glowing (replaces old LEDs)
  if (mdl.buttons) {
    const updateBtn = (btnObj, active, pressed, glowHex) => {
      if (!btnObj || !btnObj.mesh) return;
      const faceMat = btnObj.faceMat || btnObj.mesh.userData.faceMat;
      if (!faceMat) return;
      
      const isLit = active || pressed;
      faceMat.emissive.setHex(isLit ? glowHex : 0x000000);
      faceMat.emissiveIntensity = isLit ? (pressed ? 4.0 : 2.5) : 0;
      if (btnObj.mesh.userData.halo) {
        btnObj.mesh.userData.halo.visible = isLit;
        btnObj.mesh.userData.haloMat.color.setHex(glowHex);
      }
    };
    updateBtn(mdl.buttons.power, state.powerOn, state.pressed['btn-power'], 0x10b981);
    updateBtn(mdl.buttons.start, state.running, state.pressed['btn-start'], 0xeab308);
    updateBtn(mdl.buttons.heat, state.heaterOn, state.pressed['btn-heat'], 0xef4444);
    updateBtn(mdl.buttons.degas, state.degas, state.pressed['btn-degas'], 0x3b82f6);

    updateBtn(mdl.buttons.timer_up, false, state.pressed['btn-time-up'], 0x60a5fa);
    updateBtn(mdl.buttons.timer_dn, false, state.pressed['btn-time-down'], 0x60a5fa);
    updateBtn(mdl.buttons.temp_up, false, state.pressed['btn-temp-up'], 0x60a5fa);
    updateBtn(mdl.buttons.temp_dn, false, state.pressed['btn-temp-down'], 0x60a5fa);
  }

  // Auto rotate
  if (state.autoRotate && modelRoot) {
    modelRoot.rotation.y += 0.005 * state.orbitSpeed;
  }

  // Timer countdown and cleaning progress
  if (state.running && state.timerSecRemaining > 0) {
    state.timerSecRemaining -= 0.016;
    if (state.basketLocation === 'lowered' && state.sampleLoaded && contaminantMesh) {
      state.cleanlinessPct = Math.min(100, state.cleanlinessPct + 1.0);
      contaminantMesh.userData.setOpacity(0.9 * (1.0 - state.cleanlinessPct / 100));
    }
    updateCavitationParticles();
    drawLCD();
  }

  // Heater temperature ramp
  if (state.heaterOn && state.currentTemp < state.targetTemp) {
    state.currentTemp += 0.03;
    drawLCD();
  }

  controls.update();
  renderer.render(scene, camera);
}

// ─── BOOT ────────────────────────────────────────────────────────────────────
init3D();
drawLCD();
  bindToolbarEvents();
  bindPanelEvents();
  bindKeypadEvents();
animateLoop();
