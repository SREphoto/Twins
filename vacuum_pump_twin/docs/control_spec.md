# Control Specification — Vacuum Pump

Based on KNF Laboport N820.

## 1. States & Logic

The controller manages a brushless DC motor driver and simulates physical vacuum system pressure (evacuation and
leak-back).

| State               | Description                        | Motor Target         | Ballast Valve | Display LED    | Notes                                   |
| ------------------- | ---------------------------------- | -------------------- | ------------- | -------------- | --------------------------------------- |
| **OFF**             | Unit unplugged or power switch OFF | 0 RPM                | As set        | Dark           | Complete power-down.                    |
| **IDLE**            | Power switch ON, motor stopped     | 0 RPM                | As set        | Green (Solid)  | Ready to run.                           |
| **STARTING**        | Motor ramping up to setpoint speed | Ramping (0 → target) | As set        | Green (Solid)  | BLDC driver startup phase (~2s).        |
| **RUNNING**         | Pump evacuating system             | Setpoint (1500–3000) | Closed        | Green (Solid)  | Normal vacuum draw.                     |
| **RUNNING_BALLAST** | Pumping with gas ballast venting   | Setpoint (1500–3000) | Open          | Green (Solid)  | Evacuation with condensate prevention.  |
| **STOPPING**        | Motor decelerating to stop         | Ramping (target → 0) | As set        | Green (Solid)  | Wind-down phase (~1s).                  |
| **FAULT_OVERHEAT**  | Motor thermal cutout triggered     | 0 RPM                | As set        | Red (Flashing) | Auto-resets after cooling down (<80°C). |

## 2. State Transition Table

| Current State                     | Input / Event                   | Target State                      | Action / Transition Detail                                          |
| --------------------------------- | ------------------------------- | --------------------------------- | ------------------------------------------------------------------- |
| **OFF**                           | Toggle Power ON                 | **IDLE**                          | LEDs light up; system ready.                                        |
| **IDLE**                          | Toggle Power OFF                | **OFF**                           | Power indicators turn off.                                          |
| **IDLE**                          | Start Switch pressed            | **STARTING**                      | Motor starts soft-ramp; begins clicking check valves.               |
| **STARTING**                      | Ramp complete (Speed = target)  | **RUNNING** / **RUNNING_BALLAST** | Transitions to running state depending on gas ballast position.     |
| **RUNNING** / **RUNNING_BALLAST** | Stop Switch pressed             | **STOPPING**                      | Motor decelerates.                                                  |
| **RUNNING** / **RUNNING_BALLAST** | Open/Close Ballast              | **RUNNING_BALLAST** / **RUNNING** | Adjusts target vacuum limits and leak rates.                        |
| **STOPPING**                      | Decelerate complete (Speed = 0) | **IDLE**                          | Stays in idle ready state.                                          |
| **ANY (except OFF)**              | Motor Temp > 130°C              | **FAULT_OVERHEAT**                | Shuts down motor driver immediately; status LED turns red/flashing. |
| **FAULT_OVERHEAT**                | Motor Temp < 80°C               | **IDLE**                          | Cutout resets; returns to idle ready state.                         |
| **ANY**                           | Toggle Power OFF                | **OFF**                           | Forced shutdown.                                                    |

## 3. Interactive Controls

Each control is mapped to a named 3D object for mouse collision/picking:

| Control              | 3D Object ID (`userData.keyId`) | Action                     | Range                      | Notes                                                                  |
| -------------------- | ------------------------------- | -------------------------- | -------------------------- | ---------------------------------------------------------------------- |
| **Power Toggle**     | `switch_power`                  | Toggle power switch        | ON / OFF                   | Red rocker switch.                                                     |
| **Gas Ballast Knob** | `knob_ballast`                  | Rotate gas ballast valve   | 0° (Closed) to 270° (Open) | Knurled rotary knob. Adjusts ultimate vacuum from 80 mbar to 120 mbar. |
| **Speed Dial**       | `knob_speed`                    | Rotate speed potentiometer | 1500 to 3000 RPM           | Standard speed pot on upper deck to match application flow rate.       |

## 4. Displays & Indicators

### 4.1 Analog Bourdon Gauge (`gauge_vacuum`)

- **Physical dial:** Ø50 mm face on angled front panel.
- **Needle rotation:** 0° (at 1013 mbar / 0 mmHg) to −270° (at 0 mbar / 760 mmHg vacuum).
- **Behavior:** Needle smoothly tracks the simulated `system_vacuum_mbar` with subtle high-frequency vibration during
  running.

### 4.2 Status LED (`led_status`)

- **Color states:**
  - Powered OFF: `#000000` (Dark)
  - Idle / Running: `#00ff00` (Green emissive)
  - Fault: `#ff0000` (Red flashing emissive, 2 Hz)

### 4.3 Digital UI Panel (HTML side panel)

- **Pressure Readout:** Displays `system_vacuum_mbar` in mbar.
- **Flow Rate Readout:** Displays current flow in L/min, calculated based on current speed and pressure delta.
- **Speed Readout:** Displays motor RPM (0 or current speed).
- **Thermal Readout:** Displays simulated motor temperature (°C).
