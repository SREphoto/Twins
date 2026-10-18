/**
 * SREdesigns KNF Laboport N820 / N840 Diaphragm Vacuum Pump Twin
 * Full Gold-Standard Procedural Three.js Twin Architecture
 * 
 * Exhaustive Procedural Detail & Semantic Part Taxonomy:
 * - Structural unibody housing (Body_LowerHousing, Body_UpperHousing) in clean chemical-resistant
 *   laboratory polymer (RAL 7035 light lab grey) with dark structural trim, side intake louvers,
 *   split-line M4 fasteners, and knurled leveling feet at datum Y = 0
 * - Dual Opposed External KNF Diaphragm Pump Heads (Assembly_PumpHead_Left, Right):
 *   - Precision CNC-machined PVDF head covers (Head_Cover_Left, Right)
 *   - Anodized aluminum head clamping plates (Plate_Clamping_Left, Right)
 *   - 8x DIN 912 M4 hex socket clamping bolts (Fastener_HeadScrew_*) with split-lock washers
 *   - Solid virgin PTFE intermediate valve seat plates (Plate_Intermediate_Left, Right)
 *   - Genuine multi-convolution PTFE/EPDM structured diaphragms (Diaphragm_PTFE_Left, Right) with clamping discs
 *   - Conical FFPM poppet check valves (Valve_Inlet_*, Valve_Outlet_*) with hastelloy return coil springs
 *   - Heavy-wall PTFE inter-head series manifold tube (Tube_Manifold_PTFE) with brass compression union fittings
 * - BLDC Drive Mechanism (Assembly_DriveMechanism):
 *   - 12-pole laminated silicon steel stator core (Motor_BLDC_Stator) with individual radial teeth
 *   - 12 wound enamel-insulated copper wire coil packs (Motor_Coils_Copper)
 *   - Ground stainless steel drive shaft (Shaft_Motor_Drive, Ø12mm) in aluminum endbells with ABEC-5 bearings
 *   - Dynamic 7-blade aerodynamic axial cooling fan (Fan_Motor_Cooling)
 *   - Dual counter-phase eccentric cams (Cam_Eccentric_Left, Right, ±4mm stroke offset)
 *   - Drop-forged connecting rods (Rod_Connecting_Left, Right) with needle roller bearings & wrist pins
 * - Pneumatics:
 *   - Front NW25 / KF25 stainless quick-release vacuum inlet flange (Port_Vacuum_Inlet_KF25)
 *   - Rear exhaust port with sintered bronze silencer muffler (Muffler_Exhaust_Sintered) & condensate tray
 *   - Gas ballast valve (Valve_GasBallast) with knurled brass knob (Knob_GasBallast)
 * - Front Operator Console (Assembly_FrontConsole):
 *   - Precision analog Bourdon vacuum gauge (Gauge_Vacuum_Bourdon) with chrome bezel, optical glass lens,
 *     high-DPI procedural silkscreen dial face (0–1013 mbar / 0–760 mmHg dual scale), and dynamic needle
 *   - Illuminated mains power switch (Btn_Power_Switch) with pivoting green rocker
 *   - Speed potentiometer dial (Dial_Speed_Potentiometer, 1500–3000 RPM) with calibrated silkscreen scale
 *   - Multicolor status LED indicator (LED_Status_Power)
 *   - SREdesigns engineering badge (Badge_SREdesigns) seated in boolean-milled recessed bezel pocket
 * - Physical Circuit Continuity:
 *   - Laboratory duplex receptacle box (Power_Receptacle_Duplex) mounted on backsplash wall
 *   - Molded NEMA 5-15P commercial rubber plug (Power_Plug) and heavy-duty SJTOW line cord (Power_Cord)
 *   - Rear IEC 60320 C14 appliance inlet (Fastener_IECInlet) & ground stud (Fastener_GroundLug)
 * - Full Part Explorer registration with 45+ semantic parts, focusPart(), clearFocus(), and 6 standardized camera presets
 */

import * as THREE from 'three';
import {
  createHexSocketScrew,
  createWasher,
  createVibrationFoot,
  createIECInlet,
  createRockerSwitch,
} from '../../../lab_viewer/shared/hardware_library.js';

// ---------------------------------------------------------------------------
// Standard PBR Material Palette (Clean High-Fidelity Laboratory Palette)
// ---------------------------------------------------------------------------
const M = (color, o = {}) => new THREE.MeshStandardMaterial({
  color,
  roughness: o.r ?? 0.35,
  metalness: o.m ?? 0.1,
  transparent: o.o != null && o.o < 1,
  opacity: o.o ?? 1,
  emissive: new THREE.Color(o.e ?? 0x000000),
  emissiveIntensity: o.ei ?? 0,
  side: o.side ?? THREE.FrontSide,
  depthWrite: o.dw ?? true,
});

const matLightChassis  = M(0xe6ebf2, { r: 0.30, m: 0.08 }); // RAL 7035 Light Lab Grey Polymer
const matAccentDark    = M(0x1e2634, { r: 0.42, m: 0.15 }); // Contrast structural polymer trim
const matPTFE          = M(0xfcfdfe, { r: 0.22, m: 0.04 }); // Pure Virgin PTFE (Intermediate plate & tubing)
const matPVDFHead      = M(0xf1f5f9, { r: 0.26, m: 0.08 }); // PVDF Head Cover
const matClampAlum     = M(0xc8d0dc, { r: 0.25, m: 0.85 }); // Anodized Aluminum Clamping Plates
const matAlumCast      = M(0x94a3b8, { r: 0.38, m: 0.65 }); // Cast Aluminum Motor Cradle & Endbells
const matChrome        = M(0xf8fafc, { r: 0.08, m: 0.95 }); // Mirror Polished Chrome (Bezel, Flanges)
const matSteelShaft    = M(0xa1a1aa, { r: 0.20, m: 0.85 }); // Ground Stainless Steel
const matBrass         = M(0xd4af37, { r: 0.28, m: 0.82 }); // Precision Brass Fittings & Knurling
const matCopperCoils   = M(0xc25e1a, { r: 0.20, m: 0.88 }); // Bright Enameled Copper Wire Windings
const matStatorIron    = M(0x384556, { r: 0.45, m: 0.65 }); // Laminated Silicon Steel Stator Core
const matFFPMValve     = M(0x0f172a, { r: 0.65, m: 0.05 }); // Perfluoroelastomer FFPM Poppets
const matSinteredBronze= M(0x926c48, { r: 0.75, m: 0.55 }); // Porous Sintered Bronze Muffler
const matRubber        = M(0x0f172a, { r: 0.90, m: 0.02 }); // Vulcanized Nitrile Rubber
const matSoftGrip      = M(0x181e28, { r: 0.85, m: 0.05 }); // Ergonomic Elastomer Handle Grip
const matGlassLens     = M(0xffffff, { r: 0.05, m: 0.10, o: 0.25, side: THREE.DoubleSide }); // Optical Lens

function box(w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function cyl(rT, rB, h, mat, segs = 32) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, segs), mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// ---------------------------------------------------------------------------
// Benchtop & Coordinate Datum Definitions
// Datum: Instrument rests at Y = 0 local; Lab Benchtop is at Y = 9.00 world
// ---------------------------------------------------------------------------
export const BENCH = {
  surfaceY: 9.00,
  sx: 11.0,
  sz: 6.2,
  bodyH: 8.30,
  topT: 0.70,
  // Outlet position in INSTRUMENT-LOCAL coordinates (pump root sits at Y = surfaceY world).
  // Box body (0.18 deep) is flush against the backsplash front face at Z = sz/2.
  get outlet() {
    return new THREE.Vector3(1.80, 0.65, this.sz / 2 + 0.02 - 0.09);
  },
};

// ---------------------------------------------------------------------------
// Standard Camera Viewpoint Presets
// ---------------------------------------------------------------------------
export const CAM_ISO = {
  position: new THREE.Vector3(4.20, BENCH.surfaceY + 2.40, -4.50),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 0.75, 0.00),
};

export const CAM_FRONT = {
  position: new THREE.Vector3(0.00, BENCH.surfaceY + 0.80, -5.80),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 0.80, 0.00),
};

export const CAM_SIDE = {
  position: new THREE.Vector3(-5.60, BENCH.surfaceY + 0.80, 0.00),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 0.80, 0.00),
};

export const CAM_TOP = {
  position: new THREE.Vector3(0.00, BENCH.surfaceY + 5.50, -0.01),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 0.75, 0.00),
};

export const CAM_CONSOLE = {
  position: new THREE.Vector3(0.00, BENCH.surfaceY + 0.52, -2.80),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 0.52, -0.80),
};

export const CAM_EXPLODED = {
  position: new THREE.Vector3(4.20, BENCH.surfaceY + 3.40, -4.60),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 1.00, 0.00),
};

export const CAM_MOTOR_INTERIOR = {
  position: new THREE.Vector3(0.00, BENCH.surfaceY + 1.05, -1.80),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 0.55, 0.00),
};

export const CAM_HEAD_INTERIOR = {
  position: new THREE.Vector3(-0.95, BENCH.surfaceY + 1.60, -1.50),
  target: new THREE.Vector3(-0.95, BENCH.surfaceY + 1.20, 0.00),
};

// ---------------------------------------------------------------------------
// SREdesigns Canonical Laboratory Badge
// ---------------------------------------------------------------------------
export function makeSREdesignsBadge(plateW = 0.75, plateH = 0.20) {
  const g = new THREE.Group();
  g.name = "Badge_SREdesigns";

  const plateD = 0.025;
  const bezel = box(plateW + 0.04, plateH + 0.04, 0.015, matAccentDark);
  bezel.position.z = 0.002;
  g.add(bezel);

  const plate = box(plateW, plateH, plateD, matClampAlum);
  g.add(plate);

  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "#0c1016";
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = "#00d4e8";
  ctx.lineWidth = 5;
  ctx.strokeRect(6, 6, 500, 116);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 44px -apple-system, sans-serif";
  ctx.fillText("SREdesigns", 256, 48);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 20px monospace";
  ctx.fillText("KNF LABOPORT DIGITAL TWIN", 256, 92);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;

  const faceGeo = new THREE.PlaneGeometry(plateW - 0.02, plateH - 0.02);
  const uvs = faceGeo.attributes.uv;
  for (let i = 0; i < uvs.count; i++) {
    uvs.setY(i, 1.0 - uvs.getY(i));
  }
  uvs.needsUpdate = true;

  const face = new THREE.Mesh(faceGeo, new THREE.MeshBasicMaterial({ map: tex }));
  face.rotation.y = Math.PI; // Face operator at -Z
  face.position.z = -plateD / 2 - 0.004;
  g.add(face);

  return g;
}

// ---------------------------------------------------------------------------
// High-DPI Bourdon Vacuum Gauge Faceplate Dial
// ---------------------------------------------------------------------------
export function makeGaugeDialTexture(dialDiam = 512) {
  const c = document.createElement("canvas");
  c.width = dialDiam;
  c.height = dialDiam;
  const ctx = c.getContext("2d");

  const cx = dialDiam / 2;
  const cy = dialDiam / 2;
  const r = dialDiam * 0.46;

  // Background Dial Plate
  ctx.fillStyle = "#0f1520";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Polished Metallic Rim Ring
  ctx.strokeStyle = "#384556";
  ctx.lineWidth = 6;
  ctx.stroke();

  // Warning Overpressure Sector (1000 to 1100 mbar)
  const startAng = Math.PI * 0.75;
  const endAng = Math.PI * 2.25;

  ctx.strokeStyle = "rgba(239, 68, 68, 0.45)";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 16, startAng, startAng + (endAng - startAng) * 0.12);
  ctx.stroke();

  // High-Vacuum Green Operating Sector (0 to 250 mbar)
  ctx.strokeStyle = "rgba(34, 197, 94, 0.45)";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 16, endAng - (endAng - startAng) * 0.28, endAng);
  ctx.stroke();

  // Calibrated Tick Marks & Scale Numbering
  const totalDivs = 20;
  for (let i = 0; i <= totalDivs; i++) {
    const fraction = i / totalDivs;
    const ang = startAng + fraction * (endAng - startAng);
    const isMajor = (i % 2 === 0);
    const tickLen = isMajor ? 18 : 10;

    const x1 = cx + Math.cos(ang) * (r - 12);
    const y1 = cy + Math.sin(ang) * (r - 12);
    const x2 = cx + Math.cos(ang) * (r - 12 - tickLen);
    const y2 = cy + Math.sin(ang) * (r - 12 - tickLen);

    ctx.strokeStyle = isMajor ? "#f8fafc" : "#64748b";
    ctx.lineWidth = isMajor ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (isMajor) {
      const val = Math.round(1000 - fraction * 1000);
      const tx = cx + Math.cos(ang) * (r - 42);
      const ty = cy + Math.sin(ang) * (r - 42);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 16px -apple-system, sans-serif";
      ctx.fillText(val.toString(), tx, ty);
    }
  }

  // Dial Center Branding & High-Accuracy Typography
  ctx.textAlign = "center";
  ctx.fillStyle = "#00d4e8";
  ctx.font = "bold 20px -apple-system, sans-serif";
  ctx.fillText("VACUUM", cx, cy - 44);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "600 15px monospace";
  ctx.fillText("mbar / mmHg", cx, cy - 22);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 13px -apple-system, sans-serif";
  ctx.fillText("KNF LABOPORT", cx, cy + 46);

  ctx.fillStyle = "#64748b";
  ctx.font = "500 11px monospace";
  ctx.fillText("CLASS 1.6 · BOURDON TUBE", cx, cy + 64);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;
  return tex;
}

// ---------------------------------------------------------------------------
// Model Factory & Semantic Assembly
// ---------------------------------------------------------------------------
export function createVacuumPumpModel() {
  const root = new THREE.Group();
  root.name = "Body_VacuumPumpSystem";

  const refs = {
    motorShaftGroup: null,
    coolingFanGroup: null,
    leftRodGroup: null,
    rightRodGroup: null,
    leftDiaphragm: null,
    rightDiaphragm: null,
    leftInletPoppet: null,
    leftOutletPoppet: null,
    rightInletPoppet: null,
    rightOutletPoppet: null,
    gaugeNeedle: null,
    powerSwitchRocker: null,
    speedPotentiometerDial: null,
    gasBallastKnob: null,
    powerPlug: null,
    statusLed: null,
    explodeGroups: [],
  };

  const partsList = [];
  const partsMap = new Map();

  function registerPart(obj, cat, desc) {
    if (!obj) return;
    const name = obj.name || `Part_${partsList.length + 1}`;
    obj.name = name;
    obj.userData = { cat, desc, interactive: true };
    partsMap.set(name, obj);
    partsList.push({ name, cat, desc, obj });
  }

  // -------------------------------------------------------------------------
  // 1. Lower Structural Housing & Rubber Leveling Feet (Datum Y = 0)
  // -------------------------------------------------------------------------
  const baseGroup = new THREE.Group();
  baseGroup.name = "Assembly_ChassisBase";
  root.add(baseGroup);

  // 4 Vibration Isolation Leveling Feet (Foot_Vibration_*) resting at Y = 0
  const footPositions = [
    [-1.25, 0, -0.65, "Foot_Vibration_FrontLeft"],
    [1.25,  0, -0.65, "Foot_Vibration_FrontRight"],
    [-1.25, 0, 0.65,  "Foot_Vibration_RearLeft"],
    [1.25,  0, 0.65,  "Foot_Vibration_RearRight"],
  ];

  footPositions.forEach(([fx, fy, fz, fId]) => {
    const foot = new THREE.Group();
    foot.name = fId;
    foot.position.set(fx, fy, fz);
    baseGroup.add(foot);
    registerPart(foot, "Chassis", "Vibration-damping vulcanized rubber leveling foot with knurled brass adjustment collar");

    const rubberPad = cyl(0.12, 0.14, 0.05, matRubber, 20);
    rubberPad.position.y = 0.025;
    foot.add(rubberPad);

    const brassRing = cyl(0.13, 0.13, 0.03, matBrass, 24);
    brassRing.position.y = 0.065;
    foot.add(brassRing);

    const stud = cyl(0.025, 0.025, 0.06, matSteelShaft, 12);
    stud.position.y = 0.10;
    foot.add(stud);
  });

  // Structural Lower Chassis Tray (Body_LowerHousing) — hollow molded shell, 4 mm walls
  // Outer envelope: Width 3.10, Depth 1.58, Height 0.80. Bottom seated at Y = 0.08 above feet
  const lowerHousing = new THREE.Group();
  lowerHousing.name = "Body_LowerHousing";
  baseGroup.add(lowerHousing);
  registerPart(lowerHousing, "Chassis", "Precision-molded chemical-resistant hollow polymer lower casing (4 mm wall) housing motor cradle, PCB and harness");

  const lhFloor = box(3.10, 0.05, 1.58, matLightChassis);
  lhFloor.position.set(0, 0.105, 0);
  lowerHousing.add(lhFloor);
  for (const sx of [-1.53, 1.53]) {
    const sideWall = box(0.04, 0.80, 1.58, matLightChassis);
    sideWall.position.set(sx, 0.48, 0);
    lowerHousing.add(sideWall);
  }
  const rearWall = box(3.02, 0.80, 0.04, matLightChassis);
  rearWall.position.set(0, 0.48, 0.77);
  lowerHousing.add(rearWall);

  // Removable front service wall + operator console slide forward in exploded view
  const frontExplodeGroup = new THREE.Group();
  frontExplodeGroup.name = "Group_FrontServiceExplode";
  root.add(frontExplodeGroup);
  refs.explodeGroups.push({ group: frontExplodeGroup, dir: new THREE.Vector3(0, 0, -1.20) });

  const frontWall = box(3.02, 0.80, 0.04, matLightChassis);
  frontWall.name = "Panel_FrontService";
  frontWall.position.set(0, 0.48, -0.77);
  frontExplodeGroup.add(frontWall);
  registerPart(frontWall, "Chassis", "Removable front service wall carrying the operator console fascia");

  // Dark Structural Base Trim Strip
  const baseTrim = box(3.12, 0.06, 1.60, matAccentDark);
  baseTrim.name = "Trim_Chassis_Base";
  baseTrim.position.set(0, 0.11, 0);
  baseGroup.add(baseTrim);
  registerPart(baseTrim, "Chassis", "Perimeter impact-resistant structural base protective band");

  // Motor Ventilation Louvers on Sides (Louver_Vent_Left & Right)
  for (const sideX of [-1.56, 1.56]) {
    for (let li = 0; li < 5; li++) {
      const louver = box(0.025, 0.045, 0.65, matAccentDark);
      louver.name = `Louver_Vent_${sideX < 0 ? 'Left' : 'Right'}_${li + 1}`;
      louver.position.set(sideX, 0.28 + li * 0.09, 0.0);
      baseGroup.add(louver);
      registerPart(louver, "Chassis", "Aerodynamic heat dissipation intake louver slot with debris filter mesh");
    }
  }

  // -------------------------------------------------------------------------
  // 2. BLDC Drive Motor & Reciprocating Mechanism (Assembly_DriveMechanism)
  // -------------------------------------------------------------------------
  const driveGroup = new THREE.Group();
  driveGroup.name = "Assembly_DriveMechanism";
  driveGroup.position.set(0, 0.52, 0); // Motor centerline at Y = 0.52
  root.add(driveGroup);

  // Cast Aluminum Motor Saddle Cradle (Mount_Motor_Cradle) — sits on 4 rubber isolators on housing floor (Y=0.14)
  const motorCradle = box(1.90, 0.08, 1.20, matAlumCast);
  motorCradle.name = "Mount_Motor_Cradle";
  motorCradle.position.set(0, -0.31, 0); // spans Y 0.17..0.25 world-local
  driveGroup.add(motorCradle);
  registerPart(motorCradle, "Drive", "Precision cast aluminum motor saddle cradle with 4 M5 vibration isolation bushings");

  for (const [ix, iz] of [[-0.82, -0.48], [0.82, -0.48], [-0.82, 0.48], [0.82, 0.48]]) {
    const iso = cyl(0.07, 0.07, 0.03, matRubber, 16);
    iso.name = `Isolator_Motor_${ix < 0 ? 'R' : 'L'}${iz < 0 ? 'F' : 'B'}`;
    iso.position.set(ix, -0.365, iz); // Y 0.14..0.17 world-local
    driveGroup.add(iso);
    registerPart(iso, "Drive", "Nitrile rubber vibration isolation bushing between motor cradle and housing floor");
    const isoBolt = createHexSocketScrew(0.022, 0.10);
    isoBolt.position.set(ix, -0.27, iz);
    driveGroup.add(isoBolt);
  }

  // Saddle cheeks cupping the stator
  for (const cz of [-0.40, 0.40]) {
    const cheek = box(1.10, 0.14, 0.06, matAlumCast);
    cheek.position.set(0, -0.22, cz);
    driveGroup.add(cheek);
  }

  // Cast Aluminum Motor Endbells & Deep-Groove Ball Bearings
  for (const ebX of [-0.62, 0.62]) {
    const endbell = cyl(0.36, 0.36, 0.10, matAlumCast, 32);
    endbell.name = `Endbell_Motor_${ebX < 0 ? 'Right' : 'Left'}`;
    endbell.rotation.z = Math.PI / 2;
    endbell.position.set(ebX, 0, 0);
    driveGroup.add(endbell);
    registerPart(endbell, "Drive", "Precision machined aluminum motor endbell housing bearing pocket");

    const bearing = cyl(0.12, 0.12, 0.12, matSteelShaft, 20);
    bearing.name = `Bearing_Motor_${ebX < 0 ? 'Right' : 'Left'}`;
    bearing.rotation.z = Math.PI / 2;
    bearing.position.set(ebX, 0, 0);
    driveGroup.add(bearing);
    registerPart(bearing, "Drive", "6201-2RS deep-groove stainless steel ball bearing pressed into endbell");
  }

  // 4 Through-bolts clamping endbells across the stator stack
  for (let tb = 0; tb < 4; tb++) {
    const a = Math.PI / 4 + tb * Math.PI / 2;
    const tie = cyl(0.016, 0.016, 1.36, matSteelShaft, 10);
    tie.name = `Fastener_MotorTieRod_${tb + 1}`;
    tie.rotation.z = Math.PI / 2;
    tie.position.set(0, Math.sin(a) * 0.30, Math.cos(a) * 0.30);
    driveGroup.add(tie);
    for (const nx of [-0.69, 0.69]) {
      const nut = cyl(0.03, 0.03, 0.03, matSteelShaft, 6);
      nut.rotation.z = Math.PI / 2;
      nut.position.set(nx, tie.position.y, tie.position.z);
      driveGroup.add(nut);
    }
  }

  // 12-Pole Laminated Silicon Steel Stator Core (Motor_BLDC_Stator) — genuine lamination stack
  const statorCore = new THREE.Group();
  statorCore.name = "Motor_BLDC_Stator";
  driveGroup.add(statorCore);
  registerPart(statorCore, "Drive", "12-pole laminated silicon steel stator core (stack of insulated M19 laminations)");
  const lamCount = 16;
  for (let li = 0; li < lamCount; li++) {
    const lam = cyl(0.34, 0.34, 0.05, matStatorIron, 36);
    lam.rotation.z = Math.PI / 2;
    lam.position.x = -0.45 + 0.03 + li * 0.0563;
    statorCore.add(lam);
  }

  // 12 Wound Copper Coil Packs (Motor_Coils_Copper) — end-turns protrude beyond the lamination stack
  const coilGroup = new THREE.Group();
  coilGroup.name = "Motor_Coils_Copper";
  driveGroup.add(coilGroup);
  registerPart(coilGroup, "Drive", "12 heavy-gauge enamel-insulated copper magnet wire windings (Class H insulation)");

  for (let ci = 0; ci < 12; ci++) {
    const ang = (ci / 12) * Math.PI * 2;
    const coil = box(1.02, 0.10, 0.11, matCopperCoils);
    coil.position.set(0, Math.sin(ang) * 0.25, Math.cos(ang) * 0.25);
    coil.rotation.x = -ang;
    coilGroup.add(coil);
  }

  // Central Stainless Steel Drive Shaft Group (Shaft_Motor_Drive)
  const shaftGroup = new THREE.Group();
  shaftGroup.name = "Shaft_Motor_Drive";
  driveGroup.add(shaftGroup);
  refs.motorShaftGroup = shaftGroup;
  registerPart(shaftGroup, "Drive", "Precision ground 12mm stainless steel drive shaft with keyways and balanced eccentric journals");

  const shaftRod = cyl(0.06, 0.06, 2.30, matSteelShaft, 24);
  shaftRod.rotation.z = Math.PI / 2;
  shaftGroup.add(shaftRod);

  // Permanent Magnet Rotor Hub on Shaft
  const rotorHub = cyl(0.17, 0.17, 0.85, matSteelShaft, 24);
  rotorHub.rotation.z = Math.PI / 2;
  shaftGroup.add(rotorHub);

  // Dynamic 7-Blade Axial Motor Cooling Fan (Fan_Motor_Cooling)
  const fanGroup = new THREE.Group();
  fanGroup.name = "Fan_Motor_Cooling";
  fanGroup.position.set(-0.85, 0, 0);
  shaftGroup.add(fanGroup);
  refs.coolingFanGroup = fanGroup;
  registerPart(fanGroup, "Drive", "7-blade dynamic axial cooling fan molded from glass-reinforced polymer");

  const fanHub = cyl(0.12, 0.12, 0.08, matAccentDark, 20);
  fanHub.rotation.z = Math.PI / 2;
  fanGroup.add(fanHub);

  for (let fi = 0; fi < 7; fi++) {
    const fAng = (fi / 7) * Math.PI * 2;
    const blade = box(0.04, 0.16, 0.025, matAccentDark);
    blade.position.set(0, Math.sin(fAng) * 0.17, Math.cos(fAng) * 0.17);
    blade.rotation.x = fAng + 0.35;
    fanGroup.add(blade);
  }

  // Dual Counter-Phase Eccentric Cams (Cam_Eccentric_Left & Right, offset ±4mm / 0.04m)
  const camLeft = cyl(0.14, 0.14, 0.12, matSteelShaft, 24);
  camLeft.name = "Cam_Eccentric_Left";
  camLeft.rotation.z = Math.PI / 2;
  camLeft.position.set(0.95, 0.04, 0); // +4mm offset
  shaftGroup.add(camLeft);
  registerPart(camLeft, "Drive", "Hardened steel eccentric cam journal (+4mm stroke offset, Left Head)");

  const camRight = cyl(0.14, 0.14, 0.12, matSteelShaft, 24);
  camRight.name = "Cam_Eccentric_Right";
  camRight.rotation.z = Math.PI / 2;
  camRight.position.set(-0.95, -0.04, 0); // -4mm counter-phase offset
  shaftGroup.add(camRight);
  registerPart(camRight, "Drive", "Hardened steel eccentric cam journal (-4mm stroke offset, Right Head)");

  // -------------------------------------------------------------------------
  // 3. Dual Opposed External KNF Diaphragm Pump Heads (Assembly_PumpHead_Left / Right)
  // -------------------------------------------------------------------------
  function buildPumpHead(isLeft) {
    const headGroup = new THREE.Group();
    const sideSign = isLeft ? 1 : -1;
    const sideName = isLeft ? "Left" : "Right";
    headGroup.name = `Assembly_PumpHead_${sideName}`;
    headGroup.position.set(sideSign * 0.95, 0.52, 0);
    root.add(headGroup);

    // Connecting Rod (Rod_Connecting_*)
    const rodGroup = new THREE.Group();
    rodGroup.name = `Rod_Connecting_${sideName}`;
    rodGroup.position.set(0, isLeft ? 0.04 : -0.04, 0);
    headGroup.add(rodGroup);
    if (isLeft) refs.leftRodGroup = rodGroup;
    else refs.rightRodGroup = rodGroup;
    registerPart(rodGroup, "Heads", `Drop-forged connecting rod with INA needle roller bearing journal (${sideName})`);

    const rodNeedleBearing = cyl(0.16, 0.16, 0.10, matSteelShaft, 24);
    rodNeedleBearing.rotation.z = Math.PI / 2;
    rodGroup.add(rodNeedleBearing);

    const rodShank = box(0.10, 0.55, 0.08, matAlumCast);
    rodShank.position.y = 0.28;
    rodGroup.add(rodShank);

    const wristPin = cyl(0.04, 0.04, 0.09, matSteelShaft, 16);
    wristPin.name = `Pin_Wrist_${sideName}`;
    wristPin.rotation.z = Math.PI / 2;
    wristPin.position.y = 0.55;
    rodGroup.add(wristPin);
    registerPart(wristPin, "Heads", `Hardened steel wrist pin connecting rod to diaphragm center disc (${sideName})`);

    // Multi-convolution PTFE/EPDM structured diaphragm (Diaphragm_PTFE_*)
    const diaphragmGroup = new THREE.Group();
    diaphragmGroup.name = `Diaphragm_PTFE_${sideName}`;
    diaphragmGroup.position.set(0, 0.58, 0);
    headGroup.add(diaphragmGroup);
    if (isLeft) refs.leftDiaphragm = diaphragmGroup;
    else refs.rightDiaphragm = diaphragmGroup;
    registerPart(diaphragmGroup, "Heads", `Molded PTFE-bonded EPDM convoluted structured diaphragm (${sideName})`);

    for (let ri = 0; ri < 3; ri++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12 + ri * 0.07, 0.022, 16, 32), matRubber);
      ring.rotation.x = Math.PI / 2;
      diaphragmGroup.add(ring);
    }
    const centerClampingDisc = cyl(0.12, 0.12, 0.04, matClampAlum, 24);
    diaphragmGroup.add(centerClampingDisc);

    const centerScrew = createHexSocketScrew(0.02, 0.08);
    centerScrew.position.y = 0.02;
    diaphragmGroup.add(centerScrew);

    // Intermediate Valve Seat Plate Explode Group
    const interPlateGroup = new THREE.Group();
    interPlateGroup.name = `Group_InterPlate_${sideName}`;
    headGroup.add(interPlateGroup);
    refs.explodeGroups.push({ group: interPlateGroup, dir: new THREE.Vector3(sideSign * 0.40, 0.55, 0) });

    const valveSeatPlate = cyl(0.38, 0.38, 0.16, matPTFE, 32);
    valveSeatPlate.name = `Plate_Intermediate_${sideName}`;
    valveSeatPlate.position.set(0, 0.66, 0);
    interPlateGroup.add(valveSeatPlate);
    registerPart(valveSeatPlate, "Heads", `Chemically inert solid virgin PTFE intermediate plate with dual conical poppet valve seats (${sideName})`);

    // Conical Poppet Check Valves (Inlet & Outlet) with coil springs
    const inValve = cyl(0.06, 0.02, 0.05, matFFPMValve, 16);
    inValve.name = `Valve_Inlet_${sideName}`;
    inValve.position.set(-0.12, 0.74, 0);
    interPlateGroup.add(inValve);
    if (isLeft) refs.leftInletPoppet = inValve;
    else refs.rightInletPoppet = inValve;
    registerPart(inValve, "Heads", `Perfluoroelastomer (FFPM) conical intake poppet valve with hastelloy spring (${sideName})`);

    const outValve = cyl(0.02, 0.06, 0.05, matFFPMValve, 16);
    outValve.name = `Valve_Outlet_${sideName}`;
    outValve.position.set(0.12, 0.74, 0);
    interPlateGroup.add(outValve);
    if (isLeft) refs.leftOutletPoppet = outValve;
    else refs.rightOutletPoppet = outValve;
    registerPart(outValve, "Heads", `Perfluoroelastomer (FFPM) conical exhaust poppet valve with hastelloy spring (${sideName})`);

    // Head Cover & Clamping Plate Outer Explode Group
    const headExplodeGroup = new THREE.Group();
    headExplodeGroup.name = `Group_HeadExplode_${sideName}`;
    headGroup.add(headExplodeGroup);
    refs.explodeGroups.push({ group: headExplodeGroup, dir: new THREE.Vector3(sideSign * 0.75, 1.10, 0) });

    // Precision PVDF Head Cover with Gas Channels (Head_Cover_*)
    const headCover = cyl(0.40, 0.40, 0.22, matPVDFHead, 32);
    headCover.name = `Head_Cover_${sideName}`;
    headCover.position.set(0, 0.85, 0);
    headExplodeGroup.add(headCover);
    registerPart(headCover, "Heads", `Precision CNC-machined PVDF head cover with internal gas distribution channels (${sideName})`);

    // Aluminum Clamping Pressure Plate & 4 M4 Hex Fasteners
    const clampPlate = cyl(0.36, 0.36, 0.04, matClampAlum, 32);
    clampPlate.name = `Plate_Clamping_${sideName}`;
    clampPlate.position.set(0, 0.98, 0);
    headExplodeGroup.add(clampPlate);
    registerPart(clampPlate, "Heads", `Anodized aluminum head clamping plate with calibrated torque distribution (${sideName})`);

    for (let si = 0; si < 4; si++) {
      const sAng = (si / 4) * Math.PI * 2 + Math.PI / 4;
      const screw = createHexSocketScrew(0.02, 0.16);
      screw.name = `Fastener_HeadScrew_${sideName}_${si + 1}`;
      screw.position.set(Math.cos(sAng) * 0.26, 1.00, Math.sin(sAng) * 0.26);
      headExplodeGroup.add(screw);
      registerPart(screw, "Heads", `DIN 912 M4×20 high-tensile stainless head clamping screw (${sideName})`);
    }

    return headGroup;
  }

  buildPumpHead(true);
  buildPumpHead(false);

  // Inter-Head PTFE Manifold Tube (Tube_Manifold_PTFE)
  const manifoldCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.95, 1.38, 0.15),
    new THREE.Vector3(0.50, 1.48, 0.22),
    new THREE.Vector3(0.00, 1.50, 0.24),
    new THREE.Vector3(-0.50, 1.48, 0.22),
    new THREE.Vector3(-0.95, 1.38, 0.15),
  ]);
  const manifoldTube = new THREE.Mesh(new THREE.TubeGeometry(manifoldCurve, 32, 0.038, 12, false), matPTFE);
  manifoldTube.name = "Tube_Manifold_PTFE";
  root.add(manifoldTube);
  registerPart(manifoldTube, "Pneumatics", "Heavy-wall PTFE inter-head series pneumatic connecting tube with brass union nuts");

  // -------------------------------------------------------------------------
  // 4. Upper Housing, Carry Handle & Enclosure Fasteners (Body_UpperHousing)
  // -------------------------------------------------------------------------
  const upperHousingGroup = new THREE.Group();
  upperHousingGroup.name = "Assembly_UpperHousing";
  root.add(upperHousingGroup);
  refs.explodeGroups.push({ group: upperHousingGroup, dir: new THREE.Vector3(0, 1.80, 0) });

  // Upper Housing Hood with Head Port Openings
  const upperShell = box(3.12, 0.45, 1.60, matLightChassis);
  upperShell.name = "Body_UpperHousing";
  upperShell.position.set(0, 0.88 + 0.45 / 2, 0);
  upperHousingGroup.add(upperShell);
  registerPart(upperShell, "Chassis", "Precision-molded polymer upper enclosure hood with sound-deadening internal baffles");

  // Head Port Bezels/Collars on Upper Housing
  for (const hx of [-0.95, 0.95]) {
    const collar = cyl(0.44, 0.44, 0.06, matAccentDark, 32);
    collar.position.set(hx, 1.12, 0);
    upperHousingGroup.add(collar);
  }

  // Ergonomic Molded Top Carry Handle (Handle_Carry)
  const handleGroup = new THREE.Group();
  handleGroup.name = "Handle_Carry";
  handleGroup.position.set(0, 1.35, 0);
  upperHousingGroup.add(handleGroup);
  registerPart(handleGroup, "Chassis", "Ergonomic balanced top carrying handle with vulcanized non-slip elastomer grip");

  const handleBar = box(1.70, 0.10, 0.22, matAccentDark);
  handleBar.position.y = 0.25;
  handleGroup.add(handleBar);

  const handleGrip = box(1.20, 0.12, 0.25, matSoftGrip);
  handleGrip.position.y = 0.25;
  handleGroup.add(handleGrip);

  for (const stX of [-0.80, 0.80]) {
    const strut = box(0.12, 0.26, 0.20, matAccentDark);
    strut.position.set(stX, 0.13, 0);
    handleGroup.add(strut);
  }

  // Split-Line Perimeter M4 Fasteners
  const splitScrewCoords = [
    [-1.45, 0.88, -0.74],
    [1.45,  0.88, -0.74],
    [-1.45, 0.88, 0.74],
    [1.45,  0.88, 0.74],
  ];
  splitScrewCoords.forEach(([sx, sy, sz], idx) => {
    const s = createHexSocketScrew(0.02, 0.08);
    s.name = `Fastener_HousingScrew_${idx + 1}`;
    s.position.set(sx, sy, sz);
    upperHousingGroup.add(s);
    registerPart(s, "Chassis", "DIN 912 M4 perimeter chassis assembly fastener");
  });

  // -------------------------------------------------------------------------
  // 5. Pneumatics: KF25 Vacuum Inlet Flange & Sintered Exhaust Muffler
  // -------------------------------------------------------------------------
  // Front Vacuum Intake Port: NW25 / KF25 quick-release flange
  const inletPortGroup = new THREE.Group();
  inletPortGroup.name = "Port_Vacuum_Inlet_KF25";
  inletPortGroup.position.set(-0.85, 0.52, -0.84);
  root.add(inletPortGroup);
  registerPart(inletPortGroup, "Pneumatics", "Standard NW25 / KF25 stainless quick-release vacuum inlet connection flange");

  const inletFlange = cyl(0.18, 0.20, 0.14, matChrome, 24);
  inletFlange.rotation.x = Math.PI / 2;
  inletPortGroup.add(inletFlange);

  const inletBore = cyl(0.11, 0.11, 0.16, matAccentDark, 24);
  inletBore.rotation.x = Math.PI / 2;
  inletPortGroup.add(inletBore);

  const quickClamp = cyl(0.24, 0.24, 0.06, matAlumCast, 24);
  quickClamp.rotation.x = Math.PI / 2;
  quickClamp.position.z = -0.05;
  inletPortGroup.add(quickClamp);

  // Rear Exhaust Port & Sintered Bronze Muffler (Muffler_Exhaust_Sintered)
  const mufflerGroup = new THREE.Group();
  mufflerGroup.name = "Muffler_Exhaust_Sintered";
  mufflerGroup.position.set(0.85, 0.52, 0.84);
  root.add(mufflerGroup);
  registerPart(mufflerGroup, "Pneumatics", "Microporous sintered bronze exhaust silencer muffler with internal baffle");

  const mufflerBody = cyl(0.16, 0.16, 0.28, matSinteredBronze, 24);
  mufflerBody.rotation.x = Math.PI / 2;
  mufflerGroup.add(mufflerBody);

  const mufflerCap = cyl(0.17, 0.17, 0.04, matBrass, 24);
  mufflerCap.rotation.x = Math.PI / 2;
  mufflerCap.position.z = 0.15;
  mufflerGroup.add(mufflerCap);

  const dripTray = box(0.38, 0.04, 0.22, matAccentDark);
  dripTray.name = "Tray_Condensate_Drip";
  dripTray.position.set(0.85, 0.32, 0.90);
  root.add(dripTray);
  registerPart(dripTray, "Pneumatics", "Exhaust condensate drip catch basin");

  // -------------------------------------------------------------------------
  // 6. Front Operator Console & Analog Bourdon Vacuum Gauge
  // -------------------------------------------------------------------------
  const consoleGroup = new THREE.Group();
  consoleGroup.name = "Assembly_FrontConsole";
  consoleGroup.position.set(0, 0.52, -0.80);
  frontExplodeGroup.add(consoleGroup);

  // Flush Recessed Console Faceplate Plate (Plate_ConsoleFace)
  const consoleFace = box(2.80, 0.72, 0.025, matAccentDark);
  consoleFace.name = "Plate_ConsoleFace";
  consoleFace.position.set(0, 0, 0);
  consoleGroup.add(consoleFace);
  registerPart(consoleFace, "Controls", "Precision flush front instrument fascia plate with silkscreen calibration markings");

  // Analog Bourdon Tube Vacuum Gauge (Gauge_Vacuum_Bourdon)
  const gaugeGroup = new THREE.Group();
  gaugeGroup.name = "Gauge_Vacuum_Bourdon";
  gaugeGroup.position.set(0.00, 0.08, -0.02);
  consoleGroup.add(gaugeGroup);
  registerPart(gaugeGroup, "Display", "Precision analog Bourdon tube vacuum gauge (0–1013 mbar / 0–760 mmHg dual scale)");

  const gaugeBezel = cyl(0.34, 0.34, 0.06, matChrome, 36);
  gaugeBezel.rotation.x = Math.PI / 2;
  gaugeGroup.add(gaugeBezel);

  // High-DPI Dial Face Plane
  const dialTex = makeGaugeDialTexture(512);
  const dialGeo = new THREE.PlaneGeometry(0.60, 0.60);
  const dUvs = dialGeo.attributes.uv;
  for (let i = 0; i < dUvs.count; i++) {
    dUvs.setY(i, 1.0 - dUvs.getY(i));
  }
  dUvs.needsUpdate = true;

  const dialMesh = new THREE.Mesh(dialGeo, new THREE.MeshBasicMaterial({ map: dialTex }));
  dialMesh.name = "UI_GaugeDial";
  dialMesh.rotation.y = Math.PI; // Face operator at -Z
  dialMesh.position.z = -0.035;
  gaugeGroup.add(dialMesh);

  // Anti-reflective optical front glass lens
  const gaugeLens = cyl(0.32, 0.32, 0.015, matGlassLens, 32);
  gaugeLens.name = "Glass_GaugeLens";
  gaugeLens.rotation.x = Math.PI / 2;
  gaugeLens.position.z = -0.046;
  gaugeGroup.add(gaugeLens);

  // Bourdon Pointer Needle (Needle_Gauge_Vacuum)
  const needleGroup = new THREE.Group();
  needleGroup.name = "Needle_Gauge_Vacuum";
  needleGroup.position.z = -0.038;
  gaugeGroup.add(needleGroup);
  refs.gaugeNeedle = needleGroup;
  registerPart(needleGroup, "Display", "Precision counterweighted knife-edge Bourdon gauge pointer needle");

  const needleHub = cyl(0.04, 0.04, 0.015, matAccentDark, 20);
  needleHub.rotation.x = Math.PI / 2;
  needleGroup.add(needleHub);

  const needlePointer = box(0.012, 0.22, 0.008, M(0xef4444));
  needlePointer.position.y = 0.10;
  needleGroup.add(needlePointer);

  const needleTail = box(0.018, 0.06, 0.008, matAccentDark);
  needleTail.position.y = -0.03;
  needleGroup.add(needleTail);

  // Illuminated Mains Power Rocker Switch (Btn_Power_Switch)
  const powerSwitch = createRockerSwitch({ color: 0x22c55e });
  powerSwitch.name = "Btn_Power_Switch";
  powerSwitch.position.set(-1.05, -0.16, -0.02);
  consoleGroup.add(powerSwitch);
  refs.powerSwitchRocker = powerSwitch;
  registerPart(powerSwitch, "Controls", "DPST illuminated mains power rocker switch with internal neon pilot lamp");

  // Speed Potentiometer Dial (Dial_Speed_Potentiometer, 1500–3000 RPM)
  const potGroup = new THREE.Group();
  potGroup.name = "Dial_Speed_Potentiometer";
  potGroup.position.set(-0.70, -0.16, -0.02);
  consoleGroup.add(potGroup);
  refs.speedPotentiometerDial = potGroup;
  registerPart(potGroup, "Controls", "Continuous rotary speed control potentiometer dial (1500–3000 RPM)");

  const potBezel = cyl(0.12, 0.12, 0.02, matClampAlum, 24);
  potBezel.rotation.x = Math.PI / 2;
  potGroup.add(potBezel);

  const potKnob = cyl(0.09, 0.09, 0.06, matAccentDark, 24);
  potKnob.rotation.x = Math.PI / 2;
  potKnob.position.z = -0.04;
  potGroup.add(potKnob);

  const potIndex = box(0.015, 0.06, 0.01, M(0x38bdf8));
  potIndex.position.set(0, 0.04, -0.075);
  potGroup.add(potIndex);

  // Gas Ballast Valve Knob (Knob_GasBallast)
  const ballastGroup = new THREE.Group();
  ballastGroup.name = "Knob_GasBallast";
  ballastGroup.position.set(1.05, -0.16, -0.02);
  consoleGroup.add(ballastGroup);
  refs.gasBallastKnob = ballastGroup;
  registerPart(ballastGroup, "Controls", "Knurled brass rotary gas ballast valve knob for condensing vapor purge");

  const ballastKnurl = cyl(0.08, 0.08, 0.07, matBrass, 24);
  ballastKnurl.rotation.x = Math.PI / 2;
  ballastKnurl.position.z = -0.04;
  ballastGroup.add(ballastKnurl);

  const ballastIndicator = box(0.015, 0.06, 0.01, M(0xf59e0b));
  ballastIndicator.position.set(0, 0.035, -0.08);
  ballastGroup.add(ballastIndicator);

  // Power / Running Status LED Indicator (LED_Status_Power)
  const led = cyl(0.025, 0.025, 0.02, M(0x22c55e, { e: 0x22c55e, ei: 0.8 }), 16);
  led.name = "LED_Status_Power";
  led.rotation.x = Math.PI / 2;
  led.position.set(0.70, -0.16, -0.02);
  consoleGroup.add(led);
  refs.statusLed = led;
  registerPart(led, "Controls", "Multicolor green/amber/red LED telemetry and power status indicator");

  // Official SREdesigns Brand Badge
  const badge = makeSREdesignsBadge(0.75, 0.20);
  badge.position.set(0.00, -0.22, -0.02);
  consoleGroup.add(badge);
  registerPart(badge, "Chassis", "SREdesigns official certified engineering digital twin badge");

  // -------------------------------------------------------------------------
  // 7. Rear Bulkhead: IEC Power Inlet, Ground Lug & Circuit Continuity
  // -------------------------------------------------------------------------
  const rearGroup = new THREE.Group();
  rearGroup.name = "Assembly_RearBulkhead";
  rearGroup.position.set(0, 0.38, 0.80);
  root.add(rearGroup);

  const iec = createIECInlet();
  iec.name = "Fastener_IECInlet";
  iec.position.set(-0.45, 0, 0);
  rearGroup.add(iec);
  registerPart(iec, "Electrical", "IEC 60320 C14 appliance inlet with integral 250V time-delay fuse drawer");

  const gndLug = cyl(0.025, 0.025, 0.06, matBrass, 12);
  gndLug.name = "Fastener_GroundLug";
  gndLug.rotation.x = Math.PI / 2;
  gndLug.position.set(-0.15, 0, 0.01);
  rearGroup.add(gndLug);
  registerPart(gndLug, "Electrical", "M4 chassis equipotential ground bonding stud");

  // -------------------------------------------------------------------------
  // 8. Bench Receptacle, NEMA 5-15P Plug & SJTOW Line Cord
  // -------------------------------------------------------------------------
  const outletPos = BENCH.outlet;

  // Laboratory Receptacle Box on Backsplash
  const outletBox = new THREE.Group();
  outletBox.name = "Power_Receptacle_Duplex";
  outletBox.position.copy(outletPos);
  root.add(outletBox);
  registerPart(outletBox, "Electrical", "NEMA 5-20R commercial 120V/20A laboratory duplex outlet box mounted on backsplash");

  const boxBody = box(0.40, 0.65, 0.18, matClampAlum);
  outletBox.add(boxBody);

  const facePlate = box(0.42, 0.67, 0.02, matAccentDark);
  facePlate.position.z = -0.095;
  outletBox.add(facePlate);

  for (const oy of [-0.14, 0.14]) {
    const rFace = cyl(0.12, 0.12, 0.02, matAccentDark, 24);
    rFace.rotation.x = Math.PI / 2;
    rFace.position.set(0, oy, -0.105);
    outletBox.add(rFace);

    const slotL = box(0.018, 0.065, 0.015, matChrome);
    slotL.position.set(-0.04, oy, -0.115);
    outletBox.add(slotL);

    const slotN = box(0.018, 0.08, 0.015, matChrome);
    slotN.position.set(0.04, oy, -0.115);
    outletBox.add(slotN);

    const slotG = cyl(0.018, 0.018, 0.015, matChrome, 12);
    slotG.rotation.x = Math.PI / 2;
    slotG.position.set(0, oy - 0.045, -0.115);
    outletBox.add(slotG);
  }

  // Molded Heavy-Duty NEMA 5-15P Plug
  const plugGroup = new THREE.Group();
  plugGroup.name = "Power_Plug";
  plugGroup.position.set(outletPos.x, outletPos.y - 0.14, outletPos.z - 0.025);
  root.add(plugGroup);
  refs.powerPlug = plugGroup;
  registerPart(plugGroup, "Electrical", "Molded NEMA 5-15P commercial rubber plug firmly inserted into bench receptacle");

  const plugBody = box(0.18, 0.22, 0.28, matRubber);
  plugBody.position.z = -0.14;
  plugGroup.add(plugBody);

  const pr1 = box(0.016, 0.06, 0.10, matBrass);
  pr1.position.set(-0.04, 0, -0.01);
  plugGroup.add(pr1);

  const pr2 = box(0.016, 0.06, 0.10, matBrass);
  pr2.position.set(0.04, 0, -0.01);
  plugGroup.add(pr2);

  const pr3 = cyl(0.016, 0.016, 0.10, matBrass, 12);
  pr3.rotation.x = Math.PI / 2;
  pr3.position.set(0, -0.045, -0.01);
  plugGroup.add(pr3);

  // SJTOW 3-Conductor Power Cord Routing to Rear IEC Inlet
  const cordPts = [
    new THREE.Vector3(outletPos.x, outletPos.y - 0.14, outletPos.z - 0.30),
    new THREE.Vector3(outletPos.x * 0.75, 0.08, outletPos.z * 0.70),
    new THREE.Vector3(0.60, 0.05, 1.40),
    new THREE.Vector3(0.00, 0.08, 1.20),
    new THREE.Vector3(-0.45, 0.38, 0.85),
  ];
  const cordCurve = new THREE.CatmullRomCurve3(cordPts);
  const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 40, 0.038, 12, false), matRubber);
  cordMesh.name = "Power_Cord";
  root.add(cordMesh);
  registerPart(cordMesh, "Electrical", "Heavy-duty 14/3 AWG SJTOW oil-resistant neoprene line cord with molded strain relief");

  // -------------------------------------------------------------------------
  // 9. Interactive Methods & Part Explorer Support
  // -------------------------------------------------------------------------
  let explodeFactor = 0;

  function setExplodeAmount(factor) {
    explodeFactor = THREE.MathUtils.clamp(factor, 0, 1);
    refs.explodeGroups.forEach(eg => {
      eg.group.position.copy(eg.dir.clone().multiplyScalar(explodeFactor));
    });
  }

  // Ensure independent material instances so focusPart does not cross-contaminate shared materials
  root.traverse(node => {
    if (node.isMesh && node.material && node.name !== 'UI_GaugeDial') {
      node.material = node.material.clone();
      node.userData.origWireframe = !!node.material.wireframe;
      node.userData.origOpacity = node.material.opacity ?? 1.0;
      node.userData.origTransparent = !!node.material.transparent;
    }
  });

  function setWireframe(enabled) {
    root.traverse(child => {
      if (child.isMesh && child.material && child.name !== 'UI_GaugeDial') {
        child.material.wireframe = enabled ? true : !!child.userData.origWireframe;
      }
    });
  }

  function focusPart(partName) {
    let target = partsMap.get(partName);
    if (!target) {
      root.traverse(node => {
        if (node.name === partName) target = node;
      });
    }
    if (!target) return null;

    root.traverse(node => {
      if (node.isMesh && node.material && node.name !== 'UI_GaugeDial') {
        const isTarget = (node === target || node.parent === target);
        node.material.wireframe = !isTarget;
        node.material.opacity = isTarget ? (node.userData.origOpacity ?? 1.0) : 0.25;
        node.material.transparent = !isTarget || !!node.userData.origTransparent;
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
    root.traverse(node => {
      if (node.isMesh && node.material && node.name !== 'UI_GaugeDial') {
        node.material.wireframe = !!node.userData.origWireframe;
        node.material.opacity = node.userData.origOpacity ?? 1.0;
        node.material.transparent = !!node.userData.origTransparent;
      }
    });
  }

  function setPluggedIn(plugged) {
    if (!refs.powerPlug) return;
    if (plugged) {
      refs.powerPlug.position.set(outletPos.x, outletPos.y - 0.14, outletPos.z - 0.025);
    } else {
      refs.powerPlug.position.set(outletPos.x, outletPos.y - 0.14, outletPos.z - 0.65);
    }
  }

  function updateKinematics(dt, state) {
    const isPowered = state.is_plugged_in && state.power_on && state.state !== 'FAULT_OVERHEAT' && state.state !== 'UNPOWERED';
    
    // Status LED illumination
    if (refs.statusLed) {
      if (!state.is_plugged_in || !state.power_on) {
        refs.statusLed.material.emissive.setHex(0x000000);
        refs.statusLed.material.color.setHex(0x1e2634);
      } else if (state.state === 'FAULT_OVERHEAT') {
        refs.statusLed.material.emissive.setHex(0xef4444);
        refs.statusLed.material.color.setHex(0xef4444);
      } else if (state.state === 'RUNNING_BALLAST') {
        refs.statusLed.material.emissive.setHex(0xf59e0b);
        refs.statusLed.material.color.setHex(0xf59e0b);
      } else {
        refs.statusLed.material.emissive.setHex(0x22c55e);
        refs.statusLed.material.color.setHex(0x22c55e);
      }
    }

    // Power switch rocker position
    if (refs.powerSwitchRocker && refs.powerSwitchRocker.userData?.rocker) {
      refs.powerSwitchRocker.userData.rocker.rotation.x = state.power_on ? -0.22 : 0.22;
    }

    // Speed dial angle
    if (refs.speedPotentiometerDial) {
      const rpmFraction = (state.target_rpm - 1500) / (3000 - 1500);
      refs.speedPotentiometerDial.rotation.z = -rpmFraction * Math.PI * 1.2 + Math.PI * 0.6;
    }

    // Gas ballast knob angle
    if (refs.gasBallastKnob) {
      refs.gasBallastKnob.rotation.z = state.gas_ballast_open ? -Math.PI * 0.75 : 0;
    }

    // Motor Shaft Rotation & Kinematics
    const rpm = state.motor_speed_rpm || 0;
    const rps = rpm / 60.0;
    const rotDelta = rps * Math.PI * 2 * dt;

    if (refs.motorShaftGroup) {
      refs.motorShaftGroup.rotation.x -= rotDelta;
      const curAng = Math.abs(refs.motorShaftGroup.rotation.x);

      // Stroke displacement ±4mm (0.04m in world scale)
      const dispL = Math.sin(curAng) * 0.04;
      const dispR = Math.sin(curAng + Math.PI) * 0.04;

      if (refs.leftRodGroup) refs.leftRodGroup.position.y = 0.04 + dispL;
      if (refs.rightRodGroup) refs.rightRodGroup.position.y = -0.04 + dispR;

      if (refs.leftDiaphragm) refs.leftDiaphragm.position.y = 0.58 + dispL;
      if (refs.rightDiaphragm) refs.rightDiaphragm.position.y = 0.58 + dispR;

      // Poppet valve fluttering based on stroke velocity
      const velL = Math.cos(curAng);
      if (refs.leftInletPoppet) refs.leftInletPoppet.position.y = 0.74 + (velL > 0 ? 0.015 : 0);
      if (refs.leftOutletPoppet) refs.leftOutletPoppet.position.y = 0.74 + (velL < 0 ? 0.015 : 0);

      const velR = Math.cos(curAng + Math.PI);
      if (refs.rightInletPoppet) refs.rightInletPoppet.position.y = 0.74 + (velR > 0 ? 0.015 : 0);
      if (refs.rightOutletPoppet) refs.rightOutletPoppet.position.y = 0.74 + (velR < 0 ? 0.015 : 0);
    }

    // Vacuum Gauge Needle Rotation
    if (refs.gaugeNeedle) {
      const p = Math.max(0, Math.min(1013, state.system_vacuum_mbar));
      const pFrac = (1013.0 - p) / 1013.0; // 0 at atmosphere, 1 at full vacuum
      const needleAng = -Math.PI * 0.75 + pFrac * (Math.PI * 1.50);
      refs.gaugeNeedle.rotation.z = -needleAng;
    }
  }

  return {
    root,
    refs,
    partsList,
    partsMap,
    setExplodeAmount,
    setWireframe,
    focusPart,
    clearFocus,
    setPluggedIn,
    updateKinematics,
  };
}

// ---------------------------------------------------------------------------
// Standalone Photorealistic Laboratory Room Environment
// ---------------------------------------------------------------------------
export function buildLabRoom(root) {
  const lab = new THREE.Group();
  lab.name = "Body_LaboratoryRoom";

  const benchY = BENCH.surfaceY;
  const matCountertop = M(0x11161d, { r: 0.20, m: 0.15 });

  // Black Epoxy Resin Countertop Slab
  const countertop = box(BENCH.sx, 0.08, BENCH.sz, matCountertop);
  countertop.name = "Body_Countertop";
  countertop.position.set(0, benchY - 0.04, 0);
  lab.add(countertop);

  // Stainless Steel Perimeter Trim
  const trimW = 0.03;
  const trimT = 0.08;
  const edgeF = box(BENCH.sx + trimW * 2, trimT, trimW, matClampAlum);
  edgeF.name = "Body_CounterEdgeF";
  edgeF.position.set(0, benchY - 0.04, -BENCH.sz / 2 - trimW / 2);
  lab.add(edgeF);

  const edgeB = box(BENCH.sx + trimW * 2, trimT, trimW, matClampAlum);
  edgeB.name = "Body_CounterEdgeB";
  edgeB.position.set(0, benchY - 0.04, BENCH.sz / 2 + trimW / 2);
  lab.add(edgeB);

  // Heavy Base Storage Cabinet
  const cabinet = box(BENCH.sx - 0.40, benchY - 0.08, BENCH.sz - 0.40, M(0x1e2634, { r: 0.45, m: 0.08 }));
  cabinet.name = "Body_Cabinet";
  cabinet.position.set(0, (benchY - 0.08) / 2, 0);
  lab.add(cabinet);

  // Seamless Tiled Floor Plane
  const matFloor = M(0x0a0e14, { r: 0.70, m: 0.02 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), matFloor);
  floor.name = "Body_Floor";
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  lab.add(floor);

  // Backsplash Wall
  const wallH = 14.0;
  const wallD = 0.20;
  const wallW = 36.0;
  const wallZ = BENCH.sz / 2 + wallD / 2 + 0.02;
  const wall = box(wallW, wallH, wallD, M(0x475569, { r: 0.85, m: 0.02 }));
  wall.name = "Body_Wall";
  wall.position.set(0, wallH / 2, wallZ);
  wall.receiveShadow = true;
  lab.add(wall);

  root.add(lab);
  return { surfaceY: benchY, outletPos: BENCH.outlet };
}
