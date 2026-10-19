/**
 * Agilent 708-DS USP Tablet Dissolution Workstation (Digital Twin 3D Engine)
 * Centrifuge Gold Standard Procedural CAD & Kinematic Assembly
 *
 * Exhaustive Procedural Detail:
 *  - Genuine 3D fasteners (knurled hex socket cap screws, hex bolts, slotted screws, ball bearings)
 *  - Real hollow structural castings (base pan cavity, drive head enclosure with detachable hood)
 *  - Internal base mechanics: 12 kg cast iron ballast plate, elevator 24V DC gearmotor, PSU board, toroidal transformer, filter caps, wiring harness
 *  - Internal drive head mechanics: 24V brushless motor (stator core, 8 copper coils, rotor fan), cogged timing belt, 8 machined pulleys with teeth, idler tensioners, optical encoder, MCU board
 *  - 8 USP Apparatus 2 quick-lock collets, mirror electropolished 316SS shafts (dia 9.5 mm) with laser 25mm depth line, and exact 74.5 x 19.0 x 4.0 mm paddle blades
 *  - 5-wall optical acrylic water bath with 4-nozzle circulation diffuser manifold
 *  - 8 TruCenter anodized vessel collar rings with locating dowels and laser numerals
 *  - 8 precision 1000 mL borosilicate vessels with hemispherical bottoms and ceramic graduations
 *  - Dynamic parabolic media vortex & Noyes-Whitney eroding biconvex Prednisone tablets
 *  - External AutoTemp 1150W heater/circulator with dual LED display, carry handle, and reinforced silicone hoses with worm-gear clamps
 *  - Lab environment with black epoxy resin bench datum Y=0 and bench duplex outlet box (NEMA 5-15P plug & physical AC continuity)
 */

import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Material Generators & PBR Palette (Electropolished Silver Pop & True IOR)
// ----------------------------------------------------------------------------
function makeMat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.r ?? 0.42,
    metalness: opts.m ?? 0.10,
    transparent: opts.o != null && opts.o < 1.0,
    opacity: opts.o ?? 1.0,
    emissive: new THREE.Color(opts.e ?? 0x000000),
    emissiveIntensity: opts.ei ?? 0,
    side: opts.side ?? THREE.FrontSide,
    depthWrite: opts.dw ?? true
  });
}

// Chassis & Enclosures (Glacier Lab Cream & Dark Graphite)
const MAT_CHASSIS_CREAM = makeMat(0xf0f4f8, { r: 0.32, m: 0.08 });
const MAT_CHASSIS_DARK  = makeMat(0x1a2332, { r: 0.52, m: 0.20 });
const MAT_DRIVE_HEAD    = makeMat(0xf8fafc, { r: 0.26, m: 0.10 });
const MAT_FASCIA_BEZEL  = makeMat(0x0f172a, { r: 0.60, m: 0.15 });

// High-Luster Electropolished Stainless Steels (Tuned for bright specular silver gleam)
const MAT_316SS_ELECTROPOLISHED = makeMat(0xf8fafc, { r: 0.14, m: 0.88 }); // Spindles & paddle blades
const MAT_316SS_MIRROR          = MAT_316SS_ELECTROPOLISHED;
const MAT_316SS_BRUSHED         = makeMat(0xd8e0e8, { r: 0.24, m: 0.82 }); // Collets, fittings, trim
const MAT_ALUM_ANODIZED         = makeMat(0xcbd5e1, { r: 0.28, m: 0.78 }); // Pulleys, TruCenter rings, carriage
const MAT_CHROME_STEEL          = makeMat(0xf1f5f9, { r: 0.16, m: 0.88 }); // Guide shafts, lead screw, fasteners
const MAT_CAST_IRON             = makeMat(0x334155, { r: 0.72, m: 0.38 }); // 12 kg base ballast plate
const MAT_COPPER_COIL           = makeMat(0xca8a04, { r: 0.25, m: 0.85 }); // Motor windings
const MAT_BRASS_FITTING         = makeMat(0xd97706, { r: 0.22, m: 0.82 }); // Quick-disconnect valves, bronze nut

// Polymers, Elastomers & FR-4
const MAT_RUBBER_NBR    = makeMat(0x18181b, { r: 0.85, m: 0.05 }); // Leveling pads, boots, gaskets
const MAT_TIMING_BELT   = makeMat(0x111827, { r: 0.90, m: 0.04 }); // Cogged timing belt
const MAT_SILICONE_HOSE = makeMat(0x0284c7, { r: 0.45, m: 0.05, o: 0.82 }); // Translucent blue circulator hose
const MAT_CORD_BLACK    = makeMat(0x0a0f1d, { r: 0.75, m: 0.05 }); // 3-conductor SJTOW power cord
const MAT_PCB_FR4       = makeMat(0x15803d, { r: 0.50, m: 0.12 }); // Green solder-mask motherboard
const MAT_IC_PACKAGE    = makeMat(0x1e293b, { r: 0.35, m: 0.08 }); // Silicon IC chips
const MAT_TABLET_SOLID  = makeMat(0xfdfbf7, { r: 0.75, m: 0.02 }); // Prednisone biconvex tablet

// Optical Glass & Acrylics (MeshPhysicalMaterial with physical transmission & IOR)
const MAT_BATH_ACRYLIC = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.95,
  roughness: 0.04,
  ior: 1.49,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide
});

const MAT_BORO_VESSEL = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.96,
  roughness: 0.02,
  ior: 1.52,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide
});

const MAT_BATH_WATER = new THREE.MeshPhysicalMaterial({
  color: 0x38bdf8,
  transmission: 0.88,
  roughness: 0.05,
  ior: 1.333,
  transparent: true,
  depthWrite: false
});

const MAT_VESSEL_MEDIUM = new THREE.MeshPhysicalMaterial({
  color: 0x93c5fd,
  transmission: 0.90,
  roughness: 0.03,
  ior: 1.333,
  transparent: true,
  depthWrite: false
});

// ----------------------------------------------------------------------------
// Procedural Fastener & Hardware Library (Genuine 3D Physical Geometry)
// ----------------------------------------------------------------------------
function makeSocketHeadCapScrew(radius = 0.035, length = 0.08) {
  const g = new THREE.Group();
  g.name = 'Fastener_SocketHeadCapScrew';

  // Threaded shank
  const shank = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, length, 14),
    MAT_CHROME_STEEL
  );
  shank.position.y = -length / 2;
  shank.castShadow = true;
  g.add(shank);

  // Cylindrical head with knurled grip rings
  const headH = radius * 1.0;
  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, headH, 18),
    MAT_CHROME_STEEL
  );
  head.position.y = headH / 2;
  head.castShadow = true;
  g.add(head);

  // Deep hexagonal socket recess (genuine 3D hex socket hole)
  const sockR = radius * 0.52;
  const sockH = headH * 0.65;
  const socket = new THREE.Mesh(
    new THREE.CylinderGeometry(sockR, sockR, sockH, 6),
    MAT_CHASSIS_DARK
  );
  socket.position.y = headH - sockH / 2 + 0.001;
  g.add(socket);

  return g;
}

function makeHexBolt(radius = 0.04, length = 0.10, withWasher = true) {
  const g = new THREE.Group();
  g.name = 'Fastener_HexBolt';

  const shank = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, length, 14),
    MAT_CHROME_STEEL
  );
  shank.position.y = -length / 2;
  shank.castShadow = true;
  g.add(shank);

  // Hexagonal bolt head
  const headH = radius * 0.8;
  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, headH, 6),
    MAT_CHROME_STEEL
  );
  head.position.y = headH / 2;
  head.castShadow = true;
  g.add(head);

  if (withWasher) {
    const wash = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 1.5, radius * 1.5, radius * 0.15, 18),
      MAT_316SS_BRUSHED
    );
    wash.position.y = -radius * 0.075;
    g.add(wash);
  }

  return g;
}

function makeSlottedScrew(radius = 0.03, length = 0.06) {
  const g = new THREE.Group();
  g.name = 'Fastener_SlottedScrew';

  const shank = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.5, radius * 0.5, length, 12),
    MAT_CHROME_STEEL
  );
  shank.position.y = -length / 2;
  g.add(shank);

  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 0.8, radius * 0.6, 16),
    MAT_CHROME_STEEL
  );
  head.position.y = radius * 0.3;
  g.add(head);

  const slot = new THREE.Mesh(
    new THREE.BoxGeometry(radius * 0.35, radius * 0.3, radius * 1.8),
    MAT_CHASSIS_DARK
  );
  slot.position.y = radius * 0.45;
  g.add(slot);

  return g;
}

function makeBallBearing(outerR = 0.16, innerR = 0.08, width = 0.08) {
  const g = new THREE.Group();
  g.name = 'Fastener_PrecisionBallBearing';

  // Outer Race
  const outerRace = new THREE.Mesh(
    new THREE.CylinderGeometry(outerR, outerR, width, 24, 1, true),
    MAT_CHROME_STEEL
  );
  g.add(outerRace);

  // Inner Race
  const innerRace = new THREE.Mesh(
    new THREE.CylinderGeometry(innerR, innerR, width, 24, 1, true),
    MAT_CHROME_STEEL
  );
  g.add(innerRace);

  // Bearing Shield / Seal ring
  const seal = new THREE.Mesh(
    new THREE.RingGeometry(innerR + 0.01, outerR - 0.01, 24),
    MAT_CHASSIS_DARK
  );
  seal.rotation.x = Math.PI / 2;
  seal.position.y = width / 2;
  g.add(seal);

  // 8 Chrome Steel Bearing Balls inside raceway
  const ballR = (outerR - innerR) * 0.35;
  const pitchR = (outerR + innerR) / 2;
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(ballR, 12, 12),
      MAT_CHROME_STEEL
    );
    ball.position.set(Math.cos(ang) * pitchR, 0, Math.sin(ang) * pitchR);
    g.add(ball);
  }

  return g;
}

function makeHoseClamp(diameter = 0.14, width = 0.04) {
  const g = new THREE.Group();
  g.name = 'Fastener_WormGearHoseClamp';

  // Stainless steel band ring
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(diameter, diameter, width, 20, 1, true),
    MAT_316SS_BRUSHED
  );
  g.add(band);

  // Worm screw housing
  const housing = new THREE.Mesh(
    new THREE.BoxGeometry(width * 1.4, width * 1.2, width * 1.8),
    MAT_316SS_BRUSHED
  );
  housing.position.set(diameter + width * 0.4, 0, 0);
  g.add(housing);

  // Slotted hex drive screw head
  const screw = new THREE.Mesh(
    new THREE.CylinderGeometry(width * 0.45, width * 0.45, width * 0.8, 6),
    MAT_CHROME_STEEL
  );
  screw.rotation.z = Math.PI / 2;
  screw.position.set(diameter + width * 0.8, 0, 0);
  g.add(screw);

  return g;
}

function makeTimingPulley(radius = 0.18, height = 0.12, numTeeth = 24) {
  const g = new THREE.Group();
  g.name = 'Part_TimingPulley';

  // Main pulley body
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 32),
    MAT_ALUM_ANODIZED
  );
  g.add(body);

  // Top & bottom guide retention flanges
  const flangeGeo = new THREE.CylinderGeometry(radius * 1.15, radius * 1.15, height * 0.12, 32);
  const fTop = new THREE.Mesh(flangeGeo, MAT_ALUM_ANODIZED);
  fTop.position.y = height * 0.45;
  g.add(fTop);

  const fBot = new THREE.Mesh(flangeGeo, MAT_ALUM_ANODIZED);
  fBot.position.y = -height * 0.45;
  g.add(fBot);

  // Procedural teeth around circumference
  for (let t = 0; t < numTeeth; t++) {
    const ang = (t / numTeeth) * Math.PI * 2;
    const tooth = new THREE.Mesh(
      new THREE.BoxGeometry(radius * 0.10, height * 0.80, radius * 0.08),
      MAT_ALUM_ANODIZED
    );
    tooth.position.set(Math.cos(ang) * (radius + 0.005), 0, Math.sin(ang) * (radius + 0.005));
    tooth.rotation.y = -ang;
    g.add(tooth);
  }

  // Bore & keyway hub
  const bore = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.35, radius * 0.35, height * 1.05, 16),
    MAT_CHASSIS_DARK
  );
  g.add(bore);

  return g;
}

function makeSREdesignsBadge() {
  const g = new THREE.Group();
  g.name = 'Badge_SREdesigns';

  // Brushed aluminum beveled backing plate
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(1.28, 0.42, 0.02),
    MAT_ALUM_ANODIZED
  );
  plate.castShadow = true;
  g.add(plate);

  // Brand canvas with high-DPI procedural vector silkscreen (red pill + white SRE + cyan designs.com)
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 160);

  // Brand icon pill
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(14, 20, 150, 120, 16);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SRE', 89, 80);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 50px "JetBrains Mono", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('designs.com', 180, 80);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 24px sans-serif';
  ctx.fillText('USP DISSOLUTION SYSTEMS', 182, 120);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(1.24, 0.38),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  face.position.z = 0.014;
  g.add(face);

  // Corner socket micro-screws
  [[-0.60, -0.16], [0.60, -0.16], [-0.60, 0.16], [0.60, 0.16]].forEach(([bx, by]) => {
    const sc = makeSocketHeadCapScrew(0.018, 0.03);
    sc.position.set(bx, by, 0.012);
    sc.rotation.x = Math.PI / 2;
    g.add(sc);
  });

  return g;
}

// ----------------------------------------------------------------------------
// Dissolution3D Main Class
// ----------------------------------------------------------------------------
export class Dissolution3D {
  constructor(container) {
    this.container = container;
    this.exploded = false;
    this.explodeFactor = 0.0;
    this.targetExplodeFactor = 0.0;

    // Physical Continuity & State
    this.isPluggedIn = true;
    this.powerSwitchOn = true;
    this.spindlesSpinning = false;
    this.spindleRpm = 0.0;
    this.spindleAngle = 0.0;

    // Motorized Elevator Kinematics (0 to 311 mm)
    this.headElevationMm = 0.0;
    this.isElevating = false;

    // Telemetry state mirror
    this.displayState = {
      state: 'STANDBY',
      bath_temp_c: 21.5,
      target_temp_c: 37.0,
      spindle_rpm: 0.0,
      head_elevation_mm: 0.0,
      avg_dissolved_pct: 0.0,
      run_timer_s: 0.0,
      vessels: Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        dissolved_pct: 0.0,
        conc_mg_ml: 0.0,
        tablet_dropped: false,
        tablet_radius_mm: 4.5
      }))
    };

    // Sub-assemblies for animation and raycasting
    this.animGroups = {
      pivotDriveHead: null,
      headTopHood: null,
      elevatorColumns: null,
      leadScrew: null,
      spindles: [],
      paddles: [],
      vortices: [],
      tablets: [],
      vessels: [],
      truCenterRings: [],
      bathTank: null,
      bathWater: null,
      timingBelt: null,
      motorRotor: null,
      powerPlug: null,
      cordMesh: null,
      heaterCirculator: null,
      circulatorDisplay: null,
      switchRocker: null,
      buttons: {}
    };

    this.interactiveMeshes = [];
    this.partCatalog = [];

    this.initScene();
    this.initBenchAndRoom();
    this.initPowerDuplexBox();
    this.initLCDCanvas();
    this.initCirculatorCanvas();
    this.buildModel();
    this.setupExplodedNodes();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c1016);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(8.5, 9.8, 14.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.10;
    this.container.appendChild(this.renderer.domElement);

    // Standard 3-Point Studio Lighting Rig + Front Specular Bounce
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(this.ambientLight);

    // Key Light (high-contrast overhead warm sun)
    this.keyLight = new THREE.DirectionalLight(0xfff7ed, 2.0);
    this.keyLight.position.set(7.0, 14.0, 10.0);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 35;
    this.keyLight.shadow.camera.left = -9;
    this.keyLight.shadow.camera.right = 9;
    this.keyLight.shadow.camera.top = 11;
    this.keyLight.shadow.camera.bottom = -5;
    this.keyLight.shadow.bias = -0.0004;
    this.scene.add(this.keyLight);

    // Fill Light (soft cool sky)
    this.fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.1);
    this.fillLight.position.set(-9.0, 8.0, 7.0);
    this.scene.add(this.fillLight);

    // Front Specular Direct Bounce (Ensures electropolished 316SS shafts and paddles gleam silver!)
    this.specularBounce = new THREE.DirectionalLight(0xffffff, 1.3);
    this.specularBounce.position.set(0.0, 3.5, 9.5);
    this.scene.add(this.specularBounce);

    // Rim Light (sharp edge reflection off borosilicate glass & 316SS shafts)
    this.rimLight = new THREE.DirectionalLight(0x7dd3fc, 1.4);
    this.rimLight.position.set(2.0, 12.0, -10.0);
    this.scene.add(this.rimLight);
  }

  initBenchAndRoom() {
    this.labRoomGroup = new THREE.Group();
    this.labRoomGroup.name = 'Lab_Environment';

    // 1. Seamless Non-Aliasing Lab Floor
    const floorGeo = new THREE.PlaneGeometry(32.0, 32.0);
    const floorMat = makeMat(0x161d27, { r: 0.65, m: 0.05 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.name = 'Ground_Floor';
    this.labRoomGroup.add(floor);

    // Soft perimeter floor border
    const borderMat = makeMat(0x1e2632, { r: 0.60, m: 0.05 });
    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(24.0, 0.01, 18.0), borderMat);
    bMesh.position.set(0, 0.005, 0.5);
    bMesh.receiveShadow = true;
    this.labRoomGroup.add(bMesh);

    // 2. Black Epoxy Resin Lab Bench at Datum Y = 0
    // Bench top surface sits exactly at Y = 0; instrument feet rest on it
    const benchGeo = new THREE.BoxGeometry(18.0, 0.16, 12.0);
    const benchMat = makeMat(0x0f131a, { r: 0.35, m: 0.15 });
    this.benchMesh = new THREE.Mesh(benchGeo, benchMat);
    this.benchMesh.name = 'INSTRUMENT_BENCH';
    this.benchMesh.position.set(0, -0.08, 0.5);
    this.benchMesh.receiveShadow = true;
    this.labRoomGroup.add(this.benchMesh);

    // Front Stainless Steel Edge Protection Trim
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(18.02, 0.04, 0.02),
      MAT_316SS_BRUSHED
    );
    trim.position.set(0, -0.02, 6.51);
    this.labRoomGroup.add(trim);

    // Backsplash Wall behind bench (at Z = -4.5)
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(20.0, 14.0),
      makeMat(0x141a22, { r: 0.85 })
    );
    wall.position.set(0, 6.92, -4.5);
    wall.receiveShadow = true;
    this.labRoomGroup.add(wall);

    this.scene.add(this.labRoomGroup);
  }

  initPowerDuplexBox() {
    this.duplexBoxGroup = new THREE.Group();
    this.duplexBoxGroup.name = 'Power_Receptacle_Duplex';
    this.duplexBoxGroup.position.set(-3.8, 0.0, -2.5);

    // Cast aluminum industrial junction box seated on bench
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.40, 0.85),
      makeMat(0x64748b, { r: 0.35, m: 0.65 })
    );
    box.position.y = 0.20;
    box.castShadow = true;
    box.receiveShadow = true;
    this.duplexBoxGroup.add(box);

    // Stainless steel duplex faceplate with center 6-32 screw
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.02, 0.88),
      MAT_316SS_BRUSHED
    );
    plate.position.y = 0.41;
    this.duplexBoxGroup.add(plate);

    const fScrew = makeSlottedScrew(0.022, 0.03);
    fScrew.position.set(0, 0.425, 0);
    this.duplexBoxGroup.add(fScrew);

    // Dual NEMA 5-15R Receptacles
    [-0.22, 0.22].forEach(rz => {
      const rec = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.03, 20),
        makeMat(0x18181b, { r: 0.8 })
      );
      rec.position.set(0, 0.42, rz);
      this.duplexBoxGroup.add(rec);

      // Slot apertures: Neutral (wide), Hot (narrow), Ground (round/D-shape)
      const slotN = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.02, 0.10), MAT_CHASSIS_DARK);
      slotN.position.set(-0.06, 0.436, rz);
      this.duplexBoxGroup.add(slotN);

      const slotH = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.02, 0.08), MAT_CHASSIS_DARK);
      slotH.position.set(0.06, 0.436, rz);
      this.duplexBoxGroup.add(slotH);

      const slotG = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 10), MAT_CHASSIS_DARK);
      slotG.position.set(0.0, 0.436, rz - 0.09);
      this.duplexBoxGroup.add(slotG);
    });

    this.scene.add(this.duplexBoxGroup);

    // Molded NEMA 5-15P AC Plug
    this.animGroups.powerPlug = new THREE.Group();
    this.animGroups.powerPlug.name = 'Part_PowerPlugNEMA';

    const plugBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.42, 0.32),
      makeMat(0x18181b, { r: 0.70 })
    );
    plugBody.position.y = 0.21;
    plugBody.castShadow = true;
    this.animGroups.powerPlug.add(plugBody);

    // Ergonomic finger grip ribs
    for (let r = -1; r <= 1; r++) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.04), makeMat(0x27272a, { r: 0.9 }));
      rib.position.set(0, 0.21 + r * 0.08, 0.16);
      this.animGroups.powerPlug.add(rib);
    }

    // Molded rubber strain relief boot
    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.24, 14), MAT_RUBBER_NBR);
    boot.position.y = 0.48;
    this.animGroups.powerPlug.add(boot);

    // Solid brass prongs
    const pN = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.16, 0.07), MAT_BRASS_FITTING);
    pN.position.set(-0.06, -0.06, 0.0);
    this.animGroups.powerPlug.add(pN);

    const pH = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.16, 0.06), MAT_BRASS_FITTING);
    pH.position.set(0.06, -0.06, 0.0);
    this.animGroups.powerPlug.add(pH);

    const pG = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 12), MAT_316SS_BRUSHED);
    pG.position.set(0.0, -0.07, -0.09);
    this.animGroups.powerPlug.add(pG);

    // Inserted into rear duplex receptacle (Z = -0.22)
    this.animGroups.powerPlug.position.set(0, 0.42, -0.18);
    this.duplexBoxGroup.add(this.animGroups.powerPlug);
    this.interactiveMeshes.push(plugBody);

    this.buildPowerCord();
  }

  buildPowerCord() {
    if (this.cordMesh) {
      this.scene.remove(this.cordMesh);
    }
    const plugWorld = this.duplexBoxGroup.position.clone().add(new THREE.Vector3(0, 0.50, 0.12));
    const inletWorld = new THREE.Vector3(-2.2, 0.70, -2.85);

    const points = this.isPluggedIn ? [
      plugWorld,
      plugWorld.clone().add(new THREE.Vector3(0.4, -0.38, 0.2)),
      new THREE.Vector3(-3.0, 0.05, -2.0),
      new THREE.Vector3(-2.5, 0.05, -2.6),
      inletWorld.clone().add(new THREE.Vector3(0, -0.2, 0.2)),
      inletWorld
    ] : [
      this.duplexBoxGroup.position.clone().add(new THREE.Vector3(0.35, 0.10, 0.3)),
      new THREE.Vector3(-3.0, 0.05, -2.0),
      new THREE.Vector3(-2.5, 0.05, -2.6),
      inletWorld.clone().add(new THREE.Vector3(0, -0.2, 0.2)),
      inletWorld
    ];

    const curve = new THREE.CatmullRomCurve3(points);
    const cordGeo = new THREE.TubeGeometry(curve, 32, 0.045, 8, false);
    this.cordMesh = new THREE.Mesh(cordGeo, MAT_CORD_BLACK);
    this.cordMesh.castShadow = true;
    this.cordMesh.name = 'Cable_ACPowerCord';
    this.scene.add(this.cordMesh);
  }

  togglePlug() {
    this.isPluggedIn = !this.isPluggedIn;
    if (this.animGroups.powerPlug) {
      if (this.isPluggedIn) {
        this.animGroups.powerPlug.position.set(0, 0.42, -0.18);
        this.animGroups.powerPlug.rotation.set(0, 0, 0);
      } else {
        this.animGroups.powerPlug.position.set(0.42, 0.14, 0.30);
        this.animGroups.powerPlug.rotation.set(0, Math.PI / 4, Math.PI / 2);
      }
    }
    this.buildPowerCord();
    this.renderLCD();
    this.renderCirculatorDisplay();
  }

  // ----------------------------------------------------------------------------
  // Dynamic CanvasTexture LCD (UI_LCD)
  // ----------------------------------------------------------------------------
  initLCDCanvas() {
    this.lcdCanvas = document.createElement('canvas');
    this.lcdCanvas.width = 1024;
    this.lcdCanvas.height = 640;
    this.lcdCtx = this.lcdCanvas.getContext('2d');

    this.lcdTexture = new THREE.CanvasTexture(this.lcdCanvas);
    this.lcdTexture.colorSpace = THREE.SRGBColorSpace;
    this.lcdTexture.flipY = false;
    this.lcdTexture.generateMipmaps = false;
    this.lcdTexture.minFilter = THREE.LinearFilter;
    this.lcdTexture.magFilter = THREE.LinearFilter;

    this.matLCD = new THREE.MeshBasicMaterial({
      map: this.lcdTexture,
      toneMapped: false
    });

    this.renderLCD();
  }

  renderLCD() {
    const ctx = this.lcdCtx;
    const w = this.lcdCanvas.width;
    const h = this.lcdCanvas.height;

    if (!this.isPluggedIn || !this.powerSwitchOn) {
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, w, h);
      this.lcdTexture.needsUpdate = true;
      return;
    }

    // High-tech dark analytical instrument theme
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#090e17');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Outer subtle border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    // Header bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 10, w - 20, 56);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillText('Agilent 708-DS · USP <711> Dissolution Workstation', 26, 46);

    const st = this.displayState.state || 'STANDBY';
    const stCol = st.includes('RUNNING') ? '#10b981' : (st.includes('ERROR') ? '#ef4444' : '#0ea5e9');
    ctx.fillStyle = stCol;
    ctx.beginPath();
    ctx.roundRect(w - 180, 20, 150, 36, 6);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(st, w - 105, 44);
    ctx.textAlign = 'left';

    // Primary Telemetry: Water Bath Temp & Synchronous Spindle RPM
    ctx.fillStyle = '#111c30';
    ctx.fillRect(20, 80, 480, 150);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 80, 480, 150);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px "JetBrains Mono", sans-serif';
    ctx.fillText('WATER BATH TEMPERATURE', 36, 110);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 54px "JetBrains Mono", monospace';
    const tempStr = (this.displayState.bath_temp_c ?? 21.5).toFixed(2);
    ctx.fillText(`${tempStr} °C`, 36, 175);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 16px "JetBrains Mono", monospace';
    ctx.fillText('°C (37.00 ± 0.50)', 280, 172);

    // Spindle RPM Card
    ctx.fillStyle = '#111c30';
    ctx.fillRect(524, 80, 480, 150);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(524, 80, 480, 150);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px "JetBrains Mono", sans-serif';
    ctx.fillText('SPINDLE STIR SPEED', 540, 110);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 54px "JetBrains Mono", monospace';
    const rpmStr = (this.displayState.spindle_rpm ?? 0.0).toFixed(1);
    ctx.fillText(rpmStr, 540, 175);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 16px "JetBrains Mono", monospace';
    ctx.fillText('RPM (50.0 Setpoint)', 740, 172);

    // 8-Vessel Noyes-Whitney Real-Time Progress Bar Matrix
    ctx.fillStyle = '#0b1322';
    ctx.fillRect(20, 248, w - 40, 360);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(20, 248, w - 40, 360);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText('USP <711> 8-VESSEL DISSOLUTION PROFILES (NOYES-WHITNEY ODE)', 36, 280);

    const vArr = this.displayState.vessels || [];
    const cardW = 105;
    const cardH = 260;
    const startX = 36;
    const startY = 305;

    for (let i = 0; i < 8; i++) {
      const vx = startX + i * (cardW + 16);
      const v = vArr[i] || { dissolved_pct: 0, conc_mg_ml: 0 };
      const pct = Math.min(100.0, Math.max(0.0, v.dissolved_pct || 0));

      ctx.fillStyle = '#162238';
      ctx.fillRect(vx, startY, cardW, cardH);
      ctx.strokeStyle = '#253856';
      ctx.strokeRect(vx, startY, cardW, cardH);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillText(`VESSEL ${i + 1}`, vx + 16, startY + 24);

      // Vertical fill bar
      const barH = 150;
      const barY = startY + 40;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(vx + 28, barY, 48, barH);

      const fillH = (pct / 100.0) * barH;
      const barGrad = ctx.createLinearGradient(0, barY + barH, 0, barY);
      barGrad.addColorStop(0, '#0284c7');
      barGrad.addColorStop(1, '#38bdf8');
      ctx.fillStyle = barGrad;
      ctx.fillRect(vx + 28, barY + barH - fillH, 48, fillH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText(`${pct.toFixed(1)}%`, vx + 30, startY + 214);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px "JetBrains Mono", monospace';
      const conc = (v.conc_mg_ml || 0).toFixed(2);
      ctx.fillText(`${conc} µg/mL`, vx + 14, startY + 238);
    }

    this.lcdTexture.needsUpdate = true;
  }

  // ----------------------------------------------------------------------------
  // Dynamic CanvasTexture for AutoTemp Heater / Circulator Display
  // ----------------------------------------------------------------------------
  initCirculatorCanvas() {
    this.circCanvas = document.createElement('canvas');
    this.circCanvas.width = 512;
    this.circCanvas.height = 256;
    this.circCtx = this.circCanvas.getContext('2d');

    this.circTexture = new THREE.CanvasTexture(this.circCanvas);
    this.circTexture.colorSpace = THREE.SRGBColorSpace;
    this.circTexture.flipY = false;

    this.matCircLCD = new THREE.MeshBasicMaterial({
      map: this.circTexture,
      toneMapped: false
    });

    this.renderCirculatorDisplay();
  }

  renderCirculatorDisplay() {
    const ctx = this.circCtx;
    const w = 512;
    const h = 256;

    if (!this.isPluggedIn || !this.powerSwitchOn) {
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, w, h);
      this.circTexture.needsUpdate = true;
      return;
    }

    // Industrial instrument front panel
    ctx.fillStyle = '#0b101b';
    ctx.fillRect(0, 0, w, h);

    // Bezel border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, w - 6, h - 6);

    // Header
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 10, w - 20, 36);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText('AutoTemp 1150W · BATH CIRCULATOR', 24, 34);

    // Actual Temp Display (Green 7-Segment style)
    ctx.fillStyle = '#03140a';
    ctx.fillRect(20, 60, 220, 90);
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 60, 220, 90);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 44px "JetBrains Mono", monospace';
    const tempStr = (this.displayState.bath_temp_c ?? 21.5).toFixed(1);
    ctx.fillText(`${tempStr}°C`, 36, 122);

    ctx.font = '500 12px "JetBrains Mono", sans-serif';
    ctx.fillText('ACTUAL BATH TEMP', 36, 80);

    // Setpoint Temp Display (Amber LED style)
    ctx.fillStyle = '#1a1003';
    ctx.fillRect(260, 60, 230, 90);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(260, 60, 230, 90);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 44px "JetBrains Mono", monospace';
    ctx.fillText('37.0°C', 276, 122);

    ctx.font = '500 12px "JetBrains Mono", sans-serif';
    ctx.fillText('SETPOINT TEMP', 276, 80);

    // Status Indicator Annunciators
    const leds = [
      { name: 'HEATER', on: this.displayState.bath_temp_c < 37.0, col: '#f59e0b' },
      { name: 'CIRC PUMP', on: true, col: '#10b981' },
      { name: 'FLOW OK', on: true, col: '#06b6d4' },
      { name: 'ALARM', on: false, col: '#ef4444' }
    ];

    leds.forEach((l, idx) => {
      const lx = 26 + idx * 118;
      const ly = 175;

      ctx.fillStyle = l.on ? l.col : '#1e293b';
      ctx.beginPath();
      ctx.arc(lx + 8, ly + 8, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = l.on ? '#ffffff' : '#475569';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText(l.name, lx + 24, ly + 14);
    });

    // Control buttons label footer
    ctx.fillStyle = '#334155';
    ctx.fillRect(10, 212, w - 20, 32);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 13px sans-serif';
    ctx.fillText('[ ▲ TEMP ]   [ ▼ TEMP ]   [ SET ]   [ PRIME ]   [ POWER ]', 40, 233);

    this.circTexture.needsUpdate = true;
  }

  // ----------------------------------------------------------------------------
  // Model Hierarchy & Procedural CAD Assemblies
  // ----------------------------------------------------------------------------
  buildModel() {
    this.mainGroup = new THREE.Group();
    this.mainGroup.position.set(0, 0, 0);
    this.scene.add(this.mainGroup);

    this.buildBaseChassis();
    this.buildElevatorColumns();
    this.buildWaterBathAssembly();
    this.buildDriveHeadAssembly();
    this.buildHeaterCirculator();
  }

  buildBaseChassis() {
    this.chassisGroup = new THREE.Group();
    this.chassisGroup.name = 'Body_Chassis';

    // 1. Hollow Base Pan Casting (622 x 120 x 590 mm -> 6.22 x 1.20 x 5.90)
    // Modeled as a real hollow housing casting with bottom floor, front/side/rear walls,
    // exposing the internal 12 kg cast iron ballast, gearmotor, and PSU in exploded view!

    // Bottom Baseplate Floor (rests on leveling feet at Y = 0.20)
    const baseFloor = new THREE.Mesh(
      new THREE.BoxGeometry(6.20, 0.12, 5.88),
      MAT_CHASSIS_CREAM
    );
    baseFloor.position.set(0, 0.26, 0.0);
    baseFloor.receiveShadow = true;
    this.chassisGroup.add(baseFloor);

    // Front Structural Wall with beveled chamfer and parting line
    const wallF = new THREE.Mesh(new THREE.BoxGeometry(6.22, 1.08, 0.16), MAT_CHASSIS_CREAM);
    wallF.position.set(0, 0.86, 2.87);
    wallF.castShadow = true;
    wallF.receiveShadow = true;
    this.chassisGroup.add(wallF);

    const frontBevel = new THREE.Mesh(new THREE.BoxGeometry(6.22, 0.08, 0.08), MAT_CHASSIS_DARK);
    frontBevel.position.set(0, 1.40, 2.95);
    this.chassisGroup.add(frontBevel);

    // Left and Right Structural Side Walls
    [-3.05, 3.05].forEach(wx => {
      const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.08, 5.88), MAT_CHASSIS_CREAM);
      sideWall.position.set(wx, 0.86, 0);
      sideWall.castShadow = true;
      sideWall.receiveShadow = true;
      this.chassisGroup.add(sideWall);
    });

    // Rear Enclosure Wall with stamped ventilation louvers
    const wallR = new THREE.Mesh(new THREE.BoxGeometry(6.22, 1.08, 0.16), MAT_CHASSIS_CREAM);
    wallR.position.set(0, 0.86, -2.87);
    wallR.castShadow = true;
    this.chassisGroup.add(wallR);

    // Upper perimeter mounting flange with rubber perimeter seal
    const rimGasket = new THREE.Mesh(new THREE.BoxGeometry(6.22, 0.04, 5.90), MAT_RUBBER_NBR);
    rimGasket.position.set(0, 1.40, 0.0);
    this.chassisGroup.add(rimGasket);

    // Perimeter socket head screws joining the base enclosure
    for (let i = -2; i <= 2; i++) {
      const scF = makeSocketHeadCapScrew(0.03, 0.05);
      scF.position.set(i * 1.2, 1.42, 2.85);
      this.chassisGroup.add(scF);

      const scB = makeSocketHeadCapScrew(0.03, 0.05);
      scB.position.set(i * 1.2, 1.42, -2.85);
      this.chassisGroup.add(scB);
    }

    // 2. Threaded Leveling Feet resting on black bench at datum Y = 0
    const footPositions = [
      { name: 'Foot_Leveling_FL', x: -2.8, z:  2.5 },
      { name: 'Foot_Leveling_FR', x:  2.8, z:  2.5 },
      { name: 'Foot_Leveling_RL', x: -2.8, z: -2.5 },
      { name: 'Foot_Leveling_RR', x:  2.8, z: -2.5 },
    ];

    footPositions.forEach(fp => {
      const footGrp = new THREE.Group();
      footGrp.name = fp.name;
      footGrp.position.set(fp.x, 0.0, fp.z);

      // Vulcanized non-marking NBR rubber pad with annular suction ribs
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.08, 20), MAT_RUBBER_NBR);
      pad.position.y = 0.04;
      pad.castShadow = true;
      footGrp.add(pad);

      // Steel foot base plate
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.03, 20), MAT_316SS_BRUSHED);
      plate.position.y = 0.095;
      footGrp.add(plate);

      // Threaded steel stud (M10)
      const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 16), MAT_CHROME_STEEL);
      stud.position.y = 0.16;
      footGrp.add(stud);

      // Hexagonal jam locknut
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.06, 6), MAT_CHROME_STEEL);
      nut.position.y = 0.20;
      footGrp.add(nut);

      this.chassisGroup.add(footGrp);
    });

    // 3. Stamped Rear Ventilation Louvers
    for (let i = 0; i < 7; i++) {
      const louver = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.03, 0.06),
        MAT_CHASSIS_DARK
      );
      louver.position.set(0, 0.50 + i * 0.11, -2.96);
      this.chassisGroup.add(louver);
    }

    // 4. Rear IEC Power Entry Module, Dual Fuses & Rocker Switch
    const pemBox = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.45, 0.04), MAT_CHASSIS_DARK);
    pemBox.position.set(-2.2, 0.70, -2.96);
    this.chassisGroup.add(pemBox);

    const switchMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.26, 0.06),
      new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 0.6,
        roughness: 0.2
      })
    );
    switchMesh.position.set(-2.2, 0.70, -2.98);
    switchMesh.name = 'Switch_Rocker';
    this.chassisGroup.add(switchMesh);
    this.animGroups.switchRocker = switchMesh;
    this.interactiveMeshes.push(switchMesh);

    // 5. Rear Quick-Disconnect Water Bulkheads
    [-0.5, 0.5].forEach((hx, idx) => {
      const bulkhead = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.16, 16), MAT_316SS_BRUSHED);
      bulkhead.rotation.x = Math.PI / 2;
      bulkhead.position.set(hx, 0.90, -2.98);
      bulkhead.name = idx === 0 ? 'Bulkhead_WaterBath_Supply' : 'Bulkhead_WaterBath_Return';
      this.chassisGroup.add(bulkhead);

      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16), MAT_BRASS_FITTING);
      collar.rotation.x = Math.PI / 2;
      collar.position.set(hx, 0.90, -3.02);
      this.chassisGroup.add(collar);
    });

    // 6. Internal Mechanics in Base Cavity (Ballast, PSU board, gearmotor - fully visible in exploded view!)
    // 12 kg Cast Iron Ballast Plate
    const ballast = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.18, 4.2), MAT_CAST_IRON);
    ballast.position.set(0, 0.41, 0.1);
    ballast.name = 'Part_CastIronBallast';
    this.chassisGroup.add(ballast);

    // Ballast mounting M8 hex bolts with spring washers
    [[-1.8, -1.5], [1.8, -1.5], [-1.8, 1.5], [1.8, 1.5]].forEach(([bx, bz]) => {
      const bBolt = makeHexBolt(0.045, 0.12, true);
      bBolt.position.set(bx, 0.51, bz);
      this.chassisGroup.add(bBolt);
    });

    // Elevator 24V DC Reduction Gearmotor in Base Center Rear
    const gearMotor = new THREE.Group();
    gearMotor.name = 'Part_ElevatorGearmotor';
    gearMotor.position.set(0, 0.65, -1.75);

    const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.55, 18), MAT_CHASSIS_DARK);
    gearMotor.add(motorBody);

    const gearBox = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.35, 0.48), MAT_ALUM_ANODIZED);
    gearBox.position.y = 0.35;
    gearMotor.add(gearBox);

    // Mounting bracket with M6 socket screws
    const mBracket = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.65), MAT_316SS_BRUSHED);
    mBracket.position.y = -0.28;
    gearMotor.add(mBracket);

    [[-0.24, -0.24], [0.24, -0.24], [-0.24, 0.24], [0.24, 0.24]].forEach(([gx, gz]) => {
      const sc = makeSocketHeadCapScrew(0.025, 0.05);
      sc.position.set(gx, -0.25, gz);
      gearMotor.add(sc);
    });

    this.chassisGroup.add(gearMotor);

    // Main Power Supply Motherboard (PCB_PowerSupply)
    const psuPcb = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 1.4), MAT_PCB_FR4);
    psuPcb.position.set(-1.8, 0.54, 0.8);
    psuPcb.name = 'PCB_PowerSupply';
    this.chassisGroup.add(psuPcb);

    // Toroidal Transformer with copper windings & center mounting disc
    const xformer = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.12, 12, 24), MAT_COPPER_COIL);
    xformer.rotation.x = Math.PI / 2;
    xformer.position.set(-1.3, 0.70, 0.8);
    this.chassisGroup.add(xformer);

    const xformerCap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 16), MAT_316SS_BRUSHED);
    xformerCap.position.set(-1.3, 0.74, 0.8);
    this.chassisGroup.add(xformerCap);

    // 3x High-Voltage Electrolytic Filter Capacitors
    for (let c = 0; c < 3; c++) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.28, 16), makeMat(0x1d4ed8, { r: 0.35 }));
      cap.position.set(-2.2 + c * 0.24, 0.68, 0.8);
      this.chassisGroup.add(cap);
    }

    // Bridge Rectifier on black finned aluminum heat sink
    const sink = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.22, 0.20), makeMat(0x0f172a, { r: 0.50, m: 0.70 }));
    sink.position.set(-2.2, 0.65, 1.25);
    this.chassisGroup.add(sink);

    this.mainGroup.add(this.chassisGroup);
  }

  buildElevatorColumns() {
    this.elevatorGroup = new THREE.Group();
    this.elevatorGroup.name = 'Assembly_Elevator';

    // Rear extruded aluminum upright tower backbone
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 7.8, 0.8),
      MAT_CHASSIS_CREAM
    );
    tower.position.set(0, 4.7, -2.2);
    tower.castShadow = true;
    tower.receiveShadow = true;
    this.elevatorGroup.add(tower);

    // Twin Ground Guide Shafts (Chrome-plated steel, dia 25.4 mm -> dia 0.254, height 7.5)
    [-2.1, 2.1].forEach(colX => {
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.127, 0.127, 7.5, 24),
        MAT_316SS_ELECTROPOLISHED
      );
      shaft.position.set(colX, 4.75, -1.75);
      shaft.castShadow = true;
      this.elevatorGroup.add(shaft);

      // Top shaft retaining collar with real M6 hex socket screws
      const topCollar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.20, 0.20, 0.14, 18),
        MAT_ALUM_ANODIZED
      );
      topCollar.position.set(colX, 8.5, -1.75);
      this.elevatorGroup.add(topCollar);

      const sc1 = makeSocketHeadCapScrew(0.035, 0.06);
      sc1.position.set(colX, 8.55, -1.60);
      this.elevatorGroup.add(sc1);
    });

    // Center Precision Acme Ball Lead Screw (dia 18 mm, height 7.2)
    this.leadScrew = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 7.2, 24),
      MAT_CHROME_STEEL
    );
    this.leadScrew.position.set(0, 4.70, -1.75);
    this.leadScrew.castShadow = true;
    this.elevatorGroup.add(this.leadScrew);
    this.animGroups.leadScrew = this.leadScrew;

    // Flexible jaw coupling connecting lead screw to base gearmotor
    const coupling = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.20, 16), MAT_ALUM_ANODIZED);
    coupling.position.set(0, 1.25, -1.75);
    this.elevatorGroup.add(coupling);

    this.mainGroup.add(this.elevatorGroup);
    this.animGroups.elevatorColumns = this.elevatorGroup;
  }

  buildWaterBathAssembly() {
    this.bathGroup = new THREE.Group();
    this.bathGroup.name = 'Assembly_WaterBath';
    this.bathGroup.position.set(0, 1.40, 0.15); // Resting on base pan top

    // 1. Seamless Molded Optical Acrylic Tank (Hollow 5-Wall Acrylic Construction)
    // Real optical thickness (12mm base, 10mm walls) so vessels sit in true open interior cavity
    const tankH = 2.40;
    const tankW = 5.80;
    const tankD = 4.40;
    const wallT = 0.10;

    this.bathTankMesh = new THREE.Group();
    this.bathTankMesh.name = 'Bath_Chamber';

    // Tank bottom plate
    const bPlate = new THREE.Mesh(new THREE.BoxGeometry(tankW, wallT, tankD), MAT_BATH_ACRYLIC);
    bPlate.position.set(0, wallT / 2, 0);
    this.bathTankMesh.add(bPlate);

    // Front wall
    const wFront = new THREE.Mesh(new THREE.BoxGeometry(tankW, tankH, wallT), MAT_BATH_ACRYLIC);
    wFront.position.set(0, tankH / 2, tankD / 2 - wallT / 2);
    this.bathTankMesh.add(wFront);

    // Back wall
    const wBack = new THREE.Mesh(new THREE.BoxGeometry(tankW, tankH, wallT), MAT_BATH_ACRYLIC);
    wBack.position.set(0, tankH / 2, -tankD / 2 + wallT / 2);
    this.bathTankMesh.add(wBack);

    // Left wall
    const wLeft = new THREE.Mesh(new THREE.BoxGeometry(wallT, tankH, tankD - wallT * 2), MAT_BATH_ACRYLIC);
    wLeft.position.set(-tankW / 2 + wallT / 2, tankH / 2, 0);
    this.bathTankMesh.add(wLeft);

    // Right wall
    const wRight = new THREE.Mesh(new THREE.BoxGeometry(wallT, tankH, tankD - wallT * 2), MAT_BATH_ACRYLIC);
    wRight.position.set(tankW / 2 - wallT / 2, tankH / 2, 0);
    this.bathTankMesh.add(wRight);

    this.bathGroup.add(this.bathTankMesh);
    this.animGroups.bathTank = this.bathTankMesh;

    // 2. Heated Water Bath Liquid Volume (fills open cavity up to Y = 1.90)
    const waterGeo = new THREE.BoxGeometry(tankW - wallT * 2 - 0.04, 1.85, tankD - wallT * 2 - 0.04);
    this.bathWaterMesh = new THREE.Mesh(waterGeo, MAT_BATH_WATER);
    this.bathWaterMesh.position.set(0, 0.98, 0);
    this.bathWaterMesh.name = 'Bath_Water';
    this.bathGroup.add(this.bathWaterMesh);
    this.animGroups.bathWater = this.bathWaterMesh;

    // 3. Top Cover Plate with 8 circular vessel apertures & perimeter seal
    const topPlate = new THREE.Mesh(
      new THREE.BoxGeometry(tankW + 0.02, 0.06, tankD + 0.02),
      MAT_CHASSIS_CREAM
    );
    topPlate.position.set(0, tankH + 0.03, 0);
    topPlate.castShadow = true;
    this.bathGroup.add(topPlate);

    // Circulation diffuser manifold along rear wall of bath
    const diffPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 4.8, 16),
      MAT_316SS_BRUSHED
    );
    diffPipe.rotation.z = Math.PI / 2;
    diffPipe.position.set(0, 0.25, -1.95);
    this.bathGroup.add(diffPipe);

    // 4 Diffuser discharge nozzles
    [-1.8, -0.6, 0.6, 1.8].forEach(nx => {
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 12), MAT_316SS_BRUSHED);
      nozzle.rotation.x = Math.PI / 2;
      nozzle.position.set(nx, 0.25, -1.88);
      this.bathGroup.add(nozzle);
    });

    // 4. 8-Position Vessel Layout: 2 rows of 4 vessels
    // Row 1 (front): Z = +0.80, Row 2 (rear): Z = -0.80
    // X pitch: [-1.80, -0.60, +0.60, +1.80]
    const rowZ = [0.80, -0.80];
    const colX = [-1.80, -0.60, 0.60, 1.80];

    let vesselIdx = 0;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        vesselIdx++;
        const vx = colX[c];
        const vz = rowZ[r];

        // 4a. TruCenter Centering Collar Ring
        const ringGrp = new THREE.Group();
        ringGrp.name = `TruCenter_Ring_0${vesselIdx}`;
        ringGrp.position.set(vx, tankH + 0.06, vz);

        const ring = new THREE.Mesh(
          new THREE.CylinderGeometry(0.60, 0.60, 0.06, 32),
          MAT_ALUM_ANODIZED
        );
        ring.castShadow = true;
        ringGrp.add(ring);

        // Dual stainless steel alignment locator pins
        const pin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 8), MAT_316SS_BRUSHED);
        pin1.position.set(0.55, 0.04, 0);
        ringGrp.add(pin1);

        const pin2 = pin1.clone();
        pin2.position.set(-0.55, 0.04, 0);
        ringGrp.add(pin2);

        this.bathGroup.add(ringGrp);
        this.animGroups.truCenterRings.push(ringGrp);

        // 4b. Precision USP Borosilicate Glass Vessel (1000 mL, hemispherical bottom)
        const vGrp = new THREE.Group();
        vGrp.name = `Glass_Vessel_0${vesselIdx}`;
        vGrp.position.set(vx, 0, vz);

        // Cylinder body (dia 1.04 outer, height 1.68)
        const vCyl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.52, 0.52, 1.68, 32, 1, true),
          MAT_BORO_VESSEL
        );
        vCyl.position.set(0, 1.62, 0);
        vCyl.castShadow = true;
        vGrp.add(vCyl);

        // Hemispherical bottom (radius 0.52)
        const vHemi = new THREE.Mesh(
          new THREE.SphereGeometry(0.52, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
          MAT_BORO_VESSEL
        );
        vHemi.position.set(0, 0.78, 0);
        vHemi.castShadow = true;
        vGrp.add(vHemi);

        // Upper flanged rim
        const vRim = new THREE.Mesh(
          new THREE.CylinderGeometry(0.58, 0.58, 0.05, 32),
          MAT_BORO_VESSEL
        );
        vRim.position.set(0, 2.48, 0);
        vGrp.add(vRim);

        // Graduation markings (500, 900, 1000 mL white ceramic rings)
        [1.2, 1.9, 2.1].forEach(gy => {
          const gRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.522, 0.003, 4, 32),
            makeMat(0xffffff, { r: 0.2 })
          );
          gRing.rotation.x = Math.PI / 2;
          gRing.position.y = gy;
          vGrp.add(gRing);
        });

        this.bathGroup.add(vGrp);
        this.animGroups.vessels.push(vGrp);

        // 4c. Dissolution Medium Liquid Volume (900 mL)
        const medGrp = new THREE.Group();
        medGrp.name = `Liquid_Medium_0${vesselIdx}`;
        medGrp.position.set(vx, 0, vz);

        const medCyl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.50, 0.50, 1.25, 24),
          MAT_VESSEL_MEDIUM
        );
        medCyl.position.set(0, 1.45, 0);
        medGrp.add(medCyl);

        const medHemi = new THREE.Mesh(
          new THREE.SphereGeometry(0.50, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
          MAT_VESSEL_MEDIUM
        );
        medHemi.position.set(0, 0.825, 0);
        medGrp.add(medHemi);

        // Dynamic vortex meniscus surface
        const vortexGeo = new THREE.ConeGeometry(0.49, 0.02, 24);
        vortexGeo.rotateX(Math.PI);
        const vortexMesh = new THREE.Mesh(vortexGeo, MAT_VESSEL_MEDIUM);
        vortexMesh.position.set(0, 2.07, 0);
        medGrp.add(vortexMesh);
        this.animGroups.vortices.push(vortexMesh);

        this.bathGroup.add(medGrp);

        // 4d. Prednisone 10mg USP Biconvex Solid Tablet
        const tabGrp = new THREE.Group();
        tabGrp.name = `Tablet_Solid_0${vesselIdx}`;
        tabGrp.position.set(vx, 0.35, vz);

        const tabBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, 0.038, 20),
          MAT_TABLET_SOLID
        );
        tabBody.castShadow = true;
        tabGrp.add(tabBody);

        const domeTop = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 8, 0, Math.PI * 2, 0, Math.PI / 6), MAT_TABLET_SOLID);
        domeTop.position.y = 0.019;
        tabGrp.add(domeTop);

        const domeBot = domeTop.clone();
        domeBot.rotation.x = Math.PI;
        domeBot.position.y = -0.019;
        tabGrp.add(domeBot);

        this.bathGroup.add(tabGrp);
        this.animGroups.tablets.push(tabGrp);
      }
    }

    this.mainGroup.add(this.bathGroup);
  }

  buildDriveHeadAssembly() {
    // Kinematic Pivot / Motorized Elevator Drive Head
    // Travels vertically along Y: default lowered position at Y = 4.80
    this.pivotDriveHead = new THREE.Group();
    this.pivotDriveHead.name = 'Pivot_DriveHead';
    this.pivotDriveHead.position.set(0, 4.80, 0.15);

    // 1. Structural Lower Baseplate Casting (6.10 x 0.14 x 4.80)
    // Flanged aluminum casting through which the 8 spindles pass into the bath
    const headBase = new THREE.Mesh(
      new THREE.BoxGeometry(6.10, 0.14, 4.80),
      MAT_ALUM_ANODIZED
    );
    headBase.position.set(0, 0.07, 0);
    this.pivotDriveHead.add(headBase);

    // 2. Drive Head Enclosure Walls (Hollow structural casting)
    // Left and right side housing covers
    [-3.00, 3.00].forEach(hx => {
      const hSide = new THREE.Mesh(new THREE.BoxGeometry(0.10, 1.70, 4.80), MAT_DRIVE_HEAD);
      hSide.position.set(hx, 0.95, 0);
      hSide.castShadow = true;
      this.pivotDriveHead.add(hSide);
    });

    // Rear wall with guide shaft and lead screw clearance openings
    const hRear = new THREE.Mesh(new THREE.BoxGeometry(6.10, 1.70, 0.12), MAT_DRIVE_HEAD);
    hRear.position.set(0, 0.95, -2.34);
    hRear.castShadow = true;
    this.pivotDriveHead.add(hRear);

    // 3. Detachable Top Inspection Hood Plate (elevates in exploded view!)
    this.headTopHood = new THREE.Group();
    this.headTopHood.name = 'Head_TopHood';
    this.headTopHood.position.set(0, 1.84, 0);

    const hoodPlate = new THREE.Mesh(
      new THREE.BoxGeometry(6.12, 0.08, 4.82),
      MAT_CHASSIS_CREAM
    );
    hoodPlate.castShadow = true;
    this.headTopHood.add(hoodPlate);

    // Perimeter cover screws (10x socket cap screws with knurled heads)
    for (let i = -2; i <= 2; i++) {
      const scF = makeSocketHeadCapScrew(0.03, 0.05);
      scF.position.set(i * 1.2, 0.04, 2.3);
      this.headTopHood.add(scF);

      const scB = makeSocketHeadCapScrew(0.03, 0.05);
      scB.position.set(i * 1.2, 0.04, -2.3);
      this.headTopHood.add(scB);
    }

    this.pivotDriveHead.add(this.headTopHood);
    this.animGroups.headTopHood = this.headTopHood;

    // 4. Front Control Console Faceplate & Carved Recessed Bezel
    const fasciaBox = new THREE.Mesh(
      new THREE.BoxGeometry(5.90, 1.70, 0.08),
      MAT_DRIVE_HEAD
    );
    fasciaBox.position.set(0, 0.95, 2.36);
    fasciaBox.castShadow = true;
    this.pivotDriveHead.add(fasciaBox);

    const fasciaTrim = new THREE.Mesh(
      new THREE.BoxGeometry(5.60, 1.40, 0.04),
      MAT_FASCIA_BEZEL
    );
    fasciaTrim.position.set(0, 0.95, 2.42);
    this.pivotDriveHead.add(fasciaTrim);

    // Carved Recessed Bezel Pocket for LCD (DIAG-001, DIAG-016)
    const bezelPocket = new THREE.Mesh(
      new THREE.BoxGeometry(3.24, 1.18, 0.01),
      makeMat(0x05070a, { r: 0.90 })
    );
    bezelPocket.position.set(-0.70, 0.95, 2.445);
    this.pivotDriveHead.add(bezelPocket);

    // Dedicated LCD Quad (UI_LCD)
    const lcdGeo = new THREE.PlaneGeometry(3.18, 1.12);
    // Invert UV Y coordinates for dynamic canvas (DIAG-005)
    const uvAttr = lcdGeo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setY(i, 1.0 - uvAttr.getY(i));
    }
    uvAttr.needsUpdate = true;

    this.lcdMesh = new THREE.Mesh(lcdGeo, this.matLCD);
    this.lcdMesh.name = 'UI_LCD';
    this.lcdMesh.position.set(-0.70, 0.95, 2.455);
    this.pivotDriveHead.add(this.lcdMesh);

    // Anti-Reflective Protective Optical Glass Lens
    const lens = new THREE.Mesh(
      new THREE.PlaneGeometry(3.20, 1.14),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.06,
        roughness: 0.02,
        transmission: 0.96,
        depthWrite: false
      })
    );
    lens.position.set(-0.70, 0.95, 2.465);
    lens.name = 'Glass_LCDLens';
    this.pivotDriveHead.add(lens);

    // 5. Tactile Pushbuttons (Push keys with chrome bezels & 1mm depress kinematic travel)
    const btnConfigs = [
      { name: 'Btn_ElevUp',   label: '▲', color: 0x0284c7, y: 1.35 },
      { name: 'Btn_ElevDown', label: '▼', color: 0x0284c7, y: 1.08 },
      { name: 'Btn_Start',    label: '▶', color: 0x16a34a, y: 0.81 },
      { name: 'Btn_Stop',     label: '⏹', color: 0xdc2626, y: 0.54 }
    ];

    btnConfigs.forEach(bc => {
      const bGrp = new THREE.Group();
      bGrp.name = bc.name;
      bGrp.position.set(1.65, bc.y, 2.44);

      // Chrome bezel ring
      const bRing = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 20), MAT_CHROME_STEEL);
      bRing.rotation.x = Math.PI / 2;
      bGrp.add(bRing);

      // Tactile key cap
      const key = new THREE.Mesh(
        new THREE.CylinderGeometry(0.10, 0.10, 0.035, 20),
        makeMat(bc.color, { r: 0.35, m: 0.15 })
      );
      key.rotation.x = Math.PI / 2;
      key.position.z = 0.015;
      key.name = bc.name;
      bGrp.add(key);

      this.pivotDriveHead.add(bGrp);
      this.animGroups.buttons[bc.name] = key;
      this.interactiveMeshes.push(key);
    });

    // 6. Official SREdesigns Brand Certification Badge
    const badge = makeSREdesignsBadge();
    badge.position.set(1.65, 1.55, 2.445);
    this.pivotDriveHead.add(badge);

    // 7. Internal Synchronous Drive Mechanics (visible in exploded view!)
    this.buildInternalDriveMechanics();

    // 8. 8 Rotating Spindles & Electropolished Apparatus 2 Paddles
    this.buildSpindles();

    this.mainGroup.add(this.pivotDriveHead);
    this.animGroups.pivotDriveHead = this.pivotDriveHead;
  }

  buildInternalDriveMechanics() {
    this.timingBeltGroup = new THREE.Group();
    this.timingBeltGroup.name = 'Assembly_TimingBeltDrive';
    this.timingBeltGroup.position.set(0, 0.40, 0);

    // 24V DC Brushless Synchronous Drive Motor (Center rear, X = 0, Z = -1.0)
    const motorHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.65, 24),
      MAT_CHASSIS_DARK
    );
    motorHousing.position.set(0, 0.35, -1.0);
    this.timingBeltGroup.add(motorHousing);

    // Radial centrifugal cooling fan
    const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 16), MAT_ALUM_ANODIZED);
    fan.position.set(0, 0.65, -1.0);
    this.timingBeltGroup.add(fan);
    this.animGroups.motorRotor = fan;

    // Copper stator coils inside motor housing
    for (let c = 0; c < 8; c++) {
      const ang = (c / 8) * Math.PI * 2;
      const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.50, 12), MAT_COPPER_COIL);
      coil.position.set(Math.cos(ang) * 0.30, 0.35, -1.0 + Math.sin(ang) * 0.30);
      this.timingBeltGroup.add(coil);
    }

    // Motor mounting plate with M5 socket cap screws
    const mPlate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 1.2), MAT_316SS_BRUSHED);
    mPlate.position.set(0, 0.03, -1.0);
    this.timingBeltGroup.add(mPlate);

    [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]].forEach(([mx, mz]) => {
      const sc = makeSocketHeadCapScrew(0.035, 0.06);
      sc.position.set(mx, 0.06, -1.0 + mz);
      this.timingBeltGroup.add(sc);
    });

    // Continuous Synchronous Cogged Timing Belt looping across all 8 drive pulleys
    // Procedural continuous belt profile weaving around outer pulleys
    const beltPts = [
      new THREE.Vector3(-1.80, 0.60, 0.98),
      new THREE.Vector3(1.80, 0.60, 0.98),
      new THREE.Vector3(1.98, 0.60, 0.80),
      new THREE.Vector3(1.98, 0.60, -0.80),
      new THREE.Vector3(1.80, 0.60, -0.98),
      new THREE.Vector3(0.50, 0.60, -0.98),
      new THREE.Vector3(0.00, 0.60, -1.25), // motor drive loop
      new THREE.Vector3(-0.50, 0.60, -0.98),
      new THREE.Vector3(-1.80, 0.60, -0.98),
      new THREE.Vector3(-1.98, 0.60, -0.80),
      new THREE.Vector3(-1.98, 0.60, 0.80)
    ];
    const beltCurve = new THREE.CatmullRomCurve3(beltPts, true);
    const beltGeo = new THREE.TubeGeometry(beltCurve, 64, 0.045, 6, true);
    const belt = new THREE.Mesh(beltGeo, MAT_TIMING_BELT);
    this.timingBeltGroup.add(belt);
    this.animGroups.timingBelt = belt;

    // Dual idler tensioner arms with miniature ball bearings
    [-1.2, 1.2].forEach(ix => {
      const idler = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.10, 16), MAT_ALUM_ANODIZED);
      idler.position.set(ix, 0.60, 0);
      this.timingBeltGroup.add(idler);
    });

    // 120-Slot Optical Encoder Wheel on central shaft
    const encoder = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.015, 32), MAT_316SS_BRUSHED);
    encoder.position.set(0, 0.18, 0);
    this.timingBeltGroup.add(encoder);

    // Head Microcontroller Board (PCB_HeadMCU)
    const headPcb = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.03, 1.0), MAT_PCB_FR4);
    headPcb.position.set(0, 0.22, 1.2);
    headPcb.name = 'PCB_HeadMCU';
    this.timingBeltGroup.add(headPcb);

    // MCU IC package (QFP-64)
    const mcu = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.25), MAT_IC_PACKAGE);
    mcu.position.set(0, 0.24, 1.2);
    this.timingBeltGroup.add(mcu);

    this.pivotDriveHead.add(this.timingBeltGroup);
  }

  buildSpindles() {
    // 8 Rotating Spindles with electropolished USP Apparatus 2 Paddles
    // Mounted into the 8 flanged bearing bosses on the bottom of the drive head
    const rowZ = [0.80, -0.80];
    const colX = [-1.80, -0.60, 0.60, 1.80];

    let spindleIdx = 0;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        spindleIdx++;
        const sx = colX[c];
        const sz = rowZ[r];

        const sGrp = new THREE.Group();
        sGrp.name = `Spindle_Paddle_0${spindleIdx}`;
        sGrp.position.set(sx, 0, sz);

        // Machined aluminum timing pulley with genuine teeth inside head
        const pulley = makeTimingPulley(0.18, 0.12, 24);
        pulley.position.y = 1.00;
        sGrp.add(pulley);

        // Precision ball bearing in sleeve
        const brg = makeBallBearing(0.16, 0.08, 0.08);
        brg.position.y = 0.22;
        sGrp.add(brg);

        // Precision 316SS flanged bearing sleeve
        const sleeve = new THREE.Mesh(
          new THREE.CylinderGeometry(0.17, 0.17, 0.28, 18, 1, true),
          MAT_316SS_BRUSHED
        );
        sleeve.position.y = 0.20;
        sGrp.add(sleeve);

        // Knurled quick-lock collet chuck collar
        const collet = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.08, 0.22, 16),
          MAT_316SS_BRUSHED
        );
        collet.position.y = -0.11;
        sGrp.add(collet);

        // Precision 316SS ground electropolished shaft (dia 9.525 mm -> dia 0.095, length 3.8)
        const shaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0476, 0.0476, 3.80, 20),
          MAT_316SS_ELECTROPOLISHED
        );
        shaft.position.y = -1.90;
        shaft.castShadow = true;
        sGrp.add(shaft);

        // Laser-etched 25 mm depth index immersion ring
        const indexRing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.048, 0.048, 0.015, 16),
          MAT_CHASSIS_DARK
        );
        indexRing.position.y = -3.20;
        sGrp.add(indexRing);

        // Electropolished USP Apparatus 2 Paddle Blade (74.5 x 19 x 4 mm -> 0.745 x 0.19 x 0.04)
        const paddleGeo = new THREE.BoxGeometry(0.745, 0.19, 0.04);
        const paddleMesh = new THREE.Mesh(paddleGeo, MAT_316SS_ELECTROPOLISHED);
        paddleMesh.position.y = -3.70;
        paddleMesh.castShadow = true;
        paddleMesh.name = `Paddle_Blade_0${spindleIdx}`;
        sGrp.add(paddleMesh);

        this.pivotDriveHead.add(sGrp);
        this.animGroups.spindles.push(sGrp);
        this.animGroups.paddles.push(paddleMesh);
      }
    }
  }

  buildHeaterCirculator() {
    // External AutoTemp 1150W Heater / Circulator Unit seated on bench at (3.8, 0, -1.2)
    this.circulatorGroup = new THREE.Group();
    this.circulatorGroup.name = 'Part_HeaterCirculatorAutoTemp';
    this.circulatorGroup.position.set(3.8, 0.0, -1.2);

    // 1. Two-Tone Enclosure (Glacier cream cowl top & dark graphite lower chassis)
    // Lower graphite chassis
    const lowerBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.90, 1.80, 2.20),
      MAT_CHASSIS_DARK
    );
    lowerBody.position.set(0, 0.90, 0);
    lowerBody.castShadow = true;
    lowerBody.receiveShadow = true;
    this.circulatorGroup.add(lowerBody);

    // Glacier cream top cowl
    const topCowl = new THREE.Mesh(
      new THREE.BoxGeometry(1.92, 0.80, 2.22),
      MAT_CHASSIS_CREAM
    );
    topCowl.position.set(0, 2.20, 0);
    topCowl.castShadow = true;
    this.circulatorGroup.add(topCowl);

    // Top molded carry handle with rubber grip
    const handleBar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 1.20), MAT_ALUM_ANODIZED);
    handleBar.position.set(0, 2.70, 0);
    this.circulatorGroup.add(handleBar);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.70), MAT_RUBBER_NBR);
    grip.position.set(0, 2.70, 0);
    this.circulatorGroup.add(grip);

    // 2. Recessed Front Control Console with Dynamic High-DPI LED Texture
    const bezelPocket = new THREE.Mesh(new THREE.BoxGeometry(1.72, 1.04, 0.02), MAT_FASCIA_BEZEL);
    bezelPocket.position.set(0, 1.80, 1.11);
    this.circulatorGroup.add(bezelPocket);

    const circGeo = new THREE.PlaneGeometry(1.68, 1.00);
    const uvAttr = circGeo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setY(i, 1.0 - uvAttr.getY(i));
    }
    uvAttr.needsUpdate = true;

    const circScreen = new THREE.Mesh(circGeo, this.matCircLCD);
    circScreen.position.set(0, 1.80, 1.125);
    circScreen.name = 'UI_CirculatorLCD';
    this.circulatorGroup.add(circScreen);
    this.animGroups.circulatorDisplay = circScreen;

    // 3. Stamped Side Ventilation Louvers
    [-0.96, 0.96].forEach(lx => {
      for (let i = 0; i < 6; i++) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 1.40), makeMat(0x0f172a, { r: 0.8 }));
        louver.position.set(lx, 0.50 + i * 0.14, 0);
        this.circulatorGroup.add(louver);
      }
    });

    // 4. Rear Brass Quick-Disconnect Bulkheads & Hose Couplings
    [-0.45, 0.45].forEach((rx, idx) => {
      const qdFitting = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.18, 16), MAT_BRASS_FITTING);
      qdFitting.rotation.x = Math.PI / 2;
      qdFitting.position.set(rx, 0.90, -1.18);
      this.circulatorGroup.add(qdFitting);

      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16), MAT_316SS_BRUSHED);
      collar.rotation.x = Math.PI / 2;
      collar.position.set(rx, 0.90, -1.24);
      this.circulatorGroup.add(collar);
    });

    // 5. 4 Rubber isolation feet at Y = 0
    [-0.75, 0.75].forEach(cx => {
      [-0.85, 0.85].forEach(cz => {
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 12), MAT_RUBBER_NBR);
        foot.position.set(cx, 0.03, cz);
        this.circulatorGroup.add(foot);
      });
    });

    // Flexible Insulated Quick-Disconnect Silicone Hoses with Genuine 3D Hose Clamps
    this.buildCirculatorHoses();

    this.mainGroup.add(this.circulatorGroup);
    this.animGroups.heaterCirculator = this.circulatorGroup;
  }

  buildCirculatorHoses() {
    // Hose 1: Supply Line (connecting from circulator rear to water bath manifold)
    const p1 = [
      new THREE.Vector3(3.35, 0.90, -2.40),
      new THREE.Vector3(2.40, 0.45, -2.50),
      new THREE.Vector3(1.20, 0.50, -2.70),
      new THREE.Vector3(-0.50, 0.90, -2.85)
    ];
    const curve1 = new THREE.CatmullRomCurve3(p1);
    const hose1 = new THREE.Mesh(new THREE.TubeGeometry(curve1, 32, 0.065, 10, false), MAT_SILICONE_HOSE);
    hose1.castShadow = true;
    hose1.name = 'Hose_Circulator_Supply';
    this.mainGroup.add(hose1);

    // 3D Worm-Drive Hose Clamps at both ends
    const clamp1A = makeHoseClamp(0.075, 0.03);
    clamp1A.position.set(3.35, 0.90, -2.36);
    this.mainGroup.add(clamp1A);

    const clamp1B = makeHoseClamp(0.075, 0.03);
    clamp1B.position.set(-0.50, 0.90, -2.80);
    this.mainGroup.add(clamp1B);

    // Hose 2: Return Line
    const p2 = [
      new THREE.Vector3(4.25, 0.90, -2.40),
      new THREE.Vector3(2.60, 0.35, -2.60),
      new THREE.Vector3(1.40, 0.40, -2.80),
      new THREE.Vector3(0.50, 0.90, -2.85)
    ];
    const curve2 = new THREE.CatmullRomCurve3(p2);
    const hose2 = new THREE.Mesh(new THREE.TubeGeometry(curve2, 32, 0.065, 10, false), MAT_SILICONE_HOSE);
    hose2.castShadow = true;
    hose2.name = 'Hose_Circulator_Return';
    this.mainGroup.add(hose2);

    const clamp2A = makeHoseClamp(0.075, 0.03);
    clamp2A.position.set(4.25, 0.90, -2.36);
    this.mainGroup.add(clamp2A);

    const clamp2B = makeHoseClamp(0.075, 0.03);
    clamp2B.position.set(0.50, 0.90, -2.80);
    this.mainGroup.add(clamp2B);
  }

  // ----------------------------------------------------------------------------
  // Exploded View Setup (Coordinated Multi-Tier Separation)
  // ----------------------------------------------------------------------------
  setupExplodedNodes() {
    this.explodedNodes = [
      // 1. Motorized Drive Head lifts up +1.8 along Y
      { obj: this.pivotDriveHead,   basePos: new THREE.Vector3(0, 4.80, 0.15), offset: new THREE.Vector3(0, 1.8, 0) },

      // 2. Head Top Hood elevates an ADDITIONAL +1.6 along Y, exposing motor, coils, timing belt, pulleys, MCU!
      { obj: this.headTopHood,      basePos: new THREE.Vector3(0, 1.84, 0),    offset: new THREE.Vector3(0, 1.6, 0) },

      // 3. Timing belt drive elevates slightly (+0.5) to clear bearing seats
      { obj: this.timingBeltGroup,  basePos: new THREE.Vector3(0, 0.40, 0),    offset: new THREE.Vector3(0, 0.5, 0) },

      // 4. Entire Water Bath Assembly lifts up +1.2 along Y, fully exposing 12 kg cast iron ballast, gearmotor, and PSU in the base!
      { obj: this.bathGroup,        basePos: new THREE.Vector3(0, 1.40, 0.15), offset: new THREE.Vector3(0, 1.2, 0) },

      // 5. External Heater Circulator offsets to the right +1.6 along X
      { obj: this.circulatorGroup,  basePos: new THREE.Vector3(3.8, 0.0, -1.2), offset: new THREE.Vector3(1.6, 0, 0) }
    ];

    // Spindles exploded offset (lowers them -1.2 out of the drive head collets)
    this.animGroups.spindles.forEach(s => {
      this.explodedNodes.push({
        obj: s,
        basePos: s.position.clone(),
        offset: new THREE.Vector3(0, -1.2, 0)
      });
    });

    // Glass vessels exploded offset (elevates them +1.0 out of the water bath)
    this.animGroups.vessels.forEach(v => {
      this.explodedNodes.push({
        obj: v,
        basePos: v.position.clone(),
        offset: new THREE.Vector3(0, 1.0, 0)
      });
    });

    // TruCenter rings exploded offset (+0.6 along Y)
    this.animGroups.truCenterRings.forEach(r => {
      this.explodedNodes.push({
        obj: r,
        basePos: r.position.clone(),
        offset: new THREE.Vector3(0, 0.6, 0)
      });
    });

    // Tablets exploded offset (hovers inside vessels)
    this.animGroups.tablets.forEach(t => {
      this.explodedNodes.push({
        obj: t,
        basePos: t.position.clone(),
        offset: new THREE.Vector3(0, 0.3, 0)
      });
    });
  }

  toggleExploded() {
    this.exploded = !this.exploded;
    this.targetExplodeFactor = this.exploded ? 1.0 : 0.0;
    return this.exploded;
  }

  setWireframe(wire) {
    this.scene.traverse(node => {
      if (node.isMesh && node.material && node.name !== 'UI_LCD' && node.name !== 'UI_CirculatorLCD') {
        node.material.wireframe = wire;
      }
    });
  }

  setLightIntensity(intensity) {
    if (this.ambientLight) this.ambientLight.intensity = 0.85 * intensity;
    if (this.keyLight) this.keyLight.intensity = 2.0 * intensity;
    if (this.fillLight) this.fillLight.intensity = 1.1 * intensity;
    if (this.specularBounce) this.specularBounce.intensity = 1.3 * intensity;
  }

  // ----------------------------------------------------------------------------
  // Dynamic State Updates & Simulation Loop
  // ----------------------------------------------------------------------------
  updateState(state) {
    this.displayState = state;
    this.isPluggedIn = state.is_plugged_in;
    this.powerSwitchOn = state.power_switch_on;
    this.spindlesSpinning = state.spindles_spinning;
    this.spindleRpm = state.spindle_rpm;
    this.headElevationMm = state.head_elevation_mm;

    this.renderLCD();
    this.renderCirculatorDisplay();

    // Scale tablet geometry based on Noyes-Whitney mass loss
    if (state.vessels) {
      state.vessels.forEach((v, idx) => {
        const tab = this.animGroups.tablets[idx];
        if (tab) {
          const remFrac = Math.max(0.01, 1.0 - (v.dissolved_pct / 100.0));
          const scale = Math.cbrt(remFrac);
          tab.scale.set(scale, scale, scale);
        }
      });
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    // 1. Exploded View Smooth Interpolation
    if (Math.abs(this.explodeFactor - this.targetExplodeFactor) > 0.001) {
      this.explodeFactor += (this.targetExplodeFactor - this.explodeFactor) * 0.08;
      this.explodedNodes.forEach(node => {
        if (node.obj) {
          node.obj.position.lerpVectors(
            node.basePos,
            node.basePos.clone().add(node.offset),
            this.explodeFactor
          );
        }
      });
    }

    // 2. Drive Head Kinematic Elevation Travel (when not in exploded view)
    if (!this.exploded && this.animGroups.pivotDriveHead) {
      // 0 to 311 mm maps to Y offset 0 to 3.11 units
      const targetY = 4.80 + (this.headElevationMm / 100.0);
      this.animGroups.pivotDriveHead.position.y += (targetY - this.animGroups.pivotDriveHead.position.y) * 0.10;

      // Rotate lead screw with elevation movement
      if (this.animGroups.leadScrew) {
        this.animGroups.leadScrew.rotation.y += 0.08;
      }
    }

    // 3. Rotating Spindles & Parabolic Meniscus Vortex Kinematics
    if (this.spindlesSpinning && this.spindleRpm > 0 && this.isPluggedIn && this.powerSwitchOn) {
      const deltaAngle = (this.spindleRpm / 60.0) * (Math.PI * 2) * 0.016;
      this.spindleAngle += deltaAngle;

      this.animGroups.spindles.forEach(s => {
        s.rotation.y = this.spindleAngle;
      });

      // Motor rotor fan rotation
      if (this.animGroups.motorRotor) {
        this.animGroups.motorRotor.rotation.y += deltaAngle * 2.0;
      }

      // Dynamic parabolic vortex depression depth
      const vDepth = Math.min(0.28, (this.spindleRpm / 150.0) * 0.28);
      this.animGroups.vortices.forEach(v => {
        v.scale.set(1.0 + vDepth * 0.5, 1.0 + vDepth * 2.0, 1.0 + vDepth * 0.5);
      });
    } else {
      // Collapse vortex when stirring stops
      this.animGroups.vortices.forEach(v => {
        v.scale.set(1.0, 1.0, 1.0);
      });
    }

    // 4. Subtle Thermal Fluid Ripples when Circulator is Active
    if (this.isPluggedIn && this.powerSwitchOn && this.animGroups.bathWater) {
      const t = performance.now() * 0.003;
      this.animGroups.bathWater.position.y = 0.98 + Math.sin(t) * 0.004;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
