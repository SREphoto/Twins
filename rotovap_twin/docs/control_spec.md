# Control Specification — Rotary Evaporator

Based on Buchi R-300 with I-300 Pro interface.

## States

| State | Description | Display | Bath | Rotation | Lift |
|-------|-------------|---------|------|----------|------|
| OFF | Unit powered down | Dark | Off | Off | Lowered |
| STANDBY | Idle, settings loaded | Screen saver or dim | Off | Off | Lowered |
| HEATING | Bath heating active | Current temp, setpoint | Heating to setpoint | Off | Lowered |
| ROTATING | Rotation active | Speed display | Off or heating | Set speed | Lowered |
| RUNNING | Full operation | All parameters | At setpoint | At setpoint | Lowered |
| LIFTED | Flask raised | Lift indicator | At setpoint | Off or slow | Raised |
| PROGRAM | Auto program active | Segment info | Programmed | Programmed | Programmed |
| COOLING | Bath cooling down | Temp decreasing | Off | Off | Lowered |
| ERROR | System fault | Error code | Off | Off | Raised (auto) |

## Controls (Touchscreen)

| Control | Type | Function |
|---------|------|----------|
| Power | Rocker switch | Unit on/off |
| Heating on/off | Touch button | Enable/disable bath heating |
| Rotation speed | Touch + up/down | Set 20–280 rpm |
| Bath temp setpoint | Touch + numeric | Set 20–220°C |
| Lift up/down | Touch button | Motorized lift control |
| Mode select | Touch button | Manual / Automatic / Program |
| Vacuum setpoint | Touch + numeric | If V-300 connected |
| Timer | Touch + numeric | Countdown with auto-lift stop |

## Display Layout

```
┌─────────────────────────────────────────┐
│  Speed: 150 rpm   Bath: 60°C / 60°C   │ ← Status bar
├─────────────────────────────────────────┤
│                                         │
│      ┌──────────────────────┐           │
│      │  45.2°C      150 rpm │           │ ← Main display
│      │  ┌─┐ ┌─┐ ┌─┐ ┌─┐   │           │
│      │  │~│ │ │ │ │ │ │   │           │
│      │  └─┘ └─┘ └─┘ └─┘   │           │
│      └──────────────────────┘           │
│                                         │
│ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │  Lift  │ │  Heat  │ │ Rotation│       │ ← Controls
│ └────────┘ └────────┘ └────────┘       │
│ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │ Manual │ │  Auto  │ │Program │       │ ← Mode
│ └────────┘ └────────┘ └────────┘       │
│ Vacuum: 350 mbar                        │ ← Status
└─────────────────────────────────────────┘
```

## Safety Interlocks

| Condition | Behavior |
|-----------|----------|
| Power failure | Lift raises automatically, rotation stops |
| Bath overtemp | Independent safety thermostat cuts power |
| No rotation with heat | Warning, prevent overheating |
| Flask not attached | Rotation disabled |
| Lid open | Rotation disabled (if interlock equipped) |

## Communication

| Interface | Protocol | Function |
|-----------|----------|----------|
| RS-232 | Serial | Data logging, control |
| USB | Virtual COM | PC connection |
| Ethernet | TCP/IP | Remote monitoring |