# New Machines & Essential Laboratory Equipment Roadmap (Waves A–E)

> **Phase Status:** Planning Only — no source files modified.
> **Source Inventories Cross-Referenced:** [`docs/PHARMACEUTICAL_LAB_EQUIPMENT_MASTER_DOSSIER.md`](file:///Users/Samuel/AGapps/Twins/docs/PHARMACEUTICAL_LAB_EQUIPMENT_MASTER_DOSSIER.md), [`docs/PHARMACEUTICAL_LAB_FACILITY_ARCHITECTURE_DOSSIER.md`](file:///Users/Samuel/AGapps/Twins/docs/PHARMACEUTICAL_LAB_FACILITY_ARCHITECTURE_DOSSIER.md), [`.master/06_MACHINES/CURRICULUM_LABS_AND_EQUIPMENT_ROADMAP.md`](file:///Users/Samuel/AGapps/Twins/.master/06_MACHINES/CURRICULUM_LABS_AND_EQUIPMENT_ROADMAP.md), and [`lab_viewer/engine/LabDockManager.js`](file:///Users/Samuel/AGapps/Twins/lab_viewer/engine/LabDockManager.js).

---

## 1. Strategic Priorities & Standards Baseline

Every new machine twin and functional piece of laboratory equipment added in Waves A–E MUST be born **OGA-Compliant on Day 1** rather than patched later:
- **14-Subagent Puzzle Architecture** (including Narrator #14 for Stage 8 Guided Tour + 1080p `.mp4` walkthrough video).
- **25/25 passing gates** in [`scripts/oga_validator.mjs`](file:///Users/Samuel/AGapps/Twins/scripts/oga_validator.mjs) (`TAX-01..06`, `PWR-01..04`, `UV-01..03`, `BAY-01..06`, `INT-01..04`, `PRES-01..02`).
- **Authentic Electrical Continuity:** Benchtop duplex outlet (`Power_Receptacle_Duplex`), plug (`Power_Plug_NEMA`), cord (`Power_Cord_SJTOW`), enclosed PSU (`Assembly_PowerSupply`), and `isPluggedIn && switchOn` gating (DIAG-014).
- **Zero Floating Geometry & Calibrated Datum:** `Y = 0.0` local resting on `BENCH_Y = 0.90` for tabletop instruments or `Y = 0.0` facility floor for floor-standing equipment.
- **Full Facility Integration:** Registered in [`lab_viewer/engine/LabDockManager.js`](file:///Users/Samuel/AGapps/Twins/lab_viewer/engine/LabDockManager.js) with zone-appropriate utility connections in [`lab_viewer/engine/LabCasework.js`](file:///Users/Samuel/AGapps/Twins/lab_viewer/engine/LabCasework.js).

---

## 2. Wave A — Cold Storage, Thermal & Pure Water Core (Immediate Facility Foundations)

These 5 builds close the biggest day-to-day operational gaps in the virtual pharmaceutical and chemistry lab:

| Directory | Reference OEM & Class | Core Interactive Mechanics & Physics | Datum & Facility Zone |
| :--- | :--- | :--- | :--- |
| `lab_refrigerator_twin` | **Thermo Scientific TSX2305GA** (+2 °C to +8 °C Glass-Door Lab Fridge) | Hinged `Pivot_DoorMain` with triple-pane heated Argon `Glass_DoorTriplePane`, pull-out sample baskets, glycol PT100 simulation bottle, V-Drive R290 compressor + evaporator fan (`Motor_Harmonic`, `Motor_Drive`, `Fan_CabinetCooling_Blower`), full BMS telemetry. *(Detailed spec in [Cold Storage Plan](file:///Users/Samuel/AGapps/Twins/update/02_COLD_STORAGE_FREEZER_AND_REFRIGERATOR_PLAN.md))* | Floor (`Y = 0.0`) — Zone 3 Cold Storage Bay |
| `lab_freezer_twin` | **Thermo Scientific TSX60086A** (-80 °C ULT + -20 °C Enzyme Mode Freezer) | Heavy VIP outer door + cam latch, vacuum relief valve physics, 4 inner doors (`Pivot_InnerDoor_1..4`), pull-out cryo racks & cryoboxes, cold-vapor mist, 2-stage R290/R170 cascade compressors + brazed-plate heat exchanger, 7-day circular chart recorder & 72h battery telemetry. *(Detailed spec in [Cold Storage Plan](file:///Users/Samuel/AGapps/Twins/update/02_COLD_STORAGE_FREEZER_AND_REFRIGERATOR_PLAN.md))* | Floor (`Y = 0.0`) — Zone 3 Cold Storage (Emergency Power) |
| `drying_oven_twin` | **Binder FD/VD 115** Forced-Convection & Vacuum Drying Oven (115 L) | Insulated double-wall stainless chamber, toggleable mechanical convection turbine vs. vacuum-drying mode, adjustable wire shelves with glassware trays, exhaust damper flap (`Pivot_ExhaustDamper`), independent Class 2 safety over-temperature limiter, rear SSR bank + PID heating elements. | Benchtop (`Y = 0.90`) or stacked stand — Zone 3 Sample Prep |
| `water_purification_twin` | **Millipore Milli-Q IQ 7003** + Remote **Q-POD** Dispenser ($18.2\text{ M}\Omega\cdot\text{cm}$ Type 1 & Type 2 Water) | Dual UV photo-oxidation lamp (`265/185 nm`), dual IPAK Meta/Quanta polisher cartridges (`Pivot_CartridgeDoor`), Elix EDI module, pressurized 25 L storage tank, articulated volumetric Q-POD dispensing arm pouring into volumetric flasks with live resistivity/TOC readouts. | Benchtop (`Y = 0.90`) + Wall/Underbench tank — Zone 3 Utility Wall |
| `incubator_shaker_twin` | **Eppendorf Innova 42 / Thermo MaxQ 6000** Stackable Incubator Shaker | Counterbalanced **triple-eccentric orbital drive** (`Motor_Drive` + crank weights), heated/refrigerated chamber with Erlenmeyer flask clamp platform (`250 mL` & `500 mL` baffled flasks with swirling broth meniscus), clear viewing lid (`Glass_LidTop` + `Sensor_LidInterlock`), HEPA filter fan. | Benchtop / Floor Stack (`Y = 0.0` or `0.90`) — Zone 3 Bio/Media Prep |

---

## 3. Wave B — Chromatography & Mass Spectrometry Analytical Suite

High-impact analytical instruments highlighted in [`docs/PHARMACEUTICAL_LAB_EQUIPMENT_MASTER_DOSSIER.md`](file:///Users/Samuel/AGapps/Twins/docs/PHARMACEUTICAL_LAB_EQUIPMENT_MASTER_DOSSIER.md) and [`CURRICULUM_LABS_AND_EQUIPMENT_ROADMAP.md`](file:///Users/Samuel/AGapps/Twins/.master/06_MACHINES/CURRICULUM_LABS_AND_EQUIPMENT_ROADMAP.md):

| Directory | Reference OEM & Class | Core Interactive Mechanics & Stage 7 Internals |
| :--- | :--- | :--- |
| `uhplc_twin` | **Agilent 1290 Infinity II UHPLC** (Quaternary Pump + Autosampler + Column Oven + DAD) | Modular 4-stack chassis (`Pump`, `Vialsampler`, `Multicolumn Thermostat`, `Diode Array Detector`), top solvent bottle tray (`A/B/C/D` mobile phase reservoirs with PTFE degasser lines), robotic XYZ needle carriage & 54-vial carousel inside `Pivot_DoorSampler`, real-time chromatogram canvas plot ($A_{254}$ absorbance vs retention time), twin reciprocating sapphire-piston pump cams (`Motor_Drive`) + optical D2 lamp mirror assembly in `CAM_EXPLODED`. |
| `gc_ms_twin` | **Agilent 8890 GC + 5977C Single-Quad MS + 7693A ALS** | Split/splitless heated inlet tower + 16-vial autosampler turret (`Motor_Harmonic` injection syringe motion), insulated hinged column oven (`Pivot_DoorOven`) containing coiled `30 m` capillary column + high-CFM oven flapper blower, transfer line into stainless **MS Vacuum Manifold** housing EI filament source, hyperbolic quadrupole rods, EM detector, and **turbomolecular + roughing foreline pumps** (`Motor_Drive`). |
| `lc_ms_orbitrap_twin` | **Thermo Orbitrap Exploris 240** (or **Waters Xevo TQ-Absolute** Tandem Quad) | Hinged H-ESI Heated Electrospray source enclosure with glass spray shield (`Glass_SourceShield`) showing charged aerosol plume under high voltage (`3.5 kV`), ion funnel, bent flatapole, C-trap, and precision spindle-shaped **Orbitrap Mass Analyzer** inside cutaway high-vacuum chamber (`1e-10 mbar`), dual split-flow turbomolecular pumps, and $m/z$ high-resolution mass spectrum simulator. |
| `flash_chromatography_twin` | **Biotage Selekt** Automated Flash Purification System | Dual cartridge bay (`Pivot_CartridgeHolder`) for silica SNAP/Sfär columns with pressurized liquid seal clamp, overhead solvent rack (`Hexane / EtOAc / DCM / MeOH`), motorized XYZ **fraction collector arm** indexing over 4 removable test-tube racks, real-time dual-wavelength UV trace + fraction bar highlighting. |

---

## 4. Wave C — Spectroscopy, Structural, Thermal & ChemMate Curriculum Suite

Bridges every remaining analytical, physical-chemistry, and general-chemistry twin identified in [`PHARMACEUTICAL_LAB_EQUIPMENT_MASTER_DOSSIER.md`](file:///Users/Samuel/AGapps/Twins/docs/PHARMACEUTICAL_LAB_EQUIPMENT_MASTER_DOSSIER.md) and [`CURRICULUM_LABS_AND_EQUIPMENT_ROADMAP.md`](file:///Users/Samuel/AGapps/Twins/.master/06_MACHINES/CURRICULUM_LABS_AND_EQUIPMENT_ROADMAP.md):

| Directory | Reference OEM & Class | Core Interactive Mechanics & Curriculum Alignment |
| :--- | :--- | :--- |
| `nmr_twin` | **Bruker Avance Neo 400 MHz** Superconducting NMR + **SampleJet** (with optional Benchtop 60 MHz toggle/sub-mode) | Polished brushed-stainless cryogenic dewar tower on vibration isolation legs (`Y = 0.0`), LN2/LHe fill turrets, pneumatic sample turbine lift ejecting/dropping a `5 mm` borosilicate NMR tube in $\text{CDCl}_3$, top **SampleJet 96-tube carousel**, cutaway internal LHe/LN2 vacuum shields + NbTi superconducting coil + shim/probe assembly, live FID -> FFT $^1\text{H}/^{13}\text{C}$ NMR spectrum plot. *(Organic Structure Determination)* |
| `xrd_twin` | **Bruker D8 Discover** X-Ray Powder Diffractometer (with radiation-interlock enclosure) | Lead-glass sliding safety doors (`Glass_RadiationShield` + redundant safety interlocks), precision motorized $\theta\text{--}\theta$ **goniometer circle** (`Pivot_GoniometerSource`, `Pivot_GoniometerDetector`), Cu-$K\alpha$ sealed X-ray tube assembly, Göbel mirror optics, spinning powder sample stage, live $2\theta$ Bragg diffraction peak trace. *(Solid State & Polymorphism)* |
| `dsc_tga_twin` | **TA Instruments Discovery DSC 2500 / TGA 5500** Dual Thermal Analysis Station | Autosampler robotic arm loading aluminum hermetic Tzero pans (`DSC`) and platinum micro-furnace hangdown balance (`TGA`), RCS90 refrigerated cooling flange, internal **ultrasensitive EMFR microbalance** + **IR furnace / constantan heat-flux sensor**, real-time $T_g$, $T_m$, and step mass-loss thermograms. *(Thermodynamics & Polymer Characterization)* |
| `polarimeter_twin` | **Rudolph Research Autopol VI** Automatic Polarimeter | Hinged stainless sample trough lid (`Pivot_SampleLid`), precision quartz-wedge / sodium D-line (`589 nm`) polarimetry optics (`Glass_QuartzTube` polarimeter cell, rotatable analyzer prism, optical encoders), LED/Sodium source lamp housing, temperature-controlled Peltier cell cradle measuring $[\alpha]_D^{20}$ for enantiomeric excess labs. |
| `mel_temp_twin` | **Mettler Toledo MP90** Melting Point System | Dual-position **optical video capillary furnace** (`3x` glass melting-point capillaries loaded with white crystalline powder), backlit magnifying observation lens + `UI_LCD` showing real-time pixel intensity melt curve (solid $\rightarrow$ meniscus $\rightarrow$ clear liquid) alongside silver block heater & PID electronics. |
| `calorimeter_twin` | **Parr 6200 Isoperibol Oxygen Bomb Calorimeter** | Insulated outer water jacket with motorized lift bucket, removable $2\text{ L}$ oval stainless water bucket + stirrer pulley (`Motor_Drive`), precision machined **1108 Oxygen Bomb** (`Pivot_BombCap`, electrode posts, NiCr fuse wire + pelleted benzoic acid sample), thermistor bridge (`0.0001\text{ °C}` resolution), $\Delta H_{\text{comb}}$ curve. *(Thermochemistry)* |
| `auto_titrator_twin` | **Mettler Toledo T9 Excellence** Potentiometric Titrator + Rondolino Autosampler | High-precision motorized syringe **burette drive** (`Motor_Drive` driving stepper ballscrew + glass dosing cylinder), dual-port solenoid valve block, overhead propeller stirrer + DG111 glass pH/mV electrode dipping into titration beaker, live $E\text{ (mV)} / \text{pH}$ vs volume S-curve + derivative peak ($dE/dV$). *(Acid-Base, Redox & Complexometric Labs)* |
| `potentiostat_twin` | **Gamry Interface 1010E** Potentiostat / Galvanostat + 3-Electrode Cell | Rack/bench aluminum instrument chassis + shielded color-coded electrode cable tree (`Working`, `Counter`, `Reference` Ag/AgCl banana/alligator clips), glass **electrochemical cell** with three electrodes + $\text{N}_2$ purge frit, internal precision DAC/ADC & differential electrometer op-amp PCB, live Cyclic Voltammetry ("duck curve") & Nyquist EIS plot. *(Electrochemistry)* |
| `radiation_detector_twin` | **Ludlum Model 3** Survey Meter + Lab Shielded **GM Counter** Castle | Split desktop **Lead Castle (`Pb` bricks + sliding sample tray)** for disk check-sources ($\alpha, \beta, \gamma$) paired with anodized yellow handheld Geiger-Müller pancake probe + analog/digital ratemeter, inverse-square distance rail calibration, authentic Geiger **click-pulse SFX**, exponential decay & half-life data logger. *(Nuclear Chemistry)* |
| `gas_laws_piston_twin` | Precision Acrylic/Borosilicate **Ideal Gas Piston & Manometer Bench Rig** | Motorized/hand-cranked **stepper lead-screw piston** compressing calibrated sealed gas cylinder with glowing micro-particle kinetic tracer, Bourdon + digital MEMS pressure gauge, Peltier base heating/cooling stage measuring $PV = nRT$ isotherms. *(General Chemistry Gas Laws)* |
| `contact_angle_twin` | **Krüss DSA25** Optical Drop Shape Analyzer | Motorized micro-syringe dispenser above precision XYZ goniometer stage depositing sessile water/diiodomethane droplets onto treated polymer/glass wafers, collimated LED backlight + telecentric CMOS camera lens showing live silhouette & Young-Laplace contact angle ($\theta$) measurement. *(Surface Tension & Intermolecular Forces)* |

---

## 5. Wave D — Advanced Organic Synthesis, Flow Chemistry & Pharma QC

| Directory | Reference OEM & Class | Core Interactive Mechanics & Stage 7 Internals |
| :--- | :--- | :--- |
| `microwave_synthesizer_twin` | **Biotage Initiator+ Robot 60** | Pneumatic armored explosion-proof **microwave reaction cavity** (`Pivot_SafetyShield`), 60-vial autosampler robot arm (`Motor_Harmonic`) loading sealed `2–20 mL` crimp-cap glass vials, IR external surface temp sensor, internal **2.45 GHz magnetron + rectangular waveguide** + high-voltage transformer in `CAM_EXPLODED`. |
| `flow_reactor_twin` | **Syrris Asia** Continuous Flow Chemistry System | Dual syringe pump modules (`Asia Pump` with sapphire cam valves), back-pressure regulator (`BPR`), modular heated **glass microreactor chip** (`Glass_MicroreactorChip` with visible continuous laminar slug flow) & cooled cryo-reactor column, pressure/flow telemetry PCB. |
| `jacketed_reactor_twin` | **Radleys Reactor-Ready 1L–5L** + **Huber Unistat 405** Circulator | Double-walled borosilicate jacketed reactor (`Glass_ReactorJacket`) suspended in stainless heavy-duty H-stand clamp, overhead brushless anchor/PTFE **stirrer motor** (`Motor_Drive`), dropping funnel, Graham reflux condenser, PTFE bottom drain valve, plumbed with insulated hoses to floor-adjacent **Huber Unistat 405** thermoregulator. |
| `schlenk_line_twin` | **Chemglass AF-0450** Dual-Manifold Glass Vacuum/Inert-Gas Line | Custom hand-blown double borosilicate manifold (`Glass_SchlenkManifold`) with 5 high-vacuum PTFE stopcocks (`Pivot_Stopcock_1..5`), **liquid nitrogen cold trap immersed in silvered Dewar flask**, mercury/oil bubbler manifold, vacuum gauge (`Pirani/Thermocouple`), plumbed via braided hose to our upgraded `vacuum_pump_twin`. |
| `tablet_combo_tester_twin` | **Sotax AT50** (Multi-Param Tablet Tester) + **ERWEKA TAR 220** (Friability) | Companion QC suite to our `disintegration_tester_twin` & `dissolution_tester_twin`: rotatable notched plexiglass friability drum (`Pivot_FriabilityDrum`) dropping pharmaceutical tablets at `25 RPM`, plus linear hardness/thickness/weight jaw actuator (`Motor_Drive` + load cell). |

---

## 6. Wave E — Essential Laboratory Equipment, Volumetric Tools & Facility Infrastructure

Beyond analytical machines, the 3D virtual lab requires interactive functional **laboratory support equipment and safety fixtures**:

1. **Volumetric & Pipetting Workstation (`pipette_station_twin` / Modular Lab Kit):**
   - Rotary 6-place **Eppendorf/Gilson Research Plus micropipette carousel** holding `P2`, `P10`, `P20`, `P100`, `P200`, and `P1000` air-displacement pipettes (with authentic volume micrometer dial, plunger spring travel, tip ejector mechanism, and internal stainless piston + O-ring seal), paired with hinged racked **filter tip boxes** (`10 µL`, `200 µL`, `1000 µL`) and an ergonomic biohazard tip disposal bin.
2. **Vacuum Desiccator & Dry Cabinet (`desiccator_cabinet_twin`):**
   - Clear polycarbonate/borosilicate **vertical vacuum desiccator cabinet** (`Glass_DesiccatorDoor`) with perforated adjustable trays, analog vacuum hygrometer dial, silica gel desiccant tray (blue-to-pink hydration color state), and precision **needle-valve purge cock**.
3. **Laboratory Glassware Washer (`glassware_washer_twin`):**
   - **Miele Professional PG 8583** under-counter / freestanding stainless laboratory washer with glass viewing window, pull-out injection nozzle basket holding Erlenmeyer flasks and volumetric pipettes mounted onto spindle jets, internal circulation pump (`Motor_Drive`), inline water heater, HEPA forced-air dryer blower, and detergent/acid-rinse dosing pumps.
4. **Interactive Chemical Safety Storage & Facility Props (`lab_viewer` Upgrades + Standalone):**
   - **NFPA 30 Flammable Safety Cabinet (Yellow, Justrite 60-Gal class):** Self-closing dual doors (`Pivot_DoorLeft/Right`), fusible-link hold-open latches, 3-point key lock, spill containment sump, grounding wire lug, and vented bung caps.
   - **Corrosive / Acid-Base Storage Cabinet (Blue/Polypropylene-lined):** Separate vented compartments for HCl/HNO3/H2SO4 vs NaOH/KOH carboys.
   - **Overhead Laboratory Utility Carriers & Snorkel Extractors:** Articulated fume extractor arms over `rotovap_twin`, `uhplc_twin`, and `gc_ms_twin`; overhead chilled-water, compressed-air, N2, and vacuum ceiling drops in [`lab_viewer/engine/LabCasework.js`](file:///Users/Samuel/AGapps/Twins/lab_viewer/engine/LabCasework.js).
   - **ANSI Z358.1 Emergency Safety Shower & Plumbed Eyewash Station:** Interactive pull-rod & push-paddle valve with animated water-curtain test mode at lab exit doorways.
   - **Interactive Fume Hood & Biosafety Cabinet Upgrade (`fume_hood` / `biosafety_cabinet` in Zone 1/2):** Counterweighted sliding tempered glass sash (`Glass_Sash`), live face-velocity Magnehelic gauge + airflow alarm (`100 fpm`), internal service turrets (Vac, N2, Cold Water), cup sink, and internal lattice rack housing `rotovap_twin` or `schlenk_line_twin`.

---

## 7. Facility (`lab_viewer`) Docking Plan for Waves A–E

When each new twin passes its 25-gate OGA preflight in isolation, it will be registered into [`lab_viewer/engine/LabDockManager.js`](file:///Users/Samuel/AGapps/Twins/lab_viewer/engine/LabDockManager.js) across the facility's SEFA 8M workstations and floor bays:
- **Floor-Mounted Alcoves (`Y = 0.0`):** `lab_refrigerator_twin`, `lab_freezer_twin` (emergency red outlet), `nmr_twin` (5-Gauss exclusion floor marking), `glassware_washer_twin`, `flammable_cabinet`, `eyewash_shower`.
- **Zone 1–2 Synthesis Hoods & Benches (`Y = 0.90`):** `schlenk_line_twin`, `microwave_synthesizer_twin`, `flow_reactor_twin`, `jacketed_reactor_twin`.
- **Zone 3 Sample Prep & Cold Chain (`Y = 0.90`):** `water_purification_twin`, `drying_oven_twin`, `incubator_shaker_twin`, `pipette_station_twin`, `desiccator_cabinet_twin`.
- **Zone 4–5 Analytical & Mass Spec Suites (`Y = 0.90`):** `uhplc_twin`, `gc_ms_twin`, `lc_ms_orbitrap_twin`, `flash_chromatography_twin`, `xrd_twin`, `dsc_tga_twin`, `polarimeter_twin`, `mel_temp_twin`, `calorimeter_twin`, `auto_titrator_twin`, `potentiostat_twin`.
- **Zone 6 Pharma QC Suite (`Y = 0.90`):** `tablet_combo_tester_twin` adjacent to `disintegration_tester_twin` and `dissolution_tester_twin`.
