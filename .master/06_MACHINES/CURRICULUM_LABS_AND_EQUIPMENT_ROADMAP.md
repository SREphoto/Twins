# 🔬 ChemMate to Twins: Curriculum-to-Instrumentation Master Roadmap

> **Authoritative Technical Specification & Hardware Manifest**  
> **Status:** Active Engineering Blueprint  
> **Target Applications:** ChemMate (Frontend Interactive Virtual Labs) & Twins (3D Machine Digital Twin Ecosystem)  
> **Governance:** OGA-CAD Master Architecture / SRE Laboratory Instrumentation Standards

---

## 1. Executive Summary & Purpose

This roadmap establishes the complete, 1-to-1 operational mapping between the **ChemMate 10-Tier Mastery Curriculum (184
Modules)** and the **Twins 3D Digital Twin Machine Repository**.

Every lesson in ChemMate is paired with:

1. **A Concrete 3D Virtual Laboratory Experience** (student actions, physical interactions, and empirical data
   acquisition).
2. **Primary Laboratory Instrument / Machine Twin** (identifying whether the machine is already in `Twins`, scaffolded,
   or requires new CAD/kinematic construction).
3. **Glassware, Sensors, Tools & Accessories BOM** (DIN/ISO borosilicate glassware, electronic transducers, liquid
   handling tools, and physical support hardware).

This document serves as the **Hardware Requirements Document (HRD)** and **Build Order** for all CAD subagents and
developers working in `Twins`.

---

## 2. Twins Machine Status & Cross-Curricular Inventory

| Machine Twin ID                       | Real-World OEM Lineage          | Twins Maturity Status       | ChemMate Tier Footprint     | Kinematic / Dynamic Feature Set                                  |
| :------------------------------------ | :------------------------------ | :-------------------------- | :-------------------------- | :--------------------------------------------------------------- |
| **`centrifuge_twin`**                 | Thermo Sorvall Legend X1        | **Gold Standard (Shipped)** | T1, T3, T4, T5, T6, T7      | Rotor rotation, latching lid, dynamic RPM/RCF display            |
| **`balance_twin`**                    | Mettler Toledo XPE205           | **Ready (Production)**      | T1, T2, T3, T4, T5, T7      | Sliding glass draft shield, tare, 0.0001g dynamic LCD            |
| **`hotplate_twin`**                   | IKA C-MAG HS 7                  | **Ready (Production)**      | T1, T2, T3, T4, T5, T6, T7  | Dual analog dials, heating plate thermal glow, magnetic stir bar |
| **`rotovap_twin`**                    | Heidolph Hei-VAP Precision      | **Ready (Production)**      | T1, T5, T6, T7, T8          | Motorized lift column, spinning flask, helical condenser bath    |
| **`spectrophotometer_twin`**          | Thermo Scientific Genesys 50    | **Ready (Production)**      | T1, T2, T3, T4, T5, T6, T7  | Hinged lid, sample turret, dynamic absorbance/transmission LCD   |
| **`vacuum_pump_twin`**                | Vacuubrand MD 4C NT             | **Ready (Production)**      | T1, T2, T3, T5, T6, T7, T10 | Diaphragm motor casing, vacuum dial gauge, gas ballast valve     |
| **`ph_meter_twin`**                   | Oakton pH 700 Benchtop          | **Scaffolded (Priority 1)** | T4, T5, T6, T7              | Articulated electrode arm, glass bulb probe, pH/mV/°C LCD        |
| **`muffle_furnace_twin`**             | Carbolite Gero CWF 1100         | **Scaffolded (Priority 1)** | T1, T2, T3, T6, T8, T9      | Parallel-action door, ceramic chamber glow, PID controller       |
| **`glove_box_twin`**                  | Inert Corp I-Box 2-Port         | **Scaffolded (Priority 1)** | T6, T8, T9                  | Acrylic window, dual butyl glove ports, vacuum antechamber       |
| **`ultrasonic_cleaner_twin`**         | Branson CPX Series              | **Scaffolded (Priority 2)** | T3, T5, T6, T9              | Stainless bath chamber, transducer cavitation wave, timer        |
| **`vortex_mixer_twin`**               | Scientific Industries Genie 2   | **Scaffolded (Priority 2)** | T1, T3, T4, T5, T7          | Orbital eccentric rubber cup, continuous/touch toggle            |
| **`high_pressure_reactor_twin`**      | Parr 4560 Mini Reactor          | **Scaffolded (Priority 2)** | T2, T3, T6, T7, T8          | Split-ring closure, magnetic drive impeller, pressure dial       |
| **`calorimeter_twin`** _(New)_        | Parr 1341 Oxygen Bomb & Dewar   | **Needs CAD Scaffolding**   | T4, T7                      | Bomb cylinder, ignition wire leads, insulated water jacket       |
| **`auto_titrator_twin`** _(New)_      | Metrohm Eco Titrator & Stand    | **Needs CAD Scaffolding**   | T3, T4, T7                  | Motorized glass syringe burette, drop sensor, stirrer base       |
| **`gas_laws_piston_twin`** _(New)_    | Pasco Precision Bore Syringe    | **Needs CAD Scaffolding**   | T3                          | Low-friction glass piston, volume graduations, pressure tap      |
| **`potentiostat_twin`** _(New)_       | Gamry Interface 1010E           | **Needs CAD Scaffolding**   | T1, T4, T6, T7              | Working/Counter/Ref alligator clips, cyclic voltammeter screen   |
| **`mel_temp_twin`** _(New)_           | Cole-Parmer Mel-Temp 1201D      | **Needs CAD Scaffolding**   | T2, T5, T7                  | Capillary tube heating block, viewing magnifier, temp dial       |
| **`polarimeter_twin`** _(New)_        | Bellingham+Stanley ADP450       | **Needs CAD Scaffolding**   | T2, T5, T6, T7              | 100mm polarimeter tube trough, optical rotatory angle LCD        |
| **`ftir_twin`** _(New)_               | Thermo Nicolet iS50 ATR-FTIR    | **Needs CAD Scaffolding**   | T6, T7, T10                 | Monolithic diamond ATR crystal stage, pressure tower clamp       |
| **`nmr_twin`** _(New)_                | Nanalysis NMReady-60PRO         | **Needs CAD Scaffolding**   | T6, T7, T8, T9              | 5mm tube insertion well, permanent magnet core, FT-FID display   |
| **`gc_ms_twin`** _(New)_              | Agilent 8890 GC / 5977B MSD     | **Needs CAD Scaffolding**   | T5, T6, T7                  | Heated split/splitless inlet, capillary column oven, ion source  |
| **`xrd_twin`** _(New)_                | Malvern Panalytical Aeris PXRD  | **Needs CAD Scaffolding**   | T2, T6, T9                  | Theta-2Theta goniometer, rotating sample stage, safety enclosure |
| **`radiation_detector_twin`** _(New)_ | Ludlum Model 3 Survey & GM Tube | **Needs CAD Scaffolding**   | T1, T6, T8                  | Halogen-quenched GM wand, analog CPM meter, test lead stand      |
| **`contact_angle_twin`** _(New)_      | ramé-hart Model 250 Goniometer  | **Needs CAD Scaffolding**   | T2, T9                      | Micrometer dosing syringe, backlit optical stage, CCD camera     |

---

## 3. Tier-by-Tier Systematic Curriculum & Instrumentation Mapping

### Tier 1: Atoms & Elements (24 Modules)

#### 1. MATE-LOGIC-T1L1-100: Chemistry in Context

- **3D Lab Simulation:** Observation and separation of macroscopic copper(II) sulfate pentahydrate dissolution and
  recrystallization. Students observe color changes, measure thermal variations, and separate components.
- **Primary Machine:** `hotplate_twin` (Hotplate Stirrer) & `balance_twin` (Analytical Balance)
- **Glassware & Accessories:** 100 mL Borosilicate Beaker, Glass Stirring Rod, Plastic Weighing Dish, Micro-Spatula,
  Digital Temperature Probe.

#### 2. NGSS-PS1.1-T1L2-101: Matter Basics

- **3D Lab Simulation:** Physical Separation of a Heterogeneous Multi-Component Mixture (Sand, Table Salt, Iron Filings,
  and Water). Students use magnet separation, gravity filtration, centrifugation of fine silts, and thermal evaporation.
- **Primary Machine:** `centrifuge_twin` (Sorvall Legend X1) & `hotplate_twin` (Hotplate Stirrer)
- **Glassware & Accessories:** Neodymium Bar Magnet, 15 mL Conical Centrifuge Tubes with Caps, 60° Borosilicate Glass
  Funnel, Whatman No. 1 Filter Paper, 250 mL Erlenmeyer Flask, Porcelain Evaporating Dish.

#### 3. NGSS-PS3.2-T1L3-102: Phase Shift

- **3D Lab Simulation:** Heating and Cooling Curves of Pure Substances vs Mixtures (Lauric Acid / Stearic Acid).
  Students record real-time temperature vs time to observe plateaus at latent heat transition points.
- **Primary Machine:** `hotplate_twin` with immersion temperature feedback
- **Glassware & Accessories:** 600 mL Water Bath Beaker, 25×150 mm Borosilicate Boiling Tube, Retort Stand with 3-Prong
  Extension Clamp, Type-K Thermocouple Probe, Digital Timer.

#### 4. NGSS-PS1.1-T1L4-103: Inside the Atom

- **3D Lab Simulation:** Rutherford Alpha Particle Scattering Simulation. Students fire alpha particles at thin gold
  foils in an evacuated chamber and record deflection counts across angular arcs (0° to 180°).
- **Primary Machine:** `radiation_detector_twin` (Alpha Detection Chamber) & `vacuum_pump_twin` (Diaphragm Pump)
- **Glassware & Accessories:** Americium-241 Alpha Source Capsule, Collimation Aperture, 0.1 µm Gold Leaf Target, Zinc
  Sulfide Fluorescent Detector / Silicon Surface Barrier Detector, Vacuum Hose with Quick-Flange.

#### 5. NGSS-PS1.1-T1L5-104: Elements and Identity

- **3D Lab Simulation:** Flame Emission Spectroscopy of Group 1 and 2 Metal Chlorides. Students introduce metal salt
  solutions to a clean flame, capture emission spectra via optical fiber, and identify characteristic Balmer/Rydberg
  wavelengths.
- **Primary Machine:** `spectrophotometer_twin` (Genesys 50 UV-Vis / Fiber Optic Ingestion)
- **Glassware & Accessories:** Platinum Inoculation Wire Loop, 50 mL Watch Glasses, Dilute 1 M HCl Cleaning Vial, Salt
  Specimens (LiCl, NaCl, KCl, CaCl₂, SrCl₂, BaCl₂), Meeker-Style High Temp Gas Burner.

#### 6. NGSS-PS1.3-T1L6-105: Electrostatic Forces and Bonding Fundamentals

- **3D Lab Simulation:** Electrical Conductivity of Solid, Molten, and Aqueous Ionic vs Molecular Compounds.
- **Primary Machine:** `potentiostat_twin` (Conductivity Meter Module) & `hotplate_twin`
- **Glassware & Accessories:** Dual Graphite Rod Electrodes in Insulated Rig, Low-Voltage DC Indicator Unit
  (LED/Ammeter), Porcelain Crucible with Pipe-clay Triangle, 100 mL Beakers, Solid NaCl, Distilled Water, Sucrose.

#### 7. NGSS-PS1.7-T1L7-106: Precision Tools

- **3D Lab Simulation:** Volumetric Transfer Calibration & Density Determination. Students calibrate volumetric
  pipettes, graduated cylinders, and beakers against an analytical balance to determine precision and tolerance.
- **Primary Machine:** `balance_twin` (Mettler Toledo XPE205, 0.0001g)
- **Glassware & Accessories:** 10 mL Class A Volumetric Pipette, Rubber Pipette Bulb, 50 mL Graduated Cylinder, 100 mL
  Beaker, 25 mL Glass Pycnometer with Capillary Stopper, Calibrated Thermometer, Degassed Water.

#### 8. NGSS-PS1.1-T1L8-107: The Macro-Micro Bridge

- **3D Lab Simulation:** Avogadro's Number Determination via Oleic Acid Monolayer Spreading on Water.
- **Primary Machine:** `balance_twin` & Precision Micropipette Rig
- **Glassware & Accessories:** 30 cm Large Shallow Enamel/Glass Tray, Lycopodium Powder Shaker, P20 Micropipette (1–20
  µL), Oleic Acid in Hexane Solution (0.5%), Metric Ruler, Calipers.

#### 9. NGSS-PS1.1-T1L9-108: Subatomic Particles and Measured Properties

- **3D Lab Simulation:** Thomson Cathode Ray Tube Charge-to-Mass Ratio ($e/m$). Students apply electrostatic deflection
  plates and Helmholtz coil magnetic fields to balance electron beam paths.
- **Primary Machine:** Cathode Ray Electrostatic & Magnetic Deflection Rig
- **Glassware & Accessories:** Evacuated Glass CRT with Phosphor Screen, Dual Helmholtz Coils, Adjustable High-Voltage
  Anode Supply (0–5 kV), Low-Voltage Deflection Supply, Gaussmeter Probe.

#### 10. NGSS-PS1.1-T1L10-109: Isotope Balance

- **3D Lab Simulation:** Mass Spectrometry Relative Abundance Simulation. Students inject elemental gas isotopes (Ne-20,
  Ne-21, Ne-22) into a magnetic sector simulator to compute weighted atomic mass.
- **Primary Machine:** Benchtop Quadrupole MS Virtual Console (Twin)
- **Glassware & Accessories:** Gas Dosing Ampoules, Septum Sample Port, High-Vacuum Turbo Line (`vacuum_pump_twin`).

#### 11. NGSS-PS1.1-T1L11-110: Dalton's Postulates

- **3D Lab Simulation:** Law of Multiple Proportions via Thermal Reduction of Copper(I) Oxide vs Copper(II) Oxide.
- **Primary Machine:** `balance_twin` & `muffle_furnace_twin` (Carbolite CWF 1100)
- **Glassware & Accessories:** Porcelain Crucibles with Covers, Crucible Tongs, Vacuum Desiccator with Anhydrous
  Drierite, Spatula, Pure Copper Oxides.

#### 12. NGSS-PS1.1-T1L12-111: Plum Pudding

- **3D Lab Simulation:** Historical Cathode Ray Electron Beam Penetration & Magnetic Deflection.
- **Primary Machine:** Vintage Crookes Tube Simulator Twin
- **Glassware & Accessories:** Maltese Cross Shadow Tube, High-Voltage Induction Coil, Neodymium Bar Magnets.

#### 13. NGSS-PS1.1-T1L13-112: The Nucleus

- **3D Lab Simulation:** Quantitative Alpha Backscattering Cross-Section vs Nuclear Charge ($Z_{target}$).
- **Primary Machine:** `radiation_detector_twin` & Target Turret Rig
- **Glassware & Accessories:** Foils of Al, Ni, Ag, Au, Lead Collimator, Multichannel Pulse Analyzer.

#### 14. NGSS-PS1.1-T1L14-113: Discrete Quantized Energy States

- **3D Lab Simulation:** Gas Discharge Emission Spectroscopy & Balmer Formula Verification.
- **Primary Machine:** `spectrophotometer_twin` (with Fiber Optic Emission Collector)
- **Glassware & Accessories:** Hydrogen, Helium, and Mercury Gas Discharge Tubes, 5 kV High-Voltage Spectrum Tube Power
  Supply, Transmission Diffraction Grating (600 lines/mm).

#### 15. NGSS-PS1.1-T1L15-114: Atomic Mass Units

- **3D Lab Simulation:** Carbon-12 Standard Primary Calibration & Avogadro Lattice Counting.
- **Primary Machine:** `balance_twin` (Ultra-Micro Precision Mode)
- **Glassware & Accessories:** Single-Crystal Silicon Sphere Reference Sample, Quartz Weighing Boat, Antistatic Ionizer
  Bar.

#### 16. NGSS-PS1.1-T1L16-115: The Periodic Law

- **3D Lab Simulation:** Period 3 Oxide and Chloride Chemical Periodicity (Acidity/Basicity across $Na 
ightarrow Cl$).
- **Primary Machine:** `ph_meter_twin` (Oakton pH 700) & Fume Hood Workstation
- **Glassware & Accessories:** 50 mL Beakers, Universal Indicator, Glass Stirring Rods, Tweezers, Samples of
  $Na_2O_2, MgO, Al_2O_3, SiO_2, P_4O_{10}, SO_2$ solutions.

#### 17. NGSS-PS1.1-T1L17-116: Metallic Nature

- **3D Lab Simulation:** Electrical Resistivity (Four-Point Probe) and Thermal Conductivity of Pure Metals.
- **Primary Machine:** Four-Point Probe Benchtop Rig & Constant Temp Water Bath (`hotplate_twin`)
- **Glassware & Accessories:** Metal Rod Specimens (Cu, Al, Fe, Pb, Sn), Dual Digital Thermocouple Probes, DC Constant
  Current Source, Precision Digital Voltmeter.

#### 18. NGSS-PS1.1-T1L18-117: Non-Metal Logic

- **3D Lab Simulation:** Allotropy and Chemical Inactivity of Non-Metals (Sulfur, Red/White Phosphorus, Nitrogen).
- **Primary Machine:** `hotplate_twin` & `muffle_furnace_twin`
- **Glassware & Accessories:** Pyrex Test Tubes, Sublimation Cold Finger, Liquid Hexane Solvent, Crucible, Watch
  Glasses.

#### 19. NGSS-PS1.1-T1L19-118: The Staircase

- **3D Lab Simulation:** Metalloid Semiconductor Bandgap vs Temperature Resistance Curve.
- **Primary Machine:** `hotplate_twin` (Controlled Thermal Ramp) & Digital Multimeter
- **Glassware & Accessories:** Intrinsic Germanium and Silicon Single-Crystal Chips, Spring-Loaded Copper Contact
  Clamps, Ceramic Insulated Base, Thermocouple.

#### 20. NGSS-PS1.1-T1L20-119: Valence Stability and Electron Configurations

- **3D Lab Simulation:** Noble Gas Ionization Breakdown Potential (Paschen's Law Curve).
- **Primary Machine:** High Voltage Breakdown Tube Rig
- **Glassware & Accessories:** Sealed Noble Gas Discharge Cells (He, Ne, Ar, Kr, Xe), High-Voltage AC/DC Power Supply
  (0–10 kV), Spark Gap Electrodes.

#### 21. NGSS-PS1.1-T1L21-120: Group 17 Kinetics and Electronegativity

- **3D Lab Simulation:** Halogen Displacement Redox Series ($Cl_2 + 2Br^- 
ightarrow 2Cl^- + Br_2$).
- **Primary Machine:** `vortex_mixer_twin` (Vortex-Genie 2) & `centrifuge_twin`
- **Glassware & Accessories:** 16×150 mm Test Tubes in Rack, Micropipettes, Cyclohexane Extraction Solvent,
  $NaCl, NaBr, NaI$ Solutions, Fresh Chlorine Water.

#### 22. NGSS-PS1.1-T1L22-121: Carbon Catenation and Allotropes

- **3D Lab Simulation:** Micro-Combustion and Thermal Conductivity of Graphite vs Diamond vs Graphene.
- **Primary Machine:** `muffle_furnace_twin` (1100 °C) & `balance_twin`
- **Glassware & Accessories:** High-Purity Alumina Combustion Boats, Quartz Tube, Oxygen Flow Regulator, Synthetic
  Diamond Powder, HOPG Flakes.

#### 23. NGSS-PS1.1-T1L23-122: Hydrogen Fundamentals

- **3D Lab Simulation:** Hofmann Water Electrolysis and Stoichiometric $2:1 H_2:O_2$ Gas Collection.
- **Primary Machine:** Hofmann Electrolysis Apparatus Twin & DC Power Supply (12 V)
- **Glassware & Accessories:** Graduated Glass Electrolysis Arms with PTFE Stopcocks, Platinum Foil Electrodes, Dilute
  $H_2SO_4$ Electrolyte, Gas Collection Test Tubes, Wooden Splints.

#### 24. EXAM-TIER1-T1L24-000: Tier 1 Mastery Exam

- **3D Lab Simulation:** Identification of Three Unknown Solid Elements via Multi-Method Analysis (Density, Flame Test,
  Electrical Conductivity, and Acid Reaction).
- **Primary Machines:** `balance_twin`, `spectrophotometer_twin`, `hotplate_twin`
- **Glassware & Accessories:** Pycnometer, Platinum Loop, Multimeter Probes, 1 M HCl, Unknown Element Pellets.

---

### Tier 2: Molecules & Bonding (25 Modules)

#### 1. NGSS-PS1.1-T2L1-201: Element Explorer

- **3D Lab Simulation:** Magnetic Susceptibility (Paramagnetism vs Diamagnetism) of Elements.
- **Primary Machine:** Gouy Magnetic Susceptibility Balance Twin & `balance_twin`
- **Glassware & Accessories:** Glass Gouy Sample Tube, High-Field Electromagnet, Reference Salts
  ($MnSO_4, CuSO_4, NaCl$).

#### 2. NGSS-PS1.1-T2L2-202: Periodic Trends

- **3D Lab Simulation:** Atomic & Ionic Radii Determination via Powder X-Ray Diffraction.
- **Primary Machine:** `xrd_twin` (Benchtop Powder XRD)
- **Glassware & Accessories:** Borosilicate Capillary Sample Tubes, Zero-Background Silicon Plate, Powdered Alkali
  Halides ($LiF, NaCl, KBr, CsI$).

#### 3. NGSS-PS1.1-T2L3-203: Electron Map

- **3D Lab Simulation:** X-Ray Photoelectron Spectroscopy (XPS) Core-Level Binding Energy Analysis.
- **Primary Machine:** XPS Ultra-High Vacuum Spectrometer Twin & `vacuum_pump_twin`
- **Glassware & Accessories:** Monochromatic Al K-alpha Source, Electron Energy Analyzer, Gold/Carbon Substrate Mount.

#### 4. NGSS-PS1.1-T2L4-204: Quantum Orbitals

- **3D Lab Simulation:** Zeeman Effect Optical Splitting in Transverse and Longitudinal Magnetic Fields.
- **Primary Machine:** Optical Magnet Bench Twin & `spectrophotometer_twin`
- **Glassware & Accessories:** Variable Gap Electromagnet (1.5 Tesla), Low-Pressure Mercury Lamp, Fabry-Pérot
  Interferometer Etalon, Linear Polarizer.

#### 5. NGSS-PS1.2-T2L5-205: Chemical Bonds

- **3D Lab Simulation:** Ionic vs Covalent Melting Point & Molten Electrical Conductivity.
- **Primary Machine:** `mel_temp_twin` (Melting Point Apparatus) & `hotplate_twin`
- **Glassware & Accessories:** Glass Melting Point Capillaries, Alumina Crucibles, Micro-Spatula, $NaCl, KNO_3$,
  Naphthalene, Sucrose.

#### 6. NGSS-PS1.2-T2L6-206: The Pauling Scale

- **3D Lab Simulation:** Dielectric Permittivity and Dipole Moment of Pure Liquids.
- **Primary Machine:** Liquid Dielectric Capacitance Cell Twin & Precision LCR Meter
- **Glassware & Accessories:** Gold-Plated Coaxial Liquid Cell, Micropipette, High-Purity Solvents (Hexane, Carbon
  Tetrachloride, Chloroform, Water).

#### 7. NGSS-PS1.2-T2L7-207: Lewis Structures

- **3D Lab Simulation:** Interactive Valence Shell Formal Charge & Octet Optimization.
- **Primary Machine:** Molecular Workbench Haptic Console Twin
- **Glassware & Accessories:** Valence Electron Pegs, Bond Links, Molecular Geometrical Template.

#### 8. NGSS-PS1.2-T2L8-208: Formal Charge

- **3D Lab Simulation:** Computational Molecular Electrostatic Potential (MEP) Mapping of Isomers
  ($NCS^- 	ext{ vs } SCN^-$).
- **Primary Machine:** Quantum Simulation HUD Twin
- **Glassware & Accessories:** Molecular Coordinate Input Panel, Electron Density Contour Display.

#### 9. NGSS-PS1.2-T2L9-209: Resonance

- **3D Lab Simulation:** UV-Vis Absorption Bathochromic Shift in Conjugated Polyenes.
- **Primary Machine:** `spectrophotometer_twin` (Genesys 50)
- **Glassware & Accessories:** 10 mm Quartz Spectrophotometer Cuvettes, Cyclohexane Solvent, 1,3-Butadiene,
  1,3,5-Hexatriene, Benzene.

#### 10. NGSS-PS1.2-T2L10-210: Coordinate Bonds

- **3D Lab Simulation:** Stepwise Formation of Copper(II) Ammine Complex Ions
  ($[Cu(H_2O)_6]^{2+} 
ightarrow [Cu(NH_3)_4]^{2+}$).
- **Primary Machine:** `spectrophotometer_twin` & `hotplate_twin`
- **Glassware & Accessories:** 50 mL Beakers, 10 mL Graduated Cylinder, Dropping Pipettes, $0.1	ext{ M } CuSO_4$,
  Concentrated Aqueous $NH_3$.

#### 11. NGSS-PS1.1-T2L11-211: Geometry Lab

- **3D Lab Simulation:** VSEPR Steric Repulsion and Real-Time Bond Angle Manipulation.
- **Primary Machine:** 3D Kinematic VSEPR Rig Twin
- **Glassware & Accessories:** Central Atom Sockets ($AX_2 	ext{ through } AX_6$), Electrostatic Repulsion Nodes.

#### 12. NGSS-PS1.3-T2L12-212: Hybridization

- **3D Lab Simulation:** Orbital Overlap Integrals and Sigma/Pi Symmetry Alignment.
- **Primary Machine:** Quantum Orbital Projection Chamber Twin
- **Glassware & Accessories:** Angular Goniometer Base, Laser Beam Coincidence Detectors.

#### 13. NGSS-PS1.3-T2L13-213: Molecular Polarity

- **3D Lab Simulation:** Electric Field Deflection of Micro-Streams of Polar vs Non-Polar Liquids.
- **Primary Machine:** Liquid Jet Deflection Station Twin
- **Glassware & Accessories:** 50 mL Glass Burette with Precision Micro-Tip, Electrostatically Charged Rod
  (Ebonite/Glass), Solvents (Water, Ethanol, Hexane, Diethyl Ether).

#### 14. NGSS-PS1.4-T2L14-214: Bond Dissociation

- **3D Lab Simulation:** Photochemical Dissociation Rate of Gaseous Halogens under UV Light.
- **Primary Machine:** Photochemical Gas Flow Cell Twin & `spectrophotometer_twin`
- **Glassware & Accessories:** Quartz Reaction Tube with Optical Windows, UV Monochromator (300–500 nm), Photodiode
  Detector, $Br_2$ vapor in Nitrogen.

#### 15. NGSS-PS1.3-T2L15-215: Intermolecular Forces

- **3D Lab Simulation:** Capillary Rise & Dynamic Viscosity of Liquids with Differing IMF.
- **Primary Machine:** Ostwald Viscometer Stand Twin & Constant Temp Bath (`hotplate_twin`)
- **Glassware & Accessories:** Calibrated Glass Capillary Tubes (0.2 mm bore), Ostwald Viscometer, Stopwatch, Water,
  Ethanol, Glycerol, Acetone.

#### 16. NGSS-PS1.3-T2L16-216: Van der Waals

- **3D Lab Simulation:** Non-Ideal Gas Deviation and Liquefaction of $CO_2$ near Critical Point.
- **Primary Machine:** `high_pressure_reactor_twin` (Parr Sight Cell) & Hand Compression Pump
- **Glassware & Accessories:** Heavy-Wall Sapphire Viewing Chamber, Digital Pressure Gauge (0–100 bar), Thermostatted
  Water Jacket, Pure $CO_2$ Bottle.

#### 17. NGSS-PS1.3-T2L17-217: H-Bond Deep Dive

- **3D Lab Simulation:** Evaporative Cooling Enthalpy and Boiling Point Elevation of Alcohols vs Alkanes.
- **Primary Machine:** Multi-Channel Digital Thermocouple Logger Twin & `hotplate_twin`
- **Glassware & Accessories:** Fast-Response Thermocouple Probes, Porous Cellulose Wicks, Pipettes, Methanol, Ethanol,
  1-Propanol, Pentane, Hexane.

#### 18. NGSS-PS1.3-T2L18-218: Surface Tension

- **3D Lab Simulation:** Wilhelmy Plate & Du Noüy Ring Precision Surface Tensiometry.
- **Primary Machine:** `contact_angle_twin` / Du Noüy Tensiometer Twin
- **Glassware & Accessories:** Platinum-Iridium Ring (6 cm perimeter), Crystallizing Dishes, Micrometer Elevation Stage,
  Pure Water, Surfactant Dilutions.

#### 19. NGSS-PS1.3-T2L19-219: Vapor Pressure

- **3D Lab Simulation:** Clausius-Clapeyron Enthalpy of Vaporization via Isoteniscope Manometry.
- **Primary Machine:** `vacuum_pump_twin` (Vacuubrand MD 4C NT) & Isoteniscope Station
- **Glassware & Accessories:** Glass Isoteniscope U-Tube Assembly, Thermostatted Heating Bath, Digital Absolute Pressure
  Transducer, Pure Ethanol / Acetone.

#### 20. NGSS-PS1.3-T2L20-220: Phase Diagrams

- **3D Lab Simulation:** Direct Observation of Carbon Dioxide Triple Point (5.11 bar, -56.6 °C) and Supercritical State
  (73.8 bar, 31.1 °C).
- **Primary Machine:** `high_pressure_reactor_twin` (with Optical Window)
- **Glassware & Accessories:** High-Pressure Sapphire Cell, Thermoelectric Peltier Cooler/Heater, Digital Pressure
  Transducer, Strobe Light.

#### 21. NGSS-PS1.3-T2L21-221: Metallic Solids

- **3D Lab Simulation:** Metallographic Polishing, Etching, and Crystal Grain Boundary Microscopy.
- **Primary Machine:** Metallographic Rotary Polisher & Optical Metallurgical Microscope Twin
- **Glassware & Accessories:** Abrasive Silicon Carbide Discs, Diamond Paste (1 µm), Ferric Chloride Etchant Swab,
  Copper and Brass Specimen Mounts.

#### 22. NGSS-PS1.3-T2L22-222: Network Solids

- **3D Lab Simulation:** High-Temperature Quartz Inversion ($alpha 
ightleftharpoons eta$) & Dilatometry.
- **Primary Machine:** `muffle_furnace_twin` (1100 °C) & LVDT Dilatometer
- **Glassware & Accessories:** Fused Quartz Rod, Alumina Dilatometer Pushrod, High-Precision Linear Displacement Sensor.

#### 23. NGSS-PS1.3-T2L23-223: Ionic & Molecular Solids

- **3D Lab Simulation:** Crystallographic Cleavage, Brittleness, and Micro-Hardness (Mohs / Vickers).
- **Primary Machine:** Micro-Indentation Hardness Tester Twin
- **Glassware & Accessories:** Calcite Cleavage Rhombs, Halite Cubes, Sucrose Crystals, Diamond Pyramidal Indenter.

#### 24. NGSS-PS1.3-T2L24-224: Unit Cells

- **3D Lab Simulation:** Density, Packing Factor, and Lattice Parameters of SC, BCC, and FCC Metals.
- **Primary Machine:** `balance_twin` (Immersion Density Mode) & Precision Caliper Rig
- **Glassware & Accessories:** Precision Machined Spheres and Single-Crystal Cubes of Iron (BCC), Copper (FCC), and
  Polonium (SC model), Immersion Beaker.

#### 25. EXAM-TIER2-T2L25-000: Tier 2 Mastery Exam

- **3D Lab Simulation:** Characterization of Unknown Crystal Solids: Melting Point, Solubility, Conductivity, and IMF
  Classification.
- **Primary Machines:** `mel_temp_twin`, `balance_twin`, `hotplate_twin`
- **Glassware & Accessories:** Capillary Tubes, 50 mL Beakers, Conductivity Probe, Unknown Crystals (A, B, C).

---

### Tier 3: The Quantitative Engine (23 Modules)

#### 1. NGSS-HS-PS1-7-T3L1-301: The Mole

- **3D Lab Simulation:** Molar Mass Counting and Stoichiometric Weighing of Elemental Samples.
- **Primary Machine:** `balance_twin` (Mettler Toledo XPE205, 0.0001g)
- **Glassware & Accessories:** Weighing Boats, Micro-Spatulas, Pure Element Samples (1 mole of Cu, Al, Fe, S, C).

#### 2. NGSS-HS-PS1-7-T3L2-302: Reaction Balancer

- **3D Lab Simulation:** Conservation of Mass in Closed vs Open Precipitation Systems ($Ba(NO_3)_2 + Na_2SO_4$).
- **Primary Machine:** `balance_twin`
- **Glassware & Accessories:** 250 mL Erlenmeyer Flask with Neoprene Stopper, Internal Small Test Tube, Dropper,
  Solutions of Barium Nitrate and Sodium Sulfate.

#### 3. NGSS-HS-PS1-7-T3L3-303: Molarity & Dilution

- **3D Lab Simulation:** Standard Solution Preparation from Solid and Serial Volumetric Dilution.
- **Primary Machine:** `balance_twin` & `spectrophotometer_twin` (Genesys 50)
- **Glassware & Accessories:** 100 mL Class A Volumetric Flasks, Glass Powder Funnel, 10 mL Volumetric Pipettes, Pipette
  Pump, 10 mm Cuvettes, Copper(II) Sulfate Pentahydrate.

#### 4. NGSS-HS-PS1-7-T3L4-304: Solubility Rules

- **3D Lab Simulation:** 24-Well Microscale Double-Displacement Precipitation Matrix.
- **Primary Machine:** Automated Well-Plate Optical Scanner Twin
- **Glassware & Accessories:** 24-Well Clear Polystyrene Culture Plate, Dropping Pipettes, Cation/Anion Solutions
  ($Ag^+, Pb^{2+}, Ba^{2+}, Ca^{2+}, Cl^-, SO_4^{2-}, CO_3^{2-}, OH^-$).

#### 5. NGSS-HS-PS1-7-T3L5-305: Gas Laws Explorer

- **3D Lab Simulation:** Verification of Boyle's Law ($P propto 1/V$), Charles's Law ($V propto T$), and Gay-Lussac's
  Law ($P propto T$).
- **Primary Machine:** `gas_laws_piston_twin` & `hotplate_twin`
- **Glassware & Accessories:** Precision Bore Low-Friction Gas Syringe (100 mL), Absolute Pressure Transducer, Immersion
  Thermocouple, Thermostatted Water Bath.

#### 6. NGSS-HS-PS1-7-T3L6-306: Colligative Props

- **3D Lab Simulation:** Molar Mass Determination via Freezing Point Depression of Cyclohexane.
- **Primary Machine:** Cryoscopic Freezing Cell Twin & Precision Digital Temperature Logger ($pm 0.01 ^circ	ext{C}$)
- **Glassware & Accessories:** Insulated Cryogenic Dewar, Inner Freezing Tube with Wire Stirring Loop, Analytical
  Balance (`balance_twin`), Cyclohexane, Unknown Organic Solute.

#### 7. NGSS-HS-PS1-7-T3L7-307: Avogadro's Legacy

- **3D Lab Simulation:** Molar Volume of Hydrogen Gas at STP via Magnesium Reaction with Hydrochloric Acid.
- **Primary Machine:** Eudiometer Gas Station Twin
- **Glassware & Accessories:** 50 mL Glass Eudiometer Tube, One-Hole Rubber Stopper with Copper Wire Cage, Magnesium
  Ribbon, 6 M HCl, 1000 mL Cylindrical Water Leveling Jar.

#### 8. NGSS-HS-PS1-7-T3L8-308: Empirical Formula

- **3D Lab Simulation:** Synthesis of Magnesium Oxide in a Covered Crucible.
- **Primary Machine:** `balance_twin` & `muffle_furnace_twin` (or Bunsen Burner Station)
- **Glassware & Accessories:** Porcelain Crucible and Cover, Pipe-clay Triangle, Iron Ring Stand, Crucible Tongs, Emery
  Paper, Magnesium Ribbon.

#### 9. NGSS-HS-PS1-7-T3L9-309: Molecular Formula

- **3D Lab Simulation:** Dumas Vapor Density Method for Volatile Liquid Molar Mass.
- **Primary Machine:** `balance_twin` & `hotplate_twin`
- **Glassware & Accessories:** 250 mL Erlenmeyer Flask, Aluminum Foil Cap with Micro-Pin Hole, 600 mL Boiling Water
  Beaker, Barometer, Unknown Volatile Liquid.

#### 10. NGSS-HS-PS1-7-T3L10-310: Hydrates

- **3D Lab Simulation:** Thermal Dehydration and Formula Determination of Copper(II) Sulfate Hydrate.
- **Primary Machine:** `balance_twin` & `muffle_furnace_twin`
- **Glassware & Accessories:** Porcelain Evaporating Dish, Spatula, Crucible Tongs, Desiccator with Silica Gel, Blue
  Vitriol Salt.

#### 11. NGSS-HS-PS1-7-T3L11-311: Limiting Reactants

- **3D Lab Simulation:** Stoichiometric Carbon Dioxide Production from Sodium Bicarbonate and Acetic Acid.
- **Primary Machine:** `balance_twin` (Continuous Gas Evolution Loss)
- **Glassware & Accessories:** 125 mL Erlenmeyer Flasks, Precision Balloons, Funnels, Graduated Cylinder, $NaHCO_3$, 1.0
  M $CH_3COOH$.

#### 12. NGSS-HS-PS1-7-T3L12-312: Percent Yield

- **3D Lab Simulation:** Synthesis, Isolation, and Yield Calculation of Aspirin (Acetylsalicylic Acid).
- **Primary Machine:** `hotplate_twin`, `vacuum_pump_twin`, `balance_twin`
- **Glassware & Accessories:** 125 mL Erlenmeyer Flask, Büchner Funnel, Filter Flask, Neoprene Gasket, Whatman No. 1
  Filter Paper, Salicylic Acid, Acetic Anhydride, $H_3PO_4$ catalyst.

#### 13. NGSS-HS-PS1-7-T3L13-313: Mass Percent

- **3D Lab Simulation:** Gravimetric Determination of Calcium Carbonate in Eggshells.
- **Primary Machine:** `balance_twin` & Gravity Filtration Setup
- **Glassware & Accessories:** Porcelain Mortar and Pestle, 250 mL Beakers, 1 M HCl, 1 M $Na_2CO_3$, Ashless Filter
  Paper, Funnel, Drying Oven.

#### 14. NGSS-HS-PS1-7-T3L14-314: Mole Fraction

- **3D Lab Simulation:** Raoult's Law Partial Pressure of Ideal Binary Solvent Mixtures (Acetone / Ethanol).
- **Primary Machine:** `vacuum_pump_twin` & Isoteniscope Manometer
- **Glassware & Accessories:** Glass Manometer with Mercury/Oil, Constant Temp Bath, Pipettes, Anhydrous Solvents.

#### 15. NGSS-HS-PS1-7-T3L15-315: PPM & PPB

- **3D Lab Simulation:** Trace Iron Determination in Tap Water via 1,10-Phenanthroline Colorimetry.
- **Primary Machine:** `spectrophotometer_twin` (Genesys 50)
- **Glassware & Accessories:** 100 mL Volumetric Flasks, P1000 Micropipette, Cuvettes, Hydroxylamine Reductant, Sodium
  Acetate Buffer, Iron Standard (100 ppm).

#### 16. NGSS-HS-PS1-7-T3L16-316: Dalton's Law

- **3D Lab Simulation:** Vapor Pressure Correction of Hydrogen Gas Collected over Water.
- **Primary Machine:** Eudiometer Apparatus Twin & `balance_twin`
- **Glassware & Accessories:** 50 mL Eudiometer, Pneumatic Trough, Precision Barometer, Thermometer, Zinc Pellets, 3 M
  HCl.

#### 17. NGSS-HS-PS1-7-T3L17-317: Effusion & Diffusion

- **3D Lab Simulation:** Graham's Law Counter-Diffusion of Gaseous Ammonia ($NH_3$) and Hydrogen Chloride ($HCl$).
- **Primary Machine:** Sealed Optical Diffusion Tube Rig Twin
- **Glassware & Accessories:** 100 cm Clear Pyrex Glass Tube (20 mm ID), Two Rubber Stoppers, Cotton Wool Swabs,
  Concentrated $NH_4OH$, Concentrated HCl, Metric Calipers.

#### 18. NGSS-HS-PS1-7-T3L18-318: Real vs Ideal

- **3D Lab Simulation:** van der Waals Real Gas Compression and Compressibility Factor $Z$.
- **Primary Machine:** `high_pressure_reactor_twin` & Pressure Transducer
- **Glassware & Accessories:** Piston Cylinder, Piezoelectric Pressure Sensor, Nitrogen and Helium Cylinders.

#### 19. NGSS-HS-PS1-7-T3L19-319: Precision Glassware

- **3D Lab Simulation:** Volumetric Calibration Comparison (Burette vs Volumetric Flask vs Graduated Cylinder).
- **Primary Machine:** `balance_twin` (0.0001g)
- **Glassware & Accessories:** 50 mL Class A Burette, 100 mL Class A Volumetric Flask, 50 mL Cylinder, 100 mL Beaker,
  Distilled Degassed Water, Thermometer.

#### 20. NGSS-HS-PS1-7-T3L20-320: Significant Figures

- **3D Lab Simulation:** Experimental Uncertainty Propagation in Density Determination.
- **Primary Machine:** `balance_twin` & Digital Vernier Caliper
- **Glassware & Accessories:** Precision Machined Metal Cylinders (Brass, Stainless Steel, Aluminum), Micrometer Screw
  Gauge.

#### 21. NGSS-HS-PS1-7-T3L21-321: The Grid Method

- **3D Lab Simulation:** Interactive Dimensional Analysis Stoichiometric Bridge.
- **Primary Machine:** Stoichiometric Balance Engine Twin
- **Glassware & Accessories:** Interactive Conversion Tile Array, Multi-Scale Mass Display.

#### 22. MATE-LAB-REACTION-TYPES: Reaction Types Lab

- **3D Lab Simulation:** Direct Experimental Observation of 5 Core Reaction Archetypes (Synthesis, Decomposition, Single
  Replacement, Double Replacement, Combustion).
- **Primary Machine:** Fume Hood Workstation & `hotplate_twin`
- **Glassware & Accessories:** Test Tube Rack with 10 Tubes, Crucible Tongs, Wooden Splints,
  $CuSO_4, Fe, Zn, HCl, H_2O_2, MnO_2, CH_4$.

#### 23. EXAM-TIER3-T3L22-000: Tier 3 Mastery Exam

- **3D Lab Simulation:** Comprehensive Quantitative Gravimetric and Volumetric Unknown Determination.
- **Primary Machines:** `balance_twin`, `muffle_furnace_twin`, `spectrophotometer_twin`
- **Glassware & Accessories:** Crucibles, Desiccator, Volumetric Flasks, Unknown Hydrated Salt Specimen.

---

### Tier 4: Energetics & Equilibrium (31 Modules)

#### 1. NGSS-HS-PS1-4-T4L1-401: Thermochem Lab

- **3D Lab Simulation:** Enthalpy of Solution ($Delta H_{soln}$) for Endothermic vs Exothermic Salts.
- **Primary Machine:** `calorimeter_twin` (Coffee-Cup Polystyrene Setup) & `balance_twin`
- **Glassware & Accessories:** Dual Nested Polystyrene Cups with Lid, Magnetic Stirrer (`hotplate_twin`), Precision
  Thermistor Probe ($pm 0.02 ^circ	ext{C}$), $NH_4NO_3, CaCl_2$.

#### 2. NGSS-HS-PS1-4-T4L2-402: Calorimetry

- **3D Lab Simulation:** Enthalpy of Neutralization of Strong Acid with Strong Base ($HCl + NaOH$).
- **Primary Machine:** `calorimeter_twin` (Dewar Vacuum Vessel) & `balance_twin`
- **Glassware & Accessories:** Glass Dewar Chamber with Stirrer Port, 100 mL Graduated Cylinders, 1.0 M HCl, 1.0 M NaOH,
  Digital Temp Logger.

#### 3. NGSS-HS-PS1-4-T4L3-403: Introduction to Chemical Spontaneity

- **3D Lab Simulation:** Spontaneous Endothermic Solid-Solid Reaction ($Ba(OH)_2 cdot 8H_2O + 2NH_4SCN$).
- **Primary Machine:** Digital Freezing Block Station & `balance_twin`
- **Glassware & Accessories:** 100 mL Beaker, Wet Wooden Block (freezes solid to beaker base), Glass Stirring Rod, Fume
  Hood.

#### 4. NGSS-HS-PS1-6-T4L4-404: Equilibrium Intro

- **3D Lab Simulation:** Reversible Color Transition of Cobalt Complex Equilibria
  ($[Co(H_2O)_6]^{2+} 
ightleftharpoons [CoCl_4]^{2-}$).
- **Primary Machine:** `spectrophotometer_twin` & `hotplate_twin`
- **Glassware & Accessories:** 10 mm Spectrophotometer Cuvettes, Boiling Water Bath, Ice Bath, $CoCl_2$, Concentrated
  HCl.

#### 5. NGSS-HS-PS1-6-T4L5-405: Le Chatelier's Principle

- **3D Lab Simulation:** Pressure and Temperature Stress on Dinitrogen Tetroxide ($2NO_2 
ightleftharpoons N_2O_4$) and
  Aqueous Chromate/Dichromate.
- **Primary Machine:** Sealed Gas Syringe Apparatus Twin & `spectrophotometer_twin`
- **Glassware & Accessories:** Gas Syringes with Luer-Lock Valves, Hot & Cold Water Baths, Test Tubes,
  $K_2CrO_4, 1	ext{ M } HCl, 1	ext{ M } NaOH$.

#### 6. NGSS-HS-PS1-6-T4L6-406: Acids & Bases

- **3D Lab Simulation:** Ionization and pH of Strong vs Weak Acids at Equal Concentrations.
- **Primary Machine:** `ph_meter_twin` (Oakton pH 700 with Glass Combination Electrode)
- **Glassware & Accessories:** 50 mL Beakers, Standard Buffer Calibration Vials (pH 4.00, 7.00, 10.00), 0.1 M HCl, 0.1 M
  $CH_3COOH$, 0.1 M NaOH, 0.1 M $NH_3$.

#### 7. NGSS-HS-PS1-6-T4L7-407: Titration Curve

- **3D Lab Simulation:** Potentiometric Strong Acid - Strong Base Titration Curve.
- **Primary Machine:** `auto_titrator_twin` (or Precision Burette Stand) & `ph_meter_twin`
- **Glassware & Accessories:** 50 mL Class A Glass Burette, Retort Stand with Burette Clamp, 150 mL Beaker, Magnetic
  Stir Bar, Standardized 0.100 M NaOH, 0.100 M HCl, Phenolphthalein.

#### 8. NGSS-HS-PS1-6-T4L8-408: Buffer Systems

- **3D Lab Simulation:** Acetate and Phosphate Buffer Preparation and Chemical Shock Resistance.
- **Primary Machine:** `ph_meter_twin` & `hotplate_twin` (Magnetic Stirrer)
- **Glassware & Accessories:** 250 mL Beakers, 50 mL Volumetric Flasks, P1000 Micropipette, Sodium Acetate, Acetic Acid,
  1.0 M HCl, 1.0 M NaOH.

#### 9. NGSS-HS-PS1-6-T4L9-409: Ksp & Solubility

- **3D Lab Simulation:** Determination of $K_{sp}$ of Calcium Hydroxide ($Ca(OH)_2$) via Acid-Base Titration.
- **Primary Machine:** Burette Stand Twin & `vacuum_pump_twin` (Vacuum Filtration)
- **Glassware & Accessories:** Saturated $Ca(OH)_2$ Solution, Büchner Funnel, Filter Flask, 50 mL Burette, Standardized
  0.050 M HCl, Bromothymol Blue.

#### 10. NGSS-HS-PS1-4-T4L10-410: Energy Profiles

- **3D Lab Simulation:** Activation Energy Lowering via Heterogeneous Catalysts ($MnO_2$, Pt) in $H_2O_2$ Decomposition.
- **Primary Machine:** Gas Pressure Reaction Vessel Twin & `spectrophotometer_twin`
- **Glassware & Accessories:** 100 mL Reaction Flask with Pressure Port, Digital Pressure Sensor, Syringe, 3% $H_2O_2$,
  Solid $MnO_2$, Catalase.

#### 11. NGSS-HS-PS1-5-T4L11-411: Rate Laws

- **3D Lab Simulation:** Iodine Clock Reaction: Method of Initial Rates for Reaction Order Determination.
- **Primary Machine:** `spectrophotometer_twin` (Colorimeter Mode) & `hotplate_twin`
- **Glassware & Accessories:** 50 mL Beakers, P1000 Micropipettes, Digital Stopwatch, $K_2S_2O_8, KI, Na_2S_2O_3$,
  Starch Indicator Solution.

#### 12. NGSS-HS-PS1-6-T4L12-412: Equilibrium Lab

- **3D Lab Simulation:** Spectrophotometric Equilibrium Constant ($K_{eq}$) for Iron(III) Thiocyanate Complex
  ($[Fe(SCN)]^{2+}$).
- **Primary Machine:** `spectrophotometer_twin` (Genesys 50)
- **Glassware & Accessories:** Set of 6 Volumetric Flasks (50 mL), 10 mm Cuvettes, Pipettes,
  $0.200	ext{ M } Fe(NO_3)_3, 0.0020	ext{ M } KSCN$.

#### 13. NGSS-HS-PS1-6-T4L13-413: pH Scale Lab

- **3D Lab Simulation:** 10-Fold Serial Dilution and pH Limits of Weak vs Strong Electrolytes.
- **Primary Machine:** `ph_meter_twin` & `vortex_mixer_twin`
- **Glassware & Accessories:** 7 Volumetric Flasks (100 mL), 10 mL Volumetric Pipette, Deionized Water, 0.1 M HCl, 0.1 M
  NaOH.

#### 14. NGSS-HS-PS1-6-T4L14-414: Titration Sim

- **3D Lab Simulation:** Polyprotic Acid Titration Curve ($H_3PO_4$ First and Second Equivalence Points).
- **Primary Machine:** `auto_titrator_twin` with Drop Counter & `ph_meter_twin`
- **Glassware & Accessories:** Automatic Micro-Burette, Drop Sensor Ring, 250 mL Beaker, Stir Bar, 0.100 M $H_3PO_4$,
  0.100 M NaOH.

#### 15. NGSS-HS-PS1-2-T4L15-415: Oxidation States

- **3D Lab Simulation:** Vanadium Oxidation State Rainbow ($V^{5+} 
ightarrow V^{4+} 
ightarrow V^{3+} 
ightarrow V^{2+}$
  Reduction by Zinc).
- **Primary Machine:** `hotplate_twin` (Magnetic Stirrer) & Fume Hood
- **Glassware & Accessories:** 250 mL Erlenmeyer Flasks, Zinc Granules, Concentrated $H_2SO_4$, Ammonium Metavanadate
  ($NH_4VO_3$).

#### 16. NGSS-HS-PS1-2-T4L16-416: Electrochemistry

- **3D Lab Simulation:** Daniell Voltaic Cell Potential ($Zn|Zn^{2+} parallel Cu^{2+}|Cu$) and Nernst Equation
  Concentration Dependence.
- **Primary Machine:** `potentiostat_twin` (High-Impedance Digital Multimeter Mode)
- **Glassware & Accessories:** Dual 100 mL Glass Half-Cells, U-Tube Agar-KNO₃ Salt Bridge, Polished $Zn$ and $Cu$
  Electrode Strips, 1.0 M and Diluted Nitrate Solutions.

#### 17. NGSS-HS-PS1-4-T4L17-417: Specific Heat

- **3D Lab Simulation:** Specific Heat Capacity of Metals via Water Calorimetry.
- **Primary Machine:** `calorimeter_twin` & `hotplate_twin`
- **Glassware & Accessories:** 600 mL Boiling Water Beaker, Test Tube with Wire Hanger, Precision Thermometer, Tongs,
  Metal Cylinders (Al, Cu, Fe, Pb, Sn), `balance_twin`.

#### 18. NGSS-HS-PS3-4-T4L18-418: Heat of Fusion

- **3D Lab Simulation:** Latent Heat of Fusion ($Delta H_{fus}$) of Ice via Calorimetric Water Melting.
- **Primary Machine:** `calorimeter_twin` & `balance_twin`
- **Glassware & Accessories:** Insulated Styrofoam Calorimeter, Filter Paper Blotting Sheets, Crushed Ice, Warm Water,
  Digital Thermometer.

#### 19. NGSS-HS-PS1-4-T4L19-419: Hess's Law

- **3D Lab Simulation:** Verification of Additivity of Heats of Reaction ($NaOH_{(s)} + HCl_{(aq)}$ vs Component Steps).
- **Primary Machine:** `calorimeter_twin` & `balance_twin`
- **Glassware & Accessories:** Calorimeter Cup, Solid NaOH Pellets, 1.0 M HCl, 1.0 M NaOH, Deionized Water, Magnetic
  Stir Bar.

#### 20. NGSS-HS-PS1-4-T4L20-420: Standard Formation

- **3D Lab Simulation:** Oxygen Bomb Calorimetry of Benzoic Acid for Enthalpy of Combustion ($Delta H^circ_{comb}$).
- **Primary Machine:** `calorimeter_twin` (Parr Oxygen Bomb Module)
- **Glassware & Accessories:** Stainless Steel Bomb Vessel, Nickel-Chromium Fuse Wire, Pellet Press, Pure Oxygen Tank
  (30 bar), Water Jacket, Beckmann Precision Thermometer.

#### 21. NGSS-HS-PS1-4-T4L21-421: Entropy (S)

- **3D Lab Simulation:** Temperature-Dependent Solubility of $KNO_3$ and Thermodynamic Entropy Calculation.
- **Primary Machine:** `hotplate_twin` (Controlled Cooling) & `balance_twin`
- **Glassware & Accessories:** 50 mL Boiling Tube, Precision Thermometer, Wire Stirring Loop, Graduated Pipette, $KNO_3$
  Crystals.

#### 22. NGSS-HS-PS1-4-T4L22-422: Gibbs Free Energy Spontaneity

- **3D Lab Simulation:** Determination of $Delta G^circ, Delta H^circ, Delta S^circ$ from Temperature-Dependent
  Electrochemical Cell EMF ($partial E/partial T$).
- **Primary Machine:** Jacketed Electrochemical Cell & `potentiostat_twin`
- **Glassware & Accessories:** Constant Temp Circulating Bath, High-Precision Digital Voltmeter, Ag/AgCl Reference
  Electrode, Zinc Electrode, Jacketed Cell.

#### 23. NGSS-HS-PS1-5-T4L23-423: Collision Theory

- **3D Lab Simulation:** Influence of Particle Size, Concentration, and Temperature on Reaction Kinetics
  ($CaCO_3 + HCl$).
- **Primary Machine:** `balance_twin` (Continuous Mass-Loss Logger)
- **Glassware & Accessories:** 250 mL Erlenmeyer Flask, Cotton Plug, Large vs Powdered Marble Chips, 1.0 M and 2.0 M
  HCl, Stopwatch.

#### 24. NGSS-HS-PS1-5-T4L24-424: Reaction Order

- **3D Lab Simulation:** Pseudo-First-Order Decolorization of Crystal Violet by Sodium Hydroxide.
- **Primary Machine:** `spectrophotometer_twin` (Genesys 50)
- **Glassware & Accessories:** 10 mm Plastic Cuvettes, Micropipette, Crystal Violet Solution ($1 	imes 10^{-5}	ext{ M}$),
  0.1 M NaOH, Stirring Spatula.

#### 25. NGSS-HS-PS1-5-T4L25-425: Arrhenius Equation

- **3D Lab Simulation:** Temperature Dependence of Thiosulfate-Acid Reaction and Activation Energy ($E_a$) Calculation.
- **Primary Machine:** `spectrophotometer_twin` (with Peltier Temperature Stage)
- **Glassware & Accessories:** Jacketed Cuvette Holder, Circulating Water Bath, $Na_2S_2O_3$, 1 M HCl, Stopwatch.

#### 26. NGSS-HS-PS1-6-T4L26-426: Thermal Variations in Equilibrium

- **3D Lab Simulation:** Van 't Hoff Isochore Determination of Reaction Enthalpy from Spectroscopic Equilibrium Shifts.
- **Primary Machine:** Jacketed Spectrophotometer Chamber & `spectrophotometer_twin`
- **Glassware & Accessories:** Sealed Optical Cell, Variable Water Circulator, Photodiode Detector, Aqueous Complex
  Solution.

#### 27. NGSS-HS-PS1-6-T4L27-427: Common Ion Effect

- **3D Lab Simulation:** Suppression of Weak Acid Dissociation and Insoluble Salt Precipitation by Common Ions.
- **Primary Machine:** `ph_meter_twin` & Conductivity Meter
- **Glassware & Accessories:** 100 mL Beakers, Combination pH Electrode, Dip Cell, $CH_3COOH, CH_3COONa, AgNO_3, NaCl$.

#### 28. NGSS-HS-PS1-6-T4L28-428: Solubility Product Evaluation

- **3D Lab Simulation:** Microscale Spectrophotometric Evaluation of Silver Chromate ($Ag_2CrO_4$) $K_{sp}$.
- **Primary Machine:** `centrifuge_twin` (Sorvall Legend X1) & `spectrophotometer_twin`
- **Glassware & Accessories:** 15 mL Conical Centrifuge Tubes, Pasteur Pipettes, Cuvettes,
  $0.005	ext{ M } AgNO_3, 0.005	ext{ M } K_2CrO_4$.

#### 29. NGSS-HS-PS1-6-T4L29-429: Buffer Capacity

- **3D Lab Simulation:** Differential Buffer Capacity against Strong Acid/Base Titration Titrant Stress.
- **Primary Machine:** `auto_titrator_twin` & `ph_meter_twin`
- **Glassware & Accessories:** 50 mL Glass Burettes, 150 mL Beakers, Acetate Buffer, Phosphate Buffer, 0.50 M HCl, 0.50
  M NaOH.

#### 30. NGSS-HS-PS1-6-T4L30-430: The Henderson-Hasselbalch Equation

- **3D Lab Simulation:** Target pH Buffer Formulation and Experimental Ionic Strength Correction.
- **Primary Machine:** `balance_twin` & `ph_meter_twin`
- **Glassware & Accessories:** 250 mL Volumetric Flasks, $NaH_2PO_4, Na_2HPO_4$, Magnetic Stirrer (`hotplate_twin`),
  Pipettes.

#### 31. EXAM-TIER4-T4L31-000: Tier 4 Mastery Exam

- **3D Lab Simulation:** Comprehensive Energetics Practicum: Unknown Acid Identification via Potentiometric Titration &
  Enthalpy of Neutralization.
- **Primary Machines:** `auto_titrator_twin`, `calorimeter_twin`, `ph_meter_twin`, `balance_twin`
- **Glassware & Accessories:** Titration Station, Calorimeter Dewar, Standardized Titrants, Unknown Acid Samples.

---

### Tier 5: Organic & Biochemistry (26 Modules)

#### 1. NGSS-HS-PS1-1-T5L1-501: Nomenclature

- **3D Lab Simulation:** IUPAC Organic Molecule Construction and Functional Group Identification.
- **Primary Machine:** 3D Organic Molecular Construction Console Twin
- **Glassware & Accessories:** Carbon Sp3/Sp2/Sp Frameworks, Heteroatom Terminals, Functional Group Indicators.

#### 2. NGSS-HS-PS1-2-T5L2-502: Isomer Hierarchy

- **3D Lab Simulation:** Optical Activity and Specific Rotation $[alpha]_D$ of Chiral Enantiomers.
- **Primary Machine:** `polarimeter_twin` (Automatic Digital Polarimeter)
- **Glassware & Accessories:** 100 mm Optical Quartz Polarimeter Tube, Sodium D-Line Lamp (589 nm), D- and L-Tartaric
  Acid Solutions.

#### 3. NGSS-HS-PS1-1-T5L3-503: Carbon Skeletons

- **3D Lab Simulation:** Fractional Distillation of Hydrocarbon Mixtures (Petroleum Fractions).
- **Primary Machine:** Fractional Distillation Column Twin & Heating Mantle (`hotplate_twin`)
- **Glassware & Accessories:** 250 mL Round Bottom Flask, Vigreux Column, Liebig Condenser, Thermometer Adapter,
  Receiving Flask Turret.

#### 4. NGSS-HS-PS1-3-T5L4-504: Functional Groups

- **3D Lab Simulation:** Qualitative Chemical Identification Tests (Baeyer, Tollens, 2,4-DNP, Iron(III) Chloride).
- **Primary Machine:** Fume Hood Bench Twin & `hotplate_twin` (Water Bath)
- **Glassware & Accessories:** Test Tube Rack with 12 Tubes, Dropper Bottles with Reagents
  ($KMnO_4, AgNO_3/NH_3, 2,4-DNP, FeCl_3$), Unknown Organic Vials.

#### 5. NGSS-HS-PS1-3-T5L5-505: Alkanes & Alkenes

- **3D Lab Simulation:** Bromine Water Unsaturation Test and Free-Radical Halogenation.
- **Primary Machine:** Fume Hood Workstation & UV Irradiation Box
- **Glassware & Accessories:** Septum Vials, Bromine in Dichloromethane, Cyclohexane, Cyclohexene, UV Lamp (365 nm).

#### 6. NGSS-HS-PS1-2-T5L6-506: Chirality Lab

- **3D Lab Simulation:** Enantiomeric Purity Determination of Carvone from Spearmint vs Caraway Oil.
- **Primary Machine:** `polarimeter_twin` & `balance_twin`
- **Glassware & Accessories:** 100 mm Precision Polarimeter Sample Cells, Volumetric Flasks, (R)-(-)-Carvone,
  (S)-(+)-Carvone.

#### 7. NGSS-HS-PS1-3-T5L7-507: Polymers

- **3D Lab Simulation:** Interfacial Polymerization of Nylon 6,6 (The Nylon Rope Trick).
- **Primary Machine:** Fume Hood Workstation
- **Glassware & Accessories:** 100 mL Beakers, Forceps, Glass Stirring Rod, Adipoyl Chloride in Hexane,
  Hexamethylenediamine in Aqueous NaOH.

#### 8. NGSS-HS-LS1-1-T5L8-508: Amino Acid Alpha

- **3D Lab Simulation:** Thin-Layer Chromatography (TLC) Separation and Ninhydrin Visualization of Amino Acids.
- **Primary Machine:** TLC Developing Tank Twin & Hotplate Drying Station (`hotplate_twin`)
- **Glassware & Accessories:** Silica Gel 60 $F_{254}$ TLC Plates, Micro-Capillary Pipettes, Ninhydrin Spray Bottle,
  Standard Amino Acid Solutions.

#### 9. NGSS-HS-LS1-1-T5L9-509: Protein Folding

- **3D Lab Simulation:** Denaturation and Refolding of Bovine Serum Albumin / Lysozyme via Turbidimetry and UV-Vis.
- **Primary Machine:** `spectrophotometer_twin` & `centrifuge_twin`
- **Glassware & Accessories:** Quartz Cuvettes, Microcentrifuge Tubes, Micropipette, Urea, Guanidine Hydrochloride,
  Protein Samples.

#### 10. NGSS-HS-LS1-1-T5L10-510: Enzyme Kinetics

- **3D Lab Simulation:** Michaelis-Menten Kinetics ($V_{max}, K_m$) of Alkaline Phosphatase with $p$-Nitrophenyl
  Phosphate.
- **Primary Machine:** `spectrophotometer_twin` (Genesys 50 UV-Vis)
- **Glassware & Accessories:** 10 mm Polystyrene Cuvettes, P200 Micropipette, Vortex Mixer (`vortex_mixer_twin`),
  $p$-NPP Substrate, 1 M NaOH Stop Solution.

#### 11. NGSS-HS-LS1-1-T5L11-511: Genetic Chemistry

- **3D Lab Simulation:** Isolation and Spectroscopic Quantification of Plasmid DNA ($A_{260}/A_{280}$ Purity Ratio).
- **Primary Machine:** `centrifuge_twin` (Sorvall Legend X1) & `spectrophotometer_twin`
- **Glassware & Accessories:** 1.5 mL Microcentrifuge Tubes, Micro-Pestle, Lysis Buffer, Spin Columns, Ethanol Wash
  Vials, Nano-Volume Cuvettes.

#### 12. NGSS-HS-LS1-1-T5L12-512: Lipid Structures

- **3D Lab Simulation:** Alkaline Saponification of Triglycerides (Soap Making) and Emulsion Testing.
- **Primary Machine:** `hotplate_twin` (Magnetic Stirrer)
- **Glassware & Accessories:** 250 mL Round Bottom Flask, Graham Reflux Condenser, Olive Oil, Ethanol, Concentrated
  NaOH, Brine ($NaCl$).

#### 13. NGSS-HS-LS1-7-T5L13-513: Metabolic Paths

- **3D Lab Simulation:** Anaerobic Yeast Fermentation Kinetics and Gas Chromatographic Analysis of Bio-Ethanol.
- **Primary Machine:** `gc_ms_twin` (or Benchtop GC) & Chemostat Flask
- **Glassware & Accessories:** 500 mL Side-Arm Reaction Flask, Durham Tubes, Yeast Suspension, Glucose Solution, GC
  Injection Syringe.

#### 14. NGSS-HS-LS1-7-T5L14-514: ATP Energetics

- **3D Lab Simulation:** Firefly Luciferase Bioluminescence Luminescence Assay for Cellular ATP Quantification.
- **Primary Machine:** Benchtop Luminometer Twin
- **Glassware & Accessories:** 96-Well Black Microplates, Luciferase Reagent, D-Luciferin, ATP Standard Dilution Series,
  Micropipettes.

#### 15. NGSS-HS-LS1-5-T5L15-515: Photosynthesis

- **3D Lab Simulation:** Hill Reaction: Photochemical Reduction of DCPIP Dye by Isolated Chloroplasts.
- **Primary Machine:** `centrifuge_twin` & `spectrophotometer_twin`
- **Glassware & Accessories:** Chilled Mortar and Pestle, Cheesecloth Funnel, Cold Sucrose-Phosphate Buffer, DCPIP
  Solution, High-Intensity LED Lamp.

#### 16. NGSS-HS-LS1-1-T5L16-516: Steroids & Hormones

- **3D Lab Simulation:** Solid-Phase Extraction (SPE) and Rotary Evaporation of Cholesterol from Biological Media.
- **Primary Machine:** `rotovap_twin` (Heidolph Hei-VAP) & `vacuum_pump_twin`
- **Glassware & Accessories:** 250 mL Round Bottom Evaporation Flask, C18 SPE Cartridges, Vacuum Manifold, Methanol,
  Pure Cholesterol Standard.

#### 17. NGSS-HS-PS1-2-T5L17-517: Reaction Mechanisms

- **3D Lab Simulation:** Kinetics of Nucleophilic Substitution: $S_N1$ (Hydrolysis of $t$-Butyl Chloride) vs $S_N2$
  (Bromobutane with Iodide).
- **Primary Machine:** `ph_meter_twin` (Kinetic Monitoring) & `hotplate_twin`
- **Glassware & Accessories:** 100 mL Reaction Flasks, Burette, Silver Nitrate in Ethanol, Sodium Iodide in Acetone,
  Stopwatches.

#### 18. NGSS-HS-LS1-1-T5L18-518: Drug Design

- **3D Lab Simulation:** Structure-Activity Relationship (SAR) Synthesis and Isolation of Acetaminophen (Paracetamol).
- **Primary Machine:** `hotplate_twin`, `vacuum_pump_twin`, `balance_twin`
- **Glassware & Accessories:** 50 mL Erlenmeyer Flask, Büchner Funnel, $p$-Aminophenol, Acetic Anhydride, Ice-Water
  Bath, Crystallizing Dish.

#### 19. NGSS-HS-PS1-5-T5L19-519: Alkanes (Radical Pathways)

- **3D Lab Simulation:** Selectivity of Free-Radical Bromination in Primary, Secondary, and Tertiary Hydrocarbons.
- **Primary Machine:** Photochemical Workstation & Fume Hood
- **Glassware & Accessories:** Quartz Reaction Tubes, 500 W Halogen Photoreactor Lamp, Bromine Solution, Cyclohexane,
  Toluene, Ethylbenzene.

#### 20. NGSS-HS-PS1-5-T5L20-520: Alkenes (Electrophilic Addition)

- **3D Lab Simulation:** Markovnikov Addition: Hydration of 1-Hexene to 2-Hexanol via Oxymercuration.
- **Primary Machine:** `hotplate_twin` (Magnetic Stirrer) & Separatory Funnel Stand
- **Glassware & Accessories:** 125 mL Glass Separatory Funnel with PTFE Stopcock, 100 mL Round Bottom Flask, Ice Bath,
  Mercuric Acetate, $NaBH_4$.

#### 21. NGSS-HS-PS1-2-T5L21-521: Aromaticity

- **3D Lab Simulation:** Electrophilic Aromatic Substitution: Nitration of Methyl Benzoate to Methyl 3-Nitrobenzoate.
- **Primary Machine:** Fume Hood Workstation & `vacuum_pump_twin`
- **Glassware & Accessories:** 50 mL Erlenmeyer Flask, Pressure-Equalizing Dropping Funnel, Ice-Salt Cryo Bath,
  Concentrated $HNO_3/H_2SO_4$, Büchner Funnel.

#### 22. NGSS-HS-PS1-3-T5L22-522: Alcohols & Carbonyl Conversions

- **3D Lab Simulation:** Green Oxidation of Cyclohexanol to Cyclohexanone with Aqueous Sodium Hypochlorite.
- **Primary Machine:** `rotovap_twin` & Separatory Funnel Stand
- **Glassware & Accessories:** 250 mL Round Bottom Flask, Addition Funnel, Household Bleach ($NaOCl$), Glacial Acetic
  Acid, Potassium Iodide Starch Paper.

#### 23. NGSS-HS-PS1-3-T5L23-523: Carbonyls

- **3D Lab Simulation:** Crossed Aldol Condensation: Synthesis and Recrystallization of Dibenzalacetone.
- **Primary Machine:** `hotplate_twin`, `vacuum_pump_twin`, `mel_temp_twin`
- **Glassware & Accessories:** 100 mL Beakers, Büchner Funnel, Benzaldehyde, Acetone, 10% NaOH Solution, Ethanol,
  Capillary Tubes.

#### 24. NGSS-HS-PS1-3-T5L24-524: Carboxylic Acid Derivatives

- **3D Lab Simulation:** Fischer Esterification: Synthesis of Isopentyl Acetate (Banana Oil).
- **Primary Machine:** Reflux Condenser Rig Twin & `hotplate_twin`
- **Glassware & Accessories:** 100 mL Round Bottom Flask, Graham Reflux Condenser, Boiling Chips, Isopentyl Alcohol,
  Glacial Acetic Acid, Concentrated $H_2SO_4$, Separatory Funnel.

#### 25. NGSS-HS-PS1-3-T5L25-525: Nitrogenous Organic Bases

- **3D Lab Simulation:** Liquid-Liquid Extraction and Acid-Base Partitioning of Caffeine from Tea Leaves.
- **Primary Machine:** `rotovap_twin` (Heidolph Hei-VAP) & `balance_twin`
- **Glassware & Accessories:** 250 mL Separatory Funnel, Evaporating Flask, Dichloromethane (DCM), Sodium Carbonate,
  Anhydrous Sodium Sulfate ($Na_2SO_4$).

#### 26. EXAM-TIER5-T5L26-000: Tier 5 Mastery Exam

- **3D Lab Simulation:** Comprehensive Organic Practicum: Multi-Step Unknown Synthesis, Separation, and Melting Point /
  Optical Purity Certification.
- **Primary Machines:** `rotovap_twin`, `mel_temp_twin`, `polarimeter_twin`, `balance_twin`
- **Glassware & Accessories:** TLC Plates, Capillary Tubes, Reagent Spotting Vials, Organic Solvents.

---

### Tier 6: Research Frontier (25 Modules)

#### 1. NGSS-HS-PS1-5-T6L1-601: Kinetic Isotope

- **3D Lab Simulation:** Primary Deuterium Kinetic Isotope Effect ($k_H/k_D$) in the Oxidation of Ethanol ($CH_3CH_2OH$
  vs $CH_3CD_2OH$).
- **Primary Machine:** `spectrophotometer_twin` (High-Speed Time-Course Kinetic Logging)
- **Glassware & Accessories:** Deuterated vs Normal Reagents, Acidic Dichromate Oxidant, 10 mm Quartz Cuvettes.

#### 2. NGSS-HS-PS1-4-T6L2-602: Transition State Theory

- **3D Lab Simulation:** Eyring Equation Temperature-Dependent Kinetics: Extracting $Delta H^ddagger$ and
  $Delta S^ddagger$.
- **Primary Machine:** `polarimeter_twin` with Thermostatted Sample Well
- **Glassware & Accessories:** Jacketed Optical Polarimeter Cell, Constant Temperature Circulator, Optically Active
  Substrate.

#### 3. NGSS-HS-PS1-5-T6L3-603: Heterogeneous Catalysis

- **3D Lab Simulation:** Gas-Phase Heterogeneous Catalytic Hydrogenation of Cyclohexene over Pd/C.
- **Primary Machine:** `high_pressure_reactor_twin` (Parr 4560 Mini Reactor)
- **Glassware & Accessories:** Stainless Steel Reactor Bomb, Magnetic Drive Impeller, High-Pressure $H_2$ Gas Line, 10%
  Pd/C Catalyst, Substrate Syringe.

#### 4. NGSS-HS-PS1-3-T6L4-604: Quantum Dot Nanostructures

- **3D Lab Simulation:** Colloidal Hot-Injection Synthesis of CdSe Quantum Dots and Emission Wavelength Tuning.
- **Primary Machine:** `glove_box_twin` (Inert I-Box) & `hotplate_twin` (with Schlenk Line)
- **Glassware & Accessories:** 3-Neck 100 mL Round Bottom Flask, Reflux Condenser, Septa, Hamilton Gas-Tight Syringes,
  Octadecene, Trioctylphosphine (TOP), Cd Precursor, UV Lamp.

#### 5. NGSS-HS-PS1-3-T6L5-605: Superconductivity

- **3D Lab Simulation:** Solid-State Calcination and Meissner Magnetic Levitation of YBCO ($YBa_2Cu_3O_{7-x}$).
- **Primary Machine:** `muffle_furnace_twin` (Carbolite CWF 1100, 1050 °C) & Pellet Die Press
- **Glassware & Accessories:** 10-Ton Hydraulic Die Press, High-Purity Alumina Combustion Boat, $Y_2O_3, BaCO_3, CuO$,
  Liquid Nitrogen Cryo-Bath, Neodymium Rare-Earth Magnet.

#### 6. NGSS-HS-PS1-1-T6L6-606: Quantum Tunneling

- **3D Lab Simulation:** Scanning Tunneling Microscopy (STM) of Highly Oriented Pyrolytic Graphite (HOPG).
- **Primary Machine:** STM Benchtop Instrument Twin
- **Glassware & Accessories:** Piezoelectric Tube Scanner, Mechanically Cut Pt-Ir Wire Tips, Freshly Cleaved HOPG
  Substrate, Vibration Isolation Rig.

#### 7. NGSS-HS-PS1-1-T6L7-607: Fundamentals of Spectroscopy

- **3D Lab Simulation:** Optical Absorbance, Transmission, and Molar Absorptivity ($epsilon$) Calibration.
- **Primary Machine:** `spectrophotometer_twin` (Genesys 50)
- **Glassware & Accessories:** Matched Pair Quartz Cuvettes, Certified Holmium Oxide Calibration Filter, Micropipettes.

#### 8. NGSS-HS-PS1-1-T6L8-608: NMR Foundations

- **3D Lab Simulation:** Free Induction Decay (FID) and Fourier Transform NMR Principles.
- **Primary Machine:** `nmr_twin` (60 MHz Benchtop FT-NMR)
- **Glassware & Accessories:** 5 mm Precision Glass NMR Tubes with Caps, Deuterated Chloroform ($CDCl_3$),
  Tetramethylsilane (TMS) Reference.

#### 9. NGSS-HS-PS1-1-T6L9-609: NMR Chemical Shifts

- **3D Lab Simulation:** 1H and 13C Chemical Shift / Spin-Spin Coupling ($J$) Structure Elucidation.
- **Primary Machine:** `nmr_twin` (60 MHz Benchtop FT-NMR)
- **Glassware & Accessories:** 5 mm NMR Tubes, Spinner Turbines, Depth Gauge, Organic Samples (Ethyl Acetate,
  Isopropanol, Toluene).

#### 10. NGSS-HS-PS1-1-T6L10-610: IR Spectroscopy Principles

- **3D Lab Simulation:** Michelson Interferometer Alignment and Fourier Transform Infrared Absorption.
- **Primary Machine:** `ftir_twin` (Nicolet iS50 ATR-FTIR)
- **Glassware & Accessories:** Monolithic Diamond ATR Crystal Plate, Specimen Pressure Clamp, Polystyrene Standard
  Calibration Film.

#### 11. NGSS-HS-PS1-1-T6L11-611: IR Functional Group Analysis

- **3D Lab Simulation:** Diagnostic Fingerprinting of Carbonyl ($1700	ext{ cm}^{-1}$), Hydroxyl ($3300	ext{ cm}^{-1}$),
  and Alkyne Peaks.
- **Primary Machine:** `ftir_twin` (ATR-FTIR)
- **Glassware & Accessories:** Diamond ATR Stage, Isopropanol Cleaning Wipes, Micro-Spatula, Unknown Organic Liquid &
  Solid Samples.

#### 12. NGSS-HS-PS1-1-T6L12-612: High-Resolution Mass Spectrometry

- **3D Lab Simulation:** Exact Mass and Isotopic Distribution Calculation on Electrospray Q-TOF.
- **Primary Machine:** `gc_ms_twin` (High-Resolution ESI/TOF Console Mode)
- **Glassware & Accessories:** Syringe Pump, PEEK Micro-Tubing, Formic Acid Solvent Blends, Calibration Reference Mix.

#### 13. NGSS-HS-PS1-8-T6L13-613: MS Fragmentation Pathways

- **3D Lab Simulation:** Electron Ionization (EI) Molecular Ion Fragmentation ($alpha$-Cleavage and McLafferty
  Rearrangements).
- **Primary Machine:** `gc_ms_twin` (Agilent 8890 / 5977B MSD)
- **Glassware & Accessories:** Capillary GC Column (HP-5ms), Split/Splitless Injector, Turbo Vacuum System
  (`vacuum_pump_twin`), 10 µL Syringe.

#### 14. NGSS-HS-PS1-3-T6L14-614: UV-Vis Spectroscopy

- **3D Lab Simulation:** Woodward-Fieser Rules Verification for Conjugated Dienes and Enones.
- **Primary Machine:** `spectrophotometer_twin` (Genesys 50)
- **Glassware & Accessories:** 10 mm UV Quartz Cuvettes, Spectrophotometric Grade Hexane, Mesityl Oxide, Retinol
  Solutions.

#### 15. NGSS-HS-PS1-2-T6L15-615: Analytical Multi-Spectral Synthesis

- **3D Lab Simulation:** Integrated Unknown Identification combining NMR, FTIR, MS, and UV-Vis Spectra.
- **Primary Machines:** `nmr_twin`, `ftir_twin`, `gc_ms_twin`, `spectrophotometer_twin`
- **Glassware & Accessories:** Integrated Multi-Instrument Sample Prep Kit, Micro-Vials, Volumetric Solvents.

#### 16. NGSS-HS-PS1-1-T6L16-616: Nuclear Decay and Transmutation

- **3D Lab Simulation:** Radioactive Half-Life Determination of Barium-137m Eluted from Cesium-137 Isotope Cow.
- **Primary Machine:** `radiation_detector_twin` (Geiger-Müller Tube & Scaler/Ratemeter Console)
- **Glassware & Accessories:** Cs-137/Ba-137m Isotope Minigenerator, Eluting Syringe with Saline, Stainless Steel
  Planchets, Lead Shield Bricks.

#### 17. NGSS-HS-PS1-3-T6L17-617: X-Ray Diffraction Crystallography

- **3D Lab Simulation:** Bragg's Law Lattice Parameter and Space Group Determination via Powder XRD.
- **Primary Machine:** `xrd_twin` (Malvern Panalytical Aeris)
- **Glassware & Accessories:** Zero-Background Sample Holders, Powder Agate Mortar, Cu K-alpha X-Ray Tube, Rotating
  Goniometer Stage.

#### 18. NGSS-HS-PS1-3-T6L18-618: Total Organic Synthesis Strategy

- **3D Lab Simulation:** Convergent Multi-Step Synthesis with Inert Atmosphere Schlenk Techniques.
- **Primary Machine:** `glove_box_twin`, `rotovap_twin`, `vacuum_pump_twin`
- **Glassware & Accessories:** Schlenk Double Manifold, Pear-Shaped Reaction Flasks, Suba-Seal Septa, Cannula Needles,
  Dry Solvents.

#### 19. NGSS-HS-PS1-3-T6L19-619: Chromatographic Separation Science

- **3D Lab Simulation:** Van Deemter Equation Flow-Rate Optimization in High-Performance Liquid Chromatography (HPLC).
- **Primary Machine:** Preparative HPLC Chromatography Rig Twin
- **Glassware & Accessories:** C18 Reverse-Phase Column ($4.6 	imes 250	ext{ mm}$), Quaternary HPLC Pump, Rheodyne Sample
  Loop Injector, UV Flow-Cell.

#### 20. NGSS-HS-PS1-1-T6L20-620: Thin-Layer Chromatography

- **3D Lab Simulation:** Two-Dimensional TLC of Complex Natural Extracts (Chlorophylls, Carotenoids).
- **Primary Machine:** TLC Developing Tank & UV Darkroom Viewing Box
- **Glassware & Accessories:** Glass TLC Development Tanks, Silica Gel Plates ($10 	imes 10	ext{ cm}$), Capillary
  Spotters, Petroleum Ether/Acetone Eluent.

#### 21. NGSS-HS-PS1-1-T6L21-621: Gas Chromatography Analysis

- **3D Lab Simulation:** Quantitative Internal Standard GC-FID Determination of Blood Ethanol or Fuel Blends.
- **Primary Machine:** `gc_ms_twin` (GC-FID Mode)
- **Glassware & Accessories:** Capillary Column, Hydrogen/Air Gas Generator Lines, Micro-Syringe (1 µL), Autosampler
  Vials.

#### 22. NGSS-HS-PS1-1-T6L22-622: Carbon Nanostructures

- **3D Lab Simulation:** Chemical Vapor Deposition (CVD) Growth of Multi-Walled Carbon Nanotubes.
- **Primary Machine:** `muffle_furnace_twin` (Tube Furnace Variant) & `vacuum_pump_twin`
- **Glassware & Accessories:** Quartz Process Tube, Mass Flow Controllers ($Ar, H_2, C_2H_2$), Silicon Substrate with
  Fe/Al₂O₃ Catalyst.

#### 23. NGSS-HS-PS1-3-T6L23-623: Nanomaterials Engineering

- **3D Lab Simulation:** Turkevich Gold Nanoparticle Synthesis and Surface Plasmon Resonance (SPR) Peak Shift.
- **Primary Machine:** `hotplate_twin`, `ultrasonic_cleaner_twin`, `spectrophotometer_twin`
- **Glassware & Accessories:** 100 mL Clean Borosilicate Flask, Chloroauric Acid ($HAuCl_4$), Trisodium Citrate
  Dihydrate, Cuvettes.

#### 24. NGSS-HS-PS1-3-T6L24-624: Green Chemistry Principles

- **3D Lab Simulation:** Solvent-Free Mechanochemical Synthesis (Ball Milling Aldol Reaction) and E-Factor Calculation.
- **Primary Machine:** Mechanochemical Ball Mill Twin & `balance_twin`
- **Glassware & Accessories:** Stainless Steel Grinding Jars with Balls, 3,4-Dimethoxybenzaldehyde, 1-Indanone, Solid
  NaOH, Büchner Funnel.

#### 25. NGSS-HS-PS1-2-T6L25-625: Tier 6 Summative Evaluation

- **3D Lab Simulation:** Research Capstone: Full Structural Determination and Purity Validation of an Unknown Novel
  Molecule.
- **Primary Machines:** `nmr_twin`, `ftir_twin`, `gc_ms_twin`, `spectrophotometer_twin`
- **Glassware & Accessories:** Capstone Unknown Vials, Multi-Instrument Analytical Consumables.

---

### Tier 7: Master Assessment (13 Modules)

#### 1. NGSS-HS-LS1-1-T7L1-701: The Clinic

- **3D Lab Simulation:** Comprehensive Clinical Blood Serum Panel (Glucose, BUN, Creatinine, Electrolytes).
- **Primary Machine:** `centrifuge_twin` (Serum Separation), `spectrophotometer_twin`, `ph_meter_twin`
- **Glassware & Accessories:** Vacutainer Serum Separator Tubes, Micropipettes, Lyophilized Clinical Standards,
  Microplate Reader Wells.

#### 2. OSHA-LAB-T7L2-702: Chemical Safety and Hazardous Material Protocols

- **3D Lab Simulation:** Hazardous Chemical Spill Mitigation, Safety Shower / Eyewash Operation, and Incompatible
  Reagent Segregation.
- **Primary Machine:** Laboratory Safety Facility Twin (Flammables Cabinet, Corrosives Cabinet, Eyewash Rig)
- **Glassware & Accessories:** Chemical Spill Pillows, Acid/Base Neutralizers, Heavy Neoprene Gloves, Face Shield,
  Hazardous Waste Disposal Carboys.

#### 3. NGSS-HS-PS1-6-T7L3-703: Automated Potentiometric Volumetry

- **3D Lab Simulation:** High-Precision Gran Plot Equivalence Determination for Complex Polyprotic Titrations.
- **Primary Machine:** `auto_titrator_twin` (Metrohm Style) & `balance_twin`
- **Glassware & Accessories:** Motorized Digital Piston Burette, Jacketed Reaction Vessel, Combined Glass/Reference
  Electrode, Standardized NaOH.

#### 4. AP-CHEM-T7L4-704: Multi-Step Organic Synthesis Practicum

- **3D Lab Simulation:** Multi-Step Synthesis of Anesthetic Lidocaine from 2,6-Dimethylaniline.
- **Primary Machines:** `hotplate_twin` (Reflux), `rotovap_twin`, `vacuum_pump_twin`, `mel_temp_twin`
- **Glassware & Accessories:** 2-Neck Round Bottom Flasks, Chloroacetyl Chloride, Diethylamine, Separatory Funnels,
  Anhydrous Drying Agents.

#### 5. AP-CHEM-T7L5-705: Chemometric Statistics and Error Propagation

- **3D Lab Simulation:** ISO 17025 Certified Reference Material Calibration and Dixon's Q / Grubbs Outlier Elimination.
- **Primary Machine:** Primary Metrology Calibration Rig & `balance_twin`
- **Glassware & Accessories:** ASTM Class 1 Calibration Weights, Certified Reference Pipettes, Pycnometer.

#### 6. ACAD-RES-T7L6-706: Advanced Synthetic Retrosynthesis

- **3D Lab Simulation:** Strategic Disconnection and Protective Group Management for Complex Alkaloids.
- **Primary Machine:** Retrosynthetic Disconnection Console Twin
- **Glassware & Accessories:** Interactive Synthon Graph Surface, Protective Group Selector.

#### 7. ACAD-RES-T7L7-707: Relativistic Quantum Systems

- **3D Lab Simulation:** Relativistic Contraction of $6s$ Orbitals in Gold, Mercury, and Lead.
- **Primary Machine:** Dirac-Fock Relativistic Simulation Engine Twin
- **Glassware & Accessories:** Relativistic Radial Wavefunction Viewer, Spin-Orbit Splitting Monitor.

#### 8. ACAD-RES-T7L8-708: Industrial Chemical Reactor Design

- **3D Lab Simulation:** Residence Time Distribution (RTD) in Continuous Stirred-Tank (CSTR) vs Plug Flow (PFR)
  Reactors.
- **Primary Machine:** Modular Benchtop Pilot Plant Reactor Twin
- **Glassware & Accessories:** Peristaltic Feed Pumps, Tubular Glass PFR Column, Jacketed Glass CSTR Vessel with Turbine
  Impeller, In-Line Conductivity Probes.

#### 9. GRAD-CER-T7L9-709: Tier 7 Summative Evaluation

- **3D Lab Simulation:** Master Practical Examination: Multi-Stage Synthetic Campaign, Purification, and Structural
  Certification.
- **Primary Machines:** Complete Integrated Benchtop Twin Suite
- **Glassware & Accessories:** Full Glassware & Sensor Hardware Suite.

#### 10. ACAD-RES-T7L10-710: Curriculum Audit

- **3D Lab Simulation:** Metrological Audit of Primary Standards and Standard Operating Procedures.
- **Primary Machine:** Calibration Verification Bench Twin
- **Glassware & Accessories:** Calibrated Thermometers, Deadweight Pressure Testers.

#### 11. AP-CHEM-T7L11-711: Adv Organic

- **3D Lab Simulation:** Asymmetric Organocatalytic Aldol Reaction via (S)-Proline.
- **Primary Machine:** `polarimeter_twin` & `nmr_twin`
- **Glassware & Accessories:** Chiral Organocatalysts, 4-Nitrobenzaldehyde, Anhydrous Acetone, Polarimeter Cells, NMR
  Tubes.

#### 12. AP-CHEM-T7L12-712: Adv Quantum

- **3D Lab Simulation:** Tunneling Splitting in Ammonia Inversion and Double-Well Potentials.
- **Primary Machine:** Quantum Tunneling Dynamics Console Twin
- **Glassware & Accessories:** Double-Well Potential Interactive Controls, Wavepacket Energy Surface HUD.

#### 13. NGSS-HS-PS1-7-T7L13-713: Adv Stoichiometry

- **3D Lab Simulation:** High-Pressure Fixed-Bed Heterogeneous Catalytic Ammonia Synthesis (Haber-Bosch Micro-Reactor).
- **Primary Machine:** `high_pressure_reactor_twin` & Gas Chromatograph (`gc_ms_twin`)
- **Glassware & Accessories:** Pre-Heated Packed Catalyst Tube (Promoted Fe), Mass Flow Controllers, Back-Pressure
  Regulator, Ammonia Scrubbing Flask.

---

### Tier 8: Graduate Specializations (6 Modules)

#### 1. NGSS-HS-PS1-8-T8L1-801: Nuclear Medicine

- **3D Lab Simulation:** Technetium-99m Radioisotope Generator Elution and Radiopharmaceutical Quality Control TLC.
- **Primary Machine:** Lead-Shielded Hot Cell Twin & `radiation_detector_twin`
- **Glassware & Accessories:** Mo-99/Tc-99m Generator Column, Sterile Saline Syringes, Evacuated Vials, Lead Shielded
  Pig, Dose Calibrator.

#### 2. NGSS-HS-PS1-2-T8L2-802: Asymmetric Total Synthesis Strategies

- **3D Lab Simulation:** Sharpless Asymmetric Epoxidation of Allylic Alcohols.
- **Primary Machine:** `glove_box_twin` (Inert Atmosphere) & `polarimeter_twin`
- **Glassware & Accessories:** Schlenk Flasks, Dry Argon Line, Titanium(IV) Isopropoxide, (+)-Diethyl Tartrate,
  $t$-Butyl Hydroperoxide, Molecular Sieves.

#### 3. AP-CHEM-T8L3-803: Organometallic Chemistry and Homogeneous Catalysis

- **3D Lab Simulation:** Palladium-Catalyzed Suzuki-Miyaura Cross-Coupling in Degassed Media.
- **Primary Machine:** `glove_box_twin`, `hotplate_twin`, `rotovap_twin`
- **Glassware & Accessories:** Aryl Halides, Boronic Acids, $Pd(PPh_3)_4$, Degassed Solvents, Inert Gas Cannula.

#### 4. AP-CHEM-T8L4-804: Heterocyclic Organic Synthesis

- **3D Lab Simulation:** Fischer Indole Synthesis of 2-Phenylindole.
- **Primary Machine:** `hotplate_twin` (Reflux), `vacuum_pump_twin`, `mel_temp_twin`
- **Glassware & Accessories:** Round Bottom Flask, Graham Condenser, Phenylhydrazine, Acetophenone, Polyphosphoric Acid,
  Büchner Funnel.

#### 5. AP-CHEM-T8L5-805: Lifecycle Engineering and Green Technology

- **3D Lab Simulation:** Supercritical $CO_2$ Extraction of Botanical Essential Oils.
- **Primary Machine:** Supercritical Fluid Extraction Pilot Rig Twin (`high_pressure_reactor_twin` variant)
- **Glassware & Accessories:** High-Pressure Extraction Cylinder (300 bar), Chilled Liquid $CO_2$ Pump, Depressurization
  Separator Trap.

#### 6. EXAM-TIER8-T8L6-000: Tier 8 Summative Evaluation

- **3D Lab Simulation:** Graduate Synthesis & Characterization Board Examination.
- **Primary Machines:** Complete Specialized Heavy Instrument Suite (`glove_box_twin`, `high_pressure_reactor_twin`,
  `nmr_twin`)
- **Glassware & Accessories:** Full Advanced Labware Suite.

---

### Tier 9: The Material World (6 Modules)

#### 1. NGSS-HS-PS1-3-T9L1-901: Polymer Science

- **3D Lab Simulation:** Gel Permeation Chromatography (GPC / SEC) Molecular Weight Distribution ($M_n, M_w, PDI$).
- **Primary Machine:** GPC Analytical System Twin
- **Glassware & Accessories:** Styragel GPC Column Stack, Refractive Index Detector, Narrow Polystyrene Standards,
  HPLC-Grade THF.

#### 2. NGSS-HS-PS1-3-T9L2-902: Advanced Inorganic Ceramic Materials

- **3D Lab Simulation:** Sol-Gel Synthesis and High-Temperature Sintering of Yttria-Stabilized Zirconia (YSZ).
- **Primary Machine:** `muffle_furnace_twin` (Carbolite CWF 1100, 1200 °C) & `ultrasonic_cleaner_twin`
- **Glassware & Accessories:** Alumina Sintering Crucibles, Zirconium Alkoxide Precursors, Ultrasonic Agitation Bath,
  Diamond Sectioning Saw.

#### 3. AP-CHEM-T9L3-903: Supramolecular Host-Guest Chemistry

- **3D Lab Simulation:** Crown Ether (18-Crown-6) Selective Potassium Binding Assayed via Isothermal Titration
  Calorimetry (ITC).
- **Primary Machine:** Isothermal Titration Calorimeter Twin & `nmr_twin`
- **Glassware & Accessories:** High-Precision Micro-Syringe Buret, Adiabatic Titration Sample Cell, Crown Ethers, Alkali
  Picrate Salts.

#### 4. AP-CHEM-T9L4-904: Interfacial Dynamics and Surface Science

- **3D Lab Simulation:** Dynamic Contact Angle Goniometry and Langmuir-Blodgett Monolayer Deposition.
- **Primary Machine:** `contact_angle_twin` (ramé-hart Goniometer) & Langmuir Trough Twin
- **Glassware & Accessories:** Precision Micrometer Dosing Syringe, High-Speed Optical Drop Camera,
  Hydrophobic/Hydrophilic Substrates, Surfactant Solutions.

#### 5. NGSS-HS-PS1-3-T9L5-905: Nanofabrication and Epitaxial Deposition

- **3D Lab Simulation:** Cleanroom Photolithography: Spin Coating, UV Exposure, and Wet Chemical Etching.
- **Primary Machine:** Spin Coater Station Twin & Mask Aligner Twin
- **Glassware & Accessories:** Vacuum Chuck Spin Coater, Silicon Wafers (100 mm), Micro-Pipette Photoresist Dispenser,
  UV Mask, Developer Tank.

#### 6. EXAM-TIER9-T9L6-000: Tier 9 Summative Evaluation

- **3D Lab Simulation:** Materials Engineering Capstone: Nanofabrication, Sintering, and Advanced Surface
  Characterization.
- **Primary Machines:** `muffle_furnace_twin`, `xrd_twin`, `contact_angle_twin`
- **Glassware & Accessories:** Complete Advanced Materials Toolset.

---

### Tier 10: Theoretical Frontiers (5 Modules)

#### 1. NGSS-ESS1-1-T10L1-1001: Astrochemistry

- **3D Lab Simulation:** Cryogenic Matrix Isolation Spectroscopy (10 Kelvin) of Interstellar Dust Analog Ices.
- **Primary Machine:** Closed-Cycle Cryostat Chamber Twin & `ftir_twin` (`vacuum_pump_twin`)
- **Glassware & Accessories:** Gold-Coated Cryogenic Mirror, High-Vacuum Turbo Line, Precision Gas Leak Valves, Gas
  Cylinders ($H_2O, CO, CH_4, NH_3$).

#### 2. AP-CHEM-T10L2-1002: Computational Molecular Modeling and Quantum Chemistry

- **3D Lab Simulation:** Density Functional Theory (DFT / B3LYP) Geometry Optimization and Transition State Search.
- **Primary Machine:** Quantum HPC Cluster Workstation Twin
- **Glassware & Accessories:** Geometry Input Interface, Molecular Orbital Iso-Surface HUD, Vibrational Frequency
  Calculator.

#### 3. AP-PHYS-T10L3-1003: Time-Dependent Quantum Dynamics

- **3D Lab Simulation:** Ultrafast Femtosecond Laser Pump-Probe Spectroscopy of Chemical Bond Cleavage ($I_2$
  Dissociation).
- **Primary Machine:** Femtosecond Optical Bench Laser Twin
- **Glassware & Accessories:** Ti:Sapphire Laser Oscillator, Optical Delay Rail with Retroreflector, Flowing Sample Jet,
  Spectrometer Array.

#### 4. AP-PHYS-T10L4-1004: Statistical Mechanics and Ensemble Theory

- **3D Lab Simulation:** Molecular Dynamics (MD) Simulation of Phase Transitions in Lennard-Jones Fluids.
- **Primary Machine:** Statistical Ensemble Simulation HUD Twin
- **Glassware & Accessories:** NVE/NVT Thermostat Controls, Radial Distribution Function Calculator, Velocity
  Autocorrelation Plotter.

#### 5. EXAM-TIER10-T10L5-000: Tier 10 Comprehensive Summative Evaluation

- **3D Lab Simulation:** Theoretical Frontiers Grand Defense: Computational Modeling Reconciled with Experimental
  Ultrafast Spectroscopic Benchmarks.
- **Primary Machines:** Quantum HPC Cluster Twin & Ultrafast Optical Bench Twin
- **Glassware & Accessories:** Theoretical Parameter Manifests, Multi-Dimensional Potential Energy Surfaces.

---

## 4. Reusable Modular Labware Asset System (The Universal Twin Pack)

To avoid rebuilding basic hardware for every module, `Twins` must establish a shared modular asset pack under
`lab_viewer/shared/labware_library.js`:

### 4.1. Borosilicate Glassware Family (DIN/ISO Standards)

- **Beakers (Low Form Griffin):** 50 mL, 100 mL, 250 mL, 500 mL, 1000 mL (with white graduation decals and spout lip).
- **Erlenmeyer Flasks (Narrow Neck):** 50 mL, 125 mL, 250 mL, 500 mL (standard ground glass joint optional).
- **Volumetric Flasks (Class A):** 10 mL, 25 mL, 50 mL, 100 mL, 250 mL (with ground glass pennyhead stoppers and
  calibration ring).
- **Graduated Cylinders:** 10 mL, 25 mL, 50 mL, 100 mL (with hexagonal base and bumper guard ring).
- **Glass Test Tubes:** 12×75 mm, 16×150 mm, 25×150 mm boiling tubes.
- **Volumetric & Graduated Pipettes:** 1 mL, 5 mL, 10 mL, 25 mL Class A.
- **Burettes:** 50 mL Class A with PTFE straight bore stopcock and fine micro-jet tip.
- **Separatory Funnels:** 125 mL, 250 mL pear-shaped with PTFE stopcock and standard taper ground neck.
- **Condensers:** Liebig straight-tube condenser, Graham coiled condenser, Vigreux fractional column.
- **Round Bottom Flasks:** Single-neck and 3-neck (100 mL, 250 mL, 500 mL, ST 24/40 joints).

### 4.2. Physical Support & Mechanical Stands

- **Retort Stands:** Cast iron rectangular base with vertical stainless steel rod ($12 	imes 600	ext{ mm}$).
- **Clamps & Fasteners:** Cast zinc bosshead clamps, 3-prong rubber-coated extension clamps, burette clamps.
- **Burner Support:** Cast iron tripod with stainless wire gauze ceramic center pad.
- **Racks & Organizers:** Autoclavable polypropylene test tube racks (24-well and 12-well).

### 4.3. Liquid Handling & Precision Dispensing

- **Variable Volume Micropipettes:** P20 ($2–20 mu	ext{L}$), P200 ($20–200 mu	ext{L}$), P1000 ($100–1000 mu	ext{L}$) with
  ejectable tips.
- **Disposable Pasteur Pipettes:** Borosilicate glass and polyethylene transfer bulb droppers.
- **Wash Bottles:** Low-density polyethylene (LDPE) wash bottles (500 mL) color-coded for Water, Ethanol, and Acetone.

### 4.4. Electronic Sensors & Transducers

- **Thermocouple / RTD Probes:** Stainless steel sheathed Type-K thermocouple and Pt100 RTD immersion probes.
- **pH Electrodes:** Sealed gel-filled combination glass bulb electrode with BNC connector.
- **Conductivity Dip Cells:** Dual platinum plate cell ($K=1.0	ext{ cm}^{-1}$).
- **Pressure Transducers:** Stainless steel piezoresistive pressure transmitter with 1/4" NPT fitting.
- **Spectroscopic Cuvettes:** Standard 10 mm pathlength optical polystyrene, optical glass, and Far-UV fused quartz
  cuvettes.

---

## 5. Prioritized Engineering Roadmap for the Twins Project

### Phase 1: Direct ChemMate Integration (Weeks 1–2)

Integrate the 6 production-ready twins directly into ChemMate's existing laboratory views:

1. **Centrifuge Twin** (`centrifuge_twin`): Connect to T1L2 (Phase Separation), T5L11 (DNA Extraction), T7L1 (Clinical
   Centrifugation).
2. **Analytical Balance Twin** (`balance_twin`): Connect to T1L7 (Precision Tools), T3L1 (The Mole), T3L19 (Glassware
   Calibration).
3. **Hotplate Stirrer Twin** (`hotplate_twin`): Connect to T1L3 (Phase Shifts), T3L3 (Molarity), T4L11 (Kinetics).
4. **Rotary Evaporator Twin** (`rotovap_twin`): Connect to T5L16 (Extraction), T5L25 (Alkaloids), T7L4 (Synthesis
   Practicum).
5. **Spectrophotometer Twin** (`spectrophotometer_twin`): Connect to T1L14 (Balmer Emission), T3L15 (PPM Iron), T4L12
   ($K_{eq}$).
6. **Vacuum Pump Twin** (`vacuum_pump_twin`): Connect to T1L4 (Rutherford Vacuum), T3L12 (Büchner Filtration), T5L18
   (Drug Synthesis).

### Phase 2: Complete the 6 Scaffolded Twins (Weeks 3–4)

Finalize kinematics, dynamic LCDs, and controller units for:

1. **pH Meter Twin** (`ph_meter_twin`): High demand across T4 (Acids/Bases, Titrations, Buffers) and T7.
2. **Muffle Furnace Twin** (`muffle_furnace_twin`): Essential for T1 (Allotropes), T3 (Hydrates), T6 (Superconductors),
   T9 (Ceramics).
3. **Glove Box Twin** (`glove_box_twin`): Essential for T6 (Quantum Dots), T8 (Asymmetric Catalysis).
4. **High Pressure Reactor Twin** (`high_pressure_reactor_twin`): Essential for T2 (Real Gases), T6 (Catalysis), T7
   (Industrial Haber).
5. **Vortex Mixer Twin** (`vortex_mixer_twin`): Essential for T1 (Halogen Extraction), T3 (Dilutions), T5 (Enzymology).
6. **Ultrasonic Cleaner Twin** (`ultrasonic_cleaner_twin`): Essential for T3 (Dissolution), T6 (Nanoparticles), T9
   (Ceramics).

### Phase 3: Construct Top-Priority New Twins (Weeks 5–6)

Build CAD and software controllers for high-frequency curriculum gaps:

1. **Calorimeter Twin** (`calorimeter_twin`): Dual module (Coffee-Cup Dewar + Oxygen Bomb) for Tier 4.
2. **Auto-Titrator & Precision Burette Stand Twin** (`auto_titrator_twin`): Critical for T3, T4, and T7.
3. **Melting Point Apparatus Twin** (`mel_temp_twin`): Mel-Temp style unit for T2 and all organic synthesis in T5/T7.
4. **Benchtop NMR Spectrometer Twin** (`nmr_twin`): 60 MHz FT-NMR for T6, T7, T8.
5. **FTIR Spectrometer Twin** (`ftir_twin`): ATR-FTIR for T6, T7, T10.
6. **Gas Laws Piston & Eudiometer Twin** (`gas_laws_piston_twin`): Direct P-V-T demonstration for T3.

---

## 6. Verification & Governance Protocols

1. **Physical Accuracy:** All physical dimensions must respect the real-world OEM equipment envelope ($W 	imes D 	imes H$
   mm) defined in `Twins/.master/06_MACHINES/MACHINE_CATALOGUE.md`.
2. **Tabletop Datum Rule:** All instruments and accessories must sit precisely at $Y=0$ on their respective mounting
   feet or bench bases.
3. **Semantic Hierarchy:** All 3D assemblies must strictly follow the node naming rules (`Body_Chassis`, `UI_LCD`,
   `Btn_*`, `Pivot_*`, `Glass_*`, `Fastener_*`, `Foot_*`, `Badge_SREdesigns`).
4. **Automated Verification:** Every new machine package must pass `cad_validator.mjs` with 0 errors and 0 warnings
   before committing to ChemMate.
