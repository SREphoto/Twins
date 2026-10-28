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
        ior: 1.47,
        name: "Mat_Pyrex_Glass"
      }),
      amberGlass: new THREE.MeshPhysicalMaterial({
        color: 0xb45309,
        transparent: true,
        opacity: 0.65,
        roughness: 0.12,
        metalness: 0.08,
        ior: 1.52,
        name: "Mat_Amber_Reagent_Glass"
      }),
      reagentFluidClear: new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.7,
        roughness: 0.05,
        ior: 1.333,
        name: "Mat_Fluid_Clear"
      }),
      reagentFluidPink: new THREE.MeshPhysicalMaterial({
        color: 0xec4899, // Fuchsia Phenolphthalein Endpoint
        transparent: true,
        opacity: 0.85,
        roughness: 0.08,
        ior: 1.335,
        name: "Mat_Fluid_Pink_Indicator"
      }),
      fluidBlue: new THREE.MeshPhysicalMaterial({
        color: 0x0284c7, // Copper Sulfate
        transparent: true,
        opacity: 0.75,
        roughness: 0.05,
        ior: 1.333,
        name: "Mat_Fluid_Blue"
      }),
      fluidGreen: new THREE.MeshPhysicalMaterial({
        color: 0x10b981, // Nickel Salt Solution
        transparent: true,
        opacity: 0.75,
        roughness: 0.05,
        ior: 1.333,
        name: "Mat_Fluid_Green"
      }),
      fluidAmber: new THREE.MeshPhysicalMaterial({
        color: 0xd97706, // Iodine / Chromate Solution
        transparent: true,
        opacity: 0.75,
        roughness: 0.05,
        ior: 1.333,
        name: "Mat_Fluid_Amber"
      }),
      fluidViolet: new THREE.MeshPhysicalMaterial({
        color: 0x7c3aed, // Permanganate Solution
        transparent: true,
        opacity: 0.75,
        roughness: 0.05,
        ior: 1.333,
        name: "Mat_Fluid_Violet"
      }),
      ppBlueRack: new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        roughness: 0.45,
        metalness: 0.05,
        name: "Mat_Rack_Blue_PP"
      }),
      ppOrangeRack: new THREE.MeshStandardMaterial({
        color: 0xea580c,
        roughness: 0.45,
        metalness: 0.05,
        name: "Mat_Rack_Orange_PP"
      }),
      washBottleLDPE: new THREE.MeshPhysicalMaterial({
        color: 0xf1f5f9,
        transparent: true,
        opacity: 0.65,
        roughness: 0.25,
        ior: 1.40,
        name: "Mat_LDPE_Translucent"
      }),
      reagentWhiteHDPE: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.35,
        metalness: 0.02,
        name: "Mat_HDPE_Jar_White"
      }),
      screwCapBlack: new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.4,
        metalness: 0.1,
        name: "Mat_Cap_Phenolic_Black"
      }),
      screwCapRed: new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.4,
        metalness: 0.05,
        name: "Mat_Cap_Red"
      }),
      screwCapBlue: new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        roughness: 0.4,
        metalness: 0.05,
        name: "Mat_Cap_Blue"
      }),
      screwCapGreen: new THREE.MeshStandardMaterial({
        color: 0x16a34a,
        roughness: 0.4,
        metalness: 0.05,
        name: "Mat_Cap_Green"
      }),
      screwCapYellow: new THREE.MeshStandardMaterial({
        color: 0xeab308,
        roughness: 0.4,
        metalness: 0.05,
        name: "Mat_Cap_Yellow"
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

  // --- Interactive Reagents, Glassware & Chemical Inventory ---
  _buildReagentsAndGlassware() {
    // 1. Reagent Shelf Bottles on Analytical Island (X: -10.0, Z: -4.5, Y = 1.38m)
    const shelfBottles = [
      { name: "0.1M HCl", color: 0xb45309, x: -10.8 },
      { name: "0.1M NaOH", color: 0xb45309, x: -10.3 },
      { name: "Phenolphthalein 1%", color: 0x1e293b, x: -9.8 },
      { name: "DI H2O", color: 0x0284c7, x: -9.3 }
    ];

    shelfBottles.forEach((b) => {
      const bottle = this._createReagentBottle(b.name, b.color);
      bottle.position.set(b.x, 1.38, -4.5);
      this.root.add(bottle);
      this.interactiveObjects.push(bottle);
    });

    // 2. Beaker with Colorimetric Acid-Base Neutralization Demo (Analytical Bench Y = 0.90m)
    this._createTitrationBeaker(-10.2, -4.0);

    // 3. Volumetric Flasks (Analytical Preparation on Island 1 & 2)
    this._createVolumetricFlask(-11.2, -4.0, "250 mL", this.materials.fluidGreen);
    this._createVolumetricFlask(-7.5, -4.0, "100 mL", this.materials.fluidAmber);

    // 4. Graduated Cylinders with Anti-Roll Hexagonal Bases
    this._createGraduatedCylinder(-1.2, -4.0, "100 mL", this.materials.fluidBlue);
    this._createGraduatedCylinder(-6.4, -4.0, "250 mL", this.materials.reagentFluidClear);

    // 5. Conical Erlenmeyer Reaction Flasks
    this._createErlenmeyerFlask(-11.0, 5.0, "500 mL", this.materials.fluidBlue);
    this._createErlenmeyerFlask(-8.0, 5.0, "250 mL", this.materials.fluidAmber);
    this._createErlenmeyerFlask(-1.5, 4.4, "125 mL", this.materials.fluidGreen);

    // 6. Polypropylene Test Tube Racks with Colorful Analytical Fractions
    this._createTestTubeRack(-3.2, 4.4, this.materials.ppBlueRack);
    this._createTestTubeRack(-6.0, -4.0, this.materials.ppOrangeRack);

    // 7. Precision 4-Place Micropipettor Carousel Stand in Sample Prep Suite
    this._createPipettorCarousel(0.2, 4.4);

    // 8. Color-Coded LDPE Squeeze Wash Bottles (DI Water, Acetone, Methanol, Isopropanol)
    this._createWashBottle(-12.5, -4.0, "DI WATER", this.materials.screwCapBlue);
    this._createWashBottle(-12.3, -4.0, "ACETONE", this.materials.screwCapRed);
    this._createWashBottle(-6.8, 5.0, "METHANOL", this.materials.screwCapGreen);
    this._createWashBottle(-12.0, 5.0, "ISOPROPANOL", this.materials.screwCapYellow);

    // 9. Wide-Mouth Chemical Storage Jars on Reagent Shelves & Prep Benches
    this._createChemicalJar(-9.0, 1.38, -4.5, "Sodium Chloride USP", "NaCl");
    this._createChemicalJar(-8.6, 1.38, -4.5, "Potassium Bromide IR", "KBr");
    this._createChemicalJar(-2.5, 4.4, "EDTA Disodium 99%", "C10H14N2Na2O8");

    // 10. Heavy Amber Winchester Solvent Bottles in Synthesis Bay & Chemical Vault
    this._createWinchesterSolventBottle(-13.0, 5.0, "ACETONITRILE", "HPLC GRADE");
    this._createWinchesterSolventBottle(-12.7, 5.0, "METHANOL", "OPTIMA LC/MS");
    this._createWinchesterSolventBottle(-12.4, 5.0, "HEXANES", "ACS REAGENT");

    // 11. Zone 5 Chemical Storage Steel Racking (X = 1.5, Z = 8.3)
    const vaultChemicals = [
      { name: "Sodium Hydroxide ACS", f: "NaOH", shelf: 0, x: 0.8 },
      { name: "Magnesium Sulfate Anh.", f: "MgSO4", shelf: 0, x: 1.3 },
      { name: "Potassium Permanganate", f: "KMnO4", shelf: 0, x: 1.8 },
      { name: "Citric Acid Anhydrous", f: "C6H8O7", shelf: 1, x: 0.8 },
      { name: "Silver Nitrate 99.9%", f: "AgNO3", shelf: 1, x: 1.3 },
      { name: "Potassium Iodide USP", f: "KI", shelf: 1, x: 1.8 }
    ];
    vaultChemicals.forEach(c => {
      const y = 0.42 + c.shelf * 0.55;
      this._createChemicalJar(c.x, y, 8.3, c.name, c.f);
    });

    // Winchester Solvents on Vault Shelf 2
    this._createWinchesterSolventBottle(0.9, 0.42 + 2 * 0.55, 8.3, "DICHLOROMETHANE", "HPLC GRADE");
    this._createWinchesterSolventBottle(1.5, 0.42 + 2 * 0.55, 8.3, "TETRAHYDROFURAN", "ANHYDROUS");
    this._createWinchesterSolventBottle(2.1, 0.42 + 2 * 0.55, 8.3, "ETHYL ACETATE", "ACS REAGENT");
  }

  // --- Volumetric Flask (Pear-shaped body, calibration ring, ground pennyhead stopper) ---
  _createVolumetricFlask(cx, cz, volume = "250 mL", fluidMat = null) {
    const flask = new THREE.Group();
    flask.position.set(cx, 0.90, cz);
    flask.name = `Volumetric_Flask_${volume}`;

    const rBase = volume === "250 mL" ? 0.045 : 0.035;
    const hBody = volume === "250 mL" ? 0.085 : 0.065;
    const hNeck = volume === "250 mL" ? 0.14 : 0.11;

    // Bulbous lower body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, rBase, hBody, 16),
      this.materials.glassPyrex
    );
    body.position.y = hBody / 2;
    flask.add(body);

    // Flat ground base
    const base = new THREE.Mesh(
      new THREE.CircleGeometry(rBase, 16),
      this.materials.glassPyrex
    );
    base.rotation.x = Math.PI / 2;
    flask.add(base);

    // Slender cylindrical calibration neck
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.010, 0.010, hNeck, 16, 1, true),
      this.materials.glassPyrex
    );
    neck.position.y = hBody + hNeck / 2;
    flask.add(neck);

    // Ground glass pennyhead stopper
    const stopper = new THREE.Mesh(
      new THREE.BoxGeometry(0.024, 0.035, 0.008),
      this.materials.glassPyrex
    );
    stopper.position.y = hBody + hNeck + 0.018;
    flask.add(stopper);

    // Etched graduation ring line around neck
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.0105, 0.001, 6, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = hBody + hNeck * 0.6;
    flask.add(ring);

    // Liquid solution inside (if provided)
    if (fluidMat) {
      const fluidBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, rBase * 0.95, hBody * 0.92, 16),
        fluidMat
      );
      fluidBody.position.y = (hBody * 0.92) / 2;
      flask.add(fluidBody);

      const fluidNeck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.009, 0.009, hNeck * 0.6, 16),
        fluidMat
      );
      fluidNeck.position.y = hBody + (hNeck * 0.6) / 2;
      flask.add(fluidNeck);
    }

    this.root.add(flask);
    return flask;
  }

  // --- Erlenmeyer Conical Flask (Conical body, graduations, pouring rim) ---
  _createErlenmeyerFlask(cx, cz, volume = "250 mL", fluidMat = null) {
    const flask = new THREE.Group();
    flask.position.set(cx, 0.90, cz);
    flask.name = `Erlenmeyer_Flask_${volume}`;

    const rBottom = volume === "500 mL" ? 0.055 : (volume === "250 mL" ? 0.045 : 0.035);
    const rTop = volume === "500 mL" ? 0.020 : (volume === "250 mL" ? 0.016 : 0.012);
    const hCone = volume === "500 mL" ? 0.12 : (volume === "250 mL" ? 0.095 : 0.075);
    const hNeck = volume === "500 mL" ? 0.04 : 0.03;

    // Conical flask body
    const cone = new THREE.Mesh(
      new THREE.CylinderGeometry(rTop, rBottom, hCone, 16, 1, true),
      this.materials.glassPyrex
    );
    cone.position.y = hCone / 2;
    flask.add(cone);

    const base = new THREE.Mesh(new THREE.CircleGeometry(rBottom, 16), this.materials.glassPyrex);
    base.rotation.x = Math.PI / 2;
    flask.add(base);

    // Neck with beaded rim
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(rTop, rTop, hNeck, 16, 1, true),
      this.materials.glassPyrex
    );
    neck.position.y = hCone + hNeck / 2;
    flask.add(neck);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(rTop, 0.0025, 6, 16),
      this.materials.glassPyrex
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = hCone + hNeck;
    flask.add(rim);

    // Solution inside with meniscus
    if (fluidMat) {
      const fluidH = hCone * 0.65;
      const rFluidTop = rBottom - (rBottom - rTop) * 0.65;
      const fluid = new THREE.Mesh(
        new THREE.CylinderGeometry(rFluidTop, rBottom * 0.96, fluidH, 16),
        fluidMat
      );
      fluid.position.y = fluidH / 2;
      flask.add(fluid);

      const meniscus = new THREE.Mesh(
        new THREE.CircleGeometry(rFluidTop, 16),
        fluidMat
      );
      meniscus.rotation.x = -Math.PI / 2;
      meniscus.position.y = fluidH;
      flask.add(meniscus);
    }

    this.root.add(flask);
    return flask;
  }

  // --- Graduated Cylinder (Hexagonal base, graduations, spout) ---
  _createGraduatedCylinder(cx, cz, volume = "100 mL", fluidMat = null) {
    const cyl = new THREE.Group();
    cyl.position.set(cx, 0.90, cz);
    cyl.name = `Graduated_Cylinder_${volume}`;

    const rCyl = volume === "250 mL" ? 0.022 : 0.016;
    const hCyl = volume === "250 mL" ? 0.26 : 0.20;

    // Hexagonal anti-roll heavy base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(rCyl * 2.2, rCyl * 2.4, 0.015, 6),
      this.materials.glassPyrex
    );
    base.position.y = 0.0075;
    cyl.add(base);

    // Glass cylinder column
    const column = new THREE.Mesh(
      new THREE.CylinderGeometry(rCyl, rCyl, hCyl, 16, 1, true),
      this.materials.glassPyrex
    );
    column.position.y = 0.015 + hCyl / 2;
    cyl.add(column);

    // White graduation lines
    for (let g = 1; g <= 8; g++) {
      const gLine = new THREE.Mesh(
        new THREE.BoxGeometry(rCyl * 1.8, 0.0015, 0.002),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      gLine.position.set(0, 0.02 + g * (hCyl * 0.1), rCyl);
      cyl.add(gLine);
    }

    // Liquid column with parabolic meniscus
    if (fluidMat) {
      const fluidH = hCyl * 0.65;
      const fluid = new THREE.Mesh(
        new THREE.CylinderGeometry(rCyl * 0.92, rCyl * 0.92, fluidH, 16),
        fluidMat
      );
      fluid.position.y = 0.015 + fluidH / 2;
      cyl.add(fluid);

      const meniscus = new THREE.Mesh(
        new THREE.TorusGeometry(rCyl * 0.90, 0.002, 6, 16),
        fluidMat
      );
      meniscus.rotation.x = Math.PI / 2;
      meniscus.position.y = 0.015 + fluidH;
      cyl.add(meniscus);
    }

    this.root.add(cyl);
    return cyl;
  }

  // --- 24-Position Molded Polypropylene Test Tube Rack ---
  _createTestTubeRack(cx, cz, rackMat) {
    const rack = new THREE.Group();
    rack.position.set(cx, 0.90, cz);
    rack.name = "Test_Tube_Rack_24_Position";

    const rackW = 0.24;
    const rackD = 0.10;
    const rackH = 0.085;

    // Top tier with 2x12 holes
    const topPlate = new THREE.Mesh(new THREE.BoxGeometry(rackW, 0.006, rackD), rackMat);
    topPlate.position.y = rackH;
    rack.add(topPlate);

    // Middle tier
    const midPlate = new THREE.Mesh(new THREE.BoxGeometry(rackW, 0.006, rackD), rackMat);
    midPlate.position.y = rackH * 0.5;
    rack.add(midPlate);

    // Base plate
    const basePlate = new THREE.Mesh(new THREE.BoxGeometry(rackW, 0.006, rackD), rackMat);
    basePlate.position.y = 0.003;
    rack.add(basePlate);

    // End supports
    [-rackW / 2 + 0.005, rackW / 2 - 0.005].forEach(ex => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.008, rackH, rackD), rackMat);
      leg.position.set(ex, rackH / 2, 0);
      rack.add(leg);
    });

    // 12 Borosilicate Test Tubes with Colored Analytical Fractions
    const tubeColors = [
      this.materials.fluidBlue,
      this.materials.fluidGreen,
      this.materials.fluidAmber,
      this.materials.fluidViolet,
      this.materials.reagentFluidPink,
      this.materials.reagentFluidClear
    ];

    for (let row = 0; row < 2; row++) {
      const tz = -rackD / 4 + row * (rackD / 2);
      for (let col = 0; col < 6; col++) {
        const tx = -rackW / 2 + 0.025 + col * 0.038;
        const tubeGroup = new THREE.Group();
        tubeGroup.position.set(tx, 0.006, tz);

        // Glass tube
        const tube = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.12, 12, 1, true),
          this.materials.glassPyrex
        );
        tube.position.y = 0.06;
        tubeGroup.add(tube);

        // Round bottom
        const roundBottom = new THREE.Mesh(
          new THREE.SphereGeometry(0.008, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
          this.materials.glassPyrex
        );
        roundBottom.position.y = 0.004;
        tubeGroup.add(roundBottom);

        // Fluid fraction
        const fMat = tubeColors[(col + row * 3) % tubeColors.length];
        const fluid = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0075, 0.0075, 0.055, 12),
          fMat
        );
        fluid.position.y = 0.032;
        tubeGroup.add(fluid);

        rack.add(tubeGroup);
      }
    }

    this.root.add(rack);
    return rack;
  }

  // --- Precision 4-Place Micropipettor Carousel Stand ---
  _createPipettorCarousel(cx, cz) {
    const stand = new THREE.Group();
    stand.position.set(cx, 0.90, cz);
    stand.name = "Pipettor_Carousel_Stand_4_Place";

    // Weighted circular base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.08, 0.02, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.7 })
    );
    base.position.y = 0.01;
    stand.add(base);

    // Central chrome vertical spindle
    const spindle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.34, 16),
      this.materials.chrome
    );
    spindle.position.y = 0.18;
    stand.add(spindle);

    // Rotating 4-hook carousel head
    const head = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.025, 16),
      this.materials.screwCapBlack
    );
    head.position.y = 0.33;
    stand.add(head);

    // 4 Ergonomic Micropipettors (P10 Red, P100 Yellow, P1000 Blue, P5000 Purple)
    const pipettes = [
      { color: 0xdc2626, label: "P10", len: 0.22 },
      { color: 0xeab308, label: "P100", len: 0.23 },
      { color: 0x2563eb, label: "P1000", len: 0.24 },
      { color: 0x9333ea, label: "P5000", len: 0.25 }
    ];

    pipettes.forEach((p, i) => {
      const angle = (i * Math.PI) / 2;
      const pip = new THREE.Group();
      pip.rotation.y = angle;
      pip.position.set(0, 0.33, 0);

      // Hanging hook
      const hook = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, 0.012, 0.045),
        this.materials.chrome
      );
      hook.position.set(0, 0, 0.055);
      pip.add(hook);

      // Pipettor body
      const pBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.014, 0.12, 12),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
      );
      pBody.position.set(0, -0.06, 0.075);
      pip.add(pBody);

      // Color-coded volume button plunger
      const plunger = new THREE.Mesh(
        new THREE.CylinderGeometry(0.009, 0.009, 0.025, 12),
        new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.3 })
      );
      plunger.position.set(0, 0.012, 0.075);
      pip.add(plunger);

      // Slender tip shaft
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.006, 0.10, 8),
        this.materials.screwCapBlack
      );
      shaft.position.set(0, -0.16, 0.075);
      pip.add(shaft);

      stand.add(pip);
    });

    this.root.add(stand);
    return stand;
  }

  // --- LDPE Squeeze Wash Bottle (Angled delivery tube, color-coded closure) ---
  _createWashBottle(cx, cz, solvent = "DI WATER", capMat) {
    const bottle = new THREE.Group();
    bottle.position.set(cx, 0.90, cz);
    bottle.name = `Wash_Bottle_${solvent}`;

    // Translucent flexible bottle body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.15, 16),
      this.materials.washBottleLDPE
    );
    body.position.y = 0.075;
    bottle.add(body);

    // Color-coded threaded screw closure
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.025, 16),
      capMat
    );
    cap.position.y = 0.16;
    bottle.add(cap);

    // Angled goose-neck delivery tube extending upward & forward
    const tubeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.16, 0),
      new THREE.Vector3(0, 0.22, 0),
      new THREE.Vector3(0, 0.24, 0.02),
      new THREE.Vector3(0, 0.22, 0.05)
    ]);
    const deliveryTube = new THREE.Mesh(
      new THREE.TubeGeometry(tubeCurve, 16, 0.0035, 8, false),
      this.materials.washBottleLDPE
    );
    bottle.add(deliveryTube);

    // Silkscreen solvent identification label
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(solvent, 128, 55);
    ctx.font = "14px monospace";
    ctx.fillStyle = "#475569";
    ctx.fillText("500 mL WASH BOTTLE", 128, 85);
    ctx.fillText("VENTED LDPE", 128, 105);

    const tex = new THREE.CanvasTexture(canvas);
    const labelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.065, 0.045),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    labelMesh.position.set(0, 0.075, 0.039);
    bottle.add(labelMesh);

    this.root.add(bottle);
    return bottle;
  }

  // --- Wide-Mouth Chemical Storage Jar (HDPE jar, ribbed closure, GHS label) ---
  _createChemicalJar(cx, cy, cz, chemicalName = "Sodium Chloride USP", formula = "NaCl") {
    let y = cy;
    let z = cz;
    let name = chemicalName;
    let f = formula;
    if (typeof cz === "string") {
      // Called with (cx, cz, chemicalName, formula)
      y = 0.90;
      z = cy;
      name = cz;
      f = chemicalName || "NaCl";
    }

    const jar = new THREE.Group();
    jar.position.set(cx, y, z);
    jar.name = `Chemical_Jar_${f}`;

    // White HDPE jar body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.12, 16),
      this.materials.reagentWhiteHDPE
    );
    body.position.y = 0.06;
    jar.add(body);

    // Ribbed black phenolic screw cap
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.046, 0.046, 0.024, 16),
      this.materials.screwCapBlack
    );
    cap.position.y = 0.13;
    jar.add(cap);

    // GHS / USP Chemical Label
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 256, 160);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 152);
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(name, 12, 38);
    ctx.fillStyle = "#2563eb";
    ctx.font = "bold 18px monospace";
    ctx.fillText(f, 12, 70);
    ctx.fillStyle = "#475569";
    ctx.font = "13px monospace";
    ctx.fillText("PURITY: ≥99.5%", 12, 105);
    ctx.fillText("USP / PH. EUR. GRADE", 12, 125);
    ctx.fillText("SRE LABS LOT #24-88A", 12, 145);

    const tex = new THREE.CanvasTexture(canvas);
    const labelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.075, 0.06),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    labelMesh.position.set(0, 0.06, 0.046);
    jar.add(labelMesh);

    this.root.add(jar);
    return jar;
  }

  // --- Winchester Heavy Amber Glass Solvent Bottle (1-Liter, GL45 closure) ---
  _createWinchesterSolventBottle(cx, cy, cz, solvent = "ACETONITRILE", grade = "HPLC GRADE") {
    let y = cy;
    let z = cz;
    let s = solvent;
    let g = grade;
    if (typeof cz === "string") {
      // Called with (cx, cz, solvent, grade)
      y = 0.90;
      z = cy;
      s = cz;
      g = solvent || "HPLC GRADE";
    }

    const bottle = new THREE.Group();
    bottle.position.set(cx, y, z);
    bottle.name = `Solvent_Winchester_${s}`;

    // Heavy amber glass body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.052, 0.052, 0.18, 16),
      this.materials.amberGlass
    );
    body.position.y = 0.09;
    bottle.add(body);

    // Curved shoulder & neck
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.035, 0.05, 16),
      this.materials.amberGlass
    );
    neck.position.y = 0.20;
    bottle.add(neck);

    // GL45 Screw closure with tamper ring
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.03, 16),
      this.materials.screwCapRed
    );
    cap.position.y = 0.235;
    bottle.add(cap);

    // Flammable / Organic Solvent Hazard Label
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 256, 160);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 248, 152);
    ctx.fillStyle = "#dc2626";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("FLAMMABLE LIQUID", 12, 35);
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 22px monospace";
    ctx.fillText(s, 12, 72);
    ctx.fillStyle = "#2563eb";
    ctx.font = "bold 15px monospace";
    ctx.fillText(g, 12, 105);
    ctx.fillStyle = "#64748b";
    ctx.font = "12px monospace";
    ctx.fillText("CAS NO. SPECIFIED · 1.0 L", 12, 135);

    const tex = new THREE.CanvasTexture(canvas);
    const labelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.08, 0.065),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    labelMesh.position.set(0, 0.09, 0.053);
    bottle.add(labelMesh);

    this.root.add(bottle);
    return bottle;
  }

  _createReagentBottle(label, glassColor) {
    const group = new THREE.Group();
    group.name = `Bottle_${label}`;
    group.userData = { isReagent: true, label };

    // Amber or clear glass body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.14, 16),
      new THREE.MeshPhysicalMaterial({ color: glassColor, transparent: true, opacity: 0.75, roughness: 0.1 })
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
