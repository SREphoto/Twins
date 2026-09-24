# Bill of Materials (BOM) — UV-Vis Spectrophotometer

Exhaustive breakdown of genuine 3D components modeled in `spectrophotometer_twin`.

---

## 1. Structural Housing & Enclosure

| Part Identifier | Description | Material / PBR | Qty |
| :--- | :--- | :--- | :--- |
| `Body_Chassis` | Main unibody casting with recessed display bezel & cooling louvers | Coated Lab Polymer (`#eef1f5`, roughness 0.4) | 1 |
| `Body_Baseplate` | Heavy die-cast aluminum baseplate datum ($Y=0$) | Anodized Aluminum (`#2a2e35`, metalness 0.8) | 1 |
| `Badge_SREdesigns`| Diamond-cut polished chrome branding plate | Chrome (`#d0d6de`, metalness 0.95, roughness 0.1) | 1 |
| `Foot_Leveling_FL`| Front-left threaded leveling foot with knurled collar | Vulcanized Nitrile Rubber (`#141618`) + Brass | 1 |
| `Foot_Leveling_FR`| Front-right threaded leveling foot | Vulcanized Nitrile Rubber + Brass | 1 |
| `Foot_Leveling_RL`| Rear-left threaded leveling foot | Vulcanized Nitrile Rubber + Brass | 1 |
| `Foot_Leveling_RR`| Rear-right threaded leveling foot | Vulcanized Nitrile Rubber + Brass | 1 |

---

## 2. Sample Chamber & Kinematic Mechanisms

| Part Identifier | Description | Material / PBR | Qty |
| :--- | :--- | :--- | :--- |
| `Pivot_ChamberLid`| Spring-assisted hinged chamber door with handle | Lab Polymer (`#d8dde6`) with dark interior seal | 1 |
| `Chamber_Basin` | Light-tight anodized black interior sample well | Matte Black Anodized (`#15171a`, roughness 0.85) | 1 |
| `Pivot_CellCarousel` | 6-position circular rotating cuvette turret | Machined Delrin (`#1e2024`, roughness 0.35) | 1 |
| `Glass_Cuvette_01` | Position 1 optical cell (Blank Solvent: pure $H_2O$) | Optical Borosilicate Glass ($IOR=1.52$) | 1 |
| `Glass_Cuvette_02` | Position 2 optical cell ($KMnO_4$, purple solution) | Optical Quartz Glass ($IOR=1.54$) | 1 |
| `Glass_Cuvette_03` | Position 3 optical cell (DNA / Nucleotide, clear solution) | Optical Quartz Glass ($IOR=1.54$) | 1 |
| `Glass_Cuvette_04` | Position 4 optical cell (Protein Bradford assay, blue) | Optical Glass ($IOR=1.52$) | 1 |
| `Glass_Cuvette_05` | Position 5 optical cell (Methylene Blue dye) | Optical Glass ($IOR=1.52$) | 1 |
| `Glass_Cuvette_06` | Position 6 optical cell (Empty reserve cell) | Optical Glass ($IOR=1.52$) | 1 |

---

## 3. Optical Train & Radiation Components

| Part Identifier | Description | PBR Appearance | Qty |
| :--- | :--- | :--- | :--- |
| `Source_Deuterium`| Deuterium UV arc discharge lamp (190–340 nm) | Quartz bulb with nickel envelope + violet glow | 1 |
| `Source_Tungsten` | Halogen visible source bulb (340–1100 nm) | Quartz halogen capsule with warm amber glow | 1 |
| `Monochromator_Box` | Sealed Czerny-Turner dispersion module | Cast aluminum housing with stepper drive | 1 |
| `Beam_Monochromatic` | Active optical probe beam path | Dynamic emissive beam (UV violet to Vis rainbow) | 1 |
| `Detector_Photodiode` | Solid-state PIN photodiode sensor housing | Anodized black cylinder with silica window | 1 |

---

## 4. Electronics, Control & Interface

| Part Identifier | Description | Taxonomy Role | Qty |
| :--- | :--- | :--- | :--- |
| `UI_LCD` | 7-inch color graphic capacitive touchscreen display | `UI_LCD` (Dynamic CanvasTexture, `flipY=false`) | 1 |
| `Btn_Power` | Illuminated main system standby power switch | Tactile bezel push switch | 1 |
| `Btn_Zero` | Physical Auto-Zero / Baseline correction key | Tactile membrane key | 1 |
| `Btn_Scan` | Physical Start/Stop spectrum scan key | Tactile membrane key | 1 |
| `Btn_Mode` | Physical mode cycle key (Photometric/Scan/Kinetics) | Tactile membrane key | 1 |
| `Btn_CellNext` | Manual cuvette carousel advance key | Tactile membrane key | 1 |

---

## 5. Genuine 3D Fasteners & Connectors

| Part Identifier | Standard | Nominal Size | Qty |
| :--- | :--- | :--- | :--- |
| `Fastener_HexM4_01` to `12` | DIN 912 / ISO 4762 | M4 × 12 mm Hex Socket Cap Screw | 12 |
| `Washer_M4_01` to `12` | DIN 125 | M4 Form A Plain Washer | 12 |
| `Fastener_HexM3_01` to `08` | DIN 912 | M3 × 8 mm Hex Socket Cap Screw | 8 |
| `Port_IEC_C14` | IEC 60320 | C14 Chassis Inlet with Rocker Switch | 1 |
| `Port_USB_A` | USB 2.0 / 3.0 | Type-A Bulkhead Receptacle | 2 |
| `Port_USB_B` | USB 2.0 | Type-B Device Port | 1 |
| `Port_RS232` | DB9 / DE-9 | RS-232 Female with Hex Standoffs | 1 |
| `Port_BNC_Trigger` | MIL-STD-348 | BNC 50-ohm Coaxial External Trigger | 1 |
