# Conversation log

Newest first. Template: `templates/conversation_log_entry.md`.

---

## 2026-10-18 · OGA-UI & SRE-TWIN · lab-viewer-view-chooser-integration

| Field   | Value                                                              |
| ------- | ------------------------------------------------------------------ |
| Agent   | OGA-UI & SRE-TWIN                                                  |
| Machine | `lab_viewer`, `centrifuge_twin`, `workspace`                       |

### User request (paraphrase)

The user instructed: *"lets add it"*, approving the incorporation of the new View Chooser system across the platform.

### Decisions

1. **Master Desk Integration (`lab_viewer`)**:
   - Integrated the `.view-chooser` segmented control (`MODERN`, `+ RETRO`, `☾ NIGHT`) directly into the master topbar of `lab_viewer`.
   - Applied comprehensive CSS styling for `body[data-theme="retro"]` and `body[data-theme="night"]` to the `lab_viewer` shell (topbar, machine picker dropdown, status pill, switch notification banner, and footer hint).
   - Added dynamic restyling to the 3D desk transition scene (`transition_scene.js`) so that inter-machine switches honor the active theme's lighting and background ambiance.
2. **Bidirectional Parent-Iframe Theme Synchronization**:
   - Implemented real-time postMessage communication (`SET_THEME`) and direct API dispatch (`CentrifugeTwin.setTheme`) between `lab_viewer` and loaded twins, allowing instant live restyling without reloading the iframe.
   - Added URL query parameter propagation (`?theme=modern|retro|night`) and `localStorage` persistence so that machine switching and page reloads always preserve the user's selected aesthetic.
3. **Automated CDP Visual Verification**:
   - Executed headless Chrome CDP verification (`scratch/test_lab_viewer_themes.js`) across all 4 operational states (`lab_view_01_modern.png`, `lab_view_02_retro.png`, `lab_view_03_night.png`, `lab_view_04_modern_return.png`).
   - Confirmed 0 browser console errors and 0 exceptions.
   - Performed closed-loop visual audits of all screenshots via `view_file`.

### Outcomes

- `bash scripts/verify_twin.sh centrifuge_twin`: PASSED (0 syntax errors).
- `python3 -m unittest discover -s centrifuge_twin/software/controller`: PASSED (14/14 tests OK).
- Automated CDP audit of `lab_viewer`: PASSED with 0 console errors.
- Visual artifacts saved and verified:
  - `lab_view_01_modern.png` (Modern View default)
  - `lab_view_02_retro.png` (Retro ChemMate View with Archival Diagram Plate)
  - `lab_view_03_night.png` (Night Precision View with Red and Charcoal)
  - `lab_view_04_modern_return.png` (Zero-regression return to Modern)
- All master change logs and governance records updated.

### Open questions for human

None. The View Chooser is fully integrated and operational across `centrifuge_twin` and `lab_viewer`.

---

## 2026-10-18 · OGA-UI & SRE-TWIN · view-chooser-modern-retro-night

| Field   | Value                                                              |
| ------- | ------------------------------------------------------------------ |
| Agent   | OGA-UI & SRE-TWIN                                                  |
| Machine | `centrifuge_twin`, `workspace`                                     |

### User request (paraphrase)

The user expressed strong appreciation for the ChemMate visual style ("It looks great can we add a view chooser I really like the style. Looks great.") and requested:
1. Add a dedicated "view chooser".
2. Add "Modern" view (the sleek default lab look).
3. Designate the warm archival paper style as "Retro" view.
4. Add a "Night" view: a reverse style of dark greys, deep blacks, and precision Swiss reds.

### Decisions

1. **Unified View Chooser Control**: Built a high-DPI segmented control (`.view-chooser`) in the header toolbar featuring three distinct view options:
   - `MODERN`: Sleek, clean, default high-tech instrument theme (`--bg: #0c1016`, cyan accents, neutral studio lighting).
   - `+ RETRO`: ChemMate archival cream paper (`#F2ECE1`, `#FBF9F4`), Swiss Red (`#D62828`), ink-black rules, corner `+` registration marks, and educational diagram cards.
   - `☾ NIGHT`: Reverse style featuring deep blacks (`#0a0c10`), dark charcoal obsidian panels (`#11151c`, `#161b24`), glowing Swiss red accents (`#ff3344`, `#d62828`), red metallic paperclip, dark telemetry cards, and glowing red leader lines.
2. **Dynamic 3D Stage & Callouts across Retro and Night**: Enabled the Diagram Plate and Lab Room backdrops for both Retro and Night views. In Night View, the benchtop island is styled as an obsidian black drafting slate (`0x111317`), while the dynamic SVG leader lines glow in vibrant red (`#ff3344`) with outer focus halos.
3. **Nocturnal Lighting Profile (`LIGHT_MOODS.night`)**: Engineered dedicated nocturnal lighting with moody dark shadow fill, dark ruby rim lighting (`0x3d141c`), and crisp specular highlights.
4. **Zero Regression Guarantee**: Retained complete backward compatibility with `modern` view and existing JavaScript APIs (`window.CentrifugeTwin.setTheme`), verified via multi-step automated CDP testing.

### Outcomes

- `bash scripts/verify_twin.sh centrifuge_twin`: PASSED (0 syntax errors).
- `python3 -m unittest discover -s centrifuge_twin/software/controller`: PASSED (14/14 tests OK).
- Automated visual audit script (`scratch/audit_view_chooser.js`) executed via Chrome CDP: captured all 7 view states (`view_01_modern.png` through `view_07_return_to_modern.png`).
- Total browser console exceptions: 0.
- All screenshots audited and verified via `view_file`.

### Open questions for human

None. Ready for user exploration across Modern, Retro, and Night views.

---

## 2026-10-17 · OGA-UI & SRE-TWIN · chemmate-retro-educational-view-style

| Field   | Value                                                              |
| ------- | ------------------------------------------------------------------ |
| Agent   | OGA-UI & SRE-TWIN                                                  |
| Machine | `centrifuge_twin`, `workspace`                                     |

### User request (paraphrase)

The user requested a visual test for a new style site for ChemMate, where digital twin lab tools will be used in an educational research and learning lab. The visualizer needed to match reference photos of the site featuring a warm, retro-educational aesthetic (archival cream paper `#F2ECE1`/`#FBF9F4`, Swiss red `+` branding, ink-black rules, numbered worksheet panels, metallic paperclip cards, sample layer callouts, and clean physics cards). The user explicitly specified: *"I don’t want to replace but create a different additional view style a bit like enhanced light and dark mode"* and mandated: *"There should be a master change log"*.

### Decisions

1. **Non-Destructive Dual-Theme Architecture**: Engineered the ChemMate style as an additional selectable mode (`body[data-theme="chemmate"]`) via an intuitive topbar switcher (`Dark Lab` ↔ `+ ChemMate Style`), preserving 100% of the Gold Standard dark lab CSS tokens and Three.js PBR materials when returning to default.
2. **Dual 3D Stage Environments**:
   - **Archival Diagram Plate**: Culls distant room walls to render a technical textbook plate with corner `+` registration crosshairs, header label (`+ 03 | MICRO 5424-R`), sample fractions legend box (`#cm-legend-box`), and paperclipped sedimentation physics card (`.cm-equation-card`).
   - **Warm Lab Room**: Renders the complete 3D laboratory enclosure with cream/travertine walls, warm daylight studio lighting (`LIGHT_MOODS.chemmate`), and warm ambient fill.
3. **Physical Continuity & Bench Grounding Preservation (DIAG-014 / Rule 9)**: Preserved the central instrument table island (`Lab_BenchTop_Instrument`), legs, and benchtop duplex utility box (`Power_Receptacle_Duplex`) across all modes, restyling the bench surface to a high-contrast dark slate drafting plate (`#1d2127`) so the centrifuge and molded NEMA 5-15P plug remain grounded at datum $Y = 0$.
4. **Dynamic 3D-to-2D Real-Time Projection Engine**: Implemented `updateChemMateCallouts()` in `app.js`. Rather than static overlays, the engine dynamically projects 3D mesh world matrices through the camera matrix every frame, drawing SVG leader lines (`#cm-callouts-svg`) connecting 3D part anchor dots to editorial text cards across user orbiting, panning, lid opening, and kinematic explosion.
5. **Master Governance & Verification**: Updated `.master/logs/master_change_log.md`, added `DIAG-030` to `.master/logs/troubleshooting_log.md`, executed automated CDP visual audits across 5 viewpoints with 0 console errors, and ran controller regression unit tests (14/14 pass).

### Outcomes

- `bash scripts/verify_twin.sh centrifuge_twin`: PASSED (0 syntax errors).
- `python3 -m unittest discover -s centrifuge_twin/software/controller`: PASSED (14/14 tests OK).
- Automated visual audit script (`scratch/audit_chemmate.js`) captured all 5 viewpoints via Chrome CDP. All reviewed via `view_file` with 0 console exceptions.
- Master change log, troubleshooting log (`DIAG-030`), and conversation log fully synchronized.

### Open questions for human

None. Ready for user visual review.

---

## 2026-09-25 · OGA-CAD & CBA · rebuild-vortex-mixer-twin

| Field   | Value                                                              |
| ------- | ------------------------------------------------------------------ |
| Agent   | OGA-CAD & CBA                                                      |
| Machine | `vortex_mixer_twin`, `lab_viewer`, `workspace`                     |

### User request (paraphrase)

The user noted the installation of the Centrifuge Guild and ChemMate test harness, asked what machine was next, and selected the Vortex Mixer (`vortex_mixer_twin`) for a full rebuild to Gold Standard. The user confirmed designing the Digital Precision configuration (Vortex-Genie 2 Digital / IKA MS 3 Digital class) appropriate for highest-level Tier-1 chemistry research and GLP/GMP laboratory use.

### Decisions

1. **Digital Precision Specification**: Configured the machine with a heavy cast zinc unibody ($122\times 165\times 165\text{ mm}$, Dimensional Freeze Code 4771-CAD) and 4 vulcanized suction feet at Tabletop Datum $Y = 0$, augmented with a digital optical encoder dial ($500\text{--}3200\text{ RPM}$), digital countdown timer ($1\text{ s}$ to $3600\text{ s}$), programmable pulse agitation ($2\text{ s}$ on / $1\text{ s}$ off), and dynamic CanvasTexture LCD (`flipY = false`).
2. **Real-Time Forced Vortex Mechanics**: Replaced static fluid models with real-time vertex-deforming liquid mesh simulating Navier-Stokes forced vortex parabolic depression ($z(r) \propto \omega^2 r^2 / 2g$) with dynamic viscosity damping for Water, Ethanol, 50% Glycerol, Cell Lysate, and Blood.
3. **Decoupled Controller State Machine**: Wrote pure Python controller (`vortex_controller.py`) with motor inertia ramping, thermal accumulation, and 100% unit test coverage (`test_controller.py`, 10/10 tests passing).
4. **Web Audio Soundscape**: Wrote procedural audio synthesizer (`sfx.js`) generating motor vibration hum, AC stator buzz, mechanical toggle switch snaps, dial detents, and tube contact chatter.
5. **Gold Standard Layout**: Upgraded `index.html` and `style.css` to strict Centrifuge Gold Standard parity with collapsible panels, camera presets (`CAM_ISO`, `CAM_FRONT`, `CAM_SIDE`, `CAM_TOP`), and GLP batch audit trail logger.

### Outcomes

- `bash scripts/test.sh` passed 10/10 unit tests.
- `bash scripts/verify_twin.sh vortex_mixer_twin` passed with 0 syntax errors.
- `node scripts/maintenance/twin_pulse.mjs` passed with 12 passes and 0 notices.
- `node .master/05_PERSONAL_MISC/tools/cad_validator.mjs` passed with 0 violations.
- Elevated `vortex_mixer_twin` to Gold Standard (`yes`) in `.master/registry/machines.md` and `lab_viewer/machines/registry.js`.

---

## 2026-09-24 · NBA · build-spectrophotometer-twin

| Field   | Value                  |
| ------- | ---------------------- |
| Agent   | NBA / 5-Agent Pipeline |
| Machine | `spectrophotometer_twin`|

### User request (paraphrase)

The user asked: "Let’s try out a new build what machine comes next?" followed by "Proceedc" to initiate the build.

### Decisions

1. **Next Machine Identification**: Identified the UV-Vis Spectrophotometer (`spectrophotometer_twin`) as the explicit next planned machine in `lab_viewer/machines/registry.js` and foundational project blueprints.
2. **5-Agent Hybrid CAD-to-Web Pipeline**: Executed MDRA (Research, BOM, Dimensions, Specs), CAD-BA / WEB-BA (Procedural Three.js 3D solids, Web Audio synthesis, Dynamic LCD Canvas, Python controller and unit tests), VQA (Test execution), and LIA (Master lab desk integration).
3. **Exhaustive Procedural Detail**: Modeled the unibody chassis, recessed bezel with 22° tilt, spring-hinged chamber lid with microswitch safety interlock, 6-cell motorized carousel, refractive quartz/glass optical cuvettes, dynamic monochromatic probe light beam that color-shifts with wavelength, Deuterium & Tungsten lamp housings, DIN 912 screws, DIN 125 washers, leveling feet, and rear bulkhead ports.
4. **Deterministic Physics**: Simulated Beer-Lambert law ($A = \varepsilon b c$), $100\% \to 0\%$ transmittance, Gaussian absorption profiles for standard reagents (Water blank, $KMnO_4$, DNA, Bradford BSA, Methylene blue), continuous wavelength spectrum scanning, and auto-zero baseline blanking.

### Outcomes

- Fully functional, interactive Gold-Standard `spectrophotometer_twin` package created.
- 100% passing controller unit test suite (`./scripts/test.sh`).
- Master lab desk picker updated to load `spectrophotometer` as an active twin on the desk.
- Manifest and registry documentation complete.

### Open questions for human

None.

---

## 2026-07-29 · NBA · rebuild-vacuum-pump-cad

| Field   | Value            |
| ------- | ---------------- |
| Agent   | NBA              |
| Machine | vacuum_pump_twin |

### User request (paraphrase)

User forcefully requested to abandon any "efficiency" abstractions, citing that the twin must be a "full CAD design" representing "every screw, every washer". The user explicitly directed me to enforce this standard in the workspace rules and to implement it.

### Decisions

1. **Workspace rules update**: Added a strict requirement to `AGENTS.md` and `rules.md` that all twins must be procedurally modeled to exhaustive, component-level fidelity.
2. **Procedural Rewrite**: Abandoned the initial generic mockup and rewrote `vacuum_pump3d.js` to procedurally generate the stator, rotor, cams, head stacks, diaphragms, poppet valves, and housing with accurate dimensions.

### Outcomes

- `vacuum_pump3d.js` completely rewritten.
- `index.html` updated to perfectly align with the gold standard.
- User mandate formally codified in governance files.

### Open questions for human

None.



## 2026-07-29 · OGA · plan-vacuum-pump-rebuild

> **🔑 KEY TOPIC: VACUUM PUMP REBUILD — PLANNING SESSION + HANDOFF DOCUMENT**

| Field   | Value            |
| ------- | ---------------- |
| Agent   | OGA              |
| Machine | vacuum_pump_twin |

### User request (paraphrase)

User requested a full from-scratch rebuild of the vacuum pump digital twin, acting as OGA per `.master/agents/OGA.md`,
following the `/plan` workflow. Instructed the agent to read the `.master/` directory (agent files, logs, templates,
governance) and all existing vacuum pump research to understand the full framework before planning.

A second request asked for a handoff context document so that if usage runs out, a new agent (Gemini or other) can be
pointed to the right files to quickly gather the same context.

### Decisions

> **🔑 KEY TOPIC: CRITICAL DECISIONS MADE**

1. **Procedural Three.js replaces GLB runtime** — The existing 1674-line monolithic `index.html` loads an 8.7 MB GLB.
   This is the exact anti-pattern documented in `centrifuge_twin/docs/PIPELINE.md` Stage 1. The rebuild will use
   procedural geometry following the gold-sample centrifuge pattern.
2. **Controller rewrite before viewer** — The existing Python controller (52 lines, 4 states, 2 tests) is insufficient.
   Per `HOW_TO_BUILD_A_MACHINE.md` §4: "Controller before chrome."
3. **Research is preserved** — All 9 downloaded files, 5 created reference docs, and docs/BOM.md, dimensions.md are high
   quality and complete. The rebuild only touches `software/` and adds scaffold docs.
4. **Modular viewer structure** — Following centrifuge: `index.html` (shell) + `style.css` + `app.js` +
   `vacuum_pump3d.js` + `sfx.js`.
5. **Handoff document created** — `vacuum_pump_twin/docs/HANDOFF_CONTEXT.md` contains the full context map, ordered
   reading list, and quick-start instructions for any agent picking up this work.

### Outcomes

- Implementation plan created (6 phases, 13 steps) — awaiting user approval
- Handoff context document created at `vacuum_pump_twin/docs/HANDOFF_CONTEXT.md`
- No code was modified — planning only
- Change log and conversation log updated with KEY TOPIC markers

### Open questions for human

> **🔑 KEY TOPIC: ALL 4 OPEN QUESTIONS RESOLVED**

| #   | Question              | User Answer / Resolution                                                                                                    |
| --- | --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | Speed control?        | "As much functionality as a real lab would need" → Include 1500–3000 RPM speed dial                                         |
| 2   | Vacuum gauge display? | "Both" → Analog Bourdon canvas texture + digital readout in UI                                                              |
| 3   | Demo loop scenario?   | "Steps a student learning about this instrument would find useful" → Educational demo with annotations                      |
| 4   | Maintenance trainer?  | "Research is in hopes of gaining understanding about all individual parts" → Exploded assembly view labeling every BOM part |

> **🔑 KEY TOPIC: 10 RECURRING PITFALLS EXTRACTED FROM PAST BUILDS**
>
> 1. Button/key labels facing backwards (+Z instead of −Z)
> 2. Machine orientation wrong (front panel not facing camera)
> 3. Camera zoom doesn't frame entire machine + accessories
> 4. LCD/display/gauge panels facing wrong direction
> 5. Generic placeholder materials instead of spec-accurate colors
> 6. Openings/cavities missing (instruments look like solid blocks)
> 7. Accessories don't fit on the lab bench
> 8. Moving parts not animated (static when they should move)
> 9. No button glow feedback on press/hover
> 10. Dead event listeners crashing JS after UI changes

### Outcomes

- Detailed part specifications document created at `vacuum_pump_twin/docs/PART_SPECIFICATIONS.md` detailing every
  washer, screw, shim, spacer, and spring rate from manuals.
- Manifest file created at `.master/registry/vacuum_pump_twin_manifest.md` to track the rebuild.
- Implementation plan updated with resolved questions and pitfalls.
- Handoff context document updated.

### Links

- Report card: Planning-only session; deferred to execution session
- Change log: `2026-07-29 · OGA · plan-vacuum-pump-rebuild`
- Handoff: `vacuum_pump_twin/docs/HANDOFF_CONTEXT.md`
- Part Specs: `vacuum_pump_twin/docs/PART_SPECIFICATIONS.md`
- Manifest: `.master/registry/vacuum_pump_twin_manifest.md`

---

## 2026-07-27 · OGA · fix-ultrasonic-details

| Field   | Value                   |
| ------- | ----------------------- |
| Agent   | OGA                     |
| Machine | ultrasonic_cleaner_twin |

### User request (paraphrase)

The user requested three specific fixes for the ultrasonic cleaner: the wire basket was hanging off the edge of the
table, the 3D buttons were backwards (the text was rendered on the inside of the machine), and the colored keys and
arrow buttons needed to glow physically while depressed by the user.

### Decisions

- Elongated the shared `INSTRUMENT_BENCH.sx` geometry from 6.6 to 9.6 in `centrifuge3d.js` so that the machine and its
  basket easily fit on the table without hanging off the edge. This provides more workspace for both machines.
- Fixed the button label orientation by applying `mesh.rotation.y = Math.PI` to the `BoxGeometry` mesh within the
  `makeKey` builder function in `ultrasonic3d.js`. This successfully flipped the mapped texture +Z face to point
  outwards toward the user.
- Addressed the lack of feedback on button presses by adding DOM listeners (`mousedown`, `mouseup`, `mouseleave`) in
  `app.js` to populate a new `state.pressed` dictionary. The `animateLoop` was updated to read this dictionary to apply
  `emissiveIntensity = 4.0` to the corresponding 3D keys. Added CSS `:active` styling in `style.css` so the UI keys also
  glow in the browser.

### Outcomes

- The ultrasonic cleaner UI/UX and 3D visual fidelity are vastly improved.
- The basket comfortably rests on the bench.
- All controls accurately report clicks via immersive glowing.

### Open questions for human

- None.

### Links

- Report card: `logs/report_cards/2026-07-27_OGA_fix-ultrasonic-details.md`
- Change log: `2026-07-27 · OGA · fix-ultrasonic-details`

---

## 2026-07-27 · OGA · fix-ultrasonic-issues

| Field   | Value                   |
| ------- | ----------------------- |
| Agent   | OGA                     |
| Machine | ultrasonic_cleaner_twin |

### User request (paraphrase)

The user requested fixes for the ultrasonic cleaner twin: the nameplate was hanging off the edge, UI button colors and
layout were dysfunctional, buttons didn't light up like the centrifuge, material samples needed to be loaded into the
basket, and the basket's positions when unloaded and lowered into the bath were physically inaccurate. Also requested a
`/run` workflow and completion of all OGA master logs.

### Decisions

- Used flexbox to reorganize the UI layout in `index.html` and applied CSS for active state lighting on buttons.
- Mathematically determined precise offsets relative to the machine (`DECK_Y`, `BASIN_FLOOR_Y`, etc.) for positioning
  the basket so it sits correctly on the lab bench (`X=3.0`, `Y=-0.95`, `Z=0`) and rests perfectly on the basin rim
  (`Y=0.25`) without sinking through the floor.
- Redesigned standard samples into three distinct objects (Beaker, PCB, Cuvette) with unique colors and labels.
- Added `/run` workflow.
- Updated all OGA master logs and generated a report card.

### Outcomes

- UI is highly functional and aesthetic, matching the centrifuge.
- Basket accurately respects physical boundaries of the machine.
- Meaningful materials can be loaded for cleaning.

### Open questions for human

- None.

### Links

- Report card: `logs/report_cards/2026-07-27_OGA_fix-ultrasonic-issues.md`
- Change log: `2026-07-27 · OGA · fix-ultrasonic-issues`

---

## 2026-07-26 · OGA · fix-unload-error

| Field   | Value                   |
| ------- | ----------------------- |
| Agent   | OGA                     |
| Machine | ultrasonic_cleaner_twin |

### User request (paraphrase)

The user reported a TypeError in `app.js` at line 912 related to setting `onclick` on a null element, and a 404 error
for `favicon.ico`. Act as OGA, assign a task to fix the errors, and fill out the mandatory logs and report cards.

### Decisions

- Remove the dead `btn-unload-sample` event listener from `app.js` (line 912).
- The 404 `favicon.ico` is benign and ignored for now.
- Fill out all required OGA logs and report cards to maintain compliance.

### Outcomes

- Fixed `app.js` crash. The twin viewer loads correctly without JavaScript errors.
- Logs and report card generated.

### Open questions for human

- None.

### Links

- Report card: `logs/report_cards/2026-07-26_OGA_fix-unload-error.md`
- Change log: `2026-07-26 · OGA · fix-unload-error`

---

## 2026-07-25 · OGA · docs-lab-viewer

| Field   | Value      |
| ------- | ---------- |
| Agent   | OGA / docs |
| Machine | workspace  |

### User request (paraphrase)

(1) Fix serve failure (port / paths). (2) Update instructions to mention the new lab viewer and fill out all reports and
report card.

### Decisions

- Document lab_viewer as preferred entry: `./scripts/serve.sh` → `/lab_viewer/`.
- Point SOP, HOW_TO, STANDARD, machine_template, centrifuge README/AGENTS/skill, NBA charter, governance.
- Keep standalone centrifuge serve documented separately.
- Complete full mandate: change log, troubleshooting, conversation, report card.

### Outcomes

- Instructions updated across `.master` and gold sample.
- Session logs and report card written for this close-out.

### Open questions for human

- None for documentation; optional later: `?embed=1` to slim centrifuge chrome when inside lab_viewer iframe.

### Links

- Report card: `logs/report_cards/2026-07-25_OGA_docs-lab-viewer.md`
- Change log: `2026-07-25 · OGA · docs-lab-viewer`

---

## 2026-07-25 · NBA · lab-viewer

| Field   | Value      |
| ------- | ---------- |
| Agent   | NBA        |
| Machine | lab_viewer |

### User request (paraphrase)

Master viewer at Twins root: lab desk, choose machine, load proper controls (centrifuge first), switch machines with
instrument sliding off desk and new machine loading.

### Decisions

- `lab_viewer/` shell with machine select + transition WebGL desk.
- Ready machines load full package viewers via iframe (full centrifuge controls).
- Transition uses shared lab + `createCentrifugeModel(..., { includeLab: false })`.
- Planned machines use placeholder page.
- Serve from Twins root via `scripts/serve.sh`.

### Outcomes

- Centrifuge selectable with full twin UI; switch to planned machines works with desk animation.

### Open questions for human

- Whether future machines should mount natively into one continuous 3D scene (no iframe) once a machine plugin API
  exists.

### Links

- Report card: `logs/report_cards/2026-07-25_NBA_lab-viewer.md`

---

## 2026-07-25 · OGA · agent-sop

| Field   | Value     |
| ------- | --------- |
| Agent   | OGA       |
| Machine | workspace |

### User request (paraphrase)

Add a single agent SOP (yes to earlier offer).

### Decisions

- Create `.master/AGENT_SOP.md` as the one session checklist.
- Keep `AGENTS_MANDATE.md` as logging detail only.
- Point README, rules, agents roster, build guide, package AGENTS, and lab-digital-twin skill at the SOP.

### Outcomes

- SOP covers start checklist, work rules by role, handoff, mandatory close-out, done criteria.

### Open questions for human

- None for this change.

### Links

- Report card: `logs/report_cards/2026-07-25_OGA_agent-sop.md`
- Change log: entry `2026-07-25 · OGA · agent-sop`

---

## 2026-07-25 · OGA · create-master

| Field   | Value                 |
| ------- | --------------------- |
| Agent   | OGA / workspace setup |
| Machine | workspace             |

### User request (paraphrase)

Create `Twins/.master` with instructions to build new machines like `centrifuge_twin`, manifests, agent roles (OGA, NBA,
SAA, LIAR, SEOA, MDRA, BC), troubleshooting log, master change log, conversation log, and mandatory self report cards
(files touched, 1–100 score, hallucinations, problems, pitfalls, future ideas).

### Decisions

- Place governance in `Twins/.master/` (dot-folder = organizational, not a twin package).
- Keep machine packages self-contained; `.master` is process only.
- Require four end-of-work artifacts every session.
- Seed registry with `centrifuge_twin` gold sample.

### Outcomes

- Full `.master` tree with roles, templates, logs, governance, registry.

### Open questions for human

- Whether future agent runtimes should auto-load `.master/AGENTS_MANDATE.md` via a skill symlink.
- Preferred schedule file location if SAA needs a standing multi-week plan.

### Links

- Report card: `logs/report_cards/2026-07-25_OGA_create-master.md`
- Change log: entry `2026-07-25 · OGA · create-master`
