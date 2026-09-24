# Control specification v1

Original behavioural twin for **MICRO 5424-R** (keypad, refrigerated).  
Not OEM firmware. Matches published operator behaviour patterns.

## Display modes

| Mode | Primary large field   | Secondary         |
| ---- | --------------------- | ----------------- |
| RPM  | Target / actual RPM   | Computed RCF      |
| RCF  | Target / actual ×g    | Computed RPM      |
| TIME | Set minutes : seconds | Elapsed           |
| TEMP | Setpoint °C           | Chamber actual °C |

Toggle RPM ↔ RCF with key **RPM/RCF**.

## Physics

```python
R_cm = 8.4
RCF = 1.118e-5 * R_cm * RPM**2
RPM = sqrt(RCF / (1.118e-5 * R_cm))
```

Clamp:

- RPM: 100 … 15000, step 50
- Time: 0 (continuous) or 1 s … 9:59:00
- Temp setpoint: −10 … 40 °C, step 1
- Accel ramp default: 20 s 0→setpoint
- Brake ramp default: 15 s setpoint→0

## Key map (keypad) — from 5424 R operating manual Fig. 5-1

| Key ID | Label (manual) | Action                                          |
| ------ | -------------- | ----------------------------------------------- |
| E04    | start/stop     | Start run if READY; stop → DECEL while spinning |
| E05    | open           | Release lid if RPM==0                           |
| E06    | short          | Short-run centrifugation while held             |
| E07    | rpm/rcf        | Toggle RPM ↔ RCF display                        |
| E08    | speed ▲/▼      | Set centrifugation speed (hold = quick)         |
| E09    | time ▲/▼       | Set centrifugation time (hold = quick)          |
| E10    | temp ▲/▼       | Set temperature −10…+40 °C (hold = quick)       |
| E11    | fast temp      | Temperature control run without samples (FT)    |
| E12    | menu/enter     | Open menu; confirm selection                    |
| E13    | menu ▲/▼       | Navigate menu                                   |

### Menu items (manual §5.3) — twin should expose later

| Item        | Function                                        |
| ----------- | ----------------------------------------------- |
| SOFT        | Soft accel/brake ramp ON/OFF                    |
| LOCK        | Key lock ON/OFF                                 |
| ATSET       | Time counting starts at 95% of set speed ON/OFF |
| SHORT       | Short spin at MAX rotor speed or SET speed      |
| TEMP        | Continuous cooling time limit (8 h / endless)   |
| ALARM / VOL | Speaker on/off and volume                       |
| SLEEP       | Standby after 15 min idle                       |

### Display fields (manual Fig. 5-2)

1. Centrifugation time
2. Key lock status
3. ATSET indicator
4. Temperature
5. Soft ramp indicator
6. Actual rpm/rcf value
7. Centrifuge status (lid unlocked / locked / running)
8. rpm vs rcf mode
9. Speaker status

## State machine

```text
                    OPEN key
    ┌──────────► LID_OPEN ◄──────────┐
    │               │ close lid       │
    │               ▼                 │
    │             READY               │
    │          START/SHORT            │
    │               ▼                 │
    │             ACCEL ──────────────┤ fault
    │               ▼                 │
    │              RUN                │
    │          time end / STOP        │
    │               ▼                 │
    │             DECEL               │
    │               ▼                 │
    │              END ──auto open──► LID_OPEN
    │               │
    │               └──► READY (if auto-open disabled)
    │
    └── faults: ERR_*  (from any spinning state → DECEL then fault hold)
```

### States

| State           | Rotor       | Lid             | Display status |
| --------------- | ----------- | --------------- | -------------- |
| `LID_OPEN`      | 0           | unlocked/open   | OPEN           |
| `READY`         | 0           | closed locked   | READY          |
| `ACCEL`         | increasing  | locked          | ACCEL          |
| `RUN`           | at setpoint | locked          | RUN            |
| `DECEL`         | decreasing  | locked          | BRAKE          |
| `END`           | 0           | may auto-unlock | END            |
| `ERR_LID`       | 0           | —               | E-01           |
| `ERR_IMBALANCE` | braking     | locked          | E-02           |
| `ERR_TACHO`     | braking     | locked          | E-03           |
| `ERR_OVERSPEED` | braking     | locked          | E-04           |
| `ERR_MOTOR`     | braking     | locked          | E-05           |

### Transition rules

1. **START** only from `READY` (lid closed, no fault).
2. **OPEN** only when `rpm_actual == 0` and not in ACCEL/RUN/DECEL.
3. Closing lid (sensor) moves `LID_OPEN` → `READY`.
4. **STOP** from ACCEL/RUN → `DECEL`.
5. **SHORT**: while held, behave as RUN at setpoint; release → DECEL.
6. **Imbalance inject**: from ACCEL/RUN → DECEL then `ERR_IMBALANCE`.
7. Run complete (timer): DECEL → END → optional auto lid open → `LID_OPEN`.
8. Clear error: STOP long-press or OPEN when stopped → `READY`/`LID_OPEN`.

## LCD layout (1024×512 canvas → mapped to E03)

```text
┌────────────────────────────────────────────────────────┐
│  MICRO 5424-R  |  ROTOR FA-45-24-11  |  REFRIGERATED   │
├────────────────────────────┬───────────────────────────┤
│  SPEED / RCF               │  TIME                     │
│  14,800 RPM                │  15:00                    │
│  21,130 × g                │  ELAPSED 04:32            │
├────────────────────────────┴───────────────────────────┤
│  TEMP  +4.0 °C   ACT +4.2 °C   STATUS: RUN             │
│  ████████████░░░░  ramp / progress                     │
└────────────────────────────────────────────────────────┘
```

Colors (dark lab LCD):

- Background `#050c16`
- Primary cyan `#00f3ff`
- Accent green `#00ff88`
- Time amber `#ffb700`
- Fault red `#ff3355`

## Telemetry out (to 3D viewer)

JSON snapshot each tick (~20 Hz UI / 60 Hz render):

```json
{
  "state": "RUN",
  "rpm_set": 14800,
  "rpm_actual": 14750,
  "rcf_actual": 20500,
  "time_set_s": 900,
  "time_elapsed_s": 272,
  "temp_set_c": 4.0,
  "temp_actual_c": 4.2,
  "lid_open": false,
  "lid_locked": true,
  "display_mode": "RPM",
  "error": null,
  "led_run": true,
  "led_fault": false
}
```

### 3D bindings

| Field                   | Visual                                                      |
| ----------------------- | ----------------------------------------------------------- |
| `rpm_actual`            | Rotor ω (rad/s) = rpm × 2π/60 (visual scale factor allowed) |
| `lid_open`              | Lid hinge angle 0° ↔ 75°                                    |
| `led_run` / `led_fault` | Emissive strength                                           |
| full snapshot           | LCD canvas texture on E03                                   |

## Test cases (controller)

1. Cannot START with lid open → `ERR_LID` or ignore with message.
2. START → ACCEL → RUN → timer → DECEL → END.
3. STOP mid-run → DECEL → READY.
4. OPEN while RUN rejected.
5. Imbalance mid-run → DECEL → `ERR_IMBALANCE`.
6. RPM/RCF toggle preserves equivalent setpoint.
7. TEMP setpoint changes only when not forbidden (allowed in READY).
8. SHORT press/release.
