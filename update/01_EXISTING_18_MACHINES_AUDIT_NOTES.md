# Audit Notes & Remediation Blueprints: All 18 Existing Machine Twins

> **AUDIT BASIS**: Every note below combines the Lab Director's visual/functional verdicts with empirical file-level inspection, viewer line counts (`wc -l`), and automated execution of `node scripts/oga_validator.mjs <twin_dir>`.

---

## Tier 0 — Locked Gold Standard Reference Machines (Do Not Alter)

### 1. Microcentrifuge (`centrifuge_twin`)
- **User Assessment**: *"The Microcentrifuge is perfect!!"*
- **Directory**: [`centrifuge_twin/`](file:///Users/Samuel/AGapps/Twins/centrifuge_twin)
- **OEM Reference**: Eppendorf 5424R / Thermo Sorvall Legend Micro-class Refrigerated Microcentrifuge
- **Baseline Metrics**: **12,981 viewer LOC** (`centrifuge3d.js`: 2,702, `app.js`: 4,841, `style.css`: 3,988, `sfx.js`: 979, `index.html`: 471) · **25 / 25 OGA Gates PASSED** · Includes `CENTRIFUGE_Social_Walkthrough.mp4` + 10-stem `docs/audio/`.
- **Status & Action**: **LOCKED GOLD STANDARD TEMPLATE #1**. Zero edits allowed. Serves as the canonical reference for CSS layout, 3-panel collapsible UI, internal electronics/motor bay, power continuity, and 10-chapter guided tour.

### 2. ERWEKA Tablet Disintegrator (`disintegration_tester_twin`)
- **User Assessment**: *"The ERWEKA tablet disintegrator is perfect."*
- **Directory**: [`disintegration_tester_twin/`](file:///Users/Samuel/AGapps/Twins/disintegration_tester_twin)
- **OEM Reference**: ERWEKA ZT 322 Dual-Station USP `<701>` Disintegration Tester
- **Baseline Metrics**: **10,461 viewer LOC** (`disintegration3d.js`: 4,053, `app.js`: 1,682, `style.css`: 4,007, `sfx.js`: 248, `index.html`: 471) · **25 / 25 OGA Gates PASSED** · Includes `ERWEKA_ZT322_Social_Walkthrough.mp4` + `docs/audio/`.
- **Status & Action**: **LOCKED GOLD STANDARD TEMPLATE #2**. Zero edits allowed. Serves as the canonical reference for Gate 5 internal wiring (`Body_Wire_*`), multi-motor suites, 45° optical relay mirrors (`Mirror_OpticalRelay`), Wi-Fi/BLE (`WiFi_BLE`, `Antenna_WiFi`), and 1080p walkthrough video generation.

### 3. Shimadzu UV-1900i Spectrophotometer (`spectrophotometer_twin`)
- **User Assessment**: *"The UV 1900i Spectrophotometer is perfect"*
- **Directory**: [`spectrophotometer_twin/`](file:///Users/Samuel/AGapps/Twins/spectrophotometer_twin)
- **OEM Reference**: Shimadzu UV-1900i / Dual-Beam Czerny-Turner UV-Vis Spectrophotometer
- **Baseline Metrics**: **7,938 viewer LOC** (`spectrophotometer3d.js`: 5,160, `app.js`: 1,367, `index.html`: 604, `style.css`: 661, `sfx.js`: 146).
- **OGA Linter Note**: Passes 13/25 automated regex rules (fails regex matches for `Power_Receptacle_Duplex`, `Part_RAM_Chip`/`Part_SSD_Module`, `Assembly_PowerSupply`, `Fan_CabinetCooling_Blower`, and Gate 5 `INT-02..04`/`PRES-01..02`).
- **Status & Action**: **LOCKED VISUAL REFERENCE #3**. Do **not** alter its exterior housing, optical bench, or cuvette/mirror ray geometry. Only consider non-visual Gate 5 tour/video addition later if requested separately by the user.

---

## Tier 1 — Almost There (Targeted Fixes & Gate 5 Completion)

### 4. Agilent 708-DS Dissolution Tester (`dissolution_tester_twin`)
- **User Assessment**: *"The AGILENT 708-DS is almost there just a few fixes"*
- **Directory**: [`dissolution_tester_twin/`](file:///Users/Samuel/AGapps/Twins/dissolution_tester_twin)
- **OEM Reference**: Agilent 708-DS 8-Vessel USP `<711>` Tablet Dissolution Apparatus
- **Baseline Metrics**: **4,294 viewer LOC** (`dissolution3d.js`: 2,474, `app.js`: 822, `index.html`: 189, `style.css`: 550, `sfx.js`: 259) · **20 / 25 OGA Gates PASSED**.
- **Exact OGA Failures**: Only Gate 5 items fail (`INT-02`, `INT-03`, `INT-04`, `PRES-01`, `PRES-02`). Gates 1–4 (`TAX-01..06`, `PWR-01..04`, `UV-01..03`, `BAY-01..06`, `INT-01`) already pass 100%.
- **Identified Gaps**:
  - Missing semantic naming/meshes for `Motor_Drive`, `Motor_Lift`, `Motor_BathPump` (needed to satisfy `INT-02`), `Sensor_PT100` & `Mirror_OpticalRelay` (`INT-03`), and `WiFi_BLE` / `Antenna_WiFi` + `USB_Drive` (`INT-04`).
  - Lacks `TOUR_CHAPTERS` (`PRES-01`) and `docs/*_Social_Walkthrough.mp4` (`PRES-02`).
  - Minor visual polish needed on evaporation-cover seating, sampling cannula alignment, and spindle belt guard detail.
- **Remediation Spec**:
  1. Preserve the existing 8-vessel bath, TruCenter collars, and synchronous drive head geometry.
  2. Rename/upgrade the internal elevator motor, spindle motor, and external heater-circulator pump to expose `Motor_Lift`, `Motor_Drive`, and `Motor_BathPump`, add dual vessel/bath `Sensor_PT100` probes + optical tablet-drop sensor (`Mirror_OpticalRelay`), and mount a shielded `WiFi_BLE` module with rear `Antenna_WiFi` & `USB_Drive` on `PCB_Motherboard`.
  3. Add 10-chapter `TOUR_CHAPTERS` + `#tourOverlay` in `app.js`, write `docs/presentation_voiceover_script.md`, and master the 1080p MP4 walkthrough video.

### 5. Ultrasonic Cleaner (`ultrasonic_cleaner_twin`)
- **User Assessment**: *"The ultrasonic is almost there. Work on the inside."*
- **Directory**: [`ultrasonic_cleaner_twin/`](file:///Users/Samuel/AGapps/Twins/ultrasonic_cleaner_twin)
- **OEM Reference**: Branson CPX Series / 3000-PRO Ultrasonic Cavitation Cleaning Bath
- **Baseline Metrics**: **3,087 viewer LOC** (`ultrasonic3d.js`: 1,280, `app.js`: 1,266, `index.html`: 185, `style.css`: 254, `sfx.js`: 102) · **20 / 25 OGA Gates PASSED**.
- **Exact OGA Failures**: Passes all 20 gates in Gates 1–4 + `INT-01`; fails only the 5 Gate 5 checks (`INT-02`, `INT-03`, `INT-04`, `PRES-01`, `PRES-02`).
- **Identified Gaps**:
  - Exterior tank, basket, and sloped console are solid, but the internal tank-bottom and lower electronics chassis lack industrial piezo transducer depth and high-frequency generator detail.
  - Missing complete **PZT-4 Piezoelectric Langevin Stack Transducers**, HF sweep generator transformer coils, silicone tank heater pads + thermal fuse, internal motorized drain valve (`Motor_Drive` / `Motor_BathPump`), `Sensor_PT100` bath RTD, `Mirror_OpticalRelay` optical liquid-level interlock, and `WiFi_BLE` + `Antenna_WiFi`.
- **Remediation Spec**:
  1. Keep the exterior 340 × 200 mm housing, stainless lid, wire basket, and sloped console.
  2. Rebuild the interior cavity beneath the deep-drawn 316L tank: 4 bolted Langevin sandwich transducers (steel rear mass, dual yellow/tan PZT-4 piezoceramic rings, beryllium-copper electrode tabs, aluminum front matching horn epoxied to tank bottom, central M8 prestress bolt), 40 kHz HF inverter driver PCB with toroidal ferrite transformers and finned MOSFET heatsink, etched polyimide/silicone tank heater blanket with `Sensor_PT100` probe, motorized/ball drain valve routing to rear barb, optical liquid-level sensor (`Mirror_OpticalRelay`), and `WiFi_BLE` telemetry card.
  3. Upgrade `CAM_EXPLODED` vertical lift so the tank + piezo transducers + generator PCB + power supply separate cleanly along $+Y$.
  4. Add `TOUR_CHAPTERS` and `docs/*_Social_Walkthrough.mp4`.

### 6. Muffle Furnace (`muffle_furnace_twin`)
- **User Assessment**: *"The muffle furnace needs some work"*
- **Directory**: [`muffle_furnace_twin/`](file:///Users/Samuel/AGapps/Twins/muffle_furnace_twin)
- **OEM Reference**: Carbolite Gero CWF 1100 / Nabertherm LT 9/11 High-Temp Ceramic Fibre Muffle Furnace
- **Baseline Metrics**: **3,379 viewer LOC** (`muffle_furnace3d.js`: 1,660, `app.js`: 935, `index.html`: 215, `style.css`: 368, `sfx.js`: 201) · **20 / 25 OGA Gates PASSED**.
- **Exact OGA Failures**: Fails Gate 5 (`INT-02`, `INT-03`, `INT-04`, `PRES-01`, `PRES-02`).
- **Identified Gaps**:
  - Needs visual refinement on the counterbalanced vertical lift door mechanism (ensuring smooth 4-bar parallel/guided linkage without slot gaps), crisper stepped mullite refractory brick face & Kanthal A-1 heating coil geometry, Type-S platinum/rhodium thermocouple sheath + cold-junction `Sensor_PT100`, motorized exhaust draft fan (`Motor_Drive`) + door safety interlock microswitch actuator, `Mirror_OpticalRelay` optical pyrometer sight tube, `WiFi_BLE` module, and richer Eurotherm 3216 PID console silkscreen/LCD polish.
- **Remediation Spec**:
  1. Refine exterior double-wall convective louvers, stepped ceramic throat collar, and internal 4-bar lift-door guide rails + gas struts.
  2. Populate Gate 5 anatomy (`Motor_Drive` exhaust blower, `Motor_Lift` damper/latch actuator, `Sensor_PT100` cold junction, `Mirror_OpticalRelay` optical door/pyrometer sensor, `WiFi_BLE`, `Antenna_WiFi`, `USB_Drive`) and verify full AC/DC wiring harness routing (`Body_Wire_*`).
  3. Add 10-chapter `TOUR_CHAPTERS` and narrated 1080p walkthrough video.

---

## Tier 2 — Interior-Only Overhauls (Preserve Approved Exteriors)

### 7. Analytical Balance (`balance_twin`)
- **User Assessment**: *"The analytical Balance is pretty good. Just needs the proper insides but externally looks great"*
- **Directory**: [`balance_twin/`](file:///Users/Samuel/AGapps/Twins/balance_twin)
- **OEM Reference**: Mettler Toledo XPE205 / XSE204 0.1 mg Analytical Balance
- **Baseline Metrics**: **3,139 viewer LOC** (`balance3d.js`: 1,443, `app.js`: 984, `index.html`: 165, `style.css`: 348, `sfx.js`: 199) · **6 / 25 OGA Gates PASSED** (fails 19 gates).
- **Exact OGA Failures**: `TAX-01`, `TAX-03`, `TAX-05`, `TAX-06`, `PWR-01..04`, `UV-02`, `BAY-01..05`, `INT-02..04`, `PRES-01..02`.
- **Remediation Spec (STRICT RULE: Preserve External Form)**:
  1. Keep the exact external die-cast chassis silhouette, 3-door sliding borosilicate glass draft shield, SmartGrid weighing pan, spirit bubble level, and sloped front terminal aesthetics.
  2. Rename/refactor existing exterior meshes to comply with Semantic Taxonomy (`Body_Chassis`, `Btn_*`, `Foot_Leveling_*`, `Badge_SREdesigns`) and convert front decals/LCD to `createDecalQuad` (`UV-02`).
  3. Build an authentic **MonoBloc Electromagnetic Force Restoration (EMFR) Cell** inside the rear compartment:
     - Machined aluminum monolithic flexure parallelogram beam with thin EDM neck flexures and overload stops.
     - Cylindrical rare-earth NdFeB/AlNiCo magnet pot + suspended copper compensation voice coil + gold hairspring current leads.
     - Optical position null-detector (`Mirror_OpticalRelay` + slotted vane + IR LED/photodiode).
     - Motorized internal calibration mass mechanism (`Motor_Lift` + eccentric cam + two stainless Class E2 reference weights).
     - Internal ambient temperature compensation probe (`Sensor_PT100`) and cooling blower (`Fan_CabinetCooling_Blower`).
  4. Build full `PCB_Motherboard` (32-bit `Part_MCU_Core`, 24-bit sigma-delta ADC, `Part_RAM_Chip`, `Part_SSD_Module`, `WiFi_BLE` + `Antenna_WiFi`), `Assembly_PowerSupply` (shielded low-noise linear PSU + toroidal transformer + filter caps), `Body_Wire_*` harness, and `Power_Receptacle_Duplex` / `Power_Plug_NEMA` / `Power_Cord_SJTOW` + `isPluggedIn` hard power cutoff in `app.js`.
  5. Add clean vertical `CAM_EXPLODED` separation and `TOUR_CHAPTERS` + walkthrough video.

### 8. Fourier-Transform Infrared Spectrometer (`ftir_twin`)
- **User Assessment**: *"The Fourier-Transform Infrared Spectrometer needs work on the inside"*
- **Directory**: [`ftir_twin/`](file:///Users/Samuel/AGapps/Twins/ftir_twin)
- **OEM Reference**: Thermo Scientific Nicolet iS50 Research FTIR with Built-In Diamond ATR
- **Baseline Metrics**: **6,470 viewer LOC** (`ftir3d.js`: 4,319, `app.js`: 947, `index.html`: 344, `style.css`: 708, `sfx.js`: 152) · **12 / 25 OGA Gates PASSED** (fails 13 gates).
- **Exact OGA Failures**: `PWR-01..03` (missing `Power_Receptacle_Duplex`, `Power_Plug_NEMA`, `Power_Cord_SJTOW`), `UV-02`, `BAY-02..05` (missing `Part_MCU_*`, `Part_RAM_Chip`/`Part_SSD_Module`, `Assembly_PowerSupply`, `Fan_CabinetCooling_Blower`), `INT-02..04`, `PRES-01..02`.
- **Remediation Spec (Preserve Exterior + Upgrade Optical Bench & Electronics Interior)**:
  1. Keep the outer Nicolet iS50 casing, monolithic diamond ATR pressure tower, and rear I/O plate.
  2. Complete the internal hermetically sealed optical bench & interferometer kinematics:
     - **Vectra Michelson Interferometer**: Voice-coil linear scan motor (`Motor_Drive`) moving dynamic mirror on frictionless air/flexure carriage, fixed cube-corner retroreflector, angled KBr/Ge $45^\circ$ beamsplitter with compensator plate, and dynamic laser alignment piezo actuators (`Motor_Lift`).
     - **HeNe Reference Laser + Optical Relays**: 632.8 nm red HeNe laser tube + quadrature photodiode + gold off-axis parabolic collimating/focusing mirrors (`Mirror_OpticalRelay`) routing the IR beam through the sample compartment and diamond ATR crystal into DLaTGS / LN2 MCT detectors.
     - **Thermal, Purge & Desiccant Bay**: Ever-Glo ceramic mid-IR source with finned heatsink & `Sensor_PT100`, regenerative desiccant canister, and purge air/N2 manifold.
  3. Upgrade `PCB_Motherboard` to include explicit `Part_MCU_Core`, `Part_RAM_Chip`, `Part_SSD_Module`, `WiFi_BLE` + `Antenna_WiFi`, `Assembly_PowerSupply` (multi-rail low-noise PSU + toroidal transformer), `Fan_CabinetCooling_Blower`, and `createDecalQuad` UVs (`UV-02`).
  4. Add benchtop `Power_Receptacle_Duplex`, `Power_Plug_NEMA`, `Power_Cord_SJTOW` catenary cord, plus 10-chapter `TOUR_CHAPTERS` and walkthrough video.

---

## Tier 3 — Exterior Redesign & Full Electromechanical Internals

### 9. Vacuum Pump (`vacuum_pump_twin`)
- **User Assessment**: *"The Vacuum pump please inspect the exterior closely and make it look much more professional."*
- **Directory**: [`vacuum_pump_twin/`](file:///Users/Samuel/AGapps/Twins/vacuum_pump_twin)
- **OEM Reference**: KNF LABOPORT N 820.3 FT.40P / Vacuubrand MD 4C NT Two-Stage Chemical Diaphragm Pump
- **Baseline Metrics**: **2,887 viewer LOC** (`vacuum_pump3d.js`: 1,266, `app.js`: 747, `index.html`: 197, `style.css`: 442, `sfx.js`: 235) · **9 / 25 OGA Gates PASSED** (fails 16 gates).
- **Exact Code-Level Inspection Findings**:
  1. **Primitive Box Exterior**: In `vacuum_pump3d.js` lines 386–415 and 718–724, `lowerHousing` is constructed from 4 flat box slabs (`lhFloor`, `sideWall`, `rearWall`) and `upperShell` is a plain rectangular block (`box(3.12, 0.45, 1.60)`), giving a blocky amateur look instead of a precision molded KNF/Vacuubrand housing.
  2. **Mesh Collision on Front Fascia**: Line 774 places `Port_Vacuum_Inlet_KF25` at `(-0.85, 0.52, -0.84)`, which intersects straight through the front console faceplate (`Plate_ConsoleFace` at `Z = -0.80`, width `2.80`, spanning `X = -1.40..+1.40`)!
  3. **Missing Taxonomy & Digital Controller**: Fails `TAX-01` (`Body_Chassis`), `TAX-02` (`UI_LCD`), `TAX-05` (`Foot_Leveling_*`), `PWR-02..04` (`Power_Plug_NEMA`, `Power_Cord_SJTOW`, `isPluggedIn`), `BAY-01..06`, `INT-03..04`, `PRES-01..02`.
- **Remediation Spec**:
  1. **Professional Industrial Exterior Overhaul**:
     - Model a sculpted two-piece cast aluminum motor/crankcase housing (`Body_Chassis`) with extruded bevels (`ExtrudeGeometry`), recessed side heat-sink fin arrays, and flush split-line bolts.
     - Relocate the **KF25/NW16 Inlet Port & Vacuum Control Manifold** to the top-rear / upper manifold deck (completely eliminating the front console collision!) with an anodized aluminum vacuum separator catchpot (`Glass_SeparatorFlask`) on the side/rear.
     - Expose twin **precision CNC-machined PVDF/PTFE cylindrical diaphragm pump heads** protruding cleanly through molded elastomer collars on top, clamped by bolted stainless steel pressure rings (6× DIN 912 M4 screws each) and linked by curved PTFE tubing with brass Swagelok compression nuts.
     - Add an angled **top-front dual display pod**: analog WIKA Bourdon vacuum dial gauge alongside a recessed digital `UI_LCD` (showing mbar/Torr, pump RPM, run-time, and thermal status), backlit tactile `Btn_*` switches, fine-needle gas-ballast valve knob, and ergonomic curved carry handle.
  2. **Complete Electronics & Continuity**: Add `PCB_Motherboard` (MCU, RAM, SSD, `WiFi_BLE`), `Assembly_PowerSupply` (rectifier, filter caps, transformer, heatsink), `Fan_CabinetCooling_Blower`, `Sensor_PT100` stator thermistor, `Mirror_OpticalRelay` optical tach encoder, rear I/O ports, and `Power_Plug_NEMA` / `Power_Cord_SJTOW` + `isPluggedIn` logic.
  3. Add 10-chapter `TOUR_CHAPTERS` and walkthrough video.

### 10. Stir Heat — Hotplate Magnetic Stirrer (`hotplate_twin`)
- **User Assessment**: *"Stir heat needs the inside done with power supply and all necessary actual parts to make working machine and better materials and design."*
- **Directory**: [`hotplate_twin/`](file:///Users/Samuel/AGapps/Twins/hotplate_twin)
- **OEM Reference**: IKA C-MAG HS 7 Digital / RCT basic Magnetic Hotplate Stirrer
- **Baseline Metrics**: **2,615 viewer LOC** (`hotplate3d.js`: 1,064, `app.js`: 828, `index.html`: 162, `style.css`: 356, `sfx.js`: 205) · **9 / 25 OGA Gates PASSED** (fails 16 gates).
- **Exact OGA Failures**: Fails `PWR-01..04`, `UV-02`, `BAY-01..06`, `INT-02..04`, `PRES-01..02`.
- **Remediation Spec**:
  1. **Better Exterior Materials & Industrial Design**:
     - Upgrade chassis (`Body_Chassis`) to an extruded/beveled die-cast zinc-aluminum wedge profile with authentic textured chemical-resistant powder coat (slate/blue-gray body + dark anodized front console bezel), recessed stainless spill-diversion gutter around the top plate, and crisp Pyroceram white glass-ceramic plate with high-contrast warning silkscreen & dynamic red-orange "HOT" thermal border glow.
     - Upgrade front console (`UI_LCD` via `createDecalQuad` with upright UVs) with dual knurled anodized rotary encoders (`Knob_Temp`, `Knob_Speed`) having $\ge 3.5\text{ mm}$ bezel clearance and tactile push-to-set travel, plus raised `Btn_*` keys (`Btn_Heat`, `Btn_Stir`, `Btn_Timer`, `Btn_Power`) and front `Badge_SREdesigns` on the lower apron.
     - Upgrade the rear M10 support rod, double bosshead clamp, coiled silicone cable, PT1000 stainless immersion probe, and 250 mL borosilicate beaker with dynamic parabolic stir vortex + PTFE stir bar.
  2. **Complete Real Working Internals**:
     - **Heating Assembly**: Cast aluminum heat-spreader block under ceramic top, mica-insulated nichrome spiral heating element (`Heater_NichromeSpiral`), ceramic fiber thermal insulation tray, dual over-temperature safety cutoff bi-metal switch (`Switch_ThermalCutoff`), and bonded `Sensor_PT100` plate thermistor.
     - **Magnetic Stirring Drive**: Brushless DC pancake motor (`Motor_Drive`) on rubber isolation mounts, balanced aluminum yoke carrying opposing **NdFeB permanent drive magnets** rotated below the heater block, and slotted optical tachometer disc (`Mirror_OpticalRelay`).
     - **Power Supply & Electronics Bay**: Isolated lower electronics bay separated by an aluminized heat-baffle shield, containing `Assembly_PowerSupply` (step-down transformer, bridge rectifier, filter caps, 5V/24V regulators), `PCB_Motherboard` (`Part_MCU_Core`, `Part_RAM_Chip`, `Part_SSD_Module`, Crydom TRIAC/SSR on finned aluminum heatsink, `WiFi_BLE` + `Antenna_WiFi`), `Fan_CabinetCooling_Blower`, color-coded `Body_Wire_*` harness, rear DIN-5 PT1000 socket + `Port_USB` + `Port_RS232` + `Port_IEC`, and full `Power_Receptacle_Duplex` / `Power_Plug_NEMA` / `Power_Cord_SJTOW` continuity.
  3. Add 10-chapter `TOUR_CHAPTERS` and walkthrough video.

### 11. Rotary Evaporator (`rotovap_twin`)
- **User Assessment**: *"The Rotory evaporator does not meet standards"*
- **Directory**: [`rotovap_twin/`](file:///Users/Samuel/AGapps/Twins/rotovap_twin)
- **OEM Reference**: Heidolph Hei-VAP Precision / Buchi Rotavapor R-300
- **Baseline Metrics**: **2,926 viewer LOC** (`rotovap3d.js`: 1,315, `app.js`: 878, `index.html`: 203, `style.css`: 351, `sfx.js`: 179) · **14 / 25 OGA Gates PASSED** (fails 11 gates).
- **Exact OGA Failures**: `TAX-01`, `PWR-03`, `BAY-01`, `BAY-03..06`, `INT-03..04`, `PRES-01..02`.
- **Remediation Spec**:
  1. **Base Chassis & Heated Bath Upgrade**: Add unified `Body_Chassis` structural base with recessed digital bath control pod, removable stainless steel 4.5L heating bath bowl with silicone handles, internal serpentine tubular immersion heater, float level switch, and `Sensor_PT100` bath RTD.
  2. **Lift Column & Rotary Drive Accuracy**: Refine the motorized lift column (`Motor_Lift` stepper, Acme leadscrew, bronze traveling nut, dual chrome rails, upper/lower limit microswitches, nylon drag chain) and rotary head (`Motor_Drive` BLDC, worm gear, hollow PTFE/borosilicate vapor duct with spring-loaded lip seal, ergonomic Combi-Clip flask release nut).
  3. **Glassware & Vacuum Plumbing**: Upgrade borosilicate `Glass_Condenser` double-helix cooling coil with GL14 blue polypropylene hose barbs, insulated coolant tubing, angled vapor duct, 1L pear-shaped evaporating flask with live climbing-film/vortex shader, 1L spherical receiving flask with Keck/ball-joint clamp, and PTFE vacuum feed with bleed stopcock.
  4. **Full Electronics & Power Continuity**: Add `PCB_Motherboard` (`Part_MCU_Core`, `Part_RAM_Chip`, `Part_SSD_Module`, `WiFi_BLE`), `Assembly_PowerSupply`, `Fan_CabinetCooling_Blower`, `Mirror_OpticalRelay` (optical lift encoder / vapor sensor), rear I/O ports (`Port_RS232`, `Port_USB`, `Port_RJ45`, `Port_IEC`), `Power_Cord_SJTOW`, and Gate 5 `TOUR_CHAPTERS` + walkthrough video.

---

## Tier 4 — Complex Multi-Assembly Overhauls

### 12. Inert Atmosphere Glove Box (`glove_box_twin`)
- **User Assessment**: *"The glove box has weird floating parts and is just in general ugly and needs work."*
- **Directory**: [`glove_box_twin/`](file:///Users/Samuel/AGapps/Twins/glove_box_twin)
- **OEM Reference**: MBraun UNIlab Pro Inert Atmosphere Workstation (3-Glove / Dual Antechamber Class)
- **Baseline Metrics**: **2,876 viewer LOC** (`glove_box3d.js`: 1,102, `app.js`: 980, `index.html`: 196, `style.css`: 333, `sfx.js`: 265) · **13 / 25 OGA Gates PASSED** (fails 12 gates).
- **Exact Code-Level Floating Parts & Geometry Defects Found**:
  1. **Floating Antechamber Gauge**: `glove_box3d.js` line 526 places `gaugeGroup` at `(0, anteRadius + 0.65, -0.60)` — floating completely disconnected in mid-air above the cylindrical antechamber (`anteRadius = 1.30`) with no pipe riser or brass tee!
  2. **Floating Antechamber Valves**: Lines 560 & 566 place `vacValve` and `purgeValve` at `y = anteRadius + 0.35, z = 0.40`. At `z = 0.40`, the cylinder surface height is only $\sqrt{1.3^2 - 0.4^2} = 1.237$, leaving a huge air gap beneath the knobs with no valve bodies or stems!
  3. **Floating Gas Purifier Assembly**: Lines 577–614 place `purifierGroup` (copper column, blower, pipe, O2/H2O sensors) suspended behind the chamber at `Z = CHAMBER_D/2 + 0.80` with zero mounting brackets, base frame, or flanged duct connections into the chamber wall!
  4. **Floating Straight Orange Vacuum Hose**: Line 859 (`vacHose`) is a rigid straight cylinder tilted at `rotation.z = -0.35` hovering between the rotary pump and antechamber instead of a routed flexible KF25 bellows hose!
  5. **Floating Console Mounting Arm**: Line 878 (`arm1`) is a floating angled stick detached from both the frame corner post and the console bezel!
  6. **Boxy Aesthetics & Crude Gloves**: Front window is a flat vertical slab instead of a true $12^\circ$ sloped polycarbonate/safety-glass windshield, and the butyl gloves are straight cylinders ending in rectangular blocks (`box(0.70, 0.25, 0.90)`).
- **Remediation Spec (Complete Ground-Up Architectural & Mechanical Rebuild)**:
  1. **Sculpted 304L Chamber & Sloped Windshield**: Tapered front profile with a true **$12^\circ$ sloped front safety-glass viewing window** (`Glass_ViewPanel`) bolted into a chamfered stainless clamping frame (`Fastener_*`), seamless welded radiused corners, and dual internal HEPA/gas diffuser manifolds on the rear ceiling.
  2. **Anatomical Accordion Butyl Gloves**: Lathe/lofted pleated butyl rubber sleeves with grooved Delrin port rings, O-ring clamping bands, and articulated 5-finger glove hands resting naturally inside the chamber.
  3. **Hard-Mounted Main + Mini Antechambers**: Main cylindrical antechamber ($\varnothing 390\text{ mm}$) + mini-antechamber on the right flank with cantilevered spindle-lock swing doors, sliding stainless internal trays on rails, and **welded stainless NPT/Swagelok risers** anchoring the Bourdon gauge and 3-way ball valves directly to the cylinder shell (zero floating parts).
  4. **Integrated Side Purifier Cabinet & Hard Plumbing**: Floor-standing enclosed stainless **MBraun Gas Purifier Module** bolted to the main stand frame, housing dual copper-catalyst/molecular-sieve columns, heater jackets, `Motor_Drive` circulation blower, flanged KF40 supply/return ducts entering the chamber, `Sensor_PT100` + electrochemical O2/H2O analyzers, and flexible `TubeGeometry` KF25 stainless bellows hose connecting the rotary vane vacuum pump (`Motor_Harmonic`) cleanly to the antechamber manifold.
  5. **Articulated VESA Touchscreen Console & Complete PLC Bay**: Multi-joint VESA swing arm bolted directly to the upper stand upright, `UI_LCD` color PLC HMI (`Btn_*` with vector silkscreen `UV-03`), internal PLC cabinet with `PCB_Motherboard` (`Part_MCU_Core`, `Part_RAM_Chip`, `Part_SSD_Module`, `WiFi_BLE` + `Antenna_WiFi`), `Assembly_PowerSupply`, color-coded `Body_Wire_*` harness, `Mirror_OpticalRelay` pressure/photo sensor, rear I/O ports, and `TOUR_CHAPTERS` + walkthrough video.

### 13. Labconco FreeZone Freeze Dryer (`freeze_dryer_twin`)
- **User Assessment**: *"The Labconoco Freezone needs a lot of work"*
- **Directory**: [`freeze_dryer_twin/`](file:///Users/Samuel/AGapps/Twins/freeze_dryer_twin)
- **OEM Reference**: Labconco FreeZone 4.5L (-84°C) Cascade Benchtop Freeze Dryer + 12-Port Acrylic Drying Manifold + Edwards RV5 Pump
- **Baseline Metrics**: **2,734 viewer LOC** (`freeze_dryer3d.js`: 1,114, `app.js`: 704, `index.html`: 161, `style.css`: 529, `sfx.js`: 226) · **14 / 25 OGA Gates PASSED** (fails 11 gates).
- **Exact OGA Failures**: Fails `BAY-01..06`, `INT-02..04`, `PRES-01..02`.
- **Remediation Spec**:
  1. **Authentic Labconco FreeZone Exterior**: Sculpted glacier-white/teal-accented steel cabinet (`571 × 673 × 469 mm` base), louvered condenser grilles, front quick-disconnect defrost drain hose port, recessed sloped Lyo-Works capacitive touchscreen console (`UI_LCD` displaying $-84.2^\circ\text{C}$ collector, $0.014\text{ mbar}$ vacuum, vacuum/collector trend graph), tactile `Btn_*` switches, and lower-frame `Badge_SREdesigns`.
  2. **4.5L Ice Collector & 12-Port Drying Manifold**: Deep 304L stainless steel collector well with visible helical refrigerant evaporator coil + dynamic crystalline ice accumulation layer + `Sensor_PT100` collector probe, $3/4"$ thick clear acrylic collector lid with black neoprene O-ring, vertical acrylic drying drum with 12 molded 3-piece Quick-Seal neoprene valves (`Valve_QuickSeal_1..12`), and 4–6 attached borosilicate Fast-Freeze flasks containing lyophilized cake solids.
  3. **Cascade Refrigeration & Vacuum Internals**: Populate the complete lower machinery bay with two-stage cascade refrigeration hardware: Stage-1 (R404A/R290) and Stage-2 (R508B/Ethane) hermetic compressors (`Motor_Harmonic`), finned copper-tube condenser with `Fan_CabinetCooling_Blower`, brazed-plate interstage heat exchanger, thermal expansion valves, insulated suction lines, Pirani vacuum transducer (`Mirror_OpticalRelay` / pressure bridge), external Edwards RV5 two-stage rotary vane pump (`Motor_Drive`) linked via corrugated KF25 stainless bellows hose, `PCB_Motherboard` (MCU, RAM, SSD, `WiFi_BLE` + `Antenna_WiFi`), `Assembly_PowerSupply`, rear I/O ports (`Port_USB`, `Port_RJ45`, `Port_RS232`, `Port_IEC`), and `TOUR_CHAPTERS` + walkthrough video.

### 14. Parr High-Pressure Stirred Mini-Reactor (`high_pressure_reactor_twin`)
- **User Assessment**: *"TheParr reactor needs a lot of work"*
- **Directory**: [`high_pressure_reactor_twin/`](file:///Users/Samuel/AGapps/Twins/high_pressure_reactor_twin)
- **OEM Reference**: Parr 4560 600 mL 200-Bar Benchtop Stirred Mini-Reactor + Parr 4848 PID Reactor Controller
- **Baseline Metrics**: **4,231 viewer LOC** (`reactor3d.js`: 1,924, `app.js`: 1,177, `index.html`: 296, `style.css`: 494, `sfx.js`: 340) · **10 / 25 OGA Gates PASSED** (fails 15 gates).
- **Exact OGA Failures**: Fails `TAX-01` (`Body_Chassis`), `PWR-02..04` (missing `Power_Plug_NEMA`, `Power_Cord_SJTOW`, `isPluggedIn`), `BAY-01..06` (no motherboard/MCU/RAM/SSD/PSU/fan/rear I/O inside the 4848 controller!), `INT-02..04`, `PRES-01..02`.
- **Remediation Spec**:
  1. **Parr 4560 Vessel & Mechanical Precision**: Refine the cast-iron floor stand, chrome vertical support mast, spring-loaded drop-away ceramic fiber furnace/band heater shroud, thick-walled 316L SS pressure bomb, bolted split-ring closure with drop-safety band and 6× Grade B7 hex bolts (`Fastener_*`), Parr **A1120HC magnetic stirrer drive housing** (external drive magnet, cooling fins, `Motor_Drive` variable-speed DC motor, drive belt cover, Hall-effect tach sensor), internal 4-blade turbine impeller, U-tube cooling loop, dip tube, `Sensor_PT100` / Type-J thermowell, forged needle valves (N2 purge, H2 feed, liquid sample, vent), Inconel rupture disc assembly, high-DPI WIKA Bourdon pressure gauge + 4–20 mA pressure transducer, and braided armored heater/thermocouple umbilical cables to the controller.
  2. **Parr 4848 Controller Enclosure & Full Internals**: Upgrade the companion **Parr 4848 Controller** box (`Body_Chassis`) with recessed multi-zone PID `UI_LCD` (temperature, pressure bar/psi, RPM, ramp/soak status), tactile `Btn_*` + emergency vent/heater cutoff, and populate its full interior: `PCB_Motherboard` (`Part_MCU_Core`, `Part_RAM_Chip`, `Part_SSD_Module`, `WiFi_BLE` + `Antenna_WiFi`), `Assembly_PowerSupply` (toroidal transformer, rectifier, caps), Crydom 40A SSR on finned aluminum heatsink, `Fan_CabinetCooling_Blower`, `Mirror_OpticalRelay` optical tach/over-pressure interlock, rear bulkhead (`Port_RS232`, `Port_USB`, `Port_RJ45`, `Port_IEC`), and `Power_Plug_NEMA` / `Power_Cord_SJTOW` + `isPluggedIn` hard continuity cutoff.
  3. Add 10-chapter `TOUR_CHAPTERS` and walkthrough video.

---

## Tier 5 — Archive & Brand-New Ground-Up Rebuilds

### 15. Vortex Mixer (`vortex_mixer_twin`) — **Archive V1 + Build Brand-New OEM Model**
- **User Assessment**: *"Vortex mixer is bad please save it as is and build a different model."*
- **Directory**: [`vortex_mixer_twin/`](file:///Users/Samuel/AGapps/Twins/vortex_mixer_twin)
- **Baseline Metrics**: **3,960 viewer LOC** (`vortex_mixer3d.js`: 2,268, `app.js`: 959, `index.html`: 196, `style.css`: 291, `sfx.js`: 246) · **12 / 25 OGA Gates PASSED** (fails 13 gates: `PWR-02..03`, `BAY-01..06`, `INT-02..04`, `PRES-01..02`).
- **Two-Step Execution Mandate**:
  1. **Step A — Archive Existing Model Intact**: Copy the entire existing `vortex_mixer_twin/` directory verbatim to [`.master/04_ARCHIVE/vortex_mixer_genie2_v1/`](file:///Users/Samuel/AGapps/Twins/.master/04_ARCHIVE/) before modifying a single line. Record the archive snapshot in `.master/registry/`.
  2. **Step B — Build Brand-New Different Model in `vortex_mixer_twin/`**:
     - **Target New OEM Model**: **IKA Vortex 3 Digital / Thermo Scientific LP Low-Profile Digital Vortex Mixer** (distinct sleek low-profile cast zinc wedge footprint with silicone wrap-around collar and angled recessed OLED/LCD console — completely different silhouette from the old tall Genie 2 box).
     - **Exterior & Labware**: Precision die-cast zinc housing (`Body_Chassis`), 4 high-adhesion silicone suction feet (`Foot_Leveling_*`) at $Y=0$, black/blue EPDM dimpled conical touch cup (`Pivot_CupHead`) + quick-snap microplate/multi-tube foam attachment, recessed OLED `UI_LCD` (showing RPM, Touch/Cont mode, countdown timer), knurled speed dial (`Knob_Speed`, clockwise = increase, $\ge 3.5\text{ mm}$ clearance), tactile `Btn_Touch`, `Btn_Cont`, `Btn_Timer`, `Btn_Power`, lower-frame `Badge_SREdesigns`, 15 mL Falcon tube tilted at $14^\circ$ with 14 graduation rings + fluted blue cap + dynamic $\text{RPM}^2$ parabolic meniscus, and 24-slot tube rack beside unit.
     - **Complete Internal Mechanics & Electronics**: Brushless DC pancake motor (`Motor_Drive`), precision eccentric counterbalance weight & double-row sealed ball bearings, EPDM anti-rotation bellows, optical slot tachometer (`Mirror_OpticalRelay`), microswitch touch-start load sensor, `Sensor_PT100` stator thermistor, heavy cast-iron base ballast block on 4 rubber isolators, `PCB_Motherboard` (`Part_MCU_Core`, `Part_RAM_Chip`, `Part_SSD_Module`, `WiFi_BLE` + `Antenna_WiFi`), `Assembly_PowerSupply`, `Fan_CabinetCooling_Blower`, rear I/O (`Port_USB`, `Port_RJ45`, `Port_IEC`), `Power_Receptacle_Duplex` / `Power_Plug_NEMA` / `Power_Cord_SJTOW` continuity, and 10-chapter `TOUR_CHAPTERS` + walkthrough video.

### 16. Benchtop pH Meter (`ph_meter_twin`)
- **User Assessment**: *"The Benchtop PH meter is awful"*
- **Directory**: [`ph_meter_twin/`](file:///Users/Samuel/AGapps/Twins/ph_meter_twin)
- **OEM Reference**: **Mettler Toledo SevenExcellence S470** (upgrading away from the primitive Oakton box look)
- **Baseline Metrics**: **3,230 viewer LOC** (`ph_meter3d.js`: 1,657, `app.js`: 868, `index.html`: 188, `style.css`: 358, `sfx.js`: 159) · Passes 20/25 OGA regex gates, yet visually fails industrial authenticity due to boxy console proportions and crude arm/probe modeling.
- **Remediation Spec (Complete Ground-Up Industrial & Mechanical Rebuild)**:
  1. **Sculpted Benchtop Console**: Authentic multi-tiered sloped wedge enclosure (`Body_Chassis`) with extruded bevel side cheeks, translucent protective in-use splash cover, recessed **7-inch color capacitive touchscreen (`UI_LCD` via `createDecalQuad`)** displaying pH to $0.001$, mV, ATC °C, 5-point Nernst calibration slope/offset %, and live mV vs. time trace; crisp tactile navigation buttons (`Btn_Read`, `Btn_Cal`, `Btn_Mode`, `Btn_Hold`, `Btn_Power`) with status LEDs.
  2. **uPlace™ Counterbalanced Pantograph Electrode Arm**: Weighted cast-zinc base island, chrome vertical column, dual parallel-link articulated arms (`Pivot_ArmLower`, `Pivot_ArmUpper`) with spring tension mechanism and knurled brass friction knob that keeps the electrode head strictly vertical as it smoothly lowers into the sample beaker, plus molded BNC/ATC cable routing clips.
  3. **Authentic InLab Routine Pro Glass pH Electrode & Buffer Station**: Multi-layer transparent borosilicate body (`Glass_ElectrodeBody`), internal silver/silver-chloride (`Ag/AgCl`) cartridge wire inside 3.0 M KCl electrolyte meniscus, porous white ceramic junction frit, thin-walled spherical pH-sensitive glass bulb, integrated stainless Pt1000 ATC probe (`Sensor_PT100`), color-coded NIST buffer bottles (pH 4.01 pink, 7.00 green, 10.01 blue) + 150 mL sample beaker over a miniature magnetic stir pad (`Motor_Drive` + rotating PTFE stir bar + parabolic liquid vortex).
  4. **Complete Electronics & Gate 5 Anatomy**: Faraday-shielded ultra-high-impedance ($10^{12}\ \Omega$) electrometer input stage on `PCB_Motherboard` (`Part_MCU_Core`, `Part_RAM_Chip`, `Part_SSD_Module`, `WiFi_BLE` + `Antenna_WiFi`), `Assembly_PowerSupply`, `Fan_CabinetCooling_Blower`, `Mirror_OpticalRelay` optical isolation coupler, rear BNC + Mini-DIN ATC + USB-A/B + RJ45 + RS-232 ports, `Power_Receptacle_Duplex` / `Power_Plug_NEMA` / `Power_Cord_SJTOW` continuity, and `TOUR_CHAPTERS` + walkthrough video.

### 17. Volumetric Karl Fischer Moisture Titrator (`karl_fischer_twin`)
- **User Assessment**: *"The Volumetric Karl Fischer Moisture Titrator is bad and needs much work done"*
- **Directory**: [`karl_fischer_twin/`](file:///Users/Samuel/AGapps/Twins/karl_fischer_twin)
- **OEM Reference**: **Metrohm 901 Titrando + 800 Dosino Buret Drive + 803 Ti Stand + 900 Touch Control**
- **Baseline Metrics**: **2,900 viewer LOC** (`karl_fischer3d.js`: 1,349, `app.js`: 778, `index.html`: 192, `style.css`: 382, `sfx.js`: 199) · **14 / 25 OGA Gates PASSED** (fails 11 gates: `BAY-01..06`, `INT-02..04`, `PRES-01..02`).
- **Remediation Spec (Ground-Up Rebuild)**:
  1. **901 Titrando Main Unit & 900 Touch Control**: Authentic Metrohm modular tower (`Body_Chassis`) with molded grey/white polymer shell, front illuminated Metrohm status light strip, separate angled **900 Touch Control** screen (`UI_LCD` displaying live mV polarization voltage, mL titrant dispensed, mg/ppm H2O, drift rate µg/min, and live titration curve), tactile `Btn_*` keys, and lower-frame `Badge_SREdesigns`.
  2. **800 Dosino Top-Mounted Buret Drive**: Precision-modeled 800 Dosino dosing head seated squarely on a 1L amber GL45 KF titrant bottle — internal 20,000-step stepper leadscrew (`Motor_Drive`), precision $20\text{ mL}$ borosilicate dosing cylinder inside transparent collar, rotating 4-port PTFE/ceramic distribution valve, and drying tube packed with orange/blue indicating silica/3Å molecular sieves.
  3. **803 Ti Stand & Hermetic Titration Vessel**: Integrated magnetic stirrer stand (`Motor_Lift` stir motor + `Motor_BathPump` membrane solvent aspirator pump), custom 5-neck borosilicate glass titration vessel (`Glass_TitrationCell`) with machined PTFE sealing lid & Viton O-ring, **double-Pt-pin indicator electrode** (`6.0338.100`), anti-diffusion titrant micro-tip entering below the liquid meniscus, red silicone septum sample injection port (+ 1 mL glass Hamilton syringe accessory), `Sensor_PT100` cell thermistor, `Mirror_OpticalRelay` optical level/drop sensor, and dynamic parabolic methanol-chloroform vortex with color transition (clear $\rightarrow$ amber iodine endpoint).
  4. **Complete Electronics & Gate 5**: `PCB_Motherboard` (MCU, 24-bit polarization ADC, RAM, SSD, `WiFi_BLE` + `Antenna_WiFi`), `Assembly_PowerSupply`, `Fan_CabinetCooling_Blower`, rear MSB/USB/RJ45/RS-232 ports, full `Power_Receptacle_Duplex` / `Power_Plug_NEMA` / `Power_Cord_SJTOW` continuity, and `TOUR_CHAPTERS` + walkthrough video.

---

## Tier 6 — Flagship Multi-Assembly Ground-Up Build

### 18. Field Emission Scanning Electron Microscope (`sem_twin`)
- **User Assessment**: *"The scanning electron microscope is horrible and needs a lot of work."*
- **Directory**: [`sem_twin/`](file:///Users/Samuel/AGapps/Twins/sem_twin)
- **OEM Reference**: **ZEISS GeminiSEM 500 / Thermo Scientific Apreo 2 FE-SEM**
- **Baseline Metrics**: **1,377 viewer LOC** (`sem3d.js`: 464, `app.js`: 441, `index.html`: 120, `style.css`: 352; **NO `sfx.js`**, **NO `research/`**, empty `cad/`) · **6 / 25 OGA Gates PASSED** (fails 19 gates: `TAX-03..04`, `PWR-01..04`, `UV-01..02`, `BAY-01..06`, `INT-02..04`, `PRES-01..02`).
- **Root-Cause Failure Diagnosis**:
  - `sem3d.js` is an unrefined 464-line primitive sketch: `desk` is a single solid `BoxGeometry(1.4, 0.82, 0.95)` (`line 84`), `chBody` is a plain cube `BoxGeometry(0.48, 0.42, 0.48)` (`line 111`), detectors are simple cylinders stuck through the chamber wall without bellows or ConFlat flanges, zero tactile `Btn_*` controls, zero 3D `Fastener_*` screws, zero internal electronics/vacuum plumbing, zero power outlet/cord continuity, and zero acoustic synthesis (`sfx.js`).
- **Flagship Rebuild Architecture**:
  1. **Anti-Vibration Plinth & Main Instrument Console (`Body_Chassis`)**: Heavy pneumatically damped steel plinth resting on 4 elastomeric/air-spring isolation feet (`Foot_Leveling_*` at $Y=0$) with removable louvered side/front service doors exposing the internal electronics & vacuum bay (`CAM_EXPLODED`).
  2. **UHV Specimen Chamber (`Chamber_Specimen_UHV`) & 5-Axis Eucentric Stage**: Heavy CNC-machined 316L stainless steel multi-port chamber with bolted ConFlat (CF40/CF63/CF100) flanges, copper gaskets, 12-bolt circles (`Fastener_*`), hinged front vacuum door (`Pivot_DoorChamber`) with dovetail Viton seal, clamping lever + viewport window, and internal **5-Axis Motorized Eucentric Stage** (`Motor_Lift` Z-stage, X/Y stepper actuators, tilt cradle, $360^\circ$ carousel holding gold-sputtered SEM pin stubs).
  3. **Field Emission Electron Optical Column (`Column_FEG_Assembly`)**:
     - Upper Schottky Zirconiated Tungsten ($\text{ZrO/W}$) FEG Gun Assembly with 30 kV ceramic HV insulator feedthrough, suppressor/extractor anodes, and **20 L/s Ion Getter Pump (IGP)** with blue high-voltage interlock cable.
     - Upper & lower electromagnetic condenser lenses with wound copper coils & finned water-cooled aluminum jackets, pneumatic column isolation gate valve, selectable motorized aperture strip (`Motor_Drive`), **In-Lens SE detector**, and **Gemini/compound magnetic-electrostatic objective lens pole piece**.
     - Cutaway/Exploded mode revealing internal electron beam ray (`0.5–30 kV`), scan deflection coils, and stigmator octupole.
  4. **Analytical Detector Suite**:
     - **Everhart-Thornley SE2 Detector**: Bolted CF flange, stainless Faraday collector grid, YAG scintillator tip, acrylic light pipe, and PMT housing.
     - **Retractable 4-Quadrant Solid-State BSE Detector**: Linear motorized slide (`Motor_BathPump`/actuator) below objective pole piece.
     - **Oxford Ultim Max EDS Silicon Drift Detector (SDD)**: Angled beryllium-window collimator snout, vacuum isolation valve, and finned Peltier heat sink.
     - **IR Chamberscope Camera (`Mirror_OpticalRelay`)**: In-chamber IR LED + CCD camera showing live internal stage view.
  5. **Vacuum System & Internal Electronics Bay**:
     - **Pfeiffer HiPace 300 Turbomolecular Pump** bolted directly to chamber bottom CF160 flange + **Edwards nXDS10i Dry Scroll Roughing Pump** connected via flexible corrugated KF25 stainless bellows hose + Pirani/Penning cold-cathode vacuum gauges.
     - Dedicated **30 kV High-Voltage Power Tank**, precision ultra-stable lens current regulator boards, `PCB_Motherboard` (`Part_MCU_Core`, `Part_RAM_Chip`, `Part_SSD_Module`, `WiFi_BLE` + `Antenna_WiFi`), `Assembly_PowerSupply`, `Fan_CabinetCooling_Blower`, `Sensor_PT100` column water-cooling thermistor, `Body_Wire_*` color-coded harnesses, rear I/O (`Port_RJ45`, `Port_USB`, `Port_RS232`, `Port_IEC`), and `Power_Receptacle_Duplex` / `Power_Plug_NEMA` / `Power_Cord_SJTOW` continuity.
  6. **Operator Dual-4K Workstation & Dedicated Tactile SEM Console**:
     - Dual 32" 4K monitors (`UI_LCD` via `createDecalQuad` with interactive procedural SEM micrograph canvas — switchable live SE2/InLens/BSE/EDS spectrum overlays, magnification `50×–500,000×`, kV, WD, vacuum mbar, live raster scanline!).
     - Dedicated hardware **SEM Control Console** with physical `Btn_*` pushkeys, twin joysticks, optical trackball, and multi-turn knurled **Magnification, Focus, Brightness, Contrast, and X/Y Stigmator** encoders.
     - Full `sfx.js` acoustic synthesis (turbo pump high-frequency spin-up whine, scroll pump thrum, pneumatic gate-valve clack, relay click, HV beam engage hum) + 10-chapter `TOUR_CHAPTERS` + walkthrough video.
