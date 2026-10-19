# Control Specification & Dual-Truth Logic Architecture

## 1. State Machine Hierarchy

The Karl Fischer Titrator follows a strict safety state machine:

```
[UNPLUGGED]  <==== (Plug into Receptacle) ====>  [POWER_OFF]
                                                      ||
                                              (Rear Rocker ON)
                                                      \/
                                                  [STANDBY]
                                                      ||
                                             (Condition Cell)
                                                      \/
                                                 [PRE_TITR]
                                                      ||
                                            (Drift < Equilibrium)
                                                      \/
                                                   [READY]
                                                      ||
                                              (Inject Sample + Start)
                                                      \/
                                                 [TITRATING]
                                                      ||
                                             (Endpoint Reached)
                                                      \/
                                                  [COMPLETE]
```

### Safety Interlocks
- **Electrical Continuity Interlock**: If `isPluggedIn === false` or `switchOn === false`, all outputs are strictly zero: motor speed = $0$, LCD = unpowered black, LED = off, heater/polarizer = 0, audio = muted.
- **Vessel Lid / Hermetic Seal Interlock**: If moisture drift $> 100\ \mu\text{g } H_2O/\text{min}$, system flags `LEAK_DETECTED` and warns user of unsealed cell or exhausted molecular sieves.
- **Overfill Protection**: Titration stops if reagent volume dosed exceeds syringe cylinder limit without refilling cycle.

---

## 2. Dynamic Kinetics & Titration Mathematics

### 2.1 Moisture Differential Equation
In the titration cell with volume $V_{\text{cell}}$ containing water mass $m_{w}(t)$:

$$\frac{d m_w}{dt} = \text{Drift}_{\text{ambient}} - r_{\text{reaction}}(t)$$

Where the titration reaction rate is:

$$r_{\text{reaction}}(t) = k \cdot [H_2O] \cdot [I_2] \approx \min\left( \frac{m_w(t)}{\tau},\, \dot{V}_{\text{titrant}}(t) \cdot T \right)$$

### 2.2 Polarized Electrode Depolarization Curve
Under constant current $I_{\text{pol}} = 20\ \mu\text{A}$:

$$U(t) = U_{\text{min}} + (U_{\text{max}} - U_{\text{min}}) \cdot \frac{m_w(t)}{m_w(t) + K_m}$$

Where:
- $U_{\text{max}} \approx 620\text{ mV}$ (dry cell with high polarization resistance).
- $U_{\text{min}} \approx 25\text{ mV}$ (excess iodine, fully depolarized reversible redox couple).
- $K_m \approx 5.0\ \mu\text{g } H_2O$ (sensitivity constant).

### 2.3 Endpoint Criteria
The endpoint is triggered when:
1. Potential $U(t) \le U_{\text{EP}} = 100\text{ mV}$.
2. Derivative $|dU/dt| \le 0.5\text{ mV/s}$.
3. Holding duration $t \ge t_{\text{stop}} = 15.0\text{ s}$.

Total water calculation:

$$m_{H_2O} (\text{mg}) = V_{\text{consumed}} \cdot T - \left( \text{Drift} \cdot \frac{t_{\text{duration}}}{60} \right)$$
