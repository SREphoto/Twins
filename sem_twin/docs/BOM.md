# Bill of Materials (BOM) — `sem_twin` (ZEISS GeminiSEM 500)

All components in this Bill of Materials are modeled as genuine 3D procedural sub-assemblies in `software/viewer/sem3d.js` (zero flat 2D normal-map substitutes, zero generic boxes). Every semantic identifier matches the deterministic gates in `scripts/oga_validator.mjs` and `.master/05_PERSONAL_MISC/tools/cad_validator.mjs`.

---

## 1. Structural Plinth, UHV Chamber & Operator Console (`twin_chassis_builder`)

| Part ID | Description | Qty | Material / Specification | Notes |
| :--- | :--- | ---: | :--- | :--- |
| `Body_Chassis` | Main FE-SEM Plinth & Welded Steel Spaceframe (`822 × 1082 × 780 mm`) | 1 | Powder-coated steel (`#e8edf2` / `#181f29` anthracite trim) | Houses vacuum pumps, HV tank, PSU & motherboard |
| `Foot_Leveling_FL` | Front-Left Pneumatic/Elastomeric Leveling Isolator (`Ø 80 mm`) | 1 | Vulcanized EPDM rubber (`Shore 70A`) + 316SS M20 spindle | Rests exactly on floor datum `Y = 0.0 mm` |
| `Foot_Leveling_FR` | Front-Right Pneumatic/Elastomeric Leveling Isolator (`Ø 80 mm`) | 1 | Vulcanized EPDM rubber + 316SS M20 spindle | Rests on `Y = 0.0 mm` |
| `Foot_Leveling_RL` | Rear-Left Pneumatic/Elastomeric Leveling Isolator (`Ø 80 mm`) | 1 | Vulcanized EPDM rubber + 316SS M20 spindle | Rests on `Y = 0.0 mm` |
| `Foot_Leveling_RR` | Rear-Right Pneumatic/Elastomeric Leveling Isolator (`Ø 80 mm`) | 1 | Vulcanized EPDM rubber + 316SS M20 spindle | Rests on `Y = 0.0 mm` |
| `Body_PneumaticIsolator_01`..`04` | Active-Passive Air Spring Cylinders (`1.5–3.0 Hz` natural freq) | 4 | Hard-anodized aluminum (`#1e293b`) + brass pressure gauge | Supports granite/cast-iron chamber baseplate |
| `Pivot_DoorServiceBay` | Hinged Louvered Front Plinth Service Bay Door | 1 | 1.5 mm cold-rolled steel + quarter-turn chrome cam latch | Opens `95°` or lifts in exploded/cutaway mode |
| `Body_ChamberUHV` | 316L Stainless Multi-Port UHV Specimen Chamber (`330 mm ID × 270 mm H`) | 1 | Electropolished 316L stainless steel (`Ra <= 0.2 µm`) | 8 machined ConFlat (`CF`) ports with knife-edges |
| `Pivot_DoorChamber` | Front Hinged UHV Chamber Access Door + Viton O-Ring + Toggle Latch | 1 | 316L stainless steel + fluorocarbon Viton elastomer | Hinged at `X = -6.25 u`; trips door microswitch |
| `Glass_ViewportChamber` | DN100CF Leaded Borosilicate Chamber Viewing Window (`IOR = 1.52`) | 1 | Leaded optical borosilicate glass (`12 mm` thick) | Bolted with 12-bolt CF flange ring |
| `Body_ConsoleDesk` | Ergonomic Operator Control Table (`850 × 900 × 760 mm`) + Cable Trough | 1 | Anthracite HPL laminate top + tubular steel legs | Includes 2 machined rubber cable grommets |
| `Body_WorkstationPC` | Under-Desk Acquisition Workstation Tower (`HP Z4 SmartSEM Host`) | 1 | Brushed black anodized aluminum + perforated front bezel | Connected via DisplayPort, USB-B & Gigabit LAN |
| `Badge_SREdesigns` | Official Laser-Etched **S R E** Lower-Frame Nameplate | 1 | Brushed anodized aluminum (`110 × 32 × 2.5 mm`) | Seated in `2.0 mm` recessed pocket on lower frame |

---

## 2. Gemini II Electron Optical Column & 5-Axis Stage (`twin_internal_mechanics_builder`)

| Part ID | Description | Qty | Material / Specification | Notes |
| :--- | :--- | ---: | :--- | :--- |
| `Body_ColumnGemini` | Gemini II Nano-Twin Electron Optical Column (`Ø 210–260 mm, H = 667 mm`) | 1 | Mu-metal magnetic shield jacket + 316L UHV liner | Cutaway reveals internal lenses & electron beam |
| `Body_GunHeadFEG` | Schottky ZrO/W(100) Field Emission Gun Head + Suppressor/Extractor | 1 | Electropolished 316L SS + alumina high-voltage insulator | Top HV conical stress-relief boot at `Y = 17.57 u` |
| `Body_IonGetterPump` | 20 l/s Sputter Ion Getter Pump (IGP) with Ferrite Magnet Yoke | 1 | Brushed stainless body + red/black permanent magnet | Maintains `< 2e-7 Pa` in FEG gun head |
| `Body_ValveColumnGate` | Pneumatic UHV Column Isolation Gate Valve | 1 | Anodized aluminum pneumatic cylinder + 316L valve body | Isolates FEG UHV when specimen chamber vents |
| `Body_CoilCondenserUpper` | Upper Electromagnetic Condenser Lens Winding & Iron Polepiece | 1 | OFHC copper magnet wire (`#b45309`) + soft iron core | Defines beam probe current (`3 pA – 20 nA`) |
| `Body_CoilCondenserLower` | Lower Condenser & 8-Pole Stigmator/Scan Deflection Coils | 1 | OFHC copper coils + permalloy magnetic yoke | Sweeps primary electron beam in raster pattern |
| `Body_BeamBoosterTube` | `+8 kV` In-Column Beam Booster Liner & `InLens SE` / `EsB` Detectors | 1 | Gold-plated titanium/quartz column liner + filter grid | Keeps electrons at high energy through column |
| `Body_ObjectivePolepiece` | Conical Magnetic-Electrostatic Gemini Objective Lens Polepiece | 1 | Vacuum-remelted low-carbon magnetic iron | Field-free sample region for magnetic specimens |
| `Body_ElectronBeamCone` | Active Primary Electron Beam & Raster Deflection Cone | 1 | Emissive cyan electron beam shader (`#00f3ff`) | Visible in Cutaway/Exploded mode when `BEAM_ACTIVE` |
| `Pivot_Stage5Axis` | ZEISS 105-mm 5-Axis Motorized Eucentric Stage (`X, Y, Z, T, R`) | 1 | Hard-gold-plated brass, non-magnetic Ti-6Al-4V & 316L | `±52.5 mm X/Y`, `2–40 mm WD`, `-5..+70° Tilt`, `360° Rot` |
| `Motor_DriveStageXY` | Non-Magnetic Piezo/Micro-Stepper X/Y Stage Actuators + Lead Screws | 2 | Phosphor bronze housing + stainless trapezoidal screw | Drives cross-roller linear stage slides |
| `Motor_LiftStageZ` | Motorized Eucentric Z-Wedge Elevation & Tilt Worm Gear Motor | 2 | Brushed non-magnetic DC servo motor + bronze worm gear | Locked by hardware interlock when door is open |
| `Body_SpecimenCarousel` | 9-Position Aluminum Pin-Stub Holder Carousel + Specimen Stubs | 1 | Machined 6061-T6 aluminum + 6 prepared specimen stubs | Includes `Au/Pd` coated & uncoated samples |

---

## 3. Vacuum Pumps, Gauges, Detectors & Optical Relays (`twin_sensor_data_engineer`)

| Part ID | Description | Qty | Material / Specification | Notes |
| :--- | :--- | ---: | :--- | :--- |
| `Motor_DriveTurboPump` | `Pfeiffer HiPace 300` (`90,000 RPM`, `260 l/s`) Turbomolecular Pump | 1 | Finned cast aluminum body + DN100CF inlet flange | Includes `TC 110` electronic drive controller |
| `Motor_DriveScrollPump` | `Pfeiffer HiScroll 6` Oil-Free Dry Scroll Backing Pump | 1 | Cast aluminum scroll housing + brushless synchronous motor | Connected via `DN25KF` corrugated bellows hose |
| `Body_VacuumForeline_KF25` | Corrugated 316L Stainless Flexible Foreline Hose + KF25 Wing Clamps | 1 | 316L stainless bellows + die-cast aluminum KF25 clamps | Routes from turbo exhaust to scroll inlet |
| `Body_DetectorSE2` | Everhart-Thornley `SE2` Secondary Electron Detector | 1 | 316L flange + `+300 V` Faraday cage + YAG + PMT | Mounted on right-rear `DN63CF` chamber port |
| `Pivot_DetectorBSE` | Retractable 4-Quadrant Solid-State `Sense BSD` Backscatter Detector | 1 | Welded stainless bellows + pneumatic cylinder + Si diode | Retracts laterally when chamber door opens |
| `Body_DetectorEDS` | `Oxford Ultim Max 100` (`100 mm²`) Peltier-Cooled SDD `EDS` Detector | 1 | Blue-anodized aluminum heatsink fins + copper snout | Mounted at `35°` take-off angle on upper-left port |
| `Mirror_OpticalRelay` | `45°` Gold-Coated IR Chamberscope Optical Relay Mirror & `850 nm` Camera | 1 | Optical zerodur substrate + evaporated gold (`R > 98%`) | Streams live interior stage view to right LCD |
| `Sensor_PT100` | 4-Wire Platinum RTD (`PT100 Class A`) Objective Lens Water Jacket Probe | 1 | 316SS thermowell + PTFE 4-wire shielded lead | Monitors lens thermal stability (`20.5 ± 0.1 °C`) |
| `Body_GaugePiraniPenning` | `Pfeiffer PKR 361` Full-Range Pirani / Cold-Cathode Ionization Gauge | 1 | 316L DN40CF flange + anodized electronics head | Measures `101,325 Pa` down to `10^-7 Pa` |
| `Body_MicroswitchDoor` | Snap-Action Chamber Door Safety Interlock Microswitch | 1 | UL94V-0 phenolic body + stainless roller lever | Cuts EHT & SE2 bias immediately if door unlatched |

---

## 4. Power Continuity, 30 kV HV Tank, Motherboard & Harnesses (`twin_power_circuit_engineer`)

| Part ID | Description | Qty | Material / Specification | Notes |
| :--- | :--- | ---: | :--- | :--- |
| `Power_Receptacle_Duplex` | Hospital-Grade Wall/Pedestal NEMA 5-20R Duplex Electrical Outlet Box | 1 | Die-cast aluminum box + brushed stainless faceplate | Mounted in VC-E room / rear utility pedestal |
| `Power_Plug_NEMA` | Heavy-Duty Molded NEMA 5-15P / 5-20P 3-Prong Grounded Plug | 1 | Molded black PVC boot + solid brass blades & ground pin | Animates between plugged-in and unplugged rest |
| `Power_Cord_SJTOW` | `12 AWG` 3-Conductor Oil-Resistant `SJTOW` AC Mains Cable (`300 V`) | 1 | Satin black neoprene jacket (`Ø 11.5 mm`) + strain boots | Catenary curve from `Power_Plug_NEMA` to `Port_IEC` |
| `Port_IEC` | Rear Bulkhead IEC 60320 C14 Inlet + Fuse Drawer + Main Breaker Rocker | 1 | Glass-filled nylon + silver-alloy contacts + green LED | Primary AC entry on rear bulkhead |
| `Assembly_PowerSupply` | Perforated Cage Switching PSU (`Mean Well LRS-350-24`, `24 VDC / 14.6 A`) | 1 | Punched aluminum honeycomb cage + internal PCB/caps | 9-position screw terminal barrier strip + ferrules |
| `Part_ToroidalTransformer` | `300 VA` Low-Stray-Field Toroidal Isolation Transformer | 1 | Enameled copper windings + amber Kapton tape + steel cap | Powers low-noise analog lens current regulators |
| `Body_HVTank_30kV` | Potted `30 kV` Spellman High-Voltage Multiplier & Bias Tank | 1 | Epoxy-potted red/grey steel enclosure + HV receptacle | Generates `-30 kV` EHT, `+8 kV` booster, `+300 V` SE2 |
| `PCB_Motherboard` | 6-Layer FR-4 SmartSEM Scan Generator & Instrument Control Motherboard | 1 | Green FR-4 soldermask + ENIG gold pads + copper traces | Mounted on 6 M3 brass hex standoffs |
| `Part_MCU_ARM` | 176-Pin LQFP ARM Cortex-M7 / FPGA Dual-Channel 16-Bit Scan Controller | 1 | Black epoxy IC package + 176 tinned gull-wing leads | Generates X/Y raster DAC ramps & reads 24-bit ADC |
| `Part_RAM_Chip` | Dual `512 MB` TSOP-54 Synchronous DRAM Framebuffer ICs | 2 | Epoxy SMD package + alloy-42 leads | Buffers `1024×768` / `2048×2048` 16-bit scan frames |
| `Part_SSD_Module` | `256 GB` Industrial BGA eMMC / NVMe Non-Volatile Flash Storage Module | 1 | Black BGA package + gold fiducial corners | Stores calibration tables, micrographs & GLP logs |
| `WiFi_BLE` | Castellated `Wi-Fi 802.11ac / Bluetooth 5.2 BLE` Telemetry Module | 1 | Nickel-silver RF shield can + laser-etched FCC ID | Connected via U.FL micro-coax to `Antenna_WiFi` |
| `Antenna_WiFi` | Rear Bulkhead Articulated `2.4 / 5 GHz` Dipole Whip Antenna | 1 | Matte black polycarbonate radome + gold RP-SMA nut | Mounted on rear I/O bulkhead |
| `Fan_CabinetCooling_Blower` | Low-Vibration `120 mm` Plinth Exhaust Fans with Chrome Wire Grilles | 2 | PBT impeller + ball-bearing BLDC motor + chrome guard | Keeps electronics bay `< 32 °C` |
| `Port_RS232` | Rear Bulkhead DB9 Male RS-232 Diagnostic Serial Port | 1 | Tin-plated D-sub shell + 9 gold pins + hex jackscrews | Service & external stage controller link |
| `Port_USB` | Rear Bulkhead Shielded USB 3.0 Type-B Host Interface Port | 1 | Nickel-plated shell + blue tongue | High-speed link to workstation PC |
| `USB_Drive` | Front/Rear Industrial USB-A Flash Thumb Drive (`GLP Audit Export`) | 1 | Anodized cyan aluminum body + status LED | Exports micrographs & EDS CSV spectra |
| `Port_RJ45` | Rear Bulkhead Shielded RJ45 Gigabit Ethernet LAN Port (`Atlas 5 LIMS`) | 1 | Shielded modular jack + green/amber link/activity LEDs | Network telemetry & LIMS integration |
| `Body_Wire_ACMains` | Point-to-Point AC Harness (`Brown L`, `Blue N`, `Green/Yellow PE`) | 1 set | `14 AWG` PVC insulated conductors + ring/spade lugs | `Port_IEC` -> EMI filter -> Toroid & PSU barrier strip |
| `Body_Wire_DC24V` | Point-to-Point `24 VDC` Power Harness (`Red +24V`, `Black GND`) | 1 set | Braided PET loom + zip-ties + insulated crimp ferrules | `Assembly_PowerSupply` -> `PCB_Motherboard`, Turbo & Fans |
| `Body_Wire_HV30kV` | `30 kV` Silicone High-Voltage Umbilical Cable (`Ø 18 mm`) | 1 | Thick red silicone HV insulation + bolted gland clamps | `Body_HVTank_30kV` -> rear strain relief -> `Body_GunHeadFEG` |
| `Body_Wire_DetectorCoax` | Shielded `RG-58` BNC Coaxial Detector Signal Cables (`SE2/BSE/EDS`) | 4 | Black coax jacket + gold BNC bayonet connectors | Detector preamps -> chassis clips -> ADC bulkhead |
| `Body_Wire_DataBus` | Internal Ribbon & Shielded Control Cables (Panel, Joysticks, LCDs) | 1 set | Grey 34-pin IDC ribbon + braided DisplayPort/USB cables | Routed through desk grommets (`zero wall clipping`) |
| `Body_CoolantHose_Supply` | Closed-Loop Chiller Water Supply & Return Lines (`Ø 10 mm`) | 2 | Blue supply / Red return polyurethane tubing + brass fittings | Rear Swagelok bulkheads -> Objective lens & Turbo |

---

## 5. Displays, Tactile Controls & Standalone VC-E Room (`twin_display_silkscreen_engineer`, `twin_controls_ergonomics_engineer`, `twin_environment_lighting_director`)

| Part ID | Description | Qty | Material / Specification | Notes |
| :--- | :--- | ---: | :--- | :--- |
| `UI_LCD` | Left 27" SmartSEM Primary Micrograph & EDS Live Display Quad | 1 | Dynamic `1024×640` `CanvasTexture` (`flipY=false`, `SRGB`) | Seated in `2.5 mm` carved bezel pocket |
| `UI_LCD_ChamberScope` | Right 27" Vacuum Schematic, Column Raytrace & IR Chamberscope Quad | 1 | Dynamic `1024×640` `CanvasTexture` (`flipY=false`, `SRGB`) | Seated in right monitor carved bezel pocket |
| `Glass_DisplayCover` | Anti-Reflective Optical Glass Monitor Overlay Lenses (`IOR = 1.52`) | 2 | `MeshPhysicalMaterial` (`ior: 1.52`, `clearcoat: 1.0`) | `+0.4 mm` positive Z clearance over `UI_LCD` |
| `Knob_Magnification`..`Knob_ProbeCurrent` | 8 Knurled Aluminum Optical Rotary Encoders with Calibrated Collars | 8 | CNC-knurled anodized aluminum + white index pointer | Rotates CW on increase (`DIAG-021`, `>= 4.5 mm` gap) |
| `Btn_Power`..`Btn_DetectorCycle` | 8 Illuminated Tactile Console Pushbuttons (`0.9 mm` physical travel) | 8 | Beveled polycarbonate keycaps + chrome bezels + LEDs | High-DPI vector silkscreen legends (`DIAG-017`) |
| `Btn_StageBreak` | Red Mushroom Emergency Stage Stop Pushbutton (`Dual-Joystick Box`) | 1 | Red anodized aluminum cap + yellow safety collar | Halts 5-axis stage motion immediately |
| `Pivot_JoystickLeftZ` | Left Hall-Effect Stage `Z / Working Distance` Joystick | 1 | Black anodized shaft + convoluted rubber boot | Tilts proportionally with Z jog commands |
| `Pivot_JoystickRightXYR` | Right 3-Axis Stage `X / Y / Rotation` Ergonomic Joystick | 1 | Contoured grip + twist-axis crown + rubber boot | Tilts in X/Y and twists in R with stage moves |
| `Body_LaboratoryRoom` | Standalone `VC-E` Electron Microscopy Suite (`includeLab !== false`) | 1 | `VC-E` inertia slab + RF acoustic walls + `$Y=28\text{ m}$` ceiling | Includes Prep Bench, `Au/Pd` Sputter Coater & Stub Box |

---

## 6. Fasteners & Mechanical Hardware (Genuine 3D Geometry)

| Part ID | Type / Thread | Qty | Drive / Material | Location |
| :--- | :--- | ---: | :--- | :--- |
| `Fastener_HexM6_CF_01`..`48` | DIN 912 M6×25 Socket Head Cap Screw + DIN 125 Washer | 48 | 5 mm Hex Socket / 316L Stainless Steel | ConFlat (`DN100CF` / `DN63CF` / `DN40CF`) flange bolt circles |
| `Fastener_HexM8_Frame_01`..`16` | DIN 912 M8×30 Socket Head Cap Screw + Washer | 16 | 6 mm Hex Socket / Alloy Steel | Plinth frame corners, column base flange & turbo mount |
| `Fastener_HexM4_Panel_01`..`24` | DIN 912 M4×12 Socket Head Cap Screw + Washer | 24 | 3 mm Hex Socket / 304 Stainless Steel | Service bay panels, PSU cage, HV tank & rear bulkhead |
| `Fastener_HexM3_PCB_01`..`12` | DIN 912 M3×8 Socket Head Cap Screw + Brass Standoff | 12 | 2.5 mm Hex Socket / Stainless + Brass | `PCB_Motherboard`, rotary control panel & detector preamps |
