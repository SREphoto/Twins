# Dimensions & Spatial Coordinate Specification — `sem_twin` (ZEISS GeminiSEM 500)

## 1. Spatial Envelope, Handedness & Datum Freeze (Code 4771-CAD)

> **GOVERNANCE LOCK (`Code 4771-CAD`)**: All exterior dimensions, sub-assembly datum offsets, and coordinate scales in this document are derived from the **ZEISS GeminiSEM Series Instruction Manual (`Doc. 349500-8038-000`, §3.2)** and **105-mm DC Stage Manual (`Doc. 349347-9013-000`)** and are frozen under Code `4771-CAD`.

- **Three.js Scene Unit Scale**: **`1 unit (u) = 100 mm` (`0.1 m = 1 dm`)**
  - When docked in `lab_viewer` (`1 unit = 1.0 m`), `LabDockManager.js` mounts `sem_twin` in **Zone 8 (`VC-E` Electron Microscopy Suite)** at `(4.5, 0.0, 15.0)` with `rotY = +Math.PI / 2` and `scale = 0.10` (`1 dm × 0.10 = 0.1 m`), yielding exact 1:1 physical meter dimensions.
- **Global Origin `(0, 0, 0)`**: Centered horizontally between the FE-SEM column plinth bay (`-X`) and operator console bay (`+X`) at the finished floor surface (`Y = 0.0 mm`).
- **Floor Datum**: `Y = 0.00 mm` (`Y = 0.00 u`). All 4 plinth leveling isolator pads (`Foot_Leveling_FL`, `Foot_Leveling_FR`, `Foot_Leveling_RL`, `Foot_Leveling_RR`) and operator desk leveling glides rest flush on `Y = 0.00 u` with zero floor penetration.
- **Right-Handed Coordinate Handedness (Operator-Facing `-Z`)**:
  - Up axis: **`+Y`**
  - Operator-facing front: **`-Z`** (operator sits on the `-Z` side looking forward toward `+Z`).
  - Therefore, by the right-hand rule:
    - **`screenRight = forward(+Z) × up(+Y) = -X`** (Plinth + UHV Chamber + Gemini II Column bay)
    - **`screenLeft = +X`** (Operator Console Desk bay, with Standalone Prep Bench further screen-left)
  - In `lab_viewer` (`rotY = +Math.PI / 2` at `(4.5, 0.0, 15.0)`), the `-Z` front rotates to **West (`-X`)** facing the `VC-E` suite double airlock doors at `X = 1.0 m`.

| Overall System Envelope | Millimeters (mm) | Scene Units (`1 u = 100 mm`) | Source Tag |
| :--- | ---: | ---: | :--- |
| **Total Combined Width (`X`)** (`-780..+850 mm`, `1650 mm` w/ trim) | `1650 mm` | `16.50 u` (`-8.25` to `+8.25` nominal; `-7.80..+8.50` active bays) | **PUB** (`349500-8038-000` §3.2) |
| **Total System Depth (`Z`)** (`-540..+542 mm`) | `1082 mm` | `10.82 u` (`-5.10..+5.10` plinth body; `10.82 u` w/ door handle & rear I/O) | **PUB** (`349500-8038-000` §3.2) |
| **Column + Plinth Height (`Y`)** (`0` to `1757 mm`, `1880 mm` w/ HV boot) | `1757 mm` (`1880 mm` max) | `17.57 u` (`18.80 u` max w/ top `-30 kV` HV boot) | **PUB** (`349500-8038-000` §3.2) |
| **Plinth + Chamber + Column Bay (`Screen-RIGHT`, `-X`)** | `800 × 1020 × 1757 mm` (`822 × 1082` OEM) | Centered `X = -3.80 u` (`X = -7.80..+0.20 u`, `Z = -5.10..+5.10 u`) | **PUB** (`349500-8038-000` §3.2) |
| **Operator Console Desk (`Screen-LEFT`, `+X`)** | `800 × 900 × 760 mm` (`850 mm` w/ trim) | Centered `X = +4.50 u` (`X = +0.50..+8.50 u`, `Y = 0.00..7.60 u`) | **PUB** (`349500-8038-000` §3.2) |
| **Total Mass** | `890 kg` (plinth+col) + `145 kg` (console) | `4 × 222.5 kg` on `4 × Ø 80 mm` isolator pads | **PUB** (`349500-8038-000` §3.2) |

---

## 2. Sub-Assembly Breakdown & Coordinates (`1 u = 100 mm`)

### 2.1 Vibration-Isolated Plinth & Structural Frame (`Screen-RIGHT`, `X = -3.80 u`, `Y = 0.00..7.55 u`)
- **`Foot_Leveling_FL` / `FR` / `RL` / `RR`**:
  - 4 heavy-duty elastomeric/pneumatic leveling feet (`Ø 80 mm = 0.80 u` vulcanized EPDM base pad, `M20` stainless leveling spindle + knurled collar + hex jam nut), resting flush at **`Y = 0.00 u`**.
  - Positioned at the four plinth corners within `X ∈ [-7.80, +0.20]`, `Z ∈ [-5.10, +5.10]`.
- **`Body_Chassis` (`basePlinth`, `isolatedDeck`, Structural Frame & Service Door)**:
  - Lower heavy cast-iron/welded steel plinth base (`basePlinth`) spanning `X = -7.80..+0.20 u` (`800 mm`, centered at `X = -3.80 u`), `Y = 0.25..0.95 u` (`70 mm` structural rail height), `Z = -5.10..+5.10 u` (`1020 mm`).
  - Upper vibration-isolated granite/steel deck (`isolatedDeck`) spanning `X = -7.80..+0.20 u`, `Y = 6.95..7.55 u` (`60 mm` deck thickness).
  - Hinged front louvered service bay door (`Pivot_DoorServiceBay`) covering `Y = 0.95..6.95 u` on the `-Z` front face, with stamped ventilation louvers and quarter-turn compression latch.
- **`Body_PneumaticIsolator_01`..`04` (Continuous Active-Passive Air-Spring Cylinders)**:
  - 4 pneumatic vibration-isolation columns anchored with **base cups flush on `basePlinth` top surface (`Y = 0.95 u`)** and **pistons, elastomeric air bellows, and top mounting plates spanning continuously up to the `isolatedDeck` underside (`Y = 6.95 u`)** — total continuous vertical span `6.00 u = 600 mm` with **zero floating cylinders**.
- **`Badge_SREdesigns`**:
  - Official **`[S][R][E] designs.com`** brushed-aluminum laser-etched nameplate (`1.10 × 0.32 × 0.03 u` = `110 × 32 × 3 mm`), secured with 4 corner `M3` hex socket screws.
  - Mounted inside a **`2.0 mm` (`0.020 u`) carved recessed pocket** on the **FIXED lower-left (`+X` screen-left) front plinth structural frame rail** (`Y = 0.25..0.95 u`, centered at `Y = 0.60 u`, `Z = -5.10 u`, facing `-Z`). Because it sits on the fixed lower structural rail rather than the swinging `Pivot_DoorServiceBay`, it exhibits **zero swing clipping**, `45.7% <= 85%` boundary containment (`DIAG-001`), and 100% upright front readability (`DIAG-015`).

### 2.2 Hollow 316L Stainless UHV Specimen Chamber (`X = -3.80 u`, `Y = 7.55..11.45 u`, `Z = -0.20 u`)
- **`Body_ChamberUHV`**:
  - **Hollow extruded 316L stainless-steel cylindrical vacuum shell** (`wall thickness = 0.32 u = 32 mm`, `ID = 330 mm = 3.30 u`, `OD = 394 mm = 3.94 u`, `H = 365 mm = 3.65 u`), bolted cleanly to `isolatedDeck` (`Y = 7.55 u`) via top/bottom `DN` ConFlat bolted rings.
  - **Genuine Front Doorway Cutout**: Machined rectangular front doorway opening spanning `X = -1.92..+1.92 u` relative to the column center (`X_world = -5.72..-1.88 u`), exposing the internal UHV cavity and 5-axis stage when the chamber door opens.
  - **8 Radial ConFlat (`CF`) Ports (`DN100CF` / `DN63CF` / `DN40CF`)**: Positioned strictly **clear of the front doorway (`±0.95 rad` clear zone)** and rear tower cabinet, each modeled with machined knife-edge flange, OFHC copper gasket ring, and radial `Fastener_HexM6_CF_*` hex socket cap screws.
- **`Pivot_DoorChamber` (Extruded Front Hinged UHV Access Door)**:
  - Hinged vertically on its **`-X` edge** (`x_local = -1.92 u`, `X_world = -5.72 u`) and rotates **OUTWARD (`+angle` around `+Y` toward `-Z`)** so the latch edge swings cleanly out toward the operator without intersecting the chamber wall.
  - Extruded 316L stainless door slab (`3.84 × 3.25 × 0.34 u`) featuring a **circular carved `DN100CF` viewport cutout** behind the `25 mm` leaded borosilicate glass window (`Glass_ViewportChamber`, `IOR = 1.52`), internal Viton fluoroelastomer O-ring seal, anodized handle bar, and snap-action door safety microswitch (`Body_MicroswitchDoor`).
- **`Pivot_Stage5Axis` & `Body_SpecimenCarousel` (ZEISS 105-mm 5-Axis Motorized Eucentric Stage, `349347-9013-000`)**:
  - Mounted inside the chamber cavity (`X = -3.80 u`, `Z = -0.20 u`):
    - Cross-roller `X` & `Y` linear stages (`±52.5 mm` travel, `105 × 105 mm`) driven by non-magnetic actuators (`Motor_DriveStageXY`, `Motor_LiftStageZ`) with brass leadscrew couplings.
    - Tilt cradle (`T = -5°..+70°`), continuous `360°` rotary stage (`R`), eucentric `Z` wedge (`WD = 2.0–40.0 mm`).
    - **9-Position Aluminum Pin-Stub Carousel (`Body_SpecimenCarousel`)**: Machined 6061-T6 platter featuring **`9` equal `40°` angular slots** on `Ø 12.7 mm` aluminum pin stubs:
      - Slots `1–6`: 6 active monograph specimens (`ommatidia`, `pollen`, `morpho`, `finfet`, `zno_tetrapods`, `al_cu_alloy`) coated with a `5.0 nm` `Au/Pd` conductive film (toggleable on/off).
      - Slots `7–9`: 3 dedicated calibration substrates (**`Cu/Au` Calibration Grid**, **`Si` Resolution Standard**, and **Faraday Cup** probe-current trap).

### 2.3 Gemini II Nano-Twin Electron Optical Column (`X = -3.80 u`, `Y = 11.45..17.57 u`, `Z = -0.20 u`)
- **`Body_ColumnGemini`**:
  - Mu-metal shielded lower conical objective lens housing (`Ø 260 -> 210 mm`), mid-column double condenser and 8-pole stigmator/scan deflection coils (`Body_CoilCondenserUpper`, `Body_CoilCondenserLower`, `Body_ScanDeflectionCoils`), `+8.0 kV` electrostatic Beam Booster liner (`Body_BeamBoosterTube`), annular `InLens SE` / `EsB` detectors (`Body_DetectorInLens`), and water-cooled magnetic-electrostatic objective polepiece (`Body_ObjectivePolepiece`).
  - Upper Schottky `ZrO/W(100)` Field Emission Gun head (`Body_GunHeadFEG`, `Y = 15.40..17.57 u`), top `-30 kV` HV stress-relief ceramic boot reaching `Y = 18.80 u` (`1880 mm`), `20 l/s` Sputter Ion Getter Pump (`Body_IonGetterPump`, holding `2.0e-8 Pa = 2.0e-10 mbar`), and pneumatic column isolation gate valve (`Body_ValveColumnGate`).
- **Chamber-Mounted Detectors, Mirrors & Thermal Sensors**:
  - `Body_DetectorSE2`: Everhart-Thornley secondary electron detector (`+300 V` Faraday cage + scintillator + PMT) mounted clear of the `±0.95 rad` front door zone.
  - `Pivot_DetectorBSE`: Retractable 4-quadrant solid-state `Sense BSD` diode assembly beneath the objective polepiece.
  - `Body_DetectorEDS`: `Oxford Ultim Max 100` (`100 mm²`) Peltier-cooled Silicon Drift Detector (`SDD`) at `35°` take-off angle.
  - `Mirror_OpticalRelay`: `45°` gold-coated optical relay mirror & `850 nm` IR LED chamberscope feeding the Screen-Left secondary monitor.
  - `Sensor_PT100`: Class-A 4-wire platinum RTD probe threaded into the objective lens water jacket (`20.5 °C`).
  - `Body_GaugePiraniPenning`: `Pfeiffer PKR 361` full-range Pirani / cold-cathode gauge (`101,325 Pa` down to `10^-7 Pa`).

### 2.4 Vacuum Pumping & Lower Plinth Electronics Bay (`X = -7.80..+0.20 u`, `Y = 0.95..6.95 u`)
- **`Motor_DriveTurboPump` (`Pfeiffer HiPace 300`, `90,000 RPM`, `260 l/s`)**: Suspended directly beneath the chamber bottom `DN100CF` flange at `(X = -3.80, Y = 5.60..7.50, Z = -0.20 u)` with `TC 110` drive controller and finned barrel.
- **`Motor_DriveScrollPump` (`Pfeiffer HiScroll 6`, `1,800 RPM`)**: Oil-free dry scroll backing pump on the lower plinth deck linked via corrugated `DN25KF` stainless bellows (`Body_VacuumForeline_KF25`) with wing-nut KF clamps.
- **`Body_HVTank_30kV`**: Epoxy-potted Spellman `-30 kV` HV multiplier tank (`X = -6.20 u`) driving `Body_Wire_HV30kV_Umbilical` up to the FEG gun head.
- **`Assembly_PowerSupply` & `Part_ToroidalTransformer`**: Perforated Mean Well `LRS-350-24` (`24 VDC / 14.6 A`) cage PSU (`X = -1.95 u`) and `300 VA` copper toroidal isolation transformer (`X = -1.95 u`).
- **`PCB_Motherboard`**: 6-layer FR-4 SmartSEM scan generator & control motherboard on 6 M3 brass hex standoffs (`X = -1.95, Y = 4.35, Z = -1.55 u`), carrying `Part_MCU_ARM` (176-pin ARM Cortex-M7 / FPGA), dual `Part_RAM_Chip` (TSOP-54 SDRAM), `Part_SSD_Module` (`256 GB` NVMe/eMMC flash), `WiFi_BLE` radio + U.FL coax to rear `Antenna_WiFi`, 24-bit ADC, `CR2032` RTC battery, and Phoenix Contact green terminal blocks.
- **Rear Bulkhead I/O & Electrical Continuity (`Z = +5.08 u`)**: `Fan_CabinetCooling_Blower` with chrome wire guard, `Port_IEC` C14/C20 inlet + illuminated breaker, `Port_RS232` DB9, `Port_USB` Type-B, `USB_Drive`, `Port_RJ45` Gigabit LAN, `Antenna_WiFi`, Swagelok chiller fittings, and external `Power_Cord_SJTOW` + `Power_Plug_NEMA` plugged into `Power_Receptacle_Duplex`.

### 2.5 Operator Console Desk, Dual 27" Monitors & Tactile Panels (`Screen-LEFT`, `X = +4.50 u`)
- **`Body_ConsoleDesk`**:
  - Centered at **`X = +4.50 u`** (**Screen-LEFT bay**; spanning `X = +0.50..+8.50 u`, `Y = 0.00..7.60 u`, `Z = -3.40..+3.40 u`) with anthracite HPL tabletop, C-channel steel legs, 4 floor leveling glides at `Y = 0.00 u`, and under-desk **HP Z4 SmartSEM Acquisition Workstation tower (`Body_WorkstationPC`)** below the tabletop (`X = +6.85, Y = 0.25..4.55, Z = +0.65 u`).
- **Central Dual-Arm Articulated VESA Monitor Column (`X = +4.50, Y = 7.60..10.50, Z = +1.55 u`)**:
  - Supports both 27-inch monitors via articulated VESA arms mounted directly onto the central stand column:
    - **Screen-Left Monitor (`X = +6.65 u`, outer left)**: **`UI_LCD_ChamberScope`** (IR Chamberscope live interior feed, Vacuum System Schematic, Gemini II Column Raytrace, and Live `0–10 keV` SDD EDS Spectrum).
    - **Screen-Right Monitor (`X = +2.35 u`, column-adjacent)**: **`UI_LCD`** (Primary ZEISS SmartSEM Live Micrograph Display & Datazone Footer).
  - Both displays feature real **`2.5 mm` (`0.025 u`) extruded/carved recessed bezel pockets**, `makeOperatorFacingQuadGeo` upright dynamic `CanvasTexture` (`flipY = false`, `THREE.SRGBColorSpace`), and **`+0.4 mm` (`0.004 u`) anti-reflective optical cover glass (`Glass_DisplayCover` / `Glass_DisplayCover_Right`, `IOR = 1.52`)** (`DIAG-002`, `DIAG-005`, `DIAG-015`).
- **Tactile Desk Controls (`Y = 7.60 u` tabletop, `>= 4.0 mm` control spacing per `DIAG-018`)**:
  - **ZEISS Dual-Rotary Control Panel (`Body_RotaryControlPanel`, centered at `X = +2.45 u`, Screen-Right / column-adjacent)**:
    - **8 Fluted Knurled Aluminum Encoders (`Knob_*`)** rotating **clockwise (`CW`) to increase** (`DIAG-021`):
      1. `Knob_Magnification` (`50×–300,000×`)
      2. `Knob_FocusCoarse` (`Objective Focus Coarse · WD mm`)
      3. `Knob_FocusFine` (`Objective Focus Fine · nm`)
      4. `Knob_StigmatorX` (`-100%..+100%`)
      5. `Knob_StigmatorY` (`-100%..+100%`)
      6. `Knob_Brightness` (`0–100%`)
      7. `Knob_Contrast` (`0–100%`)
      8. `Knob_ProbeCurrent` (`3.0–20,000.0 pA`)
    - **8 Illuminated Beveled Tactile Pushbuttons (`Btn_*`, `0.9 mm` physical travel)** with crisp **`+Y` upward** high-DPI vector silkscreen legends (`DIAG-017`):
      `Btn_Power` (`STANDBY`), `Btn_EHT` (`EHT ON`), `Btn_VacVent` (`VAC / VENT`), `Btn_AutoFocus` (`AUTO WD`), `Btn_AutoBC` (`AUTO B/C`), `Btn_ScanSpeed` (`SCAN SPD`), `Btn_Freeze` (`FREEZE`), `Btn_Record` (`PHOTO`).
  - **ZEISS Dual-Joystick Stage Control Box (`Body_DualJoystickBox`, centered at `X = +6.35 u`, Screen-Left / outer left)**:
    - `Pivot_JoystickLeftZ`: 1-axis proportional `Z / Working Distance` joystick (`2.0–40.0 mm`).
    - `Pivot_JoystickRightXYR`: 3-axis proportional `X / Y` translation + twist `Rotation` joystick (`±52.5 mm X/Y`, `360° R`).
    - `Trackball_StageNavigation`: Precision optical stage trackball.
    - `Btn_StageBreak`: Top-center **red mushroom emergency stage-stop pushbutton with yellow safety collar**.

### 2.6 Standalone VC-E Specimen Prep Bench (`includeLab !== false`, Far Screen-LEFT `X = +14.80 u`)
- **`Body_SpecimenPrepBench`**: Centered at **`X = +14.80 u`** (far **Screen-LEFT** inside the `VC-E` Microscopy Suite, `Y = 0.00..7.60 u`), resting on 4 steel legs at `Y = 0.00 u`.
- **`Body_SputterCoater_AuPd` (Benchtop Au/Pd Magnetron Sputter Coater)**:
  - Detailed chassis featuring a **rotary analog vacuum gauge**, **sample chuck inside a transparent polycarbonate bell jar** (`Glass_SputterBellJar`) with `Au/Pd` magnetron sputter head and argon plasma glow, **power and timer rocker/rotary switches**, and a **rear AC power cord** depositing a **`5.0 nm` Au/Pd film**.
- **`Body_SEMStubBox` & Preparation Tools**:
  - **Hinged smoked-acrylic `12.7 mm` SEM pin-stub storage box** holding aluminum pin stubs, paired with a **conductive carbon tape roll** and **precision cross-lock stainless tweezers**.

---

## 3. Fastener Standards (Genuine 3D Geometry)

| Application | Fastener Specification | Three.js Semantic Prefix |
| :--- | :--- | :--- |
| ConFlat (`DN100CF` / `DN63CF` / `DN40CF`) Vacuum Flanges | DIN 912 M6×25 & M8×35 316SS Hex Socket Cap Screws + DIN 125 Washers | `Fastener_HexM6_CF_*` |
| Plinth Frame, Pneumatic Isolators & Turbo Pump Mounting | DIN 912 M8×30 Alloy Steel Socket Cap Screws | `Fastener_HexM8_Frame_*` |
| Service Bay Panels, PSU Cage, `Badge_SREdesigns` & Rear Bulkhead | DIN 912 M4×12 / M3×8 Stainless Socket Cap Screws + Washers | `Fastener_HexM4_Panel_*` |
| `PCB_Motherboard` & Detector Preamp Standoffs | M3×8 Hex Socket Screws + Brass Hex Standoffs | `Fastener_HexM3_PCB_*` |
