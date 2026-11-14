# Cold Storage Build Plan: Laboratory Refrigerator & Laboratory Freezer (`lab_refrigerator_twin` & `lab_freezer_twin`)

> **Phase Status:** Planning Only — no source files modified.
> **Governing Standards:** [`.agents/AGENTS.md`](file:///Users/Samuel/AGapps/Twins/.agents/AGENTS.md), [`.agents/OGA_TWINS.md`](file:///Users/Samuel/AGapps/Twins/.agents/OGA_TWINS.md), [`.agents/MASTER_PREFLIGHT_CHECKLIST.md`](file:///Users/Samuel/AGapps/Twins/.agents/MASTER_PREFLIGHT_CHECKLIST.md), [`docs/PHARMACEUTICAL_LAB_FACILITY_ARCHITECTURE_DOSSIER.md`](file:///Users/Samuel/AGapps/Twins/docs/PHARMACEUTICAL_LAB_FACILITY_ARCHITECTURE_DOSSIER.md)

---

## 1. Strategic Overview & Facility Role

Chemical, biological, and pharmaceutical QC laboratories cannot operate an end-to-end sample workflow without cold-chain storage integrated directly into both the standalone twin library and the unified 3D facility (`lab_viewer`). Every workflow running on our existing twins (centrifugation, UV-Vis spectrophotometry, FTIR, HPLC/LC-MS sample prep, lyophilization, Karl Fischer reagent storage, and dissolution media degassing/storage) depends on calibrated cold storage:

| Directory | Reference OEM Class | Thermal Operating Range | Mounting Datum | Facility Zone / Docking Target |
| :--- | :--- | :--- | :--- | :--- |
| `lab_refrigerator_twin/` | **Thermo Scientific TSX2305GA** High-Performance Glass-Door Lab Refrigerator (23 cu. ft. / ~650 L class) | **+2.0 °C to +8.0 °C** (factory setpoint **+4.0 °C**; adjustable +1 °C to +12 °C) | Floor-standing (`Y = 0.0` local & facility floor) | Sample Prep & Cold Storage Bay (near Workstation 3 / Z-03) |
| `lab_freezer_twin/` | **Thermo Scientific TSX60086A** Ultra-Low Temperature (ULT) Upright Freezer (600-box / ~815 L class) with dual-mode profile | **-80.0 °C ULT** (primary -50 °C to -86 °C) + selectable **-20.0 °C / -30.0 °C Enzyme / Flammable-Safe Lab Freezer Mode** | Floor-standing (`Y = 0.0` local & facility floor, emergency power circuit) | Cold Chain & Cryo Archive Bay (near Workstation 3 / Z-03 & Lyo bay) |

Both twins will be constructed under the **14-Subagent Puzzle Architecture**, pass **25/25 gates** in [`scripts/oga_validator.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/oga_validator.mjs), expose all **Stage 7 Internal Anatomy** assemblies (`Assembly_PowerSupply`, color-coded wiring harnesses, refrigeration compressors, circulation fans, thermal sensors, and wireless/wired data telemetry boards), and ship with a Stage 8 Guided Tour plus 1080p walkthrough video.

---

## 2. Twin #1 Spec: `lab_refrigerator_twin` (High-Performance Glass-Door Laboratory Refrigerator)

### 2.1 Reference OEM Profile & Physical Envelope (1:1 Scale Targets)
- **Reference Model:** Thermo Scientific TSX2305GA Class (High-Performance Chromatography & Reagent Refrigerator).
- **Target External Envelope:** $660\text{ mm (W)} \times 780\text{ mm (D)} \times 1990\text{ mm (H)}$ ($0.660 \times 0.780 \times 1.990\text{ m}$).
- **Datum Alignment:** 4 heavy-duty swivel/locking casters (`Caster_Swivel_FL/FR/RL/RR`) plus threaded rubber leveling stabilizers (`Foot_Leveling_FL/FR/RL/RR`) resting cleanly on local $Y = 0.0\text{ mm}$.
- **Camera Viewport Bounding (DIAG-022):** Full vertical camera framing covering $Y \in [0, 2050\text{ mm}]$ plus top deck maintenance clearance.

### 2.2 Semantic 3D Mechanical Architecture & Taxonomy

#### A. External Housing, Door & Thermal Glazing (`Body_Chassis`, `Pivot_*`, `Glass_*`)
- `Body_Chassis`: Insulated polyurethane foam-in-place steel cabinet with painted powder-coat outer shell (`#e8edf2` lab off-white / brushed stainless trim), beveled top shroud housing the refrigeration deck, recessed rear utility alcove, perforated top condenser grille with modeled louvres, and `Badge_SREdesigns` mounted within $\le 85\%$ of the upper header fascia (DIAG-001).
- `Pivot_DoorMain`: Full-height anodized aluminum perimeter door frame hinged on heavy-duty self-closing cam-rise hinges (`Hinge_Upper`, `Hinge_Lower`) with magnetic perimeter compression gasket (`Gasket_DoorSeal`) and ergonomic brushed stainless vertical pull handle (`Handle_DoorPull`) plus physical key cylinder lock (`Lock_Cylinder_Door`) and mechanical door-open plunger switch (`Sensor_DoorInterlock`).
- `Glass_DoorTriplePane`: Low-E triple-pane argon-filled borosilicate viewing window using Three.js `MeshPhysicalMaterial` (`IOR = 1.52`, low roughness, edge perimeter spacer frame, and subtle heated perimeter anti-condensation trace) so operators can inspect internal shelves and LED lighting without opening the door.

#### B. Interior Chamber, Lighting, Shelves & Labware (Stage 2 Labware Showcase)
- **Internal Liner & Air Plenum:** Seamless white corrosion-resistant inner liner with rear vertical cold-air distribution plenum (laser-perforated cold air discharge slots) and dual vertical **cool-white 5000K LED strip housings** (`LED_ChamberLeft`, `LED_ChamberRight`) that toggle brighter on door opening or manual light switch.
- **Adjustable Storage Tiers (5 Tiers):**
  - 3x Wire-mesh / perforated epoxy-coated steel shelves mounted on pilaster shelf clips (`Shelf_Upper_1..3`).
  - 2x Pull-out roll-out stainless/epoxy sample baskets (`Pivot_Drawer_1`, `Pivot_Drawer_2`) on telescoping ball-bearing slides so users can slide drawers open during Stage 2/3 interaction.
- **Thermal Ballast Sensor Bottle (`Bottle_GlycolSensor`):** Dedicated 250 mL HDPE simulation bottle filled with propylene glycol solution mounted inside an anodized bracket on the middle shelf, with an immersed stainless **PT100 RTD probe** (`Sensor_PT100_Glycol`) + secondary air probe (`Sensor_PT100_Air`) eliminating false door-opening spikes.
- **Labware Inventory Inside Chamber:**
  - Amber borosilicate GL45 media & light-sensitive reagent bottles (`500 mL`, `1000 mL`) with molded blue polypropylene screw caps and custom canvas labels (`10x PBS Buffer`, `HPLC Acetonitrile`, `Karl Fischer Titrant`, `NADH Stock`).
  - Color-coded cryovial/sample tube rack (`24-well` anodized rack) holding `1.5 mL` Eppendorf tubes and `15 mL` Falcon conical tubes with graduated markings.
  - Sealed sterile vaccine/standard serum vials (`20 mL` crimp-top glass vials with aluminum overseals) and wrapped volumetric buffer flasks.

#### C. Top-Mounted V-Drive Refrigeration Deck & Stage 7 Internal Anatomy
With `Exploded View` or `Inspector Mode` active (`Body_ShroudTop` lifts vertically $+220\text{ mm}$ along $Y$):
- **Closed-Loop Refrigeration Circuit:**
  - `Motor_Harmonic`: Variable-speed **V-Drive inverter hermetic compressor** mounted on 4 elastomeric vibration isolators (`Damper_Compressor_1..4`) with stamped dome weld seam and electrical terminal box.
  - Finned aluminum/copper **Microchannel Condenser Coil** (`Condenser_Coil`) cooled by dual axial **EC Condenser Fans** (`Fan_CabinetCooling_Blower`) with animated blade rotation (`RPM` scales with cooling duty cycle).
  - Copper suction/discharge manifold piping (`Pipe_Suction`, `Pipe_Discharge`, `Filter_Dryer`, `Capillary_ExpansionTube`) passing through insulated top-deck bulkheads into the **internal finned Evaporator Coil** (`Evaporator_Coil`) and **Plenum Circulation Blower** (`Motor_Drive`) behind the rear baffle.
  - Condensate drain pan + perimeter hot-gas/PTC condensate evaporator heater tray (`Pan_CondensateDrain`).
- **Electrical Continuity & Power Routing (PWR-01..04, DIAG-014):**
  - Floor/wall duplex AC outlet (`Power_Receptacle_Duplex`), molded 3-prong NEMA 5-15P plug (`Power_Plug_NEMA`), curved 14 AWG SJT power cord (`Power_Cord_SJTOW`), rear/top recessed **IEC C14 Inlet + Breaker Rocker Switch** (`Switch_BreakerMain`), EMI line filter, and enclosed switching PSU (`Assembly_PowerSupply` providing 24V DC control & 12V DC LED/fan rails + SSR/inverter drive to the compressor).
  - Color-coded 3D wiring harnesses (AC Hot Black/Brown, Neutral White/Blue, Ground Green/Yellow, 24V DC Red/Black, PT100 shielded pair).
- **Operator Console & Telemetry (`UI_LCD`, `Btn_*`, `PCB_Motherboard`):**
  - Eye-level recessed beveled fascia pocket housing `UI_LCD` (`createDecalQuad` / `createUniversalDecalQuad`, `flipY = false`, upright UV mapping) displaying live **Glycol Chamber Temp (+4.0 °C)**, **24h Min/Max Excursions**, **Door Status**, **Compressor Duty (%)**, and **Setpoint Lock**.
  - Tactile physical `Btn_Power`, `Btn_Set`, `Btn_Up`, `Btn_Down`, `Btn_AlarmMute`, `Btn_InteriorLight` seated cleanly with $\ge 3.5\text{ mm}$ clearance (DIAG-018) and calibrated clockwise/increment kinematics (DIAG-021).
  - Rear/top `PCB_Motherboard` with `Part_MCU_Core`, `Part_RAM_Chip`, 30-day Circular Buffer `Part_SSD_Module` / Flash, `CR2032` battery backup for power-loss temperature logging, `24-bit ADC`, **Wi-Fi/BLE Telemetry Module + external antenna**, dry-contact BMS alarm terminals, `4–20 mA` analog output, and `USB-A` / `RS-485` / `RJ45` data export ports (`scripts/oga_validator.mjs` BAY-01..06 & INT-01..04).

### 2.3 Controller State Machine & Physics Simulation (`lab_refrigerator_controller.py` + `app.js`)
- **States:** `POWER_OFF` $\leftrightarrow$ `STARTUP_SELF_TEST` $\leftrightarrow$ `PULDOWN` $\leftrightarrow$ `STEADY_CONTROL` $\leftrightarrow$ `DOOR_OPEN_HOLD` $\leftrightarrow$ `DEFROST_CYCLE` $\leftrightarrow$ `ALARM_EXCURSION`.
- **Thermodynamics:**
  - Coupled two-node thermal model: fast **chamber air temperature** ($T_{\text{air}}$) reacting immediately when `Pivot_DoorMain` opens ($+2.5\text{ °C/min}$ ambient infiltration + evaporator fan interlock cutoff), and slow **glycol bottle thermal mass** ($T_{\text{glycol}}$) governing PID compressor frequency (`1200–4200 RPM`).
  - Automatic adaptive off-cycle defrost when evaporator coil frost mass crosses threshold, plus audible/visual high-temp ($> +8.0\text{ °C}$) and low-temp ($< +1.5\text{ °C}$) excursion alarms after configurable door-open grace timer.
- **GLP Audit Log CSV Export:** Timestamped ISO 8601 rows recording $T_{\text{glycol}}$, $T_{\text{air}}$, setpoint, door state, compressor RPM, alarm code, and power continuity status.

---

## 3. Twin #2 Spec: `lab_freezer_twin` (Dual-Mode -80 °C ULT & -20 °C Enzyme Lab Freezer)

### 3.1 Reference OEM Profile & Physical Envelope (1:1 Scale Targets)
- **Reference Model:** Thermo Scientific TSX60086A Ultra-Low Temperature Upright Freezer (with interactive firmware mode selector between **-80 °C ULT Cryo Archive** and **-20 °C / -30 °C Standard Lab/Enzyme Freezer** modes for general bench/curriculum runs).
- **Target External Envelope:** $846\text{ mm (W)} \times 988\text{ mm (D)} \times 1981\text{ mm (H)}$ ($0.846 \times 0.988 \times 1.981\text{ m}$), thick vacuum-insulated panel (VIP) + high-density polyurethane foam walls ($127\text{ mm}$ wall thickness visibly rendered when door opens).
- **Datum Alignment:** Heavy-duty locking casters (`Caster_HD_1..4`) + dual front screw leveling pads (`Foot_Leveling_FL/FR`) seated at local $Y = 0.0\text{ mm}$.

### 3.2 Semantic 3D Mechanical Architecture & Taxonomy

#### A. Heavy VIP Cabinet, Ergonomic Cam Latch & Multi-Door Cold Seal
- `Body_Chassis`: Heavy-gauge cold-rolled steel powder-coated enclosure with thick bevel-chamfered door jambs, **dual magnetic/silicone triple-lip door gaskets** (`Gasket_TripleSeal`), heated perimeter breaker frame preventing frost welding, top/side badge `Badge_SREdesigns`, and removable lower louvered front service grille (`Pivot_FrontGrille`) held by captive quarter-turn fasteners (`Fastener_QuarterTurn_01..02`).
- `Pivot_DoorOuter`: Heavy $115\text{ mm}$-thick VIP-insulated outer door with **ergonomic single-hand cam-action compression latch** (`Pivot_CamLatchHandle`), key lock cylinder (`Lock_Cylinder`), heated **barometric vacuum relief port** (`Valve_VacRelief`) on the door/side wall (vital real-world physics so rapid thermal contraction doesn't vacuum-lock the door after closing!), and spring-loaded door switch (`Sensor_DoorReed`).
- **4 Independent Insulated Inner Doors (`Pivot_InnerDoor_1..4`):** Each chamber quarter has its own molded ABS/polyurethane magnetic-latch inner sub-door (`Pivot_InnerDoor_1` through `Pivot_InnerDoor_4`) stamped with shelf numbers `1–4` so opening one compartment preserves -80 °C stability in the remaining three!

#### B. Cryo Racking, Polycarbonate Boxes & Vapor Physics
- **4 Stainless Steel Compartments with Sliding Drawer Racks:**
  - Each compartment houses `5` side-access stainless cryo racks (`Rack_Cryo_C1R1` etc.) holding $10 \times 10$ color-coded polycarbonate **cryoboxes** (`Cryobox_Blue`, `Cryobox_Red`, `Cryobox_Yellow`, `Cryobox_Green`) filled with labeled `2.0 mL` internal-thread **cryogenic vials** (`Vial_Cryo_Samples`) and `50 mL` conical archive tubes.
  - Selectable interactive rack pull-out animation (`Pivot_PullOutRack`) allowing close-up inspection of a specimen box.
- **Cryogenic Frost & Cold Vapor Shader (Stage 5 Active Physics):**
  - When `Pivot_DoorOuter` and an inner sub-door open while $T_{\text{chamber}} \le -15\text{ °C}$, subtle cascading cold-mist particle plumes spill downward from the shelf edge and frost crystallization sheen modulates along the stainless inner walls.

#### C. Lower Cascade Refrigeration Machine Deck & Stage 7 Internal Anatomy
With `Exploded View` or `Remove Lower Service Grille` (`Pivot_FrontGrille` opens / side panels elevate):
- **Two-Stage Hydrocarbon Cascade Refrigeration System (V-Drive):**
  - `Motor_Harmonic` (**Stage 1 High-Stage Compressor — R290 Propane**): Variable-speed hermetic compressor on elastomeric dampers.
  - `Motor_Drive` (**Stage 2 Low-Stage Compressor — R170 Ethane**): Dedicated low-stage cascade compressor driving evaporator temperatures down to $-86\text{ °C}$.
  - **Brazed-Plate Cascade Interstage Heat Exchanger** (`HeatExchanger_CascadePlate`): Multi-plate stainless steel brazed condenser/evaporator block wrapped in elastomeric Armaflex cryogenic insulation sleeves (semi-cutaway in exploded mode).
  - **Finned-Tube Condenser & Washable Dust Filter (`Condenser_Main`, `Filter_FrontWashable`)** cooled by dual high-CFM EC **Condenser Blowers** (`Fan_CabinetCooling_Blower`) with animated spin.
  - Phase separator / oil separator cylinders, capillary expansion tubes, insulated suction accumulator, and high/low-pressure transducer manifolds (`Sensor_Pressure_HiLo`).
- **Power, Battery Backup, Chart Recorder & Controls:**
  - **NEMA 5-20P / 6-20P Heavy-Duty Twist/Locking Cord & Emergency Backup Wall Outlet** (`Power_Receptacle_Duplex`, `Power_Plug_NEMA`, `Power_Cord_SJTOW`), main magnetic circuit breaker (`Switch_BreakerMain`), enclosed PSU (`Assembly_PowerSupply`), **12 V Sealed Lead-Acid / LiFePO4 Backup Battery Pack** (`Battery_TelemetryBackup`) keeping controller/telemetry alive for 72h during outage, and optional **LN2 / CO2 Cryo Backup Injection Port & Solenoid** (`Port_LN2Backup`).
  - **Eye-Level Capacitive Touchscreen / LCD (`UI_LCD`)** seated in a slanted $15^\circ$ ergonomic top-header bezel (`createUniversalDecalQuad`, upright UVs, `flipY = false`) displaying Live Chamber Temp (**-80.0 °C** or **-20.0 °C**), Stage 1 & Stage 2 Compressor Temps, Ambient Temp, Battery Voltage, Event Log, and Energy Mode (`HP` vs `ECO`).
  - Optional classic **7-Day Circular Chart Recorder** (`Recorder_Chart_7Day`) recessed in upper header next to `UI_LCD` with animated slowly rotating paper disc and thermal pen arm!
  - Full `PCB_Motherboard` with `Part_MCU_Core`, `Part_RAM_Chip`, `Part_SSD_Module` (15-year event flash), `CR2032`, **Wi-Fi / BLE Cloud Telemetry Radio**, `RS-485`, `4–20 mA`, `USB-A` flash export port, and remote BMS dry contacts.

### 3.3 Controller State Machine & Physics Simulation (`lab_freezer_controller.py` + `app.js`)
- **Selectable Operating Modes:**
  1. **`ULT_CRYO` (-80.0 °C):** Enables both Stage 1 (R290) and Stage 2 (R170) cascade compressors; cascade heat exchanger interlock prevents Stage 2 start until interstage plate reaches $-32\text{ °C}$.
  2. **`ENZYME_MINUS20` (-20.0 °C) / `MINUS30` (-30.0 °C):** Runs Stage 1 only in high-efficiency inverter modulation (mirrors standard upright lab enzyme freezer workflow).
- **Physical Interlocks:**
  - Unplugging or switching off breaker cuts cooling & active compressor drive immediately, triggers **Power Failure Backup Battery Telemetry Mode** (dimmed red/amber alarm banner if battery switch is on, or total blackout if main battery disconnect is off per DIAG-014 continuity selector).
  - **Vacuum Relief Simulation:** Closing `Pivot_DoorOuter` creates brief $-2.8\text{ kPa}$ interior negative pressure surge that vents smoothly to $0\text{ kPa}$ over ~45 s via `Valve_VacRelief` with subtle air-hiss SFX.

---

## 4. Integration into `lab_viewer` Facility & Workstation Layout

Reference files analyzed: [`lab_viewer/engine/LabCasework.js`](file:///Users/Samuel/AGapps/Twins/lab_viewer/engine/LabCasework.js), [`lab_viewer/engine/LabDockManager.js`](file:///Users/Samuel/AGapps/Twins/lab_viewer/engine/LabDockManager.js), and [`docs/PHARMACEUTICAL_LAB_FACILITY_ARCHITECTURE_DOSSIER.md`](file:///Users/Samuel/AGapps/Twins/docs/PHARMACEUTICAL_LAB_FACILITY_ARCHITECTURE_DOSSIER.md).

### 4.1 Spatial Placement & Coordinates (When Implemented)
- Both units are **floor-mounted** (`Y = 0.0` datum, matching `glove_box` at `(5.5, 0.0, -4.5)` and `sem` at `(5.0, 0.0, -1.8)` — NOT placed on top of the `BENCH_Y = 0.90` countertops).
- **Recommended Facility Bay Allocation:**
  - Extend the Zone 3 Cold Chain alcove adjacent to **Workstation 3 (Sample Prep & Lyophilization)** (`Z = 4.65`, near `centrifuge`, `freeze_dryer`, `ultrasonic_cleaner`, and `vortex_mixer`) or along the rear perimeter utility wall with verified door-swing clearance ($\ge 1100\text{ mm}$ front aisle clearance for full $90^\circ$ door opening) and overhead clearance ($\ge 300\text{ mm}$ above top shroud for heat rejection).
- **Required Facility Utility Props:**
  - Dedicated **Emergency / Uninterruptible Power (Red Duplex Receptacle)** wall box behind `lab_freezer_twin` (per Facility Architecture Dossier note requiring backup power on $-80\text{ °C}$ ULT units).
  - Standard Hospital-Grade Duplex Receptacle behind `lab_refrigerator_twin`.
  - Floor drain stub / condensate tray clearance and optional cryogenic backup cylinder (`LN2 Dewar` tank) beside the ULT freezer.

---

## 5. Implementation Execution Sequence & Verification Checklist

Both twins will be built as **Sprint 1 (Priority Cold-Chain Expansion)** right after or parallel to initial remediation, following the 14-Subagent Puzzle Dispatch:
1. **`twin_spec_researcher`:** Author `docs/dimensions.md` and `docs/BOM.md` with exact TSX2305GA & TSX60086A measurements, VIP wall thicknesses, shelf spacing, and thermal constants.
2. **`twin_controller_logic_engineer`:** Build `software/controller/lab_refrigerator_controller.py` & `lab_freezer_controller.py` + `test_controller.py` (100% pass rate on two-node thermodynamics, cascade heat-exchanger interlock, vacuum relief decay, and power continuity).
3. **`twin_chassis_builder` + `twin_labware_fluid_specialist`:** Construct floor-standing `Body_Chassis` at $Y=0.0$, recessed UI fascia pockets, triple-pane glazing (`Glass_DoorTriplePane`), VIP inner sub-doors (`Pivot_InnerDoor_1..4`), cryo boxes, glycol sensor bottle, and GL45 media bottles.
4. **`twin_internal_mechanics_builder` + `twin_power_circuit_engineer` + `twin_sensor_data_engineer`:** Construct V-drive compressors (`Motor_Harmonic`, `Motor_Drive`), cascade brazed-plate heat exchanger, EC condenser fans, `Assembly_PowerSupply`, color-coded wiring harnesses, `PCB_Motherboard`, Wi-Fi/BLE module, PT100 probes, and `Power_Receptacle_Duplex` continuity.
5. **`twin_display_silkscreen_engineer` + `twin_controls_ergonomics_engineer` + `twin_audio_sfx_synthesizer`:** Apply upright UVs (`createUniversalDecalQuad` / `createDecalQuad`, `flipY = false`), tactile `Btn_*` switches, compressor inverter hum / fan whoosh / door gasket thud / vacuum-relief hiss SFX (`sfx.js`).
6. **`twin_web_ui_architect` + `twin_visual_qa_auditor` + `twin_narrator_video_director`:** Wire Gold Standard viewer UI (`index.html`, `style.css`, `app.js`), verify **25/25** `node scripts/oga_validator.mjs`, run `scripts/verify_twin.sh`, capture and `view_file`-audit all 6 CDP screenshots + Stage 7 internal close-ups, wire into `LabDockManager.js`, and produce the Stage 8 Guided Tour + 1080p `.mp4` walkthrough videos (`node scripts/build_twin_video.mjs`).
