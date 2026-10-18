/**
 * SREdesigns PH-7000 Pro — Procedural Three.js 3D Twin Architecture
 * 
 * Gold-Tier Procedural Laboratory Twin adhering to Semantic Part Taxonomy:
 * - Precision sloped ergonomic chassis casting (Body_Chassis) with carved recessed bezel pocket
 * - Dedicated dynamic high-DPI CanvasTexture LCD quad (UI_LCD) with upright UV mapping (DIAG-005)
 * - Protective optical acrylic lens (Glass_ScreenLens) with anti-reflective coating
 * - Tactile membrane key switches (Btn_Read, Btn_Cal, Btn_Mode, Btn_Setup, Btn_Hold)
 * - Heavy die-cast zinc stand base (Body_StandBase) seated at datum Y = 0 with knurled lock collar
 * - Counterbalanced dual-pantograph articulated arm (Pivot_ArmBase, Pivot_ArmLower, Pivot_ArmUpper, Pivot_HolderHead)
 * - Sealed glass combination pH electrode (Glass_ElectrodeStem, Glass_PHBulb, Body_RefWire, Body_ElectrolyteGel)
 * - PT1000 stainless steel ATC temperature probe (Body_ATCProbeAssembly)
 * - Removable 3M KCl wetting storage solution cap (Body_StorageCap)
 * - Continuous flexible coaxial electrode cable with molded strain reliefs & BNC connector (Body_ElectrodeCoaxCable)
 * - ATC probe cable securely routed alongside coaxial cable into rear ATC port (Body_ATCCable)
 * - Internal Electronics Bay: FR4 motherboard (PCB_Mainboard), ARM Cortex-M4 MCU, 
 *   solid nickel-plated Faraday electrometer shielding can (Shield_Electrometer_Faraday), 
 *   24-bit delta-sigma ADC, precision reference, and ribbon cable (Cable_Ribbon_Display)
 * - Flush rear I/O plate (Plate_RearIO_Bulkhead) with BNC jack, ATC mini-jack, DB9 RS-232, and DC barrel jack
 * - Bench duplex receptacle pedestal (Power_Receptacle_Duplex) with NEMA 5-15P plug (Power_Plug_NEMA) and 12V PSU brick
 * - 150 mL borosilicate glass beaker (Glass_Beaker) with volume graduations and dynamic liquid meniscus (Glass_SolutionLiquid)
 * - 3 standard calibration buffer bottles (Body_BufferBottle_4, Body_BufferBottle_7, Body_BufferBottle_10)
 * - Polyethylene wash bottle with curved dispensing nozzle (Body_WashBottle)
 * - Comprehensive Part Catalog with 35+ registered assemblies for Part Explorer
 * 
 * Units: 1 unit ≈ 100 mm (width 1.90 ≈ 190 mm, depth 2.40 ≈ 240 mm). Y-up, front = -Z.
 */

import * as THREE from 'three';
import {
  createHexSocketScrew,
  createWasher,
  createVibrationFoot,
  createDB9Port,
  createBNCJack,
} from '../../../lab_viewer/shared/hardware_library.js';

// ---------------------------------------------------------------------------
// Material Helpers & Procedural Palette
// ---------------------------------------------------------------------------
const M = (color, o = {}) => new THREE.MeshStandardMaterial({
  color,
  roughness: o.r ?? 0.35,
  metalness: o.m ?? 0.10,
  transparent: o.o != null && o.o < 1,
  opacity: o.o ?? 1,
  emissive: new THREE.Color(o.e ?? o.emissive ?? 0x000000),
  emissiveIntensity: o.ei ?? o.emissiveIntensity ?? 0,
  side: o.side ?? THREE.FrontSide,
  depthWrite: o.dw ?? true,
});

function box(w, h, d, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cyl(rT, rB, h, mat, segs = 32) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, segs), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

const matWhiteChassis   = M(0xf1f5f9, { r: 0.28, m: 0.12 });
const matDarkBezel     = M(0x0f172a, { r: 0.40, m: 0.18 });
const matBezelTrim     = M(0x334155, { r: 0.35, m: 0.70 });
const matSSPolished    = M(0xe2e8f0, { r: 0.12, m: 0.95, side: THREE.DoubleSide });
const matSSBrushed     = M(0xc4cbd4, { r: 0.28, m: 0.88, side: THREE.DoubleSide });
const matZincCast      = M(0x272c35, { r: 0.65, m: 0.40 });
const matBrass         = M(0xd4af37, { r: 0.25, m: 0.85 });
const matRubber        = M(0x111317, { r: 0.92, m: 0.05 });
const matCable         = M(0x181a1f, { r: 0.82, m: 0.05 });
const matGlassClear    = M(0xf8fafc, { r: 0.04, m: 0.08, o: 0.22, side: THREE.DoubleSide, dw: false });
const matElectrolyte   = M(0xdbeafe, { r: 0.08, m: 0.02, o: 0.65, side: THREE.DoubleSide });
const matAgWire        = M(0xe2e8f0, { r: 0.20, m: 0.95 });
const matPCB           = M(0x166534, { r: 0.35, m: 0.20 }); // Deep green FR-4
const matFaradayShield = M(0xd1d5db, { r: 0.20, m: 0.92 }); // Nickel-plated brass can
const matICBlack       = M(0x0a0d14, { r: 0.65, m: 0.15 });
const matRibbonGray    = M(0x94a3b8, { r: 0.60, m: 0.05, side: THREE.DoubleSide });
const matBottleRed     = M(0xf43f5e, { r: 0.32, m: 0.05 });
const matBottleYel     = M(0xeab308, { r: 0.32, m: 0.05 });
const matBottleBlu     = M(0x0ea5e9, { r: 0.32, m: 0.05 });
const matWashBottle    = M(0xf1f5f9, { r: 0.38, m: 0.02, o: 0.72, side: THREE.DoubleSide });

// ---------------------------------------------------------------------------
// Standing-height Lab Workbench Datum (900 mm = 9.00 units)
// ---------------------------------------------------------------------------
export const BENCH = {
  cx: 0.0,
  cz: 0.0,
  sx: 11.0,
  sz: 7.2,
  bodyH: 8.30,
  topT: 0.70,
  get surfaceY() {
    return this.bodyH + this.topT; // 9.00 units
  },
  get outlet() {
    return {
      x: 2.20,
      y: this.surfaceY + 0.12,
      z: 2.60,
    };
  },
};

// ---------------------------------------------------------------------------
// Standard Camera Viewpoint Presets
// ---------------------------------------------------------------------------
export const CAM_ISO = {
  position: new THREE.Vector3(2.80, BENCH.surfaceY + 2.40, -4.20),
  target: new THREE.Vector3(0.50, BENCH.surfaceY + 0.65, -0.20),
};

export const CAM_FRONT = {
  position: new THREE.Vector3(0.00, BENCH.surfaceY + 1.80, -3.60),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 0.55, -0.20),
};

export const CAM_SIDE = {
  position: new THREE.Vector3(4.60, BENCH.surfaceY + 1.80, -0.20),
  target: new THREE.Vector3(0.50, BENCH.surfaceY + 0.70, -0.20),
};

export const CAM_TOP = {
  position: new THREE.Vector3(0.50, BENCH.surfaceY + 5.20, -0.20),
  target: new THREE.Vector3(0.50, BENCH.surfaceY, -0.20),
};

export const CAM_EXPLODED = {
  position: new THREE.Vector3(3.20, BENCH.surfaceY + 3.40, -4.60),
  target: new THREE.Vector3(0.50, BENCH.surfaceY + 1.10, -0.20),
};

export const CAM_CONSOLE = {
  position: new THREE.Vector3(0.00, BENCH.surfaceY + 1.65, -1.95),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 0.45, -0.05),
};

export const PH_METER_CAMERAS = {
  CAM_ISO: { pos: [2.80, BENCH.surfaceY + 2.40, -4.20], target: [0.50, BENCH.surfaceY + 0.65, -0.20], fov: 40 },
  CAM_FRONT: { pos: [0.00, BENCH.surfaceY + 1.80, -3.60], target: [0.00, BENCH.surfaceY + 0.55, -0.20], fov: 40 },
  CAM_SIDE: { pos: [4.60, BENCH.surfaceY + 1.80, -0.20], target: [0.50, BENCH.surfaceY + 0.70, -0.20], fov: 40 },
  CAM_TOP: { pos: [0.50, BENCH.surfaceY + 5.20, -0.20], target: [0.50, BENCH.surfaceY, -0.20], fov: 42 },
  CAM_EXPLODED: { pos: [3.20, BENCH.surfaceY + 3.40, -4.60], target: [0.50, BENCH.surfaceY + 1.10, -0.20], fov: 44 },
  CAM_CONSOLE: { pos: [0.00, BENCH.surfaceY + 1.65, -1.95], target: [0.00, BENCH.surfaceY + 0.45, -0.05], fov: 34 },
};

// ---------------------------------------------------------------------------
// Main 3D PH Meter System Builder
// ---------------------------------------------------------------------------
export function createPHMeterModel(options = {}) {
  const root = new THREE.Group();
  root.name = 'Body_PHMeterSystem';

  const refs = {
    lcdMesh: null,
    armBase: null,
    armLower: null,
    armUpper: null,
    holderHead: null,
    storageCap: null,
    liquidMesh: null,
    powerPlug: null,
    powerCord: null,
    coaxCable: null,
    atcCable: null,
    chassisCover: null,
    beakerMesh: null,
  };

  const partsList = [];
  function registerPart(mesh, category = 'Chassis', description = '') {
    if (!mesh) return;
    partsList.push({
      name: mesh.name,
      category,
      description,
      mesh,
    });
  }

  // -------------------------------------------------------------------------
  // 1. Die-Cast Aluminum Base Pan & Neoprene Leveling Feet
  // -------------------------------------------------------------------------
  const meterGroup = new THREE.Group();
  meterGroup.name = 'Body_MeterChassisAssembly';
  root.add(meterGroup);

  const CHASSIS_W = 1.90; // 190 mm
  const CHASSIS_D = 2.35; // 235 mm
  const PAN_H = 0.06;

  // Bottom aluminum base pan plate
  const basePan = box(CHASSIS_W, PAN_H, CHASSIS_D, matSSBrushed);
  basePan.name = 'Body_BaseChassisPan';
  basePan.position.set(0, 0.06 + PAN_H / 2, 0);
  meterGroup.add(basePan);
  registerPart(basePan, 'Chassis', 'Rigid die-cast aluminum base pan with grounding boss and PCB standoffs');

  // 4 Neoprene leveling vibration-damping feet resting squarely on datum Y = 0
  const footOffsetX = CHASSIS_W / 2 - 0.22;
  const footOffsetZ = CHASSIS_D / 2 - 0.25;
  [
    [-footOffsetX, -footOffsetZ, 'Foot_Leveling_FrontLeft'],
    [ footOffsetX, -footOffsetZ, 'Foot_Leveling_FrontRight'],
    [-footOffsetX,  footOffsetZ, 'Foot_Leveling_RearLeft'],
    [ footOffsetX,  footOffsetZ, 'Foot_Leveling_RearRight'],
  ].forEach(([fx, fz, fName]) => {
    const foot = createVibrationFoot(0.06, 0.08, 0.06);
    foot.name = fName;
    foot.position.set(fx, 0, fz);
    meterGroup.add(foot);
    registerPart(foot, 'Chassis', 'Vibration-damping neoprene leveling foot seated on laboratory bench datum');
  });

  // -------------------------------------------------------------------------
  // 2. Internal Electronics Bay & Faraday Electrometer Shielding
  // -------------------------------------------------------------------------
  const elecGroup = new THREE.Group();
  elecGroup.name = 'Body_InternalElectronicsBay';
  elecGroup.position.set(0, 0.12, 0);
  meterGroup.add(elecGroup);

  // FR4 High-Density Motherboard PCB
  const pcbW = CHASSIS_W - 0.25;
  const pcbD = CHASSIS_D - 0.40;
  const pcbMesh = box(pcbW, 0.03, pcbD, matPCB);
  pcbMesh.name = 'PCB_Mainboard';
  pcbMesh.position.set(0, 0.03, 0.05);
  elecGroup.add(pcbMesh);
  registerPart(pcbMesh, 'Electronics', 'FR4 multi-layer system motherboard with ARM Cortex-M4 MCU and precision power rails');

  // 4 Brass PCB Hex Standoffs
  for (const sx of [-pcbW / 2 + 0.15, pcbW / 2 - 0.15]) {
    for (const sz of [-pcbD / 2 + 0.15, pcbD / 2 - 0.15]) {
      const so = cyl(0.03, 0.03, 0.06, matBrass, 6);
      so.position.set(sx, 0.0, sz + 0.05);
      elecGroup.add(so);
    }
  }

  // Solid Nickel-Plated Brass Faraday Electrometer Shielding Can
  // Houses ultra-high impedance electrometer amplifier (10^12 ohms) and 24-bit ADC
  const shieldW = 0.65;
  const shieldH = 0.16;
  const shieldD = 0.70;
  const faradayCan = box(shieldW, shieldH, shieldD, matFaradayShield);
  faradayCan.name = 'Shield_Electrometer_Faraday';
  faradayCan.position.set(-pcbW / 2 + shieldW / 2 + 0.12, 0.03 + shieldH / 2, pcbD / 2 - shieldD / 2 - 0.05);
  elecGroup.add(faradayCan);
  registerPart(faradayCan, 'Electronics', 'Nickel-plated brass RF Faraday shield isolating 10^12-ohm electrometer and 24-bit ADC');

  // ARM Cortex-M4 Microcontroller IC
  const mcu = box(0.25, 0.035, 0.25, matICBlack);
  mcu.name = 'IC_MCU_ARM';
  mcu.position.set(0.15, 0.05, -0.10);
  elecGroup.add(mcu);

  // Piezo Audio Sounder
  const buzzer = cyl(0.12, 0.12, 0.08, matICBlack, 16);
  buzzer.name = 'Audio_PiezoBuzzer';
  buzzer.position.set(0.45, 0.07, 0.25);
  elecGroup.add(buzzer);

  // Internal Display Ribbon Cable
  const ribbonMesh = box(0.40, 0.015, 0.60, matRibbonGray);
  ribbonMesh.name = 'Cable_Ribbon_Display';
  ribbonMesh.position.set(0, 0.18, -0.30);
  ribbonMesh.rotation.x = -0.32;
  elecGroup.add(ribbonMesh);

  // Internal White Inspection Point Light
  const intLight = new THREE.PointLight(0xffffff, 1.2, 3.5);
  intLight.position.set(0, 0.45, 0);
  elecGroup.add(intLight);

  // -------------------------------------------------------------------------
  // 3. Precision Sculpted Unibody Top Housing (Body_Chassis)
  // -------------------------------------------------------------------------
  // Elevates +0.90 in exploded view to expose interior electronics
  const chassisCover = new THREE.Group();
  chassisCover.name = 'Body_Chassis';
  meterGroup.add(chassisCover);
  refs.chassisCover = chassisCover;

  // Sloped wedge profile: front lip H=0.18, rear wall H=0.62, 18.5° slope
  const slopeAngle = 0.323; // ~18.5 degrees
  const dFront = -CHASSIS_D / 2;
  const dBack  =  CHASSIS_D / 2;
  const hFront = 0.20;
  const hBack  = 0.64;

  const shape = new THREE.Shape();
  shape.moveTo(dFront, 0.08);
  shape.lineTo(dBack, 0.08);
  shape.lineTo(dBack, hBack);
  shape.lineTo(dFront + 0.15, hFront + 0.03);
  shape.lineTo(dFront, hFront - 0.05);
  shape.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: CHASSIS_W,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 4,
  };
  const bodyGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  bodyGeo.center();

  const bodyMesh = new THREE.Mesh(bodyGeo, matWhiteChassis);
  bodyMesh.name = 'Body_ChassisShell';
  bodyMesh.rotation.y = -Math.PI / 2;
  bodyMesh.position.set(0, (hBack + 0.08) / 2, 0);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  chassisCover.add(bodyMesh);
  registerPart(chassisCover, 'Chassis', 'Precision impact-resistant polymer enclosure casting with sloped 18.5° console deck');

  // Recessed Bezel Pocket Frame (Body_Bezel)
  const bezelW = 1.58;
  const bezelD = 1.15;
  const bezelY = 0.505;
  const bezelZ = -0.06;

  const bezelGroup = new THREE.Group();
  bezelGroup.name = 'Body_BezelGroup';
  bezelGroup.position.set(0, bezelY, bezelZ);
  bezelGroup.rotation.x = -slopeAngle;
  chassisCover.add(bezelGroup);

  // Flush Bezel Backing Plate
  const bezelPlate = box(bezelW, 0.025, bezelD, matDarkBezel);
  bezelPlate.name = 'Body_Bezel';
  bezelGroup.add(bezelPlate);
  registerPart(bezelPlate, 'Display', 'Recessed matte-dark display bezel frame with capacitive touch membrane integration');

  // Thin perimeter metallic trim around glass
  const bezelTrim = box(bezelW - 0.04, 0.028, bezelD - 0.04, matBezelTrim);
  bezelTrim.position.set(0, 0.002, 0);
  bezelGroup.add(bezelTrim);

  // Dedicated Dynamic Canvas LCD Quad (UI_LCD)
  // Seated proudly with positive clearance facing the operator
  const lcdW = 1.40;
  const lcdH = 0.72;
  const lcdGeo = new THREE.PlaneGeometry(lcdW, lcdH);
  lcdGeo.rotateX(-Math.PI / 2);
  const lcdUv = lcdGeo.attributes.uv;
  for (let i = 0; i < lcdUv.count; i++) {
    lcdUv.setX(i, 1.0 - lcdUv.getX(i));
  }
  lcdUv.needsUpdate = true;

  const lcdMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.FrontSide,
  });
  const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.name = 'UI_LCD';
  // With bezelGroup rotated by -slopeAngle, plane sits flush on bezel facing the operator
  lcdMesh.position.set(0, 0.016, 0.12);
  bezelGroup.add(lcdMesh);
  refs.lcdMesh = lcdMesh;
  registerPart(lcdMesh, 'Display', '7.0" high-contrast active-matrix dynamic touchscreen LCD quad (UI_LCD)');

  // Anti-Reflective Optical Glass Protective Lens
  const glassLens = box(lcdW + 0.04, 0.008, lcdH + 0.04, matGlassClear);
  glassLens.name = 'Glass_ScreenLens';
  glassLens.position.set(0, 0.022, 0.12);
  bezelGroup.add(glassLens);
  registerPart(glassLens, 'Display', 'Toughened chemically-strengthened glass front lens with anti-fingerprint coating');

  // Capacitive Touch Membrane Buttons on Lower Bezel Deck (-Z relative to bezel center)
  const buttonConfigs = [
    { id: 'Btn_Read',  label: 'READ',  x: -0.52, color: 0x2563eb },
    { id: 'Btn_Cal',   label: 'CAL',   x: -0.26, color: 0x059669 },
    { id: 'Btn_Mode',  label: 'MODE',  x:  0.00, color: 0x475569 },
    { id: 'Btn_Setup', label: 'SETUP', x:  0.26, color: 0x475569 },
    { id: 'Btn_Hold',  label: 'HOLD',  x:  0.52, color: 0xd97706 },
  ];

  buttonConfigs.forEach((btn) => {
    const btnMat = M(btn.color, { r: 0.35, m: 0.15 });
    const btnMesh = box(0.20, 0.016, 0.14, btnMat);
    btnMesh.name = btn.id;
    btnMesh.position.set(btn.x, 0.016, -0.36);
    bezelGroup.add(btnMesh);
    registerPart(btnMesh, 'Controls', `Capacitive tactile membrane key: ${btn.label}`);
  });

  // Power Rocker Switch on Right Flank
  const btnPower = box(0.045, 0.12, 0.18, M(0x22c55e, { e: 0x16a34a, ei: 0.6 }));
  btnPower.name = 'Btn_Power';
  btnPower.position.set(CHASSIS_W / 2 + 0.02, 0.35, 0.40);
  chassisCover.add(btnPower);
  registerPart(btnPower, 'Controls', 'Primary DC power toggle rocker switch on right chassis wall');

  // Brand Nameplate Badge SREdesigns on Front Lip (DIAG-001 & DIAG-015)
  const badgePlate = box(0.70, 0.012, 0.14, matSSBrushed);
  badgePlate.name = 'Badge_SREdesigns';
  badgePlate.position.set(0, 0.28, -CHASSIS_D / 2 + 0.22);
  badgePlate.rotation.x = -slopeAngle;
  chassisCover.add(badgePlate);

  // High-DPI procedural silkscreen faceplate for badge
  const badgeCanvas = document.createElement('canvas');
  badgeCanvas.width = 512;
  badgeCanvas.height = 128;
  const bCtx = badgeCanvas.getContext('2d');
  bCtx.fillStyle = '#0f172a';
  bCtx.fillRect(0, 0, 512, 128);
  bCtx.strokeStyle = '#f59e0b';
  bCtx.lineWidth = 6;
  bCtx.strokeRect(6, 6, 500, 116);
  bCtx.strokeStyle = '#06b6d4';
  bCtx.lineWidth = 2;
  bCtx.strokeRect(14, 14, 484, 100);
  bCtx.fillStyle = '#f8fafc';
  bCtx.font = 'bold 44px -apple-system, sans-serif';
  bCtx.textAlign = 'center';
  bCtx.textBaseline = 'middle';
  bCtx.fillText('SREdesigns', 256, 52);
  bCtx.fillStyle = '#38bdf8';
  bCtx.font = '600 20px monospace';
  bCtx.fillText('PH-7000 PRO', 256, 92);

  const badgeTex = new THREE.CanvasTexture(badgeCanvas);
  badgeTex.flipY = false;

  const badgeFaceGeo = new THREE.PlaneGeometry(0.66, 0.12);
  badgeFaceGeo.rotateX(-Math.PI / 2);
  const bUv = badgeFaceGeo.attributes.uv;
  for (let i = 0; i < bUv.count; i++) {
    bUv.setX(i, 1.0 - bUv.getX(i));
  }
  bUv.needsUpdate = true;

  const badgeFaceMesh = new THREE.Mesh(badgeFaceGeo, new THREE.MeshBasicMaterial({ map: badgeTex }));
  badgeFaceMesh.position.set(0, 0.007, 0);
  badgePlate.add(badgeFaceMesh);
  registerPart(badgePlate, 'Badge', 'SREdesigns official certified digital twin brand badge');

  // -------------------------------------------------------------------------
  // 4. Flush Rear Panel I/O Bulkhead & Industrial Connectors
  // -------------------------------------------------------------------------
  const rearZ = CHASSIS_D / 2 - 0.01;
  const rearY = 0.38;

  const rearPlate = box(CHASSIS_W - 0.30, 0.30, 0.02, matZincCast);
  rearPlate.name = 'Plate_RearIO_Bulkhead';
  rearPlate.position.set(0, rearY, rearZ);
  meterGroup.add(rearPlate);
  registerPart(rearPlate, 'Electrical', 'Machined aluminum rear I/O connector bulkhead plate');

  // MIL-STD-348 BNC Coaxial Female Jack for pH Electrode
  const bncGroup = createBNCJack();
  bncGroup.name = 'Fastener_BNCJack';
  bncGroup.position.set(-0.48, rearY, rearZ + 0.01);
  bncGroup.rotation.y = 0;
  meterGroup.add(bncGroup);
  registerPart(bncGroup, 'Electrical', 'Teflon-insulated gold-pin 50-ohm BNC female coaxial electrode connector');

  // Mini-DIN ATC PT1000 Temperature Jack
  const atcPort = cyl(0.04, 0.04, 0.06, matSSBrushed, 16);
  atcPort.name = 'Fastener_ATCPort';
  atcPort.rotation.x = -Math.PI / 2;
  atcPort.position.set(-0.16, rearY, rearZ + 0.02);
  meterGroup.add(atcPort);
  registerPart(atcPort, 'Electrical', 'Circular 4-pin mini-DIN connector for PT1000 temperature compensation sensor');

  // DB-9 Female RS-232 Serial Port
  const db9 = createDB9Port();
  db9.name = 'Fastener_DB9Port';
  db9.position.set(0.24, rearY, rearZ + 0.01);
  db9.rotation.y = 0;
  meterGroup.add(db9);
  registerPart(db9, 'Electrical', 'DB-9 female RS-232 serial GLP printer / LIMS telemetry communication port');

  // Coaxial 12V DC Power Barrel Jack
  const dcJack = cyl(0.045, 0.045, 0.06, matRubber, 16);
  dcJack.name = 'Fastener_DCPort';
  dcJack.rotation.x = -Math.PI / 2;
  dcJack.position.set(0.58, rearY, rearZ + 0.02);
  meterGroup.add(dcJack);
  registerPart(dcJack, 'Electrical', '2.1mm center-positive 12V DC power input barrel jack');

  // -------------------------------------------------------------------------
  // 5. Heavy-Duty Dual-Pantograph Articulated Electrode Stand Assembly
  // -------------------------------------------------------------------------
  const standGroup = new THREE.Group();
  standGroup.name = 'Body_StandAssembly';
  standGroup.position.set(1.55, 0, 0.20);
  root.add(standGroup);

  // Heavy Die-Cast Zinc Stand Base (3-point rubber pads resting on datum Y = 0)
  const standBaseGeo = new THREE.CylinderGeometry(0.55, 0.60, 0.14, 36);
  const standBase = new THREE.Mesh(standBaseGeo, matZincCast);
  standBase.name = 'Body_StandBase';
  standBase.position.y = 0.07;
  standBase.castShadow = true;
  standBase.receiveShadow = true;
  standGroup.add(standBase);
  registerPart(standBase, 'Stand', 'Heavy 1.8 kg die-cast zinc anti-tip electrode stand base plate');

  for (let i = 0; i < 3; i++) {
    const ang = (i * Math.PI * 2) / 3;
    const pad = cyl(0.065, 0.065, 0.025, matRubber, 16);
    pad.name = `Foot_StandPad_${i + 1}`;
    pad.position.set(Math.cos(ang) * 0.45, 0.012, Math.sin(ang) * 0.45);
    standGroup.add(pad);
  }

  // Vertical Stainless Steel Mast Column
  const mastH = 2.60;
  const mast = cyl(0.065, 0.065, mastH, matSSBrushed, 24);
  mast.name = 'Body_StandMast';
  mast.position.y = 0.14 + mastH / 2;
  standGroup.add(mast);
  registerPart(mast, 'Stand', 'Precision-ground stainless steel vertical support column');

  // Swivel Collar (Pivot_ArmBase)
  const armBase = new THREE.Group();
  armBase.name = 'Pivot_ArmBase';
  armBase.position.set(0, 1.35, 0);
  standGroup.add(armBase);
  refs.armBase = armBase;

  const collarMesh = cyl(0.095, 0.095, 0.22, matZincCast, 24);
  collarMesh.name = 'Body_CollarMesh';
  armBase.add(collarMesh);

  // Knurled Collar Lock Thumbscrew
  const thumbScrew = cyl(0.05, 0.05, 0.14, matSSPolished, 16);
  thumbScrew.name = 'Knob_MastClamp';
  thumbScrew.rotation.z = Math.PI / 2;
  thumbScrew.position.set(0.12, 0, 0);
  armBase.add(thumbScrew);

  // Molded Cable Clip on Mast Collar
  const clipMast = box(0.03, 0.05, 0.04, matDarkBezel);
  clipMast.name = 'Fastener_CableClip_Mast';
  clipMast.position.set(-0.11, 0, 0);
  armBase.add(clipMast);

  // Lower Articulated Parallel Arm Links
  const armLower = new THREE.Group();
  armLower.name = 'Pivot_ArmLower';
  armLower.position.set(0, 0.06, 0);
  armBase.add(armLower);
  refs.armLower = armLower;

  const linkLen = 1.40;
  for (const xOff of [-0.045, 0.045]) {
    const rod = cyl(0.022, 0.022, linkLen, matSSPolished, 16);
    rod.name = `Body_LowerRod_${xOff > 0 ? 'R' : 'L'}`;
    rod.position.set(xOff, linkLen / 2, 0);
    armLower.add(rod);
  }

  // Counterbalance Tension Spring
  const spring = cyl(0.028, 0.028, linkLen * 0.72, matZincCast, 16);
  spring.name = 'Body_TensionSpring';
  spring.position.set(0, linkLen * 0.45, 0.025);
  armLower.add(spring);

  // Molded Cable Clip on Lower Arm
  const clipLower = box(0.025, 0.04, 0.03, matDarkBezel);
  clipLower.name = 'Fastener_CableClip_Lower';
  clipLower.position.set(0.055, linkLen * 0.55, 0);
  armLower.add(clipLower);

  // Center Knuckle Elbow
  const armElbow = new THREE.Group();
  armElbow.name = 'Pivot_ArmElbow';
  armElbow.position.set(0, linkLen, 0);
  armLower.add(armElbow);

  const knuckleMesh = box(0.15, 0.11, 0.11, matZincCast);
  knuckleMesh.name = 'Body_KnuckleMesh';
  armElbow.add(knuckleMesh);

  // Upper Parallel Arm Links
  const armUpper = new THREE.Group();
  armUpper.name = 'Pivot_ArmUpper';
  armElbow.add(armUpper);
  refs.armUpper = armUpper;

  const upperLen = 1.35;
  for (const xOff of [-0.045, 0.045]) {
    const rod = cyl(0.020, 0.020, upperLen, matSSPolished, 16);
    rod.name = `Body_UpperRod_${xOff > 0 ? 'R' : 'L'}`;
    rod.position.set(xOff, upperLen / 2, 0);
    armUpper.add(rod);
  }

  // Molded Cable Clip on Upper Arm
  const clipUpper = box(0.025, 0.04, 0.03, matDarkBezel);
  clipUpper.name = 'Fastener_CableClip_Upper';
  clipUpper.position.set(0.055, upperLen * 0.50, 0);
  armUpper.add(clipUpper);

  // Multi-Electrode Clamping Head Holder
  const holderHead = new THREE.Group();
  holderHead.name = 'Pivot_HolderHead';
  holderHead.position.set(0, upperLen, 0);
  armUpper.add(holderHead);
  refs.holderHead = holderHead;

  const headBlock = box(0.42, 0.09, 0.24, matDarkBezel);
  headBlock.name = 'Body_HeadBlock';
  holderHead.add(headBlock);
  registerPart(headBlock, 'Stand', 'Multi-position electrode clamping block accommodating pH probe, ATC, and stirrer');

  // -------------------------------------------------------------------------
  // 6. Sealed Glass Combination pH Electrode Assembly
  // -------------------------------------------------------------------------
  const electrodeGroup = new THREE.Group();
  electrodeGroup.name = 'Body_ElectrodeAssembly';
  electrodeGroup.position.set(-0.10, -0.05, 0);
  holderHead.add(electrodeGroup);

  // Molded Rubber Electrode Boot
  const boot = cyl(0.042, 0.052, 0.18, matRubber, 20);
  boot.name = 'Body_ElectrodeBoot';
  boot.position.y = 0.09;
  electrodeGroup.add(boot);

  // Cylindrical Borosilicate Glass Stem
  const stemLen = 1.20;
  const glassStem = cyl(0.045, 0.045, stemLen, matGlassClear, 24);
  glassStem.name = 'Glass_ElectrodeStem';
  glassStem.position.y = -stemLen / 2;
  electrodeGroup.add(glassStem);
  registerPart(glassStem, 'Sensor', 'Heavy-wall borosilicate glass combination pH electrode shaft with KCl fill hole');

  // Internal 3M KCl Gel Electrolyte Column
  const gelCore = cyl(0.036, 0.036, stemLen * 0.92, matElectrolyte, 16);
  gelCore.name = 'Body_ElectrolyteGel';
  gelCore.position.y = -stemLen * 0.48;
  electrodeGroup.add(gelCore);

  // Internal Ag/AgCl Reference Wire (Pure silver with silver chloride coating)
  const refWire = cyl(0.006, 0.006, stemLen * 0.85, matAgWire, 8);
  refWire.name = 'Body_RefWire';
  refWire.position.y = -stemLen * 0.46;
  electrodeGroup.add(refWire);

  // Fragile Spherical Sensing Glass Bulb
  const bulbGeo = new THREE.SphereGeometry(0.055, 24, 24);
  const glassBulb = new THREE.Mesh(bulbGeo, matGlassClear);
  glassBulb.name = 'Glass_PHBulb';
  glassBulb.position.y = -stemLen - 0.02;
  electrodeGroup.add(glassBulb);
  registerPart(glassBulb, 'Sensor', 'Hydrated lithium-doped glass sensing bulb responsive to hydrogen ion activity');

  // Removable Wetting Storage Solution Cap (3M KCl)
  const capGroup = new THREE.Group();
  capGroup.name = 'Body_StorageCap';
  capGroup.position.y = -stemLen - 0.04;
  electrodeGroup.add(capGroup);
  refs.storageCap = capGroup;

  const capBottle = cyl(0.068, 0.068, 0.24, matElectrolyte, 20);
  capBottle.name = 'Body_StorageVial';
  capGroup.add(capBottle);

  const capCollar = cyl(0.075, 0.075, 0.06, matRubber, 20);
  capCollar.name = 'Body_StorageCollar';
  capCollar.position.y = 0.10;
  capGroup.add(capCollar);
  registerPart(capGroup, 'Sensor', 'Sealing wetting storage cap filled with 3M KCl electrolyte to preserve bulb hydration');

  // -------------------------------------------------------------------------
  // 7. Stainless Steel ATC Temperature Compensation Probe
  // -------------------------------------------------------------------------
  const atcGroup = new THREE.Group();
  atcGroup.name = 'Body_ATCProbeAssembly';
  atcGroup.position.set(0.10, -0.05, 0);
  holderHead.add(atcGroup);

  const atcBoot = cyl(0.038, 0.046, 0.15, matRubber, 16);
  atcBoot.name = 'Body_ATCBoot';
  atcBoot.position.y = 0.075;
  atcGroup.add(atcBoot);

  const atcStem = cyl(0.028, 0.028, 1.15, matSSPolished, 20);
  atcStem.name = 'Body_ATCProbe';
  atcStem.position.y = -0.575;
  atcGroup.add(atcStem);

  const atcTip = cyl(0.028, 0.014, 0.09, matZincCast, 16);
  atcTip.name = 'Body_ATCTip';
  atcTip.position.y = -1.19;
  atcGroup.add(atcTip);
  registerPart(atcGroup, 'Sensor', 'Stainless steel Class A PT1000 automatic temperature compensation probe');

  // -------------------------------------------------------------------------
  // 8. Continuous Physical Coaxial Cable & ATC Cable System
  // -------------------------------------------------------------------------
  // Attached directly to root with dynamic point recalculation
  const cableGroup = new THREE.Group();
  cableGroup.name = 'Body_CableHarnessAssembly';
  root.add(cableGroup);

  // Machined Chrome BNC Male Twist Plug at Rear Panel
  const bncPlug = cyl(0.07, 0.07, 0.14, matSSPolished, 16);
  bncPlug.name = 'Connector_BNCMale_Plug';
  bncPlug.rotation.x = Math.PI / 2;
  bncPlug.position.set(-0.48, rearY, rearZ + 0.08);
  cableGroup.add(bncPlug);

  // ATC Mini-DIN Plug at Rear Panel
  const atcPlug = cyl(0.05, 0.05, 0.10, matDarkBezel, 16);
  atcPlug.name = 'Connector_ATCMini_Plug';
  atcPlug.rotation.x = Math.PI / 2;
  atcPlug.position.set(-0.16, rearY, rearZ + 0.08);
  cableGroup.add(atcPlug);

  function createCoaxCableGeometry() {
    // Dynamic Spline routing from electrode head down pantograph arm to rear BNC
    const pBoot = new THREE.Vector3();
    boot.getWorldPosition(pBoot);
    root.worldToLocal(pBoot);

    const pUpperClip = new THREE.Vector3();
    clipUpper.getWorldPosition(pUpperClip);
    root.worldToLocal(pUpperClip);

    const pElbow = new THREE.Vector3();
    armElbow.getWorldPosition(pElbow);
    root.worldToLocal(pElbow);

    const pLowerClip = new THREE.Vector3();
    clipLower.getWorldPosition(pLowerClip);
    root.worldToLocal(pLowerClip);

    const pMastClip = new THREE.Vector3();
    clipMast.getWorldPosition(pMastClip);
    root.worldToLocal(pMastClip);

    const pBNC = new THREE.Vector3(-0.48, rearY, rearZ + 0.15);

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(pBoot.x, pBoot.y + 0.10, pBoot.z),
      new THREE.Vector3(pBoot.x + 0.08, pBoot.y + 0.25, pBoot.z + 0.05),
      new THREE.Vector3(pUpperClip.x, pUpperClip.y, pUpperClip.z + 0.02),
      new THREE.Vector3(pElbow.x + 0.12, pElbow.y + 0.05, pElbow.z + 0.06),
      new THREE.Vector3(pLowerClip.x, pLowerClip.y, pLowerClip.z + 0.02),
      new THREE.Vector3(pMastClip.x - 0.04, pMastClip.y - 0.08, pMastClip.z + 0.08),
      new THREE.Vector3(0.60, 0.08, 0.80),
      new THREE.Vector3(0.00, 0.12, 1.35),
      new THREE.Vector3(-0.35, 0.25, 1.40),
      pBNC,
    ]);
    return new THREE.TubeGeometry(curve, 36, 0.016, 8, false);
  }

  const coaxCableMesh = new THREE.Mesh(createCoaxCableGeometry(), matCable);
  coaxCableMesh.name = 'Body_ElectrodeCoaxCable';
  coaxCableMesh.castShadow = true;
  cableGroup.add(coaxCableMesh);
  refs.coaxCable = coaxCableMesh;
  registerPart(coaxCableMesh, 'Electrical', 'Low-noise shielded coaxial electrode cable routed along articulated pantograph links');

  // ATC Cable
  function createATCCableGeometry() {
    const pAtcBoot = new THREE.Vector3();
    atcBoot.getWorldPosition(pAtcBoot);
    root.worldToLocal(pAtcBoot);

    const pUpperClip = new THREE.Vector3();
    clipUpper.getWorldPosition(pUpperClip);
    root.worldToLocal(pUpperClip);

    const pLowerClip = new THREE.Vector3();
    clipLower.getWorldPosition(pLowerClip);
    root.worldToLocal(pLowerClip);

    const pAtcPort = new THREE.Vector3(-0.16, rearY, rearZ + 0.15);

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(pAtcBoot.x, pAtcBoot.y + 0.10, pAtcBoot.z),
      new THREE.Vector3(pUpperClip.x + 0.02, pUpperClip.y, pUpperClip.z - 0.02),
      new THREE.Vector3(pLowerClip.x + 0.02, pLowerClip.y, pLowerClip.z - 0.02),
      new THREE.Vector3(0.50, 0.06, 0.75),
      new THREE.Vector3(-0.05, 0.10, 1.25),
      pAtcPort,
    ]);
    return new THREE.TubeGeometry(curve, 28, 0.012, 8, false);
  }

  const atcCableMesh = new THREE.Mesh(createATCCableGeometry(), matCable);
  atcCableMesh.name = 'Body_ATCCable';
  cableGroup.add(atcCableMesh);
  refs.atcCable = atcCableMesh;

  function updateCables() {
    if (refs.coaxCable) {
      refs.coaxCable.geometry.dispose();
      refs.coaxCable.geometry = createCoaxCableGeometry();
    }
    if (refs.atcCable) {
      refs.atcCable.geometry.dispose();
      refs.atcCable.geometry = createATCCableGeometry();
    }
  }

  // -------------------------------------------------------------------------
  // 9. 150 mL Borosilicate Beaker & Reaction Solution Station
  // -------------------------------------------------------------------------
  const beakerGroup = new THREE.Group();
  beakerGroup.name = 'Body_BeakerStation';
  beakerGroup.position.set(1.45, 0, -1.05);
  root.add(beakerGroup);

  const beakerH = 1.05;
  const beakerR = 0.44;

  const beakerMesh = cyl(beakerR, beakerR * 0.94, beakerH, matGlassClear, 32);
  beakerMesh.name = 'Glass_Beaker';
  beakerMesh.position.y = beakerH / 2;
  beakerGroup.add(beakerMesh);
  refs.beakerMesh = beakerMesh;
  registerPart(beakerMesh, 'Glassware', '150 mL Griffin low-form borosilicate glass beaker with graduation markings');

  // Solution Liquid Meniscus
  const liquidMat = M(0xfef08a, { r: 0.15, m: 0.05, o: 0.70, side: THREE.DoubleSide });
  const liquidMesh = cyl(beakerR * 0.92, beakerR * 0.88, beakerH * 0.65, liquidMat, 32);
  liquidMesh.name = 'Glass_SolutionLiquid';
  liquidMesh.position.y = (beakerH * 0.65) / 2 + 0.02;
  beakerGroup.add(liquidMesh);
  refs.liquidMesh = liquidMesh;

  // Beaker Graduations Ring
  const gradMesh = cyl(beakerR * 0.96, beakerR * 0.96, 0.012, M(0xffffff, { r: 0.8 }), 32);
  gradMesh.name = 'Body_BeakerGrads';
  gradMesh.position.y = beakerH * 0.52;
  beakerGroup.add(gradMesh);

  // -------------------------------------------------------------------------
  // 10. Calibration Buffer Bottles & Polyethylene Wash Bottle
  // -------------------------------------------------------------------------
  const bottleConfigs = [
    { name: 'Body_BufferBottle_4',  color: matBottleRed, x: 2.35, z: -1.45, label: 'pH 4.01' },
    { name: 'Body_BufferBottle_7',  color: matBottleYel, x: 2.35, z: -0.95, label: 'pH 7.00' },
    { name: 'Body_BufferBottle_10', color: matBottleBlu, x: 2.35, z: -0.45, label: 'pH 10.01' },
  ];

  bottleConfigs.forEach((b) => {
    const bGroup = new THREE.Group();
    bGroup.name = b.name;
    bGroup.position.set(b.x, 0, b.z);
    root.add(bGroup);

    const bBody = cyl(0.22, 0.22, 0.70, M(0x1e293b, { r: 0.40 }), 24);
    bBody.name = `${b.name}_Vial`;
    bBody.position.y = 0.35;
    bGroup.add(bBody);

    const bCap = cyl(0.13, 0.13, 0.11, b.color, 24);
    bCap.name = `${b.name}_Cap`;
    bCap.position.y = 0.75;
    bGroup.add(bCap);

    const bLabel = box(0.20, 0.28, 0.01, M(0xf8fafc, { r: 0.3 }));
    bLabel.position.set(0, 0.35, -0.225);
    bGroup.add(bLabel);
    registerPart(bGroup, 'Consumables', `Standard calibration buffer solution bottle: ${b.label}`);
  });

  // Polyethylene Wash Bottle with Curved Siphon Dispensing Spout
  const washGroup = new THREE.Group();
  washGroup.name = 'Body_WashBottle';
  washGroup.position.set(2.35, 0, 0.35);
  root.add(washGroup);

  const washBody = cyl(0.26, 0.24, 0.85, matWashBottle, 24);
  washBody.name = 'Body_WashVial';
  washBody.position.y = 0.425;
  washGroup.add(washBody);

  const washCap = cyl(0.15, 0.15, 0.12, M(0x0284c7, { r: 0.30 }), 24);
  washCap.name = 'Body_WashCap';
  washCap.position.y = 0.91;
  washGroup.add(washCap);

  const nozzleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.96, 0),
    new THREE.Vector3(0, 1.30, 0),
    new THREE.Vector3(-0.16, 1.25, 0),
    new THREE.Vector3(-0.28, 0.98, 0),
  ]);
  const nozzle = new THREE.Mesh(new THREE.TubeGeometry(nozzleCurve, 16, 0.022, 8, false), M(0x0284c7));
  nozzle.name = 'Body_WashNozzle';
  washGroup.add(nozzle);
  registerPart(washGroup, 'Consumables', '500 mL low-density polyethylene wash bottle filled with deionized water');

  // -------------------------------------------------------------------------
  // 11. Laboratory Bench Receptacle Box & Physical Circuit Continuity (DIAG-014)
  // -------------------------------------------------------------------------
  const powerGroup = new THREE.Group();
  powerGroup.name = 'Body_PowerContinuity';
  root.add(powerGroup);

  // Duplex Outlet Pedestal Box Seated on Bench Surface
  const outletBox = box(0.36, 0.48, 0.28, matZincCast);
  outletBox.name = 'Power_Receptacle_Duplex';
  outletBox.position.set(BENCH.outlet.x, 0.24, BENCH.outlet.z);
  powerGroup.add(outletBox);
  registerPart(outletBox, 'Electrical', 'Laboratory bench duplex electrical receptacle box (120V/20A NEMA 5-15R)');

  // Faceplate
  const outPlate = box(0.34, 0.46, 0.02, matSSPolished);
  outPlate.position.set(BENCH.outlet.x, 0.24, BENCH.outlet.z - 0.15);
  powerGroup.add(outPlate);

  // Dual NEMA 5-15R Receptacles
  for (const yOut of [0.33, 0.15]) {
    const recFace = cyl(0.10, 0.10, 0.02, matRubber, 24);
    recFace.rotation.x = Math.PI / 2;
    recFace.position.set(BENCH.outlet.x, yOut, BENCH.outlet.z - 0.16);
    powerGroup.add(recFace);
  }

  // Molded 3-Prong NEMA 5-15P AC Plug
  const plugGroup = new THREE.Group();
  plugGroup.name = 'Power_Plug_NEMA';
  plugGroup.position.set(BENCH.outlet.x, 0.33, BENCH.outlet.z - 0.18 - 0.15);

  const plugBody = box(0.20, 0.24, 0.26, matRubber);
  plugGroup.add(plugBody);

  const gndPin = cyl(0.014, 0.014, 0.18, matBrass, 12);
  gndPin.rotation.x = Math.PI / 2;
  gndPin.position.set(0, 0.045, 0.13);
  plugGroup.add(gndPin);

  const bladeL = box(0.016, 0.065, 0.15, matBrass);
  bladeL.position.set(-0.045, -0.015, 0.13);
  plugGroup.add(bladeL);

  const bladeR = box(0.014, 0.055, 0.15, matBrass);
  bladeR.position.set(0.045, -0.015, 0.13);
  plugGroup.add(bladeR);

  powerGroup.add(plugGroup);
  refs.powerPlug = plugGroup;
  registerPart(plugGroup, 'Electrical', 'Molded 3-prong NEMA 5-15P laboratory power plug inserted into bench receptacle');

  // 12V DC Desktop Power Supply Adapter Brick
  const psuBrick = box(0.35, 0.18, 0.70, matDarkBezel);
  psuBrick.name = 'Body_PowerAdapter_Brick';
  psuBrick.position.set(1.60, 0.09, 1.80);
  powerGroup.add(psuBrick);

  // Green LED on PSU
  const psuLed = cyl(0.02, 0.02, 0.01, M(0x22c55e, { e: 0x22c55e, ei: 1.0 }), 12);
  psuLed.position.set(1.60, 0.185, 1.65);
  powerGroup.add(psuLed);

  // AC Line Cord (Plug to PSU)
  const acLineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(BENCH.outlet.x, 0.33, BENCH.outlet.z - 0.40),
    new THREE.Vector3(BENCH.outlet.x, 0.05, BENCH.outlet.z - 0.60),
    new THREE.Vector3(1.60, 0.05, 2.15),
  ]);
  const acLineMesh = new THREE.Mesh(new THREE.TubeGeometry(acLineCurve, 16, 0.018, 8, false), matCable);
  powerGroup.add(acLineMesh);

  // DC Cable (PSU to Meter rear DC barrel jack)
  const dcLineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.60, 0.05, 1.45),
    new THREE.Vector3(1.20, 0.05, 1.45),
    new THREE.Vector3(0.58, rearY, rearZ + 0.12),
  ]);
  const dcLineMesh = new THREE.Mesh(new THREE.TubeGeometry(dcLineCurve, 16, 0.012, 8, false), matCable);
  powerGroup.add(dcLineMesh);

  // -------------------------------------------------------------------------
  // Kinematics & Animations API
  // -------------------------------------------------------------------------
  function setArmPosition(immersionRatio) {
    if (!refs.armLower || !refs.armUpper || !refs.holderHead) return;
    const t = THREE.MathUtils.clamp(immersionRatio, 0.0, 1.0);
    const angleLower = THREE.MathUtils.lerp(0.35, -0.45, t);
    refs.armLower.rotation.z = angleLower;

    const angleUpper = THREE.MathUtils.lerp(-0.70, 0.90, t);
    refs.armUpper.rotation.z = angleUpper;

    refs.holderHead.rotation.z = -(angleLower + angleUpper);
    updateCables();
  }

  function setArmSwivel(angleRad) {
    if (!refs.armBase) return;
    refs.armBase.rotation.y = angleRad;
    updateCables();
  }

  function setStorageCapMounted(mounted) {
    if (!refs.storageCap) return;
    refs.storageCap.visible = !!mounted;
  }

  function setSolutionColor(colorHex, opacity = 0.70) {
    if (!refs.liquidMesh) return;
    refs.liquidMesh.material.color.set(colorHex);
    refs.liquidMesh.material.opacity = opacity;
  }

  function setLcdTexture(texture) {
    if (!refs.lcdMesh) return;
    texture.flipY = false;
    refs.lcdMesh.material.map = texture;
    refs.lcdMesh.material.needsUpdate = true;
  }

  function setWireframe(enabled) {
    root.traverse((child) => {
      if (child.isMesh && child.material && child.name !== 'UI_LCD') {
        child.material.wireframe = !!enabled;
      }
    });
  }

  function setExplodeAmount(amount) {
    const factor = THREE.MathUtils.clamp(amount, 0, 1);
    // Unibody chassis lifts up +0.90 to reveal motherboard & Faraday shield
    if (refs.chassisCover) {
      refs.chassisCover.position.y = 0.90 * factor;
    }
    // Stand slides laterally
    standGroup.position.x = 1.55 + 0.85 * factor;
    // Beaker slides forwards
    beakerGroup.position.z = -1.05 - 0.60 * factor;

    updateCables();
  }

  function focusPart(partName) {
    let target = null;
    root.traverse((node) => {
      if (node.name === partName) target = node;
    });
    if (!target) return null;

    root.traverse((node) => {
      if (node.isMesh && node.material && node.name !== 'UI_LCD') {
        const isTarget = node === target || node.parent === target;
        node.material.wireframe = !isTarget;
        node.material.opacity = isTarget ? 1.0 : 0.25;
        node.material.transparent = !isTarget;
      }
    });

    const box3 = new THREE.Box3().setFromObject(target);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box3.getCenter(center);
    box3.getSize(size);
    return { center, size, name: partName };
  }

  function clearFocus() {
    root.traverse((node) => {
      if (node.isMesh && node.material && node.name !== 'UI_LCD') {
        node.material.wireframe = false;
        node.material.opacity = 1.0;
        node.material.transparent = false;
      }
    });
  }

  function setPluggedIn(plugged) {
    if (!refs.powerPlug) return;
    if (plugged) {
      refs.powerPlug.position.set(BENCH.outlet.x, 0.33, BENCH.outlet.z - 0.18 - 0.15);
    } else {
      refs.powerPlug.position.set(BENCH.outlet.x, 0.33, BENCH.outlet.z - 0.85);
    }
  }

  // Initialize initial realistic arm pose
  setArmPosition(0.85);

  const modelApi = {
    root,
    refs,
    partsList,
    setArmPosition,
    setArmSwivel,
    setStorageCapMounted,
    setSolutionColor,
    setLcdTexture,
    setWireframe,
    setExplodeAmount,
    setPluggedIn,
    focusPart,
    clearFocus,
    updateCables,
  };

  currentModelInstance = modelApi;
  return modelApi;
}

let currentModelInstance = null;

export function setArmPosition(ratio) {
  if (currentModelInstance) currentModelInstance.setArmPosition(ratio);
}
export function setArmSwivel(rad) {
  if (currentModelInstance) currentModelInstance.setArmSwivel(rad);
}
export function setStorageCapMounted(mounted) {
  if (currentModelInstance) currentModelInstance.setStorageCapMounted(mounted);
}
export function setSolutionColor(col, op) {
  if (currentModelInstance) currentModelInstance.setSolutionColor(col, op);
}
export function setLcdTexture(tex) {
  if (currentModelInstance) currentModelInstance.setLcdTexture(tex);
}
export function setWireframe(wf) {
  if (currentModelInstance) currentModelInstance.setWireframe(wf);
}
export function setExplodeAmount(amt) {
  if (currentModelInstance) currentModelInstance.setExplodeAmount(amt);
}
export function setPluggedIn(plugged) {
  if (currentModelInstance) currentModelInstance.setPluggedIn(plugged);
}
export function focusPart(name) {
  if (currentModelInstance) return currentModelInstance.focusPart(name);
  return null;
}
export function clearFocus() {
  if (currentModelInstance) currentModelInstance.clearFocus();
}

// ---------------------------------------------------------------------------
// Standalone Photorealistic Laboratory Room Environment
// ---------------------------------------------------------------------------
export function buildLabRoom(root) {
  const room = new THREE.Group();
  room.name = 'Body_LaboratoryRoom';

  const benchY = BENCH.surfaceY;
  const matCountertop = M(0x11161d, { r: 0.22, m: 0.15 });

  // Solid Epoxy Resin Countertop Slab
  const countertop = box(BENCH.sx, 0.08, BENCH.sz, matCountertop);
  countertop.name = 'Body_Countertop';
  countertop.position.set(0, benchY - 0.04, 0);
  room.add(countertop);

  // Perimeter trims
  const trimW = 0.03;
  const trimT = 0.08;
  const trimY = benchY - 0.04;

  const edgeF = box(BENCH.sx + trimW * 2, trimT, trimW, matSSBrushed);
  edgeF.name = 'Body_CounterEdgeF';
  edgeF.position.set(0, trimY, -BENCH.sz / 2 - trimW / 2);
  room.add(edgeF);

  const edgeB = box(BENCH.sx + trimW * 2, trimT, trimW, matSSBrushed);
  edgeB.name = 'Body_CounterEdgeB';
  edgeB.position.set(0, trimY, BENCH.sz / 2 + trimW / 2);
  room.add(edgeB);

  // Base Cabinet
  const matCabinet = M(0x283446, { r: 0.45, m: 0.08 });
  const cabinet = box(BENCH.sx - 0.4, benchY - 0.08, BENCH.sz - 0.4, matCabinet);
  cabinet.name = 'Body_Cabinet';
  cabinet.position.set(0, (benchY - 0.08) / 2, 0);
  room.add(cabinet);

  // Floor
  const matFloor = M(0x0f172a, { r: 0.65, m: 0.05 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), matFloor);
  floor.name = 'Body_Floor';
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  room.add(floor);

  // Backsplash Wall
  const matWall = M(0x526070, { r: 0.80, m: 0.02 });
  const wallH = 14.0;
  const wallD = 0.20;
  const wallW = 36.0;
  const wallZ = BENCH.sz / 2 + wallD / 2 + 0.02;
  const wall = box(wallW, wallH, wallD, matWall);
  wall.name = 'Body_Wall';
  wall.position.set(0, wallH / 2, wallZ);
  wall.receiveShadow = true;
  room.add(wall);

  root.add(room);
  return { surfaceY: benchY };
}
