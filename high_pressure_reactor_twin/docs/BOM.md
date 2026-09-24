# Bill of Materials — Parr 4560 Series Mini Reactor

Based on official Parr specifications, product documentation, and build resources. For digital twin component
identification.

## System Overview

The Parr 4560 Mini Reactor system consists of:

1. **Vessel Assembly** — Cylinder, head plate, gasket, bolts
2. **Mixing Assembly** — Magnetic drive, shaft, impeller, motor
3. **Heating System** — Clamshell heater (mantle or clamp-on)
4. **Ports & Valves** — Needle valves, burst disc, dip tube, thermowell
5. **Instrumentation** — Pressure gauge, thermocouple
6. **Stand & Support** — Base plate, support rod, clamps
7. **Controller** — Parr 4848 with modules
8. **Cooling System** — Cooling coil, solenoid valve (optional)

---

## 1. Vessel Assembly

| Item               | Qty | Description                              | Material    | Parr Ref / Notes                 |
| ------------------ | --- | ---------------------------------------- | ----------- | -------------------------------- |
| Cylinder           | 1   | 2.5" ID × 4.0" depth (4566), flanged top | 316 SS      | Varies by model (see dimensions) |
| Head plate         | 1   | Flanged, 6-bolt pattern, 5+ ports        | 316 SS      | Integral with closure            |
| PTFE gasket        | 1   | Flat ring for up to 350 °C               | PTFE        | 4569M spare kit                  |
| Flexible graphite  | 1   | Flat ring for HT up to 500 °C            | Grafoil/SS  | 4569HT spare kit                 |
| FKM O-ring         | 1   | For up to 225 °C (no compression bolts)  | FKM         | Alternative seal                 |
| FFKM O-ring        | 1   | For up to 300 °C (no compression bolts)  | FFKM        | Alternative seal                 |
| Split-ring closure | 1   | 6-bolt split ring for flat gasket        | Steel/SS    | Standard                         |
| Hex bolts          | 6   | M12 × ~50 mm, Grade B7                   | Alloy steel | Anti-seize on threads            |
| Flat washers       | 12  | M12                                      | 316 SS      | Bolt + nut side                  |
| Hex nuts           | 6   | M12                                      | 316 SS      |                                  |

## 2. Mixing Assembly

| Item               | Qty | Description                                  | Material      | Parr Ref / Notes           |
| ------------------ | --- | -------------------------------------------- | ------------- | -------------------------- |
| Magnetic drive     | 1   | A1120HC6, 16 in-lb torque, sealed            | 316 SS + SmCo | Standard for 4560 series   |
| Inner magnet rotor | 1   | Internal magnet with shaft coupling          | SmCo magnets  | Part of A1120HC6           |
| Outer magnet rotor | 1   | External magnet, motor-driven                | SmCo magnets  | Part of A1120HC6           |
| Containment shell  | 1   | ~1 mm SS barrier (part of pressure boundary) | 316 SS        | Integral to drive          |
| Stirrer shaft      | 1   | ~10 mm × ~200 mm, keyed                      | 316 SS        | Connects impeller to drive |
| Impeller (4-blade) | 1   | 1.38" dia. (35 mm), turbine                  | 316 SS        | Standard                   |
| Impeller (6-blade) | 1   | Rushton turbine, optional                    | 316 SS        | Gas entrainment            |
| Gas entrainment    | 1   | Hollow shaft impeller (optional)             | 316 SS        | For gas-liquid reactions   |
| Stirrer motor      | 1   | 1/8 hp DC, variable speed, 0-1700 rpm        | Various       | Standard                   |

## 3. Heating System

| Item               | Qty | Description                          | Material      | Parr Ref / Notes       |
| ------------------ | --- | ------------------------------------ | ------------- | ---------------------- |
| Heater mantle      | 1   | Clamshell, matches cylinder size     | Aluminum + SS | Standard (510-780 W)   |
| Heater, clamp-on   | 1   | Alternative heater style             | Various       | For some models        |
| HT heater          | 1   | Ceramic fiber heater                 | Ceramic fiber | HT option (800-1100 W) |
| Heater power cable | 1   | Silicone-jacketed, 3-conductor       | Silicone/Cu   |                        |
| SSR relay          | 1   | Solid state relay for heater control | Semiconductor | Crydom D2425 or equiv  |

## 4. Ports & Valves (Head Plate)

| Item                | Qty | Description                          | Material      | Parr Ref / Notes        |
| ------------------- | --- | ------------------------------------ | ------------- | ----------------------- |
| Needle valve, inlet | 1   | 1/8" NPT, 3000 psi rated             | 316 SS        | Gas inlet               |
| Needle valve, vent  | 1   | 1/8" NPT, 3000 psi rated             | 316 SS        | Gas vent                |
| Needle valve, dip   | 1   | 1/8" NPT, with tube extension        | 316 SS        | Liquid sampling         |
| Burst disc assembly | 1   | 1/4" NPT holder + rupture disc       | 316 SS + Ni   | 250 bar set (or spec'd) |
| Dip tube            | 1   | ~3 mm OD, extends near vessel bottom | 316 SS        | Sampling line           |
| Thermowell          | 1   | Closed-end tube, 1/8" OD × ~120 mm   | 316 SS        | For thermocouple        |
| Type-J thermocouple | 1   | In thermowell, connected to 4848 PTM | 316 SS sheath | Standard                |
| Pipe plugs          | 2-3 | 1/8" NPT, hex head                   | 316 SS        | For unused ports        |
| PTFE thread tape    | 1   | 1/2" wide                            | PTFE          | For all NPT connections |

## 5. Instrumentation

| Item                | Qty | Description                       | Parr Ref | Notes                           |
| ------------------- | --- | --------------------------------- | -------- | ------------------------------- |
| Pressure gauge      | 1   | 3.5" dial, 0-3000 psi (standard)  | Standard | Bourdon tube, SS movement       |
| Pressure gauge (HT) | 1   | 3.5" dial, 0-2000 psi (HT option) | HT       | For high temp configuration     |
| Pressure transducer | 1   | For PDM module (optional)         | Optional | Electronic pressure measurement |
| Thermocouple        | 1   | Type-J, ungrounded, in thermowell | Type-J   | Connected to PTM                |

## 6. Cooling System (Optional)

| Item               | Qty | Description                               | Material | Parr Ref / Notes        |
| ------------------ | --- | ----------------------------------------- | -------- | ----------------------- |
| Cooling coil       | 1   | Single loop, internal (standard)          | 316 SS   | Included on most models |
| Cooling coil (alt) | 1   | Serpentine style (optional)               | 316 SS   | Better heat transfer    |
| Coldfinger         | 1   | Internal coldfinger (5500 series style)   | 316 SS   | Optional                |
| Solenoid valve     | 1   | For SVM module, automatic cooling control | Brass/SS | SVM module              |

## 7. Stand & Support

| Item               | Qty | Description                | Material       | Notes                          |
| ------------------ | --- | -------------------------- | -------------- | ------------------------------ |
| Base plate         | 1   | 12" × 18" steel plate      | Steel, painted | Official dimension             |
| Support rod        | 1   | ~1" dia. × ~20" high       | 304 SS         | Threaded ends                  |
| Top clamp          | 1   | Split clamp for head plate | Steel/SS       | Secures head to rod            |
| Motor bracket      | 1   | Motor mount bracket        | Aluminum       | Clamps to support rod          |
| Rubber feet        | 4   | Anti-vibration feet        | Rubber         | Base mounting                  |
| Compression spring | 1   | Between base and vessel    | 316 SS         | Thermal expansion compensation |

## 8. Controller (Parr 4848)

| Item                | Qty | Description                              | Parr Ref | Notes                            |
| ------------------- | --- | ---------------------------------------- | -------- | -------------------------------- |
| 4848 Controller     | 1   | Base controller with PTM                 | 4848-EB  | Includes PID temperature control |
| RS-485 to USB cable | 1   | For PC communication                     | A1925E4  | Required for data logging        |
| SpecView software   | 1   | Full HMI software (optional)             | A3504HC  | Commercial                       |
| TDM module          | 1   | Tachometer display (option)              | -TDM     | Speed display                    |
| MCM module          | 1   | Motor control (option, replaces TDM)     | -MCM     | Closed-loop speed control        |
| PDM module          | 1   | Pressure display (option)                | -PDM     | Electronic pressure              |
| HTM module          | 1   | High temp cut-off (option)               | -HTM     | Redundant safety                 |
| ETLM module         | 1   | External temp limit (option)             | -ETLM    | Cascade control alternative      |
| SVM module          | 1   | Solenoid valve (option)                  | -SVM     | Automatic cooling                |
| MTM module          | 1   | Motor torque (option, requires MCM)      | -MTM     | Torque monitoring                |
| AUX module          | 1   | Auxiliary input 4-20mA/0-5V (4848B only) | -AUX     | Additional analog input          |

## 9. Electrical

| Item               | Qty | Description                 | Rating        | Notes                  |
| ------------------ | --- | --------------------------- | ------------- | ---------------------- |
| Main power cable   | 1   | IEC C14 inlet to controller | 10 A, 230 V   | Detachable             |
| Heater power cable | 1   | From SSR to heater          | 14 AWG, 230 V | Silicone-jacketed      |
| Motor cable        | 1   | From controller to motor    | 0-90 VDC, 2 A | Shielded               |
| TC extension cable | 1   | Type-J thermocouple wire    | Type-J        | Compensated connection |

## 10. Spare Parts Kits

| Kit                 | Parr Ref | Contents                                     |
| ------------------- | -------- | -------------------------------------------- |
| Standard spare kit  | 4569M    | Gaskets, O-rings, fuses, valve packing, etc. |
| High temp spare kit | 4569HT   | Graphite gaskets, HT O-rings, ceramic parts  |

## Summary of Key Part Numbers

| Component                | Part Number    | Source              |
| ------------------------ | -------------- | ------------------- |
| Magnetic drive           | A1120HC6       | Parr Instrument     |
| Standard spare parts kit | 4569M          | Parr Instrument     |
| HT spare parts kit       | 4569HT         | Parr Instrument     |
| 4848 Controller base     | 4848-EB        | Parr Instrument     |
| RS-485 to USB cable      | A1925E4        | Parr Instrument     |
| SpecView software        | A3504HC        | Parr Instrument     |
| SSR relay                | D2425 (Crydom) | Crydom / equivalent |
| Pressure gauge, 3000 psi | Standard       | Ashcroft / equiv    |
| Type-J thermocouple      | Standard       | Omega / equivalent  |

## Notes

- Qty marked "1" unless otherwise noted
- "Standard" indicates included with base system
- "Optional" indicates available as add-on
- Part numbers reference Parr Instrument Company catalog
- Final BOM depends on exact model and options selected
- For 3D modeling, prioritize parts marked "Standard" and visible in product photos
