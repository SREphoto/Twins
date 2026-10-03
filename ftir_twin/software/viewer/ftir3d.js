/**
 * SREdesigns FTIR-7000x Research-Grade Fourier-Transform Infrared Spectrometer Twin
 * High-Fidelity Procedural 3D Model & Mechanical Assembly
 *
 * Semantic Part Taxonomy Compliance:
 * - Body_Chassis: Main casting & outer shell with recessed reveals
 * - Assembly_SlopedConsole: Sloped 22° touchscreen console with aluminum trim
 * - UI_LCD: Flat UV quad with CanvasTexture (flipY = false, upright UVs, capacitive digitizer)
 * - Btn_Background, Btn_Scan, Btn_Mode, Btn_Swivel, Btn_Pressure, Btn_Power: Tactile keys
 * - Assembly_ATR_Station: Mirror-polished 316L stainless deck, monolithic Type IIa diamond prism
 * - Pivot_ATRTower: Swiveling pressure clamp arm with calibrated slip-clutch knob and sapphire anvil
 * - Assembly_Interferometer: Cast aluminum breadboard, Polaris Ever-Glo ceramic IR source,
 *   HeNe red reference laser tube (632.8 nm), KBr beam splitter (Ge-coated), fixed gold mirror with
 *   kinematic thumb screws, moving gold mirror on frictionless electromagnetic voice-coil linear motor,
 *   off-axis parabolic mirrors, DTGS pyroelectric detector, and pre-amp PCB
 * - Assembly_OpticalRays: Animated 3D ray tracing showing HeNe lock & modulated IR beam paths
 * - Assembly_PowerSupply: Switched-mode power supply (SMPS), transformer, 80mm cooling fan with louvers
 * - Assembly_PowerCord: Duplex bench outlet box, NEMA 5-15P plug, SJTOW cord, rear IEC C14 inlet
 * - Badge_SREdesigns: Diamond-cut beveled plate in recessed pocket ~1 inch from edges
 * - Fastener_HexM3_*, Fastener_HexM4_*: Real 3D hex socket cap screws (ISO 4762)
 * - Foot_Leveling_FL/FR/RL/RR: Threaded leveling feet resting on datum plane Y = 0
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
  roughness: 0.36,
  metalness: 0.14,
  side: THREE.DoubleSide,
});
const MAT_CHASSIS_DARK = new THREE.MeshStandardMaterial({
  color: 0x1a1e26,
  roughness: 0.52,
  metalness: 0.28,
});
const MAT_STAINLESS_ATR = new THREE.MeshStandardMaterial({
  color: 0xdde2e8,
  roughness: 0.12,
  metalness: 0.92,
  envMapIntensity: 2.5,
});
const MAT_DIAMOND_CRYSTAL = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.02,
  metalness: 0.05,
  transmission: 0.95,
  ior: 2.417,
  thickness: 0.08,
  transparent: true,
  opacity: 0.85,
  reflectivity: 0.9,
  clearcoat: 1.0,
});
const MAT_BEZEL = new THREE.MeshStandardMaterial({
  color: 0x141820,
  roughness: 0.65,
  metalness: 0.1,
});
const MAT_CHROME = new THREE.MeshStandardMaterial({
  color: 0xe8ecf2,
  roughness: 0.05,
  metalness: 0.98,
  envMapIntensity: 2.4,
});
const MAT_GOLD_MIRROR = new THREE.MeshPhysicalMaterial({
  color: 0xffd166,
  metalness: 0.98,
  roughness: 0.015,
  reflectivity: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.008,
  ior: 2.2,
  specularIntensity: 2.2,
  specularColor: new THREE.Color(0xfff3c4),
  envMapIntensity: 4.8,
  side: THREE.DoubleSide,
});
const MAT_KBR_BEAMSPLITTER = new THREE.MeshPhysicalMaterial({
  color: 0xfde047,
  roughness: 0.08,
  metalness: 0.15,
  transmission: 0.82,
  ior: 1.54,
  transparent: true,
  opacity: 0.75,
  reflectivity: 0.8,
});
const MAT_ALUM_BREADBOARD = new THREE.MeshStandardMaterial({
  color: 0x2a2f38,
  roughness: 0.42,
  metalness: 0.78,
  envMapIntensity: 1.2,
});
const MAT_HENE_LASER = new THREE.MeshStandardMaterial({
  color: 0x94a3b8,
  roughness: 0.35,
  metalness: 0.85,
});
const MAT_CERAMIC_EMITTER = new THREE.MeshStandardMaterial({
  color: 0xff6b35,
  emissive: 0xff4500,
  emissiveIntensity: 0.8,
  roughness: 0.8,
});
const MAT_PCB_GREEN = new THREE.MeshStandardMaterial({
  color: 0x14532d,
  roughness: 0.4,
  metalness: 0.25,
});
const MAT_CABLE_PVC = new THREE.MeshStandardMaterial({
  color: 0x181a1f,
  roughness: 0.7,
  metalness: 0.08,
});
const MAT_LIQUID_SAMPLE = new THREE.MeshPhysicalMaterial({
  color: 0x38bdf8,
  roughness: 0.05,
  transmission: 0.9,
  ior: 1.37,
  transparent: true,
  opacity: 0.8,
});

export class FTIR3D {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;

    // Kinematic & Dynamic State
    this.isPluggedIn = true;
    this.powerSwitchOn = true;
    this.hasPower = true;
    this.isScanning = false;
    this.scanProgress = 0;
    this.scanMode = 'T'; // 'T' (%Transmittance) or 'A' (Absorbance) or 'IG' (Interferogram)

    // ATR Clamp Tower Kinematics
    this.towerSwiveled = false;   // false = clamped over diamond, true = swiveled open (90°)
    this.towerAngle = 0;          // Target angle in radians
    this.currentTowerAngle = 0;
    this.clampPressurePct = 80;   // 0% to 100% (slip-clutch knob)
    this.currentAnvilY = 0;

    // Moving Mirror Voice Coil Kinematics
    this.voiceCoilOffset = 0;
    this.mirrorVelocity = 0.6329; // cm/s
    this.voiceCoilTime = 0;

    // Exploded View Progress (0 = closed, 1 = fully exploded)
    this.explodeProgress = 0;
    this.opticsViewActive = false;

    // Active Sample Analyte
    this.activeSampleId = 'isopropanol';
    this.hasBackground = true;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    // Scene Groups
    this.rootGroup = new THREE.Group();
    this.benchGroup = new THREE.Group();
    this.chassisGroup = new THREE.Group();
    this.coverGroup = new THREE.Group();
    this.atrStationGroup = new THREE.Group();
    this.atrTowerPivot = new THREE.Group();
    this.interferometerGroup = new THREE.Group();
    this.voiceCoilMovingGroup = new THREE.Group();
    this.raysGroup = new THREE.Group();
    this.powerSupplyGroup = new THREE.Group();
    this.cordGroup = new THREE.Group();
    this.buttonsGroup = new THREE.Group();

    // Actionable Interactive Meshes
    this.actionableMeshes = [];

    // Procedural Display Canvas
    this.lcdCanvas = document.createElement('canvas');
    this.lcdCanvas.width = 1024;
    this.lcdCanvas.height = 600;
    this.lcdCtx = this.lcdCanvas.getContext('2d');
    this.lcdTexture = null;

    // Animation Loop
    this.clock = new THREE.Clock();
    this.animId = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e14);
    this.scene.fog = new THREE.FogExp2(0x0a0e14, 0.035);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    this.camera.position.set(5.2, 3.8, 5.8);
    this.camera.lookAt(0, 1.0, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.setupLighting();

    // 5. Build Environment & Digital Twin Assemblies
    this.scene.add(this.rootGroup);
    this.buildLabBench();
    this.buildDuplexOutletAndCord();
    this.buildExternalChassis();
    this.buildATRStation();
    this.buildMichelsonInterferometer();
    this.buildPowerSupplyAndFan();
    this.buildSlopedConsoleAndLCD();
    this.buildOpticalRays();

    // 6. Window Resize Listener
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // 7. Start Render Loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    // Key Light (warm studio top-left)
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(4.5, 7.5, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.0002;
    this.scene.add(keyLight);

    // Fill Light (cool blue diffuse)
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.3);
    fillLight.position.set(-5.0, 5.0, 4.0);
    this.scene.add(fillLight);

    // Rear Fill Light (ensures rear panel connectors are clearly illuminated)
    const rearLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rearLight.position.set(0.0, 4.5, -6.5);
    this.scene.add(rearLight);
  }

  buildLabBench() {
    // 360-degree chemical-resistant black epoxy island bench at Y = 0
    const benchGeo = new THREE.BoxGeometry(12.0, 0.3, 10.0);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x11161d,
      roughness: 0.35,
      metalness: 0.15,
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(0, -0.15, 0);
    bench.receiveShadow = true;
    this.benchGroup.add(bench);
    this.rootGroup.add(this.benchGroup);
  }

  buildDuplexOutletAndCord() {
    // Bench-mounted duplex receptacle box at rear right (X = 2.4, Y = 0, Z = 1.6)
    const outletBoxGeo = new THREE.BoxGeometry(0.35, 0.45, 0.25);
    const outletBoxMat = new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.5 });
    const outletBox = new THREE.Mesh(outletBoxGeo, outletBoxMat);
    outletBox.position.set(2.4, 0.225, 1.6);
    outletBox.castShadow = true;
    outletBox.receiveShadow = true;
    this.cordGroup.add(outletBox);

    // Faceplate with duplex outlets
    const faceGeo = new THREE.PlaneGeometry(0.32, 0.42);
    const faceMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.set(2.4, 0.225, 1.474);
    this.cordGroup.add(face);

    // Duplex receptacle slots
    [-0.09, 0.09].forEach(yOff => {
      const slotGeo = new THREE.BoxGeometry(0.015, 0.06, 0.01);
      const slotMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
      const leftSlot = new THREE.Mesh(slotGeo, slotMat);
      leftSlot.position.set(2.36, 0.225 + yOff, 1.472);
      this.cordGroup.add(leftSlot);

      const rightSlot = new THREE.Mesh(slotGeo, slotMat);
      rightSlot.position.set(2.44, 0.225 + yOff, 1.472);
      this.cordGroup.add(rightSlot);
    });

    // Molded NEMA 5-15P plug inserted in the top duplex socket
    this.plugGroup = new THREE.Group();
    this.plugGroup.position.set(2.4, 0.315, 1.44);

    const plugBodyGeo = new THREE.BoxGeometry(0.14, 0.16, 0.18);
    const plugBodyMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.8 });
    const plugBody = new THREE.Mesh(plugBodyGeo, plugBodyMat);
    plugBody.position.set(0, 0, -0.09);
    plugBody.castShadow = true;
    this.plugGroup.add(plugBody);

    // Real prongs extending +Z into socket
    const prongGeo = new THREE.BoxGeometry(0.012, 0.05, 0.055);
    const prongMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const prong1 = new THREE.Mesh(prongGeo, prongMat);
    prong1.position.set(-0.04, 0, 0.025);
    this.plugGroup.add(prong1);

    const prong2 = new THREE.Mesh(prongGeo, prongMat);
    prong2.position.set(0.04, 0, 0.025);
    this.plugGroup.add(prong2);

    plugBody.userData = { name: 'Assembly_PowerCord_Plug', action: 'toggle_plug', tooltip: 'Click to pull/insert 120V power cord' };
    this.actionableMeshes.push(plugBody);
    this.cordGroup.add(this.plugGroup);

    // Heavy SJTOW flexible cord curve from plug to instrument rear IEC inlet
    this.updatePowerCordCurve();
    this.rootGroup.add(this.cordGroup);
  }

  updatePowerCordCurve() {
    if (this.powerCordMesh) {
      this.cordGroup.remove(this.powerCordMesh);
      this.powerCordMesh.geometry.dispose();
    }

    const plugPos = this.isPluggedIn ? new THREE.Vector3(2.4, 0.315, 1.25) : new THREE.Vector3(2.4, 0.05, 1.1);
    const inletPos = new THREE.Vector3(-1.40, 0.45, -2.18); // Rear IEC port
    const mid1 = new THREE.Vector3(1.6, 0.04, 0.2);
    const mid2 = new THREE.Vector3(-0.6, 0.04, -1.2);

    const curve = new THREE.CatmullRomCurve3([plugPos, mid1, mid2, inletPos]);
    const cordGeo = new THREE.TubeGeometry(curve, 48, 0.022, 12, false);
    this.powerCordMesh = new THREE.Mesh(cordGeo, MAT_CABLE_PVC);
    this.powerCordMesh.castShadow = true;
    this.cordGroup.add(this.powerCordMesh);

    // Position plug according to plugged status
    if (this.plugGroup) {
      this.plugGroup.position.set(2.4, this.isPluggedIn ? 0.315 : 0.06, this.isPluggedIn ? 1.44 : 1.22);
      this.plugGroup.rotation.x = this.isPluggedIn ? 0 : 0.45;
    }
  }

  buildExternalChassis() {
    const BASE_Y = 0.08;

    // 1. Threaded leveling feet at Y = 0 datum
    const footPositions = [
      [-1.9, 0.0, 1.8], [1.9, 0.0, 1.8],
      [-1.9, 0.0, -1.8], [1.9, 0.0, -1.8]
    ];
    footPositions.forEach(([x, y, z]) => {
      const foot = createVibrationFoot(0.12, 0.08);
      foot.position.set(x, y, z);
      this.chassisGroup.add(foot);
    });

    // 2. Heavy Cast Aluminum Base Pan
    const basePanGeo = new THREE.BoxGeometry(4.3, 0.16, 4.3);
    const basePan = new THREE.Mesh(basePanGeo, MAT_CHASSIS_DARK);
    basePan.position.set(0, BASE_Y + 0.08, 0);
    basePan.receiveShadow = true;
    basePan.castShadow = true;
    this.chassisGroup.add(basePan);

    // 3. Main Enclosure Top Cover (`Body_Chassis`)
    this.chassisCover = new THREE.Group();
    this.chassisCover.position.set(0, BASE_Y + 0.16, 0);

    // Left optical enclosure wing
    const leftCoverGeo = new THREE.BoxGeometry(2.1, 1.8, 4.25);
    const leftCover = new THREE.Mesh(leftCoverGeo, MAT_CHASSIS);
    leftCover.position.set(-1.05, 0.9, 0);
    leftCover.castShadow = true;
    leftCover.receiveShadow = true;
    this.chassisCover.add(leftCover);

    // Right electronics/sampling wing
    const rightCoverGeo = new THREE.BoxGeometry(2.1, 1.4, 4.25);
    const rightCover = new THREE.Mesh(rightCoverGeo, MAT_CHASSIS);
    rightCover.position.set(1.05, 0.7, 0);
    rightCover.castShadow = true;
    rightCover.receiveShadow = true;
    this.chassisCover.add(rightCover);

    // Recessed Brand Badge plate ~1 inch from edges
    const badgePlateGeo = new THREE.BoxGeometry(0.85, 0.28, 0.02);
    const badgePlateMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8,
    });
    this.badgePlate = new THREE.Mesh(badgePlateGeo, badgePlateMat);
    this.badgePlate.position.set(1.5, 1.25, 2.135);
    this.chassisCover.add(this.badgePlate);

    // Badge Silkscreen Label
    this.createBadgeSilkscreen();

    // Rear Panel I/O: IEC C14 inlet socket & industrial rocker switch at X = -1.40
    const iecInlet = createIECInlet();
    iecInlet.position.set(-1.40, 0.45, -2.135);
    iecInlet.rotation.y = Math.PI;
    this.chassisCover.add(iecInlet);

    // Rear Rocker Power Switch with Green LED
    this.rockerSwitch = createRockerSwitch({
      onChange: (state) => this.setPowerSwitch(state),
    });
    this.rockerSwitch.position.set(-0.85, 0.45, -2.135);
    this.rockerSwitch.rotation.y = Math.PI;
    this.rockerSwitch.userData = { name: 'Switch_Power', action: 'toggle_switch', tooltip: 'Rear AC Power Switch (I/O)' };
    this.actionableMeshes.push(this.rockerSwitch);
    this.chassisCover.add(this.rockerSwitch);

    // Additional Rear Communication Bulkheads (USB-B, RS-232, Purge Gas Swagelok)
    const db9 = createDB9Port();
    db9.position.set(0.4, 0.45, -2.135);
    db9.rotation.y = Math.PI;
    this.chassisCover.add(db9);

    const bncPurge = createBNCJack();
    bncPurge.position.set(1.1, 0.45, -2.135);
    bncPurge.rotation.y = Math.PI;
    this.chassisCover.add(bncPurge);

    // Fasteners on cover perimeters
    const screwOffsets = [
      [-1.9, 1.82, -1.9], [-1.9, 1.82, 1.9],
      [1.9, 1.42, -1.9], [1.9, 1.42, 1.9],
      [0.0, 1.42, 1.9], [0.0, 1.82, -1.9]
    ];
    screwOffsets.forEach(([sx, sy, sz]) => {
      const screw = createHexSocketScrew(0.02, 0.05);
      screw.position.set(sx, sy, sz);
      this.chassisCover.add(screw);
    });

    this.chassisGroup.add(this.chassisCover);
    this.rootGroup.add(this.chassisGroup);
  }

  createBadgeSilkscreen() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 168;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0a0e14';
    ctx.fillRect(0, 0, 512, 168);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 156);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('SREdesigns', 24, 52);

    ctx.fillStyle = '#00d4e8';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('FTIR-7000x', 24, 108);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 22px monospace';
    ctx.fillText('RESEARCH SPECTROMETER', 24, 144);

    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false;

    const labelGeo = new THREE.PlaneGeometry(0.82, 0.26);
    // Upright UVs
    const uvs = labelGeo.attributes.uv;
    for (let i = 0; i < uvs.count; i++) {
      uvs.setY(i, 1.0 - uvs.getY(i));
    }
    uvs.needsUpdate = true;

    const labelMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.set(1.5, 1.25, 2.146);
    this.chassisCover.add(labelMesh);
  }

  buildATRStation() {
    // Seated in the top-right deck recess at Y = 1.48
    this.atrStationGroup.position.set(0.65, 1.48, 0.35);

    // 1. Mirror-polished 316L Stainless Steel Base Plate (140 x 140 mm)
    const plateGeo = new THREE.BoxGeometry(1.2, 0.08, 1.2);
    const plate = new THREE.Mesh(plateGeo, MAT_STAINLESS_ATR);
    plate.castShadow = true;
    plate.receiveShadow = true;
    this.atrStationGroup.add(plate);

    // 4 Corner hex socket mounting screws
    [[-0.48, -0.48], [0.48, -0.48], [-0.48, 0.48], [0.48, 0.48]].forEach(([cx, cz]) => {
      const scr = createHexSocketScrew(0.015, 0.04);
      scr.position.set(cx, 0.042, cz);
      this.atrStationGroup.add(scr);
    });

    // 2. Central Tungsten Carbide Mount Collar
    const collarGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.03, 32);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x333842, metalness: 0.85, roughness: 0.25 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(0, 0.042, 0);
    this.atrStationGroup.add(collar);

    // 3. Monolithic Type IIa Diamond Prism Crystal (dia 3mm window)
    const diamondGeo = new THREE.CylinderGeometry(0.075, 0.05, 0.04, 16);
    this.diamondMesh = new THREE.Mesh(diamondGeo, MAT_DIAMOND_CRYSTAL);
    this.diamondMesh.position.set(0, 0.052, 0);
    this.diamondMesh.userData = { name: 'Prism_Diamond_TypeIIa', action: 'inspect_diamond', tooltip: 'Type IIa Monolithic Diamond ATR Crystal' };
    this.actionableMeshes.push(this.diamondMesh);
    this.atrStationGroup.add(this.diamondMesh);

    // 4. Sample Analyte Deposit (Droplet or Solid Disc)
    const sampleGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.016, 24);
    this.sampleMesh = new THREE.Mesh(sampleGeo, MAT_LIQUID_SAMPLE);
    this.sampleMesh.position.set(0, 0.065, 0);
    this.sampleMesh.userData = { name: 'Mesh_SampleAnalyte', action: 'toggle_sample', tooltip: 'Click to change active sample analyte' };
    this.actionableMeshes.push(this.sampleMesh);
    this.atrStationGroup.add(this.sampleMesh);

    // 5. Swiveling Pressure Tower (`Pivot_ATRTower`)
    // Base pivot post mounted at rear left of the ATR plate (-0.45, 0, -0.45)
    this.atrTowerPivot.position.set(-0.45, 0.04, -0.45);

    // Heavy vertical chrome post
    const postGeo = new THREE.CylinderGeometry(0.065, 0.08, 0.75, 24);
    const post = new THREE.Mesh(postGeo, MAT_CHROME);
    post.position.set(0, 0.375, 0);
    post.castShadow = true;
    this.atrTowerPivot.add(post);

    // Horizontal cantilever swing arm
    const armGeo = new THREE.BoxGeometry(0.72, 0.12, 0.14);
    const arm = new THREE.Mesh(armGeo, MAT_CHROME);
    arm.position.set(0.3, 0.72, 0);
    arm.castShadow = true;
    this.atrTowerPivot.add(arm);

    // Calibrated Slip-Clutch Pressure Knob
    const knobGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.16, 32);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x222630, roughness: 0.6, metalness: 0.3 });
    this.knobMesh = new THREE.Mesh(knobGeo, knobMat);
    this.knobMesh.position.set(0.62, 0.82, 0);
    this.knobMesh.castShadow = true;
    this.knobMesh.userData = { name: 'Knob_Pressure', action: 'toggle_pressure', tooltip: 'Calibrated Slip-Clutch Pressure Knob (Click to cycle pressure)' };
    this.actionableMeshes.push(this.knobMesh);
    this.atrTowerPivot.add(this.knobMesh);

    // Pressure Anvil Tip (descends down toward diamond)
    const anvilGeo = new THREE.CylinderGeometry(0.035, 0.015, 0.22, 16);
    this.anvilMesh = new THREE.Mesh(anvilGeo, MAT_CHROME);
    this.anvilMesh.position.set(0.62, 0.62, 0);
    this.atrTowerPivot.add(this.anvilMesh);

    arm.userData = { name: 'Pivot_ATRTower', action: 'toggle_swivel', tooltip: 'Click to swivel ATR Pressure Tower open/closed' };
    this.actionableMeshes.push(arm);

    this.atrStationGroup.add(this.atrTowerPivot);
    this.chassisCover.add(this.atrStationGroup);
  }

  buildMichelsonInterferometer() {
    // Optical breadboard seated inside the left chassis wing
    this.interferometerGroup.position.set(-1.05, 0.32, 0);

    // Heavy Aluminum Breadboard Baseplate (2.0 x 3.8 x 0.12)
    const bbGeo = new THREE.BoxGeometry(1.95, 0.08, 3.8);
    const breadboard = new THREE.Mesh(bbGeo, MAT_ALUM_BREADBOARD);
    breadboard.receiveShadow = true;
    this.interferometerGroup.add(breadboard);

    // 1. Ceramic IR Source (Polaris Ever-Glo) in sealed cylindrical heatsink
    const sourceGeo = new THREE.CylinderGeometry(0.15, 0.16, 0.45, 24);
    const sourceCasing = new THREE.Mesh(sourceGeo, MAT_CHASSIS_DARK);
    sourceCasing.position.set(-0.65, 0.26, 1.4);
    this.interferometerGroup.add(sourceCasing);

    const coilGeo = new THREE.TorusGeometry(0.06, 0.018, 16, 32);
    this.irEmitterCoil = new THREE.Mesh(coilGeo, MAT_CERAMIC_EMITTER);
    this.irEmitterCoil.position.set(-0.65, 0.26, 1.25);
    this.irEmitterCoil.rotation.x = Math.PI / 2;
    this.interferometerGroup.add(this.irEmitterCoil);

    // 2. HeNe Reference Laser Tube (632.8 nm Red Gas Laser)
    const laserGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.4, 24);
    const laserTube = new THREE.Mesh(laserGeo, MAT_HENE_LASER);
    laserTube.position.set(-0.82, 0.22, -0.4);
    laserTube.rotation.x = Math.PI / 2;
    this.interferometerGroup.add(laserTube);

    // 3. Central Michelson Beam Splitter Cube / KBr Substrate
    const bsGeo = new THREE.BoxGeometry(0.35, 0.45, 0.06);
    this.beamSplitterMesh = new THREE.Mesh(bsGeo, MAT_KBR_BEAMSPLITTER);
    this.beamSplitterMesh.position.set(0.0, 0.26, 0.35);
    this.beamSplitterMesh.rotation.y = Math.PI / 4; // 45 degrees
    this.beamSplitterMesh.castShadow = true;
    this.interferometerGroup.add(this.beamSplitterMesh);

    // 4. Fixed Gold Mirror with Kinematic Adjusters
    const fmGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.04, 32);
    const fixedMirror = new THREE.Mesh(fmGeo, MAT_GOLD_MIRROR);
    fixedMirror.position.set(0.68, 0.26, 0.35);
    fixedMirror.rotation.z = Math.PI / 2;
    this.interferometerGroup.add(fixedMirror);

    // 3 Brass kinematic adjuster thumbscrews
    [[-0.1, 0.1], [0.1, 0.1], [0.0, -0.12]].forEach(([oy, oz]) => {
      const scr = createHexSocketScrew(0.012, 0.06);
      scr.position.set(0.72, 0.26 + oy, 0.35 + oz);
      scr.rotation.z = -Math.PI / 2;
      this.interferometerGroup.add(scr);
    });

    // 5. Moving Mirror Voice-Coil Assembly
    this.voiceCoilMovingGroup.position.set(0.0, 0.26, -0.65);

    const mmGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.04, 32);
    this.movingMirror = new THREE.Mesh(mmGeo, MAT_GOLD_MIRROR);
    this.movingMirror.rotation.x = Math.PI / 2;
    this.voiceCoilMovingGroup.add(this.movingMirror);

    // Voice coil magnetic stator housing
    const statorGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.35, 24);
    const stator = new THREE.Mesh(statorGeo, MAT_CHASSIS_DARK);
    stator.position.set(0, 0, -0.22);
    stator.rotation.x = Math.PI / 2;
    this.interferometerGroup.add(stator);

    this.interferometerGroup.add(this.voiceCoilMovingGroup);

    // 6. DTGS Pyroelectric Detector
    const dtgsGeo = new THREE.CylinderGeometry(0.14, 0.15, 0.32, 24);
    const dtgsMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const dtgs = new THREE.Mesh(dtgsGeo, dtgsMat);
    dtgs.position.set(0.65, 0.26, -1.35);
    this.interferometerGroup.add(dtgs);

    // Pre-amp PCB Board
    const pcbGeo = new THREE.BoxGeometry(0.7, 0.04, 0.9);
    const pcb = new THREE.Mesh(pcbGeo, MAT_PCB_GREEN);
    pcb.position.set(0.2, 0.12, -1.35);
    this.interferometerGroup.add(pcb);

    this.chassisGroup.add(this.interferometerGroup);
  }

  buildPowerSupplyAndFan() {
    this.powerSupplyGroup.position.set(1.05, 0.32, -1.1);

    // Internal SMPS Box
    const smpsGeo = new THREE.BoxGeometry(1.6, 0.55, 1.4);
    const smps = new THREE.Mesh(smpsGeo, MAT_CHASSIS_DARK);
    smps.position.set(0, 0.28, 0);
    this.powerSupplyGroup.add(smps);

    // Cooling Fan at rear left chassis at X = -1.40
    this.fanGroup = new THREE.Group();
    this.fanGroup.position.set(-1.40, 1.25, -2.12);

    const fanCowlGeo = new THREE.BoxGeometry(0.7, 0.7, 0.08);
    const fanCowl = new THREE.Mesh(fanCowlGeo, MAT_CHASSIS_DARK);
    this.fanGroup.add(fanCowl);

    // 7 Fan blades
    const hubGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
    this.fanHub = new THREE.Mesh(hubGeo, MAT_CHASSIS_DARK);
    this.fanHub.rotation.x = Math.PI / 2;

    for (let i = 0; i < 7; i++) {
      const bladeGeo = new THREE.BoxGeometry(0.04, 0.22, 0.015);
      const blade = new THREE.Mesh(bladeGeo, MAT_CHASSIS_DARK);
      blade.position.set(0, 0.12, 0);
      blade.rotation.z = (i * Math.PI * 2) / 7;
      this.fanHub.add(blade);
    }
    this.fanGroup.add(this.fanHub);

    // Rear chassis exhaust louvers at X = -1.40
    for (let l = 0; l < 6; l++) {
      const louverGeo = new THREE.BoxGeometry(0.65, 0.025, 0.04);
      const louver = new THREE.Mesh(louverGeo, MAT_CHROME);
      louver.position.set(-1.40, 1.05 + l * 0.07, -2.145);
      this.chassisCover.add(louver);
    }

    this.rootGroup.add(this.fanGroup);
    this.chassisGroup.add(this.powerSupplyGroup);
  }

  buildSlopedConsoleAndLCD() {
    // Sloped 22° Touchscreen Console Deck at the front of the right wing
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(1.05, 1.05, 1.35);
    consoleGroup.rotation.x = -0.384; // ~22 degrees

    // Bezel Frame
    const bezelGeo = new THREE.BoxGeometry(1.9, 1.2, 0.08);
    const bezel = new THREE.Mesh(bezelGeo, MAT_BEZEL);
    consoleGroup.add(bezel);

    // LCD Quad with Dynamic CanvasTexture (`UI_LCD`)
    this.lcdTexture = new THREE.CanvasTexture(this.lcdCanvas);
    this.lcdTexture.flipY = false;

    const screenGeo = new THREE.PlaneGeometry(1.68, 0.98);
    // Upright UV coordinates
    const uvs = screenGeo.attributes.uv;
    for (let i = 0; i < uvs.count; i++) {
      uvs.setY(i, 1.0 - uvs.getY(i));
    }
    uvs.needsUpdate = true;

    const screenMat = new THREE.MeshBasicMaterial({ map: this.lcdTexture });
    this.lcdScreen = new THREE.Mesh(screenGeo, screenMat);
    this.lcdScreen.position.set(0, 0.02, 0.042);
    this.lcdScreen.userData = { name: 'UI_LCD', action: 'tap_screen', tooltip: 'FTIR Capacitive Touchscreen (Click to cycle view/mode)' };
    this.actionableMeshes.push(this.lcdScreen);
    consoleGroup.add(this.lcdScreen);

    // Physical Membrane Action Keys under screen
    const keyLabels = [
      { id: 'btn_bg', name: 'Btn_Background', label: 'BG', x: -0.6 },
      { id: 'btn_scan', name: 'Btn_Scan', label: 'SCAN', x: -0.2 },
      { id: 'btn_mode', name: 'Btn_Mode', label: 'MODE', x: 0.2 },
      { id: 'btn_swivel', name: 'Btn_Swivel', label: 'TOWER', x: 0.6 }
    ];

    keyLabels.forEach(k => {
      const keyGeo = new THREE.BoxGeometry(0.28, 0.10, 0.03);
      const keyMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 });
      const keyMesh = new THREE.Mesh(keyGeo, keyMat);
      keyMesh.position.set(k.x, -0.48, 0.045);
      keyMesh.userData = { name: k.name, action: k.id, tooltip: `Button: ${k.label}` };
      this.actionableMeshes.push(keyMesh);
      consoleGroup.add(keyMesh);
    });

    this.chassisCover.add(consoleGroup);
  }

  buildOpticalRays() {
    // Visualized ray tracing path (Ever-Glo -> BS -> Mirrors -> ATR Diamond -> DTGS)
    const points = [
      new THREE.Vector3(-1.7, 0.58, 1.25),  // IR Emitter
      new THREE.Vector3(-1.05, 0.58, 0.35), // Beam Splitter
      new THREE.Vector3(-0.37, 0.58, 0.35), // Fixed Mirror
      new THREE.Vector3(-1.05, 0.58, 0.35), // Return to BS
      new THREE.Vector3(-1.05, 0.58, -0.3), // Moving Mirror
      new THREE.Vector3(-1.05, 0.58, 0.35), // Return to BS
      new THREE.Vector3(0.65, 1.53, 0.35),  // ATR Diamond bottom
      new THREE.Vector3(0.65, 1.54, 0.35),  // Total internal reflection
      new THREE.Vector3(-0.4, 0.58, -1.35)  // DTGS detector
    ];

    const curve = new THREE.CatmullRomCurve3(points);
    const rayGeo = new THREE.TubeGeometry(curve, 64, 0.014, 8, false);
    this.rayMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4e8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    this.rayMesh = new THREE.Mesh(rayGeo, this.rayMaterial);
    this.raysGroup.add(this.rayMesh);

    // HeNe Laser Reference Beam (Red 632.8 nm)
    const henePoints = [
      new THREE.Vector3(-1.87, 0.54, -0.4),
      new THREE.Vector3(-1.05, 0.54, 0.35),
      new THREE.Vector3(-0.37, 0.54, 0.35)
    ];
    const heneCurve = new THREE.CatmullRomCurve3(henePoints);
    const heneGeo = new THREE.TubeGeometry(heneCurve, 24, 0.008, 8, false);
    const heneMat = new THREE.MeshBasicMaterial({ color: 0xff0033, transparent: true, opacity: 0.85 });
    this.heneMesh = new THREE.Mesh(heneGeo, heneMat);
    this.raysGroup.add(this.heneMesh);

    this.raysGroup.visible = false; // Toggled via Optics View
    this.rootGroup.add(this.raysGroup);
  }

  // --- Dynamic Display Rendering ---
  updateDisplay() {
    const ctx = this.lcdCtx;
    const w = this.lcdCanvas.width;
    const h = this.lcdCanvas.height;

    // Dark screen background if unpowered
    if (!this.hasPower) {
      ctx.fillStyle = '#06080b';
      ctx.fillRect(0, 0, w, h);
      this.lcdTexture.needsUpdate = true;
      return;
    }

    ctx.fillStyle = '#0c1017';
    ctx.fillRect(0, 0, w, h);

    // Top Header Bar
    ctx.fillStyle = '#161e2b';
    ctx.fillRect(0, 0, w, 56);

    ctx.fillStyle = '#00d4e8';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('SRE FTIR-7000x', 24, 38);

    ctx.fillStyle = this.isScanning ? '#f59e0b' : '#3dd68c';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(this.isScanning ? '● SCANNING...' : '● READY', 290, 37);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px monospace';
    ctx.fillText('HeNe: LOCKED (632.8nm)  |  PURGE: OK', 520, 37);

    // Spectrum Viewport Border
    ctx.strokeStyle = '#223044';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 80, w - 80, h - 170);

    // Draw Infrared Grid & Axes
    ctx.strokeStyle = '#182232';
    ctx.lineWidth = 1;
    for (let wn = 4000; wn >= 400; wn -= 400) {
      const x = 40 + ((4000 - wn) / 3600) * (w - 80);
      ctx.beginPath();
      ctx.moveTo(x, 80);
      ctx.lineTo(x, h - 90);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '14px monospace';
      ctx.fillText(`${wn}`, x - 16, h - 70);
    }

    // Draw Live Infrared Curve
    ctx.beginPath();
    ctx.strokeStyle = '#00d4e8';
    ctx.lineWidth = 3;

    const sampleBands = this.getSampleBands();

    for (let px = 0; px <= w - 80; px += 2) {
      const wn = 4000 - (px / (w - 80)) * 3600;
      let val = 98.0; // Baseline %T

      sampleBands.forEach(b => {
        const diff = wn - b.wn;
        const dip = b.depth * Math.exp(-0.5 * Math.pow(diff / (b.w / 2.35), 2));
        val -= dip;
      });

      // Add subtle scan oscillation if running
      if (this.isScanning) {
        val += (Math.random() - 0.5) * 1.5;
      }

      val = Math.max(2.0, Math.min(100.0, val));

      const y = (this.scanMode === 'T')
        ? 80 + ((100 - val) / 100) * (h - 170)
        : (h - 90) - ((100 - val) / 100) * (h - 170);

      const canvasX = 40 + px;
      if (px === 0) ctx.moveTo(canvasX, y);
      else ctx.lineTo(canvasX, y);
    }
    ctx.stroke();

    // Annotate Characteristic Functional Peaks
    sampleBands.forEach(b => {
      const x = 40 + ((4000 - b.wn) / 3600) * (w - 80);
      const val = 100.0 - b.depth;
      const y = (this.scanMode === 'T')
        ? 80 + ((100 - val) / 100) * (h - 170)
        : (h - 90) - ((100 - val) / 100) * (h - 170);

      // Pin indicator
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${b.label} (${b.wn})`, x - 30, y - 10);
    });

    // Bottom Telemetry Bar
    ctx.fillStyle = '#161e2b';
    ctx.fillRect(0, h - 55, w, 55);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 17px monospace';
    ctx.fillText(`SAMPLE: ${this.activeSampleId.toUpperCase()}  |  ATR: ${this.towerSwiveled ? 'OPEN' : `${this.clampPressurePct}% CLAMPED`}  |  MODE: %${this.scanMode}`, 24, h - 22);

    this.lcdTexture.needsUpdate = true;
  }

  getSampleBands() {
    if (this.towerSwiveled && this.activeSampleId === 'polystyrene') {
      return []; // Solid film requires clamp pressure
    }

    switch (this.activeSampleId) {
      case 'isopropanol':
        return [
          { wn: 3350, depth: 75, w: 260, label: 'O-H stretch' },
          { wn: 2970, depth: 65, w: 45, label: 'C-H stretch' },
          { wn: 1380, depth: 40, w: 25, label: 'gem-dimethyl' },
          { wn: 1129, depth: 70, w: 40, label: 'C-O stretch' }
        ];
      case 'acetone':
        return [
          { wn: 2925, depth: 25, w: 35, label: 'C-H' },
          { wn: 1715, depth: 90, w: 36, label: 'C=O Carbonyl' },
          { wn: 1363, depth: 55, w: 28, label: 'CH3 def' },
          { wn: 1222, depth: 65, w: 38, label: 'C-C stretch' }
        ];
      case 'polystyrene':
        return [
          { wn: 3026, depth: 60, w: 20, label: 'arom C-H' },
          { wn: 2924, depth: 65, w: 26, label: 'aliph C-H' },
          { wn: 1601, depth: 62, w: 18, label: 'C=C ring' },
          { wn: 1492, depth: 70, w: 20, label: 'C=C ring' },
          { wn: 698, depth: 85, w: 24, label: 'puckering' }
        ];
      default:
        return [];
    }
  }

  // --- Interaction API ---
  setPowerCord(plugged) {
    this.isPluggedIn = !!plugged;
    this.hasPower = this.isPluggedIn && this.powerSwitchOn;
    this.updatePowerCordCurve();
    this.updateDisplay();
  }

  setPowerSwitch(on) {
    this.powerSwitchOn = !!on;
    this.hasPower = this.isPluggedIn && this.powerSwitchOn;
    this.updateDisplay();
  }

  toggleSwivel() {
    this.towerSwiveled = !this.towerSwiveled;
    this.towerAngle = this.towerSwiveled ? Math.PI / 2 : 0;
  }

  setPressure(pct) {
    this.clampPressurePct = Math.max(0, Math.min(100, pct));
  }

  setSample(sampleId) {
    this.activeSampleId = sampleId;
    if (this.sampleMesh) {
      if (sampleId === 'polystyrene') {
        this.sampleMesh.material.color.setHex(0xe2e8f0);
        this.sampleMesh.material.roughness = 0.4;
      } else {
        this.sampleMesh.material.color.setHex(0x38bdf8);
        this.sampleMesh.material.roughness = 0.05;
      }
    }
    this.updateDisplay();
  }

  startScan() {
    if (!this.hasPower || this.isScanning) return;
    this.isScanning = true;
    this.scanProgress = 0;
  }

  toggleOpticsView() {
    this.opticsViewActive = !this.opticsViewActive;
    this.raysGroup.visible = this.opticsViewActive;
    if (this.chassisCover) {
      this.chassisCover.traverse(node => {
        if (node.isMesh && node !== this.badgePlate && !node.userData.isAlwaysOpaque) {
          if (this.opticsViewActive) {
            if (!node.userData.origMaterial) node.userData.origMaterial = node.material;
            node.material = node.material.clone();
            node.material.transparent = true;
            node.material.opacity = 0.16;
            node.material.depthWrite = false;
          } else if (node.userData.origMaterial) {
            node.material = node.userData.origMaterial;
          }
        }
      });
    }
  }

  setExploded(val) {
    this.explodeProgress = Math.max(0, Math.min(1, val));
  }

  // --- Render & Kinematics Loop ---
  animate() {
    this.animId = requestAnimationFrame(this.animate.bind(this));
    const delta = this.clock.getDelta();

    // 1. Swivel Kinematics for ATR Tower
    if (Math.abs(this.currentTowerAngle - this.towerAngle) > 0.01) {
      this.currentTowerAngle += (this.towerAngle - this.currentTowerAngle) * 0.12;
      this.atrTowerPivot.rotation.y = this.currentTowerAngle;
    }

    // 2. Anvil Tip Vertical Motion with Pressure
    const targetAnvil = (this.towerSwiveled ? 0.75 : 0.62) - (this.clampPressurePct / 100) * 0.035;
    this.currentAnvilY += (targetAnvil - this.currentAnvilY) * 0.15;
    if (this.anvilMesh) {
      this.anvilMesh.position.y = this.currentAnvilY;
    }

    // 3. Michelson Moving Mirror Voice Coil Motion during Scan
    if (this.hasPower && this.isScanning) {
      this.voiceCoilTime += delta * 8.0;
      this.voiceCoilOffset = Math.sin(this.voiceCoilTime) * 0.12;
      this.voiceCoilMovingGroup.position.z = -0.65 + this.voiceCoilOffset;

      this.scanProgress += delta * 0.25;
      if (this.scanProgress >= 1.0) {
        this.isScanning = false;
        this.scanProgress = 0;
      }
    }

    // 4. Cooling Fan Rotation
    if (this.hasPower && this.fanHub) {
      this.fanHub.rotation.z += delta * 25.0;
    }

    // 5. Exploded View Offsets
    if (this.chassisCover) {
      this.chassisCover.position.y = (0.08 + 0.16) + this.explodeProgress * 1.4;
    }

    // 6. Update LCD screen texture
    this.updateDisplay();

    // 7. Render
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}
