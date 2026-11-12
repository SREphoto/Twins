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
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Sky } from "three/addons/objects/Sky.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export class LabEnvironment3D {
  constructor(scene, renderer = null, options = {}) {
    this.scene = scene;
    this.renderer = renderer;
    this.options = Object.assign({
      loadVehicles: true,
      isMobile: false
    }, options);
    this.root = new THREE.Group();
    this.root.name = "Modern_Lab_Facility_Root";
    this.roofGroup = new THREE.Group();
    this.roofGroup.name = "Smart_AutoHiding_Roof_Assembly";
    this.colliders = [];
    this.interiorPointLights = [];
    this.exteriorNightLights = [];
    this.exteriorLampEmissives = [];
    this.nightVolumetricCones = [];
    this.nightGroundPools = [];
    this.nightWindowGlowMeshes = [];
    this.nightTrafficLightMeshes = [];
    this.streetTrafficVehicles = [];
    this._lastTrafficTime = null;
    this._lightPoolTexCache = new Map();
    this.envMapCache = new Map();
    this.currentMood = "daylight";
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
    this._buildRoofAndPenthouse();
    this._buildBiophilicWall();
    this._buildColdStorageSuite();
    this._buildExteriorCampusSite();

    this.root.add(this.roofGroup);
    this.scene.add(this.root);
    this.setAtmosphereMood("daylight");
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

  _generateProceduralBotanicalLivingWallTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Dark cellular felt substrate background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    bgGrad.addColorStop(0, "#08100a");
    bgGrad.addColorStop(0.5, "#0b150d");
    bgGrad.addColorStop(1.0, "#060d08");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Deep velvet moss stippling & moisture variation
    for (let i = 0; i < 400; i++) {
      const mx = Math.random() * 1024;
      const my = Math.random() * 1024;
      const mr = 6 + Math.random() * 24;
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(18, 55, 24, 0.45)" : "rgba(10, 35, 15, 0.55)";
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Palette of botanical foliage leaves
    const leafPalettes = [
      { base: "#1e5c2b", highlight: "#38a149", vein: "#a3e635" },
      { base: "#164e28", highlight: "#22c55e", vein: "#86efac" },
      { base: "#14532d", highlight: "#15803d", vein: "#dcfce7" },
      { base: "#134e20", highlight: "#16a34a", vein: "#facc15" },
      { base: "#0f3818", highlight: "#15803d", vein: "#4ade80" }
    ];

    // Render 650 layered botanical leaves in natural cascading clusters
    for (let l = 0; l < 650; l++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 1024;
      const pal = leafPalettes[Math.floor(Math.random() * leafPalettes.length)];
      const size = 18 + Math.random() * 42;
      const angle = (Math.random() - 0.5) * 1.8 + Math.PI / 2; // Natural downward/side drape

      // Drop shadow under leaf
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.beginPath();
      ctx.arc(cx + 3, cy + 4, size * 0.75, 0, Math.PI * 2);
      ctx.fill();

      // Leaf base body
      ctx.fillStyle = pal.base;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.75, 0, Math.PI * 2);
      ctx.fill();

      // Leaf tip (lanceolate / cordate shape)
      const tipX = cx + Math.cos(angle) * size;
      const tipY = cy + Math.sin(angle) * size;
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.5, cy);
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(cx + size * 0.5, cy);
      if (ctx.closePath) ctx.closePath();
      ctx.fillStyle = pal.highlight;
      ctx.fill();

      // Central vein & variegation highlight
      ctx.strokeStyle = pal.vein;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - size * 0.3);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      // Lateral secondary veins
      for (let v = 0; v < 4; v++) {
        const vf = (v + 1) / 5;
        const vx = cx + (tipX - cx) * vf;
        const vy = cy + (tipY - cy) * vf;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(vx + (v % 2 === 0 ? 8 : -8), vy - 4);
        ctx.stroke();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  _generateProceduralCanopyLeafTexture(type = "birch") {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const isBirch = type === "birch";
    ctx.fillStyle = isBirch ? "#1b4d25" : "#4a1218";
    ctx.fillRect(0, 0, 512, 512);

    const colors = isBirch
      ? ["#226630", "#2d8a42", "#38a149", "#4ade80", "#184420", "#52b768"]
      : ["#5e1720", "#7f1d2b", "#9f1239", "#be123c", "#3d0e14", "#881337"];

    for (let i = 0; i < 400; i++) {
      const lx = Math.random() * 512;
      const ly = Math.random() * 512;
      const lr = 10 + Math.random() * 22;
      const col = colors[Math.floor(Math.random() * colors.length)];

      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.beginPath();
      ctx.arc(lx + 2, ly + 3, lr * 0.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(lx, ly, lr * 0.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(lx - lr * 0.5, ly);
      ctx.lineTo(lx, ly + lr);
      ctx.lineTo(lx + lr * 0.5, ly);
      if (ctx.closePath) ctx.closePath();
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  _generateProceduralCurtainWindowInteriorTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Warm laboratory ceiling and interior ambient light gradient
    const winGrad = ctx.createLinearGradient(0, 0, 0, 512);
    winGrad.addColorStop(0, "#fff5e6");     // Upper ceiling LED troffer glow
    winGrad.addColorStop(0.35, "#f1e5cf");  // Warm middle lab air volume
    winGrad.addColorStop(0.65, "#a89f91");  // Benchtop height transition
    winGrad.addColorStop(1.0, "#2c3038");   // Lower casework / floor shadow
    ctx.fillStyle = winGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Ceiling linear LED troffer fixtures (3 overhead light lines)
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(40, 25, 432, 12);
    ctx.fillRect(60, 60, 392, 12);
    ctx.fillRect(80, 95, 352, 10);

    // Silhouetted analytical instrument benches & casework
    ctx.fillStyle = "#1e242d";
    ctx.fillRect(0, 340, 512, 172);

    // Silhouettes of instruments
    ctx.fillStyle = "#141820";
    ctx.fillRect(45, 260, 90, 80);
    ctx.fillRect(180, 240, 120, 100);
    ctx.fillRect(340, 270, 110, 70);

    // Blue / emerald / amber instrument LEDs
    ctx.fillStyle = "#00e5ff";
    ctx.fillRect(80, 300, 6, 6);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(230, 275, 8, 8);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(380, 295, 6, 6);

    // Architectural Bronze Double-Glazed Window Frame & Transom Bars
    ctx.fillStyle = "#1b1916";
    ctx.fillRect(0, 0, 12, 512);
    ctx.fillRect(500, 0, 12, 512);
    ctx.fillRect(0, 0, 512, 12);
    ctx.fillRect(0, 500, 512, 12);
    ctx.fillRect(250, 0, 12, 512);
    ctx.fillRect(0, 220, 512, 10);

    // Subtle glass reflection diagonal sheen
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(260, 0);
    ctx.lineTo(0, 480);
    if (ctx.closePath) ctx.closePath();
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
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

    const livingWallTex = this._generateProceduralBotanicalLivingWallTexture();
    this.materials.livingWallFoliageTapestry = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: livingWallTex,
      roughness: 0.38,
      metalness: 0.04,
      side: THREE.DoubleSide,
      name: "Mat_Botanical_Living_Wall_Tapestry"
    });

    const birchLeafTex = this._generateProceduralCanopyLeafTexture("birch");
    this.materials.birchCanopyLeaf = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: birchLeafTex,
      roughness: 0.55,
      metalness: 0.02,
      name: "Mat_Birch_Canopy_Leaf"
    });

    const mapleLeafTex = this._generateProceduralCanopyLeafTexture("maple");
    this.materials.mapleCanopyLeaf = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: mapleLeafTex,
      roughness: 0.48,
      metalness: 0.03,
      name: "Mat_Maple_Canopy_Leaf"
    });

    const winIntTex = this._generateProceduralCurtainWindowInteriorTexture();
    this.materials.windowInteriorIlluminated = new THREE.MeshBasicMaterial({
      map: winIntTex,
      name: "Mat_Curtain_Window_Illuminated_Interior"
    });

    // Executive Suite, Locker Room & Wellness Materials (Warm Contemporary Stone & Terrazzo Textures)
    const createStoneTileTex = (baseHex, chipA, chipB, groutHex, cells = 4, rx = 6, ry = 8) => {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext("2d");
      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, 512, 512);

      // Subtle stone cloud mottling + terrazzo mineral chips
      let seed = 1337;
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967295;
      };
      for (let i = 0; i < 420; i++) {
        ctx.fillStyle = i % 2 === 0 ? chipA : chipB;
        ctx.globalAlpha = 0.14 + rand() * 0.20;
        const x = rand() * 512;
        const y = rand() * 512;
        const w = 2 + rand() * 7;
        const h = 2 + rand() * 5;
        ctx.fillRect(x, y, w, h);
      }
      ctx.globalAlpha = 1.0;

      // Crisp honed stone tile grout lines
      const step = 512 / cells;
      ctx.strokeStyle = groutHex;
      ctx.lineWidth = 3;
      for (let g = 0; g <= cells; g++) {
        const pos = Math.round(g * step) + 0.5;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(512, pos);
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(rx, ry);
      tex.anisotropy = 8;
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    this.materials.porcelainMarble = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createStoneTileTex("#9e9080", "#cbbba8", "#6f6254", "#7b6e60", 4, 5, 13),
      roughness: 0.34,
      metalness: 0.06,
      name: "Mat_Warm_Travertine_Terrazzo_Spa"
    });

    this.materials.restroomTravertineTile = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createStoneTileTex("#7c7369", "#a99e91", "#4e4740", "#5b534b", 4, 4.5, 8),
      roughness: 0.32,
      metalness: 0.08,
      name: "Mat_Restroom_Honed_Greige_Terrazzo"
    });

    this.materials.restroomDarkWainscot = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createStoneTileTex("#2f2a27", "#473f3a", "#1d1a18", "#1f1b19", 4, 6, 2.5),
      roughness: 0.36,
      metalness: 0.14,
      name: "Mat_Restroom_Bronze_Slate_Wainscot"
    });

    this.materials.slateLockerTile = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createStoneTileTex("#2e343e", "#464f5d", "#1c2027", "#1f242c", 4, 5, 7),
      roughness: 0.44,
      metalness: 0.12,
      name: "Mat_Slate_Locker_Tile"
    });

    this.materials.breakroomTile = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createStoneTileTex("#4a515c", "#737c8a", "#2f353e", "#373d47", 4, 5.5, 7),
      roughness: 0.36,
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

    // Fix previously undefined material references in LabEnvironment3D
    this.materials.cabinetHandle = new THREE.MeshStandardMaterial({
      color: 0xd0d7e2,
      roughness: 0.24,
      metalness: 0.88,
      name: "Mat_Brushed_Stainless_Hardware"
    });

    this.materials.cabinetBody = new THREE.MeshStandardMaterial({
      color: 0x262d38,
      roughness: 0.45,
      metalness: 0.45,
      name: "Mat_Charcoal_Powder_Steel"
    });

    this.materials.porcelainWhite = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.18,
      metalness: 0.04,
      name: "Mat_Porcelain_White"
    });

    this.materials.telDigitalGreen = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      name: "Mat_Telemetry_LED_Green"
    });

    this.materials.roofMembrane = new THREE.MeshStandardMaterial({
      color: 0x2f3640,
      roughness: 0.82,
      metalness: 0.08,
      name: "Mat_Roof_TPO_Membrane"
    });

    this.materials.cedarTimber = new THREE.MeshStandardMaterial({
      color: 0x7c4a27,
      roughness: 0.56,
      metalness: 0.04,
      name: "Mat_Architectural_Cedar_Timber"
    });

    // Load Real PBR Masonry & Herringbone Paver Texture Maps from ./assets/textures/
    this._texDependents = new WeakMap();
    this._tiledMatCache = new Map();
    const texLoader = new THREE.TextureLoader();
    const prepTex = (url, isSRGB = false) => {
      const dependents = [];
      const t = texLoader.load(url, (loadedTex) => {
        dependents.forEach((cloneTex) => {
          cloneTex.image = loadedTex.image;
          cloneTex.source = loadedTex.source;
          cloneTex.needsUpdate = true;
        });
      });
      this._texDependents.set(t, dependents);
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8;
      if (isSRGB) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };

    this._wallBrickMaps = {
      map: prepTex("./assets/textures/wall_brick/albedo.jpg", true),
      normalMap: prepTex("./assets/textures/wall_brick/normal.jpg", false),
      roughnessMap: prepTex("./assets/textures/wall_brick/roughness.jpg", false),
      aoMap: prepTex("./assets/textures/wall_brick/ao.jpg", false)
    };

    this._herringboneMaps = {
      map: prepTex("./assets/textures/herringbone_brick/albedo.jpg", true),
      normalMap: prepTex("./assets/textures/herringbone_brick/normal.jpg", false),
      roughnessMap: prepTex("./assets/textures/herringbone_brick/roughness.jpg", false)
    };

    // Upgrade default exteriorBrick & exteriorPaver to real PBR maps as well
    this.materials.exteriorBrick = this._createBrickCladdingMaterial(6, 2);
    this.materials.exteriorPaver = this._createHerringboneMaterial(4, 4);
  }

  _cloneTiledMap(srcTex, rx, ry, isSRGB = false) {
    if (!srcTex) return null;
    const c = new THREE.Texture();
    c.wrapS = THREE.RepeatWrapping;
    c.wrapT = THREE.RepeatWrapping;
    c.repeat.set(Math.max(0.20, rx), Math.max(0.20, ry));
    c.anisotropy = 8;
    if (isSRGB) c.colorSpace = THREE.SRGBColorSpace;
    if (srcTex.image) {
      c.image = srcTex.image;
      c.source = srcTex.source;
      c.needsUpdate = true;
    } else {
      const deps = this._texDependents?.get(srcTex);
      if (deps) deps.push(c);
    }
    return c;
  }

  _createBrickCladdingMaterial(spanMeters = 6.0, heightMeters = 3.35) {
    const rx = Math.max(0.25, Math.round((spanMeters / 1.85) * 4) / 4);
    const ry = Math.max(0.25, Math.round((heightMeters / 1.25) * 4) / 4);
    const key = `brick_${rx}_${ry}`;
    if (this._tiledMatCache?.has(key)) return this._tiledMatCache.get(key);
    const m = this._wallBrickMaps;
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: this._cloneTiledMap(m?.map, rx, ry, true),
      normalMap: this._cloneTiledMap(m?.normalMap, rx, ry, false),
      normalScale: new THREE.Vector2(1.05, 1.05),
      roughnessMap: this._cloneTiledMap(m?.roughnessMap, rx, ry, false),
      aoMap: this._cloneTiledMap(m?.aoMap, rx, ry, false),
      aoMapIntensity: 0.72,
      roughness: 0.84,
      metalness: 0.03,
      name: "Mat_PBR_Wall_Brick"
    });
    this._tiledMatCache?.set(key, mat);
    return mat;
  }

  _createHerringboneMaterial(spanX = 6.0, spanZ = 6.0) {
    const rx = Math.max(0.25, Math.round((spanX / 2.4) * 2) / 2);
    const ry = Math.max(0.25, Math.round((spanZ / 2.4) * 2) / 2);
    const key = `herr_${rx}_${ry}`;
    if (this._tiledMatCache?.has(key)) return this._tiledMatCache.get(key);
    const m = this._herringboneMaps;
    const mat = new THREE.MeshStandardMaterial({
      color: 0xdfd5cc,
      map: this._cloneTiledMap(m?.map, rx, ry, true),
      normalMap: this._cloneTiledMap(m?.normalMap, rx, ry, false),
      normalScale: new THREE.Vector2(0.75, 0.75),
      roughnessMap: this._cloneTiledMap(m?.roughnessMap, rx, ry, false),
      roughness: 0.80,
      metalness: 0.04,
      name: "Mat_PBR_Herringbone_Brick"
    });
    this._tiledMatCache?.set(key, mat);
    return mat;
  }

  _buildFloorsWithGrid() {
    const H = 3.8;
    const D = 19.0;

    // 1A. Main Analytical & Chemical Lab Floor (Terrazzo) - Expanded West & Central areas (X: -22 to 8, Z: -9.5 to 9.5 = 30m x 19m)
    const labFloorGeo = new THREE.PlaneGeometry(30.0, D);
    const labFloor = new THREE.Mesh(labFloorGeo, this.materials.terrazzo);
    labFloor.rotation.x = -Math.PI / 2;
    labFloor.position.set(-7.0, 0, 0);
    labFloor.receiveShadow = true;
    this.root.add(labFloor);

    // Architectural expansion divider grid strips every 3 meters in Front Main Lab
    for (let x = -22.0; x <= 8.0; x += 3.0) {
      const stripX = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.003, D), this.materials.gridStrip);
      stripX.position.set(x, 0.0015, 0);
      this.root.add(stripX);
    }
    for (let z = -9.0; z <= 9.0; z += 3.0) {
      const stripZ = new THREE.Mesh(new THREE.BoxGeometry(30.0, 0.003, 0.012), this.materials.gridStrip);
      stripZ.position.set(-7.0, 0.0015, z);
      this.root.add(stripZ);
    }

    // 1B. Rear North L-Wing High-Bay Research Expansion Floor (Terrazzo) - (X: -22 to 8, Z: 9.5 to 27.5 = 30m x 18m = 540 m^2)
    const rearWingD = 18.0;
    const rearLabFloorGeo = new THREE.PlaneGeometry(30.0, rearWingD);
    const rearLabFloor = new THREE.Mesh(rearLabFloorGeo, this.materials.terrazzo);
    rearLabFloor.rotation.x = -Math.PI / 2;
    rearLabFloor.position.set(-7.0, 0, 18.5);
    rearLabFloor.receiveShadow = true;
    this.root.add(rearLabFloor);

    for (let x = -22.0; x <= 8.0; x += 3.0) {
      const stripX = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.003, rearWingD), this.materials.gridStrip);
      stripX.position.set(x, 0.0015, 18.5);
      this.root.add(stripX);
    }
    for (let z = 12.0; z <= 27.0; z += 3.0) {
      const stripZ = new THREE.Mesh(new THREE.BoxGeometry(30.0, 0.003, 0.012), this.materials.gridStrip);
      stripZ.position.set(-7.0, 0.0015, z);
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

    // 4C. Executive Restroom Suite (Honed Warm Greige Terrazzo Tile + Dark Bronze-Slate Feature Wainscot)
    // (X: 33.5 to 38.0, Z: 1.5 to 9.5, size 4.5m x 8m = 36 m^2)
    const restroomFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(4.5, 8.0),
      this.materials.restroomTravertineTile
    );
    restroomFloor.rotation.x = -Math.PI / 2;
    restroomFloor.position.set(35.75, 0.003, 5.5);
    restroomFloor.receiveShadow = true;
    this.root.add(restroomFloor);

    // Restroom West Urinal Wall & North Vanity Wall Porcelain Tile Wainscot (High-contrast backdrop for white porcelain!)
    const rrWestWainscot = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 1.54, 7.76),
      this.materials.restroomDarkWainscot
    );
    rrWestWainscot.position.set(33.59, 0.77, 5.5);
    rrWestWainscot.receiveShadow = true;
    this.root.add(rrWestWainscot);

    const rrWestCap = new THREE.Mesh(
      new THREE.BoxGeometry(0.032, 0.028, 7.76),
      this.materials.goldBrassAccent
    );
    rrWestCap.position.set(33.595, 1.55, 5.5);
    this.root.add(rrWestCap);

    const rrNorthWainscot = new THREE.Mesh(
      new THREE.BoxGeometry(4.32, 2.35, 0.022),
      this.materials.restroomDarkWainscot
    );
    rrNorthWainscot.position.set(35.75, 1.175, 9.385);
    rrNorthWainscot.receiveShadow = true;
    this.root.add(rrNorthWainscot);

    const rrNorthCap = new THREE.Mesh(
      new THREE.BoxGeometry(4.32, 0.028, 0.032),
      this.materials.goldBrassAccent
    );
    rrNorthCap.position.set(35.75, 2.36, 9.38);
    this.root.add(rrNorthCap);

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

    // Warm Fluted Walnut & Travertine Spa Feature Paneling behind Women's Vanity & East Wall
    [4.75, -4.75].forEach((wz) => {
      const wPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.024, 2.45, 6.20),
        this.materials.flutedWalnut
      );
      wPanel.position.set(38.09, 1.225, wz);
      wPanel.receiveShadow = true;
      this.root.add(wPanel);

      const wTrim = new THREE.Mesh(
        new THREE.BoxGeometry(0.032, 0.03, 6.20),
        this.materials.goldBrassAccent
      );
      wTrim.position.set(38.095, 2.46, wz);
      this.root.add(wTrim);
    });
  }

  // Helper: Builds a complete Exterior Perimeter Wall Elevation with True Cutout Windows/Doors,
  // Interior Drywall + Baseboard, Exterior PBR Running-Bond Brick + Cast-Stone Plinth + Parapet Coping.
  _buildFramedExteriorElevation(cfg) {
    const {
      axis,            // "X" (runs along X at fixed Z) or "Z" (runs along Z at fixed X)
      fixedCoord,      // Z coord if axis==="X", X coord if axis==="Z"
      uStart,
      uEnd,
      outerSign,       // -1 or +1 indicating exterior normal direction along fixedCoord axis
      baseY = 0.0,     // Starting elevation Y (0.0 for floor-reaching, 3.80 for step-up clerestory walls)
      height = 3.8,    // Top parapet elevation Y (3.80m front wing, 5.60m high-bay Rear L-Wing)
      extMat = null,   // Custom exterior rain-screen cladding material (defaults to running-bond brick)
      interiorMat = this.materials.wallDrywall,
      openings = []    // Sorted [{ u0, u1, sillY, headY, type: "window"|"clerestory"|"door", frosted, louvers, groundSpill }]
    } = cfg;

    const H = height;
    const wallT = 0.20;
    const brickT = 0.12;
    const plinthH = 0.45;
    const isAlongX = axis === "X";
    const isGroundWall = baseY <= 0.05;
    const sorted = [...openings].sort((a, b) => a.u0 - b.u0);

    const addSpanBlock = (uA, uB, yA, yB, withCollider = true, withBaseboard = false, withPlinth = false) => {
      const span = uB - uA;
      const h = yB - yA;
      if (span <= 0.01 || h <= 0.01) return;
      const uMid = (uA + uB) / 2;
      const yMid = (yA + yB) / 2;

      // 1. Structural Interior Wall Core
      const coreGeo = isAlongX
        ? new THREE.BoxGeometry(span, h, wallT)
        : new THREE.BoxGeometry(wallT, h, span);
      const coreMesh = new THREE.Mesh(coreGeo, interiorMat);
      if (isAlongX) coreMesh.position.set(uMid, yMid, fixedCoord);
      else coreMesh.position.set(fixedCoord, yMid, uMid);
      coreMesh.castShadow = true;
      coreMesh.receiveShadow = true;
      this.root.add(coreMesh);

      if (withCollider && yA <= 1.8) {
        this.colliders.push(new THREE.Box3().setFromObject(coreMesh));
      }

      // 2. Interior Baseboard Trim (only on floor-reaching spans)
      if (withBaseboard && yA <= 0.01) {
        const bbH = 0.12;
        const bbT = 0.02;
        const bbOffset = -outerSign * (wallT / 2 + bbT / 2);
        const bbGeo = isAlongX
          ? new THREE.BoxGeometry(span, bbH, bbT)
          : new THREE.BoxGeometry(bbT, bbH, span);
        const bb = new THREE.Mesh(bbGeo, this.materials.baseboard);
        if (isAlongX) bb.position.set(uMid, bbH / 2, fixedCoord + bbOffset);
        else bb.position.set(fixedCoord + bbOffset, bbH / 2, uMid);
        this.root.add(bb);
      }

      // 3. Exterior Cast-Stone Plinth (for Y = 0..plinthH) + Exterior Cladding above Plinth
      const extCenter = fixedCoord + outerSign * (wallT / 2 + brickT / 2 + 0.004);
      const brickStartY = (withPlinth && yA <= 0.01) ? Math.min(yB, plinthH) : yA;

      if (withPlinth && yA <= 0.01) {
        const pH = Math.min(plinthH, yB);
        const pGeo = isAlongX
          ? new THREE.BoxGeometry(span + 0.02, pH, brickT + 0.04)
          : new THREE.BoxGeometry(brickT + 0.04, pH, span + 0.02);
        const pMesh = new THREE.Mesh(pGeo, this.materials.limestonePlinth);
        const pPos = fixedCoord + outerSign * (wallT / 2 + (brickT + 0.04) / 2 + 0.004);
        if (isAlongX) pMesh.position.set(uMid, pH / 2, pPos);
        else pMesh.position.set(pPos, pH / 2, uMid);
        pMesh.receiveShadow = true;
        this.root.add(pMesh);

        const capGeo = isAlongX
          ? new THREE.BoxGeometry(span + 0.03, 0.035, brickT + 0.06)
          : new THREE.BoxGeometry(brickT + 0.06, 0.035, span + 0.03);
        const capMesh = new THREE.Mesh(capGeo, this.materials.limestonePlinth);
        if (isAlongX) capMesh.position.set(uMid, pH + 0.0175, pPos);
        else capMesh.position.set(pPos, pH + 0.0175, uMid);
        this.root.add(capMesh);
      }

      const bH = yB - brickStartY;
      if (bH > 0.02) {
        const brickMat = extMat || this._createBrickCladdingMaterial(span, bH);
        const bGeo = isAlongX
          ? new THREE.BoxGeometry(span, bH, brickT)
          : new THREE.BoxGeometry(brickT, bH, span);
        const bMesh = new THREE.Mesh(bGeo, brickMat);
        if (isAlongX) bMesh.position.set(uMid, brickStartY + bH / 2, extCenter);
        else bMesh.position.set(extCenter, brickStartY + bH / 2, uMid);
        bMesh.castShadow = true;
        bMesh.receiveShadow = true;
        this.root.add(bMesh);
      }
    };

    // Walk along elevation from uStart to uEnd
    let cursor = uStart;
    sorted.forEach((op) => {
      if (op.u0 > cursor + 0.01) {
        addSpanBlock(cursor, op.u0, baseY, H, isGroundWall, isGroundWall, isGroundWall);
      }

      const opW = op.u1 - op.u0;
      const opMid = (op.u0 + op.u1) / 2;

      if (op.type === "door") {
        const headY = op.headY || 2.45;
        addSpanBlock(op.u0, op.u1, headY, H, false, false, false);

        // Warm interior doorway light spill onto exterior plaza/patio at Dusk & Night
        const spillPool = new THREE.Mesh(
          new THREE.PlaneGeometry(opW * 1.65, 3.4),
          new THREE.MeshBasicMaterial({
            map: this._getRadialLightPoolTexture("#ffd591"),
            transparent: true,
            opacity: 0.42,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          })
        );
        spillPool.rotation.x = -Math.PI / 2;
        if (isAlongX) {
          spillPool.position.set(opMid, 0.022, fixedCoord + outerSign * 1.75);
        } else {
          spillPool.rotation.z = Math.PI / 2;
          spillPool.position.set(fixedCoord + outerSign * 1.75, 0.022, opMid);
        }
        spillPool.visible = false;
        spillPool.userData.baseOpacity = 0.44;
        this.nightGroundPools.push(spillPool);
        this.root.add(spillPool);
      } else {
        // Real punched window, curtain-wall bay, or frosted clerestory
        const sillY = op.sillY ?? 0.92;
        const headY = op.headY ?? 2.88;
        if (sillY > baseY + 0.02) {
          addSpanBlock(op.u0, op.u1, baseY, sillY, isGroundWall, isGroundWall, isGroundWall);
        }
        if (headY < H - 0.02) {
          addSpanBlock(op.u0, op.u1, headY, H, false, false, false);
        }

        // Build Mullioned Window Assembly inside the True Cutout Opening!
        const winH = headY - sillY;
        const winY = (sillY + headY) / 2;
        const frameD = wallT + brickT + 0.03;
        const centerOffset = fixedCoord + outerSign * (brickT / 2);
        const fT = 0.055;

        const winGroup = new THREE.Group();
        if (isAlongX) {
          winGroup.position.set(opMid, winY, centerOffset);
        } else {
          winGroup.position.set(centerOffset, winY, opMid);
          winGroup.rotation.y = Math.PI / 2;
        }

        // Perimeter Architectural Bronze Frame (Top, Bottom, Left, Right)
        const topRail = new THREE.Mesh(new THREE.BoxGeometry(opW, fT, frameD), this.materials.bronzeMullion);
        topRail.position.y = winH / 2 - fT / 2;
        winGroup.add(topRail);

        const botRail = new THREE.Mesh(new THREE.BoxGeometry(opW, fT, frameD), this.materials.bronzeMullion);
        botRail.position.y = -winH / 2 + fT / 2;
        winGroup.add(botRail);

        [-opW / 2 + fT / 2, opW / 2 - fT / 2].forEach((jx) => {
          const jamb = new THREE.Mesh(new THREE.BoxGeometry(fT, winH - fT * 2, frameD), this.materials.bronzeMullion);
          jamb.position.x = jx;
          winGroup.add(jamb);
        });

        // Exterior Cast-Stone Projecting Sill & Interior Walnut Window Stool
        const extDir = isAlongX ? outerSign : outerSign;
        const stoneSill = new THREE.Mesh(
          new THREE.BoxGeometry(opW + 0.14, 0.065, 0.16),
          this.materials.limestonePlinth
        );
        stoneSill.position.set(0, -winH / 2 - 0.02, extDir * (frameD / 2 + 0.02));
        winGroup.add(stoneSill);

        if (!op.frosted && isGroundWall) {
          const intStool = new THREE.Mesh(
            new THREE.BoxGeometry(opW + 0.08, 0.03, 0.12),
            this.materials.flutedWalnut
          );
          intStool.position.set(0, -winH / 2 + 0.01, -extDir * (frameD / 2 + 0.01));
          winGroup.add(intStool);
        }

        // Vertical Mullions every ~1.35m + Upper Transom Bar on tall windows
        const numPanels = Math.max(1, Math.round(opW / 1.35));
        for (let m = 1; m < numPanels; m++) {
          const mx = -opW / 2 + (m / numPanels) * opW;
          const vMull = new THREE.Mesh(
            new THREE.BoxGeometry(0.038, winH - fT * 2, frameD * 0.72),
            this.materials.bronzeMullion
          );
          vMull.position.x = mx;
          winGroup.add(vMull);
        }

        if (winH > 1.55) {
          const transomOffset = winH > 3.2 ? 0.95 : 0.44;
          const transom = new THREE.Mesh(
            new THREE.BoxGeometry(opW - fT * 2, 0.042, frameD * 0.78),
            this.materials.bronzeMullion
          );
          transom.position.y = winH / 2 - transomOffset;
          winGroup.add(transom);

          // Optional Horizontal Architectural Brise-Soleil Sun Louvers across Upper Transom Zone (Thrasher Works / Torrey View Style!)
          if (op.louvers) {
            const louverZoneH = transomOffset - fT;
            const numLouvers = Math.max(4, Math.round(louverZoneH / 0.12));
            for (let l = 1; l <= numLouvers; l++) {
              const ly = (winH / 2 - transomOffset) + (l / (numLouvers + 1)) * louverZoneH;
              const slat = new THREE.Mesh(
                new THREE.BoxGeometry(opW - 0.04, 0.028, 0.11),
                this.materials.teakWood || this.materials.flutedWalnut
              );
              slat.position.set(0, ly, extDir * (frameD / 2 + 0.045));
              slat.rotation.x = extDir * 0.22;
              slat.castShadow = true;
              winGroup.add(slat);
            }
          }
        }

        // True Transparent Double-Glazed Vision Glass (or Frosted Spa Clerestory Glass)
        const glassMat = op.frosted ? this.materials.showerFrostedGlass : this.materials.reflectiveExteriorGlass;
        const glassPane = new THREE.Mesh(
          new THREE.BoxGeometry(opW - fT * 2, winH - fT * 2, 0.024),
          glassMat
        );
        winGroup.add(glassPane);

        // Warm Interior Radiance Backing Plane & Exterior Ground Spill at Dusk / Night
        const winGlowPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(opW - fT * 2.1, winH - fT * 2.1),
          new THREE.MeshBasicMaterial({
            map: this._getWarmWindowGlowTexture(),
            transparent: true,
            opacity: 0.68,
            depthWrite: false,
            side: THREE.DoubleSide
          })
        );
        winGlowPlane.position.set(0, 0, -extDir * 0.036);
        winGlowPlane.visible = false;
        winGlowPlane.userData.baseOpacity = op.frosted ? 0.52 : 0.72;
        this.nightWindowGlowMeshes.push(winGlowPlane);
        winGroup.add(winGlowPlane);

        if (!op.frosted && op.groundSpill !== false && isGroundWall) {
          const winSpillLight = new THREE.PointLight(0xffcf86, 11.5, 9.5, 1.55);
          winSpillLight.position.set(0, -0.15, extDir * 0.55);
          winSpillLight.userData.baseIntensity = 11.5;
          this.exteriorNightLights.push(winSpillLight);
          winGroup.add(winSpillLight);

          const winGroundSpill = new THREE.Mesh(
            new THREE.PlaneGeometry(opW * 1.45, 3.2),
            new THREE.MeshBasicMaterial({
              map: this._getRadialLightPoolTexture("#ffd28a"),
              transparent: true,
              opacity: 0.36,
              depthWrite: false,
              blending: THREE.AdditiveBlending
            })
          );
          winGroundSpill.rotation.x = -Math.PI / 2;
          if (isAlongX) {
            winGroundSpill.position.set(opMid, 0.018, fixedCoord + outerSign * 1.85);
          } else {
            winGroundSpill.rotation.z = Math.PI / 2;
            winGroundSpill.position.set(fixedCoord + outerSign * 1.85, 0.018, opMid);
          }
          winGroundSpill.visible = false;
          winGroundSpill.userData.baseOpacity = 0.36;
          this.nightGroundPools.push(winGroundSpill);
          this.root.add(winGroundSpill);
        }

        this.root.add(winGroup);
      }

      cursor = op.u1;
    });

    if (cursor < uEnd - 0.01) {
      addSpanBlock(cursor, uEnd, baseY, H, isGroundWall, isGroundWall, isGroundWall);
    }

    // Continuous Cast-Stone Parapet Coping Cap along entire elevation (Y = H..H+0.12)
    const totalSpan = uEnd - uStart;
    const totalMid = (uStart + uEnd) / 2;
    const copingDepth = wallT + brickT + 0.10;
    const copingCenter = fixedCoord + outerSign * (brickT / 2);
    const copingGeo = isAlongX
      ? new THREE.BoxGeometry(totalSpan + 0.24, 0.12, copingDepth)
      : new THREE.BoxGeometry(copingDepth, 0.12, totalSpan + 0.24);
    const coping = new THREE.Mesh(copingGeo, this.materials.limestonePlinth);
    if (isAlongX) coping.position.set(totalMid, H + 0.06, copingCenter);
    else coping.position.set(copingCenter, H + 0.06, totalMid);
    this.root.add(coping);
  }

  _buildPerimeterWalls() {
    // Architectural Champagne Limestone & Metallic Composite Rain-Screen Panel Material for High-Bay Rear L-Wing
    const modernChampagnePanel = new THREE.MeshStandardMaterial({
      color: 0xe4ddd3,
      roughness: 0.42,
      metalness: 0.14,
      name: "Mat_Modern_Champagne_Limestone_Panel"
    });
    const terracottaAccentMat = new THREE.MeshStandardMaterial({
      color: 0xb4532a,
      roughness: 0.52,
      metalness: 0.12,
      name: "Mat_Architectural_Terracotta_Pier"
    });

    // 1. SOUTH MAIN ELEVATION (Z = -9.5, X: -22.0 -> +38.0, Exterior -Z)
    // Expanded Westward to X = -22.0 + Double-Height Louvered Reception Curtain-Wall Entry Bays!
    this._buildFramedExteriorElevation({
      axis: "X",
      fixedCoord: -9.5,
      uStart: -22.0,
      uEnd: 38.0,
      outerSign: -1,
      openings: [
        { u0: -20.4, u1: -16.2, sillY: 0.92, headY: 2.88, type: "window" }, // Expanded West Lab Spectroscopy Bay
        { u0: -14.2, u1: -10.6, sillY: 1.12, headY: 2.88, type: "window" }, // Main Lab Wet Bench Bay
        { u0: -5.4,  u1: -0.8,  sillY: 0.92, headY: 2.88, type: "window" }, // Main Lab Analytical South
        { u0: 1.2,   u1: 6.4,   sillY: 0.92, headY: 2.88, type: "window" }, // Main Lab Pharma/SEM South
        { u0: 8.35,  u1: 11.65, sillY: 0.18, headY: 3.55, type: "window", louvers: true }, // Reception West Louvered Curtain Bay
        { u0: 11.95, u1: 14.05, headY: 2.65, type: "door" },                                // Main Entrance Double Doors
        { u0: 14.35, u1: 15.65, sillY: 0.18, headY: 3.55, type: "window", louvers: true }, // Reception East Louvered Curtain Bay
        { u0: 16.75, u1: 20.75, sillY: 0.88, headY: 2.90, type: "window" }, // User Executive Office
        { u0: 22.15, u1: 24.35, sillY: 0.88, headY: 2.90, type: "window" }, // Guest Researcher Office
        { u0: 25.65, u1: 27.85, sillY: 0.88, headY: 2.90, type: "window" }, // Admin & Compliance Office
        { u0: 29.15, u1: 31.35, sillY: 0.88, headY: 2.90, type: "window" }, // Instructor Office
        { u0: 33.00, u1: 37.00, sillY: 2.65, headY: 3.42, type: "clerestory", frosted: true } // Men's Showers Clerestory
      ]
    });

    // 2. SOUTH-EAST JOG (X = 38.0, Z: -9.5 -> -8.0, Exterior +X)
    this._buildFramedExteriorElevation({
      axis: "Z",
      fixedCoord: 38.0,
      uStart: -9.5,
      uEnd: -8.0,
      outerSign: 1,
      openings: []
    });

    // 3. WOMEN'S LOCKER SOUTH ELEVATION (Z = -8.0, X: 38.0 -> 44.0, Exterior -Z)
    this._buildFramedExteriorElevation({
      axis: "X",
      fixedCoord: -8.0,
      uStart: 38.0,
      uEnd: 44.0,
      outerSign: -1,
      openings: [
        { u0: 39.2, u1: 42.8, sillY: 2.65, headY: 3.42, type: "clerestory", frosted: true }
      ]
    });

    // 4. FAR EAST ELEVATION — WOMEN'S LOCKER & SHOWERS (X = 44.0, Z: -8.0 -> +8.0, Exterior +X)
    this._buildFramedExteriorElevation({
      axis: "Z",
      fixedCoord: 44.0,
      uStart: -8.0,
      uEnd: 8.0,
      outerSign: 1,
      openings: [
        { u0: -6.2, u1: -2.6, sillY: 2.65, headY: 3.42, type: "clerestory", frosted: true },
        { u0: -1.0, u1: 5.8,  sillY: 2.65, headY: 3.42, type: "clerestory", frosted: true }
      ]
    });

    // 5. WOMEN'S LOCKER NORTH ELEVATION (Z = +8.0, X: 38.0 -> 44.0, Exterior +Z)
    this._buildFramedExteriorElevation({
      axis: "X",
      fixedCoord: 8.0,
      uStart: 38.0,
      uEnd: 44.0,
      outerSign: 1,
      openings: [
        { u0: 39.2, u1: 42.8, sillY: 2.65, headY: 3.42, type: "clerestory", frosted: true }
      ]
    });

    // 6. NORTH-EAST JOG (X = 38.0, Z: +8.0 -> +9.5, Exterior +X)
    this._buildFramedExteriorElevation({
      axis: "Z",
      fixedCoord: 38.0,
      uStart: 8.0,
      uEnd: 9.5,
      outerSign: 1,
      openings: []
    });

    // 7. NORTH MAIN ELEVATION — EAST & CENTRAL SPINE (Z = +9.5, X: +1.0 -> +38.0, Exterior +Z)
    // Leaves X = -21.8..+1.0 completely open below Y = 3.80m as the 22.8m-wide walkthrough portal into the Rear North L-Wing!
    this._buildFramedExteriorElevation({
      axis: "X",
      fixedCoord: 9.5,
      uStart: 1.0,
      uEnd: 38.0,
      outerSign: 1,
      openings: [
        { u0: 9.20,  u1: 14.80, sillY: 0.48, headY: 3.15, type: "window" }, // Reception Atrium DNA Vista Window
        { u0: 17.00, u1: 26.00, sillY: 1.02, headY: 2.95, type: "window" }, // Grand Boardroom Panoramic Window
        { u0: 28.78, u1: 30.08, sillY: 1.10, headY: 1.88, type: "window" }, // Break Room Over-Sink Window (Clear of Upper Cabinets!)
        { u0: 31.48, u1: 33.08, headY: 2.45, type: "door" },                // Break Room Outdoor Patio Door (Walkable!)
        { u0: 34.35, u1: 37.15, sillY: 2.65, headY: 3.42, type: "clerestory", frosted: true } // Restroom Clerestory
      ]
    });

    // 8. WEST FRONT LAB ELEVATION (X = -22.0, Z: -9.5 -> +9.5, Exterior -X)
    // Features Architectural Charcoal Box-Projected Window Frame (Thrasher Works West Facade Reference!)
    this._buildFramedExteriorElevation({
      axis: "Z",
      fixedCoord: -22.0,
      uStart: -9.5,
      uEnd: 9.5,
      outerSign: -1,
      interiorMat: this.materials.charcoalConcrete,
      openings: [
        { u0: -6.8, u1: -1.6, sillY: 0.95, headY: 2.88, type: "window" },
        { u0: 1.6,  u1: 6.8,  sillY: 0.95, headY: 2.88, type: "window" }
      ]
    });

    // Projecting Charcoal Steel Shadow-Box Window Surrounds on West Front Elevation (X = -22.24)
    [-4.2, 4.2].forEach((wz) => {
      const boxSurround = new THREE.Group();
      boxSurround.position.set(-22.22, 1.915, wz);
      const topFlange = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 5.48), this.materials.architecturalBlackMetal);
      topFlange.position.y = 1.02;
      boxSurround.add(topFlange);
      const botFlange = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 5.48), this.materials.architecturalBlackMetal);
      botFlange.position.y = -1.02;
      boxSurround.add(botFlange);
      [-2.68, 2.68].forEach((sz) => {
        const sideFlange = new THREE.Mesh(new THREE.BoxGeometry(0.32, 2.16, 0.12), this.materials.architecturalBlackMetal);
        sideFlange.position.z = sz;
        boxSurround.add(sideFlange);
      });
      this.root.add(boxSurround);
    });

    // =========================================================================
    // 9. MODERN HIGH-BAY REAR NORTH L-WING EXPANSION (X: -22.0..+8.0, Z: +9.5..+27.5, H = 5.60m)
    //    Inspired by Torrey View Life Science Campus: Higher elevation (5.60m vs 3.80m front),
    //    Champagne Limestone composite cladding, floor-to-ceiling curtain-wall glazing,
    //    terracotta corner feature piers, and sculpted cantilevered cedar-soffit roof overhang!
    // =========================================================================
    const H_REAR = 5.60;

    // 9A. WEST REAR L-WING HIGH-BAY ELEVATION (X = -22.0, Z: +9.5 -> +27.5, Exterior -X, H = 5.60m)
    this._buildFramedExteriorElevation({
      axis: "Z",
      fixedCoord: -22.0,
      uStart: 9.5,
      uEnd: 27.5,
      outerSign: -1,
      height: H_REAR,
      extMat: modernChampagnePanel,
      interiorMat: this.materials.charcoalConcrete,
      openings: [
        { u0: 11.2, u1: 17.8, sillY: 0.45, headY: 4.85, type: "window", louvers: true },
        { u0: 19.4, u1: 25.8, sillY: 0.45, headY: 4.85, type: "window", louvers: true }
      ]
    });

    // 9B. NORTH REAR L-WING HIGH-BAY ELEVATION (Z = +27.5, X: -22.0 -> +8.0, Exterior +Z, H = 5.60m)
    this._buildFramedExteriorElevation({
      axis: "X",
      fixedCoord: 27.5,
      uStart: -22.0,
      uEnd: 8.0,
      outerSign: 1,
      height: H_REAR,
      extMat: modernChampagnePanel,
      interiorMat: this.materials.charcoalConcrete,
      openings: [
        { u0: -10.8, u1: -2.2, sillY: 0.45, headY: 4.85, type: "window", louvers: true },
        { u0: -0.6,  u1: 6.4,  sillY: 0.45, headY: 4.85, type: "window", louvers: true }
      ]
    });

    // 9C. EAST REAR L-WING HIGH-BAY ELEVATION (X = +8.0, Z: +9.5 -> +27.5, Exterior +X, H = 5.60m)
    // Overlooks the Reception North Garden & Boardroom Vista with a sweeping 2-story curtain wall!
    this._buildFramedExteriorElevation({
      axis: "Z",
      fixedCoord: 8.0,
      uStart: 9.5,
      uEnd: 27.5,
      outerSign: 1,
      height: H_REAR,
      extMat: modernChampagnePanel,
      interiorMat: this.materials.wallDrywall,
      openings: [
        { u0: 11.2, u1: 18.2, sillY: 0.45, headY: 4.85, type: "window", louvers: true },
        { u0: 19.6, u1: 25.8, sillY: 0.45, headY: 4.85, type: "window", louvers: true }
      ]
    });

    // 9D. SOUTH CLERESTORY STEP-UP WALL (Z = +9.5, X: -22.0 -> +8.0, Y: 3.80m -> 5.60m, Exterior -Z above Front Roof!)
    // Bridges the 3.80m front lab roof up to the 5.60m high-bay Rear L-Wing roof with continuous daylight clerestory glazing!
    this._buildFramedExteriorElevation({
      axis: "X",
      fixedCoord: 9.5,
      uStart: -22.0,
      uEnd: 8.0,
      outerSign: -1,
      baseY: 3.80,
      height: H_REAR,
      extMat: modernChampagnePanel,
      interiorMat: this.materials.wallDrywall,
      openings: [
        { u0: -20.2, u1: -11.8, sillY: 4.10, headY: 5.18, type: "window", louvers: true, groundSpill: false },
        { u0: -10.2, u1: -1.8,  sillY: 4.10, headY: 5.18, type: "window", louvers: true, groundSpill: false },
        { u0: -0.2,  u1: 6.4,   sillY: 4.10, headY: 5.18, type: "window", louvers: true, groundSpill: false }
      ]
    });

    // 9E. Architectural Terracotta Feature Fin Towers & Structural Portal Columns Framing the Rear L-Wing
    [
      { x: -22.18, z: 9.5,  sx: 0.48, sy: H_REAR + 0.25, sz: 0.65 },
      { x: -22.18, z: 27.5, sx: 0.52, sy: H_REAR + 0.25, sz: 0.68 },
      { x: 8.18,   z: 27.5, sx: 0.52, sy: H_REAR + 0.25, sz: 0.68 },
      { x: 8.18,   z: 9.5,  sx: 0.48, sy: H_REAR + 0.25, sz: 0.65 }
    ].forEach((fp) => {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(fp.sx, fp.sy, fp.sz), terracottaAccentMat);
      fin.position.set(fp.x, fp.sy / 2, fp.z);
      fin.castShadow = true;
      fin.receiveShadow = true;
      this.root.add(fin);
    });

    // Interior Structural Portal Columns along Z = +9.5 (X = -14.5, -7.0) framing the wide-open walkthrough into the Rear L-Wing
    [-14.5, -7.0].forEach((cx) => {
      const colCore = new THREE.Mesh(new THREE.BoxGeometry(0.42, 3.80, 0.42), this.materials.architecturalBlackMetal);
      colCore.position.set(cx, 1.90, 9.5);
      colCore.castShadow = true;
      colCore.receiveShadow = true;
      this.root.add(colCore);

      const colWrap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 2.60, 0.46), this.materials.flutedWalnut);
      colWrap.position.set(cx, 1.36, 9.5);
      this.root.add(colWrap);

      const colPlinth = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.14, 0.50), this.materials.bronzeMullion);
      colPlinth.position.set(cx, 0.07, 9.5);
      this.root.add(colPlinth);

      this.colliders.push(new THREE.Box3().setFromObject(colCore));
    });
  }

  _buildExteriorBrickFacade() {
    // Add Projecting Architectural Brick Pilasters along South & North Facades + Open French Patio Doors on Break Room North!
    const facadeAccents = new THREE.Group();
    facadeAccents.name = "Architectural_Facade_Pilasters_And_Patio_Portal";
    const H = 3.8;
    const plinthH = 0.45;
    const southPilasterX = [-21.6, -15.6, -7.8, 0.2, 8.0, 16.0, 21.5, 25.0, 28.5, 32.0, 37.7];
    southPilasterX.forEach((px) => {
      const pier = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, H - plinthH, 0.09),
        this._createBrickCladdingMaterial(0.5, H - plinthH)
      );
      pier.position.set(px, plinthH + (H - plinthH) / 2, -9.76);
      pier.castShadow = true;
      pier.receiveShadow = true;
      facadeAccents.add(pier);

      const base = new THREE.Mesh(new THREE.BoxGeometry(0.48, plinthH + 0.04, 0.14), this.materials.limestonePlinth);
      base.position.set(px, (plinthH + 0.04) / 2, -9.77);
      facadeAccents.add(base);
    });

    const northPilasterX = [8.4, 16.0, 27.0, 33.5, 37.7];
    northPilasterX.forEach((px) => {
      const pier = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, H - plinthH, 0.09),
        this._createBrickCladdingMaterial(0.5, H - plinthH)
      );
      pier.position.set(px, plinthH + (H - plinthH) / 2, 9.76);
      pier.castShadow = true;
      pier.receiveShadow = true;
      facadeAccents.add(pier);

      const base = new THREE.Mesh(new THREE.BoxGeometry(0.48, plinthH + 0.04, 0.14), this.materials.limestonePlinth);
      base.position.set(px, (plinthH + 0.04) / 2, 9.77);
      facadeAccents.add(base);
    });

    // Break Room North Patio Double Glass French Doors (X = 32.28, Z = 9.56, Leaves Swung Open 78° Inviting Walk-Through!)
    const patioPortal = new THREE.Group();
    patioPortal.position.set(32.28, 0, 9.56);
    const doorW = 1.60;
    const doorH = 2.45;
    const hdr = new THREE.Mesh(new THREE.BoxGeometry(doorW, 0.07, 0.28), this.materials.bronzeMullion);
    hdr.position.set(0, doorH - 0.035, 0);
    patioPortal.add(hdr);
    [-doorW / 2 + 0.035, doorW / 2 - 0.035].forEach((jx, idx) => {
      const jamb = new THREE.Mesh(new THREE.BoxGeometry(0.07, doorH, 0.28), this.materials.bronzeMullion);
      jamb.position.set(jx, doorH / 2, 0);
      patioPortal.add(jamb);

      // Open-swinging glazed French leaf (no collider so WASD walks freely onto patio!)
      const leafPivot = new THREE.Group();
      leafPivot.position.set(jx, 0, 0.12);
      leafPivot.rotation.y = idx === 0 ? -Math.PI * 0.44 : Math.PI * 0.44;
      const leafW = (doorW - 0.16) / 2;
      const leafX = idx === 0 ? leafW / 2 : -leafW / 2;
      const leafFrame = new THREE.Mesh(new THREE.BoxGeometry(leafW, doorH - 0.08, 0.045), this.materials.bronzeMullion);
      leafFrame.position.set(leafX, (doorH - 0.08) / 2 + 0.02, 0);
      leafPivot.add(leafFrame);
      const leafGlass = new THREE.Mesh(new THREE.BoxGeometry(leafW - 0.12, doorH - 0.28, 0.052), this.materials.reflectiveExteriorGlass);
      leafGlass.position.set(leafX, (doorH - 0.08) / 2 + 0.04, 0);
      leafPivot.add(leafGlass);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.42, 12), this.materials.cabinetHandle);
      handle.position.set(idx === 0 ? leafW - 0.06 : -leafW + 0.06, 1.08, 0);
      leafPivot.add(handle);
      patioPortal.add(leafPivot);
    });
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(doorW, 0.015, 0.30), this.materials.cabinetHandle);
    saddle.position.set(0, 0.0075, 0);
    patioPortal.add(saddle);
    facadeAccents.add(patioPortal);

    this.root.add(facadeAccents);
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
    // 1. Exterior Double Door Assembly (Z = -9.5) — Plaza, Portico Canopy, Signage & Bollards are built in _buildExteriorCampusSite()
    this._buildDoubleDoorAssembly(13.0, 0, -9.5, "EXTERIOR_AIRLOCK", false);

    // 2. Grand Entrance Vestibule Walk-Off Floor Mat
    const matGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const mat = new THREE.Mesh(
      matGeo,
      new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.65, metalness: 0.08 })
    );
    mat.rotation.x = -Math.PI / 2;
    mat.position.set(13.0, 0.005, -7.8);
    mat.receiveShadow = true;
    this.root.add(mat);

    // 3. Facility Environmental Monitoring Screen on Entry Column
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

    // 2. Left Door Leaf (Pivoted at Left Outer Hinge X = -0.97)
    const isInteriorDouble = id !== "EXTERIOR_AIRLOCK";
    const swingDir = id === "LAB_RECEPTION_PORTAL" ? 1 : -1;
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-0.97, 0, 0);
    if (isInteriorDouble) leftPivot.rotation.y = swingDir * 1.34;

    const leftDoorGroup = new THREE.Group();
    leftDoorGroup.position.set(0.475, 0, 0);

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
    leftPivot.add(leftDoorGroup);
    group.add(leftPivot);

    // 3. Right Door Leaf (Pivoted at Right Outer Hinge X = +0.97)
    const rightPivot = new THREE.Group();
    rightPivot.position.set(0.97, 0, 0);
    if (isInteriorDouble) rightPivot.rotation.y = -swingDir * 1.34;

    const rightDoorGroup = new THREE.Group();
    rightDoorGroup.position.set(-0.475, 0, 0);

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
    rightPivot.add(rightDoorGroup);
    group.add(rightPivot);

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

    // Hollow Glazed Architectural Door Leaf (4 Perimeter Stiles/Rails around Clear Vision Glass — ZERO Opaque Slab!)
    const leafW = doorW - 0.08;
    const stileW = 0.085;
    const innerW = leafW - stileW * 2;

    const leafPivot = new THREE.Group();
    leafPivot.position.set(-leafW / 2, 0, 0);
    leafPivot.rotation.y = cz < 0 ? 1.38 : -1.38;

    const leafGroup = new THREE.Group();
    leafGroup.position.set(leafW / 2, 0, 0);

    const stileGeo = new THREE.BoxGeometry(stileW, doorH - 0.02, 0.04);
    const leftStile = new THREE.Mesh(stileGeo, jambMat);
    leftStile.position.set(-leafW / 2 + stileW / 2, (doorH - 0.02) / 2 + 0.01, 0);
    leafGroup.add(leftStile);

    const rightStile = new THREE.Mesh(stileGeo, jambMat);
    rightStile.position.set(leafW / 2 - stileW / 2, (doorH - 0.02) / 2 + 0.01, 0);
    leafGroup.add(rightStile);

    const topRail = new THREE.Mesh(new THREE.BoxGeometry(innerW, 0.09, 0.04), jambMat);
    topRail.position.set(0, doorH - 0.055, 0);
    leafGroup.add(topRail);

    const bottomRail = new THREE.Mesh(new THREE.BoxGeometry(innerW, 0.24, 0.04), jambMat);
    bottomRail.position.set(0, 0.13, 0);
    leafGroup.add(bottomRail);

    const isPrivacyDoor = /LOCKER|RESTROOM/i.test(id);
    const visionMat = isPrivacyDoor ? this.materials.showerFrostedGlass : glassMat;
    const visionH = doorH - 0.34;
    const vision = new THREE.Mesh(new THREE.BoxGeometry(innerW, visionH, 0.014), visionMat);
    vision.position.set(0, 0.25 + visionH / 2, 0);
    leafGroup.add(vision);

    const handleGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.48, 16);
    [-0.034, 0.034].forEach(zOff => {
      const h = new THREE.Mesh(handleGeo, handleMat);
      h.position.set(leafW / 2 - 0.045, 1.05, zOff);
      leafGroup.add(h);
    });

    const kickGeo = new THREE.BoxGeometry(leafW - 0.02, 0.22, 0.003);
    [-0.0215, 0.0215].forEach(kz => {
      const kp = new THREE.Mesh(kickGeo, this.materials.kickplateStainless);
      kp.position.set(0, 0.12, kz);
      leafGroup.add(kp);
    });

    const closerGroup = new THREE.Group();
    closerGroup.position.set(-0.22, doorH - 0.04, 0.055);
    const closerBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.06, 0.045),
      this.materials.doorCloserAluminum
    );
    closerGroup.add(closerBody);
    group.add(closerGroup);

    leafPivot.add(leafGroup);
    group.add(leafPivot);
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
    const H_REAR = 5.60;

    // 1. Interior Ceiling Panels (Single-sided facing downward -Y so Walk/low views see solid ceiling,
    //    and overhead cutaway orbit back-face culls cleanly when roofGroup auto-hides).
    //    Framed around the 5.6m x 11.0m Reception Atrium Skylight shaft (X: 9.2..14.8, Z: -5.2..5.8).
    const ceilingPanels = [
      { cx: -6.4, cz: 0.0,   w: 31.2, d: 19.0, y: H },      // Expanded West Main Lab (-22.0..9.2, -9.5..9.5)
      { cx: -7.0, cz: 18.5,  w: 30.0, d: 18.0, y: H_REAR }, // High-Bay Rear North L-Wing (-22.0..8.0, 9.5..27.5)
      { cx: 12.0, cz: -7.35, w: 5.6,  d: 4.3,  y: H },      // Reception South of Skylight (9.2..14.8, -9.5..-5.2)
      { cx: 12.0, cz: 7.65,  w: 5.6,  d: 3.7,  y: H },      // Reception North of Skylight (9.2..14.8, 5.8..9.5)
      { cx: 26.4, cz: 0.0,   w: 23.2, d: 19.0, y: H },      // East Executive & Locker Wing (14.8..38.0, -9.5..9.5)
      { cx: 41.0, cz: 0.0,   w: 6.0,  d: 16.0, y: H }       // Far East Women's Suite (38.0..44.0, -8.0..8.0)
    ];
    ceilingPanels.forEach((p) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.d), this.materials.ceilingDark);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.set(p.cx, p.y || H, p.cz);
      this.root.add(mesh);
    });

    // Crisp Bronze Interior Lightwell Trim framing the Reception Atrium Skylight aperture
    const skyRimGroup = new THREE.Group();
    skyRimGroup.name = "Reception_Skylight_Interior_Bezel";
    const skX0 = 9.2, skX1 = 14.8, skZ0 = -5.2, skZ1 = 5.8;
    const skW = skX1 - skX0, skD = skZ1 - skZ0;
    const skCX = (skX0 + skX1) / 2, skCZ = (skZ0 + skZ1) / 2;
    [
      { x: skCX, z: skZ0, sx: skW + 0.12, sz: 0.08 },
      { x: skCX, z: skZ1, sx: skW + 0.12, sz: 0.08 },
      { x: skX0, z: skCZ, sx: 0.08, sz: skD },
      { x: skX1, z: skCZ, sx: 0.08, sz: skD }
    ].forEach((b) => {
      const trim = new THREE.Mesh(new THREE.BoxGeometry(b.sx, 0.08, b.sz), this.materials.bronzeMullion);
      trim.position.set(b.x, H - 0.02, b.z);
      skyRimGroup.add(trim);
    });
    this.root.add(skyRimGroup);

    // 2. Physical Atmospheric Sky Dome + Full-Campus Sun, Hemisphere, Fill & Ambient Rig
    this.sky = new Sky();
    this.sky.scale.setScalar(880);
    this.sky.name = "Physical_Atmosphere_Sky_Dome";
    this.scene.add(this.sky);

    this.ambientLight = new THREE.AmbientLight(0xfff9f0, 0.42);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x7b8673, 0.85);
    this.hemiLight.position.set(14.0, 50.0, 0.0);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff8ed, 2.65);
    this.sunLight.position.set(36.0, 54.0, -52.0);
    this.sunLight.target.position.set(14.0, 0.0, -4.0);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 4096;
    this.sunLight.shadow.mapSize.height = 4096;
    this.sunLight.shadow.camera.near = 2.0;
    this.sunLight.shadow.camera.far = 185.0;
    this.sunLight.shadow.camera.left = -64.0;
    this.sunLight.shadow.camera.right = 64.0;
    this.sunLight.shadow.camera.top = 56.0;
    this.sunLight.shadow.camera.bottom = -56.0;
    this.sunLight.shadow.bias = -0.00035;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);

    this.fillLight = new THREE.DirectionalLight(0xdbeafe, 0.55);
    this.fillLight.position.set(-28.0, 22.0, 28.0);
    this.scene.add(this.fillLight);

    // 3. Suspended Acoustic Ceiling Clouds & Linear LED Luminaires
    const luminaireFrameMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.35, metalness: 0.65 });
    const benchLinearLights = [
      // 1A. Analytical & Pharmaceutical QC Front Lab Islands (Including Expanded West Bay!)
      { x: -17.5, z: -4.0, len: 6.4, sx: 6.8, sz: 2.2, ceilH: H },
      { x: -10.0, z: -4.0, len: 6.8, sx: 7.2, sz: 2.2, ceilH: H },
      { x: -2.0,  z: -4.0, len: 6.8, sx: 7.2, sz: 2.2, ceilH: H },
      { x: -17.5, z: 5.0,  len: 6.0, sx: 6.4, sz: 2.2, ceilH: H },
      { x: -10.0, z: 5.0,  len: 6.0, sx: 6.4, sz: 2.2, ceilH: H },
      { x: -0.5,  z: 5.0,  len: 6.0, sx: 6.4, sz: 2.2, ceilH: H },

      // 1B. Rear North L-Wing High-Bay Research Expansion Islands (Y_ceil = 5.60m)
      { x: -15.5, z: 15.0, len: 6.4, sx: 6.8, sz: 2.2, ceilH: H_REAR },
      { x: -7.0,  z: 15.0, len: 6.4, sx: 6.8, sz: 2.2, ceilH: H_REAR },
      { x: 1.5,   z: 15.0, len: 6.4, sx: 6.8, sz: 2.2, ceilH: H_REAR },
      { x: -15.5, z: 21.5, len: 6.4, sx: 6.8, sz: 2.2, ceilH: H_REAR },
      { x: -7.0,  z: 21.5, len: 6.4, sx: 6.8, sz: 2.2, ceilH: H_REAR },
      { x: 1.5,   z: 21.5, len: 6.4, sx: 6.8, sz: 2.2, ceilH: H_REAR },

      // 2. Grand Entrance Pavilion, Reception & Waiting Gallery (Open skylight above — sleek linear bar only!)
      { x: 12.0, z: -3.2, len: 4.2, sx: 0, sz: 0, ceilH: H },
      { x: 12.0, z: 4.5,  len: 4.4, sx: 0, sz: 0, ceilH: H },

      // 3. Central Circulation Spine Hallway Continuous Run
      { x: 21.0, z: 0.0, len: 9.0, sx: 9.6, sz: 1.4, ceilH: H },
      { x: 31.0, z: 0.0, len: 9.0, sx: 9.6, sz: 1.4, ceilH: H },

      // 4. North Wing
      { x: 19.5,  z: 5.5, len: 5.5, sx: 6.0, sz: 2.2, ceilH: H },
      { x: 24.5,  z: 5.5, len: 5.5, sx: 6.0, sz: 2.2, ceilH: H },
      { x: 30.25, z: 5.5, len: 4.8, sx: 5.4, sz: 2.6, ceilH: H },
      { x: 35.75, z: 5.5, len: 3.6, sx: 4.0, sz: 2.2, ceilH: H },

      // 5. South Wing
      { x: 18.75, z: -5.5, len: 4.5, sx: 5.0, sz: 2.4, ceilH: H },
      { x: 23.25, z: -5.5, len: 2.8, sx: 3.2, sz: 1.8, ceilH: H },
      { x: 26.75, z: -5.5, len: 2.8, sx: 3.2, sz: 1.8, ceilH: H },
      { x: 30.25, z: -5.5, len: 2.8, sx: 3.2, sz: 1.8, ceilH: H },
      { x: 35.0,  z: -5.5, len: 4.5, sx: 5.0, sz: 2.4, ceilH: H },

      // 6. Women's Locker Room, Changing Room & Luxury Showers
      { x: 41.0, z: -3.5, len: 4.5, sx: 5.2, sz: 2.4, ceilH: H },
      { x: 41.0, z: 3.5,  len: 4.5, sx: 5.2, sz: 2.4, ceilH: H }
    ];

    benchLinearLights.forEach((cfg) => {
      const cH = cfg.ceilH || H;
      const lumY = cH > 4.5 ? 4.35 : 3.1;
      if (cfg.sx > 0 && cfg.sz > 0) {
        const cloud = new THREE.Mesh(
          new THREE.BoxGeometry(cfg.sx, 0.05, cfg.sz),
          this.materials.acousticCloud
        );
        cloud.position.set(cfg.x, cH - 0.35, cfg.z);
        this.root.add(cloud);
      }

      const luminaire = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.len, 0.06, 0.14),
        luminaireFrameMat
      );
      luminaire.position.set(cfg.x, lumY, cfg.z);
      this.root.add(luminaire);

      const diffuser = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.len - 0.05, 0.015, 0.12),
        this.materials.ledLightPanel
      );
      diffuser.position.set(cfg.x, lumY - 0.035, cfg.z);
      this.root.add(diffuser);

      const point = new THREE.PointLight(0xfff4e0, 1.05, 14.5, 1.15);
      point.position.set(cfg.x, lumY - 0.15, cfg.z);
      point.userData.baseIntensity = 1.05;
      this.interiorPointLights.push(point);
      this.root.add(point);
    });
  }

  _buildRoofAndPenthouse() {
    const H = 3.8;
    const H_REAR = 5.60;
    const deckY = H + 0.04;
    const deckT = 0.08;

    // 1A. Structural TPO Roof Decks on Lower 3.80m Front Wings Framed Around Reception Atrium Skylight (X: 9.2..14.8, Z: -5.2..5.8)
    const roofSlabs = [
      { cx: -6.4, cz: 0.0,   w: 31.2, d: 19.16 }, // Expanded West Main Lab (-22.0..9.2)
      { cx: 12.0, cz: -7.39, w: 5.6,  d: 4.38 },  // Reception South of Skylight
      { cx: 12.0, cz: 7.69,  w: 5.6,  d: 3.78 },  // Reception North of Skylight
      { cx: 26.4, cz: 0.0,   w: 23.2, d: 19.16 }, // East Executive & Locker Wing
      { cx: 41.0, cz: 0.0,   w: 6.08, d: 16.16 }  // Far East Women's Suite
    ];
    roofSlabs.forEach((s) => {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(s.w, deckT, s.d), this.materials.roofMembrane);
      slab.position.set(s.cx, deckY, s.cz);
      slab.castShadow = true;
      slab.receiveShadow = true;
      this.roofGroup.add(slab);
    });

    // 1B. Modern High-Bay Rear North L-Wing Sculpted Wing-Roof & Terracotta Feature Tower (X: -23.6..+9.4, Z: +7.4..+29.0)
    //     Modeled after Torrey View & Thrasher Works references:
    //     - Angled mono-pitch wing roof lifting toward the South-West front (Y = 5.65m -> 6.35m)
    //     - Deep 2.1m South cantilever over the upper clerestory glazing exposing a warm Western Red Cedar soffit
    //     - Bold 0.52m Champagne-Alabaster architectural fascia frame + 7.2m Terracotta Corner Feature Tower!
    const rearRoofY = H_REAR + 0.28;
    const rearWingW = 33.20;
    const rearWingD = 21.60;
    const rearWingCX = -7.1;
    const rearWingCZ = 18.20;

    const fasciaChampagne = new THREE.MeshStandardMaterial({
      color: 0xebe5dc,
      roughness: 0.30,
      metalness: 0.22,
      name: "Mat_RearWing_Fascia_Champagne"
    });
    const cedarWingSoffitMat = new THREE.MeshStandardMaterial({
      color: 0xa86032,
      roughness: 0.44,
      metalness: 0.06,
      name: "Mat_RearWing_Cedar_Soffit"
    });
    const terracottaTowerMat = new THREE.MeshStandardMaterial({
      color: 0xb85228,
      roughness: 0.48,
      metalness: 0.12,
      name: "Mat_RearWing_Terracotta_Tower"
    });

    const rearWingRoofAssembly = new THREE.Group();
    rearWingRoofAssembly.position.set(rearWingCX, rearRoofY, rearWingCZ);
    rearWingRoofAssembly.rotation.x = -0.036; // Lifts the South (-Z) cantilevered leading edge higher toward the front camera!
    rearWingRoofAssembly.rotation.z = -0.018; // Subtle modern architectural butterfly lift toward the West (-X)

    const rearTpoDeck = new THREE.Mesh(
      new THREE.BoxGeometry(rearWingW, 0.16, rearWingD),
      this.materials.roofMembrane
    );
    rearTpoDeck.position.set(0, 0.08, 0);
    rearTpoDeck.castShadow = true;
    rearTpoDeck.receiveShadow = true;
    rearWingRoofAssembly.add(rearTpoDeck);

    // Warm Ribbed Western Red Cedar Soffit Underside on Cantilevered Rear L-Wing Roof (Visible from Front Overview!)
    const rearSoffit = new THREE.Mesh(
      new THREE.BoxGeometry(rearWingW - 0.12, 0.05, rearWingD - 0.12),
      cedarWingSoffitMat
    );
    rearSoffit.position.set(0, -0.03, 0);
    rearSoffit.receiveShadow = true;
    rearWingRoofAssembly.add(rearSoffit);

    // Exposed Glulam Cedar Outrigger Beams under the Rear L-Wing Roof Cantilever
    for (let rx = -15.0; rx <= 15.0; rx += 2.5) {
      const glulam = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.20, rearWingD - 0.18),
        this.materials.flutedWalnut
      );
      glulam.position.set(rx, -0.11, 0);
      glulam.castShadow = true;
      rearWingRoofAssembly.add(glulam);
    }

    // Bold Sculpted Champagne-Alabaster Perimeter Fascia Frame + Charcoal Knife-Edge Shadow Reveal
    [
      { x: 0, z: -rearWingD / 2, sx: rearWingW + 0.28, sz: 0.18 },
      { x: 0, z:  rearWingD / 2, sx: rearWingW + 0.28, sz: 0.18 },
      { x: -rearWingW / 2, z: 0, sx: 0.18, sz: rearWingD },
      { x:  rearWingW / 2, z: 0, sx: 0.18, sz: rearWingD }
    ].forEach((fb) => {
      const upperFascia = new THREE.Mesh(new THREE.BoxGeometry(fb.sx, 0.48, fb.sz), fasciaChampagne);
      upperFascia.position.set(fb.x, 0.18, fb.z);
      upperFascia.castShadow = true;
      rearWingRoofAssembly.add(upperFascia);

      const lowerTrim = new THREE.Mesh(new THREE.BoxGeometry(fb.sx + 0.06, 0.10, fb.sz + 0.06), this.materials.architecturalBlackMetal);
      lowerTrim.position.set(fb.x, -0.08, fb.z);
      rearWingRoofAssembly.add(lowerTrim);
    });

    this.roofGroup.add(rearWingRoofAssembly);

    // Signature Torrey-View Terracotta Vertical Feature Tower on the South-West Corner of the Rear L-Wing (X = -22.1, Z = 11.2, H = 7.1m)
    const swTowerGroup = new THREE.Group();
    swTowerGroup.position.set(-22.1, 0, 11.2);
    const swTowerBody = new THREE.Mesh(new THREE.BoxGeometry(4.2, 7.1, 4.6), terracottaTowerMat);
    swTowerBody.position.y = 3.55;
    swTowerBody.castShadow = true;
    swTowerBody.receiveShadow = true;
    swTowerGroup.add(swTowerBody);

    const swTowerCap = new THREE.Mesh(new THREE.BoxGeometry(4.44, 0.24, 4.84), fasciaChampagne);
    swTowerCap.position.y = 7.22;
    swTowerGroup.add(swTowerCap);

    const swTowerGlass = new THREE.Mesh(new THREE.BoxGeometry(2.2, 5.8, 0.12), this.materials.reflectiveExteriorGlass);
    swTowerGlass.position.set(0, 3.6, -2.32);
    swTowerGroup.add(swTowerGlass);
    this.roofGroup.add(swTowerGroup);

    // Light-grey Non-Slip Rooftop Maintenance Walkway Pads
    const padMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 0.88, metalness: 0.05 });
    [
      { x: -10.5, z: 0.0,  y: deckY + deckT / 2 + 0.008, w: 18.0, d: 1.1 },
      { x: 25.0,  z: 2.6,  y: deckY + deckT / 2 + 0.008, w: 18.0, d: 1.0 },
      { x: -7.0,  z: 19.5, y: rearRoofY + 0.25,          w: 20.0, d: 1.1 }
    ].forEach((p) => {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(p.w, 0.015, p.d), padMat);
      pad.position.set(p.x, p.y, p.z);
      pad.receiveShadow = true;
      this.roofGroup.add(pad);
    });

    // 2. Reception Atrium Architectural Pitched Glass Skylight (X: 9.2..14.8, Z: -5.2..5.8)
    const skylight = new THREE.Group();
    skylight.name = "Reception_Atrium_Glass_Skylight";
    const skX0 = 9.2, skX1 = 14.8, skZ0 = -5.2, skZ1 = 5.8;
    const skW = skX1 - skX0, skD = skZ1 - skZ0;
    const skCX = (skX0 + skX1) / 2, skCZ = (skZ0 + skZ1) / 2;
    const curbBaseY = deckY + deckT / 2;
    const curbH = 0.20;

    // Insulated Bronze Roof Curb
    [
      { x: skCX, z: skZ0, sx: skW + 0.18, sz: 0.14 },
      { x: skCX, z: skZ1, sx: skW + 0.18, sz: 0.14 },
      { x: skX0, z: skCZ, sx: 0.14, sz: skD },
      { x: skX1, z: skCZ, sx: 0.14, sz: skD }
    ].forEach((c) => {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(c.sx, curbH, c.sz), this.materials.bronzeMullion);
      curb.position.set(c.x, curbBaseY + curbH / 2, c.z);
      curb.castShadow = true;
      skylight.add(curb);
    });

    // Pitched Gable Glass Slopes + Central Bronze Ridge Beam + Transverse Rafters
    const riseH = 0.52;
    const halfSpan = skW / 2;
    const slopeLen = Math.hypot(halfSpan, riseH);
    const slopeAngle = Math.atan2(riseH, halfSpan);
    const eaveY = curbBaseY + curbH;

    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.12, skD + 0.16), this.materials.bronzeMullion);
    ridge.position.set(skCX, eaveY + riseH, skCZ);
    ridge.castShadow = true;
    skylight.add(ridge);

    [-1, 1].forEach((side) => {
      const glassSlope = new THREE.Mesh(
        new THREE.BoxGeometry(slopeLen, 0.025, skD),
        this.materials.reflectiveExteriorGlass
      );
      glassSlope.position.set(skCX + side * (halfSpan / 2), eaveY + riseH / 2, skCZ);
      glassSlope.rotation.z = -side * slopeAngle;
      glassSlope.castShadow = false; // Allow crisp sunlight straight into Reception
      skylight.add(glassSlope);

      for (let r = 0; r <= 8; r++) {
        const rz = skZ0 + (r / 8) * skD;
        const rafter = new THREE.Mesh(new THREE.BoxGeometry(slopeLen + 0.06, 0.065, 0.06), this.materials.bronzeMullion);
        rafter.position.set(skCX + side * (halfSpan / 2), eaveY + riseH / 2 + 0.01, rz);
        rafter.rotation.z = -side * slopeAngle;
        rafter.castShadow = true;
        skylight.add(rafter);
      }
    });

    // Triangular Gable End Glass Infills
    const gableShape = new THREE.Shape();
    gableShape.moveTo(-halfSpan, 0);
    gableShape.lineTo(halfSpan, 0);
    gableShape.lineTo(0, riseH);
    gableShape.closePath();
    const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: 0.025, bevelEnabled: false });
    [skZ0 - 0.012, skZ1 - 0.012].forEach((gz) => {
      const gablePane = new THREE.Mesh(gableGeo, this.materials.reflectiveExteriorGlass);
      gablePane.position.set(skCX, eaveY, gz);
      skylight.add(gablePane);
    });

    // Warm Interior Atrium Glow Diffuser Visible Through Reception Skylight at Dusk & Night
    const skylightGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(skW - 0.16, skD - 0.16),
      new THREE.MeshBasicMaterial({
        map: this._getWarmWindowGlowTexture(),
        transparent: true,
        opacity: 0.74,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    skylightGlow.rotation.x = -Math.PI / 2;
    skylightGlow.position.set(skCX, eaveY - 0.04, skCZ);
    skylightGlow.visible = false;
    skylightGlow.userData.baseOpacity = 0.76;
    this.nightWindowGlowMeshes.push(skylightGlow);
    skylight.add(skylightGlow);

    const skylightUpLight = new THREE.PointLight(0xffd28a, 18.0, 14.0, 1.5);
    skylightUpLight.position.set(skCX, eaveY + 0.45, skCZ);
    skylightUpLight.userData.baseIntensity = 18.0;
    this.exteriorNightLights.push(skylightUpLight);
    skylight.add(skylightUpLight);

    this.roofGroup.add(skylight);

    // 3. Rooftop Mechanical HVAC Packaged Air-Handling Units (AHU-1 Front Lab, AHU-2 High-Bay Rear L-Wing, RTU-3 Executive Wing)
    const galvSteel = new THREE.MeshStandardMaterial({ color: 0x9aa5b4, roughness: 0.38, metalness: 0.72 });
    const darkGrille = new THREE.MeshStandardMaterial({ color: 0x1e2530, roughness: 0.55, metalness: 0.65 });
    const buildRooftopAHU = (cx, cz, w, h, d, numFans = 2, baseElev = curbBaseY) => {
      const ahu = new THREE.Group();
      ahu.position.set(cx, baseElev, cz);

      // Structural Steel Dunnage I-Beams
      [-d / 2 + 0.22, d / 2 - 0.22].forEach((dz) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.16, 0.12), this.materials.architecturalBlackMetal);
        rail.position.set(0, 0.08, dz);
        rail.castShadow = true;
        ahu.add(rail);
      });

      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), galvSteel);
      body.position.set(0, 0.16 + h / 2, 0);
      body.castShadow = true;
      body.receiveShadow = true;
      ahu.add(body);

      // Recessed Access Doors & Intake Louver Bank
      const louver = new THREE.Mesh(new THREE.BoxGeometry(w * 0.36, h * 0.68, d + 0.03), darkGrille);
      louver.position.set(-w * 0.26, 0.16 + h / 2, 0);
      ahu.add(louver);

      // Condenser Axial Fan Shrouds & Blades on Top
      for (let f = 0; f < numFans; f++) {
        const fx = (numFans === 1) ? w * 0.15 : -w * 0.12 + f * (w * 0.42);
        const shroud = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.18, 20), this.materials.architecturalBlackMetal);
        shroud.position.set(fx, 0.16 + h + 0.09, 0);
        shroud.castShadow = true;
        ahu.add(shroud);

        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.20, 12), galvSteel);
        hub.position.set(fx, 0.16 + h + 0.09, 0);
        ahu.add(hub);

        for (let b = 0; b < 5; b++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.012, 0.09), darkGrille);
          const ang = (b / 5) * Math.PI * 2;
          blade.position.set(fx + Math.cos(ang) * 0.20, 0.16 + h + 0.12, Math.sin(ang) * 0.20);
          blade.rotation.set(0.28, -ang, 0);
          ahu.add(blade);
        }
      }

      // Insulated Supply & Return Sheet-Metal Duct Drops into Roof Curbs
      [-0.45, 0.45].forEach((dz) => {
        const elbow = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.62, 0.58), galvSteel);
        elbow.position.set(w / 2 + 0.34, 0.16 + h * 0.55, dz * (d * 0.48));
        elbow.castShadow = true;
        ahu.add(elbow);

        const riser = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.16 + h * 0.55, 0.54), galvSteel);
        riser.position.set(w / 2 + 0.56, (0.16 + h * 0.55) / 2, dz * (d * 0.48));
        riser.castShadow = true;
        ahu.add(riser);
      });

      // NEMA 3R Disconnect Switch Box
      const disc = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.12), this.materials.cabinetBody);
      disc.position.set(-w / 2 - 0.06, 0.16 + h * 0.55, d * 0.28);
      ahu.add(disc);

      this.roofGroup.add(ahu);
    };

    buildRooftopAHU(-9.8, 1.8, 4.2, 1.42, 2.15, 2, curbBaseY);         // Front Main Lab VAV & Make-Up Air Unit
    buildRooftopAHU(-4.5, 19.5, 4.6, 1.50, 2.25, 2, rearRoofY + 0.14); // High-Bay Rear L-Wing 100% Outdoor-Air AHU
    buildRooftopAHU(24.5, -0.6, 2.8, 1.15, 1.65, 1, curbBaseY);        // Executive Wing Heat-Pump RTU

    // 4. High-Plume Stainless Fume-Hood Exhaust Fans & Venturi Stacks (Mounted on High-Bay Rear L-Wing Roof above North Synthesis Bay!)
    [-17.5, -13.5].forEach((sx) => {
      const stackGrp = new THREE.Group();
      stackGrp.position.set(sx, rearRoofY + 0.14, 25.2);

      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.28, 0.92), galvSteel);
      curb.position.y = 0.14;
      stackGrp.add(curb);

      const plenum = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.52, 18), this.materials.cabinetHandle);
      plenum.position.y = 0.54;
      plenum.castShadow = true;
      stackGrp.add(plenum);

      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.30, 1.45, 18), this.materials.cabinetHandle);
      stack.position.y = 1.52;
      stack.castShadow = true;
      stackGrp.add(stack);

      const windband = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.28, 0.42, 18, 1, true), this.materials.cabinetHandle);
      windband.material = this.materials.cabinetHandle.clone();
      windband.material.side = THREE.DoubleSide;
      windband.position.y = 2.34;
      windband.castShadow = true;
      stackGrp.add(windband);

      this.roofGroup.add(stackGrp);
    });

    // 5. South-Tilted Rooftop Monocrystalline Solar PV Arrays
    const pvCellMat = new THREE.MeshStandardMaterial({
      color: 0x0f1d35,
      roughness: 0.18,
      metalness: 0.72,
      name: "Mat_Solar_PV_Monocrystalline"
    });
    const buildSolarBank = (startX, count, rowZ, baseElev = curbBaseY) => {
      for (let i = 0; i < count; i++) {
        const px = startX + i * 1.12;
        const pv = new THREE.Group();
        pv.position.set(px, baseElev, rowZ);

        const legF = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.05), galvSteel);
        legF.position.set(0, 0.09, -0.58);
        pv.add(legF);

        const legB = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.56, 0.05), galvSteel);
        legB.position.set(0, 0.28, 0.58);
        pv.add(legB);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.035, 1.68), galvSteel);
        frame.position.set(0, 0.38, 0);
        frame.rotation.x = 0.28; // Tilted toward South sun (-Z)
        frame.castShadow = true;
        pv.add(frame);

        const cells = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.01, 1.62), pvCellMat);
        cells.position.set(0, 0.398, -0.005);
        cells.rotation.x = 0.28;
        pv.add(cells);

        this.roofGroup.add(pv);
      }
    };
    buildSolarBank(16.8, 6, -5.8, curbBaseY);
    buildSolarBank(16.8, 6, -3.4, curbBaseY);
    buildSolarBank(28.0, 7, -5.8, curbBaseY);
    buildSolarBank(28.0, 7, -3.4, curbBaseY);
    buildSolarBank(-19.5, 10, 13.5, rearRoofY + 0.14);
    buildSolarBank(-19.5, 10, 16.2, rearRoofY + 0.14);
  }

  _getOrBuildEnvMap(mood) {
    if (!this.renderer) return null;
    if (this.envMapCache.has(mood)) return this.envMapCache.get(mood);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    pmrem.compileEquirectangularShader();

    let rt;
    if (mood === "night") {
      rt = pmrem.fromScene(new RoomEnvironment(), 0.04);
    } else {
      const envScene = new THREE.Scene();
      const envSky = new Sky();
      envSky.scale.setScalar(100);
      const u = envSky.material.uniforms;
      const sunVec = new THREE.Vector3();
      if (mood === "dusk") {
        u.turbidity.value = 10.5;
        u.rayleigh.value = 3.45;
        u.mieCoefficient.value = 0.018;
        u.mieDirectionalG.value = 0.92;
        const phi = THREE.MathUtils.degToRad(90 - 3.2);
        const theta = THREE.MathUtils.degToRad(-154);
        sunVec.setFromSphericalCoords(1, phi, theta);
      } else {
        u.turbidity.value = 2.4;
        u.rayleigh.value = 1.35;
        u.mieCoefficient.value = 0.004;
        u.mieDirectionalG.value = 0.80;
        const phi = THREE.MathUtils.degToRad(90 - 44.0);
        const theta = THREE.MathUtils.degToRad(-142);
        sunVec.setFromSphericalCoords(1, phi, theta);
      }
      u.sunPosition.value.copy(sunVec);
      envScene.add(envSky);

      const groundBounce = new THREE.Mesh(
        new THREE.SphereGeometry(40, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
        new THREE.MeshBasicMaterial({
          color: mood === "dusk" ? 0x5c382c : 0x5c6b57,
          side: THREE.BackSide
        })
      );
      envScene.add(groundBounce);
      rt = pmrem.fromScene(envScene, 0.03);
    }

    pmrem.dispose();
    this.envMapCache.set(mood, rt.texture);
    return rt.texture;
  }

  _getRadialLightPoolTexture(innerHex = "#ffe6b3") {
    if (this._lightPoolTexCache.has(innerHex)) {
      return this._lightPoolTexCache.get(innerHex);
    }
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d");
    // Ultra-soft Gaussian-like atmospheric wash (zero blown-out white center disc or hard circular rim!)
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0.0, "rgba(255, 232, 185, 0.36)");
    g.addColorStop(0.22, "rgba(255, 224, 168, 0.25)");
    g.addColorStop(0.48, "rgba(255, 212, 145, 0.11)");
    g.addColorStop(0.75, "rgba(255, 198, 122, 0.03)");
    g.addColorStop(1.0, "rgba(255, 185, 100, 0.0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(c);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    this._lightPoolTexCache.set(innerHex, tex);
    return tex;
  }

  // Soft Rectangular-Elliptical Ground Wash Texture matching rectangular LED luminaires
  _getDiffusedRectangularWashTexture() {
    if (this._lightPoolTexCache.has("__rect_wash__")) {
      return this._lightPoolTexCache.get("__rect_wash__");
    }
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 512, 512);
    const imgData = ctx.createImageData(512, 512);
    const d = imgData.data;
    for (let y = 0; y < 512; y++) {
      const ny = (y - 256) / 256;
      for (let x = 0; x < 512; x++) {
        const nx = (x - 256) / 256;
        // Rounded super-elliptical Gaussian distance matching a diffused rectangular luminaire wash
        const r2 = Math.pow(Math.abs(nx), 2.15) + Math.pow(Math.abs(ny), 2.15);
        const falloff = r2 >= 1.0 ? 0.0 : Math.exp(-3.6 * r2) * Math.pow(1.0 - r2, 1.8);
        const idx = (y * 512 + x) * 4;
        d[idx] = 255;
        d[idx + 1] = 228;
        d[idx + 2] = 176;
        d[idx + 3] = Math.round(255 * falloff * 0.34);
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    this._lightPoolTexCache.set("__rect_wash__", tex);
    return tex;
  }

  // Custom View-Normal Fresnel + Vertical & Radial Gaussian ShaderMaterial for Diffused Rectangular Light Beams
  // Completely eliminates the harsh diagonal silhouette edge of standard ConeGeometry!
  _getDiffusedBeamShaderMaterial() {
    if (this._diffusedBeamShaderMat) return this._diffusedBeamShaderMat;
    this._diffusedBeamShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xffe2a8) },
        uOpacity: { value: 0.072 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormalView;
        varying vec3 vViewDir;
        void main() {
          vUv = uv;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vNormalView = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vNormalView;
        varying vec3 vViewDir;
        void main() {
          // Smooth grazing-angle Fresnel fade so silhouette edges dissolve into 0.0 alpha (zero hard line!)
          float ndv = abs(dot(normalize(vNormalView), normalize(vViewDir)));
          float edgeFade = smoothstep(0.0, 0.85, ndv) * pow(ndv, 2.2);
          // Vertical fade: gentle near the rectangular luminaire emitter (v=1), dissolving smoothly toward ground (v=0)
          float vertFade = pow(clamp(vUv.y, 0.0, 1.0), 1.65) * smoothstep(1.0, 0.88, vUv.y);
          float alpha = uOpacity * edgeFade * vertFade;
          if (alpha < 0.001) discard;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    return this._diffusedBeamShaderMat;
  }

  // Creates a Rectangular-Origin Diffused Volumetric Beam whose top exactly matches the rectangular luminaire face (topW x topD)
  // and flares softly downward into an elliptical/rounded-rectangular ground footprint (botW x botD) over height H.
  _createDiffusedRectangularBeamMesh(topW, topD, botW, botD, height) {
    const radialSegs = 40;
    const heightSegs = 16;
    const geo = new THREE.CylinderGeometry(1.0, 1.0, height, radialSegs, heightSegs, true);
    const pos = geo.attributes.position;
    const halfH = height / 2;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const tTop = (y + halfH) / height; // 1.0 at top (luminaire face), 0.0 at bottom (ground)
      const angle = Math.atan2(z, x);
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);

      // Super-ellipse exponent blends from crisp rounded-rectangle (n=4.2) at luminaire head to soft oval (n=2.2) at ground
      const expN = 2.2 + 2.0 * Math.pow(tTop, 1.4);
      const denom = Math.pow(Math.pow(Math.abs(ca), expN) + Math.pow(Math.abs(sa), expN), 1.0 / expN) || 1.0;
      const rx = (botW * 0.5) * (1.0 - tTop) + (topW * 0.5) * tTop;
      const rz = (botD * 0.5) * (1.0 - tTop) + (topD * 0.5) * tTop;

      pos.setX(i, (ca / denom) * rx);
      pos.setZ(i, (sa / denom) * rz);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, this._getDiffusedBeamShaderMaterial());
  }

  _getWarmWindowGlowTexture() {
    if (this._lightPoolTexCache.has("__warm_window__")) {
      return this._lightPoolTexCache.get("__warm_window__");
    }
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d");
    // Warm ceiling luminaire radiance softly grading toward floor for realistic lit interior depth
    const lg = ctx.createLinearGradient(0, 0, 0, 256);
    lg.addColorStop(0.0, "rgba(255, 240, 204, 0.96)");
    lg.addColorStop(0.38, "rgba(255, 216, 152, 0.86)");
    lg.addColorStop(0.78, "rgba(248, 192, 118, 0.72)");
    lg.addColorStop(1.0, "rgba(225, 162, 92, 0.58)");
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this._lightPoolTexCache.set("__warm_window__", tex);
    return tex;
  }

  setAtmosphereMood(mood = "daylight") {
    this.currentMood = mood;
    const sunVec = new THREE.Vector3();

    if (mood === "dusk") {
      if (this.sky) {
        this.sky.visible = true;
        const u = this.sky.material.uniforms;
        u.turbidity.value = 10.5;
        u.rayleigh.value = 3.45;
        u.mieCoefficient.value = 0.018;
        u.mieDirectionalG.value = 0.92;
        const phi = THREE.MathUtils.degToRad(90 - 3.2);
        const theta = THREE.MathUtils.degToRad(-154);
        sunVec.setFromSphericalCoords(1, phi, theta);
        u.sunPosition.value.copy(sunVec);
      }
      if (this.sunLight) {
        this.sunLight.color.setHex(0xff7733);
        this.sunLight.intensity = 3.15;
        this.sunLight.position.copy(sunVec).multiplyScalar(86).add(new THREE.Vector3(14, 0, -4));
      }
      if (this.hemiLight) {
        this.hemiLight.color.setHex(0xfb923c);
        this.hemiLight.groundColor.setHex(0x2d2236);
        this.hemiLight.intensity = 0.62;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xffd8b5);
        this.ambientLight.intensity = 0.30;
      }
      if (this.fillLight) {
        this.fillLight.color.setHex(0x818cf8);
        this.fillLight.intensity = 0.26;
      }
      this.scene.background = new THREE.Color(0xc97b63);
      this.scene.fog = new THREE.FogExp2(0xc97b63, 0.0016);
      if (this.renderer) this.renderer.toneMappingExposure = 1.06;

      if (this.materials.reflectiveExteriorGlass) {
        this.materials.reflectiveExteriorGlass.emissive.setHex(0xffc278);
        this.materials.reflectiveExteriorGlass.emissiveIntensity = 0.36;
        this.materials.reflectiveExteriorGlass.opacity = 0.58;
      }
      if (this.materials.showerFrostedGlass) {
        this.materials.showerFrostedGlass.emissive.setHex(0xffcf8b);
        this.materials.showerFrostedGlass.emissiveIntensity = 0.45;
      }
      if (this.materials.ledLightPanel) {
        this.materials.ledLightPanel.emissiveIntensity = 1.45;
      }
      this.interiorPointLights.forEach((l) => { l.intensity = (l.userData.baseIntensity || 1.05) * 4.2; });
      this.exteriorNightLights.forEach((l) => { l.intensity = (l.userData.baseIntensity || 1.0) * 0.68; });
      this.exteriorLampEmissives.forEach((m) => { if (m.emissiveIntensity !== undefined) m.emissiveIntensity = 1.65; });
      this.nightVolumetricCones.forEach((c) => {
        c.visible = true;
        if (c.material?.uniforms?.uOpacity) c.material.uniforms.uOpacity.value = 0.045;
        else if (c.material) c.material.opacity = 0.05;
      });
      this.nightGroundPools.forEach((p) => {
        p.visible = true;
        if (p.material) p.material.opacity = (p.userData.baseOpacity ?? 0.45) * 0.48;
      });
      this.nightWindowGlowMeshes.forEach((w) => {
        w.visible = true;
        if (w.material) w.material.opacity = (w.userData.baseOpacity ?? 0.7) * 0.46;
      });
      this.nightTrafficLightMeshes.forEach((tl) => {
        tl.visible = true;
        if (tl.material && tl.userData.baseOpacity !== undefined) {
          tl.material.opacity = tl.userData.baseOpacity * 0.65;
        }
      });
    } else if (mood === "night") {
      if (this.sky) this.sky.visible = false;
      this.scene.background = new THREE.Color(0x060d1a);
      this.scene.fog = new THREE.FogExp2(0x060d1a, 0.0020);

      if (this.sunLight) {
        this.sunLight.color.setHex(0x7dd3fc);
        this.sunLight.intensity = 0.44;
        this.sunLight.position.set(-32.0, 46.0, -44.0);
      }
      if (this.hemiLight) {
        this.hemiLight.color.setHex(0x1e3a5f);
        this.hemiLight.groundColor.setHex(0x0b1220);
        this.hemiLight.intensity = 0.38;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0x1e293b);
        this.ambientLight.intensity = 0.28;
      }
      if (this.fillLight) {
        this.fillLight.color.setHex(0x38bdf8);
        this.fillLight.intensity = 0.15;
      }
      if (this.renderer) this.renderer.toneMappingExposure = 1.16;

      if (this.materials.reflectiveExteriorGlass) {
        this.materials.reflectiveExteriorGlass.emissive.setHex(0xffd494);
        this.materials.reflectiveExteriorGlass.emissiveIntensity = 0.78;
        this.materials.reflectiveExteriorGlass.opacity = 0.72;
      }
      if (this.materials.showerFrostedGlass) {
        this.materials.showerFrostedGlass.emissive.setHex(0xffd89c);
        this.materials.showerFrostedGlass.emissiveIntensity = 0.96;
      }
      if (this.materials.ledLightPanel) {
        this.materials.ledLightPanel.emissiveIntensity = 2.2;
      }
      this.interiorPointLights.forEach((l) => { l.intensity = (l.userData.baseIntensity || 1.05) * 8.5; });
      this.exteriorNightLights.forEach((l) => { l.intensity = (l.userData.baseIntensity || 1.0) * 1.0; });
      this.exteriorLampEmissives.forEach((m) => { if (m.emissiveIntensity !== undefined) m.emissiveIntensity = 2.6; });
      this.nightVolumetricCones.forEach((c) => {
        c.visible = true;
        if (c.material?.uniforms?.uOpacity) c.material.uniforms.uOpacity.value = 0.078;
        else if (c.material) c.material.opacity = 0.085;
      });
      this.nightGroundPools.forEach((p) => {
        p.visible = true;
        if (p.material) p.material.opacity = p.userData.baseOpacity ?? 0.45;
      });
      this.nightWindowGlowMeshes.forEach((w) => {
        w.visible = true;
        if (w.material) w.material.opacity = w.userData.baseOpacity ?? 0.74;
      });
      this.nightTrafficLightMeshes.forEach((tl) => {
        tl.visible = true;
        if (tl.material && tl.userData.baseOpacity !== undefined) {
          tl.material.opacity = tl.userData.baseOpacity;
        }
      });
    } else {
      // Default: Crisp Daylight
      if (this.sky) {
        this.sky.visible = true;
        const u = this.sky.material.uniforms;
        u.turbidity.value = 2.4;
        u.rayleigh.value = 1.35;
        u.mieCoefficient.value = 0.004;
        u.mieDirectionalG.value = 0.80;
        const phi = THREE.MathUtils.degToRad(90 - 44.0);
        const theta = THREE.MathUtils.degToRad(-142); // SSE sun raking South brick facade & portico
        sunVec.setFromSphericalCoords(1, phi, theta);
        u.sunPosition.value.copy(sunVec);
      }
      if (this.sunLight) {
        this.sunLight.color.setHex(0xfff8ed);
        this.sunLight.intensity = 2.65;
        this.sunLight.position.copy(sunVec).multiplyScalar(82).add(new THREE.Vector3(14, 0, -4));
      }
      if (this.hemiLight) {
        this.hemiLight.color.setHex(0xdbeafe);
        this.hemiLight.groundColor.setHex(0x7b8673);
        this.hemiLight.intensity = 0.85;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xfff9f0);
        this.ambientLight.intensity = 0.42;
      }
      if (this.fillLight) {
        this.fillLight.color.setHex(0xdbeafe);
        this.fillLight.intensity = 0.55;
      }
      this.scene.background = new THREE.Color(0xcde2f5);
      this.scene.fog = new THREE.FogExp2(0xd8e8f6, 0.0014);
      if (this.renderer) this.renderer.toneMappingExposure = 1.0;

      if (this.materials.reflectiveExteriorGlass) {
        this.materials.reflectiveExteriorGlass.emissive.setHex(0x000000);
        this.materials.reflectiveExteriorGlass.emissiveIntensity = 0.0;
        this.materials.reflectiveExteriorGlass.opacity = 0.45;
      }
      if (this.materials.showerFrostedGlass) {
        this.materials.showerFrostedGlass.emissive.setHex(0x000000);
        this.materials.showerFrostedGlass.emissiveIntensity = 0.0;
      }
      if (this.materials.ledLightPanel) {
        this.materials.ledLightPanel.emissiveIntensity = 0.85;
      }
      this.interiorPointLights.forEach((l) => { l.intensity = (l.userData.baseIntensity || 1.05) * 0.78; });
      this.exteriorNightLights.forEach((l) => { l.intensity = 0.0; });
      this.exteriorLampEmissives.forEach((m) => { if (m.emissiveIntensity !== undefined) m.emissiveIntensity = 0.12; });
      this.nightVolumetricCones.forEach((c) => { c.visible = false; });
      this.nightGroundPools.forEach((p) => { p.visible = false; });
      this.nightWindowGlowMeshes.forEach((w) => { w.visible = false; });
      this.nightTrafficLightMeshes.forEach((tl) => {
        tl.visible = Boolean(tl.userData.daytimeRunning);
        if (tl.visible && tl.material && tl.userData.baseOpacity !== undefined) {
          tl.material.opacity = tl.userData.baseOpacity * 0.25;
        }
      });
    }

    const envTex = this._getOrBuildEnvMap(mood);
    if (envTex) {
      this.scene.environment = envTex;
      if ("environmentIntensity" in this.scene) {
        this.scene.environmentIntensity = mood === "night" ? 0.35 : (mood === "dusk" ? 0.65 : 0.75);
      }
    }
  }

  update(time, camera, mode = "overview") {
    // 1. Animate Two-Way City Street & Campus Driveway Vehicle Traffic
    if (typeof time === "number" && this.streetTrafficVehicles.length > 0) {
      const dt = this._lastTrafficTime === null ? 0.016 : Math.min(0.1, Math.max(0.0, time - this._lastTrafficTime));
      this._lastTrafficTime = time;

      for (let i = 0; i < this.streetTrafficVehicles.length; i++) {
        const tv = this.streetTrafficVehicles[i];
        if (tv.axis === "z") {
          tv.z += tv.dir * tv.speed * dt;
          if (tv.dir > 0 && tv.z > tv.maxCoord) tv.z = tv.minCoord;
          else if (tv.dir < 0 && tv.z < tv.minCoord) tv.z = tv.maxCoord;
          tv.mesh.position.z = tv.z;
        } else {
          tv.x += tv.dir * tv.speed * dt;
          if (tv.dir > 0 && tv.x > tv.maxCoord) tv.x = tv.minCoord;
          else if (tv.dir < 0 && tv.x < tv.minCoord) tv.x = tv.maxCoord;
          tv.mesh.position.x = tv.x;
        }
      }
    }

    // 2. Smart Auto-Hiding Roof (Visible in Walk Mode, Interior Views, & Exterior Campus Views; Hidden in Overhead Cutaway)
    if (!this.roofGroup || !camera) return;
    const cx = camera.position.x;
    const cy = camera.position.y;
    const cz = camera.position.z;
    const inFrontFootprint = cx >= -23.5 && cx <= 45.8 && cz >= -11.5 && cz <= 11.5;
    const inRearLWingFootprint = cx >= -23.5 && cx <= 9.8 && cz >= 9.5 && cz <= 29.5;
    const outsideFootprint = !(inFrontFootprint || inRearLWingFootprint);
    const wideCampusExterior = cz < -26.0 || cz > 34.0 || cx < -32.0 || cx > 58.0;

    if (mode === "walk" || cy <= 4.35) {
      this.roofGroup.visible = true;
    } else if (outsideFootprint && (cy < 28.0 || wideCampusExterior)) {
      this.roofGroup.visible = true;
    } else {
      this.roofGroup.visible = false;
    }
  }

  _buildBiophilicWall() {
    // Architectural Living Bio-Wall Feature on Reception Spine Wall (X = 8.08, Z = -4.5, facing East +X into Reception!)
    const wallGroup = new THREE.Group();
    wallGroup.name = "Architectural_Living_BioWall_Master";
    wallGroup.position.set(8.08, 0, -4.5);
    wallGroup.rotation.y = Math.PI / 2; // Face East (+X) into Grand Entrance Reception & Waiting Lounge

    const wallW = 5.2;  // Total width along corridor North-South (Z in world)
    const wallH = 3.2;  // Height from floor to ceiling
    const wingW = 0.65; // Width of flanking fluted walnut acoustic panels
    const bioW = wallW - wingW * 2; // Central botanical living expanse = 3.90m

    // 1. Heavy Extruded Architectural Bronze Perimeter Frame & Light Canopy
    const frameMat = this.materials.bronzeMullion;
    const borderThick = 0.09;

    // Top Header Canopy with Integrated Recessed Grow-Light Trough
    const topBeam = new THREE.Mesh(
      new THREE.BoxGeometry(wallW, borderThick, 0.32),
      frameMat
    );
    topBeam.position.set(0, wallH - borderThick / 2, 0.16);
    wallGroup.add(topBeam);

    // Continuous Recessed Botanical LED Grow-Light Strip along Underside of Header
    const topGrowLED = new THREE.Mesh(
      new THREE.BoxGeometry(bioW, 0.015, 0.08),
      new THREE.MeshBasicMaterial({ color: 0xfff6ea })
    );
    topGrowLED.position.set(0, wallH - borderThick - 0.008, 0.20);
    wallGroup.add(topGrowLED);

    // Left and Right Vertical Architectural Bronze Outer Jambs
    [-wallW / 2 + borderThick / 2, wallW / 2 - borderThick / 2].forEach((jx) => {
      const jamb = new THREE.Mesh(
        new THREE.BoxGeometry(borderThick, wallH - borderThick, 0.24),
        frameMat
      );
      jamb.position.set(jx, (wallH - borderThick) / 2, 0.12);
      wallGroup.add(jamb);
    });

    // 2. Fluted American Walnut Acoustic Louver Wings (Left and Right Flanking Portals)
    const walnutMat = this.materials.flutedWalnut;
    const numSlats = 9;
    const slatW = 0.044;
    const slatD = 0.040;
    const slatSpacing = (wingW - 0.10) / (numSlats - 1);

    [-1, 1].forEach((side) => {
      const wingCenterX = side * (wallW / 2 - borderThick - wingW / 2);
      const wingGroup = new THREE.Group();
      wingGroup.position.set(wingCenterX, 0, 0);

      // Proud Walnut Backing Panel
      const wingBack = new THREE.Mesh(
        new THREE.BoxGeometry(wingW, wallH - borderThick * 2, 0.03),
        walnutMat
      );
      wingBack.position.set(0, wallH / 2, 0.035);
      wingGroup.add(wingBack);

      // Vertical 3D Fluted Timber Battens creating deep architectural shadow lines
      for (let s = 0; s < numSlats; s++) {
        const sx = -wingW / 2 + 0.05 + s * slatSpacing;
        const slat = new THREE.Mesh(
          new THREE.BoxGeometry(slatW, wallH - borderThick * 2 - 0.04, slatD),
          walnutMat
        );
        slat.position.set(sx, wallH / 2, 0.065);
        slat.castShadow = true;
        wingGroup.add(slat);
      }

      // Vertical Grazing Warm LED Light Strip in Shadow Reveal Channel
      const ledChannel = new THREE.Mesh(
        new THREE.BoxGeometry(0.014, wallH - borderThick * 2 - 0.10, 0.015),
        new THREE.MeshBasicMaterial({ color: 0xffeedb })
      );
      ledChannel.position.set(-side * (wingW / 2 - 0.03), wallH / 2, 0.075);
      wingGroup.add(ledChannel);

      wallGroup.add(wingGroup);
    });

    // 3. Base Irrigation Catch-Basin Trough (Charcoal Basalt Stone & Stainless Overflow Rim)
    const troughH = 0.32;
    const troughD = 0.44;
    const trough = new THREE.Mesh(
      new THREE.BoxGeometry(bioW, troughH, troughD),
      this.materials.charcoalConcrete
    );
    trough.position.set(0, troughH / 2, troughD / 2);
    wallGroup.add(trough);

    // Brushed Stainless Steel Perimeter Rim & Overflow Weir Lip
    const rim = new THREE.Mesh(
      new THREE.BoxGeometry(bioW + 0.04, 0.025, troughD + 0.04),
      this.materials.cabinetHandle
    );
    rim.position.set(0, troughH + 0.012, troughD / 2);
    wallGroup.add(rim);

    // Concealed Under-Lip Warm LED Strip illuminating river stones below
    const underLipLED = new THREE.Mesh(
      new THREE.BoxGeometry(bioW - 0.06, 0.01, 0.02),
      new THREE.MeshBasicMaterial({ color: 0xffe8cc })
    );
    underLipLED.position.set(0, troughH + 0.005, troughD - 0.02);
    wallGroup.add(underLipLED);

    // 3D Polished River Pebbles Bed (Basalt, River Slate, Tumbled River Quartzite)
    const pebbleGeo = new THREE.SphereGeometry(0.040, 8, 6);
    for (let p = 0; p < 75; p++) {
      const px = -((bioW - 0.20) / 2) + Math.random() * (bioW - 0.20);
      const pz = 0.08 + Math.random() * (troughD - 0.14);
      const peb = new THREE.Mesh(pebbleGeo, this.materials.riverPebble);
      peb.position.set(px, troughH + 0.025, pz);
      peb.scale.set(0.7 + Math.random() * 0.7, 0.40 + Math.random() * 0.35, 0.7 + Math.random() * 0.7);
      peb.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      wallGroup.add(peb);
    }

    // 4. Backing Substrate: Dark Modular Basalt / Felt Cassette Wall
    const backPanH = wallH - borderThick - troughH;
    const substrateY = troughH + backPanH / 2;

    const backTile = new THREE.Mesh(
      new THREE.BoxGeometry(bioW, backPanH, 0.04),
      this.materials.porcelainTile
    );
    backTile.position.set(0, substrateY, 0.035);
    wallGroup.add(backTile);

    // Architectural Natural Virgin Cork Bark Vertical Accent Columns (3 Columns)
    [-1.25, 0.0, 1.25].forEach((cx, idx) => {
      const barkW = 0.26 + (idx % 2) * 0.08;
      const bark = new THREE.Mesh(
        new THREE.BoxGeometry(barkW, backPanH * 0.96, 0.05),
        this.materials.corkBark
      );
      bark.position.set(cx, substrateY, 0.06);
      wallGroup.add(bark);
    });

    // 5. 5-Tier Horizontal Extruded Planter Cassette Troughs & High-DPI Living Foliage Tapestry
    const tierHeights = [0.65, 1.15, 1.65, 2.15, 2.65];
    const foliageMat = this.materials.livingWallFoliageTapestry;
    const fernMat = this.materials.botanicalFernFrond;
    const pothosMat = this.materials.pothosVariegated;
    const calatheaMat = this.materials.botanicalCalathea;

    tierHeights.forEach((ty, tIdx) => {
      // Horizontal Black Extruded Planter Cassette Rail
      const tray = new THREE.Mesh(
        new THREE.BoxGeometry(bioW - 0.08, 0.075, 0.14),
        this.materials.architecturalBlackMetal
      );
      tray.position.set(0, ty, 0.10);
      tray.castShadow = true;
      wallGroup.add(tray);

      // Continuous High-DPI Cascading Foliage Tapestry Panel
      // Angled outward and draped over tray lip
      const folPanel = new THREE.Mesh(
        new THREE.PlaneGeometry(bioW - 0.10, 0.54),
        foliageMat
      );
      folPanel.position.set(0, ty - 0.14, 0.16);
      folPanel.rotation.x = 0.18; // Leaning gently out into the room
      wallGroup.add(folPanel);

      // Backing secondary leaf panel for visual depth
      const folBack = new THREE.Mesh(
        new THREE.PlaneGeometry(bioW - 0.10, 0.48),
        foliageMat
      );
      folBack.position.set(0, ty + 0.16, 0.08);
      folBack.rotation.x = -0.08;
      wallGroup.add(folBack);

      // 6. 3D Architectural Boston Fern Frond Clusters Emerging from Each Tier
      const numFerns = 5;
      for (let f = 0; f < numFerns; f++) {
        const fx = -((bioW - 0.6) / 2) + (f / (numFerns - 1)) * (bioW - 0.6) + (Math.random() - 0.5) * 0.15;
        const fernCluster = new THREE.Group();
        fernCluster.position.set(fx, ty + 0.04, 0.14);

        const frondCount = 4 + Math.floor(Math.random() * 3);
        for (let fr = 0; fr < frondCount; fr++) {
          const frondGroup = new THREE.Group();
          const spreadY = ((fr - frondCount / 2) / frondCount) * 1.4;
          frondGroup.rotation.y = spreadY + (Math.random() - 0.5) * 0.2;
          frondGroup.rotation.x = 0.28 + Math.random() * 0.35; // Arching outward 25-45°

          const stemLen = 0.32 + Math.random() * 0.18;
          const rachis = new THREE.Mesh(
            new THREE.CylinderGeometry(0.002, 0.004, stemLen, 6),
            fernMat
          );
          rachis.position.set(0, -stemLen / 2, stemLen * 0.30);
          rachis.rotation.x = -Math.PI / 4.2;
          frondGroup.add(rachis);

          // Paired serrated pinnae leaflets
          const numPinnae = 8;
          for (let p = 0; p < numPinnae; p++) {
            const frac = p / numPinnae;
            const pinnaLen = (1.0 - frac * 0.45) * 0.07;
            [-1, 1].forEach((side) => {
              const leaflet = new THREE.Mesh(
                new THREE.PlaneGeometry(pinnaLen, 0.016),
                fernMat
              );
              leaflet.position.set(
                side * (pinnaLen / 2 + 0.003),
                -frac * stemLen * 0.72,
                frac * stemLen * 0.30
              );
              leaflet.rotation.z = side * 0.28;
              frondGroup.add(leaflet);
            });
          }
          fernCluster.add(frondGroup);
        }
        wallGroup.add(fernCluster);
      }

      // 7. 3D Cascading Golden Pothos & Philodendron Vines (Trailing down over trays)
      const numVines = 4;
      for (let v = 0; v < numVines; v++) {
        const vx = -((bioW - 0.7) / 2) + Math.random() * (bioW - 0.7);
        const vineLen = 0.45 + Math.random() * 0.35 + (tIdx === 0 ? 0.35 : 0); // Bottom tier vines spill into catch basin!
        const vineGroup = new THREE.Group();
        vineGroup.position.set(vx, ty, 0.17);

        const vineStem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.003, 0.004, vineLen, 6),
          pothosMat
        );
        vineStem.position.set(0, -vineLen / 2, 0.04);
        vineGroup.add(vineStem);

        const numLeaves = Math.floor(vineLen * 16);
        for (let l = 0; l < numLeaves; l++) {
          const lf = new THREE.Group();
          const frac = l / numLeaves;
          const side = l % 2 === 0 ? 1 : -1;
          lf.position.set(
            side * 0.024,
            -frac * vineLen,
            0.04 + Math.sin(frac * Math.PI) * 0.03
          );
          lf.rotation.set(
            0.4 + Math.random() * 0.3,
            side * 0.35,
            (Math.random() - 0.5) * 0.3
          );

          const leafBlade = new THREE.Mesh(
            new THREE.ConeGeometry(0.040, 0.082, 5),
            pothosMat
          );
          leafBlade.rotation.x = Math.PI;
          leafBlade.scale.set(1.15, 1.0, 0.16);
          lf.add(leafBlade);
          vineGroup.add(lf);
        }
        wallGroup.add(vineGroup);
      }

      // 8. 3D Calathea Statement Broadleaf Clumps (Exotic sculptural foliage)
      if (tIdx === 1 || tIdx === 3) {
        [-0.85, 0.85].forEach((cx) => {
          const clump = new THREE.Group();
          clump.position.set(cx + (Math.random() - 0.5) * 0.3, ty + 0.05, 0.15);

          for (let i = 0; i < 4; i++) {
            const leafGrp = new THREE.Group();
            leafGrp.rotation.y = ((i - 1.5) / 3) * 1.6;
            leafGrp.rotation.x = 0.32 + Math.random() * 0.25;

            const petiole = new THREE.Mesh(
              new THREE.CylinderGeometry(0.003, 0.005, 0.20, 6),
              calatheaMat
            );
            petiole.position.set(0, 0.09, 0.04);
            petiole.rotation.x = 0.22;
            leafGrp.add(petiole);

            const blade = new THREE.Mesh(
              new THREE.SphereGeometry(0.085, 8, 6),
              calatheaMat
            );
            blade.scale.set(1.1, 1.4, 0.12);
            blade.position.set(0, 0.20, 0.08);
            blade.rotation.x = 0.18;
            leafGrp.add(blade);

            clump.add(leafGrp);
          }
          wallGroup.add(clump);
        });
      }
    });

    // 9. Subtle Velvet Moss Crevice Accent Cushions (Micro-scale only, radius 0.04 to 0.07m)
    const mossMats = [
      this.materials.botanicalVelvetMossDeep,
      this.materials.botanicalVelvetMossEmerald,
      this.materials.botanicalVelvetMossChartreuse
    ];
    const microSphere = new THREE.SphereGeometry(0.05, 8, 6);
    for (let m = 0; m < 35; m++) {
      const mx = -((bioW - 0.4) / 2) + Math.random() * (bioW - 0.4);
      const my = troughH + 0.15 + Math.random() * (backPanH - 0.3);
      const mat = mossMats[m % mossMats.length];
      const tuft = new THREE.Mesh(microSphere, mat);
      tuft.scale.set(0.9, 0.8, 0.35);
      tuft.position.set(mx, my, 0.07);
      wallGroup.add(tuft);
    }

    // 10. Overhead Articulated High-CRI LED Spotlight Canisters
    const trackY = wallH + 0.05;
    const trackRail = new THREE.Mesh(
      new THREE.BoxGeometry(bioW + 0.6, 0.035, 0.045),
      this.materials.bronzeMullion
    );
    trackRail.position.set(0, trackY, 0.34);
    wallGroup.add(trackRail);

    [-1.5, -0.75, 0, 0.75, 1.5].forEach((lx) => {
      const spotArm = new THREE.Group();
      spotArm.position.set(lx, trackY - 0.02, 0.34);

      const knuckle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.03, 8),
        this.materials.cabinetHandle
      );
      spotArm.add(knuckle);

      const canister = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.044, 0.10, 16),
        this.materials.bronzeMullion
      );
      canister.rotation.x = -Math.PI / 3.4; // Aimed down 53° at living wall foliage
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

    // 11. Dedicated Digital Telemetry & IAQ Environmental Monitoring Panel
    // Flush bezel mounted prominently on the right walnut fluted wing (X = 2.25, Y = 1.55, Z = 0.09)
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(wallW / 2 - borderThick - wingW / 2, 1.55, 0.09);

    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.52, 0.02),
      this.materials.architecturalBlackMetal
    );
    monitorGroup.add(bezel);

    const monCanvas = document.createElement("canvas");
    monCanvas.width = 360;
    monCanvas.height = 500;
    const mCtx = monCanvas.getContext("2d");
    mCtx.fillStyle = "#0c1017";
    mCtx.fillRect(0, 0, 360, 500);

    // Header badge
    mCtx.fillStyle = "#1e293b";
    mCtx.fillRect(10, 10, 340, 60);
    mCtx.fillStyle = "#3dd68c";
    mCtx.font = "bold 16px sans-serif";
    mCtx.fillText("SRE BIOPHILIC HORTICULTURE", 20, 38);
    mCtx.fillStyle = "#94a3b8";
    mCtx.font = "12px monospace";
    mCtx.fillText("SYSTEM STATUS: ONLINE / HEALTHY", 20, 58);

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
      mCtx.font = "bold 11px sans-serif";
      mCtx.fillText(st.label, 26, cy + 24);

      mCtx.fillStyle = st.col;
      mCtx.font = "bold 24px monospace";
      mCtx.fillText(st.val, 26, cy + 54);

      mCtx.fillStyle = "#94a3b8";
      mCtx.font = "11px monospace";
      mCtx.textAlign = "right";
      mCtx.fillText(st.stat, 330, cy + 54);
      mCtx.textAlign = "left";
    });

    const monTex = new THREE.CanvasTexture(monCanvas);
    const monScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.35, 0.49),
      new THREE.MeshBasicMaterial({ map: monTex })
    );
    monScreen.position.set(0, 0, 0.012);
    monitorGroup.add(monScreen);
    wallGroup.add(monitorGroup);

    // 12. Etched Architectural Bronze Plaque Centered on Upper Header
    const plaqueGroup = new THREE.Group();
    plaqueGroup.position.set(0, wallH - borderThick / 2 - 0.14, 0.22);

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
    plCtx.font = "bold 24px sans-serif";
    plCtx.textAlign = "center";
    plCtx.fillText("CHEMMATE BIOTECHNOLOGY · ARCHITECTURAL LIVING BIO-WALL", 512, 52);
    plCtx.font = "17px monospace";
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

    // 13. Drip Irrigation Riser & Brass Manifold with Analog Dial Gauge
    const irriGroup = new THREE.Group();
    irriGroup.position.set(wallW / 2 - borderThick - 0.08, troughH / 2 + 0.20, 0.18);

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

  // --- Bespoke Procedural CAD Parked Vehicles, Commuter Bikes & Outdoor Patio ---
  _createProceduralVehicle({ bodyColor = 0xf1f5f9, style = "ev_fastback" } = {}) {
    const car = new THREE.Group();
    const L = style === "suv" ? 4.68 : 4.56;
    const W = style === "suv" ? 1.92 : 1.86;

    const paintMat = new THREE.MeshPhysicalMaterial({
      color: bodyColor,
      roughness: 0.16,
      metalness: 0.65,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08
    });
    const cabinGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.08,
      metalness: 0.25,
      transparent: true,
      opacity: 0.84
    });
    const trimMat = this.materials.architecturalBlackMetal;
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x16181d, roughness: 0.85, metalness: 0.05 });
    const alloyMat = new THREE.MeshStandardMaterial({ color: 0xd8dee9, roughness: 0.22, metalness: 0.90 });

    // Contoured Side Silhouette Extruded Across Width (Local +Z = Front Bumper, -Z = Rear)
    const prof = new THREE.Shape();
    const halfL = L / 2;
    if (style === "suv") {
      prof.moveTo(-halfL, 0.24);
      prof.lineTo(halfL - 0.12, 0.22);
      prof.quadraticCurveTo(halfL, 0.26, halfL, 0.56);
      prof.quadraticCurveTo(halfL - 0.08, 0.86, halfL - 0.98, 0.94); // Sculpted Hood
      prof.lineTo(0.48, 1.56); // Windshield
      prof.lineTo(-halfL + 0.42, 1.54); // Long SUV Roofline
      prof.lineTo(-halfL + 0.08, 0.98); // Tailgate Glass
      prof.quadraticCurveTo(-halfL, 0.65, -halfL, 0.24);
    } else if (style === "sedan") {
      prof.moveTo(-halfL, 0.22);
      prof.lineTo(halfL - 0.10, 0.20);
      prof.quadraticCurveTo(halfL, 0.24, halfL, 0.50);
      prof.quadraticCurveTo(halfL - 0.12, 0.78, halfL - 1.12, 0.84); // Hood
      prof.lineTo(0.38, 1.38); // Raked Windshield
      prof.lineTo(-0.78, 1.38); // Cabin Roof
      prof.lineTo(-1.58, 0.94); // Rear Window
      prof.lineTo(-halfL + 0.08, 0.88); // Trunk Deck
      prof.quadraticCurveTo(-halfL, 0.60, -halfL, 0.22);
    } else {
      // Sleek Aerodynamic EV Fastback
      prof.moveTo(-halfL, 0.22);
      prof.lineTo(halfL - 0.10, 0.19);
      prof.quadraticCurveTo(halfL, 0.24, halfL, 0.48);
      prof.quadraticCurveTo(halfL - 0.15, 0.76, halfL - 1.05, 0.83);
      prof.lineTo(0.32, 1.39);
      prof.quadraticCurveTo(-0.55, 1.42, -1.65, 1.02); // Fastback Sweep
      prof.lineTo(-halfL + 0.06, 0.90);
      prof.quadraticCurveTo(-halfL, 0.58, -halfL, 0.22);
    }

    const hullWidth = W - 0.14;
    const bodyGeo = new THREE.ExtrudeGeometry(prof, {
      depth: hullWidth,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06
    });
    // Shape X -> Z (Front +Z), Shape Y -> Y, Extrude Z -> X centered
    bodyGeo.rotateY(-Math.PI / 2);
    bodyGeo.translate(hullWidth / 2, 0, 0);
    const bodyMesh = new THREE.Mesh(bodyGeo, paintMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    car.add(bodyMesh);

    // Tinted Panoramic Cabin Greenhouse Inset
    const cabH = style === "suv" ? 0.52 : 0.44;
    const cabY = style === "suv" ? 1.24 : 1.12;
    const cabL = style === "suv" ? 2.45 : 2.05;
    const cabZ = style === "suv" ? -0.35 : -0.22;
    const greenhouse = new THREE.Mesh(new THREE.BoxGeometry(W - 0.16, cabH, cabL), cabinGlassMat);
    greenhouse.position.set(0, cabY, cabZ);
    car.add(greenhouse);

    // Lower Matte-Black Aero Rocker Skirts & Diffuser
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(W - 0.04, 0.10, L - 0.22), trimMat);
    skirt.position.set(0, 0.21, 0);
    car.add(skirt);

    // Side Aero Mirrors
    [-1, 1].forEach((sx) => {
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.18), paintMat);
      mirror.position.set(sx * (W / 2 + 0.04), 0.94, 0.62);
      car.add(mirror);
    });

    // LED Matrix Headlights (+Z) & Full-Width Crimson Tail-Light Bar (-Z)
    const headLightMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0xe0f2fe,
      emissiveIntensity: 0.45,
      roughness: 0.15
    });
    this.exteriorLampEmissives.push(headLightMat);
    [-W * 0.34, W * 0.34].forEach((hx) => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 0.05), headLightMat);
      hl.position.set(hx, 0.56, halfL + 0.035);
      car.add(hl);
    });

    const tailMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0xef4444,
      emissiveIntensity: 0.40,
      roughness: 0.2
    });
    const tailBar = new THREE.Mesh(new THREE.BoxGeometry(W - 0.24, 0.065, 0.04), tailMat);
    tailBar.position.set(0, style === "suv" ? 0.88 : 0.78, -halfL - 0.035);
    car.add(tailBar);

    // Front & Rear License Plates
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
    const plateF = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.15, 0.015), plateMat);
    plateF.position.set(0, 0.36, halfL + 0.045);
    car.add(plateF);
    const plateR = plateF.clone();
    plateR.position.set(0, 0.54, -halfL - 0.045);
    car.add(plateR);

    // 4 Sculpted Wheels (Rubber Tire + 5-Spoke Alloy Rim + Brake Disc)
    const wheelR = style === "suv" ? 0.36 : 0.33;
    const wheelW = 0.23;
    const wheelZ = L * 0.305;
    [
      [-W / 2 + 0.08, wheelZ],
      [W / 2 - 0.08, wheelZ],
      [-W / 2 + 0.08, -wheelZ],
      [W / 2 - 0.08, -wheelZ]
    ].forEach(([wx, wz]) => {
      const wGrp = new THREE.Group();
      wGrp.position.set(wx, wheelR, wz);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(wheelR, wheelR, wheelW, 24), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wGrp.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(wheelR * 0.68, wheelR * 0.68, wheelW + 0.012, 20), alloyMat);
      rim.rotation.z = Math.PI / 2;
      wGrp.add(rim);

      const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, wheelW + 0.025, 12), trimMat);
      hubCap.rotation.z = Math.PI / 2;
      wGrp.add(hubCap);

      for (let sp = 0; sp < 5; sp++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(wheelW + 0.02, wheelR * 0.62, 0.036), alloyMat);
        spoke.rotation.x = (sp / 5) * Math.PI * 2;
        wGrp.add(spoke);
      }
      car.add(wGrp);
    });

    return car;
  }

  _createProceduralBicycle(frameColor = 0x0284c7) {
    const bike = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.25, metalness: 0.72 });
    const chromeMat = this.materials.cabinetHandle;
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });

    const wheelR = 0.33;
    const addTube = (p1, p2, r, mat) => {
      const v1 = new THREE.Vector3(...p1);
      const v2 = new THREE.Vector3(...p2);
      const dist = v1.distanceTo(v2);
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, dist, 10), mat);
      cyl.position.copy(v1).add(v2).multiplyScalar(0.5);
      cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v2.clone().sub(v1).normalize());
      cyl.castShadow = true;
      bike.add(cyl);
    };

    // Front (+Z = +0.54) & Rear (-Z = -0.54) Spoked Wheels
    [-0.54, 0.54].forEach((wz) => {
      const tire = new THREE.Mesh(new THREE.TorusGeometry(wheelR, 0.024, 10, 28), rubberMat);
      tire.rotation.y = Math.PI / 2;
      tire.position.set(0, wheelR, wz);
      tire.castShadow = true;
      bike.add(tire);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(wheelR - 0.022, 0.010, 8, 24), chromeMat);
      rim.rotation.y = Math.PI / 2;
      rim.position.set(0, wheelR, wz);
      bike.add(rim);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.09, 10), chromeMat);
      hub.rotation.z = Math.PI / 2;
      hub.position.set(0, wheelR, wz);
      bike.add(hub);

      for (let s = 0; s < 8; s++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, wheelR * 1.9, 6), chromeMat);
        spoke.position.set(0, wheelR, wz);
        spoke.rotation.x = (s / 8) * Math.PI;
        bike.add(spoke);
      }
    });

    // Diamond Tubular Frame + Front Fork + Seatpost + Handlebars
    const bb = [0, 0.30, -0.08];
    const seatTop = [0, 0.78, -0.22];
    const headTop = [0, 0.80, 0.36];
    const headBot = [0, 0.64, 0.41];
    const rearAxle = [0, wheelR, -0.54];
    const frontAxle = [0, wheelR, 0.54];

    addTube(bb, seatTop, 0.016, frameMat);       // Seat tube
    addTube(seatTop, headTop, 0.015, frameMat);  // Top tube
    addTube(bb, headBot, 0.018, frameMat);       // Down tube
    addTube(headBot, headTop, 0.018, frameMat);  // Head tube
    addTube([-0.035, wheelR, -0.54], bb, 0.010, frameMat); // Chainstays
    addTube([0.035, wheelR, -0.54], bb, 0.010, frameMat);
    addTube([-0.035, wheelR, -0.54], seatTop, 0.009, frameMat); // Seatstays
    addTube([0.035, wheelR, -0.54], seatTop, 0.009, frameMat);
    addTube([-0.04, wheelR, 0.54], headBot, 0.011, frameMat); // Fork blades
    addTube([0.04, wheelR, 0.54], headBot, 0.011, frameMat);

    // Stem & Swept Commuter Handlebars
    addTube(headTop, [0, 0.94, 0.34], 0.013, chromeMat);
    addTube([-0.28, 0.95, 0.31], [0.28, 0.95, 0.31], 0.011, chromeMat);
    [-0.25, 0.25].forEach((gx) => {
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.11, 10), rubberMat);
      grip.rotation.z = Math.PI / 2;
      grip.position.set(gx, 0.95, 0.31);
      bike.add(grip);
    });

    // Seatpost & Contoured Saddle
    addTube(seatTop, [0, 0.91, -0.25], 0.012, chromeMat);
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.045, 0.26), rubberMat);
    saddle.position.set(0, 0.93, -0.26);
    bike.add(saddle);

    // Crankset & Pedals
    const chainring = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.008, 18), chromeMat);
    chainring.rotation.z = Math.PI / 2;
    chainring.position.set(0.045, 0.30, -0.08);
    bike.add(chainring);

    return bike;
  }

  _buildOutdoorStaffPatio(siteGroup) {
    // Sited on North Facade outside Break Room French Patio Doors (Door at X = 32.28, Z = 9.56)
    // Patio Envelope: X: 26.8..35.4 (8.6m), Z: 9.66..16.66 (7.0m), center (31.1, 0, 13.16)
    const patio = new THREE.Group();
    patio.name = "Outdoor_BreakRoom_Staff_Patio";

    const pW = 8.6, pD = 7.0;
    const pCX = 31.1, pCZ = 13.16;

    // 1. Herringbone-Brick Terrace Slab + Cast-Stone Border Curbs
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(pW, 0.06, pD),
      this._createHerringboneMaterial(pW, pD)
    );
    slab.position.set(pCX, 0.03, pCZ);
    slab.receiveShadow = true;
    patio.add(slab);

    [
      { x: pCX, z: pCZ + pD / 2 + 0.08, sx: pW + 0.32, sz: 0.16 },
      { x: pCX - pW / 2 - 0.08, z: pCZ, sx: 0.16, sz: pD },
      { x: pCX + pW / 2 + 0.08, z: pCZ, sx: 0.16, sz: pD }
    ].forEach((c) => {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(c.sx, 0.10, c.sz), this.materials.limestonePlinth);
      curb.position.set(c.x, 0.05, c.z);
      curb.receiveShadow = true;
      patio.add(curb);
    });

    // Mulched Perimeter Planting Beds Framing Patio
    [
      { x: pCX - pW / 2 - 0.95, z: pCZ + 0.3, sx: 1.4, sz: pD - 0.8 },
      { x: pCX + pW / 2 + 0.95, z: pCZ + 0.3, sx: 1.4, sz: pD - 0.8 },
      { x: pCX - 1.8, z: pCZ + pD / 2 + 0.85, sx: 4.8, sz: 1.3 }
    ].forEach((mb) => {
      const bed = new THREE.Mesh(new THREE.BoxGeometry(mb.sx, 0.06, mb.sz), this.materials.mulchBed);
      bed.position.set(mb.x, 0.03, mb.z);
      bed.receiveShadow = true;
      patio.add(bed);
    });

    // 2. Architectural Cedar & Charcoal-Steel Timber Pergola (X: 27.3..34.9, Z: 10.3..15.9, H = 3.05m)
    const pergX0 = 27.3, pergX1 = 34.9;
    const pergZ0 = 10.3, pergZ1 = 15.9;
    const pergH = 3.05;
    const postCoords = [
      [pergX0, pergZ0], [31.1, pergZ0], [pergX1, pergZ0],
      [pergX0, pergZ1], [31.1, pergZ1], [pergX1, pergZ1]
    ];
    postCoords.forEach(([px, pz]) => {
      const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, pergH, 0.14),
        this.materials.architecturalBlackMetal
      );
      post.position.set(px, pergH / 2 + 0.05, pz);
      post.castShadow = true;
      patio.add(post);
      this.colliders.push(new THREE.Box3().setFromObject(post));

      const baseFlange = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.24), this.materials.cabinetHandle);
      baseFlange.position.set(px, 0.07, pz);
      patio.add(baseFlange);
    });

    // Primary Steel-Flitch Carrier Beams Along X (at Z = pergZ0 & pergZ1)
    [pergZ0, pergZ1].forEach((bz) => {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(pergX1 - pergX0 + 0.65, 0.18, 0.12),
        this.materials.architecturalBlackMetal
      );
      beam.position.set((pergX0 + pergX1) / 2, pergH + 0.10, bz);
      beam.castShadow = true;
      patio.add(beam);
    });

    // 13 Notched Western Red Cedar Rafters Along Z + Shade Purline Slats
    const rafterLen = pergZ1 - pergZ0 + 0.85;
    for (let r = 0; r < 13; r++) {
      const rx = pergX0 - 0.15 + (r / 12) * (pergX1 - pergX0 + 0.30);
      const rafter = new THREE.Mesh(
        new THREE.BoxGeometry(0.065, 0.16, rafterLen),
        this.materials.cedarTimber
      );
      rafter.position.set(rx, pergH + 0.25, (pergZ0 + pergZ1) / 2);
      rafter.castShadow = true;
      patio.add(rafter);
    }
    for (let s = 0; s < 16; s++) {
      const sz = pergZ0 - 0.15 + (s / 15) * (pergZ1 - pergZ0 + 0.30);
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(pergX1 - pergX0 + 0.55, 0.03, 0.055),
        this.materials.cedarTimber
      );
      slat.position.set((pergX0 + pergX1) / 2, pergH + 0.345, sz);
      slat.castShadow = true;
      patio.add(slat);
    }

    // Warm Festoon Café String Lights Draped Under Pergola
    const festoonBulbMat = new THREE.MeshStandardMaterial({
      color: 0xfff3c4,
      emissive: 0xffb74d,
      emissiveIntensity: 0.35,
      roughness: 0.2
    });
    this.exteriorLampEmissives.push(festoonBulbMat);
    [11.6, 13.5, 15.1].forEach((fz) => {
      const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, pergX1 - pergX0, 6),
        this.materials.architecturalBlackMetal
      );
      cord.rotation.z = Math.PI / 2;
      cord.position.set((pergX0 + pergX1) / 2, pergH - 0.06, fz);
      patio.add(cord);

      for (let b = 0; b < 9; b++) {
        const bx = pergX0 + 0.45 + (b / 8) * (pergX1 - pergX0 - 0.90);
        const sag = Math.sin((b / 8) * Math.PI) * 0.12;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), festoonBulbMat);
        bulb.position.set(bx, pergH - 0.09 - sag, fz);
        patio.add(bulb);
      }
    });

    [pCX - 1.9, pCX + 1.9].forEach((px) => {
      const patioGlow = new THREE.PointLight(0xffd28a, 11.5, 14.0, 1.45);
      patioGlow.position.set(px, 2.72, pCZ);
      patioGlow.userData.baseIntensity = 11.5;
      this.exteriorNightLights.push(patioGlow);
      patio.add(patioGlow);
    });

    // 3. Three Bespoke Outdoor Teak & Cast-Aluminum Café Dining Sets
    //    (Carefully sited at X = 28.6 & X = 33.9 so the X = 31.4..33.1 patio door walkway stays 100% clear!)
    const cafeSets = [
      { x: 28.65, z: 11.95, umbrella: false },
      { x: 28.65, z: 14.55, umbrella: true },
      { x: 33.95, z: 14.15, umbrella: false }
    ];
    const canvasUmbrellaMat = new THREE.MeshStandardMaterial({
      color: 0xf4efe6,
      roughness: 0.78,
      metalness: 0.02,
      side: THREE.DoubleSide
    });
    const ceramicMat = this.materials.porcelainWhite;

    cafeSets.forEach((cs) => {
      const setGrp = new THREE.Group();
      setGrp.position.set(cs.x, 0.06, cs.z);

      // Pedestal Base + Column + Slatted Round Teak Tabletop (D = 1.04m, H = 0.74m)
      const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.31, 0.03, 20), this.materials.architecturalBlackMetal);
      baseDisc.position.y = 0.015;
      setGrp.add(baseDisc);

      const pedCol = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.048, 0.70, 14), this.materials.architecturalBlackMetal);
      pedCol.position.y = 0.36;
      pedCol.castShadow = true;
      setGrp.add(pedCol);

      const topRim = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.035, 28), this.materials.teakWood);
      topRim.position.y = 0.725;
      topRim.castShadow = true;
      topRim.receiveShadow = true;
      setGrp.add(topRim);

      // Espresso Cups & Saucers on Table
      [-0.18, 0.18].forEach((mx, mi) => {
        const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.01, 14), ceramicMat);
        saucer.position.set(mx, 0.748, mi === 0 ? 0.14 : -0.14);
        setGrp.add(saucer);
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.028, 0.055, 14), ceramicMat);
        cup.position.set(mx, 0.78, mi === 0 ? 0.14 : -0.14);
        setGrp.add(cup);
      });

      // Optional Cantilever/Center Market Umbrella (for sunny corner table)
      if (cs.umbrella) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 2.35, 12), this.materials.teakWood);
        pole.position.y = 1.18;
        setGrp.add(pole);
        const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.18, 0.42, 8, 1, true), canvasUmbrellaMat);
        canopy.position.y = 2.22;
        canopy.castShadow = true;
        setGrp.add(canopy);
      }

      // 4 Contoured Outdoor Teak & Steel Café Chairs Facing Table Center
      for (let c = 0; c < 4; c++) {
        const ang = (c / 4) * Math.PI * 2 + Math.PI / 4;
        const ch = new THREE.Group();
        ch.position.set(Math.cos(ang) * 0.76, 0, Math.sin(ang) * 0.76);
        ch.rotation.y = -ang - Math.PI / 2;

        // 4 Splayed Steel Legs
        [[-0.20, -0.19], [0.20, -0.19], [-0.20, 0.19], [0.20, 0.19]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.010, 0.44, 8), this.materials.architecturalBlackMetal);
          leg.position.set(lx, 0.22, lz);
          ch.add(leg);
        });

        // Contoured Teak Seat Slats
        for (let sl = 0; sl < 5; sl++) {
          const seatSlat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.018, 0.068), this.materials.teakWood);
          seatSlat.position.set(0, 0.44, -0.15 + sl * 0.075);
          seatSlat.castShadow = true;
          ch.add(seatSlat);
        }

        // Curved Backrest Posts & Teak Lumbar Slats
        [-0.20, 0.20].forEach((bx) => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.40, 8), this.materials.architecturalBlackMetal);
          post.position.set(bx, 0.62, -0.21);
          post.rotation.x = -0.16;
          ch.add(post);
        });
        [0.64, 0.76].forEach((by) => {
          const backSlat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.055, 0.018), this.materials.teakWood);
          backSlat.position.set(0, by, -0.23 - (by - 0.64) * 0.16);
          backSlat.rotation.x = -0.16;
          backSlat.castShadow = true;
          ch.add(backSlat);
        });

        setGrp.add(ch);
      }

      patio.add(setGrp);
      const tblCol = new THREE.Box3(
        new THREE.Vector3(cs.x - 0.65, 0.0, cs.z - 0.65),
        new THREE.Vector3(cs.x + 0.65, 1.1, cs.z + 0.65)
      );
      this.colliders.push(tblCol);
    });

    siteGroup.add(patio);
  }

  _populateCampusGLBAssets(siteGroup) {
    const loader = new GLTFLoader();
    const isMobile = Boolean(this.options.isMobile);
    const shouldLoadCars = Boolean(this.options.loadVehicles && !isMobile);

    const assetSpecs = isMobile ? {
      brickCol: "./assets/models/brick_column.glb",
      fence: "./assets/models/brick_steel_fence.glb",
      maple: "./assets/models/maple_tree.glb",
      birch: "./assets/models/tree_birch_medium.glb"
    } : {
      brickCol: "./assets/models/brick_column.glb",
      fence: "./assets/models/brick_steel_fence.glb",
      maple: "./assets/models/maple_tree.glb",
      realTree: "./assets/models/realistic_tree.glb",
      oak: "./assets/models/tree_oak_large.glb",
      ash: "./assets/models/tree_ash_tall.glb",
      birch: "./assets/models/tree_birch_medium.glb",
      shrub: "./assets/models/shrub_ornamental.glb",
      grass: "./assets/models/grass_clump.glb"
    };

    const vehicleSpecs = shouldLoadCars ? {
      audiA4:       { url: "./assets/models/car_audi_a4_b8.glb",        targetLength: 4.72 },
      alfaGiulia:   { url: "./assets/models/car_alfa_romeo_giulia.glb", targetLength: 4.64 },
      dodgeCharger: { url: "./assets/models/car_dodge_charger.glb",     targetLength: 5.08 },
      fordF150:     { url: "./assets/models/car_ford_f150.glb",         targetLength: 5.88 },
      bmwTouring:   { url: "./assets/models/car_bmw_m3_touring.glb",    targetLength: 4.79 },
      lexusRcf:     { url: "./assets/models/car_lexus_rcf.glb",         targetLength: 4.71 },
      skylineR34:   { url: "./assets/models/car_skyline_r34.glb",       targetLength: 4.60 }
    } : {};

    const loadNormalized = (url) =>
      new Promise((resolve) => {
        loader.load(
          url,
          (gltf) => {
            const tpl = new THREE.Group();
            const inner = gltf.scene;
            inner.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = false;
                node.receiveShadow = false;
                const mats = Array.isArray(node.material) ? node.material : [node.material];
                mats.forEach((m) => {
                  if (!m) return;
                  if (m.transmission && m.transmission > 0) {
                    m.transmission = 0;
                    m.transparent = true;
                  }
                  if (m.alphaTest > 0 || m.transparent || (m.map && /leaf|foliage|grass|shrub/i.test(m.name || ""))) {
                    m.alphaTest = Math.max(m.alphaTest || 0, 0.44);
                    m.transparent = false; // Opaque alpha-cutout + depthWrite prevents rectangular glass/card halo artifacts!
                    m.depthWrite = true;
                    m.depthTest = true;
                    m.side = THREE.DoubleSide;
                  }
                  m.needsUpdate = true;
                });
              }
            });

            const box = new THREE.Box3().setFromObject(inner);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            // Ground at Y = 0 and center XZ at (0, 0); align longest horizontal axis with +X
            inner.position.set(-center.x, -box.min.y, -center.z);
            tpl.add(inner);
            if (size.z > size.x * 1.25) {
              tpl.rotation.y = Math.PI / 2;
            }
            const normBox = new THREE.Box3().setFromObject(tpl);
            const normSize = new THREE.Vector3();
            normBox.getSize(normSize);
            resolve({ template: tpl, size: normSize });
          },
          undefined,
          (err) => {
            console.warn("Campus GLB asset load skipped:", url, err);
            resolve(null);
          }
        );
      });

    // Dedicated Vehicle Loader: strips hidden physics collider boxes (e.g. COLIDER on Audi A4 B8),
    // normalizes 0.01x FBX-to-GLB scale to exact 1:1 real-world length, preserves +Z = Front nose, and grounds tires at Y = 0!
    const loadVehicleGLB = (spec) =>
      new Promise((resolve) => {
        const url = typeof spec === "string" ? spec : spec.url;
        const targetLength = (typeof spec === "object" && spec.targetLength) ? spec.targetLength : 4.75;
        loader.load(
          url,
          (gltf) => {
            const tpl = new THREE.Group();
            const inner = gltf.scene;
            const nodesToRemove = [];
            inner.traverse((node) => {
              if (/colider|collider|boundingbox/i.test(node.name || "")) {
                nodesToRemove.push(node);
                return;
              }
              if (node.isMesh) {
                if (/colider|collider|boundingbox/i.test(node.geometry?.name || "")) {
                  nodesToRemove.push(node);
                  return;
                }
                node.castShadow = false;
                node.receiveShadow = false;
                const convertMat = (m) => {
                  if (!m) return m;
                  const mName = (m.name || "").toLowerCase();
                  const isGlass = /glass|window|windshield|cristal|vidro|vitre/.test(mName) || (m.transmission && m.transmission > 0);
                  const std = new THREE.MeshStandardMaterial({
                    name: m.name || "Car_Std_Mat",
                    color: m.color ? m.color.clone() : new THREE.Color(0xffffff),
                    map: m.map || null,
                    normalMap: m.normalMap || null,
                    roughnessMap: m.roughnessMap || null,
                    metalnessMap: m.metalnessMap || null,
                    emissive: m.emissive ? m.emissive.clone() : new THREE.Color(0x000000),
                    emissiveMap: m.emissiveMap || null,
                    emissiveIntensity: m.emissiveIntensity ?? 1.0,
                    roughness: isGlass ? 0.08 : Math.min(m.roughness ?? 0.35, 0.55),
                    metalness: isGlass ? 0.25 : (m.metalness ?? 0.45),
                    transparent: isGlass || Boolean(m.transparent),
                    opacity: isGlass ? Math.min(m.opacity ?? 0.55, 0.58) : (m.opacity ?? 1.0),
                    depthWrite: !isGlass,
                    side: m.side ?? THREE.FrontSide
                  });
                  std.envMapIntensity = 1.25;
                  return std;
                };
                if (Array.isArray(node.material)) {
                  node.material = node.material.map(convertMat);
                } else {
                  node.material = convertMat(node.material);
                }
              }
            });
            nodesToRemove.forEach((n) => n.parent?.remove(n));

            inner.updateMatrixWorld(true);
            const rawBox = new THREE.Box3().setFromObject(inner);
            const rawSize = new THREE.Vector3();
            rawBox.getSize(rawSize);
            const horizLen = Math.max(rawSize.z, rawSize.x, 0.001);
            const scaleFactor = targetLength / horizLen;
            inner.scale.multiplyScalar(scaleFactor);
            inner.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(inner);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            // Keep +Z = Front, center X & Z, rest tire contact patches cleanly at Y = 0.000
            inner.position.set(-center.x, -box.min.y, -center.z);
            tpl.add(inner);

            // Soft grounded ambient occlusion contact shadow under vehicle chassis
            const shadowDisc = new THREE.Mesh(
              new THREE.PlaneGeometry(size.x * 0.96, size.z * 0.96),
              new THREE.MeshBasicMaterial({
                color: 0x05070a,
                transparent: true,
                opacity: 0.48,
                depthWrite: false
              })
            );
            shadowDisc.rotation.x = -Math.PI / 2;
            shadowDisc.position.y = 0.012;
            tpl.add(shadowDisc);

            resolve({ template: tpl, size });
          },
          undefined,
          (err) => {
            console.warn("Vehicle GLB asset load skipped:", url, err);
            resolve(null);
          }
        );
      });

    this.assetsReadyPromise = Promise.all([
      Promise.all(Object.entries(assetSpecs).map(async ([key, url]) => [key, await loadNormalized(url)])),
      Promise.all(Object.entries(vehicleSpecs).map(async ([key, spec]) => [key, await loadVehicleGLB(spec)]))
    ]).then(([envEntries, carEntries]) => {
      const lib = Object.fromEntries(envEntries);
      const carLib = Object.fromEntries(carEntries);

      // 1. Perimeter Brick-Column & Steel-Picket Campus Security Fence with Gated South Entry Road
      if (lib.fence && lib.brickCol) {
        const fenceRoot = new THREE.Group();
        fenceRoot.name = "Perimeter_Brick_And_Steel_Campus_Fence";
        const fenceBaySpan = Math.max(2.2, lib.fence.size.x);
        const colTargetH = lib.fence.size.y * 1.08;
        const colScaleY = colTargetH / Math.max(0.4, lib.brickCol.size.y);
        const colScaleXZ = 0.56 / Math.max(0.25, Math.max(lib.brickCol.size.x, lib.brickCol.size.z));

        const placePier = (x, z, scaleMult = 1.0) => {
          const pier = lib.brickCol.template.clone();
          pier.scale.set(colScaleXZ * scaleMult, colScaleY * scaleMult, colScaleXZ * scaleMult);
          pier.position.set(x, 0, z);
          fenceRoot.add(pier);
        };

        const buildFenceRun = (x1, z1, x2, z2, pierEvery = 2) => {
          const dx = x2 - x1;
          const dz = z2 - z1;
          const totalLen = Math.hypot(dx, dz);
          const count = Math.max(1, Math.round(totalLen / fenceBaySpan));
          const stepLen = totalLen / count;
          const angleY = -Math.atan2(dz, dx);

          placePier(x1, z1);
          for (let i = 0; i < count; i++) {
            const tMid = (i + 0.5) / count;
            const seg = lib.fence.template.clone();
            seg.scale.set(stepLen / fenceBaySpan, 1.0, 1.0);
            seg.position.set(x1 + dx * tMid, 0, z1 + dz * tMid);
            seg.rotation.y = angleY;
            fenceRoot.add(seg);

            if ((i + 1) % pierEvery === 0 || i === count - 1) {
              const tEnd = (i + 1) / count;
              placePier(x1 + dx * tEnd, z1 + dz * tEnd);
            }
          }

          // Add slim perimeter AABB collider along straight run
          const minX = Math.min(x1, x2) - 0.25;
          const maxX = Math.max(x1, x2) + 0.25;
          const minZ = Math.min(z1, z2) - 0.25;
          const maxZ = Math.max(z1, z2) + 0.25;
          this.colliders.push(new THREE.Box3(new THREE.Vector3(minX, 0, minZ), new THREE.Vector3(maxX, 2.2, maxZ)));
        };

        // South Fence Split for Gated Campus Entry Road (X = 10.2..17.8 open!)
        buildFenceRun(-32.0, -36.5, 10.2, -36.5, 2);
        buildFenceRun(17.8, -36.5, 54.0, -36.5, 2);
        // West, East & Stepped North Campus Perimeter Fence Runs Enclosing Expanded L-Shape Wing (Z = 33.5)
        buildFenceRun(-32.0, -36.5, -32.0, 33.5, 3);
        buildFenceRun(-32.0, 33.5, 15.0, 33.5, 3);
        buildFenceRun(15.0, 33.5, 15.0, 21.5, 2);
        buildFenceRun(15.0, 21.5, 54.0, 21.5, 3);
        buildFenceRun(54.0, -36.5, 54.0, 21.5, 3);

        // Twin Monument Entry Gate Piers & Open Wrought-Steel Vehicular Gates at (10.2, -36.5) and (17.8, -36.5)
        placePier(10.2, -36.5, 1.32);
        placePier(17.8, -36.5, 1.32);

        // Crown Gate Piers with Architectural Wrought-Iron & Amber Glass Lanterns
        const gateGlassMat = new THREE.MeshStandardMaterial({
          color: 0xfff3c4,
          emissive: 0xffb74d,
          emissiveIntensity: 0.4,
          roughness: 0.2
        });
        this.exteriorLampEmissives.push(gateGlassMat);
        [10.2, 17.8].forEach((gx) => {
          const lanternY = colTargetH * 1.32 + 0.04;
          const lantern = new THREE.Group();
          lantern.position.set(gx, lanternY, -36.5);
          const lBase = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.05, 0.28), this.materials.architecturalBlackMetal);
          lantern.add(lBase);
          const lCore = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.32, 0.20), gateGlassMat);
          lCore.position.y = 0.18;
          lantern.add(lCore);
          const lCap = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.14, 4), this.materials.architecturalBlackMetal);
          lCap.rotation.y = Math.PI / 4;
          lCap.position.y = 0.41;
          lantern.add(lCap);
          const gLight = new THREE.PointLight(0xffd591, 12.0, 14.5, 1.5);
          gLight.position.set(0, 0.22, 0);
          gLight.userData.baseIntensity = 12.0;
          this.exteriorNightLights.push(gLight);
          lantern.add(gLight);
          fenceRoot.add(lantern);
        });

        [-1, 1].forEach((side) => {
          const gatePivot = new THREE.Group();
          gatePivot.position.set(side < 0 ? 10.55 : 17.45, 0, -36.5);
          gatePivot.rotation.y = side < 0 ? Math.PI * 0.42 : -Math.PI * 0.42; // Swung open welcoming entry!
          const gateW = 3.25;
          const gateLeaf = new THREE.Group();
          const topBar = new THREE.Mesh(new THREE.BoxGeometry(gateW, 0.06, 0.06), this.materials.architecturalBlackMetal);
          topBar.position.set((side < 0 ? 1 : -1) * (gateW / 2), 1.82, 0);
          gateLeaf.add(topBar);
          const botBar = topBar.clone();
          botBar.position.y = 0.24;
          gateLeaf.add(botBar);
          for (let p = 0; p <= 16; p++) {
            const px = (side < 0 ? 1 : -1) * ((p / 16) * gateW);
            const picket = new THREE.Mesh(new THREE.BoxGeometry(0.025, 1.72, 0.025), this.materials.architecturalBlackMetal);
            picket.position.set(px, 1.04, 0);
            gateLeaf.add(picket);
          }
          gatePivot.add(gateLeaf);
          fenceRoot.add(gatePivot);
        });

        siteGroup.add(fenceRoot);
      }

      // 2. Multi-Species Specimen Trees & Topographical Hillside Forest (Grounded on 3D Terrain Mesh!)
      const placeTree = (assetKey, x, z, targetH, rotY = 0, yOffset = null) => {
        const entry = lib[assetKey];
        if (!entry) return;
        const inst = entry.template.clone();
        const s = targetH / Math.max(0.5, entry.size.y);
        inst.scale.setScalar(s);
        const groundY = yOffset !== null ? yOffset : Math.max(-0.05, this._sampleTerrainElevation(x, z));
        inst.position.set(x, groundY, z);
        inst.rotation.y = rotY;
        siteGroup.add(inst);
      };

      // A. Corten Planter Specimen Trees Set Back Along Wing Promenades (Main Plaza X = 2.0..18.5 100% Unobstructed!)
      placeTree("oak",   -19.2, -13.1, 5.4, 1.2, 0.16);
      placeTree("birch", -12.5, -13.1, 5.2, 0.4, 0.16);
      placeTree("maple", -3.5,  -13.1, 5.0, 2.1, 0.16);
      placeTree("maple", 22.5,  -13.1, 5.1, 1.1, 0.16);
      placeTree("birch", 34.5,  -13.1, 5.4, 3.8, 0.16);

      // B. Outer Perimeter & Parking Shade Grove (Clear of Building Walls, Gate Driveway & Biotech Parkway!)
      placeTree("oak",      -29.5, -24.0, 8.2, 0.3, 0.0);
      placeTree("ash",      -29.5, -15.2, 7.6, 2.2, 0.0);
      placeTree("realTree",  52.8, -24.0, 7.8, 1.4, 0.0);
      placeTree("maple",      5.8, -35.0, 5.8, 0.9, 0.0);
      placeTree("maple",     22.2, -35.0, 6.0, 3.5, 0.0);
      placeTree("oak",       -6.5, -35.0, 8.0, 1.7, 0.0);
      placeTree("ash",       34.0, -35.0, 7.8, 2.6, 0.0);
      placeTree("birch",     47.0, -35.0, 5.8, 0.8, 0.0);
      placeTree("realTree", -19.5, -35.0, 7.2, 4.1, 0.0);

      // C. North Atrium Vista, Boardroom Panorama, Patio & East/West Groves (Set >= 5.5m Clear of Expanded L-Wing Walls!)
      placeTree("maple",    11.5,  16.2, 6.0, 0.6, 0.0); // Reception DNA North Window & East Rear L-Wing Vista
      placeTree("birch",    14.6,  16.8, 6.2, 2.4, 0.0); // Reception DNA North Window Vista
      placeTree("realTree", 19.4,  17.2, 7.2, 1.2, 0.0); // Grand Boardroom Panoramic Window Vista
      placeTree("maple",    24.6,  16.5, 5.8, 3.1, 0.0); // Grand Boardroom Panoramic Window Vista
      placeTree("birch",    24.8,  13.8, 5.2, 0.9, 0.0); // West of Outdoor Staff Patio
      placeTree("oak",      40.4,  16.6, 7.8, 2.0, 0.0); // East of Outdoor Staff Patio (Clear of Building!)
      placeTree("ash",      50.8,   6.8, 7.8, 1.5, 0.0); // Far East Campus Lawn (>= 6.8m clear of Women's Locker Wall!)
      placeTree("maple",    50.6,  -4.2, 6.2, 3.9, 0.0); // Far East Campus Lawn (>= 6.6m clear of Women's Locker Wall!)
      placeTree("oak",     -28.5,   4.2, 8.2, 0.7, 0.0); // Far West Lab Vista Grove
      placeTree("birch",   -28.2,  -4.4, 6.0, 2.5, 0.0); // Far West Lab Vista Grove
      placeTree("ash",     -28.5,  18.5, 8.0, 1.8, 0.0); // West of High-Bay Rear L-Wing
      placeTree("realTree", -9.5,  31.2, 7.4, 3.3, 0.0); // North of High-Bay Rear L-Wing

      // D. Multi-Tiered Hillside & Roadside Forest Grounded on the 3D Topographical Terrain (Desktop only)
      if (!isMobile) {
        const horizonRing = [
          // Roadside Parkland Trees Framing Neighboring Biotech Buildings across Biotech Parkway
          ["maple", -92, -62, 8.6], ["birch", -46, -62, 8.2], ["maple", -29, -62, 8.4],
          ["birch", 15, -62, 8.2], ["maple", 34, -62, 8.5], ["oak", 78, -62, 9.8],
          ["ash", 94, -60, 10.4], ["oak", -96, -24, 10.2], ["maple", -44, -22, 7.8],
          // Mid-Slope Foothill Groves (Grounded directly on 3D terrain elevation!)
          ["oak", 68, -26, 11.0], ["ash", 72, -8, 11.6], ["realTree", 70, 10, 10.4],
          ["oak", 64, 28, 11.0], ["maple", 46, 36, 9.6], ["ash", 30, 38, 11.4],
          ["oak", 14, 42, 11.2], ["realTree", -2, 44, 10.6], ["ash", -18, 42, 11.4],
          ["oak", -34, 40, 10.8], ["realTree", -48, 28, 10.2], ["ash", -54, 8, 11.4],
          ["oak", -54, -8, 10.8],
          // Distant Ridgeline Forest Canopy (Z = -125..+110, X = -140..+155)
          ["oak", -115, -108, 14.5], ["ash", -82, -114, 15.2], ["realTree", -46, -112, 13.8],
          ["oak", -8, -116, 14.8], ["ash", 32, -115, 15.0], ["oak", 68, -112, 14.6],
          ["realTree", 104, -106, 14.0], ["oak", 122, -44, 14.8], ["ash", 126, -6, 15.4],
          ["oak", 118, 36, 14.6], ["realTree", 92, 68, 13.8], ["ash", 56, 78, 15.2],
          ["oak", 18, 84, 14.8], ["realTree", -22, 82, 14.0], ["ash", -58, 74, 15.0],
          ["oak", -92, 48, 14.6], ["realTree", -108, 4, 14.2], ["ash", -106, -42, 15.0]
        ];
        horizonRing.forEach(([sp, hx, hz, hh], idx) => {
          placeTree(sp, hx, hz, hh, idx * 1.37);
        });

        // 3. Ornamental Shrubs & Realistic Grass Clumps in Mulched Campus & Patio Beds
        const southShrubX = [-21.0, -18.2, -15.4, -10.8, -5.2, -2.4, 2.8, 4.4, 18.2, 20.6, 22.8, 26.2, 29.4, 32.8, 38.6, 41.2];
        southShrubX.forEach((sx, i) => {
          placeTree("shrub", sx, i % 2 === 0 ? -11.55 : -13.15, 0.95 + (i % 3) * 0.16, i * 1.1, 0.02);
          placeTree("grass", sx + 0.75, -11.35, 0.46 + (i % 2) * 0.12, i * 0.8, 0.02);
        });

        // Patio & North Vista Planting Beds
        [
          [25.85, 11.4], [25.85, 13.4], [25.85, 15.2],
          [36.35, 11.4], [36.35, 13.4], [36.35, 15.2],
          [28.2, 17.4], [30.2, 17.4], [11.2, 11.6], [13.4, 11.6], [18.0, 11.6], [22.5, 11.6]
        ].forEach(([px, pz], i) => {
          placeTree("shrub", px, pz, 0.92 + (i % 2) * 0.18, i * 1.5, 0.02);
          placeTree("grass", px + 0.55, pz - 0.25, 0.48, i * 0.9, 0.02);
        });
      }

      // 4. Populate Everyday Vehicles (Only when cars enabled / non-mobile)
      if (shouldLoadCars) {
        const headlampMat = new THREE.MeshBasicMaterial({ color: 0xfff8e1 });
        const taillampMat = new THREE.MeshBasicMaterial({ color: 0xff1e1e });
        const beamTex = this._getRadialLightPoolTexture("#fff3c4");

        const attachTrafficLighting = (carInstance, size) => {
          const halfW = size.x * 0.34;
          const frontZ = size.z * 0.475;
          const rearZ = -size.z * 0.475;

          // Twin Front LED Headlamps (+Z local)
          [-halfW, halfW].forEach((lx) => {
            const hl = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.04), headlampMat);
            hl.position.set(lx, 0.62, frontZ);
            hl.userData.daytimeRunning = true;
            this.nightTrafficLightMeshes.push(hl);
            carInstance.add(hl);
          });

          // Twin Rear Ruby LED Taillight Bars (-Z local)
          [-halfW, halfW].forEach((lx) => {
            const tl = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.075, 0.04), taillampMat);
            tl.position.set(lx, 0.68, rearZ);
            tl.userData.daytimeRunning = true;
            this.nightTrafficLightMeshes.push(tl);
            carInstance.add(tl);
          });

          // Forward Headlight Ground Illumination Pool (+Z local, visible at Dusk & Night)
          const beamPool = new THREE.Mesh(
            new THREE.PlaneGeometry(3.2, 6.8),
            new THREE.MeshBasicMaterial({
              map: beamTex,
              transparent: true,
              opacity: 0.36,
              depthWrite: false,
              blending: THREE.AdditiveBlending
            })
          );
          beamPool.rotation.x = -Math.PI / 2;
          beamPool.position.set(0, 0.022, frontZ + 3.1);
          beamPool.visible = false;
          beamPool.userData.baseOpacity = 0.38;
          this.nightTrafficLightMeshes.push(beamPool);
          carInstance.add(beamPool);
        };

        // A. Parked Everyday & Executive Vehicles Grounded in Campus Stalls (Y = 0.000)
        const parkedCampusCars = [
          { key: "fordF150",     x: -17.2, z: -17.15, rotY: 0 },        // West Stall 2: Ford F-150 Pickup
          { key: "audiA4",       x: -8.8,  z: -17.15, rotY: 0 },        // West Stall 5: Audi A4 B8 Sedan
          { key: "alfaGiulia",   x: 2.4,   z: -17.15, rotY: 0 },        // West EV Stall: 2021 Alfa Romeo Giulia
          { key: "dodgeCharger", x: 20.8,  z: -17.15, rotY: Math.PI },  // East Stall 2 (Backed-In): Dodge Charger R/T
          { key: "audiA4",       x: 26.4,  z: -17.15, rotY: 0 },        // East Stall 4: Audi A4 B8 Sedan
          { key: "bmwTouring",   x: 32.0,  z: -17.15, rotY: 0 },        // East EV Stall: BMW M3 Touring Wagon
          { key: "lexusRcf",     x: 40.4,  z: -17.15, rotY: Math.PI },  // East Stall 9 (Backed-In): Lexus RC-F
          // Additional Parked Everyday Cars at Roadside Research Buildings Across Biotech Parkway
          { key: "fordF150",     x: -76.0, z: -59.5,  rotY: Math.PI },
          { key: "alfaGiulia",   x: -60.0, z: -59.5,  rotY: Math.PI },
          { key: "dodgeCharger", x: 48.0,  z: -59.5,  rotY: Math.PI },
          { key: "audiA4",       x: 64.0,  z: -59.5,  rotY: Math.PI }
        ];
        parkedCampusCars.forEach((spec) => {
          const entry = carLib[spec.key];
          if (!entry) return;
          const car = entry.template.clone();
          car.position.set(spec.x, 0.0, spec.z);
          car.rotation.y = spec.rotY;
          siteGroup.add(car);
          this.colliders.push(
            new THREE.Box3(
              new THREE.Vector3(spec.x - 1.15, 0.0, spec.z - 2.65),
              new THREE.Vector3(spec.x + 1.15, 1.8, spec.z + 2.65)
            )
          );
        });

        // B. 9 Live Animated Everyday Vehicles on 4-Lane Biotech Parkway & Gated Campus Driveway
        const liveTrafficSpecs = [
          // Westbound (-X, North side of double-yellow centerline Z = -46.8)
          { key: "audiA4",       axis: "x", x: 18.0,  z: -42.55, dir: -1, speed: 10.5, minCoord: -135.0, maxCoord: 162.0, rotY: -Math.PI / 2 },
          { key: "fordF150",     axis: "x", x: 64.0,  z: -42.55, dir: -1, speed: 10.5, minCoord: -135.0, maxCoord: 162.0, rotY: -Math.PI / 2 },
          { key: "alfaGiulia",   axis: "x", x: -8.0,  z: -45.35, dir: -1, speed: 12.8, minCoord: -135.0, maxCoord: 162.0, rotY: -Math.PI / 2 },
          { key: "dodgeCharger", axis: "x", x: -58.0, z: -45.35, dir: -1, speed: 12.8, minCoord: -135.0, maxCoord: 162.0, rotY: -Math.PI / 2 },
          // Eastbound (+X, South side of double-yellow centerline Z = -46.8)
          { key: "dodgeCharger", axis: "x", x: -4.0,  z: -48.25, dir:  1, speed: 13.2, minCoord: -135.0, maxCoord: 162.0, rotY: Math.PI / 2 },
          { key: "fordF150",     axis: "x", x: -54.0, z: -48.25, dir:  1, speed: 11.4, minCoord: -135.0, maxCoord: 162.0, rotY: Math.PI / 2 },
          { key: "audiA4",       axis: "x", x: 24.0,  z: -51.05, dir:  1, speed: 11.0, minCoord: -135.0, maxCoord: 162.0, rotY: Math.PI / 2 },
          { key: "skylineR34",   axis: "x", x: 82.0,  z: -51.05, dir:  1, speed: 11.8, minCoord: -135.0, maxCoord: 162.0, rotY: Math.PI / 2 },
          // Campus Entry Road Inbound (+Z on right-hand inbound lane X = 15.65, entering from Biotech Parkway into Parking Lot!)
          { key: "alfaGiulia",   axis: "z", x: 15.65, z: -38.5,  dir:  1, speed: 5.4,  minCoord: -41.5,  maxCoord: -25.0, rotY: 0 }
        ];

        liveTrafficSpecs.forEach((spec) => {
          const entry = carLib[spec.key];
          if (!entry) return;
          const car = entry.template.clone();
          car.position.set(spec.x, 0.0, spec.z);
          car.rotation.y = spec.rotY;
          attachTrafficLighting(car, entry.size);
          siteGroup.add(car);
          this.streetTrafficVehicles.push({
            mesh: car,
            axis: spec.axis,
            x: spec.x,
            z: spec.z,
            dir: spec.dir,
            speed: spec.speed,
            minCoord: spec.minCoord,
            maxCoord: spec.maxCoord
          });
        });
      }

      // Re-apply atmosphere mood so newly spawned car lights match active Daylight/Dusk/Night state
      this.setAtmosphereMood(this.currentMood || "daylight");
      this._exteriorCampusModelsLoaded = true;
    });
  }

  // Deterministic Multi-Octave 2D Ridged & Rolling FBM Elevation Sampler for the Surrounding Valley & Foothills
  // Flattens smoothly to Y = -0.055m across the Campus Pad, Biotech Parkway Corridor, and Roadside Neighbor Parcels!
  _sampleTerrainElevation(x, z) {
    // 1. Distance outside flat graded campus + roadway + roadside research park envelope
    const padX = x < -44.0 ? (-44.0 - x) : (x > 64.0 ? (x - 64.0) : 0.0);
    const padZ = z < -92.0 ? (-92.0 - z) : (z > 36.0 ? (z - 36.0) : 0.0);
    // Keep the East-West Biotech Parkway arterial corridor (Z in [-58, -36]) graded gently even at far X
    const roadCorridorDist = Math.abs(z + 46.8);
    const inRoadwayBelt = roadCorridorDist < 12.5 ? 0.0 : Math.min(1.0, (roadCorridorDist - 12.5) / 24.0);

    const rawDist = Math.hypot(padX * inRoadwayBelt, padZ);
    if (rawDist <= 0.5) return -0.055;

    const blend = Math.min(1.0, Math.pow((rawDist - 0.5) / 52.0, 1.45));

    // Multi-octave trigonometric + ridged FBM synthesis (zero generic spheres!)
    const n1 = Math.sin(x * 0.014 + 0.7) * Math.cos(z * 0.013 - 0.4)
             + 0.65 * Math.sin((x * 0.021 - z * 0.018) + 1.9);
    const n2 = 0.5 * Math.cos(x * 0.037 + z * 0.031 + 2.4)
             + 0.35 * Math.sin(x * 0.058 - z * 0.049 - 1.1);
    const ridge1 = 1.0 - Math.abs(Math.sin(x * 0.011 + z * 0.009 + 0.85));
    const ridge2 = 1.0 - Math.abs(Math.cos(x * 0.023 - z * 0.019 - 0.55));
    const detail = 0.18 * Math.sin(x * 0.11 + z * 0.09) * Math.cos(x * 0.08 - z * 0.12);

    // Scenic backdrop ridgelines rising behind the North L-Wing (Z > 38), West & East valley walls, and South horizon
    const northBackdropBoost = z > 36.0 ? Math.min(26.0, (z - 36.0) * 0.11) : 0.0;
    const southHorizonBoost  = z < -92.0 ? Math.min(22.0, (-92.0 - z) * 0.095) : 0.0;
    const valleyWallBoost    = Math.min(18.0, Math.max(0.0, Math.abs(x - 10.0) - 70.0) * 0.075);

    const rawElev = Math.max(
      0.0,
      (n1 * 3.8 + n2 * 2.1 + Math.pow(ridge1, 1.8) * 9.5 + Math.pow(ridge2, 2.0) * 5.4 + detail)
      + northBackdropBoost + southHorizonBoost + valleyWallBoost
    );

    return -0.055 + blend * rawElev;
  }

  // Builds a Continuous 1,400m x 1,400m Displaced 3D Topographical Terrain Mesh with Vertex-Colored Biome Strata
  // and Sculpted Stratified Limestone Rock Outcrops (Zero SphereGeometry Berms!)
  _buildTopographicalSurroundingTerrain(siteGroup) {
    const terrainSpan = 1400.0;
    const segs = 220;
    const terrainGeo = new THREE.PlaneGeometry(terrainSpan, terrainSpan, segs, segs);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const cLowGrass  = new THREE.Color(0x416b30);
    const cMeadow    = new THREE.Color(0x52763d);
    const cHighBrush = new THREE.Color(0x637b50);
    const cRockBluff = new THREE.Color(0x7c776e);
    const tmpColor   = new THREE.Color();

    const offsetX = 14.0;
    const offsetZ = -10.0;

    for (let i = 0; i < pos.count; i++) {
      const wx = pos.getX(i) + offsetX;
      const wz = pos.getZ(i) + offsetZ;
      const wy = this._sampleTerrainElevation(wx, wz);
      pos.setX(i, wx);
      pos.setY(i, wy);
      pos.setZ(i, wz);

      // Estimate local slope via finite difference to expose natural limestone rock strata on steep bluffs
      const wyDx = this._sampleTerrainElevation(wx + 2.5, wz);
      const wyDz = this._sampleTerrainElevation(wx, wz + 2.5);
      const slope = Math.hypot(wyDx - wy, wyDz - wy) / 2.5;

      const hNorm = Math.min(1.0, Math.max(0.0, (wy + 0.055) / 24.0));
      tmpColor.copy(cLowGrass).lerp(cMeadow, Math.min(1.0, hNorm * 1.8));
      if (hNorm > 0.35) {
        tmpColor.lerp(cHighBrush, Math.min(1.0, (hNorm - 0.35) * 1.5));
      }
      if (slope > 0.24 && wy > 1.8) {
        const rockWeight = Math.min(0.88, (slope - 0.24) * 2.4);
        tmpColor.lerp(cRockBluff, rockWeight);
      }

      colors[i * 3]     = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }

    terrainGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.92,
      metalness: 0.02,
      bumpMap: this.materials.grassTurf?.bumpMap || null,
      bumpScale: 0.035,
      name: "Mat_Topographical_Valley_Terrain"
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    terrainMesh.name = "Topographical_3D_Surrounding_Terrain";
    siteGroup.add(terrainMesh);

    // Sculpted Stratified Limestone Outcrop Ledges Embedded in Hillside Slopes (Polygonal Stepped Extrusions)
    const limestoneOutcropMat = new THREE.MeshStandardMaterial({
      color: 0x827d73,
      roughness: 0.88,
      metalness: 0.05,
      name: "Mat_Stratified_Limestone_Outcrop"
    });
    const buildLimestoneOutcrop = (ox, oz, scaleXZ, strataCount, rotY) => {
      const grp = new THREE.Group();
      const baseY = this._sampleTerrainElevation(ox, oz) - 0.35;
      grp.position.set(ox, baseY, oz);
      grp.rotation.y = rotY;

      for (let s = 0; s < strataCount; s++) {
        const shrink = 1.0 - s * 0.16;
        const pts = [];
        const numVerts = 9;
        for (let v = 0; v < numVerts; v++) {
          const ang = (v / numVerts) * Math.PI * 2;
          const rMod = 0.72 + 0.28 * Math.sin(v * 2.7 + s * 1.3) + 0.15 * Math.cos(v * 4.1 - s);
          pts.push(new THREE.Vector2(Math.cos(ang) * scaleXZ * shrink * rMod, Math.sin(ang) * scaleXZ * 0.58 * shrink * rMod));
        }
        const shape = new THREE.Shape(pts);
        const layerH = 0.55 + (s % 2) * 0.24;
        const extGeo = new THREE.ExtrudeGeometry(shape, {
          depth: layerH,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.14,
          bevelThickness: 0.12
        });
        extGeo.rotateX(-Math.PI / 2);
        const ledge = new THREE.Mesh(extGeo, limestoneOutcropMat);
        ledge.position.set(s * 0.35, s * 0.48, -s * 0.22);
        ledge.castShadow = true;
        ledge.receiveShadow = true;
        grp.add(ledge);
      }
      siteGroup.add(grp);
    };

    [
      [-64, 48, 6.8, 4, 0.4],
      [-28, 62, 8.2, 5, 1.9],
      [28,  66, 7.5, 4, 2.7],
      [82,  42, 6.4, 4, 0.8],
      [-94, -88, 7.8, 4, 1.2],
      [96,  -86, 8.0, 4, 2.3]
    ].forEach(([ox, oz, sc, st, ry]) => buildLimestoneOutcrop(ox, oz, sc, st, ry));
  }

  // Builds 4 Detailed Modern Architectural Research Park Buildings Along Biotech Parkway
  // (Inspired by Torrey View, Thrasher Works, and Recessed Cedar-Portal Reference Designs)
  _buildNeighboringRoadsideBuildings(siteGroup) {
    const neighborRoot = new THREE.Group();
    neighborRoot.name = "Biotech_Parkway_Neighboring_Research_Buildings";

    const darkMasonryMat = new THREE.MeshStandardMaterial({ color: 0x3b3f46, roughness: 0.78, metalness: 0.08 });
    const warmGreyMasonryMat = new THREE.MeshStandardMaterial({ color: 0x8c8982, roughness: 0.72, metalness: 0.06 });
    const champagnePanelMat = new THREE.MeshStandardMaterial({ color: 0xe4ddd3, roughness: 0.38, metalness: 0.16 });
    const terracottaCoreMat = new THREE.MeshStandardMaterial({ color: 0xb4532a, roughness: 0.50, metalness: 0.12 });
    const cedarPortalMat = this.materials.teakWood || this.materials.flutedWalnut;
    const mullionMat = this.materials.architecturalBlackMetal;
    const glassMat = this.materials.reflectiveExteriorGlass;
    const walkMat = new THREE.MeshStandardMaterial({ color: 0xcbd2db, roughness: 0.84, metalness: 0.04 });

    // Helper: Mullioned Curtain-Wall Bay with Warm Nighttime Interior Glow
    const addCurtainBay = (parent, cx, cy, cz, w, h, rotY = 0, withUpperLouvers = false) => {
      const bay = new THREE.Group();
      bay.position.set(cx, cy, cz);
      bay.rotation.y = rotY;

      const glass = new THREE.Mesh(new THREE.BoxGeometry(w - 0.12, h - 0.12, 0.04), glassMat);
      bay.add(glass);

      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(w - 0.18, h - 0.18),
        new THREE.MeshBasicMaterial({
          map: this._getWarmWindowGlowTexture(),
          transparent: true,
          opacity: 0.62,
          depthWrite: false,
          side: THREE.DoubleSide
        })
      );
      glow.position.z = -0.06;
      glow.visible = false;
      glow.userData.baseOpacity = 0.62;
      this.nightWindowGlowMeshes.push(glow);
      bay.add(glow);

      // Perimeter Frame & Vertical Mullions every ~1.4m
      const topR = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, 0.18), mullionMat);
      topR.position.y = h / 2 - 0.04;
      bay.add(topR);
      const botR = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, 0.18), mullionMat);
      botR.position.y = -h / 2 + 0.04;
      bay.add(botR);

      const cols = Math.max(2, Math.round(w / 1.45));
      for (let c = 0; c <= cols; c++) {
        const mx = -w / 2 + (c / cols) * w;
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.055, h, 0.16), mullionMat);
        m.position.x = mx;
        bay.add(m);
      }
      const transom = new THREE.Mesh(new THREE.BoxGeometry(w, 0.055, 0.16), mullionMat);
      transom.position.y = h / 2 - 0.95;
      bay.add(transom);

      if (withUpperLouvers) {
        for (let l = 0; l < 6; l++) {
          const ly = (h / 2 - 0.88) + l * 0.14;
          const slat = new THREE.Mesh(new THREE.BoxGeometry(w - 0.08, 0.03, 0.12), cedarPortalMat);
          slat.position.set(0, ly, 0.09);
          slat.rotation.x = 0.22;
          bay.add(slat);
        }
      }

      parent.add(bay);
    };

    // -------------------------------------------------------------------------
    // BUILDING A (South-West Across Biotech Parkway: X = -68.0, Z = -70.0, Facing North +Z)
    // Inspired by Reference Photo 5: Grey Masonry Wings + Tall Silver/Cedar Recessed Portal Entry!
    // -------------------------------------------------------------------------
    const bldA = new THREE.Group();
    bldA.position.set(-68.0, 0, -70.0);

    // West & East Stepped Masonry Wings
    const wingAW = new THREE.Mesh(new THREE.BoxGeometry(13.5, 5.4, 15.0), warmGreyMasonryMat);
    wingAW.position.set(-9.25, 2.7, 0);
    wingAW.castShadow = true;
    wingAW.receiveShadow = true;
    bldA.add(wingAW);

    const wingAE = new THREE.Mesh(new THREE.BoxGeometry(13.5, 5.4, 15.0), warmGreyMasonryMat);
    wingAE.position.set(9.25, 2.7, 0);
    wingAE.castShadow = true;
    wingAE.receiveShadow = true;
    bldA.add(wingAE);

    // Dark Charcoal Parapet Coping & Window Surrounds
    [-9.25, 9.25].forEach((wx) => {
      const coping = new THREE.Mesh(new THREE.BoxGeometry(13.7, 0.18, 15.2), darkMasonryMat);
      coping.position.set(wx, 5.49, 0);
      bldA.add(coping);
      addCurtainBay(bldA, wx, 2.25, 7.52, 9.6, 3.6, 0, false);
    });

    // Central Higher Silver-Composite Entry Tower with Deep Warm Cedar Recessed Portal
    const towerA = new THREE.Mesh(new THREE.BoxGeometry(5.8, 6.8, 16.2), champagnePanelMat);
    towerA.position.set(0, 3.4, 0.4);
    towerA.castShadow = true;
    bldA.add(towerA);

    const cedarSoffitA = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.18, 1.8), cedarPortalMat);
    cedarSoffitA.position.set(0, 5.95, 7.8);
    bldA.add(cedarSoffitA);
    [-2.15, 2.15].forEach((px) => {
      const cedarJamb = new THREE.Mesh(new THREE.BoxGeometry(0.18, 6.0, 1.8), cedarPortalMat);
      cedarJamb.position.set(px, 3.0, 7.8);
      bldA.add(cedarJamb);
    });
    addCurtainBay(bldA, 0, 2.9, 7.65, 4.1, 5.6, 0, true);

    // Forecourt Parking Apron & Entry Walkway connecting to Biotech Parkway South Sidewalk (Z = -53.68)
    const lotA = new THREE.Mesh(new THREE.BoxGeometry(34.0, 0.04, 8.8), this.materials.asphalt);
    lotA.position.set(0, -0.015, 11.8);
    lotA.receiveShadow = true;
    bldA.add(lotA);
    const walkA = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.08, 9.2), walkMat);
    walkA.position.set(0, 0.04, 11.9);
    bldA.add(walkA);

    neighborRoot.add(bldA);

    // -------------------------------------------------------------------------
    // BUILDING B (South-Central Across Biotech Parkway: X = -8.0, Z = -73.0, Facing North +Z)
    // Inspired by Torrey View Reference: Two-Story Angled Champagne Curtain-Wall Pavilion + Terracotta Core Tower!
    // -------------------------------------------------------------------------
    const bldB = new THREE.Group();
    bldB.position.set(-8.0, 0, -73.0);

    const mainVolB = new THREE.Mesh(new THREE.BoxGeometry(32.0, 8.2, 16.5), champagnePanelMat);
    mainVolB.position.set(0, 4.1, 0);
    mainVolB.castShadow = true;
    mainVolB.receiveShadow = true;
    bldB.add(mainVolB);

    // Sculpted Cantilevered Roof Overhang with Warm Cedar Soffit
    const roofOverB = new THREE.Mesh(new THREE.BoxGeometry(34.4, 0.36, 19.2), champagnePanelMat);
    roofOverB.position.set(0, 8.38, 0.8);
    roofOverB.castShadow = true;
    bldB.add(roofOverB);
    const soffitB = new THREE.Mesh(new THREE.BoxGeometry(34.0, 0.05, 18.8), cedarPortalMat);
    soffitB.position.set(0, 8.18, 0.8);
    bldB.add(soffitB);

    // 2-Story North Curtain-Wall Facade Facing Biotech Parkway
    addCurtainBay(bldB, -7.2, 4.0, 8.28, 11.8, 6.8, 0, true);
    addCurtainBay(bldB, 6.8,  4.0, 8.28, 11.8, 6.8, 0, true);

    // Signature Terracotta Vertical Stair & Elevator Feature Tower on East Corner
    const terraTowerB = new THREE.Mesh(new THREE.BoxGeometry(5.4, 9.8, 6.4), terracottaCoreMat);
    terraTowerB.position.set(16.8, 4.9, 5.8);
    terraTowerB.castShadow = true;
    bldB.add(terraTowerB);
    addCurtainBay(bldB, 16.8, 4.8, 9.02, 2.8, 7.8, 0, false);

    // Landscaped Pedestrian Plaza Linking to Biotech Parkway South Sidewalk
    const plazaB = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.08, 11.2), walkMat);
    plazaB.position.set(0, 0.04, 13.8);
    plazaB.receiveShadow = true;
    bldB.add(plazaB);

    neighborRoot.add(bldB);

    // -------------------------------------------------------------------------
    // BUILDING C (South-East Across Biotech Parkway: X = 56.0, Z = -70.0, Facing North +Z)
    // Inspired by Thrasher Works Reference: Brick & Limestone Wing + Double-Height Louvered Corner Entry Pavilion!
    // -------------------------------------------------------------------------
    const bldC = new THREE.Group();
    bldC.position.set(56.0, 0, -70.0);

    const brickWingC = new THREE.Mesh(
      new THREE.BoxGeometry(22.0, 5.2, 15.0),
      this._createBrickCladdingMaterial(22.0, 5.2)
    );
    brickWingC.position.set(4.5, 2.6, 0);
    brickWingC.castShadow = true;
    brickWingC.receiveShadow = true;
    bldC.add(brickWingC);

    const wingCopingC = new THREE.Mesh(new THREE.BoxGeometry(22.3, 0.16, 15.3), mullionMat);
    wingCopingC.position.set(4.5, 5.28, 0);
    bldC.add(wingCopingC);
    addCurtainBay(bldC, 1.5, 2.3, 7.52, 6.8, 3.2, 0, false);
    addCurtainBay(bldC, 10.2, 2.3, 7.52, 6.8, 3.2, 0, false);

    // Double-Height Limestone & Louvered Glass Corner Entry Pavilion with Jetting Cantilevered Roof
    const pavC = new THREE.Mesh(new THREE.BoxGeometry(9.6, 6.8, 16.2), champagnePanelMat);
    pavC.position.set(-10.8, 3.4, 0.4);
    pavC.castShadow = true;
    bldC.add(pavC);

    const jetRoofC = new THREE.Mesh(new THREE.BoxGeometry(12.8, 0.30, 19.6), mullionMat);
    jetRoofC.position.set(-10.8, 6.95, 1.4);
    jetRoofC.castShadow = true;
    bldC.add(jetRoofC);
    const jetSoffitC = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.05, 19.2), cedarPortalMat);
    jetSoffitC.position.set(-10.8, 6.78, 1.4);
    bldC.add(jetSoffitC);

    addCurtainBay(bldC, -10.8, 3.1, 8.52, 7.4, 5.6, 0, true);

    const lotC = new THREE.Mesh(new THREE.BoxGeometry(30.0, 0.04, 8.8), this.materials.asphalt);
    lotC.position.set(0, -0.015, 11.8);
    lotC.receiveShadow = true;
    bldC.add(lotC);

    neighborRoot.add(bldC);

    // -------------------------------------------------------------------------
    // BUILDING D (West Roadside Annex on North Side of Biotech Parkway: X = -68.0, Z = -20.0, Facing South -Z)
    // -------------------------------------------------------------------------
    const bldD = new THREE.Group();
    bldD.position.set(-68.0, 0, -20.0);

    const bodyD = new THREE.Mesh(new THREE.BoxGeometry(26.0, 6.0, 15.0), champagnePanelMat);
    bodyD.position.set(0, 3.0, 0);
    bodyD.castShadow = true;
    bodyD.receiveShadow = true;
    bldD.add(bodyD);

    const roofD = new THREE.Mesh(new THREE.BoxGeometry(27.8, 0.28, 16.8), mullionMat);
    roofD.position.set(0, 6.14, -0.4);
    roofD.castShadow = true;
    bldD.add(roofD);
    const soffitD = new THREE.Mesh(new THREE.BoxGeometry(27.4, 0.05, 16.4), cedarPortalMat);
    soffitD.position.set(0, 5.98, -0.4);
    bldD.add(soffitD);

    addCurtainBay(bldD, -6.2, 2.8, -7.52, 8.8, 4.4, Math.PI, true);
    addCurtainBay(bldD, 6.2,  2.8, -7.52, 8.8, 4.4, Math.PI, true);

    const walkD = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.07, 11.8), walkMat);
    walkD.position.set(0, 0.035, -13.4);
    bldD.add(walkD);

    neighborRoot.add(bldD);

    // -------------------------------------------------------------------------
    // BUILDING E (East Roadside Biosciences Complex on North Side of Biotech Parkway: X = 74.0, Z = -20.0, Facing South -Z)
    // Positioned directly in the main overview camera sightline along the visible East roadway!
    // -------------------------------------------------------------------------
    const bldE = new THREE.Group();
    bldE.position.set(74.0, 0, -20.0);

    const bodyE = new THREE.Mesh(new THREE.BoxGeometry(30.0, 7.6, 16.0), champagnePanelMat);
    bodyE.position.set(0, 3.8, 0);
    bodyE.castShadow = true;
    bodyE.receiveShadow = true;
    bldE.add(bodyE);

    const wingRoofE = new THREE.Mesh(new THREE.BoxGeometry(32.4, 0.34, 18.8), champagnePanelMat);
    wingRoofE.position.set(0, 7.85, -0.8);
    wingRoofE.rotation.z = -0.025;
    wingRoofE.castShadow = true;
    bldE.add(wingRoofE);

    const wingSoffitE = new THREE.Mesh(new THREE.BoxGeometry(32.0, 0.06, 18.4), cedarPortalMat);
    wingSoffitE.position.set(0, 7.65, -0.8);
    wingSoffitE.rotation.z = -0.025;
    bldE.add(wingSoffitE);

    addCurtainBay(bldE, -7.2, 3.6, -8.02, 10.6, 6.2, Math.PI, true);
    addCurtainBay(bldE,  6.4, 3.6, -8.02, 10.6, 6.2, Math.PI, true);
    // West facade facing our campus fence (-X)
    addCurtainBay(bldE, -15.02, 3.6, 0, 11.4, 6.2, -Math.PI / 2, true);

    const terraTowerE = new THREE.Mesh(new THREE.BoxGeometry(5.2, 9.2, 6.2), terracottaCoreMat);
    terraTowerE.position.set(-14.6, 4.6, -6.2);
    terraTowerE.castShadow = true;
    bldE.add(terraTowerE);
    addCurtainBay(bldE, -14.6, 4.5, -9.32, 2.6, 7.2, Math.PI, false);

    const lotE = new THREE.Mesh(new THREE.BoxGeometry(28.0, 0.04, 9.6), this.materials.asphalt);
    lotE.position.set(0, -0.015, -13.2);
    lotE.receiveShadow = true;
    bldE.add(lotE);

    const walkE = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.07, 11.4), walkMat);
    walkE.position.set(-6.0, 0.035, -13.6);
    bldE.add(walkE);

    neighborRoot.add(bldE);

    // -------------------------------------------------------------------------
    // BUILDING F (North-East Research Park Pavilion: X = 44.0, Z = 36.0, Facing South -Z)
    // -------------------------------------------------------------------------
    const bldF = new THREE.Group();
    bldF.position.set(44.0, 0, 36.0);

    const brickBodyF = new THREE.Mesh(
      new THREE.BoxGeometry(24.0, 5.8, 15.0),
      this._createBrickCladdingMaterial(24.0, 5.8)
    );
    brickBodyF.position.set(3.2, 2.9, 0);
    brickBodyF.castShadow = true;
    brickBodyF.receiveShadow = true;
    bldF.add(brickBodyF);

    const pavF = new THREE.Mesh(new THREE.BoxGeometry(9.4, 7.2, 16.4), champagnePanelMat);
    pavF.position.set(-11.2, 3.6, -0.6);
    pavF.castShadow = true;
    bldF.add(pavF);

    const jetRoofF = new THREE.Mesh(new THREE.BoxGeometry(12.6, 0.30, 19.4), mullionMat);
    jetRoofF.position.set(-11.2, 7.35, -1.4);
    jetRoofF.castShadow = true;
    bldF.add(jetRoofF);
    const jetSoffitF = new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.05, 19.0), cedarPortalMat);
    jetSoffitF.position.set(-11.2, 7.18, -1.4);
    bldF.add(jetSoffitF);

    addCurtainBay(bldF, -11.2, 3.4, -8.82, 7.2, 5.8, Math.PI, true);
    addCurtainBay(bldF, 0.8, 2.6, -7.52, 7.4, 3.8, Math.PI, false);
    addCurtainBay(bldF, 9.8, 2.6, -7.52, 7.4, 3.8, Math.PI, false);

    neighborRoot.add(bldF);

    siteGroup.add(neighborRoot);
  }

  // --- Exterior Campus, Parking Lot & Landscaping Architecture ---
  _buildExteriorCampusSite() {
    const siteGroup = new THREE.Group();
    siteGroup.name = "Exterior_Campus_Site_Root";

    // 1. Continuous 1,400m x 1,400m 3D Topographical Valley & Foothill Terrain + Roadside Research Park Buildings
    //    (Zero generic SphereGeometry berms or flat horizon discs!)
    this._buildTopographicalSurroundingTerrain(siteGroup);
    this._buildNeighboringRoadsideBuildings(siteGroup);

    const lawnGeo = new THREE.CircleGeometry(96.0, 64);
    const lawn = new THREE.Mesh(lawnGeo, this.materials.grassTurf);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(10.0, -0.048, -6.0);
    lawn.receiveShadow = true;
    siteGroup.add(lawn);

    // 2. Heavy-Duty Asphalt Parking Lot Slab (X: -24.0..52.0, Z: -14.0..-34.0)
    //    + Gated In/Out Campus Driveway (X: 10.6..17.4, Z: -34.0..-41.0)
    //    + Connected 4-Lane City Street ("Biotech Parkway", X: -156.0..184.0, Z: -41.0..-52.6)!
    const asphalt = new THREE.Mesh(new THREE.BoxGeometry(76.0, 0.04, 20.0), this.materials.asphalt);
    asphalt.position.set(14.0, -0.02, -24.0);
    asphalt.receiveShadow = true;
    siteGroup.add(asphalt);

    const entryRoad = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.04, 7.2), this.materials.asphalt);
    entryRoad.position.set(14.0, -0.019, -37.5);
    entryRoad.receiveShadow = true;
    siteGroup.add(entryRoad);

    // Flared Intersection Apron Fillets Joining Campus Driveway to Biotech Parkway
    const apronFlare = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.04, 1.8), this.materials.asphalt);
    apronFlare.position.set(14.0, -0.018, -40.3);
    apronFlare.receiveShadow = true;
    siteGroup.add(apronFlare);

    // 4-Lane Municipal City Arterial: BIOTECH PARKWAY (Width: 11.6m, Z: -41.0..-52.6, Span: 340m)
    const cityStreet = new THREE.Mesh(new THREE.BoxGeometry(340.0, 0.042, 11.6), this.materials.asphalt);
    cityStreet.position.set(14.0, -0.021, -46.8);
    cityStreet.receiveShadow = true;
    siteGroup.add(cityStreet);

    // City Street Double-Yellow Centerline (Z = -46.69 & -46.91, broken at Campus Intersection X = 9.8..18.2!)
    [-46.69, -46.91].forEach((czLine) => {
      const westYellow = new THREE.Mesh(new THREE.BoxGeometry(165.8, 0.007, 0.11), this.materials.adaYellow);
      westYellow.position.set(-73.1, 0.005, czLine);
      siteGroup.add(westYellow);

      const eastYellow = new THREE.Mesh(new THREE.BoxGeometry(165.8, 0.007, 0.11), this.materials.adaYellow);
      eastYellow.position.set(101.1, 0.005, czLine);
      siteGroup.add(eastYellow);
    });

    // City Street White Dashed Multi-Lane Dividers (Z = -43.95 Westbound Lanes, Z = -49.65 Eastbound Lanes)
    for (let sx = -150.0; sx <= 178.0; sx += 7.2) {
      if (sx > 8.8 && sx < 19.2) continue; // Keep Campus Gate intersection box clean!
      [-43.95, -49.65].forEach((lz) => {
        const laneDash = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.006, 0.11), this.materials.parkingStripe);
        laneDash.position.set(sx, 0.005, lz);
        siteGroup.add(laneDash);
      });
    }

    // City Street White Edge Fog Lines (Split on North Edge for Campus Driveway!)
    const fogNW = new THREE.Mesh(new THREE.BoxGeometry(165.4, 0.006, 0.10), this.materials.parkingStripe);
    fogNW.position.set(-73.3, 0.005, -41.28);
    siteGroup.add(fogNW);
    const fogNE = new THREE.Mesh(new THREE.BoxGeometry(165.4, 0.006, 0.10), this.materials.parkingStripe);
    fogNE.position.set(101.3, 0.005, -41.28);
    siteGroup.add(fogNE);
    const fogSouth = new THREE.Mesh(new THREE.BoxGeometry(340.0, 0.006, 0.10), this.materials.parkingStripe);
    fogSouth.position.set(14.0, 0.005, -52.32);
    siteGroup.add(fogSouth);

    // Municipal Concrete Curbs & 1.8m Pedestrian Sidewalks Along Both Sides of Biotech Parkway
    const stCurbNW = new THREE.Mesh(new THREE.BoxGeometry(165.4, 0.15, 0.18), this.materials.concreteCurb);
    stCurbNW.position.set(-73.3, 0.075, -40.91);
    siteGroup.add(stCurbNW);
    const stCurbNE = new THREE.Mesh(new THREE.BoxGeometry(165.4, 0.15, 0.18), this.materials.concreteCurb);
    stCurbNE.position.set(101.3, 0.075, -40.91);
    siteGroup.add(stCurbNE);
    const stCurbS = new THREE.Mesh(new THREE.BoxGeometry(340.0, 0.15, 0.18), this.materials.concreteCurb);
    stCurbS.position.set(14.0, 0.075, -52.69);
    siteGroup.add(stCurbS);

    const sideWalkMat = new THREE.MeshStandardMaterial({
      color: 0xcbd2db,
      roughness: 0.84,
      metalness: 0.04,
      name: "Mat_City_Concrete_Sidewalk"
    });
    const swNW = new THREE.Mesh(new THREE.BoxGeometry(165.4, 0.11, 1.8), sideWalkMat);
    swNW.position.set(-73.3, 0.055, -39.92);
    swNW.receiveShadow = true;
    siteGroup.add(swNW);

    const swNE = new THREE.Mesh(new THREE.BoxGeometry(165.4, 0.11, 1.8), sideWalkMat);
    swNE.position.set(101.3, 0.055, -39.92);
    swNE.receiveShadow = true;
    siteGroup.add(swNE);

    const swSouth = new THREE.Mesh(new THREE.BoxGeometry(340.0, 0.11, 1.8), sideWalkMat);
    swSouth.position.set(14.0, 0.055, -53.68);
    swSouth.receiveShadow = true;
    siteGroup.add(swSouth);

    // ADA Tactile Yellow Curb-Ramp Plates on Both Sides of Campus Driveway Crossing (X = 9.95 & 18.05, Z = -39.92)
    [9.95, 18.05].forEach((tx) => {
      const rampPad = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.018, 1.25), this.materials.adaTactileYellow);
      rampPad.position.set(tx, 0.112, -39.92);
      siteGroup.add(rampPad);
    });

    // Outbound Stop Bar (West/Right-Hand Outbound Lane X = 12.3, Z = -38.4) & Continental Crosswalk Across Driveway (Z = -39.92)
    const stopBar = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.008, 0.38), this.materials.parkingStripe);
    stopBar.position.set(12.3, 0.006, -38.35);
    siteGroup.add(stopBar);

    for (let cxw = 10.95; cxw <= 17.05; cxw += 0.86) {
      const cwStripe = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.008, 1.65), this.materials.parkingStripe);
      cwStripe.position.set(cxw, 0.006, -39.92);
      siteGroup.add(cwStripe);
    }

    // Campus Driveway Double-Yellow Center Divider (Z = -34.4..-38.4) & Flanking Curbs (Z = -34.0..-39.1)
    [-13.92, -14.08].forEach((negX) => {
      const divLine = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.007, 4.0), this.materials.adaYellow);
      divLine.position.set(-negX, 0.005, -36.4);
      siteGroup.add(divLine);
    });
    [10.55, 17.45].forEach((rx) => {
      const rCurb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.15, 5.1), this.materials.concreteCurb);
      rCurb.position.set(rx, 0.075, -36.55);
      siteGroup.add(rCurb);
    });

    // Municipal Intersection Street-Name Blade Signpost ("BIOTECH PKWY" / "PAVILION GATE DR") at (18.9, 0, -39.55)
    const stSignGrp = new THREE.Group();
    stSignGrp.position.set(18.9, 0, -39.55);
    const stPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.048, 3.15, 12),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35, metalness: 0.82 })
    );
    stPost.position.y = 1.575;
    stPost.castShadow = true;
    stSignGrp.add(stPost);

    const makeStreetBlade = (label, yPos, rotY) => {
      const bc = document.createElement("canvas");
      bc.width = 512;
      bc.height = 112;
      const bctx = bc.getContext("2d");
      bctx.fillStyle = "#065f46";
      bctx.fillRect(0, 0, 512, 112);
      bctx.strokeStyle = "#ffffff";
      bctx.lineWidth = 6;
      bctx.strokeRect(6, 6, 500, 100);
      bctx.fillStyle = "#ffffff";
      bctx.font = "bold 42px 'IBM Plex Sans', sans-serif";
      bctx.textAlign = "center";
      bctx.textBaseline = "middle";
      bctx.fillText(label, 256, 58);
      const bTex = new THREE.CanvasTexture(bc);
      bTex.colorSpace = THREE.SRGBColorSpace;
      const blade = new THREE.Group();
      blade.position.y = yPos;
      blade.rotation.y = rotY;
      const core = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.22, 0.022), this.materials.architecturalBlackMetal);
      blade.add(core);
      [-1, 1].forEach((s) => {
        const face = new THREE.Mesh(
          new THREE.PlaneGeometry(1.04, 0.21),
          new THREE.MeshBasicMaterial({ map: bTex })
        );
        if (s < 0) face.rotation.y = Math.PI;
        face.position.z = s * 0.013;
        blade.add(face);
      });
      return blade;
    };
    stSignGrp.add(makeStreetBlade("BIOTECH PKWY", 3.04, 0));
    stSignGrp.add(makeStreetBlade("PAVILION DR", 2.78, Math.PI / 2));
    siteGroup.add(stSignGrp);

    // 3. Precast Concrete Curbs Framing Parking Envelope (Split for North Promenade & South Entry Road)
    const curbN1 = new THREE.Mesh(new THREE.BoxGeometry(34.2, 0.15, 0.16), this.materials.concreteCurb);
    curbN1.position.set(-6.9, 0.075, -14.0);
    siteGroup.add(curbN1);

    const curbN2 = new THREE.Mesh(new THREE.BoxGeometry(36.2, 0.15, 0.16), this.materials.concreteCurb);
    curbN2.position.set(33.9, 0.075, -14.0);
    siteGroup.add(curbN2);

    const curbS1 = new THREE.Mesh(new THREE.BoxGeometry(34.6, 0.15, 0.16), this.materials.concreteCurb);
    curbS1.position.set(-6.7, 0.075, -34.0);
    siteGroup.add(curbS1);

    const curbS2 = new THREE.Mesh(new THREE.BoxGeometry(34.6, 0.15, 0.16), this.materials.concreteCurb);
    curbS2.position.set(34.7, 0.075, -34.0);
    siteGroup.add(curbS2);

    [-24.0, 52.0].forEach((cx) => {
      const curbSide = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.15, 20.0), this.materials.concreteCurb);
      curbSide.position.set(cx, 0.075, -24.0);
      siteGroup.add(curbSide);
    });

    // 4. White Reflective Thermoplastic Parking Stalls & Concrete Wheel Stops
    const stallWidth = 2.8;
    const stallDepth = 5.2;
    const buildStallRow = (startX, count) => {
      for (let i = 0; i <= count; i++) {
        const lineX = startX + i * stallWidth - stallWidth / 2;
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.005, stallDepth), this.materials.parkingStripe);
        stripe.position.set(lineX, 0.003, -16.8);
        siteGroup.add(stripe);

        if (i < count) {
          const sx = startX + i * stallWidth;
          const wheelStop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.15), this.materials.concreteCurb);
          wheelStop.position.set(sx, 0.06, -14.6);
          siteGroup.add(wheelStop);

          [-0.85, 0.85].forEach((ex) => {
            const cap = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.125, 0.155), this.materials.adaYellow);
            cap.position.set(sx + ex, 0.06, -14.6);
            siteGroup.add(cap);
          });
        }
      }
    };
    buildStallRow(-20.0, 9);
    buildStallRow(18.0, 11);

    // 5. Code-Compliant ADA Van-Accessible Parking Stall (X = 4.8..8.4, Center = 6.6) & Access Aisle (X = 8.4..10.6)
    //    - Crisp royal-blue stall side stripes on clean dark asphalt (eliminating solid cyan block!)
    //    - Upright International Symbol of Accessibility (ISA) facing the South drive aisle / Overview camera (+Z top, -X right)
    //    - Blue-and-white diagonal hatched Van Access Aisle + Flush ADA Curb Ramp + Upright 3D Metal Signpost
    const adaRoyalBlueMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.55,
      metalness: 0.05,
      name: "Mat_ADA_Royal_Blue"
    });
    [4.8, 8.4, 10.6].forEach((bx) => {
      const bStripe = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.006, stallDepth), adaRoyalBlueMat);
      bStripe.position.set(bx, 0.004, -16.8);
      siteGroup.add(bStripe);
    });
    const aisleSouthTie = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.006, 0.12), adaRoyalBlueMat);
    aisleSouthTie.position.set(9.5, 0.004, -19.34);
    siteGroup.add(aisleSouthTie);

    // High-Resolution Upright ISA Wheelchair Pavement Emblem
    const adaCanvas = document.createElement("canvas");
    adaCanvas.width = 512;
    adaCanvas.height = 512;
    const adaCtx = adaCanvas.getContext("2d");
    // Rounded royal-blue MUTCD pavement background plaque with crisp white border
    adaCtx.fillStyle = "#1d4ed8";
    adaCtx.beginPath();
    adaCtx.roundRect(16, 16, 480, 480, 44);
    adaCtx.fill();
    adaCtx.strokeStyle = "#ffffff";
    adaCtx.lineWidth = 18;
    adaCtx.beginPath();
    adaCtx.roundRect(28, 28, 456, 456, 36);
    adaCtx.stroke();

    // Crisp White ISA Wheelchair Icon (Head at Top, Facing Right)
    adaCtx.strokeStyle = "#ffffff";
    adaCtx.fillStyle = "#ffffff";
    adaCtx.lineWidth = 28;
    adaCtx.lineCap = "round";
    adaCtx.lineJoin = "round";
    // Head
    adaCtx.beginPath();
    adaCtx.arc(244, 118, 34, 0, Math.PI * 2);
    adaCtx.fill();
    // Rear Wheel Arc (open around torso/seat)
    adaCtx.beginPath();
    adaCtx.arc(218, 326, 94, 0.22 * Math.PI, 1.56 * Math.PI, false);
    adaCtx.stroke();
    // Spine -> Seat -> Lower Leg -> Footrest
    adaCtx.beginPath();
    adaCtx.moveTo(244, 166);
    adaCtx.lineTo(244, 284);
    adaCtx.lineTo(334, 284);
    adaCtx.lineTo(372, 384);
    adaCtx.lineTo(404, 372);
    adaCtx.stroke();
    // Armrest
    adaCtx.beginPath();
    adaCtx.moveTo(244, 224);
    adaCtx.lineTo(318, 224);
    adaCtx.stroke();

    const adaTex = new THREE.CanvasTexture(adaCanvas);
    adaTex.colorSpace = THREE.SRGBColorSpace;
    const adaStencil = new THREE.Mesh(
      new THREE.PlaneGeometry(1.48, 1.48),
      new THREE.MeshBasicMaterial({ map: adaTex, transparent: true, polygonOffset: true, polygonOffsetFactor: -2 })
    );
    // Exact right-handed pavement orientation: Normal = +Y, Canvas Top = +Z (toward building), Canvas Right = -X (screen-right from drive aisle)!
    adaStencil.rotation.order = "YXZ";
    adaStencil.rotation.y = Math.PI;
    adaStencil.rotation.x = -Math.PI / 2;
    adaStencil.position.set(6.6, 0.008, -17.15);
    siteGroup.add(adaStencil);

    // ADA Royal-Blue Wheel Stop
    const adaWheelStop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.12, 0.15), adaRoyalBlueMat);
    adaWheelStop.position.set(6.6, 0.06, -14.6);
    siteGroup.add(adaWheelStop);
    [-0.92, 0.92].forEach((wx) => {
      const wCap = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.125, 0.155), this.materials.parkingStripe);
      wCap.position.set(6.6 + wx, 0.06, -14.6);
      siteGroup.add(wCap);
    });

    // Diagonal White/Blue Cross-Hatch Van Access Aisle (X = 8.4..10.6, Width = 2.2m)
    const hatchCanvas = document.createElement("canvas");
    hatchCanvas.width = 256;
    hatchCanvas.height = 512;
    const hatchCtx = hatchCanvas.getContext("2d");
    hatchCtx.clearRect(0, 0, 256, 512);
    hatchCtx.strokeStyle = "#38bdf8";
    hatchCtx.lineWidth = 14;
    for (let y = -256; y < 768; y += 56) {
      hatchCtx.beginPath();
      hatchCtx.moveTo(8, y);
      hatchCtx.lineTo(248, y + 220);
      hatchCtx.stroke();
    }
    const hatchTex = new THREE.CanvasTexture(hatchCanvas);
    hatchTex.colorSpace = THREE.SRGBColorSpace;
    const hatchAisle = new THREE.Mesh(
      new THREE.PlaneGeometry(2.08, stallDepth - 0.12),
      new THREE.MeshBasicMaterial({ map: hatchTex, transparent: true })
    );
    hatchAisle.rotation.order = "YXZ";
    hatchAisle.rotation.y = Math.PI;
    hatchAisle.rotation.x = -Math.PI / 2;
    hatchAisle.position.set(9.5, 0.006, -16.8);
    siteGroup.add(hatchAisle);

    // Flush ADA Concrete Curb Ramp & Tactile Warning Pad Linking Van Access Aisle to Main Plaza (X = 9.5, Z = -14.0)
    const adaCurbRamp = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.08, 0.65), sideWalkMat);
    adaCurbRamp.position.set(9.5, 0.04, -13.95);
    siteGroup.add(adaCurbRamp);
    const adaRampPad = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.016, 0.46), this.materials.adaTactileYellow);
    adaRampPad.position.set(9.5, 0.085, -13.95);
    siteGroup.add(adaRampPad);

    // Vertical 3D MUTCD R7-8 "RESERVED PARKING / VAN ACCESSIBLE" Signpost at Head of ADA Stall (X = 6.6, Z = -14.12)
    const adaSignPostGrp = new THREE.Group();
    adaSignPostGrp.position.set(6.6, 0, -14.12);
    const adaPostBase = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.16, 14), this.materials.concreteCurb);
    adaPostBase.position.y = 0.08;
    adaSignPostGrp.add(adaPostBase);
    const adaPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.036, 2.05, 12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.85 })
    );
    adaPost.position.y = 1.08;
    adaPost.castShadow = true;
    adaSignPostGrp.add(adaPost);

    const signC = document.createElement("canvas");
    signC.width = 256;
    signC.height = 384;
    const sctx = signC.getContext("2d");
    sctx.fillStyle = "#ffffff";
    sctx.fillRect(0, 0, 256, 384);
    sctx.strokeStyle = "#15803d";
    sctx.lineWidth = 10;
    sctx.strokeRect(8, 8, 240, 368);
    sctx.fillStyle = "#15803d";
    sctx.font = "bold 30px 'IBM Plex Sans', sans-serif";
    sctx.textAlign = "center";
    sctx.fillText("RESERVED", 128, 52);
    sctx.fillText("PARKING", 128, 88);
    // Mini Blue ISA Badge
    sctx.fillStyle = "#1d4ed8";
    sctx.beginPath();
    sctx.roundRect(68, 108, 120, 120, 18);
    sctx.fill();
    sctx.drawImage(adaCanvas, 74, 114, 108, 108);
    // Bottom VAN ACCESSIBLE plaque
    sctx.fillStyle = "#1d4ed8";
    sctx.fillRect(16, 254, 224, 106);
    sctx.fillStyle = "#ffffff";
    sctx.font = "bold 26px 'IBM Plex Sans', sans-serif";
    sctx.fillText("VAN", 128, 296);
    sctx.fillText("ACCESSIBLE", 128, 334);

    const adaSignTex = new THREE.CanvasTexture(signC);
    adaSignTex.colorSpace = THREE.SRGBColorSpace;
    const adaSignBacking = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.68, 0.016),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35, metalness: 0.7 })
    );
    adaSignBacking.position.set(0, 1.78, -0.045);
    adaSignPostGrp.add(adaSignBacking);

    const adaSignFace = new THREE.Mesh(
      new THREE.PlaneGeometry(0.44, 0.66),
      new THREE.MeshBasicMaterial({ map: adaSignTex })
    );
    adaSignFace.rotation.y = Math.PI; // Faces -Z directly toward drivers entering stall!
    adaSignFace.position.set(0, 1.78, -0.056);
    adaSignPostGrp.add(adaSignFace);
    siteGroup.add(adaSignPostGrp);

    // 6. Commercial Dual-Port EV Fast Charging Pedestals (Paired with Sports Cars Loaded in _populateCampusGLBAssets!)
    [2.4, 32.0].forEach((evX) => {
      const evPedestal = new THREE.Group();
      evPedestal.position.set(evX, 0, -14.22);

      const evBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.10, 0.32), this.materials.concreteCurb);
      evBase.position.y = 0.05;
      evPedestal.add(evBase);

      const evBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 1.40, 0.22),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.85 })
      );
      evBody.position.y = 0.75;
      evBody.castShadow = true;
      evPedestal.add(evBody);

      [-0.08, 0.08].forEach((hx) => {
        const halo = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16),
          new THREE.MeshBasicMaterial({ color: 0x00d4e8 })
        );
        halo.rotation.x = Math.PI / 2;
        halo.position.set(hx, 1.25, -0.115);
        evPedestal.add(halo);

        const plug = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.08), this.materials.cabinetBody);
        plug.position.set(hx, 0.95, -0.12);
        evPedestal.add(plug);
      });

      // Tethered J1772/CCS Charging Cable Arcing Cleanly to Parked Sports/GT Vehicle Fender!
      const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.08, 0.92, -0.15),
        new THREE.Vector3(0.22, 0.36, -0.58),
        new THREE.Vector3(0.56, 0.48, -1.12),
        new THREE.Vector3(0.92, 0.68, -1.68)
      ]);
      const cableMesh = new THREE.Mesh(
        new THREE.TubeGeometry(cableCurve, 18, 0.014, 8, false),
        this.materials.architecturalBlackMetal
      );
      evPedestal.add(cableMesh);

      siteGroup.add(evPedestal);
    });

    // 7. Unified Herringbone-Brick Main Plaza & Perimeter Campus Promenade Network
    const walkway = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 0.08, 4.5),
      this._createHerringboneMaterial(5.6, 4.5)
    );
    walkway.position.set(13.0, 0.04, -11.75);
    walkway.receiveShadow = true;
    siteGroup.add(walkway);

    [-2.85, 2.85].forEach((cx) => {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 4.5), this.materials.limestonePlinth);
      curb.position.set(13.0 + cx, 0.06, -11.75);
      siteGroup.add(curb);
    });

    const adaTile = new THREE.Mesh(new THREE.BoxGeometry(5.52, 0.015, 0.60), this.materials.adaTactileYellow);
    adaTile.position.set(13.0, 0.088, -13.85);
    siteGroup.add(adaTile);

    // West & East South Herringbone Sidewalks + East Perimeter Connector to Outdoor Break Room Patio!
    const westWalk = new THREE.Mesh(
      new THREE.BoxGeometry(34.2, 0.07, 1.5),
      this._createHerringboneMaterial(34.2, 1.5)
    );
    westWalk.position.set(-6.9, 0.035, -10.45);
    westWalk.receiveShadow = true;
    siteGroup.add(westWalk);

    const eastWalk = new THREE.Mesh(
      new THREE.BoxGeometry(30.4, 0.07, 1.5),
      this._createHerringboneMaterial(30.4, 1.5)
    );
    eastWalk.position.set(31.0, 0.035, -10.45);
    eastWalk.receiveShadow = true;
    siteGroup.add(eastWalk);

    const farEastWalk = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.07, 22.8),
      this._createHerringboneMaterial(1.5, 22.8)
    );
    farEastWalk.position.set(45.45, 0.035, 0.95);
    farEastWalk.receiveShadow = true;
    siteGroup.add(farEastWalk);

    const northPatioWalk = new THREE.Mesh(
      new THREE.BoxGeometry(11.4, 0.07, 1.5),
      this._createHerringboneMaterial(11.4, 1.5)
    );
    northPatioWalk.position.set(40.5, 0.035, 11.6);
    northPatioWalk.receiveShadow = true;
    siteGroup.add(northPatioWalk);

    // 8. Architectural Landscape Mulch Beds Flanking Promenade & Building Front
    const westMulch = new THREE.Mesh(new THREE.BoxGeometry(34.2, 0.055, 2.7), this.materials.mulchBed);
    westMulch.position.set(-6.9, 0.02, -12.6);
    westMulch.receiveShadow = true;
    siteGroup.add(westMulch);

    const eastMulch = new THREE.Mesh(new THREE.BoxGeometry(28.6, 0.055, 2.7), this.materials.mulchBed);
    eastMulch.position.set(30.2, 0.02, -12.6);
    eastMulch.receiveShadow = true;
    siteGroup.add(eastMulch);

    // 9. Corten Steel & Cast-Iron Tree Planter Frames (Set Back Along Wing Promenades — Main Plaza Unobstructed!)
    [-19.2, -12.5, -3.5, 22.5, 34.5].forEach((tx) => {
      const planterGrp = new THREE.Group();
      planterGrp.position.set(tx, 0, -13.1);

      const planterFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.16, 1.8), this.materials.cortenSteel);
      planterFrame.position.y = 0.08;
      planterGrp.add(planterFrame);

      const grate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.02, 1.6), this.materials.castIronGrate);
      grate.position.y = 0.165;
      planterGrp.add(grate);

      const soilCore = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.04, 16), this.materials.mulchBed);
      soilCore.position.y = 0.16;
      planterGrp.add(soilCore);

      siteGroup.add(planterGrp);
    });

    // 10. Architectural Contoured Teak Wood & Charcoal Steel Campus Benches (4 Units)
    [
      { x: 10.8, z: -10.8, rotY: Math.PI / 2 },
      { x: 15.2, z: -10.8, rotY: -Math.PI / 2 },
      { x: 20.0, z: -10.3, rotY: 0 },
      { x: 32.0, z: -10.3, rotY: 0 }
    ].forEach((bp) => {
      const bench = new THREE.Group();
      bench.position.set(bp.x, 0.04, bp.z);
      bench.rotation.y = bp.rotY;
      const benchL = 1.80;
      for (let s = 0; s < 6; s++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(benchL, 0.024, 0.055), this.materials.teakWood);
        slat.position.set(0, 0.44 + Math.sin(s * 0.3) * 0.02, -0.18 + s * 0.065);
        slat.castShadow = true;
        bench.add(slat);
      }
      for (let b = 0; b < 5; b++) {
        const bSlat = new THREE.Mesh(new THREE.BoxGeometry(benchL, 0.055, 0.024), this.materials.teakWood);
        bSlat.position.set(0, 0.54 + b * 0.062, -0.22 - b * 0.025);
        bSlat.rotation.x = -0.22;
        bSlat.castShadow = true;
        bench.add(bSlat);
      }
      [-benchL / 2 + 0.12, benchL / 2 - 0.12].forEach((sx) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.45, 0.48), this.materials.architecturalBlackMetal);
        leg.position.set(sx, 0.225, 0.0);
        bench.add(leg);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.24, 0.42), this.materials.architecturalBlackMetal);
        arm.position.set(sx, 0.56, -0.05);
        bench.add(arm);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.015, 0.52), this.materials.cabinetHandle);
        foot.position.set(sx, 0.008, 0.0);
        bench.add(foot);
      });
      siteGroup.add(bench);
    });

    // 11. Illuminated Marine-Grade Stainless Steel Pathway Bollards
    const bollardGlowMat = new THREE.MeshStandardMaterial({
      color: 0xfff8e7,
      emissive: 0xffd180,
      emissiveIntensity: 0.4,
      roughness: 0.2
    });
    this.exteriorLampEmissives.push(bollardGlowMat);

    [
      { x: 10.1, z: -10.1 }, { x: 15.9, z: -10.1 },
      { x: 10.1, z: -11.9 }, { x: 15.9, z: -11.9 },
      { x: 10.1, z: -13.6 }, { x: 15.9, z: -13.6 }
    ].forEach((bc) => {
      const bollard = new THREE.Group();
      bollard.position.set(bc.x, 0.04, bc.z);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.95, 18), this.materials.cabinetHandle);
      post.position.y = 0.475;
      post.castShadow = true;
      bollard.add(post);

      const louverRing = new THREE.Mesh(new THREE.CylinderGeometry(0.069, 0.069, 0.08, 18), bollardGlowMat);
      louverRing.position.y = 0.85;
      bollard.add(louverRing);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.076, 0.076, 0.025, 18), this.materials.cabinetHandle);
      cap.position.y = 0.96;
      bollard.add(cap);

      const bollardLight = new THREE.PointLight(0xffdca3, 5.8, 7.2, 1.45);
      bollardLight.position.set(0, 0.84, 0);
      bollardLight.userData.baseIntensity = 5.8;
      this.exteriorNightLights.push(bollardLight);
      bollard.add(bollardLight);

      siteGroup.add(bollard);
    });

    // 12. Commercial Stainless Dual-Stream Recycling & Waste Receptacles
    [-1, 1].forEach((side) => {
      const canGroup = new THREE.Group();
      canGroup.position.set(13.0 + side * 2.25, 0.04, -13.25);

      const canBody = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.95, 0.44), this.materials.cabinetHandle);
      canBody.position.y = 0.475;
      canBody.castShadow = true;
      canGroup.add(canBody);

      const recLid = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.04, 0.38),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
      );
      recLid.position.set(-0.20, 0.96, 0);
      canGroup.add(recLid);

      const trashLid = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.38), this.materials.architecturalBlackMetal);
      trashLid.position.set(0.20, 0.96, 0);
      canGroup.add(trashLid);

      siteGroup.add(canGroup);
    });

    // 13. Stainless Steel Inverted-U Bicycle Racks + 3 Bespoke Procedural Commuter Bicycles!
    [-1.2, -0.4, 0.4, 1.2].forEach((offsetZ) => {
      const bikeRack = new THREE.Group();
      bikeRack.position.set(8.8, 0.04, -12.1 + offsetZ);

      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.85, 12), this.materials.cabinetHandle);
      legL.position.set(-0.35, 0.425, 0);
      bikeRack.add(legL);

      const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.85, 12), this.materials.cabinetHandle);
      legR.position.set(0.35, 0.425, 0);
      bikeRack.add(legR);

      const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.05, 0.05), this.materials.cabinetHandle);
      topBar.position.set(0, 0.85, 0);
      bikeRack.add(topBar);

      siteGroup.add(bikeRack);
    });

    [
      { z: -13.18, color: 0x0284c7, rotY: Math.PI / 2 },
      { z: -12.38, color: 0xd97706, rotY: -Math.PI / 2 },
      { z: -11.58, color: 0x10b981, rotY: Math.PI / 2 }
    ].forEach((bk) => {
      const bike = this._createProceduralBicycle(bk.color);
      bike.position.set(8.8, 0.04, bk.z);
      bike.rotation.y = bk.rotY;
      siteGroup.add(bike);
    });

    // 14. Sculpted Modern Jutting Entrance Roof & Double-Height Louvered Entry Pavilion
    //     (Modeled after Torrey View / Thrasher Works / Goldstone references:
    //      Steps up to Y = 4.65m above the 3.80m brick wings, juts out 4.85m over the main entrance plaza
    //      with a warm ribbed Western Red Cedar soffit, exposed glulam rafters, limestone corner piers,
    //      upper clerestory glazing with bronze sunshade louvers, and angled V-columns!)
    const canopyGroup = new THREE.Group();
    canopyGroup.name = "Architectural_Portico_Canopy";
    canopyGroup.position.set(12.2, 0.0, -9.5);

    const pavW = 9.2;       // Spans X = 7.6 to 16.8 around reception entrance
    const pavCantilever = 4.85; // Juts out 4.85m South over the arrival plaza (Z = -9.5 to -14.35)
    const pavBackDepth = 4.2;   // Extends 4.2m North over the front of reception (Z = -9.5 to -5.3)
    const pavTotalD = pavCantilever + pavBackDepth;
    const pavCenterZ = (pavBackDepth - pavCantilever) / 2;
    const pavRoofY = 4.65;

    const cedarSoffitMat = new THREE.MeshStandardMaterial({
      color: 0x9c5a2e,
      roughness: 0.46,
      metalness: 0.06
    });
    const glulamRafterMat = new THREE.MeshStandardMaterial({
      color: 0x7c431e,
      roughness: 0.42,
      metalness: 0.08
    });

    // A. Flanking Limestone & Corten Architectural Feature Piers Framing the Double-Height Entry Portal
    [-pavW / 2 + 0.35, pavW / 2 - 0.35].forEach((px, idx) => {
      const pier = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, pavRoofY - 0.08, 0.72),
        idx === 0 ? this.materials.limestonePlinth : this.materials.cortenSteel
      );
      pier.position.set(px, (pavRoofY - 0.08) / 2, -0.24);
      pier.castShadow = true;
      pier.receiveShadow = true;
      canopyGroup.add(pier);
    });

    // B. Upper Double-Height Clerestory Transom Band (Y = 3.80m to 4.55m) with Horizontal Wood-Tone Louvers
    const clerestoryGlass = new THREE.Mesh(
      new THREE.BoxGeometry(pavW - 1.4, 0.78, 0.08),
      this.materials.reflectiveExteriorGlass
    );
    clerestoryGlass.position.set(0, 4.19, -0.10);
    canopyGroup.add(clerestoryGlass);

    for (let lv = 0; lv < 5; lv++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(pavW - 1.36, 0.032, 0.16),
        cedarSoffitMat
      );
      blade.position.set(0, 3.88 + lv * 0.145, -0.22);
      blade.rotation.x = 0.24;
      blade.castShadow = true;
      canopyGroup.add(blade);
    }

    // Side clerestory return walls above the 3.80m roof deck
    [-pavW / 2 + 0.22, pavW / 2 - 0.22].forEach((sx) => {
      const sideTransom = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.82, pavBackDepth),
        this.materials.limestonePlinth
      );
      sideTransom.position.set(sx, 4.21, pavBackDepth / 2);
      sideTransom.castShadow = true;
      canopyGroup.add(sideTransom);
    });

    // C. Sculpted Cantilevered Knife-Edge Roof Deck (Sloped slightly upward toward the front like Torrey View / Thrasher Works)
    const roofDeck = new THREE.Mesh(
      new THREE.BoxGeometry(pavW + 0.80, 0.16, pavTotalD),
      this.materials.architecturalBlackMetal
    );
    roofDeck.position.set(0, pavRoofY + 0.16, pavCenterZ);
    roofDeck.rotation.x = 0.025; // Gentle architectural lift toward the cantilevered leading edge
    roofDeck.castShadow = true;
    roofDeck.receiveShadow = true;
    canopyGroup.add(roofDeck);

    // Charcoal Anodized Aluminum Knife-Edge Perimeter Fascia Band
    const frontFascia = new THREE.Mesh(
      new THREE.BoxGeometry(pavW + 0.88, 0.34, 0.12),
      this.materials.architecturalBlackMetal
    );
    frontFascia.position.set(0, pavRoofY + 0.05, -pavCantilever);
    frontFascia.castShadow = true;
    canopyGroup.add(frontFascia);

    // D. Warm Western Red Cedar Soffit Ceiling + Exposed Glulam Timber Rafters & Cross-Battens (Reference Image 4)
    const soffitPanel = new THREE.Mesh(
      new THREE.BoxGeometry(pavW + 0.44, 0.04, pavTotalD - 0.18),
      cedarSoffitMat
    );
    soffitPanel.position.set(0, pavRoofY + 0.04, pavCenterZ);
    soffitPanel.rotation.x = 0.025;
    canopyGroup.add(soffitPanel);

    // 7 Longitudinal Glulam Rafter Beams under the jutting roof
    for (let r = -3; r <= 3; r++) {
      const rx = r * 1.38;
      const rafter = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.18, pavCantilever + 0.6),
        glulamRafterMat
      );
      rafter.position.set(rx, pavRoofY - 0.06, -pavCantilever / 2 + 0.1);
      rafter.rotation.x = 0.025;
      rafter.castShadow = true;
      canopyGroup.add(rafter);
    }

    // 18 Transverse Cedar Slats across the cantilevered underside
    for (let s = 0; s < 18; s++) {
      const sz = -0.35 - s * 0.24;
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(pavW + 0.24, 0.035, 0.075),
        cedarSoffitMat
      );
      slat.position.set(0, pavRoofY - 0.01 - sz * 0.025, sz);
      canopyGroup.add(slat);
    }

    // E. Sculptural Angled Steel V-Columns Supporting the 4.85m Front Cantilever
    [-pavW / 2 + 0.75, pavW / 2 - 0.75].forEach((vx) => {
      const vPlinth = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.28, 0.18, 16),
        this.materials.limestonePlinth
      );
      vPlinth.position.set(vx, 0.09, -3.45);
      canopyGroup.add(vPlinth);

      [-0.22, 0.22].forEach((tiltZ) => {
        const strut = new THREE.Mesh(
          new THREE.CylinderGeometry(0.065, 0.075, 4.65, 14),
          this.materials.architecturalBlackMetal
        );
        strut.position.set(vx, 2.34, -3.45 + tiltZ * 1.9);
        strut.rotation.x = tiltZ;
        strut.castShadow = true;
        canopyGroup.add(strut);
      });
    });

    // F. Recessed Architectural Soffit Downlights & Warm Entry Plaza Wash
    [-3.0, -1.5, 0.0, 1.5, 3.0].forEach((dx) => {
      [-1.4, -3.2].forEach((dz) => {
        const downlight = new THREE.Mesh(
          new THREE.CylinderGeometry(0.075, 0.075, 0.024, 16),
          bollardGlowMat
        );
        downlight.position.set(dx, pavRoofY - 0.08, dz);
        canopyGroup.add(downlight);
      });
    });

    const porticoLight = new THREE.PointLight(0xffe6bd, 18.0, 16.0, 1.4);
    porticoLight.position.set(0, pavRoofY - 0.35, -2.4);
    porticoLight.userData.baseIntensity = 18.0;
    this.exteriorNightLights.push(porticoLight);
    canopyGroup.add(porticoLight);

    // G. Flush Architectural Fascia Sign on Cantilevered Leading Edge
    const bldCanvas = document.createElement("canvas");
    bldCanvas.width = 1024;
    bldCanvas.height = 128;
    const bCtx = bldCanvas.getContext("2d");
    bCtx.fillStyle = "#161c26";
    bCtx.fillRect(0, 0, 1024, 128);
    bCtx.strokeStyle = "#d4af37";
    bCtx.lineWidth = 4;
    bCtx.strokeRect(6, 6, 1012, 116);
    bCtx.fillStyle = "#f8fafc";
    bCtx.font = "bold 28px 'IBM Plex Sans', sans-serif";
    bCtx.textAlign = "center";
    bCtx.fillText("CHEMMATE BIOTECHNOLOGY RESEARCH CAMPUS", 512, 54);
    bCtx.fillStyle = "#38bdf8";
    bCtx.font = "bold 17px 'IBM Plex Mono', monospace";
    bCtx.fillText("PAVILION 4 · ANALYTICAL SCIENCES & INSTRUMENTATION", 512, 94);

    const bldTex = new THREE.CanvasTexture(bldCanvas);
    bldTex.flipY = false;
    bldTex.colorSpace = THREE.SRGBColorSpace;
    const bldSignGeo = new THREE.PlaneGeometry(5.6, 0.32);
    const bldUv = bldSignGeo.attributes.uv;
    for (let i = 0; i < bldUv.count; i++) {
      bldUv.setY(i, 1.0 - bldUv.getY(i));
    }
    const bldSignMesh = new THREE.Mesh(
      bldSignGeo,
      new THREE.MeshBasicMaterial({ map: bldTex })
    );
    bldSignMesh.rotation.y = Math.PI; // Faces -Z toward arriving visitors!
    bldSignMesh.position.set(0, pavRoofY + 0.05, -pavCantilever - 0.066);
    canopyGroup.add(bldSignMesh);

    siteGroup.add(canopyGroup);

    // 15. Commercial Parking Lot Twin-Arm Rectangular LED Poles & Biotech Parkway Rectangular Streetlamps
    //     (True Dual Independent Rectangular Light Sources on Twin-Arm Poles + Rectangular Single-Arm Streetlamps +
    //      Custom Fresnel-Diffused Rectangular Volumetric Beams & Soft Gaussian Ground Washes!)
    const poleLedMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      emissive: 0xffe4b5,
      emissiveIntensity: 0.35,
      roughness: 0.2
    });
    this.exteriorLampEmissives.push(poleLedMat);

    const rectWashTex = this._getDiffusedRectangularWashTexture("#ffe2a6");
    const poleMetalMat = new THREE.MeshStandardMaterial({ color: 0x1e242d, roughness: 0.3, metalness: 0.85 });

    // A. 4 Twin-Arm Parking Lot Light Poles (Z = -24.5) + 2 Campus Gate Approach Poles (Z = -38.6)
    //    EACH TWIN-ARM POLE HAS TWO SEPARATE RECTANGULAR LUMINAIRES ON OPPOSITE SIDES OF THE POLE
    //    AND TWO INDEPENDENT RECTANGULAR LIGHT SOURCES, TWO DIFFUSED RECTANGULAR BEAMS, AND TWO GROUND WASHES!
    [
      { x: -20.0, z: -24.5, headSpotIntensity: 68.0, washW: 8.8, washL: 11.2 },
      { x: -2.0,  z: -24.5, headSpotIntensity: 68.0, washW: 8.8, washL: 11.2 },
      { x: 24.0,  z: -24.5, headSpotIntensity: 68.0, washW: 8.8, washL: 11.2 },
      { x: 42.0,  z: -24.5, headSpotIntensity: 68.0, washW: 8.8, washL: 11.2 },
      { x: 8.8,   z: -38.6, headSpotIntensity: 58.0, washW: 7.8, washL: 10.0 },
      { x: 19.8,  z: -38.6, headSpotIntensity: 58.0, washW: 7.8, washL: 10.0 }
    ].forEach(({ x: lx, z: lz, headSpotIntensity, washW, washL }) => {
      const basePed = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.42, 16), this.materials.concreteCurb);
      basePed.position.set(lx, 0.21, lz);
      siteGroup.add(basePed);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 6.5, 16), poleMetalMat);
      pole.position.set(lx, 3.45, lz);
      pole.castShadow = true;
      siteGroup.add(pole);

      // Two distinct rectangular luminaire heads mounted on opposite sides of the pole (az = -0.88m and +0.88m)
      [-0.88, 0.88].forEach((az) => {
        const armDir = Math.sign(az);
        const headZ = lz + az;

        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.56), poleMetalMat);
        arm.position.set(lx, 6.62, lz + armDir * 0.34);
        siteGroup.add(arm);

        // Large Rectangular Architectural Shoebox Luminaire Housing (0.40m x 0.12m x 0.86m)
        const lum = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.12, 0.86), this.materials.cabinetBody);
        lum.position.set(lx, 6.65, headZ);
        siteGroup.add(lum);

        // Independent Rectangular LED Emissive Panel (0.34m x 0.78m) Matching Fixture Footprint
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.028, 0.78), poleLedMat);
        led.position.set(lx, 6.58, headZ);
        siteGroup.add(led);

        // Independent Rectangular-Origin Diffused Volumetric Beam per Head (Top matches 0.34m x 0.78m rectangle!)
        const headBeam = this._createDiffusedRectangularBeamMesh(0.34, 0.78, 5.2, 6.8, 6.45);
        headBeam.position.set(lx, 6.56, headZ);
        headBeam.rotation.x = -armDir * 0.13; // Gently angled outward toward its half of the parking bay
        headBeam.visible = false;
        this.nightVolumetricCones.push(headBeam);
        siteGroup.add(headBeam);

        // Independent Wide-Penumbra Diffused SpotLight Source Centered Exactly on Each Rectangular LED Head
        const headSpot = new THREE.SpotLight(0xffe0a8, headSpotIntensity, 28.0, Math.PI * 0.44, 1.0, 1.35);
        headSpot.position.set(lx, 6.54, headZ);
        headSpot.target.position.set(lx, 0.0, headZ + armDir * 1.65);
        headSpot.userData.baseIntensity = headSpotIntensity;
        this.exteriorNightLights.push(headSpot);
        siteGroup.add(headSpot);
        siteGroup.add(headSpot.target);

        // Independent Soft Rectangular-Elliptical Diffused Ground Wash Pool per Head
        const headWash = new THREE.Mesh(
          new THREE.PlaneGeometry(washW, washL),
          new THREE.MeshBasicMaterial({
            map: rectWashTex,
            transparent: true,
            opacity: 0.42,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          })
        );
        headWash.rotation.x = -Math.PI / 2;
        headWash.position.set(lx, 0.016, headZ + armDir * 1.45);
        headWash.visible = false;
        headWash.userData.baseOpacity = 0.42;
        this.nightGroundPools.push(headWash);
        siteGroup.add(headWash);
      });

      // Soft Omnidirectional Ambient Halo Fill for Upper Vehicle Roofs & Foliage
      const haloFill = new THREE.PointLight(0xffdfa8, 16.0, 22.0, 1.55);
      haloFill.position.set(lx, 6.2, lz);
      haloFill.userData.baseIntensity = 16.0;
      this.exteriorNightLights.push(haloFill);
      siteGroup.add(haloFill);
    });

    // B. 8 Municipal Rectangular LED Streetlamps Flanking Biotech Parkway (Alternating North & South Sidewalks)
    //    EACH STREETLAMP IS A SINGLE LARGE RECTANGULAR LUMINAIRE (0.40m x 0.88m) WITH A MATCHING RECTANGULAR
    //    BEAM ORIGIN AND ULTRA-SOFT DIFFUSED ATMOSPHERIC FALLOFF (ZERO HARSH CONE EDGES!)
    [
      { x: -42.0, z: -39.2, armDir: -1 },
      { x: -16.0, z: -54.4, armDir:  1 },
      { x: -2.0,  z: -39.2, armDir: -1 },
      { x: 14.0,  z: -54.4, armDir:  1 },
      { x: 32.0,  z: -39.2, armDir: -1 },
      { x: 50.0,  z: -54.4, armDir:  1 },
      { x: 68.0,  z: -39.2, armDir: -1 },
      { x: -68.0, z: -54.4, armDir:  1 }
    ].forEach(({ x: sx, z: sz, armDir }) => {
      const sPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 7.2, 14), poleMetalMat);
      sPole.position.set(sx, 3.6, sz);
      sPole.castShadow = true;
      siteGroup.add(sPole);

      // Overhanging Mast Arm Extending 2.2m Over Roadway Lanes
      const mastArm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 2.4, 10), poleMetalMat);
      mastArm.rotation.x = armDir * (Math.PI / 2 - 0.16);
      mastArm.position.set(sx, 7.05, sz + armDir * 1.15);
      siteGroup.add(mastArm);

      const headZ = sz + armDir * 2.25;
      // Large Rectangular Street Luminaire Head (0.40m x 0.12m x 0.88m)
      const cobraHead = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.12, 0.88), this.materials.cabinetBody);
      cobraHead.position.set(sx, 7.22, headZ);
      siteGroup.add(cobraHead);

      // Large Rectangular LED Optical Array (0.34m x 0.78m — Not a single point!)
      const cobraLed = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.028, 0.78), poleLedMat);
      cobraLed.position.set(sx, 7.16, headZ);
      siteGroup.add(cobraLed);

      // Rectangular-Origin Fresnel-Diffused Volumetric Beam (Top matches 0.34m x 0.78m fixture rectangle, zero hard line!)
      const sBeam = this._createDiffusedRectangularBeamMesh(0.34, 0.78, 6.2, 8.4, 7.05);
      sBeam.position.set(sx, 7.14, headZ);
      sBeam.rotation.x = -armDir * 0.08;
      sBeam.visible = false;
      this.nightVolumetricCones.push(sBeam);
      siteGroup.add(sBeam);

      // Wide-Penumbra Diffused Roadway SpotLight (penumbra = 1.0 for buttery smooth edge feathering)
      const stSpot = new THREE.SpotLight(0xffdfa8, 92.0, 32.0, Math.PI * 0.46, 1.0, 1.35);
      stSpot.position.set(sx, 7.1, headZ);
      stSpot.target.position.set(sx, 0.0, headZ + armDir * 1.1);
      stSpot.userData.baseIntensity = 92.0;
      this.exteriorNightLights.push(stSpot);
      siteGroup.add(stSpot);
      siteGroup.add(stSpot.target);

      // Soft Rectangular-Elliptical Ground Wash on Biotech Parkway Asphalt (Zero harsh circular hotspot!)
      const stPool = new THREE.Mesh(
        new THREE.PlaneGeometry(11.5, 14.5),
        new THREE.MeshBasicMaterial({
          map: rectWashTex,
          transparent: true,
          opacity: 0.44,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );
      stPool.rotation.x = -Math.PI / 2;
      stPool.position.set(sx, 0.016, headZ + armDir * 0.9);
      stPool.visible = false;
      stPool.userData.baseOpacity = 0.44;
      this.nightGroundPools.push(stPool);
      siteGroup.add(stPool);
    });

    // 16. Grounded PBR Brick & Cast-Stone Monument Sign (X = 6.2, Z = -12.35)
    const signGroup = new THREE.Group();
    signGroup.name = "Campus_Brick_Monument_Sign";
    signGroup.position.set(6.2, 0, -12.35);

    const monPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.26, 0.72), this.materials.limestonePlinth);
    monPlinth.position.y = 0.13;
    monPlinth.castShadow = true;
    monPlinth.receiveShadow = true;
    signGroup.add(monPlinth);

    const monBrickCore = new THREE.Mesh(
      new THREE.BoxGeometry(2.85, 1.18, 0.52),
      this._createBrickCladdingMaterial(2.85, 1.18)
    );
    monBrickCore.position.y = 0.26 + 0.59;
    monBrickCore.castShadow = true;
    monBrickCore.receiveShadow = true;
    signGroup.add(monBrickCore);

    const monCap = new THREE.Mesh(new THREE.BoxGeometry(3.08, 0.10, 0.66), this.materials.limestonePlinth);
    monCap.position.y = 1.49;
    monCap.castShadow = true;
    signGroup.add(monCap);

    const signPlaque = new THREE.Mesh(
      new THREE.BoxGeometry(2.38, 0.86, 0.58),
      new THREE.MeshStandardMaterial({ color: 0x141922, roughness: 0.25, metalness: 0.85 })
    );
    signPlaque.position.set(0, 0.86, 0);
    signGroup.add(signPlaque);

    const monCanvas = document.createElement("canvas");
    monCanvas.width = 768;
    monCanvas.height = 280;
    const mCtx = monCanvas.getContext("2d");
    mCtx.fillStyle = "#141922";
    mCtx.fillRect(0, 0, 768, 280);
    mCtx.strokeStyle = "#d4af37";
    mCtx.lineWidth = 6;
    mCtx.strokeRect(10, 10, 748, 260);
    mCtx.fillStyle = "#38bdf8";
    mCtx.font = "bold 40px 'IBM Plex Sans', sans-serif";
    mCtx.textAlign = "center";
    mCtx.fillText("CHEMMATE BIOTECH", 384, 86);
    mCtx.fillStyle = "#f8fafc";
    mCtx.font = "bold 26px 'IBM Plex Sans', sans-serif";
    mCtx.fillText("PHARMACEUTICAL RESEARCH CAMPUS", 384, 145);
    mCtx.fillStyle = "#fbbf24";
    mCtx.font = "bold 20px 'IBM Plex Mono', monospace";
    mCtx.fillText("VISITOR RECEPTION  →  PAVILION 4", 384, 212);

    const monTex = new THREE.CanvasTexture(monCanvas);
    monTex.colorSpace = THREE.SRGBColorSpace;
    [-1, 1].forEach((side) => {
      const monMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.30, 0.80),
        new THREE.MeshBasicMaterial({ map: monTex })
      );
      if (side < 0) monMesh.rotation.y = Math.PI;
      monMesh.position.set(0, 0.86, side * 0.295);
      signGroup.add(monMesh);
    });

    // Twin Architectural Bronze Ground Floodlights Grazing Brick Monument Sign (-Z & +Z)
    [-0.78, 0.78].forEach((uz) => {
      const flood = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.08, 0.14, 14),
        this.materials.bronzeMullion
      );
      flood.position.set(0, 0.07, uz);
      flood.rotation.x = uz < 0 ? 0.52 : -0.52;
      signGroup.add(flood);

      const uLight = new THREE.PointLight(0xffe0a3, 9.5, 7.2, 1.5);
      uLight.position.set(0, 0.34, uz * 0.88);
      uLight.userData.baseIntensity = 9.5;
      this.exteriorNightLights.push(uLight);
      signGroup.add(uLight);
    });

    siteGroup.add(signGroup);
    this.colliders.push(new THREE.Box3().setFromObject(signGroup));

    // 17. Outdoor Break Room Staff Patio, Cedar Pergola & Café Seating
    this._buildOutdoorStaffPatio(siteGroup);

    // 18. Populate Real Converted .GLB Perimeter Fence, Specimen Trees, Shrubs & Grass Clumps
    this._populateCampusGLBAssets(siteGroup);

    this.root.add(siteGroup);

    // Synchronize newly registered exterior night lights with active startup mood
    this.setAtmosphereMood(this.currentMood || "daylight");
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

    const stainlessPanelMat = new THREE.MeshStandardMaterial({
      color: 0xdce4ee,
      roughness: 0.32,
      metalness: 0.62,
      name: `Mat_ColdRoom_Stainless_${cfg.id}`
    });
    const doorStainlessMat = new THREE.MeshStandardMaterial({
      color: 0xe4ebf3,
      roughness: 0.24,
      metalness: 0.78,
      name: `Mat_ColdRoom_Door_Stainless_${cfg.id}`
    });
    const chromeTrimMat = this.materials.cabinetHandle;

    // 1. Exterior Insulated Cam-Lock Brushed Stainless / Arctic Polyurethane Panels
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(cfg.w, cfg.h, cfg.wallT), stainlessPanelMat);
    backWall.position.set(0, cfg.h / 2, halfD - cfg.wallT / 2);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    unit.add(backWall);

    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(cfg.wallT, cfg.h, cfg.d), stainlessPanelMat);
    eastWall.position.set(halfW - cfg.wallT / 2, cfg.h / 2, 0);
    eastWall.castShadow = true;
    eastWall.receiveShadow = true;
    unit.add(eastWall);

    const westWall = new THREE.Mesh(new THREE.BoxGeometry(cfg.wallT, cfg.h, cfg.d), stainlessPanelMat);
    westWall.position.set(-halfW + cfg.wallT / 2, cfg.h / 2, 0);
    westWall.castShadow = true;
    westWall.receiveShadow = true;
    unit.add(westWall);

    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(cfg.w + 0.04, cfg.wallT, cfg.d + 0.04), stainlessPanelMat);
    ceiling.position.set(0, cfg.h - cfg.wallT / 2, 0);
    ceiling.castShadow = true;
    unit.add(ceiling);

    // Architectural Corner Extrusions, Floor Cove Base & Vertical Cam-Lock Panel Joint Seams on -Z & Side Elevations
    [-halfW, halfW].forEach((cxCorner) => {
      const cornerPost = new THREE.Mesh(new THREE.BoxGeometry(0.045, cfg.h, 0.045), chromeTrimMat);
      cornerPost.position.set(cxCorner, cfg.h / 2, -halfD);
      unit.add(cornerPost);
    });
    const topFasciaBar = new THREE.Mesh(new THREE.BoxGeometry(cfg.w + 0.05, 0.06, 0.05), this.materials.matteBlackTrim);
    topFasciaBar.position.set(0, cfg.h - 0.03, -halfD - 0.008);
    unit.add(topFasciaBar);

    const baseCove = new THREE.Mesh(new THREE.BoxGeometry(cfg.w + 0.03, 0.10, 0.025), this.materials.diamondPlateAluminum);
    baseCove.position.set(0, 0.05, -halfD - 0.006);
    unit.add(baseCove);

    for (let sz = -halfD + 0.55; sz <= halfD - 0.45; sz += 0.55) {
      [-halfW - 0.005, halfW + 0.005].forEach((sx) => {
        const sideSeam = new THREE.Mesh(new THREE.BoxGeometry(0.012, cfg.h - 0.08, 0.016), this.materials.matteBlackTrim);
        sideSeam.position.set(sx, cfg.h / 2, sz);
        unit.add(sideSeam);
      });
    }

    // 2. Interior Diamond Plate Aluminum Treadwear Floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w - cfg.wallT * 2, 0.015, cfg.d - cfg.wallT * 2),
      this.materials.diamondPlateAluminum
    );
    floor.position.set(0, 0.008, 0);
    unit.add(floor);

    // 3. Front Wall Segments (-Z Face at z = -halfD) Framed Around Insulated Overlap Doorway
    const doorW = 0.96;
    const doorH = 2.14;
    const sideW = (cfg.w - doorW) / 2;

    const frontL = new THREE.Mesh(new THREE.BoxGeometry(sideW, cfg.h, cfg.wallT), stainlessPanelMat);
    frontL.position.set(-halfW + sideW / 2, cfg.h / 2, -halfD + cfg.wallT / 2);
    frontL.castShadow = true;
    frontL.receiveShadow = true;
    unit.add(frontL);

    const frontR = new THREE.Mesh(new THREE.BoxGeometry(sideW, cfg.h, cfg.wallT), stainlessPanelMat);
    frontR.position.set(halfW - sideW / 2, cfg.h / 2, -halfD + cfg.wallT / 2);
    frontR.castShadow = true;
    frontR.receiveShadow = true;
    unit.add(frontR);

    const lintelH = cfg.h - doorH;
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorW, lintelH, cfg.wallT), stainlessPanelMat);
    lintel.position.set(0, doorH + lintelH / 2, -halfD + cfg.wallT / 2);
    lintel.castShadow = true;
    lintel.receiveShadow = true;
    unit.add(lintel);

    // Heated Anodized Door Frame Surround & Upper Illuminated Identification Header Sign (Facing -Z!)
    const frameSurroundW = doorW + 0.14;
    const jambL = new THREE.Mesh(new THREE.BoxGeometry(0.065, doorH + 0.07, 0.03), this.materials.matteBlackTrim);
    jambL.position.set(-doorW / 2 - 0.035, (doorH + 0.07) / 2, -halfD - 0.01);
    unit.add(jambL);
    const jambR = jambL.clone();
    jambR.position.x = doorW / 2 + 0.035;
    unit.add(jambR);
    const jambTop = new THREE.Mesh(new THREE.BoxGeometry(frameSurroundW, 0.065, 0.03), this.materials.matteBlackTrim);
    jambTop.position.set(0, doorH + 0.04, -halfD - 0.01);
    unit.add(jambTop);

    // Upper Illuminated Cold-Suite Header Nameplate (Facing -Z toward Lab!)
    const hdrCanvas = document.createElement("canvas");
    hdrCanvas.width = 768;
    hdrCanvas.height = 128;
    const hdrCtx = hdrCanvas.getContext("2d");
    hdrCtx.fillStyle = "#0f172a";
    hdrCtx.fillRect(0, 0, 768, 128);
    hdrCtx.strokeStyle = cfg.tempColor;
    hdrCtx.lineWidth = 5;
    hdrCtx.strokeRect(6, 6, 756, 116);
    hdrCtx.fillStyle = "#f8fafc";
    hdrCtx.font = "bold 30px sans-serif";
    hdrCtx.textAlign = "center";
    hdrCtx.fillText(cfg.title, 384, 54);
    hdrCtx.fillStyle = cfg.tempColor;
    hdrCtx.font = "bold 18px monospace";
    hdrCtx.fillText(cfg.subtitle, 384, 94);
    const hdrTex = new THREE.CanvasTexture(hdrCanvas);
    hdrTex.colorSpace = THREE.SRGBColorSpace;
    const hdrBack = new THREE.Mesh(new THREE.BoxGeometry(cfg.w - 0.28, 0.30, 0.028), this.materials.matteBlackTrim);
    hdrBack.position.set(0, doorH + 0.34, -halfD - 0.014);
    unit.add(hdrBack);
    const hdrSign = new THREE.Mesh(new THREE.PlaneGeometry(cfg.w - 0.34, 0.25), new THREE.MeshBasicMaterial({ map: hdrTex }));
    hdrSign.rotation.y = Math.PI; // Faces -Z into Lab!
    hdrSign.position.set(0, doorH + 0.34, -halfD - 0.030);
    unit.add(hdrSign);

    // 4. Proud-Mounted Overlap Stainless Cold-Room Door on -Z Face (With Heated Observation Viewport, Chrome Hinges & Kason Latch!)
    const doorGroup = new THREE.Group();
    doorGroup.position.set(-doorW / 2, 0, -halfD); // Hinged on -Z front face

    const leafThick = 0.072;
    const leafW = doorW + 0.04;
    const leafH = doorH - 0.02;
    const winW = 0.34, winH = 0.58, winCY = 1.48;

    // 4-Piece Brushed Stainless Insulated Door Frame Stiles & Rails Around Observation Viewport Window
    const stileW = (leafW - winW) / 2;
    const topRailH = leafH - (winCY + winH / 2);
    const botRailH = winCY - winH / 2;

    const dLeft = new THREE.Mesh(new THREE.BoxGeometry(stileW, leafH, leafThick), doorStainlessMat);
    dLeft.position.set(doorW / 2 - leafW / 2 + stileW / 2, leafH / 2 + 0.01, -leafThick / 2);
    dLeft.castShadow = true;
    doorGroup.add(dLeft);

    const dRight = new THREE.Mesh(new THREE.BoxGeometry(stileW, leafH, leafThick), doorStainlessMat);
    dRight.position.set(doorW / 2 + leafW / 2 - stileW / 2, leafH / 2 + 0.01, -leafThick / 2);
    dRight.castShadow = true;
    doorGroup.add(dRight);

    const dTop = new THREE.Mesh(new THREE.BoxGeometry(winW, topRailH, leafThick), doorStainlessMat);
    dTop.position.set(doorW / 2, leafH + 0.01 - topRailH / 2, -leafThick / 2);
    dTop.castShadow = true;
    doorGroup.add(dTop);

    const dBot = new THREE.Mesh(new THREE.BoxGeometry(winW, botRailH, leafThick), doorStainlessMat);
    dBot.position.set(doorW / 2, 0.01 + botRailH / 2, -leafThick / 2);
    dBot.castShadow = true;
    doorGroup.add(dBot);

    // Heated Triple-Pane Observation Viewport Glass & Black Anodized Bezel
    const winBezel = new THREE.Mesh(new THREE.BoxGeometry(winW + 0.05, winH + 0.05, leafThick + 0.012), this.materials.matteBlackTrim);
    winBezel.position.set(doorW / 2, winCY + 0.01, -leafThick / 2);
    doorGroup.add(winBezel);

    const winPane = new THREE.Mesh(new THREE.BoxGeometry(winW - 0.02, winH - 0.02, 0.022), this.materials.glass);
    winPane.position.set(doorW / 2, winCY + 0.01, -leafThick / 2);
    doorGroup.add(winPane);

    // 4-Piece Perimeter Magnetic Gasket Strips (Tucked neatly behind door overlap flange — NEVER covering door face!)
    [
      { x: doorW / 2 - leafW / 2 + 0.01, y: leafH / 2 + 0.01, sx: 0.02, sy: leafH },
      { x: doorW / 2 + leafW / 2 - 0.01, y: leafH / 2 + 0.01, sx: 0.02, sy: leafH },
      { x: doorW / 2, y: leafH, sx: leafW, sy: 0.02 }
    ].forEach((gk) => {
      const gStrip = new THREE.Mesh(new THREE.BoxGeometry(gk.sx, gk.sy, 0.016), this.materials.matteBlackTrim);
      gStrip.position.set(gk.x, gk.y, -0.008);
      doorGroup.add(gStrip);
    });

    // Lower 300mm Diamond-Plate Aluminum Kickplate on Exterior Door Face (-Z)
    const kickplate = new THREE.Mesh(
      new THREE.BoxGeometry(leafW - 0.04, 0.30, 0.006),
      this.materials.diamondPlateAluminum
    );
    kickplate.position.set(doorW / 2, 0.17, -leafThick - 0.004);
    doorGroup.add(kickplate);

    // 3 Exterior Chrome Cam-Lift Self-Closing Hinges Mounted Proud on Left Jamb (-Z)
    [0.36, 1.12, doorH - 0.32].forEach((hy) => {
      const hStrap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.055, 0.024), chromeTrimMat);
      hStrap.position.set(0.07, hy, -leafThick - 0.012);
      doorGroup.add(hStrap);

      const hBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.020, 0.11, 14), chromeTrimMat);
      hBarrel.position.set(-0.015, hy, -leafThick * 0.65);
      doorGroup.add(hBarrel);
    });

    // Heavy-Duty Kason Chrome Cam-Lift Trigger Latch, Padlock Strike & Lever Handle on Right Exterior Stile (-Z)
    const latchBody = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.24, 0.045), chromeTrimMat);
    latchBody.position.set(doorW - 0.06, 1.04, -leafThick - 0.022);
    doorGroup.add(latchBody);

    const latchLever = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.18, 0.065), this.materials.goldBrassAccent);
    latchLever.position.set(doorW - 0.06, 0.99, -leafThick - 0.055);
    latchLever.rotation.x = 0.18;
    doorGroup.add(latchLever);

    // Interior Photoluminescent Emergency Safety Escape Release Plunger (+Z inside)
    const escapePlunger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.09, 16),
      this.materials.safetyGlowGreen
    );
    escapePlunger.rotation.x = Math.PI / 2;
    escapePlunger.position.set(doorW - 0.08, 1.04, 0.04);
    doorGroup.add(escapePlunger);

    unit.add(doorGroup);

    // 5. Overhead Forced-Air Dual-Fan Evaporator Cooling Coil Inside Chamber
    const evap = new THREE.Group();
    evap.position.set(0, cfg.h - 0.35, halfD - 0.45);
    const evapBody = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.30, 0.45), this.materials.evaporatorFins);
    evap.add(evapBody);
    [-0.32, 0.32].forEach((fx) => {
      const fanGrill = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.015, 16), this.materials.matteBlackTrim);
      fanGrill.rotation.x = Math.PI / 2;
      fanGrill.position.set(fx, 0, -0.23);
      evap.add(fanGrill);
    });
    unit.add(evap);

    // 6. Metro Green Epoxy Wire Storage Shelving + Stocked Reagent Carboys & Cryo Boxes Visible Through Viewport!
    const bottleAmber = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.18, metalness: 0.08 });
    const cryoBoxBlue = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.10 });
    [-halfW + 0.36, halfW - 0.36, 0.0].forEach((sx, rIdx) => {
      const rack = new THREE.Group();
      rack.position.set(sx, 0, rIdx === 2 ? halfD - 0.42 : 0);
      const rW = rIdx === 2 ? 0.72 : 0.48;
      const rD = rIdx === 2 ? 0.42 : cfg.d - 0.56;
      for (let s = 1; s <= 4; s++) {
        const sy = s * 0.48;
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(rW, 0.02, rD), this.materials.wireRackGreen);
        shelf.position.y = sy;
        rack.add(shelf);

        // Stocked vessels / cryo boxes on tiers 2 & 3 directly visible through door viewport
        if (s === 2 || s === 3) {
          [-0.14, 0.14].forEach((bx, bIdx) => {
            const item = cfg.tempStr.includes("-")
              ? new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.18), cryoBoxBlue)
              : new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.22, 14), bottleAmber);
            item.position.set(bx, sy + (cfg.tempStr.includes("-") ? 0.08 : 0.12), bIdx === 0 ? -0.06 : 0.08);
            rack.add(item);
          });
        }
      }
      unit.add(rack);
    });

    // 7. Vapor-Proof Sub-Zero LED Light Luminaire Inside Unit (Illuminates Viewport Interior!)
    const coldLight = new THREE.PointLight(cfg.lightColor, cfg.lightIntensity * 2.2, 4.2, 1.3);
    coldLight.position.set(0, cfg.h - 0.24, -0.15);
    unit.add(coldLight);

    // 8. Exterior Digital Microprocessor Temperature HUD Controller & Alarm Panel (Facing -Z Outward Into Lab!)
    const hudGroup = new THREE.Group();
    hudGroup.position.set(halfW - sideW / 2, 1.48, -halfD - 0.022);

    const hudCase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.04), this.materials.matteBlackTrim);
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

    hctx.fillStyle = "#94a3b8";
    hctx.font = "12px monospace";
    hctx.fillText("SETPOINT: " + cfg.tempStr, 128, 220);
    hctx.fillText("ALARM HIGH: " + (cfg.tempStr.includes("-") ? "-12.0°C" : "+8.0°C"), 128, 245);
    hctx.fillText("CALIBRATED NIST TRACEABLE", 128, 275);

    const hudTex = new THREE.CanvasTexture(hudCanvas);
    hudTex.colorSpace = THREE.SRGBColorSpace;
    const hudScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.21, 0.28),
      new THREE.MeshBasicMaterial({ map: hudTex })
    );
    hudScreen.rotation.y = Math.PI; // Faces -Z toward Lab operator!
    hudScreen.position.set(0, 0, -0.022);
    hudGroup.add(hudScreen);

    unit.add(hudGroup);

    // Colliders for walk-in enclosure
    [backWall, eastWall, westWall, frontL, frontR, doorGroup].forEach((mesh) => {
      unit.updateMatrixWorld(true);
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

    // Lab West Perimeter Crash Rail (X = -21.88, Z: -9.0 to 9.0) + Rear L-Wing West Crash Rail
    const labBumper = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.10, 18.0),
      this.materials.bumperRail
    );
    labBumper.position.set(-21.88, 0.95, 0);
    this.root.add(labBumper);

    const northWingBumper = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.10, 17.0),
      this.materials.bumperRail
    );
    northWingBumper.position.set(-21.88, 0.95, 18.5);
    this.root.add(northWingBumper);

    // 3. ANSI Z535 Fire Alarm Strobe / Horn Stations (Safety Red + Xenon Strobe at Y = 2.4m)
    const fireStrobeLocations = [
      { x: -21.88, z: 0.0, rotY: Math.PI / 2 },    // West Lab Wall
      { x: -21.88, z: 18.5, rotY: Math.PI / 2 },   // Rear L-Wing West Wall
      { x: 4.5, z: 9.38, rotY: Math.PI },           // North Lab Wall
      { x: -6.0, z: 27.38, rotY: Math.PI },         // Rear L-Wing North Wall
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
      { x: -21.88, z: 4.5, rotY: Math.PI / 2 },
      { x: -21.88, z: 18.5, rotY: Math.PI / 2 },
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
      [-18.0, -4.5], [-10.0, -4.5], [-2.0, -4.5], [-18.0, 5.0], [-10.0, 5.0], [-0.5, 5.0],
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
