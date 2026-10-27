/**
 * LabDockManager.js — Digital Twin Instrument Orchestrator & Mount Engine
 * 
 * Mounts all 17 digital instrument twins onto SEFA casework at countertop datum Y = 0.90m:
 * 1. UV-Vis Spectrophotometer (WS-1: Analytical Island)
 * 2. FTIR ATR Spectrometer (WS-1: Analytical Island)
 * 3. Metrohm 901 Karl Fischer Titrator (WS-1: Analytical Island)
 * 4. Agilent 708-DS Dissolution Tester (WS-2: Pharma QC Island)
 * 5. ERWEKA ZT 322 Disintegration Tester (WS-2: Pharma QC Island)
 * 6. Analytical Microbalance (WS-2: Pharma QC Island)
 * 7. Microcentrifuge MICRO 5424-R (WS-3: Sample Prep Island)
 * 8. Labconco FreeZone 4.5L Freeze Dryer (WS-3: Sample Prep Island)
 * 9. Ultrasonic Cleaner Bath (WS-3: Sample Prep Island)
 * 10. Digital Multi-Tube Vortex Mixer (WS-3: Sample Prep Island)
 * 11. Buchi Rotovap R-300 (WS-4: Synthesis Fume Hood Bay)
 * 12. Diaphragm Vacuum Pump V-300 (WS-4: Synthesis Fume Hood Bay)
 * 13. Digital Ceramic Hotplate Magnetic Stirrer (WS-4: Synthesis Fume Hood Bay)
 * 14. Parr 4560 High-Pressure Stirred Reactor (WS-4: Synthesis Fume Hood Bay)
 * 15. High-Temp Muffle Furnace (WS-5: Thermal Bay)
 * 16. MBraun Inert Glove Box (WS-6: Controlled Atmosphere Bay)
 * 17. Benchtop Dual pH/mV Meter with ATC (WS-7: Wet Titration Bench)
 */
import * as THREE from "three";

// Dynamic Twin Imports
import { createSpectrophotometerModel } from "../../spectrophotometer_twin/software/viewer/spectrophotometer3d.js";
import { FTIR3D } from "../../ftir_twin/software/viewer/ftir3d.js";
import { KarlFischer3D } from "../../karl_fischer_twin/software/viewer/karl_fischer3d.js";

import { Dissolution3D } from "../../dissolution_tester_twin/software/viewer/dissolution3d.js";
import { Disintegration3D } from "../../disintegration_tester_twin/software/viewer/disintegration3d.js";
import { createBalanceModel } from "../../balance_twin/software/viewer/balance3d.js";

import { createCentrifugeModel } from "../../centrifuge_twin/software/viewer/centrifuge3d.js";
import { FreezeDryer3D } from "../../freeze_dryer_twin/software/viewer/freeze_dryer3d.js";
import { createUltrasonicCleanerModel } from "../../ultrasonic_cleaner_twin/software/viewer/ultrasonic3d.js";
import { VortexMixer3D } from "../../vortex_mixer_twin/software/viewer/vortex_mixer3d.js";

import { createRotovapModel } from "../../rotovap_twin/software/viewer/rotovap3d.js";
import { createVacuumPumpModel } from "../../vacuum_pump_twin/software/viewer/vacuum_pump3d.js";
import { createHotplateModel } from "../../hotplate_twin/software/viewer/hotplate3d.js";
import { buildReactor3D } from "../../high_pressure_reactor_twin/software/viewer/reactor3d.js";

import { createMuffleFurnaceModel } from "../../muffle_furnace_twin/software/viewer/muffle_furnace3d.js";
import { buildGloveBox3D } from "../../glove_box_twin/software/viewer/glove_box3d.js";
import { createPHMeterModel } from "../../ph_meter_twin/software/viewer/ph_meter3d.js";

export class LabDockManager {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = "Modern_Lab_Instruments_Dock";
    this.docks = [];
    this.clickableDocks = [];

    this._mountAllInstruments();
    this.scene.add(this.root);
  }

  _mountAllInstruments() {
    const BENCH_Y = 0.90; // Standard SEFA countertop datum

    // ==========================================
    // WORKSTATION 1: ANALYTICAL SPECTROSCOPY ISLAND (X: -10.0, Z: -4.5)
    // ==========================================
    
    // 1. UV-Vis Spectrophotometer
    this._mountTwin({
      id: "spectrophotometer",
      name: "UV-Vis Spectrophotometer",
      tag: "Shimadzu UV-2600i Dual-Beam",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-12.0, BENCH_Y, -4.0),
      rotY: 0,
      scale: 0.85,
      camConsole: { pos: new THREE.Vector3(-12.0, 1.25, -3.2), look: new THREE.Vector3(-12.0, 1.05, -4.0) },
      builder: () => createSpectrophotometerModel({ includeLab: false })
    });

    // 2. FTIR ATR Spectrometer
    this._mountTwin({
      id: "ftir",
      name: "FTIR Spectrometer",
      tag: "Thermo Nicolet iS50 Diamond ATR",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-10.2, BENCH_Y, -4.0),
      rotY: 0,
      scale: 0.85,
      camConsole: { pos: new THREE.Vector3(-10.2, 1.25, -3.2), look: new THREE.Vector3(-10.2, 1.05, -4.0) },
      builder: (group) => {
        try {
          const ftir = new FTIR3D(group, { includeLab: false });
          return ftir.group || group;
        } catch (e) {
          console.warn("FTIR3D init fallback:", e);
          return group;
        }
      }
    });

    // 3. Karl Fischer Moisture Titrator
    this._mountTwin({
      id: "karl_fischer",
      name: "Karl Fischer Titrator",
      tag: "Metrohm 901 Titrando",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-8.2, BENCH_Y, -4.0),
      rotY: 0,
      scale: 0.95,
      camConsole: { pos: new THREE.Vector3(-8.2, 1.25, -3.2), look: new THREE.Vector3(-8.2, 1.05, -4.0) },
      builder: (group) => {
        try {
          const kf = new KarlFischer3D(group, { includeLab: false });
          return kf.group || group;
        } catch (e) {
          console.warn("KarlFischer3D init fallback:", e);
          return group;
        }
      }
    });

    // ==========================================
    // WORKSTATION 2: PHARMACEUTICAL QC ISLAND (X: -2.0, Z: -4.5)
    // ==========================================

    // 4. Agilent 708-DS USP Dissolution Tester
    this._mountTwin({
      id: "dissolution_tester",
      name: "USP Dissolution Tester",
      tag: "Agilent 708-DS 8-Vessel",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-4.0, BENCH_Y, -4.0),
      rotY: 0,
      scale: 0.9,
      camConsole: { pos: new THREE.Vector3(-4.0, 1.35, -3.0), look: new THREE.Vector3(-4.0, 1.15, -4.0) },
      builder: (group) => {
        try {
          const diss = new Dissolution3D(group, { includeLab: false });
          return diss.group || group;
        } catch (e) {
          console.warn("Dissolution3D init fallback:", e);
          return group;
        }
      }
    });

    // 5. ERWEKA ZT 322 Tablet Disintegration Tester
    this._mountTwin({
      id: "disintegration_tester",
      name: "Tablet Disintegration Tester",
      tag: "ERWEKA ZT 322 Dual Basket",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-2.0, BENCH_Y, -4.0),
      rotY: 0,
      scale: 0.9,
      camConsole: { pos: new THREE.Vector3(-2.0, 1.35, -3.0), look: new THREE.Vector3(-2.0, 1.15, -4.0) },
      builder: (group) => {
        try {
          const disint = new Disintegration3D(group, { includeLab: false });
          return disint.group || group;
        } catch (e) {
          console.warn("Disintegration3D init fallback:", e);
          return group;
        }
      }
    });

    // 6. Analytical Microbalance
    this._mountTwin({
      id: "balance",
      name: "Analytical Microbalance",
      tag: "0.1 mg Precision with Draft Shield",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(0.0, BENCH_Y, -4.0),
      rotY: 0,
      scale: 0.85,
      camConsole: { pos: new THREE.Vector3(0.0, 1.25, -3.2), look: new THREE.Vector3(0.0, 1.05, -4.0) },
      builder: () => createBalanceModel()
    });

    // ==========================================
    // WORKSTATION 3: SAMPLE PREP & LYOPHILIZATION (X: -0.5, Z: 5.0)
    // ==========================================

    // 7. Refrigerated Microcentrifuge MICRO 5424-R
    this._mountTwin({
      id: "centrifuge",
      name: "Microcentrifuge",
      tag: "MICRO 5424-R Refrigerated",
      zone: "Zone 3: Sample Prep & Lyophilization Suite",
      pos: new THREE.Vector3(-2.2, BENCH_Y, 4.2),
      rotY: Math.PI,
      scale: 0.85,
      camConsole: { pos: new THREE.Vector3(-2.2, 1.30, 3.2), look: new THREE.Vector3(-2.2, 1.05, 4.2) },
      builder: () => createCentrifugeModel(null, { includeLab: false })
    });

    // 8. Labconco FreeZone 4.5L Cascade Freeze Dryer (-84°C)
    this._mountTwin({
      id: "freeze_dryer",
      name: "Freeze Dryer (Lyophilizer)",
      tag: "Labconco FreeZone 4.5L Cascade",
      zone: "Zone 3: Sample Prep & Lyophilization Suite",
      pos: new THREE.Vector3(-0.5, BENCH_Y, 4.2),
      rotY: Math.PI,
      scale: 0.85,
      camConsole: { pos: new THREE.Vector3(-0.5, 1.35, 3.2), look: new THREE.Vector3(-0.5, 1.15, 4.2) },
      builder: (group) => {
        try {
          const fd = new FreezeDryer3D(group, { includeLab: false });
          return fd.group || group;
        } catch (e) {
          console.warn("FreezeDryer3D init fallback:", e);
          return group;
        }
      }
    });

    // 9. Ultrasonic Cavitation Cleaning Bath
    this._mountTwin({
      id: "ultrasonic_cleaner",
      name: "Ultrasonic Cleaner",
      tag: "Piezo Acoustic Cavitation Bath",
      zone: "Zone 3: Sample Prep & Lyophilization Suite",
      pos: new THREE.Vector3(1.0, BENCH_Y, 4.2),
      rotY: Math.PI,
      scale: 0.85,
      camConsole: { pos: new THREE.Vector3(1.0, 1.25, 3.2), look: new THREE.Vector3(1.0, 1.05, 4.2) },
      builder: () => createUltrasonicCleanerModel(null, { includeLab: false })
    });

    // 10. Digital Multi-Tube Vortex Mixer
    this._mountTwin({
      id: "vortex_mixer",
      name: "Vortex Mixer",
      tag: "Digital Precision Test Tube Mixer",
      zone: "Zone 3: Sample Prep & Lyophilization Suite",
      pos: new THREE.Vector3(2.0, BENCH_Y, 4.2),
      rotY: Math.PI,
      scale: 0.9,
      camConsole: { pos: new THREE.Vector3(2.0, 1.25, 3.2), look: new THREE.Vector3(2.0, 1.05, 4.2) },
      builder: (group) => {
        try {
          const vm = new VortexMixer3D(group, { includeLab: false });
          return vm.group || group;
        } catch (e) {
          console.warn("VortexMixer3D init fallback:", e);
          return group;
        }
      }
    });

    // ==========================================
    // WORKSTATION 4: SYNTHESIS & REACTION BAY (X: -10.0, Z: 5.0 & Fume Hoods)
    // ==========================================

    // 11. Buchi Rotovap R-300 (Inside Fume Hood 1 at X = -13.5, Z = 8.1)
    this._mountTwin({
      id: "rotovap",
      name: "Rotary Evaporator",
      tag: "Buchi Rotavapor R-300 + Heating Bath",
      zone: "Zone 2: Synthesis & Reaction Bay",
      pos: new THREE.Vector3(-13.5, BENCH_Y, 7.9),
      rotY: Math.PI,
      scale: 0.8,
      camConsole: { pos: new THREE.Vector3(-13.5, 1.35, 6.8), look: new THREE.Vector3(-13.5, 1.15, 7.9) },
      builder: () => createRotovapModel()
    });

    // 12. Diaphragm Vacuum Pump V-300 (Beside Rotovap)
    this._mountTwin({
      id: "vacuum_pump",
      name: "Diaphragm Vacuum Pump",
      tag: "Laboratory Vacuum Pump V-300",
      zone: "Zone 2: Synthesis & Reaction Bay",
      pos: new THREE.Vector3(-12.8, BENCH_Y, 7.9),
      rotY: Math.PI,
      scale: 0.8,
      camConsole: { pos: new THREE.Vector3(-12.8, 1.25, 6.8), look: new THREE.Vector3(-12.8, 1.05, 7.9) },
      builder: () => createVacuumPumpModel()
    });

    // 13. Digital Ceramic Hotplate Magnetic Stirrer (Inside Fume Hood 2 at X = -9.5, Z = 8.1)
    this._mountTwin({
      id: "hotplate",
      name: "Hotplate Stirrer",
      tag: "Digital Ceramic Magnetic Stirrer + PT1000",
      zone: "Zone 2: Synthesis & Reaction Bay",
      pos: new THREE.Vector3(-9.5, BENCH_Y, 7.9),
      rotY: Math.PI,
      scale: 0.85,
      camConsole: { pos: new THREE.Vector3(-9.5, 1.25, 6.8), look: new THREE.Vector3(-9.5, 1.05, 7.9) },
      builder: () => createHotplateModel()
    });

    // 14. Parr 4560 High-Pressure Stirred Mini-Reactor (Beside Hotplate)
    this._mountTwin({
      id: "high_pressure_reactor",
      name: "High Pressure Reactor",
      tag: "Parr 4560 600mL 200-Bar Stirred Mini-Reactor",
      zone: "Zone 2: Synthesis & Reaction Bay",
      pos: new THREE.Vector3(-8.8, BENCH_Y, 7.9),
      rotY: Math.PI,
      scale: 0.85,
      camConsole: { pos: new THREE.Vector3(-8.8, 1.35, 6.8), look: new THREE.Vector3(-8.8, 1.15, 7.9) },
      builder: (group) => buildReactor3D({ scene: group, includeLab: false })
    });

    // ==========================================
    // WORKSTATION 5: THERMAL & GRAVIMETRIC (X: -13.0, Z: -8.3)
    // ==========================================

    // 15. High-Temperature Muffle Furnace
    this._mountTwin({
      id: "muffle_furnace",
      name: "Muffle Furnace",
      tag: "9L 1200°C High-Temp Ceramic Fibre",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-13.0, BENCH_Y, -8.3),
      rotY: 0,
      scale: 0.85,
      camConsole: { pos: new THREE.Vector3(-13.0, 1.35, -7.2), look: new THREE.Vector3(-13.0, 1.15, -8.3) },
      builder: () => createMuffleFurnaceModel({ includeLab: false })
    });

    // ==========================================
    // WORKSTATION 6: CONTROLLED ATMOSPHERE BAY (X: 5.5, Z: -4.5)
    // ==========================================

    // 16. MBraun Inert Atmosphere Glove Box
    this._mountTwin({
      id: "glove_box",
      name: "Inert Glove Box",
      tag: "MBraun UNIlab Pro (3 Gloves, Dual Antechamber)",
      zone: "Zone 4: Controlled Atmosphere & Gas Bay",
      pos: new THREE.Vector3(5.5, 0.0, -4.5), // Floor mounted unit
      rotY: Math.PI / 2,
      scale: 0.85,
      camConsole: { pos: new THREE.Vector3(4.2, 1.55, -4.5), look: new THREE.Vector3(5.5, 1.35, -4.5) },
      builder: (group) => buildGloveBox3D({ scene: group, includeLab: false })
    });

    // ==========================================
    // WORKSTATION 7: WET CHEMISTRY & TITRATION (X: -7.0, Z: -8.3)
    // ==========================================

    // 17. Benchtop Dual pH/mV Meter with ATC
    this._mountTwin({
      id: "ph_meter",
      name: "pH / mV Meter",
      tag: "Precision Benchtop Meter with ATC",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-7.0, BENCH_Y, -8.3),
      rotY: 0,
      scale: 0.9,
      camConsole: { pos: new THREE.Vector3(-7.0, 1.25, -7.3), look: new THREE.Vector3(-7.0, 1.05, -8.3) },
      builder: () => createPHMeterModel({ includeLab: false })
    });
  }

  _mountTwin(cfg) {
    const dockGroup = new THREE.Group();
    dockGroup.position.copy(cfg.pos);
    dockGroup.rotation.y = cfg.rotY;
    dockGroup.scale.setScalar(cfg.scale || 1.0);
    dockGroup.name = `Dock_${cfg.id}`;
    dockGroup.userData = {
      isTwinDock: true,
      id: cfg.id,
      name: cfg.name,
      tag: cfg.tag,
      zone: cfg.zone,
      camConsole: cfg.camConsole
    };

    try {
      const result = cfg.builder(dockGroup);
      if (result && result.isObject3D && result !== dockGroup) {
        dockGroup.add(result);
      }
    } catch (err) {
      console.warn(`Error mounting instrument twin '${cfg.id}':`, err);
    }

    // Add invisible interaction bounding box for distance click-to-glide
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 0.4;
    hitBox.userData = dockGroup.userData;
    dockGroup.add(hitBox);
    this.clickableDocks.push(hitBox);

    this.root.add(dockGroup);
    this.docks.push(dockGroup);
  }

  getDockById(id) {
    return this.docks.find((d) => d.userData.id === id);
  }
}
