/**
 * sem3d.js — Procedural 3D CAD Model for Field Emission Scanning Electron Microscope (FE-SEM)
 * 
 * Semantic Taxonomy:
 * - Body_Chassis: Heavy structural graphite work console with power supply bay & cable raceways
 * - Column_FEG_Assembly: Vertical field emission electron optical column (anode, condensers, scan coils)
 * - Chamber_Specimen_UHV: Multi-port stainless steel ultra-high vacuum specimen chamber
 * - Pivot_DoorChamber: Front hinged vacuum stage door with safety interlock microswitch
 * - Stage_5Axis_Eucentric: Motorized precision specimen stage (X, Y, Z, Tilt, Rotation)
 * - Pump_Turbomolecular: Flange-mounted 300 L/s TMP high-vacuum turbomolecular pump
 * - Detector_SE2_Everhart: Everhart-Thornley secondary electron detector with Faraday cage
 * - Detector_InLens_SE: In-column annular secondary electron detector
 * - Detector_BSE_Retractable: 4-quadrant backscattered electron solid-state detector
 * - Detector_EDS_Snout: Silicon Drift Detector (SDD) X-ray spectrometer with liquid N2 dewar
 * - Console_DualDisplays: Dual 32" 4K curved IPS displays on articulating arms
 * - Panel_TactileControls: Trackball, joystick, rotary magnification encoder & stigmator dials
 * - Badge_SREdesigns: Official SREdesigns laser-etched brushed badge
 */
import * as THREE from "three";

export function buildSEMModel(tex = null, options = {}) {
  const root = new THREE.Group();
  root.name = "Body_Chassis";

  const materials = {
    consoleGraphite: new THREE.MeshStandardMaterial({
      color: 0x181c24,
      roughness: 0.45,
      metalness: 0.35,
      name: "Mat_SEM_Console_Graphite"
    }),
    columnSteel: new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.22,
      metalness: 0.88,
      name: "Mat_SEM_Column_Steel"
    }),
    chamberStainless: new THREE.MeshStandardMaterial({
      color: 0xc8d0da,
      roughness: 0.18,
      metalness: 0.92,
      name: "Mat_SEM_UHV_Chamber"
    }),
    flangeBronze: new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.3,
      metalness: 0.8,
      name: "Mat_SEM_CF_Flange"
    }),
    turboPumpHousing: new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.35,
      metalness: 0.45,
      name: "Mat_Pfeiffer_Turbo_Blue"
    }),
    finnedCooler: new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.6,
      metalness: 0.5,
      name: "Mat_Finned_Heat_Sink"
    }),
    displayBezel: new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.35,
      metalness: 0.75,
      name: "Mat_Display_Microbezel"
    }),
    stageBrass: new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85,
      name: "Mat_Eucentric_Stage_Brass"
    }),
    badgeSilver: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.95,
      name: "Mat_SREdesigns_Silver"
    })
  };

  // 1. Heavy Structural Console Desk (W: 1.4m, D: 0.95m, H: 0.82m)
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.82, 0.95),
    materials.consoleGraphite
  );
  desk.position.set(0, 0.41, 0);
  root.add(desk);

  // 4 Vibration Isolation Damper Leveling Feet resting at datum Y = 0
  const footPositions = [
    [-0.62, -0.40], [0.62, -0.40],
    [-0.62, 0.40], [0.62, 0.40]
  ];
  footPositions.forEach(([fx, fz], idx) => {
    const foot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.055, 0.04, 16),
      materials.finnedCooler
    );
    foot.position.set(fx, 0.02, fz);
    foot.name = `Foot_Leveling_0${idx + 1}`;
    root.add(foot);
  });

  // 2. Stainless Steel Ultra-High Vacuum (UHV) Specimen Chamber (Y = 0.82 to 1.25m)
  const chamber = new THREE.Group();
  chamber.position.set(-0.25, 0.82, 0.05);
  chamber.name = "Chamber_Specimen_UHV";

  const chBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.42, 0.48),
    materials.chamberStainless
  );
  chBody.position.y = 0.21;
  chamber.add(chBody);

  // Front Hinged Vacuum Door with O-Ring Gasket & Clamping Handwheels
  const door = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24),
    materials.chamberStainless
  );
  door.rotation.x = Math.PI / 2;
  door.position.set(0, 0.21, -0.25);
  door.name = "Pivot_DoorChamber";
  chamber.add(door);

  // Door locking knurled handwheels
  [-0.14, 0.14].forEach((wx, i) => {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16),
      materials.stageBrass
    );
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(wx, 0.21, -0.275);
    chamber.add(wheel);
  });

  // 3. Vertical Field Emission Electron Optical Column (H: 0.78m, Diam: 0.22m)
  const column = new THREE.Group();
  column.position.set(-0.25, 1.24, 0.05);
  column.name = "Column_FEG_Assembly";

  // Lower Final Objective Lens with immersion pole piece
  const objLens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 0.15, 24),
    materials.columnSteel
  );
  objLens.position.y = 0.075;
  column.add(objLens);

  // Middle Scan Coil & Deflection Housing
  const scanHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.10, 0.10, 0.22, 24),
    materials.columnSteel
  );
  scanHousing.position.y = 0.26;
  column.add(scanHousing);

  // Finned Electromagnetic Condenser Lens Heat Sinks
  for (let f = 0; f < 6; f++) {
    const fin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.012, 24),
      materials.finnedCooler
    );
    fin.position.y = 0.18 + f * 0.035;
    column.add(fin);
  }

  // Upper FEG Gun Chamber with Schottky emitter cathode
  const gunChamber = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.11, 0.28, 24),
    materials.columnSteel
  );
  gunChamber.position.y = 0.51;
  column.add(gunChamber);

  // High Voltage Red Armored Cable leading to rear high-voltage tank
  const hvCableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.65, 0),
    new THREE.Vector3(0.12, 0.72, 0.15),
    new THREE.Vector3(0.25, 0.55, 0.35),
    new THREE.Vector3(0.35, 0.20, 0.38)
  ]);
  const hvCable = new THREE.Mesh(
    new THREE.TubeGeometry(hvCableCurve, 20, 0.012, 10, false),
    new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 })
  );
  column.add(hvCable);

  root.add(column);

  // 4. Multi-Detector Array attached to Specimen Chamber
  // Detector 1: Everhart-Thornley SE2 Detector with scintillator & photomultiplier snout
  const se2Det = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.025, 0.24, 16),
    materials.columnSteel
  );
  se2Det.rotation.z = Math.PI / 3;
  se2Det.position.set(0.26, 0.28, 0.08);
  se2Det.name = "Detector_SE2_Everhart";
  chamber.add(se2Det);

  // Detector 2: EDS Silicon Drift Detector with angled snout pointed at eucentric point
  const edsDet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.03, 0.28, 16),
    materials.columnSteel
  );
  edsDet.rotation.z = -Math.PI / 3.5;
  edsDet.position.set(-0.28, 0.30, 0.05);
  edsDet.name = "Detector_EDS_Snout";
  chamber.add(edsDet);

  // Detector 3: 4-Quadrant Retractable BSE Detector
  const bseDet = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.02, 0.16),
    materials.stageBrass
  );
  bseDet.position.set(0, 0.38, 0.15);
  bseDet.name = "Detector_BSE_Retractable";
  chamber.add(bseDet);

  root.add(chamber);

  // 5. Pfeiffer/Edwards Turbomolecular Vacuum Pump (TMP) mounted underneath chamber
  const turboPump = new THREE.Group();
  turboPump.position.set(-0.25, 0.55, 0.05);
  turboPump.name = "Pump_Turbomolecular";

  const turboBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.22, 20),
    materials.turboPumpHousing
  );
  turboPump.add(turboBody);

  // ConFlat vacuum flange
  const cfFlange = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.03, 20),
    materials.flangeBronze
  );
  cfFlange.position.y = 0.12;
  turboPump.add(cfFlange);

  root.add(turboPump);

  // 6. Operator Workstation: Dual Curved 32" 4K Monitors on Articulated Stand
  const displayAssembly = new THREE.Group();
  displayAssembly.position.set(0.35, 0.82, 0);
  displayAssembly.name = "Console_DualDisplays";

  // Heavy brushed anodized stand base
  const standBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.02, 0.22),
    materials.displayBezel
  );
  standBase.position.y = 0.01;
  displayAssembly.add(standBase);

  const standPillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.45, 16),
    materials.columnSteel
  );
  standPillar.position.set(0, 0.225, 0);
  displayAssembly.add(standPillar);

  // Crossbar for dual monitors
  const crossbar = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.025, 0.03),
    materials.columnSteel
  );
  crossbar.position.set(0, 0.38, 0);
  displayAssembly.add(crossbar);

  // Monitor 1: Live SEM Micrograph Viewport (Left)
  const monL = new THREE.Group();
  monL.position.set(-0.26, 0.38, 0.04);
  monL.rotation.y = 0.18; // Angled inward towards operator

  const monLBezel = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.32, 0.025),
    materials.displayBezel
  );
  monL.add(monLBezel);

  // Dynamic SEM Viewport Canvas
  const semScreenGeo = new THREE.PlaneGeometry(0.46, 0.30);
  let semScreenMat;
  if (tex) {
    semScreenMat = new THREE.MeshBasicMaterial({ map: tex });
  } else {
    // Procedural Fallback SEM Canvas with high-DPI live micrograph
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    
    // Background dark vacuum scan field
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, 512, 384);

    // Nanoscale Micrograph Simulation (Insect compound eye hexagonal ommatidia)
    ctx.strokeStyle = "#94a3b8";
    ctx.fillStyle = "#334155";
    const r = 18;
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 16; col++) {
        const cx = 40 + col * r * 1.75 + (row % 2 ? r * 0.85 : 0);
        const cy = 40 + row * r * 1.5;
        if (cx > 20 && cx < 490 && cy > 20 && cy < 340) {
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const angle = (a * Math.PI) / 3;
            const x = cx + Math.cos(angle) * (r - 2);
            const y = cy + Math.sin(angle) * (r - 2);
            if (a === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        }
      }
    }

    // High-Resolution Live SEM HUD Overlay
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(0, 340, 512, 44);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px monospace";
    ctx.fillText("FE-SEM · ZEISS GEMINI ULTRA · MAG: 15,000x · EHT: 5.00 kV", 12, 358);
    ctx.fillText("WD: 8.5 mm · PROBE: 120 pA · DET: InLens SE · VAC: 2.4e-4 Pa", 12, 374);

    // Micron Scale Bar (1.0 um)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(400, 362, 80, 4);
    ctx.fillText("1.0 µm", 420, 355);

    const sTex = new THREE.CanvasTexture(canvas);
    semScreenMat = new THREE.MeshBasicMaterial({ map: sTex });
  }

  const semScreen = new THREE.Mesh(semScreenGeo, semScreenMat);
  semScreen.position.set(0, 0, -0.014);
  semScreen.rotation.y = Math.PI; // Face front
  semScreen.name = "UI_LCD";
  monL.add(semScreen);

  displayAssembly.add(monL);

  // Monitor 2: Instrument Control Software & Stage Map (Right)
  const monR = new THREE.Group();
  monR.position.set(0.26, 0.38, 0.04);
  monR.rotation.y = -0.18; // Angled inward

  const monRBezel = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.32, 0.025),
    materials.displayBezel
  );
  monR.add(monRBezel);

  // Control UI canvas
  const cCanvas = document.createElement("canvas");
  cCanvas.width = 512;
  cCanvas.height = 384;
  const cctx = cCanvas.getContext("2d");
  cctx.fillStyle = "#0c1017";
  cctx.fillRect(0, 0, 512, 384);
  cctx.strokeStyle = "#38bdf8";
  cctx.lineWidth = 4;
  cctx.strokeRect(6, 6, 500, 372);

  cctx.fillStyle = "#38bdf8";
  cctx.font = "bold 18px sans-serif";
  cctx.fillText("FE-SEM SMARTSEM SUITE", 20, 36);

  cctx.fillStyle = "#10b981";
  cctx.font = "bold 14px monospace";
  cctx.fillText("VACUUM: UHV READY (P = 2.4 x 10^-4 Pa)", 20, 75);
  cctx.fillText("TURBO PUMP: 100% · 90,000 RPM · FORELINE OK", 20, 100);
  cctx.fillText("EMISSION: FEG ACTIVE · 1.84 uA TIP CURRENT", 20, 125);

  cctx.fillStyle = "#f8fafc";
  cctx.font = "bold 13px monospace";
  cctx.fillText("STAGE NAVIGATION: X: +0.00 mm  Y: +0.00 mm", 20, 170);
  cctx.fillText("ROTATION: 0.0°  TILT: 0.0°  EUCENTRIC Z: 10.0 mm", 20, 195);
  cctx.fillText("DETECTOR SELECTION: [InLens SE]  [SE2]  [BSE]  [EDS]", 20, 235);
  cctx.fillText("INTEGRATION: LINE SCAN NOISE FILTERING ACTIVE", 20, 260);

  // Simulated real-time EDS Spectrum Chart
  cctx.strokeStyle = "#f59e0b";
  cctx.beginPath();
  cctx.moveTo(30, 350);
  const peaks = [50, 70, 120, 220, 280, 340, 420];
  for (let x = 30; x < 480; x += 4) {
    let y = 350 - Math.random() * 8;
    peaks.forEach(p => {
      const dist = Math.abs(x - p);
      if (dist < 15) y -= (15 - dist) * 4;
    });
    cctx.lineTo(x, y);
  }
  cctx.stroke();

  const cTex = new THREE.CanvasTexture(cCanvas);
  const monRScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 0.30),
    new THREE.MeshBasicMaterial({ map: cTex })
  );
  monRScreen.position.set(0, 0, -0.014);
  monRScreen.rotation.y = Math.PI;
  monR.add(monRScreen);

  displayAssembly.add(monR);
  root.add(displayAssembly);

  // 7. Tactile Operator Control Console (Trackball + Focus Dials + Magnification Wheel)
  const ctrlPanel = new THREE.Group();
  ctrlPanel.position.set(0.35, 0.835, -0.25);
  ctrlPanel.name = "Panel_TactileControls";

  const panelBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.035, 0.22),
    materials.consoleGraphite
  );
  ctrlPanel.add(panelBody);

  // Trackball
  const trackball = new THREE.Mesh(
    new THREE.SphereGeometry(0.024, 16, 16),
    materials.stageBrass
  );
  trackball.position.set(-0.16, 0.025, 0);
  trackball.name = "Trackball_StageNavigation";
  ctrlPanel.add(trackball);

  // Rotary Focus & Stigmator Dials
  const dialPositions = [
    [-0.04, "Knob_CoarseFocus"],
    [0.04, "Knob_FineFocus"],
    [0.12, "Knob_Magnification"],
    [0.20, "Knob_Stigmator"]
  ];
  dialPositions.forEach(([dx, dname]) => {
    const dial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.02, 0.025, 16),
      materials.stageBrass
    );
    dial.position.set(dx, 0.025, 0);
    dial.name = dname;
    ctrlPanel.add(dial);
  });

  root.add(ctrlPanel);

  // 8. Official Brand Badge (Badge_SREdesigns)
  const badge = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.045, 0.005),
    materials.badgeSilver
  );
  badge.position.set(0, 0.72, -0.48);
  badge.name = "Badge_SREdesigns";
  root.add(badge);

  return root;
}
