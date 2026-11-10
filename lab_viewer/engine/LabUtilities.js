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
    this._buildInstrumentWorkstationSurroundings();

    this.scene.add(this.root);
  }

  _initMaterials() {
    this.materials = {
      // Laboratory Consumables & Surrounding Ecosystem Materials
      kimwipesGreen: new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.55,
        metalness: 0.05,
        name: "Mat_Kimwipes_Box_Green"
      }),
      kimwipesWhite: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.65,
        metalness: 0.02,
        name: "Mat_Kimwipes_White_Tissue"
      }),
      cuvetteQuartz: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.28,
        roughness: 0.02,
        ior: 1.54,
        name: "Mat_Quartz_Cuvette"
      }),
      cuvetteVelvet: new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        roughness: 0.92,
        metalness: 0.02,
        name: "Mat_Cuvette_Box_Velvet"
      }),
      agateStone: new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        roughness: 0.22,
        metalness: 0.05,
        name: "Mat_Polished_Agate"
      }),
      weightChrome: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.08,
        metalness: 0.96,
        name: "Mat_Class_E2_Weight"
      }),
      weightWoodBox: new THREE.MeshStandardMaterial({
        color: 0x451a03,
        roughness: 0.45,
        metalness: 0.05,
        name: "Mat_Mahogany_Weight_Box"
      }),
      powerCordRubber: new THREE.MeshStandardMaterial({
        color: 0x111317,
        roughness: 0.75,
        metalness: 0.1,
        name: "Mat_SJTOW_Rubber_Cord"
      }),
      nemaPlugMolded: new THREE.MeshStandardMaterial({
        color: 0x1c1f24,
        roughness: 0.5,
        metalness: 0.15,
        name: "Mat_NEMA_Molded_Plug"
      }),
      nemaBrassPin: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.88,
        name: "Mat_Plug_Brass_Pin"
      }),
      pcTowerSteel: new THREE.MeshStandardMaterial({
        color: 0x181d24,
        roughness: 0.35,
        metalness: 0.75,
        name: "Mat_PC_Chassis_Steel"
      }),
      cat6Blue: new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        roughness: 0.6,
        metalness: 0.1,
        name: "Mat_Cat6_Ethernet_Blue"
      }),
      serialBeige: new THREE.MeshStandardMaterial({
        color: 0xd1d5db,
        roughness: 0.5,
        metalness: 0.1,
        name: "Mat_RS232_Serial_Beige"
      }),
      semStubAluminum: new THREE.MeshStandardMaterial({
        color: 0xc4cbd4,
        roughness: 0.18,
        metalness: 0.9,
        name: "Mat_SEM_Stub_Aluminum"
      }),
      torqueWrenchChrome: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.12,
        metalness: 0.94,
        name: "Mat_Torque_Wrench_Chrome"
      }),

      cabinetBody: new THREE.MeshStandardMaterial({
        color: 0x242a34,
        roughness: 0.55,
        metalness: 0.2,
        name: "Mat_SEFA_Slate_Steel"
      }),
      cabinetHandle: new THREE.MeshStandardMaterial({
        color: 0xb8c0ca,
        roughness: 0.25,
        metalness: 0.85,
        name: "Mat_Brushed_Stainless"
      }),
      screenBezelMetal: new THREE.MeshStandardMaterial({
        color: 0x14171d,
        roughness: 0.28,
        metalness: 0.82,
        name: "Mat_Screen_Microbezel"
      }),
      leatherBlack: new THREE.MeshStandardMaterial({
        color: 0x16171a,
        roughness: 0.65,
        metalness: 0.1,
        name: "Mat_Executive_Leather"
      }),
      telDigitalGreen: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x10b981,
        emissiveIntensity: 0.95,
        roughness: 0.1,
        name: "Mat_TEL_Digital_Green"
      }),
      sashGlass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        roughness: 0.08,
        ior: 1.5,
        name: "Mat_Sash_Acrylic"
      }),
      fumeHoodSteel: new THREE.MeshStandardMaterial({
        color: 0x2a3038,
        roughness: 0.4,
        metalness: 0.4,
        name: "Mat_Fume_Hood_Shell"
      }),
      vacuumHoseRed: new THREE.MeshStandardMaterial({
        color: 0x852e25,
        roughness: 0.75,
        metalness: 0.05,
        name: "Mat_Vacuum_Rubber_Red"
      }),

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
      }),
      soapTranslucentAmber: new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
        ior: 1.38,
        name: "Mat_Liquid_Soap_Amber"
      }),
      soapTranslucentEmerald: new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
        ior: 1.38,
        name: "Mat_Liquid_Soap_Emerald"
      }),
      stainlessSoapDispenser: new THREE.MeshStandardMaterial({
        color: 0xd8dde4,
        roughness: 0.22,
        metalness: 0.88,
        name: "Mat_Stainless_Soap_Dispenser"
      }),
      gasTurretDarkBronze: new THREE.MeshStandardMaterial({
        color: 0x333b48,
        roughness: 0.35,
        metalness: 0.75,
        name: "Mat_Gas_Turret_Bronze"
      }),
      gasButtonBlue: new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        roughness: 0.3,
        metalness: 0.2,
        name: "Mat_Gas_Index_Button"
      }),
      gasTubingRed: new THREE.MeshStandardMaterial({
        color: 0xb91c1c,
        roughness: 0.65,
        metalness: 0.05,
        name: "Mat_Red_Gum_Rubber_Hose"
      }),
      agarGelNutrient: new THREE.MeshPhysicalMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.82,
        roughness: 0.15,
        ior: 1.35,
        name: "Mat_Nutrient_Agar_Gel"
      }),
      agarGelBlood: new THREE.MeshPhysicalMaterial({
        color: 0x991b1b,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        ior: 1.36,
        name: "Mat_Blood_Agar_Gel"
      }),
      colonyStreaksOpal: new THREE.MeshStandardMaterial({
        color: 0xfef9c3,
        roughness: 0.4,
        metalness: 0.05,
        name: "Mat_Bacterial_Colony_Streak"
      }),
      stopperCork: new THREE.MeshStandardMaterial({
        color: 0x92613b,
        roughness: 0.9,
        metalness: 0.0,
        name: "Mat_Natural_Cork_Stopper"
      }),
      stopperRedRubber: new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        roughness: 0.75,
        metalness: 0.05,
        name: "Mat_Red_Rubber_Stopper"
      }),
      desiccatorPorcelain: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.3,
        metalness: 0.05,
        name: "Mat_Desiccator_Porcelain_Plate"
      }),
      silicaGelCobaltBlue: new THREE.MeshPhysicalMaterial({
        color: 0x1d4ed8,
        transparent: true,
        opacity: 0.75,
        roughness: 0.2,
        ior: 1.45,
        name: "Mat_Silica_Gel_Indicator_Beads"
      })
    };
  }

  // --- Sinks & Running Water ---
  _buildSinksAndFaucets() {
    // Sink 1: Primary Double Wash Sink in Synthesis Bay (X = -12.2, Z = 5.0)
    this._createSinkStation(-12.2, 5.0, "Sink_Synthesis");

    // Sink 2: Secondary Sink in Analytical Hall (X = -10.0, Z = -8.25)
    this._createSinkStation(-10.0, -8.25, "Sink_Analytical");
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

    // --- Laboratory Hand Washing Soap Dispenser at Sink Station ---
    const soapDisp = new THREE.Group();
    soapDisp.position.set(0.24, 0.28, -0.22); // Mounted right of faucet
    soapDisp.name = `Soap_Dispenser_${id}`;

    // Brushed stainless wall/backsplash bracket
    const dispBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.18, 0.08),
      this.materials.stainlessSoapDispenser
    );
    soapDisp.add(dispBracket);

    // Translucent viewing reservoir showing liquid soap & meniscus
    const resGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.12, 16);
    const soapMat = id === "Sink_Synthesis" ? this.materials.soapTranslucentAmber : this.materials.soapTranslucentEmerald;
    const soapRes = new THREE.Mesh(resGeo, soapMat);
    soapRes.position.set(0, 0.01, 0.025);
    soapDisp.add(soapRes);

    // Downward angled dispensing nozzle & chrome push lever
    const dispNozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.008, 0.04, 12),
      this.materials.chrome
    );
    dispNozzle.rotation.x = Math.PI / 4;
    dispNozzle.position.set(0, -0.07, 0.05);
    soapDisp.add(dispNozzle);

    const pushLever = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.015, 0.05),
      this.materials.chrome
    );
    pushLever.position.set(0, -0.09, 0.025);
    soapDisp.add(pushLever);

    // Interactive soap dispensing action
    soapDisp.userData = {
      isSoapDispenser: true,
      sinkId: id,
      label: "Antimicrobial Liquid Hand Soap"
    };
    soapDisp.userData.toggle = () => {
      labAudio.playSoapDispense();
      // Animate lever depress
      pushLever.position.y -= 0.012;
      setTimeout(() => { pushLever.position.y += 0.012; }, 180);
    };
    this.interactiveObjects.push(soapDisp);
    group.add(soapDisp);

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

  // --- Bunsen / Tirrill Burners & Benchtop Gas Line Hookups ---
  _buildBunsenBurners() {
    // 2x Bunsen Burners on Synthesis Prep Bench (X: -11.5, -8.5, Z: 5.0)
    // with heavy brass benchtop dual gas turrets seated on the backsplash (Z = 5.28)
    [-11.5, -8.5].forEach((bx, idx) => {
      this._createGasTurretHookup(bx, 5.28, `GasTurret_${idx + 1}`);
      this._createBunsenBurner(bx, 5.0, `Burner_${idx + 1}`, bx, 5.28);
    });
  }

  // Heavy cast brass dual gas petcock turret
  _createGasTurretHookup(cx, cz, id) {
    const turret = new THREE.Group();
    turret.position.set(cx, 0.90, cz);
    turret.name = id;

    // Heavy round brass mounting base flange
    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.05, 0.018, 16),
      this.materials.gasTurretDarkBronze
    );
    flange.position.y = 0.009;
    turret.add(flange);

    // Vertical riser column
    const riser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.12, 16),
      this.materials.gasTurretDarkBronze
    );
    riser.position.y = 0.07;
    turret.add(riser);

    // Dual 90° Serrated Hose Barbs (Left and Right)
    [-0.045, 0.045].forEach((bx, idx) => {
      // Quarter-turn valve ball body
      const valveBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.035, 12),
        this.materials.gasTurretDarkBronze
      );
      valveBody.rotation.z = Math.PI / 2;
      valveBody.position.set(bx, 0.10, 0);
      turret.add(valveBody);

      // Serrated Hose Barb extending forward/downward toward bench
      const barb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.009, 0.045, 12),
        this.materials.brassBurner
      );
      barb.rotation.x = Math.PI / 3;
      barb.position.set(bx, 0.08, -0.025);
      turret.add(barb);

      // Valve handle lever with blue "GAS" index button
      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, 0.008, 0.05),
        this.materials.gasTurretDarkBronze
      );
      handle.position.set(bx, 0.12, 0.01);
      turret.add(handle);

      const gasBtn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.006, 12),
        this.materials.gasButtonBlue
      );
      gasBtn.position.set(bx, 0.126, 0.01);
      turret.add(gasBtn);
    });

    turret.userData = {
      isGasTurret: true,
      turretId: id,
      label: "Laboratory Benchtop Gas Turret"
    };
    turret.userData.toggle = () => {
      labAudio.playButtonClick();
    };

    this.interactiveObjects.push(turret);
    this.root.add(turret);
  }

  _createBunsenBurner(cx, cz, id, turretX = cx, turretZ = cz + 0.28) {
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

    // Red gum rubber thick-wall gas tubing connecting from rear gas turret to burner base inlet
    const relTurretZ = turretZ - cz;
    const relTurretX = turretX - cx;
    const tubeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.02, 0),
      new THREE.Vector3(relTurretX * 0.3, 0.012, relTurretZ * 0.3),
      new THREE.Vector3(relTurretX * 0.7, 0.025, relTurretZ * 0.7),
      new THREE.Vector3(relTurretX, 0.08, relTurretZ)
    ]);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(tubeCurve, 20, 0.008, 10, false),
      this.materials.gasTubingRed
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
    // 1. Reagent Shelf Bottles on Analytical Island (X: -10.0, Z: -4.5, resting on lower shelf Y = 1.261m)
    const shelfBottles = [
      { name: "0.1M HCl", color: 0xb45309, x: -10.8 },
      { name: "0.1M NaOH", color: 0xb45309, x: -10.3 },
      { name: "Phenolphthalein 1%", color: 0x1e293b, x: -9.8 },
      { name: "DI H2O", color: 0x0284c7, x: -9.3 }
    ];

    shelfBottles.forEach((b) => {
      const bottle = this._createReagentBottle(b.name, b.color);
      bottle.position.set(b.x, 1.261, -4.5);
      this.root.add(bottle);
      this.interactiveObjects.push(bottle);
    });

    // 2. Beaker with Colorimetric Acid-Base Neutralization Demo (Titration Bench beside Sink)
    this._createTitrationBeaker(-9.4, -8.25);

    // 3. Volumetric Flasks (Analytical Preparation on Island 1 & 2)
    this._createVolumetricFlask(-12.35, -4.15, "250 mL", this.materials.fluidGreen);
    this._createVolumetricFlask(-7.6, -4.15, "100 mL", this.materials.fluidAmber);

    // 4. Graduated Cylinders with Anti-Roll Hexagonal Bases
    this._createGraduatedCylinder(-1.2, -4.15, "100 mL", this.materials.fluidBlue);
    this._createGraduatedCylinder(-6.85, -4.15, "250 mL", this.materials.reagentFluidClear);

    // 5. Conical Erlenmeyer Reaction Flasks
    this._createErlenmeyerFlask(-11.0, 5.0, "500 mL", this.materials.fluidBlue);
    this._createErlenmeyerFlask(-8.0, 5.0, "250 mL", this.materials.fluidAmber);
    this._createErlenmeyerFlask(-1.5, 4.65, "125 mL", this.materials.fluidGreen);

    // 6. Polypropylene Test Tube Racks with Colorful Analytical Fractions
    this._createTestTubeRack(-3.2, 4.65, this.materials.ppBlueRack);
    this._createTestTubeRack(-7.0, -4.35, this.materials.ppOrangeRack);

    // 7. Precision 4-Place Micropipettor Carousel Stand in Sample Prep Suite
    this._createPipettorCarousel(0.2, 4.65);

    // 8. Color-Coded LDPE Squeeze Wash Bottles (DI Water, Acetone, Methanol, Isopropanol)
    this._createWashBottle(-12.0, -4.15, "DI WATER", this.materials.screwCapBlue);
    this._createWashBottle(-11.8, -4.15, "ACETONE", this.materials.screwCapRed);
    this._createWashBottle(-7.4, 4.65, "METHANOL", this.materials.screwCapGreen);
    this._createWashBottle(-11.5, 5.0, "ISOPROPANOL", this.materials.screwCapYellow);

    // 9. Wide-Mouth Chemical Storage Jars on Reagent Shelves & Prep Benches
    this._createChemicalJar(-9.0, 1.261, -4.5, "Sodium Chloride USP", "NaCl");
    this._createChemicalJar(-8.6, 1.261, -4.5, "Potassium Bromide IR", "KBr");
    this._createChemicalJar(-2.5, 4.65, "EDTA Disodium 99%", "C10H14N2Na2O8");

    // 10. Heavy Amber Winchester Solvent Bottles in Synthesis Bay & Chemical Vault
    this._createWinchesterSolventBottle(-11.2, 5.3, "ACETONITRILE", "HPLC GRADE");
    this._createWinchesterSolventBottle(-10.9, 5.3, "METHANOL", "OPTIMA LC/MS");
    this._createWinchesterSolventBottle(-10.6, 5.3, "HEXANES", "ACS REAGENT");

    // 11. Zone 5 Chemical Storage Steel Racking (North Wall X = 4.5, Z = 8.4, Shelves Y = 0.42, 0.97, 1.52)
    const vaultChemicals = [
      { name: "Sodium Hydroxide ACS", f: "NaOH", shelf: 0, x: 3.2 },
      { name: "Magnesium Sulfate Anh.", f: "MgSO4", shelf: 0, x: 3.8 },
      { name: "Potassium Permanganate", f: "KMnO4", shelf: 0, x: 4.4 },
      { name: "Citric Acid Anhydrous", f: "C6H8O7", shelf: 1, x: 3.2 },
      { name: "Silver Nitrate 99.9%", f: "AgNO3", shelf: 1, x: 3.8 },
      { name: "Potassium Iodide USP", f: "KI", shelf: 1, x: 4.4 }
    ];
    vaultChemicals.forEach(c => {
      const y = 0.42 + c.shelf * 0.55;
      this._createChemicalJar(c.x, y, 8.4, c.name, c.f);
    });

    // Winchester Solvents on Vault Shelf 2 (Y = 1.52m, Z = 8.4)
    this._createWinchesterSolventBottle(3.5, 0.42 + 2 * 0.55, 8.4, "DICHLOROMETHANE", "HPLC GRADE");
    this._createWinchesterSolventBottle(4.4, 0.42 + 2 * 0.55, 8.4, "TETRAHYDROFURAN", "ANHYDROUS");
    this._createWinchesterSolventBottle(5.3, 0.42 + 2 * 0.55, 8.4, "ETHYL ACETATE", "ACS REAGENT");

    // 12. Griffin Glass Beakers Suite (50 mL to 1000 mL with Dual Menisci & Graduations)
    this._createGriffinBeaker(-9.8, -4.15, "1000 mL", this.materials.fluidBlue, 0.65);
    this._createGriffinBeaker(-9.5, -4.15, "600 mL", this.materials.fluidAmber, 0.5);
    this._createGriffinBeaker(-9.2, -4.15, "250 mL", this.materials.fluidViolet, 0.7);
    this._createGriffinBeaker(-8.9, -4.15, "100 mL", this.materials.fluidGreen, 0.4);
    this._createGriffinBeaker(-8.6, -4.15, "50 mL", this.materials.reagentFluidClear, 0.5);

    // 13. Heavy Borosilicate Vacuum Desiccator with Cobalt Silica Gel Beads (Pharma QC X: -3.8, Z: -4.15)
    this._createVacuumDesiccator(-3.8, -4.15);

    // 14. Culture Media Petri Dishes with Bacterial Isolation Streaks (Sample Prep X: -1.0, Z = 4.65)
    this._createPetriDishStack(-1.0, 4.65);
    this._createSinglePetriDish(-0.7, 4.65, "Nutrient Agar · E. coli Streak", this.materials.agarGelNutrient, true);
    this._createSinglePetriDish(-0.4, 4.65, "Blood Agar · S. aureus Hemolysis", this.materials.agarGelBlood, true);

    // 15. Classical Glass Pipettes with Suction Bulbs & Pipette Fillers (Sample Prep X: -0.1, Z = 4.65)
    this._createPipetteStand(-0.1, 4.65);

    // 16. Büchner Vacuum Filter Flask with Ceramic Perforated Funnel (Synthesis Bench X: -10.2, Z: 5.0)
    this._createBuchnerFilterFlask(-10.2, 5.0);
  }

  // --- Classical Griffin Borosilicate Glass Beakers with Pour Spouts ---
  _createGriffinBeaker(cx, cz, volume = "250 mL", fluidMat = null, fillRatio = 0.6) {
    const beaker = new THREE.Group();
    beaker.position.set(cx, 0.90, cz);
    beaker.name = `Griffin_Beaker_${volume}`;

    let radius = 0.035;
    let height = 0.08;
    if (volume === "1000 mL") { radius = 0.055; height = 0.14; }
    else if (volume === "600 mL") { radius = 0.046; height = 0.115; }
    else if (volume === "250 mL") { radius = 0.036; height = 0.088; }
    else if (volume === "100 mL") { radius = 0.026; height = 0.068; }
    else if (volume === "50 mL") { radius = 0.020; height = 0.052; }

    // Thin cylindrical glass body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, height, 24, 1, true),
      this.materials.glassPyrex
    );
    body.position.y = height / 2;
    beaker.add(body);

    // Flat bottom
    const bottom = new THREE.Mesh(
      new THREE.CircleGeometry(radius, 24),
      this.materials.glassPyrex
    );
    bottom.rotation.x = Math.PI / 2;
    beaker.add(bottom);

    // Flared beaded pouring rim & spout
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.002, 6, 24),
      this.materials.glassPyrex
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = height;
    beaker.add(rim);

    // Beaker pouring spout lip
    const spout = new THREE.Mesh(
      new THREE.ConeGeometry(0.008, 0.012, 8),
      this.materials.glassPyrex
    );
    spout.rotation.z = Math.PI / 3;
    spout.position.set(radius + 0.003, height, 0);
    beaker.add(spout);

    // Graduation silk marks
    const gradCanvas = document.createElement("canvas");
    gradCanvas.width = 128;
    gradCanvas.height = 256;
    const gctx = gradCanvas.getContext("2d");
    gctx.fillStyle = "rgba(0,0,0,0)";
    gctx.fillRect(0, 0, 128, 256);
    gctx.fillStyle = "#ffffff";
    gctx.font = "bold 18px sans-serif";
    gctx.fillText("PYREX®", 10, 40);
    gctx.font = "14px monospace";
    gctx.fillText(volume, 10, 65);
    for (let l = 1; l <= 5; l++) {
      const yLine = 220 - l * 30;
      gctx.fillRect(10, yLine, l % 2 === 0 ? 35 : 20, 2);
    }
    const gradTex = new THREE.CanvasTexture(gradCanvas);
    const gradMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(radius * 1.2, height * 0.7),
      new THREE.MeshBasicMaterial({ map: gradTex, transparent: true })
    );
    gradMesh.position.set(0, height * 0.5, radius + 0.001);
    beaker.add(gradMesh);

    // Liquid contents & concave meniscus
    if (fluidMat && fillRatio > 0) {
      const fHeight = height * fillRatio;
      const fluid = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.96, radius * 0.96, fHeight, 24),
        fluidMat
      );
      fluid.position.y = fHeight / 2;
      beaker.add(fluid);

      const meniscus = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.94, 0.002, 6, 24),
        fluidMat
      );
      meniscus.rotation.x = Math.PI / 2;
      meniscus.position.y = fHeight;
      beaker.add(meniscus);
    }

    this.root.add(beaker);
    return beaker;
  }

  // --- Heavy Borosilicate Vacuum Desiccator with Cobalt Silica Gel Beads ---
  _createVacuumDesiccator(cx, cz) {
    const desiccator = new THREE.Group();
    desiccator.position.set(cx, 0.90, cz);
    desiccator.name = "Vacuum_Desiccator_Glass";

    const rBase = 0.11;
    const hLower = 0.09;
    const hFlange = 0.015;

    // Lower hemispherical / cylindrical bowl
    const lowerBowl = new THREE.Mesh(
      new THREE.CylinderGeometry(rBase, rBase * 0.85, hLower, 24),
      this.materials.glassPyrex
    );
    lowerBowl.position.y = hLower / 2;
    desiccator.add(lowerBowl);

    // Cobalt-blue active silica gel indicator desiccant bed in bottom
    const silicaBed = new THREE.Mesh(
      new THREE.CylinderGeometry(rBase * 0.82, rBase * 0.82, 0.025, 24),
      this.materials.silicaGelCobaltBlue
    );
    silicaBed.position.y = 0.015;
    desiccator.add(silicaBed);

    // White Perforated Porcelain Desiccator Plate
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(rBase * 0.94, rBase * 0.94, 0.008, 24),
      this.materials.desiccatorPorcelain
    );
    plate.position.y = 0.045;
    desiccator.add(plate);

    // Precision Ground Flat Glass Flange Collar
    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(rBase + 0.02, rBase + 0.02, hFlange, 24),
      this.materials.glassPyrex
    );
    flange.position.y = hLower + hFlange / 2;
    desiccator.add(flange);

    // Domed Glass Lid with heavy ground glass handle & vacuum stopcock port
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(rBase + 0.005, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.2),
      this.materials.glassPyrex
    );
    dome.position.y = hLower + hFlange;
    desiccator.add(dome);

    // Vacuum Stopcock Valve on dome summit
    const stopcockBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.045, 12),
      this.materials.glassPyrex
    );
    stopcockBody.position.y = hLower + hFlange + 0.095;
    desiccator.add(stopcockBody);

    const stopcockHandle = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.01, 0.01),
      this.materials.screwCapBlue
    );
    stopcockHandle.position.y = hLower + hFlange + 0.11;
    desiccator.add(stopcockHandle);

    desiccator.userData = {
      isDesiccator: true,
      label: "Borosilicate Glass Vacuum Desiccator"
    };
    desiccator.userData.toggle = () => {
      labAudio.playButtonClick();
    };

    this.interactiveObjects.push(desiccator);
    this.root.add(desiccator);
  }

  // --- Petri Dishes (Culture Plates) with Agar & Colony Streaks ---
  _createPetriDishStack(cx, cz) {
    const stack = new THREE.Group();
    stack.position.set(cx, 0.90, cz);
    stack.name = "Petri_Dish_Sterile_Stack";

    // Stack of 4 sterile polystyrene plates
    for (let p = 0; p < 4; p++) {
      const yOffset = p * 0.018;
      const baseDish = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.014, 24),
        this.materials.glassPyrex
      );
      baseDish.position.y = yOffset + 0.007;
      stack.add(baseDish);

      const lid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.052, 0.052, 0.008, 24),
        this.materials.glassPyrex
      );
      lid.position.y = yOffset + 0.015;
      stack.add(lid);
    }

    this.root.add(stack);
  }

  _createSinglePetriDish(cx, cz, label, agarMat, isStreaked = false) {
    const dish = new THREE.Group();
    dish.position.set(cx, 0.90, cz);
    dish.name = `Petri_Dish_${label}`;

    const rDish = 0.05;

    // Bottom plate
    const baseDish = new THREE.Mesh(
      new THREE.CylinderGeometry(rDish, rDish, 0.014, 24),
      this.materials.glassPyrex
    );
    baseDish.position.y = 0.007;
    dish.add(baseDish);

    // Agar bed layer (3mm thickness)
    const agar = new THREE.Mesh(
      new THREE.CylinderGeometry(rDish * 0.96, rDish * 0.96, 0.005, 24),
      agarMat
    );
    agar.position.y = 0.004;
    dish.add(agar);

    // Microbial four-quadrant streak pattern
    if (isStreaked) {
      const streakCanvas = document.createElement("canvas");
      streakCanvas.width = 256;
      streakCanvas.height = 256;
      const sctx = streakCanvas.getContext("2d");
      sctx.fillStyle = "rgba(0,0,0,0)";
      sctx.fillRect(0, 0, 256, 256);

      // Primary dense streak
      sctx.strokeStyle = "#fef08a";
      sctx.lineWidth = 3;
      for (let s = 0; s < 8; s++) {
        sctx.beginPath();
        sctx.moveTo(30 + s * 8, 40);
        sctx.lineTo(80 + s * 6, 110);
        sctx.stroke();
      }

      // Secondary zigzag dilution
      sctx.lineWidth = 2;
      for (let s = 0; s < 6; s++) {
        sctx.beginPath();
        sctx.moveTo(80, 110 + s * 8);
        sctx.lineTo(160, 140 + s * 6);
        sctx.stroke();
      }

      // Single isolated colony forming units (CFUs)
      sctx.fillStyle = "#ffffff";
      const colonies = [
        [180, 180], [195, 175], [210, 190], [170, 205], [190, 220], [165, 160]
      ];
      colonies.forEach(([x, y]) => {
        sctx.beginPath();
        sctx.arc(x, y, 4, 0, Math.PI * 2);
        sctx.fill();
      });

      const streakTex = new THREE.CanvasTexture(streakCanvas);
      const streakPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(rDish * 1.8, rDish * 1.8),
        new THREE.MeshBasicMaterial({ map: streakTex, transparent: true })
      );
      streakPlane.rotation.x = -Math.PI / 2;
      streakPlane.position.y = 0.0075;
      dish.add(streakPlane);
    }

    // Top Cover Lid (Slightly tilted open for culture aeration)
    const lid = new THREE.Mesh(
      new THREE.CylinderGeometry(rDish * 1.04, rDish * 1.04, 0.008, 24),
      this.materials.glassPyrex
    );
    lid.rotation.z = 0.08; // Natural tilt
    lid.position.set(0.004, 0.016, 0);
    dish.add(lid);

    dish.userData = {
      isPetriDish: true,
      label
    };
    dish.userData.toggle = () => {
      labAudio.playButtonClick();
    };

    this.interactiveObjects.push(dish);
    this.root.add(dish);
  }

  // --- Classical Pipette Stand with Volumetric & Mohr Pipettes ---
  _createPipetteStand(cx, cz) {
    const stand = new THREE.Group();
    stand.position.set(cx, 0.90, cz);
    stand.name = "Pipette_Stand_Rotary";

    // Weighted circular base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.08, 0.018, 20),
      this.materials.cabinetBody
    );
    base.position.y = 0.009;
    stand.add(base);

    // Center vertical support rod
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.44, 16),
      this.materials.chrome
    );
    rod.position.y = 0.22;
    stand.add(rod);

    // Rotary upper pipette retaining disk with radial slots
    const upperDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.012, 20),
      this.materials.ppBlueRack
    );
    upperDisk.position.y = 0.38;
    stand.add(upperDisk);

    // Suspended glass pipettes (Class A 25mL, 10mL, 5mL and Mohr measuring pipettes)
    const pipettes = [
      { r: 0.05, angle: 0, len: 0.38, hasBulb: true, bulbMat: this.materials.stopperRedRubber },
      { r: 0.05, angle: Math.PI / 2, len: 0.34, hasBulb: false, filler: true },
      { r: 0.05, angle: Math.PI, len: 0.40, hasBulb: true, bulbMat: this.materials.stopperRedRubber },
      { r: 0.05, angle: Math.PI * 1.5, len: 0.32, hasBulb: false, filler: true }
    ];

    pipettes.forEach((p, idx) => {
      const px = Math.cos(p.angle) * p.r;
      const pz = Math.sin(p.angle) * p.r;

      const pipGroup = new THREE.Group();
      pipGroup.position.set(px, 0.20, pz);

      // Slender glass pipette stem
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.004, 0.002, p.len, 12),
        this.materials.glassPyrex
      );
      pipGroup.add(stem);

      // Spherical central reservoir bulb (for volumetric pipettes)
      if (p.hasBulb) {
        const midBulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.012, 12, 12),
          this.materials.glassPyrex
        );
        midBulb.scale.set(1, 2.2, 1);
        midBulb.position.y = 0;
        pipGroup.add(midBulb);

        // Red rubber suction filler bulb on top
        const suctionBulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.016, 12, 12),
          p.bulbMat
        );
        suctionBulb.scale.set(1, 1.4, 1);
        suctionBulb.position.y = p.len / 2 + 0.015;
        pipGroup.add(suctionBulb);
      } else if (p.filler) {
        // Green thumbwheel pipette pump
        const pump = new THREE.Mesh(
          new THREE.CylinderGeometry(0.010, 0.010, 0.065, 12),
          this.materials.screwCapGreen
        );
        pump.position.y = p.len / 2 + 0.025;
        pipGroup.add(pump);
      }

      stand.add(pipGroup);
    });

    this.root.add(stand);
  }

  // --- Büchner Vacuum Filtration Flask & Porcelain Funnel ---
  _createBuchnerFilterFlask(cx, cz) {
    const assembly = new THREE.Group();
    assembly.position.set(cx, 0.90, cz);
    assembly.name = "Buchner_Vacuum_Filtration_Setup";

    const rBottom = 0.065;
    const rTop = 0.022;
    const hCone = 0.14;
    const hNeck = 0.045;

    // Heavy-wall Erlenmeyer filter flask body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(rTop, rBottom, hCone, 18, 1, true),
      this.materials.glassPyrex
    );
    body.position.y = hCone / 2;
    assembly.add(body);

    const base = new THREE.Mesh(new THREE.CircleGeometry(rBottom, 18), this.materials.glassPyrex);
    base.rotation.x = Math.PI / 2;
    assembly.add(base);

    // Neck
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(rTop, rTop, hNeck, 18, 1, true),
      this.materials.glassPyrex
    );
    neck.position.y = hCone + hNeck / 2;
    assembly.add(neck);

    // Side-arm vacuum tubulure barb extending at 90 degrees
    const tubulure = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.035, 12),
      this.materials.glassPyrex
    );
    tubulure.rotation.z = Math.PI / 2;
    tubulure.position.set(rTop + 0.015, hCone + hNeck * 0.45, 0);
    assembly.add(tubulure);

    // Thick-wall vacuum rubber tubing connecting from side-arm
    const vacHoseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(rTop + 0.035, hCone + hNeck * 0.45, 0),
      new THREE.Vector3(rTop + 0.08, hCone + 0.01, 0.04),
      new THREE.Vector3(rTop + 0.12, 0.02, 0.08)
    ]);
    const vacHose = new THREE.Mesh(
      new THREE.TubeGeometry(vacHoseCurve, 16, 0.008, 8, false),
      this.materials.vacuumHoseRed
    );
    assembly.add(vacHose);

    // Neoprene black adapter gasket collar
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(rTop * 1.05, rTop * 0.95, 0.018, 18),
      this.materials.powerCordRubber
    );
    collar.position.y = hCone + hNeck + 0.008;
    assembly.add(collar);

    // White Glazed Porcelain Büchner Funnel
    const funnelStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.055, 12),
      this.materials.desiccatorPorcelain
    );
    funnelStem.position.y = hCone + hNeck;
    assembly.add(funnelStem);

    const funnelBowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.025, 0.045, 24),
      this.materials.desiccatorPorcelain
    );
    funnelBowl.position.y = hCone + hNeck + 0.04;
    assembly.add(funnelBowl);

    // Circular white filter paper disk inside funnel
    const filterPaper = new THREE.Mesh(
      new THREE.CircleGeometry(0.042, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
    );
    filterPaper.rotation.x = -Math.PI / 2;
    filterPaper.position.y = hCone + hNeck + 0.042;
    assembly.add(filterPaper);

    // Crystal precipitate cake on filter paper
    const cake = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.008, 20),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.85 })
    );
    cake.position.y = hCone + hNeck + 0.046;
    assembly.add(cake);

    assembly.userData = {
      isFilterFlask: true,
      label: "Büchner Vacuum Filtration System"
    };
    assembly.userData.toggle = () => {
      labAudio.playButtonClick();
    };

    this.interactiveObjects.push(assembly);
    this.root.add(assembly);
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

  // --- High-Fidelity Benchtop Duplex Power Outlets (Power_Receptacle_Duplex) ---
  _buildDuplexPowerOutlets() {
    const outletPositions = [
      [-12.0, -4.5], [-10.0, -4.5], [-8.0, -4.5], // Analytical Island
      [-4.0, -4.5], [-2.0, -4.5], [0.0, -4.5],    // Pharma QC Island
      [-2.0, 5.0], [-0.5, 5.0], [1.0, 5.0], [2.0, 5.0], // Sample Prep Island
      [-12.0, 5.0], [-8.0, 5.0], // Synthesis Island
      [-11.8, -8.65], [-8.2, -8.65], // Perimeter Wet & Furnace Benches (Flush on Backsplash)
      [5.5, -3.4] // Electron Microscopy Specimen Prep Bench
    ];

    outletPositions.forEach(([ox, oz], i) => {
      const group = new THREE.Group();
      group.position.set(ox, 1.05, oz);
      group.name = `Power_Receptacle_Duplex_${i + 1}`;

      // Galvanized deep junction box
      const jBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.125, 0.045),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.85 })
      );
      group.add(jBox);

      // Brushed Stainless Steel Architectural Beveled Faceplate
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(0.075, 0.12, 0.006),
        new THREE.MeshStandardMaterial({ color: 0xd8dde4, roughness: 0.22, metalness: 0.9 })
      );
      plate.position.z = 0.024;
      group.add(plate);

      // Upper and Lower NEMA 5-15R Receptacle faces
      [-0.028, 0.028].forEach((ry) => {
        const socketFace = new THREE.Mesh(
          new THREE.CylinderGeometry(0.016, 0.016, 0.003, 16),
          new THREE.MeshStandardMaterial({ color: 0x1e242d, roughness: 0.7 })
        );
        socketFace.rotation.x = Math.PI / 2;
        socketFace.position.set(0, ry, 0.027);
        group.add(socketFace);

        // Ground hole (D-shaped)
        const gHole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0025, 0.0025, 0.004, 8),
          new THREE.MeshBasicMaterial({ color: 0x050709 })
        );
        gHole.rotation.x = Math.PI / 2;
        gHole.position.set(0, ry - 0.007, 0.029);
        group.add(gHole);

        // Hot and Neutral Parallel Slots
        [-0.0045, 0.0045].forEach((sx, sIdx) => {
          const slot = new THREE.Mesh(
            new THREE.BoxGeometry(0.0015, sIdx === 0 ? 0.0065 : 0.0055, 0.004),
            new THREE.MeshBasicMaterial({ color: 0x050709 })
          );
          slot.position.set(sx, ry + 0.004, 0.029);
          group.add(slot);
        });
      });

      // GFCI Test and Reset buttons with green status LED
      const testBtn = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, 0.006, 0.003),
        new THREE.MeshStandardMaterial({ color: 0x111827 })
      );
      testBtn.position.set(-0.01, 0, 0.028);
      group.add(testBtn);

      const resetBtn = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, 0.006, 0.003),
        new THREE.MeshStandardMaterial({ color: 0xdc2626 })
      );
      resetBtn.position.set(0.01, 0, 0.028);
      group.add(resetBtn);

      const statusLED = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0015, 0.0015, 0.003, 8),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.9 })
      );
      statusLED.rotation.x = Math.PI / 2;
      statusLED.position.set(0, -0.012, 0.028);
      group.add(statusLED);

      this.root.add(group);
    });
  }

// --- Dedicated Instrument Workstation Surroundings & Accessories ---
  _buildInstrumentWorkstationSurroundings() {
    const BENCH_Y = 0.90;

    // 1. Centralized Analytical PC Workstation (Analytical Island X = -10.0, Z = -4.15)
    // Mounted directly over the technician kneespace bay with the ergonomic swivel stool!
    this._createAnalyticalPCWorkstation(-10.0, -4.15, 0, "twin-dashboard");

    // 2. Shimadzu UV-2600i Spectrophotometer Station (Analytical Island X = -11.6, Z = -4.15)
    // Kimwipes Delicate Task Wiper Box
    this._createKimwipesBox(-12.15, -4.0, 0.15);
    // Velvet-Lined Quartz Cuvette Case
    this._createCuvetteBox(-12.15, -4.28);
    // Calibration Standard Solution Flask
    this._createVolumetricFlask(-12.35, -4.15, "100 mL", this.materials.fluidBlue);
    // Power Cord & RS-232 Cable to central PC
    this._createEquipmentPowerCord("spectrophotometer", -11.6, BENCH_Y + 0.12, -4.35, -12.0, 1.05, -4.5);
    this._createCommunicationCable(-11.6, BENCH_Y + 0.10, -4.35, -10.35, BENCH_Y + 0.20, -4.2, "serial");

    // 3. Thermo Nicolet iS50 FTIR Spectrometer Station (Analytical Island X = -8.6, Z = -4.15)
    // Polished Agate Mortar & Pestle for Solid Grinding
    this._createAgateMortarPestle(-9.2, -4.0);
    // KBr Pellet Die Press Kit
    this._createKBrPelletPress(-9.2, -4.28);
    // Wash Bottle for ATR Diamond Cleaning (Ethanol)
    this._createWashBottle(-9.4, -4.15, "ETHANOL 99%", this.materials.screwCapGreen);
    // Kimwipes box
    this._createKimwipesBox(-9.4, -4.35, 0);
    // Power Cord & CAT6 Cable to central PC
    this._createEquipmentPowerCord("ftir", -8.6, BENCH_Y + 0.14, -4.35, -8.0, 1.05, -4.5);
    this._createCommunicationCable(-8.6, BENCH_Y + 0.10, -4.35, -9.65, BENCH_Y + 0.20, -4.2, "cat6");

    // 4. Metrohm 901 Karl Fischer Titrator Station (Analytical Island X = -7.2, Z = -4.15)
    // Hamilton 100 uL Gastight Microsyringe
    this._createMicrosyringe(-7.6, -4.0);
    // Hydranal Composite 5 Reagent Bottle with Delivery Tubing
    this._createKarlFischerReagentBottle(-7.6, -4.28);
    // Waste Solvent Bottle with PTFE Discharge Line
    this._createWinchesterSolventBottle(-7.85, 0.90, -4.28, "KF TITRATION WASTE", "HAZARDOUS");
    // Indicating Silica Gel Drying Tube Towers
    this._createDryingTubesTower(-7.85, -4.0);
    // Power Cord
    this._createEquipmentPowerCord("karl_fischer", -7.2, BENCH_Y + 0.12, -4.35, -8.0, 1.05, -4.5);

    // 5. Agilent 708-DS USP Dissolution Tester Station (Pharma QC Island X = -4.0, Z = -4.15)
    // USP Reference Tablets Blister Pack
    this._createTabletBlisterPack(-4.7, -4.0);
    // Cannulas with Syringe Filters Rack
    this._createCannulaFilterRack(-4.7, -4.3);
    // 1000 mL Dissolution Media Buffer Flask
    this._createVolumetricFlask(-3.3, -4.0, "1000 mL", this.materials.reagentFluidClear);
    // Digital PT100 Immersion Thermometer
    this._createDigitalThermometer(-3.3, -4.3);
    // Heavy Power Cord
    this._createEquipmentPowerCord("dissolution_tester", -4.0, BENCH_Y + 0.22, -4.45, -4.0, 1.05, -4.5);

    // 6. ERWEKA ZT 322 Tablet Disintegration Tester Station (Pharma QC Island X = -2.0, Z = -4.15)
    // Disintegration Baskets with Wire Mesh Screens
    this._createDisintegrationBaskets(-2.6, -4.0);
    // Acrylic Disintegration Fluted Guide Disks
    this._createDisintegrationDisks(-2.6, -4.3);
    // Digital Stopwatch / Chronometer
    this._createDigitalStopwatch(-1.4, -4.0);
    // Tall Beakers in Bath
    this._createGriffinBeaker(-1.4, -4.3, "1000 mL", this.materials.reagentFluidClear, 0.7);
    // Power Cord
    this._createEquipmentPowerCord("disintegration_tester", -2.0, BENCH_Y + 0.15, -4.45, -2.0, 1.05, -4.5);

    // 7. Mettler Analytical Microbalance Station (Pharma QC Island X = 0.0, Z = -4.15)
    // Class E2 Stainless Steel Weights Wooden Box with Ivory Forceps
    this._createCalibrationWeightsBox(-0.6, -4.0);
    // Aluminum Fluted Weighing Boats Stack & Spatulas
    this._createWeighingBoatsStack(-0.6, -4.3);
    // Anti-Static Camel Hair Dusting Brush
    this._createAntiStaticBrush(0.55, -4.0);
    // Ground Glass Weighing Bottle
    this._createWeighingBottle(0.55, -4.3);
    // Power Cord
    this._createEquipmentPowerCord("balance", 0.0, BENCH_Y + 0.10, -4.45, 0.0, 1.05, -4.5);

    // 8. MICRO 5424-R Microcentrifuge Station (Sample Prep Island X = -2.2, Z = 4.65)
    // 24-Place Tube Rack loaded with 1.5mL and 2.0mL Eppendorf tubes
    this._createEppendorfRack(-2.8, 4.65, this.materials.ppBlueRack);
    // Fine-Point Indelible Lab Marker
    this._createLabMarker(-1.6, 4.55);
    // Colored Balance Counterweight Tubes
    this._createTestTubeRack(-1.6, 4.8, this.materials.ppOrangeRack);
    // Heavy Power Cord
    this._createEquipmentPowerCord("centrifuge", -2.2, BENCH_Y + 0.15, 4.9, -2.0, 1.05, 5.0);

    // 9. Labconco FreeZone 4.5L Freeze Dryer (Lyophilizer) Station (Sample Prep Island X = -0.5, Z = 4.65)
    // Borosilicate Freeze-Drying Flasks with Silicone Rubber Adapters
    this._createFreezeDryerFlask(-1.1, 4.65);
    // 20 mL Serum Vials with Gray Chlorobutyl Split Stoppers
    this._createSerumVialsTray(0.1, 4.65);
    // Handheld Vial Crimper Tool
    this._createVialCrimper(0.1, 4.85);
    // Heavy Power Cord
    this._createEquipmentPowerCord("freeze_dryer", -0.5, BENCH_Y + 0.22, 4.9, -0.5, 1.05, 5.0);

    // 10. Ultrasonic Cleaner Bath Station (Sample Prep Island X = 1.0, Z = 4.65)
    // Perforated Stainless Parts Basket
    this._createUltrasonicBasket(1.6, 4.6);
    // Squeeze Wash Bottle of Degassing Detergent
    this._createWashBottle(1.6, 4.85, "SONIC CLEAN", this.materials.screwCapYellow);
    // Power Cord
    this._createEquipmentPowerCord("ultrasonic_cleaner", 1.0, BENCH_Y + 0.12, 4.9, 1.0, 1.05, 5.0);

    // 11. Digital Vortex Mixer Station (Sample Prep Island X = 2.0, Z = 4.65)
    // 12-Tube Foam Insert Rack with Colored Solution Tubes (securely on bench surface)
    this._createVortexFoamRack(2.2, 4.65);
    // Power Cord
    this._createEquipmentPowerCord("vortex_mixer", 2.0, BENCH_Y + 0.08, 4.9, 2.0, 1.05, 5.0);

    // 12. Buchi Rotovap R-300 & V-300 Vacuum Pump Station in Fume Hood 1 (X = -13.5, Z = 8.05)
    // Keck Ground Glass Joint Clips (Green 24/40 and Yellow 14/20)
    this._createKeckClipsSet(-13.0, 8.0);
    // Molded Natural Cork Receiving Flask Support Ring
    this._createCorkFlaskRing(-13.0, 8.25);
    // Vacuum Grease Syringe
    this._createVacuumGreaseSyringe(-13.9, 7.95);
    // Vacuum Hose linking Rotovap to V-300 Pump
    this._createVacuumHoseInterconnect(-13.3, BENCH_Y + 0.40, 8.1, -12.8, BENCH_Y + 0.25, 8.05);

    // 13. Digital Ceramic Hotplate Stirrer Station in Fume Hood 2 (X = -9.8, Z = 8.05)
    // PT1000 Temperature Probe on Bosshead Clamp Stand
    this._createHotplateClampStand(-9.4, 8.05);
    // Magnetic Stir Bar Acrylic Storage Box with assorted stir bars
    this._createMagneticStirBarBox(-10.2, 7.95);
    // Magnetic Stir Bar Retriever Wand
    this._createStirBarRetriever(-10.2, 8.25);

    // 14. Parr 4560 High-Pressure Reactor Station in Fume Hood 2 (X = -9.1, Z = 8.05)
    // Braided Stainless Flexible Pigtail Hose to Gas Supply
    this._createBraidedPigtailHose(-9.1, BENCH_Y + 0.35, 8.05, -8.6, BENCH_Y + 0.55, 8.3);
    // Calibrated Click-Type Torque Wrench for Head Bolts
    this._createTorqueWrench(-8.7, 7.95);

    // 15. High-Temperature Muffle Furnace Station (Perimeter Bench X = -11.8, Z = -8.25)
    // High-Purity Alumina Ceramic Crucibles with Lids
    this._createCeramicCrucibles(-12.35, -8.15);
    // Heavy 24-inch Stainless Steel Crucible Tongs
    this._createCrucibleTongs(-12.35, -8.35);
    // Aluminized Kevlar Heat-Resistant Furnace Gloves (seated on bench surface)
    this._createFurnaceGloves(-12.55, -8.20);
    // Power Cord
    this._createEquipmentPowerCord("muffle_furnace", -11.8, BENCH_Y + 0.18, -8.45, -11.8, 1.05, -8.65);

    // 16. MBraun Inert Atmosphere Glove Box Station (Zone 4 X = 5.5, Z = -4.5)
    // Dual High-Pressure Argon / Nitrogen Gas Cylinders with Wall Safety Chains
    this._createGasCylinderBank(6.5, -4.5);

    // 17. Benchtop Dual pH / mV Meter Station (Perimeter Bench X = -8.2, Z = -8.25)
    // NIST Calibration Buffer Solutions (pH 4.00 Red, pH 7.00 Yellow, pH 10.01 Blue)
    this._createPHBufferSet(-7.6, -8.15);
    // Electrode Storage Beaker with 3M KCl
    this._createGriffinBeaker(-7.6, -8.35, "50 mL", this.materials.reagentFluidClear, 0.6);
    // DI Water Wash Bottle & Kimwipes Box
    this._createWashBottle(-8.8, -8.15, "DI WATER", this.materials.screwCapBlue);
    this._createKimwipesBox(-8.8, -8.35, 0);
    // Power Cord
    this._createEquipmentPowerCord("ph_meter", -8.2, BENCH_Y + 0.08, -8.45, -8.2, 1.05, -8.65);

    // 18. Zeiss Gemini FE-SEM Station & Specimen Prep Suite (Zone 4)
    // Specimen Stub Box resting directly on SEM structural console desk (Y = 0.82m)
    this._createSEMStubBox(4.55, -1.6, 0.82);
    // Carbon Conductive Adhesive Tape & Colloidal Silver Paint on console desk
    this._createCarbonTapeAndSilverPaint(4.55, -1.85, 0.82);
    // Titanium Precision Tweezers on console desk
    this._createPrecisionTweezers(4.55, -2.05, 0.821);
    // Gold/Palladium Sputter Coater Chamber on dedicated microscopy specimen prep bench (Y = 0.90m)
    this._createSputterCoaterChamber(5.5, -3.1);
  }

  // --- PC Workstation for Analytical Instruments ---
  _createAnalyticalPCWorkstation(cx, cz, rotY = 0, screenType = "twin-dashboard") {
    const pcGroup = new THREE.Group();
    pcGroup.position.set(cx, 0.90, cz);
    pcGroup.rotation.y = rotY;
    pcGroup.name = "Analytical_PC_Workstation";

    // 27" Thin-Bezel Workstation Monitor
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.008, 0.16),
      this.materials.cabinetHandle
    );
    stand.position.set(0, 0.004, -0.05);
    pcGroup.add(stand);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.28, 12),
      this.materials.cabinetHandle
    );
    post.position.set(0, 0.14, -0.07);
    pcGroup.add(post);

    const monFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.60, 0.36, 0.02),
      this.materials.screenBezelMetal
    );
    monFrame.position.set(0, 0.26, -0.03);
    pcGroup.add(monFrame);

    // High-DPI Canvas Screen Texture
    const screenFace = new THREE.Mesh(
      new THREE.PlaneGeometry(0.58, 0.34),
      new THREE.MeshBasicMaterial({ color: 0x0f172a })
    );
    screenFace.position.set(0, 0.26, -0.019);
    pcGroup.add(screenFace);

    // Full-Size Slim Keyboard with Chiclet Keys
    const kbd = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.012, 0.14),
      this.materials.screenBezelMetal
    );
    kbd.position.set(0, 0.006, 0.12);
    pcGroup.add(kbd);

    // Laser Optical Mouse on Textured Neoprene Mousepad
    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(0.20, 0.002, 0.18),
      this.materials.leatherBlack
    );
    pad.position.set(0.28, 0.001, 0.12);
    pcGroup.add(pad);

    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.02, 0.10),
      this.materials.screenBezelMetal
    );
    mouse.position.set(0.28, 0.01, 0.12);
    pcGroup.add(mouse);

    // Small Form Factor (SFF) Laboratory Desktop PC Tower
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.32, 0.32),
      this.materials.pcTowerSteel
    );
    tower.position.set(-0.35, 0.16, -0.05);
    pcGroup.add(tower);

    // Power LED & Front USB Ports on PC Tower
    const pwrLED = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.003, 0.004, 8),
      this.materials.telDigitalGreen
    );
    pwrLED.rotation.x = Math.PI / 2;
    pwrLED.position.set(-0.35, 0.28, 0.111);
    pcGroup.add(pwrLED);

    this.root.add(pcGroup);
  }

  // --- Iconic Green/White Kimwipes EX-L Pop-Up Box ---
  _createKimwipesBox(cx, cz, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.rotation.y = rotY;
    group.name = "Kimwipes_Box";

    const boxW = 0.12;
    const boxH = 0.07;
    const boxD = 0.12;

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(boxW, boxH, boxD),
      this.materials.kimwipesGreen
    );
    box.position.y = boxH / 2;
    group.add(box);

    // White pop-up tissue opening
    const tissue = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 0.025, 0.02),
      this.materials.kimwipesWhite
    );
    tissue.position.set(0, boxH + 0.01, 0);
    tissue.rotation.y = 0.3;
    group.add(tissue);

    this.root.add(group);
  }

  // --- Velvet-Lined Quartz Cuvette Case ---
  _createCuvetteBox(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Cuvette_Storage_Box";

    // Wooden velvet-lined box base
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, 0.035, 0.08),
      this.materials.weightWoodBox
    );
    box.position.y = 0.0175;
    group.add(box);

    const velvet = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.01, 0.07),
      this.materials.cuvetteVelvet
    );
    velvet.position.y = 0.032;
    group.add(velvet);

    // Two 10mm Pathlength Optical Quartz Cuvettes
    [-0.02, 0.02].forEach((qx) => {
      const cuvette = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, 0.045, 0.012),
        this.materials.cuvetteQuartz
      );
      cuvette.position.set(qx, 0.035, 0);
      group.add(cuvette);

      // White Teflon stopper cap
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(0.013, 0.008, 0.013),
        this.materials.kimwipesWhite
      );
      cap.position.set(qx, 0.06, 0);
      group.add(cap);
    });

    this.root.add(group);
  }

  // --- Polished Agate Mortar & Pestle ---
  _createAgateMortarPestle(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Agate_Mortar_Pestle";

    // Heavy hexagonal/round agate mortar bowl
    const mortar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.04, 0.045, 16),
      this.materials.agateStone
    );
    mortar.position.y = 0.0225;
    group.add(mortar);

    // Agate pestle resting angled inside bowl
    const pestle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.018, 0.09, 12),
      this.materials.agateStone
    );
    pestle.position.set(0.01, 0.04, 0.01);
    pestle.rotation.z = 0.45;
    pestle.rotation.x = 0.2;
    group.add(pestle);

    this.root.add(group);
  }

  // --- KBr Pellet Die Press Kit ---
  _createKBrPelletPress(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "KBr_Pellet_Die_Press";

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.038, 0.06, 16),
      this.materials.cabinetHandle
    );
    base.position.y = 0.03;
    group.add(base);

    const anvil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.04, 12),
      this.materials.weightChrome
    );
    anvil.position.y = 0.07;
    group.add(anvil);

    this.root.add(group);
  }

  // --- Hamilton 100 uL Precision Microsyringe ---
  _createMicrosyringe(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Hamilton_Microsyringe";

    // Glass barrel
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.12, 10),
      this.materials.glassPyrex
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0, 0.006, 0);
    group.add(barrel);

    // Stainless plunger with button
    const plunger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.002, 0.06, 8),
      this.materials.cabinetHandle
    );
    plunger.rotation.z = Math.PI / 2;
    plunger.position.set(-0.08, 0.006, 0);
    group.add(plunger);

    // Stainless needle (bevel tip)
    const needle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0008, 0.0008, 0.05, 6),
      this.materials.cabinetHandle
    );
    needle.rotation.z = Math.PI / 2;
    needle.position.set(0.085, 0.006, 0);
    group.add(needle);

    this.root.add(group);
  }

  // --- Karl Fischer Reagent Bottle with PTFE Tubing ---
  _createKarlFischerReagentBottle(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Hydranal_Reagent_Bottle";

    // Amber 1L Schott GL45 bottle
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.048, 0.18, 16),
      this.materials.amberGlass
    );
    bottle.position.y = 0.09;
    group.add(bottle);

    // GL45 Screw Cap with 2-port PTFE adapter
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.025, 16),
      this.materials.screwCapBlue
    );
    cap.position.y = 0.19;
    group.add(cap);

    // PTFE discharge tubing curving toward instrument
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.20, 0),
      new THREE.Vector3(0.08, 0.28, 0.05),
      new THREE.Vector3(0.22, 0.25, 0.08),
      new THREE.Vector3(0.38, 0.22, 0.10)
    ]);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 16, 0.004, 8, false),
      this.materials.reagentFluidClear
    );
    group.add(tube);

    this.root.add(group);
  }

  // --- Indicating Silica Gel Drying Tubes Tower ---
  _createDryingTubesTower(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Drying_Tubes_Tower";

    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.16, 12),
      this.materials.glassPyrex
    );
    tube.position.y = 0.08;
    group.add(tube);

    // Orange silica gel beads
    const beads = new THREE.Mesh(
      new THREE.CylinderGeometry(0.013, 0.013, 0.13, 12),
      this.materials.silicaGelCobaltBlue
    );
    beads.position.y = 0.075;
    group.add(beads);

    this.root.add(group);
  }

  // --- USP Reference Tablet Blister Pack ---
  _createTabletBlisterPack(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "USP_Tablet_Blister_Pack";

    const foil = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.002, 0.08),
      this.materials.cabinetHandle
    );
    foil.position.y = 0.001;
    group.add(foil);

    // 6 Blister tablet bubbles
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        const bubble = new THREE.Mesh(
          new THREE.SphereGeometry(0.008, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2),
          this.materials.cuvetteQuartz
        );
        bubble.position.set(-0.035 + c * 0.035, 0.002, -0.02 + r * 0.04);
        group.add(bubble);
      }
    }

    this.root.add(group);
  }

  // --- Cannula Sampling Syringe Filters Rack ---
  _createCannulaFilterRack(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Cannula_Filter_Rack";

    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.08),
      this.materials.ppBlueRack
    );
    stand.position.y = 0.04;
    group.add(stand);

    // 6 stainless cannulas with yellow syringe filters
    for (let i = 0; i < 6; i++) {
      const px = -0.025 + (i % 3) * 0.025;
      const pz = -0.02 + Math.floor(i / 3) * 0.04;

      const filter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.005, 12),
        this.materials.screwCapYellow
      );
      filter.position.set(px, 0.085, pz);
      group.add(filter);

      const cannula = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0015, 0.0015, 0.12, 8),
        this.materials.cabinetHandle
      );
      cannula.position.set(px, 0.14, pz);
      group.add(cannula);
    }

    this.root.add(group);
  }

  // --- Digital Immersion Bath Thermometer ---
  _createDigitalThermometer(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Digital_Thermometer";

    const meter = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.09, 0.025),
      this.materials.screenBezelMetal
    );
    meter.position.y = 0.045;
    group.add(meter);

    const probe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.002, 0.18, 8),
      this.materials.cabinetHandle
    );
    probe.position.set(0.04, 0.08, 0);
    group.add(probe);

    this.root.add(group);
  }

  // --- Disintegration Baskets & Guide Disks ---
  _createDisintegrationBaskets(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Disintegration_Basket";

    const topPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.006, 16),
      this.materials.cabinetHandle
    );
    topPlate.position.y = 0.09;
    group.add(topPlate);

    const bottomPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.006, 16),
      this.materials.cabinetHandle
    );
    bottomPlate.position.y = 0.01;
    group.add(bottomPlate);

    for (let t = 0; t < 6; t++) {
      const angle = (t * Math.PI * 2) / 6;
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.009, 0.009, 0.075, 12),
        this.materials.glassPyrex
      );
      tube.position.set(Math.sin(angle) * 0.028, 0.05, Math.cos(angle) * 0.028);
      group.add(tube);
    }

    this.root.add(group);
  }

  _createDisintegrationDisks(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Disintegration_Disks_Tray";

    for (let d = 0; d < 6; d++) {
      const disk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.008, 12),
        this.materials.sashGlass
      );
      disk.position.set(-0.03 + (d % 3) * 0.03, 0.004, -0.02 + Math.floor(d / 3) * 0.03);
      group.add(disk);
    }
    this.root.add(group);
  }

  // --- Digital Laboratory Stopwatch ---
  _createDigitalStopwatch(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Laboratory_Stopwatch";

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.035, 0.018, 16),
      this.materials.screenBezelMetal
    );
    body.position.y = 0.009;
    group.add(body);

    const lcd = new THREE.Mesh(
      new THREE.PlaneGeometry(0.035, 0.02),
      this.materials.telDigitalGreen
    );
    lcd.rotation.x = -Math.PI / 2;
    lcd.position.y = 0.0185;
    group.add(lcd);

    this.root.add(group);
  }

  // --- Class E2 Calibration Weights Mahogany Box with Forceps ---
  _createCalibrationWeightsBox(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Class_E2_Weights_Box";

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.045, 0.09),
      this.materials.weightWoodBox
    );
    box.position.y = 0.0225;
    group.add(box);

    const velvet = new THREE.Mesh(
      new THREE.BoxGeometry(0.125, 0.01, 0.075),
      this.materials.cuvetteVelvet
    );
    velvet.position.y = 0.04;
    group.add(velvet);

    // Class E2 Stainless Steel Weights (Knob tops)
    const weightSizes = [0.014, 0.012, 0.010, 0.008, 0.006];
    weightSizes.forEach((rad, idx) => {
      const wt = new THREE.Mesh(
        new THREE.CylinderGeometry(rad, rad, rad * 2, 12),
        this.materials.weightChrome
      );
      wt.position.set(-0.045 + idx * 0.022, 0.04 + rad, 0.01);
      group.add(wt);

      const knob = new THREE.Mesh(
        new THREE.SphereGeometry(rad * 0.5, 8, 8),
        this.materials.weightChrome
      );
      knob.position.set(-0.045 + idx * 0.022, 0.04 + rad * 2 + rad * 0.3, 0.01);
      group.add(knob);
    });

    // Ivory-Tipped Non-Magnetic Forceps
    const forceps = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, 0.004, 0.012),
      this.materials.kimwipesWhite
    );
    forceps.position.set(0, 0.048, -0.025);
    group.add(forceps);

    this.root.add(group);
  }

  // --- Aluminum Weighing Boats Stack & Micro-Spatulas ---
  _createWeighingBoatsStack(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Weighing_Boats_Stack";

    // Hexagonal / trapezoid aluminum fluted dishes stack
    for (let b = 0; b < 6; b++) {
      const boat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.022, 0.008, 6),
        this.materials.cabinetHandle
      );
      boat.position.y = 0.004 + b * 0.003;
      group.add(boat);
    }

    // Stainless Dual-Ended Micro-Spatula
    const spatula = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.002, 0.008),
      this.materials.cabinetHandle
    );
    spatula.position.set(0, 0.002, 0.04);
    spatula.rotation.y = 0.2;
    group.add(spatula);

    this.root.add(group);
  }

  _createAntiStaticBrush(cx, cz) {
    const brush = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.12, 8),
      this.materials.weightWoodBox
    );
    brush.position.set(cx, 0.904, cz);
    brush.rotation.z = Math.PI / 2;
    brush.rotation.y = -0.3;
    this.root.add(brush);
  }

  _createWeighingBottle(cx, cz) {
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.045, 16),
      this.materials.glassPyrex
    );
    bottle.position.set(cx, 0.9225, cz);
    this.root.add(bottle);

    const stopper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.012, 0.015, 12),
      this.materials.glassPyrex
    );
    stopper.position.set(cx, 0.95, cz);
    this.root.add(stopper);
  }

  // --- 24-Place Polypropylene Eppendorf Tube Rack ---
  _createEppendorfRack(cx, cz, rackMat) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Eppendorf_Tube_Rack";

    const rackW = 0.18;
    const rackH = 0.04;
    const rackD = 0.09;

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(rackW, rackH, rackD),
      rackMat
    );
    body.position.y = rackH / 2;
    group.add(body);

    // 24 microcentrifuge tubes (4 rows x 6 cols)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        const tx = -rackW / 2 + 0.02 + c * 0.02;
        const tz = -rackD / 2 + 0.022 + r * 0.022;

        const tube = new THREE.Mesh(
          new THREE.CylinderGeometry(0.005, 0.002, 0.038, 10),
          this.materials.reagentFluidClear
        );
        tube.position.set(tx, rackH + 0.012, tz);
        group.add(tube);

        // Snap cap
        const cap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.006, 0.006, 0.004, 10),
          rackMat
        );
        cap.position.set(tx, rackH + 0.032, tz);
        group.add(cap);
      }
    }

    this.root.add(group);
  }

  _createLabMarker(cx, cz) {
    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.13, 10),
      this.materials.leatherBlack
    );
    marker.position.set(cx, 0.906, cz);
    marker.rotation.z = Math.PI / 2;
    marker.rotation.y = 0.4;
    this.root.add(marker);
  }

  // --- Freeze Dryer Accessories ---
  _createFreezeDryerFlask(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Fast_Freeze_Flask";

    const flask = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.14, 16),
      this.materials.glassPyrex
    );
    flask.position.y = 0.07;
    group.add(flask);

    const rubberTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.048, 0.03, 16),
      this.materials.powerCordRubber
    );
    rubberTop.position.y = 0.155;
    group.add(rubberTop);

    const valve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.04, 8),
      this.materials.cabinetHandle
    );
    valve.position.set(0.03, 0.16, 0);
    group.add(valve);

    this.root.add(group);
  }

  _createSerumVialsTray(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Serum_Vials_Tray";

    for (let i = 0; i < 6; i++) {
      const vx = -0.03 + (i % 3) * 0.03;
      const vz = -0.015 + Math.floor(i / 3) * 0.03;

      const vial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.045, 12),
        this.materials.glassPyrex
      );
      vial.position.set(vx, 0.0225, vz);
      group.add(vial);

      const stopper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.009, 0.009, 0.008, 10),
        this.materials.powerCordRubber
      );
      stopper.position.set(vx, 0.048, vz);
      group.add(stopper);

      const crimp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.011, 0.011, 0.006, 10),
        this.materials.cabinetHandle
      );
      crimp.position.set(vx, 0.052, vz);
      group.add(crimp);
    }
    this.root.add(group);
  }

  _createVialCrimper(cx, cz) {
    const crimper = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.035, 0.05),
      this.materials.cabinetHandle
    );
    crimper.position.set(cx, 0.915, cz);
    crimper.rotation.y = -0.3;
    this.root.add(crimper);
  }

  // --- Ultrasonic & Vortex Accessories ---
  _createUltrasonicBasket(cx, cz) {
    const basket = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.08, 0.12),
      this.materials.cabinetHandle
    );
    basket.position.set(cx, 0.94, cz);
    this.root.add(basket);
  }

  _createVortexFoamRack(cx, cz) {
    const rack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.05, 16),
      this.materials.leatherBlack
    );
    rack.position.set(cx, 0.925, cz);
    this.root.add(rack);
  }

  // --- Rotovap & Fume Hood Accessories ---
  _createKeckClipsSet(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    [-0.02, 0.02].forEach((kx, idx) => {
      const clip = new THREE.Mesh(
        new THREE.TorusGeometry(0.014, 0.004, 8, 16),
        idx === 0 ? this.materials.screwCapGreen : this.materials.screwCapYellow
      );
      clip.rotation.x = Math.PI / 2;
      clip.position.set(kx, 0.005, 0);
      group.add(clip);
    });
    this.root.add(group);
  }

  _createCorkFlaskRing(cx, cz) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.045, 0.014, 10, 20),
      this.materials.weightWoodBox
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(cx, 0.914, cz);
    this.root.add(ring);
  }

  _createVacuumGreaseSyringe(cx, cz) {
    const syringe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.10, 10),
      this.materials.kimwipesWhite
    );
    syringe.position.set(cx, 0.908, cz);
    syringe.rotation.z = Math.PI / 2;
    syringe.rotation.y = 0.5;
    this.root.add(syringe);
  }

  _createVacuumHoseInterconnect(x1, y1, z1, x2, y2, z2) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3((x1 + x2) / 2, Math.min(y1, y2) - 0.08, (z1 + z2) / 2),
      new THREE.Vector3(x2, y2, z2)
    ]);
    const hose = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 20, 0.012, 10, false),
      this.materials.powerCordRubber
    );
    this.root.add(hose);
  }

  // --- Hotplate & Reactor Accessories ---
  _createHotplateClampStand(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.015, 0.16),
      this.materials.screenBezelMetal
    );
    base.position.y = 0.0075;
    group.add(base);

    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.45, 10),
      this.materials.cabinetHandle
    );
    rod.position.set(0, 0.225, -0.05);
    group.add(rod);

    const clamp = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.02, 0.12),
      this.materials.cabinetHandle
    );
    clamp.position.set(0, 0.28, 0);
    group.add(clamp);

    const probe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.002, 0.20, 8),
      this.materials.cabinetHandle
    );
    probe.position.set(0, 0.22, 0.05);
    group.add(probe);

    this.root.add(group);
  }

  _createMagneticStirBarBox(cx, cz) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.025, 0.06),
      this.materials.sashGlass
    );
    box.position.set(cx, 0.9125, cz);
    this.root.add(box);
  }

  _createStirBarRetriever(cx, cz) {
    const wand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.30, 8),
      this.materials.kimwipesWhite
    );
    wand.position.set(cx, 0.904, cz);
    wand.rotation.z = Math.PI / 2;
    wand.rotation.y = -0.4;
    this.root.add(wand);
  }

  _createBraidedPigtailHose(x1, y1, z1, x2, y2, z2) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3((x1 + x2) / 2, Math.max(y1, y2) + 0.12, (z1 + z2) / 2),
      new THREE.Vector3(x2, y2, z2)
    ]);
    const hose = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 20, 0.009, 10, false),
      this.materials.cabinetHandle
    );
    this.root.add(hose);
  }

  _createTorqueWrench(cx, cz) {
    const wrench = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.28, 10),
      this.materials.torqueWrenchChrome
    );
    wrench.position.set(cx, 0.908, cz);
    wrench.rotation.z = Math.PI / 2;
    wrench.rotation.y = 0.2;
    this.root.add(wrench);
  }

  // --- Muffle Furnace Accessories ---
  _createCeramicCrucibles(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);

    [-0.03, 0.03].forEach((cxPos) => {
      const crucible = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.015, 0.035, 14),
        this.materials.kimwipesWhite
      );
      crucible.position.set(cxPos, 0.0175, 0);
      group.add(crucible);

      const lid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, 0.006, 14),
        this.materials.kimwipesWhite
      );
      lid.position.set(cxPos, 0.038, 0);
      group.add(lid);
    });

    this.root.add(group);
  }

  _createCrucibleTongs(cx, cz) {
    const tongs = new THREE.Mesh(
      new THREE.BoxGeometry(0.40, 0.012, 0.04),
      this.materials.cabinetHandle
    );
    tongs.position.set(cx, 0.906, cz);
    tongs.rotation.y = -0.2;
    this.root.add(tongs);
  }

  _createFurnaceGloves(cx, cz) {
    const gloves = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.04, 0.12),
      this.materials.cabinetHandle
    );
    gloves.position.set(cx, 0.92, cz);
    this.root.add(gloves);
  }

  // --- Glove Box Gas Cylinders ---
  _createGasCylinderBank(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0, cz);

    [-0.22, 0.22].forEach((gx) => {
      // 50L High Pressure Gas Cylinder
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 1.45, 20),
        this.materials.fumeHoodSteel
      );
      cyl.position.set(gx, 0.725, 0);
      group.add(cyl);

      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2),
        this.materials.fumeHoodSteel
      );
      dome.position.set(gx, 1.45, 0);
      group.add(dome);

      // Dual-Stage Stainless Regulator & Gauges
      const reg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.08, 12),
        this.materials.cabinetHandle
      );
      reg.position.set(gx, 1.60, 0);
      group.add(reg);

      [-0.025, 0.025].forEach((gxOff) => {
        const gauge = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.022, 0.015, 14),
          this.materials.kimwipesWhite
        );
        gauge.rotation.x = Math.PI / 2;
        gauge.position.set(gx + gxOff, 1.62, 0.025);
        group.add(gauge);
      });
    });

    // Safety Wall Bracket with Chain
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.04, 0.08),
      this.materials.cabinetBody
    );
    bracket.position.set(0, 1.05, 0.12);
    group.add(bracket);

    this.root.add(group);
  }

  _createAntechamberTray(cx, cz) {
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.02, 0.22),
      this.materials.cabinetHandle
    );
    tray.position.set(cx, 0.91, cz);
    this.root.add(tray);
  }

  // --- pH Buffer Calibration Set ---
  _createPHBufferSet(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);

    const buffers = [
      { color: 0xdc2626, label: "pH 4.00" },
      { color: 0xeab308, label: "pH 7.00" },
      { color: 0x2563eb, label: "pH 10.01" }
    ];

    buffers.forEach((b, idx) => {
      const bottle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.075, 14),
        new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.4 })
      );
      bottle.position.set(-0.06 + idx * 0.06, 0.0375, 0);
      group.add(bottle);

      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.015, 12),
        this.materials.kimwipesWhite
      );
      cap.position.set(-0.06 + idx * 0.06, 0.0825, 0);
      group.add(cap);
    });

    this.root.add(group);
  }

  // --- SEM Stub Box & Preparation Accessories ---
  _createSEMStubBox(cx, cz, cy = 0.90) {
    const group = new THREE.Group();
    group.position.set(cx, cy, cz);
    group.name = "SEM_Stub_Box";

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.025, 0.09),
      this.materials.weightWoodBox
    );
    box.position.y = 0.0125;
    group.add(box);

    // 6 Aluminum 12.7mm Pin Stubs
    for (let s = 0; s < 6; s++) {
      const sx = -0.035 + (s % 3) * 0.035;
      const sz = -0.02 + Math.floor(s / 3) * 0.04;

      const stub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.012, 12),
        this.materials.semStubAluminum
      );
      stub.position.set(sx, 0.028, sz);
      group.add(stub);
    }
    this.root.add(group);
  }

  _createCarbonTapeAndSilverPaint(cx, cz, cy = 0.90) {
    const group = new THREE.Group();
    group.position.set(cx, cy, cz);

    // Carbon tape roll
    const tape = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.018, 16),
      this.materials.leatherBlack
    );
    tape.position.set(-0.03, 0.009, 0);
    group.add(tape);

    // Colloidal silver paint vial
    const vial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.045, 12),
      this.materials.semStubAluminum
    );
    vial.position.set(0.03, 0.0225, 0);
    group.add(vial);

    this.root.add(group);
  }

  _createPrecisionTweezers(cx, cz, cy = 0.901) {
    const tweezers = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.002, 0.006),
      this.materials.cabinetHandle
    );
    tweezers.position.set(cx, cy, cz);
    tweezers.rotation.y = 0.35;
    this.root.add(tweezers);
  }

  _createSputterCoaterChamber(cx, cz) {
    const group = new THREE.Group();
    group.position.set(cx, 0.90, cz);
    group.name = "Sputter_Coater";

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.15, 0.12, 20),
      this.materials.screenBezelMetal
    );
    base.position.y = 0.06;
    group.add(base);

    const glassJar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.10, 0.14, 16),
      this.materials.glassPyrex
    );
    glassJar.position.y = 0.19;
    group.add(glassJar);

    const topHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16),
      this.materials.cabinetHandle
    );
    topHead.position.y = 0.28;
    group.add(topHead);

    this.root.add(group);
  }

  // --- Genuine Physical Equipment Power Cord & NEMA 5-15P Plug Continuity ---
  _createEquipmentPowerCord(machineId, startX, startY, startZ, outletX, outletY, outletZ) {
    const cordGroup = new THREE.Group();
    cordGroup.name = `Power_Cord_${machineId}`;

    // Natural catenary drape curve from instrument IEC socket to benchtop outlet
    const midX = (startX + outletX) / 2;
    const midY = Math.min(startY, outletY) - 0.04;
    const midZ = (startZ + outletZ) / 2;

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(startX, startY, startZ),
      new THREE.Vector3(startX, startY - 0.06, startZ + (outletZ > startZ ? 0.08 : -0.08)),
      new THREE.Vector3(midX, midY, midZ),
      new THREE.Vector3(outletX, outletY - 0.04, outletZ + (outletZ > startZ ? -0.06 : 0.06)),
      new THREE.Vector3(outletX, outletY, outletZ)
    ]);

    const cord = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 20, 0.007, 8, false),
      this.materials.powerCordRubber
    );
    cordGroup.add(cord);

    // Molded NEMA 5-15P Plug inserted firmly into the duplex receptacle
    const plug = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.038, 0.035),
      this.materials.nemaPlugMolded
    );
    plug.position.set(outletX, outletY, outletZ);
    cordGroup.add(plug);

    // Brass Ground & Power Blades
    [-0.006, 0.006].forEach((px) => {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.002, 0.012, 0.014),
        this.materials.nemaBrassPin
      );
      blade.position.set(outletX + px, outletY, outletZ - 0.018);
      cordGroup.add(blade);
    });

    this.root.add(cordGroup);
  }

  // --- Communication & Data Cable (RS-232 / Cat6 / USB) ---
  _createCommunicationCable(startX, startY, startZ, endX, endY, endZ, cableType = "serial") {
    const cableMat = cableType === "cat6" ? this.materials.cat6Blue : this.materials.serialBeige;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(startX, startY, startZ),
      new THREE.Vector3((startX + endX) / 2, Math.min(startY, endY) - 0.03, (startZ + endZ) / 2),
      new THREE.Vector3(endX, endY, endZ)
    ]);

    const cable = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 18, 0.0045, 8, false),
      cableMat
    );
    this.root.add(cable);
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
