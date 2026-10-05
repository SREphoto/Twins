/**
 * SREdesigns FTIR-7000x Research-Grade Fourier-Transform Infrared Spectrometer Twin
 * High-Fidelity Procedural 3D Model & Mechanical Assembly
 *
 * Semantic Part Taxonomy Compliance:
 * - Body_Chassis: Hollow sheet-metal unibody casting with recessed shadow gaps, precision reveals, and intake louvers
 * - Assembly_SlopedConsole: Sloped 18.5° touchscreen console with brushed aluminum perimeter trim (Operator Right: -X)
 * - UI_LCD: Flat UV quad with CanvasTexture (16:9 aspect ratio, flipY = false, upright UVs, capacitive digitizer)
 * - Btn_Power, Btn_Bg, Btn_Scan, Btn_Mode, Btn_Tower: Tactile laser-etched physical keycaps with mechanical spring travel
 * - Assembly_ATR_Station: Mirror-polished 316L stainless deck, monolithic Type IIa diamond prism (Operator Left: +X)
 * - Pivot_ATRTower: Heavy forged swiveling pressure clamp arm swinging backwards (+Z) with calibrated slip-clutch knob, Acme screw, and sapphire anvil
 * - Sample_Geometry: 3D physical sample on diamond (liquid droplet with meniscus, polystyrene film swatch, benzoic acid crystalline powder)
 * - Assembly_Interferometer: Cast aluminum breadboard with tapped M6 hole grid (Rear Left: +X, Z > 0),
 *   Polaris Ever-Glo ceramic IR source (1200°C) with finned heatsink & gold collimator, HeNe reference laser tube (632.8 nm)
 *   with Alden HV connector, KBr beam splitter with Ge coating & compensator in 45° brass kinematic mount, fixed gold mirror with
 *   fine-thread alignment screws, moving gold mirror on electromagnetic voice-coil linear motor with parallel spring cross-flexure suspension,
 *   HeNe quadrature fringe photodiode detectors, DTGS pyroelectric detector in shielded can, and desiccant cartridge
 * - Assembly_SMPS_PowerSupply: Switch-mode power supply with perforated enclosure, internal toroidal transformer, filter caps,
 *   6-pos barrier terminal block, and dedicated 50mm DC cooling fan (Rear Right: -X, Z > 0)
 * - Assembly_CoolingFan: 80mm brushless DC exhaust fan with sheet metal bracket, silicone dampers, M4 screws, wire finger guard,
 *   stator windings, and 7 rotating aerodynamic blades
 * - Assembly_Motherboard: Multi-layer FR4 green PCB with length-matched bus serpentines, differential traces, plated vias,
 *   TI DSP processor with heatsink, SDRAM, 24-bit ADC, MOLEX headers, gold SMA jacks, and Kapton FPC ribbon cable ZIF socket
 * - Assembly_InternalWiring: AC mains line with fiberglass sleeving & spade crimps, earth ground braid to chassis stud,
 *   5-wire DC power harness with nylon braided sleeving, flat flexible Kapton ribbon cable to LCD, and shielded coax to ADC
 * - Assembly_PowerCord: Bench duplex outlet box, NEMA 5-15P plug with brass blades, SJTOW cord, rear IEC C14 inlet & illuminated switch
 * - Badge_SREdesigns: Official diamond-cut chrome bezel, brushed titanium plate, corner M1.5 hex bolts, 3 jewel-enamel [S][R][E] tiles
 * - Fastener_HexM3_*, Fastener_HexM4_*, Fastener_HexM6_*: Real 3D hex socket cap screws (ISO 4762) with counterbored washers
 * - Foot_Leveling_FL/FR/RL/RR: Threaded knurled leveling feet resting on datum plane Y = 0
 *
 * Coordinate Convention (Standard Lab Twin Alignment):
 * - Datum Bench: Y = 0.0
 * - Front Fascia: Z = -2.38 (facing -Z toward front camera / operator)
 * - Rear Fascia: Z = +2.38 (facing +Z toward rear wall / rear camera)
 * - Operator Left (+X): Diamond ATR Sampling Deck
 * - Operator Right (-X): Sloped Touchscreen Console & Brand Fascia
 * - Rear Half (Z > 0): Sealed Optics Bay (+X) & Power/Electronics Bay (-X)
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

// ==========================================
// Standard Materials Cache
// ==========================================
const MAT_CHASSIS = new THREE.MeshStandardMaterial({
  color: 0xe6eaf0,
  roughness: 0.38,
  metalness: 0.12,
  side: THREE.DoubleSide,
});

const MAT_CHASSIS_DARK = new THREE.MeshStandardMaterial({
  color: 0x1a1e26,
  roughness: 0.52,
  metalness: 0.28,
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
  color: 0x141820,
  roughness: 0.65,
  metalness: 0.1,
});

const MAT_CHROME = new THREE.MeshStandardMaterial({
  color: 0xe8ecf2,
  roughness: 0.05,
  metalness: 0.98,
  envMapIntensity: 2.4,
});

const MAT_ALUM_ANODIZED = new THREE.MeshStandardMaterial({
  color: 0x7a8089,
  roughness: 0.32,
  metalness: 0.82,
  envMapIntensity: 1.2,
});

const MAT_ALUM_BREADBOARD = new THREE.MeshStandardMaterial({
  color: 0x2a2f38,
  roughness: 0.42,
  metalness: 0.78,
  envMapIntensity: 1.2,
});

const MAT_BRASS_FITTING = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.28,
  metalness: 0.85,
});

const MAT_STAINLESS_ATR = new THREE.MeshStandardMaterial({
  color: 0xdde2e8,
  roughness: 0.12,
  metalness: 0.92,
  envMapIntensity: 2.5,
});

const MAT_DIAMOND_CRYSTAL = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.02,
  metalness: 0.05,
  transmission: 0.96,
  ior: 2.417,
  thickness: 0.12,
  transparent: true,
  opacity: 0.88,
  reflectivity: 0.95,
  clearcoat: 1.0,
});

const MAT_GOLD_MIRROR = new THREE.MeshPhysicalMaterial({
  color: 0xffd166,
  metalness: 0.98,
  roughness: 0.015,
  reflectivity: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.008,
  ior: 2.2,
  specularIntensity: 2.2,
  specularColor: new THREE.Color(0xfff3c4),
  envMapIntensity: 4.8,
  side: THREE.DoubleSide,
});

const MAT_KBR_BEAMSPLITTER = new THREE.MeshPhysicalMaterial({
  color: 0xfef08a,
  roughness: 0.06,
  metalness: 0.12,
  transmission: 0.88,
  ior: 1.54,
  transparent: true,
  opacity: 0.82,
  reflectivity: 0.85,
});

const MAT_HENE_LASER = new THREE.MeshStandardMaterial({
  color: 0x94a3b8,
  roughness: 0.35,
  metalness: 0.85,
});

const MAT_CERAMIC_EMITTER = new THREE.MeshStandardMaterial({
  color: 0xff6b35,
  emissive: 0xff4500,
  emissiveIntensity: 1.8,
  roughness: 0.8,
});

const MAT_PCB_GREEN = new THREE.MeshStandardMaterial({
  color: 0x0a3318,
  roughness: 0.38,
  metalness: 0.22,
});

const MAT_COPPER_WIRE = new THREE.MeshStandardMaterial({
  color: 0xb45309,
  metalness: 0.85,
  roughness: 0.3,
});

const MAT_CABLE_PVC = new THREE.MeshStandardMaterial({
  color: 0x181a1f,
  roughness: 0.7,
  metalness: 0.08,
});

const MAT_WIRE_RED = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 });
const MAT_WIRE_BLACK = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
const MAT_WIRE_WHITE = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
const MAT_WIRE_GREEN_YELLOW = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
const MAT_WIRE_HV_RED = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.45 });
const MAT_CRIMP_BLUE = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 });
const MAT_CRIMP_RED = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });

const MAT_FPC_KAPTON = new THREE.MeshStandardMaterial({
  color: 0xc27803,
  roughness: 0.35,
  metalness: 0.4,
  side: THREE.DoubleSide,
});

const MAT_KEY_DARK = new THREE.MeshStandardMaterial({
  color: 0x222730,
  roughness: 0.5,
  metalness: 0.1,
});

const MAT_LIQUID_SAMPLE = new THREE.MeshPhysicalMaterial({
  color: 0x38bdf8,
  roughness: 0.04,
  transmission: 0.92,
  ior: 1.37,
  transparent: true,
  opacity: 0.85,
  depthWrite: false,
});

const MAT_POWDER_SAMPLE = new THREE.MeshStandardMaterial({
  color: 0xf8fafc,
  roughness: 0.95,
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

  // Line 4: Standards and Compliance
  ctx.fillStyle = '#64748b';
  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", monospace';
  ctx.fillText('SPECTRAL RANGE: 4000 - 400 cm⁻¹ · 21 CFR PART 11 GLP COMPLIANT', 275, 205);

  // Standard Three.js CanvasTexture (flipY = true default allows unmirrored rotation around Y)
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
    MAT_KEY_DARK
  );
  cap.castShadow = true;
  capGroup.add(cap);

  // Top faceplate with silkscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e242d';
  ctx.fillRect(0, 0, 256, 128);

  ctx.strokeStyle = cfg.color || '#38bdf8';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 244, 116);

  ctx.fillStyle = cfg.color || '#38bdf8';
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(cfg.label, 128, 52);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(cfg.sub || '', 128, 96);

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  const topFace = new THREE.Mesh(
    new THREE.PlaneGeometry(0.23, 0.11),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  topFace.rotation.x = -Math.PI / 2;
  topFace.position.y = 0.026;
  capGroup.add(topFace);

  return { group: g, capGroup };
}

// ==========================================
// Spade Crimp Terminal Helper
// ==========================================
function createSpadeCrimpTerminal(matCrimp) {
  const g = new THREE.Group();
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.038, 12),
    matCrimp
  );
  barrel.rotation.z = Math.PI / 2;
  g.add(barrel);

  const spade = new THREE.Mesh(
    new THREE.BoxGeometry(0.028, 0.005, 0.034),
    MAT_BRASS_FITTING
  );
  spade.position.x = 0.032;
  g.add(spade);
  return g;
}

// ==========================================
// 80mm Main Chassis Exhaust Cooling Fan
// ==========================================
function create80mmExhaustFan() {
  const g = new THREE.Group();
  g.name = 'Assembly_CoolingFan';

  // Sheet metal mounting bracket
  const bracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.92, 0.04),
    MAT_CHASSIS_DARK
  );
  bracket.castShadow = true;
  g.add(bracket);

  // Outer fan frame housing
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.80, 0.80, 0.25),
    MAT_CHASSIS_DARK
  );
  frame.castShadow = true;
  g.add(frame);

  // Circular vent cutout
  const vent = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.36, 0.26, 32),
    MAT_CHASSIS_DARK
  );
  vent.rotation.x = Math.PI / 2;
  g.add(vent);

  // 4 Corner Silicone Vibration Dampers & M4 Hex Bolts
  for (const cx of [-0.34, 0.34]) {
    for (const cy of [-0.34, 0.34]) {
      const damper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.06, 16),
        MAT_CHASSIS_DARK
      );
      damper.rotation.x = Math.PI / 2;
      damper.position.set(cx, cy, 0.13);
      g.add(damper);

      const bolt = createHexSocketScrew(0.02, 0.12, { material: MAT_CHROME });
      bolt.position.set(cx, cy, 0.16);
      bolt.rotation.x = Math.PI / 2;
      g.add(bolt);
    }
  }

  // Steel wire finger guard (3 concentric rings + 4 radial spokes)
  for (const r of [0.12, 0.22, 0.32]) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.008, 8, 32),
      MAT_CHROME
    );
    ring.position.z = -0.13;
    g.add(ring);
  }
  for (let s = 0; s < 4; s++) {
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.68, 0.012),
      MAT_CHROME
    );
    spoke.rotation.z = (s * Math.PI) / 4;
    spoke.position.z = -0.13;
    g.add(spoke);
  }

  // Rotor Hub & 7 Aerodynamic Fan Blades
  const rotor = new THREE.Group();
  rotor.name = 'Rotor_CoolingFan';
  g.add(rotor);

  const stator = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.12, 20),
    MAT_CHASSIS_DARK
  );
  stator.rotation.x = Math.PI / 2;
  g.add(stator);

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.14, 20),
    MAT_CHASSIS_DARK
  );
  hub.rotation.x = Math.PI / 2;
  rotor.add(hub);

  for (let b = 0; b < 7; b++) {
    const angle = (b * 2 * Math.PI) / 7;
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.22, 0.06),
      MAT_CHASSIS_DARK
    );
    blade.position.set(Math.cos(angle) * 0.20, Math.sin(angle) * 0.20, 0);
    blade.rotation.z = angle + 0.45;
    rotor.add(blade);
  }

  g.userData.fanRotor = rotor;
  return g;
}

// ==========================================
// Switch-Mode Power Supply (SMPS)
// ==========================================
function createSMPS() {
  const g = new THREE.Group();
  g.name = 'Assembly_SMPS_PowerSupply';

  // Perforated Sheet Metal Chassis Box
  const casing = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.55, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.85 })
  );
  casing.castShadow = true;
  casing.receiveShadow = true;
  g.add(casing);

  // Internal Toroidal Transformer
  const toroid = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.10, 16, 32),
    MAT_COPPER_WIRE
  );
  toroid.position.set(-0.25, 0.08, -0.2);
  g.add(toroid);

  // Primary High-Voltage Electrolytic Filter Capacitors (4 cylindrical cans)
  for (let cx = 0; cx < 2; cx++) {
    for (let cz = 0; cz < 2; cz++) {
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.28, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 })
      );
      cap.position.set(0.25 + cx * 0.22, 0.14, -0.35 + cz * 0.24);
      g.add(cap);

      // Scored safety top vent
      const vent = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.01, 16),
        MAT_CHROME
      );
      vent.position.set(0.25 + cx * 0.22, 0.285, -0.35 + cz * 0.24);
      g.add(vent);
    }
  }

  // 6-Position Barrier Terminal Block on Front Face (Z = -0.91)
  const barrier = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.14, 0.12),
    MAT_CHASSIS_DARK
  );
  barrier.position.set(0, 0.05, -0.91);
  g.add(barrier);

  // 6 brass terminal clamping screws
  for (let i = 0; i < 6; i++) {
    const screw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12),
      MAT_BRASS_FITTING
    );
    screw.rotation.x = Math.PI / 2;
    screw.position.set(-0.35 + i * 0.14, 0.05, -0.97);
    g.add(screw);
  }

  // Dedicated 50mm DC Cooling Fan on Outer Side Face (X = -0.71)
  const fan50 = new THREE.Group();
  fan50.position.set(-0.71, 0.05, 0.2);
  fan50.rotation.y = Math.PI / 2;

  const fFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.40, 0.40, 0.08),
    MAT_CHASSIS_DARK
  );
  fan50.add(fFrame);

  const fHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.09, 16),
    MAT_CHASSIS_DARK
  );
  fHub.rotation.x = Math.PI / 2;
  fan50.add(fHub);

  g.add(fan50);
  return g;
}

// ==========================================
// Procedural Multi-Layer FR-4 DSP Motherboard
// ==========================================
function createMotherboardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep forest green solder mask
  ctx.fillStyle = '#0a3318';
  ctx.fillRect(0, 0, 1024, 1024);

  // Copper ground plane mesh grid
  ctx.strokeStyle = '#0e4420';
  ctx.lineWidth = 1;
  for (let i = 0; i < 1024; i += 8) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Length-matched serpentine bus routes
  ctx.strokeStyle = '#c59b27';
  ctx.lineWidth = 2.5;
  for (let b = 0; b < 12; b++) {
    const yOff = 300 + b * 14;
    ctx.beginPath();
    ctx.moveTo(250, yOff);
    ctx.lineTo(320, yOff);
    ctx.lineTo(335, yOff - 6);
    ctx.lineTo(355, yOff + 6);
    ctx.lineTo(375, yOff - 6);
    ctx.lineTo(395, yOff + 6);
    ctx.lineTo(410, yOff);
    ctx.lineTo(580, yOff);
    ctx.stroke();
  }

  // Plated gold vias
  for (let vx = 50; vx < 980; vx += 40) {
    for (let vy = 50; vy < 980; vy += 40) {
      if ((vx + vy) % 80 === 0) {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(vx, vy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#061a0c';
        ctx.beginPath();
        ctx.arc(vx, vy, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Silkscreen Outlines & Component Labels
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 2;

  // Header Title
  ctx.font = 'bold 24px monospace';
  ctx.fillText('SREdesigns FTIR-7000x DSP CONTROLLER', 60, 60);
  ctx.font = '14px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('REV 4.1 · ASSY 7000-MAIN-DSP · ROHS COMPLIANT · MADE IN USA', 60, 85);
  ctx.fillText('DUAL-PROCESSOR ARCHITECTURE · 24-BIT Σ-Δ SAMPLING ENGINE', 60, 105);

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
      ctx.fillText(label, x + 14, y + h / 2 + 4);
    }
  }

  drawSilkBox(220, 220, 200, 200, 'TI TMS320C6748 DSP', 'U1');
  drawSilkBox(480, 240, 160, 140, 'DDR3 SDRAM 8Gb', 'U2');
  drawSilkBox(480, 420, 130, 90, 'SPI FLASH 256M', 'U3');
  drawSilkBox(680, 600, 140, 100, 'AD7799 24-BIT ADC', 'U4');
  drawSilkBox(120, 500, 110, 90, 'VOICE-COIL DAC', 'U5');
  drawSilkBox(120, 640, 110, 90, 'LASER QUAD COUNTER', 'U6');

  // Connector silkscreen boxes
  function drawHeader(x, y, w, h, name) {
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(name, x, y - 5);
  }

  drawHeader(60, 140, 130, 40, 'J1: 24V_DC_IN [4P]');
  drawHeader(220, 140, 90, 35, 'J2: 12V_FAN [3P]');
  drawHeader(340, 140, 120, 40, 'J3: RS232_COM [10P]');
  drawHeader(490, 140, 100, 35, 'J4: USB_HOST [5P]');
  drawHeader(620, 140, 180, 35, 'J5: FPC_LCD_40P [40P]');

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function createDSPMotherboard() {
  const g = new THREE.Group();
  g.name = 'Assembly_Motherboard';

  // FR4 Substrate Board (1.6m x 1.4m x 0.035m)
  const boardGeo = new THREE.BoxGeometry(1.6, 0.035, 1.4);
  const pcbTex = createMotherboardTexture();
  const topMat = new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.35, metalness: 0.2 });
  const sideMat = MAT_PCB_GREEN;

  const board = new THREE.Mesh(boardGeo, [sideMat, sideMat, topMat, sideMat, sideMat, sideMat]);
  board.castShadow = true;
  board.receiveShadow = true;
  g.add(board);

  // 4 M3 Brass Standoffs in corners
  for (const sx of [-0.72, 0.72]) {
    for (const sz of [-0.62, 0.62]) {
      const standoff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, 0.08, 6),
        MAT_BRASS_FITTING
      );
      standoff.position.set(sx, -0.05, sz);
      g.add(standoff);

      const screw = createHexSocketScrew(0.012, 0.03, { material: MAT_CHROME });
      screw.position.set(sx, 0.02, sz);
      g.add(screw);
    }
  }

  // 3D Physical Chips Mounted on PCB:
  // 1. TI DSP Processor with Aluminum Heatsink
  const heatSink = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.06, 0.32),
    MAT_CHASSIS_DARK
  );
  heatSink.position.set(-0.25, 0.045, -0.2);
  g.add(heatSink);

  // Heatsink cooling fins
  for (let f = 0; f < 6; f++) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.04, 0.015),
      MAT_CHASSIS_DARK
    );
    fin.position.set(-0.25, 0.085, -0.32 + f * 0.05);
    g.add(fin);
  }

  // 2. SDRAM Chips (2 QFP packages)
  for (let m = 0; m < 2; m++) {
    const ram = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.025, 0.16),
      MAT_CHASSIS_DARK
    );
    ram.position.set(0.18, 0.03, -0.28 + m * 0.22);
    g.add(ram);
  }

  // 3. 24-bit Sigma-Delta ADC Chip
  const adc = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.022, 0.14),
    MAT_CHASSIS_DARK
  );
  adc.position.set(0.42, 0.03, 0.25);
  g.add(adc);

  // 4. Solid Aluminum Electrolytic Capacitors (Silver cylindrical cans)
  for (let c = 0; c < 6; c++) {
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 0.09, 16),
      MAT_CHROME
    );
    cap.position.set(-0.55 + (c % 3) * 0.09, 0.06, -0.45 + Math.floor(c / 3) * 0.12);
    g.add(cap);
  }

  // 5. MOLEX Keyed Power Header (J1)
  const molex = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.08, 0.09),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 })
  );
  molex.position.set(-0.62, 0.055, -0.48);
  g.add(molex);

  // 6. Gold-plated SMA RF Coax Connector (receiving DTGS detector signal)
  const sma = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, 0.07, 16),
    MAT_BRASS_FITTING
  );
  sma.rotation.x = Math.PI / 2;
  sma.position.set(0.58, 0.045, 0.52);
  g.add(sma);

  // 7. Kapton FPC ZIF Ribbon Cable Connector (J5)
  const fpcConn = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.03, 0.06),
    MAT_CHASSIS_DARK
  );
  fpcConn.position.set(0.32, 0.03, -0.48);
  g.add(fpcConn);

  return g;
}

// ==========================================
// Main FTIR3D Class
// ==========================================
export class FTIR3D {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;

    // Kinematic & Dynamic State
    this.isPluggedIn = true;
    this.powerSwitchOn = true;
    this.hasPower = true;
    this.isScanning = false;
    this.scanProgress = 0;
    this.scanMode = 'T'; // 'T' (%Transmittance) or 'A' (Absorbance)

    // ATR Clamp Tower Kinematics
    this.towerSwiveled = false;   // false = clamped over diamond, true = swiveled open (backwards)
    this.towerAngle = 0;          // Radians
    this.currentTowerAngle = 0;
    this.clampPressurePct = 80;   // 0% to 100%
    this.currentAnvilY = 0;

    // Moving Voice-Coil Mirror Reciprocation
    this.voiceCoilOffset = 0;
    this.mirrorVelocity = 0.6329; // cm/s
    this.voiceCoilTime = 0;

    // Exploded View & Optics View
    this.explodeProgress = 0;
    this.opticsViewActive = false;

    // Active Sample Analyte
    this.activeSampleId = 'isopropanol';
    this.hasBackground = true;

    // Interactive Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    // Scene Groups
    this.rootGroup = new THREE.Group();
    this.benchGroup = new THREE.Group();
    this.chassisBaseGroup = new THREE.Group();
    this.chassisShellGroup = new THREE.Group();
    this.atrStationGroup = new THREE.Group();
    this.atrTowerPivot = new THREE.Group();
    this.interferometerGroup = new THREE.Group();
    this.voiceCoilMovingGroup = new THREE.Group();
    this.raysGroup = new THREE.Group();
    this.electronicsGroup = new THREE.Group();
    this.wiringGroup = new THREE.Group();
    this.cordGroup = new THREE.Group();
    this.consoleGroup = new THREE.Group();

    // Interactive Meshes List
    this.actionableMeshes = [];
    this.chassisMeshes = [];

    // Procedural Display Canvas (7" 16:9 Screen)
    this.lcdCanvas = document.createElement('canvas');
    this.lcdCanvas.width = 1024;
    this.lcdCanvas.height = 576;
    this.lcdCtx = this.lcdCanvas.getContext('2d');
    this.lcdTexture = null;

    // Animation Loop
    this.clock = new THREE.Clock();
    this.animId = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e14);
    this.scene.fog = new THREE.FogExp2(0x0a0e14, 0.028);

    // 2. Camera: Default Isometric matching standard CAM_ISO
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    this.camera.position.set(5.6, 4.2, -7.2);
    this.camera.lookAt(0.0, 1.15, -0.2);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.setupLighting();

    // 5. Build Environment & Digital Twin Assemblies
    this.scene.add(this.rootGroup);
    this.buildLabBench();
    this.buildDuplexOutletAndCord();
    this.buildHollowChassisAndFrame();
    this.buildDiamondATRStation();
    this.buildMichelsonInterferometer();
    this.buildElectronicsAndCooling();
    this.buildInternalWiringHarnesses();
    this.buildSlopedConsoleAndLCD();
    this.buildOpticalRayPaths();
    this.updateSampleGeometry();

    // 6. Window Resize Listener
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // 7. Start Render Loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    // Key Light (studio top-right front)
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(-4.5, 7.5, -5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0002;
    this.scene.add(keyLight);

    // Front Operator Fill Light (ensures screen & brand badge are illuminated)
    const frontFill = new THREE.DirectionalLight(0xdbeafe, 1.4);
    frontFill.position.set(0.0, 3.5, -8.0);
    this.scene.add(frontFill);

    // Rear Fill Light (ensures IEC inlet, fan, and rocker switch are clearly visible)
    const rearLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rearLight.position.set(0.0, 4.0, 7.0);
    this.scene.add(rearLight);
  }

  buildLabBench() {
    // 360-degree chemical-resistant black epoxy island bench at Y = 0
    const benchGeo = new THREE.BoxGeometry(12.0, 0.3, 10.0);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x11161d,
      roughness: 0.35,
      metalness: 0.15,
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(0, -0.15, 0);
    bench.receiveShadow = true;
    this.benchGroup.add(bench);
    this.rootGroup.add(this.benchGroup);
  }

  buildDuplexOutletAndCord() {
    // Duplex receptacle box mounted on bench at rear left (X = 2.4, Y = 0, Z = 1.6)
    const outletBoxGeo = new THREE.BoxGeometry(0.35, 0.45, 0.25);
    const outletBoxMat = new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.5 });
    const outletBox = new THREE.Mesh(outletBoxGeo, outletBoxMat);
    outletBox.position.set(2.4, 0.225, 1.6);
    outletBox.castShadow = true;
    outletBox.receiveShadow = true;
    this.cordGroup.add(outletBox);

    // Faceplate with duplex outlets
    const faceGeo = new THREE.PlaneGeometry(0.32, 0.42);
    const faceMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.set(2.4, 0.225, 1.474);
    this.cordGroup.add(face);

    // Duplex receptacle slots
    [-0.09, 0.09].forEach(yOff => {
      const slotGeo = new THREE.BoxGeometry(0.015, 0.06, 0.01);
      const slotMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
      const leftSlot = new THREE.Mesh(slotGeo, slotMat);
      leftSlot.position.set(2.36, 0.225 + yOff, 1.472);
      this.cordGroup.add(leftSlot);

      const rightSlot = new THREE.Mesh(slotGeo, slotMat);
      rightSlot.position.set(2.44, 0.225 + yOff, 1.472);
      this.cordGroup.add(rightSlot);
    });

    // Molded NEMA 5-15P plug inserted in top duplex socket
    this.plugGroup = new THREE.Group();
    this.plugGroup.position.set(2.4, 0.315, 1.44);

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
    prong1.position.set(-0.04, 0, 0.025);
    this.plugGroup.add(prong1);

    const prong2 = new THREE.Mesh(prongGeo, prongMat);
    prong2.position.set(0.04, 0, 0.025);
    this.plugGroup.add(prong2);

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

    const plugPos = this.isPluggedIn ? new THREE.Vector3(2.4, 0.315, 1.25) : new THREE.Vector3(2.4, 0.05, 1.1);
    const inletPos = new THREE.Vector3(-1.40, 0.45, 2.38); // Rear IEC inlet socket
    const mid1 = new THREE.Vector3(1.8, 0.04, 0.8);
    const mid2 = new THREE.Vector3(-0.4, 0.04, 1.8);

    const curve = new THREE.CatmullRomCurve3([plugPos, mid1, mid2, inletPos]);
    const cordGeo = new THREE.TubeGeometry(curve, 48, 0.022, 12, false);
    this.powerCordMesh = new THREE.Mesh(cordGeo, MAT_CABLE_PVC);
    this.powerCordMesh.castShadow = true;
    this.cordGroup.add(this.powerCordMesh);

    if (this.plugGroup) {
      this.plugGroup.position.set(2.4, this.isPluggedIn ? 0.315 : 0.06, this.isPluggedIn ? 1.44 : 1.22);
      this.plugGroup.rotation.x = this.isPluggedIn ? 0 : 0.45;
    }
  }

  buildHollowChassisAndFrame() {
    const BASE_Y = 0.08;

    // 1. Threaded leveling feet resting on datum plane Y = 0
    const footOffsets = [
      [-1.9, 0.0, -2.1], [1.9, 0.0, -2.1],
      [-1.9, 0.0, 2.1], [1.9, 0.0, 2.1]
    ];
    footOffsets.forEach(([fx, fy, fz]) => {
      const foot = createVibrationFoot(0.12, 0.08);
      foot.position.set(fx, fy, fz);
      this.chassisBaseGroup.add(foot);
    });

    // 2. Heavy Cast Aluminum Base Pan with precision chamfers
    const basePanGeo = new THREE.BoxGeometry(4.36, 0.16, 4.76);
    const basePan = new THREE.Mesh(basePanGeo, MAT_CHASSIS_DARK);
    basePan.position.set(0, BASE_Y + 0.08, 0);
    basePan.receiveShadow = true;
    basePan.castShadow = true;
    this.chassisBaseGroup.add(basePan);
    this.rootGroup.add(this.chassisBaseGroup);

    // 3. Hollow Sheet Metal Enclosure Top Shell (Elevates smoothly in Exploded View)
    this.chassisShellGroup.position.set(0, 0, 0);

    // Rear Enclosure Wall (Z = +2.38)
    const rearWall = new THREE.Mesh(
      new THREE.BoxGeometry(4.36, 1.80, 0.04),
      MAT_CHASSIS
    );
    rearWall.position.set(0, BASE_Y + 0.16 + 0.90, 2.38 - 0.02);
    rearWall.castShadow = true;
    rearWall.receiveShadow = true;
    this.chassisShellGroup.add(rearWall);
    this.chassisMeshes.push(rearWall);

    // Left Enclosure Wall (X = +2.18, operator left profile)
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.80, 4.76),
      MAT_CHASSIS
    );
    leftWall.position.set(2.18 - 0.02, BASE_Y + 0.16 + 0.90, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    this.chassisShellGroup.add(leftWall);
    this.chassisMeshes.push(leftWall);

    // Right Enclosure Wall (X = -2.18, operator right profile)
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.80, 4.76),
      MAT_CHASSIS
    );
    rightWall.position.set(-2.18 + 0.02, BASE_Y + 0.16 + 0.90, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    this.chassisShellGroup.add(rightWall);
    this.chassisMeshes.push(rightWall);

    // Rear Roof Deck (optics & electronics bay ceiling: Z in [0, 2.38])
    const rearRoof = new THREE.Mesh(
      new THREE.BoxGeometry(4.36, 0.04, 2.38),
      MAT_CHASSIS
    );
    rearRoof.position.set(0, BASE_Y + 0.16 + 1.80 - 0.02, 1.19);
    rearRoof.castShadow = true;
    rearRoof.receiveShadow = true;
    this.chassisShellGroup.add(rearRoof);
    this.chassisMeshes.push(rearRoof);

    // Internal Bulkhead dividing rear optics from front sampling deck & console (Z = 0)
    const internalBulkhead = new THREE.Mesh(
      new THREE.BoxGeometry(4.36, 1.76, 0.04),
      MAT_CHASSIS
    );
    internalBulkhead.position.set(0, BASE_Y + 0.16 + 0.88, 0.0);
    internalBulkhead.castShadow = true;
    this.chassisShellGroup.add(internalBulkhead);
    this.chassisMeshes.push(internalBulkhead);

    // Center divider wall at X = 0 separating console from sample compartment
    const centerDivider = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.76, 2.38),
      MAT_CHASSIS
    );
    centerDivider.position.set(0, BASE_Y + 0.16 + 0.88, -1.19);
    centerDivider.castShadow = true;
    this.chassisShellGroup.add(centerDivider);
    this.chassisMeshes.push(centerDivider);

    // Front Right Apron underneath sloped console (X in [-2.18, 0], Z = -2.38)
    const frontRightApron = new THREE.Mesh(
      new THREE.BoxGeometry(2.18, 1.10, 0.04),
      MAT_CHASSIS
    );
    frontRightApron.position.set(-1.09, BASE_Y + 0.16 + 0.55, -2.38 + 0.02);
    frontRightApron.castShadow = true;
    frontRightApron.receiveShadow = true;
    this.chassisShellGroup.add(frontRightApron);
    this.chassisMeshes.push(frontRightApron);

    // Front Left Apron underneath sampling deck (X in [0, 2.18], Z = -2.38)
    const frontLeftApron = new THREE.Mesh(
      new THREE.BoxGeometry(2.18, 0.80, 0.04),
      MAT_CHASSIS
    );
    frontLeftApron.position.set(1.09, BASE_Y + 0.16 + 0.40, -2.38 + 0.02);
    frontLeftApron.castShadow = true;
    frontLeftApron.receiveShadow = true;
    this.chassisShellGroup.add(frontLeftApron);
    this.chassisMeshes.push(frontLeftApron);

    // Front Air Intake Louvers (below console on front right fascia)
    for (let l = 0; l < 6; l++) {
      const louver = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.02, 0.035),
        MAT_CHASSIS_DARK
      );
      louver.position.set(-1.09, BASE_Y + 0.28 + l * 0.07, -2.383);
      this.chassisShellGroup.add(louver);
    }

    // Official SREdesigns Brand Badge on Front Right Fascia (~1 inch from top/side edges)
    const brandBadge = makeSREdesignsBadge(0.55);
    brandBadge.position.set(-1.60, BASE_Y + 0.95, -2.385);
    brandBadge.rotation.y = Math.PI; // Faces -Z forward towards operator and CAM_FRONT
    this.chassisShellGroup.add(brandBadge);

    // Rear Panel I/O Connectors & Rocker Power Switch (Z = +2.38)
    const iecInlet = createIECInlet();
    iecInlet.position.set(-1.40, 0.45, 2.385);
    this.chassisShellGroup.add(iecInlet);

    this.rockerSwitch = createRockerSwitch({
      isOn: true,
      onChange: (state) => this.setPowerSwitch(state),
    });
    this.rockerSwitch.position.set(-0.85, 0.45, 2.385);
    this.rockerSwitch.userData = { name: 'Switch_Power', action: 'toggle_switch', tooltip: 'Rear AC Power Switch (I/O)' };
    this.actionableMeshes.push(this.rockerSwitch);
    this.chassisShellGroup.add(this.rockerSwitch);

    const db9 = createDB9Port();
    db9.position.set(0.4, 0.45, 2.385);
    this.chassisShellGroup.add(db9);

    const bncPurge = createBNCJack();
    bncPurge.position.set(1.1, 0.45, 2.385);
    this.chassisShellGroup.add(bncPurge);

    // Rear exhaust fan louvers (Z = +2.38, X = -1.40)
    for (let f = 0; f < 8; f++) {
      const fanLouver = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.024, 0.04),
        MAT_CHASSIS_DARK
      );
      fanLouver.rotation.x = -0.42; // Sloped downwards
      fanLouver.position.set(-1.40, BASE_Y + 0.95 + f * 0.08, 2.385);
      this.chassisShellGroup.add(fanLouver);
    }

    // Fasteners securing top unibody to chassis base
    [
      [-1.95, 2.36], [1.95, 2.36],
      [-1.95, 0.02], [1.95, 0.02],
      [-1.95, -2.36], [1.95, -2.36]
    ].forEach(([sx, sz]) => {
      const screw = createHexSocketScrew(0.02, 0.05, { material: MAT_CHROME });
      screw.position.set(sx, BASE_Y + 0.16 + 1.80, sz);
      this.chassisShellGroup.add(screw);
    });

    this.rootGroup.add(this.chassisShellGroup);
  }

  buildDiamondATRStation() {
    // Wide-open sampling deck on Operator Left (+X: [0, 2.18], Z in [-2.38, 0])
    const BASE_Y = 0.08;
    this.atrStationGroup.position.set(1.09, BASE_Y + 0.16 + 0.80, -1.19);

    // 1. Mirror-Polished 316L Stainless Steel Deck Plate (2.12m x 2.34m x 0.06m)
    const plateGeo = new THREE.BoxGeometry(2.12, 0.06, 2.34);
    const plate = new THREE.Mesh(plateGeo, MAT_STAINLESS_ATR);
    plate.castShadow = true;
    plate.receiveShadow = true;
    this.atrStationGroup.add(plate);

    // Concentric recessed solvent well ring surrounding diamond crystal
    const wellGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.015, 32);
    const well = new THREE.Mesh(wellGeo, MAT_CHASSIS_DARK);
    well.position.y = 0.031;
    this.atrStationGroup.add(well);

    // 4 Corner Countersunk M4 Hex Socket Screws
    [[-0.92, -1.02], [0.92, -1.02], [-0.92, 1.02], [0.92, 1.02]].forEach(([cx, cz]) => {
      const scr = createHexSocketScrew(0.016, 0.04, { material: MAT_CHROME });
      scr.position.set(cx, 0.032, cz);
      this.atrStationGroup.add(scr);
    });

    // Monolithic Type IIa Diamond Prism brazed into Hastelloy puck (IOR = 2.417)
    const diamondPuckGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.025, 24);
    const diamondPuck = new THREE.Mesh(diamondPuckGeo, MAT_BRASS_FITTING);
    diamondPuck.position.y = 0.035;
    this.atrStationGroup.add(diamondPuck);

    const diamondGeo = new THREE.CylinderGeometry(0.075, 0.055, 0.035, 16);
    this.diamondMesh = new THREE.Mesh(diamondGeo, MAT_DIAMOND_CRYSTAL);
    this.diamondMesh.position.y = 0.048;
    this.diamondMesh.userData = { name: 'Sampling_Diamond_ATR', action: 'toggle_sample', tooltip: 'Monolithic Type IIa Diamond ATR (Click to cycle analyte)' };
    this.actionableMeshes.push(this.diamondMesh);
    this.atrStationGroup.add(this.diamondMesh);

    // Sample Geometry Group (Droplet / Film / Powder sits on diamond)
    this.sampleGroup = new THREE.Group();
    this.sampleGroup.position.set(0, 0.065, 0);
    this.atrStationGroup.add(this.sampleGroup);

    // Heavy Forged Swiveling Pressure Clamp Tower
    // Pivots BACKWARD (+Z) around a precision stainless hinge pin at (0, 0.06, 0.65)
    this.atrTowerPivot.position.set(0, 0.06, 0.65);

    // Cast hinge base anchored to stainless plate
    const hingeBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.18, 0.24),
      MAT_CHASSIS_DARK
    );
    hingeBase.position.set(0, 0.09, 0);
    hingeBase.castShadow = true;
    this.atrTowerPivot.add(hingeBase);

    // Stainless steel precision hinge pin
    const hingePin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.40, 16),
      MAT_CHROME
    );
    hingePin.rotation.z = Math.PI / 2;
    hingePin.position.set(0, 0.12, 0);
    this.atrTowerPivot.add(hingePin);

    // Heavy cast articulated clamp arm extending forward (-Z) over diamond
    const clampArmGroup = new THREE.Group();
    clampArmGroup.position.set(0, 0.12, 0);

    const verticalPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.085, 0.70, 20),
      MAT_CHASSIS_DARK
    );
    verticalPost.position.set(0, 0.35, 0);
    verticalPost.castShadow = true;
    clampArmGroup.add(verticalPost);

    const horizontalBeam = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.14, 0.75),
      MAT_CHASSIS_DARK
    );
    horizontalBeam.position.set(0, 0.66, -0.32);
    horizontalBeam.castShadow = true;
    clampArmGroup.add(horizontalBeam);

    // Calibrated knurled slip-clutch torque knob
    const knobGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.16, 24);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.8 });
    this.knobMesh = new THREE.Mesh(knobGeo, knobMat);
    this.knobMesh.position.set(0, 0.78, -0.65);
    this.knobMesh.castShadow = true;
    this.knobMesh.userData = { name: 'Knob_Pressure', action: 'toggle_pressure', tooltip: 'Calibrated Slip-Clutch Pressure Knob (Click to cycle torque)' };
    this.actionableMeshes.push(this.knobMesh);
    clampArmGroup.add(this.knobMesh);

    // Acme lead screw shaft & self-leveling sapphire tip anvil
    const screwShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.28, 16),
      MAT_CHROME
    );
    screwShaft.position.set(0, 0.54, -0.65);
    clampArmGroup.add(screwShaft);

    const anvilGeo = new THREE.CylinderGeometry(0.045, 0.025, 0.12, 16);
    this.anvilMesh = new THREE.Mesh(anvilGeo, MAT_CHROME);
    this.anvilMesh.position.set(0, 0.38, -0.65);
    clampArmGroup.add(this.anvilMesh);

    clampArmGroup.userData = { name: 'Pivot_ATRTower', action: 'toggle_swivel', tooltip: 'Click to swivel ATR Pressure Tower open/closed' };
    this.actionableMeshes.push(clampArmGroup);

    this.atrTowerPivot.add(clampArmGroup);
    this.atrStationGroup.add(this.atrTowerPivot);
    this.chassisBaseGroup.add(this.atrStationGroup);
  }

  updateSampleGeometry() {
    while (this.sampleGroup.children.length > 0) {
      const obj = this.sampleGroup.children.pop();
      if (obj.geometry) obj.geometry.dispose();
    }

    if (this.activeSampleId === 'isopropanol' || this.activeSampleId === 'acetone' || this.activeSampleId === 'toluene') {
      // Liquid droplet meniscus dome
      const dropGeo = new THREE.SphereGeometry(0.05, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const dropMesh = new THREE.Mesh(dropGeo, MAT_LIQUID_SAMPLE);
      dropMesh.position.y = 0.0;
      this.sampleGroup.add(dropMesh);
    } else if (this.activeSampleId === 'polystyrene') {
      // Thin NIST calibration film swatch
      const filmGeo = new THREE.BoxGeometry(0.12, 0.005, 0.12);
      const filmMesh = new THREE.Mesh(filmGeo, MAT_FILM_SAMPLE);
      filmMesh.position.y = 0.002;
      this.sampleGroup.add(filmMesh);
    } else if (this.activeSampleId === 'benzoic_acid') {
      // Faceted crystalline powder pile
      const powderGeo = new THREE.ConeGeometry(0.055, 0.032, 12);
      const powderMesh = new THREE.Mesh(powderGeo, MAT_POWDER_SAMPLE);
      powderMesh.position.y = 0.016;
      this.sampleGroup.add(powderMesh);
    }
  }

  buildMichelsonInterferometer() {
    // Optical breadboard seated inside the rear left optics bay (+X: [0, 2.18], Z in [0, 2.38])
    // Anchored directly to chassisBaseGroup so it remains visible on bench during Exploded View!
    const BASE_Y = 0.08;
    this.interferometerGroup.position.set(1.09, BASE_Y + 0.16 + 0.15, 1.19);

    // Heavy Cast Aluminum Optical Breadboard with regular grid of tapped M6 holes
    const bbGeo = new THREE.BoxGeometry(1.95, 0.08, 2.15);
    const breadboard = new THREE.Mesh(bbGeo, MAT_ALUM_BREADBOARD);
    breadboard.receiveShadow = true;
    this.interferometerGroup.add(breadboard);

    // Tapped M6 hole grid
    for (let x = -0.8; x <= 0.8; x += 0.2) {
      for (let z = -0.9; z <= 0.9; z += 0.2) {
        const hole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.01, 8),
          new THREE.MeshBasicMaterial({ color: 0x0a0c10 })
        );
        hole.position.set(x, 0.041, z);
        this.interferometerGroup.add(hole);
      }
    }

    // 1. Polaris Ever-Glo Ceramic IR Source (1200°C) with finned cylindrical heatsink
    const sourceHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.42, 24),
      MAT_CHASSIS_DARK
    );
    sourceHousing.position.set(-0.65, 0.25, 0.65);
    this.interferometerGroup.add(sourceHousing);

    // Finned cooling rings on source
    for (let r = 0; r < 5; r++) {
      const finRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.02, 24),
        MAT_CHASSIS_DARK
      );
      finRing.position.set(-0.65, 0.12 + r * 0.06, 0.65);
      this.interferometerGroup.add(finRing);
    }

    // Glowing ceramic coil
    const coilGeo = new THREE.TorusGeometry(0.06, 0.018, 16, 32);
    this.irEmitterCoil = new THREE.Mesh(coilGeo, MAT_CERAMIC_EMITTER);
    this.irEmitterCoil.position.set(-0.65, 0.25, 0.48);
    this.irEmitterCoil.rotation.x = Math.PI / 2;
    this.interferometerGroup.add(this.irEmitterCoil);

    // 2. HeNe 632.8 nm Reference Laser Plasma Tube
    const heneGeo = new THREE.CylinderGeometry(0.055, 0.055, 1.4, 24);
    const heneTube = new THREE.Mesh(heneGeo, MAT_HENE_LASER);
    heneTube.rotation.z = Math.PI / 2;
    heneTube.position.set(0.10, 0.15, 0.85);
    this.interferometerGroup.add(heneTube);

    // Alden High-Voltage Anode Connector on Laser
    const alden = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.08, 16),
      MAT_CHASSIS_DARK
    );
    alden.rotation.z = Math.PI / 2;
    alden.position.set(-0.64, 0.15, 0.85);
    this.interferometerGroup.add(alden);

    // 3. KBr Substrate Beam Splitter & Matched Compensator in 45° Brass Kinematic Mount
    const bsMount = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.45, 0.06),
      MAT_BRASS_FITTING
    );
    bsMount.position.set(-0.15, 0.25, 0.0);
    bsMount.rotation.y = Math.PI / 4;
    this.interferometerGroup.add(bsMount);

    const bsDiscGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.025, 32);
    const bsDisc = new THREE.Mesh(bsDiscGeo, MAT_KBR_BEAMSPLITTER);
    bsDisc.rotation.x = Math.PI / 2;
    bsDisc.position.set(-0.15, 0.25, 0.0);
    bsDisc.rotation.y = Math.PI / 4;
    this.interferometerGroup.add(bsDisc);

    // Brass alignment thumb screws on mount
    for (const [tx, ty] of [[-0.12, 0.16], [0.12, 0.16], [0.0, -0.16]]) {
      const thumb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.04, 16),
        MAT_BRASS_FITTING
      );
      thumb.position.set(-0.15 + tx * 0.7, 0.25 + ty, 0.03);
      this.interferometerGroup.add(thumb);
    }

    // 4. Fixed Gold Mirror on 3-Point Kinematic Cell
    const fixMount = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.38, 0.08),
      MAT_ALUM_ANODIZED
    );
    fixMount.position.set(0.55, 0.25, 0.0);
    this.interferometerGroup.add(fixMount);

    const fixMirror = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.10, 0.02, 32),
      MAT_GOLD_MIRROR
    );
    fixMirror.rotation.z = Math.PI / 2;
    fixMirror.position.set(0.50, 0.25, 0.0);
    this.interferometerGroup.add(fixMirror);

    // 5. Moving Mirror on Electromagnetic Voice-Coil Linear Flexure Drive
    const voiceCoilStator = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.35, 24),
      MAT_CHASSIS_DARK
    );
    voiceCoilStator.position.set(-0.15, 0.25, -0.65);
    voiceCoilStator.rotation.x = Math.PI / 2;
    this.interferometerGroup.add(voiceCoilStator);

    // Parallel Spring Cross-Flexures (spring steel blade suspension)
    for (const fz of [-0.55, -0.75]) {
      const flexure = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.005, 0.06),
        MAT_CHROME
      );
      flexure.position.set(-0.15, 0.40, fz);
      this.interferometerGroup.add(flexure);
    }

    // Moving Voice-Coil Bobbin & Gold Mirror
    this.voiceCoilMovingGroup.position.set(-0.15, 0.25, -0.42);

    const coilBobbin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.18, 24),
      MAT_COPPER_WIRE
    );
    coilBobbin.rotation.x = Math.PI / 2;
    this.voiceCoilMovingGroup.add(coilBobbin);

    const movMirror = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.10, 0.02, 32),
      MAT_GOLD_MIRROR
    );
    movMirror.rotation.x = Math.PI / 2;
    movMirror.position.set(0, 0, 0.10);
    this.voiceCoilMovingGroup.add(movMirror);

    this.interferometerGroup.add(this.voiceCoilMovingGroup);

    // 6. HeNe Quadrature Silicon Photodiode Sensor Pair
    const quadSensor = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6 })
    );
    quadSensor.position.set(-0.15, 0.10, 0.25);
    this.interferometerGroup.add(quadSensor);

    // 7. DTGS Pyroelectric Detector in TO-8 Can with Pre-Amp Shielded Enclosure
    const dtgsShield = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.28, 0.35),
      MAT_CHROME
    );
    dtgsShield.position.set(0.65, 0.25, -0.75);
    this.interferometerGroup.add(dtgsShield);

    const kbrWindow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.015, 20),
      MAT_KBR_BEAMSPLITTER
    );
    kbrWindow.position.set(0.65, 0.25, -0.56);
    kbrWindow.rotation.x = Math.PI / 2;
    this.interferometerGroup.add(kbrWindow);

    // 8. Desiccant Cartridge with Blue Silica Gel View Window
    const desiccant = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.10, 0.45, 20),
      MAT_CHASSIS_DARK
    );
    desiccant.position.set(0.70, 0.26, 0.65);
    this.interferometerGroup.add(desiccant);

    const gelWindow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 })
    );
    gelWindow.position.set(0.70, 0.35, 0.74);
    gelWindow.rotation.x = Math.PI / 2;
    this.interferometerGroup.add(gelWindow);

    this.chassisBaseGroup.add(this.interferometerGroup);
  }

  buildElectronicsAndCooling() {
    // Electronics bay seated in rear right (-X: [-2.18, 0], Z in [0, 2.38])
    // Anchored directly to chassisBaseGroup so it remains visible on bench during Exploded View!
    const BASE_Y = 0.08;
    this.electronicsGroup.position.set(-1.09, BASE_Y + 0.16, 1.19);

    // 1. Industrial SMPS Power Supply (Left side of bay: X = -0.35, Z = 0.2)
    const smps = createSMPS();
    smps.position.set(-0.35, 0.32, 0.2);
    this.electronicsGroup.add(smps);

    // 2. 80mm Main Exhaust Cooling Fan (Aligned with rear louvers at X = -1.40, Z = +2.38)
    const fan = create80mmExhaustFan();
    fan.position.set(-0.31, 0.72, 1.05); // Aligns with world X = -1.40, Z = 2.24
    this.coolingFanRotor = fan.userData.fanRotor;
    this.electronicsGroup.add(fan);

    // 3. Green FR4 DSP Controller Motherboard (Seated horizontally at Y = 0.12, Z = -0.3)
    const mb = createDSPMotherboard();
    mb.position.set(0.0, 0.12, -0.3);
    this.electronicsGroup.add(mb);

    // 4. Dedicated High-Voltage Inverter Brick for HeNe Laser
    const hvBrick = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.22, 0.65),
      MAT_CHASSIS_DARK
    );
    hvBrick.position.set(0.55, 0.14, 0.45);
    hvBrick.castShadow = true;
    this.electronicsGroup.add(hvBrick);

    this.chassisBaseGroup.add(this.electronicsGroup);
  }

  buildInternalWiringHarnesses() {
    const BASE_Y = 0.08;

    // 1. AC Mains Line: From IEC inlet (-1.40, 0.45, 2.38) & Rocker Switch to SMPS Barrier Block
    const acPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.40, BASE_Y + 0.45, 2.36),
      new THREE.Vector3(-1.40, BASE_Y + 0.25, 2.10),
      new THREE.Vector3(-1.44, BASE_Y + 0.28, 1.40),
      new THREE.Vector3(-1.44, BASE_Y + 0.42, 0.50),
    ]);
    const acTube = new THREE.TubeGeometry(acPath, 32, 0.018, 8, false);
    const acHarness = new THREE.Mesh(acTube, MAT_CABLE_PVC);
    this.wiringGroup.add(acHarness);

    // Spade Crimp Terminals on SMPS Barrier Block
    [-0.04, 0.04].forEach(xOff => {
      const spade = createSpadeCrimpTerminal(MAT_CRIMP_BLUE);
      spade.position.set(-1.44 + xOff, BASE_Y + 0.42, 0.48);
      spade.rotation.x = Math.PI / 2;
      this.wiringGroup.add(spade);
    });

    // 2. Earth Ground Braid: From IEC ground pin to chassis base ground stud
    const groundPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.40, BASE_Y + 0.40, 2.36),
      new THREE.Vector3(-1.20, BASE_Y + 0.20, 2.30),
      new THREE.Vector3(-1.10, BASE_Y + 0.10, 2.25),
    ]);
    const groundTube = new THREE.TubeGeometry(groundPath, 16, 0.014, 8, false);
    const groundMesh = new THREE.Mesh(groundTube, MAT_WIRE_GREEN_YELLOW);
    this.wiringGroup.add(groundMesh);

    // 3. DC Power Bus Harness (+24V, +12V, +5V, -12V, GND): From SMPS to Motherboard MOLEX
    const dcPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.44, BASE_Y + 0.42, 0.52),
      new THREE.Vector3(-1.60, BASE_Y + 0.22, 0.70),
      new THREE.Vector3(-1.71, BASE_Y + 0.26, 0.89),
    ]);
    const dcTube = new THREE.TubeGeometry(dcPath, 24, 0.022, 8, false);
    const dcHarness = new THREE.Mesh(dcTube, MAT_CABLE_PVC);
    this.wiringGroup.add(dcHarness);

    // 4. Flat Flexible Ribbon Cable (Kapton FPC) from Motherboard to Front Touchscreen LCD
    const fpcPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.77, BASE_Y + 0.28, 0.71),
      new THREE.Vector3(-0.77, BASE_Y + 0.45, -0.40),
      new THREE.Vector3(-1.09, BASE_Y + 0.95, -1.50),
    ]);
    const fpcTube = new THREE.TubeGeometry(fpcPath, 32, 0.045, 4, false);
    const fpcMesh = new THREE.Mesh(fpcTube, MAT_FPC_KAPTON);
    this.wiringGroup.add(fpcMesh);

    // 5. High-Voltage Red Silicone Wire from Laser Inverter to HeNe Alden Socket
    const hvPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.54, BASE_Y + 0.30, 1.64),
      new THREE.Vector3(0.00, BASE_Y + 0.22, 1.80),
      new THREE.Vector3(0.45, BASE_Y + 0.38, 2.04),
    ]);
    const hvTube = new THREE.TubeGeometry(hvPath, 24, 0.012, 8, false);
    const hvMesh = new THREE.Mesh(hvTube, MAT_WIRE_HV_RED);
    this.wiringGroup.add(hvMesh);

    // 6. Shielded Miniature Coaxial Cable from DTGS Detector to ADC
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

  buildSlopedConsoleAndLCD() {
    // Ergonomic Sloped Touchscreen Console at Front Right (-X: [-2.18, 0], Z in [-2.38, 0])
    const BASE_Y = 0.08;
    const slopeAngle = Math.atan2(0.64, 2.38); // ~0.2625 rad (~15.04°)

    this.consoleGroup.position.set(-1.09, BASE_Y + 0.16 + 1.25, -1.19);
    this.consoleGroup.rotation.x = -slopeAngle; // Tilts face up and forward toward operator and CAM_FRONT!

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
    // Invert horizontal UV coordinates directly on buffer geometry to ensure unmirrored rendering
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

    buttons.forEach(b => {
      const keyItem = createLabeledKeycap(b);
      keyItem.group.position.set(b.x, 0.024, -0.52);
      keyItem.group.userData = { name: b.name, action: b.id, tooltip: `Button: ${b.label}` };
      this.actionableMeshes.push(keyItem.group);
      this.consoleGroup.add(keyItem.group);
    });

    this.chassisShellGroup.add(this.consoleGroup);
  }

  buildOpticalRayPaths() {
    // Optical path: Ever-Glo -> KBr BS -> Fixed/Moving Mirrors -> ATR Diamond -> DTGS
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

    // Background (Unpowered blackout if no power)
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
    const chartH = 380;

    // Grid lines
    ctx.strokeStyle = '#162234';
    ctx.lineWidth = 1;
    for (let gy = 0; gy <= 4; gy++) {
      const y = chartY + (gy * chartH) / 4;
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartW, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText(`${100 - gy * 25}%`, 25, y + 4);
    }

    for (let gx = 0; gx <= 6; gx++) {
      const x = chartX + (gx * chartW) / 6;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartH);
      ctx.stroke();

      const wn = 4000 - gx * 600;
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText(`${wn}`, x - 15, chartY + chartH + 22);
    }

    // Chart Axes Border
    ctx.strokeStyle = '#283850';
    ctx.lineWidth = 2;
    ctx.strokeRect(chartX, chartY, chartW, chartH);

    // Spectrum Curve (Procedural Mid-IR Absorption Curve)
    ctx.strokeStyle = this.scanMode === 'T' ? '#38bdf8' : '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let i = 0; i <= chartW; i += 2) {
      const wn = 4000 - (i / chartW) * 3600;
      let intensity = 95.0; // Baseline transmittance %

      if (this.activeSampleId === 'isopropanol') {
        // Broad O-H at 3350
        intensity -= 70 * Math.exp(-Math.pow((wn - 3350) / 160, 2));
        // C-H at 2970
        intensity -= 45 * Math.exp(-Math.pow((wn - 2970) / 50, 2));
        // Gem-dimethyl at 1381 & 1370
        intensity -= 35 * Math.exp(-Math.pow((wn - 1381) / 18, 2));
        intensity -= 30 * Math.exp(-Math.pow((wn - 1370) / 18, 2));
        // C-O at 1129
        intensity -= 60 * Math.exp(-Math.pow((wn - 1129) / 40, 2));
      } else if (this.activeSampleId === 'acetone') {
        // Intense C=O at 1715
        intensity -= 85 * Math.exp(-Math.pow((wn - 1715) / 35, 2));
        intensity -= 30 * Math.exp(-Math.pow((wn - 2925) / 45, 2));
        intensity -= 45 * Math.exp(-Math.pow((wn - 1222) / 30, 2));
      } else if (this.activeSampleId === 'polystyrene') {
        // Aromatic C-H at 3026, 2924
        intensity -= 45 * Math.exp(-Math.pow((wn - 3026) / 25, 2));
        intensity -= 55 * Math.exp(-Math.pow((wn - 2924) / 25, 2));
        // Ring stretch at 1601, 1492
        intensity -= 65 * Math.exp(-Math.pow((wn - 1601) / 18, 2));
        intensity -= 60 * Math.exp(-Math.pow((wn - 1492) / 18, 2));
        // Fingerprints at 756, 698
        intensity -= 75 * Math.exp(-Math.pow((wn - 756) / 20, 2));
        intensity -= 80 * Math.exp(-Math.pow((wn - 698) / 20, 2));
      } else if (this.activeSampleId === 'benzoic_acid') {
        // Carboxylic O-H broad envelope 2500-3100
        intensity -= 55 * Math.exp(-Math.pow((wn - 2800) / 300, 2));
        // C=O stretch at 1685
        intensity -= 82 * Math.exp(-Math.pow((wn - 1685) / 28, 2));
        // C-O stretch at 1290
        intensity -= 65 * Math.exp(-Math.pow((wn - 1290) / 35, 2));
      }

      intensity = Math.max(5, Math.min(100, intensity));
      const py = chartY + chartH - (intensity / 100) * chartH;

      if (i === 0) ctx.moveTo(chartX + i, py);
      else ctx.lineTo(chartX + i, py);
    }
    ctx.stroke();

    // Bottom Status Strip
    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`ANALYTE: ${this.activeSampleId.toUpperCase()} | MODE: ${this.scanMode === 'T' ? '%T' : 'ABSORBANCE'} | CLAMP: ${this.clampPressurePct}%`, 70, 535);

    this.lcdTexture.needsUpdate = true;
  }

  // ==========================================
  // Public Control API
  // ==========================================
  setPowerCord(plugged) {
    this.isPluggedIn = plugged;
    this.updatePowerState();
    this.updatePowerCordCurve();
  }

  setPowerSwitch(on) {
    this.powerSwitchOn = on;
    this.updatePowerState();
  }

  updatePowerState() {
    this.hasPower = this.isPluggedIn && this.powerSwitchOn;
    if (this.irEmitterCoil) {
      this.irEmitterCoil.material.emissiveIntensity = this.hasPower ? 1.8 : 0.0;
    }
    this.renderLCD();
  }

  toggleSwivel() {
    this.towerSwiveled = !this.towerSwiveled;
    this.towerAngle = this.towerSwiveled ? Math.PI * 0.5 : 0.0; // Swivels BACKWARD
  }

  setPressure(pct) {
    this.clampPressurePct = Math.max(0, Math.min(100, pct));
  }

  setSample(sampleId) {
    this.activeSampleId = sampleId;
    this.updateSampleGeometry();
    this.renderLCD();
  }

  setExploded(progress) {
    this.explodeProgress = Math.max(0, Math.min(1, progress));
    // Elevate only the unibody top shell smoothly along +Y
    this.chassisShellGroup.position.y = this.explodeProgress * 2.2;
  }

  toggleOpticsView(active) {
    this.opticsViewActive = active !== undefined ? active : !this.opticsViewActive;
    this.chassisMeshes.forEach(mesh => {
      mesh.material = this.opticsViewActive ? MAT_CHASSIS_GLASS : MAT_CHASSIS;
    });
  }

  startScan(onProgress, onComplete) {
    if (!this.hasPower || this.isScanning) return;
    this.isScanning = true;
    this.scanProgress = 0;

    const duration = 2800;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      this.scanProgress = Math.min(1.0, elapsed / duration);
      if (onProgress) onProgress(this.scanProgress);
      this.renderLCD();

      if (this.scanProgress < 1.0) {
        requestAnimationFrame(step);
      } else {
        this.isScanning = false;
        if (onComplete) onComplete();
        this.renderLCD();
      }
    };
    requestAnimationFrame(step);
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animId = requestAnimationFrame(this.animate.bind(this));
    const delta = this.clock.getDelta();

    // 1. Swivel clamp tower smoothly
    if (Math.abs(this.currentTowerAngle - this.towerAngle) > 0.001) {
      this.currentTowerAngle += (this.towerAngle - this.currentTowerAngle) * 0.12;
      this.atrTowerPivot.rotation.x = this.currentTowerAngle; // Rotates backward around X
    }

    // 2. Animate cooling fan rotor
    if (this.hasPower && this.coolingFanRotor) {
      this.coolingFanRotor.rotation.z += delta * 18.0;
    }

    // 3. Voice-Coil Moving Mirror Reciprocation during scan
    if (this.isScanning && this.voiceCoilMovingGroup) {
      this.voiceCoilTime += delta * 8.0;
      this.voiceCoilMovingGroup.position.z = -0.42 + Math.sin(this.voiceCoilTime) * 0.06;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
