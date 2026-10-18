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
 * - Complete Internal Electronics Bay & Industrial PLC Controller:
 *   * NEMA-rated steel automation enclosure (Body_PLCCabinet) with hinged inspection door (Body_PLCCabinetDoor)
 *   * Industrial PLC CPU motherboard module (Module_PLC_CPU) with Gigabit Ethernet RJ45 port (Port_Ethernet_RJ45)
 *   * Digital I/O expansion slice modules (Module_PLC_IO)
 *   * 24V DC DIN-rail switching power supply (Power_Supply_24VDC) with status LED
 *   * Crydom solid-state relay (Module_SSR_Regen) on extruded aluminum heatsink (Heatsink_SSR_Regen)
 *   * DIN-rail miniature circuit breakers (Breakers_DIN_Array) and barrier terminal strip
 *   * Working 80mm cabinet cooling fan (Fan_CabinetCooling_Blower) with spinning blades and wire finger guard
 *   * Braided spiral power and CAT6 communication wiring harness (Harness_PowerAndData)
 * - Rotary Vane Vacuum Roughing Pump on stand lower deck (Pump_Vacuum_RotaryVane) with oil mist filter
 * - Trace O2 fuel cell sensor (Sensor_O2_Electrochemical) and ceramic moisture probe (Sensor_H2O_TraceMoisture)
 * - Physical circuit continuity: Bench duplex outlet (Power_Receptacle_Duplex), molded NEMA 5-15P plug (Power_Plug_NEMA), SJTOW power cord (Power_Cord_SJTOW)
 * - Canonical SREdesigns brand badge (Badge_SREdesigns)
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

const matSSBrushed         = M(0xd0d5dc, { r: 0.28, m: 0.88, side: THREE.DoubleSide });
const matSSPolished        = M(0xe8edf2, { r: 0.15, m: 0.95, side: THREE.DoubleSide });
const matSteelDark         = M(0x3a3e46, { r: 0.40, m: 0.75 });
const matStandPowder       = M(0x22262d, { r: 0.60, m: 0.35 });
const matBrass             = M(0xd4af37, { r: 0.30, m: 0.80 });
const matRubberGlove       = M(0x1a1a1e, { r: 0.75, m: 0.05, side: THREE.DoubleSide });
const matRubberNeoprene    = M(0x111215, { r: 0.90, m: 0.02 });
const matAcrylicClear      = M(0xf0f6ff, { r: 0.05, m: 0.05, o: 0.22, side: THREE.DoubleSide, dw: false });
const matGaugeGlass        = M(0xffffff, { r: 0.02, m: 0.10, o: 0.30, side: THREE.DoubleSide, dw: false });
const matConsoleBezel      = M(0x181c22, { r: 0.45, m: 0.20 });
const matLedDiffuser       = M(0xffffff, { r: 0.20, m: 0.02, e: 0xf8fafc, ei: 1.2 });
const matNeedleRed         = M(0xef4444, { r: 0.30, m: 0.20, e: 0xef4444, ei: 0.2 });

// Electronics and wiring palette
const matPcbGreen          = M(0x0f5132, { r: 0.45, m: 0.15 });
const matPcbSilkscreen     = M(0xe2e8f0, { r: 0.60, m: 0.05 });
const matChipBlack         = M(0x121417, { r: 0.50, m: 0.20 });
const matHeatsinkAlum      = M(0xb0b8c4, { r: 0.25, m: 0.90 });
const matWireRed           = M(0xdc2626, { r: 0.50 });
const matWireBlack         = M(0x1e293b, { r: 0.60 });
const matWireBlue          = M(0x2563eb, { r: 0.50 });
const matWireBrown         = M(0x92400e, { r: 0.50 });
const matWireYellowGreen   = M(0x84cc16, { r: 0.50 });
const matWireTeal          = M(0x0d9488, { r: 0.50 });
const matTerminalOrange    = M(0xea580c, { r: 0.50 });
const matIndustrialGray    = M(0x2d343f, { r: 0.55, m: 0.30 });
const matIndustrialLightGray = M(0xd1d5db, { r: 0.45, m: 0.40 });
const matCopper            = M(0xb87333, { r: 0.35, m: 0.85 });
const matHoseOrange        = M(0xf97316, { r: 0.60, o: 0.85 });
const matHoseBlue          = M(0x38bdf8, { r: 0.60, o: 0.85 });

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
    electronics: new THREE.Group(),
    vacuumPump: new THREE.Group(),
    powerContinuity: new THREE.Group(),
  };

  assemblies.stand.name = 'Body_StandAssembly';
  assemblies.chamber.name = 'Body_ChassisAssembly';
  assemblies.window.name = 'Body_WindowAssembly';
  assemblies.gloves.name = 'Body_GlovesAssembly';
  assemblies.antechamber.name = 'Body_AntechamberAssembly';
  assemblies.purifier.name = 'Body_PurifierAssembly';
  assemblies.console.name = 'Body_ConsoleAssembly';
  assemblies.footPedal.name = 'Body_FootPedalAssembly';
  assemblies.electronics.name = 'Body_ElectronicsAssembly';
  assemblies.vacuumPump.name = 'Body_VacuumPumpAssembly';
  assemblies.powerContinuity.name = 'Body_PowerContinuityAssembly';

  // Key kinematic references returned to app.js
  const refs = {
    outerDoorPivot: null,
    innerDoorPivot: null,
    footPedalPivot: null,
    gaugeNeedle: null,
    lcdMesh: null,
    btnPower: null,
    gloveLeft: null,
    gloveRight: null,
    vacValveKnob: null,
    purgeValveKnob: null,
    cabinetFan: null,
    plcDoor: null,
    plugGroup: null,
    cordMesh: null,
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
    portGroup.add(ringMesh);

    // Stainless clamp band
    const clampBand = cyl(portRadius + 0.04, portRadius + 0.04, 0.12, matSSBrushed, 32);
    clampBand.name = `Fastener_GloveClamp_${side}`;
    clampBand.rotation.x = Math.PI / 2;
    portGroup.add(clampBand);

    // Butyl rubber glove sleeve projecting inward (+Z)
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

  // Internal regeneration heating band
  const regenHeater = cyl(0.72, 0.72, 0.80, matBrass, 24);
  regenHeater.name = 'Heater_PurifierRegeneration';
  regenHeater.position.set(0, 0.4, 0);
  purifierGroup.add(regenHeater);

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

  // Inline Trace O2 Fuel Cell Analyzer Sensor
  const o2Sensor = cyl(0.18, 0.18, 0.40, matSSPolished, 16);
  o2Sensor.name = 'Sensor_O2_Electrochemical';
  o2Sensor.position.set(1.50, 1.50, 0);
  purifierGroup.add(o2Sensor);

  // Inline Trace Moisture Transmitter
  const h2oSensor = cyl(0.14, 0.14, 0.35, matBrass, 16);
  h2oSensor.name = 'Sensor_H2O_TraceMoisture';
  h2oSensor.position.set(0.20, 1.50, 0);
  purifierGroup.add(h2oSensor);

  assemblies.purifier.add(purifierGroup);

  // -------------------------------------------------------------------------
  // 8. Industrial PLC Controller Bay & Internal Electronics Assembly
  // -------------------------------------------------------------------------
  const elecGroup = new THREE.Group();
  elecGroup.name = 'Body_PLCCabinet';
  // Positioned squarely inside the lower stand frame under the chamber
  const plcCabinetW = 3.60;
  const plcCabinetH = 2.40;
  const plcCabinetD = 1.30;
  elecGroup.position.set(-0.40, STAND_H / 2 + 0.40, 0.20);

  // Main NEMA Enclosure Box (5 distinct hollow boundary panels so interior cavity is open when door opens)
  const wallThick = 0.05;
  const cabinetShell = new THREE.Group();
  cabinetShell.name = 'Body_PLCCabinetShell';

  // Back panel
  const cabBack = box(plcCabinetW, plcCabinetH, wallThick, matIndustrialGray);
  cabBack.name = 'Body_PLCCabinet_Back';
  cabBack.position.set(0, 0, plcCabinetD / 2 - wallThick / 2);
  cabinetShell.add(cabBack);

  // Top panel
  const cabTop = box(plcCabinetW, wallThick, plcCabinetD, matIndustrialGray);
  cabTop.name = 'Body_PLCCabinet_Top';
  cabTop.position.set(0, plcCabinetH / 2 - wallThick / 2, 0);
  cabinetShell.add(cabTop);

  // Bottom panel
  const cabBottom = box(plcCabinetW, wallThick, plcCabinetD, matIndustrialGray);
  cabBottom.name = 'Body_PLCCabinet_Bottom';
  cabBottom.position.set(0, -plcCabinetH / 2 + wallThick / 2, 0);
  cabinetShell.add(cabBottom);

  // Left panel
  const cabLeft = box(wallThick, plcCabinetH - 2 * wallThick, plcCabinetD, matIndustrialGray);
  cabLeft.name = 'Body_PLCCabinet_Left';
  cabLeft.position.set(-plcCabinetW / 2 + wallThick / 2, 0, 0);
  cabinetShell.add(cabLeft);

  // Right panel
  const cabRight = box(wallThick, plcCabinetH - 2 * wallThick, plcCabinetD, matIndustrialGray);
  cabRight.name = 'Body_PLCCabinet_Right';
  cabRight.position.set(plcCabinetW / 2 - wallThick / 2, 0, 0);
  cabinetShell.add(cabRight);

  elecGroup.add(cabinetShell);

  // Interior Inspection Light for PLC Cabinet
  const cabinetLight = new THREE.PointLight(0xffffff, 1.4, 5.0);
  cabinetLight.position.set(0, plcCabinetH / 2 - 0.25, 0);
  elecGroup.add(cabinetLight);

  // Hinged Enclosure Front Door
  const plcDoorPivot = new THREE.Group();
  plcDoorPivot.name = 'Pivot_PLCCabinetDoor';
  plcDoorPivot.position.set(-plcCabinetW / 2, 0, -plcCabinetD / 2);

  const plcDoor = box(plcCabinetW, plcCabinetH, 0.08, matIndustrialLightGray);
  plcDoor.name = 'Body_PLCCabinetDoor';
  plcDoor.position.set(plcCabinetW / 2, 0, -0.04);
  plcDoorPivot.add(plcDoor);

  // Quarter-turn chrome door latches
  const latch1 = cyl(0.08, 0.08, 0.08, matSSPolished, 12);
  latch1.name = 'Fastener_QuarterTurnLock_1';
  latch1.rotation.x = Math.PI / 2;
  latch1.position.set(plcCabinetW - 0.25, 0.70, -0.08);
  plcDoor.add(latch1);

  const latch2 = cyl(0.08, 0.08, 0.08, matSSPolished, 12);
  latch2.name = 'Fastener_QuarterTurnLock_2';
  latch2.rotation.x = Math.PI / 2;
  latch2.position.set(plcCabinetW - 0.25, -0.70, -0.08);
  plcDoor.add(latch2);

  elecGroup.add(plcDoorPivot);
  refs.plcDoor = plcDoorPivot;

  // Interior Galvanized Backplane Plate
  const backplane = box(plcCabinetW - 0.25, plcCabinetH - 0.25, 0.04, matSSBrushed);
  backplane.name = 'Body_PLCBackplane';
  backplane.position.set(0, 0, plcCabinetD / 2 - 0.12);
  elecGroup.add(backplane);

  // Standard 35mm Slotted DIN Rail
  const dinRail = box(plcCabinetW - 0.60, 0.12, 0.03, matSSPolished);
  dinRail.name = 'Rail_DIN_Industrial';
  dinRail.position.set(0, 0.20, plcCabinetD / 2 - 0.20);
  elecGroup.add(dinRail);

  // Siemens S7-1200 Style Industrial PLC CPU Module
  const plcCpu = box(1.05, 1.10, 0.60, matIndustrialGray);
  plcCpu.name = 'Module_PLC_CPU';
  plcCpu.position.set(-0.95, 0.20, plcCabinetD / 2 - 0.50);
  elecGroup.add(plcCpu);

  // CPU Status LEDs (RUN, STOP, ERROR)
  const ledRun = cyl(0.025, 0.025, 0.02, M(0x22c55e, { e: 0x22c55e, ei: 1.0 }), 12);
  ledRun.rotation.x = Math.PI / 2;
  ledRun.position.set(-0.95 - 0.35, 0.55, plcCabinetD / 2 - 0.81);
  elecGroup.add(ledRun);

  const ledStop = cyl(0.025, 0.025, 0.02, M(0xf59e0b, { e: 0xf59e0b, ei: 0.8 }), 12);
  ledStop.rotation.x = Math.PI / 2;
  ledStop.position.set(-0.95 - 0.25, 0.55, plcCabinetD / 2 - 0.81);
  elecGroup.add(ledStop);

  const ledErr = cyl(0.025, 0.025, 0.02, M(0xef4444, { e: 0xef4444, ei: 0.8 }), 12);
  ledErr.rotation.x = Math.PI / 2;
  ledErr.position.set(-0.95 - 0.15, 0.55, plcCabinetD / 2 - 0.81);
  elecGroup.add(ledErr);

  // Industrial RJ45 Comm Port on PLC bottom
  const rj45Port = box(0.18, 0.16, 0.16, matIndustrialLightGray);
  rj45Port.name = 'Port_Ethernet_RJ45';
  rj45Port.position.set(-0.95 + 0.30, -0.30, plcCabinetD / 2 - 0.50);
  elecGroup.add(rj45Port);

  // Booted Teal CAT6 Patch Cable
  const ethCable = cyl(0.04, 0.04, 1.40, matWireTeal, 12);
  ethCable.name = 'Cable_Ethernet_Cat6';
  ethCable.position.set(-0.95 + 0.30, -0.95, plcCabinetD / 2 - 0.50);
  elecGroup.add(ethCable);

  // Modular Digital I/O Expansion Slice
  const plcIo = box(0.45, 1.10, 0.55, matIndustrialGray);
  plcIo.name = 'Module_PLC_IO';
  plcIo.position.set(-0.15, 0.20, plcCabinetD / 2 - 0.48);
  elecGroup.add(plcIo);

  // 24V DC DIN-Rail Switching Power Supply (Mean Well NDR-120 style)
  const psu24v = box(0.55, 1.20, 0.65, matSSBrushed);
  psu24v.name = 'Power_Supply_24VDC';
  psu24v.position.set(0.45, 0.20, plcCabinetD / 2 - 0.52);
  elecGroup.add(psu24v);

  // DC-OK LED on PSU
  const psuLed = cyl(0.025, 0.025, 0.02, M(0x22c55e, { e: 0x22c55e, ei: 1.2 }), 12);
  psuLed.rotation.x = Math.PI / 2;
  psuLed.position.set(0.45, 0.65, plcCabinetD / 2 - 0.85);
  elecGroup.add(psuLed);

  // Solid State Relay (SSR) for Catalyst Regeneration Heater
  const ssrHeatsink = box(0.65, 0.75, 0.35, matHeatsinkAlum);
  ssrHeatsink.name = 'Heatsink_SSR_Regen';
  ssrHeatsink.position.set(1.15, 0.20, plcCabinetD / 2 - 0.38);
  elecGroup.add(ssrHeatsink);

  const ssrModule = box(0.50, 0.60, 0.15, matChipBlack);
  ssrModule.name = 'Module_SSR_Regen';
  ssrModule.position.set(1.15, 0.20, plcCabinetD / 2 - 0.56);
  elecGroup.add(ssrModule);

  // DIN-Rail Miniature Circuit Breakers (MCB Array)
  const mcbArray = box(0.70, 0.85, 0.45, matIndustrialLightGray);
  mcbArray.name = 'Breakers_DIN_Array';
  mcbArray.position.set(0.0, -0.65, plcCabinetD / 2 - 0.40);
  elecGroup.add(mcbArray);

  // Multi-Pole Terminal Strip with Color-Coded Wire Leads
  const termStrip = box(1.80, 0.25, 0.30, matIndustrialGray);
  termStrip.name = 'TerminalBlock_PLCDistribution';
  termStrip.position.set(0.0, 0.90, plcCabinetD / 2 - 0.35);
  elecGroup.add(termStrip);

  // Working 80mm Cabinet Cooling Fan with Spinning Blades
  const fanHousing = box(0.80, 0.80, 0.18, matSteelDark);
  fanHousing.name = 'Fan_CabinetCooling_Blower';
  fanHousing.position.set(plcCabinetW / 2 - 0.10, 0.20, 0);
  fanHousing.rotation.y = Math.PI / 2;
  elecGroup.add(fanHousing);

  const fanRotGroup = new THREE.Group();
  fanRotGroup.name = 'Pivot_FanImpeller';
  fanRotGroup.position.set(plcCabinetW / 2 - 0.18, 0.20, 0);
  fanRotGroup.rotation.y = Math.PI / 2;

  const fanHub = cyl(0.12, 0.12, 0.12, matSteelDark, 16);
  fanHub.rotation.x = Math.PI / 2;
  fanRotGroup.add(fanHub);

  // 7 Curved Fan Blades
  for (let b = 0; b < 7; b++) {
    const angle = (b * Math.PI * 2) / 7;
    const blade = box(0.04, 0.28, 0.08, matSteelDark);
    blade.position.set(Math.cos(angle) * 0.20, Math.sin(angle) * 0.20, 0);
    blade.rotation.z = angle + 0.4;
    fanRotGroup.add(blade);
  }
  elecGroup.add(fanRotGroup);
  refs.cabinetFan = fanRotGroup;

  // Chrome wire finger guard
  const fanGuard = cyl(0.38, 0.38, 0.04, matSSPolished, 24);
  fanGuard.name = 'Guard_FanFingerGuard';
  fanGuard.rotation.z = Math.PI / 2;
  fanGuard.position.set(plcCabinetW / 2 + 0.02, 0.20, 0);
  elecGroup.add(fanGuard);

  // Spiral Braided Wiring Harness routing up the left stand leg
  const harness = cyl(0.08, 0.08, STAND_H * 0.85, matChipBlack, 16);
  harness.name = 'Harness_PowerAndData';
  harness.position.set(-legX + 0.25, STAND_H / 2, -legZ + 0.25);
  elecGroup.add(harness);

  assemblies.electronics.add(elecGroup);

  // -------------------------------------------------------------------------
  // 9. Rotary Vane Vacuum Roughing Pump (Lower Stand Deck)
  // -------------------------------------------------------------------------
  const vacPumpGroup = new THREE.Group();
  vacPumpGroup.name = 'Body_VacuumPumpAssembly';
  vacPumpGroup.position.set(CHAMBER_W / 4 + 0.20, 1.28 + 0.55, 0.10);

  // Two-Stage Cast Iron Rotary Vane Pump Body
  const pumpBody = box(1.60, 0.90, 0.95, matSteelDark);
  pumpBody.name = 'Pump_Vacuum_RotaryVane';
  vacPumpGroup.add(pumpBody);

  // TEFC Electric Drive Motor Cylinder
  const pumpMotor = cyl(0.42, 0.42, 1.40, matStandPowder, 24);
  pumpMotor.rotation.z = Math.PI / 2;
  pumpMotor.position.set(-0.70, 0.05, 0);
  vacPumpGroup.add(pumpMotor);

  // Oil Sight Glass Window
  const sightGlass = cyl(0.12, 0.12, 0.04, matAcrylicClear, 16);
  sightGlass.name = 'Glass_PumpOilLevel';
  sightGlass.rotation.x = Math.PI / 2;
  sightGlass.position.set(0.40, -0.15, -0.49);
  vacPumpGroup.add(sightGlass);

  // Vertical Oil Mist Exhaust Filter
  const mistFilter = cyl(0.24, 0.24, 0.85, matSSBrushed, 20);
  mistFilter.name = 'Filter_OilMist_Exhaust';
  mistFilter.position.set(0.45, 0.80, 0);
  vacPumpGroup.add(mistFilter);

  // Reinforced Vacuum Line connecting Pump to Antechamber Valve
  const vacHose = cyl(0.09, 0.09, 3.20, matHoseOrange, 16);
  vacHose.name = 'Hose_Vacuum_Reinforced';
  vacHose.position.set(1.10, 1.60, 0.20);
  vacHose.rotation.z = -0.35;
  vacPumpGroup.add(vacHose);

  assemblies.vacuumPump.add(vacPumpGroup);

  // -------------------------------------------------------------------------
  // 10. 10" Color TFT Touchscreen PLC Console (Mounted on left upright frame)
  // -------------------------------------------------------------------------
  const consoleGroup = new THREE.Group();
  consoleGroup.name = 'Body_ConsoleAssembly';
  consoleGroup.position.set(-CHAMBER_W / 2 - 0.40, CHAMBER_BASE_Y + 4.80, -CHAMBER_D / 2 + 0.60);
  // Angled toward operator station at [0, 10.5, -15]
  consoleGroup.rotation.y = -0.38;

  // Articulated Steel Mounting Arm attached to stand upright
  const arm1 = cyl(0.10, 0.10, 1.20, matStandPowder, 16);
  arm1.name = 'Arm_ConsoleMounting';
  arm1.rotation.z = Math.PI / 3;
  arm1.position.set(0.45, -0.50, 0.20);
  consoleGroup.add(arm1);

  // Outer Bezel Housing with Carved Recessed Face at Z = -0.125
  const consoleBezel = box(2.40, 1.80, 0.25, matConsoleBezel);
  consoleBezel.name = 'Body_ConsoleBezel';
  consoleGroup.add(consoleBezel);

  // Live Dynamic Canvas LCD Quad (UI_LCD)
  // Placed at local Z = -0.128 (facing operator at -Z with positive clearance, no occluding mesh)
  const lcdPlaneGeo = new THREE.PlaneGeometry(2.15, 1.55);
  // Invert UV Y coordinates so texture.flipY = false renders perfectly upright (DIAG-005)
  const uvLcd = lcdPlaneGeo.attributes.uv;
  for (let i = 0; i < uvLcd.count; i++) {
    uvLcd.setY(i, 1.0 - uvLcd.getY(i));
  }
  uvLcd.needsUpdate = true;

  const lcdMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const lcdMesh = new THREE.Mesh(lcdPlaneGeo, lcdMat);
  lcdMesh.name = 'UI_LCD';
  lcdMesh.rotation.y = Math.PI; // Face operator at -Z
  lcdMesh.position.set(0, 0, -0.128);
  consoleGroup.add(lcdMesh);
  refs.lcdMesh = lcdMesh;

  // Tactile Illuminated Momentary Power Push Switch
  const btnPowerGroup = new THREE.Group();
  btnPowerGroup.name = 'Btn_Power';
  btnPowerGroup.position.set(0.95, -0.72, -0.135);

  const btnBezel = cyl(0.12, 0.12, 0.04, matSSPolished, 24);
  btnBezel.rotation.x = Math.PI / 2;
  btnPowerGroup.add(btnBezel);

  const btnCore = cyl(0.09, 0.09, 0.06, M(0x22c55e, { e: 0x22c55e, ei: 0.8 }), 24);
  btnCore.rotation.x = Math.PI / 2;
  btnCore.position.z = -0.01;
  btnPowerGroup.add(btnCore);

  consoleGroup.add(btnPowerGroup);
  refs.btnPower = btnPowerGroup;

  assemblies.console.add(consoleGroup);

  // -------------------------------------------------------------------------
  // 11. Laboratory Bench Power Duplex Receptacle & Continuity Cord
  // -------------------------------------------------------------------------
  const powerGroup = new THREE.Group();
  powerGroup.name = 'Body_PowerContinuity';

  // Laboratory bench duplex outlet box (NEMA 5-15R) on floor datum near rear leg
  const outletBox = box(0.85, 0.65, 0.40, matSSBrushed);
  outletBox.name = 'Power_Receptacle_Duplex';
  outletBox.position.set(-legX - 0.45, 0.40, legZ + 0.20);
  powerGroup.add(outletBox);

  // Duplex Socket Faceplate
  const socketPlate = box(0.65, 0.50, 0.02, matIndustrialLightGray);
  socketPlate.position.set(-legX - 0.45, 0.40, legZ - 0.01);
  powerGroup.add(socketPlate);

  // Molded NEMA 5-15P Grounded Mains Plug
  const plugGroup = new THREE.Group();
  plugGroup.name = 'Power_Plug_NEMA';
  plugGroup.position.set(-legX - 0.45, 0.40, legZ - 0.05);

  const plugBody = box(0.35, 0.40, 0.45, matChipBlack);
  plugGroup.add(plugBody);

  // Brass ground pin & hot/neutral blades
  const groundPin = cyl(0.04, 0.04, 0.25, matBrass, 12);
  groundPin.rotation.x = Math.PI / 2;
  groundPin.position.set(0, -0.10, 0.30);
  plugGroup.add(groundPin);

  powerGroup.add(plugGroup);
  refs.plugGroup = plugGroup;

  // Heavy 14 AWG SJTOW Industrial Line Cord running from plug to PLC cabinet
  const cord = cyl(0.07, 0.07, 2.80, matChipBlack, 16);
  cord.name = 'Power_Cord_SJTOW';
  cord.position.set(-legX - 0.30, 0.85, legZ - 0.80);
  cord.rotation.x = 0.55;
  powerGroup.add(cord);
  refs.cordMesh = cord;

  assemblies.powerContinuity.add(powerGroup);

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

    assemblies.stand.position.y = -1.50 * factor;
    assemblies.window.position.z = -2.20 * factor;
    assemblies.window.position.y = 0.80 * factor;
    assemblies.gloves.position.z = -3.40 * factor;
    assemblies.antechamber.position.x = 3.20 * factor;
    assemblies.purifier.position.z = 2.40 * factor;
    assemblies.console.position.x = -2.20 * factor;
    assemblies.console.position.y = 0.80 * factor;
    assemblies.footPedal.position.z = -1.20 * factor;
    assemblies.vacuumPump.position.y = -0.60 * factor;
    assemblies.vacuumPump.position.x = 1.00 * factor;

    // Swing open the PLC Cabinet Door to fully display internal motherboard
    if (refs.plcDoor) {
      refs.plcDoor.rotation.y = -2.10 * factor; // 120° open
    }
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
    if (refs.gaugeNeedle) {
      const angle = 2.1 - (vacuumRatio * 4.2);
      refs.gaugeNeedle.rotation.z = angle;
    }
  }

  function setCabinetFanRunning(running) {
    if (refs.cabinetFan && running) {
      refs.cabinetFan.rotation.z += 0.45;
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
    setCabinetFanRunning,
  };
}

// ---------------------------------------------------------------------------
// Standard Camera Viewpoints for Glove Box Twin
// ---------------------------------------------------------------------------
export const GLOVE_BOX_CAMERAS = {
  CAM_ISO: { pos: [18.0, 15.0, -22.0], target: [0, 7.8, 0] },
  CAM_FRONT: { pos: [0.0, 8.5, -24.0], target: [0, 7.8, 0] },
  CAM_CONSOLE: { pos: [-3.40, 12.4, -5.70], target: [-4.70, 12.4, -2.45] },
  CAM_SIDE: { pos: [22.0, 9.5, 0.0], target: [3.0, 8.5, 0] },
  CAM_TOP: { pos: [0.0, 32.0, -0.1], target: [0, 8.0, 0] },
  CAM_REAR: { pos: [0.0, 11.5, 22.0], target: [0, 8.0, 0] },
  CAM_EXPLODED: { pos: [20.0, 18.0, -25.0], target: [0, 8.0, 0] },
};

// ---------------------------------------------------------------------------
// Comprehensive Part Taxonomy Catalog for Part Explorer
// ---------------------------------------------------------------------------
export const PART_CATALOG = [
  { id: 'Body_StandFrame', label: 'Heavy 2" Tubular Steel Support Stand', cat: 'Chassis' },
  { id: 'Body_StandShelf', label: 'Equipment Deck for Vacuum Roughing Pump', cat: 'Chassis' },
  { id: 'Body_Chassis', label: '304 Welded Stainless Steel Hermetic Chamber', cat: 'Chassis' },
  { id: 'Glass_ViewPanel', label: '12.7mm Optical Acrylic Front Viewing Window', cat: 'Chassis' },
  { id: 'Body_InternalDeck', label: 'Perforated Stainless Steel Chamber Sub-Floor', cat: 'Chassis' },
  { id: 'Body_InternalShelf', label: 'Upper Chemical & Apparatus Storage Shelf', cat: 'Chassis' },
  { id: 'Body_LightBar', label: '6000K Daylight LED Luminaire Bar', cat: 'Lighting' },
  { id: 'Badge_SREdesigns', label: 'SREdesigns Official Brand Nameplate', cat: 'Badge' },
  { id: 'Body_GlovePort_Left', label: '203mm Machined Aluminum Glove Port (Left)', cat: 'Gloves' },
  { id: 'Body_GlovePort_Right', label: '203mm Machined Aluminum Glove Port (Right)', cat: 'Gloves' },
  { id: 'Body_GloveSleeve_Left', label: 'Molded Butyl Rubber Glove Sleeve (Left)', cat: 'Gloves' },
  { id: 'Body_GloveSleeve_Right', label: 'Molded Butyl Rubber Glove Sleeve (Right)', cat: 'Gloves' },
  { id: 'Body_AntechamberTube', label: '254mm Cylindrical Transfer Antechamber', cat: 'Antechamber' },
  { id: 'Pivot_DoorOuter', label: 'Counterbalanced Outer Swing Loading Door', cat: 'Antechamber' },
  { id: 'Pivot_DoorInner', label: 'Hermetic Inner Transfer Swing Door', cat: 'Antechamber' },
  { id: 'Body_AntechamberGauge', label: 'Analog Bourdon Tube Vacuum Gauge', cat: 'Sensors' },
  { id: 'Knob_AntechamberVacValve', label: 'Manual 3-Way Vacuum Roughing Valve', cat: 'Controls' },
  { id: 'Knob_AntechamberPurgeValve', label: 'Manual Inert Gas Refill Valve', cat: 'Controls' },
  { id: 'Body_PurifierColumn', label: 'Copper Catalyst & Molecular Sieve Scrubber', cat: 'Purification' },
  { id: 'Body_CircBlower', label: 'High-Efficiency Gas Recirculation Blower', cat: 'Purification' },
  { id: 'Sensor_O2_Electrochemical', label: 'Trace O2 Electrochemical Fuel Cell Sensor', cat: 'Sensors' },
  { id: 'Sensor_H2O_TraceMoisture', label: 'Capacitive Ceramic Trace Moisture Sensor', cat: 'Sensors' },
  { id: 'Pump_Vacuum_RotaryVane', label: 'Two-Stage Rotary Vane Vacuum Roughing Pump', cat: 'Vacuum' },
  { id: 'Filter_OilMist_Exhaust', label: 'Coalescing Oil Mist Exhaust Filter', cat: 'Vacuum' },
  { id: 'Body_PLCCabinet', label: 'Industrial Automation NEMA Control Enclosure', cat: 'Electronics' },
  { id: 'Module_PLC_CPU', label: 'Siemens S7-1200 Industrial PLC CPU Motherboard', cat: 'Electronics' },
  { id: 'Port_Ethernet_RJ45', label: 'Industrial Gigabit Ethernet Port with CAT6 Cable', cat: 'Electronics' },
  { id: 'Power_Supply_24VDC', label: 'DIN-Rail 24V DC Regulated Switching Power Supply', cat: 'Electronics' },
  { id: 'Module_SSR_Regen', label: 'Crydom Solid-State Relay on Extruded Heatsink', cat: 'Electronics' },
  { id: 'Fan_CabinetCooling_Blower', label: '80mm High-CFM Cabinet Cooling Fan', cat: 'Electronics' },
  { id: 'Body_ConsoleAssembly', label: 'Articulated 10" Color TFT HMI Console', cat: 'Controls' },
  { id: 'UI_LCD', label: '10" Capacitive Touchscreen HMI Panel (UI_LCD)', cat: 'Controls' },
  { id: 'Btn_Power', label: 'Illuminated Momentary Power Push Switch', cat: 'Controls' },
  { id: 'Pivot_FootPedal', label: 'Dual-Action Operator Foot Switch Pedal', cat: 'Controls' },
  { id: 'Power_Receptacle_Duplex', label: 'Laboratory Bench Duplex Outlet Box', cat: 'Power' },
  { id: 'Power_Plug_NEMA', label: 'Molded NEMA 5-15P Grounded Line Plug', cat: 'Power' },
  { id: 'Power_Cord_SJTOW', label: '14 AWG Heavy-Duty SJTOW Industrial Line Cord', cat: 'Power' },
];
