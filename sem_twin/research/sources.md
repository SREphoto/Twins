# Research Sources & OEM Technical Specifications — `sem_twin` (ZEISS GeminiSEM 500)

## 1. Primary Reference Instrument & Lineage
- **OEM Reference Model**: **Carl Zeiss Microscopy GmbH — ZEISS GeminiSEM 500** (with Gemini II Nano-Twin Lens Column, 105-mm 5-Axis Motorized Eucentric Stage, and SmartSEM V06.01 Workstation).
- **Primary Technical Manuals & Blueprints**:
  1. **ZEISS GeminiSEM Series Instruction Manual** (`Document No. 349500-8038-000`, Rev. `en02`):
     - Section 3.2 *System Layout*:
       - **Plinth + Column Footprint**: `822 mm (W) × 1082 mm (D) × 1757 mm (H)` (up to `1890 mm` with top HV umbilical strain-relief boot and IGP magnet assembly).
       - **Mass & Load Distribution**: `890 kg` (`4 × 222.5 kg` distributed across `4 × Ø 80 mm` leveling isolator pads).
       - **Operator Table + PC Dual-Monitor Workstation**: `1650 mm (W) × 900 mm (D) × 760 mm (H)` (combined integrated footprint width `1650 mm`, depth `1080 mm`).
     - Section 3.4 *Installation Requirements*:
       - **Floor Vibration Limits** (measured in time-domain RMS at specimen chamber height `1.0–1.5 m`):
         - `< 10 Hz`: Horizontal $X/Y < 5\ \mu\text{m/s}$, Vertical $Z < 4\ \mu\text{m/s}$ RMS (corresponds to `VC-E` / `VC-G` active-passive isolation slab).
         - `10–60 Hz`: Horizontal $X/Y < 10\ \mu\text{m/s}$, Vertical $Z < 14\ \mu\text{m/s}$ RMS.
         - `> 60 Hz`: Horizontal $X/Y < 14\ \mu\text{m/s}$, Vertical $Z < 20\ \mu\text{m/s}$ RMS.
       - **Stray Electromagnetic Field Limits**:
         - DC component: $< 0.5\ \text{mG}$ ($50\ \text{nT}$) drift per 5 minutes.
         - AC component (`10 Hz–1 kHz`): $< 1.0\ \text{mG}$ ($100\ \text{nT}$) peak-to-peak.
       - **Acoustic Noise Limits**: $< 52\ \text{dB}$ (`< 120 Hz`), $< 43\ \text{dB}$ (`120–450 Hz`), $< 47\ \text{dB}$ (`> 450 Hz`).
       - **Ambient Room Stability**: $21\ ^\circ\text{C} \pm 4\ ^\circ\text{C}$, short-term drift $\le 0.5\ ^\circ\text{C/h}$, relative humidity $< 65\%$.
     - Section 4.4 *Schematics of the Vacuum System (Gemini II Column)*:
       - **FEG Gun Chamber**: UHV $< 2 \times 10^{-7}\ \text{Pa}$ maintained by a `20 l/s` Sputter Ion Getter Pump (IGP) isolated by a pneumatic column gate valve.
       - **Specimen Chamber**: High vacuum $\le 2.5 \times 10^{-4}\ \text{Pa}$ pumped by a bottom-mounted `Pfeiffer HiPace 300` (`260 l/s`, `90,000 RPM`) turbomolecular pump backed via a `DN25KF` corrugated stainless-steel bellows foreline by an oil-free `Pfeiffer HiScroll 6` / `Edwards nXDS6i` dry scroll pump (`10 Pa` roughing crossover).
  2. **ZEISS 105-mm 5-Axis DC Motorized Stage Manual** (`Document No. 349347-9013-000`, Rev. `v02`):
     - **Travel Ranges**: $X = 105\ \text{mm}$ ($\pm 52.5\ \text{mm}$), $Y = 105\ \text{mm}$ ($\pm 52.5\ \text{mm}$), $Z = 50\ \text{mm}$ (Working Distance `WD = 2.0–40.0 mm`), Tilt $T = -5^\circ\text{ to }+70^\circ$, Rotation $R = 360^\circ$ continuous, plus $M$-axis eucentric height adjustment.
     - **Specimen Chamber Interior**: `330 mm` inner diameter × `270 mm` internal height, supporting specimens up to `500 g` on a 9-position aluminum pin-stub carousel (`Ø 12.7 mm` standard SEM pin stubs).
     - **Hardware Safety Interlocks (§2.3.3 & §3.4)**:
       - Chamber door microswitch (`Sensor_Microswitch_Door`) located at inner bottom front of chamber immediately blocks `EHT` and `SE2` collector voltages and locks `Z`, `M`, and `T` axes when opened.
       - Stage tilt $T$ must be set to $0^\circ$ and retractable `BSE` / `EDS` detectors must be retracted before opening the chamber door to prevent mechanical collision.
       - Specimen current monitor with integrated touch alarm prevents polepiece contact.
  3. **ZEISS SmartSEM V06.01 Control Panel & Dual-Joystick Box Manual** (`sem_sm_smartsem_v06_01_en01.1`):
     - **ZEISS Dual-Rotary Control Panel**: 8 tactile knurled rotary encoders (`Magnification`, `Focus Coarse`, `Focus Fine`, `Stigmator X`, `Stigmator Y`, `Brightness`, `Contrast`, `Aperture Align`) + illuminated function keys (`Scan/Freeze`, `Reduced Raster`, `Auto Focus`, `Auto CB`, `Fast/Slow`, `EHT On/Off`).
     - **ZEISS Dual-Joystick Stage Control Box**: Right joystick (`X / Y` translation + twist `R` rotation), Left joystick (`Z` working distance), and top-center red `Break` emergency stage-stop pushbutton.
  4. **Electron Optics & Multi-Detector Suite** (`ZEISS GeminiSEM Brochure EN_40_011_112` & `Oxford Instruments Ultim Max 100`):
     - **Resolution**: `0.8 nm @ 15 kV`, `0.8 nm @ 1 kV` (with Tandem decel), `1.0 nm @ 500 V`.
     - **Accelerating Voltage (`EHT`)**: `0.02 kV – 30.0 kV` (`20 V – 30,000 V`).
     - **Probe Current**: `3 pA – 20 nA` (adjustable via condenser zoom & `30 µm`..`120 µm` aperture strip).
     - **Magnification**: `50× – 2,000,000×` (interactive viewer range `50× – 300,000×`).
     - **Detectors**:
       1. `InLens SE`: On-axis annular secondary electron detector inside the Beam Booster column (pure nanoscale surface topography).
       2. `SE2` (Everhart-Thornley): Chamber-mounted biased Faraday cage (`+300 V`) + YAG scintillator + quartz lightguide + PMT (oblique topographic shadowing).
       3. `4-Quad BSE` (Sense BSD): Retractable under-polepiece 4-quadrant solid-state silicon diode ring (atomic-number $Z$-contrast $\eta \propto Z^{0.7}$).
       4. `EDS` (Oxford Ultim Max 100 SDD): `100 mm²` Peltier-cooled Silicon Drift Detector at `35°` take-off angle (`8.5 mm` analytical WD) for characteristic X-ray microanalysis.
       5. `IR Chamberscope`: `850 nm` infrared LED ring + `45°` gold optical relay mirror (`Mirror_OpticalRelay`) + CCD camera for real-time stage/polepiece clearance monitoring.

## 2. Legal & Engineering Note
All 3D geometry (`sem3d.js`), acoustic synthesis (`sfx.js`), and control software (`sem_controller.py`, `app.js`) are original procedural implementations created for educational and scientific simulation under the **S R E** (`Badge_SREdesigns`) laboratory digital twin standard.
