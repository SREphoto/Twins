/**
 * LabCasework.js — Modern Architectural SEFA Casework & Executive Furniture
 * 
 * Features:
 * - SEFA 8M heavy-duty welded slate-grey steel cabinetry with brushed steel pulls
 * - 30mm jet black monolithic epoxy resin countertops at datum Y = 0.90m (900mm AFF)
 * - 2x 6-foot Labconco Protector Premier Fume Hoods with sliding sashes & LED bays
 * - Double epoxy wash sink in Synthesis Bay + Secondary sink in Analytical Hall
 * - Executive Floating L-Shaped Desk with Nero Marquina waterfall edge in User's Office
 * - Dual-monitor workstation PC terminal in User's Office
 * - 10-person Walnut Conference Table with 85" 4K Presentation Display
 * - Restroom fixtures: floating vanity, sensor faucet, backlit mirror, toilet
 * - NFPA 30 Flammable Storage Cabinets & ANSI Z358.1 Emergency Safety Showers
 */
import * as THREE from "three";

export class LabCasework {
  constructor(scene, colliders = []) {
    this.scene = scene;
    this.colliders = colliders;
    this.root = new THREE.Group();
    this.root.name = "Modern_Lab_Casework_Root";
    this.fumeHoodSashes = [];

    this._initMaterials();
    this._buildLabIslands();
    this._buildFumeHoods();
    this._buildUserOfficeFurniture();
    this._buildConferenceRoomFurniture();
    this._buildRestroomFixtures();
    this._buildSafetyCore();

    this.scene.add(this.root);
  }

  _initMaterials() {
    this.materials = {
      epoxyTop: new THREE.MeshStandardMaterial({
        color: 0x12151a,
        roughness: 0.22,
        metalness: 0.25,
        name: "Mat_Black_Epoxy_Countertop"
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
      walnutDesk: new THREE.MeshStandardMaterial({
        color: 0x4a2e18,
        roughness: 0.42,
        metalness: 0.05,
        name: "Mat_Executive_Walnut"
      }),
      marbleWaterfall: new THREE.MeshStandardMaterial({
        color: 0x181a1d,
        roughness: 0.18,
        metalness: 0.15,
        name: "Mat_Nero_Marquina"
      }),
      leatherBlack: new THREE.MeshStandardMaterial({
        color: 0x16171a,
        roughness: 0.65,
        metalness: 0.1,
        name: "Mat_Executive_Leather"
      }),
      fumeHoodSteel: new THREE.MeshStandardMaterial({
        color: 0x2a3038,
        roughness: 0.4,
        metalness: 0.4,
        name: "Mat_Fume_Hood_Shell"
      }),
      fumeHoodLining: new THREE.MeshStandardMaterial({
        color: 0xf0f2f5,
        roughness: 0.6,
        metalness: 0.05,
        name: "Mat_Fume_Hood_Liner"
      }),
      sashGlass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.45,
        roughness: 0.08,
        transmission: 0.88,
        ior: 1.5,
        name: "Mat_Sash_Acrylic"
      }),
      safetyYellow: new THREE.MeshStandardMaterial({
        color: 0xd49b14,
        roughness: 0.45,
        metalness: 0.15,
        name: "Mat_Safety_Yellow"
      }),
      chromeFaucet: new THREE.MeshStandardMaterial({
        color: 0xe0e6ed,
        roughness: 0.15,
        metalness: 0.92,
        name: "Mat_Chrome_Plumbing"
      })
    };
  }

  // --- SEFA Laboratory Casework Islands ---
  _buildLabIslands() {
    // 1. Analytical & Spectroscopy Island (Zone 1): X: -10.0, Z: -4.5, Length: 6.8m, Depth: 1.5m
    this._createDoubleSidedBench(-10.0, -4.5, 6.8, 1.5, "Analytical_Spectroscopy_Island");

    // 2. Pharmaceutical QC & Solid Dosage Island (Zone 1): X: -2.0, Z: -4.5, Length: 6.8m, Depth: 1.5m
    this._createDoubleSidedBench(-2.0, -4.5, 6.8, 1.5, "Pharma_QC_Island");

    // 3. Wet Chemistry & Titration Perimeter Bench (Zone 1): X: -10.0, Z: -8.2, Length: 6.0m, Depth: 0.85m
    this._createSingleSidedBench(-10.0, -8.3, 6.0, 0.85, "Wet_Titration_Perimeter_Bench");

    // 4. Sample Prep & Lyophilization Island (Zone 3): X: -0.5, Z: 5.0, Length: 6.0m, Depth: 1.5m
    this._createDoubleSidedBench(-0.5, 5.0, 6.0, 1.5, "Sample_Prep_Island");

    // 5. Synthesis & Reaction Wet Bench (Zone 2): X: -10.0, Z: 5.0, Length: 6.0m, Depth: 1.5m
    this._createDoubleSidedBench(-10.0, 5.0, 6.0, 1.5, "Synthesis_Prep_Bench");

    // 6. Chemical Storage Vault Shelving (Zone 5): X: 6.0, Z: 5.0, Length: 5.0m, Depth: 0.7m
    this._createStorageRacks(6.0, 5.0, 5.0, 0.7);
  }

  _createDoubleSidedBench(cx, cz, length, depth, name) {
    const group = new THREE.Group();
    group.position.set(cx, 0, cz);
    group.name = name;

    const benchH = 0.87; // Base height
    const topT = 0.03;   // Countertop thickness 30mm -> Surface exactly at Y = 0.90m!

    // Under-counter cabinetry bases
    const cabGeo = new THREE.BoxGeometry(length - 0.1, benchH, depth - 0.1);
    const cab = new THREE.Mesh(cabGeo, this.materials.cabinetBody);
    cab.position.y = benchH / 2;
    cab.castShadow = true;
    cab.receiveShadow = true;
    group.add(cab);

    // Countertop with bevel marine edge (Jet black epoxy)
    const topGeo = new THREE.BoxGeometry(length, topT, depth);
    const top = new THREE.Mesh(topGeo, this.materials.epoxyTop);
    top.position.y = benchH + topT / 2;
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);

    // Center utility spine / reagent shelf riser
    const shelfH = 0.45;
    const shelfD = 0.35;
    const spineGeo = new THREE.BoxGeometry(length - 0.4, shelfH, shelfD);
    const spine = new THREE.Mesh(spineGeo, this.materials.cabinetBody);
    spine.position.set(0, benchH + topT + shelfH / 2, 0);
    group.add(spine);

    const shelfTopGeo = new THREE.BoxGeometry(length - 0.3, 0.02, shelfD + 0.05);
    const shelfTop = new THREE.Mesh(shelfTopGeo, this.materials.epoxyTop);
    shelfTop.position.set(0, benchH + topT + shelfH + 0.01, 0);
    group.add(shelfTop);

    // Stainless steel drawer handles
    const numDrawers = Math.floor(length / 0.9);
    for (let i = 0; i < numDrawers; i++) {
      const x = -((numDrawers - 1) * 0.9) / 2 + i * 0.9;
      // Front side
      const hFront = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.15, 8),
        this.materials.cabinetHandle
      );
      hFront.rotation.z = Math.PI / 2;
      hFront.position.set(x, benchH * 0.75, depth / 2 + 0.01);
      group.add(hFront);

      // Back side
      const hBack = hFront.clone();
      hBack.position.z = -depth / 2 - 0.01;
      group.add(hBack);
    }

    this.root.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(group));
  }

  _createSingleSidedBench(cx, cz, length, depth, name) {
    const group = new THREE.Group();
    group.position.set(cx, 0, cz);
    group.name = name;

    const benchH = 0.87;
    const topT = 0.03;

    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(length - 0.05, benchH, depth - 0.05),
      this.materials.cabinetBody
    );
    cab.position.y = benchH / 2;
    group.add(cab);

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(length, topT, depth),
      this.materials.epoxyTop
    );
    top.position.y = benchH + topT / 2;
    group.add(top);

    this.root.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(group));
  }

  // --- Ducted Chemical Fume Hoods ---
  _buildFumeHoods() {
    // 2x 6-Ft Labconco Protector Premier Fume Hoods along Northwest wall (Z = 8.3)
    const hoodXPositions = [-13.5, -9.5];

    hoodXPositions.forEach((hx, idx) => {
      const hood = new THREE.Group();
      hood.position.set(hx, 0, 8.1);
      hood.name = `Labconco_Fume_Hood_${idx + 1}`;

      const hoodW = 1.83; // 6 feet
      const hoodD = 0.95;
      const hoodH = 2.4;
      const baseH = 0.87;

      // Base Cabinet
      const baseCab = new THREE.Mesh(
        new THREE.BoxGeometry(hoodW, baseH, hoodD),
        this.materials.fumeHoodSteel
      );
      baseCab.position.y = baseH / 2;
      hood.add(baseCab);

      // Chemical Work Surface (Epoxy with dished basin)
      const workDeck = new THREE.Mesh(
        new THREE.BoxGeometry(hoodW + 0.02, 0.03, hoodD + 0.02),
        this.materials.epoxyTop
      );
      workDeck.position.y = baseH + 0.015;
      hood.add(workDeck);

      // Upper Fume Enclosure
      const upperH = hoodH - baseH;
      const upperShell = new THREE.Mesh(
        new THREE.BoxGeometry(hoodW, upperH, hoodD),
        this.materials.fumeHoodSteel
      );
      upperShell.position.set(0, baseH + upperH / 2, 0);
      hood.add(upperShell);

      // Inner Cavity Liner (Cutout representation)
      const innerLiner = new THREE.Mesh(
        new THREE.BoxGeometry(hoodW - 0.16, upperH - 0.25, hoodD - 0.15),
        this.materials.fumeHoodLining
      );
      innerLiner.position.set(0, baseH + upperH / 2 - 0.05, 0.05);
      hood.add(innerLiner);

      // Sliding Acrylic Sash
      const sashW = hoodW - 0.18;
      const sashH = 0.75;
      const sash = new THREE.Mesh(
        new THREE.BoxGeometry(sashW, sashH, 0.02),
        this.materials.sashGlass
      );
      sash.position.set(0, baseH + 0.45, -hoodD / 2 + 0.05);
      hood.add(sash);
      this.fumeHoodSashes.push(sash);

      // Interior Vapor-Proof LED Downlight
      const hoodLight = new THREE.PointLight(0xf0f6ff, 0.9, 4.0);
      hoodLight.position.set(0, hoodH - 0.2, 0);
      hood.add(hoodLight);

      this.root.add(hood);
      this.colliders.push(new THREE.Box3().setFromObject(hood));
    });
  }

  // --- User's Executive Office & Analytical Learning Suite (Zone 9) ---
  _buildUserOfficeFurniture() {
    const office = new THREE.Group();
    office.position.set(12.0, 0, 6.75);
    office.name = "User_Executive_Office_Furniture";

    // 1. Executive Floating L-Shaped Desk with Nero Marquina Waterfall Edge
    const deskW = 2.4;
    const deskD = 1.0;
    const deskH = 0.75;
    const topT = 0.06;

    // Main walnut desk top
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(deskW, topT, deskD),
      this.materials.walnutDesk
    );
    deskTop.position.set(0, deskH - topT / 2, 0);
    deskTop.castShadow = true;
    office.add(deskTop);

    // Left Nero Marquina Marble Waterfall Leg
    const waterfall = new THREE.Mesh(
      new THREE.BoxGeometry(topT, deskH, deskD),
      this.materials.marbleWaterfall
    );
    waterfall.position.set(-deskW / 2 + topT / 2, deskH / 2, 0);
    office.add(waterfall);

    // Right brushed steel pedestal
    const pedestal = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, deskH - topT, deskD * 0.85),
      this.materials.cabinetBody
    );
    pedestal.position.set(deskW / 2 - 0.35, (deskH - topT) / 2, 0);
    office.add(pedestal);

    // 2. Executive Ergonomic Leather Swivel Chair (Facing Desk)
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0, 0, -0.65);

    // Chair base & chrome casters
    const basePole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.38, 12),
      this.materials.cabinetHandle
    );
    basePole.position.y = 0.19;
    chairGroup.add(basePole);

    // Leather seat cushion
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.08, 0.52),
      this.materials.leatherBlack
    );
    seat.position.y = 0.42;
    chairGroup.add(seat);

    // High ergonomic backrest
    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.65, 0.06),
      this.materials.leatherBlack
    );
    backrest.position.set(0, 0.76, -0.24);
    chairGroup.add(backrest);

    office.add(chairGroup);

    // 3. Dual Curved Workstation Monitors (LIMS Post-Run Results Studio)
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, deskH + 0.01, 0.15);

    // Dual Monitor Stands & Screens
    [-0.38, 0.38].forEach((mx, i) => {
      const stand = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.015, 0.18),
        this.materials.cabinetHandle
      );
      stand.position.set(mx, 0, 0);
      monitorGroup.add(stand);

      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.28, 12),
        this.materials.cabinetHandle
      );
      pole.position.set(mx, 0.14, -0.05);
      monitorGroup.add(pole);

      const screenGeo = new THREE.BoxGeometry(0.68, 0.42, 0.03);
      const screenHousing = new THREE.Mesh(screenGeo, this.materials.cabinetBody);
      screenHousing.position.set(mx, 0.26, -0.03);
      screenHousing.rotation.y = i === 0 ? 0.12 : -0.12;
      monitorGroup.add(screenHousing);

      // Display face with canvas graphics
      const monCanvas = document.createElement("canvas");
      monCanvas.width = 512;
      monCanvas.height = 320;
      const ctx = monCanvas.getContext("2d");
      ctx.fillStyle = "#0c1017";
      ctx.fillRect(0, 0, 512, 320);

      if (i === 0) {
        // Monitor 1: LIMS Post-Run Spectral Studio (FTIR & UV-Vis)
        ctx.fillStyle = "#00d4e8";
        ctx.font = "bold 20px monospace";
        ctx.fillText("LIMS RESULTS STUDIO · FTIR SPECTRA", 20, 35);
        ctx.strokeStyle = "#3dd68c";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(30, 260);
        ctx.lineTo(100, 255);
        ctx.lineTo(180, 250);
        ctx.lineTo(240, 110); // Ester C=O peak at 1750 cm-1
        ctx.lineTo(270, 245);
        ctx.lineTo(350, 160); // Aromatic ring C=C peak
        ctx.lineTo(420, 250);
        ctx.lineTo(480, 255);
        ctx.stroke();
        ctx.fillStyle = "#f0b429";
        ctx.font = "14px monospace";
        ctx.fillText("PEAK: 1750 cm-1 [C=O Ester Stretch] 98.4% Match", 30, 75);
      } else {
        // Monitor 2: Dissolution Kinetics & USP <711> Q% Curves
        ctx.fillStyle = "#00d4e8";
        ctx.font = "bold 20px monospace";
        ctx.fillText("USP <711> DISSOLUTION PROFILE", 20, 35);
        ctx.strokeStyle = "#00d4e8";
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        for (let t = 0; t <= 450; t += 10) {
          const q = 100 * (1 - Math.exp(-t / 120)); // First-order dissolution
          const y = 270 - q * 2.1;
          if (t === 0) ctx.moveTo(40, y);
          else ctx.lineTo(40 + t, y);
        }
        ctx.stroke();
        ctx.fillStyle = "#3dd68c";
        ctx.font = "14px monospace";
        ctx.fillText("Q (30 min) = 84.6% (USP SPEC: >= 80% PASS)", 30, 75);
      }

      const monTex = new THREE.CanvasTexture(monCanvas);
      const screenFace = new THREE.Mesh(
        new THREE.PlaneGeometry(0.66, 0.40),
        new THREE.MeshBasicMaterial({ map: monTex })
      );
      screenFace.position.set(mx, 0.26, -0.01);
      screenFace.rotation.y = i === 0 ? 0.12 : -0.12;
      monitorGroup.add(screenFace);
    });

    // Sleek chiclet keyboard & optical mouse
    const kb = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.008, 0.12),
      this.materials.cabinetHandle
    );
    kb.position.set(0, 0.005, -0.18);
    monitorGroup.add(kb);

    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.015, 0.1),
      this.materials.cabinetBody
    );
    mouse.position.set(0.28, 0.01, -0.18);
    monitorGroup.add(mouse);

    office.add(monitorGroup);

    // 4. Executive Reference Bookshelf against North Wall (Z = 8.85)
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(-1.8, 0, 1.8);
    const shelfW = 2.0;
    const shelfH = 2.2;
    const shelfD = 0.38;

    const shelfFrame = new THREE.Mesh(
      new THREE.BoxGeometry(shelfW, shelfH, shelfD),
      this.materials.walnutDesk
    );
    shelfFrame.position.y = shelfH / 2;
    shelfGroup.add(shelfFrame);

    // Book meshes on shelves (USP-NF, CRC, Merck, NGSS)
    const bookColors = [0x991b1b, 0x1e3a8a, 0x065f46, 0x581c87, 0x1e293b];
    for (let row = 0; row < 4; row++) {
      const y = 0.35 + row * 0.48;
      for (let b = 0; b < 12; b++) {
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, 0.28, 0.22),
          new THREE.MeshStandardMaterial({ color: bookColors[(row + b) % bookColors.length], roughness: 0.7 })
        );
        book.position.set(-shelfW / 2 + 0.15 + b * 0.07, y, 0);
        shelfGroup.add(book);
      }
    }
    office.add(shelfGroup);

    this.root.add(office);
    this.colliders.push(new THREE.Box3().setFromObject(office));
  }

  // --- Executive Conference Room Furniture (Zone 10) ---
  _buildConferenceRoomFurniture() {
    const conf = new THREE.Group();
    conf.position.set(12.0, 0, 2.25);
    conf.name = "Executive_Conference_Room_Furniture";

    // 1. 10-Person Walnut Slab Conference Table
    const tableW = 4.4;
    const tableD = 1.5;
    const tableH = 0.75;
    const topT = 0.05;

    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(tableW, topT, tableD),
      this.materials.walnutDesk
    );
    tableTop.position.y = tableH - topT / 2;
    tableTop.castShadow = true;
    conf.add(tableTop);

    // Brushed steel architectural trestle bases
    [-1.4, 1.4].forEach((tx) => {
      const trestle = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, tableH - topT, tableD * 0.8),
        this.materials.cabinetHandle
      );
      trestle.position.set(tx, (tableH - topT) / 2, 0);
      conf.add(trestle);
    });

    // 2. 10 Executive Conference Chairs
    for (let c = 0; c < 4; c++) {
      const x = -1.5 + c * 1.0;
      // North side chairs
      const chairN = this._createChairMesh();
      chairN.position.set(x, 0, 0.95);
      chairN.rotation.y = Math.PI;
      conf.add(chairN);

      // South side chairs
      const chairS = this._createChairMesh();
      chairS.position.set(x, 0, -0.95);
      conf.add(chairS);
    }
    // Head & Foot of Table chairs
    const chairE = this._createChairMesh();
    chairE.position.set(2.4, 0, 0);
    chairE.rotation.y = -Math.PI / 2;
    conf.add(chairE);

    const chairW = this._createChairMesh();
    chairW.position.set(-2.4, 0, 0);
    chairW.rotation.y = Math.PI / 2;
    conf.add(chairW);

    // 3. Wall-Mounted 85" 4K Smart Presentation Display
    const tvGroup = new THREE.Group();
    tvGroup.position.set(0, 1.9, 2.15); // Mounted on north dividing wall

    const tvHousing = new THREE.Mesh(
      new THREE.BoxGeometry(1.95, 1.15, 0.05),
      this.materials.cabinetBody
    );
    tvGroup.add(tvHousing);

    // Presentation Canvas Display
    const tvCanvas = document.createElement("canvas");
    tvCanvas.width = 1024;
    tvCanvas.height = 576;
    const ctx = tvCanvas.getContext("2d");
    ctx.fillStyle = "#090d14";
    ctx.fillRect(0, 0, 1024, 576);
    ctx.fillStyle = "#00d4e8";
    ctx.font = "bold 38px 'IBM Plex Sans', sans-serif";
    ctx.fillText("SREdesigns · LAB EXECUTIVE BRIEFING", 60, 80);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px 'IBM Plex Mono', monospace";
    ctx.fillText("Active Cohort: Analytical Chem & Pharmaceutical QC", 60, 130);
    ctx.strokeStyle = "#3dd68c";
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 180, 420, 320);
    ctx.fillStyle = "#3dd68c";
    ctx.font = "bold 26px monospace";
    ctx.fillText("STATION TELEMETRY LIVE", 85, 230);
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "20px monospace";
    ctx.fillText("• UV-Vis: 590 nm Absorbance", 85, 280);
    ctx.fillText("• FTIR: Diamond ATR Scan Complete", 85, 330);
    ctx.fillText("• Dissolution: 37.0°C Paddle Run", 85, 380);
    ctx.fillText("• Karl Fischer: Drift < 20 uL/min", 85, 430);

    const tvTex = new THREE.CanvasTexture(tvCanvas);
    const tvScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.90, 1.10),
      new THREE.MeshBasicMaterial({ map: tvTex })
    );
    tvScreen.position.z = 0.03;
    tvGroup.add(tvScreen);

    conf.add(tvGroup);

    this.root.add(conf);
    this.colliders.push(new THREE.Box3().setFromObject(conf));
  }

  _createChairMesh() {
    const chair = new THREE.Group();
    const basePole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.38, 12),
      this.materials.cabinetHandle
    );
    basePole.position.y = 0.19;
    chair.add(basePole);

    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.06, 0.46),
      this.materials.leatherBlack
    );
    seat.position.y = 0.41;
    chair.add(seat);

    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.55, 0.05),
      this.materials.leatherBlack
    );
    backrest.position.set(0, 0.72, -0.21);
    chair.add(backrest);

    return chair;
  }

  // --- Restroom Fixtures (Zone 7) ---
  _buildRestroomFixtures() {
    const restroom = new THREE.Group();
    restroom.position.set(14.0, 0, -2.25);
    restroom.name = "Restroom_Fixtures";

    // Floating quartz vanity sink
    const vanity = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.18, 0.6),
      this.materials.epoxyTop
    );
    vanity.position.set(0, 0.85, 0.8);
    restroom.add(vanity);

    // Chrome faucet
    const faucet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.22, 12),
      this.materials.chromeFaucet
    );
    faucet.position.set(0, 0.98, 0.85);
    restroom.add(faucet);

    // Backlit LED Halo Wall Mirror
    const mirror = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1.2, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x98a0a8, roughness: 0.1, metalness: 0.9 })
    );
    mirror.position.set(0, 1.7, 1.08);
    restroom.add(mirror);

    // Wall-hung ceramic toilet
    const toilet = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.42, 0.62),
      new THREE.MeshStandardMaterial({ color: 0xf5f7fa, roughness: 0.25 })
    );
    toilet.position.set(0, 0.35, -1.0);
    restroom.add(toilet);

    this.root.add(restroom);
  }

  // --- Safety Equipment Core ---
  _buildSafetyCore() {
    // 2x ANSI Z358.1 Emergency Deluge Shower & Eyewash Stations
    const showerPositions = [
      [-5.0, -1.1],
      [4.0, -1.1]
    ];

    showerPositions.forEach(([sx, sz], i) => {
      const station = new THREE.Group();
      station.position.set(sx, 0, sz);
      station.name = `Safety_Shower_Eyewash_${i + 1}`;

      // Chrome main riser pipe
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 2.5, 12),
        this.materials.chromeFaucet
      );
      pipe.position.y = 1.25;
      station.add(pipe);

      // Yellow deluge shower head
      const showerHead = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.08, 0.12, 16),
        this.materials.safetyYellow
      );
      showerHead.position.set(0, 2.45, 0.35);
      station.add(showerHead);

      // Eyewash stainless steel bowl
      const eyeBowl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.12, 0.1, 16),
        this.materials.cabinetHandle
      );
      eyeBowl.position.set(0, 1.05, 0.25);
      station.add(eyeBowl);

      this.root.add(station);
    });

    // Justrite Yellow 60-Gallon Flammable Storage Cabinet in Storage Vault (Zone 5)
    const flamCab = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.65, 0.86),
      this.materials.safetyYellow
    );
    flamCab.position.set(8.5, 0.825, 6.0);
    flamCab.name = "Justrite_Flammable_Cabinet";
    this.root.add(flamCab);
    this.colliders.push(new THREE.Box3().setFromObject(flamCab));
  }

  _createStorageRacks(cx, cz, len, depth) {
    const rack = new THREE.Group();
    rack.position.set(cx, 0, cz);
    rack.name = "Chemical_Storage_Steel_Racking";

    const rackH = 2.4;
    // 4 Shelves
    for (let s = 0; s < 4; s++) {
      const y = 0.4 + s * 0.55;
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(len, 0.04, depth),
        this.materials.cabinetBody
      );
      shelf.position.y = y;
      rack.add(shelf);
    }

    // Corner uprights
    [[-len / 2 + 0.05, -depth / 2 + 0.05], [len / 2 - 0.05, -depth / 2 + 0.05],
     [-len / 2 + 0.05, depth / 2 - 0.05], [len / 2 - 0.05, depth / 2 - 0.05]].forEach(([ux, uz]) => {
      const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, rackH, 0.06),
        this.materials.cabinetBody
      );
      post.position.set(ux, rackH / 2, uz);
      rack.add(post);
    });

    this.root.add(rack);
    this.colliders.push(new THREE.Box3().setFromObject(rack));
  }
}
