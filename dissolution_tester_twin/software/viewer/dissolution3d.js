/**
 * Agilent 708-DS USP Tablet Dissolution Workstation (Digital Twin 3D Engine)
 * Centrifuge Gold Standard Procedural CAD & Kinematic Assembly
 *
 * Exhaustive Procedural Detail (Centrifuge Gold Standard):
 *  1. Lower Chassis & Enclosure:
 *     - Hollow structural unibody casting with bottom floor, front/side/rear walls, stamped louvers
 *     - Official SREdesigns Brand Certification Badge (`Badge_SREdesigns`) mounted on the LOWER FRAME
 *     - Rear I/O Panel: RS-232 DB9 serial port, USB-B peripheral port, RJ45 Ethernet jack, 4-pin Aux trigger port,
 *       IEC C14 power inlet with dual fuse drawer & rocker switch, brass M5 chassis ground stud with star washer
 *     - 4× M10 threaded leveling feet with vulcanized NBR rubber suction pads resting at datum Y=0.0
 *  2. Internal Base Mechanics & Electronics:
 *     - 12 kg cast iron ballast plate fastened with 4× M8 hex bolts and spring washers
 *     - Elevator 24V DC worm-gear reduction motor (case, worm gearbox, steel worm, bronze wheel)
 *     - Flexible spider jaw coupling connecting motor to center precision Acme ball lead screw (dia 18 mm, 4 TPI)
 *     - Dual heavy-duty angular contact thrust ball bearing pillow blocks (top & bottom)
 *     - Full Main Controller Motherboard (`PCB_Motherboard`):
 *       * 32-bit ARM Cortex-M7 / DSP processor (silkscreen markings, pin 1 dot)
 *       * High-speed Synchronous RAM IC chip (`Part_RAM_Chip`)
 *       * Solid-State Flash Storage module (`Part_SSD_Module`)
 *       * Finned extruded aluminum heatsink with thermal compound clip
 *       * Switching power supply section: toroidal power transformer, bridge rectifier, 3× low-ESR filter capacitors, inductor choke, regulators
 *       * 60mm brushless DC cooling fan with radial blades and wire finger guard grille
 *       * Screw terminal barrier strips, shrouded ribbon cable headers with locking clips, color-coded wiring harness
 *  3. Motorized Elevator Mechanism & Cable Drag Chain:
 *     - Twin precision-ground chrome guide shafts (dia 25.4 mm x 7.5 length)
 *     - Dual recirculating linear ball bushing pillow blocks
 *     - Heavy-duty flanged bronze traveling nut fastened with 4× M5 socket cap screws to head carriage yoke
 *     - Upper and lower optical slotted interrupter limit switches
 *     - Flexible nylon cable drag chain (e-chain / caterpillar carrier) routing shielded cables from base to moving head
 *     - Molded rubber strain relief boots and cable grommets at entry ports
 *  4. Motorized Drive Head Assembly (`Pivot_DriveHead`):
 *     - Structural aluminum baseplate casting with 8 flanged bearing bosses
 *     - Detachable upper inspection hood plate (`Head_TopHood`) fastened with 10× M4 knurled socket head cap screws
 *     - Front control console: carved recessed pocket for dynamic LCD quad (`UI_LCD`), anti-reflective lens,
 *       and 4 high-end tactile instrument buttons with dedicated printed labels and status LEDs:
 *       `[ ▲ ELEV UP ]`, `[ ▼ ELEV DOWN ]`, `[ ▶ STIR RUN ]`, `[ ⏹ STOP TRAY ]`
 *     - Internal Synchronous Mechanics: 24V brushless motor (stator core, 8 copper coils, rotor fan),
 *       continuous cogged timing belt, 8 machined aluminum pulleys with real teeth, idlers, 120-slot optical encoder, head MCU
 *  5. 8 USP Apparatus 2 Spindles & Paddles:
 *     - 8 quick-lock collets with knurled release sleeves and detents
 *     - Precision ground mirror electropolished 316SS shafts (dia 9.5 mm) with laser-etched 25mm immersion lines
 *     - Electropolished 316SS paddle blades (74.5 x 19.0 x 4.0 mm) with high specular silver luster
 *  6. Molded Optical Acrylic Water Bath & TruCenter System:
 *     - Hollow 5-wall optical acrylic tank (12mm base, 10mm walls)
 *     - Heated bath water (37.0°C) with thermal ripples
 *     - 316SS circulation diffuser manifold with 4 directional discharge jet nozzles
 *     - Top cover plate with 8 precision vessel apertures
 *     - 8 TruCenter anodized vessel collar rings with dual locating dowels and laser numerals 1..8
 *     - 8 precision 1000 mL borosilicate glass vessels with hemispherical bottoms and ceramic graduations
 *     - 8 dissolution media volumes with dynamic parabolic meniscus and central vortex
 *     - 8 biconvex 10mg Prednisone tablets undergoing real-time Noyes-Whitney ODE erosion
 *  7. External AutoTemp 1150W Heater / Circulator (`Part_HeaterCirculatorAutoTemp`):
 *     - Two-tone enclosure with molded carry handle and rubber grip
 *     - Recessed front console with high-DPI upright digital LED display (actual 37.0°C in green, setpoint 37.0°C in amber)
 *     - FULL INTERNAL WORKING PARTS:
 *       * Shaded-pole 120V pump motor, brass volute chamber, and 6-blade centrifugal impeller
 *       * 1150W tubular Nichrome heating element inside 316SS flow-through chamber with dual bimetal thermal cutoff switches
 *       * Solid-state TRIAC heater power controller on aluminum heatsink plate
 *       * Circulator control PCB with step-down transformer, microprocessor, relay, and 40mm cooling fan
 *       * Brass quick-disconnect shutoff valves with internal check valve springs
 *       * Reinforced blue silicone hoses with genuine 3D stainless steel worm-drive hose clamps
 *  8. Lab Environment & Physical Electrical Continuity:
 *     - Black epoxy resin lab bench (`INSTRUMENT_BENCH`) at datum Y=0 with brushed stainless steel front edge trim
 *     - Bench duplex outlet box (`Power_Receptacle_Duplex`) with NEMA 5-15P plug, brass prongs, and SJTOW cord
 *     - Logical power state bound to electrical continuity (unplugging cuts all power to 0)
 */

import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Material Generators & PBR Palette (High-Luster Specular Silver & True IOR)
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

// High-Luster Electropolished Stainless Steels (Specular Silver Pop from all angles)
const MAT_316SS_ELECTROPOLISHED = makeMat(0xf8fafc, { r: 0.14, m: 0.88 }); // Spindles & paddle blades
const MAT_316SS_MIRROR          = MAT_316SS_ELECTROPOLISHED;
const MAT_316SS_BRUSHED         = makeMat(0xd8e0e8, { r: 0.24, m: 0.82 }); // Collets, fittings, trim
const MAT_ALUM_ANODIZED         = makeMat(0xcbd5e1, { r: 0.28, m: 0.78 }); // Pulleys, TruCenter rings, carriage
const MAT_CHROME_STEEL          = makeMat(0xf1f5f9, { r: 0.16, m: 0.88 }); // Guide shafts, lead screw, fasteners
const MAT_CAST_IRON             = makeMat(0x334155, { r: 0.72, m: 0.38 }); // 12 kg base ballast plate
const MAT_COPPER_COIL           = makeMat(0xca8a04, { r: 0.25, m: 0.85 }); // Motor windings & transformer
const MAT_BRASS_FITTING         = makeMat(0xd97706, { r: 0.22, m: 0.82 }); // Quick-disconnect valves, bronze lead nut
const MAT_GOLD_PIN              = makeMat(0xfbbf24, { r: 0.15, m: 0.90 }); // DB9, USB, RJ45 gold pins

// Polymers, Elastomers & FR-4
const MAT_RUBBER_NBR    = makeMat(0x18181b, { r: 0.85, m: 0.05 }); // Leveling pads, grommets, boots
const MAT_TIMING_BELT   = makeMat(0x111827, { r: 0.90, m: 0.04 }); // Cogged timing belt
const MAT_NYLON_DRAG    = makeMat(0x1f2937, { r: 0.65, m: 0.05 }); // Flexible cable drag chain links
const MAT_SILICONE_HOSE = makeMat(0x0284c7, { r: 0.45, m: 0.05, o: 0.82 }); // Translucent blue circulator hose
const MAT_CORD_BLACK    = makeMat(0x0a0f1d, { r: 0.75, m: 0.05 }); // 3-conductor SJTOW power cord
const MAT_PCB_FR4       = makeMat(0x15803d, { r: 0.50, m: 0.12 }); // Green solder-mask motherboard
const MAT_IC_PACKAGE    = makeMat(0x1e293b, { r: 0.35, m: 0.08 }); // Silicon IC chips (CPU, RAM, SSD)
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

  const outerRace = new THREE.Mesh(
    new THREE.CylinderGeometry(outerR, outerR, width, 24, 1, true),
    MAT_CHROME_STEEL
  );
  g.add(outerRace);

  const innerRace = new THREE.Mesh(
    new THREE.CylinderGeometry(innerR, innerR, width, 24, 1, true),
    MAT_CHROME_STEEL
  );
  g.add(innerRace);

  const seal = new THREE.Mesh(
    new THREE.RingGeometry(innerR + 0.01, outerR - 0.01, 24),
    MAT_CHASSIS_DARK
  );
  seal.rotation.x = Math.PI / 2;
  seal.position.y = width / 2;
  g.add(seal);

  const ballR = (outerR - innerR) * 0.35;
  const pitchR = (outerR + innerR) / 2;
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(ballR, 12, 12), MAT_CHROME_STEEL);
    ball.position.set(Math.cos(ang) * pitchR, 0, Math.sin(ang) * pitchR);
    g.add(ball);
  }

  return g;
}

function makeThrustBearing(outerR = 0.22, innerR = 0.10, height = 0.12) {
  const g = new THREE.Group();
  g.name = 'Fastener_ThrustBearing';

  // Lower Grooved Washer / Race
  const wLower = new THREE.Mesh(new THREE.CylinderGeometry(outerR, outerR, height * 0.35, 24), MAT_CHROME_STEEL);
  wLower.position.y = -height * 0.32;
  g.add(wLower);

  // Upper Grooved Washer / Race
  const wUpper = new THREE.Mesh(new THREE.CylinderGeometry(outerR, outerR, height * 0.35, 24), MAT_CHROME_STEEL);
  wUpper.position.y = height * 0.32;
  g.add(wUpper);

  // Brass ball cage with 10 thrust balls
  const cage = new THREE.Mesh(new THREE.RingGeometry(innerR + 0.02, outerR - 0.02, 24), MAT_BRASS_FITTING);
  cage.rotation.x = Math.PI / 2;
  g.add(cage);

  const pitchR = (outerR + innerR) / 2;
  const ballR = height * 0.24;
  for (let i = 0; i < 10; i++) {
    const ang = (i / 10) * Math.PI * 2;
    const b = new THREE.Mesh(new THREE.SphereGeometry(ballR, 10, 10), MAT_CHROME_STEEL);
    b.position.set(Math.cos(ang) * pitchR, 0, Math.sin(ang) * pitchR);
    g.add(b);
  }

  return g;
}

function makeHoseClamp(diameter = 0.14, width = 0.04) {
  const g = new THREE.Group();
  g.name = 'Fastener_WormGearHoseClamp';

  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(diameter, diameter, width, 20, 1, true),
    MAT_316SS_BRUSHED
  );
  g.add(band);

  const housing = new THREE.Mesh(
    new THREE.BoxGeometry(width * 1.4, width * 1.2, width * 1.8),
    MAT_316SS_BRUSHED
  );
  housing.position.set(diameter + width * 0.4, 0, 0);
  g.add(housing);

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

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 32),
    MAT_ALUM_ANODIZED
  );
  g.add(body);

  const flangeGeo = new THREE.CylinderGeometry(radius * 1.15, radius * 1.15, height * 0.12, 32);
  const fTop = new THREE.Mesh(flangeGeo, MAT_ALUM_ANODIZED);
  fTop.position.y = height * 0.45;
  g.add(fTop);

  const fBot = new THREE.Mesh(flangeGeo, MAT_ALUM_ANODIZED);
  fBot.position.y = -height * 0.45;
  g.add(fBot);

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

  const bore = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.35, radius * 0.35, height * 1.05, 16),
    MAT_CHASSIS_DARK
  );
  g.add(bore);

  return g;
}

function makeCableDragChain(length = 3.6, numLinks = 18) {
  const g = new THREE.Group();
  g.name = 'Assembly_CableDragChain';

  const linkL = length / numLinks;
  for (let i = 0; i < numLinks; i++) {
    const lMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.10, linkL * 0.95),
      MAT_NYLON_DRAG
    );
    lMesh.position.set(0, 0, (i - numLinks / 2) * linkL);
    g.add(lMesh);

    // Pivot pin
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.20, 8),
      MAT_CHASSIS_DARK
    );
    pin.rotation.z = Math.PI / 2;
    pin.position.set(0, 0, (i - numLinks / 2) * linkL + linkL * 0.45);
    g.add(pin);
  }

  return g;
}

function makeSREdesignsBadge() {
  const g = new THREE.Group();
  g.name = 'Badge_SREdesigns';

  // Brushed aluminum beveled backing plate
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(1.48, 0.44, 0.02),
    MAT_ALUM_ANODIZED
  );
  plate.castShadow = true;
  g.add(plate);

  // Brand canvas with high-DPI procedural vector silkscreen
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
    new THREE.PlaneGeometry(1.44, 0.40),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  face.position.z = 0.012;
  g.add(face);

  // Corner socket micro-screws
  [[-0.68, -0.17], [0.68, -0.17], [-0.68, 0.17], [0.68, 0.17]].forEach(([bx, by]) => {
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
      leadNut: null,
      dragChain: null,
      motherboard: null,
      circulatorPump: null,
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
      buttons: {},
      buttonLEDs: {}
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

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.40, 0.85),
      makeMat(0x64748b, { r: 0.35, m: 0.65 })
    );
    box.position.y = 0.20;
    box.castShadow = true;
    box.receiveShadow = true;
    this.duplexBoxGroup.add(box);

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

    for (let r = -1; r <= 1; r++) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.04), makeMat(0x27272a, { r: 0.9 }));
      rib.position.set(0, 0.21 + r * 0.08, 0.16);
      this.animGroups.powerPlug.add(rib);
    }

    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.24, 14), MAT_RUBBER_NBR);
    boot.position.y = 0.48;
    this.animGroups.powerPlug.add(boot);

    const pN = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.16, 0.07), MAT_BRASS_FITTING);
    pN.position.set(-0.06, -0.06, 0.0);
    this.animGroups.powerPlug.add(pN);

    const pH = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.16, 0.06), MAT_BRASS_FITTING);
    pH.position.set(0.06, -0.06, 0.0);
    this.animGroups.powerPlug.add(pH);

    const pG = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 12), MAT_316SS_BRUSHED);
    pG.position.set(0.0, -0.07, -0.09);
    this.animGroups.powerPlug.add(pG);

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

    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#090e17');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, w - 8, h - 8);

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

    // Primary Telemetry
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

    ctx.fillStyle = '#0b101b';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, w - 6, h - 6);

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

    // Rear Enclosure Wall
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

    // Official SREdesigns Brand Certification Badge MOVED TO LOWER FRAME (front right face)
    const badge = makeSREdesignsBadge();
    badge.position.set(1.95, 0.86, 2.96);
    this.chassisGroup.add(badge);

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

      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.08, 20), MAT_RUBBER_NBR);
      pad.position.y = 0.04;
      pad.castShadow = true;
      footGrp.add(pad);

      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.03, 20), MAT_316SS_BRUSHED);
      plate.position.y = 0.095;
      footGrp.add(plate);

      const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 16), MAT_CHROME_STEEL);
      stud.position.y = 0.16;
      footGrp.add(stud);

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

    // 4. Rear I/O Panel (Full Analytical Communications & Electrical Ports)
    const ioPanel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.65, 0.02), MAT_ALUM_ANODIZED);
    ioPanel.position.set(-1.4, 0.85, -2.96);
    this.chassisGroup.add(ioPanel);

    // RS-232 DB-9 Serial Communication Port
    const db9 = new THREE.Group();
    db9.name = 'Port_RS232_Serial';
    db9.position.set(-2.2, 0.95, -2.97);
    const dShell = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.03), MAT_316SS_BRUSHED);
    db9.add(dShell);
    [-0.14, 0.14].forEach(sx => {
      const standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.05, 6), MAT_CHROME_STEEL);
      standoff.rotation.x = Math.PI / 2;
      standoff.position.set(sx, 0, 0.02);
      db9.add(standoff);
    });
    // 9 gold contact pins
    for (let p = 0; p < 9; p++) {
      const px = -0.08 + (p % 5) * 0.04;
      const py = p < 5 ? 0.02 : -0.02;
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.02, 6), MAT_GOLD_PIN);
      pin.rotation.x = Math.PI / 2;
      pin.position.set(px, py, 0.01);
      db9.add(pin);
    }
    this.chassisGroup.add(db9);

    // USB Type-B Peripheral Port
    const usbB = new THREE.Group();
    usbB.name = 'Port_USB_B';
    usbB.position.set(-1.7, 0.95, -2.97);
    const uShell = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.04), MAT_316SS_BRUSHED);
    usbB.add(uShell);
    const uTongue = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.02), MAT_CHASSIS_DARK);
    uTongue.position.z = 0.01;
    usbB.add(uTongue);
    this.chassisGroup.add(usbB);

    // RJ45 8P8C Ethernet Port
    const rj45 = new THREE.Group();
    rj45.name = 'Port_RJ45_Ethernet';
    rj45.position.set(-1.25, 0.95, -2.97);
    const rShell = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.15, 0.05), MAT_316SS_BRUSHED);
    rj45.add(rShell);
    const rLedG = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.01), makeMat(0x10b981, { r: 0.2 }));
    rLedG.position.set(-0.05, 0.06, 0.026);
    rj45.add(rLedG);
    const rLedA = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.01), makeMat(0xf59e0b, { r: 0.2 }));
    rLedA.position.set(0.05, 0.06, 0.026);
    rj45.add(rLedA);
    this.chassisGroup.add(rj45);

    // 4-Pin Auxiliary / Autosampler Port
    const auxPort = new THREE.Group();
    auxPort.name = 'Port_Aux_Trigger';
    auxPort.position.set(-0.80, 0.95, -2.97);
    const aRing = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16), MAT_ALUM_ANODIZED);
    aRing.rotation.x = Math.PI / 2;
    auxPort.add(aRing);
    this.chassisGroup.add(auxPort);

    // Chassis Ground Stud with brass hex nut and star lock washer
    const gndStud = new THREE.Group();
    gndStud.name = 'Part_GroundStud';
    gndStud.position.set(-0.45, 0.95, -2.97);
    const gScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.08, 12), MAT_BRASS_FITTING);
    gScrew.rotation.x = Math.PI / 2;
    gndStud.add(gScrew);
    const gNut = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 6), MAT_BRASS_FITTING);
    gNut.rotation.x = Math.PI / 2;
    gNut.position.z = 0.03;
    gndStud.add(gNut);
    this.chassisGroup.add(gndStud);

    // Rear IEC Power Entry Module & Rocker Switch
    const pemBox = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.45, 0.04), MAT_CHASSIS_DARK);
    pemBox.position.set(-2.2, 0.60, -2.96);
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
    switchMesh.position.set(-2.2, 0.60, -2.98);
    switchMesh.name = 'Switch_Rocker';
    this.chassisGroup.add(switchMesh);
    this.animGroups.switchRocker = switchMesh;
    this.interactiveMeshes.push(switchMesh);

    // Rear Quick-Disconnect Water Bulkheads
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

    // 5. Internal Base Mechanics & Electronics (Inside Base Cavity, fully visible in exploded view!)
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

    // Elevator 24V DC Worm-Gear Reduction Motor in Base Center Rear
    const gearMotor = new THREE.Group();
    gearMotor.name = 'Part_ElevatorGearmotor';
    gearMotor.position.set(0, 0.65, -1.75);

    const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.55, 18), MAT_CHASSIS_DARK);
    gearMotor.add(motorBody);

    const wormBox = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.38, 0.52), MAT_ALUM_ANODIZED);
    wormBox.position.y = 0.35;
    gearMotor.add(wormBox);

    // Lower Angular Contact Thrust Bearing Pillow Block
    const thrustBrgLower = makeThrustBearing(0.22, 0.10, 0.14);
    thrustBrgLower.position.y = 0.60;
    gearMotor.add(thrustBrgLower);

    // Flexible spider jaw coupling connecting worm shaft to Acme lead screw
    const flexCoupling = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.22, 18), MAT_ALUM_ANODIZED);
    flexCoupling.position.y = 0.78;
    gearMotor.add(flexCoupling);

    // Motor mounting bracket with M6 socket screws
    const mBracket = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.06, 0.70), MAT_316SS_BRUSHED);
    mBracket.position.y = -0.28;
    gearMotor.add(mBracket);

    [[-0.26, -0.26], [0.26, -0.26], [-0.26, 0.26], [0.26, 0.26]].forEach(([gx, gz]) => {
      const sc = makeSocketHeadCapScrew(0.025, 0.05);
      sc.position.set(gx, -0.25, gz);
      gearMotor.add(sc);
    });

    this.chassisGroup.add(gearMotor);

    // 6. Complete Base Motherboard (`PCB_Motherboard`): CPU, RAM, SSD, switching PSU, fan, heatsink
    this.buildBaseMotherboard();

    this.mainGroup.add(this.chassisGroup);
  }

  buildBaseMotherboard() {
    this.mbGroup = new THREE.Group();
    this.mbGroup.name = 'PCB_Motherboard';
    this.mbGroup.position.set(-1.8, 0.54, 0.8);

    // Green FR-4 substrate (2.4 x 0.04 x 1.6)
    const board = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 1.6), MAT_PCB_FR4);
    this.mbGroup.add(board);

    // 6 Brass Standoffs with M3 pan-head screws
    [[-1.1, -0.7], [0, -0.7], [1.1, -0.7], [-1.1, 0.7], [0, 0.7], [1.1, 0.7]].forEach(([sx, sz]) => {
      const standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 6), MAT_BRASS_FITTING);
      standoff.position.set(sx, -0.06, sz);
      this.mbGroup.add(standoff);

      const screw = makeSlottedScrew(0.02, 0.02);
      screw.position.set(sx, 0.025, sz);
      this.mbGroup.add(screw);
    });

    // Main 32-bit ARM Cortex-M7 / DSP Processor (QFP-144)
    const cpu = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.38), MAT_IC_PACKAGE);
    cpu.position.set(-0.5, 0.035, 0.1);
    cpu.name = 'Part_CPU_Processor';
    this.mbGroup.add(cpu);

    // Pin 1 dot on CPU
    const pin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.005, 8), MAT_GOLD_PIN);
    pin1.position.set(-0.64, 0.052, -0.04);
    this.mbGroup.add(pin1);

    // High-speed Synchronous RAM IC chip (TSOP-54)
    const ram = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.025, 0.16), MAT_IC_PACKAGE);
    ram.position.set(-0.5, 0.035, 0.45);
    ram.name = 'Part_RAM_Chip';
    this.mbGroup.add(ram);

    // Solid-State Storage Flash Module (eMMC / NAND flash)
    const ssd = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.24), MAT_IC_PACKAGE);
    ssd.position.set(-0.1, 0.035, 0.45);
    ssd.name = 'Part_SSD_Module';
    this.mbGroup.add(ssd);

    // Crystal Oscillator (metal can HC-49)
    const crystal = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.06), MAT_316SS_BRUSHED);
    crystal.position.set(-0.8, 0.045, 0.1);
    this.mbGroup.add(crystal);

    // Finned Extruded Aluminum Heatsink over MOSFETs
    const hs = new THREE.Group();
    hs.name = 'Part_Heatsink_Extruded';
    hs.position.set(0.4, 0.02, -0.3);
    const hsBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.45), MAT_CHASSIS_DARK);
    hs.add(hsBase);
    for (let f = 0; f < 6; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.24, 0.45), MAT_CHASSIS_DARK);
      fin.position.set(-0.22 + f * 0.088, 0.14, 0);
      hs.add(fin);
    }
    this.mbGroup.add(hs);

    // 60mm Brushless DC Cooling Fan with protective finger guard grille
    const fan60 = new THREE.Group();
    fan60.name = 'Part_CoolingFan_60mm';
    fan60.position.set(0.4, 0.25, 0.4);
    const fanFrame = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.16, 0.60), MAT_CHASSIS_DARK);
    fan60.add(fanFrame);

    const fanBore = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.17, 24), MAT_CHASSIS_CREAM);
    fan60.add(fanBore);

    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 16), MAT_CHASSIS_DARK);
    fan60.add(fanHub);

    // 7 Curved Fan Blades
    for (let b = 0; b < 7; b++) {
      const ang = (b / 7) * Math.PI * 2;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.02), MAT_CHASSIS_DARK);
      blade.position.set(Math.cos(ang) * 0.18, 0, Math.sin(ang) * 0.18);
      blade.rotation.y = -ang + Math.PI / 4;
      fan60.add(blade);
    }
    // Wire finger guard grille
    const grille = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.26, 16), MAT_316SS_BRUSHED);
    grille.rotation.x = Math.PI / 2;
    grille.position.y = 0.085;
    fan60.add(grille);

    fan60.name = 'Fan_BaseMotherboard';
    this.mbGroup.add(fan60);

    // Power Section: Toroidal Transformer & Filter Capacitors
    const xformer = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.12, 12, 24), MAT_COPPER_COIL);
    xformer.name = 'Part_ToroidalTransformer';
    xformer.rotation.x = Math.PI / 2;
    xformer.position.set(0.6, 0.16, -0.3);
    this.mbGroup.add(xformer);

    for (let c = 0; c < 3; c++) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.28, 16), makeMat(0x1d4ed8, { r: 0.35 }));
      cap.position.set(-0.8 + c * 0.20, 0.16, -0.45);
      this.mbGroup.add(cap);
    }

    // Shrouded ribbon cable headers with locking clips
    [-0.2, 0.2].forEach(hx => {
      const hdr = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.10, 0.10), MAT_CHASSIS_DARK);
      hdr.position.set(hx, 0.07, -0.65);
      this.mbGroup.add(hdr);
    });

    this.chassisGroup.add(this.mbGroup);
    this.animGroups.motherboard = this.mbGroup;
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

    // Top Thrust Bearing Pillow Block
    const thrustTop = makeThrustBearing(0.20, 0.09, 0.12);
    thrustTop.position.set(0, 8.35, -1.75);
    this.elevatorGroup.add(thrustTop);

    // Flexible Nylon Cable Drag Chain (routing power and data from base to moving head)
    this.dragChain = makeCableDragChain(4.5, 22);
    this.dragChain.position.set(-1.4, 4.5, -1.75);
    this.dragChain.rotation.x = Math.PI / 2;
    this.elevatorGroup.add(this.dragChain);
    this.animGroups.dragChain = this.dragChain;

    // Optical Slotted Interrupter Limit Switches (Top & Bottom)
    const optoTop = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.10), MAT_CHASSIS_DARK);
    optoTop.position.set(1.4, 8.2, -1.75);
    optoTop.name = 'Sensor_LimitSwitch_Top';
    this.elevatorGroup.add(optoTop);

    const optoBot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.10), MAT_CHASSIS_DARK);
    optoBot.position.set(1.4, 1.8, -1.75);
    optoBot.name = 'Sensor_LimitSwitch_Bottom';
    this.elevatorGroup.add(optoBot);

    this.mainGroup.add(this.elevatorGroup);
    this.animGroups.elevatorColumns = this.elevatorGroup;
  }

  buildWaterBathAssembly() {
    this.bathGroup = new THREE.Group();
    this.bathGroup.name = 'Assembly_WaterBath';
    this.bathGroup.position.set(0, 1.40, 0.15); // Resting on base pan top

    const tankH = 2.40;
    const tankW = 5.80;
    const tankD = 4.40;
    const wallT = 0.10;

    this.bathTankMesh = new THREE.Group();
    this.bathTankMesh.name = 'Bath_Chamber';

    const bPlate = new THREE.Mesh(new THREE.BoxGeometry(tankW, wallT, tankD), MAT_BATH_ACRYLIC);
    bPlate.position.set(0, wallT / 2, 0);
    this.bathTankMesh.add(bPlate);

    const wFront = new THREE.Mesh(new THREE.BoxGeometry(tankW, tankH, wallT), MAT_BATH_ACRYLIC);
    wFront.position.set(0, tankH / 2, tankD / 2 - wallT / 2);
    this.bathTankMesh.add(wFront);

    const wBack = new THREE.Mesh(new THREE.BoxGeometry(tankW, tankH, wallT), MAT_BATH_ACRYLIC);
    wBack.position.set(0, tankH / 2, -tankD / 2 + wallT / 2);
    this.bathTankMesh.add(wBack);

    const wLeft = new THREE.Mesh(new THREE.BoxGeometry(wallT, tankH, tankD - wallT * 2), MAT_BATH_ACRYLIC);
    wLeft.position.set(-tankW / 2 + wallT / 2, tankH / 2, 0);
    this.bathTankMesh.add(wLeft);

    const wRight = new THREE.Mesh(new THREE.BoxGeometry(wallT, tankH, tankD - wallT * 2), MAT_BATH_ACRYLIC);
    wRight.position.set(tankW / 2 - wallT / 2, tankH / 2, 0);
    this.bathTankMesh.add(wRight);

    this.bathGroup.add(this.bathTankMesh);
    this.animGroups.bathTank = this.bathTankMesh;

    // Heated Water Bath Liquid Volume
    const waterGeo = new THREE.BoxGeometry(tankW - wallT * 2 - 0.04, 1.85, tankD - wallT * 2 - 0.04);
    this.bathWaterMesh = new THREE.Mesh(waterGeo, MAT_BATH_WATER);
    this.bathWaterMesh.position.set(0, 0.98, 0);
    this.bathWaterMesh.name = 'Bath_Water';
    this.bathGroup.add(this.bathWaterMesh);
    this.animGroups.bathWater = this.bathWaterMesh;

    // Top Cover Plate with 8 circular vessel apertures
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

    // 8-Position Vessel Layout
    const rowZ = [0.80, -0.80];
    const colX = [-1.80, -0.60, 0.60, 1.80];

    let vesselIdx = 0;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        vesselIdx++;
        const vx = colX[c];
        const vz = rowZ[r];

        // TruCenter Centering Collar Ring
        const ringGrp = new THREE.Group();
        ringGrp.name = `TruCenter_Ring_0${vesselIdx}`;
        ringGrp.position.set(vx, tankH + 0.06, vz);

        const ring = new THREE.Mesh(
          new THREE.CylinderGeometry(0.60, 0.60, 0.06, 32),
          MAT_ALUM_ANODIZED
        );
        ring.castShadow = true;
        ringGrp.add(ring);

        const pin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 8), MAT_316SS_BRUSHED);
        pin1.position.set(0.55, 0.04, 0);
        ringGrp.add(pin1);

        const pin2 = pin1.clone();
        pin2.position.set(-0.55, 0.04, 0);
        ringGrp.add(pin2);

        this.bathGroup.add(ringGrp);
        this.animGroups.truCenterRings.push(ringGrp);

        // Precision USP Borosilicate Glass Vessel (1000 mL, hemispherical bottom)
        const vGrp = new THREE.Group();
        vGrp.name = `Glass_Vessel_0${vesselIdx}`;
        vGrp.position.set(vx, 0, vz);

        const vCyl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.52, 0.52, 1.68, 32, 1, true),
          MAT_BORO_VESSEL
        );
        vCyl.position.set(0, 1.62, 0);
        vCyl.castShadow = true;
        vGrp.add(vCyl);

        const vHemi = new THREE.Mesh(
          new THREE.SphereGeometry(0.52, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
          MAT_BORO_VESSEL
        );
        vHemi.position.set(0, 0.78, 0);
        vHemi.castShadow = true;
        vGrp.add(vHemi);

        const vRim = new THREE.Mesh(
          new THREE.CylinderGeometry(0.58, 0.58, 0.05, 32),
          MAT_BORO_VESSEL
        );
        vRim.position.set(0, 2.48, 0);
        vGrp.add(vRim);

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

        // Dissolution Medium Liquid Volume (900 mL)
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

        // Prednisone 10mg USP Biconvex Solid Tablet
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
    this.pivotDriveHead = new THREE.Group();
    this.pivotDriveHead.name = 'Pivot_DriveHead';
    this.pivotDriveHead.position.set(0, 4.80, 0.15);

    // 1. Structural Lower Baseplate Casting (6.10 x 0.14 x 4.80)
    const headBase = new THREE.Mesh(
      new THREE.BoxGeometry(6.10, 0.14, 4.80),
      MAT_ALUM_ANODIZED
    );
    headBase.position.set(0, 0.07, 0);
    this.pivotDriveHead.add(headBase);

    // Heavy-Duty Rear Carriage Yoke (interfaces with Acme lead screw and guide shafts)
    const carriage = new THREE.Group();
    carriage.name = 'Part_CarriageYoke';
    carriage.position.set(0, 0.90, -1.90);

    const cBody = new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.4, 0.6), MAT_ALUM_ANODIZED);
    carriage.add(cBody);

    // Bronze Traveling Lead Nut
    const bNut = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 16), MAT_BRASS_FITTING);
    bNut.position.set(0, 0, 0);
    carriage.add(bNut);

    // 4× M5 Socket Cap Screws on Nut Flange
    [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]].forEach(([nx, nz]) => {
      const sc = makeSocketHeadCapScrew(0.02, 0.04);
      sc.position.set(nx, 0.18, nz);
      carriage.add(sc);
    });

    // Dual Recirculating Linear Ball Bushings
    [-2.1, 2.1].forEach(colX => {
      const bush = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 1.2, 20), MAT_CHROME_STEEL);
      bush.position.set(colX, 0, 0);
      carriage.add(bush);
    });

    this.pivotDriveHead.add(carriage);

    // 2. Drive Head Enclosure Walls (Lower structural housing)
    [-3.00, 3.00].forEach(hx => {
      const hSide = new THREE.Mesh(new THREE.BoxGeometry(0.10, 1.70, 4.80), MAT_DRIVE_HEAD);
      hSide.position.set(hx, 0.95, 0);
      hSide.castShadow = true;
      this.pivotDriveHead.add(hSide);
    });

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

    // 10x M4 Socket Cap Screws on Top Hood
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

    // Carved Recessed Bezel Pocket for LCD
    const bezelPocket = new THREE.Mesh(
      new THREE.BoxGeometry(3.24, 1.18, 0.01),
      makeMat(0x05070a, { r: 0.90 })
    );
    bezelPocket.position.set(-0.70, 0.95, 2.445);
    this.pivotDriveHead.add(bezelPocket);

    // Dedicated LCD Quad (UI_LCD)
    const lcdGeo = new THREE.PlaneGeometry(3.18, 1.12);
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

    // 5. Tactile Pushbuttons: High-End Industrial Beveled Keys with Silkscreen Labels
    const btnConfigs = [
      { name: 'Btn_ElevUp',   code: 'ELEV_UP',   text: '▲ ELEV UP',   ledCol: 0x00e5ff, y: 1.42 },
      { name: 'Btn_ElevDown', code: 'ELEV_DOWN', text: '▼ ELEV DOWN', ledCol: 0x00e5ff, y: 1.12 },
      { name: 'Btn_Start',    code: 'STIR_START', text: '▶ STIR RUN',  ledCol: 0x10b981, y: 0.82 },
      { name: 'Btn_Stop',     code: 'STIR_STOP', text: '⏹ STOP TRAY', ledCol: 0xef4444, y: 0.52 }
    ];

    btnConfigs.forEach(bc => {
      const bGrp = new THREE.Group();
      bGrp.name = bc.name;
      bGrp.position.set(1.68, bc.y, 2.44);

      // Chrome beveled outer bezel frame
      const bezelFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.96, 0.24, 0.03),
        MAT_CHROME_STEEL
      );
      bGrp.add(bezelFrame);

      // Dedicated procedural silkscreen canvas texture for the key face
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 256;
      bCanvas.height = 64;
      const bCtx = bCanvas.getContext('2d');
      bCtx.fillStyle = '#1e293b';
      bCtx.fillRect(0, 0, 256, 64);
      bCtx.strokeStyle = '#38bdf8';
      bCtx.lineWidth = 4;
      bCtx.strokeRect(2, 2, 252, 60);

      bCtx.fillStyle = '#ffffff';
      bCtx.font = 'bold 22px "JetBrains Mono", monospace';
      bCtx.textAlign = 'center';
      bCtx.textBaseline = 'middle';
      bCtx.fillText(bc.text, 128, 32);

      const bTex = new THREE.CanvasTexture(bCanvas);
      bTex.colorSpace = THREE.SRGBColorSpace;

      // Tactile key cap (depresses 1mm when clicked)
      const keyMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.90, 0.20, 0.035),
        new THREE.MeshStandardMaterial({
          map: bTex,
          roughness: 0.35,
          metalness: 0.20
        })
      );
      keyMesh.position.z = 0.02;
      keyMesh.name = bc.name;
      bGrp.add(keyMesh);

      // Indicator LED jewel above key
      const ledJewel = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.04, 0.02),
        new THREE.MeshStandardMaterial({
          color: bc.ledCol,
          emissive: bc.ledCol,
          emissiveIntensity: 0.3,
          roughness: 0.2
        })
      );
      ledJewel.position.set(0, 0.14, 0.015);
      bGrp.add(ledJewel);

      this.pivotDriveHead.add(bGrp);
      this.animGroups.buttons[bc.name] = keyMesh;
      this.animGroups.buttonLEDs[bc.name] = ledJewel;
      this.interactiveMeshes.push(keyMesh);
    });

    // 6. Internal Synchronous Drive Mechanics (visible in exploded view!)
    this.buildInternalDriveMechanics();

    // 7. 8 Rotating Spindles & Electropolished Apparatus 2 Paddles
    this.buildSpindles();

    this.mainGroup.add(this.pivotDriveHead);
    this.animGroups.pivotDriveHead = this.pivotDriveHead;
  }

  buildInternalDriveMechanics() {
    this.timingBeltGroup = new THREE.Group();
    this.timingBeltGroup.name = 'Assembly_TimingBeltDrive';
    this.timingBeltGroup.position.set(0, 0.40, 0);

    // 24V DC Brushless Synchronous Drive Motor
    const motorHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.65, 24),
      MAT_CHASSIS_DARK
    );
    motorHousing.position.set(0, 0.35, -1.0);
    this.timingBeltGroup.add(motorHousing);

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

    const mPlate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 1.2), MAT_316SS_BRUSHED);
    mPlate.position.set(0, 0.03, -1.0);
    this.timingBeltGroup.add(mPlate);

    [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]].forEach(([mx, mz]) => {
      const sc = makeSocketHeadCapScrew(0.035, 0.06);
      sc.position.set(mx, 0.06, -1.0 + mz);
      this.timingBeltGroup.add(sc);
    });

    // Continuous Synchronous Cogged Timing Belt looping across 8 drive pulleys
    const beltPts = [
      new THREE.Vector3(-1.80, 0.60, 0.98),
      new THREE.Vector3(1.80, 0.60, 0.98),
      new THREE.Vector3(1.98, 0.60, 0.80),
      new THREE.Vector3(1.98, 0.60, -0.80),
      new THREE.Vector3(1.80, 0.60, -0.98),
      new THREE.Vector3(0.50, 0.60, -0.98),
      new THREE.Vector3(0.00, 0.60, -1.25),
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

    // 120-Slot Optical Encoder Wheel
    const encoder = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.015, 32), MAT_316SS_BRUSHED);
    encoder.position.set(0, 0.18, 0);
    this.timingBeltGroup.add(encoder);

    // Head Microcontroller Board
    const headPcb = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.03, 1.0), MAT_PCB_FR4);
    headPcb.position.set(0, 0.22, 1.2);
    headPcb.name = 'PCB_HeadMCU';
    this.timingBeltGroup.add(headPcb);

    const mcu = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.25), MAT_IC_PACKAGE);
    mcu.position.set(0, 0.24, 1.2);
    this.timingBeltGroup.add(mcu);

    this.pivotDriveHead.add(this.timingBeltGroup);
  }

  buildSpindles() {
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

        const pulley = makeTimingPulley(0.18, 0.12, 24);
        pulley.position.y = 1.00;
        sGrp.add(pulley);

        const brg = makeBallBearing(0.16, 0.08, 0.08);
        brg.position.y = 0.22;
        sGrp.add(brg);

        const sleeve = new THREE.Mesh(
          new THREE.CylinderGeometry(0.17, 0.17, 0.28, 18, 1, true),
          MAT_316SS_BRUSHED
        );
        sleeve.position.y = 0.20;
        sGrp.add(sleeve);

        const collet = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.08, 0.22, 16),
          MAT_316SS_BRUSHED
        );
        collet.position.y = -0.11;
        sGrp.add(collet);

        const shaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0476, 0.0476, 3.80, 20),
          MAT_316SS_ELECTROPOLISHED
        );
        shaft.position.y = -1.90;
        shaft.castShadow = true;
        sGrp.add(shaft);

        const indexRing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.048, 0.048, 0.015, 16),
          MAT_CHASSIS_DARK
        );
        indexRing.position.y = -3.20;
        sGrp.add(indexRing);

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
    // External AutoTemp 1150W Heater / Circulator Unit
    this.circulatorGroup = new THREE.Group();
    this.circulatorGroup.name = 'Part_HeaterCirculatorAutoTemp';
    this.circulatorGroup.position.set(3.8, 0.0, -1.2);

    // 1. Two-Tone Enclosure
    const lowerBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.90, 1.80, 2.20),
      MAT_CHASSIS_DARK
    );
    lowerBody.position.set(0, 0.90, 0);
    lowerBody.castShadow = true;
    lowerBody.receiveShadow = true;
    this.circulatorGroup.add(lowerBody);

    const topCowl = new THREE.Mesh(
      new THREE.BoxGeometry(1.92, 0.80, 2.22),
      MAT_CHASSIS_CREAM
    );
    topCowl.position.set(0, 2.20, 0);
    topCowl.castShadow = true;
    this.circulatorGroup.add(topCowl);

    const handleBar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 1.20), MAT_ALUM_ANODIZED);
    handleBar.position.set(0, 2.70, 0);
    this.circulatorGroup.add(handleBar);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.70), MAT_RUBBER_NBR);
    grip.position.set(0, 2.70, 0);
    this.circulatorGroup.add(grip);

    // 2. Recessed Front Control Console with Upright Dynamic High-DPI LED Texture (DIAG-005)
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

    // 6. FULL INTERNAL WORKING MECHANICS (Circulation pump, Nichrome heater, cutoff switches, PCB)
    const pumpGrp = new THREE.Group();
    pumpGrp.name = 'Part_CirculatorPump';
    pumpGrp.position.set(-0.25, 0.70, 0.0);

    // Shaded-pole 120V AC pump motor
    const pMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.48, 18), MAT_CHASSIS_DARK);
    pumpGrp.add(pMotor);

    // Brass centrifugal volute chamber
    const volute = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.22, 18), MAT_BRASS_FITTING);
    volute.position.y = -0.32;
    pumpGrp.add(volute);

    // 6-Blade Centrifugal Impeller inside volute
    for (let b = 0; b < 6; b++) {
      const ang = (b / 6) * Math.PI * 2;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.02), MAT_CHASSIS_DARK);
      blade.position.set(Math.cos(ang) * 0.10, -0.32, Math.sin(ang) * 0.10);
      blade.rotation.y = -ang + Math.PI / 4;
      pumpGrp.add(blade);
    }
    this.circulatorGroup.add(pumpGrp);
    this.animGroups.circulatorPump = pumpGrp;

    // 1150W Stainless Steel Flow-Through Heating Chamber with Nichrome Element
    const heaterChamber = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.85, 20),
      MAT_316SS_ELECTROPOLISHED
    );
    heaterChamber.position.set(0.45, 0.80, 0.1);
    heaterChamber.name = 'Part_HeaterChamber_1150W';
    this.circulatorGroup.add(heaterChamber);

    // Dual Bimetal Over-Temperature Safety Cutoffs
    [-0.25, 0.25].forEach((cy, idx) => {
      const cutoff = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 12), MAT_BRASS_FITTING);
      cutoff.rotation.z = Math.PI / 2;
      cutoff.position.set(0.68, 0.80 + cy, 0.1);
      cutoff.name = `Sensor_ThermalCutoff_0${idx + 1}`;
      this.circulatorGroup.add(cutoff);
    });

    // Solid-State TRIAC Heater Power Controller on Heatsink Plate
    const triacSink = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.40, 0.40), MAT_CHASSIS_DARK);
    triacSink.position.set(0.80, 0.80, -0.45);
    this.circulatorGroup.add(triacSink);

    // Circulator Controller PCB with Step-Down Transformer & 40mm Fan
    const circPcb = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.03, 0.6), MAT_PCB_FR4);
    circPcb.position.set(0, 1.35, -0.4);
    circPcb.name = 'PCB_CirculatorController';
    this.circulatorGroup.add(circPcb);

    const cXformer = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.20, 0.25), MAT_COPPER_COIL);
    cXformer.position.set(-0.4, 1.46, -0.4);
    this.circulatorGroup.add(cXformer);

    // Flexible Insulated Quick-Disconnect Silicone Hoses with Genuine 3D Hose Clamps
    this.buildCirculatorHoses();

    this.mainGroup.add(this.circulatorGroup);
    this.animGroups.heaterCirculator = this.circulatorGroup;
  }

  buildCirculatorHoses() {
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

    const clamp1A = makeHoseClamp(0.075, 0.03);
    clamp1A.position.set(3.35, 0.90, -2.36);
    this.mainGroup.add(clamp1A);

    const clamp1B = makeHoseClamp(0.075, 0.03);
    clamp1B.position.set(-0.50, 0.90, -2.80);
    this.mainGroup.add(clamp1B);

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
    if (this.isDestroyed || this.options?.headless || this.options?.skipLoop) return;
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
      const targetY = 4.80 + (this.headElevationMm / 100.0);
      this.animGroups.pivotDriveHead.position.y += (targetY - this.animGroups.pivotDriveHead.position.y) * 0.10;

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

      if (this.animGroups.motorRotor) {
        this.animGroups.motorRotor.rotation.y += deltaAngle * 2.0;
      }

      const vDepth = Math.min(0.28, (this.spindleRpm / 150.0) * 0.28);
      this.animGroups.vortices.forEach(v => {
        v.scale.set(1.0 + vDepth * 0.5, 1.0 + vDepth * 2.0, 1.0 + vDepth * 0.5);
      });
    } else {
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
