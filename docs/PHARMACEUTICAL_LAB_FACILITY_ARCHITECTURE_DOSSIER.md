# PHARMACEUTICAL CHEMISTRY LABORATORY: MASTER FACILITY ARCHITECTURAL & ENGINEERING DOSSIER
## Complete Facility Space Planning, 1:1 Blueprint Layouts, HVAC Containment, MEP Infrastructure, and SEFA Modular Casework Specifications

---

### EXECUTIVE SUMMARY & ENGINEERING DESIGN BASIS

This master facility engineering dossier establishes the complete architectural, structural, mechanical (HVAC), electrical, plumbing (MEP), casework, and life safety specifications for a world-class **12,000 GSF (1,114.8 m²)** pharmaceutical chemistry research and quality control complex.

Designed specifically to house the comprehensive instrument and tool universe cataloged in [`docs/PHARMACEUTICAL_LAB_EQUIPMENT_MASTER_DOSSIER.md`](file:///Users/Samuel/AGapps/Twins/docs/PHARMACEUTICAL_LAB_EQUIPMENT_MASTER_DOSSIER.md), this facility integrates:
- **Medicinal Chemistry & Organic Synthesis**: 8× 6-foot chemical fume hoods, dual-manifold Schlenk lines, microwave synthesizers, automated flash systems, inert gloveboxes, and rotary evaporators.
- **Process Chemistry & Scale-Up**: 2× walk-in floor-mounted hoods, 1L–5L jacketed glass reactors with dynamic thermal circulators (-45°C to +250°C), continuous microfluidic flow reactors, and automated solvent purification systems (SPS).
- **Analytical Chromatography Core**: 6× Agilent 1290 Infinity II UHPLC stacks, Waters ACQUITY Premier UPLC, Waters ACQUITY UPC² Supercritical Fluid Chromatograph (SFC).
- **Mass Spectrometry Core**: High-resolution Thermo Scientific Orbitrap Exploris 240, Waters Xevo TQ-Absolute Triple Quadrupole LC-MS/MS, Agilent 8890 GC-MS/MS with headspace.
- **High-Field Structural NMR Vault**: Bruker Ascend 400 MHz (9.4 T) and 500 MHz (11.7 T) superconducting shielded magnets with Prodigy CryoProbes, SampleJet automated changers, and Avance Neo consoles.
- **Solid-State Characterization**: Bruker D8 Discover XRPD, Renishaw inVia Confocal Raman Microscope, Thermo Nicolet iS50 FTIR, TA Instruments DSC 2500 & TGA 5500.
- **Pharmaceutical QC & Testing**: USP Dissolution testing (Agilent 708-DS), automated tablet combination testing (Sotax AT50), friability & disintegration (ERWEKA), Karl Fischer & potentiometric titrators (Metrohm/Mettler Toledo).
- **Hazardous Solvent Dispensing & Waste Vault**: NFPA 30 Class I Division 1/2 storage room with 4" containment curb, 24/7 dedicated exhaust, and bulk drum grounding busbars.
- **Glassware Decontamination & Pure Water Hub**: Miele lab washers, acid soaking baths, convection drying ovens, and central Milli-Q IQ 7003 pure water generation.

All systems are engineered strictly in accordance with:
1. **SEFA Standards**: SEFA 1 (Fume Hoods), SEFA 2 (Installation), SEFA 3 (Work Surfaces), SEFA 7 (Fixtures), SEFA 8M (Metal Casework), SEFA 10 (Adaptable Systems).
2. **Containment & HVAC**: ANSI/AIHA Z9.5, NFPA 45 (Laboratories Using Chemicals), ASHRAE 110-2016, OSHA 1910.1450.
3. **Chemical & Fire Safety**: NFPA 30 (Flammable and Combustible Liquids), NFPA 10, NFPA 2001 (Clean Agent Systems), ANSI Z358.1 (Emergency Eyewash & Shower).
4. **Vibration & Accessibility**: 2010 ADA Standards for Accessible Design, ISO 10816, and Vibration Criteria VC-D & VC-E for high-resolution instrumentation.
5. **Digital Twin Construction**: All spatial coordinates, casework, utilities, and service raceways follow the **Centrifuge Standard** (`.agents/AGENTS.md`) with benchtop datum at $Y = 0$, physical circuit continuity (`Power_Receptacle_Duplex`), and genuine 3D procedural modeling.

---

# SECTION 1: ARCHITECTURAL SPACE PLANNING & MASTER FLOOR PLAN

## 1.1 Gross Facility Envelope & Space Programming Matrix

The facility is configured within an industrial/biotech structural bay envelope of **100'-0" × 120'-0" (30.48 m × 36.58 m)**, providing **12,000 Gross Square Feet (GSF) / 1,114.8 m²**. The net usable laboratory area is **8,850 Net Square Feet (NSF) / 822.2 m²** (73.8% net-to-gross efficiency), with 3,150 GSF allocated to primary egress corridors, safety airlocks, gowning suites, and mechanical/electrical service risers.

### Master Zone-by-Zone Space Programming Matrix

| Zone ID | Functional Suite Name | Net Area ($ft^2$) | Net Area ($m^2$) | Room Dimensions ($W \times L \times H$ ft) | Clear Height (m) | Design Occ. (FTE) | Air Changes (ACH) | Room Pressure | Sensible Heat Load (kW) | Key Instruments & Infrastructure Housed |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Z-01** | Medicinal Chemistry / Synthesis | 2,200 | 204.4 | $44'-0" \times 50'-0" \times 10'-0"$ | 3.05 m | 8–10 | 10–12 | Negative (-0.03" w.g.) | 24.5 kW | 8× 6-ft Fume Hoods, Biotage Initiator+ Microwaves, Dual-Bank Schlenk Lines, Rotovaps, Inert Glovebox |
| **Z-02** | Scale-Up & Process Chemistry | 1,100 | 102.2 | $22'-0" \times 50'-0" \times 12'-0"$ | 3.65 m | 4–6 | 12–15 | Negative (-0.04" w.g.) | 32.0 kW | 2× Walk-In Hoods, Radleys Reactor-Ready (1L–5L), Syrris Asia Flow, Huber Unistat 405 chillers, MB-SPS 800 |
| **Z-03** | Analytical Separation Suite | 1,320 | 122.6 | $33'-0" \times 40'-0" \times 10'-0"$ | 3.05 m | 4–6 | 8–10 | Neutral / Neg (-0.01" w.g.) | 14.0 kW | 6× Agilent 1290 UHPLC, Waters ACQUITY Premier UPLC, Waters ACQUITY UPC² (SFC), Biotage Selekt Flash |
| **Z-04** | Mass Spectrometry Core | 990 | 92.0 | $22'-0" \times 45'-0" \times 10'-0"$ | 3.05 m | 2–4 | 8–10 | Negative (-0.02" w.g.) | 18.5 kW | Thermo Orbitrap Exploris 240, Waters Xevo TQ-Absolute, Agilent 8890 GC-MS, Peak N2 Generators, Roughing Pumps |
| **Z-05** | High-Field NMR Vault | 770 | 71.5 | $22'-0" \times 35'-0" \times 13'-0"$ | 3.96 m | 1–2 | 8–10 | Positive (+0.02" w.g.) | 6.5 kW | Bruker Ascend 400 MHz & 500 MHz Superconducting Magnets, SampleJet Autosampler, Avance Neo Consoles |
| **Z-06** | Solid-State Characterization | 660 | 61.3 | $22'-0" \times 30'-0" \times 10'-0"$ | 3.05 m | 2–3 | 6–8 | Positive (+0.02" w.g.) | 11.5 kW | Bruker D8 Discover XRPD, Renishaw inVia Confocal Raman, Thermo Nicolet iS50 FTIR, TA DSC 2500, TA TGA 5500 |
| **Z-07** | Pharmaceutical QC Lab | 880 | 81.8 | $22'-0" \times 40'-0" \times 10'-0"$ | 3.05 m | 3–4 | 6–8 | Positive (+0.01" w.g.) | 8.0 kW | Agilent 708-DS Dissolution, Sotax AT50 Tablet Tester, ERWEKA Friability & Disintegration, Metrohm KF Titrators |
| **Z-08** | Solvent Dispensing & Waste | 440 | 40.9 | $20'-0" \times 22'-0" \times 10'-0"$ | 3.05 m | 1–2 | 15–20 | Dedicated Neg (-0.05" w.g.)| 3.5 kW | Justrite 60-Gal Safety Cabs, Bulk Solvent Kegs, Grounding Busbars, Waste Carboy Secondary Containment |
| **Z-09** | Glassware Wash & Decon | 480 | 44.6 | $20'-0" \times 24'-0" \times 10'-0"$ | 3.05 m | 2–3 | 10–12 | Negative (-0.02" w.g.) | 16.0 kW | Miele Professional Lab Washers, Acid Baths, Convection Drying Ovens, EMD Millipore Milli-Q IQ 7003 RO/DI |
| **Z-10** | Circulation & Support Airlocks| 3,150 | 292.6 | Corridors (6'-0" W), Vestibules | 9'-0" | N/A | 4–6 | Positive (+0.03" w.g.) | 5.0 kW | 6'-0" Wide Egress Corridors, Emergency Showers/Eyewashes, Gowning Vestibules, Mechanical Chases |
| **TOTAL** | **Facility Master Envelope** | **12,000**| **1,114.8**| **100'-0" × 120'-0"** | — | **25–35**| — | Cascaded | **139.5 kW** | **Complete Integrated Pharmaceutical Chemistry Complex** |

---

## 1.2 Master Architectural Floor Plan Blueprint

```
+======================================================================================================================+
|                                      FACILITY MASTER PLAN: 120'-0" (36.58 m)                                         |
+------------------------------------------------------+---------------------------------------------------------------+
|  SCALE-UP PROCESS LAB [Z-02] (22' x 50' = 1100 sf)   |  MEDICINAL CHEMISTRY & SYNTHESIS [Z-01] (44' x 50' = 2200 sf) |
|  - Clear Height: 12'-0" (3.65 m)                     |  - Clear Height: 10'-0" (3.05 m)                              |
|  - [Walk-In Fume Hood #1] (8-ft x 4-ft walk-in)      |  - 8x 6-Foot Protector Premier Fume Hoods (Labconco)          |
|  - [Walk-In Fume Hood #2] (8-ft x 4-ft walk-in)      |  - Chemglass Dual-Bank Schlenk Manifolds                      |
|  - Radleys Reactor-Ready (1L-5L Jacketed Reactors)   |  - Biotage Initiator+ Organic Synthesis Microwaves            |
|  - Huber Unistat 405 Dynamic Chillers (-45 to +250C) |  - Buchi Rotavapor R-300 Stations with V-300 Pumps            |
|  - Syrris Asia Continuous Microfluidic Flow System   |  - MBraun UNIlab Pro Inert Atmosphere Glovebox (3-Glove)      |
|  - MBraun MB-SPS 800 Solvent Purification (5 Solvent)|  - Double-Sided Island Benches (60" D) on 11'-0" Grid Modules  |
|  - Floor Drain Trench (Epoxy-lined with containment) |  - Overhead Suspended Utility Carriers (N2, Ar, Vac, CDA)    |
|  - Door: 72" x 84" Double Equipment Door (Rolling)   |  - Door: 48" x 84" Single Egress Door with Vision Panel       |
+------------------------------------------------------+---------------------------------------------------------------+
|                               PRIMARY CLEAN CIRCULATION CORRIDOR (6'-0" / 1.83 m CLEAR WIDTH)                        |
|   <== EMERGENCY EGRESS ===== [Eyewash/Shower #1] ===================== [Eyewash/Shower #2] ===== EMERGENCY EGRESS ==>|
+--------------------------+---------------------------+-------------------------------+-------------------------------+
| SOLVENT DISPENSING [Z-08]| GLASS WASH / DECON [Z-09] | ANALYTICAL SEPARATIONS [Z-03] | MASS SPECTROMETRY CORE [Z-04] |
| (20' x 22' = 440 sf)     | (20' x 24' = 480 sf)      | (33' x 40' = 1320 sf)         | (22' x 45' = 990 sf)          |
| - 15-20 ACH 100% Exhaust | - Miele Lab Washers (2x)  | - Agilent 1290 UHPLC (6x)     | - Thermo Orbitrap Exploris 240|
| - Type 90 Safety Cabs    | - Heavy Convection Ovens  | - Waters ACQUITY Premier UPLC | - Waters Xevo TQ-Absolute     |
| - Grounding busbar (1/4")| - Base/Acid Bath Hood     | - Waters ACQUITY UPC² (SFC)   | - Agilent 8890/5977C GC-MS/MS |
| - Spill containment berm | - Milli-Q IQ 7003 System  | - Biotage Selekt Flash System | - Leybold / Edwards Dry Pumps |
| - Door: 42" Self-closing | - Door: 42" x 84" Door    | - Door: 48" x 84" Door        | - MS Noise Acoustic Cabinets  |
|                          |                           |                               | - 36" Rear Service Corridor   |
+--------------------------+---------------------------+-------------------------------+-------------------------------+
|                      INTERIOR SERVICE & UTILITY SPINE CORRIDOR (6'-0" / 1.83 m CLEAR WIDTH)                          |
+------------------------------------------------------+-------------------------------+-------------------------------+
|  HIGH-FIELD NMR SPECTROSCOPY VAULT [Z-05]            | SOLID-STATE CHARACTERIZATION  | PHARMA QUALITY CONTROL [Z-07] |
|  (22' x 35' = 770 sf)                                | [Z-06] (22' x 30' = 660 sf)   | (22' x 40' = 880 sf)          |
|  - Clear Ht: 13'-0" (3.96 m) Clear Under Beams       | - Bruker D8 Discover XRPD     | - Agilent 708-DS Dissolution  |
|  - Bruker Ascend 400 MHz (9.4 T) Magnet              | - Renishaw inVia Raman        | - Sotax AT50 Automated Tablet |
|  - Bruker Ascend 500 MHz (11.7 T) Magnet             | - Thermo Nicolet iS50 FTIR    | - ERWEKA Friability & Disint. |
|  - SampleJet 96-Well Robotic Changer (+600 mm)       | - TA Instruments DSC 2500     | - Metrohm 901/917 KF Titrator |
|  - Avance Neo OneBay Consoles                        | - TA Instruments TGA 5500     | - Mettler Toledo T9 Titrator  |
|  - DUAL INDEPENDENT CONCRETE INERTIA PADS (VC-D/E)   | - Optical Vibration Air Tables| - Anton Paar RheolabQC        |
|  - DIRECT ROOF QUENCH VENT DUCTS (NW 200 mm SS)      | - Polarimeter & Refractometer | - Rudolph Autopol VI Polarim. |
|  - 5-GAUSS LINE DEMARCATED FLOOR PERIMETER           | - Door: 48" x 84" Door        | - Door: 48" x 84" Door        |
|  - Door: 72" x 96" Non-Magnetic Equipment Pair       |                               |                               |
+======================================================+===============================+===============================+
```

---

## 1.3 Architectural Planning Module Grid Standards (11'-0" Standard)

The structural grid is based on an **11'-0" (3.35 m)** planning module, standardizing bench dimensions, aisle widths, overhead service drops, and structural column placement.

```
       <----------------------- 11'-0" (3.35 m) PLANNING MODULE ----------------------->
       +--------------------+------------------------------------+--------------------+
       |  BENCH ZONE 1      |           CLEAR AISLE ZONE         |  BENCH ZONE 2      |
       |  Depth: 30" (762mm)|           Width: 66" (1676 mm)     |  Depth: 30" (762mm)|
       |  (or Island Half)  |       [Min. Code: 60" / 1524 mm]   |  (or Island Half)  |
       +--------------------+------------------------------------+--------------------+
       | [Under-Bench Cab]  |   <== 2 Chemists Working Back-to-Back ==> [Under-Bench Cab]  |
       | [6" Utility Chase] |       <== ADA 60" Turning Circle ==>  | [6" Utility Chase] |
       +--------------------+------------------------------------+--------------------+
```

### Dimensional Calculations
1. **Perimeter Wall Bench Envelope**:
   - Countertop working depth: $30.0" \ (762\text{ mm})$.
   - Wall utility chase / plumbing riser: $6.0" \ (152\text{ mm})$.
   - Total bench envelope: $36.0" \ (914\text{ mm})$ from wall face.
2. **Double-Sided Center Island Bench**:
   - Double countertop depth: $2 \times 30.0" = 60.0" \ (1524\text{ mm})$.
   - Central utility chase / reagent rack spine: $12.0" \ (305\text{ mm})$.
   - Total island envelope: $72.0" \ (1829\text{ mm})$ overall width.
3. **Aisle Clearances (ADA & NFPA 45 Compliance)**:
   - Clear aisle width between opposing countertops: **$66.0" \ (1676\text{ mm} \ / \ 5.5\text{ ft})$**.
   - Minimum code clearance (NFPA 45 Section 5.3): $60.0" \ (1524\text{ mm} \ / \ 5.0\text{ ft})$ clear.
   - Permits two chemists working back-to-back while allowing a full $60" \ (1524\text{ mm})$ ADA 360° wheelchair turning diameter and the passage of a $24" \times 36"$ mobile solvent cart.
4. **Structural Bay Integration**:
   - Building structural columns are placed on a **33'-0" × 33'-0" (10.05 m × 10.05 m)** column grid.
   - Exactly three (3) 11'-0" planning modules fit cleanly within each structural bay, placing columns entirely within bench utility chases and eliminating any aisle obstruction.

---

# SECTION 2: SPECIALIZED ARCHITECTURAL SUITE ENGINEERING

## 2.1 High-Field NMR Vault Architectural Specifications

The NMR Vault houses Bruker Ascend 400 MHz (9.4 T) and 500 MHz (11.7 T) superconducting magnets with Prodigy CryoProbes and a 96-well automated SampleJet system.

```
       +========================================================================+
       |             NMR VAULT ARCHITECTURAL VERTICAL SECTION                   |
       +========================================================================+
Roof   ==========================================================================
Line         |                                           ^
             | [NW 200 mm Stainless Quench Duct]         | Quench Exhaust
             | (Vibration-isolated bellow coupling)      | >= 3.0 m above roof
             |                                           v
Ceiling -----+-------------------------------------------------------------------
Deck         |                                           ^
             |                                           |
             |   +-----------------------------------+   | Clear Vertical Height
             |   | SAMPLEJET 96-WELL TUBE CHANGER    |   | >= 3.96 m (13'-0")
             |   +-----------------------------------+   | (Permits 1.2 m rigid
             |   | BRUKER ASCEND 500 MHz CRYOSTAT    |   |  liquid He transfer
             |   | Height: 2250 mm; Diam: 795 mm     |   |  siphon insertion)
             |   | Weight: 740 kg operating mass     |   |
             |   +-----------------------------------+   |
             |   | TRIPOD STAND (Dia: 1295 mm)       |   v
Finished ====+===+===================================+===========================
Floor        |   | [Elastomeric 50mm Isolation Joint]| [5-Gauss Line Floor Stripe]
Slab         |   +-----------------------------------+
             |   | MONOLITHIC INERTIA BLOCK (VC-D/E) |
Sub-Base     ====+===================================+===========================
```

### Technical Design Criteria
1. **Vertical Ceiling Clearance**:
   - Static magnet height (Ascend 500): $2,250\text{ mm}$; Tripod foot circle: $\varnothing 1,295\text{ mm}$.
   - SampleJet automated sample changer mounted on top: $+600\text{ mm}$.
   - Rigid Liquid Helium Transfer Siphon (Bruker P/N 53962): $1,200\text{ mm}$ vertical leg length.
   - **Minimum Clear Height Under Structure**: **$3.96\text{ m} \ (13'-0")$**. Overhead clearance must be maintained with zero crossing of HVAC ducts or conduit directly above the magnet.
2. **Vibration-Isolated Foundation Slabs (VC-D / VC-E Criteria)**:
   - Routine NMR resolution requires **VC-D ($6.25\ \mu\text{m/s}$ RMS velocity, 1–80 Hz)**; Prodigy CryoProbe 2D/3D runs demand **VC-E ($3.12\ \mu\text{m/s}$)**.
   - **Monolithic Concrete Inertia Blocks**: Two independent foundations measuring **$3.0\text{ m W} \times 3.0\text{ m L} \times 0.45\text{ m D} \ (10'-0" \times 10'-0" \times 18")$** of 4,000 PSI reinforced concrete poured on bedrock.
   - **Continuous Perimeter Isolation Joint**: A **$50.0\text{ mm} \ (2.0")$** air gap separates each block from the building floor slab, lined with closed-cell neoprene isolation board and capped with chemical-resistant polyurethane sealant. Zero structural bridging is permitted.
3. **5-Gauss Magnetic Safety Perimeter**:
   - Radial 5-Gauss stray field: **$0.50\text{ m}$** (400 MHz) and **$0.60\text{ m}$** (500 MHz); Axial boundary: **$1.00\text{ m}$** (400 MHz) and **$1.20\text{ m}$** (500 MHz).
   - Marked with a 4" wide yellow/black reflective epoxy floor stripe.
   - **Non-Ferrous Envelope**: All studs, conduits, casework, hinges, and fasteners within the room are non-magnetic (AISI 304/316 SS, 6063-T6 aluminum, brass).
4. **Direct Roof Quench Vent Ducting**:
   - Liquid helium ($135\text{ L}$) expands by **757× at STP**, releasing over **$102,000\text{ L}$** of cold helium gas in $< 60\text{ seconds}$ during a magnet quench.
   - **Duct Sizing**: Dedicated **$\text{NW } 200\text{ mm} \ (8.0" \text{ ID})$** seamless 304 stainless steel duct with multi-ply axial bellows ($\pm 35\text{ mm}$ travel) connecting to the cryostat burst disc.
   - **Discharge Head**: Discharges **$\ge 3.0\text{ m} \ (10.0\text{ ft})$** above the roof parapet, angled downward at $45^\circ$ with a stainless bird screen and spring-loaded weather flapper. Must be located $\ge 6.0\text{ m} \ (20.0\text{ ft})$ from any building air intake.
   - **Oxygen Depletion Monitoring**: Dual electrochemical $O_2$ sensors (low-level $1.5\text{ m}$ AFF for nitrogen; high-level $3.5\text{ m}$ AFF for helium) interlocked with an emergency $25\text{ ACH}$ purge fan.

---

## 2.2 Mass Spectrometry Core Acoustic & Thermal Architecture

The Mass Spectrometry Core houses three high-vacuum, high-heat instrument stacks (Orbitrap Exploris 240, Waters Xevo TQ-Absolute, Agilent 8890 GC-MS/MS).

```
       +========================================================================+
       |             MASS SPECTROMETRY WORKSTATION & SERVICE AISLE              |
       +========================================================================+
Ceiling -------------------------------------------------------------------------
              |                                            |
              | [Perforated Ceiling Diffuser]              | [Dedicated MS Exhaust]
              | (Low-velocity laminar supply: 55 fpm)      | (Direct foreline/source)
              |                                            |
Workdeck =====+============================================+=====================
              | [ANALYTICAL MASS SPECTROMETER]             | 36" REAR SERVICE AISLE
              | (Thermo Orbitrap / Waters TQ-Absolute)     | (Clear access for:
              | Seated on 1.25" Trespa TopLab Worktop      |  - Nitrogen feeds
              +--------------------------------------------+  - Roughing pump hoses
              | SEFA 8M Welded Steel Cabinet Frame         |  - Exhaust ducting
              | +----------------------------------------+ |  - IEC C19 power cords)
              | | MS NOISE ACOUSTIC PUMP ENCLOSURE       | |
Floor ========+=| - 20 dBA Sound Attenuation Foam        |=|=====================
              | | - Independent Overheat Fan (35C Alarm) | |
              | | - Oil Mist Filter ducted to Exhaust    | |
              | +----------------------------------------+ |
              +--------------------------------------------+
```

### Technical Design Criteria
1. **Acoustic Isolation (Target: NC-40 to NC-45, $< 50\text{ dBA}$)**:
   - Mechanical roughing pumps (Leybold EcoDry 65 Plus, Edwards nXL200i) generate $62\text{--}74\text{ dBA}$ each.
   - **Wall Assembly**: 5/8" Type X gypsum on 3-5/8" steel studs with 3" mineral wool sound batts (STC rating 48).
   - **Acoustic Wall Panels**: 2" thick fabric-wrapped fiberglass panels (NRC 0.85) covering $\ge 40\%$ of wall area.
   - **Under-Bench Enclosures**: Pumps are enclosed in **MS Noise / Sonation certified acoustic cabinets** with viscoelastic dampening foam, providing a **$15\text{ to }20\text{ dBA}$ reduction**. Cabinets feature dual ball-bearing cooling fans ($120\text{ m}^3\text{/h}$) and an over-temperature alarm buzzer/strobe set at **$35.0^\circ\text{C} \ (95^\circ\text{F})$**.
2. **Thermal Load & HVAC Management**:
   - Total sensible heat load: **$16.25\text{ kW} \ (55,445\text{ BTU/hr} \ / \ 4.6\text{ Tons})$**.
   - Room temperature maintained at **$20.0^\circ\text{C} \pm 1.0^\circ\text{C} \ (68.0^\circ\text{F} \pm 1.8^\circ\text{F})$**; RH $40\%\text{--}50\%$ non-condensing.
   - Air delivery via perforated ceiling diffusers with laminar discharge velocity $\le 55\text{ fpm} \ (0.28\text{ m/s})$ to eliminate drafts across ESI/APCI atmospheric ion sources.
3. **Dedicated 36" (914 mm) Rear Service Aisle**:
   - Benches are positioned 36" away from partition walls.
   - Allows direct, tool-free access to IEC C19 power lines, high-purity $N_2$ gas manifolds, and vacuum hoses without disturbing delicate spectrometer flight tubes.

---

# SECTION 3: CASEWORK, BENCHES & WORKSURFACES (SEFA STANDARDS)

## 3.1 Laboratory Casework Typologies & Load Ratings

All casework conforms to **SEFA 8M (Metal Casework)**, **SEFA 2 (Installation)**, and **SEFA 10 (Adaptable Systems)**.

```
       +-------------------------------------------------------------------------+
       |               BENCH TYPOLOGY & DIMENSIONAL ARCHITECTURE                 |
       +-------------------------------------------------------------------------+
       1. PERIMETER WALL BENCH             2. DOUBLE-SIDED CENTER ISLAND BENCH
          (Depth: 30" / 762 mm)               (Depth: 60" / 1524 mm Overall)
       
       +--------------------------+        +-------------------+-------------------+
       | Worktop: 30" (762 mm)    |        | Worktop: 30" (762)| Worktop: 30" (762)|
       +--------------------------+        +-------------------+-------------------+
       | Under-Bench Cabinet      |        | Base Cabinet A    | Base Cabinet B    |
       | Depth: 22" (559 mm)      |        | Depth: 22" (559)  | Depth: 22" (559)  |
       | [6" Rear Utility Chase]  |        +-------------------+-------------------+
       +--------------------------+        |  <== 12" Central Utility Chase ==>   |
       | Leveling Foot (0-50mm)   |        +---------------------------------------+
       +--------------------------+        | Foot Levelers     | Foot Levelers     |
                                           +-------------------+-------------------+
```

### Bench Typology Comparison

| Parameter | 1. Perimeter Wall Bench | 2. Double-Sided Island Bench | 3. Mobile Instrument Cart | 4. Heavy-Duty Vibration Table |
| :--- | :--- | :--- | :--- | :--- |
| **Governing Standard** | SEFA 8M / SEFA 2 | SEFA 8M / SEFA 10 | SEFA 10 / SEFA 8M | ISO 10816 / VC-D |
| **Nominal Depth** | $30.0" \ (762\text{ mm})$ | $60.0" \ (1524\text{ mm})$ total | $30.0" \text{ to } 36.0" \ (762\text{--}914\text{ mm})$ | $36.0" \text{ to } 42.0" \ (914\text{--}1067\text{ mm})$ |
| **Modular Widths** | $36", 48", 60", 72" \ (0.9\text{--}1.8\text{ m})$ | $72", 96", 120", 144" \ (1.8\text{--}3.6\text{ m})$| $36", 48", 60", 72" \ (0.9\text{--}1.8\text{ m})$ | $48", 60" \ (1.2\text{--}1.5\text{ m})$ |
| **Working Height** | $36.0" \ (914\text{ mm})$ standing | $36.0" \ (914\text{ mm})$ standing | $30.0" \text{ to } 36.0" \ (762\text{--}914\text{ mm})$ | $30.0" \ (762\text{ mm})$ sitting |
| **Frame Material** | 16-ga welded C-frame / Base cab | Heavy structural steel H-frame | 2" × 2" 11-ga welded tubular steel | 4" cast steel frame w/ air springs |
| **Static Load Rating**| $2,000\text{ lbs} \ (907\text{ kg})$ per unit | $4,000\text{ lbs} \ (1814\text{ kg})$ double-sided| $2,000\text{ lbs} \ (907\text{ kg})$ dynamic | $1,500\text{ lbs} \ (680\text{ kg})$ floating |
| **Mobility / Glides** | 3/8"-16 threaded rubber feet | 1/2"-13 threaded rubber feet | 4" poly locking swivel casters | Pneumatic self-leveling isolators |
| **Primary Location** | Synthesis, QC, Glass Wash | Synthesis Core, Prep Suites | Analytical LC-MS, GC, SFC | Confocal Raman, Analytical Micro |

---

## 3.2 Working Heights & Ergonomics

1. **Standing Work Height: 36.0" (914 mm) AFF**:
   - Standard for Wet Synthesis, Fume Hoods, Scale-Up Processing, and Glass Wash.
   - Centers hand manipulation $100\text{--}150\text{ mm}$ below standing elbow height, preventing lumbar fatigue. Toe kick: $4.0" \ (102\text{ mm})$ high $\times 3.0" \ (76\text{ mm})$ deep.
2. **Sitting Work Height: 30.0" (762 mm) AFF**:
   - Standard for Mass Spec terminals, HPLC run stations, Microscopy, and Titration.
   - Knee clearance: Minimum $27.0" \ (685\text{ mm})$ vertical height, $30.0" \ (762\text{ mm})$ width, $19.0" \ (483\text{ mm})$ depth.
3. **Motorized Adjustable Height (SEFA 10 Multi-User ADA Benches)**:
   - Travel range: Continuous adjustment from **$28.0" \text{ to } 44.0" \ (711\text{ to } 1118\text{ mm})$ AFF**.
   - Lift capacity: $1,000\text{ lbs} \ (454\text{ kg})$ dynamic, with anti-pinch sensors and memory presets.

---

## 3.3 Worksurface Materials: Solid Epoxy Resin vs. Trespa TopLab Plus

Countertops are selected strictly under **SEFA 3 (Work Surfaces)**.

```
       +-------------------------------------------------------------------------+
       |           WORKTOP DETAIL: 1.0" (25.4 mm) MARINE ANTI-SPILL EDGE         |
       +-------------------------------------------------------------------------+
                    1/4" (6.35 mm) Raised Marine Edge
                    +--+                                         Worktop Surface
                    |  | 1/2" (12.7 mm) Coved Radius            /
       +------------+  +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
       |                                                        |
       |  MONOLITHIC SOLID EPOXY OR TRESPA TOPLAB PLUS PHENOLIC | 1.0" (25.4 mm)
       |                                                        |
       +--------------------------------------------------------+
```

### Material Specification & SEFA 3 Performance

| Property | Solid Epoxy Resin (Durcon) | Trespa TopLab Plus (Phenolic) | Application Rule |
| :--- | :--- | :--- | :--- |
| **Composition** | Monolithic vacuum-cast epoxy, silica, hardeners | Cellulose fibers + thermosetting resin (EBC layer) | Epoxy is homogeneous; Phenolic has non-porous EBC skin |
| **Thickness** | $1.0" \ (25.4\text{ mm})$ standard | $1.0" \ (25.4\text{ mm})$ standard | $1.0"$ standard across entire complex |
| **Weight** | $12.5\text{ lbs/ft}^2 \ (61.0\text{ kg/m}^2)$ | $9.1\text{ lbs/ft}^2 \ (44.4\text{ kg/m}^2)$ | **Trespa is 27% lighter** (ideal for mobile carts) |
| **Flexural Strength** | $15,000\text{ PSI}$ | $23,000\text{ PSI}$ | **Trespa has 53% higher flexural strength** |
| **Heat Resistance** | **Continuous $350^\circ\text{F} \ (177^\circ\text{C})$**; flame-resistant | Up to $284^\circ\text{F} \ (140^\circ\text{C})$; blister under open flame | **Epoxy mandatory for Fume Hoods & Hotplates** |
| **Thermal Shock** | Excellent ($LN_2$ and dry ice direct exposure) | Good | **Epoxy preferred for Cryo & Synthesis** |
| **Marine Spill Edge** | Integrally molded $1/4" \ (6.35\text{ mm})$ rim | CNC-machined $1/4" \ (6.35\text{ mm})$ rim | Contains **1.5 gallons spill per 10 linear feet** |
| **Sink Integration** | Seamless monolithic epoxy drop-in/undermount | Undermount sealed with elastomeric polymer | Epoxy provides seamless welded joints |

- **SEFA 3 49-Chemical Reagent Resistance**: Both materials achieve Rating 0 (No Effect) or Rating 1 (Slight Buffable Discoloration) across 98% Sulfuric Acid, 70% Nitric Acid, 48% HF, 50% NaOH, Aqua Regia, DCM, THF, DMF, Acetone, and Ethyl Acetate.
- **Drop-In Cup Sinks**: Oval ($3" \times 6"$ or $4" \times 7"$, $4"$ deep) and round ($\varnothing 4"$) cast epoxy sinks with male $1.5"$ NPS drain stem, fitted with polypropylene P-traps connected to acid-waste drainage.

---

## 3.4 Overhead Modular Service Carriers (SEFA 10)

Synthesis and analytical islands use ceiling-suspended service grids to eliminate floor and benchtop cable clutter.

```
       +========================================================================+
       |             SEFA 10 SUSPENDED CEILING UTILITY CARRIER                  |
       +========================================================================+
Deck   ==========================================================================
             |  1/2" Steel Threaded Hanger Rods at 4'-0" Centers            |
             v                                                              v
       +------------------------------------------------------------------------+
       | STRUCTURAL STEEL UNISTRUT P1001 / HEAVY ALUMINUM CARRIER GRID (SEFA 10)|
       +------------------------------------------------------------------------+
             |                     |                     |                |
             | N2 / Ar / He / Vac  | 120V/208V Power     | Cat6A Data     | Exhaust
             | Quick-Connect Drop  | Retractable Reels   | Shielded Drops | Snorkel
             v                     v                     v                v
       +------------------------------------------------------------------------+
       | ARTICULATED SERVICE PENDANT / QUICK-DISCONNECT SERVICE MANIFOLD BOX   |
       +------------------------------------------------------------------------+
             | Quick-Connects      | Twist-Lock NEMA     | RJ45 Patch     | 3" Arm
             | (Swagelok QC/QF)    | (L5-20R / L6-30R)   | (10 Gbps)      | (Polypro)
             v                     v                     v                v
       ==========================================================================
       LABORATORY WORKBENCH DECK (Completely Clean & Free of Umbilical Clutter)
```

1. **Structural Suspension**: Unistrut P1001 heavy channel suspended via $1/2"$ Grade 5 rods on a $4'-0" \times 4'-0"$ grid. Load rating: $150\text{ lbs/linear ft} \ (223\text{ kg/m})$.
2. **Drop-Down Quick-Connect Gases**: Keyed **Swagelok QC/QF Series** with color-coded ID rings per SEFA 7 ($N_2$: orange, $Ar$: brown, $He$: silver, CDA: blue, Vacuum: yellow).
3. **Electrical Retractable Reels & Drops**: NEMA 5-20R ($120\text{V}, 20\text{A}$ GFCI), NEMA L5-20R ($120\text{V}, 20\text{A}$ Twist-Lock), NEMA L6-20R ($208\text{V}, 20\text{A}$), NEMA L6-30R ($208\text{V}, 30\text{A}$).
4. **Data Drops**: Shielded Cat6A RJ45 jacks ($10\text{ Gbps}$) isolated in grounded metallic raceways.

---

## 3.5 SEFA 8M Welded Steel Base Cabinetry Specifications

```
       +========================================================================+
       |             SEFA 8M WELDED STEEL BASE CABINET ARCHITECTURE             |
       +========================================================================+
       
          16-Gauge Structural Box Frame Corner Gussets
          +-------------------------------------------------------------+
          | [Top Frame Rail: 16-ga welded channel]                      |
          |                                                             |
          |  +-------------------------------------------------------+  |
          |  | FULL-EXTENSION DRAWER (SEFA 8M: 100 lb Dynamic Load)  |  |
          |  | - 18-ga CRS body; 150 lb ball-bearing slides          |  |
          |  +-------------------------------------------------------+  |
          |                                                             |
          |  +---------------------------+ +-------------------------+  |
          |  | DOUBLE-WALL DOOR (Left)   | | DOUBLE-WALL DOOR (Right)|  |
          |  | - 18-ga outer shell       | | - 18-ga outer shell     |  |
          |  | - 20-ga inner pan liner   | | - 20-ga inner pan liner |  |
          |  | - Sound-deadening core    | | - Sound-deadening core  |  |
          |  | - 5-knuckle 304SS hinges  | | - 5-knuckle 304SS hinges|  |
          |  +---------------------------+ +-------------------------+  |
          |                                                             |
          |  +-------------------------------------------------------+  |
          |  | REMOVABLE BACK PANEL (Two-piece 18-ga interlocking)   |  |
          |  | [TESTED & CERTIFIED TO SUPPORT 2,000 LB LOAD REMOVED] |  |
          |  +-------------------------------------------------------+  |
          |                                                             |
          | [Bottom Pan: 18-ga with 4" x 3" radiused toe-kick]          |
          +-------------------------------------------------------------+
             |                                                       |
             v                                                       v
          [Leveling Stem: 3/8"-16]                                [Leveling Stem: 3/8"-16]
          (Vulcanized Chloroprene Non-Skid Rubber Foot, 0-50 mm adjustment)
```

1. **Heavy-Gauge Metallurgy**:
   - Structural corner uprights, top rails, and gussets: **16-gauge ($1.52\text{ mm}$) cold-rolled steel (CRS)**.
   - Outer wrapper, bottom pans, drawer bodies, intermediate shelves: **18-gauge ($1.21\text{ mm}$) CRS**.
   - Double-wall doors: 18-gauge outer shell + **20-gauge ($0.91\text{ mm}$) inner pan** filled with acoustic mineral wool.
2. **Finishing**: Electrostatically applied thermoset epoxy-polyester powder coat ($1.8\text{--}2.5\text{ mils}$), cured at $375^\circ\text{F} \ (190^\circ\text{C})$ for 20 minutes.
3. **Suspension & Hardware**:
   - Progressive full-extension ball-bearing slides rated for **$100\text{ lb} \ (45.4\text{ kg})$ dynamic load cycled 50,000 times**; static load tested to **$150\text{ lbs}$** at $13"$ extension.
   - 0.095" thick Type 304 stainless steel 5-knuckle institutional hinges tested to **$200\text{ lbs}$ vertical load** and 100,000 swing cycles.
   - Four $3/8"-16$ threaded leveling bolts with vulcanized rubber feet ($0\text{--}50\text{ mm}$ range).
4. **Removable Back Panels (The SEFA 8M Pass/Fail Proof)**:
   - Two-piece interlocking 18-gauge back panels removable without tools in $< 15\text{ seconds}$ to access plumbing chases.
   - **SEFA 8M Section 4.1 Certification**: Supported only on leveling feet, the cabinet is loaded with **$2,000\text{ lbs} \ (907.2\text{ kg})$ for 24 hours with the back panel completely removed**, proving that the 16-gauge frame is 100% self-supporting.

---

# SECTION 4: HVAC, CONTAINMENT & AIR HANDLING INFRASTRUCTURE

## 4.1 100% Outside Air Once-Through Philosophy

Under **ANSI/AIHA Z9.5** and **NFPA 45 Section 8.2**, laboratory air may contain fugitive solvent vapors, toxic particulates, or reactive gases. **Zero recirculation of laboratory air is permitted.**
- Air Handling Units (AHUs) supply 100% conditioned outside air, filtered through MERV 8 pre-filters and MERV 14 final filters.
- Air is fully exhausted outdoors through dedicated high-plume laboratory exhaust stacks.

```
       +========================================================================+
       |             FACILITY DIRECTIONAL AIRFLOW PRESSURE CASCADE              |
       +========================================================================+
       
       [Offices / Primary Clean Corridor]      (+0.030" w.g. Positive Datum)
                      |
                      | Air Infiltration across door sweeps
                      v
       [Analytical Separation & QC Suites]     (-0.010" to -0.020" w.g. Moderate Neg)
                      |
                      | Air Infiltration
                      v
       [Medicinal Chemistry & Synthesis Core]  (-0.030" to -0.050" w.g. High Negative)
                      |
                      | Air Infiltration
                      v
       [Flammable Solvent Vault & Waste]       (-0.075" to -0.080" w.g. Max Negative)
                      |
                      +======> 100% Dedicated Exhaust via Strobic Tri-Stack (>3000 fpm)
```

### Complete Facility Air Balance & Pressure Cascade Schedule

| Zone ID | Functional Suite | Area ($ft^2$) | Supply CFM | Hood Exhaust CFM | General Exhaust CFM | Offset CFM | Room Pressure | Differential ($\Delta P$) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Z-10** | Egress Corridors | 3,150 | 2,800 | 0 | 2,200 | +600 | Positive | $+0.030"\text{ w.g.}$ |
| **Z-05** | High-Field NMR Vault | 770 | 1,400 | 0 | 1,200 | +200 | Positive | $+0.020"\text{ w.g.}$ |
| **Z-06** | Solid-State Characterization| 660 | 900 | 0 | 800 | +100 | Positive | $+0.015"\text{ w.g.}$ |
| **Z-07** | Pharma QC Lab | 880 | 1,200 | 0 | 1,100 | +100 | Positive | $+0.010"\text{ w.g.}$ |
| **Z-03** | Analytical Separation Suite | 1,320 | 1,800 | 0 | 2,000 | -200 | Negative | $-0.015"\text{ w.g.}$ |
| **Z-04** | Mass Spectrometry Core | 990 | 1,500 | 0 | 1,750 | -250 | Negative | $-0.020"\text{ w.g.}$ |
| **Z-09** | Glassware Wash & Decon | 480 | 800 | 0 | 1,000 | -200 | Negative | $-0.025"\text{ w.g.}$ |
| **Z-01** | Medicinal Chemistry | 2,200 | 6,800 | 6,000 (8 hoods)| 1,600 | -800 | Negative | $-0.035"\text{ w.g.}$ |
| **Z-02** | Scale-Up Process Lab | 1,100 | 4,200 | 3,200 (2 walk-in)| 1,600 | -600 | Negative | $-0.050"\text{ w.g.}$ |
| **Z-08** | Solvent Dispensing & Waste | 440 | 600 | 0 | 950 | -350 | Negative | $-0.075"\text{ w.g.}$ |
| **TOTAL** | **Entire Facility Complex**| **12,000**| **22,000** | **9,200** | **14,200** | **-1,400 net**| Cascaded | — |

- **Room Air Offset Formula**:
  $$Q_{\text{offset}} = 2610 \times A_{\text{leak}} \times \sqrt{\Delta P}$$
  Where $A_{\text{leak}}$ is effective crack area ($ft^2$) and $\Delta P$ is pressure differential ($"\text{ w.g.}$).

---

## 4.2 Variable Air Volume (VAV) & High-Speed Venturi Air Valves

Each fume hood, walk-in enclosure, and room supply/exhaust point is controlled via **Phoenix Controls / AccuValve high-speed Venturi air valves**:
- **Actuator Speed**: High-speed electromechanical actuator adjusts cone position across full range in **$< 1.0\text{ second}$**, tracking rapid sash opening movements without velocity lag.
- **Constant Face Velocity**: Maintains **$100\text{ fpm} \pm 10\text{ fpm} \ (0.51\text{ m/s})$** across sash openings per OSHA 1910.1450 and ANSI/AIHA Z9.5.
- **Fume Hood Operating CFM**:
  - 6-Foot Hood at 18" operating sash: **$750\text{ CFM}$**.
  - 6-Foot Hood at 28" maximum setup sash: **$1,167\text{ CFM}$**.
  - Minimum purge / setback CFM: **$315\text{ CFM}$** ($25\text{ CFM/ft}^2$ internal worktop).
- **Turndown Ratio**: 5:1 turndown ratio enables significant energy reduction during unoccupied periods.

---

## 4.3 High-Plume Laboratory Exhaust Stacks & Ductwork

```
       +========================================================================+
       |             HIGH-PLUME DILUTION EXHAUST STACK SYSTEM                   |
       +========================================================================+
       
                                 |  |  ^ High-Velocity Plume (> 3000 fpm / 15 m/s)
                                 |  |  | Effective Plume Height: 50-80 ft above roof
                             +---+  +---+
                             |  NOZZLE  |
                             +---+  +---+
                                 |  |
                            /----+  +----\
                           /  BYPASS PLEN  \ <== Outside Bypass Air Damper (Modulating)
                          +-----------------+
                          | MIXING CHAMBER  |
                          +-----------------+
                          | STROBIC FAN (3x)| Triplex N+1 Redundant Array
                          +-----------------+
                          | ROOF CURB (10') | >= 10'-0" (3.0 m) Above Roof Parapet
       ===================+=================+===================================
       ROOF PENETRATION
                          |
                          | WELDED 316L STAINLESS STEEL DUCT (Liquid-Tight)
                          | ETFE / HALAR COATED FOR ACID/CORROSIVE RUNS
                          v
```

1. **Exhaust Fans**: Triplex **Strobic Air Tri-Stack / Greenheck Vektor-MD** high-plume dilution fans in an N+1 redundant configuration.
2. **Discharge Velocity**: Constant nozzle discharge velocity of **$\ge 3,000\text{ fpm} \ (15.24\text{ m/s})$**, propelling the chemical exhaust plume $50\text{--}80\text{ ft}$ into the atmosphere to completely prevent re-entrainment into building air intakes.
3. **Physical Stack Height**: Terminates at least **$10'-0" \ (3.05\text{ m})$** above the highest roof parapet.
4. **Duct Metallurgy**:
   - General & Solvent Exhaust: Continuous **welded 316L stainless steel (16-gauge / 18-gauge)** with liquid-tight longitudinal seams.
   - Corrosive & Acid Exhaust: Heavy-gauge stainless steel coated internally with **$20\text{--}30\text{ mils}$ of ETFE (Ethylene Tetrafluoroethylene / Teflon) or Halar (ECTFE)**.

---

# SECTION 5: MEP UTILITIES DISTRIBUTION INFRASTRUCTURE

## 5.1 High-Purity Compressed Gases & Cryogenic Utilities

```
       +========================================================================+
       |             CENTRAL HIGH-PURITY GAS DISTRIBUTION P&ID                  |
       +========================================================================+
       
       OUTSIDE TANK FARM / BULK CYLINDER ROOM            INSIDE FACILITY (ZONES 01-07)
       
       [Bulk Cryogenic LN2 Tank: 3000 Gal]
             |
             | Vacuum-Jacketed (VJ) SS Pipe (1" ID)
             v
       [Phase Separator Box] ==========================> Prodigy CryoProbe / MS Core
       
       [CONCOA 529 Auto-Changeover Manifold]
       - UHP Nitrogen (99.999%) ------------------------> 80 PSI via 3/8" Orbit-Weld SS
       - UHP Argon (99.9999%) --------------------------> 60 PSI via 1/4" Orbit-Weld SS
       - Research Helium (99.9999%) --------------------> 80 PSI via 1/4" Orbit-Weld SS
       - Hydrogen Fuel (99.999%) -----------------------> 40 PSI via 1/4" Orbit-Weld SS
       - Compressed Dry Air (CDA, -40C Dewpoint) -------> 90 PSI via 1/2" 316L SS Pipe
```

1. **Bulk Cryogenic Liquid Nitrogen ($LN_2$)**:
   - $3,000\text{ Gallon}$ exterior vacuum-insulated bulk storage vessel ($250\text{ PSI}$ MAWP).
   - Distributed through **rigid vacuum-jacketed (VJ) Type 304L stainless steel piping** ($1.0" \text{ inner}, 3.0" \text{ outer}$) with multi-layer aluminized Mylar super-insulation ($< 1.0\times 10^{-4}\text{ Torr}$).
   - Supplies the Bruker Prodigy CryoProbe, high-resolution mass specs, and low-temperature chemistry baths.
2. **Ultra-High Purity (UHP) Gas Manifolds**:
   - Automated dual-bank changeover manifolds (**CONCOA 529 Series / Swagelok**) with pneumatic purge valves and digital cylinder pressure telemetry.
   - Piping material: **Orbital-welded, electropolished Type 316L stainless steel tubing** with interior surface roughness $R_a \le 15\ \mu\text{in} \ (0.38\ \mu\text{m})$, helium leak-tested to $< 1.0\times 10^{-9}\text{ atm}\cdot\text{cc/s}$.
   - Terminal connections: Swagelok VCR metal gasket face seal fittings or double-ferrule compression fittings.
3. **Compressed Dry Air (CDA)**:
   - Duplex oil-free rotary scroll compressors with desiccant dryers and particulate filters meeting **ISO 8573-1 Class 1:2:1** (pressure dewpoint $-40^\circ\text{C}$, oil content $< 0.01\text{ mg/m}^3$).

---

## 5.2 Laboratory Vacuum Systems

1. **Central House Vacuum**:
   - Triplex **Busch Mink claw or dry rotary vane skid** delivering continuous $24"\text{ to }28"\text{ Hg} \ (100\text{ to }50\text{ mbar})$ vacuum.
   - Used for Buchner filtrations, rotary evaporator condenser cooling, and vacuum desiccators.
2. **Localized Deep High-Vacuum Network**:
   - Dedicated chemical-resistant dry scroll pumps (Edwards nXDS15i / Leybold EcoDry) and dual-stage rotary vane pumps (< $1.0\times 10^{-3}\text{ mbar}$) located at point of use for Schlenk lines, freeze dryers, and mass spectrometers.

---

## 5.3 Laboratory Pure Water Systems (Type 2 Loop & POU Type 1)

```
       +========================================================================+
       |             PURE WATER GENERATION & RECIRCULATION LOOP                 |
       +========================================================================+
       
       MUNICIPAL WATER ==> [Carbon / Softener] ==> [RO / EDI Skid] ==> [Type 2 Storage: 500 Gal]
                                                                                |
       ====================== BCF PVDF CIRCULATION LOOP ========================+
       | Continuous Turbulent Velocity: 1.5 m/s (Re > 10,000)
       | Inline 254 nm UV Bactericidal Destruction & 0.22 um Filtration
       |
       +---> Glassware Washers (Miele G 7895)
       +---> Jacketed Reactor Circulator Reservoir Make-Up
       +---> [POINT-OF-USE MILLI-Q IQ 7000 POLISHERS] 
                 |
                 +===> TYPE 1 ULTRAPURE WATER:
                       - Resistivity: 18.2 MOhm-cm at 25C
                       - Total Organic Carbon (TOC): < 5 ppb
                       - Bacteria: < 0.01 CFU/mL
                       - Endotoxin: < 0.001 EU/mL
```

- **Loop Construction**: Bead-and-Crevice-Free (**BCF**) infrared butt-welded **PVDF-HP (Polyvinylidene Fluoride - High Purity)** piping.
- **Zero Dead-Leg Mandate**: Take-off zero-dead-leg valves maintain $L/D \le 2$ (length of stub divided by diameter).

---

## 5.4 Chemical Acid-Waste Drainage & Neutralization Skid

```
       +========================================================================+
       |             ACID-WASTE DRAINAGE & DUAL-STAGE pH TREATMENT              |
       +========================================================================+
       
       CUP SINKS / HOOD DRAINS / GLASS WASH
             |
             | Flame-Retardant Polypropylene (PP-FR) Electrofusion-Welded Pipe
             v
       +------------------------------------------------------------------------+
       | DUAL-STAGE ACTIVE pH NEUTRALIZATION SKID                               |
       | - Stage 1 (Coarse pH Reaction Tank): Continuous mechanical turbine mix |
       | - Stage 2 (Fine pH Polishing Tank): Submersible dual-junction pH probe  |
       | - Dosing: 50% NaOH (Caustic) & 98% H2SO4 (Sulfuric Acid)               |
       | - Failsafe 3-Way Motorized Divert Valve (Recirculates if pH <6 or >9)  |
       +------------------------------------------------------------------------+
             | Effluent pH: 6.5 to 8.5
             v
       MUNICIPAL SANITARY SEWER DISCHARGE
```

- **Drainage Metallurgy**: Schedule 40 **Flame-Retardant Polypropylene (PP-FR)** with electrofusion welded joints (Orion / Georg Fischer) or PVDF piping for organic solvent drain lines.
- **Automated Neutralization Skid**: Microprocessor-controlled chemical dosing skid ensuring zero effluent discharges outside the municipal permit band ($6.0 \le \text{pH} \le 9.0$).

---

## 5.5 Electrical Power Infrastructure & Clean Power Quality

```
       +========================================================================+
       |             FACILITY ELECTRICAL DISTRIBUTION HIERARCHY                 |
       +========================================================================+
       
       480V 3-Phase Utility Feed ===> [K-20 Isolation Transformer] ===> Isolated Ground Panel
                                                                                   |
       +---------------------------------------------------------------------------+
       |
       +---> TIER 1: STANDARD UTILITY (White Receptacles)
       |     - 120V 20A GFCI every 24" along bench raceways
       |     - Non-critical vortexers, hotplates, balances, and lighting
       |
       +---> TIER 2: ISOLATED GROUND CLEAN POWER (Orange Receptacles w/ Green Triangle)
       |     - Dedicated isolated ground conductor direct to central grounding busbar
       |     - Eliminates harmonic distortion and electrical noise
       |     - Agilent 1290 UHPLC, Waters UPLC, Bruker XRPD, Raman, FT-IR
       |
       +---> TIER 3: EMERGENCY DIESEL GENERATOR + CENTRAL UPS (Red Receptacles)
             - 120 kVA Online Double-Conversion Static UPS (Zero transfer time)
             - Backed by 250 kW Cummins exterior diesel generator (auto-start < 10 s)
             - Bruker NMR consoles & CryoProbes, Mass Spec roughing pumps,
               -80C ultra-low freezers, fume hood exhaust fans, and life safety BMS
```

- **Bench Electrical Raceways**: Dual-channel metallic surface raceways (Wiremold 4000) mounted $6.0" \ (152\text{ mm})$ above worksurfaces, separating 120V/208V power from Cat6A data drops.
- **Physical Electrical Continuity (Rule 9 & DIAG-014)**: Every machine digital twin is wired to a genuine physical `Power_Receptacle_Duplex` seated on the benchtop. Unplugging cuts voltage, halting instruments and silencing motors to 0 RPM.

---

# SECTION 6: CHEMICAL SAFETY, STORAGE & LIFE SAFETY SYSTEMS

## 6.1 Flammable Liquid Storage Vault (NFPA 30 / Class I Div 1)

```
       +========================================================================+
       |             FLAMMABLE LIQUID DISPENSING VAULT [ZONE Z-08]              |
       +========================================================================+
       
       +------------------------------------------------------------------------+
       | 2-HOUR FIRE-RATED REINFORCED CONCRETE MASONRY WALLS (UL U905)          |
       | 1.5-Hour Class B Self-Closing Fire Doors (UL 10B)                      |
       |                                                                        |
       | [Low-Level Exhaust Louver: 6" AFF] =================> 24/7 Exhaust Fan |
       |                                                       (15-20 ACH)      |
       | +--------------------------------------------------------------------+ |
       | | 1/4" x 2" SOLID COPPER PERIMETER GROUNDING BUSBAR                   | |
       | | (Clamped to all stainless kegs, safety cans, and dispensing pumps)  | |
       | +--------------------------------------------------------------------+ |
       |                                                                        |
       | [FM-Approved Justrite 60-Gal Sure-Grip EX Safety Cabinets]             |
       |                                                                        |
       | 4-INCH (100 mm) LIQUID-TIGHT SPILL CONTAINMENT CONCRETE CURB / RAMP    |
       +------------------------------------------------------------------------+
```

1. **Fire Resistance**: 2-hour fire-rated CMU walls with 1.5-hour UL 10B self-closing fire doors.
2. **Electrical Hazard Classification**: **NEC Class I, Division 1, Group D** explosion-proof lighting fixtures, sealed cast-iron conduit boxes, and intrinsically safe switches.
3. **Exhaust Ventilation**: Dedicated 100% once-through exhaust operating at **15 to 20 ACH**, with exhaust take-off registers located **$6.0" \ (152\text{ mm})$ AFF** to capture heavy solvent vapors (hexane, ethyl acetate, toluene).
4. **Static Grounding Busbar**: Continuous $1/4" \times 2"$ bare electrolytic copper busbar bonded to building steel ($< 1.0\ \Omega$ resistance to earth), equipped with braided copper grounding cables and bronze alligator clips.
5. **Secondary Spill Containment**: A monolithic **$4.0" \ (102\text{ mm})$** liquid-tight concrete curb and ramp at doorways, retaining the entire contents of stored 55-gallon drums.

---

## 6.2 Chemical Compatibility Storage Matrix (Segregation Protocol)

To prevent violent exothermic reactions, toxic gas evolution, or explosions under **OSHA 1910.1450**, storage is partitioned into isolated, dedicated cabinets:

```
+======================================================================================================================+
|                                    MASTER CHEMICAL STORAGE SEGREGATION MATRIX                                        |
+--------------------------+---------------------------+-------------------------------+-------------------------------+
| CABINET 1: FLAMMABLES    | CABINET 2: MINERAL ACIDS  | CABINET 3: ORGANIC ACIDS      | CABINET 4: CAUSTIC BASES      |
| (Justrite Yellow Cabs)   | (Justrite Blue Poly-Lined)| (Dedicated Separate Shelf)    | (Justrite Blue Steel Cabinet) |
| - Hexanes, Ethyl Acetate | - Nitric Acid (70%)       | - Glacial Acetic Acid         | - Sodium Hydroxide (50%)      |
| - Dichloromethane, Ether | - Hydrochloric Acid (37%) | - Trifluoroacetic Acid (TFA)  | - Ammonium Hydroxide          |
| - Methanol, Acetonitrile | - Sulfuric Acid (98%)     | - Formic Acid                 | - Potassium Hydroxide         |
| [FM Approved, 3-pt latch]| [Corrosion-proof, vented] | [Isolated from Mineral Acids] | [Isolated from all acids]     |
+--------------------------+---------------------------+-------------------------------+-------------------------------+
| CABINET 5: OXIDIZERS     | CABINET 6: PYROPHORICS    | HPLC SOLVENT WASTE SYSTEMS     | GAS CYLINDER RESTRAINTS       |
| (Yellow / Gray Steel)    | (Inert Glovebox Storage)  | (S.C.A.T. Europe Closed-Loop) | (Heavy-Duty Wall Strapping)   |
| - Hydrogen Peroxide (30%)| - n-Butyllithium, t-BuLi  | - Grounded SS waste cans      | - Double 3/16" SS chains at   |
| - Sodium Periodate       | - Trimethylaluminum, LAH  | - Exhaust vapor carbon traps  |   1/3 and 2/3 cylinder height |
| - Potassium Permanganate | - Grignard Reagents       | - Electronic float level alarm| - High-pressure safety caps   |
+==========================+===========================+===============================+===============================+
```

---

## 6.3 Life Safety & Emergency Infrastructure (ANSI Z358.1)

```
       +========================================================================+
       |             EMERGENCY COMBINATION SHOWER & EYEWASH ARCHITECTURE        |
       +========================================================================+
       
              [Ceiling Deck: 1" Potable Cold & Hot Water Feeds]
                                     |
              [ASSE 1071 THERMOSTATIC MIXING VALVE (TMV)]
              (Delivers Tepid Water: 80F +/- 5F / 26.7C)
                                     |
              +----------------------+----------------------+
              |                                             |
              | 1" Rigid Galvanized / 304SS Pipe            |
              v                                             v
       [DRENCH SHOWER HEAD]                         [EYE / FACE WASH STATION]
       - 10" Dia. Cast 304SS Head                   - Dual aerated soft-stream heads
       - Height: 84" (2134 mm) AFF                  - Flip-top dust covers
       - Activation: 28" SS Pull Rod                - Push plate / foot pedal activation
       - Flow: >= 20.0 GPM (75.7 L/min)             - Flow: >= 3.0 GPM (11.4 L/min)
              |                                             |
              +----------------------+----------------------+
                                     |
                                     v
       [DEDICATED 4" RECESSED FLOOR DRAIN & BASIN]
       (Epoxy-coated saucer basin prevents water migration into lab corridors)
```

1. **Travel Distance & Response Time**: Sited within **$< 10\text{ seconds}$** unobstructed travel path ($\le 55\text{ ft} \ / \ 16.8\text{ m}$) from every chemical workstation.
2. **Water Flow Rates**:
   - Drench Shower: **$\ge 20.0\text{ GPM} \ (75.7\text{ L/min})$** at $30\text{ PSI}$ for 15 minutes.
   - Eye/Face Wash: **$\ge 3.0\text{ GPM} \ (11.4\text{ L/min})$** aerated non-injurious wash stream.
3. **Tepid Water Delivery**: Factory-calibrated **ASSE 1071 certified Thermostatic Mixing Valve (TMV)** delivers water at **$80.0^\circ\text{F} \pm 5.0^\circ\text{F} \ (26.7^\circ\text{C})$**, preventing hypothermia or chemical burn acceleration.
4. **Dedicated Floor Drains**: Plumbed over dedicated 4" recessed floor drain saucers to capture runoff.

---

## 6.4 Clean Agent Fire Suppression & Detection Networks

1. **Clean Agent Gaseous Suppression (Novec 1230 / FK-5-1-12)**:
   - Installed in the **High-Field NMR Vault [Z-05]** and **Mass Spectrometry Core [Z-04]** under NFPA 2001.
   - Extinguishes fires via thermal absorption ($4.5\text{--}5.9\%\text{ v/v}$ concentration) within **$\le 10\text{ seconds}$**, leaving zero liquid or powder residue and preventing catastrophic water deluge damage to superconducting magnets, cryostats, and high-voltage spectrometers.
2. **Hazardous Gas Detection System**:
   - Continuous 24/7 detection network wired to the building automation system (BMS):
     - **Oxygen Depletion ($O_2$)**: Alarm at $< 19.5\%$, evacuation at $< 18.0\%$.
     - **Flammable Vapor LEL**: Catalytic bead sensors alarming at $10\%\text{ LEL}$ (triggers high-volume purge) and $25\%\text{ LEL}$ (cuts room electrical power).
     - **Photoionization Detectors (PID)**: Sub-PPM detection of volatile organic compounds (VOCs).
3. **Fire Extinguisher Inventory**:
   - Class ABC dry chemical ($10\text{ lb}$) mounted at every exit doorway.
   - Class $CO_2$ ($10\text{ lb}$) adjacent to all analytical instrument clusters.
   - Class D (Met-L-X copper-powder) extinguisher mounted adjacent to the inert glovebox and process scale-up lab for reactive metals ($Li, Na, Mg$, Grignard reagents).

---

# SECTION 7: 3D DIGITAL TWIN CAD IMPLEMENTATION PROTOCOL

All physical lab elements integrate directly into the `Twins` 3D procedural ecosystem and `lab_viewer/` scene under the **Centrifuge Standard** (`.agents/AGENTS.md`):

```
       +========================================================================+
       |             DIGITAL TWIN PROCEDURAL CAD HIERARCHY                      |
       +========================================================================+
       
       INSTRUMENT_BENCH (Datum Y = 0.0 Lab World)
         |
         +-- Body_Chassis (16-ga welded steel base frame, charcoal powder coat)
         +-- Top_Epoxy_Worksurface (1.0" monolithic slab, 1/4" marine spill edge)
         +-- Fastener_HexM6_* (Genuine 3D socket screws mounting frame to floor)
         +-- Foot_Leveling_* (Threaded stem with chloroprene non-skid rubber foot)
         +-- Power_Receptacle_Duplex (Physical 120V/208V duplex box mounted to bench)
         |     |
         |     +-- Plug_NEMA_5_15P (Physically seated into socket; hard continuity logic)
         |     +-- Cord_SJTOW_12_3 (Curved CatmullRom spline power cord to instrument)
         |
         +-- Service_Overhead_Carrier (Suspended Unistrut P1001 framework)
         |     +-- Pipe_UHP_Nitrogen (Orange band Swagelok quick-connect drop)
         |     +-- Pipe_UHP_Argon (Brown band Swagelok drop)
         |     +-- Cable_Cat6A_Data (Blue jacketed shielded cable drop)
         |
         +-- Fume_Hood_Assembly (Labconco Protector Premier 6-ft)
               +-- Sash_Glass_Laminated (Refractive PhysicalMaterial, IOR 1.52)
               +-- Baffle_Exhaust_316L (Aerodynamic bottom, intermediate, top slots)
               +-- Airfoil_Aerodynamic_SS (Flush-entry airfoil at Y = 0)
```

1. **Strict Semantic Taxonomy**: Every component adheres to taxonomy rules (`Body_*`, `UI_LCD`, `Btn_*`, `Pivot_*`, `Glass_*`, `Fastener_*`, `Foot_Leveling_*`).
2. **Zero Wall or Bench Clipping (Rule 4 & 5)**: Casework, leveling feet, and floor drains seat precisely at $Y = 0$. Cup sinks and utility chases are boolean-carved into epoxy tops with exact positive clearances.
3. **Physical Circuit Continuity (Rule 9 & DIAG-014)**: No machine or utility runs disconnected. The digital twin enforces hard-wired logical continuity (`isPluggedIn && switchOn`). Unplugging instantly drops instrument RPM to 0, blanks LCDs, and silences SFX synthesis.

---

### COMPLETE REGULATORY & ENGINEERING CITATIONS
- **SEFA (Scientific Equipment & Furniture Association)**: [SEFA Standards Desk Reference](https://www.sefalabs.com) (SEFA 1, 2, 3, 7, 8M, 10).
- **ANSI / AIHA**: [ANSI/AIHA Z9.5-2012 Laboratory Ventilation Standard](https://www.aiha.org).
- **NFPA (National Fire Protection Association)**: [NFPA 45](https://www.nfpa.org/codes-and-standards/4/5) (Chemical Laboratories) & [NFPA 30](https://www.nfpa.org/codes-and-standards/3/0) (Flammable Liquids).
- **ASHRAE**: [ASHRAE 110-2016 Method of Testing Performance of Laboratory Fume Hoods](https://www.ashrae.org).
- **Bruker Corporation**: [Bruker Ascend Superconducting Magnet Site Planning Guide (Doc P/N Z31276)](https://www.bruker.com).
- **Thermo Fisher Scientific**: [Orbitrap Exploris Mass Spectrometer Site Preparation Guide (BRE0019231)](https://www.thermofisher.com).
- **Waters Corporation**: [Xevo TQ-Absolute System Site Planning Guide (Doc P/N 715007945)](https://www.waters.com).
- **Justrite Safety Group**: [Chemical Storage & Flammable Safety Cabinet Standards](https://www.justrite.com).
- **S.C.A.T. Europe**: [HPLC Closed-Loop Solvent Safety Systems](https://www.scat-europe.com).
