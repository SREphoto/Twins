/**
 * Scientific Industries Vortex-Genie 2 Digital Class Digital Precision Vortex Mixer Twin
 * High-Fidelity Procedural 3D Model & Mechanical Assembly
 *
 * Semantic Part Taxonomy Compliance:
 * - Body_Chassis: Die-cast zinc unibody lower housing with flared skirt & seamless tapered profile
 * - Body_BasePlate: Weighted steel bottom closure plate matching rounded perimeter
 * - Foot_Leveling_FL/FR/RL/RR: 4 vulcanized neoprene suction cup feet resting firmly on Tabletop Datum Y = 0
 * - Body_Ballast_CastIron: Heavy solid cast-iron base ballast block (4 kg equivalent)
 * - Suspension_Isolator_1..4: Elastomeric vibration isolation shock mounts with threaded brass studs
 * - Body_MotorCradle: Stamped steel motor mounting cradle
 * - Motor_Stator_Laminations, Motor_Coil_Left/Right: Heavy shaded-pole AC induction drive motor with copper field windings
 * - Pivot_EccentricDrive_Flywheel, Pivot_EccentricDrive_Pin: Solid brass counterbalance flywheel with 2 mm orbital pin
 * - Body_PCB_MainController: Green FR4 digital speed controller PCB with power transformer, heatsink, triac, filter caps
 * - Pocket_ConsoleBezel: Recessed pocket carved into 25° sloped console face (Anti-Clipping Rule)
 * - Body_Panel_Console: Anodized aluminum faceplate with high-DPI silkscreen labels & speed scale
 * - UI_LCD: Flat quad inside pocket receiving live dynamic CanvasTexture (flipY = false, upright)
 * - Btn_Timer, Btn_Pulse: Tactile momentary switches with mechanical spring travel
 * - Knob_Speed: Fluted optical rotary encoder dial with raised pointer & calibrated scale (Zero overlap with LCD!)
 * - Btn_Switch_Mode: 3-position miniature chrome toggle switch (-20° TOUCH, 0° OFF, +20° CONT)
 * - Body_LED_PowerRun: Molded Fresnel lens dome with dynamic glow material (Amber = Standby, Green = Active)
 * - Pivot_CupHead: Vulcanized rubber cup head with eccentric orbital kinematics (2 mm radius, 4 mm circle)
 * - Body_Sample_FalconTube15mL: Refractive polypropylene tube at natural 14° ergonomic tilt with volumetric graduation markings
 * - Body_Fluid_FalconTube15mL: Dynamic rotational forced-vortex liquid mesh with real-time parabolic meniscus
 * - Body_Assembly_PowerInlet: Rear IEC 60320 C14 connector, fuse drawer, and rocker switch
 * - Body_Assembly_PowerCord: Heavy-duty 3D laboratory AC power cord with molded C13 plug, strain relief, and 3-prong NEMA plug
 * - Badge_SREdesigns: Diamond-cut metallic badge with high-contrast SRE branding & non-overflowing text
 */

import * as THREE from 'three';
import {
  createHexSocketScrew,
  createWasher,
} from '../../../lab_viewer/shared/hardware_library.js';

// Standard Materials Cache
const MAT_CHASSIS_TEAL = new THREE.MeshStandardMaterial({
  color: 0x98a8a8, // Iconic industrial laboratory pale teal / warm gray casting
  roughness: 0.52,
  metalness: 0.18,
  side: THREE.DoubleSide,
});

const MAT_CHASSIS_DARK = new THREE.MeshStandardMaterial({
  color: 0x22262c,
  roughness: 0.65,
  metalness: 0.22,
});

const MAT_BASE_STEEL = new THREE.MeshStandardMaterial({
  color: 0x2a303a,
  roughness: 0.45,
  metalness: 0.65,
});

const MAT_CAST_IRON = new THREE.MeshStandardMaterial({
  color: 0x30343a,
  roughness: 0.88,
  metalness: 0.60,
});

const MAT_STATOR_STEEL = new THREE.MeshStandardMaterial({
  color: 0x3d434c,
  roughness: 0.50,
  metalness: 0.75,
});

const MAT_COPPER_COIL = new THREE.MeshStandardMaterial({
  color: 0xb87333,
  roughness: 0.32,
  metalness: 0.88,
});

const MAT_BRASS = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.28,
  metalness: 0.82,
});

const MAT_PCB_GREEN = new THREE.MeshStandardMaterial({
  color: 0x0f5132,
  roughness: 0.45,
  metalness: 0.12,
});

const MAT_HEATSINK_BLACK = new THREE.MeshStandardMaterial({
  color: 0x181a1e,
  roughness: 0.35,
  metalness: 0.85,
});

const MAT_TRANSFORMER_CORE = new THREE.MeshStandardMaterial({
  color: 0x262930,
  roughness: 0.55,
  metalness: 0.70,
});

const MAT_CORD_NEOPRENE = new THREE.MeshStandardMaterial({
  color: 0x111317,
  roughness: 0.88,
  metalness: 0.05,
});

const MAT_RUBBER_CUP = new THREE.MeshStandardMaterial({
  color: 0x16181b, // Vulcanized matte black rubber
  roughness: 0.94,
  metalness: 0.04,
});

const MAT_RUBBER_FEET = new THREE.MeshStandardMaterial({
  color: 0x111316,
  roughness: 0.96,
  metalness: 0.02,
});

const MAT_ALUM_PANEL = new THREE.MeshStandardMaterial({
  color: 0x252a32,
  roughness: 0.4,
  metalness: 0.4,
});

const MAT_ALUM_BRUSHED = new THREE.MeshStandardMaterial({
  color: 0xb0b8c4,
  roughness: 0.28,
  metalness: 0.82,
});

const MAT_CHROME = new THREE.MeshStandardMaterial({
  color: 0xe2e8f0,
  roughness: 0.08,
  metalness: 0.96,
});

const MAT_KNOB_ABS = new THREE.MeshStandardMaterial({
  color: 0x181a1f,
  roughness: 0.42,
  metalness: 0.1,
});

const MAT_BUTTON_MEMBRANE = new THREE.MeshStandardMaterial({
  color: 0x2a303c,
  roughness: 0.5,
  metalness: 0.15,
});

const MAT_GLASS_TUBE = new THREE.MeshStandardMaterial({
  color: 0xebf8ff,
  roughness: 0.08,
  metalness: 0.02,
  transparent: true,
  opacity: 0.40,
  depthWrite: false,
  side: THREE.DoubleSide,
});

const MAT_TUBE_CAP_BLUE = new THREE.MeshStandardMaterial({
  color: 0x1d4ed8,
  roughness: 0.38,
  metalness: 0.05,
});

const MAT_TUBE_CAP_CLEAR = new THREE.MeshStandardMaterial({
  color: 0xf1f5f9,
  roughness: 0.15,
  metalness: 0.02,
  transparent: true,
  opacity: 0.50,
  depthWrite: false,
  side: THREE.DoubleSide,
});

const LIQUID_COLORS = {
  water: 0x38bdf8,
  ethanol: 0x7dd3fc,
  glycerol_50: 0xfdba74,
  cell_lysate: 0x86efac,
  blood: 0x991b1b,
};

/**
 * Creates a rounded squircle plate with smooth corners and bevel.
 */
function createSquirclePlateGeometry(width, depth, height, cornerExp = 3.6, seg = 48) {
  const halfW = width / 2;
  const halfD = depth / 2;
  const e = 2.0 / cornerExp;

  const shape = new THREE.Shape();
  for (let i = 0; i <= seg; i++) {
    const theta = (i / seg) * Math.PI * 2;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const x = Math.sign(cosT) * Math.pow(Math.abs(cosT), e) * halfW;
    const z = Math.sign(sinT) * Math.pow(Math.abs(sinT), e) * halfD;
    if (i === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  }

  const extrudeSettings = {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 1.2,
    bevelThickness: 1.2,
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  geo.rotateX(Math.PI / 2);
  return geo;
}

/**
 * Procedural continuous unibody die-casting geometry for the vortex mixer chassis.
 */
function createVortexChassisGeometry() {
  const M = 48; // Vertical slices
  const N = 48; // Radial segments
  const yMin = 12.0;
  const yMax = 120.0;

  const positions = [];
  const uvs = [];
  const indices = [];

  for (let j = 0; j <= M; j++) {
    const v = j / M;
    const y = yMin + v * (yMax - yMin);

    let halfW, frontZ, rearZ, cornerExp;

    if (y < 24.0) {
      const u = (y - 12.0) / 12.0;
      halfW = THREE.MathUtils.lerp(61.0, 56.0, u);
      frontZ = THREE.MathUtils.lerp(68.0, 60.0, u);
      rearZ = THREE.MathUtils.lerp(-80.0, -80.0, u);
      cornerExp = THREE.MathUtils.lerp(3.2, 3.4, u);
    } else if (y < 90.0) {
      const u = (y - 24.0) / 66.0;
      halfW = THREE.MathUtils.lerp(56.0, 42.0, u);
      const slopeZ = 60.0 - (y - 24.0) * Math.tan(THREE.MathUtils.degToRad(25.0));
      frontZ = slopeZ;
      if (y <= 52.0) {
        rearZ = -80.0;
      } else {
        const uRear = (y - 52.0) / 38.0;
        rearZ = THREE.MathUtils.lerp(-80.0, -48.0, Math.pow(uRear, 1.2));
      }
      cornerExp = THREE.MathUtils.lerp(3.4, 3.0, u);
    } else {
      const u = (y - 90.0) / 30.0;
      const smoothU = u * u * (3.0 - 2.0 * u);
      halfW = THREE.MathUtils.lerp(42.0, 38.0, smoothU);
      frontZ = THREE.MathUtils.lerp(29.23, 16.0, smoothU);
      rearZ = THREE.MathUtils.lerp(-48.0, -48.0, smoothU);
      cornerExp = THREE.MathUtils.lerp(3.0, 2.6, smoothU);
    }

    const centerZ = (frontZ + rearZ) / 2.0;
    const halfD = (frontZ - rearZ) / 2.0;
    const e = 2.0 / cornerExp;

    for (let i = 0; i <= N; i++) {
      const uFrac = i / N;
      const theta = uFrac * Math.PI * 2.0;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const x = Math.sign(cosT) * Math.pow(Math.abs(cosT), e) * halfW;
      const zOffset = Math.sign(sinT) * Math.pow(Math.abs(sinT), e) * halfD;
      const z = centerZ + zOffset;

      positions.push(x, y, z);
      uvs.push(uFrac, v);
    }
  }

  // Top Deck Plateau & Recessed Spindle Collar Well
  const topDeckRadiusOuter = 38.0;
  const topDeckRadiusInner = 24.5;
  const wellDepth = 2.5;
  const wellBottomY = yMax - wellDepth;
  const centerZ_top = -16.0;

  const topRimRingStart = positions.length / 3;
  for (let i = 0; i <= N; i++) {
    const uFrac = i / N;
    const theta = uFrac * Math.PI * 2.0;
    const x = Math.cos(theta) * topDeckRadiusInner;
    const z = centerZ_top + Math.sin(theta) * topDeckRadiusInner;
    positions.push(x, yMax, z);
    uvs.push(uFrac, 1.0);
  }

  const wellStepRingStart = positions.length / 3;
  for (let i = 0; i <= N; i++) {
    const uFrac = i / N;
    const theta = uFrac * Math.PI * 2.0;
    const x = Math.cos(theta) * topDeckRadiusInner;
    const z = centerZ_top + Math.sin(theta) * topDeckRadiusInner;
    positions.push(x, wellBottomY, z);
    uvs.push(uFrac, 1.0);
  }

  const wellFloorCenterIdx = positions.length / 3;
  positions.push(0, wellBottomY, centerZ_top);
  uvs.push(0.5, 0.5);

  // Loft Indices
  for (let j = 0; j < M; j++) {
    const row1 = j * (N + 1);
    const row2 = (j + 1) * (N + 1);
    for (let i = 0; i < N; i++) {
      const a = row1 + i;
      const b = row1 + i + 1;
      const c = row2 + i;
      const d = row2 + i + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  const topWallRow = M * (N + 1);
  for (let i = 0; i < N; i++) {
    const a = topWallRow + i;
    const b = topWallRow + i + 1;
    const c = topRimRingStart + i;
    const d = topRimRingStart + i + 1;
    indices.push(a, b, d);
    indices.push(a, d, c);
  }

  for (let i = 0; i < N; i++) {
    const a = topRimRingStart + i;
    const b = topRimRingStart + i + 1;
    const c = wellStepRingStart + i;
    const d = wellStepRingStart + i + 1;
    indices.push(a, b, d);
    indices.push(a, d, c);
  }

  for (let i = 0; i < N; i++) {
    const a = wellStepRingStart + i;
    const b = wellStepRingStart + i + 1;
    indices.push(a, b, wellFloorCenterIdx);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Procedural spline cable generator using CatmullRomCurve3 and TubeGeometry.
 */
function makeCable(points, radius = 3.25, color = 0x111317, segments = 64) {
  const curvePoints = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const geo = new THREE.TubeGeometry(curve, segments, radius, 12, false);
  const mat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.88,
    metalness: 0.05,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Creates high-DPI procedural graphic faceplate texture with all silkscreen markings.
 */
function createConsoleFaceplateTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d');
  const cw = 1024;
  const ch = 576;

  // 1. Dark Anodized Aluminum Brushed Texture Background
  const grad = ctx.createLinearGradient(0, 0, 0, ch);
  grad.addColorStop(0, '#1c2128');
  grad.addColorStop(0.5, '#252b34');
  grad.addColorStop(1, '#1c2128');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);

  // Metallic brushed horizontal grain
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.lineWidth = 1;
  for (let y = 0; y < ch; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cw, y);
    ctx.stroke();
  }

  // Outer Bevel Frame Border
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, cw - 16, ch - 16);

  // 2. Top Header Brand Typography
  ctx.textAlign = 'center';
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 22px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('SCIENTIFIC INDUSTRIES', 512, 36);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 26px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('VORTEX-GENIE PRO · DIGITAL', 512, 64);

  // 3. LCD Bezel Frame Outline (X in [278, 746], Y in [68, 268])
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.strokeRect(274, 70, 476, 202);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
  ctx.lineWidth = 1;
  ctx.strokeRect(270, 66, 484, 210);

  // 4. Tactile Buttons Silkscreen Labels
  // Left: Btn_Timer at X = -24 mm, Y = +8.0 mm -> px = 150, py = 171
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('TIMER', 150, 115);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(150, 171, 38, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 16px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('30 SEC', 150, 230);

  // Right: Btn_Pulse at X = +24 mm, Y = +8.0 mm -> px = 874, py = 171
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('PULSE', 874, 115);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(874, 171, 38, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 16px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('INTERVAL', 874, 230);

  // 5. Lower Left: Mode Toggle Switch (Btn_Switch_Mode)
  // X = -18 mm, Y = -9.0 mm -> px = 241, py = 424
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 18px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('FUNCTION / MODE', 241, 325);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(241, 424, 62, Math.PI * 0.75, Math.PI * 0.25, true);
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 18px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('TOUCH', 165, 410);
  ctx.fillText('OFF', 241, 370);
  ctx.fillText('CONT', 317, 410);

  // 6. Lower Right: Speed Control Rotary Dial (Knob_Speed)
  // X = +18 mm, Y = -9.0 mm -> px = 783, py = 424
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 18px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('SPEED CONTROL', 783, 305);

  const knobPx = 783;
  const knobPy = 424;
  const scaleR = 120;
  const startAng = THREE.MathUtils.degToRad(140);
  const endAng = THREE.MathUtils.degToRad(400);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(knobPx, knobPy, scaleR, startAng, endAng);
  ctx.stroke();

  const graduations = [
    { label: '5', val: 0 },
    { label: '10', val: 0.18 },
    { label: '15', val: 0.36 },
    { label: '20', val: 0.55 },
    { label: '25', val: 0.73 },
    { label: '30', val: 0.91 },
    { label: '32', val: 1.0 },
  ];

  ctx.font = 'bold 16px system-ui, Segoe UI, Arial, sans-serif';
  graduations.forEach((g) => {
    const a = startAng + (endAng - startAng) * g.val;
    const x1 = knobPx + Math.cos(a) * scaleR;
    const y1 = knobPy + Math.sin(a) * scaleR;
    const x2 = knobPx + Math.cos(a) * (scaleR + 10);
    const y2 = knobPy + Math.sin(a) * (scaleR + 10);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const tx = knobPx + Math.cos(a) * (scaleR + 24);
    const ty = knobPy + Math.sin(a) * (scaleR + 24) + 5;
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(g.label, tx, ty);
  });

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 15px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('RPM × 100', 783, 545);

  // 7. Center Status LED & Power Label
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('STATUS', 512, 375);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(512, 424, 22, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 14px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('READY / RUN', 512, 470);

  // 8. Bottom Rating Specifications
  ctx.fillStyle = '#64748b';
  ctx.font = '500 13px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('DIN EN 61010-1 · SRE LAB SYSTEMS · 120V / 230V 50/60Hz 150W · IP21', 512, 560);

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export class VortexMixer3D {
  constructor(container) {
    this.container = container;
    this.root = new THREE.Group();
    this.root.name = 'VortexMixer_Root';

    // Interactive & kinematic components cache
    this.interactiveMeshes = [];
    this.knobSpeed = null;
    this.switchMode = null;
    this.switchBatLever = null;
    this.btnTimer = null;
    this.btnPulse = null;
    this.btnPower = null;
    this.pivotCupHead = null;
    this.ledPowerRun = null;
    this.ledMaterial = null;
    this.uiLcdMesh = null;

    // Tube and liquid assemblies
    this.activeTubeGroup = null;
    this.falconTubeGroup = null;
    this.microTubeGroup = null;
    this.fluidMesh = null;
    this.fluidGeometry = null;
    this.fluidMaterial = null;
    this.microFluidMesh = null;
    this.microFluidGeometry = null;
    this.vortexCoreMesh = null;
    this.currentLiquidKey = 'water';

    // Animation & kinematics state
    this.currentRpm = 0.0;
    this.orbitalRadius = 2.0; // 2 mm radius = 4 mm orbit
    this.modeState = 'TOUCH';
    this.isTouchActive = false;
    this.isExploded = false;

    // Exploded view groups
    this.explodedParts = [];

    this._buildMachine();
  }

  _buildMachine() {
    // 1. Base Plate & 4 Vulcanized Rubber Suction Cup Feet
    this._buildBaseAndFeet();

    // 2. Heavy Cast Iron Ballast & 4 Vibration Isolation Dampers (Rule 1 Internal Workings)
    this._buildBallastAndSuspension();

    // 3. Shaded-Pole Induction Drive Motor & Eccentric Counterbalance Flywheel
    this._buildMotorAndEccentricDrive();

    // 4. Main Digital Speed Controller Motherboard (PCB, Transformer, Heatsink)
    this._buildMainControllerPCB();

    // 5. Die-Cast Unibody Chassis Housing
    this._buildChassisBody();

    // 6. Recessed Sloped Console, LCD, Buttons, Knob, Toggle Switch (Zero Overlap & Labeled)
    this._buildRecessedConsole();

    // 7. Official SREdesigns Brand Badge
    this._buildBrandBadge();

    // 8. Rear Power Inlet, Switch & Heavy-Duty 3D Laboratory Power Cord
    this._buildHardwareAndFittings();

    // 9. Kinematic Cup Head & Spindle Assembly
    this._buildCupHeadAssembly();

    // 10. Sample Vessels (Ergonomic 14° Tilt & Procedural Volumetric Markings)
    this._buildSampleTubes();

    // Set initial fluid mesh at rest
    this._updateFluidMesh(0, 0);
  }

  _buildBaseAndFeet() {
    const baseGroup = new THREE.Group();
    baseGroup.name = 'Body_Assembly_Base';

    // 1. Galvanized steel bottom cover plate with rounded squircle profile
    const basePlateGeo = createSquirclePlateGeometry(112, 144, 2.5, 3.6, 48);
    const basePlate = new THREE.Mesh(basePlateGeo, MAT_BASE_STEEL);
    basePlate.name = 'Body_BasePlate';
    basePlate.position.set(0, 11.5, -12.0);
    basePlate.castShadow = true;
    basePlate.receiveShadow = true;
    baseGroup.add(basePlate);

    // 2. 4 Vulcanized Neoprene Suction Cup Feet (Datum check: Lowest point contacts Y = 0.0 mm)
    const footPositions = [
      { name: 'Foot_Leveling_FL', x: -44, z: 42 },
      { name: 'Foot_Leveling_FR', x: 44, z: 42 },
      { name: 'Foot_Leveling_RL', x: -44, z: -66 },
      { name: 'Foot_Leveling_RR', x: 44, z: -66 },
    ];

    footPositions.forEach((pos) => {
      const foot = new THREE.Group();
      foot.name = pos.name;

      // Concave suction cup base (radius 14 mm, height 5 mm, resting on Y = 0)
      const cupBaseGeo = new THREE.CylinderGeometry(11, 14, 5, 24);
      const cupBase = new THREE.Mesh(cupBaseGeo, MAT_RUBBER_FEET);
      cupBase.position.y = 2.5;
      cupBase.castShadow = true;
      foot.add(cupBase);

      // Conical suction stem (radius 8 mm, height 5 mm)
      const stemGeo = new THREE.CylinderGeometry(8, 11, 5, 24);
      const stem = new THREE.Mesh(stemGeo, MAT_RUBBER_FEET);
      stem.position.y = 7.5;
      stem.castShadow = true;
      foot.add(stem);

      // Central brass retaining collar
      const brassCollarGeo = new THREE.CylinderGeometry(4.0, 4.0, 2.5, 16);
      const brassCollar = new THREE.Mesh(brassCollarGeo, MAT_ALUM_BRUSHED);
      brassCollar.position.y = 10.5;
      foot.add(brassCollar);

      foot.position.set(pos.x, 0, pos.z);
      baseGroup.add(foot);
    });

    this.root.add(baseGroup);
    this.explodedParts.push({ group: baseGroup, offset: new THREE.Vector3(0, -25, 0) });
  }

  _buildBallastAndSuspension() {
    const ballastGroup = new THREE.Group();
    ballastGroup.name = 'Body_Assembly_Ballast';

    // 1. Heavy Sand-Cast Iron Ballast Plinth (4.0 kg ballast equivalent)
    const ballastGeo = createSquirclePlateGeometry(106, 96, 16.0, 3.4, 48);
    const ballast = new THREE.Mesh(ballastGeo, MAT_CAST_IRON);
    ballast.name = 'Body_Ballast_CastIron';
    ballast.position.set(0, 14.0, -12.0);
    ballast.castShadow = true;
    ballast.receiveShadow = true;
    ballastGroup.add(ballast);

    // 4 DIN 7991 M6 Socket Countersunk Through-Bolts
    const boltPositions = [
      { x: -40, z: 24 },
      { x: 40, z: 24 },
      { x: -40, z: -48 },
      { x: 40, z: -48 },
    ];
    boltPositions.forEach((pos, idx) => {
      const bolt = createHexSocketScrew(2.8, 16.0);
      bolt.name = `Fastener_Ballast_M6_${idx + 1}`;
      bolt.position.set(pos.x, 30.0, pos.z);
      ballastGroup.add(bolt);
    });

    // 2. 4 Elastomeric Vibration Isolation Dampers (Lord / Barry Controls mounts)
    const isolatorPositions = [
      { name: 'Suspension_Isolator_FL', x: -34, z: 16 },
      { name: 'Suspension_Isolator_FR', x: 34, z: 16 },
      { name: 'Suspension_Isolator_RL', x: -34, z: -42 },
      { name: 'Suspension_Isolator_RR', x: 34, z: -42 },
    ];

    isolatorPositions.forEach((pos) => {
      const isolator = new THREE.Group();
      isolator.name = pos.name;

      // Lower brass threaded stud into ballast
      const studLowerGeo = new THREE.CylinderGeometry(2.0, 2.0, 8.0, 16);
      const studLower = new THREE.Mesh(studLowerGeo, MAT_BRASS);
      studLower.position.y = 26.0;
      isolator.add(studLower);

      // Lower brass washer plate
      const washerLowerGeo = new THREE.CylinderGeometry(7.0, 7.0, 1.2, 20);
      const washerLower = new THREE.Mesh(washerLowerGeo, MAT_BRASS);
      washerLower.position.y = 30.5;
      isolator.add(washerLower);

      // Vulcanized natural rubber damping cylinder
      const rubberCoreGeo = new THREE.CylinderGeometry(6.5, 6.5, 10.0, 20);
      const rubberCore = new THREE.Mesh(rubberCoreGeo, MAT_RUBBER_FEET);
      rubberCore.position.y = 36.0;
      rubberCore.castShadow = true;
      isolator.add(rubberCore);

      // Upper brass washer plate
      const washerUpper = washerLower.clone();
      washerUpper.position.y = 41.5;
      isolator.add(washerUpper);

      // Upper threaded stud with brass M4 hex locking nut
      const studUpperGeo = new THREE.CylinderGeometry(2.0, 2.0, 8.0, 16);
      const studUpper = new THREE.Mesh(studUpperGeo, MAT_BRASS);
      studUpper.position.y = 45.0;
      isolator.add(studUpper);

      const nutGeo = new THREE.CylinderGeometry(3.6, 3.6, 2.5, 6);
      const nut = new THREE.Mesh(nutGeo, MAT_BRASS);
      nut.position.y = 45.0;
      isolator.add(nut);

      isolator.position.set(pos.x, 0, pos.z);
      ballastGroup.add(isolator);
    });

    this.root.add(ballastGroup);
    this.explodedParts.push({ group: ballastGroup, offset: new THREE.Vector3(0, 0, 0) });
  }

  _buildMotorAndEccentricDrive() {
    const motorGroup = new THREE.Group();
    motorGroup.name = 'Body_Assembly_MotorDrive';

    // 1. Suspended Stamped Steel Motor Mounting Cradle Plate
    const cradleGeo = new THREE.BoxGeometry(82, 3.5, 72);
    const cradle = new THREE.Mesh(cradleGeo, MAT_BASE_STEEL);
    cradle.name = 'Body_MotorCradle';
    cradle.position.set(0, 42.5, -16.0);
    cradle.castShadow = true;
    cradle.receiveShadow = true;
    motorGroup.add(cradle);

    // 2. Heavy Shaded-Pole Induction Drive Motor
    const motorCenterZ = -16.0;

    // Laminated Electrical Steel Stator Core Stack
    const statorGeo = new THREE.CylinderGeometry(34, 34, 30, 32);
    const stator = new THREE.Mesh(statorGeo, MAT_STATOR_STEEL);
    stator.name = 'Motor_Stator_Laminations';
    stator.position.set(0, 60.0, motorCenterZ);
    stator.castShadow = true;
    motorGroup.add(stator);

    // Dual Copper Magnet Wire Field Coils
    for (const sx of [-22, 22]) {
      const coilGroup = new THREE.Group();
      coilGroup.name = sx < 0 ? 'Motor_Coil_Left' : 'Motor_Coil_Right';
      coilGroup.position.set(sx, 60.0, motorCenterZ);

      const coilGeo = new THREE.BoxGeometry(16, 26, 24);
      const coil = new THREE.Mesh(coilGeo, MAT_COPPER_COIL);
      coil.castShadow = true;
      coilGroup.add(coil);

      const tapeGeo = new THREE.BoxGeometry(16.5, 10, 24.5);
      const tapeMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.6, metalness: 0.1 });
      const tape = new THREE.Mesh(tapeGeo, tapeMat);
      coilGroup.add(tape);

      motorGroup.add(coilGroup);
    }

    // Cast Aluminum Lower & Upper Bearing End-Bells
    const lowerEndBellGeo = new THREE.CylinderGeometry(20, 24, 8, 24);
    const lowerEndBell = new THREE.Mesh(lowerEndBellGeo, MAT_ALUM_BRUSHED);
    lowerEndBell.position.set(0, 44.0, motorCenterZ);
    motorGroup.add(lowerEndBell);

    const upperEndBellGeo = new THREE.CylinderGeometry(22, 26, 12, 24);
    const upperEndBell = new THREE.Mesh(upperEndBellGeo, MAT_ALUM_BRUSHED);
    upperEndBell.position.set(0, 78.0, motorCenterZ);
    upperEndBell.castShadow = true;
    motorGroup.add(upperEndBell);

    // Motor Stainless Steel Ground Drive Shaft
    const shaftGeo = new THREE.CylinderGeometry(4.0, 4.0, 68, 20);
    const shaft = new THREE.Mesh(shaftGeo, MAT_CHROME);
    shaft.name = 'Motor_Shaft_Drive';
    shaft.position.set(0, 64.0, motorCenterZ);
    shaft.castShadow = true;
    motorGroup.add(shaft);

    // Earth Ground Connection: Green/Yellow Wire with Brass Terminal
    const groundWire = makeCable(
      [
        [16.0, 44.0, motorCenterZ + 12.0],
        [14.0, 36.0, motorCenterZ + 20.0],
        [4.0, 28.0, 10.0],
      ],
      1.2,
      0x22c55e,
      24
    );
    groundWire.name = 'Wire_EarthGround';
    motorGroup.add(groundWire);

    const groundLugGeo = new THREE.CylinderGeometry(2.5, 2.5, 1.0, 16);
    const groundLug = new THREE.Mesh(groundLugGeo, MAT_BRASS);
    groundLug.position.set(16.0, 44.5, motorCenterZ + 12.0);
    motorGroup.add(groundLug);

    this.root.add(motorGroup);
    this.explodedParts.push({ group: motorGroup, offset: new THREE.Vector3(0, 35, 0) });

    // 3. Counterbalance Eccentric Flywheel & Orbital Mechanism
    const eccentricGroup = new THREE.Group();
    eccentricGroup.name = 'Body_Assembly_EccentricFlywheel';

    const flywheelGeo = new THREE.CylinderGeometry(19.0, 19.0, 10.0, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, MAT_BRASS);
    flywheel.name = 'Pivot_EccentricDrive_Flywheel';
    flywheel.position.set(0, 94.0, motorCenterZ);
    flywheel.castShadow = true;
    eccentricGroup.add(flywheel);

    const cavityGeo = new THREE.CylinderGeometry(9.0, 9.0, 6.0, 24);
    const cavityMat = new THREE.MeshStandardMaterial({ color: 0x997b20, roughness: 0.5, metalness: 0.8 });
    const cavity = new THREE.Mesh(cavityGeo, cavityMat);
    cavity.position.set(0, 96.0, motorCenterZ - 7.5);
    eccentricGroup.add(cavity);

    // Hardened Eccentric Pin (2.0 mm radial offset)
    const pinGeo = new THREE.CylinderGeometry(2.5, 2.5, 14.0, 16);
    const pin = new THREE.Mesh(pinGeo, MAT_CHROME);
    pin.name = 'Pivot_EccentricDrive_Pin';
    pin.position.set(0, 104.0, motorCenterZ + 2.0);
    eccentricGroup.add(pin);

    // Sealed Orbital Ball Bearing
    const bearingOuterGeo = new THREE.CylinderGeometry(7.0, 7.0, 5.0, 24);
    const bearingOuter = new THREE.Mesh(bearingOuterGeo, MAT_CHROME);
    bearingOuter.position.set(0, 105.0, motorCenterZ + 2.0);
    eccentricGroup.add(bearingOuter);

    const sealGeo = new THREE.CylinderGeometry(5.8, 5.8, 5.2, 24);
    const sealMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8, metalness: 0.1 });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    seal.position.set(0, 105.0, motorCenterZ + 2.0);
    eccentricGroup.add(seal);

    // Molded Nitrile Rubber Drive Boot / Bellows Coupling
    const bellowsGeo = new THREE.CylinderGeometry(11.0, 14.0, 12.0, 24);
    const bellows = new THREE.Mesh(bellowsGeo, MAT_RUBBER_CUP);
    bellows.name = 'Drive_Bellows_Rubber';
    bellows.position.set(0, 114.0, motorCenterZ);
    bellows.castShadow = true;
    eccentricGroup.add(bellows);

    this.root.add(eccentricGroup);
    this.explodedParts.push({ group: eccentricGroup, offset: new THREE.Vector3(0, 65, 0) });
  }

  _buildMainControllerPCB() {
    const pcbGroup = new THREE.Group();
    pcbGroup.name = 'Body_PCB_MainController';
    pcbGroup.position.set(0, 28.0, 16.0);
    pcbGroup.rotation.x = THREE.MathUtils.degToRad(-12.0);

    // 1. Green FR4 Substrate (68 mm x 40 mm x 1.6 mm)
    const substrateGeo = new THREE.BoxGeometry(68, 1.6, 40);
    const substrate = new THREE.Mesh(substrateGeo, MAT_PCB_GREEN);
    substrate.name = 'PCB_Substrate_FR4';
    substrate.castShadow = true;
    substrate.receiveShadow = true;
    pcbGroup.add(substrate);

    // 4 Brass Hexagonal Standoffs with DIN 912 M3 Screws
    const standoffPositions = [
      { x: -30, z: 16 },
      { x: 30, z: 16 },
      { x: -30, z: -16 },
      { x: 30, z: -16 },
    ];
    standoffPositions.forEach((pos, idx) => {
      const standoffGeo = new THREE.CylinderGeometry(2.5, 2.5, 8.0, 6);
      const standoff = new THREE.Mesh(standoffGeo, MAT_BRASS);
      standoff.position.set(pos.x, -4.8, pos.z);
      pcbGroup.add(standoff);

      const screw = createHexSocketScrew(1.2, 4.0);
      screw.name = `Fastener_PCB_Screw_${idx + 1}`;
      screw.position.set(pos.x, 1.2, pos.z);
      pcbGroup.add(screw);
    });

    // 2. Heavy Laminated Iron-Core Power Transformer
    const transGroup = new THREE.Group();
    transGroup.name = 'PCB_Transformer';
    transGroup.position.set(-18.0, 10.0, 4.0);

    const coreGeo = new THREE.BoxGeometry(24, 18, 20);
    const core = new THREE.Mesh(coreGeo, MAT_TRANSFORMER_CORE);
    transGroup.add(core);

    const coilGeo = new THREE.BoxGeometry(16, 16, 22);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.4, metalness: 0.6 });
    const transCoil = new THREE.Mesh(coilGeo, coilMat);
    transGroup.add(transCoil);

    pcbGroup.add(transGroup);

    // 3. Ribbed Black Anodized Aluminum Heatsink & TO-220 Motor Triac
    const heatsinkGroup = new THREE.Group();
    heatsinkGroup.name = 'PCB_Heatsink_Assembly';
    heatsinkGroup.position.set(16.0, 8.5, 6.0);

    const baseGeo = new THREE.BoxGeometry(22, 3.0, 14);
    const hsBase = new THREE.Mesh(baseGeo, MAT_HEATSINK_BLACK);
    heatsinkGroup.add(hsBase);

    for (let i = 0; i < 5; i++) {
      const finGeo = new THREE.BoxGeometry(22, 14, 1.2);
      const fin = new THREE.Mesh(finGeo, MAT_HEATSINK_BLACK);
      fin.position.set(0, 8.0, -5.5 + i * 2.8);
      heatsinkGroup.add(fin);
    }

    const triacGeo = new THREE.BoxGeometry(8, 12, 3.5);
    const triac = new THREE.Mesh(triacGeo, MAT_KNOB_ABS);
    triac.position.set(0, 6.0, -8.0);
    heatsinkGroup.add(triac);

    pcbGroup.add(heatsinkGroup);

    // 4. Aluminum Electrolytic Filtering Capacitors
    const cap1Geo = new THREE.CylinderGeometry(4.5, 4.5, 14, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.35, metalness: 0.6 });
    const cap1 = new THREE.Mesh(cap1Geo, capMat);
    cap1.position.set(-2.0, 7.8, -10.0);
    pcbGroup.add(cap1);

    const cap2Geo = new THREE.CylinderGeometry(3.5, 3.5, 10, 16);
    const cap2 = new THREE.Mesh(cap2Geo, capMat);
    cap2.position.set(8.0, 5.8, -10.0);
    pcbGroup.add(cap2);

    // 5. 4-Position Screw Terminal Barrier Block with Wiring Harness
    const termBlockGeo = new THREE.BoxGeometry(26, 9.0, 9.0);
    const termBlock = new THREE.Mesh(termBlockGeo, MAT_KNOB_ABS);
    termBlock.position.set(-14.0, 5.3, -12.0);
    pcbGroup.add(termBlock);

    for (let i = 0; i < 4; i++) {
      const screwGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.0, 12);
      const screw = new THREE.Mesh(screwGeo, MAT_BRASS);
      screw.position.set(-22.0 + i * 5.5, 9.8, -12.0);
      pcbGroup.add(screw);
    }

    this.root.add(pcbGroup);
    this.explodedParts.push({ group: pcbGroup, offset: new THREE.Vector3(0, 14, 52) });
  }

  _buildChassisBody() {
    const chassisGroup = new THREE.Group();
    chassisGroup.name = 'Body_Chassis';

    // Procedural continuous unibody casting (Y: 12 mm to 120 mm)
    const unibodyGeo = createVortexChassisGeometry();
    const unibody = new THREE.Mesh(unibodyGeo, MAT_CHASSIS_TEAL);
    unibody.name = 'Body_Chassis_Unibody';
    unibody.castShadow = true;
    unibody.receiveShadow = true;
    chassisGroup.add(unibody);

    // Drive Spindle Collar Flange
    const collarRimGeo = new THREE.CylinderGeometry(24.2, 24.2, 4.0, 36);
    const collarRim = new THREE.Mesh(collarRimGeo, MAT_CHASSIS_DARK);
    collarRim.position.set(0, 120.5, -16.0);
    collarRim.castShadow = true;
    chassisGroup.add(collarRim);

    // Spindle well inner collar ring
    const collarInnerGeo = new THREE.CylinderGeometry(19.0, 19.0, 4.2, 32);
    const collarInner = new THREE.Mesh(collarInnerGeo, MAT_ALUM_PANEL);
    collarInner.position.set(0, 120.5, -16.0);
    chassisGroup.add(collarInner);

    this.root.add(chassisGroup);
    this.explodedParts.push({ group: chassisGroup, offset: new THREE.Vector3(0, 105, 0) });
  }

  _buildRecessedConsole() {
    const consoleGroup = new THREE.Group();
    consoleGroup.name = 'Body_Assembly_SlopedConsole';

    // Seated on the 25.0° front slope: Center at Y = 62.0 mm, Z = 42.4 mm (chassis outer surface)
    const consoleAngle = THREE.MathUtils.degToRad(-25.0);
    consoleGroup.position.set(0, 62.0, 42.4);
    consoleGroup.rotation.x = consoleAngle;

    // 1. Recessed Bezel Pocket Backing (Pocket_ConsoleBezel)
    const pocketGeo = new THREE.BoxGeometry(72, 42, 1.2);
    const pocketBacking = new THREE.Mesh(pocketGeo, MAT_CHASSIS_DARK);
    pocketBacking.name = 'Pocket_ConsoleBezel';
    pocketBacking.position.set(0, 0, -0.4);
    consoleGroup.add(pocketBacking);

    // 2. Anodized Aluminum Faceplate Backing (Solid plate)
    const plateGeo = new THREE.BoxGeometry(68, 38, 0.8);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x1a202c,
      roughness: 0.35,
      metalness: 0.5,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.name = 'Body_Panel_Console';
    plate.position.set(0, 0, 0.4);
    plate.receiveShadow = true;
    consoleGroup.add(plate);

    // 2b. High-DPI Silkscreen Graphic Plane (Dedicated PlaneGeometry with inverted UVs for DIAG-005 compliance)
    const faceplateTexture = createConsoleFaceplateTexture();
    faceplateTexture.flipY = false;
    faceplateTexture.minFilter = THREE.LinearFilter;
    faceplateTexture.magFilter = THREE.LinearFilter;

    const screenGeo = new THREE.PlaneGeometry(67.6, 37.6);
    const uvAttrScreen = screenGeo.attributes.uv;
    for (let i = 0; i < uvAttrScreen.count; i++) {
      uvAttrScreen.setY(i, 1.0 - uvAttrScreen.getY(i));
    }
    uvAttrScreen.needsUpdate = true;

    const screenMat = new THREE.MeshBasicMaterial({
      map: faceplateTexture,
      side: THREE.FrontSide,
    });
    const silkscreenMesh = new THREE.Mesh(screenGeo, screenMat);
    silkscreenMesh.name = 'Body_Silkscreen_Console';
    silkscreenMesh.position.set(0, 0, 0.82);
    consoleGroup.add(silkscreenMesh);

    // 3. UI_LCD: Dedicated Flat Quad for High-DPI CanvasTexture (flipY = false)
    // Sits flush in upper half: 30 mm wide x 13 mm high, centered at X = 0, Y = +8.0 mm
    // Bounds: X in [-15, +15] mm, Y in [+1.5, +14.5] mm
    const lcdGeo = new THREE.PlaneGeometry(30, 13);
    const uvAttr = lcdGeo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setY(i, 1.0 - uvAttr.getY(i));
    }
    uvAttr.needsUpdate = true;

    const lcdMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.FrontSide,
    });
    this.uiLcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
    this.uiLcdMesh.name = 'UI_LCD';
    this.uiLcdMesh.position.set(0, 8.0, 0.85);
    consoleGroup.add(this.uiLcdMesh);

    // 4. Optical Rotary Encoder Dial (Knob_Speed)
    // Seated in lower right: X = +18 mm, Y = -9.0 mm
    // Diameter = 14 mm (radius 7.0 mm). Bounds: X in [11, 25], Y in [-16, -2.0]
    // CLEARANCE TO LCD: LCD bottom is Y = +1.5 mm, knob top is Y = -2.0 mm -> 3.5 mm CLEAR GAP!
    const knobGroup = new THREE.Group();
    knobGroup.name = 'Knob_Speed';
    knobGroup.position.set(18, -9.0, 0.85);

    const knobBaseGeo = new THREE.CylinderGeometry(6.8, 7.2, 7.5, 24);
    const knobBase = new THREE.Mesh(knobBaseGeo, MAT_KNOB_ABS);
    knobBase.rotation.x = Math.PI / 2;
    knobBase.castShadow = true;
    knobGroup.add(knobBase);

    const pointerGeo = new THREE.BoxGeometry(1.0, 4.0, 1.2);
    const pointerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pointer = new THREE.Mesh(pointerGeo, pointerMat);
    pointer.position.set(0, 3.5, 3.8);
    knobGroup.add(pointer);

    knobBase.userData = {
      isInteractive: true,
      type: 'knob',
      name: 'Knob_Speed',
      hint: 'Speed Dial (500 – 3200 RPM)',
    };
    this.interactiveMeshes.push(knobBase);
    this.knobSpeed = knobGroup;
    consoleGroup.add(knobGroup);

    // 5. 3-Position Miniature Chrome Toggle Switch (Btn_Switch_Mode)
    // Seated in lower left: X = -18 mm, Y = -9.0 mm (Zero Overlap with LCD)
    const switchGroup = new THREE.Group();
    switchGroup.name = 'Btn_Switch_Mode';
    switchGroup.position.set(-18, -9.0, 0.85);

    const nutGeo = new THREE.CylinderGeometry(3.5, 3.5, 2.0, 6);
    const nut = new THREE.Mesh(nutGeo, MAT_CHROME);
    nut.rotation.x = Math.PI / 2;
    nut.castShadow = true;
    switchGroup.add(nut);

    const leverGroup = new THREE.Group();
    leverGroup.name = 'Btn_Switch_BatLever';
    leverGroup.position.set(0, 0, 1.2);

    const leverGeo = new THREE.CylinderGeometry(1.0, 1.6, 7.0, 16);
    const lever = new THREE.Mesh(leverGeo, MAT_CHROME);
    lever.position.y = 3.5;
    lever.castShadow = true;
    leverGroup.add(lever);

    const ballGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const ball = new THREE.Mesh(ballGeo, MAT_CHROME);
    ball.position.y = 7.0;
    leverGroup.add(ball);

    lever.userData = {
      isInteractive: true,
      type: 'switch',
      name: 'Btn_Switch_Mode',
      hint: 'Toggle: TOUCH / OFF / CONTINUOUS',
    };
    ball.userData = lever.userData;
    this.interactiveMeshes.push(lever, ball);

    // Default to TOUCH mode (-20°)
    leverGroup.rotation.z = THREE.MathUtils.degToRad(-20.0);
    this.switchBatLever = leverGroup;
    switchGroup.add(leverGroup);
    this.switchMode = switchGroup;
    consoleGroup.add(switchGroup);

    // 6. Tactile Momentary Buttons: Timer & Pulse
    const btnConfigs = [
      { name: 'Btn_Timer', x: -24, y: 8.0, z: 0.85, hint: 'Toggle Countdown Timer' },
      { name: 'Btn_Pulse', x: 24, y: 8.0, z: 0.85, hint: 'Toggle Pulse Agitation' },
    ];

    btnConfigs.forEach((cfg) => {
      const btnGeo = new THREE.CylinderGeometry(2.2, 2.5, 1.6, 20);
      const btn = new THREE.Mesh(btnGeo, MAT_BUTTON_MEMBRANE);
      btn.name = cfg.name;
      btn.position.set(cfg.x, cfg.y, cfg.z);
      btn.rotation.x = Math.PI / 2;
      btn.castShadow = true;

      btn.userData = {
        isInteractive: true,
        type: 'button',
        name: cfg.name,
        hint: cfg.hint,
      };
      this.interactiveMeshes.push(btn);
      consoleGroup.add(btn);

      if (cfg.name === 'Btn_Timer') this.btnTimer = btn;
      if (cfg.name === 'Btn_Pulse') this.btnPulse = btn;
    });

    // 7. Dual-Color LED Status Indicator (Body_LED_PowerRun)
    const ledDomeGeo = new THREE.SphereGeometry(1.6, 16, 16);
    this.ledMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber standby by default
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.ledPowerRun = new THREE.Mesh(ledDomeGeo, this.ledMaterial);
    this.ledPowerRun.name = 'Body_LED_PowerRun';
    this.ledPowerRun.position.set(0, -9.0, 1.3);
    consoleGroup.add(this.ledPowerRun);

    // 8. 4 DIN 912 M2.5 Fasteners inside faceplate corners
    const screwPositions = [
      { x: -30, y: 15 },
      { x: 30, y: 15 },
      { x: -30, y: -15 },
      { x: 30, y: -15 },
    ];
    screwPositions.forEach((pos, idx) => {
      const screw = createHexSocketScrew(1.2, 2.5);
      screw.name = `Fastener_HexM3_Console_${idx + 1}`;
      screw.position.set(pos.x, pos.y, 0.85);
      screw.rotation.x = Math.PI / 2;
      consoleGroup.add(screw);

      const washer = createWasher(1.3, 2.6, 0.3);
      washer.position.set(pos.x, pos.y, 0.82);
      washer.rotation.x = Math.PI / 2;
      consoleGroup.add(washer);
    });

    this.root.add(consoleGroup);
    this.explodedParts.push({ group: consoleGroup, offset: new THREE.Vector3(0, 40, 80) });
  }

  _buildBrandBadge() {
    // Official canonical SREdesigns brand badge seated on lower front face
    const badge = makeSREdesignsBadge(28, 8.0);
    badge.position.set(0, 25.0, 59.6);
    badge.rotation.x = THREE.MathUtils.degToRad(-25.0);
    this.root.add(badge);
    this.explodedParts.push({ group: badge, offset: new THREE.Vector3(0, 10, 35) });
  }

  _buildHardwareAndFittings() {
    const hwGroup = new THREE.Group();
    hwGroup.name = 'Fastener_Assembly_Hardware';

    // 1. Rear recessed escutcheon panel at Z = -80.0 mm
    const rearPanelGeo = new THREE.BoxGeometry(56, 28, 2.0);
    const rearPanel = new THREE.Mesh(rearPanelGeo, MAT_CHASSIS_DARK);
    rearPanel.position.set(0, 36, -80.0);
    hwGroup.add(rearPanel);

    // 2. Millimeter-accurate IEC 60320 C14 Chassis Power Inlet Receptacle
    const iecInlet = new THREE.Group();
    iecInlet.name = 'Body_Assembly_PowerInlet';
    iecInlet.position.set(-13, 36, -80.0);

    const iecFlangeGeo = new THREE.BoxGeometry(30, 24, 2.2);
    const iecFlange = new THREE.Mesh(iecFlangeGeo, MAT_KNOB_ABS);
    iecInlet.add(iecFlange);

    const iecRecessGeo = new THREE.BoxGeometry(22, 14, 16);
    const iecRecess = new THREE.Mesh(iecRecessGeo, MAT_KNOB_ABS);
    iecRecess.position.z = 8.0;
    iecInlet.add(iecRecess);

    const pinGeo = new THREE.BoxGeometry(2.0, 4.5, 10.0);
    const pinEarth = new THREE.Mesh(pinGeo, MAT_BRASS);
    pinEarth.position.set(0, 3.5, 6.0);
    iecInlet.add(pinEarth);

    const pinLine = new THREE.Mesh(pinGeo, MAT_BRASS);
    pinLine.position.set(-5.5, -2.5, 6.0);
    iecInlet.add(pinLine);

    const pinNeut = new THREE.Mesh(pinGeo, MAT_BRASS);
    pinNeut.position.set(5.5, -2.5, 6.0);
    iecInlet.add(pinNeut);

    const iecScrew1 = createHexSocketScrew(1.2, 4.0);
    iecScrew1.rotation.x = Math.PI / 2;
    iecScrew1.position.set(-11, 0, -1.2);
    iecInlet.add(iecScrew1);

    const iecScrew2 = createHexSocketScrew(1.2, 4.0);
    iecScrew2.rotation.x = Math.PI / 2;
    iecScrew2.position.set(11, 0, -1.2);
    iecInlet.add(iecScrew2);

    hwGroup.add(iecInlet);

    // 3. Rear Illuminated Rocker Switch
    const rockerGroup = new THREE.Group();
    rockerGroup.name = 'Btn_Switch_RearPower';
    rockerGroup.position.set(15, 36, -80.0);

    const rockerBezelGeo = new THREE.BoxGeometry(16, 22, 2.2);
    const rockerBezel = new THREE.Mesh(rockerBezelGeo, MAT_KNOB_ABS);
    rockerGroup.add(rockerBezel);

    const rockerActuatorGeo = new THREE.BoxGeometry(12, 18, 4.0);
    const rockerActuatorMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.35,
      metalness: 0.1,
      emissive: 0xdc2626,
      emissiveIntensity: 0.3,
    });
    const rockerActuator = new THREE.Mesh(rockerActuatorGeo, rockerActuatorMat);
    rockerActuator.position.set(0, 0, 1.2);
    rockerActuator.rotation.x = 0.12;
    rockerGroup.add(rockerActuator);

    hwGroup.add(rockerGroup);

    // 4. Heavy-Duty Laboratory AC Mains Power Cord
    const cordGroup = new THREE.Group();
    cordGroup.name = 'Body_Assembly_PowerCord';

    const c13BodyGeo = new THREE.BoxGeometry(22, 16, 24);
    const c13Body = new THREE.Mesh(c13BodyGeo, MAT_KNOB_ABS);
    c13Body.position.set(-13, 36, -91.0);
    cordGroup.add(c13Body);

    const bootGeo = new THREE.CylinderGeometry(4.0, 7.0, 16, 16);
    const boot = new THREE.Mesh(bootGeo, MAT_CORD_NEOPRENE);
    boot.rotation.x = Math.PI / 2;
    boot.position.set(-13, 36, -107.0);
    cordGroup.add(boot);

    const cordMesh = makeCable(
      [
        [-13.0, 36.0, -114.0],
        [-13.0, 30.0, -126.0],
        [-4.0, 15.0, -136.0],
        [14.0, 3.25, -144.0],
        [42.0, 3.25, -148.0],
        [75.0, 3.25, -147.0],
        [106.0, 3.25, -140.0],
        [126.0, 3.25, -132.0],
      ],
      3.25,
      0x111317,
      64
    );
    cordMesh.name = 'Power_Cord';
    cordGroup.add(cordMesh);

    // Molded 3-prong NEMA 5-15P laboratory AC plug resting flat on the bench
    const plugGroup = new THREE.Group();
    plugGroup.name = 'Power_Plug';
    plugGroup.position.set(138.0, 8.0, -128.0);
    plugGroup.rotation.y = THREE.MathUtils.degToRad(-35.0);

    const plugBodyGeo = new THREE.BoxGeometry(22, 16, 32);
    const plugBody = new THREE.Mesh(plugBodyGeo, MAT_KNOB_ABS);
    plugGroup.add(plugBody);

    const plugNeckGeo = new THREE.CylinderGeometry(5.0, 7.0, 10, 16);
    const plugNeck = new THREE.Mesh(plugNeckGeo, MAT_CORD_NEOPRENE);
    plugNeck.rotation.x = Math.PI / 2;
    plugNeck.position.z = -20.0;
    plugGroup.add(plugNeck);

    for (const ox of [-5.0, 5.0]) {
      const bladeGeo = new THREE.BoxGeometry(1.5, 6.0, 16.0);
      const blade = new THREE.Mesh(bladeGeo, MAT_BRASS);
      blade.position.set(ox, 0, 22.0);
      plugGroup.add(blade);
    }

    const earthPinGeo = new THREE.CylinderGeometry(2.4, 2.4, 18.0, 16);
    const earthPin = new THREE.Mesh(earthPinGeo, MAT_BRASS);
    earthPin.rotation.x = Math.PI / 2;
    earthPin.position.set(0, -4.5, 23.0);
    plugGroup.add(earthPin);

    cordGroup.add(plugGroup);
    hwGroup.add(cordGroup);

    this.root.add(hwGroup);
    this.explodedParts.push({ group: hwGroup, offset: new THREE.Vector3(0, 0, -35) });
  }

  _buildCupHeadAssembly() {
    const cupAssembly = new THREE.Group();
    cupAssembly.name = 'Body_Assembly_CupHead';
    cupAssembly.position.set(0, 124, -16.0);

    const cupGroup = new THREE.Group();
    cupGroup.name = 'Pivot_CupHead';
    cupGroup.position.set(0, 0, 0);

    // Spindle drive shaft (hardened steel)
    const shaftGeo = new THREE.CylinderGeometry(4.5, 4.5, 14, 20);
    const shaft = new THREE.Mesh(shaftGeo, MAT_CHROME);
    shaft.position.y = 5;
    cupGroup.add(shaft);

    // Brass eccentric counterweight
    const eccentricGeo = new THREE.CylinderGeometry(9, 9, 8, 20);
    const eccentric = new THREE.Mesh(eccentricGeo, MAT_BRASS);
    eccentric.position.set(2.0, 7, 0);
    cupGroup.add(eccentric);

    // Molded vulcanized rubber cup head with genuine 3D hollow cavity
    const cupOuterGeo = new THREE.CylinderGeometry(21, 16, 28, 32, 1, true);
    const cupOuter = new THREE.Mesh(cupOuterGeo, MAT_RUBBER_CUP);
    cupOuter.position.y = 24;
    cupOuter.castShadow = true;
    cupGroup.add(cupOuter);

    const cupBottomGeo = new THREE.CircleGeometry(16, 32);
    const cupBottom = new THREE.Mesh(cupBottomGeo, MAT_RUBBER_CUP);
    cupBottom.rotation.x = Math.PI / 2;
    cupBottom.position.y = 10;
    cupGroup.add(cupBottom);

    const cupCavityGeo = new THREE.CylinderGeometry(15, 7, 20, 32, 1, true);
    const cupCavity = new THREE.Mesh(cupCavityGeo, MAT_RUBBER_CUP);
    cupCavity.position.y = 28;
    cupGroup.add(cupCavity);

    const cupCavityFloorGeo = new THREE.CircleGeometry(7, 32);
    const cupCavityFloor = new THREE.Mesh(cupCavityFloorGeo, MAT_RUBBER_CUP);
    cupCavityFloor.rotation.x = Math.PI / 2;
    cupCavityFloor.position.y = 18;
    cupGroup.add(cupCavityFloor);

    const cupRimGeo = new THREE.RingGeometry(15, 21, 32);
    const cupRim = new THREE.Mesh(cupRimGeo, MAT_RUBBER_CUP);
    cupRim.rotation.x = -Math.PI / 2;
    cupRim.position.y = 38;
    cupGroup.add(cupRim);

    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2;
      const ribGeo = new THREE.BoxGeometry(1.6, 22, 1.8);
      const rib = new THREE.Mesh(ribGeo, MAT_RUBBER_CUP);
      rib.position.set(Math.cos(ang) * 19.5, 25, Math.sin(ang) * 19.5);
      rib.rotation.y = -ang;
      cupGroup.add(rib);
    }

    cupOuter.userData = {
      isInteractive: true,
      type: 'cup',
      name: 'Pivot_CupHead',
      hint: 'Press and hold to vortex sample (Touch Mode)',
    };
    this.interactiveMeshes.push(cupOuter);

    cupAssembly.add(cupGroup);
    this.pivotCupHead = cupGroup;
    this.root.add(cupAssembly);
    this.explodedParts.push({ group: cupAssembly, offset: new THREE.Vector3(0, 160, 0) });
  }

  _buildSampleTubes() {
    const tubesContainer = new THREE.Group();
    tubesContainer.name = 'Body_Assembly_SampleTubes';

    // 1. Standard 15 mL Falcon Conical Centrifuge Tube (seated at Y = 138 mm, resting in rubber cup)
    this.falconTubeGroup = this._createFalconTube15mL();
    this.falconTubeGroup.name = 'Body_Sample_FalconTube15mL';
    this.falconTubeGroup.position.set(0, 138, -16.0);
    tubesContainer.add(this.falconTubeGroup);

    // 2. 1.5 mL Microcentrifuge Tube (Eppendorf style)
    this.microTubeGroup = this._createMicroTube1_5mL();
    this.microTubeGroup.name = 'Body_Sample_MicroTube1_5mL';
    this.microTubeGroup.position.set(0, 138, -16.0);
    this.microTubeGroup.visible = false;
    tubesContainer.add(this.microTubeGroup);

    this.activeTubeGroup = this.falconTubeGroup;
    this.root.add(tubesContainer);
    this.explodedParts.push({ group: tubesContainer, offset: new THREE.Vector3(0, 225, 0) });
  }

  _createFalconTube15mL() {
    const group = new THREE.Group();

    // Natural ergonomic tilt angle (16° off vertical, tilted towards front-right)
    // Pivots around the bottom conical tip apex at (0, 0, 0)
    group.rotation.z = THREE.MathUtils.degToRad(16.0);
    group.rotation.x = THREE.MathUtils.degToRad(-6.0);

    // Cylindrical wall (diameter 17 mm, length 95 mm)
    const tubeGeo = new THREE.CylinderGeometry(8.5, 8.5, 95, 32, 1, true);
    const tubeMesh = new THREE.Mesh(tubeGeo, MAT_GLASS_TUBE);
    tubeMesh.position.y = 60;
    tubeMesh.renderOrder = 2;
    group.add(tubeMesh);

    // Conical bottom (tapers from 17 mm to rounded apex, height 22 mm)
    const coneGeo = new THREE.CylinderGeometry(8.5, 1.5, 22, 32, 1, true);
    const coneMesh = new THREE.Mesh(coneGeo, MAT_GLASS_TUBE);
    coneMesh.position.y = 11;
    coneMesh.renderOrder = 2;
    group.add(coneMesh);

    // Rounded tip sphere (apex at Y = 0)
    const tipGeo = new THREE.SphereGeometry(1.5, 20, 20);
    const tipMesh = new THREE.Mesh(tipGeo, MAT_GLASS_TUBE);
    tipMesh.position.y = 0;
    tipMesh.renderOrder = 2;
    group.add(tipMesh);

    // Screw neck threads at top (Y = 106 to 112 mm)
    for (let i = 0; i < 3; i++) {
      const threadGeo = new THREE.TorusGeometry(8.6, 0.4, 8, 32);
      const thread = new THREE.Mesh(threadGeo, MAT_GLASS_TUBE);
      thread.rotation.x = Math.PI / 2;
      thread.position.y = 107 + i * 2.2;
      group.add(thread);
    }

    // High-Fidelity Royal Blue Screw Cap with 24 Vertical Grip Flutes
    const capGroup = new THREE.Group();
    capGroup.name = 'FalconTube_Cap';
    capGroup.position.y = 114;

    const capGeo = new THREE.CylinderGeometry(10.5, 10.5, 16, 24);
    const capMesh = new THREE.Mesh(capGeo, MAT_TUBE_CAP_BLUE);
    capMesh.castShadow = true;
    capGroup.add(capMesh);

    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2;
      const fluteGeo = new THREE.BoxGeometry(0.6, 15, 0.6);
      const flute = new THREE.Mesh(fluteGeo, MAT_TUBE_CAP_BLUE);
      flute.position.set(Math.cos(ang) * 10.6, 0, Math.sin(ang) * 10.6);
      capGroup.add(flute);
    }
    group.add(capGroup);

    // Silkscreen Matte White Writing Patch on side of tube (60 mm x 8 mm)
    const patchCanvas = document.createElement('canvas');
    patchCanvas.width = 128;
    patchCanvas.height = 512;
    const pctx = patchCanvas.getContext('2d');
    pctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    pctx.fillRect(8, 8, 112, 496);

    pctx.fillStyle = '#0f172a';
    pctx.font = 'bold 24px -apple-system, sans-serif';
    pctx.translate(64, 256);
    pctx.rotate(-Math.PI / 2);
    pctx.textAlign = 'center';
    pctx.fillText('SPECIMEN #204', 0, 0);

    const patchTex = new THREE.CanvasTexture(patchCanvas);
    const patchGeo = new THREE.PlaneGeometry(7.0, 50.0);
    const patchMat = new THREE.MeshBasicMaterial({ map: patchTex, transparent: true, opacity: 0.9, side: THREE.FrontSide });
    const patch = new THREE.Mesh(patchGeo, patchMat);
    patch.position.set(0, 62, 8.55);
    group.add(patch);

    // Graduated Printed Volume Rings & Silkscreen Numbers (1 mL to 14 mL)
    const gradGroup = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
    for (let i = 1; i <= 14; i++) {
      const ringGeo = new THREE.RingGeometry(8.45, 8.65, 32);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 16 + i * 6.2;
      gradGroup.add(ring);
    }
    group.add(gradGroup);

    // Dynamic Liquid Mesh with Real-Time Parabolic Meniscus Vortex
    this.falconFluidParams = {
      yBot: 2.0,
      yCone: 22.0,
      rTip: 1.5,
      rMax: 8.1,
      yRest: 44.0,
      M1: 16,
      M2: 16,
      N: 32,
    };
    this.fluidGeometry = this._createVortexBufferGeometry(this.falconFluidParams);
    this.fluidMaterial = new THREE.MeshStandardMaterial({
      color: LIQUID_COLORS.water,
      roughness: 0.08,
      metalness: 0.08,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
      depthWrite: true,
    });
    this.fluidMesh = new THREE.Mesh(this.fluidGeometry, this.fluidMaterial);
    this.fluidMesh.name = 'Body_Fluid_FalconTube15mL';
    this.fluidMesh.renderOrder = 1;
    group.add(this.fluidMesh);

    return group;
  }

  _createMicroTube1_5mL() {
    const group = new THREE.Group();

    group.rotation.z = THREE.MathUtils.degToRad(14.0);
    group.rotation.x = THREE.MathUtils.degToRad(-5.0);

    const tubeGeo = new THREE.CylinderGeometry(5.4, 5.4, 26, 24, 1, true);
    const tubeMesh = new THREE.Mesh(tubeGeo, MAT_GLASS_TUBE);
    tubeMesh.position.y = 20;
    tubeMesh.renderOrder = 2;
    group.add(tubeMesh);

    const coneGeo = new THREE.CylinderGeometry(5.4, 0.8, 14, 24, 1, true);
    const coneMesh = new THREE.Mesh(coneGeo, MAT_GLASS_TUBE);
    coneMesh.position.y = 7;
    coneMesh.renderOrder = 2;
    group.add(coneMesh);

    const tipGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const tipMesh = new THREE.Mesh(tipGeo, MAT_GLASS_TUBE);
    tipMesh.position.y = 0;
    tipMesh.renderOrder = 2;
    group.add(tipMesh);

    const flangeGeo = new THREE.CylinderGeometry(6.4, 6.4, 1.8, 24);
    const flange = new THREE.Mesh(flangeGeo, MAT_GLASS_TUBE);
    flange.position.y = 33;
    group.add(flange);

    const capGeo = new THREE.CylinderGeometry(6.2, 6.2, 2.5, 24);
    const cap = new THREE.Mesh(capGeo, MAT_TUBE_CAP_CLEAR);
    cap.position.y = 34.5;
    group.add(cap);

    const tabGeo = new THREE.BoxGeometry(4.0, 1.2, 3.5);
    const tab = new THREE.Mesh(tabGeo, MAT_TUBE_CAP_CLEAR);
    tab.position.set(0, 34.5, 7.5);
    group.add(tab);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    [0.5, 1.0, 1.5].forEach((vol, idx) => {
      const ringGeo = new THREE.RingGeometry(5.35, 5.5, 24);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 12 + idx * 8;
      group.add(ring);
    });

    this.microFluidParams = {
      yBot: 1.0,
      yCone: 14.0,
      rTip: 0.8,
      rMax: 5.1,
      yRest: 24.0,
      M1: 12,
      M2: 12,
      N: 24,
    };
    this.microFluidGeometry = this._createVortexBufferGeometry(this.microFluidParams);
    this.microFluidMesh = new THREE.Mesh(this.microFluidGeometry, this.fluidMaterial);
    this.microFluidMesh.name = 'Body_Fluid_MicroTube1_5mL';
    this.microFluidMesh.renderOrder = 1;
    group.add(this.microFluidMesh);

    return group;
  }

  _createVortexBufferGeometry(p) {
    const { M1, M2, N } = p;
    const vertexCount = (M1 + M2 + 1) * (N + 1) + (N + 1) + 1 + (N + 1) + 1;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices = [];

    // Outer wall quads
    for (let j = 0; j < M1 + M2; j++) {
      const row1 = j * (N + 1);
      const row2 = (j + 1) * (N + 1);
      for (let i = 0; i < N; i++) {
        const a = row1 + i;
        const b = row1 + i + 1;
        const c = row2 + i;
        const d = row2 + i + 1;
        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }

    // Top meniscus cap
    const wallTopRow = (M1 + M2) * (N + 1);
    const menInnerRing = wallTopRow + (N + 1);
    const menCenter = menInnerRing + (N + 1);

    for (let i = 0; i < N; i++) {
      const a = wallTopRow + i;
      const b = wallTopRow + i + 1;
      const c = menInnerRing + i;
      const d = menInnerRing + i + 1;
      indices.push(a, c, d);
      indices.push(a, d, b);
    }
    for (let i = 0; i < N; i++) {
      const c = menInnerRing + i;
      const d = menInnerRing + i + 1;
      indices.push(c, menCenter, d);
    }

    // Bottom tip cap
    const botRing = menCenter + 1;
    const botCenter = botRing + (N + 1);
    for (let i = 0; i < N; i++) {
      const a = botRing + i;
      const b = botRing + i + 1;
      indices.push(a, b, botCenter);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    return geo;
  }

  _updateFluidMesh(rpm, dt, vortexDepthMm = 0) {
    if (!this.fluidGeometry || !this.falconFluidParams) return;
    this._computeVortexVertices(this.fluidGeometry, this.falconFluidParams, rpm, vortexDepthMm);
    if (this.microFluidGeometry && this.microFluidParams) {
      this._computeVortexVertices(this.microFluidGeometry, this.microFluidParams, rpm, vortexDepthMm * 0.6);
    }
  }

  _computeVortexVertices(geo, p, rpm, hDepthMm) {
    const { yBot, yCone, rTip, rMax, yRest, M1, M2, N } = p;
    const pos = geo.attributes.position.array;
    let ptr = 0;

    const rpmFrac = Math.min(1.0, rpm / 3200.0);
    const deltaH = hDepthMm > 0 ? hDepthMm : rpmFrac * 22.0;
    const yRim = yRest + deltaH * 0.35;
    const yCore = Math.max(yBot + 2.0, yRest - deltaH);

    // 1. Outer Conical Wall (M1 slices)
    for (let j = 0; j <= M1; j++) {
      const v = j / M1;
      const y = yBot + v * (yCone - yBot);
      const r = rTip + v * (rMax - rTip);
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const angle = u * Math.PI * 2;
        pos[ptr++] = Math.cos(angle) * r;
        pos[ptr++] = y;
        pos[ptr++] = Math.sin(angle) * r;
      }
    }

    // 2. Outer Cylindrical Wall (M2 slices)
    for (let j = 1; j <= M2; j++) {
      const v = j / M2;
      const y = yCone + v * (yRim - yCone);
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const angle = u * Math.PI * 2;
        pos[ptr++] = Math.cos(angle) * rMax;
        pos[ptr++] = y;
        pos[ptr++] = Math.sin(angle) * rMax;
      }
    }

    // 3. Top Parabolic Meniscus (Inner ring at r = rMax * 0.5)
    const rMid = rMax * 0.5;
    const yMid = yCore + (yRim - yCore) * 0.25;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const angle = u * Math.PI * 2;
      pos[ptr++] = Math.cos(angle) * rMid;
      pos[ptr++] = yMid;
      pos[ptr++] = Math.sin(angle) * rMid;
    }

    // Meniscus Center Vertex (Deepest Vortex Funnel Tip)
    pos[ptr++] = 0;
    pos[ptr++] = yCore;
    pos[ptr++] = 0;

    // 4. Bottom Tip Cap
    for (let i = 0; i <= N; i++) {
      const angle = (i / N) * Math.PI * 2;
      pos[ptr++] = Math.cos(angle) * rTip;
      pos[ptr++] = yBot;
      pos[ptr++] = Math.sin(angle) * rTip;
    }
    pos[ptr++] = 0;
    pos[ptr++] = yBot;
    pos[ptr++] = 0;

    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
  }

  setTubeType(type) {
    if (type === 'falcon15') {
      this.falconTubeGroup.visible = true;
      this.microTubeGroup.visible = false;
      this.activeTubeGroup = this.falconTubeGroup;
    } else if (type === 'micro1_5') {
      this.falconTubeGroup.visible = false;
      this.microTubeGroup.visible = true;
      this.activeTubeGroup = this.microTubeGroup;
    } else if (type === 'none') {
      this.falconTubeGroup.visible = false;
      this.microTubeGroup.visible = false;
      this.activeTubeGroup = null;
    }
  }

  setLiquidType(liquidKey) {
    this.currentLiquidKey = liquidKey;
    const hex = LIQUID_COLORS[liquidKey] || 0x38bdf8;
    if (this.fluidMaterial) this.fluidMaterial.color.setHex(hex);
  }

  setSpeedKnobAngle(normOrAngle) {
    if (!this.knobSpeed) return;
    const frac = Math.max(0, Math.min(1, normOrAngle));
    const angleRad = THREE.MathUtils.degToRad(frac * 270.0);
    this.knobSpeed.rotation.z = -angleRad;
  }

  setKnobSpeedRotation(rpm) {
    const norm = Math.max(0, Math.min(1, (rpm - 500) / (3200 - 500)));
    this.setSpeedKnobAngle(norm);
  }

  setModeSwitchState(stateStr) {
    if (!this.switchBatLever) return;
    this.modeState = stateStr;
    if (stateStr === 'TOUCH') {
      this.switchBatLever.rotation.z = THREE.MathUtils.degToRad(-20.0);
    } else if (stateStr === 'OFF') {
      this.switchBatLever.rotation.z = 0.0;
    } else if (stateStr === 'CONTINUOUS') {
      this.switchBatLever.rotation.z = THREE.MathUtils.degToRad(20.0);
    }
  }

  setLEDState(colorHex, intensity = 0.8) {
    if (this.ledMaterial) {
      this.ledMaterial.color.setHex(colorHex);
      this.ledMaterial.emissive.setHex(colorHex);
      this.ledMaterial.emissiveIntensity = intensity;
    }
  }

  setExploded(progress0to1) {
    this.explodedParts.forEach((part) => {
      if (!part.basePosition) {
        part.basePosition = part.group.position.clone();
      }
      part.group.position.copy(part.basePosition).addScaledVector(part.offset, progress0to1);
    });
  }

  updateKinematics(timeSec, rpm, dt, vortexDepthMm = 0) {
    this.currentRpm = rpm;

    if (rpm > 10) {
      const omega = 2.0 * Math.PI * (rpm / 60.0);
      const theta = omega * timeSec;

      const orbitX = Math.cos(theta) * (this.orbitalRadius * (rpm / 3200.0));
      const orbitZ = Math.sin(theta) * (this.orbitalRadius * (rpm / 3200.0));

      if (this.pivotCupHead) {
        this.pivotCupHead.position.set(orbitX, 0, orbitZ);
        this.pivotCupHead.rotation.x = Math.sin(theta) * 0.025 * (rpm / 3200.0);
        this.pivotCupHead.rotation.z = Math.cos(theta) * 0.025 * (rpm / 3200.0);
      }

      if (this.activeTubeGroup) {
        this.activeTubeGroup.position.set(orbitX, 138, -16.0 + orbitZ);
        this.activeTubeGroup.rotation.y = theta * 0.15;
      }

      this._updateFluidMesh(rpm, dt, vortexDepthMm);
    } else {
      if (this.pivotCupHead) {
        this.pivotCupHead.position.set(0, 0, 0);
        this.pivotCupHead.rotation.set(0, 0, 0);
      }
      if (this.activeTubeGroup) {
        this.activeTubeGroup.position.set(0, 138, -16.0);
      }
      this._updateFluidMesh(0, dt, 0);
    }
  }

  updateLCD(state) {
    if (!this.uiLcdMesh) return;

    if (!this.lcdCanvas) {
      this.lcdCanvas = document.createElement('canvas');
      this.lcdCanvas.width = 512;
      this.lcdCanvas.height = 256;
      this.lcdCtx = this.lcdCanvas.getContext('2d');
      this.lcdTexture = new THREE.CanvasTexture(this.lcdCanvas);
      this.lcdTexture.flipY = false;
      this.uiLcdMesh.material.map = this.lcdTexture;
      this.uiLcdMesh.material.needsUpdate = true;
    }

    const ctx = this.lcdCtx;
    const w = 512;
    const h = 256;

    // Dark LCD background with slight cyan tint
    ctx.fillStyle = '#06131c';
    ctx.fillRect(0, 0, w, h);

    // Subtle segmented pixel grid pattern
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top status row
    ctx.fillStyle = '#67e8f9';
    ctx.font = '600 24px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SRE DESIGNS', 24, 38);

    ctx.textAlign = 'right';
    ctx.font = '500 20px -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('DIGITAL VORTEX PRO · SI-VG2000', w - 24, 38);

    // Separator line
    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(24, 52);
    ctx.lineTo(w - 24, 52);
    ctx.stroke();

    // Large High-Contrast 7-Segment Style RPM Speed Telemetry
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 92px monospace';
    ctx.textAlign = 'left';
    const displayRpm = Math.round(state.currentRpm || 0);
    ctx.fillText(`${displayRpm}`, 24, 142);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px -apple-system, sans-serif';
    ctx.fillText('RPM', 270, 108);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px -apple-system, sans-serif';
    ctx.fillText(`SET: ${state.setpointRpm || 2400} RPM`, 270, 138);

    // Mode Pill Badge
    const modeStr = (state.mode || 'TOUCH').toUpperCase();
    ctx.fillStyle = modeStr === 'CONTINUOUS' ? '#0891b2' : '#334155';
    ctx.beginPath();
    ctx.roundRect(380, 78, 108, 38, 8);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(modeStr === 'CONTINUOUS' ? 'CONT' : modeStr, 434, 103);

    // Lower Data Matrix
    ctx.textAlign = 'left';
    ctx.font = '500 20px -apple-system, sans-serif';
    ctx.fillStyle = '#7dd3fc';

    let timerText = 'TIMER: OFF';
    if (state.timerEnabled) {
      const secRem = Math.max(0, Math.ceil(state.timerRemainingSec || 0));
      timerText = `TIMER: ${secRem}s REMAINING`;
    } else {
      timerText = `MODE: ${modeStr}`;
    }
    ctx.fillText(timerText, 24, 185);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px -apple-system, sans-serif';
    const vesselName = state.currentVessel === 'falcon15' ? '15 mL Falcon' : state.currentVessel === 'micro1_5' ? '1.5 mL Micro' : 'No Vessel';
    ctx.fillText(`VESSEL: ${vesselName} (4 mm Orbit)`, 24, 215);

    ctx.textAlign = 'right';
    const tempC = (state.motorTempC || 24.0).toFixed(1);
    ctx.fillText(`MOTOR: ${tempC} °C`, w - 24, 185);

    const runTime = (state.sessionRunTimeSec || 0).toFixed(1);
    ctx.fillText(`RUN TIME: ${runTime}s`, w - 24, 215);

    // Bottom accent border
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(0, h - 6, w, 6);

    this.lcdTexture.needsUpdate = true;
  }
}

/**
 * Official Canonical Brand Nameplate: makeSREdesignsBadge()
 * Standardized across all digital twins for visual QA compliance.
 */
export function makeSREdesignsBadge(plateW = 28, plateH = 8.0) {
  const group = new THREE.Group();
  group.name = 'Badge_SREdesigns';

  const plateD = 0.8;

  // Outer dark trim bezel
  const bezelGeo = new THREE.BoxGeometry(plateW + 1.2, plateH + 1.2, plateD);
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x161a22, roughness: 0.5, metalness: 0.25 });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  group.add(bezel);

  // Brushed aluminum backing plate
  const plateGeo = new THREE.BoxGeometry(plateW, plateH, plateD * 0.9);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xa0a8b4, roughness: 0.3, metalness: 0.8 });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.z = plateD * 0.05;
  group.add(plate);

  // Canvas texture: 1024 x 300
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 300;
  const ctx = c.getContext('2d');
  const cw = 1024;
  const ch = 300;

  ctx.fillStyle = '#0c1016';
  ctx.fillRect(0, 0, cw, ch);

  // Outer border
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, cw - 12, ch - 12);

  const letters = ['S', 'R', 'E'];
  const tileW = 105;
  const tileH = 125;
  const gap = 8;
  const tileY = (ch - tileH) / 2;
  let x0 = 45;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 96px system-ui, Segoe UI, Arial, sans-serif';

  for (const chLetter of letters) {
    const g2 = ctx.createLinearGradient(x0, tileY, x0 + tileW, tileY + tileH);
    g2.addColorStop(0, '#5fd0e0');
    g2.addColorStop(0.35, '#2aafc0');
    g2.addColorStop(0.7, '#148a9a');
    g2.addColorStop(1, '#0a5c68');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.roundRect(x0, tileY, tileW, tileH, 14);
    ctx.fill();

    const sheen = ctx.createLinearGradient(x0, tileY, x0, tileY + tileH * 0.5);
    sheen.addColorStop(0, 'rgba(255,255,255,0.32)');
    sheen.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.beginPath();
    ctx.roundRect(x0 + 2, tileY + 2, tileW - 4, tileH * 0.45, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(chLetter, x0 + tileW / 2, tileY + tileH / 2 + 3);
    x0 += tileW + gap;
  }

  const tx = x0 + 28;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#5ec8d8';
  ctx.font = 'bold 72px system-ui, Segoe UI, Arial, sans-serif';
  ctx.fillText('designs.com', tx, ch * 0.38);

  ctx.strokeStyle = '#3ab8c8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(tx, ch * 0.56);
  ctx.lineTo(cw - 48, ch * 0.56);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 32px system-ui, Segoe UI, Arial, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('LAB SYSTEMS', tx, ch * 0.74);
  ctx.letterSpacing = '0px';

  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;

  const faceGeo = new THREE.PlaneGeometry(plateW - 0.4, plateH - 0.4);
  const uvFace = faceGeo.attributes.uv;
  for (let i = 0; i < uvFace.count; i++) {
    uvFace.setY(i, 1.0 - uvFace.getY(i));
  }
  uvFace.needsUpdate = true;

  const faceMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide });
  const face = new THREE.Mesh(faceGeo, faceMat);
  face.position.z = plateD / 2 + 0.05;
  group.add(face);

  return group;
}
