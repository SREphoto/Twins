import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Hyper-Detailed Procedural Vacuum Pump (KNF N820)
// ---------------------------------------------------------------------------
const matHousing = new THREE.MeshStandardMaterial({ color: 0x333338, roughness: 0.7, metalness: 0.1 });
const matAlum = new THREE.MeshStandardMaterial({ color: 0x99999e, roughness: 0.3, metalness: 0.8 });
const matSteel = new THREE.MeshStandardMaterial({ color: 0xb3b3b8, roughness: 0.2, metalness: 0.9 });
const matPTFE = new THREE.MeshStandardMaterial({ color: 0xf0f0ee, roughness: 0.35, metalness: 0.0 });
const matRubber = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.9, metalness: 0.0 });
const matFFPM = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.75, metalness: 0.0 });
const matCopper = new THREE.MeshStandardMaterial({ color: 0xcc6633, roughness: 0.25, metalness: 0.9 });

function box(w, h, d, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
function cyl(rT, rB, h, mat, segs = 32) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, segs), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

let pumpGroup = new THREE.Group();
let motorShaftGroup = new THREE.Group();
let leftRodGroup = new THREE.Group();
let rightRodGroup = new THREE.Group();
let leftDiaphragm, rightDiaphragm;
let gaugeNeedle;
let animState = { explode: 0 };

function createScrew(length, radius=2) {
  const group = new THREE.Group();
  const head = cyl(radius, radius, radius, matSteel, 16);
  head.position.y = length / 2;
  const hex = cyl(radius*0.6, radius*0.6, radius*1.1, new THREE.MeshStandardMaterial({color:0x111111}), 6);
  hex.position.y = length / 2 + 0.1;
  const thread = cyl(radius*0.5, radius*0.5, length, matSteel, 8);
  group.add(head);
  group.add(hex);
  group.add(thread);
  return group;
}

function buildMotor() {
  const motor = new THREE.Group();
  
  // Stator
  const stator = cyl(42, 42, 90, matAlum, 32);
  stator.rotation.z = Math.PI / 2;
  stator.position.y = 76;
  motor.add(stator);

  // Copper Windings
  const windings = cyl(35, 35, 120, matCopper, 32);
  windings.rotation.z = Math.PI / 2;
  windings.position.y = 76;
  motor.add(windings);

  // Rotor Shaft
  const shaft = cyl(6, 6, 160, matSteel, 16);
  shaft.rotation.z = Math.PI / 2;
  motorShaftGroup.add(shaft);

  // Rear Cooling Fan
  const fan = new THREE.Group();
  const hub = cyl(8, 8, 10, matHousing, 16);
  hub.rotation.z = Math.PI / 2;
  fan.add(hub);
  for(let i=0; i<7; i++) {
    const blade = box(4, 30, 2, matHousing);
    blade.position.y = 15;
    blade.rotation.x = 0.4;
    const pivot = new THREE.Group();
    pivot.rotation.x = (i / 7) * Math.PI * 2;
    pivot.add(blade);
    fan.add(pivot);
  }
  fan.position.set(-65, 0, 0);
  motorShaftGroup.add(fan);

  // Eccentric Cams
  const frontCam = cyl(14, 14, 12, matSteel, 24);
  frontCam.rotation.z = Math.PI / 2;
  frontCam.position.set(48, 4, 0); 
  const backCam = cyl(14, 14, 12, matSteel, 24);
  backCam.rotation.z = Math.PI / 2;
  backCam.position.set(-48, -4, 0); 

  motorShaftGroup.add(frontCam);
  motorShaftGroup.add(backCam);
  motorShaftGroup.position.y = 76;
  
  motor.add(motorShaftGroup);
  return motor;
}

function buildHeadStack(isFront) {
  const head = new THREE.Group();
  const dir = isFront ? 1 : -1;
  const cx = dir * 48;

  // Connecting Rod & Bearings
  const rod = new THREE.Group();
  const rodBody = box(10, 60, 10, matAlum);
  rodBody.position.y = 30;
  const rodBearing = cyl(16, 16, 10, matSteel, 24);
  rodBearing.rotation.z = Math.PI / 2;
  rod.add(rodBearing);
  rod.add(rodBody);
  
  const targetGroup = isFront ? leftRodGroup : rightRodGroup;
  targetGroup.add(rod);
  targetGroup.position.set(cx, 76, 0);
  head.add(targetGroup);

  // Base Block
  const baseBlock = box(60, 20, 60, matAlum);
  baseBlock.position.set(cx, 140, 0);
  head.add(baseBlock);

  // Diaphragm
  const diaphragm = new THREE.Group();
  for(let i=0; i<4; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(8 + i*4, 1.5, 16, 32), matRubber);
    ring.rotation.x = Math.PI / 2;
    diaphragm.add(ring);
  }
  const centerDisc = cyl(8, 8, 2, matSteel, 16);
  diaphragm.add(centerDisc);
  diaphragm.position.set(cx, 153, 0);
  head.add(diaphragm);
  if (isFront) leftDiaphragm = diaphragm;
  else rightDiaphragm = diaphragm;

  // Shim Ring
  const shim = cyl(12, 12, 1, matSteel, 32);
  shim.position.set(cx, 154, 0);
  shim.userData = { explodeOffset: new THREE.Vector3(0, 5, 0) };
  head.add(shim);

  // Intermediate Plate
  const intPlate = cyl(28, 28, 12, matPTFE, 32);
  intPlate.position.set(cx, 161, 0);
  intPlate.userData = { explodeOffset: new THREE.Vector3(0, 15, 0) };
  head.add(intPlate);

  // Poppet Valves (4 per head)
  for(let v of [{x:8,z:8},{x:-8,z:8},{x:8,z:-8},{x:-8,z:-8}]) {
    const poppet = cyl(5, 3, 3, matFFPM, 16);
    poppet.position.set(cx + v.x, 168.5, v.z);
    poppet.userData = { explodeOffset: new THREE.Vector3(0, 25, 0) };
    head.add(poppet);
  }

  // Head Cover
  const headCover = cyl(28, 28, 16, matPTFE, 32);
  headCover.position.set(cx, 175, 0);
  headCover.userData = { explodeOffset: new THREE.Vector3(0, 35, 0) };
  head.add(headCover);

  // Gas Port Stubs
  const port1 = cyl(6, 6, 10, matPTFE, 16);
  port1.rotation.z = Math.PI/2;
  port1.position.set(cx + dir*25, 175, 0);
  port1.userData = { explodeOffset: new THREE.Vector3(0, 35, 0) };
  head.add(port1);

  // Pressure Plate
  const pressurePlate = cyl(25, 25, 3, matAlum, 32);
  pressurePlate.position.set(cx, 184.5, 0);
  pressurePlate.userData = { explodeOffset: new THREE.Vector3(0, 45, 0) };
  head.add(pressurePlate);

  // Top Screws (M4)
  for(let i=0; i<4; i++) {
    const screw = createScrew(20, 2);
    const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
    screw.position.set(cx + Math.cos(angle)*20, 185, Math.sin(angle)*20);
    screw.userData = { explodeOffset: new THREE.Vector3(0, 60, 0) };
    head.add(screw);
  }

  return head;
}

function buildHousing() {
  const housing = new THREE.Group();

  // Lower Housing with Ribs
  const lowerGeo = new THREE.BoxGeometry(160, 130, 240);
  const lower = new THREE.Mesh(lowerGeo, matHousing);
  lower.position.y = 80;
  housing.add(lower);
  
  // Ventilation slots (Boolean pseudo)
  for(let i=0; i<4; i++) {
    const rib = box(162, 10, 40, matHousing);
    rib.position.set(0, 50 + i*15, -60);
    housing.add(rib);
  }

  // Upper Housing
  const upper = box(160, 60, 240, matHousing);
  upper.position.y = 175;
  housing.add(upper);

  // Carry Handle
  const handle = box(30, 15, 200, matHousing);
  handle.position.y = 212.5;
  housing.add(handle);

  // Rubber Feet
  for(let x of [-70, 70]) {
    for(let z of [-100, 100]) {
      const foot = cyl(10, 10, 15, matRubber, 16);
      foot.position.set(x, 7.5, z);
      housing.add(foot);
    }
  }

  // Front Panel
  const panel = box(140, 80, 5, matAlum);
  panel.position.set(0, 86, 120);
  panel.rotation.x = -15 * THREE.MathUtils.DEG2RAD;
  housing.add(panel);

  // Power Switch
  const switchBox = box(20, 12, 15, matHousing);
  switchBox.position.set(-40, 86, 122);
  switchBox.rotation.x = -15 * THREE.MathUtils.DEG2RAD;
  switchBox.name = "Btn_Power";
  housing.add(switchBox);

  // Ballast Knob
  const ballast = cyl(10, 10, 10, matHousing, 16);
  ballast.rotation.x = Math.PI / 2;
  ballast.position.set(40, 86, 122);
  ballast.name = "Knob_GasBallast";
  housing.add(ballast);

  // Analog Gauge
  const gaugeGroup = new THREE.Group();
  const bezel = cyl(25, 25, 10, matSteel, 32);
  bezel.rotation.x = Math.PI / 2;
  gaugeGroup.add(bezel);
  
  const dial = cyl(23, 23, 11, matPTFE, 32);
  dial.rotation.x = Math.PI / 2;
  gaugeGroup.add(dial);
  
  gaugeNeedle = box(2, 20, 1, matHousing);
  gaugeNeedle.position.set(0, 0, 6);
  gaugeGroup.add(gaugeNeedle);

  gaugeGroup.position.set(0, 110, 115);
  gaugeGroup.rotation.x = -15 * THREE.MathUtils.DEG2RAD;
  housing.add(gaugeGroup);

  return housing;
}

export function createVacuumPumpModel() {
  pumpGroup.add(buildMotor());
  pumpGroup.add(buildHeadStack(true));
  pumpGroup.add(buildHeadStack(false));
  pumpGroup.add(buildHousing());

  pumpGroup.scale.set(0.1, 0.1, 0.1); 
  return pumpGroup;
}

export function buildLabRoom() {
  const room = new THREE.Group();
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  room.add(floor);

  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(100, 5, 80),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 })
  );
  desk.position.set(0, -2.5, 0);
  room.add(desk);

  return room;
}

export function updateAnimations(dt, state) {
  const rps = state.motor_speed_rpm / 60.0;
  const rotStep = rps * Math.PI * 2 * dt;
  motorShaftGroup.rotation.x -= rotStep; 

  const angle = Math.abs(motorShaftGroup.rotation.x);
  
  const dispFront = Math.sin(angle) * 4;
  const dispBack = Math.sin(angle + Math.PI) * 4;

  leftRodGroup.position.y = 76 + dispFront;
  rightRodGroup.position.y = 76 + dispBack;

  if (leftDiaphragm) leftDiaphragm.position.y = 153 + dispFront;
  if (rightDiaphragm) rightDiaphragm.position.y = 153 + dispBack;

  if (gaugeNeedle) {
    const normPressure = state.system_vacuum_mbar / 1013.0; 
    gaugeNeedle.rotation.z = (1.0 - normPressure) * (Math.PI * 1.4) - (Math.PI * 0.7);
  }

  if (animState.explode > 0) {
    pumpGroup.children.forEach(child => {
      child.children.forEach(sub => {
        if (sub.userData && sub.userData.explodeOffset) {
          sub.position.y = sub.userData.baseY + sub.userData.explodeOffset.y * animState.explode;
        } else if (!sub.userData) {
          sub.userData = { baseY: sub.position.y };
        }
      });
    });
  } else {
    pumpGroup.children.forEach(child => {
      child.children.forEach(sub => {
        if (sub.userData && sub.userData.baseY !== undefined && !sub.userData.explodeOffset) {
          sub.position.y = sub.userData.baseY;
        }
      });
    });
  }
}

export function setExplodeAmount(val) {
  animState.explode = val;
}

export function setWireframe(val) {
  pumpGroup.traverse(child => {
    if (child.isMesh && child.material) {
      child.material.wireframe = val;
    }
  });
}
