# Troubleshooting log

Newest first. Template: `templates/troubleshooting_entry.md`.

---

## 2026-09-30 · OGA-CAD & SRE-TWIN · spectrophotometer-motherboard-connectors-and-continuity [DIAG-029] [DIAG-005] [DIAG-014] [DIAG-015]

| Field    | Value                                                              |
| -------- | ------------------------------------------------------------------ |
| Status   | resolved                                                           |
| Machine  | spectrophotometer_twin                                             |
| Severity | high                                                               |

**Problem:** 
1. The motherboard lacked realism, with no recognizable processor, memory chips, modular stepper drivers, or high-density PCB traces.
2. Internal cables ended in empty space with no physical mating connectors or sockets.
3. Rear panel silkscreen labels were inverted when setting `CanvasTexture.flipY = false`.
4. Room walls ($8\text{m} \times 8\text{m}$) occluded the camera when orbiting behind the spectrophotometer.
5. The rotating optical sector chopper wheel was floating without a physical mounting pedestal.
6. Electrical wiring lacked physical continuity to a benchtop utility power outlet.

**Symptoms:** 
- Inverted text on rear panel ports (`CAM_REAR`).
- Wires floating in mid-air inside the chassis.
- Camera clipping into the back wall when orbiting to inspect rear connectors.
- Unrealistic floating chopper wheel and non-physical electronics.

**Cause:** 
- Standard Three.js `PlaneGeometry` has UV $V = 1$ at the top; disabling `flipY` without inverting UV Y coordinates maps canvas $Y = 0$ to $V = 0$, inverting the texture vertically (DIAG-005).
- Absence of procedural mating connector geometry (JST, IDC, SMA, ZIF, Faston) and mating socket definitions.
- Room enclosure bounds were set too close to the bench datum.

**Fix:** 
1. **Procedural High-Density DSP Motherboard (`Assembly_Motherboard_DSP`):**
   - High-DPI 1024x1024 canvas texture with dark green solder mask, serpentine copper traces, analog ground guard ring, plated vias, test pads, and silkscreen legend.
   - 32-bit floating-point DSP microprocessor with 7-fin extruded black anodized aluminum heatsink.
   - 8 GB eMMC flash storage IC (non-volatile firmware and calibration tables) and 512 MB SDRAM buffer (volatile kinetic scan buffer).
   - 24-bit low-noise Delta-Sigma ADC and gold-plated threaded SMA coaxial jack (`Socket_SMA_AnalogIn`).
   - 4 modular stepper driver daughterboards (Grating, Carousel Turret, Sector Selector, Order Filter) with mini heatsinks and trimpots.
   - CR2032 Lithium coin-cell battery in nickel-plated socket, 25.000 MHz quartz crystal, and 32.768 kHz cylindrical RTC crystal.
   - 6 radial aluminum electrolytic filter capacitors with cross-scored pressure relief tops.
2. **Procedural Mating Connectors & Physical Termination:**
   - Modeled keyed nylon shrouded headers and mating plugs: 4-pin JST-VH (DC power), 3-pin JST-XH (cooling fan), 3x 4-pin JST-XH (stepper motors), 10-pin shrouded IDC box header (RS-232 UART), 5-pin JST (USB internal), 2-pin header (BNC external trigger).
   - 40-pin flip-lock FPC ZIF connectors mating with an amber Kapton polyimide flex ribbon connecting to the front console LCD sub-board (`PCB_LCD_Controller`).
   - 6-position phenolic barrier terminal block on SMPS with brass binding screws, square clamping washers, clear acrylic hinged safety cover, and blue insulated Faston spade crimp terminals.
3. **Rear Silkscreen Orientation Inversion (DIAG-005, DIAG-015):**
   - Inverted buffer geometry UV coordinates (`uvAttr.setY(i, 1.0 - uvAttr.getY(i))`) when `flipY = false`, guaranteeing 100% upright, crisp, unmirrored typography across all 5 rear panel silkscreen markings.
4. **Spacious Laboratory Room Enclosure:**
   - Expanded room shell to $32\text{m} \times 32\text{m} \times 10\text{m}$ with perimeter baseboards, ceiling LED troffer lights, and yellow safety hazard border, providing $>12\text{m}$ of clear rear aisle viewing space.
5. **Rigid CNC Aluminum Chopper Pedestal:**
   - Machined 6061-T6 aluminum mounting stand with dual triangular stiffening gussets, clamped to the optical baseplate by two DIN 912 M3 socket head cap screws with washers (`Fastener_ChopperBase_01`, `02`).
6. **Benchtop Duplex Power Pedestal & EMT Feed (DIAG-014):**
   - Cast aluminum dual-gang NEMA 5-20R service pedestal bolted to the benchtop with 4 stainless M5 anchor bolts.
   - 1-inch trade size galvanized EMT conduit with compression locknuts and subfloor $90^\circ$ sweep elbow housing three continuous #12 AWG THHN copper conductors.
   - Molded NEMA 5-15P plug inserted into receptacle with hard continuity cutoff when unplugged.

**Prevention:** Mandate DIAG-029: All internal electronic circuit boards must feature genuine procedural component geometry (processing ICs, flash, RAM, ADC, modular drivers, passive filtering) and every harness conductor must terminate into a physically modeled mating plug and socket connector.

---

## 2026-09-26 · OGA-CAD · active-flap-slew-and-fis-crash-attenuation [DIAG-023]

| Field    | Value                                                              |
| -------- | ------------------------------------------------------------------ |
| Status   | resolved                                                           |
| Machine  | f1_2026_front_wing_twin                                            |
| Severity | medium                                                             |

**Problem:** Front active aerodynamic flaps and Two-Stage Front Impact Structure (FIS) require strict geometric hinge alignment and continuous crash load path verification without mesh penetration during X-mode depitch.

**Symptoms:** Flaps rotating around incorrect center coordinates would clip the mainplane trailing edge or separate into free space.

**Cause:** Fixed-point group rotations without defining local hinge pivot vectors `(x_hinge, y_hinge, z_hinge)` can induce non-physical orbit rather than authentic aerodynamic flap pitch.

**Fix:**
1. Positioned `Pivot_Wing_ActiveFlap_LH_Element3` and `Pivot_Wing_ActiveFlap_RH_Element3` with origin placed strictly at the titanium hinge pin axis `[-7.2, 1.8, ±1.6]`.
2. Applied local Z-axis pitch rotation `rotation.z = angleDeltaRad` bounded to $0.0\text{ rad}$ ($24.0^\circ$ Z-Mode) to $-0.314\text{ rad}$ ($6.0^\circ$ X-Mode).
3. Modeled genuine 3D titanium hinge dowels, slot gap separators, and Moog EHA actuator pushrods tracking the articulation.
4. Mated the Stage 2 FIS structure to Bulkhead A-A using 4x M14 titanium mounting studs with $>350\text{ kN}$ tensile strength.

**Prevention:** Mandate DIAG-023: All active aerodynamic surfaces must have local group coordinate origins coincidence with mechanical hinge pins, and dynamic angular limits must prevent airfoil mesh intersection.

---

## 2026-09-25 · SHAA-3D · fix-vortex-fluid-and-establish-vortex-guild [ISS-003] [DIAG-006]

| Field    | Value                                                              |
| -------- | ------------------------------------------------------------------ |
| Status   | resolved                                                           |
| Machine  | vortex_mixer_twin                                                  |
| Severity | high                                                               |

**Problem:** User reported "there is no vortex showing" and asked "are you using the agents we created ??".

**Symptoms:** The test tube appeared opaque/dark/frosted, blocking visibility of the interior liquid. When the viewer loaded, the motor was idle in TOUCH mode (0 RPM) so no agitation occurred. When agitated, the liquid cylinder was stationary and flat with no hollow air cone or wall climb.

**Cause:**
1. `MAT_GLASS_TUBE` used Three.js `MeshPhysicalMaterial` with `transmission: 0.93` and no PMREM environment map, causing the WebGL transmission pass to fail and occlude child/enclosed fluid geometry.
2. The fluid was a standard `CylinderGeometry(8.0, 7.8, 48, 24, 12)` where wall vertices ($r = 8.0$) had $(1 - rRatio^2) = 0$, resulting in zero wall climb. The top cap lacked concentric rings, preventing the formation of a hollow air paraboloid.
3. Default application state was `mode = 'TOUCH'` with `currentRpm = 0.0`, leaving the mixer at rest on load.
4. Camera target was set to `(0, 75, 0)`, leaving the sample tube at the top edge of the viewport.

**Fix:**
1. Replaced `MAT_GLASS_TUBE` with high-clarity borosilicate `MeshStandardMaterial` (`color: 0xebf8ff, roughness: 0.05, metalness: 0.02, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide`). Set `tubeMesh.renderOrder = 2` and `fluidMesh.renderOrder = 1` (`depthWrite: true`).
2. Implemented a custom parametric `BufferGeometry` for the liquid meniscus:
   - Outer wall vertices climb upward from rest ($y = 44\text{ mm}$) to $y = 76\text{ mm}$ at 3200 RPM.
   - Inner hollow air funnel descends downward from $y = 44\text{ mm}$ to a deep vortex eye at $y = 10\text{ mm}$, forming a true physical paraboloid $y(\rho) = y_{\text{eye}} + \rho^2(y_{\text{wall}} - y_{\text{eye}})$.
   - Added 3-lobe helical swirling wave ripples $\sin(3\theta - \omega t) \cdot \rho^2 \cdot A$.
   - Added central aeration core spindle (`Body_Fluid_VortexCore`) with dynamic spin and foaming opacity.
   - Applied dynamic parametric fluid geometry to both 15 mL Falcon and 1.5 mL Microcentrifuge tubes.
3. Updated default initial state in `app.js` to `mode = 'CONTINUOUS'` at `2400 RPM` so the spinning vortex is immediately visible upon initial load.
4. Adjusted camera controls target to `(0, 105, 0)` so the tube and vortex are centered vertically.
5. Formally established the **Vortex Mixer Guild** (`.master/02_AGENT_WORKFORCE/vortex_guild/`) with `VORTEX_BUILD_ARCHITECT.md`, `SUBAGENTS_ROSTER.md` (14 subagents), and `scripts/maintenance/run_vortex_subagents.mjs`.

**Prevention:** Mandate DIAG-006: All enclosed fluidics within glass tubes must use standard transparent materials with explicit `renderOrder` layering, and fluid vortices must model the true physical paraboloid of revolution with hollow air cone depression.

---

## 2026-09-25 · OGA-CAD · install-cmds-governance-architecture

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | none                    |
| Machine  | workspace / all twins   |
| Severity | none                    |

**Problem:** N/A (Standard architecture installation closeout).

**Symptoms:** N/A

**Cause:** N/A

**Fix:** N/A

**Prevention:** N/A

---

## 2026-07-29 · NBA · rebuild-vacuum-pump-cad

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | none                |
| Machine  | vacuum_pump_twin |
| Severity | none                     |

**Problem:** N/A (Standard session closeout)

**Symptoms:** N/A

**Cause:** N/A

**Fix:** N/A

**Prevention:** N/A



## 2026-07-27 · OGA · fix-ultrasonic-details

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | resolved                |
| Machine  | ultrasonic_cleaner_twin |
| Severity | low                     |

**Problem:** Button labels faced backwards (invisible from outside). Buttons didn't glow while depressed. Basket hung
off the lab bench.

**Symptoms:** Labels couldn't be read in normal view. Poor interaction feedback. Broken geometry collision.

**Cause:** The +Z face of a `BoxGeometry` faces away from the user in this scene layout, but it was assigned the
texture. Emissive glowing was only tied to logical state, not physical mouse events. The lab bench was too narrow for
both the machine and basket.

**Fix:** Rotated button meshes 180 degrees. Added `state.pressed` dictionary tracking `mousedown`/`mouseup` and fed it
into `emissiveIntensity` logic. Elongated `INSTRUMENT_BENCH.sx` to 9.6.

**Prevention:** Remember that ThreeJS `BoxGeometry` places index 4 on the +Z face and index 5 on the -Z face.

---

## 2026-07-27 · OGA · fix-ultrasonic-issues

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | resolved                |
| Machine  | ultrasonic_cleaner_twin |
| Severity | med                     |

**Problem:** Basket sank through floor when lowered, basket floated in air unloaded, nameplate was off-edge. UI was
dysfunctional.

**Symptoms:** Visual artifacts and incorrect machine behavior.

**Cause:** Hardcoded position values for the basket (`(0,0,0)` was too low, `1.5` was floating), layout lacked proper
CSS.

**Fix:** Redesigned `index.html` UI with flexbox, mathematically computed `basketBaseY` offsets based on machine
dimensions to set basket positions. Repositioned nameplate.

**Prevention:** Cross-reference 3D model geometry bounds (like `DECK_Y` and `BASIN_FLOOR_Y`) when positioning moving
parts.

---

## 2026-07-26 · OGA · fix-unload-error

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | resolved                |
| Machine  | ultrasonic_cleaner_twin |
| Severity | high                    |

**Problem:** `app.js:912 Uncaught TypeError: Cannot set properties of null (setting 'onclick')` and 404 error on
`favicon.ico`.

**Symptoms:** Twin UI crashes during script execution due to an obsolete DOM element.

**Cause:** The `btn-unload-sample` button was removed from `index.html` during the basket workflow update, but its
`onclick` listener was still being attached in `app.js`.

**Fix:** Removed the obsolete `btn-unload-sample` listener in `app.js`. (The 404 for `favicon.ico` is a benign warning
from the local server and can be ignored).

**Prevention:** Ensure all script event listeners are updated or use optional chaining when removing elements from the
DOM.

---

## 2026-07-25 · OGA · docs-lab-viewer

| Field    | Value                |
| -------- | -------------------- |
| Status   | resolved             |
| Machine  | lab_viewer / scripts |
| Severity | med                  |

**Problem:** User ran serve instructions; `cd Twins` failed (already in Twins root); port 8765 in use; comment line
pasted as command.

**Symptoms:** `cd: no such file or directory: Twins`; `OSError: [Errno 48] Address already in use`;
`zsh: command not found: #`.

**Cause:** Docs said `cd Twins` as if nested; prior Python http.server still listening; user pasted markdown comments.

**Fix:** Killed PIDs on 8765/8766; `scripts/serve.sh` now auto-selects next free port; README/SOP/build docs say
workspace root is already Twins and print the real URL.

**Prevention:** Never document `cd Twins` without “only if not already there”; serve script must not assume port free.

---

## 2026-07-25 · NBA · lab-viewer

| Field    | Value      |
| -------- | ---------- |
| Status   | resolved   |
| Machine  | lab_viewer |
| Severity | low        |

**Problem:** Transition `playSwitch` promise/async flow was fragile (nested setDockMachine in rAF).

**Fix:** Rewrite with sequential `animateMs` helpers.

**Prevention:** Keep switch animation linear async/await.

---

## 2026-07-25 · OGA · agent-sop

| Field    | Value     |
| -------- | --------- |
| Status   | none      |
| Machine  | workspace |
| Severity | —         |

---

## 2026-07-25 · OGA · create-master

| Field    | Value     |
| -------- | --------- |
| Status   | none      |
| Machine  | workspace |
| Severity | —         |

No blockers while creating `.master` structure.

---

## 2026-09-25 · NBA · muffle_furnace_twin [ISS-041]

| Field    | Value               |
| -------- | ------------------- |
| Status   | resolved            |
| Machine  | muffle_furnace_twin |
| Severity | medium              |

**Problem:** 
1. Ramp-down cooling trajectory prematurely jumped to `SOAKING` state on tick 1 because `current_pv >= setpoint_sv - 1.5` evaluated to True when setpoint was below current temperature.
2. Thermocouple break (`thermocouple_ok = False`) during heating/soaking did not cut heating power in `tick()`, and `reset_fault()` allowed clearing faults while the thermocouple remained broken.

**Fix:** 
1. Track ramp direction (`is_heating_ramp`) and branch soak transition condition; gate feedforward power to heating ramps only.
2. Add thermocouple break interlock in `tick()` to immediately trip `FAULT_THERMOCOUPLE` and shut off heating coils; require `thermocouple_ok == True` in `reset_fault()`. Added regression tests (12/12 pass).

---

## 2026-09-25 · NBA · glove_box_twin [ISS-042]

| Field    | Value           |
| -------- | --------------- |
| Status   | resolved        |
| Machine  | glove_box_twin  |
| Severity | medium          |

**Problem:** 
1. Opening outer door did not invalidate previous purge cycle count, allowing subsequent inner door opening without re-cycling.
2. Antechamber doors could be opened while under deep vacuum (< 950 mbar).
3. `acknowledge_alarms()` checked only O2 and H2O levels, allowing catastrophic overpressure/underpressure alarms to be dismissed while pressure was still in the fault range.

**Fix:** 
1. Reset `antechamber_cycles_completed = 0` on outer door opening.
2. Add vacuum interlock (< 950 mbar) blocking door opening.
3. Require `-4.0 <= pressure_mbar <= 7.0` in `acknowledge_alarms()`. Added regression tests (14/14 pass).

---

## 2026-09-25 · NBA · high_pressure_reactor_twin [ISS-043]

| Field    | Value                      |
| -------- | -------------------------- |
| Status   | resolved                   |
| Machine  | high_pressure_reactor_twin |
| Severity | high                       |

**Problem:** 
1. Ruptured burst disc allowed subsequent gas pressurization.
2. Enabling heater caused derivative kick due to uninitialized `prev_err`.
3. Pressures exceeding maximum allowable working pressure (MAWP = 200 bar) did not transition `state` to `FAULT_OVERPRESSURE`, leaving the motor spinning at extreme pressure.
4. `acknowledge_alarms()` called `_update_state()` which immediately returned if in fault state, permanently latching faults.

**Fix:** 
1. Gas inlet gated by `not burst_disc_ruptured`; pressure locked at 1.0 bar atmospheric when ruptured.
2. Initialize `prev_err = target_temp_c - current_temp_c` on heater toggle.
3. Pre-check and post-check pressure against `max_pressure_bar` to trip `FAULT_OVERPRESSURE` and disengage heaters.
4. Reset `self.state = ReactorState.IDLE` in `acknowledge_alarms()` before calling `_update_state()`. Added regression tests (14/14 pass).

---

## 2026-09-25 · NBA · ultrasonic_cleaner_twin [ISS-044]

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | resolved                |
| Machine  | ultrasonic_cleaner_twin |
| Severity | medium                  |

**Problem:** 
1. 26 3D mesh nodes violated Semantic Part Taxonomy (`Power_Cord`, `IEC_Plug`, `Contaminant_*`, `EMI_Filter`, `Driver_PCB`, `Heatsink`, `Transformer`, `W01-W12`, etc.).
2. LCD canvas texture missing `flipY = false`.
3. Draining liquid level while preheating in `IDLE` state did not immediately trip `FAULT_DRY_RUN`.
4. Over-temperature safety check was nested inside `if heater_on`, ignoring heating from intense ultrasonic cavitation.

**Fix:** 
1. Renamed all 3D mesh nodes to conform to `Body_`, `Fastener_`, `Btn_`, `Knob_`, `Pivot_`, `UI_LCD`, `Badge_SREdesigns`.
2. Enforced `flipY = false` across all canvas textures.
3. Tripped `FAULT_DRY_RUN` immediately on liquid level drop if `heater_on`.
4. Moved over-temperature check outside `if heater_on` to protect against cavitation heating. Added regression tests (14/14 pass).

---

## 2026-09-25 · NBA · vacuum_pump_twin [ISS-045]

| Field    | Value            |
| -------- | ---------------- |
| Status   | resolved         |
| Machine  | vacuum_pump_twin |
| Severity | low              |

**Problem:** 
1. Non-compliant node names `switch_power` and `knob_ballast`.
2. Powering on with `set_power(True)` while motor was overheated (>= 130°C) transitioned to `IDLE` instead of `FAULT_OVERHEAT`.

**Fix:** 
1. Renamed to `Btn_Power` and `Knob_GasBallast`.
2. Gated `set_power(True)` to check `motor_temp_c >= overheat_temp_c` and route to `FAULT_OVERHEAT`. Added regression test (13/13 pass).

---

## 2026-09-25 · NBA · centrifuge_twin [ISS-046]

| Field    | Value           |
| -------- | --------------- |
| Status   | resolved        |
| Machine  | centrifuge_twin |
| Severity | medium          |

**Problem:** `test_controller.py` and `test_samples.py` used standalone functions without `unittest.TestCase` classes, causing `python3 -m unittest discover` to find 0 tests.

**Fix:** Wrapped test suites in `TestCentrifugeController` and `TestCentrifugeSamples` subclasses of `unittest.TestCase`. All 14 tests now discovered and passing automatically.

---

## 2026-09-25 · NBA · ultrasonic_cleaner_twin [ISS-047]

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | resolved                |
| Machine  | ultrasonic_cleaner_twin |
| Severity | low                     |

**Problem:** `getPartGroup` in `ultrasonic3d.js` evaluated regex for `Body_` first, which caused all newly compliant part names (e.g. `Body_BasinFloor`, `Body_ControllerPCB`, `Body_LidPlate`) to be categorized as "Chassis" instead of their specific subsystems.

**Fix:** Reordered regex evaluations so specific domains (Controls, Tank, Basket, Lid, Fluid, Electronics) evaluate prior to the generic `Body_` chassis fallback.

---

## 2026-09-26 · OGA-CAD · f1_2026_powertrain_twin [DIAG-026]

| Field    | Value                     |
| -------- | ------------------------- |
| Status   | resolved                  |
| Machine  | `f1_2026_powertrain_twin` |
| Severity | medium                    |

**Problem:** 
1. 2026 Formula 1 regulations (Articles C5 and C6) require strict 50/50 hybrid parity: 405 kW (543 hp) 1.6L V6 turbocharged ICE and 350 kW (469 hp) MGU-K with a 3,000 MJ/h maximum energy flow rate and elimination of the MGU-H.
2. High-voltage 800V-900V DC bus required redundant crash pyrofuse isolation disconnecting in under 10 ms to prevent electrical hazards.

**Fix:** 
1. Implemented dual-truth energy flow calculation ($EF \le 3000\text{ MJ/h}$) and MGU-K kinetic deployment / braking regeneration in pure Python controller (`software/controller/powertrain_controller.py`) and JavaScript runtime (`app.js`).
2. Engineered crash pyrofuse circuit breaker logic with SECU latching, isolating the 800V DC bus and cutting MGU-K output to 0 kW immediately. 5/5 controller unit tests passing (100%).

---

## 2026-09-26 · OGA-CAD · f1_2026_gearbox_twin [DIAG-027]

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | resolved                |
| Machine  | `f1_2026_gearbox_twin`  |
| Severity | medium                  |

**Problem:** 
1. Primary reduction / final drive gearing in Formula 1 requires authentic scaling ($R_{\text{final}} = 5.400$) to match realistic road speeds across all 8 homologated forward ratios (1st gear ~91 km/h up to 8th gear ~350 km/h at 11,500 RPM).
2. Rear Impact Structure (RIS) must withstand $\ge 50.0\text{ kJ}$ kinetic crash energy at $12\text{ m/s}$ while housing the FIA mandated $4\text{ Hz}$ pulsing rain safety light.

**Fix:** 
1. Configured exact FIA 2026 8-speed gear ratios and 5.400 final drive in pure Python controller (`gearbox_controller.py`) and Three.js client runtime (`app.js`) with $4.5\text{ ms}$ seamless shift dog engagement.
2. Implemented active electro-hydraulic LSD preload curves (Entry 65%, Apex 25%, Exit 85%) and 50 kJ RIS energy absorption verification with 4 Hz pulsing rain light. 5/5 unit tests passing (100%).

---

## 2026-09-26 · OGA-CAD · f1_2026_rear_wing_twin [DIAG-028]

| Field    | Value                     |
| -------- | ------------------------- |
| Status   | resolved                  |
| Machine  | `f1_2026_rear_wing_twin`  |
| Severity | medium                    |

**Problem:** 
1. 2026 Active Rear Wing (FIA Article C3.10) requires 3-element aerodynamic articulation from Z-Mode ($26.0^\circ$ AoA, $C_L = 2.15$) to X-Mode ($3.0^\circ$ AoA, $C_L = 0.72$) achieving a $58.8\%$ rear wing drag reduction on straights, while guaranteeing mechanical snap-shut in under $140\text{ ms}$ if hydraulic line pressure drops below $120\text{ bar}$.
2. Braking safety interlock (Article C3.11): deceleration $\ge 1.8\text{g}$ must force immediate high downforce re-engagement to prevent aerodynamic detachment entering braking zones.
3. 3D procedural CAD fidelity: avoid generic boxes/cylinders; require 3D contoured spoon airfoil geometry with $45\text{ mm}$ center droop, twin swan-neck goosenecks, Moog hydraulic ram with braided hoses, dual helical return springs with guide arbors, and genuine socket head cap screws with recessed hex sockets.

**Fix:** 
1. Implemented dual-truth aerodynamics and kinematic transition timing ($180\text{ ms}$ normal, $140\text{ ms}$ spring snap-shut) in pure Python controller (`rear_wing_controller.py`) and client JS runtime (`app.js`).
2. Programmed deceleration threshold interlock ($>1.8\text{g}$) and hydraulic pressure monitor ($<120\text{ bar}$ trigger) in both controller and UI.
3. Modeled genuine 3D procedural spoon airfoil, aux flap, active upper flap, swan-neck pylons, Moog actuator, dual helical springs, 6 slot-gap separators, and 16 countersunk/socket-head fasteners with recessed sockets. 5/5 tests passing (100%). Closed-loop visual QA audited via CDP screenshot `scratch/rear_wing_cdp.png`.


