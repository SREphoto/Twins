/**
 * ERWEKA ZT 322 Tablet Disintegration Tester (USP <701>) 3D Engine
 * Centrifuge Gold Standard Procedural CAD & Kinematic Assembly
 *
 * 13-Subagent Puzzle Architecture & Exhaustive Procedural Detail:
 * 1. Physical Bench Datum at Y = 0 (Y = 9.0 lab world on INSTRUMENT_BENCH)
 * 2. Structural Unibody Housing: Base pan (430 x 400 x 240 mm) with recessed front deck
 *    and rear upright drive tower (360 x 160 x 420 mm)
 * 3. 4x M10 Threaded Leveling Feet with vulcanized rubber suction pads at Y=0
 * 4. Front Clear Molded Acrylic Water Bath (380 x 210 x 190 mm) with drain petcock & 1500W immersion coil
 * 5. Dual 1000 mL Borosilicate 3.3 Griffin Beakers with graduation decals & 800 mL test fluid
 * 6. All 5 Internal Motors & Actuators:
 *    - M1: 24V Brushless Planetary Gearmotor (Body_Motor_HarmonicStepper) driving eccentric crank
 *    - M2 & M3: Dual NEMA 17 Motorized Basket-Lift Stepper Actuators (Body_Motor_LiftActuator_Left/Right) + lead screws
 *    - M4: 24V Magnetic-Drive Water Bath Circulation Pump Motor (Body_Motor_BathPump) + braided silicone plumbing
 *    - M5: 80mm Brushless Axial Cabinet Cooling Fan (Body_Fan_CabinetCooling_Blower) with spinning impeller
 * 7. All Internal Sensors, Controllers & 45° Optical Relay Mirrors:
 *    - S1: PT100 Class A RTD Bath Temperature Probe (Body_Sensor_PT100_Bath)
 *    - S2: Slotted Optical TDC/BDC Stroke Tachometer (Body_Sensor_HallTachometer)
 *    - S3: 1024-PPR Quadrature Optical Rotary Encoder (Body_Sensor_OpticalEncoder)
 *    - S4 & S5: Upper/Lower Basket-Lift Limit Microswitches (Body_Sensor_LimitSwitch_Top/Btm)
 *    - S6: Bath Low-Water-Level Magnetic Reed Float Sensor (Body_Sensor_WaterLevel_Float)
 *    - S7 & S8: IR Laser Automatic Tablet Disintegration Detectors (Body_Sensor_LaserDisintegration_01/02)
 *      with 45°-Angled First-Surface Gold Optical Relay Mirrors (Glass_Mirror_OpticalRelay_01/02)
 * 8. Full Power Supply & End-to-End Color-Coded 3D Power Routing:
 *    - IEC C14 Inlet, DPST Mains Rocker Switch, Schaffner EMI Filter, Chassis Ground Lug
 *    - Toroidal Transformer (180VA) & Mean Well 24VDC 150W Switching PSU with 7-screw barrier block & filter caps
 *    - Crydom 25A Zero-Cross SSR on finned heatsink & DIN-rail DC distribution block
 *    - Color-coded 3D TubeGeometry wiring harnesses (Brown AC Hot, Blue Neutral, Green/Yellow PE,
 *      Orange Heater Feed, Red/Black +24VDC Motor & Logic Buses, Grey IDC Ribbon Cables)
 * 9. All Data, Non-Volatile Storage, Wireless (Wi-Fi / Bluetooth BLE 5.2) & Physical I/O Ports:
 *    - Motherboard with ARM Cortex-M4 MCU, 64MB SDRAM, 16GB eMMC SSD Flash, 24-Bit Delta-Sigma ADC, CR2032 RTC
 *    - Shielded Wi-Fi 802.11ac / Bluetooth BLE 5.2 RF Module with U.FL gold coax to external 2.4 GHz Dipole Antenna
 *    - Rear I/O Bulkhead: RS-232 DB9, USB-B PC Port, USB-A Flash Host (with removable USB drive), RJ45 Ethernet LAN
 */

import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Material Generators & PBR Palette (1 unit = 100 mm = 1 dm)
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

// Chassis & Enclosures (Glacier Cream & Charcoal Trim)
const MAT_CHASSIS_CREAM = makeMat(0xf4f6f9, { r: 0.32, m: 0.08 });
const MAT_CHASSIS_DARK  = makeMat(0x1e2530, { r: 0.55, m: 0.18 });
const MAT_DRIVE_HEAD    = makeMat(0xd8e0e8, { r: 0.30, m: 0.35 });
const MAT_CONSOLE_BEZEL = makeMat(0x0f172a, { r: 0.60, m: 0.15 });

// High-Luster Specular Stainless Steels & Metals
const MAT_316SS_ELECTROPOLISHED = makeMat(0xf8fafc, { r: 0.14, m: 0.88 });
const MAT_316SS_BRUSHED         = makeMat(0xd8e0e8, { r: 0.26, m: 0.80 });
const MAT_CHROME_STEEL          = makeMat(0xf1f5f9, { r: 0.16, m: 0.88 });
const MAT_ALUM_ANODIZED         = makeMat(0xcbd5e1, { r: 0.28, m: 0.75 });
const MAT_COPPER_COIL           = makeMat(0xca8a04, { r: 0.25, m: 0.85 });
const MAT_BRASS_FITTING         = makeMat(0xd97706, { r: 0.22, m: 0.82 });
const MAT_GOLD_PIN              = makeMat(0xfbbf24, { r: 0.15, m: 0.92 });
const MAT_GOLD_MIRROR           = makeMat(0xfacc15, { r: 0.04, m: 0.98 });

// Polymers, Elastomers, PCB & Wiring Insulation
const MAT_RUBBER_NBR    = makeMat(0x18181b, { r: 0.88, m: 0.05 });
const MAT_CORD_BLACK    = makeMat(0x0a0f1d, { r: 0.75, m: 0.05 });
const MAT_PCB_FR4       = makeMat(0x0f5132, { r: 0.45, m: 0.15 });
const MAT_IC_PACKAGE    = makeMat(0x111827, { r: 0.35, m: 0.10 });
const MAT_TABLET_WHITE  = makeMat(0xfdfbf7, { r: 0.72, m: 0.02 });

// Color-Coded Industrial Wiring Harness Materials
const MAT_WIRE_AC_BROWN = makeMat(0x92400e, { r: 0.45, m: 0.05 }); // AC Line Hot (L)
const MAT_WIRE_AC_BLUE  = makeMat(0x1d4ed8, { r: 0.45, m: 0.05 }); // AC Neutral (N)
const MAT_WIRE_PE_GRNYLW= makeMat(0x65a30d, { r: 0.45, m: 0.05 }); // Protective Earth (PE)
const MAT_WIRE_DC_RED   = makeMat(0xdc2626, { r: 0.40, m: 0.05 }); // +24VDC / +5VDC Bus
const MAT_WIRE_DC_BLACK = makeMat(0x1e293b, { r: 0.45, m: 0.05 }); // DC Return (GND)
const MAT_WIRE_HEATER   = makeMat(0xea580c, { r: 0.40, m: 0.08 }); // High-Temp Heater Feed
const MAT_WIRE_SENSOR   = makeMat(0x06b6d4, { r: 0.40, m: 0.08 }); // Sensor Shielded Cable
const MAT_RIBBON_GREY   = makeMat(0x64748b, { r: 0.50, m: 0.10 }); // IDC Flat Ribbon Bus
const MAT_SILICONE_HOSE = makeMat(0x93c5fd, { r: 0.25, m: 0.05, o: 0.72, dw: false });

// Optical Glass & Acrylics (Physical Transmission with true IOR)
const MAT_BATH_ACRYLIC = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.95,
  roughness: 0.04,
  ior: 1.49,
  thickness: 0.06,
  transparent: true,
  opacity: 1.0,
  clearcoat: 1.0,
  depthWrite: false,
  side: THREE.DoubleSide
});

const MAT_BEAKER_BOROSILICATE = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.96,
  roughness: 0.02,
  ior: 1.52,
  thickness: 0.03,
  transparent: true,
  opacity: 1.0,
  clearcoat: 1.0,
  depthWrite: false,
  side: THREE.DoubleSide
});

const MAT_WATER_FLUID = new THREE.MeshPhysicalMaterial({
  color: 0x38bdf8,
  transmission: 0.88,
  roughness: 0.08,
  ior: 1.333,
  thickness: 0.8,
  transparent: true,
  opacity: 0.65,
  depthWrite: false,
  side: THREE.DoubleSide
});

const MAT_LASER_BEAM = makeMat(0xef4444, {
  r: 0.2, m: 0.0, o: 0.68, e: 0xef4444, ei: 1.6, dw: false, side: THREE.DoubleSide
});

// ----------------------------------------------------------------------------
// Operator-Facing Quad Geometry (Upright & Unmirrored UV Guarantee)
// ----------------------------------------------------------------------------
export function makeOperatorFacingQuadGeo(w, h) {
  const geo = new THREE.BufferGeometry();
  const halfW = w / 2;
  const halfH = h / 2;

  const positions = new Float32Array([
     halfW,  halfH, 0,
    -halfW,  halfH, 0,
     halfW, -halfH, 0,
    -halfW, -halfH, 0,
  ]);

  const normals = new Float32Array([
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
  ]);

  const uvs = new Float32Array([
    0, 1,
    1, 1,
    0, 0,
    1, 0,
  ]);

  const indices = [
    0, 2, 1,
    2, 3, 1
  ];

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);

  // Enforce explicit UV Y-inversion for flipY = false CanvasTextures
  const uvAttr = geo.getAttribute('uv');
  for (let i = 0; i < uvAttr.count; i++) {
    uvAttr.setY(i, 1.0 - uvAttr.getY(i));
  }
  uvAttr.needsUpdate = true;

  return geo;
}

// ----------------------------------------------------------------------------
// High-DPI Procedural Component Silkscreen Label Builder (Dual-Sided Upright)
// ----------------------------------------------------------------------------
function makeSilkscreenPlacard(title, subtitle, w = 0.42, h = 0.16, bgHex = "#0f172a", accentHex = "#38bdf8") {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 196;
  const ctx = c.getContext("2d");

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, c.width - 8, c.height - 8);

  ctx.fillStyle = accentHex;
  ctx.font = "bold 38px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title, c.width / 2, subtitle ? 66 : c.height / 2);

  if (subtitle) {
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 26px system-ui,sans-serif";
    ctx.fillText(subtitle, c.width / 2, 134);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;

  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide });
  const holder = new THREE.Group();

  // Front-facing upright silkscreen face (-Z normal)
  const frontMesh = new THREE.Mesh(makeOperatorFacingQuadGeo(w, h), mat);
  frontMesh.position.z = -0.004;
  holder.add(frontMesh);

  // Rear-facing upright silkscreen face (+Z normal)
  const rearMesh = new THREE.Mesh(makeOperatorFacingQuadGeo(w, h), mat);
  rearMesh.rotation.y = Math.PI;
  rearMesh.position.z = 0.004;
  holder.add(rearMesh);

  return holder;
}

// ----------------------------------------------------------------------------
// Procedural 3D Wiring Harness Builder (Catmull-Rom Spline Tube)
// ----------------------------------------------------------------------------
function makeWiringHarness(points, radius, mat, name) {
  const vectors = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
  const curve = new THREE.CatmullRomCurve3(vectors);
  const geo = new THREE.TubeGeometry(curve, 28, radius, 10, false);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = name;
  return mesh;
}

// ----------------------------------------------------------------------------
// Procedural Fastener & Hardware Builders (Genuine 3D Geometry)
// ----------------------------------------------------------------------------
function makeHexSocketBolt(r = 0.025, len = 0.08, name = "Fastener_HexM4") {
  const g = new THREE.Group();
  g.name = name;

  const shaftGeo = new THREE.CylinderGeometry(r, r, len, 16);
  const shaft = new THREE.Mesh(shaftGeo, MAT_CHROME_STEEL);
  shaft.position.y = -len / 2;
  g.add(shaft);

  const headR = r * 1.6;
  const headH = r * 1.8;
  const headGeo = new THREE.CylinderGeometry(headR, headR, headH, 20);
  const head = new THREE.Mesh(headGeo, MAT_CHROME_STEEL);
  head.position.y = headH / 2;
  g.add(head);

  const hexR = r * 0.95;
  const hexH = headH * 0.65;
  const hexGeo = new THREE.CylinderGeometry(hexR, hexR, hexH, 6);
  const hex = new THREE.Mesh(hexGeo, MAT_CHASSIS_DARK);
  hex.position.y = headH - hexH / 2 + 0.001;
  g.add(hex);

  const washerGeo = new THREE.CylinderGeometry(headR * 1.15, headR * 1.15, r * 0.35, 16);
  const washer = new THREE.Mesh(washerGeo, MAT_316SS_BRUSHED);
  washer.position.y = -r * 0.175;
  g.add(washer);

  return g;
}

function makeLevelingFoot(cornerName) {
  const g = new THREE.Group();
  g.name = `Foot_Leveling_${cornerName}`;

  const padR = 0.20, padH = 0.12;
  const padGeo = new THREE.CylinderGeometry(padR * 0.88, padR, padH, 24);
  const pad = new THREE.Mesh(padGeo, MAT_RUBBER_NBR);
  pad.position.y = padH / 2;
  pad.castShadow = true;
  g.add(pad);

  const studGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.18, 16);
  const stud = new THREE.Mesh(studGeo, MAT_CHROME_STEEL);
  stud.position.y = padH + 0.09;
  g.add(stud);

  const nutGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.05, 6);
  const nut = new THREE.Mesh(nutGeo, MAT_316SS_BRUSHED);
  nut.position.y = padH + 0.04;
  g.add(nut);

  return g;
}

// ----------------------------------------------------------------------------
// SREdesigns Brand Certification Badge (Lower Frame Placement)
// ----------------------------------------------------------------------------
function makeSREdesignsBadge() {
  const g = new THREE.Group();
  g.name = "Badge_SREdesigns";

  const w = 0.76, h = 0.28, d = 0.015;
  const plateGeo = new THREE.BoxGeometry(w, h, d);
  const plate = new THREE.Mesh(plateGeo, MAT_316SS_BRUSHED);
  g.add(plate);

  const ox = w / 2 - 0.035, oy = h / 2 - 0.035;
  for (const [sx, sy] of [[-ox, oy], [ox, oy], [-ox, -oy], [ox, -oy]]) {
    const sc = makeHexSocketBolt(0.010, 0.018, "Fastener_HexM2_Badge");
    sc.position.set(sx, sy, -d / 2 - 0.005);
    sc.rotation.x = Math.PI / 2;
    g.add(sc);
  }

  const c = document.createElement("canvas");
  c.width = 1024; c.height = 368;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0c1016";
  ctx.fillRect(0, 0, 1024, 368);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 1012, 356);

  const letters = ["S", "R", "E"];
  const tileW = 100, tileH = 110, gap = 6;
  const tileY = 40;
  let x0 = 50;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 84px system-ui,Segoe UI,Arial,sans-serif";
  for (const ch of letters) {
    const g2 = ctx.createLinearGradient(x0, tileY, x0 + tileW, tileY + tileH);
    g2.addColorStop(0, "#38bdf8");
    g2.addColorStop(1, "#0284c7");
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.roundRect(x0, tileY, tileW, tileH, 12);
    ctx.fill();
    ctx.fillStyle = "#0a1218";
    ctx.fillText(ch, x0 + tileW / 2, tileY + tileH / 2 + 2);
    x0 += tileW + gap;
  }

  const tx = x0 + 30;
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 56px system-ui,Segoe UI,Arial,sans-serif";
  ctx.fillText("designs.com", tx, 95);
  ctx.strokeStyle = "#0284c7"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(tx, 140); ctx.lineTo(960, 140); ctx.stroke();
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "600 36px system-ui,Segoe UI,Arial,sans-serif";
  ctx.fillText("ERWEKA ZT 322 · USP <701>", 50, 220);
  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 28px system-ui,Segoe UI,Arial,sans-serif";
  ctx.fillText("● CERTIFIED GOLD STANDARD DIGITAL TWIN", 50, 290);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;

  const faceGeo = makeOperatorFacingQuadGeo(w - 0.02, h - 0.02);
  const face = new THREE.Mesh(
    faceGeo,
    new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.35, metalness: 0.20, side: THREE.DoubleSide
    })
  );
  face.position.z = -d / 2 - 0.003;
  g.add(face);

  return g;
}

// ----------------------------------------------------------------------------
// Procedural Tactile Buttons with Silkscreen Labels
// ----------------------------------------------------------------------------
function makeTactileButton(name, label, colorHex, w = 0.24, h = 0.16) {
  const g = new THREE.Group();
  g.name = name;

  const bezelGeo = new THREE.BoxGeometry(w + 0.04, h + 0.04, 0.04);
  const bezel = new THREE.Mesh(bezelGeo, MAT_316SS_BRUSHED);
  bezel.position.z = 0.02;
  g.add(bezel);

  const capGeo = new THREE.BoxGeometry(w, h, 0.05);
  const capMat = makeMat(colorHex, { r: 0.35, m: 0.15 });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.name = `${name}_Keycap`;
  cap.position.z = -0.015;
  g.add(cap);

  const c = document.createElement("canvas");
  c.width = 256; c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = "#0c1016";
  ctx.font = "bold 44px system-ui,Segoe UI,Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 128, 64);

  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;

  const lblGeo = makeOperatorFacingQuadGeo(w * 0.90, h * 0.85);
  const lblMesh = new THREE.Mesh(
    lblGeo,
    new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.40, metalness: 0.10, side: THREE.DoubleSide
    })
  );
  lblMesh.position.z = -0.041;
  cap.add(lblMesh);

  return g;
}

// ----------------------------------------------------------------------------
// Main Procedural 3D Engine: Disintegration3D
// ----------------------------------------------------------------------------
export class Disintegration3D {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;

    // Simulation state
    this.isPluggedIn = true;
    this.powerSwitchOn = true;
    this.state = 'STANDBY';
    this.oscillationActive = false;
    this.heaterActive = false;
    this.crankAngle = 0.0;
    this.basketElevation = 0.0;
    this.targetElevation = 0.0;
    this.cpm = 30.0;
    this.cutawayActive = false;

    // Exploded view
    this.explodeFactor = 0.0;
    this.targetExplodeFactor = 0.0;
    this.explodeTargets = [];

    // Animation nodes cache
    this.animNodes = {
      driveHead: null,
      crankDisc: null,
      connectingRod: null,
      crosshead: null,
      fanBlades: null,
      leadScrews: [],
      baskets: [],
      beakerFluids: [],
      tablets: []
    };

    this.init();
  }

  init() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;

    // Camera setup (encompassing 430 x 400 x 660 mm bounding envelope)
    this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    this.camera.position.set(0, 5.2, -10.5);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.container.appendChild(this.renderer.domElement);

    // Build 3D world
    this.buildLabRoom();
    this.buildInstrumentChassis();
    this.buildWaterBathAndGlassware();
    this.buildKinematicDrive();
    this.buildApparatusBaskets();
    this.buildOperatorConsole();
    this.buildElectronicsBay();
    this.buildPowerContinuity();
    this.setupExplodedViewTargets();

    // Resize handler
    window.addEventListener('resize', () => this.onWindowResize());

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // --------------------------------------------------------------------------
  // Laboratory Room, Bench & Calibrated 3-Point Lighting
  // --------------------------------------------------------------------------
  buildLabRoom() {
    this.scene.background = new THREE.Color(0x0c1016);
    this.scene.fog = new THREE.FogExp2(0x0c1016, 0.032);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.72);
    this.scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.30);
    keyLight.position.set(-5.0, 10.0, -8.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.65);
    fillLight.position.set(6.0, 8.0, 6.0);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(0, 12.0, 8.0);
    this.scene.add(rimLight);

    // High-bay ceiling clearance (Y = 28.0 m)
    const ceilGeo = new THREE.PlaneGeometry(60, 60);
    const ceilMesh = new THREE.Mesh(ceilGeo, makeMat(0x1e293b, { r: 0.8 }));
    ceilMesh.position.y = 28.0;
    ceilMesh.rotation.x = Math.PI / 2;
    ceilMesh.material.side = THREE.FrontSide;
    this.scene.add(ceilMesh);

    // Black Epoxy Lab Bench (INSTRUMENT_BENCH) at Datum Y = 0
    const benchW = 24.0, benchD = 12.0, benchH = 1.0;
    const benchGeo = new THREE.BoxGeometry(benchW, benchH, benchD);
    const matBench = new THREE.MeshStandardMaterial({ color: 0x11161f, roughness: 0.22, metalness: 0.15 });
    const bench = new THREE.Mesh(benchGeo, matBench);
    bench.name = "Body_INSTRUMENT_BENCH";
    bench.position.set(0, -benchH / 2, 0);
    bench.receiveShadow = true;
    this.scene.add(bench);

    const trimGeo = new THREE.BoxGeometry(benchW, 0.08, 0.08);
    const trim = new THREE.Mesh(trimGeo, MAT_316SS_BRUSHED);
    trim.position.set(0, -0.04, -benchD / 2 - 0.04);
    this.scene.add(trim);

    const wallGeo = new THREE.PlaneGeometry(benchW, 16.0);
    const wallMat = makeMat(0x18202c, { r: 0.65, m: 0.05 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 8.0, benchD / 2);
    wall.rotation.y = Math.PI;
    this.scene.add(wall);
  }

  // --------------------------------------------------------------------------
  // Main Instrument Chassis & Enclosure
  // --------------------------------------------------------------------------
  buildInstrumentChassis() {
    this.chassisGroup = new THREE.Group();
    this.chassisGroup.name = "Body_Chassis";
    this.scene.add(this.chassisGroup);

    // 4 Corner Leveling Feet (Datum Y = 0, stay grounded during exploded view)
    const footPositions = [
      [-1.85, 0, -1.70, "FL"],
      [ 1.85, 0, -1.70, "FR"],
      [-1.85, 0,  1.70, "RL"],
      [ 1.85, 0,  1.70, "RR"]
    ];
    for (const [x, y, z, id] of footPositions) {
      const foot = makeLevelingFoot(id);
      foot.position.set(x, y, z);
      this.chassisGroup.add(foot);
    }

    // Internal Galvanized Steel Structural Floor Pan (Stays at Y=0.14 dm so internal components sit on solid metal)
    const floorPanGeo = new THREE.BoxGeometry(4.18, 0.04, 3.88);
    const floorPan = new THREE.Mesh(floorPanGeo, MAT_316SS_BRUSHED);
    floorPan.name = "Body_Chassis_FloorPan";
    floorPan.position.set(0, 0.14, 0);
    floorPan.receiveShadow = true;
    this.chassisGroup.add(floorPan);

    // Upper Structural Shell Group (Elevates in Exploded View to expose Electronics Bay)
    this.enclosureShell = new THREE.Group();
    this.enclosureShell.name = "Body_EnclosureShell";
    this.chassisGroup.add(this.enclosureShell);

    // Main Lower Cabinet Base (4.30 dm W x 4.00 dm D x 2.28 dm H)
    const basePanGeo = new THREE.BoxGeometry(4.30, 2.28, 4.00);
    this.basePanMesh = new THREE.Mesh(basePanGeo, MAT_CHASSIS_CREAM.clone());
    this.basePanMesh.name = "Body_Cabinet_BasePan";
    this.basePanMesh.position.set(0, 0.12 + 2.28 / 2, 0);
    this.basePanMesh.castShadow = true;
    this.basePanMesh.receiveShadow = true;
    this.enclosureShell.add(this.basePanMesh);

    // Front Recessed Deck Cradle for Acrylic Bath (Depth 0.20 dm)
    const deckGeo = new THREE.BoxGeometry(3.90, 0.08, 2.20);
    this.bathCradleMesh = new THREE.Mesh(deckGeo, MAT_316SS_BRUSHED.clone());
    this.bathCradleMesh.name = "Body_Chassis_BathCradle";
    this.bathCradleMesh.position.set(0, 0.12 + 2.28 + 0.04, -0.85);
    this.enclosureShell.add(this.bathCradleMesh);

    // Side Ventilation Louvers (Left & Right Flanks)
    for (let side of [-1, 1]) {
      for (let i = 0; i < 8; i++) {
        const louverGeo = new THREE.BoxGeometry(0.04, 0.035, 0.35);
        const louver = new THREE.Mesh(louverGeo, MAT_CHASSIS_DARK);
        louver.name = `Body_Chassis_Louver_${side < 0 ? 'L' : 'R'}_0${i + 1}`;
        louver.position.set(side * 2.15, 0.45 + i * 0.18, 0.30);
        this.enclosureShell.add(louver);
      }
    }

    // Upright Rear Drive Column Tower (3.60 dm W x 1.60 dm D x 4.20 dm H)
    const towerGeo = new THREE.BoxGeometry(3.60, 4.20, 1.60);
    this.towerMesh = new THREE.Mesh(towerGeo, MAT_CHASSIS_CREAM.clone());
    this.towerMesh.name = "Body_Cabinet_UprightTower";
    this.towerMesh.position.set(0, 2.40 + 4.20 / 2, 1.00);
    this.towerMesh.castShadow = true;
    this.enclosureShell.add(this.towerMesh);

    // Structural Hex Screws on Tower Flanges
    for (let i = 0; i < 4; i++) {
      const scL = makeHexSocketBolt(0.025, 0.08, `Fastener_HexM4_TowerL0${i + 1}`);
      scL.position.set(-1.75, 2.60 + i * 1.00, 1.00);
      scL.rotation.z = Math.PI / 2;
      this.enclosureShell.add(scL);

      const scR = makeHexSocketBolt(0.025, 0.08, `Fastener_HexM4_TowerR0${i + 1}`);
      scR.position.set(1.75, 2.60 + i * 1.00, 1.00);
      scR.rotation.z = -Math.PI / 2;
      this.enclosureShell.add(scR);
    }

    // Official SREdesigns Brand Badge on LOWER FRAME (Bottom-Left Corner)
    const badge = makeSREdesignsBadge();
    badge.position.set(-1.55, 0.42, -2.01);
    this.enclosureShell.add(badge);
  }

  // --------------------------------------------------------------------------
  // Cutaway X-Ray Mode (Ghosting Outer Sheet-Metal to Inspect Internal Systems)
  // --------------------------------------------------------------------------
  setCutaway(enabled) {
    this.cutawayActive = !!enabled;
    for (const mesh of [this.basePanMesh, this.towerMesh, this.bathCradleMesh]) {
      if (mesh) {
        mesh.material.transparent = this.cutawayActive;
        mesh.material.opacity = this.cutawayActive ? 0.08 : 1.0;
        mesh.material.depthWrite = !this.cutawayActive;
        mesh.material.needsUpdate = true;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Acrylic Water Bath, Immersion Heater, Sensors & Optical Relay Mirrors
  // --------------------------------------------------------------------------
  buildWaterBathAndGlassware() {
    this.bathGroup = new THREE.Group();
    this.bathGroup.name = "Body_Bath";
    this.bathGroup.position.set(0, 2.48, -0.85);
    this.scene.add(this.bathGroup);

    // Seamless Molded Acrylic Water Bath (3.80 x 2.10 x 1.90 dm)
    const bathGeo = new THREE.BoxGeometry(3.80, 1.90, 2.10);
    const bathMesh = new THREE.Mesh(bathGeo, MAT_BATH_ACRYLIC);
    bathMesh.position.y = 1.90 / 2;
    bathMesh.castShadow = true;
    this.bathGroup.add(bathMesh);

    // Bath Heated Water Volume
    const waterGeo = new THREE.BoxGeometry(3.68, 1.65, 1.98);
    const waterMesh = new THREE.Mesh(waterGeo, MAT_WATER_FLUID);
    waterMesh.position.y = 1.65 / 2 + 0.06;
    this.bathGroup.add(waterMesh);

    // Serpentine 1500W Incoloy 800 Immersion Heater Coil at Bath Floor
    const heaterCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.55, 0.10,  0.85),
      new THREE.Vector3(-1.55, 0.10, -0.75),
      new THREE.Vector3(-1.20, 0.10, -0.75),
      new THREE.Vector3(-1.20, 0.10,  0.75),
      new THREE.Vector3( 1.20, 0.10,  0.75),
      new THREE.Vector3( 1.20, 0.10, -0.75),
      new THREE.Vector3( 1.55, 0.10, -0.75),
      new THREE.Vector3( 1.55, 0.10,  0.85)
    ]);
    const heaterGeo = new THREE.TubeGeometry(heaterCurve, 48, 0.032, 12, false);
    this.heaterCoilMesh = new THREE.Mesh(heaterGeo, MAT_CHROME_STEEL.clone());
    this.heaterCoilMesh.name = "Body_Heater_ImmersionCoil";
    this.bathGroup.add(this.heaterCoilMesh);

    // S1: PT100 Class A RTD Bath Immersion Temperature Sensor Probe (dia 4mm x 160mm)
    const pt100Group = new THREE.Group();
    pt100Group.name = "Body_Sensor_PT100_Bath";
    pt100Group.position.set(0, 1.15, 0.72);
    this.bathGroup.add(pt100Group);

    const probeSheath = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 1.65, 16),
      MAT_316SS_ELECTROPOLISHED
    );
    pt100Group.add(probeSheath);

    const probeGland = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.18, 6),
      MAT_BRASS_FITTING
    );
    probeGland.position.y = 0.82;
    pt100Group.add(probeGland);

    const ptLabel = makeSilkscreenPlacard("S1: PT100 RTD", "CLASS A ±0.1°C", 0.42, 0.15, "#0f172a", "#06b6d4");
    ptLabel.position.set(0, 1.02, -0.05);
    pt100Group.add(ptLabel);

    // S6: Bath Low-Water-Level Magnetic Reed Float Sensor (Rear-Left Corner)
    const floatGroup = new THREE.Group();
    floatGroup.name = "Body_Sensor_WaterLevel_Float";
    floatGroup.position.set(-1.62, 1.10, 0.72);
    this.bathGroup.add(floatGroup);

    const floatStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.50, 12),
      MAT_316SS_BRUSHED
    );
    floatGroup.add(floatStem);

    const floatDrum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.22, 20),
      MAT_TABLET_WHITE
    );
    floatDrum.name = "Pivot_Float_WaterLevel";
    floatDrum.position.y = 0.35;
    floatGroup.add(floatDrum);

    const floatLbl = makeSilkscreenPlacard("S6: FLOAT SW", "LOW WATER CUTOFF", 0.42, 0.15, "#0f172a", "#22c55e");
    floatLbl.position.set(0, 0.92, -0.05);
    floatGroup.add(floatLbl);

    // Quarter-turn brass drain valve on right side
    const drainGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.20, 16);
    const drainMesh = new THREE.Mesh(drainGeo, MAT_BRASS_FITTING);
    drainMesh.name = "Knob_Bath_DrainValve";
    drainMesh.position.set(1.90 + 0.10, 0.25, 0);
    drainMesh.rotation.z = Math.PI / 2;
    this.bathGroup.add(drainMesh);

    // Two 1000 mL Low-Form Griffin Glass Beakers (Station 1 & Station 2)
    const beakerCenters = [-0.825, 0.825];
    for (let stn = 0; stn < 2; stn++) {
      const cx = beakerCenters[stn];
      const beakerGroup = new THREE.Group();
      beakerGroup.name = `Glass_Beaker_0${stn + 1}`;
      beakerGroup.position.set(cx, 0.06, 0);
      this.bathGroup.add(beakerGroup);

      // Glass wall (outer dia 1.05 dm x 1.45 dm H)
      const wallGeo = new THREE.CylinderGeometry(0.525, 0.525, 1.45, 32, 1, true);
      const wallMesh = new THREE.Mesh(wallGeo, MAT_BEAKER_BOROSILICATE);
      wallMesh.position.y = 1.45 / 2;
      beakerGroup.add(wallMesh);

      // Glass bottom
      const btmGeo = new THREE.CylinderGeometry(0.525, 0.525, 0.04, 32);
      const btmMesh = new THREE.Mesh(btmGeo, MAT_BEAKER_BOROSILICATE);
      btmMesh.position.y = 0.02;
      beakerGroup.add(btmMesh);

      // Spout rim lip
      const rimGeo = new THREE.TorusGeometry(0.525, 0.02, 12, 32);
      const rimMesh = new THREE.Mesh(rimGeo, MAT_BEAKER_BOROSILICATE);
      rimMesh.position.y = 1.45;
      rimMesh.rotation.x = Math.PI / 2;
      beakerGroup.add(rimMesh);

      // 800 mL Test Fluid Column (Gastric / Buffer)
      const fluidGeo = new THREE.CylinderGeometry(0.495, 0.495, 1.12, 32);
      const fluidMesh = new THREE.Mesh(fluidGeo, MAT_WATER_FLUID);
      fluidMesh.name = `Glass_Fluid_Beaker_0${stn + 1}`;
      fluidMesh.position.y = 1.12 / 2 + 0.04;
      beakerGroup.add(fluidMesh);
      this.animNodes.beakerFluids.push(fluidMesh);
    }
  }

  // --------------------------------------------------------------------------
  // Kinematic Harmonic Drive Mechanism, Motors M1-M3, Lead Screws & Limit Sensors
  // --------------------------------------------------------------------------
  buildKinematicDrive() {
    this.driveGroup = new THREE.Group();
    this.driveGroup.name = "Pivot_Mechanism_KinematicDrive";
    this.driveGroup.position.set(0, 0, 1.00);
    this.scene.add(this.driveGroup);

    // Dual Ground Guide Shafts (Chrome Steel, dia 16 mm = 0.16 dm)
    for (let side of [-1, 1]) {
      const sideTag = side < 0 ? 'Left' : 'Right';
      const shaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.80, 24);
      const shaft = new THREE.Mesh(shaftGeo, MAT_CHROME_STEEL);
      shaft.name = `Body_Shaft_Guide_${sideTag}`;
      shaft.position.set(side * 0.80, 2.40 + 3.80 / 2, 0);
      this.driveGroup.add(shaft);

      // Linear ball bushings (LM16UU)
      const bushGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.45, 24);
      const bush = new THREE.Mesh(bushGeo, MAT_316SS_BRUSHED);
      bush.name = `Pivot_Bushing_Linear_${sideTag}`;
      bush.position.set(side * 0.80, 5.60, 0);
      this.driveGroup.add(bush);

      // M2 & M3: Dual NEMA 17 Motorized Basket-Lift Stepper Actuators + Lead Screws
      const liftMotorGroup = new THREE.Group();
      liftMotorGroup.name = `Body_Motor_LiftActuator_${sideTag}`;
      liftMotorGroup.position.set(side * 1.18, 2.68, 0.08);
      this.driveGroup.add(liftMotorGroup);

      const nemaStator = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.48, 0.42),
        MAT_CHASSIS_DARK
      );
      liftMotorGroup.add(nemaStator);

      const nemaCap = new THREE.Mesh(
        new THREE.BoxGeometry(0.43, 0.08, 0.43),
        MAT_ALUM_ANODIZED
      );
      nemaCap.position.y = 0.22;
      liftMotorGroup.add(nemaCap);

      const coupling = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.18, 20),
        MAT_ALUM_ANODIZED
      );
      coupling.name = `Pivot_Coupling_Lift_${side < 0 ? 'L' : 'R'}`;
      coupling.position.y = 0.35;
      liftMotorGroup.add(coupling);

      // Vertical Trapezoidal Stainless Lead Screw (TR10x2)
      const screwMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 3.10, 20),
        MAT_316SS_ELECTROPOLISHED
      );
      screwMesh.name = `Pivot_LeadScrew_Lift_${side < 0 ? 'L' : 'R'}`;
      screwMesh.position.y = 1.90;
      liftMotorGroup.add(screwMesh);
      this.animNodes.leadScrews.push(screwMesh);

      // Anti-backlash Brass Lead Screw Flange Nut
      const nutMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.16, 16),
        MAT_BRASS_FITTING
      );
      nutMesh.name = `Pivot_Nut_LeadScrew_${side < 0 ? 'L' : 'R'}`;
      nutMesh.position.y = 2.85;
      liftMotorGroup.add(nutMesh);

      const mNum = side < 0 ? "M2: LIFT MOTOR L" : "M3: LIFT MOTOR R";
      const liftLbl = makeSilkscreenPlacard(mNum, "NEMA 17 STEPPER", 0.46, 0.16, "#0f172a", "#f59e0b");
      liftLbl.position.set(0, 0, -0.23);
      liftMotorGroup.add(liftLbl);
    }

    // Eccentric Rotary Crank Disc (r = 27.5 mm = 0.275 dm)
    const crankGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.12, 32);
    this.crankDisc = new THREE.Mesh(crankGeo, MAT_316SS_BRUSHED);
    this.crankDisc.name = "Pivot_CrankDisc";
    this.crankDisc.position.set(0, 4.20, -0.15);
    this.crankDisc.rotation.x = Math.PI / 2;
    this.driveGroup.add(this.crankDisc);
    this.animNodes.crankDisc = this.crankDisc;

    // Eccentric Crank Pin (offset r = 0.275 dm)
    const pinGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.18, 16);
    const crankPin = new THREE.Mesh(pinGeo, MAT_BRASS_FITTING);
    crankPin.name = "Pivot_Pin_EccentricCrank";
    crankPin.position.set(0.275, 0.08, 0);
    this.crankDisc.add(crankPin);

    // M1: 24V Brushless Planetary Gearmotor behind Crank Disc
    const motorGroup = new THREE.Group();
    motorGroup.name = "Body_Motor_HarmonicStepper";
    motorGroup.position.set(0, 4.20, 0.28);
    this.driveGroup.add(motorGroup);

    // Planetary reduction gearbox stage (1:45)
    const gearboxMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.32, 24),
      MAT_316SS_BRUSHED
    );
    gearboxMesh.name = "Body_Gearbox_Planetary";
    gearboxMesh.rotation.x = Math.PI / 2;
    gearboxMesh.position.z = -0.20;
    motorGroup.add(gearboxMesh);

    // Finned BLDC stator body
    const statorMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 0.52, 24),
      MAT_CHASSIS_DARK
    );
    statorMesh.rotation.x = Math.PI / 2;
    statorMesh.position.z = 0.22;
    motorGroup.add(statorMesh);

    // Copper stator winding end-turns visible through inspection window
    const coilRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.05, 12, 24),
      MAT_COPPER_COIL
    );
    coilRing.position.z = 0.05;
    motorGroup.add(coilRing);

    const m1Lbl = makeSilkscreenPlacard("M1: HARMONIC DRIVE", "24V BLDC · 30.0 CPM", 0.54, 0.17, "#0f172a", "#38bdf8");
    m1Lbl.position.set(0, 0.44, -0.10);
    motorGroup.add(m1Lbl);

    // S3: 1024-PPR Quadrature Optical Rotary Encoder on rear of M1
    const encoderGroup = new THREE.Group();
    encoderGroup.name = "Body_Sensor_OpticalEncoder";
    encoderGroup.position.set(0, 4.20, 0.85);
    this.driveGroup.add(encoderGroup);

    const encCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.22, 24),
      MAT_ALUM_ANODIZED
    );
    encCap.rotation.x = Math.PI / 2;
    encoderGroup.add(encCap);

    const encLbl = makeSilkscreenPlacard("S3: 1024-PPR ENCODER", "CLOSED-LOOP RPM", 0.48, 0.15, "#0f172a", "#22c55e");
    encLbl.position.set(0, -0.36, -0.20);
    encoderGroup.add(encLbl);

    // S2: Slotted Optical TDC/BDC Stroke Tachometer beside Crank Disc
    const tachoGroup = new THREE.Group();
    tachoGroup.name = "Body_Sensor_HallTachometer";
    tachoGroup.position.set(-0.56, 4.20, -0.15);
    this.driveGroup.add(tachoGroup);

    const tachoBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.28, 0.18),
      MAT_IC_PACKAGE
    );
    tachoGroup.add(tachoBody);

    const tachoLbl = makeSilkscreenPlacard("S2: TDC OPTIC SENSOR", "STROKE COUNTER", 0.46, 0.15, "#0f172a", "#06b6d4");
    tachoLbl.position.set(-0.15, -0.28, -0.12);
    tachoGroup.add(tachoLbl);

    // S4 & S5: Upper & Lower Basket-Lift Limit Microswitches on Right Guide Column
    for (const [tag, yPos, subTxt] of [
      ["Top", 5.88, "UPPER PARK LIMIT"],
      ["Btm", 3.65, "LOWER STROKE LIMIT"]
    ]) {
      const limGroup = new THREE.Group();
      limGroup.name = `Body_Sensor_LimitSwitch_${tag}`;
      limGroup.position.set(0.92, yPos, -0.10);
      this.driveGroup.add(limGroup);

      const swBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.24, 0.12),
        makeMat(0xdc2626, { r: 0.4 })
      );
      limGroup.add(swBox);

      const rollerArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.03, 0.04),
        MAT_316SS_ELECTROPOLISHED
      );
      rollerArm.position.set(-0.10, 0.08, 0);
      rollerArm.rotation.z = 0.35;
      limGroup.add(rollerArm);

      const sNum = tag === "Top" ? "S4: LIMIT SW TOP" : "S5: LIMIT SW BTM";
      const limLbl = makeSilkscreenPlacard(sNum, subTxt, 0.42, 0.14, "#0f172a", "#f43f5e");
      limLbl.position.set(0.25, 0, -0.10);
      limGroup.add(limLbl);
    }

    // Connecting Rod
    const rodGeo = new THREE.BoxGeometry(0.12, 1.25, 0.08);
    this.connectingRod = new THREE.Mesh(rodGeo, MAT_ALUM_ANODIZED);
    this.connectingRod.name = "Pivot_ConnectingRod";
    this.connectingRod.position.set(0, 4.85, -0.25);
    this.driveGroup.add(this.connectingRod);
    this.animNodes.connectingRod = this.connectingRod;

    // Bronze Crosshead Slider Block
    const crossGeo = new THREE.BoxGeometry(1.85, 0.28, 0.32);
    this.crosshead = new THREE.Mesh(crossGeo, MAT_BRASS_FITTING);
    this.crosshead.name = "Pivot_Crosshead_Slider";
    this.crosshead.position.set(0, 5.55, 0);
    this.driveGroup.add(this.crosshead);
    this.animNodes.crosshead = this.crosshead;

    // Rigid Oscillating Horizontal Drive Head Arm (Body_DriveHead)
    this.driveHead = new THREE.Group();
    this.driveHead.name = "Body_DriveHead";
    this.driveHead.position.set(0, 5.60, -0.85);
    this.scene.add(this.driveHead);
    this.animNodes.driveHead = this.driveHead;

    const barGeo = new THREE.BoxGeometry(3.40, 0.40, 0.90);
    const barMesh = new THREE.Mesh(barGeo, MAT_DRIVE_HEAD);
    barMesh.castShadow = true;
    this.driveHead.add(barMesh);

    // Quick-Release Knurled Basket Collets (Station 1 & 2)
    const beakerCenters = [-0.825, 0.825];
    for (let stn = 0; stn < 2; stn++) {
      const colletGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.35, 24);
      const collet = new THREE.Mesh(colletGeo, MAT_316SS_BRUSHED);
      collet.name = `Knob_Collet_QuickRelease_0${stn + 1}`;
      collet.position.set(beakerCenters[stn], -0.25, 0);
      this.driveHead.add(collet);
    }
  }

  // --------------------------------------------------------------------------
  // Dual USP Apparatus A Basket Assemblies & 6-Tube Racks
  // --------------------------------------------------------------------------
  buildApparatusBaskets() {
    const beakerCenters = [-0.825, 0.825];

    for (let stn = 0; stn < 2; stn++) {
      const basketGroup = new THREE.Group();
      basketGroup.name = `Pivot_BasketArm_${stn === 0 ? 'Left' : 'Right'}`;
      basketGroup.position.set(beakerCenters[stn], 0, 0);
      this.driveHead.add(basketGroup);
      this.animNodes.baskets.push(basketGroup);

      // Central Stainless Suspension Rod (dia 6 mm x 320 mm L)
      const rodGeo = new THREE.CylinderGeometry(0.03, 0.03, 3.20, 16);
      const rod = new THREE.Mesh(rodGeo, MAT_316SS_ELECTROPOLISHED);
      rod.name = `Pivot_Rod_Suspension_0${stn + 1}`;
      rod.position.y = -1.60;
      basketGroup.add(rod);

      // Basket Assembly Frame at bottom of rod
      const basketFrame = new THREE.Group();
      basketFrame.name = `Pivot_Basket_Assembly_0${stn + 1}`;
      basketFrame.position.y = -3.20;
      basketGroup.add(basketFrame);

      // Upper & Lower PMMA Holding Plates (dia 90 mm = 0.90 dm)
      const plateGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.06, 32);
      const topPlate = new THREE.Mesh(plateGeo, MAT_BATH_ACRYLIC);
      topPlate.name = `Glass_Basket_Plate_Top_0${stn + 1}`;
      topPlate.position.y = 0.775;
      basketFrame.add(topPlate);

      const btmPlate = new THREE.Mesh(plateGeo, MAT_BATH_ACRYLIC);
      btmPlate.name = `Glass_Basket_Plate_Btm_0${stn + 1}`;
      btmPlate.position.y = 0;
      basketFrame.add(btmPlate);

      // 10-Mesh Type 316 Stainless Steel Woven Wire Cloth Bottom
      const meshGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.015, 32);
      const meshScreen = new THREE.Mesh(meshGeo, MAT_316SS_ELECTROPOLISHED);
      meshScreen.name = `Body_Mesh_Screen_0${stn + 1}`;
      meshScreen.position.y = -0.01;
      basketFrame.add(meshScreen);

      // 3 Vertical Stainless Steel Tie Rods with Knurled Cap Nuts
      for (let i = 0; i < 3; i++) {
        const ang = (i * 2 * Math.PI) / 3;
        const tx = Math.cos(ang) * 0.40;
        const tz = Math.sin(ang) * 0.40;

        const tieGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.85, 12);
        const tie = new THREE.Mesh(tieGeo, MAT_316SS_BRUSHED);
        tie.position.set(tx, 0.3875, tz);
        basketFrame.add(tie);

        const nutGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.05, 16);
        const nut = new THREE.Mesh(nutGeo, MAT_BRASS_FITTING);
        nut.name = `Fastener_Nut_Knurled_M3_${stn + 1}_0${i + 1}`;
        nut.position.set(tx, 0.80, tz);
        basketFrame.add(nut);
      }

      // 6 Vertical Transparent Acrylic Tubes (USP Apparatus A: 77.5 mm L x 21.5 mm ID)
      for (let i = 0; i < 6; i++) {
        const ang = (i * 2 * Math.PI) / 6;
        const tx = Math.cos(ang) * 0.27;
        const tz = Math.sin(ang) * 0.27;

        const tubeGeo = new THREE.CylinderGeometry(0.1275, 0.1275, 0.775, 24, 1, true);
        const tube = new THREE.Mesh(tubeGeo, MAT_BATH_ACRYLIC);
        tube.name = `Glass_Tube_Acrylic_${stn + 1}_0${i + 1}`;
        tube.position.set(tx, 0.3875, tz);
        basketFrame.add(tube);

        // USP Fluted Guide Disk
        const diskGeo = new THREE.CylinderGeometry(0.1035, 0.1035, 0.095, 20);
        const disk = new THREE.Mesh(diskGeo, MAT_BATH_ACRYLIC);
        disk.name = `Glass_Disk_Fluted_${stn + 1}_0${i + 1}`;
        disk.position.set(tx, 0.20, tz);
        basketFrame.add(disk);

        // Dosage Form Tablet Sample (Aspirin IR)
        const tabGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 20);
        const tabMesh = new THREE.Mesh(tabGeo, MAT_TABLET_WHITE);
        tabMesh.name = `Body_Tablet_Sample_${stn + 1}_0${i + 1}`;
        tabMesh.position.set(tx, 0.05, tz);
        basketFrame.add(tabMesh);
        this.animNodes.tablets.push(tabMesh);
      }
    }
  }

  // --------------------------------------------------------------------------
  // Operator Console, UI_LCD Display & Tactile Buttons
  // --------------------------------------------------------------------------
  buildOperatorConsole() {
    this.consoleGroup = new THREE.Group();
    this.consoleGroup.name = "Body_Console_Operator";
    this.consoleGroup.position.set(0.35, 1.40, -2.01);
    this.scene.add(this.consoleGroup);

    const bezelGeo = new THREE.BoxGeometry(2.50, 1.48, 0.06);
    const bezel = new THREE.Mesh(bezelGeo, MAT_CONSOLE_BEZEL);
    this.consoleGroup.add(bezel);

    const lcdW = 1.68, lcdH = 0.84;
    this.lcdCanvas = document.createElement("canvas");
    this.lcdCanvas.width = 1024;
    this.lcdCanvas.height = 512;
    this.lcdCtx = this.lcdCanvas.getContext("2d");

    this.lcdTexture = new THREE.CanvasTexture(this.lcdCanvas);
    this.lcdTexture.colorSpace = THREE.SRGBColorSpace;
    this.lcdTexture.flipY = false;

    const lcdGeo = makeOperatorFacingQuadGeo(lcdW, lcdH);
    this.lcdMesh = new THREE.Mesh(
      lcdGeo,
      new THREE.MeshBasicMaterial({ map: this.lcdTexture, side: THREE.DoubleSide })
    );
    this.lcdMesh.name = "UI_LCD";
    this.lcdMesh.position.set(0, 0.22, -0.035);
    this.consoleGroup.add(this.lcdMesh);

    const lensGeo = new THREE.BoxGeometry(lcdW + 0.04, lcdH + 0.04, 0.015);
    const lens = new THREE.Mesh(lensGeo, MAT_BEAKER_BOROSILICATE);
    lens.name = "Glass_LCDLens";
    lens.position.set(0, 0.22, -0.045);
    this.consoleGroup.add(lens);

    const btnConfigs = [
      { name: "Btn_Start", label: "START", color: 0x16a34a, x: -0.84 },
      { name: "Btn_Stop",  label: "STOP",  color: 0xdc2626, x: -0.42 },
      { name: "Btn_Temp",  label: "TEMP",  color: 0xea580c, x:  0.00 },
      { name: "Btn_Time",  label: "TIME",  color: 0x2563eb, x:  0.42 },
      { name: "Btn_Lift",  label: "LIFT",  color: 0x64748b, x:  0.84 }
    ];

    this.buttons = [];
    for (const b of btnConfigs) {
      const btn = makeTactileButton(b.name, b.label, b.color, 0.26, 0.17);
      btn.position.set(b.x, -0.44, -0.035);
      this.consoleGroup.add(btn);
      this.buttons.push(btn);
    }

    this.renderLCD();
  }

  // --------------------------------------------------------------------------
  // Populated Lower Electronics Bay: Power Supply, Power Routing, Pump, Optics,
  // Data Chips, Wireless (Wi-Fi / Bluetooth BLE 5.2) & Rear Bulkhead I/O Ports
  // --------------------------------------------------------------------------
  buildElectronicsBay() {
    this.electronicsGroup = new THREE.Group();
    this.electronicsGroup.name = "Body_Bay_Electronics";
    this.electronicsGroup.position.set(0, 0.40, 0.50);
    this.scene.add(this.electronicsGroup);

    // ========================================================================
    // 1. MAIN CONTROLLER MOTHERBOARD & DATA/STORAGE/WIRELESS ARCHITECTURE
    // ========================================================================
    const pcbW = 2.50, pcbD = 1.95;
    const pcbGeo = new THREE.BoxGeometry(pcbW, 0.035, pcbD);

    // High-DPI Procedural PCB Trace & Silkscreen Texture
    const pcbCanvas = document.createElement("canvas");
    pcbCanvas.width = 1024; pcbCanvas.height = 1024;
    const pctx = pcbCanvas.getContext("2d");
    pctx.fillStyle = "#064e3b";
    pctx.fillRect(0, 0, 1024, 1024);
    pctx.strokeStyle = "#10b981";
    pctx.lineWidth = 3;
    for (let i = 60; i < 960; i += 36) {
      pctx.beginPath();
      pctx.moveTo(80, i);
      pctx.lineTo(500, i);
      pctx.lineTo(560, i + 24);
      pctx.lineTo(940, i + 24);
      pctx.stroke();
    }
    pctx.strokeStyle = "#fbbf24";
    pctx.lineWidth = 6;
    pctx.strokeRect(20, 20, 984, 984);
    const pcbTex = new THREE.CanvasTexture(pcbCanvas);
    pcbTex.colorSpace = THREE.SRGBColorSpace;

    const pcb = new THREE.Mesh(
      pcbGeo,
      new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.42, metalness: 0.18 })
    );
    pcb.name = "Body_PCB_Motherboard";
    pcb.position.set(-0.45, 0.16, -0.05);
    this.electronicsGroup.add(pcb);

    // 4 Brass Standoffs with M3 Screws
    for (const [sx, sz] of [[-1.60, -0.92], [0.70, -0.92], [-1.60, 0.82], [0.70, 0.82]]) {
      const sc = makeHexSocketBolt(0.015, 0.05, "Fastener_HexM3_PCB");
      sc.position.set(sx, 0.19, sz);
      this.electronicsGroup.add(sc);
    }

    // U1: 32-Bit ARM Cortex-M4F Microcontroller IC (Body_Part_MCU_Core)
    const mcuGroup = new THREE.Group();
    mcuGroup.name = "Body_Part_MCU_Core";
    mcuGroup.position.set(-0.95, 0.20, -0.35);
    this.electronicsGroup.add(mcuGroup);

    const mcuPkg = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.045, 0.42), MAT_IC_PACKAGE);
    mcuGroup.add(mcuPkg);
    // Silver QFP Gull-Wing Pin Frame
    const mcuPins = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.018, 0.48), MAT_CHROME_STEEL);
    mcuPins.position.y = -0.01;
    mcuGroup.add(mcuPins);
    const mcuLbl = makeSilkscreenPlacard("U1: ARM CORTEX-M4", "168MHz MCU CORE", 0.42, 0.15, "#111827", "#38bdf8");
    mcuLbl.position.y = 0.12;
    mcuGroup.add(mcuLbl);

    // U2: 64MB High-Speed SDRAM IC (Body_Part_RAM_Chip)
    const sramGroup = new THREE.Group();
    sramGroup.name = "Body_Part_RAM_Chip";
    sramGroup.position.set(-0.40, 0.20, -0.42);
    this.electronicsGroup.add(sramGroup);

    const sramPkg = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.44), MAT_IC_PACKAGE);
    sramGroup.add(sramPkg);
    const sramLbl = makeSilkscreenPlacard("U2: 64MB SDRAM", "TELEMETRY BUFFER", 0.38, 0.14, "#111827", "#a855f7");
    sramLbl.position.y = 0.12;
    sramGroup.add(sramLbl);

    // U3: 16GB eMMC NAND Flash Solid-State Storage (Body_Part_SSD_Module)
    const ssdGroup = new THREE.Group();
    ssdGroup.name = "Body_Part_SSD_Module";
    ssdGroup.position.set(0.18, 0.20, -0.42);
    this.electronicsGroup.add(ssdGroup);

    const ssdPkg = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.045, 0.36), MAT_IC_PACKAGE);
    ssdGroup.add(ssdPkg);
    const ssdLbl = makeSilkscreenPlacard("U3: 16GB eMMC SSD", "21 CFR 11 AUDIT LOG", 0.44, 0.15, "#111827", "#22c55e");
    ssdLbl.position.y = 0.12;
    ssdGroup.add(ssdLbl);

    // U4: 24-Bit Delta-Sigma Precision ADC (Body_Part_ADC_24Bit)
    const adcGroup = new THREE.Group();
    adcGroup.name = "Body_Part_ADC_24Bit";
    adcGroup.position.set(-0.40, 0.20, 0.18);
    this.electronicsGroup.add(adcGroup);

    const adcPkg = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.30), MAT_IC_PACKAGE);
    adcGroup.add(adcPkg);
    const adcLbl = makeSilkscreenPlacard("U4: 24-BIT ADC", "PT100 & IR OPTICS", 0.38, 0.14, "#111827", "#06b6d4");
    adcLbl.position.y = 0.12;
    adcGroup.add(adcLbl);

    // BT1: CR2032 Lithium Coin-Cell Battery Socket for Non-Volatile RTC Clock
    const rtcGroup = new THREE.Group();
    rtcGroup.name = "Body_Part_RTC_BatterySocket";
    rtcGroup.position.set(0.22, 0.20, 0.18);
    this.electronicsGroup.add(rtcGroup);

    const rtcHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 24), MAT_CHASSIS_DARK);
    rtcGroup.add(rtcHolder);
    const cr2032 = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.035, 24), MAT_316SS_ELECTROPOLISHED);
    cr2032.position.y = 0.02;
    rtcGroup.add(cr2032);
    const rtcLbl = makeSilkscreenPlacard("BT1: CR2032 RTC", "GLP CLOCK BACKUP", 0.38, 0.14, "#111827", "#eab308");
    rtcLbl.position.set(0, 0.12, 0);
    rtcGroup.add(rtcLbl);

    // U5: Shielded Wi-Fi 802.11ac + Bluetooth Low Energy (BLE 5.2) Radio Module
    const wifiGroup = new THREE.Group();
    wifiGroup.name = "Body_Part_WiFi_BLE_Module";
    wifiGroup.position.set(-1.18, 0.21, 0.28);
    this.electronicsGroup.add(wifiGroup);

    const rfShield = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.44), MAT_316SS_ELECTROPOLISHED);
    wifiGroup.add(rfShield);
    const wifiLbl = makeSilkscreenPlacard("WIFI 802.11ac + BLE 5.2", "WIRELESS LIMS TELEMETRY", 0.52, 0.16, "#0f172a", "#38bdf8");
    wifiLbl.position.y = 0.13;
    wifiGroup.add(wifiLbl);

    // Blue Wireless Link Status LED on PCB
    const bleLed = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.04, 12),
      makeMat(0x38bdf8, { e: 0x38bdf8, ei: 1.5 })
    );
    bleLed.name = "Body_LED_Wireless_Link";
    bleLed.position.set(-0.86, 0.21, 0.28);
    this.electronicsGroup.add(bleLed);

    // 3x Stepper/BLDC Motor Driver Heatsink Modules on PCB Rear Edge (M1, M2, M3 Drivers)
    for (let d = 0; d < 3; d++) {
      const drv = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.12, 0.24),
        makeMat(0x0284c7, { r: 0.25, m: 0.75 })
      );
      drv.name = `Body_Driver_Stepper_0${d + 1}`;
      drv.position.set(-0.70 + d * 0.36, 0.23, 0.65);
      this.electronicsGroup.add(drv);
    }

    // ========================================================================
    // 2. POWER SUPPLY, TOROIDAL TRANSFORMER, EMI FILTER & SSR HEATSINK
    // ========================================================================
    // Mean Well Enclosed 24VDC 150W Switching Power Supply (Body_Assembly_PowerSupply)
    const psuGroup = new THREE.Group();
    psuGroup.name = "Body_Assembly_PowerSupply";
    psuGroup.position.set(1.30, 0.38, -0.05);
    this.electronicsGroup.add(psuGroup);

    const psuCage = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.46, 1.50), MAT_ALUM_ANODIZED);
    psuGroup.add(psuCage);

    // Top Silkscreen Nameplate on PSU
    const psuPlate = makeSilkscreenPlacard(
      "PSU: 24VDC 150W",
      "AC 115/230V -> +24V / +5V / 3.3V",
      0.76, 0.20, "#0f172a", "#22c55e"
    );
    psuPlate.position.set(0, 0.35, -0.45);
    psuGroup.add(psuPlate);

    // Dual Electrolytic Filter Capacitors inside PSU
    for (let c = 0; c < 2; c++) {
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.38, 20),
        makeMat(0x1e3a8a, { r: 0.3, m: 0.4 })
      );
      cap.name = `Body_Cap_Filter_0${c + 1}`;
      cap.position.set(-0.22 + c * 0.26, 0.08, 0.35);
      psuGroup.add(cap);
    }

    // Yellow High-Frequency Chopper Transformer inside PSU
    const chopper = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.34, 0.32),
      makeMat(0xeab308, { r: 0.35, m: 0.2 })
    );
    chopper.name = "Body_Coil_PSU_Chopper";
    chopper.position.set(0, 0.08, -0.15);
    psuGroup.add(chopper);

    // 7-Screw Phenolic Terminal Barrier Block at Front of PSU (L, N, PE, -V, -V, +V, +V)
    const barrier = new THREE.Mesh(
      new THREE.BoxGeometry(0.84, 0.18, 0.18),
      MAT_CHASSIS_DARK
    );
    barrier.name = "Body_Terminal_PSU_Barrier";
    barrier.position.set(0, -0.06, -0.80);
    psuGroup.add(barrier);

    for (let s = 0; s < 7; s++) {
      const termScrew = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.032, 0.05, 12),
        MAT_CHROME_STEEL
      );
      termScrew.position.set(-0.33 + s * 0.11, 0.04, -0.80);
      psuGroup.add(termScrew);
    }

    // Green DC-OK Power LED & Orange Voltage Trim Potentiometer on PSU
    const psuLed = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12),
      makeMat(0x22c55e, { e: 0x22c55e, ei: 1.8 })
    );
    psuLed.name = "Body_LED_PSU_Active";
    psuLed.position.set(0.36, 0.06, -0.78);
    psuGroup.add(psuLed);

    const trimPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.05, 12),
      makeMat(0xea580c, { r: 0.4 })
    );
    trimPot.name = "Knob_PSU_VoltageTrim";
    trimPot.position.set(0.24, 0.06, -0.78);
    psuGroup.add(trimPot);

    // Toroidal Power Step-Down Isolation Transformer (Body_Part_ToroidalTransformer)
    const toroidGroup = new THREE.Group();
    toroidGroup.name = "Body_Part_ToroidalTransformer";
    toroidGroup.position.set(0.32, 0.34, 1.02);
    this.electronicsGroup.add(toroidGroup);

    const torGeo = new THREE.TorusGeometry(0.32, 0.13, 18, 36);
    const tor = new THREE.Mesh(torGeo, MAT_COPPER_COIL);
    tor.rotation.x = Math.PI / 2;
    toroidGroup.add(tor);

    const torCoreCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.28, 24),
      MAT_316SS_BRUSHED
    );
    toroidGroup.add(torCoreCap);

    const torLbl = makeSilkscreenPlacard("TOROIDAL XFMR", "180VA ISOLATION", 0.46, 0.16, "#0f172a", "#f59e0b");
    torLbl.position.y = 0.24;
    toroidGroup.add(torLbl);

    // Schaffner Shielded AC Mains EMI/RFI Line Filter behind IEC Inlet
    const emiGroup = new THREE.Group();
    emiGroup.name = "Body_Filter_EMI_Mains";
    emiGroup.position.set(1.15, 0.32, 1.18);
    this.electronicsGroup.add(emiGroup);

    const emiBox = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.28, 0.42), MAT_316SS_BRUSHED);
    emiGroup.add(emiBox);
    const emiLbl = makeSilkscreenPlacard("EMI/RFI FILTER", "115/230VAC 10A", 0.42, 0.15, "#0f172a", "#38bdf8");
    emiLbl.position.y = 0.24;
    emiGroup.add(emiLbl);

    // Protective Earth (PE) Brass Chassis Ground Lug
    const gndLug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.08, 6),
      MAT_BRASS_FITTING
    );
    gndLug.name = "Body_Lug_ChassisGround";
    gndLug.position.set(1.65, 0.18, 1.15);
    this.electronicsGroup.add(gndLug);

    const gndBolt = makeHexSocketBolt(0.02, 0.06, "Fastener_HexM4_GroundLug");
    gndBolt.position.set(1.65, 0.24, 1.15);
    this.electronicsGroup.add(gndBolt);

    // Crydom 25A Zero-Cross Solid-State Relay on Finned Extruded Heatsink
    const hsGeo = new THREE.BoxGeometry(0.58, 0.26, 0.46);
    const hs = new THREE.Mesh(hsGeo, MAT_CHASSIS_DARK);
    hs.name = "Body_Heatsink_SSR";
    hs.position.set(-0.55, 0.28, 1.08);
    this.electronicsGroup.add(hs);

    const ssrGeo = new THREE.BoxGeometry(0.46, 0.18, 0.36);
    const ssr = new THREE.Mesh(ssrGeo, makeMat(0xd97706, { r: 0.3 }));
    ssr.name = "Body_Relay_SSR_Heater";
    ssr.position.set(-0.55, 0.48, 1.08);
    this.electronicsGroup.add(ssr);

    const ssrLbl = makeSilkscreenPlacard("SSR: 25A HEATER", "PID ZERO-CROSS", 0.44, 0.15, "#0f172a", "#ea580c");
    ssrLbl.position.set(-0.55, 0.66, 1.08);
    this.electronicsGroup.add(ssrLbl);

    // Central Power Distribution Terminal Bus Block (+24V / +5V / GND / AC)
    const busBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.16, 0.28),
      makeMat(0x1e3a8a, { r: 0.4 })
    );
    busBlock.name = "Body_Terminal_PowerBus";
    busBlock.position.set(0.48, 0.22, -0.65);
    this.electronicsGroup.add(busBlock);

    const busLbl = makeSilkscreenPlacard("DC POWER BUS", "+24V / +5V / GND", 0.46, 0.15, "#0f172a", "#ef4444");
    busLbl.position.set(0.48, 0.38, -0.65);
    this.electronicsGroup.add(busLbl);

    // ========================================================================
    // 3. M4: MAGNETIC-DRIVE BATH CIRCULATION PUMP & SILICONE PLUMBING
    // ========================================================================
    const pumpGroup = new THREE.Group();
    pumpGroup.name = "Body_Motor_BathPump";
    pumpGroup.position.set(-1.45, 0.38, -0.82);
    this.electronicsGroup.add(pumpGroup);

    const pumpMotor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.48, 24),
      MAT_CHASSIS_DARK
    );
    pumpMotor.rotation.z = Math.PI / 2;
    pumpGroup.add(pumpMotor);

    const pumpVolute = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.20, 24),
      MAT_316SS_BRUSHED
    );
    pumpVolute.name = "Body_Pump_Volute_PPS";
    pumpVolute.rotation.z = Math.PI / 2;
    pumpVolute.position.x = 0.32;
    pumpGroup.add(pumpVolute);

    const pumpLbl = makeSilkscreenPlacard("M4: BATH PUMP", "24V MAG-DRIVE 4.2L/M", 0.50, 0.16, "#0f172a", "#38bdf8");
    pumpLbl.position.set(0.08, 0.34, 0);
    pumpGroup.add(pumpLbl);

    // Braided Silicone Supply & Return Hoses to Water Bath
    const supplyHose = makeWiringHarness([
      [-1.13, 0.42, -0.82],
      [-1.05, 0.95, -0.95],
      [-1.35, 1.65, -1.10],
      [-1.55, 2.15, -1.15]
    ], 0.038, MAT_SILICONE_HOSE, "Body_Tube_Silicone_Flow");
    this.electronicsGroup.add(supplyHose);

    const returnHose = makeWiringHarness([
      [-1.13, 0.28, -0.82],
      [-0.85, 0.85, -1.05],
      [ 1.35, 1.55, -1.10],
      [ 1.55, 2.15, -1.15]
    ], 0.038, MAT_SILICONE_HOSE, "Body_Tube_Silicone_Return");
    this.electronicsGroup.add(returnHose);

    // ========================================================================
    // 4. S7 & S8: IR LASER DISINTEGRATION SENSORS & 45° GOLD OPTICAL MIRRORS
    // ========================================================================
    const stationOffsets = [-0.825, 0.825];
    for (let stn = 0; stn < 2; stn++) {
      const sx = stationOffsets[stn];
      const idx = stn + 1;

      // IR Laser Emitter & Photodiode Receiver Transceiver Module
      const laserMod = new THREE.Group();
      laserMod.name = `Body_Sensor_LaserDisintegration_0${idx}`;
      laserMod.position.set(sx, 1.52, -0.52);
      this.electronicsGroup.add(laserMod);

      const laserBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.16, 0.26),
        MAT_IC_PACKAGE
      );
      laserMod.add(laserBox);

      const lensRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.06, 16),
        MAT_GOLD_PIN
      );
      lensRing.rotation.x = Math.PI / 2;
      lensRing.position.z = -0.14;
      laserMod.add(laserRing => lensRing);
      laserMod.add(lensRing);

      const lasLbl = makeSilkscreenPlacard(
        `S${6 + idx}: IR LASER OPTIC`,
        `STN ${idx} ENDPOINT SENSOR`,
        0.44, 0.14, "#0f172a", "#ef4444"
      );
      lasLbl.position.set(0, -0.16, -0.14);
      laserMod.add(lasLbl);

      // 45°-Angled First-Surface Gold Optical Relay Mirror directly beneath Beaker
      const mirrorBracket = new THREE.Group();
      mirrorBracket.name = `Body_Bracket_MirrorGimbal_0${idx}`;
      mirrorBracket.position.set(sx, 1.52, -1.35);
      this.electronicsGroup.add(mirrorBracket);

      const gimbalBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.06, 0.36),
        MAT_ALUM_ANODIZED
      );
      gimbalBase.position.y = -0.12;
      mirrorBracket.add(gimbalBase);

      // 45° Gold-Coated Optical Relay Mirror Plate
      const mirrorPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.34, 0.025),
        MAT_GOLD_MIRROR
      );
      mirrorPlate.name = `Glass_Mirror_OpticalRelay_0${idx}`;
      mirrorPlate.rotation.x = Math.PI / 4; // 45-degree optical bounce angle
      mirrorBracket.add(mirrorPlate);

      const mirLbl = makeSilkscreenPlacard(
        `45° GOLD MIRROR ${idx}`,
        "OPTICAL RELAY",
        0.38, 0.13, "#0f172a", "#facc15"
      );
      mirLbl.position.set(0, -0.22, -0.20);
      mirrorBracket.add(mirLbl);

      // Collimated IR Inspection Beam (Horizontal from Laser -> 45° Mirror -> Vertical up into Beaker/Basket)
      const beamPath = makeWiringHarness([
        [sx, 1.52, -0.65],
        [sx, 1.52, -1.35],
        [sx, 2.35, -1.35]
      ], 0.014, MAT_LASER_BEAM, `Glass_Beam_OpticalInspection_0${idx}`);
      this.electronicsGroup.add(beamPath);
    }

    // ========================================================================
    // 5. M5: 80mm CONVECTIVE COOLING BLOWER FAN WITH SPINNING IMPELLER
    // ========================================================================
    const fanGroup = new THREE.Group();
    fanGroup.name = "Body_Fan_CabinetCooling_Blower";
    fanGroup.position.set(1.92, 0.80, 0.40);
    this.electronicsGroup.add(fanGroup);

    const fanFrame = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.80, 0.80), MAT_CHASSIS_DARK);
    fanGroup.add(fanFrame);

    // Spinning Impeller Hub & 7 Sculpted Blades
    const impeller = new THREE.Group();
    impeller.name = "Pivot_Fan_ImpellerBlades";
    fanGroup.add(impeller);
    this.animNodes.fanBlades = impeller;

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.22, 20), MAT_IC_PACKAGE);
    hub.rotation.z = Math.PI / 2;
    impeller.add(hub);

    for (let b = 0; b < 7; b++) {
      const ang = (b * 2 * Math.PI) / 7;
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.22, 0.10),
        MAT_ALUM_ANODIZED
      );
      blade.position.set(0, Math.cos(ang) * 0.24, Math.sin(ang) * 0.24);
      blade.rotation.x = ang + 0.45;
      impeller.add(blade);
    }

    const grilleGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.02, 24);
    const grille = new THREE.Mesh(grilleGeo, MAT_316SS_BRUSHED);
    grille.name = "Body_Grille_Wire_Fan";
    grille.position.set(0.14, 0, 0);
    grille.rotation.z = Math.PI / 2;
    fanGroup.add(grille);

    const fanLbl = makeSilkscreenPlacard("M5: COOLING FAN", "80mm 24V BRUSHLESS", 0.46, 0.15, "#0f172a", "#38bdf8");
    fanLbl.rotation.y = -Math.PI / 2;
    fanLbl.position.set(-0.14, 0.50, 0);
    fanGroup.add(fanLbl);

    // ========================================================================
    // 6. REAR I/O BULKHEAD DATA PORTS, EXTERNAL ANTENNA & MAINS SWITCH
    // ========================================================================
    // External 2.4 GHz / 5 GHz Articulated Dipole Antenna (Wi-Fi / Bluetooth BLE 5.2)
    const antGroup = new THREE.Group();
    antGroup.name = "Body_Antenna_WiFi_BLE";
    antGroup.position.set(-1.55, 0.90, 1.54);
    this.electronicsGroup.add(antGroup);

    const smaNut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.12, 6),
      MAT_GOLD_PIN
    );
    smaNut.rotation.x = Math.PI / 2;
    antGroup.add(smaNut);

    const antWhip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.05, 0.95, 16),
      MAT_CHASSIS_DARK
    );
    antWhip.position.set(0, 0.45, 0.08);
    antGroup.add(antWhip);

    const antLbl = makeSilkscreenPlacard("WIFI / BLE 5.2", "2.4GHz ANTENNA", 0.40, 0.14, "#0f172a", "#38bdf8");
    antLbl.position.set(0, -0.22, 0.02);
    antGroup.add(antLbl);

    // RS-232 DB-9 Serial Port (LIMS / GLP Printer)
    const db9Group = new THREE.Group();
    db9Group.name = "Body_Port_RS232";
    db9Group.position.set(-1.02, 0.80, 1.52);
    this.electronicsGroup.add(db9Group);

    const db9Plate = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.08), MAT_316SS_BRUSHED);
    db9Group.add(db9Plate);
    const db9Core = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.09, 0.11), makeMat(0x1d4ed8));
    db9Group.add(db9Core);
    const db9Lbl = makeSilkscreenPlacard("RS-232 DB9", "SERIAL PRINTER", 0.36, 0.13, "#0f172a", "#cbd5e1");
    db9Lbl.position.set(0, 0.20, 0.02);
    db9Group.add(db9Lbl);

    // USB Type-B Isolated PC Data Port
    const usbGroup = new THREE.Group();
    usbGroup.name = "Body_Port_USB";
    usbGroup.position.set(-0.56, 0.80, 1.52);
    this.electronicsGroup.add(usbGroup);

    const usbShell = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.10), MAT_316SS_BRUSHED);
    usbGroup.add(usbShell);
    const usbLbl = makeSilkscreenPlacard("USB-B 2.0", "PC / WEBUSB", 0.34, 0.13, "#0f172a", "#cbd5e1");
    usbLbl.position.set(0, -0.20, 0.02);
    usbGroup.add(usbLbl);

    // USB Type-A Host Port with Inserted 32GB Industrial USB Flash Drive
    const usbHostGroup = new THREE.Group();
    usbHostGroup.name = "Body_Port_USB_Host_Flash";
    usbHostGroup.position.set(-0.15, 0.80, 1.52);
    this.electronicsGroup.add(usbHostGroup);

    const hostSlot = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.12, 0.08), MAT_316SS_BRUSHED);
    usbHostGroup.add(hostSlot);

    const flashStick = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.08, 0.38),
      makeMat(0x0284c7, { r: 0.25, m: 0.65 })
    );
    flashStick.name = "Body_Part_USB_Drive";
    flashStick.position.z = 0.18;
    usbHostGroup.add(flashStick);

    const flashLbl = makeSilkscreenPlacard("USB-A FLASH", "32GB CSV EXPORT", 0.36, 0.13, "#0f172a", "#38bdf8");
    flashLbl.position.set(0, 0.20, 0.02);
    usbHostGroup.add(flashLbl);

    // RJ45 Gigabit Ethernet LAN Jack (LIMS / OPC-UA Network)
    const lanGroup = new THREE.Group();
    lanGroup.name = "Body_Port_RJ45_LAN";
    lanGroup.position.set(0.30, 0.80, 1.52);
    this.electronicsGroup.add(lanGroup);

    const lanJack = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.20, 0.12), MAT_316SS_BRUSHED);
    lanGroup.add(lanJack);
    const lanLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.03, 0.13),
      makeMat(0x22c55e, { e: 0x22c55e, ei: 1.5 })
    );
    lanLed.position.set(-0.06, 0.06, 0);
    lanGroup.add(lanLed);
    const lanLbl = makeSilkscreenPlacard("RJ45 LAN", "1000BASE-T LIMS", 0.36, 0.13, "#0f172a", "#22c55e");
    lanLbl.position.set(0, -0.20, 0.02);
    lanGroup.add(lanLbl);

    // IEC C14 Power Entry Module + Illuminated Red DPST Mains Rocker Switch
    const iecGeo = new THREE.BoxGeometry(0.36, 0.26, 0.14);
    const iec = new THREE.Mesh(iecGeo, MAT_CHASSIS_DARK);
    iec.name = "Body_Inlet_Power_IEC";
    iec.position.set(1.00, 0.80, 1.51);
    this.electronicsGroup.add(iec);

    const rockerSwitch = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.24, 0.10),
      makeMat(0xdc2626, { e: 0xdc2626, ei: 0.9 })
    );
    rockerSwitch.name = "Btn_Power_MainsRocker";
    rockerSwitch.position.set(1.32, 0.80, 1.53);
    this.electronicsGroup.add(rockerSwitch);

    const acLbl = makeSilkscreenPlacard("115/230V AC IN", "IEC C14 + BREAKER", 0.44, 0.14, "#0f172a", "#ef4444");
    acLbl.position.set(1.15, 1.06, 1.53);
    this.electronicsGroup.add(acLbl);

    // ========================================================================
    // 7. COMPLETE END-TO-END COLOR-CODED 3D POWER & DATA WIRING HARNESSES
    // ========================================================================
    // (A) Green/Yellow Protective Earth (PE): IEC Inlet -> Ground Lug -> PSU FG -> Chassis
    this.electronicsGroup.add(makeWiringHarness([
      [1.00, 0.72, 1.44],
      [1.45, 0.45, 1.32],
      [1.65, 0.20, 1.15],
      [1.52, 0.25, 0.35],
      [1.12, 0.32, -0.82]
    ], 0.022, MAT_WIRE_PE_GRNYLW, "Body_Wire_PE_Ground"));

    // (B) Brown AC Mains Line Hot (L): IEC Inlet -> EMI Filter -> PSU L & Toroid & SSR Line
    this.electronicsGroup.add(makeWiringHarness([
      [1.05, 0.80, 1.44],
      [1.15, 0.38, 1.18],
      [1.05, 0.32, 0.75],
      [0.97, 0.32, -0.82]
    ], 0.024, MAT_WIRE_AC_BROWN, "Body_Wire_ACMains_Line"));

    // Branch AC Hot to Toroid & SSR Heater Relay
    this.electronicsGroup.add(makeWiringHarness([
      [1.15, 0.35, 1.12],
      [0.45, 0.30, 1.08],
      [-0.55, 0.45, 1.08]
    ], 0.022, MAT_WIRE_AC_BROWN, "Body_Wire_ACMains_SSRBranch"));

    // (C) Blue AC Neutral (N): IEC Inlet -> EMI Filter -> PSU N & Toroid
    this.electronicsGroup.add(makeWiringHarness([
      [0.95, 0.80, 1.44],
      [1.08, 0.34, 1.18],
      [1.02, 0.28, 0.65],
      [1.08, 0.32, -0.82]
    ], 0.024, MAT_WIRE_AC_BLUE, "Body_Wire_ACMains_Neutral"));

    // (D) Orange High-Current Switched Heater Feed: SSR Output -> Immersion Heater Coil
    this.electronicsGroup.add(makeWiringHarness([
      [-0.55, 0.48, 0.92],
      [-0.75, 0.35, 0.20],
      [-0.95, 0.65, -0.65],
      [-1.20, 1.95, -0.85]
    ], 0.026, MAT_WIRE_HEATER, "Body_Wire_SSR_HeaterFeed"));

    // (E) Red +24V DC Primary Output Bus: PSU (+V) -> DC Power Bus -> Motherboard & Pump & Fan
    this.electronicsGroup.add(makeWiringHarness([
      [1.52, 0.32, -0.82],
      [1.15, 0.25, -0.88],
      [0.48, 0.25, -0.65],
      [0.10, 0.22, -0.55]
    ], 0.025, MAT_WIRE_DC_RED, "Body_Wire_24VDC_MainBus"));

    // Black DC Return (GND) Bus: PSU (-V) -> DC Power Bus -> Motherboard
    this.electronicsGroup.add(makeWiringHarness([
      [1.35, 0.32, -0.82],
      [0.98, 0.22, -0.84],
      [0.48, 0.20, -0.65],
      [0.10, 0.19, -0.48]
    ], 0.025, MAT_WIRE_DC_BLACK, "Body_Wire_24VDC_GroundBus"));

    // +24V DC Feed to Bath Pump (M4) and Cooling Fan (M5)
    this.electronicsGroup.add(makeWiringHarness([
      [0.48, 0.24, -0.65],
      [-0.45, 0.22, -0.85],
      [-1.35, 0.35, -0.82]
    ], 0.020, MAT_WIRE_DC_RED, "Body_Wire_24VDC_PumpFeed"));

    this.electronicsGroup.add(makeWiringHarness([
      [0.48, 0.24, -0.65],
      [1.45, 0.25, -0.20],
      [1.88, 0.75, 0.40]
    ], 0.020, MAT_WIRE_DC_RED, "Body_Wire_24VDC_FanFeed"));

    // (F) Vertical Tower Motor Harness: PCB Stepper Drivers -> M1 Harmonic Motor & M2/M3 Lift Motors
    this.electronicsGroup.add(makeWiringHarness([
      [-0.35, 0.24, 0.65],
      [-0.20, 1.10, 0.60],
      [-0.15, 2.35, 0.55],
      [ 0.00, 3.75, 0.68]
    ], 0.028, MAT_WIRE_DC_RED, "Body_Wire_24VDC_MotorHarness"));

    // (G) Cyan Shielded Sensor Harness: Tower Sensors & PT100 Probe -> 24-Bit ADC on Motherboard
    this.electronicsGroup.add(makeWiringHarness([
      [-0.40, 0.22, 0.18],
      [-0.10, 1.25, -0.10],
      [ 0.00, 2.85, -0.12]
    ], 0.020, MAT_WIRE_SENSOR, "Body_Wire_Sensor_PT100"));

    // (H) Gold U.FL Micro-Coax Pigtail: Wi-Fi/BLE Module -> External Rear Dipole Antenna
    this.electronicsGroup.add(makeWiringHarness([
      [-1.18, 0.24, 0.42],
      [-1.42, 0.45, 0.95],
      [-1.55, 0.88, 1.48]
    ], 0.016, MAT_GOLD_PIN, "Body_Cable_Coax_UFL"));

    // (I) Flat Multi-Conductor IDC Ribbon Cables: Motherboard -> Front Console & Rear Data Ports
    this.electronicsGroup.add(makeWiringHarness([
      [-0.65, 0.20, -0.82],
      [-0.20, 0.45, -1.45],
      [ 0.25, 0.95, -2.35]
    ], 0.032, MAT_RIBBON_GREY, "Body_Cable_Ribbon_Console"));

    this.electronicsGroup.add(makeWiringHarness([
      [-0.55, 0.20, 0.72],
      [-0.55, 0.52, 1.15],
      [-0.55, 0.78, 1.46]
    ], 0.032, MAT_RIBBON_GREY, "Body_Cable_Ribbon_IO"));
  }

  // --------------------------------------------------------------------------
  // Physical Circuit Continuity: Duplex Box, NEMA Plug & SJTOW Cord
  // --------------------------------------------------------------------------
  buildPowerContinuity() {
    this.powerGroup = new THREE.Group();
    this.powerGroup.name = "Body_Circuit_PowerContinuity";
    this.scene.add(this.powerGroup);

    // Bench Duplex Receptacle Box (Power_Receptacle_Duplex) at Y = 0 on Bench
    const boxGeo = new THREE.BoxGeometry(0.70, 1.15, 0.50);
    const matBox = makeMat(0xd1d5db, { r: 0.35, m: 0.65 });
    const outletBox = new THREE.Mesh(boxGeo, matBox);
    outletBox.name = "Body_Power_Receptacle_Duplex";
    outletBox.position.set(2.80, 1.15 / 2, 0.80);
    outletBox.castShadow = true;
    this.powerGroup.add(outletBox);

    // Receptacle Ivory Faceplate
    const faceGeo = new THREE.BoxGeometry(0.60, 1.05, 0.04);
    const matFace = makeMat(0xfef3c7, { r: 0.55, m: 0.05 });
    const face = new THREE.Mesh(faceGeo, matFace);
    face.position.set(2.80, 1.15 / 2, 0.80 - 0.25 - 0.02);
    this.powerGroup.add(face);

    // Molded NEMA 5-15P AC Plug (Power_Plug_NEMA)
    const plugGeo = new THREE.BoxGeometry(0.30, 0.35, 0.45);
    this.plugMesh = new THREE.Mesh(plugGeo, MAT_RUBBER_NBR);
    this.plugMesh.name = "Body_Power_Plug_NEMA";
    this.plugMesh.position.set(2.80, 0.70, 0.80 - 0.25 - 0.25);
    this.powerGroup.add(this.plugMesh);

    this.updatePowerCord();
  }

  updatePowerCord() {
    if (this.cordMesh) {
      this.powerGroup.remove(this.cordMesh);
      this.cordMesh.geometry.dispose();
    }

    const start = new THREE.Vector3(1.00, 1.20, 2.01);
    const end = this.isPluggedIn
      ? new THREE.Vector3(2.80, 0.70, 0.40)
      : new THREE.Vector3(2.60, 0.08, 0.00);

    const mid1 = new THREE.Vector3(1.60, 0.15, 1.60);
    const mid2 = new THREE.Vector3(2.20, 0.12, 0.80);

    const curve = new THREE.CatmullRomCurve3([start, mid1, mid2, end]);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 12, false);
    this.cordMesh = new THREE.Mesh(tubeGeo, MAT_CORD_BLACK);
    this.cordMesh.name = "Body_Power_Cord_SJTOW";
    this.cordMesh.castShadow = true;
    this.powerGroup.add(this.cordMesh);

    if (this.plugMesh) {
      if (this.isPluggedIn) {
        this.plugMesh.position.set(2.80, 0.70, 0.80 - 0.25 - 0.22);
        this.plugMesh.rotation.set(0, 0, 0);
      } else {
        this.plugMesh.position.set(2.60, 0.15, 0.00);
        this.plugMesh.rotation.set(0, Math.PI / 4, Math.PI / 2);
      }
    }
  }

  // --------------------------------------------------------------------------
  // Kinematic Exploded View Target Registration
  // --------------------------------------------------------------------------
  setupExplodedViewTargets() {
    this.explodeTargets = [
      { obj: this.driveHead, offset: new THREE.Vector3(0, 2.20, -0.40) },
      { obj: this.bathGroup, offset: new THREE.Vector3(0, 0.90, -1.60) },
      { obj: this.enclosureShell, offset: new THREE.Vector3(0, 1.85, 0.40) },
      { obj: this.consoleGroup, offset: new THREE.Vector3(0, 0.40, -1.40) }
    ];
  }

  setExploded(factor) {
    this.targetExplodeFactor = Math.max(0.0, Math.min(1.0, factor));
    this.explodeFactor = this.targetExplodeFactor;
    for (const item of this.explodeTargets) {
      if (item.obj) {
        if (item.obj.userData.basePos === undefined) {
          item.obj.userData.basePos = item.obj.position.clone();
        }
        item.obj.position.x = item.obj.userData.basePos.x + item.offset.x * this.explodeFactor;
        item.obj.position.y = item.obj.userData.basePos.y + item.offset.y * this.explodeFactor;
        item.obj.position.z = item.obj.userData.basePos.z + item.offset.z * this.explodeFactor;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Dynamic LCD Canvas Rendering (flipY = false, upright)
  // --------------------------------------------------------------------------
  renderLCD() {
    if (!this.lcdCtx) return;
    const ctx = this.lcdCtx;
    const w = 1024, h = 512;

    const hasPower = this.isPluggedIn && this.powerSwitchOn;
    if (!hasPower) {
      ctx.fillStyle = "#030508";
      ctx.fillRect(0, 0, w, h);
      this.lcdTexture.needsUpdate = true;
      return;
    }

    ctx.fillStyle = "#0c1420";
    ctx.fillRect(0, 0, w, h);

    // Header bar
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, w, 70);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 30px system-ui,sans-serif";
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.fillText("ERWEKA ZT 322 · USP <701> · WIFI / BLE 5.2", 26, 35);

    ctx.textAlign = "right";
    ctx.fillStyle = this.oscillationActive ? "#22c55e" : "#e2e8f0";
    ctx.fillText(this.state, w - 26, 35);

    // Main telemetry grid
    const liveCPM = this.oscillationActive ? this.cpm : 0.0;
    const liveTemp = this.bathTempC ?? 21.5;
    const stn1 = this.station1Intact ?? 6;
    const stn2 = this.station2Intact ?? 6;
    const timeStr = this.remainingTimeStr ?? "15:00";

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 74px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${liveCPM.toFixed(1)} CPM`, w * 0.28, 170);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "28px system-ui,sans-serif";
    ctx.fillText("STROKE RATE (55.0 mm)", w * 0.28, 230);

    ctx.fillStyle = this.heaterActive ? "#ea580c" : "#38bdf8";
    ctx.font = "bold 74px monospace";
    ctx.fillText(`${liveTemp.toFixed(1)} °C`, w * 0.72, 170);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "28px system-ui,sans-serif";
    ctx.fillText("BATH TEMP (PT100 PID)", w * 0.72, 230);

    // Divider
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 275); ctx.lineTo(w - 40, 275);
    ctx.stroke();

    // Bottom station status
    ctx.textAlign = "left";
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "30px system-ui,sans-serif";
    ctx.fillText(`STN 1: ${stn1}/6 INTACT (IR LASER)`, 40, 340);
    ctx.fillText(`STN 2: ${stn2}/6 INTACT (IR LASER)`, 40, 400);

    ctx.textAlign = "right";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`TIME: ${timeStr} | SSD LOG: OK`, w - 40, 340);
    ctx.fillStyle = "#22c55e";
    ctx.fillText("LAN / BLE 5.2 / USB: ONLINE", w - 40, 400);

    // Footer bar
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, h - 45, w, 45);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "22px system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SREdesigns Accredited Virtual Instrumentation Framework", w / 2, h - 22);

    this.lcdTexture.needsUpdate = true;
  }

  // --------------------------------------------------------------------------
  // Animation & Kinematics Frame Update
  // --------------------------------------------------------------------------
  animate() {
    requestAnimationFrame(this.animate);

    // Exploded view interpolation
    if (Math.abs(this.explodeFactor - this.targetExplodeFactor) > 0.001) {
      this.explodeFactor += (this.targetExplodeFactor - this.explodeFactor) * 0.1;
      for (const item of this.explodeTargets) {
        if (item.obj) {
          if (item.obj.userData.basePos === undefined) {
            item.obj.userData.basePos = item.obj.position.clone();
          }
          item.obj.position.x = item.obj.userData.basePos.x + item.offset.x * this.explodeFactor;
          item.obj.position.y = item.obj.userData.basePos.y + item.offset.y * this.explodeFactor;
          item.obj.position.z = item.obj.userData.basePos.z + item.offset.z * this.explodeFactor;
        }
      }
    }

    // Smooth Basket Lift Elevation (LIFT button: 0.0 lowered, +1.10 raised above beakers)
    this.currentLift = this.currentLift ?? 0.0;
    this.currentLift += ((this.targetElevation || 0.0) - this.currentLift) * 0.15;

    // Update tablet disintegration visibility/scale per station
    if (this.animNodes.tablets && this.animNodes.tablets.length === 12) {
      const s1 = this.station1Intact ?? 6;
      const s2 = this.station2Intact ?? 6;
      for (let i = 0; i < 6; i++) {
        this.animNodes.tablets[i].visible = (i < s1);
        this.animNodes.tablets[6 + i].visible = (i < s2);
      }
    }

    const hasPower = this.isPluggedIn && this.powerSwitchOn;

    // Spin 80mm cooling fan blades when powered
    if (hasPower && this.animNodes.fanBlades) {
      this.animNodes.fanBlades.rotation.x += 0.18;
    }

    // Immersion heater thermal glow when active
    if (this.heaterCoilMesh) {
      this.heaterCoilMesh.material.emissive.setHex(hasPower && this.heaterActive ? 0xea580c : 0x000000);
      this.heaterCoilMesh.material.emissiveIntensity = hasPower && this.heaterActive ? 0.65 : 0.0;
    }

    // Kinematic Harmonic Stroke (Pure Sinusoidal Oscillation at 30 cpm)
    if (hasPower && this.oscillationActive) {
      const dt = 0.016;
      const dTheta = 2.0 * Math.PI * (this.cpm / 60.0) * dt;
      this.crankAngle = (this.crankAngle + dTheta) % (Math.PI * 2);

      // Amplitude 27.5 mm = 0.275 dm (peak-to-peak 55.0 mm)
      this.basketElevation = 0.275 * Math.sin(this.crankAngle);

      if (this.animNodes.crankDisc) {
        this.animNodes.crankDisc.rotation.y = this.crankAngle;
      }

      for (const fluid of this.animNodes.beakerFluids) {
        fluid.position.y = 1.12 / 2 + 0.04 + Math.sin(this.crankAngle * 2) * 0.015;
      }
    } else {
      this.basketElevation = 0.0;
    }

    if (this.animNodes.driveHead) {
      const baseY = this.animNodes.driveHead.userData.basePos
        ? this.animNodes.driveHead.userData.basePos.y
        : 5.60;
      const expY = this.explodeFactor * 2.20;
      this.animNodes.driveHead.position.y = baseY + expY + this.currentLift + this.basketElevation;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }
}
