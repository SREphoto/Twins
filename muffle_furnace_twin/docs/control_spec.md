# Control Specification — Muffle Furnace

Based on Nabertherm L 9/11 with digital PID controller.

## States

| State       | Description                      | Display                             | Heating                |
| ----------- | -------------------------------- | ----------------------------------- | ---------------------- |
| OFF         | Unit powered down                | Dark                                | Off                    |
| STANDBY     | Idle, set temperature maintained | Shows current temp                  | Holding at setpoint    |
| HEATING     | Ramping to setpoint              | Flashing setpoint or ramp indicator | Full power             |
| SOAK        | Holding at temperature           | Stable temp display                 | PID regulation         |
| PROGRAM_RUN | Multi-segment program active     | Segment number, time remaining      | Programmed profile     |
| COOLING     | Natural or forced cool-down      | Temperature decreasing              | Off                    |
| DOOR_OPEN   | Door opened during operation     | Warning/alarm                       | Heater off (interlock) |
| OVERTEMP    | Over-temperature limit triggered | "OT" or alarm code                  | Heater off             |
| ERROR       | Sensor or system fault           | Error code                          | Heater off             |

## Transitions

- OFF → STANDBY: Power on, setpoint loaded
- STANDBY → HEATING: Setpoint > current temperature
- HEATING → SOAK: Temperature reaches setpoint within tolerance
- SOAK → HEATING: Setpoint changed to higher value
- SOAK → COOLING: Setpoint changed to lower value or power off
- STANDBY → PROGRAM_RUN: Start program button pressed
- PROGRAM_RUN → SOAK: Program complete (maintains final temp)
- PROGRAM_RUN → COOLING: Program includes cool-down segment
- Any → DOOR_OPEN: Door interlock triggered (if equipped)
- Any → OVERTEMP: Overtemp limit exceeded
- Any → ERROR: Thermocouple failure, SSR short, sensor fault

## Controls

### Digital PID Controller

| Control         | Type                     | Function                           |
| --------------- | ------------------------ | ---------------------------------- |
| Setpoint adjust | Rotary encoder or keypad | Set target temperature             |
| Up/Down         | Keypad buttons           | Adjust temperature, navigate menus |
| Enter/Select    | Keypad button            | Confirm selection                  |
| Program (PGM)   | Keypad button            | Access ramp/soak programming       |
| Start/Stop      | Keypad button            | Start/stop program                 |
| Heater on/off   | Keypad or switch         | Enable/disable heating             |
| Auto-tune       | Menu option              | Start PID auto-tuning              |

### Display Layout

```
┌─────────────────────┐
│  1234  °C   │ 1100  │ ← Upper: actual temp, Lower: setpoint
│ ┌───┐ ┌───┐ ┌───┐ │
│ │ON │ │PGM│ │ ↺ │ │ ← Heater, Program, Auto-tune indicators
│ └───┘ └───┘ └───┘ │
│ ┌─────────────────┐│
│ │ ○ HEAT ○ OUT    ││ ← Status LEDs: Heating, Output active
│ └─────────────────┘│
└─────────────────────┘
```

### Power Switch

| Control           | Location            | Function               |
| ----------------- | ------------------- | ---------------------- |
| Main power switch | Side or front panel | Unit on/off            |
| Circuit breaker   | Rear panel          | Overcurrent protection |

## Safety Interlocks

| Condition            | Behavior                                  |
| -------------------- | ----------------------------------------- |
| Door open            | Heater output cut (if interlock equipped) |
| Over-temperature     | Heater cut, alarm, requires manual reset  |
| Thermocouple failure | Error display, heater off                 |
| SSR failure          | Overtemp limit provides backup protection |
| Power failure        | Unit restarts in standby mode             |

## Communication (Optional)

| Interface | Protocol    | Function           |
| --------- | ----------- | ------------------ |
| RS-232    | Serial      | Data logging       |
| RS-485    | Modbus      | Multi-unit control |
| USB       | Virtual COM | PC connection      |
