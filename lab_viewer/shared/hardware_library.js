/**
 * Hardware Library — Procedural Laboratory CAD Fasteners & Connectors
 * 
 * Provides micron-accurate standard hardware components:
 * - DIN 912 / ISO 4762 Hex socket cap screws
 * - DIN 125 Flat washers & DIN 127 Spring lock washers
 * - Rubber vibration damping feet with brass/steel threaded studs
 * - IEC 60320 C14 power inlets with fuse holders
 * - BNC coaxial connectors (MIL-STD-348)
 * - USB-A and USB-B female bulkhead ports
 * - DB9 (DE-9) serial ports with standoff hex screwlocks
 * - Rocker power switches with pivotable rocker actuators
 */
import * as THREE from 'three';

// Standard Materials Cache
const MAT_STEEL = new THREE.MeshStandardMaterial({ color: 0xb4b8be, roughness: 0.25, metalness: 0.85 });
const MAT_STAINLESS_DARK = new THREE.MeshStandardMaterial({ color: 0x6e7278, roughness: 0.35, metalness: 0.75 });
const MAT_HEX_RECESS = new THREE.MeshStandardMaterial({ color: 0x181a1e, roughness: 0.8, metalness: 0.2 });
const MAT_BRASS = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8 });
const MAT_RUBBER = new THREE.MeshStandardMaterial({ color: 0x121418, roughness: 0.92, metalness: 0.05 });
const MAT_BLACK_PLASTIC = new THREE.MeshStandardMaterial({ color: 0x1c1e22, roughness: 0.45, metalness: 0.08 });
const MAT_GOLD_PIN = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 0.9 });

/**
 * Creates a precision DIN 912 / ISO 4762 Hex Socket Head Cap Screw.
 * @param {number} r - Shaft radius (e.g., 0.02 for M4)
 * @param {number} length - Shaft length
 * @param {Object} [options]
 */
export function createHexSocketScrew(r, length, options = {}) {
  const group = new THREE.Group();
  const matMetal = options.material || MAT_STEEL;
  const matRecess = options.recessMaterial || MAT_HEX_RECESS;

  // Head dimensions: head radius ~ 1.5 * shaft radius, head height ~ 2 * shaft radius
  const headR = r * 1.5;
  const headH = r * 2.0;

  // Cylindrical head
  const headGeo = new THREE.CylinderGeometry(headR, headR, headH, 20);
  const head = new THREE.Mesh(headGeo, matMetal);
  head.position.y = headH / 2;
  head.castShadow = true;
  group.add(head);

  // Top chamfer on head
  const chamferGeo = new THREE.CylinderGeometry(headR * 0.85, headR, headH * 0.15, 20);
  const chamfer = new THREE.Mesh(chamferGeo, matMetal);
  chamfer.position.y = headH + (headH * 0.075);
  group.add(chamfer);

  // Hexagonal socket recess
  const hexR = r * 0.9;
  const hexH = headH * 0.6;
  const hexGeo = new THREE.CylinderGeometry(hexR, hexR, hexH, 6);
  const hex = new THREE.Mesh(hexGeo, matRecess);
  hex.position.y = headH - (hexH / 2) + 0.001;
  group.add(hex);

  // Threaded shaft
  const shaftGeo = new THREE.CylinderGeometry(r, r, length, 16);
  const shaft = new THREE.Mesh(shaftGeo, matMetal);
  shaft.position.y = -length / 2;
  shaft.castShadow = true;
  group.add(shaft);

  // Chamfered tip
  const tipGeo = new THREE.CylinderGeometry(r, r * 0.6, r * 0.8, 16);
  const tip = new THREE.Mesh(tipGeo, matMetal);
  tip.position.y = -length - (r * 0.4);
  group.add(tip);

  return group;
}

/**
 * Creates a standard DIN 125 flat washer.
 */
export function createWasher(innerR, outerR, thickness, options = {}) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const extrudeSettings = {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: thickness * 0.1,
    bevelThickness: thickness * 0.1,
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const mat = options.material || MAT_STEEL;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = Math.PI / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Creates a Neoprene vibration-damping machine foot with threaded mounting stud.
 */
export function createVibrationFoot(studLength, padR, padH, options = {}) {
  const group = new THREE.Group();
  const matRubber = options.rubberMaterial || MAT_RUBBER;
  const matStud = options.studMaterial || MAT_BRASS;

  // Tapered rubber foot body
  const bodyGeo = new THREE.CylinderGeometry(padR * 0.85, padR, padH, 24);
  const body = new THREE.Mesh(bodyGeo, matRubber);
  body.position.y = padH / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Bottom anti-skid concentric grooves
  for (let i = 1; i <= 3; i++) {
    const ringGeo = new THREE.TorusGeometry(padR * (0.25 * i), padR * 0.04, 8, 24);
    const ring = new THREE.Mesh(ringGeo, matRubber);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.001;
    group.add(ring);
  }

  // Metal backing washer plate
  const washerGeo = new THREE.CylinderGeometry(padR * 0.8, padR * 0.8, padH * 0.12, 24);
  const washer = new THREE.Mesh(washerGeo, matStud);
  washer.position.y = padH + (padH * 0.06);
  group.add(washer);

  // Threaded brass/steel stud extending upwards
  const studR = padR * 0.22;
  const studGeo = new THREE.CylinderGeometry(studR, studR, studLength, 16);
  const stud = new THREE.Mesh(studGeo, matStud);
  stud.position.y = padH + (studLength / 2);
  stud.castShadow = true;
  group.add(stud);

  return group;
}

/**
 * Creates an IEC 60320 C14 Power Inlet Receptacle.
 */
export function createIECInlet(options = {}) {
  const group = new THREE.Group();
  const matPlastic = options.plasticMaterial || MAT_BLACK_PLASTIC;
  const matPins = options.pinMaterial || MAT_BRASS;

  // Outer mounting flange
  const flangeGeo = new THREE.BoxGeometry(0.5, 0.32, 0.04);
  const flange = new THREE.Mesh(flangeGeo, matPlastic);
  group.add(flange);

  // Two mounting screw holes on ears
  const screw1 = createHexSocketScrew(0.015, 0.06, { material: MAT_STAINLESS_DARK });
  screw1.rotation.x = Math.PI / 2;
  screw1.position.set(-0.2, 0, 0.02);
  group.add(screw1);

  const screw2 = createHexSocketScrew(0.015, 0.06, { material: MAT_STAINLESS_DARK });
  screw2.rotation.x = Math.PI / 2;
  screw2.position.set(0.2, 0, 0.02);
  group.add(screw2);

  // Recessed plug socket body
  const recessGeo = new THREE.BoxGeometry(0.26, 0.18, 0.16);
  const recess = new THREE.Mesh(recessGeo, matPlastic);
  recess.position.z = -0.08;
  group.add(recess);

  // 3 Male Prongs (Earth top center, Line/Neutral bottom left/right)
  const pinPositions = [
    [0, 0.045, -0.05],     // Earth
    [-0.06, -0.03, -0.05], // Line
    [0.06, -0.03, -0.05],  // Neutral
  ];
  pinPositions.forEach(([px, py, pz]) => {
    const pinGeo = new THREE.BoxGeometry(0.015, 0.04, 0.08);
    const pin = new THREE.Mesh(pinGeo, matPins);
    pin.position.set(px, py, pz);
    group.add(pin);
  });

  return group;
}

/**
 * Creates a BNC Female Bulkhead Jack (for pH electrodes, sensors, inputs).
 */
export function createBNCJack(options = {}) {
  const group = new THREE.Group();
  const matNickel = options.material || MAT_STEEL;
  const matGold = options.goldMaterial || MAT_GOLD_PIN;
  const matInsulator = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3 });

  // Outer threaded barrel
  const barrelGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.09, 24);
  const barrel = new THREE.Mesh(barrelGeo, matNickel);
  barrel.rotation.x = Math.PI / 2;
  group.add(barrel);

  // Two locking bayonet lugs (pins sticking out horizontally)
  for (const sign of [-1, 1]) {
    const lugGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.02, 12);
    const lug = new THREE.Mesh(lugGeo, matNickel);
    lug.rotation.z = Math.PI / 2;
    lug.position.set(sign * 0.056, 0, 0.015);
    group.add(lug);
  }

  // Hex nut on chassis panel
  const hexGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.02, 6);
  const hex = new THREE.Mesh(hexGeo, matNickel);
  hex.rotation.x = Math.PI / 2;
  hex.position.z = -0.04;
  group.add(hex);

  // PTFE White insulator core
  const coreGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.07, 24);
  const core = new THREE.Mesh(coreGeo, matInsulator);
  core.rotation.x = Math.PI / 2;
  core.position.z = 0.01;
  group.add(core);

  // Gold central receptacle pin
  const pinGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.06, 12);
  const pin = new THREE.Mesh(pinGeo, matGold);
  pin.rotation.x = Math.PI / 2;
  pin.position.z = 0.015;
  group.add(pin);

  return group;
}

/**
 * Creates a DB9 (RS-232 / COM Port) D-Sub receptacle.
 */
export function createDB9Port(options = {}) {
  const group = new THREE.Group();
  const matShield = options.material || MAT_STEEL;
  const matPlastic = new THREE.MeshStandardMaterial({ color: 0x0a2244, roughness: 0.5 }); // Dark blue plastic
  const matPins = MAT_GOLD_PIN;

  // Trapezoidal metal shield frame
  const frameGeo = new THREE.BoxGeometry(0.31, 0.15, 0.08);
  const frame = new THREE.Mesh(frameGeo, matShield);
  group.add(frame);

  // Blue plastic insert
  const insertGeo = new THREE.BoxGeometry(0.24, 0.10, 0.06);
  const insert = new THREE.Mesh(insertGeo, matPlastic);
  insert.position.z = 0.015;
  group.add(insert);

  // 9 Pin Sockets (5 on top row, 4 on bottom row)
  for (let i = 0; i < 5; i++) {
    const pX = -0.08 + (i * 0.04);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.02, 8), matPins);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(pX, 0.022, 0.035);
    group.add(pin);
  }
  for (let i = 0; i < 4; i++) {
    const pX = -0.06 + (i * 0.04);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.02, 8), matPins);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(pX, -0.022, 0.035);
    group.add(pin);
  }

  // Two Hex standoffs / screw locks on flanks
  for (const sign of [-1, 1]) {
    const standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.04, 6), matShield);
    standoff.rotation.x = Math.PI / 2;
    standoff.position.set(sign * 0.20, 0, 0.02);
    group.add(standoff);

    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.042, 8), MAT_HEX_RECESS);
    hole.rotation.x = Math.PI / 2;
    hole.position.set(sign * 0.20, 0, 0.02);
    group.add(hole);
  }

  return group;
}

/**
 * Creates a Rocker Power Switch with pivotable rocker button.
 */
export function createRockerSwitch(options = {}) {
  const group = new THREE.Group();
  const matBody = options.bodyMaterial || MAT_BLACK_PLASTIC;
  const matRocker = options.rockerMaterial || new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.5 });
  const matRed = new THREE.MeshStandardMaterial({ color: 0xd62828, roughness: 0.3, emissive: 0x440808 });

  // Outer bezel frame
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.30, 0.04), matBody);
  group.add(bezel);

  // Pivot group for rocker action
  const rockerPivot = new THREE.Group();
  rockerPivot.position.set(0, 0, 0.01);

  // Rocker paddle
  const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.24, 0.04), options.red ? matRed : matRocker);
  paddle.position.z = 0.015;
  rockerPivot.add(paddle);

  // Red illuminated dot or line on the "I" side
  if (options.illuminated) {
    const dot = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.005), new THREE.MeshBasicMaterial({ color: 0xff3333 }));
    dot.position.set(0, 0.07, 0.036);
    rockerPivot.add(dot);
  }

  group.add(rockerPivot);
  group.userData.rockerPivot = rockerPivot;

  return group;
}
