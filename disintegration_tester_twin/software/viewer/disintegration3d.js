/**
 * ERWEKA ZT 322 Tablet Disintegration Tester (USP <701>) 3D Engine
 * Centrifuge Gold Standard Procedural CAD, Industrial PBR Materials & Kinematic Assembly
 *
 * Authentic Industrial Electromechanical Anatomy (Zero Floating Lego Signboards):
 * - Multi-layer FR-4 Motherboard (2048x2048 procedural copper traces, gold ENIG pads, SMD passives,
 *   176-pin LQFP ARM Cortex-M4 with individual gull-wing leads, TSOP-54 SDRAM, BGA eMMC SSD,
 *   24-Bit Delta-Sigma ADC, CR2032 coin-cell retainer with phosphor-bronze spring clip,
 *   castellated Wi-Fi 802.11ac / BLE 5.2 RF shield can with U.FL micro-coax, Phoenix Contact blocks)
 * - Perforated Sheet-Metal Mean Well LRS-150-24 Switching Power Supply (honeycomb ventilated cage,
 *   internal PCB, radial bulk capacitors with K-scored aluminum tops, yellow Mylar flyback transformer,
 *   common-mode choke, extruded aluminum heatsinks, 7-position barrier strip with captive washer screws,
 *   crimp ferrules, and polycarbonate safety cover)
 * - Helical Copper-Wound 180VA Toroidal Isolation Transformer with Kapton tape band & dished top plate
 * - Crydom 25A Zero-Cross Solid-State Relay on 11-fin black anodized extruded heatsink & DIN rail
 * - Precision NEMA 17 Hybrid Stepper Lift Actuators (laminated silicon-steel stator stacks, aluminum endbells,
 *   jaw-type elastomer spider couplings, trapezoidal lead screws, and flanged bronze anti-backlash nuts)
 * - 24V BLDC Finned Servo Gearmotor + 2-Stage Planetary Gearbox + Counterbalanced Crank Flywheel + Heim Rod
 * - Routed Chassis-Dressed Wiring Harnesses with braided PET sleeving, nylon zip-ties, and crimp ferrules
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----------------------------------------------------------------------------
// Industrial PBR Material Library (1 unit = 100 mm = 1 dm)
// ----------------------------------------------------------------------------
function makeMat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.r ?? 0.38,
    metalness: opts.m ?? 0.12,
    transparent: opts.o != null && opts.o < 1.0,
    opacity: opts.o ?? 1.0,
    emissive: new THREE.Color(opts.e ?? 0x000000),
    emissiveIntensity: opts.ei ?? 0,
    side: opts.side ?? THREE.FrontSide,
    depthWrite: opts.dw ?? true
  });
}

// Procedural Brushed Metal & Copper Bump/Roughness Textures
function makeBrushedMetalTexture(baseHex = '#d8e0e8', streakHex = '#b8c4d0') {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = streakHex;
  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 600; i++) {
    const y = Math.random() * 512;
    ctx.lineWidth = 0.6 + Math.random() * 1.4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + (Math.random() - 0.5) * 3);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeToroidCopperTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#9a4612';
  ctx.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 3) {
    ctx.fillStyle = x % 6 === 0 ? '#d97706' : '#7c2d12';
    ctx.fillRect(x, 0, 2, 512);
  }
  // Amber Kapton insulation band around equator
  ctx.fillStyle = 'rgba(234, 179, 8, 0.78)';
  ctx.fillRect(0, 180, 512, 150);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('180VA ISOLATION XFMR · 115/230V -> 24VAC', 256, 262);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const TEX_BRUSHED_SS = makeBrushedMetalTexture('#e2e8f0', '#94a3b8');
const TEX_TOROID_COPPER = makeToroidCopperTexture();

// Chassis & Enclosures (ERWEKA Powder-Coated Glacier Cream & Cast Anthracite)
const MAT_CHASSIS_CREAM = makeMat(0xf1f4f8, { r: 0.28, m: 0.08 });
const MAT_CHASSIS_DARK  = makeMat(0x181f29, { r: 0.48, m: 0.28 });
const MAT_CAST_IRON     = makeMat(0x262f3d, { r: 0.62, m: 0.45 });
const MAT_SILICON_STEEL = makeMat(0x2d3748, { r: 0.36, m: 0.72 });
const MAT_DRIVE_HEAD    = makeMat(0xdbe3ec, { r: 0.24, m: 0.48 });
const MAT_CONSOLE_BEZEL = makeMat(0x111827, { r: 0.50, m: 0.20 });

// High-Luster Specular Stainless Steels & Machined Alloys
const MAT_316SS_ELECTROPOLISHED = makeMat(0xf8fafc, { r: 0.12, m: 0.92 });
const MAT_316SS_BRUSHED = new THREE.MeshStandardMaterial({
  color: 0xdde5ed, map: TEX_BRUSHED_SS, roughness: 0.24, metalness: 0.84
});
const MAT_CHROME_STEEL    = makeMat(0xf1f5f9, { r: 0.10, m: 0.94 });
const MAT_ALUM_ANODIZED   = makeMat(0xcbd5e1, { r: 0.26, m: 0.78 });
const MAT_ALUM_DARK_ANO   = makeMat(0x1e293b, { r: 0.30, m: 0.76 });
const MAT_ALUM_BLUE_ANO   = makeMat(0x0369a1, { r: 0.24, m: 0.82 });
const MAT_COPPER_COIL     = makeMat(0xb45309, { r: 0.20, m: 0.88 });
const MAT_BRASS_FITTING   = makeMat(0xd97706, { r: 0.20, m: 0.86 });
const MAT_BRONZE_BUSHING  = makeMat(0xb45309, { r: 0.26, m: 0.82 });
const MAT_GOLD_PIN        = makeMat(0xfbbf24, { r: 0.14, m: 0.94 });
const MAT_GOLD_MIRROR     = makeMat(0xfacc15, { r: 0.03, m: 0.99 });

// Polymers, IC Packages & Industrial Wiring Insulation
const MAT_RUBBER_NBR      = makeMat(0x141619, { r: 0.86, m: 0.04 });
const MAT_CORD_BLACK      = makeMat(0x11151c, { r: 0.68, m: 0.06 });
const MAT_BRAIDED_LOOM    = makeMat(0x161c26, { r: 0.55, m: 0.18 });
const MAT_IC_PACKAGE      = makeMat(0x161920, { r: 0.42, m: 0.08 });
const MAT_PHOENIX_GREEN   = makeMat(0x15803d, { r: 0.36, m: 0.08 });
const MAT_CAP_NAVY        = makeMat(0x172554, { r: 0.25, m: 0.35 });
const MAT_MYLAR_YELLOW    = makeMat(0xeab308, { r: 0.28, m: 0.12 });
const MAT_TABLET_WHITE    = makeMat(0xfdfbf7, { r: 0.68, m: 0.02 });
const MAT_PCB_SOLDERMASK  = makeMat(0x064e3b, { r: 0.35, m: 0.15 });
const MAT_GOLD_CONTACT    = MAT_GOLD_PIN;
const MAT_RUBBER_CORD     = MAT_CORD_BLACK;
const MAT_TOROID_WINDING  = new THREE.MeshStandardMaterial({
  map: TEX_TOROID_COPPER, roughness: 0.25, metalness: 0.82
});

// Realistic Satin-Sheen PVC/XLPE Wire Insulation
const MAT_WIRE_AC_BROWN   = makeMat(0x78350f, { r: 0.38, m: 0.08 });
const MAT_WIRE_AC_BLUE    = makeMat(0x1e40af, { r: 0.38, m: 0.08 });
const MAT_WIRE_PE_GRNYLW  = makeMat(0x4d7c0f, { r: 0.38, m: 0.08 });
const MAT_WIRE_DC_RED     = makeMat(0xb91c1c, { r: 0.36, m: 0.08 });
const MAT_WIRE_DC_BLACK   = makeMat(0x18181b, { r: 0.40, m: 0.08 });
const MAT_WIRE_HEATER     = makeMat(0xc2410c, { r: 0.34, m: 0.12 });
const MAT_WIRE_SENSOR     = makeMat(0x0e7490, { r: 0.36, m: 0.15 });
const MAT_RIBBON_GREY     = makeMat(0x475569, { r: 0.46, m: 0.12 });
const MAT_SILICONE_HOSE   = makeMat(0x93c5fd, { r: 0.22, m: 0.05, o: 0.74, dw: false });

// Optical Glass, Acrylics & Aqueous Media
// Deterministic alpha-blended PBR hierarchy (transmission: 0 + strict renderOrder)
// prevents Three.js single-bounce transmission pass from culling nested water & beakers.
const MAT_BATH_ACRYLIC = new THREE.MeshPhysicalMaterial({
  color: 0xe0f2fe, roughness: 0.05, metalness: 0.05, ior: 1.49,
  reflectivity: 0.9, clearcoat: 1.0, clearcoatRoughness: 0.04,
  transparent: true, opacity: 0.18, depthWrite: false, side: THREE.FrontSide
});

const MAT_BASKET_ACRYLIC = new THREE.MeshPhysicalMaterial({
  color: 0xf0f9ff, roughness: 0.06, metalness: 0.05, ior: 1.49,
  reflectivity: 0.85, clearcoat: 1.0,
  transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide
});

const MAT_BEAKER_BOROSILICATE = new THREE.MeshPhysicalMaterial({
  color: 0xe0f2fe, roughness: 0.03, metalness: 0.06, ior: 1.52,
  reflectivity: 0.95, clearcoat: 1.0, clearcoatRoughness: 0.02,
  transparent: true, opacity: 0.24, depthWrite: false, side: THREE.FrontSide
});

const MAT_WATER_FLUID = new THREE.MeshPhysicalMaterial({
  color: 0x38bdf8, roughness: 0.06, metalness: 0.02, ior: 1.333,
  reflectivity: 0.75, clearcoat: 0.9,
  transparent: true, opacity: 0.22, depthWrite: false, side: THREE.FrontSide
});

const MAT_BEAKER_FLUID = new THREE.MeshPhysicalMaterial({
  color: 0x0ea5e9, roughness: 0.04, metalness: 0.02, ior: 1.333,
  reflectivity: 0.85, clearcoat: 1.0,
  transparent: true, opacity: 0.36, depthWrite: false, side: THREE.FrontSide
});

const MAT_MENISCUS_SURFACE = new THREE.MeshPhysicalMaterial({
  color: 0x7dd3fc, roughness: 0.03, metalness: 0.08, ior: 1.333,
  reflectivity: 0.95, clearcoat: 1.0,
  transparent: true, opacity: 0.52, depthWrite: false, side: THREE.DoubleSide
});

const MAT_LASER_BEAM = makeMat(0xef4444, {
  r: 0.2, m: 0.0, o: 0.65, e: 0xef4444, ei: 1.6, dw: false, side: THREE.DoubleSide
});

const MAT_PVC_DUCT = makeMat(0x334155, { r: 0.52, m: 0.08 });
const MAT_FOAM_HEAD = makeMat(0xffffff, { r: 0.88, m: 0.02, o: 0.82, dw: false, side: THREE.DoubleSide });

// ----------------------------------------------------------------------------
// Operator-Facing Quad Geometry (Upright & Unmirrored UV Guarantee, DIAG-005)
// ----------------------------------------------------------------------------
export function makeOperatorFacingQuadGeo(w, h) {
  const geo = new THREE.BufferGeometry();
  const halfW = w / 2;
  const halfH = h / 2;

  const positions = new Float32Array([
     halfW,  halfH, 0,
    -halfW,  halfH, 0,
     halfW, -halfH, 0,
    -halfW, -halfH, 0,
  ]);
  const normals = new Float32Array([
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
  ]);
  const uvs = new Float32Array([
    0, 1, 1, 1, 0, 0, 1, 0,
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

// ----------------------------------------------------------------------------
// Flush Laser-Etched / Silkscreen Surface Decal (Mounts Flat on Component Face)
// ----------------------------------------------------------------------------
function makeFlushSurfaceLabel(line1, line2, w, h, bgHex = '#111827', fgHex = '#e2e8f0', borderHex = '#475569') {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const ctx = c.getContext('2d');

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 512, 256);
  if (borderHex) {
    ctx.strokeStyle = borderHex;
    ctx.lineWidth = 5;
    ctx.strokeRect(6, 6, 500, 244);
  }
  ctx.fillStyle = fgHex;
  ctx.font = 'bold 42px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(line1, 256, line2 ? 92 : 128);

  if (line2) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 30px "Inter", system-ui, sans-serif';
    ctx.fillText(line2, 256, 168);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;

  const mat = new THREE.MeshStandardMaterial({
    map: tex, roughness: 0.35, metalness: 0.15, side: THREE.DoubleSide
  });
  return new THREE.Mesh(makeOperatorFacingQuadGeo(w, h), mat);
}

// ----------------------------------------------------------------------------
// Dressed Industrial Wiring Harness with Nylon Zip-Ties & End Ferrules
// ----------------------------------------------------------------------------
function makeWiringHarness(points, radius, matOrColor, name, addTies = true) {
  const vectors = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
  const curve = new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.22);
  const geo = new THREE.TubeGeometry(curve, 48, radius, 12, false);
  const mat = typeof matOrColor === 'number' ? makeMat(matOrColor, { r: 0.36, m: 0.12 }) : matOrColor;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = name;
  mesh.castShadow = true;

  if (addTies && points.length >= 4) {
    for (const frac of [0.25, 0.55, 0.82]) {
      const pt = curve.getPointAt(frac);
      const tan = curve.getTangentAt(frac);
      const tie = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 1.28, radius * 0.28, 8, 16),
        MAT_RUBBER_NBR
      );
      tie.position.copy(pt);
      tie.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
      mesh.add(tie);
    }
  }
  return mesh;
}

// ----------------------------------------------------------------------------
// Genuine 3D Fasteners & Leveling Feet
// ----------------------------------------------------------------------------
function makeHexSocketBolt(r = 0.022, len = 0.07, name = 'Fastener_HexM4') {
  const g = new THREE.Group();
  g.name = name;

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 16), MAT_CHROME_STEEL);
  shaft.position.y = -len / 2;
  g.add(shaft);

  const headR = r * 1.55, headH = r * 1.65;
  const head = new THREE.Mesh(new THREE.CylinderGeometry(headR, headR, headH, 20), MAT_CHROME_STEEL);
  head.position.y = headH / 2;
  g.add(head);

  const hex = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.9, r * 0.9, headH * 0.65, 6), MAT_CHASSIS_DARK);
  hex.position.y = headH * 0.68;
  g.add(hex);

  const washer = new THREE.Mesh(new THREE.CylinderGeometry(headR * 1.22, headR * 1.22, r * 0.3, 18), MAT_316SS_BRUSHED);
  washer.position.y = -r * 0.15;
  g.add(washer);

  return g;
}

function makeLevelingFoot(cornerName) {
  const g = new THREE.Group();
  g.name = `Foot_Leveling_${cornerName}`;

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.20, 0.09, 28), MAT_RUBBER_NBR);
  pad.position.y = 0.045;
  pad.castShadow = true;
  g.add(pad);

  const knurlCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.03, 28), MAT_316SS_BRUSHED);
  knurlCollar.position.y = 0.105;
  g.add(knurlCollar);

  const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 16), MAT_CHROME_STEEL);
  stud.position.y = 0.18;
  g.add(stud);

  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.045, 6), MAT_316SS_BRUSHED);
  nut.position.y = 0.145;
  g.add(nut);

  return g;
}

// ----------------------------------------------------------------------------
// SREdesigns Brand Certification Badge (Lower Frame Placement)
// ----------------------------------------------------------------------------
function makeSREdesignsBadge() {
  const g = new THREE.Group();
  g.name = 'Badge_SREdesigns';

  const w = 0.74, h = 0.26, d = 0.014;
  const plate = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), MAT_316SS_BRUSHED);
  g.add(plate);

  const ox = w / 2 - 0.032, oy = h / 2 - 0.032;
  for (const [sx, sy] of [[-ox, oy], [ox, oy], [-ox, -oy], [ox, -oy]]) {
    const sc = makeHexSocketBolt(0.009, 0.016, 'Fastener_HexM2_Badge');
    sc.position.set(sx, sy, -d / 2 - 0.004);
    sc.rotation.x = Math.PI / 2;
    g.add(sc);
  }

  const c = document.createElement('canvas');
  c.width = 1024; c.height = 368;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0c1016';
  ctx.fillRect(0, 0, 1024, 368);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 1012, 356);

  const letters = ['S', 'R', 'E'];
  const tileW = 100, tileH = 110, gap = 6, tileY = 40;
  let x0 = 50;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 84px system-ui,Segoe UI,Arial,sans-serif';
  for (const ch of letters) {
    const g2 = ctx.createLinearGradient(x0, tileY, x0 + tileW, tileY + tileH);
    g2.addColorStop(0, '#38bdf8');
    g2.addColorStop(1, '#0284c7');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.roundRect(x0, tileY, tileW, tileH, 12);
    ctx.fill();
    ctx.fillStyle = '#0a1218';
    ctx.fillText(ch, x0 + tileW / 2, tileY + tileH / 2 + 2);
    x0 += tileW + gap;
  }

  const tx = x0 + 30;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 56px system-ui,Segoe UI,Arial,sans-serif';
  ctx.fillText('designs.com', tx, 95);
  ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(tx, 140); ctx.lineTo(960, 140); ctx.stroke();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 36px system-ui,Segoe UI,Arial,sans-serif';
  ctx.fillText('ERWEKA ZT 322 · USP <701>', 50, 220);
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 28px system-ui,Segoe UI,Arial,sans-serif';
  ctx.fillText('● CERTIFIED GOLD STANDARD DIGITAL TWIN', 50, 290);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;

  const face = new THREE.Mesh(
    makeOperatorFacingQuadGeo(w - 0.02, h - 0.02),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.32, metalness: 0.22, side: THREE.DoubleSide })
  );
  face.position.z = -d / 2 - 0.002;
  g.add(face);

  return g;
}

// ----------------------------------------------------------------------------
// Tactile Membrane Key with Bezel & Vector Silkscreen Typography
// ----------------------------------------------------------------------------
function makeTactileButton(name, label, colorHex, w = 0.24, h = 0.15) {
  const g = new THREE.Group();
  g.name = name;

  const bezel = new THREE.Mesh(new THREE.BoxGeometry(w + 0.03, h + 0.03, 0.025), MAT_316SS_BRUSHED);
  bezel.position.z = 0.01;
  g.add(bezel);

  const cap = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.036), makeMat(0x1e293b, { r: 0.35, m: 0.15 }));
  cap.name = `${name}_Keycap`;
  cap.position.z = -0.012;
  g.add(cap);

  const c = document.createElement('canvas');
  c.width = 256; c.height = 144;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#182232';
  ctx.fillRect(0, 0, 256, 144);
  ctx.strokeStyle = '#' + colorHex.toString(16).padStart(6, '0');
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 244, 132);
  ctx.fillStyle = '#' + colorHex.toString(16).padStart(6, '0');
  ctx.fillRect(6, 6, 244, 24);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 40px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 128, 86);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;

  const lblMesh = new THREE.Mesh(
    makeOperatorFacingQuadGeo(w * 0.94, h * 0.90),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.10, side: THREE.DoubleSide })
  );
  lblMesh.position.z = -0.020;
  cap.add(lblMesh);

  return g;
}

// ----------------------------------------------------------------------------
// Lighting Mood Presets (Matches Centrifuge Gold Standard + Dark/Light/Retro/Night)
// ----------------------------------------------------------------------------
export const LIGHT_MOODS = {
  neutral: { // Dark Lab (High-Contrast Studio)
    mult: { ambient: 1.0, key: 1.15, fill: 1.0, rim: 1.0, hemi: 1.0 },
    keyColor: 0xfff5ea, fillColor: 0xe0f2fe, rimColor: 0x38bdf8,
    hemiSky: 0xdbeafe, hemiGround: 0x1e293b,
    bg: 0x0c1016, fog: 0x0c1016, wall: 0x18202c, floor: 0x111722, bench: 0x11161f
  },
  bright: { // Light Lab (Cleanroom Bright Daylight)
    mult: { ambient: 1.35, key: 1.45, fill: 1.25, rim: 0.9, hemi: 1.25 },
    keyColor: 0xfffaf5, fillColor: 0xf0f6ff, rimColor: 0xbae6fd,
    hemiSky: 0xffffff, hemiGround: 0x9aa2aa,
    bg: 0xd8e0e8, fog: 0xd8e0e8, wall: 0xe6eaee, floor: 0xc8d0d8, bench: 0x161b24
  },
  dim: {
    mult: { ambient: 0.55, key: 0.65, fill: 0.55, rim: 0.85, hemi: 0.5 },
    keyColor: 0xe8e0d4, fillColor: 0xb0bcc8, rimColor: 0x0284c7,
    hemiSky: 0xc8d0d8, hemiGround: 0x1e242c,
    bg: 0x070a0e, fog: 0x070a0e, wall: 0x0f141c, floor: 0x0a0d12, bench: 0x0c1017
  },
  cool: {
    mult: { ambient: 0.95, key: 1.05, fill: 1.25, rim: 1.2, hemi: 1.1 },
    keyColor: 0xe0f0ff, fillColor: 0xc8e8ff, rimColor: 0x38bdf8,
    hemiSky: 0xd8eeff, hemiGround: 0x475569,
    bg: 0xb8c8d8, fog: 0xb8c8d8, wall: 0xd0dce8, floor: 0xa8b8c8, bench: 0x121822
  },
  warm: {
    mult: { ambient: 1.05, key: 1.25, fill: 0.9, rim: 0.8, hemi: 0.95 },
    keyColor: 0xffe8d0, fillColor: 0xffdcc0, rimColor: 0xf59e0b,
    hemiSky: 0xfff0e0, hemiGround: 0x6b5b52,
    bg: 0xd8d0c8, fog: 0xd8d0c8, wall: 0xe8dfd5, floor: 0xc8bfb5, bench: 0x1c1917
  },
  chemmate: { // Retro Archival Paper
    mult: { ambient: 1.28, key: 1.35, fill: 0.98, rim: 0.75, hemi: 1.15 },
    keyColor: 0xfffaf2, fillColor: 0xf7efe2, rimColor: 0xfde68a,
    hemiSky: 0xfffdf6, hemiGround: 0xb5aa98,
    bg: 0xefe9dd, fog: 0xefe9dd, wall: 0xf5f0e6, floor: 0xe6decb, bench: 0x282725
  },
  night: { // Nocturnal Precision Red & Charcoal
    mult: { ambient: 0.72, key: 1.15, fill: 0.72, rim: 1.1, hemi: 0.65 },
    keyColor: 0xffffff, fillColor: 0x4c1d24, rimColor: 0xff3344,
    hemiSky: 0x222a38, hemiGround: 0x090b0e,
    bg: 0x0a0c10, fog: 0x0a0c10, wall: 0x141820, floor: 0x0d1015, bench: 0x111317
  }
};

// ----------------------------------------------------------------------------
// Main Procedural 3D Engine: Disintegration3D
// ----------------------------------------------------------------------------
export class Disintegration3D {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    // Simulation state object (read by renderLCD, updatePowerCord, animate)
    this.state = {
      isPluggedIn: true,
      switchOn: true,
      state: 'STANDBY',
      bathTempC: 37.0,
      targetTempC: 37.0,
      heaterOn: true,
      targetCpm: 30.0,
      currentCpm: 0.0,
      strokeCount: 0,
      elapsedS: 0,
      targetDurationS: 900,
      basketLowered: true,
      sampleName: 'ASPIRIN 500mg IR',
      tabletSize: new Array(12).fill(1.0),
      explodeFactor: 0.0
    };

    // Legacy direct properties for tour compatibility
    this.isPluggedIn = true;
    this.powerSwitchOn = true;
    this.oscillationActive = false;
    this.heaterActive = false;
    this.crankPhase = 0.0;
    this.liftProgress = 1.0;
    this.cutawayActive = false;
    this.wireframeActive = false;
    this.autoRotate = false;
    this.orbitSpeedDeg = 14;
    this._explorerFocus = null;

    // Lighting state
    this.lightBrightness = 1.15;
    this.lightMood = 'neutral';
    this.currentMood = 'neutral';
    this.currentTheme = 'modern';
    this.currentStageMode = 'bench';

    // Exploded view
    this.explodeTargets = [];

    // Animation nodes cache
    this.animNodes = {
      driveHead: null,
      carriage: null,
      cantileverArm: null,
      bellows: null,
      crankDisc: null,
      connectingRod: null,
      crosshead: null,
      coolingFan: null,
      leadScrews: [],
      baskets: [],
      beakerFluids: [],
      menisci: [],
      heaterCoils: [],
      tablets: []
    };

    // 3D Raycasting & Touch Interaction State
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.touchRipples = [];
    this.pressedButtonMesh = null;
    this.pressedButtonBaseZ = 0;
    this.onTouchAction = null;

    // Disintegration Reaction & Substance Dynamics
    this.reactionParticles = [];
    this.tubeFoamPlates = [];
    this.sedimentBeds = [];
    this.activeReactionType = 'cloudy_plumes';

    this.init();
  }

  init() {
    const w = Math.max(1, this.container.clientWidth || window.innerWidth);
    const h = Math.max(1, this.container.clientHeight || window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 120);
    this.camera.position.set(-5.8, 5.2, -9.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.06;
    this.controls.minDistance = 1.6;
    this.controls.maxDistance = 24.0;
    this.controls.target.set(0.2, 2.9, -0.2);
    this.controls.update();

    // Build 3D world
    this.buildLabRoom();
    this.buildInstrumentChassis();
    this.buildWaterBathAndGlassware();
    this.buildKinematicDrive();
    this.buildApparatusBaskets();
    this.buildOperatorConsole();
    this.buildElectronicsBay();
    this.buildPowerContinuity();
    this.setupExplodedViewTargets();

    this.applyLighting();
    this.setupInteractiveRaycasting();

    // ResizeObserver for zero-skew layout when right panels collapse/expand
    this.ro = new ResizeObserver(() => this.onWindowResize());
    this.ro.observe(this.container);
    window.addEventListener('resize', () => this.onWindowResize());

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // --------------------------------------------------------------------------
  // Interactive 3D Touchscreen Raycasting & Tactile Controls
  // --------------------------------------------------------------------------
  setupInteractiveRaycasting() {
    const el = this.renderer?.domElement;
    if (!el) return;

    const getPointer = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      return { x, y };
    };

    el.addEventListener('pointermove', (e) => {
      const p = getPointer(e);
      this.pointer.set(p.x, p.y);
      if (!this.camera) return;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const targets = [this.lcdMesh, ...(this.buttons || []), this.mainsRockerMesh, this.nemaPlug].filter(Boolean);
      const hits = this.raycaster.intersectObjects(targets, true);
      el.style.cursor = hits.length > 0 ? 'pointer' : 'default';
    });

    el.addEventListener('pointerdown', (e) => {
      const p = getPointer(e);
      this.pointer.set(p.x, p.y);
      if (!this.camera) return;
      this.raycaster.setFromCamera(this.pointer, this.camera);

      // 1. Check dynamic LCD touch screen
      if (this.lcdMesh) {
        const lcdHits = this.raycaster.intersectObject(this.lcdMesh, false);
        if (lcdHits.length > 0 && lcdHits[0].uv) {
          this.handleLCDTouch(lcdHits[0].uv);
          return;
        }
      }

      // 2. Check tactile console buttons
      if (this.buttons && this.buttons.length > 0) {
        for (const btn of this.buttons) {
          const btnHits = this.raycaster.intersectObject(btn, true);
          if (btnHits.length > 0) {
            this.handleButtonPress(btn);
            return;
          }
        }
      }

      // 3. Check mains power rocker switch
      if (this.mainsRockerMesh) {
        const swHits = this.raycaster.intersectObject(this.mainsRockerMesh, true);
        if (swHits.length > 0) {
          this.onTouchAction?.('power_switch');
          return;
        }
      }

      // 4. Check NEMA power plug
      if (this.nemaPlug) {
        const plugHits = this.raycaster.intersectObject(this.nemaPlug, true);
        if (plugHits.length > 0) {
          this.onTouchAction?.('power_plug');
          return;
        }
      }
    });

    window.addEventListener('pointerup', () => {
      if (this.pressedButtonMesh) {
        this.pressedButtonMesh.position.z = this.pressedButtonBaseZ;
        this.pressedButtonMesh = null;
      }
    });
  }

  handleLCDTouch(uv) {
    const hasPower = this.state.isPluggedIn && this.state.switchOn && this.state.state !== 'POWER_OFF';
    if (!hasPower) return;

    // Convert UV to Canvas pixel coordinates (1024 x 512)
    const cx = uv.x * 1024;
    const cy = uv.y * 512;

    // Add glowing cyan touch ripple at (cx, cy)
    this.touchRipples.push({ x: cx, y: cy, radius: 8, maxRadius: 55, alpha: 0.95 });

    // Interactive Touch Zones on the 7.0" High-DPI Screen:
    // Bottom Control Bar (Y in [415, 495]):
    // START: [28, 175]
    if (cx >= 28 && cx <= 175 && cy >= 415 && cy <= 495) {
      this.onTouchAction?.('start');
      this.renderLCD();
      return;
    }
    // STOP: [190, 335]
    if (cx >= 190 && cx <= 335 && cy >= 415 && cy <= 495) {
      this.onTouchAction?.('stop');
      this.renderLCD();
      return;
    }
    // LIFT: [350, 495]
    if (cx >= 350 && cx <= 495 && cy >= 415 && cy <= 495) {
      this.onTouchAction?.('lift');
      this.renderLCD();
      return;
    }
    // HEATER: [510, 655]
    if (cx >= 510 && cx <= 655 && cy >= 415 && cy <= 495) {
      this.onTouchAction?.('heater');
      this.renderLCD();
      return;
    }
    // SAMPLE MONOGRAPH: [670, 835]
    if (cx >= 670 && cx <= 835 && cy >= 415 && cy <= 495) {
      this.onTouchAction?.('sample');
      this.renderLCD();
      return;
    }
    // RELOAD TABLETS: [850, 996]
    if (cx >= 850 && cx <= 996 && cy >= 415 && cy <= 495) {
      this.onTouchAction?.('reload');
      this.renderLCD();
      return;
    }

    // Telemetry Cards adjustment touch buttons:
    // Temp -/+ (Card 1): [230, 310], [130, 240]
    if (cx >= 230 && cx <= 310 && cy >= 130 && cy <= 240) {
      this.onTouchAction?.('temp_adj', cy < 185 ? 0.5 : -0.5);
      this.renderLCD();
      return;
    }
    // CPM -/+ (Card 2): [550, 630], [130, 240]
    if (cx >= 550 && cx <= 630 && cy >= 130 && cy <= 240) {
      this.onTouchAction?.('cpm_adj', cy < 185 ? 0.5 : -0.5);
      this.renderLCD();
      return;
    }
    // Time -/+ (Card 3): [890, 980], [130, 240]
    if (cx >= 890 && cx <= 980 && cy >= 130 && cy <= 240) {
      this.onTouchAction?.('time_adj', cy < 185 ? 60 : -60);
      this.renderLCD();
      return;
    }

    this.renderLCD();
  }

  handleButtonPress(btn) {
    const keycap = btn.children.find(c => c.name && c.name.includes('_Keycap')) || btn;
    this.pressedButtonMesh = keycap;
    this.pressedButtonBaseZ = keycap.position.z;
    keycap.position.z += 0.012; // 1.2 mm physical depression

    const name = btn.name;
    if (name === 'Btn_Start') this.onTouchAction?.('start');
    else if (name === 'Btn_Stop') this.onTouchAction?.('stop');
    else if (name === 'Btn_Temp') this.onTouchAction?.('heater');
    else if (name === 'Btn_Time') this.onTouchAction?.('time_adj', 60);
    else if (name === 'Btn_Lift') this.onTouchAction?.('lift');
  }

  // --------------------------------------------------------------------------
  // Laboratory Room, Bench & Multi-Mood Studio Lighting
  // --------------------------------------------------------------------------
  buildLabRoom() {
    this.scene.background = new THREE.Color(0x0c1016);
    this.scene.fog = new THREE.FogExp2(0x0c1016, 0.022);

    this.ambLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(this.ambLight);

    this.hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.52);
    this.scene.add(this.hemiLight);

    this.keyLight = new THREE.DirectionalLight(0xfff5ea, 1.25);
    this.keyLight.position.set(-5.5, 11.5, -8.5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.bias = -0.00015;
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.65);
    this.fillLight.position.set(6.5, 8.0, -4.5);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.DirectionalLight(0x38bdf8, 0.50);
    this.rimLight.position.set(0, 10.0, 8.5);
    this.scene.add(this.rimLight);

    this.labRoomGroup = new THREE.Group();
    this.labRoomGroup.name = 'Body_Lab_Environment';
    this.scene.add(this.labRoomGroup);

    // Floor with tile grid
    this.floorMat = makeMat(0x111722, { r: 0.58, m: 0.05 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), this.floorMat);
    floor.name = 'Body_Lab_Ground';
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.8;
    floor.receiveShadow = true;
    this.labRoomGroup.add(floor);

    // Back & Side Lab Walls
    this.wallMat = makeMat(0x18202c, { r: 0.68, m: 0.04 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(36, 22), this.wallMat);
    backWall.name = 'Body_Lab_Wall_Back';
    backWall.position.set(0, 7.2, 6.2);
    backWall.rotation.y = Math.PI;
    this.labRoomGroup.add(backWall);

    // Black Epoxy Lab Bench (INSTRUMENT_BENCH) at Datum Y = 0
    const benchW = 22.0, benchD = 12.0, benchH = 0.85;
    this.benchMat = new THREE.MeshStandardMaterial({ color: 0x11161f, roughness: 0.24, metalness: 0.16 });
    this.benchMesh = new THREE.Mesh(new THREE.BoxGeometry(benchW, benchH, benchD), this.benchMat);
    this.benchMesh.name = 'Body_INSTRUMENT_BENCH';
    this.benchMesh.position.set(0, -benchH / 2, 0);
    this.benchMesh.receiveShadow = true;
    this.scene.add(this.benchMesh);

    const edgeStrip = new THREE.Mesh(new THREE.BoxGeometry(benchW + 0.08, 0.06, 0.06), MAT_316SS_BRUSHED);
    edgeStrip.name = 'Body_Lab_BenchEdge';
    edgeStrip.position.set(0, -0.03, -benchD / 2 - 0.03);
    this.scene.add(edgeStrip);
  }

  applyLighting(moodKey, brightness) {
    if (moodKey) {
      this.lightMood = moodKey;
      this.currentMood = moodKey;
    }
    if (brightness != null && !Number.isNaN(brightness)) {
      this.lightBrightness = brightness;
    }
    const mood = LIGHT_MOODS[this.lightMood] || LIGHT_MOODS.neutral;
    const b = this.lightBrightness;
    const m = mood.mult;

    this.ambLight.intensity = 0.62 * m.ambient * b;
    this.hemiLight.intensity = 0.50 * m.hemi * b;
    this.keyLight.intensity = 1.25 * m.key * b;
    this.fillLight.intensity = 0.65 * m.fill * b;
    this.rimLight.intensity = 0.50 * m.rim * b;

    this.keyLight.color.setHex(mood.keyColor);
    this.fillLight.color.setHex(mood.fillColor);
    this.rimLight.color.setHex(mood.rimColor);
    this.hemiLight.color.setHex(mood.hemiSky);
    this.hemiLight.groundColor.setHex(mood.hemiGround);

    this.scene.background.setHex(mood.bg);
    if (this.scene.fog) this.scene.fog.color.setHex(mood.fog);
    if (this.wallMat) this.wallMat.color.setHex(mood.wall);
    if (this.floorMat) this.floorMat.color.setHex(mood.floor);
    if (this.benchMat) this.benchMat.color.setHex(mood.bench);
  }

  setStageBackdrop(stageMode, theme) {
    this.currentStageMode = stageMode || 'bench';
    if (theme) this.currentTheme = theme;

    if (this.currentTheme === 'retro' || this.currentTheme === 'night') {
      const showRoom = this.currentStageMode === 'bench';
      if (this.labRoomGroup) this.labRoomGroup.visible = showRoom;
    } else {
      if (this.labRoomGroup) this.labRoomGroup.visible = true;
    }
    this.applyLighting();
  }

  // --------------------------------------------------------------------------
  // Global Wireframe & Part Explorer Isolate Mode
  // --------------------------------------------------------------------------
  setWireframe(enabled) {
    this.wireframeActive = !!enabled;
    this._explorerFocus = null;
    this.scene.traverse((o) => {
      if (!o.isMesh) return;
      const n = o.name || '';
      if (n.startsWith('Body_Lab_') || n === 'Body_INSTRUMENT_BENCH') return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const mat of mats) {
        if (mat && 'wireframe' in mat) mat.wireframe = this.wireframeActive;
      }
    });
  }

  setExplorerFocus(focusObj) {
    this._explorerFocus = focusObj || null;
    const focusList = Array.isArray(focusObj) ? focusObj : (focusObj ? [focusObj] : null);

    const isUnder = (node, target) => {
      let p = node;
      while (p) {
        if (p === target) return true;
        p = p.parent;
      }
      return false;
    };

    this.scene.traverse((o) => {
      if (!o.isMesh) return;
      const n = o.name || '';
      if (n.startsWith('Body_Lab_') || n === 'Body_INSTRUMENT_BENCH') return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      const focused = focusList ? focusList.some((fo) => isUnder(o, fo)) : true;
      for (const mat of mats) {
        if (!mat || !('wireframe' in mat)) continue;
        mat.wireframe = focusList ? !focused : this.wireframeActive;
      }
    });
  }

  // --------------------------------------------------------------------------
  // Main Instrument Chassis & Structural Frame
  // --------------------------------------------------------------------------
  buildInstrumentChassis() {
    this.chassisGroup = new THREE.Group();
    this.chassisGroup.name = 'Body_Chassis';
    this.scene.add(this.chassisGroup);

    // 4 Corner Leveling Feet at Datum Y = 0
    for (const [x, y, z, id] of [
      [-1.85, 0, -1.70, 'FL'],
      [ 1.85, 0, -1.70, 'FR'],
      [-1.85, 0,  1.70, 'RL'],
      [ 1.85, 0,  1.70, 'RR']
    ]) {
      const foot = makeLevelingFoot(id);
      foot.position.set(x, y, z);
      this.chassisGroup.add(foot);
    }

    // Internal Galvanized Steel Structural Sub-Frame & DIN Rail Pan (Grounded at Y=0.14 dm)
    const floorPan = new THREE.Mesh(new THREE.BoxGeometry(4.18, 0.05, 3.88), MAT_316SS_BRUSHED);
    floorPan.name = 'Body_Chassis_FloorPan';
    floorPan.position.set(0, 0.14, 0);
    floorPan.receiveShadow = true;
    this.chassisGroup.add(floorPan);

    // Side structural stiffening ribs on internal floor pan
    for (const sx of [-1.98, 1.98]) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 3.76), MAT_ALUM_ANODIZED);
      rib.name = `Body_Chassis_SideRail_${sx < 0 ? 'L' : 'R'}`;
      rib.position.set(sx, 0.25, 0);
      this.chassisGroup.add(rib);
    }

    // Upper Sheet-Metal Enclosure Shell (Elevates cleanly in Exploded View)
    this.enclosureShell = new THREE.Group();
    this.enclosureShell.name = 'Body_EnclosureShell';
    this.chassisGroup.add(this.enclosureShell);

    const basePanGeo = new THREE.BoxGeometry(4.30, 2.28, 4.00);
    this.basePanMesh = new THREE.Mesh(basePanGeo, MAT_CHASSIS_CREAM.clone());
    this.basePanMesh.name = 'Body_Cabinet_BasePan';
    this.basePanMesh.position.set(0, 0.12 + 2.28 / 2, 0);
    this.basePanMesh.castShadow = true;
    this.basePanMesh.receiveShadow = true;
    this.enclosureShell.add(this.basePanMesh);

    // Brushed Stainless Top Deck Trim Plate
    const deckGeo = new THREE.BoxGeometry(3.96, 0.06, 2.24);
    this.bathCradleMesh = new THREE.Mesh(deckGeo, MAT_316SS_BRUSHED.clone());
    this.bathCradleMesh.name = 'Body_Chassis_BathCradle';
    this.bathCradleMesh.position.set(0, 0.12 + 2.28 + 0.03, -0.85);
    this.enclosureShell.add(this.bathCradleMesh);

    // Side Ventilation Louvers (Stamped Recessed Slots)
    for (const side of [-1, 1]) {
      for (let i = 0; i < 8; i++) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.032, 0.42), MAT_CHASSIS_DARK);
        louver.name = `Body_Chassis_Louver_${side < 0 ? 'L' : 'R'}_0${i + 1}`;
        louver.position.set(side * 2.155, 0.48 + i * 0.17, 0.35);
        this.enclosureShell.add(louver);
      }
    }

    // Upright Rear Drive Column Tower
    const towerGeo = new THREE.BoxGeometry(3.60, 4.20, 1.60);
    this.towerMesh = new THREE.Mesh(towerGeo, MAT_CHASSIS_CREAM.clone());
    this.towerMesh.name = 'Body_Cabinet_UprightTower';
    this.towerMesh.position.set(0, 2.40 + 4.20 / 2, 1.00);
    this.towerMesh.castShadow = true;
    this.enclosureShell.add(this.towerMesh);

    // Anodized Aluminum Tower Cap Plate
    const capPlate = new THREE.Mesh(new THREE.BoxGeometry(3.64, 0.06, 1.64), MAT_316SS_BRUSHED);
    capPlate.name = 'Body_Tower_TopCap';
    capPlate.position.set(0, 6.63, 1.00);
    this.enclosureShell.add(capPlate);

    // Structural Hex Socket Bolts along Tower Flanges
    for (let i = 0; i < 4; i++) {
      const scL = makeHexSocketBolt(0.022, 0.07, `Fastener_HexM4_TowerL0${i + 1}`);
      scL.position.set(-1.80, 2.65 + i * 1.05, 1.00);
      scL.rotation.z = Math.PI / 2;
      this.enclosureShell.add(scL);

      const scR = makeHexSocketBolt(0.022, 0.07, `Fastener_HexM4_TowerR0${i + 1}`);
      scR.position.set(1.80, 2.65 + i * 1.05, 1.00);
      scR.rotation.z = -Math.PI / 2;
      this.enclosureShell.add(scR);
    }

    // Official SREdesigns Brand Badge on Lower Front Frame
    const badge = makeSREdesignsBadge();
    badge.position.set(-1.55, 0.42, -2.01);
    this.enclosureShell.add(badge);
  }

  setCutaway(enabled) {
    this.cutawayActive = !!enabled;
    for (const mesh of [this.basePanMesh, this.towerMesh, this.bathCradleMesh]) {
      if (mesh) {
        mesh.material.transparent = this.cutawayActive;
        mesh.material.opacity = this.cutawayActive ? 0.09 : 1.0;
        mesh.material.depthWrite = !this.cutawayActive;
        mesh.material.needsUpdate = true;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Acrylic Water Bath, Serpentine Heater, PT100 Probe & Griffin Beakers
  // --------------------------------------------------------------------------
  buildWaterBathAndGlassware() {
    this.bathGroup = new THREE.Group();
    this.bathGroup.name = 'Body_Bath';
    this.bathGroup.position.set(0, 2.46, -0.85);
    this.scene.add(this.bathGroup);

    // Seamless Molded Optical Acrylic Water Bath (Walls + Top Rim Flange)
    const bathMesh = new THREE.Mesh(new THREE.BoxGeometry(3.80, 1.90, 2.10), MAT_BATH_ACRYLIC);
    bathMesh.name = 'Glass_Bath_AcrylicVessel';
    bathMesh.position.y = 1.90 / 2;
    bathMesh.renderOrder = 50;
    this.bathGroup.add(bathMesh);

    // Subtle Acrylic Edge Framing Lines for crisp 3D tank silhouette
    const bathEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.802, 1.902, 2.102)),
      new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.42 })
    );
    bathEdges.position.y = 1.90 / 2;
    bathEdges.renderOrder = 52;
    this.bathGroup.add(bathEdges);

    // Machined Acrylic Cover Plate with Dual Beaker Cutout Collars
    const topRim = new THREE.Mesh(new THREE.BoxGeometry(3.88, 0.05, 2.18), MAT_BATH_ACRYLIC);
    topRim.name = 'Glass_Bath_TopCover';
    topRim.position.y = 1.90;
    topRim.renderOrder = 51;
    this.bathGroup.add(topRim);

    const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(3.68, 1.64, 1.98), MAT_WATER_FLUID);
    waterMesh.name = 'Glass_Bath_WaterVolume';
    waterMesh.position.y = 1.64 / 2 + 0.05;
    waterMesh.renderOrder = 40;
    this.bathGroup.add(waterMesh);

    // Crisp Bath Water Top Meniscus Surface Plane
    const bathSurface = new THREE.Mesh(new THREE.PlaneGeometry(3.66, 1.96), MAT_MENISCUS_SURFACE);
    bathSurface.rotation.x = -Math.PI / 2;
    bathSurface.position.y = 1.69;
    bathSurface.renderOrder = 42;
    this.bathGroup.add(bathSurface);
    this.animNodes.menisci.push(bathSurface);

    // Serpentine 1500W Incoloy 800 Immersion Heater Coil + Bulkhead Compression Glands
    const heaterCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.45, 0.12,  0.88),
      new THREE.Vector3(-1.45, 0.12, -0.78),
      new THREE.Vector3(-1.12, 0.12, -0.78),
      new THREE.Vector3(-1.12, 0.12,  0.72),
      new THREE.Vector3(-0.45, 0.12,  0.72),
      new THREE.Vector3(-0.45, 0.12, -0.78),
      new THREE.Vector3( 0.45, 0.12, -0.78),
      new THREE.Vector3( 0.45, 0.12,  0.72),
      new THREE.Vector3( 1.12, 0.12,  0.72),
      new THREE.Vector3( 1.12, 0.12, -0.78),
      new THREE.Vector3( 1.45, 0.12, -0.78),
      new THREE.Vector3( 1.45, 0.12,  0.88)
    ]);
    this.heaterCoilMesh = new THREE.Mesh(
      new THREE.TubeGeometry(heaterCurve, 72, 0.028, 14, false),
      MAT_CHROME_STEEL.clone()
    );
    this.heaterCoilMesh.material.emissive.setHex(0xff3300);
    this.heaterCoilMesh.name = 'Body_Heater_ImmersionCoil';
    this.bathGroup.add(this.heaterCoilMesh);
    this.animNodes.heaterCoils.push(this.heaterCoilMesh);

    for (const hx of [-1.45, 1.45]) {
      const gland = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.14, 6), MAT_BRASS_FITTING);
      gland.name = `Body_Fitting_HeaterGland_${hx < 0 ? 'L' : 'R'}`;
      gland.rotation.x = Math.PI / 2;
      gland.position.set(hx, 0.12, 0.94);
      this.bathGroup.add(gland);
    }

    // S1: PT100 Class A RTD Bath Temperature Probe with Stainless DIN Connector Head
    const pt100Group = new THREE.Group();
    pt100Group.name = 'Body_Sensor_PT100_Bath';
    pt100Group.position.set(0, 1.15, 0.76);
    this.bathGroup.add(pt100Group);

    const probeSheath = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.65, 16), MAT_316SS_ELECTROPOLISHED);
    pt100Group.add(probeSheath);

    const probeGland = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.14, 6), MAT_BRASS_FITTING);
    probeGland.position.y = 0.76;
    pt100Group.add(probeGland);

    const probeHead = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.18, 20), MAT_ALUM_DARK_ANO);
    probeHead.position.y = 0.90;
    pt100Group.add(probeHead);

    // S6: Bath Low-Water-Level Magnetic Reed Float Sensor
    const floatGroup = new THREE.Group();
    floatGroup.name = 'Body_Sensor_WaterLevel_Float';
    floatGroup.position.set(-1.62, 1.10, 0.76);
    this.bathGroup.add(floatGroup);

    const floatStem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.48, 14), MAT_316SS_BRUSHED);
    floatGroup.add(floatStem);

    const floatClip = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16), MAT_CHROME_STEEL);
    floatClip.position.y = 0.22;
    floatGroup.add(floatClip);

    const floatDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.20, 24), MAT_TABLET_WHITE);
    floatDrum.name = 'Pivot_Float_WaterLevel';
    floatDrum.position.y = 0.36;
    floatGroup.add(floatDrum);

    // Quarter-turn Chrome-Plated Brass Drain Ball Valve on Right Wall
    const drainGroup = new THREE.Group();
    drainGroup.name = 'Knob_Bath_DrainValve';
    drainGroup.position.set(1.98, 0.24, 0);
    this.bathGroup.add(drainGroup);

    const valveBody = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.18, 16), MAT_BRASS_FITTING);
    valveBody.rotation.z = Math.PI / 2;
    drainGroup.add(valveBody);

    const valveHandle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.04), makeMat(0xdc2626, { r: 0.35 }));
    valveHandle.position.set(0.05, 0.08, 0);
    drainGroup.add(valveHandle);

    // Dual 1000 mL Borosilicate 3.3 Low-Form Griffin Beakers with Retaining Rings
    // Seated at y = 0.22 inside bathGroup (above the immersion heater coil at y = 0.12)
    // reaching up to the top cover collar at y = 1.90 (height = 1.68 dm).
    const beakerCenters = [-0.825, 0.825];
    for (let stn = 0; stn < 2; stn++) {
      const cx = beakerCenters[stn];
      const beakerGroup = new THREE.Group();
      beakerGroup.name = `Glass_Beaker_0${stn + 1}`;
      beakerGroup.position.set(cx, 0.22, 0);
      this.bathGroup.add(beakerGroup);

      // Stainless Retaining Collar on Bath Cover (y = 0.22 + 1.68 = 1.90)
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.022, 12, 36), MAT_316SS_BRUSHED);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 1.68;
      beakerGroup.add(collar);

      // Bottom Stainless Support Ring Cradle inside Bath
      const btmSupport = new THREE.Mesh(new THREE.TorusGeometry(0.51, 0.015, 10, 32), MAT_316SS_BRUSHED);
      btmSupport.rotation.x = Math.PI / 2;
      btmSupport.position.y = 0.0;
      beakerGroup.add(btmSupport);

      const wallMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.525, 0.525, 1.68, 36, 1, true),
        MAT_BEAKER_BOROSILICATE
      );
      wallMesh.position.y = 1.68 / 2;
      wallMesh.renderOrder = 30;
      beakerGroup.add(wallMesh);

      const btmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.525, 0.525, 0.03, 36), MAT_BEAKER_BOROSILICATE);
      btmMesh.position.y = 0.015;
      btmMesh.renderOrder = 30;
      beakerGroup.add(btmMesh);

      const rimMesh = new THREE.Mesh(new THREE.TorusGeometry(0.525, 0.02, 12, 36), MAT_BEAKER_BOROSILICATE);
      rimMesh.position.y = 1.68;
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.renderOrder = 31;
      beakerGroup.add(rimMesh);

      // White Enamel Volumetric Graduation Rings on Beaker Wall (200..1000 mL)
      for (let g = 1; g <= 5; g++) {
        const gradRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.526, 0.004, 6, 36, Math.PI * 0.45),
          new THREE.MeshBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.55, depthWrite: false })
        );
        gradRing.rotation.x = Math.PI / 2;
        gradRing.rotation.z = -Math.PI * 0.72;
        gradRing.position.y = g * 0.26;
        gradRing.renderOrder = 32;
        beakerGroup.add(gradRing);
      }

      const fluidMat = MAT_BEAKER_FLUID.clone();
      const fluidMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.505, 0.505, 1.36, 32), fluidMat);
      fluidMesh.name = `Glass_Fluid_Beaker_0${stn + 1}`;
      fluidMesh.position.y = 1.36 / 2 + 0.03;
      fluidMesh.renderOrder = 20;
      beakerGroup.add(fluidMesh);
      this.animNodes.beakerFluids.push(fluidMesh);

      // Top Parabolic Meniscus Surface Disc inside Beaker
      const meniscusDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.504, 0.504, 0.012, 32), MAT_MENISCUS_SURFACE);
      meniscusDisc.position.y = 1.39;
      meniscusDisc.renderOrder = 22;
      beakerGroup.add(meniscusDisc);
      this.animNodes.menisci.push(meniscusDisc);

      // Real-World Disintegration Substance Reaction Group (Plumes, Bubbles, Sediment)
      const reactGroup = new THREE.Group();
      reactGroup.name = `Body_ReactionGroup_0${stn + 1}`;
      beakerGroup.add(reactGroup);

      // 1. Granule Sediment Disc on Beaker Floor
      const sedimentMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.48, 0.025, 32),
        makeMat(0xf8fafc, { r: 0.85, m: 0.05, o: 0.0, dw: false, side: THREE.DoubleSide })
      );
      sedimentMesh.position.y = 0.045;
      sedimentMesh.renderOrder = 24;
      reactGroup.add(sedimentMesh);
      this.sedimentBeds.push(sedimentMesh);

      // 2. Disintegration Plume Particle Pool (Soft powder plumes & clouds)
      const plumeGeo = new THREE.SphereGeometry(0.048, 10, 10);
      const plumeMat = makeMat(0xf8fafc, { r: 0.9, m: 0.0, o: 0.0, dw: false, side: THREE.DoubleSide });
      const plumeGroup = new THREE.Group();
      plumeGroup.name = `Group_Plumes_0${stn + 1}`;
      reactGroup.add(plumeGroup);

      const tubeAngles = [0, Math.PI / 3, 2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 5 * Math.PI / 3];
      const stationPlumes = [];
      for (let t = 0; t < 6; t++) {
        const ang = tubeAngles[t];
        const tx = Math.cos(ang) * 0.27;
        const tz = Math.sin(ang) * 0.27;
        for (let p = 0; p < 8; p++) {
          const pm = new THREE.Mesh(plumeGeo, plumeMat.clone());
          pm.position.set(tx + (Math.random() - 0.5) * 0.04, 0.25 + p * 0.12, tz + (Math.random() - 0.5) * 0.04);
          pm.visible = false;
          plumeGroup.add(pm);
          stationPlumes.push({
            mesh: pm,
            baseX: tx,
            baseZ: tz,
            tubeIdx: stn * 6 + t,
            speed: 0.08 + Math.random() * 0.08,
            wobble: Math.random() * Math.PI * 2
          });
        }
      }

      // 3. Effervescent CO2 Micro-Bubble Particle Pool
      const bubbleGeo = new THREE.SphereGeometry(0.016, 8, 8);
      const bubbleMat = makeMat(0xffffff, { r: 0.1, m: 0.2, o: 0.75, dw: false });
      const bubbleGroup = new THREE.Group();
      bubbleGroup.name = `Group_Bubbles_0${stn + 1}`;
      reactGroup.add(bubbleGroup);

      const stationBubbles = [];
      for (let b = 0; b < 48; b++) {
        const bm = new THREE.Mesh(bubbleGeo, bubbleMat);
        bm.position.set((Math.random() - 0.5) * 0.70, 0.15 + Math.random() * 1.15, (Math.random() - 0.5) * 0.70);
        bm.visible = false;
        bubbleGroup.add(bm);
        stationBubbles.push({
          mesh: bm,
          tubeIdx: stn * 6 + (b % 6),
          speedY: 0.55 + Math.random() * 0.65,
          angle: Math.random() * Math.PI * 2,
          radius: 0.02 + Math.random() * 0.26
        });
      }

      this.reactionParticles.push({
        plumes: stationPlumes,
        bubbles: stationBubbles
      });
    }
  }

  // --------------------------------------------------------------------------
  // Precision Industrial Kinematic Drive, NEMA 17 Actuators & BLDC Gearmotor
  // (Full Mechanical Articulation: Carriage, Cantilever Arm, Bellows, Linkage)
  // --------------------------------------------------------------------------
  buildKinematicDrive() {
    this.driveGroup = new THREE.Group();
    this.driveGroup.name = 'Pivot_Mechanism_KinematicDrive';
    this.driveGroup.position.set(0, 0, 1.00);
    this.scene.add(this.driveGroup);

    // Dual Hardened Chrome Steel Linear Guide Shafts (Dia 16mm, Length 385mm)
    for (const side of [-1, 1]) {
      const sideTag = side < 0 ? 'Left' : 'Right';
      const sShort = side < 0 ? 'L' : 'R';

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 3.85, 24), MAT_CHROME_STEEL);
      shaft.name = `Body_Shaft_Guide_${sideTag}`;
      shaft.position.set(side * 0.80, 2.40 + 3.85 / 2, 0);
      this.driveGroup.add(shaft);

      // Machined Aluminum Shaft Support Blocks (Top & Bottom Datum)
      for (const sy of [2.46, 6.22]) {
        const blk = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.24), MAT_ALUM_ANODIZED);
        blk.name = `Body_Mount_ShaftSupport_${sShort}_${sy > 4 ? 'Top' : 'Btm'}`;
        blk.position.set(side * 0.80, sy, 0);
        this.driveGroup.add(blk);

        for (const bx of [-0.08, 0.08]) {
          const b = makeHexSocketBolt(0.012, 0.04, `Fastener_HexM3_ShaftMount_${sShort}`);
          b.position.set(side * 0.80 + bx, sy + (sy > 4 ? 0.06 : -0.06), 0);
          this.driveGroup.add(b);
        }
      }

      // ======================================================================
      // M2 & M3: Authentic NEMA 17 Hybrid Stepper Lift Actuators + Jaw Couplings
      // ======================================================================
      const liftMotorGroup = new THREE.Group();
      liftMotorGroup.name = `Body_Motor_LiftActuator_${sideTag}`;
      liftMotorGroup.position.set(side * 1.22, 2.66, 0.08);
      this.driveGroup.add(liftMotorGroup);

      // Stamped Steel Mounting L-Bracket with Side Gussets
      const lBracket = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.48), MAT_CHASSIS_DARK);
      lBracket.position.y = 0.24;
      liftMotorGroup.add(lBracket);

      // Natural Anodized Front & Rear NEMA 17 Endbells
      const frontBell = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 0.42), MAT_ALUM_ANODIZED);
      frontBell.position.y = 0.17;
      liftMotorGroup.add(frontBell);

      const rearBell = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 0.42), MAT_ALUM_ANODIZED);
      rearBell.position.y = -0.17;
      liftMotorGroup.add(rearBell);

      // Laminated Silicon-Steel Stator Core Stack (with grooved lamination rings)
      const statorCore = new THREE.Mesh(new THREE.BoxGeometry(0.41, 0.25, 0.41), MAT_SILICON_STEEL);
      liftMotorGroup.add(statorCore);

      // 4 Corner M3 Tie-Bolts clamping the NEMA 17 stack
      for (const [bx, bz] of [[-0.155, -0.155], [0.155, -0.155], [-0.155, 0.155], [0.155, 0.155]]) {
        const bolt = makeHexSocketBolt(0.012, 0.42, `Fastener_NEMA17_Bolt_${sShort}`);
        bolt.position.set(bx, 0.22, bz);
        liftMotorGroup.add(bolt);
      }

      // Raised NEMA 17 Pilot Boss (dia 22mm)
      const pilotBoss = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 24), MAT_ALUM_ANODIZED);
      pilotBoss.position.y = 0.23;
      liftMotorGroup.add(pilotBoss);

      // Flush Spec Plate on Front Face of NEMA 17 Stator
      const nemaSpec = makeFlushSurfaceLabel(
        `M${side < 0 ? '2' : '3'} · NEMA 17`,
        '1.8° STEP · 0.52 Nm',
        0.34, 0.16, '#0f172a', '#f59e0b', '#334155'
      );
      nemaSpec.position.set(0, 0, -0.208);
      liftMotorGroup.add(nemaSpec);

      // 3-Piece Jaw-Type Flexible Shaft Coupling with Red Polyurethane Elastomer Spider
      const couplingGroup = new THREE.Group();
      couplingGroup.name = `Pivot_Coupling_Lift_${sShort}`;
      couplingGroup.position.y = 0.36;
      liftMotorGroup.add(couplingGroup);

      const lowerHub = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.075, 24), MAT_ALUM_ANODIZED);
      lowerHub.position.y = -0.055;
      couplingGroup.add(lowerHub);

      const spider = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.092, 0.045, 16), makeMat(0xdc2626, { r: 0.45 }));
      couplingGroup.add(spider);

      const upperHub = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.075, 24), MAT_ALUM_ANODIZED);
      upperHub.position.y = 0.055;
      couplingGroup.add(upperHub);

      // Precision TR10x2 Trapezoidal Stainless Steel Lead Screw (Extended to Y=6.22)
      const screwGroup = new THREE.Group();
      screwGroup.name = `Pivot_LeadScrew_Lift_${sShort}`;
      screwGroup.position.set(side * 1.22, 4.62, 0.08);
      this.driveGroup.add(screwGroup);

      const screwCore = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 3.20, 24), MAT_316SS_ELECTROPOLISHED);
      screwGroup.add(screwCore);
      this.animNodes.leadScrews.push(screwGroup);

      // Top Pillow Bearing Block for Lead Screw
      const topBearing = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.10, 0.22), MAT_ALUM_DARK_ANO);
      topBearing.name = `Body_Mount_LeadScrewBearing_${sShort}`;
      topBearing.position.set(side * 1.22, 6.22, 0.08);
      this.driveGroup.add(topBearing);
    }

    // ========================================================================
    // M1: 24V BLDC Finned Servo Motor + 2-Stage Planetary Gearbox + Encoder S3
    // ========================================================================
    const motorGroup = new THREE.Group();
    motorGroup.name = 'Body_Motor_HarmonicStepper';
    motorGroup.position.set(0, 4.20, 0.26);
    this.driveGroup.add(motorGroup);

    // CNC Machined Cast-Aluminum Bulkhead Mounting Plate
    const mountPlate = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.84, 0.08), MAT_ALUM_ANODIZED);
    mountPlate.position.z = -0.34;
    motorGroup.add(mountPlate);

    for (const [mx, my] of [[-0.34, -0.34], [0.34, -0.34], [-0.34, 0.34], [0.34, 0.34]]) {
      const mb = makeHexSocketBolt(0.018, 0.06, 'Fastener_HexM5_MotorMount');
      mb.rotation.x = Math.PI / 2;
      mb.position.set(mx, my, -0.38);
      motorGroup.add(mb);
    }

    // 2-Stage Precision Planetary Gearbox (Body_Gearbox_Planetary)
    const gearboxGroup = new THREE.Group();
    gearboxGroup.name = 'Body_Gearbox_Planetary';
    gearboxGroup.position.z = -0.18;
    motorGroup.add(gearboxGroup);

    const gbRing1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.16, 32), MAT_316SS_BRUSHED);
    gbRing1.rotation.x = Math.PI / 2;
    gbRing1.position.z = -0.06;
    gearboxGroup.add(gbRing1);

    const gbRing2 = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.14, 32), MAT_ALUM_DARK_ANO);
    gbRing2.rotation.x = Math.PI / 2;
    gbRing2.position.z = 0.08;
    gearboxGroup.add(gbRing2);

    // Finned Extruded Black-Anodized BLDC Motor Stator Body
    const statorCore = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.50, 32), MAT_ALUM_DARK_ANO);
    statorCore.rotation.x = Math.PI / 2;
    statorCore.position.z = 0.24;
    motorGroup.add(statorCore);

    // 16 Radial Extruded Aluminum Cooling Fins along Stator Perimeter
    for (let f = 0; f < 16; f++) {
      const ang = (f * Math.PI * 2) / 16;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.07, 0.46), MAT_ALUM_DARK_ANO);
      fin.position.set(Math.cos(ang) * 0.32, Math.sin(ang) * 0.32, 0.24);
      fin.rotation.z = ang;
      motorGroup.add(fin);
    }

    // Internal Copper Stator Winding End-Turns
    const coilRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.045, 12, 28), MAT_COPPER_COIL);
    coilRing.position.z = 0.04;
    motorGroup.add(coilRing);

    // Top-mounted 6-Pin Industrial Molex Motor Power Header + Flush Spec Plate
    const molexBox = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.10, 0.18), MAT_CHASSIS_DARK);
    molexBox.position.set(0, 0.36, 0.32);
    motorGroup.add(molexBox);

    const m1Spec = makeFlushSurfaceLabel(
      'M1 · 24V BLDC SERVO',
      'PLANETARY i=45:1 · 30 CPM',
      0.42, 0.16, '#0f172a', '#38bdf8', '#475569'
    );
    m1Spec.position.set(0, 0.42, 0.22);
    m1Spec.rotation.x = -Math.PI / 4;
    motorGroup.add(m1Spec);

    // S3: 1024-PPR Quadrature Optical Rotary Encoder on Rear Shaft of M1
    const encoderGroup = new THREE.Group();
    encoderGroup.name = 'Body_Sensor_OpticalEncoder';
    encoderGroup.position.set(0, 4.20, 0.86);
    this.driveGroup.add(encoderGroup);

    const encFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 28), MAT_ALUM_ANODIZED);
    encFlange.rotation.x = Math.PI / 2;
    encFlange.position.z = -0.09;
    encoderGroup.add(encFlange);

    const encCan = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.18, 28), MAT_316SS_BRUSHED);
    encCan.rotation.x = Math.PI / 2;
    encoderGroup.add(encCan);

    const encRearLabel = makeFlushSurfaceLabel(
      'S3 · 1024-PPR',
      'OPTICAL ENCODER',
      0.28, 0.14, '#0f172a', '#22c55e', '#334155'
    );
    encRearLabel.rotation.y = Math.PI;
    encRearLabel.position.z = 0.095;
    encoderGroup.add(encRearLabel);

    // Counterbalanced CNC Eccentric Crank Flywheel (r = 27.5 mm = 0.275 dm, Coplanar Z = -0.16)
    this.crankDisc = new THREE.Group();
    this.crankDisc.name = 'Pivot_CrankDisc';
    this.crankDisc.position.set(0, 4.20, -0.16);
    this.crankDisc.rotation.x = Math.PI / 2;
    this.driveGroup.add(this.crankDisc);
    this.animNodes.crankDisc = this.crankDisc;

    const wheelRim = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.10, 36), MAT_316SS_BRUSHED);
    this.crankDisc.add(wheelRim);

    const wheelHub = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.14, 24), MAT_ALUM_DARK_ANO);
    this.crankDisc.add(wheelHub);

    // Counterbalance Crescent Weight on opposite side of crank pin
    const balanceWeight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.41, 0.41, 0.13, 24, 1, false, Math.PI * 0.65, Math.PI * 0.7),
      MAT_CAST_IRON
    );
    this.crankDisc.add(balanceWeight);

    // Eccentric Crank Journal Pin (offset r = 0.275 dm, centered on Z = -0.16)
    const crankPin = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.18, 20), MAT_CHROME_STEEL);
    crankPin.name = 'Pivot_Pin_EccentricCrank';
    crankPin.position.set(0.275, 0.09, 0);
    this.crankDisc.add(crankPin);

    // S2: Slotted Optical TDC/BDC Photo-Interrupter Fork Sensor beside Crank Flywheel
    const tachoGroup = new THREE.Group();
    tachoGroup.name = 'Body_Sensor_HallTachometer';
    tachoGroup.position.set(-0.52, 4.20, -0.16);
    this.driveGroup.add(tachoGroup);

    const forkBase = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.26, 0.16), MAT_IC_PACKAGE);
    tachoGroup.add(forkBase);
    for (const fy of [-0.08, 0.08]) {
      const prong = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.16), MAT_IC_PACKAGE);
      prong.position.set(0.10, fy, 0);
      tachoGroup.add(prong);
    }
    const tachoLed = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.02, 10), makeMat(0x22c55e, { e: 0x22c55e, ei: 1.4 }));
    tachoLed.rotation.x = Math.PI / 2;
    tachoLed.position.set(-0.02, 0.06, -0.085);
    tachoGroup.add(tachoLed);

    // S4 & S5: Precision Roller-Lever Microswitches on Right Guide Column
    for (const [tag, yPos] of [['Top', 5.88], ['Btm', 3.65]]) {
      const limGroup = new THREE.Group();
      limGroup.name = `Body_Sensor_LimitSwitch_${tag}`;
      limGroup.position.set(0.94, yPos, -0.10);
      this.driveGroup.add(limGroup);

      const swBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.10), MAT_IC_PACKAGE);
      limGroup.add(swBody);

      const swCap = new THREE.Mesh(new THREE.BoxGeometry(0.162, 0.06, 0.102), makeMat(0xdc2626, { r: 0.35 }));
      swCap.position.y = -0.06;
      limGroup.add(swCap);

      const leverArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.04), MAT_316SS_ELECTROPOLISHED);
      leverArm.position.set(-0.08, 0.08, 0);
      leverArm.rotation.z = 0.32;
      limGroup.add(leverArm);

      const rollerWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.035, 16), MAT_BRONZE_BUSHING);
      rollerWheel.rotation.x = Math.PI / 2;
      rollerWheel.position.set(-0.16, 0.11, 0);
      limGroup.add(rollerWheel);
    }

    // Forged Connecting Rod with Spherical Heim Rod-End Bearings (Length = 1.15 dm, Coplanar Z = -0.16)
    this.connectingRod = new THREE.Group();
    this.connectingRod.name = 'Pivot_ConnectingRod';
    this.connectingRod.position.set(0, 4.85, -0.16);
    this.driveGroup.add(this.connectingRod);
    this.animNodes.connectingRod = this.connectingRod;

    const rodShank = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.05, 0.06), MAT_ALUM_ANODIZED);
    this.connectingRod.add(rodShank);

    for (const ry of [-0.575, 0.575]) {
      const heimEye = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 24), MAT_316SS_BRUSHED);
      heimEye.rotation.x = Math.PI / 2;
      heimEye.position.y = ry;
      this.connectingRod.add(heimEye);

      const brassBall = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.09, 20), MAT_BRONZE_BUSHING);
      brassBall.rotation.x = Math.PI / 2;
      brassBall.position.y = ry;
      this.connectingRod.add(brassBall);
    }

    // ========================================================================
    // Articulated Vertical Lift Carriage (Pivot_LiftCarriage)
    // Rides on guide shafts, carries lead screw nuts, crosshead, and cantilever arm
    // ========================================================================
    this.carriageGroup = new THREE.Group();
    this.carriageGroup.name = 'Pivot_LiftCarriage';
    this.carriageGroup.position.set(0, 5.60, 0);
    this.driveGroup.add(this.carriageGroup);
    this.animNodes.carriage = this.carriageGroup;

    // Heavy Cast Aluminum Carriage Base Bridge (Spans across guide shafts and lead screws)
    const bridgeBody = new THREE.Mesh(new THREE.BoxGeometry(2.70, 0.28, 0.36), MAT_ALUM_DARK_ANO);
    bridgeBody.name = 'Body_Carriage_Bridge';
    bridgeBody.position.set(0, 0, 0.04);
    this.carriageGroup.add(bridgeBody);

    // Flanged Linear Ball Bushings (LM16LUU) Clamped to Carriage at X = +/- 0.80
    for (const side of [-1, 1]) {
      const sideTag = side < 0 ? 'Left' : 'Right';
      const sShort = side < 0 ? 'L' : 'R';

      const bushGroup = new THREE.Group();
      bushGroup.name = `Pivot_Bushing_Linear_${sideTag}`;
      bushGroup.position.set(side * 0.80, 0, 0);
      this.carriageGroup.add(bushGroup);

      const bushSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.44, 24), MAT_316SS_BRUSHED);
      bushGroup.add(bushSleeve);
      const bushFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.05, 24), MAT_316SS_BRUSHED);
      bushFlange.position.y = -0.19;
      bushGroup.add(bushFlange);
      const wiper = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.46, 20), MAT_RUBBER_NBR);
      bushGroup.add(wiper);

      // Flanged Bronze Anti-Backlash Lead Screw Nut at X = +/- 1.22, Z = 0.08
      const nutGroup = new THREE.Group();
      nutGroup.name = `Pivot_Nut_LeadScrew_${sideTag}`;
      nutGroup.position.set(side * 1.22, 0, 0.08);
      this.carriageGroup.add(nutGroup);

      const nutBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.22, 20), MAT_BRONZE_BUSHING);
      nutGroup.add(nutBarrel);
      const nutFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 24), MAT_BRONZE_BUSHING);
      nutFlange.position.y = -0.09;
      nutGroup.add(nutFlange);

      for (const ang of [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]) {
        const nb = makeHexSocketBolt(0.010, 0.03, `Fastener_HexM3_NutClamp_${sShort}`);
        nb.position.set(Math.cos(ang) * 0.11, -0.09, Math.sin(ang) * 0.11);
        nutGroup.add(nb);
      }
    }

    // Machined Bronze/Aluminum Crosshead Slider Bridge & Wrist Pin (Coplanar Z = -0.16)
    this.crosshead = new THREE.Group();
    this.crosshead.name = 'Pivot_Crosshead_Slider';
    this.crosshead.position.set(0, 0, -0.16);
    this.carriageGroup.add(this.crosshead);
    this.animNodes.crosshead = this.crosshead;

    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(1.50, 0.22, 0.22), MAT_ALUM_DARK_ANO);
    this.crosshead.add(crossBeam);

    const bronzeJournal = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.26, 24), MAT_BRONZE_BUSHING);
    bronzeJournal.rotation.x = Math.PI / 2;
    this.crosshead.add(bronzeJournal);

    const wristPin = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.32, 20), MAT_CHROME_STEEL);
    wristPin.rotation.x = Math.PI / 2;
    wristPin.name = 'Pivot_Pin_CrossheadWrist';
    this.crosshead.add(wristPin);

    // ========================================================================
    // Heavy-Duty Cantilever Arm (Body_Carriage_CantileverArm)
    // Rigidly articulates carriage (Z = 0 in driveGroup, 1.00 world) forward
    // through tower front slot (z = -0.80) to basket head (z = -1.85, -0.85 world)
    // ========================================================================
    const armGroup = new THREE.Group();
    armGroup.name = 'Body_Carriage_CantileverArm';
    armGroup.position.set(0, 0, 0);
    this.carriageGroup.add(armGroup);
    this.animNodes.cantileverArm = armGroup;

    // Main Boxed I-Beam Arm Body extending from z = -0.10 to z = -1.85 (span = 1.75 dm = 175 mm)
    const armLength = 1.75;
    const armBeam = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.30, armLength), MAT_ALUM_DARK_ANO);
    armBeam.position.set(0, 0, -0.10 - armLength / 2);
    armBeam.castShadow = true;
    armGroup.add(armBeam);

    // Top and Bottom Stiffening Flanges
    for (const fy of [-0.14, 0.14]) {
      const armFlange = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.035, armLength + 0.05), MAT_316SS_BRUSHED);
      armFlange.position.set(0, fy, -0.10 - armLength / 2);
      armGroup.add(armFlange);
    }

    // Heavy Stiffening Side Gussets (Left & Right)
    for (const side of [-1, 1]) {
      const gusset = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.95), MAT_ALUM_DARK_ANO);
      gusset.position.set(side * 0.31, 0, -0.65);
      armGroup.add(gusset);
    }

    // Heavy Front Mounting Flange Plate at z = -1.85 (Bolts directly into Body_DriveHead)
    const facePlate = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.34, 0.06), MAT_316SS_BRUSHED);
    facePlate.name = 'Body_Cantilever_FacePlate';
    facePlate.position.set(0, 0, -1.84);
    armGroup.add(facePlate);

    // 4 Genuine M6 Hex-Socket Structural Fasteners bolting arm directly to Drive Head
    for (const [bx, by] of [[-0.55, -0.09], [0.55, -0.09], [-0.55, 0.09], [0.55, 0.09]]) {
      const fb = makeHexSocketBolt(0.018, 0.06, 'Fastener_HexM6_DriveHead');
      fb.rotation.x = Math.PI / 2;
      fb.position.set(bx, by, -1.87);
      armGroup.add(fb);
    }

    // ========================================================================
    // Tower Front Slot Trim Tracks & Rubber Accordion Bellows Boot
    // Sealing the front vertical slot against splashes
    // ========================================================================
    // Slot Tracks on Tower Front Face (Z = -0.80 relative to driveGroup)
    for (const side of [-1, 1]) {
      const track = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.80, 0.05), MAT_ALUM_ANODIZED);
      track.name = `Body_Tower_SlotTrack_${side < 0 ? 'Left' : 'Right'}`;
      track.position.set(side * 0.44, 4.55, -0.80);
      this.driveGroup.add(track);
    }

    // Upper Pleated Accordion Rubber Bellows Boot (Above cantilever arm)
    const bellowsGeo = new THREE.BoxGeometry(0.78, 1.0, 0.08);
    this.bellowsUpper = new THREE.Mesh(bellowsGeo, MAT_RUBBER_NBR);
    this.bellowsUpper.name = 'Body_Bellows_LiftSlot_Upper';
    this.bellowsUpper.position.set(0, 5.80, -0.79);
    this.driveGroup.add(this.bellowsUpper);

    // Lower Pleated Accordion Rubber Bellows Boot (Below cantilever arm)
    this.bellowsLower = new THREE.Mesh(bellowsGeo, MAT_RUBBER_NBR);
    this.bellowsLower.name = 'Body_Bellows_LiftSlot_Lower';
    this.bellowsLower.position.set(0, 3.40, -0.79);
    this.driveGroup.add(this.bellowsLower);

    this.animNodes.bellows = {
      upper: this.bellowsUpper,
      lower: this.bellowsLower
    };

    // ========================================================================
    // Cantilevered Horizontal Basket Drive Head Arm (Body_DriveHead)
    // Sits at Z = -0.85 world, mechanically bolted to cantilever arm
    // ========================================================================
    this.driveHead = new THREE.Group();
    this.driveHead.name = 'Body_DriveHead';
    this.driveHead.position.set(0, 5.60, -0.85);
    this.scene.add(this.driveHead);
    this.animNodes.driveHead = this.driveHead;

    const barMesh = new THREE.Mesh(new THREE.BoxGeometry(3.40, 0.36, 0.86), MAT_DRIVE_HEAD);
    barMesh.castShadow = true;
    this.driveHead.add(barMesh);

    const topAccent = new THREE.Mesh(new THREE.BoxGeometry(3.32, 0.03, 0.78), MAT_ALUM_DARK_ANO);
    topAccent.position.y = 0.19;
    this.driveHead.add(topAccent);

    // Rear Mating Pocket for Cantilever Arm Flange
    const rearPocket = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.34, 0.04), MAT_ALUM_DARK_ANO);
    rearPocket.position.set(0, 0, 0.44);
    this.driveHead.add(rearPocket);

    const beakerCenters = [-0.825, 0.825];
    for (let stn = 0; stn < 2; stn++) {
      const colletGroup = new THREE.Group();
      colletGroup.name = `Knob_Collet_QuickRelease_0${stn + 1}`;
      colletGroup.position.set(beakerCenters[stn], -0.22, 0);
      this.driveHead.add(colletGroup);

      const colletBody = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.28, 28), MAT_316SS_BRUSHED);
      colletGroup.add(colletBody);
      const colletRing = new THREE.Mesh(new THREE.TorusGeometry(0.132, 0.018, 10, 28), MAT_ALUM_DARK_ANO);
      colletRing.rotation.x = Math.PI / 2;
      colletGroup.add(colletRing);
    }
  }

  // --------------------------------------------------------------------------
  // Dual USP Apparatus A Basket Assemblies & 6-Tube Racks
  // --------------------------------------------------------------------------
  buildApparatusBaskets() {
    const beakerCenters = [-0.825, 0.825];

    for (let stn = 0; stn < 2; stn++) {
      const basketGroup = new THREE.Group();
      basketGroup.name = `Pivot_BasketArm_${stn === 0 ? 'Left' : 'Right'}`;
      basketGroup.position.set(beakerCenters[stn], 0, 0);
      this.driveHead.add(basketGroup);
      this.animNodes.baskets.push(basketGroup);

      // Precision 316L Suspension Rod from Quick-Release Collet (-0.22) to Basket Top Plate (-0.875)
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 16), MAT_316SS_ELECTROPOLISHED);
      rod.name = `Pivot_Rod_Suspension_0${stn + 1}`;
      rod.position.y = -0.54;
      basketGroup.add(rod);

      const basketFrame = new THREE.Group();
      basketFrame.name = `Pivot_Basket_Assembly_0${stn + 1}`;
      basketFrame.position.y = -1.65;
      basketGroup.add(basketFrame);

      const plateGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.055, 32);
      const topPlate = new THREE.Mesh(plateGeo, MAT_BASKET_ACRYLIC);
      topPlate.name = `Glass_Basket_Plate_Top_0${stn + 1}`;
      topPlate.position.y = 0.775;
      topPlate.renderOrder = 10;
      basketFrame.add(topPlate);

      const btmPlate = new THREE.Mesh(plateGeo, MAT_BASKET_ACRYLIC);
      btmPlate.name = `Glass_Basket_Plate_Btm_0${stn + 1}`;
      btmPlate.position.y = 0;
      btmPlate.renderOrder = 10;
      basketFrame.add(btmPlate);

      // Stainless Steel Bottom Clamping Ring + 10-Mesh Woven Wire Cloth
      const ssRing = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.018, 10, 32), MAT_316SS_BRUSHED);
      ssRing.rotation.x = Math.PI / 2;
      ssRing.position.y = -0.025;
      basketFrame.add(ssRing);

      const meshScreen = new THREE.Mesh(new THREE.CylinderGeometry(0.435, 0.435, 0.012, 32), MAT_316SS_ELECTROPOLISHED);
      meshScreen.name = `Body_Mesh_Screen_0${stn + 1}`;
      meshScreen.position.y = -0.012;
      basketFrame.add(meshScreen);

      for (let i = 0; i < 3; i++) {
        const ang = (i * 2 * Math.PI) / 3;
        const tx = Math.cos(ang) * 0.40, tz = Math.sin(ang) * 0.40;
        const tie = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.85, 12), MAT_316SS_BRUSHED);
        tie.position.set(tx, 0.3875, tz);
        basketFrame.add(tie);

        const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.048, 16), MAT_BRASS_FITTING);
        nut.name = `Fastener_Nut_Knurled_M3_${stn + 1}_0${i + 1}`;
        nut.position.set(tx, 0.81, tz);
        basketFrame.add(nut);
      }

      for (let i = 0; i < 6; i++) {
        const ang = (i * 2 * Math.PI) / 6;
        const tx = Math.cos(ang) * 0.27, tz = Math.sin(ang) * 0.27;

        const tube = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1275, 0.1275, 0.775, 24, 1, true),
          MAT_BASKET_ACRYLIC
        );
        tube.name = `Glass_Tube_Acrylic_${stn + 1}_0${i + 1}`;
        tube.position.set(tx, 0.3875, tz);
        tube.renderOrder = 10;
        basketFrame.add(tube);

        const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.1035, 0.1035, 0.095, 20), MAT_BASKET_ACRYLIC);
        disk.name = `Glass_Disk_Fluted_${stn + 1}_0${i + 1}`;
        disk.position.set(tx, 0.20, tz);
        disk.renderOrder = 11;
        basketFrame.add(disk);

        const tabMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.042, 24), MAT_TABLET_WHITE);
        tabMesh.name = `Body_Tablet_Sample_${stn + 1}_0${i + 1}`;
        tabMesh.position.set(tx, 0.05, tz);
        basketFrame.add(tabMesh);
        this.animNodes.tablets.push(tabMesh);

        // Meniscus CO2 Effervescent Foam Cap Disc at top of each tube
        const foamDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.035, 20), MAT_FOAM_HEAD);
        foamDisc.name = `Glass_FoamHead_0${stn + 1}_0${i + 1}`;
        foamDisc.position.set(tx, 0.775, tz);
        foamDisc.visible = false;
        foamDisc.renderOrder = 12;
        basketFrame.add(foamDisc);
        this.tubeFoamPlates.push(foamDisc);
      }
    }
  }

  // --------------------------------------------------------------------------
  // Operator Console, UI_LCD Display & Tactile Buttons
  // --------------------------------------------------------------------------
  buildOperatorConsole() {
    this.consoleGroup = new THREE.Group();
    this.consoleGroup.name = 'Body_Console_Operator';
    this.consoleGroup.position.set(0.35, 1.40, -2.01);
    this.scene.add(this.consoleGroup);

    const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.52, 1.48, 0.06), MAT_CONSOLE_BEZEL);
    this.consoleGroup.add(bezel);

    const trimFrame = new THREE.Mesh(new THREE.BoxGeometry(2.56, 1.52, 0.03), MAT_316SS_BRUSHED);
    trimFrame.position.z = 0.015;
    this.consoleGroup.add(trimFrame);

    const lcdW = 1.68, lcdH = 0.84;
    this.lcdCanvas = document.createElement('canvas');
    this.lcdCanvas.width = 1024;
    this.lcdCanvas.height = 512;
    this.lcdCtx = this.lcdCanvas.getContext('2d');

    this.lcdTexture = new THREE.CanvasTexture(this.lcdCanvas);
    this.lcdTexture.colorSpace = THREE.SRGBColorSpace;
    this.lcdTexture.flipY = false;

    const lcdGeo = makeOperatorFacingQuadGeo(lcdW, lcdH);
    this.lcdMesh = new THREE.Mesh(
      lcdGeo,
      new THREE.MeshBasicMaterial({ map: this.lcdTexture, side: THREE.DoubleSide })
    );
    this.lcdMesh.name = 'UI_LCD';
    this.lcdMesh.position.set(0, 0.22, -0.035);
    this.consoleGroup.add(this.lcdMesh);

    const lens = new THREE.Mesh(new THREE.BoxGeometry(lcdW + 0.04, lcdH + 0.04, 0.012), MAT_BEAKER_BOROSILICATE);
    lens.name = 'Glass_LCDLens';
    lens.position.set(0, 0.22, -0.044);
    lens.raycast = () => {}; // Transparent to raycasting so touch clicks pass directly to UI_LCD
    this.consoleGroup.add(lens);

    const btnConfigs = [
      { name: 'Btn_Start', label: 'START', color: 0x16a34a, x: -0.84 },
      { name: 'Btn_Stop',  label: 'STOP',  color: 0xdc2626, x: -0.42 },
      { name: 'Btn_Temp',  label: 'TEMP',  color: 0xea580c, x:  0.00 },
      { name: 'Btn_Time',  label: 'TIME',  color: 0x2563eb, x:  0.42 },
      { name: 'Btn_Lift',  label: 'LIFT',  color: 0x64748b, x:  0.84 }
    ];

    this.buttons = [];
    for (const b of btnConfigs) {
      const btn = makeTactileButton(b.name, b.label, b.color, 0.26, 0.16);
      btn.position.set(b.x, -0.44, -0.034);
      this.consoleGroup.add(btn);
      this.buttons.push(btn);
    }

    this.renderLCD();
  }

  // --------------------------------------------------------------------------
  // Internal Electronics, Power Supply, Pump, Optics, Ports & Wiring Harnesses
  // (Genuine Industrial CAD Detail — Zero Floating Lego Signboards)
  // --------------------------------------------------------------------------
  buildElectronicsBay() {
    this.electronicsGroup = new THREE.Group();
    this.electronicsGroup.name = 'Body_ElectronicsBay';
    this.scene.add(this.electronicsGroup);

    // ========================================================================
    // 1. Main FR-4 Motherboard PCB (Body_PCB_Motherboard)
    // ========================================================================
    const pcbGroup = new THREE.Group();
    pcbGroup.name = 'Body_PCB_Motherboard';
    pcbGroup.position.set(0.35, 0.34, 0.25);
    this.electronicsGroup.add(pcbGroup);

    // Brass M3 Hex Standoffs anchoring PCB to Floor Pan
    for (const [sx, sz] of [[-0.82, -0.58], [0.82, -0.58], [-0.82, 0.58], [0.82, 0.58]]) {
      const standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.14, 6), MAT_BRASS_FITTING);
      standoff.position.set(sx, -0.07, sz);
      pcbGroup.add(standoff);
      const screw = makeHexSocketBolt(0.015, 0.035, 'Fastener_HexM3_PCB');
      screw.position.set(sx, 0.018, sz);
      pcbGroup.add(screw);
    }

    // High-DPI Procedural Solder-Mask & Copper Trace Texture (2048x1400)
    const pcbCvs = document.createElement('canvas');
    pcbCvs.width = 2048;
    pcbCvs.height = 1400;
    const pctx = pcbCvs.getContext('2d');
    pctx.fillStyle = '#073b22';
    pctx.fillRect(0, 0, 2048, 1400);

    // Ground plane copper pours & hatched thermal relief zones
    pctx.fillStyle = 'rgba(16, 185, 129, 0.10)';
    pctx.fillRect(40, 40, 1968, 1320);

    // Dense etched differential pairs & bus copper traces
    pctx.strokeStyle = '#15803d';
    pctx.lineWidth = 4;
    for (let i = 0; i < 65; i++) {
      pctx.beginPath();
      pctx.moveTo(80 + i * 28, 120);
      pctx.lineTo(140 + i * 26, 680);
      pctx.lineTo(95 + i * 27, 1280);
      pctx.stroke();
    }
    for (let j = 0; j < 40; j++) {
      pctx.beginPath();
      pctx.moveTo(100, 100 + j * 30);
      pctx.lineTo(1024, 140 + j * 28);
      pctx.lineTo(1940, 100 + j * 30);
      pctx.stroke();
    }

    // Gold ENIG Via array
    for (let vx = 100; vx < 1950; vx += 60) {
      for (let vz = 100; vz < 1300; vz += 60) {
        pctx.fillStyle = '#d4af37';
        pctx.beginPath();
        pctx.arc(vx, vz, 6, 0, Math.PI * 2);
        pctx.fill();
        pctx.fillStyle = '#041f12';
        pctx.beginPath();
        pctx.arc(vx, vz, 2.5, 0, Math.PI * 2);
        pctx.fill();
      }
    }

    // Crisp White PCB Silkscreen Legend (Component outlines, pin-1 dots, bus labels)
    pctx.strokeStyle = 'rgba(248, 250, 252, 0.85)';
    pctx.lineWidth = 3;
    pctx.strokeRect(30, 30, 1988, 1340);
    pctx.fillStyle = '#f8fafc';
    pctx.font = '700 30px "JetBrains Mono", monospace';
    pctx.fillText('ERWEKA ZT-322 MAIN CONTROL BOARD REV 4.2 · P/N 840-3220-04', 70, 82);
    pctx.font = '600 22px "JetBrains Mono", monospace';
    pctx.fillStyle = '#a7f3d0';
    pctx.fillText('U1: STM32H743ZIT6', 780, 480);
    pctx.fillText('U2: 512MB LPDDR4', 1290, 460);
    pctx.fillText('U3: 16GB eMMC CFR21', 1290, 960);
    pctx.fillText('U4: ADS1256 24-BIT ADC', 260, 460);
    pctx.fillText('BT1: CR2032 RTC BACKUP', 260, 1060);
    pctx.fillText('U5: ESP32-WROOM BLE/WIFI', 1420, 1270);
    pctx.fillText('J1: 24VDC / 5VDC PWR IN', 80, 1335);

    const pcbTex = new THREE.CanvasTexture(pcbCvs);
    pcbTex.colorSpace = THREE.SRGBColorSpace;
    pcbTex.anisotropy = 8;

    const pcbBoard = new THREE.Mesh(
      new THREE.BoxGeometry(1.84, 0.028, 1.32),
      [
        MAT_PCB_SOLDERMASK,
        MAT_PCB_SOLDERMASK,
        new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.35, metalness: 0.18 }),
        MAT_PCB_SOLDERMASK,
        MAT_PCB_SOLDERMASK,
        MAT_PCB_SOLDERMASK
      ]
    );
    pcbGroup.add(pcbBoard);

    // U1: Main Microcontroller Core (STM32H743 LQFP-176 with 4-sided Gull-Wing Lead Frame)
    const mcuGroup = new THREE.Group();
    mcuGroup.name = 'Body_Part_MCU_Core';
    mcuGroup.position.set(-0.08, 0.028, -0.04);
    pcbGroup.add(mcuGroup);

    const mcuPkg = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.032, 0.32), MAT_IC_PACKAGE);
    mcuGroup.add(mcuPkg);
    // Gull-wing metallic QFP leads along all 4 sides
    for (let p = -7; p <= 7; p++) {
      const offset = p * 0.019;
      const leadX = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.008, 0.008), MAT_316SS_ELECTROPOLISHED);
      leadX.position.set(0, -0.008, offset);
      mcuGroup.add(leadX);
      const leadZ = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.008, 0.36), MAT_316SS_ELECTROPOLISHED);
      leadZ.position.set(offset, -0.008, 0);
      mcuGroup.add(leadZ);
    }
    const mcuLaserMark = makeFlushSurfaceLabel(
      'U1 · STM32H743',
      'ARM CORTEX-M7 480MHz',
      0.29, 0.29, '#111318', '#e2e8f0', '#334155'
    );
    mcuLaserMark.rotation.x = -Math.PI / 2;
    mcuLaserMark.rotation.z = Math.PI;
    mcuLaserMark.position.y = 0.017;
    mcuGroup.add(mcuLaserMark);

    // U2: Volatile System Memory (512 MB LPDDR4 SDRAM BGA/TSOP Package)
    const ramGroup = new THREE.Group();
    ramGroup.name = 'Body_Part_RAM_Chip';
    ramGroup.position.set(0.38, 0.026, -0.18);
    pcbGroup.add(ramGroup);

    const ramPkg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.026, 0.16), MAT_IC_PACKAGE);
    ramGroup.add(ramPkg);
    for (let p = -5; p <= 5; p++) {
      const rLead = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.008, 0.19), MAT_316SS_ELECTROPOLISHED);
      rLead.position.set(p * 0.019, -0.006, 0);
      ramGroup.add(rLead);
    }
    const ramLaserMark = makeFlushSurfaceLabel(
      'U2 · 512MB LPDDR4',
      'MICRON MT53E · RAM',
      0.22, 0.14, '#111318', '#38bdf8', '#334155'
    );
    ramLaserMark.rotation.x = -Math.PI / 2;
    ramLaserMark.rotation.z = Math.PI;
    ramLaserMark.position.y = 0.014;
    ramGroup.add(ramLaserMark);

    // U3: Non-Volatile Industrial eMMC / SSD Storage Module (16 GB 21 CFR Part 11 Vault)
    const ssdGroup = new THREE.Group();
    ssdGroup.name = 'Body_Part_SSD_Module';
    ssdGroup.position.set(0.42, 0.028, 0.18);
    pcbGroup.add(ssdGroup);

    const ssdSubstrate = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.012, 0.24), makeMat(0x065f46, { r: 0.4, m: 0.2 }));
    ssdSubstrate.position.y = -0.008;
    ssdGroup.add(ssdSubstrate);
    const ssdPkg = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.028, 0.21), MAT_IC_PACKAGE);
    ssdGroup.add(ssdPkg);
    const ssdLaserMark = makeFlushSurfaceLabel(
      'U3 · 16GB eMMC SSD',
      '21 CFR 11 FLASH VAULT',
      0.25, 0.19, '#111318', '#22c55e', '#334155'
    );
    ssdLaserMark.rotation.x = -Math.PI / 2;
    ssdLaserMark.rotation.z = Math.PI;
    ssdLaserMark.position.y = 0.015;
    ssdGroup.add(ssdLaserMark);

    // U4: 24-Bit Delta-Sigma Temperature ADC (ADS1256 for PT100 RTD)
    const adcGroup = new THREE.Group();
    adcGroup.name = 'Body_Part_ADC_24Bit';
    adcGroup.position.set(-0.48, 0.025, -0.22);
    pcbGroup.add(adcGroup);

    const adcPkg = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.024, 0.16), MAT_IC_PACKAGE);
    adcGroup.add(adcPkg);
    for (let p = -4; p <= 4; p++) {
      const aLead = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.007, 0.008), MAT_316SS_ELECTROPOLISHED);
      aLead.position.set(0, -0.006, p * 0.016);
      adcGroup.add(aLead);
    }
    const adcLaserMark = makeFlushSurfaceLabel(
      'U4 · ADS1256',
      '24-BIT PT100 ADC',
      0.18, 0.14, '#111318', '#f59e0b', '#334155'
    );
    adcLaserMark.rotation.x = -Math.PI / 2;
    adcLaserMark.rotation.z = Math.PI;
    adcLaserMark.position.y = 0.013;
    adcGroup.add(adcLaserMark);

    // BT1: Real-Time Clock Backup Coin Cell Holder & CR2032 Lithium Cell
    const rtcGroup = new THREE.Group();
    rtcGroup.name = 'Body_Part_RTC_BatterySocket';
    rtcGroup.position.set(-0.48, 0.025, 0.24);
    pcbGroup.add(rtcGroup);

    const socketRing = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.028, 28), MAT_IC_PACKAGE);
    rtcGroup.add(socketRing);
    const coinCell = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.032, 28), MAT_316SS_ELECTROPOLISHED);
    coinCell.position.y = 0.008;
    rtcGroup.add(coinCell);
    const springClip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.006, 0.035), MAT_BRASS_FITTING);
    springClip.position.set(-0.02, 0.027, 0);
    rtcGroup.add(springClip);

    // U5: Shielded Wi-Fi 802.11ac + Bluetooth 5.2 BLE Radio Module + U.FL Coax
    const wifiGroup = new THREE.Group();
    wifiGroup.name = 'Body_Part_WiFi_BLE_Module';
    wifiGroup.position.set(0.60, 0.028, 0.44);
    pcbGroup.add(wifiGroup);

    const wifiPcb = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.012, 0.22), makeMat(0x0f172a, { r: 0.4 }));
    wifiPcb.position.y = -0.008;
    wifiGroup.add(wifiPcb);
    const rfCan = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.030, 0.18), MAT_316SS_BRUSHED);
    wifiGroup.add(rfCan);
    // Gold castellated edge pads & U.FL coax micro-connector
    const uflJack = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.018, 16), MAT_GOLD_CONTACT);
    uflJack.position.set(0.11, 0.006, 0.06);
    wifiGroup.add(uflJack);
    const wifiMark = makeFlushSurfaceLabel(
      'U5 · WIFI + BLE 5.2',
      'FCC/CE RF SHIELD CAN',
      0.22, 0.16, '#cbd5e1', '#0f172a', '#64748b'
    );
    wifiMark.rotation.x = -Math.PI / 2;
    wifiMark.rotation.z = Math.PI;
    wifiMark.position.y = 0.016;
    wifiGroup.add(wifiMark);

    // Surface-Mount Aluminum Electrolytic Capacitors, Shielded Inductors & Quartz Crystal
    for (const [cx, cz] of [[-0.74, -0.42], [-0.74, -0.24], [-0.74, -0.06], [0.08, -0.44], [0.22, -0.44]]) {
      const smdCap = new THREE.Group();
      smdCap.position.set(cx, 0.014, cz);
      const capBase = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.012, 0.08), MAT_IC_PACKAGE);
      smdCap.add(capBase);
      const capCan = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.075, 20), MAT_316SS_ELECTROPOLISHED);
      capCan.position.y = 0.042;
      smdCap.add(capCan);
      pcbGroup.add(smdCap);
    }

    // Shielded Buck-Converter Ferrite Power Inductors (4R7 / 100)
    for (const [lx, lz] of [[-0.58, -0.44], [-0.42, -0.44]]) {
      const ind = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.055, 0.11), makeMat(0x27272a, { r: 0.45, m: 0.35 }));
      ind.position.set(lx, 0.04, lz);
      pcbGroup.add(ind);
    }

    // HC-49S Metal Can 25.000 MHz Quartz Crystal Oscillator beside MCU
    const xtal = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.032, 0.048), MAT_316SS_ELECTROPOLISHED);
    xtal.position.set(-0.28, 0.028, -0.04);
    pcbGroup.add(xtal);

    // Green Phoenix Contact Pluggable Screw-Terminal Headers along PCB Perimeter
    const phoenixGreen = makeMat(0x16a34a, { r: 0.35, m: 0.1 });
    for (const [hx, hz, hw, hd] of [
      [-0.78, 0.48, 0.22, 0.09],
      [-0.48, 0.54, 0.28, 0.09],
      [-0.08, 0.54, 0.34, 0.09],
      [0.32, 0.54, 0.24, 0.09]
    ]) {
      const hdr = new THREE.Mesh(new THREE.BoxGeometry(hw, 0.09, hd), phoenixGreen);
      hdr.position.set(hx, 0.055, hz);
      pcbGroup.add(hdr);
    }

    // Status LED Array on Motherboard (5V, 24V, MCU Heartbeat, Heater PWM)
    const ledColors = [0x22c55e, 0x22c55e, 0x38bdf8, 0xf59e0b];
    for (let i = 0; i < 4; i++) {
      const led = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 0.022, 12),
        makeMat(ledColors[i], { e: ledColors[i], ei: 1.8 })
      );
      led.position.set(-0.22 + i * 0.08, 0.026, -0.44);
      pcbGroup.add(led);
    }

    // ========================================================================
    // 2. Three Industrial Microstepping Motor Drivers (DM542 Extruded Fin Cases)
    // ========================================================================
    for (let i = 0; i < 3; i++) {
      const drvGroup = new THREE.Group();
      drvGroup.name = `Body_Driver_Stepper_0${i + 1}`;
      drvGroup.position.set(-0.55 + i * 0.58, 0.52, 1.15);
      this.electronicsGroup.add(drvGroup);

      // Black powder-coated electronics housing
      const drvCase = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.52, 0.22), MAT_IC_PACKAGE);
      drvGroup.add(drvCase);

      // Extruded Blue-Anodized Multi-Fin Rear Heatsink
      const hsBase = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.52, 0.04), MAT_ALUM_BLUE_ANO);
      hsBase.position.z = -0.13;
      drvGroup.add(hsBase);
      for (let f = -4; f <= 4; f++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.52, 0.08), MAT_ALUM_BLUE_ANO);
        fin.position.set(f * 0.046, 0, -0.18);
        drvGroup.add(fin);
      }

      // Top Pluggable Phoenix Terminal Connector + Red 8-Switch DIP Bank
      const plugHdr = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.07, 0.12), phoenixGreen);
      plugHdr.position.set(0, 0.29, 0.02);
      drvGroup.add(plugHdr);

      const dipBank = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.02), makeMat(0xdc2626, { r: 0.4 }));
      dipBank.position.set(-0.08, -0.14, 0.112);
      drvGroup.add(dipBank);

      // Flush Silkscreen Driver Specification Sticker on Front Face
      const drvNames = ['DRV1 · M1 SERVO', 'DRV2 · M2 LIFT L', 'DRV3 · M3 LIFT R'];
      const drvSpec = makeFlushSurfaceLabel(
        drvNames[i],
        '24VDC · 4.2A PEAK · 1/32 STEP',
        0.40, 0.22, '#0f172a', '#38bdf8', '#334155'
      );
      drvSpec.position.set(0, 0.06, 0.114);
      drvGroup.add(drvSpec);
    }

    // ========================================================================
    // 3. Mean Well LRS-150-24 Enclosed Switching PSU (Body_Assembly_PowerSupply)
    // ========================================================================
    const psuGroup = new THREE.Group();
    psuGroup.name = 'Body_Assembly_PowerSupply';
    psuGroup.position.set(-1.28, 0.52, 0.12);
    this.electronicsGroup.add(psuGroup);

    // Internal PSU Power Components visible through perforated honeycomb cover
    const psuInternalPcb = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.025, 1.56), MAT_PCB_SOLDERMASK);
    psuInternalPcb.position.y = -0.26;
    psuGroup.add(psuInternalPcb);

    // Two primary 400V 330uF bulk electrolytic filter capacitors inside PSU
    for (const cz of [-0.46, -0.14]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.42, 24), makeMat(0x1e3a8a, { r: 0.3, m: 0.3 }));
      cap.position.set(-0.24, -0.05, cz);
      psuGroup.add(cap);
      const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.01, 20), MAT_316SS_ELECTROPOLISHED);
      capTop.position.set(-0.24, 0.165, cz);
      psuGroup.add(capTop);
    }

    // High-frequency yellow Mylar-taped flyback chopper transformer inside PSU
    const chopperCore = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.36, 0.28), makeMat(0xeab308, { r: 0.35, m: 0.1 }));
    chopperCore.position.set(0.12, -0.06, -0.12);
    psuGroup.add(chopperCore);

    // Internal extruded aluminum MOSFET/Schottky heatsink plate inside PSU
    const psuIntHs = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 1.10), MAT_ALUM_ANODIZED);
    psuIntHs.position.set(0.32, -0.04, 0.05);
    psuGroup.add(psuIntHs);

    // Perforated Sheet-Metal Honeycomb Cage (Procedural Alpha/Color Perforation Texture)
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
    const matPerfCage = new THREE.MeshStandardMaterial({
      map: perfTex,
      roughness: 0.32,
      metalness: 0.78,
      transparent: true,
      opacity: 0.90
    });

    const psuShell = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.62, 1.62), matPerfCage);
    psuGroup.add(psuShell);

    // Flush Industrial Rating Label on Top of PSU Cage
    const psuSpecLabel = makeFlushSurfaceLabel(
      'PSU1 · LRS-150-24 SMPS',
      'IN: 115/230VAC · OUT: 24VDC 6.5A / 5VDC',
      0.86, 0.42, '#0f172a', '#f8fafc', '#475569'
    );
    psuSpecLabel.rotation.x = -Math.PI / 2;
    psuSpecLabel.rotation.z = Math.PI;
    psuSpecLabel.position.set(0, 0.314, -0.18);
    psuGroup.add(psuSpecLabel);

    // 7-Position Barrier Terminal Strip on Front End of PSU (L, N, PE, -V, -V, +V, +V)
    const barrierBlock = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.22, 0.18), MAT_IC_PACKAGE);
    barrierBlock.position.set(0, -0.14, 0.88);
    psuGroup.add(barrierBlock);

    const ferruleColors = [0x92400e, 0x2563eb, 0x16a34a, 0x1e293b, 0x1e293b, 0xdc2626, 0xdc2626];
    for (let t = 0; t < 7; t++) {
      const tx = -0.36 + t * 0.12;
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.04, 16), MAT_316SS_ELECTROPOLISHED);
      screw.position.set(tx, -0.02, 0.88);
      psuGroup.add(screw);
      // Partition barrier wall
      if (t < 6) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.25, 0.19), MAT_IC_PACKAGE);
        wall.position.set(tx + 0.06, -0.13, 0.88);
        psuGroup.add(wall);
      }
      // Insulated Crimp Ferrule Boot exiting terminal
      const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.08, 12), makeMat(ferruleColors[t], { r: 0.4 }));
      ferrule.rotation.x = Math.PI / 2;
      ferrule.position.set(tx, -0.14, 0.99);
      psuGroup.add(ferrule);
    }

    // Orange V-ADJ Trimmer Potentiometer & Green DC-OK LED beside Barrier Strip
    const vAdjPot = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 14), makeMat(0xf97316, { r: 0.3 }));
    vAdjPot.position.set(0.42, 0.02, 0.84);
    psuGroup.add(vAdjPot);

    const psuLed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.03, 12), makeMat(0x22c55e, { e: 0x22c55e, ei: 2.0 }));
    psuLed.position.set(0.42, 0.08, 0.84);
    psuGroup.add(psuLed);

    // ========================================================================
    // 4. Toroidal Step-Down Isolation Transformer (Body_Part_ToroidalTransformer)
    // ========================================================================
    const toroidGroup = new THREE.Group();
    toroidGroup.name = 'Body_Part_ToroidalTransformer';
    toroidGroup.position.set(-1.28, 0.38, -1.02);
    this.electronicsGroup.add(toroidGroup);

    // Neoprene rubber isolation pad underneath toroid
    const neoPad = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.03, 32), MAT_RUBBER_CORD);
    neoPad.position.y = -0.17;
    toroidGroup.add(neoPad);

    // Helical Enamel-Copper Wound Toroid Core
    const toroidCore = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.14, 24, 48), MAT_TOROID_WINDING);
    toroidCore.rotation.x = Math.PI / 2;
    toroidGroup.add(toroidCore);

    // Outer Clear Kapton/Mylar Insulation Belly Band around Toroid Perimeter
    const kaptonBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.452, 0.452, 0.18, 36, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    );
    toroidGroup.add(kaptonBand);

    // Potted Epoxy Center Core + Dished Galvanized Steel Mounting Washer + M8 Center Bolt
    const epoxyCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.25, 24), MAT_IC_PACKAGE);
    toroidGroup.add(epoxyCenter);

    const dishedWasher = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.03, 32), MAT_316SS_BRUSHED);
    dishedWasher.position.y = 0.14;
    toroidGroup.add(dishedWasher);

    const centerBolt = makeHexSocketBolt(0.035, 0.08, 'Fastener_HexM8_ToroidMount');
    centerBolt.position.y = 0.155;
    toroidGroup.add(centerBolt);

    const toroidSpec = makeFlushSurfaceLabel(
      'T1 · 180VA TOROID',
      '230V / 24VAC ISOLATION',
      0.38, 0.18, '#0f172a', '#f59e0b', '#475569'
    );
    toroidSpec.rotation.x = -Math.PI / 2;
    toroidSpec.rotation.z = Math.PI;
    toroidSpec.position.set(0, 0.16, 0.20);
    toroidGroup.add(toroidSpec);

    // ========================================================================
    // 5. Solid-State Relay (SSR) on 11-Fin Extruded Heatsink + DIN Rail + PE Lug
    // ========================================================================
    const dinRail = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.04, 0.22), MAT_316SS_BRUSHED);
    dinRail.name = 'Body_DINRail_Power';
    dinRail.position.set(-1.28, 0.19, 1.32);
    this.electronicsGroup.add(dinRail);

    const ssrGroup = new THREE.Group();
    ssrGroup.name = 'Body_Heatsink_SSR';
    ssrGroup.position.set(-1.32, 0.44, 1.32);
    this.electronicsGroup.add(ssrGroup);

    // 11-Fin Deep Extruded Black-Anodized Aluminum Heatsink
    const hsCore = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.44), MAT_ALUM_DARK_ANO);
    hsCore.position.y = -0.08;
    ssrGroup.add(hsCore);
    for (let f = -5; f <= 5; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.22, 0.44), MAT_ALUM_DARK_ANO);
      fin.position.set(f * 0.042, -0.19, 0);
      ssrGroup.add(fin);
    }

    // Industrial Hockey-Puck Solid State Relay (Body_Relay_SSR_Heater)
    const ssrBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.34), makeMat(0xe2e8f0, { r: 0.35, m: 0.1 }));
    ssrBody.name = 'Body_Relay_SSR_Heater';
    ssrBody.position.y = 0.07;
    ssrGroup.add(ssrBody);

    // Clear polycarbonate finger-safe terminal cover & 4 screw terminals (1/L1, 2/T1, 3/+DC, 4/-DC)
    for (const [tx, tz] of [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]]) {
      const termScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.03, 14), MAT_316SS_ELECTROPOLISHED);
      termScrew.position.set(tx, 0.195, tz);
      ssrGroup.add(termScrew);
    }

    const ssrSpec = makeFlushSurfaceLabel(
      'SSR1 · 25A ZERO-CROSS',
      'HEATER PID RELAY',
      0.38, 0.18, '#0f172a', '#ef4444', '#475569'
    );
    ssrSpec.rotation.x = -Math.PI / 2;
    ssrSpec.rotation.z = Math.PI;
    ssrSpec.position.set(0, 0.196, 0);
    ssrGroup.add(ssrSpec);

    // Brass Protective Earth (PE) Grounding Busbar & Star-Washer Lug
    const groundLug = new THREE.Group();
    groundLug.name = 'Body_Ground_Lug_PE';
    groundLug.position.set(-0.88, 0.24, 1.32);
    this.electronicsGroup.add(groundLug);

    const peBar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.10), MAT_BRASS_FITTING);
    groundLug.add(peBar);
    for (let g = -1; g <= 1; g++) {
      const gBolt = makeHexSocketBolt(0.018, 0.04, 'Fastener_HexM4_PE');
      gBolt.position.set(g * 0.07, 0.045, 0);
      groundLug.add(gBolt);
    }

    // ========================================================================
    // 6. M4: Magnetic-Drive Thermal Bath Circulation Pump (Body_Motor_BathPump)
    // ========================================================================
    const pumpGroup = new THREE.Group();
    pumpGroup.name = 'Body_Motor_BathPump';
    pumpGroup.position.set(1.38, 0.44, -0.78);
    this.electronicsGroup.add(pumpGroup);

    // Stamped steel mounting cradle with rubber vibration isolators
    const pumpCradle = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.56), MAT_ALUM_DARK_ANO);
    pumpCradle.position.y = -0.22;
    pumpGroup.add(pumpCradle);

    // Finned BLDC Pump Motor Body
    const pumpMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.54, 28), MAT_ALUM_BLUE_ANO);
    pumpMotor.rotation.x = Math.PI / 2;
    pumpGroup.add(pumpMotor);

    for (let f = 0; f < 12; f++) {
      const ang = (f * Math.PI * 2) / 12;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.05, 0.48), MAT_ALUM_BLUE_ANO);
      fin.position.set(Math.cos(ang) * 0.23, Math.sin(ang) * 0.23, 0);
      fin.rotation.z = ang;
      pumpGroup.add(fin);
    }

    // Cast Stainless Volute Impeller Scroll Chamber on Front of Pump
    const volute = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 28), MAT_316SS_BRUSHED);
    volute.rotation.x = Math.PI / 2;
    volute.position.z = -0.34;
    pumpGroup.add(volute);

    // Brass Barbed Hose Fittings + Stainless Worm-Gear Hose Clamps
    const barbIn = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.16, 18), MAT_BRASS_FITTING);
    barbIn.rotation.x = Math.PI / 2;
    barbIn.position.set(0, 0, -0.48);
    pumpGroup.add(barbIn);

    const barbOut = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.18, 18), MAT_BRASS_FITTING);
    barbOut.position.set(0.14, 0.28, -0.34);
    pumpGroup.add(barbOut);

    const clamp1 = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.012, 10, 20), MAT_316SS_ELECTROPOLISHED);
    clamp1.position.set(0, 0, -0.46);
    pumpGroup.add(clamp1);

    const pumpSpec = makeFlushSurfaceLabel(
      'M4 · 24V MAG-DRIVE PUMP',
      '4.5 L/MIN BATH RECIRC',
      0.36, 0.16, '#0f172a', '#38bdf8', '#475569'
    );
    pumpSpec.rotation.x = -Math.PI / 2;
    pumpSpec.rotation.z = Math.PI;
    pumpSpec.position.set(0, 0.26, 0.04);
    pumpGroup.add(pumpSpec);

    // Reinforced Braided Silicone Return/Supply Fluid Hoses to Bath Floor
    const hoseSupply = makeWiringHarness(
      [[1.38, 0.44, -1.26], [1.10, 0.85, -1.35], [0.65, 1.85, -1.25], [0.45, 2.38, -1.10]],
      0.045, 0x38bdf8, 'Body_Tube_FluidCirculation_Supply', false
    );
    this.electronicsGroup.add(hoseSupply);

    const hoseReturn = makeWiringHarness(
      [[1.52, 0.72, -1.12], [1.45, 1.40, -0.95], [1.05, 2.10, -0.85], [0.75, 2.38, -0.75]],
      0.045, 0x0284c7, 'Body_Tube_FluidCirculation_Return', false
    );
    this.electronicsGroup.add(hoseReturn);

    // ========================================================================
    // 7. S6 & M_OPT: Laser/IR Optical Disintegration Detectors & 45° Mirrors
    // ========================================================================
    const beakerCenters = [-0.825, 0.825];
    for (let stn = 0; stn < 2; stn++) {
      const bx = beakerCenters[stn];

      // Machined Black-Anodized Collimated Laser Emitter Housing
      const emitterGroup = new THREE.Group();
      emitterGroup.name = `Body_Sensor_LaserDisintegration_0${stn + 1}`;
      emitterGroup.position.set(bx - 0.56, 2.16, -0.85);
      this.electronicsGroup.add(emitterGroup);

      const emBlock = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.22), MAT_ALUM_DARK_ANO);
      emitterGroup.add(emBlock);
      const collimator = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.10, 20), MAT_BRASS_FITTING);
      collimator.rotation.z = Math.PI / 2;
      collimator.position.x = 0.15;
      emitterGroup.add(collimator);
      const laserWindow = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16), makeMat(0xef4444, { e: 0xef4444, ei: 2.2 }));
      laserWindow.rotation.z = Math.PI / 2;
      laserWindow.position.x = 0.20;
      emitterGroup.add(laserWindow);

      // Precision 45° First-Surface Dielectric Optical Relay Mirror in Kinematic Gimbal Mount
      const mirrorGimbal = new THREE.Group();
      mirrorGimbal.name = `Body_Mount_MirrorGimbal_0${stn + 1}`;
      mirrorGimbal.position.set(bx + 0.56, 2.16, -0.85);
      this.electronicsGroup.add(mirrorGimbal);

      const gimbalL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), MAT_ALUM_DARK_ANO);
      mirrorGimbal.add(gimbalL);
      // Brass micrometer fine-pitch tilt adjustment screws
      for (const gy of [-0.06, 0.06]) {
        const adjScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.08, 12), MAT_BRASS_FITTING);
        adjScrew.rotation.z = Math.PI / 2;
        adjScrew.position.set(0.13, gy, 0);
        mirrorGimbal.add(adjScrew);
      }

      const mirrorOptic = new THREE.Mesh(
        new THREE.BoxGeometry(0.20, 0.022, 0.20),
        new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 0.96, roughness: 0.04, clearcoat: 1.0 })
      );
      mirrorOptic.name = `Glass_Mirror_OpticalRelay_0${stn + 1}`;
      mirrorOptic.rotation.z = Math.PI / 4;
      mirrorOptic.position.x = -0.04;
      mirrorGimbal.add(mirrorOptic);

      // Subtle Collimated Red 650nm Optical Beam Path across Basket Bottom Mesh Plane
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 1.04, 8),
        new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.65 })
      );
      beam.name = `Glass_LaserBeam_Path_0${stn + 1}`;
      beam.rotation.z = Math.PI / 2;
      beam.position.set(bx, 2.16, -0.85);
      this.electronicsGroup.add(beam);
    }

    // ========================================================================
    // 8. Rear Bulkhead: M5 Cooling Fan, AC Inlet, Breaker & Data I/O Panel
    // ========================================================================
    // M5: 80mm Brushless Axial Cabinet Cooling Fan (Body_Fan_CabinetCooling_Blower)
    const fanGroup = new THREE.Group();
    fanGroup.name = 'Body_Fan_CabinetCooling_Blower';
    fanGroup.position.set(1.38, 1.12, 1.96);
    this.electronicsGroup.add(fanGroup);

    const fanFrame = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.76, 0.22), MAT_IC_PACKAGE);
    fanGroup.add(fanFrame);

    // 4 Corner M4 Mounting Screws on Fan Frame
    for (const [fx, fy] of [[-0.31, -0.31], [0.31, -0.31], [-0.31, 0.31], [0.31, 0.31]]) {
      const fb = makeHexSocketBolt(0.016, 0.04, 'Fastener_HexM4_Fan');
      fb.rotation.x = Math.PI / 2;
      fb.position.set(fx, fy, 0.11);
      fanGroup.add(fb);
    }

    const fanHub = new THREE.Group();
    fanHub.name = 'Pivot_Fan_Impeller';
    fanGroup.add(fanHub);
    this.animNodes.coolingFan = fanHub;

    const hubCore = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.18, 20), MAT_IC_PACKAGE);
    hubCore.rotation.x = Math.PI / 2;
    fanHub.add(hubCore);

    for (let b = 0; b < 7; b++) {
      const ang = (b * Math.PI * 2) / 7;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.06, 0.015), MAT_IC_PACKAGE);
      blade.position.set(Math.cos(ang) * 0.22, Math.sin(ang) * 0.22, 0);
      blade.rotation.z = ang + 0.35;
      blade.rotation.y = 0.42;
      fanHub.add(blade);
    }

    // Chrome Concentric Finger-Guard Grille Rings on Rear Exterior of Fan
    for (const r of [0.14, 0.22, 0.30]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 8, 28), MAT_CHROME_STEEL);
      ring.position.z = 0.12;
      fanGroup.add(ring);
    }

    // Brushed Stainless Rear Data I/O Bulkhead Bezel Plate
    const ioPlate = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.56, 0.03), MAT_316SS_BRUSHED);
    ioPlate.name = 'Body_Plate_RearIO';
    ioPlate.position.set(0.28, 0.55, 2.005);
    this.electronicsGroup.add(ioPlate);

    const ioLegend = makeFlushSurfaceLabel(
      'RS-232 GLP      USB-B PC      USB-A FLASH      10/100 LAN      2.4GHz ANT',
      '21 CFR PART 11 TELEMETRY & LIMS INTERFACE BULKHEAD',
      1.46, 0.16, '#0f172a', '#e2e8f0', '#475569'
    );
    ioLegend.rotation.y = Math.PI;
    ioLegend.position.set(0.28, 0.74, 2.022);
    this.electronicsGroup.add(ioLegend);

    // Port 1: RS-232 DB9 Serial Connector with Hex Jackscrews
    const rs232Group = new THREE.Group();
    rs232Group.name = 'Body_Port_RS232';
    rs232Group.position.set(-0.28, 0.48, 2.02);
    this.electronicsGroup.add(rs232Group);
    const db9Shell = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, 0.08), MAT_316SS_ELECTROPOLISHED);
    rs232Group.add(db9Shell);
    const db9Core = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.09), makeMat(0x1d4ed8, { r: 0.4 }));
    rs232Group.add(db9Core);
    for (const jx of [-0.10, 0.10]) {
      const js = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.09, 6), MAT_316SS_ELECTROPOLISHED);
      js.rotation.x = Math.PI / 2;
      js.position.x = jx;
      rs232Group.add(js);
    }

    // Port 2: USB-B Device Port
    const usbB = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.10), MAT_316SS_ELECTROPOLISHED);
    usbB.name = 'Body_Port_USB';
    usbB.position.set(0.04, 0.48, 2.02);
    this.electronicsGroup.add(usbB);

    // Port 3: USB-A Host Port + Inserted Rugged Aluminum SanDisk GLP Audit Flash Drive
    const usbA = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.10, 0.10), MAT_316SS_ELECTROPOLISHED);
    usbA.name = 'Body_Port_USB_Host_Flash';
    usbA.position.set(0.32, 0.48, 2.02);
    this.electronicsGroup.add(usbA);

    const usbStick = new THREE.Group();
    usbStick.name = 'Body_Part_USB_Drive';
    usbStick.position.set(0.32, 0.48, 2.16);
    this.electronicsGroup.add(usbStick);
    const stickBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.075, 0.26), MAT_ALUM_DARK_ANO);
    usbStick.add(stickBody);
    const stickLed = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.02), makeMat(0x38bdf8, { e: 0x38bdf8, ei: 1.8 }));
    stickLed.position.set(0, 0.03, 0.13);
    usbStick.add(stickLed);

    // Port 4: Shielded RJ45 10/100Base-T Ethernet LAN Jack with Link/Act LEDs
    const rj45Group = new THREE.Group();
    rj45Group.name = 'Body_Port_RJ45_LAN';
    rj45Group.position.set(0.60, 0.48, 2.02);
    this.electronicsGroup.add(rj45Group);
    const rjShell = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.12), MAT_316SS_ELECTROPOLISHED);
    rj45Group.add(rjShell);
    const linkLed = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.025, 0.02), makeMat(0x22c55e, { e: 0x22c55e, ei: 2.0 }));
    linkLed.position.set(-0.05, 0.05, 0.06);
    rj45Group.add(linkLed);
    const actLed = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.025, 0.02), makeMat(0xf59e0b, { e: 0xf59e0b, ei: 2.0 }));
    actLed.position.set(0.05, 0.05, 0.06);
    rj45Group.add(actLed);

    // Port 5: Gold-Plated RP-SMA Bulkhead Jack & Articulated 2.4 GHz Wi-Fi / BLE Dipole Antenna
    const antGroup = new THREE.Group();
    antGroup.name = 'Body_Antenna_WiFi_BLE';
    antGroup.position.set(0.88, 0.48, 2.04);
    this.electronicsGroup.add(antGroup);

    const smaNut = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.08, 6), MAT_GOLD_CONTACT);
    smaNut.rotation.x = Math.PI / 2;
    antGroup.add(smaNut);

    const knuckle = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.14, 16), MAT_IC_PACKAGE);
    knuckle.position.set(0, 0.05, 0.08);
    antGroup.add(knuckle);

    const whip = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.042, 0.88, 16), MAT_IC_PACKAGE);
    whip.position.set(0, 0.52, 0.08);
    antGroup.add(whip);

    // IEC 60320 C14 AC Mains Inlet & Illuminated Red DPST Rocker Breaker Switch
    const iecInlet = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.26, 0.16), MAT_IC_PACKAGE);
    iecInlet.name = 'Body_Inlet_Power_IEC';
    iecInlet.position.set(-1.32, 0.48, 1.98);
    this.electronicsGroup.add(iecInlet);

    const rockerSwitch = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.24, 0.08),
      makeMat(0xdc2626, { r: 0.3, e: 0xdc2626, ei: 0.9 })
    );
    rockerSwitch.name = 'Btn_Power_MainsRocker';
    rockerSwitch.position.set(-0.92, 0.48, 2.02);
    this.electronicsGroup.add(rockerSwitch);
    this.mainsRockerMesh = rockerSwitch;

    // ========================================================================
    // 9. Industrial Slotted PVC Wiring Ducts, DIN Terminal Rail & Star PE Hub
    // (Complies with DIN EN 60204-1 / UL 508A Industrial Wiring Standards)
    // ========================================================================
    // Rear Transverse Slotted PVC Wiring Duct (Body_WiringDuct_Rear)
    const ductRear = new THREE.Mesh(new THREE.BoxGeometry(3.10, 0.16, 0.20), MAT_PVC_DUCT);
    ductRear.name = 'Body_WiringDuct_Rear';
    ductRear.position.set(0, 0.20, 1.35);
    this.electronicsGroup.add(ductRear);

    const ductCoverRear = new THREE.Mesh(new THREE.BoxGeometry(3.12, 0.025, 0.21), MAT_PVC_DUCT);
    ductCoverRear.position.set(0, 0.29, 1.35);
    this.electronicsGroup.add(ductCoverRear);

    // Left Longitudinal Slotted PVC Wiring Duct (Body_WiringDuct_Left)
    const ductLeft = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.16, 2.40), MAT_PVC_DUCT);
    ductLeft.name = 'Body_WiringDuct_Left';
    ductLeft.position.set(-1.58, 0.20, 0.05);
    this.electronicsGroup.add(ductLeft);

    const ductCoverLeft = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.025, 2.42), MAT_PVC_DUCT);
    ductCoverLeft.position.set(-1.58, 0.29, 0.05);
    this.electronicsGroup.add(ductCoverLeft);

    // Upright Tower Vertical Cable Riser Duct (Body_WiringDuct_TowerRiser)
    const ductTower = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.60, 0.18), MAT_PVC_DUCT);
    ductTower.name = 'Body_WiringDuct_TowerRiser';
    ductTower.position.set(-1.45, 3.80, 0.88);
    this.electronicsGroup.add(ductTower);

    // 35mm Top-Hat DIN Rail with Modular Terminal Blocks (Body_TerminalBlock_DIN)
    const dinRailTerm = new THREE.Mesh(new THREE.BoxGeometry(1.20, 0.06, 0.02), MAT_316SS_BRUSHED);
    dinRailTerm.position.set(-0.40, 0.38, 1.75);
    this.electronicsGroup.add(dinRailTerm);

    const termColors = [0x64748b, 0x64748b, 0x2563eb, 0x2563eb, 0x16a34a, 0xf97316, 0xf97316, 0xdc2626];
    for (let t = 0; t < 8; t++) {
      const termBlock = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.14, 0.12), makeMat(termColors[t], { r: 0.4 }));
      termBlock.name = `Body_TerminalBlock_Circuit_0${t + 1}`;
      termBlock.position.set(-0.85 + t * 0.13, 0.38, 1.74);
      this.electronicsGroup.add(termBlock);
    }

    // Heavy Brass M6 Star Protective Earth (PE) Grounding Hub (Body_GroundHub_PE)
    const groundHub = new THREE.Group();
    groundHub.name = 'Body_GroundHub_PE';
    groundHub.position.set(-0.85, 0.14, 1.55);
    this.electronicsGroup.add(groundHub);

    const groundStud = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.12, 16), MAT_BRASS_FITTING);
    groundHub.add(groundStud);
    const groundNut = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.04, 6), MAT_BRASS_FITTING);
    groundNut.position.y = 0.04;
    groundHub.add(groundNut);

    // Chassis P-Clamps for dressed surface runs
    const pClampPositions = [
      [-1.38, 0.14, 0.70], [-1.38, 0.14, -0.20], [-1.38, 0.14, -0.65],
      [1.10, 0.14, 0.50], [1.10, 0.14, 1.10], [0.35, 0.14, -1.10]
    ];
    for (let c = 0; c < pClampPositions.length; c++) {
      const [px, py, pz] = pClampPositions[c];
      const pClamp = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16), MAT_IC_PACKAGE);
      pClamp.name = `Fastener_CableClamp_0${c + 1}`;
      pClamp.position.set(px, py, pz);
      this.electronicsGroup.add(pClamp);
    }

    // ========================================================================
    // Orthogonal Point-to-Point Industrial Wiring Harnesses
    // (Routed strictly along ducts, chassis channels, and vertical risers)
    // ========================================================================
    // 1. High-Voltage AC Mains Live (IEC Inlet -> Rocker Switch -> Rear Duct -> Terminal Block)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [-1.32, 0.48, 1.95],
        [-1.32, 0.48, 2.01],
        [-0.92, 0.48, 2.01],
        [-0.92, 0.22, 1.95],
        [-0.92, 0.22, 1.35],
        [-0.40, 0.22, 1.35],
        [-0.40, 0.38, 1.68]
      ],
      0.022, 0xdc2626, 'Body_Wire_AC_Mains_Live'
    ));

    // 2. High-Voltage AC Mains Neutral (IEC Inlet -> Rear Duct -> Terminal Block)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [-1.24, 0.44, 1.95],
        [-1.24, 0.22, 1.95],
        [-1.24, 0.22, 1.35],
        [-0.53, 0.22, 1.35],
        [-0.53, 0.38, 1.68]
      ],
      0.020, 0x2563eb, 'Body_Wire_AC_Mains_Neutral'
    ));

    // 3. Green/Yellow Protective Earth (PE) Star Ground System (4 Orthogonal Branches)
    // Branch A: IEC Inlet to Star Ground Hub
    this.electronicsGroup.add(makeWiringHarness(
      [
        [-1.38, 0.44, 1.95],
        [-1.38, 0.16, 1.95],
        [-1.38, 0.16, 1.55],
        [-0.85, 0.16, 1.55]
      ],
      0.020, 0x16a34a, 'Body_Wire_PE_InletToHub'
    ));
    // Branch B: Star Hub to Switching PSU Metal Chassis Ground
    this.electronicsGroup.add(makeWiringHarness(
      [
        [-0.85, 0.16, 1.55],
        [-0.85, 0.16, 1.35],
        [-1.18, 0.16, 1.35],
        [-1.18, 0.28, 1.25]
      ],
      0.020, 0x16a34a, 'Body_Wire_PE_HubToPSU'
    ));
    // Branch C: Star Hub to Stainless Bath Cradle Ground Lug
    this.electronicsGroup.add(makeWiringHarness(
      [
        [-0.85, 0.16, 1.55],
        [-1.58, 0.16, 1.55],
        [-1.58, 0.16, -0.65],
        [-1.40, 0.16, -0.65],
        [-1.40, 2.28, -0.65]
      ],
      0.020, 0x16a34a, 'Body_Wire_PE_HubToBathCradle'
    ));
    // Branch D: Star Hub to Upright Tower Frame Ground Lug
    this.electronicsGroup.add(makeWiringHarness(
      [
        [-0.85, 0.16, 1.55],
        [-0.85, 0.16, 1.35],
        [0.0, 0.16, 1.35],
        [0.0, 2.45, 1.35]
      ],
      0.020, 0x16a34a, 'Body_Wire_PE_HubToTower'
    ));

    // 4. +24V DC High-Current Power Bus (PSU1 -> Rear Duct -> Stepper Drivers DRV1..3 & SSR)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [-1.08, 0.38, 1.05],
        [-1.08, 0.22, 1.05],
        [-1.08, 0.22, 1.35],
        [0.61, 0.22, 1.35],
        [0.61, 0.72, 1.20]
      ],
      0.024, 0xf97316, 'Body_Wire_DC_24V_Bus'
    ));

    // 5. +5V / +3.3V Logic Bus (PSU1 -> Left Duct -> Motherboard J1 Header)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [-1.18, 0.38, 0.98],
        [-1.18, 0.22, 0.98],
        [-1.58, 0.22, 0.98],
        [-1.58, 0.22, 0.35],
        [0.25, 0.22, 0.35],
        [0.25, 0.36, 0.35]
      ],
      0.018, 0xef4444, 'Body_Wire_DC_5V_Logic'
    ));

    // 6. High-Temperature Switched Heater Feed (SSR1 -> Left Duct -> Bath Immersion Coil)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [-1.32, 0.58, 1.20],
        [-1.58, 0.58, 1.20],
        [-1.58, 0.22, 1.20],
        [-1.58, 0.22, -0.85],
        [-0.55, 0.22, -0.85],
        [-0.55, 2.30, -0.85],
        [-0.35, 2.48, -0.85]
      ],
      0.026, 0xdc2626, 'Body_Wire_Heater_HighTemp_Silicone'
    ));

    // 7. BLDC Main Stroke Motor M1 Cable (DRV1 -> Rear Duct -> Tower Riser Duct -> M1 Bulkhead)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [-0.55, 0.78, 1.15],
        [-0.55, 0.22, 1.35],
        [-1.45, 0.22, 1.35],
        [-1.45, 3.80, 0.88],
        [-0.20, 3.80, 0.88],
        [-0.20, 4.20, 0.56],
        [0.0, 4.20, 0.56]
      ],
      0.024, 0x8b5cf6, 'Body_Wire_Motor_BLDC_TowerLoom'
    ));

    // 8. Dual Z-Axis Lift Stepper Motor Harnesses (DRV2/3 -> Duct -> M2/M3 Motors)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [0.03, 0.78, 1.15],
        [0.03, 0.22, 1.35],
        [-1.22, 0.22, 1.35],
        [-1.22, 0.22, 0.08],
        [-1.22, 2.45, 0.08]
      ],
      0.018, 0x06b6d4, 'Body_Wire_Motor_Lift_Left'
    ));
    this.electronicsGroup.add(makeWiringHarness(
      [
        [0.61, 0.78, 1.15],
        [0.61, 0.22, 1.35],
        [1.22, 0.22, 1.35],
        [1.22, 0.22, 0.08],
        [1.22, 2.45, 0.08]
      ],
      0.018, 0x06b6d4, 'Body_Wire_Motor_Lift_Right'
    ));

    // 9. Circulation Pump M4 & Rear Fan M5 Harnesses (Motherboard -> Ducts -> Actuators)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [0.67, 0.36, 0.79],
        [0.67, 0.22, 0.79],
        [1.38, 0.22, 0.79],
        [1.38, 0.22, -0.52],
        [1.38, 0.38, -0.52]
      ],
      0.018, 0x3b82f6, 'Body_Wire_Motor_BathPump'
    ));
    this.electronicsGroup.add(makeWiringHarness(
      [
        [0.67, 0.36, 0.79],
        [0.67, 0.22, 1.35],
        [1.38, 0.22, 1.35],
        [1.38, 0.85, 1.88]
      ],
      0.016, 0x64748b, 'Body_Wire_Fan_Power'
    ));

    // 10. PT100 RTD Bath Temperature Sensor Shielded Cable (Probe -> Left Duct -> ADC U4)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [0, 2.42, -1.52],
        [-1.58, 2.42, -1.52],
        [-1.58, 0.22, -1.52],
        [-1.58, 0.22, 0.03],
        [-0.13, 0.22, 0.03],
        [-0.13, 0.36, 0.03]
      ],
      0.016, 0x10b981, 'Body_Wire_Sensor_PT100_Shielded'
    ));

    // 11. Encoder & Tower Limit Switches Harness (Tower Riser Duct -> Motherboard)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [0, 4.20, 0.92],
        [-1.45, 4.20, 0.92],
        [-1.45, 0.22, 0.92],
        [0.27, 0.22, 0.92],
        [0.27, 0.36, 0.79]
      ],
      0.016, 0x22c55e, 'Body_Wire_Sensor_Encoder_Limits'
    ));

    // 12. Laser / IR Optical Disintegration Detectors Harness (Sensors -> Floor Channel -> Motherboard)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [-1.38, 2.16, -0.85],
        [-1.58, 2.16, -0.85],
        [-1.58, 0.22, -0.85],
        [-0.13, 0.22, -0.85],
        [-0.13, 0.36, 0.79]
      ],
      0.015, 0xf43f5e, 'Body_Wire_Sensor_OpticalLaser'
    ));

    // 13. Wi-Fi / BLE RF Coax Pigtail (U5 Radio Module -> Rear Bulkhead RP-SMA Jack)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [0.95, 0.36, 0.69],
        [0.95, 0.22, 0.69],
        [0.95, 0.22, 1.45],
        [0.88, 0.22, 1.98],
        [0.88, 0.48, 1.98]
      ],
      0.012, 0xeab308, 'Body_Cable_Coax_WiFiAntenna', false
    ));

    // 14. Flat Grey 40-Pin IDC Ribbon Cable (Motherboard J-CON -> Front Operator LCD Console)
    this.electronicsGroup.add(makeWiringHarness(
      [
        [0.35, 0.36, -0.35],
        [0.35, 0.22, -0.35],
        [0.35, 0.22, -1.85],
        [0.35, 0.95, -1.85],
        [0.35, 1.40, -1.96]
      ],
      0.026, 0x94a3b8, 'Body_Cable_Ribbon_LCD'
    ));
  }

  // --------------------------------------------------------------------------
  // Benchtop Power Continuity: Duplex Receptacle, NEMA 5-15P Plug & SJTOW Cord
  // --------------------------------------------------------------------------
  buildPowerContinuity() {
    this.powerGroup = new THREE.Group();
    this.powerGroup.name = 'Body_PowerSystem';
    this.scene.add(this.powerGroup);

    // Brushed Stainless Pedestal Benchtop Duplex Outlet Box (Power_Receptacle_Duplex)
    const outletBox = new THREE.Group();
    outletBox.name = 'Body_Power_Receptacle_Duplex';
    outletBox.position.set(-3.20, 0.35, 1.40);
    this.powerGroup.add(outletBox);

    const boxHousing = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.70, 0.56), MAT_316SS_BRUSHED);
    boxHousing.castShadow = true;
    outletBox.add(boxHousing);

    const faceplate = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.62, 0.04), MAT_CHASSIS_CREAM);
    faceplate.position.z = -0.29;
    outletBox.add(faceplate);

    // Hospital-grade green ground dot & 120V/230V circuit breaker label on outlet
    for (const sy of [-0.14, 0.14]) {
      const sock = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.20, 0.02), MAT_IC_PACKAGE);
      sock.position.set(0, sy, -0.312);
      outletBox.add(sock);
    }

    // Molded NEMA 5-15P Plug with Brass Prongs & Strain Relief Boot (Body_Power_Plug_NEMA)
    this.nemaPlug = new THREE.Group();
    this.nemaPlug.name = 'Body_Power_Plug_NEMA';
    this.powerGroup.add(this.nemaPlug);

    const plugBody = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.32), MAT_RUBBER_CORD);
    this.nemaPlug.add(plugBody);

    const strainBoot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.18, 16), MAT_RUBBER_CORD);
    strainBoot.rotation.x = Math.PI / 2;
    strainBoot.position.z = -0.22;
    this.nemaPlug.add(strainBoot);

    const prongL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.14), MAT_BRASS_FITTING);
    prongL.position.set(-0.06, 0.03, 0.21);
    this.nemaPlug.add(prongL);

    const prongN = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.14), MAT_BRASS_FITTING);
    prongN.position.set(0.06, 0.03, 0.21);
    this.nemaPlug.add(prongN);

    const prongG = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.16, 12), MAT_BRASS_FITTING);
    prongG.rotation.x = Math.PI / 2;
    prongG.position.set(0, -0.05, 0.22);
    this.nemaPlug.add(prongG);

    this.updatePowerCord();
  }

  updatePowerCord() {
    if (this.cordMesh) {
      this.powerGroup.remove(this.cordMesh);
      this.cordMesh.geometry.dispose();
    }

    if (this.state.isPluggedIn) {
      this.nemaPlug.position.set(-3.20, 0.24, 0.94);
      this.nemaPlug.rotation.set(0, 0, 0);
    } else {
      this.nemaPlug.position.set(-2.75, 0.12, 0.20);
      this.nemaPlug.rotation.set(0, 0.55, 0.22);
    }

    if (this.mainsRockerMesh && this.mainsRockerMesh.material) {
      const powered = this.state.isPluggedIn && this.state.switchOn;
      this.mainsRockerMesh.material.emissiveIntensity = powered ? 1.1 : 0.0;
    }

    const startPt = new THREE.Vector3(-1.32, 0.48, 2.04);
    const midPt1 = new THREE.Vector3(-1.85, 0.10, 2.35);
    const midPt2 = this.state.isPluggedIn
      ? new THREE.Vector3(-2.85, 0.08, 0.65)
      : new THREE.Vector3(-2.40, 0.06, 0.85);
    const endPt = this.nemaPlug.position.clone().add(new THREE.Vector3(0, 0, -0.22));

    const curve = new THREE.CatmullRomCurve3([startPt, midPt1, midPt2, endPt]);
    const cordGeo = new THREE.TubeGeometry(curve, 36, 0.042, 14, false);
    this.cordMesh = new THREE.Mesh(cordGeo, MAT_RUBBER_CORD);
    this.cordMesh.name = 'Body_Power_Cord_SJTOW';
    this.cordMesh.castShadow = true;
    this.powerGroup.add(this.cordMesh);
  }

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // Kinematic Exploded View Separation (DIAG-020: >= +100 mm Vertical Lift)
  // --------------------------------------------------------------------------
  setupExplodedViewTargets() {
    this.explodeTargets = [
      // Sheet-metal enclosure shell lifts +260 mm (+2.60 dm) to completely expose internals
      { obj: this.enclosureShell, base: new THREE.Vector3(0, 0, 0), offset: new THREE.Vector3(0, 2.60, 0.55) },
      { obj: this.bathGroup, base: new THREE.Vector3(0, 2.38, -0.85), offset: new THREE.Vector3(0, 0.95, -0.75) },
      { obj: this.driveHead, base: new THREE.Vector3(0, 5.60, -0.85), offset: new THREE.Vector3(0, 1.35, -0.45) },
      { obj: this.driveGroup, base: new THREE.Vector3(0, 0, 1.00), offset: new THREE.Vector3(0, 0.55, 0.45) },
      { obj: this.consoleGroup, base: new THREE.Vector3(0.35, 1.40, -2.01), offset: new THREE.Vector3(0.35, 0, -1.05) },
      { obj: this.electronicsGroup, base: new THREE.Vector3(0, 0, 0), offset: new THREE.Vector3(0, 0.08, 0.25) }
    ];
  }

  setExploded(factor) {
    this.state.explodeFactor = Math.max(0, Math.min(1, factor));
    for (const item of this.explodeTargets) {
      if (!item.obj) continue;
      item.obj.position.lerpVectors(
        item.base,
        item.base.clone().add(item.offset),
        this.state.explodeFactor
      );
    }
  }

  // --------------------------------------------------------------------------
  // High-DPI Dynamic Canvas UI_LCD (DIAG-005: flipY = false, Upright UVs)
  // --------------------------------------------------------------------------
  renderLCD() {
    const ctx = this.lcdCtx;
    const w = this.lcdCanvas.width;
    const h = this.lcdCanvas.height;

    const hasPower = this.state.isPluggedIn && this.state.switchOn && this.state.state !== 'POWER_OFF';

    if (!hasPower) {
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, w - 20, h - 20);
      ctx.fillStyle = '#1f2937';
      ctx.font = '600 24px "Inter", sans-serif';
      ctx.fillText('NO MAINS POWER — INSERT NEMA PLUG & SWITCH BREAKER ON', 140, h / 2);
      this.lcdTexture.needsUpdate = true;
      return;
    }

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#07192f');
    grad.addColorStop(1, '#040d1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Top Header Bar
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(0, 0, w, 56);
    ctx.fillStyle = '#040d1a';
    ctx.font = '800 26px "Inter", sans-serif';
    ctx.fillText('ERWEKA ZT 322  ·  USP <701> / EP 2.9.1 DISINTEGRATION', 28, 38);

    ctx.fillStyle = '#040d1a';
    ctx.font = '700 22px "JetBrains Mono", monospace';
    ctx.fillText(`[${this.state.state}]`, w - 230, 38);

    // Telemetry Cards
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 2;

    // Helper for drawing rounded buttons on canvas
    const drawPill = (bx, by, bw, bh, text, bg, border, textColor = '#ffffff', font = '700 18px "Inter", sans-serif') => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 8);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.strokeStyle = border;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = textColor;
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + bw / 2, by + bh / 2);
      ctx.restore();
    };

    // 1. Bath Temperature Card (with [-] / [+] touch pills)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(28, 72, 300, 168);
    ctx.strokeRect(28, 72, 300, 168);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillText('BATH TEMP (USP 37.0°C)', 44, 102);

    ctx.fillStyle = Math.abs(this.state.bathTempC - this.state.targetTempC) <= 0.5 ? '#22c55e' : '#f59e0b';
    ctx.font = '700 50px "JetBrains Mono", monospace';
    ctx.fillText(`${this.state.bathTempC.toFixed(1)}°C`, 44, 162);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 16px "JetBrains Mono", monospace';
    ctx.fillText(`SET: ${this.state.targetTempC.toFixed(1)}°C · ${this.state.heaterOn ? 'HEATER ON' : 'IDLE'}`, 44, 214);

    drawPill(234, 120, 38, 38, '−', 'rgba(30, 41, 59, 0.85)', '#38bdf8', '#38bdf8', '700 24px monospace');
    drawPill(278, 120, 38, 38, '+', 'rgba(30, 41, 59, 0.85)', '#38bdf8', '#38bdf8', '700 24px monospace');

    // 2. Stroke Rate Card (with [-] / [+] touch pills)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(356, 72, 300, 168);
    ctx.strokeRect(356, 72, 300, 168);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillText('STROKE FREQUENCY', 372, 102);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 50px "JetBrains Mono", monospace';
    ctx.fillText(`${this.state.currentCpm.toFixed(1)}`, 372, 162);
    ctx.font = '600 22px "Inter", sans-serif';
    ctx.fillText('CPM', 510, 162);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 16px "JetBrains Mono", monospace';
    ctx.fillText(`STROKE: 55 mm · CNT: ${this.state.strokeCount}`, 372, 214);

    drawPill(562, 120, 38, 38, '−', 'rgba(30, 41, 59, 0.85)', '#38bdf8', '#38bdf8', '700 24px monospace');
    drawPill(606, 120, 38, 38, '+', 'rgba(30, 41, 59, 0.85)', '#38bdf8', '#38bdf8', '700 24px monospace');

    // 3. Remaining Time Card (with [-] / [+] touch pills)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(684, 72, 312, 168);
    ctx.strokeRect(684, 72, 312, 168);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillText('ELAPSED / LIMIT TIMER', 700, 102);

    const rem = Math.max(0, this.state.targetDurationS - this.state.elapsedS);
    const mm = String(Math.floor(rem / 60)).padStart(2, '0');
    const ss = String(Math.floor(rem % 60)).padStart(2, '0');
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 50px "JetBrains Mono", monospace';
    ctx.fillText(`${mm}:${ss}`, 700, 162);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 16px "JetBrains Mono", monospace';
    ctx.fillText(`SAMPLE: ${this.state.sampleName}`, 700, 214);

    drawPill(902, 120, 38, 38, '−', 'rgba(30, 41, 59, 0.85)', '#38bdf8', '#38bdf8', '700 24px monospace');
    drawPill(946, 120, 38, 38, '+', 'rgba(30, 41, 59, 0.85)', '#38bdf8', '#38bdf8', '700 24px monospace');

    // Middle: 12-Tube Disintegration Matrix Bar Chart
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(28, 256, w - 56, 140);
    ctx.strokeRect(28, 256, w - 56, 140);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 17px "Inter", sans-serif';
    ctx.fillText('BASKET A (T1–T6) & BASKET B (T7–T12) MASS INTEGRITY', 44, 280);

    const reactLabel = (this.state.reactionType || 'cloudy_plumes').toUpperCase().replace('_', ' ');
    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 15px "JetBrains Mono", monospace';
    ctx.fillText(`REACTION: ${reactLabel}`, w - 380, 280);

    for (let i = 0; i < 12; i++) {
      const bx = 46 + i * 78;
      const by = 296;
      const bw = 60;
      const bh = 68;

      ctx.strokeStyle = '#334155';
      ctx.strokeRect(bx, by, bw, bh);

      const frac = Math.max(0, Math.min(1, this.state.tabletSize[i] ?? 1.0));
      const fillH = Math.round(bh * frac);
      ctx.fillStyle = frac <= 0.02 ? '#22c55e' : (frac < 0.5 ? '#f59e0b' : '#38bdf8');
      ctx.fillRect(bx + 4, by + (bh - fillH), bw - 8, fillH);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 14px "JetBrains Mono", monospace';
      ctx.fillText(`T${i + 1}`, bx + 18, by + bh + 20);
    }

    // ========================================================================
    // Bottom Soft-Touch Action Buttons (Touchscreen Raycast Targets)
    // ========================================================================
    const isRunning = this.state.state === 'RUNNING';
    const isLowered = this.state.basketLowered;
    const heaterOn = this.state.heaterOn;

    drawPill(28, 412, 148, 76, isRunning ? '▶ RUNNING' : '▶ START', isRunning ? '#15803d' : '#166534', '#22c55e', '#ffffff', '800 20px "Inter", sans-serif');
    drawPill(190, 412, 146, 76, '⏹ STOP', '#991b1b', '#ef4444', '#ffffff', '800 20px "Inter", sans-serif');
    drawPill(350, 412, 146, 76, isLowered ? '▲ LIFT (UP)' : '▼ LOWER', isLowered ? '#0369a1' : '#0284c7', '#38bdf8', '#ffffff', '800 18px "Inter", sans-serif');
    drawPill(510, 412, 146, 76, heaterOn ? '♨ HEAT ON' : '♨ HEAT OFF', heaterOn ? '#b45309' : '#334155', heaterOn ? '#f59e0b' : '#64748b', '#ffffff', '800 18px "Inter", sans-serif');
    drawPill(670, 412, 166, 76, '⚗ SAMPLE', '#4338ca', '#818cf8', '#ffffff', '800 18px "Inter", sans-serif');
    drawPill(850, 412, 146, 76, '↺ RELOAD', '#334155', '#94a3b8', '#ffffff', '800 18px "Inter", sans-serif');

    // Dynamic Touch Ripples (Visual feedback for screen taps)
    if (this.touchRipples && this.touchRipples.length > 0) {
      for (const r of this.touchRipples) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, r.alpha)})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }
    }

    this.lcdTexture.needsUpdate = true;

    // Mirror onto 2D sidebar canvas (#lcd-mirror) if present in DOM
    const mirror = document.getElementById('lcd-mirror');
    if (mirror) {
      const mctx = mirror.getContext('2d');
      if (mctx) {
        mctx.clearRect(0, 0, mirror.width, mirror.height);
        mctx.drawImage(this.lcdCanvas, 0, 0, mirror.width, mirror.height);
      }
    }
  }

  onWindowResize() {
    if (!this.container) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // --------------------------------------------------------------------------
  // Real-Time 60 FPS USP <701> Sinusoidal Kinematics, Articulation & Reactions
  // --------------------------------------------------------------------------
  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = Math.min(0.05, this.clock.getDelta());
    const now = this.clock.getElapsedTime();
    const hasPower = this.state.isPluggedIn && this.state.switchOn;

    // Auto-rotate camera if enabled in toolbar
    if (this.autoRotate && this.controls) {
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = (this.orbitSpeedDeg || 14) * 0.15;
    } else if (this.controls) {
      this.controls.autoRotate = false;
    }

    if (hasPower && this.state.state === 'RUNNING') {
      const freqHz = this.state.currentCpm / 60.0;
      this.crankPhase += 2 * Math.PI * freqHz * dt;
    }

    // Smooth vertical parking lift interpolation (0 = parked above beakers, 1 = immersed)
    const targetLift = (hasPower && this.state.basketLowered) ? 1.0 : 0.0;
    if (typeof this.manualLiftProgress === 'number') {
      this.liftProgress = this.manualLiftProgress;
    } else {
      this.liftProgress += (targetLift - this.liftProgress) * Math.min(1, dt * 5.0);
    }

    // Sinusoidal vertical displacement: y(t) = A * sin(omega * t), A = 0.275 dm (27.5 mm)
    const strokeOffset = (hasPower && this.state.state === 'RUNNING')
      ? 0.275 * Math.sin(this.crankPhase)
      : 0.0;

    // Drive head base Y in world coordinates:
    // Parked = 6.08 dm (baskets lifted cleanly above beaker rim Y=4.36)
    // Lowered = 4.78 dm + strokeOffset (baskets inside beaker fluid Y=2.71..4.07)
    const baseHeadY = 6.08 - this.liftProgress * 1.30 + strokeOffset;

    if (this.state.explodeFactor === 0) {
      if (this.driveHead) this.driveHead.position.y = baseHeadY;
      if (this.carriageGroup) this.carriageGroup.position.y = baseHeadY;
    }

    // ========================================================================
    // Closed-Form Crank-Slider Linkage Articulation (Coplanar Z = -0.16)
    // ========================================================================
    const R = 0.275;
    const crankAngle = this.crankPhase;
    const pinRelX = R * Math.cos(crankAngle);
    const pinRelY = R * Math.sin(crankAngle);
    const crankCenterY = 4.20;

    if (this.crankDisc) {
      this.crankDisc.rotation.y = crankAngle;
    }

    if (this.connectingRod) {
      const pinY = crankCenterY + pinRelY;
      const wristY = baseHeadY;
      this.connectingRod.position.set(pinRelX * 0.5, (pinY + wristY) * 0.5, -0.16);
      const dx = -pinRelX;
      const dy = wristY - pinY;
      this.connectingRod.rotation.z = Math.atan2(dx, dy);
    }

    // Accordion Bellows Dynamic Scaling in front tower slot
    if (this.bellowsUpper && this.bellowsLower) {
      const armTop = baseHeadY + 0.15;
      const armBtm = baseHeadY - 0.15;
      const upperH = Math.max(0.06, 6.40 - armTop);
      const lowerH = Math.max(0.06, armBtm - 2.70);

      this.bellowsUpper.position.y = armTop + upperH / 2;
      this.bellowsUpper.scale.y = upperH;

      this.bellowsLower.position.y = 2.70 + lowerH / 2;
      this.bellowsLower.scale.y = lowerH;
    }

    // Rotate dual Z-axis leadscrews during basket lift transitions
    const liftVel = targetLift - this.liftProgress;
    if (Math.abs(liftVel) > 0.002 && this.animNodes.leadScrews) {
      for (const ls of this.animNodes.leadScrews) {
        ls.rotation.y += liftVel * dt * 28.0;
      }
    }

    // Spin rear cabinet cooling fan when powered
    if (this.animNodes.coolingFan && hasPower) {
      this.animNodes.coolingFan.rotation.z += dt * (this.state.state === 'RUNNING' ? 18.0 : 6.0);
    }

    // Heater coil thermal emissive glow when active
    for (const coil of this.animNodes.heaterCoils) {
      if (coil.material) {
        const targetGlow = (hasPower && this.state.heaterOn)
          ? (0.65 + 0.20 * Math.sin(now * 4.0))
          : 0.0;
        coil.material.emissiveIntensity += (targetGlow - coil.material.emissiveIntensity) * 0.1;
      }
    }

    // Scale tablet meshes inside the 12 glass tubes according to remaining mass fraction
    for (let i = 0; i < this.animNodes.tablets.length; i++) {
      const mesh = this.animNodes.tablets[i];
      const frac = Math.max(0, this.state.tabletSize[i] ?? 1.0);
      mesh.visible = frac > 0.015;
      if (mesh.visible) {
        const s = Math.max(0.15, Math.cbrt(frac));
        mesh.scale.set(s, s, s);
        if (this.state.state === 'RUNNING') {
          mesh.position.y = 0.05 + Math.max(0, 0.04 * Math.sin(this.crankPhase + i * 0.7));
        } else {
          mesh.position.y = 0.05;
        }
      }
    }

    // Subtle meniscus wave in beakers when baskets reciprocate
    for (let i = 0; i < this.animNodes.menisci.length; i++) {
      const m = this.animNodes.menisci[i];
      if (hasPower && this.state.state === 'RUNNING') {
        const ripple = 1.0 + 0.015 * Math.sin(this.crankPhase * 2.0 + i);
        m.scale.set(1, ripple, 1);
      } else {
        m.scale.set(1, 1, 1);
      }
    }

    // ========================================================================
    // Real-World Chemical & Physical Disintegration Reactions in Beaker Fluid
    // ========================================================================
    const avgTabletFrac = (this.state.tabletSize && this.state.tabletSize.length > 0)
      ? this.state.tabletSize.reduce((a, b) => a + b, 0) / this.state.tabletSize.length
      : 1.0;
    const dissolvedFrac = Math.max(0, Math.min(1, 1.0 - avgTabletFrac));
    const reactType = this.state.reactionType || 'cloudy_plumes';
    const isRunning = hasPower && this.state.state === 'RUNNING';

    // Update Beaker Fluid Materials & Turbidity/Color
    for (let stn = 0; stn < 2; stn++) {
      const fluidMesh = this.scene.getObjectByName(`Glass_Fluid_Beaker_0${stn + 1}`);
      if (fluidMesh && fluidMesh.material) {
        if (reactType === 'dye_dispersion') {
          // Yellow Riboflavin / Tartrazine dye dissolving into fluid
          const baseColor = new THREE.Color(0xdbeafe);
          const dyeColor = new THREE.Color(this.state.fluidTargetColor || 0xfef08a);
          fluidMesh.material.color.copy(baseColor).lerp(dyeColor, dissolvedFrac * 0.95);
          fluidMesh.material.opacity = 0.18 + dissolvedFrac * (this.state.fluidMaxOpacity || 0.45);
        } else if (reactType === 'effervescent_fizz') {
          // White effervescent micro-bubble turbidity
          const baseColor = new THREE.Color(0xdbeafe);
          const fizzColor = new THREE.Color(0xffffff);
          fluidMesh.material.color.copy(baseColor).lerp(fizzColor, dissolvedFrac * 0.40);
          fluidMesh.material.opacity = 0.18 + dissolvedFrac * 0.35;
        } else if (reactType === 'acid_resistant') {
          // Enteric coating remains completely insoluble in acid
          fluidMesh.material.color.setHex(0xdbeafe);
          fluidMesh.material.opacity = 0.18;
        } else {
          // Cloudy microcrystalline starch erosion
          const baseColor = new THREE.Color(0xdbeafe);
          const cloudColor = new THREE.Color(this.state.fluidTargetColor || 0xfef9c3);
          fluidMesh.material.color.copy(baseColor).lerp(cloudColor, dissolvedFrac * 0.80);
          fluidMesh.material.opacity = 0.18 + dissolvedFrac * (this.state.fluidMaxOpacity || 0.40);
        }
      }

      // Sediment accumulation on beaker floor
      if (this.sedimentBeds && this.sedimentBeds[stn]) {
        const sed = this.sedimentBeds[stn];
        if (reactType === 'acid_resistant') {
          sed.visible = false;
        } else {
          sed.visible = dissolvedFrac > 0.05;
          sed.material.opacity = Math.min(0.85, dissolvedFrac * 0.95);
          sed.scale.set(1, 0.15 + dissolvedFrac * 0.85, 1);
        }
      }
    }

    // Dynamic Foam Cap on Basket Tubes (for effervescent tablets)
    if (this.tubeFoamPlates && this.tubeFoamPlates.length > 0) {
      const showFoam = isRunning && reactType === 'effervescent_fizz' && dissolvedFrac > 0.03 && dissolvedFrac < 0.98;
      for (const fp of this.tubeFoamPlates) {
        fp.visible = showFoam;
        if (showFoam) {
          const foamScale = 0.3 + 0.7 * Math.sin(dissolvedFrac * Math.PI) * (1.0 + 0.15 * Math.sin(now * 8.0));
          fp.scale.set(1, foamScale, 1);
        }
      }
    }

    // Plume & Bubble Particle Physics
    if (this.reactionParticles && this.reactionParticles.length > 0) {
      for (let stn = 0; stn < this.reactionParticles.length; stn++) {
        const group = this.reactionParticles[stn];

        // 1. Disintegration Plumes (Drifting down through mesh into beaker)
        const showPlumes = isRunning && reactType !== 'acid_resistant' && dissolvedFrac < 0.96;
        for (const p of group.plumes) {
          p.mesh.visible = showPlumes;
          if (showPlumes) {
            p.mesh.position.y -= dt * p.speed;
            p.wobble += dt * 3.0;
            p.mesh.position.x = p.baseX + Math.sin(p.wobble) * 0.025;
            p.mesh.position.z = p.baseZ + Math.cos(p.wobble) * 0.025;
            p.mesh.material.opacity = Math.max(0, 0.65 * (1.0 - dissolvedFrac) * (p.mesh.position.y / 1.2));
            if (p.mesh.position.y <= 0.10) {
              p.mesh.position.y = 0.85 + Math.random() * 0.25;
            }
          }
        }

        // 2. Effervescent CO2 Bubbles (Streaming rapidly upward to liquid surface)
        const showBubbles = isRunning && reactType === 'effervescent_fizz' && dissolvedFrac < 0.97;
        for (const b of group.bubbles) {
          b.mesh.visible = showBubbles;
          if (showBubbles) {
            b.mesh.position.y += dt * b.speedY;
            b.angle += dt * 4.0;
            b.mesh.position.x += Math.sin(b.angle) * 0.004;
            b.mesh.position.z += Math.cos(b.angle) * 0.004;
            if (b.mesh.position.y >= 1.30) {
              b.mesh.position.y = 0.12 + Math.random() * 0.20;
            }
          }
        }
      }
    }

    // Dynamic Touch Ripple animations
    if (this.touchRipples && this.touchRipples.length > 0) {
      let needsRerender = false;
      for (let r = this.touchRipples.length - 1; r >= 0; r--) {
        const ripple = this.touchRipples[r];
        ripple.radius += dt * 65.0;
        ripple.alpha -= dt * 1.8;
        if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
          this.touchRipples.splice(r, 1);
        }
        needsRerender = true;
      }
      if (needsRerender) {
        this.renderLCD();
      }
    }

    // Notify 2D callout overlay callback if registered
    if (typeof this.onAfterFrame === 'function') {
      this.onAfterFrame();
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
