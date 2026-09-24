/**
 * Ultrasonic Cleaner 3000-PRO — Procedural Three.js Model  (v2 — high-fidelity)
 *
 * Fully procedural geometry matching centrifuge gold standard.
 * No GLB loaded at runtime.
 *
 * Quality improvements over v1:
 *  - ExtrudeGeometry deck with basin cutout (not flat strips)
 *  - Detailed vent louvres with proper frames
 *  - SRE branded badge with canvas-rendered teal tiles
 *  - Ring/Torus geometries for seals, rims, screw heads
 *  - Strain relief boots at cord exits
 *  - Proper chamfered edges, cosmetic seams, rubber pads
 *  - Detailed PCBs with SMD components, trace patterns, capacitors
 *
 * Units ≈ 100 mm (body width 3.2 ≈ 320 mm). Y-up, front = −Z.
 */
import * as THREE from "three";

// ─── Dimensions ──────────────────────────────────────────────────────────────
const W       = 3.2;     // body width  (320 mm)
const D       = 2.0;     // body depth  (200 mm)
const BODY_H  = 1.68;    // body height (168 mm)
const BASE_Y  = 0.18;    // base/plinth height (feet + plinth)
const WALL_T  = 0.1;     // outer wall thickness
const DECK_Y  = BASE_Y + BODY_H;
const PANEL_W = 0.80;    // control panel zone width, left side

// Basin
const BASIN_INTERIOR_H = 1.20;
const BASIN_T = 0.015;
const RIGHT_ZONE_W = W - PANEL_W;
const BASIN_OFFSET_X = -W / 2 + PANEL_W + RIGHT_ZONE_W / 2;
const BASIN_W = RIGHT_ZONE_W - 2 * WALL_T - 0.16; // leave rim margin
const BASIN_D = D - 2 * WALL_T - 0.16;
const BASIN_FLOOR_Y = DECK_Y - BASIN_INTERIOR_H;

// IEC
const IEC_Y = BASE_Y + BODY_H - 0.28;

// ─── Material factory ────────────────────────────────────────────────────────
function M(color, o = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness:        o.r  ?? 0.42,
    metalness:        o.m  ?? 0.1,
    transparent:      o.o != null && o.o < 1,
    opacity:          o.o  ?? 1,
    emissive:         new THREE.Color(o.e ?? 0x000000),
    emissiveIntensity: o.ei ?? 0,
    side:             o.side ?? THREE.FrontSide,
    depthWrite:       o.dw ?? true,
  });
}

function box(w, h, d, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cyl(rt, rb, h, mat, seg = 40) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeCable(pts, radius, color, tubularSegments = 48) {
  const curve = new THREE.CatmullRomCurve3(
    pts.map(([x, y, z]) => new THREE.Vector3(x, y, z))
  );
  const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, 7, false);
  const mesh = new THREE.Mesh(geo, M(color, { r: 0.72, m: 0.05 }));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// ─── Deck with rectangular basin cutout (ExtrudeGeometry) ────────────────────
function deckWithCutout(deckW, deckD, cutX, cutZ, cutW, cutD, thickness, material) {
  const shape = new THREE.Shape();
  const hw = deckW / 2, hd = deckD / 2;
  // Outer rectangle CCW
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.lineTo(hw, hd);
  shape.lineTo(-hw, hd);
  shape.closePath();

  // Rectangular hole CW (opposite winding)
  const hole = new THREE.Path();
  const cx = cutX, cz = cutZ;
  const chw = cutW / 2, chd = cutD / 2;
  hole.moveTo(cx - chw, cz - chd);
  hole.lineTo(cx - chw, cz + chd);
  hole.lineTo(cx + chw, cz + chd);
  hole.lineTo(cx + chw, cz - chd);
  hole.closePath();
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
  });
  geo.rotateX(-Math.PI / 2);
  geo.computeBoundingBox();
  geo.translate(0, -geo.boundingBox.min.y, 0);

  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// ─── SRE Designs Badge (matching centrifuge quality) ─────────────────────────
function makeSREdesignsBadge() {
  const g = new THREE.Group();
  g.name = "SREdesigns_Badge";

  const plateW = 0.98, plateH = 0.28, plateD = 0.035;

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

  // Canvas face texture
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 300;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0c1016";
  ctx.fillRect(0, 0, 1024, 300);

  const letters = ["S", "R", "E"];
  const tileW = 112, tileH = 132, gap = 5;
  const tileY = (300 - tileH) / 2;
  let x0 = 48;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 100px system-ui,Segoe UI,Arial,sans-serif";
  for (const ch of letters) {
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
    ctx.fillText(ch, x0 + tileW / 2, tileY + tileH / 2 + 3);
    x0 += tileW + gap;
  }

  const tx = x0 + 22;
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillStyle = "#5ec8d8";
  ctx.font = "600 64px system-ui,Segoe UI,Arial,sans-serif";
  ctx.fillText("designs.com", tx, 300 * 0.4);
  ctx.strokeStyle = "#3ab8c8"; ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.moveTo(tx, 300 * 0.56); ctx.lineTo(972, 300 * 0.56); ctx.stroke();
  ctx.fillStyle = "#7a8a98";
  ctx.font = "500 26px system-ui,Segoe UI,Arial,sans-serif";
  ctx.fillText("LAB SYSTEMS", tx, 300 * 0.72);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(plateW - 0.05, plateH - 0.05),
    new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.4, metalness: 0.25,
      emissive: new THREE.Color(0x041018), emissiveIntensity: 0.2,
    })
  );
  face.position.z = plateD / 2 + 0.006;
  g.add(face);

  // Corner screws
  const scMat = M(0x3a424c, { r: 0.4, m: 0.6 });
  const ox = plateW / 2 - 0.045, oy = plateH / 2 - 0.045;
  for (const [sx, sy] of [[-ox, oy], [ox, oy], [-ox, -oy], [ox, -oy]]) {
    const head = cyl(0.02, 0.02, 0.012, scMat, 10);
    head.rotation.x = Math.PI / 2;
    head.position.set(sx, sy, plateD / 2 + 0.01);
    g.add(head);
    const slot = box(0.018, 0.003, 0.004, M(0x111111, { r: 0.7 }));
    slot.position.set(sx, sy, plateD / 2 + 0.017);
    g.add(slot);
  }

  return g;
}

// ─── Key face material (matching centrifuge button quality) ───────────────────
function paintKeyLabel(ctx, label, fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 44px system-ui,sans-serif";
  ctx.fillText(label, 128, 96);
}

function keyFaceMaterial(label, bg = "#3a4452", fg = "#f3f6fa") {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 192;
  const ctx = c.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 192);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(0, 0, 256, 48);
  paintKeyLabel(ctx, label, fg);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;

  // Emissive map — white letters only
  const ce = document.createElement("canvas");
  ce.width = 256; ce.height = 192;
  const ctxE = ce.getContext("2d");
  ctxE.fillStyle = "#000000";
  ctxE.fillRect(0, 0, 256, 192);
  paintKeyLabel(ctxE, label, "#ffffff");
  const emitTex = new THREE.CanvasTexture(ce);
  emitTex.colorSpace = THREE.SRGBColorSpace;

  return new THREE.MeshStandardMaterial({
    map: tex,
    emissiveMap: emitTex,
    roughness: 0.42,
    metalness: 0.12,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0,
    toneMapped: true,
  });
}

function makeKey(label, w, h, d, bgHex, faceMat) {
  const mkSide = () => new THREE.MeshStandardMaterial({
    color: bgHex, roughness: 0.45, metalness: 0.12,
    emissive: new THREE.Color(0x000000), emissiveIntensity: 0,
  });
  const mats = [mkSide(), mkSide(), mkSide(), mkSide(), faceMat, mkSide()];
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
  mesh.rotation.y = Math.PI; // Rotate 180 deg to face -Z (front of machine)
  mesh.castShadow = true;
  mesh.userData.glowMaterials = mats;
  mesh.userData.faceMat = faceMat;
  mesh.userData.restEmissive = 0;

  // Additive halo
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x00e8ff, transparent: true, opacity: 0.5,
    depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending,
  });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.35, h * 1.35), haloMat);
  halo.position.z = d / 2 + 0.02;
  halo.visible = false;
  halo.renderOrder = 2;
  mesh.add(halo);
  mesh.userData.halo = halo;
  mesh.userData.haloMat = haloMat;

  return mesh;
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN MODEL BUILDER
// ═════════════════════════════════════════════════════════════════════════════

export function createUltrasonicCleanerModel(lcdTexture, opts = {}) {
  const root = new THREE.Group();
  root.name = "Ultrasonic_Root";

  const bodyGroup    = new THREE.Group(); bodyGroup.name    = "Body_Assembly";
  const consoleG     = new THREE.Group(); consoleG.name     = "Console_Assembly";
  const basinGroup   = new THREE.Group(); basinGroup.name   = "Basin_Assembly";
  const basketGroup  = new THREE.Group(); basketGroup.name  = "Basket_Assembly";
  const lidGroup     = new THREE.Group(); lidGroup.name     = "Lid_Hinge";
  const fluidGroup   = new THREE.Group(); fluidGroup.name   = "Fluid_Assembly";
  const driveGroup   = new THREE.Group(); driveGroup.name   = "Electronics_Bay";

  const buttons = {};

  // ─── Material palette ──────────────────────────────────────────────────────
  const skin     = M(0xe8ecf2, { r: 0.36, m: 0.06, side: THREE.DoubleSide });
  const dark     = M(0x2a313a, { r: 0.4, m: 0.15 });
  const ss304    = M(0xd6dce4, { r: 0.12, m: 0.95 });
  const ss304Int = M(0xdce2e8, { r: 0.10, m: 0.95, side: THREE.DoubleSide });
  const rubber   = M(0x1a1f26, { r: 0.9, m: 0.05 });
  const pcbGreen = M(0x14532d, { r: 0.7, m: 0.08 });
  const pcbDark  = M(0x0a3d1f, { r: 0.65, m: 0.1 });
  const copper   = M(0xb87333, { r: 0.3, m: 0.85 });
  const alum     = M(0xc0c6cc, { r: 0.25, m: 0.75 });
  const ventDark = M(0x1a1f26, { r: 0.55, m: 0.15 });
  const ventBar  = M(0x3a424c, { r: 0.45, m: 0.25 });
  const metalStop = M(0x9aa3ac, { r: 0.32, m: 0.75 });

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSEMBLY 1: BODY (Chassis Shell)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Rubber feet (4 corners) ────────────────────────────────────────────────
  const footInset = 0.22;
  for (let i = 0; i < 4; i++) {
    const fx = (i % 2 === 0 ? -1 : 1) * (W / 2 - footInset);
    const fz = (i < 2 ? -1 : 1) * (D / 2 - footInset);
    const foot = cyl(0.11, 0.12, 0.07, M(0x111111, { r: 0.9 }), 16);
    foot.position.set(fx, 0.035, fz);
    foot.name = `Foot_${i}`;
    bodyGroup.add(foot);
  }

  // ── Base plinth ────────────────────────────────────────────────────────────
  const plinth = box(W + 0.08, 0.14, D + 0.08, M(0x1a1f26, { r: 0.55, m: 0.1 }));
  plinth.position.y = 0.1;
  plinth.name = "Base_Plinth";
  bodyGroup.add(plinth);

  // ── Hollow shell walls ─────────────────────────────────────────────────────
  const floorH = 0.1;
  const floor = box(W, floorH, D, skin);
  floor.position.set(0, BASE_Y + floorH / 2, 0);
  floor.name = "Body_Floor";
  bodyGroup.add(floor);

  const wallH = BODY_H - floorH;
  const wallY = BASE_Y + floorH + wallH / 2;

  // Front wall (−Z) — full height
  const frontWall = box(W, wallH, WALL_T, skin);
  frontWall.position.set(0, wallY, -D / 2 + WALL_T / 2);
  frontWall.name = "Body_Front";
  bodyGroup.add(frontWall);

  // Back wall (+Z)
  const backWall = box(W, wallH, WALL_T, skin);
  backWall.position.set(0, wallY, D / 2 - WALL_T / 2);
  backWall.name = "Body_Back";
  bodyGroup.add(backWall);

  // Left wall (−X)
  const sideD = D - 2 * WALL_T;
  const leftWall = box(WALL_T, wallH, sideD, skin);
  leftWall.position.set(-W / 2 + WALL_T / 2, wallY, 0);
  leftWall.name = "Body_Left";
  bodyGroup.add(leftWall);

  // Right wall (+X)
  const rightWall = box(WALL_T, wallH, sideD, skin);
  rightWall.position.set(W / 2 - WALL_T / 2, wallY, 0);
  rightWall.name = "Body_Right";
  bodyGroup.add(rightWall);

  // ── Internal partition wall ────────────────────────────────────────────────
  const partitionX = -W / 2 + PANEL_W;
  const partitionWall = box(0.06, wallH, sideD, M(0xd0d4da, { r: 0.4, m: 0.1, side: THREE.DoubleSide }));
  partitionWall.position.set(partitionX, wallY, 0);
  partitionWall.name = "Body_Partition";
  bodyGroup.add(partitionWall);

  // ── Top deck with rectangular basin cutout (ExtrudeGeometry) ────────────────
  const deckThickness = 0.08;
  const deckMat = M(0xe8ecf2, { r: 0.36, m: 0.06, side: THREE.DoubleSide });
  const cutoutW = BASIN_W + 0.04;
  const cutoutD = BASIN_D + 0.04;
  const topDeck = deckWithCutout(
    W + 0.04, D + 0.04,
    BASIN_OFFSET_X, 0,
    cutoutW, cutoutD,
    deckThickness, deckMat
  );
  topDeck.position.y = DECK_Y - deckThickness;
  topDeck.name = "Top_Deck";
  bodyGroup.add(topDeck);

  // Dark inset rim around basin cutout
  const rimShape = new THREE.Shape();
  const rh = cutoutW / 2 + 0.06, rd = cutoutD / 2 + 0.06;
  rimShape.moveTo(BASIN_OFFSET_X - rh, -rd);
  rimShape.lineTo(BASIN_OFFSET_X + rh, -rd);
  rimShape.lineTo(BASIN_OFFSET_X + rh, rd);
  rimShape.lineTo(BASIN_OFFSET_X - rh, rd);
  rimShape.closePath();
  const rimHole = new THREE.Path();
  const irh = cutoutW / 2, ird = cutoutD / 2;
  rimHole.moveTo(BASIN_OFFSET_X - irh, -ird);
  rimHole.lineTo(BASIN_OFFSET_X - irh, ird);
  rimHole.lineTo(BASIN_OFFSET_X + irh, ird);
  rimHole.lineTo(BASIN_OFFSET_X + irh, -ird);
  rimHole.closePath();
  rimShape.holes.push(rimHole);
  const rimGeo = new THREE.ShapeGeometry(rimShape);
  const deckRim = new THREE.Mesh(rimGeo, dark);
  deckRim.rotation.x = -Math.PI / 2;
  deckRim.position.y = DECK_Y + 0.002;
  deckRim.name = "Deck_Basin_Rim";
  bodyGroup.add(deckRim);

  // ── Cosmetic seam line ─────────────────────────────────────────────────────
  const seamBelt = box(W - 0.06, 0.04, 0.06, dark);
  seamBelt.position.set(0, BASE_Y + 0.72, -D / 2 - 0.01);
  seamBelt.name = "Body_Front_Seam";
  bodyGroup.add(seamBelt);

  // ── Side air-vent louvres (proper framed grilles like centrifuge) ───────────
  const ventZ = 0;
  const ventDepth = 1.0;
  for (const side of [-1, 1]) {
    const xOuter = side * (W / 2 + 0.014);
    const panel = box(0.05, 0.9, ventDepth, ventDark);
    panel.position.set(side * (W / 2 - 0.01), BASE_Y + BODY_H / 2, ventZ);
    panel.name = side < 0 ? "Vent_Panel_L" : "Vent_Panel_R";
    bodyGroup.add(panel);

    for (let i = 0; i < 9; i++) {
      const louvre = box(0.045, 0.034, ventDepth - 0.12, ventBar);
      louvre.position.set(xOuter, BASE_Y + 0.45 + i * 0.078, ventZ);
      louvre.name = "Side_Vent_Louver";
      bodyGroup.add(louvre);
    }
    // Frame posts
    for (const z of [ventZ - ventDepth / 2 + 0.04, ventZ + ventDepth / 2 - 0.04]) {
      const frame = box(0.04, 0.9, 0.045, ventBar);
      frame.position.set(xOuter, BASE_Y + BODY_H / 2, z);
      bodyGroup.add(frame);
    }
    for (const y of [BASE_Y + 0.38, BASE_Y + BODY_H - 0.1]) {
      const frame = box(0.04, 0.04, ventDepth - 0.06, ventBar);
      frame.position.set(xOuter, y, ventZ);
      bodyGroup.add(frame);
    }
  }

  // ── Rear vents ─────────────────────────────────────────────────────────────
  for (let i = 0; i < 5; i++) {
    const v = box(0.9, 0.035, 0.025, dark);
    v.position.set(BASIN_OFFSET_X, BASE_Y + 0.5 + i * 0.14, D / 2 + 0.01);
    v.name = `Rear_Vent_${i}`;
    bodyGroup.add(v);
  }

  // ── IEC C14 mains inlet (upper rear, electronics side) ─────────────────────
  const iecX = -W / 2 + PANEL_W / 2;
  const iecZ = D / 2;
  const iecHousing = box(0.34, 0.24, 0.1, dark);
  iecHousing.position.set(iecX, IEC_Y, iecZ + 0.02);
  iecHousing.name = "IEC_Inlet_Housing";
  bodyGroup.add(iecHousing);
  const iecFace = box(0.24, 0.16, 0.03, M(0x0a0c10, { r: 0.6 }));
  iecFace.position.set(iecX, IEC_Y, iecZ + 0.08);
  iecFace.name = "IEC_Inlet";
  bodyGroup.add(iecFace);
  // Earth pin detail
  const iecPin = box(0.06, 0.04, 0.02, M(0xc8ccd0, { r: 0.35, m: 0.7 }));
  iecPin.position.set(iecX, IEC_Y - 0.02, iecZ + 0.1);
  bodyGroup.add(iecPin);
  // Strain-relief boot
  const boot = cyl(0.055, 0.04, 0.12, M(0x1f2937, { r: 0.75 }), 12);
  boot.rotation.x = Math.PI / 2;
  boot.position.set(iecX, IEC_Y - 0.02, iecZ + 0.14);
  boot.name = "Cord_Strain_Relief";
  bodyGroup.add(boot);

  // ── Fuse holder ────────────────────────────────────────────────────────────
  const fuseHolder = box(0.16, 0.12, 0.06, dark);
  fuseHolder.position.set(iecX + 0.28, IEC_Y - 0.08, iecZ + 0.01);
  fuseHolder.name = "Fuse_Holder";
  bodyGroup.add(fuseHolder);
  const fuseFace = box(0.10, 0.06, 0.02, M(0x333333, { r: 0.5 }));
  fuseFace.position.set(iecX + 0.28, IEC_Y - 0.08, iecZ + 0.045);
  bodyGroup.add(fuseFace);

  // Power rocker switch
  const rockerSwitch = box(0.18, 0.10, 0.04, M(0x111111, { r: 0.7 }));
  rockerSwitch.position.set(iecX, IEC_Y + 0.22, iecZ + 0.01);
  rockerSwitch.name = "Power_Switch_Rear";
  bodyGroup.add(rockerSwitch);
  const rocker = box(0.12, 0.06, 0.02, M(0xcc0000, { r: 0.4 }));
  rocker.position.set(iecX, IEC_Y + 0.22, iecZ + 0.035);
  bodyGroup.add(rocker);

  // ── SRE Badge (opposite control panel) ──────────────────────────────────────
  const badge = makeSREdesignsBadge();
  badge.position.set(W / 2 - 0.6, BASE_Y + 0.38, -D / 2 - 0.02);
  badge.rotation.y = Math.PI;
  bodyGroup.add(badge);

  // ── Screw heads on body seams ──────────────────────────────────────────────
  const screwMat = M(0x3a424c, { r: 0.4, m: 0.6 });
  const screwPositions = [
    [-W / 2 - 0.01, BASE_Y + 0.5, -0.4],
    [-W / 2 - 0.01, BASE_Y + 0.5, 0.4],
    [W / 2 + 0.01, BASE_Y + 0.5, -0.4],
    [W / 2 + 0.01, BASE_Y + 0.5, 0.4],
    [-W / 2 - 0.01, DECK_Y - 0.15, 0],
    [W / 2 + 0.01, DECK_Y - 0.15, 0],
  ];
  for (let i = 0; i < screwPositions.length; i++) {
    const [sx, sy, sz] = screwPositions[i];
    const head = cyl(0.022, 0.022, 0.012, screwMat, 10);
    head.rotation.z = Math.PI / 2;
    head.position.set(sx, sy, sz);
    head.name = `Body_Screw_${i}`;
    bodyGroup.add(head);
    // Phillips slot
    const slot1 = box(0.018, 0.003, 0.003, M(0x111111, { r: 0.7 }));
    slot1.position.set(sx, sy, sz);
    bodyGroup.add(slot1);
    const slot2 = box(0.003, 0.003, 0.018, M(0x111111, { r: 0.7 }));
    slot2.position.set(sx, sy, sz);
    bodyGroup.add(slot2);
  }

  // ── Lid rest stoppers on deck (rubber pads + metal posts) ──────────────────
  const stopZ = -D / 2 + WALL_T + 0.12;
  for (const x of [BASIN_OFFSET_X - cutoutW / 3, BASIN_OFFSET_X + cutoutW / 3]) {
    const base = box(0.2, 0.025, 0.16, rubber);
    base.position.set(x, DECK_Y + 0.012, stopZ);
    base.name = "Lid_Stopper_Pad";
    bodyGroup.add(base);
    const bump = cyl(0.055, 0.06, 0.045, rubber, 16);
    bump.position.set(x, DECK_Y + 0.04, stopZ);
    bump.name = "Lid_Stopper";
    bodyGroup.add(bump);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.04, 0.008, 6, 16), metalStop
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, DECK_Y + 0.055, stopZ);
    bodyGroup.add(ring);
  }

  // ── Rating label (rear, bottom) ────────────────────────────────────────────
  const rlCanvas = document.createElement("canvas");
  rlCanvas.width = 256; rlCanvas.height = 128;
  const rlCtx = rlCanvas.getContext("2d");
  rlCtx.fillStyle = "#d8dce0";
  rlCtx.fillRect(0, 0, 256, 128);
  rlCtx.fillStyle = "#2a2a2a";
  rlCtx.font = "bold 16px monospace";
  rlCtx.fillText("UC-3000-PRO  40kHz  180W", 10, 24);
  rlCtx.fillText("100-240V~ 50/60Hz  2.2A", 10, 48);
  rlCtx.fillText("SRE designs.com", 10, 72);
  rlCtx.fillText("SERIAL: UC-2026-0001", 10, 96);
  const rlTex = new THREE.CanvasTexture(rlCanvas);
  rlTex.colorSpace = THREE.SRGBColorSpace;
  const ratingLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.25),
    new THREE.MeshStandardMaterial({ map: rlTex, roughness: 0.5, metalness: 0.1 })
  );
  ratingLabel.position.set(BASIN_OFFSET_X, BASE_Y + 0.22, D / 2 + 0.012);
  ratingLabel.name = "Rating_Label";
  bodyGroup.add(ratingLabel);

  root.add(bodyGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSEMBLY 2: CONSOLE (Front Control Fascia)
  // ═══════════════════════════════════════════════════════════════════════════

  const fasciaW = PANEL_W - 0.06;
  const fasciaH = BODY_H * 0.7;
  const fasciaX = -W / 2 + PANEL_W / 2;
  const fasciaY = BASE_Y + BODY_H / 2;
  const fasciaZ = -D / 2;

  // Control fascia panel (recessed dark plate)
  const fascia = box(fasciaW, fasciaH, 0.06, M(0x111827, { r: 0.35, m: 0.08 }));
  fascia.position.set(fasciaX, fasciaY, fasciaZ - 0.01);
  fascia.name = "Control_Fascia";
  consoleG.add(fascia);

  // Fascia border trim
  const trimMat = M(0x2a313a, { r: 0.45, m: 0.25 });
  const trimT = 0.015;
  // Top
  const trimTop = box(fasciaW + 0.04, trimT, 0.05, trimMat);
  trimTop.position.set(fasciaX, fasciaY + fasciaH / 2 + trimT / 2, fasciaZ - 0.015);
  consoleG.add(trimTop);
  // Bottom
  const trimBot = box(fasciaW + 0.04, trimT, 0.05, trimMat);
  trimBot.position.set(fasciaX, fasciaY - fasciaH / 2 - trimT / 2, fasciaZ - 0.015);
  consoleG.add(trimBot);
  // Left
  const trimLeft = box(trimT, fasciaH, 0.05, trimMat);
  trimLeft.position.set(fasciaX - fasciaW / 2 - trimT / 2, fasciaY, fasciaZ - 0.015);
  consoleG.add(trimLeft);
  // Right
  const trimRight = box(trimT, fasciaH, 0.05, trimMat);
  trimRight.position.set(fasciaX + fasciaW / 2 + trimT / 2, fasciaY, fasciaZ - 0.015);
  consoleG.add(trimRight);

  // ── LCD Display (faces -Z toward viewer) ───────────────────────────────────
  const lcdW = 0.58, lcdH = 0.30;
  const lcdMat = new THREE.MeshStandardMaterial({
    map: lcdTexture,
    emissive: 0xffffff,
    emissiveMap: lcdTexture,
    emissiveIntensity: 1.8,
  });
  const lcdMesh = new THREE.Mesh(new THREE.PlaneGeometry(lcdW, lcdH), lcdMat);
  lcdMesh.rotation.y = Math.PI;  // face -Z toward viewer
  lcdMesh.position.set(fasciaX, fasciaY + fasciaH * 0.2, fasciaZ - 0.045);
  lcdMesh.name = "LCD_Display";
  consoleG.add(lcdMesh);

  // LCD bezel (raised frame)
  const lcdBezelOuter = box(lcdW + 0.08, lcdH + 0.06, 0.025, dark);
  lcdBezelOuter.position.set(fasciaX, fasciaY + fasciaH * 0.2, fasciaZ - 0.032);
  lcdBezelOuter.name = "LCD_Bezel";
  consoleG.add(lcdBezelOuter);

  // ── Up/Down Buttons (Timer and Temp) ────────────────────────────────────────
  const adjBtnW = 0.10, adjBtnH = 0.06, adjBtnD = 0.035;

  function makeAdjBtn(label, bgHex, fgHex, x, y, keyId) {
    const faceMat = keyFaceMaterial(label, bgHex, fgHex);
    const btn = makeKey(label, adjBtnW, adjBtnH, adjBtnD, parseInt(bgHex.replace('#',''), 16), faceMat);
    btn.position.set(x, y, fasciaZ - 0.045);
    btn.name = `btn_${label.toLowerCase().replace(/[^a-z]/g, '_')}`;
    btn.userData.keyId = keyId;
    consoleG.add(btn);
    return btn;
  }

  // Timer controls group
  const timerCX = fasciaX - fasciaW / 4;
  const timerAdjY = fasciaY - fasciaH * 0.05;

  // "TIMER" label
  const tlCanvas = document.createElement("canvas");
  tlCanvas.width = 128; tlCanvas.height = 48;
  const tlCtx = tlCanvas.getContext("2d");
  tlCtx.fillStyle = "#111827";
  tlCtx.fillRect(0, 0, 128, 48);
  tlCtx.fillStyle = "#8899aa";
  tlCtx.font = "bold 20px monospace";
  tlCtx.textAlign = "center";
  tlCtx.fillText("TIMER", 64, 30);
  const tlMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.14, 0.05),
    new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(tlCanvas), roughness: 0.5 })
  );
  tlMesh.rotation.y = Math.PI;
  tlMesh.position.set(timerCX, timerAdjY + 0.08, fasciaZ - 0.045);
  consoleG.add(tlMesh);

  const btnTimerUp = makeAdjBtn("▲", "#1a2940", "#60a5fa", timerCX, timerAdjY + 0.02, 'btn-time-up');
  const btnTimerDn = makeAdjBtn("▼", "#1a2940", "#60a5fa", timerCX, timerAdjY - 0.06, 'btn-time-down');
  buttons.timer_up = { mesh: btnTimerUp };
  buttons.timer_dn = { mesh: btnTimerDn };

  // Temperature controls group
  const tempCX = fasciaX + fasciaW / 4;
  const tempAdjY = fasciaY - fasciaH * 0.05;

  // "TEMP °C" label
  const ttCanvas = document.createElement("canvas");
  ttCanvas.width = 128; ttCanvas.height = 48;
  const ttCtx = ttCanvas.getContext("2d");
  ttCtx.fillStyle = "#111827";
  ttCtx.fillRect(0, 0, 128, 48);
  ttCtx.fillStyle = "#8899aa";
  ttCtx.font = "bold 20px monospace";
  ttCtx.textAlign = "center";
  ttCtx.fillText("TEMP °C", 64, 30);
  const ttMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.14, 0.05),
    new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(ttCanvas), roughness: 0.5 })
  );
  ttMesh.rotation.y = Math.PI;
  ttMesh.position.set(tempCX, tempAdjY + 0.08, fasciaZ - 0.045);
  consoleG.add(ttMesh);

  const btnTempUp = makeAdjBtn("▲", "#3a1010", "#ef4444", tempCX, tempAdjY + 0.02, 'btn-temp-up');
  const btnTempDn = makeAdjBtn("▼", "#3a1010", "#ef4444", tempCX, tempAdjY - 0.06, 'btn-temp-down');
  buttons.temp_up = { mesh: btnTempUp };
  buttons.temp_dn = { mesh: btnTempDn };

  // ── Main Control Buttons (bottom row) ───────────────────────────────────────
  const btnW = 0.14, btnH = 0.09, btnD = 0.04;
  const btnRow = fasciaY - fasciaH * 0.32;
  const btnZ = fasciaZ - 0.06;
  const btnSpacing = 0.16;
  const btnStartX = fasciaX - fasciaW / 2 + 0.125;

  const buttonDefs = [
    { id: "power", label: "POWER", bg: "#1a3328", fg: "#10b981", hex: 0x1a3328 }, // Green
    { id: "degas", label: "DEGAS", bg: "#1a2940", fg: "#3b82f6", hex: 0x1a2940 }, // Blue
    { id: "heat",  label: "HEAT",  bg: "#3a1010", fg: "#ef4444", hex: 0x3a1010 }, // Red
    { id: "start", label: "START", bg: "#332800", fg: "#eab308", hex: 0x332800 }, // Yellow
  ];

  for (let i = 0; i < buttonDefs.length; i++) {
    const def = buttonDefs[i];
    const faceMat = keyFaceMaterial(def.label, def.bg, def.fg);
    const btn = makeKey(def.label, btnW, btnH, btnD, def.hex, faceMat);
    btn.position.set(btnStartX + i * btnSpacing, btnRow, btnZ);
    btn.name = `btn_${def.id}`;
    btn.userData.keyId = def.id;
    consoleG.add(btn);
    buttons[def.id] = { mesh: btn, faceMat };
  }

  // Keep knobTimer/knobTemp as null (no physical knobs anymore)
  const knobTimer = null;
  const knobTemp = null;

  root.add(consoleG);

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSEMBLY 3: BASIN (SS Tank, suspended)
  // ═══════════════════════════════════════════════════════════════════════════

  const basinInnerW = BASIN_W - 2 * BASIN_T;
  const basinInnerD = BASIN_D - 2 * BASIN_T;
  const rimFlange = 0.06;

  // Rim flange — 4 strips forming a frame (NOT a solid plate, so you can see into basin)
  const fW = BASIN_W + rimFlange * 2;
  const fD = BASIN_D + rimFlange * 2;
  const flangeT = rimFlange + 0.02; // width of each flange strip
  const flangeH = 0.04;
  // Front/Back flange strips
  for (const sz of [-1, 1]) {
    const strip = box(fW, flangeH, flangeT, ss304);
    strip.position.set(BASIN_OFFSET_X, DECK_Y + flangeH / 2, sz * (fD / 2 - flangeT / 2));
    strip.name = `Basin_Rim_${sz > 0 ? 'Back' : 'Front'}`;
    basinGroup.add(strip);
  }
  // Left/Right flange strips (shorter to not overlap corners)
  for (const sx of [-1, 1]) {
    const strip = box(flangeT, flangeH, fD - 2 * flangeT, ss304);
    strip.position.set(BASIN_OFFSET_X + sx * (fW / 2 - flangeT / 2), DECK_Y + flangeH / 2, 0);
    strip.name = `Basin_Rim_${sx > 0 ? 'Right' : 'Left'}`;
    basinGroup.add(strip);
  }

  // Polished rim edge strips around rectangular opening (no round torus)
  const rimEdgeMat = M(0x9098a0, { r: 0.28, m: 0.85 });
  const rimEdgeT = 0.012;
  const rimEdgeH = 0.02;
  const rimOW = BASIN_W + rimFlange * 2;
  const rimOD = BASIN_D + rimFlange * 2;
  // Front/Back edge strips
  for (const sz of [-1, 1]) {
    const strip = box(rimOW, rimEdgeH, rimEdgeT, rimEdgeMat);
    strip.position.set(BASIN_OFFSET_X, DECK_Y + 0.04, sz * rimOD / 2);
    strip.name = `Basin_Rim_Edge_${sz > 0 ? 'Back' : 'Front'}`;
    basinGroup.add(strip);
  }
  // Left/Right edge strips
  for (const sx of [-1, 1]) {
    const strip = box(rimEdgeT, rimEdgeH, rimOD, rimEdgeMat);
    strip.position.set(BASIN_OFFSET_X + sx * rimOW / 2, DECK_Y + 0.04, 0);
    strip.name = `Basin_Rim_Edge_${sx > 0 ? 'Right' : 'Left'}`;
    basinGroup.add(strip);
  }

  // Basin walls (4 sides, double-sided)
  const bWallH = BASIN_INTERIOR_H;
  const bWallY = DECK_Y - bWallH / 2;

  const bFront = box(BASIN_W, bWallH, BASIN_T, ss304Int);
  bFront.position.set(BASIN_OFFSET_X, bWallY, -BASIN_D / 2 + BASIN_T / 2);
  bFront.name = "Basin_Front";
  basinGroup.add(bFront);

  const bBack = box(BASIN_W, bWallH, BASIN_T, ss304Int);
  bBack.position.set(BASIN_OFFSET_X, bWallY, BASIN_D / 2 - BASIN_T / 2);
  bBack.name = "Basin_Back";
  basinGroup.add(bBack);

  const bLeft = box(BASIN_T, bWallH, BASIN_D - 2 * BASIN_T, ss304Int);
  bLeft.position.set(BASIN_OFFSET_X - BASIN_W / 2 + BASIN_T / 2, bWallY, 0);
  bLeft.name = "Basin_Left";
  basinGroup.add(bLeft);

  const bRight = box(BASIN_T, bWallH, BASIN_D - 2 * BASIN_T, ss304Int);
  bRight.position.set(BASIN_OFFSET_X + BASIN_W / 2 - BASIN_T / 2, bWallY, 0);
  bRight.name = "Basin_Right";
  basinGroup.add(bRight);

  // Basin floor
  const bFloor = box(BASIN_W - 2 * BASIN_T, BASIN_T, BASIN_D - 2 * BASIN_T, ss304Int);
  bFloor.position.set(BASIN_OFFSET_X, BASIN_FLOOR_Y + BASIN_T / 2, 0);
  bFloor.name = "Basin_Floor";
  basinGroup.add(bFloor);

  // Fill level markings
  const markMat = M(0x666666, { r: 0.5, m: 0.5 });
  for (const [label, frac] of [["MAX", 0.35], ["MIN", -0.15]]) {
    const mark = box(0.003, 0.003, 0.15, markMat);
    mark.position.set(BASIN_OFFSET_X + BASIN_W / 2 - BASIN_T - 0.01, bWallY + bWallH * frac, 0);
    mark.name = `Mark_${label}`;
    basinGroup.add(mark);
  }

  // Drain valve
  const drainX = BASIN_OFFSET_X + BASIN_W / 2 + 0.06;
  const drainY = BASIN_FLOOR_Y + 0.06;
  const drainZ = D / 2 - WALL_T - 0.1;
  const drainBody = cyl(0.04, 0.04, 0.12, ss304, 12);
  drainBody.rotation.z = Math.PI / 2;
  drainBody.position.set(drainX, drainY, drainZ);
  drainBody.name = "Drain_Valve";
  basinGroup.add(drainBody);
  const drainHandle = box(0.08, 0.015, 0.015, M(0xdd3333, { r: 0.4 }));
  drainHandle.position.set(drainX + 0.06, drainY + 0.04, drainZ);
  drainHandle.name = "Drain_Handle";
  basinGroup.add(drainHandle);

  root.add(basinGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSEMBLY 4: BASKET
  // ═══════════════════════════════════════════════════════════════════════════

  const basketW = BASIN_W * 0.82;
  const basketD = BASIN_D * 0.82;
  const basketH = BASIN_INTERIOR_H * 0.55;
  const basketMat = M(0xb8c0c8, { r: 0.3, m: 0.85 });
  const wireR = 0.008;

  // Wire mesh grid (horizontal and vertical lines)
  const gridSpacing = 0.08;

  // Bottom grid
  for (let x = -basketW / 2; x <= basketW / 2; x += gridSpacing) {
    const wire = cyl(wireR, wireR, basketD, basketMat, 6);
    wire.rotation.x = Math.PI / 2;
    wire.position.set(x, 0, 0);
    basketGroup.add(wire);
  }
  for (let z = -basketD / 2; z <= basketD / 2; z += gridSpacing) {
    const wire = cyl(wireR, wireR, basketW, basketMat, 6);
    wire.rotation.z = Math.PI / 2;
    wire.position.set(0, 0, z);
    basketGroup.add(wire);
  }

  // Side walls (vertical wires)
  for (const side of [-1, 1]) {
    for (let z = -basketD / 2; z <= basketD / 2; z += gridSpacing * 2) {
      const wire = cyl(wireR, wireR, basketH, basketMat, 6);
      wire.position.set(side * basketW / 2, basketH / 2, z);
      basketGroup.add(wire);
    }
    // Horizontal frame rods on sides
    for (let h = 0; h < 3; h++) {
      const rod = cyl(wireR * 1.5, wireR * 1.5, basketD, basketMat, 6);
      rod.rotation.x = Math.PI / 2;
      rod.position.set(side * basketW / 2, h * basketH / 2, 0);
      basketGroup.add(rod);
    }
  }
  // Front/back walls
  for (const side of [-1, 1]) {
    for (let x = -basketW / 2; x <= basketW / 2; x += gridSpacing * 2) {
      const wire = cyl(wireR, wireR, basketH, basketMat, 6);
      wire.position.set(x, basketH / 2, side * basketD / 2);
      basketGroup.add(wire);
    }
    for (let h = 0; h < 3; h++) {
      const rod = cyl(wireR * 1.5, wireR * 1.5, basketW, basketMat, 6);
      rod.rotation.z = Math.PI / 2;
      rod.position.set(0, h * basketH / 2, side * basketD / 2);
      basketGroup.add(rod);
    }
  }

  // Top rim (thick rod frame)
  const rimRodR = wireR * 2.5;
  const rimY = basketH;
  for (const [w, d, rotZ, ox, oz] of [
    [basketW, 0, 0, 0, -basketD / 2],
    [basketW, 0, 0, 0, basketD / 2],
    [0, basketD, Math.PI / 2, -basketW / 2, 0],
    [0, basketD, Math.PI / 2, basketW / 2, 0],
  ]) {
    const len = w || d;
    const rod = cyl(rimRodR, rimRodR, len, basketMat, 8);
    if (w > 0) rod.rotation.z = Math.PI / 2;
    if (d > 0) { rod.rotation.x = Math.PI / 2; rod.rotation.z = 0; }
    rod.position.set(ox, rimY, oz);
    basketGroup.add(rod);
  }

  // Basket handles
  const handleH = 0.14;
  const handleRod = wireR * 2;
  for (const side of [-1, 1]) {
    // Vertical arm
    const arm = cyl(handleRod, handleRod, handleH, basketMat, 8);
    arm.position.set(side * (basketW / 2 + 0.02), rimY + handleH / 2, 0);
    arm.name = `Basket_Handle_${side > 0 ? "R" : "L"}`;
    basketGroup.add(arm);
    // Horizontal hook
    const hook = cyl(handleRod, handleRod, 0.06, basketMat, 8);
    hook.rotation.z = Math.PI / 2;
    hook.position.set(side * (basketW / 2 + 0.05), rimY + handleH, 0);
    basketGroup.add(hook);
  }

  root.add(basketGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSEMBLY 5: LID (hinge at BACK, opens UP and away from basin)
  // ═══════════════════════════════════════════════════════════════════════════

  // Hinge pivot at the back edge of the basin opening
  const hingeZ = D / 2 - WALL_T - 0.04;
  const hingeY = DECK_Y + 0.04;
  lidGroup.position.set(BASIN_OFFSET_X, hingeY, hingeZ);

  const lidW = BASIN_W + rimFlange * 2 + 0.02;
  const lidD_total = BASIN_D + rimFlange * 2 + 0.02;
  const LID_H = 0.07;

  // Lid plate extends FORWARD from hinge (toward -Z)
  const lidPlate = box(lidW, LID_H, lidD_total, ss304);
  lidPlate.position.set(0, LID_H / 2, -lidD_total / 2);
  lidPlate.name = "Lid_Plate";
  lidGroup.add(lidPlate);

  // Chamfer strips along lid edges
  const chamferMat = M(0xa0a8b0, { r: 0.2, m: 0.8 });
  for (const [cx, cz, cw, cd] of [
    [0, -lidD_total + 0.01, lidW, 0.015],    // front edge
    [0, -0.01, lidW, 0.015],                  // back edge (near hinge)
    [-lidW / 2 + 0.01, -lidD_total / 2, 0.015, lidD_total - 0.02],  // left
    [lidW / 2 - 0.01, -lidD_total / 2, 0.015, lidD_total - 0.02],   // right
  ]) {
    const chamfer = box(cw, 0.008, cd, chamferMat);
    chamfer.position.set(cx, LID_H + 0.004, cz);
    lidGroup.add(chamfer);
  }

  // Gasket seal (silicone perimeter strip on underside)
  const gasketMat = M(0x4a5568, { r: 0.85, m: 0.02 });
  const gFront = box(lidW - 0.06, 0.015, 0.02, gasketMat);
  gFront.position.set(0, -0.005, -lidD_total + 0.02);
  lidGroup.add(gFront);
  for (const sx of [-1, 1]) {
    const gSide = box(0.02, 0.015, lidD_total - 0.04, gasketMat);
    gSide.position.set(sx * (lidW / 2 - 0.02), -0.005, -lidD_total / 2);
    lidGroup.add(gSide);
  }

  // Handle (pull tab on front edge of lid)
  const handle = box(0.3, 0.03, 0.07, dark);
  handle.position.set(0, LID_H + 0.015, -lidD_total + 0.04);
  handle.name = "Lid_Handle";
  lidGroup.add(handle);
  const gripInset = box(0.24, 0.018, 0.04, M(0x555555, { r: 0.6, m: 0.1 }));
  gripInset.position.set(0, LID_H + 0.02, -lidD_total + 0.04);
  lidGroup.add(gripInset);

  // Hinge barrel at pivot point (back edge)
  const hingeBarrel = cyl(0.025, 0.025, lidW * 0.6, alum, 12);
  hingeBarrel.rotation.z = Math.PI / 2;
  hingeBarrel.position.set(0, 0, 0.02);
  hingeBarrel.name = "Hinge_Barrel";
  lidGroup.add(hingeBarrel);

  root.add(lidGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSEMBLY 6: FLUID
  // ═══════════════════════════════════════════════════════════════════════════

  const fluidMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8, transparent: true, opacity: 0.6,
    roughness: 0.1, depthWrite: false, side: THREE.DoubleSide,
  });
  const fluidW = basinInnerW - 0.04;
  const fluidD = basinInnerD - 0.04;
  const fluidH = BASIN_INTERIOR_H * 0.7;
  const fluidMesh = new THREE.Mesh(
    new THREE.BoxGeometry(fluidW, fluidH, fluidD), fluidMat
  );
  fluidMesh.position.set(BASIN_OFFSET_X, BASIN_FLOOR_Y + fluidH / 2 + 0.02, 0);
  fluidMesh.name = "Cleaning_Fluid";
  fluidGroup.add(fluidMesh);

  // Cavitation particles
  const particleCount = 400;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPos[i * 3] = BASIN_OFFSET_X + (Math.random() - 0.5) * fluidW * 0.9;
    pPos[i * 3 + 1] = BASIN_FLOOR_Y + 0.05 + Math.random() * fluidH * 0.8;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * fluidD * 0.9;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xe0f2fe, size: 0.025, transparent: true, opacity: 0.0,
    blending: THREE.AdditiveBlending,
  });
  const cavitationParticles = new THREE.Points(pGeo, pMat);
  cavitationParticles.name = "Cavitation_Particles";
  cavitationParticles.visible = false;
  fluidGroup.add(cavitationParticles);

  root.add(fluidGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSEMBLY 7: ELECTRONICS BAY
  // ═══════════════════════════════════════════════════════════════════════════

  const elecCX = -W / 2 + PANEL_W / 2;
  const elecFloor = BASE_Y + 0.18;

  // ── EMI Line Filter ────────────────────────────────────────────────────────
  const emiFilter = box(0.22, 0.12, 0.08, M(0x222222, { r: 0.6, m: 0.1 }));
  emiFilter.position.set(elecCX, IEC_Y - 0.22, D / 2 - WALL_T - 0.08);
  emiFilter.name = "EMI_Filter";
  driveGroup.add(emiFilter);

  // ── Driver PCB (40kHz generator) ───────────────────────────────────────────
  const driverY = elecFloor + 0.35;
  const driverPCB = box(0.55, 0.018, 0.35, pcbGreen);
  driverPCB.position.set(elecCX, driverY, 0.1);
  driverPCB.name = "Driver_PCB";
  driveGroup.add(driverPCB);

  // PCB trace pattern (copper traces)
  for (let i = 0; i < 6; i++) {
    const trace = box(0.4 - i * 0.05, 0.002, 0.008, copper);
    trace.position.set(elecCX, driverY + 0.011, 0.1 - 0.12 + i * 0.05);
    driveGroup.add(trace);
  }

  // SMD resistors / capacitors on driver board
  const smdMat = M(0x1a1a1a, { r: 0.5, m: 0.1 });
  for (let i = 0; i < 8; i++) {
    const smd = box(0.015, 0.008, 0.008, smdMat);
    smd.position.set(
      elecCX - 0.2 + i * 0.055,
      driverY + 0.013,
      0.1 + 0.08
    );
    driveGroup.add(smd);
  }

  // MOSFETs (TO-220)
  for (let i = 0; i < 2; i++) {
    const mosfet = box(0.04, 0.065, 0.018, M(0x111111, { r: 0.5, m: 0.2 }));
    mosfet.position.set(elecCX - 0.12 + i * 0.1, driverY + 0.04, 0.1 + 0.12);
    mosfet.name = `MOSFET_${i}`;
    driveGroup.add(mosfet);
    const tab = box(0.035, 0.05, 0.002, alum);
    tab.position.set(elecCX - 0.12 + i * 0.1, driverY + 0.04, 0.1 + 0.13);
    driveGroup.add(tab);
    // Leads
    for (let j = 0; j < 3; j++) {
      const lead = cyl(0.003, 0.003, 0.03, M(0xaaaaaa, { r: 0.3, m: 0.7 }), 4);
      lead.position.set(elecCX - 0.12 + i * 0.1 - 0.01 + j * 0.01, driverY - 0.005, 0.1 + 0.12);
      driveGroup.add(lead);
    }
  }

  // Heatsink (finned)
  const hsW = 0.22, hsH = 0.20, hsD = 0.08;
  const heatsink = box(hsW, hsH, hsD, alum);
  heatsink.position.set(elecCX - 0.18, driverY + 0.04, D / 2 - WALL_T - hsD / 2 - 0.02);
  heatsink.name = "Heatsink";
  driveGroup.add(heatsink);
  for (let i = 0; i < 8; i++) {
    const fin = box(0.005, hsH - 0.02, hsD - 0.01, alum);
    fin.position.set(
      heatsink.position.x - hsW / 2 + 0.015 + i * (hsW - 0.03) / 7,
      heatsink.position.y,
      heatsink.position.z
    );
    fin.name = `Heatsink_Fin_${i}`;
    driveGroup.add(fin);
  }

  // Transformer
  const transformer = cyl(0.06, 0.06, 0.08, M(0x333333, { r: 0.7 }), 12);
  transformer.position.set(elecCX + 0.12, driverY + 0.05, 0.1);
  transformer.name = "Transformer";
  driveGroup.add(transformer);
  const winding = cyl(0.065, 0.065, 0.06, copper, 12);
  winding.position.set(elecCX + 0.12, driverY + 0.05, 0.1);
  driveGroup.add(winding);

  // Electrolytic capacitors
  for (let i = 0; i < 2; i++) {
    const cap = cyl(0.035, 0.035, 0.10, M(0x1a3a6a, { r: 0.4, m: 0.1 }), 12);
    cap.position.set(elecCX + 0.02 + i * 0.09, driverY + 0.06, -0.05);
    cap.name = `Filter_Cap_${i}`;
    driveGroup.add(cap);
    // Silver stripe
    const stripe = cyl(0.036, 0.036, 0.01, alum, 12);
    stripe.position.set(elecCX + 0.02 + i * 0.09, driverY + 0.11, -0.05);
    driveGroup.add(stripe);
  }

  // Rectifier bridge
  const rectifier = box(0.04, 0.04, 0.04, M(0x111111, { r: 0.5, m: 0.1 }));
  rectifier.position.set(elecCX + 0.2, driverY + 0.03, 0.2);
  rectifier.name = "Rectifier_Bridge";
  driveGroup.add(rectifier);

  // ── Controller PCB ─────────────────────────────────────────────────────────
  const ctrlY = elecFloor + 0.65;
  const ctrlPCB = box(0.50, 0.018, 0.30, pcbDark);
  ctrlPCB.position.set(elecCX, ctrlY, -0.05);
  ctrlPCB.name = "Controller_PCB";
  driveGroup.add(ctrlPCB);

  // Controller board traces
  for (let i = 0; i < 5; i++) {
    const trace = box(0.35 - i * 0.04, 0.002, 0.006, copper);
    trace.position.set(elecCX, ctrlY + 0.011, -0.05 - 0.1 + i * 0.04);
    driveGroup.add(trace);
  }

  // MCU (QFP-48)
  const mcu = box(0.05, 0.01, 0.05, M(0x1a1a1a, { r: 0.5 }));
  mcu.position.set(elecCX - 0.08, ctrlY + 0.014, -0.05);
  mcu.name = "MCU_Chip";
  driveGroup.add(mcu);
  // MCU dot (pin 1 marker)
  const mcuDot = cyl(0.003, 0.003, 0.003, M(0xffffff, { r: 0.5 }), 6);
  mcuDot.position.set(elecCX - 0.08 - 0.02, ctrlY + 0.02, -0.05 - 0.02);
  driveGroup.add(mcuDot);

  // Crystal oscillator
  const crystal = box(0.02, 0.008, 0.01, M(0xc0c0c0, { r: 0.3, m: 0.6 }));
  crystal.position.set(elecCX - 0.06, ctrlY + 0.014, -0.08);
  crystal.name = "Crystal_Osc";
  driveGroup.add(crystal);

  // Heater relay
  const relay = box(0.06, 0.05, 0.04, M(0x2244aa, { r: 0.5, m: 0.1 }));
  relay.position.set(elecCX + 0.15, ctrlY + 0.035, -0.05);
  relay.name = "Heater_Relay";
  driveGroup.add(relay);

  // LCD connector header
  const lcdHeader = box(0.08, 0.025, 0.015, M(0xf0f0f0, { r: 0.4 }));
  lcdHeader.position.set(elecCX - 0.15, ctrlY + 0.018, -0.18);
  lcdHeader.name = "LCD_Connector";
  driveGroup.add(lcdHeader);

  // ── Piezoelectric Transducers ──────────────────────────────────────────────
  const piezoR = 0.07, piezoH = 0.03;
  const piezoY = BASIN_FLOOR_Y - piezoH / 2;
  const piezoMat = M(0xd4aa44, { r: 0.3, m: 0.6 });
  const piezoPositions = [
    [BASIN_OFFSET_X - 0.35, piezoY, -0.25],
    [BASIN_OFFSET_X + 0.35, piezoY, -0.25],
    [BASIN_OFFSET_X - 0.35, piezoY, 0.25],
    [BASIN_OFFSET_X + 0.35, piezoY, 0.25],
  ];
  for (let i = 0; i < piezoPositions.length; i++) {
    const [px, py, pz] = piezoPositions[i];
    const piezo = cyl(piezoR, piezoR, piezoH, piezoMat, 16);
    piezo.position.set(px, py, pz);
    piezo.name = `Piezo_${i}`;
    driveGroup.add(piezo);
    // Adhesive ring
    const adhesive = new THREE.Mesh(
      new THREE.TorusGeometry(piezoR - 0.01, 0.008, 6, 16),
      M(0x888866, { r: 0.7 })
    );
    adhesive.rotation.x = Math.PI / 2;
    adhesive.position.set(px, py + piezoH / 2 + 0.004, pz);
    driveGroup.add(adhesive);
  }

  // Heater pad
  const heaterPad = box(BASIN_W * 0.6, 0.015, BASIN_D * 0.5, copper);
  heaterPad.position.set(BASIN_OFFSET_X, BASIN_FLOOR_Y - 0.02, 0);
  heaterPad.name = "Heater_Pad";
  driveGroup.add(heaterPad);

  // Thermistor
  const thermistor = cyl(0.012, 0.012, 0.015, M(0x996633, { r: 0.6 }), 8);
  thermistor.rotation.z = Math.PI / 2;
  thermistor.position.set(BASIN_OFFSET_X + BASIN_W / 2 - 0.05, BASIN_FLOOR_Y + 0.15, 0);
  thermistor.name = "Temp_Sensor";
  driveGroup.add(thermistor);

  // ── Internal Wiring ────────────────────────────────────────────────────────
  const wR = 0.012, tR = 0.008;
  const leftWallXi = -W / 2 + WALL_T + 0.03;

  // W01: Mains Live
  driveGroup.add(Object.assign(makeCable([
    [iecX, IEC_Y, D / 2 - 0.05],
    [iecX, IEC_Y - 0.10, D / 2 - WALL_T - 0.04],
    [elecCX, IEC_Y - 0.22, D / 2 - WALL_T - 0.06],
    [elecCX, driverY + 0.02, 0.1 + 0.16],
  ], wR, 0x8B4513, 32), { name: "W01_MainsLive" }));

  // W02: Neutral
  driveGroup.add(Object.assign(makeCable([
    [iecX + 0.04, IEC_Y - 0.02, D / 2 - 0.05],
    [iecX + 0.04, IEC_Y - 0.12, D / 2 - WALL_T - 0.04],
    [elecCX + 0.04, IEC_Y - 0.22, D / 2 - WALL_T - 0.06],
    [elecCX + 0.04, driverY + 0.02, 0.1 + 0.14],
  ], wR, 0x1E90FF, 32), { name: "W02_MainsNeutral" }));

  // W03: PE Ground
  driveGroup.add(Object.assign(makeCable([
    [iecX - 0.04, IEC_Y + 0.02, D / 2 - 0.05],
    [iecX - 0.04, IEC_Y, D / 2 - WALL_T - 0.03],
    [-W / 2 + WALL_T + 0.04, IEC_Y - 0.05, D / 2 - WALL_T - 0.03],
  ], wR, 0x9ACD32, 24), { name: "W03_PE_Ground" }));

  // W04-W05: DC bus
  driveGroup.add(Object.assign(makeCable([
    [elecCX - 0.08, driverY + 0.01, -0.02],
    [elecCX - 0.08, ctrlY - 0.02, -0.04],
    [elecCX - 0.08, ctrlY + 0.01, -0.05],
  ], tR, 0xDC143C, 16), { name: "W04_DC_BusPos" }));

  driveGroup.add(Object.assign(makeCable([
    [elecCX - 0.04, driverY + 0.01, -0.02],
    [elecCX - 0.04, ctrlY - 0.02, -0.06],
    [elecCX - 0.04, ctrlY + 0.01, -0.07],
  ], tR, 0x1a1a1a, 16), { name: "W05_DC_BusNeg" }));

  // W06-W09: Transducer wiring
  for (let i = 0; i < 4; i++) {
    const [px, py, pz] = piezoPositions[i];
    driveGroup.add(Object.assign(makeCable([
      [elecCX + 0.10, driverY + 0.01, 0.05 + i * 0.03],
      [leftWallXi + 0.02, driverY - 0.1, 0.05 + i * 0.03],
      [leftWallXi + 0.02, BASIN_FLOOR_Y - 0.05, 0.05],
      [px - 0.02, BASIN_FLOOR_Y - 0.04, pz],
      [px, py - piezoH / 2, pz],
    ], tR, i % 2 === 0 ? 0xDC143C : 0x1a1a1a, 32), { name: `W0${6 + i}_Piezo_${i}` }));
  }

  // W10: Heater
  driveGroup.add(Object.assign(makeCable([
    [elecCX + 0.15, ctrlY + 0.01, -0.03],
    [leftWallXi + 0.04, ctrlY - 0.15, -0.03],
    [leftWallXi + 0.04, BASIN_FLOOR_Y - 0.04, -0.03],
    [BASIN_OFFSET_X - 0.2, BASIN_FLOOR_Y - 0.03, 0],
    [BASIN_OFFSET_X, BASIN_FLOOR_Y - 0.02, 0],
  ], tR, 0xF5F5F5, 32), { name: "W10_HeaterPower" }));

  // W11: Temp probe
  driveGroup.add(Object.assign(makeCable([
    [elecCX + 0.18, ctrlY + 0.01, -0.02],
    [partitionX + 0.06, ctrlY - 0.1, -0.02],
    [partitionX + 0.06, BASIN_FLOOR_Y + 0.12, 0],
    [BASIN_OFFSET_X + BASIN_W / 2 - 0.06, BASIN_FLOOR_Y + 0.15, 0],
  ], tR * 0.7, 0xFFD700, 24), { name: "W11_TempProbe" }));

  // W12: Console harness
  driveGroup.add(Object.assign(makeCable([
    [elecCX - 0.15, ctrlY + 0.01, -0.18],
    [leftWallXi + 0.06, ctrlY, -D / 2 + WALL_T + 0.12],
    [leftWallXi + 0.06, fasciaY, -D / 2 + WALL_T + 0.06],
    [fasciaX, fasciaY, fasciaZ + 0.04],
  ], wR * 1.2, 0x808080, 32), { name: "W12_ConsoleHarness" }));

  // Cable ties
  const tieMat = M(0xf0f0f0, { r: 0.5 });
  const tiePos = [
    [leftWallXi + 0.03, driverY - 0.1, 0.05],
    [leftWallXi + 0.03, BASIN_FLOOR_Y - 0.04, 0.05],
    [leftWallXi + 0.05, ctrlY - 0.15, -0.03],
    [leftWallXi + 0.06, fasciaY - 0.2, -D / 2 + WALL_T + 0.08],
  ];
  for (let i = 0; i < tiePos.length; i++) {
    const [tx, ty, tz] = tiePos[i];
    const tie = new THREE.Mesh(
      new THREE.TorusGeometry(0.025, 0.004, 4, 12), tieMat
    );
    tie.position.set(tx, ty, tz);
    tie.name = `Cable_Tie_${i}`;
    driveGroup.add(tie);
  }

  root.add(driveGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // IEC EXIT + ASSEMBLIES + PART CATALOG
  // ═══════════════════════════════════════════════════════════════════════════

  const iecExit = { x: iecX, y: IEC_Y - 0.02, z: D / 2 + 0.18 };

  const assemblies = {
    body: bodyGroup, console: consoleG, basin: basinGroup,
    basket: basketGroup, lid: lidGroup, fluid: fluidGroup, drive: driveGroup,
  };

  const restPositions = {};
  for (const k of Object.keys(assemblies)) {
    restPositions[k] = assemblies[k].position.clone();
  }

  const explodeOffsets = {
    body:    new THREE.Vector3(0, -0.3, 0.2),
    console: new THREE.Vector3(0, 0.05, -1.0),
    basin:   new THREE.Vector3(0, 0.6, 0),
    basket:  new THREE.Vector3(0, 1.2, 0),
    lid:     new THREE.Vector3(0, 1.6, 0.3),
    fluid:   new THREE.Vector3(0, 0.9, -0.4),
    drive:   new THREE.Vector3(0, -0.6, 0.3),
  };

  function getPartGroup(name) {
    if (/Body_|Foot_|Plinth|Deck_|Seam|Vent_|IEC_|Fuse|Switch|Badge|Rating|Screw|Stopper|Boot|Cord_Strain/i.test(name)) return "Chassis";
    if (/Console|LCD|btn_|LED_|Knob_|Fascia|Bezel|Trim/i.test(name)) return "Controls";
    if (/Basin_|Rim|Mark_|Drain|Torus/i.test(name)) return "Tank";
    if (/Basket_|Handle/i.test(name)) return "Basket";
    if (/Lid_|Gasket|Hinge|Handle|Chamfer/i.test(name)) return "Lid";
    if (/Fluid|Cavitation/i.test(name)) return "Fluid";
    if (/PCB|Driver|Controller|MOSFET|Heatsink|Fin|Transform|Cap_|Rectifier|MCU|Relay|Connector|EMI|Piezo|Heater|Temp_|Cable_Tie|W0\d|Crystal|Winding/i.test(name)) return "Electronics";
    return "Other";
  }

  const partCatalog = [];
  root.traverse((obj) => {
    if (obj.isMesh && obj.name) {
      partCatalog.push({ name: obj.name, mesh: obj, group: getPartGroup(obj.name) });
    }
  });

  return {
    root,
    lid: lidGroup,
    basket: basketGroup,
    lcdMesh,
    lcdMat,
    buttons,
    consoleG,
    fluidMesh,
    cavitationParticles,
    iecExit,
    assemblies,
    restPositions,
    explodeOffsets,
    partCatalog,
    bodyWidth: W,
    bodyDepth: D,
    bodyHeight: BODY_H,
    floorLevel: BASE_Y,
    basinOffsetX: BASIN_OFFSET_X,
    basinFloorY: BASIN_FLOOR_Y,
  };
}
