# Vacuum Pump — Schematics & Wiring

Based on KNF Laboport N820 / N840 electrical design. Internal schematics are not publicly available; this document
reconstructs the expected electrical architecture from standard practices and component specifications.

## Electrical System Overview

```diagram
AC Mains (230V / 50Hz)
    │
    ├── IEC C14 Inlet
    │       │
    │       ├── Fuse (T2A, 250V)
    │       ├── EMI Filter
    │       └── Power Switch
    │               │
    │               ├── AC-DC Power Supply (230VAC → 24VDC)
    │               │       │
    │               │       ├── Motor Controller (BLDC driver)
    │               │       │       └── Brushless DC Motor (60–80W)
    │               │       │
    │               │       └── Status LED (green)
    │               │
    │               └── (Optional) Cooling Fan (if AC powered)
    │
    └── Ground (Earth)
```

## Power Supply Specifications

| Parameter  | Value                                   | Notes                    |
| ---------- | --------------------------------------- | ------------------------ |
| Input      | 100–240 VAC, 50/60 Hz                   | Universal input          |
| Output     | 24 VDC                                  | Typical for BLDC motors  |
| Power      | 100–120 W                               | Rated for motor + margin |
| Efficiency | > 85%                                   | Typical switching supply |
| Protection | Overcurrent, overvoltage, short circuit | —                        |

## Motor Controller (BLDC Driver)

| Parameter  | Value                         | Notes                           |
| ---------- | ----------------------------- | ------------------------------- |
| Input      | 24 VDC                        | From power supply               |
| Output     | 3-phase PWM                   | For BLDC motor                  |
| Current    | 3–5 A peak                    | Motor dependent                 |
| Control    | Open-loop or Hall-sensor      | Speed control via potentiometer |
| Protection | Overcurrent, thermal shutdown | —                               |

## Motor Specifications

| Parameter  | Value                | Notes                 |
| ---------- | -------------------- | --------------------- |
| Type       | Brushless DC (BLDC)  | 3-phase, 8-pole       |
| Power      | 60–80 W              | Continuous            |
| Voltage    | 24 VDC               | From internal supply  |
| Speed      | 1500–3000 rpm        | Controlled            |
| Bearings   | Sealed ball bearings | 6200 series (typical) |
| Cooling    | Self-ventilated      | Fan on shaft          |
| Insulation | Class B (130°C)      | —                     |
| Protection | IP20                 | Open frame            |

## Wiring Diagram (Text)

```diagram
IEC C14 Inlet
    │
    ├── L (Brown) ─── Fuse (T2A) ─── EMI Filter L ─── Switch ─── PSU L
    ├── N (Blue)  ────────────────── EMI Filter N ─── Switch ─── PSU N
    └── E (Green/Yellow) ──────────── EMI Filter E ───────────────── PSU E

PSU Output (+24V) ─── Motor Controller V+
PSU Output (GND)  ─── Motor Controller GND

Motor Controller:
    V+ ─── BLDC Motor Phase A (Red)
    V+ ─── BLDC Motor Phase B (Yellow)
    V+ ─── BLDC Motor Phase C (Blue)
    Hall A ─── Motor Hall Sensor A
    Hall B ─── Motor Hall Sensor B
    Hall C ─── Motor Hall Sensor C
    Speed Control ─── Potentiometer (10kΩ)
    Enable ─── Power Switch (via PSU)

Status LED:
    +24V ─── Resistor (1kΩ) ─── Green LED ─── GND
```

## Connector Pinouts

### IEC C14 Inlet (Rear Panel)

| Pin | Signal         | Wire Color   |
| --- | -------------- | ------------ |
| L   | Line (Live)    | Brown        |
| N   | Neutral        | Blue         |
| E   | Earth (Ground) | Green/Yellow |

### Motor Connector (Internal)

| Pin | Signal     | Wire Color |
| --- | ---------- | ---------- |
| 1   | Phase A    | Red        |
| 2   | Phase B    | Yellow     |
| 3   | Phase C    | Blue       |
| 4   | Hall A     | White      |
| 5   | Hall B     | Green      |
| 6   | Hall C     | Violet     |
| 7   | +5V (Hall) | Orange     |
| 8   | GND (Hall) | Black      |

### Potentiometer (Speed Control)

| Pin | Signal      | Notes                           |
| --- | ----------- | ------------------------------- |
| 1   | +5V or +10V | Reference voltage               |
| 2   | Wiper       | To motor controller speed input |
| 3   | GND         | Ground                          |

## Fuse Specifications

| Parameter | Value                         | Notes     |
| --------- | ----------------------------- | --------- |
| Rating    | T2A (2A, time-delay)          | 250V      |
| Type      | 5×20 mm glass tube            | IEC 60127 |
| Location  | Rear panel, next to IEC inlet | —         |

## EMI Filter Specifications

| Parameter   | Value                    | Notes   |
| ----------- | ------------------------ | ------- |
| Type        | Single-stage line filter | —       |
| Current     | 2 A                      | Rated   |
| Voltage     | 250 VAC                  | —       |
| Attenuation | > 20 dB at 150 kHz       | Typical |
| Standard    | EN 55011 / EN 55022      | Class B |

## Thermal Protection

| Component        | Type                      | Trip Temperature | Reset                    |
| ---------------- | ------------------------- | ---------------- | ------------------------ |
| Motor            | Bimetallic cutout         | 130°C (winding)  | Auto-reset at 80°C       |
| Power supply     | Over-temperature shutdown | 85°C (case)      | Auto-reset after cooling |
| Motor controller | Thermal pad + shutdown    | 90°C (heatsink)  | Auto-reset after cooling |

## Pneumatic/Flow Schematic

```diagram
Inlet (KF25)
    │
    ├── Inlet Check Valve (Poppet, FFPM)
    │       │
    │       ├── Pump Chamber (Front Head)
    │       │       │
    │       │       ├── Diaphragm (Reciprocating)
    │       │       │
    │       │       └── Outlet Check Valve (Poppet, FFPM)
    │       │               │
    │       │               ├── Connecting Tube
    │       │               │       │
    │       │               │       ├── Inlet Check Valve (Poppet, FFPM)
    │       │               │       │       │
    │       │               │       │       ├── Pump Chamber (Back Head)
    │       │               │       │       │       │
    │       │               │       │       │       └── Diaphragm (Reciprocating)
    │       │               │       │       │               │
    │       │               │       │       │               └── Outlet Check Valve
    │       │               │       │       │                       │
    │       │               │       └───────┘                       │
    │       │               │                                       │
    │       │               └── Gas Ballast Valve (Manual) ──── Air Inlet
    │       │
    │       └── Exhaust Muffler (Sintered Metal)
    │               │
    │               └── Exhaust Port (Rear)
    │
    └── Vacuum Gauge (Bourdon Tube, 0–760 mmHg)
```

## Control Logic

### State Machine

```diagram
                ┌──────────────┐
                │              │
                ▼              │
            ┌──────┐     ┌──────────┐
    OFF ──► │ IDLE │ ──► │ RUNNING  │
            └──────┘     └──────────┘
                ▲              │
                │              │
                │      ┌──────────────┐
                │      │ RUNNING_WITH │
                │      │  GAS_BALLAST │
                │      └──────────────┘
                │              │
                └──────────────┘
```

### State Transitions

| From                 | To                   | Trigger                 |
| -------------------- | -------------------- | ----------------------- |
| OFF                  | IDLE                 | Power switch ON         |
| IDLE                 | OFF                  | Power switch OFF        |
| IDLE                 | RUNNING              | Motor start (automatic) |
| RUNNING              | IDLE                 | Motor stop (automatic)  |
| RUNNING              | RUNNING_WITH_BALLAST | Gas ballast opened      |
| RUNNING_WITH_BALLAST | RUNNING              | Gas ballast closed      |
| RUNNING              | OFF                  | Power switch OFF        |
| RUNNING_WITH_BALLAST | OFF                  | Power switch OFF        |
| Any                  | ERROR                | Thermal overload        |
| ERROR                | IDLE                 | Thermal reset (auto)    |

## PCB Layout (Expected)

The internal electronics are expected to be on 2–3 PCBs:

### Main Power Board

- AC input section (fuse, EMI filter, rectifier)
- AC-DC converter (flyback or LLC topology)
- 24 VDC output with filtering
- Dimensions: ~80 × 60 mm

### Motor Controller Board

- BLDC driver (3-phase inverter)
- Hall sensor interface
- Speed control input (potentiometer)
- Overcurrent protection
- Dimensions: ~60 × 50 mm

### Front Panel Board (optional)

- Power switch
- Status LED
- Potentiometer (if panel-mounted)
- Dimensions: ~40 × 30 mm

## Grounding Scheme

```diagram
AC Earth ──── Chassis Ground ──── Motor Frame
                │
                ├── EMI Filter Ground
                ├── Power Supply Ground
                ├── Motor Controller Heatsink
                └── Housing (via mounting screws)
```

All exposed metal parts must be bonded to earth ground for safety.
