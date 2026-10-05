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

const MAT_CHASSIS_GLASS = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.96,
  ior: 1.52,
  roughness: 0.02,
  transparent: true,
  opacity: 0.90,
});

const MAT_HEX_RECESS = new THREE.MeshBasicMaterial({ color: 0x0a0d14 });

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

  const capGroup = new THREE.Group();
  g.add(capGroup);

  // Keycap body (chamfered block)
  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.05, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.25 })
  );
  cap.position.y = 0.025;
  cap.castShadow = true;
  capGroup.add(cap);

  // Bezel surround collar
  const collar = new THREE.Mesh(
    new THREE.BoxGeometry(0.27, 0.02, 0.15),
    MAT_CHROME
  );
  collar.position.y = 0.01;
  g.add(collar);

  // Canvas label face
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 256, 128);

  // Indicator accent strip on top
  ctx.fillStyle = cfg.color || '#38bdf8';
  ctx.fillRect(0, 0, 256, 18);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(cfg.label, 128, 62);

  if (cfg.sub) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(cfg.sub, 128, 102);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  const labelGeo = new THREE.PlaneGeometry(0.23, 0.11);
  const uvAttr = labelGeo.attributes.uv;
  for (let i = 0; i < uvAttr.count; i++) {
    uvAttr.setY(i, 1.0 - uvAttr.getY(i));
  }
  uvAttr.needsUpdate = true;

  const labelMesh = new THREE.Mesh(
    labelGeo,
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
  );
  labelMesh.rotation.x = -Math.PI / 2;
  labelMesh.position.set(0, 0.051, 0);
  capGroup.add(labelMesh);

  g.userData = {
    capGroup,
    action: cfg.id,
    name: cfg.name,
    tooltip: `${cfg.label} - ${cfg.sub || ''}`
  };

  return g;
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

// Switch-Mode Power Supply Assembly
function createSMPSAssembly() {
  const g = new THREE.Group();
  g.name = 'Subsystem_PowerSupply_SMPS';

  const cage = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.45, 1.8),
    MAT_ALUM_BREADBOARD
  );
  cage.position.set(0, 0.225, 0);
  cage.castShadow = true;
  g.add(cage);

  const toroid = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.10, 16, 32),
    MAT_COPPER_WIRE
  );
  toroid.position.set(-0.25, 0.08, -0.2);
  g.add(toroid);

  for (let cx = 0; cx < 2; cx++) {
    for (let cz = 0; cz < 2; cz++) {
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.28, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 })
      );
      cap.position.set(0.25 + cx * 0.22, 0.14, -0.35 + cz * 0.24);
      g.add(cap);

      const vent = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.01, 16),
        MAT_CHROME
      );
      vent.position.set(0.25 + cx * 0.22, 0.285, -0.35 + cz * 0.24);
      g.add(vent);
    }
  }

  const barrier = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.14, 0.12),
    MAT_CHASSIS_DARK
  );
  barrier.position.set(0, 0.05, -0.91);
  g.add(barrier);

  for (let i = 0; i < 6; i++) {
    const screw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12),
      MAT_BRASS_FITTING
    );
    screw.rotation.x = Math.PI / 2;
    screw.position.set(-0.35 + i * 0.14, 0.05, -0.97);
    g.add(screw);
  }

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

    // Actionable click targets
    this.actionableMeshes = [];
    this.animTargets = {};

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
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
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
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.3);
    fillLight.position.set(5.5, 5.0, 4.5);
    this.scene.add(fillLight);

    // Rim Light (crisp white highlight)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(0.0, 6.0, 5.5);
    this.scene.add(rimLight);
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
    footOffsets.forEach(([fx, fy, fz]) => {
      const foot = createVibrationFoot(0.13, 0.08);
      foot.position.set(fx, fy, fz);
      this.chassisBaseGroup.add(foot);
    });

    // 2. Heavy Cast Aluminum Base Pan with precision dark finish
    const basePanGeo = new THREE.BoxGeometry(4.36, 0.16, 4.76);
    const basePan = new THREE.Mesh(basePanGeo, MAT_CHASSIS_DARK);
    basePan.position.set(0, BASE_Y + 0.08, 0);
    basePan.receiveShadow = true;
    basePan.castShadow = true;
    this.chassisBaseGroup.add(basePan);
    this.rootGroup.add(this.chassisBaseGroup);

    // 3. Removable Unibody Shroud (Elevates smoothly along +Y in Exploded View)
    this.chassisShellGroup.position.set(0, 0, 0);

    // --- REAR OPTICS & ELECTRONICS ENCLOSURE (Z in [0, 2.38]) ---
    // Rear wall at Z = +2.38
    const rearWall = new THREE.Mesh(
      new THREE.BoxGeometry(4.36, 1.80, 0.04),
      MAT_CHASSIS
    );
    rearWall.position.set(0, BASE_Y + 0.16 + 0.90, 2.38 - 0.02);
    rearWall.castShadow = true;
    rearWall.receiveShadow = true;
    this.chassisShellGroup.add(rearWall);

    // Rear Left Wall (X = +2.18, Z in [0, 2.38])
    const rearLeftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.80, 2.38),
      MAT_CHASSIS
    );
    rearLeftWall.position.set(2.18 - 0.02, BASE_Y + 0.16 + 0.90, 1.19);
    rearLeftWall.castShadow = true;
    rearLeftWall.receiveShadow = true;
    this.chassisShellGroup.add(rearLeftWall);

    // Rear Right Wall (X = -2.18, Z in [0, 2.38])
    const rearRightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.80, 2.38),
      MAT_CHASSIS
    );
    rearRightWall.position.set(-2.18 + 0.02, BASE_Y + 0.16 + 0.90, 1.19);
    rearRightWall.castShadow = true;
    rearRightWall.receiveShadow = true;
    this.chassisShellGroup.add(rearRightWall);

    // Optics Bay Roof Deck (Z in [0, 2.38], Y = BASE_Y + 0.16 + 1.80)
    const opticsRoof = new THREE.Mesh(
      new THREE.BoxGeometry(4.36, 0.04, 2.38),
      MAT_CHASSIS
    );
    opticsRoof.position.set(0, BASE_Y + 0.16 + 1.80 - 0.02, 1.19);
    opticsRoof.castShadow = true;
    opticsRoof.receiveShadow = true;
    this.chassisShellGroup.add(opticsRoof);

    // Polished Chrome Crown Seam Runner along Z = 0
    const crownRunner = new THREE.Mesh(
      new THREE.BoxGeometry(4.38, 0.025, 0.035),
      MAT_CHROME
    );
    crownRunner.position.set(0, BASE_Y + 0.16 + 1.80 + 0.005, 0.0);
    this.chassisShellGroup.add(crownRunner);

    // Internal Optics Bulkhead at Z = 0 (dividing rear optics from front ATR & console)
    const opticsBulkhead = new THREE.Mesh(
      new THREE.BoxGeometry(4.36, 1.80, 0.04),
      MAT_CHASSIS
    );
    opticsBulkhead.position.set(0, BASE_Y + 0.16 + 0.90, 0.0);
    opticsBulkhead.castShadow = true;
    this.chassisShellGroup.add(opticsBulkhead);

    // Two KBr Optical Windows on Bulkhead at Z = 0 (Modulated IR Beam Out / Detector In)
    [0.94, 1.45].forEach((wx) => {
      const portBezel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.05, 24),
        MAT_CHROME
      );
      portBezel.rotation.x = Math.PI / 2;
      portBezel.position.set(wx, BASE_Y + 0.16 + 0.40, -0.02);
      this.chassisShellGroup.add(portBezel);

      const kbrWin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.015, 24),
        MAT_KBR_CRYSTAL
      );
      kbrWin.rotation.x = Math.PI / 2;
      kbrWin.position.set(wx, BASE_Y + 0.16 + 0.40, -0.02);
      this.chassisShellGroup.add(kbrWin);
    });

    // Desiccant Service Hatch on Optics Roof Deck
    const hatchGroup = new THREE.Group();
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
      MAT_CHASSIS_GLASS
    );
    humidLens.position.y = 0.018;
    humidGroup.add(humidLens);
    this.chassisShellGroup.add(humidGroup);

    // --- SOLID 3D SLOPED CONSOLE WEDGE (Front Right: X in [-2.18, 0], Z in [-2.38, 0]) ---
    // True 3D solid trapezoidal wedge with verified outward normals on all 6 faces!
    // Right exterior cheek wall slopes WITH the console (ZERO PARAPET TRENCH).
    // Left cheek wall forms a smooth molded flank meeting the ATR deck.
    const v0 = [-2.18, 0.24, -2.38]; // front-right-bottom
    const v1 = [ 0.00, 0.24, -2.38]; // front-left-bottom
    const v2 = [ 0.00, 0.24,  0.00]; // rear-left-bottom
    const v3 = [-2.18, 0.24,  0.00]; // rear-right-bottom

    const v4 = [-2.18, 1.38, -2.38]; // front-right-top
    const v5 = [ 0.00, 1.38, -2.38]; // front-left-top
    const v6 = [ 0.00, 2.04,  0.00]; // rear-left-top
    const v7 = [-2.18, 2.04,  0.00]; // rear-right-top

    const wedgePositions = new Float32Array([
      // 1. Top sloped face (outward normal: up and forward)
      ...v4, ...v7, ...v6,   ...v4, ...v6, ...v5,
      // 2. Left cheek wall at X = 0 (outward normal: [+1, 0, 0] facing ATR deck)
      ...v1, ...v6, ...v2,   ...v1, ...v5, ...v6,
      // 3. Right cheek wall at X = -2.18 (outward normal: [-1, 0, 0] facing right exterior)
      ...v0, ...v3, ...v7,   ...v0, ...v7, ...v4,
      // 4. Front vertical apron at Z = -2.38 (outward normal: [0, 0, -1] facing operator)
      ...v0, ...v5, ...v1,   ...v0, ...v4, ...v5,
      // 5. Rear vertical bulkhead at Z = 0 (outward normal: [0, 0, +1])
      ...v3, ...v2, ...v6,   ...v3, ...v6, ...v7,
      // 6. Bottom face at Y = 0.24 (outward normal: [0, -1, 0])
      ...v0, ...v1, ...v2,   ...v0, ...v2, ...v3,
    ]);

    const wedgeUvs = new Float32Array([
      0,0, 1,1, 0,1,  0,0, 1,0, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
      0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
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

    // --- OPEN ERGONOMIC ATR SAMPLING DECK BASE CURB (Front Left: X in [0, 2.18], Z in [-2.38, 0]) ---
    // Low-profile molded base curb (Y <= 0.90) providing 180° unobstructed hand & pipette access!
    // ZERO tall vertical walls!
    const curbLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.66, 2.38),
      MAT_CHASSIS
    );
    curbLeft.position.set(2.18 - 0.04, 0.24 + 0.33, -1.19);
    curbLeft.castShadow = true;
    this.chassisShellGroup.add(curbLeft);

    const curbFront = new THREE.Mesh(
      new THREE.BoxGeometry(2.18, 0.66, 0.08),
      MAT_CHASSIS
    );
    curbFront.position.set(1.09, 0.24 + 0.33, -2.38 + 0.04);
    curbFront.castShadow = true;
    this.chassisShellGroup.add(curbFront);

    // Smooth chamfer caps along top of low curbs
    const capLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.02, 2.38),
      MAT_CHROME
    );
    capLeft.position.set(2.18 - 0.04, 0.90 + 0.01, -1.19);
    this.chassisShellGroup.add(capLeft);

    const capFront = new THREE.Mesh(
      new THREE.BoxGeometry(2.18, 0.02, 0.08),
      MAT_CHROME
    );
    capFront.position.set(1.09, 0.90 + 0.01, -2.38 + 0.04);
    this.chassisShellGroup.add(capFront);

    // --- SIDE BUMPER RAILS & RECESSED LIFT HANDLES (Both Flanks) ---
    for (const sx of [-2.18, 2.18]) {
      // Anodized aluminum side bumper rail
      const bumper = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.08, 4.60),
        MAT_ALUM_ANODIZED
      );
      bumper.position.set(sx + (sx > 0 ? -0.012 : 0.012), BASE_Y + 0.40, 0);
      this.chassisShellGroup.add(bumper);

      // Countersunk M3 hex socket screws along bumper rail
      for (let bz = -1.8; bz <= 1.8; bz += 0.9) {
        const screw = createHexSocketScrew(0.014, 0.03, { material: MAT_CHROME });
        screw.rotation.z = (sx > 0 ? -Math.PI / 2 : Math.PI / 2);
        screw.position.set(sx + (sx > 0 ? -0.012 : 0.012), BASE_Y + 0.40, bz);
        this.chassisShellGroup.add(screw);
      }

      // Recessed molded urethane hand-lift pocket
      const pocketBezel = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.16, 0.45),
        MAT_CHASSIS_DARK
      );
      pocketBezel.position.set(sx + (sx > 0 ? -0.015 : 0.015), BASE_Y + 0.65, 0.4);
      this.chassisShellGroup.add(pocketBezel);
    }

    // --- REAR PANEL I/O & INFRASTRUCTURE (Z = +2.38) ---
    // IEC-320 C14 AC inlet socket
    const iecInlet = createIECInlet();
    iecInlet.position.set(-1.40, 0.45, 2.385);
    this.chassisShellGroup.add(iecInlet);

    // Illuminated Rocker Power Switch
    this.rockerSwitch = createRockerSwitch({
      isOn: true,
      onChange: (state) => this.setPowerSwitch(state),
    });
    this.rockerSwitch.position.set(-0.90, 0.45, 2.385);
    this.rockerSwitch.userData = { name: 'Switch_Power', action: 'toggle_switch', tooltip: 'Rear AC Power Switch (I/O)' };
    this.actionableMeshes.push(this.rockerSwitch);
    this.chassisShellGroup.add(this.rockerSwitch);

    // 80mm Convective Exhaust Fan Louvers
    for (let f = 0; f < 8; f++) {
      const fanLouver = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.024, 0.04),
        MAT_CHASSIS_DARK
      );
      fanLouver.rotation.x = -0.42;
      fanLouver.position.set(-1.40, BASE_Y + 0.95 + f * 0.08, 2.385);
      this.chassisShellGroup.add(fanLouver);
    }

    // 1/4" Swagelok Dry N2 Purge Port
    const swagelok = createSwagelokPurgeFitting();
    swagelok.position.set(1.40, 0.45, 2.385);
    this.chassisShellGroup.add(swagelok);

    // Gold-Plated Chassis Grounding Binding Post
    const groundLug = createGroundingLug();
    groundLug.position.set(1.05, 0.45, 2.385);
    this.chassisShellGroup.add(groundLug);

    // DB-9 RS-232 Serial Telemetry Port
    const db9 = createDB9Port();
    db9.position.set(0.40, 0.45, 2.385);
    this.chassisShellGroup.add(db9);

    // Shielded USB-B 2.0 Instrument Control Port
    const usbB = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.11, 0.02), MAT_CHROME);
    usbB.position.set(0.00, 0.45, 2.385);
    this.chassisShellGroup.add(usbB);

    // Shielded RJ45 Gigabit Ethernet Port
    const rj45 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.13, 0.02), MAT_CHASSIS_DARK);
    rj45.position.set(-0.35, 0.45, 2.385);
    this.chassisShellGroup.add(rj45);

    // Silkscreened Aluminum GLP Specification Rating Plate
    const ratingPlate = createRatingPlate();
    ratingPlate.position.set(0.50, 1.25, 2.385);
    this.chassisShellGroup.add(ratingPlate);

    // Fasteners securing top unibody to chassis base (exclusively on structural horizontal surfaces)
    [
      [-1.95, 2.25], [1.95, 2.25],
      [-1.95, 0.15], [1.95, 0.15]
    ].forEach(([sx, sz]) => {
      const screw = createHexSocketScrew(0.02, 0.05, { material: MAT_CHROME });
      screw.position.set(sx, BASE_Y + 0.16 + 1.80, sz);
      this.chassisShellGroup.add(screw);
    });

    this.rootGroup.add(this.chassisShellGroup);
  }

  // ==========================================
  // Open Diamond ATR Sampling Station
  // (Mounted on Front Left: X in [0, 2.18], Z in [-2.38, 0])
  // ==========================================
  buildDiamondATRStation() {
    const BASE_Y = 0.08;
    this.atrStationGroup.position.set(1.09, BASE_Y + 0.16 + 0.66, -1.19);

    // 1. Mirror-Polished 316L Stainless Steel Deck Plate (1.95m x 0.06m x 2.15m)
    const plateGeo = new THREE.BoxGeometry(1.95, 0.06, 2.15);
    const plate = new THREE.Mesh(plateGeo, MAT_STAINLESS_ATR);
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
    this.diamondMesh.position.y = 0.042;
    this.diamondMesh.castShadow = true;
    this.diamondMesh.userData = { name: 'Diamond_ATR_Crystal', action: 'cycle_sample', tooltip: 'Monolithic Type IIa Diamond Crystal (Click to swap sample)' };
    this.actionableMeshes.push(this.diamondMesh);
    this.atrStationGroup.add(this.diamondMesh);

    // 2. Swiveling Heavy Pressure Clamp Tower (180° swing clearance)
    this.towerGroup = new THREE.Group();
    this.towerGroup.name = 'Tower_Clamp_Swivel';
    this.towerGroup.position.set(0, 0.03, 0.65);

    // Solid mounting pedestal with 2 hex socket cap screws
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

    // Heavy vertical forged pillar
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.085, 0.68, 24),
      MAT_CHASSIS_DARK
    );
    pillar.position.y = 0.44;
    pillar.castShadow = true;
    this.towerGroup.add(pillar);

    // Stainless steel precision swivel hinge pin
    const hingePin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.14, 16),
      MAT_CHROME
    );
    hingePin.rotation.z = Math.PI / 2;
    hingePin.position.set(0, 0.72, 0);
    this.towerGroup.add(hingePin);

    // Overhanging horizontal clamp arm reaching forward over diamond crystal
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.12, 0.72),
      MAT_CHASSIS_DARK
    );
    arm.position.set(0, 0.72, -0.32);
    arm.castShadow = true;
    this.towerGroup.add(arm);

    // Calibrated slip-clutch knurled torque knob on top of arm
    this.torqueKnob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.14, 32),
      MAT_CHASSIS_DARK
    );
    this.torqueKnob.position.set(0, 0.85, -0.65);
    this.torqueKnob.castShadow = true;
    this.towerGroup.add(this.torqueKnob);

    // Fine knurling chrome ring around knob
    const knurlRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.124, 0.124, 0.04, 32),
      MAT_CHROME
    );
    knurlRing.position.set(0, 0.85, -0.65);
    this.towerGroup.add(knurlRing);

    // Self-aligning sapphire tip anvil pointing down to diamond
    const anvilRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.22, 16),
      MAT_CHROME
    );
    anvilRod.position.set(0, 0.62, -0.65);
    anvilRod.castShadow = true;
    this.towerGroup.add(anvilRod);

    const sapphireTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.022, 0.04, 16),
      MAT_CHASSIS_GLASS
    );
    sapphireTip.rotation.x = Math.PI;
    sapphireTip.position.set(0, 0.50, -0.65);
    this.towerGroup.add(sapphireTip);

    this.towerGroup.userData = { name: 'Tower_Clamp_Swivel', action: 'toggle_tower', tooltip: 'Click to swivel pressure clamp tower' };
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

    const aldenLead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.08, 12),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 })
    );
    aldenLead.position.set(0.48, 0, 0);
    aldenLead.rotation.z = Math.PI / 2;
    heneGroup.add(aldenLead);

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

    this.interferometerGroup.add(dtgsGroup);

    this.chassisBaseGroup.add(this.interferometerGroup);
  }

  // ==========================================
  // Internal Electronics & Convective Cooling Fans
  // (Anchored to chassisBaseGroup: X in [-2.18, 0], Z in [0, 2.38])
  // ==========================================
  buildElectronicsAndFans() {
    const BASE_Y = 0.08;
    this.electronicsGroup.position.set(-1.09, BASE_Y + 0.16, 1.19);

    // 1. Switch-Mode Power Supply (SMPS)
    const smps = createSMPSAssembly();
    smps.position.set(-0.25, 0, 0.15);
    this.electronicsGroup.add(smps);

    // 2. High-Speed 32-Bit DSP Motherboard
    const pcbGeo = new THREE.BoxGeometry(1.6, 0.02, 1.8);
    const pcb = new THREE.Mesh(pcbGeo, MAT_PCB_FR4);
    pcb.position.set(0.10, 0.03, -0.10);
    pcb.receiveShadow = true;
    this.electronicsGroup.add(pcb);

    // Primary Texas Instruments C6000 DSP QFP IC
    const dspChip = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.03, 0.32),
      MAT_CHASSIS_DARK
    );
    dspChip.position.set(0.10, 0.05, -0.10);
    this.electronicsGroup.add(dspChip);

    // 24-Bit ADC Audio/IR sampling chip
    const adcChip = new THREE.Mesh(
      new THREE.BoxGeometry(0.20, 0.025, 0.16),
      MAT_CHASSIS_DARK
    );
    adcChip.position.set(0.50, 0.045, -0.30);
    this.electronicsGroup.add(adcChip);

    // Quartz Crystal Clock Oscillator (60.000 MHz)
    const osc = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, 0.03, 0.06),
      MAT_CHROME
    );
    osc.position.set(0.35, 0.048, -0.10);
    this.electronicsGroup.add(osc);

    // Multi-Pin MOLEX Ribbon Wire Headers
    for (let h = 0; h < 3; h++) {
      const header = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.06, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 })
      );
      header.position.set(-0.55 + h * 0.32, 0.06, -0.85);
      this.electronicsGroup.add(header);
    }

    // 3. 80mm Convective Exhaust Cooling Fan
    this.fanGroup = new THREE.Group();
    this.fanGroup.position.set(-0.31, 0.55, 1.15);

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

    this.fanBlades = new THREE.Group();
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

    // Concentric wire finger guard
    for (let r = 0.12; r <= 0.30; r += 0.08) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.008, 8, 32),
        MAT_CHROME
      );
      ring.position.z = 0.07;
      this.fanGroup.add(ring);
    }

    this.electronicsGroup.add(this.fanGroup);

    this.chassisBaseGroup.add(this.electronicsGroup);
  }

  // ==========================================
  // Internal Procedural Wiring Harnesses
  // ==========================================
  buildInternalWiringHarnesses() {
    const BASE_Y = 0.08;

    // 1. Primary AC Input Wiring Harness (IEC Inlet -> Power Switch -> SMPS Barrier)
    const acColors = [0x111827, 0xf1f5f9, 0x22c55e]; // Live (Black), Neutral (White), Ground (Green)
    acColors.forEach((col, idx) => {
      const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.40, BASE_Y + 0.45, 2.36),
        new THREE.Vector3(-1.15 + idx * 0.03, BASE_Y + 0.25, 2.05),
        new THREE.Vector3(-1.34 + idx * 0.03, BASE_Y + 0.12, 1.34),
      ]);
      const wireGeo = new THREE.TubeGeometry(path, 24, 0.012, 8, false);
      const wireMesh = new THREE.Mesh(wireGeo, new THREE.MeshStandardMaterial({ color: col, roughness: 0.7 }));
      this.wiringGroup.add(wireMesh);
    });

    // 2. High-Voltage Red Silicon Wire to HeNe Laser Anode
    const hvPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.84, BASE_Y + 0.28, 1.05),
      new THREE.Vector3(-0.20, BASE_Y + 0.35, 1.45),
      new THREE.Vector3(1.19, BASE_Y + 0.38, 2.04),
    ]);
    const hvWireGeo = new THREE.TubeGeometry(hvPath, 32, 0.014, 8, false);
    const hvWireMesh = new THREE.Mesh(hvWireGeo, new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 }));
    this.wiringGroup.add(hvWireMesh);

    // 3. Flat Ribbon Cable from DSP Motherboard to Front Console Bezel
    const ribbonPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.99, BASE_Y + 0.22, 0.34),
      new THREE.Vector3(-1.09, BASE_Y + 0.45, -0.45),
      new THREE.Vector3(-1.09, BASE_Y + 0.95, -1.19),
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonPath, 24, 0.035, 4, false);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }));
    this.wiringGroup.add(ribbonMesh);

    // 4. Shielded Miniature Coaxial Cable from DTGS Detector to ADC
    const coaxPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.74, BASE_Y + 0.48, 0.44),
      new THREE.Vector3(1.20, BASE_Y + 0.25, 0.10),
      new THREE.Vector3(-0.51, BASE_Y + 0.26, 1.71),
    ]);
    const coaxTube = new THREE.TubeGeometry(coaxPath, 32, 0.014, 8, false);
    const coaxMesh = new THREE.Mesh(coaxTube, MAT_CABLE_PVC);
    this.wiringGroup.add(coaxMesh);

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
    this.lcdScreen.userData = { name: 'UI_LCD', action: 'tap_screen', tooltip: 'FTIR Capacitive Touchscreen (Click to cycle view/mode)' };
    this.actionableMeshes.push(this.lcdScreen);
    this.consoleGroup.add(this.lcdScreen);

    // Protective Optical Glass Lens over LCD
    const lensGeo = new THREE.PlaneGeometry(lcdW, lcdH);
    const lens = new THREE.Mesh(lensGeo, MAT_CHASSIS_GLASS);
    lens.rotation.x = -Math.PI / 2;
    lens.position.set(0, 0.040, 0.16);
    this.consoleGroup.add(lens);

    // 5 Physical Tactile Push Buttons below Screen on console face
    const buttons = [
      { id: 'btn_pwr', name: 'Btn_Power', label: 'POWER', sub: 'STANDBY', color: '#f43f5e', x: -0.64 },
      { id: 'btn_bg', name: 'Btn_Background', label: 'BG', sub: 'AIR REF', color: '#0284c7', x: -0.32 },
      { id: 'btn_scan', name: 'Btn_Scan', label: 'SCAN', sub: 'SAMPLE', color: '#a855f7', x: 0.0 },
      { id: 'btn_mode', name: 'Btn_Mode', label: 'MODE', sub: '%T / A', color: '#06b6d4', x: 0.32 },
      { id: 'btn_tower', name: 'Btn_Tower', label: 'TOWER', sub: 'SWIVEL', color: '#f59e0b', x: 0.64 },
    ];

    buttons.forEach((bCfg) => {
      const btn = createLabeledKeycap(bCfg);
      btn.position.set(bCfg.x, 0.036, -0.52);
      this.actionableMeshes.push(btn);
      this.consoleGroup.add(btn);
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
      new THREE.Vector3(1.09, 0.94, -1.19),  // ATR Diamond bottom facet
      new THREE.Vector3(1.09, 0.95, -1.19),  // Internal reflection
      new THREE.Vector3(1.74, 0.48, 0.44),   // DTGS Pyroelectric detector
    ];

    const curve = new THREE.CatmullRomCurve3(points);
    const rayGeo = new THREE.TubeGeometry(curve, 64, 0.016, 8, false);
    this.rayMesh = new THREE.Mesh(
      rayGeo,
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 })
    );
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

    // Unpowered blackout state
    if (!this.hasPower) {
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, w, h);
      this.lcdTexture.needsUpdate = true;
      return;
    }

    ctx.fillStyle = '#080d14';
    ctx.fillRect(0, 0, w, h);

    // Top Status Header Bar
    ctx.fillStyle = '#0f1724';
    ctx.fillRect(0, 0, w, 52);
    ctx.fillStyle = '#1e2d42';
    ctx.fillRect(0, 52, w, 2);

    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#00d4e8';
    ctx.fillText('SREdesigns FTIR-7000x', 24, 35);

    // System State Indicator Pill
    let stateColor = '#3dd68c';
    let stateText = 'READY';
    if (this.isScanning) {
      stateColor = '#a855f7';
      stateText = `SCANNING [${Math.floor(this.scanProgress * 100)}%]`;
    }
    ctx.fillStyle = stateColor;
    ctx.beginPath();
    ctx.arc(380, 31, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 16px monospace';
    ctx.fillText(stateText, 396, 37);

    // Laser & Purge Status
    ctx.font = '600 15px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('HeNe: 632.8nm (LOCKED) | N₂ PURGE: OK', 640, 36);

    // Main Mid-IR Spectrum Chart Area
    const chartX = 70;
    const chartY = 85;
    const chartW = 880;
    const chartH = 430;

    ctx.fillStyle = '#0c1322';
    ctx.fillRect(chartX, chartY, chartW, chartH);
    ctx.strokeStyle = '#1e2d42';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(chartX, chartY, chartW, chartH);

    // Grid lines & Wavenumber X-axis calibration (4000 to 400 cm-1)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';

    const wnTicks = [4000, 3500, 3000, 2500, 2000, 1500, 1000, 500];
    wnTicks.forEach((wn) => {
      const frac = (4000 - wn) / 3600;
      const x = chartX + frac * chartW;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartH);
      ctx.stroke();
      ctx.fillText(wn.toString(), x - 14, chartY + chartH + 18);
    });

    // Y-axis calibration (% Transmittance or Absorbance)
    const yTicks = (this.viewMode === 'transmittance')
      ? [100, 75, 50, 25, 0]
      : [0.0, 0.5, 1.0, 1.5, 2.0];
    yTicks.forEach((val, i) => {
      const y = chartY + (i / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartW, y);
      ctx.stroke();
      ctx.fillText(val.toString() + (this.viewMode === 'transmittance' ? '%' : ''), 20, y + 4);
    });

    // Draw Infrared Absorption Spectrum Curve
    ctx.strokeStyle = this.isScanning ? '#a855f7' : '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();

    const analyteBands = {
      isopropanol: [
        { wn: 3350, fwhm: 260, depth: 0.85 }, // O-H stretch
        { wn: 2970, fwhm: 80, depth: 0.72 },  // C-H stretch
        { wn: 1381, fwhm: 50, depth: 0.60 },  // Gem-dimethyl
        { wn: 1129, fwhm: 60, depth: 0.90 },  // C-O stretch
      ],
      acetone: [
        { wn: 1715, fwhm: 70, depth: 0.94 },  // C=O carbonyl stretch
        { wn: 1362, fwhm: 45, depth: 0.55 },  // C-H bend
        { wn: 1222, fwhm: 55, depth: 0.70 },  // C-C stretch
      ],
      toluene: [
        { wn: 3028, fwhm: 65, depth: 0.65 },  // Aromatic C-H
        { wn: 1604, fwhm: 40, depth: 0.58 },  // Aromatic ring
        { wn: 1495, fwhm: 45, depth: 0.62 },  // Ring stretch
        { wn: 728, fwhm: 50, depth: 0.92 },   // Out-of-plane C-H
      ],
      polystyrene: [
        { wn: 3026, fwhm: 50, depth: 0.68 },
        { wn: 1601, fwhm: 35, depth: 0.74 },
        { wn: 1492, fwhm: 40, depth: 0.70 },
        { wn: 1452, fwhm: 40, depth: 0.65 },
        { wn: 1028, fwhm: 35, depth: 0.55 },
        { wn: 698, fwhm: 45, depth: 0.92 },
      ],
      benzoic_acid: [
        { wn: 2850, fwhm: 400, depth: 0.75 }, // Broad H-bonded O-H
        { wn: 1685, fwhm: 60, depth: 0.92 },  // Carboxylic C=O
        { wn: 1290, fwhm: 55, depth: 0.78 },  // C-O stretch
        { wn: 708, fwhm: 50, depth: 0.85 },   // Monosubstituted ring
      ]
    };

    const bands = analyteBands[this.activeSampleId] || analyteBands.isopropanol;

    for (let px = 0; px <= chartW; px += 2) {
      const wn = 4000 - (px / chartW) * 3600;
      let absorb = 0.04; // Baseline noise
      absorb += (Math.sin(px * 0.2) + Math.cos(px * 0.05)) * 0.005;

      bands.forEach((b) => {
        const diff = wn - b.wn;
        absorb += b.depth * Math.exp(-(diff * diff) / (2 * (b.fwhm / 2.355) ** 2));
      });

      let yNorm = (this.viewMode === 'transmittance')
        ? Math.max(0.05, 1.0 - absorb)
        : Math.min(2.0, absorb * 1.5) / 2.0;

      if (this.viewMode === 'transmittance') {
        const yPx = chartY + (1.0 - yNorm) * chartH;
        if (px === 0) ctx.moveTo(chartX + px, yPx);
        else ctx.lineTo(chartX + px, yPx);
      } else {
        const yPx = chartY + chartH - yNorm * chartH;
        if (px === 0) ctx.moveTo(chartX + px, yPx);
        else ctx.lineTo(chartX + px, yPx);
      }
    }
    ctx.stroke();

    // Chart Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px monospace';
    ctx.fillText(`ANALYTE: ${this.activeSampleId.toUpperCase()} | MODE: ${this.viewMode.toUpperCase()} | RES: 4.0 cm⁻¹ | SCANS: 16`, chartX + 10, chartY + chartH - 12);

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
    // Elevate unibody shroud along +Y to cleanly expose all internal mechanics
    this.chassisShellGroup.position.y = offset * 1.40;
  }

  setExploded(offset) {
    this.setExplodedView(offset);
  }

  setXRayMode(enable) {
    this.xRayMode = enable;
    MAT_CHASSIS.transparent = enable;
    MAT_CHASSIS.opacity = enable ? 0.35 : 1.0;
    MAT_CHASSIS.depthWrite = !enable;
  }

  toggleOpticsView() {
    this.opticsViewActive = !this.opticsViewActive;
    this.setXRayMode(this.opticsViewActive);
  }

  toggleSwivel() {
    this.swivelTower();
    this.towerSwiveled = (this.towerAngle !== 0.0);
  }

  setPressure(pct) {
    this.clampPressurePct = pct;
    this.clampForceNewtons = (pct / 100) * 45.0;
    if (this.torqueKnob) {
      this.torqueKnob.rotation.y += Math.PI / 4;
    }
  }

  animate(time = 0) {
    requestAnimationFrame(this.animate.bind(this));

    // 1. Convective cooling fan rotation
    if (this.hasPower && this.fanBlades) {
      this.fanBlades.rotation.z += 0.22;
    }

    // 2. Active voice-coil moving mirror scan oscillation
    if (this.hasPower && this.movingMirrorPuck) {
      const osc = Math.sin(time * 0.006) * 0.035;
      this.movingMirrorPuck.position.z = 0.20 + osc;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
