# OEM Technical Specification: Ultrasonic Cleaner 3000-PRO
## Based on Branson 5800 / CPX5800H & Elma Elmasonic S 300

**Document ID:** SPEC-OEM-USC-3000PRO-001  
**Equipment Designation:** SREdesigns Ultrasonic Cleaner 3000-PRO  
**Primary Reference Models:**
1. **Emerson Branson CPX5800H / 5800 Series** (Emerson Electric Co., Danbury, CT, USA)
2. **Elma Elmasonic S 300 / S 60 / P 60H Series** (Elma Schmidbauer GmbH, Singen, Germany)
**Relevant Standards:** IEC 61010-1, IEC 61326-1 (EMC Class A), ASTM E543, DIN 51110  

---

## 1. System Overview & Physical Architecture

The **Ultrasonic Cleaner 3000-PRO** is a precision laboratory benchtop ultrasonic cleaning and degassing bath engineered for chemical glassware de-contamination, HPLC mobile phase degassing, accelerated dissolution/extraction, and mechanical component cleaning.

The instrument utilizes an asymmetric split-deck architecture:
- **Left Zone ($80\text{ mm}$ width):** Sealed electronic control console with dynamic digital LCD, dual knurled rotary encoders, tactile pushbuttons, and status annunciator LEDs. Features an ergonomic left-margin clearance of $\ge 18\text{ mm}$ from the outer chassis edge.
- **Right Zone ($240\text{ mm}$ width):** Deep-drawn AISI 304 stainless steel cleaning basin with a $5.5\text{ L}$ usable liquid capacity, integrated perimeter drip rim, bottom drain well, and hinged sound-dampening cover.

```
       ◄─────────────────────── 320 mm Overall Width ────────────────────────►
       ┌─────────────────────┬───────────────────────────────────────────────┐  ▲
       │   LEFT CONTROL ZONE │             RIGHT BASIN ZONE                  │  │
       │      (80 mm W)      │                (240 mm W)                     │  │
       │                     │  ┌─────────────────────────────────────────┐  │  │
       │  ┌───────────────┐  │  │                                         │  │  │
       │  │    UI_LCD     │  │  │            STAINLESS BASIN              │  │  │ 200 mm
       │  └───────────────┘  │  │          (230 x 164 x 145 mm)           │  │  │ Depth
       │   [TIME]  [TEMP]    │  │               (5.5 Liters)              │  │  │
       │    KNOB    KNOB     │  │                                         │  │  │
       │   [DEGAS] [SWEEP]   │  │                                         │  │  │
       │                     │  └─────────────────────────────────────────┘  │  │
       └─────────────────────┴───────────────────────────────────────────────┘  ▼
         ◄───►
        18 mm Left
        Margin
```

---

## 2. Certified 1:1 Physical & Dimensional Specifications

### 2.1 Enclosure Dimensions

| Parameter | Specification (Metric) | Specification (Imperial) | Tolerances / Engineering Notes |
| :--- | :--- | :--- | :--- |
| **Overall Enclosure Width ($W$)** | **320.0 mm** | 12.60 in | Structural outer sheet metal casing |
| **Overall Enclosure Depth ($D$)** | **200.0 mm** | 7.87 in | Excludes rear power entry module ($214\text{ mm}$ overall) |
| **Enclosure Body Height ($H_{body}$)** | **168.0 mm** | 6.61 in | Upper structural unibody cabinet |
| **Base Plinth Skirt Height ($H_{base}$)**| **14.0 mm** | 0.55 in | Recessed dark charcoal plinth skirt |
| **Total Instrument Height (Lid Closed)** | **186.0 mm** | 7.32 in | Bottom of leveling feet to top deck ($Z=0 \to 186\text{ mm}$) |
| **Total Height with Closed Lid & Handle**| **222.0 mm** | 8.74 in | To apex of brushed stainless lid grab handle |
| **Total Height with Lid Fully Open** | **385.0 mm** | 15.16 in | Lid pivoted $85^\circ$ open on rear barrel hinges |
| **Outer Wall Thickness ($T_{wall}$)** | **1.20 mm** (18 ga) | 0.047 in | Structural cold-rolled steel, powder coated |
| **Acoustic Isolation Air Gap** | **12.0 to 18.0 mm** | 0.47 to 0.71 in | Vibration decoupling between basin and outer shell |
| **Control Zone Left-Margin Clearance** | **18.0 mm** | 0.71 in | Clearance from outer edge to button bezels ($\ge 15\text{--}20\text{ mm}$) |
| **Net Weight (Empty)** | **6.50 kg** | 14.33 lbs | Complete unit without liquid or basket |

### 2.2 Tank / Cleaning Basin Dimensions

| Basin Parameter | Specification (Metric) | Specification (Imperial) | Tolerances / Notes |
| :--- | :--- | :--- | :--- |
| **Working Liquid Capacity** | **5.50 Liters** | 1.45 gal (US) | Nominal operating capacity up to MAX fill line |
| **Total Brim-Full Volume** | **5.90 Liters** | 1.56 gal (US) | Geometric volume to upper tank lip |
| **Internal Basin Width ($w$)** | **230.0 mm** | 9.06 in | Deep-drawn AISI 304 stainless steel |
| **Internal Basin Depth ($d$)** | **164.0 mm** | 6.46 in | Deep-drawn AISI 304 stainless steel |
| **Internal Basin Height ($h$)** | **145.0 mm** | 5.71 in | Floor to upper flange rim |
| **Basin Wall Thickness** | **1.00 mm** | 0.039 in | Cavitation-resistant electropolished 304SS |
| **Bottom Corner Radii ($R_{corner}$)** | **15.0 mm** | 0.59 in | Smooth radius eliminates acoustic dead nodes |
| **Fill Line Indicators** | MIN ($3.5\text{ L}$), MAX ($5.5\text{ L}$)| Laser-etched interior graduation lines |
| **Drain Port Thread** | **3/8" NPT** (female) | Stainless steel threaded boss welded to basin floor |
| **Drain Ball Valve** | **3/8" Quarter-Turn** | 304SS body, PTFE seals, with $\varnothing 10\text{ mm}$ hose barb |

### 2.3 Wire Basket Dimensions & Bench Rest Position

| Basket Parameter | Specification (Metric) | Specification (Imperial) | Engineering Function |
| :--- | :--- | :--- | :--- |
| **Basket Outer Width** | **215.0 mm** | 8.46 in | Leaves $7.5\text{ mm}$ clearance on each side of tank |
| **Basket Outer Depth** | **148.0 mm** | 5.83 in | Leaves $8.0\text{ mm}$ clearance front and rear |
| **Basket Basket Height** | **105.0 mm** | 4.13 in | Submerged depth in cleaning fluid |
| **Mesh Spacing (Square Grid)** | **$8.0 \times 8.0\text{ mm}$** | $0.31 \times 0.31\text{ in}$ | Resistance-welded at every intersection |
| **Mesh Wire Diameter** | **$\varnothing 1.20\text{ mm}$** | 0.047 in | AISI 304 electropolished stainless steel wire |
| **Perimeter Frame Rod Diameter** | **$\varnothing 3.00\text{ mm}$** | 0.118 in | Heavy structural rim wire |
| **Bottom Standoff Legs (4×)** | **$15.0\text{ mm}$ height** | 0.59 in | Keeps basket floor $25\text{ mm}$ above tank diaphragm |
| **Suspension Handles (2×)** | Dual formed $\varnothing 3\text{ mm}$ wire | Flanged hooks rest on upper tank rim |
| **Resting Bench Position ($X_{bench}$)**| **$X \ge 2.65$ units** ($265\text{ mm}$)| Placed on bench to right of unit; completely clear of right wall ($+160\text{ mm}$) and drain spout ($+182\text{ mm}$) |

---

## 3. Ultrasonic Acoustic & Transducer System

1. **Operating Ultrasonic Frequency:**
   - Nominal Center Frequency: **40.0 kHz** $\pm 1.0\text{ kHz}$.
   - Sweep Mode: $\pm 1.5\text{ kHz}$ continuous sweep frequency modulation at $100\text{ Hz}$ sweep rate, eliminating standing waves and cavitation dead zones.
   - Degas Mode: Pulse-width modulated cavitation bursting ($1.5\text{ s}$ burst / $0.5\text{ s}$ pause) to rapidly coalesce and release entrained air bubbles.
2. **Piezoelectric Transducer Construction (Langevin Sandwich):**
   - Count: **Quad (4×) Langevin Bolt-Clamped Transducers** arranged in a $2 \times 2$ matrix across the tank bottom.
   - PZT Rings: Dual high-power Lead Zirconate Titanate piezoelectric ceramic rings (PZT-8 / Navy Type III, outer diameter $\varnothing 38\text{ mm}$, inner diameter $\varnothing 15\text{ mm}$, thickness $5.0\text{ mm}$).
   - Front Radiating Mass: CNC-machined aerospace 6061-T6 aluminum horn ($\varnothing 45\text{ mm} \times 22\text{ mm}$).
   - Rear Backing Mass: High-density 304 stainless steel cylinder ($\varnothing 38\text{ mm} \times 16\text{ mm}$).
   - Pre-Stress Center Bolt: Grade 10.9 high-tensile alloy steel M10 $\times 1.25\text{ mm}$ socket bolt torqued to $35\text{ Nm}$ across stacked silicon-bronze Belleville disc springs to maintain $> 45\text{ MPa}$ compressive bias stress.
   - Bonding: Structural ceramic-filled epoxy (Master Bond EP30HT, glass transition $T_g = 145^\circ\text{C}$) cured at $120^\circ\text{C}$ under $50\text{ psi}$ static clamping pressure.
3. **Power Output:**
   - Continuous Ultrasonic Average Power: **130 Watts**.
   - Peak Cavitation Power: **260 Watts**.

---

## 4. Heating & Temperature Regulation

1. **Heater Element:**
   - Flexible etched-foil silicone rubber surface heating pad ($210\text{ mm} \times 140\text{ mm} \times 1.5\text{ mm}$).
   - Resistance Alloy: Inconel etched foil circuit encapsulated in fiberglass-reinforced silicone vulcanizate.
   - Power Rating: **160 Watts** at 120/240 V AC.
   - Bonding: High-temperature pressure-sensitive acrylic adhesive layer bonded directly to the tank bottom between transducer horns.
2. **Temperature Control & Sensors:**
   - Controllable Temperature Range: Ambient ($20^\circ\text{C}$) to **70 °C** (158 °F) in $1^\circ\text{C}$ increments.
   - Primary Feedback Sensor: Precision Class A PT100 platinum RTD in stainless steel button housing spring-loaded against the tank exterior wall.
   - Safety Thermal Cutout: Auto-reset bimetallic snap-action thermal limit switch (normally closed, opens at $85^\circ\text{C} \pm 3^\circ\text{C}$ on tank dry-run) wired in series with the heater relay coil.
   - Secondary Thermal Fuse: $105^\circ\text{C}$ one-time thermal cutoff fuse in silicone fiberglass sleeving.

---

## 5. Electronics Bay & Power Supply Architecture

1. **Mainboard (`PCB_Motherboard`):**
   - $160 \times 120 \times 1.6\text{ mm}$ FR-4 double-sided printed circuit board with ENIG gold surface finish.
   - Processor: 32-bit ARM Cortex-M4 RISC microcontroller @ 72 MHz (STM32F401, LQFP-64) with laser-marked silkscreen and pin-1 dot.
   - Auxiliary Memory: 16 MB high-speed SPI Flash storage for GLP audit logging and user cycle profiles.
2. **Ultrasonic Generator Board:**
   - High-efficiency half-bridge resonant inverter circuit operating at $40\text{ kHz}$.
   - Power Switches: 2× IRFP460 N-channel power MOSFETs (500V, 20A, $R_{DS(on)} = 0.27\text{ }\Omega$) mounted on an extruded finned aluminum heatsink ($75 \times 50 \times 25\text{ mm}$).
   - Matching Transformer: High-frequency MnZn ferrite pot core transformer with Litz wire secondary winding (1:4 step-up ratio generating $650\text{ V}_{pp}$ transducer drive voltage).
3. **Power Supply & Conversion:**
   - Toroidal Step-Down Transformer: Talema 30VA toroidal transformer ($\varnothing 70\text{ mm} \times 32\text{ mm}$) providing isolated secondary windings ($18\text{V AC} / 12\text{V AC}$).
   - Internal Switching Power Supply: Universal AC input ($85\text{--}264\text{V AC}$), providing regulated $+24\text{V DC}$ (fan/valves), $+12\text{V DC}$ (MOSFET gate drive), and $+5\text{V} / +3.3\text{V DC}$ (MCU and LCD).
4. **Active Convective Cooling:**
   - 60 mm DC brushless axial cooling fan ($60 \times 60 \times 15\text{ mm}$, 12V DC, 0.12A, 19.5 CFM airflow, dual ball bearings $L_{10} > 60,000\text{ h}$).
   - Stamped steel wire finger grille conforming to IEC 61010-1.
5. **AC Power Entry & Continuity:**
   - Rear Power Entry Module: Snap-in IEC 60320 C14 appliance inlet with integral dual $5 \times 20\text{ mm}$ fuse drawer (2× 5A 250V slow-blow ceramic fuses) and multi-stage 2-pole EMI/RFI filter.
   - Master Rocker Switch: Rear-mounted illuminated DPST power rocker switch (10A 250V AC).
   - Mains Cord: 3-conductor 16 AWG ($3 \times 1.31\text{ mm}^2$) SJTOW oil-resistant neoprene cable (2.0 m) with molded NEMA 5-15P plug.
   - Bench Receptacle: Standard cast aluminum duplex box (`Power_Receptacle_Duplex`) at bench datum $Y=0$.
   - Chassis Ground: Dedicated M5 brass protective earth stud with star lock washers ensuring $< 0.05\text{ }\Omega$ ground continuity.
