/**
 * sem_internals.js — Internal Vacuum Pumping Drivetrain, 30 kV HV Tank,
 * Perforated Switching PSU, Toroidal Transformer, SmartSEM Control Motherboard,
 * Rear Bulkhead I/O & End-to-End Point-to-Point Harnesses.
 *
 * Coordinate Convention: 1 unit = 100 mm = 0.1 m | +Y up | Front = -Z | screenRight = -X
 * Plinth Interior Bay: X = -7.60..0.00 (center = -3.80 u), Y = 0.95..6.95, Z = -4.90..+5.02
 */

import * as THREE from 'three';
import {
  makeMat,
  createCanvas,
  MAT_ZEISS_ANTHRACITE,
  MAT_FRAME_STEEL,
  MAT_316SS_POLISHED,
  MAT_316SS_BRUSHED,
  MAT_DARK_ANODIZED,
  MAT_BLUE_ANODIZED,
  MAT_BRASS_GOLD,
  MAT_RUBBER_EPDM,
  MAT_ALUMINA_CERAMIC,
  MAT_PCB_FR4,
  MAT_IC_EPOXY,
  MAT_TOROID_COIL,
  MAT_HV_EPOXY_RED,
  TEX_PSU_PERFORATED,
  MAT_WIRE_HV_RED,
  MAT_WIRE_AC_BROWN,
  MAT_WIRE_AC_BLUE,
  MAT_WIRE_PE_GRNYLW,
  MAT_WIRE_DC_RED,
  MAT_WIRE_DC_BLACK,
  MAT_WIRE_SENSOR_CYAN,
  MAT_WIRE_DATA_GREY,
  MAT_COOLANT_BLUE,
  MAT_COOLANT_RED,
  MAT_PHOENIX_GREEN,
  createDecalQuad,
  createHexSocketScrew,
  createConFlatFlange,
  makeWiringHarness,
} from './sem_materials.js';

// ----------------------------------------------------------------------------
// Internal Procedural Laser-Marking & Nameplate Helper (flipY = false, sRGB)
// ----------------------------------------------------------------------------
function makeComponentLabel(title, subtitle, w, h, bgHex = '#0f172a', fgHex = '#f8fafc', borderHex = '#38bdf8') {
  const c = createCanvas(512, 192);
  let mat;
  if (c) {
    const ctx = c.getContext('2d');
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 512, 192);
    ctx.strokeStyle = borderHex;
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 180);
    ctx.fillStyle = fgHex;
    ctx.font = 'bold 40px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 256, 68);
    ctx.fillStyle = borderHex;
    ctx.font = '600 24px "IBM Plex Mono", monospace';
    ctx.fillText(subtitle, 256, 134);

    const tex = new THREE.CanvasTexture(c);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.28, metalness: 0.22 });
  } else {
    mat = makeMat(0x0f172a, { r: 0.35, m: 0.20 });
  }
  return createDecalQuad(w, h, mat);
}

// ----------------------------------------------------------------------------
// Internal Mechanics, Vacuum Pumps, HV Tank, PSU, Motherboard & Harnesses
// ----------------------------------------------------------------------------
export function buildInternalMechanicsAndElectronicsBay() {
  const internalGroup = new THREE.Group();
  internalGroup.name = 'Body_InternalMechanicsAndElectronicsBay';

  // --------------------------------------------------------------------------
  // 1. Pfeiffer HiPace 300 Turbomolecular Pump (90,000 RPM) under Chamber DN100CF
  // --------------------------------------------------------------------------
  const turboGroup = new THREE.Group();
  turboGroup.name = 'Motor_DriveTurboPump';
  turboGroup.position.set(-3.80, 6.15, -0.20);

  // Top DN100CF hollow inlet flange (top face at Y_world = 7.53 => y_local = +1.38)
  const turboTopFlange = createConFlatFlange(1.12, 0.74, 0.24, 'TurboCF100', 12);
  turboTopFlange.position.y = 1.26; // spans +1.14..+1.38 => world top = 7.53
  turboGroup.add(turboTopFlange);

  // Visible upper turbo rotor hub & swept turbine blades inside DN100CF bore
  const turboRotorHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.28, 0.14, 20),
    MAT_316SS_POLISHED
  );
  turboRotorHub.position.y = 1.18;
  turboGroup.add(turboRotorHub);

  for (let tb = 0; tb < 10; tb++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.03, 0.10),
      MAT_316SS_POLISHED
    );
    const ang = (tb / 10) * Math.PI * 2;
    blade.position.set(Math.cos(ang) * 0.44, 1.16, Math.sin(ang) * 0.44);
    blade.rotation.y = -ang;
    blade.rotation.x = 0.48;
    turboGroup.add(blade);
  }

  // Finned cast-aluminum high-vacuum stator barrel
  const turboBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.90, 0.86, 1.72, 28),
    MAT_316SS_BRUSHED
  );
  turboBody.position.y = 0.28;
  turboGroup.add(turboBody);

  // 8 radial cooling fins around turbo housing
  for (let i = 0; i < 8; i++) {
    const fin = new THREE.Mesh(
      new THREE.CylinderGeometry(1.00, 1.00, 0.048, 28),
      MAT_DARK_ANODIZED
    );
    fin.position.y = -0.34 + i * 0.165;
    turboGroup.add(fin);
  }

  // Onboard Pfeiffer TC 110 Electronic Drive Controller on +X side of turbo
  const tc110Box = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 1.10, 0.86),
    MAT_DARK_ANODIZED
  );
  tc110Box.position.set(0.98, 0.22, 0.0);
  tc110Box.name = 'Body_TurboControllerTC110';
  turboGroup.add(tc110Box);

  const turboLabel = makeComponentLabel(
    'PFEIFFER HiPace 300',
    '90,000 RPM · 260 L/s TURBO',
    0.84,
    0.32,
    '#0f172a',
    '#38bdf8',
    '#0284c7'
  );
  turboLabel.position.set(0.0, 0.28, -0.92);
  turboGroup.add(turboLabel);

  // DN25KF Foreline Exhaust Port on -X side of turbo base (world = -4.78, 5.80, -0.20)
  const kfPort = new THREE.Mesh(
    new THREE.CylinderGeometry(0.20, 0.20, 0.44, 20),
    MAT_316SS_POLISHED
  );
  kfPort.rotation.z = Math.PI / 2;
  kfPort.position.set(-0.98, -0.35, 0.0);
  turboGroup.add(kfPort);

  const kfClampTurbo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.10, 20),
    MAT_BLUE_ANODIZED
  );
  kfClampTurbo.rotation.z = Math.PI / 2;
  kfClampTurbo.position.set(-1.14, -0.35, 0.0);
  turboGroup.add(kfClampTurbo);

  internalGroup.add(turboGroup);

  // --------------------------------------------------------------------------
  // 2. Pfeiffer HiScroll 6 Dry Scroll Backing Pump on Elastomeric Mounts
  // --------------------------------------------------------------------------
  const scrollGroup = new THREE.Group();
  scrollGroup.name = 'Motor_DriveScrollPump';
  scrollGroup.position.set(-5.75, 1.45, 1.95);

  // Steel baseplate & 4 vulcanized rubber mounts resting flush on basePlinth (Y_world = 0.95 => y_local = -0.50)
  const scrollSaddle = new THREE.Mesh(
    new THREE.BoxGeometry(1.16, 0.10, 1.95),
    MAT_FRAME_STEEL
  );
  scrollSaddle.position.set(0.0, -0.34, -0.25);
  scrollGroup.add(scrollSaddle);

  [
    [-0.46, -1.05],
    [0.46, -1.05],
    [-0.46, 0.55],
    [0.46, 0.55],
  ].forEach(([mx, mz], idx) => {
    const mount = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.13, 0.12, 16),
      MAT_RUBBER_EPDM
    );
    mount.position.set(mx, -0.44, mz);
    mount.name = `Body_ScrollIsolatorMount_0${idx + 1}`;
    scrollGroup.add(mount);
  });

  const scrollMotor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.56, 1.65, 24),
    MAT_ZEISS_ANTHRACITE
  );
  scrollMotor.rotation.x = Math.PI / 2;
  scrollMotor.position.set(0.0, 0.24, 0.0);
  scrollGroup.add(scrollMotor);

  const scrollHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.64, 0.60, 0.58, 24),
    MAT_316SS_BRUSHED
  );
  scrollHead.rotation.x = Math.PI / 2;
  scrollHead.position.set(0.0, 0.24, -1.08);
  scrollGroup.add(scrollHead);

  // 8 scroll head DIN 912 M6 hex socket cap screws
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const scr = createHexSocketScrew(0.018, 0.05, `Fastener_HexM6_Scroll_0${i + 1}`);
    scr.rotation.x = -Math.PI / 2;
    scr.position.set(Math.cos(ang) * 0.50, 0.24 + Math.sin(ang) * 0.50, -1.38);
    scrollGroup.add(scr);
  }

  // Top DN25KF suction inlet port on scroll head (world = -5.75, 2.30, +1.20)
  const scrollInletNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.34, 18),
    MAT_316SS_POLISHED
  );
  scrollInletNeck.position.set(0.0, 0.78, -0.75);
  scrollGroup.add(scrollInletNeck);

  const kfClampScroll = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.10, 18),
    MAT_BLUE_ANODIZED
  );
  kfClampScroll.position.set(0.0, 0.90, -0.75);
  scrollGroup.add(kfClampScroll);

  const scrollLabel = makeComponentLabel(
    'PFEIFFER HiScroll 6',
    'OIL-FREE DRY SCROLL · 1800 RPM',
    1.10,
    0.34,
    '#111827',
    '#f8fafc',
    '#22c55e'
  );
  scrollLabel.rotation.y = -Math.PI / 2;
  scrollLabel.position.set(0.58, 0.24, -0.10);
  scrollGroup.add(scrollLabel);

  internalGroup.add(scrollGroup);

  // --------------------------------------------------------------------------
  // 3. Corrugated 316L Stainless Flexible Foreline Hose (Body_VacuumForeline_KF25)
  // --------------------------------------------------------------------------
  const forelinePoints = [
    [-4.92, 5.80, -0.20],
    [-5.45, 5.35, 0.25],
    [-5.75, 3.85, 0.92],
    [-5.75, 2.35, 1.20],
  ];
  const forelineHose = makeWiringHarness(
    forelinePoints,
    0.15,
    MAT_316SS_BRUSHED,
    'Body_VacuumForeline_KF25',
    true
  );

  // Corrugated stainless bellows rings along the foreline curve
  const forelineCurve = new THREE.CatmullRomCurve3(forelinePoints.map(p => new THREE.Vector3(...p)));
  const upVec = new THREE.Vector3(0, 1, 0);
  for (let r = 1; r <= 18; r++) {
    const t = r / 19;
    const pt = forelineCurve.getPointAt(t);
    const tan = forelineCurve.getTangentAt(t).normalize();
    const rib = new THREE.Mesh(
      new THREE.TorusGeometry(0.165, 0.022, 10, 20),
      MAT_316SS_POLISHED
    );
    rib.position.copy(pt);
    rib.quaternion.setFromUnitVectors(upVec, tan);
    rib.rotation.x += Math.PI / 2;
    forelineHose.add(rib);
  }
  internalGroup.add(forelineHose);

  // --------------------------------------------------------------------------
  // 4. Potted 30 kV Spellman High-Voltage Tank (Body_HVTank_30kV) & Umbilical
  // --------------------------------------------------------------------------
  const hvTankGroup = new THREE.Group();
  hvTankGroup.name = 'Body_HVTank_30kV';
  hvTankGroup.position.set(-5.95, 4.10, 2.65);

  // Steel shelf bracket anchoring HV tank cleanly to plinth/rear rack
  const hvShelf = new THREE.Mesh(
    new THREE.BoxGeometry(2.00, 0.10, 2.00),
    MAT_FRAME_STEEL
  );
  hvShelf.position.y = -1.25;
  hvTankGroup.add(hvShelf);

  const hvTankBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.80, 2.40, 1.90),
    MAT_HV_EPOXY_RED
  );
  hvTankGroup.add(hvTankBody);

  const hvTopCap = new THREE.Mesh(
    new THREE.BoxGeometry(1.88, 0.16, 1.98),
    MAT_316SS_BRUSHED
  );
  hvTopCap.position.y = 1.24;
  hvTankGroup.add(hvTopCap);

  // Ribbed conical alumina HV feedthrough on top of HV tank (output gland at world -5.65, 5.75, +2.65)
  const hvInsulator = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.34, 0.56, 24),
    MAT_ALUMINA_CERAMIC
  );
  hvInsulator.position.set(0.30, 1.56, 0.0);
  hvTankGroup.add(hvInsulator);

  [1.42, 1.56, 1.70].forEach(ry => {
    const rib = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.04, 24),
      MAT_ALUMINA_CERAMIC
    );
    rib.position.set(0.30, ry, 0.0);
    hvTankGroup.add(rib);
  });

  const hvLabel = makeComponentLabel(
    'DANGER · 30,000 V DC',
    'SPELLMAN EHT TANK · +8kV BOOSTER',
    1.62,
    0.54,
    '#450a0a',
    '#fef08a',
    '#ef4444'
  );
  hvLabel.position.set(0.0, 0.18, -0.97);
  hvTankGroup.add(hvLabel);

  internalGroup.add(hvTankGroup);

  // 30 kV Silicone Umbilical routed strictly inside rear cabinet (never pokes outside -X wall!)
  internalGroup.add(
    makeWiringHarness(
      [
        [-5.65, 5.75, 2.65],
        [-5.05, 8.20, 2.45],
        [-4.35, 13.10, 2.10],
        [-3.80, 17.65, 1.05],
        [-3.80, 18.15, 0.35],
      ],
      0.088,
      MAT_WIRE_HV_RED,
      'Body_Wire_HV30kV_Umbilical'
    )
  );

  // --------------------------------------------------------------------------
  // 5. Perforated Switching PSU (Assembly_PowerSupply) & Toroidal Transformer
  // --------------------------------------------------------------------------
  const psuGroup = new THREE.Group();
  psuGroup.name = 'Assembly_PowerSupply';
  psuGroup.position.set(-1.65, 4.25, 2.35);

  // Perforated U-frame shroud using TEX_PSU_PERFORATED, open toward -Z viewer
  const psuShroudMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    map: TEX_PSU_PERFORATED,
    roughness: 0.26,
    metalness: 0.82,
    alphaTest: 0.45,
    side: THREE.DoubleSide,
  });

  // Base solid aluminum tray (y_local = -0.52)
  const psuBaseTray = new THREE.Mesh(
    new THREE.BoxGeometry(2.26, 0.06, 1.66),
    MAT_316SS_BRUSHED
  );
  psuBaseTray.position.set(0.0, -0.52, 0.0);
  psuGroup.add(psuBaseTray);

  // Rear perforated plate (z_local = +0.80)
  const psuBackWall = new THREE.Mesh(
    new THREE.BoxGeometry(2.26, 1.04, 0.05),
    psuShroudMat
  );
  psuBackWall.position.set(0.0, 0.0, 0.80);
  psuGroup.add(psuBackWall);

  // Left & Right perforated side walls (x_local = ±1.10)
  [-1.10, 1.10].forEach(sx => {
    const sideWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 1.04, 1.66),
      psuShroudMat
    );
    sideWall.position.set(sx, 0.0, 0.0);
    psuGroup.add(sideWall);
  });

  // Top perforated lid slightly recessed/cutaway from front -Z so internal caps & xfmr are clearly visible
  const psuTopCover = new THREE.Mesh(
    new THREE.BoxGeometry(2.26, 0.05, 1.28),
    psuShroudMat
  );
  psuTopCover.position.set(0.0, 0.52, 0.19);
  psuGroup.add(psuTopCover);

  // Front top fascia flange strip for clean Mean Well label (no overlap with components below)
  const psuFrontLip = new THREE.Mesh(
    new THREE.BoxGeometry(2.26, 0.20, 0.05),
    MAT_316SS_BRUSHED
  );
  psuFrontLip.position.set(0.0, 0.44, -0.80);
  psuGroup.add(psuFrontLip);

  const psuLabel = makeComponentLabel(
    'MEAN WELL LRS-350-24',
    '24 VDC · 14.6 A REGULATED',
    1.80,
    0.16,
    '#0f172a',
    '#f8fafc',
    '#38bdf8'
  );
  psuLabel.position.set(0.0, 0.44, -0.835);
  psuGroup.add(psuLabel);

  // Internal green PSU PCB seated on base tray
  const psuInnerPcb = new THREE.Mesh(
    new THREE.BoxGeometry(2.08, 0.04, 1.44),
    MAT_PCB_FR4
  );
  psuInnerPcb.position.set(0.0, -0.46, 0.02);
  psuGroup.add(psuInnerPcb);

  // Blue electrolytic bulk filter capacitors cleanly INSIDE the U-frame cage (z_local = -0.10)
  [-0.58, -0.16].forEach((cx, idx) => {
    const bulkCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.66, 20),
      makeMat(0x1e3a8a, { r: 0.24, m: 0.35 })
    );
    bulkCap.position.set(cx, -0.10, -0.10);
    bulkCap.name = `Body_PSUCap_0${idx + 1}`;
    psuGroup.add(bulkCap);

    const capTopVent = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.02, 18),
      MAT_316SS_POLISHED
    );
    capTopVent.position.set(cx, 0.24, -0.10);
    psuGroup.add(capTopVent);
  });

  // Yellow Mylar isolation switching transformer cleanly INSIDE the cage (z_local = +0.06)
  const flybackXfmr = new THREE.Mesh(
    new THREE.BoxGeometry(0.50, 0.62, 0.46),
    makeMat(0xeab308, { r: 0.28, m: 0.12 })
  );
  flybackXfmr.position.set(0.42, -0.12, 0.06);
  flybackXfmr.name = 'Body_PSUSwitchingXfmr';
  psuGroup.add(flybackXfmr);

  // Extruded aluminum MOSFET heatsink inside rear of cage
  const psuHeatsink = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.56, 0.14),
    MAT_DARK_ANODIZED
  );
  psuHeatsink.position.set(0.0, -0.14, 0.58);
  psuGroup.add(psuHeatsink);

  // 7-position screw-terminal barrier strip cleanly seated on front tray shelf inside cage (z_local = -0.62)
  const barrierStrip = new THREE.Mesh(
    new THREE.BoxGeometry(1.76, 0.24, 0.24),
    MAT_RUBBER_EPDM
  );
  barrierStrip.position.set(0.0, -0.37, -0.62);
  psuGroup.add(barrierStrip);

  for (let t = 0; t < 7; t++) {
    const termScrew = createHexSocketScrew(0.015, 0.03, `Fastener_HexM3_PSUTerm_0${t + 1}`);
    termScrew.position.set(-0.72 + t * 0.24, -0.25, -0.62);
    psuGroup.add(termScrew);
  }
  internalGroup.add(psuGroup);

  // 300 VA Copper Toroidal Isolation Transformer (Part_ToroidalTransformer) at (-1.65, 1.48, +2.35)
  const toroidGroup = new THREE.Group();
  toroidGroup.name = 'Part_ToroidalTransformer';
  toroidGroup.position.set(-1.65, 1.48, 2.35);

  const toroidBasePlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.98, 1.02, 0.12, 28),
    MAT_FRAME_STEEL
  );
  toroidBasePlate.position.y = -0.47; // bottom at 1.48 - 0.53 = 0.95 (flush on basePlinth)
  toroidGroup.add(toroidBasePlate);

  const toroidPad = new THREE.Mesh(
    new THREE.CylinderGeometry(0.92, 0.92, 0.10, 28),
    MAT_RUBBER_EPDM
  );
  toroidPad.position.y = -0.36;
  toroidGroup.add(toroidPad);

  const toroidCore = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.28, 22, 36),
    MAT_TOROID_COIL
  );
  toroidCore.rotation.x = Math.PI / 2;
  toroidGroup.add(toroidCore);

  const toroidCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.54, 0.62, 0.08, 24),
    MAT_316SS_POLISHED
  );
  toroidCap.position.y = 0.28;
  toroidGroup.add(toroidCap);

  const toroidBolt = createHexSocketScrew(0.035, 0.62, 'Fastener_HexM8_ToroidCenter');
  toroidBolt.position.y = 0.32;
  toroidGroup.add(toroidBolt);
  internalGroup.add(toroidGroup);

  // --------------------------------------------------------------------------
  // 6. 6-Layer FR-4 SmartSEM Control Motherboard (PCB_Motherboard)
  // --------------------------------------------------------------------------
  const moboGroup = new THREE.Group();
  moboGroup.name = 'PCB_Motherboard';
  moboGroup.position.set(-1.65, 4.35, -1.65);

  // Brushed DIN mounting bracket backing plate + steel support posts to basePlinth
  const dinBackplate = new THREE.Mesh(
    new THREE.BoxGeometry(3.16, 2.34, 0.06),
    MAT_316SS_BRUSHED
  );
  dinBackplate.position.z = 0.25;
  dinBackplate.name = 'Body_MoboDINBracket';
  moboGroup.add(dinBackplate);

  const pcbBoard = new THREE.Mesh(
    new THREE.BoxGeometry(2.90, 2.15, 0.06),
    MAT_PCB_FR4
  );
  moboGroup.add(pcbBoard);

  // 6 M3 brass hex standoffs + DIN 912 hex socket cap screws securing PCB to DIN bracket
  [
    [-1.32, 0.95],
    [0.0, 0.95],
    [1.32, 0.95],
    [-1.32, -0.95],
    [0.0, -0.95],
    [1.32, -0.95],
  ].forEach(([px, py], idx) => {
    const standoff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.22, 6),
      MAT_BRASS_GOLD
    );
    standoff.rotation.x = Math.PI / 2;
    standoff.position.set(px, py, 0.13);
    moboGroup.add(standoff);

    const pcbScrew = createHexSocketScrew(0.016, 0.05, `Fastener_HexM3_PCB_0${idx + 1}`);
    pcbScrew.rotation.x = -Math.PI / 2;
    pcbScrew.position.set(px, py, -0.04);
    moboGroup.add(pcbScrew);
  });

  // 176-Pin LQFP ARM Cortex-M7 Microcontroller (Part_MCU_ARM) w/ gold gull-wing leads & laser marking
  const mcuGroup = new THREE.Group();
  mcuGroup.name = 'Part_MCU_ARM';
  mcuGroup.position.set(-0.45, 0.22, -0.06);

  const mcuChip = new THREE.Mesh(
    new THREE.BoxGeometry(0.60, 0.60, 0.06),
    MAT_IC_EPOXY
  );
  mcuGroup.add(mcuChip);

  // Gold gull-wing lead arrays on all 4 sides of the 176-pin LQFP
  for (let p = 0; p < 22; p++) {
    const off = -0.25 + (p / 21) * 0.50;
    const leadTop = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.06, 0.025), MAT_BRASS_GOLD);
    leadTop.position.set(off, 0.32, 0.015);
    mcuGroup.add(leadTop);

    const leadBot = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.06, 0.025), MAT_BRASS_GOLD);
    leadBot.position.set(off, -0.32, 0.015);
    mcuGroup.add(leadBot);

    const leadL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.025), MAT_BRASS_GOLD);
    leadL.position.set(-0.32, off, 0.015);
    mcuGroup.add(leadL);

    const leadR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.025), MAT_BRASS_GOLD);
    leadR.position.set(0.32, off, 0.015);
    mcuGroup.add(leadR);
  }

  // Procedural vector CanvasTexture laser marking "ARM Cortex-M7"
  const mcuLabel = makeComponentLabel(
    'ARM Cortex-M7',
    '176-LQFP · ZEISS SCAN',
    0.54,
    0.54,
    '#14171f',
    '#f8fafc',
    '#38bdf8'
  );
  mcuLabel.position.z = -0.032;
  mcuGroup.add(mcuLabel);
  moboGroup.add(mcuGroup);

  // Dual TSOP-54 Synchronous DRAM Chips (Part_RAM_Chip — ISSI SDRAM)
  const ramGroup = new THREE.Group();
  ramGroup.name = 'Part_RAM_Chip';
  ramGroup.position.set(0.58, 0.42, -0.05);

  [-0.22, 0.22].forEach((ry, idx) => {
    const ramPkg = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.28, 0.05),
      MAT_IC_EPOXY
    );
    ramPkg.position.y = ry;
    ramGroup.add(ramPkg);

    const ramLbl = makeComponentLabel(
      'ISSI SDRAM',
      `512MB TSOP-54 · CH${idx + 1}`,
      0.50,
      0.22,
      '#14171f',
      '#e2e8f0',
      '#94a3b8'
    );
    ramLbl.position.set(0.0, ry, -0.027);
    ramGroup.add(ramLbl);
  });
  moboGroup.add(ramGroup);

  // 256 GB NVMe Solid-State Storage Module (Part_SSD_Module)
  const ssdGroup = new THREE.Group();
  ssdGroup.name = 'Part_SSD_Module';
  ssdGroup.position.set(0.58, -0.35, -0.05);

  const ssdPkg = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.44, 0.06),
    MAT_DARK_ANODIZED
  );
  ssdGroup.add(ssdPkg);

  const ssdEdge = new THREE.Mesh(
    new THREE.BoxGeometry(0.10, 0.36, 0.04),
    MAT_BRASS_GOLD
  );
  ssdEdge.position.x = -0.35;
  ssdGroup.add(ssdEdge);

  const ssdLbl = makeComponentLabel(
    '256GB NVMe',
    'INDUSTRIAL GLP FLASH',
    0.58,
    0.34,
    '#0f172a',
    '#38bdf8',
    '#22c55e'
  );
  ssdLbl.position.z = -0.032;
  ssdGroup.add(ssdLbl);
  moboGroup.add(ssdGroup);

  // Castellated Wi-Fi 802.11ac / BLE Shielded Radio Module (WiFi_BLE)
  // U.FL pad at (-0.98, -0.50, -0.07) local => world (-2.63, 3.85, -1.72)
  const wifiGroup = new THREE.Group();
  wifiGroup.name = 'WiFi_BLE';
  wifiGroup.position.set(-0.98, -0.40, -0.05);

  const wifiShieldCan = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.38, 0.06),
    MAT_316SS_POLISHED
  );
  wifiGroup.add(wifiShieldCan);

  const wifiLbl = makeComponentLabel(
    'Wi-Fi / BLE',
    '802.11ac + BT 5.2',
    0.40,
    0.26,
    '#1e293b',
    '#f8fafc',
    '#38bdf8'
  );
  wifiLbl.position.set(0.0, 0.04, -0.032);
  wifiGroup.add(wifiLbl);

  // Gold U.FL connector pad aligned cleanly at world (-2.63, 3.85, -1.72)
  const uflPad = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.04, 14),
    MAT_BRASS_GOLD
  );
  uflPad.rotation.x = Math.PI / 2;
  uflPad.position.set(0.0, -0.10, -0.02);
  wifiGroup.add(uflPad);
  moboGroup.add(wifiGroup);

  // CR2032 Coin-Cell RTC Battery Holder, 24-bit ADC & Green Phoenix Terminal Headers
  const cr2032 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.05, 20),
    MAT_316SS_POLISHED
  );
  cr2032.rotation.x = Math.PI / 2;
  cr2032.position.set(-1.02, 0.45, -0.05);
  moboGroup.add(cr2032);

  const adcChip = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.32, 0.05),
    MAT_IC_EPOXY
  );
  adcChip.position.set(-0.02, -0.32, -0.05);
  adcChip.name = 'Body_ADC24Bit';
  moboGroup.add(adcChip);

  const phoenixHeader = new THREE.Mesh(
    new THREE.BoxGeometry(1.48, 0.22, 0.16),
    MAT_PHOENIX_GREEN
  );
  phoenixHeader.position.set(0.0, -0.82, -0.09);
  moboGroup.add(phoenixHeader);

  internalGroup.add(moboGroup);

  // --------------------------------------------------------------------------
  // 7. Rear Bulkhead I/O Panel, Cooling Blower & External Dipole Antenna
  // --------------------------------------------------------------------------
  const bulkheadGroup = new THREE.Group();
  bulkheadGroup.name = 'Body_RearBulkheadIO';
  bulkheadGroup.position.set(-3.20, 2.85, 5.02);

  const bulkheadPlate = new THREE.Mesh(
    new THREE.BoxGeometry(5.80, 3.80, 0.08),
    MAT_316SS_BRUSHED
  );
  bulkheadGroup.add(bulkheadPlate);

  // Fan_CabinetCooling_Blower (7 angled blades + concentric chrome finger-guard rings)
  const fanGroup = new THREE.Group();
  fanGroup.name = 'Fan_CabinetCooling_Blower';
  fanGroup.position.set(-1.55, 0.55, 0.04);

  const fanFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 1.35, 0.30),
    MAT_RUBBER_EPDM
  );
  fanGroup.add(fanFrame);

  const fanHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.32, 20),
    MAT_DARK_ANODIZED
  );
  fanHub.rotation.x = Math.PI / 2;
  fanGroup.add(fanHub);

  for (let b = 0; b < 7; b++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.38, 0.04),
      MAT_DARK_ANODIZED
    );
    const ang = (b / 7) * Math.PI * 2;
    blade.position.set(Math.cos(ang) * 0.36, Math.sin(ang) * 0.36, 0.0);
    blade.rotation.z = ang + 0.45;
    blade.rotation.y = 0.38;
    fanGroup.add(blade);
  }

  [0.28, 0.42, 0.56].forEach(gr => {
    const guardRing = new THREE.Mesh(
      new THREE.TorusGeometry(gr, 0.014, 10, 28),
      MAT_316SS_POLISHED
    );
    guardRing.position.z = 0.17;
    fanGroup.add(guardRing);
  });

  [0, Math.PI / 2].forEach(ra => {
    const strut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 1.16, 8),
      MAT_316SS_POLISHED
    );
    strut.position.z = 0.17;
    strut.rotation.z = ra;
    fanGroup.add(strut);
  });
  bulkheadGroup.add(fanGroup);

  // Port_IEC at X_local = +1.70, Y_local = -0.70 (world = -1.50, 2.15, 5.08) w/ dynamic breaker light
  const portIEC = new THREE.Group();
  portIEC.name = 'Port_IEC';
  portIEC.position.set(1.70, -0.70, 0.06);

  const iecBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.54, 0.72, 0.18),
    MAT_RUBBER_EPDM
  );
  portIEC.add(iecBody);

  // 3 recessed brass IEC mains blades facing +Z
  [-0.10, 0.10].forEach(bx => {
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.08, 0.08), MAT_BRASS_GOLD);
    pin.position.set(bx, -0.18, 0.09);
    portIEC.add(pin);
  });
  const gndBlade = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.10, 0.09), MAT_BRASS_GOLD);
  gndBlade.position.set(0.0, -0.10, 0.09);
  portIEC.add(gndBlade);

  const breakerMat = makeMat(0x22c55e, { r: 0.25, m: 0.10, e: 0x16a34a, ei: 0.90 });
  const breakerRocker = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.26, 0.12),
    breakerMat
  );
  breakerRocker.position.set(0.0, 0.16, 0.08);
  breakerRocker.name = 'Body_IECBreakerRocker';
  portIEC.add(breakerRocker);
  bulkheadGroup.add(portIEC);

  function setBreakerLit(isPowered) {
    const lit = Boolean(isPowered);
    breakerMat.color.setHex(lit ? 0x22c55e : 0x14532d);
    breakerMat.emissive.setHex(lit ? 0x16a34a : 0x000000);
    breakerMat.emissiveIntensity = lit ? 0.95 : 0.0;
    breakerMat.needsUpdate = true;
  }

  // Port_RS232 with genuine 3D DB9 pins + jackscrews
  const portRS232 = new THREE.Group();
  portRS232.name = 'Port_RS232';
  portRS232.position.set(0.35, 0.85, 0.06);
  portRS232.add(new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.22, 0.12), MAT_316SS_POLISHED));
  const db9Pocket = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.04), MAT_DARK_ANODIZED);
  db9Pocket.position.z = 0.055;
  portRS232.add(db9Pocket);
  for (let p = 0; p < 5; p++) {
    const pinTop = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.05, 8), MAT_BRASS_GOLD);
    pinTop.rotation.x = Math.PI / 2;
    pinTop.position.set(-0.09 + p * 0.045, 0.03, 0.075);
    portRS232.add(pinTop);
  }
  for (let p = 0; p < 4; p++) {
    const pinBot = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.05, 8), MAT_BRASS_GOLD);
    pinBot.rotation.x = Math.PI / 2;
    pinBot.position.set(-0.0675 + p * 0.045, -0.03, 0.075);
    portRS232.add(pinBot);
  }
  [-0.18, 0.18].forEach((jx, idx) => {
    const jack = createHexSocketScrew(0.012, 0.03, `Fastener_HexM3_RS232_0${idx + 1}`);
    jack.rotation.x = Math.PI / 2;
    jack.position.set(jx, 0.0, 0.06);
    portRS232.add(jack);
  });
  bulkheadGroup.add(portRS232);

  // Port_USB
  const portUSB = new THREE.Group();
  portUSB.name = 'Port_USB';
  portUSB.position.set(0.95, 0.85, 0.06);
  portUSB.add(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.14), MAT_316SS_POLISHED));
  const usbTongue = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.06), MAT_BLUE_ANODIZED);
  usbTongue.position.z = 0.06;
  portUSB.add(usbTongue);
  bulkheadGroup.add(portUSB);

  // USB_Drive anodized stick
  const usbDrive = new THREE.Group();
  usbDrive.name = 'USB_Drive';
  usbDrive.position.set(1.35, 0.85, 0.18);
  usbDrive.add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.10, 0.36), MAT_BLUE_ANODIZED));
  const usbLed = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.03, 0.04),
    makeMat(0x22c55e, { r: 0.2, m: 0.1, e: 0x22c55e, ei: 1.2 })
  );
  usbLed.position.set(0.0, 0.04, 0.14);
  usbDrive.add(usbLed);
  bulkheadGroup.add(usbDrive);

  // Port_RJ45 with amber/green activity LEDs
  const portRJ45 = new THREE.Group();
  portRJ45.name = 'Port_RJ45';
  portRJ45.position.set(1.75, 0.85, 0.06);
  portRJ45.add(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.14), MAT_316SS_POLISHED));
  const rjLEDGreen = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.04, 0.04),
    makeMat(0x22c55e, { r: 0.2, e: 0x22c55e, ei: 1.4 })
  );
  rjLEDGreen.position.set(-0.08, 0.09, 0.07);
  portRJ45.add(rjLEDGreen);
  const rjLEDAmber = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.04, 0.04),
    makeMat(0xf59e0b, { r: 0.2, e: 0xf59e0b, ei: 1.2 })
  );
  rjLEDAmber.position.set(0.08, 0.09, 0.07);
  portRJ45.add(rjLEDAmber);
  bulkheadGroup.add(portRJ45);

  // Antenna_WiFi at (+2.35, +0.85, 0.0) => world (-0.85, 3.70, 5.02)
  const antennaWiFi = new THREE.Group();
  antennaWiFi.name = 'Antenna_WiFi';
  antennaWiFi.position.set(2.35, 0.85, 0.0);

  const smaNut = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 6), MAT_BRASS_GOLD);
  smaNut.rotation.x = Math.PI / 2;
  smaNut.position.z = 0.08;
  antennaWiFi.add(smaNut);

  const whipKnuckle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.14, 14), MAT_DARK_ANODIZED);
  whipKnuckle.rotation.x = Math.PI / 2;
  whipKnuckle.position.z = 0.18;
  antennaWiFi.add(whipKnuckle);

  const whipRadome = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.062, 1.35, 16), MAT_RUBBER_EPDM);
  whipRadome.position.set(0.0, 0.66, 0.22);
  antennaWiFi.add(whipRadome);
  bulkheadGroup.add(antennaWiFi);

  // Brass Swagelok Chiller Coolant Bulkhead Unions (world -3.55 / -3.15, 2.00, 5.10)
  [-0.35, 0.05].forEach((cx, idx) => {
    const swagelok = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.26, 6),
      MAT_BRASS_GOLD
    );
    swagelok.rotation.x = Math.PI / 2;
    swagelok.position.set(cx, -0.85, 0.08);
    swagelok.name = `Body_SwagelokBulkhead_0${idx + 1}`;
    bulkheadGroup.add(swagelok);
  });

  internalGroup.add(bulkheadGroup);

  // --------------------------------------------------------------------------
  // 8. Clean End-to-End Harnesses (ZERO PCB or Outer Wall Intersections!)
  // --------------------------------------------------------------------------
  // 8A. AC Mains Brown (Live), Blue (Neutral), Green/Yellow (Protective Earth)
  internalGroup.add(
    makeWiringHarness(
      [
        [-1.50, 2.15, 4.94],
        [-1.56, 1.68, 4.10],
        [-1.65, 1.50, 3.10],
        [-1.65, 3.92, 2.95],
      ],
      0.030,
      MAT_WIRE_AC_BROWN,
      'Body_Wire_ACLive_Brown'
    )
  );
  internalGroup.add(
    makeWiringHarness(
      [
        [-1.42, 2.15, 4.94],
        [-1.48, 1.62, 4.05],
        [-1.55, 1.50, 3.05],
        [-1.55, 3.92, 2.90],
      ],
      0.030,
      MAT_WIRE_AC_BLUE,
      'Body_Wire_ACNeutral_Blue'
    )
  );
  internalGroup.add(
    makeWiringHarness(
      [
        [-1.58, 2.15, 4.94],
        [-1.78, 1.08, 4.35],
        [-1.82, 1.50, 3.15],
        [-1.82, 3.92, 2.92],
      ],
      0.030,
      MAT_WIRE_PE_GRNYLW,
      'Body_Wire_ProtectiveEarth'
    )
  );

  // 8B. 24 VDC Harnesses from PSU Barrier Strip (z = 1.73) under PCB tray (y = 3.15) to Phoenix Header (-1.72)
  internalGroup.add(
    makeWiringHarness(
      [
        [-1.85, 3.88, 1.73],
        [-1.85, 3.15, 0.35],
        [-1.85, 3.15, -1.74],
        [-1.85, 3.53, -1.74],
      ],
      0.034,
      MAT_WIRE_DC_RED,
      'Body_Wire_DC24V_Red'
    )
  );
  internalGroup.add(
    makeWiringHarness(
      [
        [-1.72, 3.88, 1.73],
        [-1.72, 3.12, 0.35],
        [-1.72, 3.12, -1.74],
        [-1.72, 3.53, -1.74],
      ],
      0.034,
      MAT_WIRE_DC_BLACK,
      'Body_Wire_DC24V_Black'
    )
  );
  internalGroup.add(
    makeWiringHarness(
      [
        [-2.25, 3.88, 1.73],
        [-2.58, 5.10, 0.85],
        [-2.82, 6.25, -0.20],
      ],
      0.034,
      MAT_WIRE_DC_RED,
      'Body_Wire_TurboPower24V'
    )
  );

  // 8C. Body_Wire_WiFiCoax_UFL: exact channel route from WiFi_BLE (-2.63, 3.85, -1.72) -> Antenna_WiFi (-0.85, 3.70, 5.02)
  internalGroup.add(
    makeWiringHarness(
      [
        [-2.63, 3.85, -1.72],
        [-2.63, 3.10, -1.72],
        [-1.45, 3.10, -0.10],
        [-0.85, 3.10, 1.50],
        [-0.85, 3.42, 3.60],
        [-0.85, 3.70, 4.95],
        [-0.85, 3.70, 5.02],
      ],
      0.022,
      MAT_RUBBER_EPDM,
      'Body_Wire_WiFiCoax_UFL'
    )
  );

  // 8D. Closed-Loop Chiller Coolant Lines (Swagelok Rear Unions -> Objective Water Jacket)
  internalGroup.add(
    makeWiringHarness(
      [
        [-3.55, 2.00, 4.98],
        [-3.55, 5.85, 2.45],
        [-3.08, 11.05, 0.35],
      ],
      0.046,
      MAT_COOLANT_BLUE,
      'Body_Wire_CoolantSupply_Blue'
    )
  );
  internalGroup.add(
    makeWiringHarness(
      [
        [-3.15, 2.00, 4.98],
        [-3.15, 5.85, 2.45],
        [-2.96, 11.05, 0.35],
      ],
      0.046,
      MAT_COOLANT_RED,
      'Body_Wire_CoolantReturn_Red'
    )
  );

  // 8E. Detector BNC Coax & PT100 Sensor Bus routed cleanly clear of PCB faces
  internalGroup.add(
    makeWiringHarness(
      [
        [-1.75, 9.72, -0.35],
        [-0.95, 7.20, 0.25],
        [-0.95, 5.55, -0.95],
        [-1.15, 5.55, -1.72],
        [-1.25, 5.30, -1.72],
      ],
      0.028,
      MAT_WIRE_DATA_GREY,
      'Body_Wire_DetectorCoax'
    )
  );
  internalGroup.add(
    makeWiringHarness(
      [
        [-3.02, 11.05, 0.35],
        [-1.10, 7.35, 0.45],
        [-1.10, 5.65, -0.95],
        [-1.35, 5.65, -1.72],
        [-1.45, 5.30, -1.72],
      ],
      0.026,
      MAT_WIRE_SENSOR_CYAN,
      'Body_Wire_SensorBus'
    )
  );

  return {
    internalGroup,
    turboGroup,
    scrollGroup,
    hvTankGroup,
    psuGroup,
    moboGroup,
    bulkheadGroup,
    setBreakerLit,
  };
}
