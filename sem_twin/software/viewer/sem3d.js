/**
 * sem3d.js — ZEISS GeminiSEM 500 Digital Twin Orchestrator (Centrifuge Gold Standard).
 *
 * Thin ES-module orchestrator that assembles the five domain-owned build modules:
 *   - sem_materials.js       (PBR materials, decal helpers, fasteners, badge)
 *   - sem_chassis_power.js   (plinth, isolators, service door, NEMA cord & duplex receptacle)
 *   - sem_chamber_column.js  (hollow UHV chamber, outward door, 5-axis stage, Gemini II column)
 *   - sem_internals.js       (turbo/scroll pumps, HV tank, PSU, toroid, motherboard, rear I/O)
 *   - sem_console_room.js    (VC-E suite, prep bench, console desk, dual VESA monitors, panels)
 *
 * Coordinate Convention: 1 unit = 100 mm | +Y up | operator front = -Z | screenRight = -X.
 */

import * as THREE from 'three';
import { MAT_ZEISS_WHITE, makeSREdesignsBadge } from './sem_materials.js';
import { buildPlinthAndChassis, buildPowerContinuityAssembly } from './sem_chassis_power.js';
import { buildSpecimenChamberAndStage, buildGeminiColumnAndDetectors } from './sem_chamber_column.js';
import { buildInternalMechanicsAndElectronicsBay } from './sem_internals.js';
import {
  buildVCELabRoom,
  buildOperatorConsoleAndControls,
  renderChamberScopeAndEDSCanvas,
} from './sem_console_room.js';

// Re-export the badge factory so static gates can trace Badge_SREdesigns through the orchestrator.
export { makeSREdesignsBadge };

const STAGE_BASE = new THREE.Vector3(0.0, -0.82, -0.05);
const CAROUSEL_SLOTS = 9;

export function buildSEMModel(tex = null, options = {}) {
  const root = new THREE.Group();
  root.name = 'Body_SEM_Complete';

  // 1. Optional standalone VC-E suite (docked lab_viewer supplies its own room)
  let labRoomGroup = null;
  if (options.includeLab !== false) {
    labRoomGroup = buildVCELabRoom();
    root.add(labRoomGroup);
  }

  // 2. Instrument assembly
  const instrumentGroup = new THREE.Group();
  instrumentGroup.name = 'Body_SEM_InstrumentAssembly';
  root.add(instrumentGroup);

  const { chassisGroup, serviceDoorPivot, rightBayWall } = buildPlinthAndChassis();
  instrumentGroup.add(chassisGroup);

  const { powerGroup, plugGroup, updatePowerCordCurve } = buildPowerContinuityAssembly();
  instrumentGroup.add(powerGroup);

  const {
    internalGroup,
    turboGroup,
    scrollGroup,
    hvTankGroup,
    psuGroup,
    moboGroup,
    bulkheadGroup,
    setBreakerLit,
  } = buildInternalMechanicsAndElectronicsBay();
  instrumentGroup.add(internalGroup);

  const {
    chamberGroup,
    doorPivot,
    stageGroup,
    carouselGroup,
    se2Group,
    bseGroup,
    edsGroup,
    mirrorGroup,
    pt100Group,
    gaugeGroup,
    updateStubCoating,
  } = buildSpecimenChamberAndStage();
  instrumentGroup.add(chamberGroup);

  const {
    columnGroup,
    lowerColumnBarrel,
    upperColumnBarrel,
    beamCone,
    fegGroup,
  } = buildGeminiColumnAndDetectors();
  instrumentGroup.add(columnGroup);

  const {
    consoleGroup,
    lcdMesh,
    rightLcdMesh,
    chamberscopeCanvas,
    chamberscopeTex,
    knobMeshes,
    buttonMeshes,
    allButtons,
    btnBreak,
    joyLeft,
    joyRight,
  } = buildOperatorConsoleAndControls(tex);
  instrumentGroup.add(consoleGroup);

  instrumentGroup.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  // --------------------------------------------------------------------------
  // Live secondary-monitor + power state
  // --------------------------------------------------------------------------
  const liveScopeState = {
    isPluggedIn: true,
    powerSwitch: true,
    beamOn: false,
    wdMm: 8.5,
    ehtKv: 15.0,
    chamberVacuumMbar: 1.4e-6,
    stageX: 0,
    stageY: 0,
    stageTilt: 0,
  };

  function isPowered() {
    return liveScopeState.isPluggedIn !== false && liveScopeState.powerSwitch !== false;
  }

  function refreshScope() {
    renderChamberScopeAndEDSCanvas(chamberscopeCanvas, chamberscopeTex, liveScopeState);
  }

  function applyPowerGating() {
    const powered = isPowered();
    setBreakerLit(powered);
    if (!powered) {
      beamCone.visible = false;
      liveScopeState.beamOn = false;
    }
    // Blank the primary LCD when there is no electrical continuity (DIAG-014)
    if (lcdMesh && lcdMesh.material) {
      lcdMesh.material.color = lcdMesh.material.color || new THREE.Color(0xffffff);
      lcdMesh.material.color.setHex(powered ? 0xffffff : 0x05070a);
    }
  }

  // --------------------------------------------------------------------------
  // Exploded view (DIAG-020: chamber/column lift >= 1.0 u = 100 mm)
  // --------------------------------------------------------------------------
  const explodeTargets = [
    { obj: columnGroup, delta: new THREE.Vector3(0.0, 3.20, 0.0) },
    { obj: chamberGroup, delta: new THREE.Vector3(0.0, 1.30, 0.0) },
    { obj: turboGroup, delta: new THREE.Vector3(0.0, -0.20, -2.40) },
    { obj: scrollGroup, delta: new THREE.Vector3(-0.60, 0.0, -2.60) },
    { obj: hvTankGroup, delta: new THREE.Vector3(-0.40, 0.0, 2.20) },
    { obj: psuGroup, delta: new THREE.Vector3(0.0, 0.0, 2.10) },
    { obj: moboGroup, delta: new THREE.Vector3(0.0, 0.0, -3.10) },
    { obj: bulkheadGroup, delta: new THREE.Vector3(0.0, 0.0, 1.80) },
  ].map(t => ({ ...t, base: t.obj.position.clone() }));

  const columnTubes = new Set([lowerColumnBarrel, upperColumnBarrel]);
  const cutawayMat = new THREE.MeshPhysicalMaterial({
    color: 0xf4f6f8,
    transparent: true,
    opacity: 0.16,
    roughness: 0.25,
    depthWrite: false,
  });
  const bayWallMaterials = new Map();
  rightBayWall.traverse(o => {
    if (o.isMesh) bayWallMaterials.set(o, o.material);
  });

  let currentExplode = 0;
  let currentDoorOpen = 0;
  let cutawayActive = false;

  function applyDoorAndExplodeState() {
    explodeTargets.forEach(t => t.obj.position.copy(t.base).addScaledVector(t.delta, currentExplode));
    // Both doors swing OUTWARD toward the operator (-Z) with a +angle around +Y.
    const serviceAngle = Math.max(currentExplode * 1.45, cutawayActive ? 1.55 : 0);
    serviceDoorPivot.rotation.y = +serviceAngle;
    const chamberDoorAngle = Math.max(currentDoorOpen * 1.30, currentExplode * 1.10);
    doorPivot.rotation.y = +chamberDoorAngle;
  }

  function setExplodeAmount(val) {
    currentExplode = Math.max(0, Math.min(1, Number(val) || 0));
    applyDoorAndExplodeState();
  }

  function setCutawayMode(enabled) {
    cutawayActive = Boolean(enabled);
    columnTubes.forEach(m => {
      m.material = cutawayActive ? cutawayMat : MAT_ZEISS_WHITE;
    });
    rightBayWall.visible = !cutawayActive;
    applyDoorAndExplodeState();
  }

  function setDoorOpen(openRatio) {
    currentDoorOpen =
      typeof openRatio === 'boolean' ? (openRatio ? 1 : 0) : Math.max(0, Math.min(1, Number(openRatio) || 0));
    applyDoorAndExplodeState();
  }

  // --------------------------------------------------------------------------
  // Power continuity (DIAG-014)
  // --------------------------------------------------------------------------
  function setPluggedIn(plugged) {
    liveScopeState.isPluggedIn = Boolean(plugged);
    updatePowerCordCurve(liveScopeState.isPluggedIn);
    applyPowerGating();
    refreshScope();
  }

  function setPowerState(plugged, powerSwitch) {
    liveScopeState.isPluggedIn = Boolean(plugged);
    liveScopeState.powerSwitch = Boolean(powerSwitch);
    updatePowerCordCurve(liveScopeState.isPluggedIn);
    applyPowerGating();
    refreshScope();
  }

  function setBeamActive(active, ehtKv = 15.0) {
    const on = Boolean(active) && isPowered();
    beamCone.visible = on;
    liveScopeState.beamOn = on;
    liveScopeState.ehtKv = ehtKv;
    refreshScope();
  }

  // --------------------------------------------------------------------------
  // 5-axis stage kinematics (+-52.5 mm X/Y, WD 2-40 mm, tilt, 9-slot 40 deg carousel)
  // --------------------------------------------------------------------------
  function setStagePosition({ x = 0, y = 0, z = 8.5, tilt = 0, rot = 0, specimenIndex = 0, coatedByStub } = {}) {
    const k = 0.45 / 52.5;
    stageGroup.position.set(
      STAGE_BASE.x + x * k,
      STAGE_BASE.y - (z - 8.5) * 0.012,
      STAGE_BASE.z + y * k
    );
    stageGroup.rotation.x = (Math.max(-5, Math.min(70, tilt)) * Math.PI) / 180 * 0.5;
    carouselGroup.rotation.y = (rot * Math.PI) / 180 - (specimenIndex * 2 * Math.PI) / CAROUSEL_SLOTS;
    if (Array.isArray(coatedByStub)) updateStubCoating(coatedByStub);

    joyRight.rotation.z = -(x / 52.5) * 0.25;
    joyRight.rotation.x = (y / 52.5) * 0.25;
    joyLeft.rotation.x = ((z - 8.5) / 31.5) * 0.25;

    liveScopeState.wdMm = z;
    liveScopeState.stageX = x;
    liveScopeState.stageY = y;
    liveScopeState.stageTilt = tilt;
    refreshScope();
  }

  function updateChamberScopeCanvas(partialState = {}) {
    Object.assign(liveScopeState, partialState);
    if ('sputterCoated' in partialState && typeof partialState.sputterCoated === 'boolean') {
      updateStubCoating(new Array(6).fill(partialState.sputterCoated));
    }
    applyPowerGating();
    refreshScope();
  }

  // --------------------------------------------------------------------------
  // Wireframe + Part Explorer isolation (room stays solid, LCDs never wireframed)
  // --------------------------------------------------------------------------
  const noWire = new Set(['UI_LCD', 'UI_LCD_ChamberScope']);
  const ownMaterial = new WeakSet();
  let explorerFocus = null;
  let globalWire = false;

  function ensureOwnMaterial(mesh) {
    if (ownMaterial.has(mesh)) return;
    if (Array.isArray(mesh.material)) mesh.material = mesh.material.map(m => m.clone());
    else if (mesh.material) mesh.material = mesh.material.clone();
    ownMaterial.add(mesh);
  }

  function setMeshWire(mesh, wf) {
    if (noWire.has(mesh.name)) return;
    if (columnTubes.has(mesh) && mesh.material === cutawayMat) return;
    if (!wf && !ownMaterial.has(mesh)) return; // never touched; already solid
    ensureOwnMaterial(mesh);
    (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m => {
      m.wireframe = wf;
    });
  }

  function setWireframe(enabled) {
    globalWire = Boolean(enabled);
    explorerFocus = null;
    instrumentGroup.traverse(o => {
      if (o.isMesh) {
        o.visible = true;
        setMeshWire(o, globalWire);
      }
    });
  }

  const catalogEntries = [
    { id: 'Body_ColumnGemini', label: 'Gemini II Electron Column & Beam Booster', category: 'Electron Optics',
      desc: 'Mu-metal shielded column with +8 kV Beam Booster liner, double condenser, 8-pole stigmator and magnetic-electrostatic objective.', node: columnGroup },
    { id: 'Body_GunHeadFEG', label: 'Schottky ZrO/W Field Emission Gun & 20 L/s IGP', category: 'Electron Optics',
      desc: 'ZrO/W(100) Schottky emitter at 1800 K held at 2.0e-10 mbar by the sputter ion getter pump.', node: fegGroup || columnGroup },
    { id: 'Body_ChamberUHV', label: '316L Hollow UHV Chamber & Outward Door', category: 'Vacuum & Stage',
      desc: 'Hollow 316L chamber with real front doorway, ConFlat ports clear of the door, DN100CF viewport and Viton seal.', node: chamberGroup },
    { id: 'Pivot_Stage5Axis', label: '5-Axis Eucentric Stage & 9-Stub Carousel', category: 'Vacuum & Stage',
      desc: '105 mm stage: X/Y +-52.5 mm, WD 2-40 mm, tilt -5..+70 deg, 360 deg rotation, 6 specimens + 3 calibration substrates.', node: stageGroup },
    { id: 'Body_DetectorSE2', label: 'SE2, 4Q-BSE, SDD EDS, Mirror, PT100 & Gauge', category: 'Detectors & Sensors',
      desc: 'Everhart-Thornley SE2, retractable 4Q-BSE, 100 mm2 SDD, 45 deg gold relay mirror, PT100 RTD and PKR 361 gauge.',
      node: se2Group, extra: [bseGroup, edsGroup, mirrorGroup, pt100Group, gaugeGroup] },
    { id: 'Motor_DriveTurboPump', label: 'HiPace 300 Turbo & HiScroll 6 Backing Pump', category: 'Vacuum & Stage',
      desc: '90,000 RPM turbo under the DN100CF chamber flange, backed via KF25 bellows by an oil-free scroll pump.',
      node: turboGroup, extra: [scrollGroup] },
    { id: 'Body_HVTank_30kV', label: '30 kV HV Tank, Mean Well PSU & Toroid', category: 'Power & Electronics',
      desc: 'Potted 30 kV multiplier, LRS-350-24 switching PSU with barrier strip, and 300 VA toroidal isolation transformer.',
      node: hvTankGroup, extra: [psuGroup] },
    { id: 'PCB_Motherboard', label: 'SmartSEM Motherboard, MCU, RAM, SSD & Wi-Fi/BLE', category: 'Power & Electronics',
      desc: '6-layer FR-4 board: ARM Cortex-M7, dual SDRAM, 256 GB NVMe, Wi-Fi/BLE with U.FL coax to rear antenna.',
      node: moboGroup, extra: [bulkheadGroup] },
    { id: 'Body_ConsoleDesk', label: 'Operator Console, Dual 27" LCDs & ZEISS Panels', category: 'Operator Console',
      desc: 'Desk at X = +4.50 with dual VESA arms, Dual-Rotary panel (8 encoders + 8 buttons) and Dual-Joystick box.', node: consoleGroup },
    { id: 'Body_Chassis', label: 'Plinth, Isolators, Service Door & Power Continuity', category: 'Chassis & Power',
      desc: 'Plinth on 4 leveling feet at Y = 0, pneumatic isolators, louvered service door, Badge_SREdesigns, NEMA plug and duplex receptacle.',
      node: chassisGroup, extra: [powerGroup] },
  ];

  function setExplorerFocus(partId) {
    if (!partId || partId === 'ALL') {
      explorerFocus = null;
      instrumentGroup.traverse(o => {
        if (o.isMesh) {
          o.visible = true;
          setMeshWire(o, globalWire);
        }
      });
      return null;
    }
    const found = catalogEntries.find(e => e.id === partId);
    if (!found) return null;
    explorerFocus = partId;
    const keep = new Set();
    [found.node, ...(found.extra || [])].filter(Boolean).forEach(n => n.traverse(c => keep.add(c)));
    instrumentGroup.traverse(o => {
      if (o.isMesh) {
        o.visible = true;
        setMeshWire(o, !keep.has(o));
      }
    });
    return found;
  }

  function getPartCatalog() {
    return catalogEntries;
  }

  function getRaycastTargets() {
    const targets = [];
    Object.entries(knobMeshes).forEach(([key, k]) => {
      if (key !== 'Knob_FocusWD') targets.push(k);
    });
    Object.values(allButtons || buttonMeshes).forEach(b => targets.push(b));
    if (btnBreak && !targets.includes(btnBreak)) targets.push(btnBreak);
    targets.push(plugGroup, doorPivot, serviceDoorPivot);
    return targets;
  }

  // Initial state
  applyDoorAndExplodeState();
  applyPowerGating();
  refreshScope();

  const api = {
    root,
    group: root,
    instrumentGroup,
    labRoomGroup,
    lcdMesh,
    rightLcdMesh,
    chamberscopeCanvas,
    updateChamberScopeCanvas,
    setExplodeAmount,
    setWireframe,
    setExplorerFocus,
    setCutawayMode,
    setDoorOpen,
    setPluggedIn,
    setPowerState,
    setBeamActive,
    setStagePosition,
    getPartCatalog,
    getRaycastTargets,
    knobMeshes,
    buttonMeshes: allButtons || buttonMeshes,
    nodes: {
      chassisGroup, serviceDoorPivot, rightBayWall, powerGroup, plugGroup, internalGroup,
      chamberGroup, doorPivot, stageGroup, carouselGroup, columnGroup, consoleGroup, beamCone,
    },
  };
  Object.assign(root.userData, api);
  return api;
}

export default buildSEMModel;
