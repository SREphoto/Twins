# OEM Technical Specification: Eurotherm 3216 Precision PID Controller

**Document ID:** SPEC-OEM-EUR-3216-001  
**Manufacturer:** Eurotherm by Schneider Electric, Faraday Close, Worthing, West Sussex, BN13 3PL, UK  
**Primary Reference:** *Eurotherm 3216 / 3208 / 3204 Engineering Handbook* (HA027986 / HA028600)  
**Form Factor:** 1/16 DIN Panel Mount ($48 \times 48\text{ mm}$)  

---

## 1. Physical & Mechanical Dimensions

| Parameter | Specification (Metric) | Specification (Imperial) | Tolerance / Notes |
| :--- | :--- | :--- | :--- |
| **Front Bezel Width** | **48.0 mm** | 1.890 in | Standard 1/16 DIN envelope |
| **Front Bezel Height** | **48.0 mm** | 1.890 in | Standard 1/16 DIN envelope |
| **Front Bezel Depth (Protrusion)** | **11.0 mm** | 0.433 in | From front panel surface |
| **Panel Cutout Width** | **45.0 mm** | 1.772 in | $-0.0\text{ mm}, +0.6\text{ mm}$ DIN 43700 |
| **Panel Cutout Height** | **45.0 mm** | 1.772 in | $-0.0\text{ mm}, +0.6\text{ mm}$ DIN 43700 |
| **Depth Behind Panel** | **90.0 mm** | 3.543 in | Clearance required for rear terminals |
| **Total Assembly Depth** | **101.0 mm** | 3.976 in | From front face to rear screw barrier terminals |
| **Maximum Panel Thickness** | **15.0 mm** | 0.591 in | Clamped by side ratchet retaining sleeve |
| **Front Ingress Protection** | **IP65 / NEMA 4X** | — | With captive silicone perimeter sealing gasket |
| **Weight** | **0.25 kg** | 0.55 lbs | Controller with terminal sleeve |

---

## 2. Microprocessor & Control Architecture

- **Processor Core:** 32-bit ARM Cortex-M4 RISC microcontroller operating at 72 MHz.
- **Floating Point Unit (FPU):** Hardware single-precision FPU executing advanced discrete PID algorithms.
- **Flash / RAM:** 256 KB on-chip high-reliability Flash memory, 64 KB SRAM, and 4 KB non-volatile EEPROM for recipe, calibration, and parameter retention (> 100,000 write cycles, 20-year data retention).
- **A/D Conversion:** 16-bit Sigma-Delta analog-to-digital converter with 9 Hz update rate (110 ms sample period) and $0.05\%$ span linearity.
- **PID Control Algorithm:** Patented Eurotherm PID algorithm with instantaneous overshoot suppression (*Cutback High / Cutback Low*), adaptive self-tuning, and manual loop override.
- **Setpoint Programming:** Internal 8-segment ramp/soak programmer with configurable ramp rates (°C/min or °C/h) and dwell soak timers.

---

## 3. Display Interface & Visual Annunciators

The front faceplate incorporates a custom multi-line dual display assembly with high-contrast anti-glare polarizer:

1. **Upper Display (Process Value - PV):**
   - 4-digit, 7-segment high-intensity LED display.
   - Character height: **10.0 mm** (0.39 in).
   - Color: Programmable Green or Red (configured to Green in normal operation, switching to flashing Red on over-temperature alarm trip).
   - Display range: $-999$ to $9999\text{ }^\circ\text{C}$ (configured for $0$ to $1200\text{ }^\circ\text{C}$ on LT 9/11).
2. **Lower Display (Setpoint Value - SV / Text Messaging):**
   - 5-character, 16-segment starburst alphanumeric LED display.
   - Character height: **8.0 mm** (0.31 in).
   - Color: High-contrast Emerald Green.
   - Purpose: Displays target setpoint during steady state; provides scrolling plain-language text messages (e.g. `RAMP 1`, `SOAK 2`, `DOOR OPEN`, `ALM HI`).
3. **Status Annunciator Beacons:**
   - `OP1`: Amber LED indicator illuminating when Output 1 (Heater SSR drive) is energized.
   - `OP2`: Green LED indicator for Output 2 (cooling or auxiliary relay).
   - `ALM`: Red warning triangle beacon, flashing during active process or deviation alarms.
   - `RUN`: Green arrow beacon, illuminated when ramp/soak program profile is running.
   - `HLD`: Yellow pause symbol beacon, indicating program timer is in hold status.
   - `MAN`: Hand beacon indicating manual power percentage mode ($0\text{--}100\%$).
   - `REM`: Remote communications active indicator (Modbus polling).

---

## 4. Front Ergonomics & Tactile Pushbuttons

Four silicone-rubber elastomeric pushbuttons with tactile metal snap-dome contacts ($1.0\text{ mm}$ travel stroke, rated for $> 1,000,000$ operations):

| Button Identifier | Silkscreen Symbol | Function / Operation |
| :--- | :--- | :--- |
| `Btn_Page` | `[ 📄 PAGE ]` | Press to cycle between operational lists: Level 1 (Operator), Level 2 (Supervisor), Program List, Alarm Summary. |
| `Btn_Scroll` | `[ 📜 SCROLL ]` | Press to step sequentially through parameters within the active list (e.g., $SV \to OP \to SP1 \to TM$). |
| `Btn_Down` | `[ ▼ DOWN ]` | Decrements setpoint or active parameter value; auto-repeats on hold. |
| `Btn_Up` | `[ ▲ UP ]` | Increments setpoint or active parameter value; auto-repeats on hold. |

---

## 5. Electrical Terminals & Input/Output Pinout

All electrical terminations are rear-mounted barrier screw terminals accepting up to $2.5\text{ mm}^2$ (14 AWG) wiring with captive clamping plates:

```
      ┌─────────────────────────────────┐
      │   EUROTHERM 3216 REAR TERMINALS │
      │                                 │
      │   [ 1A ]  Logic + (12V SSR)     │
      │   [ 1B ]  Logic - (SSR Common)  │
      │   [ 2A ]  Relay Out (Alarm COM) │
      │   [ 2B ]  Relay Out (Alarm NO)  │
      │                                 │
      │   [ V+ ]  T/C Input (+) (PtRh)  │
      │   [ V- ]  T/C Input (-) (Pt)    │
      │                                 │
      │   [ JA ]  RS-485 Modbus Rx/Tx-A │
      │   [ JB ]  RS-485 Modbus Rx/Tx-B │
      │   [ JC ]  RS-485 Common/Shield  │
      │                                 │
      │   [ L  ]  Mains Live (85-264V)  │
      │   [ N  ]  Mains Neutral         │
      └─────────────────────────────────┘
```

1. **Universal Sensor Input (V+, V-):**
   - Calibrated for NIST/IEC Type S thermocouple (Pt10%Rh/Pt).
   - Cold Junction Compensation (CJC): Internal precision thermistor located between terminals $V+$ and $V-$; compensation error $< \pm 0.5\text{ }^\circ\text{C}$ over $0\text{ to }50\text{ }^\circ\text{C}$ ambient.
   - Sensor break detection: Automatic upscale burnout detection drives SSR output to $0\%$ and trips latching alarm.
2. **Logic / SSR Output (1A, 1B):**
   - Output voltage: $12\text{ V DC} \pm 15\%$ into open circuit.
   - Drive capability: $30\text{ mA}$ maximum; directly controls Crydom D2440 opto-isolated solid-state relay.
   - Cycle time: Configured for time-proportioned burst firing ($1.0\text{ second}$ base cycle time).
3. **Mains Power Supply (L, N):**
   - Input voltage range: $85\text{ to }264\text{ V AC}$, $48\text{ to }62\text{ Hz}$.
   - Power consumption: $6\text{ W}$ maximum at $230\text{ V AC}$.
   - Internal fuse: $2\text{ A}$ slow-blow ceramic fuse (TR5 package).
