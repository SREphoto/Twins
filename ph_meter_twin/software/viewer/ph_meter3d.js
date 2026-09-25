/**
 * SREdesigns PH-7000 Pro — Procedural Three.js 3D Twin Architecture
 * 
 * Gold-Tier Procedural Laboratory Twin adhering to Semantic Part Taxonomy:
 * - Sloped ergonomic console chassis with 18.5° angled display face (Body_Chassis)
 * - Recessed console bezel pocket (Body_Bezel)
 * - Live dynamic CanvasTexture UI_LCD seated proudly with positive clearance (flipY = false)
 * - Membrane tactile buttons (Btn_Read, Btn_Cal, Btn_Mode, Btn_Setup, Btn_Hold, Btn_Power)
 * - Dual-pantograph counterbalanced articulated electrode arm (Pivot_ArmBase, Pivot_ArmLower, Pivot_ArmUpper, Pivot_HolderHead)
 * - Sealed glass combination pH electrode with inner Ag/AgCl reference wire and sensing bulb (Glass_ElectrodeStem, Glass_PHBulb, Body_RefWire)
 * - Stainless steel ATC automatic temperature compensation probe rod (Body_ATCProbe)
 * - Translucent 3M KCl wetting storage cap with screw collar (Body_StorageCap)
 * - 150 mL borosilicate glass beaker with graduations & dynamic fluid meniscus (Glass_Beaker, Glass_SolutionLiquid)
 * - Color-coded standard pH buffer calibration bottles (Body_BufferBottle_4, Body_BufferBottle_7, Body_BufferBottle_10)
 * - Polyethylene deionized water wash bottle (Body_WashBottle)
 * - Rear panel: MIL-STD-348 BNC coaxial jack, ATC mini-jack, DB9 RS-232 serial port, 12V DC power cord
 * - 4 Neoprene leveling vibration-damping feet resting squarely on datum Y = 0 (Foot_Leveling_*)
 * - SREdesigns brand badge strictly adhering to dimensional clearance (Badge_SREdesigns)
 * - Standardized camera viewpoint presets (CAM_ISO, CAM_FRONT, CAM_SIDE, CAM_TOP)
 * - Exploded view animation system and wireframe visualization mode
 * 
 * Units: 1 unit ≈ 100 mm (width 1.80 ≈ 180 mm, depth 2.20 ≈ 220 mm, height 0.70 ≈ 70 mm). Y-up, front = -Z.
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
// Material Palette
// ---------------------------------------------------------------------------
const M = (color, o = {}) => new THREE.MeshStandardMaterial({
  color,
  roughness: o.r ?? 0.35,
  metalness: o.m ?? 0.1,
  transparent: o.o != null && o.o < 1,
  opacity: o.o ?? 1,
  emissive: new THREE.Color(o.e ?? o.emissive ?? 0x000000),
  emissiveIntensity: o.ei ?? o.emissiveIntensity ?? 0,
  side: o.side ?? THREE.FrontSide,
  depthWrite: o.dw ?? true,
});

const matWhiteChassis = M(0xf4f6f8, { r: 0.32, m: 0.08, side: THREE.DoubleSide });
const matDarkBezel   = M(0x181c22, { r: 0.45, m: 0.15, side: THREE.DoubleSide });
const matSteelBrushed = M(0xc4c9d0, { r: 0.25, m: 0.88, side: THREE.DoubleSide });
const matSteelDark    = M(0x3e4248, { r: 0.35, m: 0.80 });
const matBrass        = M(0xd4af37, { r: 0.28, m: 0.85 });
const matRubber       = M(0x141619, { r: 0.92, m: 0.02 });
const matGlassClear   = M(0xedf5fc, { r: 0.05, m: 0.05, o: 0.25, side: THREE.DoubleSide });
const matElectrolyte  = M(0xdff0fa, { r: 0.10, m: 0.02, o: 0.65, side: THREE.DoubleSide });
const matAgWire       = M(0xe0e0e0, { r: 0.20, m: 0.95 });
const matCable        = M(0x1e2024, { r: 0.80, m: 0.05 });
const matButtonFace   = M(0x28303e, { r: 0.50, m: 0.10 });
const matBottleRed    = M(0xf43f5e, { r: 0.30, m: 0.05 });
const matBottleYel    = M(0xeab308, { r: 0.30, m: 0.05 });
const matBottleBlu    = M(0x0ea5e9, { r: 0.30, m: 0.05 });
const matWashBottle   = M(0xf1f5f9, { r: 0.40, m: 0.02, o: 0.70, side: THREE.DoubleSide });

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

// ---------------------------------------------------------------------------
// Standing-height Lab Workbench Datum (900 mm = 9.00 units)
// ---------------------------------------------------------------------------
export const BENCH = {
  cx: 0.0,
  cz: 0.0,
  sx: 10.0,
  sz: 7.2,
  bodyH: 8.30,
  topT: 0.70,
  get surfaceY() {
    return this.bodyH + this.topT; // 9.00 units
  },
  get outlet() {
    return {
      x: 1.5,
      y: this.surfaceY + 1.20,
      z: this.cz + this.sz / 2 - 0.05,
    };
  },
};

// ---------------------------------------------------------------------------
// Standard Camera Viewpoint Presets
// ---------------------------------------------------------------------------
export const CAM_ISO = {
  position: new THREE.Vector3(1.6, BENCH.surfaceY + 2.2, -2.4),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 0.6, 0.0),
};

export const CAM_FRONT = {
  position: new THREE.Vector3(0.0, BENCH.surfaceY + 1.8, -2.6),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 0.5, -0.2),
};

export const CAM_SIDE = {
  position: new THREE.Vector3(2.8, BENCH.surfaceY + 1.5, 0.2),
  target: new THREE.Vector3(0.3, BENCH.surfaceY + 0.8, 0.0),
};

export const CAM_TOP = {
  position: new THREE.Vector3(0.0, BENCH.surfaceY + 3.8, 0.1),
  target: new THREE.Vector3(0.0, BENCH.surfaceY, 0.0),
};

// Global Sub-Assembly References for Kinematics & Animations
let phMeterRoot = null;
let lcdMeshRef = null;
let armBaseGroup = null;
let armLowerGroup = null;
let armUpperGroup = null;
let holderHeadGroup = null;
let storageCapGroup = null;
let liquidMeshRef = null;
let explodedParts = [];

/**
 * Creates the complete SREdesigns PH-7000 Pro Benchtop Meter Twin
 */
export function createPHMeterModel(options = {}) {
  const root = new THREE.Group();
  root.name = "Body_PHMeterSystem";
  phMeterRoot = root;
  explodedParts = [];

  const meterGroup = new THREE.Group();
  meterGroup.name = "Body_MeterChassisAssembly";
  root.add(meterGroup);

  // 1. Sloped Main Unibody Housing (W: 1.80, D: 2.20, H: 0.65)
  // Back is taller (0.65), front is shorter (0.28) creating an ~18° sloped deck
  const baseShape = new THREE.Shape();
  const halfW = 0.90;
  const dBack = 1.10;
  const dFront = -1.10;
  const hFront = 0.28;
  const hBack = 0.65;

  // Extrude profile from side view
  const sideProfile = new THREE.Shape();
  sideProfile.moveTo(dFront, 0.06);
  sideProfile.lineTo(dBack, 0.06);
  sideProfile.lineTo(dBack, hBack);
  sideProfile.lineTo(dFront + 0.10, hFront + 0.04);
  sideProfile.lineTo(dFront, hFront - 0.06);
  sideProfile.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: halfW * 2,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 4,
  };
  const bodyGeo = new THREE.ExtrudeGeometry(sideProfile, extrudeSettings);
  bodyGeo.center(); // Center geometry
  const bodyMesh = new THREE.Mesh(bodyGeo, matWhiteChassis);
  bodyMesh.name = "Body_Chassis";
  bodyMesh.rotation.y = Math.PI / 2;
  bodyMesh.position.set(0, (hBack + 0.06) / 2, 0);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  meterGroup.add(bodyMesh);
  explodedParts.push({ mesh: bodyMesh, dir: new THREE.Vector3(0, 0, 0) });

  // 2. Bezel & 7" Touchscreen Display (UI_LCD)
  const bezelW = 1.52;
  const bezelD = 1.05;
  const bezelSlope = 0.31; // angle matching top slope

  const bezelGroup = new THREE.Group();
  bezelGroup.name = "Body_BezelGroup";
  bezelGroup.position.set(0, 0.50, -0.05);
  bezelGroup.rotation.x = bezelSlope;
  meterGroup.add(bezelGroup);

  const bezelPlate = box(bezelW, 0.02, bezelD, matDarkBezel);
  bezelPlate.name = "Body_Bezel";
  bezelGroup.add(bezelPlate);

  // Live Canvas Display Quad
  const lcdW = 1.36;
  const lcdD = 0.72;
  const lcdGeo = new THREE.PlaneGeometry(lcdW, lcdD);
  const lcdMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.FrontSide,
  });
  const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.name = "UI_LCD";
  lcdMesh.rotation.x = -Math.PI / 2;
  lcdMesh.position.set(0, 0.012, -0.08);
  bezelGroup.add(lcdMesh);
  lcdMeshRef = lcdMesh;

  // 3. Capacitive Touch Membrane Buttons on Lower Bezel Deck
  const buttonConfigs = [
    { id: "Btn_Read", label: "READ", x: -0.50, color: 0x2563eb },
    { id: "Btn_Cal", label: "CAL", x: -0.25, color: 0x059669 },
    { id: "Btn_Mode", label: "MODE", x: 0.00, color: 0x475569 },
    { id: "Btn_Setup", label: "SETUP", x: 0.25, color: 0x475569 },
    { id: "Btn_Hold", label: "HOLD", x: 0.50, color: 0xd97706 },
  ];

  buttonConfigs.forEach((btn) => {
    const btnMat = M(btn.color, { r: 0.4, m: 0.1 });
    const btnMesh = box(0.19, 0.015, 0.11, btnMat);
    btnMesh.name = btn.id;
    btnMesh.position.set(btn.x, 0.015, 0.38);
    bezelGroup.add(btnMesh);
  });

  // Power Rocker Button on right flank
  const btnPower = box(0.04, 0.10, 0.16, M(0x22c55e, { e: 0x16a34a, ei: 0.6 }));
  btnPower.name = "Btn_Power";
  btnPower.position.set(halfW + 0.03, 0.35, 0.40);
  meterGroup.add(btnPower);

  // Brand Badge SREdesigns proudly mounted on front deck
  const badgeGroup = new THREE.Group();
  badgeGroup.name = "Badge_SREdesigns";
  badgeGroup.position.set(0, 0.29, -0.96);
  badgeGroup.rotation.x = 0.31;
  const badgePlate = box(0.68, 0.01, 0.14, matSteelBrushed);
  badgePlate.name = "Badge_SREdesignsPlate";
  badgeGroup.add(badgePlate);
  meterGroup.add(badgeGroup);

  // 4. Rear Bulkhead Panel Connectors & Fasteners
  const rearZ = dBack + 0.04;
  const rearY = 0.38;

  // BNC Coaxial Jack for pH Electrode
  const bncGroup = createBNCJack();
  bncGroup.name = "Fastener_BNCJack";
  bncGroup.position.set(-0.45, rearY, rearZ);
  bncGroup.rotation.y = Math.PI;
  meterGroup.add(bncGroup);

  // ATC Mini-Jack
  const atcPort = cyl(0.035, 0.035, 0.06, matSteelDark, 16);
  atcPort.name = "Fastener_ATCPort";
  atcPort.rotation.x = Math.PI / 2;
  atcPort.position.set(-0.15, rearY, rearZ + 0.01);
  meterGroup.add(atcPort);

  // DB9 RS-232 Serial Port
  const db9 = createDB9Port();
  db9.name = "Fastener_DB9Port";
  db9.position.set(0.25, rearY, rearZ);
  db9.rotation.y = Math.PI;
  meterGroup.add(db9);

  // DC Power Barrel Jack & Power Cord
  const dcJack = cyl(0.04, 0.04, 0.05, matRubber, 16);
  dcJack.name = "Fastener_DCPort";
  dcJack.rotation.x = Math.PI / 2;
  dcJack.position.set(0.60, rearY, rearZ);
  meterGroup.add(dcJack);

  // 5. Leveling Rubber Feet
  const footPositions = [
    [-0.72, -0.85, "Foot_Leveling_FrontLeft"],
    [0.72, -0.85, "Foot_Leveling_FrontRight"],
    [-0.72, 0.85, "Foot_Leveling_RearLeft"],
    [0.72, 0.85, "Foot_Leveling_RearRight"],
  ];
  footPositions.forEach(([fx, fz, fName]) => {
    const foot = createVibrationFoot(0.06, 0.07, 0.06);
    foot.name = fName;
    foot.position.set(fx, 0, fz);
    meterGroup.add(foot);
  });

  // -------------------------------------------------------------------------
  // 6. Dual-Pantograph Articulated Electrode Stand Assembly
  // -------------------------------------------------------------------------
  const standGroup = new THREE.Group();
  standGroup.name = "Body_StandAssembly";
  standGroup.position.set(1.45, 0, 0.20);
  root.add(standGroup);

  // Heavy Die-Cast Zinc Stand Base
  const standBaseGeo = new THREE.CylinderGeometry(0.50, 0.55, 0.12, 32);
  const standBase = new THREE.Mesh(standBaseGeo, matSteelDark);
  standBase.name = "Body_StandBase";
  standBase.position.y = 0.06;
  standBase.castShadow = true;
  standBase.receiveShadow = true;
  standGroup.add(standBase);

  // Rubber pads under stand base
  for (let i = 0; i < 3; i++) {
    const ang = (i * Math.PI * 2) / 3;
    const pad = cyl(0.06, 0.06, 0.02, matRubber, 16);
    pad.name = `Foot_StandPad_${i + 1}`;
    pad.position.set(Math.cos(ang) * 0.40, 0.01, Math.sin(ang) * 0.40);
    standGroup.add(pad);
  }

  // Vertical Stainless Steel Support Mast
  const mastH = 2.40;
  const mast = cyl(0.06, 0.06, mastH, matSteelBrushed, 24);
  mast.name = "Body_StandMast";
  mast.position.y = 0.12 + mastH / 2;
  standGroup.add(mast);

  // Stand Swivel Collar (Pivot_ArmBase)
  const armBase = new THREE.Group();
  armBase.name = "Pivot_ArmBase";
  armBase.position.set(0, 1.30, 0);
  standGroup.add(armBase);
  armBaseGroup = armBase;

  const collarMesh = cyl(0.09, 0.09, 0.18, matSteelDark, 24);
  collarMesh.name = "Body_CollarMesh";
  armBase.add(collarMesh);

  // Lower Articulated Parallel Arm Links
  const armLower = new THREE.Group();
  armLower.name = "Pivot_ArmLower";
  armLower.position.set(0, 0.05, 0);
  armBase.add(armLower);
  armLowerGroup = armLower;

  const linkLen = 1.35;
  for (const xOff of [-0.04, 0.04]) {
    const rod = cyl(0.02, 0.02, linkLen, matSteelBrushed, 16);
    rod.name = `Body_LowerRod_${xOff > 0 ? "R" : "L"}`;
    rod.position.set(xOff, linkLen / 2, 0);
    armLower.add(rod);
  }

  // Counterbalance Spring
  const spring = cyl(0.025, 0.025, linkLen * 0.7, matSteelDark, 12);
  spring.name = "Body_TensionSpring";
  spring.position.set(0, linkLen * 0.45, 0.02);
  armLower.add(spring);

  // Center Articulated Knuckle Elbow
  const armElbow = new THREE.Group();
  armElbow.name = "Pivot_ArmElbow";
  armElbow.position.set(0, linkLen, 0);
  armLower.add(armElbow);

  const knuckleMesh = box(0.14, 0.10, 0.10, matSteelDark);
  knuckleMesh.name = "Body_KnuckleMesh";
  armElbow.add(knuckleMesh);

  // Upper Parallel Arm Links
  const armUpper = new THREE.Group();
  armUpper.name = "Pivot_ArmUpper";
  armElbow.add(armUpper);
  armUpperGroup = armUpper;

  const upperLen = 1.30;
  for (const xOff of [-0.04, 0.04]) {
    const rod = cyl(0.018, 0.018, upperLen, matSteelBrushed, 16);
    rod.name = `Body_UpperRod_${xOff > 0 ? "R" : "L"}`;
    rod.position.set(xOff, upperLen / 2, 0);
    armUpper.add(rod);
  }

  // Multi-Electrode Clamp Head Holder
  const holderHead = new THREE.Group();
  holderHead.name = "Pivot_HolderHead";
  holderHead.position.set(0, upperLen, 0);
  armUpper.add(holderHead);
  holderHeadGroup = holderHead;

  const headBlock = box(0.36, 0.08, 0.22, matDarkBezel);
  headBlock.name = "Body_HeadBlock";
  holderHead.add(headBlock);

  // -------------------------------------------------------------------------
  // 7. Glass Combination pH Electrode Assembly
  // -------------------------------------------------------------------------
  const electrodeGroup = new THREE.Group();
  electrodeGroup.name = "Body_ElectrodeAssembly";
  electrodeGroup.position.set(-0.08, -0.04, 0);
  holderHead.add(electrodeGroup);

  // Top Cable Boot
  const boot = cyl(0.04, 0.05, 0.16, matRubber, 16);
  boot.name = "Body_ElectrodeBoot";
  boot.position.y = 0.08;
  electrodeGroup.add(boot);

  // Coaxial Cable to Rear BNC
  const cableSpline = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.08, 0.16, 0),
    new THREE.Vector3(0.10, 0.60, 0.20),
    new THREE.Vector3(0.50, 0.90, 0.40),
    new THREE.Vector3(0.20, 0.50, 0.70),
    new THREE.Vector3(-0.45, 0.38, 1.10),
  ]);
  const cableGeo = new THREE.TubeGeometry(cableSpline, 24, 0.015, 8, false);
  const cableMesh = new THREE.Mesh(cableGeo, matCable);
  cableMesh.name = "Body_ElectrodeCoaxCable";
  holderHead.add(cableMesh);

  // Cylindrical Borosilicate Glass Stem
  const stemLen = 1.15;
  const glassStem = cyl(0.042, 0.042, stemLen, matGlassClear, 24);
  glassStem.name = "Glass_ElectrodeStem";
  glassStem.position.y = -stemLen / 2;
  electrodeGroup.add(glassStem);

  // Internal KCl Gel Electrolyte Column
  const gelCore = cyl(0.034, 0.034, stemLen * 0.92, matElectrolyte, 16);
  gelCore.name = "Body_ElectrolyteGel";
  gelCore.position.y = -stemLen * 0.48;
  electrodeGroup.add(gelCore);

  // Internal Ag/AgCl Reference Wire
  const refWire = cyl(0.005, 0.005, stemLen * 0.85, matAgWire, 8);
  refWire.name = "Body_RefWire";
  refWire.position.y = -stemLen * 0.46;
  electrodeGroup.add(refWire);

  // Fragile Spherical Sensing Glass Bulb
  const bulbGeo = new THREE.SphereGeometry(0.052, 24, 24);
  const glassBulb = new THREE.Mesh(bulbGeo, matGlassClear);
  glassBulb.name = "Glass_PHBulb";
  glassBulb.position.y = -stemLen - 0.02;
  electrodeGroup.add(glassBulb);

  // Removable Wetting Storage Solution Cap (3M KCl)
  const capGroup = new THREE.Group();
  capGroup.name = "Body_StorageCap";
  capGroup.position.y = -stemLen - 0.04;
  electrodeGroup.add(capGroup);
  storageCapGroup = capGroup;

  const capBottle = cyl(0.065, 0.065, 0.22, matElectrolyte, 20);
  capBottle.name = "Body_StorageVial";
  capGroup.add(capBottle);

  const capCollar = cyl(0.072, 0.072, 0.06, matRubber, 20);
  capCollar.name = "Body_StorageCollar";
  capCollar.position.y = 0.09;
  capGroup.add(capCollar);

  // -------------------------------------------------------------------------
  // 8. Stainless Steel ATC Temperature Probe
  // -------------------------------------------------------------------------
  const atcGroup = new THREE.Group();
  atcGroup.name = "Body_ATCProbeAssembly";
  atcGroup.position.set(0.08, -0.04, 0);
  holderHead.add(atcGroup);

  const atcBoot = cyl(0.035, 0.045, 0.14, matRubber, 16);
  atcBoot.name = "Body_ATCBoot";
  atcBoot.position.y = 0.07;
  atcGroup.add(atcBoot);

  const atcStem = cyl(0.025, 0.025, 1.10, matSteelBrushed, 20);
  atcStem.name = "Body_ATCProbe";
  atcStem.position.y = -0.55;
  atcGroup.add(atcStem);

  const atcTip = cyl(0.025, 0.012, 0.08, matSteelDark, 16);
  atcTip.name = "Body_ATCTip";
  atcTip.position.y = -1.14;
  atcGroup.add(atcTip);

  // -------------------------------------------------------------------------
  // 9. 150 mL Borosilicate Beaker & Reaction Solution
  // -------------------------------------------------------------------------
  const beakerGroup = new THREE.Group();
  beakerGroup.name = "Body_BeakerStation";
  beakerGroup.position.set(1.40, 0, -1.00);
  root.add(beakerGroup);

  const beakerH = 0.95;
  const beakerR = 0.40;

  // Glass Beaker Body
  const beakerMesh = cyl(beakerR, beakerR * 0.95, beakerH, matGlassClear, 32);
  beakerMesh.name = "Glass_Beaker";
  beakerMesh.position.y = beakerH / 2;
  beakerGroup.add(beakerMesh);

  // Dynamic Solution Liquid Meniscus
  const liquidMat = M(0xfef08a, { r: 0.15, m: 0.05, o: 0.70, side: THREE.DoubleSide });
  const liquidMesh = cyl(beakerR * 0.92, beakerR * 0.90, beakerH * 0.65, liquidMat, 32);
  liquidMesh.name = "Glass_SolutionLiquid";
  liquidMesh.position.y = (beakerH * 0.65) / 2 + 0.02;
  beakerGroup.add(liquidMesh);
  liquidMeshRef = liquidMesh;

  // Beaker Graduations Ring
  const gradMesh = cyl(beakerR * 0.96, beakerR * 0.96, 0.01, M(0xffffff, { r: 0.8 }), 32);
  gradMesh.name = "Body_BeakerGrads";
  gradMesh.position.y = beakerH * 0.50;
  beakerGroup.add(gradMesh);

  // -------------------------------------------------------------------------
  // 10. Calibration Buffer Bottles & Wash Bottle
  // -------------------------------------------------------------------------
  const bottleConfigs = [
    { name: "Body_BufferBottle_4", color: matBottleRed, x: 2.20, z: -1.40, label: "pH 4.01" },
    { name: "Body_BufferBottle_7", color: matBottleYel, x: 2.20, z: -0.90, label: "pH 7.00" },
    { name: "Body_BufferBottle_10", color: matBottleBlu, x: 2.20, z: -0.40, label: "pH 10.01" },
  ];

  bottleConfigs.forEach((b) => {
    const bGroup = new THREE.Group();
    bGroup.name = b.name;
    bGroup.position.set(b.x, 0, b.z);
    root.add(bGroup);

    const bBody = cyl(0.20, 0.20, 0.65, M(0x1e293b, { r: 0.4 }), 24);
    bBody.name = "Body_BufferVial";
    bBody.position.y = 0.325;
    bGroup.add(bBody);

    const bCap = cyl(0.12, 0.12, 0.10, b.color, 24);
    bCap.name = "Body_BufferCap";
    bCap.position.y = 0.70;
    bGroup.add(bCap);
  });

  // Polyethylene Wash Bottle
  const washGroup = new THREE.Group();
  washGroup.name = "Body_WashBottle";
  washGroup.position.set(2.20, 0, 0.35);
  root.add(washGroup);

  const washBody = cyl(0.24, 0.22, 0.80, matWashBottle, 24);
  washBody.name = "Body_WashVial";
  washBody.position.y = 0.40;
  washGroup.add(washBody);

  const washCap = cyl(0.14, 0.14, 0.12, M(0x0284c7, { r: 0.3 }), 24);
  washCap.name = "Body_WashCap";
  washCap.position.y = 0.86;
  washGroup.add(washCap);

  // Curved Nozzle Tube
  const tubeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.92, 0),
    new THREE.Vector3(0, 1.25, 0),
    new THREE.Vector3(-0.15, 1.20, 0),
    new THREE.Vector3(-0.25, 0.95, 0),
  ]);
  const nozzle = new THREE.Mesh(new THREE.TubeGeometry(tubeCurve, 16, 0.02, 8, false), M(0x0284c7));
  nozzle.name = "Body_WashNozzle";
  washGroup.add(nozzle);

  // Set initial realistic arm pose (Ready over beaker)
  setArmPosition(0.40);

  return root;
}

/**
 * Updates the articulated arm kinematics (elevation & reach)
 * @param {number} immersionRatio - 0.0 = fully raised, 1.0 = fully immersed in beaker
 */
export function setArmPosition(immersionRatio) {
  if (!armLowerGroup || !armUpperGroup || !holderHeadGroup) return;

  const t = THREE.MathUtils.clamp(immersionRatio, 0.0, 1.0);
  // Lower arm pivots forward/down as t increases
  const angleLower = THREE.MathUtils.lerp(0.35, -0.45, t);
  armLowerGroup.rotation.z = angleLower;

  // Upper arm counter-rotates to maintain reach
  const angleUpper = THREE.MathUtils.lerp(-0.70, 0.90, t);
  armUpperGroup.rotation.z = angleUpper;

  // Clamping head stays vertical (compensating for lower + upper angles)
  holderHeadGroup.rotation.z = -(angleLower + angleUpper);
}

/**
 * Swivels the entire electrode arm horizontally
 * @param {number} angleRad - angle in radians
 */
export function setArmSwivel(angleRad) {
  if (!armBaseGroup) return;
  armBaseGroup.rotation.y = angleRad;
}

/**
 * Attaches or detaches the wetting storage solution cap
 */
export function setStorageCapMounted(mounted) {
  if (!storageCapGroup) return;
  storageCapGroup.visible = mounted;
}

/**
 * Dynamically changes the color and transparency of the sample solution
 */
export function setSolutionColor(colorHex, opacity = 0.70) {
  if (!liquidMeshRef) return;
  liquidMeshRef.material.color.set(colorHex);
  liquidMeshRef.material.opacity = opacity;
}

/**
 * Binds dynamic CanvasTexture to LCD quad
 */
export function setLcdTexture(texture) {
  if (!lcdMeshRef) return;
  texture.flipY = false;
  lcdMeshRef.material.map = texture;
  lcdMeshRef.material.needsUpdate = true;
}

/**
 * Toggles wireframe view across all meshes
 */
export function setWireframe(enabled) {
  if (!phMeterRoot) return;
  phMeterRoot.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.wireframe = enabled;
    }
  });
}

/**
 * Animates exploded view separation
 */
export function setExplodeAmount(amount) {
  const t = THREE.MathUtils.clamp(amount, 0, 1);
  if (!phMeterRoot) return;
  // Separate subassemblies
  const meter = phMeterRoot.getObjectByName("Body_MeterChassisAssembly");
  const stand = phMeterRoot.getObjectByName("Body_StandAssembly");
  const beaker = phMeterRoot.getObjectByName("Body_BeakerStation");

  if (meter) meter.position.x = -t * 0.80;
  if (stand) stand.position.x = 1.45 + t * 0.90;
  if (beaker) beaker.position.z = -1.00 - t * 0.60;
}

// ---------------------------------------------------------------------------
// Standalone Photorealistic Laboratory Room Environment
// ---------------------------------------------------------------------------
export function buildLabRoom(root) {
  const room = new THREE.Group();
  room.name = "Body_LaboratoryRoom";

  const benchY = BENCH.surfaceY;
  const matCountertop = M(0x11161d, { r: 0.22, m: 0.15 });

  // Solid Epoxy Resin Countertop Slab
  const countertop = box(BENCH.sx, 0.08, BENCH.sz, matCountertop);
  countertop.name = "Body_Countertop";
  countertop.position.set(0, benchY - 0.04, 0);
  room.add(countertop);

  // Perimeter trims
  const trimW = 0.03;
  const trimT = 0.08;
  const trimY = benchY - 0.04;
  const matTrim = matSteelBrushed;

  const edgeF = box(BENCH.sx + trimW * 2, trimT, trimW, matTrim);
  edgeF.name = "Body_CounterEdgeF";
  edgeF.position.set(0, trimY, -BENCH.sz / 2 - trimW / 2);
  room.add(edgeF);

  const edgeB = box(BENCH.sx + trimW * 2, trimT, trimW, matTrim);
  edgeB.name = "Body_CounterEdgeB";
  edgeB.position.set(0, trimY, BENCH.sz / 2 + trimW / 2);
  room.add(edgeB);

  // Base Cabinet
  const matCabinet = M(0x283446, { r: 0.45, m: 0.08 });
  const cabinet = box(BENCH.sx - 0.4, benchY - 0.08, BENCH.sz - 0.4, matCabinet);
  cabinet.name = "Body_Cabinet";
  cabinet.position.set(0, (benchY - 0.08) / 2, 0);
  room.add(cabinet);

  // Floor
  const matFloor = M(0x0f172a, { r: 0.65, m: 0.05 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), matFloor);
  floor.name = "Body_Floor";
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
  wall.name = "Body_Wall";
  wall.position.set(0, wallH / 2, wallZ);
  wall.receiveShadow = true;
  room.add(wall);

  // Duplex Electrical Wall Outlet
  const outlet = box(0.22, 0.32, 0.02, M(0xe2e8f0, { r: 0.3 }));
  outlet.name = "Body_WallOutlet";
  outlet.position.set(1.50, benchY + 0.50, wallZ - wallD / 2 - 0.01);
  room.add(outlet);

  // Flexible Power Cord
  const p0 = new THREE.Vector3(0.60, benchY + 0.38, 1.14);
  const p1 = new THREE.Vector3(0.90, benchY + 0.02, 1.60);
  const p2 = new THREE.Vector3(1.30, benchY + 0.02, 2.30);
  const p3 = new THREE.Vector3(1.50, benchY + 0.50 - 0.06, wallZ - wallD / 2 - 0.03);
  const cordCurve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
  const cordGeo = new THREE.TubeGeometry(cordCurve, 24, 0.016, 8, false);
  const cordMesh = new THREE.Mesh(cordGeo, matCable);
  cordMesh.name = "Body_PowerCord";
  cordMesh.castShadow = true;
  room.add(cordMesh);

  root.add(room);
  return { surfaceY: benchY };
}
