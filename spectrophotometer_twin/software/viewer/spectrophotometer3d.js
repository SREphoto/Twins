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
  color: 0xe8ecf2,
  roughness: 0.05,
  metalness: 0.98,
  envMapIntensity: 2.2,
});
// First-Surface Optical Mirror (Precision vacuum-deposited aluminum/silver on fused silica, R > 99.4%)
const MAT_OPTICAL_MIRROR = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1.0,
  roughness: 0.012,
  envMapIntensity: 4.8,
  side: THREE.DoubleSide,
});
const MAT_ALUM_ANODIZED = new THREE.MeshStandardMaterial({
  color: 0x7a8089,
  roughness: 0.32,
  metalness: 0.82,
  envMapIntensity: 1.2,
});
const MAT_ALUM_BREADBOARD = new THREE.MeshStandardMaterial({
  color: 0x2d323b,
  roughness: 0.40,
  metalness: 0.78,
  envMapIntensity: 1.0,
});
const MAT_KEY_DARK = new THREE.MeshStandardMaterial({
  color: 0x222730,
  roughness: 0.5,
  metalness: 0.1,
});
const MAT_GOLD_MIRROR = new THREE.MeshPhysicalMaterial({
  color: 0xffd166,
  metalness: 0.98,
  roughness: 0.016,
  reflectivity: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.008,
  ior: 2.2,
  specularIntensity: 2.2,
  specularColor: new THREE.Color(0xfff3c4),
  envMapIntensity: 4.8,
});
const MAT_HOLO_GRATING = new THREE.MeshStandardMaterial({
  color: 0x38bdf8,
  roughness: 0.15,
  metalness: 0.88,
  envMapIntensity: 2.0,
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
const MAT_NYLON_CLIP = new THREE.MeshStandardMaterial({
  color: 0xf1f5f9,
  roughness: 0.45,
  metalness: 0.05,
});
const MAT_CONDUIT_STEEL = new THREE.MeshStandardMaterial({
  color: 0x9ca3af,
  roughness: 0.25,
  metalness: 0.85,
  envMapIntensity: 1.8,
});
const MAT_WIRE_RED = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5, metalness: 0.1 });
const MAT_WIRE_BLACK = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.6, metalness: 0.1 });
const MAT_WIRE_WHITE = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5, metalness: 0.1 });
const MAT_WIRE_GREEN_YELLOW = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.5, metalness: 0.1 });
const MAT_WIRE_ORANGE = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.45, metalness: 0.1 });
const MAT_WIRE_BLUE = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5, metalness: 0.1 });
const MAT_WIRE_COAX = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.65 });
const MAT_FPC_KAPTON = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.3, transparent: true, opacity: 0.88 });
const MAT_BRASS_FITTING = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.22, metalness: 0.88, envMapIntensity: 2.0 });
const MAT_OPTICAL_GLASS = new THREE.MeshPhysicalMaterial({
  color: 0xf8fafc,
  roughness: 0.02,
  metalness: 0.05,
  transparent: true,
  opacity: 0.32,
  reflectivity: 0.95,
  clearcoat: 1.0,
  clearcoatRoughness: 0.02,
  envMapIntensity: 2.8,
});

const MAT_NYLON_WHITE = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.05 });
const MAT_GOLD_PIN = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.15, metalness: 0.95 });
const MAT_CRIMP_BLUE = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.45, metalness: 0.1 });
const MAT_CRIMP_RED = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.45, metalness: 0.1 });
const MAT_CERAMIC_WHITE = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.65, metalness: 0.0 });
const MAT_SMD_BODY = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5, metalness: 0.1 });
const MAT_SMD_CAP = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.35, metalness: 0.2 });
const MAT_SMD_TIN = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.85 });
const MAT_LED_GREEN = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 2.0, roughness: 0.2 });
const MAT_LED_AMBER = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 2.0, roughness: 0.2 });
const MAT_HEX_RECESS = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, metalness: 0.2 });

// Shrouded JST/Molex PCB Header (Female Housing with Gold Male Pins)
function createJSTHeader(pinCount = 4, isVertical = true) {
  const g = new THREE.Group();
  const w = Math.max(0.06, pinCount * 0.024 + 0.02);
  const h = 0.042;
  const d = 0.040;

  // Outer shrouded nylon housing with locking ramp on rear
  const housing = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), MAT_NYLON_WHITE);
  housing.position.set(0, h / 2, 0);
  housing.castShadow = true;
  g.add(housing);

  // Recessed pocket for mating plug
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(w - 0.008, h - 0.008, d - 0.010), MAT_CHASSIS_DARK);
  pocket.position.set(0, h / 2 + 0.004, 0);
  g.add(pocket);

  // Gold square contact pins
  const pinPitch = (w - 0.024) / Math.max(1, pinCount - 1);
  for (let i = 0; i < pinCount; i++) {
    const px = -(w - 0.024) / 2 + (i * pinPitch);
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.034, 0.004), MAT_GOLD_PIN);
    pin.position.set(px, h / 2, 0);
    g.add(pin);
  }

  // Polarizing friction lock tab on rear face
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

  // Nylon plug shell
  const plug = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), MAT_NYLON_WHITE);
  plug.position.set(0, h / 2, 0);
  plug.castShadow = true;
  g.add(plug);

  // Top flex latch lever
  const latch = new THREE.Mesh(new THREE.BoxGeometry(w * 0.35, 0.008, d * 0.65), MAT_NYLON_WHITE);
  latch.position.set(0, h + 0.004, 0);
  g.add(latch);

  // Rear strain relief crimp collars where wires enter
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

  // Phenolic black base
  const base = new THREE.Mesh(new THREE.BoxGeometry(totalW, h, d), MAT_CHASSIS_DARK);
  base.position.set(0, h / 2, 0);
  base.castShadow = true;
  g.add(base);

  // Insulating barrier fins between terminals
  for (let i = 0; i <= numPositions; i++) {
    const fx = -totalW / 2 + 0.02 + (i * pitch);
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.025, d * 0.9), MAT_CHASSIS_DARK);
    fin.position.set(fx, h + 0.012, 0);
    g.add(fin);
  }

  // Brass binding head screws & clamping square washers
  for (let i = 0; i < numPositions; i++) {
    const sx = -totalW / 2 + 0.02 + (i * pitch) + (pitch / 2);
    // Square washer
    const washer = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.004, 0.024), MAT_BRASS_FITTING);
    washer.position.set(sx, h + 0.002, 0);
    g.add(washer);

    // Screw head with slot
    const screwHead = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.008, 16), MAT_BRASS_FITTING);
    screwHead.position.set(sx, h + 0.008, 0);
    g.add(screwHead);

    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.004, 0.020), MAT_HEX_RECESS);
    slot.position.set(sx, h + 0.011, 0);
    g.add(slot);
  }

  // Clear acrylic safety touch-guard hinged flap
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
  // Fork lug
  const fork = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.003, 0.025), MAT_BRASS_FITTING);
  fork.position.set(0, 0, 0.012);
  g.add(fork);
  // Insulation vinyl sleeve
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.025, 12), matInsulation);
  sleeve.rotation.x = Math.PI / 2;
  sleeve.position.set(0, 0, -0.012);
  g.add(sleeve);
  return g;
}

// FASTON Quick-Disconnect Spade Terminal (for IEC C14 and Rocker switch)
function createFastonDisconnect(matInsulation = MAT_CRIMP_BLUE) {
  const g = new THREE.Group();
  // Female brass receptacle clip
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.012, 0.034), MAT_BRASS_FITTING);
  clip.position.set(0, 0, 0.017);
  g.add(clip);
  // Translucent colored PVC insulator boot
  const boot = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.016, 0.040), matInsulation);
  boot.position.set(0, 0, 0.015);
  g.add(boot);
  return g;
}

// Low-Profile Surface Mount FPC/FFC ZIF Socket (Flip-Lock Actuator)
function createFPCZIFConnector(width = 0.16) {
  const g = new THREE.Group();
  // White LCP housing body
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 0.016, 0.045), MAT_NYLON_WHITE);
  body.position.set(0, 0.008, 0);
  g.add(body);

  // Black flip-lock actuator arm (shown locked clamping the ribbon)
  const arm = new THREE.Mesh(new THREE.BoxGeometry(width - 0.012, 0.012, 0.018), MAT_CHASSIS_DARK);
  arm.position.set(0, 0.015, -0.012);
  g.add(arm);

  // Gold solder solder tabs on flanks
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
  // Threaded outer brass barrel (1/4-36 UNS)
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.045, 16), MAT_BRASS_FITTING);
  barrel.rotation.z = Math.PI / 2;
  g.add(barrel);
  // White PTFE Teflon insulator
  const ptfe = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.046, 16), MAT_CERAMIC_WHITE);
  ptfe.rotation.z = Math.PI / 2;
  g.add(ptfe);
  // Gold center socket contact
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.048, 8), MAT_GOLD_PIN);
  pin.rotation.z = Math.PI / 2;
  g.add(pin);
  // Hex mounting flange nut
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.012, 6), MAT_BRASS_FITTING);
  nut.rotation.z = Math.PI / 2;
  nut.position.x = -0.015;
  g.add(nut);
  return g;
}

// Gold-Plated Precision Male SMA Plug (with Knurled Hex Nut & Coax Ferrule)
function createSMAPlugMale() {
  const g = new THREE.Group();
  // Knurled hexagonal coupling nut
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.028, 6), MAT_BRASS_FITTING);
  nut.rotation.z = Math.PI / 2;
  g.add(nut);
  // Coaxial crimp ferrule with black heatshrink strain relief
  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.035, 12), MAT_CHASSIS_DARK);
  ferrule.rotation.z = Math.PI / 2;
  ferrule.position.x = 0.030;
  g.add(ferrule);
  return g;
}

// Authentic Dual-Facet Industrial Rocker Switch (with molded 'I' / 'O' and pivot)
function createRealisticRockerSwitch(options = {}) {
  const group = new THREE.Group();
  group.name = 'Switch_Rocker_Rear';

  // Outer snap-in bezel frame (black nylon with rounded outer chamfer)
  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(0.20, 0.32, 0.04),
    MAT_CHASSIS_DARK
  );
  bezel.position.z = 0.01;
  group.add(bezel);

  // Recessed inner switch pocket
  const pocket = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.26, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x0f1115, roughness: 0.8 })
  );
  pocket.position.z = 0.02;
  group.add(pocket);

  // Dual-facet pivot rocker group (pivots around horizontal X axis)
  const rockerPivot = new THREE.Group();
  rockerPivot.name = 'Pivot_RockerPaddle';
  rockerPivot.position.set(0, 0, 0.022);

  // When ON (true): rocker is tilted so top 'I' facet is pressed inward into pocket,
  // and bottom 'O' facet is tilted outward towards operator!
  const tiltAngle = options.isOn !== false ? 0.22 : -0.22; // 12.6 degrees
  rockerPivot.rotation.x = tiltAngle;

  const matRockerPaddle = new THREE.MeshStandardMaterial({
    color: 0x181c22,
    roughness: 0.55,
    metalness: 0.12,
  });

  // Top facet (I - ON position)
  const facetTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.126, 0.118, 0.022),
    matRockerPaddle
  );
  facetTop.position.set(0, 0.059, 0.005);
  rockerPivot.add(facetTop);

  // High-contrast embossed white "I" bar on top facet
  const markI = new THREE.Mesh(
    new THREE.BoxGeometry(0.014, 0.055, 0.006),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  );
  markI.position.set(0, 0.059, 0.017);
  rockerPivot.add(markI);

  // Green LED power pilot dot on top facet when powered ON
  if (options.isOn !== false) {
    const pilotDot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.006, 12),
      new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        emissive: 0x16a34a,
        emissiveIntensity: 2.0,
        roughness: 0.2,
      })
    );
    pilotDot.rotation.x = Math.PI / 2;
    pilotDot.position.set(0, 0.095, 0.017);
    rockerPivot.add(pilotDot);
  }

  // Bottom facet (O - OFF position)
  const facetBottom = new THREE.Mesh(
    new THREE.BoxGeometry(0.126, 0.118, 0.022),
    matRockerPaddle
  );
  facetBottom.position.set(0, -0.059, 0.005);
  rockerPivot.add(facetBottom);

  // High-contrast embossed white "O" ring on bottom facet
  const markO = new THREE.Mesh(
    new THREE.TorusGeometry(0.024, 0.005, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  );
  markO.position.set(0, -0.059, 0.017);
  rockerPivot.add(markO);

  group.add(rockerPivot);
  group.userData.rockerPivot = rockerPivot;

  // Behind panel switch housing & FASTON quick-connect terminals
  const bodyRear = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.24, 0.16),
    MAT_CHASSIS_DARK
  );
  bodyRear.position.z = -0.08;
  group.add(bodyRear);

  // 4x 6.3mm tin-plated brass FASTON spade blades
  for (const bx of [-0.045, 0.045]) {
    for (const by of [-0.06, 0.06]) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.006, 0.024, 0.035),
        MAT_BRASS_FITTING
      );
      blade.position.set(bx, by, -0.17);
      group.add(blade);
    }
  }

  return group;
}

// Dedicated 50mm DC Brushless Cooling Fan for SMPS Power Supply
function createSMPSFan() {
  const g = new THREE.Group();
  g.name = 'Fan_SMPS_Cooling';

  // 50x50x15mm Fan Frame (Scale: 0.18 x 0.18 x 0.035)
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.18, 0.035),
    MAT_CHASSIS_DARK
  );
  g.add(frame);

  // Circular orifice vent cutout
  const orifice = new THREE.Mesh(
    new THREE.CylinderGeometry(0.076, 0.076, 0.038, 24),
    MAT_CHASSIS_DARK
  );
  orifice.rotation.x = Math.PI / 2;
  g.add(orifice);

  // 4 Corner DIN 912 M3 Hex Socket Screws bolting fan to SMPS metal casing
  for (const sx of [-0.072, 0.072]) {
    for (const sy of [-0.072, 0.072]) {
      const screw = createHexSocketScrew(0.008, 0.018, { material: MAT_CHROME });
      screw.position.set(sx, sy, 0.018);
      g.add(screw);
    }
  }

  // Steel wire safety finger guard grill (3 concentric chrome wire rings + 4 spokes)
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

  // Motor rotor hub & 7 aerodynamic fan blades
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

  // 2-wire red/black power harness lead
  const pwrLead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.004, 0.004, 0.08, 8),
    new THREE.MeshStandardMaterial({ color: 0xdc2626 })
  );
  pwrLead.position.set(0.06, -0.09, -0.01);
  g.add(pwrLead);

  return g;
}

// Procedural Multi-Layer FR-4 PCB Solder Mask & Silk Canvas Texture
function createMotherboardCanvasTexture() {
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

  // Length-matched bus serpentine routes
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

  // ADC Analog guard ring & differential traces
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

  // Dense plated vias
  for (let vx = 40; vx < 980; vx += 36) {
    for (let vy = 40; vy < 980; vy += 36) {
      if ((vx + vy) % 72 === 0) {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(vx + ((vy * 13) % 17), vy + ((vx * 7) % 13), 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#061a0c';
        ctx.beginPath();
        ctx.arc(vx + ((vy * 13) % 17), vy + ((vx * 7) % 13), 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // White silkscreen labels & outlines
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  // Board identification
  ctx.font = 'bold 22px monospace';
  ctx.fillText('SHIMADZU UV-1900i DSP CONTROLLER', 60, 60);
  ctx.font = '14px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('REV 3.2 · ASSY 206-31000-91 · MADE IN JAPAN · RoHS', 60, 85);
  ctx.fillText('SRE DESIGNS DUAL-BEAM ENGINE ARCHITECTURE', 60, 105);

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

  drawSilkBox(120, 460, 90, 80, 'STEP: GRATING', 'U5');
  drawSilkBox(120, 560, 90, 80, 'STEP: SELECT', 'U6');
  drawSilkBox(120, 660, 90, 80, 'STEP: TURRET', 'U7');
  drawSilkBox(120, 760, 90, 80, 'BLDC: CHOPPER', 'U8');

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
  drawSilkHeader(540, 140, 80, 35, 'J5: EXT_TRIG', 2);
  drawSilkHeader(640, 140, 180, 35, 'J6: FPC_LCD_40P', 40);

  // Mounting hole keepouts
  for (const [hx, hy] of [[50, 50], [974, 50], [50, 974], [974, 974]]) {
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(hx, hy, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#061a0c';
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

// Inline USB Port helper (correct outward normal facing +Z)
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
/**
 * Creates genuine 3D physical AC power cord with C13 plug, sweeping tabletop drape, and NEMA 5-15P wall plug.
 */
export function createPowerCord(iecPortPos, wallOutletPos = new THREE.Vector3(1.35, 0.08, 2.54)) {
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
  // Smooth natural gravity drape: drops to tabletop datum Y = 0.034, sweeps along rear bench border, and enters pedestal outlet
  const p0 = new THREE.Vector3(iecPortPos.x, iecPortPos.y, iecPortPos.z + 0.38);
  const p1 = new THREE.Vector3(iecPortPos.x, iecPortPos.y - 0.22, iecPortPos.z + 0.58);
  const p2 = new THREE.Vector3(iecPortPos.x + 0.15, 0.12, 2.85);
  const p3 = new THREE.Vector3(-1.00, 0.034, 3.05);
  const p4 = new THREE.Vector3(-0.30, 0.034, 3.10);
  const p5 = new THREE.Vector3(0.50, 0.034, 3.05);
  const p6 = new THREE.Vector3(1.10, 0.034, 2.90);
  const p7 = new THREE.Vector3(wallOutletPos.x, 0.06, wallOutletPos.z - 0.38);
  const p8 = new THREE.Vector3(wallOutletPos.x, wallOutletPos.y, wallOutletPos.z - 0.19);

  const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4, p5, p6, p7, p8]);
  const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.034, 12, false);
  const cableMesh = new THREE.Mesh(tubeGeo, MAT_CABLE_PVC);
  cableMesh.castShadow = true;
  cableMesh.receiveShadow = true;
  group.add(cableMesh);

  // 3. Molded NEMA 5-15P AC wall plug inserted flush into duplex pedestal outlet
  const wallPlugGroup = new THREE.Group();
  wallPlugGroup.position.set(wallOutletPos.x, wallOutletPos.y, wallOutletPos.z);

  const plugHead = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.15, 0.16),
    MAT_CABLE_PVC
  );
  plugHead.position.set(0, 0, -0.08);
  plugHead.castShadow = true;
  wallPlugGroup.add(plugHead);

  // Stepped strain relief boot at cord entry of plug
  const plugBoot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.036, 0.052, 0.08, 16),
    MAT_CABLE_PVC
  );
  plugBoot.rotation.x = Math.PI / 2;
  plugBoot.position.set(0, 0, -0.16);
  wallPlugGroup.add(plugBoot);

  // Grounded prongs inserted flush into socket receptacle slots
  for (const s of [-0.042, 0.042]) {
    const prong = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.044, 0.06),
      MAT_CHROME
    );
    prong.position.set(s, 0, -0.015);
    wallPlugGroup.add(prong);
  }
  const groundProng = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.07, 12),
    MAT_CHROME
  );
  groundProng.rotation.x = Math.PI / 2;
  groundProng.position.set(0, -0.042, -0.010);
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
 * Creates genuine 3D procedural internal wiring harnesses & cable routing:
 * - AC Mains Harness (Live, Neutral, Earth Ground) with M4 brass chassis ground stud
 * - DC Power Distribution Harness (+24V, +12V, GND) in nylon wire saddles
 * - High-Voltage Silicone Arc Starter Cable to Deuterium Lamp
 * - High-Temperature Twisted Pair to Tungsten-Halogen Lamp
 * - 4-Conductor Stepper Motor Ribbons (Grating Drive, Source Selector, Turret)
 * - Low-Noise RG-174 Shielded Coaxial Cable with Brass SMA Connectors to Photodiode Detector
 * - Amber Polyimide (Kapton) FPC Touchscreen Ribbon Cable
 * - 3-Pin Sleeved Cooling Fan Power Harness
 * - Rear Port Harnesses (DB-9 RS-232 ribbon, Dual USB shielded twisted pair, BNC trigger coax)
 * - Authentic 3D Nylon Chassis P-Clips holding all bundles securely along perimeter troughs
 */
export function createInternalWiring(opticsGroup, BASE_Y, CHAMBER_FLOOR_Y, CHAMBER_CENTER_Z) {
  const wireGroup = new THREE.Group();
  wireGroup.name = 'Assembly_InternalWiring';

  // Helper for 3D curved wire runs (centripetal curve eliminates looping and twisted black quads)
  function addWireRun(points, radius, material, name) {
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    const geom = new THREE.TubeGeometry(curve, Math.max(24, points.length * 10), radius, 10, false);
    const mesh = new THREE.Mesh(geom, material);
    mesh.name = name;
    mesh.castShadow = true;
    wireGroup.add(mesh);
    return mesh;
  }

  // Helper for genuine 3D physical nylon P-clips with M3 mounting screws
  function addCableClip(pos, rotY = 0) {
    const clipG = new THREE.Group();
    clipG.position.copy(pos);
    clipG.rotation.y = rotY;

    // Raised chassis casting boss
    const boss = new THREE.Mesh(
      new THREE.CylinderGeometry(0.020, 0.022, 0.015, 12),
      MAT_ALUM_ANODIZED
    );
    boss.position.y = -0.007;
    clipG.add(boss);

    // Nylon P-clip loop clamping the harness
    const loop = new THREE.Mesh(
      new THREE.TorusGeometry(0.024, 0.006, 8, 16, Math.PI * 1.3),
      MAT_NYLON_CLIP
    );
    loop.rotation.z = Math.PI / 2;
    loop.position.set(0, 0.014, 0);
    clipG.add(loop);

    // Mounting ear flange
    const ear = new THREE.Mesh(
      new THREE.BoxGeometry(0.028, 0.006, 0.032),
      MAT_NYLON_CLIP
    );
    ear.position.set(0.018, 0.003, 0);
    clipG.add(ear);

    // M3 DIN 7985 pan-head screw with washer
    const screw = createHexSocketScrew(0.010, 0.018, { material: MAT_CHROME });
    screw.position.set(0.022, 0.010, 0);
    clipG.add(screw);

    wireGroup.add(clipG);
  }

  // 1. AC Mains Power Harness (Black Live, White Neutral, Green/Yellow Earth)
  // IEC C14 inlet at (-1.40, BASE_Y + 0.45, 2.34) and Rocker Switch (-0.80, BASE_Y + 0.45, 2.34)
  // Both equipped with blue insulated FASTON quick-disconnect spade terminals (createFastonDisconnect)
  const fastonIECLive = createFastonDisconnect(MAT_CRIMP_BLUE);
  fastonIECLive.position.set(-1.40, BASE_Y + 0.45, 2.33);
  wireGroup.add(fastonIECLive);

  const fastonIECNeutral = createFastonDisconnect(MAT_CRIMP_BLUE);
  fastonIECNeutral.position.set(-1.36, BASE_Y + 0.45, 2.33);
  wireGroup.add(fastonIECNeutral);

  const fastonIECEarth = createFastonDisconnect(MAT_CRIMP_BLUE);
  fastonIECEarth.position.set(-1.40, BASE_Y + 0.40, 2.33);
  wireGroup.add(fastonIECEarth);

  const fastonSwInLive = createFastonDisconnect(MAT_CRIMP_BLUE);
  fastonSwInLive.position.set(-0.80, BASE_Y + 0.45, 2.33);
  wireGroup.add(fastonSwInLive);

  const fastonSwInNeutral = createFastonDisconnect(MAT_CRIMP_BLUE);
  fastonSwInNeutral.position.set(-0.76, BASE_Y + 0.45, 2.33);
  wireGroup.add(fastonSwInNeutral);

  const fastonSwOutLive = createFastonDisconnect(MAT_CRIMP_BLUE);
  fastonSwOutLive.position.set(-0.80, BASE_Y + 0.42, 2.31);
  wireGroup.add(fastonSwOutLive);

  const fastonSwOutNeutral = createFastonDisconnect(MAT_CRIMP_BLUE);
  fastonSwOutNeutral.position.set(-0.76, BASE_Y + 0.42, 2.31);
  wireGroup.add(fastonSwOutNeutral);

  addWireRun([
    new THREE.Vector3(-1.40, BASE_Y + 0.45, 2.33),
    new THREE.Vector3(-1.40, BASE_Y + 0.25, 2.22),
    new THREE.Vector3(-1.10, BASE_Y + 0.25, 2.22),
    new THREE.Vector3(-0.80, BASE_Y + 0.45, 2.33),
  ], 0.016, MAT_WIRE_BLACK, 'Wire_AC_LiveInletToSwitch');

  addWireRun([
    new THREE.Vector3(-1.36, BASE_Y + 0.45, 2.33),
    new THREE.Vector3(-1.36, BASE_Y + 0.22, 2.22),
    new THREE.Vector3(-1.06, BASE_Y + 0.22, 2.22),
    new THREE.Vector3(-0.76, BASE_Y + 0.45, 2.33),
  ], 0.016, MAT_WIRE_WHITE, 'Wire_AC_NeutralInletToSwitch');

  // Switched AC lines running along perimeter gutter forward to SMPS barrier block
  // Stays in floor gutter and approaches barrier strip strictly from the front air gap!
  addWireRun([
    new THREE.Vector3(-0.80, BASE_Y + 0.42, 2.31),
    new THREE.Vector3(-0.80, BASE_Y + 0.22, 2.22),
    new THREE.Vector3(-1.95, BASE_Y + 0.22, 2.22),
    new THREE.Vector3(-1.95, BASE_Y + 0.22, 1.00),
    new THREE.Vector3(-1.95, BASE_Y + 0.22, -0.98),
    new THREE.Vector3(-1.15, BASE_Y + 0.22, -0.98),
    new THREE.Vector3(-1.00, BASE_Y + 0.38, -0.83),
  ], 0.016, MAT_WIRE_BLACK, 'Wire_AC_SwitchedLive');

  addWireRun([
    new THREE.Vector3(-0.76, BASE_Y + 0.42, 2.31),
    new THREE.Vector3(-0.76, BASE_Y + 0.20, 2.20),
    new THREE.Vector3(-1.91, BASE_Y + 0.20, 2.20),
    new THREE.Vector3(-1.91, BASE_Y + 0.20, 1.00),
    new THREE.Vector3(-1.91, BASE_Y + 0.20, -0.98),
    new THREE.Vector3(-1.15, BASE_Y + 0.20, -0.98),
    new THREE.Vector3(-0.96, BASE_Y + 0.38, -0.83),
  ], 0.016, MAT_WIRE_WHITE, 'Wire_AC_SwitchedNeutral');

  // Blue spade crimps clamped under SMPS barrier screws 1 (Live) and 2 (Neutral)
  const spadeSMPSLive = createSpadeCrimpTerminal(MAT_CRIMP_BLUE);
  spadeSMPSLive.position.set(-1.00, BASE_Y + 0.38, -0.83);
  spadeSMPSLive.rotation.x = -Math.PI / 2;
  wireGroup.add(spadeSMPSLive);

  const spadeSMPSNeutral = createSpadeCrimpTerminal(MAT_CRIMP_BLUE);
  spadeSMPSNeutral.position.set(-0.96, BASE_Y + 0.38, -0.83);
  spadeSMPSNeutral.rotation.x = -Math.PI / 2;
  wireGroup.add(spadeSMPSNeutral);

  // Chassis Earth Ground Conductor with Ring Terminal on Brass Ground Stud
  addWireRun([
    new THREE.Vector3(-1.40, BASE_Y + 0.40, 2.33),
    new THREE.Vector3(-1.40, BASE_Y + 0.22, 2.25),
    new THREE.Vector3(-1.35, BASE_Y + 0.18, 2.10),
  ], 0.018, MAT_WIRE_GREEN_YELLOW, 'Wire_AC_EarthGround');

  // Brass ground stud bolted to die-cast baseplate
  const groundStud = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.04, 16),
    MAT_BRASS_FITTING
  );
  groundStud.name = 'Fastener_GroundLug_M4';
  groundStud.position.set(-1.35, BASE_Y + 0.18, 2.10);
  wireGroup.add(groundStud);

  const groundLugRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.026, 0.008, 8, 16),
    MAT_BRASS_FITTING
  );
  groundLugRing.rotation.x = Math.PI / 2;
  groundLugRing.position.set(-1.35, BASE_Y + 0.175, 2.10);
  wireGroup.add(groundLugRing);

  // Earth ground wire from stud to SMPS barrier screw 3 (PE)
  addWireRun([
    new THREE.Vector3(-1.35, BASE_Y + 0.18, 2.10),
    new THREE.Vector3(-1.87, BASE_Y + 0.18, 1.50),
    new THREE.Vector3(-1.87, BASE_Y + 0.18, -0.98),
    new THREE.Vector3(-1.15, BASE_Y + 0.20, -0.98),
    new THREE.Vector3(-0.92, BASE_Y + 0.38, -0.83),
  ], 0.016, MAT_WIRE_GREEN_YELLOW, 'Wire_SMPS_Earth');

  const spadeSMPSEarth = createSpadeCrimpTerminal(MAT_CRIMP_BLUE);
  spadeSMPSEarth.position.set(-0.92, BASE_Y + 0.38, -0.83);
  spadeSMPSEarth.rotation.x = -Math.PI / 2;
  wireGroup.add(spadeSMPSEarth);

  // 2. DC Power Distribution Bundle (+24V Red, GND Black)
  // Departing SMPS barrier terminals 4 (+24V) and 6 (GND) with spade crimps
  const spadeSMPS24V = createSpadeCrimpTerminal(MAT_CRIMP_RED);
  spadeSMPS24V.position.set(-0.88, BASE_Y + 0.38, -0.83);
  spadeSMPS24V.rotation.x = Math.PI / 2;
  wireGroup.add(spadeSMPS24V);

  const spadeSMPSGND = createSpadeCrimpTerminal(MAT_CRIMP_BLUE);
  spadeSMPSGND.position.set(-0.80, BASE_Y + 0.38, -0.83);
  spadeSMPSGND.rotation.x = Math.PI / 2;
  wireGroup.add(spadeSMPSGND);

  // Routes forward across 42cm air gap directly into Header_DC_Power on Motherboard
  addWireRun([
    new THREE.Vector3(-0.88, BASE_Y + 0.38, -0.83),
    new THREE.Vector3(-0.88, BASE_Y + 0.22, -0.98),
    new THREE.Vector3(-0.85, BASE_Y + 0.20, -1.15),
    new THREE.Vector3(-0.85, BASE_Y + 0.19, -1.29),
  ], 0.020, MAT_WIRE_RED, 'Harness_DC_24V');

  addWireRun([
    new THREE.Vector3(-0.80, BASE_Y + 0.38, -0.83),
    new THREE.Vector3(-0.80, BASE_Y + 0.20, -0.98),
    new THREE.Vector3(-0.85, BASE_Y + 0.19, -1.15),
    new THREE.Vector3(-0.85, BASE_Y + 0.19, -1.29),
  ], 0.020, MAT_WIRE_BLACK, 'Harness_DC_GND');

  // Mating 4-pin JST-VH plug seated firmly into Header_DC_Power
  const plugDCPower = createJSTMatingPlug(4);
  plugDCPower.name = 'Plug_DC_Power_4Pin';
  plugDCPower.position.set(-0.85, BASE_Y + 0.19, -1.29);
  plugDCPower.rotation.y = Math.PI;
  wireGroup.add(plugDCPower);

  // Helper: Molded vulcanized rubber bulkhead feed-through grommet
  function addBulkheadGrommet(x, y, z, rotationZ = 0) {
    const grom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.9, metalness: 0.1 })
    );
    grom.position.set(x, y, z);
    if (rotationZ !== 0) grom.rotation.z = rotationZ;
    else grom.rotation.x = Math.PI / 2;
    wireGroup.add(grom);
    return grom;
  }

  // Physical rubber grommet feed-through seals on partition walls
  addBulkheadGrommet(-1.95, BASE_Y + 0.18, 0.02); // Left bulkhead: D2 HV and Halogen DC leads
  addBulkheadGrommet(-0.48, BASE_Y + 0.16, 0.02); // Selector motor ribbon
  addBulkheadGrommet(-0.45, BASE_Y + 0.16, 0.02); // Grating motor ribbon
  addBulkheadGrommet(0.05, BASE_Y + 0.16, 0.02);  // Center bulkhead: Fan 12V and rear IO harnesses
  addBulkheadGrommet(0.10, BASE_Y + 0.13, -0.33, Math.PI / 2); // Floor trough: Carousel drive ribbon

  // 3. Deuterium Lamp High-Voltage Silicone Ignition Cable
  // Routes from Motherboard ballast header along front trough to outer gutter at X = -1.95
  // Zero overlap with SMPS or optical components
  addWireRun([
    new THREE.Vector3(-1.35, BASE_Y + 0.19, -1.29),
    new THREE.Vector3(-1.95, BASE_Y + 0.18, -1.29),
    new THREE.Vector3(-1.95, BASE_Y + 0.18, -0.10),
    new THREE.Vector3(-1.95, BASE_Y + 0.18, 0.02),
    new THREE.Vector3(-1.95, BASE_Y + 0.18, 0.40),
    new THREE.Vector3(-1.95, BASE_Y + 0.18, 0.85),
    new THREE.Vector3(-1.95, BASE_Y + 0.18, 1.30),
    new THREE.Vector3(-1.65, BASE_Y + 0.35, 1.45),
    new THREE.Vector3(-1.50, BASE_Y + 0.65, 1.48),
    new THREE.Vector3(-1.50, BASE_Y + 0.97, 1.50),
  ], 0.022, MAT_WIRE_ORANGE, 'Cable_D2_HighVoltage');

  const bootD2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.04, 12), MAT_CHASSIS_DARK);
  bootD2.position.set(-1.50, BASE_Y + 0.97, 1.50);
  wireGroup.add(bootD2);

  // 4. Tungsten-Halogen Lamp Twisted Pair Leads
  addWireRun([
    new THREE.Vector3(-1.571, BASE_Y + 0.65, 0.416),
    new THREE.Vector3(-1.57, BASE_Y + 0.42, 0.40),
    new THREE.Vector3(-1.95, BASE_Y + 0.20, 0.35),
    new THREE.Vector3(-1.95, BASE_Y + 0.20, 0.02),
    new THREE.Vector3(-1.95, BASE_Y + 0.20, -1.25),
    new THREE.Vector3(-1.25, BASE_Y + 0.19, -1.29),
  ], 0.014, MAT_WIRE_WHITE, 'Wire_Halogen_Lead1');

  addWireRun([
    new THREE.Vector3(-1.571, BASE_Y + 0.63, 0.416),
    new THREE.Vector3(-1.57, BASE_Y + 0.40, 0.40),
    new THREE.Vector3(-1.95, BASE_Y + 0.20, 0.33),
    new THREE.Vector3(-1.95, BASE_Y + 0.20, 0.02),
    new THREE.Vector3(-1.95, BASE_Y + 0.20, -1.23),
    new THREE.Vector3(-1.25, BASE_Y + 0.19, -1.29),
  ], 0.014, MAT_WIRE_RED, 'Wire_Halogen_Lead2');

  // 5. Monochromator Grating Stepper Motor Ribbon Cable (4-conductor)
  // Connects Header_Stepper_Grating on Motherboard to grating sine-bar motor via aisle channel
  const plugGratingMB = createJSTMatingPlug(4);
  plugGratingMB.name = 'Plug_Stepper_Grating_MB';
  plugGratingMB.position.set(-1.18, BASE_Y + 0.19, -1.29);
  plugGratingMB.rotation.y = Math.PI;
  wireGroup.add(plugGratingMB);

  addWireRun([
    new THREE.Vector3(-1.18, BASE_Y + 0.19, -1.29),
    new THREE.Vector3(-1.18, BASE_Y + 0.15, -1.02),
    new THREE.Vector3(-0.45, BASE_Y + 0.15, -1.02),
    new THREE.Vector3(-0.45, BASE_Y + 0.15, 0.02),
    new THREE.Vector3(-0.35, BASE_Y + 0.16, 0.45),
    new THREE.Vector3(-0.25, BASE_Y + 0.18, 0.85),
    new THREE.Vector3(-0.25, BASE_Y + 0.28, 1.05),
  ], 0.024, MAT_WIRE_BLUE, 'Ribbon_GratingStepper');

  const plugGratingMotor = createJSTMatingPlug(4);
  plugGratingMotor.name = 'Plug_Stepper_Grating_Motor';
  plugGratingMotor.position.set(-0.25, BASE_Y + 0.28, 1.05);
  wireGroup.add(plugGratingMotor);

  // 6. Source Selection Flip-Mirror Motor Ribbon
  const plugSelectorMB = createJSTMatingPlug(4);
  plugSelectorMB.name = 'Plug_Stepper_Selector_MB';
  plugSelectorMB.position.set(-1.32, BASE_Y + 0.19, -1.29);
  plugSelectorMB.rotation.y = Math.PI;
  wireGroup.add(plugSelectorMB);

  addWireRun([
    new THREE.Vector3(-1.32, BASE_Y + 0.19, -1.29),
    new THREE.Vector3(-1.32, BASE_Y + 0.15, -1.06),
    new THREE.Vector3(-0.48, BASE_Y + 0.15, -1.06),
    new THREE.Vector3(-0.48, BASE_Y + 0.15, 0.02),
    new THREE.Vector3(-0.65, BASE_Y + 0.22, 0.45),
    new THREE.Vector3(-1.08, BASE_Y + 0.35, 0.80),
    new THREE.Vector3(-1.08, BASE_Y + 0.52, 1.08),
  ], 0.018, MAT_WIRE_RED, 'Ribbon_SourceSelector');

  const plugSelectorMotor = createJSTMatingPlug(4);
  plugSelectorMotor.name = 'Plug_Stepper_Selector_Motor';
  plugSelectorMotor.position.set(-1.08, BASE_Y + 0.52, 1.08);
  wireGroup.add(plugSelectorMotor);

  // 7. Cuvette Carousel Turret Drive Ribbon
  const plugCarouselMB = createJSTMatingPlug(4);
  plugCarouselMB.name = 'Plug_Stepper_Carousel_MB';
  plugCarouselMB.position.set(-1.05, BASE_Y + 0.19, -1.29);
  plugCarouselMB.rotation.y = Math.PI;
  wireGroup.add(plugCarouselMB);

  addWireRun([
    new THREE.Vector3(-1.05, BASE_Y + 0.19, -1.29),
    new THREE.Vector3(-1.05, BASE_Y + 0.17, -1.15),
    new THREE.Vector3(-0.50, BASE_Y + 0.17, -1.15),
    new THREE.Vector3(0.10, BASE_Y + 0.17, -1.18),
    new THREE.Vector3(0.55, BASE_Y + 0.17, -1.18),
    new THREE.Vector3(1.05, BASE_Y + 0.17, -1.18),
  ], 0.022, MAT_WIRE_BLUE, 'Ribbon_CarouselMotor');

  const plugCarouselMotor = createJSTMatingPlug(4);
  plugCarouselMotor.name = 'Plug_Stepper_Carousel_Motor';
  plugCarouselMotor.position.set(1.05, BASE_Y + 0.17, -1.18);
  wireGroup.add(plugCarouselMotor);

  // 8. Low-Noise Shielded Detector Coaxial Cable with Precision Gold SMA Plugs
  // Reconnects Plug_SMA_PreAmp firmly into Socket_PreAmp_SMA at (1.80, BASE_Y + 0.82, -2.05)
  const smaPreAmpPlug = createSMAPlugMale();
  smaPreAmpPlug.name = 'Plug_SMA_PreAmp';
  smaPreAmpPlug.position.set(1.80, BASE_Y + 0.82, -2.05);
  smaPreAmpPlug.rotation.x = -Math.PI / 2; // Mates with female jack facing upward
  wireGroup.add(smaPreAmpPlug);

  addWireRun([
    new THREE.Vector3(1.80, BASE_Y + 0.82, -2.05),
    new THREE.Vector3(1.80, BASE_Y + 0.86, -2.05),
    new THREE.Vector3(1.86, BASE_Y + 0.50, -2.05),
    new THREE.Vector3(1.86, BASE_Y + 0.18, -2.05),
    new THREE.Vector3(0.05, BASE_Y + 0.18, -2.15),
    new THREE.Vector3(-0.55, BASE_Y + 0.18, -2.15),
    new THREE.Vector3(-0.74, BASE_Y + 0.205, -1.90),
  ], 0.017, MAT_WIRE_COAX, 'Cable_DetectorCoax_RG174');

  const smaMBPlug = createSMAPlugMale();
  smaMBPlug.name = 'Plug_SMA_Motherboard';
  smaMBPlug.position.set(-0.74, BASE_Y + 0.205, -1.90);
  smaMBPlug.rotation.z = Math.PI / 2;
  wireGroup.add(smaMBPlug);

  // Detector Pigtail Leads connecting silicon photodiodes into pre-amp PCB
  // Sample Photodiode pigtail (1.59, BASE_Y + 0.65, -2.12) -> Pre-Amp (1.78, BASE_Y + 0.65, -2.05)
  addWireRun([
    new THREE.Vector3(1.59, BASE_Y + 0.65, -2.12),
    new THREE.Vector3(1.72, BASE_Y + 0.65, -2.12),
    new THREE.Vector3(1.78, BASE_Y + 0.65, -2.05),
  ], 0.014, MAT_WIRE_COAX, 'Wire_Pigtail_SampleDet');

  // Reference Photodiode pigtail (0.55, BASE_Y + 0.65, -2.12) -> Pre-Amp (1.78, BASE_Y + 0.65, -2.05)
  addWireRun([
    new THREE.Vector3(0.55, BASE_Y + 0.65, -2.12),
    new THREE.Vector3(0.55, BASE_Y + 0.40, -2.15),
    new THREE.Vector3(1.70, BASE_Y + 0.40, -2.15),
    new THREE.Vector3(1.78, BASE_Y + 0.62, -2.05),
  ], 0.014, MAT_WIRE_COAX, 'Wire_Pigtail_RefDet');

  // 9. Display Flexible Flat Cable (FPC Ribbon)
  // Continuous 40-pin Kapton ribbon connecting Socket_FPC_ZIF_MB on Motherboard to Socket_FPC_ZIF_LCD on LCD sub-board
  const fpcPoints = [
    new THREE.Vector3(-1.10, BASE_Y + 0.19, -1.45),
    new THREE.Vector3(-1.10, BASE_Y + 0.35, -1.45),
    new THREE.Vector3(-1.10, BASE_Y + 0.65, -1.35),
    new THREE.Vector3(-1.09, 1.45, -1.23),
    new THREE.Vector3(-1.09, 1.74, -1.23),
  ];
  const fpcCurve = new THREE.CatmullRomCurve3(fpcPoints);
  const fpcGeo = new THREE.TubeGeometry(fpcCurve, 24, 0.025, 4, false);
  const fpcMesh = new THREE.Mesh(fpcGeo, MAT_FPC_KAPTON);
  fpcMesh.name = 'FPC_TouchscreenRibbon_Kapton';
  wireGroup.add(fpcMesh);

  // 10. Cooling Fan 3-Pin Sleeved Cable
  const plugFanFrame = createJSTMatingPlug(3);
  plugFanFrame.name = 'Plug_Fan_MotorFrame';
  plugFanFrame.position.set(1.40, BASE_Y + 0.95, 2.18);
  wireGroup.add(plugFanFrame);

  addWireRun([
    new THREE.Vector3(1.40, BASE_Y + 0.95, 2.18),
    new THREE.Vector3(1.40, BASE_Y + 0.18, 2.16),
    new THREE.Vector3(0.80, BASE_Y + 0.18, 2.16),
    new THREE.Vector3(0.05, BASE_Y + 0.18, 2.16),
    new THREE.Vector3(0.05, BASE_Y + 0.16, 0.02),
    new THREE.Vector3(-0.45, BASE_Y + 0.16, 0.02),
    new THREE.Vector3(-0.45, BASE_Y + 0.16, -0.98),
    new THREE.Vector3(-0.95, BASE_Y + 0.19, -1.29),
  ], 0.015, MAT_WIRE_BLACK, 'Cable_CoolingFan_12V');

  const plugFanMB = createJSTMatingPlug(3);
  plugFanMB.name = 'Plug_Fan_Motherboard';
  plugFanMB.position.set(-0.95, BASE_Y + 0.19, -1.29);
  plugFanMB.rotation.y = Math.PI;
  wireGroup.add(plugFanMB);

  // 11. Rear DB-9 RS-232 Port 10-Conductor Ribbon Cable
  const idcDB9Rear = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, 0.04), MAT_CHASSIS_DARK);
  idcDB9Rear.position.set(0.65, BASE_Y + 0.45, 2.32);
  wireGroup.add(idcDB9Rear);

  addWireRun([
    new THREE.Vector3(0.65, BASE_Y + 0.45, 2.32),
    new THREE.Vector3(0.65, BASE_Y + 0.18, 2.18),
    new THREE.Vector3(0.05, BASE_Y + 0.18, 2.18),
    new THREE.Vector3(0.05, BASE_Y + 0.16, 0.02),
    new THREE.Vector3(-0.20, BASE_Y + 0.16, -0.80),
    new THREE.Vector3(-0.74, BASE_Y + 0.205, -1.50),
  ], 0.020, MAT_WIRE_BLUE, 'Harness_DB9_RS232');

  const idcDB9MB = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.040, 0.12), MAT_CHASSIS_DARK);
  idcDB9MB.position.set(-0.74, BASE_Y + 0.205, -1.50);
  wireGroup.add(idcDB9MB);

  // 12. Rear USB Ports Shielded Data Cable
  const usbBootRear = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.025, 0.045), MAT_CHASSIS_DARK);
  usbBootRear.position.set(-0.10, BASE_Y + 0.45, 2.32);
  wireGroup.add(usbBootRear);

  addWireRun([
    new THREE.Vector3(-0.10, BASE_Y + 0.45, 2.32),
    new THREE.Vector3(-0.10, BASE_Y + 0.18, 2.18),
    new THREE.Vector3(0.05, BASE_Y + 0.18, 2.18),
    new THREE.Vector3(0.05, BASE_Y + 0.16, 0.02),
    new THREE.Vector3(-0.20, BASE_Y + 0.16, -0.90),
    new THREE.Vector3(-0.74, BASE_Y + 0.19, -1.65),
  ], 0.018, MAT_WIRE_BLACK, 'Harness_DualUSB');

  const plugUSBMB = createJSTMatingPlug(5);
  plugUSBMB.name = 'Plug_USB_Motherboard';
  plugUSBMB.position.set(-0.74, BASE_Y + 0.19, -1.65);
  wireGroup.add(plugUSBMB);

  // 13. Rear BNC External Trigger Jack Coaxial Lead
  const bncBootRear = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.035, 12), MAT_CHASSIS_DARK);
  bncBootRear.position.set(1.30, BASE_Y + 0.45, 2.32);
  bncBootRear.rotation.x = Math.PI / 2;
  wireGroup.add(bncBootRear);

  addWireRun([
    new THREE.Vector3(1.30, BASE_Y + 0.45, 2.32),
    new THREE.Vector3(1.30, BASE_Y + 0.18, 2.18),
    new THREE.Vector3(0.05, BASE_Y + 0.18, 2.18),
    new THREE.Vector3(0.05, BASE_Y + 0.16, 0.02),
    new THREE.Vector3(-0.20, BASE_Y + 0.16, -1.00),
    new THREE.Vector3(-0.74, BASE_Y + 0.19, -1.77),
  ], 0.013, MAT_WIRE_COAX, 'Cable_BNC_Internal');

  const plugBNCMB = createJSTMatingPlug(2);
  plugBNCMB.name = 'Plug_BNC_Motherboard';
  plugBNCMB.position.set(-0.74, BASE_Y + 0.19, -1.77);
  wireGroup.add(plugBNCMB);

  // 14. Discrete Nylon P-Clips holding all harnesses firmly to chassis casting bosses
  // Along left AC / D2 gutter on breadboard:
  addCableClip(new THREE.Vector3(-1.52, BASE_Y + 0.20, 0.40));
  addCableClip(new THREE.Vector3(-1.52, BASE_Y + 0.20, 0.85));
  addCableClip(new THREE.Vector3(-1.52, BASE_Y + 0.20, 1.30));
  addCableClip(new THREE.Vector3(-1.48, BASE_Y + 0.20, -0.10));
  // Along rear bulkhead rail:
  addCableClip(new THREE.Vector3(1.35, BASE_Y + 0.17, 2.16), Math.PI / 2);
  addCableClip(new THREE.Vector3(0.65, BASE_Y + 0.17, 2.16), Math.PI / 2);
  addCableClip(new THREE.Vector3(0.05, BASE_Y + 0.17, 2.16), Math.PI / 2);
  addCableClip(new THREE.Vector3(-0.75, BASE_Y + 0.17, 2.16), Math.PI / 2);
  // Along central baseplate troughs:
  addCableClip(new THREE.Vector3(0.05, BASE_Y + 0.16, 1.20));
  addCableClip(new THREE.Vector3(0.05, BASE_Y + 0.16, 0.50));
  addCableClip(new THREE.Vector3(0.05, BASE_Y + 0.16, -0.20));
  addCableClip(new THREE.Vector3(0.05, BASE_Y + 0.16, -1.50));
  addCableClip(new THREE.Vector3(0.55, BASE_Y + 0.16, 0.65));
  // Along right detector bay:
  addCableClip(new THREE.Vector3(1.70, BASE_Y + 0.16, 0.70), -Math.PI / 4);
  addCableClip(new THREE.Vector3(1.98, BASE_Y + 0.18, CHAMBER_CENTER_Z + 0.35));

  opticsGroup.add(wireGroup);
  return wireGroup;
}

/**
 * Main Builder Function for Shimadzu UV-1900i Spectrophotometer Digital Twin
 */
export function createSpectrophotometerModel(options = {}) {
  const root = new THREE.Group();
  root.name = 'Spectrophotometer_Assembly';

  const opticalRaysGroup = new THREE.Group();
  opticalRaysGroup.name = 'Assembly_OpticalRays';
  opticalRaysGroup.visible = false;

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
    raySourceD2: null,
    raySourceW: null,
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
    // Threaded stud length 0.09m threads securely into blind tapped boss in baseplate (datum top = 0.30m)
    // stud top at 0.18 + 0.09 = 0.27m: 100% blind containment, zero floor penetration
    const foot = createVibrationFoot(0.09, 0.28, 0.18);
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

  // 5b. Display Interface & Touch Controller Sub-Board (PCB_LCD_Controller)
  // Dedicated FR-4 controller sub-board mounted on brass standoffs beneath console bezel
  const lcdCtrlPCB = new THREE.Mesh(
    new THREE.BoxGeometry(1.20, 0.016, 0.60),
    MAT_PCB_GREEN
  );
  lcdCtrlPCB.name = 'PCB_LCD_Controller';
  lcdCtrlPCB.position.set(0, -0.035, 0.18);
  bezelGroup.add(lcdCtrlPCB);

  // Standoff pillars mounting LCD controller to underside of bezel casting
  for (const sx of [-0.55, 0.55]) {
    for (const sz of [-0.25, 0.25]) {
      const standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.035, 6), MAT_BRASS_FITTING);
      standoff.position.set(sx, -0.018, 0.18 + sz);
      bezelGroup.add(standoff);

      const screw = createHexSocketScrew(0.010, 0.018, { material: MAT_CHROME });
      screw.position.set(sx, -0.043, 0.18 + sz);
      bezelGroup.add(screw);
    }
  }

  // 40-pin ZIF socket on rear edge of LCD controller board
  const lcdZif = createFPCZIFConnector(0.16);
  lcdZif.name = 'Socket_FPC_ZIF_LCD';
  lcdZif.position.set(0, -0.027, 0.18 - 0.24);
  lcdZif.rotation.y = Math.PI;
  bezelGroup.add(lcdZif);

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
  // Positioned in upper right quadrant of front fascia: ~1 inch (0.25 units) from top and side edges
  const badge = makeSREdesignsBadge(0.55);
  badge.position.set(-1.60, BASE_Y + 0.92, -2.385);
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
  const deckCollarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.04, 2.38), MAT_CHASSIS);
  deckCollarLeft.position.set(2.065, BASE_Y + 0.12 + 1.33, -1.19);
  deckCollarLeft.castShadow = true;
  deckCollarLeft.receiveShadow = true;
  explodedShellGroup.add(deckCollarLeft);
  chassisMeshes.push(deckCollarLeft);

  const deckCollarRight = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 2.38), MAT_CHASSIS);
  deckCollarRight.position.set(0.075, BASE_Y + 0.12 + 1.33, -1.19);
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

  // Solid Left Full-Depth Cheek Enclosure (X in [1.95, 2.18], Z in [-2.38, 0.00], 100% watertight from baseplate to deck)
  const cheekLeftFull = new THREE.Mesh(
    new THREE.BoxGeometry(0.23, 1.35, 2.38),
    MAT_CHASSIS
  );
  cheekLeftFull.name = 'Chassis_Cheek_Left';
  cheekLeftFull.position.set(2.065, BASE_Y + 0.12 + 0.675, -1.19);
  cheekLeftFull.castShadow = true;
  cheekLeftFull.receiveShadow = true;
  explodedShellGroup.add(cheekLeftFull);
  chassisMeshes.push(cheekLeftFull);

  // Solid Center Full-Depth Cheek Enclosure (X in [0.00, 0.15], Z in [-2.38, 0.00], 100% watertight from baseplate to deck)
  const cheekCenterFull = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 1.35, 2.38),
    MAT_CHASSIS
  );
  cheekCenterFull.name = 'Chassis_Cheek_Center';
  cheekCenterFull.position.set(0.075, BASE_Y + 0.12 + 0.675, -1.19);
  cheekCenterFull.castShadow = true;
  cheekCenterFull.receiveShadow = true;
  explodedShellGroup.add(cheekCenterFull);
  chassisMeshes.push(cheekCenterFull);

  // Labyrinth light-baffle gaskets on cheek inner returns sealing shadow lines light-tight
  const gasketLeft = new THREE.Mesh(new THREE.BoxGeometry(0.015, 1.33, 2.20), MAT_CHAMBER_INNER);
  gasketLeft.position.set(1.94, BASE_Y + 0.12 + 0.675, -1.22);
  explodedShellGroup.add(gasketLeft);

  const gasketRight = new THREE.Mesh(new THREE.BoxGeometry(0.015, 1.33, 2.20), MAT_CHAMBER_INNER);
  gasketRight.position.set(0.16, BASE_Y + 0.12 + 0.675, -1.22);
  explodedShellGroup.add(gasketRight);

  // Front lower sill under door apron (Y in [0.30, 0.58], Z = -2.35)
  const frontSill = new THREE.Mesh(new THREE.BoxGeometry(1.80, 0.28, 0.06), MAT_CHASSIS);
  frontSill.name = 'Chassis_FrontSill';
  frontSill.position.set(CHAMBER_CENTER_X, BASE_Y + 0.12 + 0.14, -2.35);
  frontSill.castShadow = true;
  frontSill.receiveShadow = true;
  explodedShellGroup.add(frontSill);
  chassisMeshes.push(frontSill);

  const frontSillTrim = new THREE.Mesh(new THREE.BoxGeometry(1.80, 0.02, 0.03), MAT_CHROME);
  frontSillTrim.position.set(CHAMBER_CENTER_X, BASE_Y + 0.12 + 0.28, -2.365);
  explodedShellGroup.add(frontSillTrim);

  // Authentic 4-Sided Perimeter Rebate Shelf (Hollow center aperture: 100% unobstructed view into sample chamber)
  const rebateRear = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.015, 0.04), MAT_CHAMBER_INNER);
  rebateRear.position.set(CHAMBER_CENTER_X, BASE_Y + 0.12 + 1.31, -0.14);
  explodedShellGroup.add(rebateRear);

  const rebateFront = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.015, 0.04), MAT_CHAMBER_INNER);
  rebateFront.position.set(CHAMBER_CENTER_X, BASE_Y + 0.12 + 1.31, -2.20);
  explodedShellGroup.add(rebateFront);

  const rebateLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 2.04), MAT_CHAMBER_INNER);
  rebateLeft.position.set(1.93, BASE_Y + 0.12 + 1.31, CHAMBER_CENTER_Z);
  explodedShellGroup.add(rebateLeft);

  const rebateRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 2.04), MAT_CHAMBER_INNER);
  rebateRight.position.set(0.17, BASE_Y + 0.12 + 1.31, CHAMBER_CENTER_Z);
  explodedShellGroup.add(rebateRight);

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
    new THREE.BoxGeometry(1.76, 0.02, 2.04),
    MAT_CHAMBER_INNER
  );
  chamberLinerFloor.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 0.01, CHAMBER_CENTER_Z);
  chamberLinerFloor.receiveShadow = true;
  explodedShellGroup.add(chamberLinerFloor);

  const linerLeft = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.20, 2.04), MAT_CHAMBER_INNER);
  linerLeft.position.set(1.94, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z);
  explodedShellGroup.add(linerLeft);

  const linerRight = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.20, 2.04), MAT_CHAMBER_INNER);
  linerRight.position.set(0.16, CHAMBER_FLOOR_Y + 0.60, CHAMBER_CENTER_Z);
  explodedShellGroup.add(linerRight);

  const linerBack = new THREE.Mesh(new THREE.BoxGeometry(1.76, 1.20, 0.02), MAT_CHAMBER_INNER);
  linerBack.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 0.60, -0.15);
  explodedShellGroup.add(linerBack);

  const linerFront = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.20, 0.02), MAT_CHAMBER_INNER);
  linerFront.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 0.10, -2.21);
  explodedShellGroup.add(linerFront);

  // Dual-Beam rear bulkhead aperture collimating rings & hollow partition barrels
  // 1. Reference Channel rear aperture barrel at X = 0.55
  const enterApertureRef = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16),
    MAT_CHROME
  );
  enterApertureRef.name = 'Aperture_Entry_Reference';
  enterApertureRef.rotation.x = Math.PI / 2;
  enterApertureRef.position.set(0.55, BASE_Y + 0.65, -0.15);
  explodedShellGroup.add(enterApertureRef);

  const enterBarrelRef = new THREE.Mesh(
    new THREE.CylinderGeometry(0.040, 0.040, 0.08, 16, 1, true),
    MAT_CHASSIS_DARK
  );
  enterBarrelRef.rotation.x = Math.PI / 2;
  enterBarrelRef.position.set(0.55, BASE_Y + 0.65, -0.15);
  explodedShellGroup.add(enterBarrelRef);

  // 2. Sample Channel rear aperture barrel at X = 1.59
  const enterAperture = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16),
    MAT_CHROME
  );
  enterAperture.name = 'Aperture_Entry';
  enterAperture.rotation.x = Math.PI / 2;
  enterAperture.position.set(1.59, BASE_Y + 0.65, -0.15);
  enterAperture.userData = {
    name: 'Aperture_Entry',
    title: 'Sample Chamber Entry Collimator Aperture',
    action: 'Entry Aperture (1.0 nm Bandwidth): Precision optical pinhole collar directing monochromatic sample beam into cuvette',
  };
  explodedShellGroup.add(enterAperture);
  interactiveObjects.push(enterAperture);

  const enterBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.040, 0.040, 0.08, 16, 1, true),
    MAT_CHASSIS_DARK
  );
  enterBarrel.rotation.x = Math.PI / 2;
  enterBarrel.position.set(1.59, BASE_Y + 0.65, -0.15);
  explodedShellGroup.add(enterBarrel);

  // Dual-Beam front bulkhead detector aperture rings & hollow partition barrels
  // 1. Reference Channel exit barrel at X = 0.55, Z = -2.10
  const exitApertureRef = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16),
    MAT_CHROME
  );
  exitApertureRef.rotation.x = Math.PI / 2;
  exitApertureRef.position.set(0.55, BASE_Y + 0.65, -2.10);
  explodedShellGroup.add(exitApertureRef);

  // 2. Sample Channel exit barrel at X = 1.59, Z = -2.10
  const exitAperture = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16),
    MAT_CHROME
  );
  exitAperture.name = 'Aperture_Exit';
  exitAperture.rotation.x = Math.PI / 2;
  exitAperture.position.set(1.59, BASE_Y + 0.65, -2.10);
  exitAperture.userData = {
    name: 'Aperture_Exit',
    title: 'Sample Chamber Exit Detector Aperture',
    action: 'Exit Aperture: Focuses transmitted light beam exiting the active quartz cuvette onto the silicon photodiode detector',
  };
  explodedShellGroup.add(exitAperture);
  interactiveObjects.push(exitAperture);

  const exitBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.040, 0.040, 0.08, 16, 1, true),
    MAT_CHASSIS_DARK
  );
  exitBarrel.rotation.x = Math.PI / 2;
  exitBarrel.position.set(1.59, BASE_Y + 0.65, -2.10);
  explodedShellGroup.add(exitBarrel);

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

  // Top horizontal door plate (fits flush into deck collar rebate with 1.5mm shadow gaps)
  const doorPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.77, 0.05, 2.22),
    MAT_CHASSIS
  );
  doorPlate.name = 'Door_TopPlate';
  doorPlate.position.set(0, -0.005, -1.11);
  doorPlate.castShadow = true;
  doorPlate.receiveShadow = true;
  chamberLidPivot.add(doorPlate);
  chassisMeshes.push(doorPlate);

  // Front vertical door apron (descends flush to front sill at Y = 0.58, Z = -2.37)
  const doorFrontApron = new THREE.Mesh(
    new THREE.BoxGeometry(1.77, 1.07, 0.06),
    MAT_CHASSIS
  );
  doorFrontApron.name = 'Door_FrontApron';
  doorFrontApron.position.set(0, -0.535, -2.22);
  doorFrontApron.castShadow = true;
  doorFrontApron.receiveShadow = true;
  chamberLidPivot.add(doorFrontApron);
  chassisMeshes.push(doorFrontApron);

  // Polished chrome lower edge trim runner on door apron
  const doorTrimRunner = new THREE.Mesh(
    new THREE.BoxGeometry(1.77, 0.024, 0.03),
    MAT_CHROME
  );
  doorTrimRunner.name = 'Door_TrimRunner';
  doorTrimRunner.position.set(0, -1.06, -2.235);
  chamberLidPivot.add(doorTrimRunner);

  // Silicone light-baffle gasket seals on door underside and apron interior
  const sealTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.015, 2.18),
    MAT_CHAMBER_INNER
  );
  sealTop.position.set(0, -0.035, -1.11);
  chamberLidPivot.add(sealTop);

  const sealFront = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 1.02, 0.015),
    MAT_CHAMBER_INNER
  );
  sealFront.position.set(0, -0.535, -2.18);
  chamberLidPivot.add(sealFront);

  // Knurled Satin-Chrome Precision Pull Handle
  const handleGroup = new THREE.Group();
  handleGroup.name = 'Btn_Lid_Handle';
  handleGroup.position.set(0, -0.18, -2.26);

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
  carouselPivot.position.set(CHAMBER_CENTER_X, BASE_Y + 0.40, CHAMBER_CENTER_Z);
  root.add(carouselPivot);
  animTargets.carouselPivot = carouselPivot;
  animTargets.explodedParts.push({ obj: carouselPivot, originY: BASE_Y + 0.40, deltaY: 0.6 });

  // Central rotary hub disk
  const hubDisk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 0.12, 32),
    MAT_ALUM_ANODIZED
  );
  hubDisk.position.y = -0.06;
  hubDisk.castShadow = true;
  hubDisk.receiveShadow = true;
  carouselPivot.add(hubDisk);

  // Center drive spindle
  const spindle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.26, 20),
    MAT_CHROME
  );
  spindle.position.y = 0.06;
  carouselPivot.add(spindle);

  // 6 Cuvette Cells spaced at 60° increments (Aligns cell 1 with optical beam at angle 0)
  const cuvetteRadius = 0.54;
  const cuvetteMeshes = [];
  animTargets.cuvetteLiquids = [];

  const sampleDefinitions = [
    { name: 'Blank Reference (DI Water)', formula: 'H2O', color: 0xf1f5f9, opacity: 0.40, peak: 'None (A = 0.000)' },
    { name: 'Potassium Permanganate (KMnO4)', formula: 'KMnO4 (100 µM)', color: 0x9333ea, opacity: 0.92, peak: '525 nm (A = 1.25)' },
    { name: 'Calf Thymus DNA (TE Buffer)', formula: 'dsDNA (50 ng/µL)', color: 0xe0f2fe, opacity: 0.50, peak: '260 nm (A = 1.15)' },
    { name: 'BSA Protein (Bradford Assay)', formula: 'BSA (1.0 mg/mL)', color: 0x2563eb, opacity: 0.90, peak: '595 nm (A = 1.42)' },
    { name: 'Chlorophyll a Extract', formula: 'C55H72MgN4O5', color: 0x16a34a, opacity: 0.90, peak: '430 & 662 nm (A = 1.45)' },
    { name: 'Oxidized Cytochrome c', formula: 'Heme (25 µM)', color: 0xea580c, opacity: 0.88, peak: '409 & 550 nm (A = 1.55)' },
  ];

  for (let c = 0; c < 6; c++) {
    const angle = (c * Math.PI) / 3;
    const cx = Math.cos(angle) * cuvetteRadius;
    const cz = Math.sin(angle) * cuvetteRadius;

    // Anodized aluminum cell holder pocket with open optical beam transmission windows
    const cellHolder = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.32, 0.24),
      MAT_CHASSIS_DARK
    );
    cellHolder.position.set(cx, 0.10, cz);
    cellHolder.castShadow = true;
    carouselPivot.add(cellHolder);

    // 10 mm optical pathlength synthetic fused silica quartz cuvette
    const cuvetteMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.48, 0.18),
      MAT_OPTICAL_GLASS
    );
    cuvetteMesh.name = `Glass_Cuvette_${c + 1}`;
    cuvetteMesh.position.set(cx, 0.25, cz); // Vertically centered at BASE_Y + 0.65 (BEAM_Y)
    cuvetteMesh.castShadow = true;
    const sDef = sampleDefinitions[c];
    cuvetteMesh.userData = {
      name: cuvetteMesh.name,
      cellNumber: c + 1,
      title: `Cell ${c + 1}: ${sDef.name}`,
      role: 'Sample Cuvette',
      action: `Cell ${c + 1}: ${sDef.name} [${sDef.formula}] — 10 mm quartz cuvette, peak at ${sDef.peak}. Click to select/pipette.`,
    };
    carouselPivot.add(cuvetteMesh);
    cuvetteMeshes.push(cuvetteMesh);
    interactiveObjects.push(cuvetteMesh);

    // Colored liquid column inside sample cuvette with realistic physical refraction
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: sDef.color,
      roughness: 0.06,
      metalness: 0.05,
      transparent: true,
      opacity: sDef.opacity,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity: 2.0,
    });
    const liquidMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.148, 0.36, 0.148),
      liquidMat
    );
    liquidMesh.position.set(cx, 0.23, cz);
    carouselPivot.add(liquidMesh);

    // Liquid surface tension concave meniscus
    const meniscusMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.070, 0.012, 16),
      liquidMat
    );
    meniscusMesh.position.set(cx, 0.41, cz);
    carouselPivot.add(meniscusMesh);

    animTargets.cuvetteLiquids.push({ mat: liquidMat, mesh: liquidMesh, meniscus: meniscusMesh });
  }

  // Monochromatic probe beam across active sample cuvette (Aligned coplanar along Z at BASE_Y + 0.65)
  const beamGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.95, 16);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.85,
  });
  const probeBeam = new THREE.Mesh(beamGeo, beamMat);
  probeBeam.name = 'Beam_Monochromatic';
  probeBeam.rotation.x = Math.PI / 2;
  probeBeam.position.set(1.59, BASE_Y + 0.65, -1.125);
  opticalRaysGroup.add(probeBeam);
  animTargets.probeBeam = probeBeam;
  animTargets.probeBeamMat = beamMat;

  // Cuvette Carousel Turret Drive Stepper Motor (bolted to sub-floor chassis mounting boss)
  const carouselMotor = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.10, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5, metalness: 0.7 })
  );
  carouselMotor.name = 'Motor_CarouselTurret';
  carouselMotor.position.set(1.05, BASE_Y + 0.12, -1.18);
  root.add(carouselMotor);

  // 4-Pin JST Stepper Header on carousel drive motor (mates with plugCarouselMotor at 1.05, BASE_Y + 0.17, -1.18)
  const hdrCarouselMotor = createJSTHeader(4);
  hdrCarouselMotor.name = 'Header_Motor_Carousel';
  hdrCarouselMotor.position.set(1.05, BASE_Y + 0.17, -1.18);
  root.add(hdrCarouselMotor);

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

  breadboard.userData = {
    name: 'Chassis_OpticalBreadboard',
    title: 'Precision Optical Breadboard',
    action: 'Cast-Aluminum Baseplate: Heavy-duty optical bench datum with M6 tapped grid securing all kinematic mounts',
  };
  interactiveObjects.push(breadboard);

  // A. Deuterium UV Arc Lamp Assembly (D2, 190 - 340 nm)
  const d2Assembly = new THREE.Group();
  d2Assembly.name = 'Assembly_DeuteriumLamp';
  d2Assembly.position.set(-1.50, BASE_Y + 0.65, 1.50);
  d2Assembly.rotation.y = 0.8727; // Aimed directly along optical axis to Source Selector Mirror
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

  d2Assembly.userData = {
    name: 'Assembly_DeuteriumLamp',
    title: 'Deuterium UV Arc Lamp (D2)',
    action: 'Deuterium Arc Lamp: 190 – 340 nm Continuous UV Source, 30W, Quartz Discharge Envelope, Heatsink Housing',
  };
  interactiveObjects.push(d2Assembly, d2Sink, d2Cap, d2Bulb);

  // B. Tungsten-Halogen Visible Lamp Assembly (WI, 340 - 1100 nm)
  // Replaced messy open gold cone with authentic cast-aluminum lamp house,
  // ceramic G4 socket, coiled tungsten capsule bulb, and nested rear collector mirror.
  const wAssembly = new THREE.Group();
  wAssembly.name = 'Assembly_TungstenLampHouse';
  wAssembly.position.set(-1.50, BASE_Y + 0.65, 0.50);
  wAssembly.rotation.y = -0.8727; // Aimed directly along optical axis to Source Selector Mirror
  opticsGroup.add(wAssembly);

  // 1. Cast-Aluminum Mounting Baseplate
  const wLampBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.025, 0.28),
    MAT_ALUM_ANODIZED
  );
  wLampBase.position.set(0.04, -0.22, 0);
  wAssembly.add(wLampBase);

  // 4x DIN 912 M3 socket head cap screws clamping lamp base to breadboard
  for (const bx of [-0.07, 0.15]) {
    for (const bz of [-0.10, 0.10]) {
      const washer = createWasher(0.016, 0.034, 0.006, { material: MAT_CHROME });
      washer.position.set(bx, -0.207 + 0.003, bz);
      const screw = createHexSocketScrew(0.014, 0.035, { material: MAT_CHROME });
      screw.position.set(bx, -0.207 + 0.006, bz);
      wAssembly.add(washer);
      wAssembly.add(screw);
    }
  }

  // 2. Vertical Finned Chimney Housing (Enclosed cavity, zero open cones)
  const wLampHousing = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.42, 0.24),
    MAT_ALUM_ANODIZED
  );
  wLampHousing.position.set(0.02, 0, 0);
  wAssembly.add(wLampHousing);

  // Vertical convective heat dissipation cooling fins
  for (let fi = -3; fi <= 3; fi++) {
    const finX = fi * 0.032;
    const topFin = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.07, 0.22),
      MAT_ALUM_ANODIZED
    );
    topFin.position.set(0.02 + finX, 0.24, 0);
    wAssembly.add(topFin);
  }

  // 3. Steatite Ceramic G4 Bi-Pin Lamp Socket (mounted at rear of housing)
  const g4Socket = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.10, 0.10),
    MAT_CERAMIC_WHITE
  );
  g4Socket.position.set(-0.07, 0, 0);
  wAssembly.add(g4Socket);

  // Silver pin contact receptacles on socket face
  for (const pz of [-0.02, 0.02]) {
    const pinHole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.02, 8),
      MAT_CHROME
    );
    pinHole.rotation.z = Math.PI / 2;
    pinHole.position.set(-0.038, 0, pz);
    wAssembly.add(pinHole);
  }

  // Rear strain relief grommet for ceramic G4 lead wires
  const grommet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.025, 12),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 })
  );
  grommet.rotation.z = Math.PI / 2;
  grommet.position.set(-0.11, 0, 0);
  wAssembly.add(grommet);

  // 4. Precision Parabolic Collector Reflector Cell (Machined optical aluminum, nested behind bulb)
  const collectorMirrorCup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.050, 0.045, 24, 1, true),
    MAT_CHROME
  );
  collectorMirrorCup.rotation.z = Math.PI / 2;
  collectorMirrorCup.position.set(-0.02, 0, 0);
  wAssembly.add(collectorMirrorCup);

  const mirrorBack = new THREE.Mesh(
    new THREE.CircleGeometry(0.050, 24),
    MAT_OPTICAL_MIRROR
  );
  mirrorBack.rotation.y = Math.PI / 2;
  mirrorBack.position.set(-0.042, 0, 0);
  wAssembly.add(mirrorBack);

  // 5. Quartz Halogen Capsule Bulb with Coiled Tungsten Filament
  const wBulbGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.038, 0.038, 0.12, 16),
    new THREE.MeshPhysicalMaterial({
      color: 0xfffae0,
      opacity: 0.35,
      transparent: true,
      roughness: 0.05,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 2.2,
    })
  );
  wBulbGlass.rotation.z = Math.PI / 2;
  wBulbGlass.position.set(0.06, 0, 0);
  wAssembly.add(wBulbGlass);

  // Coiled Tungsten Filament (glowing core)
  const wBulb = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.06, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff3b0 })
  );
  wBulb.rotation.z = Math.PI / 2;
  wBulb.position.set(0.06, 0, 0);
  wAssembly.add(wBulb);
  animTargets.tungstenLampGlow = wBulb;

  // 6. Front Optical Exit Snout & Condenser Lens Cell
  const exitSnout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 0.08, 20),
    MAT_ALUM_ANODIZED
  );
  exitSnout.rotation.z = Math.PI / 2;
  exitSnout.position.set(0.18, 0, 0);
  wAssembly.add(exitSnout);

  // Schott KG3 heat-absorbing optical glass filter
  const wFilter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.012, 20),
    MAT_OPTICAL_GLASS
  );
  wFilter.rotation.z = Math.PI / 2;
  wFilter.position.set(0.17, 0, 0);
  wAssembly.add(wFilter);

  // Precision Plano-Convex Quartz Condenser Lens
  const wCondenserLens = new THREE.Mesh(
    new THREE.SphereGeometry(0.058, 20, 16, 0, Math.PI * 2, 0, Math.PI / 3),
    MAT_OPTICAL_GLASS
  );
  wCondenserLens.rotation.z = -Math.PI / 2;
  wCondenserLens.position.set(0.21, 0, 0);
  wAssembly.add(wCondenserLens);

  wAssembly.userData = {
    name: 'Assembly_TungstenLampHouse',
    title: 'Tungsten-Halogen Visible/NIR Lamp (WI)',
    action: 'Tungsten-Halogen Lamp: 340 – 1100 nm Continuous Source, 12V 20W, Steatite G4 Socket, Internal Parabolic Collector',
  };
  interactiveObjects.push(wAssembly, wLampHousing, wBulb);

  // C. Source Selection Rotary Mirror & Stepper Motor
  const sourceSelectorGroup = new THREE.Group();
  sourceSelectorGroup.position.set(-1.08, BASE_Y + 0.65, 1.00);
  opticsGroup.add(sourceSelectorGroup);

  // Solid CNC-machined aluminum mounting pedestal anchored down to optical breadboard
  // Clamping flange rests solidly on breadboard datum Y = BASE_Y + 0.19 (local Y = -0.46)
  const selPedestalFlange = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.03, 20),
    MAT_ALUM_BREADBOARD
  );
  selPedestalFlange.position.y = -0.445;
  sourceSelectorGroup.add(selPedestalFlange);

  // 4x DIN 912 M4 socket cap screws with washers bolting pedestal firmly into tapped holes on breadboard
  for (let bi = 0; bi < 4; bi++) {
    const bAngle = (bi * Math.PI) / 2 + Math.PI / 4;
    const bWasher = createWasher(0.014, 0.030, 0.005, { material: MAT_CHROME });
    bWasher.position.set(Math.cos(bAngle) * 0.14, -0.430 + 0.0025, Math.sin(bAngle) * 0.14);
    sourceSelectorGroup.add(bWasher);

    const bScrew = createHexSocketScrew(0.012, 0.030, { material: MAT_CHROME });
    bScrew.position.set(Math.cos(bAngle) * 0.14, -0.430 + 0.005, Math.sin(bAngle) * 0.14);
    sourceSelectorGroup.add(bScrew);
  }

  // Heavy-duty turned aluminum pedestal riser column
  const selPedestalRiser = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 0.24, 20),
    MAT_ALUM_ANODIZED
  );
  selPedestalRiser.position.y = -0.31;
  sourceSelectorGroup.add(selPedestalRiser);

  // NEMA 14 Precision Microstepping Motor with black stator and aluminum endbells
  const selMotor = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.14, 0.18),
    MAT_CHASSIS_DARK
  );
  selMotor.position.y = -0.12;
  sourceSelectorGroup.add(selMotor);

  // Motor faceplate & stainless drive shaft
  const selMotorCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.015, 16),
    MAT_ALUM_ANODIZED
  );
  selMotorCap.position.y = -0.045;
  sourceSelectorGroup.add(selMotorCap);

  const selShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.016, 0.016, 0.08, 16),
    MAT_CHROME
  );
  selShaft.position.y = 0.00;
  sourceSelectorGroup.add(selShaft);

  // Mating 4-Pin JST-XH Stepper Header mounted on motor frame (mates with plugSelectorMotor)
  const hdrSelMotor = createJSTHeader(4);
  hdrSelMotor.name = 'Header_Motor_Selector';
  hdrSelMotor.position.set(0, -0.30, -0.06);
  sourceSelectorGroup.add(hdrSelMotor);

  const sourceSelectorArm = new THREE.Group();
  sourceSelectorGroup.add(sourceSelectorArm);
  animTargets.sourceSelectorArm = sourceSelectorArm;

  // Kinematic mirror cell on arm
  const selCell = new THREE.Mesh(
    new THREE.BoxGeometry(0.018, 0.16, 0.16),
    MAT_ALUM_ANODIZED
  );
  selCell.rotation.y = Math.PI / 4;
  sourceSelectorArm.add(selCell);

  // Fine-pitch brass kinematic adjustment thumb screws
  for (const ty of [-0.05, 0.05]) {
    const thumb = new THREE.Mesh(
      new THREE.CylinderGeometry(0.010, 0.010, 0.022, 12),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.85 })
    );
    thumb.rotation.z = Math.PI / 2;
    thumb.position.set(-0.012, ty, 0);
    sourceSelectorArm.add(thumb);
  }

  // Fused silica substrate backing
  const selSubstrate = new THREE.Mesh(
    new THREE.BoxGeometry(0.008, 0.136, 0.136),
    MAT_OPTICAL_GLASS
  );
  selSubstrate.rotation.y = Math.PI / 4;
  selSubstrate.position.set(0.006 * Math.sin(Math.PI / 4), 0, -0.006 * Math.cos(Math.PI / 4));
  sourceSelectorArm.add(selSubstrate);

  // Enhanced aluminum first-surface mirror face
  const selMirror = new THREE.Mesh(
    new THREE.PlaneGeometry(0.132, 0.132),
    MAT_OPTICAL_MIRROR
  );
  selMirror.rotation.y = Math.PI / 4;
  selMirror.position.set(0.012 * Math.sin(Math.PI / 4), 0, -0.012 * Math.cos(Math.PI / 4));
  sourceSelectorArm.add(selMirror);

  sourceSelectorGroup.name = 'Assembly_SourceSelector';
  sourceSelectorGroup.userData = {
    name: 'Assembly_SourceSelector',
    title: 'Source Selection Flip Mirror',
    action: 'Automated Flip Mirror: Stepper-actuated first-surface mirror switching between D2 (UV) and Tungsten (Vis) at 340 nm',
  };
  selMirror.userData = sourceSelectorGroup.userData;
  interactiveObjects.push(sourceSelectorGroup, selMirror);

  // D. Czerny-Turner Monochromator Optical Subsystem
  const monoBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.40, 0.12, 1.65),
    MAT_CHASSIS_DARK
  );
  monoBase.position.set(-0.25, BASE_Y + 0.32, 1.05);
  opticsGroup.add(monoBase);

  // NEMA 17 Stepper Motor driving diffraction grating sine-bar
  const monoStepper = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.14, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5, metalness: 0.7 })
  );
  monoStepper.name = 'Motor_GratingSineBar';
  monoStepper.position.set(-0.25, BASE_Y + 0.28, 1.05);
  monoStepper.userData = {
    name: 'Motor_GratingSineBar',
    title: 'Monochromator NEMA 17 Stepper Motor',
    action: 'Sine-Bar Stepper: High-resolution bipolar hybrid motor driving precision lead screw for 0.1 nm wavelength indexing',
  };
  opticsGroup.add(monoStepper);
  interactiveObjects.push(monoStepper);

  // Precision ground lead screw for sine-bar mechanism
  const monoLeadScrew = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.22, 16),
    MAT_CHROME
  );
  monoLeadScrew.position.set(-0.25, BASE_Y + 0.44, 1.05);
  opticsGroup.add(monoLeadScrew);

  // 4-Pin JST Stepper Header on grating drive motor (mates with plugGratingMotor)
  const hdrGratingMotor = createJSTHeader(4);
  hdrGratingMotor.name = 'Header_Motor_Grating';
  hdrGratingMotor.position.set(-0.25, BASE_Y + 0.28, 1.05);
  opticsGroup.add(hdrGratingMotor);

  // Helper: Precision 1-inch Optical Post, Post Holder with Thumbscrew, and Clamping Fork
  // Bolted directly to optical breadboard datum or monochromator base (Rule 1: Exhaustive physical geometry)
  function createOpticalPostAssembly(mountHeight = 0.27) {
    const postGroup = new THREE.Group();
    // 1. Heavy stainless steel 1-inch (25mm) optical mounting post
    const postMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, mountHeight, 20),
      MAT_CHROME
    );
    postMesh.position.y = -mountHeight / 2;
    postMesh.castShadow = true;
    postGroup.add(postMesh);

    // 2. Anodized aluminum post holder collar (Thorlabs PH-series style)
    const holderH = mountHeight * 0.72;
    const holderMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, holderH, 20),
      MAT_ALUM_ANODIZED
    );
    holderMesh.position.y = -mountHeight + holderH / 2;
    holderMesh.castShadow = true;
    postGroup.add(holderMesh);

    // Brass knurled spring-loaded thumbscrew on post holder
    const thumbScrew = new THREE.Mesh(
      new THREE.CylinderGeometry(0.010, 0.010, 0.028, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.9 })
    );
    thumbScrew.rotation.z = Math.PI / 2;
    thumbScrew.position.set(0.042, -mountHeight + holderH * 0.75, 0);
    postGroup.add(thumbScrew);

    // 3. CNC Aluminum Pedestal Clamping Fork anchored to breadboard/base
    const forkMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.018, 0.12),
      MAT_ALUM_ANODIZED
    );
    forkMesh.position.set(0, -mountHeight + 0.009, 0.035);
    postGroup.add(forkMesh);

    // DIN 912 M6 Hex Socket Cap Screw clamping fork to breadboard
    const m6Screw = createHexSocketScrew(0.016, 0.035, { material: MAT_CHROME });
    m6Screw.position.set(0, -mountHeight + 0.018, 0.065);
    postGroup.add(m6Screw);

    return postGroup;
  }

  // Entrance Slit with precision micrometer jaws
  // Aligned strictly collinear along the optical ray from Selector Mirror (-1.08, 1.00)
  // to Collimating Mirror (-0.646, 1.668) at t = 0.45: X = -0.885, Z = 1.300
  // Oriented normal to the incoming beam so rays pass 100% straight through aperture (Zero kink!)
  const enterSlitGroup = new THREE.Group();
  enterSlitGroup.name = 'Slit_MonochromatorEntrance';
  enterSlitGroup.position.set(-0.885, BASE_Y + 0.65, 1.300);
  enterSlitGroup.rotation.y = -Math.atan2(0.434, 0.668); // ~0.576 rad (33.0°)
  opticsGroup.add(enterSlitGroup);

  const enterSlitBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.18, 0.12),
    MAT_CHROME
  );
  enterSlitGroup.add(enterSlitBody);

  // Precision bilateral knife-edge slit jaws (1.0 nm spectral bandwidth)
  for (const jx of [-0.012, 0.012]) {
    const jaw = new THREE.Mesh(
      new THREE.BoxGeometry(0.008, 0.12, 0.04),
      MAT_CHASSIS_DARK
    );
    jaw.position.set(jx, 0, 0);
    enterSlitGroup.add(jaw);
  }

  // Top micrometer adjustment drum with calibrated knurling
  const micrometerDrum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.016, 0.016, 0.06, 16),
    MAT_CHROME
  );
  micrometerDrum.position.set(0, 0.12, 0);
  enterSlitGroup.add(micrometerDrum);

  // Rigid mounting post connecting slit down to monochromator base
  const enterSlitPost = createOpticalPostAssembly(0.27);
  enterSlitGroup.add(enterSlitPost);

  enterSlitGroup.userData = {
    name: 'Slit_MonochromatorEntrance',
    title: 'Czerny-Turner Entrance Slit (1.0 nm Bandwidth)',
    action: 'Entrance Slit: Precision micrometer bilateral knife-edge optical aperture defining monochromator resolution',
  };
  enterSlitBody.userData = enterSlitGroup.userData;
  interactiveObjects.push(enterSlitGroup, enterSlitBody);

  // Collimating Concave Spherical Mirror with 3-point kinematic gimbal mount & rigid pedestal post
  const colMirrorGroup = new THREE.Group();
  colMirrorGroup.name = 'Mirror_CollimatingConcave';
  colMirrorGroup.position.set(-0.65, BASE_Y + 0.65, 1.70);
  colMirrorGroup.rotation.y = Math.PI - 0.14; // Faces incoming beam from entrance slit & reflects to grating
  opticsGroup.add(colMirrorGroup);

  // Heavy gimbal backplate
  const colMount = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.04, 24),
    MAT_ALUM_ANODIZED
  );
  colMount.rotation.x = Math.PI / 2;
  colMirrorGroup.add(colMount);

  // 3 brass kinematic spring-loaded adjustment thumb screws at 120 deg
  for (let a = 0; a < 3; a++) {
    const ang = (a * 2 * Math.PI) / 3;
    const screw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.035, 12),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.85 })
    );
    screw.rotation.x = Math.PI / 2;
    screw.position.set(Math.cos(ang) * 0.11, Math.sin(ang) * 0.11, -0.03);
    colMirrorGroup.add(screw);
  }

  // Quartz glass mirror substrate with opaque protective aluminum cell cup
  const colSubstrate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.016, 24),
    MAT_ALUM_ANODIZED
  );
  colSubstrate.rotation.x = Math.PI / 2;
  colSubstrate.position.z = 0.024;
  colMirrorGroup.add(colSubstrate);

  // First-surface optical mirror coating
  const colMirror = new THREE.Mesh(
    new THREE.CircleGeometry(0.118, 32),
    MAT_OPTICAL_MIRROR
  );
  colMirror.position.z = 0.033;
  colMirrorGroup.add(colMirror);

  // High-specular polished chrome retaining bezel ring
  const colBezel = new THREE.Mesh(
    new THREE.TorusGeometry(0.118, 0.005, 12, 32),
    MAT_CHROME
  );
  colBezel.position.z = 0.033;
  colMirrorGroup.add(colBezel);

  // Rigid 1-inch Optical Post, Post Holder, and Clamping Fork anchored down to monoBase (datum top Y = BASE_Y + 0.38)
  const colPostAssembly = createOpticalPostAssembly(0.27);
  colMirrorGroup.add(colPostAssembly);

  colMirrorGroup.userData = {
    name: colMirrorGroup.name,
    title: 'Collimating Concave Spherical Mirror',
    action: 'Collimator Mirror (f = 200 mm): Converts diverging entrance slit beam into parallel wavefront across grating',
  };
  colMirror.userData = colMirrorGroup.userData;
  interactiveObjects.push(colMirrorGroup, colMirror);

  // Holographic Blazed Planar Diffraction Grating (1200 lines/mm)
  const gratingGroup = new THREE.Group();
  gratingGroup.name = 'Grating_HolographicDiffraction';
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

  gratingGroup.userData = {
    name: gratingGroup.name,
    title: 'LO-RAY-LIGH Holographic Grating (1200 lines/mm)',
    action: 'Diffraction Grating: Disperses collimated light into rainbow spectrum (sin α + sin β = m·λ·N) via sine-bar motor',
  };
  gratingTile.userData = gratingGroup.userData;
  interactiveObjects.push(gratingGroup, gratingTile);

  // Focusing Concave Spherical Mirror with 3-point kinematic gimbal mount & rigid pedestal post
  const focMirrorGroup = new THREE.Group();
  focMirrorGroup.name = 'Mirror_FocusingConcave';
  focMirrorGroup.position.set(0.15, BASE_Y + 0.65, 1.70);
  focMirrorGroup.rotation.y = Math.PI - 0.29; // Faces incoming dispersed fan from grating & focuses onto exit slit
  opticsGroup.add(focMirrorGroup);

  const focMount = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.04, 24),
    MAT_ALUM_ANODIZED
  );
  focMount.rotation.x = Math.PI / 2;
  focMirrorGroup.add(focMount);

  // 3 brass kinematic thumb screws
  for (let a = 0; a < 3; a++) {
    const ang = (a * 2 * Math.PI) / 3;
    const screw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.035, 12),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.85 })
    );
    screw.rotation.x = Math.PI / 2;
    screw.position.set(Math.cos(ang) * 0.11, Math.sin(ang) * 0.11, -0.03);
    focMirrorGroup.add(screw);
  }

  const focSubstrate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.016, 24),
    MAT_ALUM_ANODIZED
  );
  focSubstrate.rotation.x = Math.PI / 2;
  focSubstrate.position.z = 0.024;
  focMirrorGroup.add(focSubstrate);

  const focMirror = new THREE.Mesh(
    new THREE.CircleGeometry(0.118, 32),
    MAT_OPTICAL_MIRROR
  );
  focMirror.position.z = 0.033;
  focMirrorGroup.add(focMirror);

  // High-specular polished chrome retaining bezel ring
  const focBezel = new THREE.Mesh(
    new THREE.TorusGeometry(0.118, 0.005, 12, 32),
    MAT_CHROME
  );
  focBezel.position.z = 0.033;
  focMirrorGroup.add(focBezel);

  // Rigid 1-inch Optical Post, Post Holder, and Clamping Fork anchored down to monoBase (datum top Y = BASE_Y + 0.38)
  const focPostAssembly = createOpticalPostAssembly(0.27);
  focMirrorGroup.add(focPostAssembly);

  focMirrorGroup.userData = {
    name: focMirrorGroup.name,
    title: 'Focusing Concave Spherical Mirror',
    action: 'Focusing Mirror: Concentrates dispersed spectral rainbow fan across the exit slit aperture plane',
  };
  focMirror.userData = focMirrorGroup.userData;
  interactiveObjects.push(focMirrorGroup, focMirror);

  // Exit Slit Assembly
  const exitSlit = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.18, 0.12),
    MAT_CHROME
  );
  exitSlit.name = 'Slit_MonochromatorExit';
  exitSlit.position.set(0.18, BASE_Y + 0.65, 1.05);
  exitSlit.userData = {
    name: exitSlit.name,
    title: 'Czerny-Turner Exit Slit (1.0 nm Bandwidth)',
    action: 'Exit Slit: Transmits pure monochromatic wavelength band (λ ± 0.5 nm) to sample compartment',
  };
  opticsGroup.add(exitSlit);
  interactiveObjects.push(exitSlit);

  // Motorized Order-Sorting Filter Wheel (6 optical filters)
  const filterWheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.20, 0.20, 0.02, 24),
    MAT_ALUM_ANODIZED
  );
  filterWheel.name = 'Wheel_OrderSortingFilters';
  filterWheel.rotation.x = Math.PI / 2;
  filterWheel.position.set(0.18, BASE_Y + 0.65, 0.90);
  filterWheel.userData = {
    name: filterWheel.name,
    title: 'Motorized Order-Sorting Filter Wheel',
    action: 'Order-Sorting Wheel: 6-position optical filter carousel blocking second-order diffraction harmonics (λ/2)',
  };
  opticsGroup.add(filterWheel);
  interactiveObjects.push(filterWheel);

  // E. Dual-Beam Rotating Sector Chopper Subsystem (Assembly_OpticalChopper)
  // Kinematically decoupled: Motor shaft axis lowered to BASE_Y + 0.42 (0.60m world datum).
  // Sector wheel outer diameter R = 0.25m allows top blade quadrant to intercept optical beam at BASE_Y + 0.65 (r = 0.23m).
  // Precision BLDC motor body mounted facing +Z (between filter wheel Z = 0.90 and chopper Z = 0.60),
  // leaving the entire -Z space completely open for fold mirrors M1 (Z = 0.48) and M3 (Z = 0.32).
  // Zero motor penetration, zero mirror collisions! (DIAG-001, DIAG-003, DIAG-020)
  const chopperAssembly = new THREE.Group();
  chopperAssembly.name = 'Assembly_OpticalChopper';
  chopperAssembly.position.set(0.18, BASE_Y + 0.42, 0.60);
  opticsGroup.add(chopperAssembly);

  // 1. Rigid CNC Aluminum Mounting Pedestal
  // Breadboard datum top is at BASE_Y + 0.16 (relative Y = -0.26)
  const pedestalBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.025, 0.18),
    MAT_ALUM_ANODIZED
  );
  pedestalBase.position.set(0, -0.248, 0.125);
  chopperAssembly.add(pedestalBase);

  // 2 DIN 912 M3 socket head cap screws with washers clamping pedestal to breadboard
  for (const bx of [-0.08, 0.08]) {
    const washer = createWasher(0.016, 0.034, 0.006, { material: MAT_CHROME });
    washer.position.set(bx, -0.2355 + 0.003, 0.125);
    const screw = createHexSocketScrew(0.014, 0.04, { material: MAT_CHROME });
    screw.position.set(bx, -0.2355 + 0.006, 0.125);
    chopperAssembly.add(washer);
    chopperAssembly.add(screw);
  }

  // Vertical structural column supporting motor cradle
  const pedestalColumn = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.22, 0.08),
    MAT_ALUM_ANODIZED
  );
  pedestalColumn.position.set(0, -0.125, 0.125);
  chopperAssembly.add(pedestalColumn);

  // Stiffening gussets
  const gussetL = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.16, 0.06),
    MAT_ALUM_ANODIZED
  );
  gussetL.position.set(-0.06, -0.15, 0.125);
  gussetL.rotation.x = -0.25;
  chopperAssembly.add(gussetL);

  const gussetR = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.16, 0.06),
    MAT_ALUM_ANODIZED
  );
  gussetR.position.set(0.06, -0.15, 0.125);
  gussetR.rotation.x = -0.25;
  chopperAssembly.add(gussetR);

  // Motor mounting face cradle plate (facing -Z towards chopper disc)
  const motorCradle = new THREE.Mesh(
    new THREE.BoxGeometry(0.20, 0.20, 0.025),
    MAT_ALUM_ANODIZED
  );
  motorCradle.position.set(0, 0, 0.04);
  chopperAssembly.add(motorCradle);

  // 4 M2.5 socket cap screws securing BLDC motor face to cradle
  for (let mi = 0; mi < 4; mi++) {
    const mAngle = (mi * Math.PI) / 2 + Math.PI / 4;
    const msX = Math.cos(mAngle) * 0.072;
    const msY = Math.sin(mAngle) * 0.072;
    const mScrew = createHexSocketScrew(0.010, 0.025, { material: MAT_CHROME });
    mScrew.rotation.x = -Math.PI / 2;
    mScrew.position.set(msX, msY, 0.028);
    chopperAssembly.add(mScrew);
  }

  // 2. Precision BLDC Motor Body (Mounted on +Z side in open air gap toward filter wheel)
  const chopperMotor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.072, 0.072, 0.15, 20),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.85 })
  );
  chopperMotor.rotation.x = Math.PI / 2;
  chopperMotor.position.set(0, 0, 0.125);
  chopperAssembly.add(chopperMotor);

  // Motor rear bearing cap
  const motorCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.046, 0.046, 0.02, 16),
    MAT_ALUM_ANODIZED
  );
  motorCap.rotation.x = Math.PI / 2;
  motorCap.position.set(0, 0, 0.210);
  chopperAssembly.add(motorCap);

  // Grounded stainless motor drive shaft extending forward along -Z through cradle to wheel hub
  const driveShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.08, 16),
    MAT_CHROME
  );
  driveShaft.rotation.x = Math.PI / 2;
  driveShaft.position.set(0, 0, 0.005);
  chopperAssembly.add(driveShaft);

  // 3. Rotating Rotor Assembly (Hub + Dual-Sector Chopper Wheel)
  const rotorGroup = new THREE.Group();
  rotorGroup.name = 'Rotor_OpticalChopper';
  chopperAssembly.add(rotorGroup);
  animTargets.chopperWheel = rotorGroup; // Animates rotation.z

  // CNC aluminum clamp hub
  const chopperHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.035, 20),
    MAT_ALUM_ANODIZED
  );
  chopperHub.rotation.x = Math.PI / 2;
  chopperHub.position.set(0, 0, 0.018);
  rotorGroup.add(chopperHub);

  // Radial set screws in hub
  for (let s = 0; s < 2; s++) {
    const sAngle = (s * Math.PI) / 2;
    const grub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.012, 8),
      MAT_CHROME
    );
    grub.position.set(Math.cos(sAngle) * 0.042, Math.sin(sAngle) * 0.042, 0.018);
    grub.rotation.z = sAngle + Math.PI / 2;
    rotorGroup.add(grub);
  }

  // Sector Wheel Carrier Center Disc
  const centerDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 0.008, 24),
    MAT_ALUM_ANODIZED
  );
  centerDisc.rotation.x = Math.PI / 2;
  centerDisc.position.set(0, 0, 0.038);
  rotorGroup.add(centerDisc);

  // 3 M2 blade retaining screws
  for (let bs = 0; bs < 3; bs++) {
    const bAngle = (bs * 2 * Math.PI) / 3;
    const bScrew = createHexSocketScrew(0.008, 0.015, { material: MAT_CHROME });
    bScrew.rotation.x = Math.PI / 2;
    bScrew.position.set(Math.cos(bAngle) * 0.060, Math.sin(bAngle) * 0.060, 0.043);
    rotorGroup.add(bScrew);
  }

  // True Physical Dual-Sector Blades:
  // Sector 1: [0, PI/2] (90 deg) First-surface coated optical mirror blade
  // Sector 2: [PI/2, PI] (90 deg) OPEN TRANSMISSION APERTURE
  // Sector 3: [PI, 3*PI/2] (90 deg) First-surface coated optical mirror blade
  // Sector 4: [3*PI/2, 2*PI] (90 deg) OPEN TRANSMISSION APERTURE
  const bladeGeometry = new THREE.RingGeometry(0.070, 0.25, 32, 1, 0, Math.PI / 2);

  // Blade 1 (Mirror sector at 0 to PI/2)
  const sectorBlade1 = new THREE.Mesh(bladeGeometry, MAT_OPTICAL_MIRROR);
  sectorBlade1.position.set(0, 0, 0.040);
  rotorGroup.add(sectorBlade1);

  // Blade 1 substrate backing
  const sectorBacking1 = new THREE.Mesh(bladeGeometry, MAT_OPTICAL_GLASS);
  sectorBacking1.position.set(0, 0, 0.036);
  rotorGroup.add(sectorBacking1);

  // Blade 2 (Mirror sector at PI to 3*PI/2)
  const sectorBlade2 = new THREE.Mesh(bladeGeometry, MAT_OPTICAL_MIRROR);
  sectorBlade2.rotation.z = Math.PI;
  sectorBlade2.position.set(0, 0, 0.040);
  rotorGroup.add(sectorBlade2);

  // Blade 2 substrate backing
  const sectorBacking2 = new THREE.Mesh(bladeGeometry, MAT_OPTICAL_GLASS);
  sectorBacking2.rotation.z = Math.PI;
  sectorBacking2.position.set(0, 0, 0.036);
  rotorGroup.add(sectorBacking2);

  // Outer protective edge ring
  const outerRing = new THREE.Mesh(
    new THREE.RingGeometry(0.244, 0.254, 48),
    MAT_ALUM_ANODIZED
  );
  outerRing.position.set(0, 0, 0.041);
  rotorGroup.add(outerRing);

  // 4. Optoelectronic Photo-Interrupter Sensor
  const optoBracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 0.06, 0.08),
    MAT_ALUM_ANODIZED
  );
  optoBracket.position.set(0, 0.25, -0.01);
  chopperAssembly.add(optoBracket);

  const optoBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.024, 0.032, 0.045),
    MAT_CHASSIS_DARK
  );
  optoBody.position.set(0, 0.25, 0.040);
  chopperAssembly.add(optoBody);

  chopperAssembly.userData = {
    name: 'Assembly_OpticalChopper',
    title: 'Dual-Beam Rotating Sector Chopper',
    action: 'Optical Chopper: High-speed BLDC motor rotating 4-quadrant sector wheel (alternating mirror reflection & open transmission)',
  };
  sectorBlade1.userData = {
    name: 'Blade_ChopperMirror_1',
    title: 'Chopper First-Surface Mirror Blade',
    action: 'Chopper Mirror Sector: Diverts monochromatic beam into reference channel (I₀) for real-time drift cancellation',
  };
  sectorBlade2.userData = sectorBlade1.userData;
  interactiveObjects.push(chopperAssembly, sectorBlade1, sectorBlade2, outerRing);

  // F. Dual Beam Fold Mirrors & Reference Channel
  function createKinematicFoldMirror(x, y, z, rotY, name, glintColor = 0x38bdf8) {
    const g = new THREE.Group();
    g.name = name;
    g.position.set(x, y, z);
    g.rotation.y = rotY;

    // Base clamping post anchored to breadboard
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.38, 16),
      MAT_ALUM_ANODIZED
    );
    post.position.set(0, -0.19, 0);
    g.add(post);

    // Breadboard clamping collar with M4 socket cap screw
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.045, 16),
      MAT_ALUM_ANODIZED
    );
    collar.position.set(0, -0.34, 0);
    g.add(collar);

    const collarScrew = createHexSocketScrew(0.012, 0.025, { material: MAT_CHROME });
    collarScrew.position.set(0.032, -0.34, 0);
    collarScrew.rotation.z = Math.PI / 2;
    g.add(collarScrew);

    // Gimbal backplate
    const backplate = new THREE.Mesh(
      new THREE.BoxGeometry(0.016, 0.16, 0.16),
      MAT_ALUM_ANODIZED
    );
    backplate.position.set(-0.012, 0, 0);
    g.add(backplate);

    // Brass kinematic adjustment thumb screws with tension springs
    for (const oy of [-0.048, 0.048]) {
      const thumb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.010, 0.010, 0.025, 12),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.9 })
      );
      thumb.rotation.z = Math.PI / 2;
      thumb.position.set(-0.028, oy, 0);
      g.add(thumb);

      const spring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.007, 0.015, 8),
        MAT_CHROME
      );
      spring.rotation.z = Math.PI / 2;
      spring.position.set(-0.018, oy, 0);
      g.add(spring);
    }

    // Fused silica quartz mirror cell substrate with precision beveled perimeter
    const glassSub = new THREE.Mesh(
      new THREE.BoxGeometry(0.010, 0.144, 0.144),
      MAT_ALUM_ANODIZED
    );
    glassSub.position.set(-0.004, 0, 0);
    g.add(glassSub);

    // High-specular first-surface optical mirror coating
    const mirrPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.140, 0.140),
      MAT_OPTICAL_MIRROR
    );
    mirrPlane.rotation.y = Math.PI / 2;
    mirrPlane.position.set(0.002, 0, 0);
    g.add(mirrPlane);

    // 4 Stainless corner retention clips clamping mirror to backplate
    for (const cy of [-0.068, 0.068]) {
      for (const cz of [-0.068, 0.068]) {
        const clip = new THREE.Mesh(
          new THREE.BoxGeometry(0.012, 0.012, 0.012),
          MAT_CHROME
        );
        clip.position.set(0.001, cy, cz);
        g.add(clip);
      }
    }

    // Specular Laser Collision Glint Spot on mirror surface
    const glint = new THREE.Mesh(
      new THREE.CircleGeometry(0.016, 16),
      new THREE.MeshBasicMaterial({
        color: glintColor,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      })
    );
    glint.rotation.y = Math.PI / 2;
    glint.position.set(0.003, 0, 0);
    g.add(glint);
    animTargets.opticalRayMats.push(glint.material);

    const cleanTitle = name.replace('Mirror_', '').replace(/_/g, ' ');
    g.userData = {
      name,
      title: `Optical Mirror: ${cleanTitle}`,
      action: `Kinematic 1st-Surface Mirror (${cleanTitle}): Enhanced aluminum coating on fused silica substrate, R > 99.2%`,
    };
    mirrPlane.userData = g.userData;
    interactiveObjects.push(g, mirrPlane);

    opticsGroup.add(g);
    return g;
  }

  // Reference Channel Fold Mirrors M1 & M2 (Strictly coplanar at BASE_Y + 0.65 on breadboard in Optics Bay, Z = 0.48)
  const refMirror1 = createKinematicFoldMirror(0.18, BASE_Y + 0.65, 0.48, Math.PI / 4, 'Mirror_DualBeamFold_1', 0x38bdf8);
  const refMirror2 = createKinematicFoldMirror(0.55, BASE_Y + 0.65, 0.48, -Math.PI / 4, 'Mirror_DualBeamFold_2', 0x38bdf8);

  // Sample Channel Kinematic Fold Mirrors M3 & M4 (Coplanar at BASE_Y + 0.65 on breadboard in Optics Bay, Z = 0.32)
  // Generous 160mm center-to-center spacing prevents any contact between M1 and M3 kinematic gimbals!
  const sampleFoldMirrorM3 = createKinematicFoldMirror(0.18, BASE_Y + 0.65, 0.32, Math.PI / 4, 'Mirror_SampleBeamFold_M3', 0x00ffff);
  const sampleFoldMirrorM4 = createKinematicFoldMirror(1.59, BASE_Y + 0.65, 0.32, -Math.PI / 4, 'Mirror_SampleBeamFold_M4', 0x00ffff);

  // Reference cell holder & quartz reference cuvette (Coplanar with reference beam at X = 0.55, Z = -1.18)
  const refCellHolder = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.30, 0.22),
    MAT_CHASSIS_DARK
  );
  refCellHolder.position.set(0.55, BASE_Y + 0.45, -1.18);
  refCellHolder.userData = {
    name: 'Holder_ReferenceCell',
    title: 'Reference Cuvette Holder',
    action: 'Reference Channel Cell Holder: Secures 10mm quartz cuvette for real-time solvent baseline comparison (I₀)',
  };
  opticsGroup.add(refCellHolder);
  interactiveObjects.push(refCellHolder);

  const refCuvette = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.48, 0.16),
    MAT_OPTICAL_GLASS
  );
  refCuvette.position.set(0.55, BASE_Y + 0.65, -1.18);
  refCuvette.userData = {
    name: 'Glass_ReferenceCuvette',
    title: 'Quartz Reference Cuvette',
    action: 'Reference Cuvette: Synthetic fused silica quartz cell (10 mm pathlength) containing pure solvent blank',
  };
  opticsGroup.add(refCuvette);
  interactiveObjects.push(refCuvette);

  // Reference liquid column inside reference cuvette (DI water solvent blank)
  const refLiquid = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.38, 0.14),
    new THREE.MeshPhysicalMaterial({ color: 0xf1f5f9, opacity: 0.35, transparent: true, roughness: 0.05 })
  );
  refLiquid.position.set(0.55, BASE_Y + 0.62, -1.18);
  opticsGroup.add(refLiquid);

  // G. Dual Silicon Photodiode Detector Bays & Rigid Bulkhead Flanges (Rule 1: Exhaustive Physical Assembly)
  // Replaces bare floating cylinders with authentic CNC aluminum bulkhead mounting flanges,
  // 4x DIN 912 M2.5 retention screws, active silicon PIN photodiode sensor dies, and sealed pigtail boots.
  function createPhotodiodeDetector(x, y, z, name, title, action) {
    const detGroup = new THREE.Group();
    detGroup.name = name;
    detGroup.position.set(x, y, z);

    // 1. CNC Aluminum Bulkhead Mounting Flange seated against front chamber wall
    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(0.088, 0.088, 0.024, 24),
      MAT_ALUM_ANODIZED
    );
    flange.rotation.x = Math.PI / 2;
    flange.position.z = -0.06;
    detGroup.add(flange);

    // 4 DIN 912 M2.5 socket head cap screws bolting flange to front bulkhead
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2 + Math.PI / 4;
      const sx = Math.cos(ang) * 0.068;
      const sy = Math.sin(ang) * 0.068;
      const screw = createHexSocketScrew(0.009, 0.024, { material: MAT_CHROME });
      screw.rotation.x = -Math.PI / 2;
      screw.position.set(sx, sy, -0.07);
      detGroup.add(screw);
    }

    // 2. Anodized aluminum cylindrical detector barrel housing
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.062, 0.062, 0.12, 24),
      MAT_ALUM_ANODIZED
    );
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = 0.0;
    detGroup.add(barrel);

    // 3. Precision Optical Aperture Bezel Ring
    const frontBezel = new THREE.Mesh(
      new THREE.TorusGeometry(0.058, 0.005, 8, 24),
      MAT_CHROME
    );
    frontBezel.position.z = 0.06;
    detGroup.add(frontBezel);

    // 4. Active Silicon PIN Photodiode Sensor Chip (Recessed at z = 0.052)
    // Dark photosensitive silicon die with anti-reflective optical glass window
    const sensorDie = new THREE.Mesh(
      new THREE.BoxGeometry(0.038, 0.038, 0.006),
      new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        roughness: 0.12,
        metalness: 0.85,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      })
    );
    sensorDie.position.z = 0.052;
    detGroup.add(sensorDie);

    // Gold active chip bonding wires
    for (const bx of [-0.015, 0.015]) {
      const wireBond = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0015, 0.0015, 0.015, 6),
        MAT_GOLD_PIN
      );
      wireBond.position.set(bx, 0.022, 0.054);
      detGroup.add(wireBond);
    }

    // Specular Laser Collision Glint Spot on detector window
    const detGlint = new THREE.Mesh(
      new THREE.CircleGeometry(0.015, 16),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.95, side: THREE.DoubleSide })
    );
    detGlint.position.z = 0.056;
    detGroup.add(detGlint);
    animTargets.opticalRayMats.push(detGlint.material);

    // 5. Shielded signal pigtail lead with molded strain-relief boot exiting to pre-amp
    const boot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.018, 0.04, 12),
      MAT_CHASSIS_DARK
    );
    boot.rotation.x = Math.PI / 2;
    boot.position.z = -0.09;
    detGroup.add(boot);

    detGroup.userData = { name, title, action };
    barrel.userData = detGroup.userData;
    interactiveObjects.push(detGroup, barrel);
    opticsGroup.add(detGroup);
    return detGroup;
  }

  // Reference Channel Silicon PIN Photodiode Detector (Coplanar at BASE_Y + 0.65, Z = -2.12)
  const refDetector = createPhotodiodeDetector(
    0.55, BASE_Y + 0.65, -2.12,
    'Detector_ReferencePhotodiode',
    'Reference Silicon Photodiode Detector',
    'Reference Photodiode (I₀ Channel): Low-noise silicon PIN detector monitoring incident source beam intensity'
  );

  // Sample Channel Silicon PIN Photodiode Detector (Coplanar at BASE_Y + 0.65, Z = -2.12)
  const sampleDetector = createPhotodiodeDetector(
    1.59, BASE_Y + 0.65, -2.12,
    'Detector_SamplePhotodiode',
    'Sample Silicon Photodiode Detector',
    'Sample Photodiode (I Channel): Ultra-low-noise PIN detector measuring transmitted light through active sample cuvette'
  );

  // Low-Noise Preamplifier Analog PCB Assembly (Rigidly mounted on front chamber wall cavity)
  // Heavy CNC aluminum mounting bracket, 4x brass hexagonal standoffs, ground strap, and Mu-metal shield can
  const preAmpGroup = new THREE.Group();
  preAmpGroup.name = 'Assembly_DetectorPreAmp';
  preAmpGroup.position.set(1.80, BASE_Y + 0.65, -2.05);
  opticsGroup.add(preAmpGroup);

  // 1. CNC Aluminum Bulkhead Mounting Bracket & Standoff Frame
  const preAmpBracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.36, 0.42),
    MAT_ALUM_ANODIZED
  );
  preAmpBracket.position.set(0.02, 0, -0.03);
  preAmpGroup.add(preAmpBracket);

  // 4 Hexagonal Brass Standoffs (M2.5 x 12mm) holding PCB off bracket
  for (const sy of [-0.14, 0.14]) {
    for (const sz of [-0.16, 0.16]) {
      const standoff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.025, 6),
        MAT_BRASS_FITTING
      );
      standoff.rotation.z = Math.PI / 2;
      standoff.position.set(0.012, sy, sz);
      preAmpGroup.add(standoff);

      const standoffScrew = createHexSocketScrew(0.008, 0.015, { material: MAT_CHROME });
      standoffScrew.rotation.z = -Math.PI / 2;
      standoffScrew.position.set(-0.008, sy, sz);
      preAmpGroup.add(standoffScrew);
    }
  }

  // 2. Multi-layer FR-4 Green PCB board with analog ground plane
  const preAmpPCB = new THREE.Mesh(
    new THREE.BoxGeometry(0.014, 0.32, 0.38),
    MAT_PCB_GREEN
  );
  preAmpPCB.name = 'PCB_DetectorPreAmp';
  preAmpGroup.add(preAmpPCB);

  // 3. Female Gold SMA Bulkhead Receptacle mounted on top edge
  const preAmpSMA = createSMAJackFemale();
  preAmpSMA.name = 'Socket_PreAmp_SMA';
  preAmpSMA.position.set(0, 0.17, 0);
  preAmpSMA.rotation.y = Math.PI / 2;
  preAmpGroup.add(preAmpSMA);

  // 4. Mu-Metal Magnetic Shield Enclosure (enclosing analog transimpedance amplifier)
  const shieldCan = new THREE.Mesh(
    new THREE.BoxGeometry(0.024, 0.22, 0.28),
    MAT_CHROME
  );
  shieldCan.name = 'Shield_MuMetal_Detector';
  shieldCan.position.set(0.016, -0.02, 0);
  preAmpGroup.add(shieldCan);

  // 5. Braided copper chassis ground bonding strap
  const gndStrap = new THREE.Mesh(
    new THREE.BoxGeometry(0.004, 0.22, 0.018),
    MAT_BRASS_FITTING
  );
  gndStrap.position.set(0.018, -0.18, 0.16);
  preAmpGroup.add(gndStrap);

  preAmpGroup.userData = {
    name: 'PCB_DetectorPreAmp',
    title: 'Low-Noise Pre-Amplifier Subsystem',
    action: 'Photodiode Pre-Amplifier: Ultra-low-noise transimpedance amplifier converting picoampere photocurrents into microvolts',
  };
  preAmpPCB.userData = preAmpGroup.userData;
  shieldCan.userData = {
    name: 'Shield_MuMetal_Detector',
    title: 'Mu-Metal Magnetic Shield Enclosure',
    action: 'Mu-Metal Shielding: Prevents electromagnetic interference (EMI) from motor steppers reaching sensitive photodiode pre-amp',
  };
  interactiveObjects.push(preAmpGroup, preAmpPCB, shieldCan);

  // =========================================================================
  // =========================================================================
  // H. Electronics & Switch-Mode Power Supply (Assembly_SMPS_PowerSupply)
  // Industrial enclosed switching power supply providing regulated +24V, +12V, +5V DC
  // Positioned in mid-left electronics bay: X = -1.10, BASE_Y + 0.16, Z = -0.55
  // Generous 42cm clear air gap to Motherboard! Zero overlap, zero crowding!
  // =========================================================================
  const smpsGroup = new THREE.Group();
  smpsGroup.name = 'Assembly_SMPS_PowerSupply';
  smpsGroup.position.set(-1.10, BASE_Y + 0.16, -0.55);
  opticsGroup.add(smpsGroup);

  // Perforated aluminum chassis frame / U-channel protective enclosure
  const smpsChassis = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.24, 0.60),
    MAT_ALUM_ANODIZED
  );
  smpsChassis.position.set(0, 0.12, 0);
  smpsChassis.castShadow = true;
  smpsChassis.userData = {
    name: 'Assembly_SMPS_PowerSupply',
    title: 'Switch-Mode Power Supply (SMPS)',
    action: 'Industrial Power Supply: Delivers regulated +24V, +12V, +5V, -12V DC power to motherboard, lamps & steppers',
  };
  smpsGroup.add(smpsChassis);
  interactiveObjects.push(smpsChassis);

  // Perforated mesh ventilation cover on top
  const smpsVent = new THREE.Mesh(
    new THREE.BoxGeometry(0.80, 0.005, 0.48),
    MAT_CHASSIS_DARK
  );
  smpsVent.position.set(0, 0.243, 0);
  smpsGroup.add(smpsVent);

  // 4 corner mounting feet with M3 screws bolting SMPS securely to baseplate
  for (const sx of [-0.42, 0.42]) {
    for (const sz of [-0.25, 0.25]) {
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.06), MAT_ALUM_ANODIZED);
      foot.position.set(sx, 0.008, sz);
      smpsGroup.add(foot);

      const screw = createHexSocketScrew(0.010, 0.020, { material: MAT_CHROME });
      screw.position.set(sx, 0.016, sz);
      smpsGroup.add(screw);
    }
  }

  // Toroidal transformer & high-voltage filter caps inside/visible through vent
  const smpsToroid = new THREE.Mesh(
    new THREE.TorusGeometry(0.10, 0.038, 12, 24),
    new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6, metalness: 0.5 })
  );
  smpsToroid.rotation.x = Math.PI / 2;
  smpsToroid.position.set(-0.20, 0.12, 0);
  smpsGroup.add(smpsToroid);

  for (let c = 0; c < 3; c++) {
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.16, 16),
      MAT_CHASSIS_DARK
    );
    cap.position.set(0.02 + (c * 0.11), 0.10, 0);
    smpsGroup.add(cap);
  }

  // Dedicated 50mm DC Brushless Cooling Fan on outer side face of SMPS chassis
  // Vents warm air directly OUTSIDE the machine through chassis side louvers!
  // Completely isolated from optical bench & sample testing area!
  const smpsFan = createSMPSFan();
  smpsFan.position.set(-0.46, 0.12, 0.0);
  smpsFan.rotation.y = -Math.PI / 2; // Faces -X towards outer side chassis wall
  const smpsFanHubRef = smpsFan.userData.fanHub;
  smpsFan.userData = {
    name: 'Fan_SMPS_Cooling',
    title: 'SMPS Dedicated Cooling Fan (50mm)',
    action: '50mm Brushless DC Cooling Fan: Forced convection cooling venting directly OUTSIDE via side louvers, isolated from optics & sample chamber',
  };
  smpsGroup.add(smpsFan);
  interactiveObjects.push(smpsFan);
  animTargets.smpsFanHub = smpsFanHubRef;

  // Flexible molded silicone exhaust duct boot sealing fan directly to exterior chassis wall
  // Spans from fan frame (x = -0.46) across to outer chassis side wall at X = -2.18 (x = -1.08)
  const smpsDuct = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.18, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.85, metalness: 0.1 })
  );
  smpsDuct.position.set(-0.77, 0.12, 0.0);
  smpsGroup.add(smpsDuct);

  // Stamped exterior chassis exhaust louvers on side wall at X = -2.18 (Z = -0.55)
  // Directs warm SMPS exhaust safely outside the instrument
  for (let sl = 0; sl < 5; sl++) {
    const sideLouver = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.016, 0.22),
      MAT_CHASSIS_DARK
    );
    sideLouver.position.set(-2.182, BASE_Y + 0.20 + (sl * 0.038), -0.55);
    sideLouver.rotation.z = -0.35; // Downward angled rain/dust baffle
    chassisGroup.add(sideLouver);
  }

  // 6-position phenolic barrier terminal block for AC Mains input and DC outputs
  // Mounted on front face of SMPS facing forward towards Motherboard
  // Terminal 1: AC Live, 2: AC Neutral, 3: Earth Ground, 4: +24V DC, 5: +12V DC, 6: DC GND
  const smpsBarrier = createBarrierTerminalBlock(6);
  smpsBarrier.name = 'TerminalBlock_SMPS_Mains';
  smpsBarrier.position.set(0.20, 0.22, -0.28);
  smpsBarrier.rotation.y = 0; // Terminals face forward towards -Z (Motherboard)
  smpsBarrier.userData = {
    name: 'TerminalBlock_SMPS_Mains',
    title: 'SMPS Barrier Terminal Block (6-Pos)',
    action: 'Barrier Terminal Strip: Clamps AC mains live/neutral/ground wires and distributes regulated DC power buses',
  };
  smpsGroup.add(smpsBarrier);
  interactiveObjects.push(smpsBarrier);

  // =========================================================================
  // H2. Main Digital Control Board & DSP Motherboard (Assembly_Motherboard_DSP)
  // Procedural multi-layer FR-4 board with real copper traces, length-matched buses,
  // 32-bit DSP processor with heatsink, eMMC flash, SDRAM, 24-bit ADC,
  // 4 modular stepper driver daughterboards, crystals, SMD passives, and mating headers
  // Positioned in spacious front-left bay (X = -1.10, BASE_Y + 0.18, Z = -1.65)
  // Directly beneath touchscreen console, behind front air intake louvers
  // =========================================================================
  const mbGroup = new THREE.Group();
  mbGroup.name = 'Assembly_Motherboard_DSP';
  mbGroup.position.set(-1.10, BASE_Y + 0.18, -1.65);
  opticsGroup.add(mbGroup);

  // Procedural FR-4 Canvas Texture with high-DPI copper bus traces & silkscreen
  const mbCanvas = createMotherboardCanvasTexture();
  const mbTex = new THREE.CanvasTexture(mbCanvas);
  mbTex.flipY = false;
  const MAT_PCB_CANVAS = new THREE.MeshStandardMaterial({
    map: mbTex,
    roughness: 0.35,
    metalness: 0.15,
  });

  // 6-layer FR-4 Substrate PCB Board (Spacious 0.80 x 0.80m format)
  const mbPCB = new THREE.Mesh(
    new THREE.BoxGeometry(0.80, 0.016, 0.80),
    MAT_PCB_GREEN
  );
  mbPCB.name = 'PCB_Motherboard_Substrate';
  mbPCB.receiveShadow = true;
  mbPCB.castShadow = true;
  mbGroup.add(mbPCB);

  // High-DPI Silk & Trace Top Surface Plane
  const mbSurfaceGeo = new THREE.PlaneGeometry(0.80, 0.80);
  const mbSurface = new THREE.Mesh(mbSurfaceGeo, MAT_PCB_CANVAS);
  mbSurface.rotation.x = -Math.PI / 2;
  mbSurface.position.y = 0.0085;
  mbSurface.name = 'PCB_Motherboard_TopSurface';
  mbSurface.receiveShadow = true;
  mbGroup.add(mbSurface);

  // 4 Corner Brass Standoff Pillars with M3 Hex Screws
  for (const sx of [-0.36, 0.36]) {
    for (const sz of [-0.36, 0.36]) {
      const standoff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 0.04, 6),
        MAT_BRASS_FITTING
      );
      standoff.position.set(sx, -0.02, sz);
      mbGroup.add(standoff);

      const mbScrew = createHexSocketScrew(0.012, 0.025, { material: MAT_CHROME });
      mbScrew.position.set(sx, 0.008, sz);
      mbGroup.add(mbScrew);
    }
  }

  // 1. Main 32-bit DSP Microprocessor (Where processing is done!)
  // Texas Instruments TMS320C6748 / ARM Cortex-M7: Performs real-time Beer-Lambert absorbance
  // calculation (A = -log10(I / I0)), baseline correction, and motor microstepping timing
  const dspChip = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.018, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.3, metalness: 0.4 })
  );
  dspChip.name = 'IC_DSP_Processor';
  dspChip.position.set(-0.06, 0.016, 0.04);
  dspChip.userData = {
    name: 'IC_DSP_Processor',
    role: 'Central Processing Unit',
    action: '32-bit DSP Microprocessor: Computes Beer-Lambert Absorbance (A = -log₁₀(I/I₀)), baseline correction & motor pulse timing',
  };
  mbGroup.add(dspChip);
  interactiveObjects.push(dspChip);

  // Black anodized micro finned aluminum heatsink on DSP processor
  const dspSinkBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.015, 0.16),
    MAT_ALUM_ANODIZED
  );
  dspSinkBase.position.set(-0.06, 0.032, 0.04);
  mbGroup.add(dspSinkBase);
  for (let h = -0.065; h <= 0.065; h += 0.022) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.030, 0.005),
      MAT_ALUM_ANODIZED
    );
    fin.position.set(-0.06, 0.052, 0.04 + h);
    mbGroup.add(fin);
  }

  // 2. Non-Volatile Flash Memory (eMMC / NOR Flash — Where permanent memory is saved!)
  // Stores instrument firmware, factory Deuterium/Holmium calibration tables,
  // user photometric methods, and 5000+ GLP-compliant spectrum scans
  const flashChip = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.014, 0.11),
    new THREE.MeshStandardMaterial({ color: 0x181e29, roughness: 0.35, metalness: 0.25 })
  );
  flashChip.name = 'IC_Flash_eMMC';
  flashChip.position.set(0.15, 0.015, 0.12);
  flashChip.userData = {
    name: 'IC_Flash_eMMC',
    role: 'Non-Volatile Storage',
    action: '8 GB eMMC Flash Memory: Permanently saves methods, baseline calibration curves, and GLP spectrum scans',
  };
  mbGroup.add(flashChip);
  interactiveObjects.push(flashChip);

  // 3. High-Speed SDRAM Memory Chip
  // High-bandwidth buffer memory for live spectral acquisition arrays and display frame buffers
  const sdramChip = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.014, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x181e29, roughness: 0.35, metalness: 0.25 })
  );
  sdramChip.name = 'IC_RAM_SDRAM';
  sdramChip.position.set(0.15, 0.015, -0.04);
  sdramChip.userData = {
    name: 'IC_RAM_SDRAM',
    role: 'Volatile System RAM',
    action: '512 MB High-Speed SDRAM: Active spectral buffer acquisition & live 7-inch display frame buffer',
  };
  mbGroup.add(sdramChip);
  interactiveObjects.push(sdramChip);

  // 4. Battery-Backed NVRAM & Real-Time Clock (RTC) with CR2032 Lithium Coin Cell
  // Retains system date/time and Deuterium / Halogen lamp operating hour meters across power cycles
  const rtcHolder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 0.024, 20),
    MAT_CHROME
  );
  rtcHolder.position.set(-0.20, 0.020, -0.20);
  mbGroup.add(rtcHolder);

  const rtcBattery = new THREE.Mesh(
    new THREE.CylinderGeometry(0.058, 0.058, 0.018, 20),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.9 })
  );
  rtcBattery.name = 'Battery_RTC_CR2032';
  rtcBattery.position.set(-0.20, 0.026, -0.20);
  rtcBattery.userData = {
    name: 'Battery_RTC_CR2032',
    role: 'NVRAM Backup Battery',
    action: 'CR2032 RTC Coin Cell: Retains system clock, lamp operating hour meters & power cycle logs',
  };
  mbGroup.add(rtcBattery);
  interactiveObjects.push(rtcBattery);

  // 5. 24-bit Low-Noise Delta-Sigma ADC (Analog-to-Digital Converter)
  // Directly digitizes the analog microvolt signals from the photodiode pre-amplifier
  const adcChip = new THREE.Mesh(
    new THREE.BoxGeometry(0.10, 0.014, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.45, metalness: 0.35 })
  );
  adcChip.name = 'IC_ADC_24Bit';
  adcChip.position.set(0.15, 0.015, -0.20);
  adcChip.userData = {
    name: 'IC_ADC_24Bit',
    role: 'Analog-to-Digital Converter',
    action: '24-bit Low-Noise Delta-Sigma ADC: Digitizes photodiode sensor currents with high dynamic range (up to 4.0 AU)',
  };
  mbGroup.add(adcChip);
  interactiveObjects.push(adcChip);

  // 6. Quad Modular Stepper Motor Drivers (4x StepStick Daughterboard Modules with Heatsinks)
  // Drives: 1) Grating sine-bar, 2) 6-cell turret, 3) Source selector mirror, 4) Filter wheel
  const driverModules = [
    {
      name: 'Driver_Stepper_Grating',
      z: 0.21,
      label: 'GRATING',
      title: 'Diffraction Grating Sine-Bar Driver',
      action: 'Modular StepStick: 1/128 microstepping driver controlling the monochromator sine-bar lead screw',
    },
    {
      name: 'Driver_Stepper_Turret',
      z: 0.09,
      label: 'TURRET',
      title: '6-Cell Sample Turret Stepper Driver',
      action: 'Modular StepStick: Precision microstepping driver indexing the automated sample cuvette carousel',
    },
    {
      name: 'Driver_Stepper_Selector',
      z: -0.03,
      label: 'MIRROR',
      title: 'Source Selector Flip-Mirror Driver',
      action: 'Modular StepStick: High-speed actuator switching between D2 (UV) and Tungsten (Vis) at 340 nm',
    },
    {
      name: 'Driver_Stepper_Filter',
      z: -0.15,
      label: 'FILTER',
      title: 'Order-Sorting Filter Wheel Driver',
      action: 'Modular StepStick: Stepper driver positioning 6-stage cutoff optical filters for stray-light suppression',
    },
  ];
  driverModules.forEach((dm) => {
    const drvG = new THREE.Group();
    drvG.name = dm.name;
    drvG.position.set(-0.22, 0.020, dm.z);

    const driverTooltip = {
      name: dm.name,
      title: dm.title,
      action: dm.action,
    };
    drvG.userData = driverTooltip;

    // Blue daughterboard module PCB
    const drvPCB = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.008, 0.10),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3, metalness: 0.2 })
    );
    drvPCB.position.y = 0.004;
    drvPCB.userData = driverTooltip;
    drvG.add(drvPCB);

    // Gold pin headers on left and right edges (socketed into motherboard)
    for (const px of [-0.036, 0.036]) {
      const pinHeader = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.018, 0.09),
        MAT_CHASSIS_DARK
      );
      pinHeader.position.set(px, -0.006, 0);
      drvG.add(pinHeader);
    }

    // Stepper Driver IC
    const ic = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.008, 0.035),
      MAT_SMD_BODY
    );
    ic.position.set(0, 0.010, 0);
    drvG.add(ic);

    // Miniature extruded anodized heatsink
    const miniSink = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 0.022, 0.045),
      MAT_ALUM_ANODIZED
    );
    miniSink.position.set(0, 0.024, 0);
    miniSink.userData = driverTooltip;
    drvG.add(miniSink);

    // Current adjustment potentiometer (trimpot)
    const pot = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.012, 0.018),
      MAT_BRASS_FITTING
    );
    pot.position.set(0, 0.012, 0.035);
    drvG.add(pot);

    mbGroup.add(drvG);
    interactiveObjects.push(drvPCB, miniSink);
  });

  // 7. Oscillators & Clock Crystals
  // 25.000 MHz HC-49SM Main Processor Crystal
  const xtal25 = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.016, 0.024),
    MAT_CHROME
  );
  xtal25.position.set(-0.16, 0.015, 0.14);
  mbGroup.add(xtal25);

  // 32.768 kHz RTC Tuning-Fork Crystal
  const xtal32k = new THREE.Mesh(
    new THREE.CylinderGeometry(0.006, 0.006, 0.030, 12),
    MAT_CHROME
  );
  xtal32k.rotation.z = Math.PI / 2;
  xtal32k.position.set(-0.25, 0.012, -0.12);
  mbGroup.add(xtal32k);

  // 8. Radial Aluminum Electrolytic Filter Capacitors (6 cans)
  const capCoords = [
    { x: -0.27, z: -0.26, h: 0.07, r: 0.022 },
    { x: -0.27, z: -0.20, h: 0.07, r: 0.022 },
    { x: 0.06, z: 0.22, h: 0.05, r: 0.018 },
    { x: 0.06, z: -0.12, h: 0.05, r: 0.018 },
    { x: 0.25, z: 0.12, h: 0.05, r: 0.018 },
    { x: 0.25, z: -0.12, h: 0.05, r: 0.018 },
  ];
  capCoords.forEach((cc) => {
    const can = new THREE.Mesh(
      new THREE.CylinderGeometry(cc.r, cc.r, cc.h, 16),
      MAT_CHASSIS_DARK
    );
    can.position.set(cc.x, 0.008 + cc.h / 2, cc.z);
    mbGroup.add(can);

    // Aluminum top with scored pressure relief vent
    const topCap = new THREE.Mesh(
      new THREE.CylinderGeometry(cc.r * 0.95, cc.r * 0.95, 0.003, 16),
      MAT_CHROME
    );
    topCap.position.set(cc.x, 0.008 + cc.h + 0.001, cc.z);
    mbGroup.add(topCap);
  });

  // 9. SMD 0805 Ceramic Capacitors & Resistors Decoupling Arrays
  const smdPositions = [
    [-0.10, 0.010, -0.05], [-0.08, 0.010, -0.05], [-0.06, 0.010, -0.05],
    [-0.10, 0.010, 0.13], [-0.08, 0.010, 0.13], [-0.06, 0.010, 0.13],
    [0.10, 0.010, 0.06], [0.12, 0.010, 0.06], [0.14, 0.010, 0.06],
    [0.10, 0.010, -0.12], [0.12, 0.010, -0.12], [0.14, 0.010, -0.12],
    [0.10, 0.010, -0.27], [0.12, 0.010, -0.27], [0.14, 0.010, -0.27],
  ];
  smdPositions.forEach(([sx, sy, sz], idx) => {
    const smdMat = idx % 2 === 0 ? MAT_SMD_CAP : MAT_SMD_BODY;
    const smd = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.008, 0.010), smdMat);
    smd.position.set(sx, sy, sz);
    mbGroup.add(smd);

    for (const ex of [-0.007, 0.007]) {
      const term = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.008, 0.010), MAT_SMD_TIN);
      term.position.set(sx + ex, sy, sz);
      mbGroup.add(term);
    }
  });

  // 10. Diagnostic Status LEDs (PWR Green, ACT Amber)
  const ledPwr = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.008, 0.008), MAT_LED_GREEN);
  ledPwr.name = 'LED_Motherboard_PWR';
  ledPwr.position.set(-0.29, 0.012, -0.06);
  ledPwr.userData = {
    name: 'LED_Motherboard_PWR',
    title: 'Motherboard +3.3V/5V Power Good LED',
    action: 'Green SMD Indicator: Confirms onboard low-dropout voltage regulators are operational',
  };
  mbGroup.add(ledPwr);

  const ledAct = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.008, 0.008), MAT_LED_AMBER);
  ledAct.name = 'LED_Motherboard_ACT';
  ledAct.position.set(-0.29, 0.012, -0.02);
  ledAct.userData = {
    name: 'LED_Motherboard_ACT',
    title: 'DSP Activity Heartbeat LED',
    action: 'Amber SMD Indicator: Blinks synchronously with DSP real-time operating system execution loop',
  };
  mbGroup.add(ledAct);
  interactiveObjects.push(ledPwr, ledAct);

  // 11. Soldered Headers on Motherboard (Mating receptacles for internal wire harnesses)
  // DC Power Input Header (4-Pin JST-VH) - mates with plugDCPower at (-0.85, BASE_Y + 0.19, -1.29)
  const hdrDCPower = createJSTHeader(4);
  hdrDCPower.name = 'Header_DC_Power';
  hdrDCPower.position.set(0.25, 0.008, 0.36);
  hdrDCPower.rotation.y = Math.PI;
  hdrDCPower.userData = {
    name: 'Header_DC_Power',
    title: 'DC Power Input Header (4-Pin JST-VH)',
    action: 'DC Power Input: Receives regulated +24V, +12V, +5V, -12V DC power bus from SMPS',
  };
  mbGroup.add(hdrDCPower);

  // Cooling Fan Header (3-Pin JST-XH) - mates with plugFanMB at (-0.95, BASE_Y + 0.19, -1.29)
  const hdrFan = createJSTHeader(3);
  hdrFan.name = 'Header_Fan_3Pin';
  hdrFan.position.set(0.15, 0.008, 0.36);
  hdrFan.rotation.y = Math.PI;
  hdrFan.userData = {
    name: 'Header_Fan_3Pin',
    title: 'Cooling Fan Tach Header (3-Pin JST-XH)',
    action: 'Fan Connector: Delivers PWM drive and reads Hall tachometer feedback from 80mm exhaust fan',
  };
  mbGroup.add(hdrFan);

  // Turret Carousel Stepper Header (4-Pin JST-XH) - mates with plugCarouselMB at (-1.05, BASE_Y + 0.19, -1.29)
  const hdrCarousel = createJSTHeader(4);
  hdrCarousel.name = 'Header_Stepper_Carousel';
  hdrCarousel.position.set(0.05, 0.008, 0.36);
  hdrCarousel.rotation.y = Math.PI;
  hdrCarousel.userData = {
    name: 'Header_Stepper_Carousel',
    title: 'Sample Carousel Stepper Header (4-Pin)',
    action: 'Turret Stepper Header: Connects 4-phase bipolar wiring to 6-cell sample changer stepper motor',
  };
  mbGroup.add(hdrCarousel);

  // Grating Sine-Bar Stepper Header (4-Pin JST-XH) - mates with plugGratingMB at (-1.18, BASE_Y + 0.19, -1.29)
  const hdrGrating = createJSTHeader(4);
  hdrGrating.name = 'Header_Stepper_Grating';
  hdrGrating.position.set(-0.08, 0.008, 0.36);
  hdrGrating.rotation.y = Math.PI;
  hdrGrating.userData = {
    name: 'Header_Stepper_Grating',
    title: 'Grating Sine-Bar Stepper Header (4-Pin)',
    action: 'Grating Header: Connects microstepping phases to monochromator sine-bar stepper motor',
  };
  mbGroup.add(hdrGrating);

  // Source Selector Stepper Header (4-Pin JST-XH) - mates with plugSelectorMB at (-1.32, BASE_Y + 0.19, -1.29)
  const hdrSelector = createJSTHeader(4);
  hdrSelector.name = 'Header_Stepper_Selector';
  hdrSelector.position.set(-0.22, 0.008, 0.36);
  hdrSelector.rotation.y = Math.PI;
  hdrSelector.userData = {
    name: 'Header_Stepper_Selector',
    title: 'Source Selector Mirror Header (4-Pin)',
    action: 'Mirror Header: Connects source mirror actuator to switch between D2 and halogen lamps',
  };
  mbGroup.add(hdrSelector);

  // RS-232 UART IDC Box Header (10-Pin) - mates with idcDB9MB at (-0.74, BASE_Y + 0.205, -1.50)
  const hdrRS232 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.040, 0.12), MAT_CHASSIS_DARK);
  hdrRS232.name = 'Header_RS232_UART';
  hdrRS232.position.set(0.36, 0.025, 0.15);
  hdrRS232.userData = {
    name: 'Header_RS232_UART',
    title: 'RS-232 UART Header (10-Pin IDC)',
    action: 'Serial Header: Internal IDC box header routed to the rear DB-9 serial communications port',
  };
  mbGroup.add(hdrRS232);

  // Internal USB 5-Pin Header - mates with plugUSBMB at (-0.74, BASE_Y + 0.19, -1.65)
  const hdrUSB = createJSTHeader(5);
  hdrUSB.name = 'Header_USB_Internal';
  hdrUSB.position.set(0.36, 0.008, 0.00);
  hdrUSB.rotation.y = -Math.PI / 2;
  hdrUSB.userData = {
    name: 'Header_USB_Internal',
    title: 'Internal USB 2.0 Header (5-Pin JST)',
    action: 'USB Header: Internal differential D+/D- connection routed to rear dual USB host ports',
  };
  mbGroup.add(hdrUSB);

  // External Trigger BNC 2-Pin Header - mates with plugBNCMB at (-0.74, BASE_Y + 0.19, -1.77)
  const hdrBNC = createJSTHeader(2);
  hdrBNC.name = 'Header_BNC_Trigger';
  hdrBNC.position.set(0.36, 0.008, -0.12);
  hdrBNC.rotation.y = -Math.PI / 2;
  hdrBNC.userData = {
    name: 'Header_BNC_Trigger',
    title: 'BNC External Trigger Header (2-Pin)',
    action: 'Trigger Header: Connects external TTL sync start/stop signals to the rear BNC bulkhead jack',
  };
  mbGroup.add(hdrBNC);

  // FPC ZIF Connector for Touchscreen - mates with fpcPoints at (-1.10, BASE_Y + 0.19, -1.45)
  const zifSocket = createFPCZIFConnector(0.16);
  zifSocket.name = 'Socket_FPC_ZIF_MB';
  zifSocket.position.set(0.00, 0.008, 0.20);
  zifSocket.userData = {
    name: 'Socket_FPC_ZIF_MB',
    title: 'Touchscreen 30-Pin ZIF Connector',
    action: 'Kapton FPC ZIF Socket: High-density flat flexible cable interface to 7-inch color LCD and touch digitizer',
  };
  mbGroup.add(zifSocket);

  // Gold-plated SMA RF connector receiving shielded detector coaxial cable - mates with smaMBPlug at (-0.74, BASE_Y + 0.205, -1.90)
  const smaOnboard = createSMAJackFemale();
  smaOnboard.name = 'Socket_Motherboard_SMA';
  smaOnboard.position.set(0.36, 0.025, -0.25);
  smaOnboard.userData = {
    name: 'Socket_Motherboard_SMA',
    title: 'Detector Coax SMA Bulkhead',
    action: 'Gold 50Ω SMA Jack: Receives shielded low-noise microvolt signal from photodiode transimpedance pre-amplifier',
  };
  mbGroup.add(smaOnboard);

  interactiveObjects.push(
    hdrDCPower,
    hdrFan,
    hdrCarousel,
    hdrGrating,
    hdrSelector,
    hdrRS232,
    hdrUSB,
    hdrBNC,
    zifSocket,
    smaOnboard
  );

  // =========================================================================
  // 80mm Rear Brushless Cooling Fan & Exhaust Cowl Duct Assembly
  // ("how many screws do we have for the fan and where are they placed and what are they connected to?")
  // =========================================================================
  // Exactly 6 genuine physical screws:
  // - 4x DIN 912 M4 Hex Socket Screws (Fastener_FanMount_M4_1..4) in the 4 corner mounting ears
  //   at X = +/- 0.28, Y = +/- 0.28. They clamp the steel wire finger-guard grill to the fan frame
  //   through silicone vibration dampers, threading into tapped bosses on the internal cowl bracket.
  // - 2x DIN 912 M4 Hex Socket Screws (Fastener_FanBracket_Base_1..2) clamping the bracket foot
  //   securely to the die-cast aluminum baseplate chassis.
  // Mounted internally at Z = 2.20 (0.16m inboard of rear wall Z = 2.36), directing air through
  // an aerodynamic duct to the rear louvers with zero protrusion or tumbling!
  const fanGroup = new THREE.Group();
  fanGroup.name = 'Assembly_CoolingFan';
  fanGroup.position.set(1.40, BASE_Y + 1.23, 2.20);
  opticsGroup.add(fanGroup);

  // Heavy-gauge sheet-aluminum mounting bracket anchored to baseplate
  const fanBracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 0.76, 0.02),
    MAT_ALUM_ANODIZED
  );
  fanBracket.position.set(0, 0, 0.045);
  fanGroup.add(fanBracket);

  // Vertical bracket riser down to baseplate
  const bracketRiser = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.05, 0.06),
    MAT_ALUM_ANODIZED
  );
  bracketRiser.position.set(0.32, -0.58, 0.045);
  fanGroup.add(bracketRiser);

  // Base mounting foot with 2 genuine M4 hex screws bolting bracket to chassis floor
  const bracketFoot = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.024, 0.10),
    MAT_ALUM_ANODIZED
  );
  bracketFoot.position.set(0.32, -1.10, 0.045);
  fanGroup.add(bracketFoot);

  for (const bx of [-0.07, 0.07]) {
    const baseScrew = createHexSocketScrew(0.016, 0.04, { material: MAT_CHROME });
    baseScrew.name = `Fastener_FanBracket_Base_${bx < 0 ? '1' : '2'}`;
    baseScrew.position.set(0.32 + bx, -1.09, 0.045);
    fanGroup.add(baseScrew);
  }

  // Aerodynamic circular exhaust cowl duct spanning from fan rear (Z = 2.24) to rear wall (Z = 2.34)
  const exhaustDuct = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.10, 24, 1, true),
    MAT_CHASSIS_DARK
  );
  exhaustDuct.rotation.x = Math.PI / 2;
  exhaustDuct.position.set(0, 0, 0.09);
  fanGroup.add(exhaustDuct);

  // Main 80mm Fan Housing Frame (80x80x25mm in scale: 0.70 x 0.70 x 0.07)
  const fanFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.70, 0.70, 0.07),
    MAT_CHASSIS_DARK
  );
  fanFrame.name = 'Chassis_FanFrame_80mm';
  fanGroup.add(fanFrame);

  // Four (4) Corner Fastener Assemblies: DIN 912 M4 Screws + Washers + Silicone Vibration Dampers
  const fanCornerOffsets = [
    [-0.28,  0.28, 'TL'], // Top-Left
    [ 0.28,  0.28, 'TR'], // Top-Right
    [-0.28, -0.28, 'BL'], // Bottom-Left
    [ 0.28, -0.28, 'BR'], // Bottom-Right
  ];

  fanCornerOffsets.forEach(([cx, cy, id], idx) => {
    // 1. Vulcanized silicone elastomer vibration damper bushing seated flush against fan frame
    const damper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.012, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 })
    );
    damper.name = `Elastomer_FanDamper_${id}`;
    damper.rotation.x = Math.PI / 2;
    damper.position.set(cx, cy, -0.041);
    fanGroup.add(damper);

    // 2. DIN 125 M4 flat washer seated on damper
    const washer = createWasher(0.018, 0.036, 0.006, { material: MAT_CHROME });
    washer.rotation.x = Math.PI / 2;
    washer.position.set(cx, cy, -0.050);
    fanGroup.add(washer);

    // 3. Genuine DIN 912 M4 Hex Socket Head Cap Screw clamping through frame & bracket into nut
    const screw = createHexSocketScrew(0.016, 0.130, { material: MAT_CHROME });
    screw.name = `Fastener_FanMount_M4_${idx + 1}`;
    screw.rotation.x = -Math.PI / 2;
    screw.position.set(cx, cy, -0.053);
    fanGroup.add(screw);

    // 4. Threaded brass clinch nut seated flush against bracket rear
    const clinchNut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.026, 0.018, 6),
      MAT_BRASS_FITTING
    );
    clinchNut.rotation.x = Math.PI / 2;
    clinchNut.position.set(cx, cy, 0.064);
    fanGroup.add(clinchNut);
  });

  // Steel wire finger-guard grill on fan intake face
  const wireGuardGroup = new THREE.Group();
  wireGuardGroup.name = 'Guard_FanIntake_80mm';
  wireGuardGroup.position.set(0, 0, -0.042);
  fanGroup.add(wireGuardGroup);

  for (const r of [0.12, 0.20, 0.28, 0.34]) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.006, 8, 32),
      MAT_CHROME
    );
    wireGuardGroup.add(ring);
  }
  for (let s = 0; s < 4; s++) {
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.68, 8),
      MAT_CHROME
    );
    spoke.rotation.z = (s * Math.PI) / 4;
    wireGuardGroup.add(spoke);
  }

  // Brushless DC Fan Rotor (Clean, pure XY planar rotation on local Z axis)
  const fanRotor = new THREE.Group();
  fanRotor.name = 'Rotor_CoolingFan';
  fanRotor.position.set(0, 0, 0);
  fanGroup.add(fanRotor);
  animTargets.coolingFanHub = fanRotor;

  // Stator core housing
  const statorCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.04, 20),
    MAT_ALUM_ANODIZED
  );
  statorCore.rotation.x = Math.PI / 2;
  fanGroup.add(statorCore);

  // Rotor central hub disk
  const hubGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.035, 20);
  hubGeom.rotateX(Math.PI / 2);
  const fanHubMesh = new THREE.Mesh(hubGeom, MAT_CHASSIS_DARK);
  fanRotor.add(fanHubMesh);

  // Aerodynamic nose spinner cone
  const coneGeom = new THREE.ConeGeometry(0.07, 0.05, 16);
  coneGeom.rotateX(-Math.PI / 2);
  coneGeom.translate(0, 0, -0.025);
  const fanCone = new THREE.Mesh(coneGeom, MAT_CHASSIS_DARK);
  fanRotor.add(fanCone);

  // 7 Aerodynamic curved impeller vanes pitched for forward exhaust airflow
  for (let b = 0; b < 7; b++) {
    const angle = (b * Math.PI * 2) / 7;
    const bladeGeom = new THREE.BoxGeometry(0.18, 0.045, 0.008);
    const blade = new THREE.Mesh(bladeGeom, MAT_CHASSIS_DARK);
    blade.position.set(Math.cos(angle) * 0.18, Math.sin(angle) * 0.18, 0);
    blade.rotation.z = angle + 0.35;
    blade.rotation.x = 0.40;
    fanRotor.add(blade);
  }

  const fanTooltip = {
    name: 'Assembly_CoolingFan_80mm',
    title: '80mm MagLev BLDC Cooling Fan',
    action: 'MagLev Brushless DC Fan (3200 RPM): Dynamically extracts thermal dissipation from D2/Tungsten lamps & SMPS',
  };
  fanRotor.userData = fanTooltip;
  fanHubMesh.userData = fanTooltip;
  fanCone.userData = fanTooltip;
  interactiveObjects.push(fanRotor, fanHubMesh, fanCone);

  // Install Genuine Procedural Internal Wiring Harnesses
  createInternalWiring(opticsGroup, BASE_Y, CHAMBER_FLOOR_Y, CHAMBER_CENTER_Z);

  // =========================================================================
  // I. Animated 3D Optical Ray Tracing (Internal Light Path)
  // =========================================================================
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

  // 1. Active Lamp -> Selector Mirror (Straight out of front condenser lenses, 100% aimed at mirror)
  // D2 Lamp lens at (-1.346, BASE_Y + 0.65, 1.316) -> Selector Mirror (-1.08, BASE_Y + 0.65, 1.00)
  const raySourceD2 = createLaserRay(new THREE.Vector3(-1.346, BASE_Y + 0.65, 1.316), new THREE.Vector3(-1.08, BASE_Y + 0.65, 1.00), 0xc084fc, 0.016);
  // Tungsten Lamp lens at (-1.365, BASE_Y + 0.65, 0.661) -> Selector Mirror (-1.08, BASE_Y + 0.65, 1.00)
  const raySourceW = createLaserRay(new THREE.Vector3(-1.365, BASE_Y + 0.65, 0.661), new THREE.Vector3(-1.08, BASE_Y + 0.65, 1.00), 0xfbbf24, 0.016);
  animTargets.raySourceD2 = raySourceD2;
  animTargets.raySourceW = raySourceW;

  // 2. Selector Mirror -> Entrance Slit -> Collimating Mirror (Reflective front face at Z = 1.668)
  // Perfectly straight collinear ray passing straight through the bilateral knife-edge aperture (Zero kink!)
  createLaserRay(new THREE.Vector3(-1.08, BASE_Y + 0.65, 1.00), new THREE.Vector3(-0.885, BASE_Y + 0.65, 1.300), 0x38bdf8);
  createLaserRay(new THREE.Vector3(-0.885, BASE_Y + 0.65, 1.300), new THREE.Vector3(-0.646, BASE_Y + 0.65, 1.668), 0x38bdf8);

  // 4. Collimating Mirror -> Holographic Diffraction Grating
  createLaserRay(new THREE.Vector3(-0.646, BASE_Y + 0.65, 1.668), new THREE.Vector3(-0.25, BASE_Y + 0.65, 1.15), 0x38bdf8);

  // 5. Holographic Grating -> Dispersed Spectral Rainbow Fan -> Focusing Mirror
  // All 3 dispersed wavelengths terminate strictly on the front reflective face at Z = 1.668!
  // Zero rays penetrate behind the mirror substrate!
  const rayViolet = createLaserRay(new THREE.Vector3(-0.25, BASE_Y + 0.65, 1.15), new THREE.Vector3(0.135, BASE_Y + 0.65, 1.668), 0xa855f7, 0.020);
  const rayGreen  = createLaserRay(new THREE.Vector3(-0.25, BASE_Y + 0.65, 1.15), new THREE.Vector3(0.159, BASE_Y + 0.65, 1.668), 0x10b981, 0.018);
  const rayRed    = createLaserRay(new THREE.Vector3(-0.25, BASE_Y + 0.65, 1.15), new THREE.Vector3(0.183, BASE_Y + 0.65, 1.668), 0xef4444, 0.018);
  rayViolet.mat.userData = { keepSpectralColor: true };
  rayGreen.mat.userData  = { keepSpectralColor: true };
  rayRed.mat.userData    = { keepSpectralColor: true };

  // 6. Focusing Mirror -> Exit Slit -> Filter Wheel -> Chopper (Coplanar at BASE_Y + 0.65)
  // Originates strictly on front reflective face (0.159, BASE_Y + 0.65, 1.668)
  createLaserRay(new THREE.Vector3(0.159, BASE_Y + 0.65, 1.668), new THREE.Vector3(0.18, BASE_Y + 0.65, 1.05), 0x00ffff);
  createLaserRay(new THREE.Vector3(0.18, BASE_Y + 0.65, 1.05), new THREE.Vector3(0.18, BASE_Y + 0.65, 0.60), 0x00ffff);

  // 7. Chopper Transmission -> Sample Channel (I Beam)
  // 7a. Chopper transmission -> Sample Fold Mirror M3 at (0.18, BASE_Y + 0.65, 0.32)
  createLaserRay(new THREE.Vector3(0.18, BASE_Y + 0.65, 0.60), new THREE.Vector3(0.18, BASE_Y + 0.65, 0.32), 0x00ffff);
  // 7b. Sample Fold Mirror M3 -> 90° reflection into +X along Z = 0.32 to Fold Mirror M4 at (1.59, BASE_Y + 0.65, 0.32)
  createLaserRay(new THREE.Vector3(0.18, BASE_Y + 0.65, 0.32), new THREE.Vector3(1.59, BASE_Y + 0.65, 0.32), 0x00ffff);
  // 7c. Fold Mirror M4 -> 90° reflection into -Z through rear bulkhead aperture barrel at Z = -0.15
  createLaserRay(new THREE.Vector3(1.59, BASE_Y + 0.65, 0.32), new THREE.Vector3(1.59, BASE_Y + 0.65, -0.15), 0x00ffff);
  // 7d. From rear aperture barrel along -Z through active quartz cuvette (Z in [-1.09, -1.27])
  createLaserRay(new THREE.Vector3(1.59, BASE_Y + 0.65, -0.15), new THREE.Vector3(1.59, BASE_Y + 0.65, -1.09), 0x00ffff);
  createLaserRay(new THREE.Vector3(1.59, BASE_Y + 0.65, -1.09), new THREE.Vector3(1.59, BASE_Y + 0.65, -1.27), 0x00ffff);
  // 7e. Exiting cuvette along -Z to Sample Photodiode Detector die at front wall (1.59, BASE_Y + 0.65, -2.12)
  createLaserRay(new THREE.Vector3(1.59, BASE_Y + 0.65, -1.27), new THREE.Vector3(1.59, BASE_Y + 0.65, -2.12), 0x00ffff);

  // 8. Chopper Reflection -> Reference Channel (I₀ Beam)
  // 8a. Chopper reflection -> Ref Fold Mirror M1 at (0.18, BASE_Y + 0.65, 0.48)
  createLaserRay(new THREE.Vector3(0.18, BASE_Y + 0.65, 0.60), new THREE.Vector3(0.18, BASE_Y + 0.65, 0.48), 0x38bdf8);
  // 8b. Ref Fold Mirror M1 -> 90° reflection into +X along Z = 0.48 to Ref Fold Mirror M2 at (0.55, BASE_Y + 0.65, 0.48)
  createLaserRay(new THREE.Vector3(0.18, BASE_Y + 0.65, 0.48), new THREE.Vector3(0.55, BASE_Y + 0.65, 0.48), 0x38bdf8);
  // 8c. Ref Fold Mirror M2 -> 90° reflection into -Z through rear bulkhead aperture barrel at Z = -0.15
  createLaserRay(new THREE.Vector3(0.55, BASE_Y + 0.65, 0.48), new THREE.Vector3(0.55, BASE_Y + 0.65, -0.15), 0x38bdf8);
  // 8d. From rear aperture barrel along -Z through Reference Cuvette (Z in [-1.09, -1.27])
  createLaserRay(new THREE.Vector3(0.55, BASE_Y + 0.65, -0.15), new THREE.Vector3(0.55, BASE_Y + 0.65, -1.09), 0x38bdf8);
  createLaserRay(new THREE.Vector3(0.55, BASE_Y + 0.65, -1.09), new THREE.Vector3(0.55, BASE_Y + 0.65, -1.27), 0x38bdf8);
  // 8e. Exiting reference cuvette along -Z to Reference Photodiode Detector die at front wall (0.55, BASE_Y + 0.65, -2.12)
  createLaserRay(new THREE.Vector3(0.55, BASE_Y + 0.65, -1.27), new THREE.Vector3(0.55, BASE_Y + 0.65, -2.12), 0x38bdf8);

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

  // IEC C14 Power Inlet Receptacle (faces outward +Z, prongs point into cavity, flange flush with rear panel)
  const iecPort = createIECInlet();
  iecPort.position.set(-1.4, BASE_Y + 0.45, rearZ);
  iecPort.userData = {
    name: 'Inlet_IEC_C14',
    title: 'IEC C14 AC Power Inlet',
    action: 'AC Mains Power Inlet: Standard 100-240V AC 50/60Hz fused filtered entry with chassis earthing ground pin',
  };
  root.add(iecPort);
  interactiveObjects.push(iecPort);

  // Dedicated Duplex AC Electrical Benchtop Service Pedestal Outlet Position
  // Tabletop datum Y = 0.0, pedestal front face at Z = 3.14, upper socket at Y = 0.22
  const pedestalOutletPos = new THREE.Vector3(1.35, 0.22, 3.14);

  // Real 3D Molded AC Power Cord: curves gracefully across bench and plugs into power pedestal
  const powerCord = createPowerCord(new THREE.Vector3(-1.4, BASE_Y + 0.45, rearZ), pedestalOutletPos);
  root.add(powerCord);
  animTargets.powerCord = powerCord;

  // Authentic Dual-Facet Industrial Rocker Switch (molded white 'I' on top, 'O' on bottom)
  const rocker = createRealisticRockerSwitch({ isOn: true });
  rocker.position.set(-0.8, BASE_Y + 0.45, rearZ);
  rocker.userData = {
    name: 'Btn_Power',
    title: 'Mains AC Power Rocker Switch',
    action: 'Illuminated Rocker Switch: Primary AC power switch. Click to toggle instrument power state',
  };
  root.add(rocker);
  interactiveObjects.push(rocker);
  animTargets.rockerSwitch = rocker;
  animTargets.rockerPivot = rocker.userData.rockerPivot;

  // Rear Silkscreen Markings helper (DIAG-005, DIAG-015: flipY=false with inverted UV Y for 100% upright text)
  function makeRearLabel(text, w = 0.35, h = 0.08) {
    const cv = document.createElement('canvas');
    cv.width = 256;
    cv.height = 64;
    const c = cv.getContext('2d');
    c.fillStyle = '#1e2430';
    c.fillRect(0, 0, 256, 64);
    c.fillStyle = '#e2e8f0';
    c.font = 'bold 24px monospace';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(text, 128, 32);
    const t = new THREE.CanvasTexture(cv);
    t.flipY = false;
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    const plGeo = new THREE.PlaneGeometry(w, h);
    const uvAttr = plGeo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setY(i, 1.0 - uvAttr.getY(i));
    }
    uvAttr.needsUpdate = true;
    const pl = new THREE.Mesh(
      plGeo,
      new THREE.MeshBasicMaterial({ map: t })
    );
    pl.position.z = rearZ + 0.005;
    return pl;
  }

  // Authentic IEC Silkscreen Markings: POWER header centered cleanly above switch
  const lblPower = makeRearLabel('POWER', 0.22, 0.05);
  lblPower.position.set(-0.8, BASE_Y + 0.68, rearZ + 0.005);
  root.add(lblPower);

  const lblInlet = makeRearLabel('100-240V~ 160VA', 0.36, 0.06);
  lblInlet.position.set(-1.4, BASE_Y + 0.65, rearZ + 0.005);
  root.add(lblInlet);

  // Dual USB-A Ports (facing outward +Z)
  for (let u = 0; u < 2; u++) {
    const usb = createUSBPort();
    usb.position.set(-0.2 + (u * 0.22), BASE_Y + 0.45, rearZ);
    usb.userData = {
      name: `Port_USB_${u + 1}`,
      title: `USB 2.0 Host Port ${u + 1}`,
      action: 'USB 2.0 Port: Supports USB flash drive method/data export and external barcode reader',
    };
    root.add(usb);
    interactiveObjects.push(usb);
  }
  const lblUSB = makeRearLabel('USB 2.0', 0.26, 0.06);
  lblUSB.position.set(-0.09, BASE_Y + 0.65, rearZ + 0.005);
  root.add(lblUSB);

  // DB9 RS-232 Serial Port (facing outward +Z, showing trapezoidal shield and screw locks)
  const db9 = createDB9Port();
  db9.position.set(0.65, BASE_Y + 0.45, rearZ);
  db9.userData = {
    name: 'Port_RS232',
    title: 'RS-232C Serial Interface Port',
    action: 'DB-9 Male Serial Port: Industry standard bi-directional automated LIMS / PC data streaming',
  };
  root.add(db9);
  interactiveObjects.push(db9);
  const lblDB9 = makeRearLabel('RS-232C', 0.26, 0.06);
  lblDB9.position.set(0.65, BASE_Y + 0.65, rearZ + 0.005);
  root.add(lblDB9);

  // BNC External Trigger Jack (facing outward +Z, showing slotted barrel and gold pin)
  const bnc = createBNCJack();
  bnc.position.set(1.3, BASE_Y + 0.45, rearZ);
  bnc.userData = {
    name: 'Port_BNC_Trigger',
    title: 'BNC External Trigger Jack',
    action: 'Isolated 50Ω BNC Receptacle: TTL trigger pulse input for external autosampler synchronization',
  };
  root.add(bnc);
  interactiveObjects.push(bnc);
  const lblBNC = makeRearLabel('EXT TRIG', 0.26, 0.06);
  lblBNC.position.set(1.3, BASE_Y + 0.65, rearZ + 0.005);
  root.add(lblBNC);

  // Rear exhaust recessed ventilation pocket with honeycomb protective filter screen
  const exhaustPocket = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.78, 0.02),
    MAT_CHAMBER_INNER
  );
  exhaustPocket.position.set(1.40, BASE_Y + 1.23, rearZ - 0.01);
  root.add(exhaustPocket);

  // Hex-perforated dark filter screen behind louvers
  const filterScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.74, 0.74),
    new THREE.MeshStandardMaterial({
      color: 0x0a0e17,
      roughness: 0.9,
      metalness: 0.3,
      side: THREE.DoubleSide,
    })
  );
  filterScreen.position.set(1.40, BASE_Y + 1.23, rearZ - 0.005);
  root.add(filterScreen);

  // 8 Angled downward-sloped molded exhaust louvers (shields internal fan from dust)
  for (let f = 0; f < 8; f++) {
    const fanLouver = new THREE.Mesh(
      new THREE.BoxGeometry(0.74, 0.024, 0.030),
      MAT_CHASSIS
    );
    fanLouver.rotation.x = 0.42; // Angled downwards at ~24 degrees
    fanLouver.position.set(1.40, BASE_Y + 0.95 + (f * 0.08), rearZ + 0.005);
    root.add(fanLouver);
  }

  // 14. Photorealistic Laboratory Bench & Spacious Room Enclosure (Centrifuge Standard)
  // Island workstation bench (12m x 7.4m) centered in 32m x 32m room with 12+ meters of open clearance behind
  if (options.includeLab !== false) {
    const labGroup = new THREE.Group();
    labGroup.name = 'Lab_Environment';

    // Black Epoxy Lab Countertop (Width 12.0, Depth 7.4, Height 0.25, Datum surface Y = 0.0)
    const matCountertop = new THREE.MeshStandardMaterial({
      color: 0x11161d,
      roughness: 0.22,
      metalness: 0.12,
    });
    const benchTop = new THREE.Mesh(
      new THREE.BoxGeometry(12.0, 0.25, 7.4),
      matCountertop
    );
    benchTop.position.set(0, -0.125, 0);
    benchTop.receiveShadow = true;
    labGroup.add(benchTop);

    // Perimeter stainless steel apron trim rails (DIAG-003: discrete wrap trims with zero coplanar overlap)
    const matBenchTrim = MAT_ALUM_ANODIZED;
    const trimF = new THREE.Mesh(new THREE.BoxGeometry(12.06, 0.06, 0.03), matBenchTrim);
    trimF.position.set(0, -0.03, -3.70 - 0.015);
    labGroup.add(trimF);

    const trimB = new THREE.Mesh(new THREE.BoxGeometry(12.06, 0.06, 0.03), matBenchTrim);
    trimB.position.set(0, -0.03, 3.70 + 0.015);
    labGroup.add(trimB);

    const trimL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 7.40), matBenchTrim);
    trimL.position.set(-6.0 - 0.015, -0.03, 0);
    labGroup.add(trimL);

    const trimR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 7.40), matBenchTrim);
    trimR.position.set(6.0 + 0.015, -0.03, 0);
    labGroup.add(trimR);

    // Cabinet sub-structure beneath bench
    const matCabinet = new THREE.MeshStandardMaterial({ color: 0x1e2736, roughness: 0.5, metalness: 0.1 });
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(10.8, 4.25, 6.6), matCabinet);
    cabinet.position.set(0, -2.375, 0);
    cabinet.receiveShadow = true;
    labGroup.add(cabinet);

    // 6 Tubular steel support legs extending down to floor at Y = -4.5
    for (const lx of [-5.6, 0, 5.6]) {
      for (const lz of [-3.3, 3.3]) {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 4.25, 16),
          MAT_ALUM_ANODIZED
        );
        leg.position.set(lx, -2.375, lz);
        labGroup.add(leg);

        const foot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16),
          MAT_CHROME
        );
        foot.position.set(lx, -4.48, lz);
        labGroup.add(foot);
      }
    }

    // =========================================================================
    // Benchtop Industrial Dual-Gang Service Pedestal (Assembly_PowerPedestal)
    // Anchored to bench surface at X = 1.35, Z = 3.25; receives NEMA 5-15P plug
    // Fed by genuine 1" galvanized steel EMT conduit passing down to subfloor
    // =========================================================================
    const pedestalGroup = new THREE.Group();
    pedestalGroup.name = 'Assembly_PowerPedestal';
    pedestalGroup.position.set(1.35, 0, 3.25);
    labGroup.add(pedestalGroup);

    // Cast aluminum dual-gang tombstone housing (Width 0.34, Height 0.36, Depth 0.22)
    const pedestalBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.36, 0.22),
      MAT_ALUM_ANODIZED
    );
    pedestalBox.position.set(0, 0.18, 0);
    pedestalBox.castShadow = true;
    pedestalBox.userData = {
      name: 'Assembly_PowerPedestal',
      title: 'Benchtop AC Service Pedestal',
      action: 'Cast Aluminum Bench Pedestal: Duplex NEMA 5-15R receptacles providing 120V AC mains to laboratory twins',
    };
    pedestalGroup.add(pedestalBox);
    interactiveObjects.push(pedestalBox);

    // Cast mounting base flange resting on benchtop (Width 0.40, Depth 0.28, Thickness 0.02)
    const baseFlange = new THREE.Mesh(
      new THREE.BoxGeometry(0.40, 0.02, 0.28),
      MAT_ALUM_ANODIZED
    );
    baseFlange.position.set(0, 0.01, 0);
    pedestalGroup.add(baseFlange);

    // 4 Stainless M5 anchor bolts securing pedestal base to epoxy countertop
    for (const bx of [-0.16, 0.16]) {
      for (const bz of [-0.11, 0.11]) {
        const bolt = createHexSocketScrew(0.012, 0.03, { material: MAT_CHROME });
        bolt.position.set(bx, 0.02, bz);
        pedestalGroup.add(bolt);
      }
    }

    // Heavy-duty specification grade duplex receptacle faceplate (Z = -0.11 from pedestal center, i.e. Z = 3.14)
    const matReceptacle = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.15,
    });
    const faceplate = new THREE.Mesh(
      new THREE.BoxGeometry(0.20, 0.30, 0.012),
      matReceptacle
    );
    faceplate.position.set(0, 0.18, -0.115);
    pedestalGroup.add(faceplate);

    // Upper Duplex Socket Well (centered at Y = 0.22, Z = -0.11; receives machine power plug)
    const upperSocketWell = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.11, 0.015),
      MAT_CHASSIS_DARK
    );
    upperSocketWell.position.set(0, 0.22, -0.118);
    pedestalGroup.add(upperSocketWell);

    // Lower Duplex Socket Well (centered at Y = 0.11, Z = -0.11; spare 20A commercial outlet)
    const lowerSocketWell = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.11, 0.015),
      MAT_CHASSIS_DARK
    );
    lowerSocketWell.position.set(0, 0.11, -0.118);
    pedestalGroup.add(lowerSocketWell);

    // Lower socket NEMA 5-20R T-slot neutral, hot slot, and round ground hole
    const tSlotH = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.008, 0.012), MAT_CHASSIS_DARK);
    tSlotH.position.set(-0.035, 0.115, -0.125);
    pedestalGroup.add(tSlotH);
    const tSlotV = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.034, 0.012), MAT_CHASSIS_DARK);
    tSlotV.position.set(-0.035, 0.110, -0.125);
    pedestalGroup.add(tSlotV);

    const hotSlot = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.034, 0.012), MAT_CHASSIS_DARK);
    hotSlot.position.set(0.035, 0.110, -0.125);
    pedestalGroup.add(hotSlot);

    const groundHole = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.012, 12), MAT_CHASSIS_DARK);
    groundHole.rotation.x = Math.PI / 2;
    groundHole.position.set(0, 0.075, -0.125);
    pedestalGroup.add(groundHole);

    // Green ground dot indicator
    const groundDot = new THREE.Mesh(
      new THREE.CircleGeometry(0.008, 12),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    groundDot.position.set(0.07, 0.27, -0.122);
    pedestalGroup.add(groundDot);

    // =========================================================================
    // Galvanized Steel EMT Conduit (Conduit_EMT_PowerFeed)
    // 1-inch trade size metallic conduit passes vertically through benchtop to floor
    // =========================================================================
    const emtConduit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 4.5, 16),
      MAT_CONDUIT_STEEL
    );
    emtConduit.name = 'Conduit_EMT_PowerFeed';
    emtConduit.position.set(0, -2.25, 0);
    pedestalGroup.add(emtConduit);

    // Top hexagonal compression locknut collar above bench
    const locknutTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.020, 6),
      MAT_CONDUIT_STEEL
    );
    locknutTop.position.set(0, 0.015, 0);
    pedestalGroup.add(locknutTop);

    // Bottom hexagonal compression locknut collar beneath bench
    const locknutBottom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.020, 6),
      MAT_CONDUIT_STEEL
    );
    locknutBottom.position.set(0, -0.265, 0);
    pedestalGroup.add(locknutBottom);

    // Subfloor 90-degree EMT sweep elbow at floor datum Y = -4.5
    const elbowCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -4.30, 0),
      new THREE.Vector3(0, -4.45, 0.08),
      new THREE.Vector3(0, -4.48, 0.35),
    ]);
    const elbowGeo = new THREE.TubeGeometry(elbowCurve, 16, 0.024, 12, false);
    const elbowMesh = new THREE.Mesh(elbowGeo, MAT_CONDUIT_STEEL);
    pedestalGroup.add(elbowMesh);

    // 3 THHN copper insulated conductors (#12 AWG Black Live, White Neutral, Green Ground)
    const matTHHNBlack = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const matTHHNWhite = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5 });
    const matTHHNGreen = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 });

    const wireBlack = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.18, 8), matTHHNBlack);
    wireBlack.position.set(-0.010, 0.09, 0);
    pedestalGroup.add(wireBlack);

    const wireWhite = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.18, 8), matTHHNWhite);
    wireWhite.position.set(0.010, 0.09, 0);
    pedestalGroup.add(wireWhite);

    const wireGreen = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.18, 8), matTHHNGreen);
    wireGreen.position.set(0, 0.09, 0.010);
    pedestalGroup.add(wireGreen);

    // =========================================================================
    // Spacious Laboratory Room Enclosure (36m x 36m Shell, High Ceiling Y = 28m)
    // Centrifuge Standard: High vertical headroom (28m) and 14m clear aisle behind bench
    // Ceiling uses single-sided downward-facing plane so it never cuts off viewing from above
    // =========================================================================
    const matWall = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.88, metalness: 0.05 });
    const ceilingY = 28.0;
    const floorY = -4.5;
    const wallH = ceilingY - floorY; // 32.5m
    const wallY = (ceilingY + floorY) / 2; // 11.75m
    const wallD = 0.30;
    const roomSpan = 36.0;
    const halfSpan = roomSpan / 2; // 18.0m

    // North Wall (Z = +18.0)
    const wallNorth = new THREE.Mesh(new THREE.BoxGeometry(roomSpan, wallH, wallD), matWall);
    wallNorth.name = 'Lab_BackWall';
    wallNorth.position.set(0, wallY, halfSpan);
    wallNorth.receiveShadow = true;
    labGroup.add(wallNorth);

    // South Wall (Z = -18.0)
    const wallSouth = new THREE.Mesh(new THREE.BoxGeometry(roomSpan, wallH, wallD), matWall);
    wallSouth.position.set(0, wallY, -halfSpan);
    wallSouth.receiveShadow = true;
    labGroup.add(wallSouth);

    // West Wall (X = -18.0)
    const wallWest = new THREE.Mesh(new THREE.BoxGeometry(wallD, wallH, roomSpan), matWall);
    wallWest.position.set(-halfSpan, wallY, 0);
    wallWest.receiveShadow = true;
    labGroup.add(wallWest);

    // East Wall (X = +18.0)
    const wallEast = new THREE.Mesh(new THREE.BoxGeometry(wallD, wallH, roomSpan), matWall);
    wallEast.position.set(halfSpan, wallY, 0);
    wallEast.receiveShadow = true;
    labGroup.add(wallEast);

    // Perimeter Wall Kickplates (Dark baseboard trim at bottom of walls)
    const matBaseboard = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6, metalness: 0.2 });
    const bbNorth = new THREE.Mesh(new THREE.BoxGeometry(roomSpan, 0.24, 0.04), matBaseboard);
    bbNorth.position.set(0, floorY + 0.12, halfSpan - wallD / 2 - 0.02);
    labGroup.add(bbNorth);

    const bbSouth = new THREE.Mesh(new THREE.BoxGeometry(roomSpan, 0.24, 0.04), matBaseboard);
    bbSouth.position.set(0, floorY + 0.12, -halfSpan + wallD / 2 + 0.02);
    labGroup.add(bbSouth);

    // Architectural Laboratory Ceiling (Y = 28.0m)
    // Uses single-sided downward-facing plane so it is visible from inside looking up,
    // but automatically backface-culled from above so it never cuts off or occludes top view.
    const matCeiling = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      side: THREE.FrontSide,
    });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomSpan, roomSpan), matCeiling);
    ceiling.name = 'Lab_Ceiling';
    ceiling.rotation.x = Math.PI / 2; // Normal points straight down (-Y)
    ceiling.position.set(0, ceilingY, 0);
    labGroup.add(ceiling);

    // Architectural Flush LED troffer light panels in ceiling (pointing down)
    const matTroffer = new THREE.MeshBasicMaterial({ color: 0xf8fafc, side: THREE.FrontSide });
    for (const tx of [-12, -6, 0, 6, 12]) {
      for (const tz of [-10, -4, 2, 8, 14]) {
        const troffer = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.8), matTroffer);
        troffer.rotation.x = Math.PI / 2; // Normal points down (-Y)
        troffer.position.set(tx, ceilingY - 0.02, tz);
        labGroup.add(troffer);
      }
    }

    // High-durability epoxy laboratory floor (Y = -4.5)
    const matFloor = new THREE.MeshStandardMaterial({
      color: 0x0b1118,
      roughness: 0.45,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomSpan + 4, roomSpan + 4), matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.5;
    floor.receiveShadow = true;
    labGroup.add(floor);

    // High-visibility yellow safety perimeter warning border on floor around bench area
    const matHazard = new THREE.MeshBasicMaterial({ color: 0xeab308 });
    const hazardF = new THREE.Mesh(new THREE.PlaneGeometry(16.0, 0.15), matHazard);
    hazardF.rotation.x = -Math.PI / 2;
    hazardF.position.set(0, -4.49, -5.2);
    labGroup.add(hazardF);

    const hazardB = new THREE.Mesh(new THREE.PlaneGeometry(16.0, 0.15), matHazard);
    hazardB.rotation.x = -Math.PI / 2;
    hazardB.position.set(0, -4.49, 5.2);
    labGroup.add(hazardB);

    const hazardL = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 10.4), matHazard);
    hazardL.rotation.x = -Math.PI / 2;
    hazardL.position.set(-8.0, -4.49, 0);
    labGroup.add(hazardL);

    const hazardR = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 10.4), matHazard);
    hazardR.rotation.x = -Math.PI / 2;
    hazardR.position.set(8.0, -4.49, 0);
    labGroup.add(hazardR);

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
