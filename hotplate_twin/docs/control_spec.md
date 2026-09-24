# Control Specification — Magnetic Hotplate Stirrer (`STIR-HEAT 500-D`)

Defines operating states, control transitions, thermal & stirring mathematical models, safety interlocks, and user interface mappings.

---

## 1. Operating States

| State | Condition | Display Text | Heater Output | Motor Output | Hot LED |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **OFF** | Power rocker switch OFF | Blank | 0% | 0 RPM | OFF (if $<50^\circ\text{C}$); ON/Blink if $>50^\circ\text{C}$ |
| **STANDBY** | Power ON; heat & stir disabled | `STBY`, current $T$ | 0% | 0 RPM | Active if $T_{\text{plate}} > 50^\circ\text{C}$ |
| **RUN_HEAT** | Heating active; stirring OFF | $T_{\text{set}}$, $T_{\text{act}}$, heat icon | PID duty % | 0 RPM | ON |
| **RUN_STIR** | Stirring active; heating OFF | $\text{RPM}_{\text{set}}$, $\text{RPM}_{\text{act}}$, stir icon | 0% | Motor ramp | Active if $T_{\text{plate}} > 50^\circ\text{C}$ |
| **RUN_BOTH** | Heating & stirring simultaneous | All values live | PID duty % | Motor ramp | ON |
| **ERR_OVERTEMP** | Plate $T > T_{\text{safe}}$ setpoint | `E01 OVERTEMP` | Tripped (0%) | Coasting | Flashing red |
| **ERR_PROBE** | External probe disconnected mid-run | `E02 PROBE` | Safety cutoff | Holds RPM | Active if $>50^\circ\text{C}$ |
| **ERR_STALL** | Magnetic stir decoupling / motor stall | `E03 STALL` | Holds Heat | Retrying ramp | Active if $>50^\circ\text{C}$ |

---

## 2. Mathematical Models & Physics Equations

### 2.1 Thermal Heating Dynamics

1. **Plate Energy Balance**:
   $$\frac{dT_{\text{plate}}}{dt} = \frac{P_{\text{elec}}(t) - h_{\text{plate}} A_p (T_{\text{plate}} - T_{\text{amb}}) - Q_{\text{contact}}}{C_{\text{plate}}}$$
   Where:
   - $P_{\text{elec}}(t) = D(t) \cdot P_{\max}$ ($P_{\max} = 600\text{ W}$, $D(t) \in [0, 1]$ PID duty cycle).
   - $C_{\text{plate}} \approx 450\text{ J/K}$ (thermal mass of $\varnothing 135\text{ mm}$ aluminum/ceramic plate).
   - $h_{\text{plate}} \approx 12\text{ W/(m}^2\cdot\text{K)}$ (free convection to air).
   - $Q_{\text{contact}} = \frac{T_{\text{plate}} - T_{\text{fluid}}}{R_{\text{beaker}}}$ when beaker is present.

2. **Liquid Heating ODE**:
   $$\frac{dT_{\text{fluid}}}{dt} = \frac{Q_{\text{contact}} - h_{\text{fluid}} A_f (T_{\text{fluid}} - T_{\text{amb}})}{m_{\text{fluid}} \cdot c_p}$$
   Where $c_p = 4184\text{ J/(kg}\cdot\text{K)}$ for water.

3. **PID Temperature Controller**:
   $$e(t) = T_{\text{set}} - T_{\text{sensor}}(t)$$
   $$D(t) = \text{clamp}\left(K_p e(t) + K_i \int e(\tau) d\tau + K_d \frac{de(t)}{dt}, 0, 1\right)$$
   With anti-windup clamping on the integral accumulator.

4. **Residual Heat Interlock ("HOT!" Warning)**:
   - Evaluated unconditionally: whenever $T_{\text{plate}} > 50.0^\circ\text{C}$, the red "HOT!" alert flashes at 1.5 Hz on the display and hardware indicator LED, warning the operator of burn hazards even if the unit is in Standby.

---

### 2.2 Magnetic Stirring & Vortex Dynamics

1. **Motor Speed Ramp**:
   $$\frac{d\omega}{dt} = \alpha_{\max} \cdot \text{sgn}(\omega_{\text{target}} - \omega)$$
   Where maximum smooth acceleration $\alpha_{\max} = 150\text{ RPM/s}$.

2. **Magnetic Coupling & Decoupling Criterion**:
   Magnetic torque between internal NdFeB magnets and stir bar:
   $$\tau_{\text{mag}} = \tau_{\max} \sin(2\Delta\theta)$$
   Viscous drag torque in fluid:
   $$\tau_{\text{drag}} = k_{\text{visc}} \cdot \mu \cdot \omega$$
   If $\tau_{\text{drag}} + I_{\text{bar}} \frac{d\omega}{dt} > \tau_{\max}$, the stir bar breaks magnetic lock (**spin-out**), slips into erratic tumbling against the beaker wall, and the unit signals decoupling until speed is reduced below 200 RPM.

3. **Paraboloid Fluid Vortex Height**:
   $$z(r) = z_0 + \frac{\omega^2 r^2}{2 g}$$
   The central depression depth:
   $$h_{\text{vortex}} = \min\left(\frac{\omega^2 R_{\text{beaker}}^2}{4 g}, 0.85 \cdot H_{\text{liquid}}\right)$$

---

## 3. Physical Controls & Interactions

| Control | Action | Function |
| :--- | :--- | :--- |
| `Knob_Speed` (Rotate) | CW / CCW | Adjust stir setpoint in 50 RPM increments (0 to 1500 RPM) |
| `Knob_Speed` (Click) | Press | Start / Stop magnetic stirring motor |
| `Knob_Temp` (Rotate) | CW / CCW | Adjust temperature setpoint in 1 °C increments ($20\text{--}310^\circ\text{C}$) |
| `Knob_Temp` (Click) | Press | Start / Stop heating element |
| `Btn_Power` | Toggle | Hard master power toggle (Standby $\leftrightarrow$ ON) |
| `Btn_SafeTemp` | Rotate screw | Adjust safety cutoff limit ($50\text{--}360^\circ\text{C}$) |
| Beaker Click | Raycast | Place or remove beaker on heating plate |
| Probe Click | Raycast | Lower / raise immersion probe into beaker |
