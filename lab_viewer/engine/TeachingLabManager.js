/**
 * TeachingLabManager.js — ChemMate Interactive 3D Teaching Lab & Curated Bench Engine
 *
 * Implements:
 * 1. Curated Lesson Benches inside the Teaching Lab Alcoves (mounting only the required
 *    3D machine twins, procedural DIN/ISO borosilicate glassware, mini brushed-aluminum
 *    magnetic stirrer-hotplate with tactile rotary knobs, and chemical reagents).
 * 2. Zero Legacy 2D Twin UIs: Students interact directly with the 3D machines in the scene.
 * 3. Swiss Crimson 3D Beacon Ring + Emissive Control Pulse + Projected 2D SVG Leader-Line
 *    Callout Overlay (`#cm-leader-callout`) anchored to real-time 3D control bounding centers.
 * 4. Synchronized Gemini 3.8 Flash TTS Voice Guidance & Live BLE Telemetry to the iPhone Companion.
 * 5. Full Non-Destructive Preservation: Exiting lesson mode returns cleanly to the 18-machine
 *    Grand Lab Complex without polluting free-explore raycasting or camera navigation.
 */
import * as THREE from "three";
import { labAudio } from "./LabSFXMixer.js";
import { TIER1_CURRICULUM_MANIFEST } from "./PhoneCompanionController.js";

export const POC_LESSONS = {
  T1L1: {
    id: "T1L1",
    title: "T1L1 · Chemistry in Context: CuSO₄·5H₂O Dissolution & Recrystallization",
    roomName: "CR-01 · Active Matter Teaching Studio (Zone 1)",
    machines: ["balance", "hotplate"],
    primaryMachine: "balance",
    benchCam: { pos: new THREE.Vector3(-0.32, 1.32, -3.02), look: new THREE.Vector3(-0.26, 1.01, -4.08) },
    verificationQuestion: {
      prompt: "Verify moles of 5.0012 g CuSO₄·5H₂O (MW = 249.68 g/mol):",
      expected: "0.0200",
      unit: "mol",
      verified: false
    },
    plotData: {
      title: "CuSO₄·5H₂O Endothermic Dissolution & Heating (°C vs s)",
      xLabel: "Time (s)",
      yLabel: "Temp (°C)",
      points: [
        { x: 0, y: 21.0 },
        { x: 30, y: 19.8 },
        { x: 60, y: 19.2 },
        { x: 120, y: 52.0 },
        { x: 180, y: 85.0 }
      ]
    },
    steps: [
      {
        title: "Step 1 · Verify Electrical Continuity & Power Balance",
        instruction: "Click the glowing Balance Terminal (UI_LCD / Power_Switch) on the Analytical Microbalance to initialize the EMFR weighing cell.",
        ttsText: "Welcome to ChemMate Lab 1.1: Chemistry in Context. Notice the highlighted touchscreen terminal on the analytical balance. Click it directly in 3D to energize the weighing station.",
        audioStemUrl: "./assets/audio/t1l1_intro.mp3",
        targetMeshName: "UI_LCD",
        targetAliases: ["UI_LCD", "Power_Switch", "Sensor_Bar"],
        targetMachineId: "balance",
        targetMachineName: "Analytical Microbalance (0.1 mg)",
        beaconOffset: new THREE.Vector3(0.0, 1.04, -3.92),
        liquidColor: 0xdbeafe,
        liquidOpacity: 0.32,
        crystalScale: 1.0,
        telemetry: {
          primaryLabel: "BALANCE MASS",
          primaryVal: "0.0000 g",
          secondaryLabel: "SOLUTION TEMP",
          secondaryVal: "21.0 °C",
          tertiaryLabel: "DRAFT SHIELD",
          tertiaryVal: "CLOSED · ZEROED",
          status: "BLE 5.2 LINKED"
        },
        observation: "✓ [Step 1] Analytical Balance energized; internal EMFR zero calibration verified (0.0000 g)."
      },
      {
        title: "Step 2 · Tare Weighing Boat & Weigh 5.0012 g CuSO₄·5H₂O",
        instruction: "Click the glowing SmartSensor Tare Bar (Sensor_Bar) on the balance console to zero the boat and weigh out 5.0012 g of blue copper(II) sulfate pentahydrate crystals.",
        ttsText: "Place the weighing boat onto the balance pan and trigger the glowing SmartSensor Tare bar. We have measured 5.0012 grams of triclinic blue copper two sulfate pentahydrate. The reading is automatically streamed to your iPhone.",
        audioStemUrl: "../centrifuge_twin/docs/audio/vo_1.mp3",
        targetMeshName: "Sensor_Bar",
        targetAliases: ["Sensor_Bar", "UI_LCD", "Weighing_Pan"],
        targetMachineId: "balance",
        targetMachineName: "Analytical Microbalance (0.1 mg)",
        beaconOffset: new THREE.Vector3(0.0, 1.01, -3.98),
        liquidColor: 0x93c5fd,
        liquidOpacity: 0.42,
        crystalScale: 0.85,
        telemetry: {
          primaryLabel: "BALANCE MASS",
          primaryVal: "5.0012 g",
          secondaryLabel: "MOLES CuSO₄·5H₂O",
          secondaryVal: "0.0200 mol",
          tertiaryLabel: "STABILITY",
          tertiaryVal: "±0.0001 g OK",
          status: "BLE DATA LOGGED"
        },
        observation: "✓ [Step 2] Mass recorded via BLE: 5.0012 g CuSO₄·5H₂O (0.0200 mol)."
      },
      {
        title: "Step 3 · Dissolve in 100 mL Pyrex Beaker & Engage Magnetic Stirrer",
        instruction: "Click the glowing Stirrer Rotary Knob (Knob_Stir) on the mini magnetic stir plate under the 100 mL Pyrex Beaker to engage 400 RPM mixing and observe the endothermic ΔT drop to 19.2 °C.",
        ttsText: "Transfer the blue vitriol crystals into the 100 milliliter Pyrex beaker on the curated stir plate and click the glowing stirrer knob. Watch the solution shift to deep royal blue as hexaaquacopper two ions form, absorbing heat from the water.",
        audioStemUrl: "../centrifuge_twin/docs/audio/vo_2.mp3",
        targetMeshName: "Knob_Stir",
        targetAliases: ["Knob_Stir"],
        targetMachineId: "balance",
        targetMachineName: "Curated Stir Plate & 100 mL Beaker",
        beaconOffset: new THREE.Vector3(-0.42, 0.93, -3.89),
        liquidColor: 0x0284c7,
        liquidOpacity: 0.78,
        crystalScale: 0.15,
        telemetry: {
          primaryLabel: "MOLARITY [Cu²⁺]",
          primaryVal: "0.400 M",
          secondaryLabel: "PT1000 TEMP",
          secondaryVal: "19.2 °C (ΔT -1.8°C)",
          tertiaryLabel: "MAGNETIC STIR",
          tertiaryVal: "400 RPM VORTEX",
          status: "ENDOTHERMIC SHIFT"
        },
        observation: "✓ [Step 3] Solution turned Royal Blue ([Cu(H₂O)₆]²⁺); endothermic ΔT = -1.8 °C recorded."
      },
      {
        title: "Step 4 · Thermal Concentration & Lattice Recrystallization",
        instruction: "Click the glowing Heater Rotary Knob (Knob_Temp) on the stir plate front bevel to heat the solution to 85.0 °C, concentrate the liquor, and nucleate purified CuSO₄·5H₂O crystals.",
        ttsText: "Now click the glowing heater dial to warm the solution to 85 degrees Celsius. Upon cooling, pure triclinic copper sulfate pentahydrate crystals nucleate at the bottom of the beaker. Verify your stoichiometry on your iPhone to complete the lab!",
        audioStemUrl: "../centrifuge_twin/docs/audio/vo_6.mp3",
        targetMeshName: "Knob_Temp",
        targetAliases: ["Knob_Temp"],
        targetMachineId: "balance",
        targetMachineName: "Thermal Recrystallization Hotplate",
        beaconOffset: new THREE.Vector3(-0.34, 0.93, -3.89),
        liquidColor: 0x0369a1,
        liquidOpacity: 0.65,
        crystalScale: 1.15,
        telemetry: {
          primaryLabel: "RECOVERED MASS",
          primaryVal: "4.8210 g",
          secondaryLabel: "PLATE TEMP",
          secondaryVal: "85.0 °C → 20.0 °C",
          tertiaryLabel: "PERCENT YIELD",
          tertiaryVal: "96.4% PASS",
          status: "RUN COMPLETE"
        },
        observation: "✓ [Step 4] Recrystallized CuSO₄·5H₂O recovered: 4.8210 g (96.4% yield). Ready for verification!"
      }
    ]
  },

  T4L24: {
    id: "T4L24",
    title: "T4L24 · Spectrophotometric Kinetics: Crystal Violet + NaOH (590 nm)",
    roomName: "CR-04 · Quantitative Spectroscopy Alcove (Zone 1)",
    machines: ["spectrophotometer"],
    primaryMachine: "spectrophotometer",
    benchCam: { pos: new THREE.Vector3(-11.6, 1.30, -3.14), look: new THREE.Vector3(-11.6, 1.06, -4.15) },
    verificationQuestion: {
      prompt: "Enter Reaction Order w.r.t. [CV⁺] from linear ln(A) vs t fit (R² = 0.9982):",
      expected: "1",
      unit: "order",
      verified: false
    },
    plotData: {
      title: "Crystal Violet Absorbance Decay at 590 nm",
      xLabel: "Time (s)",
      yLabel: "Abs (590nm)",
      points: [
        { x: 0, y: 0.854 },
        { x: 30, y: 0.712 },
        { x: 60, y: 0.594 },
        { x: 90, y: 0.495 },
        { x: 120, y: 0.413 },
        { x: 150, y: 0.344 },
        { x: 180, y: 0.287 }
      ]
    },
    steps: [
      {
        title: "Step 1 · Blank Auto-Zero at λ = 590.0 nm",
        instruction: "Click the glowing Auto-Zero key (Btn_Zero) on the Shimadzu UV-2600i / UV-1900i Spectrophotometer with the DI water quartz cuvette loaded.",
        ttsText: "Welcome to the Quantitative Spectroscopy Kinetics Lab. Insert the 10 millimeter quartz reference cuvette and click the glowing Auto Zero button on the spectrophotometer console to lock 100 percent transmittance at 590 nanometers.",
        audioStemUrl: "../centrifuge_twin/docs/audio/vo_4.mp3",
        targetMeshName: "Btn_Zero",
        targetAliases: ["Btn_Zero", "UI_LCD", "Pivot_ChamberLid"],
        targetMachineId: "spectrophotometer",
        targetMachineName: "Shimadzu Dual-Beam UV-Vis Spectrophotometer",
        beaconOffset: new THREE.Vector3(-11.52, 1.06, -3.95),
        liquidColor: 0x7c3aed,
        liquidOpacity: 0.85,
        crystalScale: 0.0,
        telemetry: {
          primaryLabel: "ABSORBANCE (590nm)",
          primaryVal: "0.000 Abs",
          secondaryLabel: "TRANSMITTANCE",
          secondaryVal: "100.0 %T",
          tertiaryLabel: "MONOCHROMATOR",
          tertiaryVal: "λ = 590.0 nm",
          status: "BLANK ZEROED"
        },
        observation: "✓ [Step 1] Czerny-Turner monochromator locked at 590.0 nm; DI water blank zeroed (0.000 Abs)."
      },
      {
        title: "Step 2 · Mix Crystal Violet + 0.10 M NaOH & Start Time-Drive Scan",
        instruction: "Click the glowing Scan / Start key (Btn_Scan / Btn_Start) on the UV-Vis Spectrophotometer to record absorbance decay from t = 0 to 180 seconds.",
        ttsText: "Pipette 1.00 milliliter of 0.1 molar sodium hydroxide into the crystal violet cuvette and press the glowing Scan button. Watch the deep violet chromophore fade toward colorless carbinol as live absorbance data streams to your iPhone.",
        audioStemUrl: "../centrifuge_twin/docs/audio/vo_5.mp3",
        targetMeshName: "Btn_Scan",
        targetAliases: ["Btn_Start", "Btn_Scan", "Btn_Zero", "UI_LCD"],
        targetMachineId: "spectrophotometer",
        targetMachineName: "Shimadzu Dual-Beam UV-Vis Spectrophotometer",
        beaconOffset: new THREE.Vector3(-11.46, 1.06, -3.95),
        liquidColor: 0xc4b5fd,
        liquidOpacity: 0.30,
        crystalScale: 0.0,
        telemetry: {
          primaryLabel: "ABSORBANCE (180s)",
          primaryVal: "0.287 Abs",
          secondaryLabel: "RATE CONSTANT k'",
          secondaryVal: "0.00606 s⁻¹",
          tertiaryLabel: "LINEAR FIT ln(A)",
          tertiaryVal: "R² = 0.9982",
          status: "KINETICS COMPLETE"
        },
        observation: "✓ [Step 2] Time-drive scan complete (A₀ = 0.854 → A₁₈₀ = 0.287); ln(A) vs t R² = 0.9982."
      }
    ]
  },

  PHARMA_QC: {
    id: "PHARMA_QC",
    title: "USP <701> & <711> · ERWEKA ZT 322 Disintegration & Agilent 708-DS Dissolution",
    roomName: "Zone 1 · Pharmaceutical QC Teaching Suite",
    machines: ["disintegration_tester", "dissolution_tester"],
    primaryMachine: "disintegration_tester",
    benchCam: { pos: new THREE.Vector3(-2.0, 1.36, -3.12), look: new THREE.Vector3(-2.0, 1.12, -4.15) },
    verificationQuestion: {
      prompt: "Enter USP <701> Disintegration Time (in minutes, ≤ 15 min passes):",
      expected: "11.7",
      unit: "min",
      verified: false
    },
    plotData: {
      title: "USP Dissolution & Disintegration Profile (% Released vs min)",
      xLabel: "Time (min)",
      yLabel: "% Dissolved",
      points: [
        { x: 0, y: 0.0 },
        { x: 5, y: 34.9 },
        { x: 10, y: 59.7 },
        { x: 15, y: 75.8 },
        { x: 30, y: 85.4 }
      ]
    },
    steps: [
      {
        title: "Step 1 · Equilibrate Water Bath to 37.0 °C & Lower Basket Rack",
        instruction: "Click the glowing Temp / Lift key (Btn_Temp / Btn_Lift) on the ERWEKA ZT 322 Tablet Disintegration Tester to equilibrate the bath and lower the dual 6-tube baskets.",
        ttsText: "The Erweka ZT 322 Tablet Disintegration Tester recreates the physical environment of the human stomach at 37 degrees Celsius. Click the glowing control key on the front console to equilibrate the bath and lower the two 6-tube basket assemblies.",
        audioStemUrl: "../disintegration_tester_twin/docs/audio/vo_0.mp3",
        targetMeshName: "Btn_Temp",
        targetAliases: ["Btn_Temp", "Btn_Lift", "Btn_Start", "UI_LCD"],
        targetMachineId: "disintegration_tester",
        targetMachineName: "ERWEKA ZT 322 USP Disintegration Tester",
        beaconOffset: new THREE.Vector3(-2.0, 1.06, -3.95),
        liquidColor: 0xe0f2fe,
        liquidOpacity: 0.40,
        crystalScale: 0.5,
        telemetry: {
          primaryLabel: "BATH TEMP (PT100)",
          primaryVal: "37.0 ± 0.1 °C",
          secondaryLabel: "STROKE RATE",
          secondaryVal: "30 SPM (55 mm)",
          tertiaryLabel: "BASKET STATIONS",
          tertiaryVal: "2 × 6 TUBES",
          status: "USP <701> ACTIVE"
        },
        observation: "✓ [Step 1] Water bath stabilized at 37.0 °C; motorized lead screws lowered Baskets A & B."
      },
      {
        title: "Step 2 · Run 30 SPM Reciprocating Stroke & Record End-Point",
        instruction: "Click the glowing Start key (Btn_Start) on the ERWEKA ZT 322 to complete the disintegration run and transmit the GLP report to your iPhone.",
        ttsText: "Pressing start begins the 30 strokes per minute harmonic drive. As the tablets move through the warm fluid, the binder softens and washes through the #10 wire mesh screen at 11.7 minutes, passing USP criteria.",
        audioStemUrl: "../disintegration_tester_twin/docs/audio/vo_5.mp3",
        targetMeshName: "Btn_Start",
        targetAliases: ["Btn_Start", "Btn_Temp", "Btn_Lift", "UI_LCD"],
        targetMachineId: "disintegration_tester",
        targetMachineName: "ERWEKA ZT 322 USP Disintegration Tester",
        beaconOffset: new THREE.Vector3(-1.92, 1.06, -3.95),
        liquidColor: 0xbae6fd,
        liquidOpacity: 0.55,
        crystalScale: 0.0,
        telemetry: {
          primaryLabel: "DISINTEGRATION TIME",
          primaryVal: "11.7 min (PASS)",
          secondaryLabel: "708-DS MEAN Q%",
          secondaryVal: "85.4% (>=80%)",
          tertiaryLabel: "USP MONOGRAPH",
          tertiaryVal: "STAGE 1 PASS",
          status: "GLP REPORT SENT"
        },
        observation: "✓ [Step 2] All 12 tablets disintegrated completely at 11.7 min (≤ 15.0 min USP <701> PASS)."
      }
    ]
  }
};

export class TeachingLabManager {
  constructor(app) {
    this.app = app;
    this.scene = app.scene;
    this.camera = app.camera;
    this.dockManager = app.dockManager;
    this.player = app.player;

    this.activeLesson = null;
    this.currentStepIndex = 0;
    this.observations = [];
    this._lessonLaunchToken = 0;

    // Curated 3D Labware Group & Pulsing Swiss Crimson 3D Beacon Ring
    this.curatedBenchGroup = new THREE.Group();
    this.curatedBenchGroup.name = "Curated_Lesson_Labware_Group";
    this.scene.add(this.curatedBenchGroup);

    this.beaconGroup = new THREE.Group();
    this.beaconGroup.name = "Teaching_3D_Target_Beacon";
    this.beaconGroup.visible = false;
    this.scene.add(this.beaconGroup);

    this.interactiveTargets = [];
    this._stepInteractiveMeshes = [];
    this.pulsingMeshes = [];
    this._savedEmissives = new WeakMap();
    this._savedUserData = new WeakMap();
    this._activeTargetWorldPos = null;
    this._projVec = new THREE.Vector3();

    this._build3DTargetBeacon();
    this._buildCuratedBenchLabware();
  }

  _build3DTargetBeacon() {
    // Sleek Swiss Crimson (0xd61f1f) thin pulsing target ring + minimal precision chevron
    const ringGeo = new THREE.RingGeometry(0.018, 0.025, 36);
    ringGeo.rotateX(-Math.PI / 2);
    this.beaconRingMat = new THREE.MeshBasicMaterial({
      color: 0xd61f1f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
      depthWrite: false
    });
    this.beaconRing = new THREE.Mesh(ringGeo, this.beaconRingMat);
    this.beaconGroup.add(this.beaconRing);

    const outerRingGeo = new THREE.RingGeometry(0.029, 0.032, 36);
    outerRingGeo.rotateX(-Math.PI / 2);
    this.beaconOuterRingMat = new THREE.MeshBasicMaterial({
      color: 0xd61f1f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.42,
      depthWrite: false
    });
    this.beaconOuterRing = new THREE.Mesh(outerRingGeo, this.beaconOuterRingMat);
    this.beaconGroup.add(this.beaconOuterRing);

    const chevronGeo = new THREE.ConeGeometry(0.008, 0.020, 4);
    chevronGeo.rotateX(Math.PI);
    this.beaconCone = new THREE.Mesh(
      chevronGeo,
      new THREE.MeshBasicMaterial({ color: 0xd61f1f, transparent: true, opacity: 0.95 })
    );
    this.beaconCone.position.y = 0.032;
    this.beaconGroup.add(this.beaconCone);

    // Clickable invisible sphere on the beacon so clicking the indicator always actuates the 3D control
    const beaconHit = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 16, 16),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    beaconHit.position.y = 0.02;
    beaconHit.raycast = (raycaster, intersects) => {
      if (!this.beaconGroup.visible) return;
      THREE.Mesh.prototype.raycast.call(beaconHit, raycaster, intersects);
    };
    beaconHit.userData = {
      isTeachingTarget: true,
      isCuratedPermanentTarget: true,
      getLabel: () => {
        const step = this.getCurrentStep();
        return step ? `Click ${step.targetMeshName} · ${step.targetMachineName}` : "Actuate Control";
      },
      toggle: () => {
        if (this.activeLesson) this.performCurrentStepAction();
      }
    };
    this.beaconGroup.add(beaconHit);
    this.interactiveTargets.push(beaconHit);
  }

  _buildCuratedBenchLabware() {
    // Positioned cleanly on the Zone 1 Analytical Bench (Y = 0.90m, X = -0.38, Z = -3.96)
    this.curatedBenchGroup.position.set(-0.38, 0.90, -3.96);

    // =========================================================================
    // 1. Mini Brushed-Aluminum & Matte-Ceramic Magnetic Stirrer Hotplate
    //    Footprint: 150 mm W × 40 mm H × 165 mm D (0.150 × 0.040 × 0.165 m)
    // =========================================================================
    const hotplateGroup = new THREE.Group();
    hotplateGroup.name = "Magnetic_Stirrer_Hotplate";
    this.curatedBenchGroup.add(hotplateGroup);

    const matBrushedAlum = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.28,
      metalness: 0.84,
      name: "Mat_Hotplate_BrushedAlum"
    });
    const matDarkAnodized = new THREE.MeshStandardMaterial({
      color: 0x1e232a,
      roughness: 0.42,
      metalness: 0.45,
      name: "Mat_Hotplate_Anodized"
    });
    const matNeoprene = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.9,
      metalness: 0.05
    });
    const matCeramicTop = new THREE.MeshStandardMaterial({
      color: 0xf8f9fa,
      roughness: 0.18,
      metalness: 0.04,
      name: "Mat_Hotplate_Ceramic"
    });
    const matChromeHex = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.92
    });
    const matPointerPip = new THREE.MeshStandardMaterial({
      color: 0xfefefe,
      roughness: 0.25,
      metalness: 0.05
    });

    // 4 Neoprene leveling feet resting at Y = 0
    for (const fx of [-0.062, 0.062]) {
      for (const fz of [-0.068, 0.056]) {
        const foot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.007, 0.008, 0.004, 16),
          matNeoprene
        );
        foot.position.set(fx, 0.002, fz);
        hotplateGroup.add(foot);
      }
    }

    // Lower dark anodized skirt pan (y: 0.004 -> 0.012)
    const lowerSkirt = new THREE.Mesh(
      new THREE.BoxGeometry(0.146, 0.008, 0.144),
      matDarkAnodized
    );
    lowerSkirt.position.set(0, 0.008, -0.008);
    lowerSkirt.castShadow = true;
    lowerSkirt.receiveShadow = true;
    hotplateGroup.add(lowerSkirt);

    // Main brushed-aluminum chassis deck (y: 0.012 -> 0.032)
    const bodyDeck = new THREE.Mesh(
      new THREE.BoxGeometry(0.150, 0.020, 0.146),
      matBrushedAlum
    );
    bodyDeck.position.set(0, 0.022, -0.008);
    bodyDeck.castShadow = true;
    bodyDeck.receiveShadow = true;
    hotplateGroup.add(bodyDeck);

    // 4 Corner M3 stainless hex socket screws on the top brushed bezel
    for (const sx of [-0.066, 0.066]) {
      for (const sz of [-0.072, 0.054]) {
        const screw = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0022, 0.0022, 0.0018, 6),
          matChromeHex
        );
        screw.position.set(sx, 0.0328, sz);
        hotplateGroup.add(screw);
      }
    }

    // Top dark spill containment collar + white ceramic top plate (plateTopY = 0.040)
    const spillCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.064, 0.066, 0.004, 36),
      matDarkAnodized
    );
    spillCollar.position.set(0, 0.0335, -0.012);
    hotplateGroup.add(spillCollar);

    const ceramicPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.059, 0.060, 0.008, 40),
      matCeramicTop
    );
    ceramicPlate.name = "Plate_Ceramic";
    ceramicPlate.position.set(0, 0.036, -0.012);
    ceramicPlate.receiveShadow = true;
    hotplateGroup.add(ceramicPlate);

    // Subtle thermal surface glow overlay for Step 4 heating
    this.thermalGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff4518,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    const thermalGlowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.050, 36),
      this.thermalGlowMat
    );
    thermalGlowDisc.rotation.x = -Math.PI / 2;
    thermalGlowDisc.position.set(0, 0.0402, -0.012);
    hotplateGroup.add(thermalGlowDisc);

    // Sloped front control console bevel facing +Z (toward operator & camera)
    const bevelGroup = new THREE.Group();
    bevelGroup.name = "Hotplate_Front_Bevel";
    bevelGroup.position.set(0, 0.018, 0.068);
    bevelGroup.rotation.x = 0.92; // Local +Y tilts directly toward +Z/+Y operator view
    hotplateGroup.add(bevelGroup);

    const bevelPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.148, 0.006, 0.034),
      matBrushedAlum
    );
    bevelGroup.add(bevelPlate);

    const bevelInset = new THREE.Mesh(
      new THREE.BoxGeometry(0.136, 0.002, 0.026),
      matDarkAnodized
    );
    bevelInset.position.y = 0.0035;
    bevelGroup.add(bevelInset);

    // Center crimson status LED indicator bar between the two knobs
    this.hotplateLedMat = new THREE.MeshStandardMaterial({
      color: 0xd61f1f,
      emissive: 0xd61f1f,
      emissiveIntensity: 0.25,
      roughness: 0.25
    });
    const centerLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.003, 0.004),
      this.hotplateLedMat
    );
    centerLed.position.set(0, 0.0048, 0);
    bevelGroup.add(centerLed);

    const buildRotaryKnob = (knobName, xPos, labelText) => {
      const mount = new THREE.Group();
      mount.position.set(xPos, 0.005, 0);
      bevelGroup.add(mount);

      // Calibrated tick marks around knob perimeter
      for (let t = -3; t <= 3; t++) {
        const ang = t * 0.42;
        const tick = new THREE.Mesh(
          new THREE.BoxGeometry(0.0012, 0.001, 0.003),
          matPointerPip
        );
        tick.position.set(Math.sin(ang) * 0.014, 0.0005, -Math.cos(ang) * 0.014);
        tick.rotation.y = -ang;
        mount.add(tick);
      }

      const pivot = new THREE.Group();
      pivot.name = `${knobName}_Pivot`;
      mount.add(pivot);

      const knobMat = new THREE.MeshStandardMaterial({
        color: 0x1b2028,
        roughness: 0.34,
        metalness: 0.28,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0
      });
      const knobBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0098, 0.0108, 0.012, 24),
        knobMat
      );
      knobBody.name = knobName;
      knobBody.position.y = 0.006;
      knobBody.castShadow = true;
      knobBody.userData = {
        isTeachingTarget: true,
        isCuratedPermanentTarget: true,
        getLabel: () => `${labelText} (${knobName})`,
        toggle: () => this.performCurrentStepAction()
      };
      pivot.add(knobBody);

      // Brushed aluminum chamfered dial face cap
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0074, 0.0082, 0.0022, 24),
        matBrushedAlum
      );
      cap.position.y = 0.0125;
      cap.userData = knobBody.userData;
      pivot.add(cap);

      // Indicator line pip
      const pip = new THREE.Mesh(
        new THREE.BoxGeometry(0.0018, 0.0026, 0.0065),
        matPointerPip
      );
      pip.position.set(0, 0.0132, -0.0042);
      pip.userData = knobBody.userData;
      pivot.add(pip);

      this.interactiveTargets.push(knobBody);
      return { pivot, knobBody };
    };

    const stirKnob = buildRotaryKnob("Knob_Stir", -0.040, "Magnetic Stirrer Dial");
    const tempKnob = buildRotaryKnob("Knob_Temp", 0.040, "Hotplate Heater Dial");
    this.knobStirPivot = stirKnob.pivot;
    this.knobTempPivot = tempKnob.pivot;

    // =========================================================================
    // 2. 100 mL Calibrated Borosilicate Pyrex Beaker Seated at plateTopY = 0.040
    // =========================================================================
    const plateTopY = 0.040;
    const beakerZ = -0.012;

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.30,
      roughness: 0.05,
      ior: 1.47,
      side: THREE.DoubleSide,
      depthWrite: false,
      name: "Mat_Curated_Pyrex_100mL"
    });

    const beakerBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0315, 0.0315, 0.002, 32),
      glassMat
    );
    beakerBase.position.set(0, plateTopY + 0.001, beakerZ);
    this.curatedBenchGroup.add(beakerBase);

    const beakerWall = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 0.082, 36, 1, true),
      glassMat
    );
    beakerWall.name = "Glass_Pyrex_Beaker_100mL";
    beakerWall.position.set(0, plateTopY + 0.041, beakerZ);
    this.curatedBenchGroup.add(beakerWall);

    const beakerRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.033, 0.0018, 10, 36),
      glassMat
    );
    beakerRim.rotation.x = Math.PI / 2;
    beakerRim.position.set(0, plateTopY + 0.082, beakerZ);
    this.curatedBenchGroup.add(beakerRim);

    // Volumetric ceramic white graduation tick lines on front +Z face
    const matGrad = new THREE.MeshBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.72 });
    for (const frac of [0.22, 0.42, 0.62, 0.80]) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.0012, 0.001), matGrad);
      tick.position.set(0, plateTopY + frac * 0.082, beakerZ + 0.0322);
      this.curatedBenchGroup.add(tick);
    }

    // Reactive Solution Volume + Meniscus Surface
    this.liquidMat = new THREE.MeshStandardMaterial({
      color: 0xdbeafe,
      transparent: true,
      opacity: 0.42,
      roughness: 0.14,
      metalness: 0.04,
      name: "Mat_Reactive_Solution"
    });
    this.liquidMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0298, 0.0298, 0.050, 32),
      this.liquidMat
    );
    this.liquidMesh.position.set(0, plateTopY + 0.002 + 0.025, beakerZ);
    this.curatedBenchGroup.add(this.liquidMesh);

    // PTFE Magnetic Stir Bar inside Beaker (above glass floor)
    this.stirBarMesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.0032, 0.015, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.22 })
    );
    this.stirBarMesh.rotation.z = Math.PI / 2;
    this.stirBarMesh.position.set(0, plateTopY + 0.0055, beakerZ);
    this.curatedBenchGroup.add(this.stirBarMesh);

    // Nucleated recrystallized CuSO4 crystal cluster on beaker bottom (shown in Step 4)
    this.beakerCrystals = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.011, 1),
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        emissiveIntensity: 0.25,
        roughness: 0.22,
        flatShading: true
      })
    );
    this.beakerCrystals.scale.set(1.4, 0.35, 1.4);
    this.beakerCrystals.position.set(0.006, plateTopY + 0.004, beakerZ + 0.004);
    this.beakerCrystals.visible = false;
    this.curatedBenchGroup.add(this.beakerCrystals);

    // =========================================================================
    // 3. Polystyrene Weighing Boat + Triclinic CuSO4·5H2O Crystal Mound (X = +0.12)
    // =========================================================================
    const boatGroup = new THREE.Group();
    boatGroup.name = "Polystyrene_Weigh_Boat";
    boatGroup.position.set(0.12, 0.001, 0.02);
    this.curatedBenchGroup.add(boatGroup);

    const boatMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.020, 0.008, 4),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.38 })
    );
    boatMesh.rotation.y = Math.PI / 4;
    boatMesh.position.y = 0.004;
    boatMesh.castShadow = true;
    boatGroup.add(boatMesh);

    this.crystalMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.25,
      roughness: 0.25,
      metalness: 0.1,
      flatShading: true,
      name: "Mat_CuSO4_Pentahydrate_Crystals"
    });
    this.crystalMound = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.013, 1),
      this.crystalMat
    );
    this.crystalMound.scale.set(1.2, 0.55, 1.2);
    this.crystalMound.position.y = 0.009;
    boatGroup.add(this.crystalMound);

    // Clickable hitbox for the Pyrex beaker & weigh boat (keeps front bevel knobs clear)
    const beakerHit = new THREE.Mesh(
      new THREE.BoxGeometry(0.17, 0.11, 0.11),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    beakerHit.position.set(0.045, 0.085, -0.012);
    beakerHit.userData = {
      isTeachingTarget: true,
      isCuratedPermanentTarget: true,
      getLabel: () => `Curated 100 mL Beaker & Reagents (${this.activeLesson?.id || "T1L1"})`,
      toggle: () => this.performCurrentStepAction()
    };
    this.curatedBenchGroup.add(beakerHit);
    this.interactiveTargets.push(beakerHit);
  }

  async startLesson(lessonId = "T1L1") {
    const upperId = String(lessonId || "T1L1").toUpperCase();
    let lesson = POC_LESSONS[upperId];

    // Dynamic builder for any of the 24 Tier 1 lessons not in the 3 bespoke PoCs
    if (!lesson) {
      const t1Meta = TIER1_CURRICULUM_MANIFEST.find((m) => m.id === upperId) || TIER1_CURRICULUM_MANIFEST[0];
      const primaryId = t1Meta.machines[0] || "balance";
      const dock = this.dockManager.getDockById(primaryId);
      const camConsole = dock?.userData?.camConsole || {
        pos: new THREE.Vector3(-0.30, 1.30, -3.02),
        look: new THREE.Vector3(-0.26, 1.00, -4.08)
      };

      lesson = {
        id: t1Meta.id,
        title: t1Meta.title,
        roomName: "CR-01 · Tier 1 Active Matter Studio",
        machines: t1Meta.machines,
        primaryMachine: primaryId,
        benchCam: camConsole,
        verificationQuestion: {
          prompt: `Verify primary empirical measurement for ${t1Meta.id}:`,
          expected: "1.00",
          unit: "units",
          verified: false
        },
        plotData: POC_LESSONS.T1L1.plotData,
        steps: [
          {
            title: `Step 1 · Power & Configure ${primaryId.toUpperCase()}`,
            instruction: `Click the glowing control on the ${primaryId} digital twin to initialize ${t1Meta.title}. Required glassware: ${t1Meta.glassware}.`,
            ttsText: `Initializing ${t1Meta.title}. Required instruments: ${t1Meta.machines.join(" and ")}. Click the glowing button on the 3D instrument to begin.`,
            audioStemUrl: "./assets/audio/t1l1_intro.mp3",
            targetMeshName: "Btn_Power",
            targetAliases: ["Btn_Power", "Power_Switch", "UI_LCD", "Btn_Temp", "Btn_Mode", "Knob_Temp"],
            targetMachineId: primaryId,
            targetMachineName: dock?.userData?.name || primaryId,
            beaconOffset: camConsole.look.clone().add(new THREE.Vector3(0, 0.04, 0.12)),
            liquidColor: 0x0284c7,
            liquidOpacity: 0.65,
            crystalScale: 1.0,
            telemetry: {
              primaryLabel: "INSTRUMENT",
              primaryVal: "ONLINE",
              secondaryLabel: "GLASSWARE",
              secondaryVal: "MOUNTED",
              tertiaryLabel: "REAGENTS",
              tertiaryVal: "READY",
              status: "BLE 5.2 LINKED"
            },
            observation: `✓ [Step 1] Curated bench configured for ${t1Meta.id}: ${t1Meta.glassware}.`
          },
          {
            title: `Step 2 · Acquire Data & Stream to iPhone Companion`,
            instruction: `Click the glowing Start / Read control on the 3D machine to perform the experiment (${t1Meta.chemicals}) and stream results to your iPhone.`,
            ttsText: `Performing experimental run with ${t1Meta.chemicals}. Live telemetry and ${t1Meta.graphics} are now streaming to your connected iPhone Companion.`,
            audioStemUrl: "../centrifuge_twin/docs/audio/vo_5.mp3",
            targetMeshName: "Btn_Start",
            targetAliases: ["Btn_Start", "Btn_Scan", "Knob_Stir", "Knob_Speed", "UI_LCD"],
            targetMachineId: primaryId,
            targetMachineName: dock?.userData?.name || primaryId,
            beaconOffset: camConsole.look.clone().add(new THREE.Vector3(0.06, 0.04, 0.12)),
            liquidColor: 0x3dd68c,
            liquidOpacity: 0.75,
            crystalScale: 0.5,
            telemetry: {
              primaryLabel: "EMPIRICAL READOUT",
              primaryVal: "1.000 ± 0.002",
              secondaryLabel: "SHADER STATE",
              secondaryVal: "ACTIVE",
              tertiaryLabel: "GLP STATUS",
              tertiaryVal: "PASS",
              status: "DATA RECEIVED"
            },
            observation: `✓ [Step 2] Completed ${t1Meta.id} run; ${t1Meta.graphics} logged on iPhone.`
          }
        ]
      };
    }

    const launchToken = ++this._lessonLaunchToken;
    this.activeLesson = lesson;
    this.currentStepIndex = 0;
    this.observations = [];

    // 1. Immediately enter ChemMate Lesson Mode & collapse legacy right sidebar (DIAG-028)
    document.body.classList.add("chemmate-lesson-mode");
    this.app.sidebar?.classList.add("is-collapsed");
    if (this.app.sidebarToggleIcon) this.app.sidebarToggleIcon.textContent = "▶";

    // Close curriculum modal if open
    this.app.setCurriculumModalOpen?.(false);

    // Update topbar lesson pill if present
    const lessonPill = document.getElementById("cm-active-lesson-pill");
    if (lessonPill) {
      const shortPrefix = lesson.title.split(":")[0].trim();
      const cleaned = shortPrefix.startsWith(lesson.id)
        ? shortPrefix.replace(new RegExp(`^${lesson.id}\\s*[·:]?\\s*`, "i"), "").trim()
        : shortPrefix;
      lessonPill.textContent = cleaned ? `${lesson.id} · ${cleaned}` : lesson.id;
    }

    // 2. Snap camera immediately to curated bench studio pose BEFORE async twin imports (DIAG-029)
    if (this.player && lesson.benchCam) {
      this.player.setCameraPose(lesson.benchCam.pos, lesson.benchCam.look, "station_focus");
      this.player.currentZone = `${lesson.roomName} · ${lesson.id}`;
    }
    if (this.app.hudZonePill) {
      this.app.hudZonePill.textContent = `${lesson.roomName} · ${lesson.id}`;
    }
    this.app.mobilePerf?.refresh();

    // 3. Allow multiple machines on the curated desk and mount required 3D twins
    this.dockManager.maxActiveMachines = Math.max(2, lesson.machines.length);
    for (const mId of lesson.machines) {
      await this.dockManager.turnOnTwin(mId);
      if (launchToken !== this._lessonLaunchToken) return;
    }

    // 4. Re-confirm studio camera framing and refresh light/culling budget once twins are mounted
    if (this.player && lesson.benchCam) {
      this.player.setCameraPose(lesson.benchCam.pos, lesson.benchCam.look, "station_focus");
      this.player.currentZone = `${lesson.roomName} · ${lesson.id}`;
    }
    if (this.app.hudZonePill) {
      this.app.hudZonePill.textContent = `${lesson.roomName} · ${lesson.id}`;
    }
    this.app.mobilePerf?.refresh();

    // 5. Apply Step 0 state, highlight target 3D control, update SVG leader callout & pop up iPhone HUD
    this._applyStep(0, { autoPopup: true, speak: true });
  }

  exitLessonMode() {
    this._lessonLaunchToken++;
    document.body.classList.remove("chemmate-lesson-mode");

    const callout = document.getElementById("cm-leader-callout");
    if (callout) callout.classList.add("is-hidden");

    this.app.phoneCompanion?.stopSpeech();
    this.app.phoneCompanion?.toggleOpen(false);

    this.beaconGroup.visible = false;
    this._activeTargetWorldPos = null;
    this._clearPulsingMeshes();

    if (this.knobStirPivot) this.knobStirPivot.rotation.y = 0;
    if (this.knobTempPivot) this.knobTempPivot.rotation.y = 0;
    if (this.thermalGlowMat) this.thermalGlowMat.opacity = 0;
    if (this.beakerCrystals) this.beakerCrystals.visible = false;

    this.activeLesson = null;
    this.currentStepIndex = 0;
    this.observations = [];

    if (this.dockManager) {
      this.dockManager.maxActiveMachines = 1;
    }

    this.player?.glideToOverview();
  }

  getCurrentStep() {
    if (!this.activeLesson) return null;
    return this.activeLesson.steps[this.currentStepIndex] || this.activeLesson.steps[0];
  }

  focusAndPulseCurrentTarget() {
    const step = this.getCurrentStep();
    if (!step) return;

    const isCuratedKnob = (step.targetAliases || []).some((a) => /^knob_/i.test(a)) ||
      /^knob_/i.test(step.targetMeshName || "");

    if (isCuratedKnob && this.player) {
      this.player.glideToStation(
        new THREE.Vector3(-0.36, 1.18, -3.38),
        new THREE.Vector3(-0.36, 0.96, -3.96),
        `Focusing on ${step.targetMeshName} (${step.targetMachineName})`
      );
    } else {
      const dock = this.dockManager.getDockById(step.targetMachineId);
      if (dock && dock.userData?.camConsole && this.player) {
        this.player.glideToStation(
          dock.userData.camConsole.pos,
          dock.userData.camConsole.look,
          `Focusing on ${step.targetMeshName} (${step.targetMachineName})`
        );
      }
    }

    this._highlightTargetMeshes(step);
    labAudio.playButtonClick();
  }

  performCurrentStepAction() {
    if (!this.activeLesson) {
      this.startLesson("T1L1");
      return;
    }

    const step = this.getCurrentStep();
    if (!step) return;

    labAudio.playButtonClick();

    // Physically depress the 3D button mesh on the mounted twin (1.0 mm tactile travel)
    this.pulsingMeshes.forEach((mesh) => {
      if (!mesh || /^knob_/i.test(mesh.name || "")) return;
      const origY = mesh.position.y;
      mesh.position.y = origY - 0.0012;
      setTimeout(() => {
        mesh.position.y = origY;
      }, 220);
    });

    // Record observation if not yet recorded
    if (step.observation && !this.observations.includes(step.observation)) {
      this.observations.push(step.observation);
    }

    // Advance to next step (or stay on final step and open Results tab on iPhone)
    if (this.currentStepIndex < this.activeLesson.steps.length - 1) {
      this.currentStepIndex++;
      this._applyStep(this.currentStepIndex, { autoPopup: true, speak: true });
    } else {
      // Completed final step -> auto-open iPhone Results & Verification tab
      this._applyStep(this.currentStepIndex, { autoPopup: true, speak: false });
      if (this.app.phoneCompanion) {
        this.app.phoneCompanion.toggleOpen(true);
        this.app.phoneCompanion.switchTab("notebook");
      }
    }
  }

  _applyStep(idx, options = { autoPopup: false, speak: false }) {
    const step = this.activeLesson?.steps[idx];
    if (!step) return;

    // Update 3D Curated Glassware Shaders (Solution color, opacity & crystal growth)
    if (this.liquidMat && step.liquidColor !== undefined) {
      this.liquidMat.color.setHex(step.liquidColor);
      this.liquidMat.opacity = step.liquidOpacity ?? 0.55;
    }
    if (this.crystalMound && step.crystalScale !== undefined) {
      const s = Math.max(0.01, step.crystalScale);
      this.crystalMound.visible = step.crystalScale > 0.02;
      this.crystalMound.scale.set(1.2 * s, 0.55 * s, 1.2 * s);
    }
    if (this.beakerCrystals) {
      this.beakerCrystals.visible = idx >= 3 && (step.crystalScale ?? 0) > 1.0;
    }

    // Rotate physical stir/temp knobs on curated mini hotplate to match active step
    if (this.knobStirPivot) {
      this.knobStirPivot.rotation.y = idx >= 2 ? -1.25 : 0; // Clockwise around +Y axis
    }
    if (this.knobTempPivot) {
      this.knobTempPivot.rotation.y = idx >= 3 ? -1.45 : 0;
    }
    if (this.thermalGlowMat) {
      this.thermalGlowMat.opacity = idx >= 3 ? 0.38 : 0.0;
    }
    if (this.hotplateLedMat) {
      this.hotplateLedMat.emissiveIntensity = idx >= 2 ? 1.15 : 0.25;
    }

    // Highlight target 3D mesh, position 3D Beacon Ring & project 2D SVG Leader Callout
    this._highlightTargetMeshes(step);

    // Update Main Lab Assistant Sidebar to stay in sync
    if (this.app.sidebarBadge) this.app.sidebarBadge.textContent = this.activeLesson.id;
    if (this.app.telemetryStationName) this.app.telemetryStationName.textContent = step.targetMachineName;
    if (this.app.tStatus) this.app.tStatus.textContent = step.telemetry.status;
    if (this.app.tParam1) this.app.tParam1.textContent = step.telemetry.primaryVal;
    if (this.app.tTemp) this.app.tTemp.textContent = step.telemetry.secondaryVal;
    if (this.app.tTimer) this.app.tTimer.textContent = step.telemetry.tertiaryVal;
    if (this.app.advisorText) this.app.advisorText.textContent = step.instruction;

    // Sync with iPhone Companion HUD & Paired Real Phone
    if (this.app.phoneCompanion) {
      this.app.phoneCompanion.updateLessonState({
        lessonId: this.activeLesson.id,
        lessonTitle: this.activeLesson.title,
        roomName: this.activeLesson.roomName,
        stepIndex: idx,
        totalSteps: this.activeLesson.steps.length,
        stepTitle: step.title,
        stepInstruction: step.instruction,
        ttsText: step.ttsText,
        audioStemUrl: step.audioStemUrl,
        targetMeshName: step.targetMeshName,
        targetMachineName: step.targetMachineName,
        telemetry: step.telemetry,
        observations: this.observations.slice(),
        plotData: this.activeLesson.plotData,
        verificationQuestion: this.activeLesson.verificationQuestion
      }, options);
    }
  }

  _clearPulsingMeshes() {
    this.pulsingMeshes.forEach((m) => {
      const saved = this._savedEmissives.get(m);
      if (saved && m.material && m.material.emissive) {
        m.material.emissive.copy(saved.color);
        m.material.emissiveIntensity = saved.intensity;
      }
    });
    this.pulsingMeshes = [];

    // Restore original userData and remove dynamic twin meshes from raycast targets
    this._stepInteractiveMeshes.forEach((m) => {
      const prev = this._savedUserData.get(m);
      if (prev) {
        if (prev.hadIsTeachingTarget) m.userData.isTeachingTarget = prev.isTeachingTarget;
        else delete m.userData.isTeachingTarget;
        if (prev.hadToggle) m.userData.toggle = prev.toggle;
        else delete m.userData.toggle;
        if (prev.hadGetLabel) m.userData.getLabel = prev.getLabel;
        else delete m.userData.getLabel;
      }
      const idx = this.interactiveTargets.indexOf(m);
      if (idx !== -1 && !m.userData?.isCuratedPermanentTarget) {
        this.interactiveTargets.splice(idx, 1);
      }
    });
    this._stepInteractiveMeshes = [];
  }

  _attachStepTargetMesh(mesh, step) {
    if (!mesh || !mesh.isMesh) return;

    if (!mesh.userData?.isCuratedPermanentTarget) {
      if (!this._savedUserData.has(mesh)) {
        this._savedUserData.set(mesh, {
          hadIsTeachingTarget: Object.prototype.hasOwnProperty.call(mesh.userData, "isTeachingTarget"),
          isTeachingTarget: mesh.userData.isTeachingTarget,
          hadToggle: Object.prototype.hasOwnProperty.call(mesh.userData, "toggle"),
          toggle: mesh.userData.toggle,
          hadGetLabel: Object.prototype.hasOwnProperty.call(mesh.userData, "getLabel"),
          getLabel: mesh.userData.getLabel
        });
      }

      mesh.userData.isTeachingTarget = true;
      mesh.userData.toggle = () => this.performCurrentStepAction();
      mesh.userData.getLabel = () => `Click ${step.targetMeshName} (${step.title})`;

      if (!this.interactiveTargets.includes(mesh)) {
        this.interactiveTargets.push(mesh);
      }
      if (!this._stepInteractiveMeshes.includes(mesh)) {
        this._stepInteractiveMeshes.push(mesh);
      }
    }

    // Pulse emissive materials (skip live LCD/text planes that use dynamic canvas maps unless solid control)
    if (
      mesh.material &&
      !Array.isArray(mesh.material) &&
      mesh.material.emissive &&
      !(mesh.name === "UI_LCD" && mesh.material.map) &&
      this.pulsingMeshes.length < 6 &&
      !this.pulsingMeshes.includes(mesh)
    ) {
      mesh.material = mesh.material.clone();
      this._savedEmissives.set(mesh, {
        color: mesh.material.emissive.clone(),
        intensity: mesh.material.emissiveIntensity || 0
      });
      this.pulsingMeshes.push(mesh);
    }
  }

  _highlightTargetMeshes(step) {
    this._clearPulsingMeshes();

    const dock = this.dockManager.getDockById(step.targetMachineId);
    if (dock) dock.updateMatrixWorld(true);
    this.curatedBenchGroup.updateMatrixWorld(true);

    const searchRoots = [this.curatedBenchGroup, dock].filter(Boolean);
    const aliases = (Array.isArray(step.targetAliases) && step.targetAliases.length > 0)
      ? step.targetAliases
      : [step.targetMeshName].filter(Boolean);

    const matchedNodes = [];
    let primaryNode = null;

    for (const alias of aliases) {
      const aliasLower = String(alias || "").toLowerCase();
      if (!aliasLower) continue;

      let exactHit = null;
      let partialHit = null;

      for (const root of searchRoots) {
        root.traverse((node) => {
          if (!node.name) return;
          const n = node.name.toLowerCase();
          if (n === aliasLower) {
            if (!exactHit) exactHit = node;
          } else if (
            n === `${aliasLower}_keycap` ||
            n.includes(aliasLower)
          ) {
            if (!partialHit) partialHit = node;
          }
        });
      }

      const winner = exactHit || partialHit;
      if (winner) {
        if (!primaryNode) primaryNode = winner;
        if (!matchedNodes.includes(winner)) matchedNodes.push(winner);
      }
    }

    for (const node of matchedNodes) {
      if (node.isMesh) {
        this._attachStepTargetMesh(node, step);
      } else {
        node.traverse((child) => {
          if (child.isMesh) {
            this._attachStepTargetMesh(child, step);
          }
        });
      }
    }

    // Compute exact world bounding box center for the primary matched node
    let worldCenter = null;
    if (primaryNode) {
      const box = new THREE.Box3().setFromObject(primaryNode);
      if (!box.isEmpty()) {
        worldCenter = box.getCenter(new THREE.Vector3());
      } else {
        worldCenter = new THREE.Vector3();
        primaryNode.getWorldPosition(worldCenter);
      }
    }

    if (!worldCenter || !Number.isFinite(worldCenter.x)) {
      worldCenter = (step.beaconOffset || new THREE.Vector3(-0.26, 1.04, -3.98)).clone();
    }

    this._activeTargetWorldPos = worldCenter;

    // Position the sleek Swiss Crimson 3D Beacon Ring right on/above the target control
    this.beaconGroup.position.copy(worldCenter).add(new THREE.Vector3(0, 0.025, 0));
    this.beaconGroup.visible = true;

    // Populate SVG Leader Callout badge text & update projected screen coordinates immediately
    const meshEl = document.getElementById("cm-leader-mesh");
    const labelEl = document.getElementById("cm-leader-label");
    if (meshEl) {
      meshEl.textContent = primaryNode?.name || step.targetMeshName || "TARGET";
    }
    if (labelEl) {
      const cleanStep = (step.title || "ACTUATE IN 3D").replace(/^Step\s*\d+\s*[·:\-]\s*/i, "");
      labelEl.textContent = cleanStep.length > 34 ? `${cleanStep.slice(0, 32)}…` : cleanStep;
    }

    this._updateLeaderCallout();
  }

  _updateLeaderCallout() {
    const calloutEl = document.getElementById("cm-leader-callout");
    if (!calloutEl) return;

    const modalEl = document.getElementById("chemmate-curriculum-modal");
    const isModalOpen = modalEl && !modalEl.classList.contains("is-hidden");

    if (
      !this.activeLesson ||
      !document.body.classList.contains("chemmate-lesson-mode") ||
      !this._activeTargetWorldPos ||
      isModalOpen ||
      !this.camera ||
      !this.app?.renderer?.domElement
    ) {
      calloutEl.classList.add("is-hidden");
      return;
    }

    this.camera.updateMatrixWorld();
    const proj = this._projVec.copy(this._activeTargetWorldPos).project(this.camera);

    // Hide cleanly if behind the camera or outside NDC depth
    if (proj.z < -1 || proj.z > 1) {
      calloutEl.classList.add("is-hidden");
      return;
    }

    const canvasRect = this.app.renderer.domElement.getBoundingClientRect();
    if (canvasRect.width <= 0 || canvasRect.height <= 0) {
      calloutEl.classList.add("is-hidden");
      return;
    }

    const clientX = canvasRect.left + (proj.x * 0.5 + 0.5) * canvasRect.width;
    const clientY = canvasRect.top + (-proj.y * 0.5 + 0.5) * canvasRect.height;

    if (
      clientX < canvasRect.left + 16 ||
      clientX > canvasRect.right - 16 ||
      clientY < canvasRect.top + 16 ||
      clientY > canvasRect.bottom - 16
    ) {
      calloutEl.classList.add("is-hidden");
      return;
    }

    calloutEl.classList.remove("is-hidden");

    const overlayRect = calloutEl.getBoundingClientRect();
    const baseLeft = overlayRect.width > 0 ? overlayRect.left : canvasRect.left;
    const baseTop = overlayRect.height > 0 ? overlayRect.top : canvasRect.top;
    const stageW = overlayRect.width > 0 ? overlayRect.width : canvasRect.width;
    const stageH = overlayRect.height > 0 ? overlayRect.height : canvasRect.height;

    const x = clientX - baseLeft;
    const y = clientY - baseTop;

    const polyEl = document.getElementById("cm-leader-poly");
    const dotEl = document.getElementById("cm-leader-dot");
    const boxEl = document.getElementById("cm-leader-box");

    // Pick elbow direction away from edges and expanded left iPhone HUD
    const hudEl = document.getElementById("iphone-companion-hud");
    const hudOpen = hudEl && !hudEl.classList.contains("is-minimized");
    const minLeft = (hudOpen && stageW > 760)
      ? Math.max(12, hudEl.getBoundingClientRect().right - baseLeft + 14)
      : 12;

    let dirX = x > stageW * 0.62 ? -1 : 1;
    if (dirX < 0 && x - 260 < minLeft) dirX = 1;
    const dirY = y < 110 ? 1 : -1;

    const elbowX = Math.max(minLeft, Math.min(stageW - 20, x + dirX * 26));
    const shelfY = Math.max(28, Math.min(stageH - 28, y + dirY * 52));
    const endX = Math.max(minLeft, Math.min(stageW - 24, x + dirX * 72));

    let boxLeft = endX;
    let boxTop = shelfY - 22;

    if (boxEl) {
      const bw = boxEl.offsetWidth || 184;
      const bh = boxEl.offsetHeight || 44;
      boxLeft = dirX > 0 ? endX : endX - bw;
      boxLeft = Math.max(minLeft, Math.min(stageW - bw - 12, boxLeft));
      boxTop = Math.max(12, Math.min(stageH - bh - 12, shelfY - bh / 2));

      boxEl.style.left = `${Math.round(boxLeft)}px`;
      boxEl.style.top = `${Math.round(boxTop)}px`;

      const anchorX = dirX > 0 ? boxLeft : boxLeft + bw;
      const anchorY = boxTop + bh / 2;
      const cleanElbowX = dirX > 0 && anchorX > x + 10
        ? x + Math.min(26, (anchorX - x) * 0.45)
        : (dirX < 0 && anchorX < x - 10
          ? x - Math.min(26, (x - anchorX) * 0.45)
          : (x + anchorX) * 0.5);
      if (polyEl) {
        polyEl.setAttribute(
          "points",
          `${x.toFixed(1)},${y.toFixed(1)} ${cleanElbowX.toFixed(1)},${anchorY.toFixed(1)} ${anchorX.toFixed(1)},${anchorY.toFixed(1)}`
        );
      }
    } else if (polyEl) {
      polyEl.setAttribute(
        "points",
        `${x.toFixed(1)},${y.toFixed(1)} ${elbowX.toFixed(1)},${shelfY.toFixed(1)} ${endX.toFixed(1)},${shelfY.toFixed(1)}`
      );
    }

    if (dotEl) {
      dotEl.setAttribute("cx", x.toFixed(1));
      dotEl.setAttribute("cy", y.toFixed(1));
    }
  }

  update(elapsedSec) {
    if (!this.activeLesson) return;

    // 1. Pulse Swiss Crimson-Amber emissive intensity on target 3D control(s)
    const pulse = 0.5 + 0.5 * Math.sin(elapsedSec * 5.2);
    this.pulsingMeshes.forEach((mesh) => {
      if (mesh.material && mesh.material.emissive) {
        mesh.material.emissive.setRGB(
          0.84 * pulse + 0.16,
          0.12 * pulse + 0.03,
          0.08 * pulse + 0.02
        );
        mesh.material.emissiveIntensity = 0.52 + pulse * 0.88;
      }
    });

    // 2. Animate Swiss Crimson 3D Beacon Ring & Minimal Chevron
    if (this.beaconGroup.visible) {
      this.beaconRing.scale.setScalar(0.92 + pulse * 0.20);
      this.beaconRingMat.opacity = 0.60 + pulse * 0.35;
      if (this.beaconOuterRing) {
        this.beaconOuterRing.scale.setScalar(1.0 + pulse * 0.36);
        this.beaconOuterRingMat.opacity = 0.45 * (1.0 - pulse * 0.65);
      }
      this.beaconCone.position.y = 0.032 + Math.sin(elapsedSec * 4.5) * 0.006;
      this.beaconCone.rotation.y = elapsedSec * 1.6;
    }

    // 3. Spin PTFE magnetic stir bar inside curated beaker during stirring steps
    if (this.stirBarMesh && this.currentStepIndex >= 2) {
      this.stirBarMesh.rotation.y = elapsedSec * 18.0;
    }

    // 4. Project active 3D target coordinate into 2D SVG leader callout overlay
    this._updateLeaderCallout();
  }
}
