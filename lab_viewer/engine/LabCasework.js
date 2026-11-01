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
import { labAudio } from "./LabSFXMixer.js";

export class LabCasework {
  constructor(scene, colliders = []) {
    this.scene = scene;
    this.colliders = colliders;
    this.root = new THREE.Group();
    this.root.name = "Modern_Lab_Casework_Root";
    this.fumeHoodSashes = [];
    this.interactiveObjects = [];

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
    this._buildUVGoggleCabinets();
    this._buildGloveDispenserStations();

    this.scene.add(this.root);
  }

  _initMaterials() {
    this.materials = {
      // Modular SEFA-8 Casework & Marine Edge Materials
      toeKick: new THREE.MeshStandardMaterial({
        color: 0x0c0f14,
        roughness: 0.85,
        metalness: 0.15,
        name: "Mat_SEFA_Toe_Kick"
      }),
      drawerFace: new THREE.MeshStandardMaterial({
        color: 0x242a34,
        roughness: 0.52,
        metalness: 0.22,
        name: "Mat_SEFA_Drawer_Face"
      }),
      drawerShadow: new THREE.MeshBasicMaterial({
        color: 0x050709,
        name: "Mat_Drawer_Reveal_Shadow"
      }),
      keyLock: new THREE.MeshStandardMaterial({
        color: 0xc8d0db,
        roughness: 0.2,
        metalness: 0.9,
        name: "Mat_Cam_Lock_Chrome"
      }),
      marineEdge: new THREE.MeshStandardMaterial({
        color: 0x0f1217,
        roughness: 0.2,
        metalness: 0.28,
        name: "Mat_Marine_Edge_Epoxy"
      }),
      unistrutChannel: new THREE.MeshStandardMaterial({
        color: 0x5a6372,
        roughness: 0.35,
        metalness: 0.82,
        name: "Mat_Unistrut_Aluminum"
      }),
      taskLightDiffuser: new THREE.MeshStandardMaterial({
        color: 0xfffaed,
        emissive: 0xfffaed,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        name: "Mat_LED_Task_Diffuser"
      }),
      plugmoldRaceway: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.25,
        metalness: 0.88,
        name: "Mat_Plugmold_Stainless"
      }),
      gfciFaceplate: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.45,
        metalness: 0.05,
        name: "Mat_GFCI_Receptacle"
      }),
      valveVacuum: new THREE.MeshStandardMaterial({
        color: 0xeab308,
        roughness: 0.35,
        metalness: 0.3,
        name: "Mat_Valve_Vacuum_Yellow"
      }),
      valveGas: new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        roughness: 0.35,
        metalness: 0.3,
        name: "Mat_Valve_Gas_Blue"
      }),
      valveAir: new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.35,
        metalness: 0.3,
        name: "Mat_Valve_Air_Orange"
      }),
      valveWater: new THREE.MeshStandardMaterial({
        color: 0x16a34a,
        roughness: 0.35,
        metalness: 0.3,
        name: "Mat_Valve_Water_Green"
      }),
      hazardFlammable: new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.4,
        metalness: 0.1,
        name: "Mat_OSHA_Flammable_Red"
      }),
      hazardCorrosive: new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        roughness: 0.4,
        metalness: 0.1,
        name: "Mat_OSHA_Corrosive_Blue"
      }),
      telMonitorFace: new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.28,
        metalness: 0.65,
        name: "Mat_TEL_Monitor_Bezel"
      }),
      telDigitalGreen: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x10b981,
        emissiveIntensity: 0.95,
        roughness: 0.1,
        name: "Mat_TEL_Digital_Green"
      }),
      airfoilStainless: new THREE.MeshStandardMaterial({
        color: 0xd8dde4,
        roughness: 0.2,
        metalness: 0.9,
        name: "Mat_Airfoil_Stainless"
      }),
      cupSinkPoly: new THREE.MeshStandardMaterial({
        color: 0x1a1e24,
        roughness: 0.4,
        metalness: 0.1,
        name: "Mat_Cup_Sink_Polypropylene"
      }),

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
      }),
      uvCabinetEnamel: new THREE.MeshStandardMaterial({
        color: 0xe6e9ee,
        roughness: 0.35,
        metalness: 0.25,
        name: "Mat_UV_Cabinet_Enamel"
      }),
      uvWindowAmber: new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.55,
        roughness: 0.1,
        metalness: 0.1,
        ior: 1.49,
        transmission: 0.6,
        name: "Mat_UV_Amber_Shield"
      }),
      uvGlowTube: new THREE.MeshBasicMaterial({
        color: 0x9333ea,
        name: "Mat_UVC_Germicidal_Tube"
      }),
      goggleLensClear: new THREE.MeshPhysicalMaterial({
        color: 0xdbeafe,
        transparent: true,
        opacity: 0.35,
        roughness: 0.05,
        metalness: 0.05,
        ior: 1.52,
        name: "Mat_Safety_Goggle_Polycarbonate"
      }),
      goggleStrapBlack: new THREE.MeshStandardMaterial({
        color: 0x1f242c,
        roughness: 0.85,
        metalness: 0.05,
        name: "Mat_Goggle_Elastic_Strap"
      }),
      gloveBoxSmall: new THREE.MeshStandardMaterial({
        color: 0x10b981, // Mint green for size S
        roughness: 0.45,
        metalness: 0.05,
        name: "Mat_Glove_Box_Small"
      }),
      gloveBoxMed: new THREE.MeshStandardMaterial({
        color: 0x2563eb, // Cobalt blue for size M
        roughness: 0.45,
        metalness: 0.05,
        name: "Mat_Glove_Box_Medium"
      }),
      gloveBoxLarge: new THREE.MeshStandardMaterial({
        color: 0x7c3aed, // Purple nitrile for size L
        roughness: 0.45,
        metalness: 0.05,
        name: "Mat_Glove_Box_Large"
      }),
      wireCaddyChrome: new THREE.MeshStandardMaterial({
        color: 0xccd3dc,
        roughness: 0.2,
        metalness: 0.85,
        name: "Mat_Glove_Caddy_Chrome"
      })
    };
  }

  // --- Ergonomic Swivel Laboratory Technician Stool ---
  _createLabStool(cx, cz, stoolH = 0.68) {
    const stool = new THREE.Group();
    stool.position.set(cx, 0, cz);
    stool.name = "Ergonomic_Lab_Stool";

    // 1. Five-Star Spider Base with Dual-Wheel Rolling Casters
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.05, 16),
      this.materials.cabinetHandle
    );
    hub.position.y = 0.10;
    stool.add(hub);

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.018, 0.24),
        this.materials.cabinetHandle
      );
      leg.position.set(Math.sin(angle) * 0.12, 0.08, Math.cos(angle) * 0.12);
      leg.rotation.y = angle;
      stool.add(leg);

      // Caster fork & dual wheels
      [-0.012, 0.012].forEach((wx) => {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.022, 0.01, 10),
          this.materials.leatherBlack
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(
          Math.sin(angle) * 0.24 + Math.cos(angle) * wx,
          0.022,
          Math.cos(angle) * 0.24 - Math.sin(angle) * wx
        );
        stool.add(wheel);
      });
    }

    // 2. Heavy-Duty Pneumatic Lift Cylinder with Bellows
    const gasCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.028, stoolH - 0.12, 16),
      this.materials.cabinetHandle
    );
    gasCylinder.position.y = 0.10 + (stoolH - 0.12) / 2;
    stool.add(gasCylinder);

    const bellows = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.038, 0.18, 16),
      this.materials.leatherBlack
    );
    bellows.position.y = 0.22;
    stool.add(bellows);

    // 3. 360° Circular Chrome Footrest Ring (Diameter 400mm)
    const footRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.20, 0.012, 10, 24),
      this.materials.cabinetHandle
    );
    footRing.rotation.x = Math.PI / 2;
    footRing.position.y = 0.26;
    stool.add(footRing);

    for (let r = 0; r < 4; r++) {
      const spokeAngle = (r * Math.PI) / 2;
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.20, 8),
        this.materials.cabinetHandle
      );
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = spokeAngle;
      spoke.position.set(Math.sin(spokeAngle) * 0.10, 0.26, Math.cos(spokeAngle) * 0.10);
      stool.add(spoke);
    }

    // 4. Contoured Polyurethane Round Cushion Seat (Diameter 360mm, Thickness 70mm)
    const seat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.175, 0.07, 24),
      this.materials.leatherBlack
    );
    seat.position.y = stoolH;
    stool.add(seat);

    // 5. Ergonomic Lumbar Backrest on Curved Chrome Stalk
    const backStalk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.32, 10),
      this.materials.cabinetHandle
    );
    backStalk.position.set(0, stoolH + 0.16, -0.16);
    backStalk.rotation.x = -0.15;
    stool.add(backStalk);

    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.16, 0.04),
      this.materials.leatherBlack
    );
    backrest.position.set(0, stoolH + 0.28, -0.19);
    backrest.rotation.x = -0.10;
    stool.add(backrest);

    return stool;
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

// --- SEFA-8 High-Fidelity Modular Double-Sided Island Casework ---
  _createDoubleSidedBench(cx, cz, length, depth, name) {
    const group = new THREE.Group();
    group.position.set(cx, 0, cz);
    group.name = name;

    const benchH = 0.87; // Base height
    const topT = 0.03;   // Countertop thickness 30mm -> Surface exactly at Y = 0.90m!
    const toeH = 0.10;   // 100mm recessed toe kick
    const toeRecess = 0.075;

    // 1. Continuous Recessed Black Vinyl/Steel Toe Kick
    const toeW = length - toeRecess * 2;
    const toeD = depth - toeRecess * 2;
    const toeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(toeW, toeH, toeD),
      this.materials.toeKick
    );
    toeMesh.position.y = toeH / 2;
    toeMesh.castShadow = true;
    toeMesh.receiveShadow = true;
    group.add(toeMesh);

    // 2. Modular SEFA Cabinet Bays
    const cabH = benchH - toeH; // 0.77m
    const moduleW = 0.90;
    const numBays = Math.max(3, Math.floor((length - 0.1) / moduleW));
    const actualBayW = (length - 0.04) / numBays;
    const halfDepth = (depth - 0.04) / 2;

    // Base subframe core
    const subframe = new THREE.Mesh(
      new THREE.BoxGeometry(length - 0.04, cabH, depth - 0.04),
      this.materials.cabinetBody
    );
    subframe.position.y = toeH + cabH / 2;
    group.add(subframe);

    // Both front (+Z) and rear (-Z) modular faces
    [1, -1].forEach((sideSign) => {
      const faceZ = sideSign * (depth / 2 - 0.015);
      const isFront = sideSign > 0;

      for (let b = 0; b < numBays; b++) {
        const bayX = -((numBays - 1) * actualBayW) / 2 + b * actualBayW;
        const isCenter = b === Math.floor(numBays / 2);

        if (isCenter && isFront) {
          // Kneespace Opening for Technician Seating
          const modesty = new THREE.Mesh(
            new THREE.BoxGeometry(actualBayW - 0.04, cabH - 0.06, 0.02),
            this.materials.cabinetBody
          );
          modesty.position.set(bayX, toeH + (cabH - 0.06) / 2, sideSign * 0.12);
          group.add(modesty);

          // Stainless Footrest Rail
          const footRail = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012, 0.012, actualBayW - 0.06, 12),
            this.materials.cabinetHandle
          );
          footRail.rotation.z = Math.PI / 2;
          footRail.position.set(bayX, 0.18, sideSign * 0.22);
          group.add(footRail);

          // Ergonomic Swivel Lab Stool tucked in
          const stool = this._createLabStool(bayX, sideSign * (depth / 2 + 0.35));
          stool.rotation.y = isFront ? 0 : Math.PI;
          group.add(stool);
        } else if (b % 2 === 0) {
          // 4-Drawer Modular Stack
          const numDrawers = 4;
          const drwH = (cabH - 0.04) / numDrawers;

          // Shadow reveal border around bay
          const shadowBorder = new THREE.Mesh(
            new THREE.BoxGeometry(actualBayW - 0.02, cabH - 0.02, 0.005),
            this.materials.drawerShadow
          );
          shadowBorder.position.set(bayX, toeH + cabH / 2, faceZ);
          group.add(shadowBorder);

          for (let d = 0; d < numDrawers; d++) {
            const dy = toeH + (d + 0.5) * drwH;

            // Inset drawer face with bevel edges
            const drwFace = new THREE.Mesh(
              new THREE.BoxGeometry(actualBayW - 0.035, drwH - 0.008, 0.018),
              this.materials.drawerFace
            );
            drwFace.position.set(bayX, dy, faceZ + sideSign * 0.01);
            group.add(drwFace);

            // Brushed Stainless Wire D-Pull Handle
            const handle = new THREE.Mesh(
              new THREE.CylinderGeometry(0.006, 0.006, 0.14, 10),
              this.materials.cabinetHandle
            );
            handle.rotation.z = Math.PI / 2;
            handle.position.set(bayX, dy, faceZ + sideSign * 0.028);
            group.add(handle);

            // Handle standoffs
            [-0.06, 0.06].forEach((hx) => {
              const standoff = new THREE.Mesh(
                new THREE.CylinderGeometry(0.005, 0.005, 0.015, 8),
                this.materials.cabinetHandle
              );
              standoff.rotation.x = Math.PI / 2;
              standoff.position.set(bayX + hx, dy, faceZ + sideSign * 0.02);
              group.add(standoff);
            });

            // Top drawer cam lock with key slot
            if (d === numDrawers - 1) {
              const lock = new THREE.Mesh(
                new THREE.CylinderGeometry(0.008, 0.008, 0.006, 12),
                this.materials.keyLock
              );
              lock.rotation.x = Math.PI / 2;
              lock.position.set(bayX + (actualBayW / 2 - 0.05), dy, faceZ + sideSign * 0.02);
              group.add(lock);
            }
          }
        } else {
          // 2-Door Flush-Inset Cupboard
          const doorW = (actualBayW - 0.04) / 2;

          [-doorW / 2 - 0.003, doorW / 2 + 0.003].forEach((dx, doorIdx) => {
            const door = new THREE.Mesh(
              new THREE.BoxGeometry(doorW - 0.006, cabH - 0.03, 0.018),
              this.materials.drawerFace
            );
            door.position.set(bayX + dx, toeH + cabH / 2, faceZ + sideSign * 0.01);
            group.add(door);

            // Vertical wire pull handle
            const vHandle = new THREE.Mesh(
              new THREE.CylinderGeometry(0.006, 0.006, 0.18, 10),
              this.materials.cabinetHandle
            );
            vHandle.position.set(
              bayX + dx + (doorIdx === 0 ? doorW / 2 - 0.03 : -doorW / 2 + 0.03),
              toeH + cabH * 0.72,
              faceZ + sideSign * 0.028
            );
            group.add(vHandle);
          });
        }

        // Heavy-Duty Leveling Feet at modular bay seams
        [-actualBayW / 2, actualBayW / 2].forEach((fx) => {
          const foot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.025, 0.02, 12),
            this.materials.cabinetHandle
          );
          foot.position.set(bayX + fx, 0.01, faceZ);
          group.add(foot);
        });
      }
    });

    // 3. Countertop: 30mm Solid Jet-Black Epoxy with Raised 3D Marine Spill Edge
    const topSlab = new THREE.Mesh(
      new THREE.BoxGeometry(length, topT, depth),
      this.materials.epoxyTop
    );
    topSlab.position.y = benchH + topT / 2; // Y = 0.885m
    topSlab.castShadow = true;
    topSlab.receiveShadow = true;
    group.add(topSlab);

    // 3D Physical Marine Drip Edge (8mm raised spill lip around all outer rims)
    const lipH = 0.008;
    const lipW = 0.014;
    const lipY = benchH + topT + lipH / 2;

    // Front & Back Lip Bars
    [-depth / 2 + lipW / 2, depth / 2 - lipW / 2].forEach((lz) => {
      const lipBar = new THREE.Mesh(
        new THREE.BoxGeometry(length, lipH, lipW),
        this.materials.marineEdge
      );
      lipBar.position.set(0, lipY, lz);
      group.add(lipBar);
    });

    // Left & Right Lip Bars
    [-length / 2 + lipW / 2, length / 2 - lipW / 2].forEach((lx) => {
      const lipBar = new THREE.Mesh(
        new THREE.BoxGeometry(lipW, lipH, depth - lipW * 2),
        this.materials.marineEdge
      );
      lipBar.position.set(lx, lipY, 0);
      group.add(lipBar);
    });

    // Drop-in Undermount Epoxy Sink Basin on End of Island
    const hasSink = name.includes("Analytical") || name.includes("Synthesis") || name.includes("Pharma");
    if (hasSink) {
      const sinkX = -length / 2 + 0.55;
      const sinkW = 0.60;
      const sinkD = 0.45;
      const sinkDepth = 0.28;

      const sinkBasin = new THREE.Mesh(
        new THREE.BoxGeometry(sinkW, sinkDepth, sinkD),
        this.materials.cupSinkPoly
      );
      sinkBasin.position.set(sinkX, benchH - sinkDepth / 2, 0);
      group.add(sinkBasin);

      // Chrome Drain Grate
      const drain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.005, 16),
        this.materials.cabinetHandle
      );
      drain.position.set(sinkX, benchH - sinkDepth + 0.005, 0);
      group.add(drain);

      // Grooved Sloped Drainage Runnels in Epoxy Top
      for (let r = 0; r < 5; r++) {
        const runnel = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 0.004, 0.012),
          this.materials.marineEdge
        );
        runnel.position.set(sinkX + sinkW / 2 + 0.16, benchH + topT + 0.001, -0.12 + r * 0.06);
        group.add(runnel);
      }

      // Tall Gooseneck Swivel Faucet with Dual Wrist-Blade Handles
      const faucetBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.028, 0.05, 16),
        this.materials.chromeFaucet
      );
      faucetBase.position.set(sinkX, benchH + topT + 0.025, -sinkD / 2 - 0.06);
      group.add(faucetBase);

      const gooseneckCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sinkX, benchH + topT + 0.05, -sinkD / 2 - 0.06),
        new THREE.Vector3(sinkX, benchH + topT + 0.32, -sinkD / 2 - 0.06),
        new THREE.Vector3(sinkX, benchH + topT + 0.42, -sinkD / 2 + 0.02),
        new THREE.Vector3(sinkX, benchH + topT + 0.38, -sinkD / 2 + 0.10),
        new THREE.Vector3(sinkX, benchH + topT + 0.28, -sinkD / 2 + 0.10)
      ]);
      const gooseneck = new THREE.Mesh(
        new THREE.TubeGeometry(gooseneckCurve, 20, 0.012, 12, false),
        this.materials.chromeFaucet
      );
      group.add(gooseneck);

      // Wrist-Blade Handles (Hot Left, Cold Right)
      [-0.06, 0.06].forEach((hx, hIdx) => {
        const valveStem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.04, 12),
          this.materials.chromeFaucet
        );
        valveStem.position.set(sinkX + hx, benchH + topT + 0.02, -sinkD / 2 - 0.06);
        group.add(valveStem);

        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.014, 0.008, 0.07),
          this.materials.chromeFaucet
        );
        blade.position.set(sinkX + hx, benchH + topT + 0.045, -sinkD / 2 - 0.06);
        group.add(blade);
      });
    }

    // 4. Center Utility Spine & Dual-Tier Reagent Shelving Riser
    const spineStartX = hasSink ? -length / 2 + 1.15 : -length / 2 + 0.25;
    const spineEndX = length / 2 - 0.25;
    const spineLen = spineEndX - spineStartX;
    const spineCenterX = (spineStartX + spineEndX) / 2;
    const spineW = 0.35; // Spine width

    // Slotted Unistrut / Extruded Aluminum Uprights (Every ~1.5m)
    const numUprights = Math.max(2, Math.floor(spineLen / 1.5) + 1);
    const uprightH = 0.78;
    for (let u = 0; u < numUprights; u++) {
      const ux = spineStartX + (u / (numUprights - 1)) * spineLen;

      // Heavy vertical Unistrut channel
      const unistrut = new THREE.Mesh(
        new THREE.BoxGeometry(0.042, uprightH, 0.042),
        this.materials.unistrutChannel
      );
      unistrut.position.set(ux, benchH + topT + uprightH / 2, 0);
      group.add(unistrut);

      // Shelf mounting brackets
      [0.35, 0.65].forEach((by) => {
        const bracket = new THREE.Mesh(
          new THREE.BoxGeometry(0.046, 0.025, spineW),
          this.materials.unistrutChannel
        );
        bracket.position.set(ux, benchH + topT + by, 0);
        group.add(bracket);
      });
    }

    // Dual-Tier Chemical-Resistant Epoxy Reagent Shelves
    [0.35, 0.65].forEach((sy, tierIdx) => {
      const shelfY = benchH + topT + sy;

      // Epoxy shelf slab
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(spineLen, 0.022, spineW),
        this.materials.epoxyTop
      );
      shelf.position.set(spineCenterX, shelfY, 0);
      group.add(shelf);

      // Stainless Steel Bottle Retaining Guardrails (12mm high)
      [-spineW / 2 + 0.012, spineW / 2 - 0.012].forEach((rz) => {
        const rail = new THREE.Mesh(
          new THREE.CylinderGeometry(0.005, 0.005, spineLen, 10),
          this.materials.cabinetHandle
        );
        rail.rotation.z = Math.PI / 2;
        rail.position.set(spineCenterX, shelfY + 0.02, rz);
        group.add(rail);

        // Stanchions along rail
        for (let st = 0; st < numUprights; st++) {
          const stx = spineStartX + (st / (numUprights - 1)) * spineLen;
          const stanchion = new THREE.Mesh(
            new THREE.CylinderGeometry(0.006, 0.006, 0.028, 8),
            this.materials.cabinetHandle
          );
          stanchion.position.set(stx, shelfY + 0.014, rz);
          group.add(stanchion);
        }
      });

      // Under-Shelf LED Task Lighting on Lower Shelf Tier
      if (tierIdx === 0) {
        const fixture = new THREE.Mesh(
          new THREE.BoxGeometry(spineLen * 0.95, 0.015, 0.06),
          this.materials.taskLightDiffuser
        );
        fixture.position.set(spineCenterX, shelfY - 0.018, 0);
        group.add(fixture);
      }
    });

    // 5. Double-Sided Stainless Plugmold Electrical Service Raceway
    [-(spineW / 2 + 0.02), spineW / 2 + 0.02].forEach((pz, pSideIdx) => {
      const raceway = new THREE.Mesh(
        new THREE.BoxGeometry(spineLen, 0.06, 0.035),
        this.materials.plugmoldRaceway
      );
      raceway.position.set(spineCenterX, benchH + topT + 0.045, pz);
      group.add(raceway);

      // Duplex GFCI Outlets spaced every 0.8m
      const numOutlets = Math.max(2, Math.floor(spineLen / 0.8));
      for (let o = 0; o < numOutlets; o++) {
        const ox = spineStartX + (o + 0.5) * (spineLen / numOutlets);

        const gfciPlate = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.05, 0.004),
          this.materials.gfciFaceplate
        );
        gfciPlate.position.set(ox, benchH + topT + 0.045, pz + (pSideIdx === 0 ? -0.018 : 0.018));
        group.add(gfciPlate);

        // Green status LED
        const led = new THREE.Mesh(
          new THREE.BoxGeometry(0.006, 0.006, 0.002),
          this.materials.telDigitalGreen
        );
        led.position.set(ox + 0.025, benchH + topT + 0.055, pz + (pSideIdx === 0 ? -0.021 : 0.021));
        group.add(led);
      }
    });

    // 6. Multi-Service Laboratory Utility Turrets (Vacuum, Gas, Air, Water)
    const numTurrets = Math.max(2, Math.floor(spineLen / 2.0));
    for (let t = 0; t < numTurrets; t++) {
      const tx = spineStartX + (t + 0.5) * (spineLen / numTurrets);

      // Central turret post
      const turretBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.03, 0.12, 16),
        this.materials.cabinetHandle
      );
      turretBase.position.set(tx, benchH + topT + 0.06, 0);
      group.add(turretBase);

      // 4 Color-coded service needle valves (North, South, East, West)
      const valveConfigs = [
        { angle: 0, mat: this.materials.valveVacuum, label: "VAC" },
        { angle: Math.PI / 2, mat: this.materials.valveGas, label: "GAS" },
        { angle: Math.PI, mat: this.materials.valveAir, label: "AIR" },
        { angle: -Math.PI / 2, mat: this.materials.valveWater, label: "H2O" }
      ];

      valveConfigs.forEach((vc) => {
        const nozzle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.006, 0.045, 10),
          this.materials.cabinetHandle
        );
        nozzle.rotation.z = Math.PI / 2;
        nozzle.rotation.y = vc.angle;
        nozzle.position.set(
          tx + Math.cos(vc.angle) * 0.035,
          benchH + topT + 0.08,
          Math.sin(vc.angle) * 0.035
        );
        group.add(nozzle);

        // Knurled turn handle
        const handle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.014, 0.014, 0.018, 12),
          vc.mat
        );
        handle.rotation.z = Math.PI / 2;
        handle.rotation.y = vc.angle;
        handle.position.set(
          tx + Math.cos(vc.angle) * 0.055,
          benchH + topT + 0.08,
          Math.sin(vc.angle) * 0.055
        );
        group.add(handle);
      });
    }

    this.root.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(group));
  }

  // --- SEFA-8 Perimeter Single-Sided Casework Bench ---
  _createSingleSidedBench(cx, cz, length, depth, name) {
    const group = new THREE.Group();
    group.position.set(cx, 0, cz);
    group.name = name;

    const benchH = 0.87;
    const topT = 0.03;
    const toeH = 0.10;
    const toeRecess = 0.075;

    // 1. Recessed Toe Kick
    const toeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(length - 0.1, toeH, depth - toeRecess),
      this.materials.toeKick
    );
    toeMesh.position.set(0, toeH / 2, -toeRecess / 2);
    group.add(toeMesh);

    // 2. Modular Modular Cabinet Bays
    const cabH = benchH - toeH;
    const moduleW = 0.90;
    const numBays = Math.max(2, Math.floor(length / moduleW));
    const actualBayW = length / numBays;

    const subframe = new THREE.Mesh(
      new THREE.BoxGeometry(length - 0.04, cabH, depth - 0.04),
      this.materials.cabinetBody
    );
    subframe.position.set(0, toeH + cabH / 2, -0.01);
    group.add(subframe);

    const faceZ = depth / 2 - 0.015;

    for (let b = 0; b < numBays; b++) {
      const bayX = -((numBays - 1) * actualBayW) / 2 + b * actualBayW;

      if (b % 2 === 0) {
        // 4-Drawer Stack
        const numDrawers = 4;
        const drwH = (cabH - 0.04) / numDrawers;

        for (let d = 0; d < numDrawers; d++) {
          const dy = toeH + (d + 0.5) * drwH;
          const drwFace = new THREE.Mesh(
            new THREE.BoxGeometry(actualBayW - 0.035, drwH - 0.008, 0.018),
            this.materials.drawerFace
          );
          drwFace.position.set(bayX, dy, faceZ + 0.01);
          group.add(drwFace);

          const handle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.006, 0.006, 0.14, 10),
            this.materials.cabinetHandle
          );
          handle.rotation.z = Math.PI / 2;
          handle.position.set(bayX, dy, faceZ + 0.028);
          group.add(handle);
        }
      } else {
        // 2-Door Cupboard
        const doorW = (actualBayW - 0.04) / 2;
        [-doorW / 2 - 0.003, doorW / 2 + 0.003].forEach((dx, doorIdx) => {
          const door = new THREE.Mesh(
            new THREE.BoxGeometry(doorW - 0.006, cabH - 0.03, 0.018),
            this.materials.drawerFace
          );
          door.position.set(bayX + dx, toeH + cabH / 2, faceZ + 0.01);
          group.add(door);

          const vHandle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.006, 0.006, 0.18, 10),
            this.materials.cabinetHandle
          );
          vHandle.position.set(
            bayX + dx + (doorIdx === 0 ? doorW / 2 - 0.03 : -doorW / 2 + 0.03),
            toeH + cabH * 0.72,
            faceZ + 0.028
          );
          group.add(vHandle);
        });
      }
    }

    // 3. Countertop with Raised 3D Marine Spill Edge
    const topSlab = new THREE.Mesh(
      new THREE.BoxGeometry(length, topT, depth),
      this.materials.epoxyTop
    );
    topSlab.position.y = benchH + topT / 2;
    group.add(topSlab);

    const lipH = 0.008;
    const lipW = 0.014;
    const lipY = benchH + topT + lipH / 2;

    // Front & Side Lip Bars
    const frontLip = new THREE.Mesh(
      new THREE.BoxGeometry(length, lipH, lipW),
      this.materials.marineEdge
    );
    frontLip.position.set(0, lipY, depth / 2 - lipW / 2);
    group.add(frontLip);

    [-length / 2 + lipW / 2, length / 2 - lipW / 2].forEach((lx) => {
      const sideLip = new THREE.Mesh(
        new THREE.BoxGeometry(lipW, lipH, depth - lipW),
        this.materials.marineEdge
      );
      sideLip.position.set(lx, lipY, -lipW / 2);
      group.add(sideLip);
    });

    // 4. Wall-Mounted Stainless Plugmold Electrical Raceway Strip
    const raceway = new THREE.Mesh(
      new THREE.BoxGeometry(length * 0.95, 0.06, 0.035),
      this.materials.plugmoldRaceway
    );
    raceway.position.set(0, benchH + topT + 0.05, -depth / 2 + 0.02);
    group.add(raceway);

    // Duplex GFCI Outlets
    const numOutlets = Math.max(2, Math.floor(length / 1.0));
    for (let o = 0; o < numOutlets; o++) {
      const ox = -((numOutlets - 1) * 1.0) / 2 + o * 1.0;
      const gfciPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.05, 0.004),
        this.materials.gfciFaceplate
      );
      gfciPlate.position.set(ox, benchH + topT + 0.05, -depth / 2 + 0.038);
      group.add(gfciPlate);
    }

    this.root.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(group));
  }

  // --- High-Performance Labconco Protector Premier Fume Hoods ---
  _buildFumeHoods() {
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
      const toeH = 0.10;

      // 1. Recessed Toe Kick
      const toe = new THREE.Mesh(
        new THREE.BoxGeometry(hoodW - 0.10, toeH, hoodD - 0.08),
        this.materials.toeKick
      );
      toe.position.set(0, toeH / 2, 0.02);
      hood.add(toe);

      // 2. Dual Hazardous Safety Storage Base Cabinets
      const cabH = baseH - toeH;
      const cabW = (hoodW - 0.04) / 2;

      // Left Cabinet: Flammable Liquids Storage
      const flamCab = new THREE.Mesh(
        new THREE.BoxGeometry(cabW, cabH, hoodD - 0.04),
        this.materials.cabinetBody
      );
      flamCab.position.set(-cabW / 2 - 0.01, toeH + cabH / 2, 0);
      hood.add(flamCab);

      // Flammables Warning Placard
      const flamPlacard = new THREE.Mesh(
        new THREE.BoxGeometry(cabW * 0.75, 0.16, 0.005),
        this.materials.hazardFlammable
      );
      flamPlacard.position.set(-cabW / 2 - 0.01, toeH + cabH * 0.72, -hoodD / 2 + 0.01);
      hood.add(flamPlacard);

      // Right Cabinet: Corrosive / Acid Storage
      const acidCab = new THREE.Mesh(
        new THREE.BoxGeometry(cabW, cabH, hoodD - 0.04),
        this.materials.cabinetBody
      );
      acidCab.position.set(cabW / 2 + 0.01, toeH + cabH / 2, 0);
      hood.add(acidCab);

      // Corrosives Warning Placard
      const acidPlacard = new THREE.Mesh(
        new THREE.BoxGeometry(cabW * 0.75, 0.16, 0.005),
        this.materials.hazardCorrosive
      );
      acidPlacard.position.set(cabW / 2 + 0.01, toeH + cabH * 0.72, -hoodD / 2 + 0.01);
      hood.add(acidPlacard);

      // Louvered Ventilation Slots & Stainless Latch Handles on both cabinets
      [-cabW / 2 - 0.01, cabW / 2 + 0.01].forEach((cx) => {
        // Louvers
        for (let l = 0; l < 3; l++) {
          const louver = new THREE.Mesh(
            new THREE.BoxGeometry(cabW * 0.60, 0.012, 0.008),
            this.materials.fumeHoodLining
          );
          louver.position.set(cx, toeH + 0.15 + l * 0.035, -hoodD / 2 + 0.01);
          hood.add(louver);
        }

        // Heavy latch handle with padlock hasp
        const latch = new THREE.Mesh(
          new THREE.BoxGeometry(0.024, 0.16, 0.02),
          this.materials.cabinetHandle
        );
        latch.position.set(cx, toeH + cabH * 0.50, -hoodD / 2 - 0.005);
        hood.add(latch);
      });

      // 3. Chemical Dished Epoxy Work Surface with Spill Containment Basin
      const workDeck = new THREE.Mesh(
        new THREE.BoxGeometry(hoodW + 0.02, 0.035, hoodD + 0.02),
        this.materials.epoxyTop
      );
      workDeck.position.y = baseH + 0.0175;
      workDeck.receiveShadow = true;
      hood.add(workDeck);

      // Dished containment rim (12mm high) around work surface
      const dishRim = new THREE.Mesh(
        new THREE.BoxGeometry(hoodW + 0.02, 0.012, 0.016),
        this.materials.marineEdge
      );
      dishRim.position.set(0, baseH + 0.035 + 0.006, -hoodD / 2 - 0.002);
      hood.add(dishRim);

      // Polypropylene Cup Sink in Left Rear Corner
      const cupSink = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.06, 0.14, 16),
        this.materials.cupSinkPoly
      );
      cupSink.position.set(-hoodW / 2 + 0.22, baseH - 0.04, hoodD / 2 - 0.22);
      hood.add(cupSink);

      const cupFaucet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.18, 10),
        this.materials.chromeFaucet
      );
      cupFaucet.position.set(-hoodW / 2 + 0.22, baseH + 0.12, hoodD / 2 - 0.22);
      hood.add(cupFaucet);

      // 4. Aerodynamic Curved Stainless Steel Airfoil Entry Sill
      const airfoil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.032, hoodW * 0.88, 16, 1, false, 0, Math.PI),
        this.materials.airfoilStainless
      );
      airfoil.rotation.z = Math.PI / 2;
      airfoil.rotation.x = Math.PI / 2;
      airfoil.position.set(0, baseH + 0.048, -hoodD / 2 + 0.03);
      hood.add(airfoil);

      // 5. Upper Canopy Header with Bypass Louvers
      const headerH = 0.38;
      const header = new THREE.Mesh(
        new THREE.BoxGeometry(hoodW, headerH, hoodD),
        this.materials.fumeHoodSteel
      );
      header.position.set(0, hoodH - headerH / 2, 0);
      hood.add(header);

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

      // 6. Aerodynamic Corner Posts & Side Enclosures
      const openH = cavityH - headerH;
      const postW = 0.12;

      // Left Corner Post: TEL AFA1000 Digital Airflow Velocity Monitor
      const leftPost = new THREE.Mesh(
        new THREE.BoxGeometry(postW, openH, 0.12),
        this.materials.fumeHoodSteel
      );
      leftPost.position.set(-hoodW / 2 + postW / 2, baseH + openH / 2, -hoodD / 2 + 0.06);
      hood.add(leftPost);

      // TEL AFA1000 Digital Monitor Faceplate
      const telBezel = new THREE.Mesh(
        new THREE.BoxGeometry(0.085, 0.14, 0.012),
        this.materials.telMonitorFace
      );
      telBezel.position.set(-hoodW / 2 + postW / 2, baseH + openH * 0.65, -hoodD / 2 - 0.006);
      hood.add(telBezel);

      // Digital Screen: 100 FPM
      const telScreen = new THREE.Mesh(
        new THREE.BoxGeometry(0.065, 0.035, 0.004),
        this.materials.telDigitalGreen
      );
      telScreen.position.set(-hoodW / 2 + postW / 2, baseH + openH * 0.67, -hoodD / 2 - 0.014);
      hood.add(telScreen);

      // Green Normal & Red Alarm LEDs
      const greenLED = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.004, 8),
        this.materials.telDigitalGreen
      );
      greenLED.rotation.x = Math.PI / 2;
      greenLED.position.set(-hoodW / 2 + postW / 2 - 0.02, baseH + openH * 0.63, -hoodD / 2 - 0.013);
      hood.add(greenLED);

      const redLED = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.004, 8),
        this.materials.hazardFlammable
      );
      redLED.rotation.x = Math.PI / 2;
      redLED.position.set(-hoodW / 2 + postW / 2 + 0.02, baseH + openH * 0.63, -hoodD / 2 - 0.013);
      hood.add(redLED);

      // Weatherproof Duplex GFCI Outlet with Clear Flip Cover
      const gfciCover = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, 0.11, 0.025),
        this.materials.sashGlass
      );
      gfciCover.position.set(-hoodW / 2 + postW / 2, baseH + openH * 0.35, -hoodD / 2 - 0.01);
      hood.add(gfciCover);

      // Right Corner Post: Remote Service Needle Valves
      const rightPost = new THREE.Mesh(
        new THREE.BoxGeometry(postW, openH, 0.12),
        this.materials.fumeHoodSteel
      );
      rightPost.position.set(hoodW / 2 - postW / 2, baseH + openH / 2, -hoodD / 2 + 0.06);
      hood.add(rightPost);

      // 4 Service Knobs: Vacuum, Nitrogen, Fuel Gas, Cold Water
      const hoodValves = [
        { my: 0.72, mat: this.materials.valveVacuum },
        { my: 0.58, mat: this.materials.valveGas },
        { my: 0.44, mat: this.materials.valveAir },
        { my: 0.30, mat: this.materials.valveWater }
      ];
      hoodValves.forEach((hv) => {
        const knob = new THREE.Mesh(
          new THREE.CylinderGeometry(0.016, 0.016, 0.022, 12),
          hv.mat
        );
        knob.rotation.x = Math.PI / 2;
        knob.position.set(hoodW / 2 - postW / 2, baseH + openH * hv.my, -hoodD / 2 - 0.01);
        hood.add(knob);
      });

      // 7. Interior White Chemical Liner & 3-Tier Aerodynamic Scavenger Baffles
      const innerW = hoodW - postW * 2;
      const rearBaffle = new THREE.Mesh(
        new THREE.BoxGeometry(innerW, openH, 0.04),
        this.materials.fumeHoodLining
      );
      rearBaffle.position.set(0, baseH + openH / 2, hoodD / 2 - 0.03);
      hood.add(rearBaffle);

      // 3 Exhaust Scavenger Slots (Upper, Middle, Lower) with Directional Vanes
      [0.15, openH / 2, openH - 0.15].forEach((by) => {
        const slot = new THREE.Mesh(
          new THREE.BoxGeometry(innerW * 0.90, 0.035, 0.015),
          new THREE.MeshBasicMaterial({ color: 0x050709 })
        );
        slot.position.set(0, baseH + by, hoodD / 2 - 0.05);
        hood.add(slot);
      });

      // Side Wall Liners
      [-hoodW / 2 + 0.03, hoodW / 2 - 0.03].forEach((sx) => {
        const sideLiner = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, openH, hoodD - 0.08),
          this.materials.fumeHoodLining
        );
        sideLiner.position.set(sx, baseH + openH / 2, 0.04);
        hood.add(sideLiner);
      });

      // Vapor-Tight Sealed LED Ceiling Light Panel
      const hoodLight = new THREE.Mesh(
        new THREE.BoxGeometry(innerW * 0.85, 0.02, 0.35),
        this.materials.taskLightDiffuser
      );
      hoodLight.position.set(0, hoodH - headerH - 0.01, 0);
      hood.add(hoodLight);

      // Downward Hood Interior Spotlight
      const spot = new THREE.PointLight(0xffffff, 0.85, 3.5);
      spot.position.set(0, hoodH - headerH - 0.05, 0);
      hood.add(spot);

      // 8. Vertical Sliding Counterweighted Laminated Safety Glass Sash
      const sashW = innerW + 0.04;
      const sashH = openH * 0.82;
      const sashGroup = new THREE.Group();
      sashGroup.position.set(0, baseH + openH * 0.35, -hoodD / 2 + 0.04);

      // Laminated Safety Glass Pane
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(sashW, sashH, 0.012),
        this.materials.sashGlass
      );
      sashGroup.add(glass);

      // Stainless Guide Rails & Bottom D-Handle
      const sashHandle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, sashW * 0.90, 10),
        this.materials.cabinetHandle
      );
      sashHandle.rotation.z = Math.PI / 2;
      sashHandle.position.set(0, -sashH / 2 + 0.015, -0.018);
      sashGroup.add(sashHandle);

      // Frosted Etched 18" (450mm) Sash Stop Warning Line
      const warningLine = new THREE.Mesh(
        new THREE.BoxGeometry(sashW * 0.95, 0.006, 0.014),
        this.materials.hazardFlammable
      );
      warningLine.position.set(0, -sashH / 2 + 0.45, 0);
      sashGroup.add(warningLine);

      hood.add(sashGroup);

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
  _createRealisticWorkstationMonitor(optsOrW, maybeH, maybeX, maybeRotY, maybeZ, maybeCanvas) {
    let opts = {};
    if (typeof optsOrW === "object" && optsOrW !== null) {
      opts = optsOrW;
    } else {
      opts = {
        screenW: optsOrW,
        screenH: maybeH,
        x: maybeX || 0,
        rotY: maybeRotY || 0,
        z: maybeZ || 0,
        canvas: maybeCanvas
      };
    }

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

  // --- Helper: Modern Boucle / Leather Club Armchair ---
  _createModernClubArmchair(fabricMat, legMat) {
    const chair = new THREE.Group();
    const fab = fabricMat || this.materials.boucleFabric;
    const legM = legMat || this.materials.screenBezelMetal;

    // 1. Four Tapered Architectural Splayed Steel Legs (Front Left, Front Right, Rear Left, Rear Right)
    const legPositions = [
      { fx: -0.36, fz: 0.34, sx: -0.26, sz: 0.24 },  // FL
      { fx: 0.36, fz: 0.34, sx: 0.26, sz: 0.24 },   // FR
      { fx: -0.34, fz: -0.36, sx: -0.24, sz: -0.26 }, // RL
      { fx: 0.34, fz: -0.36, sx: 0.24, sz: -0.26 }   // RR
    ];
    legPositions.forEach(pos => {
      const legGeo = new THREE.CylinderGeometry(0.012, 0.018, 0.26, 12);
      const leg = new THREE.Mesh(legGeo, legM);
      const dx = pos.fx - pos.sx;
      const dz = pos.fz - pos.sz;
      leg.position.set((pos.fx + pos.sx) / 2, 0.13, (pos.fz + pos.sz) / 2);
      leg.rotation.z = Math.atan2(-dx, 0.26);
      leg.rotation.x = Math.atan2(dz, 0.26);
      chair.add(leg);

      const glide = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.012, 12),
        this.materials.brassAccent
      );
      glide.position.set(pos.fx, 0.006, pos.fz);
      chair.add(glide);
    });

    // Steel Sub-Frame Ring
    const subFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.60, 0.02, 0.58),
      legM
    );
    subFrame.position.set(0, 0.25, 0);
    chair.add(subFrame);

    // 2. Sculpted Bucket Seat Shell Base
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(0.80, 0.10, 0.78),
      fab
    );
    shell.position.set(0, 0.30, 0);
    chair.add(shell);

    // 3. Plush Boxed Seat Cushion with French Seams
    const cushion = new THREE.Mesh(
      new THREE.BoxGeometry(0.70, 0.14, 0.68),
      fab
    );
    cushion.position.set(0, 0.40, 0.02);
    chair.add(cushion);

    // 4. Wrap-Around Curved Tub Backrest & Sloping Armrests
    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.80, 0.42, 0.14),
      fab
    );
    backrest.position.set(0, 0.58, -0.32);
    chair.add(backrest);

    [-0.37, 0.37].forEach(ax => {
      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.34, 0.64),
        fab
      );
      arm.position.set(ax, 0.50, 0.02);
      chair.add(arm);
    });

    // 5. Tailored Lumbar Accent Pillow
    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.22, 0.08),
      this.materials.leatherBlack
    );
    pillow.position.set(0, 0.50, -0.22);
    pillow.rotation.x = 0.12;
    chair.add(pillow);

    return chair;
  }

  // --- Helper: Contemporary Café Dining Chair ---
  _createCafeDiningChair() {
    const chair = new THREE.Group();
    const frameMat = this.materials.screenBezelMetal;
    const shellMat = this.materials.walnutDesk;

    // 1. Four Splayed Powder-Coated Steel Tubular Legs
    const legCoords = [
      [-0.21, 0.21], [0.21, 0.21],
      [-0.20, -0.21], [0.20, -0.21]
    ];
    legCoords.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.010, 0.014, 0.46, 12),
        frameMat
      );
      leg.position.set(lx * 0.75, 0.23, lz * 0.75);
      leg.rotation.z = -lx * 0.4;
      leg.rotation.x = lz * 0.4;
      chair.add(leg);

      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.01, 8),
        frameMat
      );
      foot.position.set(lx, 0.005, lz);
      chair.add(foot);
    });

    // Cross-stretcher hub under seat
    const cross = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.015, 0.36),
      frameMat
    );
    cross.position.set(0, 0.43, 0);
    chair.add(cross);

    // 2. Ergonomic 3D Molded Plywood / Poly Shell Seat with Waterfall Front Lip
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.03, 0.44),
      shellMat
    );
    seat.position.set(0, 0.45, 0.02);
    chair.add(seat);

    // 3. Ergonomic Curved Backrest & Slender Steel Upright Stanchions
    [-0.14, 0.14].forEach(sx => {
      const stanchion = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.38, 8),
        frameMat
      );
      stanchion.position.set(sx, 0.62, -0.19);
      stanchion.rotation.x = -0.12;
      chair.add(stanchion);
    });

    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.22, 0.025),
      shellMat
    );
    backrest.position.set(0, 0.74, -0.22);
    backrest.rotation.x = -0.12;
    chair.add(backrest);

    return chair;
  }

  // --- Helper: High-Top Modern 4-Legged Barstool ---
  _createModernBarstool() {
    const stool = new THREE.Group();
    const frameMat = this.materials.screenBezelMetal;
    const seatH = 0.72; // Standard 30" bar-height seat

    // 1. Four Splayed Tapered Steel Legs
    const spreadFloor = 0.22;
    const spreadTop = 0.15;
    [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.016, seatH - 0.04, 12),
        frameMat
      );
      leg.position.set(sx * (spreadFloor + spreadTop) / 2, (seatH - 0.04) / 2, sz * (spreadFloor + spreadTop) / 2);
      leg.rotation.z = -sx * 0.11;
      leg.rotation.x = sz * 0.11;
      stool.add(leg);

      const glide = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.012, 10),
        this.materials.brassAccent
      );
      glide.position.set(sx * spreadFloor, 0.006, sz * spreadFloor);
      stool.add(glide);
    });

    // 2. Welded Square Perimeter Footrest Ring at Y = 0.28m
    const footrestW = (spreadFloor * 2 + spreadTop * 2) * 0.45;
    [-1, 1].forEach(side => {
      const rungX = new THREE.Mesh(new THREE.BoxGeometry(footrestW, 0.016, 0.016), frameMat);
      rungX.position.set(0, 0.28, side * footrestW / 2);
      stool.add(rungX);

      const rungZ = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.016, footrestW), frameMat);
      rungZ.position.set(side * footrestW / 2, 0.28, 0);
      stool.add(rungZ);
    });

    // 3. Swivel Mechanism Plate under seat
    const swivelPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 0.02, 16),
      frameMat
    );
    swivelPlate.position.y = seatH - 0.02;
    stool.add(swivelPlate);

    // 4. Contoured Saddle Seat in Stitched Leather
    const seat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.20, 0.19, 0.06, 24),
      this.materials.leatherBlack
    );
    seat.position.y = seatH + 0.02;
    stool.add(seat);

    const brassRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.195, 0.006, 8, 24),
      this.materials.brassAccent
    );
    brassRim.rotation.x = Math.PI / 2;
    brassRim.position.y = seatH - 0.005;
    stool.add(brassRim);

    // 5. Low Curved Lumbar Backrest
    [-0.10, 0.10].forEach(bx => {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.007, 0.22, 8),
        frameMat
      );
      post.position.set(bx, seatH + 0.12, -0.16);
      stool.add(post);
    });

    const lowBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.12, 0.03),
      this.materials.leatherBlack
    );
    lowBack.position.set(0, seatH + 0.22, -0.17);
    lowBack.rotation.x = -0.1;
    stool.add(lowBack);

    return stool;
  }

  // --- Helper: Architectural 4-Legged Café Dining Table ---
  _createCafeDiningTable(w = 0.85, d = 0.85, h = 0.74) {
    const table = new THREE.Group();
    const frameMat = this.materials.screenBezelMetal;

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.04, d),
      this.materials.walnutDesk
    );
    top.position.y = h - 0.02;
    table.add(top);

    const apronW = w - 0.10;
    const apronD = d - 0.10;
    const apron = new THREE.Mesh(
      new THREE.BoxGeometry(apronW, 0.03, apronD),
      frameMat
    );
    apron.position.y = h - 0.055;
    table.add(apron);

    [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sz]) => {
      const legX = sx * (w / 2 - 0.06);
      const legZ = sz * (d / 2 - 0.06);

      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, h - 0.06, 0.035),
        frameMat
      );
      leg.position.set(legX, (h - 0.06) / 2, legZ);
      table.add(leg);

      const glide = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.01, 12),
        this.materials.brassAccent
      );
      glide.position.set(legX, 0.005, legZ);
      table.add(glide);
    });

    return table;
  }

  // --- Helper: Architectural Executive Credenza ---
  _createExecutiveCredenza(w = 4.2, h = 0.72, d = 0.55) {
    const cred = new THREE.Group();
    const numDoors = 6;
    const doorW = (w - 0.04) / numDoors;
    const doorH = h - 0.12;

    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.10, 0.08, d - 0.08),
      this.materials.toeKick
    );
    plinth.position.y = 0.04;
    cred.add(plinth);

    const caseBody = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.02, doorH, d - 0.04),
      this.materials.walnutDesk
    );
    caseBody.position.y = 0.08 + doorH / 2;
    cred.add(caseBody);

    const topSlab = new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.04, d),
      this.materials.carraraMarble
    );
    topSlab.position.y = h - 0.02;
    cred.add(topSlab);

    for (let i = 0; i < numDoors; i++) {
      const dx = -(w - 0.04) / 2 + (i + 0.5) * doorW;
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(doorW - 0.006, doorH - 0.01, 0.02),
        this.materials.walnutSlat
      );
      door.position.set(dx, 0.08 + doorH / 2, d / 2 - 0.01);
      cred.add(door);

      const pull = new THREE.Mesh(
        new THREE.CylinderGeometry(0.004, 0.004, 0.16, 8),
        this.materials.brassAccent
      );
      pull.position.set(dx + (i % 2 === 0 ? doorW / 2 - 0.03 : -doorW / 2 + 0.03), 0.08 + doorH / 2, d / 2 + 0.005);
      cred.add(pull);
    }

    return cred;
  }

  // --- Helper: Modular Bookcase with 3D Monograph Volumes ---
  _createModularBookcase(w = 2.4, h = 2.1, d = 0.38) {
    const caseGroup = new THREE.Group();
    const woodMat = this.materials.walnutDesk;

    const topCap = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, d), woodMat);
    topCap.position.y = h - 0.02;
    caseGroup.add(topCap);

    const bottomCap = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), woodMat);
    bottomCap.position.y = 0.04;
    caseGroup.add(bottomCap);

    [-w / 2 + 0.02, w / 2 - 0.02].forEach(gx => {
      const gable = new THREE.Mesh(new THREE.BoxGeometry(0.04, h - 0.08, d), woodMat);
      gable.position.set(gx, h / 2, 0);
      caseGroup.add(gable);
    });

    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(w - 0.04, h - 0.12, 0.015), this.materials.acousticFelt);
    backPanel.position.set(0, h / 2, -d / 2 + 0.01);
    caseGroup.add(backPanel);

    const centerDiv = new THREE.Mesh(new THREE.BoxGeometry(0.03, h - 0.12, d - 0.02), woodMat);
    centerDiv.position.set(0, h / 2, 0);
    caseGroup.add(centerDiv);

    const numShelves = 5;
    const shelfSpacing = (h - 0.16) / (numShelves + 1);
    const bookColors = [0x991b1b, 0x1e3a8a, 0x14532d, 0x78350f, 0x312e81, 0x18181b];

    for (let s = 1; s <= numShelves; s++) {
      const sy = 0.08 + s * shelfSpacing;
      [-w / 4, w / 4].forEach((bx, bIdx) => {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(w / 2 - 0.04, 0.025, d - 0.02), woodMat);
        shelf.position.set(bx, sy, 0);
        caseGroup.add(shelf);

        const numBooks = 6 + Math.floor(Math.sin(s * 3 + bIdx) * 3);
        let currX = bx - (w / 4 - 0.08);
        for (let b = 0; b < numBooks; b++) {
          const bW = 0.03 + (b % 3) * 0.012;
          const bH = 0.22 + (b % 4) * 0.025;
          const bD = 0.18 + (b % 2) * 0.03;
          const bMat = new THREE.MeshStandardMaterial({
            color: bookColors[(s * 3 + b + bIdx) % bookColors.length],
            roughness: 0.65,
            metalness: 0.1
          });
          const book = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, bD), bMat);
          book.position.set(currX + bW / 2, sy + 0.0125 + bH / 2, 0);
          caseGroup.add(book);

          const goldSpine = new THREE.Mesh(new THREE.PlaneGeometry(bW * 0.8, 0.02), this.materials.brassAccent);
          goldSpine.position.set(currX + bW / 2, sy + 0.0125 + bH * 0.75, bD / 2 + 0.001);
          caseGroup.add(goldSpine);

          currX += bW + 0.003;
        }

        const bookend = new THREE.Mesh(
          new THREE.BoxGeometry(0.015, 0.16, 0.12),
          this.materials.screenBezelMetal
        );
        bookend.position.set(currX + 0.015, sy + 0.0125 + 0.08, 0);
        caseGroup.add(bookend);
      });
    }

    return caseGroup;
  }

  // --- Helper: Exhaustively Detailed Vending Machine ---
  _createDetailedVendingMachine(type = "drinks") {
    const vm = new THREE.Group();
    const w = 0.95;
    const h = 1.95;
    const d = 0.82;

    const toe = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.06, 0.10, d - 0.06),
      this.materials.toeKick
    );
    toe.position.y = 0.05;
    vm.add(toe);

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(w, h - 0.10, d),
      this.materials.cabinetBody
    );
    body.position.y = 0.10 + (h - 0.10) / 2;
    vm.add(body);

    const winW = 0.62;
    const winH = 1.22;
    const winX = -0.12;
    const winY = 1.15;

    const windowGlass = new THREE.Mesh(
      new THREE.BoxGeometry(winW, winH, 0.015),
      this.materials.sashGlass
    );
    windowGlass.position.set(winX, winY, d / 2 + 0.008);
    vm.add(windowGlass);

    const winFrame = new THREE.Mesh(
      new THREE.BoxGeometry(winW + 0.04, winH + 0.04, 0.02),
      this.materials.screenBezelMetal
    );
    winFrame.position.set(winX, winY, d / 2);
    vm.add(winFrame);

    const numShelves = 5;
    const shelfSpacing = winH / (numShelves + 0.5);
    const canColors = [0xdc2626, 0x2563eb, 0x16a34a, 0x9333ea, 0xca8a04];

    for (let s = 0; s < numShelves; s++) {
      const sy = winY - winH / 2 + 0.12 + s * shelfSpacing;

      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(winW - 0.04, 0.012, d - 0.25),
        this.materials.cabinetHandle
      );
      shelf.position.set(winX, sy, 0.05);
      vm.add(shelf);

      const priceStrip = new THREE.Mesh(
        new THREE.BoxGeometry(winW - 0.04, 0.02, 0.008),
        this.materials.screenBezelMetal
      );
      priceStrip.position.set(winX, sy, d / 2 - 0.08);
      vm.add(priceStrip);

      const numCols = 5;
      const colW = (winW - 0.06) / numCols;
      for (let c = 0; c < numCols; c++) {
        const cx = winX - (winW - 0.06) / 2 + (c + 0.5) * colW;

        if (type === "drinks") {
          const canMat = new THREE.MeshStandardMaterial({
            color: canColors[(s + c) % canColors.length],
            roughness: 0.25,
            metalness: 0.85
          });
          const can = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.11, 16),
            canMat
          );
          can.position.set(cx, sy + 0.06, d / 2 - 0.16);
          vm.add(can);

          const lid = new THREE.Mesh(
            new THREE.CylinderGeometry(0.028, 0.028, 0.004, 16),
            this.materials.cabinetHandle
          );
          lid.position.set(cx, sy + 0.115, d / 2 - 0.16);
          vm.add(lid);
        } else {
          const spiral = new THREE.Mesh(
            new THREE.TorusGeometry(0.032, 0.004, 8, 16),
            this.materials.cabinetHandle
          );
          spiral.position.set(cx, sy + 0.04, d / 2 - 0.14);
          vm.add(spiral);

          const bagMat = new THREE.MeshStandardMaterial({
            color: canColors[(s * 2 + c) % canColors.length],
            roughness: 0.4,
            metalness: 0.6
          });
          const snack = new THREE.Mesh(
            new THREE.BoxGeometry(0.07, 0.10, 0.025),
            bagMat
          );
          snack.position.set(cx, sy + 0.06, d / 2 - 0.15);
          snack.rotation.x = -0.15;
          vm.add(snack);
        }
      }
    }

    [-winW / 2 + 0.02, winW / 2 - 0.02].forEach(lx => {
      const ledStrip = new THREE.Mesh(
        new THREE.BoxGeometry(0.015, winH - 0.04, 0.015),
        this.materials.taskLightDiffuser
      );
      ledStrip.position.set(winX + lx, winY, d / 2 - 0.04);
      vm.add(ledStrip);
    });

    const uiX = 0.30;
    const headerCanvas = document.createElement("canvas");
    headerCanvas.width = 256;
    headerCanvas.height = 128;
    const hCtx = headerCanvas.getContext("2d");
    hCtx.fillStyle = type === "drinks" ? "#0284c7" : "#d97706";
    hCtx.fillRect(0, 0, 256, 128);
    hCtx.fillStyle = "#ffffff";
    hCtx.font = "bold 32px sans-serif";
    hCtx.textAlign = "center";
    hCtx.fillText(type === "drinks" ? "ICE COLD" : "SNACKS", 128, 55);
    hCtx.font = "20px sans-serif";
    hCtx.fillText("REFRESHMENT", 128, 95);
    const headerTex = new THREE.CanvasTexture(headerCanvas);

    const marquee = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.18, 0.02),
      new THREE.MeshBasicMaterial({ map: headerTex })
    );
    marquee.position.set(uiX, 1.70, d / 2 + 0.005);
    vm.add(marquee);

    const priceDisplay = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.05, 0.015),
      this.materials.telMonitorFace
    );
    priceDisplay.position.set(uiX, 1.48, d / 2 + 0.008);
    vm.add(priceDisplay);

    const priceText = new THREE.Mesh(
      new THREE.PlaneGeometry(0.14, 0.035),
      this.materials.telDigitalGreen
    );
    priceText.position.set(uiX, 1.48, d / 2 + 0.016);
    vm.add(priceText);

    const keypad = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.22, 0.015),
      this.materials.screenBezelMetal
    );
    keypad.position.set(uiX, 1.30, d / 2 + 0.008);
    vm.add(keypad);

    const billSlot = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.035, 0.02),
      this.materials.telDigitalGreen
    );
    billSlot.position.set(uiX, 1.12, d / 2 + 0.008);
    vm.add(billSlot);

    const coinSlot = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.06, 0.015),
      this.materials.cabinetHandle
    );
    coinSlot.position.set(uiX, 1.02, d / 2 + 0.008);
    vm.add(coinSlot);

    const flap = new THREE.Mesh(
      new THREE.BoxGeometry(winW, 0.28, 0.03),
      this.materials.screenBezelMetal
    );
    flap.position.set(winX, 0.35, d / 2 + 0.005);
    vm.add(flap);

    const pushPlate = new THREE.Mesh(
      new THREE.BoxGeometry(winW * 0.7, 0.04, 0.01),
      this.materials.cabinetHandle
    );
    pushPlate.position.set(winX, 0.35, d / 2 + 0.021);
    vm.add(pushPlate);

    return vm;
  }

  // --- Helper: Commercial Dual-Group Espresso Machine & Grinder Station ---
  _createCommercialEspressoStation() {
    const group = new THREE.Group();
    const machine = new THREE.Group();

    const bodyW = 0.72;
    const bodyH = 0.44;
    const bodyD = 0.52;

    const mainBody = new THREE.Mesh(
      new THREE.BoxGeometry(bodyW, bodyH, bodyD),
      this.materials.espressoChrome
    );
    mainBody.position.y = bodyH / 2;
    machine.add(mainBody);

    [[-bodyW / 2 + 0.06, -bodyD / 2 + 0.06], [bodyW / 2 - 0.06, -bodyD / 2 + 0.06],
     [-bodyW / 2 + 0.06, bodyD / 2 - 0.06], [bodyW / 2 - 0.06, bodyD / 2 - 0.06]].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.04, 16), this.materials.espressoChrome);
      foot.position.set(fx, 0.02, fz);
      machine.add(foot);
    });

    const dripTray = new THREE.Mesh(
      new THREE.BoxGeometry(bodyW - 0.04, 0.04, 0.24),
      this.materials.airfoilStainless
    );
    dripTray.position.set(0, 0.06, bodyD / 2 - 0.08);
    machine.add(dripTray);

    [-0.14, 0.14].forEach(gx => {
      const groupHead = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.08, 16),
        this.materials.espressoChrome
      );
      groupHead.position.set(gx, bodyH - 0.08, bodyD / 2 - 0.04);
      machine.add(groupHead);

      const pfHead = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.04, 16),
        this.materials.espressoChrome
      );
      pfHead.position.set(gx, bodyH - 0.14, bodyD / 2 - 0.04);
      machine.add(pfHead);

      const pfHandle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.014, 0.15, 12),
        this.materials.leatherBlack
      );
      pfHandle.rotation.x = Math.PI / 2;
      pfHandle.position.set(gx, bodyH - 0.14, bodyD / 2 + 0.06);
      machine.add(pfHandle);
    });

    [-bodyW / 2 + 0.06, bodyW / 2 - 0.06].forEach((wx, wIdx) => {
      const wand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.24, 8),
        this.materials.espressoChrome
      );
      wand.rotation.z = wIdx === 0 ? 0.35 : -0.35;
      wand.position.set(wx, bodyH - 0.12, bodyD / 2 - 0.02);
      machine.add(wand);

      const knob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.03, 12),
        this.materials.leatherBlack
      );
      knob.rotation.x = Math.PI / 2;
      knob.position.set(wx, bodyH - 0.04, bodyD / 2 + 0.01);
      machine.add(knob);
    });

    [-0.04, 0.04].forEach(px => {
      const gauge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, 0.01, 16),
        this.materials.espressoChrome
      );
      gauge.rotation.x = Math.PI / 2;
      gauge.position.set(px, bodyH - 0.05, bodyD / 2 + 0.006);
      machine.add(gauge);
    });

    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(bodyW - 0.04, 0.03, bodyD - 0.06),
      this.materials.cabinetHandle
    );
    rail.position.set(0, bodyH + 0.015, 0);
    machine.add(rail);

    for (let c = 0; c < 6; c++) {
      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.02, 0.045, 12),
        this.materials.porcelainWhite
      );
      cup.position.set(-0.22 + c * 0.088, bodyH + 0.025, 0.02);
      machine.add(cup);
    }
    group.add(machine);

    // Burr Coffee Grinder
    const grinder = new THREE.Group();
    grinder.position.set(bodyW / 2 + 0.16, 0, 0);

    const grinderBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.20, 0.36, 0.28),
      this.materials.cabinetBody
    );
    grinderBase.position.y = 0.18;
    grinder.add(grinderBase);

    const hopper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.04, 0.18, 16),
      new THREE.MeshPhysicalMaterial({ color: 0x4a2e18, transparent: true, opacity: 0.85, roughness: 0.1 })
    );
    hopper.position.y = 0.45;
    grinder.add(hopper);

    const hopperLid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.02, 16),
      this.materials.screenBezelMetal
    );
    hopperLid.position.y = 0.55;
    grinder.add(hopperLid);

    const mat = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.01, 0.18),
      this.materials.leatherBlack
    );
    mat.position.set(0, 0.005, 0.22);
    grinder.add(mat);

    const tamper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.06, 16),
      this.materials.espressoChrome
    );
    tamper.position.set(0, 0.04, 0.22);
    grinder.add(tamper);

    group.add(grinder);

    return group;
  }

  // --- Helper: Commercial Heavy-Duty Stainless Microwave ---
  _createCommercialMicrowave() {
    const uwave = new THREE.Group();
    const mwW = 0.58;
    const mwH = 0.36;
    const mwD = 0.42;

    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(mwW, mwH, mwD),
      this.materials.stainlessAppliance
    );
    shell.position.y = mwH / 2;
    uwave.add(shell);

    [[-mwW / 2 + 0.04, -mwD / 2 + 0.04], [mwW / 2 - 0.04, -mwD / 2 + 0.04],
     [-mwW / 2 + 0.04, mwD / 2 - 0.04], [mwW / 2 - 0.04, mwD / 2 - 0.04]].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.015, 8), this.materials.toeKick);
      foot.position.set(fx, 0.0075, fz);
      uwave.add(foot);
    });

    const doorW = mwW * 0.70;
    const doorH = mwH - 0.05;
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(doorW, doorH, 0.015),
      this.materials.screenBezelMetal
    );
    door.position.set(-mwW / 2 + doorW / 2 + 0.025, mwH / 2, mwD / 2 + 0.008);
    uwave.add(door);

    const viewingWindow = new THREE.Mesh(
      new THREE.PlaneGeometry(doorW - 0.08, doorH - 0.08),
      new THREE.MeshBasicMaterial({ color: 0x05070a })
    );
    viewingWindow.position.set(-mwW / 2 + doorW / 2 + 0.025, mwH / 2, mwD / 2 + 0.017);
    uwave.add(viewingWindow);

    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, doorH * 0.65, 8),
      this.materials.cabinetHandle
    );
    handle.position.set(-mwW / 2 + doorW - 0.015, mwH / 2, mwD / 2 + 0.032);
    uwave.add(handle);

    const consoleW = mwW - doorW - 0.05;
    const consoleX = mwW / 2 - consoleW / 2 - 0.02;

    const ledClock = new THREE.Mesh(
      new THREE.BoxGeometry(consoleW - 0.02, 0.04, 0.01),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    ledClock.position.set(consoleX, mwH - 0.06, mwD / 2 + 0.01);
    uwave.add(ledClock);

    const touchpad = new THREE.Mesh(
      new THREE.BoxGeometry(consoleW - 0.02, 0.16, 0.005),
      this.materials.screenBezelMetal
    );
    touchpad.position.set(consoleX, mwH / 2 - 0.02, mwD / 2 + 0.01);
    uwave.add(touchpad);

    const rotaryDial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.015, 16),
      this.materials.cabinetHandle
    );
    rotaryDial.rotation.x = Math.PI / 2;
    rotaryDial.position.set(consoleX, 0.07, mwD / 2 + 0.015);
    uwave.add(rotaryDial);

    return uwave;
  }

  // --- Helper: Commercial French-Door Refrigerator ---
  _createCommercialRefrigerator() {
    const fridge = new THREE.Group();
    const w = 0.98;
    const h = 1.95;
    const d = 0.85;

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(w, h - 0.08, d - 0.04),
      this.materials.stainlessAppliance
    );
    body.position.y = 0.08 + (h - 0.08) / 2;
    fridge.add(body);

    const kickGrill = new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.08, d),
      this.materials.screenBezelMetal
    );
    kickGrill.position.y = 0.04;
    fridge.add(kickGrill);

    const upperH = (h - 0.08) * 0.62;
    const upperY = 0.08 + (h - 0.08) * 0.38 + upperH / 2;
    const doorW = (w - 0.01) / 2;

    [-doorW / 2 - 0.003, doorW / 2 + 0.003].forEach((dx, dIdx) => {
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(doorW - 0.004, upperH - 0.01, 0.04),
        this.materials.stainlessAppliance
      );
      door.position.set(dx, upperY, d / 2 + 0.02);
      fridge.add(door);

      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, upperH * 0.8, 12),
        this.materials.cabinetHandle
      );
      handle.position.set(dIdx === 0 ? dx + doorW / 2 - 0.04 : dx - doorW / 2 + 0.04, upperY, d / 2 + 0.06);
      fridge.add(handle);
    });

    const dispenserNiche = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.32, 0.04),
      this.materials.screenBezelMetal
    );
    dispenserNiche.position.set(-doorW / 2, upperY - 0.05, d / 2 + 0.035);
    fridge.add(dispenserNiche);

    const paddle = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, 0.01),
      this.materials.cabinetHandle
    );
    paddle.position.set(-doorW / 2, upperY - 0.06, d / 2 + 0.02);
    paddle.rotation.x = 0.1;
    fridge.add(paddle);

    const tempDisp = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 0.04),
      this.materials.telDigitalGreen
    );
    tempDisp.position.set(-doorW / 2, upperY + 0.08, d / 2 + 0.042);
    fridge.add(tempDisp);

    const lowerH = (h - 0.08) * 0.36;
    const lowerY = 0.08 + lowerH / 2;
    const freezerDrawer = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.01, lowerH - 0.01, 0.04),
      this.materials.stainlessAppliance
    );
    freezerDrawer.position.set(0, lowerY, d / 2 + 0.02);
    fridge.add(freezerDrawer);

    const freezerHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, w * 0.65, 12),
      this.materials.cabinetHandle
    );
    freezerHandle.rotation.z = Math.PI / 2;
    freezerHandle.position.set(0, lowerY + lowerH * 0.32, d / 2 + 0.06);
    fridge.add(freezerHandle);

    return fridge;
  }

  // --- Helper: Modular Louvered Steel Locker Bank ---
  _createLockerBank(numBays = 12, isChampagne = false) {
    const bank = new THREE.Group();
    const bayW = 0.35;
    const totalW = numBays * bayW;
    const h = 1.95;
    const d = 0.55;
    const steelMat = isChampagne ? this.materials.lockerChampagne : this.materials.lockerSteel;

    const toe = new THREE.Mesh(
      new THREE.BoxGeometry(totalW - 0.04, 0.10, d - 0.06),
      this.materials.toeKick
    );
    toe.position.y = 0.05;
    bank.add(toe);

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(totalW, h - 0.10, d),
      steelMat
    );
    body.position.y = 0.10 + (h - 0.10) / 2;
    bank.add(body);

    const slopedCap = new THREE.Mesh(
      new THREE.BoxGeometry(totalW + 0.02, 0.12, d + 0.02),
      steelMat
    );
    slopedCap.position.y = h + 0.04;
    slopedCap.rotation.x = -0.15;
    bank.add(slopedCap);

    const doorH = (h - 0.14) / 2;
    for (let b = 0; b < numBays; b++) {
      const bx = -totalW / 2 + (b + 0.5) * bayW;

      [0, 1].forEach(tier => {
        const dy = 0.10 + (tier + 0.5) * doorH;

        const door = new THREE.Mesh(
          new THREE.BoxGeometry(bayW - 0.015, doorH - 0.01, 0.02),
          steelMat
        );
        door.position.set(bx, dy, d / 2 + 0.005);
        bank.add(door);

        [-doorH * 0.35, doorH * 0.35].forEach(ly => {
          for (let s = 0; s < 3; s++) {
            const slot = new THREE.Mesh(
              new THREE.BoxGeometry(bayW * 0.55, 0.008, 0.006),
              this.materials.screenBezelMetal
            );
            slot.position.set(bx, dy + ly + s * 0.016, d / 2 + 0.016);
            bank.add(slot);
          }
        });

        const lockPocket = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, 0.10, 0.015),
          this.materials.screenBezelMetal
        );
        lockPocket.position.set(bx + bayW / 2 - 0.05, dy, d / 2 + 0.012);
        bank.add(lockPocket);

        const lockDial = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.01, 12),
          this.materials.cabinetHandle
        );
        lockDial.rotation.x = Math.PI / 2;
        lockDial.position.set(bx + bayW / 2 - 0.05, dy + 0.02, d / 2 + 0.02);
        bank.add(lockDial);

        const numPlate = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.025, 0.006),
          this.materials.brassAccent
        );
        numPlate.position.set(bx, dy + doorH * 0.22, d / 2 + 0.016);
        bank.add(numPlate);
      });
    }

    return bank;
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
      new THREE.BoxGeometry(3.2, 0.28, 0.95),
      this.materials.velvetLounge
    );
    sofaMain.position.set(0, 0.14, -0.9);
    loungeGroup.add(sofaMain);

    // Three Tailored Boxed Seat Cushions with French Seams
    for (let c = 0; c < 3; c++) {
      const cx = -1.0 + c * 1.0;
      const cushion = new THREE.Mesh(
        new THREE.BoxGeometry(0.96, 0.14, 0.88),
        this.materials.velvetLounge
      );
      cushion.position.set(cx, 0.35, -0.86);
      loungeGroup.add(cushion);
    }

    const sofaBack = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.44, 0.22),
      this.materials.velvetLounge
    );
    sofaBack.position.set(0, 0.56, -1.25);
    loungeGroup.add(sofaBack);

    // Tapered Architectural Brushed Brass Legs
    [[-1.5, -0.48], [1.5, -0.48], [-1.5, -1.3], [1.5, -1.3], [0, -1.3]].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.022, 0.12, 12),
        this.materials.brassAccent
      );
      foot.position.set(fx, 0.06, fz);
      loungeGroup.add(foot);
    });

    // Pair of Ultra-High-Fidelity Boucle Club Armchairs
    [-1.65, 1.65].forEach((cx, idx) => {
      const armChair = this._createModernClubArmchair(this.materials.boucleFabric, this.materials.screenBezelMetal);
      armChair.position.set(cx, 0, 0.4);
      armChair.rotation.y = idx === 0 ? 0.35 : -0.35;
      loungeGroup.add(armChair);
    });

    // Twin Round Carrara Marble Coffee Tables with Tripod Brass Stretcher Bases
    const tableLarge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.035, 32),
      this.materials.carraraMarble
    );
    tableLarge.position.set(-0.25, 0.38, 0.1);
    loungeGroup.add(tableLarge);

    // Large table 3-legged tripod brass base
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.014, 0.36, 12),
        this.materials.brassAccent
      );
      leg.position.set(-0.25 + Math.sin(angle) * 0.32, 0.18, 0.1 + Math.cos(angle) * 0.32);
      loungeGroup.add(leg);
    }
    const tripodRingL = new THREE.Mesh(
      new THREE.TorusGeometry(0.30, 0.008, 8, 24),
      this.materials.brassAccent
    );
    tripodRingL.rotation.x = Math.PI / 2;
    tripodRingL.position.set(-0.25, 0.12, 0.1);
    loungeGroup.add(tripodRingL);

    const tableSmall = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.03, 32),
      this.materials.carraraMarble
    );
    tableSmall.position.set(0.55, 0.44, 0.35);
    loungeGroup.add(tableSmall);

    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.014, 0.42, 12),
        this.materials.brassAccent
      );
      leg.position.set(0.55 + Math.sin(angle) * 0.22, 0.21, 0.35 + Math.cos(angle) * 0.22);
      loungeGroup.add(leg);
    }
    const tripodRingS = new THREE.Mesh(
      new THREE.TorusGeometry(0.20, 0.008, 8, 24),
      this.materials.brassAccent
    );
    tripodRingS.rotation.x = Math.PI / 2;
    tripodRingS.position.set(0.55, 0.14, 0.35);
    loungeGroup.add(tripodRingS);

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

    // 4. Low Architectural Executive Walnut & Marble Credenza (South wall: Z = -3.55)
    const credenza = this._createExecutiveCredenza(4.2, 0.72, 0.55);
    credenza.position.set(0, 0, -3.55);
    office.add(credenza);

    // Compact Espresso Station on Credenza
    const espressoMachine = new THREE.Group();
    espressoMachine.position.set(1.4, 0.72, -3.55);

    const espBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.32, 0.36),
      this.materials.espressoChrome
    );
    espBody.position.y = 0.16;
    espressoMachine.add(espBody);

    const espHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.012, 0.12, 8),
      this.materials.leatherBlack
    );
    espHandle.rotation.x = Math.PI / 2;
    espHandle.position.set(0, 0.12, 0.22);
    espressoMachine.add(espHandle);

    const espCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.018, 0.04, 12),
      this.materials.porcelainWhite
    );
    espCup.position.set(0, 0.04, 0.14);
    espressoMachine.add(espCup);

    office.add(espressoMachine);

    // Books and Reference binders on Credenza
    for (let b = 0; b < 12; b++) {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.24, 0.18),
        b % 2 === 0 ? this.materials.leatherBlack : this.materials.cabinetBody
      );
      book.position.set(-1.6 + b * 0.045, 0.84, -3.55);
      office.add(book);
    }

    // 5. Private Discussion / Collaboration Lounge in North Corner (Z = 2.0)
    const lounge = new THREE.Group();
    lounge.position.set(-0.8, 0, 2.0);

    const table = this._createCafeDiningTable(0.95, 0.95, 0.72);
    lounge.add(table);

    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const cArm = this._createModernClubArmchair(this.materials.leatherBlack, this.materials.brassAccent);
      cArm.position.set(Math.sin(angle) * 0.95, 0, Math.cos(angle) * 0.95);
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
    const credenza = this._createExecutiveCredenza(4.2, 0.85, 0.60);
    credenza.position.set(0.6, 0, 3.65);
    conf.add(credenza);

    // Filtered Water Bar Station on Credenza
    const waterBar = new THREE.Group();
    waterBar.position.set(2.0, 0.85, 3.65);

    const wbBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.42, 0.35),
      this.materials.stainlessAppliance
    );
    wbBase.position.y = 0.21;
    waterBar.add(wbBase);

    // Dispense tap
    const wbTap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.16, 12),
      this.materials.chromeFaucet
    );
    wbTap.position.set(0, 0.32, 0.18);
    waterBar.add(wbTap);

    // Blue (Cold) and Red (Hot) touch sensor indicators
    [-0.04, 0.04].forEach((ix, iIdx) => {
      const ind = new THREE.Mesh(
        new THREE.CircleGeometry(0.01, 12),
        new THREE.MeshBasicMaterial({ color: iIdx === 0 ? 0x0284c7 : 0xdc2626 })
      );
      ind.position.set(ix, 0.36, 0.18);
      waterBar.add(ind);
    });

    // Twin Stainless Thermal Carafes
    [-0.14, 0.14].forEach(cx => {
      const carafe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.065, 0.24, 16),
        this.materials.espressoChrome
      );
      carafe.position.set(cx, 0.12, -0.05);
      waterBar.add(carafe);

      const cHandle = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.16, 0.04),
        this.materials.leatherBlack
      );
      cHandle.position.set(cx, 0.14, -0.10);
      waterBar.add(cHandle);
    });

    conf.add(waterBar);

    // 6. Mobile Magnetic Whiteboard with Caster Base & Marker Accessories (East Side: X = 4.8)
    const boardGroup = new THREE.Group();
    boardGroup.position.set(4.8, 0, 0);

    // Floor Base Frame with 4 Dual-Wheel Locking Casters
    [-0.8, 0.8].forEach(bx => {
      const bLeg = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.04, 0.60),
        this.materials.standAnodized
      );
      bLeg.position.set(bx, 0.08, 0);
      boardGroup.add(bLeg);

      [-0.26, 0.26].forEach(cz => {
        const caster = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.015, 12),
          this.materials.screenBezelMetal
        );
        caster.rotation.z = Math.PI / 2;
        caster.position.set(bx, 0.025, cz);
        boardGroup.add(caster);
      });

      // Upright Stanchion Post
      const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 1.80, 0.04),
        this.materials.standAnodized
      );
      post.position.set(bx, 0.98, 0);
      boardGroup.add(post);
    });

    // Whiteboard Frame
    const boardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.84, 1.24, 0.03),
      this.materials.standAnodized
    );
    boardFrame.position.set(0, 1.30, 0);
    boardGroup.add(boardFrame);

    // Porcelain Enamelled Magnetic Whiteboard Surface
    const glassSurface = new THREE.Mesh(
      new THREE.BoxGeometry(1.78, 1.18, 0.012),
      this.materials.porcelainWhite
    );
    glassSurface.position.set(0, 1.30, 0);
    boardGroup.add(glassSurface);

    // Full-Width Extruded Aluminum Marker & Eraser Tray
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(1.60, 0.02, 0.08),
      this.materials.standAnodized
    );
    tray.position.set(0, 0.67, 0.04);
    boardGroup.add(tray);

    // Dry-Erase Markers (Black, Blue, Red, Green)
    const markerColors = [0x09090b, 0x1d4ed8, 0xb91c1c, 0x15803d];
    markerColors.forEach((col, idx) => {
      const marker = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.12, 10),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.3 })
      );
      marker.rotation.z = Math.PI / 2;
      marker.position.set(-0.35 + idx * 0.05, 0.69, 0.04);
      boardGroup.add(marker);
    });

    // Magnetic Felt Eraser
    const eraser = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.035, 0.05),
      this.materials.screenBezelMetal
    );
    eraser.position.set(0.10, 0.70, 0.04);
    boardGroup.add(eraser);

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

    // Welded Steel O-Frame Legs & 3-Drawer Mobile Pedestal
    [-0.92, 0.92].forEach(lx => {
      const oFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.72, 0.85),
        this.materials.screenBezelMetal
      );
      oFrame.position.set(lx, 0.36, -0.5);
      guestOff.add(oFrame);
    });

    const gPedestal = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.58, 0.65),
      this.materials.cabinetBody
    );
    gPedestal.position.set(0.68, 0.29, -0.5);
    guestOff.add(gPedestal);

    for (let d = 0; d < 3; d++) {
      const drw = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.17, 0.015),
        this.materials.drawerFace
      );
      drw.position.set(0.68, 0.10 + d * 0.19, -0.17);
      guestOff.add(drw);
    }

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

    // Modular Bookcase loaded with 3D chemistry volumes (South wall: Z = -3.7)
    const gBookcase = this._createModularBookcase(1.8, 1.9, 0.38);
    gBookcase.position.set(0, 0, -3.65);
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

    [-0.92, 0.92].forEach(lx => {
      const oFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.72, 0.85),
        this.materials.screenBezelMetal
      );
      oFrame.position.set(lx, 0.36, -0.5);
      adminOff.add(oFrame);
    });

    const aPedestal = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.58, 0.65),
      this.materials.cabinetBody
    );
    aPedestal.position.set(-0.68, 0.29, -0.5);
    adminOff.add(aPedestal);

    for (let d = 0; d < 3; d++) {
      const drw = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.17, 0.015),
        this.materials.drawerFace
      );
      drw.position.set(-0.68, 0.10 + d * 0.19, -0.17);
      adminOff.add(drw);
    }

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

    // Dual 550-sheet paper cassettes with level indicator windows
    [0.22, 0.38].forEach(cy => {
      const tray = new THREE.Mesh(
        new THREE.BoxGeometry(0.81, 0.13, 0.02),
        this.materials.drawerFace
      );
      tray.position.set(0, cy, 0.38);
      copierGroup.add(tray);

      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.02, 0.01),
        this.materials.cabinetHandle
      );
      handle.position.set(0, cy + 0.03, 0.395);
      copierGroup.add(handle);
    });

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

    // Output finisher catch tray
    const outTray = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.02, 0.45),
      this.materials.screenBezelMetal
    );
    outTray.position.set(-0.52, 0.75, 0);
    copierGroup.add(outTray);

    adminOff.add(copierGroup);

    // Lateral 4-Drawer Steel File Cabinet (South wall: Z = -3.7)
    const fileCabinet = new THREE.Group();
    fileCabinet.position.set(0, 0, -3.65);

    const fcBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.35, 0.55),
      this.materials.cabinetBody
    );
    fcBody.position.y = 0.675;
    fileCabinet.add(fcBody);

    for (let d = 0; d < 4; d++) {
      const drw = new THREE.Mesh(
        new THREE.BoxGeometry(1.34, 0.29, 0.02),
        this.materials.drawerFace
      );
      drw.position.set(0, 0.20 + d * 0.31, 0.28);
      fileCabinet.add(drw);

      const jPull = new THREE.Mesh(
        new THREE.BoxGeometry(1.20, 0.025, 0.01),
        this.materials.cabinetHandle
      );
      jPull.position.set(0, 0.31 + d * 0.31, 0.295);
      fileCabinet.add(jPull);
    }
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

    [-0.92, 0.92].forEach(lx => {
      const oFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.72, 0.85),
        this.materials.screenBezelMetal
      );
      oFrame.position.set(lx, 0.36, -0.5);
      instOff.add(oFrame);
    });

    const iPedestal = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.58, 0.65),
      this.materials.cabinetBody
    );
    iPedestal.position.set(0.68, 0.29, -0.5);
    instOff.add(iPedestal);

    const iMon = this._createRealisticWorkstationMonitor(
      0.62, 0.38, 0, 0, 0,
      this._createDefaultMonitorCanvas("twin-dashboard")
    );
    iMon.position.set(0, 0.765, -0.6);
    instOff.add(iMon);

    const iChair = this._createExecutiveSwivelChair(false);
    iChair.position.set(0, 0, -1.1);
    instOff.add(iChair);

    // Discussion table with 2 modern Scandinavian dining chairs
    const discTable = this._createCafeDiningTable(0.90, 0.90, 0.72);
    discTable.position.set(-0.8, 0, 1.2);
    instOff.add(discTable);

    [-0.55, 0.55].forEach((dx) => {
      const sChair = this._createCafeDiningChair();
      sChair.position.set(-0.8 + dx, 0, 1.2);
      sChair.rotation.y = dx > 0 ? -Math.PI / 2 : Math.PI / 2;
      instOff.add(sChair);
    });

    // Academic Bookcase wall loaded with chemistry monographs (South wall: Z = -3.7)
    const bookcase = this._createModularBookcase(2.4, 2.1, 0.38);
    bookcase.position.set(0, 0, -3.65);
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
    // Continuous Recessed Toe-Kick
    const toeKick = new THREE.Mesh(
      new THREE.BoxGeometry(5.75, 0.10, 0.58),
      this.materials.toeKick
    );
    toeKick.position.set(0, 0.05, 3.65);
    breakroom.add(toeKick);

    const kitchenBase = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, 0.76, 0.65),
      this.materials.kitchenCabinetSlate
    );
    kitchenBase.position.set(0, 0.48, 3.65);
    breakroom.add(kitchenBase);

    // Modular Cabinet Doors with 3mm Reveals & Brushed Stainless Handles
    const numCabDoors = 8;
    const cabDoorW = 5.70 / numCabDoors;
    for (let d = 0; d < numCabDoors; d++) {
      const dx = -2.85 + (d + 0.5) * cabDoorW;
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(cabDoorW - 0.008, 0.72, 0.02),
        this.materials.kitchenCabinetSlate
      );
      door.position.set(dx, 0.48, 3.985);
      breakroom.add(door);

      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.16, 8),
        this.materials.cabinetHandle
      );
      handle.position.set(dx + (d % 2 === 0 ? cabDoorW / 2 - 0.04 : -cabDoorW / 2 + 0.04), 0.72, 4.005);
      breakroom.add(handle);
    }

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

    // High-Arc Commercial Spring Pull-Down Faucet
    const faucetGroup = new THREE.Group();
    faucetGroup.position.set(-0.8, 0.90, 3.82);

    const faucetBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.025, 0.08, 12),
      this.materials.chromeFaucet
    );
    faucetBase.position.y = 0.04;
    faucetGroup.add(faucetBase);

    const faucetStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.35, 12),
      this.materials.chromeFaucet
    );
    faucetStem.position.y = 0.22;
    faucetGroup.add(faucetStem);

    const springCoil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.25, 12),
      this.materials.espressoChrome
    );
    springCoil.position.y = 0.30;
    faucetGroup.add(springCoil);

    const sprayHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.012, 0.08, 12),
      this.materials.chromeFaucet
    );
    sprayHead.position.set(0, 0.24, -0.14);
    faucetGroup.add(sprayHead);

    breakroom.add(faucetGroup);

    // Full-Size French Door Refrigerator / Freezer
    const fridge = this._createCommercialRefrigerator();
    fridge.position.set(-2.3, 0, 3.50);
    breakroom.add(fridge);

    // Twin Commercial Microwave Ovens
    [-0.1, 0.7].forEach((mx) => {
      const uwave = this._createCommercialMicrowave();
      uwave.position.set(mx, 0.90, 3.65);
      breakroom.add(uwave);
    });

    // Commercial Dual-Group Espresso Machine & Grinder Station
    const espressoStation = this._createCommercialEspressoStation();
    espressoStation.position.set(1.9, 0.90, 3.65);
    breakroom.add(espressoStation);

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

    // Island front cabinet reveals
    for (let c = 0; c < 4; c++) {
      const cx = -1.1 + c * 0.73;
      const pPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, 0.76, 0.015),
        this.materials.kitchenCabinetSlate
      );
      pPanel.position.set(cx, 0.44, 0.41);
      island.add(pPanel);
    }

    // 5 Modern High-Top 4-Legged Barstools with Footrest Rungs
    for (let s = 0; s < 5; s++) {
      const sx = -1.2 + s * 0.60;
      const stool = this._createModernBarstool();
      stool.position.set(sx, 0, -0.75);
      island.add(stool);
    }
    breakroom.add(island);

    // 3. Café Dining Seating Area with 4-Legged Tables & Scandinavian Chairs (Z = -2.2)
    [-1.2, 1.2].forEach((tx) => {
      const table = this._createCafeDiningTable(0.90, 0.90, 0.74);
      table.position.set(tx, 0, -2.2);
      breakroom.add(table);

      // 4 modern chairs per table
      [[0, 0.6], [0, -0.6], [0.6, 0], [-0.6, 0]].forEach(([cx, cz]) => {
        const chair = this._createCafeDiningChair();
        chair.position.set(tx + cx, 0, -2.2 + cz);
        chair.rotation.y = Math.atan2(-cx, -cz);
        breakroom.add(chair);
      });
    });

    // 4. Detailed Glass-Front Vending Machines along West Wall (X = -3.0)
    const vendGroup = new THREE.Group();
    vendGroup.position.set(-3.0, 0, 1.5);

    const drinkVend = this._createDetailedVendingMachine("drinks");
    drinkVend.position.set(0, 0, 0.55);
    drinkVend.rotation.y = Math.PI / 2;
    vendGroup.add(drinkVend);

    const snackVend = this._createDetailedVendingMachine("snacks");
    snackVend.position.set(0, 0, -0.55);
    snackVend.rotation.y = Math.PI / 2;
    vendGroup.add(snackVend);

    breakroom.add(vendGroup);

    // 5. Wall-Mounted 65" TV & Announcement Board on East Wall (X = 3.1)
    const tvGroup = new THREE.Group();
    tvGroup.position.set(3.15, 1.75, 0);

    const tvBezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.88, 1.48),
      this.materials.screenBezelMetal
    );
    tvGroup.add(tvBezel);

    const tvScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.82, 1.42),
      new THREE.MeshBasicMaterial({ map: this._createDefaultMonitorCanvas("twin-dashboard") })
    );
    tvScreen.position.x = -0.015;
    tvGroup.add(tvScreen);

    breakroom.add(tvGroup);

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

      // Exposed Chrome P-Trap Plumbing underneath vanity
      const pTrap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 0.22, 10),
        this.materials.chromeFaucet
      );
      pTrap.position.set(vx, 0.58, 3.65);
      restroom.add(pTrap);

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

    // 3. Wall-Hung Vitreous China Urinal with Flushometer Valve along West Wall (X = -2.15)
    const urinalGroup = new THREE.Group();
    urinalGroup.position.set(-2.0, 0.75, 0.5);

    const urinal = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.65, 0.35),
      this.materials.porcelainWhite
    );
    urinalGroup.add(urinal);

    // Chrome Flushometer Valve on Urinal
    const uFlush = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.28, 12),
      this.materials.chromeFaucet
    );
    uFlush.position.set(0, 0.46, -0.10);
    urinalGroup.add(uFlush);

    const uHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.08, 8),
      this.materials.chromeFaucet
    );
    uHandle.rotation.z = Math.PI / 2;
    uHandle.position.set(0.05, 0.46, -0.10);
    urinalGroup.add(uHandle);

    restroom.add(urinalGroup);

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

    // 1. Double-Tier Steel Locker Banks with Louvered Doors & Combination Locks
    // Bank A: North partition wall (Z = 3.65)
    const lockerBankA = this._createLockerBank(12, false);
    lockerBankA.position.set(0, 0, 3.65);
    mens.add(lockerBankA);

    // Bank B: Center dividing bank (Z = 0.5)
    const lockerBankB = this._createLockerBank(12, false);
    lockerBankB.position.set(0, 0, 0.5);
    mens.add(lockerBankB);

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

      // Continuous Slotted Stainless Floor Trench Drain
      const trench = new THREE.Mesh(
        new THREE.BoxGeometry(0.80, 0.01, 0.12),
        this.materials.cabinetHandle
      );
      trench.position.set(0, 0.005, 0);
      showerStall.add(trench);

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

      // Thermostatic Dual-Control Mixer Valve Trim
      const valve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16),
        this.materials.chromeFaucet
      );
      valve.rotation.x = Math.PI / 2;
      valve.position.set(0, 1.10, -0.68);
      showerStall.add(valve);

      // Vertical Slide Bar with Multi-Function Handheld Wand
      const slideBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.70, 8),
        this.materials.chromeFaucet
      );
      slideBar.position.set(0.25, 1.35, -0.67);
      showerStall.add(slideBar);

      // Wire Shampoo & Bodywash Caddy with Bottles
      const caddy = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.05, 0.10),
        this.materials.cabinetHandle
      );
      caddy.position.set(-0.25, 1.20, -0.64);
      showerStall.add(caddy);

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

    // 1. Champagne Gold Steel Locker Banks with Louvered Doors & Digital Keypads
    // North Locker Bank (Z = 7.35)
    const lockersNorth = this._createLockerBank(14, true);
    lockersNorth.position.set(0, 0, 7.35);
    womens.add(lockersNorth);

    // South Locker Bank (Z = -7.35)
    const lockersSouth = this._createLockerBank(14, true);
    lockersSouth.position.set(0, 0, -7.35);
    womens.add(lockersSouth);

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

      // Slotted Stainless Trench Floor Drain
      const trench = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.01, 1.2),
        this.materials.cabinetHandle
      );
      trench.position.set(-0.55, 0.005, 0);
      suite.add(trench);

      // Rainfall shower head
      const rainHead = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.02, 24),
        this.materials.chromeFaucet
      );
      rainHead.position.set(0, 2.1, 0);
      suite.add(rainHead);

      // Thermostatic Dual-Control Mixer Valve
      const valve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16),
        this.materials.chromeFaucet
      );
      valve.rotation.z = Math.PI / 2;
      valve.position.set(0.68, 1.10, 0);
      suite.add(valve);

      // Vertical Slide Bar & Handheld Sprayer Wand
      const slideBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.70, 8),
        this.materials.chromeFaucet
      );
      slideBar.position.set(0.67, 1.35, 0.25);
      suite.add(slideBar);

      const sprayer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.25, 12),
        this.materials.chromeFaucet
      );
      sprayer.position.set(0.64, 1.35, 0.25);
      suite.add(sprayer);

      // Wire Caddy with Shampoo & Conditioner Bottles
      const caddy = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.05, 0.26),
        this.materials.cabinetHandle
      );
      caddy.position.set(0.64, 1.15, -0.25);
      suite.add(caddy);

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

  // --- Germicidal UV-C Wall-Mounted Goggle Sanitizing Cabinets ---
  _buildUVGoggleCabinets() {
    // Cabinet 1: Airlock Entry Gowning Station (X = 7.75, Z = -1.8, mounted on partition wall facing Lab -X)
    this._createUVCabinet(7.75, 1.45, -1.8, Math.PI / 2, "UV_Cabinet_Entrance");

    // Cabinet 2: Synthesis Prep Safety Corridor (X = -15.8, Z = 3.5, mounted on West perimeter wall facing East +X)
    this._createUVCabinet(-15.8, 1.45, 3.5, -Math.PI / 2, "UV_Cabinet_Synthesis");
  }

  _createUVCabinet(cx, cy, cz, rotY, id) {
    const cab = new THREE.Group();
    cab.position.set(cx, cy, cz);
    cab.rotation.y = rotY;
    cab.name = id;

    const W = 0.65; // Width
    const H = 0.75; // Height
    const D = 0.26; // Depth
    const wallT = 0.02;

    // 1. Heavy Gauge Steel Enamel Body Box
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, this.materials.uvCabinetEnamel);
    cab.add(body);

    // Dark interior cavity for depth
    const cavGeo = new THREE.BoxGeometry(W - wallT * 2, H - wallT * 2, D - 0.04);
    const cav = new THREE.Mesh(cavGeo, new THREE.MeshStandardMaterial({ color: 0x181c22, roughness: 0.8 }));
    cav.position.z = 0.02;
    cab.add(cav);

    // 2. Quartz Germicidal UV-C Emitter Tube (254nm, centered vertically)
    const tubeGeo = new THREE.CylinderGeometry(0.012, 0.012, H - 0.16, 16);
    const uvTube = new THREE.Mesh(tubeGeo, this.materials.uvGlowTube);
    uvTube.position.set(0, 0, -D / 2 + 0.06);
    cab.add(uvTube);

    // Ambient Purple UVC Glow Light
    const uvLight = new THREE.PointLight(0xa855f7, 0.85, 2.5);
    uvLight.position.set(0, 0, 0);
    cab.add(uvLight);

    // 3. Four tiers of stainless steel wire rod goggle shelves
    const shelfYOffsets = [-0.22, -0.07, 0.08, 0.23];
    shelfYOffsets.forEach((sy, tierIdx) => {
      // Wire rack grid
      const rackWire = new THREE.Mesh(
        new THREE.BoxGeometry(W - 0.08, 0.008, D - 0.08),
        this.materials.cabinetHandle
      );
      rackWire.position.set(0, sy, 0.01);
      cab.add(rackWire);

      // Add 2 pairs of genuine 3D safety goggles per shelf tier
      [-0.16, 0.16].forEach((gx, gIdx) => {
        const goggle = this._createSafetyGoggleMesh();
        goggle.position.set(gx, sy + 0.035, 0.02);
        goggle.rotation.y = (tierIdx % 2 === 0 ? 0.08 : -0.08);
        cab.add(goggle);
      });
    });

    // 4. Front Hinged Door with Viewing Filter Window & Chrome Pull
    const doorGroup = new THREE.Group();
    // Pivot at right edge
    doorGroup.position.set(W / 2, 0, D / 2);

    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(W, H, 0.02),
      this.materials.uvCabinetEnamel
    );
    doorFrame.position.set(-W / 2, 0, 0);
    doorGroup.add(doorFrame);

    // Amber UV-filtering acrylic viewport
    const windowMesh = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.68, H * 0.72, 0.025),
      this.materials.uvWindowAmber
    );
    windowMesh.position.set(-W / 2, 0, 0.002);
    doorGroup.add(windowMesh);

    // Chrome Pull Handle
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.16, 12),
      this.materials.cabinetHandle
    );
    handle.position.set(-W + 0.05, 0, 0.035);
    doorGroup.add(handle);

    // Magnetic Safety Interlock Switch Nub & Warning Label
    const lockSwitch = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.04, 0.02),
      this.materials.cabinetHandle
    );
    lockSwitch.position.set(-W + 0.05, -H / 2 + 0.05, 0.015);
    doorGroup.add(lockSwitch);

    cab.add(doorGroup);

    // 5. Header Control Panel (Timer Dial + Rocker Power Switch + Active LED)
    const headerPanel = new THREE.Group();
    headerPanel.position.set(0, H / 2 - 0.045, D / 2 + 0.012);

    // Mechanical 15-min Spring Timer Dial
    const timerKnob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.018, 16),
      this.materials.cabinetBody
    );
    timerKnob.rotation.x = Math.PI / 2;
    timerKnob.position.set(-0.15, 0, 0);
    headerPanel.add(timerKnob);

    // Power Rocker Switch
    const pwrSwitch = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.032, 0.012),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 })
    );
    pwrSwitch.position.set(0.15, 0, 0);
    headerPanel.add(pwrSwitch);

    // Active Sanitizing Indicator LED (Glowing Purple when running)
    const uvLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.008, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xc084fc })
    );
    uvLed.position.set(0, 0, 0.005);
    headerPanel.add(uvLed);

    cab.add(headerPanel);

    // Interactive State: Click cabinet door to toggle open/closed with real safety interlock
    cab.userData = {
      isUVCabinet: true,
      isOpen: false,
      label: "UV-C Safety Goggle Sanitizer"
    };

    cab.userData.toggle = () => {
      cab.userData.isOpen = !cab.userData.isOpen;
      const isOpen = cab.userData.isOpen;

      if (isOpen) {
        doorGroup.rotation.y = -Math.PI * 0.55; // Swing door open
        uvLight.intensity = 0.05; // Safety Interlock Trips: Cut UV lamp
        uvLed.material.color.setHex(0x4b5563); // LED unpowered
        uvTube.material = this.materials.cabinetHandle;
      } else {
        doorGroup.rotation.y = 0; // Door closed
        uvLight.intensity = 0.85; // Interlock engaged: UV germicidal mode active
        uvLed.material.color.setHex(0xc084fc);
        uvTube.material = this.materials.uvGlowTube;
      }
      labAudio.playCabinetToggle(isOpen);
    };

    this.interactiveObjects.push(cab);
    this.root.add(cab);
    this.colliders.push(new THREE.Box3().setFromObject(body));
  }

  // Authentic Procedural Lab Safety Goggle
  _createSafetyGoggleMesh() {
    const goggle = new THREE.Group();

    // Curved Polycarbonate Front Lens Wrap
    const lensCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.065, 0, -0.015),
      new THREE.Vector3(-0.035, 0, 0.015),
      new THREE.Vector3(0, 0, 0.01),
      new THREE.Vector3(0.035, 0, 0.015),
      new THREE.Vector3(0.065, 0, -0.015)
    ]);
    const lensGeo = new THREE.TubeGeometry(lensCurve, 16, 0.018, 8, false);
    const lens = new THREE.Mesh(lensGeo, this.materials.goggleLensClear);
    goggle.add(lens);

    // Soft PVC facial flange frame
    const frameGeo = new THREE.BoxGeometry(0.135, 0.042, 0.045);
    const frame = new THREE.Mesh(
      frameGeo,
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.6, transparent: true, opacity: 0.7 })
    );
    frame.position.z = -0.018;
    goggle.add(frame);

    // Adjustable Elastic Head Strap Loop
    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.065, 0, -0.03),
      new THREE.Vector3(-0.045, 0, -0.075),
      new THREE.Vector3(0, 0, -0.085),
      new THREE.Vector3(0.045, 0, -0.075),
      new THREE.Vector3(0.065, 0, -0.03)
    ]);
    const strap = new THREE.Mesh(
      new THREE.TubeGeometry(strapCurve, 16, 0.005, 6, false),
      this.materials.goggleStrapBlack
    );
    goggle.add(strap);

    return goggle;
  }

  // --- Nitrile Glove Dispenser Caddies (Triple Boxes: S, M, L) ---
  _buildGloveDispenserStations() {
    const stations = [
      // 1. Analytical & Spectroscopy Island (X: -13.5, Z: -4.5, facing East +X)
      { x: -13.4, y: 1.15, z: -4.5, rotY: -Math.PI / 2, id: "Glove_Station_Analytical" },
      // 2. Pharma QC & Solid Dosage Island (X: -5.5, Z: -4.5, facing East +X)
      { x: -5.4, y: 1.15, z: -4.5, rotY: -Math.PI / 2, id: "Glove_Station_PharmaQC" },
      // 3. Synthesis Prep Island (X: -13.2, Z: 5.0, facing East +X)
      { x: -13.1, y: 1.15, z: 5.0, rotY: -Math.PI / 2, id: "Glove_Station_Synthesis" },
      // 4. Sample Prep Suite (X: -3.6, Z: 5.0, facing East +X)
      { x: -3.5, y: 1.15, z: 5.0, rotY: -Math.PI / 2, id: "Glove_Station_SamplePrep" },
      // 5. Airlock Gowning Wall (X: 7.75, Z: -3.2, facing West -X)
      { x: 7.75, y: 1.25, z: -3.2, rotY: Math.PI / 2, id: "Glove_Station_Airlock" }
    ];

    stations.forEach(st => {
      this._createGloveCaddy(st.x, st.y, st.z, st.rotY, st.id);
    });
  }

  _createGloveCaddy(cx, cy, cz, rotY, id) {
    const group = new THREE.Group();
    group.position.set(cx, cy, cz);
    group.rotation.y = rotY;
    group.name = id;

    const boxW = 0.25;  // 250mm
    const boxH = 0.125; // 125mm
    const boxD = 0.075; // 75mm
    const spacing = 0.14;

    // Heavy gauge wire bracket cage
    const wireBack = new THREE.Mesh(
      new THREE.BoxGeometry(boxW + 0.03, spacing * 3 + 0.04, 0.01),
      this.materials.wireCaddyChrome
    );
    wireBack.position.set(0, spacing, -boxD / 2 - 0.008);
    group.add(wireBack);

    // Retaining front wire bars
    for (let b = 0; b < 3; b++) {
      const barY = b * spacing;
      const frontBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.003, boxW + 0.02, 8),
        this.materials.wireCaddyChrome
      );
      frontBar.rotation.z = Math.PI / 2;
      frontBar.position.set(0, barY, boxD / 2 + 0.004);
      group.add(frontBar);
    }

    // 3 Tiers of Nitrile Glove Boxes (Top: Large Purple, Mid: Medium Cobalt, Bottom: Small Mint)
    const tiers = [
      { y: 0, label: "SIZE S · 6-7", colorMat: this.materials.gloveBoxSmall, count: "100 ct" },
      { y: spacing, label: "SIZE M · 7-8", colorMat: this.materials.gloveBoxMed, count: "100 ct" },
      { y: spacing * 2, label: "SIZE L · 8-9", colorMat: this.materials.gloveBoxLarge, count: "100 ct" }
    ];

    tiers.forEach((t) => {
      const box = new THREE.Group();
      box.position.set(0, t.y, 0);

      // Cardboard box body
      const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, boxD), t.colorMat);
      box.add(boxMesh);

      // Front Perforated Dispensing Oval with realistic crumpled nitrile cuff
      const ovalGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.004, 24);
      const oval = new THREE.Mesh(
        ovalGeo,
        new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 })
      );
      oval.rotation.x = Math.PI / 2;
      oval.position.set(0, 0, boxD / 2 + 0.002);
      box.add(oval);

      // Procedural folded nitrile glove cuff protruding slightly from slot
      const cuff = new THREE.Mesh(
        new THREE.SphereGeometry(0.024, 12, 12),
        t.colorMat
      );
      cuff.scale.set(1.4, 0.5, 0.6);
      cuff.position.set(0, 0, boxD / 2 + 0.012);
      box.add(cuff);

      group.add(box);
    });

    group.userData = {
      isGloveStation: true,
      label: "Nitrile Examination Gloves (S / M / L)"
    };
    group.userData.toggle = () => {
      labAudio.playButtonClick();
    };

    this.interactiveObjects.push(group);
    this.root.add(group);
  }
}
