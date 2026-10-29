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

    // Multi-Species Living Bio-Wall Materials
    this.materials.mossDeepForest = new THREE.MeshStandardMaterial({
      color: 0x143d1a,
      roughness: 0.96,
      metalness: 0.01,
      name: "Mat_Living_Moss_Forest"
    });

    this.materials.mossChartreuse = new THREE.MeshStandardMaterial({
      color: 0x5a8a1e,
      roughness: 0.88,
      metalness: 0.01,
      name: "Mat_Living_Moss_Chartreuse"
    });

    this.materials.mossSage = new THREE.MeshStandardMaterial({
      color: 0x3d5c38,
      roughness: 0.92,
      metalness: 0.01,
      name: "Mat_Living_Moss_Sage"
    });

    this.materials.mossEmerald = new THREE.MeshStandardMaterial({
      color: 0x1e6b35,
      roughness: 0.90,
      metalness: 0.01,
      name: "Mat_Living_Moss_Emerald"
    });

    this.materials.fernLeaf = new THREE.MeshStandardMaterial({
      color: 0x247530,
      roughness: 0.42,
      metalness: 0.04,
      side: THREE.DoubleSide,
      name: "Mat_Fern_Frond"
    });

    this.materials.pothosVariegated = new THREE.MeshStandardMaterial({
      color: 0x2e7d32,
      roughness: 0.32,
      metalness: 0.05,
      side: THREE.DoubleSide,
      name: "Mat_Pothos_Variegated"
    });

    this.materials.corkBark = new THREE.MeshStandardMaterial({
      color: 0x2a2118,
      roughness: 0.98,
      metalness: 0.02,
      name: "Mat_Cork_Bark_Substrate"
    });

    this.materials.riverPebble = new THREE.MeshStandardMaterial({
      color: 0x1e2229,
      roughness: 0.28,
      metalness: 0.12,
      name: "Mat_Polished_River_Pebble"
    });

    this.materials.livingWallDrain = new THREE.MeshStandardMaterial({
      color: 0x2d323b,
      roughness: 0.35,
      metalness: 0.82,
      name: "Mat_Living_Wall_Trough"
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

    // Executive Suite, Locker Room & Wellness Materials
    this.materials.porcelainMarble = new THREE.MeshStandardMaterial({
      color: 0xf5f6f8,
      roughness: 0.18,
      metalness: 0.08,
      name: "Mat_Statuario_Porcelain_Marble"
    });

    this.materials.slateLockerTile = new THREE.MeshStandardMaterial({
      color: 0x1a1e24,
      roughness: 0.45,
      metalness: 0.12,
      name: "Mat_Slate_Locker_Tile"
    });

    this.materials.breakroomTile = new THREE.MeshStandardMaterial({
      color: 0x2e3440,
      roughness: 0.38,
      metalness: 0.10,
      name: "Mat_Terrazzo_Breakroom_Tile"
    });

    this.materials.woodOakPlank = new THREE.MeshStandardMaterial({
      color: 0x3d2b1f,
      roughness: 0.52,
      metalness: 0.04,
      name: "Mat_Smoked_Oak_Plank"
    });

    this.materials.showerFrostedGlass = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.65,
      roughness: 0.45,
      metalness: 0.05,
      ior: 1.48,
      name: "Mat_Frosted_Shower_Glass"
    });

    this.materials.matteBlackTrim = new THREE.MeshStandardMaterial({
      color: 0x121418,
      roughness: 0.35,
      metalness: 0.65,
      name: "Mat_Architectural_Matte_Black"
    });

    this.materials.goldBrassAccent = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.88,
      name: "Mat_Luxury_Brushed_Gold"
    });
  }

  _buildFloorsWithGrid() {
    const H = 3.8;
    const D = 19.0;

    // 1. Main Analytical & Chemical Lab Floor (Terrazzo) - West & Central areas (X: -16 to 8, Z: -9.5 to 9.5)
    const labFloorGeo = new THREE.PlaneGeometry(24.0, D);
    const labFloor = new THREE.Mesh(labFloorGeo, this.materials.terrazzo);
    labFloor.rotation.x = -Math.PI / 2;
    labFloor.position.set(-4.0, 0, 0);
    labFloor.receiveShadow = true;
    this.root.add(labFloor);

    // Architectural expansion divider grid strips every 3 meters in lab
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

    // 2. Grand Entrance Pavilion, Waiting Lounge & Reception Floor (Polished Graphite Porcelain & Terrazzo Inlay)
    // (X: 8.0 to 16.0, Z: -9.5 to 9.5, size 8m x 19m = 152 m^2)
    const entranceFloorGeo = new THREE.PlaneGeometry(8.0, D);
    const entranceFloor = new THREE.Mesh(entranceFloorGeo, this.materials.porcelainTile);
    entranceFloor.rotation.x = -Math.PI / 2;
    entranceFloor.position.set(12.0, 0.002, 0);
    entranceFloor.receiveShadow = true;
    this.root.add(entranceFloor);

    // Architectural Terrazzo Inlay Medallion in Waiting Lounge (X: 9.5 to 14.5, Z: 1.0 to 8.0)
    const loungeInlay = new THREE.Mesh(
      new THREE.PlaneGeometry(5.0, 7.0),
      this.materials.terrazzo
    );
    loungeInlay.rotation.x = -Math.PI / 2;
    loungeInlay.position.set(12.0, 0.0025, 4.5);
    loungeInlay.receiveShadow = true;
    this.root.add(loungeInlay);

    // 3. Central Circulation Spine Hallway Floor (Polished Terrazzo with Brass Expansion Strips)
    // (X: 16.0 to 38.0, Z: -1.5 to 1.5, length 22m, width 3.0m)
    const hallwayFloorGeo = new THREE.PlaneGeometry(22.0, 3.0);
    const hallwayFloor = new THREE.Mesh(hallwayFloorGeo, this.materials.terrazzo);
    hallwayFloor.rotation.x = -Math.PI / 2;
    hallwayFloor.position.set(27.0, 0.002, 0);
    hallwayFloor.receiveShadow = true;
    this.root.add(hallwayFloor);

    for (let hx = 16.0; hx <= 38.0; hx += 2.0) {
      const hStrip = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.003, 3.0), this.materials.gridStrip);
      hStrip.position.set(hx, 0.0025, 0);
      this.root.add(hStrip);
    }

    // 4. North Wing Rooms (Left side of Hallway, Z: 1.5 to 9.5, depth 8.0m)
    // 4A. Grand Executive Conference Room (Luxury Woven Slate Carpet with Acoustic Underlay)
    // (X: 16.0 to 27.0, Z: 1.5 to 9.5, size 11m x 8m = 88 m^2 - over double original size!)
    const confFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(11.0, 8.0),
      this.materials.carpet
    );
    confFloor.rotation.x = -Math.PI / 2;
    confFloor.position.set(21.5, 0.003, 5.5);
    confFloor.receiveShadow = true;
    this.root.add(confFloor);

    // 4B. Staff Break Room & Kitchenette (Modern Terrazzo Porcelain Tile)
    // (X: 27.0 to 33.5, Z: 1.5 to 9.5, size 6.5m x 8m = 52 m^2)
    const breakFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(6.5, 8.0),
      this.materials.breakroomTile
    );
    breakFloor.rotation.x = -Math.PI / 2;
    breakFloor.position.set(30.25, 0.003, 5.5);
    breakFloor.receiveShadow = true;
    this.root.add(breakFloor);

    // 4C. Executive Restroom Suite (Graphite Porcelain Tile with Floor Drains)
    // (X: 33.5 to 38.0, Z: 1.5 to 9.5, size 4.5m x 8m = 36 m^2)
    const restroomFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(4.5, 8.0),
      this.materials.porcelainTile
    );
    restroomFloor.rotation.x = -Math.PI / 2;
    restroomFloor.position.set(35.75, 0.003, 5.5);
    restroomFloor.receiveShadow = true;
    this.root.add(restroomFloor);

    // 5. South Wing Rooms (Right side of Hallway, Z: -9.5 to -1.5, depth 8.0m)
    // 5A. User's Private Executive Suite (Smoked Oak Herringbone Parquet)
    // (X: 16.0 to 21.5, Z: -9.5 to -1.5, size 5.5m x 8m = 44 m^2 - double original size!)
    const userOfficeFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(5.5, 8.0),
      this.materials.woodOakPlank
    );
    userOfficeFloor.rotation.x = -Math.PI / 2;
    userOfficeFloor.position.set(18.75, 0.003, -5.5);
    userOfficeFloor.receiveShadow = true;
    this.root.add(userOfficeFloor);

    // 5B. Faculty & Staff Offices Suite: Guest Office, Admin Office, Instructor's Office (Woven Charcoal Carpet)
    // (X: 21.5 to 32.0, Z: -9.5 to -1.5, size 10.5m x 8m = 84 m^2)
    const officesFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(10.5, 8.0),
      this.materials.carpet
    );
    officesFloor.rotation.x = -Math.PI / 2;
    officesFloor.position.set(26.75, 0.003, -5.5);
    officesFloor.receiveShadow = true;
    this.root.add(officesFloor);

    // 5C. Men's Large Locker Room, Changing Room & Showers (Charcoal Slate Tile)
    // (X: 32.0 to 38.0, Z: -9.5 to -1.5, size 6.0m x 8m = 48 m^2)
    const mensLockerFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(6.0, 8.0),
      this.materials.slateLockerTile
    );
    mensLockerFloor.rotation.x = -Math.PI / 2;
    mensLockerFloor.position.set(35.0, 0.003, -5.5);
    mensLockerFloor.receiveShadow = true;
    this.root.add(mensLockerFloor);

    // 6. Women's Locker Room, Changing Room & Luxury Showers (Straight ahead at end of Hallway)
    // (X: 38.0 to 44.0, Z: -8.0 to 8.0, size 6.0m x 16m = 96 m^2)
    const womensLockerFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(6.0, 16.0),
      this.materials.porcelainMarble
    );
    womensLockerFloor.rotation.x = -Math.PI / 2;
    womensLockerFloor.position.set(41.0, 0.003, 0);
    womensLockerFloor.receiveShadow = true;
    this.root.add(womensLockerFloor);
  }

  _buildPerimeterWalls() {
    const H = 3.8;
    const wallT = 0.2;

    const walls = [
      // 1. Main North Perimeter Wall (X: -16.0 to 38.0 at Z = +9.5, width 54.0m)
      { x: 11.0, y: H / 2, z: 9.5, sx: 54.0, sy: H, sz: wallT, mat: this.materials.wallDrywall },
      // North Jog at X = 38.0 (from Z = 9.5 to Z = 8.0, length 1.5m)
      { x: 38.0, y: H / 2, z: 8.75, sx: wallT, sy: H, sz: 1.5, mat: this.materials.wallDrywall },
      // Women's Locker Room North Wall (X: 38.0 to 44.0 at Z = +8.0, width 6.0m)
      { x: 41.0, y: H / 2, z: 8.0, sx: 6.0, sy: H, sz: wallT, mat: this.materials.wallDrywall },

      // 2. Far East Perimeter Wall - Women's Locker Room (at X = +44.0, Z: -8.0 to +8.0, width 16.0m)
      { x: 44.0, y: H / 2, z: 0.0, sx: wallT, sy: H, sz: 16.0, mat: this.materials.wallDrywall },

      // 3. Women's Locker Room South Wall (X: 38.0 to 44.0 at Z = -8.0, width 6.0m)
      { x: 41.0, y: H / 2, z: -8.0, sx: 6.0, sy: H, sz: wallT, mat: this.materials.wallDrywall },
      // South Jog at X = 38.0 (from Z = -8.0 to Z = -9.5, length 1.5m)
      { x: 38.0, y: H / 2, z: -8.75, sx: wallT, sy: H, sz: 1.5, mat: this.materials.wallDrywall },

      // 4. Main South Perimeter Wall
      // South Wall Left Segment (X: -16.0 to 11.95, width 27.95m, center = -2.025)
      { x: -2.025, y: H / 2, z: -9.5, sx: 27.95, sy: H, sz: wallT, mat: this.materials.wallDrywall },
      // South Wall Right Segment (X: 14.05 to 38.0, width 23.95m, center = 26.025)
      { x: 26.025, y: H / 2, z: -9.5, sx: 23.95, sy: H, sz: wallT, mat: this.materials.wallDrywall },
      // South Wall Entrance Header Lintel (X: 11.95 to 14.05, width 2.1m, height 1.35m, center Y = 3.125)
      { x: 13.0, y: 3.125, z: -9.5, sx: 2.1, sy: 1.35, sz: wallT, mat: this.materials.wallDrywall, isHeader: true },

      // 5. Far West Wall - Chemical Lab (at X = -16.0, Z: -9.5 to +9.5, width 19.0m)
      { x: -16.0, y: H / 2, z: 0.0, sx: wallT, sy: H, sz: 19.0, mat: this.materials.charcoalConcrete }
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

    // --- 1. Dividing Wall Between Lab and Grand Entrance Pavilion (X = 8.0) ---
    // North glass partition looking from Entrance into Analytical QC Lab (Z: 1.0 to 9.5, length 8.5m)
    this._buildGlassPartitionWall(8.0, 5.25, 8.5, H, "Z");

    // Solid drywall backing along South corner for Living Wall installation (Z: -9.5 to -7.1, width 2.4m)
    const southCornerSpine = new THREE.Mesh(
      new THREE.BoxGeometry(wallT, H, 2.4),
      this.materials.wallDrywall
    );
    southCornerSpine.position.set(8.0, H / 2, -8.3);
    this.root.add(southCornerSpine);
    this.colliders.push(new THREE.Box3().setFromObject(southCornerSpine));

    // Solid drywall spine wall backing living bio-wall (Z: -7.1 to -1.9, length 5.2m)
    const biowallSpine = new THREE.Mesh(
      new THREE.BoxGeometry(wallT, H, 5.2),
      this.materials.wallDrywall
    );
    biowallSpine.position.set(8.0, H / 2, -4.5);
    this.root.add(biowallSpine);
    this.colliders.push(new THREE.Box3().setFromObject(biowallSpine));

    // Glass Double-Door Entryway from Reception into Central Lab Aisle (Z: -1.9 to 1.0, center -0.45, width 2.9m)
    this._buildDoubleDoorAssembly(8.0, 0, -0.45, "LAB_RECEPTION_PORTAL", true);

    // --- 2. Dividing Wall Between Grand Entrance and Office/Conference Wing (X = 16.0) ---
    // North Wall: Separates Reception from Grand Conference Room (Z: 1.5 to 9.5, length 8.0m, center Z = 5.5)
    const confWestWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallT, H, 8.0),
      this.materials.wallDrywall
    );
    confWestWall.position.set(16.0, H / 2, 5.5);
    this.root.add(confWestWall);
    this.colliders.push(new THREE.Box3().setFromObject(confWestWall));

    // South Wall: Separates Reception from User's Executive Office (Z: -9.5 to -1.5, length 8.0m, center Z = -5.5)
    const officeWestWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallT, H, 8.0),
      this.materials.wallDrywall
    );
    officeWestWall.position.set(16.0, H / 2, -5.5);
    this.root.add(officeWestWall);
    this.colliders.push(new THREE.Box3().setFromObject(officeWestWall));

    // Architectural Bronze Portal Beam over Central Hallway Entry (X: 16.0, Z: -1.5 to 1.5, center Z = 0)
    const portalBeam = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.45, 3.2),
      this.materials.bronzeMullion
    );
    portalBeam.position.set(16.0, 3.55, 0);
    this.root.add(portalBeam);

    // Illuminated "EXECUTIVE & WELLNESS WING" Header Sign above Portal
    const wingSignCanvas = document.createElement("canvas");
    wingSignCanvas.width = 512;
    wingSignCanvas.height = 96;
    const wCtx = wingSignCanvas.getContext("2d");
    wCtx.fillStyle = "#12161f";
    wCtx.fillRect(0, 0, 512, 96);
    wCtx.fillStyle = "#00d4e8";
    wCtx.font = "bold 24px monospace";
    wCtx.textAlign = "center";
    wCtx.fillText("EXECUTIVE & WELLNESS WING", 256, 42);
    wCtx.fillStyle = "#94a3b8";
    wCtx.font = "16px sans-serif";
    wCtx.fillText("CONFERENCE · OFFICES · BREAK ROOM · LOCKERS", 256, 74);
    const wingSignTex = new THREE.CanvasTexture(wingSignCanvas);
    const wingSign = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 0.45),
      new THREE.MeshBasicMaterial({ map: wingSignTex, side: THREE.DoubleSide })
    );
    wingSign.position.set(15.82, 3.55, 0);
    wingSign.rotation.y = -Math.PI / 2;
    this.root.add(wingSign);

    // --- 3. Central Hallway North Wall (Z = 1.5, X: 16.0 to 38.0, length 22.0m) ---
    // A. Conference Room Wall Segments (X: 16.0 to 27.0): Door at X = 21.5 (width 2.2m)
    const confWallA = new THREE.Mesh(new THREE.BoxGeometry(4.4, H, wallT), this.materials.wallDrywall);
    confWallA.position.set(18.2, H / 2, 1.5);
    this.root.add(confWallA);
    this.colliders.push(new THREE.Box3().setFromObject(confWallA));

    const confDoorHeader = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, wallT), this.materials.wallDrywall);
    confDoorHeader.position.set(21.5, 3.1, 1.5);
    this.root.add(confDoorHeader);

    const confWallB = new THREE.Mesh(new THREE.BoxGeometry(4.4, H, wallT), this.materials.wallDrywall);
    confWallB.position.set(24.8, H / 2, 1.5);
    this.root.add(confWallB);
    this.colliders.push(new THREE.Box3().setFromObject(confWallB));

    // Double Frosted Glass Doors into Grand Conference Room at X = 21.5, Z = 1.5
    this._buildDoubleDoorAssembly(21.5, 0, 1.5, "CONF_HALLWAY_DOOR", false);

    // B. Break Room Wall Segments (X: 27.0 to 33.5): Door at X = 30.25 (width 1.5m)
    const breakWallA = new THREE.Mesh(new THREE.BoxGeometry(2.5, H, wallT), this.materials.wallDrywall);
    breakWallA.position.set(28.25, H / 2, 1.5);
    this.root.add(breakWallA);
    this.colliders.push(new THREE.Box3().setFromObject(breakWallA));

    const breakDoorHeader = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.4, wallT), this.materials.wallDrywall);
    breakDoorHeader.position.set(30.25, 3.1, 1.5);
    this.root.add(breakDoorHeader);

    const breakWallB = new THREE.Mesh(new THREE.BoxGeometry(2.5, H, wallT), this.materials.wallDrywall);
    breakWallB.position.set(32.25, H / 2, 1.5);
    this.root.add(breakWallB);
    this.colliders.push(new THREE.Box3().setFromObject(breakWallB));

    this._buildSingleDoorAssembly(30.25, 0, 1.5, "BREAKROOM_DOOR");

    // C. Executive Restroom Suite Wall Segments (X: 33.5 to 38.0): Door at X = 35.75 (width 1.2m)
    const rrWallA = new THREE.Mesh(new THREE.BoxGeometry(1.65, H, wallT), this.materials.wallDrywall);
    rrWallA.position.set(34.325, H / 2, 1.5);
    this.root.add(rrWallA);
    this.colliders.push(new THREE.Box3().setFromObject(rrWallA));

    const rrDoorHeader = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, wallT), this.materials.wallDrywall);
    rrDoorHeader.position.set(35.75, 3.1, 1.5);
    this.root.add(rrDoorHeader);

    const rrWallB = new THREE.Mesh(new THREE.BoxGeometry(1.65, H, wallT), this.materials.wallDrywall);
    rrWallB.position.set(37.175, H / 2, 1.5);
    this.root.add(rrWallB);
    this.colliders.push(new THREE.Box3().setFromObject(rrWallB));

    this._buildSingleDoorAssembly(35.75, 0, 1.5, "RESTROOM_HALLWAY_DOOR");

    // --- 4. Central Hallway South Wall (Z = -1.5, X: 16.0 to 38.0, length 22.0m) ---
    // A. User's Executive Office (X: 16.0 to 21.5): Door at X = 18.75 (width 1.5m)
    const userOffWallA = new THREE.Mesh(new THREE.BoxGeometry(2.0, H, wallT), this.materials.wallDrywall);
    userOffWallA.position.set(17.0, H / 2, -1.5);
    this.root.add(userOffWallA);
    this.colliders.push(new THREE.Box3().setFromObject(userOffWallA));

    const userOffHeader = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.4, wallT), this.materials.wallDrywall);
    userOffHeader.position.set(18.75, 3.1, -1.5);
    this.root.add(userOffHeader);

    const userOffWallB = new THREE.Mesh(new THREE.BoxGeometry(2.0, H, wallT), this.materials.wallDrywall);
    userOffWallB.position.set(20.5, H / 2, -1.5);
    this.root.add(userOffWallB);
    this.colliders.push(new THREE.Box3().setFromObject(userOffWallB));

    this._buildSingleDoorAssembly(18.75, 0, -1.5, "USER_OFFICE_DOOR");

    // B. Guest Office (X: 21.5 to 25.0): Door at X = 23.25 (width 1.2m)
    const guestWallA = new THREE.Mesh(new THREE.BoxGeometry(1.15, H, wallT), this.materials.wallDrywall);
    guestWallA.position.set(22.075, H / 2, -1.5);
    this.root.add(guestWallA);
    this.colliders.push(new THREE.Box3().setFromObject(guestWallA));

    const guestHeader = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, wallT), this.materials.wallDrywall);
    guestHeader.position.set(23.25, 3.1, -1.5);
    this.root.add(guestHeader);

    const guestWallB = new THREE.Mesh(new THREE.BoxGeometry(1.15, H, wallT), this.materials.wallDrywall);
    guestWallB.position.set(24.425, H / 2, -1.5);
    this.root.add(guestWallB);
    this.colliders.push(new THREE.Box3().setFromObject(guestWallB));

    this._buildSingleDoorAssembly(23.25, 0, -1.5, "GUEST_OFFICE_DOOR");

    // C. Admin Office (X: 25.0 to 28.5): Door at X = 26.75 (width 1.2m)
    const adminWallA = new THREE.Mesh(new THREE.BoxGeometry(1.15, H, wallT), this.materials.wallDrywall);
    adminWallA.position.set(25.575, H / 2, -1.5);
    this.root.add(adminWallA);
    this.colliders.push(new THREE.Box3().setFromObject(adminWallA));

    const adminHeader = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, wallT), this.materials.wallDrywall);
    adminHeader.position.set(26.75, 3.1, -1.5);
    this.root.add(adminHeader);

    const adminWallB = new THREE.Mesh(new THREE.BoxGeometry(1.15, H, wallT), this.materials.wallDrywall);
    adminWallB.position.set(27.925, H / 2, -1.5);
    this.root.add(adminWallB);
    this.colliders.push(new THREE.Box3().setFromObject(adminWallB));

    this._buildSingleDoorAssembly(26.75, 0, -1.5, "ADMIN_OFFICE_DOOR");

    // D. Instructor's Office (X: 28.5 to 32.0): Door at X = 30.25 (width 1.2m)
    const instWallA = new THREE.Mesh(new THREE.BoxGeometry(1.15, H, wallT), this.materials.wallDrywall);
    instWallA.position.set(29.075, H / 2, -1.5);
    this.root.add(instWallA);
    this.colliders.push(new THREE.Box3().setFromObject(instWallA));

    const instHeader = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, wallT), this.materials.wallDrywall);
    instHeader.position.set(30.25, 3.1, -1.5);
    this.root.add(instHeader);

    const instWallB = new THREE.Mesh(new THREE.BoxGeometry(1.15, H, wallT), this.materials.wallDrywall);
    instWallB.position.set(31.425, H / 2, -1.5);
    this.root.add(instWallB);
    this.colliders.push(new THREE.Box3().setFromObject(instWallB));

    this._buildSingleDoorAssembly(30.25, 0, -1.5, "INSTRUCTOR_OFFICE_DOOR");

    // E. Men's Locker Room (X: 32.0 to 38.0): Door at X = 35.0 (width 1.5m)
    const mensLockerWallA = new THREE.Mesh(new THREE.BoxGeometry(2.25, H, wallT), this.materials.wallDrywall);
    mensLockerWallA.position.set(33.125, H / 2, -1.5);
    this.root.add(mensLockerWallA);
    this.colliders.push(new THREE.Box3().setFromObject(mensLockerWallA));

    const mensLockerHeader = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.4, wallT), this.materials.wallDrywall);
    mensLockerHeader.position.set(35.0, 3.1, -1.5);
    this.root.add(mensLockerHeader);

    const mensLockerWallB = new THREE.Mesh(new THREE.BoxGeometry(2.25, H, wallT), this.materials.wallDrywall);
    mensLockerWallB.position.set(36.875, H / 2, -1.5);
    this.root.add(mensLockerWallB);
    this.colliders.push(new THREE.Box3().setFromObject(mensLockerWallB));

    this._buildSingleDoorAssembly(35.0, 0, -1.5, "MENS_LOCKER_DOOR");

    // --- 5. Transverse Room Dividing Walls ---
    // North Side dividing walls (Z: 1.5 to 9.5, length 8.0m, center Z = 5.5):
    // Wall between Conference Room and Break Room at X = 27.0
    const confBreakDividingWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, H, 8.0), this.materials.wallDrywall);
    confBreakDividingWall.position.set(27.0, H / 2, 5.5);
    this.root.add(confBreakDividingWall);
    this.colliders.push(new THREE.Box3().setFromObject(confBreakDividingWall));

    // Wall between Break Room and Restroom Suite at X = 33.5
    const breakRrDividingWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, H, 8.0), this.materials.wallDrywall);
    breakRrDividingWall.position.set(33.5, H / 2, 5.5);
    this.root.add(breakRrDividingWall);
    this.colliders.push(new THREE.Box3().setFromObject(breakRrDividingWall));

    // East End Wall of Restroom Suite at X = 38.0 (Z: 1.5 to 9.5)
    const rrEastWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, H, 8.0), this.materials.wallDrywall);
    rrEastWall.position.set(38.0, H / 2, 5.5);
    this.root.add(rrEastWall);
    this.colliders.push(new THREE.Box3().setFromObject(rrEastWall));

    // South Side dividing walls (Z: -9.5 to -1.5, length 8.0m, center Z = -5.5):
    // Wall between User's Office and Guest Office at X = 21.5
    const userGuestWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, H, 8.0), this.materials.wallDrywall);
    userGuestWall.position.set(21.5, H / 2, -5.5);
    this.root.add(userGuestWall);
    this.colliders.push(new THREE.Box3().setFromObject(userGuestWall));

    // Wall between Guest Office and Admin Office at X = 25.0
    const guestAdminWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, H, 8.0), this.materials.wallDrywall);
    guestAdminWall.position.set(25.0, H / 2, -5.5);
    this.root.add(guestAdminWall);
    this.colliders.push(new THREE.Box3().setFromObject(guestAdminWall));

    // Wall between Admin Office and Instructor's Office at X = 28.5
    const adminInstWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, H, 8.0), this.materials.wallDrywall);
    adminInstWall.position.set(28.5, H / 2, -5.5);
    this.root.add(adminInstWall);
    this.colliders.push(new THREE.Box3().setFromObject(adminInstWall));

    // Wall between Instructor's Office and Men's Locker Room at X = 32.0
    const instMensWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, H, 8.0), this.materials.wallDrywall);
    instMensWall.position.set(32.0, H / 2, -5.5);
    this.root.add(instMensWall);
    this.colliders.push(new THREE.Box3().setFromObject(instMensWall));

    // East End Wall of Men's Locker Room at X = 38.0 (Z: -9.5 to -1.5)
    const mensEastWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, H, 8.0), this.materials.wallDrywall);
    mensEastWall.position.set(38.0, H / 2, -5.5);
    this.root.add(mensEastWall);
    this.colliders.push(new THREE.Box3().setFromObject(mensEastWall));

    // --- 6. Far East Hallway Portal into Women's Locker Room (X = 38.0, Z: -1.5 to 1.5) ---
    const womensPortalHeader = new THREE.Mesh(new THREE.BoxGeometry(wallT, 1.4, 3.0), this.materials.wallDrywall);
    womensPortalHeader.position.set(38.0, 3.1, 0);
    this.root.add(womensPortalHeader);

    // Double Doors into Women's Locker Room
    this._buildDoubleDoorAssembly(38.0, 0, 0, "WOMENS_LOCKER_PORTAL", true);

    // Synthesis Bay Architectural Low Glass Partition with Bronze Cap Rail (X = -5.0, Z: 1.0 to 9.0)
    this._buildGlassPartitionWall(-5.0, 5.0, 8.0, 1.15, "Z");
  }

  _buildThermalAirlock() {
    const H = 3.8;
    const wallT = 0.15;

    // --- 1. Exterior Entrance Plaza, Canopy & Signage ---
    // Concrete plaza walkway slab outside double doors (Z: -9.5 to -14.0, X: 11.0 to 15.0)
    const plazaGeo = new THREE.BoxGeometry(4.0, 0.05, 4.5);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0x22262d, roughness: 0.85, metalness: 0.1 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.set(13.0, -0.025, -11.75);
    plaza.receiveShadow = true;
    this.root.add(plaza);

    // Architectural Bronze Entrance Canopy / Overhang (X: 11.2 to 14.8, Z: -9.5 to -10.9)
    const canopyGeo = new THREE.BoxGeometry(3.6, 0.12, 1.4);
    const canopy = new THREE.Mesh(canopyGeo, this.materials.bronzeMullion);
    canopy.position.set(13.0, 2.75, -10.2);
    canopy.castShadow = true;
    this.root.add(canopy);

    // Modern Brushed Exterior Signage Plate above Door
    const signBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.32, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.3, metalness: 0.8 })
    );
    signBox.position.set(13.0, 3.0, -9.62);
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
    sCtx.fillText("CHEMMATE BIOTECHNOLOGY", 256, 38);
    sCtx.fillStyle = "#fbbf24";
    sCtx.font = "600 18px monospace";
    sCtx.fillText("MAIN FACILITY RECEPTION ENTRANCE", 256, 64);
    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.36, 0.30),
      new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide })
    );
    signMesh.position.set(13.0, 3.0, -9.64);
    signMesh.rotation.y = Math.PI;
    this.root.add(signMesh);

    // Flanking Exterior Architectural Bollards with warm ring light
    [-1.6, 1.6].forEach((xOff, idx) => {
      const bPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16),
        new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.3, metalness: 0.8 })
      );
      bPost.position.set(13.0 + xOff, 0.45, -12.0);
      this.root.add(bPost);

      const bRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.085, 0.05, 16),
        new THREE.MeshBasicMaterial({ color: 0x00d4e8 })
      );
      bRing.position.set(13.0 + xOff, 0.82, -12.0);
      this.root.add(bRing);
    });

    // --- 2. Exterior Double Door Assembly (Z = -9.5) ---
    this._buildDoubleDoorAssembly(13.0, 0, -9.5, "EXTERIOR_AIRLOCK", false);

    // --- 3. Grand Entrance Vestibule Walk-Off Floor Mat ---
    const matGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const mat = new THREE.Mesh(
      matGeo,
      new THREE.MeshStandardMaterial({ color: 0x1870a0, roughness: 0.35, metalness: 0.1 })
    );
    mat.rotation.x = -Math.PI / 2;
    mat.position.set(13.0, 0.005, -7.8);
    this.root.add(mat);

    // Facility Environmental Monitoring Screen on Entry Column
    const panelBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.36, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.3, metalness: 0.7 })
    );
    panelBox.position.set(8.12, 1.6, -1.8);
    this.root.add(panelBox);

    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 256;
    screenCanvas.height = 384;
    const ctx = screenCanvas.getContext("2d");
    ctx.fillStyle = "#0c121a";
    ctx.fillRect(0, 0, 256, 384);
    ctx.fillStyle = "#00d4e8";
    ctx.font = "bold 22px monospace";
    ctx.fillText("FACILITY STATUS", 20, 40);
    ctx.fillStyle = "#3dd68c";
    ctx.font = "bold 40px monospace";
    ctx.fillText("OPTIMAL", 20, 105);
    ctx.font = "16px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("HVAC STATUS: 100%", 20, 135);
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 34px monospace";
    ctx.fillText("21.5 °C", 20, 200);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px monospace";
    ctx.fillText("FACILITY TEMPERATURE", 20, 230);
    ctx.fillStyle = "#3dd68c";
    ctx.font = "bold 20px monospace";
    ctx.fillText("AIR QUALITY: ISO 7", 20, 290);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "16px monospace";
    ctx.fillText("CAMPUS SECURE", 20, 335);

    const screenTex = new THREE.CanvasTexture(screenCanvas);
    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.36),
      new THREE.MeshBasicMaterial({ map: screenTex, side: THREE.DoubleSide })
    );
    screenMesh.position.set(8.145, 1.6, -1.8);
    screenMesh.rotation.y = Math.PI / 2;
    this.root.add(screenMesh);
  }

  _buildDoubleDoorAssembly(cx, cy, cz, id, rotateY = false) {
    const group = new THREE.Group();
    group.position.set(cx, cy, cz);
    if (rotateY) group.rotation.y = Math.PI / 2;
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

  _buildSingleDoorAssembly(cx, cy, cz, id, rotateY = false) {
    const group = new THREE.Group();
    group.position.set(cx, cy, cz);
    if (rotateY) group.rotation.y = Math.PI / 2;
    group.name = `Single_Door_${id}`;

    const doorW = 1.1;
    const doorH = 2.4;
    const jambMat = this.materials.bronzeMullion;
    const glassMat = this.materials.glass;
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xe0e6ed, roughness: 0.2, metalness: 0.9 });

    // Perimeter Frame
    const header = new THREE.Mesh(new THREE.BoxGeometry(doorW, 0.08, 0.12), jambMat);
    header.position.set(0, doorH + 0.04, 0);
    group.add(header);

    [-doorW / 2 + 0.04, doorW / 2 - 0.04].forEach(jx => {
      const jamb = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.12), jambMat);
      jamb.position.set(jx, doorH / 2, 0);
      group.add(jamb);
    });

    const threshold = new THREE.Mesh(
      new THREE.BoxGeometry(doorW, 0.015, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.8 })
    );
    threshold.position.set(0, 0.0075, 0);
    group.add(threshold);

    // Door Leaf
    const leafGroup = new THREE.Group();
    const leafW = doorW - 0.08;
    const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(leafW, doorH - 0.02, 0.04), jambMat);
    outerFrame.position.set(0, (doorH - 0.02) / 2 + 0.01, 0);
    leafGroup.add(outerFrame);

    // Vision Glass Panel
    const vision = new THREE.Mesh(new THREE.BoxGeometry(leafW - 0.22, doorH - 0.40, 0.015), glassMat);
    vision.position.set(0, (doorH - 0.40) / 2 + 0.20, 0);
    leafGroup.add(vision);

    // Handle
    const handleGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.5, 16);
    [-0.035, 0.035].forEach(zOff => {
      const h = new THREE.Mesh(handleGeo, handleMat);
      h.position.set(leafW / 2 - 0.12, 1.05, zOff);
      leafGroup.add(h);
    });

    group.add(leafGroup);
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
    const W = 62.0;
    const D = 20.0;

    const ceilingGeo = new THREE.PlaneGeometry(W, D);
    const ceiling = new THREE.Mesh(ceilingGeo, this.materials.ceilingDark);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(14.0, H, 0);
    this.root.add(ceiling);

    // Warm Ambient Base
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.65);
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
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.95);
    fillLight.position.set(24.0, 12.0, 12.0);
    this.scene.add(fillLight);

    // Exterior Entrance Plaza Canopy Downlight
    const extLight = new THREE.PointLight(0xfff5ea, 1.4, 10);
    extLight.position.set(13.0, 2.7, -10.5);
    this.scene.add(extLight);

    // Suspended Acoustic Ceiling Clouds & Linear LED Luminaires
    const benchLinearLights = [
      // 1. Analytical & Pharmaceutical QC Lab Islands
      { x: -10.0, z: -4.0, len: 6.8, sx: 7.2, sz: 2.2 },
      { x: -2.0, z: -4.0, len: 6.8, sx: 7.2, sz: 2.2 },
      { x: -10.0, z: 5.0, len: 6.0, sx: 6.4, sz: 2.2 },
      { x: -0.5, z: 5.0, len: 6.0, sx: 6.4, sz: 2.2 },

      // 2. Grand Entrance Pavilion, Reception & Waiting Gallery
      { x: 12.0, z: -3.2, len: 4.5, sx: 5.2, sz: 2.4 }, // Reception desk luminaire
      { x: 12.0, z: 4.5, len: 4.8, sx: 5.5, sz: 3.2 },  // Waiting lounge chandelier cloud

      // 3. Central Circulation Spine Hallway Continuous Run
      { x: 21.0, z: 0.0, len: 9.0, sx: 9.6, sz: 1.4 },
      { x: 31.0, z: 0.0, len: 9.0, sx: 9.6, sz: 1.4 },

      // 4. North Wing
      // 4A. Grand Conference Room (Zone 10) - Dual Linear Fixtures
      { x: 19.5, z: 5.5, len: 5.5, sx: 6.0, sz: 2.2 },
      { x: 24.5, z: 5.5, len: 5.5, sx: 6.0, sz: 2.2 },
      // 4B. Staff Break Room & Kitchenette
      { x: 30.25, z: 5.5, len: 4.8, sx: 5.4, sz: 2.6 },
      // 4C. Executive Restroom Suite
      { x: 35.75, z: 5.5, len: 3.6, sx: 4.0, sz: 2.2 },

      // 5. South Wing
      // 5A. User's Private Executive Suite (Zone 9)
      { x: 18.75, z: -5.5, len: 4.5, sx: 5.0, sz: 2.4 },
      // 5B. Faculty & Administration Offices
      { x: 23.25, z: -5.5, len: 2.8, sx: 3.2, sz: 1.8 }, // Guest Office
      { x: 26.75, z: -5.5, len: 2.8, sx: 3.2, sz: 1.8 }, // Admin Office
      { x: 30.25, z: -5.5, len: 2.8, sx: 3.2, sz: 1.8 }, // Instructor's Office
      // 5C. Men's Locker Room & Showers
      { x: 35.0, z: -5.5, len: 4.5, sx: 5.0, sz: 2.4 },

      // 6. Women's Locker Room, Changing Room & Luxury Showers
      { x: 41.0, z: -3.5, len: 4.5, sx: 5.2, sz: 2.4 },
      { x: 41.0, z: 3.5, len: 4.5, sx: 5.2, sz: 2.4 }
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
    // Architectural Living Bio-Wall Feature on East Corridor Spine Wall (X = 7.92, Z = -4.5, facing West)
    const wallGroup = new THREE.Group();
    wallGroup.name = "Architectural_Living_BioWall_Master";
    wallGroup.position.set(7.92, 0, -4.5);
    wallGroup.rotation.y = -Math.PI / 2; // Face West into central circulation spine

    const wallW = 5.2; // Width along Z
    const wallH = 3.2; // Height from floor to ceiling plenum
    const wallD = 0.28; // Depth protruding slightly from drywall plane

    // 1. Heavy Extruded Architectural Bronze Frame Enclosure with Shadow Reveal
    const frameMat = this.materials.bronzeMullion;
    const borderThick = 0.10;

    // Top Header Beam
    const topBeam = new THREE.Mesh(
      new THREE.BoxGeometry(wallW, borderThick, wallD),
      frameMat
    );
    topBeam.position.set(0, wallH - borderThick / 2, 0);
    wallGroup.add(topBeam);

    // Left and Right Vertical Jambs
    [-wallW / 2 + borderThick / 2, wallW / 2 - borderThick / 2].forEach((jx) => {
      const jamb = new THREE.Mesh(
        new THREE.BoxGeometry(borderThick, wallH - borderThick * 2, wallD),
        frameMat
      );
      jamb.position.set(jx, wallH / 2, 0);
      wallGroup.add(jamb);
    });

    // 2. Base Irrigation Catch-Basin Trough & Polished River Stone Bed
    const troughH = 0.22;
    const troughD = 0.32;
    const trough = new THREE.Mesh(
      new THREE.BoxGeometry(wallW - borderThick * 2, troughH, troughD),
      this.materials.livingWallDrain
    );
    trough.position.set(0, troughH / 2, troughD / 2 - wallD / 2);
    wallGroup.add(trough);

    // Stainless Steel Perimeter Overflow Grate
    const grate = new THREE.Mesh(
      new THREE.BoxGeometry(wallW - borderThick * 2 - 0.04, 0.015, troughD - 0.04),
      this.materials.cabinetHandle
    );
    grate.position.set(0, troughH + 0.008, troughD / 2 - wallD / 2);
    wallGroup.add(grate);

    // 3D Polished River Pebbles in Catch Basin (Basalt, River Slate, Tumbled Granite)
    const pebbleGeo = new THREE.SphereGeometry(0.038, 8, 6);
    for (let p = 0; p < 64; p++) {
      const px = -((wallW - borderThick * 2 - 0.16) / 2) + Math.random() * (wallW - borderThick * 2 - 0.16);
      const pz = -wallD / 2 + 0.05 + Math.random() * (troughD - 0.10);
      const peb = new THREE.Mesh(pebbleGeo, this.materials.riverPebble);
      peb.position.set(px, troughH + 0.025, pz);
      peb.scale.set(0.7 + Math.random() * 0.7, 0.45 + Math.random() * 0.3, 0.7 + Math.random() * 0.7);
      peb.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      wallGroup.add(peb);
    }

    // 3. Dark Hydroponic Felt Modular Cassette Backing & Continuous Velvet Moss Mattress
    const backPanH = wallH - borderThick - troughH;
    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(wallW - borderThick * 2, backPanH, 0.04),
      this.materials.corkBark
    );
    backing.position.set(0, troughH + backPanH / 2, -wallD / 2 + 0.03);
    wallGroup.add(backing);

    // Continuous Dense Forest Moss Base Mattress (Eliminating all background gaps)
    const mossMattress = new THREE.Mesh(
      new THREE.BoxGeometry(wallW - borderThick * 2, backPanH, 0.06),
      this.materials.mossDeepForest
    );
    mossMattress.position.set(0, troughH + backPanH / 2, -wallD / 2 + 0.05);
    wallGroup.add(mossMattress);

    // 4. Vertical Textured Cork Bark Columns (Creating natural micro-climate zones)
    [-1.8, -0.6, 0.6, 1.8].forEach((cx, idx) => {
      const barkW = 0.28 + (idx % 2) * 0.12;
      const barkGeo = new THREE.BoxGeometry(barkW, backPanH * 0.94, 0.07);
      const bark = new THREE.Mesh(barkGeo, this.materials.corkBark);
      bark.position.set(cx, troughH + backPanH / 2, -wallD / 2 + 0.07);
      wallGroup.add(bark);
    });

    // 5. Living Foliage Multi-Species Procedural Ecosystem
    const mossMats = [
      this.materials.mossDeepForest,
      this.materials.mossChartreuse,
      this.materials.mossEmerald,
      this.materials.mossSage
    ];

    // 5A. 160+ Pillow & Reindeer Moss Hummocks (Dense Interlocking Matrix)
    const baseSphereGeo = new THREE.SphereGeometry(1.0, 10, 8);
    for (let m = 0; m < 165; m++) {
      const mx = -((wallW - borderThick * 2 - 0.3) / 2) + Math.random() * (wallW - borderThick * 2 - 0.3);
      const my = troughH + 0.12 + Math.random() * (backPanH - 0.30);
      const radius = 0.10 + Math.random() * 0.18;
      const mat = mossMats[Math.floor(Math.random() * mossMats.length)];

      const dome = new THREE.Mesh(baseSphereGeo, mat);
      dome.scale.set(radius, radius * 0.92, radius * 0.42);
      dome.position.set(mx, my, -wallD / 2 + 0.06 + radius * 0.30);
      dome.rotation.set(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        Math.random() * Math.PI
      );
      wallGroup.add(dome);
    }

    // 5B. 20 Cascading Boston Fern Frond Clusters (Nephrolepis exaltata)
    const fernMat = this.materials.fernLeaf;
    for (let f = 0; f < 20; f++) {
      const fx = -((wallW - borderThick * 2 - 0.4) / 2) + Math.random() * (wallW - borderThick * 2 - 0.4);
      const fy = troughH + 0.6 + Math.random() * (backPanH - 0.8);
      const fernCluster = new THREE.Group();
      fernCluster.position.set(fx, fy, -wallD / 2 + 0.10);

      // 5-7 arching frond stems per cluster
      const numFronds = 5 + Math.floor(Math.random() * 3);
      for (let s = 0; s < numFronds; s++) {
        const frondGroup = new THREE.Group();
        const spreadAngle = ((s - numFronds / 2) / numFronds) * 1.4;
        frondGroup.rotation.y = spreadAngle;
        frondGroup.rotation.x = 0.2 + Math.random() * 0.4; // Arching forward into corridor

        // Central rachis stem
        const stemLen = 0.32 + Math.random() * 0.22;
        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.003, 0.005, stemLen, 6),
          fernMat
        );
        stem.position.set(0, -stemLen / 2, stemLen * 0.3);
        stem.rotation.x = -Math.PI / 4;
        frondGroup.add(stem);

        // Pairs of lateral fern pinnae (leaflets)
        const numPinnae = 7;
        for (let p = 0; p < numPinnae; p++) {
          const frac = p / numPinnae;
          const pLen = (1.0 - frac * 0.5) * 0.07;
          [-1, 1].forEach((side) => {
            const leaflet = new THREE.Mesh(
              new THREE.PlaneGeometry(pLen, 0.016),
              fernMat
            );
            leaflet.position.set(
              side * (pLen / 2 + 0.004),
              -frac * stemLen * 0.7,
              frac * stemLen * 0.3
            );
            leaflet.rotation.z = side * 0.25;
            frondGroup.add(leaflet);
          });
        }
        fernCluster.add(frondGroup);
      }
      wallGroup.add(fernCluster);
    }

    // 5C. 18 Trailing Philodendron & Variegated Pothos Clusters
    const pothosMat = this.materials.pothosVariegated;
    for (let v = 0; v < 18; v++) {
      const vx = -((wallW - borderThick * 2 - 0.4) / 2) + Math.random() * (wallW - borderThick * 2 - 0.4);
      const vy = troughH + 0.8 + Math.random() * (backPanH - 1.0);
      const vineGroup = new THREE.Group();
      vineGroup.position.set(vx, vy, -wallD / 2 + 0.12);

      // Trailing vine stem
      const vineLen = 0.35 + Math.random() * 0.35;
      const vineStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.004, vineLen, 6),
        pothosMat
      );
      vineStem.position.set(0, -vineLen / 2, 0.05);
      vineGroup.add(vineStem);

      // Broad heart-shaped leaves cascading downward
      const numLeaves = 6 + Math.floor(Math.random() * 4);
      for (let l = 0; l < numLeaves; l++) {
        const lf = new THREE.Group();
        const frac = l / numLeaves;
        lf.position.set(
          (Math.random() - 0.5) * 0.08,
          -frac * vineLen,
          0.06 + Math.random() * 0.04
        );
        lf.rotation.set(
          0.3 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.5
        );

        // Cordate (heart-shaped) leaf geometry
        const leafBlade = new THREE.Mesh(
          new THREE.ConeGeometry(0.045, 0.085, 4),
          pothosMat
        );
        leafBlade.rotation.x = Math.PI;
        leafBlade.scale.set(1.1, 1.0, 0.2); // Flat leaf profile
        lf.add(leafBlade);
        vineGroup.add(lf);
      }
      wallGroup.add(vineGroup);
    }

    // 5D. 12 Spiky Air-Plant (Tillandsia) Rosettes in Bark Crevices
    const airPlantMat = this.materials.mossSage;
    for (let a = 0; a < 14; a++) {
      const ax = -((wallW - borderThick * 2 - 0.5) / 2) + Math.random() * (wallW - borderThick * 2 - 0.5);
      const ay = troughH + 0.4 + Math.random() * (backPanH - 0.6);
      const rosette = new THREE.Group();
      rosette.position.set(ax, ay, -wallD / 2 + 0.11);

      for (let spike = 0; spike < 12; spike++) {
        const theta = (spike / 12) * Math.PI * 2;
        const spikeLeaf = new THREE.Mesh(
          new THREE.ConeGeometry(0.008, 0.075, 4),
          airPlantMat
        );
        spikeLeaf.rotation.z = Math.PI / 2 + Math.cos(theta) * 0.4;
        spikeLeaf.rotation.y = theta;
        spikeLeaf.scale.set(1.0, 1.0, 0.25);
        rosette.add(spikeLeaf);
      }
      wallGroup.add(rosette);
    }

    // 6. Overhead Architectural Grow-Lighting Track with Articulated Canisters
    const trackY = wallH + 0.06;
    const trackRail = new THREE.Mesh(
      new THREE.BoxGeometry(wallW, 0.03, 0.04),
      this.materials.bronzeMullion
    );
    trackRail.position.set(0, trackY, 0.22);
    wallGroup.add(trackRail);

    // 5 Articulated High-CRI LED Spotlight Canisters
    [-1.8, -0.9, 0, 0.9, 1.8].forEach((lx) => {
      const spotArm = new THREE.Group();
      spotArm.position.set(lx, trackY - 0.02, 0.22);

      // Swivel Knuckle & Cylinder Canister
      const knuckle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.03, 8),
        this.materials.cabinetHandle
      );
      spotArm.add(knuckle);

      const canister = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.042, 0.09, 16),
        this.materials.bronzeMullion
      );
      canister.rotation.x = -Math.PI / 3; // Angled down 60° at living wall foliage
      canister.position.set(0, -0.05, -0.04);
      spotArm.add(canister);

      // Emissive high-CRI LED Lens
      const lens = new THREE.Mesh(
        new THREE.CircleGeometry(0.033, 16),
        new THREE.MeshBasicMaterial({ color: 0xfff6ea })
      );
      lens.rotation.x = Math.PI / 6;
      lens.position.set(0, -0.08, -0.06);
      spotArm.add(lens);

      wallGroup.add(spotArm);
    });

    // 7. Floating Architectural Brand Plaque on Upper Bronze Canopy
    const plaqueGroup = new THREE.Group();
    plaqueGroup.position.set(0, wallH - borderThick / 2 - 0.14, 0.16);

    const plaqueBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.28, 0.015),
      this.materials.cabinetHandle
    );
    plaqueGroup.add(plaqueBase);

    // High-DPI Canvas for Plaque Inscription
    const plCanvas = document.createElement("canvas");
    plCanvas.width = 1024;
    plCanvas.height = 140;
    const plCtx = plCanvas.getContext("2d");
    plCtx.fillStyle = "#0c1017";
    plCtx.fillRect(0, 0, 1024, 140);
    plCtx.strokeStyle = "#d4af37";
    plCtx.lineWidth = 4;
    plCtx.strokeRect(8, 8, 1008, 124);
    plCtx.fillStyle = "#f1f5f9";
    plCtx.font = "bold 26px 'IBM Plex Sans', sans-serif";
    plCtx.textAlign = "center";
    plCtx.fillText("SRE DESIGNS BIOTECH · LIVING HORTICULTURAL WALL", 512, 54);
    plCtx.font = "18px 'IBM Plex Mono', monospace";
    plCtx.fillStyle = "#3dd68c";
    plCtx.fillText("CONTINUOUS AIR PURIFICATION · AUTOMATED HYDROPONIC DRIP", 512, 98);

    const plTex = new THREE.CanvasTexture(plCanvas);
    const plScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.36, 0.26),
      new THREE.MeshBasicMaterial({ map: plTex })
    );
    plScreen.position.set(0, 0, 0.009);
    plaqueGroup.add(plScreen);

    // Chrome Mounting Standoff Cylinders
    [-1.12, 1.12].forEach((sx) => {
      [-0.10, 0.10].forEach((sy) => {
        const standoff = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.05, 12),
          this.materials.cabinetHandle
        );
        standoff.rotation.x = Math.PI / 2;
        standoff.position.set(sx, sy, -0.025);
        plaqueGroup.add(standoff);
      });
    });
    wallGroup.add(plaqueGroup);

    // 8. Drip Irrigation Riser & Brass Manifold with Analog Dial Gauge
    const irriGroup = new THREE.Group();
    irriGroup.position.set(wallW / 2 - borderThick - 0.12, troughH / 2 + 0.15, -wallD / 2 + 0.10);

    const riser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.45, 12),
      this.materials.cabinetHandle
    );
    irriGroup.add(riser);

    // Brass Ball Valve
    const valve = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.035, 0.045),
      new THREE.MeshStandardMaterial({ color: 0xb48a3c, roughness: 0.3, metalness: 0.8 })
    );
    valve.position.y = 0.12;
    irriGroup.add(valve);

    // Analog Pressure Gauge
    const gauge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.02, 16),
      this.materials.cabinetHandle
    );
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(0, 0.22, 0.025);
    irriGroup.add(gauge);

    const gaugeFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.025, 16),
      new THREE.MeshBasicMaterial({ color: 0xf8fafc })
    );
    gaugeFace.position.set(0, 0.22, 0.036);
    irriGroup.add(gaugeFace);

    wallGroup.add(irriGroup);

    this.root.add(wallGroup);
  }

  // --- Exterior Campus, Parking Lot & Landscaping Architecture ---
  _buildExteriorCampusSite() {
    const siteGroup = new THREE.Group();
    siteGroup.name = "Exterior_Campus_Site_Root";

    // 1. Manicured Green Turf Lawn Ground Base (X: -36.0 to 64.0, Z: -9.5 to -40.0)
    const lawnGeo = new THREE.PlaneGeometry(100.0, 32.0);
    const lawn = new THREE.Mesh(lawnGeo, this.materials.grassTurf);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(14.0, -0.05, -25.0);
    lawn.receiveShadow = true;
    siteGroup.add(lawn);

    // 2. Heavy-Duty Asphalt Parking Lot Slab (X: -24.0 to 52.0, Z: -14.0 to -34.0, size 76m x 20m)
    const asphaltGeo = new THREE.BoxGeometry(76.0, 0.04, 20.0);
    const asphalt = new THREE.Mesh(asphaltGeo, this.materials.asphalt);
    asphalt.position.set(14.0, -0.02, -24.0);
    asphalt.receiveShadow = true;
    siteGroup.add(asphalt);

    // 3. Precast Concrete Curbs Framing Parking Envelope
    // North Curb Left Segment (X: -24.0 to 11.2)
    const curbN1 = new THREE.Mesh(
      new THREE.BoxGeometry(35.2, 0.15, 0.16),
      this.materials.concreteCurb
    );
    curbN1.position.set(-6.4, 0.075, -14.0);
    siteGroup.add(curbN1);

    // North Curb Right Segment (X: 14.8 to 52.0, length 37.2m)
    const curbN2 = new THREE.Mesh(
      new THREE.BoxGeometry(37.2, 0.15, 0.16),
      this.materials.concreteCurb
    );
    curbN2.position.set(33.4, 0.075, -14.0);
    siteGroup.add(curbN2);

    // South Curb (X: -24.0 to 52.0 at Z = -34.0, length 76.0m)
    const curbS = new THREE.Mesh(
      new THREE.BoxGeometry(76.0, 0.15, 0.16),
      this.materials.concreteCurb
    );
    curbS.position.set(14.0, 0.075, -34.0);
    siteGroup.add(curbS);

    // West & East Perimeter Curbs
    [-24.0, 52.0].forEach(cx => {
      const curbSide = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.15, 20.0),
        this.materials.concreteCurb
      );
      curbSide.position.set(cx, 0.075, -24.0);
      siteGroup.add(curbSide);
    });

    // 4. White Reflective Thermoplastic Parking Stalls & Concrete Wheel Stops
    const stallWidth = 2.8;
    const stallDepth = 5.2;
    // West Row (X: -20.0 to 5.2)
    for (let i = 0; i < 9; i++) {
      const sx = -20.0 + i * stallWidth;
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.005, stallDepth),
        this.materials.parkingStripe
      );
      stripe.position.set(sx - stallWidth / 2, 0.003, -16.8);
      siteGroup.add(stripe);

      const wheelStop = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.12, 0.15),
        this.materials.concreteCurb
      );
      wheelStop.position.set(sx, 0.06, -14.6);
      siteGroup.add(wheelStop);

      [-0.85, 0.85].forEach(ex => {
        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(0.10, 0.125, 0.155),
          this.materials.adaYellow
        );
        cap.position.set(sx + ex, 0.06, -14.6);
        siteGroup.add(cap);
      });
    }

    // East Row Stalls (X: 18.0 to 48.0)
    for (let i = 0; i < 11; i++) {
      const sx = 18.0 + i * stallWidth;
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.005, stallDepth),
        this.materials.parkingStripe
      );
      stripe.position.set(sx - stallWidth / 2, 0.003, -16.8);
      siteGroup.add(stripe);

      const wheelStop = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.12, 0.15),
        this.materials.concreteCurb
      );
      wheelStop.position.set(sx, 0.06, -14.6);
      siteGroup.add(wheelStop);

      [-0.85, 0.85].forEach(ex => {
        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(0.10, 0.125, 0.155),
          this.materials.adaYellow
        );
        cap.position.set(sx + ex, 0.06, -14.6);
        siteGroup.add(cap);
      });
    }

    // 5. Dedicated ADA Accessible Van Parking Stall with Blue Box & Stencil (X = 6.6, Z: -16.8)
    const adaStallBox = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.006, stallDepth),
      this.materials.adaBlue
    );
    adaStallBox.position.set(6.6, 0.003, -16.8);
    siteGroup.add(adaStallBox);

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
    adaCtx.beginPath();
    adaCtx.arc(128, 70, 20, 0, Math.PI * 2);
    adaCtx.fill();
    adaCtx.beginPath();
    adaCtx.arc(120, 160, 48, 0, Math.PI * 1.5, true);
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
    adaStencil.position.set(6.6, 0.008, -16.8);
    siteGroup.add(adaStencil);

    const adaWheelStop = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.12, 0.15),
      this.materials.concreteCurb
    );
    adaWheelStop.position.set(6.6, 0.06, -14.6);
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
    hatchAisle.position.set(9.4, 0.004, -16.8);
    siteGroup.add(hatchAisle);

    // 6. Commercial Dual-Port EV Fast Charging Pedestals
    [4.4, 32.0].forEach(evX => {
      const evPedestal = new THREE.Group();
      evPedestal.position.set(evX, 0, -14.2);

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

      [-0.08, 0.08].forEach(hx => {
        const halo = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16),
          new THREE.MeshBasicMaterial({ color: 0x00d4e8 })
        );
        halo.rotation.x = Math.PI / 2;
        halo.position.set(hx, 1.25, 0.115);
        evPedestal.add(halo);

        const plug = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.12, 0.08),
          this.materials.cabinetBody
        );
        plug.position.set(hx, 0.95, 0.12);
        evPedestal.add(plug);
      });

      siteGroup.add(evPedestal);
    });

    // 7. Broad Concrete Pedestrian Promenade Walkway (X = 13.0, Z: -14.0 to -9.5, width 3.6m)
    const walkGeo = new THREE.BoxGeometry(3.6, 0.05, 4.5);
    const walkway = new THREE.Mesh(walkGeo, this.materials.concreteCurb);
    walkway.position.set(13.0, 0.025, -11.75);
    walkway.receiveShadow = true;
    siteGroup.add(walkway);

    for (let jz = -13.5; jz <= -10.0; jz += 1.2) {
      const joint = new THREE.Mesh(
        new THREE.BoxGeometry(3.58, 0.005, 0.015),
        this.materials.cabinetBody
      );
      joint.position.set(13.0, 0.052, jz);
      siteGroup.add(joint);
    }

    // 8. Landscape Mulch Beds Flanking Promenade & Building Front
    // West Mulch Bed (X: -18.0 to 8.5, Z: -13.9 to -9.6)
    const westMulch = new THREE.Mesh(
      new THREE.BoxGeometry(26.5, 0.06, 4.2),
      this.materials.mulchBed
    );
    westMulch.position.set(-4.75, 0.01, -11.75);
    westMulch.receiveShadow = true;
    siteGroup.add(westMulch);

    // East Mulch Bed (X: 17.5 to 44.0, Z: -13.9 to -9.6, length 26.5m)
    const eastMulch = new THREE.Mesh(
      new THREE.BoxGeometry(26.5, 0.06, 4.2),
      this.materials.mulchBed
    );
    eastMulch.position.set(30.75, 0.01, -11.75);
    eastMulch.receiveShadow = true;
    siteGroup.add(eastMulch);

    // 9. Sculpted Evergreen Boxwood Globes (14 Shrub Spheres)
    const boxwoodCoords = [
      [-16.0, -11.5], [-12.0, -11.0], [-8.0, -11.5], [-4.0, -11.0],
      [0.0, -11.5], [4.0, -11.0], [18.5, -11.5], [22.0, -11.0],
      [26.0, -11.5], [30.0, -11.0], [34.0, -11.5], [38.0, -11.0], [42.0, -11.5]
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

    // 10. Clipped Formal Privet Foundation Hedges
    const hedgeCoords = [
      [-14.0, -9.8, 5.0], [-5.0, -9.8, 6.0], [3.0, -9.8, 5.0],
      [20.0, -9.8, 4.5], [28.0, -9.8, 5.5], [36.0, -9.8, 5.5]
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

    // 11. Modern Monolithic Square Tree Planters with Birch Trees
    [10.2, 15.8, 24.0, 36.0].forEach((tx) => {
      const planter = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.65, 1.6),
        this.materials.concreteCurb
      );
      planter.position.set(tx, 0.325, -11.75);
      siteGroup.add(planter);

      const pSoil = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.05, 1.4),
        this.materials.mulchBed
      );
      pSoil.position.set(tx, 0.63, -11.75);
      siteGroup.add(pSoil);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.09, 2.6, 12),
        this.materials.treeTrunk
      );
      trunk.position.set(tx, 1.9, -11.75);
      trunk.castShadow = true;
      siteGroup.add(trunk);

      [
        { y: 2.8, r: 0.65, zOff: 0.0 },
        { y: 3.3, r: 0.55, zOff: 0.15 },
        { y: 3.6, r: 0.45, zOff: -0.1 }
      ].forEach((layer) => {
        const leaves = new THREE.Mesh(
          new THREE.DodecahedronGeometry(layer.r, 2),
          this.materials.treeLeaves
        );
        leaves.position.set(tx + (layer.zOff * 0.8), layer.y, -11.75 + layer.zOff);
        leaves.castShadow = true;
        siteGroup.add(leaves);
      });
    });

    // 12. Commercial Parking Lot LED Cobra-Head Light Poles (6.5m Height)
    [-10.0, 14.0, 38.0].forEach((lx) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.14, 6.5, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e242d, roughness: 0.3, metalness: 0.85 })
      );
      pole.position.set(lx, 3.25, -24.0);
      pole.castShadow = true;
      siteGroup.add(pole);

      [-0.45, 0.45].forEach((az) => {
        const lum = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, 0.12, 0.80),
          this.materials.cabinetBody
        );
        lum.position.set(lx, 6.45, -24.0 + az);
        siteGroup.add(lum);

        const led = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 0.02, 0.70),
          this.materials.ledLightPanel
        );
        led.position.set(lx, 6.38, -24.0 + az);
        siteGroup.add(led);
      });

      const siteLight = new THREE.PointLight(0xfffaed, 1.2, 22.0, 1.2);
      siteLight.position.set(lx, 6.3, -24.0);
      siteGroup.add(siteLight);
    });

    // 13. Modern Architectural Monument Campus Sign on Lawn (X = 6.0, Z = -11.7)
    const signGroup = new THREE.Group();
    signGroup.position.set(6.0, 0, -11.7);

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
    mCtx.fillText("CHEMMATE BIOTECH", 256, 55);
    mCtx.fillStyle = "#f8fafc";
    mCtx.font = "bold 20px sans-serif";
    mCtx.fillText("PHARMACEUTICAL RESEARCH CAMPUS", 256, 95);
    mCtx.fillStyle = "#fbbf24";
    mCtx.font = "16px monospace";
    mCtx.fillText("MAIN FACILITY & RESEARCH PAVILIONS", 256, 140);

    const monTex = new THREE.CanvasTexture(monCanvas);
    const monMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.15, 0.80),
      new THREE.MeshBasicMaterial({ map: monTex })
    );
    monMesh.rotation.y = Math.PI;
    monMesh.position.set(0, 0.675, -0.042);
    signGroup.add(monMesh);

    siteGroup.add(signGroup);

    this.root.add(siteGroup);
    this.colliders.push(new THREE.Box3().setFromObject(asphalt));
  }
}
