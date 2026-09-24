# Master change log

Newest first. Template: `templates/change_log_entry.md`.

---

## 2026-09-24 · NBA · build-spectrophotometer-twin

| Field   | Value                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | NBA / 5-Agent Pipeline                                                                                                                                                                                                                                           |
| Machine | `spectrophotometer_twin`, `lab_viewer`                                                                                                                                                                                                                          |
| Intent  | Build and register the UV-Vis Spectrophotometer (Shimadzu UV-1900i class) digital twin to full Gold-Standard with exhaustive procedural CAD detail, deterministic Beer-Lambert physics, Czerny-Turner optics, dynamic canvas LCD, and 6-cell carousel. |

### Created

- `spectrophotometer_twin/docs/PRODUCT_BRIEF.md` — Product brief & educational objectives.
- `spectrophotometer_twin/docs/dimensions.md` — 1:1 metric geometry specifications.
- `spectrophotometer_twin/docs/BOM.md` — Parametric Bill of Materials.
- `spectrophotometer_twin/docs/control_spec.md` — Control state machine and optical physics models.
- `spectrophotometer_twin/docs/STANDARD.md` — Package normative standard.
- `spectrophotometer_twin/research/sources.md` — Manual citations and chemical reagent references.
- `spectrophotometer_twin/AGENTS.md` — Twin package agent rules.
- `spectrophotometer_twin/README.md` — Quick start guide.
- `spectrophotometer_twin/requirements.txt` — Package dependencies.
- `spectrophotometer_twin/scripts/test.sh` — Controller unit test runner.
- `spectrophotometer_twin/scripts/serve.sh` — Standalone package HTTP server runner.
- `spectrophotometer_twin/software/controller/spectrophotometer_controller.py` — Pure Python state machine and Beer-Lambert simulation engine.
- `spectrophotometer_twin/software/controller/test_controller.py` — Unit test suite (6/6 tests passing).
- `spectrophotometer_twin/software/viewer/index.html` — Gold Standard HTML shell with collapsible control and lab panels.
- `spectrophotometer_twin/software/viewer/style.css` — Gold Standard stylesheet (`--bg: #0c1016`).
- `spectrophotometer_twin/software/viewer/spectrophotometer3d.js` — Exhaustive procedural Three.js solid model with DIN 912 fasteners, hinged lid, 6-cell carousel, refractive quartz cuvettes, dynamic probe beam, and Czerny-Turner optics.
- `spectrophotometer_twin/software/viewer/app.js` — Web application controller with dynamic LCD CanvasTexture (`flipY = false`), live spectrum curve plotting, raycaster clicks, and GLP compliance logger.
- `spectrophotometer_twin/software/viewer/sfx.js` — Web Audio synthesizer for stepper motors, shutter clicks, and zero chime.
- `.master/registry/spectrophotometer_twin_manifest.md` — Machine manifest for `spectrophotometer_twin`.
- `.master/logs/report_cards/2026-09-24_NBA_build-spectrophotometer-twin.md` — End-of-work report card.

### Changed

- `lab_viewer/machines/registry.js` — Elevated `spectrophotometer` status from `planned` to `ready`.
- `.master/registry/machines.md` — Registered `spectrophotometer_twin` as active Gold-tier machine.
- `.master/logs/master_change_log.md` — this entry.
- `.master/logs/conversation_log.md` — session log entry.

---

## 2026-09-06 · NBA · gold-rebuild-balance-rotovap

| Field   | Value                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | NBA                                                                                                                                                                                                                                                              |
| Machine | `balance_twin`, `rotovap_twin`, `lab_viewer`                                                                                                                                                                                                                    |
| Intent  | Fully elevate Analytical Balance (XSE204) and Rotary Evaporator (R-300) to Gold-Tier procedural digital twins with exhaustive CAD modeling, deterministic physics, and Gold Standard UI layout. |

### Created

- `lab_viewer/shared/hardware_library.js` — Shared procedural laboratory fasteners (DIN 912 socket screws, DIN 125 washers, IEC C14, BNC jacks, DB9 ports, rocker switches).
- `balance_twin/software/viewer/balance3d.js` — Exhaustive procedural Three.js model of Mettler Toledo XSE204 (die-cast chassis, 3 sliding glass draft doors, SmartGrid floor, pan, EMFR voice coil, calibration weight, spirit bubble level).
- `balance_twin/software/viewer/app.js` — Analytical balance state machine, EMFR exponential settling, real-time air draft turbulence physics, GLP print records.
- `balance_twin/software/viewer/sfx.js` — Synthesized Web Audio sounds (door slide, pan clink, stability chime, calibration motor hum).
- `balance_twin/software/viewer/style.css` — Gold standard layout stylesheet (`--bg: #0c1016`, collapsible panels).
- `rotovap_twin/software/viewer/rotovap3d.js` — Exhaustive procedural Three.js model of Büchi Rotavapor R-300 (base casting, vertical lift tower with Acme lead screw, 45° angled drive head, Combi-Clip, PTFE seal, B-300 heating bath, double-spiral condenser, receiving flask, I-300 Pro controller).
- `rotovap_twin/software/viewer/app.js` — Antoine / Clausius-Clapeyron solvent vapor thermodynamics, dynamic boiling point & evaporation rate, motorized lift control.
- `rotovap_twin/software/viewer/sfx.js` — Synthesized Web Audio sounds (lift actuator hum, rotation motor sound, condensate drip, vacuum aeration hiss).
- `rotovap_twin/software/viewer/style.css` — Gold standard layout stylesheet.
- `.master/registry/balance_twin_manifest.md` — Machine manifest for `balance_twin`.
- `.master/registry/rotovap_twin_manifest.md` — Machine manifest for `rotovap_twin`.

### Changed

- `balance_twin/software/viewer/index.html` — Rewritten to conform strictly to the Gold Standard layout.
- `rotovap_twin/software/viewer/index.html` — Rewritten to conform strictly to the Gold Standard layout.
- `.master/registry/machines.md` — Updated certification status of `balance_twin`, `rotovap_twin`, and `vacuum_pump_twin` to Gold (`yes`).
- `.master/logs/master_change_log.md` — this entry

---

## 2026-07-29 · NBA · rebuild-vacuum-pump-cad

| Field   | Value                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | NBA                                                                                                                                                                                                                                                              |
| Machine | `vacuum_pump_twin`                                                                                                                                                                                                                                               |
| Intent  | Rebuild the vacuum pump twin viewer and 3D rendering to achieve CAD-level visual fidelity through purely procedural modeling, strictly aligning with the Gold Standard UX. |

### Created

- `.agents/AGENTS.md` — Created to enforce workspace-wide rule preventing future agents from optimizing away CAD fidelity or modifying the standard layout.
- `.master/logs/report_cards/2026-07-29_NBA_rebuild-vacuum-pump.md` — Report card.

### Changed

- `vacuum_pump_twin/software/viewer/index.html` — Rewritten to mirror centrifuge layout.
- `vacuum_pump_twin/software/viewer/style.css` — Standardized variables.
- `vacuum_pump_twin/software/viewer/vacuum_pump3d.js` — Procedurally reconstructed the N820 vacuum pump in extraordinary detail (screws, ribs, cams, diaphragms, fan blades).
- `.master/governance/rules.md` — Modified Rule #12 to strictly enforce exhaustive procedural CAD modeling.
- `.master/logs/master_change_log.md` — this entry
- `.master/logs/conversation_log.md` — session conversation entry
- `.master/logs/troubleshooting_log.md` — empty troubleshooting entry

### Deleted

- none

### Moved

- none



## 2026-07-29 · OGA · plan-vacuum-pump-rebuild

> **🔑 KEY TOPIC: VACUUM PUMP FULL REBUILD PLAN** This entry documents the planning phase for rebuilding
> `vacuum_pump_twin/` from scratch. A comprehensive handoff document was created at
> `vacuum_pump_twin/docs/HANDOFF_CONTEXT.md` that contains the full reading list, context map, and instructions for any
> agent continuing this work.

| Field   | Value                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | OGA                                                                                                                                                                                                                                                              |
| Machine | `vacuum_pump_twin`                                                                                                                                                                                                                                               |
| Intent  | Plan from-scratch rebuild of vacuum pump twin to match gold-sample centrifuge standard. Research exists; runtime (viewer + controller) needs complete replacement. Monolithic GLB-loading viewer (1674-line index.html) is the PIPELINE.md Stage 1 anti-pattern. |

### Created

- `vacuum_pump_twin/docs/HANDOFF_CONTEXT.md` — **🔑 KEY DOCUMENT.** Complete agent handoff with ordered reading list of
  ~25 files, architectural decisions, open questions, implementation plan summary, and quick-start instructions for any
  incoming agent. **Point new agents here first.**

### Changed

- `.master/logs/master_change_log.md` — this entry
- `.master/logs/conversation_log.md` — session conversation entry

### Deleted

- none

### Moved

- none

### Key Context for Future Agents

> **🔑 KEY TOPIC: WHAT WAS LEARNED**
>
> 1. The existing `vacuum_pump_twin/software/viewer/index.html` is a **1674-line monolithic file** that loads an 8.7 MB
>    GLB — this is the exact anti-pattern from `centrifuge_twin/docs/PIPELINE.md` Stage 1
> 2. The existing Python controller has only **52 lines, 4 states, 2 tests** — insufficient for production
> 3. The research is **complete and high quality** — 9 downloaded files, 5 created reference docs, full
>    BOM/dimensions/schematics. Do NOT redo research.
> 4. The gold sample pattern to follow: modular files (`index.html` shell + `style.css` + `app.js` + `centrifuge3d.js` +
>    `sfx.js`), procedural Three.js geometry, Python controller with `snap()` method
> 5. Implementation plan: 6 phases, 13 steps — scaffold/docs → controller → procedural viewer → finalize → registry →
>    logs
> 6. **4 open questions** need user input: speed control dial, gauge display type, demo scenario, maintenance trainer

**Report card:** Planning-only session; no code changes; full report card deferred to execution session.

---

## 2026-07-27 · OGA · fix-ultrasonic-details

| Field   | Value                                                                           |
| ------- | ------------------------------------------------------------------------------- |
| Agent   | OGA                                                                             |
| Machine | `ultrasonic_cleaner_twin`                                                       |
| Intent  | Fix wire basket layout, flip button labels, and fix physical button glow states |

### Created

- `.master/logs/report_cards/2026-07-27_OGA_fix-ultrasonic-details.md` — session report card

### Changed

- `centrifuge_twin/software/viewer/centrifuge3d.js` — Elongated shared `INSTRUMENT_BENCH.sx` from 6.6 to 9.6
- `ultrasonic_cleaner_twin/software/viewer/ultrasonic3d.js` — Added `rotation.y = Math.PI` to `makeKey` to fix labels
  rendering backward
- `ultrasonic_cleaner_twin/software/viewer/app.js` — Added `state.pressed` map tracking UI `mousedown`/`mouseup` to
  drive 3D `emissiveIntensity` via `updateBtn`
- `ultrasonic_cleaner_twin/software/viewer/style.css` — Added CSS `:active` styling so HTML UI buttons glow physically
  on depression
- `.master/logs/troubleshooting_log.md` — Added log entry
- `.master/logs/conversation_log.md` — This session entry

### Deleted

- none

### Moved

- none

**Report card:** `logs/report_cards/2026-07-27_OGA_fix-ultrasonic-details.md`

---

## 2026-07-27 · OGA · fix-ultrasonic-issues

| Field   | Value                                                                                |
| ------- | ------------------------------------------------------------------------------------ |
| Agent   | OGA                                                                                  |
| Machine | `ultrasonic_cleaner_twin`                                                            |
| Intent  | Fix UI layout, button colors, sample generation, and basket physical position bounds |

### Created

- `.master/logs/report_cards/2026-07-27_OGA_fix-ultrasonic-issues.md` — session report card
- `.agents/workflows/run.md` - `/run` workflow file to start viewer and server

### Changed

- `ultrasonic_cleaner_twin/software/viewer/index.html` — Updated UI layout with flexbox and added active light states
  for buttons
- `ultrasonic_cleaner_twin/software/viewer/app.js` — Logic for samples, lighting states, and basket positioning
  coordinates
- `ultrasonic_cleaner_twin/software/viewer/ultrasonic3d.js` — Updated model to match new sample constraints and fixed
  nameplate hanging off edge
- `.master/logs/troubleshooting_log.md` — Documented basket issue and fix
- `.master/logs/conversation_log.md` — This session entry

### Deleted

- none

### Moved

- none

**Report card:** `logs/report_cards/2026-07-27_OGA_fix-ultrasonic-issues.md`

---

## 2026-07-26 · OGA · fix-unload-error

| Field   | Value                                                                  |
| ------- | ---------------------------------------------------------------------- |
| Agent   | OGA                                                                    |
| Machine | `ultrasonic_cleaner_twin`                                              |
| Intent  | Fix JavaScript TypeError in the viewer related to obsolete UI elements |

### Created

- `.master/logs/report_cards/2026-07-26_OGA_fix-unload-error.md` — session report card

### Changed

- `ultrasonic_cleaner_twin/software/viewer/app.js` — removed obsolete `btn-unload-sample` onclick listener

### Deleted

- none

### Moved

- none

**Report card:** `logs/report_cards/2026-07-26_OGA_fix-unload-error.md`

---

## 2026-07-25 · MIA / OGA · port-phase2b-assets

| Field   | Value                                                                                     |
| ------- | ----------------------------------------------------------------------------------------- |
| Agent   | MIA / OGA                                                                                 |
| Machine | `rotovap_twin`, `glove_box_twin`, `balance_twin`, `vacuum_pump_twin`, `vortex_mixer_twin` |
| Intent  | Complete Phase 2B migration of all 9 completed ChemMate Virtual Lab builds into Twins     |

### Created

- `rotovap_twin/` — Rotary evaporator with motorized lift & bath twin package
- `glove_box_twin/` — Inert atmosphere glove box with vacuum lock twin package
- `balance_twin/` — 0.1 mg precision analytical balance twin package
- `vacuum_pump_twin/` — Diaphragm vacuum pump with speed control twin package
- `vortex_mixer_twin/` — Touch & continuous vortex mixer twin package
- `.master/logs/report_cards/2026-07-25_MIA_port-phase2b-assets.md` — session report card

### Changed

- `.master/registry/machines.md` — registered all 5 Phase 2B twin packages
- `lab_viewer/machines/registry.js` — registered all 5 Phase 2B machines as ready in lab desk picker

### Deleted

- none

### Moved

- none

**Report card:** `logs/report_cards/2026-07-25_MIA_port-phase2b-assets.md`

---

## 2026-07-25 · MIA / OGA · port-phase2a-assets

| Field   | Value                                                                    |
| ------- | ------------------------------------------------------------------------ |
| Agent   | MIA / OGA                                                                |
| Machine | `muffle_furnace_twin` + `ph_meter_twin`                                  |
| Intent  | Scaffold Phase 2A core requested twin packages from ChemMate Virtual Lab |

### Created

- `muffle_furnace_twin/` — 9L 1200°C ceramic fibre furnace twin package with controller, viewer, tests, and CAD
- `ph_meter_twin/` — benchtop dual pH/mV meter with ATC twin package with controller, viewer, tests, and CAD
- `.master/logs/report_cards/2026-07-25_MIA_port-phase2a-assets.md` — session report card

### Changed

- `.master/registry/machines.md` — registered `muffle_furnace_twin` and `ph_meter_twin`
- `lab_viewer/machines/registry.js` — registered ready machine entries for lab desk switch

### Deleted

- none

### Moved

- none

**Report card:** `logs/report_cards/2026-07-25_MIA_port-phase2a-assets.md`

---

## 2026-07-25 · MIA / OGA · port-chemmate-assets

| Field   | Value                                                                 |
| ------- | --------------------------------------------------------------------- |
| Agent   | MIA / OGA                                                             |
| Machine | `ultrasonic_cleaner_twin` + `high_pressure_reactor_twin`              |
| Intent  | Audit ChemMate Virtual Lab and scaffold initial Phase 1 twin packages |

### Created

- `.master/agents/MIA.md` — Migration & Asset Ingestion Agent charter
- `ultrasonic_cleaner_twin/` — relocatable twin package with controller, viewer, tests, and CAD
- `high_pressure_reactor_twin/` — relocatable twin package with controller, viewer, tests, and CAD
- `.master/logs/report_cards/2026-07-25_MIA_port-chemmate-assets.md` — session report card

### Changed

- `.master/agents/README.md` — added MIA to agent roster and handoff chain
- `.master/registry/machines.md` — registered `ultrasonic_cleaner_twin` and `high_pressure_reactor_twin`
- `lab_viewer/machines/registry.js` — registered ready machine entries for lab desk switch

### Deleted

- none

### Moved

- none

**Report card:** `logs/report_cards/2026-07-25_MIA_port-chemmate-assets.md`

---

## 2026-07-25 · OGA · docs-lab-viewer

| Field   | Value                                                                                    |
| ------- | ---------------------------------------------------------------------------------------- |
| Agent   | OGA / docs                                                                               |
| Machine | workspace + lab_viewer                                                                   |
| Intent  | Document lab_viewer across instructions; complete session logs for serve-port fix + docs |

### Created

- `.master/logs/report_cards/2026-07-25_OGA_docs-lab-viewer.md` — this session report card
- `README.md` (Twins root) — one-page entry: lab_viewer first

### Changed

- `.master/README.md` — Run the lab section (serve + `/lab_viewer/`)
- `.master/AGENT_SOP.md` — lab desk paths, verify commands, new-machine desk registration
- `.master/HOW_TO_BUILD_A_MACHINE.md` — lab desk preamble + sanity commands
- `.master/agents/NBA.md` — desk registration in outputs/build order
- `.master/governance/rules.md` — rule 11 lab desk
- `.master/MANIFEST.md` — (already had lab_viewer; unchanged this pass if already present)
- `lab_viewer/README.md` — correct run instructions (no nested `cd Twins`; port busy handling)
- `scripts/serve.sh` — auto-pick free port when 8765 busy
- `centrifuge_twin/README.md` — preferred lab desk vs standalone
- `centrifuge_twin/AGENTS.md` — lab desk + registry
- `centrifuge_twin/docs/STANDARD.md` — layout + §8 desk registration
- `centrifuge_twin/docs/PIPELINE.md` — lab desk run commands
- `centrifuge_twin/standards/machine_template.md` — home layout + quality checklist
- `centrifuge_twin/.agents/skills/lab-digital-twin/SKILL.md` — lab_viewer daily commands + register step

### Deleted

- none

### Moved

- none

**Report card:** `logs/report_cards/2026-07-25_OGA_docs-lab-viewer.md`

---

## 2026-07-25 · NBA · lab-viewer

| Field   | Value                                                                   |
| ------- | ----------------------------------------------------------------------- |
| Agent   | NBA                                                                     |
| Machine | lab_viewer + centrifuge_twin                                            |
| Intent  | Master lab desk at Twins root with machine picker and switch transition |

### Created

- `lab_viewer/` — master lab viewer shell
- `lab_viewer/machines/registry.js` — centrifuge + planned machines
- `lab_viewer/transition_scene.js` — shared lab desk + slide off/on
- `lab_viewer/placeholders/planned.html` — planned twin stub
- `scripts/serve.sh` — serve whole Twins tree

### Changed

- `centrifuge_twin/software/viewer/centrifuge3d.js` — `includeLab` option; export `buildLabRoom`, `INSTRUMENT_BENCH`
- `.master/README.md`, `MANIFEST.md`, `HOW_TO_BUILD_A_MACHINE.md`, `registry/machines.md` — lab_viewer wiring

### Deleted

- none

### Moved

- none

**Report card:** `logs/report_cards/2026-07-25_NBA_lab-viewer.md`

---

## 2026-07-25 · OGA · agent-sop

| Field   | Value                                                   |
| ------- | ------------------------------------------------------- |
| Agent   | OGA                                                     |
| Machine | workspace                                               |
| Intent  | Add single session AGENT_SOP and wire master docs to it |

### Created

- `.master/AGENT_SOP.md` — session SOP (start → work → handoff → close)
- `.master/logs/report_cards/2026-07-25_OGA_agent-sop.md` — report card

### Changed

- `.master/README.md` — SOP first in start table
- `.master/AGENTS_MANDATE.md` — points at SOP as full procedure
- `.master/MANIFEST.md` — list AGENT_SOP
- `.master/agents/README.md` — shared rule #1 is SOP
- `.master/HOW_TO_BUILD_A_MACHINE.md` — precondition reads SOP
- `.master/governance/rules.md` — rule 6 references SOP
- `centrifuge_twin/AGENTS.md` — start with AGENT_SOP
- `centrifuge_twin/.agents/skills/lab-digital-twin/SKILL.md` — Twins/.master + SOP

### Deleted

- none

### Moved

- none

**Report card:** `logs/report_cards/2026-07-25_OGA_agent-sop.md`

---

## 2026-07-25 · OGA · create-master

| Field   | Value                                                                                         |
| ------- | --------------------------------------------------------------------------------------------- |
| Agent   | OGA (session setup)                                                                           |
| Machine | workspace                                                                                     |
| Intent  | Create `Twins/.master` governance: build instructions, agent roles, logs, templates, registry |

### Created (master structure)

- `.master/README.md` — index
- `.master/HOW_TO_BUILD_A_MACHINE.md` — new machine process
- `.master/MANIFEST.md` — workspace important files
- `.master/AGENTS_MANDATE.md` — required end-of-work logging
- `.master/agents/*` — OGA, NBA, SAA, LIAR, SEOA, MDRA, BC charters + roster
- `.master/templates/*` — report card, change/trouble/conversation entries, machine manifest
- `.master/governance/rules.md`, `scoring_rubric.md`
- `.master/logs/*` — log shells + this entry
- `.master/registry/machines.md`, `centrifuge_twin_manifest.md`

### Changed

- `centrifuge_twin/AGENTS.md` — point at `.master` mandate
- `centrifuge_twin/standards/machine_template.md` — home layout includes `.master/`

### Deleted

- none

### Moved

- none

### Report card

`logs/report_cards/2026-07-25_OGA_create-master.md`
