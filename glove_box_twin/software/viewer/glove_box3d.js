/**
 * SREdesigns UNI-9000 Pro Inert Atmosphere Glove Box — Procedural Three.js CAD Twin
 * 
 * Gold-Tier Procedural Laboratory Twin adhering strictly to Semantic Part Taxonomy:
 * - Square-tube steel stand frame with leveling feet (Body_StandFrame, Foot_Leveling_*)
 * - 304 Welded stainless steel main chamber (Body_Chassis) with 10° slanted front window face
 * - 12.7 mm Optical acrylic front viewing panel (Glass_ViewPanel)
 * - Perimeter window compression fasteners (Fastener_WindowBolt_*)
 * - Dual 203 mm (8") machined anodized aluminum glove ports (Body_GlovePort_Left, Body_GlovePort_Right)
 * - Molded 24" butyl rubber glove sleeves (Body_GloveSleeve_Left, Body_GloveSleeve_Right)
 * - Cylindrical 254 mm (10") stainless steel transfer antechamber (Body_AntechamberTube)
 * - Outer and inner swing-out circular transfer doors (Pivot_DoorOuter, Pivot_DoorInner, Body_DoorClampOuter, Body_DoorClampInner)
 * - Perforated stainless transfer slide tray (Body_AntechamberTray)
 * - Analog Bourdon tube antechamber vacuum gauge (UI_AntechamberGauge, Pivot_GaugeNeedle, Glass_GaugeLens)
 * - Three-way vacuum roughing and inert refill valve controls (Knob_AntechamberVacValve, Knob_AntechamberPurgeValve)
 * - Closed-loop gas purification column and circulation blower (Body_PurifierColumn, Body_CircBlower)
 * - 10" Color TFT touchscreen PLC control console (Body_ConsoleBezel, UI_LCD, Btn_Power)
 * - Dual-action operator foot switch pedal (Pivot_FootPedal, Body_FootPedalHousing)
 * - Interior perforated SS deck, upper chemical shelving, LED luminaire bar (Body_InternalDeck, Body_InternalShelf, Body_LightBar, Body_LightDiffuser)
 * - SREdesigns canonical brand badge (Badge_SREdesigns)
 * 
 * Units: 1 unit ≈ 100 mm (Width 12.2 ≈ 1220 mm with antechamber, Depth 7.0 ≈ 700 mm, Height 15.5 ≈ 1550 mm).
 * Y-up, front = -Z. Datum Y = 0 on floor.
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

const matSSBrushed   = M(0xd0d5dc, { r: 0.28, m: 0.88, side: THREE.DoubleSide });
const matSSPolished  = M(0xe8edf2, { r: 0.15, m: 0.95, side: THREE.DoubleSide });
const matSteelDark   = M(0x3a3e46, { r: 0.40, m: 0.75 });
const matStandPowder = M(0x22262d, { r: 0.60, m: 0.35 });
const matBrass       = M(0xd4af37, { r: 0.30, m: 0.80 });
const matRubberGlove = M(0x1a1a1e, { r: 0.75, m: 0.05, side: THREE.DoubleSide });
const matRubberNeoprene = M(0x111215, { r: 0.90, m: 0.02 });
const matAcrylicClear = M(0xf0f6ff, { r: 0.05, m: 0.05, o: 0.22, side: THREE.DoubleSide, dw: false });
const matGaugeGlass  = M(0xffffff, { r: 0.02, m: 0.10, o: 0.30, side: THREE.DoubleSide, dw: false });
const matConsoleBezel = M(0x181c22, { r: 0.45, m: 0.20 });
const matLedDiffuser = M(0xffffff, { r: 0.20, m: 0.02, e: 0xf8fafc, ei: 1.2 });
const matNeedleRed   = M(0xef4444, { r: 0.30, m: 0.20, e: 0xef4444, ei: 0.2 });

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
// Main 3D Glove Box Builder
// ---------------------------------------------------------------------------
export function buildGloveBox3D(options = {}) {
  const root = new THREE.Group();
  root.name = 'Body_GloveBoxRoot';

  // Sub-assemblies for animation and exploded view
  const assemblies = {
    stand: new THREE.Group(),
    chamber: new THREE.Group(),
    window: new THREE.Group(),
    gloves: new THREE.Group(),
    antechamber: new THREE.Group(),
    purifier: new THREE.Group(),
    console: new THREE.Group(),
    footPedal: new THREE.Group(),
  };

  assemblies.stand.name = 'Body_StandAssembly';
  assemblies.chamber.name = 'Body_ChassisAssembly';
  assemblies.window.name = 'Body_WindowAssembly';
  assemblies.gloves.name = 'Body_GlovesAssembly';
  assemblies.antechamber.name = 'Body_AntechamberAssembly';
  assemblies.purifier.name = 'Body_PurifierAssembly';
  assemblies.console.name = 'Body_ConsoleAssembly';
  assemblies.footPedal.name = 'Body_FootPedalAssembly';

  // Key kinematic references returned to app.js
  const refs = {
    outerDoorPivot: null,
    innerDoorPivot: null,
    footPedalPivot: null,
    gaugeNeedle: null,
    lcdMesh: null,
    gloveLeft: null,
    gloveRight: null,
    vacValveKnob: null,
    purgeValveKnob: null,
  };

  // Dimensions (units ≈ 100 mm)
  const STAND_H = 7.60;
  const CHAMBER_W = 9.14;
  const CHAMBER_D = 6.10;
  const CHAMBER_H = 7.62;
  const CHAMBER_BASE_Y = STAND_H;

  // -------------------------------------------------------------------------
  // 1. Stand & Leveling Feet (Resting on datum Y = 0)
  // -------------------------------------------------------------------------
  const standFrame = new THREE.Group();
  standFrame.name = 'Body_StandFrame';

  const tubeThick = 0.40;
  const legX = CHAMBER_W / 2 - tubeThick / 2;
  const legZ = CHAMBER_D / 2 - tubeThick / 2;

  // 4 Legs
  const legPositions = [
    [-legX, STAND_H / 2, -legZ],
    [ legX, STAND_H / 2, -legZ],
    [-legX, STAND_H / 2,  legZ],
    [ legX, STAND_H / 2,  legZ],
  ];

  legPositions.forEach((pos) => {
    const leg = box(tubeThick, STAND_H, tubeThick, matStandPowder);
    leg.position.set(pos[0], pos[1], pos[2]);
    standFrame.add(leg);
  });

  // Top perimeter stretchers
  const topFront = box(CHAMBER_W, tubeThick, tubeThick, matStandPowder);
  topFront.position.set(0, STAND_H - tubeThick / 2, -legZ);
  standFrame.add(topFront);

  const topBack = box(CHAMBER_W, tubeThick, tubeThick, matStandPowder);
  topBack.position.set(0, STAND_H - tubeThick / 2, legZ);
  standFrame.add(topBack);

  const topLeft = box(tubeThick, tubeThick, CHAMBER_D - tubeThick * 2, matStandPowder);
  topLeft.position.set(-legX, STAND_H - tubeThick / 2, 0);
  standFrame.add(topLeft);

  const topRight = box(tubeThick, tubeThick, CHAMBER_D - tubeThick * 2, matStandPowder);
  topRight.position.set(legX, STAND_H - tubeThick / 2, 0);
  standFrame.add(topRight);

  // Bottom stretchers (cross braces)
  const botFront = box(CHAMBER_W, tubeThick, tubeThick, matStandPowder);
  botFront.position.set(0, 1.20, -legZ);
  standFrame.add(botFront);

  const botBack = box(CHAMBER_W, tubeThick, tubeThick, matStandPowder);
  botBack.position.set(0, 1.20, legZ);
  standFrame.add(botBack);

  const botLeft = box(tubeThick, tubeThick, CHAMBER_D - tubeThick * 2, matStandPowder);
  botLeft.position.set(-legX, 1.20, 0);
  standFrame.add(botLeft);

  const botRight = box(tubeThick, tubeThick, CHAMBER_D - tubeThick * 2, matStandPowder);
  botRight.position.set(legX, 1.20, 0);
  standFrame.add(botRight);

  // Storage shelf on stand
  const standShelf = box(CHAMBER_W - 0.8, 0.08, CHAMBER_D - 0.8, matStandPowder);
  standShelf.name = 'Body_StandShelf';
  standShelf.position.set(0, 1.24, 0);
  standFrame.add(standShelf);

  // 4 Leveling Neoprene Feet with threaded M12 brass studs
  const footNames = ['Foot_Leveling_FL', 'Foot_Leveling_FR', 'Foot_Leveling_RL', 'Foot_Leveling_RR'];
  const footOffsets = [
    [-legX, -legZ],
    [ legX, -legZ],
    [-legX,  legZ],
    [ legX,  legZ],
  ];

  footOffsets.forEach(([fx, fz], idx) => {
    const footGroup = new THREE.Group();
    footGroup.name = footNames[idx];

    // Threaded stud
    const stud = cyl(0.06, 0.06, 0.35, matBrass, 16);
    stud.position.y = 0.22;
    footGroup.add(stud);

    // Neoprene rubber pad
    const pad = cyl(0.32, 0.36, 0.12, matRubberNeoprene, 24);
    pad.position.y = 0.06;
    footGroup.add(pad);

    footGroup.position.set(fx, 0, fz);
    standFrame.add(footGroup);
  });

  assemblies.stand.add(standFrame);

  // -------------------------------------------------------------------------
  // 2. Foot Pedal Assembly (Mounted on front lower crossbar)
  // -------------------------------------------------------------------------
  const pedalAssembly = new THREE.Group();
  pedalAssembly.name = 'Body_FootPedalHousing';
  pedalAssembly.position.set(0, 0.30, -legZ + 0.40);

  const pedalBase = box(1.0, 0.15, 1.4, matStandPowder);
  pedalAssembly.add(pedalBase);

  // Pivotable foot pedal
  const footPedalPivot = new THREE.Group();
  footPedalPivot.name = 'Pivot_FootPedal';
  footPedalPivot.position.set(0, 0.12, 0.45);

  const pedalPlate = box(0.85, 0.10, 1.1, matSteelDark);
  pedalPlate.position.set(0, 0.05, -0.55);
  footPedalPivot.add(pedalPlate);

  pedalAssembly.add(footPedalPivot);
  refs.footPedalPivot = footPedalPivot;
  assemblies.footPedal.add(pedalAssembly);

  // -------------------------------------------------------------------------
  // 3. Main 304 Stainless Steel Welded Chamber
  // -------------------------------------------------------------------------
  const chamberGroup = new THREE.Group();
  chamberGroup.name = 'Body_Chassis';
  chamberGroup.position.set(0, CHAMBER_BASE_Y, 0);

  // Chamber bottom deck plate
  const floorPlate = box(CHAMBER_W, 0.12, CHAMBER_D, matSSBrushed);
  floorPlate.position.set(0, 0.06, 0);
  chamberGroup.add(floorPlate);

  // Chamber ceiling roof
  const roofPlate = box(CHAMBER_W, 0.12, CHAMBER_D, matSSBrushed);
  roofPlate.position.set(0, CHAMBER_H - 0.06, 0);
  chamberGroup.add(roofPlate);

  // Chamber back wall
  const backWall = box(CHAMBER_W, CHAMBER_H, 0.12, matSSBrushed);
  backWall.position.set(0, CHAMBER_H / 2, CHAMBER_D / 2 - 0.06);
  chamberGroup.add(backWall);

  // Chamber left side wall
  const leftWall = box(0.12, CHAMBER_H, CHAMBER_D, matSSBrushed);
  leftWall.position.set(-CHAMBER_W / 2 + 0.06, CHAMBER_H / 2, 0);
  chamberGroup.add(leftWall);

  // Chamber right side wall (with cutout collar for antechamber)
  const rightWall = box(0.12, CHAMBER_H, CHAMBER_D, matSSBrushed);
  rightWall.position.set(CHAMBER_W / 2 - 0.06, CHAMBER_H / 2, 0);
  chamberGroup.add(rightWall);

  // Front sloped corner posts and header
  const frontTopHeader = box(CHAMBER_W, 0.80, 0.15, matSSBrushed);
  frontTopHeader.position.set(0, CHAMBER_H - 0.40, -CHAMBER_D / 2 + 0.08);
  chamberGroup.add(frontTopHeader);

  const frontBottomSill = box(CHAMBER_W, 0.60, 0.15, matSSBrushed);
  frontBottomSill.position.set(0, 0.30, -CHAMBER_D / 2 + 0.08);
  chamberGroup.add(frontBottomSill);

  // Perforated 304 SS Internal Deck
  const internalDeck = box(CHAMBER_W - 0.4, 0.08, CHAMBER_D - 0.4, matSSPolished);
  internalDeck.name = 'Body_InternalDeck';
  internalDeck.position.set(0, 0.65, 0);
  chamberGroup.add(internalDeck);

  // Upper chemical storage shelf
  const internalShelf = box(CHAMBER_W - 0.8, 0.06, 1.8, matSSPolished);
  internalShelf.name = 'Body_InternalShelf';
  internalShelf.position.set(0, CHAMBER_H - 2.2, CHAMBER_D / 2 - 1.1);
  chamberGroup.add(internalShelf);

  // Internal LED Luminaire Bar
  const lightBar = box(CHAMBER_W - 1.2, 0.15, 0.45, matStandPowder);
  lightBar.name = 'Body_LightBar';
  lightBar.position.set(0, CHAMBER_H - 0.15, 0);
  chamberGroup.add(lightBar);

  const lightDiffuser = box(CHAMBER_W - 1.3, 0.04, 0.38, matLedDiffuser);
  lightDiffuser.name = 'Body_LightDiffuser';
  lightDiffuser.position.set(0, CHAMBER_H - 0.23, 0);
  chamberGroup.add(lightDiffuser);

  // Gas Diffusers
  const diffInlet = cyl(0.18, 0.18, 0.25, matSSPolished, 16);
  diffInlet.name = 'Body_GasDiffuser_Inlet';
  diffInlet.position.set(-CHAMBER_W / 2 + 1.2, CHAMBER_H - 0.25, 0);
  chamberGroup.add(diffInlet);

  const diffOutlet = cyl(0.18, 0.18, 0.25, matSSPolished, 16);
  diffOutlet.name = 'Body_GasDiffuser_Outlet';
  diffOutlet.position.set(CHAMBER_W / 2 - 1.2, CHAMBER_H - 0.25, 0);
  chamberGroup.add(diffOutlet);

  // Brand Badge on upper front header
  const badgeMesh = box(1.8, 0.38, 0.04, matConsoleBezel);
  badgeMesh.name = 'Badge_SREdesigns';
  badgeMesh.position.set(0, CHAMBER_H - 0.40, -CHAMBER_D / 2 + 0.18);
  chamberGroup.add(badgeMesh);

  assemblies.chamber.add(chamberGroup);

  // -------------------------------------------------------------------------
  // 4. Front Slanted Acrylic Viewing Window & Fasteners
  // -------------------------------------------------------------------------
  const windowGroup = new THREE.Group();
  windowGroup.name = 'Body_WindowFrame';
  windowGroup.position.set(0, CHAMBER_BASE_Y, 0);

  const winW = CHAMBER_W - 0.30;
  const winH = CHAMBER_H - 1.30;
  const winZ = -CHAMBER_D / 2 + 0.10;
  const winY = (CHAMBER_H + 0.60 - 0.80) / 2;

  // Slanted window pane (12.7 mm optical acrylic)
  const windowPane = box(winW, winH, 0.12, matAcrylicClear);
  windowPane.name = 'Glass_ViewPanel';
  windowPane.position.set(0, winY, winZ);
  windowGroup.add(windowPane);

  // 16 Compression Perimeter Bolts
  for (let i = 0; i < 8; i++) {
    const bx = -winW / 2 + 0.4 + (i * (winW - 0.8) / 7);
    // Top row
    const boltTop = cyl(0.05, 0.05, 0.08, matSSPolished, 12);
    boltTop.name = `Fastener_WindowBolt_Top${i + 1}`;
    boltTop.rotation.x = Math.PI / 2;
    boltTop.position.set(bx, winY + winH / 2 - 0.08, winZ - 0.07);
    windowGroup.add(boltTop);

    // Bottom row
    const boltBot = cyl(0.05, 0.05, 0.08, matSSPolished, 12);
    boltBot.name = `Fastener_WindowBolt_Bot${i + 1}`;
    boltBot.rotation.x = Math.PI / 2;
    boltBot.position.set(bx, winY - winH / 2 + 0.08, winZ - 0.07);
    windowGroup.add(boltBot);
  }

  assemblies.window.add(windowGroup);

  // -------------------------------------------------------------------------
  // 5. Dual 203 mm (8") Glove Ports & Butyl Rubber Sleeves
  // -------------------------------------------------------------------------
  const glovesGroup = new THREE.Group();
  glovesGroup.name = 'Body_GlovePortAssembly';
  glovesGroup.position.set(0, CHAMBER_BASE_Y, 0);

  const portSpacingX = 2.40;
  const portY = winY - 0.60;
  const portRadius = 1.05; // ~210 mm OD

  const portPositions = [-portSpacingX, portSpacingX];
  const portPrefixes = ['Left', 'Right'];

  portPositions.forEach((px, idx) => {
    const side = portPrefixes[idx];
    const portGroup = new THREE.Group();
    portGroup.name = `Body_GlovePort_${side}`;
    portGroup.position.set(px, portY, winZ);

    // Aluminum port ring
    const ringGeo = new THREE.TorusGeometry(portRadius, 0.12, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, matSSPolished);
    ringMesh.name = `Body_PortRing_${side}`;
    ringGroup.add(ringMesh);

    // Stainless clamp band
    const clampBand = cyl(portRadius + 0.04, portRadius + 0.04, 0.12, matSSBrushed, 32);
    clampBand.name = `Fastener_GloveClamp_${side}`;
    clampBand.rotation.x = Math.PI / 2;
    portGroup.add(clampBand);

    // Butyl rubber glove sleeve projecting inward (+Z) or standing
    const gloveGeo = new THREE.CylinderGeometry(portRadius - 0.05, portRadius * 0.45, 4.80, 24, 8);
    const gloveMesh = new THREE.Mesh(gloveGeo, matRubberGlove);
    gloveMesh.name = `Body_GloveSleeve_${side}`;
    gloveMesh.rotation.x = -Math.PI / 2 + 0.12;
    gloveMesh.position.set(0, -0.40, 2.20);
    portGroup.add(gloveMesh);

    // Hand cuff / palm
    const palm = box(0.70, 0.25, 0.90, matRubberGlove);
    palm.name = `Body_GloveHand_${side}`;
    palm.position.set(0, -0.80, 4.40);
    portGroup.add(palm);

    glovesGroup.add(portGroup);

    if (side === 'Left') refs.gloveLeft = gloveMesh;
    if (side === 'Right') refs.gloveRight = gloveMesh;
  });

  assemblies.gloves.add(glovesGroup);

  // -------------------------------------------------------------------------
  // 6. Cylindrical Transfer Antechamber & Counterbalanced Swing Doors
  // -------------------------------------------------------------------------
  const antechamberGroup = new THREE.Group();
  antechamberGroup.name = 'Body_AntechamberAssembly';

  const anteRadius = 1.30; // 260 mm dia
  const anteLength = 3.60; // 360 mm length
  const anteCenterY = CHAMBER_BASE_Y + 3.20;
  const anteWallX = CHAMBER_W / 2;

  antechamberGroup.position.set(anteWallX + anteLength / 2, anteCenterY, 0);

  // Main cylindrical SS body
  const anteTubeGeo = new THREE.CylinderGeometry(anteRadius, anteRadius, anteLength, 36);
  const anteTube = new THREE.Mesh(anteTubeGeo, matSSBrushed);
  anteTube.name = 'Body_AntechamberTube';
  anteTube.rotation.z = Math.PI / 2;
  antechamberGroup.add(anteTube);

  // Sliding stainless tray inside antechamber
  const anteTray = box(anteLength - 0.4, 0.06, anteRadius * 1.5, matSSPolished);
  anteTray.name = 'Body_AntechamberTray';
  anteTray.position.set(0, -anteRadius * 0.45, 0);
  antechamberGroup.add(anteTray);

  // Outer Swing Door (Laboratory side, +X)
  const outerDoorPivot = new THREE.Group();
  outerDoorPivot.name = 'Pivot_DoorOuter';
  outerDoorPivot.position.set(anteLength / 2 + 0.05, 0, anteRadius * 0.95);

  const outerDoor = new THREE.Group();
  outerDoor.name = 'Body_DoorOuter';

  const outerFlange = cyl(anteRadius + 0.15, anteRadius + 0.15, 0.18, matSSBrushed, 32);
  outerFlange.rotation.z = Math.PI / 2;
  outerFlange.position.set(0, 0, -anteRadius * 0.95);
  outerDoor.add(outerFlange);

  // Central clamping handwheel
  const outerClampWheel = cyl(0.35, 0.35, 0.22, matBrass, 16);
  outerClampWheel.name = 'Body_DoorClampOuter';
  outerClampWheel.rotation.z = Math.PI / 2;
  outerClampWheel.position.set(0.12, 0, -anteRadius * 0.95);
  outerDoor.add(outerClampWheel);

  outerDoorPivot.add(outerDoor);
  antechamberGroup.add(outerDoorPivot);
  refs.outerDoorPivot = outerDoorPivot;

  // Inner Swing Door (Glovebox interior side, -X)
  const innerDoorPivot = new THREE.Group();
  innerDoorPivot.name = 'Pivot_DoorInner';
  innerDoorPivot.position.set(-anteLength / 2 - 0.05, 0, anteRadius * 0.95);

  const innerDoor = new THREE.Group();
  innerDoor.name = 'Body_DoorInner';

  const innerFlange = cyl(anteRadius + 0.15, anteRadius + 0.15, 0.18, matSSBrushed, 32);
  innerFlange.rotation.z = Math.PI / 2;
  innerFlange.position.set(0, 0, -anteRadius * 0.95);
  innerDoor.add(innerFlange);

  const innerClampWheel = cyl(0.35, 0.35, 0.22, matBrass, 16);
  innerClampWheel.name = 'Body_DoorClampInner';
  innerClampWheel.rotation.z = Math.PI / 2;
  innerClampWheel.position.set(-0.12, 0, -anteRadius * 0.95);
  innerDoor.add(innerClampWheel);

  innerDoorPivot.add(innerDoor);
  antechamberGroup.add(innerDoorPivot);
  refs.innerDoorPivot = innerDoorPivot;

  // Analog Bourdon Tube Vacuum Gauge atop antechamber
  const gaugeGroup = new THREE.Group();
  gaugeGroup.name = 'Body_AntechamberGauge';
  gaugeGroup.position.set(0, anteRadius + 0.65, -0.60);

  const gaugeBezel = cyl(0.42, 0.42, 0.18, matSSPolished, 24);
  gaugeBezel.rotation.x = Math.PI / 2;
  gaugeGroup.add(gaugeBezel);

  const gaugeDial = cyl(0.38, 0.38, 0.02, M(0xffffff, { r: 0.8 }), 24);
  gaugeDial.rotation.x = Math.PI / 2;
  gaugeDial.position.z = -0.08;
  gaugeGroup.add(gaugeDial);

  const gaugeLens = cyl(0.40, 0.40, 0.02, matGaugeGlass, 24);
  gaugeLens.name = 'Glass_GaugeLens';
  gaugeLens.rotation.x = Math.PI / 2;
  gaugeLens.position.z = -0.10;
  gaugeGroup.add(gaugeLens);

  // Red Vacuum Pointer Needle
  const gaugeNeedlePivot = new THREE.Group();
  gaugeNeedlePivot.name = 'Pivot_GaugeNeedle';
  gaugeNeedlePivot.position.set(0, 0, -0.09);

  const needleBlade = box(0.03, 0.30, 0.01, matNeedleRed);
  needleBlade.position.y = 0.12;
  gaugeNeedlePivot.add(needleBlade);

  gaugeGroup.add(gaugeNeedlePivot);
  refs.gaugeNeedle = gaugeNeedlePivot;

  antechamberGroup.add(gaugeGroup);

  // Manual Vacuum and Purge 3-Way Valves
  const vacValve = cyl(0.18, 0.18, 0.20, matBrass, 16);
  vacValve.name = 'Knob_AntechamberVacValve';
  vacValve.position.set(-0.60, anteRadius + 0.35, 0.40);
  antechamberGroup.add(vacValve);
  refs.vacValveKnob = vacValve;

  const purgeValve = cyl(0.18, 0.18, 0.20, matSSBrushed, 16);
  purgeValve.name = 'Knob_AntechamberPurgeValve';
  purgeValve.position.set(0.60, anteRadius + 0.35, 0.40);
  antechamberGroup.add(purgeValve);
  refs.purgeValveKnob = purgeValve;

  assemblies.antechamber.add(antechamberGroup);

  // -------------------------------------------------------------------------
  // 7. Gas Purification Column & Circulation Blower (Rear Frame)
  // -------------------------------------------------------------------------
  const purifierGroup = new THREE.Group();
  purifierGroup.name = 'Body_PurifierAssembly';
  purifierGroup.position.set(-CHAMBER_W / 4, STAND_H + 2.50, CHAMBER_D / 2 + 0.80);

  // Vertical copper catalyst column cylinder
  const column = cyl(0.70, 0.70, 4.50, matSSBrushed, 24);
  column.name = 'Body_PurifierColumn';
  purifierGroup.add(column);

  // Circulation Blower motor
  const blower = cyl(0.55, 0.55, 1.40, matStandPowder, 20);
  blower.name = 'Body_CircBlower';
  blower.rotation.x = Math.PI / 2;
  blower.position.set(1.50, -1.20, 0);
  purifierGroup.add(blower);

  // Stainless interconnecting pipe ducts
  const pipe = cyl(0.15, 0.15, 1.80, matSSPolished, 16);
  pipe.rotation.z = Math.PI / 2;
  pipe.position.set(0.75, 1.50, 0);
  purifierGroup.add(pipe);

  assemblies.purifier.add(purifierGroup);

  // -------------------------------------------------------------------------
  // 8. 10" Color TFT Touchscreen PLC Console (Mounted on left upright frame)
  // -------------------------------------------------------------------------
  const consoleGroup = new THREE.Group();
  consoleGroup.name = 'Body_ConsoleAssembly';
  consoleGroup.position.set(-CHAMBER_W / 2 - 0.40, CHAMBER_BASE_Y + 4.80, -CHAMBER_D / 2 + 0.60);
  consoleGroup.rotation.y = 0.35; // Angled towards operator

  const consoleBezel = box(2.40, 1.80, 0.25, matConsoleBezel);
  consoleBezel.name = 'Body_ConsoleBezel';
  consoleGroup.add(consoleBezel);

  // Live Dynamic Canvas LCD quad
  const lcdPlaneGeo = new THREE.PlaneGeometry(2.15, 1.55);
  // Default placeholder material until texture attached
  const lcdMat = new THREE.MeshBasicMaterial({ color: 0x0a101a });
  const lcdMesh = new THREE.Mesh(lcdPlaneGeo, lcdMat);
  lcdMesh.name = 'UI_LCD';
  lcdMesh.position.set(0, 0, 0.13); // Positive clearance
  consoleGroup.add(lcdMesh);
  refs.lcdMesh = lcdMesh;

  // Power Button
  const btnPower = box(0.20, 0.20, 0.06, M(0x22c55e, { e: 0x22c55e, ei: 0.5 }));
  btnPower.name = 'Btn_Power';
  btnPower.position.set(0.95, -0.72, 0.14);
  consoleGroup.add(btnPower);

  assemblies.console.add(consoleGroup);

  // Add all assemblies to root
  Object.values(assemblies).forEach((grp) => root.add(grp));

  // -------------------------------------------------------------------------
  // Exploded View & Kinematics Control API
  // -------------------------------------------------------------------------
  let isExploded = false;
  const originalPositions = new Map();

  root.traverse((node) => {
    if (node.isMesh || node.isGroup) {
      originalPositions.set(node.uuid, node.position.clone());
    }
  });

  function setExploded(exploded) {
    isExploded = !!exploded;
    const factor = isExploded ? 1.0 : 0.0;

    assemblies.stand.position.y = -1.2 * factor;
    assemblies.window.position.z = -1.8 * factor;
    assemblies.gloves.position.z = -2.8 * factor;
    assemblies.antechamber.position.x = 2.4 * factor;
    assemblies.purifier.position.z = 2.0 * factor;
    assemblies.console.position.x = -1.6 * factor;
    assemblies.footPedal.position.z = -1.0 * factor;
  }

  function setOuterDoorAngle(rad) {
    if (refs.outerDoorPivot) {
      refs.outerDoorPivot.rotation.y = rad;
    }
  }

  function setInnerDoorAngle(rad) {
    if (refs.innerDoorPivot) {
      refs.innerDoorPivot.rotation.y = rad;
    }
  }

  function setFootPedalAngle(rad) {
    if (refs.footPedalPivot) {
      refs.footPedalPivot.rotation.x = rad;
    }
  }

  function setVacuumGaugeNeedle(vacuumRatio) {
    // 0 = atmospheric (0 mbar vac), 1.0 = deep vacuum (-1000 mbar)
    // Sweep ~240 degrees (from 2.1 rad to -2.1 rad)
    if (refs.gaugeNeedle) {
      const angle = 2.1 - (vacuumRatio * 4.2);
      refs.gaugeNeedle.rotation.z = angle;
    }
  }

  return {
    root,
    refs,
    assemblies,
    setExploded,
    setOuterDoorAngle,
    setInnerDoorAngle,
    setFootPedalAngle,
    setVacuumGaugeNeedle,
  };
}

// Standard camera viewpoints for glove box
export const GLOVE_BOX_CAMERAS = {
  CAM_ISO: { pos: [14.0, 16.0, -18.0], target: [0, 8.5, 0] },
  CAM_FRONT: { pos: [0.0, 10.5, -15.0], target: [0, 9.5, 0] },
  CAM_SIDE: { pos: [18.0, 10.5, 0.0], target: [5.0, 10.0, 0] },
  CAM_TOP: { pos: [0.0, 26.0, 0.0], target: [0, 8.5, 0] },
};
