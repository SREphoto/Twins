/**
 * LabUtilities.js — Interactive Laboratory Utilities & Phenomenological Chemistry
 * 
 * Features:
 * - Gooseneck Faucets with operational handles & animated procedural running water streams
 * - Dynamic Dual-Cone Bunsen / Tirrill Burners with adjustable air collars & roaring blue flames
 * - Interactive chemical reagent bottles (0.1M HCl, 0.1M NaOH, Phenolphthalein, DI Water)
 * - Calibrated Pyrex beakers with concave menisci & colorimetric acid-base pH transitions
 * - Benchtop Duplex Outlets (Power_Receptacle_Duplex) with NEMA 5-15P plugs & circuit continuity
 */
import * as THREE from "three";
import { labAudio } from "./LabSFXMixer.js";

export class LabUtilities {
  constructor(scene, colliders = []) {
    this.scene = scene;
    this.colliders = colliders;
    this.root = new THREE.Group();
    this.root.name = "Modern_Lab_Utilities_Root";
    this.interactiveObjects = []; // Clickable items (valves, burners, bottles, beakers)
    this.activeWaterStreams = [];
    this.activeFlames = [];

    this._initMaterials();
    this._buildSinksAndFaucets();
    this._buildBunsenBurners();
    this._buildReagentsAndGlassware();
    this._buildDuplexPowerOutlets();

    this.scene.add(this.root);
  }

  _initMaterials() {
    this.materials = {
      chrome: new THREE.MeshStandardMaterial({
        color: 0xe8ecf2,
        roughness: 0.15,
        metalness: 0.92,
        name: "Mat_Faucet_Chrome"
      }),
      waterStream: new THREE.MeshPhysicalMaterial({
        color: 0xcee8ff,
        transparent: true,
        opacity: 0.65,
        roughness: 0.05,
        metalness: 0.05,
        transmission: 0.95,
        ior: 1.333,
        name: "Mat_Flowing_Water"
      }),
      brassBurner: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.28,
        metalness: 0.82,
        name: "Mat_Burner_Brass"
      }),
      flameBlueInner: new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.88,
        name: "Mat_Flame_Core"
      }),
      flameBlueOuter: new THREE.MeshBasicMaterial({
        color: 0x1e40af,
        transparent: true,
        opacity: 0.45,
        name: "Mat_Flame_Outer"
      }),
      flameYellow: new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.75,
        name: "Mat_Flame_Safety"
      }),
      glassPyrex: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        roughness: 0.08,
        metalness: 0.05,
        transmission: 0.92,
        ior: 1.47,
        name: "Mat_Pyrex_Glass"
      }),
      amberGlass: new THREE.MeshPhysicalMaterial({
        color: 0xb45309,
        transparent: true,
        opacity: 0.65,
        roughness: 0.12,
        metalness: 0.08,
        transmission: 0.75,
        ior: 1.52,
        name: "Mat_Amber_Reagent_Glass"
      }),
      reagentFluidClear: new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.7,
        roughness: 0.05,
        transmission: 0.92,
        ior: 1.333,
        name: "Mat_Fluid_Clear"
      }),
      reagentFluidPink: new THREE.MeshPhysicalMaterial({
        color: 0xec4899, // Fuchsia Phenolphthalein Endpoint
        transparent: true,
        opacity: 0.85,
        roughness: 0.08,
        transmission: 0.85,
        ior: 1.335,
        name: "Mat_Fluid_Pink_Indicator"
      })
    };
  }

  // --- Sinks & Running Water ---
  _buildSinksAndFaucets() {
    // Sink 1: Primary Double Wash Sink in Synthesis Bay (X = -7.0, Z = 5.0)
    this._createSinkStation(-7.0, 5.0, "Sink_Synthesis");

    // Sink 2: Secondary Sink in Analytical Hall (X = -13.0, Z = -8.3)
    this._createSinkStation(-13.0, -8.3, "Sink_Analytical");
  }

  _createSinkStation(cx, cz, id) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz); // Mounted flush into countertop Y = 0.90m
    group.name = id;

    // Recessed Black Epoxy Basin
    const basinGeo = new THREE.BoxGeometry(0.75, 0.35, 0.55);
    const basin = new THREE.Mesh(basinGeo, new THREE.MeshStandardMaterial({ color: 0x0f1115, roughness: 0.3 }));
    basin.position.y = -0.175;
    group.add(basin);

    // Chrome Gooseneck Spout (Arching tube)
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, -0.22),
      new THREE.Vector3(0, 0.35, -0.22),
      new THREE.Vector3(0, 0.45, -0.12),
      new THREE.Vector3(0, 0.40, -0.02)
    ]);
    const spoutGeo = new THREE.TubeGeometry(curve, 24, 0.014, 12, false);
    const spout = new THREE.Mesh(spoutGeo, this.materials.chrome);
    group.add(spout);

    // Cold Water Handle (Interactive)
    const handleL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.08, 12),
      this.materials.chrome
    );
    handleL.position.set(-0.09, 0.04, -0.22);
    handleL.userData = { isHandle: true, state: "off", sinkId: id };
    group.add(handleL);
    this.interactiveObjects.push(handleL);

    // Hot Water Handle (Interactive)
    const handleR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.08, 12),
      this.materials.chrome
    );
    handleR.position.set(0.09, 0.04, -0.22);
    handleR.userData = { isHandle: true, state: "off", sinkId: id };
    group.add(handleR);
    this.interactiveObjects.push(handleR);

    // Procedural Running Water Stream Mesh (Hidden until handle clicked)
    const streamGeo = new THREE.CylinderGeometry(0.009, 0.014, 0.38, 12);
    const stream = new THREE.Mesh(streamGeo, this.materials.waterStream);
    stream.position.set(0, 0.20, -0.02);
    stream.visible = false;
    group.add(stream);

    // Basin Water Pool (Gradually fills)
    const poolGeo = new THREE.PlaneGeometry(0.68, 0.48);
    const pool = new THREE.Mesh(poolGeo, this.materials.waterStream);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, -0.32, 0);
    pool.visible = false;
    group.add(pool);

    const streamData = { id, stream, pool, isRunning: false, fillLevel: 0 };
    this.activeWaterStreams.push(streamData);

    // Wire click handler on handles
    const toggleWater = () => {
      streamData.isRunning = !streamData.isRunning;
      stream.visible = streamData.isRunning;
      pool.visible = streamData.isRunning;
      if (streamData.isRunning) {
        labAudio.startRunningWater(id);
      } else {
        labAudio.stopRunningWater(id);
      }
    };
    handleL.userData.toggle = toggleWater;
    handleR.userData.toggle = toggleWater;

    this.root.add(group);
  }

  // --- Bunsen / Tirrill Burners ---
  _buildBunsenBurners() {
    // 2x Bunsen Burners on Synthesis Prep Bench (X: -11.5, -8.5, Z: 5.0)
    [-11.5, -8.5].forEach((bx, idx) => {
      this._createBunsenBurner(bx, 5.0, `Burner_${idx + 1}`);
    });
  }

  _createBunsenBurner(cx, cz, id) {
    const burner = new THREE.Group();
    burner.position.set(cx, 0.90, cz); // Seated on countertop
    burner.name = id;

    // Heavy cast iron octagonal base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.085, 0.025, 8),
      new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.8, metalness: 0.2 })
    );
    base.position.y = 0.0125;
    burner.add(base);

    // Vertical brass mixing chimney barrel
    const chimneyH = 0.16;
    const chimney = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, chimneyH, 16),
      this.materials.brassBurner
    );
    chimney.position.y = 0.025 + chimneyH / 2;
    burner.add(chimney);

    // Knurled Air Collar (Interactive - Click to toggle between yellow and roaring blue flame)
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.025, 16),
      this.materials.brassBurner
    );
    collar.position.y = 0.045;
    collar.userData = { isCollar: true, mode: "blue", burnerId: id };
    burner.add(collar);
    this.interactiveObjects.push(collar);

    // Red gum rubber gas tubing connecting to rear gas turret
    const tubeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.02, 0),
      new THREE.Vector3(0.08, 0.01, 0.12),
      new THREE.Vector3(0.12, 0.02, 0.28)
    ]);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(tubeCurve, 16, 0.007, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 })
    );
    burner.add(tube);

    // Dual-Cone Flame Mesh Assembly
    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, 0.025 + chimneyH, 0);

    // Inner bright cyan cone (oxidizing zone 1200°C)
    const innerCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.012, 0.065, 16),
      this.materials.flameBlueInner
    );
    innerCone.position.y = 0.0325;
    flameGroup.add(innerCone);

    // Outer pale blue envelope
    const outerCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.02, 0.12, 16),
      this.materials.flameBlueOuter
    );
    outerCone.position.y = 0.06;
    flameGroup.add(outerCone);

    // Yellow luminous flame (for safety mode)
    const safetyCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.022, 0.14, 16),
      this.materials.flameYellow
    );
    safetyCone.position.y = 0.07;
    safetyCone.visible = false;
    flameGroup.add(safetyCone);

    // Dynamic flame light
    const flameLight = new THREE.PointLight(0x00ffff, 0.75, 2.5);
    flameLight.position.y = 0.06;
    flameGroup.add(flameLight);

    burner.add(flameGroup);

    const flameData = { id, flameGroup, innerCone, outerCone, safetyCone, flameLight, mode: "blue", active: true };
    this.activeFlames.push(flameData);
    labAudio.startBunsenFlame(id, "blue");

    // Click handler on collar to toggle flame state
    collar.userData.toggle = () => {
      flameData.mode = flameData.mode === "blue" ? "yellow" : "blue";
      collar.userData.mode = flameData.mode;
      collar.rotation.y += 0.5;

      if (flameData.mode === "blue") {
        innerCone.visible = true;
        outerCone.visible = true;
        safetyCone.visible = false;
        flameLight.color.setHex(0x00ffff);
      } else {
        innerCone.visible = false;
        outerCone.visible = false;
        safetyCone.visible = true;
        flameLight.color.setHex(0xf59e0b);
      }
      labAudio.setBunsenFlameMode(id, flameData.mode);
    };

    // Supporting Iron Ring Stand & Wire Gauze over burner
    const stand = new THREE.Group();
    stand.position.set(0.12, 0, 0);

    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, 0.55, 12),
      this.materials.chrome
    );
    rod.position.y = 0.275;
    stand.add(rod);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.06, 0.006, 8, 24),
      this.materials.chrome
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(-0.12, 0.22, 0);
    stand.add(ring);

    // Ceramic-centered wire gauze
    const gauze = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.004, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8, metalness: 0.6 })
    );
    gauze.position.set(-0.12, 0.226, 0);
    stand.add(gauze);

    burner.add(stand);
    this.root.add(burner);
  }

  // --- Interactive Reagents & Glassware ---
  _buildReagentsAndGlassware() {
    // 1. Reagent Shelf Bottles on Analytical Island (X: -10.0, Z: -4.5, Y = 1.37m)
    const bottles = [
      { name: "0.1M HCl", color: 0xb45309, x: -10.8 },
      { name: "0.1M NaOH", color: 0xb45309, x: -10.3 },
      { name: "Phenolphthalein 1%", color: 0x1e293b, x: -9.8 },
      { name: "DI H2O", color: 0x0284c7, x: -9.3 }
    ];

    bottles.forEach((b) => {
      const bottle = this._createReagentBottle(b.name, b.color);
      bottle.position.set(b.x, 1.38, -4.5);
      this.root.add(bottle);
      this.interactiveObjects.push(bottle);
    });

    // 2. Beaker with Colorimetric Acid-Base Neutralization Demo (Analytical Bench Y = 0.90m)
    this._createTitrationBeaker(-10.2, -4.0);
  }

  _createReagentBottle(label, glassColor) {
    const group = new THREE.Group();
    group.name = `Bottle_${label}`;
    group.userData = { isReagent: true, label };

    // Amber or clear glass body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.14, 16),
      new THREE.MeshPhysicalMaterial({ color: glassColor, transparent: true, opacity: 0.75, roughness: 0.1, transmission: 0.7 })
    );
    body.position.y = 0.07;
    group.add(body);

    // Bottle neck
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.024, 0.035, 16),
      new THREE.MeshPhysicalMaterial({ color: glassColor, transparent: true, opacity: 0.75, roughness: 0.1 })
    );
    neck.position.y = 0.155;
    group.add(neck);

    // Ground glass stopper
    const stopper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.016, 0.03, 16),
      this.materials.glassPyrex
    );
    stopper.position.y = 0.18;
    group.add(stopper);

    // Procedural Silkscreen Chemical Label
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 120);
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 24px monospace";
    ctx.fillText(label, 15, 55);
    ctx.font = "14px monospace";
    ctx.fillStyle = "#475569";
    ctx.fillText("ANALYTICAL REAGENT", 15, 85);
    ctx.fillText("GLP / USP GRADE", 15, 105);

    const tex = new THREE.CanvasTexture(canvas);
    const labelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.065, 0.045),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    labelMesh.position.set(0, 0.07, 0.043);
    group.add(labelMesh);

    return group;
  }

  _createTitrationBeaker(cx, cz) {
    const beakerGroup = new THREE.Group();
    beakerGroup.position.set(cx, 0.90, cz);
    beakerGroup.name = "Titration_Beaker_Active";

    // 250 mL Pyrex glass cylinder beaker
    const beakerGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.11, 24, 1, true);
    const beakerGlass = new THREE.Mesh(beakerGeo, this.materials.glassPyrex);
    beakerGlass.position.y = 0.055;
    beakerGroup.add(beakerGlass);

    // Beaker bottom
    const bottomGeo = new THREE.CircleGeometry(0.045, 24);
    const bottom = new THREE.Mesh(bottomGeo, this.materials.glassPyrex);
    bottom.rotation.x = Math.PI / 2;
    beakerGroup.add(bottom);

    // Liquid with dynamic Meniscus (Starts clear, turns pink upon titration click)
    const fluidGeo = new THREE.CylinderGeometry(0.043, 0.043, 0.065, 24);
    const fluid = new THREE.Mesh(fluidGeo, this.materials.reagentFluidClear);
    fluid.position.y = 0.033;
    beakerGroup.add(fluid);

    // Concave Meniscus Ring
    const meniscus = new THREE.Mesh(
      new THREE.TorusGeometry(0.042, 0.003, 8, 24),
      this.materials.reagentFluidClear
    );
    meniscus.rotation.x = Math.PI / 2;
    meniscus.position.y = 0.065;
    beakerGroup.add(meniscus);

    // Interactive Titration neutralization trigger
    beakerGroup.userData = { isBeaker: true, isNeutralized: false };
    beakerGroup.userData.toggle = () => {
      beakerGroup.userData.isNeutralized = !beakerGroup.userData.isNeutralized;
      if (beakerGroup.userData.isNeutralized) {
        fluid.material = this.materials.reagentFluidPink;
        meniscus.material = this.materials.reagentFluidPink;
        labAudio.playButtonClick();
      } else {
        fluid.material = this.materials.reagentFluidClear;
        meniscus.material = this.materials.reagentFluidClear;
      }
    };
    this.interactiveObjects.push(beakerGroup);

    this.root.add(beakerGroup);
  }

  // --- Benchtop Duplex Power Outlets ---
  _buildDuplexPowerOutlets() {
    // Outlets mounted on the backsplashes of all main benches
    const outletPositions = [
      [-12.0, -4.5], [-8.0, -4.5], // Analytical Island
      [-4.0, -4.5], [0.0, -4.5],   // Pharma QC Island
      [-12.0, 5.0], [-8.0, 5.0],   // Synthesis Island
      [-2.0, 5.0], [1.0, 5.0]      // Sample Prep Island
    ];

    outletPositions.forEach(([ox, oz], i) => {
      const outletBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, 0.11, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xd8dde4, roughness: 0.35, metalness: 0.4 })
      );
      outletBox.position.set(ox, 1.05, oz);
      outletBox.name = `Power_Receptacle_Duplex_${i + 1}`;
      this.root.add(outletBox);
    });
  }

  // Animation step called in RAF loop
  update(time) {
    // Flame flicker animation
    this.activeFlames.forEach((f) => {
      if (f.active) {
        const flicker = 1.0 + Math.sin(time * 30 + f.id.length) * 0.08 + Math.cos(time * 18) * 0.05;
        f.flameGroup.scale.set(1.0, flicker, 1.0);
        f.flameLight.intensity = (f.mode === "blue" ? 0.75 : 0.45) * flicker;
      }
    });
  }
}
