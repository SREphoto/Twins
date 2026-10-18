/**
 * SREdesigns THERMO-1200 Muffle Furnace — Procedural Three.js 3D Twin Architecture
 * 
 * Gold-Tier Procedural Laboratory Twin adhering to Semantic Part Taxonomy:
 * - Double-wall ventilated heavy sheet steel cabinet with open throat aperture
 *   (Body_CabinetLeft, Body_CabinetRight, Body_CabinetBack, Body_CabinetRoof, Body_ConsoleFascia, Body_BaseFrame)
 * - Deep hollow vacuum-formed ceramic fiber refractory chamber (Body_RefractoryChamber)
 * - Heavy-duty silicon carbide refractory hearth tile (Body_HearthPlate)
 * - Embedded Kanthal / FeCrAl resistance wire heating grooves (Body_HeatingCoil_Left, Body_HeatingCoil_Right, Body_HeatingCoil_Top)
 * - High-purity alumina sheathed Type-S Pt-Rh thermocouple probe & aluminum terminal head (Sensor_Thermocouple_TypeS, Head_Thermocouple_Terminal)
 * - Stainless throat collar with high-temp braided ceramic rope gasket (Body_ThroatCollar, Body_ThroatGasket_CeramicRope)
 * - Safety door interlock microswitch with roller plunger (Switch_DoorInterlock_Micro)
 * - Internal electronics bay in lower base:
 *   * Industrial 40A solid-state relay (Module_SSR_HeaterDrive) on finned extruded aluminum heatsink (Heatsink_SSR_Extruded)
 *   * Auxiliary step-down control transformer (Transformer_Auxiliary_Power)
 *   * Multi-pole barrier terminal block with spade crimps (TerminalBlock_Mains_Distribution)
 *   * 60mm convective cabinet cooling fan (Fan_CabinetCooling_Blower)
 *   * Brass chassis ground stud & yellow/green grounding wire (Stud_ChassisGround_Brass)
 *   * High-temp braided fiberglass silicone element wiring harnesses (Harness_HighTemp_Silicone)
 * - Counterbalanced 4-bar parallel-action vertical lift door mechanism
 *   (Pivot_DoorAssembly, Pivot_DoorLinkLowerL, Pivot_DoorLinkLowerR, Pivot_DoorLinkUpperL, Pivot_DoorLinkUpperR, Body_DoorRefractoryPlug, Body_DoorHandle)
 * - Top stainless steel exhaust ventilation chimney stack & slide damper (Body_Chimney, Pivot_Damper)
 * - Eurotherm 3216 digital PID controller console (UI_LCD) with dynamic dual 7-segment CanvasTexture (flipY = false)
 * - Tactile programmer buttons (Btn_Up, Btn_Down, Btn_Page, Btn_Scroll, Btn_RunStop)
 * - Rotary high-current mains disconnect switch (Btn_MainsSwitch) with 90° rotation
 * - Lab accessories: High-purity Al2O3 & Gooch porcelain crucibles (Body_Crucible_*), 450mm tongs (Body_CrucibleTongs), Kevlar gloves (Body_KevlarGloves)
 * - Physical circuit continuity: Bench duplex outlet (Power_Receptacle_Duplex), NEMA plug (Power_Plug_NEMA), SJTOW power cord (Power_Cord_SJTOW)
 * - 4 Neoprene leveling vibration-damping feet resting squarely on datum Y = 0 (Foot_Leveling_*)
 * - SREdesigns brand badge strictly adhering to dimensional clearance (Badge_SREdesigns)
 * - Standardized camera viewpoint presets (CAM_ISO, CAM_FRONT, CAM_CONSOLE, CAM_SIDE, CAM_TOP, CAM_REAR, CAM_EXPLODED)
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
const matIndustrialGray = M(0x242b35, { r: 0.45, m: 0.30, side: THREE.DoubleSide });
const matRefractory     = M(0xdfd9ce, { r: 0.90, m: 0.02, side: THREE.DoubleSide });
const matRefractoryDark = M(0xbcaba0, { r: 0.92, m: 0.02, side: THREE.DoubleSide });
const matHearthSiC      = M(0x2f3235, { r: 0.70, m: 0.20 });
const matSteelBrushed   = M(0xc8cdd4, { r: 0.25, m: 0.85, side: THREE.DoubleSide });
const matSteelDark      = M(0x383c42, { r: 0.35, m: 0.80 });
const matAluminumCast   = M(0x9ca3af, { r: 0.50, m: 0.70 });
const matHeatsinkFin    = M(0x1e293b, { r: 0.30, m: 0.85 });
const matCopper         = M(0xb45309, { r: 0.35, m: 0.85 });
const matBrass          = M(0xd4af37, { r: 0.28, m: 0.85 });
const matRubber         = M(0x141619, { r: 0.92, m: 0.02 });
const matCrucibleAl2O3  = M(0xf8fafc, { r: 0.30, m: 0.05, side: THREE.DoubleSide });
const matCrucibleGooch  = M(0xe2e8f0, { r: 0.35, m: 0.08, side: THREE.DoubleSide });
const matKevlar         = M(0xeab308, { r: 0.75, m: 0.10 });
const matCableBlack     = M(0x181a1f, { r: 0.80, m: 0.05 });
const matWireRed        = M(0xdc2626, { r: 0.40, m: 0.10 });
const matWireWhite      = M(0xf1f5f9, { r: 0.40, m: 0.10 });
const matWireGround     = M(0x16a34a, { r: 0.40, m: 0.10 });
const matCeramicRope    = M(0xeeece8, { r: 0.95, m: 0.01 });

// Dynamic High-Temp Emissive Materials
const matHeatingElement = M(0x33363a, { r: 0.50, m: 0.60, e: 0x000000, ei: 0.0 });
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
  position: new THREE.Vector3(7.4, BENCH.surfaceY + 5.5, -9.6),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 2.5, 0.0),
};

export const CAM_FRONT = {
  position: new THREE.Vector3(0.0, BENCH.surfaceY + 3.2, -10.8),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 2.5, 0.0),
};

export const CAM_CONSOLE = {
  position: new THREE.Vector3(-0.65, BENCH.surfaceY + 1.25, -4.8),
  target: new THREE.Vector3(-0.65, BENCH.surfaceY + 0.85, -2.25),
};

export const CAM_SIDE = {
  position: new THREE.Vector3(10.5, BENCH.surfaceY + 3.0, -0.2),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 2.5, 0.0),
};

export const CAM_TOP = {
  position: new THREE.Vector3(0.0, BENCH.surfaceY + 13.5, 0.2),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 2.5, 0.0),
};

export const CAM_REAR = {
  position: new THREE.Vector3(4.8, BENCH.surfaceY + 4.2, 2.8),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 2.4, 1.6),
};

export const CAM_EXPLODED = {
  position: new THREE.Vector3(8.5, BENCH.surfaceY + 7.5, -9.5),
  target: new THREE.Vector3(0.0, BENCH.surfaceY + 3.2, 0.0),
};

// ---------------------------------------------------------------------------
// Comprehensive Part Catalog for Part Explorer
// ---------------------------------------------------------------------------
export const PART_CATALOG = [
  { id: 'Body_CabinetShell', label: 'Heavy Double-Walled Convective Cabinet', cat: 'Chassis' },
  { id: 'Body_ConsoleFascia', label: 'Eurotherm 3216 Lower Control Fascia', cat: 'Controls' },
  { id: 'UI_LCD', label: 'Eurotherm Dynamic High-DPI Canvas LCD Quad (UI_LCD)', cat: 'Controls' },
  { id: 'Btn_MainsSwitch', label: 'Rotary High-Current Mains Disconnect Switch', cat: 'Controls' },
  { id: 'Pivot_DoorAssembly', label: 'Counterbalanced 4-Bar Parallel Lift Door', cat: 'Kinematics' },
  { id: 'Body_DoorRefractoryPlug', label: 'Stepped High-Temp Refractory Insulation Plug', cat: 'Refractory' },
  { id: 'Body_RefractoryChamber', label: '9.0L Low-Thermal-Mass Ceramic Fiber Muffle', cat: 'Refractory' },
  { id: 'Body_HearthPlate', label: 'Silicon Carbide (SiC) High-Load Hearth Plate', cat: 'Refractory' },
  { id: 'Body_HeatingCoil_Left', label: 'Embedded Kanthal A1 Heating Element (Left)', cat: 'Heating' },
  { id: 'Body_HeatingCoil_Right', label: 'Embedded Kanthal A1 Heating Element (Right)', cat: 'Heating' },
  { id: 'Body_HeatingCoil_Top', label: 'Embedded Kanthal A1 Heating Element (Roof)', cat: 'Heating' },
  { id: 'Sensor_Thermocouple_TypeS', label: 'Type-S Platinum-Rhodium Thermocouple Probe', cat: 'Sensors' },
  { id: 'Head_Thermocouple_Terminal', label: 'Die-Cast Weatherproof TC Terminal Head', cat: 'Sensors' },
  { id: 'Switch_DoorInterlock_Micro', label: 'Door Safety Interlock Plunger Microswitch', cat: 'Safety' },
  { id: 'Module_SSR_HeaterDrive', label: 'Crydom 40A Solid-State Relay (SSR)', cat: 'Electronics' },
  { id: 'Heatsink_SSR_Extruded', label: 'Extruded Multi-Fin Aluminum Heatsink', cat: 'Electronics' },
  { id: 'Transformer_Auxiliary_Power', label: 'Step-Down Auxiliary Control Transformer', cat: 'Electronics' },
  { id: 'TerminalBlock_Mains_Distribution', label: 'Barrier Terminal Strip & Spade Lug Bus', cat: 'Electronics' },
  { id: 'Fan_CabinetCooling_Blower', label: '60mm High-Static-Pressure Convective Fan', cat: 'Electronics' },
  { id: 'Stud_ChassisGround_Brass', label: 'M6 Brass Safety Chassis Grounding Stud', cat: 'Safety' },
  { id: 'Body_Chimney', label: 'Stainless Steel Exhaust Flue Chimney Duct', cat: 'Pneumatics' },
  { id: 'Pivot_Damper', label: 'Top Flue Slide Damper & Lever', cat: 'Pneumatics' },
  { id: 'Body_Crucible_Al2O3_1', label: 'High-Purity Alumina (Al₂O₃) Crucible + Lid', cat: 'Labware' },
  { id: 'Body_CrucibleTongs', label: '450 mm Stainless Steel Crucible Tongs', cat: 'Labware' },
  { id: 'Body_KevlarGloves', label: 'Aluminized High-Temp Kevlar Safety Gloves', cat: 'Labware' },
  { id: 'Power_Receptacle_Duplex', label: 'Bench 120V/230V Duplex Outlet Pedestal', cat: 'Electrical' },
  { id: 'Power_Plug_NEMA', label: 'Molded NEMA 5-15P Industrial Power Plug', cat: 'Electrical' },
  { id: 'Badge_SREdesigns', label: 'SREdesigns Official Jewel Brand Badge', cat: 'Chassis' },
];

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
let switchKnobRef = null;
let cabinetShellGroup = null;
let chimneyGroupRef = null;
let doorInterlockSwitchRef = null;
let partsMap = new Map();

/**
 * Creates the complete SREdesigns THERMO-1200 Muffle Furnace Twin
 */
export function createMuffleFurnaceModel(options = {}) {
  const root = new THREE.Group();
  root.name = "Body_FurnaceSystem";
  furnaceRoot = root;
  partsMap.clear();

  // Helper to register parts into partsMap for Part Explorer
  function register(mesh, id) {
    if (mesh) {
      mesh.name = id;
      partsMap.set(id, mesh);
    }
  }

  // External Cabinet Dimensions: W = 4.15, D = 4.55, H = 5.15
  const cabW = 4.15;
  const cabD = 4.55;
  const cabH = 5.15;
  const baseY = 0.10; // Clearance above feet datum
  const wallT = 0.06; // Sheet metal thickness

  const furnaceBody = new THREE.Group();
  furnaceBody.name = "Body_ChassisGroup";
  root.add(furnaceBody);

  // Bottom Base Frame Skirt (Body_BaseFrame)
  const baseFrame = box(cabW + 0.08, 0.16, cabD + 0.08, matIndustrialGray);
  baseFrame.name = "Body_BaseFrame";
  baseFrame.position.set(0, baseY + 0.08, 0);
  furnaceBody.add(baseFrame);
  register(baseFrame, "Body_BaseFrame");

  // 4 Industrial Neoprene Leveling Feet resting on Y = 0
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
    register(foot, fName);
  });

  // -------------------------------------------------------------------------
  // 1. Double-Walled Hollow Sheet Steel Cabinet (Body_CabinetShell)
  // Replaces solid box! Open throat allows direct view into chamber!
  // -------------------------------------------------------------------------
  cabinetShellGroup = new THREE.Group();
  cabinetShellGroup.name = "Body_CabinetShell";
  furnaceBody.add(cabinetShellGroup);
  register(cabinetShellGroup, "Body_CabinetShell");

  // Left Outer Wall with cooling louvers
  const wallLeft = box(wallT, cabH, cabD, matCabinetWhite);
  wallLeft.position.set(-cabW / 2 + wallT / 2, baseY + cabH / 2, 0);
  cabinetShellGroup.add(wallLeft);

  // Right Outer Wall with switch mount area
  const wallRight = box(wallT, cabH, cabD, matCabinetWhite);
  wallRight.position.set(cabW / 2 - wallT / 2, baseY + cabH / 2, 0);
  cabinetShellGroup.add(wallRight);

  // Rear Outer Wall with exhaust penetration port and ventilation cutouts
  const wallBack = box(cabW - wallT * 2, cabH, wallT, matCabinetWhite);
  wallBack.position.set(0, baseY + cabH / 2, cabD / 2 - wallT / 2);
  cabinetShellGroup.add(wallBack);

  // Top Roof Sheet with chimney aperture
  const roof = box(cabW, wallT, cabD, matCabinetWhite);
  roof.position.set(0, baseY + cabH - wallT / 2, 0);
  cabinetShellGroup.add(roof);

  // Internal Base Deck dividing lower electronics bay from muffle chamber
  const midDeck = box(cabW - wallT * 2, wallT, cabD - wallT * 2, matIndustrialGray);
  midDeck.position.set(0, baseY + 1.55, 0);
  furnaceBody.add(midDeck);

  // Lower Front Fascia Panel (Console Deck)
  const fasciaH = 1.55;
  const fascia = box(cabW - wallT * 2, fasciaH, wallT, matCabinetWhite);
  fascia.name = "Body_ConsoleFascia";
  fascia.position.set(0, baseY + fasciaH / 2, -cabD / 2 + wallT / 2);
  furnaceBody.add(fascia);
  register(fascia, "Body_ConsoleFascia");

  // Upper Front Lintel Panel (Above throat opening)
  const lintelH = 0.85;
  const lintel = box(cabW - wallT * 2, lintelH, wallT, matCabinetWhite);
  lintel.position.set(0, baseY + cabH - lintelH / 2, -cabD / 2 + wallT / 2);
  cabinetShellGroup.add(lintel);

  // Front Left & Right Jamb Trim Cheeks (Framing the throat portal)
  const jambW = (cabW - 2.50) / 2;
  const jambH = cabH - fasciaH - lintelH;
  const jambY = baseY + fasciaH + jambH / 2;

  const jambL = box(jambW, jambH, wallT, matCabinetWhite);
  jambL.position.set(-cabW / 2 + jambW / 2, jambY, -cabD / 2 + wallT / 2);
  cabinetShellGroup.add(jambL);

  const jambR = box(jambW, jambH, wallT, matCabinetWhite);
  jambR.position.set(cabW / 2 - jambW / 2, jambY, -cabD / 2 + wallT / 2);
  cabinetShellGroup.add(jambR);

  // SREdesigns Brand Badge proudly centered on upper lintel
  const badgePlate = box(1.30, 0.28, 0.03, matSteelBrushed);
  badgePlate.name = "Badge_SREdesigns";
  badgePlate.position.set(0, baseY + cabH - lintelH / 2, -cabD / 2 - 0.01);
  cabinetShellGroup.add(badgePlate);
  register(badgePlate, "Badge_SREdesigns");

  // -------------------------------------------------------------------------
  // 2. Ceramic Fiber Refractory Muffle Chamber (Internal Cavity)
  // Deep hollow 5-sided box opening directly towards the front!
  // Chamber volume: 2.35 W x 1.70 H x 2.40 D
  // -------------------------------------------------------------------------
  const chW = 2.35;
  const chH = 1.70;
  const chD = 2.40;
  const chY = baseY + 2.80; // Centered in furnace upper body
  const chZ = 0.35;         // Offset towards back, opening faces -Z

  const muffleGroup = new THREE.Group();
  muffleGroup.name = "Body_RefractoryChamberGroup";
  muffleGroup.position.set(0, chY, chZ);
  furnaceBody.add(muffleGroup);

  // Muffle Refractory Shell: 5 Hollow Walls
  const muffleShell = new THREE.Group();
  muffleShell.name = "Body_RefractoryChamber";
  muffleGroup.add(muffleShell);
  register(muffleShell, "Body_RefractoryChamber");

  const wallRefT = 0.35; // 35mm thick ceramic fiber board
  // Left wall
  const mWallL = box(wallRefT, chH, chD, matRefractory);
  mWallL.position.set(-chW / 2 - wallRefT / 2, 0, 0);
  muffleShell.add(mWallL);

  // Right wall
  const mWallR = box(wallRefT, chH, chD, matRefractory);
  mWallR.position.set(chW / 2 + wallRefT / 2, 0, 0);
  muffleShell.add(mWallR);

  // Roof wall
  const mWallTop = box(chW + wallRefT * 2, wallRefT, chD, matRefractory);
  mWallTop.position.set(0, chH / 2 + wallRefT / 2, 0);
  muffleShell.add(mWallTop);

  // Floor wall
  const mWallBot = box(chW + wallRefT * 2, wallRefT, chD, matRefractory);
  mWallBot.position.set(0, -chH / 2 - wallRefT / 2, 0);
  muffleShell.add(mWallBot);

  // Rear wall (with TC and element penetrations)
  const mWallBack = box(chW + wallRefT * 2, chH + wallRefT * 2, wallRefT, matRefractory);
  mWallBack.position.set(0, 0, chD / 2 + wallRefT / 2);
  muffleShell.add(mWallBack);

  // Throat Extension Collar (Bridges chamber front to cabinet fascia plane)
  const throatD = (chZ - chD / 2) - (-cabD / 2); // Distance to front plane
  const throatCollar = new THREE.Group();
  throatCollar.name = "Body_ThroatCollar";
  throatCollar.position.set(0, 0, -chD / 2 - throatD / 2);
  muffleGroup.add(throatCollar);
  register(throatCollar, "Body_ThroatCollar");

  // Stainless steel flanged throat frame
  const throatFrameL = box(0.04, chH + 0.16, throatD, matSteelBrushed);
  throatFrameL.position.set(-chW / 2 - 0.02, 0, 0);
  throatCollar.add(throatFrameL);

  const throatFrameR = box(0.04, chH + 0.16, throatD, matSteelBrushed);
  throatFrameR.position.set(chW / 2 + 0.02, 0, 0);
  throatCollar.add(throatFrameR);

  const throatFrameTop = box(chW + 0.20, 0.04, throatD, matSteelBrushed);
  throatFrameTop.position.set(0, chH / 2 + 0.02, 0);
  throatCollar.add(throatFrameTop);

  const throatFrameBot = box(chW + 0.20, 0.04, throatD, matSteelBrushed);
  throatFrameBot.position.set(0, -chH / 2 - 0.02, 0);
  throatCollar.add(throatFrameBot);

  // Braided High-Temp Ceramic Fiber Rope Gasket along throat mouth rim
  const ropeW = chW + 0.12;
  const ropeH = chH + 0.12;
  const ropeT = 0.03;
  const ropeGasket = new THREE.Group();
  ropeGasket.name = "Body_ThroatGasket_CeramicRope";
  ropeGasket.position.set(0, 0, -throatD / 2 - 0.01);
  throatCollar.add(ropeGasket);
  register(ropeGasket, "Body_ThroatGasket_CeramicRope");

  const ropeTop = box(ropeW, ropeT, 0.04, matCeramicRope);
  ropeTop.position.y = ropeH / 2;
  ropeGasket.add(ropeTop);

  const ropeBot = box(ropeW, ropeT, 0.04, matCeramicRope);
  ropeBot.position.y = -ropeH / 2;
  ropeGasket.add(ropeBot);

  const ropeL = box(ropeT, ropeH, 0.04, matCeramicRope);
  ropeL.position.x = -ropeW / 2;
  ropeGasket.add(ropeL);

  const ropeR = box(ropeT, ropeH, 0.04, matCeramicRope);
  ropeR.position.x = ropeW / 2;
  ropeGasket.add(ropeR);

  // Safety Door Interlock Microswitch mounted in throat door jamb
  const microswitchGroup = new THREE.Group();
  microswitchGroup.name = "Switch_DoorInterlock_Micro";
  microswitchGroup.position.set(chW / 2 + 0.14, -chH / 2 + 0.10, -throatD / 2 - 0.02);
  throatCollar.add(microswitchGroup);
  register(microswitchGroup, "Switch_DoorInterlock_Micro");
  doorInterlockSwitchRef = microswitchGroup;

  const swBody = box(0.14, 0.08, 0.06, M(0x1e293b, { r: 0.4 }));
  microswitchGroup.add(swBody);

  const swPlunger = cyl(0.015, 0.015, 0.05, matBrass, 12);
  swPlunger.rotation.x = Math.PI / 2;
  swPlunger.position.set(0, 0, -0.04);
  microswitchGroup.add(swPlunger);

  // Heavy Silicon Carbide (SiC) Hearth Tile Plate on Chamber Floor
  const hearthPlate = box(chW - 0.06, 0.08, chD - 0.10, matHearthSiC);
  hearthPlate.name = "Body_HearthPlate";
  hearthPlate.position.set(0, -chH / 2 + 0.04, 0);
  muffleGroup.add(hearthPlate);
  register(hearthPlate, "Body_HearthPlate");

  // Hollow Inner Chamber Glow Mesh (BackSide, sits inside chamber walls)
  const innerChamberGeo = new THREE.BoxGeometry(chW - 0.02, chH - 0.02, chD - 0.02);
  const chamberGlowMesh = new THREE.Mesh(innerChamberGeo, matChamberGlow);
  chamberGlowMesh.name = "Body_ChamberGlow";
  muffleGroup.add(chamberGlowMesh);

  // Embedded Kanthal A1 / FeCrAl Heating Wire Elements in grooved walls
  // Left wall grooved coils
  const coilL = box(0.04, chH * 0.72, chD * 0.82, matHeatingElement);
  coilL.name = "Body_HeatingCoil_Left";
  coilL.position.set(-chW / 2 + 0.02, 0, 0);
  muffleGroup.add(coilL);
  register(coilL, "Body_HeatingCoil_Left");

  // Right wall grooved coils
  const coilR = box(0.04, chH * 0.72, chD * 0.82, matHeatingElement);
  coilR.name = "Body_HeatingCoil_Right";
  coilR.position.set(chW / 2 - 0.02, 0, 0);
  muffleGroup.add(coilR);
  register(coilR, "Body_HeatingCoil_Right");

  // Roof grooved coils
  const coilTop = box(chW * 0.82, 0.04, chD * 0.82, matHeatingElement);
  coilTop.name = "Body_HeatingCoil_Top";
  coilTop.position.set(0, chH / 2 - 0.02, 0);
  muffleGroup.add(coilTop);
  register(coilTop, "Body_HeatingCoil_Top");

  // Type-S Platinum-Rhodium Thermocouple Probe penetrating rear muffle wall
  const tcGroup = new THREE.Group();
  tcGroup.name = "Sensor_Thermocouple_TypeS";
  tcGroup.position.set(0, 0.15, chD / 2);
  muffleGroup.add(tcGroup);
  register(tcGroup, "Sensor_Thermocouple_TypeS");

  // Alumina sheath inside chamber
  const tcSheath = cyl(0.035, 0.035, 0.65, matCrucibleAl2O3, 16);
  tcSheath.rotation.x = Math.PI / 2;
  tcSheath.position.z = -0.325;
  tcGroup.add(tcSheath);

  // Pt-Rh sensing tip bead
  const tcTip = cyl(0.025, 0.025, 0.04, matSteelBrushed, 16);
  tcTip.rotation.x = Math.PI / 2;
  tcTip.position.z = -0.65;
  tcGroup.add(tcTip);

  // Weatherproof Aluminum Thermocouple Terminal Connection Head on rear outer wall
  const tcHead = new THREE.Group();
  tcHead.name = "Head_Thermocouple_Terminal";
  tcHead.position.set(0, 0.15, chD / 2 + wallRefT + 0.14);
  muffleGroup.add(tcHead);
  register(tcHead, "Head_Thermocouple_Terminal");

  const tcHeadBody = cyl(0.12, 0.10, 0.18, matAluminumCast, 16);
  tcHeadBody.rotation.x = Math.PI / 2;
  tcHead.add(tcHeadBody);

  const tcCap = cyl(0.13, 0.13, 0.04, matAluminumCast, 16);
  tcCap.rotation.x = Math.PI / 2;
  tcCap.position.z = 0.11;
  tcHead.add(tcCap);

  // Ceramic Feedthrough Studs on rear wall for heating element leads
  const studPositions = [
    [-chW * 0.35, chH * 0.25],
    [-chW * 0.35, -chH * 0.25],
    [chW * 0.35, chH * 0.25],
    [chW * 0.35, -chH * 0.25],
  ];
  studPositions.forEach(([sx, sy], idx) => {
    const bushing = cyl(0.04, 0.04, wallRefT + 0.08, matCrucibleAl2O3, 12);
    bushing.name = `Bushing_ElementFeedthrough_0${idx + 1}`;
    bushing.rotation.x = Math.PI / 2;
    bushing.position.set(sx, sy, chD / 2 + wallRefT / 2);
    muffleGroup.add(bushing);

    const brassStud = cyl(0.015, 0.015, wallRefT + 0.16, matBrass, 12);
    brassStud.rotation.x = Math.PI / 2;
    brassStud.position.set(sx, sy, chD / 2 + wallRefT / 2 + 0.04);
    muffleGroup.add(brassStud);
  });

  // Dynamic Internal PointLight simulating blackbody glow
  const chamberLight = new THREE.PointLight(0x000000, 0, 5.0);
  chamberLight.name = "Body_ChamberPointLight";
  chamberLight.position.set(0, 0, 0);
  chamberLight.castShadow = true;
  muffleGroup.add(chamberLight);
  chamberPointLight = chamberLight;

  // -------------------------------------------------------------------------
  // 3. Lower Internal Electronics Bay & Power Architecture
  // Positioned in the lower base compartment (Y ∈ [0.10, 1.55])
  // -------------------------------------------------------------------------
  const elecBayGroup = new THREE.Group();
  elecBayGroup.name = "Chassis_ElectronicsSubframe";
  elecBayGroup.position.set(0, baseY, 0);
  furnaceBody.add(elecBayGroup);

  // Galvanized steel sub-chassis / equipment tray
  const subTray = box(cabW - 0.30, 0.04, cabD - 0.40, matSteelBrushed);
  subTray.position.set(0, 0.12, 0);
  elecBayGroup.add(subTray);

  // Industrial Solid-State Relay (Module_SSR_HeaterDrive, Crydom 40A puck)
  const ssrGroup = new THREE.Group();
  ssrGroup.name = "Module_SSR_HeaterDrive";
  ssrGroup.position.set(-0.85, 0.38, 0.20);
  elecBayGroup.add(ssrGroup);
  register(ssrGroup, "Module_SSR_HeaterDrive");

  // Multi-fin Extruded Aluminum Heatsink under SSR
  const heatsink = new THREE.Group();
  heatsink.name = "Heatsink_SSR_Extruded";
  heatsink.position.set(0, -0.14, 0);
  ssrGroup.add(heatsink);
  register(heatsink, "Heatsink_SSR_Extruded");

  const hsBase = box(0.70, 0.06, 0.55, matHeatsinkFin);
  heatsink.add(hsBase);
  for (let fi = -0.28; fi <= 0.28; fi += 0.07) {
    const hsFin = box(0.015, 0.16, 0.55, matHeatsinkFin);
    hsFin.position.set(fi, -0.09, 0);
    heatsink.add(hsFin);
  }

  // SSR Hockey-Puck Housing
  const ssrBlock = box(0.48, 0.14, 0.38, M(0x181a20, { r: 0.4 }));
  ssrGroup.add(ssrBlock);

  const ssrFace = box(0.44, 0.02, 0.34, M(0xf8fafc, { r: 0.5 }));
  ssrFace.position.y = 0.08;
  ssrGroup.add(ssrFace);

  // SSR Terminals & Screws (1/L1, 2/T1, 3/A1, 4/A2)
  const ssrTermPositions = [
    [-0.16, -0.11],
    [0.16, -0.11],
    [-0.16, 0.11],
    [0.16, 0.11],
  ];
  ssrTermPositions.forEach(([tx, tz]) => {
    const scr = cyl(0.025, 0.025, 0.04, matSteelBrushed, 12);
    scr.position.set(tx, 0.10, tz);
    ssrGroup.add(scr);
  });

  // Step-Down Auxiliary Control Transformer (Transformer_Auxiliary_Power)
  const xformerGroup = new THREE.Group();
  xformerGroup.name = "Transformer_Auxiliary_Power";
  xformerGroup.position.set(0.85, 0.42, 0.30);
  elecBayGroup.add(xformerGroup);
  register(xformerGroup, "Transformer_Auxiliary_Power");

  // Laminated E-I core
  const xfCore = box(0.55, 0.48, 0.42, matSteelDark);
  xformerGroup.add(xfCore);

  // Copper coil bobbins
  const xfCoil = cyl(0.20, 0.20, 0.36, matCopper, 24);
  xfCoil.position.y = 0.02;
  xformerGroup.add(xfCoil);

  // Mounting brackets
  const xfBracket = box(0.65, 0.04, 0.46, matSteelBrushed);
  xfBracket.position.y = -0.24;
  xformerGroup.add(xfBracket);

  // Multi-Pole Barrier Terminal Block (TerminalBlock_Mains_Distribution)
  const termStrip = new THREE.Group();
  termStrip.name = "TerminalBlock_Mains_Distribution";
  termStrip.position.set(0.0, 0.22, 0.85);
  elecBayGroup.add(termStrip);
  register(termStrip, "TerminalBlock_Mains_Distribution");

  const termBase = box(0.95, 0.12, 0.22, M(0x1e293b, { r: 0.5 }));
  termStrip.add(termBase);
  for (let ti = -0.38; ti <= 0.38; ti += 0.15) {
    const tScrew = cyl(0.02, 0.02, 0.03, matBrass, 12);
    tScrew.position.set(ti, 0.07, 0);
    termStrip.add(tScrew);
  }

  // 60mm Brushless Cabinet Cooling Fan (Fan_CabinetCooling_Blower)
  const fanGroup = new THREE.Group();
  fanGroup.name = "Fan_CabinetCooling_Blower";
  fanGroup.position.set(-0.85, 0.65, cabD / 2 - wallT - 0.06);
  elecBayGroup.add(fanGroup);
  register(fanGroup, "Fan_CabinetCooling_Blower");

  const fanHousing = box(0.60, 0.60, 0.15, M(0x0f172a, { r: 0.6 }));
  fanGroup.add(fanHousing);
  const fanHub = cyl(0.12, 0.12, 0.16, matIndustrialGray, 16);
  fanHub.rotation.x = Math.PI / 2;
  fanGroup.add(fanHub);

  // Brass Chassis Ground Stud (Stud_ChassisGround_Brass)
  const gndStud = new THREE.Group();
  gndStud.name = "Stud_ChassisGround_Brass";
  gndStud.position.set(1.45, 0.25, 0.90);
  elecBayGroup.add(gndStud);
  register(gndStud, "Stud_ChassisGround_Brass");

  const gndBolt = cyl(0.03, 0.03, 0.12, matBrass, 16);
  gndStud.add(gndBolt);

  // Color-coded Internal Wiring Harnesses
  // Green/yellow ground lead
  const gndCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.45, 0.25, 0.90),
    new THREE.Vector3(1.10, 0.18, 0.85),
    new THREE.Vector3(0.40, 0.20, 0.85),
  ]);
  const gndMesh = new THREE.Mesh(new THREE.TubeGeometry(gndCurve, 16, 0.015, 8, false), matWireGround);
  elecBayGroup.add(gndMesh);

  // Red high-power element wire from SSR to rear stud
  const pwrCurve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.85, 0.45, 0.10),
    new THREE.Vector3(-0.95, 0.80, 0.80),
    new THREE.Vector3(-0.80, 1.80, 1.30),
    new THREE.Vector3(-chW * 0.35, chY - 0.25, chZ + chD / 2 + wallRefT),
  ]);
  const pwrWire1 = new THREE.Mesh(new THREE.TubeGeometry(pwrCurve1, 24, 0.02, 8, false), matWireRed);
  furnaceBody.add(pwrWire1);

  // White neutral element wire from terminal block to rear stud
  const pwrCurve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.15, 0.25, 0.85),
    new THREE.Vector3(0.60, 0.80, 1.00),
    new THREE.Vector3(0.80, 1.80, 1.30),
    new THREE.Vector3(chW * 0.35, chY - 0.25, chZ + chD / 2 + wallRefT),
  ]);
  const pwrWire2 = new THREE.Mesh(new THREE.TubeGeometry(pwrCurve2, 24, 0.02, 8, false), matWireWhite);
  furnaceBody.add(pwrWire2);

  // -------------------------------------------------------------------------
  // 4. Lower Front Control Console & Eurotherm Digital PID Display
  // -------------------------------------------------------------------------
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
  lcdMesh.rotation.y = Math.PI; // Face operator at -Z
  lcdMesh.position.set(-0.65, 0.05, -0.105);
  consoleGroup.add(lcdMesh);
  lcdMeshRef = lcdMesh;
  register(lcdMesh, "UI_LCD");

  // Invert UV coordinates so flipY = false renders perfectly upright (DIAG-005)
  const uvLcd = lcdMesh.geometry.attributes.uv;
  for (let i = 0; i < uvLcd.count; i++) {
    uvLcd.setY(i, 1.0 - uvLcd.getY(i));
  }
  uvLcd.needsUpdate = true;

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
    register(btnMesh, b.id);
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
  switchKnobRef = switchKnob;
  register(switchKnob, "Btn_MainsSwitch");

  // -------------------------------------------------------------------------
  // 5. Counterbalanced 4-Bar Parallel-Motion Lift Door Mechanism
  // -------------------------------------------------------------------------
  const doorMountGroup = new THREE.Group();
  doorMountGroup.name = "Body_DoorMountGroup";
  root.add(doorMountGroup);

  const linkLength = 1.65;
  const linkMat = matSteelDark;

  // Lower Left & Right Links
  linkLowerL = new THREE.Group();
  linkLowerL.name = "Pivot_DoorLinkLowerL";
  linkLowerL.position.set(-cabW / 2 - 0.06, chY - 0.50, -cabD / 2 + 0.30);
  doorMountGroup.add(linkLowerL);
  register(linkLowerL, "Pivot_DoorLinkLowerL");

  const barLL = box(0.04, linkLength, 0.08, linkMat);
  barLL.name = "Body_LinkBarLowerL";
  barLL.position.set(0, linkLength / 2, 0);
  linkLowerL.add(barLL);

  linkLowerR = new THREE.Group();
  linkLowerR.name = "Pivot_DoorLinkLowerR";
  linkLowerR.position.set(cabW / 2 + 0.06, chY - 0.50, -cabD / 2 + 0.30);
  doorMountGroup.add(linkLowerR);
  register(linkLowerR, "Pivot_DoorLinkLowerR");

  const barLR = box(0.04, linkLength, 0.08, linkMat);
  barLR.name = "Body_LinkBarLowerR";
  barLR.position.set(0, linkLength / 2, 0);
  linkLowerR.add(barLR);

  // Upper Left & Right Links
  linkUpperL = new THREE.Group();
  linkUpperL.name = "Pivot_DoorLinkUpperL";
  linkUpperL.position.set(-cabW / 2 - 0.06, chY + 0.35, -cabD / 2 + 0.30);
  doorMountGroup.add(linkUpperL);
  register(linkUpperL, "Pivot_DoorLinkUpperL");

  const barUL = box(0.04, linkLength, 0.08, linkMat);
  barUL.name = "Body_LinkBarUpperL";
  barUL.position.set(0, linkLength / 2, 0);
  linkUpperL.add(barUL);

  linkUpperR = new THREE.Group();
  linkUpperR.name = "Pivot_DoorLinkUpperR";
  linkUpperR.position.set(cabW / 2 + 0.06, chY + 0.35, -cabD / 2 + 0.30);
  doorMountGroup.add(linkUpperR);
  register(linkUpperR, "Pivot_DoorLinkUpperR");

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
  register(doorAssembly, "Pivot_DoorAssembly");

  // Outer Door Casing Sheet
  const doorOuter = box(chW + 0.85, chH + 0.85, 0.22, matCabinetWhite);
  doorOuter.name = "Body_DoorOuterPanel";
  doorAssembly.add(doorOuter);

  // Stepped High-Temp Refractory Insulation Plug that fits into throat
  const plugBase = box(chW + 0.25, chH + 0.25, 0.25, matRefractory);
  plugBase.name = "Body_DoorPlugBase";
  plugBase.position.z = 0.18;
  doorAssembly.add(plugBase);

  // Hot face of plug directly exposed to chamber radiation & seals against rope
  const plugHotFace = box(chW - 0.06, chH - 0.06, 0.12, matPlugHotFace);
  plugHotFace.name = "Body_DoorRefractoryPlug";
  plugHotFace.position.z = 0.34;
  doorAssembly.add(plugHotFace);
  register(plugHotFace, "Body_DoorRefractoryPlug");

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
  // 6. Top Stainless Exhaust Chimney Flue & Slide Damper
  // -------------------------------------------------------------------------
  const chimneyGroup = new THREE.Group();
  chimneyGroup.name = "Body_ChimneyAssembly";
  chimneyGroup.position.set(0, baseY + cabH, 0.35);
  furnaceBody.add(chimneyGroup);
  chimneyGroupRef = chimneyGroup;

  const chimneyPipe = cyl(0.24, 0.24, 0.90, matSteelBrushed, 24);
  chimneyPipe.name = "Body_Chimney";
  chimneyPipe.position.y = 0.45;
  chimneyGroup.add(chimneyPipe);
  register(chimneyPipe, "Body_Chimney");

  // Manual Slide Damper Lever
  const damperLever = box(0.55, 0.03, 0.08, matSteelDark);
  damperLever.name = "Pivot_Damper";
  damperLever.position.set(0.18, 0.30, 0);
  chimneyGroup.add(damperLever);
  damperLeverRef = damperLever;
  register(damperLever, "Pivot_Damper");

  // -------------------------------------------------------------------------
  // 7. High-Temperature Labware Accessories
  // -------------------------------------------------------------------------
  // High-purity Al2O3 Crucible on Center Hearth Slab
  const cruc1 = new THREE.Group();
  cruc1.name = "Body_Crucible_Al2O3_1";
  cruc1.position.set(0, -chH / 2 + 0.08, 0);
  muffleGroup.add(cruc1);
  crucibleInChamber = cruc1;
  register(cruc1, "Body_Crucible_Al2O3_1");

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
  register(tongsGroup, "Body_CrucibleTongs");

  const tongArm1 = box(0.03, 0.02, 2.25, matSteelBrushed);
  tongArm1.position.set(-0.04, 0, 0);
  tongsGroup.add(tongArm1);

  const tongArm2 = box(0.03, 0.02, 2.25, matSteelBrushed);
  tongArm2.position.set(0.04, 0, 0);
  tongsGroup.add(tongArm2);

  const tongPivotPin = cyl(0.03, 0.03, 0.05, matBrass, 16);
  tongPivotPin.position.set(0, 0.02, 0.40);
  tongsGroup.add(tongPivotPin);

  // Aluminized Kevlar High-Temp Thermal Gloves on bench
  const gloveGroup = new THREE.Group();
  gloveGroup.name = "Body_KevlarGloves";
  gloveGroup.position.set(-2.80, 0, 0.80);
  root.add(gloveGroup);
  register(gloveGroup, "Body_KevlarGloves");

  const gloveL = box(0.38, 0.10, 0.70, matKevlar);
  gloveL.position.set(-0.25, 0.05, 0);
  gloveGroup.add(gloveL);

  const gloveR = box(0.38, 0.10, 0.70, matKevlar);
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
  const chY = 0.10 + 2.80;
  const cabD = 4.55;
  const dy = Math.sin(angle) * 1.65;
  const dz = -(1.0 - Math.cos(angle)) * 1.65;

  doorAssemblyGroup.position.set(0, chY + dy, -cabD / 2 - 0.16 + dz);

  // Animate plunger switch
  if (doorInterlockSwitchRef) {
    const swPlunger = doorInterlockSwitchRef.children[1];
    if (swPlunger) {
      swPlunger.position.z = t > 0.05 ? -0.05 : -0.03; // Released vs depressed
    }
  }
}

/**
 * Rotates physical rotary mains disconnect switch
 * @param {boolean} isOn - true = 1 (vertical), false = 0 (horizontal)
 */
export function setMainsSwitchRotation(isOn) {
  if (!switchKnobRef) return;
  switchKnobRef.rotation.x = isOn ? 0 : Math.PI / 2;
}

/**
 * Animates momentary tactile depression of physical buttons
 */
export function animateButtonDepress(btnMesh) {
  if (!btnMesh) return;
  const origZ = btnMesh.position.z;
  btnMesh.position.z += 0.02; // Depress inward
  setTimeout(() => {
    btnMesh.position.z = origZ;
  }, 120);
}

/**
 * Dynamically scales blackbody thermal radiation color, intensity, and chamber light
 * @param {number} tempC - chamber temperature in °C
 */
export function setChamberTemperature(tempC) {
  if (!chamberPointLight) return;

  let r = 0, g = 0, b = 0;
  let intensity = 0;

  if (tempC < 400) {
    r = 0; g = 0; b = 0;
    intensity = 0.0;
  } else if (tempC < 650) {
    const k = (tempC - 400) / 250;
    r = 0.35 * k;
    g = 0.04 * k;
    b = 0.0;
    intensity = 0.35 * k;
  } else if (tempC < 850) {
    const k = (tempC - 650) / 200;
    r = 0.35 + 0.50 * k;
    g = 0.04 + 0.20 * k;
    b = 0.01 * k;
    intensity = 0.35 + 1.2 * k;
  } else if (tempC < 1050) {
    const k = (tempC - 850) / 200;
    r = 0.85 + 0.15 * k;
    g = 0.24 + 0.40 * k;
    b = 0.01 + 0.10 * k;
    intensity = 1.55 + 2.2 * k;
  } else {
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
 * Focuses camera on a single part and dims/wireframes others
 */
export function focusPart(partId, controls, camera) {
  if (!furnaceRoot) return null;
  const target = partsMap.get(partId) || furnaceRoot.getObjectByName(partId);
  if (!target) return null;

  furnaceRoot.traverse((child) => {
    if (child.isMesh && child.material) {
      let isPartMesh = child === target;
      let p = child.parent;
      while (p && !isPartMesh) {
        if (p === target) isPartMesh = true;
        p = p.parent;
      }
      child.material.transparent = !isPartMesh;
      child.material.opacity = isPartMesh ? 1.0 : 0.22;
      child.material.wireframe = !isPartMesh;
    }
  });

  const box3 = new THREE.Box3().setFromObject(target);
  const center = new THREE.Vector3();
  box3.getCenter(center);
  const size = new THREE.Vector3();
  box3.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);

  controls.target.copy(center);
  camera.position.set(center.x + maxDim * 1.8, center.y + maxDim * 1.2, center.z - maxDim * 2.2);
  controls.update();
  return target;
}

/**
 * Clears focused part and restores original material opacity
 */
export function clearPartFocus() {
  if (!furnaceRoot) return;
  furnaceRoot.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.transparent = false;
      child.material.opacity = 1.0;
      child.material.wireframe = false;
    }
  });
}

/**
 * Animates exploded view separation along clean kinematic axes
 */
export function setExplodeAmount(amount) {
  const t = THREE.MathUtils.clamp(amount, 0, 1);
  if (!furnaceRoot) return;

  const doorMount = furnaceRoot.getObjectByName("Body_DoorMountGroup");
  const chimney = furnaceRoot.getObjectByName("Body_ChimneyAssembly");

  if (cabinetShellGroup) {
    cabinetShellGroup.position.y = t * 1.20; // Elevate cabinet shell +120mm to expose interior!
  }
  if (doorMount) {
    doorMount.position.z = -t * 1.60; // Pull door forward
  }
  if (chimney) {
    chimney.position.y = t * 1.40; // Lift chimney upward
  }
  if (crucibleInChamber) {
    crucibleInChamber.position.y = (-1.70 / 2 + 0.08) + t * 0.80; // Lift crucible out
  }
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

  // Genuine Industrial Laboratory Receptacle Box (Power_Receptacle_Duplex)
  const duplexGroup = new THREE.Group();
  duplexGroup.name = "Power_Receptacle_Duplex";
  duplexGroup.position.set(1.80, benchY + 0.60, wallZ - wallD / 2 - 0.02);
  room.add(duplexGroup);

  const outletFace = box(0.35, 0.45, 0.04, M(0x475569, { r: 0.3 }));
  duplexGroup.add(outletFace);

  for (const oy of [-0.10, 0.10]) {
    const sock = cyl(0.08, 0.08, 0.02, M(0x181a20, { r: 0.6 }), 16);
    sock.rotation.x = Math.PI / 2;
    sock.position.set(0, oy, 0.025);
    duplexGroup.add(sock);
  }

  // Molded NEMA 5-15P Industrial Plug firmly seated in receptacle
  const plugGroup = new THREE.Group();
  plugGroup.name = "Power_Plug_NEMA";
  plugGroup.position.set(1.80, benchY + 0.50, wallZ - wallD / 2 + 0.05);
  room.add(plugGroup);

  const plugBody = box(0.12, 0.16, 0.14, matRubber);
  plugGroup.add(plugBody);

  const strainRelief = cyl(0.04, 0.05, 0.12, matRubber, 16);
  strainRelief.rotation.x = Math.PI / 2;
  strainRelief.position.set(0, -0.06, -0.08);
  plugGroup.add(strainRelief);

  // Heavy SJTOW Industrial Power Cord connecting plug to furnace rear entry
  const p0 = new THREE.Vector3(0.80, benchY + 0.25, 2.25);
  const p1 = new THREE.Vector3(1.10, benchY + 0.04, 2.45);
  const p2 = new THREE.Vector3(1.50, benchY + 0.04, 3.10);
  const p3 = new THREE.Vector3(1.80, benchY + 0.44, wallZ - wallD / 2 - 0.04);
  const cordCurve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
  const cordGeo = new THREE.TubeGeometry(cordCurve, 24, 0.035, 8, false);
  const cordMesh = new THREE.Mesh(cordGeo, matCableBlack);
  cordMesh.name = "Power_Cord_SJTOW";
  cordMesh.castShadow = true;
  room.add(cordMesh);

  root.add(room);
  return { surfaceY: benchY, plugGroup, cordMesh };
}
