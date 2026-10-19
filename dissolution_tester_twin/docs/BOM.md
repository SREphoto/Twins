# Bill of Materials (BOM) & Semantic Part Taxonomy: Agilent 708-DS Dissolution Tester

All components adhere strictly to the naming taxonomy in `.agents/AGENTS.md` and the Centrifuge Gold Standard.

## 1. Structural Enclosure & Frame

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Body_Chassis` | Main lower base pan enclosure ($622 \times 590 \times 140\text{ mm}$) | Textured epoxy Glacier White (`#e2e8f0`), $R=0.45, M=0.08$ | Root |
| `Badge_SREdesigns` | Official SREdesigns precision branded certification badge mounted on LOWER FRAME | Brushed aluminum plate with cyan/white silkscreen logo | `Body_Chassis` |
| `Foot_Leveling_FL`..`RR` | 4 heavy-duty knurled M12 leveling feet with vulcanized NBR rubber suction pads | Nitrile rubber & zinc-plated steel | `Body_Chassis` |
| `Weight_BallastBase` | 12 kg cast iron ballast plate secured with 4× M8 hex bolts | Cast iron ($R=0.72, M=0.38$) | `Body_Chassis` |
| `Cover_TopHood` | Detachable upper drive head inspection hood plate | Powder-coated aluminum ($R=0.26, M=0.10$) | `Pivot_DriveHead` |

---

## 2. Motorized Elevator Mechanism & Kinematics

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Assembly_WormGearMotor` | 24V DC high-torque worm-gear reduction motor & cast alloy gearbox | Die-cast aluminum & alloy steel | `Body_Chassis` |
| `Coupling_SpiderJaw` | Flexible elastomeric spider jaw shaft coupling | Anodized aluminum hubs & polyurethane spider | `Assembly_WormGearMotor` |
| `Shaft_LeadScrew` | Precision ground Acme ball lead screw ($\varnothing 18\text{ mm}$, 4 TPI, length $680\text{ mm}$) | Hardened alloy steel, $R=0.16, M=0.88$ | `Body_Chassis` |
| `Nut_BronzeLeadNut` | Heavy-duty flanged bronze traveling nut fastened with 4× M5 screws to carriage yoke | Bearing bronze ($R=0.32, M=0.82$) | `Pivot_DriveHead` |
| `Bearing_ThrustPillow_Top` | Upper duplex angular-contact thrust ball bearing pillow block | Cast steel pillow housing & chrome steel balls | `Body_Chassis` |
| `Bearing_ThrustPillow_Btm` | Lower duplex angular-contact thrust ball bearing pillow block | Cast steel pillow housing & chrome steel balls | `Body_Chassis` |
| `Column_GuideShaft_L` | Left precision ground chrome guide column ($\varnothing 25.4\text{ mm} \times 720\text{ mm}$) | Hard chrome-plated steel, $R=0.14, M=0.92$ | `Body_Chassis` |
| `Column_GuideShaft_R` | Right precision ground chrome guide column ($\varnothing 25.4\text{ mm} \times 720\text{ mm}$) | Hard chrome-plated steel, $R=0.14, M=0.92$ | `Body_Chassis` |
| `Bushing_LinearBall_L` / `R`| Dual recirculating linear ball bushing pillow blocks on carriage | Case-hardened steel bushings | `Pivot_DriveHead` |
| `Assembly_CableDragChain` | Flexible nylon cable drag chain carrier (e-chain, 22 links) | Glass-reinforced PA66 nylon | `Body_Chassis` |
| `Sensor_Limit_Top` / `Btm` | Optical slotted interrupter limit switches with flag triggers | Infrared phototransistor module | `Body_Chassis` |

---

## 3. Base Electronics, Motherboard & Rear I/O Panel

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `PCB_Motherboard` | Main base system controller motherboard ($240 \times 160\text{ mm}$) | High-Tg FR-4 substrate, blue solder mask, gold pads | `Body_Chassis` |
| `Part_MCU_STM32` | 32-Bit ARM Cortex-M7 / DSP Dual-Core Microcontroller (480 MHz, BGA240) | Molded epoxy encapsulated IC with silkscreen laser text | `PCB_Motherboard` |
| `Part_RAM_Chip` | 64 MB High-Speed Synchronous SDRAM IC Memory Chip (TSOP-54) | Plastic SOIC encapsulation | `PCB_Motherboard` |
| `Part_SSD_Module` | 16 GB Internal Solid-State Flash Storage Drive Module | M.2 format SSD with controller and NAND flash | `PCB_Motherboard` |
| `Part_ToroidalTransformer`| Heavy-duty toroidal power transformer 120V/24V primary/secondary ($150\text{ VA}$) | Copper wire windings & Mylar insulation tape | `Body_Chassis` |
| `Part_BridgeRectifier` | 25A 600V full-wave bridge rectifier module | Metal case bridge rectifier | `PCB_Motherboard` |
| `Capacitor_Filter_01`..`03` | 3× 4700µF 50V Low-ESR aluminum electrolytic filter capacitors | Aluminum can with safety vent and PVC sleeve | `PCB_Motherboard` |
| `Part_HeatsinkAlum` | Finned extruded aluminum thermal management heatsink (12 fins) | Black anodized extruded aluminum 6063 | `PCB_Motherboard` |
| `Fan_BaseMotherboard` | 60mm Brushless DC 24V cooling fan with steel finger guard grille | PBT plastic housing, dual ball bearings | `Body_Chassis` |
| `Port_RS232_DB9` | Rear RS-232 DB-9 serial communication port with gold-plated pins | Tin-plated steel shell, gold-plated contacts | `Body_Chassis` |
| `Port_USB_B` | Rear USB Type-B peripheral communication port | Nickel-plated brass shell | `Body_Chassis` |
| `Port_RJ45_Ethernet` | Rear RJ45 10/100 Ethernet LAN port with green/amber link LEDs | Shielded metal housing | `Body_Chassis` |
| `Port_IEC_Inlet` | Rear IEC C14 AC power inlet with dual 5x20mm fuse drawer | High-temp thermoplastic | `Body_Chassis` |
| `Switch_Rocker` | Rear illuminated DPST rocker AC power switch (16A 250V) | Translucent red polycarbonate with neon bulb | `Body_Chassis` |
| `Stud_GroundM5` | M5 brass chassis ground stud with serrated star washer & twin nuts | Solid brass CW614N | `Body_Chassis` |

---

## 4. Drive Head Controls & Synchronous Stirring Spindles

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Pivot_DriveHead` | Motorized vertical drive head assembly ($610 \times 480 \times 180\text{ mm}$) | Textured epoxy Glacier White, $R=0.26, M=0.10$ | `Nut_BronzeLeadNut` |
| `UI_LCD` | 7.0-Inch dynamic CanvasTexture color touchscreen display quad | Dynamic CanvasTexture (`flipY=false, sRGB`), upright UVs | `Pivot_DriveHead` |
| `Glass_LCDLens` | Protective anti-reflective optical glass window overlay | Optical glass (`opacity=0.06, R=0.02, T=0.96`) | `Pivot_DriveHead` |
| `Btn_ElevUp` | Tactile push button: `[ ▲ ELEV UP ]` with cyan status LED | Molded PBT keycap, chrome bezel, microswitch | `Pivot_DriveHead` |
| `Btn_ElevDown` | Tactile push button: `[ ▼ ELEV DOWN ]` with cyan status LED | Molded PBT keycap, chrome bezel, microswitch | `Pivot_DriveHead` |
| `Btn_Start` | Tactile push button: `[ ▶ STIR RUN ]` with green status LED | Molded PBT keycap, chrome bezel, microswitch | `Pivot_DriveHead` |
| `Btn_Stop` | Tactile push button: `[ ⏹ STOP TRAY ]` with red status LED | Molded PBT keycap, chrome bezel, microswitch | `Pivot_DriveHead` |
| `Motor_SpindleDrive` | High-torque 24V brushless DC servo motor (stator core, 8 coils, rotor) | Laminated silicon steel, copper magnet wire | `Pivot_DriveHead` |
| `Belt_SynchronousHTD` | Synchronous HTD 5M timing belt coupling 8 drive pulleys & tensioners | Neoprene with fiberglass tensile cords | `Pivot_DriveHead` |
| `Pulley_Drive_01`..`08` | 8 precision machined aluminum timing pulleys with hobbed teeth | Anodized 6061-T6 aluminum | `Pivot_DriveHead` |
| `Encoder_OpticalDisk` | 120-slot precision photo-etched rotary encoder disk | Chemically etched 304SS | `Pivot_DriveHead` |
| `Shaft_Spindle_01`..`08` | 8 precision ground 316SS rotating spindle shafts ($\varnothing 9.525\text{ mm}$) | Mirror electropolished 316SS, $R=0.14, M=0.88$ | `Pivot_DriveHead` |
| `Paddle_USP2_01`..`08` | 8 USP Apparatus 2 electropolished paddle blades ($74.5 \times 19\text{ mm}$) | Electropolished 316SS, $R=0.14, M=0.88$ | `Shaft_Spindle_*` |
| `Collet_SpindleQuick_01`..`08`| Quick-release spindle height adjustment collet hubs | Anodized blue aluminum, $R=0.24, M=0.82$ | `Shaft_Spindle_*` |

---

## 5. Molded Acrylic Water Bath & TruCenter Labware

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Bath_Chamber` | 8-position seamless molded optical acrylic water bath (12mm base, 10mm walls) | Optical acrylic (`MeshPhysicalMaterial`, $IOR=1.49, T=0.96$) | `Body_Chassis` |
| `Bath_Water` | Thermoregulated heated water volume ($28\text{ L}$) at $37.0^\circ\text{C}$ with ripples | Water shader ($IOR=1.333, T=0.98, R=0.02$) | `Bath_Chamber` |
| `TruCenter_Ring_01`..`08` | 8 precision TruCenter self-centering collar rings with laser numerals | Anodized aluminum 6061 with laser etching | `Bath_Chamber` |
| `Glass_Vessel_01`..`08` | 8 precision 1000 mL USP borosilicate glass vessels with graduations | Optical borosilicate glass ($IOR=1.52, T=0.95$) | `Bath_Chamber` |
| `Liquid_Medium_01`..`08` | Dissolution medium inside vessels ($900\text{ mL}$) with swirling vortex | Clear aqueous medium ($IOR=1.333, T=0.97$) | `Glass_Vessel_*` |
| `Tablet_Solid_01`..`08` | Prednisone 10mg USP solid dosage form undergoing Noyes-Whitney erosion | Compacted powder crystalline matrix | `Liquid_Medium_*` |
| `Manifold_CirculatorDiffuser` | 316SS bottom water circulation manifold with 4 jet discharge nozzles | Electropolished 316SS tube | `Bath_Chamber` |

---

## 6. External AutoTemp 1150W Heater / Circulator (Internal Mechanics)

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Part_HeaterCirculatorAutoTemp`| Two-tone powder-coated steel enclosure with ergonomic top handle | Steel sheet metal & NBR rubber grip | Bench Root |
| `UI_CirculatorLCD` | High-DPI digital LED dual temperature display (actual / setpoint) | Dynamic CanvasTexture (`flipY=false, sRGB`) | `Part_HeaterCirculatorAutoTemp` |
| `Part_PumpMotorVolute` | Shaded-pole 120V circulator motor with cast brass volute chamber | Cast brass & copper stator windings | `Part_HeaterCirculatorAutoTemp` |
| `Impeller_Circulator` | 6-blade centrifugal water impeller | Molded PPS resin | `Part_PumpMotorVolute` |
| `Part_NichromeHeaterTube` | 1150W tubular Nichrome heating element in 316SS flow-through chamber | Incoloy sheath / 316SS cylindrical chamber | `Part_HeaterCirculatorAutoTemp` |
| `Switch_ThermalCutoff_01` | Primary bimetal snap-action thermal safety cutoff switch (open at 95°C) | Ceramic case & bimetal snap disc | `Part_NichromeHeaterTube` |
| `Switch_ThermalCutoff_02` | Secondary redundant manual-reset thermal safety cutoff switch (110°C) | Phenolic body with brass terminals | `Part_NichromeHeaterTube` |
| `TRIAC_HeaterController` | Solid-state 25A TRIAC AC power controller on aluminum heatsink | TO-3P package on finned bracket | `Part_HeaterCirculatorAutoTemp` |
| `PCB_Circulator` | AutoTemp microprocessor PID control board with flyback PSU & relay | FR-4 double-sided SMT PCB | `Part_HeaterCirculatorAutoTemp` |
| `Fan_Circulator` | 40mm Brushless DC internal electronics cooling fan | Glass-fiber filled PBT | `Part_HeaterCirculatorAutoTemp` |
| `Valves_QuickDisconnect` | Brass quick-disconnect shutoff couplings with internal check springs | Solid brass CW614N | `Part_HeaterCirculatorAutoTemp` |
| `Hoses_CirculatorSilicone` | Reinforced blue silicone supply and return fluid circulation hoses | High-temp braided silicone ($T=0.85$) | `Part_HeaterCirculatorAutoTemp` |
| `Clamps_WormDriveSS` | Genuine 3D stainless steel worm-drive hose clamps with slotted screws | 304SS band & screw housing | `Hoses_CirculatorSilicone` |

---

## 7. Fasteners & Mechanical Hardware

| Semantic Part ID | Description | Dimensions / Standard | Qty |
| :--- | :--- | :--- | :--- |
| `Fastener_HexM8_Ballast_*` | Hex head bolts securing 12 kg cast iron ballast plate | M8 x 30mm DIN 933 8.8 steel | 4 |
| `Fastener_SocketM5_BronzeNut_*`| Hex socket head cap screws fastening bronze lead nut to yoke | M5 x 20mm ISO 4762 A2-70 SS | 4 |
| `Fastener_SocketM4_Hood_*` | Knurled socket head cap screws securing detachable inspection hood | M4 x 12mm ISO 4762 316SS | 10 |
| `Fastener_SocketM5_Bearing_*` | Heavy-duty cap screws anchoring thrust bearing pillow blocks | M5 x 25mm ISO 4762 304SS | 8 |
| `Fastener_SocketM4_BasePan_*` | Base perimeter socket head screws clamping bottom enclosure | M4 x 10mm ISO 4762 304SS | 10 |
| `Fastener_SetScrew_Collet_*`| Knurled set screws locking spindle height on drive shafts | M4 x 6mm cup point 316SS | 8 |
