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
    this._buildGrandReceptionAndLounge();
    this._buildUserOfficeFurniture();
    this._buildConferenceRoomFurniture();
    this._buildOfficesSuite();
    this._buildBreakRoom();
    this._buildRestroomFixtures();
    this._buildMensLockerRoom();
    this._buildWomensLockerRoom();
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
      }),
      // Executive Suite & Boardroom Materials
      walnutSlat: new THREE.MeshStandardMaterial({
        color: 0x482d1c,
        roughness: 0.45,
        metalness: 0.05,
        name: "Mat_Walnut_Acoustic_Slat"
      }),
      acousticFelt: new THREE.MeshStandardMaterial({
        color: 0x15181e,
        roughness: 0.95,
        metalness: 0.0,
        name: "Mat_Black_Acoustic_Felt"
      }),
      carraraMarble: new THREE.MeshStandardMaterial({
        color: 0xecf0f4,
        roughness: 0.15,
        metalness: 0.05,
        name: "Mat_Carrara_White_Marble"
      }),
      boucleFabric: new THREE.MeshStandardMaterial({
        color: 0x242832,
        roughness: 0.92,
        metalness: 0.0,
        name: "Mat_Charcoal_Boucle_Fabric"
      }),
      brassAccent: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.25,
        metalness: 0.88,
        name: "Mat_Brushed_Brass"
      }),
      screenBezelMetal: new THREE.MeshStandardMaterial({
        color: 0x14171d,
        roughness: 0.28,
        metalness: 0.82,
        name: "Mat_Screen_Microbezel"
      }),
      standAnodized: new THREE.MeshStandardMaterial({
        color: 0x7c8491,
        roughness: 0.22,
        metalness: 0.85,
        name: "Mat_Anodized_Monitor_Stand"
      }),
      cableBraided: new THREE.MeshStandardMaterial({
        color: 0x111317,
        roughness: 0.75,
        metalness: 0.1,
        name: "Mat_Braided_Cable"
      }),
      leatherMat: new THREE.MeshStandardMaterial({
        color: 0x1b1f26,
        roughness: 0.65,
        metalness: 0.05,
        name: "Mat_Executive_Desk_Mat"
      }),
      rugTextile: new THREE.MeshStandardMaterial({
        color: 0x222731,
        roughness: 0.95,
        metalness: 0.0,
        name: "Mat_Architectural_Area_Rug"
      }),
      espressoChrome: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.12,
        metalness: 0.95,
        name: "Mat_Espresso_Polished_Chrome"
      }),
      porcelainWhite: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.15,
        metalness: 0.05,
        name: "Mat_White_Porcelain"
      }),
      oakHerringbone: new THREE.MeshStandardMaterial({
        color: 0x2e231b,
        roughness: 0.5,
        metalness: 0.05,
        name: "Mat_Smoked_Oak_Herringbone"
      }),
      lockerSteel: new THREE.MeshStandardMaterial({
        color: 0x1c222b,
        roughness: 0.42,
        metalness: 0.45,
        name: "Mat_Locker_Charcoal_Steel"
      }),
      lockerChampagne: new THREE.MeshStandardMaterial({
        color: 0x8a7a68,
        roughness: 0.32,
        metalness: 0.75,
        name: "Mat_Locker_Champagne_Steel"
      }),
      benchOakButcher: new THREE.MeshStandardMaterial({
        color: 0x5a3e26,
        roughness: 0.48,
        metalness: 0.05,
        name: "Mat_Oak_Butcher_Bench"
      }),
      frostedShowerDoor: new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0,
        transparent: true,
        opacity: 0.65,
        roughness: 0.42,
        metalness: 0.05,
        ior: 1.48,
        name: "Mat_Frosted_Shower_Door"
      }),
      receptionStone: new THREE.MeshStandardMaterial({
        color: 0xdcd8cf,
        roughness: 0.35,
        metalness: 0.08,
        name: "Mat_Fluted_Travertine_Stone"
      }),
      velvetLounge: new THREE.MeshStandardMaterial({
        color: 0x144026,
        roughness: 0.88,
        metalness: 0.02,
        name: "Mat_Emerald_Velvet_Ottoman"
      }),
      kitchenQuartz: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.18,
        metalness: 0.08,
        name: "Mat_Calacatta_Kitchen_Quartz"
      }),
      kitchenCabinetSlate: new THREE.MeshStandardMaterial({
        color: 0x252a34,
        roughness: 0.62,
        metalness: 0.15,
        name: "Mat_Kitchen_Slate_Cabinet"
      }),
      stainlessAppliance: new THREE.MeshStandardMaterial({
        color: 0xd8dde4,
        roughness: 0.22,
        metalness: 0.88,
        name: "Mat_Brushed_Stainless_Appliance"
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

  _createDefaultMonitorCanvas(uiType = "default") {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0a0e17";
    ctx.fillRect(0, 0, 1024, 640);

    // Header bar
    ctx.fillStyle = "#141c2b";
    ctx.fillRect(0, 0, 1024, 48);
    ctx.fillStyle = "#00d4e8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("CHEMMATE WORKSTATION · OS 4.2", 24, 32);

    if (uiType === "reception_lims") {
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("VISITOR ACCESS CONTROL & BADGE SYSTEM", 24, 110);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "18px monospace";
      ctx.fillText("ACTIVE VISITORS LOGGED: 4 | NDA STATUS: VERIFIED", 24, 150);
      ctx.fillText("SECURITY GATE: OPEN | BADGE PRINTER: READY", 24, 185);

      ctx.fillStyle = "#1e293b";
      ctx.fillRect(24, 220, 976, 380);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 20px monospace";
      ctx.fillText("TIME        NAME               AFFILIATION       STATUS", 44, 260);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "16px monospace";
      ctx.fillText("08:15 AM    Dr. Elena Rostova  Novartis Biotech   CHECKED IN", 44, 305);
      ctx.fillText("09:30 AM    Marcus Vance       FDA Inspector      ESCORTEED", 44, 345);
      ctx.fillText("10:00 AM    Sarah Jenkins      USP Compliance     IN LAB QC", 44, 385);
      ctx.fillText("11:15 AM    Alexander Thorne   Genentech Clinical PRE-REGISTERED", 44, 425);
    } else if (uiType === "lims_admin") {
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("FACILITY ADMINISTRATION & COMPLIANCE HUD", 24, 110);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "18px monospace";
      ctx.fillText("INSTRUMENT CALIBRATIONS: 17/17 COMPLIANT (21 CFR Part 11)", 24, 150);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(24, 180, 460, 420);
      ctx.fillRect(510, 180, 490, 420);
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 20px monospace";
      ctx.fillText("SAFETY INVENTORY AUDIT", 44, 220);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "16px monospace";
      ctx.fillText("• Flammables Vault: 42 Gal (OK)", 44, 265);
      ctx.fillText("• Acid Waste: Neutralized", 44, 305);
      ctx.fillText("• Eye Wash Weekly Flow: PASS", 44, 345);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 20px monospace";
      ctx.fillText("MAINTENANCE SCHEDULE", 530, 220);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "16px monospace";
      ctx.fillText("• Agilent 1260 HPLC: Recalibrated", 530, 265);
      ctx.fillText("• Erweka DT950: Paddle Depth OK", 530, 305);
      ctx.fillText("• Labconco Hoods: 104 FPM (PASS)", 530, 345);
    } else {
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("CHEMMATE RESEARCH & INSTRUCTION CONSOLE", 24, 110);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "18px monospace";
      ctx.fillText("ANALYTICAL KINETICS & SPECTRAL TELEMETRY", 24, 150);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(24, 190, 976, 410);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 40; x < 980; x += 10) {
        const y = 400 - Math.sin((x - 40) * 0.02) * 120 * Math.exp(-((x - 500) ** 2) / 40000);
        if (x === 40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    return canvas;
  }

  // --- Helper: Ultra-Realistic Workstation Monitor Builder ---
  _createRealisticWorkstationMonitor(opts) {
    const group = new THREE.Group();
    group.name = opts.name || "Realistic_Monitor";
    group.position.set(opts.x || 0, opts.y || 0, opts.z || 0);
    group.rotation.y = opts.rotY || 0; // Rotate entire assembly together

    const monW = opts.screenW || 0.72; // ~32" widescreen diagonal
    const monH = opts.screenH || 0.42;
    const standH = opts.standH || 0.30;

    // 1. Heavy Weighted Low-Profile Trapezoidal Cast Aluminum Base (Behind screen under column)
    const baseW = 0.24;
    const baseD = 0.22;
    const baseH = 0.012;
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(baseW, baseH, baseD),
      this.materials.standAnodized
    );
    base.position.set(0, baseH / 2, -0.06);
    base.castShadow = true;
    group.add(base);

    // 4 Rubber Anti-Slip Foot Pads
    [[-baseW / 2 + 0.02, -baseD / 2 + 0.02], [baseW / 2 - 0.02, -baseD / 2 + 0.02],
     [-baseW / 2 + 0.02, baseD / 2 - 0.02], [baseW / 2 - 0.02, baseD / 2 - 0.02]].forEach(([px, pz]) => {
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.003, 8),
        this.materials.cabinetBody
      );
      foot.position.set(px, 0.0015, -0.06 + pz);
      group.add(foot);
    });

    // 2. Extruded Telescoping Vertical Column (Firmly BEHIND the screen plane at Z = -0.09)
    const colW = 0.048;
    const colD = 0.038;
    const colH = standH + 0.06;
    const column = new THREE.Mesh(
      new THREE.BoxGeometry(colW, colH, colD),
      this.materials.standAnodized
    );
    column.position.set(0, colH / 2, -0.09);
    group.add(column);

    // Oval Cable Management Pass-Through Portal in the Column
    const portalRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.016, 0.004, 8, 16),
      this.materials.cabinetBody
    );
    portalRim.rotation.y = Math.PI / 2;
    portalRim.position.set(0, 0.12, -0.09);
    group.add(portalRim);

    // 3. Articulated Tilt & Swivel Knuckle (Bridging from Column Z = -0.09 to VESA Plate Z = -0.015)
    const knuckleGroup = new THREE.Group();
    knuckleGroup.position.set(0, standH, -0.05);

    const knucklePivot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.045, 12),
      this.materials.cabinetHandle
    );
    knucklePivot.rotation.x = Math.PI / 2;
    knuckleGroup.add(knucklePivot);

    // 4. VESA 100x100 Mounting Interface Plate (Attached to rear of display)
    const vesaPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.11, 0.006),
      this.materials.screenBezelMetal
    );
    vesaPlate.position.set(0, 0, 0.025);
    knuckleGroup.add(vesaPlate);

    // 4 Genuine M4 Hex Socket Cap Screws in 100mm Pattern
    [[-0.05, -0.05], [0.05, -0.05], [-0.05, 0.05], [0.05, 0.05]].forEach(([vx, vy]) => {
      const screw = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0035, 0.0035, 0.004, 8),
        this.materials.cabinetHandle
      );
      screw.rotation.x = Math.PI / 2;
      screw.position.set(vx, vy, 0.029);
      knuckleGroup.add(screw);
    });
    group.add(knuckleGroup);

    // 5. Display Chassis with Sculpted Curved Rear Enclosure (In FRONT of stand at Z = 0.0)
    const displayHead = new THREE.Group();
    displayHead.position.set(0, standH, 0.0);

    // Curved rear housing (thicker in center, razor-thin at borders)
    const rearHousing = new THREE.Mesh(
      new THREE.BoxGeometry(monW, monH, 0.026),
      this.materials.cabinetBody
    );
    rearHousing.position.set(0, 0, 0.013);
    displayHead.add(rearHousing);

    // Top Heat Dissipation Louver Grill
    const louverGrill = new THREE.Mesh(
      new THREE.BoxGeometry(monW * 0.75, 0.015, 0.004),
      this.materials.screenBezelMetal
    );
    louverGrill.position.set(0, monH / 2 - 0.02, 0.001);
    displayHead.add(louverGrill);

    // Recessed Bottom I/O Bay (Facing Downward)
    const ioBay = new THREE.Group();
    ioBay.position.set(0, -monH / 2 + 0.03, 0.01);

    // DisplayPort 1.4 Port
    const dpPort = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.008, 0.012),
      this.materials.cabinetHandle
    );
    dpPort.position.set(-0.06, -0.01, 0);
    ioBay.add(dpPort);

    // Dual HDMI 2.1 Ports
    [-0.025, 0.005].forEach((hx) => {
      const hdmi = new THREE.Mesh(
        new THREE.BoxGeometry(0.016, 0.006, 0.012),
        this.materials.cabinetHandle
      );
      hdmi.position.set(hx, -0.01, 0);
      ioBay.add(hdmi);
    });

    // USB-C 90W Port
    const usbC = new THREE.Mesh(
      new THREE.BoxGeometry(0.010, 0.004, 0.012),
      this.materials.cabinetHandle
    );
    usbC.position.set(0.035, -0.01, 0);
    ioBay.add(usbC);

    // 3-Pin IEC C14 Power Inlet
    const iecInlet = new THREE.Mesh(
      new THREE.BoxGeometry(0.024, 0.014, 0.012),
      this.materials.screenBezelMetal
    );
    iecInlet.position.set(0.08, -0.01, 0);
    ioBay.add(iecInlet);

    displayHead.add(ioBay);

    // 5-Way OSD Tactile Joystick on Lower Right Rear
    const joystick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.005, 0.008, 8),
      this.materials.screenBezelMetal
    );
    joystick.rotation.x = Math.PI / 2;
    joystick.position.set(monW / 2 - 0.04, -monH / 2 + 0.04, 0.001);
    displayHead.add(joystick);

    // 6. Three-Sided Micro-Bezel Perimeter Edge & Bottom Chin
    const bezelT = 0.0025; // 2.5mm ultra-slim border

    // Top Micro-Bezel
    const topBezel = new THREE.Mesh(
      new THREE.BoxGeometry(monW, bezelT, 0.008),
      this.materials.screenBezelMetal
    );
    topBezel.position.set(0, monH / 2 - bezelT / 2, 0.026);
    displayHead.add(topBezel);

    // Left & Right Micro-Bezels
    [-monW / 2 + bezelT / 2, monW / 2 - bezelT / 2].forEach((bx) => {
      const sideBezel = new THREE.Mesh(
        new THREE.BoxGeometry(bezelT, monH - bezelT * 2, 0.008),
        this.materials.screenBezelMetal
      );
      sideBezel.position.set(bx, 0, 0.026);
      displayHead.add(sideBezel);
    });

    // Bottom Metallic Chin with Laser-Etched Micro-Brand Badge
    const chinH = 0.014;
    const chin = new THREE.Mesh(
      new THREE.BoxGeometry(monW, chinH, 0.010),
      this.materials.screenBezelMetal
    );
    chin.position.set(0, -monH / 2 + chinH / 2, 0.026);
    displayHead.add(chin);

    // Laser-etched metallic brand badge
    const badge = new THREE.Mesh(
      new THREE.PlaneGeometry(0.05, 0.004),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.9 })
    );
    badge.position.set(0, -monH / 2 + chinH / 2, 0.032);
    displayHead.add(badge);

    // Power Indicator Status LED (Subtle Cyan Glow)
    const pwrLed = new THREE.Mesh(
      new THREE.CircleGeometry(0.0016, 8),
      new THREE.MeshBasicMaterial({ color: 0x00d4e8 })
    );
    pwrLed.position.set(monW / 2 - 0.015, -monH / 2 + chinH / 2, 0.032);
    displayHead.add(pwrLed);

    // 7. High-DPI Anti-Glare IPS Display Panel Face
    const canvas = opts.canvas || this._createDefaultMonitorCanvas(opts.uiType || "default");
    const screenTex = new THREE.CanvasTexture(canvas);
    screenTex.anisotropy = 4;
    const screenFace = new THREE.Mesh(
      new THREE.PlaneGeometry(monW - bezelT * 2, monH - chinH - bezelT),
      new THREE.MeshBasicMaterial({ map: screenTex })
    );
    screenFace.position.set(0, chinH / 2, 0.028);
    displayHead.add(screenFace);

    group.add(displayHead);

    // 8. Physical Braided Interconnect Cables (Dropping from I/O bay through stand grommet)
    const cableMat = this.materials.cableBraided;
    const dpCable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, standH * 0.85, 8),
      cableMat
    );
    dpCable.position.set(-0.02, standH * 0.42, -0.06);
    dpCable.rotation.z = -0.08;
    group.add(dpCable);

    const pwrCable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0045, 0.0045, standH * 0.85, 8),
      cableMat
    );
    pwrCable.position.set(0.02, standH * 0.42, -0.06);
    pwrCable.rotation.z = 0.08;
    group.add(pwrCable);

    return group;
  }

// --- High-Fidelity 5-Star Caster Ergonomic Swivel Chair ---
  _createExecutiveSwivelChair(isExecutive = false) {
    const chair = new THREE.Group();

    // 1. Five-Star Spider Base & Rolling Casters
    const baseHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.05, 16),
      this.materials.cabinetHandle
    );
    baseHub.position.y = 0.12;
    chair.add(baseHub);

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const legArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.02, 0.30),
        this.materials.cabinetHandle
      );
      legArm.position.set(Math.sin(angle) * 0.15, 0.09, Math.cos(angle) * 0.15);
      legArm.rotation.y = angle;
      chair.add(legArm);

      // Dual-wheel hooded caster assembly
      const casterFork = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.04, 0.03),
        this.materials.cabinetHandle
      );
      casterFork.position.set(Math.sin(angle) * 0.29, 0.05, Math.cos(angle) * 0.29);
      chair.add(casterFork);

      [-0.016, 0.016].forEach((cx) => {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.012, 12),
          this.materials.leatherBlack
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(
          Math.sin(angle) * 0.29 + Math.cos(angle) * cx,
          0.025,
          Math.cos(angle) * 0.29 - Math.sin(angle) * cx
        );
        chair.add(wheel);
      });
    }

    // 2. Heavy-Duty Pneumatic Lift Cylinder with Telescoping Shroud
    const gasCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.03, 0.28, 16),
      this.materials.cabinetHandle
    );
    gasCylinder.position.y = 0.26;
    chair.add(gasCylinder);

    const bellows = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.042, 0.14, 16),
      this.materials.leatherBlack
    );
    bellows.position.y = 0.24;
    chair.add(bellows);

    // 3. Synchro-Tilt Mechanism Housing & Height/Tilt Levers
    const tiltMech = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.08, 0.24),
      this.materials.cabinetHandle
    );
    tiltMech.position.y = 0.40;
    chair.add(tiltMech);

    const tiltTensionKnob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.08, 12),
      this.materials.leatherBlack
    );
    tiltTensionKnob.position.set(0, 0.36, 0.08);
    chair.add(tiltTensionKnob);

    // 4. Ergonomic Waterfall Contoured Seat Cushion
    const seatW = isExecutive ? 0.56 : 0.50;
    const seatD = isExecutive ? 0.54 : 0.48;
    const seatH = isExecutive ? 0.09 : 0.07;

    const seatCushion = new THREE.Mesh(
      new THREE.BoxGeometry(seatW, seatH, seatD),
      this.materials.leatherBlack
    );
    seatCushion.position.set(0, 0.46, 0.02);
    chair.add(seatCushion);

    // 5. Lumbar Support Spine & Breathable Elastomeric Mesh Backrest
    const backH = isExecutive ? 0.68 : 0.56;
    const spineBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, backH * 0.75, 0.04),
      this.materials.cabinetHandle
    );
    spineBracket.position.set(0, 0.46 + backH * 0.40, -seatD / 2 - 0.02);
    spineBracket.rotation.x = -0.08;
    chair.add(spineBracket);

    const lumbarPad = new THREE.Mesh(
      new THREE.BoxGeometry(seatW * 0.65, 0.14, 0.035),
      this.materials.leatherBlack
    );
    lumbarPad.position.set(0, 0.62, -seatD / 2 + 0.01);
    chair.add(lumbarPad);

    const backrestFrame = new THREE.Mesh(
      new THREE.BoxGeometry(seatW, backH, 0.03),
      this.materials.cabinetHandle
    );
    backrestFrame.position.set(0, 0.46 + backH / 2 + 0.05, -seatD / 2 - 0.01);
    backrestFrame.rotation.x = -0.06;
    chair.add(backrestFrame);

    const backrestMesh = new THREE.Mesh(
      new THREE.BoxGeometry(seatW - 0.06, backH - 0.06, 0.015),
      this.materials.leatherBlack
    );
    backrestMesh.position.set(0, 0.46 + backH / 2 + 0.05, -seatD / 2);
    backrestMesh.rotation.x = -0.06;
    chair.add(backrestMesh);

    // 6. 3D Adjustable Padded Armrests
    [-seatW / 2 - 0.02, seatW / 2 + 0.02].forEach((ax) => {
      const armStalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.022, 0.22, 12),
        this.materials.cabinetHandle
      );
      armStalk.position.set(ax, 0.56, -0.02);
      chair.add(armStalk);

      const armPad = new THREE.Mesh(
        new THREE.BoxGeometry(0.085, 0.03, 0.24),
        this.materials.leatherBlack
      );
      armPad.position.set(ax, 0.68, -0.02);
      chair.add(armPad);
    });

    // 7. Executive Adjustable Headrest (if specified)
    if (isExecutive) {
      [-0.06, 0.06].forEach((hx) => {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.16, 12),
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

  // --- Grand Entrance Atrium, Reception & Waiting Lounge (Zone 6: X = 8.0 to 16.0, Z = -9.5 to 9.5) ---
  _buildGrandReceptionAndLounge() {
    const reception = new THREE.Group();
    reception.position.set(12.0, 0, 0.0);
    reception.name = "Grand_Reception_And_Lounge";

    // 1. Curved Architectural Travertine Reception Desk (Z = 1.0, Facing South Entrance)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, 1.0);

    // Fluted travertine desk body
    const deskBody = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.02, 1.2),
      this.materials.receptionStone
    );
    deskBody.position.set(0, 0.51, 0);
    deskGroup.add(deskBody);

    // Nero Marquina raised transaction counter
    const transactionTop = new THREE.Mesh(
      new THREE.BoxGeometry(3.7, 0.06, 0.45),
      this.materials.marbleWaterfall
    );
    transactionTop.position.set(0, 1.05, -0.40);
    deskGroup.add(transactionTop);

    // Lower operator desktop (Y = 0.74m)
    const workSurface = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 0.04, 0.75),
      this.materials.walnutDesk
    );
    workSurface.position.set(0, 0.74, 0.20);
    deskGroup.add(workSurface);

    // Brushed brass kickplate
    const kickPlate = new THREE.Mesh(
      new THREE.BoxGeometry(3.62, 0.10, 1.22),
      this.materials.brassAccent
    );
    kickPlate.position.set(0, 0.05, 0);
    deskGroup.add(kickPlate);

    // Receptionist Workstation (Dual monitors facing receptionist at +Z)
    const recMonitor1 = this._createRealisticWorkstationMonitor(
      0.62, 0.38, 0, Math.PI + 0.1, 0,
      this._createDefaultMonitorCanvas("twin-dashboard")
    );
    recMonitor1.position.set(-0.35, 0.76, 0.15);
    deskGroup.add(recMonitor1);

    const recMonitor2 = this._createRealisticWorkstationMonitor(
      0.62, 0.38, 0, Math.PI - 0.1, 0,
      this._createDefaultMonitorCanvas("spectrometer-raw")
    );
    recMonitor2.position.set(0.35, 0.76, 0.15);
    deskGroup.add(recMonitor2);

    // Slim wireless keyboard & mouse
    const keyboard = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.012, 0.13),
      this.materials.screenBezelMetal
    );
    keyboard.position.set(0, 0.766, 0.35);
    deskGroup.add(keyboard);

    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.02, 0.10),
      this.materials.screenBezelMetal
    );
    mouse.position.set(0.28, 0.77, 0.35);
    deskGroup.add(mouse);

    // Brushed brass desk lamp
    const lampStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.38, 12),
      this.materials.brassAccent
    );
    lampStem.position.set(-1.4, 0.95, 0.10);
    deskGroup.add(lampStem);

    const lampShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.18, 0.12, 16),
      this.materials.brassAccent
    );
    lampShade.position.set(-1.4, 1.14, 0.10);
    deskGroup.add(lampShade);

    // Guest sign-in tablet on angled stand facing visitor (-Z)
    const tabletStand = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.16, 0.04),
      this.materials.screenBezelMetal
    );
    tabletStand.position.set(1.1, 1.12, -0.38);
    tabletStand.rotation.x = 0.35;
    deskGroup.add(tabletStand);

    // Receptionist Ergonomic Chair
    const recChair = this._createExecutiveSwivelChair(false);
    recChair.position.set(0, 0, 0.95);
    recChair.rotation.y = Math.PI;
    deskGroup.add(recChair);

    reception.add(deskGroup);

    // 2. Luxury Waiting Lounge (South Side: Z = -3.0 to -7.5)
    const loungeGroup = new THREE.Group();
    loungeGroup.position.set(0, 0, -5.0);

    // Charcoal Designer Area Rug
    const areaRug = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.008, 3.8),
      this.materials.rugTextile
    );
    areaRug.position.set(0, 0.004, 0);
    loungeGroup.add(areaRug);

    // Curved Modern Sectional Sofa in Emerald Velvet (Facing Entrance & Desk)
    const sofaMain = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.44, 0.95),
      this.materials.velvetLounge
    );
    sofaMain.position.set(0, 0.22, -0.9);
    loungeGroup.add(sofaMain);

    const sofaBack = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.40, 0.25),
      this.materials.velvetLounge
    );
    sofaBack.position.set(0, 0.58, -1.25);
    loungeGroup.add(sofaBack);

    // Brass cylindrical sofa feet
    [[-1.5, -0.5], [1.5, -0.5], [-1.5, -1.3], [1.5, -1.3]].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.10, 12),
        this.materials.brassAccent
      );
      foot.position.set(fx, 0.05, fz);
      loungeGroup.add(foot);
    });

    // Pair of Boucle Club Armchairs
    [-1.6, 1.6].forEach((cx, idx) => {
      const chairSeat = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.42, 0.85),
        this.materials.boucleFabric
      );
      chairSeat.position.set(cx, 0.21, 0.4);
      chairSeat.rotation.y = (idx === 0 ? 0.35 : -0.35);
      loungeGroup.add(chairSeat);

      const chairBack = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.38, 0.20),
        this.materials.boucleFabric
      );
      chairBack.position.set(cx + (idx === 0 ? -0.1 : 0.1), 0.54, 0.7);
      chairBack.rotation.y = (idx === 0 ? 0.35 : -0.35);
      loungeGroup.add(chairBack);
    });

    // Twin Round Carrara Marble Coffee Tables
    const tableLarge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.04, 32),
      this.materials.carraraMarble
    );
    tableLarge.position.set(-0.25, 0.38, 0.1);
    loungeGroup.add(tableLarge);

    const tableLargeStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.18, 0.36, 16),
      this.materials.brassAccent
    );
    tableLargeStem.position.set(-0.25, 0.18, 0.1);
    loungeGroup.add(tableLargeStem);

    const tableSmall = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.035, 32),
      this.materials.carraraMarble
    );
    tableSmall.position.set(0.55, 0.44, 0.35);
    loungeGroup.add(tableSmall);

    const tableSmallStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.15, 0.42, 16),
      this.materials.brassAccent
    );
    tableSmallStem.position.set(0.55, 0.21, 0.35);
    loungeGroup.add(tableSmallStem);

    // Architectural monographs & journals on table
    const mag1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.015, 0.32),
      this.materials.walnutDesk
    );
    mag1.position.set(-0.25, 0.41, 0.08);
    mag1.rotation.y = 0.2;
    loungeGroup.add(mag1);

    // Ceramic succulent bowl
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.06, 0.08, 16),
      this.materials.porcelainWhite
    );
    pot.position.set(0.55, 0.49, 0.35);
    loungeGroup.add(pot);

    reception.add(loungeGroup);

    // 3. Central Kinetic-Style Brass Double Helix DNA Sculpture (Z = 5.2)
    const dnaGroup = new THREE.Group();
    dnaGroup.position.set(0, 0, 5.2);

    // Nero Marquina circular stepped pedestal
    const pedestalBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.90, 0.25, 32),
      this.materials.marbleWaterfall
    );
    pedestalBase.position.y = 0.125;
    dnaGroup.add(pedestalBase);

    // LED uplight ring
    const lightRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.70, 0.02, 12, 32),
      this.materials.brassAccent
    );
    lightRing.rotation.x = Math.PI / 2;
    lightRing.position.y = 0.252;
    dnaGroup.add(lightRing);

    // Double Helix physical helical rungs (24 procedural steps)
    const rungs = 24;
    const helixH = 2.4;
    const radius = 0.42;
    for (let i = 0; i < rungs; i++) {
      const t = i / rungs;
      const py = 0.30 + t * helixH;
      const angle = t * Math.PI * 4;

      // Base pair cross bar
      const bar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, radius * 2, 8),
        this.materials.brassAccent
      );
      bar.position.set(0, py, 0);
      bar.rotation.y = angle;
      bar.rotation.z = Math.PI / 2;
      dnaGroup.add(bar);

      // Spherical molecular nodes at strands
      [-radius, radius].forEach((rx) => {
        const node = new THREE.Mesh(
          new THREE.SphereGeometry(0.038, 12, 12),
          this.materials.carraraMarble
        );
        node.position.set(
          Math.cos(angle) * rx,
          py,
          Math.sin(angle) * rx
        );
        dnaGroup.add(node);
      });
    }

    reception.add(dnaGroup);

    // 4. Interactive Campus Directory Totem (X = 1.6, Z = -8.0)
    const totem = new THREE.Group();
    totem.position.set(1.6, 0, -8.0);

    const totemBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.05, 0.45),
      this.materials.standAnodized
    );
    totemBase.position.y = 0.025;
    totem.add(totemBase);

    const totemPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.70, 1.85, 0.14),
      this.materials.screenBezelMetal
    );
    totemPillar.position.y = 0.95;
    totem.add(totemPillar);

    const totemScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 1.05, 0.02),
      new THREE.MeshBasicMaterial({ map: this._createDefaultMonitorCanvas("twin-dashboard") })
    );
    totemScreen.position.set(0, 1.25, 0.075);
    totem.add(totemScreen);

    reception.add(totem);

    // 5. Museum Fine Art Canvas on South Wall (X = -1.8, Z = -9.42)
    const artGroup = new THREE.Group();
    artGroup.position.set(-1.8, 1.8, -9.42);

    const artFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.4, 0.06),
      this.materials.walnutDesk
    );
    artGroup.add(artFrame);

    const artCanvas = new THREE.Mesh(
      new THREE.BoxGeometry(2.26, 1.26, 0.02),
      new THREE.MeshStandardMaterial({
        color: 0x1b2838,
        roughness: 0.85,
        metalness: 0.1
      })
    );
    artCanvas.position.z = 0.03;
    artGroup.add(artCanvas);

    const picLight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.8, 12),
      this.materials.brassAccent
    );
    picLight.rotation.z = Math.PI / 2;
    picLight.position.set(0, 0.78, 0.15);
    artGroup.add(picLight);

    reception.add(artGroup);

    this.root.add(reception);
    this.colliders.push(new THREE.Box3().setFromObject(reception));
  }

  // --- Doubled Executive User Office (Zone 9: X = 16.0 to 21.5, Z = -9.5 to -1.5) ---
  _buildUserOfficeFurniture() {
    const office = new THREE.Group();
    office.position.set(18.75, 0, -5.5);
    office.name = "User_Doubled_Executive_Office";

    // 1. Smoked Oak Herringbone Area Rug under desk
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.008, 3.4),
      this.materials.rugTextile
    );
    rug.position.set(0, 0.004, -0.6);
    office.add(rug);

    // 2. Executive Cantilevered Walnut & Marble Desk (2.6m x 1.1m)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, -0.6);

    const desktop = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.07, 1.1),
      this.materials.walnutDesk
    );
    desktop.position.y = 0.74;
    deskGroup.add(desktop);

    // Nero Marquina waterfall end slab (right side +X)
    const waterfall = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.74, 1.1),
      this.materials.marbleWaterfall
    );
    waterfall.position.set(1.265, 0.37, 0);
    deskGroup.add(waterfall);

    // Cantilever steel post on left side (-X)
    const leftPedestal = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.70, 0.85),
      this.materials.cabinetBody
    );
    leftPedestal.position.set(-1.0, 0.35, 0);
    deskGroup.add(leftPedestal);

    // Executive modesty panel
    const modesty = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.45, 0.02),
      this.materials.walnutDesk
    );
    modesty.position.set(0.1, 0.48, 0.48);
    deskGroup.add(modesty);

    // Dual 32" Curved Professional Monitors on heavy articulating mount
    const mon1 = this._createRealisticWorkstationMonitor(
      0.72, 0.44, 0, 0.12, 0,
      this._createDefaultMonitorCanvas("twin-dashboard")
    );
    mon1.position.set(-0.38, 0.775, -0.15);
    deskGroup.add(mon1);

    const mon2 = this._createRealisticWorkstationMonitor(
      0.72, 0.44, 0, -0.14, 0,
      this._createDefaultMonitorCanvas("chromatogram-uv")
    );
    mon2.position.set(0.38, 0.775, -0.15);
    deskGroup.add(mon2);

    // Executive Desk Accessories
    const leatherMat = new THREE.Mesh(
      new THREE.BoxGeometry(0.90, 0.008, 0.45),
      this.materials.leatherMat
    );
    leatherMat.position.set(0, 0.779, 0.18);
    deskGroup.add(leatherMat);

    const kbd = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.015, 0.13),
      this.materials.screenBezelMetal
    );
    kbd.position.set(-0.05, 0.79, 0.18);
    deskGroup.add(kbd);

    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.022, 0.10),
      this.materials.screenBezelMetal
    );
    mouse.position.set(0.24, 0.795, 0.18);
    deskGroup.add(mouse);

    // Brass Task Bar Lamp
    const lampStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.40, 12),
      this.materials.brassAccent
    );
    lampStem.position.set(-1.0, 0.97, -0.2);
    deskGroup.add(lampStem);

    const lampBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.48, 12),
      this.materials.brassAccent
    );
    lampBar.rotation.z = Math.PI / 2;
    lampBar.position.set(-1.0, 1.17, -0.05);
    deskGroup.add(lampBar);

    // Executive Swivel Chair with Headrest
    const execChair = this._createExecutiveSwivelChair(true);
    execChair.position.set(0, 0, -0.85);
    deskGroup.add(execChair);

    // Pair of Guest Cantilever Chairs facing desk
    [-0.65, 0.65].forEach((gx) => {
      const gChair = this._createExecutiveSwivelChair(false);
      gChair.position.set(gx, 0, 0.85);
      gChair.rotation.y = Math.PI;
      deskGroup.add(gChair);
    });

    office.add(deskGroup);

    // 3. Acoustic Walnut Slat Feature Wall on South Perimeter Wall (Z = -3.85)
    const slatWall = new THREE.Group();
    slatWall.position.set(0, 1.5, -3.85);

    const feltBacking = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 3.0, 0.02),
      this.materials.acousticFelt
    );
    slatWall.add(feltBacking);

    const numSlats = 42;
    const slatW = 0.045;
    const slatSpacing = 4.8 / numSlats;
    for (let i = 0; i < numSlats; i++) {
      const sx = -2.4 + (i + 0.5) * slatSpacing;
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(slatW, 3.0, 0.025),
        this.materials.walnutSlat
      );
      slat.position.set(sx, 0, 0.02);
      slatWall.add(slat);
    }
    office.add(slatWall);

    // 4. Low Executive Walnut Credenza & Coffee Station (South wall: Z = -3.55)
    const credenza = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.68, 0.55),
      this.materials.walnutDesk
    );
    credenza.position.set(0, 0.34, -3.55);
    office.add(credenza);

    // Espresso Machine on Credenza
    const espressoMachine = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.36, 0.40),
      this.materials.stainlessAppliance
    );
    espressoMachine.position.set(1.4, 0.86, -3.55);
    office.add(espressoMachine);

    // Books and Reference binders on Credenza
    for (let b = 0; b < 12; b++) {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.24, 0.18),
        b % 2 === 0 ? this.materials.leatherBlack : this.materials.cabinetBody
      );
      book.position.set(-1.6 + b * 0.045, 0.80, -3.55);
      office.add(book);
    }

    // 5. Private Discussion / Collaboration Lounge in North Corner (Z = 2.0)
    const lounge = new THREE.Group();
    lounge.position.set(-0.8, 0, 2.0);

    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.04, 32),
      this.materials.walnutDesk
    );
    table.position.y = 0.72;
    lounge.add(table);

    const tableLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.22, 0.70, 16),
      this.materials.brassAccent
    );
    tableLeg.position.y = 0.35;
    lounge.add(tableLeg);

    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const cArm = this._createExecutiveSwivelChair(false);
      cArm.position.set(Math.sin(angle) * 0.85, 0, Math.cos(angle) * 0.85);
      cArm.rotation.y = angle + Math.PI;
      lounge.add(cArm);
    }
    office.add(lounge);

    this.root.add(office);
    this.colliders.push(new THREE.Box3().setFromObject(office));
  }

  // --- Doubled Grand Boardroom & Conference Suite (Zone 10: X = 16.0 to 27.0, Z = 1.5 to 9.5) ---
  _buildConferenceRoomFurniture() {
    const conf = new THREE.Group();
    conf.position.set(21.5, 0, 5.5);
    conf.name = "Executive_Doubled_Conference_Room";

    // 1. Boardroom Carpet Border / Inlay
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(9.6, 0.008, 6.8),
      this.materials.rugTextile
    );
    rug.position.set(0, 0.004, 0);
    conf.add(rug);

    // 2. Massive 16-Seat Boat-Shaped Boardroom Table (6.2m x 1.8m)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0.6, 0, 0);

    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.07, 1.8),
      this.materials.marbleWaterfall
    );
    tableTop.position.y = 0.74;
    tableGroup.add(tableTop);

    // Brushed brass central cable raceway trough
    const wireTrough = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.01, 0.16),
      this.materials.brassAccent
    );
    wireTrough.position.set(0, 0.776, 0);
    tableGroup.add(wireTrough);

    // Pop-up power / HDMI / network modules (4 units)
    [-1.8, -0.6, 0.6, 1.8].forEach((px) => {
      const pBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.015, 0.12),
        this.materials.screenBezelMetal
      );
      pBox.position.set(px, 0.78, 0);
      tableGroup.add(pBox);
    });

    // Heavy fluted marble plinth pedestals (3 support bases)
    [-2.2, 0, 2.2].forEach((bx) => {
      const plinth = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.38, 0.70, 24),
        this.materials.receptionStone
      );
      plinth.position.set(bx, 0.35, 0);
      tableGroup.add(plinth);
    });

    // 16 Ergonomic Conference Chairs
    // North side (6 chairs)
    for (let c = 0; c < 6; c++) {
      const cx = -2.25 + c * 0.90;
      const chair = this._createExecutiveSwivelChair(false);
      chair.position.set(cx, 0, 1.25);
      chair.rotation.y = Math.PI;
      tableGroup.add(chair);
    }
    // South side (6 chairs)
    for (let c = 0; c < 6; c++) {
      const cx = -2.25 + c * 0.90;
      const chair = this._createExecutiveSwivelChair(false);
      chair.position.set(cx, 0, -1.25);
      tableGroup.add(chair);
    }
    // East head of table (2 chairs)
    [-0.45, 0.45].forEach((cz) => {
      const chair = this._createExecutiveSwivelChair(true);
      chair.position.set(3.45, 0, cz);
      chair.rotation.y = -Math.PI / 2;
      tableGroup.add(chair);
    });
    // West end near podium (2 chairs)
    [-0.45, 0.45].forEach((cz) => {
      const chair = this._createExecutiveSwivelChair(true);
      chair.position.set(-3.45, 0, cz);
      chair.rotation.y = Math.PI / 2;
      tableGroup.add(chair);
    });

    conf.add(tableGroup);

    // 3. Presenter Stage & Podium Dais (West Side: X = -3.8)
    const daisGroup = new THREE.Group();
    daisGroup.position.set(-4.0, 0, 0);

    const daisPlatform = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.12, 2.6),
      this.materials.oakHerringbone
    );
    daisPlatform.position.y = 0.06;
    daisGroup.add(daisPlatform);

    // Brass perimeter LED trim
    const daisTrim = new THREE.Mesh(
      new THREE.BoxGeometry(1.84, 0.04, 2.64),
      this.materials.brassAccent
    );
    daisTrim.position.y = 0.02;
    daisGroup.add(daisTrim);

    // Fluted walnut presenter lectern / podium
    const podiumBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 1.08, 0.50),
      this.materials.walnutDesk
    );
    podiumBody.position.set(0, 0.66, 0);
    daisGroup.add(podiumBody);

    const podiumTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.70, 0.04, 0.55),
      this.materials.marbleWaterfall
    );
    podiumTop.position.set(0, 1.20, 0);
    podiumTop.rotation.x = -0.15;
    daisGroup.add(podiumTop);

    // Touch presentation preview display & gooseneck mic
    const touchScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.015, 0.22),
      new THREE.MeshBasicMaterial({ map: this._createDefaultMonitorCanvas("twin-dashboard") })
    );
    touchScreen.position.set(0, 1.23, 0);
    touchScreen.rotation.x = -0.15;
    daisGroup.add(touchScreen);

    const micBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.24, 8),
      this.materials.screenBezelMetal
    );
    micBase.position.set(0.24, 1.30, 0.05);
    daisGroup.add(micBase);

    conf.add(daisGroup);

    // 4. 110" Laser Video Wall Display (West Wall: X = -5.35)
    const videoWall = new THREE.Group();
    videoWall.position.set(-5.35, 1.85, 0);

    const screenBezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 1.75, 3.2),
      this.materials.screenBezelMetal
    );
    videoWall.add(screenBezel);

    const screenFace = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 1.68, 3.12),
      new THREE.MeshBasicMaterial({ map: this._createDefaultMonitorCanvas("twin-dashboard") })
    );
    screenFace.position.x = 0.035;
    videoWall.add(screenFace);

    // Conference Soundbar & 4K PTZ Camera
    const soundbar = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.10, 1.2),
      this.materials.screenBezelMetal
    );
    soundbar.position.set(0.05, -0.95, 0);
    videoWall.add(soundbar);

    const cameraLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.06, 16),
      this.materials.screenBezelMetal
    );
    cameraLens.rotation.z = Math.PI / 2;
    cameraLens.position.set(0.08, 0.95, 0);
    videoWall.add(cameraLens);

    conf.add(videoWall);

    // 5. Refreshment Buffet Credenza (North Wall: Z = 3.82)
    const credenza = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.85, 0.60),
      this.materials.kitchenCabinetSlate
    );
    credenza.position.set(0.6, 0.425, 3.65);
    conf.add(credenza);

    const credenzaTop = new THREE.Mesh(
      new THREE.BoxGeometry(4.25, 0.04, 0.65),
      this.materials.kitchenQuartz
    );
    credenzaTop.position.set(0.6, 0.87, 3.65);
    conf.add(credenzaTop);

    // Water cooler & coffee carafes
    const waterDispenser = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.50, 0.35),
      this.materials.stainlessAppliance
    );
    waterDispenser.position.set(2.2, 1.15, 3.65);
    conf.add(waterDispenser);

    // 6. Mobile Glass Whiteboard (East Side: X = 4.8)
    const boardGroup = new THREE.Group();
    boardGroup.position.set(4.8, 1.4, 0);

    const boardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.4, 2.2),
      this.materials.standAnodized
    );
    boardGroup.add(boardFrame);

    const glassSurface = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 1.34, 2.14),
      this.materials.porcelainWhite
    );
    boardGroup.add(glassSurface);

    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.02, 1.8),
      this.materials.standAnodized
    );
    tray.position.set(0.04, -0.71, 0);
    boardGroup.add(tray);

    conf.add(boardGroup);

    this.root.add(conf);
    this.colliders.push(new THREE.Box3().setFromObject(conf));
  }

  // --- Faculty & Administration Suite: Guest, Admin & Instructor Offices ---
  _buildOfficesSuite() {
    const suite = new THREE.Group();
    suite.name = "Offices_Suite_Wing";

    // 1. Guest Office (X = 21.5 to 25.0, Z = -9.5 to -1.5, Center: X = 23.25, Z = -5.5)
    const guestOff = new THREE.Group();
    guestOff.position.set(23.25, 0, -5.5);

    const guestDesk = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.05, 0.90),
      this.materials.walnutDesk
    );
    guestDesk.position.set(0, 0.74, -0.5);
    guestOff.add(guestDesk);

    const guestDeskLegL = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.72, 0.85),
      this.materials.standAnodized
    );
    guestDeskLegL.position.set(-0.95, 0.36, -0.5);
    guestOff.add(guestDeskLegL);

    const guestDeskLegR = new THREE.Mesh(
      new THREE.BoxGeometry(0.40, 0.72, 0.85),
      this.materials.cabinetBody
    );
    guestDeskLegR.position.set(0.80, 0.36, -0.5);
    guestOff.add(guestDeskLegR);

    // Dual monitors
    const gMon = this._createRealisticWorkstationMonitor(
      0.62, 0.38, 0, 0, 0,
      this._createDefaultMonitorCanvas("twin-dashboard")
    );
    gMon.position.set(0, 0.765, -0.6);
    guestOff.add(gMon);

    const gChair = this._createExecutiveSwivelChair(false);
    gChair.position.set(0, 0, -1.1);
    guestOff.add(gChair);

    const gClientChair = this._createExecutiveSwivelChair(false);
    gClientChair.position.set(0, 0, 0.5);
    gClientChair.rotation.y = Math.PI;
    guestOff.add(gClientChair);

    // Bookcase on South wall (Z = -3.7)
    const gBookcase = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.8, 0.40),
      this.materials.walnutDesk
    );
    gBookcase.position.set(0, 0.90, -3.65);
    guestOff.add(gBookcase);

    suite.add(guestOff);

    // 2. Admin Office (X = 25.0 to 28.5, Z = -9.5 to -1.5, Center: X = 26.75, Z = -5.5)
    const adminOff = new THREE.Group();
    adminOff.position.set(26.75, 0, -5.5);

    const adminDesk = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.05, 0.90),
      this.materials.walnutDesk
    );
    adminDesk.position.set(0, 0.74, -0.5);
    adminOff.add(adminDesk);

    const aLegL = new THREE.Mesh(
      new THREE.BoxGeometry(0.40, 0.72, 0.85),
      this.materials.cabinetBody
    );
    aLegL.position.set(-0.80, 0.36, -0.5);
    adminOff.add(aLegL);

    const aLegR = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.72, 0.85),
      this.materials.standAnodized
    );
    aLegR.position.set(0.95, 0.36, -0.5);
    adminOff.add(aLegR);

    const aMon = this._createRealisticWorkstationMonitor(
      0.62, 0.38, 0, 0, 0,
      this._createDefaultMonitorCanvas("twin-dashboard")
    );
    aMon.position.set(0, 0.765, -0.6);
    adminOff.add(aMon);

    const aChair = this._createExecutiveSwivelChair(false);
    aChair.position.set(0, 0, -1.1);
    adminOff.add(aChair);

    // Multifunction Commercial Office Copier / Printer / Scanner Station
    const copierGroup = new THREE.Group();
    copierGroup.position.set(-1.1, 0, 1.2);

    const copierBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 1.05, 0.75),
      this.materials.cabinetBody
    );
    copierBody.position.y = 0.525;
    copierGroup.add(copierBody);

    const feeder = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.15, 0.50),
      this.materials.screenBezelMetal
    );
    feeder.position.set(0, 1.125, 0);
    copierGroup.add(feeder);

    const copScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.12, 0.03),
      this.materials.screenBezelMetal
    );
    copScreen.position.set(0.28, 1.15, 0.32);
    copScreen.rotation.x = -0.3;
    copierGroup.add(copScreen);

    adminOff.add(copierGroup);

    // Lateral 4-Drawer Metal File Cabinets (South wall: Z = -3.7)
    const fileCabinet = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.35, 0.55),
      this.materials.cabinetBody
    );
    fileCabinet.position.set(0, 0.675, -3.65);
    adminOff.add(fileCabinet);

    suite.add(adminOff);

    // 3. Instructor's Office (X = 28.5 to 32.0, Z = -9.5 to -1.5, Center: X = 30.25, Z = -5.5)
    const instOff = new THREE.Group();
    instOff.position.set(30.25, 0, -5.5);

    const instDesk = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.05, 0.90),
      this.materials.walnutDesk
    );
    instDesk.position.set(0, 0.74, -0.5);
    instOff.add(instDesk);

    const iLegL = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.72, 0.85),
      this.materials.standAnodized
    );
    iLegL.position.set(-0.95, 0.36, -0.5);
    instOff.add(iLegL);

    const iLegR = new THREE.Mesh(
      new THREE.BoxGeometry(0.40, 0.72, 0.85),
      this.materials.cabinetBody
    );
    iLegR.position.set(0.80, 0.36, -0.5);
    instOff.add(iLegR);

    const iMon = this._createRealisticWorkstationMonitor(
      0.62, 0.38, 0, 0, 0,
      this._createDefaultMonitorCanvas("twin-dashboard")
    );
    iMon.position.set(0, 0.765, -0.6);
    instOff.add(iMon);

    const iChair = this._createExecutiveSwivelChair(false);
    iChair.position.set(0, 0, -1.1);
    instOff.add(iChair);

    // Discussion table with 2 student chairs
    const discTable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.035, 24),
      this.materials.walnutDesk
    );
    discTable.position.set(-0.8, 0.72, 1.2);
    instOff.add(discTable);

    const discStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.16, 0.70, 16),
      this.materials.standAnodized
    );
    discStem.position.set(-0.8, 0.35, 1.2);
    instOff.add(discStem);

    [-0.55, 0.55].forEach((dx) => {
      const sChair = this._createExecutiveSwivelChair(false);
      sChair.position.set(-0.8 + dx, 0, 1.2);
      sChair.rotation.y = dx > 0 ? -Math.PI / 2 : Math.PI / 2;
      instOff.add(sChair);
    });

    // Academic Bookcase wall loaded with chemistry monographs (South wall: Z = -3.7)
    const bookcase = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 2.1, 0.38),
      this.materials.walnutDesk
    );
    bookcase.position.set(0, 1.05, -3.65);
    instOff.add(bookcase);

    // Magnetic Teaching Whiteboard on East Wall
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 1.1, 1.8),
      this.materials.porcelainWhite
    );
    board.position.set(1.68, 1.45, -0.5);
    instOff.add(board);

    suite.add(instOff);

    this.root.add(suite);
    this.colliders.push(new THREE.Box3().setFromObject(suite));
  }

  // --- Staff Break Room & Kitchenette (Zone 11: X = 27.0 to 33.5, Z = 1.5 to 9.5) ---
  _buildBreakRoom() {
    const breakroom = new THREE.Group();
    breakroom.position.set(30.25, 0, 5.5);
    breakroom.name = "Staff_Break_Room_And_Kitchenette";

    // 1. Kitchenette Cabinetry & Countertop along North Wall (Z = 3.82)
    const kitchenBase = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, 0.86, 0.65),
      this.materials.kitchenCabinetSlate
    );
    kitchenBase.position.set(0, 0.43, 3.65);
    breakroom.add(kitchenBase);

    const kitchenTop = new THREE.Mesh(
      new THREE.BoxGeometry(5.85, 0.04, 0.68),
      this.materials.kitchenQuartz
    );
    kitchenTop.position.set(0, 0.88, 3.65);
    breakroom.add(kitchenTop);

    // Integrated 4" Quartz Backsplash
    const backsplash = new THREE.Mesh(
      new THREE.BoxGeometry(5.85, 0.10, 0.02),
      this.materials.kitchenQuartz
    );
    backsplash.position.set(0, 0.95, 3.97);
    breakroom.add(backsplash);

    // Deep Undermount Stainless Double Sink
    const sinkBasin = new THREE.Mesh(
      new THREE.BoxGeometry(0.80, 0.22, 0.45),
      this.materials.stainlessAppliance
    );
    sinkBasin.position.set(-0.8, 0.77, 3.65);
    breakroom.add(sinkBasin);

    // High-Arc Commercial Pull-Down Faucet
    const faucetStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.35, 12),
      this.materials.chromeFaucet
    );
    faucetStem.position.set(-0.8, 1.05, 3.82);
    breakroom.add(faucetStem);

    // Full-Size French Door Refrigerator / Freezer
    const fridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 1.85, 0.80),
      this.materials.stainlessAppliance
    );
    fridge.position.set(-2.3, 0.925, 3.55);
    breakroom.add(fridge);

    // Twin Commercial Microwave Ovens
    [-0.1, 0.8].forEach((mx) => {
      const uwave = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.34, 0.38),
        this.materials.stainlessAppliance
      );
      uwave.position.set(mx, 1.07, 3.65);
      breakroom.add(uwave);
    });

    // Commercial Dual-Group Espresso Machine & Grinder Station
    const espresso = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.42, 0.45),
      this.materials.espressoChrome
    );
    espresso.position.set(1.9, 1.11, 3.65);
    breakroom.add(espresso);

    // 2. Quartz Waterfall Dining Island (Z = 0.8)
    const island = new THREE.Group();
    island.position.set(0, 0, 0.8);

    const islandTop = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.05, 1.1),
      this.materials.kitchenQuartz
    );
    islandTop.position.y = 0.90;
    island.add(islandTop);

    // Waterfall quartz sides
    [-1.575, 1.575].forEach((wx) => {
      const wSide = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.90, 1.1),
        this.materials.kitchenQuartz
      );
      wSide.position.set(wx, 0.45, 0);
      island.add(wSide);
    });

    const islandBody = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.88, 0.80),
      this.materials.kitchenCabinetSlate
    );
    islandBody.position.set(0, 0.44, 0);
    island.add(islandBody);

    // 5 Modern High-Top Barstools
    for (let s = 0; s < 5; s++) {
      const sx = -1.2 + s * 0.60;
      const stool = new THREE.Group();
      stool.position.set(sx, 0, -0.75);

      const seat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16),
        this.materials.leatherBlack
      );
      seat.position.y = 0.65;
      stool.add(seat);

      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.63, 8),
        this.materials.screenBezelMetal
      );
      leg.position.y = 0.315;
      stool.add(leg);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.20, 0.20, 0.02, 16),
        this.materials.screenBezelMetal
      );
      base.position.y = 0.01;
      stool.add(base);

      island.add(stool);
    }
    breakroom.add(island);

    // 3. Café Dining Seating Area (Z = -2.2)
    [-1.2, 1.2].forEach((tx) => {
      const table = new THREE.Mesh(
        new THREE.BoxGeometry(0.90, 0.04, 0.90),
        this.materials.walnutDesk
      );
      table.position.set(tx, 0.74, -2.2);
      breakroom.add(table);

      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.16, 0.72, 16),
        this.materials.standAnodized
      );
      leg.position.set(tx, 0.36, -2.2);
      breakroom.add(leg);

      // 4 chairs per table
      [[0, 0.6], [0, -0.6], [0.6, 0], [-0.6, 0]].forEach(([cx, cz]) => {
        const chair = this._createExecutiveSwivelChair(false);
        chair.position.set(tx + cx, 0, -2.2 + cz);
        chair.rotation.y = Math.atan2(-cx, -cz);
        breakroom.add(chair);
      });
    });

    // 4. Glass-Front Vending Machines along West Wall (X = -3.0)
    const vendGroup = new THREE.Group();
    vendGroup.position.set(-3.0, 0, 1.5);

    const drinkVend = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 1.95, 0.80),
      this.materials.cabinetBody
    );
    drinkVend.position.set(0, 0.975, 0.5);
    drinkVend.rotation.y = Math.PI / 2;
    vendGroup.add(drinkVend);

    const snackVend = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 1.95, 0.80),
      this.materials.screenBezelMetal
    );
    snackVend.position.set(0, 0.975, -0.5);
    snackVend.rotation.y = Math.PI / 2;
    vendGroup.add(snackVend);

    breakroom.add(vendGroup);

    // 5. Wall-Mounted 65" TV & Announcement Board on East Wall (X = 3.1)
    const tv = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.85, 1.45),
      this.materials.screenBezelMetal
    );
    tv.position.set(3.15, 1.75, 0);
    breakroom.add(tv);

    this.root.add(breakroom);
    this.colliders.push(new THREE.Box3().setFromObject(breakroom));
  }

  // --- Executive & ADA Restroom Fixtures (Zone 7: X = 33.5 to 38.0, Z = 1.5 to 9.5) ---
  _buildRestroomFixtures() {
    const restroom = new THREE.Group();
    restroom.position.set(35.75, 0, 5.5);
    restroom.name = "Restroom_Fixtures";

    // 1. Floating Double Vanity along North Wall (Z = 3.82)
    const vanityTop = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 0.12, 0.60),
      this.materials.kitchenQuartz
    );
    vanityTop.position.set(0, 0.82, 3.65);
    restroom.add(vanityTop);

    // Twin rectangular undermount porcelain basins
    [-0.85, 0.85].forEach((vx) => {
      const basin = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.15, 0.40),
        this.materials.porcelainWhite
      );
      basin.position.set(vx, 0.72, 3.65);
      restroom.add(basin);

      const faucet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.22, 12),
        this.materials.chromeFaucet
      );
      faucet.position.set(vx, 0.98, 3.82);
      restroom.add(faucet);

      // Backlit LED Mirror
      const mirror = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.95, 0.03),
        this.materials.porcelainWhite
      );
      mirror.position.set(vx, 1.60, 3.96);
      restroom.add(mirror);
    });

    // Dyson Airblade Hand Dryers
    [-1.7, 1.7].forEach((dx) => {
      const dryer = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.65, 0.18),
        this.materials.standAnodized
      );
      dryer.position.set(dx, 1.15, 3.85);
      restroom.add(dryer);
    });

    // 2. Private Toilet Stalls along East Wall (X = 2.15)
    [-1.2, 0.8].forEach((sy) => {
      const stall = new THREE.Group();
      stall.position.set(1.4, 0, sy);

      // Stall privacy partitions
      const partition = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 2.1, 0.03),
        this.materials.screenBezelMetal
      );
      partition.position.set(0, 1.05, 0.75);
      stall.add(partition);

      // Commercial wall-hung toilet
      const toiletBowl = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.38, 0.58),
        this.materials.porcelainWhite
      );
      toiletBowl.position.set(0.45, 0.42, 0);
      stall.add(toiletBowl);

      // Chrome flushometer valve
      const flushValve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.30, 12),
        this.materials.chromeFaucet
      );
      flushValve.position.set(0.68, 0.75, 0);
      stall.add(flushValve);

      // Stainless grab bar
      const grabBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.90, 12),
        this.materials.cabinetHandle
      );
      grabBar.rotation.x = Math.PI / 2;
      grabBar.position.set(0.70, 0.85, 0);
      stall.add(grabBar);

      restroom.add(stall);
    });

    // 3. Wall-Hung Urinal with Privacy Screen along West Wall (X = -2.15)
    const urinal = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.65, 0.35),
      this.materials.porcelainWhite
    );
    urinal.position.set(-2.0, 0.75, 0.5);
    restroom.add(urinal);

    const urinalScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 1.2, 0.50),
      this.materials.frostedShowerDoor
    );
    urinalScreen.position.set(-1.8, 1.10, 0.1);
    restroom.add(urinalScreen);

    // Floor drain
    const drain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.005, 16),
      this.materials.cabinetHandle
    );
    drain.position.set(0, 0.003, 0);
    restroom.add(drain);

    this.root.add(restroom);
    this.colliders.push(new THREE.Box3().setFromObject(restroom));
  }

  // --- Men's Locker Room & Showers (Zone 13: X = 32.0 to 38.0, Z = -9.5 to -1.5) ---
  _buildMensLockerRoom() {
    const mens = new THREE.Group();
    mens.position.set(35.0, 0, -5.5);
    mens.name = "Mens_Locker_Room_And_Showers";

    // 1. Double-Tier Steel Locker Banks (2 banks of 12 = 24 compartments)
    // Bank A: North partition wall (Z = 3.65)
    const lockerBankA = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1.95, 0.55),
      this.materials.lockerSteel
    );
    lockerBankA.position.set(0, 0.975, 3.65);
    mens.add(lockerBankA);

    // Bank B: Center dividing bank (Z = 0.5)
    const lockerBankB = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1.95, 0.55),
      this.materials.lockerSteel
    );
    lockerBankB.position.set(0, 0.975, 0.5);
    mens.add(lockerBankB);

    // Number plates & handles on lockers
    for (let i = 0; i < 12; i++) {
      const lx = -1.9 + i * 0.35;
      const plateA = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.04, 0.01),
        this.materials.brassAccent
      );
      plateA.position.set(lx, 1.45, 3.37);
      mens.add(plateA);

      const plateB = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.04, 0.01),
        this.materials.brassAccent
      );
      plateB.position.set(lx, 1.45, 0.22);
      mens.add(plateB);
    }

    // 2. Heavy Solid Oak Butcher-Block Dressing Benches
    [2.1, -1.0].forEach((bz) => {
      const benchTop = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.06, 0.45),
        this.materials.benchOakButcher
      );
      benchTop.position.set(0, 0.45, bz);
      mens.add(benchTop);

      [-1.5, 0, 1.5].forEach((lx) => {
        const benchLeg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.42, 12),
          this.materials.screenBezelMetal
        );
        benchLeg.position.set(lx, 0.21, bz);
        mens.add(benchLeg);
      });
    });

    // 3. Private Rainfall Shower Suites along South Wall (Z = -3.75)
    [-1.4, 0, 1.4].forEach((sx) => {
      const showerStall = new THREE.Group();
      showerStall.position.set(sx, 0, -3.2);

      // Frosted tempered glass door
      const glassDoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 2.05, 0.015),
        this.materials.frostedShowerDoor
      );
      glassDoor.position.set(0, 1.025, 0.45);
      showerStall.add(glassDoor);

      // Chrome rainfall shower head
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.35, 12),
        this.materials.chromeFaucet
      );
      pipe.position.set(0, 2.15, -0.2);
      showerStall.add(pipe);

      const head = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.02, 24),
        this.materials.chromeFaucet
      );
      head.position.set(0, 2.0, -0.2);
      showerStall.add(head);

      // Thermostatic mixer valve
      const valve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.05, 12),
        this.materials.chromeFaucet
      );
      valve.rotation.x = Math.PI / 2;
      valve.position.set(0, 1.10, -0.65);
      showerStall.add(valve);

      mens.add(showerStall);
    });

    // 4. Double Grooming Vanity on West Wall (X = -2.85)
    const vanity = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.85, 2.2),
      this.materials.kitchenCabinetSlate
    );
    vanity.position.set(-2.65, 0.425, 2.0);
    mens.add(vanity);

    const vTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.04, 2.25),
      this.materials.kitchenQuartz
    );
    vTop.position.set(-2.65, 0.87, 2.0);
    mens.add(vTop);

    // Wall-mounted hair dryers & backlit mirrors
    [-0.5, 0.5].forEach((vz) => {
      const mirror = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.90, 0.60),
        this.materials.porcelainWhite
      );
      mirror.position.set(-2.92, 1.55, 2.0 + vz);
      mens.add(mirror);
    });

    // Towel hamper & robe hooks
    const hamper = new THREE.Mesh(
      new THREE.BoxGeometry(0.50, 0.85, 0.50),
      this.materials.stainlessAppliance
    );
    hamper.position.set(-2.6, 0.425, -1.8);
    mens.add(hamper);

    this.root.add(mens);
    this.colliders.push(new THREE.Box3().setFromObject(mens));
  }

  // --- Women's Locker Room, Changing Suite & Showers (Zone 14: X = 38.0 to 44.0, Z = -8.0 to 8.0) ---
  _buildWomensLockerRoom() {
    const womens = new THREE.Group();
    womens.position.set(41.0, 0, 0.0);
    womens.name = "Womens_Locker_Room_And_Showers";

    // 1. Champagne Gold Steel Locker Banks (32 compartments total)
    // North Locker Bank (Z = 7.55)
    const lockersNorth = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 1.95, 0.55),
      this.materials.lockerChampagne
    );
    lockersNorth.position.set(0, 0.975, 7.35);
    womens.add(lockersNorth);

    // South Locker Bank (Z = -7.55)
    const lockersSouth = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 1.95, 0.55),
      this.materials.lockerChampagne
    );
    lockersSouth.position.set(0, 0.975, -7.35);
    womens.add(lockersSouth);

    // Digital pin keypads on lockers
    for (let i = 0; i < 14; i++) {
      const lx = -2.1 + i * 0.32;
      const padN = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.08, 0.015),
        this.materials.screenBezelMetal
      );
      padN.position.set(lx, 1.35, 7.07);
      womens.add(padN);

      const padS = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.08, 0.015),
        this.materials.screenBezelMetal
      );
      padS.position.set(lx, 1.35, -7.07);
      womens.add(padS);
    }

    // 2. Central Dressing & Lounge Area (Z = 0.0)
    // Large Emerald Velvet Circular Ottoman
    const centralOttoman = new THREE.Mesh(
      new THREE.CylinderGeometry(0.70, 0.70, 0.44, 32),
      this.materials.velvetLounge
    );
    centralOttoman.position.set(0, 0.22, 0);
    womens.add(centralOttoman);

    const ottomanBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.08, 32),
      this.materials.brassAccent
    );
    ottomanBase.position.set(0, 0.04, 0);
    womens.add(ottomanBase);

    // Oak Butcher Dressing Benches
    [-3.8, 3.8].forEach((bz) => {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.06, 0.45),
        this.materials.benchOakButcher
      );
      bench.position.set(0, 0.45, bz);
      womens.add(bench);
    });

    // 3. Luxury 4-Station Hollywood Vanity Bar along West Wall (X = -2.85, Z = 2.0 to 6.5)
    const vanityGroup = new THREE.Group();
    vanityGroup.position.set(-2.65, 0, 4.2);

    const vanityCounter = new THREE.Mesh(
      new THREE.BoxGeometry(0.60, 0.05, 4.2),
      this.materials.carraraMarble
    );
    vanityCounter.position.y = 0.74;
    vanityGroup.add(vanityCounter);

    const vanityBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.715, 4.15),
      this.materials.kitchenCabinetSlate
    );
    vanityBase.position.y = 0.36;
    vanityGroup.add(vanityBase);

    // 4 Illuminated Hollywood Vanity Mirrors & Stools
    for (let s = 0; s < 4; s++) {
      const sz = -1.5 + s * 1.0;
      const mirror = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.85, 0.65),
        this.materials.porcelainWhite
      );
      mirror.position.set(-0.28, 1.35, sz);
      vanityGroup.add(mirror);

      // Hollywood globe light frame
      const lightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.90, 0.70),
        this.materials.brassAccent
      );
      lightFrame.position.set(-0.29, 1.35, sz);
      vanityGroup.add(lightFrame);

      // Velvet upholstered grooming stool
      const stool = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.45, 16),
        this.materials.velvetLounge
      );
      stool.position.set(0.65, 0.225, sz);
      vanityGroup.add(stool);
    }
    womens.add(vanityGroup);

    // 4. Four Private Shower Suites with Drying Cubicles along East Wall (X = 2.85, Z = -2.5 to 6.5)
    for (let sh = 0; sh < 4; sh++) {
      const sz = -1.8 + sh * 2.2;
      const suite = new THREE.Group();
      suite.position.set(2.6, 0, sz);

      // Frosted tempered glass enclosure
      const glassFront = new THREE.Mesh(
        new THREE.BoxGeometry(0.015, 2.1, 1.4),
        this.materials.frostedShowerDoor
      );
      glassFront.position.set(-0.6, 1.05, 0);
      suite.add(glassFront);

      // Rainfall shower head
      const rainHead = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.02, 24),
        this.materials.chromeFaucet
      );
      rainHead.position.set(0, 2.1, 0);
      suite.add(rainHead);

      // Handheld sprayer wand
      const sprayer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.25, 12),
        this.materials.chromeFaucet
      );
      sprayer.position.set(0.35, 1.2, 0.4);
      suite.add(sprayer);

      womens.add(suite);
    }

    // 5. Private Enclosed Water Closets along West Wall (X = -2.85, Z = -6.0 to -2.0)
    [-5.2, -3.2].forEach((wz) => {
      const wc = new THREE.Group();
      wc.position.set(-2.4, 0, wz);

      const wcDoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 2.1, 0.95),
        this.materials.screenBezelMetal
      );
      wcDoor.position.set(0.5, 1.05, 0);
      wc.add(wcDoor);

      const toilet = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.38, 0.58),
        this.materials.porcelainWhite
      );
      toilet.position.set(-0.4, 0.42, 0);
      wc.add(toilet);

      womens.add(wc);
    });

    // 6. Luxury Towel & Linen Station along East Wall (X = 2.85, Z = -5.5)
    const linenStation = new THREE.Group();
    linenStation.position.set(2.65, 0, -5.5);

    const shelfFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 1.95, 1.8),
      this.materials.walnutDesk
    );
    shelfFrame.position.y = 0.975;
    linenStation.add(shelfFrame);

    // Stacks of white plush towels
    for (let t = 0; t < 8; t++) {
      const towel = new THREE.Mesh(
        new THREE.BoxGeometry(0.40, 0.06, 0.35),
        this.materials.porcelainWhite
      );
      towel.position.set(0, 0.5 + (t % 4) * 0.25, -0.4 + Math.floor(t / 4) * 0.8);
      linenStation.add(towel);
    }

    womens.add(linenStation);

    this.root.add(womens);
    this.colliders.push(new THREE.Box3().setFromObject(womens));
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
