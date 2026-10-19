/**
 * SREdesigns PH-7000 Pro — Procedural Three.js 3D Twin Architecture
 * 
 * Gold-Tier Procedural Laboratory Twin adhering to Semantic Part Taxonomy:
 * - Precision sloped ergonomic chassis casting (Body_Chassis) with carved recessed bezel pocket
 * - Dedicated dynamic high-DPI CanvasTexture LCD quad (UI_LCD) with upright UV mapping (UV-02)
 * - Protective optical borosilicate glass lens (Glass_ScreenLens) with anti-reflective coating
 * - Tactile membrane key switches with polished chrome bezels (Btn_Read, Btn_Cal, Btn_Mode, Btn_Setup, Btn_Hold)
 * - Heavy die-cast zinc stand base (Body_StandBase) seated at datum Y = 0 with knurled lock collar
 * - Counterbalanced dual-pantograph articulated arm (Pivot_ArmBase, Pivot_ArmLower, Pivot_ArmUpper, Pivot_HolderHead)
 * - True vertical lowering kinematics with probe submerged into beaker solution
 * - Sealed glass combination pH electrode (Glass_ElectrodeStem, Glass_PHBulb, Body_RefWire, Body_ElectrolyteGel)
 * - PT1000 stainless steel ATC temperature probe (Body_ATCProbeAssembly)
 * - Removable 3M KCl wetting storage solution cap (Body_StorageCap)
 * - Continuous flexible coaxial electrode cable with molded strain reliefs & BNC connector (Body_ElectrodeCoaxCable)
 * - ATC probe cable securely routed alongside coaxial cable into rear ATC port (Body_ATCCable)
 * - Internal Electronics Bay: FR4 motherboard (PCB_Motherboard), 32-bit ARM Cortex-M4 MCU (Part_MCU_STM32),
 *   ISSI SDRAM chip (Part_RAM_Chip), SPI NAND flash drive (Part_SSD_Module), internal power supply (Assembly_PowerSupply),
 *   cooling blower fan (Fan_CabinetCooling_Blower), and Faraday shield (Shield_Electrometer_Faraday)
 * - Flush rear I/O plate (Plate_RearIO_Bulkhead) with Port_BNC_pH, Port_ATC_Temp, Port_RS232, Port_USB, Port_IEC
 * - Bench duplex receptacle pedestal (Power_Receptacle_Duplex) with NEMA 5-15P plug (Power_Plug_NEMA),
 *   heavy-duty SJTOW power cord (Power_Cord_SJTOW), and 12V PSU brick (Body_PowerAdapter_Brick)
 * - 150 mL borosilicate glass beaker (Glass_Beaker) with volume graduations (Body_BeakerGrads),
 *   fire-polished lip, and physical aqueous liquid with curved meniscus (Glass_SolutionLiquid)
 * - 3 standard calibration buffer bottles (Body_BufferBottle_4, Body_BufferBottle_7, Body_BufferBottle_10) with visible liquid
 * - Polyethylene wash bottle with curved dispensing nozzle (Body_WashBottle)
 * - Official SREdesigns Brand Certification Badge (Badge_SREdesigns)
 * - Genuine 3D fasteners (createHexSocketScrew) and leveling feet (Foot_Leveling_*) resting at datum Y = 0
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
  createDecalQuad,
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

// Laboratory Materials Palette
const matWhiteChassis   = M(0xf1f5f9, { r: 0.28, m: 0.12 });
const matDarkBezel     = M(0x0f172a, { r: 0.40, m: 0.18 });
const matBezelTrim     = M(0x334155, { r: 0.35, m: 0.70 });
const matSSPolished    = M(0xe2e8f0, { r: 0.08, m: 0.96, side: THREE.DoubleSide });
const matSSBrushed     = M(0xc4cbd4, { r: 0.25, m: 0.88, side: THREE.DoubleSide });
const matZincCast      = M(0x272c35, { r: 0.60, m: 0.45 });
const matBrass         = M(0xd4af37, { r: 0.25, m: 0.85 });
const matRubber        = M(0x111317, { r: 0.92, m: 0.05 });
const matCable         = M(0x181a1f, { r: 0.75, m: 0.05 });
const matPCB           = M(0x14532d, { r: 0.35, m: 0.20 }); // Deep green FR-4
const matFaradayShield = M(0xd1d5db, { r: 0.18, m: 0.94 }); // Nickel-plated brass can
const matICBlack       = M(0x0a0d14, { r: 0.65, m: 0.15 });
const matRibbonGray    = M(0x94a3b8, { r: 0.60, m: 0.05, side: THREE.DoubleSide });
const matAgWire        = M(0xf1f5f9, { r: 0.15, m: 0.98 }); // Pure silver wire
const matCeramicFrit   = M(0xffffff, { r: 0.85, m: 0.02 }); // Porous ceramic diaphragm

// Optical Borosilicate Glass 3.3 (MeshPhysicalMaterial with physical transmission & IOR = 1.52)
const matBoroGlass = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.35,
  roughness: 0.02,
  metalness: 0.08,
  ior: 1.52, // Authentic borosilicate glass 3.3
  specularIntensity: 1.0,
  specularColor: 0xffffff,
  clearcoat: 1.0,
  clearcoatRoughness: 0.01,
  depthWrite: false,
  side: THREE.DoubleSide,
});

// Aqueous Solution Liquid (MeshPhysicalMaterial with water IOR = 1.333 & realistic meniscus)
const matSolutionLiquid = new THREE.MeshPhysicalMaterial({
  color: 0x10b981, // Default neutral emerald green
  transparent: true,
  opacity: 0.88,
  roughness: 0.03,
  metalness: 0.02,
  ior: 1.333, // Pure water / aqueous buffer
  specularIntensity: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.01,
  depthWrite: false,
  side: THREE.DoubleSide,
});

// Translucent 3M KCl Reference Electrolyte Gel
const matElectrolyteGel = new THREE.MeshPhysicalMaterial({
  color: 0x38bdf8,
  transmission: 0.82,
  opacity: 0.90,
  transparent: true,
  roughness: 0.04,
  metalness: 0.0,
  ior: 1.34,
  thickness: 0.08,
  depthWrite: false,
  side: THREE.DoubleSide,
});

// Translucent Laboratory HDPE Bottle Plastic
const matHDPEPlastic = (color = 0xf8fafc) => new THREE.MeshPhysicalMaterial({
  color,
  transmission: 0.68,
  opacity: 0.92,
  transparent: true,
  roughness: 0.24,
  metalness: 0.02,
  ior: 1.51,
  thickness: 1.2,
  depthWrite: false,
  side: THREE.DoubleSide,
});

// Frosted LDPE Wash Bottle Plastic
const matWashBottle = new THREE.MeshPhysicalMaterial({
  color: 0xf1f5f9,
  transmission: 0.72,
  opacity: 0.90,
  transparent: true,
  roughness: 0.28,
  metalness: 0.02,
  ior: 1.51,
  thickness: 1.4,
  depthWrite: false,
  side: THREE.DoubleSide,
});

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
      z: 2.40,
    };
  },
};

// ---------------------------------------------------------------------------
// Standard Camera Viewpoint Presets
// ---------------------------------------------------------------------------
export const CAM_ISO = {
  position: new THREE.Vector3(2.80, BENCH.surfaceY + 2.40, -4.20),
  target: new THREE.Vector3(0.65, BENCH.surfaceY + 0.85, -0.40),
};

export const CAM_FRONT = {
  position: new THREE.Vector3(0.00, BENCH.surfaceY + 1.80, -3.80),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 0.55, -0.20),
};

export const CAM_SIDE = {
  position: new THREE.Vector3(4.80, BENCH.surfaceY + 1.60, -0.60),
  target: new THREE.Vector3(1.10, BENCH.surfaceY + 0.70, -0.60),
};

export const CAM_TOP = {
  position: new THREE.Vector3(0.60, BENCH.surfaceY + 5.20, -0.40),
  target: new THREE.Vector3(0.60, BENCH.surfaceY, -0.40),
};

export const CAM_EXPLODED = {
  position: new THREE.Vector3(3.40, BENCH.surfaceY + 3.60, -4.60),
  target: new THREE.Vector3(0.40, BENCH.surfaceY + 1.00, -0.20),
};

export const CAM_CONSOLE = {
  position: new THREE.Vector3(0.00, BENCH.surfaceY + 1.60, -1.85),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 0.40, -0.10),
};

export const PH_METER_CAMERAS = {
  CAM_ISO: { pos: [2.80, BENCH.surfaceY + 2.40, -4.20], target: [0.65, BENCH.surfaceY + 0.85, -0.40], fov: 38 },
  CAM_FRONT: { pos: [0.00, BENCH.surfaceY + 1.80, -3.80], target: [0.00, BENCH.surfaceY + 0.55, -0.20], fov: 38 },
  CAM_SIDE: { pos: [4.80, BENCH.surfaceY + 1.60, -0.60], target: [1.10, BENCH.surfaceY + 0.70, -0.60], fov: 38 },
  CAM_TOP: { pos: [0.60, BENCH.surfaceY + 5.20, -0.40], target: [0.60, BENCH.surfaceY, -0.40], fov: 42 },
  CAM_EXPLODED: { pos: [3.40, BENCH.surfaceY + 3.60, -4.60], target: [0.40, BENCH.surfaceY + 1.00, -0.20], fov: 44 },
  CAM_CONSOLE: { pos: [0.00, BENCH.surfaceY + 1.60, -1.85], target: [0.00, BENCH.surfaceY + 0.40, -0.10], fov: 32 },
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
    armElbow: null,
    armUpper: null,
    holderHead: null,
    electrodeGroup: null,
    storageCap: null,
    liquidMesh: null,
    powerPlug: null,
    powerCord: null,
    coaxCable: null,
    atcCable: null,
    chassisCover: null,
    beakerMesh: null,
    buttonMeshes: new Map(),
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
  const CHASSIS_D = 2.40; // 240 mm
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

  // Base pan M3 socket head cap screws (Genuine 3D Fasteners)
  [
    [-CHASSIS_W / 2 + 0.12, -CHASSIS_D / 2 + 0.15, 'Fastener_HexM3_01'],
    [ CHASSIS_W / 2 - 0.12, -CHASSIS_D / 2 + 0.15, 'Fastener_HexM3_02'],
    [-CHASSIS_W / 2 + 0.12,  CHASSIS_D / 2 - 0.15, 'Fastener_HexM3_03'],
    [ CHASSIS_W / 2 - 0.12,  CHASSIS_D / 2 - 0.15, 'Fastener_HexM3_04'],
  ].forEach(([sx, sz, sName]) => {
    const screw = createHexSocketScrew(0.015, 0.06);
    screw.name = sName;
    screw.position.set(sx, 0.06, sz);
    meterGroup.add(screw);
  });

  // -------------------------------------------------------------------------
  // 2. Internal Electronics Bay & Faraday Electrometer Shielding
  // -------------------------------------------------------------------------
  const elecGroup = new THREE.Group();
  elecGroup.name = 'Body_InternalElectronicsBay';
  elecGroup.position.set(0, 0.12, 0);
  meterGroup.add(elecGroup);

  // FR4 High-Density Motherboard PCB (BAY-01: PCB_Motherboard)
  const pcbW = CHASSIS_W - 0.25;
  const pcbD = CHASSIS_D - 0.40;
  const pcbMesh = box(pcbW, 0.03, pcbD, matPCB);
  pcbMesh.name = 'PCB_Motherboard';
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
  // Houses ultra-high impedance electrometer amplifier (>10^12 ohms) and 24-bit delta-sigma ADC
  const shieldW = 0.65;
  const shieldH = 0.16;
  const shieldD = 0.70;
  const faradayCan = box(shieldW, shieldH, shieldD, matFaradayShield);
  faradayCan.name = 'Shield_Electrometer_Faraday';
  faradayCan.position.set(-pcbW / 2 + shieldW / 2 + 0.12, 0.03 + shieldH / 2, pcbD / 2 - shieldD / 2 - 0.05);
  elecGroup.add(faradayCan);
  registerPart(faradayCan, 'Electronics', 'Nickel-plated brass RF Faraday shield isolating 10^12-ohm electrometer and 24-bit ADC');

  // 32-bit ARM Cortex-M4 Microcontroller IC (BAY-02: Part_MCU_STM32)
  const mcu = box(0.24, 0.035, 0.24, matICBlack);
  mcu.name = 'Part_MCU_STM32';
  mcu.position.set(0.15, 0.05, -0.10);
  elecGroup.add(mcu);
  registerPart(mcu, 'Electronics', 'STM32F407 32-bit ARM Cortex-M4 MCU running digital signal filtering & calibration engine');

  // RAM IC Memory (BAY-03: Part_RAM_Chip)
  const ramChip = box(0.12, 0.025, 0.22, matICBlack);
  ramChip.name = 'Part_RAM_Chip';
  ramChip.position.set(0.42, 0.045, -0.10);
  elecGroup.add(ramChip);
  registerPart(ramChip, 'Electronics', '32 MB high-speed SDRAM buffer chip for multi-point titration curves');

  // Solid-State Flash Storage Drive (BAY-03: Part_SSD_Module)
  const ssdModule = box(0.14, 0.025, 0.16, matICBlack);
  ssdModule.name = 'Part_SSD_Module';
  ssdModule.position.set(0.42, 0.045, 0.18);
  elecGroup.add(ssdModule);
  registerPart(ssdModule, 'Electronics', '128 MB non-volatile SPI NAND flash memory storing GLP method logs & cal history');

  // Internal Power Supply DC-DC Section (BAY-04: Assembly_PowerSupply)
  const psuGroup = new THREE.Group();
  psuGroup.name = 'Assembly_PowerSupply';
  psuGroup.position.set(-0.35, 0.045, -pcbD / 2 + 0.35);
  elecGroup.add(psuGroup);

  const psuChoke = cyl(0.07, 0.07, 0.08, matICBlack, 16);
  psuChoke.name = 'Part_ToroidalTransformer';
  psuGroup.add(psuChoke);

  const cap1 = cyl(0.045, 0.045, 0.12, matFaradayShield, 16);
  cap1.position.set(0.12, 0.02, 0);
  psuGroup.add(cap1);

  const cap2 = cyl(0.045, 0.045, 0.12, matFaradayShield, 16);
  cap2.position.set(0.12, 0.02, 0.11);
  psuGroup.add(cap2);
  registerPart(psuGroup, 'Electronics', 'Internal isolated ultra-low-noise linear DC-DC power regulation sub-assembly');

  // Forced Convection Cooling Blower Fan (BAY-05: Fan_CabinetCooling_Blower)
  const fanGroup = new THREE.Group();
  fanGroup.name = 'Fan_CabinetCooling_Blower';
  fanGroup.position.set(pcbW / 2 - 0.22, 0.08, pcbD / 2 - 0.22);
  elecGroup.add(fanGroup);

  const fanBody = box(0.32, 0.08, 0.32, matDarkBezel);
  fanGroup.add(fanBody);

  const fanHub = cyl(0.06, 0.06, 0.085, matZincCast, 16);
  fanGroup.add(fanHub);

  // Wire Finger Guard Grille
  const guardRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 8, 24), matSSPolished);
  guardRing.rotation.x = Math.PI / 2;
  guardRing.position.y = 0.045;
  fanGroup.add(guardRing);
  registerPart(fanGroup, 'Electronics', 'High-reliability forced-convection cooling blower fan with steel finger guard grille');

  // Piezo Audio Sounder
  const buzzer = cyl(0.10, 0.10, 0.08, matICBlack, 16);
  buzzer.name = 'Audio_PiezoBuzzer';
  buzzer.position.set(0.15, 0.07, 0.28);
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
  const chassisCover = new THREE.Group();
  chassisCover.name = 'Body_Chassis';
  meterGroup.add(chassisCover);
  refs.chassisCover = chassisCover;

  // Sloped wedge profile: front lip H=0.20, rear wall H=0.64, 18.5° slope
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
  const bezelW = 1.62;
  const bezelD = 1.20;
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

  // Dedicated Dynamic Canvas LCD Quad (UI_LCD) (TAX-02 & UV-02)
  const lcdW = 1.42;
  const lcdH = 0.74;
  const lcdMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.FrontSide,
  });
  // Inside bezelGroup: local normal is (0, 1, 0), up is (0, 0, 1) towards top of console
  const lcdMesh = createDecalQuad(lcdW, lcdH, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), lcdMat);
  lcdMesh.name = 'UI_LCD';
  lcdMesh.position.set(0, 0.016, 0.12);
  lcdMesh.renderOrder = 1;
  bezelGroup.add(lcdMesh);
  refs.lcdMesh = lcdMesh;
  registerPart(lcdMesh, 'Display', '7.0" high-contrast active-matrix dynamic touchscreen LCD quad (UI_LCD)');

  // Anti-Reflective Optical Glass Protective Bezel Lens (Glass_ScreenLens)
  const matScreenLens = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.08,
    metalness: 0.1,
    transparent: true,
    opacity: 0.04,
    depthWrite: false,
    side: THREE.FrontSide,
  });
  const glassLens = createDecalQuad(lcdW + 0.04, lcdH + 0.04, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), matScreenLens);
  glassLens.name = 'Glass_ScreenLens';
  glassLens.position.set(0, 0.019, 0.12);
  glassLens.renderOrder = 2;
  bezelGroup.add(glassLens);
  registerPart(glassLens, 'Display', 'Toughened chemically-strengthened optical borosilicate glass lens (IOR = 1.52)');

  // -------------------------------------------------------------------------
  // High-End Tactile Membrane Keys with Polished Chrome Bezels (TAX-03 & UV-03)
  // -------------------------------------------------------------------------
  function createKeycapMesh(id, label, icon, accentColor, xPos) {
    const keyGroup = new THREE.Group();
    keyGroup.name = id;
    keyGroup.position.set(xPos, 0.016, -0.38);

    const kw = 0.24;
    const kh = 0.17;
    const kd = 0.024;

    // 1. Polished Chrome Outer Bezel Trim
    const chromeBezel = box(kw + 0.024, kd + 0.004, kh + 0.024, matSSPolished);
    chromeBezel.position.set(0, kd / 2, 0);
    keyGroup.add(chromeBezel);

    // 2. Beveled Dark Keycap Body
    const capBody = box(kw, kd, kh, matDarkBezel);
    capBody.position.set(0, kd / 2 + 0.002, 0);
    keyGroup.add(capBody);

    // 3. High-DPI Procedural Vector Silkscreen Face Quad
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');

    // Dark slate background with ergonomic gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 192);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 192);

    // Subtle inner accent border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 244, 180);

    // Accent indicator pill on top edge
    ctx.fillStyle = accentColor;
    ctx.fillRect(80, 14, 96, 8);

    // Vector Icon
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 52px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, 128, 80);

    // Bold Silkscreen Text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 32px -apple-system, sans-serif';
    ctx.fillText(label, 128, 145);

    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;

    const faceMat = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.FrontSide,
    });
    // Inside bezelGroup: local normal is (0, 1, 0), up is (0, 0, 1) towards top of console
    const faceMesh = createDecalQuad(kw - 0.012, kh - 0.012, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), faceMat);
    faceMesh.position.set(0, kd + 0.005, 0);
    keyGroup.add(faceMesh);

    keyGroup.userData = {
      id,
      label,
      capBody,
      faceMesh,
      depressAmount: 0.008,
      isDepressed: false,
    };

    return keyGroup;
  }

  const buttonConfigs = [
    { id: 'Btn_Read',  label: 'READ',  icon: '▶', color: '#38bdf8', x: -0.52 },
    { id: 'Btn_Cal',   label: 'CAL',   icon: '⚗', color: '#10b981', x: -0.26 },
    { id: 'Btn_Mode',  label: 'MODE',  icon: '⇄', color: '#818cf8', x:  0.00 },
    { id: 'Btn_Setup', label: 'SETUP', icon: '⚙', color: '#94a3b8', x:  0.26 },
    { id: 'Btn_Hold',  label: 'HOLD',  icon: '⏸', color: '#f59e0b', x:  0.52 },
  ];

  buttonConfigs.forEach((btn) => {
    const keyMesh = createKeycapMesh(btn.id, btn.label, btn.icon, btn.color, btn.x);
    bezelGroup.add(keyMesh);
    refs.buttonMeshes.set(btn.id, keyMesh);
    registerPart(keyMesh, 'Controls', `Tactile beveled membrane key with chrome bezel: ${btn.label}`);
  });

  // Master DC Power Rocker Switch on Right Flank
  const btnPower = box(0.045, 0.12, 0.18, M(0x22c55e, { e: 0x16a34a, ei: 0.6 }));
  btnPower.name = 'Btn_Power';
  btnPower.position.set(CHASSIS_W / 2 + 0.02, 0.35, 0.40);
  chassisCover.add(btnPower);
  registerPart(btnPower, 'Controls', 'Primary DC power toggle rocker switch on right chassis wall');

  // Brand Nameplate Badge SREdesigns on Lower Right Front Apron (TAX-06 & DIAG-015)
  const badgePlate = makeSREdesignsBadge(0.56, 0.16);
  badgePlate.position.set(CHASSIS_W / 2 - 0.42, 0.28, -CHASSIS_D / 2 + 0.20);
  badgePlate.rotation.x = -slopeAngle;
  chassisCover.add(badgePlate);
  registerPart(badgePlate, 'Badge', 'SREdesigns official certified digital twin brand badge');

  // -------------------------------------------------------------------------
  // 4. Flush Rear Panel I/O Bulkhead & Industrial Connectors (BAY-06)
  // -------------------------------------------------------------------------
  const rearZ = CHASSIS_D / 2 - 0.01;
  const rearY = 0.38;

  const rearPlate = box(CHASSIS_W - 0.30, 0.30, 0.02, matZincCast);
  rearPlate.name = 'Plate_RearIO_Bulkhead';
  rearPlate.position.set(0, rearY, rearZ);
  meterGroup.add(rearPlate);
  registerPart(rearPlate, 'Electrical', 'Machined aluminum rear I/O connector bulkhead plate');

  // MIL-STD-348 BNC Coaxial Female Jack for pH Electrode (Port_BNC_pH)
  const bncGroup = createBNCJack();
  bncGroup.name = 'Port_BNC_pH';
  bncGroup.position.set(-0.48, rearY, rearZ + 0.01);
  meterGroup.add(bncGroup);
  registerPart(bncGroup, 'Electrical', 'Teflon-insulated gold-pin 50-ohm BNC female coaxial electrode connector (Port_BNC_pH)');

  // Mini-DIN ATC PT1000 Temperature Jack (Port_ATC_Temp)
  const atcPort = cyl(0.045, 0.045, 0.06, matSSBrushed, 16);
  atcPort.name = 'Port_ATC_Temp';
  atcPort.rotation.x = -Math.PI / 2;
  atcPort.position.set(-0.16, rearY, rearZ + 0.02);
  meterGroup.add(atcPort);
  registerPart(atcPort, 'Electrical', 'Circular 4-pin mini-DIN connector for PT1000 temperature compensation sensor (Port_ATC_Temp)');

  // DB-9 Female RS-232 Serial Port (Port_RS232)
  const db9 = createDB9Port();
  db9.name = 'Port_RS232';
  db9.position.set(0.22, rearY, rearZ + 0.01);
  meterGroup.add(db9);
  registerPart(db9, 'Electrical', 'DB-9 female RS-232 serial GLP printer / LIMS telemetry communication port (Port_RS232)');

  // Dual USB-A & USB-B Bulkhead Receptacle (Port_USB)
  const usbGroup = new THREE.Group();
  usbGroup.name = 'Port_USB';
  usbGroup.position.set(0.48, rearY, rearZ + 0.015);
  const usbHousing = box(0.12, 0.16, 0.04, matSSPolished);
  usbGroup.add(usbHousing);
  const usbCut1 = box(0.08, 0.03, 0.045, matDarkBezel);
  usbCut1.position.set(0, 0.04, 0.002);
  usbGroup.add(usbCut1);
  const usbCut2 = box(0.08, 0.03, 0.045, matDarkBezel);
  usbCut2.position.set(0, -0.04, 0.002);
  usbGroup.add(usbCut2);
  meterGroup.add(usbGroup);
  registerPart(usbGroup, 'Electrical', 'Dual stacked USB-A communication and flash drive telemetry ports (Port_USB)');

  // Coaxial 12V DC Locking Power Barrel Jack (Port_IEC)
  const dcJack = cyl(0.045, 0.045, 0.06, matRubber, 16);
  dcJack.name = 'Port_IEC';
  dcJack.rotation.x = -Math.PI / 2;
  dcJack.position.set(0.68, rearY, rearZ + 0.02);
  meterGroup.add(dcJack);
  registerPart(dcJack, 'Electrical', 'Locking 2.1mm center-positive 12V DC power input receptacle (Port_IEC)');

  // -------------------------------------------------------------------------
  // 5. Heavy-Duty Articulated Electrode Stand Assembly & Kinematics
  // -------------------------------------------------------------------------
  // Anchored rigidly at X = 1.35, Z = -0.25 (aligned directly behind beaker at X = 1.35, Z = -0.90)
  const STAND_X = 1.35;
  const STAND_Z = -0.25;

  const standGroup = new THREE.Group();
  standGroup.name = 'Body_StandAssembly';
  standGroup.position.set(STAND_X, 0, STAND_Z);
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
  const mastH = 3.00;
  const mast = cyl(0.065, 0.065, mastH, matSSBrushed, 24);
  mast.name = 'Body_StandMast';
  mast.position.y = 0.14 + mastH / 2;
  standGroup.add(mast);
  registerPart(mast, 'Stand', 'Precision-ground stainless steel vertical support column');

  // Swivel Collar (Pivot_ArmBase)
  const armBase = new THREE.Group();
  armBase.name = 'Pivot_ArmBase';
  armBase.position.set(0, 0.90, 0);
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

  // Lower Articulated Parallel Arm Links (Pivot_ArmLower)
  // Articulates forward towards -Z (directly towards the beaker)
  const armLower = new THREE.Group();
  armLower.name = 'Pivot_ArmLower';
  armLower.position.set(0, 0.06, 0);
  armBase.add(armLower);
  refs.armLower = armLower;

  const linkLen = 0.70;
  for (const xOff of [-0.045, 0.045]) {
    const rod = cyl(0.022, 0.022, linkLen, matSSPolished, 16);
    rod.name = `Body_LowerRod_${xOff > 0 ? 'R' : 'L'}`;
    // Link extends in local +Y
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

  // Center Knuckle Elbow (Pivot_ArmElbow)
  const armElbow = new THREE.Group();
  armElbow.name = 'Pivot_ArmElbow';
  armElbow.position.set(0, linkLen, 0);
  armLower.add(armElbow);
  refs.armElbow = armElbow;

  const knuckleMesh = box(0.15, 0.11, 0.11, matZincCast);
  knuckleMesh.name = 'Body_KnuckleMesh';
  armElbow.add(knuckleMesh);

  // Upper Parallel Arm Links (Pivot_ArmUpper)
  const armUpper = new THREE.Group();
  armUpper.name = 'Pivot_ArmUpper';
  armElbow.add(armUpper);
  refs.armUpper = armUpper;

  const upperLen = 0.70;
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

  // Multi-Electrode Clamping Head Holder (Pivot_HolderHead)
  const holderHead = new THREE.Group();
  holderHead.name = 'Pivot_HolderHead';
  holderHead.position.set(0, upperLen, 0);
  armUpper.add(holderHead);
  refs.holderHead = holderHead;

  const headBlock = box(0.42, 0.10, 0.24, matDarkBezel);
  headBlock.name = 'Body_HeadBlock';
  holderHead.add(headBlock);
  registerPart(headBlock, 'Stand', 'Multi-position electrode clamping block accommodating pH probe, ATC, and stirrer');

  // -------------------------------------------------------------------------
  // 6. Sealed Glass Combination pH Electrode Assembly & ATC Sensor
  // -------------------------------------------------------------------------
  const electrodeGroup = new THREE.Group();
  electrodeGroup.name = 'Body_ElectrodeAssembly';
  electrodeGroup.position.set(-0.08, -0.05, 0);
  holderHead.add(electrodeGroup);
  refs.electrodeGroup = electrodeGroup;

  // Molded Rubber Electrode Boot
  const boot = cyl(0.042, 0.052, 0.18, matRubber, 20);
  boot.name = 'Body_ElectrodeBoot';
  boot.position.y = 0.09;
  electrodeGroup.add(boot);

  // Cylindrical Borosilicate Glass Stem (Glass_ElectrodeStem)
  const stemLen = 1.20;
  const glassStem = cyl(0.045, 0.045, stemLen, matBoroGlass, 24);
  glassStem.name = 'Glass_ElectrodeStem';
  glassStem.position.y = -stemLen / 2;
  electrodeGroup.add(glassStem);
  registerPart(glassStem, 'Sensor', 'Heavy-wall borosilicate glass combination pH electrode shaft with KCl fill hole (Glass_ElectrodeStem)');

  // Internal 3M KCl Gel Electrolyte Column (Body_ElectrolyteGel)
  const gelCore = cyl(0.036, 0.036, stemLen * 0.92, matElectrolyteGel, 16);
  gelCore.name = 'Body_ElectrolyteGel';
  gelCore.position.y = -stemLen * 0.48;
  electrodeGroup.add(gelCore);

  // Internal Ag/AgCl Reference Wire (Body_RefWire)
  const refWire = cyl(0.006, 0.006, stemLen * 0.85, matAgWire, 8);
  refWire.name = 'Body_RefWire';
  refWire.position.y = -stemLen * 0.46;
  electrodeGroup.add(refWire);

  // Porous Ceramic Reference Diaphragm Frit (Body_CeramicDiaphragm)
  const frit = cyl(0.010, 0.010, 0.02, matCeramicFrit, 12);
  frit.name = 'Body_CeramicDiaphragm';
  frit.rotation.z = Math.PI / 2;
  frit.position.set(0.042, -stemLen + 0.08, 0);
  electrodeGroup.add(frit);

  // Thin Lithium-Doped Glass Sensing Membrane Bulb (Glass_PHBulb)
  const bulbGeo = new THREE.SphereGeometry(0.055, 24, 24);
  const glassBulb = new THREE.Mesh(bulbGeo, matBoroGlass);
  glassBulb.name = 'Glass_PHBulb';
  glassBulb.position.y = -stemLen - 0.02;
  electrodeGroup.add(glassBulb);
  registerPart(glassBulb, 'Sensor', 'Hydrated lithium-doped glass sensing bulb responsive to hydrogen ion activity (Glass_PHBulb)');

  // Removable Wetting Storage Solution Cap (3M KCl) (Body_StorageCap)
  const capGroup = new THREE.Group();
  capGroup.name = 'Body_StorageCap';
  capGroup.position.y = -stemLen - 0.04;
  electrodeGroup.add(capGroup);
  refs.storageCap = capGroup;
  capGroup.visible = false; // Initially removed in beaker station

  const capBottle = cyl(0.068, 0.068, 0.24, matHDPEPlastic(0xbae6fd), 20);
  capBottle.name = 'Body_StorageVial';
  capGroup.add(capBottle);

  const capCollar = cyl(0.075, 0.075, 0.06, matRubber, 20);
  capCollar.name = 'Body_StorageCollar';
  capCollar.position.y = 0.10;
  capGroup.add(capCollar);
  registerPart(capGroup, 'Sensor', 'Sealing wetting storage cap filled with 3M KCl electrolyte to preserve bulb hydration (Body_StorageCap)');

  // Stainless Steel ATC Temperature Compensation Probe (Body_ATCProbeAssembly)
  const atcGroup = new THREE.Group();
  atcGroup.name = 'Body_ATCProbeAssembly';
  atcGroup.position.set(0.08, -0.05, 0);
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
  registerPart(atcGroup, 'Sensor', 'Stainless steel Class A PT1000 automatic temperature compensation probe (Body_ATCProbeAssembly)');

  // -------------------------------------------------------------------------
  // 7. Continuous Flexible Coaxial Cable & ATC Cable System
  // -------------------------------------------------------------------------
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
      new THREE.Vector3(pBoot.x + 0.08, pBoot.y + 0.22, pBoot.z + 0.05),
      new THREE.Vector3(pUpperClip.x, pUpperClip.y, pUpperClip.z + 0.02),
      new THREE.Vector3(pElbow.x + 0.08, pElbow.y + 0.04, pElbow.z + 0.04),
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
  registerPart(coaxCableMesh, 'Electrical', 'Low-noise shielded coaxial electrode cable routed along articulated pantograph links (Body_ElectrodeCoaxCable)');

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
  // 8. 150 mL Borosilicate Glass Beaker & Physical Liquid Meniscus
  // -------------------------------------------------------------------------
  // Positioned squarely at X = 1.35, Z = -0.90 (directly beneath electrode lowering arc)
  const BEAKER_X = 1.35;
  const BEAKER_Z = -0.90;

  const beakerGroup = new THREE.Group();
  beakerGroup.name = 'Body_BeakerStation';
  beakerGroup.position.set(BEAKER_X, 0, BEAKER_Z);
  root.add(beakerGroup);

  const beakerH = 0.88;
  const beakerR = 0.31; // 62 mm OD
  const wallT = 0.018;  // 1.8 mm wall thickness
  const baseT = 0.032;  // 3.2 mm reinforced base
  const rIn = beakerR - wallT;

  // 150 mL Griffin Borosilicate Glass Beaker (Glass_Beaker) - Genuine Hollow Vessel
  const lathePts = [];
  // Inner base center
  lathePts.push(new THREE.Vector2(0, baseT));
  // Inner base flat floor
  lathePts.push(new THREE.Vector2(rIn - 0.025, baseT));
  lathePts.push(new THREE.Vector2(rIn, baseT + 0.02));
  // Inner cylindrical wall up to lip
  lathePts.push(new THREE.Vector2(rIn, beakerH - 0.015));
  // Fire-polished rolled lip rim
  lathePts.push(new THREE.Vector2(rIn + wallT * 0.4, beakerH));
  lathePts.push(new THREE.Vector2(beakerR + 0.012, beakerH));
  lathePts.push(new THREE.Vector2(beakerR + 0.012, beakerH - 0.015));
  // Outer cylindrical wall down to heel
  lathePts.push(new THREE.Vector2(beakerR, beakerH - 0.035));
  lathePts.push(new THREE.Vector2(beakerR, 0.04));
  // Outer curved heel to flat standing base
  lathePts.push(new THREE.Vector2(beakerR - 0.02, 0.005));
  lathePts.push(new THREE.Vector2(0, 0));

  const beakerGeo = new THREE.LatheGeometry(lathePts, 48);
  const beakerMesh = new THREE.Mesh(beakerGeo, matBoroGlass);
  beakerMesh.name = 'Glass_Beaker';
  beakerMesh.castShadow = true;
  beakerMesh.receiveShadow = true;
  beakerMesh.renderOrder = 5;
  beakerGroup.add(beakerMesh);
  refs.beakerMesh = beakerMesh;
  registerPart(beakerMesh, 'Glassware', '150 mL Griffin low-form borosilicate glass 3.3 beaker with pouring spout (Glass_Beaker)');

  // Molded Pouring Spout at Beaker Rim
  const spoutGeo = new THREE.ConeGeometry(0.045, 0.09, 16, 1, true, 0, Math.PI);
  const spoutMesh = new THREE.Mesh(spoutGeo, matBoroGlass);
  spoutMesh.rotation.z = -Math.PI / 2.8;
  spoutMesh.position.set(-beakerR - 0.005, beakerH - 0.005, 0);
  spoutMesh.renderOrder = 5;
  beakerGroup.add(spoutMesh);

  // High-DPI Procedural White Ceramic Enamel Graduations (Body_BeakerGrads)
  const bGradCanvas = document.createElement('canvas');
  bGradCanvas.width = 512;
  bGradCanvas.height = 512;
  const bgCtx = bGradCanvas.getContext('2d');
  bgCtx.clearRect(0, 0, 512, 512);

  // White ceramic pencil marking patch
  bgCtx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  bgCtx.fillRect(160, 120, 192, 100);
  bgCtx.fillStyle = '#0f172a';
  bgCtx.font = 'bold 20px monospace';
  bgCtx.textAlign = 'center';
  bgCtx.fillText('SAMPLE', 256, 175);

  // Graduation markings and volumes
  bgCtx.fillStyle = '#ffffff';
  bgCtx.strokeStyle = '#ffffff';
  bgCtx.lineWidth = 6;
  bgCtx.font = 'bold 26px sans-serif';
  bgCtx.textAlign = 'left';

  // 150 mL line
  bgCtx.beginPath();
  bgCtx.moveTo(80, 110);
  bgCtx.lineTo(200, 110);
  bgCtx.stroke();
  bgCtx.fillText('150 mL', 215, 118);

  // 100 mL line
  bgCtx.beginPath();
  bgCtx.moveTo(80, 240);
  bgCtx.lineTo(180, 240);
  bgCtx.stroke();
  bgCtx.fillText('100', 195, 248);

  // 50 mL line
  bgCtx.beginPath();
  bgCtx.moveTo(80, 370);
  bgCtx.lineTo(180, 370);
  bgCtx.stroke();
  bgCtx.fillText('50', 195, 378);

  // Sub-divisions
  bgCtx.lineWidth = 3;
  for (const ySub of [175, 305, 435]) {
    bgCtx.beginPath();
    bgCtx.moveTo(110, ySub);
    bgCtx.lineTo(170, ySub);
    bgCtx.stroke();
  }

  const bGradTex = new THREE.CanvasTexture(bGradCanvas);
  bGradTex.flipY = false;

  // Curved cylindrical shell segment hugging the outer beaker radius
  const gradMeshGeo = new THREE.CylinderGeometry(beakerR + 0.002, beakerR + 0.002, 0.54, 32, 1, true, -Math.PI / 4, Math.PI / 2);
  const gradMesh = new THREE.Mesh(gradMeshGeo, new THREE.MeshBasicMaterial({
    map: bGradTex,
    transparent: true,
    opacity: 0.90,
    side: THREE.DoubleSide,
    depthWrite: false,
  }));
  gradMesh.name = 'Body_BeakerGrads';
  gradMesh.position.set(0, beakerH * 0.50, 0);
  gradMesh.rotation.y = -Math.PI / 2;
  gradMesh.renderOrder = 6;
  beakerGroup.add(gradMesh);
  registerPart(gradMesh, 'Glassware', 'Fired-on durable white ceramic graduation scale with volume rings (Body_BeakerGrads)');

  // Physical Aqueous Solution Liquid & Realistic Concave Meniscus (Glass_SolutionLiquid)
  const liquidFillH = 0.54;
  const liquidGroup = new THREE.Group();
  liquidGroup.name = 'Glass_SolutionLiquid';
  liquidGroup.position.y = baseT;
  liquidGroup.renderOrder = 2;
  beakerGroup.add(liquidGroup);
  refs.liquidMesh = liquidGroup;

  // Fluid Column Body (snugly fills inside diameter with 0.5mm clearance)
  const fluidR = rIn - 0.004;
  const fluidH = liquidFillH - baseT;
  const fluidCyl = cyl(fluidR, fluidR, fluidH, matSolutionLiquid, 40);
  fluidCyl.position.y = fluidH / 2;
  fluidCyl.renderOrder = 2;
  liquidGroup.add(fluidCyl);

  // Concave Meniscus Surface (capillary rise curving upward at the glass boundary)
  const meniscusPts = [];
  const nRings = 16;
  for (let i = 0; i <= nRings; i++) {
    const r = (i / nRings) * fluidR;
    const normR = r / fluidR;
    const yRise = 0.016 * Math.pow(normR, 4);
    meniscusPts.push(new THREE.Vector2(r, yRise));
  }
  const meniscusGeo = new THREE.LatheGeometry(meniscusPts, 40);
  const meniscusMesh = new THREE.Mesh(meniscusGeo, matSolutionLiquid);
  meniscusMesh.position.y = fluidH;
  meniscusMesh.renderOrder = 2;
  liquidGroup.add(meniscusMesh);
  registerPart(liquidGroup, 'Glassware', 'Aqueous buffer solution liquid with physical refraction and concave meniscus (Glass_SolutionLiquid)');

  // -------------------------------------------------------------------------
  // 9. Reagent Calibration Buffer Bottles & Wash Bottle
  // -------------------------------------------------------------------------
  const bottleConfigs = [
    { name: 'Body_BufferBottle_4',  colCode: 0xdc2626, x: 2.25, z: -1.35, label: 'pH 4.01', chem: 'Phthalate Buffer' },
    { name: 'Body_BufferBottle_7',  colCode: 0xeab308, x: 2.25, z: -0.90, label: 'pH 7.00', chem: 'Phosphate Buffer' },
    { name: 'Body_BufferBottle_10', colCode: 0x0284c7, x: 2.25, z: -0.45, label: 'pH 10.01', chem: 'Carbonate Buffer' },
  ];

  bottleConfigs.forEach((b) => {
    const bGroup = new THREE.Group();
    bGroup.name = b.name;
    bGroup.position.set(b.x, 0, b.z);
    root.add(bGroup);

    // Translucent HDPE Boston Round Bottle Body
    const bBody = cyl(0.22, 0.22, 0.70, matHDPEPlastic(), 28);
    bBody.name = `${b.name}_Vial`;
    bBody.position.y = 0.35;
    bGroup.add(bBody);

    // Liquid fill level visible inside bottle
    const bFluid = cyl(0.20, 0.20, 0.50, matHDPEPlastic(b.colCode), 20);
    bFluid.position.y = 0.27;
    bGroup.add(bFluid);

    // Ribbed Fluted Screw Cap with Real Vertical Knurl Rings
    const bCap = cyl(0.14, 0.14, 0.12, M(b.colCode, { r: 0.35, m: 0.10 }), 28);
    bCap.name = `${b.name}_Cap`;
    bCap.position.y = 0.76;
    bGroup.add(bCap);

    for (let r = 0; r < 14; r++) {
      const ang = (r * Math.PI * 2) / 14;
      const rib = box(0.012, 0.10, 0.02, M(b.colCode, { r: 0.4 }));
      rib.position.set(Math.cos(ang) * 0.142, 0.76, Math.sin(ang) * 0.142);
      bGroup.add(rib);
    }

    // High-DPI Procedural Label
    const lCanvas = document.createElement('canvas');
    lCanvas.width = 256;
    lCanvas.height = 320;
    const lCtx = lCanvas.getContext('2d');

    lCtx.fillStyle = '#ffffff';
    lCtx.fillRect(0, 0, 256, 320);

    // Header colored stripe
    lCtx.fillStyle = `#${b.colCode.toString(16).padStart(6, '0')}`;
    lCtx.fillRect(0, 0, 256, 64);

    lCtx.fillStyle = '#ffffff';
    lCtx.font = 'bold 36px -apple-system, sans-serif';
    lCtx.textAlign = 'center';
    lCtx.fillText(b.label, 128, 46);

    lCtx.fillStyle = '#0f172a';
    lCtx.font = 'bold 20px sans-serif';
    lCtx.fillText(b.chem, 128, 110);

    lCtx.font = '16px monospace';
    lCtx.fillStyle = '#475569';
    lCtx.fillText('± 0.01 @ 25°C', 128, 150);
    lCtx.fillText('NIST Traceable', 128, 185);
    lCtx.fillText('100 mL Solution', 128, 220);

    // Hazard diamond
    lCtx.strokeStyle = '#94a3b8';
    lCtx.lineWidth = 2;
    lCtx.strokeRect(20, 250, 216, 50);
    lCtx.font = 'bold 14px sans-serif';
    lCtx.fillStyle = '#0f172a';
    lCtx.fillText('LABORATORY USE ONLY', 128, 280);

    const lTex = new THREE.CanvasTexture(lCanvas);
    lTex.flipY = false;

    const bLabel = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.32), new THREE.MeshBasicMaterial({
      map: lTex,
      side: THREE.FrontSide,
    }));
    bLabel.position.set(0, 0.35, -0.225);
    bGroup.add(bLabel);

    registerPart(bGroup, 'Consumables', `Standard calibration buffer solution bottle: ${b.label} (NIST Traceable)`);
  });

  // Polyethylene Wash Bottle with Curved Siphon Dispensing Spout (Body_WashBottle)
  const washGroup = new THREE.Group();
  washGroup.name = 'Body_WashBottle';
  washGroup.position.set(2.25, 0, 0.25);
  root.add(washGroup);

  const washBody = cyl(0.26, 0.24, 0.85, matWashBottle, 28);
  washBody.name = 'Body_WashVial';
  washBody.position.y = 0.425;
  washGroup.add(washBody);

  // Deionized Water fill visible inside wash bottle
  const washFluid = cyl(0.24, 0.22, 0.65, matSolutionLiquid, 24);
  washFluid.position.y = 0.35;
  washGroup.add(washFluid);

  const washCap = cyl(0.16, 0.16, 0.12, M(0x0284c7, { r: 0.35 }), 24);
  washCap.name = 'Body_WashCap';
  washCap.position.y = 0.91;
  washGroup.add(washCap);

  // Curved Siphon Dispensing Spout Tube
  const nozzleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.96, 0),
    new THREE.Vector3(0, 1.35, 0),
    new THREE.Vector3(-0.16, 1.30, 0),
    new THREE.Vector3(-0.32, 1.02, 0),
  ]);
  const nozzle = new THREE.Mesh(new THREE.TubeGeometry(nozzleCurve, 20, 0.022, 10, false), M(0x0284c7, { r: 0.3 }));
  nozzle.name = 'Body_WashNozzle';
  washGroup.add(nozzle);

  // Wash bottle silkscreen label
  const wCanvas = document.createElement('canvas');
  wCanvas.width = 256;
  wCanvas.height = 256;
  const wCtx = wCanvas.getContext('2d');
  wCtx.clearRect(0, 0, 256, 256);
  wCtx.fillStyle = '#0284c7';
  wCtx.font = 'bold 28px sans-serif';
  wCtx.textAlign = 'center';
  wCtx.fillText('DEIONIZED', 128, 90);
  wCtx.fillText('WATER', 128, 125);
  wCtx.font = 'bold 36px monospace';
  wCtx.fillText('H₂O', 128, 175);
  wCtx.font = '16px monospace';
  wCtx.fillText('CAS 7732-18-5', 128, 215);

  const wTex = new THREE.CanvasTexture(wCanvas);
  wTex.flipY = false;
  const wLabel = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), new THREE.MeshBasicMaterial({
    map: wTex,
    transparent: true,
    opacity: 0.85,
    side: THREE.FrontSide,
  }));
  wLabel.position.set(0, 0.44, -0.265);
  washGroup.add(wLabel);
  registerPart(washGroup, 'Consumables', '500 mL low-density polyethylene wash bottle filled with deionized water (Body_WashBottle)');

  // -------------------------------------------------------------------------
  // 10. Laboratory Bench Receptacle Box & Heavy-Duty SJTOW Power Cord (PWR-01..03)
  // -------------------------------------------------------------------------
  const powerGroup = new THREE.Group();
  powerGroup.name = 'Body_PowerContinuity';
  root.add(powerGroup);

  // Duplex Outlet Pedestal Box Seated on Bench Surface (PWR-01: Power_Receptacle_Duplex)
  const outletBox = box(0.36, 0.48, 0.28, matZincCast);
  outletBox.name = 'Power_Receptacle_Duplex';
  outletBox.position.set(BENCH.outlet.x, 0.24, BENCH.outlet.z);
  powerGroup.add(outletBox);
  registerPart(outletBox, 'Electrical', 'Laboratory bench duplex electrical receptacle box (120V/20A NEMA 5-15R) (Power_Receptacle_Duplex)');

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

  // Molded 3-Prong NEMA 5-15P AC Plug (PWR-02: Power_Plug_NEMA)
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
  registerPart(plugGroup, 'Electrical', 'Molded 3-prong NEMA 5-15P laboratory power plug inserted into bench receptacle (Power_Plug_NEMA)');

  // 12V DC Desktop Power Supply Adapter Brick (Body_PowerAdapter_Brick)
  const psuBrick = box(0.35, 0.18, 0.70, matDarkBezel);
  psuBrick.name = 'Body_PowerAdapter_Brick';
  psuBrick.position.set(1.50, 0.09, 1.60);
  powerGroup.add(psuBrick);

  // Green LED on PSU
  const psuLed = cyl(0.02, 0.02, 0.01, M(0x22c55e, { e: 0x22c55e, ei: 1.0 }), 12);
  psuLed.position.set(1.50, 0.185, 1.45);
  powerGroup.add(psuLed);

  // Heavy-Duty 3-Conductor SJTOW Power Cord (PWR-03: Power_Cord_SJTOW)
  const acLineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(BENCH.outlet.x, 0.33, BENCH.outlet.z - 0.40),
    new THREE.Vector3(BENCH.outlet.x, 0.05, BENCH.outlet.z - 0.60),
    new THREE.Vector3(1.50, 0.05, 1.95),
  ]);
  const acLineMesh = new THREE.Mesh(new THREE.TubeGeometry(acLineCurve, 20, 0.022, 10, false), matCable);
  acLineMesh.name = 'Power_Cord_SJTOW';
  powerGroup.add(acLineMesh);
  refs.powerCord = acLineMesh;
  registerPart(acLineMesh, 'Electrical', 'Heavy-duty 3-conductor 18 AWG SJTOW oil-resistant AC power cord (Power_Cord_SJTOW)');

  // DC Cable (PSU to Meter rear DC barrel jack Port_IEC)
  const dcLineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.50, 0.05, 1.25),
    new THREE.Vector3(1.10, 0.05, 1.25),
    new THREE.Vector3(0.68, rearY, rearZ + 0.10),
  ]);
  const dcLineMesh = new THREE.Mesh(new THREE.TubeGeometry(dcLineCurve, 16, 0.012, 8, false), matCable);
  dcLineMesh.name = 'Cable_ACPowerCord';
  powerGroup.add(dcLineMesh);

  // -------------------------------------------------------------------------
  // 11. Kinematics & Animations API (True Vertical Lowering Arc into Beaker)
  // -------------------------------------------------------------------------
  function setArmPosition(immersionRatio) {
    if (!refs.armLower || !refs.armUpper || !refs.holderHead) return;
    const t = THREE.MathUtils.clamp(immersionRatio, 0.0, 1.0);

    // Dual parallelogram articulation swinging in YZ plane directly towards beaker:
    // When t = 0 (RAISED): Arm is lifted up & back, probe tip at Y ≈ 1.05 (clears beaker rim at Y = 0.88).
    // When t = 1 (LOWERED): Arm swings down & forward, probe tip descends into beaker liquid to Y ≈ 0.42.
    // Holder head counter-rotates to remain strictly vertical at all times!
    const angleLower = THREE.MathUtils.lerp(-0.35, 0.14, t);
    const angleUpper = THREE.MathUtils.lerp(0.45, 1.37, t);

    refs.armLower.rotation.x = angleLower;
    refs.armUpper.rotation.x = angleUpper;

    refs.holderHead.rotation.x = -(angleLower + angleUpper);
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

  function setSolutionColor(colorHex, opacity = 0.85) {
    matSolutionLiquid.color.set(colorHex);
    matSolutionLiquid.opacity = opacity;
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
    // Unibody chassis lifts up +1.00 to reveal motherboard, MCU, RAM, SSD, and Faraday shield
    if (refs.chassisCover) {
      refs.chassisCover.position.y = 1.00 * factor;
    }
    // Stand slides laterally
    standGroup.position.x = STAND_X + 0.80 * factor;
    // Beaker slides forwards
    beakerGroup.position.z = BEAKER_Z - 0.60 * factor;

    updateCables();
  }

  function focusPart(partName) {
    let target = null;
    root.traverse((node) => {
      if (node.name === partName) target = node;
    });
    return target;
  }

  // Initial arm state: Lowered into beaker solution
  setArmPosition(1.0);

  const instance = {
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
    focusPart,
  };
  currentModelInstance = instance;
  return instance;
}

let currentModelInstance = null;

export function initPHMeterModel(scene, options = {}) {
  const model = createPHMeterModel(options);
  currentModelInstance = model;
  scene.add(model.root);
  return model;
}

export function setArmPosition(ratio) {
  if (currentModelInstance) currentModelInstance.setArmPosition(ratio);
}

export function setArmSwivel(rad) {
  if (currentModelInstance) currentModelInstance.setArmSwivel(rad);
}

export function setStorageCapMounted(mounted) {
  if (currentModelInstance) currentModelInstance.setStorageCapMounted(mounted);
}

export function setSolutionColor(colorHex, opacity = 0.85) {
  if (currentModelInstance) currentModelInstance.setSolutionColor(colorHex, opacity);
}

export function setLcdTexture(texture) {
  if (currentModelInstance) currentModelInstance.setLcdTexture(texture);
}

export function setWireframe(enabled) {
  if (currentModelInstance) currentModelInstance.setWireframe(enabled);
}

export function setExplodeAmount(amount) {
  if (currentModelInstance) currentModelInstance.setExplodeAmount(amount);
}

export function focusPart(name) {
  if (currentModelInstance) return currentModelInstance.focusPart(name);
  return null;
}

// ---------------------------------------------------------------------------
// Official SREdesigns Brand Certification Badge (makeSREdesignsBadge)
// ---------------------------------------------------------------------------
export function makeSREdesignsBadge(width = 0.56, height = 0.16) {
  const badgePlate = box(width, 0.014, height, matSSBrushed);
  badgePlate.name = 'Badge_SREdesigns';

  const badgeCanvas = document.createElement('canvas');
  badgeCanvas.width = 512;
  badgeCanvas.height = 140;
  const bCtx = badgeCanvas.getContext('2d');

  // Titanium dark background
  const bGrad = bCtx.createLinearGradient(0, 0, 512, 140);
  bGrad.addColorStop(0, '#0f172a');
  bGrad.addColorStop(1, '#1e293b');
  bCtx.fillStyle = bGrad;
  bCtx.fillRect(0, 0, 512, 140);

  // Outer gold & cyan metallic borders
  bCtx.strokeStyle = '#f59e0b';
  bCtx.lineWidth = 6;
  bCtx.strokeRect(4, 4, 504, 132);
  bCtx.strokeStyle = '#06b6d4';
  bCtx.lineWidth = 2;
  bCtx.strokeRect(12, 12, 488, 116);

  // SREdesigns Brand Typography
  bCtx.fillStyle = '#f8fafc';
  bCtx.font = 'bold 50px -apple-system, sans-serif';
  bCtx.textAlign = 'center';
  bCtx.textBaseline = 'middle';
  bCtx.fillText('SREdesigns', 256, 54);

  bCtx.fillStyle = '#38bdf8';
  bCtx.font = 'bold 22px monospace';
  bCtx.letterSpacing = '4px';
  bCtx.fillText('PH-7000 PRO', 256, 102);

  const badgeTex = new THREE.CanvasTexture(badgeCanvas);
  badgeTex.flipY = false;
  badgeTex.colorSpace = THREE.SRGBColorSpace;

  const badgeFaceMesh = createDecalQuad(width - 0.02, height - 0.02, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.MeshBasicMaterial({ map: badgeTex, side: THREE.DoubleSide }));
  badgeFaceMesh.position.set(0, 0.008, 0);
  badgePlate.add(badgeFaceMesh);

  return badgePlate;
}

// ---------------------------------------------------------------------------
// Laboratory Room Environment Builder
// ---------------------------------------------------------------------------
export function buildLabRoom(root) {
  const room = new THREE.Group();
  room.name = 'Body_LaboratoryRoom';

  const benchY = BENCH.surfaceY;
  const matCountertop = M(0x11161d, { r: 0.18, m: 0.15 });

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
  const matWall = M(0x1e293b, { r: 0.65, m: 0.05 });
  const wall = box(BENCH.sx + 4.0, 12.0, 0.20, matWall);
  wall.name = 'Body_BackWall';
  wall.position.set(0, 6.0, BENCH.sz / 2 + 0.10);
  room.add(wall);

  root.add(room);
  return room;
}
