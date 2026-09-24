/**
 * Mettler Toledo XSE204 Class Analytical Balance Twin (Three.js)
 * 
 * Exhaustive procedural design:
 * - Die-cast aluminum base chassis with chamfered bevels & cable routing
 * - 3 independent sliding glass draft shields (Left, Right, Top) with aluminum handles & rails
 * - SmartGrid perforated stainless steel chamber floor with drain trench & laser grid lines
 * - Mirror-polished stainless steel weighing pan (Ø 80 mm) on 3-arm spider support & centering cone
 * - Stainless steel cylindrical draft protection ring (Ø 90 mm)
 * - Internal EMFR cell: NdFeB permanent magnet pot, copper voice coil, monolithic flexure lever arm,
 *   optical null sensor, motorized calibration weight (100g Class E2) & drive cam
 * - Front spirit bubble level with fluid meniscus and floating bubble responsive to tilt
 * - Angled front terminal facing user (-Z) with 5.7" CanvasTexture display & optical touchless wave sensors
 * - Rear panel: IEC C14 inlet, DB9 RS-232 serial port with standoff hex screwlocks, USB-A/B ports, Kensington slot
 * - Lab accessories: Polystyrene weigh boats, micro-spatula, crystalline sample piles, calibration weights
 * - Full photorealistic laboratory room environment (floor tiles, walls, ceiling lights, black-top lab table with legs, apron, duplex outlet & power cord)
 * - Exploded view animation, wireframe toggle, dynamic sliding door transforms
 * 
 * Units: 1 unit ≈ 100 mm (width 3.56 ≈ 356 mm, depth 4.0 ≈ 400 mm). Y-up, front = -Z.
 */

import * as THREE from 'three';
import {
  createHexSocketScrew,
  createWasher,
  createVibrationFoot,
  createIECInlet,
  createDB9Port,
} from '../../../lab_viewer/shared/hardware_library.js';

// Inline USB-B port (not in hardware_library)
function createUSBPortInline() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.10, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.3 })
  );
  g.add(body);
  const opening = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.06, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.1, roughness: 0.8 })
  );
  opening.position.z = -0.08;
  g.add(opening);
  return g;
}

// ---------------------------------------------------------------------------
// Material Palette
// ---------------------------------------------------------------------------
const M = (color, o = {}) => new THREE.MeshStandardMaterial({
  color,
  roughness: o.r ?? 0.35,
  metalness: o.m ?? 0.1,
  transparent: o.o != null && o.o < 1,
  opacity: o.o ?? 1,
  emissive: new THREE.Color(o.e ?? o.emissive ?? 0x000000),
  emissiveIntensity: o.ei ?? o.emissiveIntensity ?? 0,
  side: o.side ?? THREE.FrontSide,
  depthWrite: o.dw ?? true,
});

const matWhiteChassis = M(0xf6f7f9, { r: 0.35, m: 0.06, side: THREE.DoubleSide });
const matDarkBezel   = M(0x1e222a, { r: 0.45, m: 0.15, side: THREE.DoubleSide });
const matAlumBrushed = M(0xc6cad1, { r: 0.28, m: 0.82, side: THREE.DoubleSide });
const matChrome      = M(0xeef3f8, { r: 0.1, m: 0.96 });
const matPanSteel    = M(0xf4f7fa, { r: 0.12, m: 0.95, side: THREE.DoubleSide });
const matRubber      = M(0x141619, { r: 0.9, m: 0.02 });
const matBrass       = M(0xd4af37, { r: 0.28, m: 0.85 });
const matCopper      = M(0xcc6633, { r: 0.25, m: 0.9 });
const matGlass       = M(0xf0f7fd, { r: 0.03, m: 0.06, o: 0.22, side: THREE.DoubleSide });
const matSpiritFluid = M(0x52e038, { r: 0.15, m: 0.05, o: 0.92 });
const matBubble      = M(0xffffff, { r: 0.1, m: 0.2, o: 0.95 });
const matReticle     = M(0xd9383a, { r: 0.3, m: 0.1 });
const matMagnet      = M(0x4a4e54, { r: 0.4, m: 0.8 });
const matPCB         = M(0x1a4d2e, { r: 0.5, m: 0.2, side: THREE.DoubleSide });
const matPowder      = M(0xffffff, { r: 0.9, m: 0.0 });
const matGlassShield = M(0xf0f7fd, { r: 0.03, m: 0.06, o: 0.22, side: THREE.DoubleSide });

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

// ---------------------------------------------------------------------------
// Bench & Island Constants (Standing-height lab counter: 900 mm = 9.00 units)
// ---------------------------------------------------------------------------
export const BENCH = {
  cx: 0.0,
  cz: 0.0,
  sx: 10.0,
  sz: 7.2,     // 720 mm deep standard precision lab balance table (plenty of rear clearance)
  bodyH: 8.30, // 830 mm base cabinet
  topT: 0.70,  // 70 mm solid epoxy countertop
  get surfaceY() {
    return this.bodyH + this.topT; // 9.00 units = 900 mm standing height
  },
  get outlet() {
    const rearZ = this.cz + this.sz / 2 - 0.05;
    return {
      x: 1.5,
      y: this.surfaceY + 1.20,
      z: rearZ,
    };
  },
};

// Sub-assembly references
let balanceRoot = null;
let doorLeftGroup = null;
let doorRightGroup = null;
let doorTopGroup = null;
let panGroup = null;
let emfrGroup = null;
let terminalGroup = null;
let bubbleMesh = null;
let lcdMesh = null;
let sampleMesh = null;
let weighBoatMesh = null;
let calWeightMesh = null;
let pwrLedMesh = null;
let knobLeftMesh = null;
let knobRightMesh = null;

// Explode animation targets: [group, basePos, explodeOffsetVector]
const explodeParts = [];

/**
 * Duplex AC outlet on rear backsplash.
 */
function addDuplexOutlet(parent, x, y, z) {
  const matPlate = M(0xd8dce0, { r: 0.35, m: 0.55 });
  const matBody = M(0xf2f4f6, { r: 0.45, m: 0.08 });
  const matHole = M(0x121418, { r: 0.7, m: 0.05 });
  const matScrew = M(0xb0b6bc, { r: 0.35, m: 0.7 });

  const plate = box(0.24, 0.30, 0.02, matPlate);
  plate.position.set(x, y, z);
  parent.add(plate);

  for (const dy of [0.06, -0.06]) {
    const face = box(0.10, 0.075, 0.012, matBody);
    face.position.set(x, y + dy, z - 0.015);
    parent.add(face);

    for (const sx of [-0.022, 0.022]) {
      const slot = box(0.012, 0.034, 0.008, matHole);
      slot.position.set(x + sx, y + dy + 0.006, z - 0.022);
      parent.add(slot);
    }
    const gnd = cyl(0.008, 0.008, 0.008, matHole, 10);
    gnd.rotation.x = Math.PI / 2;
    gnd.position.set(x, y + dy - 0.022, z - 0.022);
    parent.add(gnd);
  }

  for (const sy of [0.12, -0.12]) {
    const sc = cyl(0.008, 0.008, 0.01, matScrew, 8);
    sc.rotation.x = Math.PI / 2;
    sc.position.set(x, y + sy, z - 0.012);
    parent.add(sc);
  }

  return { x, y: y - 0.06, z: z - 0.025 };
}

/**
 * Builds the complete immersive laboratory room environment (2.8m ceiling, 900mm standing bench).
 */
function buildLabRoom(root) {
  const lab = new THREE.Group();
  lab.name = "Lab_Environment";

  const half = 25.0;
  const height = 28.0; // 2.8 meters standard laboratory ceiling
  const wallT = 0.20;

  const matFloor = M(0xc8d0d8, { r: 0.55, m: 0.04 });
  const matTile = M(0xa8b2bc, { r: 0.5, m: 0.05 });
  const matWall = M(0xe6eaee, { r: 0.72, m: 0.02 });
  const matCeiling = M(0xf0f2f4, { r: 0.8, m: 0.0 });
  const matBench = M(0x6a7380, { r: 0.45, m: 0.2 });
  const matTop = M(0x141820, { r: 0.32, m: 0.22 }); // Chemical-resistant black epoxy resin
  const matPanel = M(0xf4f8ff, { r: 0.4, m: 0.0, e: 0xc8e0ff, ei: 0.55 });
  const matLeg = M(0x2c333c, { r: 0.42, m: 0.4 });
  const matLegFoot = M(0x1a1f26, { r: 0.75, m: 0.1 });
  const matSteel = M(0x9aa3ac, { r: 0.35, m: 0.55 });

  // Floor plane
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(half * 2, half * 2), matFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.name = "Ground";
  lab.add(floor);

  // Floor tile grid lines
  const tile = 2.0;
  for (let i = -Math.floor(half / tile); i <= Math.floor(half / tile); i++) {
    const x = i * tile;
    if (Math.abs(x) >= half - 0.05) continue;
    const lx = box(0.03, 0.008, half * 2 - 0.3, matTile);
    lx.position.set(x, 0.004, 0);
    lab.add(lx);
    const lz = box(half * 2 - 0.3, 0.008, 0.03, matTile);
    lz.position.set(0, 0.004, x);
    lab.add(lz);
  }

  // Room walls
  const wallY = height / 2;
  const walls = [
    { p: [0, wallY, half], s: [half * 2, height, wallT] },
    { p: [0, wallY, -half], s: [half * 2, height, wallT] },
    { p: [half, wallY, 0], s: [wallT, height, half * 2] },
    { p: [-half, wallY, 0], s: [wallT, height, half * 2] },
  ];
  for (const w of walls) {
    const mesh = box(w.s[0], w.s[1], w.s[2], matWall);
    mesh.position.set(...w.p);
    lab.add(mesh);
  }

  // Ceiling at Y = 28.0
  const ceiling = box(half * 2, 0.15, half * 2, matCeiling);
  ceiling.position.set(0, height, 0);
  lab.add(ceiling);

  // Overhead recessed fluorescent / LED troffer fixtures
  const panelStep = 6.0;
  const panelMax = 18.0;
  for (let pz = -panelMax; pz <= panelMax + 0.01; pz += panelStep) {
    for (let px = -panelMax; px <= panelMax + 0.01; px += panelStep) {
      const p = box(2.4, 0.06, 1.0, matPanel);
      p.position.set(px, height - 0.12, pz);
      lab.add(p);
    }
  }

  // Instrument Table (Black chemical-resistant epoxy countertop on heavy steel frame)
  const ib = BENCH;
  const apronH = 1.40;
  const apron = box(ib.sx - 0.20, apronH, ib.sz - 0.20, matBench);
  apron.position.set(ib.cx, ib.bodyH - apronH / 2, ib.cz);
  lab.add(apron);

  // 4 Heavy Tubular Steel Table Legs
  const legW = 0.22;
  const legH = ib.bodyH - 0.05;
  const hx = ib.sx / 2 - 0.35;
  const hz = ib.sz / 2 - 0.35;
  [[-hx, -hz], [hx, -hz], [-hx, hz], [hx, hz]].forEach(([lx, lz]) => {
    const leg = box(legW, legH, legW, matLeg);
    leg.position.set(ib.cx + lx, legH / 2, ib.cz + lz);
    lab.add(leg);
    const foot = cyl(0.14, 0.16, 0.06, matLegFoot, 16);
    foot.position.set(ib.cx + lx, 0.03, ib.cz + lz);
    lab.add(foot);
  });

  // Table cross-stretchers for rigid stability
  const strH = 0.12;
  const strY = 2.20;
  const strF = box(ib.sx - 0.7, strH, 0.08, matLeg);
  strF.position.set(ib.cx, strY, ib.cz - hz);
  lab.add(strF);
  const strB = box(ib.sx - 0.7, strH, 0.08, matLeg);
  strB.position.set(ib.cx, strY, ib.cz + hz);
  lab.add(strB);

  // 70mm Solid Epoxy Resin Countertop Slab at Y = 9.00
  const islandTop = box(ib.sx + 0.15, ib.topT, ib.sz + 0.15, matTop);
  islandTop.position.set(ib.cx, ib.bodyH + ib.topT / 2, ib.cz);
  lab.add(islandTop);

  // Anodized steel perimeter edge trim around countertop (true 4-sided border, zero top-surface Z-fighting)
  const trimT = ib.topT;
  const trimW = 0.02;
  const halfX = (ib.sx + 0.15) / 2;
  const halfZ = (ib.sz + 0.15) / 2;
  const trimY = ib.bodyH + trimT / 2;

  const edgeF = box(ib.sx + 0.15 + trimW * 2, trimT, trimW, matSteel);
  edgeF.position.set(ib.cx, trimY, ib.cz - halfZ - trimW / 2);
  lab.add(edgeF);

  const edgeB = box(ib.sx + 0.15 + trimW * 2, trimT, trimW, matSteel);
  edgeB.position.set(ib.cx, trimY, ib.cz + halfZ + trimW / 2);
  lab.add(edgeB);

  const edgeL = box(trimW, trimT, ib.sz + 0.15, matSteel);
  edgeL.position.set(ib.cx - halfX - trimW / 2, trimY, ib.cz);
  lab.add(edgeL);

  const edgeR = box(trimW, trimT, ib.sz + 0.15, matSteel);
  edgeR.position.set(ib.cx + halfX + trimW / 2, trimY, ib.cz);
  lab.add(edgeR);

  // Rear laboratory backsplash with integrated electrical service
  const bsH = 1.60;
  const bsD = 0.18;
  const bsZ = ib.cz + ib.sz / 2 - bsD / 2 + 0.05;
  const splash = box(ib.sx + 0.15, bsH, bsD, matBench);
  splash.position.set(ib.cx, ib.surfaceY + bsH / 2, bsZ);
  lab.add(splash);

  // Duplex outlet on backsplash
  const outletPos = addDuplexOutlet(lab, ib.cx + 1.5, ib.surfaceY + 0.60, bsZ - bsD / 2 - 0.01);
  root.add(lab);
  return { lab, outletPos };
}

/**
 * Creates the complete procedural Analytical Balance with a solid monolithic unibody chassis.
 */
export function createBalanceModel() {
  balanceRoot = new THREE.Group();
  balanceRoot.name = "Analytical_Balance_XSE204";
  balanceRoot.userData = { label: "METTLER TOLEDO XSE204", type: "instrument" };

  // 1. Build laboratory room and black epoxy instrument bench (900mm standing height, 2.8m ceiling)
  const { outletPos } = buildLabRoom(balanceRoot);
  const baseY = BENCH.surfaceY; // 9.00 (Bench top surface)

  // 2. Monolithic Unibody Chassis Assembly
  // Single seamless piece spanning from rear Z = +1.90 to front nose Z = -2.00
  const baseGroup = new THREE.Group();
  baseGroup.position.set(0, baseY, 0);
  createChassisAndLeveling(baseGroup);
  balanceRoot.add(baseGroup);
  terminalGroup = baseGroup; // Keep reference for backward compatibility
  explodeParts.push({ group: baseGroup, base: new THREE.Vector3(0, baseY, 0), offset: new THREE.Vector3(0, -0.4, 0) });

  // 3. Internal EMFR Force Cell (Inside base directly beneath weighing pan at Z = 0.40)
  emfrGroup = new THREE.Group();
  emfrGroup.position.set(0, baseY + 0.47, 0.40);
  createEMFRCell(emfrGroup);
  balanceRoot.add(emfrGroup);
  explodeParts.push({ group: emfrGroup, base: new THREE.Vector3(0, baseY + 0.47, 0.40), offset: new THREE.Vector3(0, -0.1, 0.9) });

  // 4. Chamber Floor, Draft Ring & Weighing Pan (Resting completely on flat deck plate at local Y = 0.88, Z = 0.40)
  panGroup = new THREE.Group();
  panGroup.position.set(0, baseY + 0.88, 0.40);
  createPanAndChamberFloor(panGroup);
  balanceRoot.add(panGroup);
  explodeParts.push({ group: panGroup, base: new THREE.Vector3(0, baseY + 0.88, 0.40), offset: new THREE.Vector3(0, 0.7, 0) });

  // 5. Glass Draft Shield Enclosure & Sliding Doors (Centered squarely on flat deck plate at Z = 0.40, zero overhang)
  const draftShieldGroup = new THREE.Group();
  draftShieldGroup.position.set(0, baseY + 0.88, 0.40);
  createDraftShieldEnclosure(draftShieldGroup);
  balanceRoot.add(draftShieldGroup);
  explodeParts.push({ group: draftShieldGroup, base: new THREE.Vector3(0, baseY + 0.88, 0.40), offset: new THREE.Vector3(0, 1.3, 0) });

  // 6. Lab Bench Accessories (Weigh boats, spatula, weights)
  createBenchAccessories(balanceRoot, baseY);

  // 7. Power cord from rear IEC inlet to backsplash outlet
  createPowerCord(balanceRoot, new THREE.Vector3(0.55, baseY + 0.47, 1.90), new THREE.Vector3(outletPos.x, outletPos.y, outletPos.z));

  return balanceRoot;
}

// ---------------------------------------------------------------------------
// 2. Monolithic Unibody Chassis, Sloped Deck & Flush Widescreen Touchscreen
// ---------------------------------------------------------------------------
function createChassisAndLeveling(parent) {
  // Precision Sub-Chassis Underpan (Heavy die-cast zinc base plate)
  const underpan = box(3.40, 0.03, 3.80, matDarkBezel);
  underpan.position.set(0, 0.095, -0.05);
  parent.add(underpan);

  // -------------------------------------------------------------------------
  // Monolithic Unibody Outer Casting
  // One continuous solid piece from Z = +1.90 to Z = -2.00, width 3.56
  // Extruded side profile in (Z, Y):
  // Rear deck at Y = 0.88, front console slopes smoothly down to Y = 0.22 at nose
  // -------------------------------------------------------------------------
  const unibodyShape = new THREE.Shape();
  unibodyShape.moveTo(1.90, 0.08);   // Rear bottom
  unibodyShape.lineTo(1.90, 0.88);   // Rear top
  unibodyShape.lineTo(-0.60, 0.88);  // Rear flat deck end
  unibodyShape.lineTo(-1.95, 0.22);  // Sloped console front deck end
  unibodyShape.lineTo(-2.00, 0.20);  // Front nose bevel
  unibodyShape.lineTo(-2.00, 0.08);  // Front nose bottom
  unibodyShape.lineTo(1.90, 0.08);   // Bottom underpan

  const unibodyGeo = new THREE.ExtrudeGeometry(unibodyShape, {
    steps: 1,
    depth: 3.56,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelOffset: -0.005,
    bevelSegments: 3,
  });

  // Remap extruded coordinates: (Z, Y, X_depth) -> (X, Y, Z)
  const posArr = unibodyGeo.attributes.position;
  for (let i = 0; i < posArr.count; i++) {
    const zVal = posArr.getX(i);
    const yVal = posArr.getY(i);
    const xVal = posArr.getZ(i) - 1.78;
    posArr.setXYZ(i, xVal, yVal, zVal);
  }
  posArr.needsUpdate = true;
  unibodyGeo.computeVertexNormals();
  unibodyGeo.computeBoundingBox();
  unibodyGeo.computeBoundingSphere();

  const unibodyMesh = new THREE.Mesh(unibodyGeo, matWhiteChassis);
  unibodyMesh.castShadow = true;
  unibodyMesh.receiveShadow = true;
  unibodyMesh.name = "Unibody_Chassis";
  parent.add(unibodyMesh);

  // Top deck plate with brushed aluminum spill-containment rim on rear flat deck
  const deckPlate = box(3.60, 0.04, 2.52, matAlumBrushed);
  deckPlate.position.set(0, 0.86, 0.65); // Surface at Y = 0.88
  deckPlate.castShadow = false;
  deckPlate.receiveShadow = false;
  parent.add(deckPlate);

  // -------------------------------------------------------------------------
  // Integrated Sloped Front Console Deck (Flush Embedded Touchscreen & Sensors)
  // Slope angle: theta = arctan(0.66 / 1.35) = 26.05° (0.4547 rad)
  // Center: Z = -1.275, Y = 0.55
  // -------------------------------------------------------------------------
  const slopeTheta = Math.atan2(0.66, 1.35); // ~0.4547 rad
  const slopeCenterZ = -1.275;
  const slopeCenterY = 0.55;

  const slopeGroup = new THREE.Group();
  slopeGroup.position.set(0, slopeCenterY, slopeCenterZ);
  slopeGroup.rotation.x = -slopeTheta;
  parent.add(slopeGroup);

  // Recessed Dark Anti-Glare Bezel Tray molded flush into the casting
  const bezelTray = box(2.78, 0.02, 0.82, matDarkBezel);
  bezelTray.position.set(0, 0.006, 0);
  slopeGroup.add(bezelTray);

  // Brushed aluminum accent frame around bezel perimeter
  const bezelTrim = box(2.82, 0.015, 0.86, matAlumBrushed);
  bezelTrim.position.set(0, 0.003, 0);
  slopeGroup.add(bezelTrim);

  // Widescreen Capacitive Touchscreen (CanvasTexture) embedded flush
  // 2.64 wide × 0.68 deep, matching 1536x512 widescreen canvas
  const lcdGeo = new THREE.PlaneGeometry(2.64, 0.68);
  const lcdMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.rotation.x = -Math.PI / 2; // Face local +Y (out of sloped deck)
  lcdMesh.rotation.z = Math.PI;      // Right-side up facing operator
  lcdMesh.position.set(0, 0.018, -0.02);
  lcdMesh.name = "UI_LCD";
  lcdMesh.userData = { interactive: true, action: "touchscreen", label: "Widescreen Precision Touchscreen Display" };
  slopeGroup.add(lcdMesh);

  // Optical SmartSensors Hands-Free Touchless Wave Bar above display (Z = +0.36)
  const sensorBar = box(1.05, 0.025, 0.045, M(0x080a0e, { r: 0.9 }));
  sensorBar.position.set(0, 0.02, 0.36);
  sensorBar.name = "Sensor_Bar";
  sensorBar.userData = { interactive: true, action: "sensor_bar", label: "SmartSensor: Optical Hands-Free Wave Tare" };
  slopeGroup.add(sensorBar);

  // Left & Right IR emitter/photodiode lenses
  for (const sx of [-0.38, 0.38]) {
    const irDiode = cyl(0.016, 0.016, 0.015, M(0x1a0520, { r: 0.1, m: 0.8 }), 12);
    irDiode.position.set(sx, 0.03, 0.36);
    slopeGroup.add(irDiode);
  }

  // Note: Power/Standby is purely solid-state through the touchscreen glass and rear Master AC Rocker Switch.
  // No mechanical buttons breach the hermetic IP54 front terminal glass.


  // -------------------------------------------------------------------------
  // Precision Bubble Spirit Level on Front Left Shoulder (X = -1.49, Z = -0.32)
  // Proud knurled chrome collar (radius 0.14, height 0.030) seated cleanly on deck (Y = 0.88)
  // Crown at Y = 0.925, standing proudly above unibody bevel (Y = 0.895) with zero obscuration!
  // -------------------------------------------------------------------------
  const levelGroup = new THREE.Group();
  levelGroup.name = "Spirit_Level_Assembly";
  levelGroup.position.set(-1.49, 0.88, -0.32);

  // Outer knurled chrome bezel collar (diameter 28 mm, height 30 mm)
  const collar = cyl(0.14, 0.14, 0.030, matChrome, 36);
  collar.position.y = 0.015;
  collar.castShadow = false;
  collar.receiveShadow = false;
  collar.userData = { interactive: true, action: "level_bubble", label: "Spirit Level (Level when centered in red ring)" };
  levelGroup.add(collar);

  // Knurled grip band ring around collar perimeter
  const knurlBand = cyl(0.143, 0.143, 0.012, M(0x222832, { r: 0.85, m: 0.4 }), 36);
  knurlBand.position.y = 0.015;
  knurlBand.castShadow = false;
  knurlBand.receiveShadow = false;
  levelGroup.add(knurlBand);

  // Inner chamfered chrome bezel lip
  const innerBezel = new THREE.Mesh(new THREE.RingGeometry(0.105, 0.14, 36), matChrome);
  innerBezel.rotation.x = -Math.PI / 2;
  innerBezel.position.y = 0.0305;
  innerBezel.castShadow = false;
  innerBezel.receiveShadow = false;
  levelGroup.add(innerBezel);

  // High-visibility fluorescent precision leveling fluid chamber
  const fluid = cyl(0.108, 0.108, 0.018, matSpiritFluid, 32);
  fluid.position.y = 0.019;
  fluid.castShadow = false;
  fluid.receiveShadow = false;
  levelGroup.add(fluid);

  // Precision bullseye centering reticle rings (outer red tolerance ring + inner target circle)
  const ringOuter = new THREE.Mesh(new THREE.RingGeometry(0.040, 0.048, 32), matReticle);
  ringOuter.rotation.x = -Math.PI / 2;
  ringOuter.position.y = 0.029;
  ringOuter.castShadow = false;
  ringOuter.receiveShadow = false;
  levelGroup.add(ringOuter);

  const ringInner = new THREE.Mesh(new THREE.RingGeometry(0.015, 0.020, 24), M(0xd9383a, { r: 0.4, m: 0.1 }));
  ringInner.rotation.x = -Math.PI / 2;
  ringInner.position.y = 0.029;
  ringInner.castShadow = false;
  ringInner.receiveShadow = false;
  levelGroup.add(ringInner);

  // Dynamic spirit level bubble (moves interactively when leveling feet are adjusted)
  const bubbleGeo = new THREE.SphereGeometry(0.018, 20, 20);
  bubbleMesh = new THREE.Mesh(bubbleGeo, matBubble);
  bubbleMesh.position.set(0.002, 0.029, 0.001);
  bubbleMesh.scale.set(1.0, 0.4, 1.0); // Flattened meniscus shape
  bubbleMesh.castShadow = false;
  bubbleMesh.receiveShadow = false;
  bubbleMesh.name = "Spirit_Bubble";
  bubbleMesh.userData = { interactive: true, action: "level_bubble", label: "Spirit Level (Level when centered in red ring)" };
  levelGroup.add(bubbleMesh);

  // Curved convex optical glass protective dome crowning above chassis bevel
  const domeGeo = new THREE.SphereGeometry(0.11, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.35);
  const dome = new THREE.Mesh(domeGeo, matGlass);
  dome.position.y = 0.025;
  dome.castShadow = false;
  dome.receiveShadow = false;
  dome.userData = { interactive: true, action: "level_bubble", label: "Spirit Level (Level when centered in red ring)" };
  levelGroup.add(dome);

  parent.add(levelGroup);

  // -------------------------------------------------------------------------
  // 4 Vibration-Damping Rubber Leveling Feet strictly beneath the unibody
  // Height 0.08: rests on bench (Y = 0 to 0.08), lifting chassis cleanly
  // -------------------------------------------------------------------------
  // Front feet: X = ±1.40, Z = -1.65 (under front sloped section)
  for (const sx of [-1.40, 1.40]) {
    const footGroup = new THREE.Group();
    footGroup.position.set(sx, 0, -1.65);

    const pad = cyl(0.16, 0.18, 0.08, matRubber, 24);
    pad.position.y = 0.04;
    footGroup.add(pad);

    const washer = cyl(0.18, 0.18, 0.02, matAlumBrushed, 20);
    washer.position.y = 0.08;
    footGroup.add(washer);

    parent.add(footGroup);
  }

  // Rear Precision Leveling Feet with Knurled Thumbwheels
  // Under rear corners: X = ±1.40, Z = +1.60
  for (const sx of [-1.40, 1.40]) {
    const footGroup = new THREE.Group();
    footGroup.position.set(sx, 0, 1.60);

    const pad = cyl(0.16, 0.18, 0.08, matRubber, 24);
    pad.position.y = 0.04;
    footGroup.add(pad);

    const knob = cyl(0.19, 0.19, 0.06, matAlumBrushed, 32);
    knob.position.y = 0.09;
    knob.name = sx < 0 ? "Foot_Level_Left" : "Foot_Level_Right";
    knob.userData = {
      interactive: true,
      action: sx < 0 ? "level_left" : "level_right",
      label: sx < 0 ? "Rear Left Leveling Foot (Click to Level)" : "Rear Right Leveling Foot (Click to Level)",
    };
    if (sx < 0) knobLeftMesh = knob;
    else knobRightMesh = knob;
    footGroup.add(knob);

    for (let a = 0; a < 16; a++) {
      const rib = box(0.012, 0.06, 0.016, M(0x888c94, { r: 0.5 }));
      const rad = (a / 16) * Math.PI * 2;
      rib.position.set(Math.cos(rad) * 0.19, 0.09, Math.sin(rad) * 0.19);
      rib.rotation.y = -rad;
      footGroup.add(rib);
    }

    const stud = cyl(0.05, 0.05, 0.14, matBrass, 16);
    stud.position.y = 0.15;
    footGroup.add(stud);

    parent.add(footGroup);
  }

  // Rear Connectivity Panel (+Z face at Z = +1.90)
  createRearPanel(parent);
}

// ---------------------------------------------------------------------------
// Rear I/O Panel & Connectors (Facing +Z at Z = 1.90)
// ---------------------------------------------------------------------------
function createRearPanel(parent) {
  const panelPlate = box(2.6, 0.46, 0.02, matDarkBezel);
  panelPlate.position.set(0, 0.47, 1.89);
  parent.add(panelPlate);

  const db9 = createDB9Port();
  db9.rotation.y = Math.PI;
  db9.position.set(-0.7, 0.47, 1.88);
  db9.name = "Port_RS232";
  db9.userData = { interactive: true, action: "port_db9", label: "RS-232C Serial Port (DB9)" };
  parent.add(db9);

  const usb = createUSBPortInline();
  usb.rotation.y = Math.PI;
  usb.position.set(-0.15, 0.47, 1.88);
  usb.name = "Port_USB";
  usb.userData = { interactive: true, action: "port_usb", label: "USB-B Host Interface Port" };
  parent.add(usb);

  const iec = createIECInlet();
  iec.rotation.y = Math.PI;
  iec.position.set(0.55, 0.47, 1.88);
  iec.name = "Inlet_IEC";
  iec.userData = { interactive: true, action: "power_cord", label: "IEC C14 AC Power Inlet (100-240V)" };
  parent.add(iec);

  const rockerHousing = box(0.12, 0.18, 0.03, matDarkBezel);
  rockerHousing.position.set(0.85, 0.47, 1.89);
  parent.add(rockerHousing);

  const rockerSwitch = box(0.08, 0.12, 0.035, M(0xc02020, { r: 0.3 }));
  rockerSwitch.position.set(0.85, 0.47, 1.90);
  rockerSwitch.rotation.x = -0.15;
  rockerSwitch.name = "Power_Switch";
  rockerSwitch.userData = { interactive: true, action: "power_switch", label: "Master AC Rocker Switch (Click to Toggle)" };
  parent.add(rockerSwitch);
}

// ---------------------------------------------------------------------------
// 3. Monolithic EMFR Force Restoration Cell
// ---------------------------------------------------------------------------
function createEMFRCell(parent) {
  const block = box(1.8, 0.55, 1.8, matAlumBrushed);
  parent.add(block);

  const magPot = cyl(0.45, 0.45, 0.35, matMagnet, 32);
  magPot.position.set(0, 0.05, 0.5);
  parent.add(magPot);

  const coil = cyl(0.35, 0.35, 0.28, matCopper, 24);
  coil.position.set(0, 0.1, 0.5);
  parent.add(coil);

  const beam = box(0.16, 0.08, 1.3, matAlumBrushed);
  beam.position.set(0, 0.32, 0.1);
  parent.add(beam);

  const optoBracket = box(0.18, 0.16, 0.14, matDarkBezel);
  optoBracket.position.set(0, 0.35, 0.75);
  parent.add(optoBracket);

  const weight = cyl(0.16, 0.16, 0.30, matChrome, 24);
  weight.position.set(-0.55, 0.30, 0.2);
  parent.add(weight);
}

// ---------------------------------------------------------------------------
// 4. Chamber Floor, Draft Ring & Weighing Pan
// ---------------------------------------------------------------------------
function createPanAndChamberFloor(parent) {
  // Chamber floor plate strictly bounded to chamber depth (1.84 m) to sit flush on flat deck
  // Shadow reception DISABLED: Prevents ugly directional shadow map acne from pan/ring/glass
  const floor = box(2.34, 0.04, 1.84, matAlumBrushed);
  floor.position.set(0, 0.02, 0);
  floor.castShadow = false;
  floor.receiveShadow = false;
  parent.add(floor);

  for (let x = -0.95; x <= 0.95; x += 0.2) {
    for (let z = -0.75; z <= 0.75; z += 0.2) {
      if (Math.hypot(x, z) > 0.55) {
        const gridHole = box(0.08, 0.042, 0.08, M(0x1a1e24, { r: 0.8 }));
        gridHole.position.set(x, 0.021, z);
        gridHole.castShadow = false;
        gridHole.receiveShadow = false;
        parent.add(gridHole);
      }
    }
  }

  const draftRing = cyl(0.55, 0.55, 0.18, matPanSteel, 36);
  draftRing.position.set(0, 0.11, 0);
  draftRing.castShadow = false;
  draftRing.receiveShadow = false;
  parent.add(draftRing);

  const post = cyl(0.07, 0.07, 0.24, matChrome, 16);
  post.position.set(0, 0.14, 0);
  post.castShadow = false;
  post.receiveShadow = false;
  parent.add(post);

  const spider = box(0.7, 0.03, 0.7, matAlumBrushed);
  spider.position.set(0, 0.24, 0);
  spider.castShadow = false;
  spider.receiveShadow = false;
  parent.add(spider);

  const pan = cyl(0.48, 0.48, 0.035, matPanSteel, 40);
  pan.position.set(0, 0.265, 0);
  pan.castShadow = false;
  pan.receiveShadow = false;
  pan.name = "Weighing_Pan";
  parent.add(pan);

  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.015, 12, 40), matPanSteel);
  lip.rotation.x = Math.PI / 2;
  lip.position.set(0, 0.28, 0);
  lip.castShadow = false;
  lip.receiveShadow = false;
  parent.add(lip);

  const sampleGeo = new THREE.ConeGeometry(0.14, 0.06, 20);
  sampleMesh = new THREE.Mesh(sampleGeo, matPowder);
  sampleMesh.position.set(0, 0.38, 0);
  sampleMesh.visible = false;
  sampleMesh.name = "Sample_Powder";
  parent.add(sampleMesh);

  const calGroup = new THREE.Group();
  calGroup.position.set(0, 0.36, 0);
  calGroup.visible = false;
  calWeightMesh = calGroup;

  const calBody = cyl(0.18, 0.20, 0.32, matChrome, 32);
  calBody.position.y = 0.16;
  calGroup.add(calBody);

  const calKnob = cyl(0.07, 0.07, 0.10, matChrome, 24);
  calKnob.position.y = 0.37;
  calGroup.add(calKnob);

  const calTop = cyl(0.10, 0.07, 0.04, matChrome, 24);
  calTop.position.y = 0.44;
  calGroup.add(calTop);

  calGroup.name = "Calibration_Weight_100g";
  calGroup.userData = { interactive: true, action: "cal_weight", label: "100.0000 g OIML Class E2 Calibration Weight" };
  parent.add(calGroup);
}

// ---------------------------------------------------------------------------
// 5. Glass Draft Shield Enclosure & Sliding Doors (Centered at Z = 0.2)
// ---------------------------------------------------------------------------
function createDraftShieldEnclosure(parent) {
  const chamberW = 2.40;
  const chamberH = 2.40;
  const chamberD = 1.90; // Strictly fits flat deck (front Z_world = -0.55 >= -0.60, zero overhang over console)
  const railW = 0.06;
  const railH = 0.05;

  // 1. Four Structural Corner Pillars (Anodized extruded aluminum)
  const pillarX = chamberW / 2 - 0.03; // 1.17
  const pillarZ = chamberD / 2 - 0.03; // 0.92
  const cornerPositions = [
    [-pillarX, -pillarZ],
    [ pillarX, -pillarZ],
    [-pillarX,  pillarZ],
    [ pillarX,  pillarZ],
  ];
  cornerPositions.forEach(([px, pz]) => {
    const pillar = box(0.06, chamberH, 0.06, matAlumBrushed);
    pillar.position.set(px, chamberH / 2, pz);
    parent.add(pillar);
  });

  // 2. Lower Guide Rails with Dual Sliding Tracks
  // Left lower track
  const trackL = box(railW, railH, chamberD, matAlumBrushed);
  trackL.position.set(-chamberW / 2 + 0.03, railH / 2, 0);
  parent.add(trackL);
  const grooveL = box(0.020, 0.015, chamberD - 0.06, M(0x11161f, { r: 0.8 }));
  grooveL.position.set(-chamberW / 2 + 0.03, railH - 0.007, 0);
  parent.add(grooveL);

  // Right lower track
  const trackR = box(railW, railH, chamberD, matAlumBrushed);
  trackR.position.set(chamberW / 2 - 0.03, railH / 2, 0);
  parent.add(trackR);
  const grooveR = box(0.020, 0.015, chamberD - 0.06, M(0x11161f, { r: 0.8 }));
  grooveR.position.set(chamberW / 2 - 0.03, railH - 0.007, 0);
  parent.add(grooveR);

  // Front bottom threshold rail
  const threshF = box(chamberW - 0.06, railH, 0.06, matAlumBrushed);
  threshF.position.set(0, railH / 2, -chamberD / 2 + 0.03);
  parent.add(threshF);

  // Rear bottom threshold rail
  const threshB = box(chamberW - 0.06, railH, 0.06, matAlumBrushed);
  threshB.position.set(0, railH / 2, chamberD / 2 - 0.03);
  parent.add(threshB);

  // 3. Upper Header Frame with Inverted U-Channel Downward Guide Tracks
  // Left top track rail (Top body + downward capture flanges)
  const topTrackL = box(0.08, 0.05, chamberD, matAlumBrushed);
  topTrackL.position.set(-chamberW / 2 + 0.03, chamberH + 0.025, 0);
  parent.add(topTrackL);

  // Inverted U-channel downward lips for left door glass capture
  const lipL_inner = box(0.015, 0.030, chamberD, matAlumBrushed);
  lipL_inner.position.set(-chamberW / 2 + 0.008, chamberH - 0.015, 0);
  parent.add(lipL_inner);

  const lipL_outer = box(0.015, 0.030, chamberD, matAlumBrushed);
  lipL_outer.position.set(-chamberW / 2 + 0.052, chamberH - 0.015, 0);
  parent.add(lipL_outer);

  const grooveTopL = box(0.022, 0.008, chamberD - 0.06, M(0x11161f, { r: 0.8 }));
  grooveTopL.position.set(-chamberW / 2 + 0.03, chamberH - 0.004, 0);
  parent.add(grooveTopL);

  // Right top track rail
  const topTrackR = box(0.08, 0.05, chamberD, matAlumBrushed);
  topTrackR.position.set(chamberW / 2 - 0.03, chamberH + 0.025, 0);
  parent.add(topTrackR);

  // Inverted U-channel downward lips for right door glass capture
  const lipR_inner = box(0.015, 0.030, chamberD, matAlumBrushed);
  lipR_inner.position.set(chamberW / 2 - 0.008, chamberH - 0.015, 0);
  parent.add(lipR_inner);

  const lipR_outer = box(0.015, 0.030, chamberD, matAlumBrushed);
  lipR_outer.position.set(chamberW / 2 - 0.052, chamberH - 0.015, 0);
  parent.add(lipR_outer);

  const grooveTopR = box(0.022, 0.008, chamberD - 0.06, M(0x11161f, { r: 0.8 }));
  grooveTopR.position.set(chamberW / 2 - 0.03, chamberH - 0.004, 0);
  parent.add(grooveTopR);

  // Front top header crossbar
  const topHeaderF = box(chamberW - 0.06, 0.05, 0.07, matAlumBrushed);
  topHeaderF.position.set(0, chamberH + 0.025, -chamberD / 2 + 0.035);
  parent.add(topHeaderF);

  // Rear top header crossbar
  const topHeaderB = box(chamberW - 0.06, 0.05, 0.08, matAlumBrushed);
  topHeaderB.position.set(0, chamberH + 0.025, chamberD / 2 - 0.04);
  parent.add(topHeaderB);

  // 4. Fixed Front Full-Height Glass Wall (castShadow OFF: transparent glass must not cast opaque shadow)
  const frontGlass = box(chamberW - 0.12, chamberH - 0.08, 0.025, matGlass);
  frontGlass.position.set(0, chamberH / 2, -chamberD / 2 + 0.03);
  frontGlass.name = "Glass_Front";
  frontGlass.castShadow = false;
  frontGlass.receiveShadow = false;
  parent.add(frontGlass);

  // 5. Fixed Rear Glass Wall (castShadow OFF)
  const rearGlass = box(chamberW - 0.12, chamberH - 0.08, 0.025, matGlass);
  rearGlass.position.set(0, chamberH / 2, chamberD / 2 - 0.03);
  rearGlass.name = "Glass_Rear";
  rearGlass.castShadow = false;
  rearGlass.receiveShadow = false;
  parent.add(rearGlass);

  // -------------------------------------------------------------------------
  // Authentic Grounded Unibody Rear Electronics & Motor Tower
  // Sits solidly on the unibody flat deck from chamber rear (Z = 0.95 local)
  // to the rear of the unibody casting (Z = 1.50 local / Z = 1.90 world).
  // Zero floating boxes, zero overhang, genuine physical lab instrument body!
  // -------------------------------------------------------------------------
  const towerZ = 1.225; // Center between Z = 0.95 and Z = 1.50
  const towerDepth = 0.53;
  const towerGroup = new THREE.Group();
  towerGroup.name = "Body_RearElectronicsTower";

  // Solid structural casting resting directly on unibody deck (Y = 0 to Y = 2.425)
  // Height is 2.425 so its top face ends at Y = 2.425, with ZERO overlap into towerCap!
  const castingH = 2.425;
  const towerCasting = box(chamberW - 0.02, castingH, towerDepth, matWhiteChassis);
  towerCasting.position.set(0, castingH / 2, towerZ);
  towerCasting.castShadow = true;
  towerCasting.receiveShadow = true;
  towerGroup.add(towerCasting);

  // Top brushed aluminum cap plate (spans Y = 2.425 to Y = 2.450, thickness 0.025)
  // Flush with top header frame at Y = 2.450; zero coplanar Z-fighting with towerCasting!
  const capT = 0.025;
  const towerCap = box(chamberW - 0.02, capT, towerDepth, matAlumBrushed);
  towerCap.position.set(0, castingH + capT / 2, towerZ);
  towerGroup.add(towerCap);

  // Side recessed guide channels where door glass slides back alongside tower
  const sideSlotL = box(0.025, chamberH - 0.05, towerDepth, M(0x141820, { r: 0.85 }));
  sideSlotL.position.set(-chamberW / 2 + 0.03, chamberH / 2, towerZ);
  towerGroup.add(sideSlotL);

  const sideSlotR = box(0.025, chamberH - 0.05, towerDepth, M(0x141820, { r: 0.85 }));
  sideSlotR.position.set(chamberW / 2 - 0.03, chamberH / 2, towerZ);
  towerGroup.add(sideSlotR);

  // Rear interface panel on back face at Z = 1.49 local (world Z = 1.89)
  const rearFaceZ = towerZ + towerDepth / 2 + 0.002;

  // RS-232 DB-9 serial peripheral port
  const rs232 = box(0.30, 0.16, 0.02, matDarkBezel);
  rs232.position.set(-0.65, 0.45, rearFaceZ);
  towerGroup.add(rs232);
  const dsubPins = box(0.18, 0.08, 0.025, matPanSteel);
  dsubPins.position.set(-0.65, 0.45, rearFaceZ + 0.005);
  towerGroup.add(dsubPins);

  // RJ-45 Ethernet network port
  const ethPort = box(0.18, 0.16, 0.02, matDarkBezel);
  ethPort.position.set(-0.25, 0.45, rearFaceZ);
  towerGroup.add(ethPort);

  // Auxiliary draft-shield sensor port
  const auxPort = box(0.14, 0.14, 0.02, matDarkBezel);
  auxPort.position.set(0.15, 0.45, rearFaceZ);
  towerGroup.add(auxPort);

  // Kensington security lock slot
  const kensington = box(0.06, 0.12, 0.015, M(0x0a0c10, { r: 0.9 }));
  kensington.position.set(0.85, 0.35, rearFaceZ);
  towerGroup.add(kensington);

  // Calibration motor access service hatch with 4 hex socket screws
  const hatch = box(0.70, 0.50, 0.015, matAlumBrushed);
  hatch.position.set(0.20, 1.25, rearFaceZ);
  towerGroup.add(hatch);
  const hatchScrews = [
    [-0.10, 1.45],
    [ 0.50, 1.45],
    [-0.10, 1.05],
    [ 0.50, 1.05],
  ];
  hatchScrews.forEach(([sx, sy], i) => {
    const scr = cyl(0.016, 0.016, 0.018, matPanSteel, 8);
    scr.rotation.x = Math.PI / 2;
    scr.position.set(sx, sy, rearFaceZ + 0.008);
    scr.name = `Fastener_Hatch_${i + 1}`;
    towerGroup.add(scr);
  });

  // Horizontal cooling ventilation louvers
  for (let ly = 1.70; ly <= 2.15; ly += 0.09) {
    const louver = box(1.20, 0.035, 0.015, M(0x181e26, { r: 0.9 }));
    louver.position.set(0, ly, rearFaceZ);
    towerGroup.add(louver);
  }

  parent.add(towerGroup);

  // 6. Sliding Left Door Assembly (Seated in Lower/Upper Guide Tracks - ZERO GAP)
  doorLeftGroup = new THREE.Group();
  doorLeftGroup.position.set(-chamberW / 2 + 0.03, 0, 0);

  // Full-height side door glass extending from Y = 0.030 into bottom track to Y = 2.395 into top track
  const glassH = 2.365;
  const glassY = 1.2125;
  const leftGlass = box(0.022, glassH, chamberD - 0.12, matGlass);
  leftGlass.position.set(0, glassY, 0);
  leftGlass.name = "Door_Left";
  leftGlass.castShadow = false;
  leftGlass.receiveShadow = false;
  leftGlass.userData = { interactive: true, action: "door_left", label: "Draft Shield Left Door (Click to Open/Close)" };
  doorLeftGroup.add(leftGlass);

  const leftHandle = box(0.04, 0.9, 0.06, matAlumBrushed);
  leftHandle.position.set(-0.025, chamberH / 2, -chamberD / 2 + 0.20);
  leftHandle.name = "Handle_Left";
  leftHandle.userData = { interactive: true, action: "door_left", label: "Left Door Handle (Click to Slide)" };
  doorLeftGroup.add(leftHandle);
  parent.add(doorLeftGroup);

  // 7. Sliding Right Door Assembly (Seated in Lower/Upper Guide Tracks - ZERO GAP)
  doorRightGroup = new THREE.Group();
  doorRightGroup.position.set(chamberW / 2 - 0.03, 0, 0);

  const rightGlass = box(0.022, glassH, chamberD - 0.12, matGlass);
  rightGlass.position.set(0, glassY, 0);
  rightGlass.name = "Door_Right";
  rightGlass.castShadow = false;
  rightGlass.receiveShadow = false;
  rightGlass.userData = { interactive: true, action: "door_right", label: "Draft Shield Right Door (Click to Open/Close)" };
  doorRightGroup.add(rightGlass);

  const rightHandle = box(0.04, 0.9, 0.06, matAlumBrushed);
  rightHandle.position.set(0.025, chamberH / 2, -chamberD / 2 + 0.20);
  rightHandle.name = "Handle_Right";
  rightHandle.userData = { interactive: true, action: "door_right", label: "Right Door Handle (Click to Slide)" };
  doorRightGroup.add(rightHandle);
  parent.add(doorRightGroup);

  // 8. Sliding Top Door Assembly (Covers Open Roof Aperture for Direct Pipetting Access)
  doorTopGroup = new THREE.Group();
  doorTopGroup.position.set(0, chamberH + 0.045, 0);
  const topGlass = box(chamberW - 0.12, 0.022, chamberD - 0.10, matGlass);
  topGlass.name = "Door_Top";
  topGlass.castShadow = false;
  topGlass.receiveShadow = false;
  topGlass.userData = { interactive: true, action: "door_top", label: "Draft Shield Top Door (Click to Open/Close)" };
  doorTopGroup.add(topGlass);

  const topHandle = box(0.6, 0.035, 0.07, matAlumBrushed);
  topHandle.position.set(0, 0.025, -chamberD / 2 + 0.20);
  topHandle.name = "Handle_Top";
  topHandle.userData = { interactive: true, action: "door_top", label: "Top Door Handle (Click to Slide)" };
  doorTopGroup.add(topHandle);
  parent.add(doorTopGroup);
}
// Official SREdesigns Canonical Laboratory Badge (from centrifuge_twin standard)
// ---------------------------------------------------------------------------
export function makeSREdesignsBadge(scale = 0.32) {
  const g = new THREE.Group();
  g.name = "SREdesigns_Badge";
  g.userData = {
    interactive: true,
    action: "sredesigns_badge",
    label: "SREdesigns Official Laboratory Digital Twin Engineering Badge",
  };

  // Scaled proportionally to fit the 12 mm vertical nose apron (Y = 0.08 to 0.20)
  // Base plate dimensions: 360 mm x 80 mm in real-world, 0.36 x 0.08 units in scene
  const plateW = 0.98 * scale; // ~0.314 units
  const plateH = 0.28 * scale; // ~0.089 units (fits with margins in 0.12 lip)
  const plateD = 0.012;

  // Outer dark bezel frame
  const bezel = box(plateW + 0.015, plateH + 0.015, 0.008, M(0x2a313a, { r: 0.45, m: 0.25 }));
  bezel.position.z = -0.001;
  g.add(bezel);

  // Plate body (dark charcoal precision backing plate)
  const plate = box(plateW, plateH, plateD, M(0x1a1f26, { r: 0.4, m: 0.3 }));
  g.add(plate);

  // Face texture — teal tiles + designs.com + LAB SYSTEMS
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 300;
  const ctx = c.getContext("2d");
  const cw = 1024;
  const ch = 300;

  ctx.fillStyle = "#0c1016";
  ctx.fillRect(0, 0, cw, ch);

  const letters = ["S", "R", "E"];
  const tileW = 112;
  const tileH = 132;
  const gap = 5;
  const tileY = (ch - tileH) / 2;
  let x0 = 48;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 100px system-ui,Segoe UI,Arial,sans-serif";
  for (const chLetter of letters) {
    const g2 = ctx.createLinearGradient(x0, tileY, x0 + tileW, tileY + tileH);
    g2.addColorStop(0, "#5fd0e0");
    g2.addColorStop(0.35, "#2aafc0");
    g2.addColorStop(0.7, "#148a9a");
    g2.addColorStop(1, "#0a5c68");
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.roundRect(x0, tileY, tileW, tileH, 14);
    ctx.fill();
    const sheen = ctx.createLinearGradient(x0, tileY, x0, tileY + tileH * 0.5);
    sheen.addColorStop(0, "rgba(255,255,255,0.28)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sheen;
    ctx.beginPath();
    ctx.roundRect(x0 + 2, tileY + 2, tileW - 4, tileH * 0.4, 12);
    ctx.fill();
    ctx.fillStyle = "#0a1218";
    ctx.fillText(chLetter, x0 + tileW / 2, tileY + tileH / 2 + 3);
    x0 += tileW + gap;
  }

  const tx = x0 + 22;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#5ec8d8";
  ctx.font = "600 64px system-ui,Segoe UI,Arial,sans-serif";
  ctx.fillText("designs.com", tx, ch * 0.4);

  ctx.strokeStyle = "#3ab8c8";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(tx, ch * 0.56);
  ctx.lineTo(cw - 52, ch * 0.56);
  ctx.stroke();

  ctx.fillStyle = "#7a8a98";
  ctx.font = "500 26px system-ui,Segoe UI,Arial,sans-serif";
  ctx.letterSpacing = "0.12em";
  ctx.fillText("LAB SYSTEMS", tx, ch * 0.72);
  ctx.letterSpacing = "0px";

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(plateW - 0.012, plateH - 0.012),
    new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.35,
      metalness: 0.15,
      side: THREE.DoubleSide,
    })
  );
  face.position.z = plateD / 2 + 0.0015;
  g.add(face);

  // Four micro corner screws
  const scMat = M(0x3a424c, { r: 0.4, m: 0.6 });
  const ox = plateW / 2 - 0.014;
  const oy = plateH / 2 - 0.014;
  for (const [sx, sy] of [
    [-ox, oy],
    [ox, oy],
    [-ox, -oy],
    [ox, -oy],
  ]) {
    const head = cyl(0.007, 0.007, 0.004, scMat, 10);
    head.rotation.x = Math.PI / 2;
    head.position.set(sx, sy, plateD / 2 + 0.003);
    g.add(head);
    const slot = box(0.006, 0.0012, 0.0015, M(0x111, { r: 0.7 }));
    slot.position.set(sx, sy, plateD / 2 + 0.005);
    g.add(slot);
  }

  return g;
}

export const createSREdesignsBadge = makeSREdesignsBadge;

// ---------------------------------------------------------------------------
// 7. Laboratory Bench Accessories (Weigh Boats, Spatula, Powder, Weights)
function createBenchAccessories(parent, baseY) {
  const accGroup = new THREE.Group();

  // Polystyrene Weighing Boat
  weighBoatMesh = new THREE.Group();
  weighBoatMesh.position.set(2.5, baseY + 0.04, -0.6);

  const boatShape = new THREE.Shape();
  boatShape.moveTo(-0.25, -0.25);
  boatShape.lineTo(0.25, -0.25);
  boatShape.lineTo(0.35, 0.25);
  boatShape.lineTo(-0.35, 0.25);
  boatShape.closePath();

  const boatGeo = new THREE.ExtrudeGeometry(boatShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 });
  const boatMat = M(0xf0f8ff, { r: 0.1, m: 0.05, o: 0.75 });
  const boatBody = new THREE.Mesh(boatGeo, boatMat);
  boatBody.rotation.x = Math.PI / 2;
  boatBody.name = "Weigh_Boat";
  boatBody.userData = { interactive: true, action: "weigh_boat", label: "Weigh Boat (Click to place on pan / return to bench)" };
  weighBoatMesh.add(boatBody);
  accGroup.add(weighBoatMesh);

  // Stainless Steel Micro-Spatula
  const spatulaGroup = new THREE.Group();
  spatulaGroup.position.set(2.5, baseY + 0.02, 0.2);
  spatulaGroup.rotation.y = 0.2;

  const handle = box(0.08, 0.02, 1.2, matChrome);
  handle.name = "Spatula";
  handle.userData = { interactive: true, action: "spatula", label: "Micro-Spatula (Click to add powder sample)" };
  spatulaGroup.add(handle);

  const blade = box(0.14, 0.005, 0.4, matChrome);
  blade.position.z = -0.7;
  blade.name = "Spatula_Blade";
  blade.userData = { interactive: true, action: "spatula", label: "Micro-Spatula (Click to add powder sample)" };
  spatulaGroup.add(blade);

  const spoon = cyl(0.08, 0.08, 0.02, matChrome, 16);
  spoon.position.z = 0.7;
  spoon.name = "Spatula_Spoon";
  spoon.userData = { interactive: true, action: "spatula", label: "Micro-Spatula (Click to add powder sample)" };
  spatulaGroup.add(spoon);
  accGroup.add(spatulaGroup);

  // Class E2 Stainless Steel Calibration Weight (100.0000 g)
  calWeightMesh = new THREE.Group();
  calWeightMesh.position.set(-2.5, baseY + 0.15, -0.6);

  const w100 = cyl(0.18, 0.18, 0.3, matChrome, 24);
  w100.name = "Cal_Weight";
  w100.userData = { interactive: true, action: "cal_weight", label: "100.0000g Class E2 Weight (Click to test on pan)" };
  calWeightMesh.add(w100);

  const knob100 = cyl(0.08, 0.08, 0.1, matChrome, 16);
  knob100.position.y = 0.2;
  knob100.name = "Cal_Weight_Knob";
  knob100.userData = { interactive: true, action: "cal_weight", label: "100.0000g Class E2 Weight (Click to test on pan)" };
  calWeightMesh.add(knob100);
  accGroup.add(calWeightMesh);

  parent.add(accGroup);
}

// ---------------------------------------------------------------------------
// 8. Power Cable Routing & IEC C13 Molded Plug
// ---------------------------------------------------------------------------
function createPowerCord(parent, fromPos, toPos) {
  const cordGroup = new THREE.Group();

  // Molded IEC C13 Right-Angle / Straight Female Power Connector Boot
  const plugBoot = box(0.18, 0.14, 0.22, matRubber);
  plugBoot.position.set(fromPos.x, fromPos.y, fromPos.z + 0.10);
  plugBoot.name = "Power_Plug";
  plugBoot.userData = { interactive: true, action: "power_cord", label: "IEC C13 Power Plug (Click to toggle AC connection)" };
  cordGroup.add(plugBoot);

  // Strain relief collar
  const relief = cyl(0.035, 0.045, 0.08, matRubber, 12);
  relief.rotation.x = Math.PI / 2;
  relief.position.set(fromPos.x, fromPos.y, fromPos.z + 0.24);
  cordGroup.add(relief);

  // Molded NEMA 5-15 AC Wall Plug at the duplex outlet
  const wallPlug = box(0.14, 0.16, 0.14, matRubber);
  wallPlug.position.set(toPos.x, toPos.y, toPos.z - 0.06);
  wallPlug.name = "Wall_Plug";
  wallPlug.userData = { interactive: true, action: "power_cord", label: "AC Wall Outlet Plug" };
  cordGroup.add(wallPlug);

  // Realistic catenary curve dropping smoothly down to bench and rising to outlet
  const p0 = new THREE.Vector3(fromPos.x, fromPos.y, fromPos.z + 0.26);
  const p1 = new THREE.Vector3(fromPos.x + 0.15, BENCH.surfaceY + 0.02, fromPos.z + 0.15);
  const p2 = new THREE.Vector3(toPos.x - 0.20, BENCH.surfaceY + 0.02, toPos.z - 0.15);
  const p3 = new THREE.Vector3(toPos.x, toPos.y - 0.05, toPos.z - 0.10);

  const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
  const cordGeo = new THREE.TubeGeometry(curve, 36, 0.022, 10, false);
  const cord = new THREE.Mesh(cordGeo, matRubber);
  cord.castShadow = true;
  cord.name = "Power_Cord";
  cord.userData = { interactive: true, action: "power_cord", label: "IEC Power Cord (Click to toggle AC connection)" };
  cordGroup.add(cord);

  parent.add(cordGroup);
}

// ---------------------------------------------------------------------------
// External Control & Animation APIs
// ---------------------------------------------------------------------------

/**
 * Animate sliding draft shield doors (0 = closed, 1 = fully open).
 */
export function setDraftDoorsOpen(leftAmount, rightAmount, topAmount) {
  const MAX_SLIDE = 0.92;
  if (doorLeftGroup) {
    doorLeftGroup.position.z = leftAmount * MAX_SLIDE;
  }
  if (doorRightGroup) {
    doorRightGroup.position.z = rightAmount * MAX_SLIDE;
  }
  if (doorTopGroup) {
    doorTopGroup.position.z = topAmount * MAX_SLIDE;
  }
}

/**
 * Place or remove the weigh boat on the weighing pan.
 */
export function setWeighBoatOnPan(onPan) {
  if (weighBoatMesh) {
    if (onPan) {
      weighBoatMesh.position.set(0, BENCH.surfaceY + 0.88 + 0.28 + 0.04, 0.40);
    } else {
      weighBoatMesh.position.set(2.5, BENCH.surfaceY + 0.04, -0.6);
    }
  }
}

/**
 * Place or remove the 100g calibration weight on the pan.
 */
export function setCalWeightOnPan(onPan) {
  if (calWeightMesh) {
    if (onPan) {
      calWeightMesh.position.set(0, BENCH.surfaceY + 0.88 + 0.28 + 0.15, 0.40);
    } else {
      calWeightMesh.position.set(-2.5, BENCH.surfaceY + 0.15, -0.6);
    }
  }
}

/**
 * Update chemical powder pile inside the weigh boat.
 */
export function updateSamplePowder(grams, colorHex = 0xffffff) {
  if (!weighBoatMesh) return;
  if (grams <= 0.0001) {
    if (sampleMesh) {
      if (sampleMesh.parent) sampleMesh.parent.remove(sampleMesh);
      sampleMesh = null;
    }
    return;
  }
  if (!sampleMesh) {
    const powderGeo = new THREE.ConeGeometry(0.18, 0.08, 16);
    const powderMat = M(colorHex, { r: 0.9, m: 0.0 });
    sampleMesh = new THREE.Mesh(powderGeo, powderMat);
    sampleMesh.position.set(0, 0.05, 0);
    weighBoatMesh.add(sampleMesh);
  }
  const scale = Math.min(1.8, 0.6 + grams * 0.25);
  sampleMesh.scale.set(scale, scale, scale);
}

/**
 * Update tilt bubble position on the spirit level.
 */
export function updateBubblePosition(pitch, roll) {
  if (bubbleMesh) {
    const maxOffset = 0.045;
    bubbleMesh.position.x = Math.max(-maxOffset, Math.min(maxOffset, roll * 0.02));
    bubbleMesh.position.z = 0.001 + Math.max(-maxOffset, Math.min(maxOffset, pitch * 0.02));
  }
}

/**
 * Connect CanvasTexture to procedural balance screen.
 */
export function setLcdTexture(texture) {
  if (lcdMesh) {
    lcdMesh.material = new THREE.MeshBasicMaterial({ map: texture });
    lcdMesh.material.needsUpdate = true;
  }
}

/**
 * Animate exploded view separation.
 */
export function setExplodeAmount(t) {
  const amount = Math.max(0, Math.min(1, t));
  explodeParts.forEach(({ group, base, offset }) => {
    group.position.copy(base).addScaledVector(offset, amount);
  });
}

/**
 * Toggle wireframe display.
 */
export function setWireframe(enabled) {
  if (!balanceRoot) return;
  balanceRoot.traverse((child) => {
    if (child.isMesh && child !== lcdMesh) {
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => { m.wireframe = enabled; });
      } else if (child.material) {
        child.material.wireframe = enabled;
      }
    }
  });
}

/**
 * Convenience aliases for app.js workflow bindings.
 */
export function setDoorOpen(doorName, amount) {
  const MAX_SLIDE = 0.92; // Smooth realistic slide travel within guide tracks
  if (doorName === 'left' && doorLeftGroup) {
    doorLeftGroup.position.z = amount * MAX_SLIDE;
  } else if (doorName === 'right' && doorRightGroup) {
    doorRightGroup.position.z = amount * MAX_SLIDE;
  } else if (doorName === 'top' && doorTopGroup) {
    doorTopGroup.position.z = amount * MAX_SLIDE;
  }
}

export function setSpiritBubblePosition(pitch, roll) {
  updateBubblePosition(pitch, roll);
}

export function setBoatOnPan(onPan) {
  setWeighBoatOnPan(onPan);
}

export function setSamplePowder(loadedOrGrams, colorHex = 0xffffff) {
  const grams = typeof loadedOrGrams === 'boolean' ? (loadedOrGrams ? 0.5 : 0) : loadedOrGrams;
  updateSamplePowder(grams, colorHex);
}

export function setPowerState(isOn) {
  if (pwrLedMesh && pwrLedMesh.material) {
    pwrLedMesh.material.color.setHex(isOn ? 0x3dd68c : 0x401015);
    pwrLedMesh.material.emissive.setHex(isOn ? 0x3dd68c : 0x000000);
    pwrLedMesh.material.emissiveIntensity = isOn ? 0.8 : 0.0;
  }
}

export function rotateFootKnob(side, deltaRad = 0.4) {
  const target = side === 'left' ? knobLeftMesh : knobRightMesh;
  if (target) {
    target.rotation.y += deltaRad;
  }
}

