# PHARMACEUTICAL CHEMISTRY LABORATORY: MASTER INSTRUMENT & INFRASTRUCTURE DOSSIER
## Comprehensive Engineering Specifications, 1:1 Blueprints, Parts Manifests, and Digital Twin CAD Architecture

---

### EXECUTIVE SUMMARY & ARCHITECTURAL PROTOCOL

This master engineering dossier documents the complete instrument, tool, glassware, and facility containment universe for a world-class pharmaceutical chemistry facility (Medicinal Chemistry, Process Chemistry, Analytical Development, Formulation Science, and Quality Control).

All specifications are compiled to enable direct reverse-engineering and 3D digital twin authoring under the **Centrifuge Standard** (`.agents/AGENTS.md`), strictly observing:
- **Exhaustive Procedural CAD Detail (Rule 1)**: Every fastener, screw head (hex socket/cross-recess), bracket, gasket, fluid meniscus, and wire harness modeled in genuine 3D geometry.
- **Strict Semantic Taxonomy (Rule 3)**: Standard node hierarchy (`Body_Chassis`, `UI_LCD`, `Btn_*`, `Pivot_*`, `Glass_*`, `Fastener_*`, `Foot_Leveling_*`, `Badge_SREdesigns`).
- **Physical Circuit Continuity (Rule 9 & DIAG-014)**: Dedicated bench duplex outlet (`Power_Receptacle_Duplex`), NEMA 5-15P plug, heavy-duty SJTOW cord, internal PSU, and hard-wired continuity logic (`isPluggedIn && switchOn`). Unplugging instantly cuts display, motor, and illumination to zero.
- **Dynamic Display & Upright Silkscreen (DIAG-005, DIAG-015)**: Dynamic high-DPI CanvasTexture (`flipY = false`), inverted buffer UVs (`1.0 - uv.getY()`), anti-reflective protective lens, and upright front typography.
- **Datum Clearance (Rule 5)**: Leveling feet resting exactly at $Y = 0$ local datum ($Y = 9.0$ lab world) with zero bench clipping.

---

# SECTION 1: MASTER EQUIPMENT MATRIX & SYSTEM SPECIFICATIONS

| Domain | Instrument Category | Flagship OEM Reference | Dimensions ($W \times D \times H$ mm) | Net Mass (kg) | Electrical Ratings | Fluidic / Gas / Vacuum Feeds |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Analytical** | Ultra-High Performance LC | Agilent 1290 Infinity II | $396 \times 468 \times 940$ (stack) | $67.0\text{ kg}$ | $100\text{--}240\text{ VAC}, 640\text{ VA}$ | $1/8"\text{ PTFE}, 1/16"\text{ MP35N}, 1300\text{ bar}$ |
| **Analytical** | Metal-Free UPLC | Waters ACQUITY Premier | $343 \times 712 \times 796$ (stack) | $76.7\text{ kg}$ | $100\text{--}240\text{ VAC}, 1235\text{ VA}$ | MaxPeak HPS $1/16"\text{ MP35N}, 15,000\text{ psi}$ |
| **Analytical** | High-Res Orbitrap LC-MS | Thermo Orbitrap Exploris 120/240 | $534 \times 763 \times 703$ (+pump) | $155.0\text{ kg}$ total | $208\text{--}240\text{ VAC}, 2600\text{ W}$ | $N_2\text{ (99\% 45 L/min)}, UHP N_2, KF25$ |
| **Analytical** | Triple Quadrupole LC-MS/MS | Waters Xevo TQ-Absolute | $430 \times 960 \times 790$ (+pump) | $162.0\text{ kg}$ total | $200\text{--}240\text{ VAC}, 1200\text{ W}$ | Desolvation $N_2\text{ (1200 L/h)}, Ar, KF25$ |
| **Analytical** | GC-MS / Headspace Suite | Agilent 8890 GC + 5977C MSD | $1430 \times 636 \times 950$ (suite) | $148.2\text{ kg}$ total | $240\text{ VAC}, 2950\text{ W} + 900\text{ VA}$ | He carrier ($80\text{ psi}$), $H_2$, Air, KF16 |
| **Analytical** | Supercritical Fluid (SFC) | Waters ACQUITY UPC² | $686 \times 712 \times 711$ (dual stack) | $103.5\text{ kg}$ | $100\text{--}240\text{ VAC}, 1600\text{ VA}$ | Liquid $CO_2\text{ (1200 psi)}, ABPR (6000 psi)$ |
| **Spectroscopy** | High-Field NMR Spectrometer | Bruker Avance Neo 400/500 MHz | Magnet $\varnothing 795 \times 1564$; Stand $\varnothing 1295$ | $572\text{--}740\text{ kg}$ filled | $208\text{--}230\text{ VAC}, 1.3\text{--}3.0\text{ kVA}$ | LHe ($135\text{ L}$), LN2 ($116\text{ L}$), Prodigy $N_2$, Air |
| **Spectroscopy** | Research FTIR / ATR | Thermo Nicolet iS50 FTIR | $626 \times 698 \times 276$ (508 ABX) | $60.0\text{--}64.0\text{ kg}$ | $100\text{--}240\text{ VAC}, 120\text{--}200\text{ W}$ | Purge dry air/$N_2\text{ (20--30 psi, 5--10 SCFH)}$ |
| **Spectroscopy** | Confocal Raman Microscope | Renishaw inVia Qontor | $750\text{--}1050 \times 610 \times 850$ | $180\text{--}450\text{ kg}$ (w/ table) | $110\text{--}240\text{ VAC}, 650\text{--}800\text{ W}$ | $532\text{ nm}, 785\text{ nm}$ lasers, optical air table |
| **Structure** | Powder X-Ray Diffraction | Bruker D8 Discover Multi-Mode | $1680 \times 1290 \times 2020$ | $945.0\text{ kg}$ base | $208\text{--}240\text{ VAC}, 6.5\text{--}9.0\text{ kVA}$ | Chiller ($4\text{ L/min, 18--20 }^\circ\text{C}$), Air $6\text{ bar}$ |
| **Thermal** | Differential Scanning Calorimetry | TA Instruments Discovery DSC 2500| $530 \times 510 \times 610$ | $22.0\text{ kg}$ (+47 kg RCS) | $100\text{--}240\text{ VAC}, 600\text{ W} (+1.2\text{ kW})$| $N_2/He\text{ purge (50 mL/min)}, RCS 90 chiller$ |
| **Thermal** | Thermogravimetric Analysis | TA Instruments Discovery TGA 5500| $560 \times 560 \times 610$ | $34.0\text{ kg}$ | $100\text{--}240\text{ VAC}, 1200\text{ W}$ | 4-gas MFC ($25\text{--}200\text{ mL/min}$), water jacket |
| **Optical** | High-Precision Polarimeter | Rudolph Research Autopol VI | $813 \times 457 \times 292$ | $41.0\text{ kg}$ | $85\text{--}260\text{ VAC}, 150\text{--}200\text{ W}$ | Faraday modulator, TempTrol Peltier cell |
| **Optical** | Digital Refractometer | Anton Paar Abbemat 550 | $300 \times 330 \times 145$ | $6.5\text{ kg}$ | $100\text{--}240\text{ VAC}, 120\text{ VA}$ | Sapphire prism ($n_D 1.26\text{--}1.72$), Peltier |
| **Colloid** | Dynamic Light Scattering / Zeta | Malvern Zetasizer Ultra | $322 \times 565 \times 245$ | $19.0\text{ kg}$ | $100\text{--}240\text{ VAC}, 100\text{ W}$ | Peltier cell ($0\text{--}120\ ^\circ\text{C}$), $632.8\text{ nm}$ He-Ne |
| **Synthesis** | Microwave Organic Synthesizer | Biotage Initiator+ / Robot 60 | $625 \times 422 \times 470$ | $34.0\text{ kg}$ | $100\text{--}240\text{ VAC}, 1100\text{ VA}$ | $2.45\text{ GHz}, 400\text{ W}$, Air $3\text{ bar } (>60\text{ L/min})$ |
| **Synthesis** | Continuous Flow Reactor | Syrris Asia Modular System | $850 \times 480 \times 350$ (assembly) | $38.0\text{ kg}$ | $100\text{--}240\text{ VAC}, 800\text{ W}$ | Microfluidic chip ($62.5\ \mu\text{L--}1\text{ mL}$), BPR |
| **Synthesis** | Jacketed Process Reactor | Radleys Reactor-Ready (1L--5L) | $456 \times 570 \times 1103$ | $45.0\text{--}55.0\text{ kg}$ | $100\text{--}240\text{ VAC}, 120\text{ W}$ (stirrer)| DN100 flange, $M16\times 1$ thermofluid lines |
| **Synthesis** | Dynamic Chiller/Circulator | Huber Unistat 405 (Pilot ONE) | $426 \times 327 \times 631$ | $65.0\text{ kg}$ | $230\text{ VAC}, 16\text{ A}, 3.6\text{ kW}$ | $-45\ ^\circ\text{C to } +250\ ^\circ\text{C}, M24\times 1.5$ |
| **Purification**| Automated Flash Chromatography | Biotage Selekt | $335 \times 393 \times 545$ | $23.0\text{ kg}$ | $100\text{--}240\text{ VAC}, 300\text{ VA}$ | $30\text{ bar, 1--300 mL/min}$, PDA, RFID Sfär |
| **Synthesis** | Solvent Purification System | MBraun MB-SPS 800 (5 Solvents) | $1100 \times 800 \times 2050$ | $546.0\text{ kg}$ | $115\text{--}230\text{ VAC}, 400\text{ W}$ | 10 columns, UHP Ar $0.4\text{ bar}$, Type 90 cab |
| **Drying** | Benchtop Freeze Dryer | Labconco FreeZone 4.5L (-84°C) | $571 \times 673 \times 880$ (w/ manifold)| $93.0\text{ kg}$ | $115\text{--}230\text{ VAC}, 16\text{ A}$ | $-84\ ^\circ\text{C}$ cascade, 12 Quick-Seal valves, KF25 |
| **Synthesis** | Double-Manifold Schlenk Line | Chemglass AF-0450 Dual Bank | $864 \times 180 \times 610$ | $18.0\text{ kg}$ | Manual / pump driven | High vac ($10^{-3}\text{ mbar}$), Ar blanket ($0.2\text{ bar}$) |
| **Testing** | USP Dissolution Tester | Agilent 708-DS | $622 \times 590 \times 680$ (991 raised) | $54.4\text{ kg}$ dry / $72.4$ wet | $115/230\text{ VAC}, 230\text{ W} + 1150\text{ W}$ | 8 spindles synchronous belt, TruCenter |
| **Testing** | Automated Tablet Combo Tester | Sotax AT50 (W, T, D, H) | $450 \times 600 \times 475$ | $70.5\text{ kg}$ | $100\text{--}240\text{ VAC}, 180\text{ W}$ | Mettler $0.1\text{ mg}$, LVDT caliper, $800\text{ N}$ jaw |
| **Testing** | Tablet Disintegration Tester | ERWEKA ZT 322 (2 Stations) | $430 \times 400 \times 660$ | $33.0\text{ kg}$ | $115/230\text{ VAC}, 1620\text{ W}$ | 30 strokes/min, $55\text{ mm}$ stroke, 6-tube basket |
| **Testing** | Tablet Friability Tester | ERWEKA TAR 220 (2 Drums) | $237 \times 370 \times 278$ | $13.4\text{ kg}$ | $100\text{--}240\text{ VAC}, 40\text{ W}$ | 25 RPM, PMMA Roche drum ($156\text{ mm}$ drop), $10^\circ$ |
| **Testing** | Karl Fischer Moisture Titrator | Metrohm 901 Titrando / 917 Coul | $142 \times 231 \times 227$ (base) | $7.5\text{ kg}$ system | $100\text{--}240\text{ VAC}, 45\text{ W}$ | 800 Dosino ($0.1\ \mu\text{L}$ res), double-Pt pin |
| **Testing** | Potentiometric Auto-Titrator | Mettler Toledo T9 Excellence | $210 \times 246 \times 250$ (base) | $4.3\text{ kg}$ (+18 kg InMotion)| $100\text{--}240\text{ VAC}, 120\text{ VA}$ | 8 RFID burettes ($20,000\text{ steps}$), dual boards |
| **Testing** | Video Melting Point Apparatus | Mettler Toledo MP90 | $180 \times 190 \times 350$ | $4.0\text{ kg}$ | $100\text{--}240\text{ VAC}, 120\text{ VA}$ | Amb--$400\ ^\circ\text{C}$, 6 capillaries, telecentric CMOS |
| **Testing** | Freezing Point Osmometer | Advanced Instruments OsmoTECH | $250 \times 390 \times 460$ | $13.2\text{ kg}$ | $100\text{--}240\text{ VAC}, 60\text{ W}$ | 20-sample carousel, Peltier supercooling |
| **Testing** | Rotational QC Rheometer | Anton Paar RheolabQC | $300 \times 350 \times 720$ | $14.0\text{ kg}$ | $100\text{--}240\text{ VAC}, 80\text{ W}$ | EC motor, $2\ \mu\text{rad encoder}$, $0.2\text{--}75\text{ mNm}$ |
| **Facility** | 6-Foot Chemical Fume Hood | Labconco Protector Premier 72" | $1829 \times 805 \times 1499$ | $225.0\text{ kg}$ | $115\text{ VAC}, 20\text{ A}$ duplex GFCI | Chain/sprocket sash, 12" duct ($325\text{ mm}$), airfoil |
| **Facility** | Inert Atmosphere Glovebox | MBraun UNIlab Pro (3 Gloves) | $1600 \times 1050 \times 1900$ | $420.0\text{ kg}$ | $115/230\text{ VAC}, 1.2\text{ kW}$ | $< 1\text{ ppm } O_2/H_2O$, large/mini antechambers |
| **Facility** | Ultrapure Water System | EMD Millipore Milli-Q IQ 7003 | $350 \times 450 \times 500$ (+POD) | $28.0\text{ kg}$ | $100\text{--}240\text{ VAC}, 150\text{ W}$ | Type 1 ($18.2\text{ M}\Omega\cdot\text{cm}$), UV $185/254\text{ nm}$, Q-POD |
| **Safety** | Flammable Storage Cabinet | Justrite Sure-Grip EX 60-Gal | $864 \times 864 \times 1651$ | $177.0\text{ kg}$ | Passive / grounding lug | 18-ga double wall ($38\text{ mm}$ air gap), 3-pt latch |

---

# SECTION 2: ANALYTICAL CHROMATOGRAPHY & MASS SPECTROMETRY SUITE

### 2.1 Agilent 1290 Infinity II UHPLC Stack
- **Architecture**: Modular interlocking stack seated in structural polymer frames with internal cast aluminum sub-chassis.
- **Module Dimensions & Part Numbers**:
  - `G7120A` High-Speed Binary Pump: $396\text{ mm W} \times 436\text{ mm D} \times 200\text{ mm H}$, $21.0\text{ kg}$. Dual serial drive, $1300\text{ bar}$, sapphire pistons, Jet Weaver $35/100\ \mu\text{L}$ mixer.
  - `G7167B` Multisampler: $396\text{ mm W} \times 468\text{ mm D} \times 320\text{ mm H}$, $27.0\text{ kg}$ (with Peltier cooler). Cartesian X-Y-Z robotic needle arm, DLC ceramic rotor seal.
  - `G7116B` Multicolumn Thermostat (MCT): $435\text{ mm W} \times 436\text{ mm D} \times 160\text{ mm H}$, $12.5\text{ kg}$. Dual Peltier zones ($-20\ ^\circ\text{C}$ to $110\ ^\circ\text{C}$), RFID column recognition.
  - `G7117A` Diode Array Detector FS (DAD FS): $396\text{ mm W} \times 436\text{ mm D} \times 140\text{ mm H}$, $11.5\text{ kg}$. Max-Light cartridge cell ($10\text{ mm}$ or $60\text{ mm}$ path, Teflon AF optofluidic waveguide), 1024-diode array, deuterium & tungsten lamps.
  - `G7123A` Solvent Bottle Tray: $396\text{ mm W} \times 436\text{ mm D} \times 120\text{ mm H}$, polypropylene leak tray.
- **Total Stack Height**: $940\text{ mm}$ (including tray). Total dry mass: $67.0\text{ kg}$.
- **Electrical Specification**: $100\text{--}240\text{ VAC}, 50/60\text{ Hz}$, $640\text{ VA}$ total stack draw; individual IEC C13 inlets per module. Dual RJ45 CAN bus daisy chain.
- **Fluidic Connections**: $1/8"\text{ OD}$ transparent PTFE solvent inlet lines; $1/16"\text{ OD} \times 0.12\text{ mm ID}$ red MP35N capillaries; InfinityLab Quick-Connect spring-loaded fittings ($1300\text{ bar}$).
- **OEM Documentation**: Manual P/N `G7120-90000`, `G7167-90000`, `G7116-90000`, `G7117-90000`.

### 2.2 Thermo Scientific Orbitrap Exploris 120 / 240 LC-MS
- **Chassis Dimensions**: $534\text{ mm W} \times 763\text{ mm D} \times 703\text{ mm H}$ ($21.0" \times 30.1" \times 27.7"$). Net weight: $120.0\text{ kg}$.
- **Ion Source**: OptaMax NG atmospheric source (adds $120\text{ mm}$ width on left wing) with H-ESI II probe (operating $\pm 0.5\text{ to } \pm 5.0\text{ kV}$, aux heater up to $550\ ^\circ\text{C}$).
- **Roughing Foreline Pump**: Leybold EcoDry 65 Plus dry multi-stage roots pump ($230 \times 500 \times 330\text{ mm}$, $34.0\text{ kg}$, $800\text{ W}$, NW25 flange).
- **Nitrogen Generator**: Peak Scientific Genius NM32LA ($600 \times 750 \times 710\text{ mm}$, $95\text{ kg}$, $230\text{ VAC}, 1600\text{ W}$).
- **Electrical Ratings**: Dual $208\text{--}240\text{ VAC}, 50/60\text{ Hz}, 15\text{ A}$ circuits with dual IEC C19 inlets; instrument draw $1800\text{ W}$ running, $2600\text{ W}$ total with pump.
- **Gas & Vacuum Plumbing**:
  - Source $N_2$ (99.0% dry): $6.0\text{ bar}$ ($87\text{ psi}$), flow up to $45\text{ NL/min}$ via $6\text{ mm OD}$ polyurethane tubing.
  - Collision & C-Trap UHP $N_2$ (99.999%): $6.0\text{ bar}$, flow $0.05\text{ NL/min}$ via $1/16"\text{ copper/SS}$ Swagelok line.
  - High Vacuum: Multi-stage split-flow Pfeiffer turbomolecular pumps maintaining Orbitrap analyzer at $< 1.0 \times 10^{-10}\text{ mbar}$.
- **Mass Analyzer**: Spindle-shaped central electrode with outer split electrodes; mass range $m/z\ 40\text{ to }6000$ (up to $8000$), resolution up to $120,000$ (Exploris 120) or $240,000$ FWHM (Exploris 240).
- **OEM Documentation**: Doc No. `BRE0019230` (Operating Manual), `BRE0019231` (Site Prep).

### 2.3 Waters Xevo TQ-Absolute Triple Quadrupole LC-MS/MS
- **Chassis Dimensions**: $430\text{ mm W} \times 960\text{ mm D} \times 790\text{ mm H}$ ($1035\text{ mm D}$ including Z-Spray source). Weight: $130.0\text{ kg}$.
- **Roughing Pump**: Edwards nXL200i dry scroll pump ($280 \times 530 \times 360\text{ mm}$, $32.0\text{ kg}$, $550\text{ W}$).
- **Power**: $200\text{--}240\text{ VAC}, 50/60\text{ Hz}, 12\text{ A}$, power draw $1200\text{ W}$ nominal; IEC C19 inlet.
- **Kinematics & Optics**: Z-Spray dual orthogonal desolvation probe ($650\ ^\circ\text{C}$); StepWave XS off-axis ion funnel; hyperbolic molybdenum Q1 and Q3 mass filters; T-Wave dynamic collision cell; off-axis photomultiplier with $\pm 10\text{ kV}$ HED dynode. Scan speed up to $20,000\text{ Da/s}$.
- **OEM Documentation**: Waters Doc P/N `715007945` (Site Prep), `715007946` (Operator Guide).

### 2.4 Agilent 8890 GC / 5977C MSD / 7697A Headspace Suite
- **Dimensions**:
  - 8890 GC (G3540A): $580\text{ mm W} \times 510\text{ mm D} \times 490\text{ mm H}$, $49.0\text{ kg}$.
  - 5977C Inert Plus MSD (G7077C): $340\text{ mm W} \times 540\text{ mm D} \times 400\text{ mm H}$, $41.0\text{ kg}$.
  - 7693A Liquid Autosampler Tower & 150-Vial Tray: $320\text{ mm W} \times 350\text{ mm D} \times 950\text{ mm H}$ (overall height on GC), $10.7\text{ kg}$.
  - 7697A Headspace Sampler: $509\text{ mm W} \times 636\text{ mm D} \times 800\text{ mm H}$, $48.0\text{ kg}$.
  - IDP-3 Dry Scroll Vacuum Pump: $180\text{ mm W} \times 360\text{ mm D} \times 240\text{ mm H}$, $9.5\text{ kg}$.
- **Bench Footprint**: $1430\text{ mm W} \times 636\text{ mm D} \times 950\text{ mm H}$; total mass: $148.2\text{ kg}$.
- **Electrical**: GC: $240\text{ VAC}, 15\text{ A}, 2950\text{ W}$; MSD: $900\text{ VA}$; Headspace: $850\text{ VA}$.
- **Gases**: Research Grade Helium (99.9999%) at $80\text{ psi}$ via $1/8"\text{ copper/SS}$ lines; split vent charcoal trap; KF16 vacuum flange.
- **Optics & Quad**: Inert ceramic EI source with dual rhenium filaments ($70\text{ eV}$); gold-coated hyperbolic quartz quadrupole heated to $200\ ^\circ\text{C}$; Triple-Axis detector with $-10\text{ kV}$ HED.
- **OEM Documentation**: Manual P/N `G3540-90010` (Site Prep), `G7077-90015` (5977C Operation).

### 2.5 Waters ACQUITY UPC² (Supercritical Fluid Chromatography)
- **Module Dimensions**:
  - Convergence Manager (CCM / ABPR): $343 \times 712 \times 229\text{ mm}$, $22.0\text{ kg}$.
  - Binary Solvent Manager CO2 (BSM-CO2): $343 \times 711 \times 672\text{ mm}$, $35.0\text{ kg}$.
  - Sample Manager Fixed Loop (SM-FL): $343 \times 712 \times 271\text{ mm}$, $26.0\text{ kg}$.
  - Column Manager Active (CM-A): $343 \times 712 \times 229\text{ mm}$, $20.5\text{ kg}$.
- **Footprint**: Single stack $343 \times 712 \times 1193\text{ mm}$ or dual stack $686 \times 712 \times 711\text{ mm}$. Mass: $103.5\text{ kg}$.
- **Electrical**: $100\text{--}240\text{ VAC}, 1600\text{ VA}$ total stack draw.
- **High-Pressure CO2 Feed**: Siphon dip-tube cylinder supply at $800\text{--}1200\text{ psi}$ via $1/8"\text{ heavy-wall SS}$ tubing. Peltier-chilled pump heads ($-10\ ^\circ\text{C}$ to $-4\ ^\circ\text{C}$).
- **Automated Back Pressure Regulator (ABPR)**: Regulates $2000\text{ to }6000\text{ psi}$ with heated ceramic nozzle ($55\ ^\circ\text{C}$) preventing Joule-Thomson dry ice clogging.
- **OEM Documentation**: Waters Doc P/N `715003500` (System Manual), `715003502` (Site Prep).

---

# SECTION 3: SPECTROSCOPY, SOLID-STATE & THERMAL CHARACTERIZATION

### 3.1 Bruker Avance Neo 400 MHz & 500 MHz NMR System
- **Superconducting Shielded Magnet (Bruker Ascend)**:
  - Ascend 400 MHz (9.4 T): Cryostat $\varnothing 795\text{ mm} \times 1564\text{ mm H}$; tripod stand $\varnothing 1295\text{ mm}$; total height $\sim 2180\text{--}2250\text{ mm}$. Empty weight: $385\text{ kg}$; filled operating weight: **$572\text{ kg}$**.
  - Ascend 500 MHz (11.7 T): Cryostat $\varnothing 795\text{ mm} \times 1564\text{ mm H}$; stand $\varnothing 1295\text{ mm}$; total height $\sim 2250\text{ mm}$. Empty: $440\text{ kg}$; filled: **$650\text{--}740\text{ kg}$**.
  - Ceiling Clearance: Minimum $2520\text{ mm}$ (flexible helium siphon P/N 29085) or $2805\text{ mm}$ (rigid siphon P/N 53962).
  - 5 Gauss Line: Radial $\le 0.50\text{ m}$ (400 MHz), $\le 0.60\text{ m}$ (500 MHz); Axial $\le 1.00\text{ m}$ / $\le 1.20\text{ m}$.
- **Cryogens**:
  - Liquid Helium ($LHe$): $125\text{--}135\text{ L}$ dewar; boil-off rate $< 15\text{ mL/h}$; hold time $> 300\text{ days}$.
  - Liquid Nitrogen ($LN_2$): $106\text{--}116\text{ L}$ outer jacket; boil-off $< 220\text{ mL/h}$; hold time $> 16\text{--}21\text{ days}$.
  - Quench Duct: $\ge 200\text{ mm ID}$ stainless steel duct to building exterior.
- **SampleJet 96-Well Automated Tube Changer**:
  - Mounted directly to top magnet flange: $\varnothing 580 \times 620\text{ mm}$, height $+600\text{ mm}$, weight $34.0\text{ kg}$. Holds 5 well plates (480 tubes) + 30-position carousel.
- **Avance Neo Console**:
  - OneBay Cabinet: $1000\text{ mm W} \times 920\text{ mm D} \times 1530\text{ mm H}$, mass $300\text{ kg}$. Power: $230\text{ VAC}, 16\text{ A}, 1.3\text{--}2.0\text{ kVA}$.
  - Boards: TRX 2.0 transceivers (14-bit 1.2 GSPS ADC), HPLNA preamps, BSMS digital shims (36 channels), GREAT gradient amplifier, BLAX/BLAH pulsed RF amplifiers ($300\text{--}500\text{ W}$).
- **Probe**: CryoProbe Prodigy BBFO ($5\text{ mm}$, coils and GaAs preamps cooled to $\sim 80\text{ K}$ via pressurized $LN_2$ closed-transfer line, delivering $3\times$ sensitivity gain).
- **OEM Documentation**: Manual No. `ZTKS0192` (Ascend 400), `ZTKS0209` (Ascend 500), `1813000` (Avance Neo Pre-Install).

### 3.2 Thermo Scientific Nicolet iS50 FTIR Workstation
- **Dimensions**: $626\text{ mm W} \times 698\text{ mm D} \times 276\text{ mm H}$ ($508\text{ mm H}$ with ABX tower). Weight: $60.0\text{ kg}$ base, $64.0\text{ kg}$ with ABX.
- **Power**: $100\text{--}240\text{ VAC}, 50/60\text{ Hz}, 120\text{ W}$ base ($200\text{ W}$ max).
- **Built-In Diamond ATR Module**: Monolithic synthetic diamond crystal, single-reflection $45^\circ$, dedicated internal DLaTGS detector, calibrated slip-clutch pressure tower ($40\text{ psi}$).
- **Interferometer**: Vectra dynamically aligned Michelson interferometer ($> 100\text{ kHz}$ piezoelectric alignment), spectral range $7800\text{--}350\text{ cm}^{-1}$, resolution $< 0.09\text{ cm}^{-1}$.
- **Purge**: Dry nitrogen or air at $20\text{--}30\text{ psi}$ ($5\text{--}10\text{ SCFH}$).
- **OEM Documentation**: Doc No. `269-275000` / `269-351500`.

### 3.3 Renishaw inVia Qontor Confocal Raman Microscope
- **Dimensions**: Spectrometer + Leica DM2700 M microscope: $750\text{--}1050\text{ mm W} \times 610\text{--}1116\text{ mm D} \times 850\text{ mm H}$. Mass: $180\text{--}250\text{ kg}$ (with vibration-isolation air table: $380\text{--}450\text{ kg}$, $1200 \times 900\text{ mm}$).
- **Power**: $110\text{--}240\text{ VAC}, 650\text{--}800\text{ W}$ total.
- **Lasers & Kinematics**: $532\text{ nm}$ DPSS ($100\text{ mW}$) and $785\text{ nm}$ diode ($300\text{ mW}$); 4-position kinematic grating turret ($1800\text{ lines/mm}$ yielding $< 0.5\text{ cm}^{-1}$ resolution); Centrus back-illuminated CCD cooled to $-70\ ^\circ\text{C}$ via solid-state Peltier; LiveTrack dynamic autofocusing Z-axis ($10\text{ nm}$ resolution).
- **OEM Reference**: Renishaw Series `A-9560`.

### 3.4 Bruker D8 Discover Multi-Purpose XRPD
- **Dimensions**: $1680\text{ mm W} \times 1290\text{ mm D} \times 2020\text{ mm H}$. Net mass: **$945.0\text{ kg}$**. Floor loading $> 800\text{ kg/m}^2$.
- **Power**: $208\text{--}240\text{ VAC}, 3\text{-phase}, 6.5\text{--}9.0\text{ kVA}$.
- **X-Ray Tube**: Ceramic $2.2\text{ kW}$ Copper target (Cu $K\alpha = 1.54060\text{ \AA}$, $40\text{ kV}, 40\text{ mA}$).
- **Cooling Chiller**: External recirculator ($3.5\text{--}5.0\text{ kW}$ cooling, flow $4.0\text{ L/min}$ @ $3.5\text{ bar}$, $18\text{--}20\ ^\circ\text{C}$).
- **Goniometer & Detector**: ATLAS goniometer radius $280\text{ mm}$ (accuracy $\le 0.007^\circ\ 2\theta$); DECTRIS EIGER2 R 500K hybrid photon counting 2D detector ($512 \times 1028$ pixels, $75\ \mu\text{m}$ pitch, zero dark noise).
- **OEM Documentation**: Doc No. `DOC-G80-0012`.

### 3.5 TA Instruments Discovery DSC 2500 & TGA 5500
- **DSC 2500**: $530\text{ mm W} \times 510\text{ mm D} \times 610\text{ mm H}$, $22.0\text{ kg}$. Silver Fusion Cell furnace, Tzero thermocouple sensor ($-90\ ^\circ\text{C to } 550\ ^\circ\text{C}$ with RCS 90 chiller, precision $\pm 0.005\ ^\circ\text{C}$), 54-position robotic autosampler with dual motorized lids. Power: $100\text{--}240\text{ VAC}, 600\text{ W}$ (+ $1200\text{ W}$ RCS 90). Doc No. `972001.001`.
- **TGA 5500**: $560\text{ mm W} \times 560\text{ mm D} \times 610\text{ mm H}$, $34.0\text{ kg}$. Tru-Mass taut-band null balance ($1000\text{ mg}$ range, resolution $< 0.1\ \mu\text{g}$); Infrared furnace (4 quartz halogen lamps, $1200\text{ W}$, ambient to $1200\ ^\circ\text{C}$ up to $500\ ^\circ\text{C/min}$); 25-position autosampler with automated lid punch. Doc No. `955001.001`.

### 3.6 Rudolph Autopol VI Polarimeter & Anton Paar Abbemat 550
- **Autopol VI**: $813\text{ mm W} \times 457\text{ mm D} \times 292\text{ mm H}$, $41.0\text{ kg}$. 6 wavelengths ($365, 405, 436, 546, 589, 633\text{ nm}$); Glan-Thompson calcite prisms; optical Faraday modulator coil; PMT lock-in detection (accuracy $\pm 0.0003^\circ$ Arc); TempTrol solid-state Peltier jacket ($15\ ^\circ\text{C to } 35\ ^\circ\text{C}$). Power: $150\text{--}200\text{ W}$. Doc No. `025-0100`.
- **Abbemat 550**: $300\text{ mm W} \times 330\text{ mm D} \times 145\text{ mm H}$, $6.5\text{ kg}$. Monocrystalline sapphire prism (Mohs 9); $589.3\text{ nm}$ LED; linear CCD array; range $n_D 1.260000\text{ to } 1.720000$ (accuracy $\pm 0.00002\ n_D$); dual Peltier ($4\ ^\circ\text{C to } 85\ ^\circ\text{C}$). Power: $120\text{ VA}$.

---

# SECTION 4: ORGANIC SYNTHESIS, FLOW & REACTION SCALE-UP

### 4.1 Automated Microwave Organic Synthesizer (Biotage Initiator+ / Robot 60)
- **Dimensions**: Base unit $365 \times 422 \times 421\text{ mm}$, $21.0\text{ kg}$; with Robot 60 autosampler: $625\text{ mm W} \times 422\text{ mm D} \times 470\text{ mm H}$, $34.0\text{ kg}$.
- **Microwave Core**: Cylindrical single-mode cavity ($300\text{ mL}$ volume), $2.45\text{ GHz}$ magnetron with dynamic continuous power modulation $0\text{--}400\text{ W}$.
- **Sensors & Limits**: External dual-wavelength IR pyrometer ($40\ ^\circ\text{C to } 300\ ^\circ\text{C}$, $\pm 1\ ^\circ\text{C}$); non-invasive piezo pressure deflection sensor ($0\text{ to }30\text{ bar} / 435\text{ psi}$, $\pm 0.1\text{ bar}$).
- **Robotics**: Dual-axis pneumatic/stepper arm with mechanical self-centering collet gripping $20\text{ mm}$ crimp-cap vials ($0.2\text{--}0.5\text{ mL}$, $0.5\text{--}2.0\text{ mL}$, $2.0\text{--}5.0\text{ mL}$, $10\text{--}20\text{ mL}$).
- **Utilities**: $110/230\text{ VAC}, 1100\text{ VA}$; dry compressed air $2.5\text{--}4.0\text{ bar}$ ($> 60\text{ L/min}$) for pneumatics and cavity vortex air quench.

### 4.2 Syrris Asia Continuous Flow Chemistry System
- **Dimensions**: Modular DIN form-factor rack ($160\text{ mm}$ width per module): Dual Syringe Pump ($160 \times 260 \times 260\text{ mm}$), Pressure Controller, Chip Climate Controller, Tube/Chip Heater, Product Collector. Total assembly footprint: $850\text{ mm W} \times 480\text{ mm D} \times 350\text{ mm H}$, $38.0\text{ kg}$.
- **Hydraulics**: Twin sapphire syringe pumps ($1.0\ \mu\text{L/min to } 10.0\text{ mL/min}$ per channel), operating up to $20\text{ bar}$ ($300\text{ psi}$).
- **Reactors**: Borosilicate 3.3 microfluidic chip reactors ($62.5\ \mu\text{L}$, $250\ \mu\text{L}$, $1000\ \mu\text{L}$) with static mixing channels ($150\ \mu\text{m}$); PFA/Hastelloy tube coil reactors ($4\text{ mL}, 16\text{ mL}$) heated up to $+250\ ^\circ\text{C}$. Automated dome backpressure regulator (BPR).
- **Plumbing**: $1/16"\text{ OD}$ PFA/FEP tubing; $1/4"-28\text{ UNF}$ PEEK flangeless fittings; cam-lock tool-free chip headers.

### 4.3 Radleys Reactor-Ready Jacketed Process Reactor (1L, 2L, 5L)
- **Stand Dimensions**: $456\text{ mm W} \times 570\text{ mm D} \times 1103\text{ mm H}$, mass $25.0\text{ kg}$ frame ($45\text{--}55\text{ kg}$ fully dressed with vessel and motor).
- **Vessel Architecture**: Schott Duran Borosilicate 3.3 double-wall jacketed vessels ($1.25 : 1$ aspect ratio, $1\text{ L}$, $2\text{ L}$, $5\text{ L}$). Precision flat DN100 flange with tool-free quick-release stainless steel clamp and FEP/silicone O-ring.
- **Lid Ports (DN100 5-Neck Domed Glass Lid)**:
  - Center Port: ST 45/40 ground joint with dynamic PTFE stirrer guide.
  - Side Ports: ST 29/32 for reflux coil condenser; ST 24/40 for dropping funnel; ST 24/40 with compression fitting for $1/4"\text{ OD}$ PTFE-sheathed Pt100 RTD sensor; ST 24/40 for solid addition; ST 14/20 angled for gas purge.
- **Zero-Dead-Space (ZDS) Bottom Valve**: Spring-loaded virgin PTFE piston sealing flush with the internal bowl bottom, eliminating unmixed dead volume; $15\text{ mm}$ bore passage.
- **Drive**: Heidolph Hei-TORQUE 200/400 motor ($10\text{ to }500\text{ RPM}$, $200\text{--}400\text{ N}\cdot\text{cm}$ torque), drop-in PEEK vibration-isolating universal coupling, 4-blade pitched PTFE turbine impeller.

### 4.4 Huber Unistat 405 Dynamic Chiller / Circulator
- **Dimensions**: $426\text{ mm W} \times 327\text{ mm D} \times 631\text{ mm H}$, net mass $65.0\text{ kg}$.
- **Thermal Range**: $-45\ ^\circ\text{C to } +250\ ^\circ\text{C}$, stability $\pm 0.01\ ^\circ\text{C}$ (Pilot ONE cascade controller).
- **Capacities**: Heating power $3.0\text{ kW}$; cooling power $1.1\text{ kW}$ ($100\ ^\circ\text{C}$ to $0\ ^\circ\text{C}$), $0.6\text{ kW}$ ($-20\ ^\circ\text{C}$), $0.15\text{ kW}$ ($-40\ ^\circ\text{C}$).
- **Circulation Pump**: Magnetically coupled centrifugal pump ($55\text{ L/min}$, max pressure $0.9\text{ bar}$ with stepless pressure-limiting bypass protecting glass jackets). Closed hydraulically sealed circuit with cold expansion vessel ($2.5\text{ L}$).
- **Power & Couplings**: $230\text{ VAC}, 16\text{ A}, 3.6\text{ kW}$; $M24 \times 1.5$ male fluid ports with insulated $DN10$ metal hoses; LEMO external Pt100 jack.

### 4.5 MBraun MB-SPS 800 Solvent Purification System
- **Dimensions**: $1100\text{ mm W} \times 800\text{ mm D} \times 2050\text{ mm H}$. Total mass: $546.0\text{ kg}$.
- **Filtration Columns**: 10 seamless 304/316L stainless steel columns ($101\text{ mm OD} \times 635\text{ mm L}$, $4.8\text{ L}$ each). Dual columns per solvent: Column 1 = Activated neutral alumina (moisture scavenging); Column 2 = Supported copper catalyst (deoxygenation) or $3\text{Å}/4\text{Å}$ molecular sieves. Purifies solvents to $< 1\text{ ppm } H_2O$ and $< 1\text{ ppm } O_2$.
- **Dispensing Heads**: 316SS takeoff apparatus with dual 3-way Swagelok ball valves (Vacuum vs. Argon). Standard taper ST 24/40 (or 14/20) takeoff adapters docking with Schlenk collection flasks.
- **Safety Cabinet**: Certified Type 90 fire-resistant safety cabinet (EN 14470-1 / NFPA 30) housing five $20\text{ L}$ stainless steel solvent kegs. UHP Argon operating pressure $0.4\text{ bar}$.

### 4.6 Labconco FreeZone 4.5L (-84°C) Benchtop Freeze Dryer
- **Dimensions**: Base console $571\text{ mm W} \times 673\text{ mm D} \times 469\text{ mm H}$; with 12-port acrylic drying manifold: height $880\text{ mm}$. Mass: $93.0\text{ kg}$ ($120\text{ kg}$ with vacuum pump).
- **Condenser**: $4.5\text{ L}$ ice capacity, dual hermetic compressor cascade refrigeration pulling collector to **$-84\ ^\circ\text{C}$** ($-119\ ^\circ\text{F}$).
- **Drying Manifold**: $\varnothing 300\text{ mm} \times 380\text{ mm}$ clear acrylic drum with 12 Quick-Seal neoprene freeze-dry valves (accepts $1/2"$ and $3/4"$ adapters for $24/40$ round bottom flasks).
- **Vacuum System**: Microprocessor Pirani gauge ($0.001\text{ to }5.0\text{ mbar}$); KF25 vacuum port linked to Edwards RV5 rotary vane pump ($< 2 \times 10^{-3}\text{ mbar}$). Power: $115/230\text{ VAC}, 16\text{ A}$.

### 4.7 High-Vacuum Double-Manifold Schlenk Line System
- **Frame Dimensions**: Chemglass AF-0450 dual bank: $864\text{ mm W} \times 180\text{ mm D} \times 610\text{ mm H}$, mass $18.0\text{ kg}$.
- **Tubing**: Upper main vacuum bank = heavy-wall borosilicate $30\text{ mm OD} \times 2.5\text{ mm wall}$; lower inert gas bank = $18\text{ mm OD}$.
- **Valves**: 4 or 5 high-vacuum greaseless Chem-Cap PTFE plug valves ($0\text{--}4\text{ mm}$ or $0\text{--}8\text{ mm}$ bore with dual Viton/FETFE O-rings, vacuum rating $< 10^{-6}\text{ mbar}$).
- **Cold Traps**: Two-piece borosilicate trap ($\varnothing 58\text{ mm} \times 280\text{ mm}$) with ground ST 45/50 joint; seated inside cylindrical stainless vacuum Dewar flask ($143\text{ mm ID} \times 305\text{ mm depth}$) filled with Liquid Nitrogen ($-196\ ^\circ\text{C}$).
- **Ancillary Glass**: Non-suckback mineral oil bubbler, 4-way cow receiver adapters, Schlenk flasks ($25\text{ to }1000\text{ mL}$) with PTFE sidearm valves.

---

# SECTION 5: PHARMACEUTICAL QUALITY CONTROL & PHYSICAL TESTING

### 5.1 Agilent 708-DS Dissolution Apparatus (USP 1, 2, 5, 6)
- **Dimensions**: Lowered drive head: $622\text{ mm W} \times 590\text{ mm D} \times 680\text{ mm H}$; fully elevated: $991\text{ mm H}$. Mass: $54.4\text{ kg}$ dry / $72.4\text{ kg}$ wet.
- **Electrical**: Dual independent circuits: Drive unit $115/230\text{ VAC}, 230\text{ VA}$; external water bath heater/circulator $115/230\text{ VAC}, 1150\text{ W}$ ($4.5\text{ L/min}$ magnetic pump).
- **Drive Kinematics**: Synchronous timing belt driving 8 spindles simultaneously at $10\text{ to }250\text{ RPM}$ ($\pm 1\%$ accuracy, spindle wobble $\le 0.5\text{ mm}$).
- **Vessel Geometry**: 8 precision USP borosilicate vessels ($1000\text{ mL}$, ID $100.0 \pm 1.0\text{ mm}$, height $168\text{ mm}$, hemispherical bottom $r = 50\text{ mm}$). TruCenter self-centering collar rings maintaining shaft concentricity $\le 1.0\text{ mm}$.
- **Accessories**: USP 1 baskets (40-mesh stainless steel); USP 2 paddles ($74.5 \times 19.0\text{ mm}$ blade); motorized Auto-Probe sampling manifold; dual Pt100 RTDs. Doc No. `70-9058`.

### 5.2 Sotax AT50 Automated Tablet Combination Tester
- **Dimensions**: $450\text{ mm W} \times 600\text{ mm D} \times 475\text{ mm H}$, mass $70.5\text{ kg}$. IP52 dust-sealed enclosure.
- **Power**: $100\text{--}240\text{ VAC}, 180\text{ W}$.
- **Feeding Robotics**: 10-batch carousel; linear vibratory singulation chute; SmartAlign dual-paddle active orientation fingers aligning round, oblong, and oval dosage forms.
- **Testing Stations**:
  - Weight: Integrated Mettler Toledo electromagnetic force restoration cell ($0.0000\text{ to }60.0000\text{ g}$, resolution $0.1\text{ mg}$).
  - Thickness: LVDT optical linear encoder caliper ($2.00\text{ to }20.00\text{ mm}$, resolution $0.01\text{ mm}$).
  - Diameter / Width: Precision optical micrometer ($2.00\text{ to }25.00\text{ mm}$, resolution $0.01\text{ mm}$).
  - Hardness (Breaking Force): Precision ball screw servo drive moving load cell jaw ($0.05\text{--}5.00\text{ mm/s}$ constant speed or $10\text{--}200\text{ N/s}$ linear force ramp). S-beam load cell measuring $2.0\text{ to }800.0\text{ N}$ (accuracy $\pm 1.0\text{ N}$).
- **Debris**: Post-test motorized waste chute with pneumatic vacuum clearing port.

### 5.3 ERWEKA ZT 322 Tablet Disintegration Tester (USP <701>)
- **Dimensions**: $430\text{ mm W} \times 400\text{ mm D} \times 660\text{ mm H}$, mass $33.0\text{ kg}$ (2 test stations).
- **Power**: $115/230\text{ VAC}, 1620\text{ W}$ (includes $1500\text{ W}$ flow-through bath heater).
- **Harmonic Kinematics**: Precision eccentric crankshaft mechanism delivering pure sinusoidal vertical harmonic oscillation:
  $$y(t) = y_0 + 27.5\text{ mm} \times \sin(2\pi \times 0.5\text{ Hz} \times t)$$
  Stroke frequency: exactly $30 \pm 1\text{ strokes/min}$; stroke height: exactly $55.0 \pm 2.0\text{ mm}$.
- **Basket Architecture**: 6 rigid acrylic tubes ($77.5\text{ mm L} \times 21.5\text{ mm ID}$); 10-mesh Type 316 stainless steel woven wire screen (aperture $1.8\text{--}2.2\text{ mm}$); fluted cylindrical acrylic disks ($\varnothing 20.7\text{ mm} \times 9.5\text{ mm}$); $1000\text{ mL}$ beakers ($800\text{ mL}$ media).

### 5.4 ERWEKA TAR 220 Tablet Friability Tester (USP <1216>)
- **Dimensions**: $237\text{ mm W} \times 370\text{ mm D} \times 278\text{ mm H}$, mass $13.4\text{ kg}$ (with 2 drums).
- **Power**: $100\text{--}240\text{ VAC}, 40\text{ W}$.
- **Kinematics & Drum**: Brushless DC motor rotating drum at exactly $25 \pm 1\text{ RPM}$ for 100 revolutions ($4\text{ min}$). Static-dissipative clear PMMA Roche drum (ID $287.0\text{ mm}$, depth $38.0\text{ mm}$, curved internal scoop radius $75.5\text{ mm}$, free-fall drop distance $156.0\text{ mm}$).
- **Ergonomic 10° Tilt Mechanism**: Rear folding kickstand elevating drum shaft by $10^\circ$ relative to horizontal datum (mandatory under USP <1216> for tablets $\ge 13.0\text{ mm}$ to prevent sliding). Automatic motor reversal funnels tumbled tablets into catch tray.

### 5.5 Metrohm 901/917 Karl Fischer & Mettler Toledo T9 Titrators
- **Metrohm 901/917 KF**: Base unit $142 \times 231 \times 227\text{ mm}$, $7.5\text{ kg}$ workstation. Metrohm 800 Dosino inverted stepping drive mounted directly on reagent bottle ($10,000\text{ steps}$, $0.1\ \mu\text{L}$ resolution); double platinum pin electrode ($I_{pol} = 10\text{--}50\ \mu\text{A}$); coulometric generator cell with/without diaphragm; molecular sieve $3\text{Å}$ drying tube. Power: $45\text{ W}$.
- **Mettler Toledo T9 Excellence**: Base $210 \times 246 \times 250\text{ mm}$, $4.3\text{ kg}$ (+ $18.5\text{ kg}$ InMotion autosampler). Up to 8 Plug-and-Play RFID glass burettes ($20,000\text{ steps}$); dual galvanically isolated $10^{12}\ \Omega$ BNC boards executing two parallel titrations simultaneously; CAN bus architecture. Power: $120\text{ VA}$.

### 5.6 Mettler Toledo MP90 Video Melting Point Apparatus
- **Dimensions**: $180\text{ mm W} \times 190\text{ mm D} \times 350\text{ mm H}$, mass $4.0\text{ kg}$. Power: $100\text{--}240\text{ VAC}, 120\text{ VA}$.
- **Furnace Core**: Gold-plated copper alloy heating block with ceramic aerogel insulation, holding 6 capillaries simultaneously ($1.4\text{ mm OD} \times 0.9\text{ mm ID} \times 100\text{ mm L}$). Temperature: Ambient to $400.0\ ^\circ\text{C}$ (ramps $0.1\text{ to }20.0\ ^\circ\text{C/min}$, accuracy $\pm 0.2\ ^\circ\text{C}$).
- **Video Train**: High-intensity backlight LED array; $2.5\times$ telecentric macro lens; digital color CMOS sensor recording $25\text{ fps}$ synchronized video stream; automated collapse, meniscus, and clear point recognition.

### 5.7 Advanced Instruments OsmoTECH PRO & Anton Paar RheolabQC
- **OsmoTECH PRO**: $250\text{ mm W} \times 390\text{ mm D} \times 460\text{ mm H}$, $13.2\text{ kg}$. 20-sample carousel; vertical elevator head; solid-state Peltier supercooling chamber ($-5\ ^\circ\text{C to } -7\ ^\circ\text{C}$); $250\text{ Hz}$ electromagnetic freeze pulse nucleation wire; glass NTC thermistor reading plateau freezing point depression ($0\text{ to }2000\text{ mOsm/kg}$, $\pm 3\text{ mOsm/kg}$ accuracy). Power: $60\text{ W}$.
- **RheolabQC**: $300\text{ mm W} \times 350\text{ mm D} \times 720\text{ mm H}$, $14.0\text{ kg}$. Low-inertia EC brushless motor, $2\ \mu\text{rad}$ optical disk encoder ($0.01\text{ to }1200\text{ RPM}$); torque range $0.20\text{ to }75.0\text{ mNm}$; Toolmaster RFID recognition; CC27/CC17 concentric cylinders; PTD 180 Peltier jacket ($-20\ ^\circ\text{C to } +180\ ^\circ\text{C}$). Power: $80\text{ W}$.

---

# SECTION 6: MASTER BOROSILICATE 3.3 GLASSWARE CATALOG (ISO 3585 / ASTM E438)

### 6.1 Material Properties & Three.js PBR Shader
- **Chemical Formulation**: $81.0\%\text{ SiO}_2, 13.0\%\text{ B}_2\text{O}_3, 4.0\%\text{ Na}_2\text{O/K}_2\text{O}, 2.0\%\text{ Al}_2\text{O}_3$.
- **Physical Constants**: Density $\rho = 2.23\text{ g/cm}^3$; Refractive Index $n_D = 1.520$; Abbe Number $V_D = 65.4$; CTE $\alpha = 3.3 \times 10^{-6}\text{ K}^{-1}$; $T_g = 525\ ^\circ\text{C}$; Softening Point $825\ ^\circ\text{C}$.
- **Three.js Optical Material Configuration**:
  ```javascript
  const borosilicateGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.96,
    opacity: 1.0,
    transparent: true,
    roughness: 0.015,
    metalness: 0.0,
    ior: 1.52,
    thickness: 2.2, // mm
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  ```

### 6.2 Standard Taper Interchangeable Ground Joints (ASTM E676 / ISO 383)
- **Taper Ratio**: Exactly **1:10 on diameter** ($2^\circ 51' 45''$ half-angle). Ground surface roughness $R_a = 0.8\text{--}1.2\ \mu\text{m}$. Diametral tolerance $\pm 0.025\text{ mm}$.
- **Matrix**:
  - `ST 14/20`: $D_{\text{large}} = 14.50\text{ mm}, D_{\text{small}} = 12.50\text{ mm}, L = 20.0\text{ mm}$ (microscale, Schlenk ports).
  - `ST 19/22`: $D_{\text{large}} = 18.80\text{ mm}, D_{\text{small}} = 16.60\text{ mm}, L = 22.0\text{ mm}$ (distillation, side ports).
  - `ST 24/40`: $D_{\text{large}} = 24.00\text{ mm}, D_{\text{small}} = 20.00\text{ mm}, L = 40.0\text{ mm}$ (universal standard synthesis).
  - `ST 29/32`: $D_{\text{large}} = 29.20\text{ mm}, D_{\text{small}} = 26.00\text{ mm}, L = 32.0\text{ mm}$ (ISO/DIN standard).
  - `ST 29/42`: $D_{\text{large}} = 29.20\text{ mm}, D_{\text{small}} = 25.00\text{ mm}, L = 42.0\text{ mm}$ (rotovap vapor ducts).
  - `ST 45/50`: $D_{\text{large}} = 45.00\text{ mm}, D_{\text{small}} = 40.00\text{ mm}, L = 50.0\text{ mm}$ (vessel heads, Soxhlet).

### 6.3 Round Bottom Boiling Flasks (RBF)
Blown spherical bodies with calibrated wall thickness:
- **Dimensional Matrix**:
  - `25 mL`: Outer $\varnothing 42\text{ mm}$, wall $1.8\text{ mm}$, height $88\text{ mm}$ (ST 14/20). Chemglass `CG-1500-01`.
  - `50 mL`: Outer $\varnothing 48\text{ mm}$, wall $1.8\text{ mm}$, height $95\text{ mm}$ (ST 14/20). Chemglass `CG-1500-02`.
  - `100 mL`: Outer $\varnothing 64\text{ mm}$, wall $2.0\text{ mm}$, height $130\text{ mm}$ (ST 24/40). Chemglass `CG-1500-04`.
  - `250 mL`: Outer $\varnothing 85\text{ mm}$, wall $2.0\text{ mm}$, height $148\text{ mm}$ (ST 24/40). Chemglass `CG-1500-06`.
  - `500 mL`: Outer $\varnothing 105\text{ mm}$, wall $2.2\text{ mm}$, height $175\text{ mm}$ (ST 24/40). Chemglass `CG-1500-07`.
  - `1000 mL`: Outer $\varnothing 131\text{ mm}$, wall $2.4\text{ mm}$, height $205\text{ mm}$ (ST 24/40). Chemglass `CG-1500-08`.
  - `2000 mL`: Outer $\varnothing 166\text{ mm}$, wall $2.6\text{ mm}$, height $245\text{ mm}$ (ST 24/40). Chemglass `CG-1500-09`.
  - `3000 mL`: Outer $\varnothing 185\text{ mm}$, wall $2.8\text{ mm}$, height $275\text{ mm}$ (ST 24/40). Chemglass `CG-1500-10`.
  - `5000 mL`: Outer $\varnothing 223\text{ mm}$, wall $3.0\text{ mm}$, height $315\text{ mm}$ (ST 24/40). Chemglass `CG-1500-11`.
- **Multi-Neck Kinematics**:
  - 2-Neck Angled (`CG-1506`): Center ST 24/40 vertical ($0^\circ$), side neck ST 14/20 or 24/40 angled at $20.0^\circ$ piercing spherical center $(0, Y_c, 0)$.
  - 3-Neck Angled (`CG-1524`): Center ST 24/40 vertical, twin side necks angled $20.0^\circ$ outward in coplanar $X-Z$ plane (span at top: $62\text{ mm}$ for $250\text{ mL}$, $96\text{ mm}$ for $1000\text{ mL}$, $154\text{ mm}$ for $5000\text{ mL}$).
  - 3-Neck Parallel (`CG-1522`): Center vertical, side necks parallel ($0^\circ$), center-to-center offset $45.0\text{ mm}$ ($1000\text{ mL}$).
  - 4-Neck Radial (`CG-1530`): Center vertical, 3 side necks at $20^\circ$ arranged at $120^\circ$ polar spacing.

### 6.4 Condensers & Distillation Infrastructure
- **Liebig Condenser (`CG-1218`)**: Jacket OD $28\text{ mm}$, inner vapor tube straight OD $14\text{ mm}$, jacket lengths $200, 300, 400\text{ mm}$, GL-14 hose barbs, ST 24/40 joints.
- **Allihn Condenser (`CG-1200`)**: Jacket OD $40\text{ mm}$, repeating chain of blown spherical bulbs (bulb OD $26\text{ mm}$, constriction $13\text{ mm}$, 6 bulbs for $300\text{ mm}$ jacket), $45^\circ$ beveled drip tip.
- **Graham Condenser (`CG-1206`)**: Jacket OD $42\text{ mm}$, internal helical coil (tubing OD $8\text{ mm}$, helix OD $28\text{ mm}$, pitch $14\text{ mm}$, 21 turns).
- **Friedrichs Condenser (`CG-1210`)**: Body OD $52\text{ mm} \times 320\text{ mm L}$, central cold finger with continuous molded Archimedean spiral thread (OD $46\text{ mm}$, pitch $12\text{ mm}$), $45^\circ$ side takeoff arm.
- **Dimroth Condenser (`CG-1212`)**: Outer jacket OD $40\text{ mm}$, internal double helix coil (capillary OD $6.5\text{ mm}$, outer helix OD $28\text{ mm}$, inner return helix OD $14\text{ mm}$, pitch $11\text{ mm}$), bottom condensate guide drip cone.
- **Vigreux Columns**: Sealed silvered vacuum jacket (`CG-1232`), fractionating length $300\text{ mm}$, 4-point downward glass thorn indentations every $14\text{ mm}$ vertical pitch.
- **Adapters**: Claisen U-adapter (`CG-1000`), 3-way still head (`CG-1024`, sidearm angled $75^\circ$ from vertical), vacuum take-off cow receiver (`CG-1036`, 3-arm radial spider), thermometer pocket (`CG-1040`, GL-14 compression cap), anti-splash bump bulb (`CG-1020`, prolate spheroid $\varnothing 75\text{ mm}$).
- **Funnels**: Conical Squibb separatory funnels (`CG-1700`, 60 to 2000 mL with 1:10 PTFE stopcock); pressure-equalizing dropping funnels (`CG-1715`, graduated cylinder with side bypass arm); porcelain Büchner funnels (CoorsTek 60242); fritted glass funnels (`CG-1772`, disc porosities P1 $100\text{--}160\ \mu\text{m}$, P2 $40\text{--}100\ \mu\text{m}$, P3 $16\text{--}40\ \mu\text{m}$, P4 $10\text{--}16\ \mu\text{m}$).
- **Extraction & Reaction**: Soxhlet extractor (`CG-1250`, $100\text{ mL}$ and $250\text{ mL}$ with capillary siphon loop and ST 45/50 joint); Dean-Stark water separator trap (`CG-1258`, $10\text{ mL}$ or $25\text{ mL}$ graduated receiver with lower PTFE drain stopcock); Drechsel gas washing bottle (`CG-1110`, sintered dispersion disc); heavy vacuum desiccators (`CG-1100`, ID $250\text{ mm}$, wall $6.5\text{ mm}$, ground glass flange, porcelain plate).
- **Volumetric Class A (ASTM E288 / E1272)**: Volumetric flasks ($5\text{ to }2000\text{ mL}$, pennyhead ground stoppers, tolerances $\pm 0.02\text{ to } \pm 0.50\text{ mL}$); Graduated cylinders ($10\text{ to }2000\text{ mL}$, hexagonal bases, pour spouts, bumper guards).
- **Specialized Consumables**: Wilmad 507-PP-7 precision $5\text{ mm}$ 500 MHz NMR tubes ($177.8\text{ mm L} \times 4.970\text{ mm OD}$, camber $< 13\ \mu\text{m}$); 2 mL chromatography vials ($11.6 \times 32.0\text{ mm}$, 9-425 screw neck, PTFE/silicone septa); Schlenk storage tubes with J. Young high-vacuum PTFE valves.

---

# SECTION 7: PRECISION LIQUID HANDLING, BENCH TOOLS & HARDWARE

### 7.1 Manual & Electronic Micropipettes
- **Manual Pipettes (Rainin Pipet-Lite XLS+ / Eppendorf Research plus)**:
  - 9 procedural sub-assemblies: `Btn_Plunger` (two-stage spring travel: $8.0\text{ mm}$ measuring, $+3.5\text{ mm}$ blowout), `Collar_VolumeLock`, `UI_CounterWindow` (4-digit magnified odometer), `Body_PipetteUpper` (PBT handle with embedded RFID tag), `Btn_TipEjector`, `Sleeve_Ejector` (316SS), `Shaft_TipCone` (PVDF/PEEK), `Assembly_Piston` (zirconia ceramic / 316L SS), `Spring_TipCone` ($1.2\text{ mm}$ axial retracting suspension).
  - Volumetric Ranges & Color Codes: $0.1\text{--}2.5\ \mu\text{L}$ (Dark Gray), $0.5\text{--}10\ \mu\text{L}$ (Medium Gray), $2\text{--}20\ \mu\text{L}$ (Light Yellow), $10\text{--}100\ \mu\text{L}$ (Yellow), $20\text{--}200\ \mu\text{L}$ (Yellow), $100\text{--}1000\ \mu\text{L}$ (Blue), $0.5\text{--}5.0\text{ mL}$ (Violet), $1.0\text{--}10.0\text{ mL}$ (Turquoise). Lengths: $245\text{ to }305\text{ mm}$.
  - Multi-Channel: 8-channel and 12-channel models with $9.00\text{ mm}$ nozzle spacing and $360^\circ$ rotating lower manifold.
- **Electronic Pipettes (Eppendorf Xplorer plus)**: Bipolar stepper motor with ball-screw linear encoder ($0.05\ \mu\text{m}$ resolution); $1.8"$ full-color TFT display; multi-function rocker switch; rechargeable Li-ion cell ($3.7\text{ V}, 1200\text{ mAh}$) with gold dock contacts.
- **Carousel Stands**: Cast iron weighted base disc ($\varnothing 210\text{ mm}, 1.85\text{ kg}$), 304SS vertical rod ($\varnothing 25 \times 320\text{ mm}$), rotating head with 6 cradles.

### 7.2 Benchtop Tools, Hardware & Clamps
- **Micro-Spatulas (AISI 304/316 Electropolished)**:
  - Hayman Micro-Spatula: $150.0\text{ mm L}$, flat paddle ($4.0 \times 30.0 \times 0.8\text{ mm}$) + curved spoon bowl ($4.0 \times 10.0 \times 1.2\text{ mm}$).
  - Micro-Spoon Spatula: $165.0\text{ mm L}$, semi-spherical spoon ($\varnothing 6.5\text{ mm}$) + $45^\circ$ flat blade ($6.0 \times 35.0\text{ mm}$).
  - Chattaway Spatula: $200.0\text{ mm L}$, flat blade ($8.0 \times 50.0\text{ mm}$) + $45^\circ$ bent scraper end.
  - Scoopula (Fisherbrand 14-357): $150/190\text{ mm L}$, curved trough ($12.5\text{ mm}$ wide, arc radius $6.25\text{ mm}$) with pointed tip.
- **Dumont Precision Tweezers**: Style #3 (fine straight, $120\text{ mm}$), Style #5 (super-fine needle $0.05 \times 0.01\text{ mm}$ tips, $110\text{ mm}$), Style #7 (curved $45^\circ$, $115\text{ mm}$).
- **PTFE Magnetic Stir Bars**: Compression-molded virgin PTFE jacket over Alnico V/NdFeB core. Octagonal with center pivot ring ($\varnothing 8 \times 25\text{ mm}, \varnothing 8 \times 38\text{ mm}, \varnothing 10 \times 50\text{ mm}$); Egg-shaped oval for RBFs ($\varnothing 12 \times 25\text{ mm}, \varnothing 16 \times 35\text{ mm}, \varnothing 20 \times 50\text{ mm}$); 4-bladed Cross stars ($\varnothing 20, 30, 38\text{ mm}$); Micro Fleas ($\varnothing 1.5 \times 2\text{ mm}$ to $\varnothing 3 \times 10\text{ mm}$); PTFE retriever wand ($350\text{ mm L}$).
- **Laboratory Scissor Jacks**: Anodized 6061-T6 aluminum platforms ($100 \times 100\text{ mm}, 150 \times 150\text{ mm}, 200 \times 200\text{ mm}$); stainless pantograph linkages; M8/M10 Acme threaded drive screws; load ratings $20\text{ to }60\text{ kg}$.
- **Clamps, Bossheads & Ring Stands**: Cast iron retort bases ($250 \times 160 \times 28\text{ mm}, 3.2\text{ kg}$) with $\varnothing 12 \times 750/1000\text{ mm}$ stainless steel rods; 304SS 90° bosshead clamps; 3-prong swivel extension clamps with silicone sleeves ($0\text{ to }85\text{ mm}$ grip); Keck POM joint clips (Size 14 Yellow, Size 19 Blue, Size 24 Green, Size 29 Red, Size 45 Brown).

---

# SECTION 8: FACILITY CONTAINMENT & SAFETY INFRASTRUCTURE

### 8.1 Labconco Protector Premier 6-Foot (72") Chemical Fume Hood
- **Dimensions**: Exterior $1829.0\text{ mm W} \times 805.0\text{ mm D} \times 1499.0\text{ mm H}$ ($72.0" \times 31.7" \times 59.0"$). Interior work chamber: $1581.0\text{ mm W} \times 610.0\text{ mm D} \times 1219.0\text{ mm H}$. Mass: $225.0\text{ kg}$.
- **Exhaust Collar**: $\varnothing 325.0\text{ mm}$ ($12.8"$ OD for nominal 12" duct connection) molded into fiberglass top. Face velocity: $100\text{ fpm}$ at $18"\ (457\text{ mm})$ operating sash opening ($1050\text{ CFM}$).
- **Materials & Enclosure**: 18-gauge cold-rolled electro-galvanized sheet steel with glacier white epoxy powder coat; one-piece seamless molded fiberglass-reinforced polyester liner with radiused corners ($R = 25.0\text{ mm}$).
- **Sash Kinematics**: $4.8\text{ mm}$ ($3/16"$) tempered clear safety glass with polished pencil edges; dual #35 stainless steel roller chains traversing sealed ball-bearing sprockets to rear counterweights; max vertical opening $711.0\text{ mm}$ ($28.0"$).
- **Aerodynamics & Baffles**: Eco-Foil extruded 6063-T6 aluminum airfoil with Clean-Sweep slots directing laminar boundary air across the bench; fixed 3-slot rear fiberglass baffle system (lower slot for heavy solvent vapors, middle for heat, upper for light gases).
- **Services**: Sealed vapor-proof LED luminaire ($> 540\text{ lux}$); 4 color-coded remote service valves on front corner posts (Blue: Gas, Yellow: Vacuum, Orange: Nitrogen, Green: Water); dual 115V AC 20A GFCI duplex receptacles (`Power_Receptacle_Duplex`). Catalog No. `100600002`.

### 8.2 MBraun UNIlab Pro Inert Atmosphere Glovebox
- **Dimensions**: Main box $1600\text{ mm W} \times 1050\text{ mm D} \times 1900\text{ mm H}$ (including structural stand). Net weight: $420.0\text{ kg}$.
- **Containment & Atmosphere**: ISO 10648-2 Class 1 hermetic chamber (leak rate $< 0.05\text{ vol\%/h}$). Working gas: Nitrogen, Argon, or Helium maintaining $< 1.0\text{ ppm } O_2$ and $< 1.0\text{ ppm } H_2O$.
- **Sub-Assemblies**:
  - Main Chamber: $3\text{ mm}$ Type 304 stainless steel, brushed finish, with inclined polycarbonate front viewing window ($10\text{ mm}$ thick) and 3 ergonomic aluminum glove ports ($\varnothing 220\text{ mm}$) with black butyl gloves.
  - Large Cylindrical Antechamber: $\varnothing 390\text{ mm} \times 600\text{ mm L}$, horizontal sliding tray, dual aluminum hinged doors with swing-clamp locks.
  - Mini Antechamber: $\varnothing 150\text{ mm} \times 400\text{ mm L}$ for rapid tool/vial transfer.
  - Gas Purification Column: Closed-loop recirculating blower ($30\text{ m}^3\text{/h}$); copper catalyst column (oxygen removal) and molecular sieve column (moisture removal); automated thermal regeneration cycle.
  - PLC Controller: Siemens 7" color touch panel with integrated pressure sensor ($\pm 15\text{ mbar}$ regulation via automatic dual foot pedals).

### 8.3 Justrite Sure-Grip EX 60-Gallon Flammable Storage Cabinet
- **Dimensions**: $864\text{ mm W} \times 864\text{ mm D} \times 1651\text{ mm H}$ ($34.0" \times 34.0" \times 65.0"$). Mass: $177.0\text{ kg}$.
- **Construction**: 18-gauge ($1.0\text{ mm}$) double-wall welded steel with $38.0\text{ mm}$ ($1.5"$) insulating air gap; high-durability safety yellow epoxy-polyester powder coat; dual 2" NPT vent bungs with built-in flame arrestors; continuous piano hinges; 3-point stainless steel bullet latching system; leak-tight $51.0\text{ mm}$ ($2.0"$) bottom containment sump; built-in exterior grounding lug screw. Complies with OSHA 29 CFR 1910.106 and NFPA Code 30.

---

# SECTION 9: DIGITAL TWIN PROCEDURAL CAD & LOGIC ARCHITECTURE

When modeling these instruments into individual packages (`<name>_twin/`) or the master desk (`lab_viewer/`), follow the established **13-Subagent Puzzle Architecture**:

```
+-----------------------------------------------------------------------------------------------+
|                               13-SUBAGENT PUZZLE DIVISION OF LABOR                            |
|                                                                                               |
|  [01. twin_spec_researcher]           --> Ingests manuals, 1:1 dimensions, BOM, formulas      |
|  [02. twin_chassis_builder]           --> Structural unibody casting, seam lines, leveling ft |
|  [03. twin_power_circuit_engineer]    --> Duplex outlet box, NEMA plug, internal PSU, wiring  |
|  [04. twin_sensor_data_engineer]      --> Tachometers, thermistors, data ports, CSV telemetry |
|  [05. twin_display_silkscreen_eng]    --> Recessed UI_LCD, dynamic canvas, upright typography |
|  [06. twin_controls_ergonomics_eng]   --> Btn_* meshes, 1mm depress, knurled dials, switches  |
|  [07. twin_internal_mechanics_builder]--> Motors, ballast, bearings, exploded view offsets    |
|  [08. twin_environment_lighting_dir]  --> Lab bench (Y=0 datum), backsplash, 3-point studio   |
|  [09. twin_labware_fluid_specialist]  --> Borosilicate glassware, Falcon/Eppendorf, meniscus  |
|  [10. twin_audio_sfx_synthesizer]     --> Web Audio API procedural acoustics, switch clicks   |
|  [11. twin_controller_logic_engineer] --> Python controller + test suite, JS state engine     |
|  [12. twin_web_ui_architect]          --> Collapsible dark UI panels, Part Explorer, CSS vars |
|  [13. twin_visual_qa_auditor]         --> 6-viewpoint automated CDP audit, preflight gate     |
+-----------------------------------------------------------------------------------------------+
```

### Pre-Flight Verification Gate Rules
1. **Rule 9 (Physical Continuity)**: Never illuminate a screen, spin a motor, or warm a heater while `isPluggedIn === false` or the rear rocker switch is off.
2. **DIAG-005 & DIAG-015 (Upright Typography)**: Dynamic canvas LCD textures must set `texture.flipY = false;` and invert buffer UV coordinates (`uv.setY(i, 1.0 - uv.getY(i));`). Test that text reads upright under `CAM_FRONT`.
3. **DIAG-001 (Boundary Clearance)**: Control bezels, dials, and membrane keypads must occupy $\le 85\%$ of the parent face width, leaving $\ge 3.5\text{ mm}$ physical separation from edges and displays.
4. **DIAG-018 (Kinematic Offsets)**: Exploded view animations must lift major assemblies along clean vertical $+Y$ axes by $+80\text{--}120\text{ mm}$, fully exposing internal cast ballasts, vibration isolators, transformers, and PCBs.
5. **Rule 5 (Ground Plane Datum)**: Leveling feet and base pans must rest exactly on $Y = 0$ local datum ($Y = 9.0$ lab world) with zero tabletop clipping.

---

### COMPLETE OEM DOCUMENTATION & RESOURCE CITATIONS
- **Agilent Technologies**: [Agilent Technical Documentation Library](https://www.agilent.com/en/library/)
- **Waters Corporation**: [Waters Product Manuals & Guides](https://www.waters.com/waters/support.htm)
- **Thermo Fisher Scientific**: [Thermo Scientific Technical Documentation Portal](https://docs.thermofisher.com)
- **Bruker Corporation**: [Bruker Documentation & Site Planning Library](https://www.bruker.com)
- **TA Instruments**: [TA Instruments Support Portal & Manuals](https://www.tainstruments.com/support/)
- **Metrohm AG**: [Metrohm Document Finder & Literature Hub](https://www.metrohm.com/en/support/)
- **Mettler Toledo**: [Mettler Toledo Operating Instructions](https://www.mt.com/us/en/home/support/)
- **Biotage AB**: [Biotage Product Manuals & User Guides](https://www.biotage.com)
- **Radleys**: [Radleys Process Reactor Technical Library](https://www.radleys.com)
- **Huber Kältemaschinenbau**: [Huber Unistat & Chiller Datasheets](https://www.huber-online.com)
- **Labconco Corporation**: [Labconco Manuals & Engineering Specs](https://www.labconco.com)
- **MBraun Inertgas-Systeme**: [MBraun Glovebox & SPS Portals](https://www.mbraun.com)
- **Anton Paar GmbH**: [Anton Paar Instruction Manuals & Brochures](https://www.anton-paar.com)
- **ERWEKA GmbH**: [ERWEKA Pharmaceutical Testing Documentation](https://www.erweka.com)
- **SOTAX AG**: [SOTAX Automation & Testing Library](https://www.sotax.com)
- **Chemglass Life Sciences**: [Chemglass Master Laboratory Glassware Catalog](https://chemglass.com)
