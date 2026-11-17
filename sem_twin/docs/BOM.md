# Bill of Materials (BOM) — `sem_twin` (ZEISS GeminiSEM 500)

All components in this Bill of Materials are modeled as genuine 3D procedural sub-assemblies orchestrated by `software/viewer/sem3d.js` across modular builders (`sem_materials.js`, `sem_chassis_power.js`, `sem_chamber_column.js`, `sem_internals.js`, `sem_console_room.js`) — zero flat 2D normal-map substitutes, zero generic boxes. Every semantic identifier matches the deterministic gates in `scripts/oga_validator.mjs`.

---

## 1. Structural Plinth, Hollow UHV Chamber & Operator Console (`twin_chassis_builder`)

| Part ID | Description | Qty | Material / Specification | Notes |
| :--- | :--- | ---: | :--- | :--- |
| `Body_Chassis` | Main FE-SEM Plinth & Welded Steel Spaceframe (`X = -3.80 u`, `800 × 1020 × 755 mm`) | 1 | Cast iron `basePlinth` + powder-coated steel (`#f1f5f9` / `#18202c`) | Screen-Right bay (`X = -7.80..+0.20 u`) |
| `Foot_Leveling_FL` / `FR` / `RL` / `RR` | 4 Pneumatic/Elastomeric Leveling Isolators (`Ø 80 mm`) | 4 | Vulcanized EPDM rubber + 316SS M20 spindle & collar | Rest flush on floor datum `Y = 0.00 u` |
| `Body_PneumaticIsolator_01`..`04` | Continuous Active-Passive Air Spring Cylinders (`1.5–3.0 Hz`) | 4 | Hard-anodized aluminum cups + EPDM bellows + stainless caps | Base cups flush at `Y = 0.95 u` (`basePlinth`) spanning continuously to `Y = 6.95 u` (`isolatedDeck` underside) |
| `Pivot_DoorServiceBay` | Hinged Louvered Front Plinth Service Bay Door | 1 | 1.5 mm cold-rolled steel + quarter-turn compression latch | Exposes lower vacuum/HV/electronics bay |
| `Body_ChamberUHV` | Hollow Extruded 316L Stainless UHV Chamber (`0.32 u` wall, `330 mm ID`) | 1 | Electropolished 316L stainless steel (`Ra <= 0.2 µm`) | Front doorway cutout (`X = -1.92..+1.92 u` rel. column); 8 CF ports clear of `±0.95 rad` doorway & rear cabinet |
| `Pivot_DoorChamber` | Extruded Front Hinged UHV Chamber Door + Viton O-Ring + Handle | 1 | 316L stainless steel + Viton fluoroelastomer O-ring | Hinged on `-X` edge, swings **outward `+angle` toward `-Z`**; circular carved `DN100CF` viewport cutout |
| `Glass_ViewportChamber` | DN100CF Leaded Borosilicate Chamber Viewing Window (`IOR = 1.52`) | 1 | Leaded optical borosilicate glass (`25 mm` thick) | Seated behind carved circular door cutout |
| `Body_ConsoleDesk` | Ergonomic Operator Control Table (`X = +4.50 u`, `800 × 900 × 760 mm`) | 1 | Anthracite HPL laminate top + C-channel steel legs + glides | Screen-Left bay (`X = +0.50..+8.50 u`, `Y = 0.00..7.60 u`) |
| `Body_WorkstationPC` | Under-Desk Acquisition Workstation Tower (`HP Z4 SmartSEM Host`) | 1 | Brushed black anodized aluminum + perforated front bezel | Positioned below console tabletop |
| `Badge_SREdesigns` | Official **`[S][R][E] designs.com`** Brushed Nameplate (`110 × 32 × 3 mm`) | 1 | Brushed anodized aluminum + 4× M3 hex socket screws | Mounted in `2.0 mm` carved pocket on **FIXED lower-left front plinth rail** (facing `-Z`, upright, zero swing clipping) |

---

## 2. Gemini II Electron Optical Column & 5-Axis Stage (`twin_internal_mechanics_builder`)

| Part ID | Description | Qty | Material / Specification | Notes |
| :--- | :--- | ---: | :--- | :--- |
| `Body_ColumnGemini` | Gemini II Nano-Twin Electron Optical Column (`X = -3.80 u`, `Y = 11.45..17.57 u`) | 1 | Mu-metal magnetic shield jacket + 316L UHV liner | Cutaway reveals internal lenses & electron beam |
| `Body_GunHeadFEG` | Schottky `ZrO/W(100)` Field Emission Gun Head + Alumina HV Boot | 1 | Electropolished 316L SS + alumina insulator | Reaches `Y = 18.80 u` (`1880 mm`) w/ top `-30 kV` HV boot |
| `Body_IonGetterPump` | `20 l/s` Sputter Ion Getter Pump (`IGP`) with Ferrite Magnet Yoke | 1 | Brushed stainless body + permanent magnet yoke | Maintains `2.0e-8 Pa` (`2.0e-10 mbar`) UHV in FEG head |
| `Body_ValveColumnGate` | Pneumatic UHV Column Isolation Gate Valve | 1 | Anodized aluminum cylinder + 316L valve body | Isolates FEG UHV when specimen chamber vents |
| `Body_CoilCondenserUpper` | Upper Electromagnetic Condenser Lens Winding & Iron Polepiece | 1 | OFHC copper magnet wire + soft iron core | Regulates probe current (`3.0–20,000.0 pA`) |
| `Body_CoilCondenserLower` | Lower Condenser & 8-Pole Stigmator/Scan Deflection Coils | 1 | OFHC copper coils + permalloy yoke | Raster deflection & `-100%..+100%` X/Y stigmation |
| `Body_BeamBoosterTube` | `+8.0 kV` In-Column Beam Booster Liner & `InLens SE` / `EsB` Detectors | 1 | Gold-plated quartz/titanium liner + annular scintillator | Accelerates beam down column prior to objective decel |
| `Body_ObjectivePolepiece` | Conical Magnetic-Electrostatic Gemini Objective Lens Polepiece | 1 | Vacuum-remelted low-carbon magnetic iron | Water-cooled (`PT100`), `2.0–40.0 mm` WD focus |
| `Body_ElectronBeamCone` | Active Primary Electron Beam & Raster Deflection Cone | 1 | Emissive cyan electron beam shader (`#00f3ff`) | Active when `BEAM_ACTIVE` / `IMAGING` |
| `Pivot_Stage5Axis` | ZEISS 105-mm 5-Axis Motorized Eucentric Stage (`X, Y, Z, T, R`) | 1 | Hard-gold-plated brass, Ti-6Al-4V & 316L SS | `±52.5 mm X/Y`, `2–40 mm WD`, `-5..+70° Tilt`, `360° Rot` |
| `Motor_DriveStageXY` | Non-Magnetic Piezo/Servo X/Y Stage Actuators + Ball/Lead Screws | 2 | Phosphor bronze housing + stainless screw | Drives cross-roller linear stage slides |
| `Motor_LiftStageZ` | Motorized Eucentric Z-Wedge Elevation & Tilt Worm Gear Motor | 2 | Brushed non-magnetic DC servo/stepper + bronze worm | Hardware-interlocked when chamber door open |
| `Body_SpecimenCarousel` | 9-Position Aluminum Pin-Stub Carousel (`9 × 40°` equal slots, `Ø 12.7 mm`) | 1 | Machined 6061-T6 aluminum | 6 active monograph stubs (`5.0 nm` Au/Pd) + 3 calibration substrates (`Cu/Au` grid, `Si` res standard, Faraday cup) |

---

## 3. Vacuum Pumps, Gauges, Detectors & Optical Relays (`twin_sensor_data_engineer`)

| Part ID | Description | Qty | Material / Specification | Notes |
| :--- | :--- | ---: | :--- | :--- |
| `Motor_DriveTurboPump` | `Pfeiffer HiPace 300` (`90,000 RPM`, `260 l/s`) Turbomolecular Pump | 1 | Finned cast aluminum body + `DN100CF` inlet flange | Suspended under chamber with `TC 110` drive controller |
| `Motor_DriveScrollPump` | `Pfeiffer HiScroll 6` (`1,800 RPM`) Oil-Free Dry Scroll Backing Pump | 1 | Cast aluminum scroll housing + brushless motor | Roughs chamber to `10.0 Pa` (`0.10 mbar`) crossover |
| `Body_VacuumForeline_KF25` | Corrugated 316L Stainless Flexible Foreline Hose + `DN25KF` Wing Clamps | 1 | 316L stainless bellows + aluminum KF25 clamps | Links turbo exhaust to scroll pump inlet |
| `Body_DetectorSE2` | Everhart-Thornley `SE2` Secondary Electron Detector | 1 | 316L flange + `+300 V` Faraday cage + YAG + PMT | Clear of `±0.95 rad` front door zone |
| `Pivot_DetectorBSE` | Retractable 4-Quadrant Solid-State `Sense BSD` Backscatter Detector | 1 | Welded stainless bellows + pneumatic slide + Si diode | Retracts automatically before chamber door opens |
| `Body_DetectorEDS` | `Oxford Ultim Max 100` (`100 mm²`) Peltier-Cooled `SDD` `EDS` Detector | 1 | Blue-anodized heatsink fins + copper collimator snout | `35°` take-off angle for characteristic X-rays |
| `Mirror_OpticalRelay` | `45°` Gold-Coated IR Chamberscope Optical Relay Mirror & `850 nm` Camera | 1 | Zerodur substrate + evaporated gold (`R > 98%`) | Feeds `UI_LCD_ChamberScope` (Screen-Left monitor) |
| `Sensor_PT100` | 4-Wire Platinum RTD (`PT100 Class A`) Objective Lens Water Jacket Probe | 1 | 316SS thermowell + PTFE 4-wire shielded lead | Monitors lens coolant stability (`20.5 ± 0.1 °C`) |
| `Body_GaugePiraniPenning` | `Pfeiffer PKR 361` Full-Range Pirani / Cold-Cathode Ionization Gauge | 1 | 316L `DN40CF` flange + anodized head | Measures `101,325 Pa` (`1,013.25 mbar`) down to `10^-7 Pa` |
| `Body_MicroswitchDoor` | Snap-Action Chamber Door Safety Interlock Microswitch | 1 | UL94V-0 phenolic body + stainless roller lever | Trips EHT & Z/Tilt interlocks when door opens |

---

## 4. Power Continuity, 30 kV HV Tank, Motherboard & Harnesses (`twin_power_circuit_engineer`)

| Part ID | Description | Qty | Material / Specification | Notes |
| :--- | :--- | ---: | :--- | :--- |
| `Power_Receptacle_Duplex` | Hospital-Grade Pedestal NEMA 5-20R Duplex Electrical Outlet Box | 1 | Die-cast aluminum box + brushed stainless faceplate | Rear bench/pedestal power source (`DIAG-014`) |
| `Power_Plug_NEMA` | Heavy-Duty Molded NEMA 5-15P / 5-20P 3-Prong Grounded Plug | 1 | Molded black PVC boot + solid brass blades & ground pin | Translates cleanly in/out of duplex socket |
| `Power_Cord_SJTOW` | `12 AWG` 3-Conductor Oil-Resistant `SJTOW` AC Mains Cable (`300 V`) | 1 | Satin black neoprene jacket (`Ø 11.5 mm`) + strain boots | Catenary path from `Power_Plug_NEMA` to `Port_IEC` |
| `Port_IEC` | Rear Bulkhead IEC 60320 C14/C20 Inlet + Fuse Drawer + Main Breaker | 1 | Glass-filled nylon + green illuminated breaker rocker | Primary AC entry on rear bulkhead (`Z = +5.08 u`) |
| `Assembly_PowerSupply` | Perforated Cage Switching PSU (`Mean Well LRS-350-24`, `24 VDC / 14.6 A`) | 1 | Punched honeycomb cage + bulk caps + barrier strip | Screw-terminal barrier strip + insulated ferrules |
| `Part_ToroidalTransformer` | `300 VA` Low-Stray-Field Toroidal Isolation Transformer | 1 | Enameled copper windings + amber Kapton + steel cap | Supplies low-noise analog lens current regulators |
| `Body_HVTank_30kV` | Potted `30 kV` Spellman High-Voltage Multiplier & Bias Tank | 1 | Epoxy-potted red/grey enclosure + ceramic feedthrough | Generates `-30 kV` EHT, `+8 kV` booster, `+300 V` SE2 |
| `PCB_Motherboard` | 6-Layer FR-4 SmartSEM Scan Generator & Control Motherboard | 1 | Green FR-4 soldermask + ENIG gold pads | Mounted on 6× M3 brass hex standoffs |
| `Part_MCU_ARM` | 176-Pin LQFP ARM Cortex-M7 / FPGA Dual-Channel Scan Controller | 1 | Black epoxy IC package + 176 gull-wing leads | Drives X/Y scan DACs & reads 24-bit detector ADC |
| `Part_RAM_Chip` | Dual `512 MB` TSOP-54 Synchronous DRAM Framebuffer ICs | 2 | Epoxy SMD package + alloy-42 leads | Buffers `512×384` / `1024×768` scan frames |
| `Part_SSD_Module` | `256 GB` Industrial BGA eMMC / NVMe Solid-State Storage Module | 1 | Black BGA package + gold fiducials | Stores calibration tables, micrographs & GLP logs |
| `WiFi_BLE` | Castellated `Wi-Fi 802.11ac / Bluetooth 5.2 BLE` Radio Module | 1 | Nickel-silver RF shield can + U.FL micro-coax pad | Routed via coax pigtail to rear `Antenna_WiFi` |
| `Antenna_WiFi` | Rear Bulkhead Articulated `2.4 / 5 GHz` Dipole Whip Antenna | 1 | Matte black radome + gold RP-SMA hex nut | External wireless telemetry interface |
| `Fan_CabinetCooling_Blower` | Low-Vibration `120 mm` Plinth Exhaust Fan with Chrome Wire Grille | 1 | PBT 7-blade impeller + BLDC hub + chrome guard | Keeps electronics bay `< 32 °C` |
| `Port_RS232` | Rear Bulkhead DB9 Male RS-232 Diagnostic Serial Port | 1 | Tin-plated D-sub shell + hex jackscrews | Stage & vacuum service interface |
| `Port_USB` | Rear Bulkhead Shielded USB 3.0 Type-B Host Interface Port | 1 | Nickel-plated shell + blue tongue | High-speed link to `Body_WorkstationPC` |
| `USB_Drive` | Rear Industrial USB-A Flash Thumb Drive (`GLP Audit Export`) | 1 | Anodized cyan aluminum body + status LED | Exports micrographs & GLP CSV spectra |
| `Port_RJ45` | Rear Bulkhead Shielded RJ45 Gigabit Ethernet LAN Port (`Atlas 5 LIMS`) | 1 | Shielded modular jack + link/activity LEDs | Network telemetry & LIMS integration |
| `Body_Wire_AC*` / `DC24V*` / `HV30kV` / `Coax` / `DataBus` / `Coolant*` | Point-to-Point Color-Coded Wiring & Coolant Harnesses | 1 set | PVC / Silicone HV / RG-58 Coax / Polyurethane coolant | End-to-end `TubeGeometry` paths + EPDM grommets |

---

## 5. Dual Monitors, Tactile Panels & Standalone `VC-E` Prep Bench (`twin_display_silkscreen_engineer`, `twin_controls_ergonomics_engineer`, `twin_environment_lighting_director`)

| Part ID | Description | Qty | Material / Specification | Notes |
| :--- | :--- | ---: | :--- | :--- |
| `UI_LCD` | **Screen-Right (`X = +2.35 u`, column-adjacent)** 27" Primary SmartSEM Micrograph Quad | 1 | Dynamic `1024×768` `CanvasTexture` (`flipY=false`, `SRGB`) | Seated on articulated VESA arm in `2.5 mm` carved bezel pocket |
| `UI_LCD_ChamberScope` | **Screen-Left (`X = +6.65 u`, outer left)** 27" IR Chamberscope, Vacuum & EDS Quad | 1 | Dynamic `512×320` `CanvasTexture` (`flipY=false`, `SRGB`) | Seated on articulated VESA arm in `2.5 mm` carved bezel pocket |
| `Glass_DisplayCover` | Anti-Reflective Optical Glass Monitor Overlay Lenses (`IOR = 1.52`) | 2 | `MeshPhysicalMaterial` (`ior: 1.52`, `clearcoat: 1.0`) | `+0.4 mm` positive Z clearance over both LCD quads |
| `Body_RotaryControlPanel` | ZEISS Dual-Rotary Control Panel (`X = +2.45 u`, Screen-Right desk bay) | 1 | Die-cast sloped aluminum housing | `>= 4.0 mm` ergonomic clearance between controls |
| `Knob_Magnification`..`Knob_ProbeCurrent` | 8 Fluted Knurled Aluminum Rotary Encoders (Mag, Focus Coarse/Fine, Stig X/Y, B/C, Probe Current) | 8 | CNC-fluted anodized aluminum + index ticks | Rotate **clockwise (`CW`) to increase** (`DIAG-021`) |
| `Btn_Power`..`Btn_Record` | 8 Illuminated Beveled Tactile Pushbuttons (`0.9 mm` travel) | 8 | Beveled keycaps + chrome bezels + LEDs | **`+Y` upward** high-DPI vector silkscreen legends (`DIAG-017`) |
| `Body_DualJoystickBox` | ZEISS Dual-Joystick Stage Control Box (`X = +6.35 u`, Screen-Left desk bay) | 1 | Die-cast sloped housing | Ergonomic left-hand stage navigation station |
| `Pivot_JoystickLeftZ` | 1-Axis Proportional Hall-Effect Stage `Z / WD` Joystick | 1 | Machined shaft + convoluted EPDM boot | Controls `WD / Stage Z` (`2.0–40.0 mm`) |
| `Pivot_JoystickRightXYR` | 3-Axis Proportional Stage `X / Y` + Twist `Rotation` Joystick | 1 | Contoured grip + twist crown + EPDM boot | Controls `±52.5 mm X/Y` and `360° R` |
| `Trackball_StageNavigation` | Precision Optical Stage Navigation Trackball | 1 | Polished resin ball + recessed bezel ring | Integrated on `Body_DualJoystickBox` |
| `Btn_StageBreak` | Red Mushroom Emergency Stage Stop Pushbutton | 1 | Red anodized mushroom cap + **yellow safety collar** | Immediately halts 5-axis stage motion |
| `Body_LaboratoryRoom` | Standalone `VC-E` Electron Microscopy Suite (`includeLab !== false`) | 1 | Inertia slab + neoprene joint + RF walls + `Y = 300 u` ceiling | Houses prep bench at `X = +14.80 u` |
| `Body_SpecimenPrepBench` | Standalone Specimen Preparation Workstation (`X = +14.80 u`, far Screen-LEFT) | 1 | Granite slab top + tubular steel frame at `Y = 0.00 u` | Supports sputter coater & stub storage |
| `Body_SputterCoater_AuPd` | Detailed Benchtop `Au/Pd` Magnetron Sputter Coater (`5.0 nm` film) | 1 | White powder-coat base + **polycarbonate bell jar** + chuck | Includes **rotary vacuum gauge**, **sample chuck**, **power/timer switches**, argon plasma glow, & **rear AC cord** |
| `Body_SEMStubBox` | Hinged Smoked-Acrylic `12.7 mm` SEM Pin-Stub Storage Box + Prep Tools | 1 | Smoked acrylic hinged lid + blue machined base + 316SS | Holds `Ø 12.7 mm` stubs + **carbon tape roll** + **cross-lock tweezers** |

---

## 6. Fasteners & Mechanical Hardware (Genuine 3D Geometry)

| Part ID | Type / Thread | Qty | Drive / Material | Location |
| :--- | :--- | ---: | :--- | :--- |
| `Fastener_HexM6_CF_01`..`48` | DIN 912 M6×25 Socket Head Cap Screw + DIN 125 Washer | 48 | 5 mm Hex Socket / 316L Stainless Steel | ConFlat (`DN100CF` / `DN63CF` / `DN40CF`) flange bolt circles |
| `Fastener_HexM8_Frame_01`..`16` | DIN 912 M8×30 Socket Head Cap Screw + Washer | 16 | 6 mm Hex Socket / Alloy Steel | Plinth frame, pneumatic isolators & turbo pump mount |
| `Fastener_HexM4_Panel_01`..`24` | DIN 912 M4×12 Socket Head Cap Screw + Washer | 24 | 3 mm Hex Socket / 304 Stainless Steel | Service bay panels, PSU cage & rear bulkhead |
| `Fastener_HexM3_PCB_01`..`12` | DIN 912 M3×8 Socket Head Cap Screw + Brass Standoff | 12 | 2.5 mm Hex Socket / Stainless + Brass | `PCB_Motherboard`, `Badge_SREdesigns` & rotary panel |
