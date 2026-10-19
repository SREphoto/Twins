# Research Sources & OEM Citations — Muffle Furnace Digital Twin

**Primary Machine Target:** Nabertherm LT 9/11 Laboratory Muffle Furnace with Parallel Lift Door & Eurotherm 3216 Temperature Controller  
**Research Custodian:** Research & Specifications Subagent (`twin_spec_researcher`)  
**Adherence Standard:** Strict OEM Engineering Fidelity, Zero Dimension Hallucination  

---

## 1. Primary OEM Manufacturer References

### 1.1 Nabertherm GmbH
- **Headquarters:** Bahnhofstr. 20, 28865 Lilienthal, Germany
- **Website:** <https://nabertherm.com/en/products/laboratory-furnaces/>
- **Primary OEM Document:** *Nabertherm Laboratory Furnaces & Accessories Catalog* (Document B40/01.24)
  - Locally archived: `muffle_furnace_twin/research/manuals/nabertherm_laboratory_catalog.pdf`
  - Key Catalog Pages:
    - **Page 6:** Standard Equipment & Feature Lineage: L 3/11 to LT 60/12, dual shell housing, ceramic heating plates, Type N & Type S thermocouples, parallel lift door kinematics with hot face directed away from operator.
    - **Page 7:** Dimensional and Performance Specification Matrix: L(T) 9/11 inner chamber dimensions ($235 \times 240 \times 170\text{ mm}$, $9\text{ L}$), outer dimensions ($415 \times 455 \times 515\text{ mm}$, open height $515 + 240 = 755\text{ mm}$), connected load ($3.3\text{ kW}$), electrical supply ($230\text{ V } 1/\text{N/PE}$), weight ($35\text{ kg}$), heat-up time ($63\text{ min}$ to $1000^\circ\text{C}$), and DIN 17052-1 thermal uniformity workspace ($180 \times 150 \times 120\text{ mm}$, $\pm 5\text{ K}$).
    - **Page 8:** LE 14/11 Economy Furnace reference showing expanded $D=485\text{ mm}$ / $W=485\text{ mm}$ dimensional variants.
    - **Page 13:** Ashing furnace LV 9/11 and LVT 9/11 showing depth $D=485\text{ mm}$ and chimney airflow pre-heat path.
    - **Page 14–15:** Ashing and weighing furnaces (L 9/11/SW) showing base-mounted electronics bay and balance integration.
    - **Page 84:** Controller Compatibility Matrix & Supply Voltage specifications: 3216 / 3208 / B500 / B510 controller compatibility with L 3 to LT 60 line; single-phase multi-range voltage $110\text{--}240\text{ V AC}$ at $50/60\text{ Hz}$.

### 1.2 Eurotherm by Schneider Electric
- **Headquarters:** Faraday Close, Worthing, West Sussex, BN13 3PL, United Kingdom
- **OEM Document:** *Eurotherm 3216 / 3208 / 3204 Engineering Handbook* (Part No. HA027986, Issue 14; Specification Sheet HA028600)
- **Key Specifications Verified:**
  - 1/16 DIN form factor: $48 \times 48\text{ mm}$ front bezel, $90\text{ mm}$ behind-panel depth, $45 \times 45\text{ mm}$ cutout.
  - IP65 / NEMA 4 front face sealing with captive silicone gasket.
  - 32-bit ARM Cortex-M4 RISC core executing precision digital PID loop with instantaneous overshoot suppression (*Cutback High / Low*).
  - Dual multi-line display: 4-digit 10 mm 7-segment green/red PV display; 5-character 8 mm 16-segment starburst SV display.
  - 4 front elastomeric pushbuttons: `[ 📄 PAGE ]`, `[ 📜 SCROLL ]`, `[ ▼ DOWN ]`, `[ ▲ UP ]`.
  - Universal input: NIST/IEC Type S thermocouple support with cold-junction compensation accuracy $< \pm 0.5^\circ\text{C}$.
  - Logic/SSR drive output: $12\text{ V DC} @ 30\text{ mA}$ for driving external solid-state relay.

### 1.3 Sensata Technologies / Crydom Inc.
- **Headquarters:** 2475 Paseo de las Americas, San Diego, CA 92154, USA
- **OEM Document:** *Crydom Series 1 AC Output Solid State Relays Datasheet* (Model D2440)
- **Key Specifications Verified:**
  - Industry-standard "hockey puck" package: $57.3 \times 44.5 \times 22.6\text{ mm}$, mounting holes at $47.6\text{ mm}$ centers.
  - Continuous load current: $40\text{ A RMS}$ at $40^\circ\text{C}$ baseplate temperature.
  - Operating voltage: $24\text{--}280\text{ V AC RMS}$ ($47\text{--}63\text{ Hz}$).
  - Control input: $3\text{--}32\text{ V DC}$ opto-isolated (4000 Vrms isolation).
  - Zero-cross turn-on ($< 20\text{ V}$ window) to eliminate switching harmonics and EMI.
  - Thermal resistance: $R_{\theta jc} = 0.48^\circ\text{C/W}$; mounted to Crydom HS-2 extruded finned aluminum heatsink ($R_{\theta sa} = 1.20^\circ\text{C/W}$).

### 1.4 Kanthal (Sandvik Materials Technology / Alleima)
- **Headquarters:** Hallstahammar, Sweden
- **OEM Document:** *Kanthal A-1 Resistance Heating Wire Technical Handbook*
- **Key Specifications Verified:**
  - Ferritic FeCrAl alloy (73% Fe, 22% Cr, 5.8% Al).
  - Maximum continuous wire temperature: $1400^\circ\text{C}$.
  - Wire diameter: $\varnothing 1.6\text{ mm}$ (14 AWG), coiled into $\varnothing 14\text{ mm}$ OD helical springs, $4.5\text{ mm}$ pitch.
  - Connected load: $3.3\text{ kW}$ at $230\text{ V AC} \implies 14.35\text{ A RMS}$, nominal hot resistance $16.03\text{ }\Omega$.

### 1.5 ebm-papst Inc.
- **Headquarters:** Mulfingen, Germany
- **OEM Document:** *ebm-papst 8412 NGL DC Axial Fan Datasheet*
- **Key Specifications Verified:**
  - Dimensions: $80 \times 80 \times 25\text{ mm}$, mass $95\text{ g}$.
  - Airflow: $33\text{ CFM}$ ($56\text{ m}^3/\text{h}$); dual precision ball bearing system ($L_{10} > 70,000\text{ hrs}$).
  - Operating voltage: $12\text{ V DC}$, $0.9\text{ W}$, sound pressure $19\text{ dB(A)}$.
  - Purpose: Convective ventilation of double-walled casing, keeping outer surface $< 45^\circ\text{C}$.

### 1.6 Noratel / Talema Group
- **OEM Document:** *Talema 50VA Toroidal Power Transformer Datasheet* (Series 62000)
- **Key Specifications Verified:**
  - Power rating: $50\text{ VA}$, primary $230\text{ V AC}$, dual secondaries $2 \times 12\text{ V AC} @ 2.08\text{ A}$.
  - Dimensions: $\varnothing 80\text{ mm} \times 35\text{ mm}$ height.
  - Center bolt mounting: M6 stud with dish washer and neoprene vibration isolation dampeners.

---

## 2. Summary Comparison Matrix: Nabertherm L 9/11 vs LT 9/11

| Engineering Parameter | Flap Door Variant (L 9/11) | Parallel Lift Door Variant (LT 9/11) | Twin Target |
| :--- | :--- | :--- | :--- |
| **Door Kinematics** | Bottom-hinged fold-down flap ($90^\circ$ swing) | Vertical parallel linear slide ($\Delta Y = 240\text{ mm}$) | **LT 9/11 (Lift Door)** |
| **Open Height / Envelope** | $H = 515\text{ mm}$, $+240\text{ mm}$ forward overhang | $H = 515\text{ mm}$ closed, $H = 755\text{ mm}$ fully raised | **$H=755\text{ mm}$ Open** |
| **Hot Face Orientation** | Faces upward toward operator (doubles as shelf) | Faces upward/away from operator inside rear hood | **Hot Face Shielded** |
| **Guidance System** | Dual side quadrant friction hinges | Dual internal stainless C-channels & guide shoes | **Dual C-Channels** |
| **Counterbalancing** | Torsion spring assist in bottom hinge | Dual $3.6\text{ kg}$ counterweights & wire rope pulleys | **Dual Counterweights** |
| **Chamber Dimensions** | $235 \times 240 \times 170\text{ mm}$ ($9\text{ L}$) | $235 \times 240 \times 170\text{ mm}$ ($9\text{ L}$) | **$235 \times 240 \times 170\text{ mm}$** |
| **Cabinet Outer Width** | $415\text{ mm}$ baseline | $415\text{ mm}$ baseline ($485\text{ mm}$ envelope max) | **$415\text{ mm}$ unibody** |
| **Connected Heating Load** | $3.3\text{ kW}$ | $3.3\text{ kW}$ | **$3.3\text{ kW}$** |
| **Mains Supply** | $230\text{ V AC 1/N/PE}$, $14.35\text{ A}$ | $230\text{ V AC 1/N/PE}$, $14.35\text{ A}$ | **$230\text{ V AC}$, 16A fuse** |
| **Temperature Sensor** | Type N ($1100^\circ\text{C}$) or Type S | High-purity Pt10%Rh/Pt Type S in $\text{Al}_2\text{O}_3$ sheath | **Type S Thermocouple** |
| **Primary Controller** | Eurotherm 3216 / Nabertherm B510 | Eurotherm 3216 / Nabertherm B510 | **Eurotherm 3216** |

---

## 3. Local Archive & Document Traceability

1. `muffle_furnace_twin/research/manuals/nabertherm_laboratory_catalog.pdf`: Primary OEM catalog (19.2 MB).
2. `muffle_furnace_twin/research/nabertherm_lt9_11_specifications.md`: Detailed engineering breakdown of Nabertherm LT 9/11.
3. `muffle_furnace_twin/research/eurotherm_3216_controller_spec.md`: Detailed engineering breakdown of Eurotherm 3216 PID controller.
4. `muffle_furnace_twin/research/crydom_d2440_ssr_spec.md`: Detailed engineering breakdown of Crydom D2440 solid-state relay.
5. `muffle_furnace_twin/docs/dimensions.md`: 1:1 engineering dimensions, tolerances, clearance boundaries, and mechanical kinematics.
6. `muffle_furnace_twin/docs/BOM.md`: Exhaustive bill of materials with semantic part taxonomy, DIN fasteners, and material grades.