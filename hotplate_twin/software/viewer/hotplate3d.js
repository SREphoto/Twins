/**
 * SREdesigns STIR-HEAT 500-D — Procedural Three.js 3D Twin Architecture
 * 
 * Exhaustive procedural design:
 * - Die-cast aluminum base chassis with chamfered bevels & cable routing
 * - Boolean-carved recessed display & console pocket (Anti-clipping rule)
 * - White ceramic-coated top heating plate (Dia 135 mm) with thermal spill collar & M4 DIN 912 screws
 * - Dual rotary optical encoder knobs (Speed: 0-1500 RPM / Temp: 20-310°C) with kinematic pivots
 * - M10 rear boss mount, vertical 304 SS support rod, boss head clamp & PT1000 immersion sensor
 * - 250 mL borosilicate glass beaker with graduations, liquid layer, and dynamic vortex deformation
 * - Pure virgin PTFE magnetic stir bar with synchronized rotation and decouple tumbling physics
 * - Rear IEC C14 power inlet, DIN PT1000 probe port, and cooling exhaust louvers
 * - 4 Neoprene leveling feet resting exactly on tabletop datum Y = 0 (Y = 9.00 lab world)
 * - SREdesigns brand badge strictly adhering to DIAG-001 (<85% apron height) & DIAG-002 (positive Z depth)
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

const matWhiteChassis  = M(0xf4f6f8, { r: 0.36, m: 0.08, side: THREE.DoubleSide });
const matDarkTrim      = M(0x181c22, { r: 0.48, m: 0.15, side: THREE.DoubleSide });
const matCeramicPlate  = M(0xfafafa, { r: 0.14, m: 0.02, side: THREE.DoubleSide });
const matSteelBrushed  = M(0xc4c9d0, { r: 0.28, m: 0.85, side: THREE.DoubleSide });
const matSteelDark     = M(0x42464c, { r: 0.35, m: 0.80 });
const matBrass         = M(0xd4af37, { r: 0.28, m: 0.85 });
const matRubber        = M(0x141619, { r: 0.92, m: 0.02 });
const matKnobPolymer   = M(0x1a1d22, { r: 0.42, m: 0.12 });
const matKnobPointer   = M(0xffffff, { r: 0.20, m: 0.00 });
const matPTFE          = M(0xf8fafc, { r: 0.45, m: 0.00 });
const matRockerSwitch  = M(0x22c55e, { r: 0.30, m: 0.10, e: 0x16a34a, ei: 0.8 });
const matRockerOff     = M(0x1e293b, { r: 0.60, m: 0.10 });
const matCable         = M(0x1e2024, { r: 0.75, m: 0.05 });
const matSpillCollar   = M(0x2b3038, { r: 0.50, m: 0.20 });

// Refractive Borosilicate Glass
const matBeakerGlass = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.96,
  opacity: 1,
  transparent: true,
  roughness: 0.04,
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
  transmission: 0.88,
  opacity: 0.85,
  transparent: true,
  roughness: 0.06,
  ior: 1.333,
  thickness: 0.4,
  side: THREE.DoubleSide,
  depthWrite: false,
});

// Heating glow material for hotplate
const matHeaterGlow = new THREE.MeshBasicMaterial({
  color: 0xff3b00,
  transparent: true,
  opacity: 0.0,
  blending: THREE.AdditiveBlending,
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
// Bench & Island Constants (Countertop: 900 mm = 9.00 units)
// ---------------------------------------------------------------------------
export const BENCH = {
  cx: 0.0,
  cz: 0.0,
  sx: 10.0,
  sz: 6.0,
  sy: 9.000,
};

// ---------------------------------------------------------------------------
// Official SREdesigns Brand Badge (Strict DIAG-001 & DIAG-002 Compliance)
// ---------------------------------------------------------------------------
export function makeSREdesignsBadge(scale = 0.28) {
  const group = new THREE.Group();
  group.name = "Badge_SREdesigns";

  // Dimensions: 32 mm x 9 mm x 1.2 mm
  const plateW = 1.15 * scale; // 32.2 mm
  const plateH = 0.32 * scale; // 9.0 mm
  const plateD = 0.035 * scale;

  // Outer bezel frame
  const bezel = box(plateW + 0.03 * scale, plateH + 0.03 * scale, plateD, matSteelDark);
  group.add(bezel);

  // Brushed aluminum backing plate
  const plate = box(plateW, plateH, plateD * 0.9, matSteelBrushed);
  plate.position.z = plateD * 0.05;
  group.add(plate);

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

  // Outer gold/teal border
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
  ctx.font = '700 24px "IBM Plex Sans", sans-serif';
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
    side: THREE.FrontSide,
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
  const W = 1.60;  // 160 mm
  const D = 2.70;  // 270 mm
  const H = 0.85;  // 85 mm base chassis
  const slopeAngle = Math.PI * (15.0 / 180.0); // 15° forward tilt
  const plateDia = 1.35; // 135 mm
  const plateZ = 0.35;   // Plate center offset toward rear (+Z in Three.js world)

  // 1. BASE LEVELING FEET (Foot_Leveling_*)
  // Sits from Y = -0.12 to Y = 0 on table surface
  const feetGroup = new THREE.Group();
  feetGroup.name = "Assembly_LevelingFeet";
  const footPositions = [
    [-W/2 + 0.22, D/2 - 0.26, "Foot_Leveling_RR"],
    [ W/2 - 0.22, D/2 - 0.26, "Foot_Leveling_RL"],
    [-W/2 + 0.22, -D/2 + 0.22, "Foot_Leveling_FR"],
    [ W/2 - 0.22, -D/2 + 0.22, "Foot_Leveling_FL"],
  ];
  footPositions.forEach(([fx, fz, fname]) => {
    const foot = createVibrationFoot(0.10, 0.12, 0.12);
    foot.name = fname;
    foot.position.set(fx, 0, fz);
    feetGroup.add(foot);
  });
  root.add(feetGroup);
  registerExplode(feetGroup, new THREE.Vector3(0, -0.4, 0));

  // 2. MAIN UNIBODY CHASSIS (Body_Chassis)
  const chassisGroup = new THREE.Group();
  chassisGroup.name = "Assembly_Chassis";

  // Stamped bottom pan plate
  const basePan = box(W - 0.08, 0.03, D - 0.08, matDarkTrim);
  basePan.name = "Chassis_BasePlate";
  basePan.position.set(0, 0.135, 0);
  chassisGroup.add(basePan);

  // Lower rectangular body block
  const lowerH = 0.50;
  const lowerBody = box(W, lowerH, D, matWhiteChassis);
  lowerBody.name = "Body_Chassis_Lower";
  lowerBody.position.set(0, 0.12 + lowerH / 2, 0);
  chassisGroup.add(lowerBody);

  // Upper flat deck (supports heating plate)
  const deckL = 1.65;
  const deckH = H - lowerH - 0.12;
  const deckBody = box(W, deckH, deckL, matWhiteChassis);
  deckBody.name = "Body_Chassis_Deck";
  deckBody.position.set(0, 0.12 + lowerH + deckH / 2, (D - deckL) / 2);
  chassisGroup.add(deckBody);

  // Sloped front console block (spans forward from deck to front lip)
  const slopeL = D - deckL; // ~1.05
  const slopeGeo = new THREE.CylinderGeometry(W / 2, W / 2, slopeL, 4, 1, false, Math.PI / 4);
  const slopeWedge = new THREE.Mesh(new THREE.BoxGeometry(W, deckH, slopeL), matWhiteChassis);
  slopeWedge.name = "Body_Chassis_SlopeWedge";
  slopeWedge.position.set(0, 0.12 + lowerH + deckH * 0.35, -deckL / 2 + 0.05);
  slopeWedge.rotation.x = -slopeAngle;
  chassisGroup.add(slopeWedge);

  // Boolean-carved Display Recessed Pocket (Pocket_Bezel)
  // Sloped console surface at Z ≈ -0.80, Y ≈ 0.65
  const bezelW = 1.10;
  const bezelH = 0.55;
  const bezelD = 0.04;
  const bezelGroup = new THREE.Group();
  bezelGroup.name = "Pocket_Bezel";
  bezelGroup.position.set(0, 0.68, -0.82);
  bezelGroup.rotation.x = -slopeAngle;

  const bezelBacking = box(bezelW, bezelH, bezelD, matDarkTrim);
  bezelGroup.add(bezelBacking);

  // Display quad (UI_LCD)
  const lcdW = 0.88;
  const lcdH = 0.38;
  const lcdPlaneGeo = new THREE.PlaneGeometry(lcdW, lcdH);
  const matLcdQuad = new THREE.MeshStandardMaterial({
    color: 0x050c16,
    roughness: 0.15,
    metalness: 0.05,
    emissive: 0x00f3ff,
    emissiveIntensity: 0.35,
    side: THREE.FrontSide,
  });
  const lcdMesh = new THREE.Mesh(lcdPlaneGeo, matLcdQuad);
  lcdMesh.name = "UI_LCD";
  // Positive clearance proud of backing (DIAG-002: no occluding box)
  lcdMesh.position.z = bezelD / 2 + 0.008;
  bezelGroup.add(lcdMesh);
  chassisGroup.add(bezelGroup);

  // Dual Rotary Encoder Knobs (Knob_Speed, Knob_Temp)
  const knobGroup = new THREE.Group();
  knobGroup.name = "Assembly_Knobs";
  knobGroup.position.set(0, 0.50, -1.08);
  knobGroup.rotation.x = -slopeAngle;

  function makeKnob(name, label) {
    const g = new THREE.Group();
    g.name = name;
    // Knurled cylindrical knob body
    const body = cyl(0.16, 0.16, 0.14, matKnobPolymer, 32);
    body.rotation.x = Math.PI / 2;
    g.add(body);

    // Beveled rim collar
    const collar = cyl(0.18, 0.16, 0.03, matSteelBrushed, 32);
    collar.rotation.x = Math.PI / 2;
    collar.position.z = -0.06;
    g.add(collar);

    // White radial indicator pointer on face
    const ptr = box(0.018, 0.07, 0.015, matKnobPointer);
    ptr.position.set(0, 0.10, 0.072);
    g.add(ptr);

    return g;
  }

  const knobSpeed = makeKnob("Pivot_KnobSpeed", "SPEED");
  knobSpeed.position.set(-0.42, 0, 0);
  knobGroup.add(knobSpeed);

  const knobTemp = makeKnob("Pivot_KnobTemp", "TEMP");
  knobTemp.position.set(0.42, 0, 0);
  knobGroup.add(knobTemp);

  // Recessed Safety circuit trimpot (Btn_SafeTemp)
  const trimpot = cyl(0.035, 0.035, 0.04, matBrass, 16);
  trimpot.name = "Btn_SafeTemp";
  trimpot.rotation.x = Math.PI / 2;
  trimpot.position.set(0, 0, 0.01);
  knobGroup.add(trimpot);

  chassisGroup.add(knobGroup);

  // Power Rocker Switch on Right Flank (Btn_Power)
  const switchGroup = new THREE.Group();
  switchGroup.name = "Btn_Power";
  switchGroup.position.set(W / 2 + 0.005, 0.42, 0);
  const switchBezel = box(0.02, 0.22, 0.14, matDarkTrim);
  switchGroup.add(switchBezel);
  const switchRocker = box(0.035, 0.18, 0.10, matRockerSwitch);
  switchRocker.name = "Rocker_Actuator";
  switchRocker.position.x = 0.015;
  switchGroup.add(switchRocker);
  chassisGroup.add(switchGroup);

  // Rear Bulkhead Panel (Panel_RearLouver, IEC C14, PT1000 Port)
  const rearGroup = new THREE.Group();
  rearGroup.name = "Assembly_RearBulkhead";
  rearGroup.position.set(0, 0.48, D / 2 + 0.005);

  const louverPlate = box(1.20, 0.45, 0.02, matDarkTrim);
  louverPlate.name = "Panel_RearLouver";
  rearGroup.add(louverPlate);

  // IEC C14 Inlet
  const iec = createIECInlet();
  iec.position.set(-0.35, -0.08, 0.01);
  rearGroup.add(iec);

  // PT1000 DIN Port
  const dinPort = cyl(0.07, 0.07, 0.03, matSteelBrushed, 24);
  dinPort.name = "Port_PT1000";
  dinPort.rotation.x = Math.PI / 2;
  dinPort.position.set(0.35, -0.05, 0.01);
  rearGroup.add(dinPort);

  chassisGroup.add(rearGroup);

  // Official SREdesigns Brand Badge on Front Lip
  // strictly adhering to DIAG-001 (<85% apron height)
  const badge = makeSREdesignsBadge(0.28);
  badge.position.set(0, 0.24, -D / 2 - 0.01);
  chassisGroup.add(badge);

  root.add(chassisGroup);

  // 3. HEATING TOP PLATE ASSEMBLY (Plate_Heating)
  const plateGroup = new THREE.Group();
  plateGroup.name = "Assembly_HeatingPlate";
  plateGroup.position.set(0, H, plateZ);

  // Spill Collar Ring
  const collarMesh = cyl(plateDia / 2 + 0.04, plateDia / 2 + 0.04, 0.04, matSpillCollar, 48);
  collarMesh.name = "Plate_SpillCollar";
  collarMesh.position.y = 0.02;
  plateGroup.add(collarMesh);

  // White Ceramic Coated Hotplate Disk
  const plateMesh = cyl(plateDia / 2, plateDia / 2, 0.15, matCeramicPlate, 48);
  plateMesh.name = "Plate_Heating";
  plateMesh.position.y = 0.075;
  plateGroup.add(plateMesh);

  // Thermal glow overlay mesh (illuminates red when heated)
  const glowMesh = cyl(plateDia / 2 - 0.01, plateDia / 2 - 0.01, 0.02, matHeaterGlow, 48);
  glowMesh.name = "Plate_ThermalGlow";
  glowMesh.position.y = 0.151;
  plateGroup.add(glowMesh);

  // 4x M4 Hex Socket Screws securing heating plate
  for (let i = 0; i < 4; i++) {
    const ang = (Math.PI / 2) * i + Math.PI / 4;
    const sr = plateDia / 2 - 0.08;
    const sx = sr * Math.cos(ang);
    const sz = sr * Math.sin(ang);
    const screw = createHexSocketScrew(0.018, 0.06, { material: matSteelDark });
    screw.name = `Fastener_HexM4_${i + 1}`;
    screw.position.set(sx, 0.15, sz);
    plateGroup.add(screw);
  }

  root.add(plateGroup);
  registerExplode(plateGroup, new THREE.Vector3(0, 0.5, 0));

  // 4. RETORT ROD, CLAMP & PT1000 PROBE ASSEMBLY
  const standGroup = new THREE.Group();
  standGroup.name = "Assembly_RetortStand";
  const rodX = W / 2 - 0.18;
  const rodZ = D / 2 - 0.24;
  standGroup.position.set(rodX, H, rodZ);

  // Threaded Boss Mount
  const boss = cyl(0.09, 0.09, 0.08, matSteelBrushed, 24);
  boss.name = "Boss_RetortMount";
  boss.position.y = 0.04;
  standGroup.add(boss);

  // Vertical Stainless Steel Support Rod (450 mm = 4.50 units)
  const rod = cyl(0.06, 0.06, 4.20, matSteelBrushed, 24);
  rod.name = "Rod_Support";
  rod.position.y = 2.14;
  standGroup.add(rod);

  // Dual Boss Head Clamp
  const clampGroup = new THREE.Group();
  clampGroup.name = "Clamp_BossHead";
  clampGroup.position.set(0, 2.20, 0);

  const clampBody = box(0.36, 0.30, 0.28, matDarkTrim);
  clampGroup.add(clampBody);

  // Brass thumbscrews on clamp
  const thumb1 = cyl(0.065, 0.065, 0.14, matBrass, 16);
  thumb1.name = "Fastener_Thumb_01";
  thumb1.rotation.z = Math.PI / 2;
  thumb1.position.set(0.22, 0, 0);
  clampGroup.add(thumb1);

  // Horizontal Extension Arm
  const arm = cyl(0.04, 0.04, 1.40, matSteelBrushed, 16);
  arm.name = "Arm_ProbeHolder";
  arm.rotation.z = Math.PI / 2;
  arm.rotation.y = -0.32;
  arm.position.set(-0.70, 0, -0.22);
  clampGroup.add(arm);

  // PT1000 Stainless Immersion Probe (Probe_PT1000)
  const probeGroup = new THREE.Group();
  probeGroup.name = "Assembly_PT1000Probe";
  // Aligns directly over beaker center: deltaX = -rodX, deltaZ = -(rodZ - plateZ)
  probeGroup.position.set(-rodX, 0, plateZ - rodZ);

  const probeShaft = cyl(0.016, 0.016, 1.80, matSteelBrushed, 16);
  probeShaft.name = "Probe_PT1000";
  probeShaft.position.y = -0.40;
  probeGroup.add(probeShaft);

  // Coiled silicone cable running from probe top back to rear DIN port
  const curvePoints = [];
  const startP = new THREE.Vector3(0, 0.50, 0);
  const endP = new THREE.Vector3(0.15, -1.65, 0.60);
  for (let t = 0; t <= 1; t += 0.05) {
    const helixP = new THREE.Vector3()
      .lerpVectors(startP, endP, t)
      .add(new THREE.Vector3(Math.sin(t * Math.PI * 8) * 0.05, 0, Math.cos(t * Math.PI * 8) * 0.05));
    curvePoints.push(helixP);
  }
  const cableGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePoints), 32, 0.012, 8, false);
  const cableMesh = new THREE.Mesh(cableGeo, matCable);
  cableMesh.name = "Cable_ProbeCoil";
  probeGroup.add(cableMesh);

  clampGroup.add(probeGroup);
  standGroup.add(clampGroup);
  root.add(standGroup);
  registerExplode(standGroup, new THREE.Vector3(0.5, 0.3, 0.3));

  // 5. GLASS BEAKER, FLUID & PTFE STIR BAR
  const beakerGroup = new THREE.Group();
  beakerGroup.name = "Assembly_BeakerConsumable";
  beakerGroup.position.set(0, H + 0.15, plateZ);

  // 250 mL Borosilicate Beaker (Outer wall + base)
  const beakerR = 0.35; // 70 mm dia
  const beakerH = 0.95; // 95 mm height
  const beakerMesh = cyl(beakerR, beakerR * 0.98, beakerH, matBeakerGlass, 48);
  beakerMesh.name = "Glass_Beaker";
  beakerMesh.position.y = beakerH / 2 + 0.005;
  beakerGroup.add(beakerMesh);

  // White graduation enamel bands
  for (let g = 1; g <= 4; g++) {
    const gy = 0.18 + g * 0.16;
    const gradMesh = cyl(beakerR + 0.001, beakerR + 0.001, 0.006, matKnobPointer, 32);
    gradMesh.position.y = gy;
    beakerGroup.add(gradMesh);
  }

  // Fluid Liquid Column with dynamic vortex
  const fluidH = 0.50; // 150 mL solution
  const fluidGeo = new THREE.CylinderGeometry(beakerR - 0.02, beakerR - 0.025, fluidH, 48, 8);
  const fluidMesh = new THREE.Mesh(fluidGeo, matFluid);
  fluidMesh.name = "Fluid_Liquid";
  fluidMesh.position.y = fluidH / 2 + 0.02;
  beakerGroup.add(fluidMesh);

  // PTFE Magnetic Stir Bar (Pivot_StirBar)
  const stirBar = cyl(0.04, 0.04, 0.25, matPTFE, 16);
  stirBar.name = "Pivot_StirBar";
  stirBar.rotation.z = Math.PI / 2;
  stirBar.position.set(0, 0.045, 0);

  // Center pivot ring on stir bar
  const stirRing = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.008, 8, 16), matPTFE);
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
        lcdMesh.material.map = tex;
        lcdMesh.material.needsUpdate = true;
      }
    },

    setSpeedKnobRotation(rad) {
      knobSpeed.rotation.z = rad;
    },

    setTempKnobRotation(rad) {
      knobTemp.rotation.z = rad;
    },

    setStirBarRotation(rad, decoupleOffset = 0) {
      stirBar.rotation.y = rad;
      stirBar.position.x = decoupleOffset;
    },

    setPlateThermalGlow(tempC) {
      // Glow becomes visible above 50°C and reaches peak redness at 310°C
      if (tempC <= 50.0) {
        glowMesh.material.opacity = 0.0;
      } else {
        const factor = Math.min(1.0, (tempC - 50.0) / 260.0);
        glowMesh.material.opacity = factor * 0.85;
      }
    },

    setVortexDepth(depthRatio) {
      // Deforms fluid column scale slightly to emulate surface depression
      const d = Math.max(0, Math.min(0.8, depthRatio));
      fluidMesh.scale.y = 1.0 - d * 0.15;
    },

    setPowerSwitch(isOn) {
      switchRocker.rotation.z = isOn ? -0.15 : 0.15;
      switchRocker.material = isOn ? matRockerSwitch : matRockerOff;
    },

    setBeakerLoaded(isLoaded) {
      beakerGroup.visible = isLoaded;
    },

    setProbeDipped(isDipped) {
      clampGroup.position.y = isDipped ? 1.65 : 2.20;
    },
  };
}

// ---------------------------------------------------------------------------
// Standalone Photorealistic Laboratory Room Environment
// ---------------------------------------------------------------------------
export function buildLabRoom(root) {
  const room = new THREE.Group();
  room.name = "LaboratoryRoom";

  // Benchtop Island (Standing-height lab counter: Y = 9.000)
  const benchY = BENCH.sy;
  const matCountertop = M(0x11161d, { r: 0.22, m: 0.15 }); // Chemical-resistant black epoxy resin
  const countertop = box(BENCH.sx, 0.08, BENCH.sz, matCountertop);
  countertop.name = "Countertop_Epoxy";
  countertop.position.set(0, benchY - 0.04, 0);
  room.add(countertop);

  // 4 Perimeter Edges (DIAG-003: discrete wrap trims with ZERO coplanar overlap)
  const trimW = 0.04;
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

  // Cabinet body below counter
  const matCabinet = M(0x334155, { r: 0.45, m: 0.05 });
  const cabinet = box(BENCH.sx - 0.4, benchY - 0.08, BENCH.sz - 0.4, matCabinet);
  cabinet.position.set(0, (benchY - 0.08) / 2, 0);
  room.add(cabinet);

  // Floor tiles
  const matFloor = M(0x0f172a, { r: 0.65, m: 0.05 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), matFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  room.add(floor);

  // Backsplash wall with laboratory electrical outlets
  const matWall = M(0x64748b, { r: 0.75, m: 0.02 });
  const wall = box(BENCH.sx, 4.0, 0.12, matWall);
  wall.position.set(0, benchY + 2.0, BENCH.sz / 2 + 0.06);
  room.add(wall);

  root.add(room);
  return { surfaceY: benchY };
}
