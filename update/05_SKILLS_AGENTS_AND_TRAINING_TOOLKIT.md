# Skills, Subagent Architecture, Training Materials & Shared Implementation Toolkit

> **Phase Status:** Planning Only — no source files modified.
> **Purpose:** Central playbook cataloging every existing skill, 14-subagent puzzle role, workflow, training benchmark, shared hardware factory, engineering dossier, and automated QA/video script that implementation agents MUST leverage across Sprints 1–10.

---

## 1. The 14-Subagent Puzzle Architecture (Centrifuge Gold Standard)

Per [`.agents/AGENTS.md`](file:///Users/Samuel/AGapps/Twins/.agents/AGENTS.md) and [`.agents/SUBAGENT_PUZZLE_ROSTER.md`](file:///Users/Samuel/AGapps/Twins/.agents/SUBAGENT_PUZZLE_ROSTER.md), no single monolithic prompt builds an accredited digital twin alone. Every sprint track dispatches isolated specialists with strict file/domain ownership:

| # | Subagent Role | Domain Ownership | Primary Output & Gate Focus |
| :-: | :--- | :--- | :--- |
| **1** | `twin_spec_researcher` | OEM manuals, 1:1 CAD dimensions, BOM, physical equations | `docs/dimensions.md`, `docs/BOM.md` (Step 0 Research Gate) |
| **2** | `twin_chassis_builder` | Unibody housing, bevels, parting seams, recessed pockets, leveling feet at $Y=0$, `Badge_SREdesigns` | `Body_Chassis`, `Foot_Leveling_*`, zero wall clipping (DIAG-001, DIAG-016) |
| **3** | `twin_power_circuit_engineer` | Bench outlet `Power_Receptacle_Duplex`, NEMA plug, `Power_Cord_SJTOW`, internal `Assembly_PowerSupply`, color wiring, `isPluggedIn && switchOn` | Electrical continuity (DIAG-014, `PWR-01..04`, `BAY-04..05`) |
| **4** | `twin_sensor_data_engineer` | Tachometers, `Sensor_PT100` RTDs, microswitches, `Mirror_OpticalRelay`, rear RS-232/USB-B/RJ45/USB-A, GLP CSV export | Sensor feedback loops, telemetry (`INT-03`, `INT-04`) |
| **5** | `twin_display_silkscreen_engineer` | Dedicated `UI_LCD` inside pocket, `flipY = false`, upright UVs, protective `Glass_*`, unpowered blackout state, silkscreen legends | Upright decals (`UV-01..03`, DIAG-005, DIAG-015, DIAG-017) |
| **6** | `twin_controls_ergonomics_engineer` | Tactile `Btn_*`, knurled rotary knobs, multi-position switches, synchronized clockwise dial math, $\ge 3.5\text{ mm}$ bezel spacing | Ergonomic controls (DIAG-018, DIAG-021, `TAX-03`) |
| **7** | `twin_internal_mechanics_builder` | Drive/lift/pump motors (`Motor_Harmonic`, `Motor_Drive`, `Motor_Lift`), stator coils, dampers, `PCB_Motherboard`, $\ge +80\text{--}120\text{ mm}$ exploded lift | Internal anatomy & exploded separation (DIAG-020, `BAY-01..06`, `INT-01..02`) |
| **8** | `twin_environment_lighting_director` | Standard lab bench (`INSTRUMENT_BENCH`), room enclosure/backsplash, 3-point lighting, toolbar sliders (`Light`, `Mood`, `Zoom`, `Orbit`) | Calibrated lighting & `CAM_*` framing (DIAG-022, DIAG-026) |
| **9** | `twin_labware_fluid_specialist` | 1:1 flasks, Falcon/Eppendorf tubes, cryovials, baskets, natural tilts, dynamic parabolic vortex / fluid menisci | Authentic consumables & fluid dynamics (DIAG-019) |
| **10** | `twin_audio_sfx_synthesizer` | Procedural Web Audio synthesizer (`sfx.js`): motor harmonics scaling with RPM, fan/vacuum hum, mechanical detents, mute toggle | Zero external audio dependency, muted safely when unpowered |
| **11** | `twin_controller_logic_engineer` | Pure Python controller (`software/controller/<twin>_controller.py`) + unit suite (`test_controller.py`), mirrored in client JS (`app.js`) | 100% Python unit test pass, state interlocks, GLP CSV |
| **12** | `twin_web_ui_architect` | Gold Standard 3-panel collapsible UI (`<aside class="instrument panel-collapsible">`, `--bg: #0c1016`), Part Explorer (isolate & wireframe) | Zero UI drift from `centrifuge_twin` (Rule 6), zero console errors |
| **13** | `twin_visual_qa_auditor` | Preflight gate, CDP capture (`CAM_ISO`, `CAM_FRONT`, `CAM_SIDE`, `CAM_TOP`, `CAM_EXPLODED`, `STATE_ACTIVE` + Stage 7 internal close-ups), `view_file` audit | 25/25 `oga_validator.mjs`, `verify_twin.sh`, `Total exceptions: 0` |
| **14** | `twin_narrator_video_director` | Whisper-aligned audio / chapter stems (`docs/audio/vo_*.mp3`), `#btnGuidedTour` + `#tourOverlay`, 1080p H.264/AAC `.mp4` walkthrough | Gate 5 Presentation (`PRES-01`, `PRES-02`) |

### OGA 4-Phase Assembly Line Governance
Defined in [`.agents/OGA_TWINS.md`](file:///Users/Samuel/AGapps/Twins/.agents/OGA_TWINS.md):
- **Phase 1 — Architectural Design & Contract Freeze:** Lock dimensions, taxonomy names, and dual-truth controller equations before generating geometry. Enforce file-ownership locks (no subagent overwrites another domain's module silently) and obey the Forbidden Negative Checklist & Code 4771 freeze lock.
- **Phase 2 — Parallel Component Construction:** Subagents construct chassis, internal electronics bay, kinematics, labware, UI, and audio concurrently against the shared coordinate contract.
- **Phase 3 — Validation & The 5 Mechanical Gates:** Run [`scripts/oga_validator.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/oga_validator.mjs) enforcing all 25 assertions (`TAX-01..06`, `PWR-01..04`, `UV-01..03`, `BAY-01..06`, `INT-01..04`, `PRES-01..02`).
- **Phase 4 — 7-Stage + Stage-8 Walkthrough & Signoff:** Document all 7 operational/internal stages with CDP screenshots inspected via `view_file`, plus deliver Stage 8 in-app tour and 1080p MP4 video.

---

## 2. Workspace & Global Domain Skills

Implementation agents MUST read and follow the relevant `SKILL.md` prior to coding in any sprint:

| Skill Name | Path | When Mandatory During Sprints 1–10 |
| :--- | :--- | :--- |
| **`piecewise-3d-cad`** | [`.agents/skills/piecewise-3d-cad/SKILL.md`](file:///Users/Samuel/AGapps/Twins/.agents/skills/piecewise-3d-cad/SKILL.md) | Every procedural Three.js / Blender CAD module (`*3d.js`): boolean/recessed pockets, fasteners, chambers, bevels, and `Body_Wire_*` spline geometry. |
| **`procedural-materials`** | [`.agents/skills/procedural-materials/SKILL.md`](file:///Users/Samuel/AGapps/Twins/.agents/skills/procedural-materials/SKILL.md) | Powder-coat steel, anodized aluminum, borosilicate optical `MeshPhysicalMaterial` (`IOR = 1.52`), cryogenic frost shaders, canvas LCD textures (`flipY = false`). |
| **`spatial-coordinates-and-targets`** | [`spatial-coordinates-and-targets/SKILL.md`](file:///Users/Samuel/.gemini/config/skills/spatial-coordinates-and-targets/SKILL.md) | All camera targets, OrbitControls setup, right-handed world axes, operator line-of-sight, upright UV orientation, and kinematic hinge/pivot sign rules. |
| **`twin-visual-qa`** | [`.agents/skills/twin-visual-qa/SKILL.md`](file:///Users/Samuel/AGapps/Twins/.agents/skills/twin-visual-qa/SKILL.md) | Every sprint signoff: launching local server, capturing all 6 canonical angles + active states via CDP, inspecting every PNG via `view_file`. |
| **`twin-voiceover-video-pipeline`** | [`.agents/skills/twin-voiceover-video-pipeline/SKILL.md`](file:///Users/Samuel/AGapps/Twins/.agents/skills/twin-voiceover-video-pipeline/SKILL.md) | Sprint 1 Gate-5 finishes and every subsequent machine walkthrough (`#btnGuidedTour` + `docs/*_Social_Walkthrough.mp4`). |

---

## 3. Built-In Workflows (`.agents/workflows/`)

Standardized execution playbooks ready in [`.agents/workflows/`](file:///Users/Samuel/AGapps/Twins/.agents/workflows):
- [`design-twin.md`](file:///Users/Samuel/AGapps/Twins/.agents/workflows/design-twin.md) — End-to-end machine design choreography from research through 3D + controller scaffolding.
- [`orchestrate.md`](file:///Users/Samuel/AGapps/Twins/.agents/workflows/orchestrate.md) — Multi-subagent dispatch orchestration across the 14-agent puzzle team.
- [`verify-twin.md`](file:///Users/Samuel/AGapps/Twins/.agents/workflows/verify-twin.md) & [`validate.md`](file:///Users/Samuel/AGapps/Twins/.agents/workflows/validate.md) — Running static syntax, OGA linter, controller tests, and multi-angle CDP screenshot checks.
- [`generate-voiceover-video.md`](file:///Users/Samuel/AGapps/Twins/.agents/workflows/generate-voiceover-video.md) — Audio stem slicing (`say` / Gemini TTS / uploaded audio + Whisper alignment) and automated Chrome CDP 1080p video recording.
- Supporting workflows: `build-centrifuge.md` (reference build log), `debug.md`, `plan.md`, `report.md`, `run.md`, `start.md`, `sync-master.md`.

---

## 4. Built-In Agent Training Materials & Benchmark Tests

### 4.1 The 10-Plane Orientation & Physical Steel Nail Benchmark (`training/training_date/`)
- **Files:** [`training/training_date/index.html`](file:///Users/Samuel/AGapps/Twins/training/training_date/index.html) and [`training/training_date/orientation_test.js`](file:///Users/Samuel/AGapps/Twins/training/training_date/orientation_test.js)
- **What It Solves:** Eliminates inverted, mirrored, sideways, or inward-facing LCD displays, silkscreen decals, gauges, and switches on front, rear, left, right, sloped console, and lid faces (`DIAG-005`, `DIAG-015`, `UV-01..03`).
- **Key Calibration Helpers Inside `orientation_test.js`:**
  - `createUniversalDecalQuad(width, height, normal, upHint, title, sub, angleText)` — Programmatically constructs a decal quad from any surface normal and `upHint`, guaranteeing legible top-to-bottom / left-to-right text without negative scale hacks.
  - `createPhysicalNail()` (`Assembly_Nail`) — Physical stainless steel calibration nail (`|──▶`) anchored across **10 test planes** so agents visually verify outward normal direction and exact seating gap before committing decal/control planes on any twin.
- **How Sprints Utilize It:** Mandatory regression sanity check whenever building sloped consoles (`ph_meter_twin`, `karl_fischer_twin`, `ultrasonic_cleaner_twin`, `rotovap_twin`) or side/rear data plates (`lab_freezer_twin`, `sem_twin`).

### 4.2 Guilds, SOPs, Governance & Engineering Memory
- **`.agents/` Engineering Memory:**
  - [`.agents/LESSONS_LEARNED.md`](file:///Users/Samuel/AGapps/Twins/.agents/LESSONS_LEARNED.md) — Accreditation benchmark notes, Step 0 Research Protocol, exact `makeOperatorFacingQuadGeo` implementation math, and circuit-continuity rules.
  - [`.agents/MASTER_PREFLIGHT_CHECKLIST.md`](file:///Users/Samuel/AGapps/Twins/.agents/MASTER_PREFLIGHT_CHECKLIST.md) — 12-category preflight signoff matrix (including elevated ceiling `DIAG-026`, pockets, internal PSU/comms, optical relays, and 6-view CDP QA).
  - [`.agents/TROUBLESHOOTING_LOG.md`](file:///Users/Samuel/AGapps/Twins/.agents/TROUBLESHOOTING_LOG.md) — Historical bug registry (`DIAG-001` through `DIAG-026`) and mandatory 10-point (`CHK-01..10`) verification log.
- **`.master/` Operations, Guilds & Catalogs:**
  - Core guides: [`HOW_TO_BUILD_A_MACHINE.md`](file:///Users/Samuel/AGapps/Twins/.master/HOW_TO_BUILD_A_MACHINE.md), [`AGENTS_MANDATE.md`](file:///Users/Samuel/AGapps/Twins/.master/AGENTS_MANDATE.md), [`AGENT_SOP.md`](file:///Users/Samuel/AGapps/Twins/.master/AGENT_SOP.md), [`INFORMATION_MAP.md`](file:///Users/Samuel/AGapps/Twins/.master/INFORMATION_MAP.md), [`DIRECTORY.md`](file:///Users/Samuel/AGapps/Twins/.master/DIRECTORY.md), [`MANIFEST.md`](file:///Users/Samuel/AGapps/Twins/.master/MANIFEST.md).
  - Subdirectories: `.master/01_SYSTEM_DEFINITIONS/`, `.master/02_AGENT_WORKFORCE/` (notably `centrifuge_guild/` and `vortex_guild/` — directly instructive for our Sprint 5 Vortex rebuild!), `.master/03_OPERATIONS/`, `.master/04_ARCHIVE/` (target archive destination for `vortex_mixer_genie2_v1`), `.master/06_MACHINES/` (`MACHINE_CATALOGUE.md`, `CURRICULUM_LABS_AND_EQUIPMENT_ROADMAP.md`, `LAB_WORKFLOWS_AND_MACHINE_FUNCTIONALITY_SPEC.md`), `.master/07_TECHNICAL_RESEARCH/`, `.master/agents/`, `.master/governance/`, `.master/logs/`, `.master/registry/machines.md`, `.master/templates/`.
- **Master Facility & Equipment Dossiers (`docs/`):**
  - [`docs/PHARMACEUTICAL_LAB_EQUIPMENT_MASTER_DOSSIER.md`](file:///Users/Samuel/AGapps/Twins/docs/PHARMACEUTICAL_LAB_EQUIPMENT_MASTER_DOSSIER.md) — OEM specs for all Wave B/C/D instruments.
  - [`docs/PHARMACEUTICAL_LAB_FACILITY_ARCHITECTURE_DOSSIER.md`](file:///Users/Samuel/AGapps/Twins/docs/PHARMACEUTICAL_LAB_FACILITY_ARCHITECTURE_DOSSIER.md) — 12,000 GSF floor plan (`Z-01..Z-10`), `11'-0"` planning grid, SEFA 8M casework standards, vibration isolation (`VC-D`/`VC-E`), and ULT freezer emergency power spec.

---

## 5. Shared Procedural Hardware Library (`lab_viewer/shared/hardware_library.js`)

Instead of reinventing common mechanical fasteners, electrical inlets, and UV-safe decals per twin, every build and remediation imports directly from [`lab_viewer/shared/hardware_library.js`](file:///Users/Samuel/AGapps/Twins/lab_viewer/shared/hardware_library.js):

| Exported Factory | Mechanical / Optical Use in Sprints 1–10 |
| :--- | :--- |
| `createHexSocketScrew` | Genuine 3D SHCS screws with hexagonal socket recess for brackets, pump heads, PSU enclosures, and manifold collars (`TAX-05`, Rule 1). |
| `createWasher` | Split lock & flat stainless washers seated flush beneath every structural fastener (`TAX-05`). |
| `createVibrationFoot` | Vulcanized rubber/knurled leveling feet grounded strictly at $Y = 0$ local datum (`Foot_Leveling_*`, `TAX-06`). |
| `createIECInlet` | Recessed rear C14 3-prong AC power entry socket (`PWR-02`). |
| `createBNCJack` | Coaxial BNC panel jack — critical for `ph_meter_twin` electrode inputs, `potentiostat_twin`, and `radiation_detector_twin`. |
| `createDB9Port` | Machined D-sub 9-pin RS-232 serial bulkhead connector (`BAY-06`). |
| `createRockerSwitch` | Two-position illuminated/beveled main power rocker switch with synchronized angle kinematics (`PWR-02`, DIAG-021). |
| `createDecalQuad` | Standardized upright UV decal generator preventing mirrored/upside-down canvas text (`UV-01..03`, DIAG-005). |

**Facility Engine Modules (`lab_viewer/`):** [`LabCasework.js`](file:///Users/Samuel/AGapps/Twins/lab_viewer/engine/LabCasework.js) & [`LabDockManager.js`](file:///Users/Samuel/AGapps/Twins/lab_viewer/engine/LabDockManager.js) govern benchtop (`BENCH_Y = 0.90`) and floor (`Y = 0.0`) placement across Workstations 1–8.

---

## 6. Automated Validation, Verification & Video Toolchain (`scripts/`)

| Script | Command & Role During Execution |
| :--- | :--- |
| [`scripts/oga_validator.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/oga_validator.mjs) | `node scripts/oga_validator.mjs <twin_dir>` — Runs all **25 mechanical gates** across Gates 1–5 (`TAX-01..06`, `PWR-01..04`, `UV-01..03`, `BAY-01..06`, `INT-01..04`, `PRES-01..02`). |
| [`scripts/verify_twin.sh`](file:///Users/Samuel/AGapps/Twins/scripts/verify_twin.sh) | `bash scripts/verify_twin.sh <twin_dir>` — Verifies directory structure, ES module syntax via Node `vm.SourceTextModule`, cache-busting `?v=`, and `makeSREdesignsBadge`. |
| [`scripts/serve.sh`](file:///Users/Samuel/AGapps/Twins/scripts/serve.sh) | Launches clean local HTTP server (`127.0.0.1:8765`) for headless Chromium CDP visual audits. |
| [`scripts/build_twin_video.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/build_twin_video.mjs) | One-command pipeline invoking [`scripts/process_voiceover_audio.py`](file:///Users/Samuel/AGapps/Twins/scripts/process_voiceover_audio.py) (chapter audio slicing) + [`scripts/generate_walkthrough_video.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/generate_walkthrough_video.mjs) (1080p H.264/AAC MP4 capture via Chrome CDP + `say`/`ffmpeg`). |
| [`scripts/synthesize_gemini_tts.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/synthesize_gemini_tts.mjs) & [`.py`](file:///Users/Samuel/AGapps/Twins/scripts/synthesize_gemini_tts.py) | Optional Gemini TTS voiceover narration generation when bespoke studio voice stems are requested. |
| [`scripts/audit_lab.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/audit_lab.mjs), [`audit_wire_console_fixes.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/audit_wire_console_fixes.mjs), [`audit_zt322_upgrade.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/audit_zt322_upgrade.mjs) | Reusable headless CDP audit harnesses for verifying live WebGL scenes, zero console errors, and multi-angle screenshots. |
| [`scripts/capture_showcase.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/capture_showcase.mjs) & [`scripts/test_mobile_lab.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/test_mobile_lab.mjs) | High-resolution showcase screenshot exporter and responsive mobile layout tester for `lab_viewer`. |
