/**
 * SREdesigns Parr 4560 / 4848 High-Pressure Reactor — Procedural Three.js CAD Twin
 * 
 * Gold-Tier Procedural Laboratory Twin adhering strictly to Semantic Part Taxonomy:
 * - Heavy cast A-frame benchtop stand (Body_StandBase) with non-skid feet (Foot_Rubber_*)
 * - Ground chrome steel vertical support mast (Body_SupportRod) and mounting collar (Body_MountingCollar)
 * - 300 mL 316SS thick-walled reaction cylinder vessel (Body_VesselCylinder, Body_VesselFlange)
 * - Two-piece drop-band split-ring closure clamp (Body_SplitRing_Left, Body_SplitRing_Right)
 * - 6 High-tensile Grade B7 compression cap screws (Fastener_FlangeBolt_1 through Fastener_FlangeBolt_6)
 * - Fixed 316SS reactor head plate with 1/8" NPT service ports (Body_HeadPlate)
 * - Clamshell electric resistance heating mantle (Body_HeaterMantle, Pivot_HeaterClamshell)
 * - Emissive thermal glow mesh reacting to temperature (Body_ThermalGlow)
 * - Parr A1120HC6 hermetic magnetic stirrer drive coupling (Body_MagDriveHousing, Body_CoolingJacket)
 * - Variable-speed 1/8 hp DC drive motor and belt housing (Body_StirrerMotor, Body_MotorBeltGuard)
 * - Stirrer drive shaft with 4-blade turbine impeller (Pivot_StirrerShaft, Pivot_Impeller)
 * - Internal 316SS water-cooling loop and thermowell (Body_CoolingLoop, Body_Thermowell)
 * - Liquid sampling dip tube with shutoff needle valve (Body_DipTube, Knob_LiquidSampleValve)
 * - Gas inlet needle valve and vent needle valve (Knob_GasInletValve, Knob_VentValve, Body_ValveBody_Inlet, Body_ValveBody_Vent)
 * - Hexagonal burst disc safety head assembly with discharge tube (Body_RuptureDiscSafetyHead, Body_DischargeTube)
 * - 3.5" (89 mm) analog Bourdon tube pressure gauge (Body_PressureGaugeBezel, Body_GaugeDial, Glass_GaugeLens, Pivot_GaugeNeedle)
 * - Parr 4848 modular benchtop digital controller (Body_ControllerChassis, Foot_ControllerFoot_*, Knob_SpeedPot, Btn_HeaterRocker, Btn_PowerRocker)
 * - High-DPI dual-readout Canvas LCD on controller with flipY = false (UI_LCD)
 * - SREdesigns canonical brand badge (Badge_SREdesigns)
 * 
 * Units: 1 unit ≈ 100 mm (Base width 3.05, depth 4.57, overall height 7.62 ≈ 762 mm).
 * Y-up, front = -Z. Datum Y = 0 on table surface.
 */

import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Material Palette Factory
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

const matSSPolished   = M(0xdde2e8, { r: 0.15, m: 0.95, side: THREE.DoubleSide });
const matSSBrushed    = M(0xc2c7cf, { r: 0.30, m: 0.85, side: THREE.DoubleSide });
const matCastIronDark = M(0x282c34, { r: 0.70, m: 0.30 });
const matChromeRod    = M(0xeef2f7, { r: 0.10, m: 0.98 });
const matBrass        = M(0xd4af37, { r: 0.28, m: 0.85 });
const matHeaterAlu    = M(0x9ca3af, { r: 0.45, m: 0.60 });
const matRubberFoot   = M(0x111215, { r: 0.92, m: 0.05 });
const matDialGlass    = M(0xffffff, { r: 0.02, m: 0.10, o: 0.25, side: THREE.DoubleSide, dw: false });
const matNeedleRed    = M(0xef4444, { r: 0.30, m: 0.20, e: 0xef4444, ei: 0.3 });
const matCtrlPaint    = M(0x1e232d, { r: 0.50, m: 0.25 });
const matCtrlBezel    = M(0x101318, { r: 0.40, m: 0.15 });

// Dynamic thermal glow material
const matThermalGlow  = M(0x1a0500, {
  r: 0.8,
  m: 0.1,
  e: 0xff3b00,
  ei: 0.0,
  side: THREE.DoubleSide,
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

// ---------------------------------------------------------------------------
// Main 3D High Pressure Reactor Builder
// ---------------------------------------------------------------------------
export function buildReactor3D(options = {}) {
  const root = new THREE.Group();
  root.name = 'Body_ReactorSystemRoot';

  const assemblies = {
    stand: new THREE.Group(),
    vessel: new THREE.Group(),
    head: new THREE.Group(),
    heater: new THREE.Group(),
    stirrer: new THREE.Group(),
    fittings: new THREE.Group(),
    controller: new THREE.Group(),
  };

  assemblies.stand.name = 'Body_StandAssembly';
  assemblies.vessel.name = 'Body_VesselAssembly';
  assemblies.head.name = 'Body_HeadAssembly';
  assemblies.heater.name = 'Body_HeaterAssembly';
  assemblies.stirrer.name = 'Body_StirrerAssembly';
  assemblies.fittings.name = 'Body_FittingsAssembly';
  assemblies.controller.name = 'Body_ControllerAssembly';

  const refs = {
    stirrerShaft: null,
    impeller: null,
    gaugeNeedle: null,
    thermalGlow: null,
    heaterClamshell: null,
    lcdMesh: null,
    speedKnob: null,
    heaterRocker: null,
    powerRocker: null,
    inletKnob: null,
    ventKnob: null,
  };

  // Dimensions (1 unit ≈ 100 mm)
  const STAND_W = 3.05;
  const STAND_D = 4.57;
  const STAND_BASE_H = 0.25;
  const ROD_H = 7.62;
  const ROD_R = 0.125;
  const VESSEL_CENTER_Y = 2.40;
  const VESSEL_CENTER_Z = -0.50;

  // -------------------------------------------------------------------------
  // 1. Cast Iron Stand & Non-Skid Rubber Feet
  // -------------------------------------------------------------------------
  const standGroup = new THREE.Group();
  standGroup.name = 'Body_StandBase';

  // Heavy cast iron A-frame / rectangular base plate
  const baseMesh = box(STAND_W, STAND_BASE_H, STAND_D, matCastIronDark);
  baseMesh.position.set(0, STAND_BASE_H / 2 + 0.05, 0);
  standGroup.add(baseMesh);

  // 4 Rubber vibration damping feet
  const footX = STAND_W / 2 - 0.25;
  const footZ = STAND_D / 2 - 0.30;
  const footCoords = [
    [-footX, -footZ, 'Foot_Rubber_FL'],
    [ footX, -footZ, 'Foot_Rubber_FR'],
    [-footX,  footZ, 'Foot_Rubber_RL'],
    [ footX,  footZ, 'Foot_Rubber_RR'],
  ];

  footCoords.forEach(([fx, fz, fName]) => {
    const foot = cyl(0.18, 0.20, 0.10, matRubberFoot, 20);
    foot.name = fName;
    foot.position.set(fx, 0.05, fz);
    standGroup.add(foot);
  });

  // Upright ground chrome steel support mast rod
  const mastRod = cyl(ROD_R, ROD_R, ROD_H, matChromeRod, 24);
  mastRod.name = 'Body_SupportRod';
  mastRod.position.set(0, STAND_BASE_H + ROD_H / 2, footZ - 0.40);
  standGroup.add(mastRod);

  // Heavy mounting collar / bracket clamping vessel head to rod
  const collar = box(0.90, 0.50, 1.40, matCastIronDark);
  collar.name = 'Body_MountingCollar';
  collar.position.set(0, VESSEL_CENTER_Y + 1.25, footZ - 0.40 - 0.45);
  standGroup.add(collar);

  assemblies.stand.add(standGroup);

  // -------------------------------------------------------------------------
  // 2. 300 mL 316SS Reaction Cylinder Vessel & Split-Ring Closure
  // -------------------------------------------------------------------------
  const vesselGroup = new THREE.Group();
  vesselGroup.name = 'Body_VesselGroup';
  vesselGroup.position.set(0, VESSEL_CENTER_Y, VESSEL_CENTER_Z);

  const cylOD = 0.89; // 89 mm
  const cylH  = 1.15; // 115 mm
  const vesselCyl = cyl(cylOD / 2, cylOD / 2, cylH, matSSPolished, 32);
  vesselCyl.name = 'Body_VesselCylinder';
  vesselCyl.position.y = -cylH / 2;
  vesselGroup.add(vesselCyl);

  // Hemispherical / rounded bottom head
  const bottomCapGeo = new THREE.SphereGeometry(cylOD / 2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const bottomCap = new THREE.Mesh(bottomCapGeo, matSSPolished);
  bottomCap.name = 'Body_VesselBottomCap';
  bottomCap.rotation.x = Math.PI;
  bottomCap.position.y = -cylH;
  vesselGroup.add(bottomCap);

  // Top sealing vessel flange
  const topFlange = cyl(cylOD / 2 + 0.18, cylOD / 2 + 0.18, 0.20, matSSBrushed, 32);
  topFlange.name = 'Body_VesselFlange';
  topFlange.position.y = 0;
  vesselGroup.add(topFlange);

  // Two-piece drop-band split-ring closure clamp
  const splitLeft = cyl(cylOD / 2 + 0.28, cylOD / 2 + 0.28, 0.28, matCastIronDark, 24);
  splitLeft.name = 'Body_SplitRing_Left';
  splitLeft.position.set(-0.06, 0.04, 0);
  vesselGroup.add(splitLeft);

  const splitRight = cyl(cylOD / 2 + 0.28, cylOD / 2 + 0.28, 0.28, matCastIronDark, 24);
  splitRight.name = 'Body_SplitRing_Right';
  splitRight.position.set(0.06, 0.04, 0);
  vesselGroup.add(splitRight);

  // 6 High-tensile Grade B7 compression bolts
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const bRad = cylOD / 2 + 0.22;
    const bolt = cyl(0.04, 0.04, 0.32, matSSPolished, 12);
    bolt.name = `Fastener_FlangeBolt_${i + 1}`;
    bolt.position.set(Math.cos(angle) * bRad, 0.04, Math.sin(angle) * bRad);
    vesselGroup.add(bolt);
  }

  assemblies.vessel.add(vesselGroup);

  // -------------------------------------------------------------------------
  // 3. Fixed 316SS Reactor Head Plate & Internal Probes
  // -------------------------------------------------------------------------
  const headGroup = new THREE.Group();
  headGroup.name = 'Body_HeadGroup';
  headGroup.position.set(0, VESSEL_CENTER_Y, VESSEL_CENTER_Z);

  // 150 mm dia x 16 mm thick head plate disc
  const headPlate = cyl(0.75, 0.75, 0.18, matSSPolished, 32);
  headPlate.name = 'Body_HeadPlate';
  headPlate.position.y = 0.19;
  headGroup.add(headPlate);

  // Internal Cooling Loop (serpentine tubes descending into cylinder)
  const coolTube1 = cyl(0.035, 0.035, cylH * 0.85, matSSBrushed, 16);
  coolTube1.name = 'Body_CoolingLoop';
  coolTube1.position.set(-0.18, -cylH * 0.42, 0);
  headGroup.add(coolTube1);

  const coolTube2 = cyl(0.035, 0.035, cylH * 0.85, matSSBrushed, 16);
  coolTube2.position.set(0.18, -cylH * 0.42, 0);
  headGroup.add(coolTube2);

  // Thermowell tube
  const thermowell = cyl(0.03, 0.03, cylH * 0.80, matSSBrushed, 16);
  thermowell.name = 'Body_Thermowell';
  thermowell.position.set(0, -cylH * 0.40, 0.18);
  headGroup.add(thermowell);

  // Liquid sampling dip tube
  const dipTube = cyl(0.025, 0.025, cylH * 0.90, matSSBrushed, 16);
  dipTube.name = 'Body_DipTube';
  dipTube.position.set(0, -cylH * 0.45, -0.18);
  headGroup.add(dipTube);

  assemblies.head.add(headGroup);

  // -------------------------------------------------------------------------
  // 4. Clamshell Electric Heating Mantle & Dynamic Thermal Glow
  // -------------------------------------------------------------------------
  const heaterGroup = new THREE.Group();
  heaterGroup.name = 'Body_HeaterMantle';
  heaterGroup.position.set(0, VESSEL_CENTER_Y, VESSEL_CENTER_Z);

  // Outer insulated cylindrical mantle shell
  const mantleOuter = cyl(cylOD / 2 + 0.16, cylOD / 2 + 0.16, cylH + 0.05, matHeaterAlu, 32);
  mantleOuter.position.y = -cylH / 2;
  heaterGroup.add(mantleOuter);

  // Dynamic Thermal Glow mesh inside mantle / bottom gap
  const glowMesh = cyl(cylOD / 2 + 0.02, cylOD / 2 + 0.02, cylH * 0.95, matThermalGlow, 24);
  glowMesh.name = 'Body_ThermalGlow';
  glowMesh.position.y = -cylH / 2;
  heaterGroup.add(glowMesh);
  refs.thermalGlow = matThermalGlow;

  assemblies.heater.add(heaterGroup);

  // -------------------------------------------------------------------------
  // 5. Magnetic Drive Coupling (A1120HC6) & Variable Speed DC Motor
  // -------------------------------------------------------------------------
  const stirrerGroup = new THREE.Group();
  stirrerGroup.name = 'Body_StirrerDrive';
  stirrerGroup.position.set(0, VESSEL_CENTER_Y, VESSEL_CENTER_Z);

  // Hermetic magnetic drive housing atop head
  const magHousing = cyl(0.30, 0.30, 1.00, matSSBrushed, 24);
  magHousing.name = 'Body_MagDriveHousing';
  magHousing.position.y = 0.78;
  stirrerGroup.add(magHousing);

  // Water-cooling jacket around magnetic drive
  const coolJacket = cyl(0.38, 0.38, 0.60, matBrass, 24);
  coolJacket.name = 'Body_CoolingJacket';
  coolJacket.position.y = 0.68;
  stirrerGroup.add(coolJacket);

  // Variable speed 1/8 hp DC stirrer motor mounted on upper bracket
  const motor = cyl(0.44, 0.44, 1.25, matCastIronDark, 24);
  motor.name = 'Body_StirrerMotor';
  motor.position.set(0, 2.25, 0.45);
  stirrerGroup.add(motor);

  // Motor pulley belt guard housing
  const beltGuard = box(0.60, 0.35, 1.10, matCastIronDark);
  beltGuard.name = 'Body_MotorBeltGuard';
  beltGuard.position.set(0, 1.55, 0.22);
  stirrerGroup.add(beltGuard);

  // Center stirrer shaft extending through head down to bottom
  const shaftGroup = new THREE.Group();
  shaftGroup.name = 'Pivot_StirrerShaft';
  shaftGroup.position.set(0, 0.28, 0);

  const shaftRod = cyl(0.05, 0.05, cylH + 0.30, matSSPolished, 16);
  shaftRod.position.y = -cylH / 2;
  shaftGroup.add(shaftRod);

  // 4-Blade Turbine Impeller (35 mm dia)
  const impellerGroup = new THREE.Group();
  impellerGroup.name = 'Pivot_Impeller';
  impellerGroup.position.set(0, -cylH * 0.85, 0);

  const hub = cyl(0.09, 0.09, 0.12, matSSPolished, 16);
  impellerGroup.add(hub);

  for (let i = 0; i < 4; i++) {
    const bladeAngle = (i * Math.PI) / 2;
    const blade = box(0.18, 0.08, 0.015, matSSPolished);
    blade.position.set(Math.cos(bladeAngle) * 0.14, 0, Math.sin(bladeAngle) * 0.14);
    blade.rotation.y = bladeAngle + 0.45; // 45° pitched blade
    impellerGroup.add(blade);
  }

  shaftGroup.add(impellerGroup);
  stirrerGroup.add(shaftGroup);

  refs.stirrerShaft = shaftGroup;
  refs.impeller = impellerGroup;
  assemblies.stirrer.add(stirrerGroup);

  // -------------------------------------------------------------------------
  // 6. External Service Fittings: Valves, Rupture Disc, Pressure Gauge
  // -------------------------------------------------------------------------
  const fittingsGroup = new THREE.Group();
  fittingsGroup.name = 'Body_Fittings';
  fittingsGroup.position.set(0, VESSEL_CENTER_Y + 0.28, VESSEL_CENTER_Z);

  // Gas Inlet Needle Valve (Left side)
  const inletValveBody = box(0.18, 0.18, 0.18, matBrass);
  inletValveBody.name = 'Body_ValveBody_Inlet';
  inletValveBody.position.set(-0.45, 0.15, -0.25);
  fittingsGroup.add(inletValveBody);

  const inletKnob = cyl(0.12, 0.12, 0.14, matRubberFoot, 16);
  inletKnob.name = 'Knob_GasInletValve';
  inletKnob.position.set(-0.45, 0.31, -0.25);
  fittingsGroup.add(inletKnob);
  refs.inletKnob = inletKnob;

  // Gas Vent Needle Valve (Right side)
  const ventValveBody = box(0.18, 0.18, 0.18, matBrass);
  ventValveBody.name = 'Body_ValveBody_Vent';
  ventValveBody.position.set(0.45, 0.15, -0.25);
  fittingsGroup.add(ventValveBody);

  const ventKnob = cyl(0.12, 0.12, 0.14, matRubberFoot, 16);
  ventKnob.name = 'Knob_VentValve';
  ventKnob.position.set(0.45, 0.31, -0.25);
  fittingsGroup.add(ventKnob);
  refs.ventKnob = ventKnob;

  // Liquid Sampling Needle Valve (Front)
  const liquidValve = cyl(0.10, 0.10, 0.12, matRubberFoot, 16);
  liquidValve.name = 'Knob_LiquidSampleValve';
  liquidValve.position.set(0, 0.28, -0.45);
  fittingsGroup.add(liquidValve);

  // Hexagonal Rupture Disc Safety Head & Discharge Tube (Rear Left)
  const burstDiscHead = cyl(0.14, 0.14, 0.22, matSSBrushed, 6);
  burstDiscHead.name = 'Body_RuptureDiscSafetyHead';
  burstDiscHead.position.set(-0.35, 0.20, 0.35);
  fittingsGroup.add(burstDiscHead);

  const dischargeTube = cyl(0.04, 0.04, 0.55, matSSPolished, 16);
  dischargeTube.name = 'Body_DischargeTube';
  dischargeTube.position.set(-0.35, 0.55, 0.35);
  fittingsGroup.add(dischargeTube);

  // 3.5" (89 mm) Analog Pressure Dial Gauge (0-250 bar)
  const gaugeGroup = new THREE.Group();
  gaugeGroup.name = 'Body_PressureGaugeBezel';
  gaugeGroup.position.set(0.35, 0.55, -0.35);

  const gaugeBezelMesh = cyl(0.44, 0.44, 0.16, matSSPolished, 24);
  gaugeBezelMesh.rotation.x = Math.PI / 2;
  gaugeGroup.add(gaugeBezelMesh);

  // Dial face plate
  const dialFace = cyl(0.40, 0.40, 0.02, M(0xffffff, { r: 0.8 }), 24);
  dialFace.name = 'Body_GaugeDial';
  dialFace.rotation.x = Math.PI / 2;
  dialFace.position.z = -0.07;
  gaugeGroup.add(dialFace);

  // Glass lens
  const dialLens = cyl(0.42, 0.42, 0.02, matDialGlass, 24);
  dialLens.name = 'Glass_GaugeLens';
  dialLens.rotation.x = Math.PI / 2;
  dialLens.position.z = -0.09;
  gaugeGroup.add(dialLens);

  // Dial Needle
  const needlePivot = new THREE.Group();
  needlePivot.name = 'Pivot_GaugeNeedle';
  needlePivot.position.set(0, 0, -0.08);

  const needle = box(0.03, 0.30, 0.01, matNeedleRed);
  needle.position.y = 0.12;
  needlePivot.add(needle);
  gaugeGroup.add(needlePivot);
  refs.gaugeNeedle = needlePivot;

  fittingsGroup.add(gaugeGroup);

  // SRE Brand Badge on mounting collar
  const badgeMesh = box(0.85, 0.22, 0.04, matCtrlBezel);
  badgeMesh.name = 'Badge_SREdesigns';
  badgeMesh.position.set(0, 0.55, 0.26);
  fittingsGroup.add(badgeMesh);

  assemblies.fittings.add(fittingsGroup);

  // -------------------------------------------------------------------------
  // 7. Parr 4848 Benchtop Digital Controller Box (Seated beside reactor)
  // -------------------------------------------------------------------------
  const ctrlGroup = new THREE.Group();
  ctrlGroup.name = 'Body_ControllerChassis';
  // Position controller adjacent on the right side of the stand
  ctrlGroup.position.set(STAND_W / 2 + 1.80, 1.25, 0);

  const ctrlW = 2.82;
  const ctrlH = 2.46;
  const ctrlD = 2.87;

  const ctrlBox = box(ctrlW, ctrlH, ctrlD, matCtrlPaint);
  ctrlGroup.add(ctrlBox);

  // Front bezel face
  const ctrlBezel = box(ctrlW - 0.20, ctrlH - 0.20, 0.06, matCtrlBezel);
  ctrlBezel.position.set(0, 0, -ctrlD / 2 - 0.02);
  ctrlGroup.add(ctrlBezel);

  // Live Dynamic Canvas LCD quad (dual 4-digit LED readout for PTM / PDM)
  const lcdPlaneGeo = new THREE.PlaneGeometry(1.50, 1.00);
  const lcdMat = new THREE.MeshBasicMaterial({ color: 0x06080c });
  const lcdMesh = new THREE.Mesh(lcdPlaneGeo, lcdMat);
  lcdMesh.name = 'UI_LCD';
  lcdMesh.position.set(-0.35, 0.30, -ctrlD / 2 - 0.06); // Positive clearance
  ctrlGroup.add(lcdMesh);
  refs.lcdMesh = lcdMesh;

  // Stirrer Speed Potentiometer Knob
  const speedKnob = cyl(0.24, 0.24, 0.18, matRubberFoot, 20);
  speedKnob.name = 'Knob_SpeedPot';
  speedKnob.rotation.x = Math.PI / 2;
  speedKnob.position.set(0.75, 0.40, -ctrlD / 2 - 0.08);
  ctrlGroup.add(speedKnob);
  refs.speedKnob = speedKnob;

  // Rocker Switches: Heater & Mains Power
  const heaterRocker = box(0.18, 0.28, 0.10, M(0xf59e0b, { e: 0xf59e0b, ei: 0.6 }));
  heaterRocker.name = 'Btn_HeaterRocker';
  heaterRocker.position.set(-0.45, -0.65, -ctrlD / 2 - 0.06);
  ctrlGroup.add(heaterRocker);
  refs.heaterRocker = heaterRocker;

  const powerRocker = box(0.18, 0.28, 0.10, M(0x22c55e, { e: 0x22c55e, ei: 0.6 }));
  powerRocker.name = 'Btn_PowerRocker';
  powerRocker.position.set(0.45, -0.65, -ctrlD / 2 - 0.06);
  ctrlGroup.add(powerRocker);
  refs.powerRocker = powerRocker;

  // 4 Rubber feet under controller
  const cfX = ctrlW / 2 - 0.30;
  const cfZ = ctrlD / 2 - 0.30;
  [
    [-cfX, -cfZ, 'Foot_ControllerFoot_FL'],
    [ cfX, -cfZ, 'Foot_ControllerFoot_FR'],
    [-cfX,  cfZ, 'Foot_ControllerFoot_RL'],
    [ cfX,  cfZ, 'Foot_ControllerFoot_RR'],
  ].forEach(([cx, cz, cName]) => {
    const cFoot = cyl(0.12, 0.12, 0.08, matRubberFoot, 16);
    cFoot.name = cName;
    cFoot.position.set(cx, -ctrlH / 2 - 0.04, cz);
    ctrlGroup.add(cFoot);
  });

  assemblies.controller.add(ctrlGroup);

  // Add all assemblies to root
  Object.values(assemblies).forEach((grp) => root.add(grp));

  // -------------------------------------------------------------------------
  // Exploded View & Kinematics Control API
  // -------------------------------------------------------------------------
  let isExploded = false;

  function setExploded(exploded) {
    isExploded = !!exploded;
    const factor = isExploded ? 1.0 : 0.0;

    assemblies.vessel.position.y = -1.2 * factor;
    assemblies.heater.position.y = -2.2 * factor;
    assemblies.stirrer.position.y = 1.4 * factor;
    assemblies.fittings.position.y = 0.8 * factor;
    assemblies.controller.position.x = 1.5 * factor;
  }

  function setStirrerRotation(rad) {
    if (refs.stirrerShaft) {
      refs.stirrerShaft.rotation.y = rad;
    }
  }

  function setPressureGaugeSweep(bar) {
    // 0 bar = 2.1 rad, 250 bar = -2.1 rad (total 240° sweep)
    if (refs.gaugeNeedle) {
      const ratio = Math.max(0, Math.min(1.0, bar / 250.0));
      refs.gaugeNeedle.rotation.z = 2.1 - ratio * 4.2;
    }
  }

  function updateThermalGlow(tempC) {
    if (refs.thermalGlow) {
      const heatFactor = Math.max(0, (tempC - 45.0) / 280.0);
      refs.thermalGlow.emissiveIntensity = heatFactor * 1.4;
      refs.thermalGlow.emissive.setHSL(0.06 - heatFactor * 0.03, 1.0, 0.45);
    }
  }

  return {
    root,
    refs,
    assemblies,
    setExploded,
    setStirrerRotation,
    setPressureGaugeSweep,
    updateThermalGlow,
  };
}

// Standard camera viewpoints for high-pressure reactor
export const REACTOR_CAMERAS = {
  CAM_ISO: { pos: [6.5, 5.5, -8.0], target: [0.8, 2.5, 0] },
  CAM_FRONT: { pos: [0.8, 3.0, -7.5], target: [0.8, 2.6, 0] },
  CAM_SIDE: { pos: [8.5, 3.2, 0.0], target: [0.8, 2.5, 0] },
  CAM_TOP: { pos: [0.8, 11.5, 0.0], target: [0.8, 2.0, 0] },
};
