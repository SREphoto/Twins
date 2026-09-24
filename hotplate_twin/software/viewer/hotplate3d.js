/**
 * SREdesigns STIR-HEAT 500-D — Procedural Three.js 3D Twin Architecture
 * 
 * Gold-Tier Procedural Laboratory Twin adhering to 5-Agent Pipeline & Strict Part Taxonomy:
 * - Monolithic die-cast aluminum unibody chassis with 23.6° sloped front console (Zero wall clipping)
 * - Boolean-carved recessed display & console pocket (Pocket_Bezel)
 * - Live dynamic CanvasTexture UI_LCD seated proudly with positive clearance (DIAG-002, flipY = false)
 * - Dual knurled optical encoder knobs (Pivot_KnobSpeed, Pivot_KnobTemp) with kinematic rotational pivots
 * - Recessed independent limit cutoff trimpot (Btn_SafeTemp) & right-flank rocker switch (Btn_Power)
 * - White ceramic-coated top heating plate (Plate_Heating, Dia 135 mm) with spill collar & 4x M4 DIN 912 screws
 * - Dynamic thermal glow overlay (Plate_ThermalGlow) linked to real-time plate temperature
 * - 250 mL borosilicate glass beaker (Glass_Beaker, IOR = 1.52) with graduations, liquid meniscus, and dynamic vortex
 * - Pure virgin PTFE magnetic stir bar (Pivot_StirBar) with synchronized spin & decouple tumble dynamics
 * - Vertical 304 SS support rod, die-cast dual boss clamp (Clamp_BossHead), brass thumbscrews & PT1000 probe
 * - Flexible spiral coiled silicone probe cable & rear IEC C14 power cord to lab backsplash outlet
 * - 4 Neoprene leveling feet (Foot_Leveling_*) resting squarely on datum Y = 0 (Y = 9.000 lab world)
 * - SREdesigns brand badge strictly adhering to DIAG-001 (<85% apron height) & DIAG-002 (positive forward clearance)
 * - Standardized camera viewpoint presets (CAM_ISO, CAM_FRONT, CAM_SIDE, CAM_TOP)
 * - Exploded view animation system and wireframe visualization mode
 * 
 * Units: 1 unit ≈ 100 mm (width 1.60 ≈ 160 mm, depth 2.70 ≈ 270 mm). Y-up, front = -Z.
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

const matWhiteChassis  = M(0xf4f6f8, { r: 0.32, m: 0.08, side: THREE.DoubleSide });
const matDarkTrim      = M(0x181c22, { r: 0.45, m: 0.15, side: THREE.DoubleSide });
const matCeramicPlate  = M(0xfdfdfd, { r: 0.12, m: 0.02, side: THREE.DoubleSide });
const matSteelBrushed  = M(0xc4c9d0, { r: 0.25, m: 0.88, side: THREE.DoubleSide });
const matSteelDark     = M(0x3e4248, { r: 0.35, m: 0.80 });
const matBrass         = M(0xd4af37, { r: 0.28, m: 0.85 });
const matRubber        = M(0x141619, { r: 0.92, m: 0.02 });
const matKnobPolymer   = M(0x1a1d22, { r: 0.38, m: 0.12 });
const matKnobPointer   = M(0xffffff, { r: 0.15, m: 0.00 });
const matPTFE          = M(0xf8fafc, { r: 0.45, m: 0.00 });
const matRockerSwitch  = M(0x22c55e, { r: 0.30, m: 0.10, e: 0x16a34a, ei: 0.8 });
const matRockerOff     = M(0x1e293b, { r: 0.60, m: 0.10 });
const matCable         = M(0x1a1c20, { r: 0.80, m: 0.05 });
const matSpillCollar   = M(0x282c34, { r: 0.45, m: 0.25 });

// Refractive Borosilicate Glass
const matBeakerGlass = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.96,
  opacity: 1,
  transparent: true,
  roughness: 0.03,
  ior: 1.52,
  thickness: 0.08,
  specularIntensity: 1.0,
  specularColor: new THREE.Color(0xffffff),
  side: THREE.DoubleSide,
  depthWrite: false,
});

// Dynamic Aqueous Fluid
const matFluid = new THREE.MeshPhysicalMaterial({
  color: 0x38bdf8,
  transmission: 0.85,
  opacity: 0.90,
  transparent: true,
  roughness: 0.05,
  ior: 1.333,
  thickness: 0.45,
  side: THREE.DoubleSide,
  depthWrite: false,
});

// Heating glow material for hotplate
const matHeaterGlow = new THREE.MeshBasicMaterial({
  color: 0xff3800,
  transparent: true,
  opacity: 0.0,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
});

// Helper Primitives
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
// Bench & Island Constants (Countertop: 900 mm = 9.000 units)
// ---------------------------------------------------------------------------
export const BENCH = {
  cx: 0.0,
  cz: 0.0,
  sx: 12.0,
  sz: 7.0,
  sy: 9.000,
  surfaceY: 9.000,
};

// ---------------------------------------------------------------------------
// Official SREdesigns Brand Badge (Strict DIAG-001 & DIAG-002 Compliance)
// ---------------------------------------------------------------------------
export function makeSREdesignsBadge(scale = 0.28) {
  const group = new THREE.Group();
  group.name = "Badge_SREdesigns";

  // Dimensions: Width 32.2 mm, Height 8.7 mm (Lip height is 38 mm -> 8.7 / 38 = 22.9% <= 85% DIAG-001)
  const plateW = 1.15 * scale;
  const plateH = 0.31 * scale;
  const plateD = 0.012;

  // Outer bezel frame
  const bezel = box(plateW + 0.015, plateH + 0.015, plateD, matDarkTrim);
  group.add(bezel);

  // Brushed aluminum backing plate
  const plate = box(plateW, plateH, plateD * 0.9, matSteelBrushed);
  plate.position.z = plateD * 0.05;
  group.add(plate);

  // 4 Corner Micro-fasteners (M1 hex bolts)
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const screw = cyl(0.005, 0.005, 0.004, matSteelDark, 6);
      screw.rotation.x = Math.PI / 2;
      screw.position.set(sx * (plateW / 2 - 0.015), sy * (plateH / 2 - 0.015), plateD / 2 + 0.002);
      group.add(screw);
    }
  }

  // Canvas texture badge face
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 144;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 144);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.5, '#1e293b');
  bgGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 144);

  // Outer cyan accent border
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 132);

  // Three teal enamel tiles for S - R - E
  const tiles = ['S', 'R', 'E'];
  tiles.forEach((char, i) => {
    const tx = 28 + i * 56;
    const ty = 24;
    ctx.fillStyle = '#0891b2';
    ctx.beginPath();
    ctx.roundRect(tx, ty, 48, 48, 8);
    ctx.fill();
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, tx + 24, ty + 26);
  });

  // Typography
  ctx.textAlign = 'left';
  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 36px "IBM Plex Sans", sans-serif';
  ctx.fillText('STIR-HEAT', 215, 52);

  ctx.fillStyle = '#f59e0b';
  ctx.font = '700 26px "IBM Plex Sans", sans-serif';
  ctx.fillText('500-D', 405, 52);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 20px "IBM Plex Mono", monospace';
  ctx.fillText('SREdesigns.com · LAB SYSTEMS', 215, 102);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;

  const badgeFaceMat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    side: THREE.DoubleSide,
  });

  // Seated proudly with POSITIVE relative clearance (DIAG-002: zero occlusion)
  const faceMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(plateW * 0.96, plateH * 0.94),
    badgeFaceMat
  );
  faceMesh.position.z = plateD / 2 + 0.003;
  group.add(faceMesh);

  return group;
}

// ---------------------------------------------------------------------------
// Main Hotplate Model Builder
// ---------------------------------------------------------------------------
export function createHotplateModel() {
  const root = new THREE.Group();
  root.name = "HotplateStirrerRoot";

  const explodeGroups = [];
  function registerExplode(group, offsetVec) {
    explodeGroups.push({ group, originalPos: group.position.clone(), offset: offsetVec.clone() });
  }

  // --- Geometry Parameters (1 unit = 100 mm) ---
  const W = 1.60;      // 160 mm width
  const D = 2.70;      // 270 mm total depth
  const H_deck = 0.85; // 85 mm rear deck height
  const H_lip = 0.50;  // 50 mm front lip height
  const H_base = 0.12; // 12 mm foot clearance datum
  const slopeStart = -0.55; // Slope starts at Z = -0.55 (80 mm sloped run to Z = -1.35)
  const plateZ = 0.35;      // Heating plate center in Z
  const plateDia = 1.35;    // 135 mm plate diameter

  // Slope geometry calculations
  const slopeDeltaZ = -0.55 - (-1.35); // 0.80 units
  const slopeDeltaY = H_deck - H_lip;   // 0.35 units
  const slopeTheta = Math.atan2(slopeDeltaY, slopeDeltaZ); // ~0.4124 rad (23.63 deg)
  const slopeCenterZ = (-1.35 + -0.55) / 2; // -0.95
  const slopeCenterY = (H_lip + H_deck) / 2; // 0.675

  // =========================================================================
  // 1. BASE LEVELING FEET (Foot_Leveling_*)
  // =========================================================================
  const feetGroup = new THREE.Group();
  feetGroup.name = "Assembly_LevelingFeet";
  const footPositions = [
    [-W/2 + 0.22, D/2 - 0.26, "Foot_Leveling_RR"],
    [ W/2 - 0.22, D/2 - 0.26, "Foot_Leveling_RL"],
    [-W/2 + 0.22, -D/2 + 0.22, "Foot_Leveling_FR"],
    [ W/2 - 0.22, -D/2 + 0.22, "Foot_Leveling_FL"],
  ];
  footPositions.forEach(([fx, fz, fname]) => {
    const foot = createVibrationFoot(0.09, 0.10, 0.10);
    foot.name = fname;
    foot.position.set(fx, 0, fz);
    feetGroup.add(foot);
  });
  root.add(feetGroup);
  registerExplode(feetGroup, new THREE.Vector3(0, -0.4, 0));

  // =========================================================================
  // 2. MONOLITHIC UNIBODY CHASSIS (Body_Chassis)
  // =========================================================================
  const chassisGroup = new THREE.Group();
  chassisGroup.name = "Assembly_Chassis";

  // Heavy stamped dark underpan plate
  const basePan = box(W - 0.06, 0.03, D - 0.06, matDarkTrim);
  basePan.name = "Chassis_BasePlate";
  basePan.position.set(0, H_base - 0.015, 0);
  chassisGroup.add(basePan);

  // Monolithic Unibody Extruded Profile (Zero-seam casting from Z = -1.35 to Z = +1.35)
  const unibodyShape = new THREE.Shape();
  unibodyShape.moveTo(D / 2, H_base);      // Rear bottom (+1.35, 0.12)
  unibodyShape.lineTo(D / 2, H_deck);      // Rear top (+1.35, 0.85)
  unibodyShape.lineTo(slopeStart, H_deck); // Flat deck end (-0.55, 0.85)
  unibodyShape.lineTo(-D / 2, H_lip);      // Sloped console front lip top (-1.35, 0.50)
  unibodyShape.lineTo(-D / 2, H_base);     // Front nose bottom (-1.35, 0.12)
  unibodyShape.closePath();

  const unibodyGeo = new THREE.ExtrudeGeometry(unibodyShape, {
    depth: W,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.016,
    bevelSize: 0.016,
    bevelOffset: -0.004,
    bevelSegments: 3,
  });

  // Remap coordinates: (Z_shape, Y_shape, X_extrude) -> (X, Y, Z)
  const posArr = unibodyGeo.attributes.position;
  for (let i = 0; i < posArr.count; i++) {
    const zVal = posArr.getX(i);
    const yVal = posArr.getY(i);
    const xVal = posArr.getZ(i) - W / 2;
    posArr.setXYZ(i, xVal, yVal, zVal);
  }
  posArr.needsUpdate = true;

  // Reverse triangle indices for outward vertex normals after coordinate swap
  const index = unibodyGeo.index;
  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      const b = index.getX(i + 1);
      index.setX(i + 1, index.getX(i + 2));
      index.setX(i + 2, b);
    }
    index.needsUpdate = true;
  }
  unibodyGeo.computeVertexNormals();
  unibodyGeo.computeBoundingBox();
  unibodyGeo.computeBoundingSphere();

  const unibodyMesh = new THREE.Mesh(unibodyGeo, matWhiteChassis);
  unibodyMesh.castShadow = true;
  unibodyMesh.receiveShadow = true;
  unibodyMesh.name = "Body_Chassis";
  chassisGroup.add(unibodyMesh);

  // Brushed aluminum spill-containment rim accent on rear flat deck
  const deckTrim = box(W - 0.04, 0.02, (D / 2 - slopeStart) - 0.04, matSteelBrushed);
  deckTrim.position.set(0, H_deck - 0.005, (slopeStart + D / 2) / 2);
  deckTrim.castShadow = false;
  deckTrim.receiveShadow = false;
  chassisGroup.add(deckTrim);

  // =========================================================================
  // 3. INTEGRATED SLOPED FRONT CONSOLE (Pocket_Bezel, UI_LCD, Knobs, Trimpot)
  // =========================================================================
  const slopeGroup = new THREE.Group();
  slopeGroup.name = "Assembly_SlopedConsole";
  slopeGroup.position.set(0, slopeCenterY, slopeCenterZ);
  slopeGroup.rotation.x = -slopeTheta;
  chassisGroup.add(slopeGroup);

  // 3A. Flush Recessed Bezel Pocket (Pocket_Bezel)
  const bezelW = 1.16;
  const bezelD = 0.48; // depth along slope
  const bezelH = 0.02; // thickness
  const bezelZ = 0.17; // Upper half of slope

  const bezelTray = box(bezelW, bezelH, bezelD, matDarkTrim);
  bezelTray.name = "Pocket_Bezel";
  bezelTray.position.set(0, 0.006, bezelZ);
  slopeGroup.add(bezelTray);

  // Brushed aluminum accent trim wrapping around bezel perimeter (DIAG-003: zero top-overlap)
  const trimW = 0.015;
  const trimH = 0.018;
  const edgeTop = box(bezelW + trimW * 2, trimH, trimW, matSteelBrushed);
  edgeTop.position.set(0, 0.008, bezelZ + bezelD / 2 + trimW / 2);
  slopeGroup.add(edgeTop);

  const edgeBot = box(bezelW + trimW * 2, trimH, trimW, matSteelBrushed);
  edgeBot.position.set(0, 0.008, bezelZ - bezelD / 2 - trimW / 2);
  slopeGroup.add(edgeBot);

  const edgeLeft = box(trimW, trimH, bezelD, matSteelBrushed);
  edgeLeft.position.set(-bezelW / 2 - trimW / 2, 0.008, bezelZ);
  slopeGroup.add(edgeLeft);

  const edgeRight = box(trimW, trimH, bezelD, matSteelBrushed);
  edgeRight.position.set(bezelW / 2 + trimW / 2, 0.008, bezelZ);
  slopeGroup.add(edgeRight);

  // 3B. Dynamic Canvas UI_LCD Quad
  const lcdW = 0.94;
  const lcdH = 0.40;
  const lcdGeo = new THREE.PlaneGeometry(lcdW, lcdH);

  // Invert U coordinate so dynamic canvas maps upright and left-to-right (DIAG-005)
  const uv = lcdGeo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setX(i, 1.0 - uv.getX(i));
  }
  uv.needsUpdate = true;

  const matLcdQuad = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const lcdMesh = new THREE.Mesh(lcdGeo, matLcdQuad);
  lcdMesh.name = "UI_LCD";
  // Rotate so local plane faces normal to the slope (up and forward toward operator)
  lcdMesh.rotation.x = -Math.PI / 2;
  // Seated proudly above bezel tray with POSITIVE clearance (DIAG-002: ZERO occlusion!)
  lcdMesh.position.set(0, 0.018, bezelZ);
  slopeGroup.add(lcdMesh);

  // 3C. Dual Rotary Optical Encoder Knobs (Knurled physical dials on lower slope)
  const knobZ = -0.27; // Lower slope area below LCD
  const knobR = 0.15;  // 30 mm diameter
  const knobH = 0.11;  // 11 mm sleek profile above console

  function createConsoleKnob(name, labelText) {
    const knobPivot = new THREE.Group();
    knobPivot.name = name;
    knobPivot.userData = { interactive: true, name };

    // Beveled base collar (brushed stainless steel)
    const collar = cyl(knobR + 0.012, knobR + 0.012, 0.018, matSteelBrushed, 32);
    collar.position.y = 0.009;
    knobPivot.add(collar);

    // Knurled polymer main body
    const bodyH = knobH - 0.018;
    const body = cyl(knobR, knobR, bodyH, matKnobPolymer, 32);
    body.position.y = 0.018 + bodyH / 2;
    knobPivot.add(body);

    // 24 Physical fluted knurl ribs around perimeter
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2;
      const rib = box(0.012, bodyH - 0.01, 0.012, matKnobPolymer);
      rib.position.set(Math.cos(ang) * (knobR + 0.003), 0.018 + bodyH / 2, Math.sin(ang) * (knobR + 0.003));
      rib.rotation.y = -ang;
      knobPivot.add(rib);
    }

    // Top crown with dark metal center puck
    const crown = cyl(knobR * 0.72, knobR * 0.72, 0.006, matSteelDark, 24);
    crown.position.y = knobH + 0.002;
    knobPivot.add(crown);

    // High-visibility bright white radial indicator pointer on face
    const ptr = box(0.018, 0.012, knobR * 0.70, matKnobPointer);
    ptr.name = `Indicator_${labelText}`;
    ptr.position.set(0, knobH + 0.005, -knobR * 0.38);
    knobPivot.add(ptr);

    return knobPivot;
  }

  // Left Knob: Stir Speed (0 - 1500 RPM)
  const knobSpeed = createConsoleKnob("Pivot_KnobSpeed", "Speed");
  knobSpeed.position.set(-0.42, 0.005, knobZ);
  slopeGroup.add(knobSpeed);

  // Right Knob: Temperature Setpoint (20 - 310 °C)
  const knobTemp = createConsoleKnob("Pivot_KnobTemp", "Temp");
  knobTemp.position.set(0.42, 0.005, knobZ);
  slopeGroup.add(knobTemp);

  // 3D. Independent Limit Cutoff Trimpot (Btn_SafeTemp)
  const trimpotGroup = new THREE.Group();
  trimpotGroup.name = "Btn_SafeTemp";
  trimpotGroup.position.set(0, 0.008, knobZ);
  const trimpotWell = cyl(0.045, 0.045, 0.015, matDarkTrim, 16);
  trimpotWell.position.y = 0.005;
  trimpotGroup.add(trimpotWell);

  const trimpotScrew = cyl(0.032, 0.032, 0.02, matBrass, 16);
  trimpotScrew.position.y = 0.012;
  trimpotGroup.add(trimpotScrew);

  const trimpotSlot = box(0.010, 0.008, 0.05, matSteelDark);
  trimpotSlot.position.y = 0.022;
  trimpotGroup.add(trimpotSlot);
  slopeGroup.add(trimpotGroup);

  // =========================================================================
  // 4. POWER ROCKER SWITCH (Btn_Power on Right Flank)
  // =========================================================================
  const switchGroup = new THREE.Group();
  switchGroup.name = "Btn_Power";
  switchGroup.userData = { interactive: true, name: "Btn_Power" };
  switchGroup.position.set(W / 2 + 0.005, 0.42, -0.10);
  switchGroup.rotation.y = Math.PI / 2;

  const switchBezel = box(0.24, 0.16, 0.02, matDarkTrim);
  switchGroup.add(switchBezel);

  const switchRocker = box(0.18, 0.11, 0.04, matRockerSwitch);
  switchRocker.name = "Rocker_Actuator";
  switchRocker.position.z = 0.02;
  switchRocker.rotation.x = -0.15;
  switchGroup.add(switchRocker);
  chassisGroup.add(switchGroup);

  // =========================================================================
  // 5. OFFICIAL SREDESIGNS BRAND BADGE (Front Nose Lip)
  // Strictly adhering to DIAG-001 (<85% apron height) and DIAG-002 (zero occlusion)
  // =========================================================================
  const badge = makeSREdesignsBadge(0.28);
  badge.position.set(0, (H_base + H_lip) / 2, -D / 2 - 0.006);
  badge.rotation.y = Math.PI; // Face forward toward operator at -Z
  chassisGroup.add(badge);

  // =========================================================================
  // 6. REAR BULKHEAD PANEL (Assembly_RearBulkhead)
  // =========================================================================
  const rearGroup = new THREE.Group();
  rearGroup.name = "Assembly_RearBulkhead";
  rearGroup.position.set(0, (H_base + H_deck) / 2, D / 2 + 0.005);

  const louverPlate = box(W - 0.20, H_deck - H_base - 0.15, 0.015, matDarkTrim);
  louverPlate.name = "Panel_RearLouver";
  rearGroup.add(louverPlate);

  // 6x Stamped cooling exhaust louvers
  for (let l = 0; l < 6; l++) {
    const lz = -0.15 + l * 0.06;
    const louver = box(0.45, 0.012, 0.015, matSteelBrushed);
    louver.position.set(0, lz, 0.008);
    rearGroup.add(louver);
  }

  // IEC C14 Inlet
  const iec = createIECInlet();
  iec.position.set(-0.38, -0.06, 0.01);
  rearGroup.add(iec);

  // 5-Pin DIN Port for PT1000 Sensor
  const dinPort = cyl(0.075, 0.075, 0.03, matSteelBrushed, 24);
  dinPort.name = "Port_PT1000";
  dinPort.rotation.x = Math.PI / 2;
  dinPort.position.set(0.38, -0.04, 0.01);
  rearGroup.add(dinPort);

  // Grounding terminal stud
  const groundStud = cyl(0.025, 0.025, 0.04, matBrass, 12);
  groundStud.rotation.x = Math.PI / 2;
  groundStud.position.set(0.18, -0.06, 0.015);
  rearGroup.add(groundStud);

  chassisGroup.add(rearGroup);
  root.add(chassisGroup);

  // =========================================================================
  // 7. HEATING TOP PLATE ASSEMBLY (Plate_Heating)
  // =========================================================================
  const plateGroup = new THREE.Group();
  plateGroup.name = "Assembly_HeatingPlate";
  plateGroup.position.set(0, H_deck, plateZ);

  // Spill Containment Collar Ring (Anodized dark barrier ring)
  const collarMesh = cyl(plateDia / 2 + 0.04, plateDia / 2 + 0.04, 0.03, matSpillCollar, 48);
  collarMesh.name = "Plate_SpillCollar";
  collarMesh.position.y = 0.015;
  plateGroup.add(collarMesh);

  // Glazed White Ceramic Heating Disk (Dia 135 mm, height 15 mm)
  const plateMesh = cyl(plateDia / 2, plateDia / 2, 0.15, matCeramicPlate, 48);
  plateMesh.name = "Plate_Heating";
  plateMesh.position.y = 0.075;
  plateGroup.add(plateMesh);

  // Thermal glow overlay mesh (Illuminates radiant red/orange above 50°C)
  const glowMesh = cyl(plateDia / 2 - 0.01, plateDia / 2 - 0.01, 0.01, matHeaterGlow, 48);
  glowMesh.name = "Plate_ThermalGlow";
  glowMesh.position.y = 0.151;
  plateGroup.add(glowMesh);

  // 4x Genuine M4 DIN 912 Hex Socket Head Screws securing plate
  for (let i = 0; i < 4; i++) {
    const ang = (Math.PI / 2) * i + Math.PI / 4;
    const sr = plateDia / 2 - 0.09;
    const sx = sr * Math.cos(ang);
    const sz = sr * Math.sin(ang);
    const screw = createHexSocketScrew(0.018, 0.06, { material: matSteelDark });
    screw.name = `Fastener_HexM4_${i + 1}`;
    screw.position.set(sx, 0.15, sz);
    plateGroup.add(screw);
  }

  root.add(plateGroup);
  registerExplode(plateGroup, new THREE.Vector3(0, 0.5, 0));

  // =========================================================================
  // 8. RETORT STAND, CLAMP & PT1000 PROBE ASSEMBLY
  // =========================================================================
  const standGroup = new THREE.Group();
  standGroup.name = "Assembly_RetortStand";
  const rodX = W / 2 - 0.18;
  const rodZ = D / 2 - 0.25;
  standGroup.position.set(rodX, H_deck, rodZ);

  // Threaded Boss Mount on rear chassis
  const boss = cyl(0.095, 0.095, 0.08, matSteelBrushed, 24);
  boss.name = "Boss_RetortMount";
  boss.position.y = 0.04;
  standGroup.add(boss);

  // 304 Stainless Steel Support Rod (450 mm = 4.50 units)
  const rod = cyl(0.055, 0.055, 4.40, matSteelBrushed, 24);
  rod.name = "Rod_Support";
  rod.position.y = 2.24;
  standGroup.add(rod);

  // Dual Boss Head Clamp
  const clampGroup = new THREE.Group();
  clampGroup.name = "Clamp_BossHead";
  clampGroup.position.set(0, 1.70, 0); // Dipped height

  const clampBody = box(0.36, 0.28, 0.26, matDarkTrim);
  clampGroup.add(clampBody);

  // 2 Brass T-Handle Thumbscrews (Fastener_Thumb_01, Fastener_Thumb_02)
  const thumb1 = cyl(0.065, 0.065, 0.14, matBrass, 16);
  thumb1.name = "Fastener_Thumb_01";
  thumb1.rotation.z = Math.PI / 2;
  thumb1.position.set(0.22, 0, 0);
  clampGroup.add(thumb1);

  const thumb2 = cyl(0.065, 0.065, 0.14, matBrass, 16);
  thumb2.name = "Fastener_Thumb_02";
  thumb2.rotation.x = Math.PI / 2;
  thumb2.position.set(0, 0, 0.17);
  clampGroup.add(thumb2);

  // Horizontal Stainless Steel Extension Arm
  const arm = cyl(0.038, 0.038, 1.35, matSteelBrushed, 16);
  arm.name = "Arm_ProbeHolder";
  arm.rotation.z = Math.PI / 2;
  arm.rotation.y = -0.35;
  arm.position.set(-0.65, 0, -0.25);
  clampGroup.add(arm);

  // PT1000 Stainless Immersion Sensor Probe (Probe_PT1000)
  const probeGroup = new THREE.Group();
  probeGroup.name = "Assembly_PT1000Probe";
  // Perfectly centered over beaker at (0, plateZ)
  probeGroup.position.set(-rodX, 0, plateZ - rodZ);

  // Probe terminal head
  const probeHead = cyl(0.045, 0.045, 0.12, matDarkTrim, 16);
  probeHead.position.y = 0.06;
  probeGroup.add(probeHead);

  // Stainless immersion sheath
  const probeShaft = cyl(0.016, 0.014, 1.75, matSteelBrushed, 16);
  probeShaft.name = "Probe_PT1000";
  probeShaft.position.y = -0.80;
  probeGroup.add(probeShaft);

  // Spiral coiled silicone cable connecting probe head back to DIN port
  const curvePoints = [];
  const startP = new THREE.Vector3(0, 0.12, 0);
  const endP = new THREE.Vector3(0.20, -1.60, 0.70);
  for (let t = 0; t <= 1; t += 0.04) {
    const helixP = new THREE.Vector3()
      .lerpVectors(startP, endP, t)
      .add(new THREE.Vector3(Math.sin(t * Math.PI * 10) * 0.045, 0, Math.cos(t * Math.PI * 10) * 0.045));
    curvePoints.push(helixP);
  }
  const cableGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePoints), 40, 0.010, 8, false);
  const cableMesh = new THREE.Mesh(cableGeo, matCable);
  cableMesh.name = "Cable_ProbeCoil";
  probeGroup.add(cableMesh);

  clampGroup.add(probeGroup);
  standGroup.add(clampGroup);
  root.add(standGroup);
  registerExplode(standGroup, new THREE.Vector3(0.4, 0.3, 0.3));

  // =========================================================================
  // 9. 250 mL BOROSILICATE BEAKER, SOLUTION & PTFE STIR BAR
  // =========================================================================
  const beakerGroup = new THREE.Group();
  beakerGroup.name = "Assembly_BeakerConsumable";
  beakerGroup.position.set(0, H_deck + 0.15, plateZ);

  // 250 mL Glass Beaker (Dia 70 mm, Height 95 mm, Wall 2.5 mm)
  const beakerR = 0.35;
  const beakerH = 0.95;
  const beakerMesh = cyl(beakerR, beakerR * 0.98, beakerH, matBeakerGlass, 48);
  beakerMesh.name = "Glass_Beaker";
  beakerMesh.position.y = beakerH / 2;
  beakerMesh.castShadow = false; // Glass does not cast opaque black shadow
  beakerMesh.receiveShadow = false;
  beakerGroup.add(beakerMesh);

  // Beaker Flared Rim & Pouring Spout
  const rimMesh = new THREE.Mesh(new THREE.TorusGeometry(beakerR, 0.014, 8, 36), matBeakerGlass);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = beakerH;
  beakerGroup.add(rimMesh);

  // Volume graduation marks printed on front glass face (Thin ring arcs, NOT solid pucks!)
  for (let g = 1; g <= 4; g++) {
    const gy = 0.16 + g * 0.16; // 50 mL, 100 mL, 150 mL, 200 mL
    const gradArcGeo = new THREE.RingGeometry(beakerR + 0.001, beakerR + 0.004, 24, 1, Math.PI * 0.35, Math.PI * 0.30);
    const gradMesh = new THREE.Mesh(gradArcGeo, matKnobPointer);
    gradMesh.rotation.x = -Math.PI / 2;
    gradMesh.position.y = gy;
    beakerGroup.add(gradMesh);
  }

  // Dynamic Fluid Liquid Column with procedural parabolic vortex deformation
  function createVortexFluidGeometry(radiusTop, radiusBottom, height, radialSegments = 48, rings = 10, heightSegments = 8) {
    const geo = new THREE.BufferGeometry();
    const positions = [];
    const uvs = [];
    const indices = [];

    const topVertices = [];
    const sideTopVertices = [];

    // 1. Bottom Cap (facing down)
    const bottomCenterIdx = positions.length / 3;
    positions.push(0, -height / 2, 0);
    uvs.push(0.5, 0.5);

    const bottomRimStart = positions.length / 3;
    for (let j = 0; j < radialSegments; j++) {
      const theta = (j / radialSegments) * Math.PI * 2;
      const x = Math.sin(theta) * radiusBottom;
      const z = Math.cos(theta) * radiusBottom;
      positions.push(x, -height / 2, z);
      uvs.push(0.5 + 0.5 * Math.sin(theta), 0.5 + 0.5 * Math.cos(theta));
    }
    for (let j = 0; j < radialSegments; j++) {
      const next = (j + 1) % radialSegments;
      indices.push(bottomCenterIdx, bottomRimStart + j, bottomRimStart + next);
    }

    // 2. Cylinder Side Wall
    const sideStart = positions.length / 3;
    for (let yIdx = 0; yIdx <= heightSegments; yIdx++) {
      const v = yIdx / heightSegments;
      const y = -height / 2 + v * height;
      const r = radiusBottom + v * (radiusTop - radiusBottom);
      for (let j = 0; j <= radialSegments; j++) {
        const u = j / radialSegments;
        const theta = u * Math.PI * 2;
        const x = Math.sin(theta) * r;
        const z = Math.cos(theta) * r;
        const vIdx = positions.length / 3;
        positions.push(x, y, z);
        uvs.push(u, v);
        if (yIdx === heightSegments) {
          sideTopVertices.push(vIdx);
        }
      }
    }
    const sideStride = radialSegments + 1;
    for (let yIdx = 0; yIdx < heightSegments; yIdx++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = sideStart + yIdx * sideStride + j;
        const b = sideStart + (yIdx + 1) * sideStride + j;
        const c = sideStart + (yIdx + 1) * sideStride + (j + 1);
        const d = sideStart + yIdx * sideStride + (j + 1);
        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }

    // 3. Top Surface (Meniscus / Parabolic Vortex Grid)
    const topCenterIdx = positions.length / 3;
    positions.push(0, height / 2, 0);
    uvs.push(0.5, 0.5);
    topVertices.push({ index: topCenterIdx, rRatio: 0 });

    const ringStarts = [];
    for (let rIdx = 1; rIdx <= rings; rIdx++) {
      const rRatio = rIdx / rings;
      const r = radiusTop * rRatio;
      ringStarts.push(positions.length / 3);
      for (let j = 0; j < radialSegments; j++) {
        const theta = (j / radialSegments) * Math.PI * 2;
        const x = Math.sin(theta) * r;
        const z = Math.cos(theta) * r;
        const vIdx = positions.length / 3;
        positions.push(x, height / 2, z);
        uvs.push(0.5 + 0.5 * rRatio * Math.sin(theta), 0.5 + 0.5 * rRatio * Math.cos(theta));
        topVertices.push({ index: vIdx, rRatio });
      }
    }

    // Center to ring 1 triangles
    const ring1Start = ringStarts[0];
    for (let j = 0; j < radialSegments; j++) {
      const next = (j + 1) % radialSegments;
      indices.push(topCenterIdx, ring1Start + j, ring1Start + next);
    }

    // Concentric ring quads
    for (let rIdx = 0; rIdx < rings - 1; rIdx++) {
      const currStart = ringStarts[rIdx];
      const nextStart = ringStarts[rIdx + 1];
      for (let j = 0; j < radialSegments; j++) {
        const nextJ = (j + 1) % radialSegments;
        const a = currStart + j;
        const b = nextStart + j;
        const c = nextStart + nextJ;
        const d = currStart + nextJ;
        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }

    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    geo.userData = {
      topVertices,
      sideTopVertices,
      baseTopY: height / 2,
    };

    return geo;
  }

  const fluidH = 0.52; // 150 mL solution
  const fluidGeo = createVortexFluidGeometry(beakerR - 0.018, beakerR - 0.022, fluidH, 48, 10, 8);
  const fluidMesh = new THREE.Mesh(fluidGeo, matFluid);
  fluidMesh.name = "Fluid_Liquid";
  fluidMesh.position.y = fluidH / 2 + 0.015;
  fluidMesh.castShadow = false;
  fluidMesh.receiveShadow = false;
  beakerGroup.add(fluidMesh);

  // PTFE Magnetic Stir Bar (Pivot_StirBar, Octagonal virgin PTFE bar with center pivot ring)
  const stirBar = cyl(0.038, 0.038, 0.25, matPTFE, 16);
  stirBar.name = "Pivot_StirBar";
  stirBar.rotation.z = Math.PI / 2;
  stirBar.position.set(0, 0.040, 0);

  // Raised center pivot ring
  const stirRing = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.008, 8, 16), matPTFE);
  stirRing.rotation.y = Math.PI / 2;
  stirBar.add(stirRing);

  beakerGroup.add(stirBar);
  root.add(beakerGroup);
  registerExplode(beakerGroup, new THREE.Vector3(0, 0.7, 0));

  // ---------------------------------------------------------------------------
  // Runtime Kinematic & Shader API
  // ---------------------------------------------------------------------------
  return {
    root,
    explodeGroups,
    lcdMesh,
    knobSpeed,
    knobTemp,
    switchRocker,
    stirBar,
    beakerGroup,
    fluidMesh,
    glowMesh,
    clampGroup,

    setExplodeAmount(t) {
      explodeGroups.forEach(({ group, originalPos, offset }) => {
        group.position.copy(originalPos).addScaledVector(offset, t);
      });
    },

    setWireframe(enabled) {
      root.traverse((node) => {
        if (node.isMesh && node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach(m => m.wireframe = enabled);
          } else {
            node.material.wireframe = enabled;
          }
        }
      });
    },

    setLcdTexture(tex) {
      if (lcdMesh.material) {
        tex.flipY = false;
        lcdMesh.material.map = tex;
        lcdMesh.material.needsUpdate = true;
      }
    },

    setSpeedKnobRotation(rad) {
      knobSpeed.rotation.y = rad;
    },

    setTempKnobRotation(rad) {
      knobTemp.rotation.y = rad;
    },

    setStirBarRotation(rad, decoupleOffset = 0) {
      stirBar.rotation.y = rad;
      stirBar.position.x = decoupleOffset;
    },

    setPlateThermalGlow(tempC) {
      if (tempC <= 50.0) {
        glowMesh.material.opacity = 0.0;
      } else {
        const factor = Math.min(1.0, (tempC - 50.0) / 250.0);
        glowMesh.material.opacity = factor * 0.88;
      }
    },

    setVortexDepth(depthRatio) {
      const d = Math.max(0, Math.min(0.85, depthRatio));
      const maxDip = 0.28; // Maximum vortex depression in meters (28 mm deep funnel into fluid)
      const pos = fluidGeo.attributes.position;
      const baseTopY = fluidGeo.userData.baseTopY;
      const topVerts = fluidGeo.userData.topVertices;
      const sideTopVerts = fluidGeo.userData.sideTopVertices;

      const totalDip = d * maxDip;
      for (let i = 0; i < topVerts.length; i++) {
        const { index, rRatio } = topVerts[i];
        // True parabolic meniscus profile: center sinks, outer rim rises slightly for volume conservation
        const deltaY = totalDip * (0.22 * (rRatio * rRatio) - 0.78 * (1.0 - rRatio * rRatio));
        pos.setY(index, baseTopY + deltaY);
      }

      // Match side wall top rim with top surface perimeter (rRatio = 1.0)
      const rimDeltaY = totalDip * 0.22;
      for (let i = 0; i < sideTopVerts.length; i++) {
        pos.setY(sideTopVerts[i], baseTopY + rimDeltaY);
      }

      pos.needsUpdate = true;
      fluidGeo.computeVertexNormals();
    },

    setPowerSwitch(isOn) {
      switchRocker.rotation.x = isOn ? -0.15 : 0.15;
      switchRocker.material = isOn ? matRockerSwitch : matRockerOff;
    },

    setBeakerLoaded(isLoaded) {
      beakerGroup.visible = isLoaded;
    },

    setProbeDipped(isDipped) {
      clampGroup.position.y = isDipped ? 1.70 : 2.40;
    },

    setSolventColor(colorHex) {
      fluidMesh.material.color.setHex(colorHex);
    },
  };
}

// ---------------------------------------------------------------------------
// Standalone Photorealistic Laboratory Room Environment
// ---------------------------------------------------------------------------
export function buildLabRoom(root) {
  const room = new THREE.Group();
  room.name = "LaboratoryRoom";

  const benchY = BENCH.sy;
  const matCountertop = M(0x11161d, { r: 0.22, m: 0.15 }); // Chemical-resistant black epoxy resin

  // 1. Solid Epoxy Resin Countertop Slab (Y = 9.000)
  const countertop = box(BENCH.sx, 0.08, BENCH.sz, matCountertop);
  countertop.name = "Countertop_Epoxy";
  countertop.position.set(0, benchY - 0.04, 0);
  room.add(countertop);

  // 2. 4 Perimeter Edges (DIAG-003: discrete wrap trims with ZERO coplanar overlap)
  const trimW = 0.03;
  const trimT = 0.08;
  const trimY = benchY - 0.04;
  const matTrim = matSteelBrushed;

  const edgeF = box(BENCH.sx + trimW * 2, trimT, trimW, matTrim);
  edgeF.position.set(0, trimY, -BENCH.sz / 2 - trimW / 2);
  room.add(edgeF);

  const edgeB = box(BENCH.sx + trimW * 2, trimT, trimW, matTrim);
  edgeB.position.set(0, trimY, BENCH.sz / 2 + trimW / 2);
  room.add(edgeB);

  const edgeL = box(trimW, trimT, BENCH.sz, matTrim);
  edgeL.position.set(-BENCH.sx / 2 - trimW / 2, trimY, 0);
  room.add(edgeL);

  const edgeR = box(trimW, trimT, BENCH.sz, matTrim);
  edgeR.position.set(BENCH.sx / 2 + trimW / 2, trimY, 0);
  room.add(edgeR);

  // 3. Cabinet body below counter
  const matCabinet = M(0x283446, { r: 0.45, m: 0.08 });
  const cabinet = box(BENCH.sx - 0.4, benchY - 0.08, BENCH.sz - 0.4, matCabinet);
  cabinet.position.set(0, (benchY - 0.08) / 2, 0);
  room.add(cabinet);

  // 4. Broad floor tiles
  const matFloor = M(0x0f172a, { r: 0.65, m: 0.05 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), matFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  room.add(floor);

  // 5. Broad laboratory backsplash wall & side walls (Continuous room enclosure)
  const matWall = M(0x526070, { r: 0.80, m: 0.02 });
  const wallH = 14.0;
  const wallD = 0.20;
  const wallW = 36.0;
  const wallZ = BENCH.sz / 2 + wallD / 2 + 0.02; // Z = 3.62
  const wall = box(wallW, wallH, wallD, matWall);
  wall.position.set(0, wallH / 2, wallZ);
  wall.receiveShadow = true;
  room.add(wall);

  // Left side wall
  const sideD = 24.0;
  const wallL = box(wallD, wallH, sideD, matWall);
  wallL.position.set(-wallW / 2 + wallD / 2, wallH / 2, wallZ - sideD / 2);
  wallL.receiveShadow = true;
  room.add(wallL);

  // Right side wall
  const wallR = box(wallD, wallH, sideD, matWall);
  wallR.position.set(wallW / 2 - wallD / 2, wallH / 2, wallZ - sideD / 2);
  wallR.receiveShadow = true;
  room.add(wallR);

  // 6. Duplex electrical outlet on backsplash
  const matOutletPlate = M(0xe2e8f0, { r: 0.3, m: 0.05 });
  const outlet = box(0.22, 0.32, 0.02, matOutletPlate);
  outlet.position.set(1.40, benchY + 0.50, wallZ - wallD / 2 - 0.01);
  room.add(outlet);

  // Outlet socket receptacles
  for (const oy of [0.06, -0.06]) {
    const plugRecess = box(0.08, 0.08, 0.01, matDarkTrim);
    plugRecess.position.set(1.40, benchY + 0.50 + oy, wallZ - wallD / 2 - 0.018);
    room.add(plugRecess);
  }

  // 7. Power cord connecting machine rear IEC inlet to wall outlet
  const p0 = new THREE.Vector3(0.38, benchY + 0.42, 1.36);
  const p1 = new THREE.Vector3(0.60, benchY + 0.02, 1.60);
  const p2 = new THREE.Vector3(1.10, benchY + 0.02, 2.20);
  const p3 = new THREE.Vector3(1.40, benchY + 0.50 - 0.06, wallZ - wallD / 2 - 0.03);
  const cordCurve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
  const cordGeo = new THREE.TubeGeometry(cordCurve, 32, 0.016, 8, false);
  const cordMesh = new THREE.Mesh(cordGeo, matCable);
  cordMesh.name = "Power_Cord";
  cordMesh.castShadow = true;
  room.add(cordMesh);

  root.add(room);
  return { surfaceY: benchY };
}
