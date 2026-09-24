# Control Specification — pH Meter

Based on Mettler Toledo SevenExcellence S470.

## States

| State       | Description                    | Display                                | Electrode                |
| ----------- | ------------------------------ | -------------------------------------- | ------------------------ |
| OFF         | Unit powered down              | Dark                                   | Idle                     |
| STANDBY     | Low power, idle                | Dim/screen saver                       | Idle, stored in solution |
| READY       | Stable reading, no measurement | Current pH/temp, stable                | In solution              |
| MEASURING   | pH reading in progress         | Active pH display, stability indicator | In solution              |
| STABLE      | Reading locked                 | Solid reading with stability icon      | In solution              |
| CALIBRATION | Buffer calibration in progress | Buffer pH, slope, offset               | In buffer                |
| ERROR       | Sensor or system fault         | Error code                             | Check electrode          |

## Transitions

- OFF → STANDBY: Power on
- STANDBY → READY: Wake (touch or button)
- READY → MEASURING: Electrode in solution, auto-detect
- MEASURING → STABLE: Reading stable (~30 seconds)
- READY → CALIBRATION: User selects CAL
- CALIBRATION → READY: Calibration complete
- Any → ERROR: Electrode fault, calibration error, hardware fault

## Controls

| Control  | Type               | Function                         |
| -------- | ------------------ | -------------------------------- |
| Power    | Rear rocker switch | Unit on/off                      |
| READ     | Touch button       | Start/stop measurement           |
| CAL      | Touch button       | Start calibration                |
| SETUP    | Touch button       | System settings                  |
| DATA     | Touch button       | View logged data                 |
| METHOD   | Touch button       | Select measurement method        |
| i (INFO) | Touch button       | Electrode condition, system info |
| HOME     | Touch button       | Return to main screen            |

## Display Layout

```mermaid
┌─────────────────────────────────────────┐
│ pH 7.001    │ 24.5°C   │ mV: +0.3       │ ← Main measurement
│ ┌───────────────┐                       │
│ │ ○ Stable      │                       │ ← Stability indicator
│ └───────────────┘                       │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│ │ READ │ │ CAL  │ │ SETUP│ │ DATA │     │ ← Action buttons
│ └──────┘ └──────┘ └──────┘ └──────┘     │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│ │METHOD│ │ INFO │ │ HOME │ │      │     │
│ └──────┘ └──────┘ └──────┘ └──────┘     │
│ Electrode: OK   Slope: 98.5%            │ ← Status line
│ Last cal: 2026-07-25 14:30              │
└─────────────────────────────────────────┘
```

## Communication

| Interface | Protocol     | Default               |
| --------- | ------------ | --------------------- |
| RS-232    | ASCII serial | 9600, 8-N-1           |
| USB-B     | Virtual COM  | Same as RS-232        |
| Ethernet  | TCP/IP       | DHCP                  |
| USB-A     | Host         | Flash drive, keyboard |

## Alarms

| Condition                 | Behavior                       |
| ------------------------- | ------------------------------ |
| Calibration overdue       | Warning on startup             |
| Electrode slope < 90%     | Warning, recommend replacement |
| Electrode offset > ±30 mV | Warning, clean/replace         |
| Temperature out of range  | Error, check ATC probe         |
