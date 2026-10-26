/**
 * ERWEKA ZT 322 Tablet Disintegration Tester (USP <701>) Web Application
 * Client Runtime: Three.js 3D Viewport, Dynamic LCD Canvas Quad, Tactile Controls,
 * Hard Circuit Continuity, Part Explorer, Web Audio Synthesis, and GLP Reporting.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Disintegration3D } from './disintegration3d.js?v=20261022-zt1';
import { DisintegrationSfx } from './sfx.js?v=20261022-zt1';
import { initChemMateTheme } from '../../../lab_viewer/shared/chemmate_theme_manager.js';

// ----------------------------------------------------------------------------
// Analytical Sample Profiles (USP <701>)
// ----------------------------------------------------------------------------
const SAMPLE_PROFILES = {
  aspirin_ir: {
    id: 'aspirin_ir',
    title: 'Aspirin 500 mg Immediate-Release',
    monograph: 'USP <701> Immediate-Release Tablets',
    disintTimeSec: 210, // ~3.5 minutes
    media: '0.1 N HCl Simulated Gastric Fluid',
    targetTemp: 37.0
  },
  vitamin_c: {
    id: 'vitamin_c',
    title: 'Ascorbic Acid 1000 mg Compressed',
    monograph: 'USP <2040> Dietary Supplements',
    disintTimeSec: 480, // 8.0 minutes
    media: 'Purified Water',
    targetTemp: 37.0
  },
  enteric_acid: {
    id: 'enteric_acid',
    title: 'Enteric-Coated Aspirin (Gastric Acid)',
    monograph: 'USP <701> Delayed-Release (Stage 1 Acid)',
    disintTimeSec: 9999, // Resists acid > 120 min
    media: '0.1 N HCl (pH 1.2)',
    targetTemp: 37.0
  }
};

const PART_CATALOG = [
  { id: 'Body_Chassis', label: 'ERWEKA ZT 322 Unibody Cabinet Base', cat: 'Chassis' },
  { id: 'Body_Cabinet_UprightTower', label: 'Vertical Drive Column Tower', cat: 'Chassis' },
  { id: 'Body_Bath', label: 'Molded Clear Optical Acrylic Water Bath (6mm)', cat: 'Glass & Bath' },
  { id: 'Body_Heater_ImmersionCoil', label: '1500W Incoloy 800 Immersion Heater Coil', cat: 'Glass & Bath' },
  { id: 'Glass_Beaker_01', label: 'Station 1: 1000 mL Griffin Glass Beaker', cat: 'Glass & Bath' },
  { id: 'Glass_Beaker_02', label: 'Station 2: 1000 mL Griffin Glass Beaker', cat: 'Glass & Bath' },
  { id: 'Body_Motor_HarmonicStepper', label: 'M1: 24V BLDC Planetary Harmonic Drive Gearmotor', cat: 'Motors' },
  { id: 'Body_Motor_LiftActuator_Left', label: 'M2: Left Basket-Lift NEMA 17 Stepper & Lead Screw', cat: 'Motors' },
  { id: 'Body_Motor_LiftActuator_Right', label: 'M3: Right Basket-Lift NEMA 17 Stepper & Lead Screw', cat: 'Motors' },
  { id: 'Body_Motor_BathPump', label: 'M4: 24V Magnetic-Drive Water Bath Circulation Pump', cat: 'Motors' },
  { id: 'Body_Fan_CabinetCooling_Blower', label: 'M5: 80mm Brushless Axial Cabinet Cooling Fan', cat: 'Motors' },
  { id: 'Body_DriveHead', label: 'Oscillating Horizontal Bridge Arm', cat: 'Mechanics' },
  { id: 'Pivot_CrankDisc', label: 'Precision Eccentric Crank Disc (r=27.5mm)', cat: 'Mechanics' },
  { id: 'Pivot_ConnectingRod', label: 'Connecting Rod with Needle Roller Bearings', cat: 'Mechanics' },
  { id: 'Body_Shaft_Guide_Left', label: 'Chrome Steel Linear Guide Shaft (Left)', cat: 'Mechanics' },
  { id: 'Body_Shaft_Guide_Right', label: 'Chrome Steel Linear Guide Shaft (Right)', cat: 'Mechanics' },
  { id: 'Pivot_BasketArm_Left', label: 'Station 1: 6-Tube Basket-Rack Assembly', cat: 'Apparatus' },
  { id: 'Pivot_BasketArm_Right', label: 'Station 2: 6-Tube Basket-Rack Assembly', cat: 'Apparatus' },
  { id: 'Body_Mesh_Screen_01', label: 'Station 1: 10-Mesh 316SS Woven Wire Cloth', cat: 'Apparatus' },
  { id: 'Body_Mesh_Screen_02', label: 'Station 2: 10-Mesh 316SS Woven Wire Cloth', cat: 'Apparatus' },
  { id: 'Body_Sensor_PT100_Bath', label: 'S1: PT100 Class A RTD Bath Temperature Probe', cat: 'Sensors & Optics' },
  { id: 'Body_Sensor_HallTachometer', label: 'S2: Slotted Optical TDC/BDC Stroke Tachometer', cat: 'Sensors & Optics' },
  { id: 'Body_Sensor_OpticalEncoder', label: 'S3: 1024-PPR Quadrature Optical Rotary Encoder', cat: 'Sensors & Optics' },
  { id: 'Body_Sensor_LimitSwitch_Top', label: 'S4: Upper Basket-Lift Limit Microswitch', cat: 'Sensors & Optics' },
  { id: 'Body_Sensor_LimitSwitch_Btm', label: 'S5: Lower Basket-Lift Limit Microswitch', cat: 'Sensors & Optics' },
  { id: 'Body_Sensor_WaterLevel_Float', label: 'S6: Bath Low-Water Magnetic Reed Float Sensor', cat: 'Sensors & Optics' },
  { id: 'Body_Sensor_LaserDisintegration_01', label: 'S7: Station 1 IR Laser Disintegration Detector', cat: 'Sensors & Optics' },
  { id: 'Body_Sensor_LaserDisintegration_02', label: 'S8: Station 2 IR Laser Disintegration Detector', cat: 'Sensors & Optics' },
  { id: 'Glass_Mirror_OpticalRelay_01', label: 'Station 1: 45° First-Surface Gold Optical Mirror', cat: 'Sensors & Optics' },
  { id: 'Glass_Mirror_OpticalRelay_02', label: 'Station 2: 45° First-Surface Gold Optical Mirror', cat: 'Sensors & Optics' },
  { id: 'UI_LCD', label: 'High-DPI Dynamic Graphic LCD Screen Quad', cat: 'Data & Comms' },
  { id: 'Body_PCB_Motherboard', label: 'FR-4 Main Instrument Controller Motherboard', cat: 'Data & Comms' },
  { id: 'Body_Part_MCU_Core', label: 'U1: 32-Bit ARM Cortex-M4 Microcontroller IC', cat: 'Data & Comms' },
  { id: 'Body_Part_RAM_Chip', label: 'U2: 64MB High-Speed SDRAM Telemetry Buffer', cat: 'Data & Comms' },
  { id: 'Body_Part_SSD_Module', label: 'U3: 16GB eMMC NAND Flash Audit Log SSD', cat: 'Data & Comms' },
  { id: 'Body_Part_ADC_24Bit', label: 'U4: 24-Bit Delta-Sigma Precision Sensor ADC', cat: 'Data & Comms' },
  { id: 'Body_Part_RTC_BatterySocket', label: 'BT1: CR2032 Battery-Backed Real-Time Clock', cat: 'Data & Comms' },
  { id: 'Body_Part_WiFi_BLE_Module', label: 'U5: Shielded Wi-Fi 802.11ac & Bluetooth BLE 5.2 Radio', cat: 'Data & Comms' },
  { id: 'Body_Antenna_WiFi_BLE', label: 'External 2.4 GHz / 5 GHz Articulated Dipole Antenna', cat: 'Data & Comms' },
  { id: 'Body_Port_RS232', label: 'Rear RS-232 DB9 Serial Printer/LIMS Port', cat: 'Data & Comms' },
  { id: 'Body_Port_USB', label: 'Rear USB 2.0 Type-B Isolated PC Data Port', cat: 'Data & Comms' },
  { id: 'Body_Port_USB_Host_Flash', label: 'Rear USB-A Host Port + 32GB USB Flash Drive', cat: 'Data & Comms' },
  { id: 'Body_Port_RJ45_LAN', label: 'Rear RJ45 1000BASE-T Gigabit Ethernet LIMS Port', cat: 'Data & Comms' },
  { id: 'Body_Assembly_PowerSupply', label: 'Mean Well 24VDC 150W Enclosed Switching PSU', cat: 'Power & Routing' },
  { id: 'Body_Part_ToroidalTransformer', label: '180VA Toroidal Step-Down Isolation Transformer', cat: 'Power & Routing' },
  { id: 'Body_Filter_EMI_Mains', label: 'Schaffner 10A Shielded AC Mains EMI/RFI Filter', cat: 'Power & Routing' },
  { id: 'Body_Terminal_PowerBus', label: 'Central DC Power Distribution Bus (+24V/+5V/GND)', cat: 'Power & Routing' },
  { id: 'Body_Relay_SSR_Heater', label: 'Crydom 25A Zero-Cross Solid-State Relay & Heatsink', cat: 'Power & Routing' },
  { id: 'Body_Power_Receptacle_Duplex', label: 'Bench Duplex Electrical Receptacle Box', cat: 'Power & Routing' },
  { id: 'Body_Power_Plug_NEMA', label: 'Molded NEMA 5-15P AC Power Plug', cat: 'Power & Routing' },
  { id: 'Body_Power_Cord_SJTOW', label: 'Heavy-Duty 3-Conductor SJTOW Power Cord', cat: 'Power & Routing' },
  { id: 'Badge_SREdesigns', label: 'Official SREdesigns Brand Certification Badge', cat: 'Chassis' }
];

// ----------------------------------------------------------------------------
// 10-Chapter Guided Walkthrough & Voiceover Storyboard (Stages 1–6 + 7A–7D)
// ----------------------------------------------------------------------------
export const TOUR_CHAPTERS = [
  {
    id: 'STAGE_1',
    badge: 'STAGE 1 / 10 · POWER & CONTINUITY',
    title: 'Powering On & Hard Electrical Continuity',
    voiceover: 'Welcome to the S R E designs Digital Twin of the ERWEKA Z T 322 U S P 701 Tablet Disintegration Tester. Just like the real instrument, physical circuit continuity is enforced. Plugging the NEMA 5-15P cord into the bench duplex receptacle and engaging the rear breaker powers up the system into Standby.',
    camPos: [3.2, 3.6, -7.8],
    camTarget: [0.8, 1.8, -0.2],
    setup: (app) => {
      app.isPluggedIn = true;
      app.powerSwitchOn = true;
      app.engine.isPluggedIn = true;
      app.engine.powerSwitchOn = true;
      app.engine.updatePowerCord();
      app.engine.setExploded(0.0);
      app.engine.enclosureShell.visible = true;
      app.engine.bathGroup.visible = true;
      app.engine.driveGroup.visible = true;
      app.engine.driveHead.visible = true;
      app.state = 'STANDBY';
      app.engine.state = 'STANDBY';
      app.oscillationActive = false;
      app.engine.oscillationActive = false;
      app.heaterActive = false;
      app.engine.heaterActive = false;
      app.engine.targetElevation = 0.0;
      app.engine.currentLift = 0.0;
      app.updateUI();
    }
  },
  {
    id: 'STAGE_2',
    badge: 'STAGE 2 / 10 · PRODUCT & MEDIA SETUP',
    title: 'Preparing Beakers, Gastric Media, Tablets & Fluted Disks',
    voiceover: 'In Stage 2, the operator fills the six-point-five liter optical acrylic bath, seats two one-thousand milliliter borosilicate Griffin beakers filled with eight hundred milliliters of simulated gastric fluid, and loads six tablets with V-grooved fluted guide disks into each U S P Apparatus A basket.',
    camPos: [-3.8, 4.8, -6.8],
    camTarget: [0.0, 3.4, -0.85],
    setup: (app) => {
      app.engine.targetElevation = 1.15;
      app.engine.currentLift = 1.15;
      app.station1Intact = 6;
      app.station2Intact = 6;
      app.updateUI();
    }
  },
  {
    id: 'STAGE_3',
    badge: 'STAGE 3 / 10 · INSERTION & SAFETY INTERLOCKS',
    title: 'Coupling Quick-Release Collets & Lowering into Immersion',
    voiceover: 'In Stage 3, each basket locks into the quick-release stainless steel collets on the horizontal bridge arm and lowers smoothly into the test media, protected by low-water float cutoffs, thermal limits, and U S P stroke immersion clearances.',
    camPos: [-2.8, 3.9, -5.8],
    camTarget: [0.0, 2.9, -0.85],
    setup: (app) => {
      app.engine.targetElevation = 0.0;
      app.engine.currentLift = 0.0;
      app.updateUI();
    }
  },
  {
    id: 'STAGE_4',
    badge: 'STAGE 4 / 10 · CONSOLE & SOFTWARE SETUP',
    title: 'Selecting USP Monograph & Pre-Heating Bath to 37.0 °C',
    voiceover: 'In Stage 4, the analyst selects the Immediate-Release Aspirin monograph, verifies the fifteen-minute countdown timer, and engages the fifteen-hundred-watt P I D flow heater to equilibrate the water bath to thirty-seven degrees Celsius.',
    camPos: [0.2, 1.85, -5.4],
    camTarget: [0.25, 1.45, -2.0],
    setup: (app) => {
      app.heaterActive = true;
      app.engine.heaterActive = true;
      app.bathTempC = 37.0;
      app.updateUI();
    }
  },
  {
    id: 'STAGE_5',
    badge: 'STAGE 5 / 10 · ACTIVE RUN & DISINTEGRATION PHYSICS',
    title: '30.0 CPM Sinusoidal Oscillation & Hydrodynamic Shear',
    voiceover: 'In Stage 5, pressing Start engages pure sinusoidal vertical oscillation at thirty strokes per minute across a fifty-five millimeter stroke. Hydrodynamic fluid shear and excipient swelling break down the tablets through the ten-mesh stainless screens while live telemetry streams to the L C D.',
    camPos: [-2.6, 3.6, -5.2],
    camTarget: [0.0, 2.8, -0.85],
    setup: (app) => {
      app.oscillationActive = true;
      app.engine.oscillationActive = true;
      app.state = 'RUNNING_OSCILLATION';
      app.engine.state = 'RUNNING';
      app.bathTempC = 37.0;
      app.station1Intact = 4;
      app.station2Intact = 4;
      app.elapsedSeconds = 100;
      app.updateUI();
    }
  },
  {
    id: 'STAGE_6',
    badge: 'STAGE 6 / 10 · END-OF-RUN INSPECTION & GLP CSV',
    title: 'Automatic Park Lift, 10-Mesh Inspection & 21 CFR 11 Export',
    voiceover: 'In Stage 6, as soon as all twelve tablets disintegrate through the ten-mesh wire screens, the harmonic drive parks automatically, the baskets lift for visual inspection confirming zero firm cores remain, and a complete 21 C F R Part 11 C S V audit trail is exported.',
    camPos: [-2.8, 4.3, -5.6],
    camTarget: [0.0, 3.2, -0.85],
    setup: (app) => {
      app.oscillationActive = false;
      app.engine.oscillationActive = false;
      app.state = 'COMPLETE';
      app.engine.state = 'COMPLETE';
      app.station1Intact = 0;
      app.station2Intact = 0;
      app.elapsedSeconds = 210;
      app.engine.targetElevation = 1.15;
      app.engine.currentLift = 1.15;
      app.updateUI();
    }
  },
  {
    id: 'STAGE_7A',
    badge: 'STAGE 7A / 10 · INTERNAL POWER SUPPLY & ROUTING',
    title: 'AC EMI Filter, Toroidal XFMR, 24V PSU, 25A SSR & 3D Harnesses',
    voiceover: 'Now let us look inside the machine. In Stage 7A, AC mains power flows through a shielded E M I filter into a one-hundred-eighty volt-amp toroidal isolation transformer, a Mean Well twenty-four volt switching power supply with filter capacitors and barrier strip, and a twenty-five amp solid-state heater relay, with color-coded 3D harnesses routing power to every load.',
    camPos: [2.9, 3.3, -3.3],
    camTarget: [0.40, 0.65, 0.30],
    setup: (app) => {
      app.engine.setExploded(0.0);
      app.engine.enclosureShell.visible = false;
      app.engine.bathGroup.visible = false;
      app.engine.driveGroup.visible = true;
      app.engine.driveHead.visible = true;
      app.heaterActive = true;
      app.engine.heaterActive = true;
      app.updateUI();
    }
  },
  {
    id: 'STAGE_7B',
    badge: 'STAGE 7B / 10 · ALL 5 INTERNAL MOTORS & ACTUATORS',
    title: 'Harmonic Gearmotor, Dual Lift Steppers, Bath Pump & Cooling Fan',
    voiceover: 'In Stage 7B, we see all five internal motors working in concert: Motor 1 is the planetary brushless gearmotor driving the eccentric crank; Motors 2 and 3 are dual NEMA 17 stepper actuators turning stainless lead screws for basket lifting; Motor 4 is the magnetic-drive bath circulation pump feeding the glowing immersion coil; and Motor 5 is the eighty-millimeter cooling blower.',
    camPos: [-4.3, 4.3, -5.8],
    camTarget: [0.0, 2.95, 0.15],
    setup: (app) => {
      app.engine.enclosureShell.visible = false;
      app.engine.bathGroup.visible = true;
      app.oscillationActive = true;
      app.engine.oscillationActive = true;
      app.heaterActive = true;
      app.engine.heaterActive = true;
      app.station1Intact = 6;
      app.station2Intact = 6;
      app.engine.targetElevation = 0.0;
      app.engine.currentLift = 0.0;
      app.updateUI();
    }
  },
  {
    id: 'STAGE_7C',
    badge: 'STAGE 7C / 10 · INTERNAL SENSORS & 45° GOLD MIRRORS',
    title: 'PT100 RTD, Optical Encoders, Float Switch & 45° Relay Mirrors',
    voiceover: 'In Stage 7C, eight internal sensors monitor every physical parameter, including a Class A P T 100 bath probe, slotted optical stroke tachometer, quadrature rotary encoder, lift limit microswitches, low-water float switch, and infrared laser endpoint detectors that bounce collimated beams off forty-five-degree gold optical relay mirrors straight up through the ten-mesh basket bottoms.',
    camPos: [-3.1, 3.6, -4.6],
    camTarget: [-0.10, 2.75, -0.10],
    setup: (app) => {
      app.engine.enclosureShell.visible = false;
      app.engine.bathGroup.visible = true;
      app.updateUI();
    }
  },
  {
    id: 'STAGE_7D',
    badge: 'STAGE 7D / 10 · DATA, SSD STORAGE, WI-FI / BLE & PORTS',
    title: 'ARM Cortex-M4, 16GB SSD, CR2032 RTC, Wi-Fi/BLE 5.2 & Rear I/O',
    voiceover: 'Finally, in Stage 7D, the FR-4 motherboard houses a thirty-two-bit ARM Cortex-M4 microcontroller, twenty-four-bit A D C, sixty-four megabyte S D RAM, and a sixteen-gigabyte e M M C solid-state drive with CR2032 battery-backed clock. Analytical data is transported wirelessly via Wi-Fi and Bluetooth B L E 5.2 through the rear dipole antenna, or over Gigabit Ethernet, removable 32-gigabyte U S B Flash drive, U S B-B, and R S-232 serial ports.',
    camPos: [-1.95, 2.55, 3.15],
    camTarget: [-0.35, 0.65, 0.35],
    setup: (app) => {
      app.engine.enclosureShell.visible = false;
      app.engine.bathGroup.visible = false;
      app.engine.driveGroup.visible = false;
      app.engine.driveHead.visible = false;
      app.updateUI();
    }
  }
];

// ----------------------------------------------------------------------------
// Main Application Controller
// ----------------------------------------------------------------------------
class DisintegrationApp {
  constructor() {
    this.viewport = document.getElementById('viewport3d');
    this.engine = new Disintegration3D(this.viewport);
    this.sfx = new DisintegrationSfx();

    // Electrical continuity (Rule 9 & DIAG-014)
    this.isPluggedIn = true;
    this.powerSwitchOn = true;

    // Simulation parameters
    this.state = 'STANDBY';
    this.bathTempC = 21.5;
    this.targetTempC = 37.0;
    this.heaterActive = false;
    this.oscillationActive = false;
    this.strokeCount = 0;
    this.elapsedSeconds = 0;
    this.testDurationSeconds = 900; // 15 min default

    this.selectedSample = SAMPLE_PROFILES.aspirin_ir;
    this.station1Intact = 6;
    this.station2Intact = 6;

    this.auditLog = [];

    this.initControls();
    this.initPartExplorer();
    this.initEventListeners();
    this.updateUI();

    // Simulation tick loop (10 Hz)
    setInterval(() => this.tick(0.1), 100);
  }

  get hasPower() {
    return this.isPluggedIn && this.powerSwitchOn;
  }

  initControls() {
    this.controls = new OrbitControls(this.engine.camera, this.engine.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent dipping beneath bench
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 22.0;
    this.setCameraPreset('iso');
  }

  // --------------------------------------------------------------------------
  // Electrical Continuity Controls
  // --------------------------------------------------------------------------
  togglePlug() {
    this.isPluggedIn = !this.isPluggedIn;
    this.engine.isPluggedIn = this.isPluggedIn;
    this.engine.updatePowerCord();

    if (!this.isPluggedIn) {
      // Hard continuity cutoff
      this.state = 'POWER_OFF';
      this.heaterActive = false;
      this.oscillationActive = false;
      this.engine.oscillationActive = false;
      this.engine.heaterActive = false;
      this.sfx.stopMotor();
      this.sfx.stopPump();
    } else if (this.powerSwitchOn) {
      this.state = 'STANDBY';
    }

    this.engine.renderLCD();
    this.updateUI();
  }

  togglePowerSwitch() {
    this.powerSwitchOn = !this.powerSwitchOn;
    this.engine.powerSwitchOn = this.powerSwitchOn;

    if (!this.powerSwitchOn || !this.isPluggedIn) {
      this.state = 'POWER_OFF';
      this.heaterActive = false;
      this.oscillationActive = false;
      this.engine.oscillationActive = false;
      this.engine.heaterActive = false;
      this.sfx.stopMotor();
      this.sfx.stopPump();
    } else {
      this.state = 'STANDBY';
    }

    this.engine.renderLCD();
    this.updateUI();
  }

  // --------------------------------------------------------------------------
  // Operational Methods
  // --------------------------------------------------------------------------
  startTest() {
    if (!this.hasPower) return;
    this.sfx.click();
    this.sfx.startMotor(30.0);

    this.oscillationActive = true;
    this.engine.oscillationActive = true;
    this.state = 'RUNNING_OSCILLATION';
    this.engine.state = 'RUNNING';
    this.engine.renderLCD();
    this.updateUI();
  }

  stopTest() {
    if (!this.hasPower) return;
    this.sfx.click();
    this.sfx.stopMotor();

    this.oscillationActive = false;
    this.engine.oscillationActive = false;
    this.state = 'STANDBY';
    this.engine.state = 'STANDBY';
    this.engine.renderLCD();
    this.updateUI();
  }

  toggleHeater() {
    if (!this.hasPower) return;
    this.sfx.click();
    this.sfx.relayThud();

    this.heaterActive = !this.heaterActive;
    this.engine.heaterActive = this.heaterActive;

    if (this.heaterActive) {
      this.sfx.startPump();
    } else {
      this.sfx.stopPump();
    }

    this.engine.renderLCD();
    this.updateUI();
  }

  toggleLift() {
    if (!this.hasPower) return;
    this.sfx.click();
    this.engine.basketsLifted = !this.engine.basketsLifted;
    this.engine.targetElevation = this.engine.basketsLifted ? 1.20 : 0.0;
    this.updateUI();
  }

  // --------------------------------------------------------------------------
  // Simulation Loop Tick
  // --------------------------------------------------------------------------
  tick(dt) {
    if (!this.hasPower) {
      // Natural convective cooldown
      this.bathTempC += (21.5 - this.bathTempC) * 0.005 * dt;
      this.updateUI();
      return;
    }

    // Thermal simulation
    if (this.heaterActive) {
      const error = this.targetTempC - this.bathTempC;
      if (error > 0) {
        this.bathTempC += error * 0.04 * dt;
      }
    } else {
      this.bathTempC -= (this.bathTempC - 21.5) * 0.01 * dt;
    }

    // Kinematic & Disintegration simulation
    if (this.oscillationActive) {
      this.elapsedSeconds += dt;
      this.strokeCount = Math.floor((this.elapsedSeconds / 60.0) * 30.0);

      // Disintegration rate
      const disintTime = this.selectedSample.disintTimeSec;
      const progress = Math.min(1.0, this.elapsedSeconds / disintTime);
      const remainingIntact = Math.max(0, 6 - Math.floor(progress * 6));
      this.station1Intact = remainingIntact;
      this.station2Intact = remainingIntact;

      // Completion check
      if (this.elapsedSeconds >= this.testDurationSeconds || remainingIntact === 0) {
        this.stopTest();
        this.sfx.chime();
      }

      // Periodic audit record
      if (Math.floor(this.elapsedSeconds) % 5 === 0) {
        this.auditLog.push({
          time: this.elapsedSeconds.toFixed(1),
          strokes: this.strokeCount,
          cpm: 30.0,
          temp: this.bathTempC.toFixed(2),
          intact: remainingIntact
        });
      }
    }

    this.engine.renderLCD();
    this.updateUI();
  }

  // --------------------------------------------------------------------------
  // Part Explorer & UI Setup
  // --------------------------------------------------------------------------
  initPartExplorer() {
    const list = document.getElementById('partTreeList');
    if (!list) return;

    list.innerHTML = '';
    PART_CATALOG.forEach(part => {
      const node = document.createElement('div');
      node.className = 'tree-node';
      node.innerHTML = `<span>${part.label}</span><span style="opacity:0.5">${part.cat}</span>`;
      node.addEventListener('click', () => {
        document.querySelectorAll('.tree-node').forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        this.highlightPart(part.id);
      });
      list.appendChild(node);
    });
  }

  highlightPart(partName) {
    const obj = this.engine.scene.getObjectByName(partName);
    if (!obj) return;

    // Smoothly focus camera
    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    this.controls.target.copy(center);
  }

  initEventListeners() {
    // Toolbar buttons
    document.getElementById('btnStart')?.addEventListener('click', () => this.startTest());
    document.getElementById('btnStop')?.addEventListener('click', () => this.stopTest());
    document.getElementById('btnHeater')?.addEventListener('click', () => this.toggleHeater());
    document.getElementById('btnLift')?.addEventListener('click', () => this.toggleLift());
    document.getElementById('btnPowerPlug')?.addEventListener('click', () => this.togglePlug());
    document.getElementById('btnExportGLP')?.addEventListener('click', () => this.exportGLP());

    // Exploded view slider & Cutaway X-Ray button
    const explodeSlider = document.getElementById('sliderExplode');
    explodeSlider?.addEventListener('input', (e) => {
      this.engine.setExploded(parseFloat(e.target.value));
    });
    document.getElementById('btnCutaway')?.addEventListener('click', () => {
      this.engine.setCutaway(!this.engine.cutawayActive);
    });
    document.getElementById('btnGuidedTour')?.addEventListener('click', () => {
      this.toggleGuidedTour();
    });

    // Camera preset buttons
    document.querySelectorAll('[data-camera]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cam = e.currentTarget.getAttribute('data-camera');
        this.setCameraPreset(cam);
      });
    });

    // Sample selection
    const sampleSel = document.getElementById('selectSample');
    sampleSel?.addEventListener('change', (e) => {
      this.selectedSample = SAMPLE_PROFILES[e.target.value] || SAMPLE_PROFILES.aspirin_ir;
      this.elapsedSeconds = 0;
      this.strokeCount = 0;
      this.station1Intact = 6;
      this.station2Intact = 6;
      this.updateUI();
    });
  }

  setCameraPreset(preset) {
    switch (preset) {
      case 'iso':
        this.engine.camera.position.set(-5.8, 5.2, -9.2);
        this.controls.target.set(0.3, 2.9, 0);
        break;
      case 'front':
        this.engine.camera.position.set(0, 3.1, -10.2);
        this.controls.target.set(0, 3.0, 0);
        break;
      case 'console':
        this.engine.camera.position.set(0, 1.35, -5.2);
        this.controls.target.set(0, 1.25, -2.0);
        break;
      case 'side':
        this.engine.camera.position.set(9.8, 3.1, -0.2);
        this.controls.target.set(0, 2.8, 0);
        break;
      case 'top':
        this.engine.camera.position.set(0, 11.8, -0.8);
        this.controls.target.set(0, 2.5, -0.4);
        break;
    }
    this.controls.update();
  }

  updateUI() {
    const tempEl = document.getElementById('valTemp');
    if (tempEl) tempEl.innerText = `${this.bathTempC.toFixed(1)} °C`;

    const cpmEl = document.getElementById('valCPM');
    if (cpmEl) cpmEl.innerText = this.oscillationActive ? '30.0 CPM' : '0.0 CPM';

    const rem = Math.max(0, this.testDurationSeconds - this.elapsedSeconds);
    const m = Math.floor(rem / 60);
    const s = Math.floor(rem % 60);
    const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    const timeEl = document.getElementById('valTime');
    if (timeEl) {
      timeEl.innerText = timeStr;
    }

    const stn1El = document.getElementById('valStn1');
    if (stn1El) stn1El.innerText = `${this.station1Intact} / 6`;

    const stn2El = document.getElementById('valStn2');
    if (stn2El) stn2El.innerText = `${this.station2Intact} / 6`;

    const ftrDrive = document.getElementById('ftrDrive');
    if (ftrDrive) ftrDrive.innerText = this.oscillationActive ? '30.0 CPM ACTIVE' : 'PARKED';

    this.engine.bathTempC = this.bathTempC;
    this.engine.station1Intact = this.station1Intact;
    this.engine.station2Intact = this.station2Intact;
    this.engine.remainingTimeStr = timeStr;
    this.engine.renderLCD();

    const pwrPlugBtn = document.getElementById('btnPowerPlug');
    if (pwrPlugBtn) {
      pwrPlugBtn.innerText = this.isPluggedIn ? '⚡ Cord Plugged In' : '🔌 Cord Unplugged';
      pwrPlugBtn.className = this.isPluggedIn ? 'btn-icon' : 'btn-icon danger';
    }
  }

  exportGLP() {
    let csv = "GLP Analytical Run Audit Trail: ERWEKA ZT 322 Tablet Disintegration Tester\n";
    csv += "Standard: USP <701> / Ph. Eur. 2.9.1 / JP 6.09\n";
    csv += `Sample Monograph: ${this.selectedSample.title}\n`;
    csv += "Time(s),Strokes,CPM,BathTemp(C),IntactTablets\n";
    this.auditLog.forEach(row => {
      csv += `${row.time},${row.strokes},${row.cpm},${row.temp},${row.intact}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ERWEKA_ZT322_GLP_Run_${Date.now()}.csv`;
    a.click();
  }

  // --------------------------------------------------------------------------
  // Interactive Guided Walkthrough Tour with Voiceover Narration
  // --------------------------------------------------------------------------
  toggleGuidedTour() {
    if (this.tourActive) {
      this.stopGuidedTour();
    } else {
      this.startGuidedTour();
    }
  }

  startGuidedTour() {
    this.tourActive = true;
    this.tourIndex = 0;
    const btn = document.getElementById('btnGuidedTour');
    if (btn) {
      btn.innerText = '⏹ Stop Tour';
      btn.classList.add('active');
    }
    this.runTourStep();
  }

  stopGuidedTour() {
    this.tourActive = false;
    if (this.tourTimer) clearTimeout(this.tourTimer);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const overlay = document.getElementById('tourOverlay');
    if (overlay) overlay.classList.add('hidden');
    const btn = document.getElementById('btnGuidedTour');
    if (btn) {
      btn.innerText = '🎬 Guided Tour';
      btn.classList.remove('active');
    }
    // Restore standard assembled state
    this.engine.enclosureShell.visible = true;
    this.engine.bathGroup.visible = true;
    this.engine.driveGroup.visible = true;
    this.engine.driveHead.visible = true;
    this.engine.setCutaway(false);
    this.engine.setExploded(0.0);
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
    if (badgeEl) badgeEl.innerText = ch.badge;
    if (titleEl) titleEl.innerText = ch.title;
    if (capEl) capEl.innerText = ch.voiceover;

    if (ch.setup) ch.setup(this);
    if (ch.camPos && ch.camTarget) {
      this.engine.camera.position.set(ch.camPos[0], ch.camPos[1], ch.camPos[2]);
      this.controls.target.set(ch.camTarget[0], ch.camTarget[1], ch.camTarget[2]);
      this.controls.update();
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

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  initChemMateTheme();
  window.app = new DisintegrationApp();

  const params = new URLSearchParams(window.location.search);
  if (params.get('tour') === '1') {
    setTimeout(() => window.app.startGuidedTour(), 600);
  } else if (params.has('chapter')) {
    const chIdx = parseInt(params.get('chapter'), 10);
    if (!Number.isNaN(chIdx)) {
      setTimeout(() => window.app.applyTourChapter(chIdx), 500);
    }
  }
});
