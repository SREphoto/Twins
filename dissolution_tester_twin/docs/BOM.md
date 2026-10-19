# Bill of Materials (BOM) & Semantic Part Taxonomy: Agilent 708-DS Dissolution Tester

All components adhere strictly to the naming taxonomy in `.agents/AGENTS.md`.

## 1. Structural Enclosure & Frame

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Body_Chassis` | Main lower base pan enclosure ($622 \times 590 \times 140\text{ mm}$) | Textured epoxy Glacier White (`#e2e8f0`), $R=0.45, M=0.08$ | Root |
| `Column_ElevatorGuide_L` | Left precision ground guide column ($\varnothing 25.4\text{ mm} \times 700\text{ mm}$) | Hard chrome-plated steel, $R=0.15, M=0.92$ | `Body_Chassis` |
| `Column_ElevatorGuide_R` | Right precision ground guide column ($\varnothing 25.4\text{ mm} \times 700\text{ mm}$) | Hard chrome-plated steel, $R=0.15, M=0.92$ | `Body_Chassis` |
| `Screw_ElevatorLead` | Motorized center lead screw ($\varnothing 16.0\text{ mm}$, pitch $5.0\text{ mm}$) | 304 stainless steel threaded shaft | `Body_Chassis` |
| `Head_DriveAssembly` | Motorized elevator drive head housing ($610 \times 480 \times 180\text{ mm}$) | Textured epoxy Glacier White, $R=0.45, M=0.08$ | `Screw_ElevatorLead` |
| `Badge_SREdesigns` | Official SREdesigns precision branded identity badge | Brushed aluminum plate with cyan/white silkscreen logo | `Head_DriveAssembly` |
| `Foot_Leveling_FL`..`RR` | 4 heavy-duty knurled M12 leveling feet with vulcanized pads | Nitrile rubber & zinc-plated steel | `Body_Chassis` |

---

## 2. Water Bath & Vessel Hardware

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Bath_AcrylicWater` | 8-position seamless molded optical acrylic water bath | Optical acrylic (`MeshPhysicalMaterial`, $IOR=1.49, T=0.96$) | `Body_Chassis` |
| `Water_BathBulk` | Heated bulk water filling bath ($28\text{ L}$) at $37.0^\circ\text{C}$ | Water shader ($IOR=1.333, T=0.98, R=0.02$) | `Bath_AcrylicWater` |
| `Ring_TruCenter_01`..`08` | 8 precision TruCenter self-centering collar rings | Molded blue POM delrin / stainless steel | `Bath_AcrylicWater` |
| `Glass_Vessel_01`..`08` | 8 precision USP borosilicate glass vessels ($1000\text{ mL}$) | Optical borosilicate glass ($IOR=1.52, T=0.95$) | `Bath_AcrylicWater` |
| `Fluid_Medium_01`..`08` | Dissolution medium inside vessels ($900\text{ mL}$) with swirling vortex | Clear aqueous medium ($IOR=1.333, T=0.97$) | `Glass_Vessel_*` |
| `Tablet_Sample_01`..`08` | Solid dosage form (API tablet) undergoing Noyes-Whitney dissolution | Compacted powder crystalline matrix (`#fef3c7`) | `Fluid_Medium_*` |

---

## 3. Spindles & USP Stirring Tooling

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Shaft_Spindle_01`..`08` | 8 precision ground 316SS rotating spindle shafts ($\varnothing 9.525\text{ mm}$) | Mirror electropolished 316SS, $R=0.10, M=0.95$ | `Head_DriveAssembly` |
| `Paddle_USP2_01`..`08` | 8 USP Apparatus 2 electropolished paddle blades ($74.5 \times 19\text{ mm}$) | Electropolished 316SS, $R=0.12, M=0.92$ | `Shaft_Spindle_*` |
| `Collet_SpindleQuick_01`..`08`| Quick-release spindle height adjustment collet hubs | Anodized blue aluminum, $R=0.25, M=0.80$ | `Shaft_Spindle_*` |
| `Motor_SpindleDrive` | High-torque brushless DC servo motor with optical encoder | Cast aluminum motor housing | `Head_DriveAssembly` |
| `Belt_SynchronousHTD` | Synchronous HTD 5M timing belt coupling 8 drive pulleys | Fiber-reinforced neoprene belt | `Head_DriveAssembly` |

---

## 4. External Heater / Circulator & Plumbing

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Unit_HeaterCirculator` | External AutoTemp $1150\text{ W}$ heating bath circulator module | Powder-coated steel case with digital display | Bench Root |
| `Tube_CirculatorInlet` | Heavy-duty insulated silicone water supply hose ($\varnothing 16\text{ mm}$) | Braided translucent silicone tubing | `Unit_HeaterCirculator` |
| `Tube_CirculatorOutlet` | Heavy-duty insulated silicone water return hose ($\varnothing 16\text{ mm}$) | Braided translucent silicone tubing | `Unit_HeaterCirculator` |
| `Port_QuickDisconnect_01`..`02`| Chrome-plated brass valved quick-disconnect fluid fittings | Brass / chrome-plated quick couplings | `Bath_AcrylicWater` |

---

## 5. Electronics, Display & Power Continuity

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `UI_LCD` | 5.5-Inch dynamic CanvasTexture touchscreen display quad | Dynamic CanvasTexture (`flipY=false, sRGB`), unpowered blackout | `Head_DriveAssembly` |
| `Glass_LCDLens` | Protective anti-reflective display window overlay | Optical transparent overlay (`opacity=0.06, R=0.05`) | `Head_DriveAssembly` |
| `Btn_ElevateUp` | Tactile push button: ELEVATE DRIVE HEAD UP | Silicone keycap with illuminated up chevron | `Head_DriveAssembly` |
| `Btn_ElevateDown` | Tactile push button: LOWER DRIVE HEAD DOWN | Silicone keycap with illuminated down chevron | `Head_DriveAssembly` |
| `Btn_StirStart` | Tactile push button: START SPINDLES (Green) | Silicone keycap with play symbol | `Head_DriveAssembly` |
| `Btn_StirStop` | Tactile push button: STOP SPINDLES (Red) | Silicone keycap with stop square symbol | `Head_DriveAssembly` |
| `Btn_Heater` | Tactile push button: BATH HEATER TOGGLE (Cyan) | Silicone keycap with temperature symbol | `Head_DriveAssembly` |
| `Switch_Power` | Main illuminated DPST red rocker AC power switch | Translucent red rocker with internal lamp | `Body_Chassis` |
| `Power_Receptacle_Duplex` | Cast aluminum bench duplex receptacle box (NEMA 5-15R) | Cast aluminum housing with stainless faceplate | Bench Root |
| `Part_PowerPlugNEMA` | Molded 3-prong NEMA 5-15P grounded AC power plug | Molded black PVC with brass blades and ground pin | `Power_Receptacle_Duplex` |
| `Cable_ACPowerCord` | 3-wire 14 AWG heavy-duty SJTOW neoprene AC power cord | Flexible black rubber tube routing to rear IEC inlet | `Body_Chassis` |

---

## 6. Fasteners & Mechanical Hardware

| Semantic Part ID | Description | Dimensions / Standard | Qty |
| :--- | :--- | :--- | :--- |
| `Fastener_HexM5_Frame_*` | Hex socket head cap screws securing base frame and bath brackets | M5 x 16mm ISO 4762 304SS | 16 |
| `Fastener_SetScrew_Collet_*`| Set screws locking paddle height on spindle shaft | M4 x 6mm cup point 316SS | 8 |
| `Fastener_HexM6_Column_*` | Heavy-duty bolts anchoring elevator guide columns | M6 x 25mm Grade 8.8 steel | 8 |
