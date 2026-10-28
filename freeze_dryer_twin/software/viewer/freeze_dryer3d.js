/**
 * Labconco FreeZone 4.5L (-84°C) Benchtop Cascade Freeze Dryer / Lyophilizer
 * Complete Procedural 3D CAD Assembly Engine (Three.js)
 * Adheres strictly to the Centrifuge Gold Standard and .agents/AGENTS.md
 */

import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Procedural PBR Material Definitions
// ----------------------------------------------------------------------------
const MAT_CHASSIS_WHITE = new THREE.MeshStandardMaterial({
  color: 0xe2e8f0,
  roughness: 0.45,
  metalness: 0.08,
});

const MAT_CHASSIS_DARK = new THREE.MeshStandardMaterial({
  color: 0x1e293b,
  roughness: 0.70,
  metalness: 0.15,
});

const MAT_FASCIA_STEEL = new THREE.MeshStandardMaterial({
  color: 0xd1d5db,
  roughness: 0.22,
  metalness: 0.88,
});

const MAT_CHAMBER_316SS = new THREE.MeshStandardMaterial({
  color: 0xe5e7eb,
  roughness: 0.12,
  metalness: 0.92,
});

const MAT_COIL_SS = new THREE.MeshStandardMaterial({
  color: 0x9ca3af,
  roughness: 0.25,
  metalness: 0.85,
});

const MAT_GASKET_BLUE = new THREE.MeshStandardMaterial({
  color: 0x0284c7,
  roughness: 0.65,
  metalness: 0.02,
});

const MAT_RUBBER_BLACK = new THREE.MeshStandardMaterial({
  color: 0x18181b,
  roughness: 0.85,
  metalness: 0.05,
});

const MAT_DELRIN_GRAY = new THREE.MeshStandardMaterial({
  color: 0x475569,
  roughness: 0.40,
  metalness: 0.10,
});

const MAT_CORD_BLACK = new THREE.MeshStandardMaterial({
  color: 0x111827,
  roughness: 0.75,
  metalness: 0.05,
});

// Clear Optical Acrylic Manifold Drum (MeshPhysicalMaterial)
const MAT_DRUM_ACRYLIC = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.94,
  roughness: 0.06,
  ior: 1.49,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide
});

// Clear Borosilicate Fast-Freeze Flask Glass
const MAT_BORO_GLASS = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.95,
  roughness: 0.04,
  ior: 1.52,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide
});

// Frozen Product Lyophile Cake
const MAT_FROZEN_CAKE = new THREE.MeshStandardMaterial({
  color: 0xfdf4dc,
  roughness: 0.85,
  metalness: 0.02,
});

// Dynamic Frost Accumulation Material
const MAT_FROST = new THREE.MeshStandardMaterial({
  color: 0xf0fdfa,
  roughness: 0.55,
  metalness: 0.05,
  transparent: true,
  opacity: 0.0, // Scales dynamically with frost accumulation
});

// ----------------------------------------------------------------------------
// Helper Fastener Geometry Generators
// ----------------------------------------------------------------------------
function makeHexScrew(radius = 0.025, height = 0.035) {
  const group = new THREE.Group();
  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 6),
    MAT_FASCIA_STEEL
  );
  head.castShadow = true;
  group.add(head);

  // Hex socket depth indent
  const sock = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, height * 0.4, 6),
    MAT_CHASSIS_DARK
  );
  sock.position.y = height * 0.35;
  group.add(sock);
  return group;
}

export class FreezeDryer3D {
  constructor(container) {
    this.container = container;

    // Exploded view kinematic offsets
    this.exploded = false;
    this.explodeFactor = 0.0;
    this.targetExplodeFactor = 0.0;

    // Animated states
    this.isPluggedIn = true;
    this.powerSwitchOn = true;
    this.compressorRunning = false;
    this.vacuumRunning = false;

    // Telemetry display values
    this.displayState = {
      state: 'STANDBY',
      collector_temp_c: 21.5,
      stage1_temp_c: 21.5,
      vacuum_mbar: 1013.25,
      frost_mass_g: 0.0,
      frost_thickness_mm: 0.0,
      run_timer_s: 0.0
    };

    // Sub-assemblies for exploded / kinematic animation
    this.animGroups = {
      manifoldDrum: null,
      manifoldLid: null,
      collectorGasket: null,
      valves: [],
      valvePivots: [],
      frostMesh: null,
      productCakes: [],
      compressorsGroup: null,
      fanBlades: null,
      powerPlug: null,
      cordMesh: null,
      switchRocker: null
    };

    this.interactiveMeshes = [];
    this.partCatalog = [];

    this.initScene();
    this.initBenchAndRoom();
    this.initPowerDuplexBox();
    this.initLCDCanvas();
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

    // 1 unit = ~100 mm (0.1 m). Console width 5.71 units, height with drum ~8.8 units
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(9.8, 9.2, 13.8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // Standard 3-Point Studio Lighting Rig
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(this.ambientLight);

    // Key Light
    this.keyLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    this.keyLight.position.set(6.0, 10.0, 8.0);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 25;
    this.keyLight.shadow.camera.left = -6;
    this.keyLight.shadow.camera.right = 6;
    this.keyLight.shadow.camera.top = 8;
    this.keyLight.shadow.camera.bottom = -4;
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);

    // Fill Light
    this.fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.85);
    this.fillLight.position.set(-8.0, 6.0, 5.0);
    this.scene.add(this.fillLight);

    // Back / Rim Light
    this.rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    this.rimLight.position.set(2.0, 8.0, -8.0);
    this.scene.add(this.rimLight);
  }

  initBenchAndRoom() {
    // Laboratory Resin Bench Surface at datum Y = 0.0
    const benchGeo = new THREE.BoxGeometry(16.0, 0.16, 10.0);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x141820,
      roughness: 0.38,
      metalness: 0.15
    });
    this.benchMesh = new THREE.Mesh(benchGeo, benchMat);
    this.benchMesh.name = 'INSTRUMENT_BENCH';
    this.benchMesh.position.set(0, -0.08, 0.5);
    this.benchMesh.receiveShadow = true;
    this.scene.add(this.benchMesh);

    // Front Stainless Steel Edge Trim
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(16.02, 0.04, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 })
    );
    trim.position.set(0, -0.02, 5.51);
    this.scene.add(trim);

    // Neutral Backsplash Wall behind bench (at Z = -3.8)
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(18.0, 12.0),
      new THREE.MeshStandardMaterial({ color: 0x1b222c, roughness: 0.85 })
    );
    wall.position.set(0, 5.92, -3.8);
    wall.receiveShadow = true;
    this.scene.add(wall);
  }

  initPowerDuplexBox() {
    // Cast Aluminum Duplex Receptacle Box positioned behind the console at (-3.4, 0, -2.2)
    this.duplexBoxGroup = new THREE.Group();
    this.duplexBoxGroup.position.set(-3.4, 0.0, -2.2);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.40, 0.85),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.65, roughness: 0.35 })
    );
    box.position.y = 0.20;
    box.castShadow = true;
    box.receiveShadow = true;
    box.name = 'Power_Receptacle_Duplex';
    this.duplexBoxGroup.add(box);

    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.02, 0.88),
      new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.20 })
    );
    plate.position.y = 0.41;
    this.duplexBoxGroup.add(plate);

    // Molded NEMA 5-15P Power Plug
    this.plugGroup = new THREE.Group();
    this.plugGroup.name = 'Part_PowerPlugNEMA';
    this.plugGroup.position.set(0, 0.42, -0.22);

    const plugBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.24, 0.32), MAT_RUBBER_BLACK);
    plugBody.position.y = 0.12;
    plugBody.castShadow = true;
    this.plugGroup.add(plugBody);

    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.14, 12), MAT_RUBBER_BLACK);
    boot.rotation.x = Math.PI / 2;
    boot.position.set(0, 0.12, 0.21);
    this.plugGroup.add(boot);

    this.duplexBoxGroup.add(this.plugGroup);
    this.scene.add(this.duplexBoxGroup);
    this.animGroups.powerPlug = this.plugGroup;
    this.interactiveMeshes.push(plugBody);

    this.buildPowerCord();
  }

  buildPowerCord() {
    if (this.cordMesh) {
      this.scene.remove(this.cordMesh);
    }
    const plugWorld = this.duplexBoxGroup.position.clone().add(new THREE.Vector3(0, 0.50, 0.12));
    const inletWorld = new THREE.Vector3(-1.8, 0.65, -3.15); // Rear IEC inlet

    const points = this.isPluggedIn ? [
      plugWorld,
      plugWorld.clone().add(new THREE.Vector3(0.4, -0.38, 0.2)),
      new THREE.Vector3(-2.6, 0.05, -1.8),
      new THREE.Vector3(-2.1, 0.05, -2.6),
      inletWorld.clone().add(new THREE.Vector3(0, -0.2, 0.2)),
      inletWorld
    ] : [
      this.duplexBoxGroup.position.clone().add(new THREE.Vector3(0.35, 0.10, 0.3)),
      new THREE.Vector3(-2.6, 0.05, -1.8),
      new THREE.Vector3(-2.1, 0.05, -2.6),
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
        this.animGroups.powerPlug.position.set(0, 0.42, -0.22);
        this.animGroups.powerPlug.rotation.set(0, 0, 0);
      } else {
        this.animGroups.powerPlug.position.set(0.42, 0.14, 0.30);
        this.animGroups.powerPlug.rotation.set(0, Math.PI / 4, Math.PI / 2);
      }
    }
    this.buildPowerCord();
    this.renderLCD();
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
    this.lcdTexture.flipY = false; // DIAG-005: mandatory for Three.js dynamic canvas
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

    // Background: Unpowered blackout (DIAG-014)
    if (!this.isPluggedIn || !this.powerSwitchOn) {
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#1e293b';
      ctx.font = '700 34px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NO AC POWER CONTINUITY', w / 2, h / 2 - 20);
      ctx.font = '400 22px monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText('CONNECT NEMA 5-15P PLUG & FRONT ROCKER', w / 2, h / 2 + 30);
      this.lcdTexture.needsUpdate = true;
      return;
    }

    // Active Labconco Lyo-Works OS Interface
    ctx.fillStyle = '#080d14';
    ctx.fillRect(0, 0, w, h);

    // Top Header Banner
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, 80);

    const isStandby = this.displayState.state === 'STANDBY';
    const isPrecooling = this.displayState.state === 'PRE_COOLING';
    const isPulldown = this.displayState.state === 'PULL_DOWN';
    const isDry = this.displayState.state === 'PRIMARY_DRYING' || this.displayState.state === 'SECONDARY_DRYING';
    const isDefrost = this.displayState.state === 'DEFROST';

    let pillColor = '#0284c7';
    if (isPrecooling) pillColor = '#00e5ff';
    if (isPulldown) pillColor = '#f59e0b';
    if (isDry) pillColor = '#10b981';
    if (isDefrost) pillColor = '#ef4444';

    // Status Pill
    ctx.fillStyle = pillColor;
    ctx.fillRect(24, 18, 170, 44);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.displayState.state, 109, 47);

    // Header Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 24px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Labconco FreeZone 4.5L · Lyo-Works OS', 220, 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 17px monospace';
    ctx.fillText(`Cascade Stage: -84°C · Pirani Vac · Ice: ${this.displayState.frost_mass_g.toFixed(1)} g`, 220, 68);

    // Two Primary Large Telemetry Cards
    // Card 1: Collector Temperature
    ctx.fillStyle = '#111927';
    ctx.fillRect(24, 100, 470, 160);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(24, 100, 470, 160);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 17px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('COLLECTOR TEMPERATURE', 44, 132);

    ctx.fillStyle = this.displayState.collector_temp_c <= -70.0 ? '#38bdf8' : (this.displayState.collector_temp_c <= -40.0 ? '#34d399' : '#f87171');
    ctx.font = '700 60px monospace';
    ctx.fillText(`${this.displayState.collector_temp_c.toFixed(1)}`, 44, 206);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 24px monospace';
    ctx.fillText('°C (-84°C Target)', 270, 206);

    // Card 2: Chamber Vacuum
    ctx.fillStyle = '#111927';
    ctx.fillRect(518, 100, 482, 160);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(518, 100, 482, 160);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 17px sans-serif';
    ctx.fillText('CHAMBER VACUUM', 538, 132);

    ctx.fillStyle = this.displayState.vacuum_mbar < 0.100 ? '#34d399' : (this.displayState.vacuum_mbar < 1.0 ? '#fbbf24' : '#94a3b8');
    ctx.font = '700 56px monospace';
    ctx.fillText(`${this.displayState.vacuum_mbar.toFixed(3)}`, 538, 206);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 22px monospace';
    ctx.fillText('mbar (Edwards RV5)', 800, 206);

    // Real-Time Graphic Sublimation & Cooling Curves
    ctx.fillStyle = '#0d131d';
    ctx.fillRect(24, 280, 976, 240);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(24, 280, 976, 240);

    // Grid lines
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    for (let y = 310; y < 510; y += 40) {
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(1000, y);
      ctx.stroke();
    }
    for (let x = 120; x < 980; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 280);
      ctx.lineTo(x, 520);
      ctx.stroke();
    }

    // Graph Title & Legends
    ctx.fillStyle = '#64748b';
    ctx.font = '500 15px sans-serif';
    ctx.fillText('Real-Time Thermodynamic Trend · Collector Temp (Cyan) & Vacuum Evacuation (Green)', 44, 305);

    // Simulated Trend Curves
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(44, 340);
    ctx.bezierCurveTo(280, 360, 450, 470, 980, 490);
    ctx.stroke();

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(44, 330);
    ctx.bezierCurveTo(150, 340, 260, 480, 980, 495);
    ctx.stroke();

    // Bottom Touch Softkeys
    const softkeys = [
      { label: 'CASCADE REFRIG', col: this.compressorRunning ? '#0284c7' : '#1e293b' },
      { label: 'VACUUM PUMP', col: this.vacuumRunning ? '#059669' : '#1e293b' },
      { label: 'VENT CHAMBER', col: '#1e293b' },
      { label: 'DEFROST & DRAIN', col: isDefrost ? '#dc2626' : '#1e293b' },
      { label: 'LYO-WORKS MENU', col: '#1e293b' }
    ];

    const kw = 180;
    const kh = 60;
    softkeys.forEach((k, idx) => {
      const kx = 24 + idx * 199;
      const ky = 545;
      ctx.fillStyle = k.col;
      ctx.fillRect(kx, ky, kw, kh);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(kx, ky, kw, kh);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 16px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(k.label, kx + kw / 2, ky + 36);
    });

    this.lcdTexture.needsUpdate = true;
  }

  // ----------------------------------------------------------------------------
  // Exhaustive Procedural 3D CAD Assembly
  // ----------------------------------------------------------------------------
  buildModel() {
    this.root = new THREE.Group();
    this.root.name = 'Twin_LabconcoFreeZone';
    this.scene.add(this.root);

    // 1. Main Base Console Housing & Fascia
    this.buildBaseConsole();

    // 2. Seamless 316SS Collector Chamber & Cooling Coil with Frost
    this.buildCollectorChamber();

    // 3. Clear Acrylic 12-Port Drying Drum Manifold & Valves
    this.buildManifoldDrum();

    // 4. Consumable Fast-Freeze Lyophilization Flasks
    this.buildFastFreezeFlasks();

    // 5. External Edwards RV5 Rotary Vane Vacuum Pump & Hose
    this.buildVacuumPumpStation();
  }

  buildBaseConsole() {
    this.consoleGroup = new THREE.Group();
    this.consoleGroup.name = 'Body_Chassis';
    // Base console centered at (0, 0, 0)
    // 571mm W x 673mm D x 469mm H -> (5.71 x 4.69 x 6.73)
    const baseW = 5.71;
    const baseH = 4.69;
    const baseD = 6.73;

    // Main cold-rolled steel unibody enclosure
    const unibody = new THREE.Mesh(
      new THREE.BoxGeometry(baseW, baseH, baseD),
      MAT_CHASSIS_WHITE
    );
    unibody.position.y = baseH / 2;
    unibody.castShadow = true;
    unibody.receiveShadow = true;
    this.consoleGroup.add(unibody);

    // Stamped Ventilation Cooling Louvers on Left and Right sides
    for (let side of [-1, 1]) {
      const louverG = new THREE.Group();
      louverG.position.set(side * (baseW / 2 + 0.01), 2.2, -0.5);
      louverG.rotation.y = side * Math.PI / 2;

      for (let l = 0; l < 14; l++) {
        const slot = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 0.05, 0.02),
          MAT_CHASSIS_DARK
        );
        slot.position.y = (l - 7) * 0.14;
        louverG.add(slot);
      }
      this.consoleGroup.add(louverG);
    }

    // 4 Heavy-Duty Threaded Leveling Feet at Y = 0 (Rule 5)
    const footPositions = [
      [-baseW / 2 + 0.45, -baseD / 2 + 0.45],
      [baseW / 2 - 0.45, -baseD / 2 + 0.45],
      [-baseW / 2 + 0.45, baseD / 2 - 0.45],
      [baseW / 2 - 0.45, baseD / 2 - 0.45]
    ];
    footPositions.forEach(([fx, fz], idx) => {
      const foot = new THREE.Group();
      foot.name = `Foot_Leveling_0${idx+1}`;
      foot.position.set(fx, 0.0, fz);

      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.08, 18), MAT_RUBBER_BLACK);
      pad.position.y = 0.04;
      foot.add(pad);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 12), MAT_FASCIA_STEEL);
      stem.position.y = 0.12;
      foot.add(stem);

      this.consoleGroup.add(foot);
    });

    // Brushed 304 Stainless Steel Front Fascia Faceplate
    const fascia = new THREE.Mesh(
      new THREE.BoxGeometry(baseW * 0.98, baseH * 0.96, 0.04),
      MAT_FASCIA_STEEL
    );
    fascia.name = 'Body_Fascia';
    fascia.position.set(0, baseH / 2, baseD / 2 + 0.02);
    this.consoleGroup.add(fascia);

    // Recessed Touchscreen Bezel Pocket (Upper Right of fascia)
    // 130mm W x 85mm H x 6mm D -> (1.30 x 0.85 x 0.06)
    const pocketX = 1.60;
    const pocketY = 3.35;
    const pocketZ = baseD / 2 + 0.04;

    const bezelPocket = new THREE.Mesh(
      new THREE.BoxGeometry(1.42, 0.96, 0.02),
      MAT_CHASSIS_DARK
    );
    bezelPocket.position.set(pocketX, pocketY, pocketZ);
    this.consoleGroup.add(bezelPocket);

    // UI_LCD Quad Seated in Recessed Pocket with positive relative Z clearance (DIAG-002, DIAG-005)
    const lcdGeo = new THREE.PlaneGeometry(1.30, 0.84);
    // Invert buffer UVs: uv.setY(i, 1.0 - uv.getY(i)) (DIAG-005)
    const uvAttr = lcdGeo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setY(i, 1.0 - uvAttr.getY(i));
    }
    uvAttr.needsUpdate = true;

    this.matLCD.side = THREE.DoubleSide;
    this.lcdMesh = new THREE.Mesh(lcdGeo, this.matLCD);
    this.lcdMesh.name = 'UI_LCD';
    this.lcdMesh.position.set(pocketX, pocketY, pocketZ + 0.015);
    this.lcdMesh.renderOrder = 2;
    this.consoleGroup.add(this.lcdMesh);
    this.interactiveMeshes.push(this.lcdMesh);

    // Protective Screen Glass Overlay
    const lens = new THREE.Mesh(
      new THREE.PlaneGeometry(1.34, 0.88),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.06,
        roughness: 0.05,
        metalness: 0.1,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    lens.name = 'Glass_LCDLens';
    lens.position.set(pocketX, pocketY, pocketZ + 0.02);
    lens.renderOrder = 3;
    this.consoleGroup.add(lens);

    // Physical Push Buttons below display: Vacuum, Refrig, Defrost, Menu
    const buttons = [
      { id: 'Btn_Vacuum', label: 'VAC', col: 0x0284c7, dx: -0.45 },
      { id: 'Btn_Refrig', label: 'REF', col: 0x00e5ff, dx: -0.15 },
      { id: 'Btn_Defrost', label: 'DEF', col: 0xf59e0b, dx: 0.15 },
      { id: 'Btn_Menu', label: 'MENU', col: 0x475569, dx: 0.45 }
    ];

    buttons.forEach(b => {
      const btn = new THREE.Mesh(
        new THREE.BoxGeometry(0.20, 0.16, 0.05),
        new THREE.MeshStandardMaterial({ color: b.col, roughness: 0.35, metalness: 0.2 })
      );
      btn.name = b.id;
      btn.position.set(pocketX + b.dx, pocketY - 0.62, pocketZ + 0.025);
      btn.castShadow = true;
      this.consoleGroup.add(btn);
      this.interactiveMeshes.push(btn);
    });

    // Official SREdesigns Brand Identity Badge in Dedicated Recessed Pocket (Rule 3)
    const badgePocket = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.36, 0.02), MAT_CHASSIS_DARK);
    badgePocket.position.set(-1.60, 3.45, pocketZ);
    this.consoleGroup.add(badgePocket);

    const bCanvas = document.createElement('canvas');
    bCanvas.width = 512;
    bCanvas.height = 160;
    const bctx = bCanvas.getContext('2d');
    bctx.fillStyle = '#0f172a';
    bctx.fillRect(0, 0, 512, 160);
    bctx.fillStyle = '#ff3344';
    bctx.font = '800 48px -apple-system, sans-serif';
    bctx.textAlign = 'center';
    bctx.fillText('SREdesigns', 256, 68);
    bctx.fillStyle = '#94a3b8';
    bctx.font = '700 22px monospace';
    bctx.fillText('LABCONCO FREEZONE 4.5L', 256, 114);

    const badgeTex = new THREE.CanvasTexture(bCanvas);
    badgeTex.flipY = false;
    badgeTex.colorSpace = THREE.SRGBColorSpace;
    const bGeo = new THREE.PlaneGeometry(1.02, 0.30);
    const bUv = bGeo.attributes.uv;
    for (let i = 0; i < bUv.count; i++) bUv.setY(i, 1.0 - bUv.getY(i));
    bUv.needsUpdate = true;

    const badgeMesh = new THREE.Mesh(bGeo, new THREE.MeshBasicMaterial({ map: badgeTex }));
    badgeMesh.name = 'Badge_SREdesigns';
    badgeMesh.position.set(-1.60, 3.45, pocketZ + 0.015);
    this.consoleGroup.add(badgeMesh);

    // Main Illuminated Front Rocker AC Power Switch (Lower right fascia)
    const switchHousing = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.04), MAT_CHASSIS_DARK);
    switchHousing.position.set(2.10, 0.85, pocketZ);
    this.consoleGroup.add(switchHousing);

    this.switchRocker = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.22, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.20,
        emissive: 0xff0000,
        emissiveIntensity: 0.6
      })
    );
    this.switchRocker.name = 'Switch_Power';
    this.switchRocker.position.set(2.10, 0.85, pocketZ + 0.035);
    this.consoleGroup.add(this.switchRocker);
    this.interactiveMeshes.push(this.switchRocker);
    this.animGroups.switchRocker = this.switchRocker;

    // Front Defrost Condensate Drain Port & Silicone Tube with Pinch Clamp
    const drainPort = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12), MAT_FASCIA_STEEL);
    drainPort.rotation.x = Math.PI / 2;
    drainPort.position.set(-2.10, 0.85, pocketZ + 0.05);
    drainPort.name = 'Port_DrainFront';
    this.consoleGroup.add(drainPort);

    // Fascia Hex Screws (Genuine 3D fasteners)
    const screwPositions = [
      [-baseW / 2 + 0.15, baseH - 0.15],
      [baseW / 2 - 0.15, baseH - 0.15],
      [-baseW / 2 + 0.15, 0.15],
      [baseW / 2 - 0.15, 0.15]
    ];
    screwPositions.forEach(([sx, sy], idx) => {
      const scr = makeHexScrew(0.04, 0.03);
      scr.name = `Fastener_HexM4_Chassis_0${idx+1}`;
      scr.rotation.x = Math.PI / 2;
      scr.position.set(sx, sy, pocketZ + 0.01);
      this.consoleGroup.add(scr);
    });

    this.root.add(this.consoleGroup);
  }

  buildCollectorChamber() {
    this.collectorGroup = new THREE.Group();
    this.collectorGroup.name = 'Chamber_Collector';
    // Collector chamber sits in the rear/center top deck
    // Elevation Y = 4.69 (top of console), centered around X = 0, Z = -0.6
    this.collectorGroup.position.set(0, 4.69, -0.6);

    // Seamless deep-drawn 316 stainless steel cylinder (ID 254mm, Depth 280mm -> Dia 2.54, H 2.80)
    // Sunk into console deck
    const chamberGeo = new THREE.CylinderGeometry(1.27, 1.27, 2.80, 48, 1, true);
    const chamberMesh = new THREE.Mesh(chamberGeo, MAT_CHAMBER_316SS);
    chamberMesh.position.y = -1.40;
    chamberMesh.receiveShadow = true;
    this.collectorGroup.add(chamberMesh);

    // Chamber Bottom Plate
    const botPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.27, 1.27, 0.04, 48), MAT_CHAMBER_316SS);
    botPlate.position.y = -2.80;
    this.collectorGroup.add(botPlate);

    // Electropolished Top Rim Bevel Flange
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.09, 16, 48), MAT_FASCIA_STEEL);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.01;
    this.collectorGroup.add(rim);

    // Blue Molded Silicone Collector Rim Gasket
    const gasket = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.06, 16, 48), MAT_GASKET_BLUE);
    gasket.rotation.x = Math.PI / 2;
    gasket.position.y = 0.05;
    gasket.name = 'Gasket_CollectorRim';
    this.collectorGroup.add(gasket);
    this.animGroups.collectorGasket = gasket;

    // 5-Turn Helical 316SS Refrigeration Evaporator Coil lining the chamber wall
    const coilPoints = [];
    const turns = 5;
    const coilRadius = 1.15;
    const coilHeight = 2.40;
    for (let t = 0; t <= 120; t++) {
      const theta = (t / 120) * turns * Math.PI * 2;
      const y = -0.20 - (t / 120) * coilHeight;
      const x = Math.cos(theta) * coilRadius;
      const z = Math.sin(theta) * coilRadius;
      coilPoints.push(new THREE.Vector3(x, y, z));
    }
    const coilCurve = new THREE.CatmullRomCurve3(coilPoints);
    const coilGeo = new THREE.TubeGeometry(coilCurve, 120, 0.065, 12, false);
    const coilMesh = new THREE.Mesh(coilGeo, MAT_COIL_SS);
    coilMesh.name = 'Coil_Evaporator';
    coilMesh.castShadow = true;
    this.collectorGroup.add(coilMesh);

    // Procedural Frost Accumulation Layer on the coil (scales opacity & thickness)
    const frostGeo = new THREE.TubeGeometry(coilCurve, 120, 0.095, 12, false);
    this.frostMesh = new THREE.Mesh(frostGeo, MAT_FROST);
    this.frostMesh.name = 'Frost_CondenserIce';
    this.collectorGroup.add(this.frostMesh);
    this.animGroups.frostMesh = this.frostMesh;

    this.root.add(this.collectorGroup);
  }

  buildManifoldDrum() {
    this.manifoldGroup = new THREE.Group();
    this.manifoldGroup.name = 'Manifold_DrumAcrylic';
    // Manifold drum docks right on top of collector gasket at Y = 4.69, Z = -0.6
    this.manifoldGroup.position.set(0, 4.69, -0.6);

    // Cast optical acrylic cylinder: OD 305mm, H 381mm -> Dia 3.05 (R 1.525), H 3.81
    const drumGeo = new THREE.CylinderGeometry(1.525, 1.525, 3.81, 48, 1, true);
    const drumMesh = new THREE.Mesh(drumGeo, MAT_DRUM_ACRYLIC);
    drumMesh.position.y = 3.81 / 2;
    drumMesh.castShadow = true;
    drumMesh.receiveShadow = true;
    this.manifoldGroup.add(drumMesh);

    // Bottom sealing ring docking onto gasket
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.525, 0.05, 16, 48), MAT_GASKET_BLUE);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.name = 'Gasket_DrumBase';
    this.manifoldGroup.add(baseRing);

    // 12 Quick-Seal Neoprene Valves with 3-position lever handles
    // Tier 1 (Lower): Y = +1.20, 6 ports at 60 deg increments
    // Tier 2 (Upper): Y = +2.60, 6 ports at 60 deg staggered (+30 deg)
    for (let tier = 0; tier < 2; tier++) {
      const y = tier === 0 ? 1.20 : 2.60;
      const angleOffset = tier === 0 ? 0 : Math.PI / 6;

      for (let p = 0; p < 6; p++) {
        const valveIdx = tier * 6 + p;
        const theta = angleOffset + p * (Math.PI / 3);

        const valveG = new THREE.Group();
        valveG.name = `Valve_QuickSeal_${valveIdx < 9 ? '0' : ''}${valveIdx + 1}`;
        valveG.position.set(
          Math.cos(theta) * 1.525,
          y,
          Math.sin(theta) * 1.525
        );
        valveG.rotation.y = -theta + Math.PI / 2;

        // Valve neoprene nozzle / boss
        const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.22, 0.55, 18), MAT_RUBBER_BLACK);
        nozzle.rotation.x = Math.PI / 2;
        nozzle.position.z = 0.26;
        valveG.add(nozzle);

        // 3-position lever handle: 'CLOSED' (up), 'VACUUM' (left), 'VENT' (right)
        const pivotG = new THREE.Group();
        pivotG.name = `Pivot_ValveLever_${valveIdx < 9 ? '0' : ''}${valveIdx + 1}`;
        pivotG.position.set(0, 0.16, 0.35);

        const leverHandle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.12), MAT_DELRIN_GRAY);
        leverHandle.position.y = 0.20;
        leverHandle.castShadow = true;
        pivotG.add(leverHandle);

        const pointerDot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), MAT_FASCIA_STEEL);
        pointerDot.position.set(0, 0.40, 0.06);
        pivotG.add(pointerDot);

        valveG.add(pivotG);
        this.interactiveMeshes.push(leverHandle);
        this.animGroups.valves.push(valveG);
        this.animGroups.valvePivots.push(pivotG);

        this.manifoldGroup.add(valveG);
      }
    }

    // Top Removable Acrylic Lid Assembly
    this.lidGroup = new THREE.Group();
    this.lidGroup.name = 'Lid_ManifoldTop';
    this.lidGroup.position.set(0, 3.81, 0);

    const lidPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.60, 1.60, 0.12, 48), MAT_DRUM_ACRYLIC);
    lidPlate.position.y = 0.06;
    lidPlate.castShadow = true;
    this.lidGroup.add(lidPlate);

    // Center silicone lifting knob
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.24, 18), MAT_RUBBER_BLACK);
    knob.position.y = 0.24;
    knob.name = 'Handle_LidCenter';
    knob.castShadow = true;
    this.lidGroup.add(knob);
    this.interactiveMeshes.push(knob);

    this.manifoldGroup.add(this.lidGroup);
    this.animGroups.manifoldDrum = this.manifoldGroup;
    this.animGroups.manifoldLid = this.lidGroup;

    this.root.add(this.manifoldGroup);
  }

  buildFastFreezeFlasks() {
    // Dock two authentic Fast-Freeze lyophilization flasks to Quick-Seal valves:
    // Flask 0 (300 mL) docked to valve 0 (Tier 1 front-right)
    // Flask 1 (600 mL) docked to valve 6 (Tier 2 front-left)

    const flaskConfigs = [
      { valveIdx: 0, capRadius: 0.45, flaskRadius: 0.42, flaskH: 1.45, name: 'Flask_FastFreeze_01', cakeName: 'Cake_FrozenProduct_01' },
      { valveIdx: 6, capRadius: 0.55, flaskRadius: 0.52, flaskH: 1.80, name: 'Flask_FastFreeze_02', cakeName: 'Cake_FrozenProduct_02' }
    ];

    flaskConfigs.forEach(fc => {
      const valve = this.animGroups.valves[fc.valveIdx];
      if (!valve) return;

      const flaskGroup = new THREE.Group();
      flaskGroup.name = fc.name;
      flaskGroup.position.set(0, -0.15, 0.58);
      flaskGroup.rotation.x = Math.PI * 0.12; // Natural 20-degree tilt angle

      // 45-degree borosilicate elbow connecting valve to silicone cap
      const elbow = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.35, 16), MAT_BORO_GLASS);
      elbow.position.y = -0.10;
      flaskGroup.add(elbow);

      // Flexible red silicone sealing cap
      const capMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 });
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(fc.capRadius, fc.capRadius * 0.9, 0.25, 24), capMat);
      cap.position.y = -0.35;
      cap.castShadow = true;
      flaskGroup.add(cap);

      // Borosilicate cylindrical flask body
      const body = new THREE.Mesh(new THREE.CylinderGeometry(fc.flaskRadius, fc.flaskRadius, fc.flaskH, 24), MAT_BORO_GLASS);
      body.position.y = -0.35 - fc.flaskH / 2;
      body.castShadow = true;
      flaskGroup.add(body);

      // Rounded hemispherical glass base
      const base = new THREE.Mesh(new THREE.SphereGeometry(fc.flaskRadius, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), MAT_BORO_GLASS);
      base.position.y = -0.35 - fc.flaskH;
      flaskGroup.add(base);

      // Frozen Product Lyophile Cake lining the inner perimeter
      const cakeGeo = new THREE.CylinderGeometry(fc.flaskRadius * 0.88, fc.flaskRadius * 0.88, fc.flaskH * 0.75, 24);
      const cake = new THREE.Mesh(cakeGeo, MAT_FROZEN_CAKE);
      cake.name = fc.cakeName;
      cake.position.y = -0.35 - fc.flaskH / 2;
      flaskGroup.add(cake);
      this.animGroups.productCakes.push(cake);

      valve.add(flaskGroup);
    });
  }

  buildVacuumPumpStation() {
    // External Edwards RV5 Dual-Stage Rotary Vane Vacuum Pump Twin
    // Positioned beside the console at (4.8, 0, -0.6)
    this.pumpGroup = new THREE.Group();
    this.pumpGroup.name = 'Pump_Vacuum_RV5';
    this.pumpGroup.position.set(4.8, 0, -0.6);

    // Pump unibody motor + oil casing (430mm L x 158mm W x 260mm H -> 4.3 x 1.58 x 2.60)
    // Motor housing (rear blue/orange industrial coat)
    const motor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.80, 0.80, 2.2, 24),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.45, metalness: 0.25 })
    );
    motor.rotation.x = Math.PI / 2;
    motor.position.set(0, 1.25, -1.0);
    motor.castShadow = true;
    this.pumpGroup.add(motor);

    // Oil casing (front gray cast iron reservoir)
    const oilBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.58, 1.80, 2.10),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.55, metalness: 0.35 })
    );
    oilBox.position.set(0, 1.15, 1.0);
    oilBox.castShadow = true;
    this.pumpGroup.add(oilBox);

    // Oil Level Sight Glass
    const sightGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.04, 16), MAT_BORO_GLASS);
    sightGlass.rotation.z = Math.PI / 2;
    sightGlass.position.set(0.80, 1.10, 1.10);
    this.pumpGroup.add(sightGlass);

    // KF25 Intake Flange on pump
    const kfPump = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.30, 16), MAT_FASCIA_STEEL);
    kfPump.position.set(0, 2.20, 0.3);
    this.pumpGroup.add(kfPump);

    // Heavy-Wall Wire-Reinforced Vacuum Hose connecting pump KF25 to Freeze Dryer rear KF25 port
    const pumpPortWorld = this.pumpGroup.position.clone().add(new THREE.Vector3(0, 2.35, 0.3));
    const dryerRearPortWorld = new THREE.Vector3(0.0, 3.2, -3.38); // Rear KF25 port on chassis

    const hoseCurve = new THREE.CatmullRomCurve3([
      pumpPortWorld,
      pumpPortWorld.clone().add(new THREE.Vector3(-0.6, 0.8, -0.4)),
      new THREE.Vector3(2.5, 2.4, -2.6),
      dryerRearPortWorld.clone().add(new THREE.Vector3(0.6, 0.2, 0.2)),
      dryerRearPortWorld
    ]);
    const hoseGeo = new THREE.TubeGeometry(hoseCurve, 32, 0.12, 12, false);
    const hoseMat = new THREE.MeshPhysicalMaterial({
      color: 0x94a3b8,
      transmission: 0.65,
      roughness: 0.35,
      transparent: true,
      depthWrite: false
    });
    const hose = new THREE.Mesh(hoseGeo, hoseMat);
    hose.name = 'Hose_VacuumReinforced';
    hose.castShadow = true;
    this.scene.add(hose);

    this.scene.add(this.pumpGroup);
  }

  setupExplodedNodes() {
    this.explodeNodes = [
      { obj: this.animGroups.manifoldLid, dir: new THREE.Vector3(0, 2.2, 0) },
      { obj: this.animGroups.manifoldDrum, dir: new THREE.Vector3(0, 1.4, 0) },
      { obj: this.animGroups.collectorGasket, dir: new THREE.Vector3(0, 0.8, 0) },
      { obj: this.pumpGroup, dir: new THREE.Vector3(1.2, 0, 0) }
    ];
  }

  toggleExplode() {
    this.exploded = !this.exploded;
    this.targetExplodeFactor = this.exploded ? 1.0 : 0.0;
  }

  updatePhysics(deltaS) {
    // Interpolate exploded view factor
    this.explodeFactor += (this.targetExplodeFactor - this.explodeFactor) * 0.12;
    this.explodeNodes.forEach(node => {
      if (node.obj) {
        if (!node.basePos) node.basePos = node.obj.position.clone();
        node.obj.position.copy(node.basePos).addScaledVector(node.dir, this.explodeFactor);
      }
    });

    // Animate frost opacity and scale
    if (this.animGroups.frostMesh) {
      const frostPct = Math.min(1.0, this.displayState.frost_mass_g / 500.0);
      this.animGroups.frostMesh.material.opacity = frostPct * 0.85;
      const s = 1.0 + frostPct * 0.25;
      this.animGroups.frostMesh.scale.set(s, 1.0, s);
    }

    // Animate product cake shrinkage during sublimation
    this.animGroups.productCakes.forEach(cake => {
      const shrink = Math.max(0.1, 1.0 - (this.displayState.frost_mass_g / 200.0));
      cake.scale.set(shrink, shrink, shrink);
    });
  }

  animate() {
    if (this.isDestroyed || this.options?.headless || this.options?.skipLoop) return;
    requestAnimationFrame(this.animate);
    this.updatePhysics(0.016);
    this.renderer.render(this.scene, this.camera);
  }
}

window.FreezeDryer3D = FreezeDryer3D;
