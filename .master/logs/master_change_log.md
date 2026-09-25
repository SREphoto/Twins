# Master change log

Newest first. Template: `templates/change_log_entry.md`.

---

## 2026-09-25 · OGA-CAD & VBA · remediate-vortex-fluid-and-establish-vortex-guild

| Field   | Value                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | OGA-CAD (Master Orchestration), VBA (Vortex Build Architect), SHAA-3D (Self-Healing CAD), SOA (Synthetic Operator Agent)                                                                                                                                         |
| Machine | `vortex_mixer_twin`, `workspace`                                                                                                                                                                                                                                |
| Intent  | Remediate user-reported visual blocker ("there is no vortex showing" & "are you using the agents we created ??"): formally establish the Vortex Mixer Guild (VBA + 14 specialized subagents), fix glass transmission depth occlusion, engineer dynamic parametric 3D hollow forced-vortex paraboloid with wall climbing and central aeration core, set initial continuous running state and centered camera framing, and pass all governance and unit test suites. |

### Changed

- `.master/02_AGENT_WORKFORCE/vortex_guild/VORTEX_BUILD_ARCHITECT.md`: Created specification for VBA lead orchestrator supervising 14 domain subagents.
- `.master/02_AGENT_WORKFORCE/vortex_guild/SUBAGENTS_ROSTER.md`: Defined 14 specialized domain subagents for the Vortex Mixer (`SA-RESEARCH`, `SA-HOUSING`, `SA-WIRING`, `SA-MATERIALS`, `SA-LCD`, `SA-LABELS`, `SA-ENV`, `SA-CONTROLS`, `SA-PHYSICS`, `SA-LIGHTS`, `SA-ACCESSORIES`, `SA-UI`, `SA-UX`, `SA-DELIVER`).
- `scripts/maintenance/run_vortex_subagents.mjs`: Created automated guild domain auditor and test dispatcher (14/14 domains verified).
- `vortex_mixer_twin/software/viewer/vortex_mixer3d.js`: Replaced `MAT_GLASS_TUBE` with high-clarity `MeshStandardMaterial` (`color: 0xebf8ff, roughness: 0.05, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide`) with `renderOrder = 2`; built parametric `BufferGeometry` for fluid with dynamic paraboloid hollow air funnel, wall climb ($44\text{ to }76\text{ mm}$), and central aeration core spindle (`Body_Fluid_VortexCore`); implemented matching parametric fluid for 1.5 mL microcentrifuge tube.
- `vortex_mixer_twin/software/viewer/app.js`: Configured default state to `mode: 'CONTINUOUS'` (2400 RPM) so the vortex spins immediately on load; aligned physical toggle lever and speed encoder on startup; centered camera target on the vortex assembly `(0, 105, 0)`.
- `.master/logs/troubleshooting_log.md`: Documented incident `[ISS-003]` and `[DIAG-006]`.
- `.agents/TROUBLESHOOTING_LOG.md`: Added `DIAG-006` rule for glass transmission and fluid vortex paraboloid containment.
- `.master/logs/report_cards/2026-09-25_OGA-CAD_remediate-vortex-fluid-and-establish-vortex-guild.md`: Added session performance report card (Score: 100/100).

---

## 2026-09-25 · NBA & CBA · deep-review-and-fix-all-scaffolded-twins

| Field   | Value                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | NBA (New Build Agent) & CBA (Centrifuge Build Architect)                                                                                                                                                                                                         |
| Machine | `muffle_furnace_twin`, `glove_box_twin`, `high_pressure_reactor_twin`, `ultrasonic_cleaner_twin`, `vacuum_pump_twin`, `centrifuge_twin`, `workspace`                                                                                                           |
| Intent  | Exhaustive deep review and defect resolution across all 12 digital twins in the ChemMate ecosystem: fixing ramp-down and sensor break safety in muffle furnace, antechamber cycle reset and pressure alarm reset in glove box, MAWP fault latching and burst disc gating in reactor, node taxonomy prefixes and dry run/cavitation overtemp safety in ultrasonic cleaner, motor overheat power-on bypass in vacuum pump, test discovery in centrifuge twin, passing all 118 unit tests across all 12 twins (100%), and achieving 0 violations on cad_validator. |

### Changed

- `muffle_furnace_twin/software/controller/furnace_controller.py`: Fixed ramp-down cooling trajectory jumping prematurely to SOAKING; added thermocouple break interlock in `tick()` and required `thermocouple_ok` in `reset_fault()`.
- `muffle_furnace_twin/software/controller/test_controller.py`: Added `test_controlled_cooling_ramp` and `test_thermocouple_break_during_heating` (12/12 passing).
- `glove_box_twin/software/controller/glovebox_controller.py`: Opening outer door now resets `antechamber_cycles_completed = 0`; added vacuum interlock (< 950 mbar) on door opening; `acknowledge_alarms()` now requires safe pressure (-4.0 <= P <= 7.0 mbar).
- `glove_box_twin/software/controller/test_controller.py`: Added `test_outer_door_opens_resets_antechamber_purge` and `test_acknowledge_alarms_requires_safe_pressure` (14/14 passing).
- `high_pressure_reactor_twin/software/controller/reactor_controller.py`: Rupture disc locks pressure to 1.0 bar atmospheric; initialized `prev_err` to prevent derivative kick; pressure exceeding MAWP (200 bar) transitions to `FAULT_OVERPRESSURE`; `acknowledge_alarms()` resets state to `IDLE` before updating.
- `high_pressure_reactor_twin/software/controller/test_controller.py`: Added `test_burst_disc_rupture_prevents_repressurization` and `test_operating_limit_overpressure_fault` (14/14 passing).
- `ultrasonic_cleaner_twin/software/viewer/app.js`: Renamed power cord, plugs, and sample contaminants to use `Body_` prefixes; enforced `flipY = false` on LCD texture.
- `ultrasonic_cleaner_twin/software/viewer/ultrasonic3d.js`: Renamed all chassis, basin, basket, lid, electronics, and wiring 3D mesh nodes to conform to Semantic Part Taxonomy (`Body_`, `Fastener_`, `Btn_`, `Knob_`, `Pivot_`, `UI_LCD`, `Badge_SREdesigns`); reordered `getPartGroup` so specific subsystems match before `Body_` fallback.
- `ultrasonic_cleaner_twin/software/controller/ultrasonic_controller.py`: Upgraded controller with Branson CPX industrial state engine; immediate `FAULT_DRY_RUN` trip on fluid level drop during idle preheating; global over-temperature check protecting against cavitation heating.
- `ultrasonic_cleaner_twin/software/controller/test_controller.py`: Expanded unit test suite from 4 to 14 tests (14/14 passing).
- `vacuum_pump_twin/software/viewer/vacuum_pump3d.js`: Renamed node names to `Btn_Power` and `Knob_GasBallast`.
- `vacuum_pump_twin/software/controller/pump_controller.py`: Added overheat check in `set_power(True)` preventing bypass of thermal safety shutdown.
- `vacuum_pump_twin/software/controller/test_controller.py`: Added `test_power_on_while_overheated` (13/13 passing).
- `centrifuge_twin/software/controller/test_controller.py` & `test_samples.py`: Converted to `unittest.TestCase` test suites so `python3 -m unittest discover` runs all 14 tests (14/14 passing).
- `.master/logs/troubleshooting_log.md`: Added issue resolutions for [ISS-041] through [ISS-047].

---

## 2026-09-25 · NBA & CBA · deep-implement-glove-box-and-reactor-twins

| Field   | Value                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | NBA (New Build Agent) & CBA (Digital Twin Workforce)                                                                                                                                                                                                             |
| Machine | `glove_box_twin`, `high_pressure_reactor_twin`, `workspace`                                                                                                                                                                                                      |
| Intent  | Full production-grade implementation of the final two scaffolded machine digital twins: SREdesigns UNI-9000 Pro Inert Atmosphere Glove Box and SREdesigns Parr 4560 / 4848 High-Pressure Stirred Mini-Reactor, including pure procedural Three.js CAD models conforming to the Semantic Part Taxonomy, dynamic Canvas LCDs with flipY=false, comprehensive Python behavioral controllers with real physics (closed-loop PID thermal control, Gay-Lussac gas expansion, and Siemens/BOSCH PLC atmosphere state engine), full Web Audio sound synthesis, and passing all unit tests with 0 cad_validator violations. |

### Created

- `glove_box_twin/software/viewer/glove_box3d.js` — Complete procedural Three.js CAD assembly for glove box (square-tube steel stand frame, 4 leveling feet, welded 304 SS main chamber with 10° slanted window flange, 12.7 mm optical acrylic viewing window, 16 perimeter compression fasteners, dual 203 mm machined aluminum glove ports with butyl sleeves, cylindrical transfer antechamber with counterbalanced swing doors and clamping handwheels, sliding SS tray, analog Bourdon tube vacuum gauge, manual 3-way vacuum and refill valves, rear gas purification column, 150 L/min circulation blower, angled 10" TFT touchscreen PLC console, and operator foot switch pedal).
- `glove_box_twin/software/viewer/sfx.js` — Web Audio procedural sound synthesizer (solenoid click, vacuum roughing pump drone, inert gas purge hiss, door latch thud, foot pedal click, and alarm horn).
- `glove_box_twin/software/viewer/style.css` — Gold Standard layout stylesheet for glove box viewer.
- `glove_box_twin/software/viewer/app.js` — Interactive application controller with dynamic CanvasTexture PLC HMI (flipY = false), differential pressure simulation, 3-cycle antechamber evacuate & refill sequences, door kinematics, and automated classroom organometallic transfer demonstration.
- `high_pressure_reactor_twin/software/viewer/reactor3d.js` — Complete procedural Three.js CAD assembly for Parr 4560 / 4848 high-pressure stirred reactor (cast iron A-frame base with rubber feet, ground chrome support mast, 300 mL 316SS thick-walled reaction cylinder, 2-piece drop-band split-ring closure clamp with 6 Grade B7 compression bolts, fixed 316SS head plate with cooling loop and thermowell, clamshell electric mantle with dynamic thermal glow shader, Parr A1120HC6 hermetic magnetic stirrer drive with cooling jacket, 1/8 hp DC motor and belt guard, center drive shaft with 4-blade turbine impeller, liquid sampling dip tube, gas inlet and vent needle valves, hexagonal burst disc safety head with discharge tube, 3.5" analog 250-bar dial pressure gauge, and separate Parr 4848 digital controller enclosure with dual-readout display).
- `high_pressure_reactor_twin/software/viewer/style.css` — Gold Standard layout stylesheet for high-pressure reactor viewer.
- `high_pressure_reactor_twin/software/viewer/app.js` — Interactive application controller with dynamic CanvasTexture dual-readout display (flipY = false), PID thermal loop, Gay-Lussac gas expansion, motor tachometer regulation, pressure dial sweep, and automated catalytic hydrogenation demonstration.
- `.master/logs/report_cards/2026-09-25_NBA_deep-build-glove-box-and-reactor.md` — Agent self-report card.

### Changed

- `glove_box_twin/software/controller/glovebox_controller.py` — Upgraded behavioral controller with full Siemens/BOSCH PLC state machine, differential pressure loop, automated 3-cycle antechamber evacuate/refill sequence, foot pedal negative pressure assist, door interlocks, alarm thresholds, and telemetry.
- `glove_box_twin/software/controller/test_controller.py` — Expanded unit test suite from 2 to 12 comprehensive unit tests covering all states, cycles, interlocks, and edge cases (100% pass rate).
- `glove_box_twin/software/viewer/index.html` — Rewritten into Gold Standard UI shell with camera toolbar, collapsible controls, and live telemetry panels.
- `high_pressure_reactor_twin/software/controller/reactor_controller.py` — Upgraded behavioral controller with Parr 4848 PTM closed-loop temperature PID, MCM motor tachometer regulation with torque estimation, PDM gas law thermal pressure expansion, SVM cooling solenoid control, HTM over-temp lockout, burst disc rupture interlock, and telemetry.
- `high_pressure_reactor_twin/software/controller/test_controller.py` — Expanded unit test suite from 4 to 12 comprehensive unit tests covering PID dynamics, motor regulation, thermal pressure expansion, gas inlet/venting, burst disc rupture, and safety cutouts (100% pass rate).
- `high_pressure_reactor_twin/software/viewer/sfx.js` — Upgraded to full Web Audio procedural synthesizer (relay click, variable-RPM motor whine, gas pressurization hiss, vent scream, burst blast, alarms).
- `high_pressure_reactor_twin/software/viewer/index.html` — Rewritten into Gold Standard UI shell with camera toolbar, collapsible controls, and live telemetry panels.

---

## 2026-09-25 · OGA-CAD & CBA · rebuild-vortex-mixer-twin-gold-standard

| Field   | Value                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | OGA-CAD (Master Orchestrator) & CBA (Centrifuge Build Architect)                                                                                                                                                                                                 |
| Machine | `vortex_mixer_twin`, `lab_viewer`, `workspace`                                                                                                                                                                                                                   |
| Intent  | Full Gold-Standard rebuild of the Vortex Mixer digital twin to Tier-1 Digital Precision laboratory parity (Scientific Industries Vortex-Genie 2 Digital class), eliminating the legacy 8.7 MB GLB with exhaustive procedural Three.js solids, pure Python state machine, dynamic forced-vortex fluid dynamics, and Gold Standard UI. |

### Created

- `vortex_mixer_twin/docs/PRODUCT_BRIEF.md` — Product brief & Tier-1 educational/GLP objectives.
- `vortex_mixer_twin/docs/STANDARD.md` — Normative package standard.
- `vortex_mixer_twin/software/viewer/sfx.js` — Web Audio procedural synthesizer (motor hum, switch snap, dial detents, tube chatter).
- `vortex_mixer_twin/software/viewer/vortex_mixer3d.js` — Exhaustive procedural Three.js model with eccentric orbital kinematics, DIN 912 fasteners, $2.0\text{ mm}$ recessed bezel pocket, canonical SRE brand badge, and real-time vertex-deformed liquid vortex.
- `vortex_mixer_twin/software/viewer/style.css` — Gold Standard layout stylesheet (`--bg: #0c1016`, collapsible panels).
- `.master/registry/vortex_mixer_twin_manifest.md` — Machine manifest for `vortex_mixer_twin`.
- `.master/logs/report_cards/2026-09-25_OGA-CAD_rebuild-vortex-mixer-twin.md` — Agent self-report card.

### Changed

- `vortex_mixer_twin/docs/dimensions.md` — Updated with 1:1 metric specs under Dimensional Freeze (Code 4771-CAD).
- `vortex_mixer_twin/docs/control_spec.md` — Added digital timer, pulse mode, and fluid mechanics equations.
- `vortex_mixer_twin/docs/BOM.md` — Updated with optical encoder dial, Canvas LCD, and 15 mL/1.5 mL tube accessories.
- `vortex_mixer_twin/software/controller/vortex_controller.py` — Pure Python state engine with ramping, timer, pulse, and viscosity calculations.
- `vortex_mixer_twin/software/controller/test_controller.py` — Expanded unit test suite (10/10 tests passing).
- `vortex_mixer_twin/software/viewer/index.html` — Rewritten into Gold Standard shell with camera toolbar and telemetry panels.
- `vortex_mixer_twin/software/viewer/app.js` — High-DPI CanvasTexture LCD (`flipY = false`), Raycaster interactions, and GLP logger.
- `lab_viewer/machines/registry.js` — Updated vortex_mixer entry with Digital Precision metadata.
- `.master/06_MACHINES/MACHINE_CATALOGUE.md` — Elevated status to Ready / Gold.
- `.master/registry/machines.md` — Promoted certification status to Gold (`yes`).
- `.master/logs/master_change_log.md` — this entry.

---

## 2026-09-25 · NBA & CBA · deep-implement-ph-meter-and-muffle-furnace-twins

| Field   | Value                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | NBA (New Build Agent) & CBA (Digital Twin Workforce)                                                                                                                                                                                                             |
| Machine | `ph_meter_twin`, `muffle_furnace_twin`, `vortex_mixer_twin`                                                                                                                                                                                                      |
| Intent  | Full production-grade implementation of the top-priority scaffolded twins: SREdesigns PH-7000 Pro Benchtop pH/mV Meter and SREdesigns THERMO-1200 High-Temperature Muffle Furnace, including pure procedural Three.js CAD models conforming to the Semantic Part Taxonomy, dynamic Canvas LCDs, comprehensive Python behavioral controllers with real physics (Nernst electrochemistry & Stefan-Boltzmann thermal radiation), full sound synthesis, and passing all unit tests with 0 cad_validator violations. |

### Created

- `ph_meter_twin/software/viewer/ph_meter3d.js` — Complete procedural Three.js CAD assembly for pH meter (sloped console unibody, 7" touchscreen LCD with flipY=false, capacitive membrane buttons, dual-pantograph articulated arm with tension springs, glass combination electrode with Ag/AgCl reference wire and sensing bulb, stainless ATC temperature probe rod, translucent 3M KCl wetting storage cap, 150 mL borosilicate beaker with dynamic fluid meniscus, calibration buffer bottles pH 4/7/10, wash bottle, rear BNC/ATC/DB9 connectors, leveling feet, and lab room environment).
- `muffle_furnace_twin/software/viewer/muffle_furnace3d.js` — Complete procedural Three.js CAD assembly for muffle furnace (ventilated dual-wall steel cabinet, 4-bar counterbalanced parallel-motion vertical lift door mechanism keeping 1100°C face away from operator, vacuum-formed ceramic fiber refractory muffle, SiC hearth tile plate, embedded FeCrAl resistance wire heating grooves, dynamic blackbody thermal glow mesh & PointLight scaling with temperature, exhaust chimney with slide damper, Eurotherm 3216 digital PID controller with dual 7-segment display, Al2O3 and Gooch porcelain crucibles, 450mm tongs, Kevlar gloves, leveling feet, and lab room environment).
- `muffle_furnace_twin/software/viewer/sfx.js` — Web Audio procedural sound synthesizer (heavy contactor clack, 60 Hz transformer hum, 4-bar linkage door glide, ceramic crucible clink, alarm buzzer).
- `.master/logs/report_cards/2026-09-25_NBA_deep-build-ph-meter-and-muffle-furnace.md` — Agent self-report card.

### Changed

- `ph_meter_twin/software/controller/ph_controller.py` — Upgraded behavioral controller with full Nernstian electrochemistry, temperature compensation, 2-point and 3-point buffer calibration routines, slope sanity checks (90-105%), sensor stability convergence, and telemetry.
- `ph_meter_twin/software/controller/test_controller.py` — Expanded unit test suite from 4 to 11 comprehensive tests covering all states, boundary conditions, temperature dependencies, and error interlocks.
- `ph_meter_twin/software/viewer/app.js` — Complete Gold Standard interactive application controller with dynamic Canvas LCD, Nernstian calculations, sound effects, sample/buffer swapping, and classroom demo workflow.
- `ph_meter_twin/software/viewer/sfx.js` — Upgraded procedural Web Audio synthesizer.
- `ph_meter_twin/software/viewer/index.html` & `style.css` — Upgraded to Gold Standard UI layout matching hotplate and spectrophotometer twins.
- `muffle_furnace_twin/software/controller/furnace_controller.py` — Upgraded behavioral controller with closed-loop PID thermal loop, Stefan-Boltzmann radiation, convective cooling losses, multi-segment ramp & soak profiles, instant door cutout safety interlock, over-temperature protection, and telemetry.
- `muffle_furnace_twin/software/controller/test_controller.py` — Expanded unit test suite from 4 to 11 comprehensive tests covering ramp/soak, door interlocks, PID power output, overtemp, and damper cooling.
- `muffle_furnace_twin/software/viewer/app.js` — Complete Gold Standard interactive application controller with dynamic Eurotherm LCD, Stefan-Boltzmann physics loop, 4-bar door kinematics, and classroom calcination demo.
- `muffle_furnace_twin/software/viewer/index.html` & `style.css` — Upgraded to Gold Standard UI layout matching hotplate and spectrophotometer twins.
- `vortex_mixer_twin/software/viewer/app.js` & `vortex_mixer3d.js` — Fixed Semantic Part Taxonomy node naming and object properties.
- `.master/logs/master_change_log.md` — this entry.

## 2026-09-25 · CBA · establish-centrifuge-subagent-guild

| Field   | Value                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | CBA (Centrifuge Build Architect) & OGA-CAD                                                                                                                                                                                                                       |
| Machine | `centrifuge_twin`, `workspace`                                                                                                                                                                                                                                   |
| Intent  | Formulate the 14-subagent Centrifuge Build Guild (`centrifuge_guild/`) with dedicated domain specialists covering housing, wiring, materials, LCD panel, labels, environment, controls, animation, research, UI, UX, lighting, accessories, and deliverables. |

### Created

- `.master/02_AGENT_WORKFORCE/centrifuge_guild/CENTRIFUGE_BUILD_ARCHITECT.md` — Lead agent profile for CBA.
- `.master/02_AGENT_WORKFORCE/centrifuge_guild/SUBAGENTS_ROSTER.md` — Complete roster & specifications for all 14 domain subagents.
- `.agent/workflows/build-centrifuge.md` & `.agents/workflows/build-centrifuge.md` — `/build-centrifuge` workflow.
- `scripts/maintenance/run_centrifuge_subagents.mjs` — Automated domain verification script.

### Changed

- `.master/DIRECTORY.md` — Registered Centrifuge Subagent Guild in workforce index.
- `.master/01_SYSTEM_DEFINITIONS/system/DOCUMENTATION_MANIFEST.json` — Registered new guild documents.
- `.master/logs/master_change_log.md` — this entry.

---

## 2026-09-25 · OGA-CAD · install-cmds-governance-architecture

| Field   | Value                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | OGA-CAD / ChemMate Systems Integration                                                                                                                                                                                                                          |
| Machine | `workspace`, `lab_viewer`, all 13 machine twins                                                                                                                                                                                                                  |
| Intent  | Install full ChemMate-parity CMDS numbered master architecture (`01_` through `07_`), OGA-CAD, SOA (Synthetic Operator Agent), SHAA-3D, CAD Governance (Code 4771-CAD), and automated compliance validator (`cad_validator.mjs`) without touching existing twins. |

### Created

- `.master/DIRECTORY.md` — Authoritative master directory index for all files, agents, and machines.
- `.master/INFORMATION_MAP.md` — Dependency ripple matrix for machine twins and CAD changes.
- `.master/01_SYSTEM_DEFINITIONS/core/PRODUCT_STRATEGY.md` — SRE digital twin product vision.
- `.master/01_SYSTEM_DEFINITIONS/system/ARCHITECTURE_BLUEPRINT.md` — Hybrid CAD-to-Web pipeline specification.
- `.master/01_SYSTEM_DEFINITIONS/system/TECH_STACK.md` — Standardized tooling, WebGL, and Python dependencies.
- `.master/01_SYSTEM_DEFINITIONS/system/DOCUMENTATION_MANIFEST.json` — Master file integrity registry.
- `.master/01_SYSTEM_DEFINITIONS/system/VERSION.md` — Application version registry.
- `.master/01_SYSTEM_DEFINITIONS/rules/CAD_GOVERNANCE.md` — 4771-CAD Dimensional Freeze, tabletop datum, anti-clipping rule.
- `.master/01_SYSTEM_DEFINITIONS/rules/CAD_AGENT_SOP.md` — 3-Phase SOP for all CAD and Web agents.
- `.master/01_SYSTEM_DEFINITIONS/rules/REPORT_CARD_TEMPLATE.md` — Performance self-assessment template.
- `.master/01_SYSTEM_DEFINITIONS/architecture/decisions/ADR_001_PROCEDURAL_THREEJS_OVER_STATIC_GLB.md` — Procedural geometry architecture decision.
- `.master/01_SYSTEM_DEFINITIONS/architecture/decisions/ADR_TEMPLATE.md` — ADR template.
- `.master/02_AGENT_WORKFORCE/agents/OGA_CAD.md` — OGA-CAD master controller profile.
- `.master/02_AGENT_WORKFORCE/agents/SOA.md` — Synthetic Operator Agent profile with 6-pillar diagnostics.
- `.master/02_AGENT_WORKFORCE/agents/SHAA_3D.md` — Self-Healing CAD agent profile and 15-step recovery pipeline.
- `.master/02_AGENT_WORKFORCE/agents/SHAA_CAD_FIXES_COMPENDIUM.md` — Fast-reference CAD & WebGL cookbook.
- `.master/02_AGENT_WORKFORCE/agents/WORKFORCE_MAP.md` — Cross-agent communication matrix.
- `.master/03_OPERATIONS/brain/POST_TASK_ANALYSIS_AND_IDEAS_DIGEST.md` — Long-term ideas and lessons learned.
- `.master/03_OPERATIONS/implementation_plans/CAD_IMPLEMENTATION_PLAN_TEMPLATE.md` — Standard machine twin implementation plan.
- `.master/04_ARCHIVE/ARCHIVE_MANIFEST.md` — Archive and cold storage registry.
- `.master/05_PERSONAL_MISC/tools/TOOLS_MANIFEST.md` — CLI utilities manifest.
- `.master/05_PERSONAL_MISC/tools/cad_validator.mjs` — Automated governance validator.
- `.master/06_MACHINES/MACHINE_CATALOGUE.md` — Catalogue of all 13 machine digital twins.
- `.master/07_TECHNICAL_RESEARCH/KNOWLEDGE_MANIFEST.md` — Central Knowledge Items index.
- `.master/07_TECHNICAL_RESEARCH/cad_governance_ki.md` — CAD governance KI.
- `.master/07_TECHNICAL_RESEARCH/procedural_cad_ki.md` — Procedural CAD KI.
- `.master/07_TECHNICAL_RESEARCH/materials_optics_ki.md` — Materials & optics KI.
- `.master/07_TECHNICAL_RESEARCH/kinematics_ki.md` — Kinematics KI.
- `.master/07_TECHNICAL_RESEARCH/web_runtime_ki.md` — Web runtime KI.
- `.agent/workflows/*` & `.agents/workflows/*` — Slash command executable runbooks (`/start`, `/plan`, `/run`, `/validate`, `/report`, `/debug`, `/orchestrate`, `/sync-master`).
- `scripts/maintenance/cad_validator.mjs` — Validator runner.
- `scripts/maintenance/twin_pulse.mjs` — Daily operational pulse runner.

### Changed

- `.master/logs/master_change_log.md` — this entry.

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
