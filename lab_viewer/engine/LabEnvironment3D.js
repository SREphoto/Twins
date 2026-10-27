/**
 * LabEnvironment3D.js — Modern Architectural Facility Shell
 * 
 * Features:
 * - 32.0m x 18.0m world-class biotech research architecture
 * - Vertical acoustic American walnut / white oak slats
 * - Board-formed charcoal concrete pillars with recessed electrical panels
 * - Frameless floor-to-ceiling glass partitions with dark bronze anodized mullions
 * - Light silver-grey quartz epoxy terrazzo (labs) vs. woven slate carpet (offices)
 * - Biophilic preserved Nordic moss accent wall in entrance corridor
 * - Thermal Air-Lock Vestibule with exterior & interior double doors
 * - Concealed warm perimeter cove lighting (3500K) + suspended linear LED luminaires
 */
import * as THREE from "three";

export class LabEnvironment3D {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = "Modern_Lab_Facility_Root";
    this.colliders = []; // AABB bounding boxes for player walk collision
    this.lights = [];
    this.materials = {};
    this.interactiveObjects = [];

    this._initMaterials();
    this._buildFloor();
    this._buildPerimeterWalls();
    this._buildInteriorPartitions();
    this._buildThermalAirlock();
    this._buildStructuralPillars();
    this._buildCeilingAndLighting();
    this._buildBiophilicWall();

    this.scene.add(this.root);
  }

  _initMaterials() {
    this.materials.terrazzo = new THREE.MeshStandardMaterial({
      color: 0xc4ccd4,
      roughness: 0.28,
      metalness: 0.08,
      name: "Mat_Terrazzo_Floor"
    });

    this.materials.carpet = new THREE.MeshStandardMaterial({
      color: 0x181e28,
      roughness: 0.88,
      metalness: 0.02,
      name: "Mat_Woven_Carpet"
    });

    this.materials.porcelainTile = new THREE.MeshStandardMaterial({
      color: 0x22262e,
      roughness: 0.38,
      metalness: 0.12,
      name: "Mat_Graphite_Porcelain"
    });

    this.materials.wallDrywall = new THREE.MeshStandardMaterial({
      color: 0xe2e6eb,
      roughness: 0.85,
      metalness: 0.02,
      name: "Mat_Modern_Drywall"
    });

    this.materials.charcoalConcrete = new THREE.MeshStandardMaterial({
      color: 0x2c313a,
      roughness: 0.72,
      metalness: 0.15,
      name: "Mat_Charcoal_Concrete"
    });

    this.materials.woodSlat = new THREE.MeshStandardMaterial({
      color: 0x7a5230,
      roughness: 0.55,
      metalness: 0.05,
      name: "Mat_Walnut_Wood"
    });

    this.materials.woodSlatBacking = new THREE.MeshStandardMaterial({
      color: 0x111316,
      roughness: 0.95,
      metalness: 0.0,
      name: "Mat_Acoustic_Felt"
    });

    this.materials.bronzeMullion = new THREE.MeshStandardMaterial({
      color: 0x23201d,
      roughness: 0.32,
      metalness: 0.82,
      name: "Mat_Dark_Bronze"
    });

    this.materials.glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.38,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.52,
      name: "Mat_Acoustic_Glass"
    });

    this.materials.mossGreen = new THREE.MeshStandardMaterial({
      color: 0x265828,
      roughness: 0.92,
      metalness: 0.02,
      name: "Mat_Preserved_Moss"
    });

    this.materials.ceilingDark = new THREE.MeshStandardMaterial({
      color: 0x14171d,
      roughness: 0.9,
      metalness: 0.1,
      name: "Mat_Open_Plenum_Ceiling"
    });

    this.materials.ledLightPanel = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff4e6,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      name: "Mat_LED_Emitter"
    });
  }

  _buildFloor() {
    const W = 32.0;
    const D = 18.0;

    // Main Lab Floor (Terrazzo) - West & Central areas (X: -16 to 8)
    const labFloorGeo = new THREE.PlaneGeometry(24.0, D);
    const labFloor = new THREE.Mesh(labFloorGeo, this.materials.terrazzo);
    labFloor.rotation.x = -Math.PI / 2;
    labFloor.position.set(-4.0, 0, 0);
    labFloor.receiveShadow = true;
    this.root.add(labFloor);

    // Office & Conference Floor (Carpet) - East Wing (X: 8 to 16, Z: 0 to 9)
    const officeFloorGeo = new THREE.PlaneGeometry(8.0, 9.0);
    const officeFloor = new THREE.Mesh(officeFloorGeo, this.materials.carpet);
    officeFloor.rotation.x = -Math.PI / 2;
    officeFloor.position.set(12.0, 0.002, 4.5);
    officeFloor.receiveShadow = true;
    this.root.add(officeFloor);

    // Airlock & Restroom Floor (Porcelain Tile) - East Wing (X: 8 to 16, Z: -9 to 0)
    const tileFloorGeo = new THREE.PlaneGeometry(8.0, 9.0);
    const tileFloor = new THREE.Mesh(tileFloorGeo, this.materials.porcelainTile);
    tileFloor.rotation.x = -Math.PI / 2;
    tileFloor.position.set(12.0, 0.002, -4.5);
    tileFloor.receiveShadow = true;
    this.root.add(tileFloor);
  }

  _buildPerimeterWalls() {
    const H = 3.8;
    const wallT = 0.2;
    const W = 32.0;
    const D = 18.0;

    const walls = [
      // North Wall
      { x: 0, y: H / 2, z: D / 2, sx: W, sy: H, sz: wallT, mat: this.materials.wallDrywall },
      // South Wall
      { x: 0, y: H / 2, z: -D / 2, sx: W, sy: H, sz: wallT, mat: this.materials.wallDrywall },
      // West Wall (Synthesis & Chemistry bay)
      { x: -W / 2, y: H / 2, z: 0, sx: wallT, sy: H, sz: D, mat: this.materials.charcoalConcrete },
      // East Wall (Office & Facility boundary)
      { x: W / 2, y: H / 2, z: 0, sx: wallT, sy: H, sz: D, mat: this.materials.wallDrywall }
    ];

    walls.forEach((w, idx) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w.sx, w.sy, w.sz), w.mat);
      mesh.position.set(w.x, w.y, w.z);
      mesh.receiveShadow = true;
      mesh.name = `Perimeter_Wall_${idx}`;
      this.root.add(mesh);

      // Add to collision envelope
      this.colliders.push(new THREE.Box3().setFromObject(mesh));
    });
  }

  _buildInteriorPartitions() {
    const H = 3.8;
    const wallT = 0.15;

    // East Wing Spine Wall separating Offices/Airlock from Lab Hall (at X = 8.0)
    // Left section with large vision glass looking into User's Office (Z: 2 to 9)
    this._buildGlassPartitionWall(8.0, 5.5, 7.0, H, "Z"); // Along Z axis

    // Solid dividing wall between Office wing and Airlock (X = 8.0, Z: -9 to 0)
    const airlockSpineWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallT, H, 9.0),
      this.materials.wallDrywall
    );
    airlockSpineWall.position.set(8.0, H / 2, -4.5);
    this.root.add(airlockSpineWall);
    this.colliders.push(new THREE.Box3().setFromObject(airlockSpineWall));

    // Dividing wall between Conference Room and User's Office (Z = 4.5, X: 8 to 16)
    const confDividingWall = new THREE.Mesh(
      new THREE.BoxGeometry(8.0, H, wallT),
      this.materials.wallDrywall
    );
    confDividingWall.position.set(12.0, H / 2, 4.5);
    this.root.add(confDividingWall);
    this.colliders.push(new THREE.Box3().setFromObject(confDividingWall));

    // Acoustic Walnut Slat feature wall behind Conference Table (North side of Z=4.5 wall)
    this._buildWoodSlatPanel(12.0, H / 2, 4.4, 7.6, H * 0.95, false);

    // Acoustic Walnut Slat feature wall in User's Office (East perimeter wall X = 15.9, Z: 5 to 8.5)
    this._buildWoodSlatPanel(15.88, H / 2, 6.75, 4.0, H * 0.95, true);

    // Wall dividing User Office / Conference from Central Corridor (Z = 0.0, X: 8 to 16)
    // Features modern glass wall with door to Conference and User Office
    this._buildGlassPartitionWall(12.0, 0.0, 8.0, H, "X");

    // Partition separating Restroom (X: 12 to 16, Z: -4.5 to 0)
    const restroomWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallT, H, 4.5),
      this.materials.charcoalConcrete
    );
    restroomWall.position.set(12.0, H / 2, -2.25);
    this.root.add(restroomWall);
    this.colliders.push(new THREE.Box3().setFromObject(restroomWall));

    // North Synthesis Bay Dividing Half-Wall (X = -5.0, Z: 1.0 to 9.0)
    const synthDivider = new THREE.Mesh(
      new THREE.BoxGeometry(wallT, H * 0.75, 8.0),
      this.materials.charcoalConcrete
    );
    synthDivider.position.set(-5.0, (H * 0.75) / 2, 5.0);
    this.root.add(synthDivider);
    this.colliders.push(new THREE.Box3().setFromObject(synthDivider));
  }

  _buildWoodSlatPanel(cx, cy, cz, width, height, rotateY = false) {
    const group = new THREE.Group();
    group.position.set(cx, cy, cz);
    if (rotateY) group.rotation.y = Math.PI / 2;

    // Dark acoustic felt backing
    const backGeo = new THREE.PlaneGeometry(width, height);
    const backing = new THREE.Mesh(backGeo, this.materials.woodSlatBacking);
    group.add(backing);

    // Individual vertical wood slats
    const slatW = 0.045; // 45mm width
    const slatD = 0.022; // 22mm depth
    const slatGap = 0.035; // 35mm gap
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

    // Dark bronze mullions (bottom runner, top runner, side posts)
    const runnerGeo = new THREE.BoxGeometry(length, 0.08, 0.08);
    const bottomRunner = new THREE.Mesh(runnerGeo, this.materials.bronzeMullion);
    bottomRunner.position.y = -height / 2 + 0.04;
    group.add(bottomRunner);

    const topRunner = new THREE.Mesh(runnerGeo, this.materials.bronzeMullion);
    topRunner.position.y = height / 2 - 0.04;
    group.add(topRunner);

    // Glass panel
    const glassGeo = new THREE.BoxGeometry(length - 0.04, height - 0.16, 0.015);
    const glass = new THREE.Mesh(glassGeo, this.materials.glass);
    group.add(glass);

    // Vertical intermediate mullions
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
    // Zone 8: Thermal Air-Lock Vestibule at Southeast corner (X: 10.0 to 16.0, Z: -9.0 to -4.5)
    // 1. Exterior Double Doors (South perimeter wall at Z = -9.0, X = 13.0)
    this._buildDoubleDoorAssembly(13.0, 0, -8.95, "EXTERIOR_AIRLOCK");

    // 2. Interior Double Doors (North wall of vestibule at Z = -4.5, X = 13.0)
    this._buildDoubleDoorAssembly(13.0, 0, -4.55, "INTERIOR_AIRLOCK");

    // Tacky cleanroom mat on floor
    const matGeo = new THREE.PlaneGeometry(1.6, 1.2);
    const mat = new THREE.Mesh(
      matGeo,
      new THREE.MeshStandardMaterial({ color: 0x1870a0, roughness: 0.2, metalness: 0.1 })
    );
    mat.rotation.x = -Math.PI / 2;
    mat.position.set(13.0, 0.005, -6.5);
    this.root.add(mat);

    // Wall-mounted Digital Differential Pressure & Temp Monitor
    const panelBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.36, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.3 })
    );
    panelBox.position.set(10.1, 1.6, -6.5);
    panelBox.rotation.y = Math.PI / 2;
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
    ctx.font = "bold 42px monospace";
    ctx.fillText("+0.03\"", 20, 110);
    ctx.font = "18px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("DIFF PRESSURE (w.g.)", 20, 140);
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 36px monospace";
    ctx.fillText("21.0 °C", 20, 210);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px monospace";
    ctx.fillText("ROOM TEMPERATURE", 20, 240);
    ctx.fillStyle = "#3dd68c";
    ctx.font = "bold 20px monospace";
    ctx.fillText("CASCADE: PASS", 20, 310);

    const screenTex = new THREE.CanvasTexture(screenCanvas);
    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.34),
      new THREE.MeshBasicMaterial({ map: screenTex })
    );
    screenMesh.position.set(10.125, 1.6, -6.5);
    screenMesh.rotation.y = Math.PI / 2;
    this.root.add(screenMesh);
  }

  _buildDoubleDoorAssembly(cx, cy, cz, id) {
    const group = new THREE.Group();
    group.position.set(cx, cy, cz);
    group.name = `Double_Door_${id}`;

    const doorW = 0.95; // 950mm each leaf
    const doorH = 2.4;
    const frameGeo = new THREE.BoxGeometry(2.1, doorH + 0.1, 0.1);
    const frame = new THREE.Mesh(frameGeo, this.materials.bronzeMullion);
    frame.position.y = (doorH + 0.1) / 2;
    group.add(frame);

    // Left Leaf
    const leftLeaf = new THREE.Mesh(
      new THREE.BoxGeometry(doorW, doorH, 0.04),
      this.materials.glass
    );
    leftLeaf.position.set(-doorW / 2 - 0.02, doorH / 2, 0);
    group.add(leftLeaf);

    // Right Leaf
    const rightLeaf = new THREE.Mesh(
      new THREE.BoxGeometry(doorW, doorH, 0.04),
      this.materials.glass
    );
    rightLeaf.position.set(doorW / 2 + 0.02, doorH / 2, 0);
    group.add(rightLeaf);

    // Architectural Brushed Aluminum Tube Handles
    const handleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.9, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xd8dde4, roughness: 0.25, metalness: 0.85 });

    const handleL = new THREE.Mesh(handleGeo, handleMat);
    handleL.position.set(-0.1, 1.15, 0.05);
    group.add(handleL);

    const handleR = new THREE.Mesh(handleGeo, handleMat);
    handleR.position.set(0.1, 1.15, 0.05);
    group.add(handleR);

    this.root.add(group);
  }

  _buildStructuralPillars() {
    // 4 Architectural charcoal concrete pillars along the central structural grid line
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

      // Add to collision envelope
      this.colliders.push(new THREE.Box3().setFromObject(pillar));
    });
  }

  _buildCeilingAndLighting() {
    const H = 3.8;
    const W = 32.0;
    const D = 18.0;

    // Dark Open-Plenum Ceiling Plane
    const ceilingGeo = new THREE.PlaneGeometry(W, D);
    const ceiling = new THREE.Mesh(ceilingGeo, this.materials.ceilingDark);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, H, 0);
    this.root.add(ceiling);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.45);
    this.scene.add(ambientLight);

    // Perimeter Cove Light Wash (Warm 3500K)
    const coveLightN = new THREE.DirectionalLight(0xffedd5, 0.65);
    coveLightN.position.set(0, H - 0.2, 8.5);
    this.scene.add(coveLightN);

    const coveLightS = new THREE.DirectionalLight(0xffedd5, 0.65);
    coveLightS.position.set(0, H - 0.2, -8.5);
    this.scene.add(coveLightS);

    // Suspended Minimalist Linear Luminaires above Laboratory Island Benches
    const benchLinearLights = [
      { x: -10.0, z: -4.5, len: 6.0 }, // Analytical Island
      { x: -2.0, z: -4.5, len: 6.0 },  // Pharma QC Island
      { x: -10.0, z: 5.0, len: 6.0 },  // Synthesis Island
      { x: -0.5, z: 5.0, len: 5.0 }    // Sample Prep Island
    ];

    benchLinearLights.forEach((cfg, idx) => {
      const fixtureGroup = new THREE.Group();
      fixtureGroup.position.set(cfg.x, 3.1, cfg.z);

      // Matte Black Extruded Housing
      const housing = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.len, 0.06, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.35, metalness: 0.6 })
      );
      fixtureGroup.add(housing);

      // LED Diffuser Pane
      const diffuser = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.len - 0.05, 0.015, 0.1),
        this.materials.ledLightPanel
      );
      diffuser.position.y = -0.035;
      fixtureGroup.add(diffuser);

      // Aircraft Suspension Cables
      const cableMat = new THREE.MeshStandardMaterial({ color: 0x889098, metalness: 0.9, roughness: 0.2 });
      [-cfg.len / 2 + 0.3, cfg.len / 2 - 0.3].forEach((cx) => {
        const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.7, 8), cableMat);
        cable.position.set(cx, 0.35, 0);
        fixtureGroup.add(cable);
      });

      // Dedicated Downlight for Workbench
      const point = new THREE.PointLight(0xf8fafc, 0.85, 9.0, 1.2);
      point.position.y = -0.1;
      point.castShadow = true;
      fixtureGroup.add(point);

      this.root.add(fixtureGroup);
    });
  }

  _buildBiophilicWall() {
    // Biophilic Preserved Nordic Moss Wall in the Central Corridor (X = 0, Z = 0.9)
    const mossWallGroup = new THREE.Group();
    mossWallGroup.position.set(0, 1.8, 0.9);

    // Dark Bronze Architectural Frame
    const frameGeo = new THREE.BoxGeometry(4.2, 2.2, 0.08);
    const frame = new THREE.Mesh(frameGeo, this.materials.bronzeMullion);
    mossWallGroup.add(frame);

    // Preserved Green Moss Panel
    const mossGeo = new THREE.BoxGeometry(4.0, 2.0, 0.1);
    const moss = new THREE.Mesh(mossGeo, this.materials.mossGreen);
    moss.position.z = 0.03;
    mossWallGroup.add(moss);

    this.root.add(mossWallGroup);
  }
}
