/**
 * LabDockManager.js — Universal Digital Twin Instrument Mount Orchestrator
 * 
 * Safely initializes and docks all 18 laboratory instrument digital twins
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
import { buildSEMModel } from "../../sem_twin/software/viewer/sem3d.js";

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
  constructor(scene, options = {}) {
    this.scene = scene;
    this.options = Object.assign({
      lazyLoad: false,
      maxActiveMachines: 1,
      onTwinStateChange: null
    }, options);

    this.lazyLoad = !!this.options.lazyLoad;
    this.maxActiveMachines = Math.max(1, this.options.maxActiveMachines || 1);
    this.activeLoadedQueue = []; // FIFO tracking of powered-on twin IDs for LRU memory disposal

    this.root = new THREE.Group();
    this.root.name = "Modern_Lab_Instruments_Dock";
    this.docks = [];
    this.docksById = new Map();
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
      pos: new THREE.Vector3(-11.6, BENCH_Y, -4.15),
      rotY: Math.PI, // Rotated 180° so operator console & sample lid face South aisle (+Z)
      scale: 0.085,
      camConsole: { pos: new THREE.Vector3(-11.6, 1.25, -3.35), look: new THREE.Vector3(-11.6, 1.05, -4.15) },
      builder: () => createSpectrophotometerModel({ includeLab: false })
    });

    // 2. FTIR ATR Spectrometer (Nicolet iS50)
    this._mountTwin({
      id: "ftir",
      name: "FTIR Spectrometer",
      tag: "Thermo Nicolet iS50 Diamond ATR",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-8.6, BENCH_Y, -4.15),
      rotY: Math.PI, // Rotated 180° so diamond ATR deck & touchscreen face South aisle (+Z)
      scale: 0.09,
      camConsole: { pos: new THREE.Vector3(-8.6, 1.25, -3.35), look: new THREE.Vector3(-8.6, 1.05, -4.15) },
      builder: () => {
        const ftir = new FTIR3D(null, { includeLab: false, headless: true, skipRenderer: true, skipLoop: true });
        return ftir.rootGroup || ftir.scene;
      }
    });

    // 3. Karl Fischer Moisture Titrator (Metrohm 901 Titrando)
    this._mountTwin({
      id: "karl_fischer",
      name: "Karl Fischer Titrator",
      tag: "Metrohm 901 Titrando",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-7.2, BENCH_Y, -4.15),
      rotY: 0,
      scale: 0.09,
      camConsole: { pos: new THREE.Vector3(-7.2, 1.25, -3.35), look: new THREE.Vector3(-7.2, 1.05, -4.15) },
      builder: () => {
        const kf = new KarlFischer3D(null, { includeLab: false, headless: true, skipRenderer: true, skipLoop: true });
        return kf.root || kf.scene;
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
      pos: new THREE.Vector3(-4.0, BENCH_Y, -4.15),
      rotY: 0,
      scale: 0.10,
      camConsole: { pos: new THREE.Vector3(-4.0, 1.35, -3.15), look: new THREE.Vector3(-4.0, 1.15, -4.15) },
      builder: () => {
        const diss = new Dissolution3D(null, { includeLab: false, headless: true, skipRenderer: true, skipLoop: true });
        return diss.mainGroup || diss.scene;
      }
    });

    // 5. ERWEKA ZT 322 Tablet Disintegration Tester
    this._mountTwin({
      id: "disintegration_tester",
      name: "Tablet Disintegration Tester",
      tag: "ERWEKA ZT 322 Dual Basket Apparatus",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-2.0, BENCH_Y, -4.15),
      rotY: Math.PI, // Rotated 180° so water bath, beakers & keypad face South aisle (+Z)
      scale: 0.085,
      camConsole: { pos: new THREE.Vector3(-2.0, 1.35, -3.15), look: new THREE.Vector3(-2.0, 1.15, -4.15) },
      builder: () => {
        const disint = new Disintegration3D(null, { includeLab: false, headless: true, skipRenderer: true, skipLoop: true });
        const g = new THREE.Group();
        if (disint.chassisGroup) g.add(disint.chassisGroup);
        if (disint.bathGroup) g.add(disint.bathGroup);
        if (disint.driveGroup) g.add(disint.driveGroup);
        if (disint.driveHead) g.add(disint.driveHead);
        if (disint.consoleGroup) g.add(disint.consoleGroup);
        if (disint.electronicsGroup) g.add(disint.electronicsGroup);
        return g;
      }
    });

    // 6. Analytical Microbalance (Mettler XSE204)
    this._mountTwin({
      id: "balance",
      name: "Analytical Microbalance",
      tag: "0.1 mg Precision with Draft Shield",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(0.0, BENCH_Y, -4.15),
      rotY: Math.PI, // Rotated 180° so touchscreen & draft shield doors face South aisle (+Z)
      scale: 0.10,
      camConsole: { pos: new THREE.Vector3(0.0, 1.25, -3.35), look: new THREE.Vector3(0.0, 1.05, -4.15) },
      builder: () => createBalanceModel({ includeLab: false })
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
      pos: new THREE.Vector3(-2.2, BENCH_Y, 4.65),
      rotY: 0, // Native front is -Z, facing South aisle (-Z)
      scale: 0.10,
      camConsole: { pos: new THREE.Vector3(-2.2, 1.30, 3.85), look: new THREE.Vector3(-2.2, 1.05, 4.65) },
      builder: () => createCentrifugeModel(null, { includeLab: false })
    });

    // 8. Labconco FreeZone 4.5L Cascade Freeze Dryer (-84°C)
    this._mountTwin({
      id: "freeze_dryer",
      name: "Freeze Dryer (Lyophilizer)",
      tag: "Labconco FreeZone 4.5L Cascade",
      zone: "Zone 3: Sample Prep & Lyophilization Suite",
      pos: new THREE.Vector3(-0.5, BENCH_Y, 4.65),
      rotY: Math.PI, // Native front is +Z, rotated 180° to face South aisle (-Z)
      scale: 0.08,
      camConsole: { pos: new THREE.Vector3(-0.5, 1.35, 3.85), look: new THREE.Vector3(-0.5, 1.15, 4.65) },
      builder: () => {
        const fd = new FreezeDryer3D(null, { includeLab: false, headless: true, skipRenderer: true, skipLoop: true });
        return fd.root || fd.scene;
      }
    });

    // 9. Ultrasonic Cavitation Cleaning Bath
    this._mountTwin({
      id: "ultrasonic_cleaner",
      name: "Ultrasonic Cleaner",
      tag: "Piezo Acoustic Cavitation Bath",
      zone: "Zone 3: Sample Prep & Lyophilization Suite",
      pos: new THREE.Vector3(1.0, BENCH_Y, 4.65),
      rotY: 0, // Native front is -Z, facing South aisle (-Z)
      scale: 0.10,
      camConsole: { pos: new THREE.Vector3(1.0, 1.25, 3.85), look: new THREE.Vector3(1.0, 1.05, 4.65) },
      builder: () => createUltrasonicCleanerModel(null, { includeLab: false })
    });

    // 10. Digital Multi-Tube Vortex Mixer
    this._mountTwin({
      id: "vortex_mixer",
      name: "Vortex Mixer",
      tag: "Digital Precision Test Tube Mixer",
      zone: "Zone 3: Sample Prep & Lyophilization Suite",
      pos: new THREE.Vector3(2.0, BENCH_Y, 4.65),
      rotY: Math.PI,
      scale: 0.001, // Modeled in millimeters -> 0.001 converts mm to meters!
      camConsole: { pos: new THREE.Vector3(2.0, 1.25, 3.85), look: new THREE.Vector3(2.0, 1.05, 4.65) },
      builder: () => {
        const vm = new VortexMixer3D(null);
        return vm.root;
      }
    });

    // ==========================================
    // WORKSTATION 4: SYNTHESIS & REACTION BAY (Fume Hoods at Z: 26.1 in Rear L-Wing)
    // ==========================================

    // 11. Buchi Rotovap R-300 (Inside Fume Hood 1 at X = -13.5, Z = 26.1)
    this._mountTwin({
      id: "rotovap",
      name: "Rotary Evaporator",
      tag: "Buchi Rotavapor R-300 + Heating Bath",
      zone: "Zone 2: Synthesis & High-Bay L-Wing",
      pos: new THREE.Vector3(-13.5, BENCH_Y, 26.05),
      rotY: 0,
      scale: 0.08,
      camConsole: { pos: new THREE.Vector3(-13.5, 1.35, 25.1), look: new THREE.Vector3(-13.5, 1.15, 26.05) },
      builder: () => createRotovapModel()
    });

    // 12. Diaphragm Vacuum Pump V-300 (Beside Rotovap in Fume Hood 1)
    this._mountTwin({
      id: "vacuum_pump",
      name: "Diaphragm Vacuum Pump",
      tag: "Laboratory Vacuum Pump V-300",
      zone: "Zone 2: Synthesis & High-Bay L-Wing",
      pos: new THREE.Vector3(-12.8, BENCH_Y, 26.05),
      rotY: 0,
      scale: 0.085,
      camConsole: { pos: new THREE.Vector3(-12.8, 1.25, 25.1), look: new THREE.Vector3(-12.8, 1.05, 26.05) },
      builder: () => createVacuumPumpModel()
    });

    // 13. Digital Ceramic Hotplate Magnetic Stirrer (Inside Fume Hood 2 at X = -9.8, Z = 26.1)
    this._mountTwin({
      id: "hotplate",
      name: "Hotplate Stirrer",
      tag: "Digital Ceramic Magnetic Stirrer + PT1000",
      zone: "Zone 2: Synthesis & High-Bay L-Wing",
      pos: new THREE.Vector3(-9.8, BENCH_Y, 26.05),
      rotY: 0,
      scale: 0.09,
      camConsole: { pos: new THREE.Vector3(-9.8, 1.25, 25.1), look: new THREE.Vector3(-9.8, 1.05, 26.05) },
      builder: () => createHotplateModel()
    });

    // 14. Parr 4560 High-Pressure Stirred Mini-Reactor (Beside Hotplate in Fume Hood 2)
    this._mountTwin({
      id: "high_pressure_reactor",
      name: "High Pressure Reactor",
      tag: "Parr 4560 600mL 200-Bar Stirred Mini-Reactor",
      zone: "Zone 2: Synthesis & High-Bay L-Wing",
      pos: new THREE.Vector3(-9.1, BENCH_Y, 26.05),
      rotY: 0,
      scale: 0.08,
      camConsole: { pos: new THREE.Vector3(-9.1, 1.35, 25.1), look: new THREE.Vector3(-9.1, 1.15, 26.05) },
      builder: (group) => buildReactor3D({ scene: group, includeLab: false })
    });

    // ==========================================
    // WORKSTATION 5: THERMAL & GRAVIMETRIC (X: -11.8, Z: -8.25)
    // ==========================================

    // 15. High-Temperature Muffle Furnace
    this._mountTwin({
      id: "muffle_furnace",
      name: "Muffle Furnace",
      tag: "9L 1200°C High-Temp Ceramic Fibre",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-11.8, BENCH_Y, -8.25),
      rotY: Math.PI, // Rotated 180° so vertical lift door & Eurotherm PID face North aisle (+Z)
      scale: 0.08,
      camConsole: { pos: new THREE.Vector3(-11.8, 1.35, -7.25), look: new THREE.Vector3(-11.8, 1.15, -8.25) },
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
    // WORKSTATION 7: WET CHEMISTRY & TITRATION (X: -8.2, Z: -8.25)
    // ==========================================

    // 17. Benchtop Dual pH/mV Meter with ATC
    this._mountTwin({
      id: "ph_meter",
      name: "pH / mV Meter",
      tag: "Precision Benchtop Meter with ATC",
      zone: "Zone 1: Main Analytical & Pharmaceutical QC Hall",
      pos: new THREE.Vector3(-8.2, BENCH_Y, -8.25),
      rotY: Math.PI, // Rotated 180° so sloped touchscreen & electrode arm face North aisle (+Z)
      scale: 0.10,
      camConsole: { pos: new THREE.Vector3(-8.2, 1.25, -7.25), look: new THREE.Vector3(-8.2, 1.05, -8.25) },
      builder: () => createPHMeterModel({ includeLab: false })
    });

    // ==========================================
    // WORKSTATION 8: HIGH-RESOLUTION ELECTRON MICROSCOPY SUITE (X: 5.2, Z: -4.5)
    // ==========================================

    // 18. Field Emission Scanning Electron Microscope (FE-SEM)
    this._mountTwin({
      id: "sem",
      name: "Scanning Electron Microscope",
      tag: "Zeiss Gemini FE-SEM (0.8nm UHV Resolution)",
      zone: "Zone 4: High-Resolution Microscopy & Nanomaterials Suite",
      pos: new THREE.Vector3(5.0, 0.0, -1.8), // Dedicated vibration-isolated station
      rotY: Math.PI, // Rotated 180° so FE-SEM chamber door, dual 4K screens & trackball console (-Z native) face North (+Z) towards operator
      scale: 1.0,
      camConsole: { pos: new THREE.Vector3(5.0, 1.45, -0.6), look: new THREE.Vector3(5.0, 1.25, -1.8) },
      builder: (group) => buildSEMModel(null, { includeLab: false })
    });
  }

  _sanitizeTwinModel(rootGroup, twinId) {
    const toRemove = [];

    rootGroup.traverse((child) => {
      // Ignore standby plinth components
      if (child.name && (child.name.startsWith("Plinth_") || child.name.includes("Standby"))) return;

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

  _createStandbyCanvasTexture(title, tag) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    // High-tech dark glass backdrop
    ctx.fillStyle = "rgba(10, 16, 26, 0.95)";
    ctx.fillRect(0, 0, 512, 256);

    // Cyan luminescent boundary
    ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 496, 240);

    // Accent header banner
    ctx.fillStyle = "rgba(0, 240, 255, 0.08)";
    ctx.fillRect(10, 10, 492, 52);

    // Amber Standby Pill
    ctx.fillStyle = "rgba(255, 170, 0, 0.2)";
    ctx.fillRect(24, 20, 160, 32);
    ctx.strokeStyle = "#ffaa00";
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 20, 160, 32);

    ctx.fillStyle = "#ffaa00";
    ctx.font = "bold 15px monospace";
    ctx.fillText("● STANDBY / OFF", 32, 42);

    // ECO Mobile tag
    ctx.fillStyle = "#00ffaa";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "right";
    ctx.fillText("ECO MOBILE MODE", 488, 42);
    ctx.textAlign = "left";

    // Instrument Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    const displayTitle = title.length > 27 ? title.slice(0, 25) + "…" : title;
    ctx.fillText(displayTitle, 24, 106);

    // Instrument Subtitle / Spec Tag
    ctx.fillStyle = "#8fa3b8";
    ctx.font = "16px monospace";
    const displayTag = tag.length > 34 ? tag.slice(0, 32) + "…" : tag;
    ctx.fillText(displayTag, 24, 140);

    // Interactive Button Indicator
    ctx.fillStyle = "rgba(0, 240, 255, 0.18)";
    ctx.fillRect(24, 172, 464, 58);
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 172, 464, 58);

    ctx.fillStyle = "#00f0ff";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("⚡ TAP TO POWER ON", 256, 209);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _createStandbyPlinth(dockGroup, cfg) {
    const plinthGroup = new THREE.Group();
    plinthGroup.name = `Plinth_${cfg.id}`;

    // 1. Sleek chamfered SEFA mounting pad (dark graphite with subtle metallic luster)
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x181e28,
      roughness: 0.35,
      metalness: 0.8
    });
    const pad = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.12, 4.2), padMat);
    pad.position.y = 0.06;
    pad.castShadow = true;
    pad.receiveShadow = true;
    plinthGroup.add(pad);

    // 2. Cyan illuminated perimeter accent glow strip
    const borderMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6
    });
    const border = new THREE.Mesh(new THREE.BoxGeometry(5.06, 0.04, 4.26), borderMat);
    border.position.y = 0.06;
    plinthGroup.add(border);

    // 3. Four corner locator pins / brackets
    const bracketMat = new THREE.MeshStandardMaterial({
      color: 0x4a5568,
      roughness: 0.2,
      metalness: 0.9
    });
    const bracketGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 12);
    [
      [-2.3, -1.9], [2.3, -1.9],
      [-2.3, 1.9], [2.3, 1.9]
    ].forEach(([bx, bz]) => {
      const b = new THREE.Mesh(bracketGeo, bracketMat);
      b.position.set(bx, 0.12, bz);
      plinthGroup.add(b);
    });

    // 4. Standby Status LED indicator
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 }); // amber standby
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), ledMat);
    led.position.set(-2.0, 0.2, 1.7);
    plinthGroup.add(led);

    // 5. Tilted Holographic Acrylic Monograph Display Plate (faces operator at +Z)
    const signGroup = new THREE.Group();
    signGroup.position.set(0, 0.2, 1.5);
    signGroup.rotation.x = -Math.PI * 0.18; // 32° tilt toward operator

    // Acrylic plate backing
    const acrylicMat = new THREE.MeshStandardMaterial({
      color: 0x0a121c,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85
    });
    const plate = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.0, 0.06), acrylicMat);
    plate.position.y = 1.0;
    signGroup.add(plate);

    // Dynamic Canvas Badge Decal
    const badgeTexture = this._createStandbyCanvasTexture(cfg.name, cfg.tag);
    const badgeMat = new THREE.MeshBasicMaterial({
      map: badgeTexture,
      transparent: true,
      opacity: 0.95
    });
    const badgeQuad = new THREE.Mesh(new THREE.PlaneGeometry(3.9, 1.9), badgeMat);
    badgeQuad.position.set(0, 1.0, 0.035);
    signGroup.add(badgeQuad);

    plinthGroup.add(signGroup);

    dockGroup.add(plinthGroup);
    dockGroup.userData.standbyMesh = plinthGroup;
    return plinthGroup;
  }

  _instantiateTwinModel(dockGroup, cfg) {
    if (dockGroup.userData.modelRoot) {
      return dockGroup.userData.modelRoot;
    }

    const childrenBefore = new Set(dockGroup.children);
    try {
      const result = cfg.builder(dockGroup);
      let modelRoot = null;
      if (result && result.isObject3D) {
        modelRoot = result;
      } else if (result && result.root && result.root.isObject3D) {
        modelRoot = result.root;
      }
      if (modelRoot && modelRoot !== dockGroup && !dockGroup.children.includes(modelRoot)) {
        dockGroup.add(modelRoot);
      }
      
      const newChildren = dockGroup.children.filter(c => !childrenBefore.has(c));
      const effectiveRoot = modelRoot || (newChildren.length === 1 ? newChildren[0] : newChildren);
      dockGroup.userData.modelRoot = effectiveRoot;

      this._sanitizeTwinModel(dockGroup, cfg.id);
      return effectiveRoot;
    } catch (err) {
      console.warn(`Error instantiating instrument twin '${cfg.id}':`, err);
      return null;
    }
  }

  _disposeObject(obj) {
    if (!obj) return;
    const items = Array.isArray(obj) ? obj : [obj];

    items.forEach((item) => {
      if (!item || !item.traverse) return;
      item.traverse((child) => {
        if (child.isMesh || child.isLine || child.isPoints) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((m) => {
              if (!m) return;
              for (const key of Object.keys(m)) {
                const val = m[key];
                if (val && typeof val === "object" && val.isTexture) {
                  val.dispose();
                }
              }
              m.dispose();
            });
          }
        }
      });

      if (item.parent) {
        item.parent.remove(item);
      }
    });
  }

  turnOnTwin(id) {
    const dock = this.getDockById(id);
    if (!dock) return false;

    if (dock.userData.isOn && dock.userData.isLoaded) {
      return true;
    }

    // In lazyLoad / mobile mode, if we reached max active machines, evict the oldest
    if (this.lazyLoad && this.activeLoadedQueue.length >= this.maxActiveMachines) {
      const oldestId = this.activeLoadedQueue.shift();
      if (oldestId && oldestId !== id) {
        this.turnOffTwin(oldestId);
      }
    }

    // Instantiate model if not yet loaded
    if (!dock.userData.isLoaded || !dock.userData.modelRoot) {
      this._instantiateTwinModel(dock, dock.userData.cfg);
      dock.userData.isLoaded = true;
    }

    // If model exists, ensure it is visible
    const m = dock.userData.modelRoot;
    if (m) {
      if (Array.isArray(m)) {
        m.forEach(c => { c.visible = true; });
      } else if (m.isObject3D) {
        m.visible = true;
      }
    }

    // Hide the standby plinth
    if (dock.userData.standbyMesh) {
      dock.userData.standbyMesh.visible = false;
    }

    dock.userData.isOn = true;

    // Track in LRU queue
    const qIdx = this.activeLoadedQueue.indexOf(id);
    if (qIdx !== -1) {
      this.activeLoadedQueue.splice(qIdx, 1);
    }
    this.activeLoadedQueue.push(id);

    if (typeof this.options.onTwinStateChange === "function") {
      this.options.onTwinStateChange(id, true);
    }

    return true;
  }

  turnOffTwin(id) {
    const dock = this.getDockById(id);
    if (!dock) return false;

    if (!dock.userData.isOn && !dock.userData.isLoaded) {
      return true;
    }

    // If lazyLoad is true, we dispose the model from VRAM to keep memory minimal
    if (this.lazyLoad) {
      if (dock.userData.modelRoot) {
        this._disposeObject(dock.userData.modelRoot);
        dock.userData.modelRoot = null;
        dock.userData.isLoaded = false;
      }
    } else {
      // In desktop/non-lazy mode, we just hide the model
      const m = dock.userData.modelRoot;
      if (m) {
        if (Array.isArray(m)) {
          m.forEach(c => { c.visible = false; });
        } else if (m.isObject3D) {
          m.visible = false;
        }
      }
    }

    // Show the standby plinth
    if (dock.userData.standbyMesh) {
      dock.userData.standbyMesh.visible = true;
    }

    dock.userData.isOn = false;

    const qIdx = this.activeLoadedQueue.indexOf(id);
    if (qIdx !== -1) {
      this.activeLoadedQueue.splice(qIdx, 1);
    }

    if (typeof this.options.onTwinStateChange === "function") {
      this.options.onTwinStateChange(id, false);
    }

    return true;
  }

  toggleTwin(id) {
    if (this.isTwinOn(id)) {
      return this.turnOffTwin(id);
    } else {
      return this.turnOnTwin(id);
    }
  }

  isTwinOn(id) {
    const dock = this.getDockById(id);
    return Boolean(dock && dock.userData.isOn);
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
      camConsole: cfg.camConsole,
      cfg: cfg,
      isLoaded: false,
      isOn: false,
      modelRoot: null,
      standbyMesh: null
    };

    // Always create the procedural standby plinth
    this._createStandbyPlinth(dockGroup, cfg);

    if (!this.lazyLoad) {
      // Desktop full mode: load immediately
      this._instantiateTwinModel(dockGroup, cfg);
      dockGroup.userData.isLoaded = true;
      dockGroup.userData.isOn = true;
      if (dockGroup.userData.standbyMesh) {
        dockGroup.userData.standbyMesh.visible = false;
      }
      this.activeLoadedQueue.push(cfg.id);
    } else {
      // Mobile / Lazy mode: plinth is visible, model is NOT built yet
      dockGroup.userData.isLoaded = false;
      dockGroup.userData.isOn = false;
      if (dockGroup.userData.standbyMesh) {
        dockGroup.userData.standbyMesh.visible = true;
      }
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
    this.docksById.set(cfg.id, dockGroup);
  }

  getDockById(id) {
    return this.docksById.get(id) || this.docks.find((d) => d.userData.id === id);
  }
}
