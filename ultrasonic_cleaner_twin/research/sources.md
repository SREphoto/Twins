# Research Sources & OEM Citations — Ultrasonic Cleaner 3000-PRO

**Primary Reference Products:**
1. **Emerson Branson CPX5800H / 5800 Series** — 5.5 L (1.5 gal), 40 kHz, digital sweep, heated bath
2. **Elma Elmasonic S 300 / S 60 / P 60H** — 5.75 L, 37/80 kHz dual frequency, sweep & pulse modes, rear drain
3. **Crest Powersonic CP500D / CP1100D** — 5.7 L, 38.5 kHz, ceramic Langevin sandwich transducers

---

## 1. Primary Manufacturer Technical Documentation

### 1.1 Emerson Industrial Automation / Branson Ultrasonics
- **Address:** 41 Eagle Road, Danbury, CT 06810, USA
- **Reference Manual:** *Branson CPX / Bransonic Digital Ultrasonic Baths Operating Manual* (Doc. No. 100-214-252)
- **Key Specifications Verified:**
  - Tank Dimensions (5800 / CPX5800H): $292 \times 152 \times 152\text{ mm}$ ($11.5 \times 6.0 \times 6.0\text{ in}$).
  - Working Capacity: $5.5\text{ Liters}$ ($1.45\text{ gal}$).
  - Operating Frequency: $40\text{ kHz} \pm 1\text{ kHz}$ with continuous digital sweep modulation ($\pm 1.5\text{ kHz}$).
  - Transducer Type: Bolt-clamped Langevin piezoelectric sandwich transducers with high-grade PZT-8 ceramic rings and aerospace aluminum radiating horns.
  - Degas Function: Pulse-width modulated cavitation cycle ($1.5\text{ s}$ ON / $0.5\text{ s}$ OFF) for mobile phase solvent degassing.
  - Drain System: Rear/side-mounted 3/8" NPT ball valve with $\varnothing 10\text{ mm}$ hose barb connection.

### 1.2 Elma Schmidbauer GmbH
- **Address:** Gottlieb-Daimler-Str. 17, 78224 Singen, Germany
- **Reference Manual:** *Elmasonic S / P Series Service and Operating Instructions* (Doc. No. 104 3828)
- **Key Specifications Verified:**
  - Housing Architecture: Double-walled sheet metal chassis with an intentional $12\text{--}18\text{ mm}$ acoustic decoupling air gap isolating the vibrating basin from the external casing and electronics.
  - PCB Separation: Split board architecture separating high-voltage ultrasonic power driver (MOSFET half-bridge, ferrite matching transformer) from low-voltage digital microcontroller board.
  - Transducer Bonding: High-temperature structural epoxy bonding under calibrated pneumatic clamping pressure ($> 45\text{ MPa}$ compressive pre-stress).
  - Heating Element: Flexible silicone rubber etched-foil heating pad ($160\text{ W}$) vulcanized directly to the bottom tank surface.

### 1.3 Material & Component OEM Standards
- **Piezoelectric Ceramics:** Lead Zirconate Titanate (Navy Type III / PZT-8) high-power ceramic rings per MIL-STD-1376B.
- **Microcontroller:** STMicroelectronics STM32F401 32-bit ARM Cortex-M4 RISC core @ 84 MHz with hardware FPU.
- **Cooling Fan:** ebm-papst / Sanyo Denki 60 mm DC axial convective cooling fan (12V DC, dual ball bearings).
- **Power Inlet:** Schurter / Bulgin IEC 60320 C14 Power Entry Module with integrated dual $5 \times 20\text{ mm}$ fuse drawer and 2-pole line filter conforming to IEC 60939.
- **Power Cord:** NEMA 5-15P to IEC C13 3-conductor 16 AWG SJTOW oil- and water-resistant neoprene cable (rated 105°C, 300V).

---

## 2. Summary Comparison Matrix: SREdesigns 3000-PRO vs OEM Counterparts

| Engineering Parameter | Branson CPX5800H | Elma Elmasonic S 60 / S 300 | SREdesigns 3000-PRO Digital Twin |
| :--- | :--- | :--- | :--- |
| **Tank Usable Capacity** | 5.5 L (1.5 gal) | 5.75 L | **5.50 Liters** |
| **Enclosure Width ($W$)** | 397 mm | 365 mm | **320.0 mm** (Split-Deck Form Factor) |
| **Enclosure Depth ($D$)** | 317 mm | 214 mm | **200.0 mm** (214 mm w/ PEM) |
| **Enclosure Height ($H$)** | 375 mm | 278 mm | **186.0 mm** (222 mm w/ Lid Handle) |
| **Control Zone Layout** | Slanted front fascia | Top deck right or front | **Top Deck Left Zone ($80\text{ mm}$ W)** |
| **Ergonomic Margin** | ~15 mm margin | ~12 mm margin | **$\ge 18.0\text{ mm}$ Left Edge Clearance** |
| **Ultrasonic Frequency** | 40 kHz with Sweep | 37 kHz with Sweep/Pulse | **40.0 kHz with Sweep & Degas** |
| **Transducer Count** | 4× Langevin PZT | 4× Langevin PZT | **4× Langevin PZT Sandwich (2×2 Matrix)** |
| **Ultrasonic Power** | 130 W avg (260 W pk) | 150 W avg (300 W pk) | **130 Watts avg (260 Watts peak)** |
| **Heater Power** | 160 W | 400 W | **160 Watts Silicone Foil Pad** |
| **Temperature Range** | Ambient to 69°C | Ambient to 80°C | **Ambient to 70 °C ($1^\circ\text{C}$ steps)** |
| **Drain Valve** | 3/8" rear ball valve | 3/8" rear ball valve | **3/8" Quarter-Turn SS Ball Valve** |
| **Wire Basket Bench Rest** | Bench adjacent | Bench adjacent | **Bench Datum $X \ge 2.65$ ($265\text{ mm}$)** |
| **MCU Architecture** | 8-bit / 16-bit PIC | 16-bit Renesas / ST | **32-bit ARM Cortex-M4 RISC Core** |

---

## 3. Local Archive & Document Traceability

1. `ultrasonic_cleaner_twin/research/branson_5800_elma_s300_specifications.md`: Detailed engineering breakdown of Branson 5800 and Elma Elmasonic S 300.
2. `ultrasonic_cleaner_twin/research/ultrasonic_cleaner_manufacturing_research.md`: Manufacturing research, double-wall acoustic gap, transducer bonding, and internal wire routing.
3. `ultrasonic_cleaner_twin/research/16_Ultrasonic_Cleaner.md`: General operational principles and chemical application guidelines.
4. `ultrasonic_cleaner_twin/docs/dimensions.md`: 1:1 engineering dimensions, tolerances, clearance boundaries, and mechanical kinematics.
5. `ultrasonic_cleaner_twin/docs/BOM.md`: Exhaustive bill of materials with semantic part taxonomy, DIN fasteners, and material grades.