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
    const screenTex = new THREE.CanvasTexture(opts.canvas);
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

  // --- User's Executive Office & Analytical Learning Suite (Zone 9) ---
  _buildUserOfficeFurniture() {
    const office = new THREE.Group();
    office.position.set(12.0, 0, 6.75);
    office.name = "User_Executive_Office_Furniture";

    // 1. Smoked Oak Herringbone Parquet Floor Slab
    const floorSlab = new THREE.Mesh(
      new THREE.BoxGeometry(7.8, 0.01, 4.3),
      this.materials.oakHerringbone
    );
    floorSlab.position.set(0, 0.005, 0);
    office.add(floorSlab);

    // Perimeter Walnut Baseboard Trim
    const baseboardT = 0.02;
    const baseboardH = 0.08;
    const bbNorth = new THREE.Mesh(
      new THREE.BoxGeometry(7.8, baseboardH, baseboardT),
      this.materials.walnutDesk
    );
    bbNorth.position.set(0, baseboardH / 2, 2.14);
    office.add(bbNorth);

    // North Wall Acoustic Walnut Slat Feature Wall Behind Executive Desk
    const slatWallW = 5.4;
    const slatWallH = 2.7;
    const slatGroup = new THREE.Group();
    slatGroup.position.set(0, slatWallH / 2 + 0.08, 2.12);

    const feltBacking = new THREE.Mesh(
      new THREE.PlaneGeometry(slatWallW, slatWallH),
      this.materials.acousticFelt
    );
    slatGroup.add(feltBacking);

    const sW = 0.04;
    const sD = 0.022;
    const sGap = 0.035;
    const nSlats = Math.floor(slatWallW / (sW + sGap));
    const sStart = -((nSlats - 1) * (sW + sGap)) / 2;
    const sGeo = new THREE.BoxGeometry(sW, slatWallH, sD);
    for (let i = 0; i < nSlats; i++) {
      const slat = new THREE.Mesh(sGeo, this.materials.walnutSlat);
      slat.position.set(sStart + i * (sW + sGap), 0, sD / 2);
      slatGroup.add(slat);
    }
    office.add(slatGroup);

    // Warm LED Crown Cove Lighting above the Slats
    const coveLight = new THREE.Mesh(
      new THREE.BoxGeometry(slatWallW, 0.02, 0.06),
      this.materials.ledLightPanel
    );
    coveLight.position.set(0, slatWallH + 0.08, 2.09);
    office.add(coveLight);

    // Two Gallery-Framed Architectural Patent Drawings on North Slat Wall
    [-1.5, 1.5].forEach((ax) => {
      const artFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 1.10, 0.02),
        this.materials.screenBezelMetal
      );
      artFrame.position.set(ax, 1.65, 2.15);
      office.add(artFrame);

      const artCanvas = document.createElement("canvas");
      artCanvas.width = 512;
      artCanvas.height = 660;
      const ac = artCanvas.getContext("2d");
      ac.fillStyle = "#0c1322";
      ac.fillRect(0, 0, 512, 660);
      ac.strokeStyle = "#38bdf8";
      ac.lineWidth = 3;
      ac.strokeRect(15, 15, 482, 630);
      ac.fillStyle = "#facc15";
      ac.font = "bold 20px serif";
      ac.textAlign = "center";
      ac.fillText("UNITED STATES PATENT OFFICE", 256, 65);
      ac.fillStyle = "#e2e8f0";
      ac.font = "14px monospace";
      ac.fillText(ax < 0 ? "US PAT. 11,842,901 · ROTARY CHROMATOGRAPHY" : "US PAT. 10,954,212 · BIOPROCESS CENTRIFUGE", 256, 100);
      // Schematic drawing
      ac.strokeStyle = "rgba(0, 212, 232, 0.7)";
      ac.lineWidth = 2;
      ac.beginPath();
      ac.arc(256, 320, 120, 0, Math.PI * 2);
      ac.moveTo(256, 170); ac.lineTo(256, 470);
      ac.moveTo(106, 320); ac.lineTo(406, 320);
      ac.stroke();
      const artTex = new THREE.CanvasTexture(artCanvas);
      const artPrint = new THREE.Mesh(
        new THREE.PlaneGeometry(0.81, 1.06),
        new THREE.MeshBasicMaterial({ map: artTex })
      );
      artPrint.position.set(ax, 1.65, 2.162);
      office.add(artPrint);
    });

    // 2. Designer Architectural Textured Area Rug Under Executive Desk & Seating
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.008, 2.6),
      this.materials.rugTextile
    );
    rug.position.set(0, 0.012, 0.15);
    office.add(rug);

    // 3. Cantilevered Executive Desk with Reverse Shark-Nose Beveled Edge
    const deskW = 2.4;
    const deskD = 1.05;
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

    // Right Storage Pedestal with 2 Soft-Close Drawers and Brushed Brass Pulls
    const pedW = 0.52;
    const pedD = deskD * 0.88;
    const pedH = deskH - topT;
    const pedestal = new THREE.Mesh(
      new THREE.BoxGeometry(pedW, pedH, pedD),
      this.materials.cabinetBody
    );
    pedestal.position.set(deskW / 2 - pedW / 2, pedH / 2, 0);
    office.add(pedestal);

    // Brass Recessed Drawer Pulls
    [0.22, 0.48].forEach((py) => {
      const pull = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.015, 0.02),
        this.materials.brassAccent
      );
      pull.position.set(deskW / 2 - pedW / 2, py, -pedD / 2 - 0.01);
      office.add(pull);
    });

    // Dual Brushed Aluminum Cable Portals on Desk Rear
    [-0.6, 0.6].forEach((gx) => {
      const grommet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.008, 16),
        this.materials.cabinetHandle
      );
      grommet.position.set(gx, deskH + 0.002, 0.35);
      office.add(grommet);
    });

    // 4. Executive Ergonomic Leather Swivel Chair (Facing Desk)
    const chairGroup = this._createExecutiveSwivelChair(true);
    chairGroup.position.set(0, 0, -0.65);
    office.add(chairGroup);

    // 5. Extended Stitched-Edge Leather Desk Mat
    const deskMat = new THREE.Mesh(
      new THREE.BoxGeometry(0.96, 0.006, 0.46),
      this.materials.leatherMat
    );
    deskMat.position.set(0, deskH + 0.003, -0.05);
    office.add(deskMat);

    // 6. Realistic Computer Monitors (Dual 32" 4K Professional Biotech Workstation)
    // Monitor 1 (Left - 32" 4K LIMS HPLC & Chromatography Workstation)
    const mon1Canvas = document.createElement("canvas");
    mon1Canvas.width = 1024;
    mon1Canvas.height = 640;
    const c1 = mon1Canvas.getContext("2d");
    c1.fillStyle = "#070a0f";
    c1.fillRect(0, 0, 1024, 640);

    // OS Top Menu Bar
    c1.fillStyle = "#111827";
    c1.fillRect(0, 0, 1024, 38);
    c1.fillStyle = "#00d4e8";
    c1.font = "bold 15px monospace";
    c1.fillText("SRE ChromStation OS v4.8", 16, 24);
    c1.fillStyle = "#94a3b8";
    c1.font = "13px sans-serif";
    c1.fillText("File   Edit   Methods   Acquisitions   Quantitation   System   Help", 240, 24);
    c1.fillStyle = "#3dd68c";
    c1.font = "bold 12px monospace";
    c1.fillText("● 21 CFR PART 11 LOCKED   10:42 AM   Dr. S. Reynolds", 670, 24);

    // Main HPLC Chromatogram Window Frame
    c1.fillStyle = "#0c1322";
    c1.strokeStyle = "#1e293b";
    c1.lineWidth = 2;
    c1.fillRect(20, 55, 660, 360);
    c1.strokeRect(20, 55, 660, 360);

    // Window Title Bar
    c1.fillStyle = "#1e293b";
    c1.fillRect(20, 55, 660, 30);
    c1.fillStyle = "#f1f5f9";
    c1.font = "bold 13px 'IBM Plex Sans', sans-serif";
    c1.fillText("METHOD: USP-API-ASSAY-REV9 · UV DETECTOR 254 nm · FLOW: 1.00 mL/min", 35, 76);

    // Chromatogram Grid Lines
    c1.strokeStyle = "rgba(42, 60, 88, 0.4)";
    c1.lineWidth = 1;
    for (let x = 70; x <= 640; x += 50) {
      c1.beginPath(); c1.moveTo(x, 95); c1.lineTo(x, 380); c1.stroke();
    }
    for (let y = 110; y <= 380; y += 45) {
      c1.beginPath(); c1.moveTo(70, y); c1.lineTo(640, y); c1.stroke();
    }

    // Baseline & Resolved Chromatographic Peaks
    c1.strokeStyle = "#00d4e8";
    c1.lineWidth = 2.5;
    c1.beginPath();
    c1.moveTo(70, 370);
    c1.lineTo(130, 370);
    // Peak 1: Solvent Front (tR = 1.85 min)
    c1.lineTo(150, 320); c1.lineTo(165, 370); c1.lineTo(260, 370);
    // Peak 2: Active Pharmaceutical Ingredient (API) sharp Gaussian apex (tR = 4.42 min)
    c1.lineTo(285, 365); c1.lineTo(315, 130); c1.lineTo(345, 365); c1.lineTo(440, 370);
    // Peak 3: Internal Standard (tR = 7.15 min)
    c1.lineTo(470, 240); c1.lineTo(500, 370); c1.lineTo(640, 370);
    c1.stroke();

    // Peak Integration Annotations
    c1.fillStyle = "#facc15";
    c1.font = "bold 12px monospace";
    c1.fillText("API Peak (tR: 4.42 min)", 315, 115);
    c1.fillText("Area: 1,942,650 · 99.88%", 315, 132);

    // Peak Table at Bottom of Chromatogram
    c1.fillStyle = "#111827";
    c1.fillRect(20, 425, 660, 195);
    c1.strokeStyle = "#1e293b";
    c1.strokeRect(20, 425, 660, 195);
    c1.fillStyle = "#94a3b8";
    c1.font = "bold 12px monospace";
    c1.fillText("PEAK ID     RET TIME (min)    AREA (uV*s)    HEIGHT (uV)    PLATES (N)    PURITY", 35, 450);
    c1.strokeStyle = "#334155";
    c1.beginPath(); c1.moveTo(30, 460); c1.lineTo(670, 460); c1.stroke();
    c1.fillStyle = "#e2e8f0";
    c1.font = "12px monospace";
    c1.fillText("01 Solvent       1.85 min          94,210         18,420         3,850       PASS", 35, 485);
    c1.fillStyle = "#3dd68c";
    c1.fillText("02 API-Form B    4.42 min       1,942,650        482,150        14,250     99.88% PASS", 35, 515);
    c1.fillStyle = "#e2e8f0";
    c1.fillText("03 Int. Std      7.15 min         312,400         95,200         8,920       PASS", 35, 545);
    c1.fillStyle = "#38bdf8";
    c1.fillText("SYSTEM SUITABILITY: RSD = 0.32% (SPEC: <= 1.00%) · RESOLUTION Rs = 4.2", 35, 585);

    // Right Sidebar: Live Connected Twins Telemetry Status
    c1.fillStyle = "#0c1322";
    c1.fillRect(700, 55, 305, 565);
    c1.strokeStyle = "#1e293b";
    c1.strokeRect(700, 55, 305, 565);
    c1.fillStyle = "#38bdf8";
    c1.font = "bold 14px 'IBM Plex Sans', sans-serif";
    c1.fillText("LIVE TWIN NETWORK (14 ONLINE)", 720, 85);

    const instList = [
      ["Centrifuge Micro 5424-R", "15,000 RPM · 4.0°C"],
      ["Freeze Dryer FD-8", "-84.2°C · 0.040 mbar"],
      ["Disintegration ZT-322", "37.0°C · 30.0 SPM"],
      ["Karl Fischer Titrator", "Drift: 14.2 uL/min"],
      ["Mettler XSE204 Balance", "0.0000 g Stable"],
      ["UV-Vis Spectrophotometer", "Abs 0.428 @ 590nm"],
      ["FTIR ATR Spectrometer", "99.2% Ester Match"],
      ["Rotary Evaporator", "55.0°C · 42 mbar"]
    ];
    instList.forEach(([inst, stat], idx) => {
      c1.fillStyle = "#3dd68c";
      c1.fillText("●", 720, 125 + idx * 56);
      c1.fillStyle = "#f1f5f9";
      c1.font = "bold 13px 'IBM Plex Sans', sans-serif";
      c1.fillText(inst, 738, 125 + idx * 56);
      c1.fillStyle = "#94a3b8";
      c1.font = "12px monospace";
      c1.fillText(stat, 738, 143 + idx * 56);
    });

    const mon1 = this._createRealisticWorkstationMonitor({
      name: "Monitor_Left_HPLC",
      x: -0.38,
      y: deskH + 0.006,
      z: 0.18,
      rotY: Math.PI - 0.12,
      canvas: mon1Canvas,
      standH: 0.30
    });
    office.add(mon1);

    // Monitor 2 (Right - 32" 4K 3D Protein-Ligand & USP Dissolution Studio)
    const mon2Canvas = document.createElement("canvas");
    mon2Canvas.width = 1024;
    mon2Canvas.height = 640;
    const c2 = mon2Canvas.getContext("2d");
    c2.fillStyle = "#070a0f";
    c2.fillRect(0, 0, 1024, 640);

    // OS Top Menu Bar
    c2.fillStyle = "#111827";
    c2.fillRect(0, 0, 1024, 38);
    c2.fillStyle = "#38bdf8";
    c2.font = "bold 15px monospace";
    c2.fillText("SRE MolecularStudio 3D & USP Compliance", 16, 24);
    c2.fillStyle = "#94a3b8";
    c2.font = "13px sans-serif";
    c2.fillText("View   Ligand   Pockets   Docking   USP Monograph   Export", 380, 24);

    // Window 1: 3D Protein-Ligand Binding Pocket Viewer
    c2.fillStyle = "#0b1120";
    c2.strokeStyle = "#1e293b";
    c2.lineWidth = 2;
    c2.fillRect(20, 55, 620, 360);
    c2.strokeRect(20, 55, 620, 360);

    c2.fillStyle = "#1e293b";
    c2.fillRect(20, 55, 620, 30);
    c2.fillStyle = "#f1f5f9";
    c2.font = "bold 13px sans-serif";
    c2.fillText("CRYSTAL STRUCTURE: PDB 7K8X · BINDING CAVITY ALPHA-HELIX INTERACTION", 35, 76);

    // 3D Molecular Cartoon Simulation Graphics
    c2.strokeStyle = "#e879f9";
    c2.lineWidth = 5;
    c2.beginPath();
    for (let t = 0; t <= 360; t += 10) {
      const rad = (t * Math.PI) / 180;
      const hx = 120 + t * 0.9;
      const hy = 220 + Math.sin(rad * 4) * 45;
      if (t === 0) c2.moveTo(hx, hy);
      else c2.lineTo(hx, hy);
    }
    c2.stroke();

    // Beta sheet ribbon
    c2.strokeStyle = "#38bdf8";
    c2.lineWidth = 6;
    c2.beginPath();
    c2.moveTo(460, 130); c2.lineTo(540, 200); c2.lineTo(580, 310);
    c2.stroke();

    // Ball-and-Stick Docked Ligand
    c2.fillStyle = "#f43f5e";
    [[310, 240], [350, 220], [390, 250], [340, 280], [380, 310]].forEach(([lx, ly]) => {
      c2.beginPath(); c2.arc(lx, ly, 10, 0, Math.PI * 2); c2.fill();
    });
    c2.strokeStyle = "#ffffff";
    c2.lineWidth = 3;
    c2.beginPath();
    c2.moveTo(310, 240); c2.lineTo(350, 220); c2.lineTo(390, 250);
    c2.lineTo(340, 280); c2.lineTo(380, 310);
    c2.stroke();

    // Hydrogen Bonding Distance Measurements
    c2.setLineDash([4, 4]);
    c2.strokeStyle = "#facc15";
    c2.lineWidth = 2;
    c2.beginPath(); c2.moveTo(350, 220); c2.lineTo(260, 180); c2.stroke();
    c2.setLineDash([]);
    c2.fillStyle = "#facc15";
    c2.font = "bold 12px monospace";
    c2.fillText("HB: 2.74 Å [Tyr-151]", 270, 175);

    // Coordinate Triad Gizmo
    c2.strokeStyle = "#ef4444"; c2.lineWidth = 3;
    c2.beginPath(); c2.moveTo(60, 380); c2.lineTo(100, 380); c2.stroke();
    c2.strokeStyle = "#22c55e";
    c2.beginPath(); c2.moveTo(60, 380); c2.lineTo(60, 340); c2.stroke();
    c2.strokeStyle = "#3b82f6";
    c2.beginPath(); c2.moveTo(60, 380); c2.lineTo(35, 400); c2.stroke();
    c2.fillStyle = "#ffffff"; c2.font = "bold 11px sans-serif";
    c2.fillText("X", 105, 384); c2.fillText("Y", 56, 335); c2.fillText("Z", 25, 410);

    // Window 2: USP <711> Dissolution Testing Audit Report
    c2.fillStyle = "#0c1322";
    c2.fillRect(20, 425, 620, 195);
    c2.strokeStyle = "#1e293b";
    c2.strokeRect(20, 425, 620, 195);
    c2.fillStyle = "#3dd68c";
    c2.font = "bold 13px sans-serif";
    c2.fillText("USP <711> APPARATUS 2 DISSOLUTION PROFILE · BATCH LOT-2026-X84B", 35, 450);

    // Dissolution Curve
    c2.strokeStyle = "#3dd68c";
    c2.lineWidth = 3;
    c2.beginPath();
    for (let t = 0; t <= 480; t += 10) {
      const q = 100 * (1 - Math.exp(-t / 110));
      const y = 590 - q * 1.25;
      if (t === 0) c2.moveTo(50, y);
      else c2.lineTo(50 + t, y);
    }
    c2.stroke();

    // Specification Threshold Line (Q >= 80% at 30 min)
    c2.strokeStyle = "#f43f5e";
    c2.setLineDash([4, 4]);
    c2.beginPath(); c2.moveTo(50, 590 - 80 * 1.25); c2.lineTo(530, 590 - 80 * 1.25); c2.stroke();
    c2.setLineDash([]);
    c2.fillStyle = "#f43f5e";
    c2.font = "11px monospace";
    c2.fillText("USP SPEC: Q >= 80% (Stage 1)", 380, 590 - 80 * 1.25 - 6);

    c2.fillStyle = "#3dd68c";
    c2.font = "bold 13px monospace";
    c2.fillText("RESULT: Q(30 min) = 86.4% · PASS", 35, 605);

    // Right Window: Cleanroom Facility Environmental Monitoring
    c2.fillStyle = "#0c1322";
    c2.fillRect(660, 55, 345, 565);
    c2.strokeStyle = "#1e293b";
    c2.strokeRect(660, 55, 345, 565);
    c2.fillStyle = "#38bdf8";
    c2.font = "bold 14px sans-serif";
    c2.fillText("FACILITY TELEMETRY & CLEANROOM", 680, 85);

    const envParams = [
      ["Cleanroom Differential Press.", "+18.5 Pa [NORMAL]"],
      ["Laminar Flow Velocity", "0.45 m/s [UNIFORM]"],
      ["Ambient Temperature", "21.1°C ± 0.2°C"],
      ["Relative Humidity (RH)", "45.2% [USP SPEC]"],
      ["Liquid N2 Bulk Level", "92.4% Full"],
      ["Helium Line Pressure", "14.2 bar Regulated"],
      ["DI Water Resistivity", "18.2 MOhm*cm @ 25°C"]
    ];
    envParams.forEach(([param, val], idx) => {
      c2.fillStyle = "#f1f5f9";
      c2.font = "bold 12px sans-serif";
      c2.fillText(param, 680, 130 + idx * 62);
      c2.fillStyle = "#3dd68c";
      c2.font = "bold 13px monospace";
      c2.fillText(val, 680, 150 + idx * 62);
    });

    const mon2 = this._createRealisticWorkstationMonitor({
      name: "Monitor_Right_Molecular",
      x: 0.38,
      y: deskH + 0.006,
      z: 0.18,
      rotY: Math.PI + 0.12,
      canvas: mon2Canvas,
      standH: 0.30
    });
    office.add(mon2);

    // 7. Sleek Backlit Mechanical Keyboard with Aluminum Top Plate
    const kbGroup = new THREE.Group();
    kbGroup.position.set(0, deskH + 0.006, -0.06);

    const kbBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.010, 0.13),
      this.materials.cabinetHandle
    );
    kbGroup.add(kbBase);

    const keys = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.006, 0.11),
      this.materials.cabinetBody
    );
    keys.position.set(0, 0.006, 0);
    kbGroup.add(keys);
    office.add(kbGroup);

    // 8. Ergonomic Precision Mouse (Contoured Thumb Rest & Machined Wheel)
    const mouseGroup = new THREE.Group();
    mouseGroup.position.set(0.28, deskH + 0.006, -0.06);

    const mouseBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.022, 0.105),
      this.materials.cabinetBody
    );
    mouseBody.position.y = 0.011;
    mouseGroup.add(mouseBody);

    const scrollWheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.006, 12),
      this.materials.cabinetHandle
    );
    scrollWheel.rotation.z = Math.PI / 2;
    scrollWheel.position.set(0, 0.022, -0.025);
    mouseGroup.add(scrollWheel);
    office.add(mouseGroup);

    // 9. Articulated Architect Cantilever Desk Lamp (Artemide Tolomeo Style)
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-0.95, deskH, 0.25);

    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.015, 16),
      this.materials.cabinetHandle
    );
    lampGroup.add(lampBase);

    const arm1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.38, 0.012),
      this.materials.cabinetHandle
    );
    arm1.position.set(0.06, 0.18, 0);
    arm1.rotation.z = -0.3;
    lampGroup.add(arm1);

    const arm2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.010, 0.35, 0.010),
      this.materials.cabinetHandle
    );
    arm2.position.set(0.18, 0.44, 0);
    arm2.rotation.z = 0.55;
    lampGroup.add(arm2);

    const shade = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.09, 16, 1, true),
      this.materials.cabinetHandle
    );
    shade.position.set(0.30, 0.52, 0);
    shade.rotation.z = -Math.PI / 2 + 0.3;
    lampGroup.add(shade);

    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xfff3d6 })
    );
    bulb.position.set(0.30, 0.50, 0);
    lampGroup.add(bulb);
    office.add(lampGroup);

    // 10. Executive Sideboard Credenza & Italian Espresso Bar (East Wall: X = 3.65)
    const credW = 2.2;
    const credD = 0.52;
    const credH = 0.76;
    const credGroup = new THREE.Group();
    credGroup.position.set(3.65, credH / 2, 0);

    const credBody = new THREE.Mesh(
      new THREE.BoxGeometry(credD, credH, credW),
      this.materials.walnutDesk
    );
    credGroup.add(credBody);

    const credTop = new THREE.Mesh(
      new THREE.BoxGeometry(credD + 0.03, 0.03, credW + 0.03),
      this.materials.marbleWaterfall
    );
    credTop.position.y = credH / 2 + 0.015;
    credGroup.add(credTop);

    // Chrome Italian Dual-Boiler Espresso Machine with E61 Group Head
    const espGroup = new THREE.Group();
    espGroup.position.set(0, credH / 2 + 0.03, 0.45);

    const espChassis = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.35, 0.38),
      this.materials.espressoChrome
    );
    espChassis.position.y = 0.175;
    espGroup.add(espChassis);

    const groupHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.06, 16),
      this.materials.espressoChrome
    );
    groupHead.position.set(-0.20, 0.16, 0);
    espGroup.add(groupHead);

    const portafilter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8),
      this.materials.cabinetBody
    );
    portafilter.rotation.z = Math.PI / 2;
    portafilter.position.set(-0.27, 0.16, 0.08);
    espGroup.add(portafilter);

    const steamWand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.14, 8),
      this.materials.espressoChrome
    );
    steamWand.position.set(-0.19, 0.15, -0.12);
    steamWand.rotation.x = -0.3;
    espGroup.add(steamWand);

    [-0.06, 0.06].forEach((dz) => {
      const dial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.008, 12),
        this.materials.cabinetHandle
      );
      dial.rotation.z = Math.PI / 2;
      dial.position.set(-0.185, 0.28, dz);
      espGroup.add(dial);
    });

    [-0.07, 0.07].forEach((cz) => {
      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.018, 0.045, 12),
        this.materials.porcelainWhite
      );
      cup.position.set(0, 0.38, cz);
      espGroup.add(cup);

      const saucer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.042, 0.006, 12),
        this.materials.porcelainWhite
      );
      saucer.position.set(0, 0.355, cz);
      espGroup.add(saucer);
    });

    credGroup.add(espGroup);

    // Faceted Crystal Decanter on Dark Slate Tray
    const decGroup = new THREE.Group();
    decGroup.position.set(0, credH / 2 + 0.03, -0.45);

    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.015, 0.36),
      this.materials.cabinetBody
    );
    decGroup.add(tray);

    const decanter = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, 0.22, 0.10),
      this.materials.glass
    );
    decanter.position.set(0, 0.11, -0.06);
    decGroup.add(decanter);

    const stopper = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 12, 10),
      this.materials.glass
    );
    stopper.position.set(0, 0.23, -0.06);
    decGroup.add(stopper);

    [-0.05, 0.05].forEach((tz) => {
      const tumbler = new THREE.Mesh(
        new THREE.CylinderGeometry(0.034, 0.034, 0.08, 12),
        this.materials.glass
      );
      tumbler.position.set(0, 0.045, 0.08 + tz);
      decGroup.add(tumbler);
    });

    credGroup.add(decGroup);
    office.add(credGroup);

    // 11. Mid-Century Lounge / Visitor Conversation Nook (South Side: Z = -1.25)
    const loungeGroup = new THREE.Group();
    loungeGroup.position.set(0, 0, -1.25);

    const tableTopGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.025, 24);
    const coffeeTable = new THREE.Mesh(tableTopGeo, this.materials.carraraMarble);
    coffeeTable.position.y = 0.42;
    loungeGroup.add(coffeeTable);

    for (let l = 0; l < 3; l++) {
      const ang = (l * Math.PI * 2) / 3;
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.007, 0.42, 8),
        this.materials.brassAccent
      );
      leg.position.set(Math.cos(ang) * 0.26, 0.21, Math.sin(ang) * 0.26);
      leg.rotation.z = Math.sin(ang) * 0.14;
      leg.rotation.x = Math.cos(ang) * 0.14;
      loungeGroup.add(leg);
    }

    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.05, 0.06, 16),
      this.materials.porcelainWhite
    );
    pot.position.set(0, 0.46, 0);
    loungeGroup.add(pot);

    const succ = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 8),
      this.materials.mossEmerald
    );
    succ.scale.set(1.0, 0.6, 1.0);
    succ.position.set(0, 0.50, 0);
    loungeGroup.add(succ);

    [-1.15, 1.15].forEach((ax, idx) => {
      const chair = new THREE.Group();
      chair.position.set(ax, 0, 0);
      chair.rotation.y = idx === 0 ? 0.35 : -0.35;

      const cSeat = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, 0.14, 0.65),
        this.materials.boucleFabric
      );
      cSeat.position.y = 0.35;
      chair.add(cSeat);

      const cBack = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, 0.42, 0.12),
        this.materials.boucleFabric
      );
      cBack.position.set(0, 0.58, 0.26);
      chair.add(cBack);

      [[-0.26, -0.24], [0.26, -0.24], [-0.26, 0.24], [0.26, 0.24]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.016, 0.010, 0.28, 8),
          this.materials.walnutDesk
        );
        leg.position.set(lx, 0.14, lz);
        leg.rotation.z = (lx > 0 ? -1 : 1) * 0.12;
        chair.add(leg);

        const ferrule = new THREE.Mesh(
          new THREE.CylinderGeometry(0.011, 0.010, 0.04, 8),
          this.materials.brassAccent
        );
        ferrule.position.set(lx, 0.02, lz);
        chair.add(ferrule);
      });

      loungeGroup.add(chair);
    });

    office.add(loungeGroup);

    // 12. Bespoke Architectural Library Shelving (West Wall: X = -3.65)
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(-3.65, 0, 0);

    const shelfW = 2.4;
    const shelfH = 2.6;
    const shelfD = 0.38;

    const shelfFrame = new THREE.Mesh(
      new THREE.BoxGeometry(shelfD, shelfH, shelfW),
      this.materials.walnutDesk
    );
    shelfFrame.position.y = shelfH / 2;
    shelfGroup.add(shelfFrame);

    const bookColors = [0x991b1b, 0x1e3a8a, 0x065f46, 0x581c87, 0x1e293b, 0x854d0e];
    for (let row = 0; row < 5; row++) {
      const y = 0.38 + row * 0.48;

      const ledStrip = new THREE.Mesh(
        new THREE.BoxGeometry(shelfD * 0.85, 0.01, shelfW * 0.95),
        this.materials.ledLightPanel
      );
      ledStrip.position.set(0, y + 0.46, 0);
      shelfGroup.add(ledStrip);

      for (let b = 0; b < 10; b++) {
        const bookH = 0.24 + (b % 3) * 0.04;
        const bookW = 0.045 + (b % 2) * 0.02;
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.24, bookH, bookW),
          new THREE.MeshStandardMaterial({
            color: bookColors[(row * 3 + b) % bookColors.length],
            roughness: 0.65
          })
        );
        book.position.set(0, y + bookH / 2, -shelfW / 2 + 0.25 + b * 0.07);
        if (b === 4) book.rotation.x = 0.18;
        if (b === 8) book.rotation.x = -0.15;
        shelfGroup.add(book);
      }
    }

    // Curated Artifact: 3D Crystal Lattice Model on Middle Shelf
    const crystalModel = new THREE.Group();
    crystalModel.position.set(0, 1.40, 0.65);
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.025, 0.12),
      this.materials.walnutDesk
    );
    crystalModel.add(plinth);

    const crystalGeo = new THREE.OctahedronGeometry(0.08, 0);
    const crystal = new THREE.Mesh(
      crystalGeo,
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true })
    );
    crystal.position.y = 0.10;
    crystalModel.add(crystal);
    shelfGroup.add(crystalModel);

    // Cascading Pothos Houseplant on Top Shelf
    const plantPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.07, 0.12, 16),
      this.materials.porcelainWhite
    );
    plantPot.position.set(0, 2.45, -0.65);
    shelfGroup.add(plantPot);

    const trailingVines = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 8),
      this.materials.mossEmerald
    );
    trailingVines.scale.set(1.0, 1.8, 1.0);
    trailingVines.position.set(0.05, 2.35, -0.65);
    shelfGroup.add(trailingVines);

    office.add(shelfGroup);

    // 13. Suspended Floating LED Halo Chandelier Above Desk
    const haloGroup = new THREE.Group();
    haloGroup.position.set(0, 2.95, 0);

    const haloRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.016, 12, 32),
      this.materials.ledLightPanel
    );
    haloRing.rotation.x = Math.PI / 2;
    haloGroup.add(haloRing);

    [-0.55, 0.55].forEach((hx) => {
      const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0015, 0.0015, 0.85, 6),
        this.materials.cabinetHandle
      );
      wire.position.set(hx, 0.42, 0);
      haloGroup.add(wire);
    });
    office.add(haloGroup);

    this.root.add(office);
    this.colliders.push(new THREE.Box3().setFromObject(office));
  }

  // --- Executive Conference Room Furniture (Zone 10) ---
  _buildConferenceRoomFurniture() {
    const conf = new THREE.Group();
    conf.position.set(12.0, 0, 2.25);
    conf.name = "Executive_Conference_Room_Furniture";

    // 1. Smoked Oak Herringbone Parquet Floor Slab
    const floorSlab = new THREE.Mesh(
      new THREE.BoxGeometry(7.8, 0.01, 4.3),
      this.materials.oakHerringbone
    );
    floorSlab.position.set(0, 0.005, 0);
    conf.add(floorSlab);

    // 2. 10-Person Boat-Shaped Executive Walnut Slab Conference Table
    const tableW = 4.6;
    const tableD = 1.5;
    const tableH = 0.75;
    const topT = 0.055;

    // Sculptural boat-shaped slab (wide at center, tapering gently at ends)
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(tableW, topT, tableD),
      this.materials.walnutDesk
    );
    tableTop.position.y = tableH - topT / 2;
    tableTop.castShadow = true;
    conf.add(tableTop);

    // Twin Curved Architectural Pedestal Pylons in Matte Steel
    [-1.45, 1.45].forEach((tx) => {
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.32, tableH - topT, 16),
        this.materials.cabinetBody
      );
      pedestal.scale.set(0.65, 1.0, 1.8);
      pedestal.position.set(tx, (tableH - topT) / 2, 0);
      conf.add(pedestal);
    });

    // Dual Flush Pop-Up Brushed Aluminum Power & Media Modules
    [-0.85, 0.85].forEach((mx) => {
      const moduleBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.006, 0.16),
        this.materials.cabinetHandle
      );
      moduleBox.position.set(mx, tableH + 0.003, 0);
      conf.add(moduleBox);
    });

    // 3. 10 High-Fidelity Executive Swivel Chairs with Rolling Casters
    for (let c = 0; c < 4; c++) {
      const x = -1.5 + c * 1.0;
      // North side chairs
      const chairN = this._createChairMesh();
      chairN.position.set(x, 0, 0.98);
      chairN.rotation.y = Math.PI;
      conf.add(chairN);

      // South side chairs
      const chairS = this._createChairMesh();
      chairS.position.set(x, 0, -0.98);
      conf.add(chairS);
    }
    // Head & Foot of Table chairs
    const chairE = this._createChairMesh();
    chairE.position.set(2.45, 0, 0);
    chairE.rotation.y = -Math.PI / 2;
    conf.add(chairE);

    const chairW = this._createChairMesh();
    chairW.position.set(-2.45, 0, 0);
    chairW.rotation.y = Math.PI / 2;
    conf.add(chairW);

    // 4. Executive Leather Blotters, Water Carafes & Glassware
    for (let c = 0; c < 4; c++) {
      const x = -1.5 + c * 1.0;
      [-0.48, 0.48].forEach(bz => {
        const bl = new THREE.Mesh(
          new THREE.BoxGeometry(0.52, 0.005, 0.36),
          this.materials.leatherMat
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
    [-1.85, 1.85].forEach(bx => {
      const bl = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.005, 0.52),
        this.materials.leatherMat
      );
      bl.position.set(bx, tableH + 0.003, 0);
      conf.add(bl);
    });

    // 2 Crystal-Clear Glass Water Carafes & Tumblers along table centerline
    const confGlassMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.4
    });

    [-0.65, 0.65].forEach(cx => {
      const carafe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.07, 0.24, 16),
        confGlassMat
      );
      carafe.position.set(cx, tableH + 0.12, 0);
      conf.add(carafe);

      [-0.14, 0.14].forEach(tz => {
        const tumbler = new THREE.Mesh(
          new THREE.CylinderGeometry(0.034, 0.030, 0.09, 16),
          confGlassMat
        );
        tumbler.position.set(cx, tableH + 0.045, tz);
        conf.add(tumbler);
      });
    });

    // 5. Center-of-Table Crestron-Style 10" Touch Conference Controller
    const ctlGroup = new THREE.Group();
    ctlGroup.position.set(0, tableH + 0.005, 0);

    const ctlWedge = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.06, 0.18),
      this.materials.cabinetBody
    );
    ctlWedge.rotation.x = -0.35; // Angled display face toward head of table
    ctlGroup.add(ctlWedge);

    const ctlScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.14),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    ctlScreen.position.set(0, 0.035, 0.02);
    ctlScreen.rotation.x = -0.35;
    ctlGroup.add(ctlScreen);
    conf.add(ctlGroup);

    // 6. Ultra-Slim 98" 4K Commercial Telepresence Display (Mounted in front of North Slatted Wall at Z = 2.05)
    const tvGroup = new THREE.Group();
    tvGroup.position.set(0, 1.95, 2.05); // Cleanly in front of slats at Z = 2.18
    tvGroup.rotation.y = Math.PI; // Face south towards conference table

    // Micro-Bezel Commercial Housing
    const tvW = 2.22;
    const tvH = 1.28;
    const tvHousing = new THREE.Mesh(
      new THREE.BoxGeometry(tvW, tvH, 0.04),
      this.materials.screenBezelMetal
    );
    tvGroup.add(tvHousing);

    // High-Resolution Presentation Canvas Display
    const tvCanvas = document.createElement("canvas");
    tvCanvas.width = 1024;
    tvCanvas.height = 576;
    const ctx = tvCanvas.getContext("2d");
    ctx.fillStyle = "#070a0f";
    ctx.fillRect(0, 0, 1024, 576);

    // Top Header
    ctx.fillStyle = "#0c1322";
    ctx.fillRect(0, 0, 1024, 55);
    ctx.fillStyle = "#00d4e8";
    ctx.font = "bold 26px 'IBM Plex Sans', sans-serif";
    ctx.fillText("SRE DESIGNS BIOTECH · BOARDROOM TELEPRESENCE", 35, 38);
    ctx.fillStyle = "#3dd68c";
    ctx.font = "bold 15px monospace";
    ctx.fillText("● ENCRYPTED TELECONFERENCE ACTIVE · 4 STREAMS", 620, 38);

    // Left Area: 3 Remote Executive Video Feeds
    const execFeeds = [
      ["Dr. C. Vance", "Chief Scientific Officer", "#1e3a5f"],
      ["Elena Rostova", "VP Regulatory Affairs", "#3b1e5f"],
      ["Dr. Marcus Thorne", "Head of Formulation", "#1e5f3b"]
    ];
    execFeeds.forEach(([name, title, color], i) => {
      ctx.fillStyle = color;
      ctx.fillRect(35, 75 + i * 155, 260, 140);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.strokeRect(35, 75 + i * 155, 260, 140);

      // Silhouette avatar
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath();
      ctx.arc(165, 130 + i * 155, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px 'IBM Plex Sans', sans-serif";
      ctx.fillText(name, 45, 195 + i * 155);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px sans-serif";
      ctx.fillText(title, 45, 210 + i * 155);
    });

    // Center/Right Area: Slide Presentation (Phase III Stability & Dissolution)
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(320, 75, 670, 465);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.strokeRect(320, 75, 670, 465);

    ctx.fillStyle = "#facc15";
    ctx.font = "bold 22px 'IBM Plex Sans', sans-serif";
    ctx.fillText("PHASE III COMPARATIVE DISSOLUTION & STABILITY", 350, 115);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px 'IBM Plex Mono', monospace";
    ctx.fillText("Active Cohort: 12-Month Accelerated Storage (40°C / 75% RH)", 350, 145);

    // Bar chart comparison
    const batches = [
      ["Pilot Batch A", 98.4, "#00d4e8"],
      ["Scale-Up Batch B", 99.1, "#3dd68c"],
      ["Commercial Lot 1", 99.6, "#38bdf8"],
      ["Commercial Lot 2", 99.4, "#a855f7"]
    ];
    batches.forEach(([label, val, barCol], bi) => {
      const y = 180 + bi * 75;
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 13px 'IBM Plex Sans', sans-serif";
      ctx.fillText(label, 350, y + 20);

      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fillRect(490, y, 420, 32);

      ctx.fillStyle = barCol;
      ctx.fillRect(490, y, (val / 100) * 420, 32);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px monospace";
      ctx.fillText(`${val}% Recovery`, 920, y + 22);
    });

    const tvTex = new THREE.CanvasTexture(tvCanvas);
    const tvScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(tvW - 0.04, tvH - 0.04),
      new THREE.MeshBasicMaterial({ map: tvTex })
    );
    tvScreen.position.set(0, 0, 0.022);
    tvHousing.add(tvScreen);

    // Commercial Video Bar (PTZ Camera & Beamforming Mic Array) Mounted Beneath Screen
    const barW = 0.95;
    const barH = 0.07;
    const barD = 0.08;
    const videoBar = new THREE.Mesh(
      new THREE.BoxGeometry(barW, barH, barD),
      this.materials.cabinetBody
    );
    videoBar.position.set(0, -tvH / 2 - barH / 2 - 0.03, 0.02);
    tvGroup.add(videoBar);

    // Motorized Camera Lens in Center
    const lensRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.015, 16),
      this.materials.cabinetHandle
    );
    lensRing.rotation.x = Math.PI / 2;
    lensRing.position.set(0, -tvH / 2 - barH / 2 - 0.03, barD / 2 + 0.01);
    tvGroup.add(lensRing);

    conf.add(tvGroup);

    // 7. Hospitality Buffet Credenza along South Wall (Z = -1.95)
    const buffW = 2.6;
    const buffD = 0.48;
    const buffH = 0.76;
    const buffGroup = new THREE.Group();
    buffGroup.position.set(0, buffH / 2, -1.95);

    const buffBody = new THREE.Mesh(
      new THREE.BoxGeometry(buffW, buffH, buffD),
      this.materials.walnutDesk
    );
    buffGroup.add(buffBody);

    const buffTop = new THREE.Mesh(
      new THREE.BoxGeometry(buffW + 0.03, 0.03, buffD + 0.03),
      this.materials.marbleWaterfall
    );
    buffTop.position.y = buffH / 2 + 0.015;
    buffGroup.add(buffTop);

    // Brushed Brass Swan-Neck Water Tap & Glassware Tray
    const tap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.28, 12),
      this.materials.brassAccent
    );
    tap.position.set(-0.75, buffH / 2 + 0.14, 0);
    buffGroup.add(tap);

    // Stacked Glassware on Linen Tray
    const glassTray = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.015, 0.25),
      this.materials.leatherMat
    );
    glassTray.position.set(-0.35, buffH / 2 + 0.03, 0);
    buffGroup.add(glassTray);

    for (let g = 0; g < 4; g++) {
      const gl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.030, 0.026, 0.08, 12),
        this.materials.glass
      );
      gl.position.set(-0.42 + (g % 2) * 0.07, buffH / 2 + 0.08, -0.05 + Math.floor(g / 2) * 0.08);
      buffGroup.add(gl);
    }

    conf.add(buffGroup);

    // 8. Collaboration Glass Dry-Erase Whiteboard on West Wall (X = -3.75)
    const wbGroup = new THREE.Group();
    wbGroup.position.set(-3.75, 1.85, 0);
    wbGroup.rotation.y = Math.PI / 2;

    const wbBoard = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 1.3, 0.015),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.12, metalness: 0.05 })
    );
    wbGroup.add(wbBoard);

    const wbTray = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.02, 0.08),
      this.materials.cabinetHandle
    );
    wbTray.position.set(0, -0.66, 0.04);
    wbGroup.add(wbTray);

    // Color-Coded Markers & Felt Eraser
    const mColors = [0x0f172a, 0x0284c7, 0xdc2626, 0x16a34a];
    mColors.forEach((mc, i) => {
      const m = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.007, 0.12, 8),
        new THREE.MeshStandardMaterial({ color: mc, roughness: 0.3 })
      );
      m.rotation.z = Math.PI / 2;
      m.position.set(-0.8 + i * 0.14, -0.64, 0.04);
      wbGroup.add(m);
    });
    const eraser = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.035, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 })
    );
    eraser.position.set(0.8, -0.64, 0.04);
    wbGroup.add(eraser);

    conf.add(wbGroup);

    // 9. Modern Suspended Linear Architectural Luminaire Floating Above Table
    const lumGroup = new THREE.Group();
    lumGroup.position.set(0, 2.95, 0);

    const lumHousing = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.05, 0.12),
      this.materials.cabinetBody
    );
    lumGroup.add(lumHousing);

    const lumDiffuser = new THREE.Mesh(
      new THREE.BoxGeometry(3.16, 0.015, 0.10),
      this.materials.ledLightPanel
    );
    lumDiffuser.position.y = -0.026;
    lumGroup.add(lumDiffuser);

    // Aircraft Suspension Cables
    [-1.2, 1.2].forEach((lx) => {
      const cable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0015, 0.0015, 0.85, 6),
        this.materials.cabinetHandle
      );
      cable.position.set(lx, 0.42, 0);
      lumGroup.add(cable);
    });

    conf.add(lumGroup);

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
