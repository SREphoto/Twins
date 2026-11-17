# OEM Research Sources & Engineering Lineage — `sem_twin` (ZEISS GeminiSEM 500)

## 1. Primary OEM Manuals & Architectural Specifications

1. **ZEISS GeminiSEM Series Instruction Manual (`Doc. 349500-8038-000`)**
   - **Electron Column**: Gemini II Nano-Twin magnetic-electrostatic objective lens with in-column `+8.0 kV` electrostatic Beam Booster liner (`Body_BeamBoosterTube`), water-cooled polepiece (`20.5 °C`), and automatic variable aperture strip (`30 / 60 / 120 µm`).
   - **Field Emission Source**: Thermal Schottky `ZrO/W(100)` emitter (`1800 K`), guaranteed emitter lifetime `> 10,000 h`, gun chamber pressure `2.0e-8 Pa` (`2.0e-10 mbar`) maintained by a **`20 l/s` Sputter Ion Getter Pump (`Body_IonGetterPump`)**.
   - **Optical Ranges & Resolution**:
     - Accelerating Voltage (`EHT`): `0.02 – 30.0 kV`
     - Probe Current: `3.0 – 20,000.0 pA` (`3 pA` to `20 nA`)
     - Magnification: `50× – 300,000×` (`HFW = 120,000 / Mag µm`)
     - Working Distance (`WD`) / Stage Z: `2.0 – 40.0 mm`
     - Objective Focus (`focus_mm`): Coarse & Fine rotary encoders rotating **CW to increase**
     - 8-Pole Electromagnetic Stigmator (`X / Y`): `-100%` to `+100%`
     - Ultimate Resolution: `0.6 nm @ 15 kV`, `0.8 nm @ 1 kV`, `1.2 nm @ 500 V`.
   - **Overall Physical Envelope (`Code 4771-CAD`, §3.2)**:
     - Combined Footprint (`W × D × H`): **`1650 × 1082 × 1757 mm`** (`1880 mm` max height w/ top `-30 kV` HV boot).
     - **Coordinate Handedness (`1 unit = 100 mm`, `Y = 0` floor datum, `-Z` operator front)**:
       - `screenRight = forward(+Z) × up(+Y) = -X`: Plinth + Hollow UHV Chamber + Gemini II Column centered at `X = -3.80 u` (`X = -7.80..+0.20 u`, `Z = -5.10..+5.10 u`, `Y = 0.00..17.57 u`, max `18.80 u` w/ HV boot).
       - `screenLeft = +X`: Operator Console Desk centered at `X = +4.50 u` (`X = +0.50..+8.50 u`, `Y = 0.00..7.60 u`), with dual 27" monitors (`UI_LCD_ChamberScope` at `X = +6.65 u` screen-left, `UI_LCD` at `X = +2.35 u` screen-right), Dual-Rotary panel (`X = +2.45 u`), Dual-Joystick stage box (`X = +6.35 u`), and Standalone Prep Bench (`X = +14.80 u`).
     - Mass: `890 kg` (column + plinth console) + `145 kg` (operator workstation desk).
   - **Operator Console Hardware**:
     - Dual 27-inch monitors on central articulated VESA stand, ZEISS Dual-Rotary Control Panel (`8` fluted knurled encoders + `8` illuminated pushbuttons), and Dual-Joystick Stage Control Box (`1`-axis Z joystick, `3`-axis XY+R twist joystick, navigation trackball, red mushroom emergency stage brake with yellow collar).

2. **ZEISS 105-mm 5-Axis DC Motorized Specimen Stage Manual (`Doc. 349347-9013-000`)**
   - **Travels**: `X = 105 mm` (`±52.5 mm`), `Y = 105 mm` (`±52.5 mm`), `Z = 2.0 – 40.0 mm` (coupled to `WD`), Tilt `T = -5° to +70°` (eucentric), Rotation `R = 360°` continuous.
   - **Specimen Holder**: 9-position aluminum pin-stub carousel (`Body_SpecimenCarousel`, `9` equal `40°` angular slots on `Ø 12.7 mm` stubs): **6 active monograph specimens** + **3 calibration substrates** (`Cu/Au` calibration grid, `Si` resolution standard, Faraday cup).
   - **Hardware Interlocks (§2.3.3 & §3.4)**:
     - Chamber door **cannot open under vacuum** (`chamber_pressure_pa < 95,000 Pa` / `< 950 mbar` raises `RuntimeError`).
     - Door-open requires tilt $|T| \le 1^\circ$, automatically retracts the `4Q-BSE` detector (`bse_retracted = True`), and locks stage `Z` and `Tilt` axes (`RuntimeError`).

3. **Pfeiffer Vacuum `HiPace 300` & `HiScroll 6` Vacuum Architecture (`1 mbar = 100 Pa`)**
   - **High-Vacuum Stage (`Motor_DriveTurboPump`)**: `Pfeiffer HiPace 300` (`90,000 RPM` / `1,500 Hz`, `260 l/s` N₂ pumping speed) bolted directly to the bottom `DN100CF` flange of the hollow `0.32 u`-wall 316L stainless UHV chamber (`Body_ChamberUHV`).
   - **Backing Stage (`Motor_DriveScrollPump`)**: `Pfeiffer HiScroll 6` (`1,800 RPM`) oil-free dry scroll roughing pump connected via corrugated `DN25KF` stainless bellows (`Body_VacuumForeline_KF25`).
   - **Pressure Regimes (SI `Pa` & `mbar`)**:
     - Atmospheric vent (`P_atm`): `101,325.0 Pa` (`1,013.25 mbar`)
     - Chamber door interlock limit: `95,000.0 Pa` (`950.0 mbar`)
     - Scroll-to-turbo crossover: `10.0 Pa` (`0.10 mbar` / `1.0e-1 mbar`)
     - High vacuum threshold: `<= 2.5e-4 Pa` (`2.5e-6 mbar`)
     - Analytical operating equilibrium: `1.4e-4 Pa` (`1.4e-6 mbar`)
     - FEG gun UHV (`Body_IonGetterPump`): `2.0e-8 Pa` (`2.0e-10 mbar`)
   - **Vacuum Gauging**: `Pfeiffer PKR 361` full-range Pirani / cold-cathode Penning gauge (`Body_GaugePiraniPenning`, `101,325 Pa` to `10^-7 Pa`).

4. **Oxford Instruments `Ultim Max 100` SDD EDS & Detector Suite**
   - **InLens SE (`Body_DetectorInLens`)**: Annular on-axis secondary electron detector inside the objective lens bore.
   - **SE2 (`Body_DetectorSE2`)**: Everhart-Thornley secondary electron detector (`+300 V` Faraday cage + YAG scintillator + PMT).
   - **4Q-BSE (`Pivot_DetectorBSE`)**: Retractable 4-quadrant solid-state diode backscatter detector (`Sense BSD`) for atomic-number $Z$-contrast (`η(Z)`).
   - **EDS (`Body_DetectorEDS`)**: `100 mm²` Peltier-cooled Silicon Drift Detector (`SDD`) at `35°` take-off angle (`123 eV` Mn-Kα FWHM).
   - **Specimen Preparation (`5.0 nm` Au/Pd Sputter Film)**: Benchtop Quorum `Q150T ES` class magnetron sputter coater (rotary vacuum gauge, sample chuck inside polycarbonate bell jar, power/timer switches, rear cord) depositing `5.0 nm` `Au/Pd` (`Au Mα 2.120 keV`, `Pd Lα 2.838 keV`) to eliminate dielectric charging on biological specimens.

5. **VC-E Electron Microscopy Suite Facility Standards (`ZEISS Site Planning Guide`)**
   - **Vibration Criterion**: Decoupled `VC-E` (`<= 3.1 µm/s` RMS across `1–80 Hz`) seismic concrete inertia slab isolated via `35 mm` perimeter neoprene joint + 4 continuous active-passive pneumatic isolators (`Y = 0.95..6.95 u`).
   - **Electromagnetic Interference**: AC magnetic stray field `< 0.5 mG` (`50 nT` RMS) achieved via RF/mu-metal wall shielding and `300 VA` low-stray-field toroidal transformer.
   - **Acoustic Noise**: `< 55 dBA` achieved via perforated acoustic wall panels and isolated enclosure doors.
