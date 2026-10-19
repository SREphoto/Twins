# Bill of Materials (BOM) & Semantic Part Taxonomy: Ultrasonic Cleaner 3000-PRO

**Document ID:** BOM-SEM-USC-3000PRO-001  
**Target Instrument:** SREdesigns Ultrasonic Cleaner 3000-PRO  
**Primary OEM Lineage:** Emerson Branson CPX5800H / 5800 Series & Elma Elmasonic S 300 / S 60  
**Standard Adherence:** `.agents/AGENTS.md` Semantic Part Taxonomy, Centrifuge Gold Standard, Zero Dimension Hallucination  

---

## 1. Structural Enclosure & Outer Chassis Assembly

| Semantic Part ID | Description & OEM Engineering Specifications | Material / PBR Finish | Fastener & Mounting Hardware | Parent Node |
| :--- | :--- | :--- | :--- | :--- |
| `Body_Chassis` | Main structural outer casing ($320.0 \times 200.0 \times 168.0\text{ mm}$). Features an internal $15\text{ mm}$ acoustic decoupling air gap isolating the cleaning basin from the casing and electronics. | 18-gauge cold-rolled structural steel ($1.2\text{ mm}$), powder-coated Glacier Cream (`#f1f5f9`), $R=0.32, M=0.10$ | Welded chassis shell with internal structural corner brackets | Root |
| `Body_BasePlinth` | Lower recessed base plinth skirt ($324.0 \times 204.0 \times 14.0\text{ mm}$) providing chassis elevation and convective intake airflow. | Folded structural sheet steel, Dark Charcoal powder coat (`#1e293b`), $R=0.48, M=0.25$ | 6× `Fastener_PanM3_Base_01`..`06` (DIN 7985 M3×8 mm screws), 6× DIN 125 M3 washers | `Body_Chassis` |
| `Badge_SREdesigns` | Official SREdesigns Brand Certification Badge ($55.0 \times 10.0 \times 1.5\text{ mm}$) with precision chamfered edge and procedural silkscreen faceplate. Flush mounted in front chassis pocket. | Brushed aircraft aluminum 6061-T6 backing plate ($R=0.20, M=0.85$) with etched enamel typography | 2× `Fastener_CSKM2_Badge_01`..`02` (DIN 7991 M2×5 mm countersunk screws) | `Body_Chassis` |
| `Foot_Leveling_FL` | Front Left knurled M6 leveling foot with vulcanized NBR rubber anti-vibration suction pad ($\varnothing 22.0\text{ mm} \times 12.0\text{ mm}$ height). Resting at bench datum $Y=0$. | Vulcanized Nitrile Butadiene Rubber (NBR, $R=0.85$) on zinc-plated Grade 8.8 steel stud | Integrated M6 × 20 mm threaded stud into welded M6 chassis base nut | `Body_BasePlinth` |
| `Foot_Leveling_FR` | Front Right knurled M6 leveling foot with vulcanized NBR rubber suction pad ($\varnothing 22.0\text{ mm}$). | Vulcanized NBR on zinc-plated Grade 8.8 steel stud | Integrated M6 × 20 mm threaded stud into welded M6 chassis base nut | `Body_BasePlinth` |
| `Foot_Leveling_RL` | Rear Left knurled M6 leveling foot with vulcanized NBR rubber suction pad ($\varnothing 22.0\text{ mm}$). | Vulcanized NBR on zinc-plated Grade 8.8 steel stud | Integrated M6 × 20 mm threaded stud into welded M6 chassis base nut | `Body_BasePlinth` |
| `Foot_Leveling_RR` | Rear Right knurled M6 leveling foot with vulcanized NBR rubber suction pad ($\varnothing 22.0\text{ mm}$). | Vulcanized NBR on zinc-plated Grade 8.8 steel stud | Integrated M6 × 20 mm threaded stud into welded M6 chassis base nut | `Body_BasePlinth` |
| `Vent_Louvre_Left` | Left convective intake louver grille ($60.0 \times 40.0\text{ mm}$, 6 stamped horizontal slots) providing airflow to generator bay. | Stamped directly into left chassis side wall | Integral sheet metal form | `Body_Chassis` |
| `Vent_Louvre_Right` | Right convective exhaust louver grille ($60.0 \times 40.0\text{ mm}$, 6 stamped horizontal slots) aligned with 60 mm cooling fan. | Stamped directly into right chassis side wall | Integral sheet metal form | `Body_Chassis` |
| `Plate_Serial` | Aluminum equipment serial and regulatory identification rating plate ($36.0 \times 9.0 \times 0.8\text{ mm}$) on left chassis flank. | Matte anodized aluminum sheet with laser-engraved electrical ratings | 2× `Fastener_RivetM2_Serial_01`..`02` (DIN 7337 $\varnothing 2.4\text{ mm}$ blind rivets) | `Body_Chassis` |

---

## 2. Cleaning Basin, Drain Valve, Lid & Wire Basket

| Semantic Part ID | Description & OEM Engineering Specifications | Material / PBR Finish | Fastener & Mounting Hardware | Parent Node |
| :--- | :--- | :--- | :--- | :--- |
| `Body_Basin` | Deep-drawn AISI 304 stainless steel cleaning tank ($230.0 \times 164.0 \times 145.0\text{ mm}$, working fluid capacity **5.50 Liters**). Floor incorporates $15\text{ mm}$ radiused acoustic corners and stamped sump. | Stamped $1.0\text{ mm}$ AISI 304 stainless steel, electropolished interior ($R=0.15, M=0.90$) | Supported by perimeter rim flange on chassis deck with elastomeric vibration dampers | `Body_Chassis` |
| `Rim_BasinPerimeter` | Stamped upper perimeter drip rim flange ($245.0 \times 178.0 \times 3.0\text{ mm}$) with $5\text{ mm}$ raised retention lip directing condensation back into tank. | Seamless formed extension of `Body_Basin`, brushed stainless ($R=0.22, M=0.88$) | Continuous silicone perimeter sealing bead under flange | `Body_Basin` |
| `Port_DrainOutlet` | 3/8" NPT female threaded drain outlet boss welded into stamped sump recess in rear-right corner of basin floor. | Machined AISI 304 stainless steel boss | TIG-welded hermetic joint to basin floor | `Body_Basin` |
| `Valve_Drain_Ball` | Industrial 3/8" quarter-turn stainless steel ball valve with virgin PTFE seals and $\varnothing 10.0\text{ mm} \times 18.0\text{ mm}$ barbed drain hose fitting. Protrudes from right lower chassis wall ($X=+160 \to +182\text{ mm}$). | Investment cast 304SS body ($R=0.25, M=0.85$) with PTFE seals | Threaded into 3/8" NPT drain extension pipe with PTFE thread tape | `Port_DrainOutlet` |
| `Handle_DrainValve` | Stainless steel quarter-turn valve lever ($45.0\text{ mm}$ length) with insulated black vinyl grip sleeve. Closed perpendicular; open in-line. | Stamped 304SS lever with black vinyl dip-coating (`#0f172a`) | Retained by M6 stainless stem nut and Belleville washer | `Valve_Drain_Ball` |
| `Basket_WireAssembly` | Complete AISI 304 welded wire mesh sample basket ($215.0 \times 148.0 \times 105.0\text{ mm}$). Square mesh grid $8.0 \times 8.0\text{ mm}$ of $\varnothing 1.2\text{ mm}$ wire resistance-welded at every intersection. | Electropolished AISI 304 stainless steel wire ($R=0.18, M=0.88$) | Free-standing inside basin or resting on bench surface | Root / Bench |
| `Basket_Frame_Top` | Heavy structural upper rim wire frame ($\varnothing 3.00\text{ mm}$) reinforcing basket perimeter. | Welded 304SS solid rod | Resistance-welded to vertical wire ribs | `Basket_WireAssembly` |
| `Basket_Leg_FL`..`RR` | 4× corner wire standoff legs ($15.0\text{ mm}$ height) with molded silicone rubber tip boots, maintaining $25\text{ mm}$ clearance above tank bottom. | $\varnothing 2.5\text{ mm}$ 304SS wire with vulcanized silicone tips | Welded to bottom perimeter frame wire | `Basket_WireAssembly` |
| `Basket_Handle_L`, `_R` | Dual formed $\varnothing 3.0\text{ mm}$ wire suspension handles ($35.0\text{ mm}$ height) with flanged hooks that rest on the upper basin rim. | Formed 304SS wire rod | Welded to basket side frames | `Basket_WireAssembly` |
| `Fluid_CleaningSolution` | Ultrasonic cleaning fluid volume ($224.0 \times 158.0 \times 120.0\text{ mm}$, $5.5\text{ L}$ working volume at MAX line). Dynamic refractive liquid mesh. | Water-based cleaning bath ($IOR=1.333$, transmission color `#38bdf8`, roughness $0.05$) | Bounded by interior tank geometry | `Body_Basin` |
| `Lid_Assembly` | Hinged sound-dampening stainless steel lid ($250.0 \times 184.0 \times 7.0\text{ mm}$) with peripheral return flange and silicone sealing gasket. | Formed $1.0\text{ mm}$ AISI 304 stainless steel ($R=0.22, M=0.88$) | Dual rear barrel hinges with ground pivot pins | `Body_Chassis` |
| `Gasket_Lid_Silicone` | Closed-cell silicone perimeter lid gasket ($246.0 \times 180.0 \times 2.5\text{ mm}$) reducing ultrasonic noise emission by $> 14\text{ dBA}$. | Food-grade elastomeric silicone rubber (`#334155`), $R=0.75$ | Retained in channel on lid underside | `Lid_Assembly` |
| `Handle_Lid` | Ergonomic brushed 304SS horizontal grab handle bar ($\varnothing 12.0\text{ mm} \times 80.0\text{ mm}$) mounted to lid top. | Brushed AISI 304 stainless steel tube | 2× `Fastener_SocketM4_LidHandle_01`..`02` (DIN 912 M4×12 mm screws) | `Lid_Assembly` |
| `Hinge_Lid_L`, `_R` | Dual rear stainless steel barrel hinges ($14.0 \times 8.0 \times 8.0\text{ mm}$) allowing $85^\circ$ lid opening. | Machined AISI 304 stainless steel with precision ground pivot pin | 4× `Fastener_CSKM3_Hinge_01`..`04` (DIN 7991 M3×8 mm screws) | `Body_Chassis` |

---

## 3. Ultrasonic Acoustic Transducers & Tank Heating System

| Semantic Part ID | Description & OEM Engineering Specifications | Material / PBR Finish | Fastener & Mounting Hardware | Parent Node |
| :--- | :--- | :--- | :--- | :--- |
| `Transducer_Langevin_01`..`04`| Quad (4×) bolt-clamped Langevin piezoelectric sandwich transducers arranged in $2 \times 2$ grid on basin bottom ($110\text{ mm}$ lateral, $80\text{ mm}$ longitudinal spacing). Frequency $40\text{ kHz}$. | Multi-material electro-acoustic sandwich | Epoxied to tank bottom with Master Bond EP30HT structural epoxy | `Body_Basin` |
| `Horn_Transducer_01`..`04` | 4× aerospace aluminum front radiating horns ($\varnothing 45.0\text{ mm} \times 22.0\text{ mm}$). Flared profile optimizes acoustic impedance matching to tank. | CNC machined aerospace aluminum 6061-T6 ($R=0.30, M=0.80$) | Epoxied directly to stainless steel tank bottom under pressure | `Transducer_Langevin_*`|
| `Ring_PZT_Piezo_01A`..`04B` | 8× high-power Lead Zirconate Titanate piezoelectric ceramic rings (PZT-8 / Navy Type III, $\varnothing 38.0\text{ OD} \times \varnothing 15.0\text{ ID} \times 5.0\text{ mm}$). | High-density PZT-8 piezoelectric ceramic ($d_{33} = 300\text{ pC/N}$) | Clamped under $45\text{ MPa}$ compressive pre-stress | `Transducer_Langevin_*`|
| `Shim_Electrode_01A`..`04C` | 12× silver-plated beryllium copper electrode shims ($\varnothing 38.0\text{ mm} \times 0.30\text{ mm}$) with integral solder termination tabs. | Beryllium copper alloy 25 (CuBe2), silver-plated | Stacked between PZT rings and horn/back mass | `Transducer_Langevin_*`|
| `BackMass_Transducer_01`..`04`| 4× cylindrical rear inertial backing masses ($\varnothing 38.0\text{ mm} \times 16.0\text{ mm}$). Reflects acoustic vibration forward into cleaning tank. | Precision CNC machined AISI 304 stainless steel | Clamped under center bolt pre-stress | `Transducer_Langevin_*`|
| `Bolt_Prestress_01`..`04` | 4× high-tensile alloy steel center pre-stress bolts (M10 $\times 1.25\text{ mm} \times 55.0\text{ mm}$ socket head cap screw, Grade 10.9). Torqued to $35\text{ Nm}$. | High-tensile alloy steel, black oxide finish | Torqued into threaded blind bore of aluminum front horn | `Transducer_Langevin_*`|
| `Washer_Belleville_01A`..`04B`| 8× stacked Belleville disc springs ($\varnothing 25.0\text{ OD} \times \varnothing 10.2\text{ ID} \times 1.5\text{ mm}$) maintaining constant bias under thermal cycling. | 51CrV4 spring steel, phosphate and oiled finish | Seated under head of M10 center pre-stress bolt | `Transducer_Langevin_*`|
| `Heater_SiliconePad` | Flexible etched-foil silicone rubber surface heating pad ($210.0 \times 140.0 \times 1.5\text{ mm}$, **160 Watts** at 120/240V AC). Bonded between transducer horns. | Inconel etched-foil element encapsulated in fiberglass silicone | High-temperature pressure-sensitive acrylic adhesive layer | `Body_Basin` |
| `Sensor_Temp_PT100` | Precision Class A 3-wire PT100 platinum RTD temperature sensor in $\varnothing 8.0\text{ mm} \times 5.0\text{ mm}$ stainless contact button. Accuracy $\pm 0.15^\circ\text{C}$. | 304SS sensor button with shielded silicone lead wire | Spring-loaded mounting clip pressed against tank exterior | `Body_Basin` |
| `Switch_Thermal_Bimetallic` | Snap-action bimetallic safety limit thermostat switch (Sensata 1NT series, SPST-NC, opens at $85^\circ\text{C} \pm 3^\circ\text{C}$ on dry run, auto-resets at $65^\circ\text{C}$). | Phenolic case with aluminum sensing disc | 2× `Fastener_PanM3_Stat_01`..`02` (DIN 7985 M3×6 mm screws) | `Body_Basin` |
| `Fuse_Thermal_Backup` | Secondary non-resettable thermal cutoff fuse (NEC Schott SEFUSE, $105^\circ\text{C}$, 10A 250V) in braided fiberglass sleeving. | Ceramic casing with low-melting fusible alloy element | Heat-shrunk to tank heater supply line | `Heater_SiliconePad` |

---

## 4. Electronics Bay, Power Conversion & Ultrasonic Generator

| Semantic Part ID | Description & OEM Engineering Specifications | Material / PBR Finish | Fastener & Mounting Hardware | Parent Node |
| :--- | :--- | :--- | :--- | :--- |
| `PCB_Motherboard` | Main digital system motherboard ($160.0 \times 120.0 \times 1.6\text{ mm}$). Houses low-voltage logic, sensor conditioning, and display interfaces. | High-Tg FR-4 glass-epoxy, matte green solder mask, ENIG gold pads | 4× `Fastener_PanM3_Motherboard_01`..`04` (DIN 7985 M3×8 mm screws) on 12 mm nylon standoffs | `Body_Chassis` |
| `Part_MCU_STM32` | 32-bit ARM Cortex-M4 RISC microcontroller (STM32F401, LQFP-64, 84 MHz, hardware FPU, 256 KB Flash, 64 KB SRAM) with laser-marked silkscreen and pin-1 dot. | Molded epoxy encapsulated IC with laser markings | Surface-mounted to `PCB_Motherboard` | `PCB_Motherboard` |
| `Part_RAM_Chip` | High-speed static RAM memory IC chip (SOIC-8 package). | Molded plastic SOIC | Surface-mounted to `PCB_Motherboard` | `PCB_Motherboard` |
| `Part_SSD_Module` | 16 MB high-speed SPI Flash memory module for non-volatile parameter, profile, and GLP event logging storage. | Molded plastic SOIC-8 IC | Surface-mounted to `PCB_Motherboard` | `PCB_Motherboard` |
| `PCB_UltrasonicGenerator` | High-voltage ultrasonic power generator PCB ($140.0 \times 90.0 \times 1.6\text{ mm}$). 40 kHz half-bridge resonant inverter circuit. | FR-4 double-sided board with heavy 2 oz copper traces | 4× `Fastener_PanM3_GenPCB_01`..`04` (DIN 7985 M3×8 mm screws) on 12 mm standoffs | `Body_Chassis` |
| `Transistor_MOSFET_Q1`, `_Q2`| 2× high-voltage N-channel power MOSFETs (IRFP460, 500V, 20A, $R_{DS(on)} = 0.27\text{ }\Omega$, TO-247 package) in half-bridge configuration. | TO-247 molded plastic with nickel-plated copper tab | 2× `Fastener_PanM3_MOSFET_01`..`02` (DIN 7985 M3×10 mm screws) with mica insulator pads | `Heatsink_MOSFET_Extruded`|
| `Heatsink_MOSFET_Extruded` | Extruded finned black anodized aluminum heatsink ($75.0 \times 50.0 \times 25.0\text{ mm}$, 8 vertical cooling fins, $R_{\theta sa} = 2.4\text{ }^\circ\text{C/W}$). | Extruded aluminum 6063-T6, black anodized ($R=0.28, M=0.85$) | 2× `Fastener_SocketM4_Heatsink_01`..`02` (DIN 912 M4×12 mm screws) | `PCB_UltrasonicGenerator`|
| `Transformer_Ferrite_Matching`| High-frequency ferrite pot core impedance-matching transformer ($\varnothing 42.0\text{ mm} \times 35.0\text{ mm}$). Steps up 160V DC bus to $650\text{ V}_{pp}$ transducer drive. | High-permeability MnZn 3C90 ferrite pot core, multi-strand Litz wire | Through-hole solder pins into `PCB_UltrasonicGenerator` | `PCB_UltrasonicGenerator`|
| `Choke_Ferrite_Resonant` | Toroidal ferrite series tuning inductor choke ($\varnothing 28.0\text{ mm} \times 14.0\text{ mm}$) setting exact LC acoustic resonance at $40\text{ kHz}$. | Iron-powder toroidal core with enamelled copper wire | Potted in flame-retardant silicone | `PCB_UltrasonicGenerator`|
| `Transformer_Toroidal_Power`| Precision toroidal step-down isolation transformer (Talema 30VA, primary 120/240V AC, dual secondaries $18\text{V} / 12\text{V AC}$, $\varnothing 70.0\text{ mm} \times 32.0\text{ mm}$). | Grain-oriented silicon steel toroidal core, copper wire, mylar wrap | 1× `Bolt_Toroid_M4` (DIN 912 M4×16 mm), 1× zinc dish washer, 2× neoprene isolation pads | `Body_Chassis` |
| `Module_PSU_Switching` | Universal industrial AC/DC switching power supply module (Mean Well EPS-45, 45W, $100.0 \times 60.0 \times 30.0\text{ mm}$). Rails: $+24\text{V}$, $+12\text{V}$, $+5\text{V}$, $+3.3\text{V DC}$. | Open-frame PCB in perforated metal shielding cage | 4× `Fastener_PanM3_PSU_01`..`04` (DIN 7985 M3×6 mm screws) | `Body_Chassis` |
| `Fan_Cooling_Axial` | High-reliability DC convective axial cooling fan (ebm-papst 612 NGN, $60.0 \times 60.0 \times 15.0\text{ mm}$, 12V DC, 0.12A, 19.5 CFM, dual ball bearings $L_{10} > 60,000\text{ h}$). | Glass-fiber reinforced PBT housing and 7 aerofoil blades (UL94V-0) | 4× `Fastener_PanM3_Fan_01`..`04` (DIN 7985 M3×25 mm screws), 4× DIN 985 M3 nyloc nuts | `Body_Chassis` |
| `Grille_Fan_Wire` | Stamped wire finger guard grille ($\varnothing 56.0\text{ mm} \times 4.0\text{ mm}$) conforming strictly to IEC 61010-1 safety requirements. | Bright nickel/chrome-plated steel wire ($R=0.15, M=0.90$) | Clamped under fan mounting screw heads | `Fan_Cooling_Axial` |
| `Port_IEC_Inlet` | Rear chassis AC power entry module (Schurter DC11, IEC 60320 C14 inlet + dual $5 \times 20\text{ mm}$ fuse drawer + 2-pole line filter, 10A 250V AC). | High-impact black thermoplastic (PBT, UL94V-0) with nickel-plated pins | 2× `Fastener_CSKM3_Inlet_01`..`02` (DIN 7991 M3×10 mm screws), 2× DIN 934 M3 nuts | `Body_Chassis` |
| `Fuse_Mains_1`, `_2` | 2× high-breaking capacity ceramic cartridge fuses (SIBA 5A, 250V AC, Class T slow-blow, $5 \times 20\text{ mm}$). | Steatite ceramic tube with nickel-plated brass end caps | Inserted into drawer of `Port_IEC_Inlet` | `Port_IEC_Inlet` |
| `Switch_MainsRocker` | Master illuminated AC mains power rocker switch (Marquardt 1832, DPST, 10A 250V AC) with clear silicone splash protection boot. | Black nylon body with red illuminated polycarbonate rocker | Snap-in bezel into rear chassis cutout ($21.0 \times 15.0\text{ mm}$) | `Body_Chassis` |
| `Stud_ChassisGround_Brass` | M5 solid free-machining brass safety chassis protective earth (PE) stud ($20.0\text{ mm}$ length). Guarantees $< 0.05\text{ }\Omega$ ground continuity. | CW614N free-machining brass ($R=0.25, M=0.85$) | 1× DIN 933 M5×20 brass bolt, 2× DIN 6798 M5 star washers, 2× DIN 934 brass M5 nuts | `Body_Chassis` |

---

## 5. Control Console, Display & Ergonomics

| Semantic Part ID | Description & OEM Engineering Specifications | Material / PBR Finish | Fastener & Mounting Hardware | Parent Node |
| :--- | :--- | :--- | :--- | :--- |
| `Body_ConsoleDeck` | Left recessed control console deck plate ($80.0 \times 168.0 \times 4.0\text{ mm}$). Features an ergonomic left-margin clearance of $\ge 18.0\text{ mm}$ from outer chassis edge. | Stamped aluminum sheet, Dark Charcoal powder coat (`#1e293b`), $R=0.48, M=0.25$ | 4× `Fastener_CSKM3_Console_01`..`04` (DIN 7991 M3×8 mm black oxide screws) | `Body_Chassis` |
| `UI_LCD` | Dedicated UV-mapped flat display quad ($58.0 \times 30.0\text{ mm}$) bound to dynamic high-DPI Three.js CanvasTexture (`flipY=false, sRGB`). Displays cycle time (MM:SS), temp (°C), and modes. | High-contrast anti-reflective coated polycarbonate lens ($R=0.10, M=0.00, IOR=1.58$) | Seated in dedicated bezel pocket flush with console surface | `Body_ConsoleDeck` |
| `Bezel_LCD_Polycarb` | Molded matte black polycarbonate protective LCD lens surround bezel ($64.0 \times 36.0 \times 2.0\text{ mm}$). | Injection-molded ABS/polycarbonate blend, fine matte texture | Snap-fit pins into console deck plate | `Body_ConsoleDeck` |
| `Knob_Timer` | Continuous rotary optical encoder knob ($\varnothing 16.0\text{ mm} \times 8.0\text{ mm}$) with knurled perimeter grip and precision white pointer index notch. Adjusts countdown time ($0\text{--}99\text{ min}$). | Precision CNC machined satin aluminum 6061-T6 ($R=0.35, M=0.75$) with white fill | Press-fit collet clamp onto $\varnothing 6.0\text{ mm}$ knurled encoder shaft | `Body_ConsoleDeck` |
| `Knob_Temp` | Continuous rotary optical encoder knob ($\varnothing 16.0\text{ mm} \times 8.0\text{ mm}$) with knurled grip and white pointer notch. Adjusts bath temperature ($20\text{--}70\text{ }^\circ\text{C}$). | Precision CNC machined satin aluminum 6061-T6 ($R=0.35, M=0.75$) with white fill | Press-fit collet clamp onto $\varnothing 6.0\text{ mm}$ knurled encoder shaft | `Body_ConsoleDeck` |
| `Ring_Knob_Timer`, `_Temp` | 2× dark anodized aluminum indicator dial escutcheon rings ($\varnothing 20.0\text{ mm} \times 1.2\text{ mm}$) seated under knobs. | Dark anodized aluminum 6061-T6, $R=0.30, M=0.80$ | Adhesive backed onto console face | `Body_ConsoleDeck` |
| `Btn_StartStop` | Tactile instrument pushbutton: `[ ▶ START / ⏹ STOP ]` ($\varnothing 7.0\text{ mm} \times 3.5\text{ mm}$, stroke $1.0\text{ mm}$). Master ultrasonic process trigger. | Silicone rubber keycap with contrasting chrome bezel ring | Tactile metal snap-dome switch (> 1M operations) | `Body_ConsoleDeck` |
| `Btn_Degas` | Tactile instrument pushbutton: `[ 🫧 DEGAS ]` ($\varnothing 7.0\text{ mm} \times 3.5\text{ mm}$). Toggles pulse-width cavitation degas cycle. | Silicone rubber keycap with contrasting chrome bezel ring | Tactile metal snap-dome switch (> 1M operations) | `Body_ConsoleDeck` |
| `Btn_Sweep` | Tactile instrument pushbutton: `[ 〰 SWEEP ]` ($\varnothing 7.0\text{ mm} \times 3.5\text{ mm}$). Toggles $\pm 1.5\text{ kHz}$ frequency sweep modulation. | Silicone rubber keycap with contrasting chrome bezel ring | Tactile metal snap-dome switch (> 1M operations) | `Body_ConsoleDeck` |
| `LED_Status_Power` | 3 mm Green diffused LED status indicator. Illuminates when system is energized and flashes during active sonication. | Tinted diffused green epoxy lens | Snap-in bezel mount wired to 5V logic bus | `Body_ConsoleDeck` |
| `LED_Status_Heat` | 3 mm Amber diffused LED status indicator. Illuminates when silicone heating pad is actively warming the bath. | Tinted diffused amber epoxy lens | Snap-in bezel mount wired to heater drive relay | `Body_ConsoleDeck` |

---

## 6. AC Power Cord & Laboratory Bench Utilities

| Semantic Part ID | Description & OEM Engineering Specifications | Material / PBR Finish | Fastener & Mounting Hardware | Parent Node |
| :--- | :--- | :--- | :--- | :--- |
| `Power_Receptacle_Duplex`| Cast aluminum bench duplex AC receptacle box ($115.0 \times 70.0 \times 45.0\text{ mm}$) with dual NEMA 5-20R / SchuKo outlets. Anchored at bench datum $Y=0$. | Cast aluminum body (`#64748b`) with brushed stainless faceplate | Anchored to lab backsplash datum at bench surface | Bench Datum |
| `Power_Plug_NEMA` | Heavy-duty molded 3-prong AC power plug (NEMA 5-15P, 15A 125V AC / CEE 7/7 hybrid) with solid brass prongs and integral strain relief boot. | Molded black high-impact PVC with polished solid brass prongs | Plugged securely into `Power_Receptacle_Duplex` | `Power_Receptacle_Duplex` |
| `Power_Cord_SJTOW` | 3-conductor 16 AWG ($3 \times 1.31\text{ mm}^2$) heavy-duty oil- and weather-resistant SJTOW neoprene AC power cable (length $2.0\text{ m}$). Rated 105°C, 300V. | Flexible black neoprene rubber jacket ($R=0.75, M=0.02$) | Terminated at `Power_Plug_NEMA` and rear `Port_IEC_Inlet` | `Port_IEC_Inlet` |

---

## 7. Fastener Hardware Schedule & Verification Matrix

Every fastener in the physical cleaner twin assembly is quantified, standardized, and cross-referenced to eliminate missing hardware:

| Fastener Designation | Standard / Specification | Thread Size & Length | Material & Grade | Qty | Target Mechanical Joint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Fastener_PanM3_Base_*` | DIN 7985 / ISO 7045 | M3 $\times 0.5 \times 8\text{ mm}$ | Zinc-Plated Class 4.8 | 6 | Fastening `Body_BasePlinth` to `Body_Chassis` |
| `Fastener_PanM3_Motherboard_*`| DIN 7985 / ISO 7045 | M3 $\times 0.5 \times 8\text{ mm}$ | Zinc-Plated Class 4.8 | 4 | Securing `PCB_Motherboard` to chassis standoffs |
| `Fastener_PanM3_GenPCB_*` | DIN 7985 / ISO 7045 | M3 $\times 0.5 \times 8\text{ mm}$ | Zinc-Plated Class 4.8 | 4 | Securing `PCB_UltrasonicGenerator` to chassis standoffs |
| `Fastener_PanM3_PSU_*` | DIN 7985 / ISO 7045 | M3 $\times 0.5 \times 6\text{ mm}$ | Zinc-Plated Class 4.8 | 4 | Mounting switching power supply module to chassis |
| `Fastener_PanM3_Fan_*` | DIN 7985 / ISO 7045 | M3 $\times 0.5 \times 25\text{ mm}$ | Zinc-Plated Class 4.8 | 4 | Through-mounting 60 mm cooling fan & wire finger guard |
| `Fastener_NutNylocM3_Fan_*` | DIN 985 / ISO 10511 | M3 $\times 0.5$ Nyloc | Zinc-Plated Class 8 | 4 | Vibration-proof self-locking nuts on cooling fan screws |
| `Fastener_PanM3_MOSFET_*` | DIN 7985 / ISO 7045 | M3 $\times 0.5 \times 10\text{ mm}$ | Zinc-Plated Class 4.8 | 2 | Clamping IRFP460 MOSFETs to aluminum heatsink |
| `Fastener_PanM3_Stat_*` | DIN 7985 / ISO 7045 | M3 $\times 0.5 \times 6\text{ mm}$ | A2 Stainless Steel | 2 | Securing bimetallic safety thermostat switch to tank |
| `Fastener_CSKM3_Console_*` | DIN 7991 / ISO 10642 | M3 $\times 0.5 \times 8\text{ mm}$ | Black Oxide Steel 8.8 | 4 | Flush mounting control console deck plate |
| `Fastener_CSKM3_Hinge_*` | DIN 7991 / ISO 10642 | M3 $\times 0.5 \times 8\text{ mm}$ | A2-70 Stainless Steel | 4 | Fastening rear lid hinges to chassis casing |
| `Fastener_CSKM3_Inlet_*` | DIN 7991 / ISO 10642 | M3 $\times 0.5 \times 10\text{ mm}$ | A2-70 Stainless Steel | 2 | Mounting IEC C14 power entry module to rear panel |
| `Fastener_NutM3_Inlet_*` | DIN 934 / ISO 4032 | M3 $\times 0.5$ Hex Nut | A2 Stainless Steel | 2 | Retention nuts behind IEC power inlet |
| `Fastener_SocketM4_Heatsink_*`| DIN 912 / ISO 4762 | M4 $\times 0.7 \times 12\text{ mm}$ | A2-70 Stainless Steel | 2 | Securing MOSFET heatsink to generator chassis bracket |
| `Fastener_SocketM4_LidHandle_*`| DIN 912 / ISO 4762 | M4 $\times 0.7 \times 12\text{ mm}$ | A2-70 Stainless Steel | 2 | Fastening brushed stainless grab handle to lid sheet |
| `Bolt_Toroid_M4` | DIN 912 / ISO 4762 | M4 $\times 0.7 \times 16\text{ mm}$ | High-Tensile Steel 8.8 | 1 | Center mounting bolt for 30VA toroidal transformer |
| `Stud_ChassisGround_Brass` | DIN 933 / ISO 4017 | M5 $\times 0.8 \times 20\text{ mm}$ | CW614N Brass | 1 | Master protective earth (PE) chassis ground stud |
| `Fastener_NutBrassM5_*` | DIN 934 / ISO 4032 | M5 $\times 0.8$ Hex Nut | CW614N Brass | 2 | Clamping nuts for chassis PE ground lugs |
| `Fastener_WasherStarM5_*`| DIN 6798-A | M5 external serrated | Phosphor Bronze | 2 | High-bite star washers breaking paint for zero-resistance ground |
| `Stud_LevelingFoot_*` | DIN 933 / ISO 4017 | M6 $\times 1.0 \times 20\text{ mm}$ | Zinc-Plated Class 8.8 | 4 | Threaded studs molded into vulcanized leveling feet |
| `Bolt_Prestress_*` | DIN 912 / ISO 4762 | M10 $\times 1.25 \times 55\text{ mm}$ | High-Tensile Alloy 10.9 | 4 | Heavy pre-stress center bolts on 4 Langevin transducers |
| `Washer_Belleville_*` | DIN 2093 Disc Spring | $\varnothing 25 \times 10.2 \times 1.5\text{ mm}$ | 51CrV4 Spring Steel | 8 | Pre-stress compression spring washers on transducers |
| `Fastener_WasherFlatM3_*`| DIN 125 / ISO 7089 | M3 ($\varnothing 7.0 \times 0.5\text{ mm}$) | Zinc-Plated Steel | 12 | Flat washers under all M3 chassis and board screws |
| `Fastener_WasherSpringM3_*`| DIN 127 / ISO 7091 | M3 split spring lock | Zinc-Plated Steel | 12 | Anti-vibration helical spring washers for ultrasound protection |
| **Total Physical Fasteners** | — | — | — | **86** | **100% physically accounted for in 3D procedural geometry** |
