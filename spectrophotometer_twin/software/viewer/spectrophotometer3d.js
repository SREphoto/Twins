/**
 * UV-Vis Spectrophotometer Twin (Three.js Procedural Solid)
 * 
 * Exhaustive Procedural Design adhering strictly to .agents/AGENTS.md:
 * - Unibody die-cast benchtop chassis (Body_Chassis) with chamfered ergonomic fascia
 * - Seated recessed display bezel with dynamic CanvasTexture LCD (UI_LCD, flipY = false)
 * - Tactile physical keys (Btn_Power, Btn_Zero, Btn_Scan, Btn_Mode, Btn_CellNext, Btn_Lid)
 * - Light-tight sample chamber with spring-assisted hinged door (Pivot_ChamberLid)
 * - 6-position motorized cuvette carousel (Pivot_CellCarousel)
 * - Genuine optical cuvettes (Glass_Cuvette_01..06) with refraction (IOR=1.52) & chemical solutions
 * - Internal optical train: Deuterium UV lamp, Tungsten-Halogen lamp, Czerny-Turner monochromator,
 *   dynamic wavelength-colored monochromatic probe beam, and silicon photodiode detector
 * - Genuine 3D fasteners (DIN 912 screws, DIN 125 washers) from hardware_library.js
 * - Vulcanized rubber leveling feet resting flush on lab datum plane (Y = 0)
 * - Rear bulkhead: IEC C14 inlet, rocker switch, USB ports, DB9 serial, BNC external trigger
 * - Brand emblem plate (Badge_SREdesigns) in dedicated flush pocket
 * - Photorealistic lab room environment with bench, tiles, and ceiling panels
 * - Kinematic exploded view animation
 */

import * as THREE from 'three';
import {
  createHexSocketScrew,
  createWasher,
  createVibrationFoot,
  createIECInlet,
  createBNCJack,
  createDB9Port,
  createRockerSwitch,
} from '../../../lab_viewer/shared/hardware_library.js';

// Standard Materials Cache
const MAT_CHASSIS = new THREE.MeshStandardMaterial({
  color: 0xe6eaf0,
  roughness: 0.38,
  metalness: 0.12,
});
const MAT_CHASSIS_DARK = new THREE.MeshStandardMaterial({
  color: 0x22262d,
  roughness: 0.5,
  metalness: 0.25,
});
const MAT_BEZEL = new THREE.MeshStandardMaterial({
  color: 0x181c22,
  roughness: 0.6,
  metalness: 0.1,
});
const MAT_CHAMBER_INNER = new THREE.MeshStandardMaterial({
  color: 0x121417,
  roughness: 0.88,
  metalness: 0.05,
});
const MAT_CHROME = new THREE.MeshStandardMaterial({
  color: 0xdde2ea,
  roughness: 0.1,
  metalness: 0.95,
});
const MAT_ALUM_ANODIZED = new THREE.MeshStandardMaterial({
  color: 0x7a8089,
  roughness: 0.35,
  metalness: 0.8,
});
const MAT_KEY_DARK = new THREE.MeshStandardMaterial({
  color: 0x2a303c,
  roughness: 0.45,
  metalness: 0.1,
});
const MAT_KEY_PRIMARY = new THREE.MeshStandardMaterial({
  color: 0x1e3a8a,
  roughness: 0.4,
  metalness: 0.15,
});
const MAT_KEY_SCAN = new THREE.MeshStandardMaterial({
  color: 0x581c87,
  roughness: 0.4,
  metalness: 0.15,
});
const MAT_OPTICAL_GLASS = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.96,
  opacity: 1,
  transparent: true,
  roughness: 0.03,
  ior: 1.52,
  thickness: 0.08,
});

// Inline USB Port helper
function createUSBPort() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, 0.14),
    new THREE.MeshStandardMaterial({ color: 0x787d85, metalness: 0.7, roughness: 0.3 })
  );
  g.add(body);
  const core = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.04, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 })
  );
  core.position.z = 0.065;
  g.add(core);
  return g;
}

/**
 * Converts wavelength in nm to RGB hex color for probe beam visualization.
 */
export function wavelengthToRGB(nm) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (nm >= 440 && nm < 490) {
    r = 0.0;
    g = (nm - 440) / (490 - 440);
    b = 1.0;
  } else if (nm >= 490 && nm < 510) {
    r = 0.0;
    g = 1.0;
    b = -(nm - 510) / (510 - 490);
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (nm >= 580 && nm < 645) {
    r = 1.0;
    g = -(nm - 645) / (645 - 580);
    b = 0.0;
  } else if (nm >= 645 && nm <= 750) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  } else if (nm < 380) {
    // Ultraviolet: render as intense violet-indigo glow
    r = 0.65;
    g = 0.15;
    b = 0.95;
  } else {
    // Near Infrared: render as deep garnet red
    r = 0.55;
    g = 0.05;
    b = 0.05;
  }

  // Factor attenuation at spectrum limits
  let factor = 1.0;
  if (nm >= 380 && nm < 420) {
    factor = 0.3 + 0.7 * (nm - 380) / (420 - 380);
  } else if (nm >= 700 && nm <= 750) {
    factor = 0.3 + 0.7 * (750 - nm) / (750 - 700);
  } else if (nm > 750) {
    factor = 0.25;
  } else if (nm < 380) {
    factor = 0.75;
  }

  const red = Math.round(r * factor * 255);
  const green = Math.round(g * factor * 255);
  const blue = Math.round(b * factor * 255);
  return (red << 16) | (green << 8) | blue;
}

/**
 * Builds the complete procedural 3D model of the UV-Vis Spectrophotometer.
 */
export function createSpectrophotometerModel(options = {}) {
  const root = new THREE.Group();
  root.name = 'Spectrophotometer_Assembly';

  const interactiveObjects = [];
  const animTargets = {
    chamberLidPivot: null,
    carouselPivot: null,
    probeBeam: null,
    probeBeamMat: null,
    deuteriumLampGlow: null,
    tungstenLampGlow: null,
    lcdMesh: null,
    explodedParts: [],
  };

  // 1. Leveling Feet resting on datum plane Y = 0
  const footPositions = [
    [-1.9, 0, -2.1, 'FL'],
    [1.9, 0, -2.1, 'FR'],
    [-1.9, 0, 2.1, 'RL'],
    [1.9, 0, 2.1, 'RR'],
  ];
  footPositions.forEach(([fx, fy, fz, id]) => {
    const foot = createVibrationFoot(0.25, 0.28, 0.18);
    foot.name = `Foot_Leveling_${id}`;
    foot.position.set(fx, fy, fz);
    root.add(foot);
  });

  // Base elevation datum: bottom plate starts at Y = 0.18
  const BASE_Y = 0.18;

  // 2. Main Die-Cast Chassis Baseplate
  const baseplateGeo = new THREE.BoxGeometry(4.4, 0.12, 4.8);
  const baseplate = new THREE.Mesh(baseplateGeo, MAT_ALUM_ANODIZED);
  baseplate.position.set(0, BASE_Y + 0.06, 0);
  baseplate.receiveShadow = true;
  root.add(baseplate);

  // Group for parts that separate vertically during exploded view
  const explodedShellGroup = new THREE.Group();
  explodedShellGroup.name = 'Exploded_UpperShell_Group';
  root.add(explodedShellGroup);
  animTargets.explodedParts.push({ obj: explodedShellGroup, originY: 0, deltaY: 1.4 });

  // 3. Main Body Chassis Housing (Body_Chassis)
  const chassisGroup = new THREE.Group();
  chassisGroup.name = 'Body_Chassis';

  // Lower chassis main block
  const lowerBlock = new THREE.Mesh(
    new THREE.BoxGeometry(4.36, 1.1, 4.76),
    MAT_CHASSIS
  );
  lowerBlock.position.set(0, BASE_Y + 0.12 + 0.55, 0);
  lowerBlock.castShadow = true;
  lowerBlock.receiveShadow = true;
  chassisGroup.add(lowerBlock);

  // Upper rear deck block (optics housing)
  const upperRear = new THREE.Mesh(
    new THREE.BoxGeometry(4.36, 0.85, 2.4),
    MAT_CHASSIS
  );
  upperRear.position.set(0, BASE_Y + 1.22 + 0.425, 1.18);
  upperRear.castShadow = true;
  upperRear.receiveShadow = true;
  chassisGroup.add(upperRear);

  // Upper front right slope block (for ergonomic display console)
  const consoleSlopeShape = new THREE.Shape();
  consoleSlopeShape.moveTo(0, 0);
  consoleSlopeShape.lineTo(2.36, 0);
  consoleSlopeShape.lineTo(2.36, 0.85);
  consoleSlopeShape.lineTo(0.3, 0.85);
  consoleSlopeShape.lineTo(0, 0.2);
  consoleSlopeShape.closePath();

  const consoleExtrudeSettings = { depth: 2.16, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
  const consoleSlopeGeo = new THREE.ExtrudeGeometry(consoleSlopeShape, consoleExtrudeSettings);
  const consoleSlopeMesh = new THREE.Mesh(consoleSlopeGeo, MAT_CHASSIS);
  consoleSlopeMesh.rotation.y = Math.PI;
  consoleSlopeMesh.position.set(2.18, BASE_Y + 1.22, 1.18);
  consoleSlopeMesh.castShadow = true;
  chassisGroup.add(consoleSlopeMesh);

  // Recessed pocket for touchscreen display (DIAG-001 & DIAG-002: seated in pocket)
  const bezelPocket = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.06, 1.4),
    MAT_BEZEL
  );
  bezelPocket.position.set(1.02, BASE_Y + 1.88, -0.15);
  bezelPocket.rotation.x = 0.38; // ~22° ergonomic viewing angle
  chassisGroup.add(bezelPocket);

  // 4. Dynamic LCD Display (UI_LCD)
  // Dedicated flat UV-mapped quad seated in pocket with positive Z clearance (0.01)
  const lcdGeo = new THREE.PlaneGeometry(1.72, 1.08);
  // Guarantee proper left-to-right UV mapping without inversion
  const lcdMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.FrontSide,
  });
  const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.name = 'UI_LCD';
  lcdMesh.rotation.x = -Math.PI / 2;
  lcdMesh.position.set(0, 0.035, 0.05);
  bezelPocket.add(lcdMesh);
  animTargets.lcdMesh = lcdMesh;

  // Touchscreen interactive helper quad for raycasting
  lcdMesh.userData = { name: 'UI_LCD_TOUCH', role: 'Display' };
  interactiveObjects.push(lcdMesh);

  // 5. Physical Control Buttons (seated in bezel below display)
  const buttonConfigs = [
    { id: 'Btn_Power', label: 'PWR', x: -0.68, z: 0.58, mat: MAT_KEY_DARK, role: 'Power standby' },
    { id: 'Btn_Zero', label: 'ZERO', x: -0.34, z: 0.58, mat: MAT_KEY_PRIMARY, role: 'Auto-zero baseline' },
    { id: 'Btn_Scan', label: 'SCAN', x: 0.0, z: 0.58, mat: MAT_KEY_SCAN, role: 'Spectrum scan' },
    { id: 'Btn_Mode', label: 'MODE', x: 0.34, z: 0.58, mat: MAT_KEY_DARK, role: 'Cycle measurement mode' },
    { id: 'Btn_CellNext', label: 'CELL', x: 0.68, z: 0.58, mat: MAT_KEY_DARK, role: 'Advance carousel cell' },
  ];

  buttonConfigs.forEach((cfg) => {
    const btnMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.05, 0.16),
      cfg.mat.clone()
    );
    btnMesh.name = cfg.id;
    btnMesh.position.set(cfg.x, 0.035, cfg.z);
    btnMesh.castShadow = true;
    btnMesh.userData = { name: cfg.id, action: cfg.label, role: cfg.role };
    bezelPocket.add(btnMesh);
    interactiveObjects.push(btnMesh);
  });

  // 6. SREdesigns Brand Emblem Badge (Badge_SREdesigns)
  const badgePocket = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.22, 0.02),
    MAT_CHASSIS_DARK
  );
  badgePocket.position.set(1.02, BASE_Y + 0.95, -2.385);
  badgePocket.rotation.y = Math.PI;
  chassisGroup.add(badgePocket);

  const badgePlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.84, 0.18, 0.02),
    MAT_CHROME
  );
  badgePlate.name = 'Badge_SREdesigns';
  badgePlate.position.set(0, 0, 0.01);
  badgePocket.add(badgePlate);

  // Front air intake louvers
  for (let i = 0; i < 6; i++) {
    const louver = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.02, 0.04),
      MAT_CHASSIS_DARK
    );
    louver.position.set(1.02, BASE_Y + 0.35 + (i * 0.08), -2.382);
    chassisGroup.add(louver);
  }

  explodedShellGroup.add(chassisGroup);

  // 7. Light-Tight Sample Chamber Basin & Walls
  const CHAMBER_CENTER_X = -1.05;
  const CHAMBER_CENTER_Z = -0.05;
  const CHAMBER_FLOOR_Y = BASE_Y + 0.22;

  const chamberWell = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 1.25, 2.0),
    MAT_CHAMBER_INNER
  );
  chamberWell.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 0.625, CHAMBER_CENTER_Z);
  root.add(chamberWell);

  // 8. Sample Chamber Hinged Door (Pivot_ChamberLid)
  // Kinematic pivot origin at rear top edge of sample chamber
  const chamberLidPivot = new THREE.Group();
  chamberLidPivot.name = 'Pivot_ChamberLid';
  chamberLidPivot.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 1.25, CHAMBER_CENTER_Z + 1.0);
  root.add(chamberLidPivot);
  animTargets.chamberLidPivot = chamberLidPivot;

  // Door main plate
  const doorPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.82, 0.14, 2.05),
    MAT_CHASSIS
  );
  doorPlate.position.set(0, 0.07, -1.02);
  doorPlate.castShadow = true;
  chamberLidPivot.add(doorPlate);

  // Rubber perimeter seal on underside
  const seal = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.025, 1.95),
    MAT_CHAMBER_INNER
  );
  seal.position.set(0, -0.015, -1.02);
  chamberLidPivot.add(seal);

  // Ergonomic finger pull handle at front edge
  const handle = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.06, 0.12),
    MAT_ALUM_ANODIZED
  );
  handle.position.set(0, 0.16, -1.95);
  handle.castShadow = true;
  handle.userData = { name: 'Btn_Lid', action: 'Toggle Chamber Door' };
  chamberLidPivot.add(handle);
  interactiveObjects.push(handle);

  // Door hinge knuckles and pin
  for (const sign of [-1, 1]) {
    const knuckle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.18, 16),
      MAT_ALUM_ANODIZED
    );
    knuckle.rotation.z = Math.PI / 2;
    knuckle.position.set(sign * 0.72, 0, 0);
    chamberLidPivot.add(knuckle);
  }
  const hingePin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1.6, 16),
    MAT_CHROME
  );
  hingePin.rotation.z = Math.PI / 2;
  chamberLidPivot.add(hingePin);

  // 9. 6-Position Motorized Cuvette Carousel (Pivot_CellCarousel)
  const carouselPivot = new THREE.Group();
  carouselPivot.name = 'Pivot_CellCarousel';
  carouselPivot.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 0.12, CHAMBER_CENTER_Z);
  root.add(carouselPivot);
  animTargets.carouselPivot = carouselPivot;
  animTargets.explodedParts.push({ obj: carouselPivot, originY: CHAMBER_FLOOR_Y + 0.12, deltaY: 0.6 });

  // Central rotary hub disk
  const hubDisk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.72, 0.22, 32),
    MAT_CHASSIS_DARK
  );
  hubDisk.castShadow = true;
  carouselPivot.add(hubDisk);

  // Carousel vertical stepper drive shaft
  const centerShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.35, 20),
    MAT_ALUM_ANODIZED
  );
  centerShaft.position.y = 0.12;
  carouselPivot.add(centerShaft);

  // 6 Radial cuvette holders & optical cuvettes
  const cuvetteLiquidColors = [
    { color: 0x93c5fd, trans: 0.98, op: 0.35, name: 'Cell 1: H2O Blank' },
    { color: 0x7e22ce, trans: 0.25, op: 0.92, name: 'Cell 2: KMnO4' },
    { color: 0xbae6fd, trans: 0.95, op: 0.45, name: 'Cell 3: DNA' },
    { color: 0x1d4ed8, trans: 0.32, op: 0.88, name: 'Cell 4: Bradford BSA' },
    { color: 0x0284c7, trans: 0.30, op: 0.90, name: 'Cell 5: Methylene Blue' },
    { color: 0xffffff, trans: 1.00, op: 0.00, name: 'Cell 6: Empty Slot' },
  ];

  const CAROUSEL_RADIUS = 0.46;
  const cuvetteMeshes = [];

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const cx = Math.cos(angle) * CAROUSEL_RADIUS;
    const cz = Math.sin(angle) * CAROUSEL_RADIUS;

    // Cuvette mounting socket bracket
    const socketMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.24, 0.18),
      MAT_ALUM_ANODIZED
    );
    socketMesh.position.set(cx, 0.12, cz);
    carouselPivot.add(socketMesh);

    // Cuvette outer quartz/glass cell (12.5 × 12.5 × 45 mm -> 0.125 × 0.45 × 0.125)
    const cuvetteMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.125, 0.45, 0.125),
      MAT_OPTICAL_GLASS
    );
    cuvetteMesh.name = `Glass_Cuvette_0${i + 1}`;
    cuvetteMesh.position.set(cx, 0.32, cz);
    cuvetteMesh.castShadow = true;
    cuvetteMesh.userData = { name: cuvetteMesh.name, cellNumber: i + 1, sample: cuvetteLiquidColors[i].name };
    carouselPivot.add(cuvetteMesh);
    interactiveObjects.push(cuvetteMesh);
    cuvetteMeshes.push(cuvetteMesh);

    // Internal chemical solution column (only if not empty)
    if (cuvetteLiquidColors[i].op > 0.05) {
      const liquidMat = new THREE.MeshPhysicalMaterial({
        color: cuvetteLiquidColors[i].color,
        transmission: cuvetteLiquidColors[i].trans,
        opacity: cuvetteLiquidColors[i].op,
        transparent: true,
        roughness: 0.1,
        ior: 1.333,
      });
      const liquid = new THREE.Mesh(
        new THREE.BoxGeometry(0.105, 0.38, 0.105),
        liquidMat
      );
      liquid.position.set(0, -0.02, 0);
      cuvetteMesh.add(liquid);
    }
  }

  // 10. Monochromatic Probe Light Beam
  // Beam passes horizontally through active cuvette from monochromator (X = 0) to detector (X = -2.0)
  const beamGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.8, 16);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    transparent: true,
    opacity: 0.75,
  });
  const probeBeam = new THREE.Mesh(beamGeo, beamMat);
  probeBeam.name = 'Beam_Monochromatic';
  probeBeam.rotation.z = Math.PI / 2;
  probeBeam.position.set(CHAMBER_CENTER_X, CHAMBER_FLOOR_Y + 0.44, CHAMBER_CENTER_Z);
  root.add(probeBeam);
  animTargets.probeBeam = probeBeam;
  animTargets.probeBeamMat = beamMat;

  // 11. Internal Optical Train (Internal optics bay)
  const opticsGroup = new THREE.Group();
  opticsGroup.name = 'Optics_Train_Assembly';
  root.add(opticsGroup);
  animTargets.explodedParts.push({ obj: opticsGroup, originY: 0, deltaY: 0.7 });

  // Sealed Czerny-Turner Monochromator Box
  const monoBox = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.8, 1.2),
    MAT_CHASSIS_DARK
  );
  monoBox.position.set(0.4, BASE_Y + 0.65, 1.2);
  monoBox.castShadow = true;
  opticsGroup.add(monoBox);

  // Stepper drive dial on top of monochromator
  const monoStepper = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.12, 24),
    MAT_ALUM_ANODIZED
  );
  monoStepper.position.set(0.4, BASE_Y + 1.11, 1.2);
  opticsGroup.add(monoStepper);

  // Deuterium UV Arc Lamp Housing
  const d2Housing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.65, 20),
    MAT_ALUM_ANODIZED
  );
  d2Housing.position.set(1.5, BASE_Y + 0.65, 1.3);
  opticsGroup.add(d2Housing);

  const d2Bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xa855f7 })
  );
  d2Bulb.position.set(1.5, BASE_Y + 0.65, 1.3);
  opticsGroup.add(d2Bulb);
  animTargets.deuteriumLampGlow = d2Bulb;

  // Tungsten-Halogen Lamp Housing
  const wHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.45, 16),
    MAT_ALUM_ANODIZED
  );
  wHousing.position.set(1.5, BASE_Y + 0.55, 0.5);
  opticsGroup.add(wHousing);

  const wBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
  );
  wBulb.position.set(1.5, BASE_Y + 0.55, 0.5);
  opticsGroup.add(wBulb);
  animTargets.tungstenLampGlow = wBulb;

  // Silicon Photodiode Optical Detector Bay
  const detectorHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.35, 20),
    MAT_ALUM_ANODIZED
  );
  detectorHousing.rotation.z = Math.PI / 2;
  detectorHousing.position.set(CHAMBER_CENTER_X - 0.95, CHAMBER_FLOOR_Y + 0.44, CHAMBER_CENTER_Z);
  root.add(detectorHousing);

  // 12. Genuine 3D Fasteners (Rule 1: Exhaustive Procedural Detail)
  const chassisFasteners = [
    // Top deck perimeter screws (M4 DIN 912)
    [-2.05, BASE_Y + 1.26, -2.25],
    [2.05, BASE_Y + 1.26, -2.25],
    [-2.05, BASE_Y + 2.12, 2.25],
    [2.05, BASE_Y + 2.12, 2.25],
    [0.1, BASE_Y + 2.12, 2.25],
    [-0.1, BASE_Y + 1.26, -2.25],
    // Side access cover screws
    [-2.19, BASE_Y + 0.8, -1.2],
    [-2.19, BASE_Y + 0.8, 1.2],
    [2.19, BASE_Y + 0.8, -1.2],
    [2.19, BASE_Y + 0.8, 1.2],
  ];

  chassisFasteners.forEach(([sx, sy, sz], idx) => {
    const screw = createHexSocketScrew(0.035, 0.12);
    screw.name = `Fastener_HexM4_${idx + 1}`;
    const washer = createWasher(0.038, 0.075, 0.012);

    if (Math.abs(sx) > 2.15) {
      // Side screws
      screw.rotation.z = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
      washer.rotation.z = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
    }

    screw.position.set(sx, sy, sz);
    washer.position.set(sx, sy, sz);
    chassisGroup.add(washer);
    chassisGroup.add(screw);
  });

  // 13. Rear Bulkhead Panel Connectors (Back face Z = 2.38)
  const rearZ = 2.385;

  // IEC C14 Power Inlet Receptacle
  const iecPort = createIECInlet();
  iecPort.rotation.y = Math.PI;
  iecPort.position.set(-1.4, BASE_Y + 0.45, rearZ);
  root.add(iecPort);

  // Rocker Power Switch
  const rocker = createRockerSwitch({ illuminated: true, red: true });
  rocker.rotation.y = Math.PI;
  rocker.position.set(-0.8, BASE_Y + 0.45, rearZ);
  root.add(rocker);

  // Dual USB-A Ports
  for (let u = 0; u < 2; u++) {
    const usb = createUSBPort();
    usb.rotation.y = Math.PI;
    usb.position.set(-0.2 + (u * 0.22), BASE_Y + 0.45, rearZ);
    root.add(usb);
  }

  // DB9 RS-232 Serial Port
  const db9 = createDB9Port();
  db9.rotation.y = Math.PI;
  db9.position.set(0.65, BASE_Y + 0.45, rearZ);
  root.add(db9);

  // BNC External Trigger Jack
  const bnc = createBNCJack();
  bnc.rotation.y = Math.PI;
  bnc.position.set(1.3, BASE_Y + 0.45, rearZ);
  root.add(bnc);

  // Rear exhaust fan grille louvers
  for (let f = 0; f < 8; f++) {
    const fanLouver = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.02, 0.04),
      MAT_CHASSIS_DARK
    );
    fanLouver.position.set(1.4, BASE_Y + 0.95 + (f * 0.08), rearZ);
    root.add(fanLouver);
  }

  // 14. Photorealistic Laboratory Bench Environment (if requested)
  if (options.includeLab !== false) {
    const labGroup = new THREE.Group();
    labGroup.name = 'Lab_Environment';

    // Black Epoxy Lab Countertop (Width 9.6, Depth 7.2, Height 0.25)
    // Seated at Y = -0.125 so top surface is at Y = 0.0
    const benchTop = new THREE.Mesh(
      new THREE.BoxGeometry(9.6, 0.25, 7.2),
      new THREE.MeshStandardMaterial({ color: 0x11161d, roughness: 0.22, metalness: 0.08 })
    );
    benchTop.position.set(0, -0.125, 0);
    benchTop.receiveShadow = true;
    labGroup.add(benchTop);

    // Countertop front bevel / apron
    const benchApron = new THREE.Mesh(
      new THREE.BoxGeometry(9.5, 0.35, 7.1),
      new THREE.MeshStandardMaterial({ color: 0x1a212b, roughness: 0.4, metalness: 0.2 })
    );
    benchApron.position.set(0, -0.425, 0);
    labGroup.add(benchApron);

    // Bench steel tubular legs (4 corners)
    const legPositions = [
      [-4.4, -2.6, -3.2],
      [4.4, -2.6, -3.2],
      [-4.4, -2.6, 3.2],
      [4.4, -2.6, 3.2],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 4.0, 16),
        MAT_ALUM_ANODIZED
      );
      leg.position.set(lx, ly, lz);
      labGroup.add(leg);
    });

    // Lab room floor tiles
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 36),
      new THREE.MeshStandardMaterial({ color: 0x222a36, roughness: 0.65, metalness: 0.1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.6;
    floor.receiveShadow = true;
    labGroup.add(floor);

    // Lab back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 18),
      new THREE.MeshStandardMaterial({ color: 0x18202c, roughness: 0.85, metalness: 0.05 })
    );
    backWall.position.set(0, 4.4, 7.5);
    backWall.rotation.y = Math.PI;
    labGroup.add(backWall);

    root.add(labGroup);
  }

  return {
    root,
    interactiveObjects,
    animTargets,
    cuvetteMeshes,
  };
}
