# Control Specification — Digital Precision Vortex Mixer

## 1. Operating States
| State | Motor Drive | Display Output | Mode Condition |
| :--- | :--- | :--- | :--- |
| **`POWER_OFF`** | Off | Blank LCD, LED off | Rear rocker power off |
| **`IDLE`** | Off | Set RPM, Timer/Pulse icons | Power on, standby |
| **`RUNNING_TOUCH`** | Ramped to set RPM | Live tachometer, running icon | Touch mode + downward pressure |
| **`RUNNING_CONTINUOUS`** | Ramped to set RPM | Live tachometer, elapsed/down timer | Continuous mode active |
| **`RUNNING_PULSE`** | Alternating on/off | Pulsing icon, live tachometer | Pulse mode active |
| **`TIME_EXPIRED`** | Off | "DONE" flashing, buzzer chime | Timer countdown reached 0 |
| **`OVERLOAD`** | Cutout | "ERR-1" flashing | Thermal duty cycle exceeded |

## 2. Controls & User Interface
- **Mode Toggle Switch**: 3-position toggle:
  - `TOUCH` (left): Operates only when downward tube pressure is detected on cup head.
  - `OFF` (center): Motor isolated, electronics remain in low-power standby.
  - `CONT` (right): Hands-free continuous operation until switched off or timer elapses.
- **Speed Knob (Optical Encoder)**: Variable digital setpoint from $500\text{--}3200\text{ RPM}$ in $50\text{ RPM}$ steps.
- **Timer Button (`Btn_Timer`)**: Toggles between continuous mode (`--:--`) and countdown timer ($1\text{ s}$ to $5999\text{ s}$).
- **Pulse Button (`Btn_Pulse`)**: Toggles programmable intermittent agitation cycle ($2.0\text{ s}$ on / $1.0\text{ s}$ off).
- **Power Button (`Btn_Power`)**: Toggles electronic standby.

## 3. Physical Models
- **Inertia Ramping**: Motor accelerates with characteristic time constant $\tau = 0.12\text{ s}$.
- **Rotational Forced Vortex**: Meniscus depression follows $z(r) = \frac{\omega^2 r^2}{2g \cdot \mu_{\text{rel}}}$.
