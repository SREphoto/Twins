# Control Specification — Glove Box (Inert Atmosphere)

Based on MBraun UNIlab Pro SP with BOSCH/Siemens PLC control system.

## States

| State | Description | Display | Chamber Status |
|-------|-------------|---------|----------------|
| OFF | System powered down | Dark | Sealed, no circulation |
| STANDBY | Low power, monitoring | Dim/screen saver | Sealed, minimal circulation |
| PURGE | Initial gas purge cycle | "PURGING" | Gas flow through chamber |
| RECIRCULATE | Normal operation, purification active | Purity levels displayed | < 1 ppm O₂/H₂O |
| REGENERATE | Column regeneration cycle | "REGENERATING" | Heated purge of columns |
| TRANSFER_IN | Material entry via antechamber | Antechamber status | Chamber sealed, antechamber cycling |
| TRANSFER_OUT | Material removal via antechamber | Antechamber status | Chamber sealed, antechamber cycling |
| NEGATIVE_PRESSURE | Foot switch active | Pressure indicator | Slight negative pressure |
| ERROR | System fault | Error code | Safety shutdown |

## Transitions

- OFF → PURGE: Power on, gas supply connected
- PURGE → RECIRCULATE: O₂/H₂O below threshold (< 100 ppm)
- RECIRCULATE → REGENERATE: Timed interval or sensor degradation
- REGENERATE → RECIRCULATE: Regeneration complete
- RECIRCULATE → TRANSFER_IN: User initiates antechamber cycle
- TRANSFER_IN → RECIRCULATE: Transfer complete, inner door closed
- RECIRCULATE → NEGATIVE_PRESSURE: Foot switch pressed
- NEGATIVE_PRESSURE → RECIRCULATE: Foot switch released
- Any → ERROR: Sensor fault, leak detected, overpressure

## Controls

### Touch Panel (BOSCH/Siemens PLC)

| Control | Type | Function |
|---------|------|----------|
| Power | Touchscreen | System on/off |
| Purge | Touchscreen | Initiate chamber purge |
| Regenerate | Touchscreen | Start column regeneration |
| Antechamber cycle | Touchscreen | Start transfer cycle |
| Pressure setpoint | Touchscreen | Set operating pressure |
| Alarm limits | Touchscreen | Set O₂/H₂O alarm thresholds |
| Gas selection | Touchscreen | Argon or Nitrogen |
| Service menu | Touchscreen | Maintenance, calibration |

### Foot Switch

| Control | Function |
|---------|----------|
| Press | Temporary negative pressure (~0.5" H₂O below ambient) |
| Release | Return to normal positive pressure |

### Manual Valves

| Valve | Location | Function |
|-------|----------|----------|
| Main gas supply | Rear panel | Shut-off for inert gas |
| Antechamber vacuum | Near antechamber | Vacuum pump isolation |
| Antechamber vent | Near antechamber | Vent to atmosphere |
| Regeneration gas | Near purification | 5% H₂/N₂ supply |

## Display Layout (Touch Panel)

```
┌─────────────────────────────────────────┐
│  O₂: 0.2 ppm    H₂O: 0.5 ppm    OK     │ ← Status bar
├─────────────────────────────────────────┤
│                                         │
│         Chamber Pressure                │
│         +0.10" H₂O                      │ ← Pressure display
│         ┌─────┐                         │
│         │ ████│ ← Bar graph             │
│         └─────┘                         │
│                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │  Purge   │ │Regenerate│ │ Transfer │ │ ← Action buttons
│ └──────────┘ └──────────┘ └──────────┘ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │  Gas: Ar │ │ Pressure │ │  Alarm   │ │ ← Settings
│ └──────────┘ └──────────┘ └──────────┘ │
│                                         │
│ Gas: Argon   Flow: 2.5 L/min           │ ← Status info
│ Columns: 85% remaining                  │
└─────────────────────────────────────────┘
```

## Sensors

| Sensor | Type | Range | Accuracy |
|--------|------|-------|----------|
| O₂ | Electrochemical | 0–1000 ppm | ±0.1 ppm |
| O₂ | Paramagnetic (optional) | 0–25% | ±0.01% |
| H₂O | Capacitive | 0–1000 ppm | ±0.1 ppm |
| Pressure | Differential manometer | ±15" H₂O | ±0.01" H₂O |
| Temperature | Type-K thermocouple | 0–500°C | ±1°C |
| Flow | Mass flow meter | 0–50 L/min | ±2% |

## Alarms & Interlocks

| Condition | Behavior |
|-----------|----------|
| O₂ > 1 ppm | Warning on display, recommend regeneration |
| O₂ > 10 ppm | Alarm, initiate automatic purge |
| H₂O > 1 ppm | Warning on display |
| H₂O > 10 ppm | Alarm, initiate automatic purge |
| Pressure > +0.5" H₂O | Overpressure alarm, vent solenoid opens |
| Pressure < -0.5" H₂O | Underpressure alarm, gas inlet opens |
| Glove failure | Alarm, blower increases to >0.5 m/s inward flow |
| Leak detected | Alarm, isolate chamber |
| Regeneration overdue | Warning, recommend regeneration |
| Sensor fault | Error code, recommend service |

## Communication

| Interface | Protocol | Function |
|-----------|----------|----------|
| RS-232 | Serial | Data logging |
| Ethernet | TCP/IP | Remote monitoring |
| USB | USB-A | Data export |
| Digital I/O | 24 VDC | External alarm integration |