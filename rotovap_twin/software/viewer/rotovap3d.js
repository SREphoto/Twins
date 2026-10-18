/**
 * SREdesigns BÜCHI Rotavapor R-300 Class Rotary Evaporator Twin
 * Full Gold-Standard Procedural Three.js Twin Architecture
 * 
 * Exhaustive Procedural Detail & Semantic Part Taxonomy:
 * - Structural unibody casting base (Body_BasePlate) with dual bath T-slots & leveling feet at Y = 0
 * - Motorized lift mechanism (Assembly_LiftTower): extruded column, dual chrome steel guide shafts (Ø16mm),
 *   Acme lead screw (Tr 14x3), geared DC stepper lift motor with optical encoder, limit microswitches,
 *   linear ball carriage with bronze traveling nut, and articulated igus cable drag chain
 * - Rotary Drive Unit (Assembly_DriveHead): 35° contoured casting with genuine 3D BLDC motor interior
 *   (12-pole laminated silicon steel stator, individual wound copper coil wire packs, permanent magnet rotor,
 *   deep-groove stainless ball bearings, radial slotted optical encoder disc, hardened steel worm gear & bronze worm wheel)
 * - Hollow stainless spindle, borosilicate glass vapor duct (NS 29/32), PTFE/PE composite vacuum lip seal,
 *   cobalt blue Büchi Combi-Clip quick-release mechanism
 * - 1000 mL pear-shaped evaporating flask with rotational climbing film & parabolic liquid vortex
 * - Vertical double-spiral coiled condenser (1500 cm²) with GL-14 ports, 3-way manifold & aeration stopcock
 * - 1000 mL spherical receiving flask with S 35/20 ball joint clamp & animated distillate drip drops
 * - Heating Bath B-300: deep-drawn 316L stainless outer bowl, dual silicone handles, non-stick PTFE basin,
 *   calrod tubular heating ring in bottom trough, PT1000 temperature probe, gold spring-loaded pogo-pin base contacts,
 *   and front circular OLED local display
 * - I-300 Pro Touchscreen Controller: articulated support arm, 7.0" dynamic Canvas LCD quad (UI_LCD) with
 *   anti-reflective glass lens, knurled push-turn rotary dial, tactile action keys, internal FR4 motherboard with
 *   ARM Cortex MCU and BUCHI COM bus cable
 * - Laboratory bench duplex receptacle (Power_Receptacle_Duplex), molded NEMA 5-15P plug & SJTOW power cord
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
// Standard PBR Material Palette
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

const matWhiteChassis   = M(0xf8fafc, { r: 0.28, m: 0.05 });
const matDarkChassis    = M(0x181e28, { r: 0.42, m: 0.18 });
const matAlumBrushed    = M(0xc8d0dc, { r: 0.25, m: 0.85 });
const matChrome         = M(0xf1f5f9, { r: 0.08, m: 0.95 });
const matSteelBrushed   = M(0x94a3b8, { r: 0.30, m: 0.75 });
const matLeadScrew      = M(0x71717a, { r: 0.38, m: 0.85 });
const matBronze         = M(0xcd7f32, { r: 0.32, m: 0.82 });
const matCopperWindings = M(0xb85d19, { r: 0.25, m: 0.85 });
const matStatorIron     = M(0x334155, { r: 0.45, m: 0.65 });
const matNeodymium      = M(0x475569, { r: 0.15, m: 0.90 });
const matPtfeBlack      = M(0x0f172a, { r: 0.80, m: 0.02 }); // PTFE non-stick coating
const matBathSteel      = M(0x64748b, { r: 0.25, m: 0.70 });
const matRubber         = M(0x0f1218, { r: 0.90, m: 0.02 });
const matBrass          = M(0xd97706, { r: 0.25, m: 0.88 });
const matGoldContact    = M(0xfbbf24, { r: 0.20, m: 0.92 });
const matGlassClear     = M(0xf8fafc, { r: 0.02, m: 0.05, o: 0.22 });
const matWater          = M(0x38bdf8, { r: 0.06, m: 0.02, o: 0.75 });
const matSolventAmber   = M(0xf59e0b, { r: 0.08, m: 0.04, o: 0.82 });
const matDistillate     = M(0xe0f2fe, { r: 0.04, m: 0.02, o: 0.70 });
const matCoolantBlue    = M(0x06b6d4, { r: 0.08, m: 0.10, o: 0.80 });
const matBuchiCobalt    = M(0x1d4ed8, { r: 0.35, m: 0.12 }); // BÜCHI signature cobalt blue
const matPCBGreen       = M(0x065f46, { r: 0.35, m: 0.30 });
const matSiliconIC      = M(0x111827, { r: 0.20, m: 0.60 });

// Geometry generation primitives
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
// Standing Lab Counter Datum & Receptacle Coordinates
// Datum: Instrument rests at Y = 0 local; Lab Benchtop is at Y = 9.00 world
// ---------------------------------------------------------------------------
export const BENCH = {
  cx: 0.0,
  cz: 0.0,
  sx: 11.0,
  sz: 6.2,
  bodyH: 8.30,
  topT: 0.70,
  get surfaceY() {
    return this.bodyH + this.topT; // 9.00 units = 900 mm standing datum
  },
  get outlet() {
    return {
      x: 1.80,
      y: this.surfaceY + 0.65,
      z: 2.92,
    };
  },
};

// ---------------------------------------------------------------------------
// Standard Camera Viewpoint Presets
// ---------------------------------------------------------------------------
export const CAM_ISO = {
  position: new THREE.Vector3(7.50, BENCH.surfaceY + 5.50, -9.50),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 2.40, 0.00),
};

export const CAM_FRONT = {
  position: new THREE.Vector3(0.00, BENCH.surfaceY + 2.80, -13.00),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 2.40, 0.00),
};

export const CAM_SIDE = {
  position: new THREE.Vector3(-13.00, BENCH.surfaceY + 2.80, 0.00),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 2.40, 0.00),
};

export const CAM_TOP = {
  position: new THREE.Vector3(0.00, BENCH.surfaceY + 14.50, -0.01),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 2.00, 0.00),
};

export const CAM_EXPLODED = {
  position: new THREE.Vector3(8.50, BENCH.surfaceY + 6.50, -10.50),
  target: new THREE.Vector3(0.00, BENCH.surfaceY + 2.60, 0.00),
};

export const CAM_CONSOLE = {
  position: new THREE.Vector3(-1.25, BENCH.surfaceY + 1.60, -2.20),
  target: new THREE.Vector3(-1.25, BENCH.surfaceY + 1.35, -0.60),
};

export const CAM_MOTOR_INTERIOR = {
  position: new THREE.Vector3(1.60, BENCH.surfaceY + 2.30, -1.60),
  target: new THREE.Vector3(1.25, BENCH.surfaceY + 1.70, -0.05),
};

// ---------------------------------------------------------------------------
// SREdesigns Canonical Laboratory Badge
// ---------------------------------------------------------------------------
export function makeSREdesignsBadge(plateW = 0.85, plateH = 0.22) {
  const g = new THREE.Group();
  g.name = "Badge_SREdesigns";

  const plateD = 0.025;
  const bezel = box(plateW + 0.04, plateH + 0.04, 0.015, matDarkChassis);
  bezel.position.z = -0.002;
  g.add(bezel);

  const plate = box(plateW, plateH, plateD, matSteelBrushed);
  g.add(plate);

  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "#0c1016";
  ctx.fillRect(0, 0, 512, 128);

  // Outer high-precision teal border
  ctx.strokeStyle = "#00d4e8";
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, 500, 116);

  // S-R-E Letters
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 44px -apple-system, sans-serif";
  ctx.fillText("SREdesigns", 256, 48);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 20px monospace";
  ctx.fillText("BÜCHI R-300 DIGITAL TWIN", 256, 92);

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
  face.position.z = plateD / 2 + 0.005;
  g.add(face);

  return g;
}

// ---------------------------------------------------------------------------
// Model Factory & Semantic Assembly
// ---------------------------------------------------------------------------
export function createRotovapModel() {
  const root = new THREE.Group();
  root.name = "Body_RotovapSystem";

  const refs = {
    liftCarriage: null,
    rotatingDriveShaft: null,
    rotatingFlaskGroup: null,
    flaskLiquidMesh: null,
    receiverLiquidMesh: null,
    bathLiquidMesh: null,
    dripMesh: null,
    controllerLcdMesh: null,
    bathGroup: null,
    bathPogoPins: null,
    motorExplodeCover: null,
    motorInternalAssembly: null,
    controllerExplodeFace: null,
    towerExplodeCap: null,
    condenserAssembly: null,
    powerPlug: null,
    dragChainMesh: null,
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
  // 1. Heavy Base Platform & Leveling System (resting at Y = 0 on bench surface)
  // -------------------------------------------------------------------------
  const baseGroup = new THREE.Group();
  baseGroup.name = "Assembly_BasePlatform";
  root.add(baseGroup);

  // Cast Aluminum Unibody Base Casting (Body_BasePlate)
  // Height 0.28, bottom at Y = 0.08 above leveling foot pad
  const baseCasting = box(4.40, 0.26, 3.40, matWhiteChassis);
  baseCasting.name = "Body_BasePlate";
  baseCasting.position.set(0, 0.21, 0);
  baseGroup.add(baseCasting);
  registerPart(baseCasting, "Chassis", "Heavy die-cast aluminum base unibody casting with integrated bath guide tracks");

  // Anodized Aluminum Top Deck Pan
  const deckPan = box(4.44, 0.03, 3.44, matAlumBrushed);
  deckPan.name = "Plate_BaseDeck";
  deckPan.position.set(0, 0.355, 0);
  baseGroup.add(deckPan);
  registerPart(deckPan, "Chassis", "Precision-machined brushed aluminum top deck plate with spill perimeter rim");

  // Dual Machined T-Slots on Right Side for Heating Bath Slide Alignment
  for (const tOffset of [-0.45, 0.45]) {
    const tSlot = box(0.12, 0.015, 2.20, matDarkChassis);
    tSlot.name = `Slot_BathGuide_${tOffset < 0 ? 'Front' : 'Rear'}`;
    tSlot.position.set(1.20, 0.372, tOffset);
    baseGroup.add(tSlot);
    registerPart(tSlot, "Chassis", "Precision T-slot guide track for heating bath positioning");
  }

  // Base Electrical Pogo-Pin Contact Receiver Pads for Heating Bath
  const pogoReceiver = box(0.35, 0.02, 0.25, matDarkChassis);
  pogoReceiver.name = "Contact_BaseReceiverPads";
  pogoReceiver.position.set(1.20, 0.375, -0.85);
  baseGroup.add(pogoReceiver);
  registerPart(pogoReceiver, "Electrical", "Gold-plated base contact pads for wireless heating bath electrical continuity");

  for (let pi = -0.10; pi <= 0.10; pi += 0.07) {
    const pad = cyl(0.018, 0.018, 0.008, matGoldContact, 16);
    pad.position.set(1.20 + pi, 0.388, -0.85);
    baseGroup.add(pad);
  }

  // 4 Knurled Brass Leveling Feet (Foot_Leveling_*) resting at Y = 0 local
  const footCoords = [
    [-1.85, -1.35, "Foot_Leveling_FrontLeft"],
    [1.85, -1.35, "Foot_Leveling_FrontRight"],
    [-1.85, 1.35, "Foot_Leveling_RearLeft"],
    [1.85, 1.35, "Foot_Leveling_RearRight"],
  ];
  footCoords.forEach(([fx, fz, fId]) => {
    const footGroup = new THREE.Group();
    footGroup.name = fId;
    footGroup.position.set(fx, 0, fz);
    baseGroup.add(footGroup);
    registerPart(footGroup, "Chassis", "Vibration-damping vulcanized rubber foot with knurled brass leveling thumbwheel");

    const rubberPad = cyl(0.18, 0.20, 0.05, matRubber, 24);
    rubberPad.position.y = 0.025;
    footGroup.add(rubberPad);

    const brassKnurl = cyl(0.20, 0.20, 0.035, matBrass, 24);
    brassKnurl.position.y = 0.065;
    footGroup.add(brassKnurl);

    const steelStud = cyl(0.04, 0.04, 0.08, matChrome, 16);
    steelStud.position.y = 0.10;
    footGroup.add(steelStud);
  });

  // Rear Bulkhead Connectors (+Z)
  const iec = createIECInlet();
  iec.name = "Fastener_IECInlet";
  iec.rotation.y = Math.PI;
  iec.position.set(0.35, 0.22, 1.71);
  baseGroup.add(iec);
  registerPart(iec, "Electrical", "IEC 60320 C14 appliance power inlet with integrated 5x20mm dual fuse drawer");

  const mainsRocker = createRockerSwitch({ orientation: 'vertical', frameColor: 0x181a1e, rockerColor: 0x22c55e });
  mainsRocker.name = "Btn_MainsSwitch";
  mainsRocker.rotation.y = Math.PI;
  mainsRocker.position.set(-0.35, 0.22, 1.71);
  baseGroup.add(mainsRocker);
  registerPart(mainsRocker, "Controls", "Illuminated high-current green mains power rocker switch");

  const gndLug = cyl(0.025, 0.025, 0.06, matBrass, 12);
  gndLug.name = "Fastener_GroundLug";
  gndLug.rotation.x = Math.PI / 2;
  gndLug.position.set(0.85, 0.22, 1.72);
  baseGroup.add(gndLug);
  registerPart(gndLug, "Electrical", "Chassis equipotential ground bonding terminal stud");

  // Front Brand Nameplates (-Z)
  const sredesignsBadge = makeSREdesignsBadge(0.85, 0.22);
  sredesignsBadge.position.set(-0.40, 0.22, -1.71);
  sredesignsBadge.rotation.y = Math.PI;
  baseGroup.add(sredesignsBadge);
  registerPart(sredesignsBadge, "Chassis", "SREdesigns official certified engineering digital twin badge");

  const buchiPlate = box(1.30, 0.16, 0.02, matDarkChassis);
  buchiPlate.name = "Plate_Brand_Buchi";
  buchiPlate.position.set(0.95, 0.22, -1.71);
  baseGroup.add(buchiPlate);
  registerPart(buchiPlate, "Chassis", "BÜCHI Rotavapor R-300 brushed aluminum front nameplate");

  // -------------------------------------------------------------------------
  // 2. Motorized Vertical Lift Column (Assembly_LiftTower)
  // -------------------------------------------------------------------------
  const towerGroup = new THREE.Group();
  towerGroup.name = "Assembly_LiftTower";
  towerGroup.position.set(-1.05, 0.36, 0.20);
  root.add(towerGroup);

  // Tower Mounting Base Flange with 4 Genuine DIN 912 Socket Screws
  const towerBaseFlange = box(1.15, 0.08, 1.05, matDarkChassis);
  towerBaseFlange.name = "Flange_TowerMounting";
  towerBaseFlange.position.y = 0.04;
  towerGroup.add(towerBaseFlange);
  registerPart(towerBaseFlange, "Lift", "Structural steel tower base mounting flange");

  for (const sx of [-0.42, 0.42]) {
    for (const sz of [-0.38, 0.38]) {
      const screw = createHexSocketScrew(0.022, 0.08);
      screw.position.set(sx, 0.08, sz);
      towerGroup.add(screw);
      const washer = createWasher(0.023, 0.045, 0.008);
      washer.position.set(sx, 0.08, sz);
      towerGroup.add(washer);
    }
  }

  // Main Aluminum Extruded Guide Column (Tower_Extrusion_Aluminum, H = 5.20)
  const columnH = 5.20;
  const towerExtrusion = box(0.92, columnH, 0.85, matWhiteChassis);
  towerExtrusion.name = "Tower_Extrusion_Aluminum";
  towerExtrusion.position.y = columnH / 2 + 0.08;
  towerGroup.add(towerExtrusion);
  registerPart(towerExtrusion, "Lift", "High-rigidity aluminum profile column with internal cable routing channels");

  // Dual Hardened Chrome Steel Linear Guide Shafts (Ø16mm, Shaft_GuideRail_*)
  for (const sx of [-0.22, 0.22]) {
    const railName = sx < 0 ? "Shaft_GuideRail_Left" : "Shaft_GuideRail_Right";
    const rail = cyl(0.04, 0.04, 5.00, matChrome, 24);
    rail.name = railName;
    rail.position.set(sx, 2.65, -0.42);
    towerGroup.add(rail);
    registerPart(rail, "Lift", "Induction-hardened chrome steel linear guide shaft (Ø16mm, h6 tolerance)");
  }

  // Precision Stainless Steel Acme Lead Screw (Screw_LeadScrew_Acme, Tr 14x3)
  const leadScrew = cyl(0.055, 0.055, 5.00, matLeadScrew, 24);
  leadScrew.name = "Screw_LeadScrew_Acme";
  leadScrew.position.set(0, 2.65, -0.42);
  towerGroup.add(leadScrew);
  registerPart(leadScrew, "Lift", "High-precision trapezoidal Acme lead screw (Tr 14x3) with bronze traveling nut");

  // 24V DC Geared Stepper Lift Motor at Column Base
  const liftMotorGroup = new THREE.Group();
  liftMotorGroup.name = "Motor_Lift_Stepper";
  liftMotorGroup.position.set(0, 0.35, -0.15);
  towerGroup.add(liftMotorGroup);
  registerPart(liftMotorGroup, "Lift", "24V DC geared stepper lift motor with integrated optical encoder and worm drive");

  const liftMotorBody = box(0.45, 0.55, 0.45, matDarkChassis);
  liftMotorGroup.add(liftMotorBody);
  const liftMotorShaft = cyl(0.03, 0.03, 0.15, matSteelBrushed, 16);
  liftMotorShaft.position.y = 0.32;
  liftMotorGroup.add(liftMotorShaft);

  // Upper & Lower Travel Limit Detent Microswitches
  const limitUpper = box(0.08, 0.12, 0.06, M(0xd97706, { r: 0.4 }));
  limitUpper.name = "Switch_Limit_Upper";
  limitUpper.position.set(0.32, 5.10, -0.42);
  towerGroup.add(limitUpper);
  registerPart(limitUpper, "Lift", "Upper electrical limit microswitch with roller actuator arm");

  const limitLower = box(0.08, 0.12, 0.06, M(0xd97706, { r: 0.4 }));
  limitLower.name = "Switch_Limit_Lower";
  limitLower.position.set(0.32, 0.35, -0.42);
  towerGroup.add(limitLower);
  registerPart(limitLower, "Lift", "Lower electrical limit microswitch with roller actuator arm");

  // Top Actuator Enclosure Cap (separates in exploded view)
  const towerCapGroup = new THREE.Group();
  towerCapGroup.name = "Cap_TowerActuator";
  towerCapGroup.position.set(0, columnH + 0.08, 0);
  towerGroup.add(towerCapGroup);
  refs.towerExplodeCap = towerCapGroup;

  const topCap = box(0.96, 0.22, 0.88, matDarkChassis);
  topCap.name = "Body_TowerTopCap";
  topCap.position.y = 0.11;
  towerCapGroup.add(topCap);
  registerPart(topCap, "Lift", "Molded polymer top tower enclosure cap with manual lift release button");

  const manualReleaseBtn = cyl(0.16, 0.16, 0.08, matAlumBrushed, 24);
  manualReleaseBtn.name = "Btn_ManualLiftRelease";
  manualReleaseBtn.position.y = 0.24;
  towerCapGroup.add(manualReleaseBtn);
  registerPart(manualReleaseBtn, "Controls", "Emergency manual lift release button for safe power-failure flask extraction");

  // -------------------------------------------------------------------------
  // 3. Motorized Lift Carriage Assembly (Assembly_LiftCarriage)
  // -------------------------------------------------------------------------
  const liftCarriageGroup = new THREE.Group();
  liftCarriageGroup.name = "Assembly_LiftCarriage";
  liftCarriageGroup.position.set(-1.05, 0.36 + 0.45, 0.20);
  root.add(liftCarriageGroup);
  refs.liftCarriage = liftCarriageGroup;

  // Rigid Linear Guide Carriage Casting (Carriage_Linear_Casting)
  const carriageCasting = box(1.05, 1.25, 0.82, matDarkChassis);
  carriageCasting.name = "Carriage_Linear_Casting";
  carriageCasting.position.set(0, 1.45, -0.28);
  liftCarriageGroup.add(carriageCasting);
  registerPart(carriageCasting, "Lift", "Heavy die-cast linear guide carriage with recirculating ball bushings");

  // Bronze Lead Screw Traveling Drive Nut (Nut_Bronze_LeadScrew)
  const bronzeNut = cyl(0.08, 0.08, 0.22, matBronze, 24);
  bronzeNut.name = "Nut_Bronze_LeadScrew";
  bronzeNut.position.set(0, 1.45, -0.42);
  liftCarriageGroup.add(bronzeNut);
  registerPart(bronzeNut, "Lift", "Precision phosphor bronze traveling Acme lead screw drive nut");

  // Articulated igus-style Cable Drag Chain
  const chainCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 0.20, 0.35),
    new THREE.Vector3(-0.42, 0.85, 0.35),
    new THREE.Vector3(-0.35, 1.50, 0.15),
  ]);
  const dragChain = new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 20, 0.035, 8, false), matRubber);
  dragChain.name = "Chain_CableDrag_Igus";
  liftCarriageGroup.add(dragChain);
  registerPart(dragChain, "Lift", "Articulated nylon cable drag chain guiding power & signal lines during lift travel");
  refs.dragChainMesh = dragChain;

  // Rigid Structural Cast Arm extending to the right (+X)
  const extensionArm = box(1.70, 0.45, 0.55, matWhiteChassis);
  extensionArm.name = "Arm_CarriageExtension";
  extensionArm.position.set(0.98, 1.55, -0.25);
  liftCarriageGroup.add(extensionArm);
  registerPart(extensionArm, "Drive", "Reinforced cast aluminum arm supporting rotary drive unit and condenser assembly");

  // -------------------------------------------------------------------------
  // 4. Rotary Drive Unit with Genuine 3D BLDC Motor Interior (Assembly_DriveHead)
  // -------------------------------------------------------------------------
  const driveHeadGroup = new THREE.Group();
  driveHeadGroup.name = "Assembly_DriveHead";
  driveHeadGroup.position.set(1.25, 1.70, -0.05);
  liftCarriageGroup.add(driveHeadGroup);

  // 35° Downward Vector towards Heating Bath on Right
  const vDir = new THREE.Vector3(0.8192, -0.5735, -0.04).normalize();
  driveHeadGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), vDir);

  // 4a. Genuine 3D BLDC Motor Internal Mechanical Stack
  const motorInternalGroup = new THREE.Group();
  motorInternalGroup.name = "Assembly_BLDC_Motor_Interior";
  motorInternalGroup.position.z = 0.0;
  driveHeadGroup.add(motorInternalGroup);
  refs.motorInternalAssembly = motorInternalGroup;

  // 12-Pole Laminated Silicon Steel Stator Core Stack (Motor_BLDC_Stator)
  const statorCore = cyl(0.32, 0.32, 0.52, matStatorIron, 24);
  statorCore.name = "Motor_BLDC_Stator";
  statorCore.rotation.x = Math.PI / 2;
  motorInternalGroup.add(statorCore);
  registerPart(statorCore, "Drive", "12-pole laminated silicon steel stator core stack (0.35mm lamination grade)");

  // 12 Individual Procedural Wound Copper Wire Coils (Motor_BLDC_Windings)
  for (let ci = 0; ci < 12; ci++) {
    const angle = (ci / 12) * Math.PI * 2;
    const coilW = box(0.08, 0.12, 0.48, matCopperWindings);
    coilW.name = `Motor_CoilWinding_${ci + 1}`;
    coilW.position.set(Math.cos(angle) * 0.24, Math.sin(angle) * 0.24, 0);
    coilW.rotation.z = angle;
    motorInternalGroup.add(coilW);
  }
  registerPart(motorInternalGroup, "Drive", "Exhaustive procedural 3-phase BLDC stator winding assembly (class H enameled wire)");

  // Permanent Magnet Rare-Earth Rotor Drum (Motor_BLDC_Rotor)
  const rotorDrum = cyl(0.18, 0.18, 0.54, matNeodymium, 24);
  rotorDrum.name = "Motor_BLDC_Rotor";
  rotorDrum.rotation.x = Math.PI / 2;
  motorInternalGroup.add(rotorDrum);
  registerPart(rotorDrum, "Drive", "Precision balanced rotor drum with sintered NdFeB permanent magnets (N48SH)");

  // Deep-Groove Stainless Steel Ball Bearings with Individual Steel Balls
  for (const bZ of [-0.30, 0.30]) {
    const bearingName = bZ < 0 ? "Bearing_Ball_Rear" : "Bearing_Ball_Front";
    const brgGroup = new THREE.Group();
    brgGroup.name = bearingName;
    brgGroup.position.z = bZ;
    motorInternalGroup.add(brgGroup);
    registerPart(brgGroup, "Drive", "ABEC-5 precision deep-groove stainless steel ball bearing with PTFE contact seals");

    const outerRing = cyl(0.24, 0.24, 0.08, matSteelBrushed, 24);
    outerRing.rotation.x = Math.PI / 2;
    brgGroup.add(outerRing);

    const innerRing = cyl(0.14, 0.14, 0.08, matSteelBrushed, 24);
    innerRing.rotation.x = Math.PI / 2;
    brgGroup.add(innerRing);

    // 8 Individual Stainless Steel Ball Spheres
    for (let bi = 0; bi < 8; bi++) {
      const bRad = (bi / 8) * Math.PI * 2;
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), matChrome);
      ball.position.set(Math.cos(bRad) * 0.19, Math.sin(bRad) * 0.19, 0);
      brgGroup.add(ball);
    }
  }

  // Radial Slotted Optical Rotary Encoder Disc & Optocoupler Pickup
  const encoderDisc = cyl(0.28, 0.28, 0.015, matAlumBrushed, 32);
  encoderDisc.name = "Encoder_Optical_Disc";
  encoderDisc.rotation.x = Math.PI / 2;
  encoderDisc.position.z = -0.36;
  motorInternalGroup.add(encoderDisc);
  registerPart(encoderDisc, "Drive", "Photo-etched radial strobe optical encoder disc (1024 pulses per revolution)");

  const optoSensor = box(0.08, 0.08, 0.05, matDarkChassis);
  optoSensor.name = "Sensor_Optocoupler";
  optoSensor.position.set(0, 0.26, -0.36);
  motorInternalGroup.add(optoSensor);
  registerPart(optoSensor, "Drive", "Dual-channel slotted optical interrupter sensor for closed-loop tachometer feedback");

  // Precision Helical Worm Gearbox
  const wormGear = cyl(0.07, 0.07, 0.22, matLeadScrew, 16);
  wormGear.name = "Gear_Worm_Steel";
  wormGear.position.set(0.26, -0.15, 0.15);
  motorInternalGroup.add(wormGear);
  registerPart(wormGear, "Drive", "Case-hardened precision steel worm screw");

  const wormWheel = cyl(0.16, 0.16, 0.06, matBronze, 24);
  wormWheel.name = "Gear_WormWheel_Bronze";
  wormWheel.rotation.x = Math.PI / 2;
  wormWheel.position.set(0, 0, 0.15);
  motorInternalGroup.add(wormWheel);
  registerPart(wormWheel, "Drive", "Centrifugally cast phosphor bronze worm wheel gear");

  // 4b. Contoured External Motor Cover Shell (lifts away in exploded view)
  const motorCoverGroup = new THREE.Group();
  motorCoverGroup.name = "Body_DriveHousing";
  driveHeadGroup.add(motorCoverGroup);
  refs.motorExplodeCover = motorCoverGroup;

  const driveHousing = cyl(0.40, 0.40, 0.92, matWhiteChassis, 36);
  driveHousing.name = "Body_DriveCoverCasting";
  driveHousing.rotation.x = Math.PI / 2;
  motorCoverGroup.add(driveHousing);
  registerPart(driveHousing, "Drive", "Aerodynamic die-cast white protective drive unit housing");

  const rearDome = new THREE.Mesh(new THREE.SphereGeometry(0.40, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), matWhiteChassis);
  rearDome.rotation.x = -Math.PI / 2;
  rearDome.position.z = -0.46;
  motorCoverGroup.add(rearDome);

  const colletTrim = cyl(0.41, 0.41, 0.05, matAlumBrushed, 36);
  colletTrim.rotation.x = Math.PI / 2;
  colletTrim.position.z = 0.46;
  motorCoverGroup.add(colletTrim);

  const buchiCobaltBand = cyl(0.405, 0.405, 0.035, matBuchiCobalt, 36);
  buchiCobaltBand.rotation.x = Math.PI / 2;
  buchiCobaltBand.position.z = 0.33;
  motorCoverGroup.add(buchiCobaltBand);

  // 4c. Hollow Drive Spindle & Rotating Flask Assembly
  const rotatingDriveShaft = new THREE.Group();
  rotatingDriveShaft.name = "Assembly_RotatingDriveShaft";
  driveHeadGroup.add(rotatingDriveShaft);
  refs.rotatingDriveShaft = rotatingDriveShaft;

  // Hollow Stainless Steel Drive Spindle (Spindle_Hollow_Stainless)
  const hollowSpindle = cyl(0.12, 0.12, 1.10, matSteelBrushed, 24);
  hollowSpindle.name = "Spindle_Hollow_Stainless";
  hollowSpindle.rotation.x = Math.PI / 2;
  hollowSpindle.position.z = 0.15;
  rotatingDriveShaft.add(hollowSpindle);
  registerPart(hollowSpindle, "Drive", "Precision ground hollow stainless steel drive spindle with internal taper for vapor duct");

  // Spring-Loaded PTFE/PE Composite Vacuum Lip Seal (Seal_Vacuum_PTFE)
  const ptfeSeal = cyl(0.18, 0.18, 0.08, matPtfeBlack, 24);
  ptfeSeal.name = "Seal_Vacuum_PTFE";
  ptfeSeal.rotation.x = Math.PI / 2;
  ptfeSeal.position.z = 0.42;
  rotatingDriveShaft.add(ptfeSeal);
  registerPart(ptfeSeal, "Drive", "Spring-loaded PTFE/PE composite vacuum lip seal with Kalrez perfluoroelastomer energizer");

  // Front Chuck Collet Ring
  const colletCh = cyl(0.22, 0.26, 0.22, matAlumBrushed, 24);
  colletCh.rotation.x = Math.PI / 2;
  colletCh.position.z = 0.52;
  rotatingDriveShaft.add(colletCh);

  // Ergonomic Blue Büchi Combi-Clip (Clip_CombiClip_NS29)
  const combiClip = box(0.28, 0.15, 0.16, matBuchiCobalt);
  combiClip.name = "Clip_CombiClip_NS29";
  combiClip.position.z = 0.62;
  rotatingDriveShaft.add(combiClip);
  registerPart(combiClip, "Drive", "Patented Büchi Combi-Clip mechanism with integrated vapor duct extractor lever");

  // Rotating Evaporating Flask Group (Flask_Evaporating_1000ml)
  const rotatingFlaskGroup = new THREE.Group();
  rotatingFlaskGroup.name = "Assembly_EvaporatingFlask";
  rotatingFlaskGroup.position.z = 0.74;
  rotatingDriveShaft.add(rotatingFlaskGroup);
  refs.rotatingFlaskGroup = rotatingFlaskGroup;

  // Precision Ground NS 29/32 Glass Neck
  const flaskNeck = cyl(0.13, 0.13, 0.38, matGlassClear, 24);
  flaskNeck.name = "Joint_GroundGlass_NS29";
  flaskNeck.rotation.x = Math.PI / 2;
  flaskNeck.position.z = 0.10;
  rotatingFlaskGroup.add(flaskNeck);
  registerPart(flaskNeck, "Glassware", "NS 29/32 standard taper ground glass joint with anti-seize micro-ridges");

  // 1000 mL Pear-Shaped Evaporating Flask (Flask_Evaporating_1000ml)
  const evapFlaskBulb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), matGlassClear);
  evapFlaskBulb.name = "Flask_Evaporating_1000ml";
  evapFlaskBulb.scale.set(1.0, 1.0, 1.25);
  evapFlaskBulb.position.z = 0.50;
  rotatingFlaskGroup.add(evapFlaskBulb);
  registerPart(evapFlaskBulb, "Glassware", "1000 mL pear-shaped borosilicate glass evaporating flask (Duran 3.3)");

  // Organic Solvent Liquid Solution with Climbing Film & Vortex (Liquid_Evaporation_Vortex)
  const liquidGeo = new THREE.SphereGeometry(0.51, 24, 24);
  liquidGeo.scale(0.96, 0.96, 1.18);
  const flaskLiquidMesh = new THREE.Mesh(liquidGeo, matSolventAmber);
  flaskLiquidMesh.name = "Liquid_Evaporation_Vortex";
  flaskLiquidMesh.position.z = 0.52;
  rotatingFlaskGroup.add(flaskLiquidMesh);
  registerPart(flaskLiquidMesh, "Glassware", "Solvent liquid charge forming an active climbing evaporation film under rotation");
  refs.flaskLiquidMesh = flaskLiquidMesh;

  // -------------------------------------------------------------------------
  // 5. Borosilicate Glass Vapor Duct Connecting Drive Head to Condenser
  // -------------------------------------------------------------------------
  const vaporDuctGroup = new THREE.Group();
  vaporDuctGroup.name = "VaporDuct_Borosilicate";
  const vPts = [
    new THREE.Vector3(1.25 - 0.46 * vDir.x, 1.70 - 0.46 * vDir.y, -0.05 - 0.46 * vDir.z),
    new THREE.Vector3(0.65, 2.05, 0.05),
    new THREE.Vector3(0.20, 2.10, 0.10),
  ];
  const vaporTube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(vPts), 24, 0.075, 16, false), matGlassClear);
  vaporDuctGroup.add(vaporTube);
  liftCarriageGroup.add(vaporDuctGroup);
  registerPart(vaporDuctGroup, "Glassware", "Precision tapered borosilicate 3.3 glass vapor duct with vacuum seal flange");

  // -------------------------------------------------------------------------
  // 6. Vertical Double-Helix Condenser & Receiving Assembly (Assembly_Condenser)
  // -------------------------------------------------------------------------
  const condenserAssemblyGroup = new THREE.Group();
  condenserAssemblyGroup.name = "Assembly_Condenser";
  condenserAssemblyGroup.position.set(0.20, 2.10, 0.10);
  liftCarriageGroup.add(condenserAssemblyGroup);
  refs.condenserAssembly = condenserAssemblyGroup;

  // Glass 3-Way Manifold Junction (Manifold_CondenserJunction)
  const manifold = cyl(0.16, 0.16, 0.44, matGlassClear, 24);
  manifold.name = "Manifold_CondenserJunction";
  manifold.position.y = 0;
  condenserAssemblyGroup.add(manifold);
  registerPart(manifold, "Glassware", "Borosilicate glass 3-way distribution manifold connecting vapor duct, condenser, and receiver");

  // Vacuum Aeration Stopcock Valve with PTFE Handle (Valve_AerationStopcock)
  const stopcockGroup = new THREE.Group();
  stopcockGroup.name = "Valve_AerationStopcock";
  stopcockGroup.position.set(0, 0.08, -0.16);
  condenserAssemblyGroup.add(stopcockGroup);
  registerPart(stopcockGroup, "Controls", "Precision vacuum release stopcock valve with PTFE plug and GL-14 aeration port");

  const valveStem = cyl(0.035, 0.035, 0.15, matGlassClear, 16);
  valveStem.rotation.x = Math.PI / 2;
  stopcockGroup.add(valveStem);

  const valveHandle = box(0.14, 0.045, 0.035, matBuchiCobalt);
  valveHandle.position.z = -0.08;
  stopcockGroup.add(valveHandle);

  // 1000 mL Spherical Receiving Flask (Flask_Receiving_1000ml)
  const receiverGroup = new THREE.Group();
  receiverGroup.name = "Assembly_ReceivingFlask";
  receiverGroup.position.set(0, -0.78, 0);
  condenserAssemblyGroup.add(receiverGroup);

  const rBulb = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 32), matGlassClear);
  rBulb.name = "Flask_Receiving_1000ml";
  receiverGroup.add(rBulb);
  registerPart(rBulb, "Glassware", "1000 mL spherical borosilicate receiving flask with S 35/20 spherical ball joint");

  // S 35/20 Precision Ball Joint Clamp (Clamp_BallJoint_S35)
  const clamp = box(0.38, 0.10, 0.38, matAlumBrushed);
  clamp.name = "Clamp_BallJoint_S35";
  clamp.position.y = 0.58;
  receiverGroup.add(clamp);
  registerPart(clamp, "Fasteners", "Stainless steel spring clamp for S 35/20 spherical ball joint connection");

  // Distillate Solvent Pool (Liquid_Distillate_Pool)
  const recLiquidGeo = new THREE.SphereGeometry(0.56, 24, 24);
  recLiquidGeo.scale(0.95, 0.50, 0.95);
  const receiverLiquidMesh = new THREE.Mesh(recLiquidGeo, matDistillate);
  receiverLiquidMesh.name = "Liquid_Distillate_Pool";
  receiverLiquidMesh.position.y = -0.25;
  receiverGroup.add(receiverLiquidMesh);
  registerPart(receiverLiquidMesh, "Glassware", "Recovered pure condensed solvent distillate collection pool");
  refs.receiverLiquidMesh = receiverLiquidMesh;

  // Condensate Falling Droplet (Droplet_Distillate_Drip)
  const dropGeo = new THREE.SphereGeometry(0.04, 12, 12);
  const dripMesh = new THREE.Mesh(dropGeo, matDistillate);
  dripMesh.name = "Droplet_Distillate_Drip";
  dripMesh.position.set(0, 0.35, 0);
  receiverGroup.add(dripMesh);
  refs.dripMesh = dripMesh;

  // Vertical Double-Helix Coiled Condenser (Condenser_DoubleHelix_Glass, 1500 cm²)
  const condenserJacketGroup = new THREE.Group();
  condenserJacketGroup.name = "Assembly_CondenserCoil";
  condenserJacketGroup.position.set(0, 0.24, 0);
  condenserAssemblyGroup.add(condenserJacketGroup);

  const outerJacket = cyl(0.65, 0.65, 3.20, matGlassClear, 36);
  outerJacket.name = "Condenser_DoubleHelix_Glass";
  outerJacket.position.y = 1.60;
  condenserJacketGroup.add(outerJacket);
  registerPart(outerJacket, "Glassware", "High-efficiency vertical double-helix condenser jacket with 1500 cm² heat exchange area");

  const topDome = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), matGlassClear);
  topDome.position.y = 3.20;
  condenserJacketGroup.add(topDome);

  const vacHoseBarb = cyl(0.05, 0.05, 0.24, matGlassClear, 16);
  vacHoseBarb.name = "Port_VacuumConnection";
  vacHoseBarb.position.set(0, 3.32, 0);
  condenserJacketGroup.add(vacHoseBarb);
  registerPart(vacHoseBarb, "Glassware", "Top serrated glass hose barb port for vacuum line integration");

  // Procedural Double-Spiral Coolant Helix Coil (Coil_Coolant_Helix)
  const helixPoints = [];
  const turns = 14;
  for (let i = 0; i <= 240; i++) {
    const t = i / 240;
    const angle = t * turns * Math.PI * 2;
    const rad = 0.38;
    const y = 0.25 + t * 2.70;
    helixPoints.push(new THREE.Vector3(Math.cos(angle) * rad, y, Math.sin(angle) * rad));
  }
  const coilMesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helixPoints), 200, 0.045, 10, false), matCoolantBlue);
  coilMesh.name = "Coil_Coolant_Helix";
  condenserJacketGroup.add(coilMesh);
  registerPart(coilMesh, "Glassware", "Internal borosilicate double-helix cooling coil with turbulent coolant flow");

  // GL-14 Coolant Hose Nozzles with Amber Threaded Caps
  for (const sy of [0.85, 2.55]) {
    const nozzle = cyl(0.08, 0.08, 0.30, matGlassClear, 16);
    nozzle.name = `Nozzle_GL14_${sy < 1.5 ? 'Inlet' : 'Outlet'}`;
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.set(0.72, sy, 0);
    condenserJacketGroup.add(nozzle);
    registerPart(nozzle, "Glassware", "GL-14 standard screw-thread coolant nozzle connection");

    const amberCap = cyl(0.11, 0.11, 0.12, M(0xd97706, { r: 0.35 }), 16);
    amberCap.rotation.z = Math.PI / 2;
    amberCap.position.set(0.85, sy, 0);
    condenserJacketGroup.add(amberCap);
  }

  // -------------------------------------------------------------------------
  // 7. Heating Bath B-300 / B-305 (Assembly_HeatingBath)
  // -------------------------------------------------------------------------
  const bathGroup = new THREE.Group();
  bathGroup.name = "Assembly_HeatingBath";
  bathGroup.position.set(1.20, 0.375, 0.00);
  root.add(bathGroup);
  refs.bathGroup = bathGroup;

  // Deep-Drawn 316L Stainless Steel Outer Basin (Bath_OuterBasin_SS316)
  const outerBasin = cyl(1.36, 1.36, 1.05, matBathSteel, 36);
  outerBasin.name = "Bath_OuterBasin_SS316";
  outerBasin.position.y = 0.525;
  bathGroup.add(outerBasin);
  registerPart(outerBasin, "Heating", "Double-walled insulated 316L stainless steel outer bath basin (5-liter volume)");

  const topRimTorus = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.06, 16, 36), matBathSteel);
  topRimTorus.rotation.x = Math.PI / 2;
  topRimTorus.position.y = 1.05;
  bathGroup.add(topRimTorus);

  // Black PTFE Non-Stick Inner Basin Coating (Bath_InnerBasin_PTFE)
  const innerBasin = cyl(1.22, 1.22, 0.95, matPtfeBlack, 36);
  innerBasin.name = "Bath_InnerBasin_PTFE";
  innerBasin.position.y = 0.58;
  bathGroup.add(innerBasin);
  registerPart(innerBasin, "Heating", "High-temperature non-stick PTFE interior basin lining (rated to 220°C)");

  // Genuine 3D Tubular Calrod Heating Ring in Bottom Trough (Element_HeaterRing_Calrod)
  const calrodCurve = new THREE.EllipseCurve(0, 0, 0.85, 0.85, 0, Math.PI * 1.9, false, 0);
  const calrodPts = calrodCurve.getPoints(40).map(p => new THREE.Vector3(p.x, 0.16, p.y));
  const calrodMesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(calrodPts), 40, 0.04, 12, false), matSteelBrushed);
  calrodMesh.name = "Element_HeaterRing_Calrod";
  bathGroup.add(calrodMesh);
  registerPart(calrodMesh, "Heating", "1300W submerged tubular calrod heating element ring with brass compression fittings");

  // Immersed PT1000 Class A Temperature Sensor Probe (Sensor_PT1000_BathProbe)
  const pt1000Probe = cyl(0.025, 0.025, 0.80, matChrome, 16);
  pt1000Probe.name = "Sensor_PT1000_BathProbe";
  pt1000Probe.position.set(0.95, 0.75, -0.55);
  bathGroup.add(pt1000Probe);
  registerPart(pt1000Probe, "Heating", "Class A PT1000 RTD temperature probe with 4-wire Kelvin sensing");

  // Water Bath Fluid Meniscus (Liquid_HeatingBath_Water)
  const bathWater = cyl(1.20, 1.20, 0.02, matWater, 36);
  bathWater.name = "Liquid_HeatingBath_Water";
  bathWater.position.y = 0.88;
  bathGroup.add(bathWater);
  registerPart(bathWater, "Heating", "Thermostatted liquid heating bath transfer medium");
  refs.bathLiquidMesh = bathWater;

  // Dual Insulated Heat-Resistant Silicone Carry Handles
  for (const sign of [-1, 1]) {
    const handleName = sign < 0 ? "Handle_Bath_Left" : "Handle_Bath_Right";
    const handle = box(0.12, 0.24, 0.45, matDarkChassis);
    handle.name = handleName;
    handle.position.set(sign * 1.48, 0.65, 0);
    bathGroup.add(handle);
    registerPart(handle, "Heating", "Ergonomic thermally-isolated silicone carry handle for safe hot bath removal");
  }

  // Bath Front Local Display & Status Console
  const bathConsoleBox = box(0.90, 0.35, 0.08, matDarkChassis);
  bathConsoleBox.name = "Display_Bath_OLED";
  bathConsoleBox.position.set(0, 0.38, -1.36);
  bathGroup.add(bathConsoleBox);
  registerPart(bathConsoleBox, "Display", "Local bath front OLED display and optical status glow ring");

  const bathLcdScreen = box(0.48, 0.18, 0.02, M(0x00d4e8, { r: 0.1, e: 0x004455, ei: 0.8 }));
  bathLcdScreen.position.set(-0.14, 0.38, -1.41);
  bathConsoleBox.add(bathLcdScreen);

  const bathControlKnob = cyl(0.09, 0.09, 0.06, matAlumBrushed, 24);
  bathControlKnob.name = "Btn_BathTempDial";
  bathControlKnob.rotation.x = Math.PI / 2;
  bathControlKnob.position.set(0.28, 0.38, -1.42);
  bathConsoleBox.add(bathControlKnob);
  registerPart(bathControlKnob, "Controls", "Independent analog/digital local bath temperature adjustment dial");

  // Bottom Gold Pogo-Pin Contacts (Contact_BathPogoPins)
  const pogoGroup = new THREE.Group();
  pogoGroup.name = "Contact_BathPogoPins";
  pogoGroup.position.set(0, 0.02, -0.85);
  bathGroup.add(pogoGroup);
  registerPart(pogoGroup, "Electrical", "Spring-loaded gold-plated pogo-pin cluster for wireless base power & data continuity");
  refs.bathPogoPins = pogoGroup;

  for (let pi = -0.10; pi <= 0.10; pi += 0.07) {
    const pin = cyl(0.012, 0.012, 0.04, matGoldContact, 12);
    pin.position.set(pi, 0, 0);
    pogoGroup.add(pin);
  }

  // -------------------------------------------------------------------------
  // 8. I-300 Pro Digital Touchscreen Controller Interface (Assembly_Controller)
  // -------------------------------------------------------------------------
  const ctrlGroup = new THREE.Group();
  ctrlGroup.name = "Assembly_Controller";
  ctrlGroup.position.set(-1.25, 1.25, -0.60);
  root.add(ctrlGroup);

  // Articulated Support Knuckle & Heavy Extruded Arm
  const armCollar = box(1.05, 0.16, 0.95, matDarkChassis);
  armCollar.name = "Clamp_ControllerSupport";
  armCollar.position.set(0.65, -0.35, 0.90);
  ctrlGroup.add(armCollar);
  registerPart(armCollar, "Controls", "Heavy cast clamp collar mounting controller arm securely to tower profile");

  const ctrlArmPts = [
    new THREE.Vector3(0.65, -0.35, 0.90),
    new THREE.Vector3(0.20, -0.20, 0.40),
    new THREE.Vector3(0.0, 0.0, 0.0),
  ];
  const ctrlArmMesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ctrlArmPts), 16, 0.045, 12, false), matAlumBrushed);
  ctrlArmMesh.name = "Arm_ControllerArticulated";
  ctrlGroup.add(ctrlArmMesh);
  registerPart(ctrlArmMesh, "Controls", "Solid brushed aluminum support arm with dual-axis swivel joint");

  // Controller Housing angled ~22° towards user facing -Z
  const ctrlHousing = new THREE.Group();
  ctrlHousing.name = "Body_ControllerHousing";
  ctrlHousing.rotation.x = Math.PI * 0.13;
  ctrlHousing.rotation.y = -Math.PI * 0.10;
  ctrlGroup.add(ctrlHousing);

  const ctrlBackBox = box(1.85, 1.45, 0.32, matWhiteChassis);
  ctrlBackBox.name = "Body_ControllerEnclosure";
  ctrlHousing.add(ctrlBackBox);
  registerPart(ctrlBackBox, "Display", "Impact-resistant polymer enclosure housing I-300 Pro digital controller");

  // Internal FR4 Motherboard (PCB_ControllerMotherboard)
  const pcbGroup = new THREE.Group();
  pcbGroup.name = "PCB_ControllerMotherboard";
  pcbGroup.position.z = -0.05;
  ctrlHousing.add(pcbGroup);
  registerPart(pcbGroup, "Electrical", "Multilayer FR4 controller motherboard with ARM Cortex-M4 MCU and RS-485 transceiver");

  const pcbPlate = box(1.70, 1.30, 0.02, matPCBGreen);
  pcbGroup.add(pcbPlate);

  const mcu = box(0.24, 0.24, 0.03, matSiliconIC);
  mcu.position.set(-0.25, 0.10, 0.02);
  pcbGroup.add(mcu);

  // Surface-mount caps & inductors
  for (let ci = 0; ci < 6; ci++) {
    const smd = box(0.06, 0.04, 0.03, matDarkChassis);
    smd.position.set(0.10 + (ci % 3) * 0.12, 0.15 - Math.floor(ci / 3) * 0.12, 0.02);
    pcbGroup.add(smd);
  }

  // Controller Front Bezel Plate (lifts in exploded view)
  const ctrlFaceplateGroup = new THREE.Group();
  ctrlFaceplateGroup.name = "Assembly_ControllerFaceplate";
  ctrlHousing.add(ctrlFaceplateGroup);
  refs.controllerExplodeFace = ctrlFaceplateGroup;

  const bezelPlate = box(1.78, 1.38, 0.03, matDarkChassis);
  bezelPlate.name = "Body_ControllerBezel";
  bezelPlate.position.z = -0.165;
  ctrlFaceplateGroup.add(bezelPlate);
  registerPart(bezelPlate, "Display", "Precision flush front bezel with capacitive touch sensor matrix");

  // 7.0" High-Contrast Active Matrix Dynamic Canvas LCD Quad (UI_LCD)
  const lcdW = 1.42;
  const lcdH = 0.88;
  const lcdGeo = new THREE.PlaneGeometry(lcdW, lcdH);
  lcdGeo.rotateY(Math.PI); // Face -Z (towards operator)

  // Invert UV Y to maintain upright typography with flipY = false
  const lcdUv = lcdGeo.attributes.uv;
  for (let i = 0; i < lcdUv.count; i++) {
    lcdUv.setY(i, 1.0 - lcdUv.getY(i));
  }
  lcdUv.needsUpdate = true;

  const lcdMesh = new THREE.Mesh(lcdGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide }));
  lcdMesh.name = "UI_LCD";
  lcdMesh.position.set(0.06, 0.14, -0.185);
  ctrlFaceplateGroup.add(lcdMesh);
  registerPart(lcdMesh, "Display", "7.0\" active-matrix graphical dynamic touchscreen LCD quad (UI_LCD)");
  refs.controllerLcdMesh = lcdMesh;

  // Chemically-Strengthened Anti-Reflective Glass Touch Lens (Glass_TouchLens)
  const glassLens = box(lcdW + 0.04, lcdH + 0.04, 0.008, matGlassClear);
  glassLens.name = "Glass_TouchLens";
  glassLens.position.set(0.06, 0.14, -0.192);
  ctrlFaceplateGroup.add(glassLens);
  registerPart(glassLens, "Display", "Toughened optical anti-reflective protective front glass lens");

  // Push-Turn Metallic Navigation Rotary Dial (Dial_RotaryPush)
  const pushDial = cyl(0.18, 0.18, 0.12, matChrome, 32);
  pushDial.name = "Dial_RotaryPush";
  pushDial.rotation.x = Math.PI / 2;
  pushDial.position.set(-0.62, -0.38, -0.22);
  ctrlFaceplateGroup.add(pushDial);
  registerPart(pushDial, "Controls", "Push-turn optical navigation dial with calibrated haptic detents");

  // Dedicated Physical Tactile Action Keys
  const keyConfigs = [
    { id: "Btn_Controller_Start", label: "START / STOP", x: -0.15, col: 0x22c55e },
    { id: "Btn_Controller_Mode",  label: "MODE",         x: 0.20,  col: 0x475569 },
    { id: "Btn_Controller_Aerate",label: "AERATE",       x: 0.55,  col: 0x2563eb },
  ];
  keyConfigs.forEach(k => {
    const keyMesh = box(0.28, 0.12, 0.03, M(k.col, { r: 0.35 }));
    keyMesh.name = k.id;
    keyMesh.position.set(k.x, -0.38, -0.18);
    ctrlFaceplateGroup.add(keyMesh);
    registerPart(keyMesh, "Controls", `Tactile membrane key: ${k.label}`);
  });

  // Shielded BUCHI COM Serial Cable (Cable_Controller_BUCHI_COM)
  const comCablePts = [
    new THREE.Vector3(0, -0.65, 0.15),
    new THREE.Vector3(0.25, -0.55, 0.50),
    new THREE.Vector3(0.65, -0.45, 0.85),
  ];
  const comCable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(comCablePts), 16, 0.018, 8, false), matRubber);
  comCable.name = "Cable_Controller_BUCHI_COM";
  ctrlHousing.add(comCable);
  registerPart(comCable, "Electrical", "Shielded RS-485 BUCHI COM telemetry bus cable connecting controller to drive unit");

  // -------------------------------------------------------------------------
  // 9. Bench Receptacle, NEMA Plug & SJTOW Line Cord (Physical Circuit Continuity)
  // -------------------------------------------------------------------------
  const outletPos = BENCH.outlet;

  // Laboratory Receptacle Box on Backsplash
  const outletBox = new THREE.Group();
  outletBox.name = "Power_Receptacle_Duplex";
  outletBox.position.set(outletPos.x, outletPos.y, outletPos.z);
  root.add(outletBox);
  registerPart(outletBox, "Electrical", "Standard 120V / 20A commercial laboratory duplex outlet box on bench backsplash");

  const oPlate = box(0.28, 0.40, 0.02, matSteelBrushed);
  outletBox.add(oPlate);

  for (const dy of [-0.08, 0.08]) {
    const oFace = box(0.12, 0.11, 0.015, matDarkChassis);
    oFace.position.set(0, dy, -0.015);
    outletBox.add(oFace);
    // Sockets
    for (const sx of [-0.025, 0.025]) {
      const slot = box(0.012, 0.035, 0.008, M(0x05070a, { r: 0.9 }));
      slot.position.set(sx, dy + 0.01, -0.022);
      outletBox.add(slot);
    }
    const gnd = cyl(0.009, 0.009, 0.008, M(0x05070a, { r: 0.9 }), 10);
    gnd.rotation.x = Math.PI / 2;
    gnd.position.set(0, dy - 0.025, -0.022);
    outletBox.add(gnd);
  }

  // Molded NEMA 5-15P Power Plug (Power_Plug_NEMA)
  const plugGroup = new THREE.Group();
  plugGroup.name = "Power_Plug_NEMA";
  // Firmly inserted into lower socket by default
  plugGroup.position.set(outletPos.x, outletPos.y - 0.08, outletPos.z - 0.025);
  root.add(plugGroup);
  registerPart(plugGroup, "Electrical", "Molded NEMA 5-15P 3-prong grounded laboratory mains plug with strain relief");
  refs.powerPlug = plugGroup;

  const plugBody = box(0.14, 0.12, 0.16, matRubber);
  plugBody.position.z = -0.08;
  plugGroup.add(plugBody);

  const plugProngs = box(0.08, 0.08, 0.05, matBrass);
  plugProngs.position.z = 0.01;
  plugGroup.add(plugProngs);

  // Heavy-duty SJTOW Power Cord running from rear IEC inlet to NEMA plug
  function createLineCord() {
    const p1 = new THREE.Vector3(0.35, 0.22, 1.71);
    const p2 = new THREE.Vector3(0.65, 0.10, 2.10);
    const p3 = new THREE.Vector3(outletPos.x - 0.20, 0.10, 2.60);
    const p4 = new THREE.Vector3(plugGroup.position.x, plugGroup.position.y, plugGroup.position.z - 0.16);
    const cCurve = new THREE.CatmullRomCurve3([p1, p2, p3, p4]);
    const cordGeo = new THREE.TubeGeometry(cCurve, 32, 0.03, 10, false);
    const cordMesh = new THREE.Mesh(cordGeo, matRubber);
    cordMesh.name = "Cable_MainsPower_SJTOW";
    root.add(cordMesh);
    registerPart(cordMesh, "Electrical", "Heavy-duty 14 AWG 3-conductor oil-resistant SJTOW laboratory line cord");
  }
  createLineCord();

  // -------------------------------------------------------------------------
  // Public Control & Kinematics APIs
  // -------------------------------------------------------------------------
  function setLiftHeight(percent) {
    const p = THREE.MathUtils.clamp(percent, 0, 1);
    if (refs.liftCarriage) {
      // 0 = lowered into bath (+0.45), 1 = fully raised (+2.25)
      refs.liftCarriage.position.y = 0.36 + 0.45 + p * 1.80;
    }
  }

  function rotateDriveShaft(deltaRad) {
    if (refs.rotatingDriveShaft) {
      refs.rotatingDriveShaft.rotation.z += deltaRad;
    }
  }

  function updateDripAnimation(timeSec, rate) {
    if (!refs.dripMesh) return;
    if (rate <= 0) {
      refs.dripMesh.visible = false;
      return;
    }
    refs.dripMesh.visible = true;
    const cycle = (timeSec * rate * 2.5) % 1.0;
    refs.dripMesh.position.y = 0.45 - cycle * 0.70;
  }

  function updateLiquidLevels(evapFrac, recFrac) {
    if (refs.flaskLiquidMesh) {
      const eSc = THREE.MathUtils.clamp(evapFrac, 0.05, 1.0);
      refs.flaskLiquidMesh.scale.set(eSc * 0.96, eSc * 0.96, 1.18);
    }
    if (refs.receiverLiquidMesh) {
      const rSc = THREE.MathUtils.clamp(recFrac, 0.05, 1.0);
      refs.receiverLiquidMesh.scale.set(0.95, rSc * 0.50, 0.95);
    }
  }

  function setControllerTexture(tex) {
    if (refs.controllerLcdMesh) {
      tex.flipY = false;
      refs.controllerLcdMesh.material.map = tex;
      refs.controllerLcdMesh.material.needsUpdate = true;
    }
  }

  function setExplodeAmount(amount) {
    const factor = THREE.MathUtils.clamp(amount, 0, 1);

    // Motor cover lifts away +1.20 exposing stator, windings, bearings, gears
    if (refs.motorExplodeCover) {
      refs.motorExplodeCover.position.z = 1.20 * factor;
    }
    // Heating bath bowl lifts up +0.80 exposing pogo-pin contacts & calrod ring
    if (refs.bathGroup) {
      refs.bathGroup.position.y = 0.375 + 0.80 * factor;
    }
    // Tower actuator cap lifts +0.90 exposing lead screw & stepper
    if (refs.towerExplodeCap) {
      refs.towerExplodeCap.position.y = (columnH + 0.08) + 0.90 * factor;
    }
    // Controller faceplate separates +0.60 revealing FR4 motherboard
    if (refs.controllerExplodeFace) {
      refs.controllerExplodeFace.position.z = -0.60 * factor;
    }
    // Condenser lifts vertically +1.00
    if (refs.condenserAssembly) {
      refs.condenserAssembly.position.y = 2.10 + 1.00 * factor;
    }
  }

  // Ensure independent material instances and record original states
  root.traverse(node => {
    if (node.isMesh && node.material && node.name !== 'UI_LCD') {
      node.material = node.material.clone();
      node.userData.origWireframe = !!node.material.wireframe;
      node.userData.origOpacity = node.material.opacity ?? 1.0;
      node.userData.origTransparent = !!node.material.transparent;
    }
  });

  function setWireframe(enabled) {
    root.traverse(child => {
      if (child.isMesh && child.material && child.name !== 'UI_LCD') {
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
      if (node.isMesh && node.material && node.name !== 'UI_LCD') {
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
      if (node.isMesh && node.material && node.name !== 'UI_LCD') {
        node.material.wireframe = !!node.userData.origWireframe;
        node.material.opacity = node.userData.origOpacity ?? 1.0;
        node.material.transparent = !!node.userData.origTransparent;
      }
    });
  }

  function setPluggedIn(plugged) {
    if (!refs.powerPlug) return;
    if (plugged) {
      refs.powerPlug.position.set(outletPos.x, outletPos.y - 0.08, outletPos.z - 0.025);
    } else {
      refs.powerPlug.position.set(outletPos.x, outletPos.y - 0.08, outletPos.z - 0.65);
    }
  }

  return {
    root,
    refs,
    partsList,
    partsMap,
    setLiftHeight,
    rotateDriveShaft,
    updateDripAnimation,
    updateLiquidLevels,
    setControllerTexture,
    setExplodeAmount,
    setWireframe,
    focusPart,
    clearFocus,
    setPluggedIn,
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
  const edgeF = box(BENCH.sx + trimW * 2, trimT, trimW, matSteelBrushed);
  edgeF.name = "Body_CounterEdgeF";
  edgeF.position.set(0, benchY - 0.04, -BENCH.sz / 2 - trimW / 2);
  lab.add(edgeF);

  const edgeB = box(BENCH.sx + trimW * 2, trimT, trimW, matSteelBrushed);
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
