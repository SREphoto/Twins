# Specialized Subagent Puzzle Roster: The Centrifuge Standard
## Autonomous Domain Subagents for High-Fidelity Lab Instrument Digital Twins

> *"The idea is that we have subagents and they each are in charge of a little piece of the puzzle. Go and study the centrifuge it is just about perfect as far as what I want and expect in every machine."*

To eliminate cognitive overload and guarantee zero regressions, every digital twin build is divided into discrete, verifiable "pieces of the puzzle." Each subagent owns their exact domain piece, operates with explicit inputs and outputs, and verifies their work against specific gates in the [Master Pre-Flight Audit Checklist](MASTER_PREFLIGHT_CHECKLIST.md).

---

## Master Subagent Roster

| # | Subagent Name | Role / Domain | Piece of the Puzzle | Primary Deliverables | Preflight Gate |
| :- | :--- | :--- | :--- | :--- | :--- |
| **01** | `twin_spec_researcher` | **Research & Specifications** | Ingests OEM manuals, extracted text, 1:1 mm dimensions, electrical ratings, BOM, and physical kinematic formulas. | `research/sources.md`, `docs/dimensions.md`, `docs/BOM.md`, `docs/control_spec.md` | §1, §3 |
| **02** | `twin_chassis_builder` | **External Housing & Enclosure** | Structural unibody casting, seam lines, parting lines, louvers, knurled leveling feet with rubber pads at $Y=0$, carved flush recessed pockets, and `Badge_SREdesigns`. | Housing geometry in `*3d.js` or `cad/` | §3 (Form, Size, Materials, Pockets) |
| **03** | `twin_power_circuit_engineer`| **Power & Circuit Continuity** | Bench duplex outlet box (`Power_Receptacle_Duplex`), NEMA 5-15P plug, SJTOW bench cord, internal PSU (transformer, rectifier, filter caps, regulators), color-coded wiring harness, ground lug, and hard continuity logic (`isPluggedIn && switchOn`). | Outlet, cord, plug, internal PSU, wire splines, and continuity state machine | §2 (Outlet), §5 (Power Continuity, PSU, Wiring) |
| **04** | `twin_sensor_data_engineer` | **Sensors, Data & Telemetry** | Physical tachometer (Hall pickup / optical encoder), NTC stator thermistor, microswitches, ribbon cables to MCU, external communication ports (RS-232, USB-B, RJ45), and GLP analytical CSV export. | Sensor meshes, signal ribbons, rear ports, and telemetry streaming in `app.js` | §5 (Data Ports, Signal Routing) |
| **05** | `twin_display_silkscreen_engineer`| **Display & Silkscreen Typography** | Dedicated LCD quad (`UI_LCD`), dynamic high-DPI CanvasTexture (`flipY = false`), upright UV orientation (`1.0 - uv.getY()`), anti-reflective protective lens, unpowered blackout state, and high-DPI procedural silkscreen faceplates. | Dynamic canvas renderer in `app.js`, display quad, and silkscreen textures | §4 (LCD Panel, Upright Typography, Silkscreen) |
| **06** | `twin_controls_ergonomics_engineer`| **Tactile Controls & Ergonomics** | Dedicated physical button meshes (`Btn_*`), push key kinematics (0.8–1.2mm depress travel), knurled dials with calibrated clockwise increase, multi-position toggle switches with synchronized kinematic angles, and $\ge 3.5\text{ mm}$ ergonomic clearance. | Button, dial, and switch meshes + pointer interaction handlers | §6 (Tactile Controls, Directional Kinematics) |
| **07** | `twin_internal_mechanics_builder`| **Internal Mechanics & Exploded View** | Complete drive motor (laminated stator core, dual copper coils, rotor, drive shaft, bearings), cast iron ballast weight, elastomeric vibration isolation dampers, counterweights, controller PCB, and clean vertical exploded view offsets ($\ge +80\text{--}120\text{ mm}$). | Internal assemblies, PCB, motor, ballast, and exploded animation targets | §7 (Fasteners), §8 (Internal Anatomy, Exploded View) |
| **08** | `twin_environment_lighting_director`| **Environment, Bench & Lighting** | Standard lab room setting, black epoxy bench (`INSTRUMENT_BENCH`) with perimeter steel trim at datum $Y=0$, backsplash wall, calibrated 3-point studio lighting (warm key, cool fill, ambient ground bounce, ceiling tube), and standardized interactive toolbar sliders (Light, Mood, Zoom, Orbit). | `buildLabRoom()` in `*3d.js`, scene lights, and toolbar event listeners | §2 (Lab Setting, Bench, Backsplash, Lighting, Zoom) |
| **09** | `twin_labware_fluid_specialist` | **Labware & Fluid Dynamics** | Authentic 1:1 consumable vessels (15 mL Falcon tube with graduations and fluted cap, 1.5 mL Eppendorf tubes with hinged snap-caps), 24-slot tube rack beside instrument, natural ergonomic tilt angles, and parabolic fluid meniscus / vortex physics proportional to $\text{RPM}^2$. | Labware meshes, tube rack, and dynamic meniscus/sedimentation shaders | §9 (Labware, Fluids) |
| **10** | `twin_audio_sfx_synthesizer` | **Acoustics & Audio Synthesis** | Procedural Web Audio API sound synthesizer (`sfx.js`): multi-harmonic motor whine scaling with RPM, resonant bench rumble, mechanical switch snaps, microswitch detent clicks, relay thuds, fault alarms, and global mute control. | `sfx.js` Web Audio synth nodes and audio trigger bindings | §10 (Acoustics) |
| **11** | `twin_controller_logic_engineer` | **Dual-Truth Logic & State Machine** | Pure Python controller (`software/controller/<twin>_controller.py`) with 100% test pass rate (`test_controller.py`, `test_samples.py`), locking state transitions and safety interlocks (lid lock, balance check, speed limits, thermal shutdown), mirrored identically in client JS runtime (`app.js`). | Python controller, test suite, and JavaScript state engine synchronization | §11 (Interlocks, 100% Unit Test Pass) |
| **12** | `twin_web_ui_architect` | **Web Shell & Interface** | Gold standard collapsible side panels (`<aside class="instrument panel-collapsible">`, `<aside class="parts panel-collapsible">`, `<aside class="lab panel-collapsible">`), dark lab theme CSS (`--bg: #0c1016`, `--panel: #131922`), Part Explorer with isolate & wireframe mode, responsive layout, and zero browser console errors. | `index.html`, `style.css`, part explorer integration in `app.js` | §1 (UI/UX, Layout, Part Explorer, Console 0) |
| **13** | `twin_visual_qa_auditor` | **Visual QA Auditor & Preflight Gate**| Automated CDP preflight audit capturing all 6 standardized viewpoints (`CAM_ISO`, `CAM_FRONT`, `CAM_SIDE`, `CAM_TOP`, `CAM_EXPLODED`, `STATE_ACTIVE`), closed-loop visual review using `view_file` on every screenshot, verification of zero browser console exceptions, controller unit test pass, and git deployment verification. | High-res screenshot artifacts, visual inspection audit report card | §11 (Pre-Flight QA Gate CHK-01 to CHK-15) |

---

## Detailed Subagent Specifications & Puzzle Responsibilities

### 01. `twin_spec_researcher` (Research & Specs)
- **Mandate**: Ingest OEM manuals, service guides, parts catalogs, and extract true 1:1 physical dimensions and operational parameters.
- **Puzzle Piece**: The Blueprint & Mathematical Truth.
- **Key Questions**:
  - What are the exact dimensions in mm? (Width, Depth, Height, Diameter).
  - What are the electrical power ratings? (Voltage, Frequency, Phase, Amps, Watts).
  - What are the mechanical operating limits? (Min/Max RPM, Max RCF, Timer Range, Temperature Range).
  - What physical formulas govern the process? ($RCF = 1.118 \cdot 10^{-5} \cdot r \cdot RPM^2$, or vortex depression $z(r) = z_0 + \frac{\omega^2 r^2}{2g}$).
- **Deliverables**: `research/sources.md`, `docs/dimensions.md`, `docs/BOM.md`, `docs/control_spec.md`.

### 02. `twin_chassis_builder` (External Housing & Enclosure)
- **Mandate**: Model the physical housing, casting unibody, seams, louvers, leveling feet, and carved bezel pockets.
- **Puzzle Piece**: The Physical Shell & Exterior Form.
- **User Checklist Alignment**:
  - *Does the shape of the machine make sense? Is everything the right size?*
  - *Did you use the right materials?*
- **Key Constraints**:
  - Enforce DIAG-001: Mounted components $\le 85\%$ of parent face.
  - Enforce Rule 1: Every louver, seam, foot, and handle modeled in genuine 3D geometry (zero 2D normal-map baking).
  - Enforce Rule 4: Dedicated flush pockets carved into the unibody casting with $+0.2\text{ mm}$ positive clearance.
  - Leveling feet rest exactly on tabletop datum $Y = 0$.

### 03. `twin_power_circuit_engineer` (Power & Circuit Continuity)
- **Mandate**: Engineer electrical reality, power distribution, and hard circuit continuity.
- **Puzzle Piece**: The Electrical Continuity & Circuit Reality.
- **User Checklist Alignment**:
  - *External power cord: heavy-duty SJTOW, molded strain relief, realistic catenary bench drape.*
  - *External power outlet: duplex junction box (`Power_Receptacle_Duplex`) on the bench.*
  - *Internal power: does everything that needs power have it running from the power supply? Is there a power supply?*
- **Key Constraints**:
  - Model internal PSU: step-down transformer, bridge rectifier with heatsink, electrolytic filter capacitors with stamped top vent crosses, and voltage regulation circuitry.
  - Model internal color-coded 3D wires: AC Hot (Black), AC Neutral (White), Chassis Safety Ground (Green/Yellow) bonded with brass lug and M4 star washer, DC rails (Red/Yellow/Black).
  - Enforce Rule 9 & DIAG-014: If unplugged or switch off, power drops to 0 (screen black `#020406`, motor 0 RPM, LEDs dark, audio muted).

### 04. `twin_sensor_data_engineer` (Sensors, Data & Telemetry)
- **Mandate**: Model physical sensor hardware, signal routing wiring, external data ports, and GLP telemetry streaming.
- **Puzzle Piece**: The Nervous System & Telemetry.
- **User Checklist Alignment**:
  - *External data if needed: what does the machine use? (RS-232 DB9, USB-B, RJ45 Ethernet).*
  - *How is information gathered and routed?*
- **Key Constraints**:
  - Physically model sensors: tachometer optical encoder disc or Hall-effect pickup magnet; NTC stator temperature thermistor; microswitches.
  - Physically route multi-conductor ribbon cables or twisted pairs from sensors to MCU headers (zero wireless magic).
  - Implement GLP analytical run audit log with functional CSV export.

### 05. `twin_display_silkscreen_engineer` (Display & Silkscreen Typography)
- **Mandate**: Engineer the dynamic LCD screen, protective lens, and high-DPI silkscreen faceplates.
- **Puzzle Piece**: The Visual Interface & Silkscreen Typography.
- **User Checklist Alignment**:
  - *LCD panel: high-DPI canvas texture, unpowered blackout state, upright orientation.*
  - *Silkscreen typography: calibrated scales, clear button and mode legends.*
- **Key Constraints**:
  - Enforce DIAG-005 & DIAG-015: Dynamic canvas must set `flipY = false`. Target geometry UVs must render 100% upright in `CAM_FRONT`. Strictly NO negative scale matrices (`scale.x = -1`).
  - Enforce DIAG-014: Unpowered screen renders pitch black (`#020406`) with zero glow.
  - Enforce DIAG-017: Crisp industrial silkscreen legends on all controls.

### 06. `twin_controls_ergonomics_engineer` (Tactile Controls & Ergonomics)
- **Mandate**: Model physical button meshes, rotary dials, and multi-position switches with authentic tactile ergonomics.
- **Puzzle Piece**: The Physical Input Mechanisms.
- **Key Constraints**:
  - Dedicated meshes (`Btn_*`) with 0.8–1.2mm depress travel on click.
  - Enforce DIAG-021: Knobs must rotate CLOCKWISE to increase setpoints. Toggle switches must rotate toward the silkscreen label corresponding to the active mode (`CONTINUOUS` points to `CONT`).
  - Enforce DIAG-018: Maintain $\ge 3.5\text{ mm}$ physical separation between dials and display bezels.

### 07. `twin_internal_mechanics_builder` (Internal Mechanics & Exploded View)
- **Mandate**: Model internal drive motor, stator windings, bearings, ballast weight, dampers, and exploded kinematics.
- **Puzzle Piece**: The Mechanical Drive & Internal Anatomy.
- **Key Constraints**:
  - Exhaustive 3D geometry: laminated stator core, copper magnet wire coils, rotor, precision bearings, cast iron ballast, 4 elastomeric dampers, FR4 controller PCB.
  - Enforce DIAG-020: In exploded view, the main chassis housing MUST lift vertically ($\ge +80\text{--}120\text{ mm}$) along clean kinematic axes to fully expose the internal drive mechanics.

### 08. `twin_environment_lighting_director` (Environment, Bench & Lighting)
- **Mandate**: Maintain the standard shared laboratory environment, bench, and lighting controls.
- **Puzzle Piece**: The Laboratory World Context.
- **User Checklist Alignment**:
  - *Same lab setting: dark atmospheric lab room (#050608).*
  - *Same lab bench: black epoxy countertop (`INSTRUMENT_BENCH`) at datum $Y=0$.*
  - *Same backsplash: neutral matte wall with utility raceway.*
  - *Same power outlet: duplex outlet box with stainless steel cover plate.*
  - *Same lighting: calibrated 3-point studio lighting.*
  - *Same lighting controls: interactive Light intensity slider and Mood dropdown in toolbar.*
  - *Same zoom levels & controls: standard 36° FOV, interactive Zoom slider, Orbit speed slider.*

### 09. `twin_labware_fluid_specialist` (Labware & Fluid Dynamics)
- **Mandate**: Model authentic consumable vessels, tube racks, and physical fluid dynamics.
- **Puzzle Piece**: Consumables & Fluid Dynamics.
- **Key Constraints**:
  - Enforce DIAG-019: 1:1 authentic labware geometry (Falcon tubes with 14 graduation rings and fluted caps, Eppendorf tubes with hinged snap-caps).
  - 24-slot tube rack situated beside the instrument.
  - Dynamic fluid meniscus / parabolic vortex mathematically proportional to $\text{RPM}^2$ and liquid viscosity.

### 10. `twin_audio_sfx_synthesizer` (Acoustics & Audio Synthesis)
- **Mandate**: Synthesize authentic real-time acoustic feedback via Web Audio API.
- **Puzzle Piece**: Acoustic Realism.
- **Key Constraints**:
  - Pure procedural Web Audio synthesis (`sfx.js`): multi-harmonic motor whine scaling with RPM, resonant bench rumble, switch snaps, microswitch detents.
  - Hard cutoff on circuit power disconnect.
  - Global Mute SFX control in toolbar.

### 11. `twin_controller_logic_engineer` (Dual-Truth Logic & State Machine)
- **Mandate**: Maintain pure Python state machine with 100% test coverage and synchronize with client JavaScript.
- **Puzzle Piece**: State Machine & Safety Interlocks.
- **Key Constraints**:
  - Pure Python controller in `software/controller/<twin>_controller.py`.
  - 100% pass on unit tests (`test_controller.py`, `test_samples.py`).
  - Safety interlocks (door/lid open, unpowered blackout, balance fault) strictly locked and mirrored in JS.

### 12. `twin_web_ui_architect` (Web Shell & Interface)
- **Mandate**: Build and maintain the Gold Standard collapsible side panels, Part Explorer, and responsive layout.
- **Puzzle Piece**: The Web Application Interface.
- **Key Constraints**:
  - Conforms to Gold Standard CSS (`centrifuge_twin` / `vortex_mixer_twin`): `<aside class="instrument panel-collapsible">`, `<aside class="parts panel-collapsible">`, `<aside class="lab panel-collapsible">`.
  - Interactive Part Explorer: isolate part, wireframe non-focused parts, focus camera, display technical specs.
  - Zero browser console exceptions (`console.error = 0`).

### 13. `twin_visual_qa_auditor` (Visual QA Auditor & Preflight Gate)
- **Mandate**: Execute the mandatory closed-loop preflight visual audit across all 6 standardized viewpoints.
- **Puzzle Piece**: The Final Quality Gatekeeper.
- **Key Constraints**:
  - Automated CDP capture of all 6 viewpoints: `CAM_ISO`, `CAM_FRONT`, `CAM_SIDE`, `CAM_TOP`, `CAM_EXPLODED`, `STATE_ACTIVE`.
  - MUST call `view_file` on every single screenshot artifact before signoff.
  - Zero console exceptions and 100% pass on controller unit tests.
