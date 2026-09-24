/**
 * MICRO 5424-R Centrifuge App
 * Working keypad + LCD + lab rack + 3D twin
 */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  createCentrifugeModel,
  setExplodeAmount,
  setWireframe,
  setExplorerFocus,
  syncLabTubes,
  setKeyGlow,
  setKeyGlows,
  clearKeyGlows,
  setKeysPoweredBacklight,
  setKeyPressLit,
  updateKeyGlows,
} from "./centrifuge3d.js?v=20260724-zoom-light";
import {
  playKeyClick,
  playLidThud,
  playPowerOn,
  playPowerOff,
  playRunStart,
  playRunEnd,
  playFault,
  keyClickKind,
  setSfxMuted,
  isSfxMuted,
  setSfxVolume,
  startMusic,
  stopMusic,
  toggleMusic,
  isMusicOn,
  setMusicVolume,
  getMusicMode,
  getMusicConfig,
  applyMusicChat,
  listMusicStyles,
} from "./sfx.js?v=20260724-zoom-light";

// ---------------------------------------------------------------------------
// Physics / limits
// ---------------------------------------------------------------------------
const R_CM = 8.4;
const RCF_FACTOR = 1.118e-5;
const RPM_MIN = 100;
const RPM_MAX = 15000;
const RPM_STEP = 50;
const ACCEL_S = 3.5;
const DECEL_S = 2.8;
const ROTOR_N = 24;
const RACK_N = 24;

const rpmToRcf = (rpm) => RCF_FACTOR * R_CM * rpm * rpm;
const clampRpm = (rpm) => {
  rpm = Math.max(RPM_MIN, Math.min(RPM_MAX, rpm));
  return Math.max(RPM_MIN, Math.min(RPM_MAX, Math.round(rpm / RPM_STEP) * RPM_STEP));
};
const fmtTime = (s) => {
  s = Math.max(0, Math.floor(s));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

// ---------------------------------------------------------------------------
// Sample materials
// ---------------------------------------------------------------------------
const MATERIALS = {
  empty: { id: "empty", label: "Empty", description: "No sample", before: [], after: [], min_rcf: 0, min_time_s: 0, min_rpm: 0, density: 0, fill: 0 },
  whole_blood: {
    id: "whole_blood", label: "Whole blood",
    description: "Separates to plasma / buffy coat / packed RBCs",
    before: [{ name: "mixed", color: "#8B0000", fraction: 1 }],
    after: [
      { name: "RBCs", color: "#6B0000", fraction: 0.45 },
      { name: "buffy", color: "#E8D5A3", fraction: 0.05 },
      { name: "plasma", color: "#FFF3C4", fraction: 0.5 },
    ],
    min_rcf: 1000, min_time_s: 60, min_rpm: 2000, density: 1.06, fill: 0.65,
    story: {
      hook: "One tube of blood. Three futures.",
      why: "Whole blood is a busy crowd of cells and liquid. Scientists spin it so denser pieces sink and lighter fluid rises — then each layer can be tested or used on its own.",
      fill: "We load anticoagulated whole blood into a microcentrifuge tube. Right now everything is mixed: red cells, white cells, platelets, and plasma.",
      spin: "The rotor ramps hard. Thousands of ×g shove dense packed red cells outward (down the tube), while plasma floats inward (up).",
      layers: [
        {
          key: "RBCs",
          title: "Packed red blood cells (bottom)",
          what: "Dense hemoglobin-rich cells settle first. Darkest band at the bottom.",
          next: "Used for hematocrit checks, transfusion research, and oxygen-carry studies.",
        },
        {
          key: "buffy",
          title: "Buffy coat (thin middle ring)",
          what: "A slim band of white blood cells and platelets between red cells and plasma.",
          next: "Harvested for DNA/RNA, immune-cell counts, and platelet research.",
        },
        {
          key: "plasma",
          title: "Plasma (top, straw-colored)",
          what: "Mostly water with proteins, electrolytes, hormones, and clotting factors.",
          next: "Chemistry panels, antibody tests, and biomarker discovery start here.",
        },
      ],
      after: "Next steps in a real lab: carefully pipette the layer you need, label it, and send it to chemistry, hematology, or molecular work — without remixing the tube.",
    },
  },
  blood_serum_clot: {
    id: "blood_serum_clot", label: "Clotted blood",
    description: "Clot + gel + serum",
    before: [{ name: "clot mix", color: "#7A1F1F", fraction: 1 }],
    after: [
      { name: "clot", color: "#5C1010", fraction: 0.4 },
      { name: "gel", color: "#D4C48A", fraction: 0.08 },
      { name: "serum", color: "#FFE8A0", fraction: 0.52 },
    ],
    min_rcf: 1200, min_time_s: 90, min_rpm: 2500, density: 1.05, fill: 0.65,
  },
  bacterial_culture: {
    id: "bacterial_culture", label: "Bacterial culture",
    description: "Pellet + clear supernatant",
    before: [{ name: "broth", color: "#C4B87A", fraction: 1 }],
    after: [
      { name: "pellet", color: "#5A4A20", fraction: 0.12 },
      { name: "sup", color: "#E8E0B8", fraction: 0.88 },
    ],
    min_rcf: 3000, min_time_s: 120, min_rpm: 5000, density: 1.02, fill: 0.65,
    story: {
      hook: "Cells fall. Liquid clears.",
      why: "Microbiologists need either the cells or the liquid they grew in — not a muddy mix.",
      fill: "Cloudy culture broth: bacteria suspended throughout the media.",
      spin: "Centrifugal force packs cells into a pellet; spent media becomes supernatant.",
      layers: [
        {
          key: "pellet",
          title: "Cell pellet",
          what: "Dense bacterial mass at the bottom.",
          next: "Resuspended for DNA prep, protein work, or plating.",
        },
        {
          key: "sup",
          title: "Supernatant",
          what: "Cleared media above the pellet.",
          next: "Kept for secreted proteins/toxins, or discarded after harvest.",
        },
      ],
      after: "Pipette off supernatant, keep or toss the pellet depending on the protocol — never shake if you need clean layers.",
    },
  },
  plasmid_miniprep: {
    id: "plasmid_miniprep", label: "Plasmid lysate",
    description: "Debris pellet + cleared lysate",
    before: [{ name: "lysate", color: "#E0E8D0", fraction: 1 }],
    after: [
      { name: "debris", color: "#F5F5F0", fraction: 0.18 },
      { name: "cleared", color: "#F8FFF0", fraction: 0.82 },
    ],
    min_rcf: 10000, min_time_s: 180, min_rpm: 12000, density: 1.03, fill: 0.65,
  },
  pcr_mix: {
    id: "pcr_mix", label: "PCR mix",
    description: "Clear — little visual change",
    before: [{ name: "mix", color: "#E8F4FF", fraction: 1 }],
    after: [{ name: "mix", color: "#E8F4FF", fraction: 1 }],
    min_rcf: 200, min_time_s: 5, min_rpm: 1000, density: 1.01, fill: 0.25,
  },
  soil_slurry: {
    id: "soil_slurry", label: "Soil slurry",
    description: "Sediment layers",
    before: [{ name: "slurry", color: "#6B5344", fraction: 1 }],
    after: [
      { name: "sediment", color: "#3E2A1F", fraction: 0.35 },
      { name: "silt", color: "#8A7360", fraction: 0.15 },
      { name: "water", color: "#C4B8A8", fraction: 0.5 },
    ],
    min_rcf: 800, min_time_s: 60, min_rpm: 2000, density: 1.15, fill: 0.7,
  },
  ink_suspension: {
    id: "ink_suspension", label: "Ink / pigment",
    description: "Pigment pellet + carrier",
    before: [{ name: "ink", color: "#2A3F8F", fraction: 1 }],
    after: [
      { name: "pellet", color: "#0D1535", fraction: 0.2 },
      { name: "clear", color: "#D0D8F0", fraction: 0.8 },
    ],
    min_rcf: 1500, min_time_s: 90, min_rpm: 3000, density: 1.04, fill: 0.65,
  },
  water_buffer: {
    id: "water_buffer", label: "Clear buffer",
    description: "No visible pellet",
    before: [{ name: "buffer", color: "#E6F2FF", fraction: 1 }],
    after: [{ name: "buffer", color: "#E6F2FF", fraction: 1 }],
    min_rcf: 100, min_time_s: 1, min_rpm: 500, density: 1, fill: 0.65,
  },
  oil_water: {
    id: "oil_water", label: "Oil + water",
    description: "Aqueous bottom, oil top",
    before: [{ name: "emulsion", color: "#D4C89A", fraction: 1 }],
    after: [
      { name: "aqueous", color: "#B8D4E8", fraction: 0.55 },
      { name: "oil", color: "#E8D48A", fraction: 0.45 },
    ],
    min_rcf: 500, min_time_s: 45, min_rpm: 1500, density: 0.95, fill: 0.65,
  },
};

const CAPS = ["#2563EB", "#DC2626", "#16A34A", "#CA8A04", "#9333EA", "#0891B2", "#EA580C", "#DB2777"];
const matOf = (t) => MATERIALS[t.material_id] || MATERIALS.empty;
const layersOf = (t) => {
  const m = matOf(t);
  if (m.fill <= 0) return [];
  return t.separated ? m.after : m.before;
};

// ---------------------------------------------------------------------------
// Lab state
// ---------------------------------------------------------------------------
function createLab() {
  const tubes = {};
  const rotor = Array(ROTOR_N).fill(null);
  const rack = Array(RACK_N).fill(null);
  let seq = 0;
  for (let i = 0; i < RACK_N; i++) {
    seq += 1;
    const id = `T${String(seq).padStart(3, "0")}`;
    tubes[id] = {
      tube_id: id,
      material_id: "empty",
      location: "RACK",
      slot: i,
      separated: false,
      peak_rcf: 0,
      spun_time_s: 0,
      cap_color: CAPS[i % CAPS.length],
    };
    rack[i] = id;
  }
  return { tubes, rotor, rack, seq };
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------
const c = {
  powered: true, // start ON so LCD content is visible immediately
  state: "LID_OPEN",
  rpm_set: 12000,
  rpm_actual: 0,
  time_set_s: 120,
  time_elapsed_s: 0,
  temp_set_c: 4,
  temp_actual_c: 22,
  lid_open: true,
  lid_locked: false,
  display_mode: "RPM",
  focus: "RPM",
  short_held: false,
  auto_open_on_end: true,
  error: null,
  lab: createLab(),
  last_separation_changes: [],
  selected_tube_id: null,
  selected_rotor_slot: null,
  demo_scale: 1,
  _peak_rpm: 0,
  _peak_rcf: 0,
  _spin_s: 0,
  _sep_done: false,
};

/** 0 = closed, 1 = fully open (3D lid angle) */
let lidOpenAmt = 1;
let draggingLid = false;

function canAccessTubes() {
  return c.rpm_actual < 0.5 && !["ACCEL", "RUN", "DECEL"].includes(c.state) && c.lid_open;
}

function balanceReport() {
  const masses = c.lab.rotor.map((tid) => {
    if (!tid) return 0;
    const m = matOf(c.lab.tubes[tid]);
    return m.density * m.fill;
  });
  let imb = 0;
  for (let i = 0; i < 12; i++) imb += Math.abs(masses[i] - masses[i + 12]);
  return {
    imbalance_score: imb,
    balanced: imb < 0.35,
    occupied: c.lab.rotor.map((t, i) => (t ? i : null)).filter((x) => x !== null),
  };
}

function closeLid() {
  if (c.rpm_actual > 0.5) return;
  const wasOpen = c.lid_open;
  c.lid_open = false;
  c.lid_locked = true;
  if (wasOpen) playLidThud();
  if (["LID_OPEN", "END"].includes(c.state) || (String(c.state).startsWith("ERR_") && c.rpm_actual < 0.5)) {
    c.state = "READY";
    c.error = null;
  }
  flashKey("close-lid");
}

function openLidPhysical() {
  if (c.lid_locked && c.rpm_actual > 0.5) return;
  c.lid_open = true;
  c.lid_locked = false;
  c.state = "LID_OPEN";
  c.rpm_actual = 0;
}

function togglePower() {
  if (c.powered && ["ACCEL", "RUN", "DECEL"].includes(c.state)) {
    // Force stop then power off
    c.state = "DECEL";
    c.short_held = false;
  }
  c.powered = !c.powered;
  if (!c.powered) {
    c.rpm_actual = 0;
    c.error = null;
    if (!c.lid_open) c.state = "READY";
    else c.state = "LID_OPEN";
    setLabStatus("Power OFF");
    playPowerOff();
    if (centrifugeModel) {
      clearKeyGlows(centrifugeModel);
      setKeysPoweredBacklight(centrifugeModel, false);
    }
  } else {
    setLabStatus("Power ON");
    if (c.lid_open) c.state = "LID_OPEN";
    else c.state = "READY";
    playPowerOn();
    if (centrifugeModel) setKeysPoweredBacklight(centrifugeModel, true);
  }
}

function pressStartStop() {
  if (!c.powered) {
    setLabStatus("Power is OFF — press POWER first.");
    return;
  }
  if (["ACCEL", "RUN"].includes(c.state)) {
    c.state = "DECEL";
    c.short_held = false;
    return;
  }
  if (c.lid_open) {
    c.state = "ERR_LID";
    c.error = "E-01 LID OPEN";
    playFault();
    return;
  }
  if (!["READY", "END"].includes(c.state)) return;
  const bal = balanceReport();
  if (!bal.balanced && bal.occupied.length) {
    c.state = "ERR_IMBALANCE";
    c.error = "E-02 IMBALANCE";
    playFault();
    return;
  }
  c.time_elapsed_s = 0;
  c.lid_locked = true;
  c.state = "ACCEL";
  c.error = null;
  c.last_separation_changes = [];
  c._peak_rpm = 0;
  c._peak_rcf = 0;
  c._spin_s = 0;
  c._sep_done = false;
  playRunStart();
}

function pressOpen() {
  if (!c.powered) {
    // mechanical release still allowed when powered off? allow open if stopped
    if (c.rpm_actual > 0.5) return;
    c.lid_locked = false;
    openLidPhysical();
    return;
  }
  if (c.rpm_actual > 0.5 || ["ACCEL", "RUN", "DECEL"].includes(c.state)) return;
  c.lid_locked = false;
  openLidPhysical();
}

/** Manual lid angle 0=closed 1=open — used by grab interaction */
function setLidAmount(t) {
  t = Math.max(0, Math.min(1, t));
  if (c.rpm_actual > 0.5 || ["ACCEL", "RUN", "DECEL"].includes(c.state)) return;
  const wasOpen = c.lid_open;
  lidOpenAmt = t;
  c.lid_open = t > 0.45;
  c.lid_locked = !c.lid_open;
  if (c.lid_open) {
    c.state = "LID_OPEN";
  } else if (c.powered) {
    c.state = "READY";
    c.error = null;
  }
  // Soft thud when lid snaps closed or fully open after a drag/snap
  if (wasOpen !== c.lid_open && (t <= 0.02 || t >= 0.98 || t === 0 || t === 1)) {
    playLidThud();
  }
}

function shortDown() {
  if (!c.powered) {
    setLabStatus("Power is OFF.");
    return;
  }
  if (c.lid_open) {
    c.state = "ERR_LID";
    c.error = "E-01 LID OPEN";
    return;
  }
  if (!["READY", "END", "RUN", "ACCEL"].includes(c.state)) return;
  c.short_held = true;
  c.lid_locked = true;
  if (["READY", "END"].includes(c.state)) {
    c.state = "ACCEL";
    c.time_elapsed_s = 0;
    c._peak_rpm = 0;
    c._peak_rcf = 0;
    c._spin_s = 0;
    c._sep_done = false;
    c.last_separation_changes = [];
    c.error = null;
  }
}

function shortUp() {
  if (c.short_held) {
    c.short_held = false;
    if (["ACCEL", "RUN"].includes(c.state)) c.state = "DECEL";
  }
}

/** Single-step nudge for the currently focused field. */
function nudge(dir, stepScale = 1) {
  if (!c.powered) return;
  if (["ACCEL", "RUN", "DECEL"].includes(c.state)) return;
  if (c.focus === "RPM") {
    const step = Math.max(RPM_STEP, Math.round((RPM_STEP * stepScale) / RPM_STEP) * RPM_STEP);
    c.rpm_set = clampRpm(c.rpm_set + dir * step);
  } else if (c.focus === "TIME") {
    // base 30 s; scale → 1 min, then 5 min jumps when held
    const step = 30 * stepScale;
    c.time_set_s = Math.max(0, Math.min(99 * 60, c.time_set_s + dir * step));
  } else if (c.focus === "TEMP") {
    const step = Math.max(1, Math.round(stepScale));
    c.temp_set_c = Math.max(-10, Math.min(40, c.temp_set_c + dir * step));
  }
}

/** Map rocker key id → { focus, dir }. */
const ROCKER_KEYS = {
  "speed-up": { focus: "RPM", dir: 1, mode: "RPM" },
  "speed-down": { focus: "RPM", dir: -1, mode: "RPM" },
  "time-up": { focus: "TIME", dir: 1 },
  "time-down": { focus: "TIME", dir: -1 },
  "temp-up": { focus: "TEMP", dir: 1 },
  "temp-down": { focus: "TEMP", dir: -1 },
};

function isRockerKey(key) {
  return Object.prototype.hasOwnProperty.call(ROCKER_KEYS, key);
}

function applyRocker(key, stepScale = 1) {
  const spec = ROCKER_KEYS[key];
  if (!spec) return;
  if (!c.powered) {
    setLabStatus("Power is OFF.");
    return;
  }
  if (["ACCEL", "RUN", "DECEL"].includes(c.state)) return;
  c.focus = spec.focus;
  if (spec.mode) c.display_mode = spec.mode;
  nudge(spec.dir, stepScale);
}

// Hold-to-accelerate for rockers (HTML + 3D)
let holdKeyId = null;
let holdStartMs = 0;
let holdDelayTimer = null;
let holdRepeatTimer = null;

function holdStepScale(elapsedMs, focus) {
  // Temp: small steps only (degrees). Speed/time: ramp hard.
  if (focus === "TEMP") {
    if (elapsedMs > 1600) return 2;
    return 1;
  }
  if (elapsedMs > 2200) return 10;
  if (elapsedMs > 1100) return 4;
  return 1;
}

function startRockerHold(key) {
  stopRockerHold();
  holdKeyId = key;
  holdStartMs = performance.now();
  flashKey(key);
  playKeyClick(keyClickKind(key));
  applyRocker(key, 1);
  // delay before auto-repeat so a tap stays one step
  holdDelayTimer = setTimeout(() => {
    holdRepeatTimer = setInterval(() => {
      if (!holdKeyId) return;
      const focus = ROCKER_KEYS[holdKeyId]?.focus;
      const scale = holdStepScale(performance.now() - holdStartMs, focus);
      applyRocker(holdKeyId, scale);
      flashKey(holdKeyId);
      drawLcd(snap());
      if (lcdTexture) lcdTexture.needsUpdate = true;
    }, 85);
  }, 320);
}

function stopRockerHold() {
  if (holdDelayTimer) {
    clearTimeout(holdDelayTimer);
    holdDelayTimer = null;
  }
  if (holdRepeatTimer) {
    clearInterval(holdRepeatTimer);
    holdRepeatTimer = null;
  }
  holdKeyId = null;
}

function applySeparation() {
  if (c._sep_done) return;
  if (c.error && c._spin_s < 5) {
    c._sep_done = true;
    return;
  }
  const changed = [];
  for (const tid of c.lab.rotor) {
    if (!tid) continue;
    const tube = c.lab.tubes[tid];
    const m = matOf(tube);
    if (m.fill <= 0) continue;
    tube.peak_rcf = Math.max(tube.peak_rcf, c._peak_rcf);
    tube.spun_time_s += c._spin_s;
    const ok =
      c._peak_rcf >= m.min_rcf * 0.8 &&
      c._spin_s >= m.min_time_s * 0.8 &&
      c._peak_rpm >= m.min_rpm * 0.8;
    if (ok && !tube.separated) {
      tube.separated = true;
      changed.push(tid);
    }
  }
  c.last_separation_changes = changed;
  c._sep_done = true;
  if (changed.length) {
    logSep(`Separated ${changed.length} tube(s): ${changed.join(", ")} @ ${Math.round(c._peak_rcf)}×g`);
  } else {
    logSep(`Run end — no new separation (peak ${Math.round(c._peak_rcf)}×g, ${c._spin_s.toFixed(0)}s)`);
  }
  renderGrids();
  refresh3DTubes();
}

/** Advance the program timer; returns true if time expired → should decelerate. */
function advanceRunTimer(dt) {
  // short = hold-to-spin; no fixed program time
  if (c.short_held) return false;
  // 0:00 set = continuous until stop (common instrument convention)
  if (c.time_set_s <= 0) return false;
  c.time_elapsed_s += dt;
  return c.time_elapsed_s >= c.time_set_s;
}

function tick(dt) {
  if (dt <= 0) return;
  dt *= c.demo_scale;

  if (!c.lid_open) c.temp_actual_c += (c.temp_set_c - c.temp_actual_c) * Math.min(1, dt / 25);
  else c.temp_actual_c += (22 - c.temp_actual_c) * Math.min(1, dt / 50);

  if (c.state === "ACCEL") {
    c.rpm_actual = Math.min(c.rpm_set, c.rpm_actual + (c.rpm_set / ACCEL_S) * dt);
    c._peak_rpm = Math.max(c._peak_rpm, c.rpm_actual);
    c._peak_rcf = Math.max(c._peak_rcf, rpmToRcf(c.rpm_actual));
    // Timer runs from the moment START is pressed (not only after full speed)
    if (advanceRunTimer(dt)) {
      c.state = "DECEL";
    } else if (c.rpm_actual >= c.rpm_set - 0.5) {
      c.rpm_actual = c.rpm_set;
      c.state = "RUN";
    }
  } else if (c.state === "RUN") {
    c.rpm_actual = c.rpm_set;
    c._peak_rpm = Math.max(c._peak_rpm, c.rpm_actual);
    c._peak_rcf = Math.max(c._peak_rcf, rpmToRcf(c.rpm_actual));
    c._spin_s += dt;
    if (advanceRunTimer(dt)) c.state = "DECEL";
  } else if (c.state === "DECEL") {
    c.rpm_actual = Math.max(0, c.rpm_actual - (Math.max(c.rpm_set, 1) / DECEL_S) * dt);
    if (c.rpm_actual <= 0.5) {
      c.rpm_actual = 0;
      // Keep time-warp while continuous demo is looping
      if (!demoLoop.active) c.demo_scale = 1;
      applySeparation();
      if (c.error === "E-02 IMBALANCE") {
        c.state = "ERR_IMBALANCE";
        playFault();
      } else if (c.error && String(c.error).includes("TACHO")) {
        c.state = "ERR_TACHO";
        playFault();
      } else {
        c.state = "END";
        playRunEnd();
        if (c.auto_open_on_end) {
          c.lid_locked = false;
          openLidPhysical();
          playLidThud();
        } else c.state = "READY";
      }
    }
  }
}

function snap() {
  const running = ["ACCEL", "RUN", "DECEL"].includes(c.state);
  const remaining =
    c.time_set_s <= 0
      ? 0
      : Math.max(0, c.time_set_s - c.time_elapsed_s);
  return {
    state: c.state,
    rpm_set: c.rpm_set,
    rpm_actual: c.rpm_actual,
    rcf_actual: rpmToRcf(c.rpm_actual),
    rcf_set: rpmToRcf(c.rpm_set),
    time_set_s: c.time_set_s,
    time_elapsed_s: c.time_elapsed_s,
    time_remaining_s: remaining,
    time_running: running && !c.short_held && c.time_set_s > 0,
    short_held: c.short_held,
    temp_set_c: c.temp_set_c,
    temp_actual_c: c.temp_actual_c,
    lid_open: c.lid_open,
    lid_locked: c.lid_locked,
    display_mode: c.display_mode,
    focus: c.focus,
    error: c.error,
    led_run: running,
    led_fault: String(c.state).startsWith("ERR_") || !!c.error,
    rotor_count: c.lab.rotor.filter(Boolean).length,
  };
}

// ---------------------------------------------------------------------------
// Lab ops
// ---------------------------------------------------------------------------
function setLabStatus(msg) {
  const el = document.getElementById("lab-status");
  if (el) el.textContent = msg;
}

/** Push fluid/tube state into the 3D scene */
function refresh3DTubes() {
  if (!centrifugeModel) return;
  syncLabTubes(centrifugeModel, c.lab, matOf, layersOf);
}

function logSep(line) {
  const el = document.getElementById("sep-log");
  if (!el) return;
  el.textContent = `[${new Date().toLocaleTimeString()}] ${line}\n` + el.textContent;
}

function firstFree(arr) {
  for (let i = 0; i < arr.length; i++) if (!arr[i]) return i;
  return null;
}

function unloadRotor(slot) {
  if (!canAccessTubes()) {
    setLabStatus("Open lid and stop rotor first.");
    return;
  }
  const tid = c.lab.rotor[slot];
  if (!tid) return;
  const rs = firstFree(c.lab.rack);
  if (rs === null) {
    setLabStatus("Rack full.");
    return;
  }
  c.lab.rotor[slot] = null;
  c.lab.rack[rs] = tid;
  c.lab.tubes[tid].location = "RACK";
  c.lab.tubes[tid].slot = rs;
  c.selected_tube_id = tid;
  setLabStatus(`${tid} → rack ${rs}`);
  renderGrids();
  refresh3DTubes();
}

function loadRack(rackSlot, rotorSlot = null) {
  if (!canAccessTubes()) {
    setLabStatus("Open lid and stop rotor first.");
    return;
  }
  const tid = c.lab.rack[rackSlot];
  if (!tid) return;
  if (rotorSlot === null) rotorSlot = firstFree(c.lab.rotor);
  if (rotorSlot === null) {
    setLabStatus("Rotor full.");
    return;
  }
  if (c.lab.rotor[rotorSlot]) {
    setLabStatus(`Rotor ${rotorSlot} occupied.`);
    return;
  }
  const matId = document.getElementById("material-select").value;
  if (c.lab.tubes[tid].material_id === "empty" && matId) {
    c.lab.tubes[tid].material_id = matId;
    c.lab.tubes[tid].separated = false;
  }
  c.lab.rack[rackSlot] = null;
  c.lab.rotor[rotorSlot] = tid;
  c.lab.tubes[tid].location = "ROTOR";
  c.lab.tubes[tid].slot = rotorSlot;
  c.selected_tube_id = tid;
  setLabStatus(`${tid} → rotor ${rotorSlot} (${matOf(c.lab.tubes[tid]).label})`);
  renderGrids();
  refresh3DTubes();
}

function loadBalancedPair() {
  if (!canAccessTubes()) {
    setLabStatus("Open lid first.");
    return;
  }
  const matId = document.getElementById("material-select").value || "whole_blood";
  const free = c.lab.rotor.map((t, i) => (!t ? i : null)).filter((x) => x !== null);
  if (free.length < 2) {
    setLabStatus("Need 2 free rotor slots.");
    return;
  }
  let a = free[0];
  let b = (a + 12) % 24;
  if (c.lab.rotor[b]) b = free[1];

  function takeRack() {
    for (let i = 0; i < RACK_N; i++) {
      const tid = c.lab.rack[i];
      if (tid && c.lab.tubes[tid].material_id === "empty") return i;
    }
    for (let i = 0; i < RACK_N; i++) if (c.lab.rack[i]) return i;
    return null;
  }

  for (const slot of [a, b]) {
    const rs = takeRack();
    if (rs === null) {
      setLabStatus("No rack tubes.");
      return;
    }
    const tid = c.lab.rack[rs];
    c.lab.rack[rs] = null;
    c.lab.rotor[slot] = tid;
    Object.assign(c.lab.tubes[tid], {
      location: "ROTOR",
      slot,
      material_id: matId,
      separated: false,
      peak_rcf: 0,
      spun_time_s: 0,
    });
  }
  setLabStatus(`Balanced pair (${MATERIALS[matId].label}) in slots ${a} & ${b}`);
  renderGrids();
  refresh3DTubes();
}

// ---------------------------------------------------------------------------
// Continuous demo: full load → run → unload loops across sample types
// ---------------------------------------------------------------------------
const DEMO_MATERIALS = [
  "whole_blood",
  "blood_serum_clot",
  "bacterial_culture",
  "plasmid_miniprep",
  "soil_slurry",
  "ink_suspension",
  "oil_water",
  "pcr_mix",
  "water_buffer",
];

const demoLoop = {
  active: false,
  phase: "idle",
  matIndex: 0,
  cycle: 0,
  waitUntil: 0,
  /** wall-clock time scale for runs while looping */
  timeScale: 10,
};

function demoMaterialId() {
  return DEMO_MATERIALS[demoLoop.matIndex % DEMO_MATERIALS.length];
}

function setDemoLoopUi() {
  const btn = document.getElementById("btn-demo-loop");
  const st = document.getElementById("demo-loop-status");
  if (btn) {
    btn.classList.toggle("active", demoLoop.active);
    btn.textContent = demoLoop.active ? "Stop continuous demo" : "Continuous demo";
  }
  if (st) {
    st.hidden = !demoLoop.active;
    if (demoLoop.active) {
      const mat = MATERIALS[demoMaterialId()];
      st.textContent = `Demo cycle ${demoLoop.cycle + 1} · ${mat?.label || "…"} · ${demoLoop.phase}`;
    }
  }
}

function unloadAllRotorQuiet() {
  for (let i = 0; i < ROTOR_N; i++) {
    if (c.lab.rotor[i]) unloadRotor(i);
  }
}

/** Load up to `pairs` opposite-slot pairs of one material from the rack. */
function loadDemoPairs(matId, pairs = 2) {
  const mat = MATERIALS[matId] || MATERIALS.whole_blood;
  const sel = document.getElementById("material-select");
  if (sel) sel.value = matId;
  if (typeof updateMatDesc === "function") updateMatDesc();

  let loaded = 0;
  for (let p = 0; p < pairs; p++) {
    const free = c.lab.rotor.map((t, i) => (!t ? i : null)).filter((x) => x !== null);
    if (free.length < 2) break;
    let a = free[0];
    let b = (a + 12) % 24;
    if (c.lab.rotor[b]) {
      const alt = free.find((i) => i !== a && !c.lab.rotor[(i + 12) % 24]);
      if (alt == null) break;
      a = alt;
      b = (a + 12) % 24;
    }
    for (const slot of [a, b]) {
      let rs = null;
      for (let i = 0; i < RACK_N; i++) {
        const tid = c.lab.rack[i];
        if (!tid) continue;
        if (c.lab.tubes[tid].material_id === "empty" || c.lab.tubes[tid].location === "RACK") {
          rs = i;
          break;
        }
      }
      if (rs === null) {
        setLabStatus("Demo: rack empty — cannot load more.");
        return loaded;
      }
      const tid = c.lab.rack[rs];
      c.lab.rack[rs] = null;
      c.lab.rotor[slot] = tid;
      Object.assign(c.lab.tubes[tid], {
        location: "ROTOR",
        slot,
        material_id: matId,
        separated: false,
        peak_rcf: 0,
        spun_time_s: 0,
      });
      loaded++;
    }
  }
  setLabStatus(`Demo load: ${loaded} × ${mat.label}`);
  renderGrids();
  refresh3DTubes();
  return loaded;
}

function configureDemoRun(matId) {
  const mat = MATERIALS[matId] || MATERIALS.whole_blood;
  // Meet separation thresholds with a little headroom; keep runs short via time-warp
  c.rpm_set = Math.min(15000, Math.max(mat.min_rpm + 500, 6000));
  c.time_set_s = Math.max(mat.min_time_s + 15, 45);
  c.time_elapsed_s = 0;
  c.temp_set_c = 4;
  c.demo_scale = demoLoop.timeScale;
  c.error = null;
  c.focus = "RPM";
  c.display_mode = "RPM";
}

function startDemoLoop() {
  if (!c.powered) togglePower();
  demoLoop.active = true;
  demoLoop.phase = "prep";
  demoLoop.waitUntil = 0;
  demoLoop.matIndex = 0;
  c.demo_scale = demoLoop.timeScale;
  c.auto_open_on_end = true;
  // Clear faults / stop any run
  if (["ACCEL", "RUN"].includes(c.state)) {
    c.state = "DECEL";
    c.short_held = false;
  }
  // Keep / refresh auto-rotate so demos can showcase the instrument
  if (orbitControls) {
    if (autoRotateOn) orbitControls.autoRotate = !tubeStory.active;
    applyOrbitSpeed();
  }
  setDemoLoopUi();
  setLabStatus("Continuous demo ON — full runs, rotating samples. Use Auto-rotate + Orbit speed.");
  logSep("Continuous demo started");
}

function stopDemoLoop(reason = "Continuous demo stopped.") {
  if (!demoLoop.active && demoLoop.phase === "idle") return;
  demoLoop.active = false;
  demoLoop.phase = "idle";
  demoLoop.waitUntil = 0;
  c.demo_scale = tubeStory.active ? c.demo_scale : 1;
  if (["ACCEL", "RUN"].includes(c.state)) {
    c.state = "DECEL";
    c.short_held = false;
  }
  if (orbitControls) {
    orbitControls.autoRotate = autoRotateOn && !tubeStory.active;
    applyOrbitSpeed();
  }
  setDemoLoopUi();
  setLabStatus(reason);
  logSep(reason);
}

function toggleDemoLoop() {
  if (demoLoop.active) stopDemoLoop();
  else startDemoLoop();
}

// ---------------------------------------------------------------------------
// Keypad light demo — press sequence on HTML + 3D keys
// ---------------------------------------------------------------------------
const KEYPAD_DEMO_SEQ = [
  "speed-up",
  "speed-down",
  "time-up",
  "time-down",
  "temp-up",
  "temp-down",
  "rpmrcf",
  "short",
  "open",
  "fast-temp",
  "start",
];

function demoPressKey(keyId, ms = 380) {
  if (!centrifugeModel) return;
  setKeyPressLit(centrifugeModel, keyId, true);
  const el = document.querySelector(`[data-key="${keyId}"]`);
  el?.classList.add("is-down", "demo-lit");
  playKeyClick(keyClickKind(keyId));
  setTimeout(() => {
    setKeyPressLit(centrifugeModel, keyId, false);
    el?.classList.remove("is-down", "demo-lit");
  }, ms);
}

/** Run a visual tour of the keypad (does not always fire real actions). */
function runKeypadLightTour(onDone) {
  let i = 0;
  const step = () => {
    if (i >= KEYPAD_DEMO_SEQ.length) {
      onDone?.();
      return;
    }
    const id = KEYPAD_DEMO_SEQ[i++];
    // Glow first, then press
    if (centrifugeModel) setKeyGlow(centrifugeModel, id, { color: 0x00e8ff, pulse: false });
    setTimeout(() => {
      demoPressKey(id, 420);
      setTimeout(() => {
        if (centrifugeModel) setKeyGlow(centrifugeModel, id, false);
        setTimeout(step, 120);
      }, 450);
    }, 200);
  };
  step();
}

// ---------------------------------------------------------------------------
// Full showcase — run cycle ↔ part highlight ↔ keypad lights
// ---------------------------------------------------------------------------
const showcase = {
  active: false,
  phase: "idle",
  waitUntil: 0,
  partIndex: 0,
  cycle: 0,
  /** curated highlight list when catalog is huge */
  highlightIds: [
    "body",
    "console",
    "lcd",
    "rotor",
    "lid",
    "drive",
    "motor",
    "main_pcb",
    "psu",
    "fan",
    "compressor",
    "badge",
    "chamber",
    "rack",
    "cord",
  ],
};

function setShowcaseBanner(text, show = true) {
  const el = document.getElementById("showcase-banner");
  const t = document.getElementById("showcase-banner-text");
  if (el) el.hidden = !show;
  if (t && text != null) t.textContent = text;
  document.getElementById("btn-full-showcase")?.classList.toggle("active", showcase.active);
  document.getElementById("btn-full-showcase-panel")?.classList.toggle("active", showcase.active);
}

function showcasePartsList() {
  const cat = centrifugeModel?.partCatalog || [];
  const byId = new Map(cat.map((p) => [p.id, p]));
  const ordered = [];
  for (const id of showcase.highlightIds) {
    // match exact or auto_Name
    let hit = byId.get(id);
    if (!hit) hit = cat.find((p) => p.id === `auto_${id}` || p.id.endsWith(id) || p.label.toLowerCase().includes(id.replace(/_/g, " ")));
    if (hit) ordered.push(hit);
  }
  // fill with more assemblies / drive parts if list short
  if (ordered.length < 8) {
    for (const p of cat) {
      if (!ordered.includes(p) && (p.group === "Assemblies" || p.group === "Drive / electronics")) {
        ordered.push(p);
      }
      if (ordered.length >= 16) break;
    }
  }
  return ordered.length ? ordered : cat.slice(0, 12);
}

function startFullShowcase() {
  if (tubeStory.active) stopTubeStory("Tube story stopped for full showcase.");
  if (demoLoop.active) stopDemoLoop("Continuous demo stopped for full showcase.");
  if (!c.powered) togglePower();
  showcase.active = true;
  showcase.phase = "keypad";
  showcase.waitUntil = 0;
  showcase.partIndex = 0;
  showcase.cycle = 0;
  c.demo_scale = 12;
  c.auto_open_on_end = true;
  startMusic().catch(() => {});
  setMusicVolume(0.14);
  setAutoRotateGlobal(true);
  setShowcaseBanner("FULL SHOWCASE · keypad tour", true);
  setLabStatus("Full showcase: keypad lights → run → part zoom → repeat");
  logSep("Full showcase started");
}

function stopFullShowcase(reason = "Full showcase stopped.") {
  if (!showcase.active && showcase.phase === "idle") return;
  showcase.active = false;
  showcase.phase = "idle";
  showcase.waitUntil = 0;
  c.demo_scale = 1;
  if (centrifugeModel) {
    clearKeyGlows(centrifugeModel);
    setExplorerFocus(centrifugeModel, null);
  }
  setShowcaseBanner("", false);
  setLabStatus(reason);
  logSep(reason);
}

function toggleFullShowcase() {
  if (showcase.active) stopFullShowcase();
  else startFullShowcase();
}

/** Module-level auto-rotate helper (init3D also has local setAutoRotate) */
function setAutoRotateGlobal(on) {
  autoRotateOn = !!on;
  if (orbitControls) {
    orbitControls.autoRotate = autoRotateOn && !tubeStory.active;
    applyOrbitSpeed();
  }
  document.getElementById("btn-auto-rotate")?.classList.toggle("active", autoRotateOn);
}

function focusPartEntry(entry, { autoRotate = true } = {}) {
  if (!entry?.object || !centrifugeModel || !viewCamera || !orbitControls) return;
  wireframeOn = false;
  document.getElementById("btn-wireframe")?.classList.remove("active");
  explorerPartId = entry.id;
  setExplorerFocus(centrifugeModel, entry.object);
  const box = new THREE.Box3().setFromObject(entry.object);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  box.getCenter(center);
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z, 0.2);
  const dist = Math.max(1.2, maxDim * 2.4);
  orbitControls.target.copy(center);
  viewCamera.position.set(center.x + dist * 0.7, center.y + dist * 0.45, center.z + dist * 0.7);
  orbitControls.minDistance = Math.max(0.3, maxDim * 0.3);
  orbitControls.update();
  if (autoRotate) setAutoRotateGlobal(true);
  document.querySelectorAll(".part-btn").forEach((el) => {
    el.classList.toggle("active", el.dataset.partId === entry.id);
  });
  const st = document.getElementById("parts-focus-status");
  if (st) st.textContent = `Focused: ${entry.label}`;
  // Mild explode so internals read during showcase
  explodeTarget = entry.group?.includes("Drive") || entry.id === "drive" || /motor|pcb|fan|comp/i.test(entry.id) ? 0.85 : 0.35;
}

function clearPartFocusCamera() {
  if (centrifugeModel) setExplorerFocus(centrifugeModel, null);
  explorerPartId = null;
  document.querySelectorAll(".part-btn.active").forEach((el) => el.classList.remove("active"));
  const st = document.getElementById("parts-focus-status");
  if (st) st.textContent = "No part focused";
  explodeTarget = 0;
  if (viewCamera && orbitControls) {
    viewCamera.position.set(4.0, 4.35, -5.2);
    orbitControls.target.set(-0.25, 2.15, -0.1);
    orbitControls.minDistance = 2.2;
    orbitControls.update();
  }
}

/**
 * Showcase state machine: keypad → run cycle → part focus → next…
 */
function tickShowcase(now) {
  if (!showcase.active) return;
  if (now < showcase.waitUntil) return;

  switch (showcase.phase) {
    case "keypad": {
      setShowcaseBanner(`SHOWCASE · keypad demo · cycle ${showcase.cycle + 1}`);
      showcase.phase = "keypad_wait";
      showcase.waitUntil = now + 12000; // safety max
      runKeypadLightTour(() => {
        if (!showcase.active) return;
        showcase.phase = "run_prep";
        showcase.waitUntil = performance.now() + 400;
      });
      break;
    }
    case "keypad_wait":
      // Safety: if tour callback never fired, continue
      showcase.phase = "run_prep";
      showcase.waitUntil = now + 200;
      break;
    case "run_prep": {
      clearPartFocusCamera();
      setShowcaseBanner(`SHOWCASE · sample run · ${demoMaterialId()}`);
      // Reuse continuous demo one cycle by driving demoLoop phases lightly
      if (!c.powered) togglePower();
      c.demo_scale = 12;
      // open + unload + load + run via demoLoop machinery
      demoLoop.active = true;
      demoLoop.phase = "prep";
      demoLoop.waitUntil = 0;
      // hijack: when demo finishes show, jump to part
      showcase.phase = "run_watch";
      showcase.waitUntil = now + 200;
      setDemoLoopUi();
      break;
    }
    case "run_watch": {
      // When demoLoop hits show/next, take over for part highlight
      if (!demoLoop.active) {
        showcase.phase = "part";
        showcase.waitUntil = now + 300;
        break;
      }
      if (demoLoop.phase === "show" || demoLoop.phase === "next") {
        // freeze demo loop before it advances forever
        demoLoop.active = false;
        demoLoop.phase = "idle";
        setDemoLoopUi();
        showcase.phase = "part";
        showcase.waitUntil = now + 600;
      }
      break;
    }
    case "part": {
      const parts = showcasePartsList();
      const entry = parts[showcase.partIndex % parts.length];
      showcase.partIndex = (showcase.partIndex + 1) % Math.max(1, parts.length);
      if (entry) {
        focusPartEntry(entry);
        setShowcaseBanner(`SHOWCASE · part · ${entry.label}`);
        setLabStatus(`Highlighting: ${entry.label}`);
        // flash related keys if console
        if (/console|lcd|control/i.test(entry.label + entry.id)) {
          runKeypadLightTour(() => {});
        }
      }
      showcase.phase = "part_hold";
      showcase.waitUntil = now + 5500;
      break;
    }
    case "part_hold": {
      clearPartFocusCamera();
      showcase.cycle += 1;
      // Alternate: every other cycle do keypad again
      showcase.phase = showcase.cycle % 3 === 0 ? "keypad" : "run_prep";
      showcase.waitUntil = now + 500;
      setShowcaseBanner(`SHOWCASE · next cycle ${showcase.cycle + 1}`);
      break;
    }
    default:
      showcase.phase = "keypad";
  }
}

// ---------------------------------------------------------------------------
// Auto-orbit speed (shared by toolbar slider + part explorer + demos)
// ---------------------------------------------------------------------------
/** User multiplier for OrbitControls.autoRotateSpeed (default ~1.1) */
let orbitSpeedUser = 1.1;

function applyOrbitSpeed() {
  if (!orbitControls) return;
  // Base feel: 1.0 on the slider ≈ classic OrbitControls ~1.1
  const base = 1.1 * orbitSpeedUser;
  // Slightly gentler while continuous demo runs (unless user cranked speed up)
  orbitControls.autoRotateSpeed = demoLoop.active ? Math.max(0.35, base * 0.7) : base;
}

// ---------------------------------------------------------------------------
// Tube story — cinematic follow: fill → load → spin → separate → teach layers
// ---------------------------------------------------------------------------
const tubeStory = {
  active: false,
  phase: "idle",
  waitUntil: 0,
  matId: "whole_blood",
  tubeId: null,
  partnerId: null,
  rotorSlot: null,
  partnerSlot: null,
  rackSlot: null,
  layerIdx: -1,
  follow: false,
  progress: 0,
};

function storyMat() {
  return MATERIALS[tubeStory.matId] || MATERIALS.whole_blood;
}

function setStoryUi({ title, body, kicker, layersHtml, progress, show }) {
  const card = document.getElementById("tube-story-card");
  if (!card) return;
  if (show != null) card.hidden = !show;
  const k = document.getElementById("tube-story-kicker");
  const t = document.getElementById("tube-story-title");
  const b = document.getElementById("tube-story-body");
  const L = document.getElementById("tube-story-layers");
  const bar = document.getElementById("tube-story-bar");
  if (k && kicker != null) k.textContent = kicker;
  if (t && title != null) t.textContent = title;
  if (b && body != null) b.textContent = body;
  if (L && layersHtml != null) L.innerHTML = layersHtml;
  if (bar && progress != null) bar.style.width = `${Math.round(progress * 100)}%`;
  const btn = document.getElementById("btn-tube-story");
  btn?.classList.toggle("active", tubeStory.active);
}

function renderStoryLayers(activeKey = null) {
  const st = storyMat().story;
  if (!st?.layers) return "";
  return st.layers
    .map((layer) => {
      const on = activeKey && layer.key === activeKey ? " active" : "";
      return `<div class="tube-story-layer${on}">
        <div class="tube-story-swatch" style="background:${layerColor(layer.key)}"></div>
        <div><strong>${layer.title}</strong><span>${layer.what}<br/><em>Then:</em> ${layer.next}</span></div>
      </div>`;
    })
    .join("");
}

function layerColor(key) {
  const after = storyMat().after || [];
  const hit = after.find((l) => l.name === key);
  return hit?.color || "#888";
}

function findTubeMesh() {
  if (!centrifugeModel || !tubeStory.tubeId) return null;
  const tube = c.lab.tubes[tubeStory.tubeId];
  if (!tube) return null;
  if (tube.location === "ROTOR" && tube.slot != null) {
    return centrifugeModel.rotorSlots[tube.slot]?.tubeGroup || null;
  }
  if (tube.location === "RACK" && tube.slot != null) {
    return centrifugeModel.rackSlots[tube.slot]?.tubeGroup || null;
  }
  return null;
}

function followTubeCamera(camera, controls, dt) {
  if (!tubeStory.follow || !tubeStory.active) return;
  const mesh = findTubeMesh();
  if (!mesh || !camera || !controls) return;
  const world = new THREE.Vector3();
  mesh.getWorldPosition(world);
  // Orbit gently around the tube while staying close
  const t = performance.now() * 0.001;
  const radius = tubeStory.phase === "spinning" || tubeStory.phase === "accel" ? 0.85 : 0.48;
  const elev = tubeStory.phase === "spinning" || tubeStory.phase === "accel" ? 0.55 : 0.22;
  const ang = t * (0.55 + orbitSpeedUser * 0.35);
  const ideal = new THREE.Vector3(
    world.x + Math.cos(ang) * radius,
    world.y + elev,
    world.z + Math.sin(ang) * radius
  );
  const lerp = Math.min(1, dt * 3.2);
  camera.position.lerp(ideal, lerp);
  controls.target.lerp(world, lerp);
  controls.autoRotate = false; // story owns the orbit path
}

function startTubeStory(matId = "whole_blood") {
  if (demoLoop.active) stopDemoLoop("Continuous demo stopped for tube story.");
  if (!c.powered) togglePower();
  // Prefer blood story; fall back if missing
  if (!MATERIALS[matId]?.story) matId = "whole_blood";
  tubeStory.active = true;
  tubeStory.phase = "prep";
  tubeStory.waitUntil = 0;
  tubeStory.matId = matId;
  tubeStory.tubeId = null;
  tubeStory.partnerId = null;
  tubeStory.rotorSlot = null;
  tubeStory.partnerSlot = null;
  tubeStory.rackSlot = null;
  tubeStory.layerIdx = -1;
  tubeStory.follow = true;
  tubeStory.progress = 0;
  c.demo_scale = 12;
  c.auto_open_on_end = true;
  if (["ACCEL", "RUN"].includes(c.state)) {
    c.state = "DECEL";
    c.short_held = false;
  }
  const st = storyMat().story;
  setStoryUi({
    show: true,
    kicker: "TUBE STORY · LIVE LAB",
    title: st.hook,
    body: st.why,
    layersHtml: "",
    progress: 0.05,
  });
  setLabStatus("Tube story: following one sample through separation.");
  logSep(`Tube story started (${storyMat().label})`);
}

function stopTubeStory(reason = "Tube story stopped.") {
  if (!tubeStory.active && tubeStory.phase === "idle") return;
  tubeStory.active = false;
  tubeStory.phase = "idle";
  tubeStory.follow = false;
  tubeStory.waitUntil = 0;
  c.demo_scale = demoLoop.active ? demoLoop.timeScale : 1;
  setStoryUi({ show: false, progress: 0 });
  document.getElementById("btn-tube-story")?.classList.remove("active");
  if (orbitControls) {
    orbitControls.autoRotate = autoRotateOn;
    applyOrbitSpeed();
  }
  setLabStatus(reason);
  logSep(reason);
}

function toggleTubeStory() {
  if (tubeStory.active) stopTubeStory();
  else startTubeStory(document.getElementById("material-select")?.value || "whole_blood");
}

/**
 * Drive tube story phases (wall clock `now`). Camera follow runs in the rAF loop.
 */
function tickTubeStory(now) {
  if (!tubeStory.active) return;
  if (now < tubeStory.waitUntil) return;

  const mat = storyMat();
  const st = mat.story;
  const sel = document.getElementById("material-select");

  switch (tubeStory.phase) {
    case "prep": {
      if (c.rpm_actual > 0.5 || ["ACCEL", "RUN", "DECEL"].includes(c.state)) {
        if (["ACCEL", "RUN"].includes(c.state)) c.state = "DECEL";
        tubeStory.waitUntil = now + 200;
        break;
      }
      if (!c.lid_open) {
        c.lid_locked = false;
        openLidPhysical();
        tubeStory.waitUntil = now + 800;
        break;
      }
      // Clear rotor
      for (let i = 0; i < ROTOR_N; i++) if (c.lab.rotor[i]) unloadRotor(i);
      tubeStory.phase = "fill";
      tubeStory.progress = 0.12;
      setStoryUi({
        title: `Fill: ${mat.label}`,
        body: st.fill,
        layersHtml: "",
        progress: tubeStory.progress,
      });
      tubeStory.waitUntil = now + 900;
      break;
    }
    case "fill": {
      // Pick two empty rack tubes → balanced pair
      let rs = null;
      let rs2 = null;
      for (let i = 0; i < RACK_N; i++) {
        const tid = c.lab.rack[i];
        if (!tid) continue;
        if (rs === null) rs = i;
        else if (rs2 === null) {
          rs2 = i;
          break;
        }
      }
      if (rs === null || rs2 === null) {
        setStoryUi({ title: "Need free rack tubes", body: "Unload the rotor/rack and try again." });
        stopTubeStory("Tube story needs free rack tubes.");
        break;
      }
      const tid = c.lab.rack[rs];
      const tid2 = c.lab.rack[rs2];
      tubeStory.tubeId = tid;
      tubeStory.partnerId = tid2;
      tubeStory.rackSlot = rs;
      if (sel) sel.value = mat.id;
      for (const id of [tid, tid2]) {
        Object.assign(c.lab.tubes[id], {
          material_id: mat.id,
          separated: false,
          peak_rcf: 0,
          spun_time_s: 0,
        });
      }
      c.selected_tube_id = tid;
      renderGrids();
      refresh3DTubes();
      drawTubePreview(c.lab.tubes[tid]);
      tubeStory.phase = "load";
      tubeStory.progress = 0.22;
      setStoryUi({
        title: "Load the rotor",
        body: "Balanced pair — opposite slots so the spinning mass stays smooth. Camera locks onto your tube.",
        progress: tubeStory.progress,
      });
      tubeStory.waitUntil = now + 700;
      break;
    }
    case "load": {
      if (!canAccessTubes()) {
        tubeStory.waitUntil = now + 300;
        break;
      }
      // Opposite slots
      const free = c.lab.rotor.map((t, i) => (!t ? i : null)).filter((x) => x !== null);
      let a = free[0] ?? 0;
      let b = (a + 12) % 24;
      if (c.lab.rotor[b]) b = free.find((i) => i !== a) ?? b;
      // Move primary + partner from rack → opposite rotor slots
      let rs = null;
      let rs2 = null;
      for (let i = 0; i < RACK_N; i++) {
        if (c.lab.rack[i] === tubeStory.tubeId) rs = i;
        if (c.lab.rack[i] === tubeStory.partnerId) rs2 = i;
      }
      if (rs != null) {
        c.lab.rack[rs] = null;
        c.lab.rotor[a] = tubeStory.tubeId;
        Object.assign(c.lab.tubes[tubeStory.tubeId], { location: "ROTOR", slot: a });
        tubeStory.rotorSlot = a;
      }
      if (rs2 != null && tubeStory.partnerId) {
        c.lab.rack[rs2] = null;
        c.lab.rotor[b] = tubeStory.partnerId;
        Object.assign(c.lab.tubes[tubeStory.partnerId], { location: "ROTOR", slot: b });
        tubeStory.partnerSlot = b;
      }
      renderGrids();
      refresh3DTubes();
      tubeStory.phase = "close";
      tubeStory.progress = 0.32;
      setStoryUi({
        title: "Seal the chamber",
        body: "Lid down, interlock on. No open-lid spins — that's how we keep fingers (and samples) safe.",
        progress: tubeStory.progress,
      });
      tubeStory.waitUntil = now + 600;
      break;
    }
    case "close": {
      if (c.lid_open) closeLid();
      tubeStory.phase = "start";
      tubeStory.waitUntil = now + 500;
      break;
    }
    case "start": {
      if (c.lid_open) {
        closeLid();
        tubeStory.waitUntil = now + 400;
        break;
      }
      c.rpm_set = Math.min(15000, Math.max(mat.min_rpm + 1500, 10000));
      c.time_set_s = Math.max(mat.min_time_s, 75);
      c.time_elapsed_s = 0;
      c.demo_scale = 14;
      c.error = null;
      if (c.state === "LID_OPEN" && !c.lid_open) c.state = "READY";
      pressStartStop();
      tubeStory.phase = "spinning";
      tubeStory.progress = 0.45;
      setStoryUi({
        title: `Spinning @ ${c.rpm_set.toLocaleString()} rpm`,
        body: st.spin,
        progress: tubeStory.progress,
        layersHtml: "",
      });
      break;
    }
    case "spinning": {
      tubeStory.progress = 0.45 + 0.25 * Math.min(1, c.time_elapsed_s / Math.max(1, c.time_set_s));
      setStoryUi({ progress: tubeStory.progress });
      const done =
        c.rpm_actual < 0.5 &&
        !["ACCEL", "RUN", "DECEL"].includes(c.state) &&
        (c.state === "END" || c.state === "LID_OPEN" || c.state === "READY");
      if (!done) break;
      // Ensure separation flags for story tube
      const tube = c.lab.tubes[tubeStory.tubeId];
      if (tube && !tube.separated) {
        tube.separated = true;
        tube.peak_rcf = Math.max(tube.peak_rcf || 0, c._peak_rcf || rpmToRcf(c.rpm_set));
      }
      if (tubeStory.partnerId && c.lab.tubes[tubeStory.partnerId]) {
        c.lab.tubes[tubeStory.partnerId].separated = true;
      }
      refresh3DTubes();
      renderGrids();
      drawTubePreview(c.lab.tubes[tubeStory.tubeId]);
      tubeStory.phase = "unload";
      tubeStory.progress = 0.72;
      setStoryUi({
        title: "Separated!",
        body: "Rotor stopped. Lid opens. Your tube now holds stacked layers — density did the sorting.",
        progress: tubeStory.progress,
        layersHtml: renderStoryLayers(),
      });
      tubeStory.waitUntil = now + 900;
      break;
    }
    case "unload": {
      if (c.rpm_actual > 0.5) {
        tubeStory.waitUntil = now + 200;
        break;
      }
      if (!c.lid_open) {
        c.lid_locked = false;
        openLidPhysical();
        tubeStory.waitUntil = now + 700;
        break;
      }
      if (tubeStory.rotorSlot != null && c.lab.rotor[tubeStory.rotorSlot]) {
        unloadRotor(tubeStory.rotorSlot);
      }
      if (tubeStory.partnerSlot != null && c.lab.rotor[tubeStory.partnerSlot]) {
        unloadRotor(tubeStory.partnerSlot);
      }
      c.selected_tube_id = tubeStory.tubeId;
      drawTubePreview(c.lab.tubes[tubeStory.tubeId]);
      tubeStory.phase = "layers";
      tubeStory.layerIdx = 0;
      tubeStory.progress = 0.8;
      tubeStory.waitUntil = now + 400;
      break;
    }
    case "layers": {
      const layers = st.layers || [];
      const idx = tubeStory.layerIdx;
      if (idx >= layers.length) {
        tubeStory.phase = "outro";
        break;
      }
      const layer = layers[idx];
      tubeStory.progress = 0.8 + (0.15 * (idx + 1)) / Math.max(1, layers.length);
      setStoryUi({
        title: layer.title,
        body: `${layer.what} ${layer.next}`,
        layersHtml: renderStoryLayers(layer.key),
        progress: tubeStory.progress,
        kicker: `LAYER ${idx + 1} / ${layers.length} · WHY WE SEPARATE`,
      });
      tubeStory.layerIdx = idx + 1;
      tubeStory.waitUntil = now + 3400;
      if (tubeStory.layerIdx >= layers.length) tubeStory.phase = "outro";
      break;
    }
    case "outro": {
      setStoryUi({
        kicker: "WHAT SCIENTISTS DO NEXT",
        title: "Pipette. Label. Assay.",
        body: st.after,
        layersHtml: renderStoryLayers(),
        progress: 1,
      });
      tubeStory.phase = "hold";
      tubeStory.waitUntil = now + 5000;
      break;
    }
    case "hold": {
      // Stay on the final card until user stops or restarts
      tubeStory.follow = true;
      tubeStory.waitUntil = now + 10000;
      break;
    }
    default:
      tubeStory.phase = "prep";
  }
}

/**
 * Advance continuous demo state machine (wall-clock `now` from rAF).
 * Phases: prep → unload → load → close → start → running → show → next
 */
function tickDemoLoop(now) {
  if (!demoLoop.active) return;
  if (now < demoLoop.waitUntil) {
    setDemoLoopUi();
    return;
  }

  const matId = demoMaterialId();
  const mat = MATERIALS[matId];

  switch (demoLoop.phase) {
    case "prep": {
      if (!c.powered) togglePower();
      // Wait for rotor stopped before handling tubes
      if (c.rpm_actual > 0.5 || ["ACCEL", "RUN", "DECEL"].includes(c.state)) {
        if (["ACCEL", "RUN"].includes(c.state)) {
          c.state = "DECEL";
          c.short_held = false;
        }
        demoLoop.waitUntil = now + 200;
        break;
      }
      if (!c.lid_open) {
        c.lid_locked = false;
        openLidPhysical();
        demoLoop.waitUntil = now + 900;
      }
      demoLoop.phase = "unload";
      break;
    }
    case "unload": {
      if (!canAccessTubes()) {
        if (!c.lid_open) {
          c.lid_locked = false;
          openLidPhysical();
        }
        demoLoop.waitUntil = now + 400;
        break;
      }
      unloadAllRotorQuiet();
      // Remix tubes so next load looks unseparated
      for (const t of Object.values(c.lab.tubes)) {
        if (t.location === "RACK") {
          t.separated = false;
          t.peak_rcf = 0;
          t.spun_time_s = 0;
        }
      }
      renderGrids();
      refresh3DTubes();
      demoLoop.phase = "load";
      demoLoop.waitUntil = now + 500;
      break;
    }
    case "load": {
      if (!canAccessTubes()) {
        demoLoop.waitUntil = now + 300;
        break;
      }
      configureDemoRun(matId);
      const n = loadDemoPairs(matId, 2);
      if (n < 2) {
        // Recycle: force empty-ish tubes if rack stuck
        for (const t of Object.values(c.lab.tubes)) {
          if (t.location === "RACK") {
            t.material_id = "empty";
            t.separated = false;
          }
        }
        loadDemoPairs(matId, 2);
      }
      demoLoop.phase = "close";
      demoLoop.waitUntil = now + 700;
      break;
    }
    case "close": {
      if (c.lid_open) closeLid();
      demoLoop.phase = "start";
      demoLoop.waitUntil = now + 600;
      break;
    }
    case "start": {
      if (c.lid_open) {
        closeLid();
        demoLoop.waitUntil = now + 400;
        break;
      }
      if (!["READY", "END"].includes(c.state) && c.state !== "LID_OPEN") {
        // stuck in fault — clear soft faults when stopped
        if (c.rpm_actual < 0.5 && String(c.state).startsWith("ERR_")) {
          c.error = null;
          c.state = c.lid_open ? "LID_OPEN" : "READY";
        }
        demoLoop.waitUntil = now + 300;
        break;
      }
      configureDemoRun(matId);
      if (c.state === "LID_OPEN" && !c.lid_open) c.state = "READY";
      if (c.lid_open) closeLid();
      pressStartStop();
      if (c.state === "ACCEL" || c.state === "RUN") {
        demoLoop.phase = "running";
        setLabStatus(
          `Demo run ${demoLoop.cycle + 1}: ${mat.label} @ ${c.rpm_set} rpm × ${c.time_set_s}s (×${demoLoop.timeScale})`
        );
      } else {
        // imbalance / lid fault — try reload
        demoLoop.phase = "prep";
        demoLoop.waitUntil = now + 800;
      }
      break;
    }
    case "running": {
      // Hold until program ends and rotor is stopped (auto-open → LID_OPEN)
      const done =
        c.rpm_actual < 0.5 &&
        !["ACCEL", "RUN", "DECEL"].includes(c.state) &&
        (c.state === "END" || c.state === "LID_OPEN" || c.state === "READY" || String(c.state).startsWith("ERR_"));
      if (!done) break;
      if (String(c.state).startsWith("ERR_")) {
        c.error = null;
        if (c.rpm_actual < 0.5) {
          c.lid_locked = false;
          openLidPhysical();
        }
      }
      demoLoop.phase = "show";
      demoLoop.waitUntil = now + 2200; // let students see separation in tubes
      setLabStatus(`Demo: ${mat.label} finished — showing separation…`);
      break;
    }
    case "show": {
      // Full showcase consumes one run then jumps to part highlight
      if (showcase.active) {
        demoLoop.active = false;
        demoLoop.phase = "idle";
        setDemoLoopUi();
        break;
      }
      demoLoop.phase = "next";
      break;
    }
    case "next": {
      demoLoop.matIndex = (demoLoop.matIndex + 1) % DEMO_MATERIALS.length;
      if (demoLoop.matIndex === 0) demoLoop.cycle += 1;
      demoLoop.phase = "prep";
      demoLoop.waitUntil = now + 400;
      setLabStatus(`Demo next: ${MATERIALS[demoMaterialId()].label}`);
      break;
    }
    default:
      demoLoop.phase = "prep";
  }
  setDemoLoopUi();
}

// ---------------------------------------------------------------------------
// LCD
// ---------------------------------------------------------------------------
function drawLcd(s) {
  const canvas = document.getElementById("lcd");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  if (!c.powered) {
    ctx.fillStyle = "#020508";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#334";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText("POWER OFF", 40, h / 2);
    return;
  }

  const fault = s.led_fault;
  const cyan = "#00d4e8";
  const green = "#3dd68c";
  const amber = "#f0b429";
  const red = "#f04460";
  const muted = "#8b9bb0";

  ctx.fillStyle = "#050c16";
  ctx.fillRect(0, 0, w, h);

  // grid
  ctx.strokeStyle = "#0a1928";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  ctx.strokeStyle = cyan;
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  ctx.fillStyle = "rgba(0,212,232,0.12)";
  ctx.fillRect(16, 16, w - 32, 48);
  ctx.fillStyle = cyan;
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("MICRO 5424-R  ·  FA-45-24-11  ·  REFRIGERATED", 36, 50);

  // speed
  ctx.fillStyle = "#0a1423";
  ctx.fillRect(36, 84, 460, 180);
  ctx.strokeStyle = fault ? red : cyan;
  ctx.strokeRect(36, 84, 460, 180);
  ctx.fillStyle = muted;
  ctx.font = "18px sans-serif";
  ctx.fillText(s.display_mode === "RCF" ? "RCF  (toggle rpm/rcf)" : "SPEED  (toggle rpm/rcf)", 52, 112);
  ctx.fillStyle = cyan;
  ctx.font = "bold 56px monospace";
  if (s.display_mode === "RCF") {
    ctx.fillText(`${Math.round(s.rcf_actual).toLocaleString()} ×g`, 52, 180);
    ctx.fillStyle = green;
    ctx.font = "22px sans-serif";
    ctx.fillText(`set ${Math.round(s.rcf_set).toLocaleString()} ×g  ·  ${Math.round(s.rpm_actual).toLocaleString()} rpm`, 52, 230);
  } else {
    ctx.fillText(`${Math.round(s.rpm_actual).toLocaleString()} rpm`, 52, 180);
    ctx.fillStyle = green;
    ctx.font = "22px sans-serif";
    ctx.fillText(`set ${s.rpm_set.toLocaleString()}  ·  ${Math.round(s.rcf_actual).toLocaleString()} ×g`, 52, 230);
  }

  // time — big digits count DOWN while running; show set value when idle
  ctx.fillStyle = "#0a1423";
  ctx.fillRect(520, 84, 468, 180);
  const timeFocus = s.focus === "TIME";
  ctx.strokeStyle = timeFocus ? "#ffd060" : amber;
  ctx.lineWidth = timeFocus ? 4 : 3;
  ctx.strokeRect(520, 84, 468, 180);
  ctx.fillStyle = muted;
  ctx.font = "18px sans-serif";
  let timeTitle = "TIME  set";
  let timeBig = s.time_set_s;
  let timeSub = "▲▼ adjust · starts counting on START";
  if (s.short_held) {
    timeTitle = "TIME  short (hold)";
    timeBig = s.time_elapsed_s;
    timeSub = "release short to stop";
  } else if (s.time_running) {
    timeTitle = "TIME  remaining";
    timeBig = s.time_remaining_s;
    timeSub = `set ${fmtTime(s.time_set_s)}  ·  elapsed ${fmtTime(s.time_elapsed_s)}`;
  } else if (s.time_set_s <= 0) {
    timeTitle = "TIME  continuous";
    timeBig = 0;
    timeSub = "0:00 = run until STOP";
  } else if (s.state === "END" || s.time_elapsed_s > 0) {
    timeSub = `last run ${fmtTime(s.time_elapsed_s)} / ${fmtTime(s.time_set_s)}`;
  }
  ctx.fillText(timeTitle, 540, 112);
  ctx.fillStyle = amber;
  ctx.font = "bold 56px monospace";
  ctx.fillText(fmtTime(timeBig), 540, 180);
  ctx.fillStyle = "#ccc";
  ctx.font = "20px sans-serif";
  ctx.fillText(timeSub, 540, 230);

  // status / temp
  ctx.fillStyle = "#0a1423";
  ctx.fillRect(36, 284, 952, 180);
  ctx.strokeStyle = fault ? red : green;
  ctx.strokeRect(36, 284, 952, 180);
  ctx.fillStyle = muted;
  ctx.font = "18px sans-serif";
  ctx.fillText("TEMP / STATUS", 52, 318);
  ctx.fillStyle = green;
  ctx.font = "bold 48px monospace";
  const ts = s.temp_set_c >= 0 ? `+${s.temp_set_c.toFixed(1)}` : s.temp_set_c.toFixed(1);
  ctx.fillText(`${ts} °C`, 52, 380);
  ctx.fillStyle = "#ddd";
  ctx.font = "22px sans-serif";
  ctx.fillText(`act ${s.temp_actual_c >= 0 ? "+" : ""}${s.temp_actual_c.toFixed(1)} °C`, 320, 375);
  const st = s.error || s.state;
  ctx.fillStyle = fault ? red : cyan;
  ctx.font = "bold 24px sans-serif";
  ctx.fillText(
    `${st}   ·   lid ${s.lid_open ? "OPEN" : s.lid_locked ? "LOCKED" : "CLOSED"}   ·   tubes ${s.rotor_count}/24`,
    52,
    430
  );

  const frac =
    s.time_set_s > 0 && (s.time_running || s.state === "END" || s.time_elapsed_s > 0)
      ? Math.min(1, s.time_elapsed_s / s.time_set_s)
      : 0;
  ctx.fillStyle = "#142030";
  ctx.fillRect(520, 400, 440, 22);
  ctx.fillStyle = s.time_running ? amber : cyan;
  ctx.fillRect(520, 400, 440 * frac, 22);
  if (s.time_running) {
    ctx.fillStyle = muted;
    ctx.font = "14px sans-serif";
    ctx.fillText("run progress", 520, 395);
  }
}

// ---------------------------------------------------------------------------
// Tube grids
// ---------------------------------------------------------------------------
function drawTubeIcon(ctx, x, y, w, h, tube) {
  ctx.fillStyle = "rgba(180,200,220,0.2)";
  ctx.strokeStyle = "#6a7a8a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y + 8, w, h - 8, 3);
  ctx.fill();
  ctx.stroke();
  if (!tube) {
    ctx.fillStyle = "#3a4555";
    ctx.font = "10px sans-serif";
    ctx.fillText("·", x + w / 2 - 2, y + h / 2);
    return;
  }
  ctx.fillStyle = tube.cap_color;
  ctx.beginPath();
  ctx.roundRect(x + 2, y, w - 4, 10, 2);
  ctx.fill();
  const m = matOf(tube);
  const layers = layersOf(tube);
  const fillH = (h - 18) * m.fill;
  let yCursor = y + h - 4;
  for (const layer of layers) {
    const lh = fillH * layer.fraction;
    yCursor -= lh;
    ctx.fillStyle = layer.color;
    ctx.fillRect(x + 3, yCursor, w - 6, lh + 0.5);
  }
  if (tube.separated) {
    ctx.strokeStyle = "#3dd68c";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
  }
}

function drawTubePreview(tube) {
  const canvas = document.getElementById("tube-preview");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = "#0a1018";
  ctx.fillRect(0, 0, w, h);
  if (!tube) {
    ctx.fillStyle = "#8b9bb0";
    ctx.font = "14px sans-serif";
    ctx.fillText("Select a tube", 60, 150);
    return;
  }
  const bodyX = 70;
  const bodyW = 90;
  const bodyY = 30;
  const bodyH = 220;
  ctx.fillStyle = "rgba(180,200,220,0.12)";
  ctx.strokeStyle = "#8899aa";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(bodyX, bodyY + 18, bodyW, bodyH - 18, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = tube.cap_color;
  ctx.beginPath();
  ctx.roundRect(bodyX + 12, bodyY, bodyW - 24, 24, 5);
  ctx.fill();
  const m = matOf(tube);
  const layers = layersOf(tube);
  const liquidTop = bodyY + 36;
  const liquidH = (bodyH - 28) * m.fill;
  let y = liquidTop + liquidH;
  for (const layer of layers) {
    const lh = liquidH * layer.fraction;
    y -= lh;
    ctx.fillStyle = layer.color;
    ctx.fillRect(bodyX + 6, y, bodyW - 12, lh + 0.5);
  }
  ctx.fillStyle = "#e6edf5";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(tube.tube_id, 16, 20);
  ctx.fillStyle = "#8b9bb0";
  ctx.font = "12px sans-serif";
  ctx.fillText(m.label, 16, h - 36);
  ctx.fillText(tube.separated ? "SEPARATED" : "MIXED", 16, h - 18);
  let ly = 50;
  for (const layer of [...layers].reverse()) {
    ctx.fillStyle = layer.color;
    ctx.fillRect(175, ly, 12, 12);
    ctx.fillStyle = "#c0cad6";
    ctx.font = "10px sans-serif";
    ctx.fillText(layer.name, 192, ly + 10);
    ly += 18;
  }
}

function renderGrids() {
  const rotorEl = document.getElementById("rotor-grid");
  const rackEl = document.getElementById("rack-grid");
  if (!rotorEl || !rackEl) return;
  rotorEl.innerHTML = "";
  rackEl.innerHTML = "";

  for (let i = 0; i < ROTOR_N; i++) {
    const tid = c.lab.rotor[i];
    const tube = tid ? c.lab.tubes[tid] : null;
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "tube-cell" + (c.selected_tube_id && tid === c.selected_tube_id ? " selected" : "");
    const canvas = document.createElement("canvas");
    canvas.width = 40;
    canvas.height = 52;
    drawTubeIcon(canvas.getContext("2d"), 3, 2, 34, 48, tube);
    cell.appendChild(canvas);
    const lab = document.createElement("span");
    lab.textContent = String(i);
    cell.appendChild(lab);
    cell.addEventListener("click", () => {
      if (tube) {
        c.selected_tube_id = tid;
        unloadRotor(i);
      } else {
        c.selected_rotor_slot = i;
        setLabStatus(`Rotor ${i} selected — click a rack well to load.`);
      }
      renderGrids();
    });
    rotorEl.appendChild(cell);
  }

  for (let i = 0; i < RACK_N; i++) {
    const tid = c.lab.rack[i];
    const tube = tid ? c.lab.tubes[tid] : null;
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "tube-cell" + (c.selected_tube_id && tid === c.selected_tube_id ? " selected" : "");
    const canvas = document.createElement("canvas");
    canvas.width = 40;
    canvas.height = 52;
    drawTubeIcon(canvas.getContext("2d"), 3, 2, 34, 48, tube);
    cell.appendChild(canvas);
    const lab = document.createElement("span");
    lab.textContent = String(i);
    cell.appendChild(lab);
    cell.addEventListener("click", () => {
      if (!tube) {
        setLabStatus(`Rack ${i} empty.`);
        return;
      }
      c.selected_tube_id = tid;
      const matId = document.getElementById("material-select").value;
      if (tube.material_id === "empty" && matId) {
        tube.material_id = matId;
        tube.separated = false;
      }
      loadRack(i, c.selected_rotor_slot);
      c.selected_rotor_slot = null;
      renderGrids();
    });
    rackEl.appendChild(cell);
  }

  const sel = c.selected_tube_id ? c.lab.tubes[c.selected_tube_id] : null;
  drawTubePreview(sel);
  const lbl = document.getElementById("tube-preview-label");
  if (lbl) {
    lbl.textContent = sel
      ? `${sel.tube_id}: ${matOf(sel).label} — ${sel.separated ? "separated" : "mixed"}`
      : "Select a tube";
  }
  refresh3DTubes();
}

// ---------------------------------------------------------------------------
// Status bar + key flash
// ---------------------------------------------------------------------------
function updateChrome(s) {
  const pill = document.getElementById("status-pill");
  const detail = document.getElementById("status-detail");
  if (!pill) return;
  pill.className = "pill";
  if (!c.powered) {
    pill.textContent = "POWER OFF";
    pill.classList.add("fault");
  } else if (s.led_fault) {
    pill.textContent = s.error || s.state;
    pill.classList.add("fault");
  } else if (s.led_run) {
    pill.textContent = s.state;
    pill.classList.add("run");
  } else if (s.lid_open) {
    pill.textContent = "LID OPEN";
    pill.classList.add("open");
  } else {
    pill.textContent = s.state;
  }
  if (detail) {
    if (!c.powered) detail.textContent = "Press POWER to turn on";
    else if (s.lid_open) detail.textContent = "Grab lid to close · or Close lid · then start/stop";
    else if (s.led_run) {
      if (s.short_held) detail.textContent = `${Math.round(s.rpm_actual).toLocaleString()} rpm · short (hold)`;
      else if (s.time_set_s <= 0)
        detail.textContent = `${Math.round(s.rpm_actual).toLocaleString()} rpm · continuous (stop to end)`;
      else
        detail.textContent = `${Math.round(s.rpm_actual).toLocaleString()} rpm · ${fmtTime(s.time_remaining_s)} left · set ${fmtTime(s.time_set_s)}`;
    } else detail.textContent = "Set speed / time / temp · grab lid to open when stopped";
  }
}

function flashKey(key) {
  const btn = document.querySelector(`[data-key="${key}"]`);
  if (!btn) return;
  btn.classList.add("is-down");
  setTimeout(() => btn.classList.remove("is-down"), 120);
}

/** Press glow for click-style keys (HTML). 3D uses pointer down/up. */
function tapPressGlow(keyId) {
  if (!centrifugeModel || !keyId) return;
  if (isRockerKey(keyId) || keyId === "short") return;
  setKeyPressLit(centrifugeModel, keyId, true);
  setTimeout(() => {
    if (centrifugeModel) setKeyPressLit(centrifugeModel, keyId, false);
  }, 150);
}

// ---------------------------------------------------------------------------
// Wire controls
// ---------------------------------------------------------------------------
function handleKey(key) {
  // Rockers use startRockerHold for press+hold; handleKey is for single-shot keys
  if (isRockerKey(key)) {
    flashKey(key);
    playKeyClick(keyClickKind(key));
    applyRocker(key, 1);
    renderGrids();
    return;
  }
  flashKey(key);
  playKeyClick(keyClickKind(key));
  switch (key) {
    case "power":
      togglePower();
      break;
    case "start":
      pressStartStop();
      break;
    case "open":
      pressOpen();
      break;
    case "rpmrcf":
      c.display_mode = c.display_mode === "RPM" ? "RCF" : "RPM";
      c.focus = "RPM";
      break;
    case "fast-temp":
      if (!c.lid_open && ["READY", "END"].includes(c.state)) {
        // Precool-style run at moderate speed (refrigerated unit)
        c.rpm_set = Math.min(c.rpm_set, 5000);
        pressStartStop();
        setLabStatus("Fast cool run started (moderate speed until stop).");
      } else setLabStatus("Close lid for fast cool.");
      break;
    case "close-lid":
      closeLid();
      break;
    case "imbalance":
      if (["ACCEL", "RUN"].includes(c.state)) {
        c.state = "DECEL";
        c.error = "E-02 IMBALANCE";
      } else setLabStatus("Imbalance only during a run.");
      break;
    default:
      break;
  }
  renderGrids();
}

document.querySelectorAll("[data-key]").forEach((btn) => {
  const key = btn.dataset.key;
  if (key === "short") {
    const down = (e) => {
      e.preventDefault();
      btn.classList.add("is-down");
      playKeyClick("normal");
      if (centrifugeModel) setKeyPressLit(centrifugeModel, "short", true);
      shortDown();
    };
    const up = (e) => {
      e.preventDefault();
      btn.classList.remove("is-down");
      if (centrifugeModel) setKeyPressLit(centrifugeModel, "short", false);
      shortUp();
    };
    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointerleave", up);
    btn.addEventListener("pointercancel", up);
    return;
  }
  if (isRockerKey(key)) {
    const down = (e) => {
      e.preventDefault();
      btn.classList.add("is-down");
      if (centrifugeModel) setKeyPressLit(centrifugeModel, key, true);
      startRockerHold(key); // includes click sfx
    };
    const up = (e) => {
      e.preventDefault();
      btn.classList.remove("is-down");
      if (centrifugeModel) setKeyPressLit(centrifugeModel, key, false);
      stopRockerHold();
    };
    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointerleave", up);
    btn.addEventListener("pointercancel", up);
    // prevent click double-fire after pointerup
    btn.addEventListener("click", (e) => e.preventDefault());
    return;
  }
  btn.addEventListener("click", () => {
    tapPressGlow(key);
    handleKey(key);
  });
});

// Keyboard shortcuts — rockers also hold-accelerate while key is down
const heldKb = new Set();
window.addEventListener("keydown", (e) => {
  if (e.target.matches("input, select, textarea")) return;
  const map = {
    " ": "start",
    Enter: "start",
    o: "open",
    O: "open",
    c: "close-lid",
    C: "close-lid",
    r: "rpmrcf",
    R: "rpmrcf",
    ArrowUp: "speed-up",
    ArrowDown: "speed-down",
    ArrowLeft: "time-down",
    ArrowRight: "time-up",
    "[": "temp-down",
    "]": "temp-up",
  };
  if (e.key === "s" || e.key === "S") {
    e.preventDefault();
    if (!heldKb.has("short")) {
      heldKb.add("short");
      shortDown();
    }
    return;
  }
  const k = map[e.key];
  if (!k) return;
  e.preventDefault();
  if (isRockerKey(k)) {
    if (heldKb.has(k)) return;
    heldKb.add(k);
    startRockerHold(k);
    return;
  }
  handleKey(k);
});
window.addEventListener("keyup", (e) => {
  if (e.key === "s" || e.key === "S") {
    heldKb.delete("short");
    shortUp();
    return;
  }
  const map = {
    ArrowUp: "speed-up",
    ArrowDown: "speed-down",
    ArrowLeft: "time-down",
    ArrowRight: "time-up",
    "[": "temp-down",
    "]": "temp-up",
  };
  const k = map[e.key];
  if (k && isRockerKey(k)) {
    heldKb.delete(k);
    stopRockerHold();
  }
});

document.getElementById("btn-load-pair")?.addEventListener("click", loadBalancedPair);
document.getElementById("btn-unload-all")?.addEventListener("click", () => {
  if (!canAccessTubes()) {
    setLabStatus("Open lid first.");
    return;
  }
  let n = 0;
  for (let i = 0; i < ROTOR_N; i++) if (c.lab.rotor[i]) {
    unloadRotor(i);
    n++;
  }
  setLabStatus(`Unloaded ${n} tube(s).`);
  renderGrids();
});
document.getElementById("btn-remix")?.addEventListener("click", () => {
  if (!canAccessTubes()) {
    setLabStatus("Open lid to remix.");
    return;
  }
  const tid = c.selected_tube_id;
  if (!tid) {
    setLabStatus("Select a tube.");
    return;
  }
  Object.assign(c.lab.tubes[tid], { separated: false, peak_rcf: 0, spun_time_s: 0 });
  setLabStatus(`Remixed ${tid}.`);
  renderGrids();
});
document.getElementById("btn-demo-spin")?.addEventListener("click", () => {
  if (demoLoop.active) stopDemoLoop("Stopped for single quick demo.");
  c.time_set_s = 90;
  c.rpm_set = 12000;
  c.demo_scale = 6;
  if (c.lid_open) closeLid();
  if (c.state === "READY" || c.state === "END" || c.state === "LID_OPEN") {
    if (c.lid_open) closeLid();
    pressStartStop();
  }
  setLabStatus("Demo run @ 12k rpm × 90s (time ×6).");
  renderGrids();
});

document.getElementById("btn-demo-loop")?.addEventListener("click", () => {
  toggleDemoLoop();
});

// Material select
const matSelect = document.getElementById("material-select");
const matDesc = document.getElementById("material-desc");
for (const m of Object.values(MATERIALS)) {
  if (m.id === "empty") continue;
  const opt = document.createElement("option");
  opt.value = m.id;
  opt.textContent = m.label;
  matSelect.appendChild(opt);
}
matSelect.value = "whole_blood";
function updateMatDesc() {
  const m = MATERIALS[matSelect.value];
  matDesc.textContent = m
    ? `${m.description} · needs ≥${m.min_rpm} rpm, ≥${m.min_rcf}×g, ≥${m.min_time_s}s`
    : "";
}
matSelect.addEventListener("change", () => {
  updateMatDesc();
  if (c.selected_tube_id && canAccessTubes()) {
    const t = c.lab.tubes[c.selected_tube_id];
    t.material_id = matSelect.value;
    t.separated = false;
    setLabStatus(`${t.tube_id} → ${MATERIALS[matSelect.value].label}`);
    renderGrids();
  }
});
updateMatDesc();

// ---------------------------------------------------------------------------
// Three.js — procedural product model (always looks like a centrifuge)
// ---------------------------------------------------------------------------
let rotorSpin = null;
let lidHinge = null;
let lcdTexture = null;
let modelButtons = null;
let ledRunMesh = null;
let ledFaultMesh = null;
let centrifugeModel = null;
let explodeAmt = 0;
let explodeTarget = 0;
let wireframeOn = false;
let autoRotateOn = false;
let explorerPartId = null;
let orbitControls = null;
let viewCamera = null;

function init3D() {
  const host = document.getElementById("viewport3d");
  const status = document.getElementById("viewport-status");
  if (!host) return;

  const w = host.clientWidth || 640;
  const h = host.clientHeight || 480;
  const scene = new THREE.Scene();
  // Interior lab: cool walls, fog softens far walls in the taller room
  scene.background = new THREE.Color(0xd0d8e0);
  scene.fog = new THREE.Fog(0xd0d8e0, 32, 70);

  const camera = new THREE.PerspectiveCamera(38, w / h, 0.05, 140);
  // Front of machine is −Z. Frame instrument on raised black-top bench.
  // (NOT from +Z, which is the back / power-cord side).
  const CAM0 = { x: 4.0, y: 4.35, z: -5.2 };
  const TGT0 = { x: -0.25, y: 2.15, z: -0.1 };
  camera.position.set(CAM0.x, CAM0.y, CAM0.z);
  viewCamera = camera;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  host.innerHTML = "";
  host.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(TGT0.x, TGT0.y, TGT0.z);
  controls.enableDamping = true;
  controls.minDistance = 2.2;
  controls.maxDistance = 40;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 1.1;
  controls.update();
  orbitControls = controls;

  const ambientL = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientL);
  const keyL = new THREE.DirectionalLight(0xfff8f0, 0.95);
  keyL.position.set(2, 16, -5); // key light from front-above
  keyL.castShadow = true;
  scene.add(keyL);
  const fill = new THREE.DirectionalLight(0xe8f0ff, 0.45);
  fill.position.set(-10, 8, 3);
  scene.add(fill);
  const hemiL = new THREE.HemisphereLight(0xeef4ff, 0x8a9098, 0.5);
  scene.add(hemiL);
  // Overhead lab fluorescent (tall room)
  const top = new THREE.DirectionalLight(0xf0f6ff, 0.65);
  top.position.set(0, 18, 0);
  scene.add(top);
  const top2 = new THREE.PointLight(0xddeeff, 0.55, 40, 2);
  top2.position.set(0, 8.5, 0);
  scene.add(top2);

  /** Live lighting: base intensities + mood multipliers, driven by toolbar */
  const labLights = {
    ambient: ambientL,
    key: keyL,
    fill,
    hemi: hemiL,
    top,
    top2,
    base: {
      ambient: 0.45,
      key: 0.95,
      fill: 0.45,
      hemi: 0.5,
      top: 0.65,
      top2: 0.55,
    },
    brightness: 1,
    mood: "neutral",
  };

  const LIGHT_MOODS = {
    neutral: {
      mult: { ambient: 1, key: 1, fill: 1, hemi: 1, top: 1, top2: 1 },
      keyColor: 0xfff8f0,
      fillColor: 0xe8f0ff,
      hemiSky: 0xeef4ff,
      hemiGround: 0x8a9098,
      topColor: 0xf0f6ff,
      top2Color: 0xddeeff,
      bg: 0xd0d8e0,
      fog: 0xd0d8e0,
    },
    bright: {
      mult: { ambient: 1.25, key: 1.35, fill: 1.2, hemi: 1.15, top: 1.4, top2: 1.3 },
      keyColor: 0xfffaf5,
      fillColor: 0xf0f6ff,
      hemiSky: 0xffffff,
      hemiGround: 0x9aa2aa,
      topColor: 0xffffff,
      top2Color: 0xeef4ff,
      bg: 0xd8e0e8,
      fog: 0xd8e0e8,
    },
    dim: {
      mult: { ambient: 0.55, key: 0.55, fill: 0.5, hemi: 0.45, top: 0.5, top2: 0.45 },
      keyColor: 0xe8e0d4,
      fillColor: 0xb0bcc8,
      hemiSky: 0xc8d0d8,
      hemiGround: 0x4a5058,
      topColor: 0xd0d8e0,
      top2Color: 0xa8b4c0,
      bg: 0x9aa6b4,
      fog: 0x8a96a4,
    },
    cool: {
      mult: { ambient: 0.9, key: 0.85, fill: 1.15, hemi: 1.1, top: 1.05, top2: 1.2 },
      keyColor: 0xe0f0ff,
      fillColor: 0xc8e8ff,
      hemiSky: 0xd8eeff,
      hemiGround: 0x6a7888,
      topColor: 0xd0e8ff,
      top2Color: 0xb8dcff,
      bg: 0xc0d0e0,
      fog: 0xb0c0d0,
    },
    warm: {
      mult: { ambient: 1.05, key: 1.2, fill: 0.85, hemi: 0.9, top: 0.95, top2: 0.85 },
      keyColor: 0xffe8d0,
      fillColor: 0xffdcc0,
      hemiSky: 0xfff0e0,
      hemiGround: 0x8a7870,
      topColor: 0xfff0e8,
      top2Color: 0xffe0c8,
      bg: 0xd8d0c8,
      fog: 0xc8c0b8,
    },
  };

  function applyLabLighting() {
    const mood = LIGHT_MOODS[labLights.mood] || LIGHT_MOODS.neutral;
    const b = labLights.brightness;
    const m = mood.mult;
    const base = labLights.base;
    labLights.ambient.intensity = base.ambient * m.ambient * b;
    labLights.key.intensity = base.key * m.key * b;
    labLights.fill.intensity = base.fill * m.fill * b;
    labLights.hemi.intensity = base.hemi * m.hemi * b;
    labLights.top.intensity = base.top * m.top * b;
    labLights.top2.intensity = base.top2 * m.top2 * b;
    labLights.key.color.setHex(mood.keyColor);
    labLights.fill.color.setHex(mood.fillColor);
    labLights.hemi.color.setHex(mood.hemiSky);
    labLights.hemi.groundColor.setHex(mood.hemiGround);
    labLights.top.color.setHex(mood.topColor);
    labLights.top2.color.setHex(mood.top2Color);
    scene.background.setHex(mood.bg);
    if (scene.fog) scene.fog.color.setHex(mood.fog);
  }
  applyLabLighting();

  // Draw LCD once before creating texture (power on by default)
  c.powered = true;
  drawLcd(snap());

  const lcdCanvas = document.getElementById("lcd");
  lcdTexture = new THREE.CanvasTexture(lcdCanvas);
  lcdTexture.colorSpace = THREE.SRGBColorSpace;
  lcdTexture.flipY = true;
  lcdTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  lcdTexture.minFilter = THREE.LinearFilter;
  lcdTexture.magFilter = THREE.LinearFilter;
  lcdTexture.generateMipmaps = false;
  lcdTexture.needsUpdate = true;

  const model = createCentrifugeModel(lcdTexture);
  centrifugeModel = model;
  // LCD mesh uses multi-material; map is on lcdMat (front face)
  if (model.lcdMat) {
    model.lcdMat.map = lcdTexture;
    model.lcdMat.needsUpdate = true;
  }
  scene.add(model.root);
  rotorSpin = model.rotor;
  lidHinge = model.lid;
  modelButtons = model.buttons;
  ledRunMesh = model.ledRun;
  ledFaultMesh = model.ledFault;
  setKeysPoweredBacklight(model, c.powered);

  // Public API for tutors / AI agents (highlight which keys to press, SFX, state)
  exposeCentrifugeTwinApi(model);

  // View mode buttons
  const btnExplode = document.getElementById("btn-explode");
  const btnWire = document.getElementById("btn-wireframe");
  const btnAutoRotate = document.getElementById("btn-auto-rotate");
  const btnReset = document.getElementById("btn-view-reset");

  function setAutoRotate(on) {
    autoRotateOn = !!on;
    // Tube story drives its own orbit path
    controls.autoRotate = autoRotateOn && !tubeStory.active;
    applyOrbitSpeed();
    btnAutoRotate?.classList.toggle("active", autoRotateOn);
  }

  // Orbit speed slider
  const orbitSpeedEl = document.getElementById("orbit-speed");
  const orbitSpeedVal = document.getElementById("orbit-speed-val");
  if (orbitSpeedEl) {
    orbitSpeedUser = parseFloat(orbitSpeedEl.value) || 1.1;
    const syncOrbitLabel = () => {
      if (orbitSpeedVal) orbitSpeedVal.textContent = `${orbitSpeedUser.toFixed(1)}×`;
    };
    syncOrbitLabel();
    applyOrbitSpeed();
    orbitSpeedEl.addEventListener("input", () => {
      orbitSpeedUser = parseFloat(orbitSpeedEl.value) || 1.1;
      syncOrbitLabel();
      applyOrbitSpeed();
      if (!autoRotateOn && !tubeStory.active) setAutoRotate(true);
    });
  }

  // Zoom slider — maps 0–100% to maxDistance…minDistance (higher % = closer)
  const zoomEl = document.getElementById("camera-zoom");
  const zoomVal = document.getElementById("camera-zoom-val");
  let zoomSliderActive = false;

  function cameraDistance() {
    return camera.position.distanceTo(controls.target);
  }

  function setCameraDistance(dist) {
    const d = Math.min(controls.maxDistance, Math.max(controls.minDistance, dist));
    const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
    if (offset.lengthSq() < 1e-8) offset.set(0, 0.35, -1);
    offset.setLength(d);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  }

  function distToZoomPct(dist) {
    const lo = controls.minDistance;
    const hi = controls.maxDistance;
    if (hi <= lo) return 50;
    return Math.round(((hi - dist) / (hi - lo)) * 100);
  }

  function zoomPctToDist(pct) {
    const lo = controls.minDistance;
    const hi = controls.maxDistance;
    const t = Math.min(100, Math.max(0, pct)) / 100;
    return hi - t * (hi - lo);
  }

  function syncZoomSliderFromCamera() {
    if (!zoomEl || zoomSliderActive) return;
    const pct = distToZoomPct(cameraDistance());
    zoomEl.value = String(pct);
    if (zoomVal) zoomVal.textContent = `${pct}%`;
  }

  if (zoomEl) {
    const applyZoomFromSlider = () => {
      const pct = parseFloat(zoomEl.value) || 0;
      if (zoomVal) zoomVal.textContent = `${Math.round(pct)}%`;
      setCameraDistance(zoomPctToDist(pct));
    };
    // Match slider to default framing (do not jump camera on load)
    syncZoomSliderFromCamera();
    zoomEl.addEventListener("pointerdown", () => {
      zoomSliderActive = true;
    });
    zoomEl.addEventListener("pointerup", () => {
      zoomSliderActive = false;
      syncZoomSliderFromCamera();
    });
    zoomEl.addEventListener("pointercancel", () => {
      zoomSliderActive = false;
    });
    zoomEl.addEventListener("input", applyZoomFromSlider);
  }
  controls.addEventListener("change", () => syncZoomSliderFromCamera());

  // Lab lighting controls
  const lightEl = document.getElementById("lab-light");
  const lightVal = document.getElementById("lab-light-val");
  const moodEl = document.getElementById("lab-light-mood");
  if (lightEl) {
    const syncLightLabel = () => {
      if (lightVal) lightVal.textContent = `${labLights.brightness.toFixed(1)}×`;
    };
    lightEl.addEventListener("input", () => {
      labLights.brightness = parseFloat(lightEl.value) || 1;
      syncLightLabel();
      applyLabLighting();
    });
    syncLightLabel();
  }
  if (moodEl) {
    moodEl.addEventListener("change", () => {
      labLights.mood = moodEl.value || "neutral";
      applyLabLighting();
      if (status) {
        const labels = { neutral: "Neutral", bright: "Bright", dim: "Dim", cool: "Cool", warm: "Warm" };
        status.textContent = `Lighting · ${labels[labLights.mood] || labLights.mood} · ${labLights.brightness.toFixed(1)}×`;
      }
    });
  }

  document.getElementById("btn-tube-story")?.addEventListener("click", () => toggleTubeStory());
  document.getElementById("btn-tube-story-stop")?.addEventListener("click", () => stopTubeStory());
  document.getElementById("btn-full-showcase")?.addEventListener("click", () => toggleFullShowcase());
  document.getElementById("btn-full-showcase-panel")?.addEventListener("click", () => toggleFullShowcase());
  document.getElementById("btn-music")?.addEventListener("click", async () => {
    const btn = document.getElementById("btn-music");
    if (btn) btn.textContent = "Loading…";
    try {
      const on = await toggleMusic();
      await new Promise((r) => setTimeout(r, 500));
      const mode = getMusicMode();
      btn?.classList.toggle("active", on);
      if (btn) btn.textContent = "Music";
      if (status) {
        status.textContent = on
          ? mode === "magenta"
            ? "Music on · Magenta ML (open Music chat to direct it)"
            : "Music on · generative score (open Music chat to direct it)"
          : "Music off";
      }
      syncMusicChatStatus();
    } catch (e) {
      console.warn(e);
      if (btn) btn.textContent = "Music";
      if (status) status.textContent = "Music failed to start";
    }
  });

  // ----- Music director chat -----
  const musicChatEl = document.getElementById("music-chat");
  const musicLog = document.getElementById("music-chat-log");
  const musicInput = document.getElementById("music-chat-input");
  const musicForm = document.getElementById("music-chat-form");
  const musicChips = document.getElementById("music-chat-chips");

  function syncMusicChatStatus() {
    const sub = document.getElementById("music-chat-status");
    if (!sub) return;
    try {
      const cfg = getMusicConfig();
      const inst = Object.entries(cfg.instruments)
        .filter(([, on]) => on)
        .map(([k]) => k)
        .join(", ");
      sub.textContent = cfg.on
        ? `${cfg.styleLabel} · ${cfg.bpm} BPM · ${cfg.mode} · ${inst}`
        : "Music off — say “play” or click Music";
    } catch {
      sub.textContent = "Music director";
    }
  }

  function appendMusicMsg(role, text) {
    if (!musicLog) return;
    const div = document.createElement("div");
    div.className = `music-chat-msg ${role}`;
    div.textContent = text;
    musicLog.appendChild(div);
    musicLog.scrollTop = musicLog.scrollHeight;
  }

  function openMusicChat() {
    if (!musicChatEl) return;
    musicChatEl.hidden = false;
    document.getElementById("btn-music-chat")?.classList.add("active");
    if (musicLog && musicLog.childElementCount === 0) {
      appendMusicMsg(
        "bot",
        "I’m the music director. Tell me a style or instruments.\nExamples: “make it jazz”, “add drums”, “remove bass”, “calmer”, “only pad and bells”."
      );
    }
    syncMusicChatStatus();
    musicInput?.focus();
  }

  function closeMusicChat() {
    if (musicChatEl) musicChatEl.hidden = true;
    document.getElementById("btn-music-chat")?.classList.remove("active");
  }

  // Suggestion chips
  if (musicChips) {
    const chips = [
      "make it jazz",
      "ambient",
      "electronic",
      "lo-fi",
      "add drums",
      "add strings",
      "remove bass",
      "calmer",
      "faster",
      "status",
      "help",
    ];
    for (const c of chips) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "music-chip";
      b.textContent = c;
      b.addEventListener("click", () => sendMusicChat(c));
      musicChips.appendChild(b);
    }
  }

  async function sendMusicChat(text) {
    const line = String(text || "").trim();
    if (!line) return;
    appendMusicMsg("user", line);
    if (musicInput) musicInput.value = "";
    // Ensure audio context is running
    if (!isMusicOn() && !/stop|mute|help|status|\?/i.test(line)) {
      try {
        await startMusic();
        document.getElementById("btn-music")?.classList.add("active");
      } catch {
        /* ignore */
      }
    }
    try {
      const { reply } = await applyMusicChat(line);
      appendMusicMsg("bot", reply);
      syncMusicChatStatus();
      const cfg = getMusicConfig();
      if (status && cfg.on) {
        status.textContent = `Music · ${cfg.styleLabel} · ${cfg.bpm} BPM`;
      }
    } catch (e) {
      appendMusicMsg("bot", `Something went wrong: ${e?.message || e}`);
    }
  }

  document.getElementById("btn-music-chat")?.addEventListener("click", () => {
    if (musicChatEl?.hidden === false) closeMusicChat();
    else openMusicChat();
  });
  // Capture phase so nothing else eats the close click; CSS also honors [hidden]
  document.getElementById("btn-music-chat-close")?.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMusicChat();
    },
    true
  );
  musicForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMusicChat(musicInput?.value || "");
  });

  // Collapsible right panels — only change panel width; stage flex-grows.
  // ResizeObserver (below) updates camera aspect so the centrifuge never skews.
  function resizeViewport() {
    if (!host || !camera || !renderer) return;
    const nw = Math.max(1, host.clientWidth || 1);
    const nh = Math.max(1, host.clientHeight || 1);
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    // updateStyle=false avoids fighting CSS; we size the drawing buffer only
    renderer.setSize(nw, nh, false);
    const canvas = renderer.domElement;
    canvas.style.width = `${nw}px`;
    canvas.style.height = `${nh}px`;
  }

  function setPanelCollapsed(name, collapsed) {
    const panel = document.querySelector(`[data-panel="${name}"]`);
    const btn = document.querySelector(`[data-collapse="${name}"]`);
    if (!panel) return;
    panel.classList.toggle("is-collapsed", collapsed);
    if (btn) {
      btn.textContent = collapsed ? "▸" : "▾";
      btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
      btn.title = collapsed ? "Expand panel" : "Collapse panel";
    }
    // After layout settles, fix WebGL buffer + aspect (no FOV/zoom change)
    requestAnimationFrame(() => {
      requestAnimationFrame(resizeViewport);
    });
  }
  document.querySelectorAll("[data-collapse]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-collapse");
      const panel = document.querySelector(`[data-panel="${name}"]`);
      const next = !panel?.classList.contains("is-collapsed");
      setPanelCollapsed(name, next);
    });
  });

  function clearPartExplorer() {
    explorerPartId = null;
    setExplorerFocus(model, null);
    if (wireframeOn) setWireframe(model, true);
    document.querySelectorAll(".part-btn.active").forEach((el) => el.classList.remove("active"));
    const st = document.getElementById("parts-focus-status");
    if (st) st.textContent = "No part focused";
  }

  function focusPart(entry) {
    if (!entry?.object) return;
    // Part explorer uses its own isolate mode (not global wireframe toggle)
    wireframeOn = false;
    btnWire?.classList.remove("active");
    explorerPartId = entry.id;
    setExplorerFocus(model, entry.object);

    // Bounding box → camera target + stand-off distance
    const box = new THREE.Box3().setFromObject(entry.object);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 0.25);
    const dist = Math.max(1.35, maxDim * 2.35);

    controls.target.copy(center);
    camera.position.set(center.x + dist * 0.72, center.y + dist * 0.48, center.z + dist * 0.72);
    controls.minDistance = Math.max(0.35, maxDim * 0.35);
    controls.update();

    // Always orbit the focused part
    setAutoRotate(true);

    document.querySelectorAll(".part-btn").forEach((el) => {
      el.classList.toggle("active", el.dataset.partId === entry.id);
    });
    const st = document.getElementById("parts-focus-status");
    if (st) st.textContent = `Focused: ${entry.label}`;
    if (status) status.textContent = `Part explorer · ${entry.label} · auto-rotate on`;
  }

  function buildPartsList() {
    const host = document.getElementById("parts-list");
    if (!host || !model.partCatalog) return;
    host.innerHTML = "";
    const countEl = document.getElementById("parts-count");
    if (countEl) countEl.textContent = `${model.partCatalog.length} named parts`;
    const byGroup = new Map();
    for (const p of model.partCatalog) {
      if (!byGroup.has(p.group)) byGroup.set(p.group, []);
      byGroup.get(p.group).push(p);
    }
    // Preferred group order
    const groupOrder = [
      "Assemblies",
      "Body",
      "Controls",
      "Lid",
      "Rotor / samples",
      "Drive / electronics",
      "Lab room",
      "Other parts",
    ];
    const groups = [...byGroup.keys()].sort((a, b) => {
      const ia = groupOrder.indexOf(a);
      const ib = groupOrder.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    for (const group of groups) {
      const items = byGroup.get(group);
      const gl = document.createElement("div");
      gl.className = "parts-group-label";
      gl.textContent = `${group} (${items.length})`;
      host.appendChild(gl);
      for (const item of items) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "part-btn";
        btn.dataset.partId = item.id;
        btn.textContent = item.label;
        btn.title = item.id;
        btn.addEventListener("click", () => focusPart(item));
        host.appendChild(btn);
      }
    }
  }
  buildPartsList();
  document.getElementById("btn-parts-clear")?.addEventListener("click", () => {
    clearPartExplorer();
    camera.position.set(CAM0.x, CAM0.y, CAM0.z);
    controls.target.set(TGT0.x, TGT0.y, TGT0.z);
    controls.minDistance = 2.2;
    controls.update();
    if (status) status.textContent = "Part focus cleared";
  });

  btnExplode?.addEventListener("click", () => {
    explodeTarget = explodeTarget > 0.5 ? 0 : 1;
    btnExplode.classList.toggle("active", explodeTarget > 0.5);
    if (status) {
      status.textContent = explodeTarget
        ? "Exploded — body · chamber · rotor · lid · rack · drive (motor/PSU/screws)"
        : "Assembled view";
    }
  });
  btnWire?.addEventListener("click", () => {
    // Global wireframe exits part-explorer isolate
    explorerPartId = null;
    document.querySelectorAll(".part-btn.active").forEach((el) => el.classList.remove("active"));
    wireframeOn = !wireframeOn;
    setWireframe(model, wireframeOn);
    btnWire.classList.toggle("active", wireframeOn);
  });
  btnAutoRotate?.addEventListener("click", () => {
    setAutoRotate(!autoRotateOn);
    if (status) {
      status.textContent = autoRotateOn
        ? demoLoop.active
          ? "Auto-rotate on · continuous demo running"
          : "Auto-rotate on"
        : "Auto-rotate off";
    }
  });
  btnReset?.addEventListener("click", () => {
    if (tubeStory.active) stopTubeStory("Tube story stopped (view reset).");
    if (showcase.active) stopFullShowcase("Showcase stopped (view reset).");
    clearPartExplorer();
    camera.position.set(CAM0.x, CAM0.y, CAM0.z);
    controls.target.set(TGT0.x, TGT0.y, TGT0.z);
    controls.minDistance = 2.2;
    controls.maxDistance = 40;
    setAutoRotate(false);
    controls.update();
    syncZoomSliderFromCamera();
    explodeTarget = 0;
    explodeAmt = 0;
    setExplodeAmount(model, 0);
    btnExplode?.classList.remove("active");
    if (status) status.textContent = "View reset";
  });

  // Click 3D keys + grab lid
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const clickables = [...model.buttons.values()];
  const lidMeshes = model.lidMeshes || [];

  function ndc(ev) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pickKey(ev) {
    ndc(ev);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickables, false);
    return hits.length ? hits[0].object.userData.keyId || null : null;
  }

  function pickLid(ev) {
    ndc(ev);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(lidMeshes, true);
    return hits.length > 0;
  }

  function pickLab(ev) {
    ndc(ev);
    raycaster.setFromCamera(pointer, camera);
    const rackHits = model.rackSlots.map((s) => s.hit);
    const rotorHits = model.rotorSlots.map((s) => s.hit);
    // Prefer rack / rotor tubes when lid open for loading workflow
    const hits = raycaster.intersectObjects([...rackHits, ...rotorHits], false);
    if (!hits.length) return null;
    const o = hits[0].object;
    if (o.userData.rackSlot != null) return { type: "rack", slot: o.userData.rackSlot };
    if (o.userData.rotorSlot != null) return { type: "rotor", slot: o.userData.rotorSlot };
    return null;
  }

  let pointerDownKey = null;
  let lidDragStartY = 0;
  let lidDragStartAmt = 0;

  renderer.domElement.style.touchAction = "none";
  renderer.domElement.addEventListener("pointerdown", (ev) => {
    // 1) Panel keys
    const id = pickKey(ev);
    if (id) {
      pointerDownKey = id;
      controls.enabled = false;
      setKeyPressLit(model, id, true);
      if (id === "short") {
        playKeyClick("normal");
        shortDown();
      } else if (isRockerKey(id)) startRockerHold(id);
      else handleKey(id);
      const mesh = modelButtons.get(id);
      // Keys face −Z; press moves into the panel (+Z)
      if (mesh) mesh.position.z += 0.012;
      return;
    }

    // 2) Manual tube load/unload (lid open, stopped)
    if (canAccessTubes()) {
      const labHit = pickLab(ev);
      if (labHit) {
        if (labHit.type === "rack") {
          const tid = c.lab.rack[labHit.slot];
          if (!tid) {
            setLabStatus("Empty rack well.");
            return;
          }
          // Fill empty tubes with selected material when picking up
          const tube = c.lab.tubes[tid];
          const matId = document.getElementById("material-select")?.value;
          if (tube.material_id === "empty" && matId) {
            tube.material_id = matId;
            tube.separated = false;
          }
          c.selected_tube_id = tid;
          // If a free rotor slot was preselected via UI, load there; else load next free
          loadRack(labHit.slot, c.selected_rotor_slot);
          c.selected_rotor_slot = null;
          return;
        }
        if (labHit.type === "rotor") {
          if (c.lab.rotor[labHit.slot]) {
            unloadRotor(labHit.slot);
            setLabStatus(`Removed tube from rotor slot ${labHit.slot} → rack.`);
          } else {
            // Place selected rack tube here if we have selection still on rack — or mark slot
            c.selected_rotor_slot = labHit.slot;
            setLabStatus(`Rotor pocket ${labHit.slot} selected — click a rack tube to load it here.`);
          }
          renderGrids();
          refresh3DTubes();
          return;
        }
      }
    }

    // 3) Grab lid
    if (pickLid(ev)) {
      if (c.rpm_actual > 0.5 || ["ACCEL", "RUN", "DECEL"].includes(c.state)) {
        setLabStatus("Cannot move lid while spinning.");
        return;
      }
      draggingLid = true;
      lidDragStartY = ev.clientY;
      lidDragStartAmt = lidOpenAmt;
      controls.enabled = false;
      renderer.domElement.setPointerCapture?.(ev.pointerId);
      if (status) status.textContent = "Dragging lid — mouse up = open, down = close";
    }
  });

  renderer.domElement.addEventListener("pointermove", (ev) => {
    if (!draggingLid) return;
    // Drag up (smaller clientY) → open
    const dy = lidDragStartY - ev.clientY;
    const next = lidDragStartAmt + dy / 180;
    setLidAmount(next);
  });

  const release3d = (ev) => {
    if (pointerDownKey) {
      const mesh = modelButtons.get(pointerDownKey);
      if (mesh) mesh.position.z -= 0.012;
      setKeyPressLit(model, pointerDownKey, false);
      if (pointerDownKey === "short") shortUp();
      else if (isRockerKey(pointerDownKey)) stopRockerHold();
      pointerDownKey = null;
    }
    if (draggingLid) {
      draggingLid = false;
      // Snap open/closed
      setLidAmount(lidOpenAmt > 0.45 ? 1 : 0);
      if (status) {
        status.textContent = c.lid_open
          ? "Lid open — grab lid or use open/close · rack on the left"
          : "Lid closed — start/stop to run";
      }
    }
    controls.enabled = true;
  };
  renderer.domElement.addEventListener("pointerup", release3d);
  renderer.domElement.addEventListener("pointercancel", release3d);
  renderer.domElement.addEventListener("pointerleave", release3d);

  // Initial tube visuals
  refresh3DTubes();

  if (status) {
    status.textContent =
      "Lab light room · clear lid · look into chamber · click rack tube → loads rotor · grab lid";
  }

  // Default helpful load for demo
  // (students can unload and reload manually)

  // Keep aspect correct when window resizes OR side panels collapse/expand
  const ro = new ResizeObserver(() => resizeViewport());
  ro.observe(host);
  window.addEventListener("resize", resizeViewport);
  resizeViewport();

  let prev = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    tickDemoLoop(now);
    tickTubeStory(now);
    tickShowcase(now);
    tick(dt);
    if (centrifugeModel) updateKeyGlows(centrifugeModel, now * 0.001);
    const s = snap();
    drawLcd(s);
    if (lcdTexture) {
      lcdTexture.needsUpdate = true;
      if (centrifugeModel?.lcdMat) {
        centrifugeModel.lcdMat.map = lcdTexture;
        centrifugeModel.lcdMat.needsUpdate = true;
      }
    }
    updateChrome(s);

    if (ledRunMesh?.material) {
      ledRunMesh.material.emissiveIntensity = s.led_run ? 1.2 : 0.05;
    }
    if (ledFaultMesh?.material) {
      ledFaultMesh.material.emissiveIntensity = s.led_fault ? 1.4 : 0.08;
    }

    const omega = (c.rpm_actual / 60) * Math.PI * 2 * 0.04;
    if (rotorSpin) rotorSpin.rotation.y += omega * dt;

    // Lid opens UP (+X rotation). Skip lerp while user is dragging the lid.
    if (!draggingLid) {
      const target = c.lid_open ? 1 : 0;
      lidOpenAmt += (target - lidOpenAmt) * Math.min(1, dt * 4);
    }
    if (lidHinge) lidHinge.rotation.x = lidOpenAmt * 1.85;

    // Smooth explode
    explodeAmt += (explodeTarget - explodeAmt) * Math.min(1, dt * 3);
    if (centrifugeModel) setExplodeAmount(centrifugeModel, explodeAmt);

    // Cinematic tube follow (fill → spin → rack reveal)
    followTubeCamera(camera, controls, dt);

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------------------
// AI / tutor API — highlight keys, press keys, read state, SFX
// ---------------------------------------------------------------------------
let _pulseTimer = null;

function exposeCentrifugeTwinApi(model) {
  /**
   * window.CentrifugeTwin
   *
   * Examples (browser console or another agent script):
   *   CentrifugeTwin.highlightKeys({ start: true, open: 0xffaa00 })
   *   CentrifugeTwin.clearHighlights()
   *   CentrifugeTwin.pulseKey('start', { color: 0x00ff88, ms: 2000 })
   *   CentrifugeTwin.press('start')
   *   CentrifugeTwin.getState()
   *   CentrifugeTwin.setMuted(true)
   */
  window.CentrifugeTwin = {
    /** Key ids available on the 3D panel */
    keyIds: () => (model?.buttons ? [...model.buttons.keys()] : []),

    /** Soft idle backlight when powered */
    setPoweredBacklight: (on) => setKeysPoweredBacklight(model, on),

    /**
     * Highlight keys for “press this next”.
     * map: { start: true, open: 0xffaa00, 'speed-up': { color: 0x00d4e8, intensity: 1.4 } }
     */
    highlightKeys: (map) => setKeyGlows(model, map),

    setKeyGlow: (id, opts) => setKeyGlow(model, id, opts),
    clearHighlights: () => clearKeyGlows(model),

    /** Pulse a single key for ms milliseconds (AI “look here”). */
    pulseKey: (id, { color = 0x00d4e8, intensity = 1.25, ms = 1800 } = {}) => {
      if (_pulseTimer) clearTimeout(_pulseTimer);
      setKeyGlow(model, id, { color, intensity });
      _pulseTimer = setTimeout(() => {
        setKeyGlow(model, id, false);
        _pulseTimer = null;
      }, ms);
    },

    /** Sequence of keys — highlights one at a time */
    async guideSequence(ids, { color = 0x00d4e8, dwellMs = 1400 } = {}) {
      for (const id of ids) {
        clearKeyGlows(model);
        setKeyGlow(model, id, { color, intensity: 1.3 });
        await new Promise((r) => setTimeout(r, dwellMs));
      }
      clearKeyGlows(model);
    },

    press: (keyId) => handleKey(keyId),
    getState: () => snap(),
    getController: () => ({ ...c, lab: c.lab }),

    setMuted: (m) => {
      setSfxMuted(m);
      const btn = document.getElementById("btn-sfx-mute");
      if (btn) btn.classList.toggle("active", !!m);
    },
    isMuted: () => isSfxMuted(),
    setVolume: (v) => setSfxVolume(v),
    playClick: (kind) => playKeyClick(kind || "normal"),
  };
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
renderGrids();
drawLcd(snap());
updateChrome(snap());
init3D();

document.getElementById("btn-sfx-mute")?.addEventListener("click", () => {
  const next = !isSfxMuted();
  setSfxMuted(next);
  document.getElementById("btn-sfx-mute")?.classList.toggle("active", next);
  setLabStatus(next ? "Sounds muted" : "Sounds on (soft clicks)");
});

// Demo: brief guide glow on START so the new halo/pulse is obvious once
setTimeout(() => {
  if (window.CentrifugeTwin && c.powered) {
    window.CentrifugeTwin.pulseKey("start", { ms: 1600, color: 0x3dd68c });
  }
}, 1000);

setLabStatus(
  "Choose sample → click rack tubes in 3D to load rotor → grab lid closed → start/stop. Fluids update after the run."
);
