/**
 * LabEnvironment3D.js — Modern Architectural Facility Shell
 * 
 * Features:
 * - 32.0m x 18.0m world-class modern biotech research architecture
 * - Vertical acoustic American walnut / white oak slats on dark acoustic felt
 * - Board-formed charcoal concrete columns with recessed electrical panels
 * - Floor-to-ceiling double-glazed partitions with dark architectural bronze mullions
 * - Polished silver-grey terrazzo with brass divider grid lines in lab halls
 * - Woven slate-blue carpet in executive offices & conference suites
 * - Preserved Nordic moss feature wall with backlit brass signage
 * - Calibrated 3-point studio lighting + concealed perimeter warm cove wash (3500K)
 * - Suspended acoustic ceiling clouds & minimalist matte black linear LED luminaires
 */
import * as THREE from "three";

export class LabEnvironment3D {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = "Modern_Lab_Facility_Root";
    this.colliders = [];
    this.materials = {};

    this._initMaterials();
    this._buildFloorsWithGrid();
    this._buildPerimeterWalls();
    this._buildInteriorPartitions();
    this._buildThermalAirlock();
    this._buildStructuralPillars();
    this._buildCeilingAndLighting();
    this._buildBiophilicWall();
    this._buildExteriorCampusSite();

    this.scene.add(this.root);
  }

  _initMaterials() {
    this.materials.terrazzo = new THREE.MeshStandardMaterial({
      color: 0xc8d0d8,
      roughness: 0.24,
      metalness: 0.12,
      name: "Mat_Terrazzo_Polished"
    });

    this.materials.gridStrip = new THREE.MeshStandardMaterial({
      color: 0x98a2ad,
      roughness: 0.35,
      metalness: 0.85,
      name: "Mat_Brass_Floor_Strip"
    });

    this.materials.carpet = new THREE.MeshStandardMaterial({
      color: 0x141a24,
      roughness: 0.88,
      metalness: 0.02,
      name: "Mat_Woven_Slate_Carpet"
    });

    this.materials.porcelainTile = new THREE.MeshStandardMaterial({
      color: 0x20242c,
      roughness: 0.32,
      metalness: 0.15,
      name: "Mat_Graphite_Porcelain"
    });

    this.materials.wallDrywall = new THREE.MeshStandardMaterial({
      color: 0xe5e9ee,
      roughness: 0.8,
      metalness: 0.02,
      name: "Mat_Modern_Drywall"
    });

    this.materials.baseboard = new THREE.MeshStandardMaterial({
      color: 0x2b323c,
      roughness: 0.5,
      metalness: 0.3,
      name: "Mat_Architectural_Baseboard"
    });

    this.materials.charcoalConcrete = new THREE.MeshStandardMaterial({
      color: 0x272c35,
      roughness: 0.72,
      metalness: 0.18,
      name: "Mat_Charcoal_Concrete"
    });

    this.materials.woodSlat = new THREE.MeshStandardMaterial({
      color: 0x6e4624,
      roughness: 0.45,
      metalness: 0.05,
      name: "Mat_Walnut_Wood"
    });

    this.materials.woodSlatBacking = new THREE.MeshStandardMaterial({
      color: 0x101216,
      roughness: 0.95,
      metalness: 0.0,
      name: "Mat_Acoustic_Felt"
    });

    this.materials.bronzeMullion = new THREE.MeshStandardMaterial({
      color: 0x221e1a,
      roughness: 0.28,
      metalness: 0.85,
      name: "Mat_Dark_Bronze"
    });

    this.materials.glass = new THREE.MeshPhysicalMaterial({
      color: 0xf0f8ff,
      transparent: true,
      opacity: 0.32,
      roughness: 0.04,
      metalness: 0.05,
      ior: 1.52,
      name: "Mat_Acoustic_Glass"
    });

    this.materials.mossGreen = new THREE.MeshStandardMaterial({
      color: 0x1f5c24,
      roughness: 0.92,
      metalness: 0.02,
      name: "Mat_Preserved_Moss"
    });

    this.materials.ceilingDark = new THREE.MeshStandardMaterial({
      color: 0x111419,
      roughness: 0.92,
      metalness: 0.1,
      name: "Mat_Open_Plenum_Ceiling"
    });

    this.materials.acousticCloud = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.65,
      metalness: 0.02,
      name: "Mat_Ceiling_Cloud"
    });

    this.materials.ledLightPanel = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff2e0,
      emissiveIntensity: 1.1,
      roughness: 0.2,
      name: "Mat_LED_Emitter"
    });

    // Exterior Campus & Parking Materials
    this.materials.asphalt = new THREE.MeshStandardMaterial({
      color: 0x181c22,
      roughness: 0.88,
      metalness: 0.05,
      name: "Mat_Parking_Asphalt"
    });

    this.materials.parkingStripe = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.0,
      name: "Mat_Reflective_Stripe"
    });

    this.materials.adaBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.45,
      metalness: 0.0,
      name: "Mat_ADA_Blue"
    });

    this.materials.adaYellow = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.4,
      metalness: 0.0,
      name: "Mat_ADA_Yellow"
    });

    this.materials.grassTurf = new THREE.MeshStandardMaterial({
      color: 0x244f2a,
      roughness: 0.95,
      metalness: 0.0,
      name: "Mat_Lawn_Turf"
    });

    this.materials.mulchBed = new THREE.MeshStandardMaterial({
      color: 0x26190e,
      roughness: 0.9,
      metalness: 0.0,
      name: "Mat_Dark_Mulch"
    });

    this.materials.boxwoodGreen = new THREE.MeshStandardMaterial({
      color: 0x184420,
      roughness: 0.78,
      metalness: 0.02,
      name: "Mat_Boxwood_Foliage"
    });

    this.materials.concreteCurb = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.75,
      metalness: 0.1,
      name: "Mat_Concrete_Curb"
    });

    this.materials.treeTrunk = new THREE.MeshStandardMaterial({
      color: 0x524338,
      roughness: 0.85,
      metalness: 0.0,
      name: "Mat_Birch_Bark"
    });

    this.materials.treeLeaves = new THREE.MeshStandardMaterial({
      color: 0x2e6d3e,
      roughness: 0.72,
      metalness: 0.02,
      name: "Mat_Tree_Canopy"
    });
  }

  _buildFloorsWithGrid() {
    const W = 32.0;
    const D = 18.0;

    // 1. Main Lab Floor (Terrazzo) - West & Central areas (X: -16 to 8)
    const labFloorGeo = new THREE.PlaneGeometry(24.0, D);
    const labFloor = new THREE.Mesh(labFloorGeo, this.materials.terrazzo);
    labFloor.rotation.x = -Math.PI / 2;
    labFloor.position.set(-4.0, 0, 0);
    labFloor.receiveShadow = true;
    this.root.add(labFloor);

    // Architectural expansion divider grid strips every 3 meters
    for (let x = -16.0; x <= 8.0; x += 3.0) {
      const stripX = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.003, D), this.materials.gridStrip);
      stripX.position.set(x, 0.0015, 0);
      this.root.add(stripX);
    }
    for (let z = -9.0; z <= 9.0; z += 3.0) {
      const stripZ = new THREE.Mesh(new THREE.BoxGeometry(24.0, 0.003, 0.012), this.materials.gridStrip);
      stripZ.position.set(-4.0, 0.0015, z);
      this.root.add(stripZ);
    }

    // 2. Executive Office & Conference Suite Floor (Woven Slate Carpet) - East Wing (X: 8 to 16, Z: 0 to 9)
    const officeFloorGeo = new THREE.PlaneGeometry(8.0, 9.0);
    const officeFloor = new THREE.Mesh(officeFloorGeo, this.materials.carpet);
    officeFloor.rotation.x = -Math.PI / 2;
    officeFloor.position.set(12.0, 0.003, 4.5);
    officeFloor.receiveShadow = true;
    this.root.add(officeFloor);

    // 3. Thermal Airlock & Restroom Floor (Graphite Porcelain) - East Wing (X: 8 to 16, Z: -9 to 0)
    const tileFloorGeo = new THREE.PlaneGeometry(8.0, 9.0);
    const tileFloor = new THREE.Mesh(tileFloorGeo, this.materials.porcelainTile);
    tileFloor.rotation.x = -Math.PI / 2;
    tileFloor.position.set(12.0, 0.003, -4.5);
    tileFloor.receiveShadow = true;
    this.root.add(tileFloor);
  }

  _buildPerimeterWalls() {
    const H = 3.8;
    const wallT = 0.2;
    const W = 32.0;
    const D = 18.0;

    const walls = [
      // North Wall (Z = +9.0)
      { x: 0, y: H / 2, z: D / 2, sx: W, sy: H, sz: wallT, mat: this.materials.wallDrywall },
      // South Wall Left Segment (X: -16.0 to 11.95, width = 27.95, center = -2.025)
      { x: -2.025, y: H / 2, z: -D / 2, sx: 27.95, sy: H, sz: wallT, mat: this.materials.wallDrywall },
      // South Wall Right Segment (X: 14.05 to 16.0, width = 1.95, center = 15.025)
      { x: 15.025, y: H / 2, z: -D / 2, sx: 1.95, sy: H, sz: wallT, mat: this.materials.wallDrywall },
      // South Wall Entrance Header Lintel (X: 11.95 to 14.05, width = 2.1, height = 1.35, center Y = 3.125)
      { x: 13.0, y: 3.125, z: -D / 2, sx: 2.1, sy: 1.35, sz: wallT, mat: this.materials.wallDrywall, isHeader: true },
      // West Wall (X = -16.0)
      { x: -W / 2, y: H / 2, z: 0, sx: wallT, sy: H, sz: D, mat: this.materials.charcoalConcrete },
      // East Wall (X = +16.0)
      { x: W / 2, y: H / 2, z: 0, sx: wallT, sy: H, sz: D, mat: this.materials.wallDrywall }
    ];

    walls.forEach((w, idx) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w.sx, w.sy, w.sz), w.mat);
      mesh.position.set(w.x, w.y, w.z);
      mesh.receiveShadow = true;
      mesh.name = `Perimeter_Wall_${idx}`;
      this.root.add(mesh);

      // Baseboard trim (skip overhead entrance header)
      if (!w.isHeader) {
        const bbH = 0.12;
        const bbT = 0.02;
        const isNS = w.sz === wallT;
        const bb = new THREE.Mesh(
          new THREE.BoxGeometry(isNS ? w.sx : bbT, bbH, isNS ? bbT : w.sz),
          this.materials.baseboard
        );
        bb.position.set(w.x, bbH / 2, isNS ? (w.z > 0 ? w.z - wallT / 2 - bbT / 2 : w.z + wallT / 2 + bbT / 2) : (w.x > 0 ? w.x - wallT / 2 - bbT / 2 : w.x + wallT / 2 + bbT / 2));
        this.root.add(bb);
      }

      this.colliders.push(new THREE.Box3().setFromObject(mesh));
    });
  }

  _buildInteriorPartitions() {
    const H = 3.8;
    const wallT = 0.15;

    // East Wing Glass Partition Wall looking into User's Office (X = 8.0, Z: 1.0 to 9.0)
    this._buildGlassPartitionWall(8.0, 5.0, 8.0, H, "Z");

    // Solid dividing wall between Office wing and Airlock (X = 8.0, Z: -9.0 to 0.0)
    const airlockSpineWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallT, H, 9.0),
      this.materials.wallDrywall
    );
    airlockSpineWall.position.set(8.0, H / 2, -4.5);
    this.root.add(airlockSpineWall);
    this.colliders.push(new THREE.Box3().setFromObject(airlockSpineWall));

    // Dividing wall between Conference Room and User's Office (Z = 4.5, X: 8.0 to 16.0)
    const confDividingWall = new THREE.Mesh(
      new THREE.BoxGeometry(8.0, H, wallT),
      this.materials.wallDrywall
    );
    confDividingWall.position.set(12.0, H / 2, 4.5);
    this.root.add(confDividingWall);
    this.colliders.push(new THREE.Box3().setFromObject(confDividingWall));

    // Acoustic Walnut Slat feature wall in Conference Room (North side of Z = 4.5 wall)
    this._buildWoodSlatPanel(12.0, H / 2, 4.4, 7.6, H * 0.95, false);

    // Acoustic Walnut Slat feature wall in User's Office (East perimeter wall X = 15.88, Z: 5.0 to 8.5)
    this._buildWoodSlatPanel(15.88, H / 2, 6.75, 4.0, H * 0.95, true);

    // Glass wall dividing User Office / Conference from Central Corridor (Z = 0.5, X: 8.0 to 16.0)
    this._buildGlassPartitionWall(12.0, 0.5, 8.0, H, "X");

    // Partition separating Restroom (X: 8.0 to 11.60, Z: -4.55 to 0.0) from Entrance Corridor (X: 11.60 to 16.0)
    // South wall segment (Z: -4.55 to -2.85, width = 1.70m, center = -3.70m)
    const restroomSouthWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallT, H, 1.70),
      this.materials.charcoalConcrete
    );
    restroomSouthWall.position.set(11.60, H / 2, -3.70);
    this.root.add(restroomSouthWall);
    this.colliders.push(new THREE.Box3().setFromObject(restroomSouthWall));

    // North wall segment (Z: -1.65 to 0.0, width = 1.65m, center = -0.825m)
    const restroomNorthWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallT, H, 1.65),
      this.materials.charcoalConcrete
    );
    restroomNorthWall.position.set(11.60, H / 2, -0.825);
    this.root.add(restroomNorthWall);
    this.colliders.push(new THREE.Box3().setFromObject(restroomNorthWall));

    // Header segment above doorway (Z: -2.85 to -1.65, width = 1.20m, height = 1.40m, center Y = 3.10m)
    const restroomHeader = new THREE.Mesh(
      new THREE.BoxGeometry(wallT, 1.40, 1.20),
      this.materials.charcoalConcrete
    );
    restroomHeader.position.set(11.60, 3.10, -2.25);
    this.root.add(restroomHeader);
    this.colliders.push(new THREE.Box3().setFromObject(restroomHeader));

    // North dividing wall of Restroom Suite (Z = 0.0, X: 8.0 to 11.60, width = 3.60m, center X = 9.80)
    const restroomDividingNorthWall = new THREE.Mesh(
      new THREE.BoxGeometry(3.60, H, wallT),
      this.materials.wallDrywall
    );
    restroomDividingNorthWall.position.set(9.80, H / 2, 0.0);
    this.root.add(restroomDividingNorthWall);
    this.colliders.push(new THREE.Box3().setFromObject(restroomDividingNorthWall));

    // Synthesis Bay Architectural Low Glass Partition with Bronze Cap Rail (X = -5.0, Z: 1.0 to 9.0)
    this._buildGlassPartitionWall(-5.0, 5.0, 8.0, 1.15, "Z");
  }

  _buildWoodSlatPanel(cx, cy, cz, width, height, rotateY = false) {
    const group = new THREE.Group();
    group.position.set(cx, cy, cz);
    if (rotateY) group.rotation.y = Math.PI / 2;

    const backGeo = new THREE.PlaneGeometry(width, height);
    const backing = new THREE.Mesh(backGeo, this.materials.woodSlatBacking);
    group.add(backing);

    const slatW = 0.045;
    const slatD = 0.022;
    const slatGap = 0.035;
    const numSlats = Math.floor(width / (slatW + slatGap));
    const startX = -((numSlats - 1) * (slatW + slatGap)) / 2;

    const slatGeo = new THREE.BoxGeometry(slatW, height, slatD);
    for (let i = 0; i < numSlats; i++) {
      const slat = new THREE.Mesh(slatGeo, this.materials.woodSlat);
      slat.position.set(startX + i * (slatW + slatGap), 0, slatD / 2);
      slat.castShadow = true;
      group.add(slat);
    }

    this.root.add(group);
  }

  _buildGlassPartitionWall(cx, cz, length, height, axis = "X") {
    const group = new THREE.Group();
    group.position.set(cx, height / 2, cz);
    if (axis === "Z") group.rotation.y = Math.PI / 2;

    const runnerGeo = new THREE.BoxGeometry(length, 0.08, 0.08);
    const bottomRunner = new THREE.Mesh(runnerGeo, this.materials.bronzeMullion);
    bottomRunner.position.y = -height / 2 + 0.04;
    group.add(bottomRunner);

    const topRunner = new THREE.Mesh(runnerGeo, this.materials.bronzeMullion);
    topRunner.position.y = height / 2 - 0.04;
    group.add(topRunner);

    const glassGeo = new THREE.BoxGeometry(length - 0.04, height - 0.16, 0.015);
    const glass = new THREE.Mesh(glassGeo, this.materials.glass);
    group.add(glass);

    const numPanels = Math.max(2, Math.round(length / 2.0));
    const postGeo = new THREE.BoxGeometry(0.06, height, 0.08);
    for (let i = 0; i <= numPanels; i++) {
      const x = -length / 2 + (i * length) / numPanels;
      const post = new THREE.Mesh(postGeo, this.materials.bronzeMullion);
      post.position.x = x;
      group.add(post);
    }

    this.root.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(group));
  }

  _buildThermalAirlock() {
    const H = 3.8;
    const wallT = 0.15;

    // --- 1. Exterior Entrance Plaza, Canopy & Signage ---
    // Concrete plaza walkway slab outside double doors (Z: -9.0 to -13.5, X: 11.0 to 15.0)
    const plazaGeo = new THREE.BoxGeometry(4.0, 0.05, 4.5);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0x22262d, roughness: 0.85, metalness: 0.1 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.set(13.0, -0.025, -11.25);
    plaza.receiveShadow = true;
    this.root.add(plaza);

    // Architectural Bronze Entrance Canopy / Overhang (X: 11.2 to 14.8, Z: -9.0 to -10.4)
    const canopyGeo = new THREE.BoxGeometry(3.6, 0.12, 1.4);
    const canopy = new THREE.Mesh(canopyGeo, this.materials.bronzeMullion);
    canopy.position.set(13.0, 2.75, -9.7);
    canopy.castShadow = true;
    this.root.add(canopy);

    // Modern Brushed Exterior Signage Plate above Door
    const signBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.32, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.3, metalness: 0.8 })
    );
    signBox.position.set(13.0, 3.0, -9.12);
    this.root.add(signBox);

    const signCanvas = document.createElement("canvas");
    signCanvas.width = 512;
    signCanvas.height = 80;
    const sCtx = signCanvas.getContext("2d");
    sCtx.fillStyle = "#141820";
    sCtx.fillRect(0, 0, 512, 80);
    sCtx.fillStyle = "#00d4e8";
    sCtx.font = "bold 26px sans-serif";
    sCtx.textAlign = "center";
    sCtx.fillText("SRE DESIGNS · BIOMEDICAL RESEARCH", 256, 38);
    sCtx.fillStyle = "#fbbf24";
    sCtx.font = "600 18px monospace";
    sCtx.fillText("MAIN FACILITY AIRLOCK ENTRANCE", 256, 64);
    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.36, 0.30),
      new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide })
    );
    signMesh.position.set(13.0, 3.0, -9.14);
    signMesh.rotation.y = Math.PI;
    this.root.add(signMesh);

    // Flanking Exterior Architectural Bollards with warm ring light
    [-1.6, 1.6].forEach((xOff, idx) => {
      const bPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16),
        new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.3, metalness: 0.8 })
      );
      bPost.position.set(13.0 + xOff, 0.45, -11.5);
      this.root.add(bPost);

      const bRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.085, 0.05, 16),
        new THREE.MeshBasicMaterial({ color: 0x00d4e8 })
      );
      bRing.position.set(13.0 + xOff, 0.82, -11.5);
      this.root.add(bRing);
    });

    // --- 2. Exterior Double Door Assembly (Z = -9.0) ---
    this._buildDoubleDoorAssembly(13.0, 0, -9.0, "EXTERIOR_AIRLOCK");

    // --- 3. Interior Airlock Partition Wall (Z = -4.55) ---
    // Flanking Left Wall (X: 8.0 to 11.95, width 3.95, center 9.975)
    const intLeftWall = new THREE.Mesh(
      new THREE.BoxGeometry(3.95, H, wallT),
      this.materials.wallDrywall
    );
    intLeftWall.position.set(9.975, H / 2, -4.55);
    this.root.add(intLeftWall);
    this.colliders.push(new THREE.Box3().setFromObject(intLeftWall));

    // Flanking Right Wall (X: 14.05 to 16.0, width 1.95, center 15.025)
    const intRightWall = new THREE.Mesh(
      new THREE.BoxGeometry(1.95, H, wallT),
      this.materials.wallDrywall
    );
    intRightWall.position.set(15.025, H / 2, -4.55);
    this.root.add(intRightWall);
    this.colliders.push(new THREE.Box3().setFromObject(intRightWall));

    // Header Lintel above Interior Door (X: 13.0, Y: 3.125, Z: -4.55, width: 2.1, height: 1.35)
    const intHeader = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 1.35, wallT),
      this.materials.wallDrywall
    );
    intHeader.position.set(13.0, 3.125, -4.55);
    this.root.add(intHeader);
    this.colliders.push(new THREE.Box3().setFromObject(intHeader));

    // Interior Double Door Assembly (Z = -4.55)
    this._buildDoubleDoorAssembly(13.0, 0, -4.55, "INTERIOR_AIRLOCK");

    // --- 4. Airlock Vestibule Interior Elements (Z: -9.0 to -4.55, X: 8.0 to 16.0) ---
    // Sticky Blue Decontamination Floor Mat
    const matGeo = new THREE.PlaneGeometry(1.6, 2.2);
    const mat = new THREE.Mesh(
      matGeo,
      new THREE.MeshStandardMaterial({ color: 0x1870a0, roughness: 0.25, metalness: 0.1 })
    );
    mat.rotation.x = -Math.PI / 2;
    mat.position.set(13.0, 0.005, -6.75);
    this.root.add(mat);

    // Magnehelic Differential Pressure / Temperature Screen (flush on West wall at X = 8.12, Z = -6.75)
    const panelBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.36, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.3, metalness: 0.7 })
    );
    panelBox.position.set(8.10, 1.6, -6.75);
    this.root.add(panelBox);

    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 256;
    screenCanvas.height = 384;
    const ctx = screenCanvas.getContext("2d");
    ctx.fillStyle = "#0c121a";
    ctx.fillRect(0, 0, 256, 384);
    ctx.fillStyle = "#00d4e8";
    ctx.font = "bold 22px monospace";
    ctx.fillText("AIRLOCK STATUS", 20, 40);
    ctx.fillStyle = "#3dd68c";
    ctx.font = "bold 40px monospace";
    ctx.fillText("+0.03\"", 20, 105);
    ctx.font = "16px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("DIFF PRESSURE (w.g.)", 20, 135);
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 34px monospace";
    ctx.fillText("21.0 °C", 20, 200);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px monospace";
    ctx.fillText("AIRLOCK TEMPERATURE", 20, 230);
    ctx.fillStyle = "#3dd68c";
    ctx.font = "bold 20px monospace";
    ctx.fillText("PRESSURE SEAL: PASS", 20, 290);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "16px monospace";
    ctx.fillText("INTERLOCK: ACTIVE", 20, 335);

    const screenTex = new THREE.CanvasTexture(screenCanvas);
    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.36),
      new THREE.MeshBasicMaterial({ map: screenTex, side: THREE.DoubleSide })
    );
    screenMesh.position.set(8.125, 1.6, -6.75);
    screenMesh.rotation.y = Math.PI / 2;
    this.root.add(screenMesh);

    // Gowning Bench & Boot Change Boundary along East Wall (X = 15.2, Z = -6.75)
    const benchGroup = new THREE.Group();
    benchGroup.position.set(15.2, 0.22, -6.75);
    const benchTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.05, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x333b45, roughness: 0.3, metalness: 0.6 })
    );
    benchGroup.add(benchTop);

    [-1.0, 1.0].forEach(zLeg => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.44, 16),
        new THREE.MeshStandardMaterial({ color: 0xd8dde4, roughness: 0.2, metalness: 0.85 })
      );
      leg.position.set(0, -0.22, zLeg);
      benchGroup.add(leg);
    });
    this.root.add(benchGroup);
    this.colliders.push(new THREE.Box3().setFromObject(benchGroup));
  }

  _buildDoubleDoorAssembly(cx, cy, cz, id) {
    const group = new THREE.Group();
    group.position.set(cx, cy, cz);
    group.name = `Double_Door_${id}`;

    const doorH = 2.4;
    const jambMat = this.materials.bronzeMullion;
    const glassMat = this.materials.glass;
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xe0e6ed, roughness: 0.2, metalness: 0.9 });

    // 1. Hollow Perimeter Door Frame (Header + 2 Side Jambs + Threshold)
    // Header
    const header = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.12), jambMat);
    header.position.set(0, doorH + 0.04, 0);
    group.add(header);

    // Left Jamb
    const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.12), jambMat);
    leftJamb.position.set(-1.01, doorH / 2, 0);
    group.add(leftJamb);

    // Right Jamb
    const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.12), jambMat);
    rightJamb.position.set(1.01, doorH / 2, 0);
    group.add(rightJamb);

    // Threshold Saddle
    const threshold = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.015, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.8 })
    );
    threshold.position.set(0, 0.0075, 0);
    group.add(threshold);

    // 2. Left Door Leaf (X: -0.97 to -0.02, center -0.495)
    const leftDoorGroup = new THREE.Group();
    leftDoorGroup.position.set(-0.495, 0, 0);

    // Outer & Inner Stiles
    const stileGeo = new THREE.BoxGeometry(0.08, doorH - 0.01, 0.04);
    const lStileOut = new THREE.Mesh(stileGeo, jambMat);
    lStileOut.position.set(-0.435, (doorH - 0.01) / 2, 0);
    leftDoorGroup.add(lStileOut);

    const lStileIn = new THREE.Mesh(stileGeo, jambMat);
    lStileIn.position.set(0.435, (doorH - 0.01) / 2, 0);
    leftDoorGroup.add(lStileIn);

    // Top & Bottom Rails
    const lRailTop = new THREE.Mesh(new THREE.BoxGeometry(0.79, 0.08, 0.04), jambMat);
    lRailTop.position.set(0, doorH - 0.05, 0);
    leftDoorGroup.add(lRailTop);

    const lRailBottom = new THREE.Mesh(new THREE.BoxGeometry(0.79, 0.16, 0.04), jambMat);
    lRailBottom.position.set(0, 0.09, 0);
    leftDoorGroup.add(lRailBottom);

    // Vision Glass Panel
    const lGlass = new THREE.Mesh(new THREE.BoxGeometry(0.79, doorH - 0.25, 0.015), glassMat);
    lGlass.position.set(0, (doorH - 0.25) / 2 + 0.17, 0);
    leftDoorGroup.add(lGlass);

    // Tubular Handles (Front & Back)
    const handleGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.8, 16);
    [-0.035, 0.035].forEach(zOff => {
      const h = new THREE.Mesh(handleGeo, handleMat);
      h.position.set(0.38, 1.15, zOff);
      leftDoorGroup.add(h);
    });
    group.add(leftDoorGroup);

    // 3. Right Door Leaf (X: 0.02 to 0.97, center 0.495)
    const rightDoorGroup = new THREE.Group();
    rightDoorGroup.position.set(0.495, 0, 0);

    const rStileIn = new THREE.Mesh(stileGeo, jambMat);
    rStileIn.position.set(-0.435, (doorH - 0.01) / 2, 0);
    rightDoorGroup.add(rStileIn);

    const rStileOut = new THREE.Mesh(stileGeo, jambMat);
    rStileOut.position.set(0.435, (doorH - 0.01) / 2, 0);
    rightDoorGroup.add(rStileOut);

    const rRailTop = new THREE.Mesh(new THREE.BoxGeometry(0.79, 0.08, 0.04), jambMat);
    rRailTop.position.set(0, doorH - 0.05, 0);
    rightDoorGroup.add(rRailTop);

    const rRailBottom = new THREE.Mesh(new THREE.BoxGeometry(0.79, 0.16, 0.04), jambMat);
    rRailBottom.position.set(0, 0.09, 0);
    rightDoorGroup.add(rRailBottom);

    const rGlass = new THREE.Mesh(new THREE.BoxGeometry(0.79, doorH - 0.25, 0.015), glassMat);
    rGlass.position.set(0, (doorH - 0.25) / 2 + 0.17, 0);
    rightDoorGroup.add(rGlass);

    [-0.035, 0.035].forEach(zOff => {
      const h = new THREE.Mesh(handleGeo, handleMat);
      h.position.set(-0.38, 1.15, zOff);
      rightDoorGroup.add(h);
    });
    group.add(rightDoorGroup);

    // 4. RFID Card Reader Panel next to Right Jamb
    const cardReader = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.14, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3 })
    );
    cardReader.position.set(1.15, 1.2, 0.06);
    group.add(cardReader);

    const rfidLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.008, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x3dd68c })
    );
    rfidLed.position.set(1.15, 1.24, 0.076);
    group.add(rfidLed);

    this.root.add(group);
  }

  _buildStructuralPillars() {
    const pillarPositions = [
      [-10.0, 0.0],
      [-2.0, 0.0],
      [6.0, 0.0],
      [-6.0, 6.0]
    ];

    pillarPositions.forEach(([px, pz], i) => {
      const pillarGeo = new THREE.BoxGeometry(0.7, 3.8, 0.7);
      const pillar = new THREE.Mesh(pillarGeo, this.materials.charcoalConcrete);
      pillar.position.set(px, 1.9, pz);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      pillar.name = `Structural_Pillar_${i}`;
      this.root.add(pillar);

      this.colliders.push(new THREE.Box3().setFromObject(pillar));
    });
  }

  _buildCeilingAndLighting() {
    const H = 3.8;
    const W = 32.0;
    const D = 18.0;

    const ceilingGeo = new THREE.PlaneGeometry(W, D);
    const ceiling = new THREE.Mesh(ceilingGeo, this.materials.ceilingDark);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, H, 0);
    this.root.add(ceiling);

    // Warm Ambient Base
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.55);
    this.scene.add(ambientLight);

    // Primary High-Contrast Warm Key Light (3500K)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    keyLight.position.set(-8.0, 14.0, -12.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    // Cool Secondary Fill Light (6500K)
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.85);
    fillLight.position.set(12.0, 10.0, 10.0);
    this.scene.add(fillLight);

    // Exterior Entrance Plaza Canopy Downlight
    const extLight = new THREE.PointLight(0xfff5ea, 1.4, 10);
    extLight.position.set(13.0, 2.7, -9.8);
    this.scene.add(extLight);

    // Suspended Acoustic Ceiling Clouds & Linear LED Luminaires above Workbench Islands & Executive Suites
    const benchLinearLights = [
      { x: -10.0, z: -4.0, len: 6.8, sx: 7.2, sz: 2.2 },
      { x: -2.0, z: -4.0, len: 6.8, sx: 7.2, sz: 2.2 },
      { x: -10.0, z: 5.0, len: 6.0, sx: 6.4, sz: 2.2 },
      { x: -0.5, z: 5.0, len: 6.0, sx: 6.4, sz: 2.2 },
      // Executive Conference Room (Zone 10)
      { x: 12.0, z: 2.25, len: 4.2, sx: 4.8, sz: 2.0 },
      // User's Private Executive Office (Zone 9)
      { x: 12.0, z: 6.75, len: 3.2, sx: 3.8, sz: 2.0 },
      // Thermal Airlock Vestibule (Zone 8)
      { x: 13.0, z: -6.75, len: 2.8, sx: 3.2, sz: 1.8 },
      // ADA Restroom Suite (Zone 7)
      { x: 9.8, z: -2.25, len: 2.8, sx: 3.4, sz: 1.8 },
      // Entrance Corridor & Gallery
      { x: 13.8, z: -2.25, len: 3.2, sx: 3.6, sz: 1.8 }
    ];

    benchLinearLights.forEach((cfg, idx) => {
      // Suspended White Acoustic Cloud Baffle
      const cloud = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.sx, 0.05, cfg.sz),
        this.materials.acousticCloud
      );
      cloud.position.set(cfg.x, H - 0.35, cfg.z);
      this.root.add(cloud);

      // Matte Black Extruded Linear LED Luminaire
      const luminaire = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.len, 0.06, 0.14),
        new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.35, metalness: 0.6 })
      );
      luminaire.position.set(cfg.x, 3.1, cfg.z);
      this.root.add(luminaire);

      const diffuser = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.len - 0.05, 0.015, 0.12),
        this.materials.ledLightPanel
      );
      diffuser.position.set(cfg.x, 3.065, cfg.z);
      this.root.add(diffuser);

      // Task Downlight
      const point = new THREE.PointLight(0xfff8ed, 0.95, 9.0, 1.2);
      point.position.set(cfg.x, 2.95, cfg.z);
      this.root.add(point);
    });
  }

  _buildBiophilicWall() {
    // Biophilic Reindeer Moss Wall Feature mounted flush on East Corridor Spine Wall (X = 7.92, Z = -4.5)
    const mossWallGroup = new THREE.Group();
    mossWallGroup.position.set(7.92, 1.8, -4.5);
    mossWallGroup.rotation.y = -Math.PI / 2; // Face West into central corridor

    const frameGeo = new THREE.BoxGeometry(4.2, 2.2, 0.08);
    const frame = new THREE.Mesh(frameGeo, this.materials.bronzeMullion);
    mossWallGroup.add(frame);

    const mossGeo = new THREE.BoxGeometry(4.0, 2.0, 0.1);
    const moss = new THREE.Mesh(mossGeo, this.materials.mossGreen);
    moss.position.z = 0.03;
    mossWallGroup.add(moss);

    this.root.add(mossWallGroup);
  }

  // --- Exterior Campus, Parking Lot & Landscaping Architecture ---
  _buildExteriorCampusSite() {
    const siteGroup = new THREE.Group();
    siteGroup.name = "Exterior_Campus_Site_Root";

    // 1. Manicured Green Turf Lawn Ground Base (X: -36.0 to 36.0, Z: -9.0 to -36.0)
    const lawnGeo = new THREE.PlaneGeometry(72.0, 27.0);
    const lawn = new THREE.Mesh(lawnGeo, this.materials.grassTurf);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0, -0.05, -22.5);
    lawn.receiveShadow = true;
    siteGroup.add(lawn);

    // 2. Heavy-Duty Asphalt Parking Lot Slab (X: -24.0 to 24.0, Z: -13.5 to -31.5, size 48m x 18m)
    const asphaltGeo = new THREE.BoxGeometry(48.0, 0.04, 18.0);
    const asphalt = new THREE.Mesh(asphaltGeo, this.materials.asphalt);
    asphalt.position.set(0, -0.02, -22.5);
    asphalt.receiveShadow = true;
    siteGroup.add(asphalt);

    // 3. Precast Concrete Curbs Framing Parking Envelope
    // North Curb Left Segment (X: -24.0 to 11.2)
    const curbN1 = new THREE.Mesh(
      new THREE.BoxGeometry(35.2, 0.15, 0.16),
      this.materials.concreteCurb
    );
    curbN1.position.set(-6.4, 0.075, -13.5);
    siteGroup.add(curbN1);

    // North Curb Right Segment (X: 14.8 to 24.0)
    const curbN2 = new THREE.Mesh(
      new THREE.BoxGeometry(9.2, 0.15, 0.16),
      this.materials.concreteCurb
    );
    curbN2.position.set(19.4, 0.075, -13.5);
    siteGroup.add(curbN2);

    // South Curb (X: -24.0 to 24.0 at Z = -31.5)
    const curbS = new THREE.Mesh(
      new THREE.BoxGeometry(48.0, 0.15, 0.16),
      this.materials.concreteCurb
    );
    curbS.position.set(0, 0.075, -31.5);
    siteGroup.add(curbS);

    // West & East Curbs
    [-24.0, 24.0].forEach(cx => {
      const curbSide = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.15, 18.0),
        this.materials.concreteCurb
      );
      curbSide.position.set(cx, 0.075, -22.5);
      siteGroup.add(curbSide);
    });

    // 4. White Reflective Thermoplastic Parking Stalls & Concrete Wheel Stops
    // North Row Stalls (X: -21.0 to 5.4, Z: -19.0 to -13.8, depth 5.2m)
    const stallWidth = 2.8;
    const stallDepth = 5.2;
    for (let i = 0; i < 9; i++) {
      const sx = -20.0 + i * stallWidth;
      // White stall divider stripe
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.005, stallDepth),
        this.materials.parkingStripe
      );
      stripe.position.set(sx - stallWidth / 2, 0.003, -16.4);
      siteGroup.add(stripe);

      // Concrete Wheel Stop at head of stall
      const wheelStop = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.12, 0.15),
        this.materials.concreteCurb
      );
      wheelStop.position.set(sx, 0.06, -14.2);
      siteGroup.add(wheelStop);

      // Yellow hazard end caps on wheel stop
      [-0.85, 0.85].forEach(ex => {
        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(0.10, 0.125, 0.155),
          this.materials.adaYellow
        );
        cap.position.set(sx + ex, 0.06, -14.2);
        siteGroup.add(cap);
      });
    }

    // Right end stripe for last regular stall
    const regularEndStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.005, stallDepth),
      this.materials.parkingStripe
    );
    regularEndStripe.position.set(-20.0 + 8.5 * stallWidth, 0.003, -16.4);
    siteGroup.add(regularEndStripe);

    // 5. Dedicated ADA Accessible Van Parking Stall with Blue Box & Stencil (X = 6.6, Z: -16.4)
    const adaStallBox = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.006, stallDepth),
      this.materials.adaBlue
    );
    adaStallBox.position.set(6.6, 0.003, -16.4);
    siteGroup.add(adaStallBox);

    // Universal Wheelchair Pictogram Stencil Texture
    const adaCanvas = document.createElement("canvas");
    adaCanvas.width = 256;
    adaCanvas.height = 256;
    const adaCtx = adaCanvas.getContext("2d");
    adaCtx.fillStyle = "#0284c7";
    adaCtx.fillRect(0, 0, 256, 256);
    adaCtx.strokeStyle = "#ffffff";
    adaCtx.fillStyle = "#ffffff";
    adaCtx.lineWidth = 14;
    adaCtx.lineCap = "round";
    // Stylized Wheelchair icon
    adaCtx.beginPath();
    adaCtx.arc(128, 70, 20, 0, Math.PI * 2); // Head
    adaCtx.fill();
    adaCtx.beginPath();
    adaCtx.arc(120, 160, 48, 0, Math.PI * 1.5, true); // Wheel
    adaCtx.stroke();
    adaCtx.beginPath();
    adaCtx.moveTo(128, 96);
    adaCtx.lineTo(128, 150);
    adaCtx.lineTo(165, 150);
    adaCtx.lineTo(185, 195);
    adaCtx.stroke();
    adaCtx.beginPath();
    adaCtx.moveTo(128, 120);
    adaCtx.lineTo(160, 120);
    adaCtx.stroke();

    const adaTex = new THREE.CanvasTexture(adaCanvas);
    const adaStencil = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.6),
      new THREE.MeshBasicMaterial({ map: adaTex, transparent: true })
    );
    adaStencil.rotation.x = -Math.PI / 2;
    adaStencil.position.set(6.6, 0.008, -16.4);
    siteGroup.add(adaStencil);

    // Wheel stop for ADA stall
    const adaWheelStop = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.12, 0.15),
      this.materials.concreteCurb
    );
    adaWheelStop.position.set(6.6, 0.06, -14.2);
    siteGroup.add(adaWheelStop);

    // Cross-Hatched Yellow Loading Access Aisle (X: 8.4 to 10.4)
    const hatchCanvas = document.createElement("canvas");
    hatchCanvas.width = 256;
    hatchCanvas.height = 512;
    const hCtx = hatchCanvas.getContext("2d");
    hCtx.fillStyle = "#181c22";
    hCtx.fillRect(0, 0, 256, 512);
    hCtx.strokeStyle = "#facc15";
    hCtx.lineWidth = 10;
    for (let y = -256; y < 768; y += 48) {
      hCtx.beginPath();
      hCtx.moveTo(0, y);
      hCtx.lineTo(256, y + 256);
      hCtx.stroke();
    }
    const hatchTex = new THREE.CanvasTexture(hatchCanvas);
    const hatchAisle = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, stallDepth),
      new THREE.MeshBasicMaterial({ map: hatchTex })
    );
    hatchAisle.rotation.x = -Math.PI / 2;
    hatchAisle.position.set(9.4, 0.004, -16.4);
    siteGroup.add(hatchAisle);

    // 6. Commercial Dual-Port EV Fast Charging Pedestal at Head of Stalls (X = 4.4, Z = -13.8)
    const evPedestal = new THREE.Group();
    evPedestal.position.set(4.4, 0, -13.8);

    const evBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.10, 0.32),
      this.materials.concreteCurb
    );
    evBase.position.y = 0.05;
    evPedestal.add(evBase);

    const evBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 1.40, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.85 })
    );
    evBody.position.y = 0.75;
    evPedestal.add(evBody);

    // Dual Glowing Status Halos (Cyan Standby)
    [-0.08, 0.08].forEach(hx => {
      const halo = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16),
        new THREE.MeshBasicMaterial({ color: 0x00d4e8 })
      );
      halo.rotation.x = Math.PI / 2;
      halo.position.set(hx, 1.25, 0.115);
      evPedestal.add(halo);

      // Holstered J1772 / NACS charging handle
      const plug = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.12, 0.08),
        this.materials.cabinetBody
      );
      plug.position.set(hx, 0.95, 0.12);
      evPedestal.add(plug);
    });

    siteGroup.add(evPedestal);

    // 7. Broad Concrete Pedestrian Promenade Walkway (X = 13.0, Z: -13.5 to -9.0, width 3.6m)
    const walkGeo = new THREE.BoxGeometry(3.6, 0.05, 4.5);
    const walkway = new THREE.Mesh(walkGeo, this.materials.concreteCurb);
    walkway.position.set(13.0, 0.025, -11.25);
    walkway.receiveShadow = true;
    siteGroup.add(walkway);

    // Expansion joint divider lines along walkway
    for (let jz = -13.0; jz <= -9.5; jz += 1.2) {
      const joint = new THREE.Mesh(
        new THREE.BoxGeometry(3.58, 0.005, 0.015),
        this.materials.cabinetBody
      );
      joint.position.set(13.0, 0.052, jz);
      siteGroup.add(joint);
    }

    // 8. Landscape Mulch Beds Flanking Promenade & Building Front
    // West Mulch Bed (X: -18.0 to 8.5, Z: -13.4 to -9.1)
    const westMulch = new THREE.Mesh(
      new THREE.BoxGeometry(26.5, 0.06, 4.2),
      this.materials.mulchBed
    );
    westMulch.position.set(-4.75, 0.01, -11.25);
    westMulch.receiveShadow = true;
    siteGroup.add(westMulch);

    // East Mulch Bed (X: 17.5 to 24.0, Z: -13.4 to -9.1)
    const eastMulch = new THREE.Mesh(
      new THREE.BoxGeometry(6.5, 0.06, 4.2),
      this.materials.mulchBed
    );
    eastMulch.position.set(20.75, 0.01, -11.25);
    eastMulch.receiveShadow = true;
    siteGroup.add(eastMulch);

    // 9. Sculpted Evergreen Boxwood Globes (8 Shrub Spheres)
    const boxwoodCoords = [
      [-16.0, -11.5], [-12.0, -11.0], [-8.0, -11.5], [-4.0, -11.0],
      [0.0, -11.5], [4.0, -11.0], [18.5, -11.5], [22.0, -11.0]
    ];
    boxwoodCoords.forEach(([bx, bz]) => {
      const boxwood = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.38, 2),
        this.materials.boxwoodGreen
      );
      boxwood.position.set(bx, 0.40, bz);
      boxwood.castShadow = true;
      siteGroup.add(boxwood);
    });

    // 10. Clipped Formal Privet Foundation Hedges (4 Hedge Blocks)
    const hedgeCoords = [
      [-14.0, -9.6, 5.0], [-5.0, -9.6, 6.0], [3.0, -9.6, 5.0], [20.0, -9.6, 4.5]
    ];
    hedgeCoords.forEach(([hx, hz, hw]) => {
      const hedge = new THREE.Mesh(
        new THREE.BoxGeometry(hw, 0.85, 0.55),
        this.materials.boxwoodGreen
      );
      hedge.position.set(hx, 0.425, hz);
      hedge.castShadow = true;
      siteGroup.add(hedge);
    });

    // 11. Modern Monolithic Square Tree Planters with Architectural Birch Trees Flanking Entrance
    [10.2, 15.8].forEach((tx) => {
      const planter = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.65, 1.6),
        this.materials.concreteCurb
      );
      planter.position.set(tx, 0.325, -11.25);
      siteGroup.add(planter);

      const pSoil = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.05, 1.4),
        this.materials.mulchBed
      );
      pSoil.position.set(tx, 0.63, -11.25);
      siteGroup.add(pSoil);

      // Procedural Branching Birch Tree Trunk
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.09, 2.6, 12),
        this.materials.treeTrunk
      );
      trunk.position.set(tx, 1.9, -11.25);
      trunk.castShadow = true;
      siteGroup.add(trunk);

      // Layered Canopy Foliage Clusters
      [
        { y: 2.8, r: 0.65, zOff: 0.0 },
        { y: 3.3, r: 0.55, zOff: 0.15 },
        { y: 3.6, r: 0.45, zOff: -0.1 }
      ].forEach((layer) => {
        const leaves = new THREE.Mesh(
          new THREE.DodecahedronGeometry(layer.r, 2),
          this.materials.treeLeaves
        );
        leaves.position.set(tx + (layer.zOff * 0.8), layer.y, -11.25 + layer.zOff);
        leaves.castShadow = true;
        siteGroup.add(leaves);
      });
    });

    // 12. Commercial Parking Lot LED Cobra-Head Light Poles (6.5m Height)
    [-10.0, 14.0].forEach((lx) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.14, 6.5, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e242d, roughness: 0.3, metalness: 0.85 })
      );
      pole.position.set(lx, 3.25, -22.5);
      pole.castShadow = true;
      siteGroup.add(pole);

      // Dual forward-throw LED shoebox luminaires
      [-0.45, 0.45].forEach((az) => {
        const lum = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, 0.12, 0.80),
          this.materials.cabinetBody
        );
        lum.position.set(lx, 6.45, -22.5 + az);
        siteGroup.add(lum);

        const led = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 0.02, 0.70),
          this.materials.ledLightPanel
        );
        led.position.set(lx, 6.38, -22.5 + az);
        siteGroup.add(led);
      });

      // Exterior Area Light
      const siteLight = new THREE.PointLight(0xfffaed, 1.2, 18.0, 1.2);
      siteLight.position.set(lx, 6.3, -22.5);
      siteGroup.add(siteLight);
    });

    // 13. Modern Architectural Monument Campus Sign on Lawn (X = 6.0, Z = -11.2)
    const signGroup = new THREE.Group();
    signGroup.position.set(6.0, 0, -11.2);

    const signPlinth = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.25, 0.5),
      this.materials.charcoalConcrete
    );
    signPlinth.position.y = 0.125;
    signGroup.add(signPlinth);

    const signPlaque = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.85, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.25, metalness: 0.85 })
    );
    signPlaque.position.set(0, 0.675, 0);
    signGroup.add(signPlaque);

    const monCanvas = document.createElement("canvas");
    monCanvas.width = 512;
    monCanvas.height = 192;
    const mCtx = monCanvas.getContext("2d");
    mCtx.fillStyle = "#141820";
    mCtx.fillRect(0, 0, 512, 192);
    mCtx.strokeStyle = "#00d4e8";
    mCtx.lineWidth = 6;
    mCtx.strokeRect(8, 8, 496, 176);
    mCtx.fillStyle = "#00d4e8";
    mCtx.font = "bold 28px sans-serif";
    mCtx.textAlign = "center";
    mCtx.fillText("SRE DESIGNS BIOTECH", 256, 55);
    mCtx.fillStyle = "#f8fafc";
    mCtx.font = "bold 20px sans-serif";
    mCtx.fillText("PHARMACEUTICAL RESEARCH CAMPUS", 256, 95);
    mCtx.fillStyle = "#fbbf24";
    mCtx.font = "16px monospace";
    mCtx.fillText("BUILDING 4 · MAIN ANALYTICAL SUITE", 256, 140);

    const monTex = new THREE.CanvasTexture(monCanvas);
    const monMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.15, 0.80),
      new THREE.MeshBasicMaterial({ map: monTex })
    );
    monMesh.rotation.y = Math.PI; // Facing South toward parking
    monMesh.position.set(0, 0.675, -0.042);
    signGroup.add(monMesh);

    siteGroup.add(signGroup);

    this.root.add(siteGroup);
    this.colliders.push(new THREE.Box3().setFromObject(asphalt));
  }
}
