# Control Specification — Ultrasonic Cleaner

Based on Branson 5800/7800 digital models.

## States

| State         | Description        | Display             | Ultrasonic | Heater |
| ------------- | ------------------ | ------------------- | ---------- | ------ |
| OFF           | Unit powered down  | Dark                | Off        | Off    |
| IDLE          | Power on, ready    | Ready/standby       | Off        | Off    |
| ULTRASONIC_ON | Cleaning active    | Timer counting down | Active     | As set |
| HEATING_ON    | Heating active     | Current temperature | Off        | Active |
| RUNNING       | Cleaning + heating | Timer + temp        | Active     | Active |
| DEGASSING     | Degas cycle        | "DEGAS" indicator   | Pulsed     | Off    |
| PAUSED        | Cycle paused       | "PAUSE"             | Off        | Off    |
| COMPLETE      | Cycle finished     | "COMPLETE"          | Off        | Off    |
| ERROR         | System fault       | Error code          | Off        | Off    |

## Controls

| Control     | Type            | Function            |
| ----------- | --------------- | ------------------- |
| Power       | Rocker switch   | Unit on/off (rear)  |
| ON/OFF      | Membrane button | Ultrasonic on/off   |
| HEAT ON/OFF | Membrane button | Heater toggle       |
| TIMER ▲/▼   | Membrane button | Set time (0–30 min) |
| TEMP ▲/▼    | Membrane button | Set temperature     |
| START/STOP  | Membrane button | Start/stop cycle    |
| DEGAS       | Membrane button | Degas mode toggle   |
| SWEEP       | Membrane button | Sweep mode toggle   |

## Display Layout (Digital Model)

```mermaid
┌──────────────────────┐
│  15:00  │  45°C     │ ← Timer (MM:SS) | Temperature
│ ┌────────────────┐  │
│ │  RUNNING       │  │ ← Status indicator
│ └────────────────┘  │
│ ○ POWER ○ HEAT ○ US │ ← LED indicators
└──────────────────────┘
```
