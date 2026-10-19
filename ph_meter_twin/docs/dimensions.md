# Dimensions — PH-7000 Pro Digital Twin

Comprehensive dimensional specifications based on the Mettler Toledo SevenExcellence S470 benchtop pH/ion meter with EasyPlace articulated electrode stand, cross-referenced with Thermo Scientific Orion Star A211.

## Datum & Coordinate System
- Datum Plane: Laboratory bench top surface at datum $Y = 0$ local (laboratory workbench top at $Y = 9.00$ world).
- Origin $(0, 0, 0)$: Center of meter base pan resting on workbench.
- Coordinate axes: $+X$ = Right, $+Y$ = Up (vertical), $-Z$ = Front (operator facing), $+Z$ = Rear.
- Unit Scale: 1 unit = 100 mm (0.10 m).

---

## 1. Main Controller Unit (Body_Chassis)

| Parameter | Imperial | Metric | Units in 3D (1 = 100mm) | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Overall Width | 7.48 in | 190 mm | 1.90 | Main chassis unibody casting |
| Overall Depth | 9.45 in | 240 mm | 2.40 | Front lip to rear bulkhead |
| Front Lip Height | 0.87 in | 22 mm | 0.22 | Low ergonomic wrist rest profile |
| Rear Crest Height | 3.54 in | 90 mm | 0.90 | Sloped console elevation |
| Console Incline Angle | 18.5° | 18.5° | 0.323 rad | Anti-glare operator viewing angle |
| Base Pan Thickness | 0.24 in | 6 mm | 0.06 | Die-cast aluminum base pan |
| Leveling Feet Standoff | 0.24 in | 6 mm | 0.06 | 4 Neoprene leveling feet at corners |
| Total Net Mass | 5.07 lb | 2.30 kg | — | Internal ballast & shielded electronics |

---

## 2. Dynamic Touchscreen & Console Deck (UI_LCD & Bezel)

| Component | Dimensions (Metric) | 3D Scale (Units) | Material / Specification |
| :--- | :--- | :--- | :--- |
| Bezel Pocket | 162 mm × 120 mm × 3 mm | 1.62 × 1.20 × 0.03 | Recessed matte slate bezel pocket |
| UI_LCD Quad | 142 mm × 76 mm | 1.42 × 0.76 | 7.0-inch 800×480 dynamic high-DPI TFT |
| Active Display Area | 138 mm × 72 mm | 1.38 × 0.72 | 16:9 widescreen capacitive multitouch |
| Glass_ScreenLens | 146 mm × 80 mm × 1.2 mm | 1.46 × 0.80 × 0.012 | Chemically toughened aluminosilicate glass |
| Membrane Button Deck | 160 mm × 26 mm | 1.60 × 0.26 | 5 Tactile keys with chrome bezels |
| Individual Keycaps (5) | 24 mm × 18 mm × 2.5 mm | 0.24 × 0.18 × 0.025 | Tactile membrane keys: READ, CAL, MODE, SETUP, HOLD |
| Key-to-Key Pitch | 32 mm | 0.32 | Ergonomic 8 mm gap between keys |
| Badge_SREdesigns | 54 mm × 16 mm × 1.5 mm | 0.54 × 0.16 × 0.015 | Brushed aluminum brand badge on lower right lip |

---

## 3. Rear I/O Bulkhead Panel (Plate_RearIO_Bulkhead)

| Port ID | Type / Connector | Location $(X, Y, Z)$ | Specification |
| :--- | :--- | :--- | :--- |
| `Port_BNC_pH` | MIL-STD-348 BNC Female | $(-0.48, 0.40, +1.18)$ | Teflon-insulated gold pin, >10¹² Ω input |
| `Port_ATC_Temp` | Mini-DIN 4-Pin Circular | $(-0.16, 0.40, +1.18)$ | PT1000 Class A thermistor interface |
| `Port_RS232` | DB-9 Female D-Sub | $(+0.22, 0.40, +1.18)$ | GLP printer / LIMS telemetry communication |
| `Port_USB` | Dual USB-A & USB-B | $(+0.46, 0.40, +1.18)$ | Flash storage export & PC automation |
| `Port_IEC` | DC Coaxial Barrel Jack | $(+0.66, 0.40, +1.18)$ | 12 VDC / 2.5 A locking barrel jack |

---

## 4. Articulated Electrode Stand (Body_StandAssembly)

| Component | Dimensions (Metric) | 3D Scale (Units) | Kinematics & Function |
| :--- | :--- | :--- | :--- |
| Stand Base Pan | ⌀110 mm × 16 mm | ⌀1.10 × 0.16 | Heavy die-cast zinc anti-tip base |
| Stand Mast Column | ⌀14 mm × 320 mm | ⌀0.14 × 3.20 | Polished 304 stainless steel mast |
| Stand Base Position | $(+1.40, 0, -0.20)$ | $(+1.40, 0, -0.20)$ | Rigidly anchored beside meter |
| Mast Swivel Collar | ⌀20 mm × 22 mm | ⌀0.20 × 0.22 | Height-adjustable lock collar with thumbscrew |
| Lower Parallelogram Link | 150 mm dual rods | $L = 1.50$ | Articulated twin stainless rods |
| Upper Parallelogram Link | 140 mm dual rods | $L = 1.40$ | Articulated twin stainless rods |
| Electrode Clamping Head | 48 mm × 12 mm × 26 mm | 0.48 × 0.12 × 0.26 | 3-position clamp (pH, ATC, stirrer) |
| Raised Position Height | Head $Y = 2.05$, Tip $Y = 1.30$ | Head $Y = 2.05$, Tip $Y = 1.30$ | Clears beaker rim ($Y = 1.05$) by +25 mm |
| Lowered Position Height | Head $Y = 1.15$, Tip $Y = 0.40$ | Head $Y = 1.15$, Tip $Y = 0.40$ | Submerged 30 mm into buffer solution |
| Horizontal Stroke Travel | Aligned with Beaker Center | $Z = -0.90$ | Parallel kinematics maintain probe vertical |

---

## 5. Sensor Probes & Labware Consumables

| Item | Dimensions (Metric) | 3D Scale (Units) | Real-World Description |
| :--- | :--- | :--- | :--- |
| InLab Expert Pro pH Probe | ⌀12 mm × 120 mm shaft | ⌀0.12 × 1.20 | Borosilicate glass body, ARGENTHAL reference |
| Glass Sensing Bulb | ⌀11 mm sphere | ⌀0.11 sphere | Hydrated lithium-doped glass bulb |
| Wetting Storage Cap | ⌀15 mm × 26 mm vial | ⌀0.15 × 0.26 | Screw collar with 3M KCl wetting solution |
| ATC Temperature Probe | ⌀3 mm × 120 mm probe | ⌀0.03 × 1.20 | 316L SS sheath, PT1000 Class A thermistor |
| 150 mL Griffin Beaker | ⌀60 mm × 80 mm | ⌀0.60 × 0.80 | Borosilicate glass 3.3, graduation rings |
| Beaker Solution Meniscus | ⌀56 mm × 55 mm | ⌀0.56 × 0.55 | Translucent solution liquid (100 mL volume) |
| Beaker Station Location | $(+1.40, 0, -0.90)$ | $(+1.40, 0, -0.90)$ | Perfectly centered beneath electrode arc |
| Buffer Bottles (pH 4, 7, 10)| ⌀46 mm × 85 mm | ⌀0.46 × 0.85 | 100 mL HDPE bottles with color-coded caps |
| 500 mL Wash Bottle | ⌀65 mm × 185 mm | ⌀0.65 × 1.85 | Low-density polyethylene with curved siphon |

---

## 6. Power Supply & Electrical Continuity

| Component | Dimensions (Metric) | 3D Scale (Units) | Specification |
| :--- | :--- | :--- | :--- |
| `Power_Receptacle_Duplex`| 70 mm × 115 mm × 50 mm | 0.70 × 1.15 × 0.50 | 120V/20A dual NEMA 5-15R lab bench pedestal |
| `Power_Plug_NEMA` | 42 mm × 32 mm × 54 mm | 0.42 × 0.32 × 0.54 | Molded 3-prong NEMA 5-15P plug with ground pin |
| `Power_Cord_SJTOW` | ⌀8.5 mm heavy jacket | ⌀0.085 3-cond | 300V oil-resistant heavy flexible SJTOW cord |
| `Body_PowerAdapter_Brick`| 55 mm × 32 mm × 110 mm | 0.55 × 0.32 × 1.10 | 100-240V AC to 12V DC medical-grade SMPS |
