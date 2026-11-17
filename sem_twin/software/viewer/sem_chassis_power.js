/**
 * sem_chassis_power.js — Structural Plinth, Welded Spaceframe, Continuous Pneumatic
 * Vibration Isolators, Carved Recessed SREdesigns Pocket, Hinged Service Bay Door,
 * and Hospital-Grade Power Continuity Assembly (Duplex Receptacle, NEMA Plug & SJTOW Cord)
 *
 * Coordinate Convention: 1 unit = 100 mm = 0.1 m | +Y up | Front = -Z | screenRight = -X | screenLeft = +X
 */

import * as THREE from 'three';
import {
  makeMat,
  createCanvas,
  MAT_ZEISS_WHITE,
  MAT_ZEISS_ANTHRACITE,
  MAT_ZEISS_BLUE,
  MAT_FRAME_STEEL,
  MAT_316SS_POLISHED,
  MAT_316SS_BRUSHED,
  MAT_DARK_ANODIZED,
  MAT_BLUE_ANODIZED,
  MAT_RED_ANODIZED,
  MAT_YELLOW_SAFETY,
  MAT_BRASS_GOLD,
  MAT_RUBBER_EPDM,
  MAT_CAST_IRON,
  createDecalQuad,
  createHexSocketScrew,
  makeSREdesignsBadge,
} from './sem_materials.js';

// ----------------------------------------------------------------------------
// Plinth, Welded Spaceframe, Pneumatic Isolators & Service Bay Door
// ----------------------------------------------------------------------------
export function buildPlinthAndChassis() {
  const chassisGroup = new THREE.Group();
  chassisGroup.name = 'Body_Chassis';

  // 1. Heavy Cast-Iron & Welded Steel Plinth (8.00 x 0.70 x 10.20 u)
  // World bounds: X = -7.80..+0.20, Y = 0.25..0.95, Z = -5.10..+5.10
  // Carved 2.0 mm (0.020 u) recessed pocket on fixed front plinth rail at X = -1.65, Y = 0.60, Z = -5.10
  const plinthGroup = new THREE.Group();
  plinthGroup.name = 'Body_ChassisPlinth';
  plinthGroup.position.set(-3.80, 0.60, 0.0);

  // Main rear cast-iron plinth block starting at Z_local = -5.080 (pocket back floor) to +5.100
  const plinthRearCore = new THREE.Mesh(
    new THREE.BoxGeometry(8.00, 0.70, 10.18),
    MAT_CAST_IRON
  );
  plinthRearCore.position.set(0.0, 0.0, 0.01);
  plinthRearCore.name = 'Body_PlinthCore';
  plinthGroup.add(plinthRearCore);

  // Extruded front skin (Z_local: -5.100 .. -5.078) with carved 1.168 x 0.368 pocket hole at X_local = +2.15 (X = -1.65)
  const frontSkinShape = new THREE.Shape();
  frontSkinShape.moveTo(-4.00, -0.35);
  frontSkinShape.lineTo(4.00, -0.35);
  frontSkinShape.lineTo(4.00, 0.35);
  frontSkinShape.lineTo(-4.00, 0.35);
  frontSkinShape.closePath();

  const pocketLocalX = 2.15; // -3.80 + 2.15 = -1.65 world
  const pocketHalfW = 0.584; // 1.168 wide for crisp 1.160 badge bezel fit
  const pocketHalfH = 0.184; // 0.368 tall for crisp 0.360 badge bezel fit
  const pocketHole = new THREE.Path();
  pocketHole.moveTo(pocketLocalX - pocketHalfW, -pocketHalfH);
  pocketHole.lineTo(pocketLocalX - pocketHalfW, pocketHalfH);
  pocketHole.lineTo(pocketLocalX + pocketHalfW, pocketHalfH);
  pocketHole.lineTo(pocketLocalX + pocketHalfW, -pocketHalfH);
  pocketHole.closePath();
  frontSkinShape.holes.push(pocketHole);

  const frontSkinGeo = new THREE.ExtrudeGeometry(frontSkinShape, {
    depth: 0.022,
    bevelEnabled: false,
  });
  const frontSkinMesh = new THREE.Mesh(frontSkinGeo, MAT_CAST_IRON);
  frontSkinMesh.position.set(0.0, 0.0, -5.100);
  frontSkinMesh.name = 'Body_PlinthCarvedFrontRail';
  plinthGroup.add(frontSkinMesh);

  // Subtle side-skirt structural mounting bolts along plinth flanks
  [-4.20, 0.0, 4.20].forEach((bz, idx) => {
    const boltL = createHexSocketScrew(0.026, 0.05, `Fastener_HexM8_PlinthL_0${idx + 1}`);
    boltL.rotation.z = Math.PI / 2;
    boltL.position.set(-4.00, 0.0, bz);
    plinthGroup.add(boltL);

    const boltR = createHexSocketScrew(0.026, 0.05, `Fastener_HexM8_PlinthR_0${idx + 1}`);
    boltR.rotation.z = -Math.PI / 2;
    boltR.position.set(4.00, 0.0, bz);
    plinthGroup.add(boltR);
  });

  chassisGroup.add(plinthGroup);

  // Stationary Official SREdesigns Badge seated flush inside the 2.0 mm carved front plinth pocket
  // Height = 0.36 / 0.70 = 51.4% <= 85% vertical containment; NOT mounted on Pivot_DoorServiceBay
  const sreBadge = makeSREdesignsBadge();
  sreBadge.position.set(-1.65, 0.60, -5.098);
  chassisGroup.add(sreBadge);

  // 2. Four Literal Leveling Feet resting flush at floor datum Y = 0.00 u (within plinth footprint)
  const footCoords = [
    ['Foot_Leveling_FL', -7.50, -4.80],
    ['Foot_Leveling_FR', -0.10, -4.80],
    ['Foot_Leveling_RL', -7.50, 4.80],
    ['Foot_Leveling_RR', -0.10, 4.80],
  ];
  footCoords.forEach(([footName, fx, fz]) => {
    const footGrp = new THREE.Group();
    footGrp.name = footName;
    footGrp.position.set(fx, 0.0, fz);

    // Vulcanized EPDM vibration-damping pad resting flush at Y = 0.00 (Y: 0.00..0.08)
    const rubberPad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.29, 0.08, 24),
      MAT_RUBBER_EPDM
    );
    rubberPad.position.y = 0.04;
    footGrp.add(rubberPad);

    // Stainless load cup cradling pad (Y: 0.08..0.12)
    const steelCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.27, 0.04, 24),
      MAT_316SS_BRUSHED
    );
    steelCup.position.y = 0.10;
    footGrp.add(steelCup);

    // Knurled stainless steel adjustment collar with genuine 3D radial ribs (Y: 0.12..0.19)
    const knurlCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.07, 24),
      MAT_316SS_BRUSHED
    );
    knurlCollar.position.y = 0.155;
    footGrp.add(knurlCollar);

    for (let k = 0; k < 16; k++) {
      const ang = (k / 16) * Math.PI * 2;
      const knurlRib = new THREE.Mesh(
        new THREE.BoxGeometry(0.016, 0.064, 0.018),
        MAT_316SS_POLISHED
      );
      knurlRib.position.set(Math.cos(ang) * 0.222, 0.155, Math.sin(ang) * 0.222);
      knurlRib.rotation.y = -ang;
      footGrp.add(knurlRib);
    }

    // M20 hex jam locknut (Y: 0.19..0.23)
    const hexLocknut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.04, 6),
      MAT_316SS_POLISHED
    );
    hexLocknut.position.y = 0.21;
    footGrp.add(hexLocknut);

    // Threaded M20 stud engaging solidly into plinth bottom at Y = 0.25 (Y: 0.19..0.27)
    const stud = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16),
      MAT_316SS_POLISHED
    );
    stud.position.y = 0.23;
    footGrp.add(stud);

    chassisGroup.add(footGrp);
  });

  // 3. Four Continuous Pneumatic Air-Spring Isolation Columns (Y = 0.95 .. 6.95, zero gap)
  const isoCoords = [
    [-7.05, -3.85],
    [-0.55, -3.85],
    [-7.05, 3.85],
    [-0.55, 3.85],
  ];
  isoCoords.forEach(([ix, iz], idx) => {
    const isoGrp = new THREE.Group();
    isoGrp.name = `Body_PneumaticIsolator_0${idx + 1}`;
    isoGrp.position.set(ix, 0.95, iz);

    // Base mounting cup bolted flush to plinth top Y = 0.95 (local Y: 0.00..0.14)
    const baseFlange = new THREE.Mesh(
      new THREE.CylinderGeometry(0.54, 0.56, 0.14, 28),
      MAT_316SS_BRUSHED
    );
    baseFlange.position.y = 0.07;
    isoGrp.add(baseFlange);

    for (let b = 0; b < 4; b++) {
      const ang = (b / 4) * Math.PI * 2 + Math.PI / 4;
      const baseBolt = createHexSocketScrew(
        0.022,
        0.05,
        `Fastener_HexM8_IsoBase_0${idx + 1}_${b + 1}`
      );
      baseBolt.position.set(Math.cos(ang) * 0.45, 0.14, Math.sin(ang) * 0.45);
      isoGrp.add(baseBolt);
    }

    // Lower heavy-wall steel damping cylinder / air reservoir (local Y: 0.14..3.44)
    const lowerCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.48, 3.30, 28),
      MAT_ZEISS_ANTHRACITE
    );
    lowerCylinder.position.y = 1.79;
    isoGrp.add(lowerCylinder);

    // Machined stainless gland collar at top of reservoir (local Y: 3.38..3.52)
    const collarRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.50, 0.50, 0.14, 28),
      MAT_316SS_BRUSHED
    );
    collarRing.position.y = 3.45;
    isoGrp.add(collarRing);

    // Brass pneumatic supply bulkhead fitting on inward side of air reservoir
    const airFitting = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.18, 6),
      MAT_BRASS_GOLD
    );
    airFitting.rotation.z = Math.PI / 2;
    airFitting.position.set(ix < -3.80 ? 0.50 : -0.50, 2.65, 0.0);
    isoGrp.add(airFitting);

    // Continuous inner stainless guide shaft through bellows zone (local Y: 3.44..4.68)
    const bellowsCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 1.24, 24),
      MAT_316SS_POLISHED
    );
    bellowsCore.position.y = 4.06;
    isoGrp.add(bellowsCore);

    // Multi-rib EPDM rolling-diaphragm rubber air-spring bellows (3 ribs + 2 girdle rings)
    [3.68, 4.02, 4.36].forEach(ry => {
      const bellowRib = new THREE.Mesh(
        new THREE.TorusGeometry(0.38, 0.125, 16, 28),
        MAT_RUBBER_EPDM
      );
      bellowRib.rotation.x = Math.PI / 2;
      bellowRib.position.y = ry;
      isoGrp.add(bellowRib);
    });
    [3.85, 4.19].forEach(gy => {
      const girdleRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.37, 0.032, 12, 28),
        MAT_316SS_POLISHED
      );
      girdleRing.rotation.x = Math.PI / 2;
      girdleRing.position.y = gy;
      isoGrp.add(girdleRing);
    });

    // Pneumatic servo leveling sensor ring (local Y: 4.52..4.66)
    const sensorCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.44, 0.14, 24),
      MAT_DARK_ANODIZED
    );
    sensorCollar.position.y = 4.59;
    isoGrp.add(sensorCollar);

    // Polished 316L upper isolation piston rod (local Y: 4.66..5.82)
    const upperPiston = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.40, 1.16, 28),
      MAT_316SS_POLISHED
    );
    upperPiston.position.y = 5.24;
    isoGrp.add(upperPiston);

    // Top mounting flange bolted flush to isolated deck underside at Y = 6.95 (local Y: 5.82..6.00)
    const topFlange = new THREE.Mesh(
      new THREE.CylinderGeometry(0.54, 0.54, 0.18, 28),
      MAT_316SS_BRUSHED
    );
    topFlange.position.y = 5.91;
    isoGrp.add(topFlange);

    for (let b = 0; b < 4; b++) {
      const ang = (b / 4) * Math.PI * 2 + Math.PI / 4;
      const topBolt = createHexSocketScrew(
        0.022,
        0.05,
        `Fastener_HexM8_IsoTop_0${idx + 1}_${b + 1}`
      );
      topBolt.rotation.x = Math.PI;
      topBolt.position.set(Math.cos(ang) * 0.45, 5.82, Math.sin(ang) * 0.45);
      isoGrp.add(topBolt);
    }

    chassisGroup.add(isoGrp);
  });

  // 4. Upper Vibration-Isolated Granite/Steel Deck (8.00 x 0.60 x 10.20 at (-3.80, 7.25, 0.0), Y = 6.95..7.55)
  const isolatedDeck = new THREE.Mesh(
    new THREE.BoxGeometry(8.00, 0.60, 10.20),
    MAT_ZEISS_ANTHRACITE
  );
  isolatedDeck.position.set(-3.80, 7.25, 0.0);
  isolatedDeck.name = 'Body_ChassisIsolatedDeck';
  chassisGroup.add(isolatedDeck);

  // 5. Welded Structural Steel Spaceframe Posts & Longitudinal Rails (Body_ChassisFrame)
  const frameGroup = new THREE.Group();
  frameGroup.name = 'Body_ChassisFrame';

  const postPositions = [
    [-7.54, -4.86],
    [-0.06, -4.86],
    [-7.54, 4.84],
    [-0.06, 4.84],
  ];
  postPositions.forEach(([px, pz], idx) => {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 6.00, 0.18),
      MAT_FRAME_STEEL
    );
    post.position.set(px, 3.95, pz);
    post.name = `Body_FramePost_0${idx + 1}`;
    frameGroup.add(post);

    // Welded corner gusset flanges at top & bottom of each post
    [1.04, 6.86].forEach((gy, gIdx) => {
      const gusset = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.18, 0.24),
        MAT_316SS_BRUSHED
      );
      gusset.position.set(px, gy, pz);
      gusset.name = `Body_FrameGusset_0${idx + 1}_${gIdx + 1}`;
      frameGroup.add(gusset);
    });
  });

  // Top and bottom longitudinal spaceframe beams connecting front & rear corner posts
  [-7.54, -0.06].forEach((rx, sIdx) => {
    [1.03, 6.87].forEach((ry, hIdx) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.16, 9.52),
        MAT_FRAME_STEEL
      );
      rail.position.set(rx, ry, -0.01);
      rail.name = `Body_FrameRail_${sIdx}_${hIdx}`;
      frameGroup.add(rail);
    });
  });

  // Rear upper horizontal crossbeam above the bulkhead cutout
  const rearCrossBeam = new THREE.Mesh(
    new THREE.BoxGeometry(7.30, 0.18, 0.18),
    MAT_FRAME_STEEL
  );
  rearCrossBeam.position.set(-3.80, 6.86, 4.84);
  rearCrossBeam.name = 'Body_FrameRearCrossbeam';
  frameGroup.add(rearCrossBeam);

  chassisGroup.add(frameGroup);

  // 6. Left Acoustic Enclosure Wall (Body_ChassisWallLeft at X = -7.72, Y = 3.95, Z = 0.0)
  const leftBayWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 6.00, 10.16),
    MAT_ZEISS_WHITE
  );
  leftBayWall.position.set(-7.72, 3.95, 0.0);
  leftBayWall.name = 'Body_ChassisWallLeft';

  // Left wall side ventilation grille + M5 panel fasteners
  const leftVentBacking = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 2.20, 3.40),
    MAT_ZEISS_ANTHRACITE
  );
  leftVentBacking.position.set(-0.088, -0.45, 0.60);
  leftVentBacking.name = 'Body_LeftWallVentRecess';
  leftBayWall.add(leftVentBacking);

  for (let s = 0; s < 7; s++) {
    const slat = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.09, 3.16),
      MAT_316SS_BRUSHED
    );
    slat.position.set(-0.095, -1.30 + s * 0.28, 0.60);
    slat.rotation.z = -0.35;
    slat.name = `Body_LeftWallLouver_0${s + 1}`;
    leftBayWall.add(slat);
  }

  [
    [-2.70, -4.60],
    [-2.70, 4.60],
    [2.70, -4.60],
    [2.70, 4.60],
  ].forEach(([fy, fz], idx) => {
    const wallBolt = createHexSocketScrew(0.018, 0.04, `Fastener_HexM5_WallL_0${idx + 1}`);
    wallBolt.rotation.z = Math.PI / 2;
    wallBolt.position.set(-0.08, fy, fz);
    leftBayWall.add(wallBolt);
  });
  chassisGroup.add(leftBayWall);

  // 7. Removable / Cutaway Right Acoustic Enclosure Wall (Body_ChassisWallRight at X = +0.12, Y = 3.95, Z = 0.0)
  const rightBayWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 6.00, 10.16),
    MAT_ZEISS_WHITE.clone()
  );
  rightBayWall.position.set(0.12, 3.95, 0.0);
  rightBayWall.name = 'Body_ChassisWallRight';

  const rightVentBacking = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 2.20, 3.40),
    MAT_ZEISS_ANTHRACITE
  );
  rightVentBacking.position.set(0.088, -0.45, 0.60);
  rightVentBacking.name = 'Body_RightWallVentRecess';
  rightBayWall.add(rightVentBacking);

  for (let s = 0; s < 7; s++) {
    const slat = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.09, 3.16),
      MAT_316SS_BRUSHED
    );
    slat.position.set(0.095, -1.30 + s * 0.28, 0.60);
    slat.rotation.z = 0.35;
    slat.name = `Body_RightWallLouver_0${s + 1}`;
    rightBayWall.add(slat);
  }

  [
    [-2.70, -4.60],
    [-2.70, 4.60],
    [2.70, -4.60],
    [2.70, 4.60],
  ].forEach(([fy, fz], idx) => {
    const wallBolt = createHexSocketScrew(0.018, 0.04, `Fastener_HexM5_WallR_0${idx + 1}`);
    wallBolt.rotation.z = -Math.PI / 2;
    wallBolt.position.set(0.08, fy, fz);
    rightBayWall.add(wallBolt);
  });
  chassisGroup.add(rightBayWall);

  // 8. Rear Surround Plates framing Bulkhead Opening (X = -3.20, Y = 2.85, Z = 5.02; opening 5.80 x 3.80)
  // Spans X = -7.64..+0.04 (local to -3.80: -3.84..+3.84), Y = 0.95..6.95 (local to 3.95: -3.00..+3.00)
  // Cutout opening: X_world = -6.10..-0.30 (X_local = -2.30..+3.50), Y_world = 0.95..4.75 (Y_local = -3.00..+0.80)
  const rearSurroundGroup = new THREE.Group();
  rearSurroundGroup.name = 'Body_ChassisWallRear';

  const rearWallShape = new THREE.Shape();
  rearWallShape.moveTo(-3.84, -3.00);
  rearWallShape.lineTo(-2.30, -3.00);
  rearWallShape.lineTo(-2.30, 0.80);
  rearWallShape.lineTo(3.50, 0.80);
  rearWallShape.lineTo(3.50, -3.00);
  rearWallShape.lineTo(3.84, -3.00);
  rearWallShape.lineTo(3.84, 3.00);
  rearWallShape.lineTo(-3.84, 3.00);
  rearWallShape.closePath();

  const rearWallGeo = new THREE.ExtrudeGeometry(rearWallShape, {
    depth: 0.16,
    bevelEnabled: false,
  });
  const rearWallMesh = new THREE.Mesh(rearWallGeo, MAT_ZEISS_WHITE);
  rearWallMesh.position.set(-3.80, 3.95, 4.94); // Z spans 4.94..5.10, centered at Z = 5.02
  rearWallMesh.name = 'Body_ChassisRearSurround';
  rearSurroundGroup.add(rearWallMesh);

  // Dark anodized bulkhead perimeter gasket trim framing the 5.80 x 3.80 opening
  const trimTop = new THREE.Mesh(
    new THREE.BoxGeometry(5.96, 0.10, 0.04),
    MAT_ZEISS_ANTHRACITE
  );
  trimTop.position.set(-3.20, 4.78, 5.11);
  trimTop.name = 'Body_RearBulkheadTrimTop';
  rearSurroundGroup.add(trimTop);

  const trimLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.10, 3.84, 0.04),
    MAT_ZEISS_ANTHRACITE
  );
  trimLeft.position.set(-6.13, 2.87, 5.11);
  trimLeft.name = 'Body_RearBulkheadTrimLeft';
  rearSurroundGroup.add(trimLeft);

  const trimRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.10, 3.84, 0.04),
    MAT_ZEISS_ANTHRACITE
  );
  trimRight.position.set(-0.27, 2.87, 5.11);
  trimRight.name = 'Body_RearBulkheadTrimRight';
  rearSurroundGroup.add(trimRight);

  // Perimeter M4 stainless fasteners along the rear surround
  [
    [-7.30, 6.65],
    [-3.80, 6.65],
    [-0.25, 6.65],
    [-6.90, 2.85],
    [-0.12, 2.85],
  ].forEach(([bx, by], idx) => {
    const rBolt = createHexSocketScrew(0.016, 0.04, `Fastener_HexM4_RearWall_0${idx + 1}`);
    rBolt.rotation.x = Math.PI / 2;
    rBolt.position.set(bx, by, 5.10);
    rearSurroundGroup.add(rBolt);
  });
  chassisGroup.add(rearSurroundGroup);

  // 9. Rear Upper Shroud Tower (8.00 x 8.05 x 3.40 at (-3.80, 11.58, 3.30))
  const rearUpperCabinet = new THREE.Mesh(
    new THREE.BoxGeometry(8.00, 8.05, 3.40),
    MAT_ZEISS_WHITE
  );
  rearUpperCabinet.position.set(-3.80, 11.58, 3.30);
  rearUpperCabinet.name = 'Body_ChassisRearTower';

  // Signature ZEISS blue anodized accent trim bar across upper front of tower
  const zeissTrimBar = new THREE.Mesh(
    new THREE.BoxGeometry(8.04, 0.24, 0.08),
    MAT_ZEISS_BLUE
  );
  zeissTrimBar.position.set(0.0, 3.64, -1.72);
  zeissTrimBar.name = 'Body_ChassisAccentTrim';
  rearUpperCabinet.add(zeissTrimBar);

  // Brushed side ventilation louvers on -X and +X faces of the rear tower
  [-1, 1].forEach((sideSign, sIdx) => {
    const sideX = sideSign * 4.01;
    const recess = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 2.90, 1.80),
      MAT_ZEISS_ANTHRACITE
    );
    recess.position.set(sideX, 0.40, 0.15);
    recess.name = `Body_TowerVentRecess_${sIdx === 0 ? 'L' : 'R'}`;
    rearUpperCabinet.add(recess);

    for (let v = 0; v < 9; v++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.09, 1.62),
        MAT_316SS_BRUSHED
      );
      blade.position.set(sideSign * 4.02, -0.78 + v * 0.29, 0.15);
      blade.rotation.z = sideSign * 0.36;
      blade.name = `Body_TowerLouver_${sIdx === 0 ? 'L' : 'R'}_0${v + 1}`;
      rearUpperCabinet.add(blade);
    }
  });

  // Top removable maintenance cover plate + 8 DIN 912 M5 hex socket screws
  const towerTopLid = new THREE.Mesh(
    new THREE.BoxGeometry(7.72, 0.04, 3.12),
    MAT_ZEISS_ANTHRACITE
  );
  towerTopLid.position.set(0.0, 4.045, 0.0);
  towerTopLid.name = 'Body_TowerTopCover';
  rearUpperCabinet.add(towerTopLid);

  const topBoltCoords = [
    [-3.65, -1.38],
    [-1.22, -1.38],
    [1.22, -1.38],
    [3.65, -1.38],
    [-3.65, 1.38],
    [-1.22, 1.38],
    [1.22, 1.38],
    [3.65, 1.38],
  ];
  topBoltCoords.forEach(([tx, tz], idx) => {
    const topScrew = createHexSocketScrew(0.022, 0.05, `Fastener_HexM5_TowerTop_0${idx + 1}`);
    topScrew.position.set(tx, 4.065, tz);
    rearUpperCabinet.add(topScrew);
  });

  chassisGroup.add(rearUpperCabinet);

  // 10. Hinged Front Lower Service Bay Door (Pivot_DoorServiceBay)
  // Hinged along -X edge at (-7.68, 3.95, -5.06), spans X = 0..+7.76 local, Y = 0.96..6.94 (local -2.99..+2.99)
  // Rotating +angle around +Y swings the +X free edge outward toward -Z!
  const serviceDoorPivot = new THREE.Group();
  serviceDoorPivot.name = 'Pivot_DoorServiceBay';
  serviceDoorPivot.position.set(-7.68, 3.95, -5.06);

  const frontDoorPanel = new THREE.Mesh(
    new THREE.BoxGeometry(7.76, 5.98, 0.10),
    MAT_ZEISS_WHITE
  );
  frontDoorPanel.position.set(3.88, 0.0, 0.0);
  frontDoorPanel.name = 'Body_ServiceDoorPanel';
  serviceDoorPivot.add(frontDoorPanel);

  // EPDM perimeter dust gasket on interior face of service door (Z_local = +0.055)
  const gTop = new THREE.Mesh(new THREE.BoxGeometry(7.60, 0.08, 0.02), MAT_RUBBER_EPDM);
  gTop.position.set(3.88, 2.91, 0.06);
  serviceDoorPivot.add(gTop);
  const gBot = new THREE.Mesh(new THREE.BoxGeometry(7.60, 0.08, 0.02), MAT_RUBBER_EPDM);
  gBot.position.set(3.88, -2.91, 0.06);
  serviceDoorPivot.add(gBot);

  // Stamped ventilation louver bay on -X half of service door (X_local = 0.85..3.25)
  const doorVentBacking = new THREE.Mesh(
    new THREE.BoxGeometry(2.50, 2.86, 0.016),
    MAT_ZEISS_ANTHRACITE
  );
  doorVentBacking.position.set(2.05, -0.75, -0.058);
  doorVentBacking.name = 'Body_ServiceDoorVentRecess';
  serviceDoorPivot.add(doorVentBacking);

  for (let l = 0; l < 9; l++) {
    const louver = new THREE.Mesh(
      new THREE.BoxGeometry(2.30, 0.11, 0.045),
      MAT_316SS_BRUSHED
    );
    louver.position.set(2.05, -1.92 + l * 0.29, -0.072);
    louver.rotation.x = 0.46;
    louver.name = `Body_ServiceDoorLouver_0${l + 1}`;
    serviceDoorPivot.add(louver);
  }

  // ISO High-Voltage / Vacuum Bay Caution Nameplate on upper front door face (upright, flipY = false)
  const warnCanvas = createCanvas(512, 224);
  let warnMat;
  if (warnCanvas) {
    const wCtx = warnCanvas.getContext('2d');
    wCtx.fillStyle = '#0f172a';
    wCtx.fillRect(0, 0, 512, 224);
    wCtx.strokeStyle = '#facc15';
    wCtx.lineWidth = 8;
    wCtx.strokeRect(8, 8, 496, 208);

    // Warning triangle
    wCtx.fillStyle = '#facc15';
    wCtx.beginPath();
    wCtx.moveTo(86, 48);
    wCtx.lineTo(138, 146);
    wCtx.lineTo(34, 146);
    wCtx.closePath();
    wCtx.fill();
    wCtx.fillStyle = '#0f172a';
    wCtx.font = 'bold 58px sans-serif';
    wCtx.textAlign = 'center';
    wCtx.fillText('⚡', 86, 128);

    wCtx.fillStyle = '#facc15';
    wCtx.font = 'bold 34px "IBM Plex Mono", monospace';
    wCtx.textAlign = 'left';
    wCtx.fillText('CAUTION · 30 kV HV', 164, 84);
    wCtx.fillStyle = '#e2e8f0';
    wCtx.font = '600 22px "Inter", sans-serif';
    wCtx.fillText('TURBOPUMP & EHT SERVICE BAY', 164, 130);
    wCtx.fillStyle = '#94a3b8';
    wCtx.font = '18px "IBM Plex Mono", monospace';
    wCtx.fillText('DISCONNECT AC MAINS BEFORE ACCESS', 164, 170);

    const wTex = new THREE.CanvasTexture(warnCanvas);
    wTex.flipY = false;
    wTex.colorSpace = THREE.SRGBColorSpace;
    warnMat = new THREE.MeshStandardMaterial({ map: wTex, roughness: 0.28, metalness: 0.20 });
  } else {
    warnMat = MAT_YELLOW_SAFETY;
  }
  const warnDecal = createDecalQuad(1.08, 0.47, warnMat);
  warnDecal.position.set(5.90, 1.85, -0.054);
  warnDecal.name = 'Body_ServiceDoorHVDecal';
  serviceDoorPivot.add(warnDecal);

  // Rotary Compression Latch near +X free edge (X_local = 7.36, Y_local = +0.25)
  const latchGroup = new THREE.Group();
  latchGroup.name = 'Body_ServiceDoorCompressionLatch';
  latchGroup.position.set(7.36, 0.25, -0.056);

  const latchCup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.03, 24),
    MAT_ZEISS_ANTHRACITE
  );
  latchCup.rotation.x = Math.PI / 2;
  latchGroup.add(latchCup);

  const latchBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.05, 20),
    MAT_316SS_POLISHED
  );
  latchBarrel.rotation.x = Math.PI / 2;
  latchBarrel.position.z = -0.015;
  latchGroup.add(latchBarrel);

  const latchWing = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.36, 0.05),
    MAT_DARK_ANODIZED
  );
  latchWing.position.z = -0.045;
  latchGroup.add(latchWing);

  const latchPawl = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.12, 0.04),
    MAT_316SS_POLISHED
  );
  latchPawl.position.set(0.14, 0.0, 0.125);
  latchGroup.add(latchPawl);

  serviceDoorPivot.add(latchGroup);

  // Three Barrel Hinges with Genuine M4 Stainless Hinge Pins along X_local = 0.00
  [-2.10, 0.0, 2.10].forEach((hy, idx) => {
    const hingeGrp = new THREE.Group();
    hingeGrp.name = `Body_DoorBarrelHinge_0${idx + 1}`;
    hingeGrp.position.set(0.0, hy, -0.06);

    const knuckle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.40, 18),
      MAT_316SS_POLISHED
    );
    hingeGrp.add(knuckle);

    const hingePin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.48, 12),
      MAT_316SS_BRUSHED
    );
    hingeGrp.add(hingePin);

    const pinCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.048, 0.035, 6),
      MAT_316SS_POLISHED
    );
    pinCap.position.y = 0.255;
    hingeGrp.add(pinCap);

    const doorStrap = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.36, 0.035),
      MAT_316SS_BRUSHED
    );
    doorStrap.position.set(0.12, 0.0, 0.0);
    hingeGrp.add(doorStrap);

    [-0.10, 0.10].forEach((sy, bIdx) => {
      const hScrew = createHexSocketScrew(
        0.015,
        0.04,
        `Fastener_HexM4_DoorHinge_0${idx + 1}_${bIdx + 1}`
      );
      hScrew.rotation.x = -Math.PI / 2;
      hScrew.position.set(0.15, sy, -0.018);
      hingeGrp.add(hScrew);
    });

    serviceDoorPivot.add(hingeGrp);
  });

  chassisGroup.add(serviceDoorPivot);

  return { chassisGroup, serviceDoorPivot, rightBayWall };
}

// ----------------------------------------------------------------------------
// Hospital-Grade Duplex Power Receptacle, NEMA 5-20P Plug & SJTOW Cord
// ----------------------------------------------------------------------------
export function buildPowerContinuityAssembly() {
  const powerGroup = new THREE.Group();
  powerGroup.name = 'Power_ContinuitySystem';

  // 1. Floor-Mounted Utility Pedestal & Hospital-Grade Red Duplex Receptacle at (-2.10, 0.00, 6.45)
  const receptacleGroup = new THREE.Group();
  receptacleGroup.name = 'Power_Receptacle_Duplex';
  receptacleGroup.position.set(-2.10, 0.0, 6.45);

  // Welded floor anchor plate resting flush at Y = 0.00
  const basePlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.26, 0.08, 0.96),
    MAT_FRAME_STEEL
  );
  basePlate.position.y = 0.04;
  basePlate.castShadow = true;
  basePlate.name = 'Power_ReceptacleBasePlate';
  receptacleGroup.add(basePlate);

  [
    [-0.50, -0.35],
    [0.50, -0.35],
    [-0.50, 0.35],
    [0.50, 0.35],
  ].forEach(([ax, az], idx) => {
    const anchor = createHexSocketScrew(0.022, 0.06, `Fastener_HexM8_ReceptacleBase_0${idx + 1}`);
    anchor.position.set(ax, 0.08, az);
    receptacleGroup.add(anchor);
  });

  // Pedestal steel column (Y: 0.08..2.20)
  const pedestalPost = new THREE.Mesh(
    new THREE.BoxGeometry(0.98, 2.12, 0.72),
    MAT_FRAME_STEEL
  );
  pedestalPost.position.y = 1.14;
  pedestalPost.castShadow = true;
  pedestalPost.name = 'Power_ReceptacleColumn';
  receptacleGroup.add(pedestalPost);

  const pedestalCap = new THREE.Mesh(
    new THREE.BoxGeometry(1.04, 0.06, 0.78),
    MAT_ZEISS_ANTHRACITE
  );
  pedestalCap.position.y = 2.23;
  pedestalCap.name = 'Power_ReceptacleCap';
  receptacleGroup.add(pedestalCap);

  // Rear EMT electrical floor conduit entering pedestal
  const conduitPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.085, 0.46, 16),
    MAT_316SS_BRUSHED
  );
  conduitPipe.position.set(0.24, 0.23, 0.45);
  conduitPipe.name = 'Power_FloorConduit';
  receptacleGroup.add(conduitPipe);

  // Brushed stainless steel wallplate (front face at Z_local = -0.40 -> Z_world = 6.05)
  const outletFaceplate = new THREE.Mesh(
    new THREE.BoxGeometry(0.84, 1.38, 0.04),
    MAT_316SS_BRUSHED
  );
  outletFaceplate.position.set(0.0, 1.35, -0.38);
  outletFaceplate.name = 'Power_OutletFaceplate';
  receptacleGroup.add(outletFaceplate);

  // Green hospital-grade power/ground verification LED dot
  const ledBezel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.042, 0.042, 0.025, 16),
    MAT_DARK_ANODIZED
  );
  ledBezel.rotation.x = Math.PI / 2;
  ledBezel.position.set(0.26, 1.92, -0.402);
  receptacleGroup.add(ledBezel);

  const greenLed = new THREE.Mesh(
    new THREE.CylinderGeometry(0.026, 0.026, 0.022, 16),
    makeMat(0x22c55e, { r: 0.15, m: 0.05, e: 0x22c55e, ei: 1.8 })
  );
  greenLed.rotation.x = Math.PI / 2;
  greenLed.position.set(0.26, 1.92, -0.408);
  greenLed.name = 'Power_HospitalGreenLED';
  receptacleGroup.add(greenLed);

  // Center + top/bottom M3 stainless faceplate screws
  const centerScrew = createHexSocketScrew(0.015, 0.035, 'Fastener_HexM3_OutletCenter');
  centerScrew.rotation.x = -Math.PI / 2;
  centerScrew.position.set(0.0, 1.35, -0.402);
  receptacleGroup.add(centerScrew);

  const topScrew = createHexSocketScrew(0.014, 0.035, 'Fastener_HexM3_OutletTop');
  topScrew.rotation.x = -Math.PI / 2;
  topScrew.position.set(0.0, 1.97, -0.402);
  receptacleGroup.add(topScrew);

  const botScrew = createHexSocketScrew(0.014, 0.035, 'Fastener_HexM3_OutletBot');
  botScrew.rotation.x = -Math.PI / 2;
  botScrew.position.set(0.0, 0.73, -0.402);
  receptacleGroup.add(botScrew);

  // Hospital-grade red NEMA 5-20R duplex outlets at exact Y = 1.03 and Y = 1.67
  // Outlet face sits at Z_local = -0.420 (Z_world = 6.030) to mate flush with plugged NEMA plug rear (+0.17 at 5.86 -> 6.030)
  [1.03, 1.67].forEach((oy, idx) => {
    const socketFace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.23, 0.23, 0.04, 24),
      MAT_RED_ANODIZED
    );
    socketFace.rotation.x = Math.PI / 2;
    socketFace.position.set(0.0, oy, -0.400);
    socketFace.name = `Power_SocketNEMA520R_0${idx + 1}`;
    receptacleGroup.add(socketFace);

    // Neutral T-slot (+X screen-left side) & Hot slot (-X side)
    const slotNeutralV = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.14, 0.02), MAT_RUBBER_EPDM);
    slotNeutralV.position.set(0.08, oy + 0.045, -0.416);
    receptacleGroup.add(slotNeutralV);

    const slotNeutralH = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.028, 0.02), MAT_RUBBER_EPDM);
    slotNeutralH.position.set(0.102, oy + 0.045, -0.416);
    receptacleGroup.add(slotNeutralH);

    const slotHot = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.115, 0.02), MAT_RUBBER_EPDM);
    slotHot.position.set(-0.08, oy + 0.045, -0.416);
    receptacleGroup.add(slotHot);

    // D-shaped ground hole (semicircular bottom + flat top lip)
    const dGroundArc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 0.02, 14, 1, false, Math.PI * 0.5, Math.PI),
      MAT_RUBBER_EPDM
    );
    dGroundArc.rotation.x = Math.PI / 2;
    dGroundArc.position.set(0.0, oy - 0.095, -0.416);
    receptacleGroup.add(dGroundArc);

    const dGroundTop = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.024, 0.02), MAT_RUBBER_EPDM);
    dGroundTop.position.set(0.0, oy - 0.083, -0.416);
    receptacleGroup.add(dGroundTop);
  });

  powerGroup.add(receptacleGroup);

  // 2. Molded NEMA 5-15P / 5-20P Grounded Plug (Power_Plug_NEMA)
  // Seated at (-2.10, 1.67, 5.86) when plugged; rests on floor at (-2.75, 0.22, 5.55) when unplugged
  const plugGroup = new THREE.Group();
  plugGroup.name = 'Power_Plug_NEMA';
  plugGroup.position.set(-2.10, 1.67, 5.86);

  const plugBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.36, 0.34),
    MAT_RUBBER_EPDM
  );
  plugBody.name = 'Power_PlugMoldedBody';
  plugGroup.add(plugBody);

  // Hospital-grade safety yellow collar ring
  const safetyBand = new THREE.Mesh(
    new THREE.BoxGeometry(0.375, 0.375, 0.055),
    MAT_YELLOW_SAFETY
  );
  safetyBand.position.z = 0.11;
  safetyBand.name = 'Power_PlugSafetyCollar';
  plugGroup.add(safetyBand);

  // Molded multi-ribbed strain relief extending to tail at Z_local = -0.41 (Z_world = 5.45 when plugged)
  const strainNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.095, 0.155, 0.25, 16),
    MAT_RUBBER_EPDM
  );
  strainNeck.rotation.x = Math.PI / 2;
  strainNeck.position.z = -0.295;
  strainNeck.name = 'Power_PlugStrainRelief';
  plugGroup.add(strainNeck);

  [-0.22, -0.27, -0.32, -0.37].forEach((rz, idx) => {
    const rib = new THREE.Mesh(
      new THREE.TorusGeometry(0.135 - idx * 0.012, 0.018, 10, 18),
      MAT_RUBBER_EPDM
    );
    rib.position.z = rz;
    plugGroup.add(rib);
  });

  // Brass phase & neutral blades + cylindrical ground pin facing +Z into outlet
  [-0.08, 0.08].forEach((bx, idx) => {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.024, 0.115, 0.22),
      MAT_BRASS_GOLD
    );
    blade.position.set(bx, 0.045, 0.27);
    blade.name = `Power_PlugBlade_0${idx + 1}`;
    plugGroup.add(blade);
  });

  const groundPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, 0.25, 12),
    MAT_BRASS_GOLD
  );
  groundPin.rotation.x = Math.PI / 2;
  groundPin.position.set(0.0, -0.095, 0.285);
  groundPin.name = 'Power_PlugGroundPin';
  plugGroup.add(groundPin);

  powerGroup.add(plugGroup);

  // 3. Heavy-Duty 12 AWG 3-Conductor SJTOW Power Cord (Power_Cord_SJTOW)
  // Smooth TubeGeometry (r = 0.075) from Port_IEC (-1.50, 2.15, 5.12) to plug tail
  const cordGroup = new THREE.Group();
  cordGroup.name = 'Power_Cord_SJTOW';

  const cordMesh = new THREE.Mesh(new THREE.BufferGeometry(), MAT_RUBBER_EPDM);
  cordMesh.castShadow = true;
  cordMesh.name = 'Power_CordTube';
  cordGroup.add(cordMesh);

  const bootIEC = new THREE.Mesh(
    new THREE.CylinderGeometry(0.115, 0.145, 0.22, 16),
    MAT_RUBBER_EPDM
  );
  bootIEC.name = 'Body_StrainBoot_PowerCord_IEC';
  cordGroup.add(bootIEC);

  const bootPlug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.115, 0.145, 0.22, 16),
    MAT_RUBBER_EPDM
  );
  bootPlug.name = 'Body_StrainBoot_PowerCord_Plug';
  cordGroup.add(bootPlug);

  const upVec = new THREE.Vector3(0, 1, 0);
  let currentPlugged = null;

  function updatePowerCordCurve(isPlugged = true) {
    const plugged = Boolean(isPlugged);
    if (currentPlugged === plugged && cordMesh.geometry.attributes.position) {
      return;
    }
    currentPlugged = plugged;

    // Position and orient the NEMA 5-20P plug cleanly in receptacle vs on floor
    if (plugged) {
      plugGroup.position.set(-2.10, 1.67, 5.86);
      plugGroup.rotation.set(0.0, 0.0, 0.0);
    } else {
      plugGroup.position.set(-2.75, 0.22, 5.55);
      plugGroup.rotation.set(0.30, -0.29, 0.0);
    }

    const controlPoints = plugged
      ? [
          new THREE.Vector3(-1.50, 2.15, 5.12),
          new THREE.Vector3(-1.62, 1.25, 5.48),
          new THREE.Vector3(-1.82, 0.42, 5.66),
          new THREE.Vector3(-2.00, 0.88, 5.54),
          new THREE.Vector3(-2.10, 1.67, 5.45),
        ]
      : [
          new THREE.Vector3(-1.50, 2.15, 5.12),
          new THREE.Vector3(-1.68, 1.15, 5.42),
          new THREE.Vector3(-1.95, 0.22, 5.62),
          new THREE.Vector3(-2.35, 0.14, 5.48),
          new THREE.Vector3(-2.68, 0.30, 5.32),
        ];

    const curve = new THREE.CatmullRomCurve3(controlPoints);
    const nextGeo = new THREE.TubeGeometry(curve, 48, 0.075, 14, false);

    if (cordMesh.geometry) {
      cordMesh.geometry.dispose();
    }
    cordMesh.geometry = nextGeo;

    // Align strain relief boots to curve tangents at Port_IEC and plug tail
    bootIEC.position.copy(curve.getPointAt(0.0));
    bootIEC.quaternion.setFromUnitVectors(upVec, curve.getTangentAt(0.0).normalize());

    bootPlug.position.copy(curve.getPointAt(1.0));
    bootPlug.quaternion.setFromUnitVectors(upVec, curve.getTangentAt(1.0).normalize());
  }

  updatePowerCordCurve(true);
  powerGroup.add(cordGroup);

  return {
    powerGroup,
    receptacleGroup,
    plugGroup,
    cordGroup,
    updatePowerCordCurve,
  };
}
