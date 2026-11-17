import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildSEMModel } from './sem3d.js?v=20261117-oga';
import { sfx } from './sfx.js?v=20261117-oga';

// ============================================================================
// 1. Specimen Monograph Database (Heightfield h(u,v), Atomic Number Z(u,v), EDS)
// ============================================================================
const SPECIMENS = [
  {
    id: 'ommatidia',
    stubIdx: 0,
    title: 'Drosophila melanogaster (Compound Eye)',
    shortTitle: '1. Insect Eye (Ommatidia)',
    desc: 'Hexagonal array of 750 ommatidial lenses (Ø 16 µm) with 2 µm interommatidial mechanosensory bristles. Requires 5 nm Au/Pd sputter coating.',
    defaultCoated: true,
    dielectric: true,
    optimalWdMm: 8.5,
    optimalEhtKv: 5.0,
    defaultMag: 15000,
    elements: [
      { symbol: 'C', line: 'Kα', keV: 0.277, wtPct: 51.4, atPct: 64.8, color: '#ef4444' },
      { symbol: 'O', line: 'Kα', keV: 0.525, wtPct: 26.2, atPct: 24.8, color: '#22c55e' },
      { symbol: 'N', line: 'Kα', keV: 0.392, wtPct: 8.4, atPct: 9.1, color: '#38bdf8' },
      { symbol: 'Au', line: 'Mα', keV: 2.120, wtPct: 11.2, atPct: 0.9, color: '#eab308' },
      { symbol: 'Pd', line: 'Lα', keV: 2.838, wtPct: 2.8, atPct: 0.4, color: '#a855f7' },
    ],
  },
  {
    id: 'pollen',
    stubIdx: 1,
    title: 'Hibiscus syriacus (Echinate Pollen Grain)',
    shortTitle: '2. Hibiscus Pollen (Exine)',
    desc: 'Spherical sporopollenin exine wall with conical echinate spines, reticulate micropores, and germination apertures mounted on carbon tape.',
    defaultCoated: true,
    dielectric: true,
    optimalWdMm: 9.0,
    optimalEhtKv: 3.0,
    defaultMag: 12000,
    elements: [
      { symbol: 'C', line: 'Kα', keV: 0.277, wtPct: 58.0, atPct: 68.9, color: '#ef4444' },
      { symbol: 'O', line: 'Kα', keV: 0.525, wtPct: 31.5, atPct: 28.1, color: '#22c55e' },
      { symbol: 'Ca', line: 'Kα', keV: 3.691, wtPct: 3.2, atPct: 1.1, color: '#38bdf8' },
      { symbol: 'Au', line: 'Mα', keV: 2.120, wtPct: 7.3, atPct: 1.9, color: '#eab308' },
    ],
  },
  {
    id: 'morpho',
    stubIdx: 2,
    title: 'Morpho rhetenor (Photonic Wing Scale)',
    shortTitle: '3. Morpho Butterfly Scale',
    desc: 'Hierarchical chitin lamellae with 700 nm parallel longitudinal ridges and 85 nm cross-rib trabeculae producing structural interference.',
    defaultCoated: true,
    dielectric: true,
    optimalWdMm: 6.5,
    optimalEhtKv: 2.0,
    defaultMag: 45000,
    elements: [
      { symbol: 'C', line: 'Kα', keV: 0.277, wtPct: 55.2, atPct: 66.4, color: '#ef4444' },
      { symbol: 'O', line: 'Kα', keV: 0.525, wtPct: 28.6, atPct: 25.8, color: '#22c55e' },
      { symbol: 'N', line: 'Kα', keV: 0.392, wtPct: 6.8, atPct: 7.0, color: '#38bdf8' },
      { symbol: 'Au', line: 'Mα', keV: 2.120, wtPct: 9.4, atPct: 0.8, color: '#eab308' },
    ],
  },
  {
    id: 'finfet',
    stubIdx: 3,
    title: '5 nm FinFET CMOS Logic Gate Cross-Section',
    shortTitle: '4. 5nm FinFET Silicon Gate',
    desc: 'Cleaved Si(100) wafer die showing epitaxial silicon fins, HfO2 high-k gate dielectric, TiN metal gate, SiO2 STI, and tungsten contact plugs.',
    defaultCoated: true,
    dielectric: false,
    optimalWdMm: 5.0,
    optimalEhtKv: 15.0,
    defaultMag: 120000,
    elements: [
      { symbol: 'Si', line: 'Kα', keV: 1.740, wtPct: 48.5, atPct: 62.1, color: '#38bdf8' },
      { symbol: 'O', line: 'Kα', keV: 0.525, wtPct: 16.4, atPct: 30.8, color: '#22c55e' },
      { symbol: 'W', line: 'Mα', keV: 1.775, wtPct: 21.8, atPct: 3.6, color: '#eab308' },
      { symbol: 'Hf', line: 'Mα', keV: 1.645, wtPct: 8.1, atPct: 1.4, color: '#a855f7' },
      { symbol: 'Cu', line: 'Kα', keV: 8.040, wtPct: 5.2, atPct: 2.1, color: '#f97316' },
    ],
  },
  {
    id: 'zno_tetrapods',
    stubIdx: 4,
    title: 'ZnO Wurtzite Tetrapod Nanowires',
    shortTitle: '5. ZnO Nanorod Tetrapods',
    desc: 'Vapor-phase synthesized zinc oxide 4-arm tetrapod nanocrystals with faceted hexagonal wurtzite [0001] prisms (Ø 80 nm).',
    defaultCoated: true,
    dielectric: false,
    optimalWdMm: 7.5,
    optimalEhtKv: 10.0,
    defaultMag: 65000,
    elements: [
      { symbol: 'Zn', line: 'Lα', keV: 1.012, wtPct: 78.4, atPct: 49.2, color: '#38bdf8' },
      { symbol: 'O', line: 'Kα', keV: 0.525, wtPct: 19.6, atPct: 50.1, color: '#22c55e' },
      { symbol: 'Al', line: 'Kα', keV: 1.486, wtPct: 2.0, atPct: 0.7, color: '#f97316' },
    ],
  },
  {
    id: 'al_cu_alloy',
    stubIdx: 5,
    title: 'AA2024-T3 Al-Cu-Mg-Si Aerospace Alloy',
    shortTitle: '6. Al-Cu-Mg-Si Alloy (Z-Contrast)',
    desc: 'Metallographic polished stub showing dendritic alpha-Al matrix (Z=13) and bright intermetallic Al2Cu theta-phase precipitates (Z=29).',
    defaultCoated: true,
    dielectric: false,
    optimalWdMm: 8.5,
    optimalEhtKv: 20.0,
    defaultMag: 25000,
    elements: [
      { symbol: 'Al', line: 'Kα', keV: 1.486, wtPct: 91.2, atPct: 94.1, color: '#38bdf8' },
      { symbol: 'Cu', line: 'Kα', keV: 8.040, wtPct: 4.8, atPct: 2.1, color: '#eab308' },
      { symbol: 'Mg', line: 'Kα', keV: 1.253, wtPct: 1.8, atPct: 2.0, color: '#22c55e' },
      { symbol: 'Si', line: 'Kα', keV: 1.740, wtPct: 1.4, atPct: 1.4, color: '#a855f7' },
      { symbol: 'Mn', line: 'Kα', keV: 5.898, wtPct: 0.8, atPct: 0.4, color: '#ef4444' },
    ],
  },
];

// ============================================================================
// 2. 10-Chapter Guided Tour & Voiceover Choreography (Gate 5 PRES-01)
// ============================================================================
export const TOUR_CHAPTERS = [
  {
    idx: 0,
    badge: 'STAGE 0 / 10',
    title: 'VC-E Electron Microscopy Suite & System Architecture',
    camPos: [-11.5, 14.5, -16.5],
    camTarget: [0.0, 9.0, 0.0],
    explode: 0.0,
    cutaway: false,
    pluggedIn: true,
    doorOpen: 0.0,
    voiceover:
      'Welcome to the dedicated VC-E Electron Microscopy Suite housing our ZEISS GeminiSEM 500 digital twin. Engineered on a vibration-isolated concrete inertia slab with acoustic and electromagnetic shielding, this field-emission scanning electron microscope delivers sub-nanometer imaging from twenty volts up to thirty kilovolts.',
  },
  {
    idx: 1,
    badge: 'STAGE 1 / 10',
    title: 'Electrical Continuity, Grounding & Mains Power-Up',
    camPos: [-5.5, 4.8, 10.5],
    camTarget: [-2.0, 2.2, 5.2],
    explode: 0.0,
    cutaway: false,
    pluggedIn: true,
    doorOpen: 0.0,
    voiceover:
      'Operation begins at the dedicated hospital-grade duplex wall receptacle. Inserting the heavy-duty NEMA power plug and engaging the rear main breaker routes AC power through the EMI filter to the internal power supplies. Unplugging the cord immediately severs electrical continuity, blacking out the dual monitors and halting all vacuum pumps.',
  },
  {
    idx: 2,
    badge: 'STAGE 2 / 10',
    title: 'Specimen Preparation & Gold-Palladium Sputter Coating',
    camPos: [11.0, 11.4, -7.2],
    camTarget: [14.8, 8.6, 1.2],
    explode: 0.0,
    cutaway: false,
    pluggedIn: true,
    doorOpen: 0.0,
    voiceover:
      'At the adjacent specimen preparation bench, non-conductive biological samples such as our compound insect eye and hibiscus pollen are mounted on twelve-point-seven millimeter aluminum pin stubs with carbon tape and coated with five nanometers of gold-palladium in the desk sputter coater to prevent dielectric surface charging.',
  },
  {
    idx: 3,
    badge: 'STAGE 3 / 10',
    title: 'Chamber Venting, 5-Axis Eucentric Stage Loading & UHV Pumpdown',
    camPos: [-7.5, 11.2, -8.5],
    camTarget: [-3.5, 9.5, -0.5],
    explode: 0.0,
    cutaway: false,
    pluggedIn: true,
    doorOpen: 0.85,
    voiceover:
      'After venting the stainless-steel specimen chamber with dry nitrogen, the heavy front door swings open on precision hinges to expose the five-axis motorized eucentric stage and nine-position carousel. Closing the door engages the Viton O-ring safety interlock, allowing the dry scroll pump and ninety-thousand RPM turbomolecular pump to evacuate the chamber to ten to the minus six millibar.',
  },
  {
    idx: 4,
    badge: 'STAGE 4 / 10',
    title: 'Operator Console, DualRotary Encoders & Dual Joysticks',
    camPos: [4.5, 11.8, -7.8],
    camTarget: [4.5, 8.8, 0.2],
    explode: 0.0,
    cutaway: false,
    pluggedIn: true,
    doorOpen: 0.0,
    voiceover:
      'At the ergonomic operator console, the microscopist controls the instrument using dual twenty-seven-inch monitors, the tactile ZEISS Dual-Rotary control panel with eight knurled encoders for magnification, working distance focus, stigmator X and Y, and brightness-contrast, plus the dual Hall-effect joysticks for five-axis stage navigation.',
  },
  {
    idx: 5,
    badge: 'STAGE 5 / 10',
    title: 'Active Electron Beam Raster Scanning & Multi-Detector Physics',
    camPos: [-0.8, 12.2, -9.8],
    camTarget: [0.5, 9.8, 0.0],
    explode: 0.0,
    cutaway: true,
    pluggedIn: true,
    doorOpen: 0.0,
    voiceover:
      'Inside the Gemini II column, the Schottky field emitter and eight-kilovolt electrostatic Beam Booster focus a sub-nanometer primary electron probe across the specimen in a progressive raster pattern. Operators switch live between the In-Lens detector for surface detail, the Everhart-Thornley SE2 detector for topography, and the four-quadrant backscatter detector for atomic-number contrast.',
  },
  {
    idx: 6,
    badge: 'STAGE 6 / 10',
    title: 'High-Resolution Micrograph Capture, EDS Spectrum & GLP Audit Export',
    camPos: [3.2, 10.6, -5.5],
    camTarget: [3.8, 9.5, 0.8],
    explode: 0.0,
    cutaway: false,
    pluggedIn: true,
    doorOpen: 0.0,
    voiceover:
      'Triggering a slow photo scan integrates a low-noise micrograph into the captured filmstrip complete with a calibrated ZEISS micrometer scale bar and datazone footer. Simultaneously, the silicon drift detector acquires characteristic X-ray spectra for elemental quantification, ready for one-click PNG download and GLP CSV audit export.',
  },
  {
    idx: 7,
    badge: 'STAGE 7A / 10',
    title: 'Internal Power Supply, Toroidal Transformer & 30 kV EHT Tank',
    camPos: [-9.2, 5.8, -8.2],
    camTarget: [-4.2, 3.6, 1.5],
    explode: 0.65,
    cutaway: true,
    pluggedIn: true,
    doorOpen: 0.0,
    voiceover:
      'Opening the lower service bay reveals end-to-end color-coded wiring from the rear IEC inlet to the three-hundred volt-ampere low-stray-field toroidal transformer, the Mean Well twenty-four volt switching supply, and the epoxy-potted thirty-kilovolt Spellman high-voltage tank that feeds the top field-emission gun via a shielded silicone umbilical.',
  },
  {
    idx: 8,
    badge: 'STAGE 7B / 10',
    title: 'Turbomolecular Pump, Dry Scroll Foreline & 5-Axis Stage Motors',
    camPos: [-9.8, 7.8, -6.5],
    camTarget: [-4.5, 5.2, 0.2],
    explode: 0.75,
    cutaway: true,
    pluggedIn: true,
    doorOpen: 0.6,
    voiceover:
      'Every mechanical actuator is modeled in genuine three-dimensional geometry: the Pfeiffer HiPace three-hundred turbomolecular pump bolted to the bottom ConFlat flange, the corrugated stainless foreline bellows leading to the oil-free dry scroll backing pump, and the precision DC servo and stepper motors driving the five-axis eucentric stage.',
  },
  {
    idx: 9,
    badge: 'STAGE 7C / 10',
    title: 'Column Sensors, 45° Optical Relay Mirror, Motherboard & Wi-Fi/BLE',
    camPos: [-2.5, 6.8, -8.5],
    camTarget: [-2.5, 5.2, -0.5],
    explode: 0.85,
    cutaway: true,
    pluggedIn: true,
    doorOpen: 0.0,
    voiceover:
      'Inside the chamber and electronics bay, a forty-five-degree gold optical relay mirror feeds the infrared chamberscope, a Class-A PT100 platinum RTD monitors objective lens cooling, and the six-layer FR-4 motherboard integrates an ARM Cortex-M7 microcontroller, dual RAM chips, a two-hundred-fifty-six gigabyte NVMe SSD, and a shielded Wi-Fi and Bluetooth telemetry module.',
  },
];

// ============================================================================
// 3. Application State (Mirrored 1:1 with Python sem_controller.py)
// ============================================================================
const state = {
  isPluggedIn: true,
  powerSwitch: true,
  beamOn: true,
  vacuumState: 'UHV_READY', // 'VENTED', 'PUMPING', 'UHV_READY'
  chamberVacuumMbar: 1.4e-6,
  gunVacuumMbar: 2.0e-10,
  doorOpen: false,

  specimenIdx: 0,
  coatedByStub: [true, true, true, true, true, true],

  detector: 'InLens_Secondary',
  magnification: 15000,
  ehtKv: 15.0,
  probeCurrentPa: 200,
  apertureUm: 30,
  wdMm: 8.50,
  focusFine: 50,
  stigX: 0.0,
  stigY: 0.0,
  brightness: 50,
  contrast: 68,

  stageX: 0.0,
  stageY: 0.0,
  stageZ: 8.50,
  stageTilt: 0.0,
  stageRot: 0.0,

  scanMode: 'FAST', // 'FAST' (TV 512px), 'SLOW' (Photo 1024px), 'LINE' (Line Profile)
  frozen: false,
  scanRow: 0,
  caliperActive: false,
  caliperPoints: [],

  exploded: 0.0,
  cutaway: false,
  wireframe: false,
  autoRotate: false,
  orbitSpeed: 1.0,
  currentTheme: 'modern',
  currentStageMode: 'plate',
  calloutsVisible: true,
  lightMult: 1.0,
  lightMood: 'neutral',

  capturedScans: [],
  tourActive: false,
  tourIndex: 0,
};

// ============================================================================
// 4. Deterministic Procedural Specimen Heightfield & Atomic-Z Synthesizer
// ============================================================================
const FIELD_SIZE = 256;
const heightBuffer = new Float32Array(FIELD_SIZE * FIELD_SIZE);
const zNumberBuffer = new Float32Array(FIELD_SIZE * FIELD_SIZE);
const elemIndexBuffer = new Uint8Array(FIELD_SIZE * FIELD_SIZE);

function hash2(ix, iy) {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function rebuildSpecimenField(specIdx) {
  const spec = SPECIMENS[specIdx] || SPECIMENS[0];
  for (let y = 0; y < FIELD_SIZE; y++) {
    const v = y / FIELD_SIZE;
    for (let x = 0; x < FIELD_SIZE; x++) {
      const u = x / FIELD_SIZE;
      const idx = y * FIELD_SIZE + x;
      const microNoise = (hash2(x, y) - 0.5) * 0.04;

      if (spec.id === 'ommatidia') {
        // Hexagonal array of convex ommatidial corneal facets + sensory bristles at vertices
        const scale = 6.5;
        const gx = u * scale;
        const gy = v * scale * 1.1547;
        const row = Math.floor(gy);
        const col = Math.floor(gx - (row & 1) * 0.5);
        let minD = 9.0;
        let secondD = 9.0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const r = row + dy;
            const c = col + dx;
            const cx = c + (r & 1) * 0.5 + 0.5;
            const cy = (r + 0.5) / 1.1547;
            const dist = Math.hypot(u * scale - cx, v * scale - cy);
            if (dist < minD) {
              secondD = minD;
              minD = dist;
            } else if (dist < secondD) {
              secondD = dist;
            }
          }
        }
        const dome = Math.max(0, 1.0 - minD * minD * 2.65);
        const groove = Math.max(0, 1.0 - Math.abs(secondD - minD) * 9.5);
        const bristle = groove > 0.72 && ((row + col) % 2 === 0) ? (groove - 0.72) * 3.2 : 0;
        const microNipples = 0.03 * Math.sin(u * 180) * Math.cos(v * 180);
        heightBuffer[idx] = Math.min(1.0, dome * 0.82 + bristle + microNipples + microNoise);
        zNumberBuffer[idx] = bristle > 0.08 ? 46.0 : 28.0 + dome * 18.0; // Au/Pd enriched on bristles/ridges
        elemIndexBuffer[idx] = bristle > 0.08 ? 3 : dome > 0.45 ? 0 : 1;
      } else if (spec.id === 'pollen') {
        // Spherical grain + conical echinate spines + reticulate exine pores
        const dx = (u - 0.5) * 2.1;
        const dy = (v - 0.5) * 2.1;
        const r2 = dx * dx + dy * dy;
        if (r2 > 0.92) {
          // Conductive carbon tape substrate
          heightBuffer[idx] = 0.05 + 0.03 * Math.sin(u * 25 + v * 18) + microNoise;
          zNumberBuffer[idx] = 6.0;
          elemIndexBuffer[idx] = 0;
        } else {
          const sphereH = Math.sqrt(Math.max(0, 0.92 - r2));
          const spineGrid = Math.max(0, Math.sin(u * 38.0) * Math.cos(v * 38.0));
          const spine = Math.pow(spineGrid, 4.0) * 0.42;
          const pores = 0.04 * Math.sin(u * 140) * Math.sin(v * 140);
          heightBuffer[idx] = sphereH * 0.68 + spine + pores + microNoise;
          zNumberBuffer[idx] = 14.0 + spine * 55.0;
          elemIndexBuffer[idx] = spine > 0.14 ? 3 : sphereH > 0.4 ? 1 : 2;
        }
      } else if (spec.id === 'morpho') {
        // Parallel longitudinal chitin lamellae + cross-rib ladder nanostructure
        const ridgePhase = Math.sin(u * Math.PI * 18.0);
        const ridge = Math.pow(Math.max(0, ridgePhase), 1.6) * 0.78;
        const crossRib = ridgePhase < 0.25 ? Math.pow(Math.max(0, Math.sin(v * Math.PI * 56.0)), 2.5) * 0.36 : 0;
        const microribs = 0.06 * Math.sin(v * 160.0);
        heightBuffer[idx] = ridge + crossRib + microribs + microNoise;
        zNumberBuffer[idx] = 12.0 + ridge * 38.0;
        elemIndexBuffer[idx] = ridge > 0.45 ? 3 : crossRib > 0.12 ? 0 : 1;
      } else if (spec.id === 'finfet') {
        // Periodic 5nm FinFET fins + High-k HfO2 gate + Tungsten contact plugs
        const finPeriod = (u * 10.0) % 1.0;
        const isFin = finPeriod > 0.32 && finPeriod < 0.68;
        const gateBand = v > 0.28 && v < 0.62;
        const viaContact = Math.hypot((finPeriod - 0.5) * 2.2, (v - 0.78) * 3.5) < 0.42;
        let h = 0.15;
        let zNum = 14.0; // Si
        let eIdx = 0;
        if (isFin) {
          h = 0.68;
          zNum = 14.0;
          eIdx = 0;
        }
        if (gateBand && isFin) {
          h = 0.88;
          zNum = 72.0; // HfO2 / TiN gate stack
          eIdx = 3;
        } else if (gateBand) {
          h = 0.48;
          zNum = 42.0;
          eIdx = 1;
        }
        if (viaContact) {
          h = 0.94;
          zNum = 74.0; // Tungsten (W, Z=74) plug
          eIdx = 2;
        }
        heightBuffer[idx] = h + microNoise * 0.5;
        zNumberBuffer[idx] = zNum;
        elemIndexBuffer[idx] = eIdx;
      } else if (spec.id === 'zno_tetrapods') {
        // Intersecting hexagonal ZnO nanorod tetrapod arms
        let maxRod = 0.08;
        const centers = [
          [0.28, 0.32, 0.4],
          [0.68, 0.36, 1.1],
          [0.48, 0.68, 2.2],
          [0.24, 0.74, 0.8],
          [0.76, 0.72, 1.7],
        ];
        centers.forEach(([cx, cy, rot]) => {
          for (let arm = 0; arm < 4; arm++) {
            const ang = rot + arm * 1.5708;
            const dx = u - cx;
            const dy = v - cy;
            const proj = dx * Math.cos(ang) + dy * Math.sin(ang);
            const perp = Math.abs(-dx * Math.sin(ang) + dy * Math.cos(ang));
            if (proj >= -0.02 && proj <= 0.24 && perp < 0.042) {
              const rodH = Math.max(0, 1.0 - (perp / 0.042) * 0.65) * (1.0 - proj * 1.2);
              if (rodH > maxRod) maxRod = rodH;
            }
          }
        });
        heightBuffer[idx] = maxRod + microNoise * 0.6;
        zNumberBuffer[idx] = maxRod > 0.15 ? 30.0 : 13.0; // ZnO (Z_eff ~ 24-30) on Al stub (Z=13)
        elemIndexBuffer[idx] = maxRod > 0.15 ? 0 : 2;
      } else {
        // Al-Cu-Mg-Si Alloy: dendritic alpha-Al matrix (Z=13) + bright intermetallic Al2Cu theta precipitates (Z=29)
        const grainWave =
          Math.sin(u * 14.0 + Math.cos(v * 9.0)) * Math.cos(v * 14.0 - Math.sin(u * 11.0));
        const isPrecipitate = Math.abs(grainWave) > 0.62;
        const polishScratch = 0.03 * Math.sin((u * 0.7 + v * 0.7) * 190.0);
        heightBuffer[idx] = (isPrecipitate ? 0.56 : 0.38) + polishScratch + microNoise * 0.4;
        zNumberBuffer[idx] = isPrecipitate ? 29.0 : 13.0; // Cu-rich intermetallic (Z=29) vs Al matrix (Z=13)
        elemIndexBuffer[idx] = isPrecipitate ? 1 : 0;
      }
    }
  }
}

// ============================================================================
// 5. Progressive Line-by-Line Raster Scan Canvas Renderer
// ============================================================================
const lcdCanvas = document.getElementById('lcd');
const lcdCtx = lcdCanvas.getContext('2d');
const scanTex = new THREE.CanvasTexture(lcdCanvas);
scanTex.flipY = false;
scanTex.colorSpace = THREE.SRGBColorSpace;

const SCAN_W = 512;
const SCAN_H = 384;
const offscreenScan = document.createElement('canvas');
offscreenScan.width = SCAN_W;
offscreenScan.height = SCAN_H;
const offCtx = offscreenScan.getContext('2d');
const scanImgData = offCtx.createImageData(SCAN_W, SCAN_H);

function sampleFieldBilinear(buf, u, v) {
  const uw = ((u % 1.0) + 1.0) % 1.0;
  const vw = ((v % 1.0) + 1.0) % 1.0;
  const fx = uw * (FIELD_SIZE - 1);
  const fy = vw * (FIELD_SIZE - 1);
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const x1 = (x0 + 1) % FIELD_SIZE;
  const y1 = (y0 + 1) % FIELD_SIZE;
  const tx = fx - x0;
  const ty = fy - y0;
  const v00 = buf[y0 * FIELD_SIZE + x0];
  const v10 = buf[y0 * FIELD_SIZE + x1];
  const v01 = buf[y1 * FIELD_SIZE + x0];
  const v11 = buf[y1 * FIELD_SIZE + x1];
  return (v00 * (1 - tx) + v10 * tx) * (1 - ty) + (v01 * (1 - tx) + v11 * tx) * ty;
}

function renderScanRows(startRow, rowCount) {
  const spec = SPECIMENS[state.specimenIdx] || SPECIMENS[0];
  const data = scanImgData.data;

  const zoom = Math.max(0.6, Math.log10(Math.max(100, state.magnification)) / 3.8);
  const panU = state.stageX / 80.0;
  const panV = state.stageY / 80.0;
  const rotRad = (state.stageRot * Math.PI) / 180.0;
  const cosR = Math.cos(rotRad);
  const sinR = Math.sin(rotRad);

  // Defocus & Astigmatism blur radii
  const defocusMm = Math.abs(state.wdMm - spec.optimalWdMm);
  const blurU = (defocusMm * 0.012 + Math.abs(state.stigX) * 0.0005) / zoom;
  const blurV = (defocusMm * 0.012 + Math.abs(state.stigY) * 0.0005) / zoom;

  const isCoated = state.coatedByStub[state.specimenIdx];
  const chargingActive = spec.dielectric && !isCoated && state.ehtKv > 2.5;
  const snrNoiseAmp = state.scanMode === 'SLOW' ? 4.0 : 12.0;
  const contrastFactor = state.contrast / 55.0;
  const brightOffset = (state.brightness - 50.0) * 2.2;

  const eps = 1.0 / FIELD_SIZE;

  for (let r = 0; r < rowCount; r++) {
    const py = (startRow + r) % SCAN_H;
    const ny = (py / SCAN_H - 0.5) / zoom;

    // Dielectric surface charging horizontal streak if sample is uncoated
    const chargeStreak =
      chargingActive && Math.sin(py * 0.37 + performance.now() * 0.004) > 0.68
        ? 95.0 * ((state.ehtKv - 2.0) / 15.0)
        : 0.0;

    for (let px = 0; px < SCAN_W; px++) {
      const nx = (px / SCAN_W - 0.5) / zoom;
      const u = 0.5 + nx * cosR - ny * sinR + panU;
      const v = 0.5 + nx * sinR + ny * cosR + panV;

      // 3-tap directional blur when out of focus or astigmatic
      const hCenter =
        0.5 * sampleFieldBilinear(heightBuffer, u, v) +
        0.25 * sampleFieldBilinear(heightBuffer, u + blurU, v + blurV) +
        0.25 * sampleFieldBilinear(heightBuffer, u - blurU, v - blurV);

      const dhdu = sampleFieldBilinear(heightBuffer, u + eps, v) - hCenter;
      const dhdv = sampleFieldBilinear(heightBuffer, u, v + eps) - hCenter;
      const gradMag = Math.hypot(dhdu, dhdv) * 18.0;
      const zVal = sampleFieldBilinear(zNumberBuffer, u, v);

      const noise = (Math.random() - 0.5) * snrNoiseAmp;
      const outIdx = (py * SCAN_W + px) * 4;

      if (state.detector === 'EDS_Silicon_Drift') {
        const uw = ((u % 1.0) + 1.0) % 1.0;
        const vw = ((v % 1.0) + 1.0) % 1.0;
        const eIdx =
          elemIndexBuffer[
            Math.floor(vw * (FIELD_SIZE - 1)) * FIELD_SIZE + Math.floor(uw * (FIELD_SIZE - 1))
          ] % spec.elements.length;
        const elemCol = spec.elements[eIdx].color;
        const cr = parseInt(elemCol.slice(1, 3), 16);
        const cg = parseInt(elemCol.slice(3, 5), 16);
        const cb = parseInt(elemCol.slice(5, 7), 16);
        const shade = Math.min(1.35, Math.max(0.22, 0.35 + hCenter * 0.68 + gradMag * 0.45));
        data[outIdx] = Math.min(255, Math.max(0, cr * shade + noise));
        data[outIdx + 1] = Math.min(255, Math.max(0, cg * shade + noise));
        data[outIdx + 2] = Math.min(255, Math.max(0, cb * shade + noise));
        data[outIdx + 3] = 255;
      } else {
        let baseSig = 0;
        if (state.detector === 'InLens_Secondary') {
          // Pure surface edge enhancement + high-Yield sec(theta)
          baseSig = 18.0 + Math.pow(Math.max(0, hCenter), 1.45) * 122.0 + Math.pow(gradMag, 0.82) * 135.0;
        } else if (state.detector === 'SE2_Everhart_Thornley') {
          // Directional shadowing toward +X collector cage
          const dirLight = dhdu * 26.0 - dhdv * 11.0;
          baseSig = 24.0 + hCenter * 108.0 + dirLight * 135.0 + gradMag * 92.0;
        } else {
          // 4-Quadrant BSE Atomic Number Z-Contrast
          const etaBse = Math.min(0.55, 0.014 * zVal);
          baseSig = 16.0 + etaBse * 335.0 + hCenter * 42.0;
        }
        const sig = 108.0 + (baseSig - 108.0) * contrastFactor + brightOffset;
        const gray = Math.min(255, Math.max(0, sig + chargeStreak + noise));
        data[outIdx] = gray;
        data[outIdx + 1] = gray;
        data[outIdx + 2] = gray;
        data[outIdx + 3] = 255;
      }
    }
  }
  offCtx.putImageData(scanImgData, 0, 0);
}

function renderLCDDisplay() {
  const isPowered = state.isPluggedIn && state.powerSwitch;

  // Hard Electrical Continuity Blackout (Gate 2 PWR-04 / DIAG-014)
  if (!isPowered) {
    lcdCtx.fillStyle = '#05070a';
    lcdCtx.fillRect(0, 0, lcdCanvas.width, lcdCanvas.height);
    scanTex.needsUpdate = true;
    return;
  }

  const spec = SPECIMENS[state.specimenIdx] || SPECIMENS[0];

  if (!state.beamOn || state.vacuumState !== 'UHV_READY') {
    lcdCtx.fillStyle = '#080c14';
    lcdCtx.fillRect(0, 0, 1024, 680);
    lcdCtx.fillStyle = '#38bdf8';
    lcdCtx.font = 'bold 26px "IBM Plex Mono", monospace';
    lcdCtx.textAlign = 'center';
    const msg =
      state.vacuumState !== 'UHV_READY'
        ? `CHAMBER ${state.vacuumState} (${state.chamberVacuumMbar.toExponential(2)} mbar) — EHT INTERLOCKED`
        : 'ELECTRON HIGH TENSION (EHT) STANDBY — PRESS [EHT ON] TO SCAN';
    lcdCtx.fillText(msg, 512, 330);
    lcdCtx.textAlign = 'left';
  } else {
    // Advance progressive raster scan rows if not frozen
    if (!state.frozen) {
      const rowsPerTick = state.scanMode === 'SLOW' ? 4 : 24;
      renderScanRows(state.scanRow, rowsPerTick);
      state.scanRow = (state.scanRow + rowsPerTick) % SCAN_H;
    }

    // Draw raster buffer scaled to 1024x680 micrograph region
    lcdCtx.drawImage(offscreenScan, 0, 0, 1024, 680);

    // Draw active horizontal raster scan line indicator
    if (!state.frozen) {
      const scanY = (state.scanRow / SCAN_H) * 680;
      lcdCtx.strokeStyle = 'rgba(0, 212, 232, 0.85)';
      lcdCtx.lineWidth = 2;
      lcdCtx.beginPath();
      lcdCtx.moveTo(0, scanY);
      lcdCtx.lineTo(1024, scanY);
      lcdCtx.stroke();
    }

    // Optional Line Profile Oscilloscope Trace Overlay
    if (state.scanMode === 'LINE') {
      lcdCtx.strokeStyle = '#3dd68c';
      lcdCtx.lineWidth = 2.5;
      lcdCtx.beginPath();
      const midY = Math.floor(SCAN_H / 2);
      for (let x = 0; x < SCAN_W; x++) {
        const val = scanImgData.data[(midY * SCAN_W + x) * 4];
        const gx = (x / SCAN_W) * 1024;
        const gy = 520 - (val / 255) * 260;
        if (x === 0) lcdCtx.moveTo(gx, gy);
        else lcdCtx.lineTo(gx, gy);
      }
      lcdCtx.stroke();
    }

    // Dielectric charging warning banner if uncoated
    if (spec.dielectric && !state.coatedByStub[state.specimenIdx] && state.ehtKv > 2.5) {
      lcdCtx.fillStyle = 'rgba(240, 68, 96, 0.85)';
      lcdCtx.fillRect(24, 20, 560, 34);
      lcdCtx.fillStyle = '#ffffff';
      lcdCtx.font = 'bold 15px "IBM Plex Mono", monospace';
      lcdCtx.fillText('⚠ DIELECTRIC SURFACE CHARGING — APPLY Au/Pd SPUTTER COATING', 36, 42);
    }
  }

  // Optional 2-Point Scale Caliper Measurement Overlay
  if (state.caliperActive && state.caliperPoints.length > 0) {
    const hfwUm = 120000 / Math.max(50, state.magnification);
    const [p1, p2] = state.caliperPoints;
    lcdCtx.save();
    lcdCtx.strokeStyle = '#facc15';
    lcdCtx.fillStyle = '#facc15';
    lcdCtx.lineWidth = 2.5;
    lcdCtx.beginPath();
    lcdCtx.arc(p1.x, p1.y, 6, 0, Math.PI * 2);
    lcdCtx.fill();
    if (p2) {
      lcdCtx.beginPath();
      lcdCtx.moveTo(p1.x, p1.y);
      lcdCtx.lineTo(p2.x, p2.y);
      lcdCtx.stroke();
      lcdCtx.beginPath();
      lcdCtx.arc(p2.x, p2.y, 6, 0, Math.PI * 2);
      lcdCtx.fill();
      const distPx = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const distUm = (distPx / 1024) * hfwUm;
      const lbl = distUm >= 1 ? `${distUm.toFixed(2)} µm` : `${(distUm * 1000).toFixed(1)} nm`;
      const mx = (p1.x + p2.x) * 0.5;
      const my = (p1.y + p2.y) * 0.5 - 12;
      lcdCtx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      lcdCtx.fillRect(mx - 58, my - 16, 116, 26);
      lcdCtx.fillStyle = '#facc15';
      lcdCtx.font = 'bold 15px "IBM Plex Mono", monospace';
      lcdCtx.textAlign = 'center';
      lcdCtx.fillText(lbl, mx, my + 2);
      lcdCtx.textAlign = 'left';
    }
    lcdCtx.restore();
  }

  // Authentic ZEISS SmartSEM Datazone Footer Bar (y: 680..768)
  lcdCtx.fillStyle = '#070a0f';
  lcdCtx.fillRect(0, 680, 1024, 88);
  lcdCtx.strokeStyle = '#38bdf8';
  lcdCtx.lineWidth = 2;
  lcdCtx.strokeRect(1, 681, 1022, 86);

  // Scale Bar calculation based on magnification (Horizontal Field Width = 120 mm / M)
  const hfwUm = (120000 / Math.max(50, state.magnification));
  const barUm = hfwUm > 50 ? 20 : hfwUm > 10 ? 2 : hfwUm > 2 ? 0.5 : 0.1;
  const barPx = Math.min(220, Math.max(48, (barUm / hfwUm) * 820));

  lcdCtx.fillStyle = '#ffffff';
  lcdCtx.fillRect(28, 712, barPx, 6);
  lcdCtx.fillRect(28, 706, 3, 18);
  lcdCtx.fillRect(28 + barPx - 3, 706, 3, 18);
  lcdCtx.font = 'bold 18px "IBM Plex Mono", monospace';
  lcdCtx.fillText(barUm >= 1 ? `${barUm} µm` : `${Math.round(barUm * 1000)} nm`, 28, 748);

  // Datazone Telemetry Columns
  lcdCtx.fillStyle = '#e6edf5';
  lcdCtx.font = 'bold 16px "IBM Plex Mono", monospace';
  lcdCtx.fillText(`EHT = ${state.ehtKv.toFixed(2)} kV`, 270, 714);
  lcdCtx.fillText(`WD = ${state.wdMm.toFixed(2)} mm`, 270, 746);

  lcdCtx.fillText(`Mag = ${state.magnification.toLocaleString()} X`, 480, 714);
  lcdCtx.fillStyle = '#00d4e8';
  lcdCtx.fillText(`Signal A = ${state.detector.replace('_', ' ')}`, 480, 746);

  lcdCtx.fillStyle = '#94a3b8';
  lcdCtx.font = '14px "IBM Plex Mono", monospace';
  lcdCtx.fillText(`Specimen: ${spec.id.toUpperCase()}`, 760, 714);
  lcdCtx.fillStyle = '#38bdf8';
  lcdCtx.font = 'bold 18px "Inter", sans-serif';
  lcdCtx.fillText('ZEISS GeminiSEM', 760, 748);

  scanTex.needsUpdate = true;
}

// ============================================================================
// 6. Three.js Scene, Lighting & Camera Setup
// ============================================================================
const viewportEl = document.getElementById('viewport3d');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0c1016);

const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 250);
camera.position.set(-16.0, 14.5, -27.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
viewportEl.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.target.set(0.0, 9.3, 0.0);
controls.maxPolarAngle = Math.PI * 0.495;
controls.minDistance = 3.0;
controls.maxDistance = 48.0;

// Calibrated 3-Point Studio & VC-E Suite Lighting
const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.85);
scene.add(hemiLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.55);
keyLight.position.set(12, 26, -16);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.65);
fillLight.position.set(-16, 14, -12);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
rimLight.position.set(0, 18, 16);
scene.add(rimLight);

// Build 1:1 ZEISS GeminiSEM 500 + Dedicated VC-E Electron Microscopy Suite
const semModel = buildSEMModel(scanTex, { includeLab: true });
scene.add(semModel.root);

// Standardized Camera Presets (Gate 7 Visual QA + Stage 7A-7D Internal Shots)
const CAMERA_PRESETS = {
  CAM_ISO: { pos: [-16.0, 14.5, -27.5], target: [0.0, 9.3, 0.0] },
  CAM_FRONT: { pos: [0.0, 10.2, -31.5], target: [0.0, 9.3, 0.0] },
  CAM_SIDE: { pos: [-27.8, 9.6, 0.0], target: [-4.15, 9.5, 0.0] },
  CAM_TOP: { pos: [0.0, 29.5, -1.5], target: [0.0, 8.5, 0.0] },
  CAM_CONSOLE: { pos: [4.5, 11.4, -6.8], target: [4.5, 8.8, 0.2] },
  CAM_CHAMBER: { pos: [-6.2, 10.8, -6.8], target: [-4.15, 9.5, -0.2] },
  CAM_COLUMN: { pos: [-6.8, 16.5, -7.2], target: [-4.15, 14.8, -0.2] },
  CAM_EXPLODED: { pos: [-17.0, 16.2, -30.5], target: [-0.5, 10.4, 0.0] },
  STAGE7_POWER_ROUTING: { pos: [-7.5, 5.2, -6.8], target: [-3.5, 3.4, 2.2] },
  STAGE7_MOTORS_ACTUATORS: { pos: [-5.8, 4.8, -6.4], target: [-4.2, 3.6, 0.6] },
  STAGE7_SENSORS_OPTICS: { pos: [-6.2, 12.2, -5.8], target: [-4.15, 11.2, -0.2] },
  STAGE7_DATA_COMMS: { pos: [-2.2, 5.4, -6.2], target: [-2.15, 4.2, -1.2] },
};

function setCameraPreset(presetName) {
  const p = CAMERA_PRESETS[presetName] || CAMERA_PRESETS.CAM_ISO;
  const targetFov = presetName === 'CAM_SIDE' ? 46 : 38;
  if (camera.fov !== targetFov) {
    camera.fov = targetFov;
    camera.updateProjectionMatrix();
  }
  camera.position.set(p.pos[0], p.pos[1], p.pos[2]);
  controls.target.set(p.target[0], p.target[1], p.target[2]);
  controls.update();
  document.querySelectorAll('[data-cam-preset]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.camPreset === presetName);
  });
  renderer.render(scene, camera);
}

// ============================================================================
// 7. UI Synchronization, Filmstrip Capture & GLP Analytical CSV Export
// ============================================================================
function syncUIToState() {
  const isPowered = state.isPluggedIn && state.powerSwitch;
  const spec = SPECIMENS[state.specimenIdx] || SPECIMENS[0];

  // Topbar Pills
  const pillVac = document.getElementById('pillVacState');
  const pillEht = document.getElementById('pillEhtState');
  const btnPlug = document.getElementById('btnPowerPlug');

  if (!isPowered) {
    pillVac.textContent = 'SYSTEM UNPOWERED · 0 V';
    pillVac.className = 'pill fault';
    pillEht.textContent = 'EHT: OFF (0.00 kV)';
  } else {
    pillVac.textContent = `${state.vacuumState.replace('_', ' ')} · ${state.chamberVacuumMbar.toExponential(1)} mbar`;
    pillVac.className = state.vacuumState === 'UHV_READY' ? 'pill run' : 'pill open';
    pillEht.textContent = state.beamOn ? `EHT: ${state.ehtKv.toFixed(2)} kV` : 'EHT: STANDBY';
  }

  btnPlug.textContent = state.isPluggedIn ? '⚡ CORD PLUGGED IN' : '🔌 CORD UNPLUGGED';
  btnPlug.className = state.isPluggedIn ? 'pill run' : 'pill fault';

  // Optics Sliders & Readouts
  document.getElementById('valMag').textContent = `${state.magnification.toLocaleString()} ×`;
  document.getElementById('valEht').textContent = `${state.ehtKv.toFixed(2)} kV`;
  const valProbeAp = document.getElementById('valProbeAp');
  if (valProbeAp) valProbeAp.textContent = `${state.probeCurrentPa} pA · ${state.apertureUm} µm`;
  document.getElementById('valWd').textContent = `${state.wdMm.toFixed(2)} mm`;
  document.getElementById('valStig').textContent = `${state.stigX.toFixed(0)}% / ${state.stigY.toFixed(0)}%`;
  document.getElementById('valBC').textContent = `B: ${state.brightness}% · C: ${state.contrast}%`;

  // Resolution & Mean Free Path Telemetry
  const defocusMm = Math.abs(state.wdMm - spec.optimalWdMm) + Math.abs(state.focusFine - 50) * 0.005;
  const resNm = (0.8 / Math.sqrt(Math.max(0.5, state.ehtKv / 15.0)) + defocusMm * 1.4).toFixed(2);
  const mfpMeters = (6.8e-5 / Math.max(1e-10, state.chamberVacuumMbar)).toFixed(1);
  document.getElementById('hudResolution').textContent = `Res: ${resNm} nm`;
  document.getElementById('hudMeanFreePath').textContent = `MFP: ${mfpMeters} m`;
  document.getElementById('hudScanLine').textContent = state.frozen
    ? 'Scan: FROZEN'
    : `Scan: ${state.scanMode === 'SLOW' ? 'PHOTO 1024px' : state.scanMode === 'LINE' ? 'LINE PROFILE' : 'TV 512px'}`;

  // ChemMate Plate Live Equations & Legend
  const eqEht = document.getElementById('cm-eq-eht');
  const eqLam = document.getElementById('cm-eq-lambda');
  const eqMag = document.getElementById('cm-eq-mag');
  const eqHfw = document.getElementById('cm-eq-hfw');
  if (eqEht) {
    const vVolt = Math.max(20, state.ehtKv * 1000);
    const lambdaPm = (1.2264e3 / Math.sqrt(vVolt * (1 + 9.784e-7 * vVolt))).toFixed(2);
    const hfwUm = 120000 / Math.max(50, state.magnification);
    eqEht.textContent = `${state.ehtKv.toFixed(2)} kV`;
    if (eqLam) eqLam.textContent = `λe = ${lambdaPm} pm`;
    if (eqMag) eqMag.textContent = `${state.magnification.toLocaleString()} ×`;
    if (eqHfw) eqHfw.textContent = hfwUm >= 1 ? `HFW ${hfwUm.toFixed(2)} µm` : `HFW ${(hfwUm * 1000).toFixed(0)} nm`;
  }
  const legTitle = document.getElementById('cm-legend-title');
  const legItems = document.getElementById('cm-legend-items');
  if (legTitle && legItems) {
    legTitle.textContent = `EDS Composition (${spec.id.toUpperCase()})`;
    legItems.innerHTML = spec.elements
      .map(
        e =>
          `<div class="cm-legend-item"><span class="cm-legend-dot" style="background:${e.color};"></span><span>${e.symbol} ${e.line} (${e.keV} keV · ${e.wtPct}%)</span></div>`
      )
      .join('');
  }

  // Detector buttons
  document.querySelectorAll('.sem-det-btn').forEach(b => {
    b.classList.toggle('is-active', b.dataset.detector === state.detector);
  });

  // Specimen Carousel cards
  document.querySelectorAll('.sem-stub-card').forEach((card, idx) => {
    card.classList.toggle('is-active', idx === state.specimenIdx);
  });
  document.getElementById('specimenDesc').textContent = spec.desc;

  const isCoated = state.coatedByStub[state.specimenIdx];
  const btnCoat = document.getElementById('btnSputterCoat');
  btnCoat.textContent = isCoated ? '✨ Au/Pd Coat: ON (5 nm)' : '⚠ Au/Pd Coat: OFF (Raw)';

  const btnVent = document.getElementById('btnVentPump');
  btnVent.textContent = state.vacuumState === 'VENTED' ? '🚀 Pump Down to UHV' : '🌀 Vent Chamber (N₂)';

  const btnDoor = document.getElementById('btnChamberDoor');
  btnDoor.textContent = state.doorOpen ? '🔒 Close Chamber Door' : '🚪 Open Chamber Door';

  document.getElementById('lblChamberPressure').textContent = `${state.chamberVacuumMbar.toExponential(2)} mbar`;
  document.getElementById('lab-status').textContent = !isPowered
    ? 'System Unpowered — Plug in NEMA 5-15P cord & enable Power'
    : `${state.vacuumState} · Door ${state.doorOpen ? 'OPEN' : 'SEALED'} · ${isCoated ? 'Au/Pd Grounded' : 'Uncoated Dielectric'}`;

  // Stage readouts
  document.getElementById('valStageX').textContent = `${state.stageX.toFixed(1)} mm`;
  document.getElementById('valStageY').textContent = `${state.stageY.toFixed(1)} mm`;
  document.getElementById('valStageTilt').textContent = `${state.stageTilt.toFixed(0)}°`;
  document.getElementById('valStageRot').textContent = `${state.stageRot.toFixed(0)}°`;

  // Sync 3D model state
  if (typeof semModel.setPowerState === 'function') {
    semModel.setPowerState(state.isPluggedIn, state.powerSwitch);
  } else {
    semModel.setPluggedIn(state.isPluggedIn);
  }
  semModel.setDoorOpen(state.doorOpen ? 1.0 : 0.0);
  semModel.setBeamActive(isPowered && state.beamOn && state.vacuumState === 'UHV_READY', state.ehtKv);
  semModel.setStagePosition({
    x: state.stageX,
    y: state.stageY,
    z: state.wdMm,
    tilt: state.stageTilt,
    rot: state.stageRot,
    specimenIndex: state.specimenIdx,
    coatedByStub: state.coatedByStub,
  });
  semModel.updateChamberScopeCanvas({
    isPluggedIn: state.isPluggedIn,
    powerSwitch: state.powerSwitch,
    beamOn: isPowered && state.beamOn && state.vacuumState === 'UHV_READY',
    wdMm: state.wdMm,
    ehtKv: state.ehtKv,
    chamberVacuumMbar: state.chamberVacuumMbar,
    stageX: state.stageX,
    stageY: state.stageY,
    stageTilt: state.stageTilt,
    sputterCoated: isCoated,
    edsPeaks: spec.elements.map(e => ({ keV: e.keV, el: e.symbol, cps: e.wtPct * 24 + 180 })),
  });
}

function captureCurrentScanToFilmstrip() {
  if (!state.isPluggedIn || !state.powerSwitch) return;
  const prevMode = state.scanMode;
  state.scanMode = 'SLOW';
  renderScanRows(0, SCAN_H);
  renderLCDDisplay();
  state.scanMode = prevMode;

  const spec = SPECIMENS[state.specimenIdx] || SPECIMENS[0];
  const dataUrl = lcdCanvas.toDataURL('image/png');
  const timestamp = new Date().toLocaleTimeString([], { hour12: false });

  state.capturedScans.unshift({
    id: `SCAN_${state.capturedScans.length + 1}`,
    specimen: spec.shortTitle,
    detector: state.detector,
    mag: state.magnification,
    ehtKv: state.ehtKv,
    wdMm: state.wdMm,
    timestamp,
    dataUrl,
  });

  const gallery = document.getElementById('filmstripGallery');
  gallery.innerHTML = '';
  state.capturedScans.slice(0, 8).forEach(scan => {
    const card = document.createElement('div');
    card.className = 'sem-film-item';
    card.innerHTML = `
      <img src="${scan.dataUrl}" alt="${scan.specimen}" />
      <div class="sem-film-caption">
        <span>${scan.specimen.split('.')[1] || scan.specimen}</span>
        <span>${(scan.mag / 1000).toFixed(1)}k×</span>
      </div>
    `;
    card.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = scan.dataUrl;
      a.download = `ZEISS_GeminiSEM500_${scan.id}.png`;
      a.click();
    });
    gallery.appendChild(card);
  });
  document.getElementById('lblFilmstripCount').textContent = `${state.capturedScans.length} Scans`;
}

function downloadMicrographPNG() {
  captureCurrentScanToFilmstrip();
  if (state.capturedScans.length === 0) return;
  const latest = state.capturedScans[0];
  const a = document.createElement('a');
  a.href = latest.dataUrl;
  a.download = `ZEISS_GeminiSEM500_${SPECIMENS[state.specimenIdx].id}_${state.magnification}x.png`;
  a.click();
}

function exportAnalyticalGLPCsv() {
  const spec = SPECIMENS[state.specimenIdx] || SPECIMENS[0];
  const rows = [
    ['Instrument_Model', 'ZEISS GeminiSEM 500 FE-SEM'],
    ['Compliance_Standard', '21 CFR Part 11 / GLP Analytical Telemetry'],
    ['Timestamp_ISO', new Date().toISOString()],
    ['Specimen_ID', spec.id],
    ['Specimen_Title', spec.title],
    ['Sputter_Coating_5nm_AuPd', state.coatedByStub[state.specimenIdx] ? 'YES' : 'NO'],
    ['Detector_Channel', state.detector],
    ['Accelerating_Voltage_EHT_kV', state.ehtKv.toFixed(2)],
    ['Magnification_X', state.magnification],
    ['Working_Distance_WD_mm', state.wdMm.toFixed(2)],
    ['Chamber_Vacuum_mbar', state.chamberVacuumMbar.toExponential(3)],
    ['FEG_Gun_Vacuum_mbar', state.gunVacuumMbar.toExponential(3)],
    ['Stage_X_mm', state.stageX.toFixed(2)],
    ['Stage_Y_mm', state.stageY.toFixed(2)],
    ['Stage_Tilt_deg', state.stageTilt.toFixed(1)],
    ['Stage_Rotation_deg', state.stageRot.toFixed(1)],
    [],
    ['EDS_Element', 'XRay_Line', 'Energy_keV', 'Weight_Percent', 'Atomic_Percent'],
    ...spec.elements.map(e => [e.symbol, e.line, e.keV, e.wtPct, e.atPct]),
  ];
  const csvContent = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ZEISS_GeminiSEM500_GLP_EDS_${spec.id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================================
// 8. Populate Specimen Carousel & Part Explorer Lists
// ============================================================================
function initSpecimenCarouselAndParts() {
  const carouselEl = document.getElementById('specimenCarouselGrid');
  carouselEl.innerHTML = '';
  SPECIMENS.forEach((spec, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `sem-stub-card ${idx === state.specimenIdx ? 'is-active' : ''}`;
    btn.innerHTML = `
      <span class="stub-idx">STUB #0${idx + 1} · WD ${spec.optimalWdMm.toFixed(1)}mm</span>
      <span class="stub-title">${spec.shortTitle}</span>
      <span class="stub-meta">Optimal EHT: ${spec.optimalEhtKv.toFixed(1)} kV</span>
    `;
    btn.addEventListener('click', () => {
      sfx.playClick();
      state.specimenIdx = idx;
      state.wdMm = spec.optimalWdMm;
      state.ehtKv = spec.optimalEhtKv;
      state.magnification = spec.defaultMag;
      document.getElementById('sliderWd').value = String(state.wdMm);
      document.getElementById('sliderEht').value = String(state.ehtKv);
      document.getElementById('sliderMag').value = String(state.magnification);
      rebuildSpecimenField(idx);
      renderScanRows(0, SCAN_H);
      syncUIToState();
    });
    carouselEl.appendChild(btn);
  });

  // Part Explorer
  const partsListEl = document.getElementById('parts-list');
  const catalog = semModel.getPartCatalog();
  partsListEl.innerHTML = '';
  catalog.forEach(part => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'part-item';
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; width:100%;">
        <strong>${part.label}</strong>
        <span class="muted" style="font-size:0.68rem;">${part.category}</span>
      </div>
      <div class="hint" style="margin-top:3px; text-align:left;">${part.desc}</div>
    `;
    item.addEventListener('click', () => {
      sfx.playClick();
      semModel.setExplorerFocus(part.id);
      document.getElementById('parts-focus-status').textContent = `Isolated: ${part.label}`;
    });
    partsListEl.appendChild(item);
  });

  document.getElementById('btn-parts-clear').addEventListener('click', () => {
    sfx.playClick();
    semModel.setExplorerFocus('ALL');
    document.getElementById('parts-focus-status').textContent = 'Showing complete instrument (10 subsystems)';
  });
}

// ============================================================================
// 9. Interactive Event Listeners (Web Controls + 3D Raycast Knobs/Buttons)
// ============================================================================
function bindEvents() {
  // ChemMate Brand Dropdown
  const brandBtn = document.getElementById('cm-brand-menu-btn');
  const brandMenu = document.getElementById('cm-brand-dropdown');
  if (brandBtn && brandMenu) {
    brandBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = brandMenu.classList.toggle('is-open');
      brandBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', () => brandMenu.classList.remove('is-open'));
  }

  // Collapsible Panels
  document.querySelectorAll('.panel-collapse-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.panel-collapsible');
      if (!panel) return;
      const collapsed = panel.classList.toggle('is-collapsed');
      btn.setAttribute('aria-expanded', String(!collapsed));
      setTimeout(onResize, 60);
    });
  });

  // View Theme Switcher (Modern / Retro / Night) & ChemMate Stage Controls
  document.getElementById('btn-view-modern')?.addEventListener('click', () => setTheme('modern'));
  document.getElementById('btn-view-retro')?.addEventListener('click', () => setTheme('retro'));
  document.getElementById('btn-view-night')?.addEventListener('click', () => setTheme('night'));
  document.getElementById('btn-cm-plate')?.addEventListener('click', () => setStageBackdrop('plate'));
  document.getElementById('btn-cm-bench')?.addEventListener('click', () => setStageBackdrop('bench'));
  document.getElementById('btn-cm-callouts')?.addEventListener('click', () => setCallouts(!state.calloutsVisible));

  // Hide Panels toggle
  document.getElementById('btn-hide-panels')?.addEventListener('click', e => {
    const anyVisible = Array.from(document.querySelectorAll('.panel-collapsible')).some(p => p.style.display !== 'none');
    setPanelsHidden(anyVisible);
    e.currentTarget.classList.toggle('active', anyVisible);
  });

  // Topbar Mains Plug Continuity Toggle (Gate 2 PWR-04)
  document.getElementById('btnPowerPlug').addEventListener('click', () => {
    state.isPluggedIn = !state.isPluggedIn;
    sfx.playSwitchSnap();
    sfx.updateContinuousAudio({
      isPowered: state.isPluggedIn && state.powerSwitch,
      turboRpmRatio: state.isPluggedIn && state.powerSwitch ? 1.0 : 0.0,
      scrollActive: state.isPluggedIn && state.powerSwitch,
      beamActive: state.isPluggedIn && state.powerSwitch && state.beamOn,
    });
    syncUIToState();
    renderLCDDisplay();
  });

  // Camera Presets
  document.querySelectorAll('[data-cam-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      setCameraPreset(btn.dataset.camPreset);
    });
  });

  // Explode, Cutaway, Wireframe, Reset, Auto-rotate
  document.getElementById('btn-explode').addEventListener('click', e => {
    state.exploded = state.exploded > 0.1 ? 0.0 : 0.85;
    e.currentTarget.classList.toggle('active', state.exploded > 0.1);
    semModel.setExplodeAmount(state.exploded);
    if (state.exploded > 0.1) setCameraPreset('CAM_EXPLODED');
  });

  document.getElementById('btn-cutaway').addEventListener('click', e => {
    state.cutaway = !state.cutaway;
    e.currentTarget.classList.toggle('active', state.cutaway);
    semModel.setCutawayMode(state.cutaway);
  });

  document.getElementById('btn-wireframe').addEventListener('click', e => {
    state.wireframe = !state.wireframe;
    e.currentTarget.classList.toggle('active', state.wireframe);
    semModel.setWireframe(state.wireframe);
  });

  document.getElementById('btn-view-reset').addEventListener('click', () => {
    state.exploded = 0;
    state.cutaway = false;
    state.wireframe = false;
    semModel.setExplodeAmount(0);
    semModel.setCutawayMode(false);
    semModel.setWireframe(false);
    document.getElementById('btn-explode').classList.remove('active');
    document.getElementById('btn-cutaway').classList.remove('active');
    document.getElementById('btn-wireframe').classList.remove('active');
    setCameraPreset('CAM_ISO');
  });

  document.getElementById('btn-auto-rotate').addEventListener('click', e => {
    state.autoRotate = !state.autoRotate;
    e.currentTarget.classList.toggle('active', state.autoRotate);
    controls.autoRotate = state.autoRotate;
  });

  document.getElementById('orbit-speed').addEventListener('input', e => {
    state.orbitSpeed = parseFloat(e.target.value);
    controls.autoRotateSpeed = state.orbitSpeed * 2.0;
    document.getElementById('orbit-speed-val').textContent = `${state.orbitSpeed.toFixed(1)}×`;
  });

  document.getElementById('camera-zoom').addEventListener('input', e => {
    const pct = parseFloat(e.target.value);
    document.getElementById('camera-zoom-val').textContent = `${Math.round(pct)}%`;
    const dist = 34.0 - (pct / 100.0) * 26.0;
    const dir = camera.position.clone().sub(controls.target).normalize();
    camera.position.copy(controls.target).addScaledVector(dir, dist);
  });

  document.getElementById('lab-light').addEventListener('input', e => {
    state.lightMult = parseFloat(e.target.value);
    document.getElementById('lab-light-val').textContent = `${state.lightMult.toFixed(1)}×`;
    applyLabLighting();
  });

  document.getElementById('lab-light-mood')?.addEventListener('change', e => {
    state.lightMood = e.target.value;
    applyLabLighting();
  });

  // Detector Selection
  document.querySelectorAll('.sem-det-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      state.detector = btn.dataset.detector;
      renderScanRows(0, SCAN_H);
      syncUIToState();
    });
  });

  // Electron Optics Sliders (Clockwise knob increase: negative rotation.y)
  document.getElementById('sliderMag').addEventListener('input', e => {
    state.magnification = parseInt(e.target.value, 10);
    if (semModel.knobMeshes.Knob_Magnification) {
      semModel.knobMeshes.Knob_Magnification.rotation.y = -(state.magnification / 50000) * Math.PI;
    }
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('sliderEht').addEventListener('input', e => {
    state.ehtKv = parseFloat(e.target.value);
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('sliderProbeCurrent')?.addEventListener('input', e => {
    state.probeCurrentPa = parseInt(e.target.value, 10);
    if (semModel.knobMeshes.Knob_ProbeCurrent) {
      semModel.knobMeshes.Knob_ProbeCurrent.rotation.y = -(state.probeCurrentPa / 5000) * Math.PI;
    }
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('selAperture')?.addEventListener('change', e => {
    state.apertureUm = parseInt(e.target.value, 10);
    sfx.playClick();
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('sliderWd').addEventListener('input', e => {
    state.wdMm = parseFloat(e.target.value);
    if (semModel.knobMeshes.Knob_FocusCoarse) {
      semModel.knobMeshes.Knob_FocusCoarse.rotation.y = -(state.wdMm - 8.5) * 0.6;
    }
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('sliderFocusFine')?.addEventListener('input', e => {
    state.focusFine = parseInt(e.target.value, 10);
    if (semModel.knobMeshes.Knob_FocusFine) {
      semModel.knobMeshes.Knob_FocusFine.rotation.y = -(state.focusFine - 50) * 0.05;
    }
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('sliderStigX').addEventListener('input', e => {
    state.stigX = parseFloat(e.target.value);
    if (semModel.knobMeshes.Knob_StigmatorX) {
      semModel.knobMeshes.Knob_StigmatorX.rotation.y = -state.stigX * 0.05;
    }
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('sliderStigY').addEventListener('input', e => {
    state.stigY = parseFloat(e.target.value);
    if (semModel.knobMeshes.Knob_StigmatorY) {
      semModel.knobMeshes.Knob_StigmatorY.rotation.y = -state.stigY * 0.05;
    }
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('sliderBrightness').addEventListener('input', e => {
    state.brightness = parseInt(e.target.value, 10);
    if (semModel.knobMeshes.Knob_Brightness) {
      semModel.knobMeshes.Knob_Brightness.rotation.y = -(state.brightness - 50) * 0.05;
    }
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('sliderContrast').addEventListener('input', e => {
    state.contrast = parseInt(e.target.value, 10);
    if (semModel.knobMeshes.Knob_Contrast) {
      semModel.knobMeshes.Knob_Contrast.rotation.y = -(state.contrast - 68) * 0.05;
    }
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  // Console Pushbuttons
  document.getElementById('btnConsolePower').addEventListener('click', () => {
    state.powerSwitch = !state.powerSwitch;
    sfx.playSwitchSnap();
    syncUIToState();
    renderLCDDisplay();
  });

  document.getElementById('btnToggleEht').addEventListener('click', () => {
    if (!state.isPluggedIn || !state.powerSwitch || state.vacuumState !== 'UHV_READY') {
      sfx.playInterlockBuzz();
      return;
    }
    state.beamOn = !state.beamOn;
    if (state.beamOn) sfx.playEhtChime();
    else sfx.playClick();
    document.getElementById('lblToggleEht').textContent = state.beamOn ? 'EHT ON' : 'EHT OFF';
    syncUIToState();
  });

  document.getElementById('btnAutoFocus').addEventListener('click', () => {
    const spec = SPECIMENS[state.specimenIdx] || SPECIMENS[0];
    state.wdMm = spec.optimalWdMm;
    state.focusFine = 50;
    state.stigX = 0;
    state.stigY = 0;
    document.getElementById('sliderWd').value = String(state.wdMm);
    const ff = document.getElementById('sliderFocusFine');
    if (ff) ff.value = '50';
    document.getElementById('sliderStigX').value = '0';
    document.getElementById('sliderStigY').value = '0';
    sfx.playEhtChime();
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('btnAutoBC').addEventListener('click', () => {
    state.brightness = 52;
    state.contrast = 70;
    document.getElementById('sliderBrightness').value = '52';
    document.getElementById('sliderContrast').value = '70';
    sfx.playClick();
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('btnScanSpeed').addEventListener('click', () => {
    const modes = ['FAST', 'SLOW', 'LINE'];
    state.scanMode = modes[(modes.indexOf(state.scanMode) + 1) % modes.length];
    document.getElementById('lblScanSpeed').textContent =
      state.scanMode === 'SLOW' ? 'SLOW PHOTO' : state.scanMode === 'LINE' ? 'LINE PROF' : 'FAST SCAN';
    sfx.playClick();
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('btnFreezeScan').addEventListener('click', () => {
    state.frozen = !state.frozen;
    document.getElementById('lblFreezeScan').textContent = state.frozen ? 'UNFREEZE' : 'FREEZE';
    sfx.playClick();
    syncUIToState();
  });

  document.getElementById('btnPhotoScan').addEventListener('click', () => {
    sfx.playEhtChime();
    captureCurrentScanToFilmstrip();
  });

  document.getElementById('btnSavePng').addEventListener('click', () => {
    sfx.playClick();
    downloadMicrographPNG();
  });

  document.getElementById('btnExportCsv').addEventListener('click', () => {
    sfx.playClick();
    exportAnalyticalGLPCsv();
  });

  document.getElementById('btnToggleMute').addEventListener('click', () => {
    const muted = sfx.toggleMute();
    document.getElementById('glyphMute').textContent = muted ? '🔇' : '🔊';
    document.getElementById('lblMute').textContent = muted ? 'Muted' : 'Audio ON';
  });

  // 2-Point Scale Caliper on Live Micrograph Canvas
  document.getElementById('btnScaleCaliper')?.addEventListener('click', e => {
    state.caliperActive = !state.caliperActive;
    state.caliperPoints = [];
    const lbl = document.getElementById('lblCaliper');
    if (lbl) lbl.textContent = state.caliperActive ? '2-Pt Scale Caliper: ON (Click LCD)' : '2-Pt Scale Caliper: OFF';
    e.currentTarget.classList.toggle('is-active', state.caliperActive);
    sfx.playClick();
    renderLCDDisplay();
  });

  lcdCanvas.addEventListener('pointerdown', ev => {
    if (!state.caliperActive) return;
    const rect = lcdCanvas.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * lcdCanvas.width;
    const y = ((ev.clientY - rect.top) / rect.height) * lcdCanvas.height;
    if (y >= 680) return;
    if (state.caliperPoints.length >= 2) state.caliperPoints = [];
    state.caliperPoints.push({ x, y });
    sfx.playClick();
    renderLCDDisplay();
  });

  // Specimen Prep & Vacuum Interlock Controls
  document.getElementById('btnSputterCoat').addEventListener('click', () => {
    state.coatedByStub[state.specimenIdx] = !state.coatedByStub[state.specimenIdx];
    sfx.playClick();
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  document.getElementById('btnVentPump').addEventListener('click', () => {
    if (!state.isPluggedIn || !state.powerSwitch) {
      sfx.playInterlockBuzz();
      return;
    }
    sfx.playValveThud();
    if (state.vacuumState === 'VENTED') {
      state.doorOpen = false;
      state.vacuumState = 'UHV_READY';
      state.chamberVacuumMbar = 1.4e-6;
      state.beamOn = true;
    } else {
      state.beamOn = false;
      state.vacuumState = 'VENTED';
      state.chamberVacuumMbar = 1013.25;
    }
    syncUIToState();
  });

  document.getElementById('btnChamberDoor').addEventListener('click', () => {
    if (!state.doorOpen && state.chamberVacuumMbar < 950.0) {
      sfx.playInterlockBuzz();
      document.getElementById('lab-status').textContent =
        'INTERLOCK: Cannot open chamber door under vacuum — Vent Chamber (N₂) first!';
      return;
    }
    state.doorOpen = !state.doorOpen;
    sfx.playValveThud();
    syncUIToState();
  });

  document.getElementById('btnCenterStage').addEventListener('click', () => {
    const spec = SPECIMENS[state.specimenIdx] || SPECIMENS[0];
    state.stageX = 0;
    state.stageY = 0;
    state.stageTilt = 0;
    state.stageRot = 0;
    state.wdMm = spec.optimalWdMm;
    document.getElementById('sliderStageX').value = '0';
    document.getElementById('sliderStageY').value = '0';
    document.getElementById('sliderStageTilt').value = '0';
    document.getElementById('sliderStageRot').value = '0';
    document.getElementById('sliderWd').value = String(state.wdMm);
    sfx.playClick();
    renderScanRows(0, SCAN_H);
    syncUIToState();
  });

  // 5-Axis Stage Sliders
  ['StageX', 'StageY', 'StageTilt', 'StageRot'].forEach(axis => {
    document.getElementById(`slider${axis}`).addEventListener('input', e => {
      const val = parseFloat(e.target.value);
      if (axis === 'StageX') state.stageX = val;
      if (axis === 'StageY') state.stageY = val;
      if (axis === 'StageTilt') state.stageTilt = val;
      if (axis === 'StageRot') state.stageRot = val;
      renderScanRows(0, SCAN_H);
      syncUIToState();
    });
  });

  // Guided Tour Button
  document.getElementById('btnGuidedTour').addEventListener('click', () => {
    if (state.tourActive) stopGuidedTour();
    else startGuidedTour();
  });

  // 3D Viewport Raycasting for All 8 Rotary Knobs, All 8 Buttons, StageBreak, Plug & Doors
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  renderer.domElement.addEventListener('pointerdown', ev => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(semModel.getRaycastTargets(), true);
    if (hits.length > 0) {
      let node = hits[0].object;
      while (node && !node.userData.controlId && node.parent) {
        if (
          node.name === 'Power_Plug_NEMA' ||
          node.name === 'Body_Power_Plug_NEMA' ||
          node.name === 'Pivot_DoorChamber' ||
          node.name === 'Pivot_DoorServiceBay'
        ) break;
        node = node.parent;
      }
      if (!node) return;
      if (node.name === 'Power_Plug_NEMA' || node.name === 'Body_Power_Plug_NEMA') {
        document.getElementById('btnPowerPlug').click();
      } else if (node.name === 'Pivot_DoorChamber') {
        document.getElementById('btnChamberDoor').click();
      } else if (node.name === 'Pivot_DoorServiceBay') {
        document.getElementById('btn-cutaway').click();
      } else if (node.userData.interactiveType === 'button') {
        // Tactile 0.9 mm depress animation
        const baseY = node.position.y;
        node.position.y = baseY - 0.012;
        setTimeout(() => { node.position.y = baseY; }, 120);
        const cid = node.userData.controlId;
        if (cid === 'Btn_Power') document.getElementById('btnConsolePower').click();
        else if (cid === 'Btn_EHT') document.getElementById('btnToggleEht').click();
        else if (cid === 'Btn_VacVent') document.getElementById('btnVentPump').click();
        else if (cid === 'Btn_AutoFocus') document.getElementById('btnAutoFocus').click();
        else if (cid === 'Btn_AutoBC') document.getElementById('btnAutoBC').click();
        else if (cid === 'Btn_ScanSpeed') document.getElementById('btnScanSpeed').click();
        else if (cid === 'Btn_Freeze') document.getElementById('btnFreezeScan').click();
        else if (cid === 'Btn_Record') document.getElementById('btnPhotoScan').click();
        else if (cid === 'Btn_StageBreak') {
          state.beamOn = false;
          state.frozen = true;
          sfx.playInterlockBuzz();
          syncUIToState();
        }
      } else if (node.userData.interactiveType === 'knob') {
        const cid = node.userData.controlId;
        sfx.playClick();
        if (cid === 'Knob_Magnification') {
          const el = document.getElementById('sliderMag');
          el.value = String(Math.min(300000, state.magnification + 2500));
          el.dispatchEvent(new Event('input'));
        } else if (cid === 'Knob_FocusCoarse') {
          const el = document.getElementById('sliderWd');
          el.value = String(Math.min(40, state.wdMm + 0.25));
          el.dispatchEvent(new Event('input'));
        } else if (cid === 'Knob_FocusFine') {
          const el = document.getElementById('sliderFocusFine');
          if (el) { el.value = String((state.focusFine + 5) % 100); el.dispatchEvent(new Event('input')); }
        } else if (cid === 'Knob_ProbeCurrent') {
          const el = document.getElementById('sliderProbeCurrent');
          if (el) { el.value = String(Math.min(20000, state.probeCurrentPa + 200)); el.dispatchEvent(new Event('input')); }
        } else if (cid === 'Knob_StigmatorX') {
          const el = document.getElementById('sliderStigX');
          el.value = String(state.stigX >= 45 ? -45 : state.stigX + 5);
          el.dispatchEvent(new Event('input'));
        } else if (cid === 'Knob_StigmatorY') {
          const el = document.getElementById('sliderStigY');
          el.value = String(state.stigY >= 45 ? -45 : state.stigY + 5);
          el.dispatchEvent(new Event('input'));
        } else if (cid === 'Knob_Brightness') {
          const el = document.getElementById('sliderBrightness');
          el.value = String(state.brightness >= 90 ? 30 : state.brightness + 5);
          el.dispatchEvent(new Event('input'));
        } else if (cid === 'Knob_Contrast') {
          const el = document.getElementById('sliderContrast');
          el.value = String(state.contrast >= 95 ? 35 : state.contrast + 5);
          el.dispatchEvent(new Event('input'));
        }
      }
    }
  });
}

// ============================================================================
// 10. Guided Tour & Video Mastering Automation API (Gate 5 PRES-01 / PRES-02)
// ============================================================================
let tourAudioEl = null;
let tourTimer = null;

function applyTourChapter(index) {
  const ch = TOUR_CHAPTERS[index];
  if (!ch) return null;
  state.tourIndex = index;

  const overlay = document.getElementById('tourOverlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    document.getElementById('tourBadge').textContent = ch.badge;
    document.getElementById('tourTitle').textContent = ch.title;
    document.getElementById('tourCaption').textContent = ch.voiceover;
  }

  camera.position.set(ch.camPos[0], ch.camPos[1], ch.camPos[2]);
  controls.target.set(ch.camTarget[0], ch.camTarget[1], ch.camTarget[2]);
  controls.update();

  state.isPluggedIn = ch.pluggedIn !== false;
  state.exploded = ch.explode || 0;
  state.cutaway = Boolean(ch.cutaway);
  state.doorOpen = (ch.doorOpen || 0) > 0.3;

  semModel.setExplodeAmount(state.exploded);
  semModel.setCutawayMode(state.cutaway);
  semModel.setDoorOpen(ch.doorOpen || 0);
  syncUIToState();
  renderLCDDisplay();
  return ch;
}

function updateTourCaptionForProgress(idx, progress) {
  const ch = TOUR_CHAPTERS[idx];
  if (!ch) return;
  const sentences = ch.voiceover.match(/[^.!?]+[.!?]+/g) || [ch.voiceover];
  const sIdx = Math.min(sentences.length - 1, Math.floor(progress * sentences.length));
  const capEl = document.getElementById('tourCaption');
  if (capEl) capEl.textContent = sentences[sIdx].trim();
}

function stepTourFrame(idx, p) {
  state.manualFrameStepping = true;
  const ch = TOUR_CHAPTERS[idx];
  if (!ch) return;
  updateTourCaptionForProgress(idx, p);

  // Smooth orbital camera drift during each chapter
  const angleOffset = (p - 0.5) * 0.28;
  const dx = ch.camPos[0] - ch.camTarget[0];
  const dz = ch.camPos[2] - ch.camTarget[2];
  const rx = ch.camTarget[0] + dx * Math.cos(angleOffset) - dz * Math.sin(angleOffset);
  const rz = ch.camTarget[2] + dx * Math.sin(angleOffset) + dz * Math.cos(angleOffset);
  camera.position.set(rx, ch.camPos[1], rz);
  controls.target.set(ch.camTarget[0], ch.camTarget[1], ch.camTarget[2]);
  controls.update();

  // Chapter-specific dynamic choreography
  if (idx === 1) {
    // Show unplugged blackout in first 30%, then plugged in
    state.isPluggedIn = p > 0.28;
    syncUIToState();
  } else if (idx === 3) {
    // Open chamber door then close & pump down
    const doorRatio = p < 0.65 ? Math.min(1, p * 1.8) : Math.max(0, (1 - p) * 2.8);
    semModel.setDoorOpen(doorRatio);
  } else if (idx === 5) {
    // Cycle detector modes during active beam chapter
    const dets = ['InLens_Secondary', 'SE2_Everhart_Thornley', 'BSE_Backscatter', 'EDS_Silicon_Drift'];
    state.detector = dets[Math.min(3, Math.floor(p * 4))];
    renderScanRows(0, SCAN_H);
    syncUIToState();
  }
  renderLCDDisplay();
  renderer.render(scene, camera);
}

export function startGuidedTour() {
  state.tourActive = true;
  const btn = document.getElementById('btnGuidedTour');
  if (btn) btn.textContent = '⏹ STOP TOUR';

  let idx = 0;
  const playNext = () => {
    if (!state.tourActive || idx >= TOUR_CHAPTERS.length) {
      stopGuidedTour();
      return;
    }
    const ch = applyTourChapter(idx);
    if (tourAudioEl) {
      tourAudioEl.pause();
      tourAudioEl = null;
    }
    const audio = new Audio(`../../docs/audio/vo_${idx}.mp3`);
    tourAudioEl = audio;
    audio.onended = () => {
      idx++;
      playNext();
    };
    audio.onerror = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(ch.voiceover);
        utter.onend = () => {
          idx++;
          playNext();
        };
        window.speechSynthesis.speak(utter);
      } else {
        tourTimer = setTimeout(() => {
          idx++;
          playNext();
        }, 7000);
      }
    };
    audio.play().catch(() => audio.onerror());
  };
  playNext();
}

export function stopGuidedTour() {
  state.tourActive = false;
  if (tourAudioEl) {
    tourAudioEl.pause();
    tourAudioEl = null;
  }
  if (tourTimer) clearTimeout(tourTimer);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  const overlay = document.getElementById('tourOverlay');
  if (overlay) overlay.classList.add('hidden');
  const btn = document.getElementById('btnGuidedTour');
  if (btn) btn.textContent = '🎬 GUIDED TOUR';
  state.isPluggedIn = true;
  state.exploded = 0;
  state.cutaway = false;
  state.doorOpen = false;
  semModel.setExplodeAmount(0);
  semModel.setCutawayMode(false);
  semModel.setDoorOpen(0);
  syncUIToState();
}

function setPanelsHidden(hidden) {
  document.querySelectorAll('.panel-collapsible').forEach(p => {
    p.style.display = hidden ? 'none' : '';
  });
  onResize();
}

// ============================================================================
// 10B. Theme, Lab Lighting, Stage Backdrop & Retro Callout Projection
// ============================================================================
const LIGHT_MOODS = {
  neutral: { bg: 0x0c1016, hemiSky: 0xdbeafe, hemiGnd: 0x1e293b, hemiI: 0.85, keyCol: 0xffffff, keyI: 1.55, fillCol: 0x93c5fd, fillI: 0.65, rimCol: 0x38bdf8, rimI: 0.45 },
  bright: { bg: 0x16202e, hemiSky: 0xf8fafc, hemiGnd: 0x334155, hemiI: 1.15, keyCol: 0xffffff, keyI: 2.05, fillCol: 0xbfdbfe, fillI: 0.90, rimCol: 0x60a5fa, rimI: 0.55 },
  dim: { bg: 0x07090d, hemiSky: 0x64748b, hemiGnd: 0x0f172a, hemiI: 0.45, keyCol: 0xe2e8f0, keyI: 0.90, fillCol: 0x475569, fillI: 0.35, rimCol: 0x0ea5e9, rimI: 0.35 },
  cool: { bg: 0x0a1320, hemiSky: 0xbae6fd, hemiGnd: 0x0f172a, hemiI: 0.85, keyCol: 0xe0f2fe, keyI: 1.50, fillCol: 0x38bdf8, fillI: 0.70, rimCol: 0x00d4e8, rimI: 0.65 },
  warm: { bg: 0x15110d, hemiSky: 0xfef3c7, hemiGnd: 0x292524, hemiI: 0.85, keyCol: 0xffedd5, keyI: 1.60, fillCol: 0xfde68a, fillI: 0.60, rimCol: 0xf59e0b, rimI: 0.45 },
  chemmate: { bg: 0xf4ece1, hemiSky: 0xfffdf8, hemiGnd: 0xd6cbb8, hemiI: 1.05, keyCol: 0xfffaf0, keyI: 1.45, fillCol: 0xfef3c7, fillI: 0.65, rimCol: 0x94a3b8, rimI: 0.30 },
  night: { bg: 0x0a0406, hemiSky: 0x7f1d1d, hemiGnd: 0x1a080c, hemiI: 0.45, keyCol: 0xfca5a5, keyI: 0.95, fillCol: 0xef4444, fillI: 0.40, rimCol: 0xdc2626, rimI: 0.55 },
};

function applyLabLighting() {
  const m = LIGHT_MOODS[state.lightMood] || LIGHT_MOODS.neutral;
  const mult = state.lightMult || 1.0;
  scene.background.setHex(m.bg);
  hemiLight.color.setHex(m.hemiSky);
  hemiLight.groundColor.setHex(m.hemiGnd);
  hemiLight.intensity = m.hemiI * mult;
  keyLight.color.setHex(m.keyCol);
  keyLight.intensity = m.keyI * mult;
  fillLight.color.setHex(m.fillCol);
  fillLight.intensity = m.fillI * mult;
  rimLight.color.setHex(m.rimCol);
  rimLight.intensity = m.rimI * mult;
  renderer.render(scene, camera);
}

function applyChemMate3DStage(mode) {
  const showRoom = mode !== 'plate';
  const roomNode = semModel.root.getObjectByName('VC_E_Room_Suite');
  if (roomNode) roomNode.visible = showRoom;
  if (semModel.benchGroup) semModel.benchGroup.visible = showRoom;
}

function setStageBackdrop(mode) {
  state.currentStageMode = mode === 'bench' ? 'bench' : 'plate';
  document.getElementById('btn-cm-plate')?.classList.toggle('active', state.currentStageMode === 'plate');
  document.getElementById('btn-cm-bench')?.classList.toggle('active', state.currentStageMode === 'bench');
  if (state.currentTheme === 'retro') {
    applyChemMate3DStage(state.currentStageMode);
  } else {
    applyChemMate3DStage('bench');
  }
  renderer.render(scene, camera);
}

function setCallouts(on) {
  state.calloutsVisible = Boolean(on);
  document.getElementById('btn-cm-callouts')?.classList.toggle('active', state.calloutsVisible);
  const layer = document.getElementById('cm-callouts-layer');
  const svg = document.getElementById('cm-callouts-svg');
  if (layer) layer.style.display = state.calloutsVisible ? '' : 'none';
  if (svg) svg.style.display = state.calloutsVisible ? '' : 'none';
  updateChemMateCallouts(camera, viewportEl);
}

function setTheme(theme) {
  state.currentTheme = theme || 'modern';
  document.body.dataset.theme = state.currentTheme;
  document.getElementById('btn-view-modern')?.classList.toggle('active', state.currentTheme === 'modern');
  document.getElementById('btn-view-retro')?.classList.toggle('active', state.currentTheme === 'retro');
  document.getElementById('btn-view-night')?.classList.toggle('active', state.currentTheme === 'night');

  const overlay = document.getElementById('cm-plate-overlay');
  if (overlay) {
    overlay.setAttribute('aria-hidden', state.currentTheme === 'retro' ? 'false' : 'true');
  }

  if (state.currentTheme === 'retro') {
    state.lightMood = 'chemmate';
    applyChemMate3DStage(state.currentStageMode);
  } else if (state.currentTheme === 'night') {
    state.lightMood = 'night';
    applyChemMate3DStage('bench');
  } else {
    state.lightMood = 'neutral';
    applyChemMate3DStage('bench');
  }
  const moodSel = document.getElementById('lab-light-mood');
  if (moodSel) moodSel.value = state.lightMood;
  applyLabLighting();
  updateChemMateCallouts(camera, viewportEl);
}

const CALLOUT_ANCHORS_3D = {
  column: new THREE.Vector3(-4.15, 14.2, -0.2),
  chamber: new THREE.Vector3(-4.15, 9.6, -0.8),
  stage: new THREE.Vector3(-4.15, 8.6, 0.2),
  console: new THREE.Vector3(4.5, 8.8, 0.2),
  prep: new THREE.Vector3(14.8, 9.0, 1.2),
};

function updateChemMateCallouts(cam, hostEl) {
  if (state.currentTheme !== 'retro' || !state.calloutsVisible) return;
  const svg = document.getElementById('cm-callouts-svg');
  if (!svg || !hostEl) return;
  const w = hostEl.clientWidth || 1;
  const h = hostEl.clientHeight || 1;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  const lines = [];
  const hostRect = hostEl.getBoundingClientRect();
  document.querySelectorAll('#cm-callouts-layer .cm-callout').forEach(btn => {
    const key = btn.dataset.callout;
    const anchor = CALLOUT_ANCHORS_3D[key];
    if (!anchor) return;
    const p = anchor.clone().project(cam);
    if (p.z > 1) return;
    const ax = (p.x * 0.5 + 0.5) * w;
    const ay = (-p.y * 0.5 + 0.5) * h;
    const r = btn.getBoundingClientRect();
    const isLeft = btn.classList.contains('cm-callout-left');
    const bx = (isLeft ? r.right : r.left) - hostRect.left;
    const by = r.top + r.height * 0.5 - hostRect.top;
    lines.push(
      `<line x1="${bx.toFixed(1)}" y1="${by.toFixed(1)}" x2="${ax.toFixed(1)}" y2="${ay.toFixed(1)}" stroke="#8c2d19" stroke-width="1.4" stroke-dasharray="4 3" />` +
        `<circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="3.5" fill="#8c2d19" />`
    );
  });
  svg.innerHTML = lines.join('');
}

// ============================================================================
// 11. Resize & Animation Loop
// ============================================================================
function onResize() {
  const w = viewportEl.clientWidth || window.innerWidth;
  const h = viewportEl.clientHeight || window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}
window.addEventListener('resize', onResize);

// Initialize specimen heightfield, initial filmstrip scans, UI & loop
rebuildSpecimenField(0);
renderScanRows(0, SCAN_H);
initSpecimenCarouselAndParts();
bindEvents();
syncUIToState();
renderLCDDisplay();

// Seed 2 initial micrographs into filmstrip so operator sees captured gallery immediately
captureCurrentScanToFilmstrip();
state.specimenIdx = 3; // 5nm FinFET
rebuildSpecimenField(3);
renderScanRows(0, SCAN_H);
captureCurrentScanToFilmstrip();
state.specimenIdx = 0; // Back to Ommatidia
rebuildSpecimenField(0);
renderScanRows(0, SCAN_H);
syncUIToState();
onResize();

function animate() {
  requestAnimationFrame(animate);
  if (state.manualFrameStepping) return;
  renderLCDDisplay();
  controls.update();
  updateChemMateCallouts(camera, viewportEl);
  renderer.render(scene, camera);
}
animate();

function renderNow() {
  syncUIToState();
  renderLCDDisplay();
  controls.update();
  updateChemMateCallouts(camera, viewportEl);
  renderer.render(scene, camera);
}

// Expose automation & QA API on window.app
window.app = {
  state,
  scene,
  camera,
  renderer,
  controls,
  semModel,
  engine: { scene, camera, renderer, controls },
  TOUR_CHAPTERS,
  startGuidedTour,
  stopGuidedTour,
  applyTourChapter,
  stepTourFrame,
  updateTourCaptionForProgress,
  setPanelsHidden,
  setTheme,
  setStageBackdrop,
  setCallouts,
  setCameraPreset,
  renderNow,
  setExplodedValue: val => {
    state.exploded = val;
    semModel.setExplodeAmount(val);
    renderer.render(scene, camera);
  },
  setCutawayMode: val => {
    state.cutaway = Boolean(val);
    semModel.setCutawayMode(val);
    renderer.render(scene, camera);
  },
  captureCurrentScanToFilmstrip,
};
