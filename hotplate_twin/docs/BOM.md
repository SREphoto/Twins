# Bill of Materials (BOM) — Magnetic Hotplate Stirrer (`STIR-HEAT 500-D`)

Comprehensive parametric engineering BOM covering all genuine 3D physical parts, fasteners, electronics, optics, and runtime Three.js node bindings. Zero abstract primitives; zero flat normal-map fakes.

---

## 1. Structural & Housing Assembly

| Part ID | Part Name | Qty | Physical Dimensions | Material / Finish | Three.js Node Name |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `STR-01` | Die-cast Unibody Lower Enclosure | 1 | $160 \times 270 \times 85\text{ mm}$ | Die-cast aluminum, matte white powder coat | `Body_Chassis` |
| `STR-02` | Bottom Stamped Base Pan | 1 | $154 \times 264 \times 1.5\text{ mm}$ | Galvanized steel sheet | `Chassis_BasePlate` |
| `STR-03` | Recessed Display Pocket | 1 | $92 \times 44 \times 2.0\text{ mm}$ | CNC milled / die-cast recessed bezel cavity | `Pocket_Bezel` |
| `STR-04` | Rear Service / Louver Panel | 1 | $150 \times 55 \times 2\text{ mm}$ | Perforated aluminum louver grille | `Panel_RearLouver` |
| `STR-05` | Leveling Vibration Feet | 4 | $\varnothing 24 \times 12\text{ mm}$ | Vulcanized Neoprene pad + M6 brass threaded stud | `Foot_Leveling_FL`, `_FR`, `_RL`, `_RR` |

---

## 2. Thermal Heating Subsystem

| Part ID | Part Name | Qty | Physical Dimensions | Material / Finish | Three.js Node Name |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `HEAT-01`| Circular Heating Top Plate | 1 | $\varnothing 135 \times 15\text{ mm}$ | Cast aluminum alloy, white ceramic enamel | `Plate_Heating` |
| `HEAT-02`| Thermal Anti-Spill Collar | 1 | $\varnothing 142 \times 3\text{ mm}$ | Fluoropolymer / stainless steel drip seal | `Plate_SpillCollar` |
| `HEAT-03`| Heating Element Core | 1 | Spiral 600W coil | Nichrome 80/20 embedded in magnesium oxide | `Element_HeaterCoil` |
| `HEAT-04`| Ceramic Fiber Thermal Barrier | 1 | $\varnothing 130 \times 12\text{ mm}$ | High-density microporous ceramic insulation | `Core_ThermalInsulator` |
| `HEAT-05`| Internal Pt1000 Plate RTD | 1 | Thin film detector | Platinum film on ceramic substrate | `Sensor_PlateRTD` |

---

## 3. Magnetic Stirring Subsystem

| Part ID | Part Name | Qty | Physical Dimensions | Material / Finish | Three.js Node Name |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MAG-01` | Dual Rare-Earth Magnet Carrier | 1 | $80 \times 20 \times 10\text{ mm}$ | Dynamic balanced steel yoke bar | `Pivot_StirDrive` |
| `MAG-02` | NdFeB High-Temp Magnets | 2 | $\varnothing 18 \times 8\text{ mm}$ | Grade N45SH Neodymium ($T_{\max} = 150^\circ\text{C}$) | `Magnet_Drive_N`, `Magnet_Drive_S` |
| `MAG-03` | Brushless DC Motor & Spindle | 1 | $\varnothing 60 \times 50\text{ mm}$ | Electronically commutated 24V BLDC motor | `Motor_BLDC` |
| `MAG-04` | Spindle Deep-Groove Ball Bearings| 2 | $\varnothing 19 \times \varnothing 8 \times 6\text{ mm}$ | ABEC-5 stainless steel bearings | `Bearing_Spindle_Upper`, `_Lower` |
| `MAG-05` | PTFE Magnetic Stir Bar | 1 | $\varnothing 8 \times 25\text{ mm}$ | Pure virgin PTFE encapsulated Alnico V magnet | `Pivot_StirBar` |

---

## 4. Electronics, Controls & Badging

| Part ID | Part Name | Qty | Physical Dimensions | Material / Finish | Three.js Node Name |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ELEC-01`| Liquid Crystal Display (LCD) | 1 | $84 \times 36\text{ mm}$ | Transmissive STN negative LCD, cyan backlight | `UI_LCD` |
| `ELEC-02`| Speed Encoder Dial | 1 | $\varnothing 32 \times 16\text{ mm}$ | Knurled matte black ABS + white index pointer | `Knob_Speed` (`Pivot_KnobSpeed`) |
| `ELEC-03`| Temperature Encoder Dial | 1 | $\varnothing 32 \times 16\text{ mm}$ | Knurled matte black ABS + white index pointer | `Knob_Temp` (`Pivot_KnobTemp`) |
| `ELEC-04`| Illuminated Power Rocker Switch | 1 | $22 \times 14\text{ mm}$ | Green illuminated DPST 16A rocker switch | `Btn_Power` |
| `ELEC-05`| Safety Circuit Limiter Trimpot | 1 | $\varnothing 6\times 8\text{ mm}$ | Slotted brass calibration screw ($50\text{--}360^\circ\text{C}$) | `Btn_SafeTemp` |
| `ELEC-06`| Hot Warning LED Indicator | 1 | $\varnothing 5\text{ mm}$ | Flashing red safety LED ($T_{\text{plate}} > 50^\circ\text{C}$) | `LED_HotWarning` |
| `ELEC-07`| SREdesigns Official Brand Plaque | 1 | $32 \times 9\times 1.2\text{ mm}$ | Brushed anodized aluminum with teal enamel tiles | `Badge_SREdesigns` |

---

## 5. Support Stand, Clamp & Immersion Probe

| Part ID | Part Name | Qty | Physical Dimensions | Material / Finish | Three.js Node Name |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ROD-01` | M10 Internal Retort Rod Boss | 1 | M10 internal thread | CNC threaded steel insert in chassis casting | `Boss_RetortMount` |
| `ROD-02` | Vertical Retort Support Rod | 1 | $\varnothing 12 \times 450\text{ mm}$ | 304 centerless ground stainless steel | `Rod_Support` |
| `ROD-03` | Boss Head Dual Clamp | 1 | $38 \times 32 \times 28\text{ mm}$ | Die-cast aluminum alloy, hammer-finish grey | `Clamp_BossHead` |
| `ROD-04` | Clamp M6 Knurled Thumbscrews | 2 | M6 with $\varnothing 16\text{ mm}$ head | Brass knurled thumbscrews | `Fastener_Thumb_01`, `_02` |
| `ROD-05` | Sensor Extension Holding Arm | 1 | $\varnothing 8 \times 140\text{ mm}$ | Stainless steel rod with clamp eyelet | `Arm_ProbeHolder` |
| `ROD-06` | External Immersion PT1000 Probe | 1 | $\varnothing 3 \times 200\text{ mm}$ | 316Ti acid-resistant stainless steel sheath | `Probe_PT1000` |
| `ROD-07` | Coiled Sensor Silicone Lead | 1 | Spiral helix $\varnothing 14\text{ mm}$ | Chemical-resistant black silicone jacket | `Cable_ProbeCoil` |

---

## 6. Glassware & Liquid Consumables

| Part ID | Part Name | Qty | Physical Dimensions | Material / Finish | Three.js Node Name |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GLAS-01`| 250 mL Griffin Beaker | 1 | $\varnothing 70 \times 95\text{ mm}$ | Borosilicate 3.3 glass ($IOR = 1.52$) | `Glass_Beaker` |
| `GLAS-02`| Enamel Graduation Markings | 1 | 50, 100, 150, 200 mL lines | Durable white ceramic fired enamel | `Glass_Graduations` |
| `GLAS-03`| Dynamic Liquid Column | 1 | $\varnothing 66.4 \times 50\text{ mm}$ | Translucent aqueous solution with dynamic vortex | `Fluid_Liquid` |

---

## 7. Fasteners & Standard Hardware

| Part ID | Part Name | Standard | Size | Qty | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `FST-01` | Top Plate Fasteners | DIN 912 | M4 $\times$ 12 mm | 4 | Stainless A2 hex socket cap screws |
| `FST-02` | Base Pan Fasteners | ISO 7380 | M3 $\times$ 8 mm | 6 | Stainless button head hex socket screws |
| `FST-03` | Rear Flange Fasteners | DIN 912 | M3 $\times$ 10 mm | 4 | Black oxide hex socket cap screws |
| `FST-04` | IEC C14 Inlet Fasteners | DIN 912 | M3 $\times$ 8 mm | 2 | Black oxide hex socket cap screws |
| `FST-05` | Leveling Lock Nuts | DIN 934 | M6 | 4 | Solid brass hex locking nuts |
| `FST-06` | Spring Lock Washers | DIN 127 | M4 | 4 | Split stainless spring washers |
