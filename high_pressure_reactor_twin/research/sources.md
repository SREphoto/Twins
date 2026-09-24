# Research Sources — High Pressure Reactor (Parr 4560 Series)

Collected for building a real-world digital twin of a Parr 4560 Series Mini Reactor. Personal research use.

## Primary Reference Product

**Parr Instrument Company — Series 4560 Mini Reactors, 100-600 mL**  
The most popular of all Parr Stirred Reactors. Available in fixed-head and moveable-vessel styles. Used with Parr 4848 Reactor Controller.

Public specs used for envelope and behaviour (see `docs/dimensions.md` and `docs/control_spec.md`):

| Item                    | Value                                      |
| ----------------------- | ------------------------------------------ |
| **Model numbers**       | 4561 (300 mL), 4562 (450 mL), 4563 (600 mL), 4564 (160 mL), 4565 (100 mL), 4566 (300 mL fixed), 4567 (450 mL fixed), 4568 (600 mL fixed), 4566B, 4566C |
| **Volumes**             | 100, 160, 300, 450, 600 mL                 |
| **Max pressure (MAWP)** | 3000 psi (207 bar); 200 bar CE/UKCA        |
| **HT MAWP**             | 2000 psi (138 bar)                         |
| **Max temperature**     | 225 °C (FKM O-ring), 300 °C (FFKM), 350 °C (PTFE gasket), 500 °C (FG gasket HT) |
| **Material**            | 316 SS (standard), Hastelloy C-276 / other alloys available |
| **Closure**             | Split-ring, 6 compression bolts (flat gasket); no bolts for O-ring |
| **Valve connections**   | 1/8" NPT male                              |
| **Stirrer**             | Magnetic drive A1120HC6, 16 in-lb torque, 4-blade impeller 1.38" dia. |
| **Stirrer motor**       | 1/8 hp variable speed DC, up to 1700 rpm   |
| **Heater power**        | 510-1100 W depending on model              |
| **Electrical**          | 115/230 VAC, 4-10 A max load               |
| **Pressure gauge**      | 3.5" dial, 0-3000 psi (standard) / 0-2000 psi (HT) |
| **Stand dimensions**    | 12" × 18" (W×D)                            |
| **Temperature measure** | Fixed thermocouple (thermowell for special alloys) |
| **Spare parts kit**     | 4569M (standard), 4569HT (high temp)       |

## Product Pages — Official Parr Website

### 4560 Series Mini Reactors
- **Overview page:** <https://www.parrinst.com/products/stirred-reactors/series-4560-100-600-ml-mini-reactors/>
- **Specifications (complete table):** <https://www.parrinst.com/products/stirred-reactors/series-4560-100-600-ml-mini-reactors/specifications/>
- **Documents page:** <https://www.parrinst.com/products/stirred-reactors/series-4560-100-600-ml-mini-reactors/documents/>
- **Design features:** <https://www.parrinst.com/products/stirred-reactors/design-features/>
- **Magnetic drives:** <https://www.parrinst.com/products/stirred-reactors/design-features/magnetic-drives/>
- **Options & accessories:** <https://www.parrinst.com/products/stirred-reactors/options-accessories/>

### 4848 Reactor Controller
- **Overview:** <https://www.parrinst.com/products/controllers/4848-reactor-controller/>
- **Specifications (modules):** <https://www.parrinst.com/products/controllers/4848-reactor-controller/specifications/>
- **Ordering guide:** <https://www.parrinst.com/products/controllers/4848-reactor-controller/ordering-guide/>

### Related Series (for cross-reference)
- **Series 5500 HP Compact Reactors (25-600 mL):** <https://www.parrinst.com/products/stirred-reactors/series-5500-hp-compact-reactors/>
- **Series 4530 Floor Stand (1-2 L):** <https://www.parrinst.com/products/stirred-reactors/series-4530-1-and-2-liter-floor-stand-reactors/>
- **Series 4540 High Pressure (600-1200 mL):** <https://www.parrinst.com/products/stirred-reactors/series-4540-high-pressure-reactors/>
- **Series 4590 Micro Reactors (25-100 mL):** <https://www.parrinst.com/products/stirred-reactors/series-4590-micro-reactors/>

### General Parr Resources
- **Stirred Reactors main:** <https://www.parrinst.com/products/stirred-reactors/>
- **Catalogs & downloads:** <https://www.parrinst.com/support/downloads/catalogs/>
- **Manuals page:** <https://www.parrinst.com/support/downloads/manuals/>
- **Technical notes:** <https://www.parrinst.com/support/downloads/technical-notes/>

## Manuals (Online — PDF Available via Parr)

Parr requires contacting them or a local dealer for full instruction manuals. The following are known manual/document references:

| Document                                     | Description                                      | Status            |
| -------------------------------------------- | ------------------------------------------------ | ----------------- |
| `4500MB Chapter 2 Stirred Reactors`          | Sales literature chapter on stirred reactors     | Cited on site     |
| Parr 4560 Instruction Manual (no. pending)   | Full operating & maintenance manual              | Contact Par       |
| 4848 Reactor Controller Manual               | Controller operation, module configuration       | Contact Parr      |
| SpecView A3504HC Software                    | PC-based HMI for data logging & control          | Commercial        |

**NOTE:** Manuals are behind a login/sales wall. Contact Parr Instrument Company (800-872-7720) or a local dealer for access.

## Reference Images (Official Product Photos)

Key images from Parr website for visual reference:

| Image                                              | Description                                   | URL full path |
| -------------------------------------------------- | --------------------------------------------- | ----------- |
| `4566_mini-fixed_300mL_4848_600x600.jpg`           | 4566 fixed-head 300 mL with 4848 controller   | `/wp-content/uploads/2011/03/4566_mini-fixed_300mL_4848_600x600.jpg` |
| `4566_4848_AL-complete.jpg`                        | 4566 with 4848 controller (angled view)       | `/wp-content/uploads/2011/03/4566_4848_AL-complete.jpg` |
| `4563_mini-moveable-disassembled_600mL_4848.jpg`   | 4563 moveable 600 mL disassembled view        | `/wp-content/uploads/2011/03/4563_mini-moveable-disassembled_600mL_4848.jpg` |

All images hosted at `https://www.parrinst.com/wp-content/` + path. Full resolution available via srcset (up to 600×600 px).

## 4848 Controller Module Specifications

From the 4848 specifications page:

1. **PTM (Primary Temperature Control Module):** PID with auto-tune, ramp/soak up to 49 segments, accepts TC or RTD
2. **PDM (Pressure Display Module):** From pressure transducer, configurable range, alarm relay
3. **TDM (Tachometer Display Module):** Displays stirrer speed, manual potentiometer control
4. **MCM (Motor Control Module):** Closed-loop feedback for motor speed regulation
5. **MTM (Motor Torque Module):** Displays motor output from MCM
6. **HTM (High Temperature Cut Off Module):** Redundant sensor, safety shutdown
7. **ETLM (External Temperature Limit Module):** Wall temp monitoring, cascade control alternative
8. **SVM (Solenoid Valve Module):** Automatic cooling water control

**Dimensions:** 4848: 11.1"W × 9.7"H × 11.3"D / 4848B: 13.6"W × 9.6"H × 11.3"D
**Communication:** RS-485 digital; A1925E4 RS-485-to-USB cable for PC logging
**Software:** Free ParrCom (basic logging) or A3504HC SpecView (full HMI)

## 4560 Cylinder Dimensions (from Official Spec Table)

| Model  | Volume (mL) | Cylinder ID × Depth (in) | Cylinder Weight (lb) | Heater Power (W) |
| ------ | ----------- | ------------------------ | -------------------- | ---------------- |
| 4564   | 160         | 2.5 × 2.0                | 2.4                  | 510              |
| 4565   | 100         | 2.0 × 2.0                | 3.3                  | 590              |
| 4566   | 300         | 2.5 × 4.0                | 3.7                  | 780              |
| 4561   | 300         | 2.5 × 4.0                | 3.7                  | 780              |
| 4567   | 450         | 2.5 × 6.0                | 4.9                  | —                |
| 4562   | 450         | 2.5 × 6.0                | 4.9                  | —                |
| 4568   | 600         | 2.5 × 8.0                | 6.2                  | —                |
| 4563   | 600         | 2.5 × 8.0                | 6.2                  | —                |
| 4566B  | 300         | —                        | —                    | 525              |
| 4566C  | 300         | —                        | —                    | 525              |

**Reactor/stand dimensions:** 12"W × 18"D (no height given; estimate ~30" with motor and stand)
**Vessel weight:** varies by model (see table). **Note:** Final weights/dimensions vary by options.

## Physical / Safety Behaviour

- **Magnetic drive:** No rotating shaft penetrates pressure boundary — eliminates main leak path
- **Split-ring closure:** 6 compression bolts for flat gasket; no bolts needed for O-ring seal
- **Burst disc:** Safety rupture disc in head (1/4" NPT holder)
- **Over-temp protection:** HTM module (limit controller with redundant sensor)
- **Over-pressure protection:** PDM alarm → heater cut-off
- **Stirrer speed limit:** Up to 1700 rpm (support system designed for stability in lab hood)
- **Cooling coil:** Single-loop (optional serpentine); SVM for automatic cooling

## BOM / Part Number References (from Parr)

| Component                | Part Number / Reference          | Notes                            |
| ------------------------ | -------------------------------- | -------------------------------- |
| Magnetic drive           | A1120HC6                         | 16 in-lb torque                  |
| Impeller (4-blade)       | 1.38" dia. (standard)            | Gas entrainment available        |
| Stirrer motor            | 1/8 hp variable speed DC         | Part of standard assembly        |
| Spare parts kit          | 4569M / 4569HT                   | Standard / High temp             |
| Pressure gauge           | 3.5" dial, 0-3000 psi            | 0-2000 psi for HT                |
| 4848 Controller          | 4848-EB                          | Base + options                   |
| RS-485 to USB cable      | A1925E4                          | Required for PC logging          |
| SpecView software        | A3504HC                          | Full HMI                         |
| Solenoid valve module    | SVM                              | For cooling control              |
| Tachometer display       | TDM                              | Speed display only                |
| Motor control module     | MCM                              | Closed-loop speed control        |
| Pressure display module  | PDM                              | Pressure transducer display      |
| High temp cut-off module | HTM                              | Redundant safety                 |

## Legal

- Specifications sourced from Parr Instrument Company public website.
- Manuals require dealer/company contact for access.
- Digital twin uses publicly available dimensions and specifications only.
- Avoid trademarked logos/wordmarks in public-facing exports unless licensed.

## Uncertainties / Gaps

1. **Exact overall height** — not published; estimate ~30" for vessel + stand + motor. Confirm from photos.
2. **Full 3D dimensions** — vessel OD, head plate thickness, bolt circle diameter not explicitly published for 4560 specifically. Existing research doc has estimates. Need to scale from known cylinder ID (2.5" = 63.5mm) and photos.
3. **Manual PDF** — Parr requires contacting dealer. Not publicly downloadable.
4. **Head plate port layout** — exact port positions not published. Reference photos show 5+ ports. Count from product photos.
5. **Stand base and support rod dimensions** — not published by Parr. Estimated from build resources doc.
6. **Heater clamshell dimensions** — listed wattages but no physical dimensions published. Scale from vessel OD.
7. **Cooling coil detail** — single loop standard, serpentine optional. No published dimensions.
