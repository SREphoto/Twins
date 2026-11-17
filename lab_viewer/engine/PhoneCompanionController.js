/**
 * PhoneCompanionController.js — Dual-Mode iPhone 14 Pro Companion & Real-Phone Second-Screen Sync
 *
 * Capabilities:
 * 1. Physical 3D Sketchfab iPhone (`./assets/models/iphone_14_pro.glb`) mounted cleanly on a
 *    machined brushed-titanium MagSafe dock on the curated lab bench (single-instance pruned GLB,
 *    planar UV normalized with `flipY = false`, zero floating 3D QR plaques).
 * 2. On-Screen Interactive iPhone 14 Pro HUD in the ChemMate Swiss Archival Paper aesthetic
 *    (`#F4F1EA` / `#FBF9F4` / `#141413` / `#D61F1F`) that slides on/off screen anytime (`KeyP`).
 * 3. Real-Phone Second-Screen Pairing via QR Code Drawer (`#iphone-qr-drawer`) + 6-Digit Pairing Code
 *    (`companion.html?code=CM-XXXX`), synchronized over BroadcastChannel + storage events.
 * 4. Gemini 3.8 Flash TTS Voice Player (plays Drive/Twin MP3 voice stems with Web Speech fallback).
 * 5. Hybrid Telemetry + Student Verification Notebook (live BLE sensor stream, inline scientific SVG
 *    diagrams, real-time HTML5 Canvas curve plotter, and complete 24-Lab Tier 1 Curriculum Matrix).
 */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { labAudio } from "./LabSFXMixer.js";

export const TIER1_CURRICULUM_MANIFEST = [
  { id: "T1L1", title: "1.1 · Chemistry in Context (CuSO₄·5H₂O)", machines: ["balance", "hotplate"], glassware: "100mL Pyrex Beaker, Stir Rod, Weigh Boat, Micro-Spatula, PT1000 Probe", chemicals: "CuSO₄·5H₂O blue crystals, Anhydrous CuSO₄, DI H₂O (Clear → Royal Blue shader)", graphics: "BLE Mass/Temp stream, ΔT curve, [Cu(H₂O)₆]²⁺ octahedral callout" },
  { id: "T1L2", title: "1.2 · Matter Basics (Mixture Separation)", machines: ["centrifuge", "hotplate"], glassware: "15mL Conical Tubes, 60° Funnel, Whatman Filter, Bar Magnet, Evap Dish", chemicals: "Silica sand, NaCl, Fe filings (magnetic particle shader), Fine silt", graphics: "4-Stage separation flow ledger, RCF vs RPM calculator, % recovery" },
  { id: "T1L3", title: "1.3 · Phase Shift (Heating/Cooling Curves)", machines: ["hotplate"], glassware: "600mL Water Bath, 25×150mm Boiling Tube, Retort Clamp, Type-K Probe", chemicals: "Pure Lauric Acid (Tm 43.2°C) & Stearic Eutectic (Crystalline melt shader)", graphics: "Live T(°C) vs t(s) plateau plot, ΔH_fus latent heat marker" },
  { id: "T1L4", title: "1.4 · Inside the Atom (Rutherford α-Scattering)", machines: ["vacuum_pump"], glassware: "Evacuated Scattering Chamber, 0.1µm Au Leaf, Collimator, Detector Arm", chemicals: "²⁴¹Am α-source, ZnS(Ag) screen (Subatomic α-trail & flash shader)", graphics: "Angular count histogram N(θ) vs sin⁻⁴(θ/2), Coulomb nuclear zoom" },
  { id: "T1L5", title: "1.5 · Elements & Identity (Flame Emission)", machines: ["spectrophotometer"], glassware: "Pt Wire Loop, 6× Watch Glasses, 1M HCl Rinse Vial, Fiber Optic Collector", chemicals: "LiCl (crimson), NaCl (589nm), KCl (lilac), SrCl₂ (red), CuCl₂ (emerald)", graphics: "High-DPI atomic emission line spectrum (400–700nm) & Rydberg matcher" },
  { id: "T1L6", title: "1.6 · Electrostatic Forces (Ionic vs Covalent)", machines: ["hotplate"], glassware: "Dual Graphite Electrode Dip Rig w/ LED, Porcelain Crucible, 3× Beakers", chemicals: "Solid/Molten/Aq NaCl, Aq Sucrose, DI H₂O (Ion migration glow shader)", graphics: "Conductivity (mS/cm) bar chart & cathode/anode ion vector HUD" },
  { id: "T1L7", title: "1.7 · Precision Tools (Volumetric Calibration)", machines: ["balance"], glassware: "10mL Class A Pipette, 50mL Graduated Cylinder, 25mL Glass Pycnometer", chemicals: "Degassed DI Water (Parallax meniscus shader & ρ(T) density table)", graphics: "Eye-level meniscus reticle & glassware tolerance % error curve" },
  { id: "T1L8", title: "1.8 · The Macro-Micro Bridge (Avogadro Monolayer)", machines: ["balance"], glassware: "30cm Black-Bottom Trough, P20 Micropipette, Vernier Calipers, Powder Shaker", chemicals: "0.5% Oleic Acid in Hexane on H₂O (Expanding circular monolayer shader)", graphics: "Amphiphilic -COOH cross-section & h = V/(πr²) → N_A solver" },
  { id: "T1L9", title: "1.9 · Subatomic Particles (Thomson e/m CRT)", machines: ["spectrophotometer"], glassware: "Evacuated Thomson CRT Bulb w/ Phosphor Ruler, Dual Helmholtz Coils", chemicals: "Accelerated e⁻ beam in trace Hg/He (Luminescent magnetic arc shader)", graphics: "3D Lorentz force F = -e(E + v×B) vectors & live e/m calculator" },
  { id: "T1L10", title: "1.10 · Isotope Balance (Neon Sector MS)", machines: ["vacuum_pump"], glassware: "Gas Dosing Ampoules, Septum Port, Magnetic Sector Tube, Faraday Cup", chemicals: "²⁰Ne (90.48%), ²¹Ne (0.27%), ²²Ne (9.25%) diverging ion beams", graphics: "m/z relative abundance bar plot & weighted atomic mass verifier" },
  { id: "T1L11", title: "1.11 · Dalton's Postulates (Multiple Proportions)", machines: ["balance", "muffle_furnace"], glassware: "2× Glazed Porcelain Crucibles + Lids, Crucible Tongs, Desiccator", chemicals: "Red Cu₂O & Black CuO → Metallic Cu⁰ (Thermal reduction luster shader)", graphics: "Gravimetric g Cu per 1.000g O table proving exact 2.00 : 1 ratio" },
  { id: "T1L12", title: "1.12 · Plum Pudding (Crookes Maltese Cross)", machines: ["vacuum_pump"], glassware: "Evacuated Crookes Tube w/ Hinged Maltese Cross, HV Coil, Bar Magnet", chemicals: "Residual gas cathode ray fluorescence & magnetic shadow distortion", graphics: "Magnetic field B-lines & Thomson vs Rutherford diagnostic log" },
  { id: "T1L13", title: "1.13 · The Nucleus (Backscattering vs Z)", machines: ["vacuum_pump"], glassware: "4-Position Foil Target Wheel (Al, Ni, Ag, Au), Lead Collimator, MCA", chemicals: "α-backscattering trajectories scaling with nuclear charge Z²", graphics: "Backscatter CPM vs Atomic Number Z² linear regression plot" },
  { id: "T1L14", title: "1.14 · Quantized Energy (Balmer Discharge)", machines: ["spectrophotometer"], glassware: "5kV Spectrum Supply, H₂/He/Hg Capillary Tubes, 600 l/mm Grating", chemicals: "Hα (656.3nm), Hβ (486.1nm), Hγ (434.0nm) plasma glow tubes", graphics: "Interactive Bohr n=6→2 transition ladder & Rydberg R_H fit" },
  { id: "T1L15", title: "1.15 · Atomic Mass Units (²⁸Si Avogadro Sphere)", machines: ["balance"], glassware: "Quartz Weighing Boat, Antistatic U-Ionizer Bar, PTFE Forceps", chemicals: "Ultra-pure ²⁸Si single-crystal sphere & ¹²C reference standard", graphics: "Diamond-cubic Si unit cell (8 atoms/cell) & amu-to-gram bridge" },
  { id: "T1L16", title: "1.16 · The Periodic Law (Period 3 Oxides)", machines: ["ph_meter"], glassware: "6× 50mL Beakers, Stir Rods, uPlace pH Electrode, Dropper Bottle", chemicals: "Na₂O, MgO, Al₂O₃, SiO₂, P₄O₁₀, SO₂ + Universal Indicator rainbow", graphics: "Live pH/mV trace & Period 3 Basic → Amphoteric → Acidic trend" },
  { id: "T1L17", title: "1.17 · Metallic Nature (4-Point Probe & Thermal)", machines: ["hotplate"], glassware: "Collinear 4-Point Spring Probe, DC Source, Dual Thermocouples", chemicals: "Cu, Al, Fe, Pb, Sn machined rods (IR thermal wave shader)", graphics: "Fermi electron-sea animation & Wiedemann-Franz σ vs κ chart" },
  { id: "T1L18", title: "1.18 · Non-Metal Logic (Sulfur & Iodine Allotropes)", machines: ["hotplate", "muffle_furnace"], glassware: "Pyrex Tubes, Ice Cold-Finger Condenser, Watch Glass, Crucible", chemicals: "S₈ crown rings → monoclinic needles → S_λ polymer; I₂ violet plume", graphics: "Allotrope phase transition timeline & S₈ ring vs chain viewer" },
  { id: "T1L19", title: "1.19 · The Staircase (Semiconductor Bandgap)", machines: ["hotplate"], glassware: "Ceramic Heating Stage, Copper Wafer Clips, Type-K Probe, DMM", chemicals: "Intrinsic Si (Eg 1.12 eV) & Ge (Eg 0.67 eV) single-crystal wafers", graphics: "Valence→Conduction band diagram & Arrhenius ln(σ) vs 1000/T plot" },
  { id: "T1L20", title: "1.20 · Valence Stability (Noble Gas Breakdown)", machines: ["spectrophotometer"], glassware: "5× Micrometer Parallel-Plate Gas Cells, 0–10kV Variable Supply", chemicals: "He (pink), Ne (orange-red), Ar (violet), Kr, Xe Townsend plasma arc", graphics: "Paschen breakdown curve V_B vs (p·d) & First Ionization Energy chart" },
  { id: "T1L21", title: "1.21 · Group 17 Kinetics (Halogen Displacement)", machines: ["vortex_mixer", "centrifuge"], glassware: "6× Screw-Cap Test Tubes in Rack, P1000 Pipette, Pasteur Droppers", chemicals: "Aq NaCl/NaBr/NaI + Cl₂/Br₂/I₂ + Cyclohexane (Biphasic color shader)", graphics: "3×3 Halogen Redox Displacement Matrix & organic phase color card" },
  { id: "T1L22", title: "1.22 · Carbon Catenation (Diamond, Graphite, HOPG)", machines: ["muffle_furnace", "balance"], glassware: "Alumina Combustion Boats, Quartz Tube, O₂ Flowmeter, CO₂ Trap", chemicals: "Synthetic Diamond, Flake Graphite, HOPG Graphene (1000°C glow)", graphics: "sp³ tetrahedral vs sp² π-cloud overlay & 10⁴× anisotropy ratio" },
  { id: "T1L23", title: "1.23 · Hydrogen Fundamentals (Hofmann Electrolysis)", machines: ["ph_meter"], glassware: "Dual 50mL Graduated Electrolysis Arms w/ PTFE Stopcocks, Pt Foils", chemicals: "0.5M H₂SO₄ w/ 2:1 H₂/O₂ micro-bubble streams & splint pop flash", graphics: "Live V(H₂):V(O₂) = 2:1 meniscus tracker & Faraday Q = I·t solver" },
  { id: "T1L24", title: "1.24 · Tier 1 Mastery Exam (3 Unknown Elements)", machines: ["balance", "spectrophotometer", "hotplate"], glassware: "Pycnometer, Pt Flame Loop, 4-Point Probe, 3× 50mL Beakers", chemicals: "Blind Unknowns A, B, C (Metallic luster, flame color & HCl gas fizz)", graphics: "Zero-hint Forensic Dossier (ρ, λ_max, σ, HCl rxn → Element ID)" }
];

export class PhoneCompanionController {
  constructor(scene, camera, options = {}) {
    this.scene = scene;
    this.camera = camera;
    this.options = Object.assign({
      onTriggerStepAction: null,
      onHighlightTarget: null,
      onSelectLesson: null,
      onExitLessonMode: null
    }, options);

    this.isOpen = false;
    this.activeTab = "guide"; // "guide" | "ble" | "notebook" | "tier1"
    this.pairingCode = this._getOrCreatePairingCode();
    this.remotePeerConnected = false;
    this._lastRenderedLessonId = null;

    // 3D Bench Prop (Single-instance Sketchfab iPhone 14 Pro on brushed-titanium MagSafe stand)
    this.benchPhoneGroup = new THREE.Group();
    this.benchPhoneGroup.name = "Teaching_Bench_iPhone_Group";
    this.scene.add(this.benchPhoneGroup);

    // Voice & TTS State
    this.audioEl = new Audio();
    this.isSpeaking = false;
    this.voiceMuted = false;

    // Current Telemetry & Lesson Snapshot
    this.state = {
      lessonId: "T1L1",
      lessonTitle: "T1L1 · Chemistry in Context: CuSO₄·5H₂O Dissolution",
      roomName: "CR-01 · Active Matter Teaching Lab",
      stepIndex: 0,
      totalSteps: 4,
      stepTitle: "Step 1 · Verify Benchtop Electrical Continuity",
      stepInstruction: "Click the pulsing NEMA 5-15P plug or the Analytical Balance power button (Btn_Power) to energize the station.",
      ttsText: "Welcome to the ChemMate Interactive Teaching Lab. Notice the target control indicator on the instrument. Click it directly in 3D to begin.",
      audioStemUrl: "./assets/audio/t1l1_intro.mp3",
      targetMeshName: "Btn_Power",
      targetMachineName: "Analytical Balance (Mettler XPE205)",
      telemetry: {
        primaryLabel: "BALANCE MASS",
        primaryVal: "0.0000 g",
        secondaryLabel: "SOLUTION TEMP",
        secondaryVal: "21.0 °C",
        tertiaryLabel: "STIRRER / OPTICS",
        tertiaryVal: "0 RPM",
        status: "BLE 5.2 LINKED"
      },
      observations: [],
      plotData: {
        title: "Temperature / Kinetics Curve",
        xLabel: "Time (s)",
        yLabel: "Value",
        points: [
          { x: 0, y: 21.0 },
          { x: 30, y: 20.1 },
          { x: 60, y: 19.4 },
          { x: 90, y: 19.2 }
        ]
      },
      verificationQuestion: {
        prompt: "Verify Stoichiometric Moles of 5.0012 g CuSO₄·5H₂O (MW = 249.68 g/mol):",
        expected: "0.0200",
        unit: "mol",
        verified: false
      }
    };

    this._initSyncBus();
    this._buildDOMOverlay();
    this._load3DBenchPhoneAndQR();
  }

  _getOrCreatePairingCode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("code")) return params.get("code").toUpperCase();
    const saved = sessionStorage.getItem("chemmate_pairing_code");
    if (saved) return saved;
    const code = "CM-" + Math.floor(1000 + Math.random() * 9000);
    sessionStorage.setItem("chemmate_pairing_code", code);
    return code;
  }

  _initSyncBus() {
    try {
      this.bus = new BroadcastChannel("chemmate_companion_sync_v1");
      this.bus.onmessage = (ev) => {
        const msg = ev.data;
        if (!msg || typeof msg !== "object") return;
        if (msg.type === "COMPANION_HELLO") {
          this.remotePeerConnected = true;
          this._renderHUD();
          this._broadcastState();
        } else if (msg.type === "COMPANION_ACTION") {
          if (msg.action === "perform_step" && this.options.onTriggerStepAction) {
            this.options.onTriggerStepAction();
          } else if (msg.action === "highlight_target" && this.options.onHighlightTarget) {
            this.options.onHighlightTarget();
          } else if (msg.action === "verify_calc") {
            this.verifyStudentCalculation(msg.value);
          } else if (msg.action === "select_lesson" && msg.lessonId && this.options.onSelectLesson) {
            this.options.onSelectLesson(msg.lessonId);
          }
        }
      };
    } catch (e) {
      this.bus = null;
    }

    window.addEventListener("storage", (ev) => {
      if (ev.key === "chemmate_companion_cmd" && ev.newValue) {
        try {
          const cmd = JSON.parse(ev.newValue);
          if (cmd.action === "perform_step" && this.options.onTriggerStepAction) {
            this.options.onTriggerStepAction();
          } else if (cmd.action === "highlight_target" && this.options.onHighlightTarget) {
            this.options.onHighlightTarget();
          } else if (cmd.action === "verify_calc") {
            this.verifyStudentCalculation(cmd.value);
          } else if (cmd.action === "select_lesson" && cmd.lessonId && this.options.onSelectLesson) {
            this.options.onSelectLesson(cmd.lessonId);
          }
        } catch (_) {}
      }
    });
  }

  _broadcastState() {
    const payload = {
      type: "LAB_STATE_SYNC",
      pairingCode: this.pairingCode,
      timestamp: Date.now(),
      state: this.state
    };
    if (this.bus) {
      this.bus.postMessage(payload);
    }
    try {
      localStorage.setItem("chemmate_companion_state", JSON.stringify(payload));
    } catch (_) {}
  }

  _load3DBenchPhoneAndQR() {
    // Positioned cleanly on the Analytical / Teaching Bench (BENCH_Y = 0.90 m)
    this.benchPhoneGroup.position.set(-0.58, 0.90, -3.88);

    // 1. Sleek Machined Anodized-Aluminum MagSafe Stand (Zero floating 3D QR plaques)
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0xaab2be,
      roughness: 0.28,
      metalness: 0.88,
      name: "Mat_MagSafe_Titanium_Stand"
    });
    const darkRubberMat = new THREE.MeshStandardMaterial({
      color: 0x1e2024,
      roughness: 0.82,
      metalness: 0.08,
      name: "Mat_MagSafe_Silicone_Pad"
    });

    // Weighted circular foot resting flush on BENCH_Y = 0.90 (local y = 0..0.008)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.050, 0.056, 0.007, 32), titaniumMat);
    base.position.set(0, 0.0045, -0.012);
    this.benchPhoneGroup.add(base);

    const basePad = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.056, 0.001, 32), darkRubberMat);
    basePad.position.set(0, 0.0005, -0.012);
    this.benchPhoneGroup.add(basePad);

    // Angled machined neck joining base (0, 0.008, -0.032) cleanly into rear MagSafe puck (0, 0.092, -0.004)
    const stem = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.088, 0.008), titaniumMat);
    stem.position.set(0, 0.050, -0.018);
    stem.rotation.x = Math.atan2(0.028, 0.084);
    this.benchPhoneGroup.add(stem);

    // Phone holder tilted ergonomically toward the bench operator
    const phoneHolder = new THREE.Group();
    phoneHolder.position.set(0, 0.095, 0.005);
    phoneHolder.rotation.x = -0.26;
    this.benchPhoneGroup.add(phoneHolder);

    // Rear circular MagSafe magnetic charging puck behind phone back
    const magPuck = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.006, 32), titaniumMat);
    magPuck.rotation.x = Math.PI / 2;
    magPuck.position.set(0, 0, -0.008);
    phoneHolder.add(magPuck);

    // High-DPI 512x1024 Live Swiss Archival Paper CanvasTexture (`flipY = false` per cad_validator)
    this.screenCanvas = document.createElement("canvas");
    this.screenCanvas.width = 512;
    this.screenCanvas.height = 1024;
    this.screenTex = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTex.colorSpace = THREE.SRGBColorSpace;
    this.screenTex.flipY = false;
    this.screenTex.anisotropy = 4;
    this._draw3DPhoneScreenTexture();

    // Procedural fallback screen + body while GLB streams (both hidden on GLB mount)
    const fallbackGeo = new THREE.PlaneGeometry(0.068, 0.142);
    const fbUv = fallbackGeo.attributes.uv;
    for (let i = 0; i < fbUv.count; i++) {
      fbUv.setY(i, 1.0 - fbUv.getY(i));
    }
    fbUv.needsUpdate = true;

    const screenMesh = new THREE.Mesh(
      fallbackGeo,
      new THREE.MeshBasicMaterial({ map: this.screenTex, toneMapped: false })
    );
    screenMesh.position.set(0, 0, 0.0055);
    phoneHolder.add(screenMesh);

    const bodyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.074, 0.148, 0.009),
      new THREE.MeshStandardMaterial({ color: 0x1c1e22, roughness: 0.25, metalness: 0.85 })
    );
    phoneHolder.add(bodyMesh);

    // Load Sketchfab iPhone 14 Pro GLB — strip Copy B duplicate nodes (`Object_16..Object_26`)
    const loader = new GLTFLoader();
    loader.load(
      "./assets/models/iphone_14_pro.glb?v=20261116-swiss1",
      (gltf) => {
        if (!gltf || !gltf.scene) return;
        const model = gltf.scene;

        // 1. Prune upside-down duplicate twin (`Object_16` through `Object_26`) BEFORE measuring Box3
        const duplicateNodes = [];
        model.traverse((child) => {
          if (child.name && /^Object_(1[6-9]|2\d)$/.test(child.name)) {
            duplicateNodes.push(child);
          }
        });
        duplicateNodes.forEach((node) => {
          if (node.parent) node.parent.remove(node);
        });

        // 2. Orient upright: local +Y screen faces +Z toward user, local -Z Dynamic Island faces +Y up
        model.rotation.x = Math.PI / 2;
        model.updateMatrixWorld(true);

        // 3. Measure Box3 strictly on remaining single phone & scale height to 0.148 m
        const rawBox = new THREE.Box3().setFromObject(model);
        const rawSize = rawBox.getSize(new THREE.Vector3());
        const scale = 0.148 / Math.max(rawSize.y, 0.001);
        model.scale.setScalar(scale);
        model.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(model);
        const center = scaledBox.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // 4. Remap screen UVs cleanly to [0,1]x[0,1] paired with flipY = false & elevate Dynamic Island
        model.traverse((child) => {
          if (!child.isMesh) return;
          const matName = child.material?.name || "";
          if (matName === "screen" || child.name === "Object_6") {
            const geo = child.geometry.clone();
            const pos = geo.attributes.position;
            let minX = Infinity, maxX = -Infinity;
            let minZ = Infinity, maxZ = -Infinity;
            for (let i = 0; i < pos.count; i++) {
              const vx = pos.getX(i);
              const vz = pos.getZ(i);
              if (vx < minX) minX = vx;
              if (vx > maxX) maxX = vx;
              if (vz < minZ) minZ = vz;
              if (vz > maxZ) maxZ = vz;
            }
            const spanX = Math.max(maxX - minX, 1e-6);
            const spanZ = Math.max(maxZ - minZ, 1e-6);
            let uvAttr = geo.attributes.uv;
            if (!uvAttr) {
              uvAttr = new THREE.BufferAttribute(new Float32Array(pos.count * 2), 2);
              geo.setAttribute("uv", uvAttr);
            }
            for (let i = 0; i < pos.count; i++) {
              const u = (pos.getX(i) - minX) / spanX;
              const v = (pos.getZ(i) - minZ) / spanZ;
              uvAttr.setXY(i, u, v);
            }
            uvAttr.needsUpdate = true;
            child.geometry = geo;
            child.material = new THREE.MeshBasicMaterial({
              map: this.screenTex,
              toneMapped: false
            });
          } else if (matName === "island" || child.name === "Object_8") {
            // Sit cleanly proud of screen plane along local +Y normal to eliminate Z-fighting
            child.position.y += 0.0003;
          }
        });

        phoneHolder.add(model);
        bodyMesh.visible = false;
        screenMesh.visible = false;
      },
      undefined,
      () => {}
    );

    // Compact interactive hitbox strictly hugging the single iPhone + MagSafe stand
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.20, 0.11),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.set(0, 0.10, 0);
    hitBox.userData = {
      label: "Click to Open ChemMate iPhone Companion",
      toggle: () => this.toggleOpen(true)
    };
    this.benchPhoneGroup.add(hitBox);
    this.interactiveHitBox = hitBox;
  }

  _drawFinderQR(ctx, x, y, size) {
    ctx.fillStyle = "#FBF9F4";
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = "#141413";
    const cell = Math.floor(size / 21);
    const drawFinder = (fx, fy) => {
      ctx.fillStyle = "#141413";
      ctx.fillRect(fx, fy, 7 * cell, 7 * cell);
      ctx.fillStyle = "#FBF9F4";
      ctx.fillRect(fx + cell, fy + cell, 5 * cell, 5 * cell);
      ctx.fillStyle = "#141413";
      ctx.fillRect(fx + 2 * cell, fy + 2 * cell, 3 * cell, 3 * cell);
    };
    drawFinder(x + cell, y + cell);
    drawFinder(x + size - 8 * cell, y + cell);
    drawFinder(x + cell, y + size - 8 * cell);

    let seed = 0;
    for (let i = 0; i < this.pairingCode.length; i++) {
      seed = (seed * 31 + this.pairingCode.charCodeAt(i)) & 0xffff;
    }
    ctx.fillStyle = "#141413";
    for (let r = 0; r < 19; r++) {
      for (let c = 0; c < 19; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c > 11) || (r > 11 && c < 8)) continue;
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        if (seed % 3 === 0) {
          ctx.fillRect(x + (c + 1) * cell, y + (r + 1) * cell, cell, cell);
        }
      }
    }
  }

  _drawRegistrationPlus(ctx, cx, cy, arm = 7) {
    ctx.save();
    ctx.strokeStyle = "#8C8476";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - arm, cy);
    ctx.lineTo(cx + arm, cy);
    ctx.moveTo(cx, cy - arm);
    ctx.lineTo(cx, cy + arm);
    ctx.stroke();
    ctx.restore();
  }

  _draw3DPhoneScreenTexture() {
    if (!this.screenCanvas) return;
    const ctx = this.screenCanvas.getContext("2d");
    const W = 512;
    const H = 1024;

    // Archival Swiss Paper ground
    ctx.fillStyle = "#F4F1EA";
    ctx.fillRect(0, 0, W, H);

    // Subtle paper grain rules & outer perimeter inset
    ctx.strokeStyle = "#D6D0C4";
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 22, W - 36, H - 44);

    // Safe area below Dynamic Island (top 76px reserved for physical island mesh)
    // Header Row: [+] red logo + ChemMate + LIVE BLE dot
    ctx.fillStyle = "#D61F1F";
    ctx.fillRect(32, 92, 34, 34);
    ctx.fillStyle = "#FBF9F4";
    ctx.fillRect(46, 100, 6, 18);
    ctx.fillRect(40, 106, 18, 6);

    ctx.fillStyle = "#141413";
    ctx.font = "700 28px 'Space Grotesk', 'IBM Plex Sans', sans-serif";
    ctx.fillText("ChemMate", 78, 118);

    // Emerald LIVE BLE pill on top right
    ctx.fillStyle = "#E6F4EC";
    ctx.fillRect(334, 94, 146, 30);
    ctx.strokeStyle = "#16794B";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(334, 94, 146, 30);
    ctx.fillStyle = "#16794B";
    ctx.beginPath();
    ctx.arc(352, 109, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "700 16px 'IBM Plex Mono', monospace";
    ctx.fillText("LIVE BLE", 366, 115);

    // Hairline divider with corner registration marks
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(32, 142);
    ctx.lineTo(W - 32, 142);
    ctx.stroke();
    this._drawRegistrationPlus(ctx, 32, 156, 6);
    this._drawRegistrationPlus(ctx, W - 32, 156, 6);

    // Sub-kicker with Lesson ID + Step
    ctx.fillStyle = "#5C564C";
    ctx.font = "700 17px 'IBM Plex Mono', monospace";
    ctx.fillText(`${this.state.lessonId || "T1L1"}  ·  STEP ${(this.state.stepIndex || 0) + 1} / ${this.state.totalSteps || 4}`, 50, 162);

    // Primary Tabular Readout Card (#FBF9F4)
    ctx.fillStyle = "#FBF9F4";
    ctx.fillRect(32, 182, W - 64, 232);
    ctx.strokeStyle = "#D6D0C4";
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 182, W - 64, 232);
    // Crimson top accent stripe
    ctx.fillStyle = "#D61F1F";
    ctx.fillRect(32, 182, W - 64, 5);

    ctx.fillStyle = "#5C564C";
    ctx.font = "700 18px 'IBM Plex Mono', monospace";
    ctx.fillText(String(this.state.telemetry?.primaryLabel || "BALANCE MASS").slice(0, 26), 54, 224);

    ctx.fillStyle = "#141413";
    ctx.font = "700 54px 'IBM Plex Mono', monospace";
    ctx.fillText(String(this.state.telemetry?.primaryVal || "0.0000 g").slice(0, 14), 54, 290);

    // Secondary row inside primary card
    ctx.strokeStyle = "#EAE3D5";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(54, 318);
    ctx.lineTo(W - 54, 318);
    ctx.stroke();

    ctx.fillStyle = "#5C564C";
    ctx.font = "600 15px 'IBM Plex Mono', monospace";
    ctx.fillText(String(this.state.telemetry?.secondaryLabel || "TEMP").slice(0, 18), 54, 350);
    ctx.fillText(String(this.state.telemetry?.tertiaryLabel || "STATUS").slice(0, 18), 274, 350);

    ctx.fillStyle = "#16794B";
    ctx.font = "700 22px 'IBM Plex Mono', monospace";
    ctx.fillText(String(this.state.telemetry?.secondaryVal || "21.0 °C").slice(0, 15), 54, 386);
    ctx.fillStyle = "#141413";
    ctx.fillText(String(this.state.telemetry?.tertiaryVal || "READY").slice(0, 15), 274, 386);

    // Red Target Control Banner
    ctx.fillStyle = "#FBECEC";
    ctx.fillRect(32, 434, W - 64, 158);
    ctx.strokeStyle = "#D61F1F";
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 434, W - 64, 158);
    ctx.fillStyle = "#D61F1F";
    ctx.fillRect(32, 434, 8, 158);

    ctx.fillStyle = "#D61F1F";
    ctx.font = "700 16px 'IBM Plex Mono', monospace";
    ctx.fillText("TARGET 3D CONTROL", 56, 468);

    ctx.fillStyle = "#141413";
    ctx.font = "700 32px 'IBM Plex Mono', monospace";
    ctx.fillText(String(this.state.targetMeshName || "Btn_Power").slice(0, 20), 56, 514);

    ctx.fillStyle = "#5C564C";
    ctx.font = "600 18px 'IBM Plex Sans', sans-serif";
    ctx.fillText(String(this.state.targetMachineName || "Instrument Station").slice(0, 34), 56, 554);

    // Live Curve Card (#FBF9F4)
    ctx.fillStyle = "#FBF9F4";
    ctx.fillRect(32, 616, W - 64, 290);
    ctx.strokeStyle = "#D6D0C4";
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 616, W - 64, 290);

    ctx.fillStyle = "#141413";
    ctx.font = "700 17px 'IBM Plex Mono', monospace";
    ctx.fillText("EMPIRICAL CURVE TRACE", 54, 650);

    const gx = 68, gy = 674, gw = 384, gh = 198;
    ctx.strokeStyle = "#EAE3D5";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = gy + (gh / 4) * i;
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.lineTo(gx + gw, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy + gh);
    ctx.lineTo(gx + gw, gy + gh);
    ctx.stroke();

    const pts = this.state.plotData?.points || [];
    if (pts.length >= 2) {
      const xs = pts.map((p) => p.x);
      const ys = pts.map((p) => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs, minX + 1);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys, minY + 0.1);

      ctx.strokeStyle = "#D61F1F";
      ctx.lineWidth = 4;
      ctx.beginPath();
      pts.forEach((p, idx) => {
        const px = gx + 12 + ((p.x - minX) / (maxX - minX)) * (gw - 24);
        const py = gy + gh - 12 - ((p.y - minY) / (maxY - minY)) * (gh - 24);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      pts.forEach((p) => {
        const px = gx + 12 + ((p.x - minX) / (maxX - minX)) * (gw - 24);
        const py = gy + gh - 12 - ((p.y - minY) / (maxY - minY)) * (gh - 24);
        ctx.fillStyle = "#FBF9F4";
        ctx.strokeStyle = "#D61F1F";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }

    // Footer + bottom registration marks
    this._drawRegistrationPlus(ctx, 40, 944, 6);
    this._drawRegistrationPlus(ctx, W - 40, 944, 6);
    ctx.fillStyle = "#5C564C";
    ctx.font = "600 15px 'IBM Plex Mono', monospace";
    ctx.fillText(`PAIR: ${this.pairingCode}  ·  ARCHIVAL LAB OS`, 64, 950);

    if (this.screenTex) this.screenTex.needsUpdate = true;
  }

  _renderLessonDiagramSVG(state) {
    const id = String(state?.lessonId || "T1L1").toUpperCase();
    if (id === "T4L24") {
      return `
        <svg viewBox="0 0 280 96" class="hud-diagram-svg" role="img" aria-label="UV-Vis 590 nm Beer-Lambert Cuvette Diagram">
          <rect x="6" y="6" width="268" height="84" fill="#FBF9F4" stroke="#D6D0C4" stroke-width="1"/>
          <text x="14" y="20" font-family="IBM Plex Mono, monospace" font-size="8" font-weight="700" fill="#5C564C">FIG 02 · BEER-LAMBERT λ = 590 NM</text>
          <!-- Optical Source & Beam -->
          <rect x="18" y="42" width="26" height="22" fill="#141413"/>
          <text x="23" y="56" font-family="IBM Plex Mono, monospace" font-size="7" font-weight="700" fill="#FBF9F4">SRC</text>
          <line x1="44" y1="53" x2="108" y2="53" stroke="#D61F1F" stroke-width="2" stroke-dasharray="4 2"/>
          <line x1="152" y1="53" x2="218" y2="53" stroke="#D61F1F" stroke-width="1.4" stroke-opacity="0.55"/>
          <!-- 10mm Quartz Cuvette -->
          <rect x="108" y="30" width="44" height="46" fill="#EDE9FE" stroke="#141413" stroke-width="1.6"/>
          <rect x="111" y="40" width="38" height="33" fill="#7C3AED" fill-opacity="0.32"/>
          <line x1="108" y1="81" x2="152" y2="81" stroke="#141413" stroke-width="1"/>
          <text x="115" y="88" font-family="IBM Plex Mono, monospace" font-size="7" fill="#141413">b=1.0cm</text>
          <!-- Photodiode Detector -->
          <rect x="218" y="40" width="34" height="26" fill="#F4F1EA" stroke="#141413" stroke-width="1.5"/>
          <text x="223" y="56" font-family="IBM Plex Mono, monospace" font-size="7" font-weight="700" fill="#141413">DET</text>
          <!-- Red Leader Pins -->
          <circle cx="130" cy="53" r="3" fill="#D61F1F"/>
          <polyline points="130,53 156,28 176,28" fill="none" stroke="#D61F1F" stroke-width="1.2"/>
          <rect x="176" y="21" width="54" height="13" fill="#D61F1F"/>
          <text x="180" y="30" font-family="IBM Plex Mono, monospace" font-size="7.5" font-weight="700" fill="#FBF9F4">CV+ + OH-</text>
        </svg>`;
    }
    if (id === "PHARMA_QC") {
      return `
        <svg viewBox="0 0 280 96" class="hud-diagram-svg" role="img" aria-label="USP 701 Basket Disintegration Diagram">
          <rect x="6" y="6" width="268" height="84" fill="#FBF9F4" stroke="#D6D0C4" stroke-width="1"/>
          <text x="14" y="20" font-family="IBM Plex Mono, monospace" font-size="8" font-weight="700" fill="#5C564C">FIG 03 · USP &lt;701&gt; 37.0°C BATH</text>
          <!-- 1000mL Vessel -->
          <path d="M54 30 L54 80 Q54 84 58 84 L126 84 Q130 84 130 80 L130 30" fill="#E0F2FE" fill-opacity="0.45" stroke="#141413" stroke-width="1.6"/>
          <line x1="56" y1="42" x2="128" y2="42" stroke="#0284C7" stroke-width="1.2" stroke-dasharray="3 2"/>
          <!-- Reciprocating Basket Rack & 10 Mesh -->
          <rect x="68" y="35" width="48" height="36" fill="none" stroke="#141413" stroke-width="1.4"/>
          <line x1="78" y1="35" x2="78" y2="71" stroke="#141413" stroke-width="1"/>
          <line x1="92" y1="35" x2="92" y2="71" stroke="#141413" stroke-width="1"/>
          <line x1="106" y1="35" x2="106" y2="71" stroke="#141413" stroke-width="1"/>
          <line x1="68" y1="71" x2="116" y2="71" stroke="#D61F1F" stroke-width="2" stroke-dasharray="2 1"/>
          <circle cx="85" cy="60" r="4" fill="#FBF9F4" stroke="#141413" stroke-width="1.2"/>
          <circle cx="99" cy="60" r="4" fill="#FBF9F4" stroke="#141413" stroke-width="1.2"/>
          <!-- Stroke Arrows + Callouts -->
          <line x1="36" y1="40" x2="36" y2="66" stroke="#141413" stroke-width="1.4"/>
          <polygon points="36,36 33,42 39,42" fill="#141413"/>
          <polygon points="36,70 33,64 39,64" fill="#141413"/>
          <text x="16" y="56" font-family="IBM Plex Mono, monospace" font-size="7" font-weight="700" fill="#141413">55mm</text>
          <circle cx="116" cy="71" r="3" fill="#D61F1F"/>
          <polyline points="116,71 154,54 172,54" fill="none" stroke="#D61F1F" stroke-width="1.2"/>
          <rect x="172" y="46" width="84" height="15" fill="#D61F1F"/>
          <text x="176" y="56" font-family="IBM Plex Mono, monospace" font-size="7.5" font-weight="700" fill="#FBF9F4">#10 MESH · 30 SPM</text>
          <text x="172" y="75" font-family="IBM Plex Mono, monospace" font-size="7.5" fill="#16794B" font-weight="700">PASS ≤ 15.0 MIN</text>
        </svg>`;
    }
    if (id === "T1L1") {
      return `
        <svg viewBox="0 0 280 96" class="hud-diagram-svg" role="img" aria-label="CuSO4 5H2O Octahedral Ion and Beaker Diagram">
          <rect x="6" y="6" width="268" height="84" fill="#FBF9F4" stroke="#D6D0C4" stroke-width="1"/>
          <text x="14" y="20" font-family="IBM Plex Mono, monospace" font-size="8" font-weight="700" fill="#5C564C">FIG 01 · [Cu(H₂O)₆]²⁺ COORDINATION</text>
          <!-- 100 mL Pyrex Beaker + Stir Bar -->
          <path d="M36 30 L36 80 Q36 84 40 84 L88 84 Q92 84 92 80 L92 30" fill="#BAE6FD" fill-opacity="0.45" stroke="#141413" stroke-width="1.6"/>
          <line x1="38" y1="45" x2="90" y2="45" stroke="#0284C7" stroke-width="1.5"/>
          <rect x="52" y="75" width="24" height="5" rx="2.5" fill="#FBF9F4" stroke="#141413" stroke-width="1.2"/>
          <!-- Octahedral [Cu(H2O)6]2+ complex -->
          <line x1="176" y1="30" x2="176" y2="76" stroke="#141413" stroke-width="1.2"/>
          <line x1="150" y1="53" x2="202" y2="53" stroke="#141413" stroke-width="1.2"/>
          <line x1="160" y1="38" x2="192" y2="68" stroke="#141413" stroke-width="1.1"/>
          <circle cx="176" cy="53" r="8" fill="#0284C7" stroke="#141413" stroke-width="1.3"/>
          <circle cx="176" cy="30" r="4.5" fill="#FBF9F4" stroke="#141413" stroke-width="1.2"/>
          <circle cx="176" cy="76" r="4.5" fill="#FBF9F4" stroke="#141413" stroke-width="1.2"/>
          <circle cx="150" cy="53" r="4.5" fill="#FBF9F4" stroke="#141413" stroke-width="1.2"/>
          <circle cx="202" cy="53" r="4.5" fill="#FBF9F4" stroke="#141413" stroke-width="1.2"/>
          <circle cx="160" cy="38" r="4" fill="#FBF9F4" stroke="#141413" stroke-width="1.2"/>
          <circle cx="192" cy="68" r="4" fill="#FBF9F4" stroke="#141413" stroke-width="1.2"/>
          <!-- Red Leader Callout -->
          <circle cx="176" cy="53" r="3" fill="#D61F1F"/>
          <polyline points="176,53 208,33 216,33" fill="none" stroke="#D61F1F" stroke-width="1.2"/>
          <rect x="216" y="25" width="48" height="15" fill="#D61F1F"/>
          <text x="222" y="35" font-family="IBM Plex Mono, monospace" font-size="8" font-weight="700" fill="#FBF9F4">Cu²⁺ d⁹</text>
          <text x="216" y="54" font-family="IBM Plex Mono, monospace" font-size="7.5" fill="#5C564C">ΔT -1.8°C</text>
          <text x="216" y="67" font-family="IBM Plex Mono, monospace" font-size="7.5" fill="#16794B" font-weight="700">0.400 M</text>
        </svg>`;
    }

    const t1Meta = TIER1_CURRICULUM_MANIFEST.find((m) => m.id === id);
    const shortId = id || "LAB";
    const machineTag = (t1Meta?.machines?.[0] || "BENCH").toUpperCase().slice(0, 12);
    return `
      <svg viewBox="0 0 280 96" class="hud-diagram-svg" role="img" aria-label="${shortId} Apparatus Schematic">
        <rect x="6" y="6" width="268" height="84" fill="#FBF9F4" stroke="#D6D0C4" stroke-width="1"/>
        <text x="14" y="20" font-family="IBM Plex Mono, monospace" font-size="8" font-weight="700" fill="#5C564C">${shortId} · APPARATUS SCHEMATIC</text>
        <rect x="26" y="34" width="66" height="44" fill="#F4F1EA" stroke="#141413" stroke-width="1.5"/>
        <rect x="34" y="42" width="50" height="16" fill="#141413"/>
        <text x="39" y="53" font-family="IBM Plex Mono, monospace" font-size="7" font-weight="700" fill="#FBF9F4">${machineTag}</text>
        <circle cx="46" cy="68" r="4" fill="#D61F1F"/>
        <circle cx="70" cy="68" r="4" fill="#141413"/>
        <!-- Connecting Flask + Callout -->
        <polygon points="144,32 154,32 168,78 130,78" fill="#E0F2FE" fill-opacity="0.45" stroke="#141413" stroke-width="1.5"/>
        <line x1="92" y1="53" x2="138" y2="53" stroke="#141413" stroke-width="1.2" stroke-dasharray="3 2"/>
        <circle cx="149" cy="58" r="3" fill="#D61F1F"/>
        <polyline points="149,58 176,38 190,38" fill="none" stroke="#D61F1F" stroke-width="1.2"/>
        <rect x="190" y="30" width="72" height="15" fill="#D61F1F"/>
        <text x="195" y="40" font-family="IBM Plex Mono, monospace" font-size="7.5" font-weight="700" fill="#FBF9F4">${String(state?.targetMeshName || "Btn_Start").slice(0, 11)}</text>
        <text x="190" y="60" font-family="IBM Plex Mono, monospace" font-size="7.5" fill="#5C564C">BLE 5.2 STREAM</text>
        <text x="190" y="72" font-family="IBM Plex Mono, monospace" font-size="7.5" fill="#16794B" font-weight="700">CURATED BENCH</text>
      </svg>`;
  }

  _buildDOMOverlay() {
    const container = document.createElement("div");
    container.id = "iphone-companion-hud";
    container.className = "iphone-companion-hud is-minimized";
    container.innerHTML = `
      <!-- Floating Archival Paper Summon Pill when Minimized -->
      <button id="btn-summon-iphone" class="iphone-summon-pill" title="Open ChemMate iPhone 14 Pro Companion (Key P)">
        <span class="cm-plus-badge" aria-hidden="true">+</span>
        <span class="iphone-pulse-dot"></span>
        <span>iPhone Companion</span>
        <span id="summon-telemetry-mini" class="summon-telemetry-mini">0.0000 g</span>
      </button>

      <!-- Brushed Titanium iPhone 14 Pro Bezel Wrapping Swiss Archival Paper OS -->
      <div class="iphone-shell">
        <div class="iphone-paper-screen">
          <div class="iphone-dynamic-island">
            <span class="island-led"></span>
            <span id="island-voice-status" class="island-text">Gemini 3.8 Flash · Ready</span>
          </div>

          <!-- Clean Single-Row Status Bar (Zero Wrapping or Overflow) -->
          <div class="iphone-statusbar">
            <div class="iphone-brand-row">
              <span class="cm-plus-badge" aria-hidden="true">+</span>
              <span class="iphone-wordmark">ChemMate</span>
              <span id="iphone-lesson-title" class="iphone-lesson-name">T1L1</span>
            </div>
            <div class="iphone-header-btns">
              <button id="btn-iphone-qr" class="iphone-icon-btn" type="button" title="Pair Physical Phone via QR Code">QR</button>
              <button id="btn-iphone-minimize" class="iphone-icon-btn" type="button" title="Slide iPhone Off Screen (Key P)">Hide</button>
            </div>
          </div>

          <!-- Real-Phone QR Pairing Drawer (On-Demand Only — Never in 3D Scene) -->
          <div id="iphone-qr-drawer" class="iphone-qr-drawer is-hidden">
            <div class="qr-drawer-row">
              <canvas id="hud-qr-canvas" width="92" height="92" class="hud-qr-canvas"></canvas>
              <div class="qr-drawer-info">
                <div class="qr-code-tag">PAIR CODE: <strong id="hud-pairing-code">${this.pairingCode}</strong></div>
                <p>Scan or open <a id="hud-companion-link" href="./companion.html?code=${this.pairingCode}" target="_blank">companion.html</a> to control 3D instruments from your physical iPhone.</p>
                <div id="hud-peer-status" class="qr-peer-status">● On-Screen Bench iPhone Active</div>
              </div>
            </div>
          </div>

          <!-- Single-Row 4 Editorial Tabs -->
          <div class="iphone-tabs" role="tablist">
            <button class="iphone-tab active" data-tab="guide" type="button">01 Guide</button>
            <button class="iphone-tab" data-tab="ble" type="button">02 BLE</button>
            <button class="iphone-tab" data-tab="notebook" type="button">03 Results</button>
            <button class="iphone-tab" data-tab="tier1" type="button">04 Tier 1</button>
          </div>

          <!-- TAB 1: Interactive Step Guide + Diagram + Target Card + TTS -->
          <div id="iphone-panel-guide" class="iphone-tab-panel">
            <div class="step-progress-row">
              <span id="hud-step-badge" class="hud-step-badge">STEP 1 / 4</span>
              <span id="hud-room-tag" class="hud-room-tag">CR-01 Studio</span>
            </div>
            <h4 id="hud-step-title" class="hud-step-title">Verify Benchtop Continuity</h4>
            <p id="hud-step-desc" class="hud-step-desc"></p>

            <!-- Inline Scientific Apparatus SVG Diagram -->
            <div id="hud-diagram-preview" class="hud-diagram-preview"></div>

            <!-- Target Control Action Card -->
            <div class="glowing-target-card">
              <div class="target-card-header">
                <span class="target-pin-badge" aria-hidden="true">+</span>
                <div class="target-meta-col">
                  <div class="target-label">TARGET 3D CONTROL</div>
                  <div id="hud-target-mesh" class="target-mesh-name">Btn_Power</div>
                </div>
              </div>
              <div class="target-card-actions">
                <button id="btn-hud-perform-step" class="iphone-btn-primary" type="button">ACTUATE IN 3D →</button>
                <button id="btn-hud-pulse-target" class="iphone-btn-secondary" type="button">FOCUS</button>
              </div>
            </div>

            <!-- Gemini 3.8 Flash TTS Voice Strip -->
            <div class="gemini-tts-card">
              <div class="tts-header">
                <span>GEMINI 3.8 FLASH TTS</span>
                <div class="tts-controls">
                  <button id="btn-tts-replay" class="tts-mini-btn" type="button">▶ Speak</button>
                  <button id="btn-tts-mute" class="tts-mini-btn" type="button">🔊 Unmuted</button>
                </div>
              </div>
              <div id="hud-tts-script" class="tts-script-box"></div>
            </div>
          </div>

          <!-- TAB 2: Live BLE Instrument Telemetry Stream -->
          <div id="iphone-panel-ble" class="iphone-tab-panel is-hidden">
            <div class="ble-connection-banner">
              <span class="ble-machine-label"><strong id="ble-machine-name">Analytical Balance</strong></span>
              <span class="ble-pill"><span class="ble-dot"></span>BLE 5.2 · 20 Hz</span>
            </div>
            <div class="ble-metrics-grid">
              <div class="ble-metric-box">
                <div id="ble-lbl-1" class="ble-metric-lbl">BALANCE MASS</div>
                <div id="ble-val-1" class="ble-metric-val">0.0000 g</div>
              </div>
              <div class="ble-metric-box">
                <div id="ble-lbl-2" class="ble-metric-lbl">TEMPERATURE</div>
                <div id="ble-val-2" class="ble-metric-val">21.0 °C</div>
              </div>
              <div class="ble-metric-box ble-metric-wide">
                <div id="ble-lbl-3" class="ble-metric-lbl">SECONDARY CHANNEL</div>
                <div id="ble-val-3" class="ble-metric-val">Standby · 0 RPM</div>
              </div>
            </div>
            <div class="ble-remote-actions">
              <button id="btn-ble-actuate" class="iphone-btn-primary" type="button" style="width:100%">ACTUATE IN 3D → (<span id="ble-btn-name">Btn_Power</span>)</button>
            </div>
          </div>

          <!-- TAB 3: Archival Observation Notebook, Plotter & Verification -->
          <div id="iphone-panel-notebook" class="iphone-tab-panel is-hidden">
            <div class="notebook-plot-wrap">
              <div id="notebook-plot-title" class="notebook-sec-title">EMPIRICAL CURVE TRACE</div>
              <canvas id="iphone-plot-canvas" width="296" height="128" class="iphone-plot-canvas"></canvas>
            </div>

            <div class="notebook-log-wrap">
              <div class="notebook-sec-title">RECORDED OBSERVATIONS</div>
              <div id="iphone-observations-list" class="iphone-observations-list"></div>
            </div>

            <div class="notebook-verify-card">
              <div id="verify-prompt" class="verify-prompt">Verify stoichiometric calculation:</div>
              <div class="verify-input-row">
                <input id="verify-input" type="text" placeholder="Enter value..." class="verify-input" />
                <span id="verify-unit" class="verify-unit">mol</span>
                <button id="btn-verify-submit" class="iphone-btn-primary" type="button">Verify</button>
              </div>
              <div id="verify-feedback" class="verify-feedback"></div>
            </div>
          </div>

          <!-- TAB 4: Complete Tier 1 (All 24 Labs) Editorial Matrix -->
          <div id="iphone-panel-tier1" class="iphone-tab-panel is-hidden">
            <div class="tier1-header-note">
              <strong>TIER 1 · ATOMS &amp; ELEMENTS (24 MODULES)</strong> — Select any experiment to load its curated 3D bench, glassware, and reagents:
            </div>
            <div id="iphone-tier1-list" class="iphone-tier1-list"></div>
          </div>

          <!-- Home Indicator Bar -->
          <div class="iphone-home-bar-wrap">
            <div class="iphone-home-bar"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    this.hudEl = container;

    // Draw HUD QR code in archival ink
    const qrCanvas = container.querySelector("#hud-qr-canvas");
    if (qrCanvas) {
      this._drawFinderQR(qrCanvas.getContext("2d"), 4, 4, 84);
    }

    // Bind UI Events
    container.querySelector("#btn-summon-iphone").addEventListener("click", () => this.toggleOpen(true));
    container.querySelector("#btn-iphone-minimize").addEventListener("click", () => this.toggleOpen(false));
    container.querySelector("#btn-iphone-qr").addEventListener("click", () => {
      container.querySelector("#iphone-qr-drawer").classList.toggle("is-hidden");
    });

    container.querySelectorAll(".iphone-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.switchTab(btn.getAttribute("data-tab"));
      });
    });

    container.querySelector("#btn-hud-pulse-target").addEventListener("click", () => {
      if (this.options.onHighlightTarget) this.options.onHighlightTarget();
    });

    const triggerStep = () => {
      if (this.options.onTriggerStepAction) this.options.onTriggerStepAction();
    };
    container.querySelector("#btn-hud-perform-step").addEventListener("click", triggerStep);
    container.querySelector("#btn-ble-actuate").addEventListener("click", triggerStep);

    container.querySelector("#btn-tts-replay").addEventListener("click", () => {
      this.speakCurrentStep(true);
    });
    container.querySelector("#btn-tts-mute").addEventListener("click", (e) => {
      this.voiceMuted = !this.voiceMuted;
      if (this.voiceMuted) this.stopSpeech();
      e.currentTarget.textContent = this.voiceMuted ? "🔇 Muted" : "🔊 Unmuted";
    });

    container.querySelector("#btn-verify-submit").addEventListener("click", () => {
      const val = container.querySelector("#verify-input").value;
      this.verifyStudentCalculation(val);
    });

    // Populate Tier 1 24-Lab List in Archival Editorial Cards
    const t1List = container.querySelector("#iphone-tier1-list");
    t1List.innerHTML = TIER1_CURRICULUM_MANIFEST.map((item, idx) => {
      const num = String(idx + 1).padStart(2, "0");
      return `
        <div class="tier1-card" data-lesson="${item.id}">
          <div class="tier1-card-top">
            <span class="tier1-num-badge">${num}</span>
            <strong class="tier1-card-title">${item.title}</strong>
            <button class="tier1-load-btn" data-load-lesson="${item.id}" type="button" title="Load ${item.id} on 3D Bench">→</button>
          </div>
          <div class="tier1-meta"><span>MACHINES:</span> ${item.machines.join(", ")}</div>
          <div class="tier1-meta"><span>GLASSWARE:</span> ${item.glassware}</div>
          <div class="tier1-meta"><span>REAGENTS:</span> ${item.chemicals}</div>
        </div>
      `;
    }).join("");

    t1List.querySelectorAll("[data-load-lesson]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const lessonId = e.currentTarget.getAttribute("data-load-lesson");
        if (this.options.onSelectLesson) {
          this.options.onSelectLesson(lessonId);
          this.switchTab("guide");
        }
      });
    });

    // Keyboard shortcut `KeyP` to pull iPhone on/off screen anytime
    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyP" && document.activeElement?.tagName !== "INPUT") {
        this.toggleOpen(!this.isOpen);
      }
    });

    this._renderHUD();
  }

  toggleOpen(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    if (this.hudEl) {
      this.hudEl.classList.toggle("is-minimized", !this.isOpen);
    }
    labAudio.playButtonClick();
    if (this.isOpen) {
      this._drawPlotCanvas();
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    if (!this.hudEl) return;
    this.hudEl.querySelectorAll(".iphone-tab").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-tab") === tabName);
    });
    ["guide", "ble", "notebook", "tier1"].forEach((t) => {
      const panel = this.hudEl.querySelector(`#iphone-panel-${t}`);
      if (panel) panel.classList.toggle("is-hidden", t !== tabName);
    });
    if (tabName === "notebook") {
      this._drawPlotCanvas();
    }
  }

  updateLessonState(partialState, options = { autoPopup: false, speak: false }) {
    this.state = Object.assign({}, this.state, partialState);
    if (partialState.telemetry) {
      this.state.telemetry = Object.assign({}, this.state.telemetry, partialState.telemetry);
    }
    this._draw3DPhoneScreenTexture();
    this._renderHUD();
    this._broadcastState();

    if (options.autoPopup && !this.remotePeerConnected) {
      this.toggleOpen(true);
    }
    if (options.speak) {
      this.speakCurrentStep(false);
    }
  }

  speakCurrentStep(forcePlay = false) {
    if (this.voiceMuted && !forcePlay) return;
    this.stopSpeech();

    const island = this.hudEl?.querySelector("#island-voice-status");
    if (island) island.textContent = "Speaking · Gemini 3.8";

    const finishSpeaking = () => {
      this.isSpeaking = false;
      if (island) island.textContent = "Gemini 3.8 Flash · Ready";
    };

    if (this.state.audioStemUrl) {
      this.audioEl.src = this.state.audioStemUrl;
      this.audioEl.onended = finishSpeaking;
      this.audioEl.onerror = () => this._speakWebSpeechFallback(finishSpeaking);
      this.isSpeaking = true;
      this.audioEl.play().catch(() => {
        this._speakWebSpeechFallback(finishSpeaking);
      });
    } else {
      this._speakWebSpeechFallback(finishSpeaking);
    }
  }

  _speakWebSpeechFallback(onDone) {
    if ("speechSynthesis" in window && this.state.ttsText) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(this.state.ttsText);
        utter.rate = 1.02;
        utter.onend = onDone;
        utter.onerror = onDone;
        this.isSpeaking = true;
        window.speechSynthesis.speak(utter);
        return;
      } catch (_) {}
    }
    setTimeout(onDone, 1500);
  }

  stopSpeech() {
    try {
      this.audioEl.pause();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } catch (_) {}
    this.isSpeaking = false;
  }

  verifyStudentCalculation(rawVal) {
    const q = this.state.verificationQuestion;
    if (!q) return;
    const cleaned = String(rawVal || "").trim();
    const num = parseFloat(cleaned);
    const exp = parseFloat(q.expected);
    const isMatch = !isNaN(num) && !isNaN(exp)
      ? Math.abs(num - exp) <= Math.max(0.005, Math.abs(exp) * 0.05)
      : cleaned.toLowerCase() === String(q.expected).toLowerCase();

    const fb = this.hudEl?.querySelector("#verify-feedback");
    if (isMatch) {
      q.verified = true;
      if (fb) {
        fb.textContent = `✓ PASS (${q.expected} ${q.unit}) — Synced to ChemMate Gradebook.`;
        fb.style.color = "#16794B";
      }
      if (!this.state.observations.includes(`✓ Verified Result: ${q.expected} ${q.unit}`)) {
        this.state.observations.push(`✓ Verified Result: ${q.expected} ${q.unit}`);
      }
      labAudio.playButtonClick();
    } else {
      if (fb) {
        fb.textContent = `✕ Recheck calculation — expected ~${q.expected} ${q.unit}.`;
        fb.style.color = "#D61F1F";
      }
    }
    this._renderHUD();
    this._broadcastState();
  }

  _renderHUD() {
    if (!this.hudEl) return;
    const s = this.state;

    this.hudEl.querySelector("#summon-telemetry-mini").textContent = s.telemetry.primaryVal;

    const lessonChip = this.hudEl.querySelector("#iphone-lesson-title");
    if (lessonChip) {
      lessonChip.textContent = s.lessonId || "T1L1";
      lessonChip.title = s.lessonTitle || s.lessonId || "ChemMate";
    }

    this.hudEl.querySelector("#hud-step-badge").textContent = `STEP ${s.stepIndex + 1} / ${s.totalSteps}`;
    this.hudEl.querySelector("#hud-room-tag").textContent = s.roomName;
    this.hudEl.querySelector("#hud-step-title").textContent = s.stepTitle;
    this.hudEl.querySelector("#hud-step-desc").textContent = s.stepInstruction;
    this.hudEl.querySelector("#hud-target-mesh").textContent = `${s.targetMeshName} · ${s.targetMachineName}`;
    this.hudEl.querySelector("#hud-tts-script").textContent = `"${s.ttsText}"`;

    // Inline Scientific Diagram Preview
    const diagramEl = this.hudEl.querySelector("#hud-diagram-preview");
    if (diagramEl) {
      diagramEl.innerHTML = this._renderLessonDiagramSVG(s);
    }

    // BLE Panel
    this.hudEl.querySelector("#ble-machine-name").textContent = s.targetMachineName;
    this.hudEl.querySelector("#ble-lbl-1").textContent = s.telemetry.primaryLabel;
    this.hudEl.querySelector("#ble-val-1").textContent = s.telemetry.primaryVal;
    this.hudEl.querySelector("#ble-lbl-2").textContent = s.telemetry.secondaryLabel;
    this.hudEl.querySelector("#ble-val-2").textContent = s.telemetry.secondaryVal;
    this.hudEl.querySelector("#ble-lbl-3").textContent = s.telemetry.tertiaryLabel;
    this.hudEl.querySelector("#ble-val-3").textContent = s.telemetry.tertiaryVal;
    this.hudEl.querySelector("#ble-btn-name").textContent = s.targetMeshName;

    // Peer status
    const peerEl = this.hudEl.querySelector("#hud-peer-status");
    if (peerEl) {
      peerEl.textContent = this.remotePeerConnected
        ? "● Real Physical Phone Connected Live"
        : "● On-Screen Bench iPhone Active";
      peerEl.style.color = this.remotePeerConnected ? "#16794B" : "#141413";
    }

    // Notebook Panel
    const obsEl = this.hudEl.querySelector("#iphone-observations-list");
    if (obsEl) {
      obsEl.innerHTML = s.observations.length
        ? s.observations.map((o) => `<div class="obs-line">${o}</div>`).join("")
        : `<div class="obs-line muted">Actuate 3D machine controls to auto-log BLE readings...</div>`;
    }

    const plotTitleEl = this.hudEl.querySelector("#notebook-plot-title");
    if (plotTitleEl && s.plotData?.title) {
      plotTitleEl.textContent = s.plotData.title;
    }

    if (s.verificationQuestion) {
      this.hudEl.querySelector("#verify-prompt").textContent = s.verificationQuestion.prompt;
      this.hudEl.querySelector("#verify-unit").textContent = s.verificationQuestion.unit || "";
      const inp = this.hudEl.querySelector("#verify-input");
      const fb = this.hudEl.querySelector("#verify-feedback");
      if (this._lastRenderedLessonId !== s.lessonId) {
        if (inp) inp.value = s.verificationQuestion.verified ? s.verificationQuestion.expected : "";
        if (fb) fb.textContent = s.verificationQuestion.verified
          ? `✓ PASS (${s.verificationQuestion.expected} ${s.verificationQuestion.unit}) — Synced to ChemMate Gradebook.`
          : "";
        if (fb && s.verificationQuestion.verified) fb.style.color = "#16794B";
      } else if (inp && !inp.value && s.verificationQuestion.verified) {
        inp.value = s.verificationQuestion.expected;
      }
    }
    this._lastRenderedLessonId = s.lessonId;

    this._drawPlotCanvas();
  }

  _drawPlotCanvas() {
    const canvas = this.hudEl?.querySelector("#iphone-plot-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    // Archival paper canvas ground
    ctx.fillStyle = "#FBF9F4";
    ctx.fillRect(0, 0, w, h);

    // Subtle archival gridlines
    ctx.strokeStyle = "#EAE3D5";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      const gy = 14 + ((h - 32) / 4) * i;
      ctx.beginPath();
      ctx.moveTo(38, gy);
      ctx.lineTo(w - 12, gy);
      ctx.stroke();
    }
    for (let j = 1; j <= 3; j++) {
      const gx = 38 + ((w - 50) / 4) * j;
      ctx.beginPath();
      ctx.moveTo(gx, 14);
      ctx.lineTo(gx, h - 18);
      ctx.stroke();
    }

    // Crisp obsidian axes
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(38, 12);
    ctx.lineTo(38, h - 18);
    ctx.lineTo(w - 10, h - 18);
    ctx.stroke();

    const pts = this.state.plotData?.points || [];
    if (pts.length < 2) return;

    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs, minX + 1);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys, minY + 0.1);

    // Swiss Crimson trajectory line
    ctx.strokeStyle = "#D61F1F";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    pts.forEach((p, idx) => {
      const px = 42 + ((p.x - minX) / (maxX - minX)) * (w - 58);
      const py = h - 22 - ((p.y - minY) / (maxY - minY)) * (h - 40);
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Archival paper-filled crimson-ringed vertex markers
    pts.forEach((p) => {
      const px = 42 + ((p.x - minX) / (maxX - minX)) * (w - 58);
      const py = h - 22 - ((p.y - minY) / (maxY - minY)) * (h - 40);
      ctx.fillStyle = "#FBF9F4";
      ctx.strokeStyle = "#D61F1F";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Crisp monospace axis ticks
    ctx.fillStyle = "#141413";
    ctx.font = "600 9.5px 'IBM Plex Mono', monospace";
    ctx.fillText(maxY.toFixed(2), 4, 18);
    ctx.fillText(minY.toFixed(2), 4, h - 19);
    ctx.fillStyle = "#5C564C";
    ctx.fillText(String(this.state.plotData?.xLabel || "Time").slice(0, 14), w - 68, h - 5);
  }
}
