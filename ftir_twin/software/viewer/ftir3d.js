// ==========================================
// SREdesigns FTIR-7000x Research-Grade FTIR Spectrometer
// Procedural 3D CAD & Digital Twin Engine (Three.js)
//
// 13-Subagent Puzzle Architecture Standards:
// - Authentic Laboratory Coordinate Alignment:
//     * Datum Bench at Y = 0
//     * Front Fascia at Z = -2.38 (faces operator & CAM_FRONT)
//     * Rear I/O Panel at Z = +2.38 (faces wall & CAM_REAR)
//     * Operator Right (-X): 18.5° Solid Sloped Console Wedge (Chassis_SlopedConsole),
//       Capacitive Touchscreen (UI_LCD), 5 Tactile Push Buttons, Official Badge_SREdesigns,
//       Front Air Intake Louvers. Right flank slopes flush with console (ZERO PARAPET WALL).
//     * Operator Left (+X): Open Diamond ATR Sampling Station, 316L Stainless Steel Deck Plate,
//       Concentric Solvent Well, Monolithic Type IIa Diamond Crystal, 180° Swiveling Clamp Tower,
//       Low Molded Base Curb (Y <= 0.95, ZERO TALL WALLS, 180° Ergonomic Hand/Tool Clearance).
//     * Rear Section (Z in [0, 2.38]): Sealed Optics Enclosure, Desiccant Service Hatch with
//       knurled thumbscrew, Silica Gel Humidity Indicator Window, Polished Chrome Ridge Runners.
//     * Rear Panel (Z = +2.38): IEC-320 C14 Inlet, Rocker Power Switch, 80mm Exhaust Fan Louvers,
//       1/4" Swagelok Dry N2 Purge Port, Gold Grounding Lug, DB-9 RS-232, USB-B 2.0, RJ45 Ethernet,
//       Silkscreened Aluminum GLP Rating Plate.
//     * Benchtop AC Service Pedestal: Positioned BEHIND the machine at (X = -1.40, Y = 0, Z = 3.35),
//       with duplex NEMA 5-15R receptacles. Power cord runs naturally along rear bench border.
//     * Side Flanks (X = +/-2.18): Anodized aluminum side bumper rails with countersunk M3 hex
//       socket screws, recessed molded urethane lift handles, dark base pan reveal, leveling feet.
//     * Internal Anatomy (Anchored to Base Pan): Optical Breadboard with tapped M6 hole grid,
//       Polaris Ever-Glo ceramic source (1200°C) with cooling fins and thermal glow, sealed
//       HeNe 632.8 nm reference laser tube with Alden HV lead, KBr beamsplitter + compensator in
//       brass kinematic mount, moving voice-coil linear motor with spring flexures and active scan,
//       DTGS detector, KBr bulkhead windows, SMPS with toroidal transformer and barrier strip,
//       80mm fan with 7 rotating blades, FR4 DSP motherboard, primary AC and data wiring harnesses.
// ==========================================

import * as THREE from 'three';

// ------------------------------------------
// Standardized PBR Materials
// ------------------------------------------
const MAT_CHASSIS = new THREE.MeshStandardMaterial({
  color: 0xe2e8f0,
  roughness: 0.38,
  metalness: 0.12,
});

const MAT_CHASSIS_DARK = new THREE.MeshStandardMaterial({
  color: 0x1e293b,
  roughness: 0.65,
  metalness: 0.25,
});

const MAT_BEZEL = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  roughness: 0.25,
  metalness: 0.15,
});

const MAT_CHROME = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.08,
  metalness: 0.96,
});

const MAT_ALUM_BREADBOARD = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  roughness: 0.35,
  metalness: 0.85,
});

const MAT_ALUM_ANODIZED = new THREE.MeshStandardMaterial({
  color: 0x64748b,
  roughness: 0.30,
  metalness: 0.70,
});

const MAT_STAINLESS_ATR = new THREE.MeshStandardMaterial({
  color: 0xf1f5f9,
  roughness: 0.10,
  metalness: 0.92,
});

const MAT_GOLD_MIRROR = new THREE.MeshStandardMaterial({
  color: 0xffd700,
  roughness: 0.04,
  metalness: 0.98,
});

const MAT_BRASS_FITTING = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.28,
  metalness: 0.88,
});

const MAT_COPPER_WIRE = new THREE.MeshStandardMaterial({
  color: 0xb87333,
  roughness: 0.32,
  metalness: 0.85,
});

const MAT_KBR_CRYSTAL = new THREE.MeshPhysicalMaterial({
  color: 0xe0f2fe,
  transmission: 0.92,
  ior: 1.56,
  roughness: 0.05,
  transparent: true,
  opacity: 0.88,
});

const MAT_DIAMOND_PRISM = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.95,
  ior: 2.417,
  roughness: 0.02,
  transparent: true,
  opacity: 0.92,
});

const MAT_CERAMIC_HOT = new THREE.MeshStandardMaterial({
  color: 0xff5500,
  roughness: 0.55,
  metalness: 0.10,
  emissive: 0xff3300,
  emissiveIntensity: 0.85,
});

const MAT_CERAMIC_OFF = new THREE.MeshStandardMaterial({
  color: 0x334155,
  roughness: 0.70,
  metalness: 0.05,
});

const MAT_LASER_TUBE = new THREE.MeshStandardMaterial({
  color: 0xdcfce7,
  roughness: 0.15,
  metalness: 0.80,
});

const MAT_DETECTOR_CAN = new THREE.MeshStandardMaterial({
  color: 0x94a3b8,
  roughness: 0.20,
  metalness: 0.90,
});

const MAT_PCB_FR4 = new THREE.MeshStandardMaterial({
  color: 0x064e3b,
  roughness: 0.40,
  metalness: 0.20,
});

const MAT_CABLE_PVC = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  roughness: 0.85,
  metalness: 0.05,
});

const MAT_RUBBER_FEET = new THREE.MeshStandardMaterial({
  color: 0x090d16,
  roughness: 0.95,
  metalness: 0.02,
});

const MAT_CHASSIS_GLASS = new THREE.MeshStandardMaterial({
  color: 0x93c5fd,
  roughness: 0.15,
  metalness: 0.10,
  transparent: true,
  opacity: 0.20,
  depthWrite: false,
  side: THREE.DoubleSide,
});

const MAT_OPTICAL_GLASS = new THREE.MeshPhysicalMaterial({
  color: 0xf8fafc,
  roughness: 0.02,
  metalness: 0.05,
  transparent: true,
  opacity: 0.12,
  depthWrite: false,
  reflectivity: 0.95,
  clearcoat: 1.0,
  clearcoatRoughness: 0.02,
});

const MAT_HEX_RECESS = new THREE.MeshBasicMaterial({ color: 0x0a0d14 });

// Physical Connector, Electronic Component & Wiring Materials
const MAT_NYLON_WHITE = new THREE.MeshStandardMaterial({
  color: 0xf8fafc,
  roughness: 0.35,
  metalness: 0.05,
});

const MAT_NYLON_CLIP = new THREE.MeshStandardMaterial({
  color: 0x1e293b,
  roughness: 0.45,
  metalness: 0.10,
});

const MAT_GOLD_PIN = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  roughness: 0.25,
  metalness: 0.90,
});

const MAT_CRIMP_BLUE = new THREE.MeshStandardMaterial({
  color: 0x2563eb,
  roughness: 0.45,
  metalness: 0.10,
});

const MAT_CRIMP_RED = new THREE.MeshStandardMaterial({
  color: 0xdc2626,
  roughness: 0.45,
  metalness: 0.10,
});

const MAT_CRIMP_YELLOW = new THREE.MeshStandardMaterial({
  color: 0xeab308,
  roughness: 0.45,
  metalness: 0.10,
});

const MAT_SMD_BODY = new THREE.MeshStandardMaterial({
  color: 0x1e293b,
  roughness: 0.6,
  metalness: 0.2,
});

const MAT_SMD_CAP = new THREE.MeshStandardMaterial({
  color: 0xa16207,
  roughness: 0.5,
  metalness: 0.3,
});

const MAT_SMD_TIN = new THREE.MeshStandardMaterial({
  color: 0xd1d5db,
  roughness: 0.25,
  metalness: 0.85,
});

const MAT_LED_GREEN = new THREE.MeshStandardMaterial({
  color: 0x22c55e,
  emissive: 0x22c55e,
  emissiveIntensity: 0.9,
  roughness: 0.2,
});

const MAT_LED_AMBER = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  emissive: 0xf59e0b,
  emissiveIntensity: 0.9,
  roughness: 0.2,
});

const MAT_CERAMIC_WHITE = new THREE.MeshStandardMaterial({
  color: 0xf8fafc,
  roughness: 0.4,
  metalness: 0.1,
});

const MAT_FPC_KAPTON = new THREE.MeshStandardMaterial({
  color: 0xd97706,
  roughness: 0.35,
  metalness: 0.30,
});

const MAT_WIRE_RED = new THREE.MeshStandardMaterial({
  color: 0xdc2626,
  roughness: 0.7,
});

const MAT_WIRE_BLACK = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  roughness: 0.8,
});

const MAT_WIRE_WHITE = new THREE.MeshStandardMaterial({
  color: 0xf8fafc,
  roughness: 0.7,
});

const MAT_WIRE_GREEN_YELLOW = new THREE.MeshStandardMaterial({
  color: 0x16a34a,
  roughness: 0.7,
});

const MAT_WIRE_BLUE = new THREE.MeshStandardMaterial({
  color: 0x2563eb,
  roughness: 0.7,
});

const MAT_WIRE_YELLOW = new THREE.MeshStandardMaterial({
  color: 0xeab308,
  roughness: 0.7,
});

const MAT_WIRE_COAX = new THREE.MeshStandardMaterial({
  color: 0x1e293b,
  roughness: 0.5,
  metalness: 0.1,
});

const MAT_PCB_GREEN = new THREE.MeshStandardMaterial({
  color: 0x064e3b,
  roughness: 0.40,
  metalness: 0.15,
});

// Analyte Visual Materials
const MAT_LIQUID_SAMPLE = new THREE.MeshPhysicalMaterial({
  color: 0x38bdf8,
  transmission: 0.88,
  ior: 1.377,
  roughness: 0.08,
  transparent: true,
  opacity: 0.85,
});

const MAT_POWDER_SAMPLE = new THREE.MeshStandardMaterial({
  color: 0xf8fafc,
  roughness: 0.90,
  metalness: 0.02,
});

const MAT_FILM_SAMPLE = new THREE.MeshPhysicalMaterial({
  color: 0xe2e8f0,
  transmission: 0.75,
  ior: 1.59,
  roughness: 0.15,
  transparent: true,
  opacity: 0.72,
});

// ==========================================
// Official SREdesigns Brand Badge
// (1024x260 Canvas, 3 Jewel-Enamel [S][R][E] Tiles, Corner M1.5 Hex Bolts)
// ==========================================
export function makeSREdesignsBadge(scale = 0.55) {
  const group = new THREE.Group();
  group.name = 'Badge_SREdesigns';

  const plateW = 1.18 * scale;
  const plateH = 0.30 * scale;
  const plateD = 0.012;

  // Outer beveled chrome bezel frame
  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(plateW + 0.02, plateH + 0.02, plateD),
    MAT_CHROME
  );
  group.add(bezel);

  // Brushed titanium backing plate
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(plateW, plateH, plateD * 0.9),
    MAT_ALUM_ANODIZED
  );
  plate.position.z = plateD * 0.05;
  group.add(plate);

  // 4 Corner Micro-fasteners (M1.5 hex bolts with counterbores)
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const screw = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.007, 0.006, 6),
        MAT_CHROME
      );
      screw.rotation.x = Math.PI / 2;
      screw.position.set(sx * (plateW / 2 - 0.02), sy * (plateH / 2 - 0.02), plateD / 2 + 0.003);
      group.add(screw);
    }
  }

  // Canvas texture badge face (Ultra sharp 1024x260 resolution)
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 260;
  const ctx = canvas.getContext('2d');

  // Background deep gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 260);
  bgGrad.addColorStop(0, '#0a0f1d');
  bgGrad.addColorStop(0.5, '#151f33');
  bgGrad.addColorStop(1, '#090d18');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 260);

  // Precision brushed micro-texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 260; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Outer border with subtle inner glow
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, 1012, 248);

  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 1000, 236);

  // 3 Jewel-Enamel Brand Identity Tiles: [S] [R] [E]
  const letters = ['S', 'R', 'E'];
  const tileStartX = 35;
  const tileY = 40;
  const tileSize = 62;
  const tileSpacing = 70;

  letters.forEach((letter, i) => {
    const tx = tileStartX + i * tileSpacing;

    const tileGrad = ctx.createLinearGradient(tx, tileY, tx + tileSize, tileY + tileSize);
    tileGrad.addColorStop(0, '#0284c7');
    tileGrad.addColorStop(0.5, '#0369a1');
    tileGrad.addColorStop(1, '#075985');
    ctx.fillStyle = tileGrad;
    ctx.beginPath();
    ctx.roundRect(tx, tileY, tileSize, tileSize, 10);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = '900 40px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 6;
    ctx.fillText(letter, tx + tileSize / 2, tileY + tileSize / 2 + 1);
    ctx.shadowBlur = 0;
  });

  // Vertical divider between SRE tiles and instrument typography
  ctx.strokeStyle = '#1e3a5f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(250, 30);
  ctx.lineTo(250, 230);
  ctx.stroke();

  // Typography Right Side
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Line 1: SREdesigns FTIR-7000x + FEATURE PILL
  ctx.font = '800 34px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('SREdesigns', 275, 70);

  ctx.fillStyle = '#38bdf8';
  ctx.fillText('FTIR-7000x', 495, 70);

  // Feature pill badge on far right of line 1
  const pillX = 730;
  const pillY = 50;
  const pillW = 245;
  const pillH = 38;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 8);
  ctx.fill();

  ctx.font = '800 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.fillText('FOURIER-TRANSFORM', pillX + pillW / 2, pillY + pillH / 2 + 1);

  // Line 2: Subtitle
  ctx.textAlign = 'left';
  ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('RESEARCH-GRADE INFRARED SPECTROMETER · DIAMOND ATR', 275, 125);

  // Line 3: Optical details
  ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('MICHELSON VOICE-COIL INTERFEROMETER · HeNe 632.8nm LASER LOCK', 275, 168);

  // Line 4: Calibration tag & serial plate
  ctx.font = '500 14px monospace';
  ctx.fillStyle = '#64748b';
  ctx.fillText('SN: FTIR-2026-X8841 | OPTICAL CALIBRATED NIST TRACEABLE', 275, 206);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const faceMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(plateW, plateH),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
  );
  faceMesh.position.z = plateD / 2 + 0.002;
  group.add(faceMesh);

  return group;
}

// ==========================================
// Tactile Push Button Factory
// ==========================================
function createLabeledKeycap(cfg) {
  const g = new THREE.Group();
  g.name = cfg.id;

  // Recessed well collar
  const collar = new THREE.Mesh(
    new THREE.BoxGeometry(0.27, 0.02, 0.15),
    MAT_CHROME
  );
  collar.position.y = 0.01;
  g.add(collar);

  // Depressible keycap group (spring depression animation target)
  const capGroup = new THREE.Group();
  capGroup.position.set(0, 0.025, 0);
  g.add(capGroup);

  // Keycap solid body (chamfered block)
  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.038, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.25 })
  );
  cap.position.y = 0.019;
  cap.castShadow = true;
  capGroup.add(cap);

  // High-resolution canvas texture for laser-etched keycap label
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 140);
  grad.addColorStop(0, '#242b36');
  grad.addColorStop(1, '#181e28');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 140);

  // Top color accent bar
  ctx.fillStyle = cfg.color || '#38bdf8';
  ctx.fillRect(6, 6, 244, 8);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Icon / symbol
  if (cfg.icon) {
    ctx.fillStyle = cfg.color || '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(cfg.icon, 128, 44);
  }

  // Main bold label
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(cfg.label, 128, cfg.icon ? 84 : 64);

  // Subtitle
  if (cfg.sub) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 15px monospace';
    ctx.fillText(cfg.sub, 128, cfg.icon ? 118 : 104);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;

  const labelGeo = new THREE.PlaneGeometry(0.23, 0.11);
  // DIAG-005 & CHK-02: Match UI_LCD mapping: flipY = false + horizontal UV inversion on buffer geometry
  const uvAttr = labelGeo.attributes.uv;
  for (let i = 0; i < uvAttr.count; i++) {
    uvAttr.setX(i, 1.0 - uvAttr.getX(i));
  }
  uvAttr.needsUpdate = true;

  const labelMesh = new THREE.Mesh(
    labelGeo,
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
  );
  labelMesh.rotation.x = -Math.PI / 2;
  labelMesh.position.set(0, 0.039, 0);
  capGroup.add(labelMesh);

  const actionData = {
    id: cfg.id,
    action: cfg.id,
    name: cfg.name,
    label: cfg.label,
    capGroup,
    role: 'PhysicalButton',
    tooltip: `${cfg.label} - ${cfg.sub || ''}`
  };
  g.userData = actionData;
  cap.userData = actionData;
  labelMesh.userData = actionData;

  return { group: g, capGroup, cap, labelMesh };
}

// ==========================================
// Genuine 3D Fasteners & Connectors
// ==========================================
export function createHexSocketScrew(radius = 0.018, length = 0.04, options = {}) {
  const g = new THREE.Group();
  const mat = options.material || MAT_CHROME;

  const headH = radius * 1.0;
  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, headH, 24),
    mat
  );
  head.position.y = headH / 2;
  head.castShadow = true;
  g.add(head);

  const recessR = radius * 0.58;
  const recess = new THREE.Mesh(
    new THREE.CylinderGeometry(recessR, recessR, headH * 0.65, 6),
    MAT_HEX_RECESS
  );
  recess.position.y = headH * 0.72;
  g.add(recess);

  const shankR = radius * 0.52;
  const shank = new THREE.Mesh(
    new THREE.CylinderGeometry(shankR, shankR, length, 16),
    mat
  );
  shank.position.y = -length / 2;
  g.add(shank);

  return g;
}

export function createVibrationFoot(dia = 0.14, height = 0.08) {
  const g = new THREE.Group();

  const pad = new THREE.Mesh(
    new THREE.CylinderGeometry(dia * 0.5, dia * 0.52, height * 0.45, 24),
    MAT_RUBBER_FEET
  );
  pad.position.y = height * 0.225;
  pad.castShadow = true;
  g.add(pad);

  const knurl = new THREE.Mesh(
    new THREE.CylinderGeometry(dia * 0.45, dia * 0.45, height * 0.35, 32),
    MAT_CHROME
  );
  knurl.position.y = height * 0.625;
  g.add(knurl);

  const stud = new THREE.Mesh(
    new THREE.CylinderGeometry(dia * 0.18, dia * 0.18, height * 0.6, 16),
    MAT_CHROME
  );
  stud.position.y = height * 0.95;
  g.add(stud);

  return g;
}

function createIECInlet() {
  const g = new THREE.Group();
  g.name = 'Connector_IEC320_C14';

  const flange = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.22, 0.02),
    MAT_CHASSIS_DARK
  );
  flange.castShadow = true;
  g.add(flange);

  const socketWell = new THREE.Mesh(
    new THREE.BoxGeometry(0.20, 0.14, 0.08),
    new THREE.MeshBasicMaterial({ color: 0x05070a })
  );
  socketWell.position.z = -0.03;
  g.add(socketWell);

  for (let i = 0; i < 3; i++) {
    const prong = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.032, 0.04),
      MAT_BRASS_FITTING
    );
    const px = (i === 0) ? -0.05 : (i === 1) ? 0.05 : 0;
    const py = (i === 2) ? 0.035 : -0.02;
    prong.position.set(px, py, -0.02);
    g.add(prong);
  }

  for (const sx of [-0.12, 0.12]) {
    const screw = createHexSocketScrew(0.008, 0.02, { material: MAT_CHROME });
    screw.rotation.x = Math.PI / 2;
    screw.position.set(sx, 0, 0.012);
    g.add(screw);
  }

  return g;
}

function createRockerSwitch({ isOn = true, onChange = null }) {
  const g = new THREE.Group();
  g.name = 'Switch_Power';

  const housing = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.26, 0.025),
    MAT_CHASSIS_DARK
  );
  g.add(housing);

  const rockerGeo = new THREE.BoxGeometry(0.12, 0.18, 0.03);
  const rockerMat = new THREE.MeshStandardMaterial({
    color: isOn ? 0xef4444 : 0x7f1d1d,
    emissive: isOn ? 0xff2222 : 0x000000,
    emissiveIntensity: isOn ? 0.8 : 0.0,
    roughness: 0.3,
  });
  const rocker = new THREE.Mesh(rockerGeo, rockerMat);
  rocker.position.z = 0.015;
  rocker.rotation.x = isOn ? -0.22 : 0.22;
  g.add(rocker);

  g.userData = {
    isOn,
    rocker,
    rockerMat,
    toggle: () => {
      g.userData.isOn = !g.userData.isOn;
      const s = g.userData.isOn;
      rocker.rotation.x = s ? -0.22 : 0.22;
      rockerMat.emissiveIntensity = s ? 0.8 : 0.0;
      rockerMat.color.setHex(s ? 0xef4444 : 0x7f1d1d);
      if (onChange) onChange(s);
    }
  };

  return g;
}

function createDB9Port() {
  const g = new THREE.Group();
  g.name = 'Port_RS232_DB9';

  const shroud = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.12, 0.02),
    MAT_CHROME
  );
  g.add(shroud);

  const dsub = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.08, 0.04),
    MAT_ALUM_ANODIZED
  );
  dsub.position.z = -0.015;
  g.add(dsub);

  for (const sx of [-0.095, 0.095]) {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.02, 6),
      MAT_BRASS_FITTING
    );
    post.rotation.x = Math.PI / 2;
    post.position.set(sx, 0, 0.01);
    g.add(post);
  }

  return g;
}

function createBNCJack() {
  const g = new THREE.Group();
  g.name = 'Jack_BNC';

  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.08, 24),
    MAT_CHROME
  );
  barrel.rotation.x = Math.PI / 2;
  g.add(barrel);

  for (const bx of [-0.05, 0.05]) {
    const bayonetPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.02, 12),
      MAT_CHROME
    );
    bayonetPin.position.set(bx, 0, 0.02);
    g.add(bayonetPin);
  }

  return g;
}

function createGroundingLug() {
  const g = new THREE.Group();
  g.name = 'Ground_Lug_Earth';

  const stud = new THREE.Mesh(
    new THREE.CylinderGeometry(0.016, 0.016, 0.06, 16),
    MAT_BRASS_FITTING
  );
  stud.rotation.x = Math.PI / 2;
  g.add(stud);

  const nut = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.025, 24),
    MAT_BRASS_FITTING
  );
  nut.rotation.x = Math.PI / 2;
  nut.position.z = 0.02;
  g.add(nut);

  return g;
}

function createSwagelokPurgeFitting() {
  const g = new THREE.Group();
  g.name = 'Fitting_Swagelok_Purge';

  const hexBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.03, 6),
    MAT_BRASS_FITTING
  );
  hexBody.rotation.x = Math.PI / 2;
  g.add(hexBody);

  const tubeNipple = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.08, 16),
    MAT_CHROME
  );
  tubeNipple.rotation.x = Math.PI / 2;
  tubeNipple.position.z = 0.04;
  g.add(tubeNipple);

  return g;
}

function createRatingPlate() {
  const g = new THREE.Group();
  g.name = 'Plate_Specification_Rating';

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, 500, 244);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px -apple-system, sans-serif';
  ctx.fillText('SREdesigns FTIR-7000x', 24, 45);

  ctx.font = 'bold 18px monospace';
  ctx.fillText('FOURIER-TRANSFORM INFRARED SPECTROMETER', 24, 80);
  ctx.fillText('INPUT: 100-240V ~ 50/60Hz 250W MAX', 24, 115);
  ctx.fillText('LASER: CLASS 2 HeNe 632.8nm < 1.0mW', 24, 150);
  ctx.fillText('COMPLIANCE: CE · UL 61010-1 · 21 CFR PART 11', 24, 185);

  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('MADE IN USA · S/N: 7000x-2026-X8841', 24, 225);

  const tex = new THREE.CanvasTexture(canvas);
  const pMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.28),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
  );
  g.add(pMesh);

  return g;
}

// ==========================================
// Genuine 3D Physical Connectors & Headers
// ==========================================

// Molded Nylon Shrouded Pin Header (Vertical PCB Mount)
function createJSTHeader(pinCount = 4, isVertical = true) {
  const g = new THREE.Group();
  const w = Math.max(0.06, pinCount * 0.024 + 0.02);
  const h = 0.042;
  const d = 0.040;

  const housing = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), MAT_NYLON_WHITE);
  housing.position.set(0, h / 2, 0);
  housing.castShadow = true;
  g.add(housing);

  const pocket = new THREE.Mesh(new THREE.BoxGeometry(w - 0.008, h - 0.008, d - 0.010), MAT_CHASSIS_DARK);
  pocket.position.set(0, h / 2 + 0.004, 0);
  g.add(pocket);

  const pinPitch = (w - 0.024) / Math.max(1, pinCount - 1);
  for (let i = 0; i < pinCount; i++) {
    const px = -(w - 0.024) / 2 + (i * pinPitch);
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.034, 0.004), MAT_GOLD_PIN);
    pin.position.set(px, h / 2, 0);
    g.add(pin);
  }

  const tab = new THREE.Mesh(new THREE.BoxGeometry(w * 0.45, 0.012, 0.008), MAT_NYLON_WHITE);
  tab.position.set(0, h * 0.75, d / 2 + 0.003);
  g.add(tab);

  return g;
}

// Mating JST/Molex Cable Plug (Male Housing with Latch Clip, inserted into Header)
function createJSTMatingPlug(pinCount = 4) {
  const g = new THREE.Group();
  const w = Math.max(0.056, pinCount * 0.024 + 0.016);
  const h = 0.038;
  const d = 0.036;

  const plug = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), MAT_NYLON_WHITE);
  plug.position.set(0, h / 2, 0);
  plug.castShadow = true;
  g.add(plug);

  const latch = new THREE.Mesh(new THREE.BoxGeometry(w * 0.35, 0.008, d * 0.65), MAT_NYLON_WHITE);
  latch.position.set(0, h + 0.004, 0);
  g.add(latch);

  const pinPitch = (w - 0.024) / Math.max(1, pinCount - 1);
  for (let i = 0; i < pinCount; i++) {
    const px = -(w - 0.024) / 2 + (i * pinPitch);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.012, 8), MAT_NYLON_WHITE);
    collar.position.set(px, h / 2, -d / 2 - 0.005);
    collar.rotation.x = Math.PI / 2;
    g.add(collar);
  }

  return g;
}

// Screw Terminal Barrier Block with Clamping Washers (SMPS Power Supply Interface)
function createBarrierTerminalBlock(numPositions = 6) {
  const g = new THREE.Group();
  const pitch = 0.042;
  const totalW = numPositions * pitch + 0.04;
  const h = 0.045;
  const d = 0.085;

  const base = new THREE.Mesh(new THREE.BoxGeometry(totalW, h, d), MAT_CHASSIS_DARK);
  base.position.set(0, h / 2, 0);
  base.castShadow = true;
  g.add(base);

  for (let i = 0; i <= numPositions; i++) {
    const fx = -totalW / 2 + 0.02 + (i * pitch);
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.025, d * 0.9), MAT_CHASSIS_DARK);
    fin.position.set(fx, h + 0.012, 0);
    g.add(fin);
  }

  for (let i = 0; i < numPositions; i++) {
    const sx = -totalW / 2 + 0.02 + (i * pitch) + (pitch / 2);
    const washer = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.004, 0.024), MAT_BRASS_FITTING);
    washer.position.set(sx, h + 0.002, 0);
    g.add(washer);

    const screwHead = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.008, 16), MAT_BRASS_FITTING);
    screwHead.position.set(sx, h + 0.008, 0);
    g.add(screwHead);

    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.004, 0.020), MAT_HEX_RECESS);
    slot.position.set(sx, h + 0.011, 0);
    g.add(slot);
  }

  const guard = new THREE.Mesh(
    new THREE.BoxGeometry(totalW - 0.01, 0.005, d * 0.8),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, roughness: 0.1 })
  );
  guard.position.set(0, h + 0.028, 0);
  g.add(guard);

  return g;
}

// Spade Crimp Terminal (for barrier strip screw clamps)
function createSpadeCrimpTerminal(matInsulation = MAT_CRIMP_BLUE) {
  const g = new THREE.Group();
  const fork = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.003, 0.025), MAT_BRASS_FITTING);
  fork.position.set(0, 0, 0.012);
  g.add(fork);
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.025, 12), matInsulation);
  sleeve.rotation.x = Math.PI / 2;
  sleeve.position.set(0, 0, -0.012);
  g.add(sleeve);
  return g;
}

// FASTON Quick-Disconnect Spade Terminal (for IEC C14 and Rocker switch)
function createFastonDisconnect(matInsulation = MAT_CRIMP_BLUE) {
  const g = new THREE.Group();
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.012, 0.034), MAT_BRASS_FITTING);
  clip.position.set(0, 0, 0.017);
  g.add(clip);
  const boot = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.016, 0.040), matInsulation);
  boot.position.set(0, 0, 0.015);
  g.add(boot);
  return g;
}

// Low-Profile Surface Mount FPC/FFC ZIF Socket (Flip-Lock Actuator)
function createFPCZIFConnector(width = 0.18) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 0.016, 0.045), MAT_NYLON_WHITE);
  body.position.set(0, 0.008, 0);
  g.add(body);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(width - 0.012, 0.012, 0.018), MAT_CHASSIS_DARK);
  arm.position.set(0, 0.015, -0.012);
  g.add(arm);

  for (const sign of [-1, 1]) {
    const tab = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.004, 0.030), MAT_GOLD_PIN);
    tab.position.set(sign * (width / 2 + 0.004), 0.002, 0);
    g.add(tab);
  }
  return g;
}

// Gold-Plated Precision Female SMA Bulkhead Coaxial Receptacle
function createSMAJackFemale() {
  const g = new THREE.Group();
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.045, 16), MAT_BRASS_FITTING);
  barrel.rotation.z = Math.PI / 2;
  g.add(barrel);
  const ptfe = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.046, 16), MAT_CERAMIC_WHITE);
  ptfe.rotation.z = Math.PI / 2;
  g.add(ptfe);
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.048, 8), MAT_GOLD_PIN);
  pin.rotation.z = Math.PI / 2;
  g.add(pin);
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.012, 6), MAT_BRASS_FITTING);
  nut.rotation.z = Math.PI / 2;
  nut.position.x = -0.015;
  g.add(nut);
  return g;
}

// Gold-Plated Precision Male SMA Plug (with Knurled Hex Nut & Coax Ferrule)
function createSMAPlugMale() {
  const g = new THREE.Group();
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.028, 6), MAT_BRASS_FITTING);
  nut.rotation.z = Math.PI / 2;
  g.add(nut);
  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.035, 12), MAT_CHASSIS_DARK);
  ferrule.rotation.z = Math.PI / 2;
  ferrule.position.x = 0.030;
  g.add(ferrule);
  return g;
}

// Dual-Row Shrouded IDC Box Header
function createIDCBoxHeader(pinCount = 10) {
  const g = new THREE.Group();
  const w = 0.05;
  const d = Math.max(0.08, (pinCount / 2) * 0.022 + 0.02);
  const h = 0.040;

  const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), MAT_CHASSIS_DARK);
  box.position.set(0, h / 2, 0);
  box.castShadow = true;
  g.add(box);

  const notch = new THREE.Mesh(new THREE.BoxGeometry(0.012, h * 0.7, 0.016), MAT_HEX_RECESS);
  notch.position.set(-w / 2 + 0.006, h * 0.65, 0);
  g.add(notch);

  const numPairs = Math.floor(pinCount / 2);
  const pinPitch = (d - 0.024) / Math.max(1, numPairs - 1);
  for (let r = 0; r < 2; r++) {
    const px = (r === 0) ? -0.010 : 0.010;
    for (let i = 0; i < numPairs; i++) {
      const pz = -(d - 0.024) / 2 + i * pinPitch;
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.030, 0.003), MAT_GOLD_PIN);
      pin.position.set(px, h / 2, pz);
      g.add(pin);
    }
  }

  return g;
}

// Molded Red Silicone Alden High-Voltage Anode Connector Boot
function createAldenHVConnector() {
  const g = new THREE.Group();
  g.name = 'Connector_Alden_HighVoltage';

  const boot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.022, 0.065, 16),
    new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5, metalness: 0.1 })
  );
  boot.rotation.x = Math.PI / 2;
  g.add(boot);

  const tail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.010, 0.018, 0.035, 16),
    new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 })
  );
  tail.rotation.x = Math.PI / 2;
  tail.position.z = -0.045;
  g.add(tail);

  const pin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.004, 0.004, 0.025, 12),
    MAT_BRASS_FITTING
  );
  pin.rotation.x = Math.PI / 2;
  pin.position.z = 0.025;
  g.add(pin);

  return g;
}

// Dedicated 50mm DC Brushless Cooling Fan for SMPS Power Supply
function createSMPSFan() {
  const g = new THREE.Group();
  g.name = 'Fan_SMPS_Cooling';

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.18, 0.035),
    MAT_CHASSIS_DARK
  );
  g.add(frame);

  const orifice = new THREE.Mesh(
    new THREE.CylinderGeometry(0.076, 0.076, 0.038, 24),
    MAT_CHASSIS_DARK
  );
  orifice.rotation.x = Math.PI / 2;
  g.add(orifice);

  for (const sx of [-0.072, 0.072]) {
    for (const sy of [-0.072, 0.072]) {
      const screw = createHexSocketScrew(0.008, 0.018, { material: MAT_CHROME });
      screw.position.set(sx, sy, 0.018);
      g.add(screw);
    }
  }

  for (const r of [0.028, 0.052, 0.074]) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.002, 6, 24),
      MAT_CHROME
    );
    ring.position.z = 0.020;
    g.add(ring);
  }
  for (let a = 0; a < 4; a++) {
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.003, 0.15, 0.003),
      MAT_CHROME
    );
    spoke.rotation.z = (a * Math.PI) / 4;
    spoke.position.z = 0.020;
    g.add(spoke);
  }

  const hubGroup = new THREE.Group();
  hubGroup.name = 'Rotor_SMPS_Fan';
  hubGroup.position.z = 0.005;

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, 0.024, 16),
    MAT_CHASSIS_DARK
  );
  hub.rotation.x = Math.PI / 2;
  hubGroup.add(hub);

  const hubNose = new THREE.Mesh(
    new THREE.SphereGeometry(0.026, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    MAT_CHASSIS_DARK
  );
  hubNose.rotation.x = -Math.PI / 2;
  hubNose.position.z = 0.012;
  hubGroup.add(hubNose);

  for (let b = 0; b < 7; b++) {
    const bladeAngle = (b * 2 * Math.PI) / 7;
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.004, 0.048, 0.014),
      MAT_CHASSIS_DARK
    );
    blade.position.set(Math.cos(bladeAngle) * 0.048, Math.sin(bladeAngle) * 0.048, 0);
    blade.rotation.z = bladeAngle + 0.45;
    hubGroup.add(blade);
  }

  g.add(hubGroup);
  g.userData.fanHub = hubGroup;

  const pwrLead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.004, 0.004, 0.08, 8),
    new THREE.MeshStandardMaterial({ color: 0xdc2626 })
  );
  pwrLead.position.set(0.06, -0.09, -0.01);
  g.add(pwrLead);

  return g;
}

// Procedural Multi-Layer FR-4 PCB Solder Mask & Silk Canvas Texture for FTIR DSP Controller
function createFTIRMotherboardCanvasTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#063a18';
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.strokeStyle = '#094e22';
  ctx.lineWidth = 1;
  for (let i = 0; i < 1024; i += 8) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  ctx.strokeStyle = '#c59b27';
  ctx.lineWidth = 2.5;
  for (let b = 0; b < 10; b++) {
    const yOff = 340 + (b * 12);
    ctx.beginPath();
    ctx.moveTo(310, yOff);
    ctx.lineTo(360, yOff);
    ctx.lineTo(375, yOff - 5);
    ctx.lineTo(395, yOff + 5);
    ctx.lineTo(415, yOff - 5);
    ctx.lineTo(435, yOff + 5);
    ctx.lineTo(450, yOff);
    ctx.lineTo(540, yOff);
    ctx.stroke();
  }

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(680, 680);
  ctx.lineTo(760, 680);
  ctx.lineTo(820, 740);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(680, 694);
  ctx.lineTo(755, 694);
  ctx.lineTo(815, 754);
  ctx.stroke();

  for (let vx = 40; vx < 980; vx += 36) {
    for (let vy = 40; vy < 980; vy += 36) {
      if ((vx + vy) % 72 === 0) {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(vx + ((vy * 13) % 17), vy + ((vx * 7) % 13), 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#041c09';
        ctx.beginPath();
        ctx.arc(vx + ((vy * 13) % 17), vy + ((vx * 7) % 13), 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  ctx.font = 'bold 22px monospace';
  ctx.fillText('SREdesigns FTIR-7000x DSP CONTROLLER', 60, 60);
  ctx.font = '14px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('REV 4.1 · ASSY 7000-MAIN-001 · 32-BIT FLOATING POINT · RoHS', 60, 85);
  ctx.fillText('FOURIER-TRANSFORM INFRARED INTERFEROMETER ENGINE', 60, 105);

  function drawSilkBox(x, y, w, h, label, id) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 15px monospace';
    ctx.fillText(id, x + 6, y - 6);
    if (label) {
      ctx.font = '12px monospace';
      ctx.fillText(label, x + 16, y + h / 2 + 4);
    }
  }

  drawSilkBox(220, 240, 180, 180, 'TI TMS320C6748 DSP', 'U1');
  drawSilkBox(460, 260, 150, 120, 'DDR3 SDRAM 4Gb', 'U2');
  drawSilkBox(460, 420, 120, 90, 'SPI FLASH 128M', 'U3');
  drawSilkBox(640, 620, 130, 90, 'AD7799 24-BIT ADC', 'U4');
  drawSilkBox(120, 460, 110, 80, 'H-BRIDGE: V-COIL', 'U5');
  drawSilkBox(120, 580, 110, 80, 'HeNe HV BALLAST', 'U6');

  function drawSilkHeader(x, y, w, h, name, pins) {
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(name, x, y - 5);
    ctx.fillText('[' + pins + 'P]', x + w - 32, y - 5);
  }

  drawSilkHeader(60, 140, 120, 40, 'J1: 24V_DC_IN', 4);
  drawSilkHeader(200, 140, 80, 35, 'J2: 12V_FAN', 3);
  drawSilkHeader(300, 140, 110, 40, 'J3: RS232_COM', 10);
  drawSilkHeader(430, 140, 90, 35, 'J4: USB_HOST', 5);
  drawSilkHeader(540, 140, 80, 35, 'J5: RJ45_ETH', 8);
  drawSilkHeader(640, 140, 180, 35, 'J6: FPC_LCD_30P', 30);
  drawSilkHeader(840, 140, 90, 35, 'J7: DTGS_SMA', 2);

  for (const [hx, hy] of [[50, 50], [974, 50], [50, 974], [974, 974]]) {
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(hx, hy, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#041c09';
    ctx.beginPath();
    ctx.arc(hx, hy, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// High-Fidelity Switch-Mode Power Supply (SMPS) Assembly
function createSMPSAssembly() {
  const g = new THREE.Group();
  g.name = 'Subsystem_PowerSupply_SMPS';

  const w = 0.92;
  const h = 0.28;
  const d = 0.72;

  // Base tray & 4 perimeter walls (open cutaway top so internal toroid, caps & heatsink are 100% visible)
  const floor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.015, d), MAT_ALUM_BREADBOARD);
  floor.position.set(0, 0.008, 0);
  g.add(floor);

  const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.016, h, d), MAT_ALUM_ANODIZED);
  wallL.position.set(-w / 2 + 0.008, h / 2, 0);
  g.add(wallL);

  const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.016, h, d), MAT_ALUM_ANODIZED);
  wallR.position.set(w / 2 - 0.008, h / 2, 0);
  g.add(wallR);

  const wallBack = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.016), MAT_ALUM_ANODIZED);
  wallBack.position.set(0, h / 2, d / 2 - 0.008);
  g.add(wallBack);

  const wallFront = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.65, 0.016), MAT_ALUM_ANODIZED);
  wallFront.position.set(0, (h * 0.65) / 2, -d / 2 + 0.008);
  g.add(wallFront);

  // Internal green FR-4 power supply board
  const smpsPCB = new THREE.Mesh(new THREE.BoxGeometry(w - 0.04, 0.012, d - 0.04), MAT_PCB_GREEN);
  smpsPCB.position.set(0, 0.022, 0);
  g.add(smpsPCB);

  // Cutaway top protective grill bars (allows unobstructed view of internal components)
  for (let gz = -0.26; gz <= 0.28; gz += 0.09) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(w - 0.02, 0.008, 0.018), MAT_CHASSIS_DARK);
    bar.position.set(0, h - 0.004, gz);
    g.add(bar);
  }

  // 4 corner mounting feet with M3 hex cap screws bolting SMPS to baseplate
  for (const sx of [-0.42, 0.42]) {
    for (const sz of [-0.32, 0.32]) {
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.06), MAT_ALUM_ANODIZED);
      foot.position.set(sx, 0.008, sz);
      g.add(foot);

      const screw = createHexSocketScrew(0.010, 0.020, { material: MAT_CHROME });
      screw.position.set(sx, 0.016, sz);
      g.add(screw);
    }
  }

  // Toroidal transformer with heavy copper magnet wire windings
  const toroid = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.048, 16, 32),
    MAT_COPPER_WIRE
  );
  toroid.name = 'Transformer_SMPS_Toroid';
  toroid.position.set(-0.20, 0.12, 0.06);
  toroid.rotation.x = Math.PI / 2;
  g.add(toroid);

  // Inner ceramic core of toroid
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.08, 24),
    MAT_CERAMIC_WHITE
  );
  core.position.set(-0.20, 0.12, 0.06);
  g.add(core);

  // Dual primary 450V electrolytic filter capacitors with aluminum scored vent tops
  for (let c = 0; c < 2; c++) {
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.20, 20),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.35, metalness: 0.2 })
    );
    cap.position.set(0.22, 0.12, -0.10 + c * 0.22);
    g.add(cap);

    const vent = new THREE.Mesh(
      new THREE.CylinderGeometry(0.062, 0.062, 0.006, 20),
      MAT_CHROME
    );
    vent.position.set(0.22, 0.224, -0.10 + c * 0.22);
    g.add(vent);
  }

  // Extruded comb aluminum heatsink with dual TO-220 MOSFETs
  const heatSink = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.18, 0.26),
    MAT_CHROME
  );
  heatSink.position.set(0.02, 0.11, 0.05);
  g.add(heatSink);
  for (let f = -0.10; f <= 0.10; f += 0.04) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.17, 0.008), MAT_CHROME);
    fin.position.set(0.05, 0.11, 0.05 + f);
    g.add(fin);
  }

  // Dedicated 50mm DC brushless cooling fan on outer (-X) side of SMPS cage
  const smpsFan = createSMPSFan();
  smpsFan.position.set(-w / 2 - 0.018, 0.14, 0.0);
  smpsFan.rotation.y = -Math.PI / 2;
  g.add(smpsFan);
  g.userData.smpsFanHub = smpsFan.userData.fanHub;

  // Molded silicone exhaust duct boot sealing 50mm fan to outer right chassis wall louvers
  const smpsDuct = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.17, 0.17),
    new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.85, metalness: 0.1 })
  );
  smpsDuct.name = 'Duct_SMPS_Exhaust';
  smpsDuct.position.set(-w / 2 - 0.29, 0.14, 0.0);
  g.add(smpsDuct);

  // 6-Position Barrier Terminal Block on front face (Z = -0.38, facing -Z toward Motherboard)
  const barrier = createBarrierTerminalBlock(6);
  barrier.name = 'TerminalBlock_SMPS_Mains';
  barrier.position.set(0.08, 0.18, -d / 2 - 0.02);
  g.add(barrier);

  return g;
}


// ==========================================
// Primary FTIR3D Digital Twin Class
// ==========================================
export class FTIR3D {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;

    // Hard Circuit Continuity State
    this.isPluggedIn = true;
    this.switchOn = true;
    this.hasPower = true;

    // Optical & Acquisition State
    this.isScanning = false;
    this.scanProgress = 0.0;
    this.activeSampleId = 'isopropanol';
    this.viewMode = 'transmittance'; // 'transmittance' or 'absorbance'
    this.towerAngle = 0.0; // 0 = clamped on diamond, Math.PI / 2 = swiveled open
    this.clampForceNewtons = 35.0; // Slip-clutch clamp pressure
    this.explodedOffset = 0.0;
    this.xRayMode = false;
    this.opticsViewActive = false;
    this.towerSwiveled = false;
    this.clampPressurePct = 80;

    // Actionable click targets & animation targets
    this.actionableMeshes = [];
    this.chassisMeshes = [];
    this.opticsRoof = null;
    this.interiorLight = null;
    this.animTargets = { keycaps: {}, lcdMesh: null };
    this.touchRipples = [];
    this.keycapAnims = [];
    this.cursorWn = 3350;

    // Active electro-mechanical animation & indicator references
    this.fanBlades = null;
    this.smpsFanHub = null;
    this.ledPwr = null;
    this.ledAct = null;

    const width = this.container ? this.container.clientWidth : window.innerWidth;
    const height = this.container ? this.container.clientHeight : window.innerHeight;

    // 1. Three.js Scene
    this.scene = new THREE.Scene();

    // 2. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(42, (width || 1200) / (height || 800), 0.1, 50);
    this.camera.position.set(5.6, 4.2, -7.2);
    this.camera.lookAt(0.0, 1.15, -0.2);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width || 1200, height || 800);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    if (this.container) {
      this.container.appendChild(this.renderer.domElement);
    }

    // 4. Lighting
    this.setupLighting();

    // 5. Digital Twin Assemblies & Bench
    this.initScene();
    this.buildLabBench();
    this.buildInstrumentAssembly();
    this.updatePowerState();

    // 6. Resize listener
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // 7. Start Render Loop
    this.animate();
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.05);
    this.scene.add(this.ambientLight);

    // Key Light (studio top-right front)
    this.keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    this.keyLight.position.set(-4.5, 7.5, -5.5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 25;
    this.keyLight.shadow.bias = -0.0002;
    this.scene.add(this.keyLight);

    // Fill Light (cool blue diffuse from rear left)
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.4);
    fillLight.position.set(5.5, 5.0, 4.5);
    this.scene.add(fillLight);

    // Rim Light (crisp white highlight)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(0.0, 6.0, 5.5);
    this.scene.add(rimLight);

    // Dedicated Interior Inspection Light (illuminates internal bays in Optics View & Exploded View)
    this.interiorLight = new THREE.PointLight(0xf8fafc, 2.8, 9.0);
    this.interiorLight.position.set(-0.2, 1.75, 0.1);
    this.interiorLight.visible = false;
    this.scene.add(this.interiorLight);
  }

  buildLabBench() {
    this.benchGroup = new THREE.Group();
    this.benchGroup.name = 'INSTRUMENT_BENCH';

    // 360-degree chemical-resistant black epoxy island bench at Y = 0 (top surface at datum Y = 0)
    const benchGeo = new THREE.BoxGeometry(14.0, 0.3, 12.0);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x11161d,
      roughness: 0.35,
      metalness: 0.15,
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(0, -0.15, 0.4);
    bench.receiveShadow = true;
    this.benchGroup.add(bench);

    this.scene.add(this.benchGroup);
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  initScene() {
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'FTIR_7000x_Spectrometer';
    this.scene.add(this.rootGroup);

    // Functional sub-assemblies
    this.chassisBaseGroup = new THREE.Group();
    this.chassisBaseGroup.name = 'Assembly_ChassisBase';

    this.chassisShellGroup = new THREE.Group();
    this.chassisShellGroup.name = 'Assembly_ChassisShell_Exploded';

    this.interferometerGroup = new THREE.Group();
    this.interferometerGroup.name = 'Subsystem_Michelson_Interferometer';

    this.atrTransferGroup = new THREE.Group();
    this.atrTransferGroup.name = 'Assembly_ATR_TransferOptics';

    this.atrStationGroup = new THREE.Group();
    this.atrStationGroup.name = 'Subsystem_Diamond_ATR_Station';

    this.electronicsGroup = new THREE.Group();
    this.electronicsGroup.name = 'Subsystem_Electronics_Bay';

    this.wiringGroup = new THREE.Group();
    this.wiringGroup.name = 'Subsystem_Wiring_Harnesses';

    this.raysGroup = new THREE.Group();
    this.raysGroup.name = 'Subsystem_Optical_Rays';

    this.consoleGroup = new THREE.Group();
    this.consoleGroup.name = 'Assembly_SlopedConsole';

    this.cordGroup = new THREE.Group();
    this.cordGroup.name = 'Assembly_PowerContinuity';

    // Dynamic Canvas for 7-inch LCD Display Quad (UI_LCD)
    this.lcdCanvas = document.createElement('canvas');
    this.lcdCanvas.width = 1024;
    this.lcdCanvas.height = 600;
    this.lcdCtx = this.lcdCanvas.getContext('2d');
  }

  buildInstrumentAssembly() {
    this.buildPowerContinuityAndCord();
    this.buildHollowChassisAndFrame();
    this.buildDiamondATRStation();
    this.buildMichelsonInterferometer();
    this.buildElectronicsAndFans();
    this.buildInternalWiringHarnesses();
    this.buildSlopedConsoleAndLCD();
    this.buildOpticalRayPaths();

    this.renderLCD();
  }

  // ==========================================
  // Benchtop AC Service Pedestal & Power Cord
  // (Mounted on rear bench border BEHIND instrument at Z = +3.35)
  // ==========================================
  buildPowerContinuityAndCord() {
    // Cast aluminum benchtop duplex AC service pedestal
    // Located directly behind the instrument IEC inlet at X = -1.40, Z = +3.35
    const pedestalGroup = new THREE.Group();
    pedestalGroup.name = 'Assembly_PowerPedestal';
    pedestalGroup.position.set(-1.40, 0, 3.35);

    // Cast aluminum dual-gang tombstone housing
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.40, 0.22),
      MAT_ALUM_ANODIZED
    );
    box.position.set(0, 0.20, 0);
    box.castShadow = true;
    pedestalGroup.add(box);

    // Bench mounting base flange with 4 M5 anchor bolts
    const flange = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.02, 0.28),
      MAT_ALUM_ANODIZED
    );
    flange.position.set(0, 0.01, 0);
    pedestalGroup.add(flange);

    for (const bx of [-0.17, 0.17]) {
      for (const bz of [-0.10, 0.10]) {
        const bolt = createHexSocketScrew(0.012, 0.03, { material: MAT_CHROME });
        bolt.position.set(bx, 0.02, bz);
        pedestalGroup.add(bolt);
      }
    }

    // Specification grade duplex receptacle faceplate (faces -Z toward machine)
    const faceplate = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.32, 0.014),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35, metalness: 0.15 })
    );
    faceplate.position.set(0, 0.20, -0.115);
    pedestalGroup.add(faceplate);

    // Upper socket well (receives machine power plug)
    const upperWell = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.11, 0.016),
      MAT_CHASSIS_DARK
    );
    upperWell.position.set(0, 0.24, -0.118);
    pedestalGroup.add(upperWell);

    // Lower spare socket well
    const lowerWell = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.11, 0.016),
      MAT_CHASSIS_DARK
    );
    lowerWell.position.set(0, 0.12, -0.118);
    pedestalGroup.add(lowerWell);

    // Lower socket slots & ground pin
    const slotGeo = new THREE.BoxGeometry(0.008, 0.034, 0.012);
    const slotMat = new THREE.MeshBasicMaterial({ color: 0x05070a });

    const hotSlot = new THREE.Mesh(slotGeo, slotMat);
    hotSlot.position.set(0.035, 0.12, -0.125);
    pedestalGroup.add(hotSlot);

    const neutralSlot = new THREE.Mesh(slotGeo, slotMat);
    neutralSlot.position.set(-0.035, 0.12, -0.125);
    pedestalGroup.add(neutralSlot);

    const groundHole = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.012, 12), slotMat);
    groundHole.rotation.x = Math.PI / 2;
    groundHole.position.set(0, 0.085, -0.125);
    pedestalGroup.add(groundHole);

    // Green ground dot
    const groundDot = new THREE.Mesh(
      new THREE.CircleGeometry(0.008, 12),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    groundDot.position.set(0.07, 0.29, -0.123);
    pedestalGroup.add(groundDot);

    this.cordGroup.add(pedestalGroup);

    // Molded NEMA 5-15P plug inserted in upper socket
    this.plugGroup = new THREE.Group();
    this.plugGroup.name = 'Plug_NEMA_5_15P';
    this.plugGroup.position.set(-1.40, 0.24, 3.23);

    const plugBodyGeo = new THREE.BoxGeometry(0.14, 0.16, 0.18);
    const plugBodyMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.8 });
    const plugBody = new THREE.Mesh(plugBodyGeo, plugBodyMat);
    plugBody.position.set(0, 0, -0.09);
    plugBody.castShadow = true;
    this.plugGroup.add(plugBody);

    // Brass prongs extending +Z into socket
    const prongGeo = new THREE.BoxGeometry(0.012, 0.05, 0.055);
    const prongMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const prong1 = new THREE.Mesh(prongGeo, prongMat);
    prong1.position.set(-0.035, 0, 0.025);
    this.plugGroup.add(prong1);

    const prong2 = new THREE.Mesh(prongGeo, prongMat);
    prong2.position.set(0.035, 0, 0.025);
    this.plugGroup.add(prong2);

    const prongGnd = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.06, 12), prongMat);
    prongGnd.rotation.x = Math.PI / 2;
    prongGnd.position.set(0, -0.035, 0.025);
    this.plugGroup.add(prongGnd);

    plugBody.userData = { name: 'Assembly_PowerCord_Plug', action: 'toggle_plug', tooltip: 'Click to pull/insert 120V power cord' };
    this.actionableMeshes.push(plugBody);
    this.cordGroup.add(this.plugGroup);

    this.updatePowerCordCurve();
    this.rootGroup.add(this.cordGroup);
  }

  updatePowerCordCurve() {
    if (this.powerCordMesh) {
      this.cordGroup.remove(this.powerCordMesh);
      this.powerCordMesh.geometry.dispose();
    }

    const plugPos = this.isPluggedIn
      ? new THREE.Vector3(-1.40, 0.24, 3.12)
      : new THREE.Vector3(-1.40, 0.05, 2.90);
    const inletPos = new THREE.Vector3(-1.40, 0.45, 2.385);
    const mid1 = new THREE.Vector3(-1.40, 0.05, 2.65);
    const mid2 = new THREE.Vector3(-1.40, 0.04, 2.92);

    const curve = new THREE.CatmullRomCurve3([inletPos, mid1, mid2, plugPos]);
    const cordGeo = new THREE.TubeGeometry(curve, 36, 0.020, 12, false);
    this.powerCordMesh = new THREE.Mesh(cordGeo, MAT_CABLE_PVC);
    this.powerCordMesh.castShadow = true;
    this.cordGroup.add(this.powerCordMesh);

    if (this.plugGroup) {
      this.plugGroup.position.set(-1.40, this.isPluggedIn ? 0.24 : 0.05, this.isPluggedIn ? 3.23 : 2.90);
      this.plugGroup.rotation.x = this.isPluggedIn ? 0 : 0.35;
    }
  }

  // ==========================================
  // Enclosure Housing & Structural Frame
  // (Zero Nonsensical External Walls, Stepped Silhouette, Solid Console Wedge)
  // ==========================================
  buildHollowChassisAndFrame() {
    const BASE_Y = 0.08;

    // 1. Threaded leveling feet resting on datum plane Y = 0
    const footOffsets = [
      [-1.95, 0.0, -2.15], [1.95, 0.0, -2.15],
      [-1.95, 0.0, 2.15], [1.95, 0.0, 2.15]
    ];
    footOffsets.forEach(([fx, fy, fz], idx) => {
      const foot = createVibrationFoot(0.13, 0.08);
      foot.name = `Foot_Leveling_${idx + 1}`;
      foot.position.set(fx, fy, fz);
      this.chassisBaseGroup.add(foot);
    });

    // 2. Heavy Die-Cast Aluminum Base Pan (Dark outer skirt + high-contrast machined aluminum deck)
    const baseSkirtGeo = new THREE.BoxGeometry(4.36, 0.14, 4.76);
    const baseSkirt = new THREE.Mesh(baseSkirtGeo, MAT_CHASSIS_DARK);
    baseSkirt.name = 'Baseplate_OuterSkirt';
    baseSkirt.position.set(0, BASE_Y + 0.07, 0);
    baseSkirt.receiveShadow = true;
    baseSkirt.castShadow = true;
    this.chassisBaseGroup.add(baseSkirt);

    const baseDeckMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.36,
      metalness: 0.72,
    });
    const baseDeckGeo = new THREE.BoxGeometry(4.28, 0.025, 4.68);
    const baseDeck = new THREE.Mesh(baseDeckGeo, baseDeckMat);
    baseDeck.name = 'Baseplate_MachinedDeck';
    baseDeck.position.set(0, BASE_Y + 0.148, 0);
    baseDeck.receiveShadow = true;
    this.chassisBaseGroup.add(baseDeck);

    // --- REAR BULKHEAD I/O SUB-PANEL ANCHORED TO BASEPLATE (Z = +2.36) ---
    // Keeps AC Mains & Data ports physically mated to internal harnesses during Exploded View!
    const ioBulkhead = new THREE.Mesh(
      new THREE.BoxGeometry(3.50, 0.42, 0.03),
      MAT_CHASSIS_DARK
    );
    ioBulkhead.name = 'Bracket_Rear_Bulkhead';
    ioBulkhead.position.set(0, BASE_Y + 0.37, 2.365);
    this.chassisBaseGroup.add(ioBulkhead);

    // IEC-320 C14 AC inlet socket
    const iecInlet = createIECInlet();
    iecInlet.position.set(-1.40, 0.45, 2.385);
    this.chassisBaseGroup.add(iecInlet);

    // Illuminated Rocker Power Switch
    this.rockerSwitch = createRockerSwitch({
      isOn: true,
      onChange: (state) => this.setPowerSwitch(state),
    });
    this.rockerSwitch.position.set(-0.90, 0.45, 2.385);
    this.rockerSwitch.userData = { name: 'Switch_Power', action: 'toggle_switch', tooltip: 'Rear AC Power Switch (I/O)' };
    this.actionableMeshes.push(this.rockerSwitch);
    this.chassisBaseGroup.add(this.rockerSwitch);

    // 1/4" Swagelok Dry N2 Purge Port
    const swagelok = createSwagelokPurgeFitting();
    swagelok.position.set(1.40, 0.45, 2.385);
    this.chassisBaseGroup.add(swagelok);

    // Gold-Plated Chassis Grounding Binding Post
    const groundLug = createGroundingLug();
    groundLug.position.set(1.05, 0.45, 2.385);
    this.chassisBaseGroup.add(groundLug);

    // DB-9 RS-232 Serial Telemetry Port
    const db9 = createDB9Port();
    db9.position.set(0.40, 0.45, 2.385);
    this.chassisBaseGroup.add(db9);

    // Shielded USB-B 2.0 Instrument Control Port
    const usbB = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.11, 0.02), MAT_CHROME);
    usbB.name = 'Port_USB_B';
    usbB.position.set(0.00, 0.45, 2.385);
    this.chassisBaseGroup.add(usbB);

    // Shielded RJ45 Gigabit Ethernet Port
    const rj45 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.13, 0.02), MAT_CHASSIS_DARK);
    rj45.name = 'Port_RJ45_Ethernet';
    rj45.position.set(-0.35, 0.45, 2.385);
    this.chassisBaseGroup.add(rj45);

    this.rootGroup.add(this.chassisBaseGroup);

    // 3. Removable Unibody Shroud (Elevates smoothly along +Y in Exploded View)
    this.chassisShellGroup.position.set(0, 0, 0);

    // --- REAR OPTICS & ELECTRONICS ENCLOSURE (Z in [0, 2.38]) ---
    // Rear wall at Z = +2.38
    const rearWall = new THREE.Mesh(
      new THREE.BoxGeometry(4.36, 1.80, 0.04),
      MAT_CHASSIS
    );
    rearWall.name = 'Body_Chassis_RearWall';
    rearWall.position.set(0, BASE_Y + 0.16 + 0.90, 2.38 - 0.02);
    rearWall.castShadow = true;
    rearWall.receiveShadow = true;
    this.chassisShellGroup.add(rearWall);
    this.chassisMeshes.push(rearWall);

    // Rear Left Wall (X = +2.18, Z in [0, 2.38])
    const rearLeftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.80, 2.38),
      MAT_CHASSIS
    );
    rearLeftWall.name = 'Body_Chassis_RearLeftWall';
    rearLeftWall.position.set(2.18 - 0.02, BASE_Y + 0.16 + 0.90, 1.19);
    rearLeftWall.castShadow = true;
    rearLeftWall.receiveShadow = true;
    this.chassisShellGroup.add(rearLeftWall);
    this.chassisMeshes.push(rearLeftWall);

    // Rear Right Wall (X = -2.18, Z in [0, 2.38])
    const rearRightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.80, 2.38),
      MAT_CHASSIS
    );
    rearRightWall.name = 'Body_Chassis_RearRightWall';
    rearRightWall.position.set(-2.18 + 0.02, BASE_Y + 0.16 + 0.90, 1.19);
    rearRightWall.castShadow = true;
    rearRightWall.receiveShadow = true;
    this.chassisShellGroup.add(rearRightWall);
    this.chassisMeshes.push(rearRightWall);

    // Stamped Side Exhaust Louvers on Right Wall (X = -2.18, Z = +0.70) for 50mm SMPS Fan Duct
    for (let sl = 0; sl < 5; sl++) {
      const sideLouver = new THREE.Mesh(
        new THREE.BoxGeometry(0.015, 0.018, 0.24),
        MAT_CHASSIS_DARK
      );
      sideLouver.position.set(-2.183, BASE_Y + 0.28 + sl * 0.04, 0.70);
      sideLouver.rotation.z = -0.35;
      this.chassisShellGroup.add(sideLouver);
    }

    // Optics Bay Roof Deck (Z in [0, 2.38], Y = BASE_Y + 0.16 + 1.80)
    const opticsRoof = new THREE.Mesh(
      new THREE.BoxGeometry(4.36, 0.04, 2.38),
      MAT_CHASSIS
    );
    opticsRoof.name = 'Body_Chassis_RoofDeck';
    opticsRoof.position.set(0, BASE_Y + 0.16 + 1.80 - 0.02, 1.19);
    opticsRoof.castShadow = true;
    opticsRoof.receiveShadow = true;
    this.chassisShellGroup.add(opticsRoof);
    this.chassisMeshes.push(opticsRoof);
    this.opticsRoof = opticsRoof;

    // Polished Chrome Crown Seam Runner along Z = 0
    const crownRunner = new THREE.Mesh(
      new THREE.BoxGeometry(4.38, 0.025, 0.035),
      MAT_CHROME
    );
    crownRunner.position.set(0, BASE_Y + 0.16 + 1.80 + 0.005, 0.0);
    this.chassisShellGroup.add(crownRunner);

    // Upper-Left Step Wall at Z = 0 (from top of ATR deck Y = 0.90 to Rear Roof Y = 2.04, X in [0, 2.18])
    const opticsBulkhead = new THREE.Mesh(
      new THREE.BoxGeometry(2.18, 1.14, 0.04),
      MAT_CHASSIS
    );
    opticsBulkhead.name = 'Body_Chassis_Bulkhead';
    opticsBulkhead.position.set(1.09, 1.47, 0.0);
    opticsBulkhead.castShadow = true;
    opticsBulkhead.receiveShadow = true;
    this.chassisShellGroup.add(opticsBulkhead);
    this.chassisMeshes.push(opticsBulkhead);

    // Internal Machined Optical Port Bracket at Z = 0 (Anchored to Baseplate for KBr Beam Windows)
    const kbrPortBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.34, 0.04),
      MAT_ALUM_ANODIZED
    );
    kbrPortBracket.name = 'Bracket_KBr_OpticalPorts';
    kbrPortBracket.position.set(1.20, 0.41, 0.0);
    this.chassisBaseGroup.add(kbrPortBracket);

    // Two KBr Optical Windows on Optical Port Bracket at Z = 0, Y = 0.48 (Modulated IR Beam Out / Detector In)
    [0.94, 1.45].forEach((wx, idx) => {
      const portBezel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.085, 0.05, 24),
        MAT_CHROME
      );
      portBezel.name = `Window_KBr_Bulkhead_${idx + 1}`;
      portBezel.rotation.x = Math.PI / 2;
      portBezel.position.set(wx, 0.48, 0.0);
      this.chassisBaseGroup.add(portBezel);

      const kbrWin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.070, 0.070, 0.018, 24),
        MAT_KBR_CRYSTAL
      );
      kbrWin.rotation.x = Math.PI / 2;
      kbrWin.position.set(wx, 0.48, 0.0);
      this.chassisBaseGroup.add(kbrWin);
    });

    // Desiccant Service Hatch on Optics Roof Deck
    const hatchGroup = new THREE.Group();
    hatchGroup.name = 'Hatch_Desiccant_Service';
    hatchGroup.position.set(0.65, BASE_Y + 0.16 + 1.80, 1.19);

    const hatchRim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.20, 0.22, 0.02, 32),
      MAT_CHROME
    );
    hatchGroup.add(hatchRim);

    const hatchLid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.025, 32),
      MAT_CHASSIS_DARK
    );
    hatchLid.position.y = 0.012;
    hatchGroup.add(hatchLid);

    const thumbscrew = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.04, 24),
      MAT_BRASS_FITTING
    );
    thumbscrew.position.y = 0.035;
    hatchGroup.add(thumbscrew);
    this.chassisShellGroup.add(hatchGroup);

    // Sealed Silica Gel Humidity Indicator Window
    const humidGroup = new THREE.Group();
    humidGroup.name = 'Indicator_Humidity_Silica';
    humidGroup.position.set(1.45, BASE_Y + 0.16 + 1.80, 1.19);

    const humidBezel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.11, 0.02, 24),
      MAT_CHROME
    );
    humidGroup.add(humidBezel);

    const blueCrystals = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.015, 24),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.85 })
    );
    blueCrystals.position.y = 0.008;
    humidGroup.add(blueCrystals);

    const humidLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.005, 24),
      MAT_OPTICAL_GLASS
    );
    humidLens.position.y = 0.018;
    humidGroup.add(humidLens);
    this.chassisShellGroup.add(humidGroup);

    // --- HOLLOW 3D SLOPED CONSOLE HOOD (Front Right: X in [-2.18, 0], Z in [-2.38, 0]) ---
    // Open bottom & open rear at Z = 0 so electronics bay and FPC ribbon are completely unobstructed!
    const v0 = [-2.18, 0.24, -2.38]; // front-right-bottom
    const v1 = [ 0.00, 0.24, -2.38]; // front-left-bottom
    const v1m = [0.00, 0.90, -2.38]; // front-left at ATR deck height
    const v2m = [0.00, 0.90,  0.00]; // rear-left at ATR deck height
    const v3 = [-2.18, 0.24,  0.00]; // rear-right-bottom

    const v4 = [-2.18, 1.38, -2.38]; // front-right-top
    const v5 = [ 0.00, 1.38, -2.38]; // front-left-top
    const v6 = [ 0.00, 2.04,  0.00]; // rear-left-top
    const v7 = [-2.18, 2.04,  0.00]; // rear-right-top

    const wedgePositions = new Float32Array([
      // 1. Sloped Top Console Deck
      ...v4, ...v7, ...v6,   ...v4, ...v6, ...v5,
      // 2. Center-Left Cheek Wall (above ATR deck Y >= 0.90)
      ...v1m, ...v6, ...v2m, ...v1m, ...v5, ...v6,
      // 3. Outer Right Flank Wall (X = -2.18)
      ...v0, ...v3, ...v7,   ...v0, ...v7, ...v4,
      // 4. Front Vertical Fascia Apron (Z = -2.38)
      ...v0, ...v5, ...v1,   ...v0, ...v4, ...v5,
    ]);

    const wedgeUvs = new Float32Array([
      0,0, 1,1, 0,1,  0,0, 1,0, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
    ]);

    const wedgeGeo = new THREE.BufferGeometry();
    wedgeGeo.setAttribute('position', new THREE.BufferAttribute(wedgePositions, 3));
    wedgeGeo.setAttribute('uv', new THREE.BufferAttribute(wedgeUvs, 2));
    wedgeGeo.computeVertexNormals();

    const consoleWedgeMesh = new THREE.Mesh(wedgeGeo, MAT_CHASSIS);
    consoleWedgeMesh.name = 'Chassis_SlopedConsole';
    consoleWedgeMesh.castShadow = true;
    consoleWedgeMesh.receiveShadow = true;
    this.chassisShellGroup.add(consoleWedgeMesh);
    this.chassisMeshes.push(consoleWedgeMesh);

    // Front sill accent runner between front apron and sloped deck
    const frontSill = new THREE.Mesh(
      new THREE.BoxGeometry(2.18, 0.02, 0.035),
      MAT_CHROME
    );
    frontSill.position.set(-1.09, 1.38, -2.38);
    this.chassisShellGroup.add(frontSill);

    // Official SREdesigns Brand Badge on Front Apron
    const brandBadge = makeSREdesignsBadge(0.55);
    brandBadge.position.set(-1.09, 0.95, -2.385);
    brandBadge.rotation.y = Math.PI; // Faces -Z forward toward operator
    this.chassisShellGroup.add(brandBadge);

    // Front Air Intake Louvers (below badge on front right fascia)
    for (let l = 0; l < 5; l++) {
      const louver = new THREE.Mesh(
        new THREE.BoxGeometry(1.60, 0.024, 0.035),
        MAT_CHASSIS_DARK
      );
      louver.position.set(-1.09, BASE_Y + 0.28 + l * 0.075, -2.383);
      this.chassisShellGroup.add(louver);
    }

    // --- SIDE BUMPER RAILS & RECESSED LIFT HANDLES ---
    // Right flank (-2.18): full-length bumper rail (Z in [-2.30, +2.30])
    const rightBumper = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.08, 4.60),
      MAT_ALUM_ANODIZED
    );
    rightBumper.position.set(-2.18 + 0.012, BASE_Y + 0.40, 0);
    this.chassisShellGroup.add(rightBumper);

    for (let bz = -1.8; bz <= 1.8; bz += 0.9) {
      const screw = createHexSocketScrew(0.014, 0.03, { material: MAT_CHROME });
      screw.rotation.z = Math.PI / 2;
      screw.position.set(-2.18 + 0.012, BASE_Y + 0.40, bz);
      this.chassisShellGroup.add(screw);
    }

    // Left flank (+2.18): rear optics section bumper rail (Z in [+0.05, +2.30])
    const leftRearBumper = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.08, 2.25),
      MAT_ALUM_ANODIZED
    );
    leftRearBumper.position.set(2.18 - 0.012, BASE_Y + 0.40, 1.175);
    this.chassisShellGroup.add(leftRearBumper);

    for (const bz of [0.35, 1.175, 2.00]) {
      const screw = createHexSocketScrew(0.014, 0.03, { material: MAT_CHROME });
      screw.rotation.z = -Math.PI / 2;
      screw.position.set(2.18 - 0.012, BASE_Y + 0.40, bz);
      this.chassisShellGroup.add(screw);
    }

    for (const sx of [-2.18, 2.18]) {
      const pocketBezel = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.16, 0.45),
        MAT_CHASSIS_DARK
      );
      pocketBezel.position.set(sx + (sx > 0 ? -0.015 : 0.015), BASE_Y + 0.65, 0.65);
      this.chassisShellGroup.add(pocketBezel);
    }

    // 80mm Convective Exhaust Fan Louvers on Rear Shroud Wall
    for (let f = 0; f < 8; f++) {
      const fanLouver = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.024, 0.04),
        MAT_CHASSIS_DARK
      );
      fanLouver.rotation.x = -0.42;
      fanLouver.position.set(-1.40, BASE_Y + 0.95 + f * 0.08, 2.385);
      this.chassisShellGroup.add(fanLouver);
    }

    // Silkscreened Aluminum GLP Specification Rating Plate
    const ratingPlate = createRatingPlate();
    ratingPlate.position.set(0.50, 1.25, 2.385);
    this.chassisShellGroup.add(ratingPlate);

    // Fasteners securing top unibody to chassis base
    [
      [-1.95, 2.25], [1.95, 2.25],
      [-1.95, 0.15], [1.95, 0.15]
    ].forEach(([sx, sz], idx) => {
      const screw = createHexSocketScrew(0.02, 0.05, { material: MAT_CHROME });
      screw.name = `Fastener_RoofHex_${idx + 1}`;
      screw.position.set(sx, BASE_Y + 0.16 + 1.80, sz);
      this.chassisShellGroup.add(screw);
    });

    this.rootGroup.add(this.chassisShellGroup);
  }

  // ==========================================
  // Open Diamond ATR Sampling Station & Under-Deck Transfer Optics
  // (Mounted on Front Left: X in [0, 2.18], Z in [-2.38, 0])
  // ==========================================
  buildDiamondATRStation() {
    const BASE_Y = 0.08;
    const FLOOR_Y = BASE_Y + 0.16; // 0.24

    // -----------------------------------------------------------------
    // A. UNDER-DECK ATR TRANSFER OPTICS & LOAD-CELL SENSOR (Anchored to Baseplate)
    // Exposed when ATR top deck elevates in Exploded View or in Optics View!
    // -----------------------------------------------------------------
    this.atrTransferGroup.position.set(1.09, FLOOR_Y, -1.19);

    // Cast aluminum ATR optical sub-plate
    const subPlate = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.04, 1.90),
      MAT_ALUM_BREADBOARD
    );
    subPlate.name = 'Plate_ATR_OpticalBench';
    subPlate.position.set(0, 0.02, 0);
    this.atrTransferGroup.add(subPlate);

    // 45° Off-Axis Gold ZnSe Input Condensing Mirror (bounces IR beam up into diamond prism)
    const mirrorInGroup = new THREE.Group();
    mirrorInGroup.name = 'Mirror_ATR_Input_ZnSe';
    mirrorInGroup.position.set(-0.15, 0.24, 0.0);
    const mInHolder = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.24), MAT_BRASS_FITTING);
    mirrorInGroup.add(mInHolder);
    const mInOptic = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 24), MAT_GOLD_MIRROR);
    mInOptic.rotation.z = Math.PI / 4;
    mInOptic.position.set(0.06, 0.06, 0);
    mirrorInGroup.add(mInOptic);
    this.atrTransferGroup.add(mirrorInGroup);

    // 45° Off-Axis Gold ZnSe Output Condensing Mirror (collects ATR beam back to DTGS detector)
    const mirrorOutGroup = new THREE.Group();
    mirrorOutGroup.name = 'Mirror_ATR_Output_ZnSe';
    mirrorOutGroup.position.set(0.36, 0.24, 0.0);
    const mOutHolder = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.24), MAT_BRASS_FITTING);
    mirrorOutGroup.add(mOutHolder);
    const mOutOptic = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 24), MAT_GOLD_MIRROR);
    mOutOptic.rotation.z = -Math.PI / 4;
    mOutOptic.position.set(-0.06, 0.06, 0);
    mirrorOutGroup.add(mOutOptic);
    this.atrTransferGroup.add(mirrorOutGroup);

    // Strain-Gauge Load-Cell Force Transducer under ATR Tower Pedestal (reads 0-150N clamp force)
    const loadCell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.18, 0.34, 24),
      MAT_ALUM_ANODIZED
    );
    loadCell.name = 'Sensor_LoadCell_ATR';
    loadCell.position.set(0, 0.21, 0.65);
    this.atrTransferGroup.add(loadCell);

    const hdrLoadCell = createJSTHeader(3);
    hdrLoadCell.name = 'Header_LoadCell_Sensor';
    hdrLoadCell.position.set(-0.20, 0.04, 0.65);
    hdrLoadCell.rotation.y = -Math.PI / 2;
    this.atrTransferGroup.add(hdrLoadCell);

    this.chassisBaseGroup.add(this.atrTransferGroup);

    // -----------------------------------------------------------------
    // B. MODULAR ATR SAMPLING STATION TOP DECK & PERIMETER CURB SKIRT
    // (Elevates as an intermediate tier +0.85m in Exploded View)
    // -----------------------------------------------------------------
    this.atrStationGroup.position.set(1.09, BASE_Y + 0.16 + 0.66, -1.19);

    // Integral molded low-profile perimeter curb skirts (hang down -0.66m from deck to baseplate)
    const curbLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.66, 2.38),
      MAT_CHASSIS
    );
    curbLeft.name = 'Chassis_ATR_CurbLeft';
    curbLeft.position.set(1.09 - 0.04, -0.33, 0);
    curbLeft.castShadow = true;
    this.atrStationGroup.add(curbLeft);
    this.chassisMeshes.push(curbLeft);

    const curbFront = new THREE.Mesh(
      new THREE.BoxGeometry(2.18, 0.66, 0.08),
      MAT_CHASSIS
    );
    curbFront.name = 'Chassis_ATR_CurbFront';
    curbFront.position.set(0, -0.33, -1.19 + 0.04);
    curbFront.castShadow = true;
    this.atrStationGroup.add(curbFront);
    this.chassisMeshes.push(curbFront);

    // Smooth chamfer chrome caps along top of low curbs
    const capLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.02, 2.38),
      MAT_CHROME
    );
    capLeft.position.set(1.09 - 0.04, 0.01, 0);
    this.atrStationGroup.add(capLeft);

    const capFront = new THREE.Mesh(
      new THREE.BoxGeometry(2.18, 0.02, 0.08),
      MAT_CHROME
    );
    capFront.position.set(0, 0.01, -1.19 + 0.04);
    this.atrStationGroup.add(capFront);

    // Front-Left Bumper Rail on ATR Curb (matches Rear-Left Bumper Rail at Y = 0.48)
    const leftFrontBumper = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.08, 2.25),
      MAT_ALUM_ANODIZED
    );
    leftFrontBumper.position.set(1.09 - 0.012, -0.42, 0.015);
    this.atrStationGroup.add(leftFrontBumper);

    for (const bz of [-0.80, 0.015, 0.83]) {
      const screw = createHexSocketScrew(0.014, 0.03, { material: MAT_CHROME });
      screw.rotation.z = -Math.PI / 2;
      screw.position.set(1.09 - 0.012, -0.42, bz);
      this.atrStationGroup.add(screw);
    }

    // 1. Mirror-Polished 316L Stainless Steel Deck Plate (2.02m x 0.06m x 2.22m)
    const plateGeo = new THREE.BoxGeometry(2.02, 0.06, 2.22);
    const plate = new THREE.Mesh(plateGeo, MAT_STAINLESS_ATR);
    plate.name = 'Plate_ATR_StainlessDeck';
    plate.castShadow = true;
    plate.receiveShadow = true;
    this.atrStationGroup.add(plate);

    // 4 Countersunk M4 hex screws in corner counterbores
    for (const sx of [-0.85, 0.85]) {
      for (const sz of [-0.95, 0.95]) {
        const screw = createHexSocketScrew(0.016, 0.04, { material: MAT_CHROME });
        screw.position.set(sx, 0.03, sz);
        this.atrStationGroup.add(screw);
      }
    }

    // Concentric recessed solvent well ring surrounding diamond crystal
    const wellGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.015, 32);
    const well = new THREE.Mesh(wellGeo, MAT_CHASSIS_DARK);
    well.position.y = 0.031;
    this.atrStationGroup.add(well);

    // Gold brazing seal ring
    const goldPuck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.018, 32),
      MAT_BRASS_FITTING
    );
    goldPuck.position.y = 0.035;
    this.atrStationGroup.add(goldPuck);

    // Monolithic Type IIa Synthetic Diamond Prism
    const diamondGeo = new THREE.CylinderGeometry(0.065, 0.045, 0.024, 16);
    this.diamondMesh = new THREE.Mesh(diamondGeo, MAT_DIAMOND_PRISM);
    this.diamondMesh.name = 'Diamond_ATR_Crystal';
    this.diamondMesh.position.y = 0.042;
    this.diamondMesh.castShadow = true;
    this.diamondMesh.userData = { name: 'Diamond_ATR_Crystal', action: 'cycle_sample', tooltip: 'Monolithic Type IIa Diamond Crystal (Click to swap sample)' };
    this.actionableMeshes.push(this.diamondMesh);
    this.atrStationGroup.add(this.diamondMesh);

    // 2. Swiveling Heavy Pressure Clamp Tower (180° swing clearance)
    this.towerGroup = new THREE.Group();
    this.towerGroup.name = 'Tower_Clamp_Swivel';
    this.towerGroup.position.set(0, 0.03, 0.65);

    const towerBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.12, 0.32),
      MAT_CHASSIS_DARK
    );
    towerBase.position.y = 0.06;
    towerBase.castShadow = true;
    this.towerGroup.add(towerBase);

    for (const bx of [-0.10, 0.10]) {
      const bolt = createHexSocketScrew(0.014, 0.03, { material: MAT_CHROME });
      bolt.position.set(bx, 0.12, 0);
      this.towerGroup.add(bolt);
    }

    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.085, 0.68, 24),
      MAT_CHASSIS_DARK
    );
    pillar.position.y = 0.44;
    pillar.castShadow = true;
    this.towerGroup.add(pillar);

    const hingePin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.14, 16),
      MAT_CHROME
    );
    hingePin.rotation.z = Math.PI / 2;
    hingePin.position.set(0, 0.72, 0);
    this.towerGroup.add(hingePin);

    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.12, 0.72),
      MAT_CHASSIS_DARK
    );
    arm.position.set(0, 0.72, -0.32);
    arm.castShadow = true;
    this.towerGroup.add(arm);

    this.torqueKnob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.14, 32),
      MAT_CHASSIS_DARK
    );
    this.torqueKnob.name = 'Knob_ATR_Torque';
    this.torqueKnob.position.set(0, 0.85, -0.65);
    this.torqueKnob.castShadow = true;
    this.towerGroup.add(this.torqueKnob);

    const knurlRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.124, 0.124, 0.04, 32),
      MAT_CHROME
    );
    knurlRing.position.set(0, 0.85, -0.65);
    this.towerGroup.add(knurlRing);

    const anvilRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.22, 16),
      MAT_CHROME
    );
    anvilRod.position.set(0, 0.62, -0.65);
    anvilRod.castShadow = true;
    this.towerGroup.add(anvilRod);

    const sapphireTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.022, 0.04, 16),
      MAT_OPTICAL_GLASS
    );
    sapphireTip.rotation.x = Math.PI;
    sapphireTip.position.set(0, 0.50, -0.65);
    this.towerGroup.add(sapphireTip);

    const towerUserData = { name: 'Tower_Clamp_Swivel', action: 'toggle_tower', tooltip: 'Click to swivel pressure clamp tower' };
    this.towerGroup.userData = towerUserData;
    arm.userData = towerUserData;
    this.torqueKnob.userData = { name: 'Knob_ATR_Torque', action: 'cycle_pressure', tooltip: 'Slip-Clutch Torque Knob (Click to adjust pressure)' };
    this.actionableMeshes.push(arm);
    this.actionableMeshes.push(this.torqueKnob);

    this.atrStationGroup.add(this.towerGroup);

    // 3. Interchangeable Sample Geometry Container
    this.sampleGroup = new THREE.Group();
    this.sampleGroup.position.set(0, 0.054, 0);
    this.atrStationGroup.add(this.sampleGroup);
    this.updateSampleMesh();

    this.chassisBaseGroup.add(this.atrStationGroup);
  }

  updateSampleMesh() {
    while (this.sampleGroup.children.length > 0) {
      const obj = this.sampleGroup.children.pop();
      if (obj.geometry) obj.geometry.dispose();
    }

    if (this.activeSampleId === 'isopropanol' || this.activeSampleId === 'acetone' || this.activeSampleId === 'toluene') {
      const dropGeo = new THREE.SphereGeometry(0.05, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const dropMesh = new THREE.Mesh(dropGeo, MAT_LIQUID_SAMPLE);
      dropMesh.position.y = 0.0;
      this.sampleGroup.add(dropMesh);
    } else if (this.activeSampleId === 'polystyrene') {
      const filmGeo = new THREE.BoxGeometry(0.12, 0.005, 0.12);
      const filmMesh = new THREE.Mesh(filmGeo, MAT_FILM_SAMPLE);
      filmMesh.position.y = 0.002;
      this.sampleGroup.add(filmMesh);
    } else if (this.activeSampleId === 'benzoic_acid') {
      const powderGeo = new THREE.ConeGeometry(0.055, 0.032, 12);
      const powderMesh = new THREE.Mesh(powderGeo, MAT_POWDER_SAMPLE);
      powderMesh.position.y = 0.016;
      this.sampleGroup.add(powderMesh);
    }
  }

  // ==========================================
  // Michelson Interferometer & Optical Breadboard
  // (Anchored solidly to chassisBaseGroup inside Rear Section: Z in [0, 2.38])
  // ==========================================
  buildMichelsonInterferometer() {
    const BASE_Y = 0.08;
    this.interferometerGroup.position.set(1.09, BASE_Y + 0.16 + 0.15, 1.19);

    // Heavy Cast Aluminum Optical Breadboard with tapped M6 hole grid
    const bbGeo = new THREE.BoxGeometry(1.95, 0.08, 2.15);
    const breadboard = new THREE.Mesh(bbGeo, MAT_ALUM_BREADBOARD);
    breadboard.receiveShadow = true;
    this.interferometerGroup.add(breadboard);

    // Tapped M6 hole grid
    for (let x = -0.8; x <= 0.8; x += 0.2) {
      for (let z = -0.9; z <= 0.9; z += 0.2) {
        const hole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.02, 8),
          MAT_HEX_RECESS
        );
        hole.position.set(x, 0.041, z);
        this.interferometerGroup.add(hole);
      }
    }

    // 1. Polaris Ever-Glo Ceramic IR Source (Operating at 1200°C)
    const sourceGroup = new THREE.Group();
    sourceGroup.position.set(-0.65, 0.25, 0.65);

    const sinkBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.32, 24),
      MAT_CHASSIS_DARK
    );
    sourceGroup.add(sinkBody);

    for (let f = 0; f < 5; f++) {
      const fin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.015, 24),
        MAT_CHASSIS_DARK
      );
      fin.position.y = -0.10 + f * 0.05;
      sourceGroup.add(fin);
    }

    const emitterGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.20, 16);
    this.emitterMesh = new THREE.Mesh(emitterGeo, this.hasPower ? MAT_CERAMIC_HOT : MAT_CERAMIC_OFF);
    this.emitterMesh.position.set(0, 0, -0.12);
    this.emitterMesh.rotation.x = Math.PI / 2;
    sourceGroup.add(this.emitterMesh);

    this.sourceLight = new THREE.PointLight(0xff5500, this.hasPower ? 1.5 : 0.0, 1.2);
    this.sourceLight.position.set(0, 0, -0.15);
    sourceGroup.add(this.sourceLight);

    this.interferometerGroup.add(sourceGroup);

    // 2. Sealed HeNe 632.8 nm Reference Laser Tube
    const heneGroup = new THREE.Group();
    heneGroup.position.set(0.10, 0.15, 0.85);

    const plasmaTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.95, 24),
      MAT_LASER_TUBE
    );
    plasmaTube.rotation.z = Math.PI / 2;
    plasmaTube.castShadow = true;
    heneGroup.add(plasmaTube);

    for (const cx of [-0.35, 0.35]) {
      const collar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.06, 24),
        MAT_CHROME
      );
      collar.rotation.z = Math.PI / 2;
      collar.position.x = cx;
      heneGroup.add(collar);
    }

    const aldenConnector = createAldenHVConnector();
    aldenConnector.position.set(0.48, 0, 0);
    aldenConnector.rotation.y = Math.PI / 2;
    heneGroup.add(aldenConnector);


    this.interferometerGroup.add(heneGroup);

    // 3. KBr Beamsplitter & Compensator in Brass Kinematic Mount (45° incidence)
    const bsGroup = new THREE.Group();
    bsGroup.position.set(-0.15, 0.25, 0.0);
    bsGroup.rotation.y = -Math.PI / 4;

    const bsMount = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.38, 0.38),
      MAT_BRASS_FITTING
    );
    bsGroup.add(bsMount);

    const bsPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.02, 32),
      MAT_KBR_CRYSTAL
    );
    bsPlate.rotation.z = Math.PI / 2;
    bsPlate.position.x = 0.02;
    bsGroup.add(bsPlate);

    const compPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.02, 32),
      MAT_KBR_CRYSTAL
    );
    compPlate.rotation.z = Math.PI / 2;
    compPlate.position.x = -0.02;
    bsGroup.add(compPlate);

    for (const my of [-0.14, 0.14]) {
      const micrometer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.08, 16),
        MAT_CHROME
      );
      micrometer.rotation.z = Math.PI / 2;
      micrometer.position.set(-0.06, my, 0.12);
      bsGroup.add(micrometer);
    }

    this.interferometerGroup.add(bsGroup);

    // 4. Fixed Gold Front-Surface Reference Mirror
    const fixedMirrorGroup = new THREE.Group();
    fixedMirrorGroup.position.set(0.50, 0.25, 0.0);

    const fmBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.34, 0.34),
      MAT_CHASSIS_DARK
    );
    fixedMirrorGroup.add(fmBase);

    const fmMirror = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.015, 32),
      MAT_GOLD_MIRROR
    );
    fmMirror.rotation.z = Math.PI / 2;
    fmMirror.position.x = -0.065;
    fixedMirrorGroup.add(fmMirror);
    this.interferometerGroup.add(fixedMirrorGroup);

    // 5. Moving Mirror Voice-Coil Linear Actuator
    this.movingMirrorGroup = new THREE.Group();
    this.movingMirrorGroup.position.set(-0.15, 0.25, -0.65);

    const motorHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.36, 32),
      MAT_CHASSIS_DARK
    );
    motorHousing.rotation.x = Math.PI / 2;
    this.movingMirrorGroup.add(motorHousing);

    const coilWindings = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.18, 24),
      MAT_COPPER_WIRE
    );
    coilWindings.rotation.x = Math.PI / 2;
    coilWindings.position.z = 0.08;
    this.movingMirrorGroup.add(coilWindings);

    this.movingMirrorPuck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.018, 32),
      MAT_GOLD_MIRROR
    );
    this.movingMirrorPuck.rotation.x = Math.PI / 2;
    this.movingMirrorPuck.position.z = 0.20;
    this.movingMirrorGroup.add(this.movingMirrorPuck);

    this.interferometerGroup.add(this.movingMirrorGroup);

    // 6. DTGS Pyroelectric Infrared Detector in Shielded Can
    const dtgsGroup = new THREE.Group();
    dtgsGroup.position.set(0.65, 0.25, -0.75);

    const canMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.10, 0.18, 24),
      MAT_DETECTOR_CAN
    );
    canMesh.rotation.x = Math.PI / 2;
    dtgsGroup.add(canMesh);

    const kbrWindow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.015, 16),
      MAT_KBR_CRYSTAL
    );
    kbrWindow.rotation.x = Math.PI / 2;
    kbrWindow.position.z = 0.095;
    dtgsGroup.add(kbrWindow);

    // Gold-plated precision female SMA bulkhead connector on detector can
    const dtgsSMA = createSMAJackFemale();
    dtgsSMA.name = 'Socket_DTGS_SMA';
    dtgsSMA.position.set(0, 0.11, 0);
    dtgsSMA.rotation.y = Math.PI / 2;
    dtgsGroup.add(dtgsSMA);

    this.interferometerGroup.add(dtgsGroup);


    this.chassisBaseGroup.add(this.interferometerGroup);
  }

  // ==========================================
  // Internal Electronics & Convective Cooling Fans
  // - SMPS in Mid-Right Bay (X = -1.24, Z = +0.70)
  // - DSP Motherboard in Front-Right Bay under Console (X = -1.10, Z = -1.35)
  // - 80mm Exhaust Fan on Rear Bulkhead Bracket (X = -1.40, Z = +2.20)
  // ==========================================
  buildElectronicsAndFans() {
    const BASE_Y = 0.08;
    const FLOOR_Y = BASE_Y + 0.16; // 0.24
    this.electronicsGroup.position.set(0, FLOOR_Y, 0);

    // 1. High-Fidelity Switch-Mode Power Supply (SMPS) in Mid-Right Bay
    const smps = createSMPSAssembly();
    smps.position.set(-1.24, 0, 0.70);
    this.smpsFanHub = smps.userData.smpsFanHub;
    this.electronicsGroup.add(smps);

    // 2. High-Speed 32-Bit DSP Motherboard (Assembly_Motherboard_DSP) in Front-Right Bay
    const mbGroup = new THREE.Group();
    mbGroup.name = 'Assembly_Motherboard_DSP';
    mbGroup.position.set(-1.10, 0, -1.35);

    // 6-Layer FR-4 Substrate PCB Board (0.96 x 0.02 x 1.06m)
    const pcbGeo = new THREE.BoxGeometry(0.96, 0.02, 1.06);
    const pcb = new THREE.Mesh(pcbGeo, MAT_PCB_GREEN);
    pcb.name = 'PCB_Motherboard_Substrate';
    pcb.position.y = 0.03;
    pcb.receiveShadow = true;
    pcb.castShadow = true;
    mbGroup.add(pcb);

    // High-DPI Silk & Trace Canvas Surface Plane
    const mbTex = createFTIRMotherboardCanvasTexture();
    const mbSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(0.96, 1.06),
      new THREE.MeshStandardMaterial({ map: mbTex, roughness: 0.35, metalness: 0.15 })
    );
    mbSurface.name = 'PCB_Motherboard_TopSurface';
    mbSurface.rotation.x = -Math.PI / 2;
    mbSurface.position.y = 0.041;
    mbGroup.add(mbSurface);

    // 4 Corner Brass Standoff Pillars with M3 Hex Screws
    for (const sx of [-0.43, 0.43]) {
      for (const sz of [-0.48, 0.48]) {
        const standoff = new THREE.Mesh(
          new THREE.CylinderGeometry(0.016, 0.016, 0.04, 6),
          MAT_BRASS_FITTING
        );
        standoff.position.set(sx, 0.01, sz);
        mbGroup.add(standoff);

        const screw = createHexSocketScrew(0.010, 0.022, { material: MAT_CHROME });
        screw.position.set(sx, 0.042, sz);
        mbGroup.add(screw);
      }
    }

    // Main 32-Bit DSP Processor (TI TMS320C6748)
    const dspChip = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.018, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.3, metalness: 0.4 })
    );
    dspChip.name = 'IC_DSP_Processor';
    dspChip.position.set(-0.04, 0.048, 0.02);
    mbGroup.add(dspChip);

    // Black anodized micro-finned aluminum heatsink on DSP processor
    const dspSinkBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.016, 0.18),
      MAT_ALUM_ANODIZED
    );
    dspSinkBase.position.set(-0.04, 0.065, 0.02);
    mbGroup.add(dspSinkBase);
    for (let h = -0.072; h <= 0.072; h += 0.024) {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.035, 0.006),
        MAT_ALUM_ANODIZED
      );
      fin.position.set(-0.04, 0.088, 0.02 + h);
      mbGroup.add(fin);
    }

    // 3 Modular Daughterboard Driver Modules (Blue PCBs with Extruded Heatsinks & Gold Pin Headers)
    const driverModules = [
      { name: 'Driver_VoiceCoil_Servo', z: 0.24 },
      { name: 'Driver_IRSource_Regulator', z: 0.04 },
      { name: 'Driver_Purge_Telemetry', z: -0.16 },
    ];
    driverModules.forEach((dm) => {
      const drvG = new THREE.Group();
      drvG.name = dm.name;
      drvG.position.set(-0.30, 0.048, dm.z);

      const drvPCB = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.008, 0.13),
        new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3, metalness: 0.2 })
      );
      drvPCB.position.y = 0.008;
      drvG.add(drvPCB);

      for (const px of [-0.042, 0.042]) {
        const pinHeader = new THREE.Mesh(
          new THREE.BoxGeometry(0.008, 0.018, 0.11),
          MAT_CHASSIS_DARK
        );
        pinHeader.position.set(px, 0.0, 0);
        drvG.add(pinHeader);
      }

      const miniSink = new THREE.Mesh(
        new THREE.BoxGeometry(0.055, 0.024, 0.055),
        MAT_ALUM_ANODIZED
      );
      miniSink.position.set(0, 0.026, -0.01);
      drvG.add(miniSink);

      const trimPot = new THREE.Mesh(
        new THREE.BoxGeometry(0.020, 0.012, 0.020),
        MAT_BRASS_FITTING
      );
      trimPot.position.set(0, 0.016, 0.042);
      drvG.add(trimPot);

      mbGroup.add(drvG);
    });

    // 24-Bit Sigma-Delta ADC (Analog Devices AD7799)
    const adcChip = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.015, 0.11),
      MAT_CHASSIS_DARK
    );
    adcChip.name = 'IC_ADC_24Bit';
    adcChip.position.set(0.24, 0.048, 0.26);
    mbGroup.add(adcChip);

    // Dual Micron DDR3 SDRAM memory chips
    for (let m = 0; m < 2; m++) {
      const ram = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.014, 0.08),
        MAT_CHASSIS_DARK
      );
      ram.name = `IC_RAM_DDR3_${m + 1}`;
      ram.position.set(0.20, 0.048, -0.02 - m * 0.12);
      mbGroup.add(ram);
    }

    // 8 GB eMMC Non-Volatile Flash Memory Chip
    const flashChip = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.014, 0.10),
      MAT_CHASSIS_DARK
    );
    flashChip.name = 'IC_Flash_eMMC';
    flashChip.position.set(0.20, 0.048, 0.12);
    mbGroup.add(flashChip);

    // HeNe Laser High-Voltage Ballast Inverter Module (Shielded potted metal can)
    const hvBallast = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.065, 0.14),
      MAT_ALUM_ANODIZED
    );
    hvBallast.name = 'Module_HeNe_Inverter';
    hvBallast.position.set(0.22, 0.068, -0.32);
    mbGroup.add(hvBallast);

    // Real-Time Clock CR2032 Lithium Coin Cell Battery in chrome socket
    const rtcHolder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.024, 20),
      MAT_CHROME
    );
    rtcHolder.position.set(-0.28, 0.048, -0.34);
    mbGroup.add(rtcHolder);

    const rtcBattery = new THREE.Mesh(
      new THREE.CylinderGeometry(0.058, 0.058, 0.018, 20),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.9 })
    );
    rtcBattery.name = 'Battery_RTC_CR2032';
    rtcBattery.position.set(-0.28, 0.056, -0.34);
    mbGroup.add(rtcBattery);

    // System Clock Crystals (25.000 MHz HC-49SM and 32.768 kHz RTC cylinder)
    const xtal25 = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.018, 0.028), MAT_CHROME);
    xtal25.position.set(-0.04, 0.048, -0.16);
    mbGroup.add(xtal25);

    const xtal32k = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.034, 12), MAT_CHROME);
    xtal32k.rotation.z = Math.PI / 2;
    xtal32k.position.set(-0.16, 0.048, -0.34);
    mbGroup.add(xtal32k);

    // 6 Radial Aluminum Electrolytic Filter Capacitors with scored vents
    const capCoords = [
      { x: -0.38, z: 0.36, h: 0.075, r: 0.024 },
      { x: -0.30, z: 0.36, h: 0.075, r: 0.024 },
      { x: -0.04, z: 0.22, h: 0.055, r: 0.020 },
      { x: 0.04, z: 0.22, h: 0.055, r: 0.020 },
      { x: 0.04, z: -0.26, h: 0.055, r: 0.020 },
      { x: -0.04, z: -0.26, h: 0.055, r: 0.020 },
    ];
    capCoords.forEach((cc) => {
      const can = new THREE.Mesh(
        new THREE.CylinderGeometry(cc.r, cc.r, cc.h, 16),
        MAT_CHASSIS_DARK
      );
      can.position.set(cc.x, 0.04 + cc.h / 2, cc.z);
      mbGroup.add(can);

      const topCap = new THREE.Mesh(
        new THREE.CylinderGeometry(cc.r * 0.95, cc.r * 0.95, 0.004, 16),
        MAT_CHROME
      );
      topCap.position.set(cc.x, 0.04 + cc.h + 0.002, cc.z);
      mbGroup.add(topCap);
    });

    // 15 SMD 0805 Ceramic Capacitors & Resistors Decoupling Arrays
    const smdPositions = [
      [-0.16, 0.044, -0.06], [-0.16, 0.044, -0.02], [-0.16, 0.044, 0.02],
      [-0.16, 0.044, 0.06], [-0.16, 0.044, 0.10],
      [0.08, 0.044, -0.06], [0.08, 0.044, -0.02], [0.08, 0.044, 0.02],
      [0.08, 0.044, 0.06], [0.08, 0.044, 0.10],
      [0.14, 0.044, 0.24], [0.14, 0.044, 0.28], [0.14, 0.044, 0.32],
      [0.08, 0.044, -0.32], [0.08, 0.044, -0.36],
    ];
    smdPositions.forEach(([sx, sy, sz], idx) => {
      const smdMat = idx % 2 === 0 ? MAT_SMD_CAP : MAT_SMD_BODY;
      const smd = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.010, 0.012), smdMat);
      smd.position.set(sx, sy, sz);
      mbGroup.add(smd);

      for (const ex of [-0.008, 0.008]) {
        const term = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.010, 0.012), MAT_SMD_TIN);
        term.position.set(sx + ex, sy, sz);
        mbGroup.add(term);
      }
    });

    // Diagnostic Status LEDs (PWR Green, ACT Amber)
    this.ledPwr = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.010, 0.012), MAT_LED_GREEN);
    this.ledPwr.name = 'LED_Motherboard_PWR';
    this.ledPwr.position.set(-0.40, 0.046, -0.38);
    mbGroup.add(this.ledPwr);

    this.ledAct = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.010, 0.012), MAT_LED_AMBER);
    this.ledAct.name = 'LED_Motherboard_ACT';
    this.ledAct.position.set(-0.40, 0.046, -0.32);
    mbGroup.add(this.ledAct);

    // --- 10 SOLDERED PERIMETER HEADERS ON MOTHERBOARD ---
    // Rear Edge Headers (z = +0.46, facing +Z toward bulkhead grommets)
    const hdrDCPower = createJSTHeader(4);
    hdrDCPower.name = 'Header_DC_Power';
    hdrDCPower.position.set(-0.34, 0.04, 0.46);
    hdrDCPower.rotation.y = Math.PI;
    mbGroup.add(hdrDCPower);

    const hdrFan = createJSTHeader(3);
    hdrFan.name = 'Header_Fan_3Pin';
    hdrFan.position.set(-0.20, 0.04, 0.46);
    hdrFan.rotation.y = Math.PI;
    mbGroup.add(hdrFan);

    const hdrVoiceCoil = createJSTHeader(2);
    hdrVoiceCoil.name = 'Header_VoiceCoil';
    hdrVoiceCoil.position.set(-0.08, 0.04, 0.46);
    hdrVoiceCoil.rotation.y = Math.PI;
    mbGroup.add(hdrVoiceCoil);

    const hdrIRSource = createJSTHeader(2);
    hdrIRSource.name = 'Header_IRSource_Power';
    hdrIRSource.position.set(0.04, 0.04, 0.46);
    hdrIRSource.rotation.y = Math.PI;
    mbGroup.add(hdrIRSource);

    const hdrRS232 = createIDCBoxHeader(10);
    hdrRS232.name = 'Header_RS232_UART';
    hdrRS232.position.set(0.18, 0.04, 0.46);
    hdrRS232.rotation.y = Math.PI / 2;
    mbGroup.add(hdrRS232);

    const hdrUSB = createJSTHeader(5);
    hdrUSB.name = 'Header_USB_Internal';
    hdrUSB.position.set(0.34, 0.04, 0.46);
    hdrUSB.rotation.y = Math.PI;
    mbGroup.add(hdrUSB);

    // Inner (+X) Edge Headers (x = +0.42, facing +X toward center gutter)
    const smaOnboard = createSMAJackFemale();
    smaOnboard.name = 'Socket_Motherboard_SMA';
    smaOnboard.position.set(0.42, 0.055, 0.34);
    mbGroup.add(smaOnboard);

    const hdrRJ45 = createJSTHeader(8);
    hdrRJ45.name = 'Header_RJ45_Internal';
    hdrRJ45.position.set(0.42, 0.04, 0.14);
    hdrRJ45.rotation.y = -Math.PI / 2;
    mbGroup.add(hdrRJ45);

    const hdrLoadCell = createJSTHeader(3);
    hdrLoadCell.name = 'Header_LoadCell_MB';
    hdrLoadCell.position.set(0.42, 0.04, -0.08);
    hdrLoadCell.rotation.y = -Math.PI / 2;
    mbGroup.add(hdrLoadCell);

    // Front (-Z) Edge FPC ZIF Connector for Touchscreen Console
    const zifSocket = createFPCZIFConnector(0.18);
    zifSocket.name = 'Socket_FPC_ZIF_MB';
    zifSocket.position.set(0.00, 0.04, -0.44);
    mbGroup.add(zifSocket);

    this.electronicsGroup.add(mbGroup);

    // 3. 80mm Convective Exhaust Cooling Fan on Sheet-Aluminum Baseplate Bracket
    this.fanGroup = new THREE.Group();
    this.fanGroup.name = 'Fan_80mm_Exhaust';
    this.fanGroup.position.set(-1.40, 0.96, 2.22);

    // Heavy-gauge sheet-aluminum mounting bracket anchored to baseplate
    const fanBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.76, 0.02),
      MAT_ALUM_ANODIZED
    );
    fanBracket.position.set(0, 0, 0.05);
    this.fanGroup.add(fanBracket);

    for (const bx of [-0.34, 0.34]) {
      const riser = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.96, 0.06),
        MAT_ALUM_ANODIZED
      );
      riser.position.set(bx, -0.48, 0.05);
      this.fanGroup.add(riser);

      const footScrew = createHexSocketScrew(0.014, 0.03, { material: MAT_CHROME });
      footScrew.position.set(bx, -0.95, 0.02);
      this.fanGroup.add(footScrew);
    }

    const fanFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.70, 0.70, 0.12),
      MAT_CHASSIS_DARK
    );
    this.fanGroup.add(fanFrame);

    const fanAperture = new THREE.Mesh(
      new THREE.CylinderGeometry(0.31, 0.31, 0.13, 32),
      MAT_CHASSIS_DARK
    );
    fanAperture.rotation.x = Math.PI / 2;
    this.fanGroup.add(fanAperture);

    // 4 Corner DIN 912 M4 hex socket cap screws bolting fan to bracket
    for (const sx of [-0.28, 0.28]) {
      for (const sy of [-0.28, 0.28]) {
        const screw = createHexSocketScrew(0.016, 0.04, { material: MAT_CHROME });
        screw.rotation.x = Math.PI / 2;
        screw.position.set(sx, sy, -0.06);
        this.fanGroup.add(screw);
      }
    }

    this.fanBlades = new THREE.Group();
    this.fanBlades.name = 'Rotor_Fan_Blades';
    const fanHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.10, 0.08, 16),
      MAT_CHASSIS_DARK
    );
    fanHub.rotation.x = Math.PI / 2;
    this.fanBlades.add(fanHub);

    for (let b = 0; b < 7; b++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.015, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })
      );
      const ang = (b / 7) * Math.PI * 2;
      blade.position.set(Math.cos(ang) * 0.18, Math.sin(ang) * 0.18, 0);
      blade.rotation.z = ang + 0.35;
      blade.rotation.y = 0.32;
      this.fanBlades.add(blade);
    }
    this.fanGroup.add(this.fanBlades);

    // Concentric wire finger guard (3 rings + 4 radial spokes)
    for (let r = 0.12; r <= 0.30; r += 0.08) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.008, 8, 32),
        MAT_CHROME
      );
      ring.position.z = -0.065;
      this.fanGroup.add(ring);
    }
    for (let a = 0; a < 4; a++) {
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.60, 0.008),
        MAT_CHROME
      );
      spoke.rotation.z = (a * Math.PI) / 4;
      spoke.position.z = -0.065;
      this.fanGroup.add(spoke);
    }

    this.electronicsGroup.add(this.fanGroup);

    this.chassisBaseGroup.add(this.electronicsGroup);
  }

  // ==========================================
  // Internal Procedural Wiring Harnesses
  // (Clean Floor Gutters, Grommet Pass-Throughs, Zero Chip Crossings)
  // ==========================================
  buildInternalWiringHarnesses() {
    const BASE_Y = 0.08;
    const FLOOR_Y = BASE_Y + 0.16; // 0.24

    const addWireRun = (points, radius, material, name) => {
      const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
      const geom = new THREE.TubeGeometry(curve, Math.max(24, points.length * 8), radius, 8, false);
      const mesh = new THREE.Mesh(geom, material);
      mesh.name = name;
      mesh.castShadow = true;
      this.wiringGroup.add(mesh);
      return mesh;
    };

    const addCableClip = (pos, rotY = 0) => {
      const clipG = new THREE.Group();
      clipG.position.copy(pos);
      clipG.rotation.y = rotY;

      const boss = new THREE.Mesh(
        new THREE.CylinderGeometry(0.020, 0.022, 0.015, 12),
        MAT_ALUM_ANODIZED
      );
      boss.position.y = -0.007;
      clipG.add(boss);

      const loop = new THREE.Mesh(
        new THREE.TorusGeometry(0.024, 0.006, 8, 16, Math.PI * 1.3),
        MAT_NYLON_CLIP
      );
      loop.rotation.z = Math.PI / 2;
      loop.position.set(0, 0.014, 0);
      clipG.add(loop);

      const ear = new THREE.Mesh(
        new THREE.BoxGeometry(0.028, 0.006, 0.032),
        MAT_NYLON_CLIP
      );
      ear.position.set(0.018, 0.003, 0);
      clipG.add(ear);

      const screw = createHexSocketScrew(0.010, 0.018, { material: MAT_CHROME });
      screw.position.set(0.022, 0.010, 0);
      clipG.add(screw);

      this.wiringGroup.add(clipG);
    };

    // -------------------------------------------------------------
    // 1. PRIMARY AC MAINS POWER HARNESS (Live Black, Neutral White, Earth Green/Yellow)
    // Rear IEC-320 C14 Inlet at (-1.40, 0.45, 2.385) -> Rocker Switch (-0.90, 0.45, 2.385)
    // -> SMPS Barrier Strip at (-1.26.. -1.05, 0.42, 0.32)
    // -------------------------------------------------------------
    const fastonIECLive = createFastonDisconnect(MAT_CRIMP_BLUE);
    fastonIECLive.position.set(-1.42, 0.45, 2.35);
    this.wiringGroup.add(fastonIECLive);

    const fastonIECNeutral = createFastonDisconnect(MAT_CRIMP_BLUE);
    fastonIECNeutral.position.set(-1.36, 0.45, 2.35);
    this.wiringGroup.add(fastonIECNeutral);

    const fastonIECEarth = createFastonDisconnect(MAT_CRIMP_BLUE);
    fastonIECEarth.position.set(-1.40, 0.40, 2.35);
    this.wiringGroup.add(fastonIECEarth);

    const fastonSwIn = createFastonDisconnect(MAT_CRIMP_BLUE);
    fastonSwIn.position.set(-0.92, 0.45, 2.35);
    this.wiringGroup.add(fastonSwIn);

    const fastonSwOut = createFastonDisconnect(MAT_CRIMP_BLUE);
    fastonSwOut.position.set(-0.86, 0.45, 2.35);
    this.wiringGroup.add(fastonSwOut);

    // Live jumper from IEC inlet to Rocker Switch
    addWireRun([
      new THREE.Vector3(-1.42, 0.45, 2.35),
      new THREE.Vector3(-1.16, 0.47, 2.30),
      new THREE.Vector3(-0.92, 0.45, 2.35),
    ], 0.012, MAT_WIRE_BLACK, 'Wire_AC_Live_InletToSwitch');

    // Switched Live from Rocker Switch along inner SMPS gutter to Barrier Terminal 1 (-1.265, 0.42, 0.32)
    addWireRun([
      new THREE.Vector3(-0.86, 0.45, 2.35),
      new THREE.Vector3(-0.70, FLOOR_Y + 0.04, 2.10),
      new THREE.Vector3(-0.70, FLOOR_Y + 0.04, 0.22),
      new THREE.Vector3(-1.265, FLOOR_Y + 0.06, 0.22),
      new THREE.Vector3(-1.265, 0.42, 0.30),
    ], 0.012, MAT_WIRE_BLACK, 'Wire_AC_Live_SwitchToSMPS');

    // Neutral from IEC inlet along inner SMPS gutter to Barrier Terminal 2 (-1.223, 0.42, 0.32)
    addWireRun([
      new THREE.Vector3(-1.36, 0.45, 2.35),
      new THREE.Vector3(-0.74, FLOOR_Y + 0.05, 2.12),
      new THREE.Vector3(-0.74, FLOOR_Y + 0.05, 0.24),
      new THREE.Vector3(-1.223, FLOOR_Y + 0.06, 0.24),
      new THREE.Vector3(-1.223, 0.42, 0.30),
    ], 0.012, MAT_WIRE_WHITE, 'Wire_AC_Neutral_InletToSMPS');

    // Solid brass M4 chassis earth grounding stud bolted to baseplate
    const groundStud = new THREE.Mesh(
      new THREE.CylinderGeometry(0.020, 0.020, 0.04, 16),
      MAT_BRASS_FITTING
    );
    groundStud.name = 'Fastener_GroundLug_M4';
    groundStud.position.set(-1.05, FLOOR_Y + 0.02, 2.15);
    this.wiringGroup.add(groundStud);

    const groundLugRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.024, 0.007, 8, 16),
      MAT_BRASS_FITTING
    );
    groundLugRing.rotation.x = Math.PI / 2;
    groundLugRing.position.set(-1.05, FLOOR_Y + 0.025, 2.15);
    this.wiringGroup.add(groundLugRing);

    // Earth ground lead from IEC inlet + Rear Ground Binding Post to chassis stud, then to SMPS Terminal 3 (-1.181)
    addWireRun([
      new THREE.Vector3(-1.40, 0.40, 2.35),
      new THREE.Vector3(-1.25, FLOOR_Y + 0.03, 2.22),
      new THREE.Vector3(-1.05, FLOOR_Y + 0.025, 2.15),
      new THREE.Vector3(-0.66, FLOOR_Y + 0.03, 1.95),
      new THREE.Vector3(-0.66, FLOOR_Y + 0.03, 0.26),
      new THREE.Vector3(-1.181, FLOOR_Y + 0.06, 0.26),
      new THREE.Vector3(-1.181, 0.42, 0.30),
    ], 0.013, MAT_WIRE_GREEN_YELLOW, 'Wire_AC_Earth_ChassisToSMPS');

    // Insulated spade fork crimp terminals at SMPS Barrier Strip (Positions 1..6)
    const barrierX = [-1.265, -1.223, -1.181, -1.139, -1.097, -1.055];
    barrierX.forEach((bx, idx) => {
      const spade = createSpadeCrimpTerminal(idx === 3 ? MAT_CRIMP_RED : MAT_CRIMP_BLUE);
      spade.position.set(bx, 0.42, 0.30);
      this.wiringGroup.add(spade);
    });

    // -------------------------------------------------------------
    // 2. SMPS TO MOTHERBOARD REGULATED DC POWER BUS HARNESS (+24V, +12V, GND)
    // Passes cleanly through Grommet_Bulkhead_Power at (-0.95, 0.30, 0.0) to Header_DC_Power (-1.44, 0.28, -0.89)
    // -------------------------------------------------------------
    addWireRun([
      new THREE.Vector3(-1.139, 0.42, 0.30),
      new THREE.Vector3(-1.10, FLOOR_Y + 0.06, 0.15),
      new THREE.Vector3(-0.97, FLOOR_Y + 0.06, 0.00),
      new THREE.Vector3(-1.20, FLOOR_Y + 0.05, -0.45),
      new THREE.Vector3(-1.44, FLOOR_Y + 0.04, -0.85),
    ], 0.014, MAT_WIRE_RED, 'Harness_DC_24V');

    addWireRun([
      new THREE.Vector3(-1.097, 0.42, 0.30),
      new THREE.Vector3(-1.06, FLOOR_Y + 0.05, 0.15),
      new THREE.Vector3(-0.95, FLOOR_Y + 0.05, 0.00),
      new THREE.Vector3(-1.18, FLOOR_Y + 0.04, -0.45),
      new THREE.Vector3(-1.44, FLOOR_Y + 0.04, -0.85),
    ], 0.012, MAT_WIRE_YELLOW, 'Harness_DC_12V');

    addWireRun([
      new THREE.Vector3(-1.055, 0.42, 0.30),
      new THREE.Vector3(-1.02, FLOOR_Y + 0.04, 0.15),
      new THREE.Vector3(-0.93, FLOOR_Y + 0.04, 0.00),
      new THREE.Vector3(-1.16, FLOOR_Y + 0.03, -0.45),
      new THREE.Vector3(-1.44, FLOOR_Y + 0.04, -0.85),
    ], 0.014, MAT_WIRE_BLACK, 'Harness_DC_GND');

    const plugDCPower = createJSTMatingPlug(4);
    plugDCPower.name = 'Plug_DC_Power_4Pin';
    plugDCPower.position.set(-1.44, FLOOR_Y + 0.04, -0.89);
    plugDCPower.rotation.y = Math.PI;
    this.wiringGroup.add(plugDCPower);

    // -------------------------------------------------------------
    // 3. 80mm CONVECTIVE EXHAUST FAN 3-PIN PWM/TACH CABLE
    // -------------------------------------------------------------
    const plugFanHub = createJSTMatingPlug(3);
    plugFanHub.name = 'Plug_Fan_MotorFrame';
    plugFanHub.position.set(-1.12, 0.85, 2.20);
    this.wiringGroup.add(plugFanHub);

    addWireRun([
      new THREE.Vector3(-1.12, 0.85, 2.20),
      new THREE.Vector3(-0.62, FLOOR_Y + 0.05, 1.95),
      new THREE.Vector3(-0.62, FLOOR_Y + 0.05, 0.35),
      new THREE.Vector3(-0.95, FLOOR_Y + 0.05, 0.00),
      new THREE.Vector3(-1.30, FLOOR_Y + 0.04, -0.85),
    ], 0.012, MAT_WIRE_BLACK, 'Cable_CoolingFan_12V');

    const plugFanMB = createJSTMatingPlug(3);
    plugFanMB.name = 'Plug_Fan_Motherboard';
    plugFanMB.position.set(-1.30, FLOOR_Y + 0.04, -0.89);
    plugFanMB.rotation.y = Math.PI;
    this.wiringGroup.add(plugFanMB);

    // -------------------------------------------------------------
    // 4. HeNe LASER HIGH-VOLTAGE ANODE LEAD WITH GENUINE ALDEN CONNECTOR
    // From Motherboard Module_HeNe_Inverter (-0.88, 0.33, -1.67) to HeNe Laser Anode (1.67, 0.54, 2.04)
    // -------------------------------------------------------------
    addWireRun([
      new THREE.Vector3(-0.88, FLOOR_Y + 0.08, -1.67),
      new THREE.Vector3(-0.48, FLOOR_Y + 0.06, -1.55),
      new THREE.Vector3(-0.48, FLOOR_Y + 0.06, 0.00),
      new THREE.Vector3(-0.15, FLOOR_Y + 0.06, 1.85),
      new THREE.Vector3(1.45, FLOOR_Y + 0.14, 2.04),
      new THREE.Vector3(1.67, 0.54, 2.04),
    ], 0.015, MAT_WIRE_RED, 'Cable_HeNe_HighVoltage_Anode');

    const plugAlden = createAldenHVConnector();
    plugAlden.name = 'Plug_Alden_HV_Laser';
    plugAlden.position.set(1.67, 0.54, 2.04);
    plugAlden.rotation.y = Math.PI / 2;
    this.wiringGroup.add(plugAlden);

    // -------------------------------------------------------------
    // 5. MOVING MIRROR VOICE-COIL & EVER-GLO IR SOURCE DRIVE HARNESSES
    // -------------------------------------------------------------
    const plugVoiceCoilMB = createJSTMatingPlug(2);
    plugVoiceCoilMB.name = 'Plug_VoiceCoil_Motherboard';
    plugVoiceCoilMB.position.set(-1.18, FLOOR_Y + 0.04, -0.89);
    plugVoiceCoilMB.rotation.y = Math.PI;
    this.wiringGroup.add(plugVoiceCoilMB);

    addWireRun([
      new THREE.Vector3(-1.18, FLOOR_Y + 0.04, -0.85),
      new THREE.Vector3(-0.92, FLOOR_Y + 0.05, 0.00),
      new THREE.Vector3(-0.20, FLOOR_Y + 0.05, 0.45),
      new THREE.Vector3(0.94, 0.64, 0.54),
    ], 0.013, MAT_WIRE_RED, 'Cable_VoiceCoil_Drive');

    const plugIRSourceMB = createJSTMatingPlug(2);
    plugIRSourceMB.name = 'Plug_IRSource_Motherboard';
    plugIRSourceMB.position.set(-1.06, FLOOR_Y + 0.04, -0.89);
    plugIRSourceMB.rotation.y = Math.PI;
    this.wiringGroup.add(plugIRSourceMB);

    addWireRun([
      new THREE.Vector3(-1.06, FLOOR_Y + 0.04, -0.85),
      new THREE.Vector3(-0.90, FLOOR_Y + 0.05, 0.00),
      new THREE.Vector3(-0.25, FLOOR_Y + 0.05, 1.55),
      new THREE.Vector3(0.44, 0.55, 1.84),
    ], 0.014, MAT_WIRE_YELLOW, 'Cable_IRSource_1200C');

    // -------------------------------------------------------------
    // 6. LOW-NOISE SHIELDED DTGS DETECTOR COAXIAL CABLE WITH GOLD SMA PLUGS
    // -------------------------------------------------------------
    const smaDTGSPlug = createSMAPlugMale();
    smaDTGSPlug.name = 'Plug_SMA_DTGS';
    smaDTGSPlug.position.set(1.74, 0.75, 0.44);
    smaDTGSPlug.rotation.z = Math.PI / 2;
    this.wiringGroup.add(smaDTGSPlug);

    addWireRun([
      new THREE.Vector3(1.74, 0.75, 0.44),
      new THREE.Vector3(1.74, FLOOR_Y + 0.05, 0.25),
      new THREE.Vector3(0.10, FLOOR_Y + 0.05, 0.15),
      new THREE.Vector3(-0.56, FLOOR_Y + 0.05, 0.00),
      new THREE.Vector3(-0.56, FLOOR_Y + 0.055, -1.01),
      new THREE.Vector3(-0.66, FLOOR_Y + 0.055, -1.01),
    ], 0.014, MAT_WIRE_COAX, 'Cable_DTGS_Detector_RG174');

    const smaMBPlug = createSMAPlugMale();
    smaMBPlug.name = 'Plug_SMA_Motherboard';
    smaMBPlug.position.set(-0.66, FLOOR_Y + 0.055, -1.01);
    this.wiringGroup.add(smaMBPlug);

    // -------------------------------------------------------------
    // 7. ATR LOAD-CELL FORCE TRANSDUCER TELEMETRY HARNESS
    // -------------------------------------------------------------
    const plugLoadCellSensor = createJSTMatingPlug(3);
    plugLoadCellSensor.position.set(0.89, FLOOR_Y + 0.04, -0.54);
    plugLoadCellSensor.rotation.y = -Math.PI / 2;
    this.wiringGroup.add(plugLoadCellSensor);

    addWireRun([
      new THREE.Vector3(0.89, FLOOR_Y + 0.04, -0.54),
      new THREE.Vector3(0.15, FLOOR_Y + 0.04, -0.65),
      new THREE.Vector3(-0.45, FLOOR_Y + 0.04, -1.45),
      new THREE.Vector3(-0.66, FLOOR_Y + 0.04, -1.45),
    ], 0.012, MAT_WIRE_BLUE, 'Cable_ATR_LoadCell');

    const plugLoadCellMB = createJSTMatingPlug(3);
    plugLoadCellMB.position.set(-0.68, FLOOR_Y + 0.04, -1.45);
    plugLoadCellMB.rotation.y = -Math.PI / 2;
    this.wiringGroup.add(plugLoadCellMB);

    // -------------------------------------------------------------
    // 8. TOUCHSCREEN CONSOLE FLEXIBLE FLAT CABLE (KAPTON FPC RIBBON)
    // Vertical run from Motherboard Socket_FPC_ZIF_MB (-1.10, 0.28, -1.79)
    // straight up to LCD Controller Sub-Board Socket_FPC_ZIF_LCD (-1.09, 1.56, -1.35)
    // -------------------------------------------------------------
    const fpcPoints = [
      new THREE.Vector3(-1.10, FLOOR_Y + 0.04, -1.79),
      new THREE.Vector3(-1.10, FLOOR_Y + 0.35, -1.85),
      new THREE.Vector3(-1.10, 1.05, -1.65),
      new THREE.Vector3(-1.09, 1.55, -1.32),
    ];
    const fpcCurve = new THREE.CatmullRomCurve3(fpcPoints, false, 'centripetal');
    const fpcGeo = new THREE.TubeGeometry(fpcCurve, 32, 0.032, 4, false);
    const fpcMesh = new THREE.Mesh(fpcGeo, MAT_FPC_KAPTON);
    fpcMesh.name = 'FPC_TouchscreenRibbon_Kapton';
    this.wiringGroup.add(fpcMesh);

    // -------------------------------------------------------------
    // 9. REAR DB-9 RS-232, USB 2.0, AND RJ45 ETHERNET DATA CABLES
    // Routed through Grommet_Bulkhead_Data at (-0.58, 0.30, 0.0)
    // -------------------------------------------------------------
    const idcDB9Rear = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, 0.04), MAT_CHASSIS_DARK);
    idcDB9Rear.position.set(0.40, 0.45, 2.34);
    this.wiringGroup.add(idcDB9Rear);

    addWireRun([
      new THREE.Vector3(0.40, 0.45, 2.34),
      new THREE.Vector3(0.40, FLOOR_Y + 0.05, 2.15),
      new THREE.Vector3(-0.56, FLOOR_Y + 0.05, 2.00),
      new THREE.Vector3(-0.56, FLOOR_Y + 0.05, 0.00),
      new THREE.Vector3(-0.92, FLOOR_Y + 0.04, -0.85),
    ], 0.016, MAT_WIRE_BLUE, 'Harness_DB9_RS232');

    const idcDB9MB = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.040, 0.05), MAT_CHASSIS_DARK);
    idcDB9MB.position.set(-0.92, FLOOR_Y + 0.04, -0.89);
    this.wiringGroup.add(idcDB9MB);

    // USB 2.0 Shielded Cable
    addWireRun([
      new THREE.Vector3(0.00, 0.45, 2.34),
      new THREE.Vector3(0.00, FLOOR_Y + 0.05, 2.12),
      new THREE.Vector3(-0.58, FLOOR_Y + 0.04, 1.95),
      new THREE.Vector3(-0.58, FLOOR_Y + 0.04, 0.00),
      new THREE.Vector3(-0.78, FLOOR_Y + 0.04, -0.85),
    ], 0.015, MAT_WIRE_BLACK, 'Harness_USB_Shielded');

    const plugUSBMB = createJSTMatingPlug(5);
    plugUSBMB.name = 'Plug_USB_Motherboard';
    plugUSBMB.position.set(-0.78, FLOOR_Y + 0.04, -0.89);
    plugUSBMB.rotation.y = Math.PI;
    this.wiringGroup.add(plugUSBMB);

    // RJ45 Gigabit Ethernet Cable
    addWireRun([
      new THREE.Vector3(-0.35, 0.45, 2.34),
      new THREE.Vector3(-0.35, FLOOR_Y + 0.06, 2.08),
      new THREE.Vector3(-0.60, FLOOR_Y + 0.06, 1.90),
      new THREE.Vector3(-0.60, FLOOR_Y + 0.06, 0.00),
      new THREE.Vector3(-0.52, FLOOR_Y + 0.05, -1.15),
      new THREE.Vector3(-0.66, FLOOR_Y + 0.04, -1.15),
    ], 0.016, MAT_WIRE_BLUE, 'Harness_RJ45_Ethernet');

    const plugRJ45MB = createJSTMatingPlug(8);
    plugRJ45MB.name = 'Plug_RJ45_Motherboard';
    plugRJ45MB.position.set(-0.68, FLOOR_Y + 0.04, -1.15);
    plugRJ45MB.rotation.y = -Math.PI / 2;
    this.wiringGroup.add(plugRJ45MB);

    // -------------------------------------------------------------
    // 10. GENUINE NYLON CHASSIS CABLE P-CLIPS BOLTED TO BASEPLATE
    // -------------------------------------------------------------
    addCableClip(new THREE.Vector3(-0.68, FLOOR_Y + 0.01, 1.85));
    addCableClip(new THREE.Vector3(-0.68, FLOOR_Y + 0.01, 1.15));
    addCableClip(new THREE.Vector3(-0.68, FLOOR_Y + 0.01, 0.45));
    addCableClip(new THREE.Vector3(-0.58, FLOOR_Y + 0.01, -0.35));
    addCableClip(new THREE.Vector3(-1.18, FLOOR_Y + 0.01, -0.45));
    addCableClip(new THREE.Vector3(0.05, FLOOR_Y + 0.01, 2.08), Math.PI / 2);
    addCableClip(new THREE.Vector3(0.45, FLOOR_Y + 0.01, 0.15), Math.PI / 2);
    addCableClip(new THREE.Vector3(0.15, FLOOR_Y + 0.01, -0.65), Math.PI / 2);

    this.chassisBaseGroup.add(this.wiringGroup);
  }


  // ==========================================
  // Sloped Console & Dynamic 7-Inch LCD (UI_LCD)
  // (Mounted flush on top surface of solid console wedge)
  // ==========================================
  buildSlopedConsoleAndLCD() {
    const slopeAngle = Math.atan2(0.66, 2.38); // ~0.270 rad (~15.5°)

    this.consoleGroup.position.set(-1.09, 1.71, -1.19);
    this.consoleGroup.rotation.x = -slopeAngle; // Tilts face up and forward toward operator

    // Recessed Console Pocket Tray
    const bezelTray = new THREE.Mesh(
      new THREE.BoxGeometry(1.92, 0.035, 1.64),
      MAT_BEZEL
    );
    bezelTray.position.set(0, 0.015, 0);
    bezelTray.castShadow = true;
    bezelTray.receiveShadow = true;
    this.consoleGroup.add(bezelTray);

    // Brushed Champagne / Chrome Perimeter Reveal Trim framing console
    const trimW = 0.022;
    const trimH = 0.028;
    const edgeTop = new THREE.Mesh(new THREE.BoxGeometry(1.92 + trimW * 2, trimH, trimW), MAT_CHROME);
    edgeTop.position.set(0, 0.022, 1.64 / 2 + trimW / 2);
    this.consoleGroup.add(edgeTop);

    const edgeBot = new THREE.Mesh(new THREE.BoxGeometry(1.92 + trimW * 2, trimH, trimW), MAT_CHROME);
    edgeBot.position.set(0, 0.022, -1.64 / 2 - trimW / 2);
    this.consoleGroup.add(edgeBot);

    const edgeLeft = new THREE.Mesh(new THREE.BoxGeometry(trimW, trimH, 1.64), MAT_CHROME);
    edgeLeft.position.set(-1.92 / 2 - trimW / 2, 0.022, 0);
    this.consoleGroup.add(edgeLeft);

    const edgeRight = new THREE.Mesh(new THREE.BoxGeometry(trimW, trimH, 1.64), MAT_CHROME);
    edgeRight.position.set(1.92 / 2 + trimW / 2, 0.022, 0);
    this.consoleGroup.add(edgeRight);

    // Dedicated 16:9 7-inch LCD Display Quad (UI_LCD)
    this.lcdTexture = new THREE.CanvasTexture(this.lcdCanvas);
    this.lcdTexture.flipY = false;
    this.lcdTexture.minFilter = THREE.LinearFilter;
    this.lcdTexture.magFilter = THREE.LinearFilter;

    const lcdW = 1.68;
    const lcdH = 0.98;
    const lcdGeo = new THREE.PlaneGeometry(lcdW, lcdH);
    const uvAttr = lcdGeo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setX(i, 1.0 - uvAttr.getX(i));
    }
    uvAttr.needsUpdate = true;

    const screenMat = new THREE.MeshBasicMaterial({ map: this.lcdTexture, side: THREE.DoubleSide });
    this.lcdScreen = new THREE.Mesh(lcdGeo, screenMat);
    this.lcdScreen.name = 'UI_LCD';
    this.lcdScreen.rotation.x = -Math.PI / 2; // Lies flat on top face of tilted tray
    this.lcdScreen.position.set(0, 0.036, 0.16);
    this.lcdScreen.userData = {
      name: 'UI_LCD',
      action: 'tap_screen',
      role: 'Touchscreen',
      tooltip: 'FTIR Capacitive Touchscreen (Seek wavenumber cursor or tap softkeys)'
    };
    this.actionableMeshes.push(this.lcdScreen);
    this.animTargets.lcdMesh = this.lcdScreen;
    this.consoleGroup.add(this.lcdScreen);

    // Protective Anti-Reflective Optical Glass Lens over LCD
    // (Not added to actionableMeshes so raycasts hit UI_LCD directly with exact calibrated UVs)
    const lensGeo = new THREE.PlaneGeometry(lcdW, lcdH);
    const lens = new THREE.Mesh(lensGeo, MAT_OPTICAL_GLASS);
    lens.name = 'UI_LCD_LENS';
    lens.rotation.x = -Math.PI / 2;
    lens.position.set(0, 0.040, 0.16);
    this.consoleGroup.add(lens);

    // Internal LCD Controller Sub-Board & Backlight Driver PCB (Mounted on underside of bezel)
    const lcdDriverPCB = new THREE.Mesh(
      new THREE.BoxGeometry(1.52, 0.012, 0.86),
      MAT_PCB_GREEN
    );
    lcdDriverPCB.name = 'PCB_LCD_Controller';
    lcdDriverPCB.position.set(0, -0.042, 0.16);
    this.consoleGroup.add(lcdDriverPCB);

    // 4 Brass Standoffs with M3 Hex Screws securing LCD Controller PCB to console tray
    for (const sx of [-0.68, 0.68]) {
      for (const sz of [-0.36, 0.36]) {
        const standoff = new THREE.Mesh(
          new THREE.CylinderGeometry(0.014, 0.014, 0.038, 6),
          MAT_BRASS_FITTING
        );
        standoff.position.set(sx, -0.020, 0.16 + sz);
        this.consoleGroup.add(standoff);

        const screw = createHexSocketScrew(0.010, 0.018, { material: MAT_CHROME });
        screw.rotation.x = Math.PI;
        screw.position.set(sx, -0.049, 0.16 + sz);
        this.consoleGroup.add(screw);
      }
    }

    // 30-Pin FPC ZIF Socket on underside of LCD Controller Board receiving Kapton ribbon
    const lcdZIF = createFPCZIFConnector(0.18);
    lcdZIF.name = 'Socket_FPC_ZIF_LCD';
    lcdZIF.position.set(0.0, -0.050, -0.18);
    lcdZIF.rotation.x = Math.PI;
    this.consoleGroup.add(lcdZIF);

    // 5 Physical Tactile Push Buttons below Screen on console face
    // Ordered LEFT (+X) to RIGHT (-X) from operator's front perspective!
    const buttons = [
      { id: 'Btn_Power', name: 'Btn_Power', label: 'POWER', sub: 'STANDBY', icon: '⏻', color: '#f43f5e', x: 0.64, action: 'btn_pwr' },
      { id: 'Btn_Background', name: 'Btn_Background', label: 'BG', sub: 'AIR REF', icon: '0.00', color: '#0284c7', x: 0.32, action: 'btn_bg' },
      { id: 'Btn_Scan', name: 'Btn_Scan', label: 'SCAN', sub: 'SAMPLE', icon: '▶', color: '#a855f7', x: 0.0, action: 'btn_scan' },
      { id: 'Btn_Mode', name: 'Btn_Mode', label: 'MODE', sub: '%T / ABS', icon: '⇄', color: '#06b6d4', x: -0.32, action: 'btn_mode' },
      { id: 'Btn_Tower', name: 'Btn_Tower', label: 'TOWER', sub: 'SWIVEL', icon: '↷', color: '#f59e0b', x: -0.64, action: 'btn_tower' },
    ];

    buttons.forEach((bCfg) => {
      const keyItem = createLabeledKeycap(bCfg);
      keyItem.group.position.set(bCfg.x, 0.024, -0.52);
      this.actionableMeshes.push(keyItem.group);
      this.actionableMeshes.push(keyItem.cap);
      this.actionableMeshes.push(keyItem.labelMesh);
      this.consoleGroup.add(keyItem.group);
      this.animTargets.keycaps[bCfg.id] = keyItem.capGroup;
      this.animTargets.keycaps[bCfg.action] = keyItem.capGroup;
    });

    this.chassisShellGroup.add(this.consoleGroup);
  }

  // ==========================================
  // Optical Ray Paths & Interferometer Visualization
  // ==========================================
  buildOpticalRayPaths() {
    const points = [
      new THREE.Vector3(0.44, 0.48, 1.84),   // Ever-Glo emitter
      new THREE.Vector3(0.94, 0.48, 1.19),   // KBr Beamsplitter
      new THREE.Vector3(1.59, 0.48, 1.19),   // Fixed Gold Mirror
      new THREE.Vector3(0.94, 0.48, 1.19),   // Return to BS
      new THREE.Vector3(0.94, 0.48, 0.54),   // Moving Voice-Coil Mirror
      new THREE.Vector3(0.94, 0.48, 1.19),   // Recombined at BS
      new THREE.Vector3(0.94, 0.48, -1.19),  // ATR Input ZnSe Mirror
      new THREE.Vector3(1.09, 0.94, -1.19),  // ATR Diamond bottom facet
      new THREE.Vector3(1.45, 0.48, -1.19),  // ATR Output ZnSe Mirror
      new THREE.Vector3(1.74, 0.48, 0.44),   // DTGS Pyroelectric detector
    ];

    const curve = new THREE.CatmullRomCurve3(points);
    const rayGeo = new THREE.TubeGeometry(curve, 64, 0.016, 8, false);
    this.rayMesh = new THREE.Mesh(
      rayGeo,
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.78 })
    );
    this.rayMesh.name = 'Beam_IR_Modulated';
    this.raysGroup.add(this.rayMesh);

    // HeNe Laser Reference Beam (632.8 nm Red Ray)
    const henePoints = [
      new THREE.Vector3(1.19, 0.38, 2.04),
      new THREE.Vector3(0.94, 0.38, 1.19),
      new THREE.Vector3(0.94, 0.33, 1.44),
    ];
    const heneCurve = new THREE.CatmullRomCurve3(henePoints);
    const heneGeo = new THREE.TubeGeometry(heneCurve, 24, 0.008, 8, false);
    const heneRay = new THREE.Mesh(heneGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    heneRay.name = 'Beam_HeNe_632nm';
    this.raysGroup.add(heneRay);

    this.chassisBaseGroup.add(this.raysGroup);
  }

  // ==========================================
  // Dynamic Canvas LCD Screen Rendering
  // ==========================================
  renderLCD() {
    const ctx = this.lcdCtx;
    const w = this.lcdCanvas.width;
    const h = this.lcdCanvas.height;
    const now = performance.now();

    // Unpowered blackout state
    if (!this.hasPower) {
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, w, h);
      this.lcdTexture.needsUpdate = true;
      return;
    }

    // Modern laboratory dark LCD background
    ctx.fillStyle = '#070c14';
    ctx.fillRect(0, 0, w, h);

    // ==========================================
    // 1. Top Status Header Bar (Y: 0 - 54)
    // ==========================================
    const headGrad = ctx.createLinearGradient(0, 0, 0, 54);
    headGrad.addColorStop(0, '#0f172a');
    headGrad.addColorStop(1, '#090e17');
    ctx.fillStyle = headGrad;
    ctx.fillRect(0, 0, w, 54);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 54);
    ctx.lineTo(w, 54);
    ctx.stroke();

    // Brand logo
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('SREdesigns', 20, 27);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('FTIR-7000x', 145, 27);

    // System state pill
    let stateColor = '#22c55e';
    let stateText = 'SYSTEM READY';
    if (this.isScanning) {
      stateColor = '#c084fc';
      stateText = `SCANNING [${Math.floor(this.scanProgress * 100)}%]`;
    }
    ctx.fillStyle = stateColor;
    ctx.beginPath();
    ctx.arc(310, 27, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = stateColor;
    ctx.fillText(stateText, 324, 27);

    // Laser & Purge Hardware Status
    ctx.font = '600 13px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('HeNe: 632.8nm LOCKED', 510, 27);
    ctx.fillStyle = '#64748b';
    ctx.fillText('|', 685, 27);
    ctx.fillStyle = '#10b981';
    ctx.fillText('N₂ PURGE: OK', 700, 27);

    // Wavenumber cursor readout
    ctx.textAlign = 'right';
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`ν: ${this.cursorWn.toFixed(0)} cm⁻¹`, 1005, 27);

    // ==========================================
    // 2. Main Mid-IR Spectrum Chart (X: 65-835, Y: 68-498)
    // ==========================================
    const chartX = 65;
    const chartY = 68;
    const chartW = 770;
    const chartH = 430;

    // Chart Background
    ctx.fillStyle = '#050a12';
    ctx.fillRect(chartX, chartY, chartW, chartH);
    ctx.strokeStyle = '#1e2d42';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(chartX, chartY, chartW, chartH);

    // Grid lines & Wavenumber X-axis calibration (4000 to 400 cm⁻¹)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const wnTicks = [4000, 3500, 3000, 2500, 2000, 1500, 1000, 500];
    wnTicks.forEach((wn) => {
      const frac = (4000 - wn) / 3600;
      const x = chartX + frac * chartW;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartH);
      ctx.stroke();
      ctx.fillText(wn.toString(), x, chartY + chartH + 5);
    });

    // Y-axis calibration (% Transmittance or Absorbance)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const yTicks = (this.viewMode === 'transmittance')
      ? [100, 75, 50, 25, 0]
      : [0.0, 0.5, 1.0, 1.5, 2.0];
    yTicks.forEach((val, i) => {
      const y = chartY + (i / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartW, y);
      ctx.stroke();
      ctx.fillText(val.toString() + (this.viewMode === 'transmittance' ? '%' : ''), chartX - 8, y);
    });

    // Chemical Absorption Band Models
    const analyteBands = {
      isopropanol: [
        { wn: 3350, fwhm: 260, depth: 0.85, name: 'O-H STRETCH (BROAD H-BOND)' },
        { wn: 2970, fwhm: 80, depth: 0.72, name: 'C-H ALKYL STRETCH (sp³)' },
        { wn: 1381, fwhm: 50, depth: 0.60, name: 'GEM-DIMETHYL DOUBLET' },
        { wn: 1129, fwhm: 60, depth: 0.90, name: 'C-O SEC-ALCOHOL STRETCH' },
      ],
      acetone: [
        { wn: 1715, fwhm: 70, depth: 0.94, name: 'C=O CARBONYL STRETCH (STRONG)' },
        { wn: 1362, fwhm: 45, depth: 0.55, name: 'CH₃ SYMMETRIC BEND' },
        { wn: 1222, fwhm: 55, depth: 0.70, name: 'C-C SKELETAL VIBRATION' },
      ],
      toluene: [
        { wn: 3028, fwhm: 65, depth: 0.65, name: 'AROMATIC C-H STRETCH' },
        { wn: 1604, fwhm: 40, depth: 0.58, name: 'AROMATIC RING C=C' },
        { wn: 1495, fwhm: 45, depth: 0.62, name: 'RING QUADRANT STRETCH' },
        { wn: 728, fwhm: 50, depth: 0.92, name: 'ORTHO/META/PARA OUT-OF-PLANE' },
      ],
      polystyrene: [
        { wn: 3026, fwhm: 50, depth: 0.68, name: 'AROMATIC C-H STRETCH' },
        { wn: 1601, fwhm: 35, depth: 0.74, name: 'BENZENE RING STRETCH' },
        { wn: 1492, fwhm: 40, depth: 0.70, name: 'RING SEMICIRCLE STRETCH' },
        { wn: 1452, fwhm: 40, depth: 0.65, name: 'CH₂ SCISSORING' },
        { wn: 1028, fwhm: 35, depth: 0.55, name: 'IN-PLANE C-H BEND' },
        { wn: 698, fwhm: 45, depth: 0.92, name: 'MONOSUBSTITUTED RING OOP' },
      ],
      benzoic_acid: [
        { wn: 2850, fwhm: 400, depth: 0.75, name: 'DIMER O-H FERMI ENVELOPE' },
        { wn: 1685, fwhm: 60, depth: 0.92, name: 'CONJUGATED CARBOXYLIC C=O' },
        { wn: 1290, fwhm: 55, depth: 0.78, name: 'C-O CARBOXYL STRETCH' },
        { wn: 708, fwhm: 50, depth: 0.85, name: 'MONOSUBSTITUTED RING BEND' },
      ]
    };

    const bands = analyteBands[this.activeSampleId] || analyteBands.isopropanol;

    // Helper to compute curve absorbance at any wavenumber
    const getAbsorbAtWn = (wn) => {
      let absorb = 0.035;
      absorb += Math.sin(wn * 0.08) * 0.003;
      bands.forEach((b) => {
        const diff = wn - b.wn;
        absorb += b.depth * Math.exp(-(diff * diff) / (2 * (b.fwhm / 2.355) ** 2));
      });
      return absorb;
    };

    // Plot points
    const points = [];
    for (let px = 0; px <= chartW; px += 2) {
      const wn = 4000 - (px / chartW) * 3600;
      const absorb = getAbsorbAtWn(wn);
      let yNorm = (this.viewMode === 'transmittance')
        ? Math.max(0.04, 1.0 - absorb)
        : Math.min(2.0, absorb * 1.5) / 2.0;

      const yPx = (this.viewMode === 'transmittance')
        ? chartY + (1.0 - yNorm) * chartH
        : chartY + chartH - yNorm * chartH;

      points.push({ x: chartX + px, y: yPx });
    }

    // Subtle area gradient fill beneath curve
    const areaGrad = ctx.createLinearGradient(0, chartY, 0, chartY + chartH);
    if (this.viewMode === 'transmittance') {
      areaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      areaGrad.addColorStop(1, 'rgba(56, 189, 248, 0.00)');
    } else {
      areaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.00)');
      areaGrad.addColorStop(1, 'rgba(56, 189, 248, 0.18)');
    }
    ctx.fillStyle = areaGrad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    if (this.viewMode === 'transmittance') {
      ctx.lineTo(chartX + chartW, chartY);
      ctx.lineTo(chartX, chartY);
    } else {
      ctx.lineTo(chartX + chartW, chartY + chartH);
      ctx.lineTo(chartX, chartY + chartH);
    }
    ctx.closePath();
    ctx.fill();

    // Draw spectrum line with smooth anti-aliasing
    ctx.strokeStyle = this.isScanning ? '#c084fc' : '#38bdf8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // ==========================================
    // Interactive Peak Cursor & Callout
    // ==========================================
    const cursorFrac = Math.max(0, Math.min(1, (4000 - this.cursorWn) / 3600));
    const cursorX = chartX + cursorFrac * chartW;
    const cursorAbsorb = getAbsorbAtWn(this.cursorWn);
    const cursorYNorm = (this.viewMode === 'transmittance')
      ? Math.max(0.04, 1.0 - cursorAbsorb)
      : Math.min(2.0, cursorAbsorb * 1.5) / 2.0;
    const cursorY = (this.viewMode === 'transmittance')
      ? chartY + (1.0 - cursorYNorm) * chartH
      : chartY + chartH - cursorYNorm * chartH;

    // Dashed vertical cursor line
    ctx.save();
    ctx.strokeStyle = '#00d4e8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cursorX, chartY);
    ctx.lineTo(cursorX, chartY + chartH);
    ctx.stroke();
    ctx.restore();

    // Target pip on curve
    ctx.fillStyle = '#00d4e8';
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Find closest diagnostic chemical band
    let closestBand = null;
    let minDiff = Infinity;
    bands.forEach(b => {
      const diff = Math.abs(b.wn - this.cursorWn);
      if (diff < b.fwhm && diff < minDiff) {
        minDiff = diff;
        closestBand = b;
      }
    });

    const calloutText = closestBand
      ? `${closestBand.name} (${closestBand.wn} cm⁻¹)`
      : `${(this.cursorWn).toFixed(0)} cm⁻¹ | ${(cursorYNorm * 100).toFixed(1)}% T`;

    // Tooltip Callout Box
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const textW = ctx.measureText(calloutText).width;
    const calloutW = textW + 24;
    const calloutH = 28;
    let calloutBoxX = cursorX - calloutW / 2;
    if (calloutBoxX < chartX + 10) calloutBoxX = chartX + 10;
    if (calloutBoxX + calloutW > chartX + chartW - 10) calloutBoxX = chartX + chartW - calloutW - 10;
    const calloutBoxY = Math.max(chartY + 12, cursorY - 42);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = '#00d4e8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(calloutBoxX, calloutBoxY, calloutW, calloutH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(calloutText, calloutBoxX + calloutW / 2, calloutBoxY + calloutH / 2);

    // Chart Footer Metadata
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.fillText(`ANALYTE: ${this.activeSampleId.toUpperCase()} | MODE: ${this.viewMode.toUpperCase()} | RES: 4.0 cm⁻¹ | SCANS: 16 CO-ADDED`, chartX + 10, chartY + chartH - 8);

    // ==========================================
    // 3. Right-Column Capacitive Softkeys (X: 855-1005, W: 150)
    // ==========================================
    const softkeys = [
      { id: 'soft_pwr', icon: '⏻', label: 'POWER', sub: 'STANDBY', color: '#f43f5e', y: 68 },
      { id: 'soft_bg', icon: '0.00', label: 'BG REF', sub: 'AIR BASELINE', color: '#0284c7', y: 141 },
      { id: 'soft_scan', icon: '▶', label: 'SCAN', sub: 'SAMPLE', color: '#a855f7', y: 214 },
      { id: 'soft_mode', icon: '⇄', label: '%T / ABS', sub: this.viewMode === 'transmittance' ? '% TRANS' : 'ABSORB', color: '#06b6d4', y: 287 },
      { id: 'soft_tower', icon: '↷', label: 'TOWER', sub: this.towerSwiveled ? 'OPEN 90°' : 'CLAMPED', color: '#f59e0b', y: 360 },
      { id: 'soft_clamp', icon: '⚙', label: 'CLAMP', sub: `${this.clampPressurePct}% (${(this.clampPressurePct * 1.5).toFixed(0)}N)`, color: '#10b981', y: 433 },
    ];

    softkeys.forEach((sk) => {
      const skX = 855;
      const skY = sk.y;
      const skW = 150;
      const skH = 64;

      // Softkey base gradient
      const skGrad = ctx.createLinearGradient(skX, skY, skX, skY + skH);
      skGrad.addColorStop(0, '#1e293b');
      skGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = skGrad;
      ctx.beginPath();
      ctx.roundRect(skX, skY, skW, skH, 8);
      ctx.fill();

      // Top color accent bar
      ctx.fillStyle = sk.color;
      ctx.fillRect(skX + 8, skY + 5, skW - 16, 3);

      // Border with subtle bevel
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glyph icon
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = sk.color;
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(sk.icon, skX + 14, skY + 28);

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(sk.label, skX + 46, skY + 26);

      // Subtitle
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 11px monospace';
      ctx.fillText(sk.sub, skX + 46, skY + 46);
    });

    // ==========================================
    // 4. Bottom Analyte Selector Pills (Y: 512-582, X: 65-835)
    // ==========================================
    const analytePills = [
      { id: 'isopropanol', label: 'ISOPROPANOL', sub: 'IPA 99.9%' },
      { id: 'acetone', label: 'ACETONE', sub: 'HPLC GRADE' },
      { id: 'polystyrene', label: 'POLYSTYRENE', sub: 'SRM 1921b' },
      { id: 'toluene', label: 'TOLUENE', sub: 'ANHYDROUS' },
      { id: 'benzoic_acid', label: 'BENZOIC ACID', sub: 'CRYSTALS' },
    ];

    const pillGap = 8;
    const totalPillW = chartW;
    const pillW = (totalPillW - (analytePills.length - 1) * pillGap) / analytePills.length;
    const pillH = 68;
    const pillY = 514;

    analytePills.forEach((p, idx) => {
      const pX = chartX + idx * (pillW + pillGap);
      const isActive = (this.activeSampleId === p.id);

      // Pill Background
      if (isActive) {
        const activeGrad = ctx.createLinearGradient(pX, pillY, pX, pillY + pillH);
        activeGrad.addColorStop(0, '#0284c7');
        activeGrad.addColorStop(1, '#0369a1');
        ctx.fillStyle = activeGrad;
      } else {
        ctx.fillStyle = '#0f172a';
      }
      ctx.beginPath();
      ctx.roundRect(pX, pillY, pillW, pillH, 8);
      ctx.fill();

      // Border
      ctx.strokeStyle = isActive ? '#38bdf8' : '#334155';
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.stroke();

      // Top active light indicator
      if (isActive) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(pX + 12, pillY + 4, pillW - 24, 3);
      }

      // Title & Subtitle
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillStyle = isActive ? '#ffffff' : '#cbd5e1';
      ctx.fillText(p.label, pX + pillW / 2, pillY + 28);

      ctx.font = '600 11px monospace';
      ctx.fillStyle = isActive ? '#bae6fd' : '#64748b';
      ctx.fillText(p.sub, pX + pillW / 2, pillY + 48);
    });

    // ==========================================
    // 5. Capacitive Touch Ripple Animations
    // ==========================================
    for (let i = this.touchRipples.length - 1; i >= 0; i--) {
      const rip = this.touchRipples[i];
      const age = now - rip.birth;
      if (age > 450) {
        this.touchRipples.splice(i, 1);
      } else {
        const prog = age / 450;
        const radius = 8 + prog * 48;
        const alpha = 1.0 - prog;

        // Expanding cyan ring
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        // White contact point
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    this.lcdTexture.needsUpdate = true;
  }

  // ==========================================
  // State Mutators & Kinematic Animations
  // ==========================================
  updatePowerState() {
    this.hasPower = this.isPluggedIn && this.switchOn;

    if (this.emitterMesh) {
      this.emitterMesh.material = this.hasPower ? MAT_CERAMIC_HOT : MAT_CERAMIC_OFF;
    }
    if (this.sourceLight) {
      this.sourceLight.intensity = this.hasPower ? 1.5 : 0.0;
    }
    if (this.rayMesh) {
      this.rayMesh.visible = this.hasPower;
    }
    if (this.ledPwr) {
      this.ledPwr.material = this.hasPower ? MAT_LED_GREEN : MAT_SMD_BODY;
    }
    if (this.ledAct) {
      this.ledAct.material = this.hasPower ? MAT_LED_AMBER : MAT_SMD_BODY;
    }

    this.renderLCD();
  }

  setPowerSwitch(state) {
    this.switchOn = state;
    this.updatePowerState();
  }

  togglePowerPlug() {
    this.isPluggedIn = !this.isPluggedIn;
    this.updatePowerCordCurve();
    this.updatePowerState();
  }

  setSample(sampleId) {
    this.activeSampleId = sampleId;
    this.updateSampleMesh();
    this.renderLCD();
  }

  cycleSample() {
    const list = ['isopropanol', 'acetone', 'toluene', 'polystyrene', 'benzoic_acid'];
    const idx = (list.indexOf(this.activeSampleId) + 1) % list.length;
    this.setSample(list[idx]);
  }

  cycleViewMode() {
    this.viewMode = (this.viewMode === 'transmittance') ? 'absorbance' : 'transmittance';
    this.renderLCD();
  }

  swivelTower() {
    const targetAngle = (this.towerAngle === 0.0) ? Math.PI / 2 : 0.0;
    this.towerAngle = targetAngle;
    if (this.towerGroup) {
      this.towerGroup.rotation.y = this.towerAngle;
    }
  }

  cycleClampPressure() {
    const pressures = [15.0, 30.0, 45.0, 0.0];
    const nextIdx = (pressures.indexOf(this.clampForceNewtons) + 1) % pressures.length;
    this.clampForceNewtons = pressures[nextIdx];
    if (this.torqueKnob) {
      this.torqueKnob.rotation.y += Math.PI / 3;
    }
  }

  startScan(onComplete = null) {
    if (!this.hasPower || this.isScanning) return;
    this.isScanning = true;
    this.scanProgress = 0.0;

    const interval = setInterval(() => {
      this.scanProgress += 0.02;
      this.renderLCD();

      if (this.scanProgress >= 1.0) {
        clearInterval(interval);
        this.isScanning = false;
        this.scanProgress = 0.0;
        this.renderLCD();
        if (onComplete) onComplete();
      }
    }, 40);
  }

  setExplodedView(offset) {
    this.explodedOffset = offset;
    if (this.interiorLight) {
      this.interiorLight.visible = (this.xRayMode || this.explodedOffset > 0.05);
    }
  }

  setExploded(offset) {
    this.setExplodedView(offset);
  }

  setXRayMode(enable) {
    this.xRayMode = Boolean(enable);
    this.opticsViewActive = this.xRayMode;
    this.chassisMeshes.forEach((m) => {
      m.material = this.xRayMode ? MAT_CHASSIS_GLASS : MAT_CHASSIS;
    });
    if (this.opticsRoof) {
      this.opticsRoof.visible = !this.xRayMode;
    }
    if (this.interiorLight) {
      this.interiorLight.visible = (this.xRayMode || this.explodedOffset > 0.05);
    }
  }

  setOpticsView(enable) {
    this.setXRayMode(enable);
  }

  toggleOpticsView() {
    this.setXRayMode(!this.xRayMode);
  }

  toggleSwivel() {
    this.swivelTower();
    this.towerSwiveled = (this.towerAngle !== 0.0);
    this.renderLCD();
  }

  setPressure(pct) {
    this.clampPressurePct = pct;
    this.clampForceNewtons = (pct / 100) * 45.0;
    if (this.torqueKnob) {
      this.torqueKnob.rotation.y += Math.PI / 4;
    }
    this.renderLCD();
  }

  triggerKeycapPress(keyId) {
    const cap = this.animTargets.keycaps[keyId];
    if (cap) {
      this.keycapAnims.push({
        cap,
        startTime: performance.now(),
        baseY: 0.025,
        pressY: 0.013,
        duration: 160
      });
    }
  }

  animate(time = 0) {
    requestAnimationFrame(this.animate.bind(this));
    const now = performance.now();

    // 1. Convective cooling fans rotation (80mm exhaust fan + 50mm dedicated SMPS fan)
    if (this.hasPower) {
      if (this.fanBlades) this.fanBlades.rotation.z += 0.22;
      if (this.smpsFanHub) this.smpsFanHub.rotation.z += 0.28;
    }

    // 2. Active voice-coil moving mirror scan oscillation
    if (this.hasPower && this.movingMirrorPuck) {
      const osc = Math.sin(time * 0.006) * 0.035;
      this.movingMirrorPuck.position.z = 0.20 + osc;
    }

    // 3. Smooth Two-Tier Exploded View Vertical Elevation
    // Tier 1: ATR Sampling Deck (+0.85m above baseplate, exposing ZnSe transfer mirrors & load-cell)
    if (this.atrStationGroup) {
      const baseAtrY = 0.90;
      const targetAtrY = baseAtrY + this.explodedOffset * 0.85;
      this.atrStationGroup.position.y += (targetAtrY - this.atrStationGroup.position.y) * 0.12;
    }
    // Tier 2: Upper Unibody Shroud & Sloped Console (+2.15m above baseplate)
    if (this.chassisShellGroup) {
      const targetShellY = this.explodedOffset * 2.15;
      this.chassisShellGroup.position.y += (targetShellY - this.chassisShellGroup.position.y) * 0.12;
    }

    // 4. Keycap Spring Depression Kinematics
    for (let i = this.keycapAnims.length - 1; i >= 0; i--) {
      const anim = this.keycapAnims[i];
      const elapsed = now - anim.startTime;
      if (elapsed >= anim.duration) {
        anim.cap.position.y = anim.baseY;
        this.keycapAnims.splice(i, 1);
      } else {
        const prog = elapsed / anim.duration;
        const delta = Math.sin(prog * Math.PI);
        anim.cap.position.y = anim.baseY - (anim.baseY - anim.pressY) * delta;
      }
    }

    // 5. Touchscreen Ripple Updates
    if (this.touchRipples.length > 0) {
      this.renderLCD();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

}
