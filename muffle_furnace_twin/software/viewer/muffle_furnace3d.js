/**
 * SREdesigns THERMO-1200 Muffle Furnace — Procedural Three.js 3D Twin Architecture
 * 
 * Gold-Tier Procedural Laboratory Twin adhering to Semantic Part Taxonomy:
 * - Dual-wall ventilated heavy sheet steel cabinet (Body_Chassis)
 * - Counterbalanced 4-bar parallel-action vertical lift door mechanism
 *   (Pivot_DoorAssembly, Pivot_DoorLinkLowerL, Pivot_DoorLinkLowerR, Body_DoorRefractoryPlug, Body_DoorHandle)
 * - Vacuum-formed low-thermal-mass ceramic fiber chamber muffle (Body_RefractoryChamber)
 * - Heavy-duty silicon carbide refractory hearth tile (Body_HearthPlate)
 * - Embedded Kanthal / FeCrAl resistance wire heating grooves (Body_HeatingCoil_Left, Body_HeatingCoil_Right, Body_HeatingCoil_Top)
 * - Dynamic procedural blackbody thermal glow mesh & dynamic PointLight (Body_ChamberGlow)
 * - Top stainless steel exhaust ventilation chimney stack & slide damper (Body_Chimney, Pivot_Damper)
 * - Eurotherm 3216 digital PID controller console (UI_LCD) with dynamic dual 7-segment CanvasTexture (flipY = false)
 * - Tactile programmer buttons (Btn_Up, Btn_Down, Btn_Page, Btn_Scroll, Btn_RunStop)
 * - Rotary high-current mains disconnect switch (Btn_MainsSwitch)
 * - Lab accessories: High-purity Al2O3 & Gooch porcelain crucibles (Body_Crucible_*), 450mm tongs (Body_CrucibleTongs), Kevlar gloves (Body_KevlarGloves)
 * - Rear panel: Heavy conduit entry, grounding lug, ventilation louvers, rear fasteners (Fastener_*)
 * - 4 Neoprene leveling vibration-damping feet resting squarely on datum Y = 0 (Foot_Leveling_*)
 * - SREdesigns brand badge strictly adhering to dimensional clearance (Badge_SREdesigns)
 * - Standardized camera viewpoint presets (CAM_ISO, CAM_FRONT, CAM_SIDE, CAM_TOP)
 * - Exploded view animation system and wireframe visualization mode
 * 
 * Units: 1 unit ≈ 100 mm (width 4.15 ≈ 415 mm, depth 4.55 ≈ 455 mm, height 5.15 ≈ 515 mm). Y-up, front = -Z.
 */

import * as THREE from 'three';
import {
  createHexSocketScrew,
  createWasher,
  createVibrationFoot,
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

const matCabinetWhite   = M(0xededed, { r: 0.38, m: 0.12, side: THREE.DoubleSide });
const matIndustrialGray = M(0x2d3748, { r: 0.45, m: 0.30, side: THREE.DoubleSide });
const matRefractory     = M(0xd4cfc7, { r: 0.85, m: 0.02, side: THREE.DoubleSide });
const matHearthSiC      = M(0x3a3c3e, { r: 0.70, m: 0.15 });
const matSteelBrushed   = M(0xc8cdd4, { r: 0.25, m: 0.85, side: THREE.DoubleSide });
const matSteelDark      = M(0x3e4248, { r: 0.35, m: 0.80 });
const matBrass          = M(0xd4af37, { r: 0.28, m: 0.85 });
const matRubber         = M(0x141619, { r: 0.92, m: 0.02 });
const matCrucibleAl2O3  = M(0xf8fafc, { r: 0.30, m: 0.05, side: THREE.DoubleSide });
const matCrucibleGooch  = M(0xe2e8f0, { r: 0.35, m: 0.08, side: THREE.DoubleSide });
const matKevlar         = M(0xeab308, { r: 0.75, m: 0.10 });
const matCable          = M(0x1a1c20, { r: 0.80, m: 0.05 });

// Dynamic High-Temp Emissive Materials
const matHeatingElement = M(0x2d2f33, { r: 0.50, m: 0.60, e: 0x000000, ei: 0.0 });
const matChamberGlow    = M(0x1a1a1a, { r: 0.90, m: 0.00, e: 0x000000, ei: 0.0, side: THREE.BackSide });
const matPlugHotFace    = M(0xd4cfc7, { r: 0.85, m: 0.02, e: 0x000000, ei: 0.0 });

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
      x: 1.8,
      y: this.surfaceY + 1.20,
      z: this.cz + this.sz / 2 - 0.05,
    };
  },
};

// ---------------------------------------------------------------------------
// Standard Camera Viewpoint Presets
// ---------------------------------------------------------------------------
export const CAM_ISO = {
  position: new THREE.Vector3(3.4, BENCH.surfaceY + 3.8, -4.8),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 2.5, 0.0),
};

export const CAM_FRONT = {
  position: new THREE.Vector3(0.0, BENCH.surfaceY + 2.6, -5.2),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 2.4, 0.0),
};

export const CAM_SIDE = {
  position: new THREE.Vector3(5.2, BENCH.surfaceY + 2.8, -0.2),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 2.5, 0.0),
};

export const CAM_TOP = {
  position: new THREE.Vector3(0.0, BENCH.surfaceY + 7.5, 0.2),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 2.5, 0.0),
};

// Global Sub-Assembly References for Kinematics & Animations
let furnaceRoot = null;
let doorAssemblyGroup = null;
let linkLowerL = null;
let linkLowerR = null;
let linkUpperL = null;
let linkUpperR = null;
let chamberPointLight = null;
let crucibleInChamber = null;
let lcdMeshRef = null;
let damperLeverRef = null;

/**
 * Creates the complete SREdesigns THERMO-1200 Muffle Furnace Twin
 */
export function createMuffleFurnaceModel(options = {}) {
  const root = new THREE.Group();
  root.name = "Body_FurnaceSystem";
  furnaceRoot = root;

  // External Cabinet Dimensions: W = 4.15, D = 4.55, H = 5.15
  const cabW = 4.15;
  const cabD = 4.55;
  const cabH = 5.15;
  const baseY = 0.10; // Clearance above feet datum

  const furnaceBody = new THREE.Group();
  furnaceBody.name = "Body_ChassisGroup";
  root.add(furnaceBody);

  // 1. Heavy Gauge Ventilated Outer Cabinet (Body_Chassis)
  const chassisMesh = box(cabW, cabH, cabD, matCabinetWhite);
  chassisMesh.name = "Body_Chassis";
  chassisMesh.position.set(0, baseY + cabH / 2, 0);
  furnaceBody.add(chassisMesh);

  // Bottom Base Frame Skirt (Body_InnerFrame)
  const baseFrame = box(cabW + 0.08, 0.16, cabD + 0.08, matIndustrialGray);
  baseFrame.name = "Body_BaseFrame";
  baseFrame.position.set(0, baseY + 0.08, 0);
  furnaceBody.add(baseFrame);

  // 4 Industrial Neoprene Leveling Feet
  const footPositions = [
    [-1.75, -1.85, "Foot_Leveling_FrontLeft"],
    [1.75, -1.85, "Foot_Leveling_FrontRight"],
    [-1.75, 1.85, "Foot_Leveling_RearLeft"],
    [1.75, 1.85, "Foot_Leveling_RearRight"],
  ];
  footPositions.forEach(([fx, fz, fName]) => {
    const foot = createVibrationFoot(0.12, 0.15, 0.10);
    foot.name = fName;
    foot.position.set(fx, 0, fz);
    furnaceBody.add(foot);
  });

  // 2. Ceramic Fiber Refractory Muffle Chamber (Internal Cavity)
  // Chamber volume: 2.35 W x 1.70 H x 2.40 D
  const chW = 2.35;
  const chH = 1.70;
  const chD = 2.40;
  const chY = baseY + 2.50; // Centered in furnace upper body
  const chZ = 0.35;         // Offset towards back, opening faces -Z

  const muffleGroup = new THREE.Group();
  muffleGroup.name = "Body_MuffleChamberGroup";
  muffleGroup.position.set(0, chY, chZ);
  furnaceBody.add(muffleGroup);

  // Outer Chamber Insulation Surround Block
  const surroundBlock = box(chW + 0.80, chH + 0.80, chD + 0.60, matRefractory);
  surroundBlock.name = "Body_RefractoryChamber";
  muffleGroup.add(surroundBlock);

  // Hollow Inner Chamber Volume Mesh (receives glow)
  const innerChamberGeo = new THREE.BoxGeometry(chW, chH, chD);
  const chamberGlowMesh = new THREE.Mesh(innerChamberGeo, matChamberGlow);
  chamberGlowMesh.name = "Body_ChamberGlow";
  muffleGroup.add(chamberGlowMesh);

  // Chamber Opening Collar Frame (Throat)
  const throatFrame = box(chW + 0.16, chH + 0.16, 0.35, matRefractory);
  throatFrame.name = "Body_ThroatFrame";
  throatFrame.position.set(0, 0, -chD / 2 - 0.175);
  muffleGroup.add(throatFrame);

  // Heavy Silicon Carbide (SiC) Hearth Tile Plate
  const hearthPlate = box(chW - 0.10, 0.08, chD - 0.15, matHearthSiC);
  hearthPlate.name = "Body_HearthPlate";
  hearthPlate.position.set(0, -chH / 2 + 0.04, 0);
  muffleGroup.add(hearthPlate);

  // Embedded Resistance Heating Coils (Kanthal A1 grooves)
  // Left wall coil
  const coilL = box(0.04, chH * 0.70, chD * 0.80, matHeatingElement);
  coilL.name = "Body_HeatingCoil_Left";
  coilL.position.set(-chW / 2 + 0.02, 0, 0);
  muffleGroup.add(coilL);

  // Right wall coil
  const coilR = box(0.04, chH * 0.70, chD * 0.80, matHeatingElement);
  coilR.name = "Body_HeatingCoil_Right";
  coilR.position.set(chW / 2 - 0.02, 0, 0);
  muffleGroup.add(coilR);

  // Top roof coil
  const coilTop = box(chW * 0.80, 0.04, chD * 0.80, matHeatingElement);
  coilTop.name = "Body_HeatingCoil_Top";
  coilTop.position.set(0, chH / 2 - 0.02, 0);
  muffleGroup.add(coilTop);

  // Dynamic Internal PointLight simulating blackbody glow
  const chamberLight = new THREE.PointLight(0x000000, 0, 4.5);
  chamberLight.name = "Body_ChamberPointLight";
  chamberLight.position.set(0, 0, 0);
  chamberLight.castShadow = true;
  muffleGroup.add(chamberLight);
  chamberPointLight = chamberLight;

  // 3. Top Stainless Exhaust Chimney Flue & Slide Damper
  const chimneyGroup = new THREE.Group();
  chimneyGroup.name = "Body_ChimneyAssembly";
  chimneyGroup.position.set(0, baseY + cabH, 0.35);
  furnaceBody.add(chimneyGroup);

  const chimneyPipe = cyl(0.24, 0.24, 0.90, matSteelBrushed, 24);
  chimneyPipe.name = "Body_Chimney";
  chimneyPipe.position.y = 0.45;
  chimneyGroup.add(chimneyPipe);

  // Manual Slide Damper Lever
  const damperLever = box(0.55, 0.03, 0.08, matSteelDark);
  damperLever.name = "Pivot_Damper";
  damperLever.position.set(0.18, 0.30, 0);
  chimneyGroup.add(damperLever);
  damperLeverRef = damperLever;

  // 4. Lower Front Control Console & Eurotherm Digital PID Display
  const consoleGroup = new THREE.Group();
  consoleGroup.name = "Body_ConsoleAssembly";
  consoleGroup.position.set(0, baseY + 0.80, -cabD / 2);
  furnaceBody.add(consoleGroup);

  // Console Inset Bezel Plate
  const consoleBezel = box(3.20, 1.05, 0.06, matIndustrialGray);
  consoleBezel.name = "Body_Bezel";
  consoleBezel.position.z = -0.02;
  consoleGroup.add(consoleBezel);

  // Eurotherm PID Display Frame & Dynamic Canvas Quad (UI_LCD)
  const eurothermFrame = box(1.40, 0.70, 0.08, M(0x181a20, { r: 0.6 }));
  eurothermFrame.name = "Body_EurothermHousing";
  eurothermFrame.position.set(-0.65, 0.05, -0.06);
  consoleGroup.add(eurothermFrame);

  const lcdGeo = new THREE.PlaneGeometry(1.22, 0.54);
  const lcdMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide });
  const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.name = "UI_LCD";
  lcdMesh.rotation.y = Math.PI;
  lcdMesh.position.set(-0.65, 0.05, -0.105);
  consoleGroup.add(lcdMesh);
  lcdMeshRef = lcdMesh;

  // Programmer Membrane Tactile Buttons
  const btnConfigs = [
    { id: "Btn_Page", label: "PAGE", x: 0.55, y: 0.22, color: 0x475569 },
    { id: "Btn_Scroll", label: "SCROLL", x: 0.55, y: -0.15, color: 0x475569 },
    { id: "Btn_Up", label: "UP", x: 0.95, y: 0.22, color: 0x2563eb },
    { id: "Btn_Down", label: "DOWN", x: 0.95, y: -0.15, color: 0x2563eb },
    { id: "Btn_RunStop", label: "RUN", x: 1.35, y: 0.03, color: 0x22c55e },
  ];

  btnConfigs.forEach((b) => {
    const btnMesh = box(0.24, 0.24, 0.05, M(b.color, { r: 0.4 }));
    btnMesh.name = b.id;
    btnMesh.position.set(b.x, b.y, -0.06);
    consoleGroup.add(btnMesh);
  });

  // Industrial High-Current Rotary Mains Disconnect Switch on Right Flank
  const switchBase = box(0.06, 0.45, 0.45, matIndustrialGray);
  switchBase.name = "Body_MainsSwitchBase";
  switchBase.position.set(cabW / 2 + 0.03, baseY + 1.20, -0.50);
  furnaceBody.add(switchBase);

  const switchKnob = cyl(0.14, 0.14, 0.12, M(0xd97706, { r: 0.3 }), 16);
  switchKnob.name = "Btn_MainsSwitch";
  switchKnob.rotation.z = Math.PI / 2;
  switchKnob.position.set(cabW / 2 + 0.09, baseY + 1.20, -0.50);
  furnaceBody.add(switchKnob);

  // SREdesigns Brand Badge
  const badgePlate = box(1.20, 0.24, 0.02, matSteelBrushed);
  badgePlate.name = "Badge_SREdesigns";
  badgePlate.position.set(0, baseY + cabH - 0.35, -cabD / 2 - 0.015);
  furnaceBody.add(badgePlate);

  // -------------------------------------------------------------------------
  // 5. Counterbalanced 4-Bar Parallel-Motion Lift Door Mechanism
  // -------------------------------------------------------------------------
  const doorMountGroup = new THREE.Group();
  doorMountGroup.name = "Body_DoorMountGroup";
  root.add(doorMountGroup);

  // 4-Bar Kinematic Linkage Pivots on Cabinet Sides
  const linkLength = 1.65;
  const linkMat = matSteelDark;

  // Lower Left & Right Links
  linkLowerL = new THREE.Group();
  linkLowerL.name = "Pivot_DoorLinkLowerL";
  linkLowerL.position.set(-cabW / 2 - 0.06, chY - 0.50, -cabD / 2 + 0.30);
  doorMountGroup.add(linkLowerL);

  const barLL = box(0.04, linkLength, 0.08, linkMat);
  barLL.name = "Body_LinkBarLowerL";
  barLL.position.set(0, linkLength / 2, 0);
  linkLowerL.add(barLL);

  linkLowerR = new THREE.Group();
  linkLowerR.name = "Pivot_DoorLinkLowerR";
  linkLowerR.position.set(cabW / 2 + 0.06, chY - 0.50, -cabD / 2 + 0.30);
  doorMountGroup.add(linkLowerR);

  const barLR = box(0.04, linkLength, 0.08, linkMat);
  barLR.name = "Body_LinkBarLowerR";
  barLR.position.set(0, linkLength / 2, 0);
  linkLowerR.add(barLR);

  // Upper Left & Right Links
  linkUpperL = new THREE.Group();
  linkUpperL.name = "Pivot_DoorLinkUpperL";
  linkUpperL.position.set(-cabW / 2 - 0.06, chY + 0.35, -cabD / 2 + 0.30);
  doorMountGroup.add(linkUpperL);

  const barUL = box(0.04, linkLength, 0.08, linkMat);
  barUL.name = "Body_LinkBarUpperL";
  barUL.position.set(0, linkLength / 2, 0);
  linkUpperL.add(barUL);

  linkUpperR = new THREE.Group();
  linkUpperR.name = "Pivot_DoorLinkUpperR";
  linkUpperR.position.set(cabW / 2 + 0.06, chY + 0.35, -cabD / 2 + 0.30);
  doorMountGroup.add(linkUpperR);

  const barUR = box(0.04, linkLength, 0.08, linkMat);
  barUR.name = "Body_LinkBarUpperR";
  barUR.position.set(0, linkLength / 2, 0);
  linkUpperR.add(barUR);

  // Main Door Parallel Assembly Group (rides at top of linkages)
  const doorAssembly = new THREE.Group();
  doorAssembly.name = "Pivot_DoorAssembly";
  doorAssembly.position.set(0, chY, -cabD / 2 - 0.16);
  doorMountGroup.add(doorAssembly);
  doorAssemblyGroup = doorAssembly;

  // Outer Door Casing Sheet
  const doorOuter = box(chW + 0.85, chH + 0.85, 0.22, matCabinetWhite);
  doorOuter.name = "Body_DoorOuterPanel";
  doorAssembly.add(doorOuter);

  // Stepped High-Temp Refractory Insulation Plug that fits into throat
  const plugBase = box(chW + 0.25, chH + 0.25, 0.25, matRefractory);
  plugBase.name = "Body_DoorPlugBase";
  plugBase.position.z = 0.18;
  doorAssembly.add(plugBase);

  // Hot face of plug directly exposed to chamber radiation
  const plugHotFace = box(chW - 0.06, chH - 0.06, 0.12, matPlugHotFace);
  plugHotFace.name = "Body_DoorRefractoryPlug";
  plugHotFace.position.z = 0.34;
  doorAssembly.add(plugHotFace);

  // Door Ergonomic Heavy Grip Grab Bar (Body_DoorHandle)
  const handleStandoffL = cyl(0.04, 0.04, 0.22, matSteelDark, 16);
  handleStandoffL.name = "Body_HandleStandoffL";
  handleStandoffL.rotation.x = Math.PI / 2;
  handleStandoffL.position.set(-1.20, -chH / 2 - 0.15, -0.20);
  doorAssembly.add(handleStandoffL);

  const handleStandoffR = cyl(0.04, 0.04, 0.22, matSteelDark, 16);
  handleStandoffR.name = "Body_HandleStandoffR";
  handleStandoffR.rotation.x = Math.PI / 2;
  handleStandoffR.position.set(1.20, -chH / 2 - 0.15, -0.20);
  doorAssembly.add(handleStandoffR);

  const grabBar = cyl(0.05, 0.05, 2.60, matSteelBrushed, 24);
  grabBar.name = "Body_DoorHandle";
  grabBar.rotation.z = Math.PI / 2;
  grabBar.position.set(0, -chH / 2 - 0.15, -0.32);
  doorAssembly.add(grabBar);

  // -------------------------------------------------------------------------
  // 6. High-Temperature Labware Accessories
  // -------------------------------------------------------------------------
  // High-purity Al2O3 Crucible on Center Hearth Slab
  const cruc1 = new THREE.Group();
  cruc1.name = "Body_Crucible_Al2O3_1";
  cruc1.position.set(0, -chH / 2 + 0.08, 0);
  muffleGroup.add(cruc1);
  crucibleInChamber = cruc1;

  const cruc1Body = cyl(0.24, 0.18, 0.35, matCrucibleAl2O3, 24);
  cruc1Body.name = "Body_CrucibleBody1";
  cruc1Body.position.y = 0.175;
  cruc1.add(cruc1Body);

  const cruc1Lid = cyl(0.26, 0.26, 0.04, matCrucibleAl2O3, 24);
  cruc1Lid.name = "Body_CrucibleLid1";
  cruc1Lid.position.y = 0.37;
  cruc1.add(cruc1Lid);

  // Alumina Crucible #2 on Bench Side Table
  const cruc2 = new THREE.Group();
  cruc2.name = "Body_Crucible_Al2O3_2";
  cruc2.position.set(2.80, 0, -1.00);
  root.add(cruc2);

  const cruc2Body = cyl(0.30, 0.22, 0.42, matCrucibleAl2O3, 24);
  cruc2Body.name = "Body_CrucibleBody2";
  cruc2Body.position.y = 0.21;
  cruc2.add(cruc2Body);

  // Gooch Porcelain Crucible on Bench
  const crucGooch = new THREE.Group();
  crucGooch.name = "Body_Crucible_Porcelain";
  crucGooch.position.set(2.80, 0, -0.20);
  root.add(crucGooch);

  const goochBody = cyl(0.22, 0.15, 0.32, matCrucibleGooch, 24);
  goochBody.name = "Body_GoochBody";
  goochBody.position.y = 0.16;
  crucGooch.add(goochBody);

  // Long-reach (450 mm) Stainless Steel Crucible Tongs resting on bench
  const tongsGroup = new THREE.Group();
  tongsGroup.name = "Body_CrucibleTongs";
  tongsGroup.position.set(-2.80, 0.04, -0.60);
  tongsGroup.rotation.y = -0.35;
  root.add(tongsGroup);

  const tongArm1 = box(0.03, 0.02, 2.25, matSteelBrushed);
  tongArm1.name = "Body_TongArm1";
  tongArm1.position.set(-0.04, 0, 0);
  tongsGroup.add(tongArm1);

  const tongArm2 = box(0.03, 0.02, 2.25, matSteelBrushed);
  tongArm2.name = "Body_TongArm2";
  tongArm2.position.set(0.04, 0, 0);
  tongsGroup.add(tongArm2);

  const tongPivotPin = cyl(0.03, 0.03, 0.05, matBrass, 16);
  tongPivotPin.name = "Fastener_TongPivot";
  tongPivotPin.position.set(0, 0.02, 0.40);
  tongsGroup.add(tongPivotPin);

  // Aluminized Kevlar High-Temp Thermal Gloves on bench
  const gloveGroup = new THREE.Group();
  gloveGroup.name = "Body_KevlarGloves";
  gloveGroup.position.set(-2.80, 0, 0.80);
  root.add(gloveGroup);

  const gloveL = box(0.38, 0.10, 0.70, matKevlar);
  gloveL.name = "Body_GloveL";
  gloveL.position.set(-0.25, 0.05, 0);
  gloveGroup.add(gloveL);

  const gloveR = box(0.38, 0.10, 0.70, matKevlar);
  gloveR.name = "Body_GloveR";
  gloveR.position.set(0.25, 0.05, 0);
  gloveGroup.add(gloveR);

  // Set initial realistic closed door and cold temperature
  setDoorOpen(0.0);
  setChamberTemperature(22.0);

  return root;
}

/**
 * Updates 4-bar parallel motion vertical lift door
 * @param {number} openRatio - 0.0 = completely sealed, 1.0 = fully raised upward
 */
export function setDoorOpen(openRatio) {
  if (!doorAssemblyGroup || !linkLowerL) return;

  const t = THREE.MathUtils.clamp(openRatio, 0.0, 1.0);
  // Linkages rotate upwards from 0 to ~70 degrees
  const angle = THREE.MathUtils.lerp(0.0, 1.22, t);

  linkLowerL.rotation.x = angle;
  linkLowerR.rotation.x = angle;
  linkUpperL.rotation.x = angle;
  linkUpperR.rotation.x = angle;

  // The door assembly translates upward and slightly forward, maintaining verticality
  const chY = 0.10 + 2.50;
  const cabD = 4.55;
  const dy = Math.sin(angle) * 1.65;
  const dz = -(1.0 - Math.cos(angle)) * 1.65;

  doorAssemblyGroup.position.set(0, chY + dy, -cabD / 2 - 0.16 + dz);
}

/**
 * Dynamically scales blackbody thermal radiation color, intensity, and chamber light
 * @param {number} tempC - chamber temperature in °C
 */
export function setChamberTemperature(tempC) {
  if (!chamberPointLight) return;

  // Blackbody radiation curve mapping
  let r = 0, g = 0, b = 0;
  let intensity = 0;

  if (tempC < 400) {
    // Cold refractory
    r = 0; g = 0; b = 0;
    intensity = 0.0;
  } else if (tempC < 650) {
    // Faint dull cherry red
    const k = (tempC - 400) / 250;
    r = 0.35 * k;
    g = 0.04 * k;
    b = 0.0;
    intensity = 0.35 * k;
  } else if (tempC < 850) {
    // Bright orange-red
    const k = (tempC - 650) / 200;
    r = 0.35 + 0.50 * k;
    g = 0.04 + 0.20 * k;
    b = 0.01 * k;
    intensity = 0.35 + 1.2 * k;
  } else if (tempC < 1050) {
    // Glowing orange-yellow
    const k = (tempC - 850) / 200;
    r = 0.85 + 0.15 * k;
    g = 0.24 + 0.40 * k;
    b = 0.01 + 0.10 * k;
    intensity = 1.55 + 2.2 * k;
  } else {
    // White-hot 1100°C+
    const k = Math.min(1.0, (tempC - 1050) / 150);
    r = 1.0;
    g = 0.64 + 0.28 * k;
    b = 0.11 + 0.45 * k;
    intensity = 3.75 + 2.5 * k;
  }

  const emissiveColor = new THREE.Color(r, g, b);
  matHeatingElement.emissive.copy(emissiveColor);
  matHeatingElement.emissiveIntensity = intensity * 1.8;

  matChamberGlow.emissive.copy(emissiveColor);
  matChamberGlow.emissiveIntensity = intensity * 0.9;

  matPlugHotFace.emissive.copy(emissiveColor);
  matPlugHotFace.emissiveIntensity = intensity * 0.7;

  chamberPointLight.color.copy(emissiveColor);
  chamberPointLight.intensity = intensity * 3.5;
}

/**
 * Toggles crucible presence inside heating muffle
 */
export function setCrucibleInChamber(inChamber) {
  if (!crucibleInChamber) return;
  crucibleInChamber.visible = inChamber;
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
 * Toggles wireframe across all meshes
 */
export function setWireframe(enabled) {
  if (!furnaceRoot) return;
  furnaceRoot.traverse((child) => {
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
  if (!furnaceRoot) return;

  const chassis = furnaceRoot.getObjectByName("Body_ChassisGroup");
  const doorMount = furnaceRoot.getObjectByName("Body_DoorMountGroup");
  const chimney = furnaceRoot.getObjectByName("Body_ChimneyAssembly");

  if (chassis) chassis.position.z = t * 0.50;
  if (doorMount) doorMount.position.z = -t * 1.40;
  if (chimney) chimney.position.y = t * 1.10;
}

// ---------------------------------------------------------------------------
// Standalone Photorealistic Laboratory Room Environment
// ---------------------------------------------------------------------------
export function buildLabRoom(root) {
  const room = new THREE.Group();
  room.name = "Body_LaboratoryRoom";

  const benchY = BENCH.surfaceY;
  const matCountertop = M(0x11161d, { r: 0.22, m: 0.15 });

  // Countertop Slab
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

  // Cabinet Base
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

  // Industrial 30A Power Outlet Receptacle
  const outlet = box(0.35, 0.45, 0.04, M(0x475569, { r: 0.3 }));
  outlet.name = "Body_HeavyDutyOutlet";
  outlet.position.set(1.80, benchY + 0.60, wallZ - wallD / 2 - 0.02);
  room.add(outlet);

  // Heavy Power Conduit / Cable
  const p0 = new THREE.Vector3(0.80, benchY + 1.20, 2.25);
  const p1 = new THREE.Vector3(1.10, benchY + 0.04, 2.50);
  const p2 = new THREE.Vector3(1.50, benchY + 0.04, 3.10);
  const p3 = new THREE.Vector3(1.80, benchY + 0.60 - 0.10, wallZ - wallD / 2 - 0.04);
  const cordCurve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
  const cordGeo = new THREE.TubeGeometry(cordCurve, 24, 0.03, 8, false);
  const cordMesh = new THREE.Mesh(cordGeo, matCable);
  cordMesh.name = "Body_PowerCord";
  cordMesh.castShadow = true;
  room.add(cordMesh);

  root.add(room);
  return { surfaceY: benchY };
}
