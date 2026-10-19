# OEM Technical Specification: Nabertherm LT 9/11 Laboratory Box Furnace

**Document ID:** SPEC-OEM-NAB-LT911-001  
**Manufacturer:** Nabertherm GmbH, Bahnhofstr. 20, 28865 Lilienthal, Germany  
**Primary Reference:** *Nabertherm Laboratory Furnaces & Accessories Catalog* (pp. 6–7, 13–15, 84)  
**Cross Reference:** DIN 17052-1, EN 61010-1, EN 61010-2-010  

---

## 1. Executive Summary & Equipment Identity

The **Nabertherm LT 9/11** is an industrial-grade, precision laboratory muffle/box furnace designed for continuous thermal processing up to 1100 °C. The **"LT"** designation indicates the furnace is equipped with a counterbalanced **vertical parallel lift door**, engineered such that the glowing interior refractory insulation face always faces upward and away from the laboratory operator during opening, eliminating direct line-of-sight thermal radiation exposure.

The unit features a 9.0-liter usable muffle chamber volume, powered by dual-sided embedded Kanthal FeCrAl resistance heating elements producing a total connected heating load of 3.3 kW operating on a single-phase 230 V AC supply.

---

## 2. Certified Physical & Dimensional Specifications

All dimensions are derived directly from the certified OEM manufacturer catalog (p. 7).

### 2.1 Enclosure Dimensions

| Dimension Parameter | Value (Metric) | Value (Imperial) | OEM Notes |
| :--- | :--- | :--- | :--- |
| **Outer Cabinet Width ($W$)** | **415 mm** / **485 mm** | 16.34 in / 19.09 in | 415 mm baseline cabinet unibody; 485 mm envelope with side-mounted conduit/bracket or older chassis line |
| **Outer Cabinet Depth ($D$)** | **455 mm** | 17.91 in | Excludes rear exhaust spigot; 555 mm with rear flue chimney |
| **Outer Cabinet Height ($H_{closed}$)** | **515 mm** | 20.28 in | Nominal closed cabinet height including base frame and leveling feet |
| **Outer Cabinet Height ($H_{open}$)** | **755 mm** | 29.72 in | Top of lift door at maximum stroke ($515\text{ mm} + 240\text{ mm}$) |
| **Door Vertical Lift Stroke ($\Delta Y$)** | **240 mm** | 9.45 in | Kinematic vertical linear travel stroke |
| **Total Net Weight (Empty)** | **35 kg** | 77.16 lbs | Standard furnace without optional weighing scale or flue condenser |

### 2.2 Chamber & Workspace Dimensions

| Chamber Parameter | Value (Metric) | Value (Imperial) | OEM Notes |
| :--- | :--- | :--- | :--- |
| **Chamber Internal Width ($w$)** | **235 mm** | 9.25 in | Usable width between ceramic heating plates |
| **Chamber Internal Depth ($d$)** | **240 mm** | 9.45 in | Usable depth from throat aperture face to rear wall |
| **Chamber Internal Height ($h$)** | **170 mm** | 6.69 in | Usable height from hearth plate surface to crown |
| **Chamber Volume** | **9.0 Liters** | 549.2 $\text{in}^3$ | Usable geometric volume |
| **Uniformity Zone Width ($w_u$)** | **180 mm** | 7.09 in | $\pm 5\text{ K}$ thermal uniformity per DIN 17052-1 ($T > 800^\circ\text{C}$) |
| **Uniformity Zone Depth ($d_u$)** | **150 mm** | 5.91 in | $\pm 5\text{ K}$ thermal uniformity per DIN 17052-1 ($T > 800^\circ\text{C}$) |
| **Uniformity Zone Height ($h_u$)** | **120 mm** | 4.72 in | $\pm 5\text{ K}$ thermal uniformity per DIN 17052-1 ($T > 800^\circ\text{C}$) |

---

## 3. Thermal & Electrical Specifications

| Parameter | Specification | Tolerance / Condition |
| :--- | :--- | :--- |
| **Maximum Operating Temperature ($T_{max}$)** | **1100 °C** (2012 °F) | Maximum peak rating |
| **Recommended Continuous Working Temperature** | **1000 °C** (1832 °F) | For extended soak/dwell times per OEM |
| **Connected Heating Load** | **3.3 kW** (3300 W) | At nominal 230 V AC line voltage |
| **Mains Electrical Supply** | **230 V AC 1/N/PE** | 50/60 Hz single-phase |
| **Nominal Operating Current** | **14.35 A** | Calculated ($I = P / V = 3300\text{ W} / 230\text{ V}$) |
| **Recommended Circuit Breaker / Fuse** | **16 A Slow-Blow (Type C)** | Standard 16 A single-phase laboratory line |
| **Heating Time to $T_{max} - 100\text{ K}$** | **63 minutes** | Ambient 20 °C to 1000 °C, empty & closed chamber |
| **Insulation Thermal Conductivity** | $0.12\text{ W/m}\cdot\text{K}$ (at 600°C) | Alumina-silica vacuum-formed fiber board |
| **Outer Skin Temperature** | $< 45\text{ }^\circ\text{C}$ (ambient 22°C) | Double-shell convective airflow cooling |

---

## 4. Mechanical Architecture: Parallel Lift Door Kinematics

### 4.1 Kinematic Overview
The LT 9/11 lift door does not swing on a hinge. Instead, it translates strictly along the vertical $+Y$ axis (Blender $+Z$, Three.js $+Y$) over a linear travel distance of **240 mm**.

```
              [Fully Open Position: H = 755 mm]
                       ▲
                       │
                       │ 240 mm Vertical Stroke
                       │
                       ▼
             [Fully Closed Position: H = 515 mm]
```

### 4.2 Guidance & Counterbalance Assembly
1. **Vertical Guide Channels:**
   - Dual cold-drawn 304 stainless steel C-profile tracks ($20\text{ mm} \times 15\text{ mm} \times 2\text{ mm}$, length $420\text{ mm}$) mounted vertically inside the left and right sidewalls of the double-walled cabinet shell.
   - 4 flanged sliding guide blocks (low-friction graphite-impregnated sintered bronze / PTFE-coated bronze) bolted to the door suspension upright arms.
2. **Counterbalance System:**
   - 2 precision cylindrical/rectangular counterweights (cast iron/lead, mass $\approx 3.6\text{ kg}$ each) located inside dedicated internal guide tubes within the double-wall side envelope.
   - High-tensile stainless steel aircraft wire ropes ($\varnothing 2.0\text{ mm}$, $7 \times 19$ strand construction, AISI 316) routed over top crown pulley sheaves ($\varnothing 40\text{ mm}$ machined 304SS with dual sealed 608ZZ deep-groove ball bearings).
   - Near-perfect 1:1 gravitational counterbalancing permits smooth manual opening with an operating lifting force $< 15\text{ N}$ (under 1.5 kgf).
3. **Safety Interlock Mechanism:**
   - Snap-action safety limit microswitch (Schmersal / Burgess V4 series, SPDT, IP67) mounted at the top of the lower throat collar.
   - Actuated by a precision steel trip cam on the lift carriage. Opening the door $> 10\text{ mm}$ breaks the control circuit to the Crydom solid-state relay, instantly de-energizing the heating elements while preserving the controller PID loop and display.
4. **Ergonomic Lift Handle:**
   - Horizontal grab handle bar ($\varnothing 20\text{ mm} \times 320\text{ mm}$, brushed AISI 304 stainless steel) mounted to the bottom front apron of the lift door via thermally isolated ceramic-washer standoffs.
   - Positioned below the radiant zone, remaining $< 38^\circ\text{C}$ even during continuous 1100°C chamber operations.

---

## 5. Heating System & Refractory Construction

1. **Heating Element Composition:**
   - Kanthal A-1 ferritic iron-chromium-aluminium alloy (Fe-Cr-Al, nominal chemistry: 73% Fe, 22% Cr, 5.8% Al).
   - Maximum wire operating temperature: 1400 °C.
   - Coiled resistance wire: $\varnothing 1.6\text{ mm}$ wire gauge, coiled into $\varnothing 14\text{ mm}$ helical coils, $4.5\text{ mm}$ pitch.
   - Total nominal resistance (cold): $15.4\text{ }\Omega$; hot resistance ($1000^\circ\text{C}$): $16.03\text{ }\Omega$.
2. **Ceramic Support Plates:**
   - Two lateral heating plates (left and right chamber sidewalls) manufactured from high-purity vacuum-formed alumina ceramic with precision-cast spiral retention grooves.
   - Heating elements radiate directly into the chamber while being mechanically safeguarded against mechanical impact from crucibles.
3. **Silicon Carbide (SiC) Hearth Plate:**
   - High-density recrystallized silicon carbide (R-SiC) refractory hearth tile.
   - Dimensions: $230\text{ mm (W)} \times 235\text{ mm (D)} \times 12\text{ mm (H)}$.
   - Features $5\text{ mm}$ raised perimeter retention lips along left, right, and rear edges to prevent crucibles from sliding against heating elements and contain molten flux spillage.
4. **Temperature Sensor (Thermocouple):**
   - High-temperature Type S thermocouple (Platinum-10% Rhodium vs Platinum, NIST/IEC 60584 Type S).
   - Encased in a recrystallized high-purity alumina sheath (Alsint 99.7% $\text{Al}_2\text{O}_3$, Ker 710), $\varnothing 6.0\text{ mm} \times 250\text{ mm}$.
   - Terminal connection: DIN Type B miniature cast aluminum weatherproof head mounted to the rear casing wall.
