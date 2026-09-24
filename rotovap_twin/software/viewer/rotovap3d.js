/**
 * Büchi Rotavapor R-300 Class Rotary Evaporator Twin (Three.js)
 * 
 * Exhaustive procedural design:
 * - Heavy cast aluminum base plate with DIN 912 screws, washers & vibration damping feet
 * - Motorized vertical lift tower with Acme lead screw, guide rails & linear carriage
 * - 40° angled drive head with BLDC rotation motor, hollow shaft, Combi-Clip & PTFE vacuum seal
 * - Borosilicate glass vapor duct (NS 29/32) & aeration stopcock valve
 * - Heating Bath (Büchi B-300): insulated double-walled basin, PTFE coating, PT1000 probe, dual handles
 * - 1000 mL pear-shaped evaporating flask with liquid vortex & climbing film
 * - Vertical double-spiral coiled condenser (1500 cm²) with GL-14 hose connections
 * - 1000 mL spherical receiving flask with S 35/20 ball joint clamp & condensate drip droplets
 * - I-300 Pro graphical CanvasTexture vacuum/bath controller with rotary push-dial facing front (-Z)
 * - Full photorealistic laboratory room environment (floor tiles, walls, ceiling lights, black-top lab table with legs, apron, duplex outlet & power cord)
 * - Exploded view animations, wireframe mode, motorized lift translation & flask rotation
 * 
 * Units: 1 unit ≈ 100 mm (width 4.5 ≈ 450 mm, height ~8.5 ≈ 850 mm). Y-up, front = -Z.
 */

import * as THREE from 'three';
import {
  createHexSocketScrew,
  createWasher,
  createVibrationFoot,
  createIECInlet,
  createRockerSwitch,
} from '../../../lab_viewer/shared/hardware_library.js';

// ---------------------------------------------------------------------------
// Material Palette
// ---------------------------------------------------------------------------
const M = (color, o = {}) => new THREE.MeshStandardMaterial({
  color,
  roughness: o.r ?? 0.35,
  metalness: o.m ?? 0.1,
  transparent: o.o != null && o.o < 1,
  opacity: o.o ?? 1,
  emissive: new THREE.Color(o.e ?? 0x000000),
  emissiveIntensity: o.ei ?? 0,
  side: o.side ?? THREE.FrontSide,
  depthWrite: o.dw ?? true,
});

const matWhiteChassis = M(0xf6f8fa, { r: 0.32, m: 0.06 });
const matDarkChassis  = M(0x1e222a, { r: 0.45, m: 0.15 });
const matAlumBrushed  = M(0xc8cdd5, { r: 0.28, m: 0.82 });
const matChrome       = M(0xeef3f8, { r: 0.1, m: 0.96 });
const matLeadScrew    = M(0x8e96a2, { r: 0.35, m: 0.85 });
const matPtfeBlack    = M(0x16181b, { r: 0.75, m: 0.05 }); // Non-stick bath coating
const matBathSteel    = M(0x4a5160, { r: 0.28, m: 0.65 });
const matRubber       = M(0x111316, { r: 0.92, m: 0.02 });
const matBrass        = M(0xd4af37, { r: 0.28, m: 0.85 });
const matGlass        = M(0xf0f7fd, { r: 0.03, m: 0.06, o: 0.24 });
const matWater        = M(0x38bdf8, { r: 0.08, m: 0.05, o: 0.75 });
const matSolvent      = M(0xf59e0b, { r: 0.1, m: 0.05, o: 0.82 }); // Amber/organic solution
const matDistillate   = M(0xe0f2fe, { r: 0.05, m: 0.05, o: 0.7 });
const matCoolant      = M(0x06b6d4, { r: 0.1, m: 0.1, o: 0.8 });
const matKeckClip     = M(0x2563eb, { r: 0.38, m: 0.12 }); // Blue Büchi Combi-Clip

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
  sz: 5.6,
  bodyH: 8.30, // 830 mm base cabinet
  topT: 0.70,  // 70 mm solid epoxy countertop
  get surfaceY() {
    return this.bodyH + this.topT; // 9.00 units = 900 mm standing height
  },
  get outlet() {
    const rearZ = this.cz + this.sz / 2 - 0.05;
    return {
      x: 1.6,
      y: this.surfaceY + 1.20,
      z: rearZ,
    };
  },
};

// Sub-assembly and node references
let rotovapRoot = null;
let liftCarriageGroup = null;
let rotatingDriveShaft = null;
let rotatingFlaskGroup = null;
let flaskLiquidMesh = null;
let receiverLiquidMesh = null;
let bathLiquidMesh = null;
let dripMesh = null;
let controllerLcdMesh = null;

// Lift parameters
const LIFT_MIN_Y = 0.0;
const LIFT_MAX_Y = 1.80;

// Exploded view tracker: { group, base, offset }
const explodeParts = [];

/**
 * Duplex AC outlet face + sockets on rear backsplash.
 */
function addDuplexOutlet(parent, x, y, z) {
  const matPlate = M(0xd8dce0, { r: 0.35, m: 0.55 });
  const matBody = M(0xf2f4f6, { r: 0.45, m: 0.08 });
  const matHole = M(0x121418, { r: 0.7, m: 0.05 });
  const matScrew = M(0xb0b6bc, { r: 0.35, m: 0.7 });

  const plate = box(0.24, 0.30, 0.02, matPlate);
  plate.position.set(x, y, z);
  plate.name = "Lab_Outlet_Plate";
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

  // Fluorescent lighting panels
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

  // Table cross-stretchers
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

  // Anodized steel edge trim around countertop perimeter
  const edge = box(ib.sx + 0.18, 0.03, ib.sz + 0.18, matSteel);
  edge.position.set(ib.cx, ib.surfaceY - 0.015, ib.cz);
  lab.add(edge);

  // Rear laboratory backsplash with integrated electrical service
  const bsH = 1.60;
  const bsD = 0.18;
  const bsZ = ib.cz + ib.sz / 2 - bsD / 2 + 0.05;
  const splash = box(ib.sx + 0.15, bsH, bsD, matBench);
  splash.position.set(ib.cx, ib.surfaceY + bsH / 2, bsZ);
  lab.add(splash);

  // Duplex outlet on backsplash
  const outletPos = addDuplexOutlet(lab, ib.cx + 1.6, ib.surfaceY + 0.60, bsZ - bsD / 2 - 0.01);

  root.add(lab);
  return { lab, outletPos };
}

// ---------------------------------------------------------------------------
// Official SREdesigns Canonical Laboratory Badge (from centrifuge_twin standard)
// ---------------------------------------------------------------------------
export function makeSREdesignsBadge() {
  const g = new THREE.Group();
  g.name = "SREdesigns_Badge";
  g.userData = {
    interactive: true,
    action: "sredesigns_badge",
    label: "SREdesigns Official Laboratory Digital Twin Engineering Badge",
  };

  const plateW = 0.98;
  const plateH = 0.28;
  const plateD = 0.035;

  // Outer dark bezel frame
  const bezel = box(plateW + 0.05, plateH + 0.05, 0.02, M(0x2a313a, { r: 0.45, m: 0.25 }));
  bezel.position.z = -0.002;
  g.add(bezel);

  // Plate body
  const plate = box(plateW, plateH, plateD, M(0x1a1f26, { r: 0.4, m: 0.3 }));
  g.add(plate);

  // Inner recess rim
  const recess = box(plateW - 0.04, plateH - 0.04, 0.01, M(0x0e1218, { r: 0.5, m: 0.2 }));
  recess.position.z = plateD / 2 - 0.001;
  g.add(recess);

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

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(plateW - 0.05, plateH - 0.05),
    new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.4,
      metalness: 0.25,
      emissive: new THREE.Color(0x041018),
      emissiveIntensity: 0.2,
    })
  );
  face.position.z = plateD / 2 + 0.006;
  g.add(face);

  // Four corner screws
  const scMat = M(0x3a424c, { r: 0.4, m: 0.6 });
  const ox = plateW / 2 - 0.045;
  const oy = plateH / 2 - 0.045;
  for (const [sx, sy] of [
    [-ox, oy],
    [ox, oy],
    [-ox, -oy],
    [ox, -oy],
  ]) {
    const head = cyl(0.02, 0.02, 0.012, scMat, 10);
    head.rotation.x = Math.PI / 2;
    head.position.set(sx, sy, plateD / 2 + 0.01);
    g.add(head);
    const slot = box(0.018, 0.003, 0.004, M(0x111, { r: 0.7 }));
    slot.position.set(sx, sy, plateD / 2 + 0.017);
    g.add(slot);
  }

  return g;
}

export const createSREdesignsBadge = makeSREdesignsBadge;

/**
 * Creates the complete procedural Rotary Evaporator (Büchi R-300 class).
 */
export function createRotovapModel() {
  rotovapRoot = new THREE.Group();
  rotovapRoot.name = "Rotary_Evaporator_R300";
  rotovapRoot.userData = { label: "BÜCHI Rotavapor R-300", type: "instrument" };

  // 1. Build rich laboratory room and black epoxy instrument bench (900mm standing height, 2.8m ceiling)
  const { outletPos } = buildLabRoom(rotovapRoot);
  const baseY = BENCH.surfaceY; // 9.00

  // 2. Base Platform & Fasteners (Elevated on vibration feet, bottom at baseY + 0.08)
  const baseGroup = new THREE.Group();
  baseGroup.position.set(0, baseY, 0);
  createBasePlatform(baseGroup);
  rotovapRoot.add(baseGroup);
  explodeParts.push({ group: baseGroup, base: new THREE.Vector3(0, baseY, 0), offset: new THREE.Vector3(0, -0.5, 0) });

  // 3. Heating Bath B-300 (Mounted on right side at X = +1.20, Z = 0.00)
  const bathGroup = new THREE.Group();
  bathGroup.position.set(1.20, baseY + 0.40, 0.00);
  createHeatingBath(bathGroup);
  rotovapRoot.add(bathGroup);
  explodeParts.push({ group: bathGroup, base: new THREE.Vector3(1.20, baseY + 0.40, 0.00), offset: new THREE.Vector3(1.1, 0, -0.4) });

  // 4. Vertical Lift Tower (Fixed extruded column on left at X = -1.05, Z = 0.20)
  const towerGroup = new THREE.Group();
  towerGroup.position.set(-1.05, baseY + 0.40, 0.20);
  createLiftTower(towerGroup);
  rotovapRoot.add(towerGroup);
  explodeParts.push({ group: towerGroup, base: new THREE.Vector3(-1.05, baseY + 0.40, 0.20), offset: new THREE.Vector3(-0.9, 0, 0.6) });

  // 5. Motorized Lift Carriage & Glassware Assembly
  liftCarriageGroup = new THREE.Group();
  liftCarriageGroup.position.set(-1.05, baseY + 0.40 + LIFT_MIN_Y, 0.20);
  createCarriageAndGlassware(liftCarriageGroup);
  rotovapRoot.add(liftCarriageGroup);

  // 6. I-300 Pro Digital Controller Interface (Mounted on rigid articulated aluminum arm)
  const ctrlGroup = new THREE.Group();
  ctrlGroup.position.set(-1.25, baseY + 1.25, -0.60);
  createControllerInterface(ctrlGroup);
  rotovapRoot.add(ctrlGroup);
  explodeParts.push({ group: ctrlGroup, base: new THREE.Vector3(-1.25, baseY + 1.25, -0.60), offset: new THREE.Vector3(-0.9, 0, -0.8) });

  // 7. Heavy-duty power cord from back of base to duplex outlet
  createPowerCord(rotovapRoot, new THREE.Vector3(0.3, baseY + 0.24, 1.71), new THREE.Vector3(outletPos.x, outletPos.y, outletPos.z));

  return rotovapRoot;
}

// ---------------------------------------------------------------------------
// 2. Base Platform, Leveling Fasteners & Connectors
// ---------------------------------------------------------------------------
function createBasePlatform(parent) {
  // Heavy cast aluminum base casting
  // Elevated cleanly off bench on 4 vibration-damping feet (bottom of casting at Y = 0.10)
  const baseCasting = box(4.4, 0.32, 3.4, matWhiteChassis);
  baseCasting.position.set(0, 0.26, 0);
  parent.add(baseCasting);

  // Beveled edge trim along bottom of casting
  const baseTrim = box(4.44, 0.04, 3.44, matDarkChassis);
  baseTrim.position.set(0, 0.12, 0);
  parent.add(baseTrim);

  // Precision brushed aluminum top deck plate (at Y = 0.42 to 0.45)
  const deckPlate = box(4.42, 0.03, 3.42, matAlumBrushed);
  deckPlate.position.set(0, 0.435, 0);
  parent.add(deckPlate);

  // Recessed locating ring for heating bath base plate on right
  const bathRecess = cyl(1.42, 1.42, 0.03, matDarkChassis, 36);
  bathRecess.position.set(1.3, 0.46, -0.1);
  parent.add(bathRecess);

  // Tower mounting flange socket on left
  const towerFlange = box(1.1, 0.05, 1.0, matDarkChassis);
  towerFlange.position.set(-0.9, 0.46, 0.25);
  parent.add(towerFlange);

  // 4 DIN 912 socket screws mounting the tower flange to base
  for (const sx of [-0.42, 0.42]) {
    for (const sz of [-0.38, 0.38]) {
      const screw = createHexSocketScrew(0.022, 0.08);
      screw.position.set(-0.9 + sx, 0.49, 0.25 + sz);
      parent.add(screw);
      const washer = createWasher(0.023, 0.045, 0.008);
      washer.position.set(-0.9 + sx, 0.49, 0.25 + sz);
      parent.add(washer);
    }
  }

  // 4 Vibration-Damping Rubber Feet with Knurled Brass Leveling Wheels
  // Underneath corners of casting: X = ±1.85, Z = ±1.35
  // Height 0.10: rests firmly on bench surface (Y = 0 to 0.10)
  const footPositions = [
    [-1.85, -1.35], [1.85, -1.35],
    [-1.85, 1.35],  [1.85, 1.35],
  ];
  footPositions.forEach(([fx, fz], idx) => {
    const footGroup = new THREE.Group();
    footGroup.position.set(fx, 0, fz);

    // Rubber foot pad resting on bench (Y = 0 to 0.06)
    const pad = cyl(0.18, 0.20, 0.06, matRubber, 24);
    pad.position.y = 0.03;
    footGroup.add(pad);

    // Knurled brass leveling thumbwheel (Y = 0.06 to 0.10)
    const knurl = cyl(0.20, 0.20, 0.04, matBrass, 24);
    knurl.position.y = 0.08;
    footGroup.add(knurl);

    // Fluted edge ribs on knurled wheel
    for (let a = 0; a < 12; a++) {
      const rib = box(0.012, 0.04, 0.016, M(0x997722, { r: 0.4 }));
      const rad = (a / 12) * Math.PI * 2;
      rib.position.set(Math.cos(rad) * 0.20, 0.08, Math.sin(rad) * 0.20);
      rib.rotation.y = -rad;
      footGroup.add(rib);
    }

    // Steel stud extending into casting
    const stud = cyl(0.04, 0.04, 0.08, matChrome, 12);
    stud.position.y = 0.12;
    footGroup.add(stud);

    footGroup.name = `Foot_Level_${idx}`;
    footGroup.userData = { interactive: true, action: "foot_level", label: "Vibration Damping Leveling Foot" };
    parent.add(footGroup);
  });

  // Rear panel (+Z): IEC C14 power inlet & Rocker Power switch
  const iec = createIECInlet();
  iec.rotation.y = Math.PI; // Face +Z
  iec.position.set(0.3, 0.26, 1.71);
  parent.add(iec);

  const pwrSwitch = createRockerSwitch({ orientation: 'vertical', frameColor: 0x181a1e, rockerColor: 0x108844 });
  pwrSwitch.rotation.y = Math.PI;
  pwrSwitch.position.set(-0.4, 0.26, 1.71);
  parent.add(pwrSwitch);

  // -------------------------------------------------------------------------
  // SREdesigns Official Precision Engineering Badge on Front Face (-Z)
  // -------------------------------------------------------------------------
  const sreBadge = makeSREdesignsBadge(0.72, 0.15);
  sreBadge.position.set(-0.35, 0.26, -1.72);
  sreBadge.rotation.y = Math.PI; // Face -Z (Front of machine)
  parent.add(sreBadge);

  // Büchi R-300 Brand Nameplate on front face (-Z)
  const plate = box(1.3, 0.15, 0.015, matDarkChassis);
  plate.position.set(0.95, 0.26, -1.71);
  parent.add(plate);

  const logoMark = box(0.35, 0.07, 0.02, M(0x00d4e8, { r: 0.2, m: 0.4 }));
  logoMark.position.set(0.60, 0.26, -1.72);
  parent.add(logoMark);
}

// ---------------------------------------------------------------------------
// 3. Heating Bath B-300
// ---------------------------------------------------------------------------
function createHeatingBath(parent) {
  parent.userData = { interactive: true, action: "heating_bath", label: "Büchi B-300 Heating Bath (Click to Toggle Heat)" };

  // Double-walled stainless steel outer basin
  const outerWall = cyl(1.35, 1.35, 1.05, matBathSteel, 36);
  outerWall.position.y = 0.525;
  parent.add(outerWall);

  // Insulated top rim
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.34, 0.06, 16, 36), matBathSteel);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1.05;
  parent.add(rim);

  // Non-stick PTFE black coated inner basin
  const innerWall = cyl(1.22, 1.22, 0.95, matPtfeBlack, 36);
  innerWall.position.y = 0.58;
  parent.add(innerWall);

  // Water bath fluid surface
  const waterGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.02, 36);
  bathLiquidMesh = new THREE.Mesh(waterGeo, matWater);
  bathLiquidMesh.position.y = 0.88;
  parent.add(bathLiquidMesh);

  // Dual insulated heat-resistant carry handles
  for (const sign of [-1, 1]) {
    const handle = box(0.12, 0.22, 0.45, matDarkChassis);
    handle.position.set(sign * 1.48, 0.65, 0);
    parent.add(handle);
  }

  // PT1000 Stainless Steel Temperature Sensor Probe
  const probeStem = cyl(0.025, 0.025, 0.8, matChrome, 12);
  probeStem.position.set(0.95, 0.75, -0.55);
  parent.add(probeStem);

  // Bath Front Control Display & Status LED facing -Z
  const bathCtrl = box(0.9, 0.35, 0.08, matDarkChassis);
  bathCtrl.position.set(0, 0.38, -1.36);
  parent.add(bathCtrl);

  const bathLcd = box(0.5, 0.18, 0.02, M(0x00d4e8, { r: 0.1, e: 0x004455, ei: 0.8 }));
  bathLcd.position.set(-0.12, 0.38, -1.41);
  parent.add(bathLcd);

  const bathKnob = cyl(0.09, 0.09, 0.06, matAlumBrushed, 24);
  bathKnob.rotation.x = Math.PI / 2;
  bathKnob.position.set(0.28, 0.38, -1.42);
  parent.add(bathKnob);
}

// ---------------------------------------------------------------------------
// 4. Vertical Lift Tower
// ---------------------------------------------------------------------------
function createLiftTower(parent) {
  parent.userData = { interactive: true, action: "lift_toggle", label: "Motorized Lift Column (Click to Raise/Lower)" };

  // Main extruded aluminum structural column (height 5.2)
  const col = box(0.95, 5.2, 0.85, matWhiteChassis);
  col.position.y = 2.6;
  parent.add(col);

  // Front Guide Rails Channel (dual chrome steel shafts facing -Z / front)
  for (const sx of [-0.22, 0.22]) {
    const shaft = cyl(0.04, 0.04, 5.0, matChrome, 16);
    shaft.position.set(sx, 2.6, -0.42);
    parent.add(shaft);
  }

  // Precision Stainless Steel Acme Lead Screw (Central lifting screw)
  const leadScrew = cyl(0.06, 0.06, 5.0, matLeadScrew, 24);
  leadScrew.position.set(0, 2.6, -0.42);
  parent.add(leadScrew);

  // Top actuator cap with manual emergency override knob
  const topCap = box(0.98, 0.2, 0.88, matDarkChassis);
  topCap.position.y = 5.3;
  parent.add(topCap);

  const overrideKnob = cyl(0.18, 0.18, 0.12, matAlumBrushed, 24);
  overrideKnob.position.y = 5.46;
  parent.add(overrideKnob);
}

// ---------------------------------------------------------------------------
// 5. Motorized Lift Carriage & Glassware Assembly
// ---------------------------------------------------------------------------
function createCarriageAndGlassware(parent) {
  // Linear carriage bracket sliding on tower
  const carriageBracket = box(1.02, 1.25, 0.80, matDarkChassis);
  carriageBracket.position.set(0, 1.5, -0.28);
  parent.add(carriageBracket);

  // Rigid cast arm extending to the right
  const arm = box(1.65, 0.45, 0.55, matWhiteChassis);
  arm.position.set(0.95, 1.55, -0.25);
  parent.add(arm);

  // -------------------------------------------------------------------------
  // Drive Head Casting & Axis Orientation (Büchi R-300 Sleek Contoured Unit)
  // 35° tilt angle cleanly oriented towards heating bath
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // Drive Head Casting & Axis Orientation (Büchi R-300 Sleek Contoured Unit)
  // 35° tilt angle cleanly oriented towards heating bath on the right
  // -------------------------------------------------------------------------
  const driveHeadGroup = new THREE.Group();
  driveHeadGroup.position.set(1.25, 1.70, -0.05);

  const vDir = new THREE.Vector3(0.8192, -0.5735, -0.04).normalize();
  driveHeadGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), vDir);

  // Aerodynamic contoured white drive motor housing (aligned with local Z)
  const driveHousing = cyl(0.40, 0.40, 0.92, matWhiteChassis, 36);
  driveHousing.rotation.x = Math.PI / 2;
  driveHousing.position.z = 0.0;
  driveHeadGroup.add(driveHousing);

  // Rear rounded cap
  const rearCap = new THREE.Mesh(new THREE.SphereGeometry(0.40, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), matWhiteChassis);
  rearCap.rotation.x = -Math.PI / 2;
  rearCap.position.z = -0.46;
  driveHeadGroup.add(rearCap);

  // Front brushed aluminum collet collar ring
  const colletTrim = cyl(0.41, 0.41, 0.05, matAlumBrushed, 36);
  colletTrim.rotation.x = Math.PI / 2;
  colletTrim.position.z = 0.46;
  driveHeadGroup.add(colletTrim);

  // Büchi signature cobalt blue accent ring
  const blueBand = cyl(0.405, 0.405, 0.035, matKeckClip, 36);
  blueBand.rotation.x = Math.PI / 2;
  blueBand.position.z = 0.33;
  driveHeadGroup.add(blueBand);

  // Hollow drive shaft with Combi-Clip mechanism (Rotates around local Z)
  rotatingDriveShaft = new THREE.Group();
  driveHeadGroup.add(rotatingDriveShaft);

  const shaftCollet = cyl(0.22, 0.26, 0.22, matAlumBrushed, 24);
  shaftCollet.rotation.x = Math.PI / 2;
  shaftCollet.position.z = 0.52;
  rotatingDriveShaft.add(shaftCollet);

  // Quick-release Combi-Clip (Büchi royal blue ergonomic latch)
  const combiClip = box(0.28, 0.15, 0.16, matKeckClip);
  combiClip.position.z = 0.62;
  combiClip.userData = { interactive: true, action: "combi_clip", label: "Combi-Clip Quick-Release Flask Clamp" };
  rotatingDriveShaft.add(combiClip);

  // 1000 mL Pear-Shaped Evaporating Flask
  rotatingFlaskGroup = new THREE.Group();
  rotatingFlaskGroup.position.z = 0.74;
  rotatingDriveShaft.add(rotatingFlaskGroup);

  // Flask Neck (NS 29/32 precision ground glass joint)
  const neck = cyl(0.13, 0.13, 0.38, matGlass, 24);
  neck.rotation.x = Math.PI / 2;
  neck.position.z = 0.10;
  rotatingFlaskGroup.add(neck);

  // Flask Pear-shaped Bulb (proportioned to fit gracefully inside heating bath)
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), matGlass);
  bulb.scale.set(1.0, 1.0, 1.25);
  bulb.position.z = 0.50;
  bulb.userData = { interactive: true, action: "evap_flask", label: "1000 mL Evaporating Flask (Click to Toggle Rotation)" };
  rotatingFlaskGroup.add(bulb);

  // Liquid Solution inside Evaporating Flask (Golden amber organic solvent)
  const liquidGeo = new THREE.SphereGeometry(0.51, 24, 24);
  liquidGeo.scale(0.96, 0.96, 1.18);
  flaskLiquidMesh = new THREE.Mesh(liquidGeo, matSolvent);
  flaskLiquidMesh.position.z = 0.52;
  rotatingFlaskGroup.add(flaskLiquidMesh);

  parent.add(driveHeadGroup);

  // -------------------------------------------------------------------------
  // Borosilicate Glass Vapor Duct Connecting Drive Head to Condenser Manifold
  // -------------------------------------------------------------------------
  const vaporDuctGroup = new THREE.Group();
  const vPts = [
    new THREE.Vector3(1.25 - 0.46 * vDir.x, 1.70 - 0.46 * vDir.y, -0.05 - 0.46 * vDir.z),
    new THREE.Vector3(0.65, 2.05, 0.05),
    new THREE.Vector3(0.20, 2.10, 0.10),
  ];
  const vCurve = new THREE.CatmullRomCurve3(vPts);
  const vaporTube = new THREE.Mesh(new THREE.TubeGeometry(vCurve, 20, 0.07, 14, false), matGlass);
  vaporDuctGroup.add(vaporTube);
  parent.add(vaporDuctGroup);

  // -------------------------------------------------------------------------
  // Vertical Double-Spiral Coiled Condenser & Receiving Flask Assembly
  // Positioned on left side at carriage local: X = 0.20, Y = 2.10, Z = 0.10
  // (Safely over the left deck, completely clear of heating bath)
  // -------------------------------------------------------------------------
  const condenserAssemblyGroup = new THREE.Group();
  condenserAssemblyGroup.position.set(0.20, 2.10, 0.10);

  // Glass 3-way manifold junction
  const manifold = cyl(0.16, 0.16, 0.44, matGlass, 20);
  manifold.position.y = 0;
  condenserAssemblyGroup.add(manifold);

  // Vacuum Aeration Stopcock Valve on manifold facing -Z
  const stopcockGroup = new THREE.Group();
  stopcockGroup.position.set(0, 0.08, -0.16);
  stopcockGroup.name = "Valve_Aeration";
  stopcockGroup.userData = { interactive: true, action: "stopcock", label: "Aeration Stopcock Valve (Click to Release Vacuum)" };

  const valveStem = cyl(0.035, 0.035, 0.15, matGlass, 12);
  valveStem.rotation.x = Math.PI / 2;
  stopcockGroup.add(valveStem);

  const valveHandle = box(0.13, 0.045, 0.035, M(0x2563eb, { r: 0.3 })); // Blue PTFE handle
  valveHandle.position.z = -0.08;
  stopcockGroup.add(valveHandle);

  condenserAssemblyGroup.add(stopcockGroup);

  // 1000 mL Spherical Receiving Flask (Hanging below manifold)
  const receiverGroup = new THREE.Group();
  receiverGroup.position.set(0, -0.78, 0);

  // Receiving Flask Glass Bulb
  const rBulb = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 32), matGlass);
  rBulb.userData = { interactive: true, action: "recv_flask", label: "1000 mL Receiving Flask (Click to Empty Distillate)" };
  receiverGroup.add(rBulb);

  // S 35/20 Ball Joint Clamp
  const clamp = box(0.38, 0.10, 0.38, matAlumBrushed);
  clamp.position.y = 0.58;
  receiverGroup.add(clamp);

  // Distillate Solvent Pool in Receiving Flask
  const recLiquidGeo = new THREE.SphereGeometry(0.56, 24, 24);
  recLiquidGeo.scale(0.95, 0.50, 0.95);
  receiverLiquidMesh = new THREE.Mesh(recLiquidGeo, matDistillate);
  receiverLiquidMesh.position.y = -0.25;
  receiverGroup.add(receiverLiquidMesh);

  // Condensate Falling Droplet
  const dropGeo = new THREE.SphereGeometry(0.04, 12, 12);
  dripMesh = new THREE.Mesh(dropGeo, matDistillate);
  dripMesh.position.set(0, 0.35, 0);
  receiverGroup.add(dripMesh);

  condenserAssemblyGroup.add(receiverGroup);

  // Vertical Coiled Condenser (Rising above manifold)
  const condenserGroup = new THREE.Group();
  condenserGroup.position.set(0, 0.24, 0);

  // Outer Glass Vacuum Jacket (Cylindrical tube, height ~3.2)
  const jacket = cyl(0.65, 0.65, 3.2, matGlass, 36);
  jacket.position.y = 1.60;
  condenserGroup.add(jacket);

  // Top Domed Cap
  const topDome = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), matGlass);
  topDome.position.y = 3.20;
  condenserGroup.add(topDome);

  // Top Vacuum Connection Port with hose barb
  const vacPort = cyl(0.05, 0.05, 0.24, matGlass, 14);
  vacPort.position.set(0, 3.32, 0);
  condenserGroup.add(vacPort);

  // Internal Double-Spiral Cooling Coil (Procedural tube helix)
  const helixPoints = [];
  const turns = 14;
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    const angle = t * turns * Math.PI * 2;
    const rad = 0.38;
    const y = 0.25 + t * 2.70;
    helixPoints.push(new THREE.Vector3(Math.cos(angle) * rad, y, Math.sin(angle) * rad));
  }
  const helixCurve = new THREE.CatmullRomCurve3(helixPoints);
  const coilMesh = new THREE.Mesh(new THREE.TubeGeometry(helixCurve, 160, 0.045, 10, false), matCoolant);
  condenserGroup.add(coilMesh);

  // GL-14 Coolant Hose Nozzles (Inlet & Outlet with glass screw caps)
  for (const sy of [0.85, 2.55]) {
    const nozzle = cyl(0.08, 0.08, 0.30, matGlass, 16);
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.set(0.72, sy, 0);
    condenserGroup.add(nozzle);

    const cap = cyl(0.11, 0.11, 0.12, M(0xd97706, { r: 0.4 }), 16); // Amber screw cap
    cap.rotation.z = Math.PI / 2;
    cap.position.set(0.85, sy, 0);
    condenserGroup.add(cap);
  }

  condenserAssemblyGroup.add(condenserGroup);
  parent.add(condenserAssemblyGroup);

  // Exploded view separation targets
  explodeParts.push({ group: condenserAssemblyGroup, base: new THREE.Vector3(0.62, 2.15, -0.05), offset: new THREE.Vector3(0, 1.6, 0) });
  explodeParts.push({ group: driveHeadGroup, base: new THREE.Vector3(1.15, 1.75, -0.15), offset: new THREE.Vector3(0.8, 0.5, 0) });
}

// ---------------------------------------------------------------------------
// 6. I-300 Pro Digital Controller Interface (FACING FRONT -Z TOWARDS USER)
// ---------------------------------------------------------------------------
function createControllerInterface(parent) {
  // Rigid Extruded Aluminum Support Arm extending from Tower Base to Controller
  const armGroup = new THREE.Group();

  // Heavy split-collar clamp around tower column
  const clampCollar = box(1.05, 0.16, 0.95, matDarkChassis);
  clampCollar.position.set(0.65, -0.35, 0.90);
  armGroup.add(clampCollar);

  // Dual DIN 912 M6 clamp bolts
  for (const sz of [-0.35, 0.35]) {
    const bolt = createHexSocketScrew(0.02, 0.06, { material: matChrome });
    bolt.position.set(0.15, -0.35, 0.90 + sz);
    bolt.rotation.z = Math.PI / 2;
    armGroup.add(bolt);
  }

  // Rigid extruded tubular arm running forward-left to controller
  const armPts = [
    new THREE.Vector3(0.65, -0.35, 0.90),
    new THREE.Vector3(0.20, -0.20, 0.40),
    new THREE.Vector3(0.0, 0.0, 0.0),
  ];
  const armCurve = new THREE.CatmullRomCurve3(armPts);
  const armMesh = new THREE.Mesh(new THREE.TubeGeometry(armCurve, 16, 0.045, 10, false), matAlumBrushed);
  armGroup.add(armMesh);

  // Articulated 2-axis ball swivel knuckle at end of arm
  const knuckle = cyl(0.08, 0.08, 0.14, matDarkChassis, 20);
  knuckle.position.set(0, -0.06, 0);
  armGroup.add(knuckle);

  parent.add(armGroup);

  // Controller Housing angled ~22° upwards towards user
  const ctrlHousing = new THREE.Group();
  ctrlHousing.rotation.x = Math.PI * 0.13;
  ctrlHousing.rotation.y = -Math.PI * 0.10;

  // Controller enclosure box
  const boxMesh = box(1.8, 1.4, 0.32, matWhiteChassis);
  ctrlHousing.add(boxMesh);

  // Front dark screen bezel facing -Z
  const bezel = box(1.72, 1.32, 0.02, matDarkChassis);
  bezel.position.z = -0.165;
  ctrlHousing.add(bezel);

  // 4.3" High-Contrast CanvasTexture Display (rotates Math.PI to face -Z)
  const lcdGeo = new THREE.PlaneGeometry(1.40, 0.88);
  const lcdMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  controllerLcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  controllerLcdMesh.rotation.y = Math.PI; // Face -Z
  controllerLcdMesh.position.set(0.06, 0.14, -0.18);
  controllerLcdMesh.name = "UI_LCD";
  controllerLcdMesh.userData = { interactive: true, action: "controller_lcd", label: "I-300 Pro Touchscreen (Click to Toggle Distillation)" };
  ctrlHousing.add(controllerLcdMesh);

  // Large Metallic Push-Turn Rotary Knob on front face (-Z)
  const knob = cyl(0.18, 0.18, 0.12, matChrome, 32);
  knob.rotation.x = Math.PI / 2;
  knob.position.set(-0.62, -0.35, -0.22);
  knob.name = "Controller_Knob";
  knob.userData = { interactive: true, action: "controller_knob", label: "Navigation Push-Dial (Click to Start / Pause)" };
  ctrlHousing.add(knob);

  // Tactile Action Keys on front face
  for (let i = 0; i < 3; i++) {
    const key = box(0.24, 0.12, 0.03, matAlumBrushed);
    key.position.set(0.55 - i * 0.35, -0.35, -0.18);
    key.userData = { interactive: true, action: "controller_key", label: `Action Key ${i + 1}` };
    ctrlHousing.add(key);
  }

  // Coiled telemetry cord from controller to tower
  const cordPts = [
    new THREE.Vector3(0, -0.65, 0.15),
    new THREE.Vector3(0.25, -0.55, 0.50),
    new THREE.Vector3(0.60, -0.45, 0.85),
  ];
  const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cordPts), 16, 0.016, 8, false), matRubber);
  ctrlHousing.add(cordMesh);

  parent.add(ctrlHousing);
}

// ---------------------------------------------------------------------------
// 7. Heavy-Duty Flexible Power Cable Routing
// ---------------------------------------------------------------------------
function createPowerCord(parent, fromPos, toPos) {
  const mid1 = new THREE.Vector3(fromPos.x + 0.2, fromPos.y - 0.08, fromPos.z + 0.3);
  const mid2 = new THREE.Vector3(toPos.x - 0.2, toPos.y - 0.04, toPos.z - 0.2);
  const curve = new THREE.CatmullRomCurve3([fromPos, mid1, mid2, toPos]);
  const cordGeo = new THREE.TubeGeometry(curve, 32, 0.024, 10, false);
  const cord = new THREE.Mesh(cordGeo, matRubber);
  cord.castShadow = true;
  parent.add(cord);
}

// ---------------------------------------------------------------------------
// External Control & Animation APIs
// ---------------------------------------------------------------------------

/**
 * Set motorized lift height (0 = lowered into bath, 1 = fully raised).
 */
export function setLiftHeight(percent) {
  const clampP = Math.max(0, Math.min(1, percent));
  if (liftCarriageGroup) {
    liftCarriageGroup.position.y = BENCH.surfaceY + 0.45 + LIFT_MIN_Y + clampP * (LIFT_MAX_Y - LIFT_MIN_Y);
  }
}

/**
 * Animate flask rotation by angle delta.
 */
export function rotateDriveShaft(angleDelta) {
  if (rotatingDriveShaft) {
    rotatingDriveShaft.rotation.z += angleDelta;
  }
}

/**
 * Animate condensate droplet falling cycle.
 */
export function updateDripAnimation(timeSec, rate) {
  if (dripMesh) {
    if (rate <= 0) {
      dripMesh.visible = false;
      return;
    }
    dripMesh.visible = true;
    const cycle = (timeSec * rate * 3.0) % 1.0;
    dripMesh.position.y = 0.45 - cycle * 0.70;
  }
}

/**
 * Update liquid volumes in evaporating & receiving flasks.
 */
export function updateLiquidLevels(evapFraction, recvFraction) {
  if (flaskLiquidMesh) {
    const scale = Math.max(0.05, Math.min(1.0, evapFraction));
    flaskLiquidMesh.scale.set(scale * 0.9, scale * 0.9, scale * 1.1);
  }
  if (receiverLiquidMesh) {
    const scale = Math.max(0.05, Math.min(1.0, recvFraction));
    receiverLiquidMesh.scale.set(scale * 0.95, scale * 0.65, scale * 0.95);
  }
}

/**
 * Connect CanvasTexture to controller display.
 */
export function setControllerTexture(texture) {
  if (controllerLcdMesh) {
    controllerLcdMesh.material = new THREE.MeshBasicMaterial({ map: texture });
    controllerLcdMesh.material.needsUpdate = true;
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
  if (!rotovapRoot) return;
  rotovapRoot.traverse((child) => {
    if (child.isMesh && child !== controllerLcdMesh) {
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => { m.wireframe = enabled; });
      } else if (child.material) {
        child.material.wireframe = enabled;
      }
    }
  });
}
