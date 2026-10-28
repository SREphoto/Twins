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
        opacity: 0.35,
        roughness: 0.08,
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

    // 6. Chemical Storage Vault Shelving (Zone 5): North Wall X: 4.5, Z: 8.4, Length: 4.0m, Depth: 0.7m
    this._createStorageRacks(4.5, 8.4, 4.0, 0.7);
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
  // --- Ducted Chemical Fume Hoods ---
  _buildFumeHoods() {
    // 2x 6-Ft Labconco Protector Premier Fume Hoods along Northwest wall (Z = 8.1)
    const hoodXPositions = [-13.5, -9.5];

    hoodXPositions.forEach((hx, idx) => {
      const hood = new THREE.Group();
      hood.position.set(hx, 0, 8.1);
      hood.name = `Labconco_Fume_Hood_${idx + 1}`;

      const hoodW = 1.83; // 6 feet
      const hoodD = 0.95;
      const hoodH = 2.45;
      const baseH = 0.87;
      const cavityH = hoodH - baseH;

      // Base Cabinet with twin chemical-resistant doors
      const baseCab = new THREE.Mesh(
        new THREE.BoxGeometry(hoodW, baseH, hoodD),
        this.materials.fumeHoodSteel
      );
      baseCab.position.y = baseH / 2;
      hood.add(baseCab);

      // Base cabinet stainless handles
      [-0.45, 0.45].forEach((bx) => {
        const handle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.22, 12),
          this.materials.cabinetHandle
        );
        handle.rotation.z = Math.PI / 2;
        handle.position.set(bx, baseH * 0.7, -hoodD / 2 - 0.01);
        hood.add(handle);
      });

      // Chemical Work Surface (Epoxy with dished basin rim)
      const workDeck = new THREE.Mesh(
        new THREE.BoxGeometry(hoodW + 0.02, 0.03, hoodD + 0.02),
        this.materials.epoxyTop
      );
      workDeck.position.y = baseH + 0.015;
      workDeck.receiveShadow = true;
      hood.add(workDeck);

      // --- Upper Open Fume Enclosure Structure ---
      const headerH = 0.38; // Top canopy header with bypass air grill
      const sideWallT = 0.06;
      const innerW = hoodW - sideWallT * 2;
      const openH = cavityH - headerH;

      // 1. Top Bypass Canopy Header
      const header = new THREE.Mesh(
        new THREE.BoxGeometry(hoodW, headerH, hoodD),
        this.materials.fumeHoodSteel
      );
      header.position.set(0, hoodH - headerH / 2, 0);
      hood.add(header);

      // Bypass air slot louvers on header front
      for (let l = 0; l < 4; l++) {
        const louver = new THREE.Mesh(
          new THREE.BoxGeometry(hoodW * 0.75, 0.015, 0.01),
          this.materials.fumeHoodLining
        );
        louver.position.set(0, hoodH - 0.28 + l * 0.05, -hoodD / 2 - 0.005);
        hood.add(louver);
      }

      // Exhaust Duct Collar on Top
      const duct = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.45, 20),
        new THREE.MeshStandardMaterial({ color: 0x5a626f, roughness: 0.35, metalness: 0.7 })
      );
      duct.position.set(0, hoodH + 0.225, 0);
      hood.add(duct);

      // 2. Left and Right Aerodynamic Airfoil Side Stiles
      [-hoodW / 2 + sideWallT / 2, hoodW / 2 - sideWallT / 2].forEach((sx) => {
        const sideWall = new THREE.Mesh(
          new THREE.BoxGeometry(sideWallT, openH, hoodD),
          this.materials.fumeHoodSteel
        );
        sideWall.position.set(sx, baseH + openH / 2, 0);
        hood.add(sideWall);

        // Aerodynamic corner post in front
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, openH, 16),
          this.materials.fumeHoodSteel
        );
        post.position.set(sx > 0 ? sx - 0.01 : sx + 0.01, baseH + openH / 2, -hoodD / 2 + 0.04);
        hood.add(post);
      });

      // 3. Rear Acid-Resistant Baffle Wall
      const rearBaffle = new THREE.Mesh(
        new THREE.BoxGeometry(innerW, openH, 0.04),
        this.materials.fumeHoodLining
      );
      rearBaffle.position.set(0, baseH + openH / 2, hoodD / 2 - 0.03);
      hood.add(rearBaffle);

      // Baffle exhaust suction slots
      [0.2, 0.7, 1.2].forEach((by) => {
        const slot = new THREE.Mesh(
          new THREE.BoxGeometry(innerW * 0.85, 0.03, 0.02),
          new THREE.MeshBasicMaterial({ color: 0x111317 })
        );
        slot.position.set(0, baseH + by, hoodD / 2 - 0.01);
        hood.add(slot);
      });

      // 4. White Molded Seamless Interior Lining Side Panels
      [-innerW / 2 + 0.01, innerW / 2 - 0.01].forEach((lx) => {
        const liner = new THREE.Mesh(
          new THREE.BoxGeometry(0.015, openH - 0.04, hoodD - 0.12),
          this.materials.fumeHoodLining
        );
        liner.position.set(lx, baseH + openH / 2, 0.02);
        hood.add(liner);
      });

      // 5. Sliding Acrylic / Tempered Glass Sash (Raised halfway for clear view)
      const sashW = innerW + 0.04;
      const sashH = 0.65;
      const sash = new THREE.Mesh(
        new THREE.BoxGeometry(sashW, sashH, 0.015),
        this.materials.sashGlass
      );
      // Raised position: bottom of sash is 0.42m above work deck (420mm opening)
      sash.position.set(0, baseH + 0.42 + sashH / 2, -hoodD / 2 + 0.04);
      hood.add(sash);
      this.fumeHoodSashes.push(sash);

      // Brushed Aluminum Full-Width Sash Handle Grip
      const sashHandle = new THREE.Mesh(
        new THREE.BoxGeometry(sashW + 0.02, 0.03, 0.03),
        this.materials.cabinetHandle
      );
      sashHandle.position.set(0, baseH + 0.42, -hoodD / 2 + 0.04);
      hood.add(sashHandle);

      // 6. High-Lumen Vapor-Proof LED Downlight Inside Cavity
      const hoodLight = new THREE.PointLight(0xf4f9ff, 1.4, 5.0, 1.1);
      hoodLight.position.set(0, hoodH - headerH - 0.1, 0.05);
      hoodLight.castShadow = true;
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
    const chairGroup = this._createExecutiveSwivelChair(true);
    chairGroup.position.set(0, 0, -0.65);
    office.add(chairGroup);

    // 2B. Executive Desk Supplies & Learning Workflow Artifacts
    const suppliesGroup = new THREE.Group();
    suppliesGroup.position.set(0, deskH, 0);

    // Large leather desk blotter pad with gold perimeter stitch
    const blotter = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.008, 0.58),
      new THREE.MeshStandardMaterial({ color: 0x181c24, roughness: 0.6, metalness: 0.1 })
    );
    blotter.position.set(0, 0.004, 0.02);
    suppliesGroup.add(blotter);

    // Bound Hardcover Lab Research Notebook
    const notebookGroup = new THREE.Group();
    notebookGroup.position.set(-0.65, 0.015, 0.12);
    notebookGroup.rotation.y = 0.18;

    const nbCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.022, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x0f2942, roughness: 0.5 })
    );
    notebookGroup.add(nbCover);

    const nbCanvas = document.createElement("canvas");
    nbCanvas.width = 256;
    nbCanvas.height = 256;
    const nbCtx = nbCanvas.getContext("2d");
    nbCtx.fillStyle = "#0f2942";
    nbCtx.fillRect(0, 0, 256, 256);
    nbCtx.strokeStyle = "#d4af37";
    nbCtx.lineWidth = 6;
    nbCtx.strokeRect(10, 10, 236, 236);
    nbCtx.fillStyle = "#d4af37";
    nbCtx.font = "bold 18px serif";
    nbCtx.textAlign = "center";
    nbCtx.fillText("LAB NOTEBOOK NO. 4", 128, 60);
    nbCtx.font = "14px sans-serif";
    nbCtx.fillStyle = "#e2e8f0";
    nbCtx.fillText("PHARMACEUTICAL DEV", 128, 100);
    nbCtx.fillText("SRE DESIGNS BIOTECH", 128, 130);
    nbCtx.fillStyle = "#38bdf8";
    nbCtx.font = "bold 13px monospace";
    nbCtx.fillText("GLP COMPLIANT", 128, 180);

    const nbTex = new THREE.CanvasTexture(nbCanvas);
    const nbLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.20, 0.20),
      new THREE.MeshBasicMaterial({ map: nbTex })
    );
    nbLabel.rotation.x = -Math.PI / 2;
    nbLabel.position.y = 0.012;
    notebookGroup.add(nbLabel);
    suppliesGroup.add(notebookGroup);

    // Machined Aluminum Pen Cup with Writing Instruments
    const penHolder = new THREE.Group();
    penHolder.position.set(-0.85, 0, 0.32);
    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.11, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.2, metalness: 0.85 })
    );
    cup.position.y = 0.055;
    penHolder.add(cup);

    // Pens & Highlighters inside cup
    const penMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const hlMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
    [-0.015, 0.012].forEach((px, idx) => {
      const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.14, 8), idx === 0 ? penMat : hlMat);
      pen.position.set(px, 0.08, idx === 0 ? -0.01 : 0.01);
      pen.rotation.z = idx === 0 ? 0.15 : -0.12;
      penHolder.add(pen);
    });
    suppliesGroup.add(penHolder);

    // Ceramic Coffee Mug (SRE DESIGNS LABS)
    const mugGroup = new THREE.Group();
    mugGroup.position.set(0.68, 0, 0.25);
    const mugBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.038, 0.095, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    mugBody.position.y = 0.0475;
    mugGroup.add(mugBody);

    const coffeeFluid = new THREE.Mesh(
      new THREE.CircleGeometry(0.037, 16),
      new THREE.MeshStandardMaterial({ color: 0x27170e, roughness: 0.15 })
    );
    coffeeFluid.rotation.x = -Math.PI / 2;
    coffeeFluid.position.y = 0.088;
    mugGroup.add(coffeeFluid);

    const mugHandle = new THREE.Mesh(
      new THREE.TorusGeometry(0.024, 0.006, 8, 16, Math.PI * 1.2),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    mugHandle.position.set(0.046, 0.048, 0);
    mugHandle.rotation.z = -Math.PI / 2;
    mugGroup.add(mugHandle);
    suppliesGroup.add(mugGroup);

    // Scientific Graphing / Statistical Calculator
    const calc = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.015, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 })
    );
    calc.position.set(-0.62, 0.008, -0.18);
    calc.rotation.y = -0.1;
    suppliesGroup.add(calc);

    // Stacked Acrylic Document In/Out Trays with Review Dossiers
    const docTray = new THREE.Group();
    docTray.position.set(0.82, 0, -0.15);
    for (let t = 0; t < 2; t++) {
      const trayBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.04, 0.34),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.45, roughness: 0.1 })
      );
      trayBase.position.y = 0.02 + t * 0.055;
      docTray.add(trayBase);

      const paper = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.015, 0.30),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 })
      );
      paper.position.y = 0.015 + t * 0.055;
      docTray.add(paper);
    }
    suppliesGroup.add(docTray);

    // Fluorescent Sticky Note Pad
    const postIt = new THREE.Mesh(
      new THREE.BoxGeometry(0.076, 0.01, 0.076),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.7 })
    );
    postIt.position.set(-0.35, 0.006, 0.24);
    suppliesGroup.add(postIt);

    office.add(suppliesGroup);

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
      screenHousing.rotation.y = Math.PI + (i === 0 ? -0.14 : 0.14);
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
      screenFace.position.set(0, 0, 0.016);
      screenHousing.add(screenFace);
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

    // 3. Conference Table Accessories (Executive Blotters, Water Carafes & Tumblers)
    for (let c = 0; c < 4; c++) {
      const x = -1.5 + c * 1.0;
      // North & South seat leather blotters & silver pens
      [-0.45, 0.45].forEach(bz => {
        const bl = new THREE.Mesh(
          new THREE.BoxGeometry(0.52, 0.005, 0.36),
          new THREE.MeshStandardMaterial({ color: 0x181c24, roughness: 0.6 })
        );
        bl.position.set(x, tableH + 0.003, bz);
        conf.add(bl);

        const pen = new THREE.Mesh(
          new THREE.CylinderGeometry(0.003, 0.003, 0.14, 8),
          this.materials.cabinetHandle
        );
        pen.rotation.z = Math.PI / 2;
        pen.position.set(x + 0.18, tableH + 0.008, bz);
        conf.add(pen);
      });
    }
    // Head & Foot blotters
    [-1.75, 1.75].forEach(bx => {
      const bl = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.005, 0.52),
        new THREE.MeshStandardMaterial({ color: 0x181c24, roughness: 0.6 })
      );
      bl.position.set(bx, tableH + 0.003, 0);
      conf.add(bl);

      const pen = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.003, 0.14, 8),
        this.materials.cabinetHandle
      );
      pen.rotation.x = Math.PI / 2;
      pen.position.set(bx, tableH + 0.008, 0.18);
      conf.add(pen);
    });

    // 2 Crystal-Clear Glass Water Carafes & Tumblers along table centerline
    [-0.7, 0.7].forEach(cx => {
      const carafe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.065, 0.22, 16),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, roughness: 0.1 })
      );
      carafe.position.set(cx, tableH + 0.11, 0);
      conf.add(carafe);

      [-0.12, 0.12].forEach(tz => {
        const tumbler = new THREE.Mesh(
          new THREE.CylinderGeometry(0.032, 0.028, 0.09, 16),
          new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, roughness: 0.1 })
        );
        tumbler.position.set(cx, tableH + 0.045, tz);
        conf.add(tumbler);
      });
    });

    // 4. Magnetic Glass Dry-Erase Whiteboard on West Wall (X = -2.15, Z = 0)
    const wbGroup = new THREE.Group();
    wbGroup.position.set(-2.15, 1.85, 0);
    wbGroup.rotation.y = Math.PI / 2;

    const wbBoard = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.2, 0.015),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.05 })
    );
    wbGroup.add(wbBoard);

    const wbTray = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.02, 0.08),
      this.materials.cabinetHandle
    );
    wbTray.position.set(0, -0.61, 0.04);
    wbGroup.add(wbTray);

    // Markers & Felt Eraser
    const mColors = [0x0f172a, 0x0284c7, 0xdc2626, 0x16a34a];
    mColors.forEach((mc, i) => {
      const m = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.007, 0.12, 8),
        new THREE.MeshStandardMaterial({ color: mc, roughness: 0.3 })
      );
      m.rotation.z = Math.PI / 2;
      m.position.set(-0.6 + i * 0.14, -0.59, 0.04);
      wbGroup.add(m);
    });
    const eraser = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.035, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 })
    );
    eraser.position.set(0.6, -0.59, 0.04);
    wbGroup.add(eraser);
    conf.add(wbGroup);

    // 5. Wall-Mounted 85" 4K Smart Presentation Display
    const tvGroup = new THREE.Group();
    tvGroup.position.set(0, 1.9, 2.15); // Mounted on north dividing wall

    const tvHousing = new THREE.Mesh(
      new THREE.BoxGeometry(1.95, 1.15, 0.05),
      this.materials.cabinetBody
    );
    tvHousing.rotation.y = Math.PI; // Face south towards conference table
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
    tvScreen.position.set(0, 0, 0.026);
    tvHousing.add(tvScreen);

    conf.add(tvGroup);

    this.root.add(conf);
    this.colliders.push(new THREE.Box3().setFromObject(conf));
  }

  // --- High-Fidelity 5-Star Caster Ergonomic Swivel Chair ---
  _createExecutiveSwivelChair(isExecutive = false) {
    const chair = new THREE.Group();

    // 1. Five-Star Spider Base & Rolling Casters
    const baseHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.05, 16),
      this.materials.cabinetHandle
    );
    baseHub.position.y = 0.075;
    chair.add(baseHub);

    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5;
      const prongGroup = new THREE.Group();
      prongGroup.rotation.y = angle;

      // Arched chrome prong arm
      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.025, 0.28),
        this.materials.cabinetHandle
      );
      arm.position.set(0, 0.065, 0.14);
      arm.rotation.x = -0.12; // Arched downward toward floor
      prongGroup.add(arm);

      // Caster hood & dual rolling nylon wheels
      const casterHood = new THREE.Mesh(
        new THREE.BoxGeometry(0.038, 0.025, 0.038),
        this.materials.cabinetBody
      );
      casterHood.position.set(0, 0.035, 0.275);
      prongGroup.add(casterHood);

      const wheelGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.028, 12);
      const wheel = new THREE.Mesh(wheelGeo, this.materials.cabinetBody);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(0, 0.022, 0.275);
      prongGroup.add(wheel);

      chair.add(prongGroup);
    }

    // 2. Pneumatic Telescoping Cylinder
    const lowerPillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.032, 0.12, 16),
      this.materials.cabinetBody
    );
    lowerPillar.position.y = 0.14;
    chair.add(lowerPillar);

    const upperPiston = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.18, 16),
      this.materials.cabinetHandle
    );
    upperPiston.position.y = 0.27;
    chair.add(upperPiston);

    // 3. Steel Synchro-Tilt Mechanism Chassis & Pneumatic Paddle Lever
    const mechBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.05, 0.22),
      this.materials.cabinetBody
    );
    mechBox.position.y = 0.36;
    chair.add(mechBox);

    const tiltKnob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.05, 12),
      this.materials.cabinetBody
    );
    tiltKnob.position.set(0, 0.32, 0.06);
    chair.add(tiltKnob);

    const lever = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.012, 0.025),
      this.materials.cabinetHandle
    );
    lever.position.set(0.14, 0.36, -0.02);
    chair.add(lever);

    // 4. Contoured Waterfall Seat Cushion
    const seatW = isExecutive ? 0.54 : 0.48;
    const seatD = isExecutive ? 0.50 : 0.46;
    const seatH = isExecutive ? 0.08 : 0.065;

    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(seatW, seatH, seatD),
      this.materials.leatherBlack
    );
    seat.position.set(0, 0.41 + seatH / 2, 0.02);
    chair.add(seat);

    // 5. Heavy-Duty J-Bar Spine Support
    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.36, 0.03),
      this.materials.cabinetHandle
    );
    spine.position.set(0, 0.55, -seatD / 2 + 0.01);
    spine.rotation.x = 0.1;
    chair.add(spine);

    // 6. Ergonomic High Backrest with Lumbar Contour
    const backH = isExecutive ? 0.62 : 0.54;
    const backW = isExecutive ? 0.50 : 0.46;
    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(backW, backH, 0.06),
      this.materials.leatherBlack
    );
    backrest.position.set(0, 0.45 + backH / 2, -seatD / 2 - 0.02);
    backrest.rotation.x = -0.08; // Comfortable natural recline
    chair.add(backrest);

    // Lower Lumbar Contour Cushion
    const lumbar = new THREE.Mesh(
      new THREE.BoxGeometry(backW * 0.85, 0.14, 0.04),
      this.materials.leatherBlack
    );
    lumbar.position.set(0, 0.58, -seatD / 2 + 0.01);
    chair.add(lumbar);

    // 7. Cantilevered Ergonomic Armrests with Polyurethane Pads
    [-seatW / 2 - 0.02, seatW / 2 + 0.02].forEach(ax => {
      const upright = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.24, 0.035),
        this.materials.cabinetHandle
      );
      upright.position.set(ax, 0.52, -0.02);
      chair.add(upright);

      const pad = new THREE.Mesh(
        new THREE.BoxGeometry(0.075, 0.03, 0.24),
        this.materials.cabinetBody
      );
      pad.position.set(ax, 0.64, 0.02);
      chair.add(pad);
    });

    // 8. Executive Headrest (for Executive version)
    if (isExecutive) {
      [-0.06, 0.06].forEach(hx => {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.14, 12),
          this.materials.cabinetHandle
        );
        post.position.set(hx, 1.05, -seatD / 2 - 0.06);
        chair.add(post);
      });

      const headrest = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.15, 0.07),
        this.materials.leatherBlack
      );
      headrest.position.set(0, 1.10, -seatD / 2 - 0.05);
      chair.add(headrest);
    }

    return chair;
  }

  _createChairMesh() {
    return this._createExecutiveSwivelChair(false);
  }

  // --- Complete ADA Restroom (Zone 7: X = 8.0 to 11.60, Z = -4.55 to 0.0) ---
  _buildRestroomFixtures() {
    const restroom = new THREE.Group();
    restroom.position.set(9.80, 0, -2.25);
    restroom.name = "Restroom_Fixtures";

    // 1. Non-Slip Charcoal Porcelain Floor Slab (X: 8.0 to 11.60, Z: -4.55 to 0.0)
    const floorSlab = new THREE.Mesh(
      new THREE.BoxGeometry(3.55, 0.01, 4.45),
      new THREE.MeshStandardMaterial({ color: 0x181b22, roughness: 0.75, metalness: 0.1 })
    );
    floorSlab.position.set(0, 0.005, 0);
    restroom.add(floorSlab);

    // Recessed stainless steel floor drain grate
    const drainGrate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.012, 16),
      this.materials.cabinetHandle
    );
    drainGrate.position.set(0, 0.011, 0);
    restroom.add(drainGrate);

    // Dedicated Ceiling Downlight
    const rLight = new THREE.PointLight(0xfff8ed, 1.2, 8.0, 1.2);
    rLight.position.set(0, 3.2, 0);
    restroom.add(rLight);

    // 2. White Subway Tile Wainscoting Accent Wall along North wall (Z = +2.22)
    const tileAccent = new THREE.Mesh(
      new THREE.BoxGeometry(3.55, 2.2, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2, metalness: 0.05 })
    );
    tileAccent.position.set(0, 1.1, 2.22);
    restroom.add(tileAccent);

    // 3. Floating Dark Quartz Vanity with Under-Mount Porcelain Basin along North Wall
    const vanityGroup = new THREE.Group();
    vanityGroup.position.set(0, 0, 1.85);

    const vanityTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.14, 0.62),
      this.materials.epoxyTop
    );
    vanityTop.position.set(0, 0.83, 0);
    vanityGroup.add(vanityTop);

    // Under-mount porcelain sink basin
    const basin = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.22, 0.38),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 })
    );
    basin.position.set(0, 0.72, 0);
    vanityGroup.add(basin);

    // Chrome Touchless Gooseneck Sensor Faucet
    const faucetCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0.12),
      new THREE.Vector3(0, 0.22, 0.12),
      new THREE.Vector3(0, 0.28, 0.06),
      new THREE.Vector3(0, 0.24, 0)
    ]);
    const faucetGeo = new THREE.TubeGeometry(faucetCurve, 16, 0.012, 12, false);
    const faucet = new THREE.Mesh(faucetGeo, this.materials.chromeFaucet);
    faucet.position.set(0, 0.90, 0);
    vanityGroup.add(faucet);

    // Chrome P-trap plumbing under vanity
    const pTrap = new THREE.Mesh(
      new THREE.TorusGeometry(0.05, 0.015, 8, 16, Math.PI),
      this.materials.cabinetHandle
    );
    pTrap.rotation.x = Math.PI / 2;
    pTrap.position.set(0, 0.50, 0);
    vanityGroup.add(pTrap);

    // Backlit LED Halo Wall Vanity Mirror on North Wall
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(0, 1.72, 0.36);

    const mirrorBack = new THREE.Mesh(
      new THREE.BoxGeometry(1.22, 0.97, 0.03),
      new THREE.MeshBasicMaterial({ color: 0xfef08a }) // Warm 3000K halo rim
    );
    mirrorGroup.add(mirrorBack);

    const mirrorGlass = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 0.93, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xa0a8b4, roughness: 0.08, metalness: 0.92 })
    );
    mirrorGlass.position.z = -0.015;
    mirrorGroup.add(mirrorGlass);
    vanityGroup.add(mirrorGroup);

    // Touchless Soap Dispenser
    const soapDisp = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.24, 0.09),
      this.materials.cabinetHandle
    );
    soapDisp.position.set(0.65, 1.18, 0.32);
    vanityGroup.add(soapDisp);

    restroom.add(vanityGroup);

    // 4. Vitreous China Wall-Hung Commercial Toilet on West Wall (facing East +X)
    const toiletGroup = new THREE.Group();
    toiletGroup.position.set(-1.45, 0, -0.80);
    toiletGroup.rotation.y = Math.PI / 2; // Face East into restroom

    // Elongated porcelain bowl
    const bowl = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.40, 0.62),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 })
    );
    bowl.position.set(0, 0.38, 0.15);
    toiletGroup.add(bowl);

    // Open-front commercial seat
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.03, 0.48),
      this.materials.cabinetBody
    );
    seat.position.set(0, 0.41, 0.18);
    toiletGroup.add(seat);

    // Sloan Royal Chrome Flushometer Valve with ADA vacuum breaker
    const flushRiser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.55, 12),
      this.materials.chromeFaucet
    );
    flushRiser.position.set(0, 0.68, -0.12);
    toiletGroup.add(flushRiser);

    const flushBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.09, 16),
      this.materials.chromeFaucet
    );
    flushBody.position.set(0, 0.88, -0.12);
    toiletGroup.add(flushBody);

    const flushLever = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, 0.12, 8),
      this.materials.chromeFaucet
    );
    flushLever.rotation.z = Math.PI / 2;
    flushLever.position.set(0.08, 0.88, -0.12);
    toiletGroup.add(flushLever);

    // ADA Stainless Steel Grab Bars
    // Side Wall 42" Horizontal Grab Bar
    const sideBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 1.06, 12),
      this.materials.cabinetHandle
    );
    sideBar.rotation.x = Math.PI / 2;
    sideBar.position.set(0.55, 0.86, 0.2);
    toiletGroup.add(sideBar);

    // Rear Wall 36" Horizontal Grab Bar
    const rearBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.92, 12),
      this.materials.cabinetHandle
    );
    rearBar.rotation.z = Math.PI / 2;
    rearBar.position.set(0, 0.86, -0.25);
    toiletGroup.add(rearBar);

    restroom.add(toiletGroup);

    // 5. Dyson-Style Touchless High-Speed Hand Dryer on East Wall
    const dryer = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.65, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.25, metalness: 0.75 })
    );
    dryer.position.set(1.68, 1.15, 0.85);
    dryer.rotation.y = -Math.PI / 2; // Face West into room
    restroom.add(dryer);

    // 6. Stainless Jumbo Toilet Paper Dispenser
    const tpDisp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16),
      this.materials.cabinetHandle
    );
    tpDisp.rotation.x = Math.PI / 2;
    tpDisp.position.set(-1.72, 0.65, -0.35);
    restroom.add(tpDisp);

    // 7. Restroom Entrance Door & ADA Tactile Sign on East Wall (X = +1.77 relative to group = 11.57 absolute)
    const doorGroup = new THREE.Group();
    doorGroup.position.set(1.77, 0, 0); // At X = 11.57 in world space

    // Hollow Architectural Bronze Door Frame (Header + Two Side Jambs)
    const frameMat = this.materials.cabinetBody;
    const header = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.18), frameMat);
    header.position.set(0, 2.36, 0);
    doorGroup.add(header);

    const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.40, 0.08), frameMat);
    leftJamb.position.set(0, 1.20, -0.55);
    doorGroup.add(leftJamb);

    const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.40, 0.08), frameMat);
    rightJamb.position.set(0, 1.20, 0.55);
    doorGroup.add(rightJamb);

    // American Walnut Door Leaf (Swung open into restroom by 50° for welcoming view)
    const doorLeafGroup = new THREE.Group();
    doorLeafGroup.position.set(0, 0, -0.51); // Hinge pivot
    doorLeafGroup.rotation.y = -0.85; // Open into restroom

    const leaf = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 2.32, 0.98),
      this.materials.walnutDesk
    );
    leaf.position.set(0, 1.16, 0.49);
    doorLeafGroup.add(leaf);

    // Matte Black Commercial Lever Handle
    const leverIn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.12, 12),
      this.materials.cabinetBody
    );
    leverIn.rotation.x = Math.PI / 2;
    leverIn.position.set(0.03, 1.05, 0.88);
    doorLeafGroup.add(leverIn);

    // Satin Stainless Kick Plate
    const kickPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.048, 0.24, 0.98),
      this.materials.cabinetHandle
    );
    kickPlate.position.set(0, 0.12, 0.49);
    doorLeafGroup.add(kickPlate);

    doorGroup.add(doorLeafGroup);

    // ADA Braille / Pictogram Plaque on Exterior Corridor Jamb facing East (+X into corridor)
    const adaSignBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.24, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
    );
    adaSignBox.position.set(0.06, 1.5, 0.65);
    doorGroup.add(adaSignBox);

    const adaCanvas = document.createElement("canvas");
    adaCanvas.width = 128;
    adaCanvas.height = 160;
    const adaCtx = adaCanvas.getContext("2d");
    adaCtx.fillStyle = "#0284c7";
    adaCtx.fillRect(0, 0, 128, 160);
    adaCtx.fillStyle = "#ffffff";
    adaCtx.font = "bold 15px sans-serif";
    adaCtx.textAlign = "center";
    adaCtx.fillText("RESTROOM", 64, 40);
    adaCtx.fillText("ALL-GENDER", 64, 70);
    adaCtx.font = "12px monospace";
    adaCtx.fillText("♿ ADA", 64, 110);
    adaCtx.fillText("• • • • •", 64, 135);

    const adaTex = new THREE.CanvasTexture(adaCanvas);
    const adaMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 0.24),
      new THREE.MeshBasicMaterial({ map: adaTex })
    );
    adaMesh.rotation.y = Math.PI / 2; // Face East into entrance corridor
    adaMesh.position.set(0.075, 1.5, 0.65);
    doorGroup.add(adaMesh);

    // Exterior Architectural Brass Sconce Light above ADA Sign
    const sconceArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.02, 0.04),
      this.materials.cabinetHandle
    );
    sconceArm.position.set(0.06, 1.78, 0.65);
    doorGroup.add(sconceArm);

    const sconceLight = new THREE.PointLight(0xfff1db, 0.85, 3.5);
    sconceLight.position.set(0.12, 1.78, 0.65);
    doorGroup.add(sconceLight);

    restroom.add(doorGroup);

    this.root.add(restroom);
    this.colliders.push(new THREE.Box3().setFromObject(restroom));
  }

  // --- Relocated ANSI Z358.1 Safety Showers (Clamped to Concrete Structural Columns) ---
  _buildSafetyCore() {
    // Station 1: Clamped to Concrete Structural Pillar 1 (X = -2.0, Z = 0.35, facing North +Z)
    // Station 2: Clamped to Concrete Structural Pillar 3 (X = -6.0, Z = 5.65, facing South -Z)
    const stations = [
      { x: -2.0, z: 0.35, rotY: 0, id: "Safety_Shower_Column_1" },
      { x: -6.0, z: 5.65, rotY: Math.PI, id: "Safety_Shower_Column_2" }
    ];

    stations.forEach((st) => {
      const station = new THREE.Group();
      station.position.set(st.x, 0, st.z);
      station.rotation.y = st.rotY;
      station.name = st.id;

      // 1. ANSI Z358.1 High-Contrast Yellow/Black Diagonal Hazard Floor Perimeter (1.0m x 1.0m)
      const hazardCanvas = document.createElement("canvas");
      hazardCanvas.width = 256;
      hazardCanvas.height = 256;
      const hCtx = hazardCanvas.getContext("2d");
      hCtx.fillStyle = "#facc15";
      hCtx.fillRect(0, 0, 256, 256);
      hCtx.fillStyle = "#0f172a";
      for (let d = -256; d < 512; d += 36) {
        hCtx.beginPath();
        hCtx.moveTo(d, 0);
        hCtx.lineTo(d + 18, 0);
        hCtx.lineTo(d - 18 + 256, 256);
        hCtx.lineTo(d - 36 + 256, 256);
        hCtx.fill();
      }
      hCtx.strokeStyle = "#dc2626";
      hCtx.lineWidth = 10;
      hCtx.strokeRect(5, 5, 246, 246);

      const hazardTex = new THREE.CanvasTexture(hazardCanvas);
      const floorMat = new THREE.Mesh(
        new THREE.PlaneGeometry(1.0, 1.0),
        new THREE.MeshBasicMaterial({ map: hazardTex })
      );
      floorMat.rotation.x = -Math.PI / 2;
      floorMat.position.set(0, 0.003, 0.50);
      station.add(floorMat);

      // Stainless steel flush floor drain grate
      const drainGrate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.008, 16),
        this.materials.cabinetHandle
      );
      drainGrate.position.set(0, 0.006, 0.50);
      station.add(drainGrate);

      // 2. Heavy 1-1/4" Schedule 40 Water Supply Riser Pipe clamped to pillar face
      const riserPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, 2.55, 16),
        this.materials.chromeFaucet
      );
      riserPipe.position.set(0, 1.275, 0.06);
      station.add(riserPipe);

      // Heavy stanchion mounting brackets clamped to column with 4 hex bolts
      [0.6, 1.4, 2.2].forEach(by => {
        const bracket = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.04, 0.08),
          this.materials.cabinetBody
        );
        bracket.position.set(0, by, 0.03);
        station.add(bracket);
      });

      // 3. Overhead Horizontal Deluge Arm extending 0.60m into safety zone
      const delugeArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.55, 12),
        this.materials.chromeFaucet
      );
      delugeArm.rotation.x = Math.PI / 2;
      delugeArm.position.set(0, 2.50, 0.32);
      station.add(delugeArm);

      // Spin-Cast High-Visibility Yellow Deluge Showerhead at Y = 2.45m
      const showerHead = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.08, 0.14, 24),
        this.materials.safetyYellow
      );
      showerHead.position.set(0, 2.45, 0.55);
      station.add(showerHead);

      // Stainless Steel Triangular Pull Rod Actuator hanging to Y = 1.65m
      const pullRod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.80, 8),
        this.materials.cabinetHandle
      );
      pullRod.position.set(0.12, 2.05, 0.52);
      station.add(pullRod);

      const pullTriangle = new THREE.Mesh(
        new THREE.TorusGeometry(0.05, 0.006, 6, 3),
        this.materials.safetyYellow
      );
      pullTriangle.position.set(0.12, 1.65, 0.52);
      station.add(pullTriangle);

      // 4. Stainless Eyewash Assembly at Y = 1.05m
      const eyewashArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 0.35, 12),
        this.materials.chromeFaucet
      );
      eyewashArm.rotation.x = Math.PI / 2;
      eyewashArm.position.set(0, 1.05, 0.22);
      station.add(eyewashArm);

      const eyeBowl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.17, 0.11, 0.10, 24),
        this.materials.cabinetHandle
      );
      eyeBowl.position.set(0, 1.05, 0.40);
      station.add(eyeBowl);

      // Dual aerated spray nozzles with yellow dust caps
      [-0.045, 0.045].forEach(nx => {
        const nozzle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.04, 8),
          this.materials.safetyYellow
        );
        nozzle.position.set(nx, 1.10, 0.40);
        station.add(nozzle);
      });

      // Push Flag Handle (PUSH TO OPERATE)
      const pushFlag = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, 0.08, 0.14),
        this.materials.safetyYellow
      );
      pushFlag.position.set(0.18, 1.08, 0.40);
      station.add(pushFlag);

      // 5. High-Visibility Green/White ANSI Emergency Sign on Column at Y = 2.85m
      const signMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.22, 0.015),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3 })
      );
      signMesh.position.set(0, 2.85, 0.02);
      station.add(signMesh);

      const sCanvas = document.createElement("canvas");
      sCanvas.width = 256;
      sCanvas.height = 160;
      const sCtx = sCanvas.getContext("2d");
      sCtx.fillStyle = "#15803d";
      sCtx.fillRect(0, 0, 256, 160);
      sCtx.fillStyle = "#ffffff";
      sCtx.font = "bold 22px sans-serif";
      sCtx.textAlign = "center";
      sCtx.fillText("EMERGENCY", 128, 40);
      sCtx.font = "18px sans-serif";
      sCtx.fillText("SHOWER & EYEWASH", 128, 75);
      sCtx.font = "14px monospace";
      sCtx.fillText("KEEP CLEAR AT ALL TIMES", 128, 125);

      const sTex = new THREE.CanvasTexture(sCanvas);
      const sPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.34, 0.21),
        new THREE.MeshBasicMaterial({ map: sTex })
      );
      sPlane.position.set(0, 2.85, 0.03);
      station.add(sPlane);

      this.root.add(station);
    });

    // Justrite Yellow 60-Gallon Flammable Storage Cabinet in Storage Vault (Zone 5, North Wall)
    const flamCab = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.65, 0.86),
      this.materials.safetyYellow
    );
    flamCab.position.set(1.5, 0.825, 8.3);
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
