/**
 * LabDockManager.js — Universal Digital Twin Instrument Mount Orchestrator
 * 
 * Safely initializes and docks all 17 laboratory instrument digital twins
 * onto SEFA casework at countertop datum Y = 0.90m with zero clipping and full procedural detail.
 */
import * as THREE from "three";

// 1. Factory Function Twins
import { createSpectrophotometerModel } from "../../spectrophotometer_twin/software/viewer/spectrophotometer3d.js";
import { createBalanceModel } from "../../balance_twin/software/viewer/balance3d.js";
import { createCentrifugeModel } from "../../centrifuge_twin/software/viewer/centrifuge3d.js";
import { createUltrasonicCleanerModel } from "../../ultrasonic_cleaner_twin/software/viewer/ultrasonic3d.js";
import { createRotovapModel } from "../../rotovap_twin/software/viewer/rotovap3d.js";
import { createVacuumPumpModel } from "../../vacuum_pump_twin/software/viewer/vacuum_pump3d.js";
import { createHotplateModel } from "../../hotplate_twin/software/viewer/hotplate3d.js";
import { buildReactor3D } from "../../high_pressure_reactor_twin/software/viewer/reactor3d.js";
import { createMuffleFurnaceModel } from "../../muffle_furnace_twin/software/viewer/muffle_furnace3d.js";
import { buildGloveBox3D } from "../../glove_box_twin/software/viewer/glove_box3d.js";
import { createPHMeterModel } from "../../ph_meter_twin/software/viewer/ph_meter3d.js";

// 2. Class-Based Twins (Require mock DOM container for headless instantiation)
import { FTIR3D } from "../../ftir_twin/software/viewer/ftir3d.js";
import { KarlFischer3D } from "../../karl_fischer_twin/software/viewer/karl_fischer3d.js";
import { Dissolution3D } from "../../dissolution_tester_twin/software/viewer/dissolution3d.js";
import { Disintegration3D } from "../../disintegration_tester_twin/software/viewer/disintegration3d.js";
import { FreezeDryer3D } from "../../freeze_dryer_twin/software/viewer/freeze_dryer3d.js";
import { VortexMixer3D } from "../../vortex_mixer_twin/software/viewer/vortex_mixer3d.js";

function createMockContainer() {
  const div = document.createElement("div");
  div.style.width = "800px";
  div.style.height = "600px";
  return div;
}

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
    
    // 1. UV-Vis Spectrophotometer (Shimadzu UV-2600i)
    this._mountTwin({
      id: "spectrophotometer",
      name: "UV-Vis Spectrophotometer",
      tag: "Shimadzu UV-2600i Dual-Beam",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-12.2, BENCH_Y, -4.0),
      rotY: Math.PI, // Rotated 180° so operator console & sample lid face South aisle (+Z)
      scale: 0.085,
      camConsole: { pos: new THREE.Vector3(-12.2, 1.25, -3.2), look: new THREE.Vector3(-12.2, 1.05, -4.0) },
      builder: () => createSpectrophotometerModel({ includeLab: false })
    });

    // 2. FTIR ATR Spectrometer (Nicolet iS50)
    this._mountTwin({
      id: "ftir",
      name: "FTIR Spectrometer",
      tag: "Thermo Nicolet iS50 Diamond ATR",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-10.2, BENCH_Y, -4.0),
      rotY: Math.PI, // Rotated 180° so diamond ATR deck & touchscreen face South aisle (+Z)
      scale: 0.09,
      camConsole: { pos: new THREE.Vector3(-10.2, 1.25, -3.2), look: new THREE.Vector3(-10.2, 1.05, -4.0) },
      builder: () => {
        const container = createMockContainer();
        const ftir = new FTIR3D(container, { includeLab: false, headless: true, skipLoop: true });
        ftir.isDestroyed = true;
        ftir.animate = () => {};
        const g = ftir.rootGroup || ftir.scene;
        ftir.renderer?.dispose();
        ftir.renderer?.forceContextLoss?.();
        return g;
      }
    });

    // 3. Karl Fischer Moisture Titrator (Metrohm 901 Titrando)
    this._mountTwin({
      id: "karl_fischer",
      name: "Karl Fischer Titrator",
      tag: "Metrohm 901 Titrando",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-8.2, BENCH_Y, -4.0),
      rotY: 0,
      scale: 0.09,
      camConsole: { pos: new THREE.Vector3(-8.2, 1.25, -3.2), look: new THREE.Vector3(-8.2, 1.05, -4.0) },
      builder: () => {
        const container = createMockContainer();
        const kf = new KarlFischer3D(container, { includeLab: false, headless: true, skipLoop: true });
        kf.isDestroyed = true;
        kf.animate = () => {};
        const g = kf.root || kf.scene;
        kf.renderer?.dispose();
        kf.renderer?.forceContextLoss?.();
        return g;
      }
    });

    // ==========================================
    // WORKSTATION 2: PHARMACEUTICAL QC ISLAND (X: -2.0, Z: -4.5)
    // ==========================================

    // 4. Agilent 708-DS USP Dissolution Tester
    this._mountTwin({
      id: "dissolution_tester",
      name: "USP Dissolution Tester",
      tag: "Agilent 708-DS 8-Vessel Apparatus",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-4.0, BENCH_Y, -4.0),
      rotY: 0,
      scale: 0.10,
      camConsole: { pos: new THREE.Vector3(-4.0, 1.35, -3.0), look: new THREE.Vector3(-4.0, 1.15, -4.0) },
      builder: () => {
        const container = createMockContainer();
        const diss = new Dissolution3D(container, { includeLab: false, headless: true, skipLoop: true });
        diss.isDestroyed = true;
        diss.animate = () => {};
        const g = diss.mainGroup || diss.scene;
        diss.renderer?.dispose();
        diss.renderer?.forceContextLoss?.();
        return g;
      }
    });

    // 5. ERWEKA ZT 322 Tablet Disintegration Tester
    this._mountTwin({
      id: "disintegration_tester",
      name: "Tablet Disintegration Tester",
      tag: "ERWEKA ZT 322 Dual Basket Apparatus",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-2.0, BENCH_Y, -4.0),
      rotY: Math.PI, // Rotated 180° so water bath, beakers & keypad face South aisle (+Z)
      scale: 0.085,
      camConsole: { pos: new THREE.Vector3(-2.0, 1.35, -3.0), look: new THREE.Vector3(-2.0, 1.15, -4.0) },
      builder: () => {
        const container = createMockContainer();
        const disint = new Disintegration3D(container, { includeLab: false, headless: true, skipLoop: true });
        disint.isDestroyed = true;
        disint.animate = () => {};
        const g = new THREE.Group();
        if (disint.chassisGroup) g.add(disint.chassisGroup);
        if (disint.bathGroup) g.add(disint.bathGroup);
        if (disint.driveGroup) g.add(disint.driveGroup);
        if (disint.driveHead) g.add(disint.driveHead);
        if (disint.consoleGroup) g.add(disint.consoleGroup);
        if (disint.electronicsGroup) g.add(disint.electronicsGroup);
        disint.renderer?.dispose();
        disint.renderer?.forceContextLoss?.();
        return g;
      }
    });

    // 6. Analytical Microbalance (Mettler XSE204)
    this._mountTwin({
      id: "balance",
      name: "Analytical Microbalance",
      tag: "0.1 mg Precision with Draft Shield",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(0.0, 0.00, -4.0), // Base is at Y=9.0 in decimeter scale -> 9.0*0.1=0.90m
      rotY: Math.PI, // Rotated 180° so touchscreen & draft shield doors face South aisle (+Z)
      scale: 0.10,
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
      pos: new THREE.Vector3(-2.2, BENCH_Y, 4.4),
      rotY: 0, // Native front is -Z, facing South aisle (-Z)
      scale: 0.10,
      camConsole: { pos: new THREE.Vector3(-2.2, 1.30, 3.5), look: new THREE.Vector3(-2.2, 1.05, 4.4) },
      builder: () => createCentrifugeModel(null, { includeLab: false })
    });

    // 8. Labconco FreeZone 4.5L Cascade Freeze Dryer (-84°C)
    this._mountTwin({
      id: "freeze_dryer",
      name: "Freeze Dryer (Lyophilizer)",
      tag: "Labconco FreeZone 4.5L Cascade",
      zone: "Zone 3: Sample Prep & Lyophilization Suite",
      pos: new THREE.Vector3(-0.5, BENCH_Y, 4.4),
      rotY: Math.PI, // Native front is +Z, rotated 180° to face South aisle (-Z)
      scale: 0.08,
      camConsole: { pos: new THREE.Vector3(-0.5, 1.35, 3.5), look: new THREE.Vector3(-0.5, 1.15, 4.4) },
      builder: () => {
        const container = createMockContainer();
        const fd = new FreezeDryer3D(container, { includeLab: false, headless: true, skipLoop: true });
        fd.isDestroyed = true;
        fd.animate = () => {};
        const g = fd.root || fd.scene;
        fd.renderer?.dispose();
        fd.renderer?.forceContextLoss?.();
        return g;
      }
    });

    // 9. Ultrasonic Cavitation Cleaning Bath
    this._mountTwin({
      id: "ultrasonic_cleaner",
      name: "Ultrasonic Cleaner",
      tag: "Piezo Acoustic Cavitation Bath",
      zone: "Zone 3: Sample Prep & Lyophilization Suite",
      pos: new THREE.Vector3(1.0, BENCH_Y, 4.4),
      rotY: 0, // Native front is -Z, facing South aisle (-Z)
      scale: 0.10,
      camConsole: { pos: new THREE.Vector3(1.0, 1.25, 3.5), look: new THREE.Vector3(1.0, 1.05, 4.4) },
      builder: () => createUltrasonicCleanerModel(null, { includeLab: false })
    });

    // 10. Digital Multi-Tube Vortex Mixer
    this._mountTwin({
      id: "vortex_mixer",
      name: "Vortex Mixer",
      tag: "Digital Precision Test Tube Mixer",
      zone: "Zone 3: Sample Prep & Lyophilization Suite",
      pos: new THREE.Vector3(2.0, BENCH_Y, 4.4),
      rotY: Math.PI,
      scale: 0.001, // Modeled in millimeters -> 0.001 converts mm to meters!
      camConsole: { pos: new THREE.Vector3(2.0, 1.25, 3.5), look: new THREE.Vector3(2.0, 1.05, 4.4) },
      builder: () => {
        const container = createMockContainer();
        const vm = new VortexMixer3D(container);
        const g = vm.root;
        vm.renderer?.dispose();
        vm.renderer?.forceContextLoss?.();
        return g;
      }
    });

    // ==========================================
    // WORKSTATION 4: SYNTHESIS & REACTION BAY (Fume Hoods at Z: 8.1)
    // ==========================================

    // 11. Buchi Rotovap R-300 (Inside Fume Hood 1 at X = -13.5, Z = 8.1)
    this._mountTwin({
      id: "rotovap",
      name: "Rotary Evaporator",
      tag: "Buchi Rotavapor R-300 + Heating Bath",
      zone: "Zone 2: Synthesis & Reaction Bay",
      pos: new THREE.Vector3(-13.5, BENCH_Y, 8.05),
      rotY: 0,
      scale: 0.08,
      camConsole: { pos: new THREE.Vector3(-13.5, 1.35, 7.1), look: new THREE.Vector3(-13.5, 1.15, 8.05) },
      builder: () => createRotovapModel()
    });

    // 12. Diaphragm Vacuum Pump V-300 (Beside Rotovap in Fume Hood 1)
    this._mountTwin({
      id: "vacuum_pump",
      name: "Diaphragm Vacuum Pump",
      tag: "Laboratory Vacuum Pump V-300",
      zone: "Zone 2: Synthesis & Reaction Bay",
      pos: new THREE.Vector3(-12.8, BENCH_Y, 8.05),
      rotY: 0,
      scale: 0.085,
      camConsole: { pos: new THREE.Vector3(-12.8, 1.25, 7.1), look: new THREE.Vector3(-12.8, 1.05, 8.05) },
      builder: () => createVacuumPumpModel()
    });

    // 13. Digital Ceramic Hotplate Magnetic Stirrer (Inside Fume Hood 2 at X = -9.8, Z = 8.1)
    this._mountTwin({
      id: "hotplate",
      name: "Hotplate Stirrer",
      tag: "Digital Ceramic Magnetic Stirrer + PT1000",
      zone: "Zone 2: Synthesis & Reaction Bay",
      pos: new THREE.Vector3(-9.8, BENCH_Y, 8.05),
      rotY: 0,
      scale: 0.09,
      camConsole: { pos: new THREE.Vector3(-9.8, 1.25, 7.1), look: new THREE.Vector3(-9.8, 1.05, 8.05) },
      builder: () => createHotplateModel()
    });

    // 14. Parr 4560 High-Pressure Stirred Mini-Reactor (Beside Hotplate in Fume Hood 2)
    this._mountTwin({
      id: "high_pressure_reactor",
      name: "High Pressure Reactor",
      tag: "Parr 4560 600mL 200-Bar Stirred Mini-Reactor",
      zone: "Zone 2: Synthesis & Reaction Bay",
      pos: new THREE.Vector3(-9.1, BENCH_Y, 8.05),
      rotY: 0,
      scale: 0.08,
      camConsole: { pos: new THREE.Vector3(-9.1, 1.35, 7.1), look: new THREE.Vector3(-9.1, 1.15, 8.05) },
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
      pos: new THREE.Vector3(-13.0, BENCH_Y, -8.2),
      rotY: Math.PI, // Rotated 180° so vertical lift door & Eurotherm PID face North aisle (+Z)
      scale: 0.08,
      camConsole: { pos: new THREE.Vector3(-13.0, 1.35, -7.2), look: new THREE.Vector3(-13.0, 1.15, -8.2) },
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
      scale: 0.10,
      camConsole: { pos: new THREE.Vector3(4.2, 1.55, -4.5), look: new THREE.Vector3(5.5, 1.35, -4.5) },
      builder: (group) => buildGloveBox3D({ scene: group, includeLab: false })
    });

    // ==========================================
    // WORKSTATION 7: WET CHEMISTRY & TITRATION (X: -7.0, Z: -8.2)
    // ==========================================

    // 17. Benchtop Dual pH/mV Meter with ATC
    this._mountTwin({
      id: "ph_meter",
      name: "pH / mV Meter",
      tag: "Precision Benchtop Meter with ATC",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-7.0, BENCH_Y, -8.2),
      rotY: Math.PI, // Rotated 180° so sloped touchscreen & electrode arm face North aisle (+Z)
      scale: 0.10,
      camConsole: { pos: new THREE.Vector3(-7.0, 1.25, -7.2), look: new THREE.Vector3(-7.0, 1.05, -8.2) },
      builder: () => createPHMeterModel({ includeLab: false })
    });
  }

  _sanitizeTwinModel(rootGroup, twinId) {
    const toRemove = [];

    rootGroup.traverse((child) => {
      // 1. Remove extraneous environment lights from standalone twin viewers
      if (child.isLight) {
        const ln = (child.name || "").toLowerCase();
        if (!ln.includes("led") && !ln.includes("status") && !ln.includes("bath") && !ln.includes("cell") && !ln.includes("downlight")) {
          toRemove.push(child);
          return;
        }
      }

      // 2. Identify extraneous standalone room/floor/bench groups
      const name = (child.name || "").toLowerCase();
      const parentName = (child.parent?.name || "").toLowerCase();

      const isRoomGroup = /^(lab_environment|lab_room_assembly|lab_room|labgroup|body_laboratoryroom)$/i.test(name) ||
                          (name === "lab" && child.isGroup);

      const isRoomMesh = /(^|_)ground($|_)|backsplash|room_ceiling|room_floor|troffer|perimeter_wall|stage_ground/i.test(name) ||
                         /lab_environment|lab_room_assembly|body_laboratoryroom/i.test(parentName);

      // Huge environment floor plane check (> 12 units in decimeter scale = > 1.2 meters)
      let isHugePlane = false;
      if (child.isMesh && child.geometry && child.geometry.type === "PlaneGeometry" && child.geometry.parameters) {
        const p = child.geometry.parameters;
        const maxDim = Math.max(p.width || 0, p.height || 0);
        if (maxDim > 12.0) {
          isHugePlane = true;
        }
      }

      // Neutralize transmission pass to avoid WebGL2 texSubImage2D overload resolution issues in headless / CDP
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (m && m.transmission && m.transmission > 0) {
            m.transmission = 0;
            m.transparent = true;
            if (m.opacity === undefined || m.opacity >= 1.0) m.opacity = 0.45;
          }
        });
      }

      if (isRoomGroup || isRoomMesh || isHugePlane) {
        toRemove.push(child);
      }
    });

    toRemove.forEach((obj) => {
      if (obj.parent) {
        obj.parent.remove(obj);
      }
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
      let modelRoot = null;
      if (result && result.isObject3D) {
        modelRoot = result;
      } else if (result && result.root && result.root.isObject3D) {
        modelRoot = result.root;
      }
      if (modelRoot && modelRoot !== dockGroup) {
        dockGroup.add(modelRoot);
      }
      this._sanitizeTwinModel(dockGroup, cfg.id);
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
