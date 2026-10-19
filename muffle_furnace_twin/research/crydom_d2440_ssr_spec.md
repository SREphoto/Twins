# OEM Technical Specification: Crydom Series 1 D2440 Solid-State Relay

**Document ID:** SPEC-OEM-CRY-D2440-001  
**Manufacturer:** Sensata Technologies / Crydom Inc., 2475 Paseo de las Americas, San Diego, CA 92154, USA  
**Primary Reference:** *Crydom Series 1 AC Output Solid State Relays Datasheet*  
**Package:** Industry Standard "Hockey Puck" Panel Mount ($57.3 \times 44.5 \times 22.6\text{ mm}$)  

---

## 1. Physical & Mechanical Dimensions

| Parameter | Specification (Metric) | Specification (Imperial) | Standards / Tolerance |
| :--- | :--- | :--- | :--- |
| **Relay Body Length** | **57.3 mm** | 2.256 in | Industry standard hockey puck |
| **Relay Body Width** | **44.5 mm** | 1.752 in | Standard panel mount outline |
| **Relay Body Height** | **22.6 mm** | 0.890 in | Including protective terminal cover |
| **Mounting Slot Spacing** | **47.6 mm** | 1.874 in | Center-to-center diagonal slots |
| **Mounting Screw Clearance** | $\varnothing 4.3\text{ mm}$ (M4 / \#8) | $0.169\text{ in}$ | 2× diagonal through-slots |
| **Housing Material** | UL 94 V-0 flame-retardant epoxy | Black encapsulation | High dielectric tracking resistance |
| **Baseplate Material** | Nickel-plated aluminum plate | — | Precision flat for thermal interface |
| **Weight** | **86.5 g** | 3.05 oz | Relay module without heatsink |

---

## 2. Electrical Specifications

### 2.1 Load Output Ratings (Terminals 1 & 2)

| Parameter | Value | Condition / Notes |
| :--- | :--- | :--- |
| **Operating Line Voltage Range** | **24 to 280 V AC RMS** | 47 to 63 Hz |
| **Continuous Load Current Rating ($I_{max}$)** | **40 A RMS** | With heatsink ($T_{base} \le 40^\circ\text{C}$) |
| **Actual Furnace Operational Current** | **14.35 A RMS** | Nominal continuous draw at 3.3 kW / 230 V |
| **Maximum 1-Cycle Surge Current ($I_{TSM}$)** | **625 A peak** | 50 Hz (20 ms half-sine pulse) |
| **On-State Forward Voltage Drop ($V_F$)** | **1.15 V RMS** | At nominal rated current |
| **Minimum Load Current** | $150\text{ mA RMS}$ | Holding current threshold |
| **Off-State Leakage Current** | $< 1.0\text{ mA RMS}$ | At rated voltage and $25^\circ\text{C}$ |
| **Switching Mode** | **Zero Voltage Turn-On** | Zero-cross detection ($< 20\text{ V}$ window) |
| **Turn-On Time** | $\le 1/2\text{ AC cycle}$ | Max 10 ms at 50 Hz |
| **Turn-Off Time** | $\le 1/2\text{ AC cycle}$ | Max 10 ms at 50 Hz |
| **Transient Overvoltage Protection** | **600 V peak** | Built-in RC snubber across output terminals |

### 2.2 Control Input Ratings (Terminals 3 & 4)

| Parameter | Value | Condition / Notes |
| :--- | :--- | :--- |
| **Control Voltage Range** | **3.0 to 32.0 V DC** | Opto-isolated logic input |
| **Minimum Turn-On Voltage** | $3.0\text{ V DC}$ | Direct interface to 12V logic output |
| **Minimum Turn-Off Voltage** | $1.0\text{ V DC}$ | Guarantees cutoff when logic low |
| **Input Current Draw** | **7.0 to 12.0 mA DC** | At $12\text{ V DC}$ nominal drive from Eurotherm 3216 |
| **Input Impedance** | Current-regulated | Constant current input stage |
| **Dielectric Isolation Voltage** | **4000 V RMS** | Input to output, and terminals to baseplate |

---

## 3. Thermal Design & Heatsink Sizing

In the Nabertherm LT 9/11 lower electronics bay, the SSR is mounted directly to a dedicated extruded aluminum heatsink positioned directly within the forced convective cooling airstream drawn by the convective cooling fan.

### 3.1 Power Dissipation Calculation
At full continuous connected load:
$$P = 3300\text{ W}, \quad V = 230\text{ V AC} \implies I = 14.35\text{ A RMS}$$
$$P_{dissipated} = I_{RMS} \times V_{F} = 14.35\text{ A} \times 1.15\text{ V} = 16.50\text{ Watts}$$

### 3.2 Thermal Resistance Network
- **Junction-to-Case Resistance ($R_{\theta jc}$):** $0.48\text{ }^\circ\text{C/W}$
- **Case-to-Heatsink Interface Resistance ($R_{\theta cs}$):** $0.10\text{ }^\circ\text{C/W}$ (using Dow Corning 340 zinc-oxide thermal compound, layer thickness $50\text{ }\mu\text{m}$)
- **Heatsink-to-Ambient Resistance ($R_{\theta sa}$):** $1.20\text{ }^\circ\text{C/W}$ (Crydom HS-2 aluminum extrusion with forced convection at $1.5\text{ m/s}$ airflow)

$$\Delta T_{j-a} = P_{dissipated} \times (R_{\theta jc} + R_{\theta cs} + R_{\theta sa})$$
$$\Delta T_{j-a} = 16.50\text{ W} \times (0.48 + 0.10 + 1.20)\text{ }^\circ\text{C/W} = 16.50 \times 1.78 = 29.37\text{ }^\circ\text{C}$$

At a maximum enclosed cabinet bay temperature of $T_a = 45^\circ\text{C}$:
$$T_{base} = 45^\circ\text{C} + (16.50\text{ W} \times 1.30\text{ }^\circ\text{C/W}) = 66.45^\circ\text{C}$$
$$T_{junction} = 45^\circ\text{C} + 29.37^\circ\text{C} = 74.37^\circ\text{C}$$

Because maximum allowable junction temperature $T_{j,max} = 125^\circ\text{C}$, the SSR operates with a **$50.6^\circ\text{C}$ thermal safety margin**, ensuring an MTBF $> 2,000,000$ hours.

---

## 4. Hardware Terminations & Fasteners

1. **Output Screws (Terminals 1 & 2):**
   - 2× 8-32 UNC $\times 3/8\text{ in}$ nickel-plated brass screws with captive saddle clamps.
   - Recommended torque: $2.0\text{ Nm}$ (18 in-lb).
   - Wire gauge: 12 AWG / $3.3\text{ mm}^2$ silicone-insulated high-temp wire (rated 200°C).
2. **Input Screws (Terminals 3 & 4):**
   - 2× 6-32 UNC $\times 1/4\text{ in}$ nickel-plated brass screws with captive saddle clamps.
   - Recommended torque: $1.2\text{ Nm}$ (10 in-lb).
   - Wire gauge: 20 AWG twisted-pair control wire from Eurotherm 3216 Terminals 1A/1B.
3. **Mounting Fasteners to Heatsink:**
   - 2× DIN 912 / ISO 4762 M4 $\times 12\text{ mm}$ A2-70 stainless steel socket head cap screws.
   - 2× DIN 127 M4 stainless steel helical spring lock washers.
   - 2× DIN 125 M4 flat stainless steel washers.
   - Tightening torque: $1.5\text{ Nm}$ to achieve optimal thermal interface pressure ($30\text{--}50\text{ psi}$).
