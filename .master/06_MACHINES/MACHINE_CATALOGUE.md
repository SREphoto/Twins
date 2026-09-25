# Twins Master Machine Catalogue

This document catalogs all 13 machine digital twins currently engineered or scheduled within the `Twins` repository.

---

## 🔬 Machine Twin Status & Specifications

| Machine Twin | Package Path | Real-World OEM Lineage | Enclosing Box ($W \times D \times H$ mm) | Maturity Status | Kinematic Rig / Dynamic Surface |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Centrifuge** | `centrifuge_twin/` | Thermo Scientific Sorvall Legend X1 | $380 \times 440 \times 320$ | **Gold Standard (Shipped)** | Rotary rotor, hinged latching door, dynamic RPM/g-force LCD |
| **Analytical Balance** | `balance_twin/` | Mettler Toledo XPE205 | $263 \times 487 \times 322$ | **Ready** | Sliding borosilicate glass draft shield, 0.0001g dynamic LCD |
| **Hotplate Stirrer** | `hotplate_twin/` | IKA C-MAG HS 7 | $220 \times 330 \times 105$ | **Ready** | Dual rotary potentiometers, ceramic heating plate thermal glow |
| **Rotary Evaporator** | `rotovap_twin/` | Heidolph Hei-VAP Precision | $430 \times 395 \times 645$ | **Ready** | Motorized vertical lift column, spinning flask, helical condenser |
| **Spectrophotometer** | `spectrophotometer_twin/`| Thermo Scientific Genesys 50 | $385 \times 395 \times 200$ | **Ready** | Hinged cuvette compartment lid, touchscreen wavelength display |
| **Vacuum Pump** | `vacuum_pump_twin/` | Vacuubrand MD 4C NT | $243 \times 325 \times 198$ | **Ready** | Diaphragm casing, mechanical vacuum dial gauge, power rocker |
| **Glove Box** | `glove_box_twin/` | Inert Corp I-Box | $1200 \times 750 \times 900$| **Scaffolded** | Hermetic acrylic front window, butyl glove ports, antechamber |
| **Muffle Furnace** | `muffle_furnace_twin/` | Carbolite Gero CWF 1100 | $375 \times 485 \times 585$ | **Scaffolded** | Parallel action counter-balanced door, digital PID temperature display |
| **pH Meter** | `ph_meter_twin/` | Oakton pH 700 Benchtop | $155 \times 175 \times 69$ | **Scaffolded** | Articulated electrode stand, glass bulb sensor, pH/mV display |
| **Ultrasonic Cleaner** | `ultrasonic_cleaner_twin/` | Branson CPX Series | $251 \times 136 \times 187$| **Scaffolded** | Stainless steel bath chamber, cavitation agitation state, digital timer |
| **Vortex Mixer** | `vortex_mixer_twin/` | Scientific Industries Vortex-Genie 2 Digital | $122 \times 165 \times 165$| **Ready** | Eccentric orbital rubber cup, dynamic Canvas LCD, countdown timer, forced-vortex meniscus |
| **High Pressure Reactor**| `high_pressure_reactor_twin/`| Parr 4560 Mini Reactor | $250 \times 300 \times 600$| **Scaffolded** | Split-ring closure, magnetic drive stirrer, pressure transducer |
| **Shared Lab Desk** | `lab_viewer/` | ChemMate Standard Lab Bench | $2400 \times 900 \times 900$ | **Active** | Shared tabletop surface ($Y=9.0$), OrbitControls, machine switcher |

---

_Managed under OGA-CAD Master Governance._
