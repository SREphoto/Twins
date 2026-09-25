/**
 * Shimadzu UV-1900i Dual-Beam UV-Vis Spectrophotometer Twin
 * High-Fidelity Procedural 3D Model & Mechanical Assembly
 *
 * Semantic Part Taxonomy Compliance:
 * - Body_Chassis: Main casting & outer shell with recessed shadow gaps and precision reveals
 * - Assembly_SlopedConsole: Sloped 16.5° touchscreen bezel with brushed aluminum perimeter trim
 * - UI_LCD: Flat UV quad with CanvasTexture (flipY = false, horizontal UV inversion, capacitive digitizer)
 * - Btn_Power, Btn_Zero, Btn_Scan, Btn_Mode, Btn_CellNext: Tactile laser-etched labeled keycaps with mechanical spring depress
 * - Pivot_ChamberLid: Kinematic L-shaped hinged door (top plate + front vertical apron + knurled grip handle)
 * - Pivot_CellCarousel: 6-position motorized cuvette carousel with Geneva drive hub
 * - Glass_Cuvette_1..6: Synthetic fused silica quartz optical cuvettes (IOR = 1.52)
 * - Assembly_PowerCord: Molded C13 line plug, flexible 3-conductor heavy PVC cable, and AC wall plug
 * - Assembly_OpticsBay: Cast aluminum breadboard, Deuterium (D2) finned UV lamp, Tungsten-Halogen lamp,
 *   source selection mirror, Czerny-Turner monochromator, 1200 lines/mm holographic grating, dual-beam sector chopper,
 *   folding reference mirrors, silicon photodiode detectors, pre-amp PCB, DSP motherboard, SMPS, and cooling fan
 * - Assembly_OpticalRays: Animated 3D glowing ray tracing visualizing the dual-beam optical path
 * - Badge_SREdesigns: Diamond-cut beveled chrome plate with 1024x260 measured layout (zero text overflow)
 * - Fastener_HexM3_*: Real 3D hex socket cap screws (ISO 4762) with counterbored washers
 * - Foot_Leveling_FL/FR/RL/RR: Threaded leveling feet resting on datum plane Y = 0
 */

import * as THREE from 'three';
import {
  createHexSocketScrew,
  createWasher,
  createVibrationFoot,
  createIECInlet,
  createBNCJack,
  createDB9Port,
  createRockerSwitch,
} from '../../../lab_viewer/shared/hardware_library.js';

// Standard Materials Cache
const MAT_CHASSIS = new THREE.MeshStandardMaterial({
  color: 0xe6eaf0,
  roughness: 0.38,
  metalness: 0.12,
  side: THREE.DoubleSide,
});
const MAT_CHASSIS_DARK = new THREE.MeshStandardMaterial({
  color: 0x20242b,
  roughness: 0.5,
  metalness: 0.25,
});
const MAT_CHASSIS_GLASS = new THREE.MeshStandardMaterial({
  color: 0x93c5fd,
  roughness: 0.15,
  metalness: 0.1,
  transparent: true,
  opacity: 0.22,
  depthWrite: false,
});
const MAT_BEZEL = new THREE.MeshStandardMaterial({
  color: 0x161a20,
  roughness: 0.6,
  metalness: 0.1,
});
const MAT_CHAMBER_INNER = new THREE.MeshStandardMaterial({
  color: 0x111316,
  roughness: 0.88,
  metalness: 0.05,
});
const MAT_CHROME = new THREE.MeshStandardMaterial({
  color: 0xdde2ea,
  roughness: 0.08,
  metalness: 0.95,
});
const MAT_ALUM_ANODIZED = new THREE.MeshStandardMaterial({
  color: 0x7a8089,
  roughness: 0.35,
  metalness: 0.8,
});
const MAT_ALUM_BREADBOARD = new THREE.MeshStandardMaterial({
  color: 0x333842,
  roughness: 0.42,
  metalness: 0.75,
});
const MAT_KEY_DARK = new THREE.MeshStandardMaterial({
  color: 0x222730,
  roughness: 0.5,
  metalness: 0.1,
});
const MAT_GOLD_MIRROR = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  roughness: 0.12,
  metalness: 0.94,
});
const MAT_HOLO_GRATING = new THREE.MeshStandardMaterial({
  color: 0x38bdf8,
  roughness: 0.2,
  metalness: 0.85,
});
const MAT_PCB_GREEN = new THREE.MeshStandardMaterial({
  color: 0x14532d,
  roughness: 0.4,
  metalness: 0.25,
});
const MAT_CABLE_PVC = new THREE.MeshStandardMaterial({
  color: 0x181a1f,
  roughness: 0.7,
  metalness: 0.05,
});
const MAT_OPTICAL_GLASS = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.96,
  opacity: 1,
  transparent: true,
  roughness: 0.03,
  ior: 1.52,
  thickness: 0.08,
});

// Inline USB Port helper
function createUSBPort() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, 0.14),
    new THREE.MeshStandardMaterial({ color: 0x787d85, metalness: 0.7, roughness: 0.3 })
  );
  g.add(body);
  const core = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.04, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 })
  );
  core.position.z = 0.065;
  g.add(core);
  return g;
}

/**
 * Official SREdesigns Brand Badge (Diamond-Cut Metal Plate, Strict DIAG-001 & DIAG-002 Compliance)
 * Guaranteed zero text clipping: All elements mathematically contained within 1024x260 canvas.
 */
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
  bgGrad.addColorStop(1, '#0a0f1d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 260);

  // Metallic inner perimeter accent border
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 1004, 240);

  // Subtle chamfer line
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 992, 228);

  // Three signature jewel-enamel 3D tiles for S - R - E (Left side)
  const tiles = ['S', 'R', 'E'];
  tiles.forEach((char, i) => {
    const tx = 38 + i * 66;
    const ty = 46;
    const tSize = 56;

    // Tile drop shadow
    ctx.fillStyle = '#034a61';
    ctx.beginPath();
    ctx.roundRect(tx + 2, ty + 2, tSize, tSize, 10);
    ctx.fill();

    // Tile gradient
    const tileGrad = ctx.createLinearGradient(tx, ty, tx, ty + tSize);
    tileGrad.addColorStop(0, '#0891b2');
    tileGrad.addColorStop(1, '#0e7490');
    ctx.fillStyle = tileGrad;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tSize, tSize, 10);
    ctx.fill();

    // Tile border
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Tile character
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 38px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, tx + tSize / 2, ty + tSize / 2 + 1);
  });

  // Vertical divider between SRE tiles and instrument typography
  ctx.strokeStyle = '#1e3a5f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(250, 30);
  ctx.lineTo(250, 230);
  ctx.stroke();

  // Typography Right Side (X = 275 to 985, completely contained!)
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Line 1: SHIMADZU UV-1900i + DUAL-BEAM Pill
  ctx.font = '800 34px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('SHIMADZU', 275, 70);

  ctx.fillStyle = '#38bdf8';
  ctx.fillText('UV-1900i', 485, 70);

  // Dual-beam pill badge on far right of line 1 (ends at X = 980)
  const pillX = 760;
  const pillY = 50;
  const pillW = 215;
  const pillH = 38;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 8);
  ctx.fill();

  ctx.font = '800 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.fillText('DUAL-BEAM UV-VIS', pillX + pillW / 2, pillY + pillH / 2);

  // Horizontal separator line
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(275, 115);
  ctx.lineTo(975, 115);
  ctx.stroke();

  // Line 2: Instrument classification
  ctx.textAlign = 'left';
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('HIGH-RESOLUTION RECORDING SPECTROPHOTOMETER', 275, 150);

  // Line 3: System specification & SREdesigns brand
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 18px monospace';
  ctx.fillText('PRECISION OPTICAL SYSTEM · SREdesigns LABS · Czerny-Turner', 275, 198);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;

  const badgeFaceGeo = new THREE.PlaneGeometry(plateW - 0.015, plateH - 0.015);
  const badgeFaceMat = new THREE.MeshBasicMaterial({
    map: tex,
    side: THREE.DoubleSide,
  });
  const faceMesh = new THREE.Mesh(badgeFaceGeo, badgeFaceMat);
  faceMesh.position.z = plateD / 2 + 0.004;
  group.add(faceMesh);

  return group;
}

/**
 * Creates tactile laser-etched labeled physical keycaps with depression mechanism.
 */
export function createLabeledKeycap(cfg) {
  const g = new THREE.Group();
  g.name = cfg.id;

  // Recessed bezel pocket tray
  const well = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.02, 0.18),
    MAT_BEZEL
  );
  well.position.y = 0.01;
  g.add(well);

  // Depressible keycap group (spring damper animation target)
  const capGroup = new THREE.Group();
  capGroup.position.set(0, 0.038, 0);

  // Keycap solid body
  const keyBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.038, 0.15),
    MAT_KEY_DARK
  );
  keyBase.castShadow = true;
  capGroup.add(keyBase);

  // High-resolution canvas texture for laser-etched keycap label
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  // Keycap face gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 160);
  grad.addColorStop(0, '#242b36');
  grad.addColorStop(1, '#181e28');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 160);

  // Chamfered keycap border
  ctx.strokeStyle = '#384355';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 248, 152);

  // Top color accent bar
  ctx.fillStyle = cfg.color || '#38bdf8';
  ctx.fillRect(8, 8, 240, 8);

  // Icon / graphic glyph
  ctx.fillStyle = cfg.color || '#ffffff';
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(cfg.icon || '', 128, 54);

  // Main bold label
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(cfg.label, 128, 100);

  // Subtitle / system function
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 16px monospace';
  ctx.fillText(cfg.sub || '', 128, 136);

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;

  const topGeo = new THREE.PlaneGeometry(0.245, 0.145);
  // DIAG-005: Match UI_LCD mapping: flipY = false + horizontal UV inversion on buffer geometry
  const uvTop = topGeo.attributes.uv;
  for (let i = 0; i < uvTop.count; i++) {
    uvTop.setX(i, 1.0 - uvTop.getX(i));
  }
  uvTop.needsUpdate = true;

  const topFace = new THREE.Mesh(
    topGeo,
    new THREE.MeshBasicMaterial({ map: tex })
  );
  topFace.rotation.x = -Math.PI / 2;
  topFace.position.y = 0.020;
  capGroup.add(topFace);

  g.add(capGroup);
  g.userData = { name: cfg.id, action: cfg.label, role: cfg.role, capGroup };
  return { group: g, capGroup, topFace };
}

/**
 * Creates genuine 3D physical AC power cord with C13 plug, sweeping tabletop drape, and NEMA 5-15P wall plug.
 */
export function createPowerCord(iecPortPos, wallOutletPos = new THREE.Vector3(1.40, 0.55, 3.65)) {
  const group = new THREE.Group();
  group.name = 'Assembly_PowerCord';

  // 1. Molded IEC C13 Line Plug Body (inserted into C14 socket)
  const plugBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.15, 0.28),
    new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.65, metalness: 0.08 })
  );
  plugBody.position.set(iecPortPos.x, iecPortPos.y, iecPortPos.z + 0.14);
  plugBody.castShadow = true;
  group.add(plugBody);

  // Finger grip ribs on plug sides
  for (let r = -2; r <= 2; r++) {
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.012, 0.014),
      new THREE.MeshStandardMaterial({ color: 0x111316, roughness: 0.8 })
    );
    rib.position.set(iecPortPos.x, iecPortPos.y + (r * 0.024), iecPortPos.z + 0.14);
    group.add(rib);
  }

  // Stepped rubber strain relief boot
  const boot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.040, 0.054, 0.14, 16),
    new THREE.MeshStandardMaterial({ color: 0x141619, roughness: 0.85, metalness: 0.05 })
  );
  boot.rotation.x = Math.PI / 2;
  boot.position.set(iecPortPos.x, iecPortPos.y, iecPortPos.z + 0.35);
  group.add(boot);

  // 2. Heavy-duty 3-conductor black PVC power cord along Catmull-Rom spline
  // Sweeps gracefully across the black epoxy tabletop surface to be clearly visible from CAM_ISO and CAM_SIDE
  const p0 = new THREE.Vector3(iecPortPos.x, iecPortPos.y, iecPortPos.z + 0.42);
  const p1 = new THREE.Vector3(iecPortPos.x, iecPortPos.y - 0.28, iecPortPos.z + 0.72);
  const p2 = new THREE.Vector3(iecPortPos.x + 0.35, 0.035, iecPortPos.z + 1.00);
  const p3 = new THREE.Vector3(-0.15, 0.035, 3.28);
  const p4 = new THREE.Vector3(0.85, 0.035, 3.48);
  const p5 = new THREE.Vector3(wallOutletPos.x, 0.22, wallOutletPos.z - 0.10);
  const p6 = new THREE.Vector3(wallOutletPos.x, wallOutletPos.y - 0.07, wallOutletPos.z - 0.04);

  const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4, p5, p6]);
  const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.034, 12, false);
  const cableMesh = new THREE.Mesh(tubeGeo, MAT_CABLE_PVC);
  cableMesh.castShadow = true;
  cableMesh.receiveShadow = true;
  group.add(cableMesh);

  // 3. Molded NEMA 5-15P AC wall plug inserted into duplex outlet receptacle
  const wallPlugGroup = new THREE.Group();
  wallPlugGroup.position.copy(p6);

  const plugHead = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.15, 0.22),
    MAT_CABLE_PVC
  );
  plugHead.position.set(0, 0, 0.08);
  plugHead.castShadow = true;
  wallPlugGroup.add(plugHead);

  // Grounded prongs inserted flush into wall socket
  for (const s of [-0.042, 0.042]) {
    const prong = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.044, 0.08),
      MAT_CHROME
    );
    prong.position.set(s, 0, 0.20);
    wallPlugGroup.add(prong);
  }
  const groundProng = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.09, 12),
    MAT_CHROME
  );
  groundProng.rotation.x = Math.PI / 2;
  groundProng.position.set(0, -0.042, 0.20);
  wallPlugGroup.add(groundProng);

  group.add(wallPlugGroup);
  return group;
}

/**
 * Converts wavelength in nm to RGB hex color for probe beam visualization.
 */
export function wavelengthToRGB(nm) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (nm >= 440 && nm < 490) {
    r = 0.0;
    g = (nm - 440) / (490 - 440);
    b = 1.0;
  } else if (nm >= 490 && nm < 510) {
    r = 0.0;
    g = 1.0;
    b = -(nm - 510) / (510 - 490);
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (nm >= 580 && nm < 645) {
    r = 1.0;
    g = -(nm - 645) / (645 - 580);
    b = 0.0;
  } else if (nm >= 645 && nm <= 750) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  } else if (nm < 380) {
    // Ultraviolet: render as intense violet-indigo glow
    r = 0.65;
    g = 0.15;
    b = 0.95;
  } else {
    // Near Infrared: render as deep garnet red
    r = 0.55;
    g = 0.05;
    b = 0.05;
  }
  return new THREE.Color(r, g, b);
}

/**
 * Main Builder Function for Shimadzu UV-1900i Spectrophotometer Digital Twin
 */
export function createSpectrophotometerModel(options = {}) {
  const root = new THREE.Group();
  root.name = 'Spectrophotometer_Assembly';

  const interactiveObjects = [];
  const animTargets = {
    chamberLidPivot: null,
    carouselPivot: null,
    probeBeam: null,
    probeBeamMat: null,
    deuteriumLampGlow: null,
    tungstenLampGlow: null,
    diffractionGrating: null,
    chopperWheel: null,
    sourceSelectorArm: null,
    coolingFanHub: null,
    lcdMesh: null,
    keycaps: {},
    opticalRays: null,
    opticalRayMats: [],
    powerCord: null,
    explodedParts: [],
  };

  // 1. Leveling Feet resting on datum plane Y = 0
  const footPositions = [
    [-1.9, 0, -2.1, 'FL'],
    [1.9, 0, -2.1, 'FR'],
    [-1.9, 0, 2.1, 'RL'],
    [1.9, 0, 2.1, 'RR'],
  ];
  footPositions.forEach(([fx, fy, fz, id]) => {
    const foot = createVibrationFoot(0.25, 0.28, 0.18);
    foot.name = `Foot_Leveling_${id}`;
    foot.position.set(fx, fy, fz);
    root.add(foot);
  });

  // Base elevation datum: bottom plate starts at Y = 0.18
  const BASE_Y = 0.18;

  // 2. Main Die-Cast Chassis Baseplate
  const baseplateGeo = new THREE.BoxGeometry(4.4, 0.12, 4.8);
  const baseplate = new THREE.Mesh(baseplateGeo, MAT_ALUM_ANODIZED);
  baseplate.position.set(0, BASE_Y + 0.06, 0);
  baseplate.receiveShadow = true;
  root.add(baseplate);

  // Group for parts that separate vertically during exploded view
  const explodedShellGroup = new THREE.Group();
  explodedShellGroup.name = 'Exploded_UpperShell_Group';
  root.add(explodedShellGroup);
  animTargets.explodedParts.push({ obj: explodedShellGroup, originY: 0, deltaY: 2.2 });

  // Chassis mesh collection for Optics View transparency swapping
  const chassisMeshes = [];

  // 3. Main Body Chassis Housing (Body_Chassis)
  const chassisGroup = new THREE.Group();
  chassisGroup.name = 'Body_Chassis';

  // Hollow rear chassis enclosure (optics bay housing: 4.36 x 1.80 x 2.38)
  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(4.36, 1.80, 0.04),
    MAT_CHASSIS
  );
  rearWall.position.set(0, BASE_Y + 0.12 + 0.90, 2.38 - 0.02);
  rearWall.castShadow = true;
  rearWall.receiveShadow = true;
  chassisGroup.add(rearWall);
  chassisMeshes.push(rearWall);

  const rearLeftWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.80, 2.38),
    MAT_CHASSIS
  );
  rearLeftWall.position.set(2.18 - 0.02, BASE_Y + 0.12 + 0.90, 1.19);
  rearLeftWall.castShadow = true;
  rearLeftWall.receiveShadow = true;
  chassisGroup.add(rearLeftWall);
  chassisMeshes.push(rearLeftWall);

  const rearRightWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.80, 2.38),
    MAT_CHASSIS
  );
  rearRightWall.position.set(-2.18 + 0.02, BASE_Y + 0.12 + 0.90, 1.19);
  rearRightWall.castShadow = true;
  rearRightWall.receiveShadow = true;
  chassisGroup.add(rearRightWall);
  chassisMeshes.push(rearRightWall);

  const upperDeckRoof = new THREE.Mesh(
    new THREE.BoxGeometry(4.36, 0.04, 2.38),
    MAT_CHASSIS
  );
  upperDeckRoof.position.set(0, BASE_Y + 0.12 + 1.80 - 0.02, 1.19);
  upperDeckRoof.castShadow = true;
  upperDeckRoof.receiveShadow = true;
  chassisGroup.add(upperDeckRoof);
  chassisMeshes.push(upperDeckRoof);
  animTargets.roofCover = upperDeckRoof;

  // Intermediate bulkhead dividing optics bay from front controls (Right side: X in [-2.18, 0])
  const frontOpticsDivider = new THREE.Mesh(
    new THREE.BoxGeometry(2.18, 1.10, 0.04),
    MAT_CHASSIS
  );
  frontOpticsDivider.position.set(-1.09, BASE_Y + 0.12 + 0.55, 0.02);
  frontOpticsDivider.castShadow = true;
  chassisGroup.add(frontOpticsDivider);
  chassisMeshes.push(frontOpticsDivider);

  // Upper vertical step bulkhead at Z = 0 (Left side: X in [0, 2.18])
  // Completely seals the 0.45m high gap between chamber roof (Y=1.65) and optics bay roof (Y=2.10)
  const stepBulkheadUpper = new THREE.Mesh(
    new THREE.BoxGeometry(2.18, 0.45, 0.04),
    MAT_CHASSIS
  );
  stepBulkheadUpper.position.set(1.09, BASE_Y + 0.12 + 1.575, 0.0);
  stepBulkheadUpper.castShadow = true;
  stepBulkheadUpper.receiveShadow = true;
  chassisGroup.add(stepBulkheadUpper);
  chassisMeshes.push(stepBulkheadUpper);

  // Lower chamber rear bulkhead at Z = 0 (Left side: X in [0, 2.18])
  // Seals rear of sample chamber cavity from Y=0.30 to Y=1.65
  const stepBulkheadLower = new THREE.Mesh(
    new THREE.BoxGeometry(2.18, 1.35, 0.04),
    MAT_CHASSIS
  );
  stepBulkheadLower.position.set(1.09, BASE_Y + 0.12 + 0.675, 0.0);
  stepBulkheadLower.castShadow = true;
  stepBulkheadLower.receiveShadow = true;
  chassisGroup.add(stepBulkheadLower);
  chassisMeshes.push(stepBulkheadLower);

  // High-end brushed champagne/chrome step transition trim runner along step seam
  const stepTrim = new THREE.Mesh(
    new THREE.BoxGeometry(2.18, 0.024, 0.035),
    MAT_CHROME
  );
  stepTrim.position.set(1.09, BASE_Y + 0.12 + 1.35 + 0.012, 0.01);
  chassisGroup.add(stepTrim);

  // Center chassis divider wall at X = 0 separating console from sample compartment
  const centerChassisDivider = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.10, 2.38),
    MAT_CHASSIS
  );
  centerChassisDivider.position.set(0.02, BASE_Y + 0.12 + 0.55, -1.19);
  centerChassisDivider.castShadow = true;
  centerChassisDivider.receiveShadow = true;
  chassisGroup.add(centerChassisDivider);
  chassisMeshes.push(centerChassisDivider);

  // Continuous exterior left chassis wall (X = 2.16, Z in [-2.38, 0])
  // Connects flush with rearLeftWall (X = 2.16, Z in [0, 2.38]) for seamless left profile
  const frontLeftWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.35, 2.38),
    MAT_CHASSIS
  );
  frontLeftWall.position.set(2.18 - 0.02, BASE_Y + 0.12 + 0.675, -1.19);
  frontLeftWall.castShadow = true;
  frontLeftWall.receiveShadow = true;
  chassisGroup.add(frontLeftWall);
  chassisMeshes.push(frontLeftWall);

  // Lower chassis front-right housing (under sloped console: front apron & right wall)
  const frontApron = new THREE.Mesh(
    new THREE.BoxGeometry(2.18, 1.10, 0.04),
    MAT_CHASSIS
  );
  frontApron.position.set(-1.09, BASE_Y + 0.12 + 0.55, -2.38 + 0.02);
  frontApron.castShadow = true;
  frontApron.receiveShadow = true;
  chassisGroup.add(frontApron);
  chassisMeshes.push(frontApron);

  const frontRightWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.10, 2.38),
    MAT_CHASSIS
  );
  frontRightWall.position.set(-2.18 + 0.02, BASE_Y + 0.12 + 0.55, -1.19);
  frontRightWall.castShadow = true;
  frontRightWall.receiveShadow = true;
  chassisGroup.add(frontRightWall);
  chassisMeshes.push(frontRightWall);

  // High-End Precision Reveals & Shadow-Gap Channels
  // Dark anthracite dividing channel separating optics bay from sample chamber
  const shadowGapDivider = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 1.22, 2.40),
    MAT_BEZEL
  );
  shadowGapDivider.position.set(0, BASE_Y + 0.72, -1.19);
  chassisGroup.add(shadowGapDivider);

  // Polished chrome upper ridge runner along top crown seam at Z = 0
  const ridgeRunner = new THREE.Mesh(
    new THREE.BoxGeometry(4.38, 0.025, 0.035),
    MAT_CHROME
  );
  ridgeRunner.position.set(0, 2.105, 0.0);
  chassisGroup.add(ridgeRunner);

  // Brushed aluminum side bumper rails with countersunk M3 hex socket screws
  for (const sx of [-2.19, 2.19]) {
    const bumper = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.08, 4.70),
      MAT_ALUM_ANODIZED
    );
    bumper.position.set(sx, BASE_Y + 0.40, 0);
    chassisGroup.add(bumper);

    for (let bz = -2.0; bz <= 2.0; bz += 1.0) {
      const screw = createHexSocketScrew(0.014, 0.04, { material: MAT_CHROME });
      screw.rotation.z = (sx > 0 ? -Math.PI / 2 : Math.PI / 2);
      screw.position.set(sx + (sx > 0 ? 0.014 : -0.014), BASE_Y + 0.40, bz);
      chassisGroup.add(screw);
    }
  }

  // 3D trapezoidal solid wedge for sloped front console (operator right: X in [-2.18, 0], Z in [-2.38, 0])
  // High-precision BufferGeometry with verified counter-clockwise outward normals on all 6 faces
  const v0 = [-2.18, 1.40, -2.38]; // front-right-bottom
  const v1 = [ 0.00, 1.40, -2.38]; // front-left-bottom
  const v2 = [ 0.00, 1.40,  0.00]; // rear-left-bottom
  const v3 = [-2.18, 1.40,  0.00]; // rear-right-bottom

  const v4 = [-2.18, 1.46, -2.38]; // front-right-top
  const v5 = [ 0.00, 1.46, -2.38]; // front-left-top
  const v6 = [ 0.00, 2.10,  0.00]; // rear-left-top
  const v7 = [-2.18, 2.10,  0.00]; // rear-right-top

  const wedgePositions = new Float32Array([
    // 1. Top sloped face (outward normal: [0, +0.966, -0.26] pointing up and forward)
    ...v4, ...v7, ...v6,   ...v4, ...v6, ...v5,
    // 2. Left cheek wall at X = 0 (outward normal: [+1, 0, 0] pointing into sample chamber)
    ...v1, ...v6, ...v2,   ...v1, ...v5, ...v6,
    // 3. Right cheek wall at X = -2.18 (outward normal: [-1, 0, 0] pointing to right exterior)
    ...v0, ...v3, ...v7,   ...v0, ...v7, ...v4,
    // 4. Front vertical riser at Z = -2.38 (outward normal: [0, 0, -1] pointing forward)
    ...v0, ...v5, ...v1,   ...v0, ...v4, ...v5,
    // 5. Rear vertical bulkhead at Z = 0.0 (outward normal: [0, 0, +1] pointing backward into optics bay)
    ...v3, ...v2, ...v6,   ...v3, ...v6, ...v7,
    // 6. Bottom face at Y = 1.40 (outward normal: [0, -1, 0] pointing downward)
    ...v0, ...v1, ...v2,   ...v0, ...v2, ...v3,
  ]);

  const wedgeUvs = new Float32Array([
    // Top
    0, 0,  1, 1,  0, 1,    0, 0,  1, 0,  1, 1,
    // Left
    0, 0,  1, 1,  1, 0,    0, 0,  0, 1,  1, 1,
    // Right
    0, 0,  1, 0,  1, 1,    0, 0,  1, 1,  0, 1,
    // Front
    0, 0,  1, 1,  1, 0,    0, 0,  0, 1,  1, 1,
    // Rear
    0, 0,  1, 0,  1, 1,    0, 0,  1, 1,  0, 1,
    // Bottom
    0, 0,  1, 0,  1, 1,    0, 0,  1, 1,  0, 1,
  ]);

  const slopeGeo = new THREE.BufferGeometry();
  slopeGeo.setAttribute('position', new THREE.BufferAttribute(wedgePositions, 3));
  slopeGeo.setAttribute('uv', new THREE.BufferAttribute(wedgeUvs, 2));
  slopeGeo.computeVertexNormals();
  slopeGeo.computeBoundingBox();
  slopeGeo.computeBoundingSphere();

  const consoleSlopeMesh = new THREE.Mesh(slopeGeo, MAT_CHASSIS);
  consoleSlopeMesh.name = 'Chassis_SlopedConsole';
  consoleSlopeMesh.position.set(0, 0, 0);
  consoleSlopeMesh.castShadow = true;
  consoleSlopeMesh.receiveShadow = true;
  chassisGroup.add(consoleSlopeMesh);
  chassisMeshes.push(consoleSlopeMesh);

  // Front sill accent runner between front apron and sloped deck
  const frontConsoleTrim = new THREE.Mesh(
    new THREE.BoxGeometry(2.18, 0.02, 0.03),
    MAT_CHROME
  );
  frontConsoleTrim.position.set(-1.09, 1.46, -2.38);
  chassisGroup.add(frontConsoleTrim);

  // 4. Sloped Console Assembly & Recessed Bezel
  const slopeAngle = Math.atan2(0.64, 2.38); // ~0.2625 rad (~15.04°)
  const bezelGroup = new THREE.Group();
  bezelGroup.name = 'Assembly_SlopedConsole';
  bezelGroup.position.set(-1.09, 1.78, -1.19);
  bezelGroup.rotation.x = -slopeAngle; // Tilts face up and forward toward operator
  chassisGroup.add(bezelGroup);

  // Recessed pocket tray
  const bezelTray = new THREE.Mesh(
    new THREE.BoxGeometry(1.88, 0.035, 1.54),
    MAT_BEZEL
  );
  bezelTray.name = 'Pocket_Bezel';
  bezelTray.position.set(0, 0.015, 0);
  bezelTray.castShadow = true;
  bezelTray.receiveShadow = true;
  bezelGroup.add(bezelTray);

  // High-End Brushed Champagne/Satin Chrome Perimeter Trim framing console
  const trimW = 0.022;
  const trimH = 0.028;
  const edgeTop = new THREE.Mesh(new THREE.BoxGeometry(1.88 + trimW * 2, trimH, trimW), MAT_CHROME);
  edgeTop.position.set(0, 0.022, 1.54 / 2 + trimW / 2);
  bezelGroup.add(edgeTop);

  const edgeBot = new THREE.Mesh(new THREE.BoxGeometry(1.88 + trimW * 2, trimH, trimW), MAT_CHROME);
  edgeBot.position.set(0, 0.022, -1.54 / 2 - trimW / 2);
  bezelGroup.add(edgeBot);

  const edgeLeft = new THREE.Mesh(new THREE.BoxGeometry(trimW, trimH, 1.54), MAT_CHROME);
  edgeLeft.position.set(-1.88 / 2 - trimW / 2, 0.022, 0);
  bezelGroup.add(edgeLeft);

  const edgeRight = new THREE.Mesh(new THREE.BoxGeometry(trimW, trimH, 1.54), MAT_CHROME);
  edgeRight.position.set(1.88 / 2 + trimW / 2, 0.022, 0);
  bezelGroup.add(edgeRight);

  // 5. Dynamic LCD Display (UI_LCD)
  const lcdW = 1.64;
  const lcdH = 0.94;
  const lcdGeo = new THREE.PlaneGeometry(lcdW, lcdH);
  // DIAG-005: Invert horizontal UV coordinates directly on the buffer to fix mirroring while preserving flipY = false
  const uvAttr = lcdGeo.attributes.uv;
  for (let i = 0; i < uvAttr.count; i++) {
    uvAttr.setX(i, 1.0 - uvAttr.getX(i));
  }
  uvAttr.needsUpdate = true;

  const lcdMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.name = 'UI_LCD';
  lcdMesh.rotation.x = -Math.PI / 2;
  lcdMesh.position.set(0, 0.034, 0.18);
  bezelGroup.add(lcdMesh);
  animTargets.lcdMesh = lcdMesh;

  // Touchscreen interactive helper quad for raycasting
  lcdMesh.userData = { name: 'UI_LCD_TOUCH', role: 'Display' };
  interactiveObjects.push(lcdMesh);

  // 6. Tactile Laser-Etched Physical Control Buttons
  const buttonConfigs = [
    { id: 'Btn_Power', label: 'POWER', sub: 'STANDBY', icon: '⏻', x: -0.64, z: -0.50, color: '#f43f5e', role: 'Power standby' },
    { id: 'Btn_Zero', label: 'ZERO', sub: 'BASELINE', icon: '0.00', x: -0.32, z: -0.50, color: '#eab308', role: 'Auto-zero baseline' },
    { id: 'Btn_Scan', label: 'SCAN', sub: 'SPECTRUM', icon: '▶', x: 0.0, z: -0.50, color: '#a855f7', role: 'Spectrum scan' },
    { id: 'Btn_Mode', label: 'MODE', sub: 'SYS SEL', icon: '⇄', x: 0.32, z: -0.50, color: '#06b6d4', role: 'Cycle measurement mode' },
    { id: 'Btn_CellNext', label: 'CELL', sub: '1-6 CH', icon: '⏭', x: 0.64, z: -0.50, color: '#3b82f6', role: 'Advance carousel cell' },
  ];

  buttonConfigs.forEach((cfg) => {
    const keyItem = createLabeledKeycap(cfg);
    keyItem.group.position.set(cfg.x, 0.024, cfg.z);
    bezelGroup.add(keyItem.group);
    interactiveObjects.push(keyItem.group);
    animTargets.keycaps[cfg.id] = keyItem.capGroup;
  });

  // 7. SREdesigns Brand Emblem Badge (Badge_SREdesigns)
  const badge = makeSREdesignsBadge(0.55);
  badge.position.set(-1.09, BASE_Y + 0.70, -2.385);
  badge.rotation.y = Math.PI; // Faces -Z forward towards operator and front camera
  chassisGroup.add(badge);

  // Front air intake louvers
  for (let i = 0; i < 6; i++) {
    const louver = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.02, 0.04),
      MAT_CHASSIS_DARK
    );
    louver.position.set(-1.09, BASE_Y + 0.25 + (i * 0.065), -2.382);
    chassisGroup.add(louver);
  }

  explodedShellGroup.add(chassisGroup);

  // 8. Light-Tight Hollow Sample Chamber Basin & Walls (Operator Left: +X)
  const CHAMBER_CENTER_X = 1.05;
  const CHAMBER_CENTER_Z = -1.18;
  const CHAMBER_FLOOR_Y = BASE_Y + 0.22;

  // Solid perimeter top deck frame surrounding the sample chamber lid opening (Datum Y = 1.65)
  // Eliminates all voids, light-leaks, and open holes
  const deckCollarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.04, 2.38), MAT_CHASSIS);
  deckCollarLeft.position.set(2.08, BASE_Y + 0.12 + 1.33, -1.19);
  deckCollarLeft.castShadow = true;
  deckCollarLeft.receiveShadow = true;
  explodedShellGroup.add(deckCollarLeft);
  chassisMeshes.push(deckCollarLeft);

  const deckCollarRight = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.04, 2.38), MAT_CHASSIS);
  deckCollarRight.position.set(0.065, BASE_Y + 0.12 + 1.33, -1.19);
  deckCollarRight.castShadow = true;
  deckCollarRight.receiveShadow = true;
  explodedShellGroup.add(deckCollarRight);
  chassisMeshes.push(deckCollarRight);

  const deckCollarRear = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.04, 0.12), MAT_CHASSIS);
  deckCollarRear.position.set(1.09, BASE_Y + 0.12 + 1.33, -0.06);
  deckCollarRear.castShadow = true;
  deckCollarRear.receiveShadow = true;
  explodedShellGroup.add(deckCollarRear);
  chassisMeshes.push(deckCollarRear);

  // Front lower sill under door apron (Y in [0.30, 0.58])
  const frontSill = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.28, 0.14), MAT_CHASSIS);
  frontSill.position.set(1.09, BASE_Y + 0.12 + 0.14, -2.31);
  frontSill.castShadow = true;
  frontSill.receiveShadow = true;
  explodedShellGroup.add(frontSill);
  chassisMeshes.push(frontSill);

  // Recessed perimeter rebate shelf (gasket lip) around the chamber opening
  const rebateGasket = new THREE.Mesh(
    new THREE.BoxGeometry(1.88, 0.02, 2.14),
    MAT_CHAMBER_INNER
  );
  rebateGasket.position.set(CHAMBER_CENTER_X, BASE_Y + 0.12 + 1.31, -1.18);
  explodedShellGroup.add(rebateGasket);

  // Precision stainless steel hinge barrels at rear of lid opening
  for (const hx of [0.45, 1.65]) {
    const hingeBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.12, 16),
      MAT_CHROME
    );
    hingeBarrel.rotation.z = Math.PI / 2;
    hingeBarrel.position.set(hx, BASE_Y + 0.12 + 1.34, -0.12);
    hingeBarrel.castShadow = true;
    explodedShellGroup.add(hingeBarrel);
  }

  // Matte black interior chamber cavity lining (Zero light reflections)
  const chamberLinerFloor = new THREE.Mesh(
    new THREE.BoxGeometry(1.76, 0.02, 2.06),
    MAT_CHAMBER_INNER
  );
  chamberLinerFloor.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 0.01, CHAMBER_CENTER_Z);
  chamberLinerFloor.receiveShadow = true;
  explodedShellGroup.add(chamberLinerFloor);

  const linerLeft = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.20, 2.06), MAT_CHAMBER_INNER);
  linerLeft.position.set(1.92, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z);
  explodedShellGroup.add(linerLeft);

  const linerRight = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.20, 2.06), MAT_CHAMBER_INNER);
  linerRight.position.set(0.18, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z);
  explodedShellGroup.add(linerRight);

  const linerBack = new THREE.Mesh(new THREE.BoxGeometry(1.74, 1.20, 0.02), MAT_CHAMBER_INNER);
  linerBack.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 0.60, -0.15);
  explodedShellGroup.add(linerBack);

  const linerFront = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.20, 0.02), MAT_CHAMBER_INNER);
  linerFront.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 0.10, -2.23);
  explodedShellGroup.add(linerFront);

  // Beam aperture entry collimator ring
  const enterAperture = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16),
    MAT_CHROME
  );
  enterAperture.rotation.z = Math.PI / 2;
  enterAperture.position.set(0.19, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z);
  explodedShellGroup.add(enterAperture);

  // Beam aperture exit lens bezel
  const exitAperture = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16),
    MAT_CHROME
  );
  exitAperture.rotation.z = Math.PI / 2;
  exitAperture.position.set(1.91, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z);
  explodedShellGroup.add(exitAperture);

  // Safety interlock microswitch pin on deck collar (engages when door closes)
  const interlockPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.035, 12),
    MAT_CHROME
  );
  interlockPin.position.set(0.32, BASE_Y + 0.12 + 1.35 + 0.012, -0.12);
  explodedShellGroup.add(interlockPin);

  // 9. Sample Chamber Hinged L-Shaped Door (Pivot_ChamberLid)
  // Full physical raycast interactivity: clicking anywhere on the door or handle opens/closes it
  const chamberLidPivot = new THREE.Group();
  chamberLidPivot.name = 'Pivot_ChamberLid';
  chamberLidPivot.position.set(CHAMBER_CENTER_X, BASE_Y + 0.12 + 1.35, -0.12);
  explodedShellGroup.add(chamberLidPivot);
  animTargets.chamberLidPivot = chamberLidPivot;

  // Top horizontal door plate (fits flush into deck collar rebate with 2mm shadow gaps)
  const doorPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.82, 0.06, 2.10),
    MAT_CHASSIS
  );
  doorPlate.name = 'Door_TopPlate';
  doorPlate.position.set(0, -0.01, -1.05);
  doorPlate.castShadow = true;
  doorPlate.receiveShadow = true;
  chamberLidPivot.add(doorPlate);
  chassisMeshes.push(doorPlate);

  // Front vertical door apron (descends flush to front sill at Y = 0.58)
  const doorFrontApron = new THREE.Mesh(
    new THREE.BoxGeometry(1.82, 1.07, 0.12),
    MAT_CHASSIS
  );
  doorFrontApron.name = 'Door_FrontApron';
  doorFrontApron.position.set(0, -0.535, -2.04);
  doorFrontApron.castShadow = true;
  doorFrontApron.receiveShadow = true;
  chamberLidPivot.add(doorFrontApron);
  chassisMeshes.push(doorFrontApron);

  // Polished chrome lower edge trim runner on door apron
  const doorTrimRunner = new THREE.Mesh(
    new THREE.BoxGeometry(1.84, 0.024, 0.04),
    MAT_CHROME
  );
  doorTrimRunner.name = 'Door_TrimRunner';
  doorTrimRunner.position.set(0, -1.06, -2.04);
  chamberLidPivot.add(doorTrimRunner);

  // Silicone light-baffle gasket seals on door underside and apron interior
  const sealTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.76, 0.018, 2.02),
    MAT_CHAMBER_INNER
  );
  sealTop.position.set(0, -0.045, -1.05);
  chamberLidPivot.add(sealTop);

  const sealFront = new THREE.Mesh(
    new THREE.BoxGeometry(1.76, 1.00, 0.018),
    MAT_CHAMBER_INNER
  );
  sealFront.position.set(0, -0.535, -1.97);
  chamberLidPivot.add(sealFront);

  // Knurled Satin-Chrome Precision Pull Handle
  const handleGroup = new THREE.Group();
  handleGroup.name = 'Btn_Lid_Handle';
  handleGroup.position.set(0, -0.18, -2.12);

  const handleBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024, 0.024, 0.52, 24),
    MAT_CHROME
  );
  handleBar.rotation.z = Math.PI / 2;
  handleBar.position.z = -0.055;
  handleBar.castShadow = true;
  handleGroup.add(handleBar);

  for (const s of [-0.22, 0.22]) {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.065, 16),
      MAT_CHROME
    );
    post.rotation.x = Math.PI / 2;
    post.position.set(s, 0, -0.025);
    handleGroup.add(post);
  }
  chamberLidPivot.add(handleGroup);

  // Universal door action payload for direct physical clicking on any door component
  const doorActionData = {
    name: 'Btn_Lid',
    action: 'Toggle Chamber Door (Click to Open/Close)',
    role: 'Chamber Door',
  };
  chamberLidPivot.userData = doorActionData;
  doorPlate.userData = doorActionData;
  doorFrontApron.userData = doorActionData;
  doorTrimRunner.userData = doorActionData;
  handleGroup.userData = doorActionData;

  interactiveObjects.push(doorPlate, doorFrontApron, doorTrimRunner, handleGroup);

  // 10. 6-Position Motorized Cuvette Carousel (Pivot_CellCarousel)
  const carouselPivot = new THREE.Group();
  carouselPivot.name = 'Pivot_CellCarousel';
  carouselPivot.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 0.28, CHAMBER_CENTER_Z);
  root.add(carouselPivot);
  animTargets.carouselPivot = carouselPivot;
  animTargets.explodedParts.push({ obj: carouselPivot, originY: CHAMBER_FLOOR_Y + 0.28, deltaY: 0.6 });

  // Central rotary hub disk
  const hubDisk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 0.12, 32),
    MAT_ALUM_ANODIZED
  );
  hubDisk.castShadow = true;
  hubDisk.receiveShadow = true;
  carouselPivot.add(hubDisk);

  // Center drive spindle
  const spindle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.26, 20),
    MAT_CHROME
  );
  spindle.position.y = 0.12;
  carouselPivot.add(spindle);

  // 6 Cuvette Cells spaced at 60° increments
  const cuvetteRadius = 0.54;
  const cuvetteMeshes = [];

  for (let c = 0; c < 6; c++) {
    const angle = (c * Math.PI) / 3;
    const cx = Math.cos(angle) * cuvetteRadius;
    const cz = Math.sin(angle) * cuvetteRadius;

    const cellHolder = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.32, 0.24),
      MAT_CHASSIS_DARK
    );
    cellHolder.position.set(cx, 0.14, cz);
    cellHolder.castShadow = true;
    carouselPivot.add(cellHolder);

    const cuvetteMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.50, 0.18),
      MAT_OPTICAL_GLASS
    );
    cuvetteMesh.name = `Glass_Cuvette_${c + 1}`;
    cuvetteMesh.position.set(cx, 0.42, cz);
    cuvetteMesh.castShadow = true;
    cuvetteMesh.userData = { name: cuvetteMesh.name, cellNumber: c + 1, role: 'Sample Cuvette' };
    carouselPivot.add(cuvetteMesh);
    cuvetteMeshes.push(cuvetteMesh);
    interactiveObjects.push(cuvetteMesh);

    // Colored liquid column inside each sample cuvette
    const sampleColors = [0xe2e8f0, 0xa855f7, 0x06b6d4, 0xf59e0b, 0x10b981, 0xef4444];
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: sampleColors[c],
      transmission: 0.85,
      opacity: 0.90,
      transparent: true,
      roughness: 0.08,
      ior: 1.33,
    });
    const liquidMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.42, 0.15),
      liquidMat
    );
    liquidMesh.position.set(cx, 0.38, cz);
    carouselPivot.add(liquidMesh);
  }

  // Monochromatic probe beam across sample chamber
  const beamGeo = new THREE.CylinderGeometry(0.024, 0.024, 1.84, 16);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.80,
  });
  const probeBeam = new THREE.Mesh(beamGeo, beamMat);
  probeBeam.name = 'Beam_Monochromatic';
  probeBeam.rotation.z = Math.PI / 2;
  probeBeam.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z);
  root.add(probeBeam);
  animTargets.probeBeam = probeBeam;
  animTargets.probeBeamMat = beamMat;

  // =========================================================================
  // 11. Comprehensive Procedural Optics Bay & Internal Subsystems
  // ("where is all the actual things happening inside of the machine?")
  // =========================================================================
  const opticsGroup = new THREE.Group();
  opticsGroup.name = 'Assembly_OpticsBay';
  root.add(opticsGroup);

  // Cast aluminum optical bench breadboard baseplate
  const breadboard = new THREE.Mesh(
    new THREE.BoxGeometry(2.10, 0.06, 2.25),
    MAT_ALUM_BREADBOARD
  );
  breadboard.position.set(-0.95, BASE_Y + 0.16, 1.15);
  breadboard.receiveShadow = true;
  opticsGroup.add(breadboard);

  // Tapped mounting hole grid on breadboard
  for (let gx = -0.90; gx <= 0.90; gx += 0.30) {
    for (let gz = -0.90; gz <= 0.90; gz += 0.30) {
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.065, 8),
        MAT_CHASSIS_DARK
      );
      hole.position.set(-0.95 + gx, BASE_Y + 0.165, 1.15 + gz);
      opticsGroup.add(hole);
    }
  }

  // A. Deuterium UV Arc Lamp Assembly (D2, 190 - 340 nm)
  const d2Assembly = new THREE.Group();
  d2Assembly.position.set(-1.50, BASE_Y + 0.65, 1.50);
  opticsGroup.add(d2Assembly);

  // Finned aluminum heatsink body
  const d2Sink = new THREE.Mesh(
    new THREE.CylinderGeometry(0.20, 0.20, 0.55, 24),
    MAT_ALUM_ANODIZED
  );
  d2Assembly.add(d2Sink);

  // 12 radial cooling fins
  for (let f = 0; f < 12; f++) {
    const angle = (f * Math.PI) / 6;
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.52, 0.10),
      MAT_ALUM_ANODIZED
    );
    fin.position.set(Math.cos(angle) * 0.24, 0, Math.sin(angle) * 0.24);
    fin.rotation.y = -angle;
    d2Assembly.add(fin);
  }

  // Ceramic top insulator cap with braided leads
  const d2Cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.10, 16),
    new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2 })
  );
  d2Cap.position.y = 0.32;
  d2Assembly.add(d2Cap);

  // Brass lens retaining cell with synthetic fused silica condenser lens
  const d2LensCell = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.09, 16),
    MAT_CHROME
  );
  d2LensCell.rotation.z = Math.PI / 2;
  d2LensCell.position.set(0.22, 0, 0);
  d2Assembly.add(d2LensCell);

  const d2Lens = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    MAT_OPTICAL_GLASS
  );
  d2Lens.rotation.z = -Math.PI / 2;
  d2Lens.position.set(0.24, 0, 0);
  d2Assembly.add(d2Lens);

  // Glowing UV arc plasma discharge tube
  const d2Bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xc084fc })
  );
  d2Bulb.position.set(0, 0, 0);
  d2Assembly.add(d2Bulb);
  animTargets.deuteriumLampGlow = d2Bulb;

  // B. Tungsten-Halogen Visible Lamp Assembly (WI, 340 - 1100 nm)
  const wAssembly = new THREE.Group();
  wAssembly.position.set(-1.50, BASE_Y + 0.65, 0.50);
  opticsGroup.add(wAssembly);

  // Gold-plated parabolic reflector cup
  const wReflector = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.06, 0.32, 24, 1, true),
    MAT_GOLD_MIRROR
  );
  wReflector.rotation.z = -Math.PI / 2;
  wReflector.position.set(0.10, 0, 0);
  wAssembly.add(wReflector);

  // Anodized bracket with heat sink fins
  const wBracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.42, 0.18),
    MAT_ALUM_ANODIZED
  );
  wBracket.position.set(-0.08, 0, 0);
  wAssembly.add(wBracket);

  // Quartz halogen bulb with coiled tungsten filament
  const wBulb = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.16, 16),
    new THREE.MeshBasicMaterial({ color: 0xfff0aa })
  );
  wBulb.rotation.z = Math.PI / 2;
  wBulb.position.set(0.10, 0, 0);
  wAssembly.add(wBulb);
  animTargets.tungstenLampGlow = wBulb;

  // Schott KG3 heat-absorbing optical glass filter
  const wFilter = new THREE.Mesh(
    new THREE.BoxGeometry(0.015, 0.14, 0.14),
    MAT_OPTICAL_GLASS
  );
  wFilter.position.set(0.24, 0, 0);
  wAssembly.add(wFilter);

  // C. Source Selection Rotary Mirror & Stepper Motor
  const sourceSelectorGroup = new THREE.Group();
  sourceSelectorGroup.position.set(-1.08, BASE_Y + 0.65, 1.00);
  opticsGroup.add(sourceSelectorGroup);

  const selMotor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.10, 0.10, 0.14, 16),
    MAT_ALUM_ANODIZED
  );
  selMotor.position.y = -0.12;
  sourceSelectorGroup.add(selMotor);

  const sourceSelectorArm = new THREE.Group();
  sourceSelectorGroup.add(sourceSelectorArm);
  animTargets.sourceSelectorArm = sourceSelectorArm;

  const selMirror = new THREE.Mesh(
    new THREE.BoxGeometry(0.012, 0.14, 0.14),
    MAT_CHROME
  );
  selMirror.position.set(0, 0, 0);
  selMirror.rotation.y = Math.PI / 4;
  sourceSelectorArm.add(selMirror);

  // D. Czerny-Turner Monochromator Optical Subsystem
  const monoBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.40, 0.12, 1.65),
    MAT_CHASSIS_DARK
  );
  monoBase.position.set(-0.25, BASE_Y + 0.32, 1.05);
  opticsGroup.add(monoBase);

  // Entrance Slit with precision micrometer jaws
  const enterSlit = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.18, 0.12),
    MAT_CHROME
  );
  enterSlit.position.set(-0.90, BASE_Y + 0.65, 1.00);
  opticsGroup.add(enterSlit);

  // Collimating Concave Spherical Mirror with 3-point kinematic gimbal mount
  const colMirrorGroup = new THREE.Group();
  colMirrorGroup.position.set(-0.65, BASE_Y + 0.65, 1.70);
  colMirrorGroup.rotation.y = -0.45;
  opticsGroup.add(colMirrorGroup);

  const colMount = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.04, 20),
    MAT_ALUM_ANODIZED
  );
  colMount.rotation.x = Math.PI / 2;
  colMirrorGroup.add(colMount);

  const colMirror = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.02, 24),
    MAT_CHROME
  );
  colMirror.rotation.x = Math.PI / 2;
  colMirror.position.z = 0.02;
  colMirrorGroup.add(colMirror);

  // Holographic Blazed Planar Diffraction Grating (1200 lines/mm)
  const gratingGroup = new THREE.Group();
  gratingGroup.position.set(-0.25, BASE_Y + 0.65, 1.15);
  opticsGroup.add(gratingGroup);

  const gratingSineBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.08, 24),
    MAT_ALUM_ANODIZED
  );
  gratingSineBar.position.y = -0.10;
  gratingGroup.add(gratingSineBar);

  const gratingTile = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.22, 0.22),
    MAT_HOLO_GRATING
  );
  gratingTile.rotation.y = 0.25;
  gratingGroup.add(gratingTile);
  animTargets.diffractionGrating = gratingGroup;

  // Focusing Concave Spherical Mirror
  const focMirrorGroup = new THREE.Group();
  focMirrorGroup.position.set(0.15, BASE_Y + 0.65, 1.70);
  focMirrorGroup.rotation.y = 0.45;
  opticsGroup.add(focMirrorGroup);

  const focMount = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.04, 20),
    MAT_ALUM_ANODIZED
  );
  focMount.rotation.x = Math.PI / 2;
  focMirrorGroup.add(focMount);

  const focMirror = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.02, 24),
    MAT_CHROME
  );
  focMirror.rotation.x = Math.PI / 2;
  focMirror.position.z = 0.02;
  focMirrorGroup.add(focMirror);

  // Exit Slit Assembly
  const exitSlit = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.18, 0.12),
    MAT_CHROME
  );
  exitSlit.position.set(0.18, BASE_Y + 0.65, 1.05);
  opticsGroup.add(exitSlit);

  // Motorized Order-Sorting Filter Wheel (6 optical filters)
  const filterWheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.20, 0.20, 0.02, 24),
    MAT_ALUM_ANODIZED
  );
  filterWheel.rotation.x = Math.PI / 2;
  filterWheel.position.set(0.18, BASE_Y + 0.65, 0.90);
  opticsGroup.add(filterWheel);

  // E. Dual-Beam Rotating Sector Chopper Wheel
  const chopperGroup = new THREE.Group();
  chopperGroup.position.set(0.18, BASE_Y + 0.65, 0.60);
  opticsGroup.add(chopperGroup);

  const chopperMotor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16),
    MAT_ALUM_ANODIZED
  );
  chopperMotor.rotation.x = Math.PI / 2;
  chopperMotor.position.z = -0.10;
  chopperGroup.add(chopperMotor);

  const chopperBlade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.015, 24),
    MAT_CHROME
  );
  chopperBlade.rotation.x = Math.PI / 2;
  chopperGroup.add(chopperBlade);
  animTargets.chopperWheel = chopperBlade;

  // F. Dual Beam Fold Mirrors & Reference Channel
  const refMirror1 = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.14, 0.14), MAT_CHROME);
  refMirror1.rotation.y = Math.PI / 4;
  refMirror1.position.set(0.18, BASE_Y + 0.60, 0.30);
  opticsGroup.add(refMirror1);

  const refMirror2 = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.14, 0.14), MAT_CHROME);
  refMirror2.rotation.y = -Math.PI / 4;
  refMirror2.position.set(0.55, BASE_Y + 0.60, 0.30);
  opticsGroup.add(refMirror2);

  // Reference cell holder & quartz reference cuvette
  const refCellHolder = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.30, 0.22),
    MAT_CHASSIS_DARK
  );
  refCellHolder.position.set(0.55, BASE_Y + 0.45, -0.60);
  opticsGroup.add(refCellHolder);

  const refCuvette = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.48, 0.16),
    MAT_OPTICAL_GLASS
  );
  refCuvette.position.set(0.55, BASE_Y + 0.65, -0.60);
  opticsGroup.add(refCuvette);

  // G. Dual Silicon Photodiode Detector Bays
  // Reference Detector
  const refDetector = new THREE.Mesh(
    new THREE.CylinderGeometry(0.10, 0.10, 0.25, 20),
    MAT_ALUM_ANODIZED
  );
  refDetector.rotation.x = Math.PI / 2;
  refDetector.position.set(0.55, BASE_Y + 0.60, -1.20);
  opticsGroup.add(refDetector);

  // Sample Detector (housed inside the left chassis wall cavity, completely inboard of X = 2.14)
  const sampleDetector = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.12, 20),
    MAT_ALUM_ANODIZED
  );
  sampleDetector.rotation.z = Math.PI / 2;
  sampleDetector.position.set(1.98, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z);
  opticsGroup.add(sampleDetector);

  // Low-noise preamplifier analog PCB board safely mounted inside internal sensor bay (X = 2.06)
  const preAmpPCB = new THREE.Mesh(
    new THREE.BoxGeometry(0.014, 0.32, 0.42),
    MAT_PCB_GREEN
  );
  preAmpPCB.position.set(2.06, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z);
  opticsGroup.add(preAmpPCB);

  // Mu-metal shield can enclosed inside wall cavity (outer edge X = 2.092 < 2.14)
  const shieldCan = new THREE.Mesh(
    new THREE.BoxGeometry(0.024, 0.22, 0.28),
    MAT_CHROME
  );
  shieldCan.position.set(2.08, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z);
  opticsGroup.add(shieldCan);

  // H. Electronics & Switch-Mode Power Supply (SMPS)
  const smpsBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.60, 0.08, 0.90),
    MAT_PCB_GREEN
  );
  smpsBase.position.set(-1.10, BASE_Y + 0.18, -0.55);
  opticsGroup.add(smpsBase);

  // Toroidal transformer & high-voltage filter caps
  const smpsToroid = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.055, 12, 24),
    new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6, metalness: 0.5 })
  );
  smpsToroid.rotation.x = Math.PI / 2;
  smpsToroid.position.set(-1.45, BASE_Y + 0.32, -0.55);
  opticsGroup.add(smpsToroid);

  for (let c = 0; c < 3; c++) {
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.22, 16),
      MAT_CHASSIS_DARK
    );
    cap.position.set(-1.05 + (c * 0.16), BASE_Y + 0.32, -0.55);
    opticsGroup.add(cap);
  }

  // 80mm Rear Brushless Cooling Fan
  const fanGroup = new THREE.Group();
  fanGroup.position.set(1.40, BASE_Y + 1.25, 2.36);
  opticsGroup.add(fanGroup);

  const fanFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.70, 0.70, 0.10),
    MAT_CHASSIS_DARK
  );
  fanGroup.add(fanFrame);

  const fanHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16),
    MAT_ALUM_ANODIZED
  );
  fanHub.rotation.x = Math.PI / 2;
  fanGroup.add(fanHub);
  animTargets.coolingFanHub = fanHub;

  for (let b = 0; b < 7; b++) {
    const angle = (b * Math.PI * 2) / 7;
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.20, 0.015, 0.06),
      MAT_CHASSIS_DARK
    );
    blade.position.set(Math.cos(angle) * 0.18, Math.sin(angle) * 0.18, 0);
    blade.rotation.z = angle + 0.3;
    fanHub.add(blade);
  }

  // =========================================================================
  // I. Animated 3D Optical Ray Tracing (Internal Light Path)
  // =========================================================================
  const opticalRaysGroup = new THREE.Group();
  opticalRaysGroup.name = 'Assembly_OpticalRays';
  opticalRaysGroup.visible = false; // Toggled via Optics View
  opticsGroup.add(opticalRaysGroup);
  animTargets.opticalRays = opticalRaysGroup;

  function createLaserRay(start, end, colorHex = 0x00ffff, radius = 0.016) {
    const distance = start.distanceTo(end);
    const geo = new THREE.CylinderGeometry(radius, radius, distance, 12);
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.85,
    });
    const ray = new THREE.Mesh(geo, mat);

    // Orient cylinder along ray vector
    const dir = end.clone().sub(start).normalize();
    const mid = start.clone().add(end).multiplyScalar(0.5);
    ray.position.copy(mid);
    ray.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

    opticalRaysGroup.add(ray);
    animTargets.opticalRayMats.push(mat);
    return { ray, mat };
  }

  // 1. Active Lamp -> Selector Mirror
  const raySourceD2 = createLaserRay(new THREE.Vector3(-1.50, BASE_Y + 0.65, 1.50), new THREE.Vector3(-1.08, BASE_Y + 0.65, 1.00), 0xc084fc);
  const raySourceW = createLaserRay(new THREE.Vector3(-1.50, BASE_Y + 0.65, 0.50), new THREE.Vector3(-1.08, BASE_Y + 0.65, 1.00), 0xfbbf24);

  // 2. Selector Mirror -> Entrance Slit
  createLaserRay(new THREE.Vector3(-1.08, BASE_Y + 0.65, 1.00), new THREE.Vector3(-0.90, BASE_Y + 0.65, 1.00), 0x38bdf8);

  // 3. Entrance Slit -> Collimating Mirror
  createLaserRay(new THREE.Vector3(-0.90, BASE_Y + 0.65, 1.00), new THREE.Vector3(-0.65, BASE_Y + 0.65, 1.70), 0x38bdf8);

  // 4. Collimating Mirror -> Holographic Diffraction Grating
  createLaserRay(new THREE.Vector3(-0.65, BASE_Y + 0.65, 1.70), new THREE.Vector3(-0.25, BASE_Y + 0.65, 1.15), 0x38bdf8);

  // 5. Holographic Grating -> Dispersed Spectral Fan -> Focusing Mirror
  createLaserRay(new THREE.Vector3(-0.25, BASE_Y + 0.65, 1.15), new THREE.Vector3(0.15, BASE_Y + 0.65, 1.70), 0xa855f7, 0.022);
  createLaserRay(new THREE.Vector3(-0.25, BASE_Y + 0.65, 1.15), new THREE.Vector3(0.05, BASE_Y + 0.65, 1.70), 0x10b981, 0.018);
  createLaserRay(new THREE.Vector3(-0.25, BASE_Y + 0.65, 1.15), new THREE.Vector3(0.25, BASE_Y + 0.65, 1.70), 0xef4444, 0.018);

  // 6. Focusing Mirror -> Exit Slit -> Filter Wheel -> Chopper
  createLaserRay(new THREE.Vector3(0.15, BASE_Y + 0.65, 1.70), new THREE.Vector3(0.18, BASE_Y + 0.65, 1.05), 0x00ffff);
  createLaserRay(new THREE.Vector3(0.18, BASE_Y + 0.65, 1.05), new THREE.Vector3(0.18, BASE_Y + 0.65, 0.60), 0x00ffff);

  // 7. Chopper -> Sample Beam (passes straight through cuvette to sample detector)
  createLaserRay(new THREE.Vector3(0.18, BASE_Y + 0.60, 0.60), new THREE.Vector3(CHAMBER_CENTER_X - 0.87, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z), 0x00ffff);
  createLaserRay(new THREE.Vector3(CHAMBER_CENTER_X + 0.87, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z), new THREE.Vector3(CHAMBER_CENTER_X + 0.96, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z), 0x00ffff);

  // 8. Chopper -> Reference Beam (reflects through fold mirrors to reference detector)
  createLaserRay(new THREE.Vector3(0.18, BASE_Y + 0.60, 0.60), new THREE.Vector3(0.18, BASE_Y + 0.60, 0.30), 0x38bdf8);
  createLaserRay(new THREE.Vector3(0.18, BASE_Y + 0.60, 0.30), new THREE.Vector3(0.55, BASE_Y + 0.60, 0.30), 0x38bdf8);
  createLaserRay(new THREE.Vector3(0.55, BASE_Y + 0.60, 0.30), new THREE.Vector3(0.55, BASE_Y + 0.60, -1.20), 0x38bdf8);

  // J. Internal Optics Bay Inspection Spotlight (illuminates breadboard & optics train)
  const interiorLight = new THREE.PointLight(0xffffff, 2.8, 8);
  interiorLight.position.set(0, BASE_Y + 1.35, 1.18);
  interiorLight.visible = false;
  opticsGroup.add(interiorLight);
  animTargets.interiorLight = interiorLight;

  // 12. Genuine 3D Fasteners (Rule 1: Exhaustive Procedural Detail)
  const fastenerLocations = [
    [-2.05, BASE_Y + 1.25, 0.15],
    [2.05, BASE_Y + 1.25, 0.15],
    [-2.05, BASE_Y + 1.25, 2.25],
    [2.05, BASE_Y + 1.25, 2.25],
  ];
  fastenerLocations.forEach(([fx, fy, fz], idx) => {
    const washer = createWasher(0.018, 0.038, 0.008, { material: MAT_CHROME });
    washer.position.set(fx, fy + 0.68, fz);
    const screw = createHexSocketScrew(0.016, 0.08, { material: MAT_CHROME });
    screw.name = `Fastener_HexM3_${idx + 1}`;
    screw.position.set(fx, fy + 0.68, fz);
    chassisGroup.add(washer);
    chassisGroup.add(screw);
  });

  // 13. Rear Bulkhead Panel Connectors & AC Power Cord (Back face Z = 2.38)
  const rearZ = 2.385;

  // IEC C14 Power Inlet Receptacle
  const iecPort = createIECInlet();
  iecPort.rotation.y = Math.PI;
  iecPort.position.set(-1.4, BASE_Y + 0.45, rearZ);
  root.add(iecPort);

  // Dedicated Duplex AC Electrical Wall Outlet Position
  const wallOutletPos = new THREE.Vector3(1.40, 0.55, 3.65);

  // Real 3D Molded AC Power Cord: curves gracefully across bench and plugs into wall outlet
  const powerCord = createPowerCord(new THREE.Vector3(-1.4, BASE_Y + 0.45, rearZ), wallOutletPos);
  root.add(powerCord);
  animTargets.powerCord = powerCord;

  // Rocker Power Switch
  const rocker = createRockerSwitch({ illuminated: true, red: true });
  rocker.rotation.y = Math.PI;
  rocker.position.set(-0.8, BASE_Y + 0.45, rearZ);
  root.add(rocker);

  // Dual USB-A Ports
  for (let u = 0; u < 2; u++) {
    const usb = createUSBPort();
    usb.rotation.y = Math.PI;
    usb.position.set(-0.2 + (u * 0.22), BASE_Y + 0.45, rearZ);
    root.add(usb);
  }

  // DB9 RS-232 Serial Port
  const db9 = createDB9Port();
  db9.rotation.y = Math.PI;
  db9.position.set(0.65, BASE_Y + 0.45, rearZ);
  root.add(db9);

  // BNC External Trigger Jack
  const bnc = createBNCJack();
  bnc.rotation.y = Math.PI;
  bnc.position.set(1.3, BASE_Y + 0.45, rearZ);
  root.add(bnc);

  // Rear exhaust fan grille louvers
  for (let f = 0; f < 8; f++) {
    const fanLouver = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.02, 0.04),
      MAT_CHASSIS_DARK
    );
    fanLouver.position.set(1.4, BASE_Y + 0.95 + (f * 0.08), rearZ);
    root.add(fanLouver);
  }

  // 14. Photorealistic Laboratory Bench & Continuous Room Enclosure (Hotplate Twin Gold Standard)
  if (options.includeLab !== false) {
    const labGroup = new THREE.Group();
    labGroup.name = 'Lab_Environment';

    // Black Epoxy Lab Countertop (Width 12.0, Depth 7.3, Height 0.25, Datum surface Y = 0.0)
    const matCountertop = new THREE.MeshStandardMaterial({
      color: 0x11161d,
      roughness: 0.22,
      metalness: 0.12,
    });
    const benchTop = new THREE.Mesh(
      new THREE.BoxGeometry(12.0, 0.25, 7.3),
      matCountertop
    );
    benchTop.position.set(0, -0.125, 0);
    benchTop.receiveShadow = true;
    labGroup.add(benchTop);

    // Perimeter stainless steel apron trim rails (DIAG-003: discrete wrap trims with zero coplanar overlap)
    const matBenchTrim = MAT_ALUM_ANODIZED;
    const trimF = new THREE.Mesh(new THREE.BoxGeometry(12.06, 0.06, 0.03), matBenchTrim);
    trimF.position.set(0, -0.03, -3.65 - 0.015);
    labGroup.add(trimF);

    const trimB = new THREE.Mesh(new THREE.BoxGeometry(12.06, 0.06, 0.03), matBenchTrim);
    trimB.position.set(0, -0.03, 3.65 + 0.015);
    labGroup.add(trimB);

    const trimL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 7.30), matBenchTrim);
    trimL.position.set(-6.0 - 0.015, -0.03, 0);
    labGroup.add(trimL);

    const trimR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 7.30), matBenchTrim);
    trimR.position.set(6.0 + 0.015, -0.03, 0);
    labGroup.add(trimR);

    // Cabinet sub-structure beneath bench
    const matCabinet = new THREE.MeshStandardMaterial({ color: 0x1e2736, roughness: 0.5, metalness: 0.1 });
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(11.2, 4.2, 6.7), matCabinet);
    cabinet.position.set(0, -2.35, 0);
    cabinet.receiveShadow = true;
    labGroup.add(cabinet);

    // Continuous laboratory backsplash wall (Z = 3.68, zero dark void gap behind bench)
    const matWall = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85, metalness: 0.05 });
    const wallH = 14.0;
    const wallD = 0.20;
    const wallW = 36.0;
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(wallW, wallH, wallD), matWall);
    backWall.position.set(0, wallH / 2 - 0.25, 3.68 + wallD / 2);
    backWall.receiveShadow = true;
    labGroup.add(backWall);

    // Continuous side walls
    const wallSideL = new THREE.Mesh(new THREE.BoxGeometry(wallD, wallH, 24.0), matWall);
    wallSideL.position.set(-wallW / 2 + wallD / 2, wallH / 2 - 0.25, 3.68 - 12.0 + wallD);
    wallSideL.receiveShadow = true;
    labGroup.add(wallSideL);

    const wallSideR = new THREE.Mesh(new THREE.BoxGeometry(wallD, wallH, 24.0), matWall);
    wallSideR.position.set(wallW / 2 - wallD / 2, wallH / 2 - 0.25, 3.68 - 12.0 + wallD);
    wallSideR.receiveShadow = true;
    labGroup.add(wallSideR);

    // Duplex electrical wall outlet mounted on backsplash wall
    const matOutlet = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35, metalness: 0.05 });
    const outletPlate = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 0.02), matOutlet);
    outletPlate.position.set(wallOutletPos.x, wallOutletPos.y, 3.68 + 0.01);
    labGroup.add(outletPlate);

    // Outlet socket recesses (Upper socket empty, lower socket receives plug)
    for (const oy of [0.07, -0.07]) {
      const socketWell = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.10, 0.01), MAT_CHASSIS_DARK);
      socketWell.position.set(wallOutletPos.x, wallOutletPos.y + oy, 3.68 + 0.016);
      labGroup.add(socketWell);
    }

    // Lab floor tiles
    const matFloor = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.65, metalness: 0.05 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.5;
    floor.receiveShadow = true;
    labGroup.add(floor);

    root.add(labGroup);
  }

  // Optics View State Switcher (Turns chassis into smoked transparent acrylic)
  let isOpticsView = false;
  function setOpticsView(enabled) {
    isOpticsView = !!enabled;
    const targetMat = isOpticsView ? MAT_CHASSIS_GLASS : MAT_CHASSIS;
    chassisMeshes.forEach((mesh) => {
      mesh.material = targetMat;
    });
    if (animTargets.roofCover) {
      animTargets.roofCover.visible = !isOpticsView;
    }
    if (animTargets.interiorLight) {
      animTargets.interiorLight.visible = isOpticsView;
    }
    opticalRaysGroup.visible = isOpticsView;
  }

  return {
    root,
    interactiveObjects,
    animTargets,
    cuvetteMeshes,
    setOpticsView,
  };
}
