# ⚙️ ChemMate & Twins: Laboratory Workflows & Machine Functionality Specification

> **Deep Functional & Kinematic Engineering Specification**  
> **Status:** Authoritative Machine Specification  
> **Target Applications:** ChemMate (Frontend Interactive Virtual Labs) & Twins (3D Machine Digital Twin Ecosystem)  
> **Governance:** OGA-CAD Master Architecture / SRE Laboratory Instrumentation Standards

---

## 1. Architectural Directive

Every machine digital twin in the `Twins` project is not a static decorative 3D model; it is a **fully functional, interactive instrument simulation**.
To build these machines correctly, we must examine the **exact physical steps** that a student or researcher performs in a chemistry laboratory, and derive the **exact functionality** that must be depicted and implemented in software for each machine.

Every machine twin must adhere to the following six engineering layers:
1. **Physical & Kinematic Layer:** All movable components (doors, shields, dials, levers, drawers, plungers, rotor assemblies) must be modeled with realistic hinges, pivot constraints, and travel stops.
2. **Control & Input Layer:** All real-world physical controls (rocker power switches, tactile buttons, optical rotary encoders, tare bars, purge valves) must be interactive and update internal state.
3. **Visual Feedback & Dynamic Display Layer:** Instrument LCDs, 7-segment LEDs, needle dials, bar graphs, and indicator lamps must render live data using dynamic Canvas textures.
4. **Physics & State Engine Layer:** Under the hood, the machine controller must calculate authentic physical behavior (thermodynamics, centrifugal acceleration, Beer-Lambert optical attenuation, Nernstian potentials, equilibrium constants, viscous drag, and sensor noise).
5. **Error Interlock & Safety Layer:** The simulation must react authentically to user mistakes (unbalanced rotors, open draft shields, thermal overshoots, overpressurization, unconditioned sensors) with authentic error codes and mechanical interlocks.
6. **Accessory & Consumable Interface Layer:** Every machine must have defined docking coordinates for labware (vials, cuvettes, weighing boats, burettes, test tubes, hoses, electrical leads).

---

## 2. Machine-by-Machine Deep Functional Breakdown

---

### 1. Analytical Balance Twin (`balance_twin`)
* **Real-World OEM Lineage:** Mettler Toledo XPE205 Analytical Balance
* **Physical Dimensions:** $263\text{ mm (W)} \times 487\text{ mm (D)} \times 322\text{ mm (H)}$
* **Target ChemMate Modules:** T1L7 (Precision), T3L1 (The Mole), T3L8 (Empirical Formula), T3L10 (Hydrates), T3L19 (Glassware Calibration), T4L23 (Continuous Mass-Loss Kinetics).

#### A. Step-by-Step Lab Workflow
1. **Leveling & Inspection:** Student checks the spirit level bubble on the rear/front frame; if off-center, adjusts the two threaded leveling feet.
2. **Power-On & Self-Test:** Student presses the capacitive `ON/OFF` button. Display runs through a segment diagnostic check (`8.8.8.8.8.8.8 g`) followed by internal calibration (`CAL INT`).
3. **Draft Shield Opening:** Student slides the left, right, or top motorized/manual borosilicate glass door to access the weighing pan.
4. **Vessel Placement & Zeroing:** Student places an empty weighing boat or clean glassware onto the stainless steel pan ($D=78\text{ mm}$). Air currents cause the readout to fluctuate.
5. **Draft Shield Closure:** Student closes the glass doors completely. Readout stabilizes within 2.5 seconds.
6. **Tare Action:** Student presses the wide `TARE` bar. Display resets to `0.0000 g`, and the `Net` indicator illuminates.
7. **Reagent Dispensing:** Student re-opens the right-side glass door and carefully adds chemical powder using a micro-spatula.
8. **Final Stabilization & Recording:** Student closes the door; the stability detector (`*` or `g` symbol) turns solid, confirming the final mass value.

#### B. Depicted Physical & Kinematic Elements
* `Glass_DraftShield_Left`, `Glass_DraftShield_Right`, `Glass_DraftShield_Top`: 3 sliding glass panels with linear glide constraints along the Z and Y axes.
* `Pan_Weighing`: Suspended stainless steel disk resting on a center load-cell coupling with travel limit stops.
* `Level_SpiritBubble`: Circular glass vial with green fluid and a mobile floating air bubble linked to base tilt angles.
* `Foot_FrontLeft`, `Foot_FrontRight`: Threaded knurled leveling thumbwheels that adjust balance pitch and roll.
* `Housing_DraftChamber`: Polished aluminum chamber floor with draft ring perimeter to divert eddy currents.

#### C. Depicted Controls, Inputs & Electrical Interface
* Primary Controls: Capacitive touch `ON/OFF`, `TARE` (large central bar), `ZERO`, `CAL`, and `PRINT`.
* Rear Interface: IEC 60320 C14 power inlet, DB9 RS-232 serial data port, and USB-B peripheral port.

#### D. Depicted Dynamic LCD Readouts
* 7-digit 7-segment dynamic weight display with 0.1 mg ($0.0001\text{ g}$) resolution.
* Dynamic stability indicator symbol (`O` when fluctuating, solid `g` when stable).
* Capacity usage bar (0 to 220 g dynamic graphic progress meter).
* Status flags: `Net`, `Gross`, `Cal`, `Standby`, and thermal drift warning (`ΔT`).

#### E. Internal Physics & State Machine
* **Load Cell Simulation:** $m_{\text{indicated}}(t) = m_{\text{true}} + \delta_{\text{air}}(v_{\text{door}}) + \sigma_{\text{noise}} + \delta_{\text{drift}}(T_{\text{ambient}})$.
* **Air Turbulence Damping:** When doors are open, random high-frequency air current noise ($\pm 0.0015\text{ g}$) is injected; when closed, an exponential settling filter ($e^{-t/\tau}, \tau = 0.8\text{ s}$) brings the reading to steady state.
* **Tare Offset Logic:** $m_{\text{net}} = m_{\text{gross}} - m_{\text{tare}}$. Max capacity enforcement at $220.0000\text{ g}$.

#### F. Interlocks, Error Codes & Safety
* `Err 54`: Weighing range exceeded ($> 220.0000\text{ g}$).
* `Err 52`: Initial zeroing out of tolerance (load on pan during power-up).
* `Draft Warning`: Pulsing visual indicator if student attempts to record mass while doors are unsealed.

#### G. Lab Accessories & Docking Points
* Antistatic polystyrene weighing boats (small, medium, large).
* Glass weighing bottles with ground glass stoppers.
* Micro-spatula (stainless steel, flat and scoop ends).
* ASTM Class 1 calibration weight puck ($100.0000\text{ g}$).

---

### 2. Centrifuge Twin (`centrifuge_twin`)
* **Real-World OEM Lineage:** Thermo Scientific Sorvall Legend X1 / Microcentrifuge 5424 R
* **Physical Dimensions:** $380\text{ mm (W)} \times 440\text{ mm (D)} \times 320\text{ mm (H)}$
* **Target ChemMate Modules:** T1L2 (Phase Separation), T4L28 ($Ag_2CrO_4$ Supernatant), T5L11 (DNA Isolation), T7L1 (Clinical Blood Serum).

#### A. Step-by-Step Lab Workflow
1. **Lid Release:** Student powers on the unit via the rear switch and presses the `OPEN` button. The motorized electronic latch clicks, and the gas-strut lid pivots upward 75°.
2. **Rotor Inspection & Tube Balancing:** Student inspects the 24-place fixed-angle aluminum rotor ($45^\circ$).
3. **Balanced Loading:** Student loads sample tubes (e.g. 1.5 mL microcentrifuge tubes) and **must** insert an identical counterbalancing water tube directly opposite ($180^\circ$ symmetrical hole).
4. **Aerosol-Tight Rotor Lid:** Student screws on the clear aerosol-tight rotor cover using the center knurled knob until tight.
5. **Chamber Lid Closure:** Student pushes the heavy steel armored outer lid downward until the dual latch microswitches engage with an audible click.
6. **Parameter Selection:**
   * Student turns the rotary encoder dial to set speed (e.g. 14,800 RPM / 21,130 $\times g$).
   * Student sets runtime (e.g. 10 minutes) and temperature (e.g. 4.0 °C).
7. **Run Initiation:** Student presses `START`. The motor begins an acceleration curve with an escalating acoustic hum; real-time RPM counts upward.
8. **Deceleration & Completion:** At $t = 0$, regenerative braking engages; rotor decelerates to 0 RPM. An audible chime sounds, and the lid unlocks automatically.
9. **Pellet Inspection:** Student unscrews the rotor lid and extracts the tube to observe the compact solid pellet at the bottom-outer wall.

#### B. Depicted Physical & Kinematic Elements
* `Lid_Main`: Hinged armored steel door with gas strut piston kinematics ($0^\circ \text{ to } 75^\circ$).
* `Latch_Solenoid_Dual`: Twin mechanical locking hooks with engagement feedback.
* `Rotor_FA24x1_5`: 24-well CNC-machined aluminum fixed-angle rotor mounted on motor drive spindle.
* `Rotor_Lid_Transparent`: Polycarbonate screw-on aerosol cap with central knurled aluminum locking knob.
* `Gasket_Silicone`: Continuous sealing ring around the armored containment bowl.

#### C. Depicted Controls, Inputs & Electrical Interface
* Controls: Membrane keypad (`START`, `STOP`, `OPEN`, `SHORT/PULSE`), dual rotary optical encoders with push-to-toggle (`SPEED/rcf`, `TIME/temp`).
* Rear Panel: Main rocker switch, fuse compartment, IEC power inlet, RS-232 telemetry jack.

#### D. Depicted Dynamic LCD Readouts
* Split-screen backlit blue LCD:
  * Top Row: Set vs Actual Speed (toggleable between RPM and RCF $\times g$).
  * Middle Row: Remaining Time countdown (MM:SS) and continuous mode (`HOLD`).
  * Bottom Row: Temperature display (Target vs Chamber actual, $-10.0^\circ\text{C} \text{ to } +40.0^\circ\text{C}$).
* Animated spinning rotor icon (rotates proportionally to angular velocity $\omega$).

#### E. Internal Physics & State Machine
* **Relative Centrifugal Force (RCF):** $\text{RCF} = 1.118 \times 10^{-5} \cdot r_{\text{cm}} \cdot \text{RPM}^2$, with $r_{\text{max}} = 8.4\text{ cm}$.
* **Acceleration/Deceleration Curves:** S-shaped angular velocity ramp ($\alpha = 750\text{ RPM/s}$ acceleration, $\alpha = -980\text{ RPM/s}$ braking).
* **Sample Phase Separation:** Discrete sediment height integration: $h_{\text{pellet}}(t) = h_0 \cdot (1 - e^{-k \cdot \text{RCF} \cdot t})$.
* **Imbalance Vector Calculus:** $\vec{F}_{\text{imbalance}} = \sum_{i=1}^{24} m_i \cdot \omega^2 \cdot \vec{r}_i$. If $|\vec{F}| > F_{\text{threshold}}$, trigger emergency trip.

#### F. Interlocks, Error Codes & Safety
* `ERR 02 - IMBALANCE`: Tripped immediately if rotor masses are asymmetrical; triggers aggressive dynamic braking and audible siren.
* `LID UNLOCKED INTERLOCK`: Motor cannot receive power while lid microswitches are open.
* `LID LOCK DURING ROTATION`: Electronic latch cannot be released until tachometer confirms $\text{RPM} = 0.0$.

#### G. Lab Accessories & Docking Points
* 1.5 mL / 2.0 mL polypropylene conical microcentrifuge tubes with snap caps.
* 0.2 mL PCR tube rotor adapters.
* Tube opening lever / mini-rack.

---

### 3. Hotplate Magnetic Stirrer Twin (`hotplate_twin`)
* **Real-World OEM Lineage:** IKA C-MAG HS 7 Hotplate Magnetic Stirrer
* **Physical Dimensions:** $220\text{ mm (W)} \times 330\text{ mm (D)} \times 105\text{ mm (H)}$
* **Target ChemMate Modules:** T1L3 (Phase Changes), T3L3 (Molarity), T4L11 (Rate Laws), T5L18 (Paracetamol Synthesis), T5L24 (Fischer Esterification).

#### A. Step-by-Step Lab Workflow
1. **Apparatus Setup:** Student sets the unit on the bench and screws a stainless steel support rod into the rear threaded M10 boss.
2. **Glassware Placement:** Student places a 250 mL beaker or round-bottom flask containing reaction liquid onto the white ceramic top plate ($200 \times 200\text{ mm}$).
3. **Stir Bar Addition:** Student drops a PTFE-coated magnetic stir bar ($8 \times 30\text{ mm}$) into the liquid; the internal drive magnet catches the bar with a magnetic snap.
4. **External Temperature Sensor Connection:** Student plugs a PT1000 stainless steel immersion thermocouple probe into the rear DIN socket and lowers the probe tip into the liquid using a bosshead clamp.
5. **Stirring Initiation:** Student turns the left rotary knob to set RPM (e.g. 500 RPM). The motor spins, creating a dynamic liquid vortex.
6. **Heating Initiation:** Student turns the right rotary knob to set target temperature (e.g. 85 °C). The ceramic plate heats up, and the hot-surface warning LED illuminates.
7. **Thermal Equilibrium:** The digital display alternates between target temperature and actual probe liquid temperature as PID heating stabilizes the reaction.
8. **Power-Off & Residual Heat Caution:** When finished, student sets dials to zero. The `HOT!` indicator stays lit until plate temperature drops below 50 °C.

#### B. Depicted Physical & Kinematic Elements
* `Plate_Ceramic`: Seamless chemical-resistant white ceramic glass top plate with dynamic emissive thermal glow shader.
* `Knob_Stir`, `Knob_Heat`: Continuous rotary dials with tactile detents and concentric status ring indicators.
* `Mount_SupportRod`: Threaded blind hole on rear chassis accommodating a vertical $12\text{ mm}$ rod.
* `Probe_PT1000`: Stainless steel sheathed RTD probe connected via a coiled cable to the rear panel.
* `StirBar_PTFE`: Octagonal cylindrical magnet with center pivot ring resting in the glassware.

#### C. Depicted Controls, Inputs & Electrical Interface
* Controls: Rotary speed knob (100–1500 RPM), rotary temperature knob (50–500 °C), push-button power toggle.
* Rear Connections: IEC power inlet, DIN 6-pin female probe socket, RS-232 serial control port.

#### D. Depicted Dynamic LCD Readouts
* Dual 7-segment LED readouts:
  * Left: Stirring speed in RPM ($0\text{ to } 1500\text{ RPM}$).
  * Right: Actual temperature vs Set temperature with `°C` indicator.
* Flashing high-visibility red `HOT Plate` indicator LED (active whenever $T_{\text{plate}} > 50^\circ\text{C}$, even if main power switch is off).

#### E. Internal Physics & State Machine
* **Lumped Thermal Capacitance Model:**  
  $$\frac{dT_{\text{plate}}}{dt} = \frac{P_{\text{heater}} - h A (T_{\text{plate}} - T_{\text{liquid}}) - h_{\text{rad}} (T_{\text{plate}}^4 - T_{\text{env}}^4)}{m_{\text{plate}} c_{\text{plate}}}$$
* **Liquid Vortex Depth:** $h_{\text{vortex}} = \frac{\omega^2 R^2}{2g}$, generating realistic parabolic fluid deformation in the beaker.
* **Magnetic Decoupling (Spin-out):** If speed $\omega$ accelerates too fast for liquid viscosity $\mu$, the stir bar breaks magnetic lock, clattering against the glass bottom.

#### F. Interlocks, Error Codes & Safety
* `Er 5`: Temperature probe disconnected while heating is active.
* `Er 25`: Heating plate over-temperature trip ($> 550^\circ\text{C}$).
* `Spin-out Auto-Recovery`: Automatic deceleration to 50 RPM to recapture lost magnetic bar.

#### G. Lab Accessories & Docking Points
* PTFE magnetic stir bars (various sizes: $6\times 15\text{ mm}, 8\times 30\text{ mm}, 10\times 50\text{ mm}$).
* Magnetic stir bar retriever wand (long PTFE rod with internal magnet).
* 250 mL / 500 mL Griffin beakers, 250 mL Erlenmeyer flasks.
* Support rod, bosshead, and thermometer clamp.

---

### 4. Rotary Evaporator Twin (`rotovap_twin`)
* **Real-World OEM Lineage:** Heidolph Hei-VAP Precision Rotary Evaporator
* **Physical Dimensions:** $430\text{ mm (W)} \times 395\text{ mm (D)} \times 645\text{ mm (H)}$
* **Target ChemMate Modules:** T5L16 (Steroid Extraction), T5L22 (Alcohol Oxidation), T5L25 (Alkaloid Isolation), T7L4 (Lidocaine Multi-Step Synthesis).

#### A. Step-by-Step Lab Workflow
1. **Water Bath Heating:** Student turns on the heating bath, fills it with deionized water, and sets temperature to 45 °C.
2. **Cooling Water Activation:** Student opens the condenser water tap; coolant flows through the inner glass helical coil.
3. **Flask Mounting:** Student clips a 250 mL round-bottom flask containing an organic mixture (e.g. ethanol + product) onto the ground glass vapor tube (ST 24/40) using a plastic Keck clip.
4. **Motorized Lowering:** Student uses the motorized lift button to lower the spinning flask into the heated water bath.
5. **Rotation Activation:** Student adjusts rotation speed to 120 RPM, spreading a thin liquid film across the inner flask surface.
6. **Vacuum Application:** Student switches on the vacuum pump (`vacuum_pump_twin`) and adjusts the electronic vacuum controller to 175 mbar (ethanol boiling point at 45 °C).
7. **Condensation & Distillation:** Bubbles form as vapor travels up the vapor duct and condenses on the cold helical coils, dripping into the spherical 500 mL receiving flask.
8. **Vacuum Release & Recovery:** When evaporation completes, student opens the vacuum aeration stopcock, turns off rotation, raises the motorized lift, unclips the flask, and collects the concentrated pure product.

#### B. Depicted Physical & Kinematic Elements
* `Column_MotorLift`: Vertical motorized carriage with smooth linear vertical travel ($0 \text{ to } 150\text{ mm}$).
* `Vapor_Duct_Rotary`: ST 24/40 precision ground glass drive tube rotating inside a PTFE vacuum seal.
* `Condenser_Helical`: Borosilicate vertical condenser with internal double spiral coolant coils and top vacuum port.
* `Flask_Evaporating`: 250 mL pear-shaped or round-bottom flask with Keck safety clamp.
* `Flask_Receiving`: 500 mL spherical receiving flask anchored with a ball-joint spring clamp ($S35$).
* `Bath_Heating`: Insulated stainless steel water/oil bath tub with dynamic bubbling water surface.

#### C. Depicted Controls, Inputs & Electrical Interface
* Control Panel: 4.3" graphic color touchscreen or dual digital knobs (`LIFT UP/DOWN`, `ROTATION RPM`, `BATH TEMP`, `VACUUM MBAR`).
* Stopcock: PTFE stopcock with hose barb for vacuum aeration and continuous sample feeding.

#### D. Depicted Dynamic LCD Readouts
* Live process graph: Vapor Temperature, Water Bath Temperature, Vacuum Setpoint vs Actual Vacuum.
* Rotation speed indicator ($20\text{ to } 280\text{ RPM}$).
* Timer with elapsed distillation duration.

#### E. Internal Physics & State Machine
* **Clausius-Clapeyron Vapor Pressure Engine:**  
  $$\ln\left(\frac{P}{P_0}\right) = -\frac{\Delta H_{\text{vap}}}{R}\left(\frac{1}{T} - \frac{1}{T_0}\right)$$
* **Evaporative Mass Transfer Rate:** $\frac{dm}{dt} = k \cdot A_{\text{film}}(\omega) \cdot (P_{\text{sat}}(T_{\text{bath}}) - P_{\text{vacuum}})$.
* **Bumping Phenomenon:** If vacuum is pulled too rapidly without rotation, sudden violent boiling occurs, splashing solution up into the condenser (triggering an error/loss of yield).

#### F. Interlocks, Error Codes & Safety
* `Auto-Lift on Power Loss`: Motorized lift automatically rises out of the heating bath if power fails or bath boils dry.
* `Overheat Bath Trip`: Hard cut-off if bath temperature exceeds set limit by $5^\circ\text{C}$.
* `Bumping Alert`: Optical foaming sensor detects liquid splash in vapor tube and throttles vacuum.

#### G. Lab Accessories & Docking Points
* 100 mL, 250 mL, 500 mL ground glass round-bottom flasks (ST 24/40).
* Keck clips (colored POM plastic, size 24).
* Silicone vacuum tubing ($8\text{ mm}$ ID reinforced).
* Chilled circulating water bath lines.

---

### 5. UV-Vis Spectrophotometer Twin (`spectrophotometer_twin`)
* **Real-World OEM Lineage:** Thermo Scientific Genesys 50 UV-Vis Spectrophotometer
* **Physical Dimensions:** $385\text{ mm (W)} \times 395\text{ mm (D)} \times 200\text{ mm (H)}$
* **Target ChemMate Modules:** T1L14 (Balmer Series), T3L15 (PPM Iron), T4L4 (Cobalt Equilibrium), T4L11 (Persulfate Kinetics), T4L12 ($K_{eq}$), T4L24 (Crystal Violet), T5L10 (Enzyme Kinetics).

#### A. Step-by-Step Lab Workflow
1. **Lamp Warming:** Student powers on the instrument; Xenon flash lamp initializes and calibrates filter wheel and diffraction grating ($190\text{ to } 1100\text{ nm}$).
2. **Method Selection:** Student chooses `Quantitative Beer-Lambert Mode` or `Wavelength Scan Mode` on the touchscreen.
3. **Wavelength Setup:** Student inputs target analytical wavelength (e.g. $\lambda = 510\text{ nm}$ for Fe-phenanthroline or $\lambda = 590\text{ nm}$ for Crystal Violet).
4. **Blank Preparation:** Student fills a 10 mm pathlength quartz/plastic cuvette with pure solvent (blank) and wipes the optical faces dry with a Kimwipe.
5. **Blank Insertion & Autozero:** Student opens the sample chamber lid, inserts the blank cuvette into position 1 (orienting optical windows toward the light beam), closes the lid, and presses `ZERO / BLANK` ($A = 0.000, \%T = 100.0\%$).
6. **Sample Loading:** Student replaces the blank with a prepared sample cuvette.
7. **Absorbance Measurement:** Student closes the lid and presses `MEASURE`. Real-time absorbance is digitized and displayed.
8. **Standard Curve / Time Run:** In kinetics experiments, the machine logs $A(t)$ every 5 seconds for 10 minutes, generating a dynamic rate curve.

#### B. Depicted Physical & Kinematic Elements
* `Lid_SampleCompartment`: Hinged light-tight door with soft-close dampener ($0^\circ \text{ to } 90^\circ$).
* `Turret_CuvetteHolder`: 4-position or 6-position circular/linear carousel receiving standard $12.5 \times 12.5\text{ mm}$ cuvettes.
* `Shutter_Optical`: Internal solenoid-actuated light beam blocker.
* `Drain_Compartment`: Spill basin around cuvette wells to catch accidental drops.

#### C. Depicted Controls, Inputs & Electrical Interface
* Controls: 7" color high-resolution touchscreen, physical membrane keys (`ESCAPE`, `ZERO`, `PRINT`, `START`).
* Ports: Front USB-A port for flash drives, rear USB-B to computer, Ethernet RJ45.

#### D. Depicted Dynamic LCD Readouts
* Live photometric data display: Wavelength ($\text{nm}$), Absorbance ($-0.300 \text{ to } 3.500\text{ A}$), Transmittance ($0.0 \text{ to } 100.0\%$).
* Full spectral scan curve ($A \text{ vs } \lambda$) with peak-picking cursor crosshairs.
* Real-time kinetic slope calculator ($dA/dt$) and $R^2$ linear regression metrics.

#### E. Internal Physics & State Machine
* **Beer-Lambert Law Engine:**  
  $$A = -\log_{10}\left(\frac{I}{I_0}\right) = \epsilon(\lambda) \cdot b \cdot c$$
* **Stray Light & Detector Saturation:** When $A > 2.5\text{ A}$, photodiode shot noise increases dramatically; beyond $3.0\text{ A}$, reading saturates non-linearly.
* **Cuvette Fingerprint Artifact:** If the optical window is smudged with oil or un-wiped, artificial baseline absorption offset ($\Delta A \approx +0.08$) is injected.

#### F. Interlocks, Error Codes & Safety
* `Light Leak Warning`: Measurement is aborted if ambient room light strikes the detector while the lid is open during an active scan.
* `Lamp Calibration Failure`: Detects missing Xenon emission peaks (e.g. 546.1 nm mercury line).

#### G. Lab Accessories & Docking Points
* 10 mm pathlength optical polystyrene cuvettes ($3.5\text{ mL}$).
* 10 mm Far-UV fused quartz cuvettes ($190\text{--}1100\text{ nm}$).
* Lint-free delicate task wipers (Kimwipes).
* Micropipettes (P1000, P200) for sample loading.

---

### 6. Diaphragm Vacuum Pump Twin (`vacuum_pump_twin`)
* **Real-World OEM Lineage:** Vacuubrand MD 4C NT Chemistry Diaphragm Pump
* **Physical Dimensions:** $243\text{ mm (W)} \times 325\text{ mm (D)} \times 198\text{ mm (H)}$
* **Target ChemMate Modules:** T1L4 (Rutherford Evacuation), T2L19 (Isoteniscope), T3L12 (Büchner Filtration), T5L18 (Paracetamol Isolation), T6L18 (Schlenk Line).

#### A. Step-by-Step Lab Workflow
1. **Connection Inspection:** Student slips thick-walled vacuum tubing over the inlet nozzle and clamps it securely.
2. **Exhaust Trap Check:** Student verifies that the exhaust catch-pot glass flask is attached to trap condensed solvent vapors.
3. **Gas Ballast Operation:** If pumping volatile condensable vapors, student opens the knurled manual gas ballast valve.
4. **Power-On:** Student clicks the green illuminated rocker switch; the multi-stage PTFE diaphragms oscillate with an audible rhythmic thrum.
5. **Vacuum Regulation:** Student reads the analog mechanical needle gauge as pressure pulls down to ultimate vacuum ($1.5\text{ mbar}$).
6. **Filtration / Distillation Run:** The pump maintains continuous suction through Büchner funnels or rotovap assemblies.
7. **Shut-Down & Venting:** Student turns off the pump and vents the vacuum line before powering off to prevent back-suck into reaction vessels.

#### B. Depicted Physical & Kinematic Elements
* `Casing_Diaphragm`: Dual aluminum cylinder head covers housing chemically resistant fluoropolymer diaphragms.
* `Valve_GasBallast`: Rotating knurled brass/plastic valve knob on top of pump casing.
* `Flask_Catchpot`: Borosilicate glass drainage catch flask clamped to exhaust manifold.
* `Gauge_MechanicalDial`: Bourdon tube vacuum dial gauge with brass pointer ($0 \text{ to } -1.0\text{ bar}$).

#### C. Depicted Controls, Inputs & Electrical Interface
* Controls: Illuminated green 2-pole rocker power switch, manual gas ballast screw valve.
* Connections: $10\text{ mm}$ serrated inlet hose barb, $10\text{ mm}$ exhaust barb, IEC power socket.

#### D. Depicted Dynamic LCD Readouts / Mechanical Gauges
* Analog mechanical dial with moving pointer: Absolute Pressure ($0\text{ to } 1000\text{ mbar}$).
* LED status indicator: Green (Running), Amber (Gas Ballast Open), Red (Thermal Overload).

#### E. Internal Physics & State Machine
* **Pump-Down Kinetics Model:**  
  $$P(t) = P_{\text{ultimate}} + (P_{\text{atm}} - P_{\text{ultimate}}) \cdot e^{-\frac{S}{V} t}$$  
  where $S = 3.4\text{ m}^3/\text{h}$ pumping speed, and $V$ is system manifold volume.
* **Vapor Condensation Equilibrium:** Traps solvent liquid in the catchpot if exhaust temperature drops below dew point.

#### F. Interlocks, Error Codes & Safety
* `Thermal Circuit Breaker`: Shuts down motor if diaphragm chamber exceeds $80^\circ\text{C}$ due to running dead-headed continuously.
* `Back-Suck Prevention`: Warns user if pump is switched off while vacuum remains pulled without venting.

#### G. Lab Accessories & Docking Points
* Heavy-walled red rubber vacuum tubing ($8\text{ mm ID}, 18\text{ mm OD}$).
* Quick-fit clamp rings (KF16 / NW16 flanges).
* In-line cold finger trap with dry-ice/isopropanol slurry.

---

### 7. Benchtop pH / mV Meter Twin (`ph_meter_twin`)
* **Real-World OEM Lineage:** Oakton pH 700 Benchtop Meter
* **Physical Dimensions:** $155\text{ mm (W)} \times 175\text{ mm (D)} \times 69\text{ mm (H)}$
* **Target ChemMate Modules:** T4L6 (Acids/Bases), T4L7 (Titration Curves), T4L8 (Buffers), T4L13 (pH Scale), T4L29 (Buffer Capacity), T4L30 (Henderson-Hasselbalch), T7L3 (Gran Plot Volumetry).

#### A. Step-by-Step Lab Workflow
1. **Electrode Arm Deployment:** Student positions the articulated dual-link arm over the beaker tray.
2. **Electrode Uncapping:** Student removes the wetting storage cap (containing $3\text{ M } KCl$) from the glass combination electrode and rinses the bulb with deionized water from a wash bottle.
3. **2-Point / 3-Point Calibration:**
   * Student immerses electrode into pH 7.00 zero-potential buffer, presses `CAL`, and waits for stability (`READY`).
   * Student rinses electrode and places it into pH 4.01 or pH 10.01 slope buffer; meter calculates electrode efficiency ($\text{Slope} \% = 98.4\%$).
4. **Sample Measurement:** Student immerses electrode into the unknown reaction solution along with the ATC temperature probe.
5. **Continuous Titration Monitoring:** As titrant drops enter the stirred beaker, student logs live pH and millivolt ($mV$) values.
6. **Storage Protocol:** Student washes the electrode and returns it to the wetting storage solution cap.

#### B. Depicted Physical & Kinematic Elements
* `Arm_Articulated`: Double-pantograph weighted arm with friction swivel joints and vertical elevation travel.
* `Electrode_GlassCombination`: Glass stem with hydrated gel reference junction, silver chloride wire, and fragile spherical glass pH sensing membrane.
* `Probe_ATC`: Separate stainless steel automatic temperature compensation sensor rod clamped adjacent to the electrode.
* `Cap_StorageWetting`: Screw-on rubber-sealed bottle protecting the hydrated glass bulb.

#### C. Depicted Controls, Inputs & Electrical Interface
* Controls: Membrane keypad (`MODE`, `CAL`, `ENTER`, `HOLD`, `SETUP`, `MEMORY`).
* Rear Panel: BNC female socket for pH/ORP electrode, RCA/phone jack for ATC temperature probe, 9V DC barrel power jack, RS-232 port.

#### D. Depicted Dynamic LCD Readouts
* High-contrast custom LCD:
  * Primary numeric digits: Large pH display ($0.00 \text{ to } 14.00$, $0.01$ resolution) or raw Potential ($-1999 \text{ to } +1999\text{ mV}$).
  * Secondary digits: Temperature ($0.0 \text{ to } 100.0^\circ\text{C}$).
  * Status banners: `CAL`, `READY`, `ATC`, electrode slope percentage indicator ($\% \text{SLOPE}$).

#### E. Internal Physics & State Machine
* **Nernst Equation Potential Model:**  
  $$E_{\text{cell}} = E^\circ - \frac{2.303 R T}{F} \cdot (\text{pH}_{\text{internal}} - \text{pH}_{\text{solution}})$$  
  where the Nernstian slope is $-59.16\text{ mV/pH}$ at $25^\circ\text{C}$.
* **Asymmetry & Temperature Correction:** Dynamically adjusts displayed pH based on real-time sample temperature measured by ATC probe.
* **Membrane Dehydration Drift:** If electrode is left dry in air, readings drift erratically with high electrical noise.

#### F. Interlocks, Error Codes & Safety
* `ERR SLOPE`: Triggered during calibration if calculated slope falls below $90\%$ or exceeds $105\%$ (indicating old, fouled, or cracked electrode).
* `ERR BUFF`: Buffer identification mismatch (e.g. attempting to calibrate pH 7 with pH 4 buffer).

#### G. Lab Accessories & Docking Points
* Standard pH buffer calibration bottles (pH 4.01 pink, pH 7.00 yellow, pH 10.01 blue).
* Electrode storage solution ($3\text{ M } KCl$).
* Polyethylene squirt wash bottle with deionized water.
* 50 mL, 100 mL, 250 mL beakers.

---

### 8. High-Temperature Muffle Furnace Twin (`muffle_furnace_twin`)
* **Real-World OEM Lineage:** Carbolite Gero CWF 1100 Box Furnace
* **Physical Dimensions:** $375\text{ mm (W)} \times 485\text{ mm (D)} \times 585\text{ mm (H)}$
* **Target ChemMate Modules:** T1L11 (Dalton's Copper Oxides), T1L22 (Carbon Allotrope Combustion), T3L10 (Hydrate Dehydration), T6L5 (YBCO Superconductors), T9L2 (Zirconia Ceramic Sintering).

#### A. Step-by-Step Lab Workflow
1. **Pre-Flight Chamber Inspection:** Student verifies chamber cleanliness and ensures ventilation chimney damper is open.
2. **Sample Loading in Crucible:** Student places powder sample into a high-purity alumina ($Al_2O_3$) or porcelain crucible.
3. **Safety Gear Donning:** Student puts on heat-resistant Kevlar thermal gloves and a protective face shield.
4. **Door Opening:** Student lifts the counter-balanced parallel-action door handle; door swings up and away, keeping the hot face directed away from the operator.
5. **Crucible Insertion:** Using long stainless steel crucible tongs ($450\text{ mm}$), student places the crucible onto the center refractory hearth slab.
6. **Door Closure & Thermal Ramp Programming:** Student closes the door firmly, engaging the safety cut-out switch.
7. **PID Ramp Execution:** Student inputs target temperature (e.g. 1000 °C) and ramp rate ($10^\circ\text{C/min}$). The chamber glows cherry red, transitioning to bright orange/yellow.
8. **Dwell & Cooling:** After dwell time, the furnace cools to safe handling temperature ($< 200^\circ\text{C}$) before student extracts the crucible directly into a vacuum desiccator.

#### B. Depicted Physical & Kinematic Elements
* `Door_ParallelAction`: Counter-balanced 4-bar linkage door mechanism maintaining vertical orientation during upward opening.
* `Chamber_Refractory`: Vacuum-formed low-thermal-mass ceramic fiber chamber with embedded resistance wire heating elements.
* `Hearth_Plate`: Silicon carbide or high-alumina base tile protecting chamber insulation.
* `Chimney_Exhaust`: Top stainless steel vent flue with manual slide damper.
* `Switch_SafetyCutout`: Mechanical microswitch tripped when door opens, cutting power to elements.

#### C. Depicted Controls, Inputs & Electrical Interface
* Controls: Eurotherm PID digital temperature programmer (Up/Down buttons, Scroll, Page, Auto/Manual).
* High-current mains disconnect switch, over-temperature reset button.

#### D. Depicted Dynamic LCD / Glow Visuals
* Eurotherm Dual Display:
  * Upper green LED digits: Current Process Variable ($PV$ temperature, $20\text{ to } 1100^\circ\text{C}$).
  * Lower amber LED digits: Target Setpoint ($SP$).
* Dynamic internal emissive glow: Procedural blackbody radiation color transition:
  * $500^\circ\text{C}$: Faint dull cherry red.
  * $800^\circ\text{C}$: Bright orange-red.
  * $1100^\circ\text{C}$: Brilliant glowing yellow-white.

#### E. Internal Physics & State Machine
* **Blackbody Radiation & Stefan-Boltzmann Heating:**  
  $$P_{\text{net}} = \sigma \epsilon A (T_{\text{element}}^4 - T_{\text{chamber}}^4)$$
* **PID Thermal Loop:** $P(t) = K_p e(t) + K_i \int e(t)dt + K_d \frac{de}{dt}$, exhibiting realistic thermal lag and minor overshoot ($\pm 1^\circ\text{C}$).
* **Crucible Thermal Shock:** If an alumina crucible is pulled out into cold air at $> 800^\circ\text{C}$, the simulation checks thermal gradient and risks cracking the ceramic.

#### F. Interlocks, Error Codes & Safety
* `DOOR OPEN POWER CUT-OFF`: Disconnects electrical power to heating coils instantly upon door opening, preventing accidental electric shock to metal tongs.
* `ALARM 1 - OVERTEMP`: Independent backup thermocouple cuts main power contactor if chamber exceeds $1150^\circ\text{C}$.

#### G. Lab Accessories & Docking Points
* Alumina crucibles and lids ($30\text{ mL}$, $50\text{ mL}$, $99.7\%\ Al_2O_3$).
* Porcelain crucibles with covers (Gooche type).
* Long-reach stainless steel crucible tongs ($450\text{ mm}$ length).
* High-temperature Kevlar aluminized gloves.
* Heavy glass vacuum desiccator containing silica gel beads.

---

### 9. Inert Atmosphere Dual-Port Glove Box Twin (`glove_box_twin`)
* **Real-World OEM Lineage:** Inert Corp I-Box / MBraun Labstar
* **Physical Dimensions:** $1200\text{ mm (W)} \times 750\text{ mm (D)} \times 900\text{ mm (H)}$
* **Target ChemMate Modules:** T6L4 (Quantum Dots Hot-Injection), T8L2 (Sharpless Epoxidation), T8L3 (Suzuki Cross-Coupling), T10L1 (Inert Precursor Prep).

#### A. Step-by-Step Lab Workflow
1. **Antechamber Cycle Preparation:** Student places dry chemical reagents, flasks, and pipettes into the cylindrical side antechamber and clamps the outer door shut.
2. **Vacuum-Refill Purge Cycle:**
   * Student pulls vacuum on the antechamber to $-1.0\text{ bar}$ using the vacuum pump.
   * Student refills the chamber with high-purity argon gas (Grade 5.0) to $0.0\text{ bar}$.
   * Student repeats this 3 times to remove all atmospheric oxygen and moisture.
3. **Inner Antechamber Retrieval:** Student inserts hands into the heavy butyl gloves, opens the internal antechamber door, and brings the materials onto the main stainless steel floor.
4. **Atmospheric Purity Verification:** Student checks the oxygen and moisture analyzers on the HUD ($< 0.1\text{ ppm } O_2$, $< 0.1\text{ ppm } H_2O$).
5. **Reaction Assembly:** Student uses gas-tight syringes, stirs air-sensitive reagents, and seals reaction vials under positive argon pressure ($+3.5\text{ mbar}$).
6. **Sealed Sample Extraction:** Student places completed sealed vials back into the antechamber to transfer them out to analytical instruments.

#### B. Depicted Physical & Kinematic Elements
* `Window_Slanted`: Slanted laminated safety glass or clear polycarbonate front viewing panel.
* `Ports_Gloves`: Dual $220\text{ mm}$ aluminum glove port rings with butyl rubber gloves hanging into the chamber.
* `Antechamber_Large`: Cylindrical horizontal vacuum chamber ($D=390\text{ mm}, L=600\text{ mm}$) with inner and outer swing doors.
* `Door_Outer`, `Door_Inner`: Precision machined aluminum doors with handwheel clamping screws and viton O-rings.
* `Pedal_Foot_Dual`: Twin floor foot pedals for manual positive/negative pressure adjustment.

#### C. Depicted Controls, Inputs & Electrical Interface
* Touchscreen PLC controller panel (Siemens / Allen-Bradley graphical interface).
* Foot pedals: Left (Inject Argon / Increase Pressure), Right (Evacuate / Decrease Pressure).
* Circulation blower switch and regenerable copper catalyst column purge valve.

#### D. Depicted Dynamic LCD Readouts
* PLC Display Metrics:
  * Oxygen Concentration ($0.0 \text{ to } 1000.0\text{ ppm}$, log scale).
  * Moisture Level ($0.0 \text{ to } 100.0\text{ ppm}$).
  * Internal Differential Pressure ($-5.0 \text{ to } +10.0\text{ mbar}$).
* Gas circulation blower speed (RPM) and regeneration status flags.

#### E. Internal Physics & State Machine
* **Gas Purge Dilution Kinetics:**  
  $$C_{\text{residual}} = C_0 \cdot \left(\frac{P_{\text{vacuum}}}{P_{\text{atm}}}\right)^N$$  
  for $N$ vacuum-refill cycles.
* **Pressure Regulation Loop:** Automatic solenoid valve pulses argon when internal pressure drops below $+1.5\text{ mbar}$ or vents to exhaust when $> +4.5\text{ mbar}$.

#### F. Interlocks, Error Codes & Safety
* `ANTECHAMBER DOOR CONFLICT INTERLOCK`: Outer and inner antechamber doors can never be opened simultaneously; mechanical and software lock prevents atmospheric blowout into main box.
* `HIGH O2 ALARM`: Sounder trips if oxygen exceeds $5.0\text{ ppm}$, initiating high-speed catalyst circulation.

#### G. Lab Accessories & Docking Points
* Gas-tight Hamilton micro-syringes with stainless needles.
* Schlenk storage flasks with PTFE stopcocks.
* Crimper and aluminum crimp-top septum vials ($2\text{ mL}$, $10\text{ mL}$).
* Internal mini magnetic stir plate and analytical balance module.

---

### 10. High-Pressure Mini Reactor Twin (`high_pressure_reactor_twin`)
* **Real-World OEM Lineage:** Parr 4560 Mini Benchtop Pressure Reactor
* **Physical Dimensions:** $250\text{ mm (W)} \times 300\text{ mm (D)} \times 600\text{ mm (H)}$
* **Target ChemMate Modules:** T2L16 (Critical Point Deviation), T2L20 (Phase Diagram Triple Point), T6L3 (Heterogeneous Hydrogenation), T7L13 (Haber-Bosch Micro-Reactor), T8L5 (Supercritical $CO_2$ Extraction).

#### A. Step-by-Step Lab Workflow
1. **Head Assembly Unclamping:** Student unscrews the split-ring clamp bolts using a torque wrench and lifts the reactor head.
2. **Cylinder Charging:** Student charges the heavy-wall alloy cylinder ($100\text{ mL}$ or $300\text{ mL}$) with liquid substrate and catalyst.
3. **Sealing & Gasket Placement:** Student inspects the PTFE/flexible graphite flat gasket, seats the cylinder, and torques the split-ring bolts in a cross pattern.
4. **Gas Purging & Pressurization:**
   * Student connects the flexible high-pressure hose from a hydrogen or carbon dioxide tank.
   * Student opens the inlet needle valve, pressurizes to 10 bar, and vents through the exhaust valve to purge air (3 cycles).
   * Student pressurizes to target operating pressure (e.g. 50 bar / 725 psi).
5. **Magnetic Drive Activation:** Student engages the magnetic drive motor; the internal magnetically coupled four-blade turbine impeller spins without shaft seals.
6. **Heating & Pressure Monitoring:** Student activates the PID heating jacket; as temperature climbs to 180 °C, the analog pressure gauge needle rises in accordance with real gas laws.
7. **Cooling & Depressurization:** Upon completion, student turns on internal cooling coil water, allows the system to drop below 30 °C, and slowly vents excess gas through a fume hood scrubber line before opening.

#### B. Depicted Physical & Kinematic Elements
* `Vessel_Cylinder`: Thick-walled CNC-machined Hastelloy C-276 or 316 Stainless Steel bomb vessel.
* `Clamp_SplitRing`: Two-piece heavy forged steel split-ring clamp secured by 6 high-tensile socket head cap screws.
* `Drive_Magnetic`: Hermetically sealed magnetic coupling housing with cooling water jacket and DC motor drive.
* `Manifold_Head`: Stainless steel reactor head with gas inlet valve, liquid sampling dip-tube valve, thermowell, rupture disc assembly, and pressure gauge.
* `Impeller_Turbine`: 4-blade turbine impeller on vertical drive shaft.
* `Coil_InternalCooling`: Serpentine internal cooling loop tubing.

#### C. Depicted Controls, Inputs & Electrical Interface
* Controls: Standalone Parr 4848 digital process controller (Stirrer RPM dial, Heater PID buttons, Motor On/Off).
* Mechanical Valves: Two precision stainless steel needle valves with black phenolic handwheels.

#### D. Depicted Dynamic LCD / Needle Readouts
* Analog Bourdon tube gauge: $0 \text{ to } 200\text{ bar}$ ($0 \text{ to } 3000\text{ psi}$) with redline marker.
* Digital 4848 controller screen: Motor Speed ($0 \text{ to } 1700\text{ RPM}$), Temperature ($PV$ vs $SP$).
* High-pressure transducer electronic readout.

#### E. Internal Physics & State Machine
* **Redlich-Kwong-Soave Real Gas Pressure Engine:**  
  $$P = \frac{RT}{V_m - b} - \frac{a(T)}{V_m(V_m + b)}$$
* **Heterogeneous Hydrogenation Kinetics:** Substrate conversion rate $\frac{d[S]}{dt} = -k \cdot P_{H_2} \cdot \theta_{\text{catalyst}} \cdot [S]$.
* **Phase Inversion Simulation:** Visually depicts liquid-gas meniscus disappearance as fluid crosses into supercritical territory ($T > T_c, P > P_c$).

#### F. Interlocks, Error Codes & Safety
* `RUPTURE DISC BURST TRIP`: Stainless steel burst disc rated for $138\text{ bar}$ ($2000\text{ psi}$); if exceeded, pressure vents catastrophically through discharge line with high-volume hiss.
* `High-Temperature Safety Interlock`: Thermal fuse disconnects heater band if vessel skin exceeds $350^\circ\text{C}$.

#### G. Lab Accessories & Docking Points
* 1/8" and 1/4" flexible stainless steel braided high-pressure hoses.
* High-pressure gas regulators (Hydrogen, Nitrogen, Carbon Dioxide).
* Torque wrench with hex socket set ($17\text{ mm}$).
* Sampling syringe and collection vials.

---

### 11. Constant-Pressure & Oxygen Bomb Calorimeter Twin (`calorimeter_twin`)
* **Real-World OEM Lineage:** Parr 1341 Plain Jacket Bomb Calorimeter & Double-Cup Dewar
* **Physical Dimensions:** $300\text{ mm (W)} \times 300\text{ mm (D)} \times 520\text{ mm (H)}$
* **Target ChemMate Modules:** T4L1 (Solution Enthalpy), T4L2 (Neutralization Enthalpy), T4L17 (Metal Specific Heat), T4L18 (Ice Fusion), T4L19 (Hess's Law), T4L20 (Benzoic Acid Combustion Enthalpy).

#### A. Step-by-Step Lab Workflow (Oxygen Bomb Combustion Mode)
1. **Sample Pelletizing:** Student weighs 0.8 g of benzoic acid powder on the balance and uses a mechanical pellet press to form a solid cylindrical tablet.
2. **Bomb Preparation:** Student opens the stainless steel combustion bomb ($1108\text{ style}$), clamps 10 cm of nickel-chromium fuse wire between the electrodes, and suspends the pellet in a platinum combustion capsule.
3. **Oxygen Charging:** Student seals the bomb screw cap, attaches the oxygen charging hose, and fills the chamber with pure $O_2$ to $30\text{ bar}$ ($435\text{ psi}$) without disturbing the pellet.
4. **Calorimeter Bucket Water Loading:** Student dispenses exactly $2000.0\text{ g}$ of distilled water into the oval metal bucket and lowers the charged bomb into the water using a lifting handle.
5. **Jacket Closure & Thermometer Placement:** Student closes the insulated outer calorimeter cover, engages the motorized stirrer belt, and inserts a high-precision Beckmann differential thermometer ($\pm 0.005\ ^\circ\text{C}$).
6. **Pre-Fire Baseline Logging:** Student logs temperature every 30 seconds for 5 minutes to establish the initial drift slope ($r_1$).
7. **Ignition Execution:** Student presses the ignition fire button on the 2901 Ignition Unit. A 10 cm electrical spark ignites the wire, triggering flash combustion.
8. **Temperature Rise & Calculation:** Heat transfers into the water; student logs the rapid temperature rise until a post-fire equilibrium slope ($r_2$) is reached, calculating $\Delta H^\circ_{\text{combustion}}$.

#### B. Depicted Physical & Kinematic Elements
* `Bomb_StainlessSteel`: Forged alloy pressure vessel with threaded closure ring, check valve, and two terminal electrodes.
* `Calorimeter_Jacket`: Double-walled insulated outer shell with hinged cover and stirrer drive pulley.
* `Bucket_Oval`: Chrome-plated brass water can fitting the bomb and stirrer impellers.
* `Thermometer_Beckmann`: Large glass differential thermometer with movable mercury reservoir scale ($0.01^\circ\text{C}$ graduations).
* `Press_Pellet`: Lever-action manual mechanical die press creating compact chemical tablets.

#### C. Depicted Controls, Inputs & Electrical Interface
* Ignition Box Controls: Keyed safety switch, push-to-fire momentary button, continuity test light.
* Motorized stirrer switch with continuous rubber belt drive.

#### D. Depicted Dynamic LCD / Scale Readouts
* Analog thermometer mercury meniscus position moving smoothly upward under optical magnification.
* Digital data logging terminal displaying real-time cooling correction curve ($T \text{ vs } t$).

#### E. Internal Physics & State Machine
* **Energy Balance Equation:**  
  $$W \cdot \Delta T = \Delta H_{\text{combustion}} \cdot m_{\text{sample}} + e_{\text{fuse}} + e_{\text{acid}}$$  
  where $W$ is the calibrated water equivalent of the calorimeter ($\approx 10,090\text{ J/}^\circ\text{C}$).
* **Regnault-Pfaundler Thermal Leakage Correction:** Accounts for radiation and conduction across the non-adiabatic plain jacket during the 12-minute run.

#### F. Interlocks, Error Codes & Safety
* `Ignition Continuity Failure`: Warns if fuse wire is broken or shorted to the capsule before charging.
* `Overpressure Relief Valve`: Prevents filling above $35\text{ bar}$.

#### G. Lab Accessories & Docking Points
* Nickel-chromium ignition wire ($0.16\text{ mm}$ diameter, $2.3\text{ J/cm}$).
* Platinum / Stainless steel sample combustion capsules.
* 30 bar Oxygen tank with filling manifold.
* Pellet press and analytical balance.

---

### 12. Automatic Potentiometric Titrator Twin (`auto_titrator_twin`)
* **Real-World OEM Lineage:** Metrohm Eco Titrator / Hanna HI932
* **Physical Dimensions:** $280\text{ mm (W)} \times 320\text{ mm (D)} \times 490\text{ mm (H)}$
* **Target ChemMate Modules:** T3L19 (Volumetric Glassware), T4L7 (Titration Curves), T4L9 ($K_{sp}$ Titration), T4L14 (Polyprotic $H_3PO_4$ Double Endpoint), T4L29 (Buffer Capacity), T7L3 (Gran Plot Volumetry).

#### A. Step-by-Step Lab Workflow
1. **Burette Syringe Priming:** Student turns on the instrument; the motorized piston drives $20\text{ mL}$ of standardized titrant ($0.1000\text{ M } NaOH$) through the PTFE tubing, purging all air bubbles back to the reagent bottle.
2. **Beaker Setup:** Student places a $150\text{ mL}$ tall-form beaker containing unknown acid on the magnetic stirrer base, drops in a stir bar, and turns on stirring.
3. **Electrode & Dosing Tip Immersion:** Student lowers the sensor holder arm so the combination glass pH electrode and the anti-diffusion dispensing tip sit submerged in the solution.
4. **Titration Method Configuration:** Student selects `Dynamic Equivalence Point Titration (DET)` or `Monotonic Dosing (MET)` with target pH endpoint.
5. **Titration Execution:** Student presses `START`. The stepper-motor piston delivers titrant in decreasing volume increments as the titration slope ($dpH/dV$) steepens.
6. **Live Derivative Graphing:** The screen plots $pH \text{ vs } V$ and the first derivative peak ($dpH/dV$) in real time.
7. **Equivalence Detection:** When the inflection point is crossed, the instrument calculates the exact equivalence volume ($V_{eq} = 18.425\text{ mL}$) and auto-calculates sample concentration.

#### B. Depicted Physical & Kinematic Elements
* `Burette_PistonGlass`: Precision glass cylinder with PTFE plunger driven by a linear micro-stepper screw ($20\text{ mL}$ or $50\text{ mL}$).
* `Valve_RotaryPTFE`: 3-way motorized ceramic valve alternating between reagent aspiration and dispensing.
* `Stand_StirrerBase`: Integrated magnetic stirrer plate with beaker centering guide.
* `Arm_ElectrodeHolder`: Clamping head supporting electrode, temperature probe, and fine dosing anti-diffusion tip.
* `Bottle_ReagentAmber`: 1000 mL amber glass titrant reservoir with drying tube desiccator on cap.

#### C. Depicted Controls, Inputs & Electrical Interface
* Controls: 5.7" color graphic touchscreen terminal with virtual QWERTY keypad and start/stop keys.
* Rear Connections: BNC electrode socket, Pt1000 temp socket, USB printer port, balance communication interface.

#### D. Depicted Dynamic LCD Readouts
* Real-time dual graph:
  * Primary curve: Measured Potential ($mV$) or $pH$ vs Titrant Volume ($mL$).
  * Secondary curve: First derivative curve showing sharp vertical spike at equivalence.
* Quantitative numerical readouts: $V_{\text{actual}}$ (0.001 mL resolution), Current $pH$, Equivalence point volumes ($EP1, EP2$).

#### E. Internal Physics & State Machine
* **Dynamic Monotonic Titration Engine:** Solves electroneutrality and proton balance equations in real time:  
  $$[H^+] + [Na^+] = [OH^-] + [A^-]$$
* **First & Second Derivative Endpoint Detection:** Locates inflection point via numerical differentiation:  
  $$\frac{d^2pH}{dV^2} = 0$$
* **Gran Plot Linearization Transformation:** Plots $V \cdot 10^{-pH}$ vs $V$ to determine equivalence volume in weak acid titrations.

#### F. Interlocks, Error Codes & Safety
* `Air Bubble in Burette Warning`: Optical sensor detects gas pockets in dispensing line.
* `Endpoint Overtitration Alert`: Halts dosing if pH exceeds 13.5 without encountering expected inflection.

#### G. Lab Accessories & Docking Points
* Standardized volumetric titrants ($0.1000\text{ M } NaOH, 0.1000\text{ M } HCl, 0.0500\text{ M } EDTA$).
* 150 mL tall-form beakers without spout.
* Combination pH electrode with sleeve diaphragm.
* Calibration standard buffers.

---

### 13. Gas Laws Precision Piston & Eudiometer Twin (`gas_laws_piston_twin`)
* **Real-World OEM Lineage:** Pasco Precision Bore Syringe / Glass Eudiometer Station
* **Physical Dimensions:** $200\text{ mm (W)} \times 200\text{ mm (D)} \times 650\text{ mm (H)}$
* **Target ChemMate Modules:** T3L5 (Gas Laws Explorer), T3L7 (Molar Volume of $H_2$), T3L16 (Dalton's Partial Pressure over Water), T3L18 (Real vs Ideal Gas Compressibility).

#### A. Step-by-Step Lab Workflow
1. **Boyle's Law Piston Demonstration ($P \propto 1/V$):**
   * Student locks $50.0\text{ mL}$ of dry air inside the low-friction glass piston syringe.
   * Student turns the micrometer screw clamp to compress the gas volume incrementally down to $25.0\text{ mL}$.
   * Real-time pressure gauge confirms inverse pressure doubling ($1.00\text{ bar} \rightarrow 2.00\text{ bar}$).
2. **Charles's Law Water Bath Immersion ($V \propto T$):**
   * Student lowers the gas cylinder into a stirred water bath on the hotplate.
   * As temperature rises from $20^\circ\text{C}$ to $80^\circ\text{C}$ under isobaric conditions, student tracks piston expansion.
3. **Eudiometer Collection over Water (Dalton's Law):**
   * Student fills a 50 mL glass eudiometer with 3 M HCl, inverts it into a water jar, and traps magnesium ribbon in a copper wire cage.
   * Hydrogen gas generates, displacing water downward.
   * Student equalizes water levels inside and outside the tube to match atmospheric pressure, correcting for aqueous vapor pressure ($P_{\text{total}} = P_{H_2} + P_{H_2O}$).

#### B. Depicted Physical & Kinematic Elements
* `Syringe_PrecisionBore`: Heavy borosilicate glass cylinder with precision ground graphite plunger with low friction.
* `Clamp_MicrometerScrew`: Fine-threaded adjustment screw compressing the piston with linear position encoder.
* `Eudiometer_Glass50mL`: Graduated inverted tube ($0.1\text{ mL}$ markings) clamped in vertical ring stand.
* `Jar_LevelingWater`: 1000 mL glass leveling cylinder allowing meniscus level equalization.
* `Valve_QuickRelease`: Miniature ball valve sealing the gas chamber or venting to atmosphere.

#### C. Depicted Controls, Inputs & Electrical Interface
* Integrated digital pressure transducer ($0 \text{ to } 300\text{ kPa}$) with USB telemetry.
* Fast-response internal thermistor probe penetrating the chamber through an airtight seal.

#### D. Depicted Dynamic LCD Readouts
* Digital HUD displaying: Pressure ($kPa$), Volume ($mL$), Temperature ($K$), and Product $P \cdot V / T$ (confirming ideal constant).
* Live isobaric/isothermal $P\text{--}V$ thermodynamic indicator diagram.

#### E. Internal Physics & State Machine
* **Ideal vs Real Gas Equations:**  
  $$P_{\text{ideal}} = \frac{nRT}{V} \quad \text{vs} \quad \left(P + \frac{an^2}{V^2}\right)(V - nb) = nRT$$
* **Dalton's Law Vapor Correction:** $P_{\text{dry}} = P_{\text{barometric}} - P_{\text{sat}, H_2O}(T)$.

#### F. Interlocks, Error Codes & Safety
* `Plunger Friction Seize`: Warns if dirty glass causes plunger stick-slip behavior.
* `Overpressure Vent`: Syringe pops open if pressure exceeds mechanical rating ($3.5\text{ bar}$).

#### G. Lab Accessories & Docking Points
* 1000 mL glass leveling jar.
* Copper wire reaction cage and magnesium ribbon.
* Digital barometer.

---

### 14. Electrochemical Potentiostat & Galvanostat Twin (`potentiostat_twin`)
* **Real-World OEM Lineage:** Gamry Interface 1010E Potentiostat / Benchtop Cell
* **Physical Dimensions:** $240\text{ mm (W)} \times 320\text{ mm (D)} \times 120\text{ mm (H)}$
* **Target ChemMate Modules:** T1L6 (Conductivity of Molten Salts), T4L16 (Galvanic Daniell Cell), T4L22 (Temperature-Dependent Cell EMF $\Delta G^\circ, \Delta S^\circ$), T7L8 (Conductivity Sensors).

#### A. Step-by-Step Lab Workflow
1. **Electrode Polishing & Setup:** Student polishes metal electrode strips (Zinc, Copper, Platinum) with fine alumina slurry, rinses with deionized water, and dries them.
2. **Cell Assembly:**
   * In a Daniell cell setup, student fills half-cells with $1.0\text{ M } ZnSO_4$ and $1.0\text{ M } CuSO_4$.
   * Student bridges the two compartments with an inverted U-tube agar-$KNO_3$ salt bridge.
3. **Lead Attachment:** Student connects color-coded alligator clips:
   * Working Electrode (Green) $\rightarrow$ Copper cathode.
   * Counter Electrode (Red) $\rightarrow$ Auxiliary electrode.
   * Reference Electrode (White) $\rightarrow$ Saturated Calomel Electrode (SCE) or Zinc anode.
4. **Open Circuit Potential (OCP):** Student records resting cell potential ($E_{\text{cell}} = 1.10\text{ V}$).
5. **Concentration Cell & Nernst Exploration:** Student serially dilutes the $Cu^{2+}$ concentration ($1.0\text{ M} \rightarrow 0.1\text{ M} \rightarrow 0.01\text{ M}$); cell EMF drops by $29.6\text{ mV}$ per decade.
6. **Cyclic Voltammetry (CV):** In Tier 6 research labs, student runs a potential sweep ($-0.5\text{ V} \text{ to } +0.8\text{ V}$) to record duck-shaped reversible redox waves.

#### B. Depicted Physical & Kinematic Elements
* `Cell_GlassJacketed`: 3-neck or 5-neck electrochemical glass cell with water jacket for temperature control.
* `Bridge_SaltUTube`: Glass U-tube containing $KNO_3$ immobilized in agar gel with porous glass frits.
* `Cable_ElectrodeHarness`: Shielded coaxial cable bundle splitting into 5 color-coded alligator clips.
* `Electrode_SCE`: Saturated Calomel Reference Electrode with porous Vycor glass frit tip.
* `Electrodes_MetalStrips`: Zinc, Copper, Silver, and Glassy Carbon disc working electrodes.

#### C. Depicted Controls, Inputs & Electrical Interface
* High-speed USB communication interface, grounded chassis terminal.
* High-impedance electrometer input ($> 10^{12}\ \Omega$).

#### D. Depicted Dynamic LCD Readouts
* Digital Voltmeter / Ammeter displays: Potential ($E \text{ in } V$, $0.1\text{ mV}$ resolution) and Current ($I \text{ in } \mu A \text{ to } mA$).
* Live Cyclic Voltammogram graph ($I \text{ vs } E$) with cathodic and anodic peak markers.

#### E. Internal Physics & State Machine
* **Nernst Equation Potential Engine:**  
  $$E_{\text{cell}} = E^\circ_{\text{cell}} - \frac{RT}{nF} \ln\left(\frac{[Zn^{2+}]}{[Cu^{2+}]}\right)$$
* **Butler-Volmer Electrode Kinetics:** Calculates charge transfer overpotential and diffusion-limited currents.

#### F. Interlocks, Error Codes & Safety
* `Reference Electrode High Impedance Alert`: Detects dried salt bridge or clogged reference frit.
* `Current Overload Trip`: Protects internal shunts if electrodes short-circuit.

#### G. Lab Accessories & Docking Points
* Alumina polishing pad and $0.05\ \mu\text{m}$ polishing powder.
* High-purity metal foil strips ($Zn, Cu, Fe, Pb, Ag$).
* Saturated Calomel and Ag/AgCl reference electrodes.

---

### 15. Digital Capillary Melting Point Apparatus Twin (`mel_temp_twin`)
* **Real-World OEM Lineage:** Cole-Parmer Mel-Temp 1201D Digital Melting Point
* **Physical Dimensions:** $180\text{ mm (W)} \times 260\text{ mm (D)} \times 310\text{ mm (H)}$
* **Target ChemMate Modules:** T2L5 (Ionic vs Covalent Melts), T5L18 (Paracetamol Purity), T5L23 (Dibenzalacetone Crystals), T7L4 (Lidocaine Intermediate).

#### A. Step-by-Step Lab Workflow
1. **Capillary Sample Loading:**
   * Student crushes recrystallized chemical powder into a fine powder on a watch glass.
   * Student presses the open end of a glass capillary tube ($1.5\text{ mm OD}$) into the powder, turns the tube upright, and drops it down a $50\text{ cm}$ glass drop tube to pack $2\text{--}3\text{ mm}$ of powder at the sealed bottom.
2. **Capillary Insertion:** Student inserts up to 3 capillary tubes into the vertical slots of the illuminated heating block.
3. **Plateau Temperature Heating:** Student programs a fast pre-heat ramp to within 10 °C of expected melting point (e.g. 125 °C for paracetamol).
4. **Precision Observation Ramp:** Student switches to a slow $1.0^\circ\text{C/min}$ ramp while looking through the $8\times$ magnifying lens.
5. **Phase Transition Logging:**
   * Student records meniscus collapse ($T_{\text{onset}} = 169.0^\circ\text{C}$).
   * Student records complete clear liquid transition ($T_{\text{clear}} = 170.5^\circ\text{C}$).
   * Narrow range ($1.5^\circ\text{C}$) confirms high chemical purity.

#### B. Depicted Physical & Kinematic Elements
* `Lens_Eyepiece`: Adjustable-focus $8\times$ optical magnifier with integrated ring LED illuminator.
* `Block_HeatingBrass`: Precision-machined aluminum/brass heating block with 3 vertical capillary slots and viewing slot.
* `Tube_DropPacker`: Vertical glass bounce tube mounted on the side for packing powder to capillary bottoms.
* `Chamber_Cooling`: Internal cooling fan with rear exhaust vents.

#### C. Depicted Controls, Inputs & Electrical Interface
* Controls: Membrane keypad (`START`, `STOP`, `RAMP RATE`, `SET TEMP`, `STORE T1`, `STORE T2`).

#### D. Depicted Dynamic LCD Readouts
* Backlit LCD displaying: Block Temperature ($0.1^\circ\text{C}$ resolution), Heating Rate ($0.5 \text{ to } 10.0^\circ\text{C/min}$), and Stored Melting Range ($T_1 \text{--} T_2$).
* Visual rendering through eyepiece showing animated capillary crystal collapse into liquid droplet.

#### E. Internal Physics & State Machine
* **Melting Point Depression & Impurity Broadening (van 't Hoff):**  
  $$\Delta T = T_{\text{pure}} - T_{\text{observed}} = \frac{R T_{\text{pure}}^2}{\Delta H_{\text{fus}}} \cdot x_{\text{impurity}}$$  
  Simulates broadened melting range when impure syntheses are loaded.

#### F. Interlocks, Error Codes & Safety
* `Thermal Runaway Cutoff`: Cuts element power if temperature reaches $400^\circ\text{C}$.

#### G. Lab Accessories & Docking Points
* Glass melting point capillary tubes (one-end sealed, $1.5 \times 100\text{ mm}$).
* Watch glasses and micro-spatulas.

---

### 16. Automatic Digital Chiral Polarimeter Twin (`polarimeter_twin`)
* **Real-World OEM Lineage:** Bellingham + Stanley ADP450 Automatic Polarimeter
* **Physical Dimensions:** $300\text{ mm (W)} \times 580\text{ mm (D)} \times 220\text{ mm (H)}$
* **Target ChemMate Modules:** T2L6 (Dipole Interactions), T5L2 (Isomer Specific Rotation), T5L6 (Chirality of Carvone/Limonene), T6L2 (Eyring Racemization Kinetics), T7L11 (Asymmetric Organocatalysis).

#### A. Step-by-Step Lab Workflow
1. **Sample Tube Rinsing:** Student rinses a 100 mm stainless steel center-fill polarimeter tube with pure solvent.
2. **Zero/Blank Calibration:** Student fills the tube with pure solvent, screws on optical end-windows (ensuring zero air bubbles in the optical path), places it in the sample trough, and presses `ZERO`.
3. **Chiral Sample Preparation:** Student dissolves exactly $1.000\text{ g}$ of chiral compound (e.g. D-tartaric acid or (R)-carvone) in a $10.0\text{ mL}$ volumetric flask.
4. **Sample Loading:** Student fills the polarimeter tube with sample solution, ensuring the bubble trap absorbs any residual air.
5. **Measurement Run:** Student closes the hinged sample trough lid and initiates measurement.
6. **Optical Rotation Readout:** The instrument rotates its internal Faraday modulator / polarizing prism until optical null is detected, displaying measured rotation ($\alpha$) and specific rotation ($[\alpha]_D^{20}$).

#### B. Depicted Physical & Kinematic Elements
* `Lid_Trough`: Long hinged chamber cover providing a light-tight enclosure for polarimeter tubes up to 200 mm.
* `Tube_Polarimeter`: Stainless steel precision tube with threaded end-caps, optical glass windows, rubber gaskets, and center bubble-trap neck.
* `Optics_FaradayModulator`: Internal LED light engine (589 nm Sodium D equivalent) and rotating analyzer prism assembly.

#### C. Depicted Controls, Inputs & Electrical Interface
* Controls: 7" color touchscreen display, USB ports, barcode scanner port.

#### D. Depicted Dynamic LCD Readouts
* Live optical rotation ($\alpha$ in degrees, $0.001^\circ$ precision).
* Specific rotation ($[\alpha]$ calculated from user input concentration and pathlength).
* Peltier temperature readout ($\pm 0.1^\circ\text{C}$).

#### E. Internal Physics & State Machine
* **Biot's Law of Optical Activity:**  
  $$[\alpha]_\lambda^T = \frac{\alpha}{l \cdot c}$$  
  where $l$ is optical pathlength in decimeters ($1.0\text{ dm}$ for $100\text{ mm}$ tube) and $c$ is concentration in $\text{g/mL}$.
* **Temperature Compensation:** Computes mutarotation or thermal expansion of optical activity.

#### F. Interlocks, Error Codes & Safety
* `Low Light Transmission Alert`: Warns if solution is too turbid or optical windows are occluded.
* `Air Bubble in Path Warning`: Detects distorted beam profile from bubbles in light path.

#### G. Lab Accessories & Docking Points
* 100 mm and 50 mm stainless steel/glass polarimeter sample tubes.
* Spare optical glass windows ($D=15\text{ mm}$) and Teflon sealing rings.
* 10 mL and 25 mL Class A volumetric flasks.

---

### 17. Benchtop ATR-FTIR Spectrometer Twin (`ftir_twin`)
* **Real-World OEM Lineage:** Thermo Scientific Nicolet iS50 FTIR Spectrometer
* **Physical Dimensions:** $450\text{ mm (W)} \times 550\text{ mm (D)} \times 260\text{ mm (H)}$
* **Target ChemMate Modules:** T6L10 (FTIR Principles), T6L11 (Functional Group ID), T6L15 (Multi-Spectral Unknowns), T10L1 (Astrochemistry Matrix Isolation).

#### A. Step-by-Step Lab Workflow
1. **Purge & Background Scan:** Student cleans the diamond ATR crystal with an isopropanol wipe and presses `COLLECT BACKGROUND` ($4000\text{ to } 400\text{ cm}^{-1}$). The interferometer scans 32 times to subtract atmospheric $CO_2$ and $H_2O$ vapor.
2. **Sample Deposition:**
   * If liquid: Student pipettes one drop onto the center of the diamond crystal.
   * If solid: Student places a micro-crystal on the diamond and rotates the slip-clutch pressure tower until an audible click indicates optimal contact pressure.
3. **Sample Scan:** Student clicks `COLLECT SAMPLE`. Real-time interferogram data undergoes Fourier transformation into an infrared transmission spectrum.
4. **Peak Picking & Functional Group Identification:** Student uses peak threshold markers to label characteristic bands ($C=O$ at $1715\text{ cm}^{-1}$, $O-H$ broad at $3350\text{ cm}^{-1}$, $C-H$ stretch at $2960\text{ cm}^{-1}$).
5. **Crystal Cleaning:** Student releases the pressure clamp, wipes the diamond crystal with a Kimwipe and solvent, and confirms baseline returns to 100% transmittance.

#### B. Depicted Physical & Kinematic Elements
* `Stage_DiamondATR`: Monolithic diamond crystal bonded into a stainless steel plate.
* `Tower_PressureClamp`: Overhanging swivel clamp arm with vertical threaded spindle, anvil tip, and calibrated slip-clutch pressure knob.
* `Interferometer_Compartment`: Sealed desiccant compartment housing Michelson moving mirror assembly.

#### C. Depicted Controls, Inputs & Electrical Interface
* Controls: Dual execution buttons on instrument body (`START SCAN`, `BACKGROUND`), full workstation software control.

#### D. Depicted Dynamic LCD / Software Readouts
* Spectrum graph: Transmittance ($\%T, 0 \text{ to } 100\%$) vs Wavenumber ($\text{cm}^{-1}, 4000 \text{ to } 400\text{ cm}^{-1}$).
* Live interferogram signal display showing central burst amplitude.

#### E. Internal Physics & State Machine
* **Fourier Transform Interferometry:**  
  $$I(\delta) = \int_{-\infty}^{\infty} B(\bar{\nu}) \cos(2\pi \bar{\nu} \delta) d\bar{\nu}$$  
  where $\delta$ is optical path difference.
* **Evanescent Wave Absorption (ATR):** Penetration depth $d_p = \frac{\lambda}{2\pi n_1 \sqrt{\sin^2\theta - (n_2/n_1)^2}}$, yielding stronger absorption at lower wavenumbers.

#### F. Interlocks, Error Codes & Safety
* `Pressure Overload Alert`: Slip-clutch prevents user from cracking diamond crystal or bending anvil.
* `Desiccant Saturation Warning`: Internal humidity sensor alerts if desiccant packs need baking.

#### G. Lab Accessories & Docking Points
* Isopropanol wash bottle and lint-free cotton swabs.
* Micro-spatula.
* Polystyrene calibration standard film.

---

### 18. Benchtop 60 MHz FT-NMR Spectrometer Twin (`nmr_twin`)
* **Real-World OEM Lineage:** Nanalysis NMReady-60PRO Benchtop NMR
* **Physical Dimensions:** $300\text{ mm (W)} \times 600\text{ mm (D)} \times 300\text{ mm (H)}$
* **Target ChemMate Modules:** T6L8 (NMR Foundations), T6L9 (1H/13C Chemical Shifts), T6L15 (Multi-Spectral Unknowns), T7L11 (Asymmetric Organocatalysis), T8L3 (Suzuki Reaction), T9L3 (Host-Guest Chemistry).

#### A. Step-by-Step Lab Workflow
1. **NMR Tube Sample Preparation:** Student dissolves 15 mg of purified compound in $0.6\text{ mL}$ of deuterated solvent ($CDCl_3$ with $0.03\%\ TMS$) and transfers it to a 5 mm glass NMR tube (filling height $40\text{ mm}$).
2. **Spinner Turbine & Depth Gauge:** Student pushes the tube through a POM spinner turbine and checks insertion depth using an acrylic depth gauge.
3. **Sample Insertion:** Student drops the tube into the top bore well of the spectrometer; an internal pneumatic cushion lowers the tube gently into the magnet center.
4. **Shimming & Lock:** Instrument locks onto the deuterium signal ($^2H$) and automatically optimizes magnetic homogeneity using gradient shims.
5. **Pulse & Acquire:** Student sets parameters (e.g. 1H experiment, 16 scans, 45° pulse, 2-second relaxation delay) and presses `ACQUIRE`.
6. **Processing & Phasing:** Student applies Fourier transformation, phase correction, baseline correction, and chemical shift calibration (referencing TMS to $0.00\text{ ppm}$).
7. **Integration & Multiplicity Analysis:** Student calculates integral areas and splitting patterns ($J$-coupling doublets, triplets, multiplets) to deduce proton connectivity.

#### B. Depicted Physical & Kinematic Elements
* `Well_SampleBore`: Vertical top-access hole with pneumatic air-eject tube gripper.
* `Turbine_Spinner`: Polyoxymethylene (POM) fluted turbine collar holding the glass tube.
* `Gauge_DepthAcrylic`: Benchtop acrylic jig with stop shelf setting proper tube height.
* `Magnet_PermanentCore`: Internal temperature-stabilized neodymium-iron-boron (NdFeB) magnetic assembly ($1.4\text{ Tesla}$).

#### C. Depicted Controls, Inputs & Electrical Interface
* 10" multi-touch integrated display, rear Ethernet, USB ports.

#### D. Depicted Dynamic LCD Readouts
* Real-time Free Induction Decay (FID) oscillating decay curve ($S(t)$).
* Fully transformed 1H spectrum ($0 \text{ to } 12\text{ ppm}$) with integration curves and peak labels.

#### E. Internal Physics & State Machine
* **Larmor Precession & Chemical Shift:**  
  $$\omega_0 = \gamma B_0 (1 - \sigma) \quad \rightarrow \quad \delta = \frac{\nu_{\text{sample}} - \nu_{\text{TMS}}}{\nu_0} \times 10^6$$
* **Spin-Spin Coupling ($J$):** First-order $(n+1)$ Pascal triangle multiplet splitting.

#### F. Interlocks, Error Codes & Safety
* `Broken Tube Sensor`: Detects liquid leakage in magnet well and halts pneumatic system.
* `Magnet Temperature Thermal Drift`: Adjusts internal heating coils to hold magnet at exact $36.00^\circ\text{C}$.

#### G. Lab Accessories & Docking Points
* 5 mm precision borosilicate glass NMR tubes ($7\text{ inch}$ length).
* Deuterated solvents ($CDCl_3, D_2O, d_6\text{-DMSO}$).
* 5 mm tube depth gauge and spinner rings.

---

### 19. Benchtop Gas Chromatograph - Mass Spectrometer Twin (`gc_ms_twin`)
* **Real-World OEM Lineage:** Agilent 8890 GC / 5977B Single Quadrupole MSD
* **Physical Dimensions:** $880\text{ mm (W)} \times 650\text{ mm (D)} \times 500\text{ mm (H)}$
* **Target ChemMate Modules:** T5L13 (Bio-Ethanol GC), T6L12 (High-Resolution Exact Mass), T6L13 (Fragmentation Pathways), T6L21 (Quantitative GC-FID), T7L13 (Effluent Monitoring).

#### A. Step-by-Step Lab Workflow
1. **Autosampler / Manual Injection Loading:** Student draws $1.0\ \mu\text{L}$ of sample into a 10 µL gas-tight micro-syringe, ensuring zero bubbles.
2. **Inlet Injection:** Student pierces the heated split/splitless injection septum ($250^\circ\text{C}$); the carrier gas (Helium, $1.2\text{ mL/min}$) flash-vaporizes the liquid.
3. **Capillary Column Separation:** The capillary column (HP-5ms, $30\text{ m} \times 0.25\text{ mm} \times 0.25\ \mu\text{m}$) heats in the column oven from $50^\circ\text{C}$ to $280^\circ\text{C}$ at $15^\circ\text{C/min}$, separating compounds by boiling point and polarity.
4. **Electron Ionization (EI):** Effluent enters the vacuum source ($10^{-5}\text{ torr}$ pulled by turbo pump) where a 70 eV electron beam ionizes molecules, creating radical cations $[M]^{+\bullet}$.
5. **Quadrupole Mass Filtering:** RF and DC voltages on the 4 hyperbolic rods filter ions by mass-to-charge ratio ($m/z$).
6. **Total Ion Chromatogram (TIC):** Software displays peaks over retention time; clicking any peak displays its unique fragmentation mass spectrum.

#### B. Depicted Physical & Kinematic Elements
* `Door_Oven`: Front-opening heavily insulated oven door with internal blower fan and heating coils.
* `Tower_Autosampler`: Robotic injection turret with rotating 16-sample carousel and vertical syringe plunge needle.
* `Inlet_SplitSplitless`: Top brass heated inlet assembly with knurled septum nut.
* `Housing_MSD`: Side-car vacuum chamber housing quadrupole mass filter and electron multiplier detector.

#### C. Depicted Controls, Inputs & Electrical Interface
* Touchscreen status tablet on GC chassis, ChemStation workstation interface.

#### D. Depicted Dynamic LCD / Workstation Readouts
* Total Ion Chromatogram (TIC: Abundance vs Retention Time in minutes).
* Mass Spectrum (Relative Abundance vs $m/z, 15 \text{ to } 550\text{ Da}$).
* Oven temperature ramp graph.

#### E. Internal Physics & State Machine
* **Van Deemter Plate Theory (GC):**  
  $$H = A + \frac{B}{u} + C \cdot u$$  
  governing band broadening vs carrier flow velocity $u$.
* **70 eV EI Fragmentation Simulator:** Simulates McLafferty rearrangement, $\alpha$-cleavage, and tropylium ion formation ($m/z = 91$).

#### F. Interlocks, Error Codes & Safety
* `Carrier Gas Flow Loss`: Shuts off oven and filaments immediately if helium pressure drops, preventing column oxidation.
* `Vacuum Fault`: Tripped if turbo pump speed drops below 80%.

#### G. Lab Accessories & Docking Points
* 10 µL bevel-tip GC liquid syringes.
* $2\text{ mL}$ screw-top vials with PTFE/silicone septa.
* Helium carrier gas line and exhaust charcoal trap.

---

### 20. Benchtop Powder X-Ray Diffractometer Twin (`xrd_twin`)
* **Real-World OEM Lineage:** Malvern Panalytical Aeris Benchtop XRD
* **Physical Dimensions:** $650\text{ mm (W)} \times 600\text{ mm (D)} \times 700\text{ mm (H)}$
* **Target ChemMate Modules:** T2L2 (Periodic Radii via XRD), T6L17 (Bragg's Law Crystal Diffraction), T9L2 (Zirconia Ceramic Phase Transitions).

#### A. Step-by-Step Lab Workflow
1. **Sample Grinding & Packing:** Student grinds unknown crystal sample in an agate mortar until $< 10\ \mu\text{m}$, packs it flat into a zero-background silicon holder cavity, and scrapes the surface flush with a glass slide.
2. **Safety Enclosure Access:** Student slides the lead-acrylic radiation door open and mounts the holder onto the central rotating stage.
3. **Enclosure Interlock Closure:** Student slides the door closed until dual safety interlock switches engage.
4. **Goniometer Scan Setup:** Student selects scan range ($2\theta = 10^\circ \text{ to } 80^\circ$), step size ($0.02^\circ$), and dwell time per step ($0.5\text{ s}$).
5. **High-Voltage X-Ray Activation:** Copper X-ray tube ($Cu\ K\alpha, \lambda = 1.5406\ \text{Å}$) powers up to $40\text{ kV} / 15\text{ mA}$.
6. **Coupled $\theta\text{--}2\theta$ Motion:** The X-ray tube arm and detector arm rotate symmetrically around the spinning sample disc.
7. **Diffractogram Pattern Matching:** Diffracted X-ray photons strike the semiconductor strip detector, plotting sharp Bragg peaks for phase identification against ICDD databases.

#### B. Depicted Physical & Kinematic Elements
* `Door_RadiationLead`: Lead-lined sliding enclosure with tinted leaded acrylic viewport.
* `Goniometer_Arm_Tube`: Rotary robotic arm holding copper target X-ray tube housing.
* `Goniometer_Arm_Detector`: Symmetrical rotary arm holding PIXcel solid-state detector.
* `Stage_SampleSpinner`: Central rotating disc spinning at 60 RPM to eliminate preferred orientation.

#### C. Depicted Controls, Inputs & Electrical Interface
* External push-buttons (`X-RAY ON`, `X-RAY OFF`, `DOOR UNLOCK`), warning beacon tower (Red = X-Rays Active, Green = Standby).

#### D. Depicted Dynamic LCD / Monitor Readouts
* Real-time $2\theta$ diffractogram ($Counts \text{ vs } 2\theta^\circ$).
* Calculated $d$-spacings and Miller indices ($hkl$).

#### E. Internal Physics & State Machine
* **Bragg's Law of Diffraction:**  
  $$n\lambda = 2d_{hkl} \sin\theta$$
* **Scherrer Peak Broadening (Crystallite Size):**  
  $$\tau = \frac{K \lambda}{\beta \cos\theta}$$

#### F. Interlocks, Error Codes & Safety
* `FAIL-SAFE DUAL RADIATION INTERLOCK`: Mechanical shutter closes and high voltage cuts off instantly if enclosure door is unlatched during a run.

#### G. Lab Accessories & Docking Points
* Zero-background cut silicon sample holders.
* Agate mortar and pestle.
* Standard reference silicon calibration powder.

---

### 21. Radiation Survey Meter & GM Detection Chamber Twin (`radiation_detector_twin`)
* **Real-World OEM Lineage:** Ludlum Model 3 Survey Meter & Model 44-9 Pancake GM Probe
* **Physical Dimensions:** $165\text{ mm (W)} \times 89\text{ mm (D)} \times 216\text{ mm (H)}$
* **Target ChemMate Modules:** T1L4 (Rutherford Scattering Alpha Detection), T1L13 (Nuclear Cross-Sections), T6L16 (Ba-137m Decay Half-Life), T8L1 (Radiopharmaceuticals).

#### A. Step-by-Step Lab Workflow
1. **Battery Check & Calibration Verification:** Student toggles the multi-position selector switch to `BAT`; needle swings into the test box confirming 3V power.
2. **Background Radiation Baseline:** Student sets scale to $\times 1$ in open air; audio clicker sounds intermittently ($\approx 25\text{ counts/minute}$).
3. **Detector Positioning:** Student mounts the pancake GM probe in a lead-brick shielded counting stand.
4. **Isotope Source Placement:** Student uses tweezers to place an Americium-241 alpha, Strontium-90 beta, or Cesium-137 gamma disc source into calibrated shelf slots ($1\text{ to } 5\text{ cm}$ distance).
5. **Shielding Exploration:** Student slides absorbers (Paper, Aluminum, Lead sheets) between source and detector, observing radiation attenuation.
6. **Half-Life Decay Curve:** In $Ba-137m$ elution, student records CPM every 30 seconds for 15 minutes, plotting exponential decay ($t_{1/2} = 2.55\text{ min}$).

#### B. Depicted Physical & Kinematic Elements
* `Housing_CastAluminum`: Textured yellow powder-coated aluminum chassis with cast handle.
* `Probe_PancakeGM`: Halogen-quenched mica end-window Geiger-Müller wand protected by stainless steel screen mesh.
* `Cable_BNC_HighVoltage`: Coaxial high-voltage cable connecting probe to meter.
* `Stand_LeadShielded`: Multi-shelf vertical sample stand with slot guides for absorber plates.

#### C. Depicted Controls, Inputs & Electrical Interface
* Rotary switch: `OFF`, `BAT`, $\times 0.1$, $\times 1$, $\times 10$, $\times 100$.
* Audio toggle switch (`AUD ON/OFF`) triggering piezoelectric clicker.
* Fast/Slow meter response toggle (`F/S`), push-button meter reset.

#### D. Depicted Dynamic LCD / Meter Readouts
* Analog ruggedized meter with curved dual scale: $0 \text{ to } 5000\text{ CPM}$ and $0 \text{ to } 2.0\text{ mR/hr}$.
* Audio speaker emitting sharp clicks synchronized with ion breakdown events.

#### E. Internal Physics & State Machine
* **Poisson Radioactive Decay Law:**  
  $$N(t) = N_0 \cdot e^{-\lambda t} \quad \text{where } \lambda = \frac{\ln 2}{t_{1/2}}$$
* **Inverse Square Law & Attenuation:**  
  $$I(x) = \frac{I_0}{d^2} \cdot e^{-\mu x}$$

#### F. Interlocks, Error Codes & Safety
* `Meter Saturation Warning`: Needle pegs past full scale in extreme radiation fields (dead-time paralysis).

#### G. Lab Accessories & Docking Points
* Sealed check source disc (Americium-241, Strontium-90, Cesium-137).
* Absorber set (Cellulose card, Polyethylene, Aluminum sheet, Lead plate).
* Lead storage pig container.

---

### 22. Optical Contact Angle Goniometer & Tensiometer Twin (`contact_angle_twin`)
* **Real-World OEM Lineage:** ramé-hart Model 250 Contact Angle Goniometer
* **Physical Dimensions:** $300\text{ mm (W)} \times 650\text{ mm (D)} \times 400\text{ mm (H)}$
* **Target ChemMate Modules:** T2L18 (Du Noüy Ring Surface Tension), T9L4 (Surface Interfacial Dynamics & Sessile Drop Analysis).

#### A. Step-by-Step Lab Workflow
1. **Substrate Mounting:** Student clamps a solid sample (e.g. pristine glass slide, silanized glass, PTFE sheet) onto the 3-axis leveling stage.
2. **Optical Focus & Horizon Alignment:** Student adjusts the telecentric zoom lens and green LED backlight until the substrate baseline appears as a razor-sharp dark horizon.
3. **Micro-Droplet Dosing:** Student turns the micrometer syringe dispenser to advance a $4.0\ \mu\text{L}$ deionized water droplet at the stainless steel needle tip ($30\text{ gauge}$).
4. **Sessile Drop Deposition:** Student elevates the stage until the substrate touches the hanging drop, then lowers it, depositing a sessile drop.
5. **Contact Angle Measurement:** Software fits the Young-Laplace profile, calculating left and right contact angles ($\theta_c < 15^\circ$ for hydrophilic glass, $\theta_c = 110^\circ$ for PTFE).
6. **Du Noüy Ring Mode:** For bulk liquids, student swaps the stage for a torsion balance to measure pull-off force of a platinum-iridium ring.

#### B. Depicted Physical & Kinematic Elements
* `Stage_Leveling3Axis`: Kinematic sample platform with pitch, roll, and XYZ micrometer thumbwheels.
* `Illuminator_LED`: Collimated diffuse green backlight source eliminating glare reflections.
* `Camera_Telecentric`: High-resolution digital USB video microscope with manual focus collar.
* `Dispenser_MicrometerSyringe`: Precision micrometer screw pressing a $100\ \mu\text{L}$ Hamilton glass syringe.

#### C. Depicted Controls, Inputs & Electrical Interface
* Micrometer thumbwheels on camera rail, stage height knob, syringe dispenser lead screw.

#### D. Depicted Dynamic LCD / Video Readouts
* Real-time monochrome video feed of droplet profile with superimposed Young-Laplace tangent lines.
* Left/Right contact angle readouts ($\theta_L, \theta_R$), droplet volume ($\mu L$), base diameter ($mm$).

#### E. Internal Physics & State Machine
* **Young's Equation of Wetting:**  
  $$\gamma_{\text{SG}} = \gamma_{\text{SL}} + \gamma_{\text{LG}} \cos\theta_c$$
* **Young-Laplace Equation for Drop Curvature:**  
  $$\Delta P = \gamma\left(\frac{1}{R_1} + \frac{1}{R_2}\right)$$

#### F. Interlocks, Error Codes & Safety
* `Baseline Lost Alert`: Notifies student if camera focus or lighting glare obscures drop edge detection.

#### G. Lab Accessories & Docking Points
* Glass slides (untreated vs plasma-treated vs hydrophobic silanized).
* Micro-syringes with flat-cut blunt dispensing needles ($30\text{ gauge}$).
* Du Noüy platinum-iridium ring ($6\text{ cm}$ circumference).

---

## 3. Summary of Core Component & Kinematic Tasks for Twins

| Machine Twin | Key Kinematic Nodes | Key Interactive Controls | Dynamic LCD Features | Under-the-Hood Physics Model |
| :--- | :--- | :--- | :--- | :--- |
| **`balance_twin`** | 3 sliding glass draft shields | Tare bar, Power, Cal | 0.0001g drift, stability indicator | Load cell balance, air turbulence damping |
| **`centrifuge_twin`** | Gas-strut lid, 24-well rotor, aerosol cap | Start, Stop, Open, Rotary dials | Live RPM/RCF, countdown timer, spinning icon | RCF calculation, S-curve acceleration, phase separation |
| **`hotplate_twin`** | Ceramic plate, PT1000 probe, stir bar | Analog stir dial, heat dial, power toggle | Live RPM, plate vs liquid temp, red HOT LED | Lumped capacitance heat transfer, fluid vortex |
| **`rotovap_twin`** | Motorized vertical lift, rotating flask, condenser | Lift up/down, rotation dial, vacuum knob | Temp, vacuum setpoint, rotation RPM | Clausius-Clapeyron vapor pressure, mass transfer |
| **`spectrophotometer`** | Hinged lid, 6-place cuvette turret | Touchscreen, Blank, Measure | Absorbance, Transmittance, spectrum graph | Beer-Lambert law, detector noise, stray light |
| **`vacuum_pump_twin`** | Diaphragm heads, catchpot, gas ballast | Rocker switch, gas ballast valve knob | Mechanical vacuum dial gauge ($0\text{ to } -1\text{ bar}$) | Pumping speed decay, vapor condensation |
| **`ph_meter_twin`** | Dual-link articulated arm, glass electrode | Mode, Cal, Enter, Hold | pH (0.01 res), mV, Temp, slope percentage | Nernst equation, temperature compensation, drift |
| **`muffle_furnace`** | 4-bar parallel door, glowing chamber | Eurotherm PID controller buttons | Process Variable ($PV$), Setpoint ($SP$), blackbody glow | Stefan-Boltzmann thermal radiation, PID control |
| **`glove_box_twin`** | Antechamber doors, butyl gloves | Touchscreen PLC, vacuum/refill valves, foot pedals | $O_2$ ppm, $H_2O$ ppm, differential pressure mbar | Exponential vacuum purge, pressure control loop |
| **`high_pressure_reactor`**| Split-ring clamp, magnetic drive impeller | Needle valves, Parr 4848 controller | Analog pressure dial ($0\text{--}200\text{ bar}$), RPM, temp | Redlich-Kwong real gas, catalytic kinetics |
| **`calorimeter_twin`** | Bomb vessel, Beckmann thermometer, bucket | Ignition push-button, stirrer switch | Moving mercury scale, cooling correction graph | Energy balance $W\Delta T$, combustion enthalpy |
| **`auto_titrator_twin`**| Motorized piston burette, 3-way valve | Touchscreen, start/stop, dosing speed | Real-time titration curve ($pH \text{ vs } V$), $dpH/dV$ | Electroneutrality solver, Gran plot transformation |
| **`gas_laws_piston`** | Low-friction glass piston, micrometer screw | Clamp knob, quick-release valve | Pressure ($kPa$), Volume ($mL$), Temp ($K$), $P\text{--}V$ graph | Boyle/Charles ideal gas, Dalton vapor correction |
| **`potentiostat_twin`**| Jacketed cell, salt bridge, electrode clips | Voltage range knobs, scan rate | Current ($mA$), Potential ($V$), Cyclic Voltammogram | Nernst potential, Butler-Volmer kinetics |
| **`mel_temp_twin`** | Magnifier eyepiece, heating block, 3 slots | Ramp rate knob, temp setpoint, mark buttons | Block temp, stored $T_1\text{--}T_2$, animated melting drop | van 't Hoff melting point depression, heat lag |
| **`polarimeter_twin`** | Hinged trough lid, 100mm polarimeter tube | Zero, Measure, temp controller | Observed angle $\alpha$, specific rotation $[\alpha]$ | Biot's optical activity law, mutarotation |
| **`ftir_twin`** | Diamond ATR stage, slip-clutch clamp | Collect sample, background | Transmittance $\%T$ vs wavenumber spectrum ($4000\text{--}400$) | Fourier transform interferometry, evanescent wave |
| **`nmr_twin`** | Pneumatic bore well, spinner turbine | Touchscreen, pulse parameter fields | Free Induction Decay ($FID$), 1H spectrum ($0\text{--}12\text{ ppm}$) | Larmor precession, spin-spin coupling ($J$) |
| **`gc_ms_twin`** | Column oven, autosampler arm, MS vacuum | Split flow regulator, ChemStation HUD | Total Ion Chromatogram (TIC), mass spectrum ($m/z$) | Van Deemter plate theory, 70 eV EI fragmentation |
| **`xrd_twin`** | Lead sliding door, $\theta\text{--}2\theta$ goniometer arms | X-ray on/off, shutter toggle | Diffractogram ($Counts \text{ vs } 2\theta^\circ$), $d$-spacings | Bragg's law, Scherrer crystallite broadening |
| **`radiation_detector`**| Pancake GM probe, lead shield shelf stand | Range selector switch, audio toggle | Analog needle ($CPM, mR/hr$), synchronized clicks | Poisson radioactive decay, exponential shielding |
| **`contact_angle_twin`**| 3-axis stage, telecentric camera, syringe | Micrometer thumbwheels, dispensing screw | Young-Laplace drop profile, left/right contact angles | Young's wetting equation, Laplace capillary shape |

---

## 4. Integration Blueprint with ChemMate

When a ChemMate module launches an interactive lab:
1. **Scene Mount:** The ChemMate React component imports the relevant twin from `Twins/lab_viewer/` using the standard Three.js canvas or iframe embed.
2. **State Synchronization via EventBus:**
   * User interactions with the 3D twin (e.g. turning a knob, pressing tare, clicking a door) emit typed events via the `MachineEventBus` (e.g. `BALANCE_TARED`, `CENTRIFUGE_STARTED`, `TITRATION_STEP`).
   * ChemMate lesson step validators listen to these events to advance lab instructions, score student actions, and unlock subsequent experimental milestones.
3. **Data Logging:**
   * Values displayed on the virtual machine's LCD (e.g. mass, absorbance, pH, retention time) are piped directly into the student's virtual lab notebook.
