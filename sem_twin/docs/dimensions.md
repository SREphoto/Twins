# Dimensions & Spatial Coordinate Specification — `sem_twin` (ZEISS GeminiSEM 500)

## 1. Spatial Envelope & Datum Freeze (Code 4771-CAD)

> **GOVERNANCE LOCK (`Code 4771-CAD`)**: All exterior dimensions, sub-assembly datum offsets, and coordinate scales in this document are derived from the **ZEISS GeminiSEM Series Instruction Manual (`Doc. 349500-8038-000`, §3.2)** and **105-mm DC Stage Manual (`Doc. 349347-9013-000`)** and are frozen under Code `4771-CAD`.

- **Three.js Scene Unit Scale**: **`1 unit = 100 mm` (`0.1 m = 1 dm`)**
  - When docked in `lab_viewer` (`1 unit = 1.0 m`), `LabDockManager.js` applies `scale: 0.10` (`1 dm × 0.10 = 0.1 m`), yielding exact 1:1 physical meter dimensions inside the Zone 8 SEM Suite.
- **Global Origin `(0, 0, 0)`**: Centered horizontally on the combined FE-SEM + Operator Console footprint at the finished floor surface (`Y = 0.0 mm`).
- **Floor Datum**: `Y = 0.0 mm` (`y = 0.00` units). The 4 pneumatic leveling isolator pads (`Foot_Leveling_FL`, `Foot_Leveling_FR`, `Foot_Leveling_RL`, `Foot_Leveling_RR`) and operator desk leveling glides rest flush on `Y = 0.0 mm` with zero floor penetration.
- **Operator-Facing Front Direction**: **`-Z`** (operator sits on the `-Z` side looking toward `+Z`; in `lab_viewer` with `rotY = +Math.PI / 2`, the `-Z` front faces **West (`-X`)** toward the SEM Suite double airlock doors at `X = 1.0 m`).

| Overall System Envelope | Millimeters (mm) | Scene Units (`1 unit = 100 mm`) | Source Tag |
| :--- | ---: | ---: | :--- |
| **Total Combined Width (`X`)** (`-825` to `+825 mm`) | `1650 mm` | `16.50 u` (`-8.25` to `+8.25`) | **PUB** (`349500-8038-000` §3.2) |
| **Total System Depth (`Z`)** (`-540` to `+542 mm`) | `1082 mm` | `10.82 u` (`-5.40` to `+5.42`) | **PUB** (`349500-8038-000` §3.2) |
| **Column + Plinth Height (`Y`)** (`0` to `1757 mm`, `1880 mm` w/ HV boot) | `1757 mm` (`1880 mm` max) | `17.57 u` (`18.80 u` max) | **PUB** (`349500-8038-000` §3.2) |
| **Column Plinth Width × Depth** (`Left bay X = -825..-3 mm`) | `822 × 1082 mm` | `8.22 × 10.82 u` | **PUB** (`349500-8038-000` §3.2) |
| **Operator Console Table Width × Depth × Height** (`Right bay X = -25..+825 mm`) | `850 × 900 × 760 mm` | `8.50 × 9.00 × 7.60 u` | **PUB** (`349500-8038-000` §3.2) |
| **Total Mass** | `890 kg` (plinth+col) + `145 kg` (console) | `4 × 222.5 kg` on `4 × Ø 80 mm` pads | **PUB** (`349500-8038-000` §3.2) |

---

## 2. Sub-Assembly Breakdown & Coordinates (`1 unit = 100 mm`)

### 2.1 Vibration-Isolated Plinth & Structural Frame (`X = -4.15 u`, `Y = 0.00..7.80 u`, `Z = 0.00 u`)
- **`Foot_Leveling_FL` / `FR` / `RL` / `RR`**:
  - 4 heavy-duty pneumatic/elastomeric isolator feet (`Ø 80 mm = 0.80 u` vulcanized neoprene base pad, `H = 45 mm = 0.45 u`, M20 threaded stainless leveling spindle + hex jam nut + active pneumatic air-spring cylinder `Ø 110 mm`).
  - Coordinates: `X ∈ {-7.65, -0.65}`, `Z ∈ {-4.60, +4.60}`, bottom exactly at `Y = 0.00 u`.
- **`Body_Chassis` (Plinth Cabinet & Welded Frame)**:
  - Tubular steel spaceframe (`40 × 40 mm` square structural tubing) spanning `X = -8.15..-0.15 u` (`800 mm`), `Y = 0.45..7.80 u` (`735 mm`), `Z = -5.10..+5.10 u` (`1020 mm`).
  - Front & side powder-coated sheet-metal service doors (`Pivot_DoorServiceBay`) with stamped ventilation louvers, recessed chrome quarter-turn latches, and M4 DIN 912 hex socket hinge screws.
- **`Badge_SREdesigns`**:
  - Official brushed-aluminum laser-etched **S R E** brand badge (`110 mm × 32 mm × 2.5 mm` = `1.10 × 0.32 × 0.025 u`) seated in a `2.0 mm` carved recessed pocket on the **lower-left front frame rail** at `(X = -6.80, Y = 1.15, Z = -5.12 u)`, facing `-Z` (`DIAG-001`, `DIAG-015`).

### 2.2 316L Stainless UHV Specimen Chamber (`X = -4.15 u`, `Y = 7.80..10.90 u`, `Z = -0.20 u`)
- **`Body_ChamberUHV`**:
  - Electropolished 316L stainless-steel cylindrical/octagonal multi-port vacuum vessel (`ID = 330 mm = 3.30 u`, `OD = 410 mm = 4.10 u`, `H = 310 mm = 3.10 u` external / `270 mm` internal), bolted to the top granite/cast-iron vibration table at `Y = 7.80 u`.
  - Equipped with 8 radial ConFlat (`CF`) ports (`DN100CF`, `DN63CF`, `DN40CF`), each featuring a machined knife-edge flange, OFHC copper gasket ring, and 12 radial `Fastener_HexM6_*` socket head cap screws.
- **`Pivot_DoorChamber` (Front Hinged UHV Access Door)**:
  - Hinge axis at `(X = -6.25, Y = 9.35, Z = -2.35 u)` (`0°` closed -> `-105°` open).
  - Machined `380 × 290 × 38 mm` (`3.80 × 2.90 × 0.38 u`) 316L stainless door slab with a `DN100CF` central leaded-glass viewport (`Glass_ViewportChamber`, `IOR = 1.52`), internal black Viton O-ring seal (`Ø 340 mm`), linear guide tracks, and heavy knurled toggle latch handle.
- **`Pivot_Stage5Axis` (ZEISS 105-mm 5-Axis Motorized Eucentric Stage, `349347-9013-000`)**:
  - Mounted inside the chamber cavity (`X = -4.15, Y = 8.15..9.25, Z = -0.20 u`):
    - Cross-roller `X` & `Y` linear stages (`±52.5 mm` travel) driven by brushed DC/stepper micro-actuators (`Motor_LiftStageZ`, `Motor_DriveStageXY`) with flexible brass leadscrew couplings.
    - Tilt cradle (`T = -5°..+70°`), continuous `360°` rotary table (`R`), eucentric `Z` wedge (`WD = 2.0–40.0 mm`), and 9-position aluminum pin-stub carousel (`Body_SpecimenCarousel`) with brass touch-alarm wire.

### 2.3 Gemini II Nano-Twin Electron Optical Column (`X = -4.15 u`, `Y = 10.90..17.57 u`, `Z = -0.20 u`)
- **`Body_ColumnGemini`**:
  - Lower conical objective lens housing (`Y = 10.90..12.60 u`, `Ø 260 -> 210 mm`), mid-column double condenser & stigmator section (`Y = 12.60..15.40 u`, `Ø 210 mm`) with internal cutaway window exposing wound copper electromagnetic coils, `+8 kV` Beam Booster quartz/metal liner tube, `InLens SE` & `InLens EsB` annular detectors, and mechanical 4-position aperture strip drive (`30/60/120 µm`).
  - Upper Schottky Field Emission Gun (`FEG`) head (`Y = 15.40..17.57 u`, `Ø 185 mm`) with `20 l/s` Ion Getter Pump (`Body_IonGetterPump`) magnet yoke on the `+X` side, pneumatic column isolation valve (`Body_ValveColumnGate`), and top conical `-30 kV` HV cable stress-relief receptacle (`Y = 17.57..18.60 u`).
- **Chamber-Mounted Detectors & Optics**:
  - **`Body_DetectorSE2` (Everhart-Thornley SE2)**: Mounted on right-rear `DN63CF` port `(X = -1.95, Y = 9.55, Z = +0.55 u)`, angled toward eucentric point; includes biased perforated Faraday cage, scintillator disc, lightguide, PMT housing, and BNC signal cable.
  - **`Pivot_DetectorBSE` (Retractable 4-Quad Sense BSD)**: Mounted on front-left `DN40CF` port `(X = -6.30, Y = 9.75, Z = -0.85 u)` with welded stainless bellows, pneumatic slide cylinder, and gold 4-quadrant photodiode head under the objective polepiece.
  - **`Body_DetectorEDS` (Oxford Ultim Max 100 SDD)**: Mounted on upper-left `35°` inclined `DN63CF` port `(X = -6.45, Y = 10.35, Z = +0.40 u)` with blue-anodized Peltier heatsink fins, motorized slide, and tapered copper collimator snout.
  - **`Mirror_OpticalRelay` (IR Chamberscope Assembly)**: Mounted on upper-front-right `DN40CF` port `(X = -2.25, Y = 10.20, Z = -1.45 u)` with a `45°` gold-coated optical relay mirror, `850 nm` IR LED ring, and external CCD camera barrel.
  - **`Sensor_PT100` (Column Water Jacket RTD Probe)**: Stainless 4-wire PT100 thermal probe threaded into the objective lens cooling manifold at `(X = -3.10, Y = 11.45, Z = +0.85 u)`.

### 2.4 Vacuum Pumping & Internal Electronics Bay (`X = -8.00..-0.25 u`, `Y = 0.55..7.50 u`)
- **`Motor_DriveTurboPump` (`Pfeiffer HiPace 300` Turbomolecular Pump)**:
  - Suspended directly beneath the chamber `DN100CF` bottom port at `(X = -4.15, Y = 5.40..7.75, Z = -0.20 u)` with finned aluminum rotor body, `TC 110` onboard drive unit, `DN25KF` foreline port, and splinter shield.
- **`Motor_DriveScrollPump` (`Pfeiffer HiScroll 6` Oil-Free Scroll Backing Pump)**:
  - Mounted on secondary rubber isolators on the lower plinth deck at `(X = -6.35, Y = 0.70..3.10, Z = +2.20 u)`, connected to the turbo foreline via a corrugated stainless-steel `DN25KF` bellows hose (`Body_VacuumForeline_KF25`) with hinged wing-nut KF clamps and pneumatic foreline valve.
- **`Body_HVTank_30kV` (Spellman 30 kV High-Voltage Oil/Epoxy Tank)**:
  - Mounted in the rear-left plinth bay at `(X = -6.50, Y = 3.60..6.80, Z = +2.60 u)` with red silicone `-30 kV` HV umbilical cable (`Body_Wire_HV30kV`) routed through rubber grommets to the FEG gun head.
- **`Assembly_PowerSupply` & `Part_ToroidalTransformer`**:
  - Perforated honeycombed Mean Well `LRS-350-24` switching PSU cage (`215 × 115 × 50 mm`) with internal bulk caps, yellow Mylar transformer, heatsinks, and 9-terminal screw barrier strip at `(X = -2.10, Y = 4.20, Z = +2.40 u)`.
  - `300 VA` copper-wound toroidal isolation transformer (`Part_ToroidalTransformer`, `Ø 130 × 65 mm`) with amber Kapton band and dished stainless mounting plate at `(X = -2.10, Y = 1.15, Z = +2.40 u)`.
- **`PCB_Motherboard` (SmartSEM Real-Time Scan Generator & Control Board)**:
  - Mounted on 6 brass M3 hex standoffs at `(X = -2.10, Y = 4.40, Z = -1.60 u)` (`280 × 210 × 2.4 mm` 6-layer FR-4 PCB):
    - `Part_MCU_ARM` (176-pin LQFP STM32H7 / FPGA scan generator with gull-wing leads)
    - `Part_RAM_Chip` (Dual TSOP-54 DDR4 framebuffers)
    - `Part_SSD_Module` (M.2 NVMe / BGA eMMC micrograph cache)
    - `WiFi_BLE` (Shielded 802.11ac / BLE 5.2 telemetry module with U.FL coax to rear `Antenna_WiFi`)
    - 24-bit Delta-Sigma detector ADC, `CR2032` RTC coin cell, and green Phoenix Contact screw terminal blocks.
- **`Fan_CabinetCooling_Blower` & Rear Bulkhead I/O Panel (`Z = +5.08 u`)**:
  - Dual `120 mm` axial exhaust fans with chrome finger-guard grilles (`Fan_CabinetCooling_Blower`), `Port_IEC` C14 AC mains inlet + circuit breaker rocker, `Port_RS232` DB9 service port, `Port_USB` Type-B & `USB_Drive` flash host, `Port_RJ45` Gigabit LAN jack, `Antenna_WiFi` dipole, and Swagelok water chiller bulkhead fittings.

### 2.5 Ergonomic Operator Console, Dual Monitors & Tactile Controls (`X = -0.15..+8.25 u`, `Y = 0.00..13.60 u`)
- **`Body_ConsoleDesk`**:
  - Contoured steel-frame operator table (`W = 840 mm`, `D = 900 mm`, `H = 760 mm` at `X = +4.05, Y = 0.00..7.60, Z = -0.30 u`) with chamfered anthracite laminate top (`Y = 7.35..7.60 u`), rear cable management trough + rubber grommets, and under-desk `ZEISS HP Z4` Acquisition Workstation tower (`Body_WorkstationPC`, `X = +6.80, Y = 0.50..4.80, Z = +1.20 u`).
- **Dual 27" Widescreen Displays (`UI_LCD` Left Primary & `UI_LCD_Aux` Right Chamberscope/Optics)**:
  - Articulated dual-arm VESA column stand mounted at `(X = +4.05, Y = 7.60..11.20, Z = +1.40 u)`.
  - **Left Monitor (`UI_LCD` — SmartSEM Live Scan & EDS Console)**: Centered at `(X = +1.75, Y = 10.65, Z = +0.55 u)`, `460 × 285 × 28 mm` (`4.60 × 2.85 × 0.28 u`) housing with a **`2.5 mm` boolean-carved recessed bezel pocket**, `makeOperatorFacingQuadGeo(4.32, 2.58)` dynamic canvas quad (`flipY = false`, `SRGBColorSpace`) at `z = -0.132 u`, and anti-reflective `Glass_DisplayCover` lens (`z = -0.136 u`, `DIAG-002`, `DIAG-005`, `DIAG-015`).
  - **Right Monitor (`UI_LCD_ChamberScope` — Vacuum Diagram, Column Raytrace & Live IR Chamberscope)**: Centered at `(X = +6.45, Y = 10.65, Z = +0.55 u)`, angled `-10°` toward the operator, with recessed pocket, upright `makeOperatorFacingQuadGeo(4.32, 2.58)` dynamic canvas, and `Glass_DisplayCover_Right`.
- **ZEISS Dual-Rotary Control Panel (`Body_RotaryControlPanel`)**:
  - Seated on the desk at `(X = +1.95, Y = 7.60..8.15, Z = -2.45 u)` (`380 × 190 × 45 mm` sloped `14°` die-cast aluminum console with `>= 4.5 mm` clearance between all controls, `DIAG-018`):
    - **8 Knurled Aluminum Rotary Encoders (`Knob_*`)** with laser-etched index lines and silkscreen collar scales:
      1. `Knob_Magnification` (`MAGNIFICATION · 50x–300kx`)
      2. `Knob_CoarseFocus` (`FOCUS COARSE · WD mm`)
      3. `Knob_FineFocus` (`FOCUS FINE · nm`)
      4. `Knob_StigmatorX` (`STIGMATOR X · %`)
      5. `Knob_StigmatorY` (`STIGMATOR Y · %`)
      6. `Knob_Brightness` (`BRIGHTNESS · %`)
      7. `Knob_Contrast` (`CONTRAST · %`)
      8. `Knob_ProbeCurrent` (`PROBE CURRENT · pA/nA`)
    - **8 Illuminated Tactile Pushbuttons (`Btn_*`, `0.9 mm` physical travel)**:
      1. `Btn_Power` (`MAIN POWER`)
      2. `Btn_PumpVacuum` (`VACUUM PUMP`)
      3. `Btn_VentChamber` (`VENT N2`)
      4. `Btn_BeamEHT` (`EHT BEAM ON`)
      5. `Btn_ScanFreeze` (`SCAN / FREEZE`)
      6. `Btn_AutoFocus` (`AUTO FOCUS`)
      7. `Btn_AutoCB` (`AUTO B/C`)
      8. `Btn_DetectorCycle` (`DETECTOR SEL`)
- **ZEISS Dual-Joystick Stage Control Box (`Body_DualJoystickBox`)**:
  - Seated on the desk at `(X = +6.15, Y = 7.60..8.55, Z = -2.45 u)` (`240 × 175 × 50 mm` sloped housing):
    - `Pivot_JoystickLeftZ` (Left 1-axis hall-effect joystick controlling Stage `Z / Working Distance` with rubber bellows boot).
    - `Pivot_JoystickRightXYR` (Right larger 3-axis hall-effect joystick with twist crown controlling Stage `X / Y / Rotation`).
    - `Btn_StageBreak` (Top-center red mushroom `BREAK` emergency stage-stop button) + `Trackball_StageNavigation` precision optical trackball.

---

## 3. Fastener Standards (Genuine 3D Geometry)

| Application | Fastener Specification | Three.js Semantic Prefix |
| :--- | :--- | :--- |
| ConFlat (`DN100CF` / `DN63CF` / `DN40CF`) Vacuum Flanges | DIN 912 M6×25 & M8×35 316SS Hex Socket Cap Screws + DIN 125 Washers | `Fastener_HexM6_CF_*` |
| Plinth Structural Frame & Turbo Pump Mounting | DIN 912 M8×30 Alloy Steel Socket Cap Screws | `Fastener_HexM8_Frame_*` |
| Service Bay Panels, PSU Cage & Rear Bulkhead | DIN 912 M4×12 Stainless Socket Cap Screws + Washers | `Fastener_HexM4_Panel_*` |
| `PCB_Motherboard` & Detector Preamp Standoffs | M3×8 Hex Socket Screws + Brass Hex Standoffs | `Fastener_HexM3_PCB_*` |
