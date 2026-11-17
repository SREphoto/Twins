/**
 * sem_chamber_column.js — Hollow 316L UHV Specimen Chamber, Outward-Swinging Door
 * with Real Circular Viewport Cutout, 5-Axis Eucentric 9-Slot Carousel Stage,
 * Internal Detectors/Mirror/PT100, and Gemini II Electron Optical Column.
 *
 * Coordinate Convention: 1 unit = 100 mm = 0.1 m | +Y up | Front = -Z | screenRight = -X
 * Column & Chamber Axis: (X = -3.80 u, Z = -0.20 u)
 */

import * as THREE from 'three';
import {
  makeMat,
  createCanvas,
  MAT_ZEISS_WHITE,
  MAT_ZEISS_ANTHRACITE,
  MAT_316SS_POLISHED,
  MAT_316SS_BRUSHED,
  MAT_DARK_ANODIZED,
  MAT_BLUE_ANODIZED,
  MAT_COPPER_OFHC,
  MAT_BRASS_GOLD,
  MAT_GOLD_MIRROR,
  MAT_RUBBER_EPDM,
  MAT_VITON_SEAL,
  MAT_ALUMINA_CERAMIC,
  MAT_IC_EPOXY,
  MAT_TOROID_COIL,
  MAT_HV_EPOXY_RED,
  MAT_COOLANT_BLUE,
  MAT_WIRE_SENSOR_CYAN,
  MAT_COPPER_WINDING,
  MAT_LEAD_GLASS,
  MAT_ELECTRON_BEAM,
  createDecalQuad,
  createHexSocketScrew,
  createConFlatFlange,
  makeWiringHarness,
} from './sem_materials.js';

// ----------------------------------------------------------------------------
// Internal Helpers (Extruded Hollow Shell & Procedural Crisp Silkscreen)
// ----------------------------------------------------------------------------
function makePlaqueDecal(title, subtitle, w, h, bgHex = '#0f172a', fgHex = '#f8fafc', borderHex = '#38bdf8') {
  const c = createCanvas(512, 160);
  let mat;
  if (c) {
    const ctx = c.getContext('2d');
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 512, 160);
    ctx.strokeStyle = borderHex;
    ctx.lineWidth = 5;
    ctx.strokeRect(6, 6, 500, 148);
    ctx.fillStyle = fgHex;
    ctx.font = 'bold 34px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 256, 56);
    ctx.fillStyle = borderHex;
    ctx.font = '600 20px "Inter", sans-serif';
    ctx.fillText(subtitle, 256, 114);
    const tex = new THREE.CanvasTexture(c);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.28, metalness: 0.35 });
  } else {
    mat = makeMat(0x0f172a, { r: 0.3, m: 0.3 });
  }
  return createDecalQuad(w, h, mat);
}

/**
 * Builds an extruded hollow chamber D-profile (semicircular rear +Z, flat front -Z jambs)
 * centered on (X=0, Z=0) spanning Y = [0..height].
 * Rotation -PI/2 around X maps shape +Y -> -Z (front), +Z -> +Y (up).
 */
function createHollowChamberSection(innerR, outerR, frontZAbs, height, openFrontDoorway, material) {
  const segs = 40;
  let geo;

  if (openFrontDoorway) {
    // Open C-section leaving unobstructed front doorway opening (x in [-innerR..+innerR])
    const shape = new THREE.Shape();
    shape.moveTo(outerR, frontZAbs);
    shape.lineTo(outerR, 0);
    for (let i = 1; i <= segs; i++) {
      const a = (i / segs) * Math.PI; // 0 -> PI around rear (sy <= 0)
      shape.lineTo(Math.cos(a) * outerR, -Math.sin(a) * outerR);
    }
    shape.lineTo(-outerR, frontZAbs);
    shape.lineTo(-innerR, frontZAbs);
    shape.lineTo(-innerR, 0);
    for (let i = 1; i <= segs; i++) {
      const a = Math.PI - (i / segs) * Math.PI;
      shape.lineTo(Math.cos(a) * innerR, -Math.sin(a) * innerR);
    }
    shape.lineTo(innerR, frontZAbs);
    shape.closePath();

    geo = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: false,
      curveSegments: segs,
    });
  } else {
    // Closed D-ring section (above lintel / below sill)
    const wallT = outerR - innerR;
    const innerFrontZAbs = Math.max(0.2, frontZAbs - wallT);
    const outerShape = new THREE.Shape();
    outerShape.moveTo(outerR, frontZAbs);
    outerShape.lineTo(outerR, 0);
    for (let i = 1; i <= segs; i++) {
      const a = (i / segs) * Math.PI;
      outerShape.lineTo(Math.cos(a) * outerR, -Math.sin(a) * outerR);
    }
    outerShape.lineTo(-outerR, frontZAbs);
    outerShape.closePath();

    const hole = new THREE.Path();
    hole.moveTo(innerR, innerFrontZAbs);
    hole.lineTo(-innerR, innerFrontZAbs);
    hole.lineTo(-innerR, 0);
    for (let i = 1; i <= segs; i++) {
      const a = Math.PI - (i / segs) * Math.PI;
      hole.lineTo(Math.cos(a) * innerR, -Math.sin(a) * innerR);
    }
    hole.closePath();
    outerShape.holes.push(hole);

    geo = new THREE.ExtrudeGeometry(outerShape, {
      depth: height,
      bevelEnabled: false,
      curveSegments: segs,
    });
  }

  const mesh = new THREE.Mesh(geo, material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

/**
 * Builds a hollow D-shaped ceiling or floor bulkhead plate with a circular central bore (innerBoreR).
 */
function createHollowBulkheadPlate(outerR, frontZAbs, innerBoreR, thickness, material) {
  const segs = 40;
  const shape = new THREE.Shape();
  shape.moveTo(outerR, frontZAbs);
  shape.lineTo(outerR, 0);
  for (let i = 1; i <= segs; i++) {
    const a = (i / segs) * Math.PI;
    shape.lineTo(Math.cos(a) * outerR, -Math.sin(a) * outerR);
  }
  shape.lineTo(-outerR, frontZAbs);
  shape.closePath();

  const boreHole = new THREE.Path();
  boreHole.absarc(0, 0, innerBoreR, 0, Math.PI * 2, true);
  shape.holes.push(boreHole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
    curveSegments: segs,
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

/**
 * Builds a rounded-rectangle closed Viton O-ring gasket loop in XY plane.
 */
function createRoundedRectORing(halfW, halfH, cornerR, tubeR, material) {
  const pts = [];
  const corners = [
    [halfW - cornerR, halfH - cornerR, 0, Math.PI / 2],
    [-halfW + cornerR, halfH - cornerR, Math.PI / 2, Math.PI],
    [-halfW + cornerR, -halfH + cornerR, Math.PI, Math.PI * 1.5],
    [halfW - cornerR, -halfH + cornerR, Math.PI * 1.5, Math.PI * 2],
  ];
  corners.forEach(([cx, cy, a0, a1]) => {
    for (let s = 0; s <= 6; s++) {
      const a = a0 + (s / 6) * (a1 - a0);
      pts.push(new THREE.Vector3(cx + Math.cos(a) * cornerR, cy + Math.sin(a) * cornerR, 0));
    }
  });
  const curve = new THREE.CatmullRomCurve3(pts, true);
  const geo = new THREE.TubeGeometry(curve, 72, tubeR, 12, true);
  return new THREE.Mesh(geo, material);
}

// ----------------------------------------------------------------------------
// 316L Hollow UHV Specimen Chamber, Outward Door, Detectors & 5-Axis Stage
// ----------------------------------------------------------------------------
export function buildSpecimenChamberAndStage() {
  const chamberGroup = new THREE.Group();
  chamberGroup.name = 'Body_ChamberUHV';
  // Bottom flange underside = 9.50 - 1.95 = 7.55 (flush on isolatedDeck)
  // Top flange top = 9.50 + 1.95 = 11.45 (flush beneath Body_ColumnGemini)
  chamberGroup.position.set(-3.80, 9.50, -0.20);

  // 1. Genuine Hollow Extruded 316L Barrel (wall = 0.32 u, ID = 3.30 u, OD = 3.94 u, H = 3.62 u)
  const outerR = 1.97;
  const innerR = 1.65;
  const linerOuterR = 1.70;
  const frontFaceAbs = 1.98;

  const barrelShellGroup = new THREE.Group();
  barrelShellGroup.name = 'Body_ChamberBarrelShell';

  // Middle doorway-cutout sector: y_local = -1.48 .. +1.48 (unobstructed front doorway)
  const midOuterWall = createHollowChamberSection(linerOuterR, outerR, frontFaceAbs, 2.96, true, MAT_316SS_BRUSHED);
  midOuterWall.position.y = -1.48;
  midOuterWall.name = 'Body_ChamberOuterWallMid';
  barrelShellGroup.add(midOuterWall);

  const midInnerLiner = createHollowChamberSection(innerR, linerOuterR, frontFaceAbs, 2.96, true, MAT_DARK_ANODIZED);
  midInnerLiner.position.y = -1.48;
  midInnerLiner.name = 'Body_ChamberInnerLinerMid';
  barrelShellGroup.add(midInnerLiner);

  // Upper ring above doorway lintel: y_local = +1.48 .. +1.81
  const topShellRing = createHollowChamberSection(innerR, outerR, frontFaceAbs, 0.33, false, MAT_316SS_BRUSHED);
  topShellRing.position.y = 1.48;
  topShellRing.name = 'Body_ChamberWallUpper';
  barrelShellGroup.add(topShellRing);

  // Lower ring below doorway sill: y_local = -1.81 .. -1.48
  const botShellRing = createHollowChamberSection(innerR, outerR, frontFaceAbs, 0.33, false, MAT_316SS_BRUSHED);
  botShellRing.position.y = -1.81;
  botShellRing.name = 'Body_ChamberWallLower';
  barrelShellGroup.add(botShellRing);

  // Machined inner cavity ceiling & floor bulkheads with real bore openings (innerR = 1.15)
  const ceilingBulkhead = createHollowBulkheadPlate(innerR + 0.02, frontFaceAbs - 0.32, 1.15, 0.16, MAT_DARK_ANODIZED);
  ceilingBulkhead.position.y = 1.48;
  ceilingBulkhead.name = 'Body_ChamberCavityCeiling';
  barrelShellGroup.add(ceilingBulkhead);

  const floorBulkhead = createHollowBulkheadPlate(innerR + 0.02, frontFaceAbs - 0.32, 1.15, 0.16, MAT_DARK_ANODIZED);
  floorBulkhead.position.y = -1.64;
  floorBulkhead.name = 'Body_ChamberCavityFloor';
  barrelShellGroup.add(floorBulkhead);

  chamberGroup.add(barrelShellGroup);

  // 2. Top & Bottom Bolted DN ConFlat Rings (innerR = 1.15 real see-through bore!)
  const topChamberFlange = createConFlatFlange(2.18, 1.15, 0.28, 'ChamberTop', 16);
  topChamberFlange.position.y = 1.81; // spans +1.67..+1.95 => world top Y = 11.45
  chamberGroup.add(topChamberFlange);

  const botChamberFlange = createConFlatFlange(2.18, 1.15, 0.28, 'ChamberBot', 16);
  botChamberFlange.position.y = -1.81; // spans -1.95..-1.67 => world bottom Y = 7.55
  chamberGroup.add(botChamberFlange);

  // 3. Front Doorway Architrave Jambs / Lintel / Sill (Body_ChamberDoorFrame)
  const doorFrameGroup = new THREE.Group();
  doorFrameGroup.name = 'Body_ChamberDoorFrame';

  // Left (-X) & Right (+X) doorway architrave jambs (leaving x = -1.85..+1.85 seal step / -1.65..+1.65 clear bore)
  [-1.81, 1.81].forEach((jx, idx) => {
    const jamb = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 2.96, 0.06),
      MAT_316SS_POLISHED
    );
    jamb.position.set(jx, 0.0, -1.99);
    jamb.name = `Body_DoorJamb_0${idx + 1}`;
    doorFrameGroup.add(jamb);
  });

  // Top lintel (+1.48..+1.66) & Bottom sill (-1.66..-1.48)
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(3.94, 0.20, 0.06), MAT_316SS_POLISHED);
  lintel.position.set(0.0, 1.56, -1.99);
  lintel.name = 'Body_DoorLintel';
  doorFrameGroup.add(lintel);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(3.94, 0.20, 0.06), MAT_316SS_POLISHED);
  sill.position.set(0.0, -1.56, -1.99);
  sill.name = 'Body_DoorSill';
  doorFrameGroup.add(sill);

  // Machined Viton seal land trim border around x = -1.85..+1.85, y = -1.48..+1.48
  const frameSealFace = createRoundedRectORing(1.74, 1.50, 0.12, 0.022, MAT_316SS_BRUSHED);
  frameSealFace.position.set(0.0, 0.0, -2.015);
  frameSealFace.name = 'Body_DoorFrameSealLand';
  doorFrameGroup.add(frameSealFace);

  // 8 genuine M6 socket screws securing front architrave flange
  [
    [-1.84, 1.56],
    [0.0, 1.56],
    [1.84, 1.56],
    [-1.84, -1.56],
    [0.0, -1.56],
    [1.84, -1.56],
    [-1.84, 0.0],
    [1.84, 0.0],
  ].forEach(([fx, fy], idx) => {
    const fScrew = createHexSocketScrew(0.018, 0.05, `Fastener_HexM6_DoorFrame_0${idx + 1}`);
    fScrew.rotation.x = -Math.PI / 2;
    fScrew.position.set(fx, fy, -2.02);
    doorFrameGroup.add(fScrew);
  });

  chamberGroup.add(doorFrameGroup);

  // 4. 8 ConFlat (CF) Radial Ports Strictly Clear of Front Doorway (|ang| >= 1.10 rad)
  const portSpecs = [
    { ang: 1.18, y: 0.35, rOut: 0.62, rDist: 2.26, name: 'Body_ChamberPort_AuxR' },
    { ang: -1.18, y: 0.35, rOut: 0.56, rDist: 2.26, name: 'Body_ChamberPort_AuxL' },
    { ang: 1.65, y: 0.22, rOut: 0.68, rDist: 2.15, name: 'Body_ChamberPort_SE2' },
    { ang: -1.65, y: 0.32, rOut: 0.68, rDist: 2.15, name: 'Body_ChamberPort_EDS' },
    { ang: 2.18, y: 0.55, rOut: 0.52, rDist: 2.15, name: 'Body_ChamberPort_Optical' },
    { ang: -2.18, y: 0.20, rOut: 0.52, rDist: 2.15, name: 'Body_ChamberPort_Gauge' },
    { ang: 2.72, y: -0.45, rOut: 0.48, rDist: 2.15, name: 'Body_ChamberPort_Feedthrough' },
    { ang: -2.72, y: -0.45, rOut: 0.48, rDist: 2.15, name: 'Body_ChamberPort_Vent' },
  ];
  portSpecs.forEach((ps, idx) => {
    const portAssembly = new THREE.Group();
    portAssembly.name = ps.name;
    const px = Math.sin(ps.ang) * ps.rDist;
    const pz = -Math.cos(ps.ang) * ps.rDist;
    portAssembly.position.set(px, ps.y, pz);
    portAssembly.rotation.y = -ps.ang;

    const neckTube = new THREE.Mesh(
      new THREE.CylinderGeometry(ps.rOut * 0.72, ps.rOut * 0.72, 0.46, 22),
      MAT_316SS_BRUSHED
    );
    neckTube.rotation.x = Math.PI / 2;
    portAssembly.add(neckTube);

    const cfFlange = createConFlatFlange(ps.rOut, ps.rOut * 0.44, 0.16, `Port${idx}`, 8);
    cfFlange.rotation.x = -Math.PI / 2;
    cfFlange.position.z = -0.26;
    portAssembly.add(cfFlange);

    // Blanking cap plate on non-detector utility ports
    if (idx !== 2 && idx !== 3 && idx !== 5) {
      const capPlate = new THREE.Mesh(
        new THREE.CylinderGeometry(ps.rOut * 0.58, ps.rOut * 0.58, 0.06, 20),
        MAT_316SS_POLISHED
      );
      capPlate.rotation.x = Math.PI / 2;
      capPlate.position.z = -0.32;
      portAssembly.add(capPlate);
    }

    chamberGroup.add(portAssembly);
  });

  // Edwards / Pfeiffer PKR 361 Full-Range Pirani / Cold-Cathode Gauge on rear-left CF port
  const gaugeGroup = new THREE.Group();
  gaugeGroup.name = 'Body_GaugePiraniPenning';
  gaugeGroup.position.set(-2.25, 0.20, 0.95);
  gaugeGroup.rotation.y = Math.PI - 2.18;
  gaugeGroup.rotation.z = Math.PI / 2;

  const gaugeBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.88, 22),
    MAT_316SS_POLISHED
  );
  gaugeGroup.add(gaugeBarrel);

  const gaugeHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.30, 0.30, 0.36, 22),
    MAT_DARK_ANODIZED
  );
  gaugeHead.position.y = 0.52;
  gaugeGroup.add(gaugeHead);

  const gaugeRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.31, 0.31, 0.05, 22),
    MAT_BLUE_ANODIZED
  );
  gaugeRing.position.y = 0.36;
  gaugeGroup.add(gaugeRing);
  chamberGroup.add(gaugeGroup);

  // 5. Pivot_DoorChamber (Hinged on -X edge at (-1.92, 0.0, -2.02), swings +angle around +Y)
  const doorPivot = new THREE.Group();
  doorPivot.name = 'Pivot_DoorChamber';
  doorPivot.position.set(-1.92, 0.0, -2.02);

  // Extruded 316L stainless door slab (w = 3.84, h = 3.18, d = 0.34, x_local = 0..+3.84)
  // with REAL circular viewport hole absarc(1.92, 0.18, 0.62)
  const doorW = 3.84;
  const doorH = 3.18;
  const halfH = doorH * 0.5;
  const cornerC = 0.06;
  const doorShape = new THREE.Shape();
  doorShape.moveTo(cornerC, -halfH);
  doorShape.lineTo(doorW - cornerC, -halfH);
  doorShape.lineTo(doorW, -halfH + cornerC);
  doorShape.lineTo(doorW, halfH - cornerC);
  doorShape.lineTo(doorW - cornerC, halfH);
  doorShape.lineTo(cornerC, halfH);
  doorShape.lineTo(0, halfH - cornerC);
  doorShape.lineTo(0, -halfH + cornerC);
  doorShape.closePath();

  const viewportHole = new THREE.Path();
  viewportHole.absarc(1.92, 0.18, 0.62, 0, Math.PI * 2, true);
  doorShape.holes.push(viewportHole);

  const doorGeo = new THREE.ExtrudeGeometry(doorShape, {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
    curveSegments: 36,
  });
  const doorMesh = new THREE.Mesh(doorGeo, MAT_316SS_POLISHED);
  doorMesh.position.z = -0.34;
  doorMesh.name = 'Body_ChamberDoorSlab';
  doorPivot.add(doorMesh);

  // Heavy 316L Door Hinge Knuckles & Stainless Pins on -X Hinge Axis (x_local = 0)
  [-1.05, 1.05].forEach((hy, idx) => {
    const knuckle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.34, 18),
      MAT_316SS_BRUSHED
    );
    knuckle.position.set(0.0, hy, -0.17);
    knuckle.name = `Body_DoorHinge_0${idx + 1}`;
    doorPivot.add(knuckle);

    const hingePin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.42, 14),
      MAT_DARK_ANODIZED
    );
    hingePin.position.set(0.0, hy, -0.17);
    doorPivot.add(hingePin);
  });

  // DN100CF Viewport Flange Ring inside/over real circular bore (1.92, 0.18)
  const viewportFrame = createConFlatFlange(0.92, 0.62, 0.14, 'Viewport', 12);
  viewportFrame.rotation.x = -Math.PI / 2;
  viewportFrame.position.set(1.92, 0.18, -0.41);
  doorPivot.add(viewportFrame);

  // Leaded Borosilicate Chamber Glass Window (IOR = 1.52) inside circular bore
  const viewportGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.62, 0.10, 36),
    MAT_LEAD_GLASS
  );
  viewportGlass.rotation.x = Math.PI / 2;
  viewportGlass.position.set(1.92, 0.18, -0.28);
  viewportGlass.name = 'Glass_ViewportChamber';
  doorPivot.add(viewportGlass);

  // Internal Viton Fluoroelastomer O-Ring Seal around door inner perimeter
  const vitonORing = createRoundedRectORing(1.74, 1.44, 0.10, 0.038, MAT_VITON_SEAL);
  vitonORing.position.set(1.92, 0.0, 0.015);
  vitonORing.name = 'Body_DoorVitonORing';
  doorPivot.add(vitonORing);

  // Blue Anodized Vertical Door Handle Bar + Stainless Standoff Posts (x_local = 3.45)
  [-0.92, 0.92].forEach((py, idx) => {
    const standoff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.38, 16),
      MAT_316SS_POLISHED
    );
    standoff.rotation.x = Math.PI / 2;
    standoff.position.set(3.45, py, -0.53);
    standoff.name = `Body_DoorHandlePost_0${idx + 1}`;
    doorPivot.add(standoff);
  });

  const handleBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.10, 0.10, 2.28, 22),
    MAT_BLUE_ANODIZED
  );
  handleBar.position.set(3.45, 0.0, -0.72);
  handleBar.name = 'Body_DoorHandleBar';
  doorPivot.add(handleBar);

  // Red Safety Interlock Microswitch & Plunger on Latch Edge
  const doorMicroswitch = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.30, 0.16),
    MAT_HV_EPOXY_RED
  );
  doorMicroswitch.position.set(3.70, 1.32, -0.02);
  doorMicroswitch.name = 'Body_MicroswitchDoor';
  doorPivot.add(doorMicroswitch);

  const switchPlunger = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.14, 12),
    MAT_316SS_POLISHED
  );
  switchPlunger.rotation.x = Math.PI / 2;
  switchPlunger.position.set(3.70, 1.32, 0.09);
  doorPivot.add(switchPlunger);

  // Crisp Upright Caution Plaque on lower front face of Chamber Door
  const doorCaution = makePlaqueDecal(
    'UHV CHAMBER · X-RAY SHIELD',
    'VENT WITH DRY N2 BEFORE OPENING',
    2.45,
    0.42,
    '#0f172a',
    '#fef08a',
    '#f59e0b'
  );
  doorCaution.position.set(1.92, -1.08, -0.365);
  doorCaution.name = 'Body_DoorCautionPlaque';
  doorPivot.add(doorCaution);

  chamberGroup.add(doorPivot);

  // 6. All Internal Detectors, Mirror & PT100 Strictly Clear of Doorway (ZERO Protrusions!)
  // 6A. Body_DetectorSE2 on +X side wall/port (+2.05, +0.22, -0.15) pointing inward to (0, -0.45, 0)
  const se2Group = new THREE.Group();
  se2Group.name = 'Body_DetectorSE2';
  se2Group.position.set(2.05, 0.22, -0.15);
  {
    const dirSE2 = new THREE.Vector3(-2.05, -0.67, 0.15).normalize();
    const axisGrp = new THREE.Group();
    axisGrp.quaternion.setFromUnitVectors(new THREE.Vector3(-1, 0, 0), dirSE2);

    const pmtHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.40, 1.10, 24),
      MAT_316SS_BRUSHED
    );
    pmtHousing.rotation.z = Math.PI / 2;
    pmtHousing.position.x = 0.42;
    axisGrp.add(pmtHousing);

    const lightGuideTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.20, 0.92, 20),
      MAT_316SS_POLISHED
    );
    lightGuideTube.rotation.z = Math.PI / 2;
    lightGuideTube.position.x = -0.45;
    axisGrp.add(lightGuideTube);

    const faradayCage = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.24, 0.36, 16, 1, true),
      MAT_BRASS_GOLD
    );
    faradayCage.rotation.z = Math.PI / 2;
    faradayCage.position.x = -0.98;
    axisGrp.add(faradayCage);

    const scintillatorTip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.08, 20),
      makeMat(0x38bdf8, { r: 0.12, m: 0.2, e: 0x0ea5e9, ei: 0.85 })
    );
    scintillatorTip.rotation.z = Math.PI / 2;
    scintillatorTip.position.x = -0.92;
    axisGrp.add(scintillatorTip);

    se2Group.add(axisGrp);
  }
  chamberGroup.add(se2Group);

  // 6B. Body_DetectorEDS: Oxford Ultim Max 100 SDD on -X side port (-2.15, +0.32, +0.10), 35° takeoff toward (0, -0.45, 0)
  const edsGroup = new THREE.Group();
  edsGroup.name = 'Body_DetectorEDS';
  edsGroup.position.set(-2.15, 0.32, 0.10);
  {
    const dirEDS = new THREE.Vector3(2.15, -0.77, -0.10).normalize();
    const edsAxis = new THREE.Group();
    edsAxis.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dirEDS);

    const edsHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.50, 1.38, 26),
      MAT_BLUE_ANODIZED
    );
    edsHousing.rotation.z = Math.PI / 2;
    edsHousing.position.x = -0.68;
    edsAxis.add(edsHousing);

    // Peltier heatsink cooling fins
    for (let f = 0; f < 6; f++) {
      const fin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 0.04, 24),
        MAT_DARK_ANODIZED
      );
      fin.rotation.z = Math.PI / 2;
      fin.position.x = -0.35 - f * 0.16;
      edsAxis.add(fin);
    }

    // Tapered stainless collimator snout projecting safely inside chamber (r_inner < 1.50)
    const snout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.24, 1.15, 22),
      MAT_316SS_POLISHED
    );
    snout.rotation.z = -Math.PI / 2;
    snout.position.x = 0.55;
    edsAxis.add(snout);

    const sensorWindow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.04, 18),
      MAT_GOLD_MIRROR
    );
    sensorWindow.rotation.z = Math.PI / 2;
    sensorWindow.position.x = 1.14;
    edsAxis.add(sensorWindow);

    const edsLabel = makePlaqueDecal(
      'OXFORD ULTIM MAX 100',
      '100 mm² SDD EDS · PELTIER COOLED',
      0.96,
      0.30,
      '#0f172a',
      '#f8fafc',
      '#38bdf8'
    );
    edsLabel.position.set(-0.75, 0.0, -0.52);
    edsAxis.add(edsLabel);

    edsGroup.add(edsAxis);
  }
  chamberGroup.add(edsGroup);

  // 6C. Pivot_DetectorBSE: Retractable 4-quadrant gold diode ring + slotted actuator arm beneath polepiece
  const bseGroup = new THREE.Group();
  bseGroup.name = 'Pivot_DetectorBSE';
  bseGroup.position.set(0.55, 0.95, 0.0);

  const bseArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.88, 0.06, 0.24),
    MAT_316SS_POLISHED
  );
  bseArm.position.x = 0.28;
  bseGroup.add(bseArm);

  // Slotted actuator rail
  const bseSlotRail = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.12, 0.30),
    MAT_DARK_ANODIZED
  );
  bseSlotRail.position.set(0.68, 0.06, 0.0);
  bseGroup.add(bseSlotRail);

  // Drop lug connecting actuator arm cleanly to 4-quadrant diode ring
  const bseDropLug = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.14, 0.16),
    MAT_316SS_POLISHED
  );
  bseDropLug.position.set(-0.20, -0.05, 0.0);
  bseGroup.add(bseDropLug);

  // Hollow 4-quadrant annular diode ring centered on (0, 0.84, 0) chamber coordinates
  const bseShape = new THREE.Shape();
  bseShape.absarc(0, 0, 0.34, 0, Math.PI * 2, false);
  const bseHole = new THREE.Path();
  bseHole.absarc(0, 0, 0.10, 0, Math.PI * 2, true);
  bseShape.holes.push(bseHole);
  const bseDiodeRing = new THREE.Mesh(
    new THREE.ExtrudeGeometry(bseShape, { depth: 0.05, bevelEnabled: false, curveSegments: 28 }),
    MAT_BRASS_GOLD
  );
  bseDiodeRing.rotation.x = -Math.PI / 2;
  bseDiodeRing.position.set(-0.55, -0.13, 0.0);
  bseGroup.add(bseDiodeRing);

  // 4 active silicon photodiode quadrants on bottom face of BSE ring
  [
    [0.14, 0.14],
    [-0.14, 0.14],
    [-0.14, -0.14],
    [0.14, -0.14],
  ].forEach(([qx, qz]) => {
    const quadDie = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.015, 0.11),
      MAT_IC_EPOXY
    );
    quadDie.position.set(-0.55 + qx, -0.138, qz);
    bseGroup.add(quadDie);
  });
  chamberGroup.add(bseGroup);

  // 6D. Mirror_OpticalRelay: 45° gold mirror + 850 nm IR emitter LED on interior rear-right wall (+1.15, +0.72, +0.95)
  const mirrorGroup = new THREE.Group();
  mirrorGroup.name = 'Mirror_OpticalRelay';
  mirrorGroup.position.set(1.15, 0.72, 0.95);

  const mirrorBracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.34, 0.28),
    MAT_DARK_ANODIZED
  );
  mirrorGroup.add(mirrorBracket);

  const opticalMirrorPlane = new THREE.Mesh(
    new THREE.CylinderGeometry(0.20, 0.20, 0.035, 24),
    MAT_GOLD_MIRROR
  );
  opticalMirrorPlane.rotation.z = Math.PI / 4;
  opticalMirrorPlane.position.x = -0.16;
  mirrorGroup.add(opticalMirrorPlane);

  const irLed = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 14, 14),
    makeMat(0xef4444, { r: 0.2, m: 0.1, e: 0xdc2626, ei: 1.4 })
  );
  irLed.position.set(-0.18, -0.12, -0.08);
  mirrorGroup.add(irLed);
  chamberGroup.add(mirrorGroup);

  // 6E. Sensor_PT100: Class-A platinum RTD threaded into objective water jacket (+0.78, +1.55, +0.55)
  const pt100Group = new THREE.Group();
  pt100Group.name = 'Sensor_PT100';
  pt100Group.position.set(0.78, 1.55, 0.55);
  {
    const radialDir = new THREE.Vector3(0.78, 0, 0.55).normalize();
    const ptAxis = new THREE.Group();
    ptAxis.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), radialDir);

    const pt100Sheath = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.48, 16),
      MAT_316SS_POLISHED
    );
    pt100Sheath.rotation.z = Math.PI / 2;
    ptAxis.add(pt100Sheath);

    const pt100Nut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.14, 6),
      MAT_BRASS_GOLD
    );
    pt100Nut.rotation.z = Math.PI / 2;
    pt100Nut.position.x = 0.16;
    ptAxis.add(pt100Nut);

    const pt100Boot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.14, 14),
      MAT_WIRE_SENSOR_CYAN
    );
    pt100Boot.rotation.z = Math.PI / 2;
    pt100Boot.position.x = 0.28;
    ptAxis.add(pt100Boot);

    pt100Group.add(ptAxis);
  }
  chamberGroup.add(pt100Group);

  // 7. Pivot_Stage5Axis Mounted Inside Chamber Floor (0.0, -0.82, -0.05) local to chamberGroup
  const stageGroup = new THREE.Group();
  stageGroup.name = 'Pivot_Stage5Axis';
  stageGroup.position.set(0.0, -0.82, -0.05);

  // Machined stage base pedestal anchored solidly onto chamber floor bulkhead (y = -1.48 local to chamber)
  const stagePedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.88, 0.66, 28),
    MAT_DARK_ANODIZED
  );
  stagePedestal.position.y = -0.33;
  stagePedestal.name = 'Body_StagePedestalBase';
  stageGroup.add(stagePedestal);

  // Eucentric tilt cradle (-5° to +70°)
  const tiltCradle = new THREE.Mesh(
    new THREE.BoxGeometry(1.36, 0.22, 1.36),
    MAT_316SS_POLISHED
  );
  tiltCradle.name = 'Body_StageTiltCradle';
  stageGroup.add(tiltCradle);

  // Crossed-roller X/Y linear translation table (105 mm x 105 mm travel)
  const xyCarriage = new THREE.Mesh(
    new THREE.BoxGeometry(1.24, 0.18, 1.24),
    MAT_DARK_ANODIZED
  );
  xyCarriage.position.y = 0.20;
  xyCarriage.name = 'Body_StageXYCarriage';
  stageGroup.add(xyCarriage);

  // Motor_DriveStageXY (literal .name = 'Motor_DriveStageXY', strictly within r <= 1.42 u)
  const xyServoMotor = new THREE.Group();
  xyServoMotor.name = 'Motor_DriveStageXY';
  xyServoMotor.position.set(-0.88, 0.20, 0.26);

  const servoCan = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.56, 20),
    MAT_DARK_ANODIZED
  );
  servoCan.rotation.z = Math.PI / 2;
  xyServoMotor.add(servoCan);

  const servoBronzeRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.175, 0.175, 0.10, 20),
    MAT_BRASS_GOLD
  );
  servoBronzeRing.rotation.z = Math.PI / 2;
  servoBronzeRing.position.x = 0.22;
  xyServoMotor.add(servoBronzeRing);

  const ballScrew = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.42, 14),
    MAT_316SS_POLISHED
  );
  ballScrew.rotation.z = Math.PI / 2;
  ballScrew.position.x = 0.44;
  xyServoMotor.add(ballScrew);
  stageGroup.add(xyServoMotor);

  // Motor_LiftStageZ (literal .name = 'Motor_LiftStageZ')
  const zLiftMotor = new THREE.Group();
  zLiftMotor.name = 'Motor_LiftStageZ';
  zLiftMotor.position.set(0.0, 0.44, 0.0);

  const zCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.54, 0.62, 0.30, 26),
    MAT_316SS_BRUSHED
  );
  zLiftMotor.add(zCylinder);

  const zStepper = new THREE.Mesh(
    new THREE.BoxGeometry(0.30, 0.30, 0.34),
    MAT_DARK_ANODIZED
  );
  zStepper.position.set(0.66, -0.02, 0.0);
  zLiftMotor.add(zStepper);

  // 8. 9-Position 40°-Pitch Aluminum Specimen Carousel (Body_SpecimenCarousel)
  const carouselGroup = new THREE.Group();
  carouselGroup.name = 'Body_SpecimenCarousel';
  carouselGroup.position.y = 0.22;

  const carouselPlatter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.86, 0.82, 0.12, 36),
    MAT_316SS_POLISHED
  );
  carouselGroup.add(carouselPlatter);

  // Center calibration boss & reference Faraday aperture on carousel hub
  const centerHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.18, 0.14, 24),
    MAT_DARK_ANODIZED
  );
  centerHub.position.y = 0.04;
  carouselGroup.add(centerHub);

  // 9 equal 40° angular slots around radius 0.60 u (all strictly <= 0.78 u inside platter)
  const slotPitch = (Math.PI * 2) / 9;
  const stubRadius = 0.60;

  const uncoatedSpecs = [
    { color: 0x5c3418, r: 0.62, m: 0.08 }, // 0: ommatidia (natural dark chitin)
    { color: 0xca8a04, r: 0.68, m: 0.06 }, // 1: pollen (sporopollenin ochre)
    { color: 0x1d4ed8, r: 0.48, m: 0.25 }, // 2: morpho (iridescent structural blue)
    { color: 0x334155, r: 0.22, m: 0.65 }, // 3: finfet (Si wafer die)
    { color: 0xe2e8f0, r: 0.36, m: 0.20 }, // 4: zno_tetrapods (white ZnO nanorod)
    { color: 0x94a3b8, r: 0.18, m: 0.88 }, // 5: al_cu_alloy (polished Al-Cu puck)
  ];
  const coatedMatProps = { color: 0xd9b84a, r: 0.24, m: 0.86 };

  const stubSampleMeshes = [];

  for (let idx = 0; idx < 9; idx++) {
    const ang = idx * slotPitch;
    const stubGrp = new THREE.Group();
    stubGrp.name = `Body_SpecimenStub_0${idx + 1}`;
    stubGrp.position.set(Math.cos(ang) * stubRadius, 0.08, Math.sin(ang) * stubRadius);

    // 12.7 mm Aluminum Pin Stub base
    const pinStub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.125, 0.125, 0.08, 20),
      MAT_316SS_POLISHED
    );
    stubGrp.add(pinStub);

    // Conductive carbon adhesive disk
    const carbonPad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.015, 20),
      MAT_RUBBER_EPDM
    );
    carbonPad.position.y = 0.045;
    stubGrp.add(carbonPad);

    if (idx < 6) {
      const spMat = makeMat(
        idx < 3 ? coatedMatProps.color : uncoatedSpecs[idx].color,
        {
          r: idx < 3 ? coatedMatProps.r : uncoatedSpecs[idx].r,
          m: idx < 3 ? coatedMatProps.m : uncoatedSpecs[idx].m,
        }
      );

      let sampleGroup = new THREE.Group();
      if (idx === 0) {
        // Slot 1: Drosophila compound eye dome
        const dome = new THREE.Mesh(
          new THREE.SphereGeometry(0.075, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
          spMat
        );
        dome.position.y = 0.048;
        sampleGroup.add(dome);
      } else if (idx === 1) {
        // Slot 2: Hibiscus echinate pollen sphere + micro spines
        const grain = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 14), spMat);
        grain.position.y = 0.095;
        sampleGroup.add(grain);
        for (let s = 0; s < 6; s++) {
          const sa = (s / 6) * Math.PI * 2;
          const spine = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.036, 8), spMat);
          spine.position.set(Math.cos(sa) * 0.064, 0.095, Math.sin(sa) * 0.064);
          spine.rotation.z = -Math.PI / 2;
          spine.rotation.y = -sa;
          sampleGroup.add(spine);
        }
      } else if (idx === 2) {
        // Slot 3: Morpho photonic wing scale plate
        const wingPlate = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.018, 0.10), spMat);
        wingPlate.position.y = 0.062;
        sampleGroup.add(wingPlate);
      } else if (idx === 3) {
        // Slot 4: 5 nm FinFET cleaved silicon wafer die
        const waferDie = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.025, 0.13), spMat);
        waferDie.position.y = 0.065;
        sampleGroup.add(waferDie);
      } else if (idx === 4) {
        // Slot 5: ZnO tetrapod nanorod cluster
        for (let a = 0; a < 4; a++) {
          const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.10, 8), spMat);
          rod.position.y = 0.085;
          rod.rotation.z = 0.75;
          rod.rotation.y = (a / 4) * Math.PI * 2;
          sampleGroup.add(rod);
        }
      } else {
        // Slot 6: Al-Cu-Mg-Si polished metallographic puck
        const alloyPuck = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.04, 24), spMat);
        alloyPuck.position.y = 0.072;
        sampleGroup.add(alloyPuck);
      }
      stubGrp.add(sampleGroup);
      stubSampleMeshes.push({ idx, mat: spMat, uncoated: uncoatedSpecs[idx] });
    } else if (idx === 6) {
      // Slot 7: Cu/Au Calibration Grid
      const gridFrame = new THREE.Mesh(
        new THREE.CylinderGeometry(0.095, 0.095, 0.02, 24),
        MAT_COPPER_OFHC
      );
      gridFrame.position.y = 0.058;
      gridFrame.name = 'Body_CalibrationGridCuAu';
      stubGrp.add(gridFrame);

      const gridCrossA = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.024, 0.016), MAT_BRASS_GOLD);
      gridCrossA.position.y = 0.062;
      stubGrp.add(gridCrossA);
      const gridCrossB = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.024, 0.16), MAT_BRASS_GOLD);
      gridCrossB.position.y = 0.062;
      stubGrp.add(gridCrossB);
    } else if (idx === 7) {
      // Slot 8: Si Resolution Standard
      const siStd = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.026, 0.13),
        MAT_DARK_ANODIZED
      );
      siStd.position.y = 0.064;
      siStd.name = 'Body_SiResolutionStandard';
      stubGrp.add(siStd);

      const goldChecker = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.008, 0.08),
        MAT_GOLD_MIRROR
      );
      goldChecker.position.y = 0.080;
      stubGrp.add(goldChecker);
    } else {
      // Slot 9: Gold Faraday Cup Aperture (Body_FaradayCup)
      const faradayCup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.095, 0.095, 0.11, 22),
        MAT_BRASS_GOLD
      );
      faradayCup.position.y = 0.085;
      faradayCup.name = 'Body_FaradayCup';
      stubGrp.add(faradayCup);

      const faradayBore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.036, 0.036, 0.03, 16),
        MAT_RUBBER_EPDM
      );
      faradayBore.position.y = 0.132;
      stubGrp.add(faradayBore);
    }

    carouselGroup.add(stubGrp);
  }

  function updateStubCoating(coatedArray = [true, true, true, true, true, true]) {
    stubSampleMeshes.forEach(({ idx, mat, uncoated }) => {
      const coated = coatedArray[idx] !== false;
      if (coated) {
        if (idx < 3) {
          mat.color.setHex(coatedMatProps.color);
          mat.roughness = coatedMatProps.r;
          mat.metalness = coatedMatProps.m;
        } else {
          // Subtle warm Au/Pd conductive flash on semiconductor / oxide / metal
          mat.color.setHex(uncoated.color).lerp(new THREE.Color(0xd9b84a), 0.28);
          mat.roughness = Math.min(uncoated.r, 0.28);
          mat.metalness = Math.max(uncoated.m, 0.72);
        }
      } else {
        mat.color.setHex(uncoated.color);
        mat.roughness = uncoated.r;
        mat.metalness = uncoated.m;
      }
      mat.needsUpdate = true;
    });
  }

  zLiftMotor.add(carouselGroup);
  stageGroup.add(zLiftMotor);

  // Flexible Kapton Ribbon Cable connecting 5-axis stage motors/encoders to chamber rear wall
  stageGroup.add(
    makeWiringHarness(
      [
        [-0.78, 0.14, 0.35],
        [-1.08, -0.18, 0.78],
        [-1.12, -0.38, 1.28],
      ],
      0.026,
      MAT_TOROID_COIL,
      'Body_Wire_StageRibbon'
    )
  );

  chamberGroup.add(stageGroup);

  return {
    chamberGroup,
    doorPivot,
    stageGroup,
    carouselGroup,
    se2Group,
    bseGroup,
    edsGroup,
    mirrorGroup,
    pt100Group,
    gaugeGroup,
    updateStubCoating,
  };
}

// ----------------------------------------------------------------------------
// ZEISS Gemini II Electron Optical Column, FEG Gun, Ion Pump & Beam Optics
// ----------------------------------------------------------------------------
export function buildGeminiColumnAndDetectors() {
  const columnGroup = new THREE.Group();
  columnGroup.name = 'Body_ColumnGemini';
  // Bottom of lowerColumnBarrel at Y_local = -3.10 => Y_world = 14.55 - 3.10 = 11.45 (flush on chamber top flange)
  columnGroup.position.set(-3.80, 14.55, -0.20);

  // Outer Mu-Metal Magnetic Shielding Barrel: Lower (Y_local = -3.10..0.0) & Upper (Y_local = 0.0..+2.85)
  const lowerColumnBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.32, 1.38, 3.10, 32),
    MAT_ZEISS_WHITE
  );
  lowerColumnBarrel.position.y = -1.55;
  lowerColumnBarrel.name = 'Body_ColumnLowerBarrel';
  columnGroup.add(lowerColumnBarrel);

  const upperColumnBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.24, 1.32, 2.85, 32),
    MAT_ZEISS_WHITE
  );
  upperColumnBarrel.position.y = 1.425;
  upperColumnBarrel.name = 'Body_ColumnUpperBarrel';
  columnGroup.add(upperColumnBarrel);

  // Blue Anodized ZEISS Gemini II Column Accent Collar Ring at Y_local = 0.0
  const columnRing = new THREE.Mesh(
    new THREE.CylinderGeometry(1.36, 1.36, 0.24, 32),
    MAT_BLUE_ANODIZED
  );
  columnRing.position.y = 0.0;
  columnRing.name = 'Body_ColumnBlueCollar';
  columnGroup.add(columnRing);

  // Crisp Upright Front Column Plaque
  const columnBadge = makePlaqueDecal(
    'ZEISS GEMINI II OPTICS',
    'BEAM BOOSTER +8 kV · MAGNETIC-ELECTROSTATIC OBJECTIVE',
    1.80,
    0.40,
    '#0f172a',
    '#f8fafc',
    '#38bdf8'
  );
  columnBadge.position.set(0.0, 0.72, -1.33);
  columnBadge.name = 'Body_ColumnNameplate';
  columnGroup.add(columnBadge);

  // Top Schottky Field Emission Gun (FEG) Head & Flanged Alumina -30 kV HV Boot (top Y_local = +4.25 => Y_world = 18.80)
  const fegGroup = new THREE.Group();
  fegGroup.name = 'Body_GunHeadFEG';
  fegGroup.position.y = 2.85;

  const fegFlange = createConFlatFlange(1.28, 0.72, 0.22, 'FEGHead', 12);
  fegFlange.position.y = 0.11;
  fegGroup.add(fegFlange);

  const fegCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.92, 1.18, 0.70, 28),
    MAT_316SS_POLISHED
  );
  fegCap.position.y = 0.57;
  fegGroup.add(fegCap);

  // Flanged ribbed alumina -30 kV HV boot reaching Y_local = +1.40 inside fegGroup (+4.25 column = 18.80 world)
  const hvCeramicCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.30, 0.54, 0.44, 24),
    MAT_ALUMINA_CERAMIC
  );
  hvCeramicCore.position.y = 1.14;
  fegGroup.add(hvCeramicCore);

  [0.98, 1.14, 1.28].forEach((ry, idx) => {
    const shed = new THREE.Mesh(
      new THREE.CylinderGeometry(0.56 - idx * 0.08, 0.60 - idx * 0.08, 0.055, 24),
      MAT_ALUMINA_CERAMIC
    );
    shed.position.y = ry;
    fegGroup.add(shed);
  });

  const hvTopBootCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.34, 0.08, 20),
    MAT_BRASS_GOLD
  );
  hvTopBootCap.position.y = 1.36; // top = 2.85 + 1.40 = 4.25 => Y_world = 18.80
  fegGroup.add(hvTopBootCap);

  // Rear +Z 30 kV HV cable receptacle matching Body_Wire_HV30kV_Umbilical termination (-3.80, 18.15, +0.35)
  const hvReceptacle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.22, 0.35, 18),
    MAT_ALUMINA_CERAMIC
  );
  hvReceptacle.rotation.x = Math.PI / 2;
  hvReceptacle.position.set(0.0, 0.75, 0.55); // world (-3.80, 18.15, +0.35)
  hvReceptacle.name = 'Body_FEGHVReceptacle';
  fegGroup.add(hvReceptacle);

  columnGroup.add(fegGroup);

  // 25 L/s Sputter Ion Getter Pump (IGP) maintaining 2.0e-10 mbar in FEG Gun
  const igpGroup = new THREE.Group();
  igpGroup.name = 'Body_IonGetterPump';
  igpGroup.position.set(1.65, 2.35, 0.0);

  const igpNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.30, 0.30, 0.85, 20),
    MAT_316SS_BRUSHED
  );
  igpNeck.rotation.z = Math.PI / 2;
  igpNeck.position.x = -0.35;
  igpGroup.add(igpNeck);

  const igpYoke = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 1.22, 0.92),
    MAT_DARK_ANODIZED
  );
  igpGroup.add(igpYoke);

  const igpLabel = makePlaqueDecal(
    'ION GETTER PUMP',
    '25 L/s · 2.0e-10 mbar UHV',
    0.84,
    0.32,
    '#0f172a',
    '#22c55e',
    '#16a34a'
  );
  igpLabel.position.set(0.0, 0.10, -0.47);
  igpGroup.add(igpLabel);
  columnGroup.add(igpGroup);

  // Pneumatic Column Isolation Gate Valve between FEG Gun and Chamber
  const gateValve = new THREE.Group();
  gateValve.name = 'Body_ValveColumnGate';
  gateValve.position.set(-1.45, 0.45, 0.0);

  const valveBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.40, 0.82),
    MAT_316SS_POLISHED
  );
  gateValve.add(valveBody);

  const actuatorCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.62, 20),
    MAT_BLUE_ANODIZED
  );
  actuatorCyl.rotation.z = Math.PI / 2;
  actuatorCyl.position.x = -0.56;
  gateValve.add(actuatorCyl);
  columnGroup.add(gateValve);

  // Internal Cutaway Electron Optics Assembly (Exposed when Cutaway / Explode active)
  const opticsInternal = new THREE.Group();
  opticsInternal.name = 'Body_InternalColumnOptics';

  // +8 kV Electrostatic Beam Booster Liner Tube
  const boosterTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 6.20, 24),
    MAT_BRASS_GOLD
  );
  boosterTube.position.y = -0.15;
  boosterTube.name = 'Body_BeamBoosterTube';
  opticsInternal.add(boosterTube);

  // Upper & Lower Toroidal Copper Condenser Lens Coils
  const upperCondenser = new THREE.Mesh(
    new THREE.CylinderGeometry(0.88, 0.88, 0.95, 28),
    MAT_COPPER_WINDING
  );
  upperCondenser.position.y = 1.55;
  upperCondenser.name = 'Body_CoilCondenserUpper';
  opticsInternal.add(upperCondenser);

  const lowerCondenser = new THREE.Mesh(
    new THREE.CylinderGeometry(0.88, 0.88, 0.95, 28),
    MAT_COPPER_WINDING
  );
  lowerCondenser.position.y = -0.45;
  lowerCondenser.name = 'Body_CoilCondenserLower';
  opticsInternal.add(lowerCondenser);

  // 8-Pole Stigmator & Double-Deflection Scan Coils
  const scanCoils = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.62, 0.85, 24),
    MAT_TOROID_COIL
  );
  scanCoils.position.y = -1.75;
  scanCoils.name = 'Body_ScanDeflectionCoils';
  opticsInternal.add(scanCoils);

  // Annular In-Lens Secondary Electron Detector Scintillator Ring
  const inLensRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.09, 16, 28),
    makeMat(0x38bdf8, { r: 0.20, m: 0.30, e: 0x0284c7, ei: 0.85 })
  );
  inLensRing.rotation.x = Math.PI / 2;
  inLensRing.position.y = -2.35;
  inLensRing.name = 'Body_DetectorInLens';
  opticsInternal.add(inLensRing);

  // Upper Objective Jacket Neck passing cleanly through top chamber ConFlat bore (Y_local = -3.10..-3.55)
  const objectiveNeckJacket = new THREE.Mesh(
    new THREE.CylinderGeometry(1.06, 0.96, 0.45, 28),
    MAT_316SS_BRUSHED
  );
  objectiveNeckJacket.position.y = -3.325;
  objectiveNeckJacket.name = 'Body_ObjectiveWaterJacket';
  opticsInternal.add(objectiveNeckJacket);

  // Conical Gemini Magnetic-Electrostatic Objective Polepiece projecting into upper chamber (Y_local = -3.55..-4.15)
  const objectiveCone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.96, 0.32, 0.60, 28),
    MAT_316SS_POLISHED
  );
  objectiveCone.position.y = -3.85;
  objectiveCone.name = 'Body_ObjectivePolepiece';
  opticsInternal.add(objectiveCone);

  // Dynamic Translucent Cyan Electron Beam & Raster Scan Cone (Y_local = -4.15..-5.55)
  const beamCone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.20, 1.40, 24, 1, true),
    MAT_ELECTRON_BEAM
  );
  beamCone.position.y = -4.85;
  beamCone.name = 'Body_ElectronBeamCone';
  opticsInternal.add(beamCone);

  columnGroup.add(opticsInternal);

  return {
    columnGroup,
    lowerColumnBarrel,
    upperColumnBarrel,
    opticsInternal,
    beamCone,
    fegGroup,
    igpGroup,
    gateValve,
    objectiveCone,
  };
}
