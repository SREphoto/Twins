/**
 * sem_materials.js — Industrial PBR Materials, Procedural Canvas Textures,
 * Orientation-Guaranteed Quad Geometries, Genuine 3D Fasteners, ConFlat Flanges,
 * Routed Wiring Harnesses & Official SREdesigns Certification Badge
 *
 * Coordinate Convention: 1 unit = 100 mm = 0.1 m | +Y up | Front = -Z | screenRight = -X | screenLeft = +X
 */

import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Deterministic PRNG for Reproducible Procedural Surface Textures
// ----------------------------------------------------------------------------
function makePRNG(seed = 0x5E3500) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// ----------------------------------------------------------------------------
// Material & Offscreen Canvas Factories
// ----------------------------------------------------------------------------
export function makeMat(color, opts = {}) {
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

export function createCanvas(w = 512, h = 512) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function finalizeCanvasTexture(canvas, repeatX = 1, repeatY = 1) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  if (repeatX !== 1 || repeatY !== 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
  }
  return tex;
}

function makeFallbackTexture() {
  const tex = new THREE.Texture();
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ----------------------------------------------------------------------------
// Procedural Textures (All CanvasTextures set flipY = false & SRGBColorSpace)
// ----------------------------------------------------------------------------
function makeBrushedMetalTexture(baseHex = '#dde4ec', streakHex = '#94a3b8', seed = 42) {
  const c = createCanvas(512, 512);
  if (!c) return makeFallbackTexture();
  const ctx = c.getContext('2d');
  const rand = makePRNG(seed);

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  // Fine directional grain streaks
  ctx.strokeStyle = streakHex;
  for (let i = 0; i < 820; i++) {
    const y = rand() * 512;
    ctx.globalAlpha = 0.08 + rand() * 0.18;
    ctx.lineWidth = 0.5 + rand() * 1.4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + (rand() - 0.5) * 2.2);
    ctx.stroke();
  }

  // Bright micro-specular highlights
  ctx.strokeStyle = '#ffffff';
  for (let i = 0; i < 240; i++) {
    const y = rand() * 512;
    ctx.globalAlpha = 0.03 + rand() * 0.07;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(rand() * 200, y);
    ctx.lineTo(280 + rand() * 232, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeToroidCopperTexture() {
  const c = createCanvas(512, 512);
  if (!c) return makeFallbackTexture();
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#9a4612';
  ctx.fillRect(0, 0, 512, 512);

  for (let x = 0; x < 512; x += 3) {
    ctx.fillStyle = x % 6 === 0 ? '#d97706' : '#7c2d12';
    ctx.fillRect(x, 0, 2, 512);
    ctx.fillStyle = 'rgba(254, 215, 170, 0.22)';
    ctx.fillRect(x, 0, 1, 512);
  }

  // Subtle Kapton / amber enamel band across core mid-band
  ctx.fillStyle = 'rgba(180, 83, 9, 0.25)';
  ctx.fillRect(0, 210, 512, 92);

  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeMotherboardPCBTexture() {
  const c = createCanvas(1024, 1024);
  if (!c) return makeFallbackTexture();
  const ctx = c.getContext('2d');

  // 1. Dark Emerald FR-4 Solder Mask + Fiberglass Weave Micro-Grid
  ctx.fillStyle = '#043927';
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
  ctx.lineWidth = 1;
  for (let g = 0; g < 1024; g += 8) {
    ctx.beginPath();
    ctx.moveTo(g, 0);
    ctx.lineTo(g, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, g);
    ctx.lineTo(1024, g);
    ctx.stroke();
  }

  // Isolated internal copper ground pours (slightly lighter emerald planes)
  const pours = [
    [36, 36, 440, 420],
    [510, 36, 478, 420],
    [36, 488, 560, 498],
    [624, 488, 364, 498],
  ];
  ctx.fillStyle = '#064e3b';
  ctx.strokeStyle = '#0a6d4e';
  ctx.lineWidth = 2;
  pours.forEach(([x, y, w, h]) => {
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
  });

  // 2. Fine Parallel Bus Traces (45-degree chamfered routing)
  const drawBus = (x0, y0, count, spacing, len1, dx, dy, len2) => {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.2;
    for (let i = 0; i < count; i++) {
      const off = i * spacing;
      ctx.beginPath();
      ctx.moveTo(x0, y0 + off);
      ctx.lineTo(x0 + len1, y0 + off);
      ctx.lineTo(x0 + len1 + dx, y0 + off + dy);
      ctx.lineTo(x0 + len1 + dx + len2, y0 + off + dy);
      ctx.stroke();
    }
  };
  drawBus(120, 140, 12, 9, 140, 45, 45, 130);
  drawBus(540, 160, 10, 10, 120, 40, -40, 160);
  drawBus(100, 620, 14, 9, 180, 50, -50, 150);
  drawBus(580, 740, 8, 10, 140, -35, 35, 110);

  // 3. Length-Matched Differential Pairs (100-ohm LVDS / PCIe / Ethernet / USB)
  const drawDiffPair = (startX, startY, segments, amp) => {
    [-3.5, 3.5].forEach((offset, pairIdx) => {
      ctx.strokeStyle = pairIdx === 0 ? '#34d399' : '#14b8a6';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      let cx = startX;
      let cy = startY + offset;
      ctx.moveTo(cx, cy);
      for (let s = 0; s < segments; s++) {
        cx += 26;
        ctx.lineTo(cx, cy);
        const dir = s % 2 === 0 ? 1 : -1;
        cx += 10;
        cy += dir * amp;
        ctx.lineTo(cx, cy);
        cx += 18;
        ctx.lineTo(cx, cy);
        cx += 10;
        cy -= dir * amp;
        ctx.lineTo(cx, cy);
      }
      ctx.lineTo(cx + 60, cy);
      ctx.stroke();
    });
  };
  drawDiffPair(110, 390, 4, 14);
  drawDiffPair(550, 410, 5, 12);
  drawDiffPair(240, 540, 6, 15);
  drawDiffPair(640, 600, 4, 12);

  // 4. Gold ENIG Pads (QFP IC Footprints, BGA Array, Header Strips & Stitched Vias)
  const drawPad = (x, y, w, h, drillR = 0) => {
    ctx.fillStyle = '#f5c542';
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    if (drillR > 0) {
      ctx.fillStyle = '#07110d';
      ctx.beginPath();
      ctx.arc(x, y, drillR, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // U1 LQFP-176 MCU pad ring (around center 280, 250)
  const qfpCx = 280;
  const qfpCy = 250;
  const qfpHalf = 104;
  ctx.fillStyle = '#eab308';
  ctx.fillRect(qfpCx - 58, qfpCy - 58, 116, 116); // Exposed ENIG thermal pad
  for (let p = -10; p <= 10; p++) {
    const o = p * 8.2;
    drawPad(qfpCx + o, qfpCy - qfpHalf, 4.8, 16, 0);
    drawPad(qfpCx + o, qfpCy + qfpHalf, 4.8, 16, 0);
    drawPad(qfpCx - qfpHalf, qfpCy + o, 16, 4.8, 0);
    drawPad(qfpCx + qfpHalf, qfpCy + o, 16, 4.8, 0);
  }

  // U2 / U3 Memory & FPGA BGA/TSOP footprints
  for (let row = 0; row < 12; row++) {
    drawPad(650, 120 + row * 12, 16, 5.5, 0);
    drawPad(750, 120 + row * 12, 16, 5.5, 0);
    drawPad(650, 300 + row * 12, 16, 5.5, 0);
    drawPad(750, 300 + row * 12, 16, 5.5, 0);
  }

  // BGA Pad Grid (U4 NVMe / Scan DSP)
  for (let br = 0; br < 8; br++) {
    for (let bc = 0; bc < 8; bc++) {
      ctx.fillStyle = '#f5c542';
      ctx.beginPath();
      ctx.arc(790 + bc * 18, 690 + br * 18, 4.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // J1..J4 Through-hole header & Phoenix terminal ENIG pads
  for (let h = 0; h < 16; h++) {
    drawPad(260 + h * 24, 910, 14, 14, 4.2);
    drawPad(260 + h * 24, 940, 14, 14, 4.2);
  }

  // SMD Passive Pads (R / C arrays)
  for (let k = 0; k < 14; k++) {
    const px = 90 + k * 28;
    drawPad(px, 515, 9, 10, 0);
    drawPad(px + 12, 515, 9, 10, 0);
    drawPad(px, 790, 9, 10, 0);
    drawPad(px + 12, 790, 9, 10, 0);
  }

  // Stitched Perimeter Ground Vias & Mounting Holes
  for (let v = 56; v <= 968; v += 38) {
    [22, 1002].forEach(vy => {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(v, vy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#031c13';
      ctx.beginPath();
      ctx.arc(v, vy, 2.0, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  [
    [48, 48],
    [512, 48],
    [976, 48],
    [48, 976],
    [512, 976],
    [976, 976],
  ].forEach(([mx, my]) => {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(mx, my, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#07110d';
    ctx.beginPath();
    ctx.arc(mx, my, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. Crisp White Component Silkscreen Outlines & Reference Designators
  ctx.strokeStyle = '#e2e8f0';
  ctx.fillStyle = '#f8fafc';
  ctx.lineWidth = 2;

  // Component courtyard outlines
  ctx.strokeRect(qfpCx - 92, qfpCy - 92, 184, 184);
  ctx.strokeRect(662, 110, 76, 152);
  ctx.strokeRect(662, 290, 76, 152);
  ctx.strokeRect(776, 676, 154, 154);
  ctx.strokeRect(240, 892, 404, 66);

  // Pin-1 orientation dots
  [
    [qfpCx - 80, qfpCy - 80],
    [672, 122],
    [672, 302],
    [786, 686],
  ].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(dx, dy, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.font = 'bold 20px "IBM Plex Mono", monospace';
  ctx.fillText('U1 STM32H7-FPGA', qfpCx - 84, qfpCy - 120);
  ctx.fillText('U2 SDRAM-A', 654, 100);
  ctx.fillText('U3 SDRAM-B', 654, 280);
  ctx.fillText('U4 NVME-256G', 774, 664);
  ctx.fillText('J1 PHOENIX IO BUS (24V / CAN / SPI)', 244, 882);

  ctx.font = 'bold 15px "IBM Plex Mono", monospace';
  ['R101', 'R102', 'R103', 'C201', 'C202', 'C203', 'L1', 'D1', 'TP1', 'TP2'].forEach((ref, i) => {
    ctx.fillText(ref, 84 + i * 40, 502);
  });
  ['R204', 'R205', 'C310', 'C311', 'U5 ADC', 'U6 DAC', 'Y1 25MHz', 'BT1 CR2032'].forEach((ref, i) => {
    ctx.fillText(ref, 84 + i * 52, 774);
  });

  ctx.font = 'bold 18px "IBM Plex Mono", monospace';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('ZEISS GEMINI-500 SCAN CTRL REV 4.2 · 6L FR-4 ENIG', 92, 70);

  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makePSUStampedPerforatedTexture() {
  const c = createCanvas(512, 512);
  if (!c) return makeFallbackTexture();
  const ctx = c.getContext('2d');
  const rand = makePRNG(7741);

  // Brushed galvanized stamped steel base
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#94a3b8';
  for (let i = 0; i < 420; i++) {
    const y = rand() * 512;
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 0.8 + rand() * 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  // Stamped outer flange border ribs
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, 476, 476);

  // Honeycomb hexagonal perforation grid with chamfered metallic rim + genuine alpha cutouts
  const hexR = 16;
  const colStep = 40;
  const rowStep = 35;

  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 10; col++) {
      const cx = 64 + col * colStep + (row % 2 === 1 ? colStep * 0.5 : 0);
      const cy = 68 + row * rowStep;
      if (cx > 452 || cy > 448) continue;

      // Subtle stamped chamfer ring around each cutout
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3 + Math.PI / 6;
        const px = cx + Math.cos(a) * (hexR + 1.5);
        const py = cy + Math.sin(a) * (hexR + 1.5);
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      // Punch clean transparent alpha cutout through the stamped steel
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3 + Math.PI / 6;
        const px = cx + Math.cos(a) * hexR;
        const py = cy + Math.sin(a) * hexR;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // Four slotted mounting vent channels along top and bottom margins
  [36, 476].forEach(sy => {
    for (let sx = 72; sx <= 440; sx += 58) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(sx - 18, sy - 5, 36, 10, 5);
      ctx.fill();
      ctx.restore();
    }
  });

  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makePEGreenYellowTexture() {
  const c = createCanvas(256, 256);
  if (!c) return makeFallbackTexture();
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#eab308';
  for (let i = -256; i < 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 32, 0);
    ctx.lineTo(i + 288, 256);
    ctx.lineTo(i + 256, 256);
    ctx.closePath();
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const TEX_BRUSHED_SS = makeBrushedMetalTexture('#e2e8f0', '#94a3b8', 101);
export const TEX_BRUSHED_DARK = makeBrushedMetalTexture('#1e293b', '#0f172a', 202);
export const TEX_TOROID_COPPER = makeToroidCopperTexture();
export const TEX_PCB_FR4 = makeMotherboardPCBTexture();
export const TEX_PSU_PERFORATED = makePSUStampedPerforatedTexture();
const TEX_PE_GRNYLW = makePEGreenYellowTexture();

// ----------------------------------------------------------------------------
// Industrial PBR Material Constants
// ----------------------------------------------------------------------------
export const MAT_ZEISS_WHITE = makeMat(0xf1f5f9, { r: 0.26, m: 0.10 });
export const MAT_ZEISS_ANTHRACITE = makeMat(0x18202c, { r: 0.42, m: 0.28 });
export const MAT_ZEISS_BLUE = makeMat(0x1d4ed8, { r: 0.28, m: 0.55 });
export const MAT_FRAME_STEEL = makeMat(0x273244, { r: 0.48, m: 0.65 });
export const MAT_GRANITE_SLAB = makeMat(0x1f242d, { r: 0.32, m: 0.18 });
export const MAT_316SS_POLISHED = makeMat(0xf8fafc, { r: 0.14, m: 0.92 });

export const MAT_316SS_BRUSHED = new THREE.MeshStandardMaterial({
  color: 0xdbe3ec,
  map: TEX_BRUSHED_SS,
  roughness: 0.24,
  metalness: 0.85,
});

export const MAT_DARK_ANODIZED = new THREE.MeshStandardMaterial({
  color: 0x1e293b,
  map: TEX_BRUSHED_DARK,
  roughness: 0.30,
  metalness: 0.78,
});

export const MAT_PSU_PERFORATED = new THREE.MeshStandardMaterial({
  color: 0xe2e8f0,
  map: TEX_PSU_PERFORATED,
  roughness: 0.26,
  metalness: 0.82,
  alphaTest: 0.45,
  side: THREE.DoubleSide,
});

export const MAT_BLUE_ANODIZED = makeMat(0x0284c7, { r: 0.25, m: 0.82 });
export const MAT_RED_ANODIZED = makeMat(0xdc2626, { r: 0.28, m: 0.72 });
export const MAT_YELLOW_SAFETY = makeMat(0xfacc15, { r: 0.30, m: 0.14 });
export const MAT_COPPER_OFHC = makeMat(0xc2410c, { r: 0.18, m: 0.90 });
export const MAT_BRASS_GOLD = makeMat(0xd97706, { r: 0.20, m: 0.88 });
export const MAT_GOLD_MIRROR = makeMat(0xfacc15, { r: 0.04, m: 0.98 });
export const MAT_RUBBER_EPDM = makeMat(0x12151a, { r: 0.88, m: 0.04 });
export const MAT_VITON_SEAL = makeMat(0x090b0e, { r: 0.75, m: 0.06 });
export const MAT_ALUMINA_CERAMIC = makeMat(0xf8fafc, { r: 0.22, m: 0.04 });

export const MAT_PCB_FR4 = new THREE.MeshStandardMaterial({
  map: TEX_PCB_FR4,
  roughness: 0.32,
  metalness: 0.18,
});

export const MAT_IC_EPOXY = makeMat(0x14171f, { r: 0.40, m: 0.08 });

export const MAT_TOROID_COIL = new THREE.MeshStandardMaterial({
  map: TEX_TOROID_COPPER,
  roughness: 0.25,
  metalness: 0.80,
});

export const MAT_HV_EPOXY_RED = makeMat(0x991b1b, { r: 0.32, m: 0.15 });
export const MAT_WIRE_HV_RED = makeMat(0xdc2626, { r: 0.35, m: 0.06 });
export const MAT_WIRE_AC_BROWN = makeMat(0x78350f, { r: 0.38, m: 0.08 });
export const MAT_WIRE_AC_BLUE = makeMat(0x1d4ed8, { r: 0.38, m: 0.08 });
export const MAT_WIRE_PE_GRNYLW = new THREE.MeshStandardMaterial({
  map: TEX_PE_GRNYLW,
  roughness: 0.38,
  metalness: 0.08,
});
export const MAT_WIRE_DC_RED = makeMat(0xef4444, { r: 0.36, m: 0.08 });
export const MAT_WIRE_DC_BLACK = makeMat(0x18181b, { r: 0.40, m: 0.08 });
export const MAT_WIRE_SENSOR_CYAN = makeMat(0x06b6d4, { r: 0.34, m: 0.12 });
export const MAT_WIRE_DATA_GREY = makeMat(0x475569, { r: 0.44, m: 0.12 });
export const MAT_COOLANT_BLUE = makeMat(0x0284c7, { r: 0.24, m: 0.08 });
export const MAT_COOLANT_RED = makeMat(0xe11d48, { r: 0.24, m: 0.08 });
export const MAT_PHOENIX_GREEN = makeMat(0x15803d, { r: 0.35, m: 0.08 });

export const MAT_BOROSILICATE_GLASS = new THREE.MeshPhysicalMaterial({
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

export const MAT_DISPLAY_COVER_GLASS = new THREE.MeshPhysicalMaterial({
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

export const MAT_ELECTRON_BEAM = makeMat(0x00f3ff, {
  r: 0.15,
  m: 0.0,
  o: 0.72,
  e: 0x00f3ff,
  ei: 2.2,
  dw: false,
  side: THREE.DoubleSide,
});

export const MAT_CAST_IRON = makeMat(0x1b2028, { r: 0.62, m: 0.55 });
export const MAT_COPPER_WINDING = MAT_TOROID_COIL;
export const MAT_CONSOLE_DESK = makeMat(0x161c26, { r: 0.36, m: 0.14 });
export const MAT_LEAD_GLASS = MAT_BOROSILICATE_GLASS;
export const MAT_DISPLAY_GLASS = MAT_DISPLAY_COVER_GLASS;

// ----------------------------------------------------------------------------
// Orientation-Guaranteed Decal & Display Quad Geometries (flipY = false)
// ----------------------------------------------------------------------------

/**
 * Operator-facing vertical quad (normal [0, 0, -1]).
 * Operator stands at -Z looking +Z: +X is screen-left, -X is screen-right, +Y is up.
 */
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

/**
 * Horizontal top-facing quad (normal [0, +1, 0]) for button caps & desk console silkscreen.
 * Operator at -Z sees +X on left, -X on right, +Z toward top of text, -Z toward bottom.
 */
export function makeTopFacingQuadGeo(w, h) {
  const geo = new THREE.BufferGeometry();
  const halfW = w / 2;
  const halfH = h / 2;

  const positions = new Float32Array([
    halfW, 0, halfH,   // 0: Top-Left
    -halfW, 0, halfH,  // 1: Top-Right
    halfW, 0, -halfH,  // 2: Bottom-Left
    -halfW, 0, -halfH, // 3: Bottom-Right
  ]);
  const normals = new Float32Array([
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
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

export function createTopDecalQuad(w, h, material) {
  return new THREE.Mesh(makeTopFacingQuadGeo(w, h), material);
}

// ----------------------------------------------------------------------------
// Genuine 3D Fasteners (DIN 912 Socket Head Cap Screws + DIN 125 Washers)
// ----------------------------------------------------------------------------
export function createHexSocketScrew(r = 0.025, length = 0.08, fastenerName = 'Fastener_HexM6_01') {
  const group = new THREE.Group();
  group.name = fastenerName;

  const headR = r * 1.55;
  const headH = r * 1.90;
  const washerR = r * 2.15;
  const washerH = r * 0.32;
  const socketR = r * 0.92;
  const socketFloorY = headH * 0.36;

  // Beveled DIN 125 flat washer
  const washer = new THREE.Mesh(
    new THREE.CylinderGeometry(washerR * 0.94, washerR, washerH, 18),
    MAT_316SS_POLISHED
  );
  washer.position.y = washerH * 0.5;
  group.add(washer);

  // Genuine hollowed DIN 912 cap head with chamfered top rim and real bore cavity
  const capProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(headR, 0.0),
    new THREE.Vector2(headR, headH * 0.85),
    new THREE.Vector2(headR * 0.92, headH),
    new THREE.Vector2(socketR, headH),
    new THREE.Vector2(socketR, socketFloorY),
    new THREE.Vector2(0.0, socketFloorY),
  ];
  const head = new THREE.Mesh(
    new THREE.LatheGeometry(capProfile, 18),
    MAT_316SS_POLISHED
  );
  head.position.y = washerH;
  group.add(head);

  // Genuine 6-sided hexagonal drive socket walls inside the cap cavity
  const hexSocketWall = new THREE.Mesh(
    new THREE.CylinderGeometry(socketR * 0.98, socketR * 0.90, headH * 0.62, 6, 1, false),
    MAT_RUBBER_EPDM
  );
  hexSocketWall.position.y = washerH + socketFloorY + headH * 0.30;
  group.add(hexSocketWall);

  // Threaded shank with chamfered pilot tip
  const shank = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r * 0.88, length, 14),
    MAT_316SS_BRUSHED
  );
  shank.position.y = -length * 0.5;
  group.add(shank);

  return group;
}

// ----------------------------------------------------------------------------
// ConFlat (CF) Vacuum Flange + OFHC Copper Gasket + Bolt Circle Builder
// ----------------------------------------------------------------------------
export function createConFlatFlange(outerR, innerR, thickness, idPrefix, boltCount = 12) {
  const group = new THREE.Group();
  group.name = `Body_CFFlange_${idPrefix}`;

  const halfT = thickness * 0.5;
  const seamHalf = thickness * 0.09;
  const chamfer = Math.min(thickness * 0.08, (outerR - innerR) * 0.12);

  // Machined 316L hollow flange ring with central copper gasket pinch-seam groove
  const flangeProfile = [
    new THREE.Vector2(innerR, -halfT),
    new THREE.Vector2(outerR - chamfer, -halfT),
    new THREE.Vector2(outerR, -halfT + chamfer),
    new THREE.Vector2(outerR, -seamHalf),
    new THREE.Vector2(outerR * 0.96, -seamHalf),
    new THREE.Vector2(outerR * 0.96, seamHalf),
    new THREE.Vector2(outerR, seamHalf),
    new THREE.Vector2(outerR, halfT - chamfer),
    new THREE.Vector2(outerR - chamfer, halfT),
    new THREE.Vector2(innerR, halfT),
    new THREE.Vector2(innerR, -halfT),
  ];
  const ring = new THREE.Mesh(
    new THREE.LatheGeometry(flangeProfile, 36),
    MAT_316SS_POLISHED
  );
  group.add(ring);

  // OFHC copper knife-edge gasket seam ring visible cleanly between mating flange faces
  const gasketProfile = [
    new THREE.Vector2(innerR + (outerR - innerR) * 0.08, -seamHalf * 0.88),
    new THREE.Vector2(outerR * 0.992, -seamHalf * 0.88),
    new THREE.Vector2(outerR * 0.992, seamHalf * 0.88),
    new THREE.Vector2(innerR + (outerR - innerR) * 0.08, seamHalf * 0.88),
  ];
  const gasket = new THREE.Mesh(
    new THREE.LatheGeometry(gasketProfile, 36),
    MAT_COPPER_OFHC
  );
  group.add(gasket);

  // Radial circle of genuine 3D DIN 912 hex socket bolts
  const boltCircleR = innerR + (outerR - innerR) * 0.58;
  const screwR = Math.max(0.014, Math.min(0.024, (outerR - innerR) * 0.11));
  for (let i = 0; i < boltCount; i++) {
    const ang = (i / boltCount) * Math.PI * 2;
    const screw = createHexSocketScrew(
      screwR,
      thickness * 0.88,
      `Fastener_HexM6_${idPrefix}_${String(i + 1).padStart(2, '0')}`
    );
    screw.position.set(
      Math.cos(ang) * boltCircleR,
      halfT,
      Math.sin(ang) * boltCircleR
    );
    group.add(screw);
  }
  return group;
}

// ----------------------------------------------------------------------------
// Point-to-Point Routed Harness + Tangent-Aligned EPDM Strain Relief Boots
// ----------------------------------------------------------------------------
export function makeWiringHarness(points, radius, material, harnessName, withGrommets = true) {
  const group = new THREE.Group();
  group.name = harnessName;

  const vecPoints = points.map(p => new THREE.Vector3(...p));
  const curve = new THREE.CatmullRomCurve3(vecPoints);
  const segs = Math.max(32, points.length * 14);
  const tubeGeo = new THREE.TubeGeometry(curve, segs, radius, 12, false);
  const tube = new THREE.Mesh(tubeGeo, material);
  tube.castShadow = true;
  tube.name = `Body_CableRun_${harnessName}`;
  group.add(tube);

  if (withGrommets && vecPoints.length >= 2) {
    const upAxis = new THREE.Vector3(0, 1, 0);
    [0.0, 1.0].forEach((t, idx) => {
      const pt = curve.getPointAt(t);
      const tan = curve.getTangentAt(t).normalize();
      const boot = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 1.55, radius * 1.95, radius * 3.0, 16),
        MAT_RUBBER_EPDM
      );
      boot.position.copy(pt);
      boot.quaternion.setFromUnitVectors(upAxis, tan);
      boot.name = `Body_StrainBoot_${harnessName}_${idx}`;
      group.add(boot);
    });
  }
  return group;
}

// ----------------------------------------------------------------------------
// Official SREdesigns Certification Badge (Seated in 1.16 x 0.36 x 0.04 Pocket Frame)
// ----------------------------------------------------------------------------
export function makeSREdesignsBadge() {
  const badgeGroup = new THREE.Group();
  badgeGroup.name = 'Badge_SREdesigns';

  // 1.16 x 0.36 x 0.04 dark anodized recessed pocket perimeter frame (Z: -0.020..+0.020)
  const outerW = 1.16;
  const outerH = 0.36;
  const frameDepth = 0.04;
  const innerW = 1.08;
  const innerH = 0.28;
  const railW = (outerW - innerW) * 0.5;
  const railH = (outerH - innerH) * 0.5;

  const topRail = new THREE.Mesh(
    new THREE.BoxGeometry(outerW, railH, frameDepth),
    MAT_DARK_ANODIZED
  );
  topRail.position.set(0, (outerH - railH) * 0.5, 0);
  topRail.name = 'Body_BadgeBezelTop';
  badgeGroup.add(topRail);

  const botRail = new THREE.Mesh(
    new THREE.BoxGeometry(outerW, railH, frameDepth),
    MAT_DARK_ANODIZED
  );
  botRail.position.set(0, -(outerH - railH) * 0.5, 0);
  botRail.name = 'Body_BadgeBezelBot';
  badgeGroup.add(botRail);

  const leftRail = new THREE.Mesh(
    new THREE.BoxGeometry(railW, innerH, frameDepth),
    MAT_DARK_ANODIZED
  );
  leftRail.position.set((outerW - railW) * 0.5, 0, 0);
  leftRail.name = 'Body_BadgeBezelLeft';
  badgeGroup.add(leftRail);

  const rightRail = new THREE.Mesh(
    new THREE.BoxGeometry(railW, innerH, frameDepth),
    MAT_DARK_ANODIZED
  );
  rightRail.position.set(-(outerW - railW) * 0.5, 0, 0);
  rightRail.name = 'Body_BadgeBezelRight';
  badgeGroup.add(rightRail);

  const backStop = new THREE.Mesh(
    new THREE.BoxGeometry(innerW, innerH, 0.014),
    MAT_ZEISS_ANTHRACITE
  );
  backStop.position.set(0, 0, 0.013);
  backStop.name = 'Body_BadgeBackStop';
  badgeGroup.add(backStop);

  // CNC brushed-aluminum plate seated inside the recessed frame (Z: -0.014..+0.004)
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(1.07, 0.27, 0.018),
    MAT_316SS_BRUSHED
  );
  plate.position.set(0, 0, -0.005);
  plate.name = 'Body_BadgePlate';
  badgeGroup.add(plate);

  // High-DPI laser-etched vector plate artwork: [S][R][E] designs.com / CERTIFIED DIGITAL TWIN · GEMINI-500
  const c = createCanvas(1024, 256);
  let decalMat;
  if (c) {
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 1024, 256);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#182334');
    grad.addColorStop(1, '#0c1320');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 256);

    // Subtle brushed grain lines across plate
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 0; y < 256; y += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Cyan anodized inner hairline frame
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 5;
    ctx.strokeRect(14, 14, 996, 228);

    // Stylized [S][R][E] keycaps + designs.com
    const letters = ['S', 'R', 'E'];
    const startX = 165;
    letters.forEach((ch, idx) => {
      const bx = startX + idx * 66;
      const by = 60;
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(bx, by, 54, 62);
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 3;
      ctx.strokeRect(bx, by, 54, 62);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 42px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ch, bx + 27, by + 33);
    });

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 54px "Inter", "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('designs.com', 382, 93);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFIED DIGITAL TWIN · GEMINI-500', 512, 186);

    const tex = finalizeCanvasTexture(c);
    decalMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.24,
      metalness: 0.42,
    });
  } else {
    decalMat = makeMat(0x0f172a, { r: 0.25, m: 0.45 });
  }

  const quad = createDecalQuad(1.03, 0.25, decalMat);
  quad.position.set(0, 0, -0.0155);
  quad.name = 'Body_BadgeDecal';
  badgeGroup.add(quad);

  // 4 corner M3 hex socket screws holding the nameplate inside the bezel
  const cornerOffsets = [
    [-0.48, 0.10],
    [0.48, 0.10],
    [-0.48, -0.10],
    [0.48, -0.10],
  ];
  cornerOffsets.forEach(([cx, cy], idx) => {
    const scr = createHexSocketScrew(0.013, 0.024, `Fastener_HexM3_Badge_0${idx + 1}`);
    scr.rotation.x = -Math.PI / 2;
    scr.position.set(cx, cy, -0.0145);
    badgeGroup.add(scr);
  });

  return badgeGroup;
}
