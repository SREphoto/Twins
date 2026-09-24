/**
 * Gold Standard App Controller for pH Meter Twin (app.js)
 * Loads the exact same 3D wet-lab room environment as centrifuge_twin via buildLabRoom.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { buildLabRoom, INSTRUMENT_BENCH } from '../../../centrifuge_twin/software/viewer/centrifuge3d.js?v=20260725-gold';
import { sfx } from './sfx.js';

// DOM
const viewportEl = document.getElementById('viewport3d');
const lcdCanvas = document.getElementById('lcd');
const lcdCtx = lcdCanvas.getContext('2d');
const statusPill = document.getElementById('status-pill');
const statusDetail = document.getElementById('status-detail');

// State Engine
const state = {
  mode: 'pH', // 'pH' or 'mV'
  probeDipped: false,
  solutionPH: 7.00,
  measuredPH: 7.00,
  measuredMV: 0.0,
  tempC: 25.0,
  autoRotate: false,
  orbitSpeed: 1.1,
  exploded: false,
  wireframe: false,
  focusedPart: null,
};

let scene, camera, renderer, controls;
let model, allMeshes = [], originalPositions = new Map(), originalMaterials = new Map();
let dirLight, fillLight, ambientLight;

function init3D() {
  const w = viewportEl.clientWidth || window.innerWidth;
  const h = viewportEl.clientHeight || window.innerHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc5d0dc);
  scene.fog = new THREE.Fog(0xd0d8e0, 32, 70);

  camera = new THREE.PerspectiveCamera(38, w / h, 0.05, 140);
  camera.position.set(-0.4 + 0.5, 0.95 + 0.4, 0.15 - 0.8);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  viewportEl.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(-0.4, 0.95 + 0.15, 0.15);
  controls.enableDamping = true;

  ambientLight = new THREE.AmbientLight(0xffffff, 0.5); scene.add(ambientLight);
  dirLight = new THREE.DirectionalLight(0xfff8f0, 0.95); dirLight.position.set(2, 16, -5); dirLight.castShadow = true; scene.add(dirLight);
  fillLight = new THREE.DirectionalLight(0xf0f6ff, 0.65); fillLight.position.set(0, 18, 0); scene.add(fillLight);

  const labRoot = new THREE.Group();
  scene.add(labRoot);
  const labInfo = buildLabRoom(labRoot);

  const loader = new GLTFLoader();
  loader.load(
    './models/ph_meter.glb',
    (gltf) => {
      model = gltf.scene;
      let count = 0;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true; child.receiveShadow = true;
          allMeshes.push(child);
          originalPositions.set(child.uuid, child.position.clone());
          originalMaterials.set(child.uuid, child.material);
          count++;
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.set(INSTRUMENT_BENCH.cx - center.x, labInfo.surfaceY - box.min.y, INSTRUMENT_BENCH.cz - center.z);
      scene.add(model);

      document.getElementById('viewport-status').textContent = `CAD Model loaded (${count} meshes) in centrifuge lab room.`;
      populatePartsExplorer();
    },
    (p) => {
      if (p.total) {
        const pct = Math.round((p.loaded / p.total) * 100);
        document.getElementById('viewport-status').textContent = `Loading CAD Model… ${pct}%`;
      }
    }
  );

  window.addEventListener('resize', onResize);
}

function computeNernstMV(ph, tempC) {
  const T_kelvin = tempC + 273.15;
  const nernstSlope = (2.303 * 8.314 * T_kelvin) / 96485.0 * 1000.0; // ~59.16 mV/pH at 25C
  return (7.00 - ph) * nernstSlope;
}

function drawLCD() {
  lcdCtx.fillStyle = '#020b14'; lcdCtx.fillRect(0, 0, 1024, 512);
  lcdCtx.fillStyle = '#00d4e8'; lcdCtx.font = 'bold 36px monospace';
  lcdCtx.fillText('PH-METER 2000-ATC', 40, 60);

  if (state.mode === 'pH') {
    lcdCtx.fillStyle = state.probeDipped ? '#3dd68c' : '#8b9bb0';
    lcdCtx.font = 'bold 96px monospace';
    lcdCtx.fillText(state.probeDipped ? state.measuredPH.toFixed(2) : '---', 40, 200);
    lcdCtx.font = 'bold 36px monospace'; lcdCtx.fillText('pH', 420, 200);
  } else {
    lcdCtx.fillStyle = state.probeDipped ? '#3dd68c' : '#8b9bb0';
    lcdCtx.font = 'bold 88px monospace';
    const mv = computeNernstMV(state.measuredPH, state.tempC);
    lcdCtx.fillText(state.probeDipped ? `${mv > 0 ? '+' : ''}${mv.toFixed(1)}` : '---', 40, 200);
    lcdCtx.font = 'bold 36px monospace'; lcdCtx.fillText('mV', 480, 200);
  }

  lcdCtx.fillStyle = '#38bdf8'; lcdCtx.font = 'bold 36px monospace';
  lcdCtx.fillText(`ATC TEMP: ${state.tempC.toFixed(1)}°C`, 40, 300);

  lcdCtx.fillStyle = state.probeDipped ? '#3dd68c' : '#f0b429';
  lcdCtx.fillText(state.probeDipped ? 'ELECTRODE SUBMERGED · STABLE' : 'ELECTRODE AIR · DIP TO READ', 40, 380);

  lcdCtx.strokeStyle = '#1e3a5f'; lcdCtx.lineWidth = 12; lcdCtx.strokeRect(10, 10, 1004, 492);
}

function updateStatusPill() {
  if (state.probeDipped) {
    statusPill.textContent = 'MEASURING'; statusPill.className = 'pill run';
    statusDetail.textContent = `Reading ${state.mode}: ${state.mode === 'pH' ? state.measuredPH.toFixed(2) : computeNernstMV(state.measuredPH, state.tempC).toFixed(1) + ' mV'}`;
  } else {
    statusPill.textContent = 'PROBE AIR'; statusPill.className = 'pill open';
    statusDetail.textContent = 'Dip probe into solution';
  }
}

function populatePartsExplorer() {
  const list = document.getElementById('parts-list');
  list.innerHTML = '';
  document.getElementById('parts-count').textContent = `${allMeshes.length} assemblies registered`;
  allMeshes.forEach((mesh, idx) => {
    const item = document.createElement('div'); item.className = 'part-item';
    item.innerHTML = `<span>${idx + 1}. ${mesh.name || 'Component'}</span><span>🔍</span>`;
    item.onclick = () => focusPart(mesh);
    list.appendChild(item);
  });
}

function focusPart(mesh) {
  state.focusedPart = mesh;
  document.getElementById('parts-focus-status').textContent = `Focused: ${mesh.name}`;
  const wireMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true });
  allMeshes.forEach((m) => { m.material = m === mesh ? originalMaterials.get(m.uuid) : wireMat; });
  const worldPos = new THREE.Vector3(); mesh.getWorldPosition(worldPos); controls.target.copy(worldPos);
}

function clearPartFocus() {
  state.focusedPart = null; document.getElementById('parts-focus-status').textContent = 'No part focused';
  allMeshes.forEach((m) => { m.material = originalMaterials.get(m.uuid); });
}

function bindToolbarEvents() {
  document.getElementById('btn-explode').onclick = () => {
    state.exploded = !state.exploded;
    document.getElementById('btn-explode').classList.toggle('active', state.exploded);
    allMeshes.forEach((m) => {
      const orig = originalPositions.get(m.uuid); if (!orig) return;
      m.position.copy(orig).add(state.exploded ? orig.clone().normalize().multiplyScalar(0.08) : new THREE.Vector3());
    });
  };

  document.getElementById('btn-wireframe').onclick = () => {
    state.wireframe = !state.wireframe;
    document.getElementById('btn-wireframe').classList.toggle('active', state.wireframe);
    allMeshes.forEach((m) => { if (m.material) m.material.wireframe = state.wireframe; });
  };

  document.getElementById('btn-auto-rotate').onclick = () => {
    state.autoRotate = !state.autoRotate;
    document.getElementById('btn-auto-rotate').classList.toggle('active', state.autoRotate);
  };

  document.getElementById('orbit-speed').oninput = (e) => {
    state.orbitSpeed = parseFloat(e.target.value);
    document.getElementById('orbit-speed-val').textContent = `${state.orbitSpeed.toFixed(1)}×`;
  };

  document.getElementById('camera-zoom').oninput = (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('camera-zoom-val').textContent = `${Math.round(val)}%`;
    camera.position.setLength(6.5 - (val / 100) * 4.5);
  };

  document.getElementById('lab-light').oninput = (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('lab-light-val').textContent = `${val.toFixed(1)}×`;
    dirLight.intensity = 0.95 * val; ambientLight.intensity = 0.5 * val;
  };

  document.getElementById('btn-view-reset').onclick = () => {
    camera.position.set(-0.4 + 0.5, 0.95 + 0.4, 0.15 - 0.8);
    controls.target.set(-0.4, 0.95 + 0.15, 0.15);
    clearPartFocus();
  };

  document.getElementById('btn-parts-clear').onclick = clearPartFocus;
}

function bindKeypadEvents() {
  document.getElementById('btn-mode').onclick = () => {
    state.mode = state.mode === 'pH' ? 'mV' : 'pH';
    sfx.beep(900); drawLCD(); updateStatusPill();
  };

  document.getElementById('btn-dip-probe').onclick = () => {
    state.probeDipped = !state.probeDipped;
    sfx.beep(700); drawLCD(); updateStatusPill();
    const log = document.getElementById('clean-log');
    log.textContent = state.probeDipped ? `Electrode submerged into solution.\n` + log.textContent : `Electrode removed to air.\n` + log.textContent;
  };

  document.getElementById('solution-select').onchange = (e) => {
    state.measuredPH = parseFloat(e.target.value);
    sfx.beep(850); drawLCD(); updateStatusPill();
    const log = document.getElementById('clean-log');
    log.textContent = `Solution changed to pH ${state.measuredPH.toFixed(2)}.\n` + log.textContent;
  };
}

function onResize() {
  const w = viewportEl.clientWidth || window.innerWidth;
  const h = viewportEl.clientHeight || window.innerHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
}

function animateLoop() {
  requestAnimationFrame(animateLoop);
  if (state.autoRotate && model) model.rotation.y += 0.005 * state.orbitSpeed;
  controls.update(); renderer.render(scene, camera);
}

init3D(); drawLCD(); bindToolbarEvents(); bindKeypadEvents(); animateLoop();
