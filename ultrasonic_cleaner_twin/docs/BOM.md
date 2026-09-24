# Bill of Materials — Ultrasonic Cleaner

Based on Branson 5800. For digital twin component identification.

## System Overview

1. **Tank Assembly** — SS tank, transducers, drain
2. **Generator** — High-frequency power supply, control board
3. **Heater** — Heating element, thermostat
4. **Control Panel** — Display, membrane keypad
5. **Housing** — Enclosure, lid, feet

## 1. Tank Assembly

| Item          | Qty | Description                | Material   | Notes                 |
| ------------- | --- | -------------------------- | ---------- | --------------------- |
| Tank          | 1   | Ultrasonic cleaning tank   | 304 SS     | 0.8-1.5 mm wall       |
| Transducers   | 2-6 | PZT piezoelectric elements | PZT        | Bonded to tank bottom |
| Drain fitting | 1   | Tank drain outlet          | SS/Brass   | Bottom rear           |
| Drain valve   | 1   | Ball or petcock            | SS/Plastic |                       |

## 2. Generator

| Item               | Qty | Description         | Notes                |
| ------------------ | --- | ------------------- | -------------------- |
| Generator PCB      | 1   | HF power supply     | 37-40 kHz, 100-300 W |
| Power MOSFETs      | 2-4 | Output stage        | Switching            |
| Output transformer | 1   | Impedance matching  |                      |
| Control PCB        | 1   | Timer, temp control | MCU-based            |

## 3. Heater

| Item               | Qty | Description         | Material   | Notes      |
| ------------------ | --- | ------------------- | ---------- | ---------- |
| Heater element     | 1   | Tubular or film     | SS/Incoloy | 100-500 W  |
| Thermostat         | 1   | Temperature control |            | Adjustable |
| Overtemp protector | 1   | Safety limit        |            | Auto-reset |
| Thermal fuse       | 1   | Final protection    |            | One-time   |

## 4. Control Panel

| Item              | Qty | Description           | Notes        |
| ----------------- | --- | --------------------- | ------------ |
| Display           | 1   | LED (4-digit)         | Timer + temp |
| Membrane keypad   | 1   | Tactile switch panel  | Sealed       |
| LED indicators    | 3-5 | Power, US, Heat, etc. |              |
| Main power switch | 1   | Rocker                | Rear panel   |

## 5. Housing

| Item               | Qty | Description       | Material      | Notes           |
| ------------------ | --- | ----------------- | ------------- | --------------- |
| Outer shell        | 1   | Enclosure         | Painted steel | Ventilated      |
| Lid                | 1   | Top cover         | SS or plastic | Hinged          |
| Lid gasket         | 1   | Seal              | EPDM/Silicone |                 |
| Rubber feet        | 4   | Anti-vibration    | Rubber        |                 |
| Basket (accessory) | 1   | Perforated insert | SS            | For small parts |
