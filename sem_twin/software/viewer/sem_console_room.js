/**
 * sem_console_room.js — Dedicated VC-E Electron Microscopy Suite, Specimen Prep Bench,
 * Operator Console Desk, Articulated Dual-27" VESA Monitors, High-DPI Silkscreened
 * ZEISS Dual-Rotary Control Panel, Dual-Joystick Stage Box & IR Chamberscope + EDS Renderer.
 *
 * Coordinate Convention:
 *   1 unit (u) = 100 mm = 0.1 m | +Y up | Floor datum Y = 0.00 u
 *   Operator front = -Z | screenRight = -X (Plinth/Column bay) | screenLeft = +X (Console & Prep bays)
 */

import * as THREE from 'three';
import {
  makeMat,
  createCanvas,
  MAT_ZEISS_WHITE,
  MAT_ZEISS_ANTHRACITE,
  MAT_ZEISS_BLUE,
  MAT_FRAME_STEEL,
  MAT_GRANITE_SLAB,
  MAT_316SS_POLISHED,
  MAT_316SS_BRUSHED,
  MAT_DARK_ANODIZED,
  MAT_BLUE_ANODIZED,
  MAT_RED_ANODIZED,
  MAT_YELLOW_SAFETY,
  MAT_COPPER_OFHC,
  MAT_BRASS_GOLD,
  MAT_GOLD_MIRROR,
  MAT_RUBBER_EPDM,
  MAT_BOROSILICATE_GLASS,
  MAT_DISPLAY_GLASS,
  MAT_CONSOLE_DESK,
  makeOperatorFacingQuadGeo,
  createTopDecalQuad,
  createHexSocketScrew,
  makeWiringHarness,
} from './sem_materials.js';

// ----------------------------------------------------------------------------
// Internal Geometry & Canvas Helpers
// ----------------------------------------------------------------------------
function finalizeTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function addArticulatedLink(parent, pA, pB, height, width, mat, name) {
  const vA = new THREE.Vector3(...pA);
  const vB = new THREE.Vector3(...pB);
  const delta = new THREE.Vector3().subVectors(vB, vA);
  const len = delta.length();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, len), mat);
  mesh.position.copy(vA).addScaledVector(delta, 0.5);
  mesh.rotation.y = Math.atan2(delta.x, delta.z);
  mesh.name = name;
  parent.add(mesh);
  return mesh;
}

function makeStandbySmartSEMTexture() {
  const c = createCanvas(768, 480);
  if (!c) return null;
  const ctx = c.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#070b12';
  ctx.fillRect(0, 0, 768, 480);

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, 744, 388);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(14, 14, 740, 42);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px "IBM Plex Mono", monospace';
  ctx.fillText('ZEISS SmartSEM · GEMINI-500 PRIMARY MICROGRAPH', 28, 41);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
  ctx.lineWidth = 1;
  for (let gx = 48; gx < 730; gx += 48) {
    ctx.beginPath();
    ctx.moveTo(gx, 68);
    ctx.lineTo(gx, 386);
    ctx.stroke();
  }
  for (let gy = 84; gy < 386; gy += 48) {
    ctx.beginPath();
    ctx.moveTo(28, gy);
    ctx.lineTo(740, gy);
    ctx.stroke();
  }

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 24px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GEMINI II UHV COLUMN · STANDBY READY', 384, 214);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px "IBM Plex Mono", monospace';
  ctx.fillText('50x - 300,000x · 0.02 - 30.0 kV · InLens / SE2 / 4Q-BSE', 384, 250);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#070a0f';
  ctx.fillRect(0, 408, 768, 72);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 409, 766, 70);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 16px "IBM Plex Mono", monospace';
  ctx.fillText('EHT = 15.00 kV   WD = 8.50 mm   Mag = 15,000 X   ZEISS GeminiSEM', 24, 450);

  return finalizeTexture(c);
}

// ----------------------------------------------------------------------------
// 1. Standalone Dedicated VC-E Electron Microscopy Suite (includeLab !== false)
// ----------------------------------------------------------------------------
export function buildVCELabRoom() {
  const room = new THREE.Group();
  room.name = 'Body_LaboratoryRoom';

  // 1. Subfloor terrazzo slab (Ground: Y = -0.20..0.00 u)
  const mainFloor = new THREE.Mesh(
    new THREE.BoxGeometry(58.0, 0.20, 46.0),
    makeMat(0x111722, { r: 0.56, m: 0.12 })
  );
  mainFloor.position.set(0, -0.100, 0);
  mainFloor.receiveShadow = true;
  mainFloor.name = 'Ground';
  room.add(mainFloor);

  // Cleanroom terrazzo expansion grid seams outside inertia slab (Lab_Floor)
  const labFloorGroup = new THREE.Group();
  labFloorGroup.name = 'Lab_Floor';
  const matFloorSeam = makeMat(0x1d2738, { r: 0.45, m: 0.18 });
  for (let gx = -24; gx <= 24; gx += 4.0) {
    const seamZ = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.002, 44.0), matFloorSeam);
    seamZ.position.set(gx, 0.0005, 0);
    seamZ.name = `Lab_FloorSeamX_${gx + 24}`;
    if (Math.abs(gx) > 10.4) labFloorGroup.add(seamZ);
  }
  for (let gz = -20; gz <= 20; gz += 4.0) {
    const seamX = new THREE.Mesh(new THREE.BoxGeometry(56.0, 0.002, 0.03), matFloorSeam);
    seamX.position.set(0, 0.0005, gz);
    seamX.name = `Lab_FloorSeamZ_${gz + 20}`;
    if (gz < -7.6 || gz > 8.0) labFloorGroup.add(seamX);
  }
  room.add(labFloorGroup);

  // 2. Decoupled VC-E Concrete Inertia Slab + 4-Sided Neoprene Isolation Joint (Zero Z-Fighting)
  const inertiaSlab = new THREE.Mesh(
    new THREE.BoxGeometry(19.6, 0.036, 14.4),
    makeMat(0x1c2535, { r: 0.36, m: 0.16 })
  );
  inertiaSlab.position.set(0.0, -0.016, 0.20); // Top surface at Y = +0.002 u
  inertiaSlab.receiveShadow = true;
  inertiaSlab.name = 'Lab_VCE_InertiaSlab';
  room.add(inertiaSlab);

  // 4-sided perimeter neoprene isolation joint surrounding inertiaSlab (X: +-9.8, Z: -7.0..+7.4)
  const jointGroup = new THREE.Group();
  jointGroup.name = 'Lab_VCE_NeopreneJoint';
  const jW = 0.38;
  const jH = 0.036;
  const jY = -0.016;
  const jointFront = new THREE.Mesh(new THREE.BoxGeometry(19.6 + jW * 2, jH, jW), MAT_RUBBER_EPDM);
  jointFront.position.set(0, jY, 0.20 - 7.20 - jW * 0.5);
  jointFront.name = 'Lab_VCE_NeopreneJoint_Front';
  jointGroup.add(jointFront);

  const jointRear = new THREE.Mesh(new THREE.BoxGeometry(19.6 + jW * 2, jH, jW), MAT_RUBBER_EPDM);
  jointRear.position.set(0, jY, 0.20 + 7.20 + jW * 0.5);
  jointRear.name = 'Lab_VCE_NeopreneJoint_Rear';
  jointGroup.add(jointRear);

  const jointLeft = new THREE.Mesh(new THREE.BoxGeometry(jW, jH, 14.4), MAT_RUBBER_EPDM);
  jointLeft.position.set(9.80 + jW * 0.5, jY, 0.20);
  jointLeft.name = 'Lab_VCE_NeopreneJoint_Left';
  jointGroup.add(jointLeft);

  const jointRight = new THREE.Mesh(new THREE.BoxGeometry(jW, jH, 14.4), MAT_RUBBER_EPDM);
  jointRight.position.set(-9.80 - jW * 0.5, jY, 0.20);
  jointRight.name = 'Lab_VCE_NeopreneJoint_Right';
  jointGroup.add(jointRight);
  room.add(jointGroup);

  // Outer stainless threshold strips around neoprene joint (top at Y = +0.002, zero slab overlap)
  const trimW = 0.14;
  const trimFront = new THREE.Mesh(new THREE.BoxGeometry(20.64, 0.024, trimW), MAT_316SS_BRUSHED);
  trimFront.position.set(0, -0.010, 0.20 - 7.20 - jW - trimW * 0.5);
  trimFront.name = 'Lab_VCE_TrimFront';
  room.add(trimFront);

  const trimRear = new THREE.Mesh(new THREE.BoxGeometry(20.64, 0.024, trimW), MAT_316SS_BRUSHED);
  trimRear.position.set(0, -0.010, 0.20 + 7.20 + jW + trimW * 0.5);
  trimRear.name = 'Lab_VCE_TrimRear';
  room.add(trimRear);

  const trimLeft = new THREE.Mesh(new THREE.BoxGeometry(trimW, 0.024, 15.16), MAT_316SS_BRUSHED);
  trimLeft.position.set(9.80 + jW + trimW * 0.5, -0.010, 0.20);
  trimLeft.name = 'Lab_VCE_TrimLeft';
  room.add(trimLeft);

  const trimRight = new THREE.Mesh(new THREE.BoxGeometry(trimW, 0.024, 15.16), MAT_316SS_BRUSHED);
  trimRight.position.set(-9.80 - jW - trimW * 0.5, -0.010, 0.20);
  trimRight.name = 'Lab_VCE_TrimRight';
  room.add(trimRight);

  // 3. RF/EMI-Shielded & Acoustically Baffled Suite Walls (Back +Z, Right -X, Left +X)
  const matWallRear = makeMat(0x1b2535, { r: 0.58, m: 0.16 });
  const matWallSide = makeMat(0x1e293b, { r: 0.58, m: 0.16 });
  const matBaffle = makeMat(0x253349, { r: 0.48, m: 0.28 });

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(58.0, 38.0, 0.50), matWallRear);
  backWall.position.set(0, 19.0, 12.5);
  backWall.receiveShadow = true;
  backWall.name = 'Lab_WallRear';
  room.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.50, 38.0, 46.0), matWallSide);
  leftWall.position.set(28.8, 19.0, 0);
  leftWall.receiveShadow = true;
  leftWall.name = 'Lab_WallLeft';
  room.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.50, 38.0, 46.0), matWallSide);
  rightWall.position.set(-28.8, 19.0, 0);
  rightWall.receiveShadow = true;
  rightWall.name = 'Lab_WallRight';
  room.add(rightWall);

  // Acoustic Absorber Baffles on Rear & Side Walls
  for (let i = -3; i <= 3; i++) {
    const baffle = new THREE.Mesh(new THREE.BoxGeometry(5.6, 17.5, 0.18), matBaffle);
    baffle.position.set(i * 6.4, 13.5, 12.16);
    baffle.name = `Lab_AcousticBaffle_0${i + 4}`;
    room.add(baffle);
  }
  [-12.0, -4.0, 4.0].forEach((bz, idx) => {
    const sideBaffleL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 15.0, 5.8), matBaffle);
    sideBaffleL.position.set(28.46, 13.5, bz);
    sideBaffleL.name = `Lab_WallPanelLeft_0${idx + 1}`;
    room.add(sideBaffleL);

    const sideBaffleR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 15.0, 5.8), matBaffle);
    sideBaffleR.position.set(-28.46, 13.5, bz);
    sideBaffleR.name = `Lab_WallPanelRight_0${idx + 1}`;
    room.add(sideBaffleR);
  });

  // Stainless Steel Cleanroom Dado Crash Rails (Y = 9.20 u)
  const dadoRear = new THREE.Mesh(new THREE.BoxGeometry(56.8, 0.36, 0.14), MAT_316SS_BRUSHED);
  dadoRear.position.set(0, 9.20, 12.18);
  dadoRear.name = 'Lab_DadoRailRear';
  room.add(dadoRear);

  const dadoLeft = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.36, 44.8), MAT_316SS_BRUSHED);
  dadoLeft.position.set(28.48, 9.20, 0);
  dadoLeft.name = 'Lab_DadoRailLeft';
  room.add(dadoLeft);

  const dadoRight = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.36, 44.8), MAT_316SS_BRUSHED);
  dadoRight.position.set(-28.48, 9.20, 0);
  dadoRight.name = 'Lab_DadoRailRight';
  room.add(dadoRight);

  // 4. Overhead Cleanroom LED Luminaire Housings (elevated clear of CAM_TOP Y=28.5)
  const matLuminaire = makeMat(0xe2e8f0, { r: 0.28, m: 0.1, e: 0xcbeafe, ei: 0.72 });
  [
    [-10.5, 34.0, 5.5],
    [0.0, 34.0, 6.5],
    [10.5, 34.0, 5.5],
  ].forEach(([lx, ly, lz], idx) => {
    const housing = new THREE.Group();
    housing.name = `Lab_Luminaire_0${idx + 1}`;
    housing.position.set(lx, ly, lz);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.24, 2.2), MAT_316SS_BRUSHED);
    housing.add(frame);

    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.08, 1.8), matLuminaire);
    diffuser.position.y = -0.14;
    housing.add(diffuser);
    room.add(housing);
  });

  // 5. Elevated Single-Sided Downward-Facing Ceiling at Y = 300 u (DIAG-026)
  const ceilingGeo = new THREE.PlaneGeometry(58.0, 46.0);
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.FrontSide,
  });
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 300.0, 0);
  ceiling.name = 'Lab_Ceiling';
  room.add(ceiling);

  // 6. Adjacent Specimen Preparation Bench (Far Screen-LEFT X = +14.80 u, Z = +1.20 u)
  const prepBenchGroup = new THREE.Group();
  prepBenchGroup.name = 'Body_SpecimenPrepBench';
  prepBenchGroup.position.set(14.80, 0.0, 1.20);

  const benchTop = new THREE.Mesh(new THREE.BoxGeometry(7.60, 0.38, 6.20), MAT_GRANITE_SLAB);
  benchTop.position.set(0, 7.41, 0); // Top surface at Y = 7.60 u
  benchTop.castShadow = true;
  benchTop.receiveShadow = true;
  benchTop.name = 'Body_PrepBenchTop';
  prepBenchGroup.add(benchTop);

  // Stainless front bullnose trim & rear splashback rail (zero top coplanar overlap)
  const benchFrontTrim = new THREE.Mesh(new THREE.BoxGeometry(7.62, 0.376, 0.08), MAT_316SS_BRUSHED);
  benchFrontTrim.position.set(0, 7.41, -3.14);
  benchFrontTrim.name = 'Body_PrepBenchFrontTrim';
  prepBenchGroup.add(benchFrontTrim);

  const splashback = new THREE.Mesh(new THREE.BoxGeometry(7.60, 0.72, 0.16), MAT_316SS_BRUSHED);
  splashback.position.set(0, 7.96, 3.02);
  splashback.name = 'Body_PrepBenchSplashback';
  prepBenchGroup.add(splashback);

  // 4 Tubular Steel Legs + Vulcanized Leveling Pads resting at Y = 0.00 u + lower stretcher frame
  [
    [-3.4, -2.7],
    [3.4, -2.7],
    [-3.4, 2.7],
    [3.4, 2.7],
  ].forEach(([lx, lz], idx) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.42, 7.12, 0.42), MAT_FRAME_STEEL);
    leg.position.set(lx, 3.66, lz);
    leg.name = `Body_PrepBenchLeg_0${idx + 1}`;
    prepBenchGroup.add(leg);

    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.10, 20), MAT_RUBBER_EPDM);
    pad.position.set(lx, 0.05, lz);
    pad.name = `Foot_Leveling_Prep_0${idx + 1}`;
    prepBenchGroup.add(pad);
  });

  const prepStretcherRear = new THREE.Mesh(new THREE.BoxGeometry(6.80, 0.24, 0.24), MAT_FRAME_STEEL);
  prepStretcherRear.position.set(0, 1.40, 2.70);
  prepStretcherRear.name = 'Body_PrepBenchStretcherRear';
  prepBenchGroup.add(prepStretcherRear);

  // --------------------------------------------------------------------------
  // 6A. Benchtop Au/Pd Magnetron Sputter Coater (Body_SputterCoater_AuPd)
  // --------------------------------------------------------------------------
  const coaterGroup = new THREE.Group();
  coaterGroup.name = 'Body_SputterCoater_AuPd';
  coaterGroup.position.set(-1.70, 7.60, 0.20);

  // Rubber chassis feet resting on granite tabletop
  [
    [-1.15, -1.05],
    [1.15, -1.05],
    [-1.15, 1.05],
    [1.15, 1.05],
  ].forEach(([fx, fz], idx) => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.06, 16), MAT_RUBBER_EPDM);
    foot.position.set(fx, 0.03, fz);
    foot.name = `Foot_Leveling_Coater_0${idx + 1}`;
    coaterGroup.add(foot);
  });

  // Main powder-coated chassis housing
  const coaterBase = new THREE.Mesh(new THREE.BoxGeometry(2.80, 1.34, 2.40), MAT_ZEISS_WHITE);
  coaterBase.position.set(0, 0.73, 0.08);
  coaterBase.name = 'Body_SputterCoaterHousing';
  coaterGroup.add(coaterBase);

  // Front-sloped ergonomic control bezel wedge
  const coaterLowerSkirt = new THREE.Mesh(new THREE.BoxGeometry(2.76, 0.30, 0.65), MAT_ZEISS_ANTHRACITE);
  coaterLowerSkirt.position.set(0, 0.21, -1.18);
  coaterLowerSkirt.name = 'Body_SputterCoaterSkirt';
  coaterGroup.add(coaterLowerSkirt);

  const coaterSlopePivot = new THREE.Group();
  coaterSlopePivot.name = 'Body_SputterCoaterConsole';
  coaterSlopePivot.position.set(0, 0.64, -1.26);
  coaterSlopePivot.rotation.x = 0.44; // Normal points (-Z, +Y) toward operator

  const slopePlate = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.78, 0.16), MAT_DARK_ANODIZED);
  slopePlate.position.set(0, 0, 0.08);
  coaterSlopePivot.add(slopePlate);

  // Recessed mini LCD digital sputter thickness gauge ("5.0 nm Au/Pd")
  const sputterLcdFrame = new THREE.Group();
  sputterLcdFrame.name = 'Body_SputterLCDFrame';
  sputterLcdFrame.position.set(0.62, 0.04, -0.005);

  // 4-sided bezel pocket around mini LCD
  const mTop = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.045, 0.03), MAT_ZEISS_ANTHRACITE);
  mTop.position.set(0, 0.245, -0.015);
  sputterLcdFrame.add(mTop);
  const mBot = mTop.clone();
  mBot.position.set(0, -0.245, -0.015);
  sputterLcdFrame.add(mBot);
  const mLeft = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.445, 0.03), MAT_ZEISS_ANTHRACITE);
  mLeft.position.set(0.457, 0, -0.015);
  sputterLcdFrame.add(mLeft);
  const mRight = mLeft.clone();
  mRight.position.set(-0.457, 0, -0.015);
  sputterLcdFrame.add(mRight);

  const sputterCan = createCanvas(320, 160);
  let sputterLcdMat;
  if (sputterCan) {
    const sCtx = sputterCan.getContext('2d');
    if (sCtx) {
      sCtx.fillStyle = '#090d14';
      sCtx.fillRect(0, 0, 320, 160);
      sCtx.fillStyle = '#e2e8f0';
      sCtx.font = 'bold 42px "IBM Plex Mono", monospace';
      sCtx.textAlign = 'center';
      sCtx.fillText('5.0 nm', 160, 74);
      sCtx.fillStyle = '#94a3b8';
      sCtx.font = '600 20px "IBM Plex Mono", monospace';
      sCtx.fillText('0.08 mbar · 45 mA', 160, 124);
    }
    sputterLcdMat = new THREE.MeshBasicMaterial({ map: finalizeTexture(sputterCan) });
  } else {
    sputterLcdMat = makeMat(0x090d14);
  }
  const sputterLcd = new THREE.Mesh(makeOperatorFacingQuadGeo(0.87, 0.445), sputterLcdMat);
  sputterLcd.position.set(0, 0, -0.008);
  sputterLcd.name = 'UI_LCD_SputterGauge';
  sputterLcdFrame.add(sputterLcd);

  const sputterGlass = new THREE.Mesh(new THREE.BoxGeometry(0.87, 0.445, 0.006), MAT_DISPLAY_GLASS);
  sputterGlass.position.set(0, 0, -0.018);
  sputterGlass.name = 'Glass_SputterLCDCover';
  sputterLcdFrame.add(sputterGlass);
  coaterSlopePivot.add(sputterLcdFrame);

  // Rotary analog Pirani vacuum dial gauge
  const piraniGauge = new THREE.Group();
  piraniGauge.name = 'Body_SputterPiraniGauge';
  piraniGauge.position.set(-0.22, 0.04, -0.01);

  const gaugeBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.30, 0.06, 24), MAT_316SS_POLISHED);
  gaugeBezel.rotation.x = Math.PI / 2;
  piraniGauge.add(gaugeBezel);

  const piraniCan = createCanvas(256, 256);
  let piraniMat;
  if (piraniCan) {
    const pCtx = piraniCan.getContext('2d');
    if (pCtx) {
      pCtx.fillStyle = '#f8fafc';
      pCtx.beginPath();
      pCtx.arc(128, 128, 120, 0, Math.PI * 2);
      pCtx.fill();
      pCtx.strokeStyle = '#0f172a';
      pCtx.lineWidth = 6;
      pCtx.stroke();
      // Dial tick marks
      for (let t = 0; t <= 10; t++) {
        const a = Math.PI * 0.75 + (t / 10) * Math.PI * 1.5;
        pCtx.strokeStyle = t >= 7 ? '#0284c7' : '#0f172a';
        pCtx.lineWidth = t % 2 === 0 ? 4 : 2;
        pCtx.beginPath();
        pCtx.moveTo(128 + Math.cos(a) * 80, 128 + Math.sin(a) * 80);
        pCtx.lineTo(128 + Math.cos(a) * 102, 128 + Math.sin(a) * 102);
        pCtx.stroke();
      }
      pCtx.fillStyle = '#0f172a';
      pCtx.font = 'bold 20px "IBM Plex Mono", monospace';
      pCtx.textAlign = 'center';
      pCtx.fillText('PIRANI', 128, 86);
      pCtx.font = 'bold 16px "IBM Plex Mono", monospace';
      pCtx.fillText('mbar', 128, 198);
      // Red indicator needle pointing to high-vac ~8e-2 mbar
      pCtx.strokeStyle = '#dc2626';
      pCtx.lineWidth = 5;
      pCtx.beginPath();
      pCtx.moveTo(128, 128);
      pCtx.lineTo(128 + Math.cos(Math.PI * 1.95) * 86, 128 + Math.sin(Math.PI * 1.95) * 86);
      pCtx.stroke();
      pCtx.fillStyle = '#0f172a';
      pCtx.beginPath();
      pCtx.arc(128, 128, 12, 0, Math.PI * 2);
      pCtx.fill();
    }
    piraniMat = new THREE.MeshStandardMaterial({ map: finalizeTexture(piraniCan), roughness: 0.35 });
  } else {
    piraniMat = makeMat(0xf8fafc);
  }
  const piraniFace = new THREE.Mesh(makeOperatorFacingQuadGeo(0.46, 0.46), piraniMat);
  piraniFace.position.set(0, 0, -0.032);
  piraniGauge.add(piraniFace);
  coaterSlopePivot.add(piraniGauge);

  // Power & Cycle Push Switches on Sputter Console
  const btnSputterPwr = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.16, 0.08),
    makeMat(0x22c55e, { r: 0.25, m: 0.1, e: 0x16a34a, ei: 0.6 })
  );
  btnSputterPwr.position.set(-0.74, 0.08, -0.03);
  btnSputterPwr.name = 'Btn_SputterPower';
  coaterSlopePivot.add(btnSputterPwr);

  const btnSputterCycle = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.16, 0.08),
    makeMat(0xa855f7, { r: 0.25, m: 0.1, e: 0x9333ea, ei: 0.55 })
  );
  btnSputterCycle.position.set(-1.04, 0.08, -0.03);
  btnSputterCycle.name = 'Btn_SputterCycle';
  coaterSlopePivot.add(btnSputterCycle);
  coaterGroup.add(coaterSlopePivot);

  // Vacuum baseplate + Viton seal ring under bell jar
  const bellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 1.02, 0.10, 32), MAT_316SS_POLISHED);
  bellBase.position.set(0, 1.44, 0.14);
  bellBase.name = 'Body_SputterBaseFlange';
  coaterGroup.add(bellBase);

  const bellSeal = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.035, 12, 32), MAT_RUBBER_EPDM);
  bellSeal.rotation.x = Math.PI / 2;
  bellSeal.position.set(0, 1.50, 0.14);
  coaterGroup.add(bellSeal);

  // Internal brass rotary sample stub chuck + sample stub inside bell jar
  const sputterChuck = new THREE.Group();
  sputterChuck.name = 'Body_SputterRotaryChuck';
  sputterChuck.position.set(0, 1.54, 0.14);

  const chuckPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.20, 24), MAT_BRASS_GOLD);
  chuckPedestal.position.y = 0.10;
  sputterChuck.add(chuckPedestal);

  const chuckCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.12, 18), MAT_316SS_POLISHED);
  chuckCollar.position.y = 0.26;
  sputterChuck.add(chuckCollar);

  const coatedPinStub = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 20), MAT_GOLD_MIRROR);
  coatedPinStub.position.y = 0.36;
  sputterChuck.add(coatedPinStub);
  coaterGroup.add(sputterChuck);

  // Polycarbonate sputter bell jar (Glass_SputterBellJar)
  const bellJar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.88, 0.88, 1.55, 28),
    MAT_BOROSILICATE_GLASS
  );
  bellJar.position.set(0, 2.28, 0.14);
  bellJar.name = 'Glass_SputterBellJar';
  coaterGroup.add(bellJar);

  // Violet argon plasma glow inside bell jar
  const plasmaGlow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.72, 0.68, 24),
    makeMat(0xa855f7, { r: 0.2, m: 0.0, o: 0.38, e: 0x9333ea, ei: 1.45, dw: false })
  );
  plasmaGlow.position.set(0, 2.38, 0.14);
  plasmaGlow.name = 'Body_ArgonPlasmaGlow';
  coaterGroup.add(plasmaGlow);

  // Au/Pd magnetron sputter head
  const magnetronHead = new THREE.Mesh(new THREE.CylinderGeometry(0.94, 0.94, 0.34, 28), MAT_DARK_ANODIZED);
  magnetronHead.position.set(0, 3.22, 0.14);
  magnetronHead.name = 'Body_SputterMagnetronHead';
  coaterGroup.add(magnetronHead);

  const targetDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.06, 24), MAT_GOLD_MIRROR);
  targetDisc.position.set(0, 3.04, 0.14);
  coaterGroup.add(targetDisc);

  // Rear AC Power Cord from sputter coater down behind prep bench
  coaterGroup.add(
    makeWiringHarness(
      [
        [0.65, 0.48, 1.28],
        [0.85, 0.42, 2.45],
        [1.10, -1.20, 2.75],
        [1.10, -7.20, 2.85],
      ],
      0.048,
      MAT_RUBBER_EPDM,
      'Body_Wire_SputterCoaterAC'
    )
  );
  prepBenchGroup.add(coaterGroup);

  // --------------------------------------------------------------------------
  // 6B. CNC SEM Pin-Stub Storage Box (12 x 12.7 mm Pin Stubs + Hinged Smoked Lid)
  // --------------------------------------------------------------------------
  const stubBox = new THREE.Group();
  stubBox.name = 'Body_SEMStubBox';
  stubBox.position.set(1.65, 7.60, -0.35);

  const boxFloor = new THREE.Mesh(new THREE.BoxGeometry(2.10, 0.18, 1.56), MAT_BLUE_ANODIZED);
  boxFloor.position.y = 0.09;
  stubBox.add(boxFloor);

  // 4 machined perimeter tray walls forming recessed pin-stub pocket
  const wallF = new THREE.Mesh(new THREE.BoxGeometry(2.10, 0.22, 0.10), MAT_DARK_ANODIZED);
  wallF.position.set(0, 0.28, -0.73);
  stubBox.add(wallF);
  const wallB = wallF.clone();
  wallB.position.set(0, 0.28, 0.73);
  stubBox.add(wallB);
  const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.22, 1.36), MAT_DARK_ANODIZED);
  wallL.position.set(1.00, 0.28, 0);
  stubBox.add(wallL);
  const wallR = wallL.clone();
  wallR.position.set(-1.00, 0.28, 0);
  stubBox.add(wallR);

  // 12 x 12.7 mm Aluminum Pin Stubs (3 rows x 4 cols)
  for (let r = -1; r <= 1; r++) {
    for (let c = 0; c < 4; c++) {
      const sx = -0.63 + c * 0.42;
      const sz = r * 0.40;
      const isAuCoated = (r + c) % 2 === 0;
      const stubPin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.13, 0.16, 18),
        isAuCoated ? MAT_GOLD_MIRROR : MAT_316SS_POLISHED
      );
      stubPin.position.set(sx, 0.26, sz);
      stubPin.name = `Body_PrepStub_${r + 2}_${c + 1}`;
      stubBox.add(stubPin);
    }
  }

  // Rear hinges + Hinged Transparent Smoked-Acrylic Cover (Glass_StubBoxLid)
  [-0.65, 0.65].forEach((hx, idx) => {
    const hingePin = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.18, 12), MAT_BRASS_GOLD);
    hingePin.rotation.z = Math.PI / 2;
    hingePin.position.set(hx, 0.39, 0.76);
    hingePin.name = `Body_StubBoxHinge_0${idx + 1}`;
    stubBox.add(hingePin);
  });

  const lidPivot = new THREE.Group();
  lidPivot.name = 'Pivot_StubBoxLid';
  lidPivot.position.set(0, 0.39, 0.76);
  lidPivot.rotation.x = -0.36; // Hinged open ~20 deg toward rear

  const smokedMat = makeMat(0x334155, { r: 0.10, m: 0.08, o: 0.42, dw: false, side: THREE.DoubleSide });
  const stubLid = new THREE.Mesh(new THREE.BoxGeometry(2.10, 0.05, 1.56), smokedMat);
  stubLid.position.set(0, 0.025, -0.76);
  stubLid.name = 'Glass_StubBoxLid';
  lidPivot.add(stubLid);
  stubBox.add(lidPivot);
  prepBenchGroup.add(stubBox);

  // --------------------------------------------------------------------------
  // 6C. Conductive Carbon Tape Dispenser Roll & Cross-Lock Stainless Tweezers
  // --------------------------------------------------------------------------
  const tapeGroup = new THREE.Group();
  tapeGroup.name = 'Body_CarbonTapeRoll';
  tapeGroup.position.set(0.55, 7.60, -1.65);

  const tapeOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.20, 28), MAT_RUBBER_EPDM);
  tapeOuter.position.y = 0.10;
  tapeGroup.add(tapeOuter);

  const tapeCore = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.21, 24), MAT_ZEISS_WHITE);
  tapeCore.position.y = 0.10;
  tapeGroup.add(tapeCore);

  const tapeTab = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.16), MAT_RUBBER_EPDM);
  tapeTab.position.set(-0.48, 0.015, 0.12);
  tapeTab.rotation.y = 0.28;
  tapeGroup.add(tapeTab);
  prepBenchGroup.add(tapeGroup);

  const tweezersGroup = new THREE.Group();
  tweezersGroup.name = 'Body_PrepTweezers';
  tweezersGroup.position.set(2.35, 7.62, -1.65);
  tweezersGroup.rotation.y = -0.45;

  const bladeA = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.025, 1.45), MAT_316SS_POLISHED);
  bladeA.position.set(0.022, 0.02, 0);
  bladeA.rotation.y = -0.04;
  tweezersGroup.add(bladeA);

  const bladeB = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.025, 1.45), MAT_316SS_POLISHED);
  bladeB.position.set(-0.022, 0.02, 0);
  bladeB.rotation.y = 0.04;
  tweezersGroup.add(bladeB);

  const crossCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.06, 12), MAT_BRASS_GOLD);
  crossCollar.position.set(0, 0.02, -0.15);
  tweezersGroup.add(crossCollar);
  prepBenchGroup.add(tweezersGroup);

  room.add(prepBenchGroup);
  return room;
}

// ----------------------------------------------------------------------------
// 2. Operator Console Desk, Articulated Dual-27" VESA Monitors & Tactile Panels
// ----------------------------------------------------------------------------
export function buildOperatorConsoleAndControls(screenTex) {
  const consoleGroup = new THREE.Group();
  consoleGroup.name = 'Body_ConsoleDesk';
  consoleGroup.position.set(4.50, 0.0, 0.0);

  // 1. Ergonomic Phenolic-Top Operator Desk (Top surface strictly at Y = 7.60 u)
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(7.80, 0.32, 6.80), MAT_CONSOLE_DESK);
  deskTop.position.set(0.0, 7.44, 0.0); // Y: 7.28..7.60 u
  deskTop.name = 'Body_ConsoleTabletop';
  consoleGroup.add(deskTop);

  // Brushed Aluminum Front Bullnose Trim (flush at Z = -3.40..-3.48, zero top overlap)
  const deskEdgeTrim = new THREE.Mesh(new THREE.BoxGeometry(7.82, 0.316, 0.08), MAT_316SS_BRUSHED);
  deskEdgeTrim.position.set(0.0, 7.44, -3.44);
  deskEdgeTrim.name = 'Body_ConsoleFrontBullnose';
  consoleGroup.add(deskEdgeTrim);

  // Tabletop anodized cable-management grommet behind central VESA base
  const deskGrommet = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.04, 24), MAT_DARK_ANODIZED);
  deskGrommet.position.set(0.0, 7.605, 2.55);
  deskGrommet.name = 'Body_ConsoleCableGrommet';
  consoleGroup.add(deskGrommet);

  // 2. Heavy-Duty C-Channel Steel Desk Legs + 4 Desk Leveling Feet at Y = 0.00 u
  [-3.45, 3.45].forEach((lx, idx) => {
    const legColGroup = new THREE.Group();
    legColGroup.name = `Body_ConsoleLeg_0${idx + 1}`;

    // C-channel vertical column from foot runner top (Y=0.36) to tabletop underside (Y=7.28)
    const legSpine = new THREE.Mesh(new THREE.BoxGeometry(0.46, 6.92, 0.86), MAT_ZEISS_ANTHRACITE);
    legSpine.position.set(lx, 3.82, 0.20);
    legColGroup.add(legSpine);

    const legFlangeF = new THREE.Mesh(new THREE.BoxGeometry(0.54, 6.92, 0.08), MAT_316SS_BRUSHED);
    legFlangeF.position.set(lx, 3.82, -0.25);
    legColGroup.add(legFlangeF);

    const legFlangeR = legFlangeF.clone();
    legFlangeR.position.set(lx, 3.82, 0.65);
    legColGroup.add(legFlangeR);

    const footRunner = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.24, 5.80), MAT_ZEISS_ANTHRACITE);
    footRunner.position.set(lx, 0.24, 0.0); // Y: 0.12..0.36 u
    legColGroup.add(footRunner);

    [-2.55, 2.55].forEach((fz, fIdx) => {
      const footGrp = new THREE.Group();
      footGrp.name = `Foot_Leveling_Desk_${idx}_${fIdx}`;
      footGrp.position.set(lx, 0.0, fz);

      const deskPad = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.08, 20), MAT_RUBBER_EPDM);
      deskPad.position.y = 0.04;
      footGrp.add(deskPad);

      const deskSpindle = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.08, 14), MAT_316SS_POLISHED);
      deskSpindle.position.y = 0.10;
      footGrp.add(deskSpindle);

      legColGroup.add(footGrp);
    });

    consoleGroup.add(legColGroup);
  });

  // Under-desk steel structural cross-beam stretcher
  const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(6.90, 0.34, 0.24), MAT_ZEISS_ANTHRACITE);
  crossBeam.position.set(0.0, 6.82, 1.85);
  crossBeam.name = 'Body_ConsoleCrossBeam';
  consoleGroup.add(crossBeam);

  // 3. Under-Desk ZEISS SmartSEM Workstation PC (Body_WorkstationPC at (2.35, 2.35, 0.65))
  const pcTower = new THREE.Group();
  pcTower.name = 'Body_WorkstationPC';
  pcTower.position.set(2.35, 2.35, 0.65);

  const pcCase = new THREE.Mesh(new THREE.BoxGeometry(1.75, 4.30, 4.20), MAT_DARK_ANODIZED);
  pcTower.add(pcCase);

  // 4 rubber tower feet down to Y = 0.00 u (y_local = -2.35)
  [
    [-0.68, -1.75],
    [0.68, -1.75],
    [-0.68, 1.75],
    [0.68, 1.75],
  ].forEach(([px, pz], idx) => {
    const pcFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.20, 16), MAT_RUBBER_EPDM);
    pcFoot.position.set(px, -2.25, pz);
    pcFoot.name = `Foot_Leveling_PC_0${idx + 1}`;
    pcTower.add(pcFoot);
  });

  // Front Perforated Intake Bezel + Horizontal Grille Slats + LED Power Strip (facing -Z)
  const bezelFrame = new THREE.Mesh(new THREE.BoxGeometry(1.66, 4.18, 0.10), MAT_ZEISS_ANTHRACITE);
  bezelFrame.position.set(0, 0, -2.14);
  bezelFrame.name = 'Body_WorkstationBezel';
  pcTower.add(bezelFrame);

  for (let s = 0; s < 14; s++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.08, 0.04), MAT_316SS_BRUSHED);
    slat.position.set(0, -1.75 + s * 0.22, -2.19);
    pcTower.add(slat);
  }

  // Vertical cyan LED power status strip & front power button
  const ledStrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 1.80, 0.04),
    makeMat(0x00f3ff, { r: 0.15, m: 0.0, e: 0x00d4e8, ei: 1.5 })
  );
  ledStrip.position.set(0.68, 0.65, -2.20);
  ledStrip.name = 'Body_WorkstationLEDStrip';
  pcTower.add(ledStrip);

  const pcPowerBtn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.05, 18),
    makeMat(0x22c55e, { r: 0.2, m: 0.1, e: 0x16a34a, ei: 0.9 })
  );
  pcPowerBtn.rotation.x = Math.PI / 2;
  pcPowerBtn.position.set(0.68, 1.75, -2.20);
  pcPowerBtn.name = 'Btn_WorkstationPower';
  pcTower.add(pcPowerBtn);
  consoleGroup.add(pcTower);

  // --------------------------------------------------------------------------
  // 4. Central Dual-Arm Articulated VESA Stand (Zero Floating Screens!)
  // --------------------------------------------------------------------------
  const standGroup = new THREE.Group();
  standGroup.name = 'Body_VESAStandAssembly';

  const standBase = new THREE.Mesh(new THREE.BoxGeometry(2.20, 0.14, 1.45), MAT_DARK_ANODIZED);
  standBase.position.set(0.0, 7.67, 1.55); // Base sits flush on tabletop Y = 7.60 u
  standBase.name = 'Body_VESAStandBase';
  standGroup.add(standBase);

  const standCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.16, 24), MAT_316SS_BRUSHED);
  standCollar.position.set(0.0, 7.80, 1.65);
  standGroup.add(standCollar);

  [
    [-0.90, 1.00],
    [0.90, 1.00],
    [-0.90, 2.10],
    [0.90, 2.10],
  ].forEach(([bx, bz], idx) => {
    const scr = createHexSocketScrew(0.025, 0.08, `Fastener_HexM6_VESA_0${idx + 1}`);
    scr.position.set(bx, 7.74, bz);
    standGroup.add(scr);
  });

  const standPost = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 2.85, 24), MAT_316SS_BRUSHED);
  standPost.position.set(0.0, 9.05, 1.65);
  standPost.name = 'Body_VESAStandPost';
  standGroup.add(standPost);

  const postTopCap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 24), MAT_DARK_ANODIZED);
  postTopCap.position.set(0.0, 10.50, 1.65);
  standGroup.add(postTopCap);

  const hubClamp = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.40, 24), MAT_DARK_ANODIZED);
  hubClamp.position.set(0.0, 9.95, 1.65);
  hubClamp.name = 'Body_VESAHubClamp';
  standGroup.add(hubClamp);

  // Horizontal forged steel VESA cross-arm bar + 2 articulated elbow linkage arms
  const crossArmBar = new THREE.Mesh(new THREE.BoxGeometry(2.56, 0.24, 0.22), MAT_FRAME_STEEL);
  crossArmBar.position.set(0.0, 9.95, 1.56);
  crossArmBar.name = 'Body_VESACrossArmBar';
  standGroup.add(crossArmBar);

  [
    { side: 'Left', sign: 1, rotY: 0.08, monX: 2.15 },
    { side: 'Right', sign: -1, rotY: -0.08, monX: -2.15 },
  ].forEach(({ side, sign, rotY, monX }) => {
    const shoulderPt = [sign * 1.24, 9.95, 1.56];
    const elbowPt = [sign * 1.82, 9.95, 1.28];
    const vesaX = monX + 0.16 * Math.sin(rotY);
    const vesaZ = 0.85 + 0.16 * Math.cos(rotY);
    const vesaPt = [vesaX, 9.95, vesaZ];

    const shoulderPin = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.30, 20), MAT_DARK_ANODIZED);
    shoulderPin.position.set(...shoulderPt);
    standGroup.add(shoulderPin);

    addArticulatedLink(standGroup, shoulderPt, elbowPt, 0.20, 0.16, MAT_316SS_BRUSHED, `Body_VESAArmInner_${side}`);

    const elbowKnuckle = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.28, 20), MAT_DARK_ANODIZED);
    elbowKnuckle.position.set(...elbowPt);
    standGroup.add(elbowKnuckle);

    addArticulatedLink(standGroup, elbowPt, vesaPt, 0.18, 0.15, MAT_316SS_BRUSHED, `Body_VESAArmOuter_${side}`);

    const vesaKnuckle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.28, 20), MAT_DARK_ANODIZED);
    vesaKnuckle.position.set(...vesaPt);
    standGroup.add(vesaKnuckle);
  });

  consoleGroup.add(standGroup);

  // --------------------------------------------------------------------------
  // 5. Dual 27" 4K Monitors with Real 2.5 mm Carved Recessed Front Bezel Pockets
  //    Screen-Left (X_local = +2.15, World X = +6.65 u): UI_LCD_ChamberScope
  //    Screen-Right (X_local = -2.15, World X = +2.35 u): UI_LCD (Primary)
  // --------------------------------------------------------------------------
  function buildMonitorAssembly({
    groupName,
    xLocal,
    rotY,
    lcdName,
    lcdMat,
    glassName,
    vesaName,
  }) {
    const monGroup = new THREE.Group();
    monGroup.name = groupName;
    monGroup.position.set(xLocal, 9.95, 0.85);
    monGroup.rotation.y = rotY;

    // Backing housing strictly behind Z = -0.092 (Z: -0.092..+0.088)
    const backing = new THREE.Mesh(new THREE.BoxGeometry(3.68, 2.36, 0.18), MAT_DARK_ANODIZED);
    backing.position.set(0.0, 0.02, -0.002);
    backing.name = `${groupName}_Backing`;
    monGroup.add(backing);

    // Real 2.5 mm (0.025 u) extruded 4-sided front perimeter bezel pocket extending to Z = -0.116
    // Pocket depth spans Z = -0.092 to Z = -0.116 (0.024 u, center Z = -0.104) around LCD (3.46 x 2.08 at y=0.04)
    const bezDepth = 0.024;
    const bezZ = -0.104;

    const bezTop = new THREE.Mesh(new THREE.BoxGeometry(3.68, 0.12, bezDepth), MAT_ZEISS_ANTHRACITE);
    bezTop.position.set(0.0, 1.14, bezZ);
    monGroup.add(bezTop);

    const bezBot = new THREE.Mesh(new THREE.BoxGeometry(3.68, 0.16, bezDepth), MAT_ZEISS_ANTHRACITE);
    bezBot.position.set(0.0, -1.08, bezZ);
    monGroup.add(bezBot);

    const bezLeft = new THREE.Mesh(new THREE.BoxGeometry(0.11, 2.08, bezDepth), MAT_ZEISS_ANTHRACITE);
    bezLeft.position.set(1.785, 0.04, bezZ);
    monGroup.add(bezLeft);

    const bezRight = new THREE.Mesh(new THREE.BoxGeometry(0.11, 2.08, bezDepth), MAT_ZEISS_ANTHRACITE);
    bezRight.position.set(-1.785, 0.04, bezZ);
    monGroup.add(bezRight);

    // Status LED on bottom-right bezel chin
    const monLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, 0.024, 0.008),
      makeMat(0x22c55e, { r: 0.2, m: 0.1, e: 0x16a34a, ei: 1.0 })
    );
    monLed.position.set(-1.58, -1.08, -0.117);
    monGroup.add(monLed);

    // Rear VESA 100x100 mounting block + 4 corner M4 screws connecting into articulated VESA arm
    const vesaBlock = new THREE.Mesh(new THREE.BoxGeometry(1.00, 1.00, 0.10), MAT_FRAME_STEEL);
    vesaBlock.position.set(0.0, 0.0, 0.13);
    vesaBlock.name = vesaName;
    monGroup.add(vesaBlock);

    [
      [-0.38, 0.38],
      [0.38, 0.38],
      [-0.38, -0.38],
      [0.38, -0.38],
    ].forEach(([sx, sy], idx) => {
      const vScr = createHexSocketScrew(0.018, 0.05, `Fastener_HexM4_VESA_${groupName}_${idx + 1}`);
      vScr.rotation.x = Math.PI / 2;
      vScr.position.set(sx, sy, 0.18);
      monGroup.add(vScr);
    });

    // Dynamic LCD Quad seated cleanly inside pocket at Z = -0.094
    const lcdMesh = new THREE.Mesh(makeOperatorFacingQuadGeo(3.46, 2.08), lcdMat);
    lcdMesh.name = lcdName;
    lcdMesh.position.set(0.0, 0.04, -0.094);
    monGroup.add(lcdMesh);

    // Anti-reflective protective cover glass at Z = -0.104 (strictly inside pocket lip -0.116)
    const coverGlass = new THREE.Mesh(new THREE.BoxGeometry(3.46, 2.08, 0.008), MAT_DISPLAY_GLASS);
    coverGlass.name = glassName;
    coverGlass.position.set(0.0, 0.04, -0.104);
    monGroup.add(coverGlass);

    return { monGroup, lcdMesh };
  }

  // Screen-Left Monitor (x_local = +2.15, world X = +6.65 u): 768x480 IR Chamberscope + EDS
  const chamberscopeCanvas = createCanvas(768, 480);
  let chamberscopeTex;
  let scopeMat;
  if (chamberscopeCanvas) {
    chamberscopeTex = finalizeTexture(chamberscopeCanvas);
    scopeMat = new THREE.MeshBasicMaterial({ map: chamberscopeTex });
  } else {
    chamberscopeTex = new THREE.Texture();
    chamberscopeTex.flipY = false;
    chamberscopeTex.colorSpace = THREE.SRGBColorSpace;
    scopeMat = makeMat(0x05070a);
  }

  const { monGroup: screenLeftMonGroup, lcdMesh: rightLcdMesh } = buildMonitorAssembly({
    groupName: 'Body_MonitorLeftBezel',
    xLocal: 2.15,
    rotY: 0.08,
    lcdName: 'UI_LCD_ChamberScope',
    lcdMat: scopeMat,
    glassName: 'Glass_DisplayCover_Right',
    vesaName: 'Body_VESABlock_Left',
  });
  consoleGroup.add(screenLeftMonGroup);

  // Screen-Right Monitor (x_local = -2.15, world X = +2.35 u): Primary UI_LCD
  let primaryLcdMat;
  if (screenTex) {
    screenTex.flipY = false;
    screenTex.colorSpace = THREE.SRGBColorSpace;
    primaryLcdMat = new THREE.MeshBasicMaterial({ map: screenTex });
  } else {
    const standbyTex = makeStandbySmartSEMTexture();
    primaryLcdMat = standbyTex
      ? new THREE.MeshBasicMaterial({ map: standbyTex })
      : new THREE.MeshBasicMaterial({ color: 0x05070a });
  }

  const { monGroup: screenRightMonGroup, lcdMesh } = buildMonitorAssembly({
    groupName: 'Body_MonitorRightBezel',
    xLocal: -2.15,
    rotY: -0.08,
    lcdName: 'UI_LCD',
    lcdMat: primaryLcdMat,
    glassName: 'Glass_DisplayCover',
    vesaName: 'Body_VESABlock_Right',
  });
  consoleGroup.add(screenRightMonGroup);

  // --------------------------------------------------------------------------
  // 6. ZEISS Dual-Rotary Control Panel (Body_RotaryControlPanel)
  //    x_local = -2.05 (world X = +2.45 u), y = 7.66, z = -1.65
  // --------------------------------------------------------------------------
  const rotaryPanelGroup = new THREE.Group();
  rotaryPanelGroup.name = 'Body_RotaryControlPanel';
  rotaryPanelGroup.position.set(-2.05, 7.66, -1.65);

  const panelW = 3.90;
  const panelD = 2.16;

  // Flat bottom anthracite chassis skirt resting flush on desk tabletop (Y = 7.60..7.74)
  const panelBaseSkirt = new THREE.Mesh(new THREE.BoxGeometry(panelW, 0.14, panelD), MAT_ZEISS_ANTHRACITE);
  panelBaseSkirt.position.set(0, 0.01, 0);
  panelBaseSkirt.name = 'Body_RotaryPanelBase';
  rotaryPanelGroup.add(panelBaseSkirt);

  // Rear wedge riser keeping sloped upper shell solidly grounded
  const panelRearRiser = new THREE.Mesh(new THREE.BoxGeometry(panelW - 0.04, 0.24, panelD * 0.55), MAT_ZEISS_ANTHRACITE);
  panelRearRiser.position.set(0, 0.14, 0.44);
  rotaryPanelGroup.add(panelRearRiser);

  // Operator-facing sloped aluminum console deck (8 deg toward -Z operator)
  const rotaryDeckTilt = new THREE.Group();
  rotaryDeckTilt.name = 'Body_RotaryPanelDeck';
  rotaryDeckTilt.position.set(0, 0.22, 0);
  rotaryDeckTilt.rotation.x = -0.14;

  const panelTopPlate = new THREE.Mesh(new THREE.BoxGeometry(panelW, 0.16, panelD), MAT_ZEISS_WHITE);
  panelTopPlate.position.set(0, -0.08, 0); // Top surface at y_local = 0.00
  rotaryDeckTilt.add(panelTopPlate);

  // Chamfered anthracite perimeter trim on sloped deck
  const trimStripF = new THREE.Mesh(new THREE.BoxGeometry(panelW + 0.04, 0.04, 0.05), MAT_DARK_ANODIZED);
  trimStripF.position.set(0, -0.015, -panelD * 0.5);
  rotaryDeckTilt.add(trimStripF);

  // 8 Fluted 16-Rib Knurled Aluminum Encoders (Knob_*) >= 4 mm spacing (DIAG-018)
  const knobSpecs = [
    { name: 'Knob_Magnification', text: 'MAGNIFICATION', sub: '50x - 300kx', x: 1.44, z: 0.52 },
    { name: 'Knob_FocusCoarse', text: 'FOCUS COARSE', sub: 'WD 2 - 40mm', x: 0.48, z: 0.52 },
    { name: 'Knob_FocusFine', text: 'FOCUS FINE', sub: 'FINE nm', x: -0.48, z: 0.52 },
    { name: 'Knob_ProbeCurrent', text: 'PROBE CURRENT', sub: '3 - 20k pA', x: -1.44, z: 0.52 },
    { name: 'Knob_StigmatorX', text: 'STIGMATOR X', sub: '-100%..+100%', x: 1.44, z: -0.14 },
    { name: 'Knob_StigmatorY', text: 'STIGMATOR Y', sub: '-100%..+100%', x: 0.48, z: -0.14 },
    { name: 'Knob_Brightness', text: 'BRIGHTNESS', sub: '0 - 100%', x: -0.48, z: -0.14 },
    { name: 'Knob_Contrast', text: 'CONTRAST', sub: '0 - 100%', x: -1.44, z: -0.14 },
  ];

  // 8 Illuminated Tactile Pushbuttons (Btn_*)
  const buttonConfigs = [
    { name: 'Btn_Power', text: 'STANDBY', x: 1.54, z: -0.78, col: 0x22c55e, hex: '#22c55e' },
    { name: 'Btn_EHT', text: 'EHT ON', x: 1.10, z: -0.78, col: 0xef4444, hex: '#ef4444' },
    { name: 'Btn_VacVent', text: 'VAC / VENT', x: 0.66, z: -0.78, col: 0x38bdf8, hex: '#38bdf8' },
    { name: 'Btn_AutoFocus', text: 'AUTO WD', x: 0.22, z: -0.78, col: 0x0284c7, hex: '#38bdf8' },
    { name: 'Btn_AutoBC', text: 'AUTO B/C', x: -0.22, z: -0.78, col: 0x0284c7, hex: '#38bdf8' },
    { name: 'Btn_ScanSpeed', text: 'SCAN SPD', x: -0.66, z: -0.78, col: 0x6366f1, hex: '#818cf8' },
    { name: 'Btn_Freeze', text: 'FREEZE', x: -1.10, z: -0.78, col: 0xf59e0b, hex: '#fbbf24' },
    { name: 'Btn_Record', text: 'PHOTO', x: -1.54, z: -0.78, col: 0x10b981, hex: '#34d399' },
  ];

  // High-DPI Procedural Top Faceplate Silkscreen (1024 x 576, flipY = false, createTopDecalQuad)
  const faceW = 3.84;
  const faceD = 2.10;
  const panelCan = createCanvas(1024, 576);
  if (panelCan) {
    const pCtx = panelCan.getContext('2d');
    if (pCtx) {
      const CW = 1024;
      const CH = 576;
      const mapX = x => (0.5 - x / faceW) * CW;
      const mapY = z => (0.5 - z / faceD) * CH;

      // Brushed anthracite/titanium instrument faceplate
      pCtx.fillStyle = '#18212f';
      pCtx.fillRect(0, 0, CW, CH);
      pCtx.strokeStyle = '#334155';
      pCtx.lineWidth = 4;
      pCtx.strokeRect(8, 8, CW - 16, CH - 16);

      // Top header banner
      pCtx.fillStyle = '#0f172a';
      pCtx.fillRect(10, 10, CW - 20, 44);
      pCtx.fillStyle = '#38bdf8';
      pCtx.font = 'bold 20px "IBM Plex Mono", Inter, sans-serif';
      pCtx.textAlign = 'left';
      pCtx.textBaseline = 'middle';
      pCtx.fillText('ZEISS  ·  GEMINI II DUAL-ROTARY CONTROL PANEL', 26, 32);
      pCtx.fillStyle = '#94a3b8';
      pCtx.font = 'bold 15px "IBM Plex Mono", monospace';
      pCtx.textAlign = 'right';
      pCtx.fillText('DOC 349500-8038-000', CW - 26, 32);

      // Section divider hairlines
      pCtx.strokeStyle = '#38bdf8';
      pCtx.lineWidth = 2;
      pCtx.beginPath();
      pCtx.moveTo(10, 54);
      pCtx.lineTo(CW - 10, 54);
      pCtx.stroke();

      pCtx.strokeStyle = '#475569';
      pCtx.lineWidth = 2;
      pCtx.beginPath();
      pCtx.moveTo(26, 232);
      pCtx.lineTo(CW - 26, 232);
      pCtx.moveTo(26, 412);
      pCtx.lineTo(CW - 26, 412);
      pCtx.stroke();

      // Vertical subgroup divider between Optics & Video
      pCtx.beginPath();
      pCtx.moveTo(CW * 0.5, 66);
      pCtx.lineTo(CW * 0.5, 402);
      pCtx.stroke();

      // Calibrated 270 deg dial tick arcs & upright control legends around all 8 knobs
      knobSpecs.forEach(ks => {
        const cx = mapX(ks.x);
        const cy = mapY(ks.z);
        const tickInner = 64;
        const tickOuter = 78;
        const startAng = -Math.PI / 2 - (135 * Math.PI) / 180;
        const endAng = -Math.PI / 2 + (135 * Math.PI) / 180;

        // Subtle arc track
        pCtx.strokeStyle = '#334155';
        pCtx.lineWidth = 3;
        pCtx.beginPath();
        pCtx.arc(cx, cy, tickInner - 4, startAng, endAng);
        pCtx.stroke();

        // 11 radial calibration ticks (-135 deg to +135 deg, clockwise increase)
        for (let t = 0; t <= 10; t++) {
          const ang = startAng + (t / 10) * (endAng - startAng);
          const isMajor = t % 2 === 0;
          pCtx.strokeStyle = t === 10 ? '#38bdf8' : isMajor ? '#e2e8f0' : '#94a3b8';
          pCtx.lineWidth = isMajor ? 3 : 1.8;
          pCtx.beginPath();
          pCtx.moveTo(cx + Math.cos(ang) * tickInner, cy + Math.sin(ang) * tickInner);
          pCtx.lineTo(cx + Math.cos(ang) * (isMajor ? tickOuter + 4 : tickOuter), cy + Math.sin(ang) * (isMajor ? tickOuter + 4 : tickOuter));
          pCtx.stroke();
        }

        // Min (-) and Max (+) directional markers
        pCtx.fillStyle = '#94a3b8';
        pCtx.font = 'bold 14px "IBM Plex Mono", monospace';
        pCtx.textAlign = 'center';
        pCtx.fillText('-', cx - 56, cy + 54);
        pCtx.fillStyle = '#38bdf8';
        pCtx.fillText('+', cx + 56, cy + 54);

        // Upright control legend beneath knob skirt
        pCtx.fillStyle = '#f8fafc';
        pCtx.font = 'bold 16px "IBM Plex Mono", Inter, sans-serif';
        pCtx.fillText(ks.text, cx, cy + 68);
        pCtx.fillStyle = '#94a3b8';
        pCtx.font = '12px "IBM Plex Mono", monospace';
        pCtx.fillText(ks.sub, cx, cy + 84);
      });

      // Bottom command strip title
      pCtx.fillStyle = '#94a3b8';
      pCtx.font = 'bold 13px "IBM Plex Mono", monospace';
      pCtx.textAlign = 'left';
      pCtx.fillText('SYSTEM & ACQUISITION COMMANDS', 30, 428);
    }

    const panelSilkscreen = createTopDecalQuad(
      faceW,
      faceD,
      new THREE.MeshStandardMaterial({ map: finalizeTexture(panelCan), roughness: 0.36, metalness: 0.16 })
    );
    panelSilkscreen.position.set(0, 0.003, 0);
    panelSilkscreen.name = 'Body_RotaryPanelSilkscreen';
    rotaryDeckTilt.add(panelSilkscreen);
  }

  // Build 8 Fluted 16-Rib Knurled Aluminum Encoders (Knob_*)
  const knobMeshes = {};
  knobSpecs.forEach(ks => {
    const knobGrp = new THREE.Group();
    knobGrp.name = ks.name;
    knobGrp.position.set(ks.x, 0.004, ks.z);
    knobGrp.userData.interactiveType = 'knob';
    knobGrp.userData.controlId = ks.name;

    const dialSkirt = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.235, 0.055, 28), MAT_DARK_ANODIZED);
    dialSkirt.position.y = 0.028;
    knobGrp.add(dialSkirt);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.172, 0.178, 0.165, 32), MAT_316SS_POLISHED);
    barrel.position.y = 0.135;
    knobGrp.add(barrel);

    // 16 fluted grip ribs around barrel perimeter
    for (let r = 0; r < 16; r++) {
      const ang = (r / 16) * Math.PI * 2;
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.152, 0.022), MAT_316SS_BRUSHED);
      rib.position.set(Math.sin(ang) * 0.174, 0.135, Math.cos(ang) * 0.174);
      rib.rotation.y = ang;
      knobGrp.add(rib);
    }

    const topBevel = new THREE.Mesh(new THREE.CylinderGeometry(0.152, 0.172, 0.026, 28), MAT_316SS_POLISHED);
    topBevel.position.y = 0.230;
    knobGrp.add(topBevel);

    const topDish = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.012, 24), MAT_DARK_ANODIZED);
    topDish.position.y = 0.244;
    knobGrp.add(topDish);

    // Index pointer tick pointing toward 12 o'clock (+Z); CW rotation decreases rotation.y
    const indexTick = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.018, 0.115), MAT_BLUE_ANODIZED);
    indexTick.position.set(0, 0.254, 0.055);
    knobGrp.add(indexTick);

    rotaryDeckTilt.add(knobGrp);
    knobMeshes[ks.name] = knobGrp;
  });

  // Compatibility key alias for runtimes expecting Knob_FocusWD alongside Knob_FocusCoarse
  knobMeshes.Knob_FocusWD = knobMeshes.Knob_FocusCoarse;

  // Build 8 Illuminated Tactile Pushbuttons (Btn_*) with upward +Y createTopDecalQuad at y = +0.044
  const buttonMeshes = {};
  buttonConfigs.forEach(bc => {
    const btnBezel = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.032, 0.24), MAT_DARK_ANODIZED);
    btnBezel.position.set(bc.x, 0.016, bc.z);
    rotaryDeckTilt.add(btnBezel);

    const btnGrp = new THREE.Group();
    btnGrp.name = bc.name;
    btnGrp.position.set(bc.x, 0.046, bc.z);
    btnGrp.userData.interactiveType = 'button';
    btnGrp.userData.controlId = bc.name;

    const btnCap = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.08, 0.20),
      makeMat(bc.col, { r: 0.28, m: 0.18, e: bc.col, ei: 0.35 })
    );
    btnGrp.add(btnCap);

    const btnCan = createCanvas(256, 144);
    let capMat;
    if (btnCan) {
      const bCtx = btnCan.getContext('2d');
      if (bCtx) {
        bCtx.fillStyle = '#0f172a';
        bCtx.fillRect(0, 0, 256, 144);
        bCtx.strokeStyle = bc.hex;
        bCtx.lineWidth = 6;
        bCtx.strokeRect(4, 4, 248, 136);

        // Top illuminated LED status bar
        bCtx.fillStyle = bc.hex;
        bCtx.fillRect(22, 16, 212, 14);

        bCtx.fillStyle = '#f8fafc';
        bCtx.font = bc.text.length >= 9 ? 'bold 30px "IBM Plex Mono", Inter, sans-serif' : 'bold 34px "IBM Plex Mono", Inter, sans-serif';
        bCtx.textAlign = 'center';
        bCtx.textBaseline = 'middle';
        bCtx.fillText(bc.text, 128, 86);
      }
      capMat = new THREE.MeshBasicMaterial({ map: finalizeTexture(btnCan) });
    } else {
      capMat = makeMat(bc.col);
    }

    // Upward +Y normal via createTopDecalQuad (NO rotation.x = -Math.PI/2!), seated at y = +0.044
    const capDecal = createTopDecalQuad(0.29, 0.17, capMat);
    capDecal.position.y = 0.044;
    btnGrp.add(capDecal);

    rotaryDeckTilt.add(btnGrp);
    buttonMeshes[bc.name] = btnGrp;
  });

  rotaryPanelGroup.add(rotaryDeckTilt);
  consoleGroup.add(rotaryPanelGroup);

  // --------------------------------------------------------------------------
  // 7. ZEISS Dual-Joystick 5-Axis Stage Control Box (Body_DualJoystickBox)
  //    x_local = +1.85 (world X = +6.35 u), y = 7.66, z = -1.65
  // --------------------------------------------------------------------------
  const joystickBox = new THREE.Group();
  joystickBox.name = 'Body_DualJoystickBox';
  joystickBox.position.set(1.85, 7.66, -1.65);

  const joyBase = new THREE.Mesh(new THREE.BoxGeometry(2.70, 0.10, 1.86), MAT_ZEISS_ANTHRACITE);
  joyBase.position.set(0, -0.01, 0); // Bottom flush on Y = 7.60 u
  joystickBox.add(joyBase);

  const joyHousing = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.16, 1.84), MAT_ZEISS_WHITE);
  joyHousing.position.set(0, 0.10, 0); // Top surface at y_local = +0.18
  joystickBox.add(joyHousing);

  // Corner M3 bezel screws on joystick box
  [
    [-1.24, -0.82],
    [1.24, -0.82],
    [-1.24, 0.82],
    [1.24, 0.82],
  ].forEach(([sx, sz], idx) => {
    const scr = createHexSocketScrew(0.016, 0.04, `Fastener_HexM3_JoyBox_0${idx + 1}`);
    scr.position.set(sx, 0.182, sz);
    joystickBox.add(scr);
  });

  // High-DPI Silkscreened Top Bezel (createTopDecalQuad, flipY = false)
  const joyW = 2.58;
  const joyD = 1.74;
  const joyCan = createCanvas(768, 512);
  if (joyCan) {
    const jCtx = joyCan.getContext('2d');
    if (jCtx) {
      const JW = 768;
      const JH = 512;
      const mapJX = x => (0.5 - x / joyW) * JW;
      const mapJZ = z => (0.5 - z / joyD) * JH;

      jCtx.fillStyle = '#18212f';
      jCtx.fillRect(0, 0, JW, JH);
      jCtx.strokeStyle = '#38bdf8';
      jCtx.lineWidth = 4;
      jCtx.strokeRect(8, 8, JW - 16, JH - 16);

      // Header Banner
      jCtx.fillStyle = '#0f172a';
      jCtx.fillRect(10, 10, JW - 20, 46);
      jCtx.fillStyle = '#38bdf8';
      jCtx.font = 'bold 22px "IBM Plex Mono", Inter, sans-serif';
      jCtx.textAlign = 'center';
      jCtx.textBaseline = 'middle';
      jCtx.fillText('5-AXIS EUCENTRIC STAGE', JW * 0.5, 33);

      // Left Joystick Zone (+X, x = +0.74, z = +0.06): Z / TILT
      const lx = mapJX(0.74);
      const ly = mapJZ(0.06);
      jCtx.strokeStyle = '#475569';
      jCtx.lineWidth = 3;
      jCtx.beginPath();
      jCtx.arc(lx, ly, 76, 0, Math.PI * 2);
      jCtx.stroke();
      jCtx.beginPath();
      jCtx.moveTo(lx, ly - 92);
      jCtx.lineTo(lx, ly + 92);
      jCtx.moveTo(lx - 92, ly);
      jCtx.lineTo(lx + 92, ly);
      jCtx.stroke();
      jCtx.fillStyle = '#f8fafc';
      jCtx.font = 'bold 20px "IBM Plex Mono", monospace';
      jCtx.fillText('Z / TILT', lx, ly + 114);

      // Right Joystick Zone (-X, x = -0.74, z = +0.06): X / Y / ROT
      const rx = mapJX(-0.74);
      const ry = mapJZ(0.06);
      jCtx.strokeStyle = '#475569';
      jCtx.lineWidth = 3;
      jCtx.beginPath();
      jCtx.arc(rx, ry, 76, 0, Math.PI * 2);
      jCtx.stroke();
      jCtx.beginPath();
      jCtx.moveTo(rx, ry - 92);
      jCtx.lineTo(rx, ry + 92);
      jCtx.moveTo(rx - 92, ry);
      jCtx.lineTo(rx + 92, ry);
      jCtx.stroke();
      jCtx.fillStyle = '#f8fafc';
      jCtx.font = 'bold 20px "IBM Plex Mono", monospace';
      jCtx.fillText('X / Y / ROT', rx, ry + 114);

      // Top-Center Emergency Stop Label (x = 0, z = +0.52)
      const ex = mapJX(0.0);
      const ey = mapJZ(0.52);
      jCtx.fillStyle = '#facc15';
      jCtx.font = 'bold 16px "IBM Plex Mono", monospace';
      jCtx.fillText('EMERGENCY STOP', ex, ey + 68);

      // Bottom-Center Trackball Label (x = 0, z = -0.44)
      const tx = mapJX(0.0);
      const ty = mapJZ(-0.44);
      jCtx.fillStyle = '#94a3b8';
      jCtx.font = 'bold 15px "IBM Plex Mono", monospace';
      jCtx.fillText('TRACKBALL', tx, ty + 78);
    }

    const joySilkscreen = createTopDecalQuad(
      joyW,
      joyD,
      new THREE.MeshStandardMaterial({ map: finalizeTexture(joyCan), roughness: 0.36, metalness: 0.16 })
    );
    joySilkscreen.position.set(0, 0.183, 0);
    joySilkscreen.name = 'Body_JoystickBoxSilkscreen';
    joystickBox.add(joySilkscreen);
  }

  function makeJoystickAssembly(name, xPos, zPos, withTwistCrown = false) {
    const joy = new THREE.Group();
    joy.name = name;
    joy.position.set(xPos, 0.20, zPos);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.30, 0.04, 24), MAT_DARK_ANODIZED);
    joy.add(collar);

    // Convoluted EPDM rubber boot (3 ribs)
    for (let b = 0; b < 3; b++) {
      const rB = 0.24 - b * 0.04;
      const bootRing = new THREE.Mesh(new THREE.CylinderGeometry(rB * 0.85, rB, 0.07, 20), MAT_RUBBER_EPDM);
      bootRing.position.y = 0.05 + b * 0.06;
      joy.add(bootRing);
    }

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.48, 16), MAT_316SS_POLISHED);
    shaft.position.y = 0.34;
    joy.add(shaft);

    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.44, 20), MAT_DARK_ANODIZED);
    grip.position.y = 0.64;
    joy.add(grip);

    if (withTwistCrown) {
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.08, 20), MAT_BLUE_ANODIZED);
      crown.position.y = 0.82;
      joy.add(crown);
    } else {
      const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.06, 20), MAT_316SS_BRUSHED);
      topCap.position.y = 0.86;
      joy.add(topCap);
    }

    return joy;
  }

  const joyLeft = makeJoystickAssembly('Pivot_JoystickLeftZ', 0.74, 0.06, false);
  joystickBox.add(joyLeft);

  const joyRight = makeJoystickAssembly('Pivot_JoystickRightXYR', -0.74, 0.06, true);
  joystickBox.add(joyRight);

  // Precision Optical Stage Trackball (Trackball_StageNavigation)
  const trackball = new THREE.Group();
  trackball.name = 'Trackball_StageNavigation';
  trackball.position.set(0.0, 0.18, -0.44);

  const tbBezel = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 14, 28), MAT_DARK_ANODIZED);
  tbBezel.rotation.x = Math.PI / 2;
  tbBezel.position.y = 0.02;
  trackball.add(tbBezel);

  const tbBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 28, 22),
    makeMat(0x1e3a8a, { r: 0.08, m: 0.25 })
  );
  tbBall.position.y = 0.05;
  trackball.add(tbBall);
  joystickBox.add(trackball);

  // Red Mushroom Emergency Stage Break Button inside Bright Yellow Safety Collar (Btn_StageBreak)
  const safetyCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.23, 0.26, 0.08, 24),
    MAT_YELLOW_SAFETY
  );
  safetyCollar.position.set(0.0, 0.22, 0.52);
  safetyCollar.name = 'Body_EmergencySafetyCollar';
  joystickBox.add(safetyCollar);

  const btnBreak = new THREE.Group();
  btnBreak.name = 'Btn_StageBreak';
  btnBreak.position.set(0.0, 0.26, 0.52);
  btnBreak.userData.interactiveType = 'button';
  btnBreak.userData.controlId = 'Btn_StageBreak';

  const breakStem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16), MAT_316SS_POLISHED);
  breakStem.position.y = 0.02;
  btnBreak.add(breakStem);

  const breakMushroom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.165, 0.125, 0.09, 24),
    makeMat(0xef4444, { r: 0.22, m: 0.15, e: 0xdc2626, ei: 0.42 })
  );
  breakMushroom.position.y = 0.075;
  btnBreak.add(breakMushroom);

  const breakCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.135, 0.165, 0.025, 24),
    MAT_RED_ANODIZED
  );
  breakCap.position.y = 0.132;
  btnBreak.add(breakCap);

  const stopCan = createCanvas(128, 128);
  if (stopCan) {
    const sCtx = stopCan.getContext('2d');
    if (sCtx) {
      sCtx.fillStyle = '#dc2626';
      sCtx.fillRect(0, 0, 128, 128);
      sCtx.strokeStyle = '#f8fafc';
      sCtx.lineWidth = 6;
      sCtx.beginPath();
      sCtx.arc(64, 64, 54, 0, Math.PI * 2);
      sCtx.stroke();
      sCtx.fillStyle = '#ffffff';
      sCtx.font = 'bold 28px "IBM Plex Mono", sans-serif';
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.fillText('STOP', 64, 66);
    }
    const stopQuad = createTopDecalQuad(0.22, 0.22, new THREE.MeshBasicMaterial({ map: finalizeTexture(stopCan) }));
    stopQuad.position.y = 0.148;
    btnBreak.add(stopQuad);
  }
  joystickBox.add(btnBreak);

  consoleGroup.add(joystickBox);

  // --------------------------------------------------------------------------
  // 8. Point-to-Point DisplayPort, USB & SEM Bus Harnesses
  // --------------------------------------------------------------------------
  consoleGroup.add(
    makeWiringHarness(
      [
        [2.15, 9.75, 1.05],
        [0.12, 9.55, 1.72],
        [0.08, 7.62, 2.55],
        [2.10, 4.45, 2.15],
      ],
      0.030,
      MAT_RUBBER_EPDM,
      'Body_Wire_DisplayPortLeft'
    )
  );
  consoleGroup.add(
    makeWiringHarness(
      [
        [-2.15, 9.75, 1.05],
        [-0.12, 9.55, 1.72],
        [-0.08, 7.62, 2.55],
        [2.00, 4.45, 2.05],
      ],
      0.030,
      MAT_RUBBER_EPDM,
      'Body_Wire_DisplayPortRight'
    )
  );
  consoleGroup.add(
    makeWiringHarness(
      [
        [-2.05, 7.60, -0.58],
        [-0.85, 7.38, 1.45],
        [1.85, 4.25, 1.45],
        [-6.65, 4.35, -1.55],
      ],
      0.036,
      MAT_RUBBER_EPDM,
      'Body_Wire_DataBus'
    )
  );

  const allButtons = {
    ...buttonMeshes,
    Btn_StageBreak: btnBreak,
  };

  return {
    consoleGroup,
    standGroup,
    lcdMesh,
    rightLcdMesh,
    chamberscopeCanvas,
    chamberscopeTex,
    knobMeshes,
    buttonMeshes,
    allButtons,
    knobSpecs,
    btnBreak,
    joyLeft,
    joyRight,
    trackball,
  };
}

// ----------------------------------------------------------------------------
// 3. Secondary Monitor Renderer: IR Chamberscope + 0-10 keV SDD EDS + UHV Telemetry
// ----------------------------------------------------------------------------
export function renderChamberScopeAndEDSCanvas(canvas, tex, state = {}) {
  if (!canvas || !tex) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width || 768;
  const H = canvas.height || 480;

  const isPowered = state.isPluggedIn !== false && state.powerSwitch !== false;
  if (!isPowered) {
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, W, H);
    tex.needsUpdate = true;
    return;
  }

  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, W, H);

  // Header Bar (y: 0..42)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, 42);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 42);
  ctx.lineTo(W, 42);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 17px "IBM Plex Mono", Inter, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('ZEISS SmartSEM · IR CHAMBERSCOPE + SDD EDS', 18, 22);

  const statusText = state.beamOn ? 'EHT BEAM ACTIVE' : (state.chamberVacuumMbar > 1 ? 'CHAMBER VENTED' : 'EHT STANDBY');
  ctx.fillStyle = state.beamOn ? '#14532d' : '#451a03';
  ctx.fillRect(584, 9, 166, 24);
  ctx.strokeStyle = state.beamOn ? '#22c55e' : '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(584, 9, 166, 24);
  ctx.fillStyle = state.beamOn ? '#4ade80' : '#fbbf24';
  ctx.font = 'bold 12px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(statusText, 667, 22);
  ctx.textAlign = 'left';

  // --------------------------------------------------------------------------
  // Left Pane (x: 16..372, y: 54..332): Live IR CCD Chamberscope
  // --------------------------------------------------------------------------
  ctx.fillStyle = '#05070a';
  ctx.fillRect(16, 54, 356, 278);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 54, 356, 278);

  // Subtle horizontal IR scanline backdrop
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
  ctx.lineWidth = 1;
  for (let sy = 64; sy < 326; sy += 12) {
    ctx.beginPath();
    ctx.moveTo(18, sy);
    ctx.lineTo(370, sy);
    ctx.stroke();
  }

  // Gemini II Objective Polepiece Cone
  const cxScope = 194;
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(cxScope - 58, 56);
  ctx.lineTo(cxScope + 58, 56);
  ctx.lineTo(cxScope + 24, 126);
  ctx.lineTo(cxScope - 24, 126);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // SDD EDS collimator snout (left) & SE2 collector cage (right)
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(18, 124);
  ctx.lineTo(78, 148);
  ctx.lineTo(72, 164);
  ctx.lineTo(18, 146);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.strokeRect(306, 138, 44, 24);

  const wdMm = Number.isFinite(state.wdMm) ? state.wdMm : 8.5;
  const stageY = Math.min(280, Math.max(148, 134 + wdMm * 6.0));
  const stageX = Math.min(295, Math.max(92, cxScope + (state.stageX || 0) * 1.15));
  const tiltRad = ((state.stageTilt || 0) * Math.PI) / 180;

  // Animated Cyan EHT Electron Beam Ray when beamOn
  if (state.beamOn) {
    const pulse = 0.72 + 0.25 * Math.sin((typeof performance !== 'undefined' ? performance.now() : 0) * 0.01);
    ctx.strokeStyle = `rgba(0, 243, 255, ${pulse.toFixed(2)})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cxScope, 126);
    ctx.lineTo(stageX, stageY);
    ctx.stroke();

    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cxScope, 126);
    ctx.lineTo(stageX, stageY);
    ctx.stroke();
  }

  // Dynamic Eucentric Specimen Carousel & Pin Stub (respects stage X, Y, WD, Tilt)
  ctx.save();
  ctx.translate(stageX, stageY);
  ctx.rotate(tiltRad * 0.45);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-58, 8, 116, 18);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-38, 26, 76, 12);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(-16, 0, 32, 8);
  ctx.restore();

  // Left Pane Header & Telemetry Footer
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 13px "IBM Plex Mono", monospace';
  ctx.fillText(`IR CCD · WD = ${wdMm.toFixed(1)} mm`, 26, 74);

  ctx.fillStyle = '#64748b';
  ctx.font = '11px "IBM Plex Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('850nm IR', 362, 74);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#22c55e';
  ctx.font = '12px "IBM Plex Mono", monospace';
  ctx.fillText(
    `X:${(state.stageX || 0).toFixed(1)}  Y:${(state.stageY || 0).toFixed(1)}  T:${(state.stageTilt || 0).toFixed(0)}°`,
    26,
    318
  );

  // --------------------------------------------------------------------------
  // Right Pane (x: 392..752, y: 54..332): 0-10 keV SDD EDS X-Ray Spectrum
  // --------------------------------------------------------------------------
  ctx.fillStyle = '#05070a';
  ctx.fillRect(392, 54, 360, 278);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.strokeRect(392, 54, 360, 278);

  const ehtKv = Number.isFinite(state.ehtKv) ? state.ehtKv : 15.0;
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "IBM Plex Mono", monospace';
  ctx.fillText(`100mm² SDD EDS (0-10 keV · EHT ${ehtKv.toFixed(1)}kV)`, 404, 74);

  const px0 = 414;
  const pxW = 322;
  const pyBase = 300;
  const pyTop = 94;
  const plotH = pyBase - pyTop;

  // Gridlines (0, 2, 4, 6, 8, 10 keV)
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
  ctx.lineWidth = 1;
  ctx.font = '11px "IBM Plex Mono", monospace';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'center';
  for (let kev = 0; kev <= 10; kev += 2) {
    const gx = px0 + (kev / 10.0) * pxW;
    ctx.beginPath();
    ctx.moveTo(gx, pyTop);
    ctx.lineTo(gx, pyBase);
    ctx.stroke();
    ctx.fillText(`${kev}`, gx, 318);
  }
  ctx.textAlign = 'right';
  ctx.fillText('keV', 744, 318);
  ctx.textAlign = 'left';

  for (let row = 0; row <= 3; row++) {
    const gy = pyBase - (row / 3) * plotH;
    ctx.beginPath();
    ctx.moveTo(px0, gy);
    ctx.lineTo(px0 + pxW, gy);
    ctx.stroke();
  }

  // Overvoltage excitation threshold line at 0.88 * ehtKv
  const exciteCutoffKev = 0.88 * ehtKv;
  if (exciteCutoffKev > 0.2 && exciteCutoffKev < 9.9) {
    const cutX = px0 + (exciteCutoffKev / 10.0) * pxW;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cutX, pyTop);
    ctx.lineTo(cutX, pyBase);
    ctx.stroke();
    ctx.restore();
  }

  // Build dynamic EDS peaks (attenuated if peak.keV > 0.88 * ehtKv; dynamic Au/Pd if sputterCoated)
  const rawPeaks = state.edsPeaks
    ? state.edsPeaks.map(p => ({ ...p }))
    : [
        { keV: 0.28, el: 'C', cps: 420 },
        { keV: 0.52, el: 'O', cps: 680 },
        { keV: 1.49, el: 'Al', cps: 920 },
        { keV: 1.74, el: 'Si', cps: 1150 },
        { keV: 8.04, el: 'Cu', cps: 540 },
      ];

  if (state.sputterCoated === true) {
    if (!rawPeaks.some(p => p.el === 'Au')) rawPeaks.push({ keV: 2.12, el: 'Au', cps: 1020 });
    if (!rawPeaks.some(p => p.el === 'Pd')) rawPeaks.push({ keV: 2.84, el: 'Pd', cps: 480 });
  } else if (state.sputterCoated === false) {
    rawPeaks.forEach(p => {
      if (p.el === 'Au' || p.el === 'Pd') p.cps *= 0.05;
    });
  }

  const effPeaks = rawPeaks.map(pk => {
    let atten = 1.0;
    if (!state.beamOn) {
      atten = 0.04;
    } else if (pk.keV > exciteCutoffKev) {
      atten = pk.keV > ehtKv ? 0.03 : 0.16;
    }
    return { ...pk, effCps: pk.cps * atten };
  });

  // Bremsstrahlung + Gaussian Characteristic X-Ray Spectrum Curve
  const maxYGain = 1550;
  ctx.beginPath();
  ctx.moveTo(px0, pyBase);
  for (let px = 0; px <= pxW; px++) {
    const kev = (px / pxW) * 10.0;
    let yVal = state.beamOn && kev < ehtKv ? 10 * Math.exp(-kev * 0.24) * (1 - kev / Math.max(0.5, ehtKv)) : 2;
    effPeaks.forEach(pk => {
      const d = (kev - pk.keV) / 0.11;
      yVal += (pk.effCps / maxYGain) * (plotH - 28) * Math.exp(-0.5 * d * d);
    });
    const sy = pyBase - Math.min(plotH - 18, Math.max(0, yVal));
    ctx.lineTo(px0 + px, sy);
  }
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.lineTo(px0 + pxW, pyBase);
  ctx.closePath();
  ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
  ctx.fill();

  // Crisp non-overlapping peak labels with automatic collision staggering
  const sortedLabels = effPeaks
    .filter(pk => pk.effCps > 60 && pk.keV <= 9.8)
    .sort((a, b) => a.keV - b.keV);

  const placedLabels = [];
  ctx.font = 'bold 11px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  sortedLabels.forEach(pk => {
    const lx = px0 + (pk.keV / 10.0) * pxW;
    const peakHeightPx = Math.min(plotH - 18, (pk.effCps / maxYGain) * (plotH - 28));
    const tipY = pyBase - peakHeightPx;
    let labelY = Math.max(pyTop + 14, tipY - 12);

    // Avoid overlap with previously placed labels
    for (let tries = 0; tries < 5; tries++) {
      const collides = placedLabels.some(pl => Math.abs(pl.x - lx) < 28 && Math.abs(pl.y - labelY) < 14);
      if (!collides) break;
      labelY = Math.max(pyTop + 14, labelY - 15);
    }
    placedLabels.push({ x: lx, y: labelY });

    ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lx, tipY - 2);
    ctx.lineTo(lx, labelY + 5);
    ctx.stroke();

    ctx.fillStyle = pk.keV > exciteCutoffKev ? '#94a3b8' : '#fef08a';
    ctx.fillText(pk.el, lx, labelY);
  });
  ctx.textAlign = 'left';

  // --------------------------------------------------------------------------
  // Bottom Telemetry Bar (y: 344..464): Cleanly Spaced Two Columns (x=28 & x=405)
  // --------------------------------------------------------------------------
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(16, 344, 736, 120);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 344, 736, 120);

  const vacMbar = Number.isFinite(state.chamberVacuumMbar) ? state.chamberVacuumMbar : 1.4e-6;
  const vacPa = vacMbar * 100.0;
  const turboRpm = Number.isFinite(state.turboRpm)
    ? state.turboRpm
    : (vacMbar < 1.0 ? 90000 : 0);
  const turboPct = Math.round((turboRpm / 90000) * 100);
  const boosterKv = Number.isFinite(state.boosterKv) ? state.boosterKv : 8.0;
  const objTempC = Number.isFinite(state.objTempC) ? state.objTempC : 20.5;

  ctx.font = 'bold 14px "IBM Plex Mono", monospace';
  ctx.textBaseline = 'middle';

  // Left Column (x = 28)
  ctx.fillStyle = vacMbar <= 1e-4 ? '#4ade80' : '#fbbf24';
  ctx.fillText(`CHAMBER VAC: ${vacPa.toExponential(2)} Pa (${vacMbar.toExponential(2)} mbar)`, 28, 374);

  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`TURBO PUMP : ${turboRpm.toLocaleString()} RPM (${turboPct}% NOMINAL)`, 28, 408);

  ctx.fillStyle = '#38bdf8';
  ctx.fillText('FEG IGP UHV: 2.00e-8 Pa (2.00e-10 mbar · ON)', 28, 442);

  // Right Column (x = 405)
  ctx.fillStyle = state.beamOn ? '#22c55e' : '#f59e0b';
  ctx.fillText(`EHT BEAM   : ${state.beamOn ? `${ehtKv.toFixed(2)} kV ACTIVE` : 'STANDBY OFF'}`, 405, 374);

  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`BOOSTER    : +${boosterKv.toFixed(2)} kV LINER ACTIVE`, 405, 408);

  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`PT100 OBJ  : ${objTempC.toFixed(1)} °C (CHILLER OK)`, 405, 442);

  tex.needsUpdate = true;
}
