# Bill of Materials — pH Meter

Based on Mettler Toledo SevenExcellence S470. For digital twin component identification.

## System Overview

1. **Housing** — Enclosure, display, rear panel
2. **Measurement Electronics** — Main PCB, amplifier, ADC
3. **Electrode Assembly** — Combination electrode, arm, holder
4. **Interface Board** — RS-232, USB, Ethernet
5. **Power Supply** — External AC/DC adapter

## 1. Housing

| Item           | Qty | Description     | Material      | Notes                |
| -------------- | --- | --------------- | ------------- | -------------------- |
| Main enclosure | 1   | Body            | Plastic/metal | Benchtop form factor |
| Front bezel    | 1   | Display frame   | Plastic       | Angled for viewing   |
| Rear panel     | 1   | Connector panel | Metal         | Cutouts for ports    |
| Rubber feet    | 4   | Anti-skid       | Rubber        |                      |

## 2. Measurement Electronics

| Item                     | Qty | Description        | Notes                        |
| ------------------------ | --- | ------------------ | ---------------------------- |
| Main PCB                 | 1   | System board       | MCU, memory, real-time clock |
| High-impedance amplifier | 1   | >10¹² Ω input      | For glass electrode          |
| ADC                      | 1   | 24-bit sigma-delta | High resolution              |
| Display                  | 1   | 7" TFT touchscreen | Capacitive multi-touch       |
| Display PCB              | 1   | Driver board       | Behind display               |

## 3. Electrode Assembly

| Item                  | Qty | Description            | Notes                    |
| --------------------- | --- | ---------------------- | ------------------------ |
| Combination electrode | 1   | Glass pH electrode     | BNC or Mini-DIN          |
| ATC probe             | 1   | PT1000 or NTC          | Temperature compensation |
| Electrode arm         | 1   | Articulated arm        | Stainless steel          |
| Electrode holder      | 1   | Adjustable clamp       | Plastic                  |
| Arm base              | 1   | Magnetic or screw base |                          |

## 4. Interface Board

| Item                | Qty | Description             |
| ------------------- | --- | ----------------------- |
| RS-232 transceiver  | 1   | DB9 female              |
| USB controller      | 1   | USB-A + USB-B           |
| Ethernet PHY        | 1   | RJ45 (optional)         |
| Mini-DIN connectors | 2-3 | Electrode, ATC, stirrer |

## 5. Power Supply

| Item          | Qty | Description    | Notes      |
| ------------- | --- | -------------- | ---------- |
| AC/DC adapter | 1   | External brick | 12–24 VDC  |
| Power cable   | 1   | IEC C7 or C5   |            |
| DC jack       | 1   | Coaxial        | Rear panel |
