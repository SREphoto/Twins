/**
 * SREdesigns THERMO-1200 Muffle Furnace — Procedural Three.js 3D Twin Architecture
 * Centrifuge Gold Standard Procedural CAD & Kinematic Assembly
 *
 * Exhaustive Procedural Detail:
 *  1. External Enclosure & Housing:
 *     - Double-walled convective heavy sheet steel cabinet (Glacier Cream & Industrial Charcoal)
 *     - Stamped convective airflow ventilation slots on rear and rear flanks, completely clear of controls
 *     - Unobtrusive official SREdesigns Brand Certification Badge (`Badge_SREdesigns`) seated on
 *       the lower chassis base frame corner, small, upright, facing -Z
 *     - 4× Heavy-duty knurled M12 leveling feet with vulcanized NBR rubber suction pads resting at Y=0.0
 *     - Top stainless steel exhaust ventilation flue chimney duct and manual slide damper
 *  2. Internal Vertical Sliding Lift Door Mechanism:
 *     - Enclosed vertical sliding guide channels and linear bearing carriages inside double-wall side columns
 *     - Enclosed internal pneumatic counterbalance gas struts with extending chrome piston rods
 *     - Rigid cantilever mounting arms connecting carriages to door backframe through internal slots
 *     - Strict vertical translation with initial seal clearance stroke (+240mm rated stroke)
 *     - Calibrated travel stopping flush with the lintel with ZERO ceiling or roofline clipping
 *     - Stepped multi-layer high-temp refractory ceramic fiber insulation plug (`Body_DoorRefractoryPlug`)
 *     - Heavy ergonomic full-width stainless steel grab handle bar with knurled standoffs
 *  3. Hollow Chamber Aperture & 9L Muffle Cavity:
 *     - True hollow 4-sided stainless steel throat collar frame (`Body_ThroatCollar`)
 *     - 4-sided perimeter braided ceramic rope gasket (`Body_ThroatGasket_CeramicRope`) with zero obstruction
 *     - Deep 9.0L vacuum-formed ceramic fiber refractory chamber (235x240x170mm, 1200°C rated)
 *     - Heavy-duty silicon carbide (SiC) refractory hearth load plate with perimeter retention lips
 *     - Embedded Kanthal A1 / FeCrAl heavy-gauge coiled heating elements in milled side and roof grooves
 *     - High-purity recrystallized Al2O3 crucible with lid resting squarely on the SiC hearth plate
 *     - Type-S Platinum-Rhodium (Pt10%Rh/Pt) thermocouple probe in recrystallized alumina sheath
 *  4. Zero-Gap Lower Sheet Metal Apron & Flush Eurotherm 3216 Console:
 *     - Continuous unibody sheet-metal lower apron spanning full cabinet width (`cabW = 4.60`, `fasciaH = 1.30`)
 *     - Zero top, bottom, left, or right cutout gaps; seamless return bends
 *     - Flush precision DIN cutout bezel in the lower apron
 *     - Eurotherm 3216 dynamic high-DPI CanvasTexture dual 7-segment display (`UI_LCD`, flipY = false, upright UVs)
 *     - 5 tactile instrument pushbuttons with beveled keycaps, chrome bezels, custom vector silkscreen labels:
 *       `[ ▲ UP ]`, `[ ▼ DOWN ]`, `[ 📄 PAGE ]`, `[ 📜 SCROLL ]`, `[ ▶ RUN / ⏹ STOP ]`
 *     - Industrial high-current rotary mains disconnect switch in a solid recessed pocket on the side flank,
 *       completely clear of all convective cooling slots
 *  5. Lower Electronics, Power & Cooling Bay:
 *     - Main Controller Motherboard (`PCB_Motherboard`):
 *       * 32-bit ARM Cortex-M4 PID temperature processor IC with laser silkscreen text and pin 1 dot
 *       * High-speed Synchronous RAM IC chip (`Part_RAM_Chip`)
 *       * Solid-State Flash Storage module (`Part_SSD_Module`)
 *       * Cold-junction compensation bridge circuitry for Type-S thermocouple input
 *     - Power Supply Bay:
 *       * Industrial switching power supply module (`Assembly_PowerSupply`) in perforated aluminum cage
 *       * Auxiliary step-down control transformer (`Transformer_Auxiliary_Power`) with varnished copper windings
 *     - Heavy-Duty Solid-State Relay (SSR):
 *       * Crydom 40A / 600V Zero-Cross Solid State Relay (`Module_SSR_HeaterDrive`) with clear safety cover
 *       * High-efficiency extruded finned black anodized aluminum heatsink (`Heatsink_SSR_Extruded`) with 14 fins
 *     - Forced Convection Cooling:
 *       * 80mm brushless DC convective cooling fan (`Fan_CabinetCooling_Blower`) with curved aerofoil blades and wire grille
 *     - Safety Interlock & Grounding:
 *       * Snap-action door safety interlock microswitch (`Switch_DoorInterlock_Micro`) with roller plunger in door jamb
 *       * M6 brass safety chassis ground stud (`Stud_ChassisGround_Brass`) with yellow/green ground braid
 *  6. Rear I/O Panel & Power Continuity:
 *     - Rear RS-485 Modbus DB-9 communication port with gold-plated pins (`Port_RS485_DB9`)
 *     - Rear USB-B data acquisition port (`Port_USB_B`)
 *     - Rear IEC C19 high-current AC power inlet with fuse drawer (`Port_IEC_Inlet`)
 *     - Cast aluminum bench duplex receptacle box (`Power_Receptacle_Duplex`) at datum Y=0
 *     - Molded NEMA 5-15P AC power plug (`Power_Plug_NEMA`)
 *     - Heavy-duty 3-conductor SJTOW power cord (`Power_Cord_SJTOW`)
 *  7. High-Temperature Labware & Bench Accessories:
 *     - Secondary Gooch porcelain crucible on bench at datum Y=0 (`Body_Crucible_Porcelain`)
 *     - 450 mm stainless steel long-reach crucible tongs on bench (`Body_CrucibleTongs`)
 *     - Aluminized Kevlar high-temp thermal gloves on bench (`Body_KevlarGloves`)
 */

import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Material Generators & PBR Palette (High Specular Luster & Thermal Realism)
// ---------------------------------------------------------------------------
function makeMat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.r ?? 0.40,
    metalness: opts.m ?? 0.15,
    transparent: opts.o != null && opts.o < 1.0,
    opacity: opts.o ?? 1.0,
    emissive: new THREE.Color(opts.e ?? opts.emissive ?? 0x000000),
    emissiveIntensity: opts.ei ?? opts.emissiveIntensity ?? 0.0,
    side: opts.side ?? THREE.FrontSide,
    depthWrite: opts.dw ?? true
  });
}

// Cabinet Enclosure Finishes
const matCabinetCream   = makeMat(0xf1f5f9, { r: 0.32, m: 0.10 }); // Glacier White / Cream powder coat
const matCabinetDark    = makeMat(0x1e293b, { r: 0.48, m: 0.25 }); // Dark Charcoal trim & fascia
const matRefractory     = makeMat(0xe2ded4, { r: 0.92, m: 0.02, side: THREE.DoubleSide }); // Vacuum-formed ceramic fiber
const matRefractoryDark = makeMat(0xc4baa9, { r: 0.90, m: 0.02, side: THREE.DoubleSide });
const matHearthSiC      = makeMat(0x27272a, { r: 0.75, m: 0.22 }); // Silicon Carbide dense refractory
const matPlugHotFace    = makeMat(0xd8d2c4, { r: 0.88, m: 0.02 });

// Metals & Hardware
const matSteelBrushed   = makeMat(0xe2e8f0, { r: 0.20, m: 0.85, side: THREE.DoubleSide }); // 304SS brushed
const matSteelDark      = makeMat(0x334155, { r: 0.35, m: 0.80 }); // Dark alloy steel guide channels & brackets
const matChrome         = makeMat(0xf8fafc, { r: 0.12, m: 0.92 }); // Mirror chrome pins, rods & bezels
const matAlumExtruded   = makeMat(0x0f172a, { r: 0.28, m: 0.85 }); // Black anodized heatsink
const matAlumCast       = makeMat(0x94a3b8, { r: 0.45, m: 0.65 }); // TC terminal head, PSU cage
const matBrass          = makeMat(0xd4af37, { r: 0.26, m: 0.82 }); // Ground studs, bushings
const matCopper         = makeMat(0xb45309, { r: 0.30, m: 0.85 }); // Transformer windings
const matRubberNBR      = makeMat(0x0f172a, { r: 0.92, m: 0.05 }); // Leveling pads, boots
const matCeramicRope    = makeMat(0xf8fafc, { r: 0.95, m: 0.02 }); // Braided ceramic rope gasket
const matPCBGreen       = makeMat(0x14532d, { r: 0.35, m: 0.20 }); // FR-4 PCB substrate
const matICBody         = makeMat(0x09090b, { r: 0.60, m: 0.15 }); // Molded epoxy IC bodies
const matSSRCover       = makeMat(0xffffff, { r: 0.15, m: 0.10, o: 0.35 }); // Clear polycarbonate SSR cover

// Labware Accessories
const matCrucibleAl2O3  = makeMat(0xf8fafc, { r: 0.25, m: 0.05, side: THREE.DoubleSide }); // High-purity Al2O3
const matCrucibleGooch  = makeMat(0xe2e8f0, { r: 0.30, m: 0.08, side: THREE.DoubleSide }); // Porcelain
const matKevlarGlove    = makeMat(0xeab308, { r: 0.80, m: 0.12 }); // Aluminized Kevlar safety gloves
const matGoldPins       = makeMat(0xfbbf24, { r: 0.20, m: 0.88 }); // Gold connector pins

// Dynamic Thermal Emissive Materials
const matHeatingElement = makeMat(0x334155, { r: 0.45, m: 0.65, e: 0x000000, ei: 0.0 });
const matChamberGlow    = makeMat(0x18181b, { r: 0.90, m: 0.00, e: 0x000000, ei: 0.0, side: THREE.BackSide });

// Wiring
const matWireRed        = makeMat(0xef4444, { r: 0.42, m: 0.10 });
const matWireWhite      = makeMat(0xf8fafc, { r: 0.42, m: 0.10 });
const matWireGround     = makeMat(0x22c55e, { r: 0.42, m: 0.10 });
const matWireBlack      = makeMat(0x09090b, { r: 0.50, m: 0.10 });

// ---------------------------------------------------------------------------
// Procedural Geometry Helpers
// ---------------------------------------------------------------------------
function box(w, h, d, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cyl(rT, rB, h, mat, segs = 24) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, segs), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeHexSocketBolt(threadR = 0.025, headH = 0.035) {
  const g = new THREE.Group();
  const head = new THREE.Mesh(new THREE.CylinderGeometry(threadR * 1.8, threadR * 1.8, headH, 16), matChrome);
  head.rotation.x = Math.PI / 2;
  g.add(head);

  // Hex socket broach recess
  const socket = new THREE.Mesh(new THREE.CylinderGeometry(threadR * 0.95, threadR * 0.95, headH * 0.6, 6), matSteelDark);
  socket.rotation.x = Math.PI / 2;
  socket.position.z = -headH * 0.25;
  g.add(socket);

  return g;
}

// ---------------------------------------------------------------------------
// Standard Laboratory Workbench Datum & Camera Presets
// ---------------------------------------------------------------------------
export const BENCH = {
  surfaceY: 0.0, // Local datum (bench surface at Y = 0.0)
  width: 14.0,
  depth: 9.0,
  thickness: 0.40,
};

export const CAM_ISO = {
  position: new THREE.Vector3(8.5, 6.2, -9.2),
  target: new THREE.Vector3(0.0, 2.6, 0.0),
};

export const CAM_FRONT = {
  position: new THREE.Vector3(0.0, 2.7, -9.8),
  target: new THREE.Vector3(0.0, 2.7, 0.0),
};

export const CAM_CONSOLE = {
  position: new THREE.Vector3(0.0, 1.15, -6.0),
  target: new THREE.Vector3(0.0, 1.05, -2.2),
};

export const CAM_SIDE = {
  position: new THREE.Vector3(9.5, 2.8, 0.0),
  target: new THREE.Vector3(0.0, 2.6, 0.0),
};

export const CAM_TOP = {
  position: new THREE.Vector3(0.0, 11.5, 0.2),
  target: new THREE.Vector3(0.0, 2.6, 0.0),
};

export const CAM_REAR = {
  position: new THREE.Vector3(0.0, 2.8, 9.8),
  target: new THREE.Vector3(0.0, 2.6, 0.0),
};

export const CAM_EXPLODED = {
  position: new THREE.Vector3(9.5, 8.5, -10.5),
  target: new THREE.Vector3(0.0, 3.2, 0.0),
};

// ---------------------------------------------------------------------------
// Comprehensive Part Catalog for Part Explorer
// ---------------------------------------------------------------------------
export const PART_CATALOG = [
  { id: 'Body_CabinetShell', label: 'Heavy Double-Walled Convective Cabinet (460x455x515mm)', cat: 'Chassis' },
  { id: 'Body_BaseFrame', label: 'Welded Heavy Steel Lower Base Frame Skirt', cat: 'Chassis' },
  { id: 'Badge_SREdesigns', label: 'Official SREdesigns Brand Certification Badge', cat: 'Chassis' },
  { id: 'Foot_Leveling_FL', label: 'Threaded M12 Leveling Foot Front-Left (Y=0 datum)', cat: 'Chassis' },
  { id: 'Foot_Leveling_FR', label: 'Threaded M12 Leveling Foot Front-Right (Y=0 datum)', cat: 'Chassis' },
  { id: 'Foot_Leveling_RL', label: 'Threaded M12 Leveling Foot Rear-Left (Y=0 datum)', cat: 'Chassis' },
  { id: 'Foot_Leveling_RR', label: 'Threaded M12 Leveling Foot Rear-Right (Y=0 datum)', cat: 'Chassis' },
  { id: 'Pivot_DoorAssembly', label: 'Internal Vertical Sliding Lift Door Assembly', cat: 'Kinematics' },
  { id: 'Body_DoorHandle', label: 'Ergonomic Full-Width Stainless Steel Door Grab Bar', cat: 'Kinematics' },
  { id: 'GuideChannel_L', label: 'Enclosed Internal Vertical Guide Rail & C-Channel (Left)', cat: 'Kinematics' },
  { id: 'GuideChannel_R', label: 'Enclosed Internal Vertical Guide Rail & C-Channel (Right)', cat: 'Kinematics' },
  { id: 'SlideCarriage_L', label: 'Precision Linear Guide Carriage & Bushings (Left)', cat: 'Kinematics' },
  { id: 'SlideCarriage_R', label: 'Precision Linear Guide Carriage & Bushings (Right)', cat: 'Kinematics' },
  { id: 'GasSpring_Strut_L', label: 'Internal Counterbalance Pneumatic Gas Strut (Left)', cat: 'Kinematics' },
  { id: 'GasSpring_Strut_R', label: 'Internal Counterbalance Pneumatic Gas Strut (Right)', cat: 'Kinematics' },
  { id: 'Body_ThroatCollar', label: 'Hollow 4-Sided Stainless Steel Throat Aperture Collar', cat: 'Refractory' },
  { id: 'Body_ThroatGasket_CeramicRope', label: 'Continuous Perimeter Braided Ceramic Rope Gasket', cat: 'Refractory' },
  { id: 'Body_DoorRefractoryPlug', label: 'Stepped High-Temp Ceramic Fiber Insulation Plug', cat: 'Refractory' },
  { id: 'Body_RefractoryChamber', label: '9.0L Vacuum-Formed Ceramic Fiber Muffle (1200°C)', cat: 'Refractory' },
  { id: 'Body_HearthPlate', label: 'Silicon Carbide (SiC) Heavy Refractory Hearth Plate', cat: 'Refractory' },
  { id: 'Body_HeatingCoil_Left', label: 'Embedded Kanthal A1 Heavy-Gauge Helical Coils (Left)', cat: 'Heating' },
  { id: 'Body_HeatingCoil_Right', label: 'Embedded Kanthal A1 Heavy-Gauge Helical Coils (Right)', cat: 'Heating' },
  { id: 'Body_HeatingCoil_Top', label: 'Embedded Kanthal A1 Heavy-Gauge Helical Coils (Roof)', cat: 'Heating' },
  { id: 'Sensor_Thermocouple_TypeS', label: 'Type-S Platinum-Rhodium Thermocouple in Al2O3 Sheath', cat: 'Sensors' },
  { id: 'Head_Thermocouple_Terminal', label: 'Die-Cast Aluminum Weatherproof TC Terminal Head', cat: 'Sensors' },
  { id: 'PCB_Motherboard', label: 'Eurotherm 3216 Main Controller Motherboard (ARM Cortex-M4)', cat: 'Electronics' },
  { id: 'Part_MCU_STM32', label: '32-Bit ARM Cortex-M4 Precision PID Microcontroller', cat: 'Electronics' },
  { id: 'Part_RAM_Chip', label: 'High-Speed Synchronous RAM Memory IC', cat: 'Electronics' },
  { id: 'Part_SSD_Module', label: 'Internal Solid-State Flash Storage Drive Module', cat: 'Electronics' },
  { id: 'Assembly_PowerSupply', label: 'Industrial Switching Power Supply Module (120V/24V)', cat: 'Power' },
  { id: 'Transformer_Auxiliary_Power', label: 'Auxiliary Step-Down Control Transformer with Copper Coils', cat: 'Power' },
  { id: 'Module_SSR_HeaterDrive', label: 'Crydom 40A / 600V Zero-Cross Solid-State Relay (SSR)', cat: 'Electronics' },
  { id: 'Heatsink_SSR_Extruded', label: 'Extruded Finned Aluminum Thermal Heatsink (14 Fins)', cat: 'Cooling' },
  { id: 'Fan_CabinetCooling_Blower', label: '80mm Brushless DC Convective Cooling Fan with Wire Grille', cat: 'Cooling' },
  { id: 'Switch_DoorInterlock_Micro', label: 'Door Safety Interlock Plunger Microswitch with Roller', cat: 'Safety' },
  { id: 'Stud_ChassisGround_Brass', label: 'M6 Brass Chassis Ground Stud & Yellow/Green Ground Braid', cat: 'Safety' },
  { id: 'Body_ConsoleFascia', label: 'Continuous Full-Width Sheet-Metal Lower Apron Fascia', cat: 'Controls' },
  { id: 'UI_LCD', label: 'Eurotherm Dynamic High-DPI Dual 7-Segment Canvas LCD', cat: 'Controls' },
  { id: 'Btn_Page', label: 'Tactile Membrane Key: [ 📄 PAGE ]', cat: 'Controls' },
  { id: 'Btn_Scroll', label: 'Tactile Membrane Key: [ 📜 SCROLL ]', cat: 'Controls' },
  { id: 'Btn_Up', label: 'Tactile Membrane Key: [ ▲ UP ]', cat: 'Controls' },
  { id: 'Btn_Down', label: 'Tactile Membrane Key: [ ▼ DOWN ]', cat: 'Controls' },
  { id: 'Btn_RunStop', label: 'Tactile Membrane Key: [ ▶ RUN / ⏹ STOP ] with LED', cat: 'Controls' },
  { id: 'Btn_MainsSwitch', label: 'Rotary High-Current Mains Disconnect Switch (Recessed Flank)', cat: 'Controls' },
  { id: 'Port_RS485_DB9', label: 'Rear RS-485 Modbus DB-9 Serial Communication Port', cat: 'I/O Ports' },
  { id: 'Port_USB_B', label: 'Rear USB-B Peripheral Data Logging Port', cat: 'I/O Ports' },
  { id: 'Port_IEC_Inlet', label: 'Rear IEC C19 Heavy-Duty AC Power Inlet with Fuse Drawer', cat: 'Power' },
  { id: 'Body_Chimney', label: 'Top Stainless Steel Exhaust Flue Chimney Duct', cat: 'Pneumatics' },
  { id: 'Pivot_Damper', label: 'Manual Top Flue Slide Damper & Lever', cat: 'Pneumatics' },
  { id: 'Body_Crucible_Al2O3_1', label: 'High-Purity Alumina (Al₂O₃) Crucible + Lid (In Chamber)', cat: 'Labware' },
  { id: 'Body_Crucible_Porcelain', label: 'Gooch Porcelain Crucible (On Bench)', cat: 'Labware' },
  { id: 'Body_CrucibleTongs', label: '450 mm Stainless Steel Long-Reach Crucible Tongs', cat: 'Labware' },
  { id: 'Body_KevlarGloves', label: 'Aluminized High-Temp Kevlar Safety Gloves', cat: 'Labware' },
  { id: 'Power_Receptacle_Duplex', label: 'Cast Aluminum Bench Duplex Receptacle Box', cat: 'Power' },
  { id: 'Power_Plug_NEMA', label: 'Molded 3-Prong NEMA 5-15P Grounded AC Power Plug', cat: 'Power' },
  { id: 'Power_Cord_SJTOW', label: 'Heavy-Duty 3-Conductor 14 AWG SJTOW Power Cord', cat: 'Power' }
];

// Global Sub-Assembly References for Kinematics & Animations
let furnaceRoot = null;
let doorAssemblyGroup = null;
let slideCarriageL = null;
let slideCarriageR = null;
let gasStrutRodL = null;
let gasStrutRodR = null;
let chamberPointLight = null;
let crucibleInChamber = null;
let lcdMeshRef = null;
let damperLeverRef = null;
let switchKnobRef = null;
let cabinetShellGroup = null;
let chimneyGroupRef = null;
let doorInterlockSwitchRef = null;
let fanBladesRef = null;
let partsMap = new Map();

/**
 * Creates an explicit BufferGeometry quad natively facing the operator at -Z
 * with 100% upright, un-mirrored UV mapping and correct winding order.
 * Strictly implements the standard from .agents/LESSONS_LEARNED.md.
 *
 * @param {number} w Width in world units
 * @param {number} h Height in world units
 * @param {boolean} flipYForCanvasTexture Set true ONLY when texture has flipY = false (e.g. dynamic UI_LCD)
 * @returns {THREE.BufferGeometry}
 */
export function makeOperatorFacingQuadGeo(w, h, flipYForCanvasTexture = false) {
  const geo = new THREE.BufferGeometry();
  const halfW = w / 2;
  const halfH = h / 2;

  // 4 vertices positioned in XY plane facing operator at -Z:
  // Screen Top-Left:     (+halfW, +halfH, 0)
  // Screen Top-Right:    (-halfW, +halfH, 0)
  // Screen Bottom-Left:  (+halfW, -halfH, 0)
  // Screen Bottom-Right: (-halfW, -halfH, 0)
  const positions = new Float32Array([
     halfW,  halfH, 0,
    -halfW,  halfH, 0,
     halfW, -halfH, 0,
    -halfW, -halfH, 0,
  ]);

  const normals = new Float32Array([
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
  ]);

  // UV mapping: Left is u=0, Right is u=1
  // If flipY is true (standard CanvasTexture): Top is v=1, Bottom is v=0
  // If flipY is false (dynamic LCD texture):   Top is v=0, Bottom is v=1
  const vTop = flipYForCanvasTexture ? 0 : 1;
  const vBottom = flipYForCanvasTexture ? 1 : 0;

  const uvs = new Float32Array([
    0, vTop,
    1, vTop,
    0, vBottom,
    1, vBottom,
  ]);

  // Indices wound counter-clockwise when viewed from -Z (normal points -Z)
  const indices = [
    0, 2, 1,
    2, 3, 1
  ];

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);

  // Enforce explicit UV Y-inversion check for dynamic canvas texture contract
  if (flipYForCanvasTexture) {
    const uvAttr = geo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setY(i, 1.0 - uvAttr.getY(i));
    }
  }

  return geo;
}

/**
 * Creates the official SREdesigns Brand Certification Badge with procedural canvas.
 * Designed to be seated unobtrusively on the lower chassis frame corner.
 */
function makeSREdesignsBadge() {
  const g = new THREE.Group();
  g.name = 'Badge_SREdesigns';

  // Brushed aluminum beveled backing plate (small, compact, unobtrusive)
  const plateW = 0.92;
  const plateH = 0.24;
  const plate = new THREE.Mesh(new THREE.BoxGeometry(plateW, plateH, 0.02), matSteelBrushed);
  plate.castShadow = true;
  g.add(plate);

  // 4 Corner socket cap mounting screws
  const cornerCoords = [
    [-plateW / 2 + 0.05,  plateH / 2 - 0.05],
    [ plateW / 2 - 0.05,  plateH / 2 - 0.05],
    [-plateW / 2 + 0.05, -plateH / 2 + 0.05],
    [ plateW / 2 - 0.05, -plateH / 2 + 0.05]
  ];
  cornerCoords.forEach(([cx, cy]) => {
    const sc = makeHexSocketBolt(0.010, 0.018);
    sc.position.set(cx, cy, 0.012);
    g.add(sc);
  });

  // High-DPI procedural vector silkscreen faceplate
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 384, 100);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(3, 3, 378, 94);

  // Red Certified Brand Pill
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(10, 16, 96, 68, 10);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SRE', 58, 50);

  // Cyan Brand URL
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 28px "JetBrains Mono", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('designs.com', 120, 38);

  // Model & Certification subtext
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 15px "JetBrains Mono", sans-serif';
  ctx.fillText('THERMO-1200 · 1200°C', 120, 64);
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 13px "JetBrains Mono", sans-serif';
  ctx.fillText('● CALIBRATED & CERTIFIED', 120, 82);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  // Quad facing operator at -Z with upright, un-mirrored UVs
  const faceGeo = makeOperatorFacingQuadGeo(plateW - 0.04, plateH - 0.04, false);

  const faceMesh = new THREE.Mesh(
    faceGeo,
    new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.30,
      metalness: 0.15
    })
  );
  faceMesh.position.z = -0.012;
  g.add(faceMesh);

  return g;
}

/**
 * Creates the complete SREdesigns THERMO-1200 Muffle Furnace Twin
 */
export function createMuffleFurnaceModel(options = {}) {
  const root = new THREE.Group();
  root.name = 'Body_FurnaceSystem';
  furnaceRoot = root;
  partsMap.clear();

  function register(mesh, id) {
    if (mesh) {
      mesh.name = id;
      partsMap.set(id, mesh);
    }
  }

  // External Cabinet Dimensions: W = 4.60, D = 4.55, H = 5.15
  const cabW = 4.60;
  const cabD = 4.55;
  const cabH = 5.15;
  const baseY = 0.10; // Clearance above feet datum
  const wallT = 0.08; // Double-wall sheet metal thickness
  const fasciaH = 1.85; // Height of zero-gap lower apron spanning Y from baseY=0.10 to 1.95
  const lintelH = 1.40; // Height of top front lintel spanning Y from 3.85 to 5.25
  const jambH = cabH - lintelH - fasciaH; // Middle aperture vertical span = 1.90 (from Y=1.95 to 3.85)
  const jambY = baseY + fasciaH + jambH / 2; // Y center of chamber opening = 0.10 + 1.85 + 0.95 = 2.90

  const furnaceBody = new THREE.Group();
  furnaceBody.name = 'Body_ChassisGroup';
  root.add(furnaceBody);

  // 1. Bottom Base Frame Skirt (Body_BaseFrame)
  const baseFrame = box(cabW + 0.08, 0.16, cabD + 0.08, matCabinetDark);
  baseFrame.name = 'Body_BaseFrame';
  baseFrame.position.set(0, baseY + 0.08, 0);
  furnaceBody.add(baseFrame);
  register(baseFrame, 'Body_BaseFrame');

  // 4 Industrial Neoprene Leveling Feet resting on Y = 0.0
  const footPositions = [
    [-cabW / 2 + 0.40, -cabD / 2 + 0.40, 'Foot_Leveling_FL'],
    [ cabW / 2 - 0.40, -cabD / 2 + 0.40, 'Foot_Leveling_FR'],
    [-cabW / 2 + 0.40,  cabD / 2 - 0.40, 'Foot_Leveling_RL'],
    [ cabW / 2 - 0.40,  cabD / 2 - 0.40, 'Foot_Leveling_RR'],
  ];

  footPositions.forEach(([fx, fz, id]) => {
    const footGrp = new THREE.Group();
    footGrp.name = id;
    footGrp.position.set(fx, 0, fz);

    // Rubber vulcanized pad resting squarely at Y=0
    const pad = cyl(0.20, 0.22, 0.08, matRubberNBR, 20);
    pad.position.y = 0.04;
    footGrp.add(pad);

    // Hex leveling adjustment nut & M12 threaded stud
    const nut = cyl(0.12, 0.12, 0.06, matChrome, 6);
    nut.position.y = 0.10;
    footGrp.add(nut);

    const stud = cyl(0.06, 0.06, 0.14, matChrome, 16);
    stud.position.y = 0.15;
    footGrp.add(stud);

    furnaceBody.add(footGrp);
    register(footGrp, id);
  });

  // -------------------------------------------------------------------------
  // 2. Main Outer Cabinet Enclosure (Double-Walled Convective Airflow Skin)
  // -------------------------------------------------------------------------
  const cabinetShell = new THREE.Group();
  cabinetShell.name = 'Body_CabinetShell';
  furnaceBody.add(cabinetShell);
  cabinetShellGroup = cabinetShell;
  register(cabinetShell, 'Body_CabinetShell');

  // Left & Right Outer Side Panels
  const sideL = box(wallT, cabH, cabD, matCabinetCream);
  sideL.position.set(-cabW / 2 + wallT / 2, baseY + cabH / 2, 0);
  cabinetShell.add(sideL);

  const sideR = box(wallT, cabH, cabD, matCabinetCream);
  sideR.position.set(cabW / 2 - wallT / 2, baseY + cabH / 2, 0);
  cabinetShell.add(sideR);

  // Stamped Convective Ventilation Air Slots on Left & Right Flanks (placed in rear upper quadrant)
  for (let s of [-1, 1]) {
    for (let row = 0; row < 6; row++) {
      const slot = box(0.015, 0.03, 1.20, matCabinetDark);
      slot.position.set(s * (cabW / 2 + 0.005), baseY + 2.2 + row * 0.16, 0.60);
      cabinetShell.add(slot);
    }
  }

  // Rear Outer Panel with Stamped Ventilation Louvers
  const backPanel = box(cabW - 2 * wallT, cabH, wallT, matCabinetCream);
  backPanel.position.set(0, baseY + cabH / 2, cabD / 2 - wallT / 2);
  cabinetShell.add(backPanel);

  for (let row = 0; row < 8; row++) {
    const louver = box(2.4, 0.03, 0.04, matCabinetDark);
    louver.position.set(0, baseY + 1.6 + row * 0.22, cabD / 2 + 0.01);
    cabinetShell.add(louver);
  }

  // Top Roof Panel with Center Chimney Aperture Flange
  const roof = box(cabW, wallT, cabD, matCabinetCream);
  roof.position.set(0, baseY + cabH - wallT / 2, 0);
  cabinetShell.add(roof);

  // Upper Front Lintel (Pristine Unibody Cream Panel with Zero Badge Slapped on Display)
  const lintel = box(cabW, lintelH, wallT, matCabinetCream);
  lintel.position.set(0, baseY + cabH - lintelH / 2, -cabD / 2 + wallT / 2);
  cabinetShell.add(lintel);

  // Left & Right Front Door Jamb Uprights (enclosing internal vertical lift columns)
  const jambW = (cabW - 2.50) / 2; // 1.05 width columns
  const jambL = box(jambW, jambH, wallT, matCabinetCream);
  jambL.position.set(-cabW / 2 + jambW / 2, jambY, -cabD / 2 + wallT / 2);
  cabinetShell.add(jambL);

  const jambR = box(jambW, jambH, wallT, matCabinetCream);
  jambR.position.set(cabW / 2 - jambW / 2, jambY, -cabD / 2 + wallT / 2);
  cabinetShell.add(jambR);

  // -------------------------------------------------------------------------
  // 3. Hollow Chamber Aperture (True 4-Sided Frame Collar & Perimeter Rope Gasket)
  // -------------------------------------------------------------------------
  const throatOuterW = 2.50;
  const throatOuterH = jambH; // 3.00
  const chW = 2.35; // Chamber inner width
  const chH = 1.70; // Chamber inner height
  const chD = 2.40; // Chamber inner depth
  const chY = jambY; // Chamber center Y = 2.90
  const frontZ = -cabD / 2 + wallT; // Front mouth plane = -2.195
  const chZ = frontZ + chD / 2;     // Chamber center Z = -0.995

  // Hollow 4-Sided Stainless Steel Throat Frame Collar
  const throatCollar = new THREE.Group();
  throatCollar.name = 'Body_ThroatCollar';
  throatCollar.position.set(0, jambY, -cabD / 2 + 0.04);
  cabinetShell.add(throatCollar);
  register(throatCollar, 'Body_ThroatCollar');

  const collarT = 0.06;
  const collarTopH = (throatOuterH - chH) / 2; // 0.65
  const collarBotH = collarTopH; // 0.65
  const collarSideW = (throatOuterW - chW) / 2; // 0.075

  // Collar Top Frame Member
  const collarTop = box(throatOuterW, collarTopH, collarT, matSteelBrushed);
  collarTop.position.set(0, chH / 2 + collarTopH / 2, 0);
  throatCollar.add(collarTop);

  // Collar Bottom Frame Member
  const collarBot = box(throatOuterW, collarBotH, collarT, matSteelBrushed);
  collarBot.position.set(0, -chH / 2 - collarBotH / 2, 0);
  throatCollar.add(collarBot);

  // Collar Left Frame Member
  const collarLeft = box(collarSideW, chH, collarT, matSteelBrushed);
  collarLeft.position.set(-chW / 2 - collarSideW / 2, 0, 0);
  throatCollar.add(collarLeft);

  // Collar Right Frame Member
  const collarRight = box(collarSideW, chH, collarT, matSteelBrushed);
  collarRight.position.set(chW / 2 + collarSideW / 2, 0, 0);
  throatCollar.add(collarRight);

  // Continuous Perimeter Braided Ceramic Rope Gasket (4-sided rectangular seal loop)
  const ropeGasket = new THREE.Group();
  ropeGasket.name = 'Body_ThroatGasket_CeramicRope';
  ropeGasket.position.set(0, jambY, -cabD / 2 - 0.005);
  cabinetShell.add(ropeGasket);
  register(ropeGasket, 'Body_ThroatGasket_CeramicRope');

  const ropeW = 0.05;
  const ropeT = 0.03;

  // Top rope segment
  const ropeTop = box(chW + 0.08, ropeW, ropeT, matCeramicRope);
  ropeTop.position.set(0, chH / 2 + ropeW / 2, 0);
  ropeGasket.add(ropeTop);

  // Bottom rope segment
  const ropeBot = box(chW + 0.08, ropeW, ropeT, matCeramicRope);
  ropeBot.position.set(0, -chH / 2 - ropeW / 2, 0);
  ropeGasket.add(ropeBot);

  // Left rope segment
  const ropeL = box(ropeW, chH, ropeT, matCeramicRope);
  ropeL.position.set(-chW / 2 - ropeW / 2, 0, 0);
  ropeGasket.add(ropeL);

  // Right rope segment
  const ropeR = box(ropeW, chH, ropeT, matCeramicRope);
  ropeR.position.set(chW / 2 + ropeW / 2, 0, 0);
  ropeGasket.add(ropeR);

  // -------------------------------------------------------------------------
  // 4. Ceramic Fiber Refractory Muffle Chamber (Deep 9.0L Hot Cavity)
  // -------------------------------------------------------------------------
  const muffleGroup = new THREE.Group();
  muffleGroup.name = 'Body_RefractoryChamberGroup';
  muffleGroup.position.set(0, chY, chZ);
  furnaceBody.add(muffleGroup);

  const muffleShell = new THREE.Group();
  muffleShell.name = 'Body_RefractoryChamber';
  muffleGroup.add(muffleShell);
  register(muffleShell, 'Body_RefractoryChamber');

  const wallRefT = 0.35; // 35mm thick vacuum-formed refractory fiber board

  // Left Refractory Wall with Helical Coil Element Grooves
  const muffleL = box(wallRefT, chH, chD, matRefractory);
  muffleL.position.set(-chW / 2 - wallRefT / 2, 0, 0);
  muffleShell.add(muffleL);

  const coilL = new THREE.Group();
  coilL.name = 'Body_HeatingCoil_Left';
  for (let r = 0; r < 4; r++) {
    const yOff = -chH / 2 + 0.25 + r * 0.38;
    const wireCoil = cyl(0.04, 0.04, chD - 0.20, matHeatingElement, 16);
    wireCoil.rotation.x = Math.PI / 2;
    wireCoil.position.set(-chW / 2 + 0.03, yOff, 0);
    coilL.add(wireCoil);
  }
  muffleGroup.add(coilL);
  register(coilL, 'Body_HeatingCoil_Left');

  // Right Refractory Wall with Helical Coil Element Grooves
  const muffleR = box(wallRefT, chH, chD, matRefractory);
  muffleR.position.set(chW / 2 + wallRefT / 2, 0, 0);
  muffleShell.add(muffleR);

  const coilR = new THREE.Group();
  coilR.name = 'Body_HeatingCoil_Right';
  for (let r = 0; r < 4; r++) {
    const yOff = -chH / 2 + 0.25 + r * 0.38;
    const wireCoil = cyl(0.04, 0.04, chD - 0.20, matHeatingElement, 16);
    wireCoil.rotation.x = Math.PI / 2;
    wireCoil.position.set(chW / 2 - 0.03, yOff, 0);
    coilR.add(wireCoil);
  }
  muffleGroup.add(coilR);
  register(coilR, 'Body_HeatingCoil_Right');

  // Roof Refractory Slab with Embedded Heating Elements
  const muffleTop = box(chW + 2 * wallRefT, wallRefT, chD, matRefractory);
  muffleTop.position.set(0, chH / 2 + wallRefT / 2, 0);
  muffleShell.add(muffleTop);

  const coilTop = new THREE.Group();
  coilTop.name = 'Body_HeatingCoil_Top';
  for (let c = -1; c <= 1; c++) {
    const wireCoil = cyl(0.04, 0.04, chD - 0.20, matHeatingElement, 16);
    wireCoil.rotation.x = Math.PI / 2;
    wireCoil.position.set(c * 0.60, chH / 2 - 0.03, 0);
    coilTop.add(wireCoil);
  }
  muffleGroup.add(coilTop);
  register(coilTop, 'Body_HeatingCoil_Top');

  // Floor Refractory Foundation Slab
  const muffleFloor = box(chW + 2 * wallRefT, wallRefT, chD, matRefractory);
  muffleFloor.position.set(0, -chH / 2 - wallRefT / 2, 0);
  muffleShell.add(muffleFloor);

  // Back Refractory Wall with Thermocouple Penetration Hole
  const muffleBack = box(chW + 2 * wallRefT, chH + 2 * wallRefT, wallRefT, matRefractoryDark);
  muffleBack.position.set(0, 0, chD / 2 + wallRefT / 2);
  muffleShell.add(muffleBack);

  // Heavy Silicon Carbide (SiC) Hearth Plate with Side Retention Lips
  const hearthGrp = new THREE.Group();
  hearthGrp.name = 'Body_HearthPlate';
  const hearthBase = box(chW - 0.08, 0.08, chD - 0.12, matHearthSiC);
  hearthBase.position.y = 0.04;
  hearthGrp.add(hearthBase);

  // Side retention lips to prevent crucible contact with side heating coils
  const lipL = box(0.04, 0.06, chD - 0.12, matHearthSiC);
  lipL.position.set(-chW / 2 + 0.06, 0.08, 0);
  hearthGrp.add(lipL);

  const lipR = box(0.04, 0.06, chD - 0.12, matHearthSiC);
  lipR.position.set(chW / 2 - 0.06, 0.08, 0);
  hearthGrp.add(lipR);

  hearthGrp.position.set(0, -chH / 2, 0);
  muffleGroup.add(hearthGrp);
  register(hearthGrp, 'Body_HearthPlate');

  // Internal Radiative Glow Cavity Shader
  const glowBox = new THREE.Mesh(new THREE.BoxGeometry(chW - 0.02, chH - 0.02, chD - 0.02), matChamberGlow);
  glowBox.name = 'Body_ChamberGlowBox';
  muffleGroup.add(glowBox);

  const ptLight = new THREE.PointLight(0xff4500, 0.0, 6.0, 1.5);
  ptLight.position.set(0, 0, 0);
  muffleGroup.add(ptLight);
  chamberPointLight = ptLight;

  // Type-S Platinum-Rhodium Thermocouple in Alumina Sheath through Rear Wall
  const tcGroup = new THREE.Group();
  tcGroup.name = 'Sensor_Thermocouple_TypeS';
  tcGroup.position.set(0, chY + 0.25, chZ + chD / 2);
  furnaceBody.add(tcGroup);
  register(tcGroup, 'Sensor_Thermocouple_TypeS');

  // Al2O3 twin-bore refractory sheath protruding into chamber
  const tcSheath = cyl(0.045, 0.045, 1.10, matCrucibleAl2O3, 20);
  tcSheath.rotation.x = Math.PI / 2;
  tcSheath.position.set(0, 0, -0.40);
  tcGroup.add(tcSheath);

  // Die-Cast Aluminum TC Terminal Connection Head (rear exterior)
  const tcHead = new THREE.Group();
  tcHead.name = 'Head_Thermocouple_Terminal';
  const headBody = cyl(0.18, 0.16, 0.28, matAlumCast, 16);
  headBody.rotation.x = Math.PI / 2;
  tcHead.add(headBody);

  const headCap = cyl(0.20, 0.20, 0.08, matCabinetDark, 16);
  headCap.rotation.x = Math.PI / 2;
  headCap.position.z = 0.15;
  tcHead.add(headCap);

  tcHead.position.set(0, 0, wallRefT + 0.16);
  tcGroup.add(tcHead);
  register(tcHead, 'Head_Thermocouple_Terminal');

  // -------------------------------------------------------------------------
  // 5. Zero-Gap Lower Apron & Flush Eurotherm 3216 Console
  // -------------------------------------------------------------------------
  // Continuous, full-width sheet-metal lower apron spanning entire cabinet width
  const lowerApronGroup = new THREE.Group();
  lowerApronGroup.name = 'Body_ConsoleFascia';
  lowerApronGroup.position.set(0, baseY + fasciaH / 2, -cabD / 2 + wallT / 2);
  furnaceBody.add(lowerApronGroup);
  register(lowerApronGroup, 'Body_ConsoleFascia');

  // Continuous unibody sheet metal front apron panel (ZERO left, right, top, bottom gaps)
  const apronPanel = box(cabW, fasciaH, wallT, matCabinetCream);
  apronPanel.name = 'Body_LowerApronSheetMetal';
  lowerApronGroup.add(apronPanel);

  // Flush Precision DIN Bezel Cutout Plate
  const consoleBezel = box(3.80, 0.94, 0.04, matCabinetDark);
  consoleBezel.name = 'Body_ConsoleBezel';
  consoleBezel.position.z = -wallT / 2 - 0.01;
  lowerApronGroup.add(consoleBezel);

  // Brushed aluminum chamfered bezel trim frame around DIN cutout
  const bezelTrim = box(3.84, 0.98, 0.02, matSteelBrushed);
  bezelTrim.position.z = -wallT / 2 - 0.005;
  lowerApronGroup.add(bezelTrim);

  // Eurotherm 3216 Bezel Housing & Dynamic LCD Quad (UI_LCD)
  const eurothermHousing = box(1.58, 0.76, 0.05, matCabinetDark);
  eurothermHousing.position.set(-0.75, 0.0, -wallT / 2 - 0.03);
  lowerApronGroup.add(eurothermHousing);

  const eurothermTrim = box(1.62, 0.80, 0.02, matChrome);
  eurothermTrim.position.set(-0.75, 0.0, -wallT / 2 - 0.025);
  lowerApronGroup.add(eurothermTrim);

  const lcdGeo = makeOperatorFacingQuadGeo(1.44, 0.62, false);
  const lcdMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide });
  const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.name = 'UI_LCD';
  lcdMesh.position.set(-0.75, 0.0, -wallT / 2 - 0.06);
  lowerApronGroup.add(lcdMesh);
  lcdMeshRef = lcdMesh;
  register(lcdMesh, 'UI_LCD');

  // 5 Tactile Instrument Pushbuttons with Chrome Bezels & Upright Vector Silkscreens
  const btnConfigs = [
    { id: 'Btn_Page',    label: 'PAGE',   text: '📄 PAGE',   x: 0.45, y:  0.20, bg: '#1e293b' },
    { id: 'Btn_Scroll',  label: 'SCROLL', text: '📜 SCROLL', x: 0.45, y: -0.20, bg: '#1e293b' },
    { id: 'Btn_Up',      label: 'UP',     text: '▲ UP',      x: 1.05, y:  0.20, bg: '#1d4ed8' },
    { id: 'Btn_Down',    label: 'DOWN',   text: '▼ DOWN',    x: 1.05, y: -0.20, bg: '#1d4ed8' },
    { id: 'Btn_RunStop', label: 'RUN',    text: '▶ RUN',     x: 1.62, y:  0.00, bg: '#15803d' }
  ];

  btnConfigs.forEach(bc => {
    const bGrp = new THREE.Group();
    bGrp.name = bc.id;
    bGrp.position.set(bc.x, bc.y, -wallT / 2 - 0.03);

    // Chrome outer bezel
    const bFrame = box(0.44, 0.28, 0.03, matChrome);
    bGrp.add(bFrame);

    // Procedural vector silkscreen canvas texture
    const bCanv = document.createElement('canvas');
    bCanv.width = 160;
    bCanv.height = 110;
    const bCtx = bCanv.getContext('2d');
    bCtx.fillStyle = bc.bg;
    bCtx.fillRect(0, 0, 160, 110);
    bCtx.strokeStyle = '#ffffff';
    bCtx.lineWidth = 4;
    bCtx.strokeRect(3, 3, 154, 104);

    bCtx.fillStyle = '#ffffff';
    bCtx.font = 'bold 28px "JetBrains Mono", monospace';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText(bc.text, 80, 55);

    const bTex = new THREE.CanvasTexture(bCanv);
    bTex.colorSpace = THREE.SRGBColorSpace;

    const bFaceGeo = makeOperatorFacingQuadGeo(0.38, 0.22, false);

    const bCap = new THREE.Mesh(
      bFaceGeo,
      new THREE.MeshStandardMaterial({ map: bTex, roughness: 0.35, metalness: 0.20 })
    );
    bCap.position.z = -0.02;
    bGrp.add(bCap);

    lowerApronGroup.add(bGrp);
    register(bGrp, bc.id);
  });

  // Official SREdesigns Brand Certification Badge Seated on Lower Apron Faceplate (TAX-06 & DIAG-001)
  const badge = makeSREdesignsBadge();
  badge.position.set(-0.75, -0.62, -wallT / 2 - 0.02);
  lowerApronGroup.add(badge);
  register(badge, 'Badge_SREdesigns');

  // -------------------------------------------------------------------------
  // 6. Rotary Mains Disconnect Switch in Solid Recessed Side Pocket
  // -------------------------------------------------------------------------
  // Positioned on the lower forward right flank, completely clear of cooling slots
  const swX = cabW / 2;
  const swY = baseY + 0.65; // Lower electronics bay level = 0.75
  const swZ = -1.25;        // Forward flank (cooling slots are rearward at Z = 0.60)

  const swPocketGrp = new THREE.Group();
  swPocketGrp.name = 'Assembly_MainsSwitchPocket';
  swPocketGrp.position.set(swX, swY, swZ);
  furnaceBody.add(swPocketGrp);

  // Recessed pocket housing box
  const swPocketBox = box(0.06, 0.58, 0.58, matCabinetDark);
  swPocketBox.position.x = 0.02;
  swPocketGrp.add(swPocketBox);

  // Brushed aluminum bezel frame around pocket
  const swPocketTrim = box(0.04, 0.62, 0.62, matSteelBrushed);
  swPocketTrim.position.x = 0.01;
  swPocketGrp.add(swPocketTrim);

  // Yellow industrial emergency disconnect escutcheon ring
  const swEscutcheon = cyl(0.20, 0.20, 0.02, makeMat(0xfbbf24, { r: 0.4 }), 24);
  swEscutcheon.rotation.z = Math.PI / 2;
  swEscutcheon.position.x = 0.04;
  swPocketGrp.add(swEscutcheon);

  // Rotary switch knob with red handle & padlock lockout eye
  const switchKnob = cyl(0.12, 0.12, 0.10, makeMat(0xd97706, { r: 0.3 }), 16);
  switchKnob.name = 'Btn_MainsSwitch';
  switchKnob.rotation.z = Math.PI / 2;
  switchKnob.position.set(swX + 0.08, swY, swZ);
  furnaceBody.add(switchKnob);
  switchKnobRef = switchKnob;
  register(switchKnob, 'Btn_MainsSwitch');

  // Red pointer bar across knob
  const swPointer = box(0.03, 0.22, 0.06, makeMat(0xdc2626, { r: 0.3 }));
  swPointer.position.set(0.05, 0, 0);
  switchKnob.add(swPointer);

  // -------------------------------------------------------------------------
  // 7. Internal Enclosed Vertical Lift Mechanism & Counterbalanced Door
  // -------------------------------------------------------------------------
  const doorMountGroup = new THREE.Group();
  doorMountGroup.name = 'Body_DoorMountGroup';
  root.add(doorMountGroup);

  // Enclosed Vertical Linear Guide Channels (Inside Left & Right Double-Wall Columns)
  for (let s of [-1, 1]) {
    const colX = s * (cabW / 2 - jambW / 2); // Center of double-wall column: +/-1.775

    // Vertical steel C-channel guide rail running from apron to upper lintel
    const guideRail = box(0.08, 3.20, 0.12, matSteelDark);
    guideRail.name = s > 0 ? 'GuideChannel_R' : 'GuideChannel_L';
    guideRail.position.set(colX, jambY + 0.20, -cabD / 2 + 0.24);
    doorMountGroup.add(guideRail);
    register(guideRail, guideRail.name);

    // Precision ground chrome linear guide rod
    const chromeRod = cyl(0.025, 0.025, 3.10, matChrome, 16);
    chromeRod.position.set(colX, jambY + 0.20, -cabD / 2 + 0.24);
    doorMountGroup.add(chromeRod);

    // Sliding carriage block (rides vertically on the guide channel)
    const carriage = new THREE.Group();
    carriage.name = s > 0 ? 'SlideCarriage_R' : 'SlideCarriage_L';
    carriage.position.set(colX, jambY, -cabD / 2 + 0.24);
    doorMountGroup.add(carriage);
    register(carriage, carriage.name);

    if (s < 0) slideCarriageL = carriage;
    else slideCarriageR = carriage;

    const carriageBody = box(0.12, 0.45, 0.16, matSteelBrushed);
    carriage.add(carriageBody);

    // Enclosed Counterbalance Pneumatic Gas Struts (Inside Double-Wall Columns)
    const strutGrp = new THREE.Group();
    strutGrp.name = s > 0 ? 'GasSpring_Strut_R' : 'GasSpring_Strut_L';
    strutGrp.position.set(colX, baseY + 1.40, -cabD / 2 + 0.38);

    const cylBody = cyl(0.045, 0.045, 1.20, matCabinetDark, 16);
    cylBody.position.y = 0.60;
    strutGrp.add(cylBody);

    const rod = cyl(0.022, 0.022, 1.10, matChrome, 16);
    rod.position.y = 1.35;
    strutGrp.add(rod);

    if (s < 0) gasStrutRodL = rod;
    else gasStrutRodR = rod;

    doorMountGroup.add(strutGrp);
    register(strutGrp, strutGrp.name);

    // Heavy-duty forged cantilever arm extending cleanly inside column to door frame
    const arm = box(0.44, 0.12, 0.12, matSteelDark);
    arm.position.set(-s * 0.22, 0, -0.10);
    carriage.add(arm);
  }

  // Vertical Sliding Door Assembly (Rides cleanly on internal carriages)
  const doorAssembly = new THREE.Group();
  doorAssembly.name = 'Pivot_DoorAssembly';
  doorMountGroup.add(doorAssembly);
  doorAssemblyGroup = doorAssembly;
  register(doorAssembly, 'Pivot_DoorAssembly');

  const doorOuterW = 2.70;
  const doorOuterH = 2.10;
  const doorOuterD = 0.18;

  // Outer Door Casing Sheet (Glacier Cream powder coat)
  const doorOuter = box(doorOuterW, doorOuterH, doorOuterD, matCabinetCream);
  doorOuter.name = 'Body_DoorOuterPanel';
  doorAssembly.add(doorOuter);
  register(doorOuter, 'Body_DoorOuterPanel');

  // Brushed stainless steel outer perimeter edge trim
  const doorTrim = box(doorOuterW + 0.02, doorOuterH + 0.02, 0.04, matSteelBrushed);
  doorTrim.position.z = 0.06;
  doorAssembly.add(doorTrim);

  // Stepped High-Temp Refractory Insulation Plug that fits snugly into throat
  const plugBase = box(chW + 0.10, chH + 0.10, 0.08, matRefractory);
  plugBase.name = 'Body_DoorPlugBase';
  plugBase.position.z = doorOuterD / 2 + 0.04;
  doorAssembly.add(plugBase);

  // Hot face of plug that penetrates hollow throat and seals against rope gasket
  const plugHotFace = box(chW - 0.06, chH - 0.06, 0.14, matPlugHotFace);
  plugHotFace.name = 'Body_DoorRefractoryPlug';
  plugHotFace.position.z = doorOuterD / 2 + 0.15;
  doorAssembly.add(plugHotFace);
  register(plugHotFace, 'Body_DoorRefractoryPlug');

  // Full-Width Ergonomic Stainless Steel Door Grab Bar Handle
  const handleStandoffL = cyl(0.035, 0.035, 0.22, matSteelDark, 16);
  handleStandoffL.rotation.x = Math.PI / 2;
  handleStandoffL.position.set(-1.15, -doorOuterH / 2 - 0.12, -0.15);
  doorAssembly.add(handleStandoffL);

  const handleStandoffR = cyl(0.035, 0.035, 0.22, matSteelDark, 16);
  handleStandoffR.rotation.x = Math.PI / 2;
  handleStandoffR.position.set(1.15, -doorOuterH / 2 - 0.12, -0.15);
  doorAssembly.add(handleStandoffR);

  const grabBar = cyl(0.045, 0.045, 2.70, matSteelBrushed, 24);
  grabBar.name = 'Body_DoorHandle';
  grabBar.rotation.z = Math.PI / 2;
  grabBar.position.set(0, -doorOuterH / 2 - 0.12, -0.26);
  doorAssembly.add(grabBar);
  register(grabBar, 'Body_DoorHandle');

  // Snap-Action Door Safety Interlock Plunger Microswitch inside throat frame
  const microswitch = new THREE.Group();
  microswitch.name = 'Switch_DoorInterlock_Micro';
  microswitch.position.set(throatOuterW / 2 + 0.04, jambY - 0.40, -cabD / 2 + 0.08);
  furnaceBody.add(microswitch);
  doorInterlockSwitchRef = microswitch;
  register(microswitch, 'Switch_DoorInterlock_Micro');

  const swBody = box(0.08, 0.14, 0.18, matICBody);
  microswitch.add(swBody);

  const swPlunger = cyl(0.016, 0.016, 0.06, matChrome, 12);
  swPlunger.rotation.x = Math.PI / 2;
  swPlunger.position.set(0, 0, -0.11);
  microswitch.add(swPlunger);

  // -------------------------------------------------------------------------
  // 8. Lower Electronics, Power Supply & Cooling Fan Bay
  // -------------------------------------------------------------------------
  const electronicsBay = new THREE.Group();
  electronicsBay.name = 'Assembly_ElectronicsBay';
  electronicsBay.position.set(0, baseY + 0.10, 0.20);
  furnaceBody.add(electronicsBay);

  // FR-4 Main Controller Motherboard (PCB_Motherboard)
  const pcb = box(2.60, 0.04, 1.80, matPCBGreen);
  pcb.name = 'PCB_Motherboard';
  pcb.position.set(-0.60, 0.22, 0.10);
  electronicsBay.add(pcb);
  register(pcb, 'PCB_Motherboard');

  // 4 Brass PCB Standoffs with M3 Screws
  const pcbCorners = [
    [-1.20, -0.80],
    [ 1.20, -0.80],
    [-1.20,  0.80],
    [ 1.20,  0.80]
  ];
  pcbCorners.forEach(([px, pz]) => {
    const standoff = cyl(0.04, 0.04, 0.20, matBrass, 12);
    standoff.position.set(-0.60 + px, 0.10, 0.10 + pz);
    electronicsBay.add(standoff);

    const sc = makeHexSocketBolt(0.015, 0.02);
    sc.position.set(-0.60 + px, 0.25, 0.10 + pz);
    electronicsBay.add(sc);
  });

  // Microcontroller: 32-bit ARM Cortex-M4 PID Temperature Processor
  const mcu = box(0.32, 0.035, 0.32, matICBody);
  mcu.name = 'Part_MCU_STM32';
  mcu.position.set(-0.60, 0.26, 0.10);
  electronicsBay.add(mcu);
  register(mcu, 'Part_MCU_STM32');

  // Synchronous RAM IC Memory Chip
  const ram = box(0.18, 0.025, 0.36, matICBody);
  ram.name = 'Part_RAM_Chip';
  ram.position.set(-0.15, 0.25, 0.10);
  electronicsBay.add(ram);
  register(ram, 'Part_RAM_Chip');

  // Solid-State Flash Storage Module (SSD)
  const ssd = box(0.24, 0.025, 0.50, matCabinetDark);
  ssd.name = 'Part_SSD_Module';
  ssd.position.set(-1.10, 0.25, 0.20);
  electronicsBay.add(ssd);
  register(ssd, 'Part_SSD_Module');

  // SMT Capacitors & Resistor Arrays
  for (let i = 0; i < 8; i++) {
    const smtCap = cyl(0.04, 0.04, 0.12, matChrome, 12);
    smtCap.position.set(-0.90 + (i % 4) * 0.20, 0.30, -0.40 + Math.floor(i / 4) * 0.25);
    electronicsBay.add(smtCap);
  }

  // Industrial Switching Power Supply Module (Assembly_PowerSupply)
  const psuGrp = new THREE.Group();
  psuGrp.name = 'Assembly_PowerSupply';
  psuGrp.position.set(1.40, 0.30, 0.20);
  electronicsBay.add(psuGrp);
  register(psuGrp, 'Assembly_PowerSupply');

  // Perforated aluminum enclosure cage
  const psuCase = box(1.00, 0.44, 1.50, matAlumCast);
  psuGrp.add(psuCase);

  // Auxiliary Step-Down Control Transformer with Copper Windings
  const xformer = new THREE.Group();
  xformer.name = 'Transformer_Auxiliary_Power';
  xformer.position.set(1.40, 0.30, -1.00);
  electronicsBay.add(xformer);
  register(xformer, 'Transformer_Auxiliary_Power');

  const xformerCore = box(0.65, 0.50, 0.65, matCabinetDark);
  xformer.add(xformerCore);

  const xformerCoil = cyl(0.24, 0.24, 0.45, matCopper, 20);
  xformerCoil.position.y = 0.02;
  xformer.add(xformerCoil);

  // Crydom 40A / 600V Zero-Cross Solid State Relay (Module_SSR_HeaterDrive)
  const ssrGrp = new THREE.Group();
  ssrGrp.name = 'Module_SSR_HeaterDrive';
  ssrGrp.position.set(-0.60, 0.60, -0.80);
  electronicsBay.add(ssrGrp);
  register(ssrGrp, 'Module_SSR_HeaterDrive');

  const ssrBody = box(0.60, 0.18, 0.45, matICBody);
  ssrGrp.add(ssrBody);

  const ssrCover = box(0.58, 0.04, 0.43, matSSRCover);
  ssrCover.position.y = 0.10;
  ssrGrp.add(ssrCover);

  const ssrLED = cyl(0.02, 0.02, 0.02, matWireRed, 12);
  ssrLED.position.set(0, 0.11, 0);
  ssrGrp.add(ssrLED);

  for (let sx of [-0.22, 0.22]) {
    for (let sz of [-0.15, 0.15]) {
      const bolt = makeHexSocketBolt(0.02, 0.03);
      bolt.position.set(sx, 0.11, sz);
      ssrGrp.add(bolt);
    }
  }

  // Extruded Finned Aluminum Thermal Heatsink (Heatsink_SSR_Extruded)
  const heatsink = new THREE.Group();
  heatsink.name = 'Heatsink_SSR_Extruded';
  heatsink.position.set(-0.60, 0.40, -0.80);
  electronicsBay.add(heatsink);
  register(heatsink, 'Heatsink_SSR_Extruded');

  const hsBase = box(0.80, 0.08, 0.60, matAlumExtruded);
  heatsink.add(hsBase);

  for (let f = 0; f < 12; f++) {
    const fin = box(0.02, 0.22, 0.58, matAlumExtruded);
    fin.position.set(-0.35 + f * 0.064, -0.15, 0);
    heatsink.add(fin);
  }

  // 80mm Convective Cooling Blower Fan with Finger Guard Grille
  const fanGrp = new THREE.Group();
  fanGrp.name = 'Fan_CabinetCooling_Blower';
  fanGrp.position.set(0, 0.55, 1.75);
  electronicsBay.add(fanGrp);
  register(fanGrp, 'Fan_CabinetCooling_Blower');

  const fanFrame = box(0.82, 0.82, 0.18, matCabinetDark);
  fanGrp.add(fanFrame);

  const fanBore = cyl(0.38, 0.38, 0.20, matSteelBrushed, 24);
  fanBore.rotation.x = Math.PI / 2;
  fanGrp.add(fanBore);

  const fanHub = cyl(0.14, 0.14, 0.14, matCabinetDark, 16);
  fanHub.rotation.x = Math.PI / 2;
  fanBladesRef = new THREE.Group();
  fanBladesRef.add(fanHub);
  for (let b = 0; b < 7; b++) {
    const blade = box(0.04, 0.24, 0.06, matCabinetDark);
    blade.rotation.z = (b * Math.PI * 2) / 7;
    blade.position.set(Math.cos(blade.rotation.z) * 0.24, Math.sin(blade.rotation.z) * 0.24, 0);
    fanBladesRef.add(blade);
  }
  fanGrp.add(fanBladesRef);

  for (let r = 0.12; r <= 0.36; r += 0.08) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.01, 8, 24), matChrome);
    ring.position.z = 0.10;
    fanGrp.add(ring);
  }

  // M6 Brass Chassis Safety Ground Stud
  const gndStud = new THREE.Group();
  gndStud.name = 'Stud_ChassisGround_Brass';
  gndStud.position.set(-cabW / 2 + 0.35, baseY + 0.30, cabD / 2 - 0.08);
  electronicsBay.add(gndStud);
  register(gndStud, 'Stud_ChassisGround_Brass');

  const gndBolt = cyl(0.04, 0.04, 0.18, matBrass, 12);
  gndBolt.position.y = 0.09;
  gndStud.add(gndBolt);

  const gndNut = cyl(0.07, 0.07, 0.05, matBrass, 6);
  gndNut.position.y = 0.12;
  gndStud.add(gndNut);

  // Heavy Green/Yellow Grounding Wire
  const gndCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-cabW / 2 + 0.35, baseY + 0.40, cabD / 2 - 0.08),
    new THREE.Vector3(-cabW / 2 + 0.50, baseY + 0.35, 0.40),
    new THREE.Vector3(-0.60, baseY + 0.35, 0.10)
  ]);
  const gndTube = new THREE.Mesh(new THREE.TubeGeometry(gndCurve, 16, 0.02, 8, false), matWireGround);
  electronicsBay.add(gndTube);

  // Internal wiring enclosed cleanly within double walls and rear bay (ZERO wires in open air)
  const pwrCurve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, baseY + 0.70, -0.60),
    new THREE.Vector3(-1.10, baseY + 1.20, -0.20),
    new THREE.Vector3(-chW / 2 - wallRefT, chY - 0.20, chZ)
  ]);
  const pwrWire1 = new THREE.Mesh(new THREE.TubeGeometry(pwrCurve1, 20, 0.025, 8, false), matWireRed);
  electronicsBay.add(pwrWire1);

  const pwrCurve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, baseY + 0.70, -0.60),
    new THREE.Vector3(1.10, baseY + 1.20, -0.20),
    new THREE.Vector3(chW / 2 + wallRefT, chY - 0.20, chZ)
  ]);
  const pwrWire2 = new THREE.Mesh(new THREE.TubeGeometry(pwrCurve2, 20, 0.025, 8, false), matWireWhite);
  electronicsBay.add(pwrWire2);

  // -------------------------------------------------------------------------
  // 9. Top Stainless Exhaust Chimney Flue & Slide Damper
  // -------------------------------------------------------------------------
  const chimneyGroup = new THREE.Group();
  chimneyGroup.name = 'Body_ChimneyAssembly';
  chimneyGroup.position.set(0, baseY + cabH, chZ);
  furnaceBody.add(chimneyGroup);
  chimneyGroupRef = chimneyGroup;

  const chimneyPipe = cyl(0.24, 0.24, 0.90, matSteelBrushed, 24);
  chimneyPipe.name = 'Body_Chimney';
  chimneyPipe.position.y = 0.45;
  chimneyGroup.add(chimneyPipe);
  register(chimneyPipe, 'Body_Chimney');

  const damperLever = box(0.55, 0.03, 0.08, matSteelDark);
  damperLever.name = 'Pivot_Damper';
  damperLever.position.set(0.18, 0.30, 0);
  chimneyGroup.add(damperLever);
  damperLeverRef = damperLever;
  register(damperLever, 'Pivot_Damper');

  // -------------------------------------------------------------------------
  // 10. Rear I/O Panel & Power Continuity
  // -------------------------------------------------------------------------
  const rearIOPanel = new THREE.Group();
  rearIOPanel.name = 'Assembly_RearIOPanel';
  rearIOPanel.position.set(0, baseY + 0.80, cabD / 2);
  furnaceBody.add(rearIOPanel);

  // RS-485 Modbus DB-9 Serial Port
  const db9Grp = new THREE.Group();
  db9Grp.name = 'Port_RS485_DB9';
  db9Grp.position.set(-1.0, 0, 0.02);
  const db9Shell = box(0.26, 0.14, 0.06, matChrome);
  db9Grp.add(db9Shell);
  for (let p = 0; p < 9; p++) {
    const pin = cyl(0.006, 0.006, 0.04, matGoldPins, 8);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(-0.08 + (p % 5) * 0.04, p < 5 ? 0.02 : -0.02, 0.02);
    db9Grp.add(pin);
  }
  rearIOPanel.add(db9Grp);
  register(db9Grp, 'Port_RS485_DB9');

  // USB-B Port
  const usbGrp = new THREE.Group();
  usbGrp.name = 'Port_USB_B';
  usbGrp.position.set(-0.50, 0, 0.02);
  const usbShell = box(0.14, 0.14, 0.06, matChrome);
  usbGrp.add(usbShell);
  rearIOPanel.add(usbGrp);
  register(usbGrp, 'Port_USB_B');

  // IEC C19 Heavy-Duty Power Inlet with Fuse Drawer
  const iecGrp = new THREE.Group();
  iecGrp.name = 'Port_IEC_Inlet';
  iecGrp.position.set(0.80, 0, 0.02);
  const iecHousing = box(0.36, 0.28, 0.08, matCabinetDark);
  iecGrp.add(iecHousing);
  for (let pr = 0; pr < 3; pr++) {
    const prong = box(0.02, 0.06, 0.04, matBrass);
    prong.position.set(-0.08 + pr * 0.08, 0, 0.02);
    iecGrp.add(prong);
  }
  rearIOPanel.add(iecGrp);
  register(iecGrp, 'Port_IEC_Inlet');

  // -------------------------------------------------------------------------
  // 11. High-Temperature Labware Accessories
  // -------------------------------------------------------------------------
  // High-purity Al2O3 Crucible on Center Hearth Slab
  const cruc1 = new THREE.Group();
  cruc1.name = 'Body_Crucible_Al2O3_1';
  cruc1.position.set(0, -chH / 2 + 0.08, 0);
  muffleGroup.add(cruc1);
  crucibleInChamber = cruc1;
  register(cruc1, 'Body_Crucible_Al2O3_1');

  const cruc1Body = cyl(0.24, 0.18, 0.35, matCrucibleAl2O3, 24);
  cruc1Body.name = 'Body_CrucibleBody1';
  cruc1Body.position.y = 0.175;
  cruc1.add(cruc1Body);

  const cruc1Lid = cyl(0.26, 0.26, 0.04, matCrucibleAl2O3, 24);
  cruc1Lid.name = 'Body_CrucibleLid1';
  cruc1Lid.position.y = 0.37;
  cruc1.add(cruc1Lid);

  // Gooch Porcelain Crucible on Bench Side
  const crucGooch = new THREE.Group();
  crucGooch.name = 'Body_Crucible_Porcelain';
  crucGooch.position.set(3.0, 0, 0.40);
  root.add(crucGooch);
  register(crucGooch, 'Body_Crucible_Porcelain');

  const goochBody = cyl(0.22, 0.15, 0.32, matCrucibleGooch, 24);
  goochBody.position.y = 0.16;
  crucGooch.add(goochBody);

  // Long-reach (450 mm) Stainless Steel Crucible Tongs resting on bench
  const tongsGroup = new THREE.Group();
  tongsGroup.name = 'Body_CrucibleTongs';
  tongsGroup.position.set(-3.0, 0.02, -0.60);
  tongsGroup.rotation.y = -0.35;
  root.add(tongsGroup);
  register(tongsGroup, 'Body_CrucibleTongs');

  const tongArm1 = box(0.03, 0.02, 2.25, matSteelBrushed);
  tongArm1.position.set(-0.04, 0, 0);
  tongsGroup.add(tongArm1);

  const tongArm2 = box(0.03, 0.02, 2.25, matSteelBrushed);
  tongArm2.position.set(0.04, 0, 0);
  tongsGroup.add(tongArm2);

  const tongPivotPin = cyl(0.03, 0.03, 0.05, matBrass, 16);
  tongPivotPin.position.set(0, 0.02, 0.40);
  tongsGroup.add(tongPivotPin);

  // Aluminized Kevlar High-Temp Thermal Gloves on bench
  const gloveGroup = new THREE.Group();
  gloveGroup.name = 'Body_KevlarGloves';
  gloveGroup.position.set(-3.0, 0, 0.90);
  root.add(gloveGroup);
  register(gloveGroup, 'Body_KevlarGloves');

  const gloveL = box(0.38, 0.10, 0.70, matKevlarGlove);
  gloveL.position.set(-0.25, 0.05, 0);
  gloveGroup.add(gloveL);

  const gloveR = box(0.38, 0.10, 0.70, matKevlarGlove);
  gloveR.position.set(0.25, 0.05, 0);
  gloveGroup.add(gloveR);

  // -------------------------------------------------------------------------
  // 12. Physical Circuit Continuity: Bench Receptacle & SJTOW Cord
  // -------------------------------------------------------------------------
  const outletGrp = new THREE.Group();
  outletGrp.name = 'Power_Receptacle_Duplex';
  outletGrp.position.set(-3.4, 0.15, 2.6);
  root.add(outletGrp);
  register(outletGrp, 'Power_Receptacle_Duplex');

  const outBox = box(0.40, 0.45, 0.30, matCabinetDark);
  outletGrp.add(outBox);

  const outFace = box(0.36, 0.40, 0.02, matSteelBrushed);
  outFace.position.z = -0.15;
  outletGrp.add(outFace);

  const plugGrp = new THREE.Group();
  plugGrp.name = 'Power_Plug_NEMA';
  plugGrp.position.set(-3.4, 0.15, 2.40);
  root.add(plugGrp);
  register(plugGrp, 'Power_Plug_NEMA');

  const plugBody = box(0.18, 0.18, 0.22, matRubberNBR);
  plugGrp.add(plugBody);

  // Flexible heavy 3-conductor SJTOW power cord
  const cordCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.4, 0.15, 2.25),
    new THREE.Vector3(-2.8, 0.06, 2.0),
    new THREE.Vector3(-1.0, 0.06, 2.4),
    new THREE.Vector3(0.80, baseY + 0.80, cabD / 2 + 0.15)
  ]);
  const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 24, 0.045, 12, false), matRubberNBR);
  cordMesh.name = 'Power_Cord_SJTOW';
  root.add(cordMesh);
  register(cordMesh, 'Power_Cord_SJTOW');

  // Initialize Door Sealed & Closed at t = 0
  setDoorOpen(0.0);

  return root;
}

/**
 * Updates vertical sliding lift door kinematics
 * Stroke is calibrated to clear throat seal and stop flush with the lintel
 * (+240mm rated stroke) with ZERO ceiling / roofline clipping.
 *
 * @param {number} openRatio - 0.0 = completely sealed, 1.0 = fully raised upward
 */
export function setDoorOpen(openRatio) {
  if (!doorAssemblyGroup) return;

  const t = THREE.MathUtils.clamp(openRatio, 0.0, 1.0);

  const cabD = 4.55;
  const initialDoorY = 2.90; // Center Y when closed
  const initialDoorZ = -cabD / 2 - 0.08; // Flush against perimeter rope seal

  // Forward clearance translation (160mm forward to clear seal gasket)
  // then vertical upward lift stroke (1.30m vertical lift)
  const deltaZ = -0.16 * Math.sin(t * Math.PI * 0.5);
  const deltaY = 1.30 * t;

  // Door translates maintaining strictly vertical posture with zero roof clipping
  doorAssemblyGroup.position.set(0, initialDoorY + deltaY, initialDoorZ + deltaZ);

  // Internal sliding guide carriages slide vertically inside side columns
  if (slideCarriageL && slideCarriageR) {
    slideCarriageL.position.y = 2.90 + deltaY;
    slideCarriageR.position.y = 2.90 + deltaY;
  }

  // Internal counterbalance gas struts extend smoothly
  if (gasStrutRodL && gasStrutRodR) {
    const rodExt = THREE.MathUtils.lerp(1.35, 1.95, t);
    gasStrutRodL.position.y = rodExt;
    gasStrutRodR.position.y = rodExt;
  }

  // Plunger safety microswitch in throat jamb trips automatically
  if (doorInterlockSwitchRef) {
    const swPlunger = doorInterlockSwitchRef.children[1];
    if (swPlunger) {
      swPlunger.position.z = t > 0.03 ? -0.18 : -0.13;
    }
  }
}

/**
 * Rotates physical rotary mains disconnect switch
 * @param {boolean} isOn - true = 1 (vertical), false = 0 (horizontal)
 */
export function setMainsSwitchRotation(isOn) {
  if (!switchKnobRef) return;
  switchKnobRef.rotation.x = isOn ? 0 : Math.PI / 2;
}

/**
 * Animates momentary tactile depression of physical buttons
 */
export function animateButtonDepress(btnMesh) {
  if (!btnMesh) return;
  const origZ = btnMesh.position.z;
  btnMesh.position.z -= 0.02; // Depress inward
  setTimeout(() => {
    btnMesh.position.z = origZ;
  }, 120);
}

/**
 * Dynamically scales blackbody thermal radiation color, intensity, and chamber light
 * @param {number} tempC - chamber temperature in °C
 */
export function setChamberTemperature(tempC) {
  const t = THREE.MathUtils.clamp(tempC, 20, 1250);

  let r = 0, g = 0, b = 0, emissiveIntensity = 0;

  if (t < 480) {
    // Below Draper point: blackbody radiation in visible spectrum is negligible
    r = 0.05; g = 0.05; b = 0.05;
    emissiveIntensity = 0.0;
  } else if (t < 750) {
    // 500°C - 750°C: Faint red to cherry red
    const frac = (t - 480) / (750 - 480);
    r = 0.60 + 0.35 * frac;
    g = 0.08 * frac;
    b = 0.02 * frac;
    emissiveIntensity = 0.25 + 0.65 * frac;
  } else if (t < 1000) {
    // 750°C - 1000°C: Cherry red to bright orange
    const frac = (t - 750) / (1000 - 750);
    r = 0.95 + 0.05 * frac;
    g = 0.15 + 0.45 * frac;
    b = 0.02 + 0.08 * frac;
    emissiveIntensity = 0.90 + 1.10 * frac;
  } else {
    // 1000°C - 1200°C+: High yellow-white thermal glow
    const frac = (t - 1000) / (1200 - 1000);
    r = 1.0;
    g = 0.60 + 0.35 * frac;
    b = 0.10 + 0.50 * frac;
    emissiveIntensity = 2.00 + 1.50 * frac;
  }

  const glowCol = new THREE.Color(r, g, b);

  matHeatingElement.emissive.copy(glowCol);
  matHeatingElement.emissiveIntensity = emissiveIntensity * 1.8;

  matChamberGlow.emissive.copy(glowCol);
  matChamberGlow.emissiveIntensity = emissiveIntensity * 0.9;

  matPlugHotFace.emissive.copy(glowCol);
  matPlugHotFace.emissiveIntensity = emissiveIntensity * 0.6;

  if (chamberPointLight) {
    chamberPointLight.color.copy(glowCol);
    chamberPointLight.intensity = emissiveIntensity * 2.8;
  }
}

/**
 * Toggles crucible inside chamber vs removed
 */
export function setCrucibleInChamber(inside) {
  if (!crucibleInChamber) return;
  crucibleInChamber.visible = inside;
}

/**
 * Updates dynamic LCD texture on Eurotherm 3216 quad
 */
export function setLcdTexture(textureOrCanvas) {
  if (!lcdMeshRef || !textureOrCanvas) return;
  if (textureOrCanvas.isTexture) {
    lcdMeshRef.material.map = textureOrCanvas;
    lcdMeshRef.material.needsUpdate = true;
  } else if (textureOrCanvas.nodeName === 'CANVAS' || textureOrCanvas.getContext) {
    if (!lcdMeshRef.material.map) {
      const tex = new THREE.CanvasTexture(textureOrCanvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      lcdMeshRef.material.map = tex;
      lcdMeshRef.material.needsUpdate = true;
    } else {
      lcdMeshRef.material.map.image = textureOrCanvas;
      lcdMeshRef.material.map.needsUpdate = true;
    }
  }
}

/**
 * Animates exploded view separation of assemblies
 */
export function setExplodeAmount(factor) {
  if (!furnaceRoot) return;
  const f = THREE.MathUtils.clamp(factor, 0.0, 1.0);

  // Chimney moves upward
  if (chimneyGroupRef) {
    chimneyGroupRef.position.y = (0.10 + 5.15) + f * 1.6;
  }

  // Door assembly explodes outward
  if (doorAssemblyGroup) {
    doorAssemblyGroup.position.z = (-4.55 / 2 - 0.08) - f * 2.2;
  }

  // Outer cabinet shell lifts upward to reveal muffle and electronics
  if (cabinetShellGroup) {
    cabinetShellGroup.position.y = f * 2.5;
  }
}

/**
 * Toggles wireframe inspection mode across all meshes
 */
export function setWireframe(enabled) {
  if (!furnaceRoot) return;
  furnaceRoot.traverse(child => {
    if (child.isMesh && child.material && child.name !== 'UI_LCD') {
      child.material.wireframe = enabled;
    }
  });
}

/**
 * Focuses camera / highlights specific sub-assembly
 */
export function focusPart(partId) {
  const mesh = partsMap.get(partId);
  if (!mesh) return null;
  return mesh;
}

export function clearPartFocus() {
  // Reset focus highlights
}

/**
 * Builds standard laboratory room setting with datum bench at Y=0
 */
export function buildLabRoom(scene) {
  const roomGroup = new THREE.Group();
  roomGroup.name = 'Environment_LabRoom';

  // Black epoxy resin chemical bench surface at datum Y = 0
  const benchGeo = new THREE.BoxGeometry(BENCH.width, BENCH.thickness, BENCH.depth);
  const benchMat = new THREE.MeshStandardMaterial({
    color: 0x181a20,
    roughness: 0.28,
    metalness: 0.12
  });
  const benchMesh = new THREE.Mesh(benchGeo, benchMat);
  benchMesh.name = 'INSTRUMENT_BENCH';
  benchMesh.position.set(0, -BENCH.thickness / 2, 0);
  benchMesh.receiveShadow = true;
  roomGroup.add(benchMesh);

  // Stainless steel front edge trim
  const trimGeo = new THREE.BoxGeometry(BENCH.width + 0.04, BENCH.thickness + 0.02, 0.06);
  const trimMesh = new THREE.Mesh(trimGeo, matSteelBrushed);
  trimMesh.position.set(0, -BENCH.thickness / 2, -BENCH.depth / 2 - 0.01);
  roomGroup.add(trimMesh);

  // Rear laboratory tile backsplash wall
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x1e2430,
    roughness: 0.55,
    metalness: 0.05
  });
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(22.0, 16.0, 0.50), wallMat);
  backWall.position.set(0, 7.5, BENCH.depth / 2 + 0.25);
  backWall.receiveShadow = true;
  roomGroup.add(backWall);

  scene.add(roomGroup);
  return roomGroup;
}
