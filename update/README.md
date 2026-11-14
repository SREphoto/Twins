# Twins Digital Twin Fleet Overhaul & Expansion Plan (`update/`)

> **PHASE STATUS**: **PLANNING ONLY** (`/plan`)
> **SCOPE LOCK**: Zero existing machine directories (`*_twin/`) or `lab_viewer/` files have been modified during creation of this planning package. Implementation begins only after user review and sprint approval.
> **BENCHMARK STANDARD**: The **Centrifuge Standard** (`.agents/AGENTS.md`) — 14-Subagent Puzzle Architecture + 25-Check Mechanical Gate (`scripts/oga_validator.mjs`) + 6-Angle CDP Visual QA (`twin-visual-qa`) + 7-Stage Operator Walkthrough & Narrated Video (`twin-voiceover-video-pipeline`).

---

## Executive Summary

This `update/` folder contains the complete engineering audit, remediation specifications, sprint schedule, cold-storage architecture, new equipment expansion roadmap, and agent/training toolkit required to elevate every instrument in the **Twins** ecosystem to accredited **Gold Standard** parity alongside our three locked reference machines:

1. **Microcentrifuge (`centrifuge_twin`)** — **12,981 viewer LOC · 25/25 OGA Gates PASSED** (*User: "Perfect!!"*)
2. **ERWEKA ZT 322 Tablet Disintegrator (`disintegration_tester_twin`)** — **10,461 viewer LOC · 25/25 OGA Gates PASSED** (*User: "Perfect."*)
3. **Shimadzu UV-1900i Spectrophotometer (`spectrophotometer_twin`)** — **7,938 viewer LOC (5,160 LOC 3D optical bench)** (*User: "Perfect"*)

---

## Master 18-Machine Baseline Scorecard

*Metrics below were measured directly from `wc -l *_twin/software/viewer/*.*` and `node scripts/oga_validator.mjs <twin>` during the planning audit.*

| # | Machine Twin | Directory | OEM Reference | Viewer LOC | OGA Gates | User Verdict | Remediation Tier | Target Sprint |
| :- | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :---: |
| **01** | **Microcentrifuge** | [`centrifuge_twin/`](file:///Users/Samuel/AGapps/Twins/centrifuge_twin) | Eppendorf 5424R / Sorvall Legend | 12,981 | **25 / 25** | **Perfect!!** | Tier 0 — Locked Gold Standard #1 | **Locked** |
| **02** | **ERWEKA Disintegrator** | [`disintegration_tester_twin/`](file:///Users/Samuel/AGapps/Twins/disintegration_tester_twin) | ERWEKA ZT 322 | 10,461 | **25 / 25** | **Perfect.** | Tier 0 — Locked Gold Standard #3 | **Locked** |
| **03** | **UV-1900i Spectrophotometer** | [`spectrophotometer_twin/`](file:///Users/Samuel/AGapps/Twins/spectrophotometer_twin) | Shimadzu UV-1900i / Genesys 50 | 7,938 | 13 / 25* | **Perfect** | Tier 0 — Locked Reference #2 (*visuals/optics locked*) | **Locked** |
| **04** | **Agilent 708-DS Dissolution** | [`dissolution_tester_twin/`](file:///Users/Samuel/AGapps/Twins/dissolution_tester_twin) | Agilent 708-DS (8-Vessel) | 4,294 | 20 / 25 | Almost there — just a few fixes | Tier 1 — Gate-5 Tags, Tour & Video | **Sprint 1** |
| **05** | **Ultrasonic Cleaner** | [`ultrasonic_cleaner_twin/`](file:///Users/Samuel/AGapps/Twins/ultrasonic_cleaner_twin) | Branson CPX / Elma S300 | 3,087 | 20 / 25 | Almost there — work on inside | Tier 1 — Internal Piezo/PCB/Drain & Gate 5 | **Sprint 1** |
| **06** | **Muffle Furnace** | [`muffle_furnace_twin/`](file:///Users/Samuel/AGapps/Twins/muffle_furnace_twin) | Carbolite CWF 1100 / Nabertherm L 9/11 | 3,379 | 20 / 25 | Needs some work | Tier 1 — Door/Refractory Polish & Gate 5 | **Sprint 1** |
| **07** | **Analytical Balance** | [`balance_twin/`](file:///Users/Samuel/AGapps/Twins/balance_twin) | Mettler Toledo XPE205 / XSE204 | 3,139 | 6 / 25 | Externally great; needs proper insides | Tier 2 — Interior-Only EMFR + Electronics/Power | **Sprint 2** |
| **08** | **FTIR Spectrometer** | [`ftir_twin/`](file:///Users/Samuel/AGapps/Twins/ftir_twin) | Thermo Nicolet iS50 ATR-FTIR | 6,470 | 12 / 25 | Needs work on the inside | Tier 2 — Interior Optical Bench, PSU & Continuity | **Sprint 2** |
| **09** | **Vacuum Pump** | [`vacuum_pump_twin/`](file:///Users/Samuel/AGapps/Twins/vacuum_pump_twin) | KNF Laboport / Vacuubrand MD 4C NT | 2,887 | 9 / 25 | Inspect exterior closely; make professional | Tier 3 — Exterior Overhaul (Fix Collision) + PSU/Bay | **Sprint 3** |
| **10** | **Stir Heat (Hotplate Stirrer)** | [`hotplate_twin/`](file:///Users/Samuel/AGapps/Twins/hotplate_twin) | IKA C-MAG HS 7 / STIR-HEAT 500-D | 2,615 | 9 / 25 | Needs inside + PSU + better materials/design | Tier 3 — Better Exterior Materials + Full Interior | **Sprint 3** |
| **11** | **Rotary Evaporator** | [`rotovap_twin/`](file:///Users/Samuel/AGapps/Twins/rotovap_twin) | Heidolph Hei-VAP / Buchi R-300 | 2,926 | 14 / 25 | Does not meet standards | Tier 3 — Exterior & Mechanical/Electronics Overhaul | **Sprint 3** |
| **12** | **Glove Box** | [`glove_box_twin/`](file:///Users/Samuel/AGapps/Twins/glove_box_twin) | MBraun UNIlab Pro / Inert I-Box | 2,876 | 13 / 25 | Weird floating parts; ugly; needs work | Tier 4 — Eliminate Floating Parts + Full Rebuild | **Sprint 4** |
| **13** | **Labconco FreeZone** | [`freeze_dryer_twin/`](file:///Users/Samuel/AGapps/Twins/freeze_dryer_twin) | Labconco FreeZone 4.5L (-84°C) | 2,734 | 14 / 25 | Needs a lot of work | Tier 4 — Cascade Refrigeration, Manifold & Bay | **Sprint 4** |
| **14** | **Parr High-Pressure Reactor** | [`high_pressure_reactor_twin/`](file:///Users/Samuel/AGapps/Twins/high_pressure_reactor_twin) | Parr 4560 + 4848 Controller | 4,231 | 10 / 25 | Needs a lot of work | Tier 4 — Stand, Closure, Mag-Drive & 4848 Interior | **Sprint 4** |
| **15** | **Vortex Mixer** | [`vortex_mixer_twin/`](file:///Users/Samuel/AGapps/Twins/vortex_mixer_twin) | *Archive V1; Build New OEM (IKA Vortex 3)* | 3,960 | 12 / 25 | Bad — save as-is & build different model | Tier 5 — Archive As-Is + Brand-New OEM Model | **Sprint 5** |
| **16** | **Benchtop pH Meter** | [`ph_meter_twin/`](file:///Users/Samuel/AGapps/Twins/ph_meter_twin) | Mettler SevenExcellence S470 | 3,230 | 20 / 25 | Awful | Tier 5 — Full Ground-Up Visual & Arm Rebuild | **Sprint 5** |
| **17** | **Karl Fischer Titrator** | [`karl_fischer_twin/`](file:///Users/Samuel/AGapps/Twins/karl_fischer_twin) | Metrohm 901 Titrando + 800 Dosino | 2,900 | 14 / 25 | Bad and needs much work done | Tier 5 — Ground-Up Rebuild (901/800/803) | **Sprint 5** |
| **18** | **Scanning Electron Microscope** | [`sem_twin/`](file:///Users/Samuel/AGapps/Twins/sem_twin) | ZEISS GeminiSEM / Thermo Apreo 2 | 1,377 | 6 / 25 | Horrible and needs a lot of work | Tier 6 — Flagship Multi-Assembly Ground-Up Build | **Sprint 6** |

*\*Note on `spectrophotometer_twin`: The user rated the UV-1900i Spectrophotometer as **Perfect**. Its 12 OGA linter regex misses (`PWR-01..04`, `BAY-03..05`, `INT-02..04`, `PRES-01..02`) are purely linter naming/presentation checks; per user direction, its visual 3D geometry and optical bench remain untouched and locked.*

---

## Planning Documents in `update/`

1. [`01_EXISTING_18_MACHINES_AUDIT_NOTES.md`](file:///Users/Samuel/AGapps/Twins/update/01_EXISTING_18_MACHINES_AUDIT_NOTES.md) — Detailed per-machine diagnostic notes, code-level root-cause citations, OGA gate failures, and exact remediation blueprints for all 18 machines.
2. [`02_COLD_STORAGE_FREEZER_AND_REFRIGERATOR_PLAN.md`](file:///Users/Samuel/AGapps/Twins/update/02_COLD_STORAGE_FREEZER_AND_REFRIGERATOR_PLAN.md) — Complete 1:1 CAD, thermodynamic, inventory, internal cascade/V-drive mechanics, and `lab_viewer` docking specs for the **Laboratory Refrigerator (+4°C)** and **ULT/Enzyme Freezer (-80°C / -20°C)**.
3. [`03_NEW_MACHINES_AND_LAB_EQUIPMENT_ROADMAP.md`](file:///Users/Samuel/AGapps/Twins/update/03_NEW_MACHINES_AND_LAB_EQUIPMENT_ROADMAP.md) — Phased 5-wave build plan for all remaining pharmaceutical, analytical, synthesis, and essential benchtop lab equipment from the master dossiers and curriculum roadmap.
4. [`04_MASTER_PLANNING_SCHEDULE_AND_SPRINTS.md`](file:///Users/Samuel/AGapps/Twins/update/04_MASTER_PLANNING_SCHEDULE_AND_SPRINTS.md) — Sequenced Sprint 1–8+ execution calendar, dependency graph, archive protocol for `vortex_mixer_twin`, and definition-of-done gates.
5. [`05_SKILLS_AGENTS_AND_TRAINING_TOOLKIT.md`](file:///Users/Samuel/AGapps/Twins/update/05_SKILLS_AGENTS_AND_TRAINING_TOOLKIT.md) — Authoritative guide to the 14-Subagent Puzzle Roster, 5 domain skills, 10-Plane Orientation Nail training module, shared procedural hardware library, and automated CDP/video QA tools.

---

## Core Workspace Reference Anchors

- [`.agents/AGENTS.md`](file:///Users/Samuel/AGapps/Twins/.agents/AGENTS.md) — Workspace Master Rules & Mandatory 11-Section Fidelity Contract
- [`.agents/SUBAGENT_PUZZLE_ROSTER.md`](file:///Users/Samuel/AGapps/Twins/.agents/SUBAGENT_PUZZLE_ROSTER.md) — 13-Subagent (+ Narrator #14) Puzzle Ownership Matrix
- [`.agents/MASTER_PREFLIGHT_CHECKLIST.md`](file:///Users/Samuel/AGapps/Twins/.agents/MASTER_PREFLIGHT_CHECKLIST.md) — 12-Category Zero-Tolerance Pre-Flight Quality Gate
- [`.agents/LESSONS_LEARNED.md`](file:///Users/Samuel/AGapps/Twins/.agents/LESSONS_LEARNED.md) — Accreditation Standard & Engineering Takeaways (`makeOperatorFacingQuadGeo`)
- [`.agents/OGA_TWINS.md`](file:///Users/Samuel/AGapps/Twins/.agents/OGA_TWINS.md) — 4-Phase OGA Assembly Line & 5 Mechanical Verification Gates
- [`scripts/oga_validator.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/oga_validator.mjs) — Automated Mechanical Gate Validator
- [`lab_viewer/shared/hardware_library.js`](file:///Users/Samuel/AGapps/Twins/lab_viewer/shared/hardware_library.js) — Reusable 3D Fasteners, Connectors & `createDecalQuad`
- [`training/training_date/orientation_test.js`](file:///Users/Samuel/AGapps/Twins/training/training_date/orientation_test.js) — 10-Plane Upright UV & Steel Nail Orientation Benchmark
