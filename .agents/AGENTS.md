# Workspace Rules

## 1. CRITICAL FIDELITY RULE: Exhaustive Procedural Detail (Zero File Size Limits)

**Every single part needs complete procedural design.** Every screw (with real hex socket or cross-recess depth), every
washer, bracket, gasket, and individual part of a twin must be fully modeled in genuine 3D physical geometry.

- Do not use abstract primitives to represent complex assemblies.
- Do not bake micro-fasteners into flat 2D normal maps out of fear of file size.
- Recreate the exact CAD models down to the finest mechanical detail.

## 2. Specialized Subagent Puzzle Architecture (The Centrifuge Standard)

*"The idea is that we have subagents and they each are in charge of a little piece of the puzzle. Go and study the centrifuge it is just about perfect as far as what I want and expect in every machine."*

All machine twins follow the 13-Subagent Puzzle Architecture, where each subagent owns an isolated domain of the build and verifies against specific gates in `.agents/MASTER_PREFLIGHT_CHECKLIST.md`:

1. **`twin_spec_researcher`** (Research & Specifications): OEM manuals, blueprints, 1:1 dimensions, BOM, physical formulas (`docs/dimensions.md`, `docs/BOM.md`).
2. **`twin_chassis_builder`** (External Housing & Enclosure): Structural unibody casting, seam lines, parting lines, louvers, knurled leveling feet at $Y=0$, carved flush recessed pockets, and `Badge_SREdesigns`.
3. **`twin_power_circuit_engineer`** (Power & Circuit Continuity): Bench duplex outlet box (`Power_Receptacle_Duplex`), NEMA 5-15P plug, SJTOW cord, internal PSU (transformer, rectifier, filter caps, regulators), color-coded wiring harness, ground lug, and hard continuity logic (`isPluggedIn && switchOn`).
4. **`twin_sensor_data_engineer`** (Sensors, Data & Telemetry): Physical tachometer (Hall / optical encoder), NTC stator thermistor, microswitches, ribbon cables to MCU, external communication ports (RS-232, USB-B, RJ45), and GLP analytical CSV export.
5. **`twin_display_silkscreen_engineer`** (Display & Silkscreen Typography): Dedicated LCD quad (`UI_LCD`), dynamic high-DPI CanvasTexture (`flipY = false`), upright UVs (`1.0 - uv.getY()`), anti-reflective protective lens, unpowered blackout state, and high-DPI procedural silkscreen faceplates.
6. **`twin_controls_ergonomics_engineer`** (Tactile Controls & Ergonomics): Dedicated physical button meshes (`Btn_*`), push key kinematics (0.8–1.2mm depress), knurled dials with calibrated clockwise increase, multi-position toggle switches with synchronized kinematic angles, and $\ge 3.5\text{ mm}$ ergonomic clearance.
7. **`twin_internal_mechanics_builder`** (Internal Mechanics & Exploded View): Drive motor (laminated stator core, dual copper coils, rotor, bearings), cast iron ballast, elastomeric vibration isolation dampers, PCB, and clean vertical exploded view offsets ($\ge +80\text{--}120\text{ mm}$).
8. **`twin_environment_lighting_director`** (Environment, Bench & Lighting): Standard lab room setting, black epoxy bench (`INSTRUMENT_BENCH`) at datum $Y=0$, backsplash, calibrated 3-point studio lighting, and standardized interactive toolbar sliders (Light, Mood, Zoom, Orbit).
9. **`twin_labware_fluid_specialist`** (Labware & Fluid Dynamics): Authentic 1:1 consumable vessels (15 mL Falcon tube with graduations and fluted cap, 1.5 mL Eppendorf tubes with hinged snap-caps), 24-slot tube rack, natural ergonomic tilt angles, and parabolic fluid meniscus / vortex physics.
10. **`twin_audio_sfx_synthesizer`** (Acoustics & Audio Synthesis): Procedural Web Audio API sound synthesizer (`sfx.js`): multi-harmonic motor whine scaling with RPM, resonant bench rumble, mechanical switch snaps, microswitch detents, relay thuds, and mute control.
11. **`twin_controller_logic_engineer`** (Dual-Truth Logic & State Machine): Pure Python controller (`software/controller/<twin>_controller.py`) with 100% test pass rate (`test_controller.py`), locking state transitions and safety interlocks (lid, power, balance), mirrored in client JS runtime (`app.js`).
12. **`twin_web_ui_architect`** (Web Shell & Interface): Gold standard collapsible side panels (`<aside class="instrument panel-collapsible">`, `<aside class="parts panel-collapsible">`, `<aside class="lab panel-collapsible">`), dark lab theme CSS (`--bg: #0c1016`), Part Explorer with isolate & wireframe mode, and zero console errors.
13. **`twin_visual_qa_auditor`** (Visual QA Auditor & Preflight Gate): Automated CDP preflight audit capturing all 6 standardized viewpoints (`CAM_ISO`, `CAM_FRONT`, `CAM_SIDE`, `CAM_TOP`, `CAM_EXPLODED`, `STATE_ACTIVE`), closed-loop visual review using `view_file` on every screenshot, verification of zero browser console exceptions, controller unit test pass, and git deployment verification.

## 3. Strict Semantic Part Taxonomy Contract

Every physical assembly must strictly adhere to this naming taxonomy across CAD and Web:

- `Body_Chassis`: Main structural unibody casting/housing.
- `UI_LCD`: Dedicated, flat UV-mapped quad seated in the boolean-carved pocket (bound to dynamic canvas).
- `Btn_<Action>`: Dedicated physical button meshes (e.g. `Btn_Tare`, `Btn_Cal`, `Btn_Power`, `Btn_Print`).
- `Pivot_<Assembly>`: Movable sub-assemblies with pivot origin set at the mechanical axis (e.g. `Pivot_DoorLeft`,
  `Pivot_DoorRight`, `Pivot_DoorTop`, `Pivot_PanWeighing`).
- `Glass_<Part>`: Optical components designated for Three.js refractive `MeshPhysicalMaterial` ($IOR = 1.52$).
- `Fastener_<Type>_<ID>`: Genuine 3D physical screws, washers, and nuts (e.g. `Fastener_HexM4_01`).
- `Foot_Leveling_<Corner>`: Threaded leveling feet with vulcanized rubber pads.
- `Badge_SREdesigns`: Dedicated plate for the official brand badge.

## 4. Recessed Bezel & Flush Mounting (Zero Wall Clipping)

Screens, membrane keypads, and badges must be seated in dedicated recessed pockets/bezels carved directly into the
chassis. Never allow displays or buttons to intersect solid walls or float in mid-air.

## 5. Ground Plane & Desk Clearance

Leveling feet and base pans must rest exactly on the datum plane ($Y = 0$ local, on top of the lab bench at $Y = 9.0$
lab world), with zero bench clipping or side overhang.

## 6. Strict Standard UI Alignment

**NEVER deviate from the established Gold Standard UI layout (e.g., `centrifuge_twin`) in the name of "efficiency" or
"simplification".** When building the viewer UI (`index.html`, `style.css`), you must conform to the established
standard components (e.g., `<aside class="instrument panel-collapsible">`, CSS variables like `--bg: #0c1016`). Do not
generate generic minimal HTML/CSS shells.

## 7. Closed-Loop Multi-Angle Visual QA Gate (Mandatory for Every Build)

**Every twin build must execute the standardized 6-viewpoint visual audit before signoff.** Refer to `.agents/skills/twin-visual-qa/SKILL.md`.

Before marking any part or twin complete, the agent must:
1. Start the local server (`http://127.0.0.1:8765`).
2. Run the automated CDP/browser verification script capturing all 6 standardized viewpoints:
   - `CAM_ISO`: 3/4 isometric perspective, bench clearance ($Y = 9.0$), seamless room walls.
   - `CAM_FRONT`: Upright typography, zero knob/control display occlusion, brand badge containment.
   - `CAM_SIDE`: Profile silhouette, flush switches/connectors, zero floating parts.
   - `CAM_TOP`: Plate/chamber/rotor layout, genuine 3D fasteners, sample vessel centering.
   - `CAM_EXPLODED`: Vertical separation of assemblies along clean kinematic axes.
   - `STATE_ACTIVE`: Live dynamic state (thermal glow, active RPM counters, parabolic meniscus vortex).
3. Save and visually audit all high-resolution screenshot artifacts (`view_file`).
4. Ensure zero browser console exceptions (`Total exceptions: 0`).
5. Run Python controller unit tests (`python3 <twin>/software/controller/test_controller.py`) with 100% pass rate.

## 8. Diagnostic & Troubleshooting Log Adherence

All agents must strictly cross-reference `.agents/TROUBLESHOOTING_LOG.md` before approving any twin. The audit must specifically test:
- **DIAG-001 (Boundary Containment)**: Outer dimensions of any component $\le 85\%$ of the planar face it is seated on.
- **DIAG-002 (Mesh Occlusion)**: Ensure decorative and canvas planes have positive relative Z clearance over backing boxes.
- **DIAG-003 (Coplanar Z-Fighting)**: No two solid meshes may share an identical planar coordinate. All edge trims must wrap outer perimeters.
- **DIAG-004 (Industrial Fidelity)**: Recreate authentic real-world instrument lineage (e.g. through-panel buttons without fabricated fantasy labels).
- **DIAG-005 (Dynamic Canvas LCD Orientation)**: Canvas textures must set `flipY = false`. Text inverted? Invert UV coordinates on buffer geometry (`uv.setY(i, 1.0 - uv.getY(i))`). Never apply negative scale matrices (`scale.x = -1`).
- **DIAG-014 (Physical Circuit Continuity)**: No electrical machine may ever run or illuminate displays while disconnected from electricity. Power cord must plug into a physical bench receptacle; unplugging cuts power to 0.
- **DIAG-015 (Upright Typography & Direction)**: All silkscreen faceplate typography, control numbers, and branding must render 100% upright in front view (`CAM_FRONT`).
- **DIAG-016 (Sloped Wall Recess)**: Solve exact casting face equations $Z(Y)$ on drafted hulls; never submerge consoles inside solid metal walls.
- **DIAG-017 (Silkscreen Completeness)**: Every tactile button, rotary dial, and toggle switch must have high-DPI procedural silkscreen text and calibrated markings.
- **DIAG-018 (Control Clearance)**: Maintain $\ge 3.5\text{ mm}$ physical separation between knobs and display bezels.
- **DIAG-019 (Labware Procedural Fidelity)**: Recreate authentic 1:1 labware geometry (conical bottoms, graduation rings, fluted caps, ergonomic tilt).
- **DIAG-020 (Kinematic Exploded Exposure)**: Unibody casting must elevate $\ge +100\text{ mm}$ to fully expose cast iron ballast, isolators, motor windings, and PCB.
- **DIAG-021 (Kinematic Directional Synchronization)**: Lever and dial rotations must mathematically synchronize with silkscreen labels.
- **DIAG-022 (Camera Viewport Bounding)**: Camera framing must encompass the entire vertical envelope ($Y \in [0, 260\text{ mm}]$); zero cut-off caps.

## 9. Physical Circuit Continuity & Real-World Reality

**Electrical appliances require power to run.** In the 3D digital twin:
1. Model a genuine laboratory electrical outlet box (`Power_Receptacle_Duplex`) seated on the bench surface.
2. The molded NEMA 5-15P plug must be firmly inserted into the receptacle to close the circuit.
3. Logical power state MUST be bound to electrical continuity:
   - When unplugged (`isPluggedIn === false`) or rear power switch is off, the twin has ZERO power.
   - Screen goes black, motor stops at $0\text{ RPM}$, status LED is dark, and sound is silenced.
   - A digital twin with a loose unplugged cord sitting on the desk while spinning at 2400 RPM is an immediate automatic failure.

## 10. Mandatory Pre-Flight Audit Checklist Execution

Before requesting signoff or claiming completion, the agent must execute and document the 10-point checklist (`CHK-01` through `CHK-10`) in `.agents/TROUBLESHOOTING_LOG.md`. Every screenshot MUST be visually reviewed using `view_file`.

## 11. Mandatory Completed Machine Presentation & Operator Walkthrough Standard

Whenever presenting a completed machine digital twin (`walkthrough.md` and final user presentation), you MUST provide a comprehensive **Visual Operator Experience Walkthrough & Internal Working Anatomy Guide** illustrated with dedicated high-resolution screenshots (captured via CDP and verified with `view_file`) covering all 7 operational and anatomical stages:

1. **Powering On & Electrical Continuity (`STATE_UNPLUGGED` vs. `STATE_STANDBY`)**:
   - Show and explain the real-life power-up sequence: inspecting the power cord, inserting the NEMA 5-15P plug into the benchtop duplex receptacle (`Power_Receptacle_Duplex`), flipping the main breaker/rocker switch, and verifying transition from blackout (`POWER_OFF`) to self-test standby (`STANDBY`).
2. **Product, Reagent & External Accessory Setup (`STATE_LABWARE_PREP`)**:
   - Show and explain how the operator prepares consumables, reagents, media, and external accessories prior to loading (e.g., filling vessels/baths, preparing sample tubes/baskets/disks, selecting monograph samples).
3. **Physical Insertion, Loading & Safety Protocols (`STATE_INSERTION_SAFETY`)**:
   - Show and explain how accessories and samples are physically inserted/mounted into the machine (e.g., raising/lowering lift mechanisms, coupling quick-release collets, closing safety lids/doors) and detail all real-world and digital safety interlocks (power continuity, thermal cutoffs, liquid level sensors, lid interlocks).
4. **Physical & Software Machine Setup (`CAM_CONSOLE`)**:
   - Show a close-up of the operator console (`UI_LCD` and tactile `Btn_*` / `Knob_*` controls) alongside the web control panel, explaining how the operator configures physical controls and software parameters (temperature setpoints, speed/RPM/CPM, timers, sample profiles) before starting a run.
5. **Active Run, Live User Outputs & Process Physics ("How & Why") (`STATE_ACTIVE` & `CAM_PROCESS_CLOSEUP`)**:
   - Show the machine actively running and explain:
     - **What is happening physically and chemically (How & Why)**: The underlying mechanical kinematics, fluid dynamics, thermodynamics, or optical physics occurring inside the reaction chamber/vessels.
     - **What is outputted to the user while running**: Live `UI_LCD` telemetry readouts, web HUD metrics, progress timers, visual indicators, and procedural Web Audio acoustic cues.
6. **End-of-Run Output & Results Examination (`STATE_COMPLETE`)**:
   - Show the completed state (e.g., lifted baskets, separated fractions, final titration endpoint) and explain what outputs are generated at completion, how the operator physically inspects the product/vessels in real life, how pass/fail criteria are evaluated, and how to export and examine the GLP analytical CSV audit trail.
7. **Internal Working Shots & Complete Electromechanical, Power, Sensor & Data Anatomy (`STAGE7_POWER_ROUTING`, `STAGE7_MOTORS_ACTUATORS`, `STAGE7_SENSORS_OPTICS`, `STAGE7_DATA_COMMS`, `CAM_EXPLODED`)**:
   - Provide dedicated close-up visual shots inside the machine (with outer panels hidden or exploded) and explain how every internal system operates as a real instrument:
     - **7A. Power Supply & End-to-End Power Routing**: Visuals of the AC mains IEC inlet, fuse/switch, EMI filter, toroidal step-down transformer, enclosed switching PSU (`Assembly_PowerSupply`) with screw terminal barrier strip, solid-state relays (`SSR`) on finned heatsinks, chassis ground lug, and **color-coded 3D wiring harnesses** showing how AC and DC power are routed to every motor, heater, sensor, and board across the entire machine.
     - **7B. All Motors & Mechanical Actuators**: Visuals of every motor in the machine (main drive motor, lift/positioning stepper motors, fluid circulation pump motor, convective cooling fan motor) and their mechanical transmission linkages (eccentric cranks, planetary gearboxes, trapezoidal lead screws, bearings, guide shafts, tubing).
     - **7C. Controllers, Sensors & Optical/Mirror Assemblies**: Visuals of all physical sensors (PT100 RTD thermal probes, Hall-effect / optical encoders, limit microswitches, liquid level floats, laser/IR optical endpoint detectors, and internal 45° optical relay mirrors) and how their signals feed back to the controller.
     - **7D. Data Components, Storage, Wireless (Wi-Fi/Bluetooth) & I/O Ports**: Visuals of the FR-4 motherboard (`PCB_Motherboard`), MCU (`Part_MCU_Core`), DRAM (`Part_RAM_Chip`), non-volatile eMMC/SSD Flash (`Part_SSD_Module`), battery-backed RTC (`CR2032`), 24-bit ADC, shielded **Wi-Fi / Bluetooth Low Energy (BLE) radio module** with U.FL coax and external dipole antenna, and rear bulkhead data ports (`RS-232 DB9`, `USB-B`, `USB-A Flash Host`, `RJ45 Ethernet LAN`), with a complete explanation of how analytical data is sampled, saved in non-volatile memory, and transported (wired & wireless).
8. **Narrated Social Media Walkthrough Video & In-App Guided Tour (`ERWEKA_ZT322_Social_Walkthrough.mp4` & `🎬 Guided Tour`)**:
   - Every completed machine twin MUST include both:
     1. An in-app **`🎬 Guided Tour`** button (`#btnGuidedTour` / `TOUR_CHAPTERS`) with Web Speech API voiceover narration and broadcast lower-third captions (`#tourOverlay`).
     2. A standalone 1080p H.264/AAC `.mp4` social media walkthrough video with voiceover narration generated locally via `node scripts/generate_walkthrough_video.mjs <twin_dir>` (`say` + `ffmpeg`, `$0.00` local pipeline) and verified by **Gate 5** of `scripts/oga_validator.mjs`.



