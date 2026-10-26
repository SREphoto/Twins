/**
 * ERWEKA ZT 322 Tablet Disintegration Tester (USP <701> / Ph. Eur. 2.9.1) Web Application
 * Centrifuge Gold Standard UI Parity:
 * - Right-hand collapsible panels (01 Control panel, 02 Part explorer, 03 Lab bench) + Hide Panels
 * - Topbar VIEW switcher (MODERN, + RETRO, ☾ NIGHT) + 3D Stage Switcher (Plate, Lab Room, Callouts)
 * - Dynamic 2D-projected SVG leader-line callouts (#cm-callouts-svg)
 * - Wireframe mode (#btn-wireframe) + Part Explorer Isolate-in-Solid / Others-in-Wireframe
 * - Light & Mood controls (Dark Lab, Light Lab, Dim Studio, Cool Cleanroom, Warm Tungsten, Retro Paper, Night Red)
 * - 10-Chapter Narrated Guided Tour (Stages 1–6 + Internal Anatomy 7A–7D)
 */

import * as THREE from 'three';
import { Disintegration3D } from './disintegration3d.js?v=20261026-zt2';
import { DisintegrationSfx } from './sfx.js?v=20261026-zt2';
import { initChemMateTheme } from '../../../lab_viewer/shared/chemmate_theme_manager.js';

// ----------------------------------------------------------------------------
// Analytical Sample Profiles (USP <701>)
// ----------------------------------------------------------------------------
const SAMPLE_PROFILES = {
  aspirin_ir: {
    id: 'aspirin_ir',
    shortLabel: 'ASPIRIN 500mg IR',
    title: 'Aspirin 500 mg Immediate-Release',
    monograph: 'USP <701> Uncoated Compressed Tablets · Limit 15:00 in 37.0 °C Gastric Fluid',
    disintTimeSec: 210,
    limitSec: 900,
    media: '0.1 N HCl Simulated Gastric Fluid (pH 1.2)',
    targetTemp: 37.0,
    color: '#f8fafc'
  },
  ibuprofen_fc: {
    id: 'ibuprofen_fc',
    shortLabel: 'IBUPROFEN 400mg FC',
    title: 'Ibuprofen 400 mg Film-Coated',
    monograph: 'USP <701> Film-Coated Tablets · Limit 30:00 in 37.0 °C Simulated Gastric Media',
    disintTimeSec: 420,
    limitSec: 1800,
    media: '0.1 N HCl Simulated Gastric Fluid',
    targetTemp: 37.0,
    color: '#fb923c'
  },
  enteric_pantoprazole: {
    id: 'enteric_pantoprazole',
    shortLabel: 'PANTOPRAZOLE 40mg EC',
    title: 'Pantoprazole 40 mg Enteric-Coated',
    monograph: 'USP <701> Delayed-Release · Stage 1 Acid (60 min intact) → Stage 2 pH 6.8 Buffer',
    disintTimeSec: 540,
    limitSec: 3600,
    media: 'pH 6.8 Phosphate Buffer (Stage 2)',
    targetTemp: 37.0,
    color: '#fde047'
  },
   rapid_odt: {
    id: 'rapid_odt',
    shortLabel: 'ONDANSETRON 8mg ODT',
    title: 'Ondansetron 8 mg Orally Disintegrating (ODT)',
    monograph: 'USP <701> / FDA ODT Guidance · Rapid Disintegration ≤ 30–60 sec',
    disintTimeSec: 45,
    limitSec: 180,
    media: 'Purified Water USP at 37.0 °C',
    targetTemp: 37.0,
    color: '#38bdf8'
  },
  vitamin_c: {
    id: 'vitamin_c',
    shortLabel: 'ASCORBIC ACID 1000mg',
    title: 'Ascorbic Acid 1000 mg Compressed',
    monograph: 'USP <2040> Dietary Supplements · Limit 30:00 in Purified Water',
    disintTimeSec: 480,
    limitSec: 1800,
    media: 'Purified Water USP',
    targetTemp: 37.0,
    color: '#facc15'
  },
  enteric_acid: {
    id: 'enteric_acid',
    shortLabel: 'ENTERIC ASPIRIN ACID',
    title: 'Enteric-Coated Aspirin (Stage 1 Acid Resistance)',
    monograph: 'USP <701> Delayed-Release Stage 1 · Must remain 100% intact in 0.1 N HCl',
    disintTimeSec: 9999,
    limitSec: 3600,
    media: '0.1 N HCl (pH 1.2)',
    targetTemp: 37.0,
    color: '#a7f3d0'
  }
};

// ----------------------------------------------------------------------------
// Semantic Part Explorer Catalog (Grouped like Centrifuge Twin)
// ----------------------------------------------------------------------------
const PART_CATALOG = [
  // Assemblies
  { id: 'Body_Chassis', label: 'Unibody Structural Frame & Base', group: 'Assemblies' },
  { id: 'Body_EnclosureShell', label: 'Sheet-Metal Outer Enclosure Shell', group: 'Assemblies' },
  { id: 'Body_Bath', label: 'Acrylic Thermostatted Water Bath Assembly', group: 'Assemblies' },
  { id: 'Body_DriveHead', label: 'Cantilevered Dual-Station Basket Drive Head', group: 'Assemblies' },
  { id: 'Body_KinematicDrive', label: 'Precision Harmonic Crank & Z-Lift Column', group: 'Assemblies' },
  { id: 'Body_ElectronicsBay', label: 'Internal Power, Motherboard & Telemetry Bay', group: 'Assemblies' },

  // Glass & Bath
  { id: 'Glass_BathWalls', label: 'Clear PMMA Acrylic Bath Vessel (10 mm)', group: 'Glass & Bath' },
  { id: 'Glass_BathWater', label: 'Thermostatted Water Volume (37.0 °C)', group: 'Glass & Bath' },
  { id: 'Body_Heater_ImmersionCoil', label: '1000W Incoloy 800 Immersion Heater Coil', group: 'Glass & Bath' },
  { id: 'Glass_Beaker_01', label: 'Station A: 1000 mL Borosilicate Griffin Beaker', group: 'Glass & Bath' },
  { id: 'Glass_Beaker_02', label: 'Station B: 1000 mL Borosilicate Griffin Beaker', group: 'Glass & Bath' },

  // Apparatus A Baskets
  { id: 'Pivot_BasketArm_Left', label: 'Station A: 6-Tube USP Basket-Rack Assembly', group: 'Apparatus Baskets' },
  { id: 'Pivot_BasketArm_Right', label: 'Station B: 6-Tube USP Basket-Rack Assembly', group: 'Apparatus Baskets' },
  { id: 'Body_Mesh_Screen_01', label: 'Station A: 10-Mesh 316SS Woven Wire Screen', group: 'Apparatus Baskets' },
  { id: 'Body_Mesh_Screen_02', label: 'Station B: 10-Mesh 316SS Woven Wire Screen', group: 'Apparatus Baskets' },
  { id: 'Knob_Collet_QuickRelease_01', label: 'Station A: Magnetic Quick-Release Coupling Collet', group: 'Apparatus Baskets' },
  { id: 'Knob_Collet_QuickRelease_02', label: 'Station B: Magnetic Quick-Release Coupling Collet', group: 'Apparatus Baskets' },

  // Motors & Mechanics
  { id: 'Body_Motor_HarmonicStepper', label: 'M1: 24V BLDC Finned Servo Motor', group: 'Motors & Mechanics' },
  { id: 'Body_Gearbox_Planetary', label: '2-Stage Precision Planetary Gearbox (i=45:1)', group: 'Motors & Mechanics' },
  { id: 'Pivot_CrankDisc', label: 'Counterbalanced Eccentric Crank Flywheel (r=27.5mm)', group: 'Motors & Mechanics' },
  { id: 'Pivot_ConnectingRod', label: 'Forged Connecting Rod with Heim Bearings', group: 'Motors & Mechanics' },
  { id: 'Pivot_Crosshead_Slider', label: 'Linear Bronze/Aluminum Crosshead Bridge', group: 'Motors & Mechanics' },
  { id: 'Body_Motor_LiftActuator_Left', label: 'M2: Left NEMA 17 Stepper & Jaw Spider Coupler', group: 'Motors & Mechanics' },
  { id: 'Body_Motor_LiftActuator_Right', label: 'M3: Right NEMA 17 Stepper & Jaw Spider Coupler', group: 'Motors & Mechanics' },
  { id: 'Pivot_LeadScrew_Left', label: 'Left TR10x2 Trapezoidal Lead Screw & Brass Nut', group: 'Motors & Mechanics' },
  { id: 'Pivot_LeadScrew_Right', label: 'Right TR10x2 Trapezoidal Lead Screw & Brass Nut', group: 'Motors & Mechanics' },
  { id: 'Body_Motor_BathPump', label: 'M4: 24V Magnetic-Drive Bath Circulation Pump', group: 'Motors & Mechanics' },
  { id: 'Body_Fan_CabinetCooling_Blower', label: 'M5: 80mm Brushless Axial Cabinet Cooling Fan', group: 'Motors & Mechanics' },

  // Sensors & Optics
  { id: 'Body_Sensor_PT100_Bath', label: 'S1: Class A PT100 4-Wire RTD Thermal Probe', group: 'Sensors & Optics' },
  { id: 'Body_Sensor_HallTachometer', label: 'S2: Slotted Optical TDC/BDC Photo-Interrupter', group: 'Sensors & Optics' },
  { id: 'Body_Sensor_OpticalEncoder', label: 'S3: 1024-PPR Quadrature Optical Rotary Encoder', group: 'Sensors & Optics' },
  { id: 'Body_Sensor_LimitSwitch_Top', label: 'S4: Upper Roller-Lever Limit Microswitch', group: 'Sensors & Optics' },
  { id: 'Body_Sensor_LimitSwitch_Btm', label: 'S5: Lower Roller-Lever Limit Microswitch', group: 'Sensors & Optics' },
  { id: 'Body_Sensor_WaterLevel_Float', label: 'S6: Stainless Magnetic Reed Float Switch', group: 'Sensors & Optics' },
  { id: 'Body_Sensor_LaserDisintegration_01', label: 'Station A: 650nm Collimated Laser Detector', group: 'Sensors & Optics' },
  { id: 'Body_Sensor_LaserDisintegration_02', label: 'Station B: 650nm Collimated Laser Detector', group: 'Sensors & Optics' },
  { id: 'Glass_Mirror_OpticalRelay_01', label: 'Station A: 45° Dielectric Optical Relay Mirror', group: 'Sensors & Optics' },
  { id: 'Glass_Mirror_OpticalRelay_02', label: 'Station B: 45° Dielectric Optical Relay Mirror', group: 'Sensors & Optics' },

  // Data, Comms & Console
  { id: 'UI_LCD', label: 'High-DPI Graphic LCD Display Quad', group: 'Data & Comms' },
  { id: 'Body_PCB_Motherboard', label: 'FR-4 Main Instrument Controller Motherboard', group: 'Data & Comms' },
  { id: 'Body_Part_MCU_Core', label: 'U1: STM32H743 ARM Cortex-M7 LQFP-176 MCU', group: 'Data & Comms' },
  { id: 'Body_Part_RAM_Chip', label: 'U2: 512MB LPDDR4 Volatile System SDRAM', group: 'Data & Comms' },
  { id: 'Body_Part_SSD_Module', label: 'U3: 16GB eMMC NAND Flash CFR 21 Vault', group: 'Data & Comms' },
  { id: 'Body_Part_ADC_24Bit', label: 'U4: ADS1256 24-Bit Delta-Sigma PT100 ADC', group: 'Data & Comms' },
  { id: 'Body_Part_RTC_BatterySocket', label: 'BT1: CR2032 Battery-Backed Real-Time Clock', group: 'Data & Comms' },
  { id: 'Body_Part_WiFi_BLE_Module', label: 'U5: Shielded Wi-Fi 802.11ac & BLE 5.2 Radio', group: 'Data & Comms' },
  { id: 'Body_Antenna_WiFi_BLE', label: 'Rear 2.4 GHz Articulated Dipole Antenna', group: 'Data & Comms' },
  { id: 'Body_Port_RS232', label: 'Rear RS-232 DB9 Serial GLP Printer Port', group: 'Data & Comms' },
  { id: 'Body_Port_USB', label: 'Rear USB-B PC Host Interface Port', group: 'Data & Comms' },
  { id: 'Body_Part_USB_Drive', label: 'Rear USB-A Flash Drive (32GB GLP Audit Stick)', group: 'Data & Comms' },
  { id: 'Body_Port_RJ45_LAN', label: 'Rear RJ45 10/100 Ethernet LIMS Network Jack', group: 'Data & Comms' },

  // Power & Wiring
  { id: 'Body_Assembly_PowerSupply', label: 'PSU1: Mean Well LRS-150-24 Perforated Cage SMPS', group: 'Power & Wiring' },
  { id: 'Body_Part_ToroidalTransformer', label: 'T1: 180VA Helical Copper Toroidal Transformer', group: 'Power & Wiring' },
  { id: 'Body_Heatsink_SSR', label: 'SSR1: 25A Zero-Cross SSR & 11-Fin Heatsink', group: 'Power & Wiring' },
  { id: 'Body_Driver_Stepper_01', label: 'DRV1: Extruded Fin Microstepping Servo Driver', group: 'Power & Wiring' },
  { id: 'Body_Power_Receptacle_Duplex', label: 'Benchtop Hospital-Grade Duplex Outlet Box', group: 'Power & Wiring' },
  { id: 'Body_Power_Plug_NEMA', label: 'Molded NEMA 5-15P AC Power Plug', group: 'Power & Wiring' },
  { id: 'Body_Power_Cord_SJTOW', label: 'Heavy-Duty 3-Conductor SJTOW Mains Cord', group: 'Power & Wiring' },
  { id: 'Badge_SREdesigns', label: 'Official SREdesigns Brand Certification Badge', group: 'Assemblies' }
];

// ----------------------------------------------------------------------------
// 10-Chapter Guided Walkthrough & Voiceover Storyboard (Stages 1–6 + 7A–7D)
// ----------------------------------------------------------------------------
export const TOUR_CHAPTERS = [
  {
    id: 'STAGE_1',
    badge: 'STAGE 1 / 10 · POWER & CONTINUITY',
    title: 'Powering On & Hard Electrical Continuity',
    voiceover: 'Welcome to the S R E designs Digital Twin of the ERWEKA Z T 322 U S P 701 Tablet Disintegration Tester. Physical circuit continuity is enforced. Plugging the NEMA 5-15P cord into the bench duplex receptacle and engaging the rear breaker powers up the system into Standby.',
    camPos: [-5.8, 4.4, -7.8],
    camTarget: [-0.4, 2.2, -0.2],
    setup: (app) => {
      app.setExplodedValue(0);
      app.engine.setCutaway(false);
      app.engine.enclosureShell.visible = true;
      app.engine.bathGroup.visible = true;
      app.engine.driveGroup.visible = true;
      app.engine.driveHead.visible = true;
      app.isPluggedIn = true;
      app.powerSwitchOn = true;
      app.state = 'STANDBY';
      app.oscillationActive = false;
      app.heaterActive = false;
      app.basketLowered = false;
      app.syncToEngine();
    }
  },
  {
    id: 'STAGE_2',
    badge: 'STAGE 2 / 10 · PRODUCT & MEDIA SETUP',
    title: 'Preparing Beakers, Gastric Media, Tablets & Fluted Disks',
    voiceover: 'In Stage 2, the operator fills the optical acrylic bath, seats two one-thousand milliliter borosilicate Griffin beakers with simulated gastric fluid, and loads twelve dosage units with fluted cylindrical disks into the two U S P Apparatus A baskets.',
    camPos: [-3.8, 4.8, -6.2],
    camTarget: [0.0, 3.4, -0.85],
    setup: (app) => {
      app.basketLowered = false;
      app.resetTablets();
      app.syncToEngine();
    }
  },
  {
    id: 'STAGE_3',
    badge: 'STAGE 3 / 10 · INSERTION & SAFETY INTERLOCKS',
    title: 'Coupling Quick-Release Collets & Lowering into Immersion',
    voiceover: 'In Stage 3, each basket locks into the quick-release stainless steel collets on the horizontal bridge arm and lowers smoothly into the test media via dual trapezoidal lead screws, protected by low-water float cutoffs and stroke immersion clearances.',
    camPos: [-2.8, 3.9, -5.6],
    camTarget: [0.0, 2.9, -0.85],
    setup: (app) => {
      app.basketLowered = true;
      app.syncToEngine();
    }
  },
  {
    id: 'STAGE_4',
    badge: 'STAGE 4 / 10 · CONSOLE & SOFTWARE SETUP',
    title: 'Selecting USP Monograph & Pre-Heating Bath to 37.0 °C',
    voiceover: 'In Stage 4, the analyst selects the Immediate-Release Aspirin monograph on the front console, verifies the fifteen-minute timer, and engages the one-thousand-watt P I D immersion heater to equilibrate the water bath to thirty-seven degrees Celsius.',
    camPos: [0.35, 1.65, -4.6],
    camTarget: [0.35, 1.40, -2.0],
    setup: (app) => {
      app.heaterActive = true;
      app.bathTempC = 37.0;
      app.syncToEngine();
    }
  },
  {
    id: 'STAGE_5',
    badge: 'STAGE 5 / 10 · ACTIVE RUN & DISINTEGRATION PHYSICS',
    title: '30.0 CPM Sinusoidal Oscillation & Hydrodynamic Shear',
    voiceover: 'In Stage 5, pressing Start engages pure sinusoidal vertical oscillation at thirty strokes per minute across a fifty-five millimeter stroke. Hydrodynamic fluid shear and excipient swelling break down the tablets through the ten-mesh stainless screens while live telemetry streams to the L C D.',
    camPos: [-2.6, 3.6, -5.0],
    camTarget: [0.0, 2.8, -0.85],
    setup: (app) => {
      app.basketLowered = true;
      app.heaterActive = true;
      app.oscillationActive = true;
      app.state = 'RUNNING';
      app.bathTempC = 37.0;
      app.elapsedSeconds = 95;
      app.tabletFractions = app.tabletFractions.map((_, i) => Math.max(0.25, 0.58 - (i % 3) * 0.08));
      app.syncToEngine();
    }
  },
  {
    id: 'STAGE_6',
    badge: 'STAGE 6 / 10 · END-OF-RUN INSPECTION & GLP CSV',
    title: 'Automatic Park Lift, 10-Mesh Inspection & 21 CFR 11 Export',
    voiceover: 'In Stage 6, as soon as all twelve tablets disintegrate through the ten-mesh wire screens, the harmonic drive parks automatically, the baskets lift for visual inspection confirming zero firm cores remain, and a complete 21 C F R Part 11 C S V audit trail is exported.',
    camPos: [-2.8, 4.3, -5.4],
    camTarget: [0.0, 3.2, -0.85],
    setup: (app) => {
      app.oscillationActive = false;
      app.state = 'COMPLETE';
      app.basketLowered = false;
      app.elapsedSeconds = 210;
      app.tabletFractions = new Array(12).fill(0);
      app.syncToEngine();
    }
  },
  {
    id: 'STAGE_7A',
    badge: 'STAGE 7A / 10 · INTERNAL POWER SUPPLY & ROUTING',
    title: '180VA Toroidal XFMR, Perforated LRS-150-24 SMPS, 25A SSR & Harnesses',
    voiceover: 'Now let us inspect the internal engineering. In Stage 7A, AC mains power enters through the rear I E C inlet into a helical copper-wound toroidal isolation transformer, a Mean Well twenty-four volt switching power supply with perforated honeycomb cage and seven-screw barrier strip, and an eleven-fin solid-state heater relay, with cable-tied harnesses routing power across the floor pan.',
    camPos: [-3.2, 2.4, -2.6],
    camTarget: [-0.95, 0.45, 0.15],
    setup: (app) => {
      app.setExplodedValue(0);
      app.engine.enclosureShell.visible = false;
      app.engine.bathGroup.visible = false;
      app.engine.driveGroup.visible = true;
      app.engine.driveHead.visible = true;
      app.heaterActive = true;
      app.syncToEngine();
    }
  },
  {
    id: 'STAGE_7B',
    badge: 'STAGE 7B / 10 · ALL 5 INTERNAL MOTORS & ACTUATORS',
    title: 'Finned BLDC Servo + Planetary Gearbox, NEMA 17 Steppers, Pump & Blower',
    voiceover: 'In Stage 7B, we see all five internal motors: Motor 1 is the sixteen-fin brushless servo coupled to a two-stage planetary gearbox and counterbalanced crank flywheel; Motors 2 and 3 are laminated silicon-steel NEMA 17 steppers with red elastomer jaw spider couplings driving trapezoidal lead screws; Motor 4 is the magnetic-drive circulation pump with brass hose barbs; and Motor 5 is the rear cooling fan.',
    camPos: [-3.6, 4.2, -4.4],
    camTarget: [0.0, 2.8, 0.35],
    setup: (app) => {
      app.engine.enclosureShell.visible = false;
      app.engine.bathGroup.visible = true;
      app.oscillationActive = true;
      app.state = 'RUNNING';
      app.basketLowered = true;
      app.resetTablets();
      app.syncToEngine();
    }
  },
  {
    id: 'STAGE_7C',
    badge: 'STAGE 7C / 10 · INTERNAL SENSORS & 45° DIELECTRIC MIRRORS',
    title: 'PT100 RTD, Optical Encoders, Roller Microswitches & 45° Gimbal Mirrors',
    voiceover: 'In Stage 7C, internal sensors monitor every degree of freedom: a Class A P T 100 bath probe with stainless knurled union, slotted optical stroke interrupter, quadrature shaft encoder, roller-lever limit microswitches, magnetic reed float switch, and collimated laser detectors with forty-five-degree dielectric mirrors in kinematic gimbals.',
    camPos: [-2.8, 3.2, -3.8],
    camTarget: [-0.25, 2.35, -0.45],
    setup: (app) => {
      app.engine.enclosureShell.visible = false;
      app.engine.bathGroup.visible = true;
      app.syncToEngine();
    }
  },
  {
    id: 'STAGE_7D',
    badge: 'STAGE 7D / 10 · MOTHERBOARD, eMMC SSD, WI-FI / BLE & PORTS',
    title: 'STM32H743 QFP-176, LPDDR4, 16GB SSD, CR2032 RTC, Wi-Fi/BLE & Rear I/O',
    voiceover: 'Finally, in Stage 7D, the multi-layer FR-4 motherboard features gull-wing Q F P leads on the S T M 32 microcontroller, L P D D R 4 memory, a sixteen-gigabyte e M M C flash vault, twenty-four-bit A D C, C R 2032 battery socket, Phoenix Contact terminal blocks, and a shielded Wi-Fi and Bluetooth B L E module feeding the rear dipole antenna alongside R S-232, U S B, and Ethernet ports.',
    camPos: [1.85, 2.15, -2.35],
    camTarget: [0.35, 0.42, 0.35],
    setup: (app) => {
      app.engine.enclosureShell.visible = false;
      app.engine.bathGroup.visible = false;
      app.engine.driveGroup.visible = false;
      app.engine.driveHead.visible = false;
      app.syncToEngine();
    }
  }
];

// ----------------------------------------------------------------------------
// Main Application Controller
// ----------------------------------------------------------------------------
class DisintegrationApp {
  constructor() {
    this.viewport = document.getElementById('viewport3d') || document.getElementById('viewport');
    this.engine = new Disintegration3D(this.viewport);
    this.sfx = new DisintegrationSfx();

    // Electrical continuity (Rule 9 & DIAG-014)
    this.isPluggedIn = true;
    this.powerSwitchOn = true;

    // Instrument operational state
    this.state = 'STANDBY';
    this.bathTempC = 37.0;
    this.targetTempC = 37.0;
    this.targetCpm = 30.0;
    this.heaterActive = true;
    this.oscillationActive = false;
    this.basketLowered = true;
    this.strokeCount = 0;
    this.elapsedSeconds = 0;

    this.selectedSample = SAMPLE_PROFILES.aspirin_ir;
    this.testDurationSeconds = this.selectedSample.limitSec;
    this.tabletFractions = new Array(12).fill(1.0);
    this.selectedTubeIndex = 0;

    // View & theme state
    this.currentTheme = 'modern';
    this.currentStageMode = 'plate';
    this.calloutsVisible = true;
    this.panelsHidden = false;
    this.explorerPartId = null;

    this.auditLog = [];

    // Hook 2D SVG callout projection into the 3D render loop
    this.engine.onAfterFrame = () => {
      this.updateChemMateCallouts();
      this.syncZoomSliderFromCamera();
    };

    this.initPartExplorer();
    this.initBasketGrids();
    this.initEventListeners();
    this.initThemeAndCallouts();
    this.syncToEngine();

    // Keep aspect ratio sharp when side panels collapse/expand
    if (window.ResizeObserver && this.viewport) {
      const ro = new ResizeObserver(() => this.engine.onWindowResize());
      ro.observe(this.viewport);
    }

    // 10 Hz physics & disintegration simulation tick
    setInterval(() => this.tick(0.1), 100);
  }

  get hasPower() {
    return this.isPluggedIn && this.powerSwitchOn;
  }

  resetTablets() {
    this.tabletFractions = new Array(12).fill(1.0);
    this.elapsedSeconds = 0;
    this.strokeCount = 0;
  }

  // --------------------------------------------------------------------------
  // Synchronize App State -> 3D Engine & DOM HUD
  // --------------------------------------------------------------------------
  syncToEngine() {
    const e = this.engine;
    e.state.isPluggedIn = this.isPluggedIn;
    e.state.switchOn = this.powerSwitchOn;
    e.state.state = this.hasPower ? this.state : 'POWER_OFF';
    e.state.bathTempC = this.bathTempC;
    e.state.targetTempC = this.targetTempC;
    e.state.heaterOn = this.hasPower && this.heaterActive;
    e.state.targetCpm = this.targetCpm;
    e.state.currentCpm = (this.hasPower && this.oscillationActive) ? this.targetCpm : 0.0;
    e.state.strokeCount = this.strokeCount;
    e.state.elapsedS = this.elapsedSeconds;
    e.state.targetDurationS = this.testDurationSeconds;
    e.state.basketLowered = this.basketLowered;
    e.state.sampleName = this.selectedSample.shortLabel;
    e.state.tabletSize = [...this.tabletFractions];

    e.updatePowerCord();
    e.renderLCD();
    this.updateUI();
  }

  // --------------------------------------------------------------------------
  // Electrical Continuity & Tactile Controls
  // --------------------------------------------------------------------------
  togglePlug() {
    this.isPluggedIn = !this.isPluggedIn;
    this.sfx.click();
    if (!this.hasPower) {
      this.state = 'POWER_OFF';
      this.oscillationActive = false;
      this.heaterActive = false;
      this.sfx.stopMotor();
      this.sfx.stopPump();
    } else {
      this.state = 'STANDBY';
    }
    this.syncToEngine();
  }

  togglePowerSwitch() {
    this.powerSwitchOn = !this.powerSwitchOn;
    this.sfx.click();
    if (!this.hasPower) {
      this.state = 'POWER_OFF';
      this.oscillationActive = false;
      this.heaterActive = false;
      this.sfx.stopMotor();
      this.sfx.stopPump();
    } else {
      this.state = 'STANDBY';
    }
    this.syncToEngine();
  }

  startTest() {
    if (!this.hasPower) return;
    this.sfx.click();
    this.sfx.startMotor(this.targetCpm);
    if (this.tabletFractions.every((f) => f <= 0.02)) {
      this.resetTablets();
    }
    this.basketLowered = true;
    this.oscillationActive = true;
    this.state = 'RUNNING';
    this.logEvent(`Started USP <701> run (${this.selectedSample.title}) at ${this.targetCpm.toFixed(1)} CPM`);
    this.syncToEngine();
  }

  stopTest() {
    if (!this.hasPower) return;
    this.sfx.click();
    this.sfx.stopMotor();
    this.oscillationActive = false;
    if (this.state === 'RUNNING') {
      this.state = 'STANDBY';
    }
    this.logEvent(`Stopped oscillation at t=${this.elapsedSeconds.toFixed(0)}s (${this.strokeCount} strokes)`);
    this.syncToEngine();
  }

  toggleHeater() {
    if (!this.hasPower) return;
    this.sfx.click();
    this.sfx.relayThud();
    this.heaterActive = !this.heaterActive;
    if (this.heaterActive) this.sfx.startPump();
    else this.sfx.stopPump();
    this.syncToEngine();
  }

  toggleLift() {
    if (!this.hasPower) return;
    this.sfx.click();
    this.basketLowered = !this.basketLowered;
    this.syncToEngine();
  }

  adjustCpm(delta) {
    if (!this.hasPower) return;
    this.sfx.click();
    this.targetCpm = Math.max(20.0, Math.min(35.0, +(this.targetCpm + delta).toFixed(1)));
    this.syncToEngine();
  }

  adjustTemp(delta) {
    if (!this.hasPower) return;
    this.sfx.click();
    this.targetTempC = Math.max(25.0, Math.min(42.0, +(this.targetTempC + delta).toFixed(1)));
    this.syncToEngine();
  }

  adjustTime(deltaSec) {
    if (!this.hasPower) return;
    this.sfx.click();
    this.testDurationSeconds = Math.max(60, Math.min(7200, this.testDurationSeconds + deltaSec));
    this.syncToEngine();
  }

  // --------------------------------------------------------------------------
  // 10 Hz Simulation Tick
  // --------------------------------------------------------------------------
  tick(dt) {
    if (!this.hasPower) {
      this.bathTempC += (21.5 - this.bathTempC) * 0.008 * dt;
      this.syncToEngine();
      return;
    }

    // PID Bath temperature regulation
    if (this.heaterActive) {
      const err = this.targetTempC - this.bathTempC;
      this.bathTempC += err * 0.08 * dt;
    } else {
      this.bathTempC += (21.5 - this.bathTempC) * 0.01 * dt;
    }

    if (this.oscillationActive && this.state === 'RUNNING') {
      this.elapsedSeconds += dt;
      this.strokeCount = Math.floor((this.elapsedSeconds / 60.0) * this.targetCpm);

      // Per-tube stochastic slight variance around monograph disintegration time
      const baseT = this.selectedSample.disintTimeSec;
      let intactCount = 0;
      for (let i = 0; i < 12; i++) {
        const tubeFactor = 0.88 + ((i * 7) % 5) * 0.055;
        const tubeDisintT = baseT * tubeFactor;
        const frac = Math.max(0, 1.0 - this.elapsedSeconds / tubeDisintT);
        this.tabletFractions[i] = frac;
        if (frac > 0.02) intactCount++;
      }

      if (Math.floor(this.elapsedSeconds * 10) % 50 === 0) {
        this.auditLog.push({
          time: this.elapsedSeconds.toFixed(1),
          strokes: this.strokeCount,
          cpm: this.targetCpm.toFixed(1),
          temp: this.bathTempC.toFixed(2),
          intact: intactCount
        });
      }

      if (intactCount === 0 || this.elapsedSeconds >= this.testDurationSeconds) {
        this.oscillationActive = false;
        this.state = 'COMPLETE';
        this.basketLowered = false; // Automatic park lift on completion
        this.sfx.stopMotor();
        this.sfx.chime();
        this.logEvent(
          intactCount === 0
            ? `PASS USP <701>: All 12 tablets disintegrated in ${this.elapsedSeconds.toFixed(0)}s (${this.strokeCount} strokes). Auto-lifted baskets.`
            : `TIME LIMIT REACHED (${this.testDurationSeconds}s): ${intactCount}/12 tablets remain intact.`
        );
      }
    }

    this.syncToEngine();
  }

  logEvent(msg) {
    const logEl = document.getElementById('sep-log');
    if (logEl) {
      const ts = new Date().toLocaleTimeString();
      logEl.textContent = `[${ts}] ${msg}\n` + logEl.textContent;
    }
    const labSt = document.getElementById('lab-status');
    if (labSt) labSt.textContent = msg;
  }

  // --------------------------------------------------------------------------
  // Basket A & B 6-Tube Interactive Grids & Cross-Section Preview Canvas
  // --------------------------------------------------------------------------
  initBasketGrids() {
    const gridA = document.getElementById('basket-a-grid');
    const gridB = document.getElementById('basket-b-grid');
    if (gridA) {
      gridA.innerHTML = '';
      for (let i = 0; i < 6; i++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'tablet-cell';
        cell.dataset.tubeIdx = String(i);
        cell.addEventListener('click', () => {
          this.selectedTubeIndex = i;
          this.updateBasketGrids();
        });
        gridA.appendChild(cell);
      }
    }
    if (gridB) {
      gridB.innerHTML = '';
      for (let i = 6; i < 12; i++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'tablet-cell';
        cell.dataset.tubeIdx = String(i);
        cell.addEventListener('click', () => {
          this.selectedTubeIndex = i;
          this.updateBasketGrids();
        });
        gridB.appendChild(cell);
      }
    }
    this.updateBasketGrids();
  }

  updateBasketGrids() {
    document.querySelectorAll('.tablet-cell').forEach((cell) => {
      const idx = parseInt(cell.dataset.tubeIdx, 10);
      const frac = this.tabletFractions[idx] ?? 1.0;
      const pct = Math.round(frac * 100);
      cell.classList.toggle('is-complete', pct <= 2);
      cell.classList.toggle('active', idx === this.selectedTubeIndex);
      cell.innerHTML = `<span>T${idx + 1}</span><span class="pct">${pct}%</span>`;
    });
    this.drawTubePreview();
  }

  drawTubePreview() {
    const cvs = document.getElementById('tube-preview');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const w = cvs.width;
    const h = cvs.height;

    const isRetro = this.currentTheme === 'retro';
    ctx.fillStyle = isRetro ? '#f5efe2' : '#090d14';
    ctx.fillRect(0, 0, w, h);

    const idx = this.selectedTubeIndex || 0;
    const frac = Math.max(0, Math.min(1, this.tabletFractions[idx] ?? 1.0));

    // Draw immersion medium meniscus
    ctx.fillStyle = isRetro ? 'rgba(14, 165, 233, 0.16)' : 'rgba(56, 189, 248, 0.14)';
    ctx.fillRect(34, 42, w - 68, h - 76);

    // Draw glass tube walls (21.5 mm ID)
    ctx.strokeStyle = isRetro ? '#334155' : '#94a3b8';
    ctx.lineWidth = 3;
    ctx.strokeRect(34, 24, w - 68, h - 58);

    // Draw bottom 10-mesh woven stainless wire cloth (2.0 mm aperture)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(32, h - 34);
    ctx.lineTo(w - 32, h - 34);
    ctx.stroke();
    for (let x = 42; x < w - 36; x += 12) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x, h - 37, 6, 6);
    }

    // Draw tablet core & effervescent / shear particle plume
    const tabY = h - 46 - (this.oscillationActive ? Math.abs(Math.sin(performance.now() * 0.005)) * 18 : 0);
    if (frac > 0.02) {
      const rx = 28 * Math.cbrt(frac);
      const ry = 11 * Math.cbrt(frac);
      ctx.fillStyle = this.selectedSample.color || '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(w / 2, tabY, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Draw V-grooved fluted polycarbonate disk above tablet
    const diskY = tabY - 24;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.fillRect(44, diskY - 14, w - 88, 16);
    ctx.strokeRect(44, diskY - 14, w - 88, 16);

    // Caption
    ctx.fillStyle = isRetro ? '#1e293b' : '#cbd5e1';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillText(`TUBE #${idx + 1} · ${(frac * 100).toFixed(0)}% MASS`, 14, 16);
    ctx.fillText('10-MESH (2.0mm) SCREEN', 18, h - 12);

    const meta = document.getElementById('tube-preview-meta');
    if (meta) {
      meta.innerHTML =
        `<div><b>Tube #${idx + 1}</b> (${idx < 6 ? 'Basket A' : 'Basket B'})</div>` +
        `<div>Sample: ${this.selectedSample.title}</div>` +
        `<div>Medium: ${this.selectedSample.media}</div>` +
        `<div>Remaining Core Mass: <b>${(frac * 100).toFixed(1)}%</b></div>` +
        `<div>Status: <b>${frac <= 0.02 ? 'DISINTEGRATED (PASS)' : 'INTACT / ERODING'}</b></div>`;
    }
  }

  // --------------------------------------------------------------------------
  // Part Explorer (Grouped + Isolate in Solid / Wireframe Others)
  // --------------------------------------------------------------------------
  initPartExplorer() {
    const host = document.getElementById('parts-list');
    if (!host) return;
    host.innerHTML = '';

    const byGroup = new Map();
    for (const item of PART_CATALOG) {
      if (!byGroup.has(item.group)) byGroup.set(item.group, []);
      byGroup.get(item.group).push(item);
    }

    let totalFound = 0;
    for (const [groupName, items] of byGroup.entries()) {
      const gl = document.createElement('div');
      gl.className = 'parts-group-label';
      gl.textContent = `${groupName} (${items.length})`;
      host.appendChild(gl);

      for (const item of items) {
        const obj = this.engine.scene.getObjectByName(item.id);
        if (obj) totalFound++;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'part-btn';
        btn.dataset.partId = item.id;
        btn.innerHTML = `<span class="part-label-text">${item.label}</span>`;
        btn.title = `${item.label} (${item.id})`;
        btn.addEventListener('click', () => this.focusPart(item));
        host.appendChild(btn);
      }
    }

    const countEl = document.getElementById('parts-count');
    if (countEl) {
      countEl.textContent = `${PART_CATALOG.length} cataloged assemblies (${totalFound} live 3D nodes)`;
    }
  }

  focusPart(item) {
    const obj = this.engine.scene.getObjectByName(item.id);
    if (!obj) return;

    // Make sure internal bays are visible if focusing an internal component
    if (item.group === 'Motors & Mechanics' || item.group === 'Sensors & Optics' || item.group === 'Data & Comms' || item.group === 'Power & Wiring') {
      this.engine.setCutaway(true);
      document.getElementById('btn-cutaway')?.classList.add('active');
    }

    this.explorerPartId = item.id;
    this.engine.setExplorerFocus(obj);

    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.4);
    const dist = Math.max(1.8, maxDim * 2.5);

    this.engine.controls.target.copy(center);
    this.engine.camera.position.set(
      center.x - dist * 0.72,
      center.y + dist * 0.48,
      center.z - dist * 0.78
    );
    this.engine.controls.update();

    document.querySelectorAll('.part-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.partId === item.id);
    });

    const st = document.getElementById('parts-focus-status');
    if (st) st.textContent = `Focused: ${item.label}`;
  }

  clearPartExplorer() {
    this.explorerPartId = null;
    this.engine.setExplorerFocus(null);
    document.querySelectorAll('.part-btn.active').forEach((b) => b.classList.remove('active'));
    const st = document.getElementById('parts-focus-status');
    if (st) st.textContent = 'Click a part to locate & isolate it in 3D';
  }

  // --------------------------------------------------------------------------
  // Exploded View Helper
  // --------------------------------------------------------------------------
  setExplodedValue(val) {
    const v = Math.max(0, Math.min(1, parseFloat(val) || 0));
    this.engine.setExploded(v);
    const slider = document.getElementById('sliderExplode');
    if (slider) slider.value = String(v);
    const isExp = v > 0.05;
    document.getElementById('btn-explode')?.classList.toggle('active', isExp);
    document.getElementById('btn-explode-panel')?.classList.toggle('active', isExp);
  }

  // --------------------------------------------------------------------------
  // Camera Presets & Zoom Slider Sync
  // --------------------------------------------------------------------------
  setCameraPreset(preset) {
    const cam = this.engine.camera;
    const ctrl = this.engine.controls;
    switch (preset) {
      case 'iso':
      case '3d':
        cam.position.set(-5.8, 5.2, -9.2);
        ctrl.target.set(0.2, 2.9, -0.2);
        break;
      case 'front':
        cam.position.set(0, 3.1, -10.2);
        ctrl.target.set(0, 3.0, 0);
        break;
      case 'console':
        cam.position.set(0.35, 1.55, -4.8);
        ctrl.target.set(0.35, 1.40, -2.0);
        break;
      case 'side':
        cam.position.set(-9.8, 3.2, -0.2);
        ctrl.target.set(0, 2.8, -0.2);
        break;
      case 'top':
        cam.position.set(0, 12.2, -0.9);
        ctrl.target.set(0, 2.5, -0.4);
        break;
    }
    ctrl.update();
    document.querySelectorAll('[data-camera]').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-camera') === preset);
    });
  }

  syncZoomSliderFromCamera() {
    const zoomEl = document.getElementById('camera-zoom');
    const zoomVal = document.getElementById('camera-zoom-val');
    if (!zoomEl || this._zoomDragging) return;
    const dist = this.engine.camera.position.distanceTo(this.engine.controls.target);
    const lo = this.engine.controls.minDistance || 1.8;
    const hi = this.engine.controls.maxDistance || 24.0;
    const pct = Math.max(0, Math.min(100, Math.round(((hi - dist) / (hi - lo)) * 100)));
    zoomEl.value = String(pct);
    if (zoomVal) zoomVal.textContent = `${pct}%`;
  }

  // --------------------------------------------------------------------------
  // Topbar Theme Switcher (MODERN, + RETRO, ☾ NIGHT) & 2D SVG Callout Lines
  // --------------------------------------------------------------------------
  initThemeAndCallouts() {
    this.calloutAnchors = {
      bath: new THREE.Vector3(-1.35, 3.10, -0.85),
      baskets: new THREE.Vector3(-0.825, 3.45, -0.85),
      basketA: new THREE.Vector3(-0.825, 3.45, -0.85),
      basketB: new THREE.Vector3(0.825, 3.45, -0.85),
      drive: new THREE.Vector3(0.0, 5.65, -0.85),
      electronics: new THREE.Vector3(0.0, 0.55, 0.25),
      console: new THREE.Vector3(0.35, 1.40, -2.01)
    };

    document.getElementById('btn-view-modern')?.addEventListener('click', () => this.setTheme('modern'));
    document.getElementById('btn-view-retro')?.addEventListener('click', () => this.setTheme('retro'));
    document.getElementById('btn-view-night')?.addEventListener('click', () => this.setTheme('night'));

    document.getElementById('btn-cm-plate')?.addEventListener('click', () => this.setStageBackdrop('plate'));
    document.getElementById('btn-cm-bench')?.addEventListener('click', () => this.setStageBackdrop('bench'));
    document.getElementById('btn-cm-callouts')?.addEventListener('click', () => {
      this.calloutsVisible = !this.calloutsVisible;
      document.getElementById('btn-cm-callouts')?.classList.toggle('active', this.calloutsVisible);
      document.getElementById('cm-plate-overlay')?.classList.toggle('callouts-hidden', !this.calloutsVisible);
    });

    // Clickable callouts focus the corresponding 3D assembly
    document.querySelectorAll('.cm-callout').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.callout;
        const map = {
          bath: { id: 'Body_Bath', label: 'Acrylic Thermostatted Water Bath', group: 'Assemblies' },
          baskets: { id: 'Pivot_BasketArm_Left', label: 'Station A: 6-Tube USP Basket', group: 'Apparatus Baskets' },
          basketA: { id: 'Pivot_BasketArm_Left', label: 'Station A: 6-Tube USP Basket', group: 'Apparatus Baskets' },
          basketB: { id: 'Pivot_BasketArm_Right', label: 'Station B: 6-Tube USP Basket', group: 'Apparatus Baskets' },
          drive: { id: 'Body_DriveHead', label: 'Cantilevered Basket Drive Head', group: 'Assemblies' },
          electronics: { id: 'Body_PCB_Motherboard', label: 'FR-4 Main Instrument Controller Motherboard', group: 'Data & Comms' },
          console: { id: 'UI_LCD', label: 'Operator Console & LCD', group: 'Data & Comms' }
        };
        if (map[key]) this.focusPart(map[key]);
      });
    });

    // Brand dropdown menu toggle
    const cmMenuBtn = document.getElementById('cm-brand-menu-btn');
    const cmMenuWrap = document.querySelector('.cm-brand-dropdown-container');
    if (cmMenuBtn && cmMenuWrap) {
      cmMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = cmMenuWrap.classList.toggle('is-open');
        cmMenuBtn.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('click', (e) => {
        if (!cmMenuWrap.contains(e.target)) {
          cmMenuWrap.classList.remove('is-open');
          cmMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  setTheme(theme) {
    const raw = String(theme || '').toLowerCase();
    if (raw === 'night') this.currentTheme = 'night';
    else if (raw === 'retro' || raw === 'chemmate') this.currentTheme = 'retro';
    else this.currentTheme = 'modern';

    document.getElementById('btn-view-modern')?.classList.toggle('active', this.currentTheme === 'modern');
    document.getElementById('btn-view-retro')?.classList.toggle('active', this.currentTheme === 'retro');
    document.getElementById('btn-view-night')?.classList.toggle('active', this.currentTheme === 'night');

    const stageSw = document.getElementById('cm-stage-switcher');
    const moodSel = document.getElementById('lab-light-mood');

    if (this.currentTheme === 'modern') {
      delete document.body.dataset.theme;
      if (stageSw) stageSw.hidden = true;
      this.engine.applyLighting('neutral', this.engine.lightBrightness);
      this.engine.setStageBackdrop('bench', 'modern');
      if (moodSel) moodSel.value = 'neutral';
    } else if (this.currentTheme === 'night') {
      document.body.dataset.theme = 'night';
      if (stageSw) stageSw.hidden = false;
      this.engine.applyLighting('night', this.engine.lightBrightness);
      this.engine.setStageBackdrop(this.currentStageMode, 'night');
      if (moodSel) moodSel.value = 'night';
    } else {
      document.body.dataset.theme = 'retro';
      if (stageSw) stageSw.hidden = false;
      this.engine.applyLighting('chemmate', this.engine.lightBrightness);
      this.engine.setStageBackdrop(this.currentStageMode, 'retro');
      if (moodSel) moodSel.value = 'chemmate';
    }
    this.drawTubePreview();
  }

  setStageBackdrop(mode) {
    this.currentStageMode = mode === 'bench' ? 'bench' : 'plate';
    document.getElementById('btn-cm-plate')?.classList.toggle('active', this.currentStageMode === 'plate');
    document.getElementById('btn-cm-bench')?.classList.toggle('active', this.currentStageMode === 'bench');
    this.engine.setStageBackdrop(this.currentStageMode, this.currentTheme);
  }

  updateChemMateCallouts() {
    if ((this.currentTheme !== 'retro' && this.currentTheme !== 'night') || !this.calloutsVisible) return;
    const svg = document.getElementById('cm-callouts-svg');
    const overlay = document.getElementById('cm-plate-overlay');
    if (!svg || !overlay) return;

    const stageRect = overlay.getBoundingClientRect();
    if (stageRect.width < 10 || stageRect.height < 10) return;

    const isNight = this.currentTheme === 'night';
    const strokeColor = isNight ? '#ff3344' : '#d62828';
    const outerRingOpacity = isNight ? '0.75' : '0.6';

    let svgHtml = '';
    overlay.querySelectorAll('.cm-callout').forEach((btn) => {
      const id = btn.dataset.callout;
      const worldPos = this.calloutAnchors[id]?.clone();
      if (!worldPos) return;

      const proj = worldPos.project(this.engine.camera);
      if (proj.z > 1.0) return;

      const px = (proj.x * 0.5 + 0.5) * stageRect.width;
      const py = (-proj.y * 0.5 + 0.5) * stageRect.height;

      const btnRect = btn.getBoundingClientRect();
      const isLeft = btn.classList.contains('cm-callout-left');
      const cardX = isLeft ? btnRect.right - stageRect.left : btnRect.left - stageRect.left;
      const cardY = btnRect.top + btnRect.height / 2 - stageRect.top;
      const shelfX = cardX + (isLeft ? 16 : -16);

      svgHtml += `
        <g class="cm-callout-line" data-callout-line="${id}">
          <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="6.5" fill="none" stroke="${strokeColor}" stroke-width="1.2" opacity="${outerRingOpacity}" />
          <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3.5" fill="${strokeColor}" />
          <polyline points="${cardX.toFixed(1)},${cardY.toFixed(1)} ${shelfX.toFixed(1)},${cardY.toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)}" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      `;
    });

    svg.innerHTML = svgHtml;
  }

  // --------------------------------------------------------------------------
  // DOM Event Listeners (Centrifuge Parity + Legacy Compatibility)
  // --------------------------------------------------------------------------
  initEventListeners() {
    // Primary Instrument Controls (Legacy + Centrifuge IDs)
    document.getElementById('btnStart')?.addEventListener('click', () => this.startTest());
    document.getElementById('btnStop')?.addEventListener('click', () => this.stopTest());
    document.getElementById('btnHeater')?.addEventListener('click', () => this.toggleHeater());
    document.getElementById('btnLift')?.addEventListener('click', () => this.toggleLift());
    document.getElementById('btnPowerPlug')?.addEventListener('click', () => this.togglePlug());
    document.getElementById('btn-power')?.addEventListener('click', () => this.togglePowerSwitch());
    document.getElementById('btn-power-sw')?.addEventListener('click', () => this.togglePowerSwitch());
    document.getElementById('btnExportGLP')?.addEventListener('click', () => this.exportGLP());
    const reloadHandler = () => {
      this.resetTablets();
      this.logEvent(`Reloaded 12 fresh ${this.selectedSample.title} tablets into Baskets A & B.`);
      this.syncToEngine();
    };
    document.getElementById('btn-reset-tablets')?.addEventListener('click', reloadHandler);
    document.getElementById('btn-reload-tablets')?.addEventListener('click', reloadHandler);

    // Keypad rocker buttons (both ID and data-key)
    document.getElementById('btn-cpm-up')?.addEventListener('click', () => this.adjustCpm(0.5));
    document.getElementById('btn-cpm-down')?.addEventListener('click', () => this.adjustCpm(-0.5));
    document.getElementById('btn-time-up')?.addEventListener('click', () => this.adjustTime(60));
    document.getElementById('btn-time-down')?.addEventListener('click', () => this.adjustTime(-60));
    document.getElementById('btn-temp-up')?.addEventListener('click', () => this.adjustTemp(0.5));
    document.getElementById('btn-temp-down')?.addEventListener('click', () => this.adjustTemp(-0.5));

    // Automated workflow & stage inspection buttons in Control Panel
    document.getElementById('btn-demo-quick')?.addEventListener('click', () => {
      this.bathTempC = 37.0;
      this.heaterActive = true;
      this.startTest();
    });
    document.getElementById('btn-tour-panel')?.addEventListener('click', () => this.toggleGuidedTour());
    document.getElementById('btn-inspect-power')?.addEventListener('click', () => {
      this.applyTourChapter(6);
      document.getElementById('tourOverlay')?.classList.add('hidden');
    });
    document.getElementById('btn-inspect-pcb')?.addEventListener('click', () => {
      this.applyTourChapter(9);
      document.getElementById('tourOverlay')?.classList.add('hidden');
    });

    // Keypad rocker buttons
    document.querySelectorAll('[data-key]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.key;
        if (k === 'cpm-up') this.adjustCpm(0.5);
        else if (k === 'cpm-down') this.adjustCpm(-0.5);
        else if (k === 'time-up') this.adjustTime(60);
        else if (k === 'time-down') this.adjustTime(-60);
        else if (k === 'temp-up') this.adjustTemp(0.5);
        else if (k === 'temp-down') this.adjustTemp(-0.5);
      });
    });

    // Camera preset buttons
    document.querySelectorAll('[data-camera]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const cam = e.currentTarget.getAttribute('data-camera');
        this.setCameraPreset(cam);
      });
    });

    // Exploded view buttons & slider
    const toggleExplode = () => {
      const next = this.engine.state.explodeFactor > 0.1 ? 0.0 : 1.0;
      this.setExplodedValue(next);
    };
    document.getElementById('btn-explode')?.addEventListener('click', toggleExplode);
    document.getElementById('btn-explode-panel')?.addEventListener('click', toggleExplode);
    document.getElementById('sliderExplode')?.addEventListener('input', (e) => {
      this.setExplodedValue(parseFloat(e.target.value));
    });

    // Cutaway X-Ray buttons
    const toggleCutaway = () => {
      const next = !this.engine.cutawayActive;
      this.engine.setCutaway(next);
      document.getElementById('btn-cutaway')?.classList.toggle('active', next);
      document.getElementById('btnCutaway')?.classList.toggle('active', next);
    };
    document.getElementById('btn-cutaway')?.addEventListener('click', toggleCutaway);
    document.getElementById('btnCutaway')?.addEventListener('click', toggleCutaway);

    // Wireframe toggle button (#btn-wireframe)
    const btnWire = document.getElementById('btn-wireframe');
    btnWire?.addEventListener('click', () => {
      const next = !this.engine.wireframeActive;
      this.clearPartExplorer();
      this.engine.setWireframe(next);
      btnWire.classList.toggle('active', next);
    });

    // Reset View button (#btn-view-reset)
    document.getElementById('btn-view-reset')?.addEventListener('click', () => {
      this.clearPartExplorer();
      this.engine.setWireframe(false);
      btnWire?.classList.remove('active');
      this.engine.setCutaway(false);
      document.getElementById('btn-cutaway')?.classList.remove('active');
      this.setExplodedValue(0);
      this.setCameraPreset('iso');
    });

    // Hide / Show Right Side Panels (#btn-toggle-panels)
    const btnTogglePanels = document.getElementById('btn-toggle-panels');
    btnTogglePanels?.addEventListener('click', () => {
      this.panelsHidden = !this.panelsHidden;
      document.querySelectorAll('.panel-collapsible').forEach((p) => {
        p.classList.toggle('is-collapsed', this.panelsHidden);
      });
      document.querySelectorAll('[data-collapse]').forEach((b) => {
        b.textContent = this.panelsHidden ? '▸' : '▾';
        b.setAttribute('aria-expanded', this.panelsHidden ? 'false' : 'true');
      });
      btnTogglePanels.classList.toggle('active', this.panelsHidden);
      btnTogglePanels.textContent = this.panelsHidden ? 'Show Panels' : 'Hide Panels';
      requestAnimationFrame(() => this.engine.onWindowResize());
    });

    // Individual Collapsible Right Panels ([data-collapse="instrument"|"parts"|"lab"])
    document.querySelectorAll('[data-collapse]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-collapse');
        const panel = document.querySelector(`[data-panel="${name}"]`);
        if (!panel) return;
        const collapsed = !panel.classList.contains('is-collapsed');
        panel.classList.toggle('is-collapsed', collapsed);
        btn.textContent = collapsed ? '▸' : '▾';
        btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        requestAnimationFrame(() => this.engine.onWindowResize());
      });
    });

    // Clear Part Explorer focus
    document.getElementById('btn-parts-clear')?.addEventListener('click', () => {
      this.clearPartExplorer();
      this.setCameraPreset('iso');
    });

    // Auto-Rotate & Orbit Speed Slider
    const btnAutoRotate = document.getElementById('btn-auto-rotate');
    btnAutoRotate?.addEventListener('click', () => {
      this.engine.autoRotate = !this.engine.autoRotate;
      btnAutoRotate.classList.toggle('active', this.engine.autoRotate);
    });

    const orbitEl = document.getElementById('orbit-speed');
    const orbitVal = document.getElementById('orbit-speed-val');
    orbitEl?.addEventListener('input', () => {
      const deg = parseFloat(orbitEl.value) || 14;
      this.engine.orbitSpeedDeg = deg;
      if (orbitVal) orbitVal.textContent = `${deg}°/s`;
      if (!this.engine.autoRotate) {
        this.engine.autoRotate = true;
        btnAutoRotate?.classList.add('active');
      }
    });

    // Camera Zoom Slider
    const zoomEl = document.getElementById('camera-zoom');
    const zoomVal = document.getElementById('camera-zoom-val');
    if (zoomEl) {
      zoomEl.addEventListener('pointerdown', () => { this._zoomDragging = true; });
      zoomEl.addEventListener('pointerup', () => { this._zoomDragging = false; });
      zoomEl.addEventListener('input', () => {
        const pct = parseFloat(zoomEl.value) || 50;
        if (zoomVal) zoomVal.textContent = `${Math.round(pct)}%`;
        const lo = this.engine.controls.minDistance || 1.8;
        const hi = this.engine.controls.maxDistance || 24.0;
        const dist = hi - (pct / 100) * (hi - lo);
        const dir = new THREE.Vector3().subVectors(this.engine.camera.position, this.engine.controls.target).normalize();
        this.engine.camera.position.copy(this.engine.controls.target).addScaledVector(dir, dist);
        this.engine.controls.update();
      });
    }

    // Lab Light Brightness & Mood Selector (Dark Lab, Light Lab, Retro, Night, etc.)
    const lightEl = document.getElementById('lab-light');
    const lightVal = document.getElementById('lab-light-val');
    const moodEl = document.getElementById('lab-light-mood');
    lightEl?.addEventListener('input', () => {
      const b = parseFloat(lightEl.value) || 1.15;
      if (lightVal) lightVal.textContent = `${b.toFixed(1)}×`;
      this.engine.applyLighting(this.engine.currentMood, b);
    });
    moodEl?.addEventListener('change', () => {
      const mood = moodEl.value || 'neutral';
      if (mood === 'chemmate') this.setTheme('retro');
      else if (mood === 'night') this.setTheme('night');
      else {
        if (this.currentTheme !== 'modern') {
          delete document.body.dataset.theme;
          this.currentTheme = 'modern';
          document.getElementById('btn-view-modern')?.classList.add('active');
          document.getElementById('btn-view-retro')?.classList.remove('active');
          document.getElementById('btn-view-night')?.classList.remove('active');
          const stageSw = document.getElementById('cm-stage-switcher');
          if (stageSw) stageSw.hidden = true;
        }
        this.engine.applyLighting(mood, this.engine.lightBrightness);
      }
    });

    // Mute SFX button
    const btnMute = document.getElementById('btn-sfx-mute');
    btnMute?.addEventListener('click', () => {
      this.sfx.muted = !this.sfx.muted;
      if (this.sfx.muted) {
        this.sfx.stopMotor();
        this.sfx.stopPump();
      }
      btnMute.classList.toggle('active', this.sfx.muted);
      btnMute.textContent = this.sfx.muted ? '🔇 Muted' : '🔊 Sound';
    });

    // Guided Tour button
    document.getElementById('btnGuidedTour')?.addEventListener('click', () => this.toggleGuidedTour());

    // Sample monograph select
    const sampleSel = document.getElementById('selectSample');
    sampleSel?.addEventListener('change', (e) => {
      this.selectedSample = SAMPLE_PROFILES[e.target.value] || SAMPLE_PROFILES.aspirin_ir;
      this.testDurationSeconds = this.selectedSample.limitSec;
      this.resetTablets();
      const desc = document.getElementById('material-desc');
      if (desc) desc.textContent = this.selectedSample.monograph;
      this.syncToEngine();
    });
  }

  // --------------------------------------------------------------------------
  // Update All DOM Readouts & Status Pills
  // --------------------------------------------------------------------------
  updateUI() {
    const tempEl = document.getElementById('valTemp');
    if (tempEl) tempEl.textContent = `${this.bathTempC.toFixed(1)} °C`;

    const cpmEl = document.getElementById('valCPM');
    if (cpmEl) cpmEl.textContent = (this.hasPower && this.oscillationActive) ? `${this.targetCpm.toFixed(1)} CPM` : '0.0 CPM';

    const rem = Math.max(0, this.testDurationSeconds - this.elapsedSeconds);
    const m = Math.floor(rem / 60);
    const s = Math.floor(rem % 60);
    const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const timeEl = document.getElementById('valTime');
    if (timeEl) timeEl.textContent = timeStr;

    const stn1Intact = this.tabletFractions.slice(0, 6).filter((f) => f > 0.02).length;
    const stn2Intact = this.tabletFractions.slice(6, 12).filter((f) => f > 0.02).length;

    const stn1El = document.getElementById('valStn1');
    if (stn1El) stn1El.textContent = `${stn1Intact} / 6`;
    const stn2El = document.getElementById('valStn2');
    if (stn2El) stn2El.textContent = `${stn2Intact} / 6`;

    const ftrDrive = document.getElementById('ftrDrive');
    if (ftrDrive) {
      ftrDrive.textContent = !this.hasPower
        ? 'UNPOWERED'
        : this.oscillationActive
          ? `${this.targetCpm.toFixed(1)} CPM ACTIVE`
          : 'PARKED';
    }

    const pwrPlugBtn = document.getElementById('btnPowerPlug');
    if (pwrPlugBtn) {
      pwrPlugBtn.textContent = this.isPluggedIn ? '⚡ Cord Plugged In' : '🔌 Cord Unplugged';
      pwrPlugBtn.classList.toggle('active', this.isPluggedIn);
    }

    const pwrSwBtn = document.getElementById('btn-power');
    if (pwrSwBtn) {
      pwrSwBtn.classList.toggle('active', this.hasPower);
    }

    const ledRun = document.getElementById('led-run');
    if (ledRun) ledRun.classList.toggle('on', this.hasPower && this.oscillationActive);

    const ledHeater = document.getElementById('led-heater');
    if (ledHeater) ledHeater.classList.toggle('on', this.hasPower && this.heaterActive);

    const pillBath = document.getElementById('pill-bath-status');
    if (pillBath) {
      const ok = Math.abs(this.bathTempC - this.targetTempC) <= 0.5;
      pillBath.textContent = !this.hasPower
        ? 'Bath: Unpowered'
        : `Bath: ${this.bathTempC.toFixed(1)} °C (${ok ? 'Equilibrated' : 'Heating'})`;
    }

    const pillBasket = document.getElementById('pill-basket-pos');
    if (pillBasket) {
      pillBasket.textContent = `Baskets: ${this.basketLowered ? 'Immersed' : 'Parked Up'}`;
    }

    const cmSampleLabel = document.getElementById('cm-sample-label');
    if (cmSampleLabel) cmSampleLabel.textContent = this.selectedSample.title;

    this.updateBasketGrids();
  }

  exportGLP() {
    let csv = 'GLP Analytical Run Audit Trail: ERWEKA ZT 322 Tablet Disintegration Tester\n';
    csv += 'Standard: USP <701> / Ph. Eur. 2.9.1 / JP 6.09 (21 CFR Part 11 Electronic Record)\n';
    csv += `Sample Monograph: ${this.selectedSample.title}\n`;
    csv += 'Time(s),Strokes,CPM,BathTemp(C),IntactTablets\n';
    if (this.auditLog.length === 0) {
      csv += `${this.elapsedSeconds.toFixed(1)},${this.strokeCount},${this.targetCpm.toFixed(1)},${this.bathTempC.toFixed(2)},${this.tabletFractions.filter(f => f > 0.02).length}\n`;
    } else {
      this.auditLog.forEach((row) => {
        csv += `${row.time},${row.strokes},${row.cpm},${row.temp},${row.intact}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ERWEKA_ZT322_GLP_Run_${Date.now()}.csv`;
    a.click();
    this.logEvent('Exported 21 CFR Part 11 GLP Analytical CSV report.');
  }

  // --------------------------------------------------------------------------
  // Interactive Guided Walkthrough Tour with Voiceover Narration
  // --------------------------------------------------------------------------
  toggleGuidedTour() {
    if (this.tourActive) this.stopGuidedTour();
    else this.startGuidedTour();
  }

  startGuidedTour() {
    this.tourActive = true;
    this.tourIndex = 0;
    const btn = document.getElementById('btnGuidedTour');
    if (btn) {
      btn.textContent = '⏹ Stop Tour';
      btn.classList.add('active');
    }
    this.runTourStep();
  }

  stopGuidedTour() {
    this.tourActive = false;
    if (this.tourTimer) clearTimeout(this.tourTimer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    document.getElementById('tourOverlay')?.classList.add('hidden');
    const btn = document.getElementById('btnGuidedTour');
    if (btn) {
      btn.textContent = '🎬 Guided Tour';
      btn.classList.remove('active');
    }
    this.engine.enclosureShell.visible = true;
    this.engine.bathGroup.visible = true;
    this.engine.driveGroup.visible = true;
    this.engine.driveHead.visible = true;
    this.engine.setCutaway(false);
    this.setExplodedValue(0.0);
    this.setCameraPreset('iso');
  }

  applyTourChapter(idx) {
    const ch = TOUR_CHAPTERS[idx];
    if (!ch) return null;

    const overlay = document.getElementById('tourOverlay');
    const badgeEl = document.getElementById('tourBadge');
    const titleEl = document.getElementById('tourTitle');
    const capEl = document.getElementById('tourCaption');

    if (overlay) overlay.classList.remove('hidden');
    if (badgeEl) badgeEl.textContent = ch.badge;
    if (titleEl) titleEl.textContent = ch.title;
    if (capEl) capEl.textContent = ch.voiceover;

    if (ch.setup) ch.setup(this);
    if (ch.camPos && ch.camTarget) {
      this.engine.camera.position.set(ch.camPos[0], ch.camPos[1], ch.camPos[2]);
      this.engine.controls.target.set(ch.camTarget[0], ch.camTarget[1], ch.camTarget[2]);
      this.engine.controls.update();
    }
    return ch;
  }

  runTourStep() {
    if (!this.tourActive) return;
    if (this.tourIndex >= TOUR_CHAPTERS.length) {
      this.stopGuidedTour();
      return;
    }

    const ch = this.applyTourChapter(this.tourIndex);
    const advance = () => {
      if (!this.tourActive) return;
      this.tourIndex++;
      this.tourTimer = setTimeout(() => this.runTourStep(), 800);
    };

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(ch.voiceover);
      utter.rate = 1.02;
      utter.onend = advance;
      utter.onerror = advance;
      window.speechSynthesis.speak(utter);
    } else {
      this.tourTimer = setTimeout(advance, 8000);
    }
  }
}

// Initialize on DOM load & expose globals for automated QA & video capture
window.addEventListener('DOMContentLoaded', () => {
  initChemMateTheme();
  const app = new DisintegrationApp();
  window.app = app;
  window.twinApp = app;
  window.twin3D = app.engine;

  const params = new URLSearchParams(window.location.search);
  if (params.get('theme')) {
    app.setTheme(params.get('theme'));
  }
  if (params.get('tour') === '1') {
    setTimeout(() => app.startGuidedTour(), 600);
  } else if (params.has('chapter')) {
    const chIdx = parseInt(params.get('chapter'), 10);
    if (!Number.isNaN(chIdx)) {
      setTimeout(() => app.applyTourChapter(chIdx), 500);
    }
  }
});
