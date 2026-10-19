// ============================================================================
// SREdesigns Metrohm 901/917 Karl Fischer Moisture Titrator Digital Twin
// Procedural 3D CAD & Digital Twin Engine (Three.js)
//
// 13-Subagent Puzzle Architecture & Centrifuge Gold Standard Implementation:
// - Physical Bench Datum at Y = 0 (Y = 9.0 lab world)
// - Main Console: Metrohm 901 Titrando (142 mm W x 231 mm D x 227 mm H)
// - 803 Ti Stand + 801 Magnetic Stirrer Base with ceramic plate & clamp arm
// - Top-Mounted 800 Dosino Buret Drive on 1000 mL amber reagent reservoir
// - 100 mL Clear Borosilicate Titration Cell with PTFE 5-port head
// - Metrohm 6.0338.100 Double-Platinum Pin Electrode & 3Å Molecular Sieve Tube
// - Dynamic Fluid Meniscus with Parabolic Magnetic Stir Bar Vortex
// - Bench Duplex Power Outlet Box (Power_Receptacle_Duplex) with NEMA 5-15P plug
// - Dynamic High-DPI Canvas LCD (UI_LCD) with flipY=false & inverted UVs
// - Multi-tier Kinematic Exploded View (+80 to +120 mm clean vertical offsets)
// ============================================================================

import * as THREE from 'three';

// ----------------------------------------------------------------------------
// PBR Standard Materials
// ----------------------------------------------------------------------------
const MAT_CHASSIS_GRAY = new THREE.MeshStandardMaterial({
  color: 0xe6e9ed,
  roughness: 0.42,
  metalness: 0.10,
});

const MAT_CHASSIS_DARK = new THREE.MeshStandardMaterial({
  color: 0x1e2530,
  roughness: 0.60,
  metalness: 0.20,
});

const MAT_STAND_ALUM = new THREE.MeshStandardMaterial({
  color: 0xdde2e8,
  roughness: 0.35,
  metalness: 0.45,
});

const MAT_STAINLESS_ROD = new THREE.MeshStandardMaterial({
  color: 0xf1f5f9,
  roughness: 0.12,
  metalness: 0.92,
});

const MAT_CERAMIC_WHITE = new THREE.MeshStandardMaterial({
  color: 0xfbfcfe,
  roughness: 0.18,
  metalness: 0.05,
});

const MAT_PTFE_WHITE = new THREE.MeshStandardMaterial({
  color: 0xf4f6f8,
  roughness: 0.30,
  metalness: 0.02,
});

const MAT_DOSINO_HOUSING = new THREE.MeshStandardMaterial({
  color: 0xc8d1dc,
  roughness: 0.38,
  metalness: 0.15,
});

const MAT_CERAMIC_VALVE = new THREE.MeshStandardMaterial({
  color: 0xe2e8f0,
  roughness: 0.20,
  metalness: 0.10,
});

const MAT_BOROSILICATE_CLEAR = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.96,
  opacity: 1.0,
  transparent: true,
  roughness: 0.015,
  metalness: 0.0,
  ior: 1.52,
  thickness: 2.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.02,
  depthWrite: false,
  side: THREE.DoubleSide
});

const MAT_AMBER_GLASS = new THREE.MeshPhysicalMaterial({
  color: 0xd97706,
  transmission: 0.78,
  opacity: 1.0,
  transparent: true,
  roughness: 0.03,
  metalness: 0.05,
  ior: 1.54,
  thickness: 3.5,
  clearcoat: 0.9,
  clearcoatRoughness: 0.03,
  depthWrite: false,
  side: THREE.DoubleSide
});

const MAT_PLATINUM = new THREE.MeshStandardMaterial({
  color: 0xe2e8f0,
  roughness: 0.08,
  metalness: 0.95,
});

const MAT_GOLD_PIN = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  roughness: 0.15,
  metalness: 0.90,
});

const MAT_REAGENT_FLUID = new THREE.MeshPhysicalMaterial({
  color: 0xfef08a, // Karl Fischer yellowish/amber working reagent
  transmission: 0.88,
  opacity: 0.92,
  transparent: true,
  roughness: 0.02,
  ior: 1.33,
  depthWrite: false,
  side: THREE.DoubleSide
});

const MAT_RUBBER_BLACK = new THREE.MeshStandardMaterial({
  color: 0x111827,
  roughness: 0.85,
  metalness: 0.0,
});

const MAT_BRASS = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.25,
  metalness: 0.85,
});

const MAT_DUF_STEEL = new THREE.MeshStandardMaterial({
  color: 0x94a3b8,
  roughness: 0.25,
  metalness: 0.85,
});

const MAT_CORD_BLACK = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  roughness: 0.70,
  metalness: 0.05,
});

const MAT_BEADS_BLUE = new THREE.MeshStandardMaterial({
  color: 0x2563eb,
  roughness: 0.45,
  metalness: 0.05,
});

const MAT_BEADS_AMBER = new THREE.MeshStandardMaterial({
  color: 0xd97706,
  roughness: 0.45,
  metalness: 0.05,
});

// ----------------------------------------------------------------------------
// Helper Geometry Generators
// ----------------------------------------------------------------------------
function makeHexScrew(radius = 0.03, height = 0.04) {
  const group = new THREE.Group();
  const headGeo = new THREE.CylinderGeometry(radius, radius, height, 6);
  const head = new THREE.Mesh(headGeo, MAT_DUF_STEEL);
  head.castShadow = true;
  group.add(head);

  // Hex socket indent
  const sockGeo = new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, height * 0.4, 6);
  const sock = new THREE.Mesh(sockGeo, MAT_CHASSIS_DARK);
  sock.position.y = height * 0.35;
  group.add(sock);
  return group;
}

export class KarlFischer3D {
  constructor(container) {
    this.container = container;

    // Exploded view kinematic offsets
    this.exploded = false;
    this.explodeFactor = 0.0;
    this.targetExplodeFactor = 0.0;

    // Animated states
    this.isPluggedIn = true;
    this.powerSwitchOn = true;
    this.stirrerSpeedRpm = 600.0;
    this.stirrerRunning = true;
    this.stirAngle = 0.0;
    this.dosingActive = false;
    this.pistonDisplacement = 0.0; // 0 to 1
    this.valveAngle = 0.0;

    // Telemetry display values
    this.displayState = {
      state: 'STANDBY',
      potential_mv: 540.0,
      volume_dosed_ml: 0.0,
      drift_ug_min: 8.5,
      cell_water_ug: 15.0,
      sample_name: 'Water Standard 1.0%',
      sample_mass_g: 1.0000,
      water_content_pct: 0.0
    };

    // Sub-assemblies for exploded / kinematic animation
    this.animGroups = {
      consoleHousing: null,
      dosinoDrive: null,
      dosinoPiston: null,
      dosinoValve: null,
      standBase: null,
      vesselHead: null,
      stirPlate: null,
      stirFlea: null,
      meniscus: null,
      powerPlug: null,
      powerCordCurve: null,
      powerCordMesh: null,
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

    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    this.camera.position.set(3.8, 3.8, 6.2);

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

    this.keyLight = new THREE.DirectionalLight(0xfff7ed, 1.35);
    this.keyLight.position.set(3.5, 6.0, 4.0);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.bias = -0.0002;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 15.0;
    this.keyLight.shadow.camera.left = -3.5;
    this.keyLight.shadow.camera.right = 3.5;
    this.keyLight.shadow.camera.top = 3.5;
    this.keyLight.shadow.camera.bottom = -3.5;
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.DirectionalLight(0xdbeafe, 0.65);
    this.fillLight.position.set(-4.0, 4.0, 2.5);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.45);
    this.rimLight.position.set(0.0, 5.0, -4.5);
    this.scene.add(this.rimLight);

    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  initBenchAndRoom() {
    // Laboratory Epoxy Countertop at datum Y = 0 (thickness 0.12)
    const benchGeo = new THREE.BoxGeometry(10.0, 0.12, 5.0);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x141820,
      roughness: 0.38,
      metalness: 0.15
    });
    this.benchMesh = new THREE.Mesh(benchGeo, benchMat);
    this.benchMesh.name = 'INSTRUMENT_BENCH';
    this.benchMesh.position.set(0, -0.06, 0.8);
    this.benchMesh.receiveShadow = true;
    this.scene.add(this.benchMesh);

    // Front Bench Steel Edge Trim
    const trimGeo = new THREE.BoxGeometry(10.02, 0.03, 0.02);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, -0.015, 3.31);
    this.scene.add(trim);

    // Neutral Backsplash Wall behind bench (at Z = -1.70)
    const wallGeo = new THREE.PlaneGeometry(12.0, 6.0);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1b222c, roughness: 0.85 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 2.94, -1.70);
    wall.receiveShadow = true;
    this.scene.add(wall);

    // Elevated Lab Ceiling (high-bay, backface culled from above)
    const ceilGeo = new THREE.PlaneGeometry(14.0, 10.0);
    const ceilMat = new THREE.MeshBasicMaterial({ color: 0x111620, side: THREE.FrontSide });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, 16.0, 0);
    this.scene.add(ceil);
  }

  initPowerDuplexBox() {
    // Cast Aluminum Duplex Receptacle Box positioned behind the console at (-1.35, 0, -0.90)
    this.duplexBoxGroup = new THREE.Group();
    this.duplexBoxGroup.position.set(-1.35, 0.0, -0.85);

    // Box body: 54mm W x 72mm D x 36mm H (0.54 x 0.36 x 0.72)
    const boxGeo = new THREE.BoxGeometry(0.54, 0.36, 0.72);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.65, roughness: 0.35 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = 0.18;
    box.castShadow = true;
    box.receiveShadow = true;
    box.name = 'Power_Receptacle_Duplex';
    this.duplexBoxGroup.add(box);

    // Brushed Stainless Faceplate
    const plateGeo = new THREE.BoxGeometry(0.56, 0.02, 0.74);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.20 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = 0.37;
    this.duplexBoxGroup.add(plate);

    // Dual NEMA 5-15R Receptacle Ports (Ground Pin UP)
    for (let offsetZ of [-0.18, 0.18]) {
      const recGroup = new THREE.Group();
      recGroup.position.set(0, 0.38, offsetZ);

      // Receptacle circular face
      const faceGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.015, 24);
      const faceMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
      const face = new THREE.Mesh(faceGeo, faceMat);
      recGroup.add(face);

      // Ground D-hole (UP: +Z in our local plate coords)
      const gHole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 12), MAT_CHASSIS_DARK);
      gHole.position.set(0, 0.01, -0.06);
      recGroup.add(gHole);

      // Hot & Neutral parallel slots
      const slotMat = MAT_CHASSIS_DARK;
      const hotSlot = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.03, 0.045), slotMat);
      hotSlot.position.set(-0.045, 0.01, 0.03);
      recGroup.add(hotSlot);

      const neuSlot = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.03, 0.055), slotMat);
      neuSlot.position.set(0.045, 0.01, 0.03);
      recGroup.add(neuSlot);

      this.duplexBoxGroup.add(recGroup);
    }

    // Molded NEMA 5-15P Power Plug
    this.plugGroup = new THREE.Group();
    this.plugGroup.name = 'Part_PowerPlugNEMA';
    this.plugGroup.position.set(0, 0.38, -0.18); // Plugged into front socket

    const plugBody = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.28), MAT_RUBBER_BLACK);
    plugBody.position.y = 0.11;
    plugBody.castShadow = true;
    this.plugGroup.add(plugBody);

    const bootGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.12, 12);
    const boot = new THREE.Mesh(bootGeo, MAT_RUBBER_BLACK);
    boot.rotation.x = Math.PI / 2;
    boot.position.set(0, 0.11, 0.18);
    this.plugGroup.add(boot);

    this.duplexBoxGroup.add(this.plugGroup);
    this.scene.add(this.duplexBoxGroup);
    this.animGroups.powerPlug = this.plugGroup;
    this.interactiveMeshes.push(plugBody);

    // Build Power Cord from Plug to Instrument IEC Inlet
    this.buildPowerCord();
  }

  buildPowerCord() {
    if (this.cordMesh) {
      this.scene.remove(this.cordMesh);
    }
    // Curve running from plug boot back and into instrument rear IEC socket at (-0.45, 0.40, -0.95)
    const plugWorld = this.duplexBoxGroup.position.clone().add(new THREE.Vector3(0, 0.45, 0.10));
    const inletWorld = new THREE.Vector3(-0.45, 0.40, -0.95);

    const points = this.isPluggedIn ? [
      plugWorld,
      plugWorld.clone().add(new THREE.Vector3(0.3, -0.32, 0.1)),
      new THREE.Vector3(-0.95, 0.04, -0.65),
      new THREE.Vector3(-0.65, 0.04, -0.85),
      inletWorld.clone().add(new THREE.Vector3(0, -0.15, 0.15)),
      inletWorld
    ] : [
      this.duplexBoxGroup.position.clone().add(new THREE.Vector3(0.25, 0.08, 0.2)),
      new THREE.Vector3(-0.95, 0.04, -0.65),
      new THREE.Vector3(-0.65, 0.04, -0.85),
      inletWorld.clone().add(new THREE.Vector3(0, -0.15, 0.15)),
      inletWorld
    ];

    const curve = new THREE.CatmullRomCurve3(points);
    const cordGeo = new THREE.TubeGeometry(curve, 32, 0.038, 8, false);
    this.cordMesh = new THREE.Mesh(cordGeo, MAT_CORD_BLACK);
    this.cordMesh.castShadow = true;
    this.cordMesh.name = 'Cable_ACPowerCord';
    this.scene.add(this.cordMesh);
  }

  togglePlug() {
    this.isPluggedIn = !this.isPluggedIn;
    if (this.animGroups.powerPlug) {
      if (this.isPluggedIn) {
        this.animGroups.powerPlug.position.set(0, 0.38, -0.18);
        this.animGroups.powerPlug.rotation.set(0, 0, 0);
      } else {
        // Unplug and rest casually on bench beside box
        this.animGroups.powerPlug.position.set(0.35, 0.12, 0.25);
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
    this.lcdCanvas.height = 768;
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

    // Background: If unpowered, deep blackout (DIAG-014)
    if (!this.isPluggedIn || !this.powerSwitchOn) {
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#1e293b';
      ctx.font = '600 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NO AC POWER CONTINUITY', w / 2, h / 2 - 20);
      ctx.font = '400 22px monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText('CONNECT NEMA 5-15P PLUG & REAR ROCKER', w / 2, h / 2 + 30);
      this.lcdTexture.needsUpdate = true;
      return;
    }

    // Active Metrohm High-Tech Laboratory UI
    ctx.fillStyle = '#0a1018';
    ctx.fillRect(0, 0, w, h);

    // Top Header Status Banner
    const isReady = this.displayState.state === 'READY';
    const isTitrating = this.displayState.state === 'TITRATING';
    const isComplete = this.displayState.state === 'COMPLETE';

    let bannerColor = '#2563eb';
    if (isReady) bannerColor = '#059669';
    if (isTitrating) bannerColor = '#d97706';
    if (isComplete) bannerColor = '#10b981';

    ctx.fillStyle = '#111927';
    ctx.fillRect(0, 0, w, 84);

    ctx.fillStyle = bannerColor;
    ctx.fillRect(24, 20, 160, 44);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.displayState.state, 104, 49);

    // Titrator Title & Method Name
    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Metrohm 901 Titrando · Volumetric Karl Fischer', 210, 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 18px monospace';
    ctx.fillText(`Method: KF_VOL_STD · Hydranal-5 · Drift: ${this.displayState.drift_ug_min.toFixed(1)} µg/min`, 210, 68);

    // Main Telemetry Readout Grid
    // 1. Potential U (mV)
    ctx.fillStyle = '#131e2e';
    ctx.fillRect(24, 104, 300, 150);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(24, 104, 300, 150);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ELECTRODE POTENTIAL', 44, 134);

    ctx.fillStyle = this.displayState.potential_mv <= 100.0 ? '#34d399' : '#38bdf8';
    ctx.font = '700 52px monospace';
    ctx.fillText(`${this.displayState.potential_mv.toFixed(0)}`, 44, 200);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 20px monospace';
    ctx.fillText('mV (Ipol = 20 µA)', 170, 200);

    // 2. Dosed Titrant Volume
    ctx.fillStyle = '#131e2e';
    ctx.fillRect(344, 104, 320, 150);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(344, 104, 320, 150);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px sans-serif';
    ctx.fillText('TITRANT CONSUMED', 364, 134);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 52px monospace';
    ctx.fillText(`${this.displayState.volume_dosed_ml.toFixed(4)}`, 364, 200);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 20px monospace';
    ctx.fillText('mL (Dosino 800)', 560, 200);

    // 3. Water Mass / Content
    ctx.fillStyle = '#131e2e';
    ctx.fillRect(684, 104, 316, 150);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(684, 104, 316, 150);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px sans-serif';
    ctx.fillText('WATER CONTENT', 704, 134);

    ctx.fillStyle = '#a78bfa';
    ctx.font = '700 48px monospace';
    ctx.fillText(`${this.displayState.water_content_pct.toFixed(3)} %`, 704, 198);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 18px monospace';
    ctx.fillText(`Sample: ${this.displayState.sample_mass_g.toFixed(4)} g`, 704, 234);

    // Live Titration Curve Graph (Potential U vs Time)
    const gx = 24, gy = 276, gw = 976, gh = 380;
    ctx.fillStyle = '#0d1522';
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(gx, gy, gw, gh);

    // Grid lines & Axis Labels
    ctx.strokeStyle = '#1a2436';
    ctx.lineWidth = 1;
    for (let y = gy + 40; y < gy + gh; y += 60) {
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.lineTo(gx + gw, y);
      ctx.stroke();
    }
    for (let x = gx + 80; x < gx + gw; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x, gy + gh);
      ctx.stroke();
    }

    // Graph Title
    ctx.fillStyle = '#64748b';
    ctx.font = '500 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Bipotentiometric Titration Depolarization Curve · U [mV] vs. Time [s]', gx + 20, gy + 32);

    // Endpoint Cutoff Line at 100 mV
    const yCutoff = gy + gh - (100.0 / 650.0) * (gh - 60) - 20;
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(gx + 60, yCutoff);
    ctx.lineTo(gx + gw - 20, yCutoff);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.font = '600 14px monospace';
    ctx.fillText('U_EP = 100 mV', gx + gw - 130, yCutoff - 8);

    // Draw Dynamic Curve
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    const numPoints = 80;
    for (let i = 0; i < numPoints; i++) {
      const px = gx + 60 + (i / numPoints) * (gw - 100);
      let pot = 560.0;
      if (isTitrating) {
        // Curve dropping towards current potential
        const prog = i / numPoints;
        pot = 560.0 - (560.0 - this.displayState.potential_mv) * Math.pow(prog, 1.8);
      } else if (isComplete || isReady) {
        // S-curve plateau
        const midpoint = 0.65;
        const s = 1.0 / (1.0 + Math.exp(-12 * ((i / numPoints) - midpoint)));
        pot = 560.0 - (560.0 - this.displayState.potential_mv) * s;
      }
      const py = gy + gh - (pot / 650.0) * (gh - 60) - 20;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Bottom Soft Navigation Bar
    ctx.fillStyle = '#111927';
    ctx.fillRect(0, 676, w, 92);

    const buttons = [
      { label: 'CONDITION', key: 'cond', color: '#3b82f6' },
      { label: 'SAMPLE INJECT', key: 'inject', color: '#10b981' },
      { label: 'START TITR', key: 'start', color: '#059669' },
      { label: 'STOP', key: 'stop', color: '#ef4444' },
      { label: 'DOSINO PRIME', key: 'prime', color: '#6366f1' }
    ];

    const bw = 175, bh = 54;
    buttons.forEach((btn, idx) => {
      const bx = 30 + idx * 190;
      const by = 694;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = btn.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 17px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(btn.label, bx + bw / 2, by + 34);
    });

    this.lcdTexture.needsUpdate = true;
  }

  // ----------------------------------------------------------------------------
  // Exhaustive Procedural 3D CAD Assembly
  // ----------------------------------------------------------------------------
  buildModel() {
    this.root = new THREE.Group();
    this.root.name = 'Twin_MetrohmKarlFischer';
    this.scene.add(this.root);

    // 1. Metrohm 901 Titrando Main Console (Right side: centered around X = -0.45)
    this.buildMainConsole();

    // 2. 803 Ti Stand & 801 Magnetic Stirrer Base (Left side: centered around X = 0.90)
    this.buildStandAndStirrer();

    // 3. 100 mL Borosilicate Titration Cell & Electrodes
    this.buildTitrationCellStation();

    // 4. Amber 1000 mL Reagent Reservoir & 800 Dosino Dispenser
    this.buildReagentAndDosino();

    // 5. Connecting Capillary & Coaxial Cables
    this.buildTubingAndWiring();
  }

  buildMainConsole() {
    this.consoleGroup = new THREE.Group();
    this.consoleGroup.name = 'Body_Chassis';
    this.consoleGroup.position.set(-0.45, 0, 0);

    // Lower unibody housing: 142mm W x 231mm D x 140mm H (1.42 x 1.40 x 2.31)
    const baseGeo = new THREE.BoxGeometry(1.42, 1.40, 2.31);
    const baseMesh = new THREE.Mesh(baseGeo, MAT_CHASSIS_GRAY);
    baseMesh.position.y = 0.70;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.consoleGroup.add(baseMesh);

    // Sloped upper console face (25 degree slope forward)
    const slopedGeo = new THREE.BoxGeometry(1.40, 1.10, 1.25);
    const slopedMesh = new THREE.Mesh(slopedGeo, MAT_CHASSIS_GRAY);
    slopedMesh.rotation.x = -Math.PI * 0.14; // sloped back towards user
    slopedMesh.position.set(0, 1.70, 0.15);
    slopedMesh.castShadow = true;
    this.consoleGroup.add(slopedMesh);

    // Recessed Touchscreen Bezel Pocket mounted directly on sloped front face (Z = +0.625)
    const bezelPocket = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.92, 0.01), MAT_CHASSIS_DARK);
    bezelPocket.position.set(0, 0.05, 0.626);
    slopedMesh.add(bezelPocket);

    // UI_LCD Quad Seated in Recessed Pocket with positive relative Z clearance (DIAG-002, DIAG-005)
    const lcdGeo = new THREE.PlaneGeometry(1.10, 0.84);
    // Invert buffer UVs: uv.setY(i, 1.0 - uv.getY(i)) (DIAG-005)
    const uvAttr = lcdGeo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setY(i, 1.0 - uvAttr.getY(i));
    }
    uvAttr.needsUpdate = true;

    this.matLCD.side = THREE.DoubleSide;
    this.lcdMesh = new THREE.Mesh(lcdGeo, this.matLCD);
    this.lcdMesh.name = 'UI_LCD';
    this.lcdMesh.position.set(0, 0.05, 0.635);
    this.lcdMesh.renderOrder = 2;
    slopedMesh.add(this.lcdMesh);
    this.interactiveMeshes.push(this.lcdMesh);

    // Anti-Reflective Optical Glass Screen Lens
    const lensGeo = new THREE.PlaneGeometry(1.14, 0.88);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
      roughness: 0.05,
      metalness: 0.1,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.name = 'Glass_LCDLens';
    lens.position.set(0, 0.05, 0.638);
    lens.renderOrder = 3;
    slopedMesh.add(lens);

    // Official SREdesigns Brand Badge in Dedicated Recessed Pocket (Rule 3)
    const badgePocket = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.14, 0.04), MAT_CHASSIS_DARK);
    badgePocket.position.set(0, 0.35, 1.16);
    this.consoleGroup.add(badgePocket);

    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 512;
    badgeCanvas.height = 128;
    const bctx = badgeCanvas.getContext('2d');
    bctx.fillStyle = '#0f172a';
    bctx.fillRect(0, 0, 512, 128);
    bctx.fillStyle = '#38bdf8';
    bctx.font = '700 48px -apple-system, sans-serif';
    bctx.textAlign = 'center';
    bctx.fillText('SREdesigns', 256, 78);
    bctx.fillStyle = '#94a3b8';
    bctx.font = '500 20px monospace';
    bctx.fillText('METROHM 901 PRECISION', 256, 110);

    const badgeTex = new THREE.CanvasTexture(badgeCanvas);
    const badgeMat = new THREE.MeshBasicMaterial({ map: badgeTex });
    const badgeMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.40, 0.10), badgeMat);
    badgeMesh.name = 'Badge_SREdesigns';
    badgeMesh.position.set(0, 0.35, 1.185);
    this.consoleGroup.add(badgeMesh);

    // Tactile Push Buttons along Front Chin: Start, Stop, Stir, Dose, Tare (0.8-1.2mm depress)
    this.buttons = [];
    const btnConfigs = [
      { name: 'Btn_Start', label: 'START', color: 0x10b981, x: -0.44 },
      { name: 'Btn_Stop', label: 'STOP', color: 0xef4444, x: -0.22 },
      { name: 'Btn_Stir', label: 'STIR', color: 0x3b82f6, x: 0.0 },
      { name: 'Btn_Dose', label: 'DOSE', color: 0xf59e0b, x: 0.22 },
      { name: 'Btn_Tare', label: 'TARE', color: 0x64748b, x: 0.44 }
    ];

    btnConfigs.forEach(cfg => {
      const btnGroup = new THREE.Group();
      btnGroup.name = cfg.name;
      btnGroup.position.set(cfg.x, 0.18, 1.16);

      const btnMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.05), new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.35
      }));
      btnMesh.castShadow = true;
      btnGroup.add(btnMesh);

      this.consoleGroup.add(btnGroup);
      this.buttons.push(btnGroup);
      this.interactiveMeshes.push(btnMesh);
    });

    // Rear I/O Panel: IEC C14 Power Inlet & Rocker Power Switch (Rule 9)
    const rearPanel = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.0, 0.05), MAT_CHASSIS_DARK);
    rearPanel.position.set(0, 0.70, -1.16);
    this.consoleGroup.add(rearPanel);

    // Rocker Switch
    this.switchGroup = new THREE.Group();
    this.switchGroup.name = 'Switch_Power';
    this.switchGroup.position.set(0.38, 0.40, -1.18);

    const swFrame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.26, 0.04), MAT_CHASSIS_DARK);
    this.switchGroup.add(swFrame);

    const swRocker = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.20, 0.06), new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.3
    }));
    swRocker.rotation.x = this.powerSwitchOn ? -0.25 : 0.25;
    this.switchGroup.add(swRocker);
    this.animGroups.switchRocker = swRocker;
    this.interactiveMeshes.push(swRocker);
    this.consoleGroup.add(this.switchGroup);

    // IEC C14 Inlet Socket
    const iecSocket = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.30, 0.08), MAT_CHASSIS_DARK);
    iecSocket.position.set(-0.35, 0.40, -1.18);
    this.consoleGroup.add(iecSocket);

    // 4 Threaded Leveling Feet (Resting at Datum Y = 0)
    const footPositions = [
      [-0.58, -0.98], [0.58, -0.98],
      [-0.58, 0.98], [0.58, 0.98]
    ];
    footPositions.forEach(([fx, fz], idx) => {
      const foot = new THREE.Group();
      foot.name = `Foot_Leveling_${idx}`;
      foot.position.set(fx, 0.04, fz);

      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.10, 0.08, 16), MAT_RUBBER_BLACK);
      foot.add(pad);

      const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.08, 12), MAT_DUF_STEEL);
      stud.position.y = 0.06;
      foot.add(stud);

      this.consoleGroup.add(foot);
    });

    // 3D Hex Fasteners on Top & Flanks
    [[-0.62, 1.35, -0.9], [0.62, 1.35, -0.9], [-0.62, 1.35, 0.9], [0.62, 1.35, 0.9]].forEach(([sx, sy, sz], idx) => {
      const screw = makeHexScrew(0.03, 0.04);
      screw.position.set(sx, sy, sz);
      screw.name = `Fastener_HexM4_Console_${idx}`;
      this.consoleGroup.add(screw);
    });

    this.root.add(this.consoleGroup);
    this.animGroups.consoleHousing = this.consoleGroup;
  }

  buildStandAndStirrer() {
    // Integrated 803 Ti Stand + 801 Magnetic Stirrer (Operator Left: X ~ 0.90)
    this.standGroup = new THREE.Group();
    this.standGroup.name = 'Body_StandBase';
    this.standGroup.position.set(0.95, 0, 0);

    // Cast Aluminum Base: 150mm W x 220mm D x 58mm H (1.50 x 0.58 x 2.20)
    const baseGeo = new THREE.BoxGeometry(1.50, 0.58, 2.20);
    const baseMesh = new THREE.Mesh(baseGeo, MAT_STAND_ALUM);
    baseMesh.position.y = 0.29;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.standGroup.add(baseMesh);

    // Magnetic Stirrer Plate Area (Centered on front half: Z = 0.35)
    this.stirPlateGroup = new THREE.Group();
    this.stirPlateGroup.name = 'Plate_MagneticStirrer';
    this.stirPlateGroup.position.set(0, 0.58, 0.35);

    // Stainless Bezel Ring
    const bezelGeo = new THREE.CylinderGeometry(0.50, 0.50, 0.04, 32);
    const bezel = new THREE.Mesh(bezelGeo, MAT_DUF_STEEL);
    this.stirPlateGroup.add(bezel);

    // Ceramic White Inlay Disc
    const inlayGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.045, 32);
    const inlay = new THREE.Mesh(inlayGeo, MAT_CERAMIC_WHITE);
    inlay.position.y = 0.01;
    inlay.receiveShadow = true;
    this.stirPlateGroup.add(inlay);
    this.standGroup.add(this.stirPlateGroup);
    this.animGroups.stirPlate = this.stirPlateGroup;

    // Knurled Speed Potentiometer Dial (Knob_StirSpeed) on Stand Front Chin
    this.knobGroup = new THREE.Group();
    this.knobGroup.name = 'Knob_StirSpeed';
    this.knobGroup.position.set(0, 0.32, 1.11);

    const knobMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24), MAT_CHASSIS_DARK);
    knobMesh.rotation.x = Math.PI / 2;
    this.knobGroup.add(knobMesh);

    // Indicator Notch
    const notch = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.06, 0.09), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    notch.position.set(0, 0.05, 0);
    this.knobGroup.add(notch);

    this.standGroup.add(this.knobGroup);
    this.interactiveMeshes.push(knobMesh);

    // Vertical Stand Column Rod (Shaft_StandRod: Ø12mm x 350mm H)
    const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.50, 24);
    const rodMesh = new THREE.Mesh(rodGeo, MAT_STAINLESS_ROD);
    rodMesh.name = 'Shaft_StandRod';
    rodMesh.position.set(0.55, 1.75, -0.65);
    rodMesh.castShadow = true;
    this.standGroup.add(rodMesh);

    // Heavy Hex Lock Nut Anchoring Rod into Base
    const nutGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.10, 6);
    const nut = new THREE.Mesh(nutGeo, MAT_DUF_STEEL);
    nut.position.set(0.55, 0.63, -0.65);
    this.standGroup.add(nut);

    // Clamping Arm Bracket (Bracket_VesselClamp) Holding Cell Head
    this.clampGroup = new THREE.Group();
    this.clampGroup.name = 'Bracket_VesselClamp';
    this.clampGroup.position.set(0.55, 1.65, -0.65);

    const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.16, 16), MAT_STAND_ALUM);
    this.clampGroup.add(boss);

    const armGeo = new THREE.BoxGeometry(0.65, 0.08, 0.12);
    const arm = new THREE.Mesh(armGeo, MAT_STAND_ALUM);
    arm.position.set(-0.30, 0, 0.50);
    arm.rotation.y = -Math.PI * 0.32;
    this.clampGroup.add(arm);

    // Knurled Brass Thumbscrew
    const thumbGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.14, 16);
    const thumb = new THREE.Mesh(thumbGeo, MAT_BRASS);
    thumb.position.set(0, 0, -0.12);
    thumb.rotation.x = Math.PI / 2;
    this.clampGroup.add(thumb);

    this.standGroup.add(this.clampGroup);
    this.root.add(this.standGroup);
    this.animGroups.standBase = this.standGroup;
  }

  buildTitrationCellStation() {
    // Borosilicate Titration Cell resting on Stirrer Plate at (X = 0.95, Z = 0.35)
    this.cellGroup = new THREE.Group();
    this.cellGroup.name = 'Station_TitrationCell';
    this.cellGroup.position.set(0.95, 0.62, 0.35);

    // 100 mL Cylindrical Borosilicate Glass Vessel
    // Ø65mm x 110mm H (0.65 dia, 1.10 H)
    const vesselGeo = new THREE.CylinderGeometry(0.325, 0.325, 1.10, 32, 1, true);
    const vessel = new THREE.Mesh(vesselGeo, MAT_BOROSILICATE_CLEAR);
    vessel.name = 'Glass_TitrationCell';
    vessel.position.y = 0.55;
    vessel.castShadow = true;
    this.cellGroup.add(vessel);

    // Flat Glass Bottom
    const bottomGeo = new THREE.CylinderGeometry(0.325, 0.325, 0.04, 32);
    const bottom = new THREE.Mesh(bottomGeo, MAT_BOROSILICATE_CLEAR);
    bottom.position.y = 0.02;
    this.cellGroup.add(bottom);

    // Dynamic Reagent Fluid Inside Cell (Height ~ 0.50)
    const fluidGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.50, 32);
    this.fluidMesh = new THREE.Mesh(fluidGeo, MAT_REAGENT_FLUID);
    this.fluidMesh.name = 'Fluid_ReagentBatch';
    this.fluidMesh.position.y = 0.27;
    this.cellGroup.add(this.fluidMesh);

    // Dynamic Parabolic Vortex Meniscus
    const coneGeo = new THREE.ConeGeometry(0.24, 0.28, 32, 1, true);
    coneGeo.rotateX(Math.PI);
    this.vortexMesh = new THREE.Mesh(coneGeo, MAT_REAGENT_FLUID);
    this.vortexMesh.name = 'Fluid_MeniscusVortex';
    this.vortexMesh.position.y = 0.52;
    this.cellGroup.add(this.vortexMesh);
    this.animGroups.meniscus = this.vortexMesh;

    // Octagonal PTFE Magnetic Stir Flea (Ø6mm x 20mm -> 0.06 x 0.20)
    this.fleaGroup = new THREE.Group();
    this.fleaGroup.name = 'Part_MagneticStirBar';
    this.fleaGroup.position.set(0, 0.05, 0);

    const fleaMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.20, 8), MAT_PTFE_WHITE);
    fleaMesh.rotation.z = Math.PI / 2;
    fleaMesh.castShadow = true;
    this.fleaGroup.add(fleaMesh);
    this.cellGroup.add(this.fleaGroup);
    this.animGroups.stirFlea = this.fleaGroup;

    // PTFE 5-Port Multi-Neck Sealing Vessel Head (Lid_VesselPTFE)
    this.vesselHeadGroup = new THREE.Group();
    this.vesselHeadGroup.name = 'Lid_VesselPTFE';
    this.vesselHeadGroup.position.set(0, 1.10, 0);

    const lidGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.16, 32);
    const lidMesh = new THREE.Mesh(lidGeo, MAT_PTFE_WHITE);
    lidMesh.castShadow = true;
    this.vesselHeadGroup.add(lidMesh);

    // Port 1 (Center): Double-Platinum Pin Electrode (Metrohm 6.0338.100)
    const elecGroup = new THREE.Group();
    elecGroup.name = 'Electrode_DoublePt_Assembly';
    elecGroup.position.set(0, 0.08, 0);

    const elecBodyGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.20, 16);
    const elecBody = new THREE.Mesh(elecBodyGeo, MAT_BOROSILICATE_CLEAR);
    elecBody.name = 'Glass_ElectrodeBody';
    elecBody.position.y = -0.30;
    elecGroup.add(elecBody);

    // Blue Molded Cap with Gold Coaxial Terminal
    const capGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.20, 16);
    const capMesh = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35 }));
    capMesh.position.y = 0.40;
    elecGroup.add(capMesh);

    const goldPin = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 12), MAT_GOLD_PIN);
    goldPin.position.y = 0.54;
    elecGroup.add(goldPin);

    // Twin Platinum Pins (Ø1mm x 12mm equivalent: 0.01 x 0.12)
    for (let px of [-0.02, 0.02]) {
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.12, 8), MAT_PLATINUM);
      pin.name = 'Metal_PlatinumPins';
      pin.position.set(px, -0.92, 0);
      elecGroup.add(pin);
    }
    this.vesselHeadGroup.add(elecGroup);

    // Port 2 (Rear-Right): Molecular Sieve Drying Tube
    const dryingGroup = new THREE.Group();
    dryingGroup.name = 'Assembly_DryingTube';
    dryingGroup.position.set(0.18, 0.08, -0.15);

    const tubeGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.95, 16);
    const tubeMesh = new THREE.Mesh(tubeGeo, MAT_BOROSILICATE_CLEAR);
    tubeMesh.name = 'Glass_DryingTube';
    tubeMesh.position.y = 0.45;
    dryingGroup.add(tubeMesh);

    // Red Plastic Screw Cap with Porous Polyethylene Filter
    const dCap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0xb91c1c }));
    dCap.position.y = 0.95;
    dryingGroup.add(dCap);

    // Procedural 3Å Molecular Sieve Desiccant Spheres Inside Tube
    const beadGeo = new THREE.SphereGeometry(0.022, 8, 8);
    for (let b = 0; b < 40; b++) {
      const isAmber = (b % 4 === 0);
      const bead = new THREE.Mesh(beadGeo, isAmber ? MAT_BEADS_AMBER : MAT_BEADS_BLUE);
      const angle = Math.random() * Math.PI * 2;
      const rad = Math.random() * 0.07;
      bead.position.set(
        Math.cos(angle) * rad,
        0.12 + (b / 40) * 0.70,
        Math.sin(angle) * rad
      );
      dryingGroup.add(bead);
    }
    this.vesselHeadGroup.add(dryingGroup);

    // Port 3 (Front-Right): Antidiffusion Dosing Tip & Delivery Capillary Adapter
    const tipGroup = new THREE.Group();
    tipGroup.name = 'Part_AntidiffusionTip';
    tipGroup.position.set(0.18, 0.08, 0.15);

    const tipBody = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 12), MAT_PTFE_WHITE);
    tipBody.position.y = -0.30;
    tipGroup.add(tipBody);

    const barb = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 12), MAT_STAND_ALUM);
    barb.position.y = 0.15;
    tipGroup.add(barb);
    this.vesselHeadGroup.add(tipGroup);

    // Port 4 (Front-Left): Septum Injection Port for Syringe Standard Addition
    const septumGroup = new THREE.Group();
    septumGroup.name = 'Cap_SeptumInjection';
    septumGroup.position.set(-0.18, 0.08, 0.15);

    const septumCap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x0369a1 }));
    septumCap.position.y = 0.06;
    septumGroup.add(septumCap);

    const septumRubber = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.015, 12), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
    septumRubber.position.y = 0.105;
    septumGroup.add(septumRubber);
    this.vesselHeadGroup.add(septumGroup);

    this.cellGroup.add(this.vesselHeadGroup);
    this.root.add(this.cellGroup);
    this.animGroups.vesselHead = this.vesselHeadGroup;
  }

  buildReagentAndDosino() {
    // Amber 1000 mL Reagent Bottle with Top-Mounted 800 Dosino Dispenser (Left-Rear: X = 1.95, Z = -0.15)
    this.dosinoStationGroup = new THREE.Group();
    this.dosinoStationGroup.name = 'Station_ReagentDosino';
    this.dosinoStationGroup.position.set(1.95, 0, -0.15);

    // 1000 mL Amber Borosilicate Reagent Bottle (Ø101mm x 225mm H -> 1.01 dia, 2.25 H)
    const bottleGeo = new THREE.CylinderGeometry(0.505, 0.505, 1.75, 32);
    const bottleMesh = new THREE.Mesh(bottleGeo, MAT_AMBER_GLASS);
    bottleMesh.name = 'Glass_ReagentBottle';
    bottleMesh.position.y = 0.88;
    bottleMesh.castShadow = true;
    this.dosinoStationGroup.add(bottleMesh);

    // Bottle Neck with GL45 Thread
    const neckGeo = new THREE.CylinderGeometry(0.225, 0.28, 0.35, 32);
    const neck = new THREE.Mesh(neckGeo, MAT_AMBER_GLASS);
    neck.position.y = 1.88;
    this.dosinoStationGroup.add(neck);

    // Amber Liquid Level inside Bottle (approx 70% full)
    const liquidGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.20, 24);
    const liquid = new THREE.Mesh(liquidGeo, MAT_REAGENT_FLUID);
    liquid.position.y = 0.65;
    this.dosinoStationGroup.add(liquid);

    // Reagent Bottle White GL45 / SREdesigns Silkscreen Label
    const labelGeo = new THREE.CylinderGeometry(0.51, 0.51, 0.90, 32, 1, true, 0, Math.PI * 0.8);
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 256;
    const lctx = labelCanvas.getContext('2d');
    lctx.fillStyle = '#f8fafc';
    lctx.fillRect(0, 0, 512, 256);
    lctx.fillStyle = '#0f172a';
    lctx.font = '700 36px sans-serif';
    lctx.fillText('HYDRANAL™-Composite 5', 30, 60);
    lctx.fillStyle = '#475569';
    lctx.font = '500 22px sans-serif';
    lctx.fillText('One-component reagent for volumetric KF', 30, 100);
    lctx.fillText('Titer: 4.985 mg H2O/mL · Flammable', 30, 140);
    lctx.fillStyle = '#dc2626';
    lctx.font = '700 24px monospace';
    lctx.fillText('GLP CERTIFIED LOT #2026-KF901', 30, 210);

    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, side: THREE.DoubleSide });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = 0.85;
    labelMesh.rotation.y = Math.PI * 0.7;
    this.dosinoStationGroup.add(labelMesh);

    // Top-Mounted Metrohm 800 Dosino Dispensing Unit (Inverted drive mounted directly on bottle neck)
    this.dosinoDriveGroup = new THREE.Group();
    this.dosinoDriveGroup.name = 'Body_DosinoDrive';
    this.dosinoDriveGroup.position.set(0, 2.05, 0);

    // GL45 Screw Collar Mount
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 24), MAT_PTFE_WHITE);
    this.dosinoDriveGroup.add(collar);

    // Dosino Cylindrical Motor & Piston Housing (Ø48mm x 150mm H -> 0.48 x 1.50)
    const dosinoBodyGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.50, 24);
    const dosinoBody = new THREE.Mesh(dosinoBodyGeo, MAT_DOSINO_HOUSING);
    dosinoBody.position.y = 0.80;
    dosinoBody.castShadow = true;
    this.dosinoDriveGroup.add(dosinoBody);

    // Dosino Status Ring LED (Cyan/Green active indicator)
    const ringGeo = new THREE.TorusGeometry(0.245, 0.015, 12, 32);
    this.dosinoLed = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x00f3ff }));
    this.dosinoLed.rotation.x = Math.PI / 2;
    this.dosinoLed.position.y = 1.48;
    this.dosinoDriveGroup.add(this.dosinoLed);

    // 4-Port Ceramic Switching Disk Valve (Valve_DosinoDisk) at Top of Dosino
    this.valveGroup = new THREE.Group();
    this.valveGroup.name = 'Valve_DosinoDisk';
    this.valveGroup.position.set(0, 1.58, 0);

    const valveHead = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 24), MAT_CERAMIC_VALVE);
    this.valveGroup.add(valveHead);

    // 4 Radial Tube Ports (1, 2, 3, 4 spaced at 90 degrees)
    for (let p = 0; p < 4; p++) {
      const angle = (p * Math.PI) / 2;
      const port = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.14, 12), MAT_DUF_STEEL);
      port.rotation.z = Math.PI / 2;
      port.rotation.y = angle;
      port.position.set(Math.cos(angle) * 0.32, 0, Math.sin(angle) * 0.32);
      this.valveGroup.add(port);
    }
    this.dosinoDriveGroup.add(this.valveGroup);
    this.animGroups.dosinoValve = this.valveGroup;

    // Internal Motorized Piston Head & Lead Screw (Shaft_DosinoPiston)
    this.pistonGroup = new THREE.Group();
    this.pistonGroup.name = 'Shaft_DosinoPiston';
    this.pistonGroup.position.set(0, 0.25, 0);

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.10, 16), MAT_STAINLESS_ROD);
    this.pistonGroup.add(rod);

    const pistonHead = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.08, 24), MAT_PTFE_WHITE);
    pistonHead.position.y = -0.50;
    this.pistonGroup.add(pistonHead);

    this.dosinoDriveGroup.add(this.pistonGroup);
    this.animGroups.dosinoPiston = this.pistonGroup;

    this.dosinoStationGroup.add(this.dosinoDriveGroup);
    this.root.add(this.dosinoStationGroup);
    this.animGroups.dosinoDrive = this.dosinoDriveGroup;
  }

  buildTubingAndWiring() {
    // Fluoropolymer Delivery Capillary Line from Dosino Port 1 to Titration Cell Tip
    const p1 = new THREE.Vector3(1.63, 3.63, -0.15); // Dosino valve port
    const p2 = new THREE.Vector3(1.40, 3.20, 0.10);
    const p3 = new THREE.Vector3(1.25, 2.20, 0.35);
    const p4 = new THREE.Vector3(1.13, 1.88, 0.50); // Vessel tip

    const capCurve = new THREE.CatmullRomCurve3([p1, p2, p3, p4]);
    const capGeo = new THREE.TubeGeometry(capCurve, 24, 0.016, 8, false);
    const capMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      roughness: 0.1,
      transparent: true
    });
    const capTube = new THREE.Mesh(capGeo, capMat);
    capTube.name = 'Tube_DeliveryCapillary';
    this.root.add(capTube);

    // Coaxial Electrode Cable from Electrode Head back to Console BNC Socket
    const e1 = new THREE.Vector3(0.95, 2.25, 0.35);
    const e2 = new THREE.Vector3(0.60, 2.50, 0.10);
    const e3 = new THREE.Vector3(0.10, 2.10, -0.60);
    const e4 = new THREE.Vector3(-0.45, 1.20, -1.16);

    const bncCurve = new THREE.CatmullRomCurve3([e1, e2, e3, e4]);
    const bncGeo = new THREE.TubeGeometry(bncCurve, 24, 0.022, 8, false);
    const bncMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 });
    const bncCable = new THREE.Mesh(bncGeo, bncMat);
    bncCable.name = 'Cable_ElectrodeCoaxial';
    this.root.add(bncCable);
  }

  // ----------------------------------------------------------------------------
  // Exploded View Offsets & Kinematic Animation
  // ----------------------------------------------------------------------------
  setupExplodedNodes() {
    this.explodeTargets = [
      { obj: this.animGroups.consoleHousing, offset: new THREE.Vector3(0, 1.20, 0) },
      { obj: this.animGroups.dosinoDrive, offset: new THREE.Vector3(0, 1.50, 0) },
      { obj: this.animGroups.vesselHead, offset: new THREE.Vector3(0, 0.85, 0) },
      { obj: this.animGroups.stirPlate, offset: new THREE.Vector3(0, 0.35, 0) }
    ];
  }

  setExploded(exploded) {
    this.exploded = !!exploded;
    this.targetExplodeFactor = this.exploded ? 1.0 : 0.0;
  }

  // ----------------------------------------------------------------------------
  // Animation Loop & Real-Time Physical Simulation
  // ----------------------------------------------------------------------------
  animate() {
    requestAnimationFrame(this.animate);

    // Smooth Exploded View Interpolation
    if (Math.abs(this.explodeFactor - this.targetExplodeFactor) > 0.001) {
      this.explodeFactor += (this.targetExplodeFactor - this.explodeFactor) * 0.1;
      this.explodeTargets.forEach(item => {
        if (item.obj) {
          item.obj.position.y = (item.obj.userData.baseY ?? item.obj.position.y);
          if (item.obj.userData.baseY === undefined) {
            item.obj.userData.baseY = item.obj.position.y;
          }
          item.obj.position.y = item.obj.userData.baseY + item.offset.y * this.explodeFactor;
        }
      });
    }

    // Magnetic Stirrer Flea Rotation & Meniscus Vortex Physics
    if (this.isPluggedIn && this.powerSwitchOn && this.stirrerRunning && this.stirrerSpeedRpm > 0) {
      const rotSpeed = (this.stirrerSpeedRpm / 60.0) * (Math.PI * 2) * 0.016;
      this.stirAngle += rotSpeed;
      if (this.animGroups.stirFlea) {
        this.animGroups.stirFlea.rotation.y = this.stirAngle;
      }
      // Parabolic vortex depth proportional to stir speed
      if (this.animGroups.meniscus) {
        const targetScaleY = Math.max(0.08, (this.stirrerSpeedRpm / 1500.0) * 1.0);
        this.animGroups.meniscus.scale.y += (targetScaleY - this.animGroups.meniscus.scale.y) * 0.08;
      }
    } else {
      if (this.animGroups.meniscus) {
        this.animGroups.meniscus.scale.y += (0.05 - this.animGroups.meniscus.scale.y) * 0.1;
      }
    }

    // Dosino Micro-Stepper Piston Displacement Animation
    if (this.dosingActive && this.animGroups.dosinoPiston) {
      this.pistonDisplacement = (this.pistonDisplacement + 0.005) % 1.0;
      this.animGroups.dosinoPiston.position.y = 0.25 - this.pistonDisplacement * 0.40;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
