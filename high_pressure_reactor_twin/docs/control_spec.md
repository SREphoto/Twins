# Control System Specification — Parr 4848 Reactor Controller

For digital twin implementation of the Parr 4848 Reactor Controller used with Series 4560 Mini Reactors.

## Overview

The Parr 4848 Reactor Controller is a modular digital controller that provides:
- PID temperature control with auto-tuning
- Motor speed control (open or closed loop)
- Pressure monitoring and display
- Over-temperature and over-pressure safety shutdown
- RS-485 digital communication for PC data logging
- Ramp/soak programming (up to 49 segments)

## Controller Models

| Model   | Description                                      | Max Modules |
| ------- | ------------------------------------------------ | ----------- |
| 4848    | Standard controller, up to 3 expansion modules   | 3 + PTM     |
| 4848B   | Expanded controller, up to 6 expansion modules   | 6 + PTM     |
| 4848M   | Master controller for multi-zone heating         | Varies      |
| 4848A   | Controller for AC motors (specialty applications)| Varies      |

## Module Specifications

### 1. Primary Temperature Control Module (PTM) — Always Included

| Parameter              | Specification                            |
| ---------------------- | ---------------------------------------- |
| **Control type**       | Full PID with auto-tune                  |
| **Input sensor**       | Thermocouple (Type-J standard) or RTD    |
| **Outputs**            | 3: heating, cooling, alarm/heater cut-off|
| **Programming**        | Ramp and soak, up to 49 segments         |
| **Display**            | Dual 4-digit LED (process + setpoint)    |
| **Control accuracy**   | ±1 °C (typical)                          |
| **Heater output**      | SSR relay, 115/230 VAC                   |
| **Cooling output**     | Solenoid valve control (via SVM)         |

### 2. Pressure Display Module (PDM) — Optional

| Parameter              | Specification                            |
| ---------------------- | ---------------------------------------- |
| **Input**              | Pressure transducer on reactor           |
| **Display range**      | Configurable (psi, bar, or mPa)          |
| **Alarm**              | High pressure limit → heater cut-off     |
| **Communication**      | Continuous transmission to PC via RS-485 |

### 3. Tachometer Display Module (TDM) — Optional

| Parameter              | Specification                            |
| ---------------------- | ---------------------------------------- |
| **Function**           | Displays stirrer speed                   |
| **Speed control**      | Manual potentiometer on front panel      |
| **Communication**      | Continuous transmission to PC via RS-485 |

### 4. Motor Control Module (MCM) — Optional (replaces TDM)

| Parameter              | Specification                            |
| ---------------------- | ---------------------------------------- |
| **Function**           | Closed-loop feedback motor speed control |
| **Speed regulation**   | ±2% of set speed (compensates for viscosity changes) |
| **Remote setpoint**    | Adjustable from host PC                  |
| **Output**             | Dynamically adjusts motor voltage        |
| **Torque monitoring**  | Primary controller output reflects motor loading |

### 5. Motor Torque Module (MTM) — Optional (requires MCM)

| Parameter              | Specification                            |
| ---------------------- | ---------------------------------------- |
| **Function**           | Displays motor torque from MCM           |
| **Application**        | Reactions with changing viscosities      |

### 6. High Temperature Cut Off Module (HTM) — Optional

| Parameter              | Specification                            |
| ---------------------- | ---------------------------------------- |
| **Function**           | Redundant over-temperature protection    |
| **Sensor**             | Independent (internal or external)       |
| **Action**             | Activates lockout relay → heater shutdown|
| **Reset**              | Manual reset required                    |

### 7. External Temperature Limit Module (ETLM) — Optional

| Parameter              | Specification                            |
| ---------------------- | ---------------------------------------- |
| **Function**           | Monitors reactor outside wall temperature|
| **Application**        | Cascade control alternative for PTFE liners, gas-phase reactions |
| **Action**             | Interrupts control signal when external temp exceeded |

### 8. Solenoid Valve Module (SVM) — Optional

| Parameter              | Specification                            |
| ---------------------- | ---------------------------------------- |
| **Function**           | Automatic cooling water control          |
| **Components**         | Solenoid valve + flow adjustment valve   |
| **Cooling media**      | Tap water (typical)                      |
| **Connection**         | Plugs into cooling output on 4848        |

## Front Panel Elements

Based on product photos and module descriptions:

| Element                | Type                    | Function                             |
| ---------------------- | ----------------------- | ------------------------------------ |
| **LCD Display**        | Dual 4-digit LED        | PV (process value) + SV (setpoint)   |
| **Temperature display**| Digital readout         | Current temperature in °C            |
| **Pressure display**   | Digital readout (PDM)   | Current pressure in psi/bar/mPa      |
| **RPM display**        | Digital readout (TDM)   | Current stirrer speed                |
| **Speed potentiometer**| Rotary knob             | Manual stirrer speed adjustment      |
| **Heater switch**      | Rocker switch           | Heater on/off                        |
| **Power switch**       | Rocker switch           | System power                         |
| **Status LEDs**        | Green/amber/red         | Power, heater active, alarm          |
| **Alarm indicator**    | Red LED                 | Over-temp or over-pressure alarm     |

## Communication & Software

| Parameter              | Specification                            |
| ---------------------- | ---------------------------------------- |
| **Protocol**           | RS-485 bidirectional digital             |
| **Cable**              | A1925E4 RS-485 to USB (required for PC)  |
| **Isolated cable**     | A1925E6 RS-485 to USB, isolated, 30 ft   |
| **Daisy chain**        | A2208E for multiple controllers, 10 ft   |
| **Free software**      | ParrCom (basic logging)                  |
| **Full HMI**           | A3504HC SpecView (commercial)            |
| **Capabilities**       | Log readings, send setpoints, alarm values|

## Electrical Specifications

| Parameter              | Specification                            |
| ---------------------- | ---------------------------------------- |
| **Input voltage**      | 115 VAC or 230 VAC (selectable)          |
| **Heater output**      | 115/230 VAC via SSR                      |
| **Motor output**       | 0-90 VDC (for DC motor)                  |
| **Max load (4566)**    | 7 A @ 115 V / 4 A @ 230 V               |
| **Max load (HT)**      | 10 A @ 115 V / 5 A @ 230 V              |
| **Enclosure**          | Steel, painted gray                      |
| **Protection**         | IP54 (splash-resistant)                  |

## Safety Systems

| System                 | Component(s)                            | Action                                  |
| ---------------------- | --------------------------------------- | --------------------------------------- |
| **Over-temperature**   | HTM + lockout relay                     | Heater cut-off, manual reset            |
| **Over-pressure**      | PDM + alarm relay                       | Heater cut-off at high pressure limit   |
| **Thermocouple fail**  | PTM internal check                      | Heater cut-off on TC failure            |
| **Motor overload**     | Current limit (1.5 A)                   | Motor stops                             |
| **Burst disc**         | Mechanical (in head plate)              | Passive overpressure relief             |

## Digital Twin Implementation Notes

For the digital twin, the following should be modeled:

1. **Front panel** — Display screen, knobs, switches, LEDs (visual fidelity)
2. **Temperature control** — PID algorithm simulation with configurable setpoint
3. **Motor speed control** — RPM display with manual potentiometer input
4. **Pressure display** — Pressure reading from simulated transducer
5. **Safety interlocks** — Over-temp and over-pressure alarm states
6. **RS-485 communication** — Simulated data logging output
7. **Heater state** — On/off with power level indication
8. **Cooling control** — SVM solenoid valve state (on/off)

## References

- Parr 4848 Reactor Controller product page: <https://www.parrinst.com/products/controllers/4848-reactor-controller/>
- 4848 Specifications: <https://www.parrinst.com/products/controllers/4848-reactor-controller/specifications/>
- 4848 Ordering Guide: <https://www.parrinst.com/products/controllers/4848-reactor-controller/ordering-guide/>
