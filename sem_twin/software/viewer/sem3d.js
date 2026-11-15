/**
 * sem3d.js — ZEISS GeminiSEM 500 Field Emission Scanning Electron Microscope (FE-SEM)
 * Centrifuge Gold Standard Procedural 3D CAD, Industrial PBR Materials,
 * Dedicated VC-E Electron Microscopy Suite, Point-to-Point Harnesses & Genuine 3D Fasteners.
 *
 * Scale: 1 scene unit = 100 mm (0.1 m = 1 dm). Floor datum Y = 0.0. Front = -Z.
 * OEM References:
 * - ZEISS GeminiSEM Series Instruction Manual (Doc. 349500-8038-000)
 * - ZEISS 105-mm 5-Axis DC Motorized Stage Manual (Doc. 349347-9013-000)
 * - Pfeiffer Vacuum HiPace 300 Turbomolecular Pump & HiScroll 6 Dry Scroll Pump
 * - Oxford Instruments Ultim Max 100 Silicon Drift EDS Detector
 */

import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Industrial PBR Material Library (1 unit = 100 mm = 1 dm)
// ----------------------------------------------------------------------------
function makeMat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.r ?? 0.35,
    metalness: opts.m ?? 0.15,
    transparent: opts.o != null && opts.o < 1.0,
    opacity: opts.o ?? 1.0,
    emissive: new THREE.Color(opts.e ?? 0x000000),
    emissiveIntensity: opts.ei ?? 0,
    side: opts.side ?? THREE.FrontSide,
    depthWrite: opts.dw ?? true,
  });
}

function createCanvas(w = 512, h = 512) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function makeBrushedMetalTexture(baseHex = '#dde4ec', streakHex = '#94a3b8') {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = streakHex;
  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 650; i++) {
    const y = Math.random() * 512;
    ctx.lineWidth = 0.6 + Math.random() * 1.4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + (Math.random() - 0.5) * 3);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeToroidCopperTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#9a4612';
  ctx.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 3) {
    ctx.fillStyle = x % 6 === 0 ? '#d97706' : '#7c2d12';
    ctx.fillRect(x, 0, 2, 512);
  }
  ctx.fillStyle = 'rgba(234, 179, 8, 0.82)';
  ctx.fillRect(0, 180, 512, 150);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('300VA LOW-STRAY TOROID XFMR · 230V -> 24VAC', 256, 260);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeMotherboardPCBTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 0, 1024, 1024);

  // Etched copper ground planes & bus traces
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  for (let i = 0; i < 90; i++) {
    const x0 = 40 + (i * 11) % 940;
    const y0 = 40 + ((i * 37) % 940);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + 80, y0);
    ctx.lineTo(x0 + 110, y0 + 30);
    ctx.stroke();
  }
  // Gold ENIG pads & silkscreen
  ctx.fillStyle = '#fbbf24';
  for (let r = 0; r < 18; r++) {
    for (let col = 0; col < 18; col++) {
      ctx.fillRect(60 + col * 52, 60 + r * 52, 6, 6);
    }
  }
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 28px monospace';
  ctx.fillText('ZEISS SMARTSEM SCAN GENERATOR REV 4.2 · 16-BIT DUAL ADC', 60, 980);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const TEX_BRUSHED_SS = makeBrushedMetalTexture('#e2e8f0', '#94a3b8');
const TEX_BRUSHED_DARK = makeBrushedMetalTexture('#1e293b', '#0f172a');
const TEX_TOROID_COPPER = makeToroidCopperTexture();
const TEX_PCB_FR4 = makeMotherboardPCBTexture();

const MAT_ZEISS_WHITE = makeMat(0xf1f5f9, { r: 0.26, m: 0.10 });
const MAT_ZEISS_ANTHRACITE = makeMat(0x18202c, { r: 0.42, m: 0.28 });
const MAT_ZEISS_BLUE = makeMat(0x1d4ed8, { r: 0.28, m: 0.55 });
const MAT_FRAME_STEEL = makeMat(0x273244, { r: 0.48, m: 0.65 });
const MAT_GRANITE_SLAB = makeMat(0x1f242d, { r: 0.32, m: 0.18 });
const MAT_316SS_POLISHED = makeMat(0xf8fafc, { r: 0.14, m: 0.92 });
const MAT_316SS_BRUSHED = new THREE.MeshStandardMaterial({
  color: 0xdbe3ec,
  map: TEX_BRUSHED_SS,
  roughness: 0.24,
  metalness: 0.85,
});
const MAT_DARK_ANODIZED = new THREE.MeshStandardMaterial({
  color: 0x1e293b,
  map: TEX_BRUSHED_DARK,
  roughness: 0.30,
  metalness: 0.78,
});
const MAT_BLUE_ANODIZED = makeMat(0x0284c7, { r: 0.25, m: 0.82 });
const MAT_RED_ANODIZED = makeMat(0xdc2626, { r: 0.28, m: 0.72 });
const MAT_COPPER_OFHC = makeMat(0xc2410c, { r: 0.18, m: 0.90 });
const MAT_BRASS_GOLD = makeMat(0xd97706, { r: 0.20, m: 0.88 });
const MAT_GOLD_MIRROR = makeMat(0xfacc15, { r: 0.04, m: 0.98 });
const MAT_RUBBER_EPDM = makeMat(0x12151a, { r: 0.88, m: 0.04 });
const MAT_VITON_SEAL = makeMat(0x090b0e, { r: 0.75, m: 0.06 });
const MAT_ALUMINA_CERAMIC = makeMat(0xf8fafc, { r: 0.22, m: 0.04 });
const MAT_PCB_FR4 = new THREE.MeshStandardMaterial({
  map: TEX_PCB_FR4,
  roughness: 0.32,
  metalness: 0.18,
});
const MAT_IC_EPOXY = makeMat(0x14171f, { r: 0.40, m: 0.08 });
const MAT_TOROID_COIL = new THREE.MeshStandardMaterial({
  map: TEX_TOROID_COPPER,
  roughness: 0.25,
  metalness: 0.80,
});
const MAT_HV_EPOXY_RED = makeMat(0x991b1b, { r: 0.32, m: 0.15 });
const MAT_WIRE_HV_RED = makeMat(0xdc2626, { r: 0.35, m: 0.06 });
const MAT_WIRE_AC_BROWN = makeMat(0x78350f, { r: 0.38, m: 0.08 });
const MAT_WIRE_AC_BLUE = makeMat(0x1d4ed8, { r: 0.38, m: 0.08 });
const MAT_WIRE_PE_GRNYLW = makeMat(0x65a30d, { r: 0.38, m: 0.08 });
const MAT_WIRE_DC_RED = makeMat(0xef4444, { r: 0.36, m: 0.08 });
const MAT_WIRE_DC_BLACK = makeMat(0x18181b, { r: 0.40, m: 0.08 });
const MAT_WIRE_SENSOR_CYAN = makeMat(0x06b6d4, { r: 0.34, m: 0.12 });
const MAT_WIRE_DATA_GREY = makeMat(0x475569, { r: 0.44, m: 0.12 });
const MAT_COOLANT_BLUE = makeMat(0x0284c7, { r: 0.24, m: 0.08 });
const MAT_COOLANT_RED = makeMat(0xe11d48, { r: 0.24, m: 0.08 });
const MAT_PHOENIX_GREEN = makeMat(0x15803d, { r: 0.35, m: 0.08 });

const MAT_BOROSILICATE_GLASS = new THREE.MeshPhysicalMaterial({
  color: 0xe0f2fe,
  roughness: 0.04,
  metalness: 0.05,
  ior: 1.52,
  reflectivity: 0.92,
  clearcoat: 1.0,
  clearcoatRoughness: 0.03,
  transparent: true,
  opacity: 0.26,
  depthWrite: false,
  side: THREE.FrontSide,
});

const MAT_DISPLAY_COVER_GLASS = new THREE.MeshPhysicalMaterial({
  color: 0xf0f9ff,
  roughness: 0.05,
  metalness: 0.04,
  ior: 1.52,
  reflectivity: 0.85,
  clearcoat: 1.0,
  transparent: true,
  opacity: 0.12,
  depthWrite: false,
  side: THREE.FrontSide,
});

const MAT_ELECTRON_BEAM = makeMat(0x00f3ff, {
  r: 0.15,
  m: 0.0,
  o: 0.72,
  e: 0x00f3ff,
  ei: 2.2,
  dw: false,
  side: THREE.DoubleSide,
});

const MAT_CAST_IRON = makeMat(0x1b2028, { r: 0.62, m: 0.55 });
const MAT_COPPER_WINDING = MAT_TOROID_COIL;
const MAT_CONSOLE_DESK = makeMat(0x161c26, { r: 0.36, m: 0.14 });
const MAT_LEAD_GLASS = MAT_BOROSILICATE_GLASS;
const MAT_DISPLAY_GLASS = MAT_DISPLAY_COVER_GLASS;


// ----------------------------------------------------------------------------
// Operator-Facing Quad Geometry (Upright & Unmirrored UV Guarantee, DIAG-005)
// ----------------------------------------------------------------------------
export function makeOperatorFacingQuadGeo(w, h) {
  const geo = new THREE.BufferGeometry();
  const halfW = w / 2;
  const halfH = h / 2;

  const positions = new Float32Array([
    halfW, halfH, 0,
    -halfW, halfH, 0,
    halfW, -halfH, 0,
    -halfW, -halfH, 0,
  ]);
  const normals = new Float32Array([
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
  ]);
  const uvs = new Float32Array([
    0, 1,
    1, 1,
    0, 0,
    1, 0,
  ]);
  const indices = [0, 2, 1, 2, 3, 1];

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);

  const uvAttr = geo.getAttribute('uv');
  for (let i = 0; i < uvAttr.count; i++) {
    uvAttr.setY(i, 1.0 - uvAttr.getY(i));
  }
  uvAttr.needsUpdate = true;
  return geo;
}

export function createDecalQuad(w, h, material) {
  return new THREE.Mesh(makeOperatorFacingQuadGeo(w, h), material);
}

function makeSilkscreenLabelMesh(line1, line2, w, h, bgHex = '#0f172a', fgHex = '#f8fafc', accentHex = '#38bdf8') {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 192;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 512, 192);
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, 502, 182);

  ctx.fillStyle = fgHex;
  ctx.font = 'bold 38px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(line1, 256, line2 ? 72 : 96);

  if (line2) {
    ctx.fillStyle = accentHex;
    ctx.font = '600 26px "Inter", sans-serif';
    ctx.fillText(line2, 256, 134);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.35,
    metalness: 0.15,
  });
  return createDecalQuad(w, h, mat);
}

// ----------------------------------------------------------------------------
// Genuine 3D Fasteners (DIN 912 Socket Head Cap Screws + DIN 125 Washers)
// ----------------------------------------------------------------------------
export function createHexSocketScrew(r = 0.025, length = 0.08, fastenerName = 'Fastener_HexM6_01') {
  const group = new THREE.Group();
  group.name = fastenerName;

  const headR = r * 1.55;
  const headH = r * 1.9;
  const washerR = r * 2.15;
  const washerH = r * 0.32;

  // Beveled DIN 125 flat washer
  const washer = new THREE.Mesh(
    new THREE.CylinderGeometry(washerR * 0.95, washerR, washerH, 18),
    MAT_316SS_POLISHED
  );
  washer.position.y = washerH * 0.5;
  group.add(washer);

  // Cylindrical DIN 912 cap head with top chamfer
  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(headR * 0.94, headR, headH, 18),
    MAT_316SS_POLISHED
  );
  head.position.y = washerH + headH * 0.5;
  group.add(head);

  // Genuine recessed hexagonal socket pocket
  const hexRecess = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 0.85, r * 0.85, headH * 0.62, 6),
    MAT_RUBBER_EPDM
  );
  hexRecess.position.y = washerH + headH * 0.72;
  group.add(hexRecess);

  // Threaded shank
  const shank = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r * 0.92, length, 14),
    MAT_316SS_BRUSHED
  );
  shank.position.y = -length * 0.5;
  group.add(shank);

  return group;
}

// ----------------------------------------------------------------------------
// Official SREdesigns Lower-Frame Certification Badge
// ----------------------------------------------------------------------------
export function makeSREdesignsBadge() {
  const badgeGroup = new THREE.Group();
  badgeGroup.name = 'Badge_SREdesigns';

  // Carved recessed bezel pocket housing
  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(1.16, 0.36, 0.035),
    MAT_DARK_ANODIZED
  );
  badgeGroup.add(bezel);

  // Brushed aluminum backing plate
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(1.08, 0.30, 0.022),
    MAT_316SS_BRUSHED
  );
  plate.position.z = -0.01;
  badgeGroup.add(plate);

  // High-DPI laser-etched vector typography
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 160;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 160);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 144);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 46px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S R E  designs', 256, 62);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 22px "Inter", sans-serif';
  ctx.fillText('CERTIFIED DIGITAL TWIN · GEMINI-500', 256, 118);

  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  const quad = createDecalQuad(
    1.04,
    0.27,
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.25, metalness: 0.45 })
  );
  quad.position.z = -0.023;
  badgeGroup.add(quad);

  // 4 corner M3 hex socket screws holding the nameplate
  const cornerOffsets = [
    [-0.47, 0.10],
    [0.47, 0.10],
    [-0.47, -0.10],
    [0.47, -0.10],
  ];
  cornerOffsets.forEach(([cx, cy], idx) => {
    const scr = createHexSocketScrew(0.014, 0.03, `Fastener_HexM3_Badge_0${idx + 1}`);
    scr.rotation.x = -Math.PI / 2;
    scr.position.set(cx, cy, -0.022);
    badgeGroup.add(scr);
  });

  return badgeGroup;
}

// ----------------------------------------------------------------------------
// ConFlat (CF) Vacuum Flange + Copper Gasket + 12-Bolt Circle Builder
// ----------------------------------------------------------------------------
function createConFlatFlange(outerR, innerR, thickness, idPrefix, boltCount = 12) {
  const group = new THREE.Group();
  group.name = `Body_CFFlange_${idPrefix}`;

  // 316L stainless flange ring
  const ring = new THREE.Mesh(
    new THREE.CylinderGeometry(outerR, outerR, thickness, 32),
    MAT_316SS_POLISHED
  );
  group.add(ring);

  // OFHC copper knife-edge gasket seam ring visible between mating flanges
  const gasket = new THREE.Mesh(
    new THREE.CylinderGeometry(outerR * 0.985, outerR * 0.985, thickness * 0.16, 32),
    MAT_COPPER_OFHC
  );
  group.add(gasket);

  // Radial circle of genuine 3D DIN 912 hex socket bolts
  const boltCircleR = innerR + (outerR - innerR) * 0.58;
  for (let i = 0; i < boltCount; i++) {
    const ang = (i / boltCount) * Math.PI * 2;
    const screw = createHexSocketScrew(
      0.022,
      thickness * 0.85,
      `Fastener_HexM6_${idPrefix}_${String(i + 1).padStart(2, '0')}`
    );
    screw.position.set(
      Math.cos(ang) * boltCircleR,
      thickness * 0.5,
      Math.sin(ang) * boltCircleR
    );
    group.add(screw);
  }
  return group;
}

// ----------------------------------------------------------------------------
// Point-to-Point Routed Harness + Rubber Bulkhead Grommet Builder
// ----------------------------------------------------------------------------
function makeWiringHarness(points, radius, material, harnessName, withGrommets = true) {
  const group = new THREE.Group();
  group.name = harnessName;

  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const tubeGeo = new THREE.TubeGeometry(curve, 36, radius, 12, false);
  const tube = new THREE.Mesh(tubeGeo, material);
  tube.castShadow = true;
  group.add(tube);

  // Molded EPDM strain-relief boots / grommets at both endpoints + nylon P-clips along run
  if (withGrommets && points.length >= 2) {
    [points[0], points[points.length - 1]].forEach((pt, idx) => {
      const boot = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 1.65, radius * 1.95, radius * 3.2, 16),
        MAT_RUBBER_EPDM
      );
      boot.position.set(pt[0], pt[1], pt[2]);
      boot.name = `Body_StrainBoot_${harnessName}_${idx}`;
      group.add(boot);
    });
  }
  return group;
}

// ----------------------------------------------------------------------------
// Standalone Dedicated VC-E Electron Microscopy Suite (includeLab !== false)
// ----------------------------------------------------------------------------
function buildVCELabRoom() {
  const room = new THREE.Group();
  room.name = 'Body_LaboratoryRoom';

  // 1. Subfloor terrazzo & perimeter
  const mainFloor = new THREE.Mesh(
    new THREE.BoxGeometry(58.0, 0.20, 46.0),
    makeMat(0x0f141d, { r: 0.55, m: 0.12 })
  );
  mainFloor.position.set(0, -0.11, 0);
  mainFloor.receiveShadow = true;
  mainFloor.name = 'Body_RoomFloor';
  room.add(mainFloor);

  // 2. Decoupled VC-E Concrete Inertia Block Plinth + 35 mm Neoprene Isolation Joint
  const neopreneBorder = new THREE.Mesh(
    new THREE.BoxGeometry(20.6, 0.04, 15.2),
    MAT_RUBBER_EPDM
  );
  neopreneBorder.position.set(0.0, -0.015, 0.20);
  neopreneBorder.name = 'Body_VCE_NeopreneJoint';
  room.add(neopreneBorder);

  const inertiaSlab = new THREE.Mesh(
    new THREE.BoxGeometry(19.8, 0.05, 14.4),
    makeMat(0x1b2230, { r: 0.36, m: 0.16 })
  );
  inertiaSlab.position.set(0.0, -0.02, 0.20);
  inertiaSlab.receiveShadow = true;
  inertiaSlab.name = 'Body_VCE_InertiaSlab';
  room.add(inertiaSlab);

  // Stainless safety trim strips around the VC-E isolation joint
  const trimFront = new THREE.Mesh(
    new THREE.BoxGeometry(20.6, 0.01, 0.18),
    MAT_316SS_BRUSHED
  );
  trimFront.position.set(0, 0.002, -7.40);
  room.add(trimFront);

  // 3. RF/EMI-Shielded & Acoustically Baffled Suite Walls (Back +Z, Left -X, Right +X)
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(58.0, 38.0, 0.50),
    makeMat(0x111722, { r: 0.65, m: 0.18 })
  );
  backWall.position.set(0, 19.0, 12.5);
  backWall.receiveShadow = true;
  backWall.name = 'Body_SuiteWallRear';
  room.add(backWall);

  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.50, 38.0, 46.0),
    makeMat(0x131a26, { r: 0.65, m: 0.18 })
  );
  leftWall.position.set(-28.8, 19.0, 0);
  leftWall.name = 'Body_SuiteWallLeft';
  room.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.50, 38.0, 46.0),
    makeMat(0x131a26, { r: 0.65, m: 0.18 })
  );
  rightWall.position.set(28.8, 19.0, 0);
  rightWall.name = 'Body_SuiteWallRight';
  room.add(rightWall);

  // Perforated Mu-Metal / Acoustic Absorber Baffles on Rear Wall
  for (let i = -3; i <= 3; i++) {
    const baffle = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 18.0, 0.18),
      makeMat(0x1b2434, { r: 0.52, m: 0.35 })
    );
    baffle.position.set(i * 6.4, 12.5, 12.15);
    baffle.name = `Body_AcousticBaffle_0${i + 4}`;
    room.add(baffle);
  }

  // Illuminated SEM Suite Header Plaque on Rear Wall
  const suitePlaque = makeSilkscreenLabelMesh(
    'ELECTRON MICROSCOPY SUITE · VC-E',
    'EMI SHIELDED < 0.5 mG · 0.8 nm UHV FE-SEM VAULT',
    11.5,
    1.85,
    '#090e17',
    '#f8fafc',
    '#00f3ff'
  );
  suitePlaque.position.set(0, 23.2, 12.02);
  suitePlaque.name = 'Body_SuiteHeaderPlaque';
  room.add(suitePlaque);

  // 4. Elevated Single-Sided Downward-Facing Ceiling at Y = 30.0 m (300 u) per DIAG-026
  const ceilingGeo = new THREE.PlaneGeometry(58.0, 46.0);
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.FrontSide,
  });
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2; // Normal points -Y (downward), invisible from above
  ceiling.position.set(0, 300.0, 0);
  ceiling.name = 'Body_SuiteCeiling';
  room.add(ceiling);

  // 5. Adjacent Specimen Preparation & Au/Pd Sputter Coater Bench (Right Side X = +14.8 u)
  const prepBenchGroup = new THREE.Group();
  prepBenchGroup.name = 'Body_SpecimenPrepBench';
  prepBenchGroup.position.set(14.8, 0, 1.5);

  const benchTop = new THREE.Mesh(
    new THREE.BoxGeometry(7.6, 0.38, 6.2),
    MAT_GRANITE_SLAB
  );
  benchTop.position.set(0, 7.41, 0);
  benchTop.castShadow = true;
  benchTop.receiveShadow = true;
  prepBenchGroup.add(benchTop);

  // 4 tubular steel bench legs resting on Y = 0
  [
    [-3.4, -2.7],
    [3.4, -2.7],
    [-3.4, 2.7],
    [3.4, 2.7],
  ].forEach(([lx, lz], idx) => {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 7.22, 0.42),
      MAT_FRAME_STEEL
    );
    leg.position.set(lx, 3.61, lz);
    leg.name = `Body_PrepBenchLeg_0${idx + 1}`;
    prepBenchGroup.add(leg);
  });

  // Benchtop Quorum / Leica Au/Pd Magnetron Sputter Coater
  const coaterGroup = new THREE.Group();
  coaterGroup.name = 'Body_SputterCoater_AuPd';
  coaterGroup.position.set(-1.6, 7.60, 0.3);

  const coaterBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 1.45, 2.5),
    MAT_ZEISS_WHITE
  );
  coaterBase.position.y = 0.725;
  coaterGroup.add(coaterBase);

  const coaterFace = makeSilkscreenLabelMesh(
    'QUORUM Q150T ES · Au/Pd SPUTTER',
    'PLASMA CURRENT: 25 mA · FILM: 10.0 nm',
    2.2,
    0.72,
    '#0f172a',
    '#38bdf8',
    '#0284c7'
  );
  coaterFace.position.set(0, 0.72, -1.26);
  coaterGroup.add(coaterFace);

  // Borosilicate glass sputter bell jar + violet argon plasma glow + gold target head
  const bellJar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.88, 0.88, 1.55, 28),
    MAT_BOROSILICATE_GLASS
  );
  bellJar.position.set(0, 2.22, 0);
  bellJar.name = 'Glass_SputterBellJar';
  coaterGroup.add(bellJar);

  const plasmaGlow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.74, 0.65, 24),
    makeMat(0xa855f7, { r: 0.2, m: 0.0, o: 0.38, e: 0x9333ea, ei: 1.4, dw: false })
  );
  plasmaGlow.position.set(0, 2.30, 0);
  plasmaGlow.name = 'Body_ArgonPlasmaGlow';
  coaterGroup.add(plasmaGlow);

  const magnetronHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.94, 0.94, 0.36, 28),
    MAT_DARK_ANODIZED
  );
  magnetronHead.position.set(0, 3.16, 0);
  coaterGroup.add(magnetronHead);

  prepBenchGroup.add(coaterGroup);

  // Aluminum SEM Pin-Stub Storage Box (holds 12.7 mm pin stubs + carbon conductive tape + tweezers)
  const stubBox = new THREE.Group();
  stubBox.name = 'Body_SEMStubBox';
  stubBox.position.set(1.85, 7.60, -0.4);

  const boxBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.36, 1.4),
    MAT_BLUE_ANODIZED
  );
  boxBase.position.y = 0.18;
  stubBox.add(boxBase);

  for (let r = -1; r <= 1; r++) {
    for (let c = -2; c <= 2; c++) {
      const stubPin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16),
        MAT_GOLD_MIRROR
      );
      stubPin.position.set(c * 0.32, 0.42, r * 0.34);
      stubBox.add(stubPin);
    }
  }
  prepBenchGroup.add(stubBox);
  room.add(prepBenchGroup);

  return room;
}

// ----------------------------------------------------------------------------
// Hospital-Grade Duplex Power Receptacle, NEMA 5-20P Plug & SJTOW Cord (Gate 2)
// ----------------------------------------------------------------------------
function buildPowerContinuityAssembly() {
  const powerGroup = new THREE.Group();
  powerGroup.name = 'Body_PowerContinuitySystem';

  // 1. Rear Utility Pedestal & Duplex Receptacle Box (Power_Receptacle_Duplex)
  const receptacleGroup = new THREE.Group();
  receptacleGroup.name = 'Body_Power_Receptacle_Duplex';
  // Alias token verified by oga_validator.mjs Gate 2 PWR-01: Power_Receptacle_Duplex
  receptacleGroup.userData.validatorToken = 'Power_Receptacle_Duplex';
  receptacleGroup.position.set(-2.40, 0.0, 6.20);

  const pedestalPost = new THREE.Mesh(
    new THREE.BoxGeometry(1.10, 2.20, 0.75),
    MAT_FRAME_STEEL
  );
  pedestalPost.position.y = 1.10;
  pedestalPost.castShadow = true;
  receptacleGroup.add(pedestalPost);

  const outletFaceplate = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 1.35, 0.06),
    MAT_316SS_BRUSHED
  );
  outletFaceplate.position.set(0, 1.35, -0.39);
  receptacleGroup.add(outletFaceplate);

  // Two NEMA 5-20R duplex sockets with phase slots + D-shaped ground holes
  [-0.32, 0.32].forEach((oy, idx) => {
    const socketFace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.04, 24),
      makeMat(0xdc2626, { r: 0.35, m: 0.05 }) // Hospital-grade red NEMA duplex
    );
    socketFace.rotation.x = Math.PI / 2;
    socketFace.position.set(0, 1.35 + oy, -0.42);
    receptacleGroup.add(socketFace);

    const slotL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.14, 0.03), MAT_RUBBER_EPDM);
    slotL.position.set(-0.08, 1.39 + oy, -0.44);
    receptacleGroup.add(slotL);

    const slotR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.11, 0.03), MAT_RUBBER_EPDM);
    slotR.position.set(0.08, 1.39 + oy, -0.44);
    receptacleGroup.add(slotR);

    const gndHole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 12), MAT_RUBBER_EPDM);
    gndHole.rotation.x = Math.PI / 2;
    gndHole.position.set(0, 1.24 + oy, -0.44);
    receptacleGroup.add(gndHole);

    const screw = createHexSocketScrew(0.015, 0.04, `Fastener_HexM3_Outlet_0${idx + 1}`);
    screw.rotation.x = -Math.PI / 2;
    screw.position.set(0, 1.35 + oy * 1.65, -0.42);
    receptacleGroup.add(screw);
  });

  const outletLabel = makeSilkscreenLabelMesh(
    '230V / 16A DEDICATED LINE',
    'HOSPITAL GRADE · ISOLATED GND',
    0.86,
    0.26,
    '#0f172a',
    '#f8fafc',
    '#ef4444'
  );
  outletLabel.position.set(0, 2.04, -0.39);
  receptacleGroup.add(outletLabel);
  powerGroup.add(receptacleGroup);

  // 2. Molded NEMA 5-15P / 5-20P Grounded Plug (Power_Plug_NEMA)
  const plugGroup = new THREE.Group();
  plugGroup.name = 'Body_Power_Plug_NEMA';
  // Gate 2 PWR-02 token: Power_Plug_NEMA
  plugGroup.userData.validatorToken = 'Power_Plug_NEMA';
  plugGroup.position.set(-2.40, 1.67, 5.56);

  const plugBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.44, 0.46),
    MAT_RUBBER_EPDM
  );
  plugGroup.add(plugBody);

  const strainRelief = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.16, 0.34, 16),
    MAT_RUBBER_EPDM
  );
  strainRelief.rotation.x = Math.PI / 2;
  strainRelief.position.z = -0.36;
  plugGroup.add(strainRelief);

  // Brass phase blades + cylindrical ground pin facing +Z into the outlet
  [-0.08, 0.08].forEach(bx => {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.12, 0.22),
      MAT_BRASS_GOLD
    );
    blade.position.set(bx, 0.05, 0.30);
    plugGroup.add(blade);
  });
  const groundPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, 0.25, 12),
    MAT_BRASS_GOLD
  );
  groundPin.rotation.x = Math.PI / 2;
  groundPin.position.set(0, -0.09, 0.31);
  plugGroup.add(groundPin);
  powerGroup.add(plugGroup);

  // 3. Heavy-Duty 12 AWG 3-Conductor SJTOW Power Cord (Power_Cord_SJTOW)
  // Connects rear Port_IEC at (-1.50, 2.15, 5.12) to Power_Plug_NEMA at (-2.40, 1.67, 5.56)
  const cordPlugged = makeWiringHarness(
    [
      [-1.50, 2.15, 5.12],
      [-1.65, 1.35, 5.55],
      [-1.95, 0.55, 5.75],
      [-2.25, 0.85, 5.50],
      [-2.40, 1.67, 5.22],
    ],
    0.075,
    MAT_RUBBER_EPDM,
    'Body_Power_Cord_SJTOW',
    true
  );
  powerGroup.add(cordPlugged);

  return { powerGroup, receptacleGroup, plugGroup, cordPlugged };
}

// ----------------------------------------------------------------------------
// Internal Electronics, Vacuum Pumps & 30 kV HV Bay (Gate 4 & Gate 5)
// ----------------------------------------------------------------------------
function buildInternalMechanicsAndElectronicsBay() {
  const internalGroup = new THREE.Group();
  internalGroup.name = 'Body_InternalMechanicsAndElectronicsBay';

  // 1. Pfeiffer HiPace 300 Turbomolecular Pump (90,000 RPM) under Chamber DN100CF Port
  const turboGroup = new THREE.Group();
  turboGroup.name = 'Body_Motor_DriveTurboPump';
  // Gate 5 INT-02 token: Motor_Drive
  turboGroup.userData.validatorToken = 'Motor_Drive';
  turboGroup.position.set(-4.15, 6.20, -0.20);

  // Top DN100CF Flange bolted to bottom of UHV chamber
  const turboTopFlange = createConFlatFlange(1.15, 0.78, 0.24, 'TurboCF100', 12);
  turboTopFlange.position.y = 1.38;
  turboGroup.add(turboTopFlange);

  // Finned cast-aluminum high-vacuum stator barrel
  const turboBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.92, 0.88, 1.85, 28),
    MAT_316SS_BRUSHED
  );
  turboBody.position.y = 0.35;
  turboGroup.add(turboBody);

  // 8 radial cooling fins around turbo housing
  for (let i = 0; i < 8; i++) {
    const fin = new THREE.Mesh(
      new THREE.CylinderGeometry(1.02, 1.02, 0.05, 28),
      MAT_DARK_ANODIZED
    );
    fin.position.y = -0.25 + i * 0.17;
    turboGroup.add(fin);
  }

  // Onboard Pfeiffer TC 110 Electronic Drive Unit Box on +X side of turbo
  const tc110Box = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 1.15, 0.90),
    MAT_DARK_ANODIZED
  );
  tc110Box.position.set(0.98, 0.22, 0);
  turboGroup.add(tc110Box);

  const turboLabel = makeSilkscreenLabelMesh(
    'PFEIFFER HiPace 300',
    '90,000 RPM · 260 L/s UHV TURBO',
    0.82,
    0.32,
    '#0f172a',
    '#38bdf8',
    '#0284c7'
  );
  turboLabel.position.set(0, 0.35, -0.94);
  turboGroup.add(turboLabel);

  // DN25KF Foreline Exhaust Port on -X side of turbo base
  const kfPort = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.45, 20),
    MAT_316SS_POLISHED
  );
  kfPort.rotation.z = Math.PI / 2;
  kfPort.position.set(-0.98, -0.35, 0);
  turboGroup.add(kfPort);

  internalGroup.add(turboGroup);

  // 2. Pfeiffer HiScroll 6 Oil-Free Dry Scroll Backing Pump on Elastomeric Mounts
  const scrollGroup = new THREE.Group();
  scrollGroup.name = 'Body_Motor_DriveScrollPump';
  scrollGroup.position.set(-6.20, 1.45, 2.15);

  const scrollMotor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 1.95, 24),
    MAT_ZEISS_ANTHRACITE
  );
  scrollMotor.rotation.x = Math.PI / 2;
  scrollGroup.add(scrollMotor);

  const scrollHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.84, 0.80, 0.68, 24),
    MAT_316SS_BRUSHED
  );
  scrollHead.rotation.x = Math.PI / 2;
  scrollHead.position.z = -1.25;
  scrollGroup.add(scrollHead);

  // 8 scroll head DIN 912 M6 bolts
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const scr = createHexSocketScrew(0.02, 0.06, `Fastener_HexM6_Scroll_0${i + 1}`);
    scr.rotation.x = -Math.PI / 2;
    scr.position.set(Math.cos(ang) * 0.64, Math.sin(ang) * 0.64, -1.60);
    scrollGroup.add(scr);
  }

  const scrollLabel = makeSilkscreenLabelMesh(
    'PFEIFFER HiScroll 6',
    'OIL-FREE DRY SCROLL · 1800 RPM',
    1.15,
    0.36,
    '#111827',
    '#f8fafc',
    '#22c55e'
  );
  scrollLabel.rotation.y = Math.PI / 2;
  scrollLabel.position.set(0.74, 0.15, -0.20);
  scrollGroup.add(scrollLabel);
  internalGroup.add(scrollGroup);

  // 3. Corrugated 316L Stainless Flexible Foreline Hose (DN25KF) + Wing-Nut Clamps
  const forelineHose = makeWiringHarness(
    [
      [-5.15, 5.85, -0.20],
      [-5.85, 5.45, 0.35],
      [-6.20, 3.85, 1.25],
      [-6.20, 2.25, 0.90],
    ],
    0.16,
    MAT_316SS_BRUSHED,
    'Body_VacuumForeline_KF25',
    true
  );
  internalGroup.add(forelineHose);

  // 4. Potted 30 kV Spellman High-Voltage Tank (Body_HVTank_30kV)
  const hvTankGroup = new THREE.Group();
  hvTankGroup.name = 'Body_HVTank_30kV';
  hvTankGroup.position.set(-6.35, 4.10, 2.75);

  const hvTankBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.10, 2.60, 2.20),
    MAT_HV_EPOXY_RED
  );
  hvTankGroup.add(hvTankBody);

  const hvTopCap = new THREE.Mesh(
    new THREE.BoxGeometry(2.16, 0.18, 2.26),
    MAT_316SS_BRUSHED
  );
  hvTopCap.position.y = 1.35;
  hvTankGroup.add(hvTopCap);

  // Conical alumina high-voltage feedthrough insulator on top of HV tank
  const hvInsulator = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.38, 0.65, 24),
    MAT_ALUMINA_CERAMIC
  );
  hvInsulator.position.set(0, 1.75, 0.35);
  hvTankGroup.add(hvInsulator);

  const hvLabel = makeSilkscreenLabelMesh(
    'DANGER · 30,000 V DC EHT',
    'SPELLMAN HV MULTIPLIER TANK · +8kV BOOSTER',
    1.85,
    0.58,
    '#450a0a',
    '#fef08a',
    '#ef4444'
  );
  hvLabel.position.set(0, 0.15, -1.12);
  hvTankGroup.add(hvLabel);
  internalGroup.add(hvTankGroup);

  // 5. Perforated Mean Well LRS-350-24 Switching Power Supply + Toroidal Transformer (Gate 4 BAY-04)
  const psuGroup = new THREE.Group();
  psuGroup.name = 'Body_Assembly_PowerSupply';
  // Gate 4 BAY-04 token: Assembly_PowerSupply
  psuGroup.userData.validatorToken = 'Assembly_PowerSupply';
  psuGroup.position.set(-2.15, 4.25, 2.55);

  const psuCage = new THREE.Mesh(
    new THREE.BoxGeometry(2.25, 1.10, 1.65),
    MAT_316SS_BRUSHED
  );
  psuGroup.add(psuCage);

  // Internal PSU components visible through side/front inspection: bulk caps + yellow Mylar transformer + barrier strip
  [-0.55, -0.15].forEach((cx, idx) => {
    const bulkCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.20, 0.20, 0.72, 18),
      makeMat(0x1e3a8a, { r: 0.25, m: 0.35 })
    );
    bulkCap.position.set(cx, 0.12, -0.84);
    bulkCap.name = `Body_PSUCap_0${idx + 1}`;
    psuGroup.add(bulkCap);
  });

  const flybackXfmr = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.65, 0.45),
    makeMat(0xeab308, { r: 0.28, m: 0.12 })
  );
  flybackXfmr.position.set(0.38, 0.10, -0.84);
  psuGroup.add(flybackXfmr);

  // 7-position screw-terminal barrier strip on front edge of PSU
  const barrierStrip = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.28, 0.26),
    MAT_RUBBER_EPDM
  );
  barrierStrip.position.set(0, -0.28, -0.92);
  psuGroup.add(barrierStrip);

  for (let t = 0; t < 7; t++) {
    const termScrew = createHexSocketScrew(0.015, 0.03, `Fastener_HexM3_PSUTerm_0${t + 1}`);
    termScrew.position.set(-0.72 + t * 0.24, -0.12, -0.92);
    psuGroup.add(termScrew);
  }

  const psuLabel = makeSilkscreenLabelMesh(
    'MEAN WELL LRS-350-24',
    'AC 230V -> DC +24V 14.6A · REGULATED',
    1.95,
    0.45,
    '#0f172a',
    '#f8fafc',
    '#38bdf8'
  );
  psuLabel.position.set(0, 0.22, -0.84);
  psuGroup.add(psuLabel);
  internalGroup.add(psuGroup);

  // 300 VA Low-Stray-Field Copper Toroidal Isolation Transformer (Part_ToroidalTransformer)
  const toroidGroup = new THREE.Group();
  toroidGroup.name = 'Body_Part_ToroidalTransformer';
  // Gate 4 BAY-04 token: Part_ToroidalTransformer
  toroidGroup.userData.validatorToken = 'Part_ToroidalTransformer';
  toroidGroup.position.set(-2.15, 1.45, 2.55);

  const toroidCore = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.28, 20, 36),
    MAT_TOROID_COIL
  );
  toroidCore.rotation.x = Math.PI / 2;
  toroidGroup.add(toroidCore);

  const toroidCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.62, 0.08, 24),
    MAT_316SS_POLISHED
  );
  toroidCap.position.y = 0.28;
  toroidGroup.add(toroidCap);

  const toroidBolt = createHexSocketScrew(0.035, 0.65, 'Fastener_HexM8_ToroidCenter');
  toroidBolt.position.y = 0.32;
  toroidGroup.add(toroidBolt);
  internalGroup.add(toroidGroup);

  // 6. 6-Layer FR-4 SmartSEM Control Motherboard (Gate 4 BAY-01..03 & Gate 5 INT-04)
  const moboGroup = new THREE.Group();
  moboGroup.name = 'Body_PCB_Motherboard';
  // Gate 4 BAY-01 token: PCB_Motherboard
  moboGroup.userData.validatorToken = 'PCB_Motherboard';
  moboGroup.position.set(-2.15, 4.35, -1.55);

  const pcbBoard = new THREE.Mesh(
    new THREE.BoxGeometry(2.90, 2.15, 0.06),
    MAT_PCB_FR4
  );
  moboGroup.add(pcbBoard);

  // 6 M3 brass standoffs + DIN 912 hex socket screws securing the PCB
  [
    [-1.32, 0.95],
    [0.0, 0.95],
    [1.32, 0.95],
    [-1.32, -0.95],
    [0.0, -0.95],
    [1.32, -0.95],
  ].forEach(([px, py], idx) => {
    const standoff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.22, 6),
      MAT_BRASS_GOLD
    );
    standoff.rotation.x = Math.PI / 2;
    standoff.position.set(px, py, 0.12);
    moboGroup.add(standoff);

    const pcbScrew = createHexSocketScrew(0.016, 0.05, `Fastener_HexM3_PCB_0${idx + 1}`);
    pcbScrew.rotation.x = -Math.PI / 2;
    pcbScrew.position.set(px, py, -0.04);
    moboGroup.add(pcbScrew);
  });

  // 176-Pin LQFP ARM Cortex-M7 / FPGA Dual-Channel Scan Controller (Part_MCU_ARM)
  const mcuGroup = new THREE.Group();
  mcuGroup.name = 'Body_Part_MCU_ARM';
  // Gate 4 BAY-02 token: Part_MCU_ARM / ARM Cortex Microcontroller
  mcuGroup.userData.validatorToken = 'Part_MCU_ARM · ARM Cortex Microcontroller';
  mcuGroup.position.set(-0.45, 0.22, -0.06);

  const mcuChip = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.62, 0.06),
    MAT_IC_EPOXY
  );
  mcuGroup.add(mcuChip);

  const mcuLabel = makeSilkscreenLabelMesh(
    'ARM CORTEX-M7',
    'ZEISS SCAN FPGA',
    0.54,
    0.54,
    '#111827',
    '#f8fafc',
    '#38bdf8'
  );
  mcuLabel.position.z = -0.035;
  mcuGroup.add(mcuLabel);
  moboGroup.add(mcuGroup);

  // Dual TSOP-54 Synchronous DRAM Framebuffer Chips (Part_RAM_Chip)
  const ramGroup = new THREE.Group();
  ramGroup.name = 'Body_Part_RAM_Chip';
  // Gate 4 BAY-03 token: Part_RAM_Chip
  ramGroup.userData.validatorToken = 'Part_RAM_Chip';
  ramGroup.position.set(0.58, 0.42, -0.05);

  [-0.22, 0.22].forEach(ry => {
    const ramPkg = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.28, 0.05),
      MAT_IC_EPOXY
    );
    ramPkg.position.y = ry;
    ramGroup.add(ramPkg);
  });
  moboGroup.add(ramGroup);

  // 256 GB Industrial BGA eMMC / NVMe Solid-State Flash Module (Part_SSD_Module)
  const ssdGroup = new THREE.Group();
  ssdGroup.name = 'Body_Part_SSD_Module';
  // Gate 4 BAY-03 token: Part_SSD_Module
  ssdGroup.userData.validatorToken = 'Part_SSD_Module';
  ssdGroup.position.set(0.58, -0.35, -0.05);

  const ssdPkg = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.44, 0.06),
    MAT_DARK_ANODIZED
  );
  ssdGroup.add(ssdPkg);

  const ssdLabel = makeSilkscreenLabelMesh(
    '256GB NVMe SSD',
    'GLP CACHE',
    0.60,
    0.36,
    '#0f172a',
    '#38bdf8',
    '#22c55e'
  );
  ssdLabel.position.z = -0.035;
  ssdGroup.add(ssdLabel);
  moboGroup.add(ssdGroup);

  // Castellated Wi-Fi 802.11ac / Bluetooth 5.2 BLE Shielded Radio Module (WiFi_BLE)
  const wifiGroup = new THREE.Group();
  wifiGroup.name = 'Body_WiFi_BLE';
  // Gate 5 INT-04 token: WiFi_BLE
  wifiGroup.userData.validatorToken = 'WiFi_BLE';
  wifiGroup.position.set(-0.98, -0.42, -0.05);

  const wifiShieldCan = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.38, 0.06),
    MAT_316SS_POLISHED
  );
  wifiGroup.add(wifiShieldCan);

  // Gold U.FL micro-coaxial connector pad on WiFi_BLE module
  const uflPad = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.04, 14),
    MAT_BRASS_GOLD
  );
  uflPad.rotation.x = Math.PI / 2;
  uflPad.position.set(-0.14, -0.10, -0.04);
  wifiGroup.add(uflPad);
  moboGroup.add(wifiGroup);

  // CR2032 Coin-Cell RTC Battery Holder + Green Phoenix Contact Terminal Blocks
  const cr2032 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.05, 20),
    MAT_316SS_POLISHED
  );
  cr2032.rotation.x = Math.PI / 2;
  cr2032.position.set(-1.02, 0.45, -0.05);
  moboGroup.add(cr2032);

  const phoenixHeader = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 0.22, 0.16),
    MAT_PHOENIX_GREEN
  );
  phoenixHeader.position.set(0.0, -0.82, -0.09);
  moboGroup.add(phoenixHeader);

  internalGroup.add(moboGroup);

  // 7. Rear Bulkhead I/O Panel, Cooling Fans & External Dipole Antenna (Z = +5.08 u)
  const bulkheadGroup = new THREE.Group();
  bulkheadGroup.name = 'Body_RearBulkheadIO';
  bulkheadGroup.position.set(-3.20, 2.80, 5.06);

  const bulkheadPlate = new THREE.Mesh(
    new THREE.BoxGeometry(5.80, 3.80, 0.08),
    MAT_316SS_BRUSHED
  );
  bulkheadGroup.add(bulkheadPlate);

  // Forced Convection Cooling Blower Fan with Chrome Wire Finger Grille (Fan_CabinetCooling_Blower)
  const fanGroup = new THREE.Group();
  fanGroup.name = 'Body_Fan_CabinetCooling_Blower';
  // Gate 4 BAY-05 token: Fan_CabinetCooling_Blower
  fanGroup.userData.validatorToken = 'Fan_CabinetCooling_Blower';
  fanGroup.position.set(-1.55, 0.55, 0.04);

  const fanFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 1.35, 0.32),
    MAT_RUBBER_EPDM
  );
  fanGroup.add(fanFrame);

  const fanHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.34, 20),
    MAT_DARK_ANODIZED
  );
  fanHub.rotation.x = Math.PI / 2;
  fanGroup.add(fanHub);

  // 7 angled impeller blades
  for (let b = 0; b < 7; b++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.38, 0.04),
      MAT_DARK_ANODIZED
    );
    const ang = (b / 7) * Math.PI * 2;
    blade.position.set(Math.cos(ang) * 0.36, Math.sin(ang) * 0.36, 0);
    blade.rotation.z = ang + 0.45;
    blade.rotation.y = 0.38;
    fanGroup.add(blade);
  }

  // Concentric chrome wire finger-guard rings
  [0.28, 0.42, 0.56].forEach(gr => {
    const guardRing = new THREE.Mesh(
      new THREE.TorusGeometry(gr, 0.014, 10, 28),
      MAT_316SS_POLISHED
    );
    guardRing.position.z = 0.18;
    fanGroup.add(guardRing);
  });
  bulkheadGroup.add(fanGroup);

  // Rear Bulkhead Ports: Port_IEC, Port_RS232, Port_USB, USB_Drive, Port_RJ45, Antenna_WiFi
  const portIEC = new THREE.Group();
  portIEC.name = 'Body_Port_IEC';
  portIEC.userData.validatorToken = 'Port_IEC';
  portIEC.position.set(1.70, -0.65, 0.06);
  portIEC.add(new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.68, 0.18), MAT_RUBBER_EPDM));
  // Illuminated green main breaker rocker
  const breakerRocker = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.28, 0.12),
    makeMat(0x22c55e, { r: 0.25, m: 0.1, e: 0x16a34a, ei: 0.75 })
  );
  breakerRocker.position.set(0, 0.14, 0.08);
  portIEC.add(breakerRocker);
  bulkheadGroup.add(portIEC);

  const portRS232 = new THREE.Group();
  portRS232.name = 'Body_Port_RS232';
  portRS232.userData.validatorToken = 'Port_RS232';
  portRS232.position.set(0.35, 0.85, 0.06);
  portRS232.add(new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.22, 0.12), MAT_316SS_POLISHED));
  bulkheadGroup.add(portRS232);

  const portUSB = new THREE.Group();
  portUSB.name = 'Body_Port_USB';
  portUSB.userData.validatorToken = 'Port_USB';
  portUSB.position.set(0.95, 0.85, 0.06);
  portUSB.add(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.14), MAT_316SS_POLISHED));
  bulkheadGroup.add(portUSB);

  const usbDrive = new THREE.Group();
  usbDrive.name = 'Body_USB_Drive';
  usbDrive.userData.validatorToken = 'USB_Drive';
  usbDrive.position.set(1.35, 0.85, 0.18);
  usbDrive.add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.10, 0.36), MAT_BLUE_ANODIZED));
  bulkheadGroup.add(usbDrive);

  const portRJ45 = new THREE.Group();
  portRJ45.name = 'Body_Port_RJ45';
  portRJ45.userData.validatorToken = 'Port_RJ45';
  portRJ45.position.set(1.75, 0.85, 0.06);
  portRJ45.add(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.14), MAT_316SS_POLISHED));
  bulkheadGroup.add(portRJ45);

  const antennaWiFi = new THREE.Group();
  antennaWiFi.name = 'Body_Antenna_WiFi';
  antennaWiFi.userData.validatorToken = 'Antenna_WiFi';
  antennaWiFi.position.set(2.35, 0.85, 0.14);
  const smaNut = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 6), MAT_BRASS_GOLD);
  smaNut.rotation.x = Math.PI / 2;
  antennaWiFi.add(smaNut);
  const whipRadome = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.065, 1.35, 16), MAT_RUBBER_EPDM);
  whipRadome.position.set(0, 0.65, 0.08);
  antennaWiFi.add(whipRadome);
  bulkheadGroup.add(antennaWiFi);

  // Brass Swagelok Chiller Coolant Supply/Return Bulkhead Unions
  [-0.35, 0.05].forEach((cx, idx) => {
    const swagelok = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.26, 6),
      MAT_BRASS_GOLD
    );
    swagelok.rotation.x = Math.PI / 2;
    swagelok.position.set(cx, -0.85, 0.08);
    swagelok.name = `Body_SwagelokBulkhead_0${idx + 1}`;
    bulkheadGroup.add(swagelok);
  });

  internalGroup.add(bulkheadGroup);

  // 8. End-to-End Point-to-Point Internal Wiring & Coolant Harnesses (Gate 5 INT-01)
  // 8A. AC Mains Brown (Live), Blue (Neutral), Green/Yellow (Protective Earth) from Port_IEC to Toroid & PSU
  internalGroup.add(
    makeWiringHarness(
      [
        [-1.50, 2.15, 5.02],
        [-1.65, 1.65, 4.10],
        [-2.15, 1.45, 3.15],
        [-2.15, 3.95, 2.85],
      ],
      0.032,
      MAT_WIRE_AC_BROWN,
      'Body_Wire_ACLive_Brown'
    )
  );
  internalGroup.add(
    makeWiringHarness(
      [
        [-1.42, 2.15, 5.02],
        [-1.55, 1.60, 4.05],
        [-2.05, 1.45, 3.10],
        [-2.05, 3.95, 2.80],
      ],
      0.032,
      MAT_WIRE_AC_BLUE,
      'Body_Wire_ACNeutral_Blue'
    )
  );
  internalGroup.add(
    makeWiringHarness(
      [
        [-1.58, 2.15, 5.02],
        [-1.85, 0.85, 4.40],
        [-2.35, 3.95, 2.80],
      ],
      0.032,
      MAT_WIRE_PE_GRNYLW,
      'Body_Wire_ProtectiveEarth'
    )
  );

  // 8B. 24 VDC Red/Black Twisted Harness from PSU Barrier Strip to Motherboard, Turbo TC110, Scroll & Fans
  internalGroup.add(
    makeWiringHarness(
      [
        [-2.15, 3.98, 1.64],
        [-2.15, 3.85, 0.20],
        [-2.15, 3.55, -1.55],
      ],
      0.038,
      MAT_WIRE_DC_RED,
      'Body_Wire_DC24V_Red'
    )
  );
  internalGroup.add(
    makeWiringHarness(
      [
        [-2.02, 3.98, 1.64],
        [-2.02, 3.80, 0.20],
        [-2.02, 3.55, -1.55],
      ],
      0.038,
      MAT_WIRE_DC_BLACK,
      'Body_Wire_DC24V_Black'
    )
  );
  internalGroup.add(
    makeWiringHarness(
      [
        [-2.35, 3.98, 1.64],
        [-2.90, 5.20, 0.85],
        [-3.18, 6.40, -0.20],
      ],
      0.036,
      MAT_WIRE_DC_RED,
      'Body_Wire_TurboPower24V'
    )
  );

  // 8C. 30 kV Silicone High-Voltage Umbilical Cable from Body_HVTank_30kV to Top FEG Gun Head
  internalGroup.add(
    makeWiringHarness(
      [
        [-6.35, 5.85, 3.10],
        [-6.45, 8.80, 3.65],
        [-5.85, 13.50, 2.80],
        [-4.85, 17.65, 0.85],
        [-4.15, 18.25, -0.20],
      ],
      0.095,
      MAT_WIRE_HV_RED,
      'Body_Wire_HV30kV_Umbilical'
    )
  );

  // 8D. Wi-Fi U.FL Micro-Coax Pigtail from Motherboard WiFi_BLE to Rear Antenna_WiFi
  internalGroup.add(
    makeWiringHarness(
      [
        [-3.13, 3.93, -1.60],
        [-1.85, 3.70, 1.80],
        [-0.85, 3.65, 5.02],
      ],
      0.022,
      MAT_RUBBER_EPDM,
      'Body_Wire_WiFiCoax_UFL'
    )
  );

  // 8E. Closed-Loop Water Chiller Supply (Blue) & Return (Red) Lines from Rear Swagelok to Objective Lens & Turbo
  internalGroup.add(
    makeWiringHarness(
      [
        [-3.55, 1.95, 5.02],
        [-3.55, 5.80, 2.20],
        [-3.25, 11.45, 0.85],
      ],
      0.048,
      MAT_COOLANT_BLUE,
      'Body_Wire_CoolantSupply_Blue'
    )
  );
  internalGroup.add(
    makeWiringHarness(
      [
        [-3.15, 1.95, 5.02],
        [-3.15, 5.80, 2.20],
        [-3.05, 11.45, 0.85],
      ],
      0.048,
      MAT_COOLANT_RED,
      'Body_Wire_CoolantReturn_Red'
    )
  );

  return { internalGroup, turboGroup, scrollGroup, hvTankGroup, psuGroup, moboGroup, bulkheadGroup };
}
// ----------------------------------------------------------------------------
// Plinth, Welded Steel Spaceframe, Pneumatic Isolators & Service Doors (Gate 1)
// ----------------------------------------------------------------------------
function buildPlinthAndChassis() {
  const chassisGroup = new THREE.Group();
  chassisGroup.name = 'Body_Chassis';

  // Lower Heavy Cast-Iron & Welded Steel Vibration Plinth (X = -8.0..+0.4, Y = 0.25..0.95, Z = -5.2..+5.2)
  const basePlinth = new THREE.Mesh(
    new THREE.BoxGeometry(8.40, 0.70, 10.40),
    MAT_CAST_IRON
  );
  basePlinth.position.set(-3.80, 0.60, 0.0);
  basePlinth.name = 'Body_ChassisPlinth';
  chassisGroup.add(basePlinth);

  // 4 Heavy-Duty Leveling Feet resting flush at floor datum Y = 0.0 (Gate 1 TAX-06)
  const footCoords = [
    ['Foot_Leveling_FL', -7.65, -4.85],
    ['Foot_Leveling_FR', 0.05, -4.85],
    ['Foot_Leveling_RL', -7.65, 4.85],
    ['Foot_Leveling_RR', 0.05, 4.85],
  ];
  footCoords.forEach(([footName, fx, fz]) => {
    const footGrp = new THREE.Group();
    footGrp.name = footName;
    footGrp.position.set(fx, 0.0, fz);

    // Vulcanized EPDM rubber pad resting on Y = 0.0 (height 0.10, center Y = 0.05)
    const rubberPad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.38, 0.10, 24),
      MAT_RUBBER_EPDM
    );
    rubberPad.position.y = 0.05;
    footGrp.add(rubberPad);

    // Knurled stainless leveling collar
    const knurlCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.10, 24),
      MAT_316SS_BRUSHED
    );
    knurlCollar.position.y = 0.15;
    footGrp.add(knurlCollar);

    // Threaded M20 stud + hex jam nut into plinth
    const stud = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.12, 16),
      MAT_316SS_POLISHED
    );
    stud.position.y = 0.24;
    footGrp.add(stud);

    chassisGroup.add(footGrp);
  });

  // 4 Active Pneumatic Air-Spring Isolation Mounts (Body_PneumaticIsolator_01..04)
  const isoCoords = [
    [-7.10, -3.90],
    [-0.50, -3.90],
    [-7.10, 3.90],
    [-0.50, 3.90],
  ];
  isoCoords.forEach(([ix, iz], idx) => {
    const isoGrp = new THREE.Group();
    isoGrp.name = `Body_PneumaticIsolator_0${idx + 1}`;
    isoGrp.position.set(ix, 2.85, iz);

    const lowerCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.54, 0.58, 2.20, 24),
      MAT_ZEISS_ANTHRACITE
    );
    isoGrp.add(lowerCup);

    const airBellows = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.16, 16, 28),
      MAT_RUBBER_EPDM
    );
    airBellows.rotation.x = Math.PI / 2;
    airBellows.position.y = 1.25;
    isoGrp.add(airBellows);

    const topPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.56, 0.56, 0.22, 24),
      MAT_316SS_BRUSHED
    );
    topPlate.position.y = 1.50;
    isoGrp.add(topPlate);

    chassisGroup.add(isoGrp);
  });

  // Upper Vibration-Isolated Granite/Steel Deck supporting Chamber & Column (Y = 6.95..7.55)
  const isolatedDeck = new THREE.Mesh(
    new THREE.BoxGeometry(8.30, 0.60, 10.20),
    MAT_ZEISS_ANTHRACITE
  );
  isolatedDeck.position.set(-3.80, 7.25, 0.0);
  isolatedDeck.name = 'Body_ChassisIsolatedDeck';
  chassisGroup.add(isolatedDeck);

  // Left, Right & Rear Powder-Coated Acoustic Enclosure Walls (RAL 9003 / RAL 7016)
  const leftBayWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 6.00, 10.20),
    MAT_ZEISS_WHITE
  );
  leftBayWall.position.set(-7.88, 3.95, 0.0);
  leftBayWall.name = 'Body_ChassisWallLeft';
  chassisGroup.add(leftBayWall);

  // Rear Upper Shroud Enclosure behind Column/Chamber
  const rearUpperCabinet = new THREE.Mesh(
    new THREE.BoxGeometry(8.20, 8.20, 3.60),
    MAT_ZEISS_WHITE
  );
  rearUpperCabinet.position.set(-3.80, 11.65, 3.30);
  rearUpperCabinet.name = 'Body_ChassisRearTower';
  chassisGroup.add(rearUpperCabinet);

  // Blue anodized ZEISS accent trim band across front of upper tower
  const zeissTrimBar = new THREE.Mesh(
    new THREE.BoxGeometry(8.24, 0.22, 0.08),
    MAT_BLUE_ANODIZED
  );
  zeissTrimBar.position.set(-3.80, 15.40, 1.48);
  zeissTrimBar.name = 'Body_ChassisAccentTrim';
  chassisGroup.add(zeissTrimBar);

  // Hinged Front Lower Service Bay Door (Pivot_DoorServiceBay) exposing Internal Electronics & Vacuum Bay
  const serviceDoorPivot = new THREE.Group();
  serviceDoorPivot.name = 'Pivot_DoorServiceBay';
  serviceDoorPivot.position.set(-7.85, 3.95, -5.12);

  const frontDoorPanel = new THREE.Mesh(
    new THREE.BoxGeometry(8.10, 5.85, 0.14),
    MAT_ZEISS_WHITE
  );
  frontDoorPanel.position.set(4.05, 0.0, 0.0);
  serviceDoorPivot.add(frontDoorPanel);

  // Flush compression latch + 8 ventilation louvers on service door
  const latchBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.18, 20),
    MAT_DARK_ANODIZED
  );
  latchBody.rotation.x = Math.PI / 2;
  latchBody.position.set(7.65, 0.25, -0.05);
  serviceDoorPivot.add(latchBody);

  for (let l = 0; l < 8; l++) {
    const louver = new THREE.Mesh(
      new THREE.BoxGeometry(2.40, 0.08, 0.06),
      MAT_ZEISS_ANTHRACITE
    );
    louver.position.set(2.15, -1.80 + l * 0.32, -0.06);
    serviceDoorPivot.add(louver);
  }

  // Official Lower-Frame Brand Badge (Badge_SREdesigns - Gate 1 TAX-07)
  const sreBadge = makeSREdesignsBadge();
  sreBadge.position.set(5.95, -1.95, -0.10);
  serviceDoorPivot.add(sreBadge);

  // Main Model Nameplate on Lower Service Door
  const modelPlate = makeSilkscreenLabelMesh(
    'ZEISS GeminiSEM 500',
    'SCHOTTKY FE-SEM · 0.02 - 30 kV · INLENS + SE2 + 4Q-BSE + EDS',
    3.60,
    0.68,
    '#0f172a',
    '#f8fafc',
    '#38bdf8'
  );
  modelPlate.position.set(2.55, 2.05, -0.09);
  serviceDoorPivot.add(modelPlate);

  chassisGroup.add(serviceDoorPivot);

  return { chassisGroup, serviceDoorPivot };
}

// ----------------------------------------------------------------------------
// 316L Stainless UHV Specimen Chamber, ConFlat Ports & 5-Axis Eucentric Stage
// ----------------------------------------------------------------------------
function buildSpecimenChamberAndStage() {
  const chamberGroup = new THREE.Group();
  chamberGroup.name = 'Body_ChamberUHV';
  chamberGroup.position.set(-4.15, 9.65, -0.20);

  // Main Octagonal/Cylindrical 316L Stainless Steel UHV Vessel (ID 330 mm, OD 370 mm, H 270 mm)
  const vesselBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(2.05, 2.05, 3.65, 16),
    MAT_316SS_BRUSHED
  );
  chamberGroup.add(vesselBarrel);

  // Heavy Top & Bottom Machined UHV Chamber Flanges with 16 DIN 912 M8 Bolts each
  const topChamberFlange = createConFlatFlange(2.22, 1.15, 0.28, 'ChamberTop', 16);
  topChamberFlange.position.y = 1.92;
  chamberGroup.add(topChamberFlange);

  const botChamberFlange = createConFlatFlange(2.22, 1.15, 0.28, 'ChamberBot', 16);
  botChamberFlange.position.y = -1.92;
  chamberGroup.add(botChamberFlange);

  // 6 Radial Accessory ConFlat Ports around Chamber Perimeter (SE2, EDS, WDS, Chamberscope, Gauge, Vent)
  const portSpecs = [
    { ang: 0.35, y: 0.45, rOut: 0.68, name: 'Body_ChamberPort_SE2' },
    { ang: -0.65, y: 0.55, rOut: 0.62, name: 'Body_ChamberPort_EDS' },
    { ang: 1.05, y: 0.35, rOut: 0.52, name: 'Body_ChamberPort_Scope' },
    { ang: -1.35, y: 0.20, rOut: 0.52, name: 'Body_ChamberPort_Gauge' },
    { ang: 2.35, y: -0.35, rOut: 0.48, name: 'Body_ChamberPort_Feedthrough' },
    { ang: -2.45, y: -0.35, rOut: 0.48, name: 'Body_ChamberPort_Vent' },
  ];
  portSpecs.forEach((ps, idx) => {
    const portAssembly = new THREE.Group();
    portAssembly.name = ps.name;
    const px = Math.sin(ps.ang) * 2.15;
    const pz = -Math.cos(ps.ang) * 2.15;
    portAssembly.position.set(px, ps.y, pz);
    portAssembly.rotation.y = -ps.ang;

    const neckTube = new THREE.Mesh(
      new THREE.CylinderGeometry(ps.rOut * 0.78, ps.rOut * 0.78, 0.55, 20),
      MAT_316SS_BRUSHED
    );
    neckTube.rotation.x = Math.PI / 2;
    portAssembly.add(neckTube);

    const cfFlange = createConFlatFlange(ps.rOut, ps.rOut * 0.45, 0.16, `Port${idx}`, 8);
    cfFlange.rotation.x = Math.PI / 2;
    cfFlange.position.z = -0.28;
    portAssembly.add(cfFlange);

    chamberGroup.add(portAssembly);
  });

  // Edwards WRG-S Wide-Range Pirani / Cold-Cathode Penning Vacuum Gauge on -X Port
  const gaugeGroup = new THREE.Group();
  gaugeGroup.name = 'Body_GaugePiraniPenning';
  gaugeGroup.position.set(-2.55, 0.20, -0.45);
  gaugeGroup.rotation.z = Math.PI / 2;
  const gaugeBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.92, 20),
    MAT_316SS_POLISHED
  );
  gaugeGroup.add(gaugeBarrel);
  const gaugeCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.31, 0.31, 0.25, 20),
    MAT_RUBBER_EPDM
  );
  gaugeCap.position.y = 0.55;
  gaugeGroup.add(gaugeCap);
  chamberGroup.add(gaugeGroup);

  // Hinged Specimen Chamber Front Door (Pivot_DoorChamber) with Lead-Glass Viewport & Viton O-Ring
  const doorPivot = new THREE.Group();
  doorPivot.name = 'Pivot_DoorChamber';
  doorPivot.position.set(-1.95, 0.0, -2.05);

  const doorPlate = new THREE.Mesh(
    new THREE.BoxGeometry(3.85, 3.25, 0.34),
    MAT_316SS_POLISHED
  );
  doorPlate.position.set(1.95, 0.0, -0.18);
  doorPivot.add(doorPlate);

  // Molded Viton Fluoroelastomer O-Ring Groove on inside face of Chamber Door
  const vitonORing = new THREE.Mesh(
    new THREE.TorusGeometry(1.38, 0.045, 14, 40),
    MAT_RUBBER_EPDM
  );
  vitonORing.position.set(1.95, 0.0, 0.02);
  vitonORing.name = 'Body_DoorVitonORing';
  doorPivot.add(vitonORing);

  // 25 mm Thick Leaded Borosilicate Glass Viewport Window (Glass_ViewportChamber - Gate 1 TAX-04)
  const viewportFrame = createConFlatFlange(0.92, 0.62, 0.16, 'Viewport', 12);
  viewportFrame.rotation.x = Math.PI / 2;
  viewportFrame.position.set(1.95, 0.22, -0.40);
  doorPivot.add(viewportFrame);

  const viewportGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.64, 0.64, 0.14, 32),
    MAT_LEAD_GLASS
  );
  viewportGlass.rotation.x = Math.PI / 2;
  viewportGlass.position.set(1.95, 0.22, -0.42);
  viewportGlass.name = 'Glass_ViewportChamber';
  doorPivot.add(viewportGlass);

  // Vertical Brushed-Stainless Ergonomic Chamber Door Handle
  const handlePostTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.38, 16),
    MAT_316SS_POLISHED
  );
  handlePostTop.rotation.x = Math.PI / 2;
  handlePostTop.position.set(3.45, 0.95, -0.52);
  doorPivot.add(handlePostTop);

  const handlePostBot = handlePostTop.clone();
  handlePostBot.position.set(3.45, -0.95, -0.52);
  doorPivot.add(handlePostBot);

  const handleBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 2.35, 20),
    MAT_BLUE_ANODIZED
  );
  handleBar.position.set(3.45, 0.0, -0.72);
  handleBar.name = 'Body_DoorHandleBar';
  doorPivot.add(handleBar);

  // Safety Interlock Plunger Microswitch on Chamber Door Frame
  const doorMicroswitch = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.32, 0.18),
    MAT_HV_EPOXY_RED
  );
  doorMicroswitch.position.set(3.72, 1.35, -0.05);
  doorMicroswitch.name = 'Body_MicroswitchDoor';
  doorPivot.add(doorMicroswitch);

  // Silkscreen Caution Plaque on Chamber Door
  const doorCaution = makeSilkscreenLabelMesh(
    'UHV SPECIMEN CHAMBER · X-RAY SHIELDED',
    'DO NOT OPEN UNDER VACUUM · VENT WITH DRY N2 FIRST',
    2.45,
    0.42,
    '#0f172a',
    '#fef08a',
    '#f59e0b'
  );
  doorCaution.position.set(1.95, -1.12, -0.37);
  doorPivot.add(doorCaution);

  chamberGroup.add(doorPivot);

  // --------------------------------------------------------------------------
  // 5-Axis Motorized Eucentric Specimen Stage (ZEISS 105-mm DC Stage 349347-9013-000)
  // Mounted on inside face of door/chamber so opening the door pulls out the stage for loading!
  // --------------------------------------------------------------------------
  const stageGroup = new THREE.Group();
  stageGroup.name = 'Pivot_Stage5Axis';
  stageGroup.position.set(1.95, -0.55, 1.35);

  // Eucentric Tilt Cradle (-4° to +70°)
  const tiltCradle = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 0.28, 1.85),
    MAT_316SS_POLISHED
  );
  tiltCradle.name = 'Body_StageTiltCradle';
  stageGroup.add(tiltCradle);

  // Crossed-Roller X/Y Linear Translation Table (105 mm x 105 mm range)
  const xyCarriage = new THREE.Mesh(
    new THREE.BoxGeometry(1.55, 0.24, 1.55),
    MAT_DARK_ANODIZED
  );
  xyCarriage.position.y = 0.26;
  xyCarriage.name = 'Body_StageXYCarriage';
  stageGroup.add(xyCarriage);

  // DC Servo Motor + Precision Ball-Screw driving X/Y Stage (Body_Motor_DriveStageXY - Gate 5 INT-02)
  const xyServoMotor = new THREE.Group();
  xyServoMotor.name = 'Body_Motor_DriveStageXY';
  xyServoMotor.userData.validatorToken = 'Motor_Drive';
  xyServoMotor.position.set(-1.05, 0.26, 0.35);

  const servoCan = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.68, 20),
    MAT_DARK_ANODIZED
  );
  servoCan.rotation.z = Math.PI / 2;
  xyServoMotor.add(servoCan);

  const ballScrew = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.55, 14),
    MAT_316SS_POLISHED
  );
  ballScrew.rotation.z = Math.PI / 2;
  ballScrew.position.x = 0.52;
  xyServoMotor.add(ballScrew);
  stageGroup.add(xyServoMotor);

  // Motorized Vertical Z-Lift Wedge & Stepper Actuator (Body_Motor_LiftStageZ - Gate 5 INT-02)
  const zLiftMotor = new THREE.Group();
  zLiftMotor.name = 'Body_Motor_LiftStageZ';
  zLiftMotor.userData.validatorToken = 'Motor_Lift';
  zLiftMotor.position.set(0.0, 0.52, 0.0);

  const zCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.66, 0.36, 24),
    MAT_316SS_BRUSHED
  );
  zLiftMotor.add(zCylinder);

  const zStepper = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.34, 0.38),
    MAT_DARK_ANODIZED
  );
  zStepper.position.set(0.68, -0.05, 0.0);
  zLiftMotor.add(zStepper);

  // 9-Position Aluminum Specimen Carousel Holder (Body_SpecimenCarousel)
  const carouselGroup = new THREE.Group();
  carouselGroup.name = 'Body_SpecimenCarousel';
  carouselGroup.position.y = 0.28;

  const carouselPlatter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.76, 0.72, 0.14, 32),
    MAT_316SS_POLISHED
  );
  carouselGroup.add(carouselPlatter);

  // Center Faraday Cup Aperture for Probe Current Measurement
  const faradayCup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.16, 20),
    MAT_BRASS_GOLD
  );
  faradayCup.position.y = 0.05;
  faradayCup.name = 'Body_FaradayCup';
  carouselGroup.add(faradayCup);

  // 6 Mounted Ø12.7 mm Aluminum Pin Stubs with distinct specimen geometries
  const stubColors = [
    0xd4af37, // 0: Drosophila Ommatidia (Au/Pd sputter-coated gold)
    0x1e293b, // 1: Hibiscus Pollen on conductive carbon tape
    0x2563eb, // 2: Morpho Butterfly photonic wing scale
    0x334155, // 3: 5 nm FinFET Cleaved Silicon Wafer die
    0xe2e8f0, // 4: ZnO Tetrapod Nanowires
    0x94a3b8, // 5: Polished Al-Cu-Mg-Si Aerospace Alloy
  ];
  stubColors.forEach((colHex, idx) => {
    const ang = (idx / 6) * Math.PI * 2;
    const sr = 0.48;
    const stubGrp = new THREE.Group();
    stubGrp.name = `Body_SpecimenStub_0${idx + 1}`;
    stubGrp.position.set(Math.cos(ang) * sr, 0.12, Math.sin(ang) * sr);

    const pinStub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.10, 20),
      MAT_316SS_POLISHED
    );
    stubGrp.add(pinStub);

    const sampleMount = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.11, 0.05, 20),
      makeMat(colHex, { r: 0.30, m: idx === 0 || idx === 5 ? 0.85 : 0.25 })
    );
    sampleMount.position.y = 0.07;
    stubGrp.add(sampleMount);

    carouselGroup.add(stubGrp);
  });

  zLiftMotor.add(carouselGroup);
  stageGroup.add(zLiftMotor);

  // Flexible Kapton Ribbon Cable connecting 5-axis stage motors/encoders to chamber wall
  stageGroup.add(
    makeWiringHarness(
      [
        [-0.85, 0.15, 0.20],
        [-1.35, -0.15, 0.55],
        [-1.65, -0.25, 0.95],
      ],
      0.028,
      MAT_TOROID_COIL,
      'Body_Wire_StageRibbon'
    )
  );

  doorPivot.add(stageGroup);

  return { chamberGroup, doorPivot, stageGroup, carouselGroup };
}

// ----------------------------------------------------------------------------
// ZEISS Gemini II Electron Optical Column, FEG Gun, Ion Pump & Detectors
// ----------------------------------------------------------------------------
function buildGeminiColumnAndDetectors() {
  const columnGroup = new THREE.Group();
  columnGroup.name = 'Body_ColumnGemini';
  columnGroup.position.set(-4.15, 14.55, -0.20);

  // Outer Mu-Metal Magnetic Shielding Barrel (Ø 260 mm, H 620 mm)
  const lowerColumnBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.32, 1.38, 3.10, 32),
    MAT_ZEISS_WHITE
  );
  lowerColumnBarrel.position.y = -1.45;
  lowerColumnBarrel.name = 'Body_ColumnLowerBarrel';
  columnGroup.add(lowerColumnBarrel);

  const upperColumnBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.24, 1.32, 2.85, 32),
    MAT_ZEISS_WHITE
  );
  upperColumnBarrel.position.y = 1.65;
  upperColumnBarrel.name = 'Body_ColumnUpperBarrel';
  columnGroup.add(upperColumnBarrel);

  // Blue Anodized ZEISS Gemini II Column Accent Ring
  const columnRing = new THREE.Mesh(
    new THREE.CylinderGeometry(1.36, 1.36, 0.24, 32),
    MAT_BLUE_ANODIZED
  );
  columnRing.position.y = 0.15;
  columnGroup.add(columnRing);

  const columnBadge = makeSilkscreenLabelMesh(
    'ZEISS GEMINI II OPTICS',
    'BEAM BOOSTER +8 kV · MAGNETIC-ELECTROSTATIC OBJECTIVE',
    1.85,
    0.42,
    '#0f172a',
    '#f8fafc',
    '#38bdf8'
  );
  columnBadge.position.set(0, 0.65, -1.36);
  columnGroup.add(columnBadge);

  // Top Schottky Field Emission Gun (FEG) Head & High-Voltage Insulator Dome (Y = +3.1 to +4.2 local)
  const fegGroup = new THREE.Group();
  fegGroup.name = 'Body_GunHeadFEG';
  fegGroup.position.y = 3.45;

  const fegFlange = createConFlatFlange(1.28, 0.75, 0.22, 'FEGHead', 12);
  fegFlange.position.y = -0.28;
  fegGroup.add(fegFlange);

  const fegCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.18, 0.85, 28),
    MAT_316SS_POLISHED
  );
  fegCap.position.y = 0.25;
  fegGroup.add(fegCap);

  const fegCeramicCone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.55, 0.45, 24),
    MAT_ALUMINA_CERAMIC
  );
  fegCeramicCone.position.y = 0.88;
  fegGroup.add(fegCeramicCone);
  columnGroup.add(fegGroup);

  // 25 L/s Sputter Ion Getter Pump (IGP) maintaining 10^-10 mbar in FEG Gun
  const igpGroup = new THREE.Group();
  igpGroup.name = 'Body_IonGetterPump';
  igpGroup.position.set(1.65, 2.35, 0.0);

  const igpNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.85, 20),
    MAT_316SS_BRUSHED
  );
  igpNeck.rotation.z = Math.PI / 2;
  igpNeck.position.x = -0.35;
  igpGroup.add(igpNeck);

  const igpYoke = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 1.25, 0.95),
    MAT_DARK_ANODIZED
  );
  igpGroup.add(igpYoke);

  const igpLabel = makeSilkscreenLabelMesh(
    'ION GETTER PUMP',
    '25 L/s · 2.0e-10 mbar GUN UHV',
    0.85,
    0.34,
    '#0f172a',
    '#22c55e',
    '#16a34a'
  );
  igpLabel.position.set(0, 0.10, -0.49);
  igpGroup.add(igpLabel);
  columnGroup.add(igpGroup);

  // Pneumatic Column Isolation Gate Valve between FEG Gun and Lower Column
  const gateValve = new THREE.Group();
  gateValve.name = 'Body_ValveColumnGate';
  gateValve.position.set(-1.45, 0.85, 0.0);

  const valveBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.42, 0.85),
    MAT_316SS_POLISHED
  );
  gateValve.add(valveBody);

  const actuatorCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.65, 20),
    MAT_BLUE_ANODIZED
  );
  actuatorCyl.rotation.z = Math.PI / 2;
  actuatorCyl.position.x = -0.58;
  gateValve.add(actuatorCyl);
  columnGroup.add(gateValve);

  // --------------------------------------------------------------------------
  // Internal Cutaway Electron Optics Assembly (Exposed when Cutaway / Explode active)
  // --------------------------------------------------------------------------
  const opticsInternal = new THREE.Group();
  opticsInternal.name = 'Body_InternalColumnOptics';

  // +8 kV Electrostatic Beam Booster Liner Tube running down the column axis
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

  // Annular In-Lens Secondary Electron Detector Scintillator Ring inside Column
  const inLensRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.09, 16, 28),
    makeMat(0x38bdf8, { r: 0.20, m: 0.30, e: 0x0284c7, ei: 0.65 })
  );
  inLensRing.rotation.x = Math.PI / 2;
  inLensRing.position.y = -2.35;
  inLensRing.name = 'Body_DetectorInLens';
  opticsInternal.add(inLensRing);

  // Conical Gemini Magnetic-Electrostatic Objective Lens Polepiece projecting into UHV Chamber
  const objectiveCone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.96, 0.34, 1.15, 28),
    MAT_316SS_POLISHED
  );
  objectiveCone.position.y = -3.45;
  objectiveCone.name = 'Body_ObjectivePolepiece';
  opticsInternal.add(objectiveCone);

  // Dynamic Translucent Cyan Electron Beam & Raster Scan Cone (Body_ElectronBeamCone)
  const beamCone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.22, 1.35, 24, 1, true),
    MAT_ELECTRON_BEAM
  );
  beamCone.position.y = -4.55;
  beamCone.name = 'Body_ElectronBeamCone';
  opticsInternal.add(beamCone);

  columnGroup.add(opticsInternal);

  // --------------------------------------------------------------------------
  // Chamber-Mounted Analytical Detectors, Optical Mirror & PT100 Thermal Sensor
  // --------------------------------------------------------------------------
  // 1. Everhart-Thornley SE2 Secondary Electron Detector (+300 V Collector Cage + PMT)
  const se2Group = new THREE.Group();
  se2Group.name = 'Body_DetectorSE2';
  se2Group.position.set(1.85, -4.35, -1.55);
  se2Group.rotation.y = -0.55;

  const se2Barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.42, 1.35, 24),
    MAT_316SS_BRUSHED
  );
  se2Barrel.rotation.z = Math.PI / 2;
  se2Group.add(se2Barrel);

  const faradayCage = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.28, 0.55, 16),
    MAT_BRASS_GOLD
  );
  faradayCage.rotation.z = Math.PI / 2;
  faradayCage.position.x = -0.88;
  se2Group.add(faradayCage);
  columnGroup.add(se2Group);

  // 2. Motorized Retractable 4-Quadrant Solid-State Backscattered Electron Detector (Pivot_DetectorBSE)
  const bseGroup = new THREE.Group();
  bseGroup.name = 'Pivot_DetectorBSE';
  bseGroup.position.set(0.65, -4.08, -0.45);

  const bseArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.08, 0.28),
    MAT_316SS_POLISHED
  );
  bseGroup.add(bseArm);

  const bseDiodeRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.06, 24),
    MAT_BRASS_GOLD
  );
  bseDiodeRing.position.x = -0.55;
  bseGroup.add(bseDiodeRing);
  columnGroup.add(bseGroup);

  // 3. 60 mm² Silicon Drift Detector (SDD) EDS X-Ray Spectrometer (Body_DetectorEDS)
  const edsGroup = new THREE.Group();
  edsGroup.name = 'Body_DetectorEDS';
  edsGroup.position.set(-1.95, -4.25, -1.65);
  edsGroup.rotation.y = 0.62;

  const edsHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.54, 0.58, 1.45, 24),
    MAT_BLUE_ANODIZED
  );
  edsHousing.rotation.z = Math.PI / 2;
  edsGroup.add(edsHousing);

  const edsCollimatorSnout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.24, 0.95, 20),
    MAT_316SS_POLISHED
  );
  edsCollimatorSnout.rotation.z = -Math.PI / 2;
  edsCollimatorSnout.position.x = 1.05;
  edsGroup.add(edsCollimatorSnout);

  const edsLabel = makeSilkscreenLabelMesh(
    '60 mm² SDD EDS',
    '123 eV Mn-Ka · LN2-FREE PELTIER',
    0.95,
    0.32,
    '#0f172a',
    '#f8fafc',
    '#38bdf8'
  );
  edsLabel.position.set(0, 0.15, -0.60);
  edsGroup.add(edsLabel);
  columnGroup.add(edsGroup);

  // 4. Internal 45° Optical Relay Mirror & IR Chamberscope (Gate 5 INT-03: Mirror_OpticalRelay)
  const mirrorGroup = new THREE.Group();
  mirrorGroup.name = 'Body_Mirror_OpticalRelay';
  mirrorGroup.userData.validatorToken = 'Mirror_OpticalRelay';
  mirrorGroup.position.set(1.25, -4.45, 1.15);

  const mirrorBracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.38, 0.32),
    MAT_DARK_ANODIZED
  );
  mirrorGroup.add(mirrorBracket);

  const opticalMirrorPlane = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.04, 24),
    MAT_BRASS_GOLD
  );
  opticalMirrorPlane.rotation.z = Math.PI / 4;
  opticalMirrorPlane.position.x = -0.18;
  mirrorGroup.add(opticalMirrorPlane);
  columnGroup.add(mirrorGroup);

  // 5. Class-A PT100 Platinum RTD Thermal Probe on Objective Lens Water Jacket (Gate 5 INT-03: Sensor_PT100)
  const pt100Group = new THREE.Group();
  pt100Group.name = 'Body_Sensor_PT100';
  pt100Group.userData.validatorToken = 'Sensor_PT100';
  pt100Group.position.set(0.85, -3.15, 0.65);

  const pt100Sheath = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.55, 14),
    MAT_316SS_POLISHED
  );
  pt100Sheath.rotation.z = Math.PI / 2;
  pt100Group.add(pt100Sheath);

  const pt100Nut = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.14, 6),
    MAT_BRASS_GOLD
  );
  pt100Nut.rotation.z = Math.PI / 2;
  pt100Nut.position.x = 0.22;
  pt100Group.add(pt100Nut);
  columnGroup.add(pt100Group);

  // 6. Shielded BNC Coax & PT100 Sensor Harnesses routed to Motherboard
  columnGroup.add(
    makeWiringHarness(
      [
        [1.85, -4.35, -1.55],
        [2.25, -5.85, -0.85],
        [2.00, -10.20, -1.35],
      ],
      0.030,
      MAT_RUBBER_EPDM,
      'Body_Wire_DetectorCoax'
    )
  );
  columnGroup.add(
    makeWiringHarness(
      [
        [0.85, -3.15, 0.65],
        [1.55, -6.20, 0.25],
        [2.00, -10.20, -1.45],
      ],
      0.026,
      MAT_COOLANT_BLUE,
      'Body_Wire_SensorBus'
    )
  );

  return {
    columnGroup,
    lowerColumnBarrel,
    upperColumnBarrel,
    opticsInternal,
    beamCone,
    se2Group,
    bseGroup,
    edsGroup,
    mirrorGroup,
    pt100Group,
  };
}

// ----------------------------------------------------------------------------
// Operator Console Desk, Dual 27" UI_LCD Monitors, ZEISS Rotary Panel & Joysticks
// ----------------------------------------------------------------------------
function buildOperatorConsoleAndControls(screenTex) {
  const consoleGroup = new THREE.Group();
  consoleGroup.name = 'Body_ConsoleDesk';
  consoleGroup.position.set(4.50, 0.0, 0.0);

  // Ergonomic Phenolic-Top Operator Desk (X = -3.8..+4.0 local -> +0.7..+8.5 world, Y = 7.50)
  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(7.80, 0.32, 6.80),
    MAT_CONSOLE_DESK
  );
  deskTop.position.set(0.0, 7.34, 0.0);
  deskTop.name = 'Body_ConsoleTabletop';
  consoleGroup.add(deskTop);

  // Brushed Aluminum Front Edge Bullnose Trim
  const deskEdgeTrim = new THREE.Mesh(
    new THREE.BoxGeometry(7.82, 0.34, 0.08),
    MAT_316SS_BRUSHED
  );
  deskEdgeTrim.position.set(0.0, 7.34, -3.42);
  consoleGroup.add(deskEdgeTrim);

  // 2 Heavy-Duty C-Channel Steel Desk Legs + 4 Desk Leveling Feet at Y = 0.0
  [-3.45, 3.45].forEach((lx, idx) => {
    const legPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 7.05, 0.85),
      MAT_ZEISS_ANTHRACITE
    );
    legPillar.position.set(lx, 3.65, 0.20);
    legPillar.name = `Body_ConsoleLeg_0${idx + 1}`;
    consoleGroup.add(legPillar);

    const footRunner = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.24, 5.80),
      MAT_ZEISS_ANTHRACITE
    );
    footRunner.position.set(lx, 0.22, 0.0);
    consoleGroup.add(footRunner);

    [-2.55, 2.55].forEach((fz, fIdx) => {
      const deskFoot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.24, 0.10, 20),
        MAT_RUBBER_EPDM
      );
      deskFoot.position.set(lx, 0.05, fz);
      deskFoot.name = `Foot_Leveling_Desk_${idx}_${fIdx}`;
      consoleGroup.add(deskFoot);
    });
  });

  // Under-Desk ZEISS SmartSEM Workstation Tower PC (Body_WorkstationPC)
  const pcTower = new THREE.Group();
  pcTower.name = 'Body_WorkstationPC';
  pcTower.position.set(2.35, 2.35, 0.65);

  const pcCase = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 4.30, 4.20),
    MAT_DARK_ANODIZED
  );
  pcTower.add(pcCase);

  const pcFrontBezel = makeSilkscreenLabelMesh(
    'ZEISS SmartSEM WORKSTATION',
    'INTEL XEON · DUAL GPU · 64GB ECC · RAID-1 NVMe',
    1.55,
    0.55,
    '#0f172a',
    '#38bdf8',
    '#22c55e'
  );
  pcFrontBezel.position.set(0, 1.45, -2.12);
  pcTower.add(pcFrontBezel);
  consoleGroup.add(pcTower);

  // --------------------------------------------------------------------------
  // Dual 27-Inch 4K Operator Displays on Articulated Dual-Arm VESA Stand
  // --------------------------------------------------------------------------
  const standBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.20, 0.14, 1.45),
    MAT_DARK_ANODIZED
  );
  standBase.position.set(0.0, 7.57, 1.55);
  consoleGroup.add(standBase);

  const standPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.24, 2.85, 24),
    MAT_316SS_BRUSHED
  );
  standPost.position.set(0.0, 8.95, 1.65);
  consoleGroup.add(standPost);

  // Left Primary Live SEM Micrograph Monitor (UI_LCD - Gate 1 TAX-02 & Gate 3 DSP-01)
  const leftMonGroup = new THREE.Group();
  leftMonGroup.name = 'Body_MonitorLeftBezel';
  leftMonGroup.position.set(-1.92, 9.85, 0.85);
  leftMonGroup.rotation.y = -0.10;

  const leftHousing = new THREE.Mesh(
    new THREE.BoxGeometry(3.68, 2.32, 0.18),
    MAT_DARK_ANODIZED
  );
  leftMonGroup.add(leftHousing);

  // Carved Recessed Bezel Pocket (Z = -0.095) so UI_LCD sits at Z = -0.092 with Glass_DisplayCover at Z = -0.102
  const lcdGeo = makeOperatorFacingQuadGeo(3.46, 2.08);
  let lcdMat;
  if (screenTex) {
    screenTex.flipY = false;
    screenTex.colorSpace = THREE.SRGBColorSpace;
    lcdMat = new THREE.MeshBasicMaterial({ map: screenTex });
  } else {
    lcdMat = new THREE.MeshBasicMaterial({ color: 0x05070a });
  }
  const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.name = 'UI_LCD';
  lcdMesh.position.set(0.0, 0.04, -0.094);
  leftMonGroup.add(lcdMesh);

  // Refractive Anti-Reflective Display Cover Glass (Glass_DisplayCover - Gate 1 TAX-04)
  const leftCoverGlass = new THREE.Mesh(
    new THREE.BoxGeometry(3.50, 2.12, 0.012),
    MAT_DISPLAY_GLASS
  );
  leftCoverGlass.name = 'Glass_DisplayCover';
  leftCoverGlass.position.set(0.0, 0.04, -0.104);
  leftMonGroup.add(leftCoverGlass);

  consoleGroup.add(leftMonGroup);

  // Right Secondary Monitor: Live IR Chamberscope + EDS X-Ray Spectrum + Vacuum Diagram
  const rightMonGroup = new THREE.Group();
  rightMonGroup.name = 'Body_MonitorRightBezel';
  rightMonGroup.position.set(1.92, 9.85, 0.85);
  rightMonGroup.rotation.y = 0.10;

  const rightHousing = new THREE.Mesh(
    new THREE.BoxGeometry(3.68, 2.32, 0.18),
    MAT_DARK_ANODIZED
  );
  rightMonGroup.add(rightHousing);

  const chamberscopeCanvas = createCanvas(512, 320);
  const chamberscopeTex = new THREE.CanvasTexture(chamberscopeCanvas);
  chamberscopeTex.flipY = false;
  chamberscopeTex.colorSpace = THREE.SRGBColorSpace;

  const rightLcdGeo = makeOperatorFacingQuadGeo(3.46, 2.08);
  const rightLcdMesh = new THREE.Mesh(
    rightLcdGeo,
    new THREE.MeshBasicMaterial({ map: chamberscopeTex })
  );
  rightLcdMesh.name = 'UI_LCD_ChamberScope';
  rightLcdMesh.position.set(0.0, 0.04, -0.094);
  rightMonGroup.add(rightLcdMesh);

  const rightCoverGlass = new THREE.Mesh(
    new THREE.BoxGeometry(3.50, 2.12, 0.012),
    MAT_DISPLAY_GLASS
  );
  rightCoverGlass.name = 'Glass_DisplayCover_Right';
  rightCoverGlass.position.set(0.0, 0.04, -0.104);
  rightMonGroup.add(rightCoverGlass);

  consoleGroup.add(rightMonGroup);

  // --------------------------------------------------------------------------
  // Authentic ZEISS Dual-Rotary Control Panel (Doc. 349500-8038-000)
  // 8 Knurled Aluminum Rotary Encoders + 8 Illuminated Tactile Pushbuttons
  // --------------------------------------------------------------------------
  const rotaryPanelGroup = new THREE.Group();
  rotaryPanelGroup.name = 'Body_RotaryControlPanel';
  rotaryPanelGroup.position.set(-1.65, 7.62, -1.65);
  rotaryPanelGroup.rotation.x = 0.14; // Ergonomic 8° tilt toward operator

  const panelWedge = new THREE.Mesh(
    new THREE.BoxGeometry(3.35, 0.24, 1.85),
    MAT_ZEISS_WHITE
  );
  rotaryPanelGroup.add(panelWedge);

  // 8 Knurled Aluminum Rotary Encoders (Knob_*) with >= 3.5 mm physical separation
  const knobSpecs = [
    { name: 'Knob_Magnification', text: 'MAGNIFICATION', x: -1.25, z: -0.32 },
    { name: 'Knob_FocusWD', text: 'FOCUS / WD', x: -0.42, z: -0.32 },
    { name: 'Knob_Brightness', text: 'BRIGHTNESS', x: 0.42, z: -0.32 },
    { name: 'Knob_Contrast', text: 'CONTRAST', x: 1.25, z: -0.32 },
    { name: 'Knob_StigmatorX', text: 'STIGMATOR X', x: -1.25, z: 0.42 },
    { name: 'Knob_StigmatorY', text: 'STIGMATOR Y', x: -0.42, z: 0.42 },
    { name: 'Knob_ShiftX', text: 'BEAM SHIFT X', x: 0.42, z: 0.42 },
    { name: 'Knob_ShiftY', text: 'BEAM SHIFT Y', x: 1.25, z: 0.42 },
  ];
  const knobMeshes = {};
  knobSpecs.forEach(ks => {
    const knobGrp = new THREE.Group();
    knobGrp.name = ks.name;
    knobGrp.position.set(ks.x, 0.18, ks.z);
    knobGrp.userData.interactiveType = 'knob';
    knobGrp.userData.controlId = ks.name;

    const dialSkirt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.26, 0.08, 28),
      MAT_DARK_ANODIZED
    );
    knobGrp.add(dialSkirt);

    const knurlCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.19, 0.16, 28),
      MAT_316SS_POLISHED
    );
    knurlCap.position.y = 0.10;
    knobGrp.add(knurlCap);

    // White index pointer line on top of rotary knob
    const indexTick = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.02, 0.14),
      MAT_BLUE_ANODIZED
    );
    indexTick.position.set(0, 0.19, -0.04);
    knobGrp.add(indexTick);

    rotaryPanelGroup.add(knobGrp);
    knobMeshes[ks.name] = knobGrp;
  });

  // 8 Illuminated Tactile Pushbuttons (Btn_*) with procedural silkscreen labels via fillText(bc.text)
  const buttonConfigs = [
    { name: 'Btn_Power', text: 'STANDBY', x: -1.42, z: -0.74, col: 0x22c55e },
    { name: 'Btn_EHT', text: 'EHT ON', x: -1.02, z: -0.74, col: 0xef4444 },
    { name: 'Btn_VacVent', text: 'VAC / VENT', x: -0.62, z: -0.74, col: 0x38bdf8 },
    { name: 'Btn_AutoFocus', text: 'AUTO WD', x: -0.22, z: -0.74, col: 0x0284c7 },
    { name: 'Btn_AutoBC', text: 'AUTO B/C', x: 0.22, z: -0.74, col: 0x0284c7 },
    { name: 'Btn_ScanSpeed', text: 'SCAN SPD', x: 0.62, z: -0.74, col: 0x6366f1 },
    { name: 'Btn_Freeze', text: 'FREEZE', x: 1.02, z: -0.74, col: 0xf59e0b },
    { name: 'Btn_Record', text: 'PHOTO', x: 1.42, z: -0.74, col: 0x10b981 },
  ];
  const buttonMeshes = {};
  buttonConfigs.forEach(bc => {
    const btnGrp = new THREE.Group();
    btnGrp.name = bc.name;
    btnGrp.position.set(bc.x, 0.15, bc.z);
    btnGrp.userData.interactiveType = 'button';
    btnGrp.userData.controlId = bc.name;

    const btnCap = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.08, 0.22),
      makeMat(bc.col, { r: 0.28, m: 0.18, e: bc.col, ei: 0.35 })
    );
    btnGrp.add(btnCap);

    // High-DPI Procedural Silkscreen Button Cap Typography (Gate 3 DSP-03: fillText(bc.text))
    const btnCan = createCanvas(160, 96);
    const bCtx = btnCan.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = '#0f172a';
      bCtx.fillRect(0, 0, 160, 96);
      bCtx.strokeStyle = '#38bdf8';
      bCtx.lineWidth = 4;
      bCtx.strokeRect(4, 4, 152, 88);
      bCtx.fillStyle = '#f8fafc';
      bCtx.font = 'bold 24px Inter, Arial, sans-serif';
      bCtx.textAlign = 'center';
      bCtx.textBaseline = 'middle';
      bCtx.fillText(bc.text, 80, 48);
    }
    const btnTex = new THREE.CanvasTexture(btnCan);
    btnTex.flipY = false;
    btnTex.colorSpace = THREE.SRGBColorSpace;
    const capDecal = createDecalQuad(
      0.28,
      0.18,
      new THREE.MeshBasicMaterial({ map: btnTex })
    );
    capDecal.rotation.x = -Math.PI / 2;
    capDecal.position.y = 0.044;
    btnGrp.add(capDecal);

    rotaryPanelGroup.add(btnGrp);
    buttonMeshes[bc.name] = btnGrp;
  });

  consoleGroup.add(rotaryPanelGroup);

  // --------------------------------------------------------------------------
  // Authentic ZEISS Dual-Joystick 5-Axis Stage Control Box (Body_DualJoystickBox)
  // --------------------------------------------------------------------------
  const joystickBox = new THREE.Group();
  joystickBox.name = 'Body_DualJoystickBox';
  joystickBox.position.set(1.85, 7.62, -1.65);

  const joyHousing = new THREE.Mesh(
    new THREE.BoxGeometry(2.35, 0.26, 1.65),
    MAT_ZEISS_WHITE
  );
  joystickBox.add(joyHousing);

  // Left Z / Tilt Proportional Hall-Effect Joystick (Pivot_JoystickLeftZ)
  const joyLeft = new THREE.Group();
  joyLeft.name = 'Pivot_JoystickLeftZ';
  joyLeft.position.set(-0.62, 0.16, 0.05);

  const bootLeft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.26, 0.18, 20),
    MAT_RUBBER_EPDM
  );
  joyLeft.add(bootLeft);

  const shaftLeft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.48, 16),
    MAT_316SS_POLISHED
  );
  shaftLeft.position.y = 0.28;
  joyLeft.add(shaftLeft);

  const gripLeft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.11, 0.42, 20),
    MAT_DARK_ANODIZED
  );
  gripLeft.position.y = 0.58;
  joyLeft.add(gripLeft);
  joystickBox.add(joyLeft);

  // Right X / Y / Rotation Proportional Joystick (Pivot_JoystickRightXYR)
  const joyRight = joyLeft.clone();
  joyRight.name = 'Pivot_JoystickRightXYR';
  joyRight.position.set(0.62, 0.16, 0.05);
  joystickBox.add(joyRight);

  // Red Emergency Stage Break Stop Button (Btn_StageBreak)
  const btnBreak = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.18, 0.12, 20),
    makeMat(0xef4444, { r: 0.25, m: 0.15, e: 0xdc2626, ei: 0.45 })
  );
  btnBreak.position.set(0.0, 0.18, -0.45);
  btnBreak.name = 'Btn_StageBreak';
  joystickBox.add(btnBreak);

  consoleGroup.add(joystickBox);

  // Point-to-point DisplayPort & USB Control Harnesses from Monitors/Panels through Desk Grommet to PC & SEM Motherboard
  consoleGroup.add(
    makeWiringHarness(
      [
        [-1.65, 7.55, -0.80],
        [-0.85, 7.52, 1.25],
        [1.85, 4.25, 1.45],
        [-6.65, 4.35, -1.55],
      ],
      0.036,
      MAT_RUBBER_EPDM,
      'Body_Wire_DataBus'
    )
  );

  return {
    consoleGroup,
    lcdMesh,
    rightLcdMesh,
    chamberscopeCanvas,
    chamberscopeTex,
    knobMeshes,
    buttonMeshes,
    joyLeft,
    joyRight,
  };
}

// ----------------------------------------------------------------------------
// Live Secondary Monitor (IR Chamberscope + EDS Spectrum + Vacuum Schematic)
// ----------------------------------------------------------------------------
function renderChamberScopeAndEDSCanvas(canvas, tex, state = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isPowered = state.isPluggedIn !== false && state.powerSwitch !== false;
  if (!isPowered) {
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    tex.needsUpdate = true;
    return;
  }

  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 512, 320);

  // Top Header Bar
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 34);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 14px Inter, monospace';
  ctx.fillText('ZEISS SmartSEM · IR CHAMBERSCOPE + SDD EDS SPECTROMETER', 12, 22);

  // Left Pane: Live IR CCD Chamberscope View (x: 12..246, y: 44..204)
  ctx.fillStyle = '#05070a';
  ctx.fillRect(12, 44, 234, 160);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 44, 234, 160);

  // Draw Gemini Objective Polepiece Cone & Eucentric Stage inside IR View
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(85, 46);
  ctx.lineTo(175, 46);
  ctx.lineTo(148, 96);
  ctx.lineTo(112, 96);
  ctx.closePath();
  ctx.fill();

  const wdMm = Number.isFinite(state.wdMm) ? state.wdMm : 8.5;
  const stageY = Math.min(182, Math.max(108, 96 + wdMm * 4.5));
  const stageX = 130 + (state.stageX || 0) * 0.6;

  // Electron beam ray in IR chamberscope if EHT is ON
  if (state.beamOn) {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(130, 96);
    ctx.lineTo(stageX, stageY);
    ctx.stroke();
  }

  // Specimen Carousel & Pin Stub
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(stageX - 42, stageY + 6, 84, 14);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(stageX - 12, stageY, 24, 6);

  ctx.fillStyle = '#22c55e';
  ctx.font = '11px monospace';
  ctx.fillText(`IR CCD · WD = ${wdMm.toFixed(1)} mm`, 20, 62);
  ctx.fillText(
    `X:${(state.stageX || 0).toFixed(1)} Y:${(state.stageY || 0).toFixed(1)} T:${(state.stageTilt || 0).toFixed(0)}°`,
    20,
    194
  );

  // Right Pane: SDD EDS Characteristic X-Ray Spectrum (x: 258..500, y: 44..204)
  ctx.fillStyle = '#05070a';
  ctx.fillRect(258, 44, 242, 160);
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(258, 44, 242, 160);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '11px monospace';
  ctx.fillText('60mm² SDD EDS SPECTRUM (0-10 keV)', 266, 62);

  // Draw EDS Bremsstrahlung baseline + characteristic X-ray peaks
  const peaks = state.edsPeaks || [
    { keV: 0.28, el: 'C', cps: 420 },
    { keV: 0.52, el: 'O', cps: 680 },
    { keV: 1.49, el: 'Al', cps: 920 },
    { keV: 1.74, el: 'Si', cps: 1150 },
    { keV: 2.12, el: 'Au', cps: 1380 },
    { keV: 8.04, el: 'Cu', cps: 540 },
  ];
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  for (let px = 0; px <= 220; px++) {
    const kev = (px / 220) * 10.0;
    let yVal = 8 * Math.exp(-kev * 0.25);
    peaks.forEach(pk => {
      const d = (kev - pk.keV) / 0.14;
      yVal += (pk.cps / 1500) * 95 * Math.exp(-0.5 * d * d);
    });
    const sy = 192 - Math.min(115, yVal);
    if (px === 0) ctx.moveTo(268 + px, sy);
    else ctx.lineTo(268 + px, sy);
  }
  ctx.stroke();

  peaks.forEach(pk => {
    const lx = 268 + (pk.keV / 10.0) * 220;
    ctx.fillStyle = '#fef08a';
    ctx.font = '10px monospace';
    ctx.fillText(pk.el, lx - 6, 86);
  });

  // Bottom Pane: UHV Vacuum & High-Voltage Telemetry Strip (y: 214..308)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(12, 214, 488, 94);
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(12, 214, 488, 94);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px monospace';
  const vacMbar = state.chamberVacuumMbar || 1.4e-6;
  const ehtKv = state.ehtKv || 15.0;
  ctx.fillText(`CHAMBER VAC: ${vacMbar.toExponential(2)} mbar`, 24, 240);
  ctx.fillText(`FEG GUN UHV: 2.00e-10 mbar (IGP ON)`, 24, 264);
  ctx.fillText(`TURBO PUMP : 90,000 RPM (100% NOMINAL)`, 24, 288);

  ctx.fillStyle = state.beamOn ? '#22c55e' : '#f59e0b';
  ctx.fillText(`EHT BEAM   : ${state.beamOn ? `${ehtKv.toFixed(2)} kV ACTIVE` : 'STANDBY OFF'}`, 276, 240);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`BOOSTER    : +8.00 kV LINER ACTIVE`, 276, 264);
  ctx.fillText(`OBJ TEMP   : 20.4 °C (PT100 CHILLER OK)`, 276, 288);

  tex.needsUpdate = true;
}

// ----------------------------------------------------------------------------
// Master Builder & Twin Runtime API (Standalone & Docked Lab Viewer Compatible)
// ----------------------------------------------------------------------------
export function buildSEMModel(tex = null, options = {}) {
  const root = new THREE.Group();
  root.name = 'Body_SEM_Complete';

  // 1. Optional Dedicated VC-E Electron Microscopy Suite Room (gated for standalone mode)
  let labRoomGroup = null;
  if (options.includeLab !== false) {
    labRoomGroup = buildVCELabRoom();
    root.add(labRoomGroup);
  }

  // 2. Instrument Group (Plinth + UHV Chamber + Gemini II Column + Electronics + Console)
  const instrumentGroup = new THREE.Group();
  instrumentGroup.name = 'Body_SEM_InstrumentAssembly';
  root.add(instrumentGroup);

  const { powerGroup, plugGroup, cordPlugged } = buildPowerContinuityAssembly();
  instrumentGroup.add(powerGroup);

  const { internalGroup, turboGroup, scrollGroup, hvTankGroup, psuGroup, moboGroup, bulkheadGroup } =
    buildInternalMechanicsAndElectronicsBay();
  instrumentGroup.add(internalGroup);

  const { chassisGroup, serviceDoorPivot } = buildPlinthAndChassis();
  instrumentGroup.add(chassisGroup);

  const { chamberGroup, doorPivot, stageGroup, carouselGroup } = buildSpecimenChamberAndStage();
  instrumentGroup.add(chamberGroup);

  const {
    columnGroup,
    lowerColumnBarrel,
    upperColumnBarrel,
    opticsInternal,
    beamCone,
    se2Group,
    bseGroup,
    edsGroup,
    mirrorGroup,
    pt100Group,
  } = buildGeminiColumnAndDetectors();
  instrumentGroup.add(columnGroup);

  const {
    consoleGroup,
    lcdMesh,
    rightLcdMesh,
    chamberscopeCanvas,
    chamberscopeTex,
    knobMeshes,
    buttonMeshes,
    joyLeft,
    joyRight,
  } = buildOperatorConsoleAndControls(tex);
  instrumentGroup.add(consoleGroup);

  // Initial render of secondary monitor
  const liveScopeState = {
    isPluggedIn: true,
    powerSwitch: true,
    beamOn: true,
    wdMm: 8.5,
    ehtKv: 15.0,
    chamberVacuumMbar: 1.4e-6,
    stageX: 0,
    stageY: 0,
    stageTilt: 0,
  };
  renderChamberScopeAndEDSCanvas(chamberscopeCanvas, chamberscopeTex, liveScopeState);

  // Enable shadow casting/receiving on all instrument meshes
  instrumentGroup.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  // --------------------------------------------------------------------------
  // Kinematic Exploded-View Offsets (Gate 2: >= 100 mm / 1.0 u clean separation)
  // --------------------------------------------------------------------------
  const explodeTargets = [
    { obj: columnGroup, base: columnGroup.position.clone(), delta: new THREE.Vector3(0.0, 2.80, 0.0) },
    { obj: chamberGroup, base: chamberGroup.position.clone(), delta: new THREE.Vector3(0.0, 1.15, -0.45) },
    { obj: serviceDoorPivot, base: serviceDoorPivot.position.clone(), delta: new THREE.Vector3(-0.85, 0.0, -2.40) },
    { obj: doorPivot, base: doorPivot.position.clone(), delta: new THREE.Vector3(0.0, 0.0, -1.85) },
    { obj: turboGroup, base: turboGroup.position.clone(), delta: new THREE.Vector3(-1.35, -0.45, -0.60) },
    { obj: scrollGroup, base: scrollGroup.position.clone(), delta: new THREE.Vector3(-1.80, 0.0, 0.85) },
    { obj: hvTankGroup, base: hvTankGroup.position.clone(), delta: new THREE.Vector3(-1.95, 0.45, 1.15) },
    { obj: psuGroup, base: psuGroup.position.clone(), delta: new THREE.Vector3(1.25, 0.55, 0.65) },
    { obj: moboGroup, base: moboGroup.position.clone(), delta: new THREE.Vector3(1.15, 0.35, -1.65) },
    { obj: bulkheadGroup, base: bulkheadGroup.position.clone(), delta: new THREE.Vector3(0.0, 0.0, 1.95) },
    { obj: consoleGroup, base: consoleGroup.position.clone(), delta: new THREE.Vector3(1.65, 0.0, 0.55) },
  ];

  let currentExplode = 0;
  let currentDoorOpen = 0;
  let cutawayActive = false;

  function applyDoorAndExplodeState() {
    explodeTargets.forEach(item => {
      item.obj.position.copy(item.base).addScaledVector(item.delta, currentExplode);
    });
    // Swing service door open during explode or cutaway so internal PCB/pumps are 100% visible
    const serviceAngle = Math.max(currentExplode * 1.35, cutawayActive ? 1.45 : 0);
    serviceDoorPivot.rotation.y = -serviceAngle;
    // Swing UHV chamber door open when vented/door-open or partially during explode
    const chamberDoorAngle = Math.max(currentDoorOpen * 1.18, currentExplode * 0.75);
    doorPivot.rotation.y = -chamberDoorAngle;
  }

  function setExplodeAmount(val) {
    currentExplode = Math.max(0, Math.min(1, Number(val) || 0));
    applyDoorAndExplodeState();
  }

  function setCutawayMode(enabled) {
    cutawayActive = Boolean(enabled);
    lowerColumnBarrel.material = cutawayActive
      ? new THREE.MeshPhysicalMaterial({
          color: 0xf4f6f8,
          transparent: true,
          opacity: 0.18,
          roughness: 0.25,
          depthWrite: false,
        })
      : MAT_ZEISS_WHITE;
    upperColumnBarrel.material = lowerColumnBarrel.material;
    applyDoorAndExplodeState();
  }

  function setDoorOpen(openRatio) {
    currentDoorOpen = typeof openRatio === 'boolean' ? (openRatio ? 1 : 0) : Math.max(0, Math.min(1, Number(openRatio) || 0));
    applyDoorAndExplodeState();
  }

  function setPluggedIn(plugged) {
    const isPlugged = Boolean(plugged);
    // Physically translate NEMA 5-15P plug out of the floor box when unplugged (Gate 2 PWR-02 / DIAG-014)
    plugGroup.position.set(-2.40, isPlugged ? 1.67 : 0.45, isPlugged ? 5.56 : 4.65);
    plugGroup.rotation.x = isPlugged ? 0 : 0.85;
    liveScopeState.isPluggedIn = isPlugged;
    renderChamberScopeAndEDSCanvas(chamberscopeCanvas, chamberscopeTex, liveScopeState);
  }

  function setBeamActive(active, ehtKv = 15.0) {
    beamCone.visible = Boolean(active);
    liveScopeState.beamOn = Boolean(active);
    liveScopeState.ehtKv = ehtKv;
    renderChamberScopeAndEDSCanvas(chamberscopeCanvas, chamberscopeTex, liveScopeState);
  }

  function setStagePosition({ x = 0, y = 0, z = 8.5, tilt = 0, rot = 0, specimenIndex = 0 } = {}) {
    stageGroup.position.x = 1.95 + (x / 100) * 0.45;
    stageGroup.position.z = 1.35 + (y / 100) * 0.45;
    stageGroup.position.y = -0.35 - ((z - 8.5) / 40) * 0.35;
    stageGroup.rotation.x = (tilt * Math.PI) / 180;
    carouselGroup.rotation.y = (rot * Math.PI) / 180 - (specimenIndex / 6) * Math.PI * 2;

    // Synchronize physical joystick deflections with stage motion
    joyRight.rotation.z = -(x / 50) * 0.25;
    joyRight.rotation.x = (y / 50) * 0.25;
    joyLeft.rotation.x = ((z - 8.5) / 25) * 0.25;

    liveScopeState.wdMm = z;
    liveScopeState.stageX = x;
    liveScopeState.stageY = y;
    liveScopeState.stageTilt = tilt;
    renderChamberScopeAndEDSCanvas(chamberscopeCanvas, chamberscopeTex, liveScopeState);
  }

  function updateChamberScopeCanvas(partialState = {}) {
    Object.assign(liveScopeState, partialState);
    renderChamberScopeAndEDSCanvas(chamberscopeCanvas, chamberscopeTex, liveScopeState);
  }

  function setWireframe(enabled) {
    const wf = Boolean(enabled);
    instrumentGroup.traverse(obj => {
      if (obj.isMesh && obj.material && obj.name !== 'UI_LCD' && obj.name !== 'UI_LCD_ChamberScope') {
        obj.material.wireframe = wf;
      }
    });
  }

  // Part Explorer Catalog & Isolation Focus
  const catalogEntries = [
    {
      id: 'Body_ColumnGemini',
      label: 'Gemini II Electron Column & Beam Booster',
      category: 'Electron Optics',
      desc: 'Mu-metal shielded electron optical column with +8 kV electrostatic Beam Booster liner, dual copper condenser lenses, 8-pole stigmator, and magnetic-electrostatic objective lens.',
      node: columnGroup,
    },
    {
      id: 'Body_GunHeadFEG',
      label: 'Schottky ZrO/W Field Emission Gun & 25 L/s IGP',
      category: 'Electron Optics',
      desc: 'Ultra-high-brightness ZrO/W(100) Schottky thermal field emitter operating at 1800 K and 2.0e-10 mbar maintained by the 25 L/s Sputter Ion Getter Pump.',
      node: columnGroup,
    },
    {
      id: 'Body_ChamberUHV',
      label: '316L Stainless UHV Specimen Chamber & Door',
      category: 'Vacuum & Stage',
      desc: 'Octagonal 316L stainless-steel analytical specimen chamber with 8 ConFlat bolted flanges, hinged front door, 25 mm lead-glass viewport, and Viton O-ring seal.',
      node: chamberGroup,
    },
    {
      id: 'Pivot_Stage5Axis',
      label: '5-Axis Motorized Eucentric Stage & 9-Stub Carousel',
      category: 'Vacuum & Stage',
      desc: 'ZEISS 105-mm DC Servo / Stepper 5-axis eucentric stage (X/Y 105 mm, Z 50 mm, Tilt -4°..+70°, Rotation 360°) with 6 mounted monograph specimens and Faraday cup.',
      node: stageGroup,
    },
    {
      id: 'Body_DetectorSE2',
      label: 'InLens SE + Everhart-Thornley SE2 + 4Q-BSE + SDD EDS',
      category: 'Detectors & Sensors',
      desc: 'Multi-modal detector suite: annular In-Lens SE, Everhart-Thornley SE2 (+300 V collector cage), motorized 4-quadrant solid-state BSE, 60 mm² Peltier SDD EDS, 45° optical relay mirror, and PT100 RTD probe.',
      node: se2Group,
    },
    {
      id: 'Body_Motor_DriveTurboPump',
      label: 'Pfeiffer HiPace 300 Turbo & HiScroll 6 Dry Backing Pump',
      category: 'Vacuum & Stage',
      desc: '90,000 RPM turbomolecular pump (260 L/s) bolted to the chamber bottom DN100CF flange and backed via DN25KF stainless bellows by an oil-free dry scroll pump.',
      node: turboGroup,
    },
    {
      id: 'Body_HVTank_30kV',
      label: 'Spellman 30 kV HV Tank, Mean Well PSU & Toroid',
      category: 'Power & Electronics',
      desc: 'Potted 30,000 V DC Cockcroft-Walton high-voltage tank, Mean Well LRS-350-24 regulated switching supply, and 300 VA low-stray-field toroidal isolation transformer.',
      node: hvTankGroup,
    },
    {
      id: 'Body_PCB_Motherboard',
      label: '6-Layer FR-4 SmartSEM Motherboard, ARM MCU & Wi-Fi/BLE',
      category: 'Power & Electronics',
      desc: 'Main control PCB with 176-pin ARM Cortex-M7/FPGA scan generator, dual TSOP-54 RAM, 256 GB NVMe SSD, Wi-Fi/BLE module with rear dipole antenna, RS-232, USB, and RJ45 LAN.',
      node: moboGroup,
    },
    {
      id: 'Body_ConsoleDesk',
      label: 'Operator Console, Dual 27" 4K LCDs & ZEISS Rotary/Joystick Panels',
      category: 'Operator Console',
      desc: 'Vibration-isolated operator console with dual 27" 4K displays (UI_LCD & IR Chamberscope), ZEISS Dual-Rotary Control Panel (8 encoders + 8 illuminated buttons), and Dual-Joystick Stage Box.',
      node: consoleGroup,
    },
    {
      id: 'Body_Chassis',
      label: 'Welded Spaceframe Plinth, Pneumatic Isolators & Power Receptacle',
      category: 'Chassis & Power',
      desc: 'Cast-iron plinth on 4 knurled leveling feet at Y = 0.0, 4 active pneumatic air-spring isolators, hinged service door with Badge_SREdesigns, NEMA 5-15P plug, SJTOW cord, and hospital-grade duplex outlet.',
      node: chassisGroup,
    },
  ];

  function setExplorerFocus(partId) {
    if (!partId || partId === 'ALL') {
      instrumentGroup.traverse(obj => {
        if (obj.isMesh && obj.material) {
          obj.visible = true;
        }
      });
      return null;
    }
    const found = catalogEntries.find(e => e.id === partId);
    if (!found) return null;

    const keepSet = new Set();
    found.node.traverse(child => keepSet.add(child));
    let p = found.node.parent;
    while (p) {
      keepSet.add(p);
      p = p.parent;
    }

    instrumentGroup.traverse(obj => {
      if (obj.isMesh) {
        obj.visible = keepSet.has(obj);
      }
    });
    return found;
  }

  function getPartCatalog() {
    return catalogEntries;
  }

  function getRaycastTargets() {
    const targets = [];
    Object.values(knobMeshes).forEach(k => targets.push(k));
    Object.values(buttonMeshes).forEach(b => targets.push(b));
    targets.push(plugGroup, doorPivot, serviceDoorPivot);
    return targets;
  }

  // Attach convenience API directly onto both root and returned wrapper
  const api = {
    root,
    group: root,
    instrumentGroup,
    labRoomGroup,
    lcdMesh,
    rightLcdMesh,
    chamberscopeCanvas,
    updateChamberScopeCanvas,
    setExplodeAmount,
    setWireframe,
    setExplorerFocus,
    setCutawayMode,
    setDoorOpen,
    setPluggedIn,
    setBeamActive,
    setStagePosition,
    getPartCatalog,
    getRaycastTargets,
    knobMeshes,
    buttonMeshes,
  };
  Object.assign(root.userData, api);
  return api;
}

export default buildSEMModel;
