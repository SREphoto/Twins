/**
 * Vacuum Pump App Logic & UI Binding
 * Clientside state machine and physics model mirroring the Python controller.
 */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  createVacuumPumpModel,
  buildLabRoom,
  setExplodeAmount,
  setWireframe,
  updateAnimations
} from "./vacuum_pump3d.js?v=20260729-3";
import {
  playClick,
  playKnobTick,
  startMotorHum,
  updateMotorPitch,
  stopMotorHum,
  setGasBallastSound,
  startAlarm,
  stopAlarm
} from "./sfx.js?v=20260729-3";

// State Mirror
const STATE = {
  state: "OFF", // OFF, IDLE, STARTING, RUNNING, RUNNING_BALLAST, STOPPING, FAULT_OVERHEAT
  power_on: false,
  gas_ballast_open: false,
  system_vacuum_mbar: 1013.0,
  motor_speed_rpm: 0.0,
  target_rpm: 1500.0,
  motor_temp_c: 22.0,
  ambient_temp_c: 22.0,
  overheat_temp_c: 130.0,
  reset_temp_c: 80.0,
  ultimate_vacuum_mbar: 80.0,
  max_flow_lmin: 15.0
};

// ThreeJS Globals
let scene, camera, renderer, controls, pumpModel;
let raycaster, mouse;
let clock;
let ambientLight, dirLight, dirLight2;

// Real-time Graph Variables
let graphCanvas, graphCtx;
const pressureHistory = [];
const maxHistoryPoints = 150;

// Explode and Wireframe state
let explodeVal = 0.0;
let wireframeVal = false;

// Initialize App
function init() {
  // 1. Three.js Scene Setup
  const container = document.getElementById("canvas-container");
  if (!container) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa8b4c2);

  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    50
  );
  camera.position.set(0, 2.2, 3.2);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.8, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't go under floor
  controls.minDistance = 1.0;
  controls.maxDistance = 10.0;

  // Lights
  ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(2, 4, 3);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  dirLight2 = new THREE.DirectionalLight(0xb8d4ff, 0.4);
  dirLight2.position.set(-3, 2, -2);
  scene.add(dirLight2);

  // 2. Build Scene
  const labRoom = buildLabRoom();
  if (labRoom) scene.add(labRoom);

  pumpModel = createVacuumPumpModel();
  if (pumpModel) scene.add(pumpModel);

  // Update status text
  const vpStatus = document.getElementById("viewport-status");
  if (vpStatus) vpStatus.textContent = "Procedural CAD model loaded.";

  // Raycasting for picking
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  window.addEventListener("click", onDocumentClick, false);

  clock = new THREE.Clock();

  // 3. UI Event Listeners
  const pwrBtn = document.getElementById("key-power");
  if (pwrBtn) pwrBtn.addEventListener("click", togglePower);
  
  const ballastBtn = document.getElementById("key-ballast");
  if (ballastBtn) ballastBtn.addEventListener("click", toggleBallast);
  
  const faultBtn = document.getElementById("btn-fault");
  if (faultBtn) faultBtn.addEventListener("click", injectFault);

  const explodeBtn = document.getElementById("btn-explode");
  if (explodeBtn) {
    let exploded = false;
    explodeBtn.addEventListener("click", () => {
      exploded = !exploded;
      explodeVal = exploded ? 1.0 : 0.0;
      setExplodeAmount(explodeVal);
      explodeBtn.classList.toggle("active", exploded);
    });
  }

  const wireframeBtn = document.getElementById("btn-wireframe");
  if (wireframeBtn) {
    wireframeBtn.addEventListener("click", () => {
      wireframeVal = !wireframeVal;
      setWireframe(wireframeVal);
      wireframeBtn.classList.toggle("active", wireframeVal);
    });
  }

  // Topbar Controls (Orbit, Zoom, Light, Mood)
  const orbitSpeedInput = document.getElementById("orbit-speed");
  const orbitSpeedVal = document.getElementById("orbit-speed-val");
  if (orbitSpeedInput) {
    orbitSpeedInput.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      controls.autoRotate = val > 0;
      controls.autoRotateSpeed = val * 2.0;
      if (orbitSpeedVal) orbitSpeedVal.textContent = `${val.toFixed(1)}×`;
    });
  }

  const cameraZoomInput = document.getElementById("camera-zoom");
  const cameraZoomVal = document.getElementById("camera-zoom-val");
  if (cameraZoomInput) {
    cameraZoomInput.addEventListener("input", (e) => {
      const pct = parseFloat(e.target.value);
      // Map 0-100% to distance 8.0 -> 1.5
      const dist = 8.0 - (pct / 100.0) * 6.5;
      const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      camera.position.copy(controls.target).addScaledVector(dir, dist);
      if (cameraZoomVal) cameraZoomVal.textContent = `${Math.round(pct)}%`;
    });
  }

  const labLightInput = document.getElementById("lab-light");
  const labLightVal = document.getElementById("lab-light-val");
  if (labLightInput) {
    labLightInput.addEventListener("input", (e) => {
      const mult = parseFloat(e.target.value);
      ambientLight.intensity = 0.4 * mult;
      dirLight.intensity = 0.8 * mult;
      if (labLightVal) labLightVal.textContent = `${mult.toFixed(2)}×`;
    });
  }

  const labLightMoodSelect = document.getElementById("lab-light-mood");
  if (labLightMoodSelect) {
    labLightMoodSelect.addEventListener("change", (e) => {
      const mood = e.target.value;
      if (mood === "bright") {
        scene.background.setHex(0xd0dcfa);
        ambientLight.color.setHex(0xffffff);
      } else if (mood === "dim") {
        scene.background.setHex(0x181c24);
        ambientLight.color.setHex(0x8899ac);
      } else if (mood === "cool") {
        scene.background.setHex(0x8fa4c4);
        ambientLight.color.setHex(0x90b0e0);
      } else if (mood === "warm") {
        scene.background.setHex(0xbfa894);
        ambientLight.color.setHex(0xffe0c0);
      } else {
        scene.background.setHex(0xa8b4c2);
        ambientLight.color.setHex(0xffffff);
      }
    });
  }

  // Graph init
  graphCanvas = document.getElementById("pressure-graph");
  if (graphCanvas) {
    graphCtx = graphCanvas.getContext("2d");
  }

  // Demo button
  const demoBtn = document.getElementById("btn-demo");
  if (demoBtn) {
    demoBtn.addEventListener("click", runEducationalDemo);
  }

  window.addEventListener("resize", onWindowResize, false);

  // Start loop
  animate();
}

// 3D Raycasting / Mouse Pick
function onDocumentClick(event) {
  if (!pumpModel) return;
  const container = document.getElementById("canvas-container");
  if (!container) return;

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(pumpModel.children, true);

  if (intersects.length > 0) {
    let obj = intersects[0].object;
    while (obj && obj !== pumpModel) {
      if (obj.name === "Btn_Power" || obj.name === "switch_power") {
        togglePower();
        break;
      }
      if (obj.name === "Knob_GasBallast" || obj.name === "knob_ballast") {
        toggleBallast();
        break;
      }
      obj = obj.parent;
    }
  }
}

// Window resize
function onWindowResize() {
  const container = document.getElementById("canvas-container");
  if (!container || !camera || !renderer) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// State toggles
function togglePower() {
  STATE.power_on = !STATE.power_on;
  playClick();
  if (STATE.power_on) {
    if (STATE.state === "OFF") STATE.state = "IDLE";
    startMotorHum();
  } else {
    STATE.state = "STOPPING";
  }
}

function toggleBallast() {
  STATE.gas_ballast_open = !STATE.gas_ballast_open;
  playClick();
  setGasBallastSound(STATE.gas_ballast_open);
}

function injectFault() {
  playClick();
  STATE.motor_temp_c = STATE.overheat_temp_c + 1.0;
  STATE.state = "FAULT_OVERHEAT";
  startAlarm();
}

// Physics Loop (Mirroring Python Controller)
function tickPhysics(dt) {
  // 1. Temperature Simulation
  if (["STARTING", "RUNNING", "RUNNING_BALLAST"].includes(STATE.state)) {
    const rpmRatio = STATE.motor_speed_rpm / 3000.0;
    const heatingRate = 1.2 * (rpmRatio ** 2) + 0.2;
    STATE.motor_temp_c += heatingRate * dt;
  } else {
    // Cooling towards ambient
    const coolingRate = 0.5;
    if (STATE.motor_temp_c > STATE.ambient_temp_c) {
      STATE.motor_temp_c = Math.max(STATE.ambient_temp_c, STATE.motor_temp_c - coolingRate * dt);
    }
  }

  // 2. Overheat protection interlock
  if (STATE.motor_temp_c >= STATE.overheat_temp_c && STATE.state !== "FAULT_OVERHEAT") {
    STATE.state = "FAULT_OVERHEAT";
    STATE.power_on = false;
    startAlarm();
  }

  // Auto-reset fault when cooled down
  if (STATE.state === "FAULT_OVERHEAT" && STATE.motor_temp_c <= STATE.reset_temp_c) {
    STATE.state = "OFF";
    stopAlarm();
  }

  // 3. State Machine Transitions
  if (STATE.state === "FAULT_OVERHEAT") {
    STATE.motor_speed_rpm = Math.max(0.0, STATE.motor_speed_rpm - 800.0 * dt);
    // Pressure leaks back to atmospheric
    STATE.system_vacuum_mbar = Math.min(1013.0, STATE.system_vacuum_mbar + 150.0 * dt);
  } else if (!STATE.power_on) {
    if (STATE.motor_speed_rpm > 0) {
      STATE.state = "STOPPING";
      STATE.motor_speed_rpm = Math.max(0.0, STATE.motor_speed_rpm - 600.0 * dt);
    } else {
      STATE.state = "OFF";
    }
    // Pressure leaks slowly back to atmospheric when off
    STATE.system_vacuum_mbar = Math.min(1013.0, STATE.system_vacuum_mbar + 50.0 * dt);
    stopMotorHum();
  } else {
    // Power is ON
    if (STATE.motor_speed_rpm < STATE.target_rpm) {
      STATE.state = "STARTING";
      STATE.motor_speed_rpm = Math.min(STATE.target_rpm, STATE.motor_speed_rpm + 500.0 * dt);
    } else {
      STATE.state = STATE.gas_ballast_open ? "RUNNING_BALLAST" : "RUNNING";
    }

    // Audio pitch
    updateMotorPitch(STATE.motor_speed_rpm / 1500.0);

    // Evacuation simulation
    if (STATE.motor_speed_rpm > 200.0) {
      const targetVac = STATE.gas_ballast_open ? 120.0 : STATE.ultimate_vacuum_mbar;
      const evacRate = 180.0 * (STATE.motor_speed_rpm / 1500.0);
      if (STATE.system_vacuum_mbar > targetVac) {
        STATE.system_vacuum_mbar = Math.max(targetVac, STATE.system_vacuum_mbar - evacRate * dt);
      } else if (STATE.system_vacuum_mbar < targetVac) {
        // Ballast admitted air, pressure rises to targetVac
        STATE.system_vacuum_mbar = Math.min(targetVac, STATE.system_vacuum_mbar + 100.0 * dt);
      }
    }
  }
}

function getFlowRate() {
  if (STATE.motor_speed_rpm <= 100.0) return 0.0;
  const pRatio = (STATE.system_vacuum_mbar - STATE.ultimate_vacuum_mbar) / (1013.0 - STATE.ultimate_vacuum_mbar);
  const speedFactor = STATE.motor_speed_rpm / 1500.0;
  return Math.max(0.0, STATE.max_flow_lmin * speedFactor * Math.max(0, Math.min(1, pRatio)));
}

// Update LCD HTML display
function updateDisplay() {
  const dispVac = document.getElementById("disp-vacuum");
  if (dispVac) dispVac.textContent = Math.round(STATE.system_vacuum_mbar);

  const dispRpm = document.getElementById("disp-rpm");
  if (dispRpm) dispRpm.textContent = Math.round(STATE.motor_speed_rpm);

  const dispTemp = document.getElementById("disp-temp");
  if (dispTemp) dispTemp.textContent = STATE.motor_temp_c.toFixed(1);

  const dispBallast = document.getElementById("disp-ballast");
  if (dispBallast) dispBallast.textContent = STATE.gas_ballast_open ? "OPEN" : "CLOSED";

  // Status pills
  const pill = document.getElementById("status-pill");
  if (pill) {
    pill.textContent = STATE.state;
    pill.className = "pill";
    if (STATE.state === "FAULT_OVERHEAT") pill.classList.add("fault");
    else if (["RUNNING", "RUNNING_BALLAST"].includes(STATE.state)) pill.classList.add("run");
    else if (["IDLE", "STARTING"].includes(STATE.state)) pill.classList.add("open");
  }

  const detail = document.getElementById("status-detail");
  if (detail) {
    if (STATE.state === "OFF") detail.textContent = "Powered down";
    else if (STATE.state === "RUNNING") detail.textContent = `Pumping down system (${getFlowRate().toFixed(1)} L/min)...`;
    else if (STATE.state === "RUNNING_BALLAST") detail.textContent = "Gas ballast active (purging condensables)";
    else if (STATE.state === "FAULT_OVERHEAT") detail.textContent = "OVERHEAT FAULT: Motor > 130°C";
    else detail.textContent = "Ready for operation";
  }
}

// Draw scrolling pressure graph
function drawGraph() {
  if (!graphCtx || !graphCanvas) return;

  pressureHistory.push(STATE.system_vacuum_mbar);
  if (pressureHistory.length > maxHistoryPoints) {
    pressureHistory.shift();
  }

  const w = graphCanvas.width;
  const h = graphCanvas.height;
  graphCtx.clearRect(0, 0, w, h);

  // Grid lines
  graphCtx.strokeStyle = "#1a2536";
  graphCtx.lineWidth = 1;
  for (let y = 0; y < h; y += 30) {
    graphCtx.beginPath();
    graphCtx.moveTo(0, y);
    graphCtx.lineTo(w, y);
    graphCtx.stroke();
  }

  // Plot pressure curve
  graphCtx.strokeStyle = "#00d4e8";
  graphCtx.lineWidth = 2.5;
  graphCtx.beginPath();

  for (let i = 0; i < pressureHistory.length; i++) {
    const x = (i / maxHistoryPoints) * w;
    // Map 1013 mbar -> h-5, 80 mbar -> 5
    const norm = (pressureHistory[i] - 80.0) / (1013.0 - 80.0);
    const y = 5 + norm * (h - 10);
    if (i === 0) graphCtx.moveTo(x, y);
    else graphCtx.lineTo(x, y);
  }
  graphCtx.stroke();
}

// Animate render loop
function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(0.1, clock ? clock.getDelta() : 0.016);
  tickPhysics(dt);

  updateAnimations(dt, STATE);

  updateDisplay();
  drawGraph();

  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}

// Guided Student Demo
async function runEducationalDemo() {
  const vpStatus = document.getElementById("viewport-status");

  if (vpStatus) vpStatus.textContent = "Demo Step 1: Soft-Start Ramp. Motor accelerating to 1500 RPM.";
  STATE.power_on = true;
  STATE.state = "STARTING";
  startMotorHum();

  await sleep(3500);

  if (vpStatus) vpStatus.textContent = "Demo Step 2: Rapid Evacuation. Diaphragms pumping in counter-phase down to vacuum.";

  await sleep(6000);

  if (vpStatus) vpStatus.textContent = "Demo Step 3: Gas Ballast Venting. Admitting air to purge condensables.";
  STATE.gas_ballast_open = true;
  setGasBallastSound(true);

  await sleep(6000);

  if (vpStatus) vpStatus.textContent = "Demo Step 4: Deep Vacuum. Closing ballast, reaching ultimate 80 mbar limit.";
  STATE.gas_ballast_open = false;
  setGasBallastSound(false);

  await sleep(6000);

  if (vpStatus) vpStatus.textContent = "Demo Step 5: Thermal Overload Fault. Simulating overheat > 130°C.";
  injectFault();

  await sleep(7000);

  if (vpStatus) vpStatus.textContent = "Demo Step 6: Reset & Shut Down. Motor cooled, returning to idle.";
  STATE.power_on = false;
  STATE.motor_temp_c = 22.0;
  STATE.state = "OFF";
  stopAlarm();
  if (vpStatus) vpStatus.textContent = "Demo complete! Procedural CAD model active.";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start
init();
