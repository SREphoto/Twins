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
    this.materials = {
      // Architectural Wall, Door & Overhead MEP Infrastructure Materials
      wainscotSlate: new THREE.MeshStandardMaterial({
        color: 0x222832,
        roughness: 0.55,
        metalness: 0.2,
        name: "Mat_Wainscot_Slate"
      }),
      bumperRail: new THREE.MeshStandardMaterial({
        color: 0x333d4b,
        roughness: 0.45,
        metalness: 0.35,
        name: "Mat_Crash_Bumper_Rail"
      }),
      fireStrobeRed: new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.35,
        metalness: 0.15,
        name: "Mat_Fire_Strobe_Red"
      }),
      exitSignGreen: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x10b981,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        name: "Mat_Exit_Sign_Green"
      }),
      magnehelicBezel: new THREE.MeshStandardMaterial({
        color: 0xd8dde4,
        roughness: 0.22,
        metalness: 0.92,
        name: "Mat_Magnehelic_Chrome"
      }),
      sprinklerChrome: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.12,
        metalness: 0.95,
        name: "Mat_Sprinkler_Chrome"
      }),
      sprinklerRedBulb: new THREE.MeshPhysicalMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.85,
        roughness: 0.05,
        ior: 1.45,
        name: "Mat_Sprinkler_Glass_Bulb"
      }),
      hvacDiffuserWhite: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.5,
        metalness: 0.1,
        name: "Mat_HVAC_Diffuser_White"
      }),
      doorCloserAluminum: new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.32,
        metalness: 0.78,
        name: "Mat_Door_Closer_Aluminum"
      }),
      kickplateStainless: new THREE.MeshStandardMaterial({
        color: 0xcfd6e0,
        roughness: 0.25,
        metalness: 0.88,
        name: "Mat_Door_Kickplate_Stainless"
      }),
};

    this._initMaterials();
    this._buildFloorsWithGrid();
    this._buildPerimeterWalls();
    this._buildExteriorBrickFacade();
    this._buildInteriorPartitions();
    this._buildThermalAirlock();
    this._buildStructuralPillars();
    this._buildCeilingAndLighting();
    this._buildBiophilicWall();
    this._buildColdStorageSuite();
    this._buildExteriorCampusSite();

    this.scene.add(this.root);
  }

  _generateProceduralBrickTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Mortar bed (warm sanded cement tone)
    ctx.fillStyle = "#9e968a";
    ctx.fillRect(0, 0, 1024, 512);

    // Stipple mortar sand particles
    for (let i = 0; i < 3500; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.10)";
      ctx.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2);
    }

    // Authentic Danish/Flemish ironspot & red brick palette
    const brickPalette = [
      "#9e422c", "#8d3824", "#b24d35", "#782e1e", "#5c2619",
      "#ab4832", "#6e2f20", "#bf563a", "#84311e", "#4d2016",
      "#a4452e", "#7a3121", "#943c27"
    ];
    const rowH = 32;
    const brickW = 96;
    const gap = 4;

    for (let y = 0; y < 512; y += rowH) {
      const rowIdx = Math.floor(y / rowH);
      const xOffset = (rowIdx % 2) * ((brickW + gap) / 2);
      for (let x = -brickW * 2; x < 1024 + brickW * 2; x += brickW + gap) {
        const bx = x + xOffset;
        const col = brickPalette[Math.floor(Math.random() * brickPalette.length)];
        ctx.fillStyle = col;
        ctx.fillRect(bx, y + gap / 2, brickW, rowH - gap);

        // Brick surface grain / pitting
        for (let s = 0; s < 12; s++) {
          ctx.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.08)";
          ctx.fillRect(bx + Math.random() * (brickW - 4), y + gap / 2 + Math.random() * (rowH - gap - 4), 3, 2);
        }

        // Recessed mortar shadow (bottom & right)
        ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
        ctx.fillRect(bx, y + rowH - gap / 2 - 2, brickW, 2);
        ctx.fillRect(bx + brickW - 2, y + gap / 2, 2, rowH - gap);

        // Light specular catch on top & left lip
        ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
        ctx.fillRect(bx, y + gap / 2, brickW, 1.5);
        ctx.fillRect(bx, y + gap / 2, 1.5, rowH - gap);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  _generateProceduralPaverTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Dark polymer joint sand
    ctx.fillStyle = "#181d24";
    ctx.fillRect(0, 0, 512, 512);

    const paverColors = ["#485260", "#3a434f", "#556070", "#313842", "#404a56", "#2d343d", "#4b5665"];
    const pRowH = 32;
    const pW = 64;
    const pGap = 3;

    for (let y = 0; y < 512; y += pRowH) {
      const rowIdx = Math.floor(y / pRowH);
      const xOffset = (rowIdx % 2) * ((pW + pGap) / 2);
      for (let x = -pW * 2; x < 512 + pW * 2; x += pW + pGap) {
        const px = x + xOffset;
        ctx.fillStyle = paverColors[Math.floor(Math.random() * paverColors.length)];
        ctx.fillRect(px, y + pGap / 2, pW, pRowH - pGap);

        // Chamfered paver bevel shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
        ctx.fillRect(px, y + pRowH - pGap / 2 - 2, pW, 2);
        ctx.fillRect(px + pW - 2, y + pGap / 2, 2, pRowH - pGap);

        // Bevel highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
        ctx.fillRect(px, y + pGap / 2, pW, 1.5);
        ctx.fillRect(px, y + pGap / 2, 1.5, pRowH - pGap);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  _generateProceduralBirchBarkTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // White/cream bark base with subtle vertical gradient
    const bGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    bGrad.addColorStop(0, "#f6f3ec");
    bGrad.addColorStop(0.75, "#ebe5da");
    bGrad.addColorStop(1.0, "#28221c");
    ctx.fillStyle = bGrad;
    ctx.fillRect(0, 0, 512, 1024);

    // Lenticels: horizontal dark charcoal dashes
    for (let l = 0; l < 280; l++) {
      const lx = Math.random() * 512;
      const ly = Math.random() * 880;
      const len = 8 + Math.random() * 48;
      const thick = 1.5 + Math.random() * 3.5;
      ctx.fillStyle = Math.random() > 0.35 ? "#1a1613" : "#383029";
      ctx.fillRect(lx, ly, len, thick);

      if (Math.random() > 0.65) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.20)";
        ctx.fillRect(lx - 2, ly + thick, len + 4, 1.5);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
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

    // High-DPI Procedural Brick, Paver & Foliage Materials
    const brickTex = this._generateProceduralBrickTexture();
    if (brickTex) brickTex.repeat.set(4, 3);

    this.materials.exteriorBrick = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: brickTex,
      roughness: 0.82,
      metalness: 0.05,
      name: "Mat_Architectural_Exterior_Brick"
    });

    const paverTex = this._generateProceduralPaverTexture();
    if (paverTex) paverTex.repeat.set(6, 6);

    this.materials.exteriorPaver = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: paverTex,
      roughness: 0.78,
      metalness: 0.08,
      name: "Mat_Architectural_Exterior_Paver"
    });

    const barkTex = this._generateProceduralBirchBarkTexture();
    this.materials.birchBark = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: barkTex,
      roughness: 0.75,
      metalness: 0.02,
      name: "Mat_Birch_Bark_HighRes"
    });

    this.materials.limestonePlinth = new THREE.MeshStandardMaterial({
      color: 0xc4bcaf,
      roughness: 0.85,
      metalness: 0.04,
      name: "Mat_Cast_Stone_Plinth"
    });

    this.materials.architecturalBlackMetal = new THREE.MeshStandardMaterial({
      color: 0x1b1f24,
      roughness: 0.35,
      metalness: 0.85,
      name: "Mat_Architectural_Black_Metal"
    });

    this.materials.teakWood = new THREE.MeshStandardMaterial({
      color: 0x8a542b,
      roughness: 0.52,
      metalness: 0.04,
      name: "Mat_Oiled_Teak_Wood"
    });

    this.materials.cortenSteel = new THREE.MeshStandardMaterial({
      color: 0x7c4125,
      roughness: 0.72,
      metalness: 0.45,
      name: "Mat_Corten_Weathering_Steel"
    });

    this.materials.castIronGrate = new THREE.MeshStandardMaterial({
      color: 0x22262c,
      roughness: 0.65,
      metalness: 0.82,
      name: "Mat_Cast_Iron_Tree_Grate"
    });

    this.materials.reflectiveExteriorGlass = new THREE.MeshPhysicalMaterial({
      color: 0xd8eaf4,
      transparent: true,
      opacity: 0.45,
      roughness: 0.02,
      metalness: 0.20,
      ior: 1.52,
      name: "Mat_Reflective_Curtain_Glass"
    });

    this.materials.adaTactileYellow = new THREE.MeshStandardMaterial({
      color: 0xf5b800,
      roughness: 0.45,
      metalness: 0.05,
      name: "Mat_ADA_Tactile_Yellow"
    });

    this.materials.bollardLED = new THREE.MeshStandardMaterial({
      color: 0xfffaea,
      emissive: 0xfffaea,
      emissiveIntensity: 1.6,
      roughness: 0.1,
      name: "Mat_Bollard_LED_Emitter"
    });

    this.materials.japaneseMapleLeaf = new THREE.MeshStandardMaterial({
      color: 0x6e1b24,
      roughness: 0.45,
      metalness: 0.03,
      side: THREE.DoubleSide,
      name: "Mat_Japanese_Maple_Crimson"
    });

    this.materials.flutedWalnut = new THREE.MeshStandardMaterial({
      color: 0x482d1c,
      roughness: 0.42,
      metalness: 0.06,
      name: "Mat_Fluted_Walnut_Acoustic"
    });

    this.materials.botanicalFernFrond = new THREE.MeshStandardMaterial({
      color: 0x217332,
      roughness: 0.38,
      metalness: 0.02,
      side: THREE.DoubleSide,
      name: "Mat_Botanical_Fern_Frond"
    });

    this.materials.botanicalCalathea = new THREE.MeshStandardMaterial({
      color: 0x1b572a,
      roughness: 0.32,
      metalness: 0.04,
      side: THREE.DoubleSide,
      name: "Mat_Botanical_Calathea"
    });

    this.materials.botanicalVelvetMossDeep = new THREE.MeshStandardMaterial({
      color: 0x123b18,
      roughness: 0.98,
      metalness: 0.0,
      name: "Mat_Botanical_Velvet_Moss_Deep"
    });

    this.materials.botanicalVelvetMossChartreuse = new THREE.MeshStandardMaterial({
      color: 0x5e8f22,
      roughness: 0.95,
      metalness: 0.0,
      name: "Mat_Botanical_Velvet_Moss_Chartreuse"
    });

    this.materials.botanicalVelvetMossEmerald = new THREE.MeshStandardMaterial({
      color: 0x1c6630,
      roughness: 0.96,
      metalness: 0.0,
      name: "Mat_Botanical_Velvet_Moss_Emerald"
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

    this.materials.camLockWhite = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.35,
      metalness: 0.25,
      name: "Mat_CamLock_Insulated_Panel"
    });

    this.materials.diamondPlateAluminum = new THREE.MeshStandardMaterial({
      color: 0xc8d0da,
      roughness: 0.28,
      metalness: 0.82,
      name: "Mat_Diamond_Plate_Floor"
    });

    this.materials.evaporatorFins = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.45,
      metalness: 0.7,
      name: "Mat_Evaporator_Aluminum_Fins"
    });

    this.materials.wireRackGreen = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.4,
      metalness: 0.3,
      name: "Mat_Metro_Green_Wire_Shelving"
    });

    this.materials.safetyGlowGreen = new THREE.MeshBasicMaterial({
      color: 0x4ade80,
      name: "Mat_Photoluminescent_Escape_Handle"
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

  _buildExteriorBrickFacade() {
    const facadeGroup = new THREE.Group();
    facadeGroup.name = "Architectural_Exterior_Brick_Facade";

    const H = 3.8;
    const baseH = 0.45;        // Cast stone plinth height
    const brickH = H - baseH;  // 3.35m brick masonry height
    const extZ = -9.62;        // Outer face coordinate of South facade

    // 1. Continuous Cast Stone Foundation Water Table / Plinth (Y = 0 to 0.45m)
    // Left segment: X = -16.0 to 11.85 (width 27.85m, center -2.075)
    const plinthLeft = new THREE.Mesh(
      new THREE.BoxGeometry(27.85, baseH, 0.16),
      this.materials.limestonePlinth
    );
    plinthLeft.position.set(-2.075, baseH / 2, extZ - 0.03);
    plinthLeft.receiveShadow = true;
    facadeGroup.add(plinthLeft);

    // Beveled wash cap atop plinth left
    const plinthCapLeft = new THREE.Mesh(
      new THREE.BoxGeometry(27.85, 0.04, 0.18),
      this.materials.limestonePlinth
    );
    plinthCapLeft.position.set(-2.075, baseH + 0.02, extZ - 0.03);
    facadeGroup.add(plinthCapLeft);

    // Right segment: X = 14.15 to 38.0 (width 23.85m, center 26.075)
    const plinthRight = new THREE.Mesh(
      new THREE.BoxGeometry(23.85, baseH, 0.16),
      this.materials.limestonePlinth
    );
    plinthRight.position.set(26.075, baseH / 2, extZ - 0.03);
    plinthRight.receiveShadow = true;
    facadeGroup.add(plinthRight);

    // Beveled wash cap atop plinth right
    const plinthCapRight = new THREE.Mesh(
      new THREE.BoxGeometry(23.85, 0.04, 0.18),
      this.materials.limestonePlinth
    );
    plinthCapRight.position.set(26.075, baseH + 0.02, extZ - 0.03);
    facadeGroup.add(plinthCapRight);

    // 2. Main Running-Bond Architectural Brick Masonry Panels
    // West Segment: X = -16.0 to 11.85
    const brickLeft = new THREE.Mesh(
      new THREE.BoxGeometry(27.85, brickH, 0.12),
      this.materials.exteriorBrick
    );
    brickLeft.position.set(-2.075, baseH + brickH / 2, extZ);
    brickLeft.receiveShadow = true;
    facadeGroup.add(brickLeft);

    // East Segment: X = 14.15 to 38.0
    const brickRight = new THREE.Mesh(
      new THREE.BoxGeometry(23.85, brickH, 0.12),
      this.materials.exteriorBrick
    );
    brickRight.position.set(26.075, baseH + brickH / 2, extZ);
    brickRight.receiveShadow = true;
    facadeGroup.add(brickRight);

    // Entrance Header Brick Arch / Lintel above doors: X = 11.85 to 14.15 (width 2.3m, Y = 2.45 to 3.8, height 1.35m)
    const brickHeader = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 1.35, 0.12),
      this.materials.exteriorBrick
    );
    brickHeader.position.set(13.0, 3.125, extZ);
    facadeGroup.add(brickHeader);

    // 3. Architectural Soldier Course (Vertically set bricks running at Y = 2.65m to 2.87m)
    [-2.075, 26.075].forEach((cx, idx) => {
      const w = idx === 0 ? 27.85 : 23.85;
      const soldier = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.22, 0.13),
        this.materials.exteriorBrick
      );
      soldier.position.set(cx, 2.76, extZ - 0.005);
      facadeGroup.add(soldier);
    });

    // 4. Projecting Architectural Brick Pilasters / Buttress Piers (Spaced every ~6m)
    const pilasterX = [-15.5, -9.5, -3.5, 2.5, 8.5, 17.5, 23.5, 29.5, 35.5];
    pilasterX.forEach((px) => {
      const pier = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, H, 0.12),
        this.materials.exteriorBrick
      );
      pier.position.set(px, H / 2, extZ - 0.05);
      pier.castShadow = true;
      pier.receiveShadow = true;
      facadeGroup.add(pier);

      // Pier stone base plinth
      const pierBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.62, baseH + 0.04, 0.18),
        this.materials.limestonePlinth
      );
      pierBase.position.set(px, (baseH + 0.04) / 2, extZ - 0.07);
      facadeGroup.add(pierBase);

      // Pier decorative stone capital trim at top
      const pierCap = new THREE.Mesh(
        new THREE.BoxGeometry(0.62, 0.10, 0.18),
        this.materials.limestonePlinth
      );
      pierCap.position.set(px, H - 0.05, extZ - 0.07);
      facadeGroup.add(pierCap);
    });

    // 5. Architectural Floor-to-Ceiling Vision Curtain Windows
    const windowBays = [
      { cx: -12.5, w: 2.4 },
      { cx: -6.5, w: 2.4 },
      { cx: -0.5, w: 2.4 },
      { cx: 5.5, w: 2.4 },
      { cx: 20.5, w: 2.4 },
      { cx: 26.5, w: 2.4 },
      { cx: 32.5, w: 2.4 }
    ];

    windowBays.forEach((bay) => {
      const winH = 2.0;
      const winY = 1.65; // centered between plinth and soldier course
      const fThick = 0.06;

      // Dark bronze window frame perimeter
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(bay.w, winH, 0.14),
        this.materials.bronzeMullion
      );
      frame.position.set(bay.cx, winY, extZ - 0.01);
      facadeGroup.add(frame);

      // Reflective double-glazed acoustic glass pane
      const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(bay.w - fThick * 2, winH - fThick * 2),
        this.materials.reflectiveExteriorGlass
      );
      glass.rotation.y = Math.PI;
      glass.position.set(bay.cx, winY, extZ - 0.03);
      facadeGroup.add(glass);

      // Interior warm backlight pane so windows glow authentically from within
      const interiorGlow = new THREE.Mesh(
        new THREE.PlaneGeometry(bay.w - fThick * 2 - 0.02, winH - fThick * 2 - 0.02),
        new THREE.MeshBasicMaterial({ color: 0xfff6ea, opacity: 0.15, transparent: true })
      );
      interiorGlow.rotation.y = Math.PI;
      interiorGlow.position.set(bay.cx, winY, extZ - 0.025);
      facadeGroup.add(interiorGlow);

      // Heavy limestone window sill
      const sill = new THREE.Mesh(
        new THREE.BoxGeometry(bay.w + 0.14, 0.08, 0.20),
        this.materials.limestonePlinth
      );
      sill.position.set(bay.cx, winY - winH / 2 - 0.03, extZ - 0.05);
      facadeGroup.add(sill);

      // Bronze vertical mullion divider
      const mullion = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, winH - fThick * 2, 0.08),
        this.materials.bronzeMullion
      );
      mullion.position.set(bay.cx, winY, extZ - 0.02);
      facadeGroup.add(mullion);
    });

    // 6. Continuous Limestone Parapet Wall Coping Cap (Y = 3.8m to 3.92m)
    [-2.075, 26.075].forEach((cx, idx) => {
      const w = idx === 0 ? 28.2 : 24.2;
      const coping = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.12, 0.24),
        this.materials.limestonePlinth
      );
      coping.position.set(cx, H + 0.06, extZ - 0.04);
      facadeGroup.add(coping);
    });

    // 7. South Jog (X = 38.0, Z: -9.5 to -8.0) and East Return Brick Facade
    const jogBrick = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, H, 1.62),
      this.materials.exteriorBrick
    );
    jogBrick.position.set(38.06, H / 2, -8.75);
    facadeGroup.add(jogBrick);

    const eastBrick = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, H, 0.12),
      this.materials.exteriorBrick
    );
    eastBrick.position.set(41.1, H / 2, -8.06);
    facadeGroup.add(eastBrick);

    // 8. West Lab Exterior Brick Facade (X = -16.06, Z: -9.5 to +9.5)
    const westBrick = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, H, 19.2),
      this.materials.exteriorBrick
    );
    westBrick.position.set(-16.06, H / 2, 0);
    facadeGroup.add(westBrick);

    this.root.add(facadeGroup);
    this.colliders.push(new THREE.Box3().setFromObject(brickLeft));
    this.colliders.push(new THREE.Box3().setFromObject(brickRight));
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

  // Architectural Glass Partition Wall with Bronze Frame & Base Shoe
  _buildGlassPartitionWall(cx, cz, length, height, orientation = "Z") {
    const group = new THREE.Group();
    group.name = `Glass_Partition_${orientation}_${cx}_${cz}`;

    const isZ = orientation === "Z";
    const glassThickness = 0.04;
    const mullionSize = 0.08;

    // Glass pane geometry
    const glassGeo = isZ
      ? new THREE.BoxGeometry(glassThickness, height, length)
      : new THREE.BoxGeometry(length, height, glassThickness);
    const glassMesh = new THREE.Mesh(glassGeo, this.materials.glass);
    glassMesh.position.set(0, height / 2, 0);
    group.add(glassMesh);

    // Top bronze cap rail / mullion
    const topCapGeo = isZ
      ? new THREE.BoxGeometry(mullionSize, 0.05, length)
      : new THREE.BoxGeometry(length, 0.05, mullionSize);
    const topCap = new THREE.Mesh(topCapGeo, this.materials.bronzeMullion);
    topCap.position.set(0, height, 0);
    group.add(topCap);

    // Base bronze channel shoe
    const baseShoeGeo = isZ
      ? new THREE.BoxGeometry(mullionSize, 0.06, length)
      : new THREE.BoxGeometry(length, 0.06, mullionSize);
    const baseShoe = new THREE.Mesh(baseShoeGeo, this.materials.bronzeMullion);
    baseShoe.position.set(0, 0.03, 0);
    group.add(baseShoe);

    // Vertical end mullion posts
    const postGeo = new THREE.BoxGeometry(mullionSize, height, mullionSize);
    const halfL = length / 2;
    [-halfL, halfL].forEach((offset) => {
      const post = new THREE.Mesh(postGeo, this.materials.bronzeMullion);
      if (isZ) {
        post.position.set(0, height / 2, offset);
      } else {
        post.position.set(offset, height / 2, 0);
      }
      group.add(post);
    });

    group.position.set(cx, 0, cz);
    this.root.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(group));
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

    // 16-Gauge Stainless Steel Kickplates (Front and Back of both leaves)
    const kickGeo = new THREE.BoxGeometry(0.79, 0.25, 0.003);
    [-0.0215, 0.0215].forEach(kz => {
      const kpL = new THREE.Mesh(kickGeo, this.materials.kickplateStainless);
      kpL.position.set(0, 0.135, kz);
      leftDoorGroup.add(kpL);

      const kpR = new THREE.Mesh(kickGeo, this.materials.kickplateStainless);
      kpR.position.set(0, 0.135, kz);
      rightDoorGroup.add(kpR);
    });

    // Overhead Surface-Mounted Heavy-Duty Hydraulic Door Closers
    [-0.495, 0.495].forEach((cxLeaf, leafIdx) => {
      const closerGroup = new THREE.Group();
      closerGroup.position.set(cxLeaf, doorH - 0.06, 0.045);

      const closerBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.065, 0.045),
        this.materials.doorCloserAluminum
      );
      closerGroup.add(closerBody);

      [-0.08, 0.08].forEach(vx => {
        const valve = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.01, 10),
          this.materials.doorCloserAluminum
        );
        valve.position.set(vx, 0, 0.025);
        closerGroup.add(valve);
      });

      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.14, 8),
        this.materials.doorCloserAluminum
      );
      arm.rotation.z = leafIdx === 0 ? 0.4 : -0.4;
      arm.position.set(leafIdx === 0 ? 0.05 : -0.05, 0.05, 0.015);
      closerGroup.add(arm);

      group.add(closerGroup);
    });

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

    // 16-Gauge Stainless Steel Kickplates (Front and Back)
    const kickGeo = new THREE.BoxGeometry(leafW, 0.25, 0.003);
    [-0.0215, 0.0215].forEach(kz => {
      const kp = new THREE.Mesh(kickGeo, this.materials.kickplateStainless);
      kp.position.set(0, 0.135, kz);
      leafGroup.add(kp);
    });

    // Overhead Hydraulic Door Closer
    const closerGroup = new THREE.Group();
    closerGroup.position.set(0, doorH - 0.06, 0.045);
    const closerBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.065, 0.045),
      this.materials.doorCloserAluminum
    );
    closerGroup.add(closerBody);

    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.14, 8),
      this.materials.doorCloserAluminum
    );
    arm.rotation.z = 0.4;
    arm.position.set(0.05, 0.05, 0.015);
    closerGroup.add(arm);
    group.add(closerGroup);

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
    const wallD = 0.32; // Architectural profile depth
    const wingW = 0.52; // Width of fluted walnut side acoustic panels
    const bioW = wallW - wingW * 2; // Central botanical living expanse = 4.16m

    // 1. Heavy Extruded Architectural Bronze Perimeter Frame & Light Canopy
    const frameMat = this.materials.bronzeMullion;
    const borderThick = 0.09;

    // Top Header Canopy with Integrated Recessed Grow-Light Trough
    const topBeam = new THREE.Mesh(
      new THREE.BoxGeometry(wallW, borderThick, wallD + 0.08),
      frameMat
    );
    topBeam.position.set(0, wallH - borderThick / 2, 0.04);
    wallGroup.add(topBeam);

    // Continuous Recessed Botanical LED Grow-Light Strip along Underside of Header
    const topGrowLED = new THREE.Mesh(
      new THREE.BoxGeometry(bioW, 0.015, 0.06),
      new THREE.MeshBasicMaterial({ color: 0xfff6ea })
    );
    topGrowLED.position.set(0, wallH - borderThick - 0.008, 0.12);
    wallGroup.add(topGrowLED);

    // Left and Right Vertical Architectural Bronze Outer Jambs
    [-wallW / 2 + borderThick / 2, wallW / 2 - borderThick / 2].forEach((jx) => {
      const jamb = new THREE.Mesh(
        new THREE.BoxGeometry(borderThick, wallH - borderThick, wallD),
        frameMat
      );
      jamb.position.set(jx, (wallH - borderThick) / 2, 0);
      wallGroup.add(jamb);
    });

    // 2. Fluted American Walnut Acoustic Louver Wings (Left and Right Flanking Portals)
    const walnutMat = this.materials.flutedWalnut;
    const slatW = 0.038;
    const slatD = 0.032;
    const numSlats = 8;
    const slatSpacing = (wingW - 0.08) / (numSlats - 1);

    [-1, 1].forEach((side) => {
      const wingCenterX = side * (wallW / 2 - borderThick - wingW / 2);
      const wingGroup = new THREE.Group();
      wingGroup.position.set(wingCenterX, 0, 0);

      // Recessed Backing Board in Walnut
      const wingBack = new THREE.Mesh(
        new THREE.BoxGeometry(wingW, wallH - borderThick * 2, 0.025),
        walnutMat
      );
      wingBack.position.set(0, wallH / 2, -wallD / 2 + 0.02);
      wingGroup.add(wingBack);

      // Vertical 3D Fluted Timber Battens creating architectural shadow lines
      for (let s = 0; s < numSlats; s++) {
        const sx = -wingW / 2 + 0.04 + s * slatSpacing;
        const slat = new THREE.Mesh(
          new THREE.BoxGeometry(slatW, wallH - borderThick * 2 - 0.02, slatD),
          walnutMat
        );
        slat.position.set(sx, wallH / 2, -wallD / 2 + 0.045);
        slat.castShadow = true;
        wingGroup.add(slat);
      }

      // Vertical Grazing Warm LED Light Strip in Shadow Reveal Channel
      const ledChannel = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, wallH - borderThick * 2 - 0.10, 0.01),
        new THREE.MeshBasicMaterial({ color: 0xffeedb })
      );
      ledChannel.position.set(side * (wingW / 2 - 0.025), wallH / 2, -wallD / 2 + 0.055);
      wingGroup.add(ledChannel);

      wallGroup.add(wingGroup);
    });

    // 3. Base Irrigation Catch-Basin Trough (Charcoal Basalt Stone & Stainless Overflow Rim)
    const troughH = 0.28;
    const troughD = 0.42;
    const trough = new THREE.Mesh(
      new THREE.BoxGeometry(bioW, troughH, troughD),
      this.materials.charcoalConcrete
    );
    trough.position.set(0, troughH / 2, troughD / 2 - wallD / 2);
    wallGroup.add(trough);

    // Brushed Stainless Steel Perimeter Rim & Overflow Weir Lip
    const rim = new THREE.Mesh(
      new THREE.BoxGeometry(bioW + 0.04, 0.025, troughD + 0.04),
      this.materials.cabinetHandle
    );
    rim.position.set(0, troughH + 0.012, troughD / 2 - wallD / 2);
    wallGroup.add(rim);

    // Concealed Under-Lip Warm LED Strip illuminating river stones below
    const underLipLED = new THREE.Mesh(
      new THREE.BoxGeometry(bioW - 0.06, 0.01, 0.015),
      new THREE.MeshBasicMaterial({ color: 0xffe8cc })
    );
    underLipLED.position.set(0, troughH + 0.005, troughD - wallD / 2 + 0.01);
    wallGroup.add(underLipLED);

    // 3D Polished River Pebbles Bed (Basalt, River Slate, Tumbled River Quartzite)
    const pebbleGeo = new THREE.SphereGeometry(0.042, 8, 6);
    for (let p = 0; p < 75; p++) {
      const px = -((bioW - 0.20) / 2) + Math.random() * (bioW - 0.20);
      const pz = -wallD / 2 + 0.08 + Math.random() * (troughD - 0.12);
      const peb = new THREE.Mesh(pebbleGeo, this.materials.riverPebble);
      peb.position.set(px, troughH + 0.028, pz);
      peb.scale.set(0.7 + Math.random() * 0.7, 0.40 + Math.random() * 0.35, 0.7 + Math.random() * 0.7);
      peb.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      wallGroup.add(peb);
    }

    // 4. Hydroponic Modular Cassette Substrate & Continuous Velvet Moss Understory
    const backPanH = wallH - borderThick - troughH;
    const substrateY = troughH + backPanH / 2;

    // Dark cellular cassette backing felt
    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(bioW, backPanH, 0.04),
      this.materials.corkBark
    );
    backing.position.set(0, substrateY, -wallD / 2 + 0.03);
    wallGroup.add(backing);

    // Continuous Deep Forest Velvet Moss Mattress Base (100% gapless coverage)
    const mossMattress = new THREE.Mesh(
      new THREE.BoxGeometry(bioW, backPanH, 0.06),
      this.materials.botanicalVelvetMossDeep
    );
    mossMattress.position.set(0, substrateY, -wallD / 2 + 0.05);
    wallGroup.add(mossMattress);

    // Architectural Natural Virgin Cork Bark Columns (Creating biological habitat niches)
    [-1.3, 0.0, 1.3].forEach((cx, idx) => {
      const barkW = 0.32 + (idx % 2) * 0.12;
      const bark = new THREE.Mesh(
        new THREE.BoxGeometry(barkW, backPanH * 0.95, 0.08),
        this.materials.corkBark
      );
      bark.position.set(cx, substrateY, -wallD / 2 + 0.08);
      wallGroup.add(bark);
    });

    // 5. High-Density Organic Botanical Moss Topography (Interlocking Cushions)
    const mossMats = [
      this.materials.botanicalVelvetMossDeep,
      this.materials.botanicalVelvetMossEmerald,
      this.materials.botanicalVelvetMossChartreuse
    ];
    const baseSphereGeo = new THREE.SphereGeometry(1.0, 10, 8);

    // 140 Clustered Organic Moss Hummocks with natural overlapping contours
    for (let m = 0; m < 140; m++) {
      const mx = -((bioW - 0.28) / 2) + Math.random() * (bioW - 0.28);
      const my = troughH + 0.15 + Math.random() * (backPanH - 0.30);
      const radius = 0.12 + Math.random() * 0.22;
      const mat = mossMats[Math.floor(Math.random() * mossMats.length)];

      const hummock = new THREE.Mesh(baseSphereGeo, mat);
      // Flattened organic convex profile hugging the vertical substrate
      hummock.scale.set(radius, radius * 0.95, radius * 0.38);
      hummock.position.set(mx, my, -wallD / 2 + 0.07 + radius * 0.25);
      hummock.rotation.set(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        Math.random() * Math.PI
      );
      wallGroup.add(hummock);
    }

    // 6. Architectural Fern Colonies (Nephrolepis exaltata & Polystichum munitum)
    const fernMat = this.materials.botanicalFernFrond;
    const fernLocs = [
      [-1.6, 1.2], [-1.2, 2.1], [-0.8, 0.7], [-0.4, 1.7],
      [0.0, 2.4], [0.3, 0.9], [0.7, 1.8], [1.1, 1.1],
      [1.5, 2.3], [1.7, 0.8], [-1.4, 1.6], [0.9, 2.0]
    ];

    fernLocs.forEach(([fx, fy]) => {
      const fernCluster = new THREE.Group();
      fernCluster.position.set(fx, troughH + fy, -wallD / 2 + 0.12);

      const numFronds = 6 + Math.floor(Math.random() * 3);
      for (let s = 0; s < numFronds; s++) {
        const frondGroup = new THREE.Group();
        const spreadAngle = ((s - numFronds / 2) / numFronds) * 1.5;
        frondGroup.rotation.y = spreadAngle + (Math.random() - 0.5) * 0.3;
        frondGroup.rotation.x = 0.25 + Math.random() * 0.35; // Arching outward from wall

        const stemLen = 0.35 + Math.random() * 0.20;
        // Central tapering rachis
        const rachis = new THREE.Mesh(
          new THREE.CylinderGeometry(0.002, 0.005, stemLen, 6),
          fernMat
        );
        rachis.position.set(0, -stemLen / 2, stemLen * 0.32);
        rachis.rotation.x = -Math.PI / 4.2;
        frondGroup.add(rachis);

        // Pairs of alternating pinnae (leaflets) along the frond
        const numPinnae = 9;
        for (let p = 0; p < numPinnae; p++) {
          const frac = p / numPinnae;
          const pinnaLen = (1.0 - frac * 0.45) * 0.075;
          const pinnaW = 0.018;

          [-1, 1].forEach((side) => {
            const leaflet = new THREE.Mesh(
              new THREE.PlaneGeometry(pinnaLen, pinnaW),
              fernMat
            );
            leaflet.position.set(
              side * (pinnaLen / 2 + 0.003),
              -frac * stemLen * 0.72,
              frac * stemLen * 0.32
            );
            leaflet.rotation.z = side * 0.28;
            leaflet.rotation.y = side * 0.15;
            frondGroup.add(leaflet);
          });
        }
        fernCluster.add(frondGroup);
      }
      wallGroup.add(fernCluster);
    });

    // 7. Cascading Golden Pothos & Philodendron Vines (Draping over Catch Basin Lip)
    const pothosMat = this.materials.pothosVariegated;
    const vineLocs = [
      [-1.8, 1.8, 0.55], [-1.5, 0.85, 0.75], [-1.0, 1.5, 0.60],
      [-0.6, 0.55, 0.70], [-0.2, 1.9, 0.50], [0.2, 0.75, 0.85],
      [0.6, 1.6, 0.60], [1.0, 0.60, 0.75], [1.4, 1.8, 0.55],
      [1.7, 0.70, 0.80], [-0.9, 2.3, 0.45], [0.8, 2.2, 0.50]
    ];

    vineLocs.forEach(([vx, vy, vineLen]) => {
      const vineGroup = new THREE.Group();
      vineGroup.position.set(vx, troughH + vy, -wallD / 2 + 0.14);

      // Main flexible vine stem
      const vineStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.004, vineLen, 6),
        pothosMat
      );
      vineStem.position.set(0, -vineLen / 2, 0.06);
      vineGroup.add(vineStem);

      // Trailing cordate leaves with natural tilt and alternating phyllotaxy
      const numLeaves = Math.floor(vineLen * 18);
      for (let l = 0; l < numLeaves; l++) {
        const lf = new THREE.Group();
        const frac = l / numLeaves;
        const side = l % 2 === 0 ? 1 : -1;
        lf.position.set(
          side * 0.025,
          -frac * vineLen,
          0.06 + Math.sin(frac * Math.PI) * 0.04
        );
        lf.rotation.set(
          0.4 + Math.random() * 0.35,
          side * 0.35 + (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.3
        );

        // Cordate leaf blade geometry
        const leafBlade = new THREE.Mesh(
          new THREE.ConeGeometry(0.042, 0.088, 5),
          pothosMat
        );
        leafBlade.rotation.x = Math.PI;
        leafBlade.scale.set(1.15, 1.0, 0.18);
        lf.add(leafBlade);
        vineGroup.add(lf);
      }
      wallGroup.add(vineGroup);
    });

    // 8. Calathea Orbifolia Statement Broadleaf Clumps (Large Exotic Foliage)
    const calatheaMat = this.materials.botanicalCalathea;
    const calatheaLocs = [
      [-1.1, 1.4], [-0.5, 2.0], [0.4, 1.3], [1.2, 1.9], [-0.2, 0.9], [1.6, 1.4]
    ];

    calatheaLocs.forEach(([cx, cy]) => {
      const clump = new THREE.Group();
      clump.position.set(cx, troughH + cy, -wallD / 2 + 0.13);

      const numLeaves = 4 + Math.floor(Math.random() * 2);
      for (let i = 0; i < numLeaves; i++) {
        const leafGrp = new THREE.Group();
        const ang = ((i - numLeaves / 2) / numLeaves) * 1.8;
        leafGrp.rotation.y = ang;
        leafGrp.rotation.x = 0.35 + Math.random() * 0.3;

        // Slender petiole
        const petiole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.003, 0.005, 0.22, 6),
          calatheaMat
        );
        petiole.position.set(0, 0.10, 0.05);
        petiole.rotation.x = 0.25;
        leafGrp.add(petiole);

        // Broad rounded elliptical blade
        const blade = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 8, 6),
          calatheaMat
        );
        blade.scale.set(1.1, 1.4, 0.12);
        blade.position.set(0, 0.22, 0.09);
        blade.rotation.x = 0.2;
        leafGrp.add(blade);

        clump.add(leafGrp);
      }
      wallGroup.add(clump);
    });

    // 9. Overhead Articulated High-CRI LED Spotlight Canisters
    const trackY = wallH + 0.05;
    const trackRail = new THREE.Mesh(
      new THREE.BoxGeometry(bioW + 0.6, 0.035, 0.045),
      this.materials.bronzeMullion
    );
    trackRail.position.set(0, trackY, 0.24);
    wallGroup.add(trackRail);

    [-1.6, -0.8, 0, 0.8, 1.6].forEach((lx) => {
      const spotArm = new THREE.Group();
      spotArm.position.set(lx, trackY - 0.02, 0.24);

      const knuckle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.03, 8),
        this.materials.cabinetHandle
      );
      spotArm.add(knuckle);

      const canister = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.044, 0.10, 16),
        this.materials.bronzeMullion
      );
      canister.rotation.x = -Math.PI / 3.2; // Aimed down at living wall foliage
      canister.position.set(0, -0.05, -0.04);
      spotArm.add(canister);

      const lens = new THREE.Mesh(
        new THREE.CircleGeometry(0.034, 16),
        new THREE.MeshBasicMaterial({ color: 0xfff6ea })
      );
      lens.rotation.x = Math.PI / 5.8;
      lens.position.set(0, -0.088, -0.065);
      spotArm.add(lens);

      wallGroup.add(spotArm);
    });

    // 10. Dedicated Digital Telemetry & IAQ Environmental Monitoring Panel
    // Mounted in a flush bevel on the right walnut fluted wing (X = 2.15, Y = 1.55)
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(wallW / 2 - borderThick - wingW / 2, 1.55, -wallD / 2 + 0.075);

    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.50, 0.02),
      this.materials.architecturalBlackMetal
    );
    monitorGroup.add(bezel);

    const monCanvas = document.createElement("canvas");
    monCanvas.width = 360;
    monCanvas.height = 500;
    const mCtx = monCanvas.getContext("2d");
    mCtx.fillStyle = "#0c1017";
    mCtx.fillRect(0, 0, 360, 500);

    // Bezel accent header
    mCtx.fillStyle = "#1e293b";
    mCtx.fillRect(10, 10, 340, 60);
    mCtx.fillStyle = "#3dd68c";
    mCtx.font = "bold 16px 'IBM Plex Sans', sans-serif";
    mCtx.fillText("SRE BIOPHILIC HORTICULTURE", 20, 38);
    mCtx.fillStyle = "#94a3b8";
    mCtx.font = "12px 'IBM Plex Mono', monospace";
    mCtx.fillText("SYSTEM STATUS: ONLINE / HEALTHY", 20, 58);

    // Sensor Telemetry Cards
    const stats = [
      { label: "SUBSTRATE MOISTURE", val: "78.4%", stat: "OPTIMAL", col: "#3dd68c" },
      { label: "AMBIENT HUMIDITY", val: "62.1% RH", stat: "STABLE", col: "#38bdf8" },
      { label: "IRRIGATION CYCLE", val: "ACTIVE", stat: "2.4 L/DAY", col: "#facc15" },
      { label: "VOC ABSORPTION", val: "96.2%", stat: "IAQ GRADE A", col: "#a78bfa" }
    ];

    stats.forEach((st, i) => {
      const cy = 90 + i * 95;
      mCtx.fillStyle = "#141a23";
      mCtx.fillRect(15, cy, 330, 80);
      mCtx.strokeStyle = "#334155";
      mCtx.lineWidth = 1;
      mCtx.strokeRect(15, cy, 330, 80);

      mCtx.fillStyle = "#64748b";
      mCtx.font = "bold 11px 'IBM Plex Sans', sans-serif";
      mCtx.fillText(st.label, 26, cy + 24);

      mCtx.fillStyle = st.col;
      mCtx.font = "bold 24px 'IBM Plex Mono', monospace";
      mCtx.fillText(st.val, 26, cy + 54);

      mCtx.fillStyle = "#94a3b8";
      mCtx.font = "11px 'IBM Plex Mono', monospace";
      mCtx.textAlign = "right";
      mCtx.fillText(st.stat, 330, cy + 54);
      mCtx.textAlign = "left";
    });

    const monTex = new THREE.CanvasTexture(monCanvas);
    const monScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.33, 0.47),
      new THREE.MeshBasicMaterial({ map: monTex })
    );
    monScreen.position.set(0, 0, 0.012);
    monitorGroup.add(monScreen);

    wallGroup.add(monitorGroup);

    // 11. Etched Architectural Bronze Plaque Centered on Upper Header
    const plaqueGroup = new THREE.Group();
    plaqueGroup.position.set(0, wallH - borderThick / 2 - 0.14, 0.18);

    const plaqueBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.26, 0.015),
      this.materials.cabinetHandle
    );
    plaqueGroup.add(plaqueBase);

    const plCanvas = document.createElement("canvas");
    plCanvas.width = 1024;
    plCanvas.height = 130;
    const plCtx = plCanvas.getContext("2d");
    plCtx.fillStyle = "#0c1017";
    plCtx.fillRect(0, 0, 1024, 130);
    plCtx.strokeStyle = "#d4af37";
    plCtx.lineWidth = 4;
    plCtx.strokeRect(8, 8, 1008, 114);
    plCtx.fillStyle = "#f1f5f9";
    plCtx.font = "bold 24px 'IBM Plex Sans', sans-serif";
    plCtx.textAlign = "center";
    plCtx.fillText("CHEMMATE BIOTECHNOLOGY · ARCHITECTURAL LIVING BIO-WALL", 512, 52);
    plCtx.font = "17px 'IBM Plex Mono', monospace";
    plCtx.fillStyle = "#3dd68c";
    plCtx.fillText("MULTI-SPECIES HYDROPONIC ECOSYSTEM · VOC CLEANSING & OXYGENATION", 512, 92);

    const plTex = new THREE.CanvasTexture(plCanvas);
    const plScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.46, 0.24),
      new THREE.MeshBasicMaterial({ map: plTex })
    );
    plScreen.position.set(0, 0, 0.009);
    plaqueGroup.add(plScreen);

    wallGroup.add(plaqueGroup);

    // 12. Drip Irrigation Riser & Brass Manifold with Analog Dial Gauge
    const irriGroup = new THREE.Group();
    irriGroup.position.set(wallW / 2 - borderThick - 0.08, troughH / 2 + 0.18, -wallD / 2 + 0.12);

    const riser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.48, 12),
      this.materials.cabinetHandle
    );
    irriGroup.add(riser);

    const valve = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.035, 0.045),
      new THREE.MeshStandardMaterial({ color: 0xb48a3c, roughness: 0.3, metalness: 0.8 })
    );
    valve.position.y = 0.12;
    irriGroup.add(valve);

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

    // 7. Executive Granite Paver Pedestrian Promenade & Walkway Network ("Wallks")
    // Main North-South Axial Promenade (X = 13.0, Z: -14.0 to -9.5, Width: 4.8m)
    const walkGeo = new THREE.BoxGeometry(4.8, 0.08, 4.5);
    const walkway = new THREE.Mesh(walkGeo, this.materials.exteriorPaver);
    walkway.position.set(13.0, 0.04, -11.75);
    walkway.receiveShadow = true;
    siteGroup.add(walkway);

    // Flanking Granite Curbs for Main Promenade (Left & Right)
    [-2.45, 2.45].forEach((cx) => {
      const curb = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.12, 4.5),
        this.materials.limestonePlinth
      );
      curb.position.set(13.0 + cx, 0.06, -11.75);
      siteGroup.add(curb);
    });

    // ADA Truncated-Dome Tactile Warning Paver Tile Strip at Parking Lot Transition (Z = -13.85)
    const adaTile = new THREE.Mesh(
      new THREE.BoxGeometry(4.76, 0.015, 0.60),
      this.materials.adaTactileYellow
    );
    adaTile.position.set(13.0, 0.088, -13.85);
    siteGroup.add(adaTile);

    // Continuous East-West Executive Sidewalks connecting building perimeter
    // West Connecting Sidewalk (X: -18.0 to 10.6, Width: 1.4m, Z: -10.3)
    const westWalk = new THREE.Mesh(
      new THREE.BoxGeometry(28.6, 0.08, 1.4),
      this.materials.exteriorPaver
    );
    westWalk.position.set(-3.7, 0.04, -10.3);
    westWalk.receiveShadow = true;
    siteGroup.add(westWalk);

    // East Connecting Sidewalk (X: 15.4 to 42.0, Width: 1.4m, Z: -10.3)
    const eastWalk = new THREE.Mesh(
      new THREE.BoxGeometry(26.6, 0.08, 1.4),
      this.materials.exteriorPaver
    );
    eastWalk.position.set(28.7, 0.04, -10.3);
    eastWalk.receiveShadow = true;
    siteGroup.add(eastWalk);

    // Granite Curbs on Landscape Edge of East-West Sidewalks
    const westCurb = new THREE.Mesh(
      new THREE.BoxGeometry(28.6, 0.10, 0.14),
      this.materials.limestonePlinth
    );
    westCurb.position.set(-3.7, 0.05, -11.07);
    siteGroup.add(westCurb);

    const eastCurb = new THREE.Mesh(
      new THREE.BoxGeometry(26.6, 0.10, 0.14),
      this.materials.limestonePlinth
    );
    eastCurb.position.set(28.7, 0.05, -11.07);
    siteGroup.add(eastCurb);

    // 8. Architectural Landscape Mulch Beds Flanking Promenade & Building Front
    // West Deep Mulch Bed (X: -18.0 to 10.5, Z: -14.0 to -11.1)
    const westMulch = new THREE.Mesh(
      new THREE.BoxGeometry(28.5, 0.06, 2.9),
      this.materials.mulchBed
    );
    westMulch.position.set(-3.75, 0.02, -12.55);
    westMulch.receiveShadow = true;
    siteGroup.add(westMulch);

    // East Deep Mulch Bed (X: 15.5 to 42.0, Z: -14.0 to -11.1)
    const eastMulch = new THREE.Mesh(
      new THREE.BoxGeometry(26.5, 0.06, 2.9),
      this.materials.mulchBed
    );
    eastMulch.position.set(28.75, 0.02, -12.55);
    eastMulch.receiveShadow = true;
    siteGroup.add(eastMulch);

    // 9. Multi-Stem Heritage River Birch Trees (Betula nigra) in Corten Planters with Cast-Iron Grates
    const birchPositions = [10.2, 15.8, 24.0, 36.0];
    birchPositions.forEach((tx) => {
      const birchGroup = new THREE.Group();
      birchGroup.position.set(tx, 0, -12.4);

      // A. Square Weathered Corten Steel Planter Frame (1.8m x 1.8m)
      const planterFrame = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.16, 1.8),
        this.materials.cortenSteel
      );
      planterFrame.position.y = 0.08;
      birchGroup.add(planterFrame);

      // B. Architectural Slotted Radial Cast-Iron Tree Grate (1.6m x 1.6m)
      const grate = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.02, 1.6),
        this.materials.castIronGrate
      );
      grate.position.y = 0.165;
      birchGroup.add(grate);

      // Center Aeration Soil Core
      const soilCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.04, 16),
        this.materials.mulchBed
      );
      soilCore.position.y = 0.16;
      birchGroup.add(soilCore);

      // C. True Multi-Stem Clump Habit (3 Diverging Trunks with Procedural Birch Bark)
      // Main Arching Trunk
      const trunk1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.095, 3.6, 14),
        this.materials.birchBark
      );
      trunk1.position.set(0.02, 1.95, 0.02);
      trunk1.rotation.set(0.06, 0.04, -0.05);
      trunk1.castShadow = true;
      birchGroup.add(trunk1);

      // Secondary Diverging Trunk (Leaning West)
      const trunk2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.048, 0.075, 3.1, 12),
        this.materials.birchBark
      );
      trunk2.position.set(-0.16, 1.70, -0.06);
      trunk2.rotation.set(-0.10, 0.12, 0.22);
      trunk2.castShadow = true;
      birchGroup.add(trunk2);

      // Tertiary Diverging Trunk (Leaning East/South)
      const trunk3 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.065, 2.7, 12),
        this.materials.birchBark
      );
      trunk3.position.set(0.14, 1.50, 0.10);
      trunk3.rotation.set(0.16, -0.08, -0.18);
      trunk3.castShadow = true;
      birchGroup.add(trunk3);

      // Structural Secondary Boughs & Limbs
      const boughMat = this.materials.birchBark;
      [
        { x: -0.22, y: 3.1, z: 0.15, rx: 0.35, rz: 0.55, len: 1.1, r: 0.032 },
        { x: 0.18, y: 3.3, z: -0.12, rx: -0.25, rz: -0.45, len: 1.2, r: 0.035 },
        { x: 0.05, y: 3.7, z: 0.22, rx: 0.40, rz: -0.20, len: 0.95, r: 0.028 }
      ].forEach((b) => {
        const bough = new THREE.Mesh(
          new THREE.CylinderGeometry(b.r * 0.6, b.r, b.len, 8),
          boughMat
        );
        bough.position.set(b.x, b.y, b.z);
        bough.rotation.set(b.rx, 0, b.rz);
        bough.castShadow = true;
        birchGroup.add(bough);
      });

      // D. Multi-Layered Weeping Birch Canopy (Tiered Natural Foliage Volumes)
      const leafLayers = [
        // Lower Weeping Tier
        { y: 3.0, r: 0.72, xOff: -0.42, zOff: 0.20, scZ: 0.85 },
        { y: 3.2, r: 0.78, xOff: 0.38, zOff: -0.30, scZ: 0.90 },
        { y: 3.4, r: 0.85, xOff: 0.10, zOff: 0.45, scZ: 0.95 },
        // Mid Spreading Canopy
        { y: 3.9, r: 0.95, xOff: -0.25, zOff: -0.15, scZ: 1.05 },
        { y: 4.1, r: 1.10, xOff: 0.20, zOff: 0.10, scZ: 1.10 },
        { y: 4.3, r: 0.90, xOff: -0.35, zOff: 0.30, scZ: 0.95 },
        // Upper Crown Summit
        { y: 4.8, r: 0.85, xOff: 0.05, zOff: -0.10, scZ: 0.90 },
        { y: 5.3, r: 0.65, xOff: 0.02, zOff: 0.05, scZ: 0.80 }
      ];

      leafLayers.forEach((layer) => {
        const foliage = new THREE.Mesh(
          new THREE.DodecahedronGeometry(layer.r, 2),
          this.materials.treeLeaves
        );
        foliage.scale.set(1.0, 0.85, layer.scZ);
        foliage.position.set(layer.xOff, layer.y, layer.zOff);
        foliage.rotation.set(
          (Math.random() - 0.5) * 0.4,
          Math.random() * Math.PI,
          (Math.random() - 0.5) * 0.4
        );
        foliage.castShadow = true;
        birchGroup.add(foliage);
      });

      siteGroup.add(birchGroup);
    });

    // 10. Sculptural Japanese Bloodgood Red Maples (Acer palmatum 'Bloodgood')
    // Sited as signature focal specimens in the landscape beds
    const maplePositions = [
      { x: -5.0, z: -12.4, sc: 1.0 },
      { x: 3.5, z: -12.4, sc: 1.05 },
      { x: 30.0, z: -12.4, sc: 0.95 }
    ];

    maplePositions.forEach((mp) => {
      const mapleGroup = new THREE.Group();
      mapleGroup.position.set(mp.x, 0, mp.z);

      // Gnarled, Sinuous Dark Bark Trunk
      const trunkMat = this.materials.treeTrunk;
      const lowerTrunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.12, 1.1, 10),
        trunkMat
      );
      lowerTrunk.position.set(0, 0.55, 0);
      lowerTrunk.rotation.z = -0.12;
      lowerTrunk.castShadow = true;
      mapleGroup.add(lowerTrunk);

      // Low Scaffold Branches (Sweeping Graceful Horizontal Habitus)
      [
        { x: -0.45, y: 1.35, z: 0.15, rx: 0.25, rz: 0.70, len: 1.2, r: 0.05 },
        { x: 0.50, y: 1.45, z: -0.18, rx: -0.20, rz: -0.65, len: 1.3, r: 0.052 },
        { x: 0.05, y: 1.80, z: 0.35, rx: 0.60, rz: 0.15, len: 1.0, r: 0.042 }
      ].forEach((sb) => {
        const branch = new THREE.Mesh(
          new THREE.CylinderGeometry(sb.r * 0.5, sb.r, sb.len, 8),
          trunkMat
        );
        branch.position.set(sb.x, sb.y, sb.z);
        branch.rotation.set(sb.rx, 0, sb.rz);
        branch.castShadow = true;
        mapleGroup.add(branch);
      });

      // Layered Horizontal Foliage Clouds (Crimson/Burgundy Bloodgood Foliage)
      const mapleLeavesMat = this.materials.japaneseMapleLeaf;
      const cloudPads = [
        { x: -0.95, y: 1.8, z: 0.25, rx: 0.75, rz: 0.65, ry: 0.32 },
        { x: 0.95, y: 1.9, z: -0.30, rx: 0.85, rz: 0.70, ry: 0.34 },
        { x: -0.40, y: 2.2, z: -0.45, rx: 0.70, rz: 0.60, ry: 0.30 },
        { x: 0.35, y: 2.4, z: 0.40, rx: 0.80, rz: 0.68, ry: 0.32 },
        { x: 0.0, y: 2.8, z: 0.0, rx: 0.90, rz: 0.80, ry: 0.36 },
        { x: 0.1, y: 3.2, z: -0.1, rx: 0.65, rz: 0.55, ry: 0.28 }
      ];

      cloudPads.forEach((cp) => {
        const cloud = new THREE.Mesh(
          new THREE.DodecahedronGeometry(1.0, 2),
          mapleLeavesMat
        );
        // Flattened cloud shape characteristic of Japanese maple niwaki pruning
        cloud.scale.set(cp.rx * mp.sc, cp.ry * mp.sc, cp.rz * mp.sc);
        cloud.position.set(cp.x * mp.sc, cp.y * mp.sc, cp.z * mp.sc);
        cloud.castShadow = true;
        mapleGroup.add(cloud);
      });

      siteGroup.add(mapleGroup);
    });

    // 11. Architectural Contoured Teak Wood & Charcoal Steel Campus Benches (4 Units)
    const benchPositions = [
      { x: 11.2, z: -10.8, rotY: Math.PI / 2 },  // West side of promenade facing East
      { x: 14.8, z: -10.8, rotY: -Math.PI / 2 }, // East side of promenade facing West
      { x: 20.0, z: -10.2, rotY: 0 },            // East sidewalk alcove facing South
      { x: 32.0, z: -10.2, rotY: 0 }             // East campus promenade facing South
    ];

    benchPositions.forEach((bp) => {
      const bench = new THREE.Group();
      bench.position.set(bp.x, 0.04, bp.z);
      bench.rotation.y = bp.rotY;

      const benchL = 1.80; // 6-foot executive park bench
      const teakMat = this.materials.teakWood;
      const steelMat = this.materials.architecturalBlackMetal;

      // Solid Teak Wood Contoured Seat Slats (6 Longitudinal Slats)
      for (let s = 0; s < 6; s++) {
        const slat = new THREE.Mesh(
          new THREE.BoxGeometry(benchL, 0.024, 0.055),
          teakMat
        );
        // Subtle ergonomic curve
        slat.position.set(0, 0.44 + Math.sin(s * 0.3) * 0.02, -0.18 + s * 0.065);
        slat.castShadow = true;
        bench.add(slat);
      }

      // Solid Teak Wood Curved Backrest Slats (5 Slats with Rake)
      for (let b = 0; b < 5; b++) {
        const bSlat = new THREE.Mesh(
          new THREE.BoxGeometry(benchL, 0.055, 0.024),
          teakMat
        );
        bSlat.position.set(0, 0.54 + b * 0.062, -0.22 - b * 0.025);
        bSlat.rotation.x = -0.22; // Comfortable lumbar rake
        bSlat.castShadow = true;
        bench.add(bSlat);
      }

      // Laser-Cut Charcoal Steel Side Stanchions & Armrests
      [-benchL / 2 + 0.12, benchL / 2 - 0.12].forEach((sx) => {
        // Leg Stanchion
        const leg = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, 0.45, 0.48),
          steelMat
        );
        leg.position.set(sx, 0.225, 0.0);
        bench.add(leg);

        // Curved Armrest Loop
        const arm = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, 0.24, 0.42),
          steelMat
        );
        arm.position.set(sx, 0.56, -0.05);
        bench.add(arm);

        // Stainless Anchor Base Foot
        const foot = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.015, 0.52),
          this.materials.cabinetHandle
        );
        foot.position.set(sx, 0.008, 0.0);
        bench.add(foot);
      });

      siteGroup.add(bench);
    });

    // 12. Illuminated Marine-Grade Stainless Steel Pathway Bollards (8 Units)
    const bollardCoords = [
      { x: 10.4, z: -10.0 }, { x: 15.6, z: -10.0 },
      { x: 10.4, z: -11.2 }, { x: 15.6, z: -11.2 },
      { x: 10.4, z: -12.4 }, { x: 15.6, z: -12.4 },
      { x: 10.4, z: -13.6 }, { x: 15.6, z: -13.6 }
    ];

    bollardCoords.forEach((bc) => {
      const bollard = new THREE.Group();
      bollard.position.set(bc.x, 0.04, bc.z);

      // Stainless Steel Column (H = 0.95m, D = 0.14m)
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.95, 18),
        this.materials.cabinetHandle
      );
      post.position.y = 0.475;
      post.castShadow = true;
      bollard.add(post);

      // Recessed 360° Optical Louver Window with Warm Emissive LED Ring
      const louverRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.068, 0.068, 0.08, 18),
        this.materials.bollardLED
      );
      louverRing.position.y = 0.85;
      bollard.add(louverRing);

      // Flat Marine Cap
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.076, 0.076, 0.025, 18),
        this.materials.cabinetHandle
      );
      cap.position.y = 0.96;
      bollard.add(cap);

      // Downward Pathway Ground Light Pool
      const bollardLight = new THREE.PointLight(0xfffaed, 0.35, 3.2, 1.5);
      bollardLight.position.set(0, 0.84, 0);
      bollard.add(bollardLight);

      siteGroup.add(bollard);
    });

    // 13. Commercial Stainless Dual-Stream Recycling & Waste Receptacles (2 Units)
    [-1, 1].forEach((side) => {
      const canGroup = new THREE.Group();
      canGroup.position.set(13.0 + side * 1.9, 0.04, -13.2);

      // Dual Cabinet Body
      const canBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.95, 0.44),
        this.materials.cabinetHandle
      );
      canBody.position.y = 0.475;
      canBody.castShadow = true;
      canGroup.add(canBody);

      // Dual Aperture Bezels (Recycle Blue & Landfill Charcoal)
      const recLid = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.04, 0.38),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
      );
      recLid.position.set(-0.20, 0.96, 0);
      canGroup.add(recLid);

      const trashLid = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.04, 0.38),
        this.materials.architecturalBlackMetal
      );
      trashLid.position.set(0.20, 0.96, 0);
      canGroup.add(trashLid);

      siteGroup.add(canGroup);
    });

    // 14. Stainless Steel Inverted-U Bicycle Parking Racks (4 Racks)
    [-1.2, -0.4, 0.4, 1.2].forEach((offsetZ) => {
      const bikeRack = new THREE.Group();
      bikeRack.position.set(9.2, 0.04, -12.0 + offsetZ);

      // Inverted-U Stainless Tube
      const legL = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.85, 12),
        this.materials.cabinetHandle
      );
      legL.position.set(-0.35, 0.425, 0);
      bikeRack.add(legL);

      const legR = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.85, 12),
        this.materials.cabinetHandle
      );
      legR.position.set(0.35, 0.425, 0);
      bikeRack.add(legR);

      const topBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.70, 0.05, 0.05),
        this.materials.cabinetHandle
      );
      topBar.position.set(0, 0.85, 0);
      bikeRack.add(topBar);

      siteGroup.add(bikeRack);
    });

    // 15. Cantilevered Architectural Glass & Steel Entrance Portico Canopy
    // Spanning main entrance portal at X = 13.0, Z = -9.5, Y = 3.65m
    const canopyGroup = new THREE.Group();
    canopyGroup.name = "Architectural_Portico_Canopy";
    canopyGroup.position.set(13.0, 3.65, -9.5);

    const canopyW = 5.4;
    const canopyD = 2.4;

    // Heavy Structural Charcoal Steel Outriggers (3 Cantilever Beams)
    [-canopyW / 2 + 0.3, 0, canopyW / 2 - 0.3].forEach((bx) => {
      const outrigger = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.18, canopyD),
        this.materials.architecturalBlackMetal
      );
      outrigger.position.set(bx, 0, -canopyD / 2);
      canopyGroup.add(outrigger);

      // High-Tensile Stainless Steel Tension Tie-Back Rod
      const tieRod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 1.8, 8),
        this.materials.cabinetHandle
      );
      tieRod.position.set(bx, 0.65, -canopyD * 0.7);
      tieRod.rotation.x = 0.55; // Angled back up to upper brick wall anchor
      canopyGroup.add(tieRod);
    });

    // Outer Structural Steel Perimeter Fascia Frame
    const frameFascia = new THREE.Mesh(
      new THREE.BoxGeometry(canopyW, 0.12, 0.08),
      this.materials.architecturalBlackMetal
    );
    frameFascia.position.set(0, 0, -canopyD);
    canopyGroup.add(frameFascia);

    // Laminated Safety Glass Roof Panel
    const glassRoof = new THREE.Mesh(
      new THREE.BoxGeometry(canopyW - 0.08, 0.02, canopyD - 0.08),
      this.materials.reflectiveExteriorGlass
    );
    glassRoof.position.set(0, 0.06, -canopyD / 2);
    canopyGroup.add(glassRoof);

    // 4 Warm Recessed LED Downlight Fixtures illuminating the grand entrance
    [-1.6, -0.5, 0.5, 1.6].forEach((dx) => {
      const downlight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.065, 0.02, 16),
        new THREE.MeshBasicMaterial({ color: 0xfff3e0 })
      );
      downlight.position.set(dx, -0.06, -canopyD * 0.5);
      canopyGroup.add(downlight);

      const dLight = new THREE.PointLight(0xfff1dc, 0.85, 7.5, 1.3);
      dLight.position.set(dx, -0.15, -canopyD * 0.5);
      canopyGroup.add(dLight);
    });

    // Dimensional Architectural Entrance Signage on Brick Wall above Canopy
    const bldSignGroup = new THREE.Group();
    bldSignGroup.position.set(0, 0.65, -0.05);

    const bldCanvas = document.createElement("canvas");
    bldCanvas.width = 1024;
    bldCanvas.height = 140;
    const bCtx = bldCanvas.getContext("2d");
    bCtx.fillStyle = "#1e293b";
    bCtx.fillRect(0, 0, 1024, 140);
    bCtx.strokeStyle = "#d4af37";
    bCtx.lineWidth = 4;
    bCtx.strokeRect(6, 6, 1012, 128);
    bCtx.fillStyle = "#f8fafc";
    bCtx.font = "bold 26px 'IBM Plex Sans', sans-serif";
    bCtx.textAlign = "center";
    bCtx.fillText("CHEMMATE BIOTECHNOLOGY RESEARCH CAMPUS", 512, 54);
    bCtx.fillStyle = "#38bdf8";
    bCtx.font = "bold 18px 'IBM Plex Mono', monospace";
    bCtx.fillText("RESEARCH PAVILION 4 · ANALYTICAL SCIENCES & HIGH-THROUGHPUT AUTOMATION", 512, 98);

    const bldTex = new THREE.CanvasTexture(bldCanvas);
    const bldSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 0.55),
      new THREE.MeshBasicMaterial({ map: bldTex })
    );
    bldSignMesh.rotation.y = Math.PI;
    bldSignMesh.position.set(0, 0, -0.02);
    bldSignGroup.add(bldSignMesh);
    canopyGroup.add(bldSignGroup);

    siteGroup.add(canopyGroup);

    // 16. Foundation Boxwood Globes in Mulch Beds (Dense Organic Spherical Hedges)
    const boxwoodCoords = [
      [-16.0, -11.5], [-12.0, -11.0], [-8.0, -11.5], [-2.0, -11.5],
      [1.0, -11.0], [6.0, -11.5], [18.5, -11.5], [21.0, -11.0],
      [27.0, -11.5], [33.0, -11.0], [39.0, -11.5], [41.5, -11.0]
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

  // --- Architectural Walk-In Refrigerator (+4°C) & Freezer (-20°C / -80°C) Suite ---
  _buildColdStorageSuite() {
    const suite = new THREE.Group();
    suite.name = "Architectural_Cold_Storage_Suite";

    const H = 2.8;   // Insulated ceiling height
    const wallT = 0.12; // 5-inch polyurethane insulated panel

    // Sited on North Wall inside Zone 5 Chemical Storage & Biological Vault
    // Suite A: Walk-In Cold Room (+4°C Chromatography & Reagents) at X: 2.8 to 5.2 (W: 2.4m, D: 2.2m, Z: 7.2 to 9.4)
    this._createWalkInUnit(suite, {
      id: "WalkIn_Refrigerator_4C",
      title: "COLD ROOM · +4.0°C",
      subtitle: "USP REAGENTS & CHROMATOGRAPHY FRACTIONS",
      tempStr: "+4.0 °C",
      tempColor: "#0284c7",
      cx: 3.8,
      cz: 8.3,
      w: 2.4,
      d: 2.0,
      h: H,
      wallT,
      doorSide: "south",
      lightColor: 0xdbeafe,
      lightIntensity: 0.75
    });

    // Suite B: Walk-In Ultra-Low Freezer (-20°C / -80°C Cryo Storage) at X: 5.5 to 7.8 (W: 2.3m, D: 2.0m, Z: 7.2 to 9.4)
    this._createWalkInUnit(suite, {
      id: "WalkIn_Freezer_SubZero",
      title: "ULTRA-LOW FREEZER · -20.0°C",
      subtitle: "CRYO ENZYMES, SERUM & STABILITY MONOGRAPHS",
      tempStr: "-20.0 °C",
      tempColor: "#38bdf8",
      cx: 6.6,
      cz: 8.3,
      w: 2.2,
      d: 2.0,
      h: H,
      wallT,
      doorSide: "south",
      lightColor: 0xcffafe,
      lightIntensity: 0.85
    });

    this.root.add(suite);
  }

  _createWalkInUnit(parent, cfg) {
    const unit = new THREE.Group();
    unit.position.set(cfg.cx, 0, cfg.cz);
    unit.name = cfg.id;

    const halfW = cfg.w / 2;
    const halfD = cfg.d / 2;

    // 1. Exterior Insulated Cam-Lock Polyurethane White Stucco Panels (Walls & Ceiling)
    // North Back Wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w, cfg.h, cfg.wallT),
      this.materials.camLockWhite
    );
    backWall.position.set(0, cfg.h / 2, halfD - cfg.wallT / 2);
    unit.add(backWall);

    // East Wall
    const eastWall = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.wallT, cfg.h, cfg.d),
      this.materials.camLockWhite
    );
    eastWall.position.set(halfW - cfg.wallT / 2, cfg.h / 2, 0);
    unit.add(eastWall);

    // West Wall
    const westWall = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.wallT, cfg.h, cfg.d),
      this.materials.camLockWhite
    );
    westWall.position.set(-halfW + cfg.wallT / 2, cfg.h / 2, 0);
    unit.add(westWall);

    // Insulated Ceiling Cap
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w, cfg.wallT, cfg.d),
      this.materials.camLockWhite
    );
    ceiling.position.set(0, cfg.h - cfg.wallT / 2, 0);
    unit.add(ceiling);

    // 2. Interior Diamond Plate Aluminum Treadwear Floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w - cfg.wallT * 2, 0.015, cfg.d - cfg.wallT * 2),
      this.materials.diamondPlateAluminum
    );
    floor.position.set(0, 0.008, 0);
    unit.add(floor);

    // 3. Front Wall Segments with Heavy Overlap Door Opening
    const doorW = 0.95;
    const doorH = 2.15;
    const sideW = (cfg.w - doorW) / 2;

    // Left Front Wall
    const frontL = new THREE.Mesh(
      new THREE.BoxGeometry(sideW, cfg.h, cfg.wallT),
      this.materials.camLockWhite
    );
    frontL.position.set(-halfW + sideW / 2, cfg.h / 2, -halfD + cfg.wallT / 2);
    unit.add(frontL);

    // Right Front Wall
    const frontR = new THREE.Mesh(
      new THREE.BoxGeometry(sideW, cfg.h, cfg.wallT),
      this.materials.camLockWhite
    );
    frontR.position.set(halfW - sideW / 2, cfg.h / 2, -halfD + cfg.wallT / 2);
    unit.add(frontR);

    // Lintel Header over Door
    const lintelH = cfg.h - doorH;
    const lintel = new THREE.Mesh(
      new THREE.BoxGeometry(doorW, lintelH, cfg.wallT),
      this.materials.camLockWhite
    );
    lintel.position.set(0, doorH + lintelH / 2, -halfD + cfg.wallT / 2);
    unit.add(lintel);

    // 4. Heavy In-Fitting Cold Storage Door with Heated Frame & Safety Latch
    const doorGroup = new THREE.Group();
    doorGroup.position.set(-doorW / 2, 0, -halfD + cfg.wallT / 2); // Hinged at left jamb

    const doorLeaf = new THREE.Mesh(
      new THREE.BoxGeometry(doorW - 0.02, doorH - 0.02, 0.08),
      this.materials.camLockWhite
    );
    doorLeaf.position.set(doorW / 2, doorH / 2, 0.04);
    doorGroup.add(doorLeaf);

    // Heated Door Perimeter Rubber Gasket
    const gasket = new THREE.Mesh(
      new THREE.BoxGeometry(doorW, doorH, 0.01),
      this.materials.matteBlackTrim
    );
    gasket.position.set(doorW / 2, doorH / 2, -0.005);
    doorGroup.add(gasket);

    // Exterior Heavy Chrome Cam-Lift Latch with Padlock Hasp
    const latch = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.22, 0.08),
      this.materials.goldBrassAccent
    );
    latch.position.set(doorW - 0.08, 1.05, 0.09);
    doorGroup.add(latch);

    // Interior Photoluminescent Emergency Safety Escape Release Plunger
    // (Mandatory OSHA/ANSI safety feature to prevent personnel entrapment)
    const escapePlunger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.09, 16),
      this.materials.safetyGlowGreen
    );
    escapePlunger.rotation.x = Math.PI / 2;
    escapePlunger.position.set(doorW - 0.08, 1.05, -0.05);
    doorGroup.add(escapePlunger);

    // Heavy Cam-Lift Self-Closing Hinges (Upper and Lower)
    [0.4, doorH - 0.4].forEach(hy => {
      const hinge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.12, 12),
        this.materials.matteBlackTrim
      );
      hinge.position.set(0.02, hy, 0.05);
      doorGroup.add(hinge);
    });

    unit.add(doorGroup);

    // 5. Overhead Forced-Air Dual-Fan Evaporator Cooling Coil
    const evap = new THREE.Group();
    evap.position.set(0, cfg.h - 0.35, halfD - 0.45);

    const evapBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.30, 0.45),
      this.materials.evaporatorFins
    );
    evap.add(evapBody);

    // Dual axial fan grills
    [-0.32, 0.32].forEach(fx => {
      const fanGrill = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.015, 16),
        this.materials.matteBlackTrim
      );
      fanGrill.rotation.x = Math.PI / 2;
      fanGrill.position.set(fx, 0, -0.23);
      evap.add(fanGrill);
    });

    unit.add(evap);

    // 6. Metro Green Heavy Epoxy-Coated Wire Storage Shelving Inside
    [-halfW + 0.35, halfW - 0.35].forEach(sx => {
      const rack = new THREE.Group();
      rack.position.set(sx, 0, 0);

      // 4 Shelf tiers
      for (let s = 1; s <= 4; s++) {
        const sy = s * 0.52;
        const shelf = new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 0.02, cfg.d - 0.6),
          this.materials.wireRackGreen
        );
        shelf.position.y = sy;
        rack.add(shelf);
      }
      unit.add(rack);
    });

    // 7. Vapor-Proof Sub-Zero LED Light Luminaire Inside Unit
    const coldLight = new THREE.PointLight(cfg.lightColor, cfg.lightIntensity, 3.2);
    coldLight.position.set(0, cfg.h - 0.2, 0);
    unit.add(coldLight);

    // 8. Exterior Digital Microprocessor Temperature HUD Controller & Alarm Panel
    const hudGroup = new THREE.Group();
    hudGroup.position.set(halfW - 0.28, 1.55, -halfD + cfg.wallT / 2 + 0.01);

    const hudCase = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.32, 0.04),
      this.materials.matteBlackTrim
    );
    hudGroup.add(hudCase);

    const hudCanvas = document.createElement("canvas");
    hudCanvas.width = 256;
    hudCanvas.height = 320;
    const hctx = hudCanvas.getContext("2d");
    hctx.fillStyle = "#0f172a";
    hctx.fillRect(0, 0, 256, 320);
    hctx.strokeStyle = "#38bdf8";
    hctx.lineWidth = 4;
    hctx.strokeRect(6, 6, 244, 308);

    hctx.fillStyle = "#f8fafc";
    hctx.font = "bold 18px sans-serif";
    hctx.textAlign = "center";
    hctx.fillText(cfg.title.split("·")[0].trim(), 128, 38);

    hctx.fillStyle = cfg.tempColor;
    hctx.font = "bold 44px monospace";
    hctx.fillText(cfg.tempStr, 128, 105);

    hctx.fillStyle = "#10b981";
    hctx.font = "bold 16px monospace";
    hctx.fillText("STATUS: STABLE · BMS LINKED", 128, 145);
    hctx.fillText("DEFROST: OFF · FAN AUTO", 128, 172);

    hctx.fillStyle = "#64748b";
    hctx.font = "12px monospace";
    hctx.fillText("SETPOINT: " + cfg.tempStr, 128, 220);
    hctx.fillText("ALARM HIGH: " + (cfg.tempStr.includes("-") ? "-12.0°C" : "+8.0°C"), 128, 245);
    hctx.fillText("CALIBRATED NIST TRACEABLE", 128, 275);

    const hudTex = new THREE.CanvasTexture(hudCanvas);
    const hudScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.28),
      new THREE.MeshBasicMaterial({ map: hudTex })
    );
    hudScreen.position.set(0, 0, 0.022);
    hudGroup.add(hudScreen);

    unit.add(hudGroup);

    // Colliders for walk-in walls
    [backWall, eastWall, westWall, frontL, frontR].forEach(mesh => {
      this.colliders.push(new THREE.Box3().setFromObject(mesh));
    });

    parent.add(unit);
  }

// --- Architectural Wall Wainscoting, Crash Bumper Rails, Fire Strobes & MEP Devices ---
  _buildWallArchitecturalTrims() {
    const H = 3.8;

    // 1. High-Impact Wainscot Paneling along Central Hallway (X: 16.0 to 38.0, Y: 0 to 1.05m)
    // North Hallway Wainscot (Z = 1.42)
    const northWainscot = new THREE.Mesh(
      new THREE.BoxGeometry(22.0, 1.05, 0.02),
      this.materials.wainscotSlate
    );
    northWainscot.position.set(27.0, 1.05 / 2, 1.42);
    this.root.add(northWainscot);

    // South Hallway Wainscot (Z = -1.42)
    const southWainscot = new THREE.Mesh(
      new THREE.BoxGeometry(22.0, 1.05, 0.02),
      this.materials.wainscotSlate
    );
    southWainscot.position.set(27.0, 1.05 / 2, -1.42);
    this.root.add(southWainscot);

    // 2. Heavy-Duty Wall Crash Bumper Rails with End Caps (Y = 0.95m)
    [-1.40, 1.40].forEach((bz) => {
      const bumper = new THREE.Mesh(
        new THREE.BoxGeometry(22.0, 0.10, 0.025),
        this.materials.bumperRail
      );
      bumper.position.set(27.0, 0.95, bz);
      this.root.add(bumper);
    });

    // Lab West Perimeter Crash Rail (X = -15.9, Z: -9.0 to 9.0)
    const labBumper = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.10, 18.0),
      this.materials.bumperRail
    );
    labBumper.position.set(-15.88, 0.95, 0);
    this.root.add(labBumper);

    // 3. ANSI Z535 Fire Alarm Strobe / Horn Stations (Safety Red + Xenon Strobe at Y = 2.4m)
    const fireStrobeLocations = [
      { x: -15.88, z: 0.0, rotY: Math.PI / 2 },    // West Lab Wall
      { x: -0.5, z: 9.38, rotY: Math.PI },          // North Lab Wall
      { x: 12.0, z: -9.38, rotY: 0 },              // Reception Entrance
      { x: 21.0, z: 1.42, rotY: Math.PI },          // Hallway West
      { x: 32.0, z: 1.42, rotY: Math.PI },          // Hallway East
      { x: 38.0, z: 0.0, rotY: -Math.PI / 2 }       // End Hallway
    ];

    fireStrobeLocations.forEach((loc) => {
      const group = new THREE.Group();
      group.position.set(loc.x, 2.4, loc.z);
      group.rotation.y = loc.rotY;

      // Red Polycarbonate Box
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.12, 0.045),
        this.materials.fireStrobeRed
      );
      group.add(body);

      // Xenon White Flash Strobe Lens
      const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.015, 12),
        this.materials.sprinklerChrome
      );
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 0.025, 0.025);
      group.add(lens);

      // Alarm Horn Grill Slots
      for (let s = 0; s < 3; s++) {
        const slot = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.005, 0.004),
          new THREE.MeshBasicMaterial({ color: 0x050709 })
        );
        slot.position.set(0, -0.02 - s * 0.012, 0.024);
        group.add(slot);
      }

      this.root.add(group);
    });

    // 4. Emergency Green LED Exit Signs with Directional Chevrons over Portals (Y = 2.65m)
    const exitLocations = [
      { x: 13.0, z: -9.38, rotY: 0 },          // Exterior Main Entrance
      { x: 8.0, z: -0.45, rotY: Math.PI / 2 },  // Lab to Reception Portal
      { x: 16.0, z: 0.0, rotY: -Math.PI / 2 },  // Reception to Hallway Portal
      { x: 38.0, z: 0.0, rotY: -Math.PI / 2 }   // Far East Hallway Portal
    ];

    exitLocations.forEach((loc) => {
      const group = new THREE.Group();
      group.position.set(loc.x, 2.65, loc.z);
      group.rotation.y = loc.rotY;

      // Brushed Aluminum Enclosure
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.18, 0.04),
        this.materials.cabinetHandle
      );
      group.add(box);

      // Illuminated Green Face
      const face = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.14, 0.006),
        this.materials.exitSignGreen
      );
      face.position.z = 0.022;
      group.add(face);

      this.root.add(group);
    });

    // 5. Dwyer Magnehelic Differential Pressure Gauges beside Cleanroom Doors (Y = 1.55m)
    const magnehelicLocations = [
      { x: 8.12, z: -0.45 + 1.25, rotY: Math.PI / 2 },  // Lab entrance
      { x: 16.12, z: 1.25, rotY: Math.PI / 2 },          // Hallway entrance
      { x: 38.12, z: 1.25, rotY: Math.PI / 2 }           // Women's locker entrance
    ];

    magnehelicLocations.forEach((loc) => {
      const group = new THREE.Group();
      group.position.set(loc.x, 1.55, loc.z);
      group.rotation.y = loc.rotY;

      // Chrome Bezel Housing
      const bezel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.065, 0.035, 20),
        this.materials.magnehelicChrome || this.materials.cabinetHandle
      );
      bezel.rotation.x = Math.PI / 2;
      group.add(bezel);

      // Dial Face (White with black ticks)
      const dial = new THREE.Mesh(
        new THREE.CircleGeometry(0.058, 20),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
      );
      dial.position.z = 0.019;
      group.add(dial);

      // Red Pointer Needle (reading +0.03 in w.g.)
      const needle = new THREE.Mesh(
        new THREE.BoxGeometry(0.002, 0.045, 0.002),
        this.materials.hazardFlammable || this.materials.fireStrobeRed
      );
      needle.position.set(0.008, 0.015, 0.021);
      needle.rotation.z = -0.25;
      group.add(needle);

      this.root.add(group);
    });

    // 6. Digital HVAC Climate Thermostat Controllers (Y = 1.45m)
    const thermostatLocations = [
      { x: -15.88, z: 4.5, rotY: Math.PI / 2 },
      { x: 12.0, z: -9.38, rotY: 0 },
      { x: 18.75, z: -1.62, rotY: 0 },
      { x: 21.5, z: 1.62, rotY: Math.PI },
      { x: 30.25, z: 1.62, rotY: Math.PI }
    ];

    thermostatLocations.forEach((loc) => {
      const tStat = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.10, 0.025),
        this.materials.gfciFaceplate || this.materials.porcelainWhite
      );
      tStat.position.set(loc.x, 1.45, loc.z);
      tStat.rotation.y = loc.rotY;
      this.root.add(tStat);

      const lcd = new THREE.Mesh(
        new THREE.BoxGeometry(0.065, 0.045, 0.003),
        this.materials.telDigitalGreen
      );
      lcd.position.set(loc.x, 1.45, loc.z + (loc.rotY === 0 ? 0.014 : (loc.rotY === Math.PI ? -0.014 : 0)));
      this.root.add(lcd);
    });

    // 7. Overhead Fire Sprinklers & 4-Way HVAC Air Diffusers in Ceiling Grid (Y = 3.78m)
    const hvacGrid = [
      [-10.0, -4.5], [-2.0, -4.5], [-10.0, 5.0], [-0.5, 5.0],
      [12.0, -4.0], [12.0, 4.0], [21.5, 5.5], [30.25, 5.5],
      [18.75, -5.5], [26.75, -5.5], [35.0, -5.5], [41.0, 0.0]
    ];

    hvacGrid.forEach(([hx, hz]) => {
      // 4-Way Aerodynamic Square HVAC Diffuser (600mm x 600mm)
      const diffuser = new THREE.Mesh(
        new THREE.BoxGeometry(0.60, 0.02, 0.60),
        this.materials.hvacDiffuserWhite
      );
      diffuser.position.set(hx, 3.79, hz);
      this.root.add(diffuser);

      // Concentric Louvers
      [0.45, 0.30, 0.15].forEach((lSize) => {
        const louver = new THREE.Mesh(
          new THREE.BoxGeometry(lSize, 0.008, lSize),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 })
        );
        louver.position.set(hx, 3.782, hz);
        this.root.add(louver);
      });

      // Chrome Pendant Fire Sprinkler Head nearby
      const groupSprinkler = new THREE.Group();
      groupSprinkler.position.set(hx + 1.2, 3.75, hz + 0.8);

      const escutcheon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.008, 16),
        this.materials.sprinklerChrome
      );
      escutcheon.position.y = 0.04;
      groupSprinkler.add(escutcheon);

      const pipeDrop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.04, 12),
        this.materials.sprinklerChrome
      );
      pipeDrop.position.y = 0.02;
      groupSprinkler.add(pipeDrop);

      const frame = new THREE.Mesh(
        new THREE.TorusGeometry(0.012, 0.003, 8, 16),
        this.materials.sprinklerChrome
      );
      frame.position.y = -0.005;
      groupSprinkler.add(frame);

      // Red heat-sensitive glass bulb
      const bulb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.003, 0.014, 8),
        this.materials.sprinklerRedBulb
      );
      bulb.position.y = -0.005;
      groupSprinkler.add(bulb);

      // Deflector plate
      const deflector = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.003, 12),
        this.materials.sprinklerChrome
      );
      deflector.position.y = -0.015;
      groupSprinkler.add(deflector);

      this.root.add(groupSprinkler);

      // Photoelectric Smoke Detector with pulsing LED
      const smokeDet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.075, 0.035, 20),
        this.materials.hvacDiffuserWhite
      );
      smokeDet.position.set(hx - 1.2, 3.78, hz - 0.8);
      this.root.add(smokeDet);

      const sLED = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.003, 0.004, 8),
        this.materials.telDigitalGreen
      );
      sLED.position.set(hx - 1.2, 3.76, hz - 0.8);
      this.root.add(sLED);
    });
  }
}
