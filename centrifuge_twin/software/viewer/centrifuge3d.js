/**
 * MICRO 5424-R class training model (Three.js)
 *
 * Design goals for chem students:
 *  - Open chamber: look down and see rotor + tubes + fluid
 *  - Clear lid sits flush on the deck when closed
 *  - Compact labeled keys (text ON the key face)
 *  - Rack beside unit for manual loading
 *
 * Units ≈ 100 mm (width 2.9 ≈ 290 mm). Y-up, front = −Z.
 */
import * as THREE from "three";

const W = 2.9;
const D = 3.4;
const BASE_Y = 0.18;
const BODY_H = 1.45;
const DECK_Y = BASE_Y + BODY_H; // top of body / lid seat
const CH_R = 0.7;
const CH_DEPTH = 0.55;
const N_SLOTS = 24;

function M(color, o = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: o.r ?? 0.42,
    metalness: o.m ?? 0.1,
    transparent: o.o != null && o.o < 1,
    opacity: o.o ?? 1,
    emissive: new THREE.Color(o.e ?? 0x000000),
    emissiveIntensity: o.ei ?? 0,
    side: o.side ?? THREE.FrontSide,
    depthWrite: o.dw ?? true,
  });
}

const MAT_PVC_DUCT = M(0x475569, { r: 0.5, m: 0.1 });
const MAT_PCB_GREEN = M(0x1a5c2e, { r: 0.5, m: 0.1 });
const MAT_ALUM_DARK_ANO = M(0x272e39, { r: 0.45, m: 0.65 });
const MAT_316SS_BRUSHED = M(0x94a3b8, { r: 0.35, m: 0.85 });
const MAT_316SS_ELECTROPOLISHED = M(0xc8ccd0, { r: 0.22, m: 0.92 });
const MAT_CHROME_STEEL = M(0xe2e8f0, { r: 0.15, m: 0.95 });
const MAT_BRASS_FITTING = M(0xd97706, { r: 0.32, m: 0.88 });
const MAT_TOROID_WINDING = M(0xb45309, { r: 0.28, m: 0.85 });
const MAT_RUBBER_NBR = M(0x18181b, { r: 0.75, m: 0.05 });

function box(w, h, d, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Create box and set position (never assign to mesh.position — read-only in Three.js). */
function boxAt(w, h, d, mat, x, y, z) {
  const mesh = box(w, h, d, mat);
  mesh.position.set(x, y, z);
  return mesh;
}

/**
 * Instrument island dimensions (shared by room + power cord routing).
 * surfaceY = top of black bench; machine feet sit here.
 * Exported for the Twins lab_viewer shared desk.
 */
export const INSTRUMENT_BENCH = {
  cx: -0.4,
  cz: 0.15,
  sx: 9.6,
  sz: 5.4,
  bodyH: 0.88,
  topT: 0.07,
  get surfaceY() {
    return this.bodyH + this.topT;
  },
  // Duplex outlet on rear backsplash (root / lab space)
  get outlet() {
    const rearZ = this.cz + this.sz / 2 - 0.05;
    return {
      x: 1.45,
      y: this.surfaceY + 0.1,
      z: rearZ,
    };
  },
};

/**
 * Duplex AC outlet face + sockets on a vertical plate facing −Z (toward front).
 */
function addDuplexOutlet(parent, x, y, z) {
  const matPlate = M(0xd8dce0, { r: 0.35, m: 0.55 });
  const matBody = M(0xf2f4f6, { r: 0.45, m: 0.08 });
  const matHole = M(0x121418, { r: 0.7, m: 0.05 });
  const matScrew = M(0xb0b6bc, { r: 0.35, m: 0.7 });

  const plate = box(0.22, 0.28, 0.02, matPlate);
  plate.position.set(x, y, z);
  plate.name = "Lab_Outlet_Plate";
  parent.add(plate);

  // Recessed device body
  const device = box(0.14, 0.2, 0.03, matBody);
  device.position.set(x, y, z - 0.015);
  device.name = "Lab_Outlet";
  parent.add(device);

  // Two receptacle faces (upper unused, lower plugged)
  for (const dy of [0.05, -0.05]) {
    const face = box(0.095, 0.072, 0.012, matBody);
    face.position.set(x, y + dy, z - 0.028);
    face.name = "Power_Receptacle_Duplex";
    parent.add(face);
    // Vertical slots
    for (const sx of [-0.02, 0.02]) {
      const slot = box(0.012, 0.032, 0.008, matHole);
      slot.position.set(x + sx, y + dy + 0.006, z - 0.036);
      parent.add(slot);
    }
    // Round ground hole
    const gnd = cyl(0.008, 0.008, 0.008, matHole, 10);
    gnd.rotation.x = Math.PI / 2;
    gnd.position.set(x, y + dy - 0.022, z - 0.036);
    parent.add(gnd);
  }

  for (const sy of [0.11, -0.11]) {
    const sc = cyl(0.008, 0.008, 0.01, matScrew, 8);
    sc.rotation.x = Math.PI / 2;
    sc.position.set(x, y + sy, z - 0.012);
    parent.add(sc);
  }

  return { x, y, z: z - 0.04 };
}

/**
 * Wet-lab shell around the instrument: floor tiles, walls, ceiling panels,
 * benches, cabinets. Parent under centrifuge root so explode/reset stay coherent.
 * Exported for Twins/lab_viewer shared environment.
 * @returns {{ lab: THREE.Group, surfaceY: number, outlet: {x,y,z}, roomHeight: number }}
 */
export function buildLabRoom(root) {
  const lab = new THREE.Group();
  lab.name = "Lab_Environment";

  // Tall, wide room so orbit / lid open never hits the ceiling
  const half = 15.0;
  const height = 9.5;
  const wallT = 0.12;

  const matFloor = M(0xc8d0d8, { r: 0.55, m: 0.04 });
  const matTile = M(0xa8b2bc, { r: 0.5, m: 0.05 });
  const matWall = M(0xe6eaee, { r: 0.72, m: 0.02 });
  const matCeiling = M(0xf0f2f4, { r: 0.8, m: 0.0 });
  const matBench = M(0x6a7380, { r: 0.45, m: 0.2 });
  const matTop = M(0x12161c, { r: 0.32, m: 0.22 }); // black lab tops
  const matCab = M(0xd0d6dc, { r: 0.55, m: 0.08 });
  const matBase = M(0x4a5560, { r: 0.5, m: 0.1 });
  const matPanel = M(0xf4f8ff, { r: 0.4, m: 0.0, e: 0xc8e0ff, ei: 0.55 });
  const matBoard = M(0xfafbfc, { r: 0.45, m: 0.0 });
  const matHazard = M(0xd4a017, { r: 0.55, m: 0.05 });
  const matSteel = M(0x9aa3ac, { r: 0.35, m: 0.55 });

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(half * 2, half * 2), matFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.name = "Ground";
  lab.add(floor);

  // Tile grid lines
  const tile = 1.0;
  for (let i = -Math.floor(half / tile); i <= Math.floor(half / tile); i++) {
    const x = i * tile;
    if (Math.abs(x) >= half - 0.05) continue;
    const lx = box(0.02, 0.008, half * 2 - 0.3, matTile);
    lx.position.set(x, 0.004, 0);
    lx.name = `Lab_TileX_${i}`;
    lab.add(lx);
    const lz = box(half * 2 - 0.3, 0.008, 0.02, matTile);
    lz.position.set(0, 0.004, x);
    lz.name = `Lab_TileZ_${i}`;
    lab.add(lz);
  }

  // Walls
  const wallY = height / 2;
  const walls = [
    { n: "N", p: [0, wallY, half], s: [half * 2, height, wallT] },
    { n: "S", p: [0, wallY, -half], s: [half * 2, height, wallT] },
    { n: "E", p: [half, wallY, 0], s: [wallT, height, half * 2] },
    { n: "W", p: [-half, wallY, 0], s: [wallT, height, half * 2] },
  ];
  for (const w of walls) {
    const mesh = box(w.s[0], w.s[1], w.s[2], matWall);
    mesh.position.set(...w.p);
    mesh.name = `Lab_Wall_${w.n}`;
    lab.add(mesh);
    const bb = box(
      w.n === "N" || w.n === "S" ? half * 2 - 0.2 : 0.06,
      0.1,
      w.n === "N" || w.n === "S" ? 0.06 : half * 2 - 0.2,
      matBase
    );
    bb.position.set(w.p[0] * 0.99, 0.05, w.p[2] * 0.99);
    bb.name = `Lab_Baseboard_${w.n}`;
    lab.add(bb);
  }

  // Ceiling
  const ceiling = box(half * 2, 0.1, half * 2, matCeiling);
  ceiling.position.set(0, height, 0);
  ceiling.name = "Lab_Ceiling";
  lab.add(ceiling);

  // Fluorescent panels — wider grid for larger room
  const panelStep = 3.5;
  const panelMax = 10.5;
  let panelI = 0;
  for (let pz = -panelMax; pz <= panelMax + 0.01; pz += panelStep) {
    for (let px = -panelMax; px <= panelMax + 0.01; px += panelStep) {
      const p = box(1.6, 0.04, 0.65, matPanel);
      p.position.set(px, height - 0.12, pz);
      p.name = `Lab_LightPanel_${panelI++}`;
      lab.add(p);
    }
  }

  // Perimeter benches (leave center open for instrument island)
  function addBench(name, cx, cz, sx, sz) {
    const body = box(sx, 0.75, sz, matBench);
    body.position.set(cx, 0.4, cz);
    body.name = `Lab_Bench_${name}`;
    lab.add(body);
    const top = box(sx + 0.06, 0.06, sz + 0.06, matTop);
    top.position.set(cx, 0.8, cz);
    top.name = `Lab_BenchTop_${name}`;
    lab.add(top);
  }
  addBench("N", 0, half - 0.7, half * 2 - 3.0, 0.85);
  addBench("S", 3.2, -half + 0.7, half * 1.15, 0.85);
  addBench("E", half - 0.7, 0.5, 0.85, half * 1.5);
  addBench("W", -half + 0.7, 1.2, 0.85, half * 1.3);

  // --- Instrument island: black-top lab table on legs (under centrifuge + rack) ---
  const ib = INSTRUMENT_BENCH;
  const surfaceY = ib.surfaceY;
  const matLeg = M(0x2c333c, { r: 0.42, m: 0.4 });
  const matLegFoot = M(0x1a1f26, { r: 0.75, m: 0.1 });

  // Under-top apron (not a solid box to the floor)
  const apronH = 0.16;
  const apron = box(ib.sx - 0.12, apronH, ib.sz - 0.12, matBench);
  apron.position.set(ib.cx, ib.bodyH - apronH / 2 - 0.01, ib.cz);
  apron.name = "Lab_Bench_Instrument";
  lab.add(apron);

  // Four square legs + rubber feet
  const legW = 0.12;
  const legH = ib.bodyH - 0.04;
  const hx = ib.sx / 2 - 0.22;
  const hz = ib.sz / 2 - 0.22;
  const legCorners = [
    [-hx, -hz],
    [hx, -hz],
    [-hx, hz],
    [hx, hz],
  ];
  legCorners.forEach(([lx, lz], i) => {
    const leg = box(legW, legH, legW, matLeg);
    leg.position.set(ib.cx + lx, legH / 2, ib.cz + lz);
    leg.name = `Lab_Bench_Leg_${i + 1}`;
    lab.add(leg);
    const foot = cyl(0.085, 0.09, 0.04, matLegFoot, 14);
    foot.position.set(ib.cx + lx, 0.02, ib.cz + lz);
    foot.name = `Lab_Bench_Foot_${i + 1}`;
    lab.add(foot);
  });

  // Stretchers between legs (table structure)
  const strH = 0.07;
  const strY = 0.22;
  const strLong = box(ib.sx - 0.5, strH, 0.06, matLeg);
  strLong.position.set(ib.cx, strY, ib.cz - hz);
  strLong.name = "Lab_Bench_Stretcher_F";
  lab.add(strLong);
  const strLongB = box(ib.sx - 0.5, strH, 0.06, matLeg);
  strLongB.position.set(ib.cx, strY, ib.cz + hz);
  strLongB.name = "Lab_Bench_Stretcher_B";
  lab.add(strLongB);
  const strSideL = box(0.06, strH, ib.sz - 0.5, matLeg);
  strSideL.position.set(ib.cx - hx, strY, ib.cz);
  strSideL.name = "Lab_Bench_Stretcher_L";
  lab.add(strSideL);
  const strSideR = box(0.06, strH, ib.sz - 0.5, matLeg);
  strSideR.position.set(ib.cx + hx, strY, ib.cz);
  strSideR.name = "Lab_Bench_Stretcher_R";
  lab.add(strSideR);

  const islandTop = box(ib.sx + 0.1, ib.topT, ib.sz + 0.1, matTop);
  islandTop.position.set(ib.cx, ib.bodyH + ib.topT / 2, ib.cz);
  islandTop.name = "Lab_BenchTop_Instrument";
  lab.add(islandTop);

  // Thin steel edge banding (readable silhouette)
  const edge = box(ib.sx + 0.12, 0.02, ib.sz + 0.12, matSteel);
  edge.position.set(ib.cx, surfaceY - 0.005, ib.cz);
  edge.name = "Lab_BenchEdge_Instrument";
  lab.add(edge);

  // Rear backsplash for outlet + cord management
  const splashW = 2.4;
  const splashH = 0.22;
  const splash = box(splashW, splashH, 0.045, matTop);
  const splashZ = ib.cz + ib.sz / 2 - 0.02;
  splash.position.set(ib.cx + 0.9, surfaceY + splashH / 2, splashZ);
  splash.name = "Lab_Bench_Backsplash";
  lab.add(splash);

  const outlet = addDuplexOutlet(lab, ib.outlet.x, ib.outlet.y, splashZ - 0.02);

  // Wall cabinets on north wall
  const cab = box(half * 1.4, 0.85, 0.38, matCab);
  cab.position.set(0, 5.2, half - 0.4);
  cab.name = "Lab_WallCabinets";
  lab.add(cab);

  // Whiteboard
  const board = box(2.6, 1.4, 0.05, matBoard);
  board.position.set(-4.0, 3.4, half - 0.2);
  board.name = "Lab_Whiteboard";
  lab.add(board);

  // Hazard stripe on floor in front of instrument bench
  const stripe = box(2.4, 0.01, 0.12, matHazard);
  stripe.position.set(ib.cx, 0.006, ib.cz - ib.sz / 2 - 0.35);
  stripe.name = "Lab_HazardStripe";
  lab.add(stripe);

  // Tall fridge-style cabinet back-left
  const fridge = box(0.95, 2.1, 0.8, matCab);
  fridge.position.set(-half + 1.0, 1.05, half - 1.5);
  fridge.name = "Lab_Fridge";
  lab.add(fridge);
  const fridgeTop = box(1.0, 0.08, 0.85, matTop);
  fridgeTop.position.set(-half + 1.0, 2.14, half - 1.5);
  lab.add(fridgeTop);

  root.add(lab);
  return { lab, surfaceY, outlet, roomHeight: height };
}

/**
 * Horizontal deck plate with circular chamber hole.
 * Outer path CCW, hole CW (Three.js Shape requirement).
 * After rotateX(-π/2): thickness along +Y, plate in XZ, bottom at y=0.
 */
function deckWithHole(width, depth, holeR, thickness, material) {
  const shape = new THREE.Shape();
  const hw = width / 2;
  const hd = depth / 2;
  // Outer rectangle — counter-clockwise
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.lineTo(hw, hd);
  shape.lineTo(-hw, hd);
  shape.closePath();

  // Hole — clockwise (opposite winding)
  const hole = new THREE.Path();
  const segs = 64;
  for (let i = 0; i <= segs; i++) {
    const a = -(i / segs) * Math.PI * 2; // negative = CW
    const x = Math.cos(a) * holeR;
    const y = Math.sin(a) * holeR;
    if (i === 0) hole.moveTo(x, y);
    else hole.lineTo(x, y);
  }
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
    curveSegments: 64,
  });
  geo.rotateX(-Math.PI / 2);
  // Ensure bottom of plate sits at local y=0 (extrude went +Z → +Y after rotate)
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  geo.translate(0, -bb.min.y, 0);

  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Opaque cabinet walls (hollow interior so chamber is open from above).
 * Front wall is FULL height — control fascia mounts as an external overlay so
 * there is never a dark void between panel and body.
 */
function buildHollowShell(bodyGroup, skin, wallT = 0.1) {
  const floorH = 0.1;
  const floor = box(W, floorH, D, skin);
  floor.position.set(0, BASE_Y + floorH / 2, 0);
  floor.name = "Body_Floor";
  bodyGroup.add(floor);

  const wallH = BODY_H - floorH;
  const wallY = BASE_Y + floorH + wallH / 2;

  // Front wall (−Z) — full height closed face
  const front = box(W, wallH, wallT, skin);
  front.position.set(0, wallY, -D / 2 + wallT / 2);
  front.name = "Body_Front";
  bodyGroup.add(front);

  // Back wall (+Z)
  const back = box(W, wallH, wallT, skin);
  back.position.set(0, wallY, D / 2 - wallT / 2);
  back.name = "Body_Back";
  bodyGroup.add(back);

  // Left / right
  const sideD = D - 2 * wallT;
  const left = box(wallT, wallH, sideD, skin);
  left.position.set(-W / 2 + wallT / 2, wallY, 0);
  left.name = "Body_Left";
  bodyGroup.add(left);

  const right = box(wallT, wallH, sideD, skin);
  right.position.set(W / 2 - wallT / 2, wallY, 0);
  right.name = "Body_Right";
  bodyGroup.add(right);

  return { floorH, wallH, frontH: wallH, frontTopY: BASE_Y + floorH + wallH, wallT };
}

function cyl(rt, rb, h, mat, seg = 40) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function makeSocketHeadCapScrew(r = 0.018, len = 0.06, headR = 0.03, headH = 0.015) {
  const g = new THREE.Group();
  const sc = cyl(r, r, len, M(0xc8ccd0, { r: 0.3, m: 0.85 }), 8);
  g.add(sc);
  const head = cyl(headR, headR, headH, M(0xc8ccd0, { r: 0.3, m: 0.85 }), 8);
  head.position.y = len / 2 + headH / 2;
  g.add(head);
  const socket = cyl(headR * 0.55, headR * 0.55, headH * 0.6, M(0x222, { r: 0.8 }), 6);
  socket.position.y = len / 2 + headH * 0.8;
  g.add(socket);
  g.name = "Fastener_HexM4";
  return g;
}

export function makeHexSocketBolt(r = 0.022, len = 0.07, name = 'Fastener_HexM4') {
  const g = new THREE.Group();
  g.name = name;

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 16), MAT_CHROME_STEEL);
  shaft.position.y = -len / 2;
  g.add(shaft);

  const headR = r * 1.55, headH = r * 1.65;
  const head = new THREE.Mesh(new THREE.CylinderGeometry(headR, headR, headH, 20), MAT_CHROME_STEEL);
  head.position.y = headH / 2;
  g.add(head);

  const hex = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.9, r * 0.9, headH * 0.65, 6), M(0x18181b, { r: 0.6 }));
  hex.position.y = headH * 0.68;
  g.add(hex);

  const washer = new THREE.Mesh(new THREE.CylinderGeometry(headR * 1.22, headR * 1.22, r * 0.3, 18), MAT_316SS_BRUSHED);
  washer.position.y = -r * 0.15;
  g.add(washer);

  return g;
}

function makeWiringHarness(points, radius, matOrColor, name, addTies = true) {
  const vectors = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
  const curve = new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.22);
  const geo = new THREE.TubeGeometry(curve, 48, radius, 10, false);
  const mat = typeof matOrColor === 'number' ? M(matOrColor, { r: 0.4, m: 0.12 }) : matOrColor;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  if (addTies && points.length >= 4) {
    for (const frac of [0.25, 0.55, 0.82]) {
      const pt = curve.getPointAt(frac);
      const tan = curve.getTangentAt(frac);
      const tie = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 1.35, radius * 0.32, 6, 14),
        MAT_RUBBER_NBR
      );
      tie.position.copy(pt);
      tie.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
      mesh.add(tie);
    }
  }
  return mesh;
}

function createPerforatedCageMaterial() {
  const perfCvs = document.createElement('canvas');
  perfCvs.width = 512;
  perfCvs.height = 512;
  const pfCtx = perfCvs.getContext('2d');
  pfCtx.fillStyle = '#b4bcc8';
  pfCtx.fillRect(0, 0, 512, 512);
  pfCtx.fillStyle = '#18202c';
  for (let py = 24; py < 490; py += 28) {
    for (let px = 24; px < 490; px += 28) {
      pfCtx.beginPath();
      pfCtx.arc(px + ((py / 28) % 2) * 14, py, 8, 0, Math.PI * 2);
      pfCtx.fill();
    }
  }
  const perfTex = new THREE.CanvasTexture(perfCvs);
  perfTex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({
    map: perfTex,
    roughness: 0.32,
    metalness: 0.78,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide
  });
}

/** Flexible cable along control points (world/local coords as given). */
function makeCable(pts, radius, color, tubularSegments = 48) {
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, 7, false);
  const mesh = new THREE.Mesh(geo, M(color, { r: 0.72, m: 0.05 }));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Nameplate:
 *   [S][R][E]  designs.com
 *              ───────────
 *              LAB SYSTEMS
 * Local +Z = face.
 */
function makeSREdesignsBadge() {
  const g = new THREE.Group();
  g.name = "Badge_SREdesigns";

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

/** Draw key label text onto a canvas context (shared by color + emissive maps). */
function paintKeyLabel(ctx, label, fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = label.split("\n");
  if (lines.length === 1) {
    const words = label.split(" ");
    if (words.length === 1) {
      ctx.font = "bold 44px system-ui,sans-serif";
      ctx.fillText(label, 128, 96);
    } else if (words.length === 2) {
      ctx.font = "bold 36px system-ui,sans-serif";
      ctx.fillText(words[0], 128, 72);
      ctx.fillText(words[1], 128, 120);
    } else {
      ctx.font = "bold 30px system-ui,sans-serif";
      ctx.fillText(words.slice(0, 2).join(" "), 128, 72);
      ctx.fillText(words.slice(2).join(" "), 128, 120);
    }
  } else {
    ctx.font = lines.length > 2 ? "bold 28px system-ui,sans-serif" : "bold 34px system-ui,sans-serif";
    const step = 192 / (lines.length + 1);
    lines.forEach((ln, i) => ctx.fillText(ln, 128, step * (i + 1)));
  }
}

function keyFaceMaterial(label, bg = "#3a4452", fg = "#f3f6fa") {
  // Color map (normal look)
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 192;
  const ctx = c.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 192);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(0, 0, 256, 48);
  paintKeyLabel(ctx, label, fg);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;

  // Emissive map — black field, white letters/arrows only (so press can light text alone)
  const ce = document.createElement("canvas");
  ce.width = 256;
  ce.height = 192;
  const ctxE = ce.getContext("2d");
  ctxE.fillStyle = "#000000";
  ctxE.fillRect(0, 0, 256, 192);
  paintKeyLabel(ctxE, label, "#ffffff");
  const emitTex = new THREE.CanvasTexture(ce);
  emitTex.colorSpace = THREE.SRGBColorSpace;

  const faceMat = new THREE.MeshStandardMaterial({
    map: tex,
    emissiveMap: emitTex,
    roughness: 0.42,
    metalness: 0.12,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0,
    toneMapped: true,
  });
  faceMat.userData.emitTex = emitTex;
  return faceMat;
}

/** Press / guide color styles per key id */
export function pressStyleForKey(keyId) {
  if (keyId === "power") {
    return { mode: "body", color: 0xff2a3a, face: 1.45, side: 0.75, halo: true };
  }
  if (keyId === "start") {
    return { mode: "body", color: 0x22ee77, face: 1.4, side: 0.7, halo: true };
  }
  if (keyId === "fast-temp") {
    return { mode: "body", color: 0x2a9fff, face: 1.4, side: 0.7, halo: true };
  }
  // Rockers + open / short / rpm — only glyphs light up
  return { mode: "letters", color: 0xffffff, face: 2.6, side: 0, halo: false };
}

function makeKey(label, w, h, d, bgHex, faceMat) {
  // Unique side mats so each key can glow independently (shared mat would glow all keys)
  const mkSide = () =>
    new THREE.MeshStandardMaterial({
      color: bgHex,
      roughness: 0.45,
      metalness: 0.12,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    });
  const mats = [mkSide(), mkSide(), mkSide(), mkSide(), faceMat, mkSide()];
  // +z face is textured; caller rotates so +z faces the user (−local Z)
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
  mesh.castShadow = true;
  mesh.userData.glowMaterials = mats;
  mesh.userData.faceMat = faceMat;
  mesh.userData.restEmissive = 0;

  // Additive halo — hidden unless glowing (opacity-0 planes still z-fight and flash)
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x00e8ff,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
  });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.35, h * 1.35), haloMat);
  halo.position.z = d / 2 + 0.02; // well clear of key face
  halo.name = "Key_Halo";
  halo.visible = false;
  halo.renderOrder = 2;
  mesh.add(halo);
  mesh.userData.halo = halo;
  mesh.userData.haloMat = haloMat;

  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00e8ff,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
  });
  const ring = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.65, h * 1.65), ringMat);
  ring.position.z = d / 2 + 0.015;
  ring.visible = false;
  ring.renderOrder = 1;
  mesh.add(ring);
  mesh.userData.ring = ring;
  mesh.userData.ringMat = ringMat;

  return mesh;
}

function applyKeyEmissive(mesh, colorHex, faceI, sideI, { useEmitMap = true, fullFace = false } = {}) {
  const faceMat = mesh.userData.faceMat;
  if (faceMat) {
    if (fullFace) {
      // Whole face plate glows (power / start / cool) — drop letter mask
      faceMat.emissiveMap = null;
    } else if (useEmitMap && faceMat.userData.emitTex) {
      faceMat.emissiveMap = faceMat.userData.emitTex;
    }
    faceMat.needsUpdate = true;
  }
  for (const m of mesh.userData.glowMaterials || []) {
    if (!m?.emissive) continue;
    m.emissive.setHex(colorHex);
    m.emissiveIntensity = m === faceMat ? faceI : sideI;
  }
}

function setHaloVisible(mesh, on, colorHex = 0x00e8ff, haloOp = 0.5, ringOp = 0.22) {
  if (mesh.userData.halo) {
    mesh.userData.halo.visible = !!on;
    if (on && mesh.userData.haloMat) {
      mesh.userData.haloMat.color.setHex(colorHex);
      mesh.userData.haloMat.opacity = haloOp;
    }
  }
  if (mesh.userData.ring) {
    mesh.userData.ring.visible = !!on;
    if (on && mesh.userData.ringMat) {
      mesh.userData.ringMat.color.setHex(colorHex);
      mesh.userData.ringMat.opacity = ringOp;
    }
  }
}

function restoreKeyIdle(mesh) {
  if (mesh.userData.guideGlow || mesh.userData.pressLit) return;
  const idle = mesh.userData.restEmissive || 0;
  const faceMat = mesh.userData.faceMat;
  // Restore letter emissive map for future letter-glows
  if (faceMat?.userData?.emitTex) {
    faceMat.emissiveMap = faceMat.userData.emitTex;
    faceMat.needsUpdate = true;
  }
  // Idle: very soft full-face wash only when powered (no letter mask needed)
  if (idle > 0) {
    if (faceMat) {
      faceMat.emissiveMap = null;
      faceMat.needsUpdate = true;
    }
    applyKeyEmissive(mesh, 0x1a4058, idle, idle * 0.45, { useEmitMap: false, fullFace: true });
  } else {
    applyKeyEmissive(mesh, 0x000000, 0, 0, { useEmitMap: true, fullFace: false });
  }
  setHaloVisible(mesh, false);
}

/** Soft idle backlight when instrument is powered (very dim). */
export function setKeysPoweredBacklight(model, on) {
  if (!model?.buttons) return;
  const idle = on ? 0.12 : 0;
  for (const [, mesh] of model.buttons) {
    mesh.userData.restEmissive = idle;
    if (mesh.userData.guideGlow || mesh.userData.pressLit) continue;
    mesh.userData.pressLit = false;
    restoreKeyIdle(mesh);
  }
}

/**
 * Momentary press light (user click/hold).
 * power → red body, start → green body, fast cool → blue body,
 * everything else → letters/arrows only.
 */
export function setKeyPressLit(model, keyId, on) {
  const mesh = model?.buttons?.get(keyId);
  if (!mesh) return false;
  mesh.userData.pressLit = !!on;
  if (mesh.userData.guideGlow) return true; // guide wins visuals

  const style = pressStyleForKey(keyId);

  if (on) {
    if (style.mode === "body") {
      applyKeyEmissive(mesh, style.color, style.face, style.side, { fullFace: true });
      if (style.halo) setHaloVisible(mesh, true, style.color, 0.55, 0.25);
      else setHaloVisible(mesh, false);
    } else {
      // Letters / arrows only (emissiveMap masks to glyphs)
      applyKeyEmissive(mesh, style.color, style.face, 0, { useEmitMap: true, fullFace: false });
      setHaloVisible(mesh, false);
    }
  } else {
    restoreKeyIdle(mesh);
  }

  if (typeof document !== "undefined") {
    const el = document.querySelector(`[data-key="${keyId}"]`);
    if (el) {
      el.classList.toggle("is-press-glow", !!on);
      el.classList.toggle("is-press-power", !!on && keyId === "power");
      el.classList.toggle("is-press-go", !!on && keyId === "start");
      el.classList.toggle("is-press-cool", !!on && keyId === "fast-temp");
      el.classList.toggle("is-press-label", !!on && style.mode === "letters");
    }
  }
  return true;
}

/**
 * Backlight one key for AI / tutorial guidance.
 * @param {{ color?: number|string, intensity?: number, pulse?: boolean } | false | null} opts
 */
export function setKeyGlow(model, keyId, opts = {}) {
  const mesh = model?.buttons?.get(keyId);
  if (!mesh) return false;

  if (opts === false || opts === null) {
    mesh.userData.guideGlow = false;
    mesh.userData.pulse = null;
    if (mesh.userData.pressLit) {
      setKeyPressLit(model, keyId, true); // re-show press if still held
    } else {
      restoreKeyIdle(mesh);
    }
    syncHtmlKeyGlow(keyId, false);
    return true;
  }

  const color = opts.color ?? 0x00e8ff;
  const colorHex = typeof color === "number" ? color : new THREE.Color(color).getHex();
  const intensity = opts.intensity ?? 1.4;
  const pulse = opts.pulse !== false;
  mesh.userData.guideGlow = true;
  mesh.userData.pulse = pulse ? { baseIntensity: intensity, phase: Math.random() * Math.PI * 2 } : null;

  applyKeyEmissive(mesh, colorHex, intensity, intensity * 0.45);
  setHaloVisible(mesh, true, colorHex, 0.55, 0.24);
  syncHtmlKeyGlow(keyId, true, `#${colorHex.toString(16).padStart(6, "0")}`);
  return true;
}

/** Set many key glows at once. Values: true | hex | {color,intensity,pulse} | false */
export function setKeyGlows(model, map = {}) {
  if (!model?.buttons) return;
  for (const [id, v] of Object.entries(map)) {
    if (v === false || v == null) setKeyGlow(model, id, false);
    else if (v === true) setKeyGlow(model, id, {});
    else if (typeof v === "number" || typeof v === "string") setKeyGlow(model, id, { color: v });
    else setKeyGlow(model, id, v);
  }
}

export function clearKeyGlows(model) {
  if (!model?.buttons) return;
  for (const id of model.buttons.keys()) setKeyGlow(model, id, false);
}

/** Call every frame — soft breathing pulse on guide-lit keys only. */
export function updateKeyGlows(model, timeSec) {
  if (!model?.buttons) return;
  for (const [, mesh] of model.buttons) {
    if (!mesh.userData.guideGlow || !mesh.userData.pulse) continue;
    const base = mesh.userData.pulse.baseIntensity ?? 1.2;
    const phase = (mesh.userData.pulse.phase || 0) + timeSec * 2.6;
    const wave = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(phase));
    const faceMat = mesh.userData.faceMat;
    for (const m of mesh.userData.glowMaterials || []) {
      if (!m) continue;
      m.emissiveIntensity = (m === faceMat ? base : base * 0.45) * wave;
    }
    if (mesh.userData.haloMat && mesh.userData.halo?.visible) {
      mesh.userData.haloMat.opacity = 0.3 + 0.4 * wave;
    }
    if (mesh.userData.ringMat) {
      mesh.userData.ringMat.opacity = 0.12 + 0.2 * wave;
    }
  }
}

function syncHtmlKeyGlow(keyId, on, cssColor = "#00e8ff") {
  if (typeof document === "undefined") return;
  const el = document.querySelector(`[data-key="${keyId}"]`);
  if (!el) return;
  if (on) {
    el.classList.add("is-glow");
    el.style.setProperty("--glow", cssColor);
  } else {
    el.classList.remove("is-glow");
    el.style.removeProperty("--glow");
  }
}

function makeTube() {
  const g = new THREE.Group();
  const bodyMat = M(0xc8daf0, { r: 0.12, m: 0.04, o: 0.4, side: THREE.DoubleSide });
  const body = cyl(0.042, 0.036, 0.26, bodyMat, 14);
  body.position.y = 0.13;
  body.name = "tube_body";
  g.add(body);
  const tip = cyl(0.036, 0.01, 0.05, bodyMat, 12);
  tip.position.y = -0.025;
  g.add(tip);

  const fluidGroup = new THREE.Group();
  fluidGroup.name = "fluid";
  fluidGroup.position.y = 0.01;
  g.add(fluidGroup);

  const cap = cyl(0.046, 0.046, 0.04, M(0x2563eb, { r: 0.4 }), 12);
  cap.position.y = 0.28;
  cap.name = "tube_cap";
  g.add(cap);

  g.userData.fluidGroup = fluidGroup;
  g.userData.cap = cap;
  g.userData.body = body;
  return g;
}

export function setTubeFluid(tubeGroup, layers, fill = 0.65, separated = false) {
  const fg = tubeGroup.userData.fluidGroup;
  if (!fg) return;
  while (fg.children.length) {
    const ch = fg.children.pop();
    ch.geometry?.dispose?.();
    if (ch.material?.dispose) ch.material.dispose();
  }
  if (!layers?.length || fill <= 0) return;
  const maxH = 0.2 * fill;
  let y = 0;
  for (const layer of layers) {
    const h = Math.max(0.004, maxH * layer.fraction);
    const mesh = cyl(0.033, 0.031, h, M(layer.color, { r: 0.35, o: 0.95 }), 12);
    mesh.position.y = y + h / 2;
    fg.add(mesh);
    y += h;
  }
  if (tubeGroup.userData.body?.material) {
    tubeGroup.userData.body.material.emissive = new THREE.Color(separated ? 0x0a2818 : 0x000000);
    tubeGroup.userData.body.material.emissiveIntensity = separated ? 0.12 : 0;
  }
}

/**
 * @param {THREE.Texture|null} lcdTexture
 * @param {{ includeLab?: boolean, surfaceY?: number }} [opts]
 *   includeLab (default true): build full lab room under root (standalone twin).
 *   When false, only the instrument is built (for Twins/lab_viewer shared desk);
 *   stage sits at y=0 so the host places it on the bench.
 */
export function createCentrifugeModel(lcdTexture, opts = {}) {
  const includeLab = opts.includeLab !== false;
  const root = new THREE.Group();
  root.name = "Centrifuge_Root";

  const bodyGroup = new THREE.Group();
  bodyGroup.name = "Body_Chassis";
  const consoleG = new THREE.Group();
  consoleG.name = "Console_Assembly";
  const chamberG = new THREE.Group();
  chamberG.name = "Chamber_Assembly";
  const rotor = new THREE.Group();
  rotor.name = "Rotor_Spin";
  const lid = new THREE.Group();
  lid.name = "Lid_Hinge";
  const rack = new THREE.Group();
  rack.name = "Tube_Rack";
  let rockerSwitch;

  // --- Full lab room (standalone twin) or host-provided desk (lab_viewer) ---
  let labInfo;
  if (includeLab) {
    labInfo = buildLabRoom(root);
  } else {
    // Stage-local bench: Y=0 is desk top. Outlet target matches island layout
    // used by lab_viewer (instrument origin ≈ island center in XZ).
    labInfo = {
      lab: null,
      surfaceY: 0,
      outlet: {
        x: INSTRUMENT_BENCH.outlet.x,
        y: 0.1,
        z: INSTRUMENT_BENCH.outlet.z,
      },
      roomHeight: 9.5,
    };
  }

  // Instrument sits on the black-top island; local Y=0 = bench surface
  const stage = new THREE.Group();
  stage.name = "Instrument_Stage";
  stage.position.y = includeLab ? labInfo.surfaceY : 0;
  root.add(stage);

  // ========== BODY: hollow cabinet (opaque walls) + continuous top with chamber hole ==========
  // Skin uses DoubleSide so wall inner faces don't vanish when looking into the chamber.
  const skin = M(0xe8ecf2, { r: 0.36, m: 0.06, side: THREE.DoubleSide });
  const dark = M(0x2a313a, { r: 0.4, m: 0.15 });

  // Feet
  let footIdx = 0;
  for (const [x, z] of [
    [-1.15, -1.4],
    [1.15, -1.4],
    [-1.15, 1.4],
    [1.15, 1.4],
  ]) {
    const f = cyl(0.11, 0.12, 0.07, M(0x111, { r: 0.9 }), 16);
    f.position.set(x, 0.035, z);
    f.name = `Foot_Leveling_${++footIdx}`;
    bodyGroup.add(f);
  }

  const plinth = box(W + 0.08, 0.14, D + 0.08, M(0x1a1f26, { r: 0.55, m: 0.1 }));
  plinth.position.y = 0.1;
  bodyGroup.add(plinth);

  // Hollow shell: floor + FULL-height walls (no open upper-front hole)
  const shellInfo = buildHollowShell(bodyGroup, skin, 0.12);
  const frontPlaneZ = -D / 2;

  // Cosmetic seam line under where the control fascia sits
  const seamBelt = box(W - 0.06, 0.04, 0.06, dark);
  seamBelt.position.set(0, BASE_Y + 0.72, frontPlaneZ - 0.01);
  seamBelt.name = "Body_Front_Seam";
  bodyGroup.add(seamBelt);

  // Continuous top deck with circular chamber hole (one plate, not corner pads)
  const deckThickness = 0.08;
  const deckMat = M(0xe8ecf2, { r: 0.36, m: 0.06, side: THREE.DoubleSide });
  const topDeck = deckWithHole(W + 0.04, D + 0.04, CH_R + 0.01, deckThickness, deckMat);
  // Bottom of plate at DECK_Y − thickness so top surface sits at DECK_Y
  topDeck.position.y = DECK_Y - deckThickness;
  topDeck.name = "Top_Deck";
  bodyGroup.add(topDeck);

  // Dark inset ring around hole (finished look) — sits on deck surface
  const lip = new THREE.Mesh(
    new THREE.RingGeometry(CH_R, CH_R + 0.12, 64),
    dark
  );
  lip.rotation.x = -Math.PI / 2;
  lip.position.y = DECK_Y + 0.002;
  bodyGroup.add(lip);

  // Metal rim
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(CH_R + 0.02, 0.022, 10, 48),
    M(0x9098a0, { r: 0.28, m: 0.85 })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = DECK_Y + 0.012;
  bodyGroup.add(rim);

  // Hinge at very back of deck
  const hingeZ = D / 2 - 0.08;
  const hingeBlock = box(1.35, 0.1, 0.18, dark);
  hingeBlock.position.set(0, DECK_Y + 0.05, hingeZ);
  hingeBlock.name = "Hinge_Block";
  bodyGroup.add(hingeBlock);

  // Front lid rest stoppers — glass lid seats on these when closed
  // (rubber pads + metal posts near front edge of deck)
  const rubber = M(0x1a1f26, { r: 0.9, m: 0.05 });
  const metalStop = M(0x9aa3ac, { r: 0.32, m: 0.75 });
  const stopZ = -D / 2 + 0.26;
  for (const x of [-1.05, 0, 1.05]) {
    const base = box(0.2, 0.025, 0.16, rubber);
    base.position.set(x, DECK_Y + 0.012, stopZ);
    base.name = "Lid_Stopper_Pad";
    bodyGroup.add(base);
    // Raised bumper the front lid rim lands on
    const bump = cyl(0.055, 0.06, 0.045, rubber, 16);
    bump.position.set(x, DECK_Y + 0.04, stopZ);
    bump.name = "Lid_Stopper";
    bodyGroup.add(bump);
    // Metal insert ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.04, 0.008, 6, 16),
      metalStop
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, DECK_Y + 0.055, stopZ);
    bodyGroup.add(ring);
  }
  // Front seal strip between stoppers (soft seat under glass)
  const frontSeal = box(W - 0.35, 0.02, 0.08, rubber);
  frontSeal.position.set(0, DECK_Y + 0.01, stopZ + 0.02);
  frontSeal.name = "Lid_Front_Seal";
  bodyGroup.add(frontSeal);

  // R bulk (refrigeration envelope) — rear-right only so side vents stay visible
  const bulkH = BODY_H * 0.72;
  const bulk = box(0.36, bulkH, 0.9, skin);
  bulk.position.set(W / 2 + 0.14, BASE_Y + 0.12 + bulkH / 2, 1.05);
  bulk.name = "R_Bulk";
  bodyGroup.add(bulk);

  // ========== REAR BULKHEAD (3 ISOLATED NON-COLLIDING ZONES) ==========
  // ZONE 1 (Right): Stamped Condenser Refrigeration Exhaust Louvers
  const louverZ = D / 2 + 0.01;
  const louverFrame = box(0.86, 0.68, 0.02, dark);
  louverFrame.position.set(0.68, 0.85, louverZ - 0.005);
  louverFrame.name = "Frame_RearLouvers";
  bodyGroup.add(louverFrame);

  for (let i = 0; i < 7; i++) {
    const louverSlat = box(0.78, 0.032, 0.025, M(0x3a424c, { r: 0.45, m: 0.25 }));
    louverSlat.position.set(0.68, 0.58 + i * 0.088, louverZ + 0.005);
    louverSlat.rotation.x = -0.25;
    louverSlat.name = "Rear_Vent_Louver";
    bodyGroup.add(louverSlat);
  }

  // Side air-vent grilles — mid-to-front of each side (clear of rear R bulk)
  const ventDark = M(0x1a1f26, { r: 0.55, m: 0.15 });
  const ventBar = M(0x3a424c, { r: 0.45, m: 0.25 });
  const ventZ = -0.45; // toward front (−Z)
  const ventDepth = 1.05;
  for (const side of [-1, 1]) {
    const xOuter = side * (W / 2 + 0.014);
    const panel = box(0.05, 0.9, ventDepth, ventDark);
    panel.position.set(side * (W / 2 - 0.01), 0.88, ventZ);
    panel.name = side < 0 ? "Vent_Panel_L" : "Vent_Panel_R";
    bodyGroup.add(panel);

    for (let i = 0; i < 9; i++) {
      const louvre = box(0.045, 0.034, ventDepth - 0.12, ventBar);
      louvre.position.set(xOuter, 0.55 + i * 0.078, ventZ);
      louvre.name = "Side_Vent_Louver";
      bodyGroup.add(louvre);
    }
    for (const z of [ventZ - ventDepth / 2 + 0.04, ventZ + ventDepth / 2 - 0.04]) {
      const frame = box(0.04, 0.9, 0.045, ventBar);
      frame.position.set(xOuter, 0.88, z);
      bodyGroup.add(frame);
    }
    for (const y of [0.48, 1.28]) {
      const frame = box(0.04, 0.04, ventDepth - 0.06, ventBar);
      frame.position.set(xOuter, y, ventZ);
      bodyGroup.add(frame);
    }
  }

  // ZONE 2 (Left Lower): Power Entry Module (IEC C14 Inlet + Fuse Drawer + Illuminated DPST Rocker)
  const pemGroup = new THREE.Group();
  pemGroup.name = "Assembly_PowerEntryModule";
  pemGroup.position.set(-0.75, 0.50, D / 2 + 0.01);
  bodyGroup.add(pemGroup);

  const pemBezel = box(0.56, 0.36, 0.04, dark);
  pemGroup.add(pemBezel);

  // IEC 60320 C14 Mains Inlet Socket (Left of module)
  const iecHousing = box(0.24, 0.18, 0.05, M(0x0a0c10, { r: 0.6 }));
  iecHousing.position.set(-0.12, -0.04, 0.02);
  iecHousing.name = "IEC_Inlet_Housing";
  pemGroup.add(iecHousing);

  const iecFace = box(0.20, 0.14, 0.02, M(0x05070a, { r: 0.7 }));
  iecFace.position.set(-0.12, -0.04, 0.04);
  iecFace.name = "IEC_Inlet";
  pemGroup.add(iecFace);

  // 3 Brass / Silver AC pins (Line, Neutral, Ground)
  for (const [px, py] of [[-0.05, -0.04], [0.05, -0.04], [0.0, 0.02]]) {
    const pin = box(0.016, 0.035, 0.025, MAT_316SS_ELECTROPOLISHED);
    pin.position.set(-0.12 + px, -0.04 + py, 0.045);
    pemGroup.add(pin);
  }

  // Fuse Drawer above socket
  const fuseDrawer = box(0.20, 0.06, 0.025, M(0x18181b, { r: 0.5 }));
  fuseDrawer.position.set(-0.12, 0.10, 0.03);
  fuseDrawer.name = "Fuse_Drawer";
  pemGroup.add(fuseDrawer);

  // Strain-relief boot at external cord junction
  const boot = cyl(0.055, 0.04, 0.12, M(0x1f2937, { r: 0.75 }), 12);
  boot.rotation.x = Math.PI / 2;
  boot.position.set(-0.12, -0.04, 0.09);
  boot.name = "Cord_Strain_Relief";
  pemGroup.add(boot);

  // DPST Illuminated Red Mains Power Rocker Switch (Right of module)
  const swBezel = box(0.18, 0.26, 0.03, dark);
  swBezel.position.set(0.14, 0.0, 0.02);
  pemGroup.add(swBezel);

  rockerSwitch = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.22, 0.05),
    M(0xdc2626, { r: 0.3, e: 0xdc2626, ei: 0.9 })
  );
  rockerSwitch.position.set(0.14, 0.0, 0.045);
  rockerSwitch.name = "Btn_Power_MainsRocker";
  rockerSwitch.userData.keyId = "mains_power";
  pemGroup.add(rockerSwitch);

  // Molded I / O tactile indicators on rocker
  const markI = box(0.015, 0.05, 0.008, M(0xffffff, { r: 0.2 }));
  markI.position.set(0.14, 0.05, 0.072);
  pemGroup.add(markI);

  const markO = new THREE.Mesh(
    new THREE.TorusGeometry(0.022, 0.006, 6, 16),
    M(0xffffff, { r: 0.2 })
  );
  markO.position.set(0.14, -0.05, 0.072);
  pemGroup.add(markO);

  // ZONE 3 (Left Upper): Brushed Stainless Data I/O Sub-Panel Plate
  const ioGroup = new THREE.Group();
  ioGroup.name = "Body_Plate_RearIO";
  ioGroup.position.set(-0.65, 0.95, D / 2 + 0.012);
  bodyGroup.add(ioGroup);

  const ioPlate = box(0.98, 0.36, 0.025, MAT_316SS_BRUSHED);
  ioPlate.name = "Rear_IO_Faceplate";
  ioGroup.add(ioPlate);

  // 4 Corner M3 socket screws on I/O plate
  for (const [sx, sy] of [[-0.44, -0.14], [0.44, -0.14], [-0.44, 0.14], [0.44, 0.14]]) {
    const sc = makeHexSocketBolt(0.014, 0.03, "Fastener_HexM3_IO");
    sc.rotation.x = Math.PI / 2;
    sc.position.set(sx, sy, 0.015);
    ioGroup.add(sc);
  }

  // Port 1: RS-232 DB9 Serial Connector with Hex Jackscrews
  const portRS = new THREE.Group();
  portRS.name = "Port_RS232";
  portRS.position.set(-0.35, 0.0, 0.02);
  ioGroup.add(portRS);

  const db9Shell = box(0.20, 0.12, 0.05, MAT_316SS_ELECTROPOLISHED);
  portRS.add(db9Shell);
  const db9Core = box(0.13, 0.06, 0.06, M(0x1d4ed8, { r: 0.4 }));
  portRS.add(db9Core);
  for (const jx of [-0.08, 0.08]) {
    const js = cyl(0.014, 0.014, 0.06, MAT_316SS_ELECTROPOLISHED, 6);
    js.rotation.x = Math.PI / 2;
    js.position.set(jx, 0, 0.01);
    portRS.add(js);
  }

  // Port 2: USB-B Device Communication Port
  const portUSB = new THREE.Group();
  portUSB.name = "Port_USB";
  portUSB.position.set(-0.15, 0.0, 0.02);
  ioGroup.add(portUSB);

  const usbBShell = box(0.12, 0.12, 0.06, MAT_316SS_ELECTROPOLISHED);
  portUSB.add(usbBShell);
  const usbBCore = box(0.06, 0.06, 0.07, M(0xf8fafc, { r: 0.3 }));
  portUSB.add(usbBCore);

  // Port 3: USB-A Host Port + Inserted SanDisk GLP Audit Flash Drive & Tethered Dust Cap
  const portUSBA = new THREE.Group();
  portUSBA.name = "Body_Port_USB_Host_Flash";
  portUSBA.position.set(0.05, 0.0, 0.02);
  ioGroup.add(portUSBA);

  const usbAShell = box(0.14, 0.08, 0.06, MAT_316SS_ELECTROPOLISHED);
  portUSBA.add(usbAShell);

  const usbDrive = new THREE.Group();
  usbDrive.name = "USB_Drive";
  usbDrive.position.set(0, 0, 0.11);
  portUSBA.add(usbDrive);

  const driveBody = box(0.12, 0.06, 0.20, MAT_ALUM_DARK_ANO);
  usbDrive.add(driveBody);
  const driveLed = box(0.04, 0.015, 0.015, M(0x38bdf8, { e: 0x38bdf8, ei: 1.8 }));
  driveLed.position.set(0, 0.025, 0.09);
  usbDrive.add(driveLed);

  const usbDustCap = box(0.08, 0.03, 0.04, M(0x18181b, { r: 0.8 }));
  usbDustCap.position.set(0.05, -0.06, 0.04);
  usbDustCap.name = "USB_DustCap";
  ioGroup.add(usbDustCap);

  // Port 4: Shielded RJ-45 Ethernet LAN Jack with Link/Act LEDs
  const portRJ45 = new THREE.Group();
  portRJ45.name = "Port_RJ45";
  portRJ45.position.set(0.24, 0.0, 0.02);
  ioGroup.add(portRJ45);

  const rjShell = box(0.15, 0.14, 0.08, MAT_316SS_ELECTROPOLISHED);
  portRJ45.add(rjShell);
  const linkLed = box(0.025, 0.02, 0.015, M(0x22c55e, { e: 0x22c55e, ei: 2.0 }));
  linkLed.position.set(-0.04, 0.05, 0.045);
  portRJ45.add(linkLed);
  const actLed = box(0.025, 0.02, 0.015, M(0xf59e0b, { e: 0xf59e0b, ei: 2.0 }));
  actLed.position.set(0.04, 0.05, 0.045);
  portRJ45.add(actLed);

  // Port 5: Gold SMA Connector & Articulated 2.4 GHz Wi-Fi / BLE Dipole Antenna
  const antGroup = new THREE.Group();
  antGroup.name = "Antenna_WiFi";
  antGroup.position.set(0.42, 0.0, 0.02);
  ioGroup.add(antGroup);

  const smaNut = cyl(0.038, 0.038, 0.05, MAT_BRASS_FITTING, 6);
  smaNut.rotation.x = Math.PI / 2;
  antGroup.add(smaNut);

  const knuckle = cyl(0.04, 0.04, 0.09, M(0x1e293b, { r: 0.6 }), 16);
  knuckle.position.set(0, 0.04, 0.05);
  antGroup.add(knuckle);

  const whip = cyl(0.022, 0.035, 0.60, M(0x1e293b, { r: 0.6 }), 16);
  whip.position.set(0, 0.36, 0.05);
  antGroup.add(whip);

  // Nameplate — front lower-left (SRE designs.com)
  const badge = makeSREdesignsBadge();
  badge.position.set(-W / 2 + 0.58, 0.38, -D / 2 - 0.02);
  badge.rotation.y = Math.PI;
  bodyGroup.add(badge);

  // Chamber floor height (inside hollow cabinet)
  const chFloorY = DECK_Y - CH_DEPTH;

  stage.add(bodyGroup);

  // External mains cord: rear IEC → black bench top → duplex outlet on backsplash
  // (coords are stage-local: Y=0 is bench surface)
  const outX = labInfo.outlet.x;
  const outY = labInfo.outlet.y - labInfo.surfaceY; // relative to stage
  const outZ = labInfo.outlet.z;
  const iecX = -0.87;
  const iecY = 0.46;
  const iecZ = D / 2;
  const powerCord = makeWiringHarness(
    [
      [iecX, iecY - 0.02, iecZ + 0.14],
      [iecX + 0.08, 0.28, iecZ + 0.35],
      [iecX + 0.22, 0.08, iecZ + 0.58],
      [iecX + 0.42, 0.035, iecZ + 0.80],
      [0.2, 0.032, iecZ + 0.95],
      [outX - 0.15, 0.03, outZ - 0.55],
      [outX - 0.02, 0.035, outZ - 0.28],
      [outX, outY - 0.04, outZ - 0.12],
      [outX, outY - 0.02, outZ - 0.02],
    ],
    0.038,
    0x111827,
    "Power_Cord_SJTOW",
    false
  );
  stage.add(powerCord);
  // Molded plug into lower receptacle (faces +Z into outlet)
  const plug = box(0.1, 0.07, 0.14, M(0x0a0a0a, { r: 0.55 }));
  plug.position.set(outX, outY - 0.05, outZ - 0.08);
  plug.name = "Power_Plug_NEMA";
  stage.add(plug);
  for (const ox of [-0.022, 0.022]) {
    const prong = box(0.016, 0.012, 0.055, M(0xc8ccd0, { r: 0.3, m: 0.85 }));
    prong.position.set(outX + ox, outY - 0.04, outZ - 0.01);
    stage.add(prong);
  }
  // AC leads inside from IEC → PSU (visible in explode / under shell)
  // added with drive bay below

  // ========== CHAMBER (open bowl) ==========
  // Interior stainless bowl — open top, fully visible from above
  const bowl = new THREE.Mesh(
    new THREE.CylinderGeometry(CH_R - 0.02, CH_R * 0.9, CH_DEPTH - 0.04, 48, 1, true),
    M(0x9aa3ac, { r: 0.22, m: 0.85, side: THREE.DoubleSide })
  );
  bowl.position.y = chFloorY + (CH_DEPTH - 0.04) / 2;
  chamberG.add(bowl);

  const chFloor = cyl(CH_R * 0.9, CH_R * 0.9, 0.03, M(0xb0b7be, { r: 0.3, m: 0.75 }), 48);
  chFloor.position.y = chFloorY + 0.015;
  chamberG.add(chFloor);

  const cone = cyl(0.055, 0.11, 0.12, M(0x9098a0, { r: 0.28, m: 0.85 }), 20);
  cone.position.y = chFloorY + 0.08;
  chamberG.add(cone);

  // Light so chamber isn't a black hole
  const chLight = new THREE.PointLight(0xfff6ea, 1.1, 3);
  chLight.position.set(0, DECK_Y - 0.1, 0);
  chamberG.add(chLight);
  const chLight2 = new THREE.PointLight(0xffffff, 0.4, 2.5);
  chLight2.position.set(0.3, DECK_Y - 0.05, 0.3);
  chamberG.add(chLight2);

  stage.add(chamberG);

  // ========== ROTOR — true circular pitch, fixed-angle 45° outward ==========
  // Tubes sit on a circle in XZ; each tube axis is tilted 45° along its radial
  // direction (FA-45-24-11 class). No dual euler hacks that squash into a football.
  rotor.position.y = chFloorY + 0.08;

  const rotorBody = cyl(0.54, 0.56, 0.2, M(0x3f464f, { r: 0.25, m: 0.9 }), 48);
  rotorBody.position.y = 0.1;
  rotor.add(rotorBody);

  // Conical upper face (fixed-angle look)
  const rotorCone = cyl(0.42, 0.54, 0.12, M(0x4a515a, { r: 0.25, m: 0.88 }), 48);
  rotorCone.position.y = 0.26;
  rotor.add(rotorCone);

  const hub = cyl(0.12, 0.14, 0.06, M(0x9098a0, { r: 0.28, m: 0.85 }), 24);
  hub.position.y = 0.3;
  rotor.add(hub);
  const knob = cyl(0.07, 0.08, 0.07, M(0x2a313a, { r: 0.4 }), 16);
  knob.position.y = 0.37;
  rotor.add(knob);

  // Tie-down screw on knob (detail)
  const tieScrew = cyl(0.015, 0.015, 0.04, M(0xc0c4c8, { r: 0.3, m: 0.8 }), 8);
  tieScrew.position.y = 0.42;
  rotor.add(tieScrew);

  const rotorSlots = [];
  const pocketR = 0.36; // circular pitch radius
  const tiltDeg = 45; // FA-45
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < N_SLOTS; i++) {
    const ang = (i / N_SLOTS) * Math.PI * 2;
    const cx = Math.cos(ang) * pocketR;
    const cz = Math.sin(ang) * pocketR;

    const slotG = new THREE.Group();
    // Pocket mouth on the conical face, still on a true circle in plan view
    slotG.position.set(cx, 0.2, cz);

    // Real-world fixed-angle rotor physics (e.g. Eppendorf FA-45-24-11):
    // Tube local +Y (cap) tilts 45 deg INWARD toward central hub.
    // Tube local -Y (conical tip) points DOWN and OUTWARD toward maximum radius (r_max),
    // directing centrifugal pelleting into the bottom tip of the tube!
    const tilt = THREE.MathUtils.degToRad(tiltDeg);
    const axisDir = new THREE.Vector3(
      -Math.cos(ang) * Math.sin(tilt),
      Math.cos(tilt),
      -Math.sin(ang) * Math.sin(tilt)
    ).normalize();
    slotG.quaternion.setFromUnitVectors(up, axisDir);

    // Empty pocket bore
    const pocket = cyl(0.044, 0.04, 0.2, M(0x1a1e24, { r: 0.55 }), 14);
    pocket.position.y = 0.02;
    slotG.add(pocket);

    // Mouth ring (shows circular pattern clearly)
    const mouth = new THREE.Mesh(
      new THREE.TorusGeometry(0.046, 0.006, 6, 16),
      M(0x6a727c, { r: 0.35, m: 0.7 })
    );
    mouth.rotation.x = Math.PI / 2;
    mouth.position.y = 0.12;
    slotG.add(mouth);

    const hit = cyl(
      0.07,
      0.07,
      0.35,
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.001, depthWrite: false }),
      8
    );
    hit.position.y = 0.08;
    hit.userData.rotorSlot = i;
    hit.name = `rotor_slot_${i}`;
    slotG.add(hit);

    const tubeVis = makeTube();
    tubeVis.visible = false;
    tubeVis.userData.rotorSlot = i;
    // Seat tube fully in pocket along local Y
    tubeVis.position.y = -0.02;
    slotG.add(tubeVis);

    rotor.add(slotG);
    rotorSlots.push({ index: i, hit, tubeGroup: tubeVis, group: slotG });
  }
  stage.add(rotor);

  // ========== DRIVE BAY (HIGH-FIDELITY ELECTROMECHANICAL ANATOMY) ==========
  const drive = new THREE.Group();
  drive.name = "Drive_Bay";

  // 1. High-Torque 3-Phase Brushless DC Drive Motor & Elastomeric Isolation Mount
  const motorGroup = new THREE.Group();
  motorGroup.name = "Assembly_Motor_Drive";
  motorGroup.position.set(0, 0, 0);
  drive.add(motorGroup);

  // Cast aluminum heavy motor mounting subplate
  const motorPlate = box(0.76, 0.05, 0.76, MAT_ALUM_DARK_ANO);
  motorPlate.position.set(0, 0.32, 0);
  motorPlate.name = "F02_MotorPlate";
  motorGroup.add(motorPlate);

  // 4 Vulcanized Neoprene Elastomeric Vibration-Isolation Dampers & M5 Clamping Bolts
  for (let d = 0; d < 4; d++) {
    const sx = (d % 2 === 0 ? -1 : 1) * 0.28;
    const sz = (d < 2 ? -1 : 1) * 0.28;

    const damper = cyl(0.065, 0.075, 0.08, MAT_RUBBER_NBR, 20);
    damper.position.set(sx, 0.26, sz);
    damper.name = `Isolator_MotorMount_0${d + 1}`;
    motorGroup.add(damper);

    const damperCore = cyl(0.025, 0.025, 0.082, MAT_316SS_BRUSHED, 12);
    damperCore.position.set(sx, 0.26, sz);
    motorGroup.add(damperCore);

    const mBolt = makeHexSocketBolt(0.018, 0.08, `Fastener_HexM5_MotorMount_0${d + 1}`);
    mBolt.position.set(sx, 0.35, sz);
    motorGroup.add(mBolt);
  }

  // Finned BLDC Motor Casing with 12 Radial Extruded Cooling Fins
  const motor = cyl(0.26, 0.26, 0.48, MAT_ALUM_DARK_ANO, 32);
  motor.position.set(0, 0.58, 0);
  motor.name = "Motor_Drive";
  motorGroup.add(motor);

  for (let f = 0; f < 12; f++) {
    const ang = (f * Math.PI * 2) / 12;
    const fin = box(0.016, 0.44, 0.038, MAT_ALUM_DARK_ANO);
    fin.position.set(Math.cos(ang) * 0.27, 0.58, Math.sin(ang) * 0.27);
    fin.rotation.y = -ang;
    motorGroup.add(fin);
  }

  // Laminated Electrical Steel Stator Core & Copper Windings visible through cooling slots
  const stator = cyl(0.24, 0.24, 0.20, M(0x52525b, { r: 0.6, m: 0.5 }), 28);
  stator.position.set(0, 0.58, 0);
  motorGroup.add(stator);

  const coils = cyl(0.245, 0.245, 0.14, MAT_TOROID_WINDING, 28);
  coils.position.set(0, 0.58, 0);
  motorGroup.add(coils);

  // Die-Cast Aluminum Upper & Lower End Bells
  const endBellTop = cyl(0.22, 0.26, 0.06, MAT_316SS_BRUSHED, 24);
  endBellTop.position.set(0, 0.84, 0);
  motorGroup.add(endBellTop);

  const endBellBtm = cyl(0.26, 0.22, 0.06, MAT_316SS_BRUSHED, 24);
  endBellBtm.position.set(0, 0.35, 0);
  motorGroup.add(endBellBtm);

  // 4 Long Stainless Tie-Rods / Bolts clamping motor end bells
  for (const [tx, tz] of [[-0.20, -0.20], [0.20, -0.20], [-0.20, 0.20], [0.20, 0.20]]) {
    const tieRod = cyl(0.008, 0.008, 0.54, MAT_CHROME_STEEL, 8);
    tieRod.position.set(tx, 0.58, tz);
    tieRod.name = "Fastener_TieRod_Motor";
    motorGroup.add(tieRod);
    const tieNut = cyl(0.016, 0.016, 0.02, MAT_CHROME_STEEL, 6);
    tieNut.position.set(tx, 0.87, tz);
    motorGroup.add(tieNut);
  }

  // Precision Ground Drive Spindle Shaft & Chamber Seal Gland
  const shaft = cyl(0.04, 0.04, 0.36, MAT_CHROME_STEEL, 16);
  shaft.position.set(0, 0.98, 0);
  shaft.name = "Drive_Shaft";
  motorGroup.add(shaft);

  const sealGland = cyl(0.08, 0.09, 0.04, MAT_316SS_ELECTROPOLISHED, 20);
  sealGland.position.set(0, 1.07, 0);
  motorGroup.add(sealGland);

  // 6-Pin Molex 3-Phase Power Header on Motor Body
  const molexHeader = box(0.08, 0.12, 0.06, M(0xf1f5f9, { r: 0.4 }));
  molexHeader.position.set(0, 0.52, 0.28);
  molexHeader.name = "Connector_Molex_MotorPower";
  motorGroup.add(molexHeader);

  // 5-Pin JST Optical Encoder Header on Left Side of Motor
  const jstHeader = box(0.06, 0.10, 0.05, M(0xf8fafc, { r: 0.4 }));
  jstHeader.position.set(-0.28, 0.52, 0);
  jstHeader.name = "Connector_JST_MotorEncoder";
  motorGroup.add(jstHeader);

  // Precision 45-Degree Optical Tachometer Relay Mirror in Kinematic Gimbal Mount
  const mirrorGimbal = box(0.06, 0.06, 0.04, MAT_ALUM_DARK_ANO);
  mirrorGimbal.position.set(0.14, 0.90, 0.14);
  motorGroup.add(mirrorGimbal);

  const mirrorRelay = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.045, 0.008),
    new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 0.96, roughness: 0.04, clearcoat: 1.0 })
  );
  mirrorRelay.rotation.x = Math.PI / 4;
  mirrorRelay.position.set(0.14, 0.90, 0.14);
  mirrorRelay.name = "Mirror_OpticalRelay";
  motorGroup.add(mirrorRelay);

  // 2. Mean Well Enclosed Switching Power Supply (Assembly_PowerSupply)
  const psuGroup = new THREE.Group();
  psuGroup.name = "Assembly_PowerSupply";
  psuGroup.position.set(0.72, 0.44, -0.15);
  drive.add(psuGroup);

  // Internal FR-4 PCB
  const psuPcb = box(0.68, 0.025, 0.98, MAT_PCB_GREEN);
  psuPcb.position.y = -0.19;
  psuGroup.add(psuPcb);

  // Two 400V 330uF Bulk Electrolytic Filter Capacitors with Stamped X-Vent Tops
  for (const cz of [-0.28, -0.06]) {
    const cap = cyl(0.085, 0.085, 0.30, M(0x1e3a8a, { r: 0.35, m: 0.2 }), 20);
    cap.position.set(-0.14, -0.04, cz);
    psuGroup.add(cap);

    const capTop = cyl(0.075, 0.075, 0.008, MAT_316SS_ELECTROPOLISHED, 16);
    capTop.position.set(-0.14, 0.114, cz);
    psuGroup.add(capTop);
  }

  // High-Frequency Flyback Chopper Transformer with Yellow Kapton / Mylar Tape
  const chopperCore = box(0.22, 0.26, 0.22, M(0xeab308, { r: 0.35, m: 0.15 }));
  chopperCore.position.set(0.12, -0.06, -0.18);
  psuGroup.add(chopperCore);

  // Extruded Aluminum MOSFET / Schottky Diode Heatsink Plate with Vertical Fins
  const psuHs = box(0.04, 0.32, 0.70, MAT_ALUM_DARK_ANO);
  psuHs.position.set(0.24, -0.03, 0.02);
  psuGroup.add(psuHs);

  // Perforated Sheet-Metal Honeycomb Cage
  const matPerfCage = createPerforatedCageMaterial();
  const psuShell = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.44, 1.02), matPerfCage);
  psuShell.castShadow = true;
  psuGroup.add(psuShell);

  // 7-Position Barrier Terminal Strip on Rear Face of PSU (L, N, PE, -V, -V, +V, +V)
  const barrierBlock = box(0.62, 0.15, 0.12, M(0x18181b, { r: 0.6 }));
  barrierBlock.position.set(0, -0.11, 0.52);
  psuGroup.add(barrierBlock);

  const ferruleColors = [0x92400e, 0x2563eb, 0x16a34a, 0x18181b, 0x18181b, 0xdc2626, 0xdc2626];
  for (let t = 0; t < 7; t++) {
    const tx = -0.24 + t * 0.08;
    const screw = cyl(0.022, 0.022, 0.028, MAT_316SS_ELECTROPOLISHED, 12);
    screw.position.set(tx, -0.025, 0.52);
    psuGroup.add(screw);

    if (t < 6) {
      const wall = box(0.008, 0.16, 0.13, M(0x18181b, { r: 0.6 }));
      wall.position.set(tx + 0.04, -0.10, 0.52);
      psuGroup.add(wall);
    }

    const ferrule = cyl(0.015, 0.015, 0.06, M(ferruleColors[t], { r: 0.4 }), 10);
    ferrule.rotation.x = Math.PI / 2;
    ferrule.position.set(tx, -0.11, 0.59);
    psuGroup.add(ferrule);
  }

  // Orange V-ADJ Trimmer Potentiometer & Green DC-OK Status LED
  const vAdjPot = cyl(0.018, 0.018, 0.02, M(0xf97316, { r: 0.3 }), 12);
  vAdjPot.position.set(0.28, 0.02, 0.49);
  psuGroup.add(vAdjPot);

  const psuLed = cyl(0.014, 0.014, 0.02, M(0x22c55e, { e: 0x22c55e, ei: 2.0 }), 10);
  psuLed.position.set(0.28, 0.07, 0.49);
  psuGroup.add(psuLed);

  // Dedicated External Cooling Fan (Fan_PSU_Cooling) Mounted on PSU Front Bracket
  const psuFanGroup = new THREE.Group();
  psuFanGroup.name = "Fan_PSU_Cooling";
  psuFanGroup.position.set(0, 0, -0.56);
  psuGroup.add(psuFanGroup);

  const psuFanFrame = box(0.40, 0.40, 0.10, M(0x18181b, { r: 0.6 }));
  psuFanGroup.add(psuFanFrame);

  // 4 Corner M4 Mounting Screws
  for (const [fx, fy] of [[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]]) {
    const fb = makeHexSocketBolt(0.012, 0.03, "Fastener_HexM4_PSUFan");
    fb.rotation.x = Math.PI / 2;
    fb.position.set(fx, fy, -0.05);
    psuFanGroup.add(fb);
  }

  const psuFanHub = new THREE.Group();
  psuFanHub.name = "Pivot_Fan_PSU_Impeller";
  psuFanGroup.add(psuFanHub);

  const fanHubCore = cyl(0.08, 0.08, 0.09, M(0x18181b, { r: 0.5 }), 16);
  fanHubCore.rotation.x = Math.PI / 2;
  psuFanHub.add(fanHubCore);

  for (let b = 0; b < 7; b++) {
    const ang = (b * Math.PI * 2) / 7;
    const blade = box(0.11, 0.035, 0.01, M(0x27272a, { r: 0.5 }));
    blade.position.set(Math.cos(ang) * 0.12, Math.sin(ang) * 0.12, 0);
    blade.rotation.z = ang + 0.35;
    blade.rotation.y = 0.4;
    psuFanHub.add(blade);
  }

  // Concentric Chrome Wire Finger Guard (Fastener_FanGuard_PSU)
  const fanGuard = new THREE.Group();
  fanGuard.name = "Fastener_FanGuard_PSU";
  fanGuard.position.set(0, 0, -0.06);
  psuFanGroup.add(fanGuard);

  for (const gr of [0.07, 0.12, 0.17]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(gr, 0.006, 6, 24), MAT_CHROME_STEEL);
    fanGuard.add(ring);
  }
  for (let a = 0; a < 4; a++) {
    const spoke = cyl(0.005, 0.005, 0.36, MAT_CHROME_STEEL, 6);
    spoke.rotation.z = (a * Math.PI) / 4;
    fanGuard.add(spoke);
  }

  // 3. Toroidal Step-Down Isolation Transformer (Part_ToroidalTransformer)
  const toroidGroup = new THREE.Group();
  toroidGroup.name = "Part_ToroidalTransformer";
  toroidGroup.position.set(0.72, 0.36, 0.72);
  drive.add(toroidGroup);

  // Neoprene rubber isolation pad underneath toroid
  const neoPad = cyl(0.24, 0.24, 0.025, MAT_RUBBER_NBR, 32);
  neoPad.position.y = -0.12;
  toroidGroup.add(neoPad);

  // Helical Enamel-Copper Wound Toroid Core
  const toroidCore = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.075, 20, 36), MAT_TOROID_WINDING);
  toroidCore.rotation.x = Math.PI / 2;
  toroidGroup.add(toroidCore);

  // Outer Amber Kapton/Mylar Insulation Belly Band around Toroid Perimeter
  const kaptonBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.238, 0.238, 0.10, 32, 1, true),
    M(0xf59e0b, { r: 0.25, m: 0.1, o: 0.55, side: THREE.DoubleSide })
  );
  toroidGroup.add(kaptonBand);

  // Potted Epoxy Center Core + Dished Heavy Steel Mounting Washer + M8 Center Bolt
  const epoxyCenter = cyl(0.09, 0.09, 0.15, M(0x18181b, { r: 0.6 }), 20);
  toroidGroup.add(epoxyCenter);

  const dishedWasher = cyl(0.16, 0.18, 0.02, MAT_316SS_BRUSHED, 24);
  dishedWasher.position.y = 0.08;
  toroidGroup.add(dishedWasher);

  const centerBolt = makeHexSocketBolt(0.025, 0.06, "Fastener_HexM8_ToroidMount");
  centerBolt.position.y = 0.095;
  toroidGroup.add(centerBolt);

  const toroidFeedGland = cyl(0.025, 0.03, 0.03, MAT_RUBBER_NBR, 14);
  toroidFeedGland.position.y = 0.11;
  toroidGroup.add(toroidFeedGland);

  // 4. Hermetic Refrigeration Compressor & Condenser Pack
  const comp = box(0.48, 0.52, 0.48, M(0x555b63, { r: 0.4, m: 0.5 }));
  comp.position.set(0.90, 0.48, 1.25);
  comp.name = "F09_Compressor";
  drive.add(comp);

  const compDome = cyl(0.22, 0.24, 0.08, M(0x555b63, { r: 0.4, m: 0.5 }), 20);
  compDome.position.set(0.90, 0.78, 1.25);
  drive.add(compDome);

  // Condenser pack — aligned facing rear louvers
  const cond = box(0.72, 0.52, 0.14, M(0x8a9199, { r: 0.35, m: 0.7 }));
  cond.position.set(0.68, 0.85, 1.62);
  cond.name = "F10_Condenser";
  drive.add(cond);

  // Copper refrigeration piping loops
  const refTube1 = makeWiringHarness(
    [[0.90, 0.68, 1.25], [0.90, 0.82, 1.40], [0.85, 0.85, 1.58]],
    0.016, MAT_BRASS_FITTING, "Tube_Refrigerant_Discharge", false
  );
  drive.add(refTube1);

  // Cabinet cooling convective blower fan
  const fan = cyl(0.18, 0.18, 0.08, M(0x333, { r: 0.5 }), 16);
  fan.position.set(0.68, 0.85, 1.48);
  fan.rotation.x = Math.PI / 2;
  fan.name = "Fan_CabinetCooling_Blower";
  drive.add(fan);

  // 5. Digital Motherboard Controller (PCB_Motherboard)
  const mainPcb = box(0.85, 0.03, 0.65, MAT_PCB_GREEN);
  mainPcb.position.set(-0.75, 0.42, -0.20);
  mainPcb.name = "PCB_Motherboard";
  drive.add(mainPcb);

  // Standoff screws for motherboard
  for (const [sx, sz] of [[-1.12, -0.48], [-0.38, -0.48], [-1.12, 0.08], [-0.38, 0.08]]) {
    const sc = makeHexSocketBolt(0.012, 0.05, "Fastener_HexM3_Standoff");
    sc.position.set(sx, 0.44, sz);
    drive.add(sc);
  }

  // SMD Chips: ARM Cortex MCU, DRAM, Flash SSD, Shielded Wi-Fi/BLE module
  const mcu = box(0.16, 0.035, 0.16, M(0x18181b, { r: 0.4 }));
  mcu.position.set(-0.90, 0.45, -0.22);
  mcu.name = "Part_MCU_Core";
  drive.add(mcu);

  const ram = box(0.10, 0.025, 0.14, M(0x18181b, { r: 0.4 }));
  ram.position.set(-0.70, 0.445, -0.22);
  ram.name = "Part_RAM_Chip";
  drive.add(ram);

  const ssd = box(0.12, 0.025, 0.14, M(0x18181b, { r: 0.4 }));
  ssd.position.set(-0.52, 0.445, -0.22);
  ssd.name = "Part_SSD_Module";
  drive.add(ssd);

  const wifiChip = box(0.14, 0.035, 0.16, MAT_316SS_BRUSHED);
  wifiChip.position.set(-0.72, 0.45, 0.0);
  wifiChip.name = "WiFi_BLE_Chip";
  drive.add(wifiChip);

  const rtcBattery = cyl(0.045, 0.045, 0.015, MAT_316SS_ELECTROPOLISHED, 16);
  rtcBattery.position.set(-0.92, 0.445, 0.0);
  rtcBattery.name = "Battery_RTC_CR2032";
  drive.add(rtcBattery);

  // 6. Industrial Slotted PVC Wiring Ducts (DIN EN 60204-1 / UL 508A Standards)
  const ductRear = box(2.40, 0.12, 0.16, MAT_PVC_DUCT);
  ductRear.position.set(0, 0.22, 1.38);
  ductRear.name = "Body_WiringDuct_Rear";
  drive.add(ductRear);

  const ductCoverRear = box(2.42, 0.02, 0.17, MAT_PVC_DUCT);
  ductCoverRear.position.set(0, 0.285, 1.38);
  drive.add(ductCoverRear);

  const ductLeft = box(0.16, 0.12, 2.15, MAT_PVC_DUCT);
  ductLeft.position.set(-1.25, 0.22, 0.32);
  ductLeft.name = "Body_WiringDuct_Left";
  drive.add(ductLeft);

  const ductCoverLeft = box(0.17, 0.02, 2.17, MAT_PVC_DUCT);
  ductCoverLeft.position.set(-1.25, 0.285, 0.32);
  drive.add(ductCoverLeft);

  const ductCenter = box(0.70, 0.12, 0.14, MAT_PVC_DUCT);
  ductCenter.position.set(0.05, 0.22, 0.48);
  ductCenter.name = "Body_WiringDuct_Center";
  drive.add(ductCenter);

  // 7. Protective Earth (PE) Grounding Hub
  const peHubGroup = new THREE.Group();
  peHubGroup.name = "Ground_Lug_Chassis";
  peHubGroup.position.set(-1.15, 0.20, 1.35);
  drive.add(peHubGroup);

  const peStud = cyl(0.025, 0.025, 0.08, MAT_BRASS_FITTING, 16);
  peHubGroup.add(peStud);
  const peNut = cyl(0.045, 0.045, 0.03, MAT_BRASS_FITTING, 6);
  peNut.position.y = 0.03;
  peHubGroup.add(peNut);

  // 8. Fully Dressed, Color-Coded 3D Wiring Harnesses
  // AC Mains: IEC / Rocker Module -> Duct_Rear -> PSU Terminals
  const wireMainsL = makeWiringHarness(
    [
      [-0.75, 0.46, 1.66],
      [-0.75, 0.24, 1.45],
      [0.10, 0.24, 1.38],
      [0.48, 0.24, 1.05],
      [0.48, 0.28, 0.48],
    ],
    0.016,
    0x92400e,
    "W10_MainsLive"
  );
  drive.add(wireMainsL);

  const wireMainsN = makeWiringHarness(
    [
      [-0.78, 0.46, 1.66],
      [-0.78, 0.24, 1.45],
      [0.10, 0.24, 1.38],
      [0.54, 0.24, 1.05],
      [0.54, 0.28, 0.48],
    ],
    0.016,
    0x2563eb,
    "W11_MainsNeutral"
  );
  drive.add(wireMainsN);

  const wirePE = makeWiringHarness(
    [
      [-0.87, 0.48, 1.66],
      [-1.15, 0.28, 1.45],
      [-1.15, 0.20, 1.35],
      [0.10, 0.22, 1.38],
      [0.60, 0.28, 0.48],
    ],
    0.014,
    0x16a34a,
    "W03_PE"
  );
  drive.add(wirePE);

  // DC 24V Power: PSU Output (+V, -V) -> Duct_Rear -> Duct_Left -> Motherboard
  const wireMotorL = makeWiringHarness(
    [
      [0.92, 0.32, 0.48],
      [0.92, 0.24, 1.38],
      [-1.25, 0.24, 1.38],
      [-1.25, 0.24, -0.20],
      [-0.95, 0.42, -0.20],
    ],
    0.015,
    0xdc2626,
    "W01_MotorLive"
  );
  drive.add(wireMotorL);

  const wireMotorN = makeWiringHarness(
    [
      [0.76, 0.32, 0.48],
      [0.76, 0.24, 1.38],
      [-1.23, 0.24, 1.38],
      [-1.23, 0.24, -0.22],
      [-0.95, 0.42, -0.22],
    ],
    0.015,
    0x18181b,
    "W02_MotorNeutral"
  );
  drive.add(wireMotorN);

  // Motor 3-Phase Drive Cable: Motherboard -> Duct_Center -> Motor Molex
  const wireMotorDrive = makeWiringHarness(
    [
      [-0.60, 0.42, 0.0],
      [-0.60, 0.24, 0.48],
      [-0.05, 0.24, 0.48],
      [0.0, 0.48, 0.32],
    ],
    0.018,
    0x334155,
    "Harness_Motor_3Phase"
  );
  drive.add(wireMotorDrive);

  // Motor Optical / Hall Encoder Harness: Motor JST -> Duct_Left -> Motherboard
  const wireCtrl = makeWiringHarness(
    [
      [-0.28, 0.52, 0.0],
      [-0.65, 0.24, 0.0],
      [-1.25, 0.24, 0.0],
      [-1.25, 0.24, -0.15],
      [-0.85, 0.43, -0.15],
    ],
    0.014,
    0x475569,
    "W04_CtrlHarness"
  );
  drive.add(wireCtrl);

  // Console Flat Ribbon Cable: Motherboard -> Left Wall -> Front Console
  const wireConsole = makeWiringHarness(
    [
      [-0.75, 0.44, -0.32],
      [-1.18, 0.45, -0.55],
      [-1.18, 0.75, -1.05],
      [-0.85, 0.90, -D / 2 + 0.18],
      [-0.40, 0.95, -D / 2 + 0.05],
    ],
    0.022,
    0x64748b,
    "W05_ConsoleHarness"
  );
  drive.add(wireConsole);

  // Fan leads: PSU -> PSU Fan & Condenser Fan
  const wireFan = makeWiringHarness(
    [
      [0.72, 0.40, -0.35],
      [0.72, 0.42, -0.50],
      [0.72, 0.44, -0.62],
    ],
    0.010,
    0x18181b,
    "W06_Fan"
  );
  drive.add(wireFan);

  // Compressor control harness: Motherboard -> Duct_Rear -> Compressor
  const wireComp = makeWiringHarness(
    [
      [-0.65, 0.42, 0.05],
      [-1.25, 0.24, 0.05],
      [-1.25, 0.24, 1.38],
      [0.90, 0.24, 1.38],
      [0.90, 0.44, 1.25],
    ],
    0.016,
    0x3f3f46,
    "W07_Compressor"
  );
  drive.add(wireComp);

  // PT100 RTD sensor lead from chamber bowl -> Duct_Left -> Motherboard ADC
  const wireTemp = makeWiringHarness(
    [
      [0.15, chFloorY + 0.05, 0.45],
      [-0.10, chFloorY - 0.05, 0.35],
      [-1.25, 0.24, 0.35],
      [-1.25, 0.24, -0.28],
      [-0.75, 0.43, -0.28],
    ],
    0.009,
    0xf59e0b,
    "Sensor_PT100"
  );
  drive.add(wireTemp);

  // Imbalance sensor
  const imb = box(0.10, 0.06, 0.08, MAT_PCB_GREEN);
  imb.position.set(0.25, chFloorY - 0.15, 0.20);
  imb.name = "F11_ImbalanceSensor";
  drive.add(imb);

  const wireImb = makeWiringHarness(
    [
      [0.25, chFloorY - 0.12, 0.20],
      [0.10, 0.24, 0.20],
      [-0.60, 0.24, -0.10],
      [-0.60, 0.42, -0.10],
    ],
    0.009,
    0x0f766e,
    "W09_Imbalance"
  );
  drive.add(wireImb);

  // Wi-Fi U.FL micro-coax cable: Wi-Fi module -> Duct_Left -> Duct_Rear -> SMA jack
  const wireWiFiCoax = makeWiringHarness(
    [
      [-0.72, 0.46, 0.0],
      [-1.25, 0.24, 0.0],
      [-1.25, 0.24, 1.38],
      [-0.23, 0.24, 1.38],
      [-0.23, 0.95, 1.66],
    ],
    0.007,
    0x38bdf8,
    "Cable_WiFi_Coax",
    false
  );
  drive.add(wireWiFiCoax);

  // Fasteners: Foot screws
  for (const [x, z] of [[-1.15, -1.4], [1.15, -1.4], [-1.15, 1.4], [1.15, 1.4]]) {
    const sc = makeHexSocketBolt(0.018, 0.06, "A08_FootScrew");
    sc.position.set(x, 0.06, z);
    drive.add(sc);
  }

  // Housing seam screws along front & rear
  for (let i = 0; i < 5; i++) {
    const x = -0.9 + i * 0.45;
    const scF = makeHexSocketBolt(0.012, 0.035, "A09_HousingScrew");
    scF.rotation.x = Math.PI / 2;
    scF.position.set(x, 0.5, -D / 2 + 0.02);
    drive.add(scF);
    const scR = scF.clone();
    scR.position.set(x, 0.5, D / 2 - 0.02);
    drive.add(scR);
  }

  // Chamber flange screws
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const sc = makeHexSocketBolt(0.015, 0.04, "C08_ChamberScrew");
    sc.position.set(Math.cos(a) * (CH_R + 0.12), DECK_Y + 0.02, Math.sin(a) * (CH_R + 0.12));
    drive.add(sc);
  }

  stage.add(drive);

  // ========== LID (clear glass) ==========
  // Hinge at the BACK EDGE only. Geometry at local z ≤ 0 (toward front / −Z).
  // Front rim rests on deck stoppers when closed.
  const lidDepth = D - 0.14;
  const lidWidth = W - 0.14;
  // Slightly above deck so underside clears pads; front rim lands on stoppers
  const hingePos = new THREE.Vector3(0, DECK_Y + 0.055, hingeZ);
  lid.position.copy(hingePos);

  // Glass lid plate — more glass-like than plastic
  const clearMat = M(0xc5e4f5, {
    r: 0.05,
    m: 0.15,
    o: 0.28,
    side: THREE.DoubleSide,
    dw: false,
  });
  const clearLid = box(lidWidth, 0.035, lidDepth, clearMat);
  // Box centered; rear face at local z=0. Lower slightly so front seats on stoppers.
  clearLid.position.set(0, 0.018, -lidDepth / 2);
  clearLid.name = "Lid_Clear";
  clearLid.userData.grabbableLid = true;
  lid.add(clearLid);

  // Dark rim along edges (four thin bars), all z ≤ 0
  const rimT = 0.035;
  const rimH = 0.05;
  // rear rim at hinge
  const rimRear = box(lidWidth, rimH, rimT, M(0x2a313a, { r: 0.4, m: 0.2 }));
  rimRear.position.set(0, 0.03, -rimT / 2);
  lid.add(rimRear);
  // front rim
  const rimFront = box(lidWidth, rimH, rimT, M(0x2a313a, { r: 0.4, m: 0.2 }));
  rimFront.position.set(0, 0.03, -lidDepth + rimT / 2);
  lid.add(rimFront);
  // sides
  const rimL = box(rimT, rimH, lidDepth, M(0x2a313a, { r: 0.4, m: 0.2 }));
  rimL.position.set(-lidWidth / 2 + rimT / 2, 0.03, -lidDepth / 2);
  lid.add(rimL);
  const rimR = box(rimT, rimH, lidDepth, M(0x2a313a, { r: 0.4, m: 0.2 }));
  rimR.position.set(lidWidth / 2 - rimT / 2, 0.03, -lidDepth / 2);
  lid.add(rimR);

  // Handle at front edge only
  const handle = box(0.48, 0.055, 0.1, M(0x111, { r: 0.9 }));
  handle.position.set(0, 0.07, -lidDepth + 0.12);
  handle.name = "Lid_Handle";
  handle.userData.grabbableLid = true;
  lid.add(handle);

  // Knuckles exactly on hinge axis (z=0), not behind it
  for (const x of [-0.38, 0.38]) {
    const kn = cyl(0.042, 0.042, 0.16, M(0x9098a0, { r: 0.28, m: 0.85 }), 12);
    kn.rotation.z = Math.PI / 2;
    kn.position.set(x, 0.01, 0);
    lid.add(kn);
  }

  lid.traverse((o) => {
    if (o.isMesh) o.userData.grabbableLid = true;
  });
  stage.add(lid);

  // ========== CONTROL PANEL (tilted, LCD + keys) ==========
  // Local: origin at top-center of panel on body front.
  // +Y up, −Z toward user. All content at y ≤ 0, z ≤ 0.
  // Compact fascia: bottom keys sit just under the LCD (no tall empty band).
  const fasciaH = 0.78;
  const fasciaW = W - 0.06;
  const fasciaT = 0.1;
  const tilt = THREE.MathUtils.degToRad(14);

  consoleG.position.set(0, DECK_Y - 0.04, -D / 2 - 0.01);
  consoleG.rotation.x = tilt;

  const fasciaDark = M(0x2a313a, { r: 0.4, m: 0.18 });
  const fasciaCharcoal = M(0x1a1f26, { r: 0.45, m: 0.12 });

  // Fill cavity behind tilted panel (skin) so you don't see through — panel itself unchanged
  const gapFill = box(fasciaW + 0.1, fasciaH + 0.15, 0.4, skin);
  gapFill.position.set(0, -fasciaH / 2, 0.18);
  gapFill.name = "Console_GapFill";
  consoleG.add(gapFill);
  // Side plugs so the dark notch at the panel edges is closed
  for (const sx of [-1, 1]) {
    const sidePlug = box(0.14, fasciaH + 0.12, 0.4, skin);
    sidePlug.position.set(sx * (fasciaW / 2 + 0.04), -fasciaH / 2, 0.16);
    consoleG.add(sidePlug);
  }

  // Panel housing
  const housing = box(fasciaW, fasciaH, fasciaT, fasciaDark);
  housing.position.set(0, -fasciaH / 2, -fasciaT / 2);
  housing.name = "Console_Housing";
  consoleG.add(housing);

  // Face is the front of the housing (−Z). Components sit just in front of it.
  const faceZ = -fasciaT - 0.01;

  // Dark face plate (thin, only slightly in front of housing — no z-fight)
  const facePlate = box(fasciaW - 0.08, fasciaH - 0.08, 0.012, fasciaCharcoal);
  facePlate.position.set(0, -fasciaH / 2, faceZ);
  consoleG.add(facePlate);

  // --- LCD (simple plane facing user) ---
  if (lcdTexture) {
    lcdTexture.colorSpace = THREE.SRGBColorSpace;
    lcdTexture.flipY = false;
    lcdTexture.needsUpdate = true;
  }
  const lcdMat = new THREE.MeshBasicMaterial({
    map: lcdTexture || null,
    color: lcdTexture ? 0xffffff : 0x00d4e8,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const lcdW = 1.25;
  const lcdH = 0.42;
  const lcdX = -0.55;
  const lcdY = -0.32;
  const lcdGeo = new THREE.PlaneGeometry(lcdW, lcdH);
  const uv = lcdGeo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setY(i, 1.0 - uv.getY(i));
  }
  uv.needsUpdate = true;
  // Plane defaults to +Z normal → rotate 180° so it faces −Z (user)
  const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.rotation.y = Math.PI;
  lcdMesh.position.set(lcdX, lcdY, faceZ - 0.02);
  lcdMesh.name = "UI_LCD";
  consoleG.add(lcdMesh);

  // Cyan bezel around LCD (behind the screen plane)
  const bezel = box(lcdW + 0.08, lcdH + 0.08, 0.014, M(0x00a8b8, { r: 0.35, m: 0.35, e: 0x003844, ei: 0.3 }));
  bezel.position.set(lcdX, lcdY, faceZ - 0.008);
  consoleG.add(bezel);

  // --- Keys ---
  const kd = 0.045;
  const buttons = new Map();
  const keyZ = faceZ - 0.035;

  function addKey(id, label, x, y, style = "normal", size = { w: 0.24, h: 0.14 }) {
    let bg = "#3a4452";
    let fg = "#f3f6fa";
    if (style === "go") {
      bg = "#1a4a40";
      fg = "#d4ffe8";
    }
    if (style === "power") {
      bg = "#5a1820";
      fg = "#ffd0d6";
    }
    if (style === "rock") {
      bg = "#2e3848";
      fg = "#e8eef6";
    }
    if (style === "cool") {
      bg = "#1a3a55";
      fg = "#b8e0ff";
    }
    const face = keyFaceMaterial(label, bg, fg);
    const key = makeKey(label, size.w, size.h, kd, bg, face);
    key.rotation.y = Math.PI; // textured +Z → −Z (user)
    key.position.set(x, y, keyZ);
    key.name = `Btn_${id}`;
    key.userData.keyId = id;
    consoleG.add(key);
    buttons.set(id, key);
  }

  // Rockers right of LCD
  const rockW = 0.28;
  const rockH = 0.14;
  const colX = [0.35, 0.68, 1.01];
  addKey("speed-up", "SPEED\n▲", colX[0], -0.22, "rock", { w: rockW, h: rockH });
  addKey("speed-down", "SPEED\n▼", colX[0], -0.42, "rock", { w: rockW, h: rockH });
  addKey("time-up", "TIME\n▲", colX[1], -0.22, "rock", { w: rockW, h: rockH });
  addKey("time-down", "TIME\n▼", colX[1], -0.42, "rock", { w: rockW, h: rockH });
  addKey("temp-up", "TEMP\n▲", colX[2], -0.22, "rock", { w: rockW, h: rockH });
  addKey("temp-down", "TEMP\n▼", colX[2], -0.42, "rock", { w: rockW, h: rockH });

  // Function row just under LCD/rockers (tight bottom margin)
  const fH = 0.13;
  const rowY = -fasciaH + 0.1;
  const fSpecs = [
    { id: "power", label: "POWER", style: "power", w: 0.3 },
    { id: "rpmrcf", label: "rpm\nrcf", style: "normal", w: 0.3 },
    { id: "short", label: "short\nhold", style: "normal", w: 0.3 },
    { id: "open", label: "open", style: "normal", w: 0.28 },
    { id: "start", label: "START\nSTOP", style: "go", w: 0.42 },
    { id: "fast-temp", label: "fast\ncool", style: "cool", w: 0.3 },
  ];
  const fGap = 0.04;
  const fTotal = fSpecs.reduce((s, k) => s + k.w, 0) + fGap * (fSpecs.length - 1);
  let fx = -fTotal / 2;
  for (const k of fSpecs) {
    addKey(k.id, k.label, fx + k.w / 2, rowY, k.style, { w: k.w, h: fH });
    fx += k.w + fGap;
  }

  if (rockerSwitch) {
    buttons.set("mains_power", rockerSwitch);
  }

  // LEDs left of LCD
  const ledRun = cyl(0.02, 0.02, 0.012, M(0x22ff88, { e: 0x00ff66, ei: 0.9 }), 10);
  ledRun.rotation.x = Math.PI / 2;
  ledRun.position.set(lcdX - lcdW / 2 - 0.08, lcdY + 0.1, keyZ);
  consoleG.add(ledRun);
  const ledFault = cyl(0.02, 0.02, 0.012, M(0xff4466, { e: 0xff2244, ei: 0.2 }), 10);
  ledFault.rotation.x = Math.PI / 2;
  ledFault.position.set(lcdX - lcdW / 2 - 0.08, lcdY - 0.1, keyZ);
  consoleG.add(ledFault);

  stage.add(consoleG);

  // ========== RACK ==========
  rack.position.set(-W / 2 - 1.15, 0, 0);
  const rackBase = box(1.15, 0.08, 0.9, M(0xd0d5dc, { r: 0.45 }));
  rackBase.position.y = 0.14;
  rack.add(rackBase);
  const rackBody = box(1.1, 0.25, 0.85, M(0xd0d5dc, { r: 0.45 }));
  rackBody.position.y = 0.34;
  rack.add(rackBody);

  const rackSlots = [];
  const cols = 6;
  const rows = 4;
  const pX = 0.15;
  const pZ = 0.15;
  const oX = -((cols - 1) * pX) / 2;
  const oZ = -((rows - 1) * pZ) / 2;
  let ri = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = oX + c * pX;
      const z = oZ + r * pZ;
      const well = cyl(0.045, 0.045, 0.18, M(0x2a313a, { r: 0.5 }), 10);
      well.position.set(x, 0.42, z);
      rack.add(well);

      const tubeVis = makeTube();
      tubeVis.position.set(x, 0.38, z);
      tubeVis.userData.rackSlot = ri;
      rack.add(tubeVis);

      const hit = cyl(
        0.06,
        0.06,
        0.3,
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.001, depthWrite: false }),
        8
      );
      hit.position.set(x, 0.5, z);
      hit.userData.rackSlot = ri;
      hit.name = `rack_slot_${ri}`;
      rack.add(hit);

      rackSlots.push({ index: ri, tubeGroup: tubeVis, hit });
      ri++;
    }
  }
  stage.add(rack);

  // Explode data — includes drive bay so students see motor / PSU / screws
  const assemblies = {
    body: bodyGroup,
    console: consoleG,
    chamber: chamberG,
    rotor,
    lid,
    rack,
    drive,
  };
  const restPositions = {};
  for (const k of Object.keys(assemblies)) restPositions[k] = assemblies[k].position.clone();
  const explodeOffsets = {
    body: new THREE.Vector3(0, 1.35, 0),
    console: new THREE.Vector3(0, 0.05, -0.9),
    chamber: new THREE.Vector3(0, 1.85, 0),
    rotor: new THREE.Vector3(0, 2.35, 0),
    lid: new THREE.Vector3(0, 2.85, 0.3),
    rack: new THREE.Vector3(-0.95, 0.05, 0),
    drive: new THREE.Vector3(0, 0.0, 0),
  };

  const lidMeshes = [];
  lid.traverse((o) => {
    if (o.isMesh) {
      o.userData.grabbableLid = true;
      lidMeshes.push(o);
    }
  });

  /** Named assemblies + key sub-parts for the Part Explorer panel */
  const partCatalog = buildPartCatalog({
    bodyGroup,
    consoleG,
    chamberG,
    rotor,
    lid,
    rack,
    drive,
    root,
    lcdMesh,
  });

  return {
    root,
    rotor,
    lid,
    rack,
    lcdMesh,
    lcdMat, // front-face material (map lives here; mesh.material is an array)
    buttons,
    mainsRocker: rockerSwitch,
    ledRun,
    ledFault,
    consoleG,
    assemblies,
    restPositions,
    explodeOffsets,
    lidMeshes,
    rotorSlots,
    rackSlots,
    partCatalog,
  };
}

/** Human label from mesh/group name */
function labelFromName(name) {
  return String(name)
    .replace(/^btn_/, "Key · ")
    .replace(/_/g, " ")
    .replace(/\bF0?(\d+)\b/g, "#$1")
    .replace(/\bW0?(\d+)\b/g, "Wire $1")
    .replace(/\bA0?(\d+)\b/g, "A$1")
    .replace(/\bE0?(\d+)\b/g, "E$1")
    .replace(/\s+/g, " ")
    .trim();
}

function groupForName(name) {
  if (/^Lab_|Ground$|Lab_Environment/.test(name)) return "Lab room";
  if (/Console|LCD|btn_|LED|Face|Housing|Key|E0|Dial|Bezel/i.test(name)) return "Controls";
  if (/Drive|Motor|PCB|Fan|Compressor|Condenser|Imbalance|Wire|W0|F0|Harness|PSU|Screw/i.test(name))
    return "Drive / electronics";
  if (/Rotor|Chamber|Tube|Rack|fluid|cap/i.test(name)) return "Rotor / samples";
  if (/Lid|Hinge|Seal|Stopper/i.test(name)) return "Lid";
  if (/Body|Deck|Foot|Vent|IEC|Cord|Plug|Badge|SRE|Seam|Bulk|Plinth|Outlet/i.test(name)) return "Body";
  if (/Assembly|Root/.test(name)) return "Assemblies";
  return "Other parts";
}

/**
 * Inspectable parts: major assemblies first, then every named mesh/group
 * on the instrument (excluding lab shell and invisible hit proxies).
 */
function buildPartCatalog(ctx) {
  const {
    bodyGroup,
    consoleG,
    chamberG,
    rotor,
    lid,
    rack,
    drive,
    root,
    lcdMesh,
  } = ctx;

  const seen = new Set();
  const entries = [];

  function add(id, label, group, object) {
    if (!object || seen.has(object.uuid)) return;
    seen.add(object.uuid);
    entries.push({ id, label, group, object });
  }

  // Priority assemblies
  add("body", "Body enclosure", "Assemblies", bodyGroup);
  add("console", "Control console", "Assemblies", consoleG);
  add("chamber", "Chamber", "Assemblies", chamberG);
  add("rotor", "Rotor", "Assemblies", rotor);
  add("lid", "Lid", "Assemblies", lid);
  add("drive", "Drive bay", "Assemblies", drive);
  add("rack", "Tube rack", "Assemblies", rack);
  if (lcdMesh) add("lcd", "LCD display", "Controls", lcdMesh);

  // Auto-harvest every named node under the instrument root
  const skipName =
    /^(Ground|Centrifuge_Root|fluid|tube_body|tube_cap|Key_Halo|rack_slot_|rotor_slot_)/i;
  const skipLab = /^Lab_/i;

  root.traverse((o) => {
    if (!o.name || skipName.test(o.name) || skipLab.test(o.name)) return;
    if (o.name.startsWith("rack_slot_") || o.name.startsWith("rotor_slot_")) return;
    // Prefer named meshes and meaningful groups
    if (!o.isMesh && !o.isGroup) return;
    // Skip pure hit proxies
    if (o.isMesh && o.material && o.material.opacity != null && o.material.opacity < 0.05) return;
    // Skip fluid layer children (too granular)
    if (/^fluid/i.test(o.name)) return;
    const id = `auto_${o.name}`.replace(/[^a-zA-Z0-9_]/g, "_");
    add(id, labelFromName(o.name), groupForName(o.name), o);
  });

  // Stable sort within groups: Assemblies first already; keep insertion order
  return entries;
}

function isUnder(obj, ancestor) {
  let p = obj;
  while (p) {
    if (p === ancestor) return true;
    p = p.parent;
  }
  return false;
}

export function setExplodeAmount(model, t) {
  t = Math.max(0, Math.min(1, t));
  for (const key of Object.keys(model.assemblies)) {
    const obj = model.assemblies[key];
    const rest = model.restPositions[key];
    const off = model.explodeOffsets[key];
    obj.position.set(rest.x + off.x * t, rest.y + off.y * t, rest.z + off.z * t);
  }
}

export function setWireframe(model, enabled) {
  // Clear explorer highlight state when using global wireframe toggle
  if (model) model._explorerFocus = null;
  model.root.traverse((o) => {
    if (!o.isMesh) return;
    // Keep lab shell solid so wireframe mode still reads as "inside a room"
    if (o.name === "Ground" || o.name.startsWith("Lab_")) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) if (m && "wireframe" in m) m.wireframe = enabled;
  });
}

/**
 * Part Explorer: wireframe entire instrument except the focused object tree.
 * Lab environment stays solid. Pass null to clear focus.
 */
export function setExplorerFocus(model, focusObject) {
  if (!model?.root) return;
  model._explorerFocus = focusObject || null;
  const focusList = Array.isArray(focusObject) ? focusObject : (focusObject ? [focusObject] : null);
  model.root.traverse((o) => {
    if (!o.isMesh) return;
    if (o.name === "Ground" || o.name.startsWith("Lab_")) return;
    // Invisible hit proxies stay invisible
    if (o.material && o.material.opacity != null && o.material.opacity < 0.05) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const focused = focusList ? focusList.some((fo) => isUnder(o, fo)) : true;
    for (const m of mats) {
      if (!m || !("wireframe" in m)) continue;
      // Focus solid; everything else wireframe. Clear → all solid.
      m.wireframe = focusList ? !focused : false;
    }
  });
}

export function syncLabTubes(model, lab, matOf, layersOf) {
  if (!model?.rotorSlots || !model?.rackSlots) return;
  for (const slot of model.rotorSlots) {
    const tid = lab.rotor[slot.index];
    const vis = slot.tubeGroup;
    if (!tid) {
      vis.visible = false;
      continue;
    }
    const tube = lab.tubes[tid];
    const m = matOf(tube);
    vis.visible = true;
    if (vis.userData.cap?.material?.color) {
      vis.userData.cap.material.color.set(tube.cap_color || "#2563eb");
    }
    setTubeFluid(vis, layersOf(tube), m.fill, tube.separated);
  }
  for (const slot of model.rackSlots) {
    const tid = lab.rack[slot.index];
    const vis = slot.tubeGroup;
    if (!tid) {
      vis.visible = false;
      continue;
    }
    const tube = lab.tubes[tid];
    const m = matOf(tube);
    vis.visible = true;
    if (vis.userData.cap?.material?.color) {
      vis.userData.cap.material.color.set(tube.cap_color || "#2563eb");
    }
    setTubeFluid(vis, layersOf(tube), m.fill, tube.separated);
  }
}
