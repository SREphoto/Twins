# Master Digital Twin Pre-Flight Audit Checklist

> **ZERO-TOLERANCE QUALITY GATE**: This checklist is the mandatory quality contract across all digital twins in the `Twins` ecosystem. Every item must be verified and pass 100% before any twin build, refactor, or pull request can be approved. Built upon the gold standard reference implementation of `centrifuge_twin`.

---

## Category 1: UI / UX & Web Shell Standards

- [ ] **Standard Layout Structure**: Conforms strictly to Gold Standard UI layout (`centrifuge_twin` / `vortex_mixer_twin`):
  - Collapsible instrument panel `<aside class="instrument panel-collapsible">` with toggle button `▾`/`◂`.
  - Dark laboratory theme CSS variables (`--bg: #0c1016`, `--panel: #131922`, `--cyan: #00f3ff`, `--border: #223042`).
  - No generic or minimalist HTML/CSS shells.
- [ ] **Instrument Title & Header Bar**:
  - Official manufacturer name & model typography (e.g. `SCIENTIFIC INDUSTRIES Vortex-Genie Pro`, `MICRO 5424-R`).
  - Official `Badge_SREdesigns` brand badge integrated into the header.
  - Live status pill with color-coded operational modes:
    - Cyan / Green: `RUNNING` or `ACTIVE`
    - Amber: `STANDBY` or `READY`
    - Slate / Red: `UNPLUGGED` or `SWITCH OFF`
  - High-precision telemetry sub-label describing active state (e.g. `Vortex active at 2800 RPM`, `Ready to load samples`).
- [ ] **Standard View Toolbar & Camera Presets**:
  - Standardized view buttons: `ISO`, `Front`, `Side`, `Top`, `Reset view`.
  - Mode toggle buttons: `Exploded view`, `Wireframe`, `Auto-rotate`.
  - Active button state highlighted with high-contrast cyan background (`.view-btn.active`: `background: var(--cyan); color: #050608; font-weight: 600`).
  - Switching between camera presets cleanly updates the active button without leaving phantom states.
- [ ] **Standardized Interactive Controls in Toolbar**:
  - **Orbit speed control**: slider ($0.2\times$ to $4.0\times$, default $1.1\times$) with dynamic value display (`#orbit-speed-val`).
  - **Camera zoom control**: slider ($0\text{--}100\%$, default $45\%$) mapping smoothly to camera distance (`#camera-zoom-val`).
  - **Lab light control**: slider ($0.15\times$ to $2.2\times$, default $1.0\times$) with dynamic value display (`#lab-light-val`).
  - **Lighting mood control**: dropdown (`#lab-light-mood`: Neutral, Bright, Dim, Cool, Warm).
- [ ] **Telemetry Readouts & GLP Compliance**:
  - Real-time numerical readouts: Active Speed (RPM / RCF), Meniscus Vortex Depth (mm), Countdown Remaining (s / mm:ss), Motor Temperature (°C), Session Run Time (s).
  - GLP Compliance Batch Run Log: dynamic HTML table recording Time, Mode, RPM, Duration, and Vessel type, with functional **Export CSV** download.
- [ ] **Responsiveness & Zero Console Exceptions**:
  - Viewport auto-resizes on window change (`renderer.setSize`, `camera.aspect = width / height`, `camera.updateProjectionMatrix()`).
  - Collapsible side panel collapses cleanly on mobile or narrow windows without occluding 3D canvas.
  - Zero browser console errors (`console.error = 0`, `Total exceptions = 0`).

---

## Category 2: Environment & Standard Lab Setting

- [ ] **Same Lab Setting**:
  - Standard laboratory world space coordinates with dark atmospheric backdrop (`#050608` or `#0a0d14`).
  - Distant matte lab walls with architectural floor and subtle laboratory ambient lighting; zero harsh white or empty void.
- [ ] **Same Lab Bench**:
  - Standard laboratory epoxy/phenolic resin countertop (`INSTRUMENT_BENCH`) resting at local $Y = 0$ (or lab world $Y = 9.0$).
  - Realistic countertop surface roughness ($0.38$) with subtle specular sheen, dark tone (`#141820`), and authentic perimeter steel edge trim.
  - Zero floating above the bench; zero penetration into the countertop.
- [ ] **Same Backsplash**:
  - Neutral matte lab wall backsplash running behind the bench with realistic utility raceway.
- [ ] **Same Power Outlet**:
  - Authentic cast aluminum duplex junction box (`Power_Receptacle_Duplex`, $54 \times 72 \times 36\text{ mm}$) grounded on the bench surface behind or beside the instrument.
  - Brushed stainless steel duplex faceplate with center 6-32 oval head screw.
  - Dual commercial-grade NEMA 5-15R receptacles (commercial lab specification: ground pin oriented UP).
- [ ] **Same Lighting**:
  - Calibrated 3-point laboratory studio lighting rig:
    - Key light: warm directional light ($3000\text{--}3500\text{ K}$) casting soft PCF contact shadows onto the bench.
    - Fill light: cool soft directional light ($6500\text{--}7000\text{ K}$) balancing harsh shadows.
    - Ambient bounce light: soft ground-plane fill simulating light bounce off the lab countertop.
    - Overhead lab ceiling luminaire: simulated recessed ceiling fluorescent fixture.
- [ ] **Same Lighting Controls**:
  - Standardized interactive Lab Light slider ($0.15\times$ to $2.2\times$, default $1.0\times$) in toolbar with dynamic readout label (`lab-light-val`).
  - Standardized Lighting Mood selector (`Neutral`, `Bright`, `Dim`, `Cool`, `Warm`) altering color temperatures in real-time.
  - Linearly scales key, fill, and ambient light intensities simultaneously.
- [ ] **Same Zoom Levels & Zoom Level Controls**:
  - Fixed standard camera FOV ($36^\circ$) across all twins.
  - Standardized interactive Zoom slider ($0\text{--}100\%$) mapped smoothly between `minDistance` and `maxDistance`.
  - Orbit slider ($0.2\times$ to $4.0\times$, default $1.1\times$) controlling OrbitControls auto-rotation speed.
  - Mouse / touch orbit, pan, and scroll wheel zooming constrained within ergonomic min/max limits.

---

## Category 3: External Housing & Physical Form

- [ ] **Does the shape of the machine make sense? Is everything the right size?**:
  - Instrument proportions, width, depth, height, and footprint match manufacturer CAD / technical spec sheets to within $\pm 1\text{ mm}$.
  - Weight distribution, taper angles, and stance visually reflect real-world center of gravity and mechanical stability.
  - Bounding box containment: all child components $\le 85\%$ of the planar face they are seated on (DIAG-001).
- [ ] **Did you use the right materials?**:
  - Heavy cast zinc / aluminum alloy housing with authentic textured epoxy-polyester powder coat (e.g., `MAT_CHASSIS_CREAM`, `roughness: 0.52--0.55`, subtle bump map).
  - Molded engineering thermoplastics (polycarbonate/ABS) for bezels, side grips, and handles with authentic matte sheen.
  - Molded nitrile / EPDM vulcanized rubber for cup heads, boots, and leveling suction feet (`roughness: 0.88`, zero metalness).
  - Anodized aluminum / stainless steel for shafts, rotor assemblies, and fasteners.
  - Optical borosilicate glass / acrylic for viewing windows and sample tubes.
- [ ] **Exhaustive Procedural Geometry (Rule 1)**:
  - Every parting line, draft angle, intake/exhaust ventilation louver, handle, seam, and foot must be modeled in genuine 3D physical geometry.
  - Strictly zero baking of 3D features into flat 2D normal maps out of file size concerns.
- [ ] **Recessed Bezels & Flush Pockets (Rule 4)**:
  - All screens, membrane switch plates, brand badges, and connector panels must sit inside dedicated recessed pockets carved directly into the unibody chassis.
  - Zero submerged panels inside metal walls; zero floating planes; zero corner slits or wall clipping.
- [ ] **Leveling Feet & Suction Cups**:
  - 4 molded elastomeric suction/leveling feet (`Foot_Leveling_<Corner>`) with threaded studs resting exactly on datum $Y = 0$.
- [ ] **Canonical Brand Badge (`Badge_SREdesigns`)**:
  - Official SREdesigns brand badge seated in recessed pocket with $\ge 1.5\text{ mm}$ perimeter margin.
  - Text upright, crisp, properly proportioned, with zero text clipping or border overflow.

---

## Category 4: LCD / Display Panel & Silkscreen Typography

- [ ] **Dedicated Display Quad (`UI_LCD`)**:
  - Flat, rectangular quad mesh seated inside the carved chassis bezel with $+0.2\text{ mm}$ positive clearance over backing geometry (DIAG-002).
- [ ] **Dynamic High-DPI Canvas Texture**:
  - Dynamic HTML5 canvas texture ($512 \times 256$ or $1024 \times 512$) redrawn at 10–30 FPS with telemetry.
  - `texture.flipY = false` explicitly configured.
  - Geometry UV coordinates verified upright (`uv.setY(i, 1.0 - uv.getY(i))` where required); strictly NO negative scale matrices (`scale.x = -1` prohibited).
- [ ] **Typography Orientation & Clarity (DIAG-015)**:
  - All numbers, segment digits, units (`RPM`, `min`, `sec`, `°C`), and brand labels render 100% upright in front view (`CAM_FRONT`).
  - Text strictly contained within screen boundaries; zero truncation.
- [ ] **Unpowered Screen State (DIAG-014)**:
  - When unpowered or unplugged, the LCD canvas renders completely black (`#020406`) with zero glow or backlighting.
- [ ] **Protective Optical Lens**:
  - Optical anti-reflective cover glass / acrylic window (`Glass_DisplayCover`) modeled with Three.js `MeshPhysicalMaterial` ($IOR = 1.52$, `roughness: 0.05`, `transmission: 0.92`, `thickness: 1.5`).
- [ ] **Silkscreen Faceplate Completeness (DIAG-017)**:
  - High-DPI procedural graphic faceplate overlay ($1024 \times 1024$ or $2048 \times 2048$).
  - Every tactile switch, button, and dial must have clear industrial silkscreen legends:
    - Mode switch: `TOUCH`, `OFF`, `CONT`
    - Tactile buttons: `TIMER`, `PULSE`, `TARE`, `START`, `STOP`
    - Rotary dials: radial calibration ticks and numerical values ($500\text{--}3200\text{ RPM}$)
    - Regulatory markings: voltage, frequency, power consumption, compliance (`DIN EN 61010-1`, `CE`, `cULus`).

---

## Category 5: Power & Data Infrastructure

- [ ] **External Power Cord**:
  - Heavy-duty flexible 3-conductor neoprene power cord (SJTOW specification, $\varnothing 8.5\text{ mm}$).
  - Modeled molded strain relief boot at instrument rear entry.
  - Cord draped realistically onto bench surface ($Y = 3.25\text{ mm}$ datum contact) and routing cleanly into the bench outlet box via physical catenary curves (no hovering rigid rods).
- [ ] **External Power Plug & Continuity Toggle (Rule 9, DIAG-014)**:
  - Molded vinyl/rubber 3-prong NEMA 5-15P plug with ground pin.
  - Interactive toggle:
    - When plugged in: seated firmly in top socket of bench outlet box, prongs fully concealed inside receptacle slots.
    - When unplugged: resting on the lab bench with exposed brass hot, neutral, and ground prongs.
  - Physical circuit continuity equation: `hasCircuitPower = isPluggedIn && rearPowerSwitch && logicPower`.
  - When disconnected (`isPluggedIn === false`) or rear switch is OFF:
    - Motor stops instantly ($0\text{ RPM}$, deceleration curve).
    - LCD screen turns pitch black (`#020406`) with zero glow.
    - Status LEDs go dark (`0x000000`, 0.0 intensity).
    - Status pill displays `UNPLUGGED` or `SWITCH OFF`.
    - SFX synthesizer immediately mutes.
- [ ] **External Data Ports & Cables (What does the machine use?)**:
  - Physical rear data interface ports modeled where instrument class supports communication:
    - RS-232 serial DB9 connector with hexagonal jack screws.
    - USB Type-B peripheral connector with metal shield shell.
    - RJ45 Ethernet receptacle with activity / link LEDs.
    - Analog recorder output BNC jacks (if spectrophotometer or chart recorder).
  - External shielded data cable routing from port across the bench surface when connected.
- [ ] **Internal Power: Does everything that needs power have it running from the power supply? Is there a power supply?**:
  - **Internal Power Supply (PSU)**:
    - Modeled step-down transformer with laminated electrical steel core and copper windings.
    - Bridge rectifier package with aluminum heat sink.
    - High-capacity electrolytic filter capacitors with vent cross stamping on top cans.
    - Linear/switching voltage regulation circuitry (e.g. 7805/LM317 or buck converter).
  - **Internal Power Wiring Harness**:
    - Color-coded physical 3D wire splines:
      - AC Hot (Black) and Neutral (White) routed from IEC inlet through the rear rocker switch and chassis fuse drawer to transformer primary.
      - Safety Ground (Green with Yellow stripe) bolted directly to cast metal chassis unibody via brass ground lug and M4 star washer.
      - Low-voltage DC leads (Red $+5\text{V}$, Yellow $+12\text{V}$, Black GND) routed from PSU output stage to mainboard power rails, motor driver H-bridge, and sensor arrays.
- [ ] **How is information gathered and routed? (Sensors & Signal Harness)**:
  - **Physical Sensors**:
    - Tachometer sensor: Hall-effect magnetic pickup on motor flywheel or slotted optical encoder disc on drive shaft.
    - Temperature sensing: NTC thermistor bead embedded directly in motor stator windings or chamber wall.
    - Safety interlock switches: Snap-action microswitches detecting lid closure, pan positioning, or vessel presence.
  - **Signal Routing Harness**:
    - Multi-conductor ribbon cables or twisted signal pairs routing from sensors to main MCU input ADC headers.
    - Zero floating wireless sensor magic: every reading originates from a physically modeled sensor connected via physical wiring to the control PCB.

## Category 6: Tactile Controls, Knobs & Ergonomics

- [ ] **Dedicated Physical Button Meshes (`Btn_<Action>`)**:
  - Separate 3D button meshes seated in recessed panel sockets.
  - Interactive click kinematics: depress $0.8\text{--}1.2\text{ mm}$ into panel on mousedown, return on mouseup.
  - Audio detent click on actuation.
- [ ] **Rotary Potentiometers & Dials**:
  - Realistic knurled/ribbed cylindrical skirt with pointer indicator tick.
  - Calibrated angular rotation range ($270^\circ\text{--}300^\circ$ sweep) matching silkscreen tick marks.
  - Clockwise rotation strictly increases speed/setpoint; counter-clockwise decreases (DIAG-021).
- [ ] **Toggle / Rocker Mode Switches**:
  - Authentic chrome bat lever or contoured rocker paddle.
  - Rotation detents strictly match silkscreen positions:
    - Center = `OFF` ($0^\circ$)
    - Left = `TOUCH` ($+20^\circ$)
    - Right = `CONTINUOUS` ($-20^\circ$)
- [ ] **Ergonomic Clearance (DIAG-018)**:
  - Minimum $\ge 3.5\text{ mm}$ physical separation between outer diameter of any dial/knob and adjacent LCD bezel, switches, or buttons.
  - Zero overlapping meshes; zero occlusion of numbers or status indicators.

---

## Category 7: Fasteners, Hardware & Mechanical Assembly

- [ ] **Genuine 3D Physical Fasteners (Rule 1)**:
  - Every screw, bolt, washer, and nut modeled as genuine 3D physical geometry:
    - Hex socket head cap screws (M3/M4) with authentic hexagonal internal key drive recesses.
    - Pan head machine screws with authentic Phillips / cross-recess cruciform drive slots.
    - Flat washers and split-lock spring washers seated under screw heads.
    - Hexagonal standoffs and brass threaded inserts for PCB mounting.
  - Zero 2D normal-map micro-fastener baking.
- [ ] **Coplanar Z-Fighting Prevention (DIAG-003)**:
  - No two solid meshes share identical planar coordinates.
  - All decorative overlays, bezels, and washers elevated $+0.1\text{ to }+0.4\text{ mm}$ above parent faces.

---

## Category 8: Internal Anatomy & Exploded View Kinematics

- [ ] **Comprehensive Internal Mechanical Modeling**:
  - Shaded-pole or brushless induction motor: laminated electrical steel stator core, dual enamel-coated copper magnet wire coils, rotor squirrel cage, bronze sleeve/ball bearings.
  - Heavy cast iron / zinc alloy base ballast weight with authentic casting textures.
  - 4 tuned elastomeric vibration isolation mounts with stainless steel mounting studs.
  - Dynamic eccentric drive mechanism: counterweighted flywheel, eccentric drive pin, and flexible molded rubber bellows.
  - Main controller PCB: green FR4 substrate, copper ground plane, microcontroller IC chip with gull-wing leads, ceramic capacitors, electrolytic cans, DIP switches, and screw terminal blocks.
- [ ] **Kinematic Exploded View Exposure (DIAG-020)**:
  - In exploded view, the main chassis housing MUST lift vertically ($\ge +40\text{ to }+100\text{ mm}$) to fully expose internal motor, coils, ballast, and PCB.
  - Assemblies separate along clean kinematic axes with distinct air gaps.
- [ ] **Camera Frustum Headroom & Vessel Containment (DIAG-022)**:
  - Exploded view camera framing (`CAM_EXPLODED`) must encompass the entire elevated stack (including sample tube and cap).
  - Vertical headroom $\ge 30\text{ mm}$ below top UI toolbar; zero clipping or cut-off parts.

---

## Category 9: Labware, Consumables & Fluid Dynamics

- [ ] **1:1 Authentic Labware Geometry (DIAG-019)**:
  - Standard laboratory consumables modeled with authentic physical anatomy:
    - 15 mL Falcon tube: cylindrical polypropylene body, conical tip, hemispherical bottom apex, 14 silk-screened white graduation rings ($1\text{--}15\text{ mL}$), frosted write-on label, and 24-flute royal blue HDPE screw cap.
    - 1.5 mL Microcentrifuge tube: conical bottom, attached tethered flip-cap, frosted index cap, graduation markings.
- [ ] **Authentic Ergonomic Orientation**:
  - Sample vessels in vortex mixers must incline at a natural hand-held ergonomic angle ($14^\circ\text{--}16^\circ$ off-vertical) pivoting from the cup head apex.
- [ ] **Dynamic Meniscus & Parabolic Vortex**:
  - Liquid volume modeled with realistic refractive properties (borosilicate glass $IOR = 1.47$, deionized water $IOR = 1.333$).
  - Procedural parabolic depression depth mathematically proportional to $\text{RPM}^2$ and liquid viscosity.
  - Orbital fluid oscillation synchronized with eccentric motor frequency ($2.0 \cdot \pi \cdot \text{RPM} / 60$).

---

## Category 10: Acoustic & Sensory Feedback

- [ ] **Procedural Web Audio Synthesizer**:
  - Authentic motor acoustics synthesized in real-time via Web Audio API oscillators, biquad filter nodes, and gain nodes.
  - Fundamental pitch and harmonic frequencies scale dynamically with motor RPM.
  - Resonant vibration rumble and high-RPM fluid agitation white noise.
- [ ] **Tactile Sound Effects**:
  - Crisp mechanical toggle switch snap sound on mode change.
  - Audible microswitch detent click on push buttons.
- [ ] **Audio Mute Control**:
  - Global `Mute SFX` toggle button in top toolbar with persistent mute state.

---

## Category 11: Pre-Flight Visual QA & Release Verification Process

- [ ] **Local Server Active**: Server running at `http://127.0.0.1:8765`.
- [ ] **Automated Multi-Angle CDP Audit**:
  - Execute automated visual QA script (`.master/05_PERSONAL_MISC/tools/<twin>_visual_qa.mjs`).
  - Capture all 6 standardized high-resolution screenshots:
    1. `CAM_ISO`: Isometric $3/4$ perspective, bench clearance, power cord continuity.
    2. `CAM_FRONT`: Upright typography, zero dial/display occlusion, brand badge containment.
    3. `CAM_SIDE`: Profile silhouette, rear switch illumination, cord bench routing.
    4. `CAM_TOP`: Concentric alignment of cup head, vessel, console, and bench outlet.
    5. `CAM_EXPLODED`: Complete vertical mechanical separation with zero top-toolbar clipping.
    6. `STATE_ACTIVE`: Dynamic high-speed agitation, glowing LCD, green status LED, seated plug.
- [ ] **Mandatory Closed-Loop Visual Review (`view_file`)**:
  - Agent MUST call `view_file` on every single screenshot artifact before requesting signoff.
- [ ] **Zero Browser Console Exceptions**:
  - Visual audit output must confirm `Total exceptions: 0`.
- [ ] **100% Pass on Controller Unit Tests**:
  - Run `python3 <twin>/software/controller/test_controller.py` $\rightarrow$ 100% pass rate.
- [ ] **100% Pass on Twin Package Verifier**:
  - Run `bash scripts/verify_twin.sh <twin>` $\rightarrow$ 0 errors.
- [ ] **Git & Deployment Verification**:
  - Clean `git status`, descriptive commit message, push to `origin/main` (`BypassSandbox: true`).
  - Confirm GitHub Actions workflow completion with `gh run list` (`✓ SUCCESS`).
