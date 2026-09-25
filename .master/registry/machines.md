# Registered machines

| Package                      | Status | Gold? | Manifest                                                                         | Notes                                                                                       |
| ---------------------------- | ------ | ----- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `centrifuge_twin`            | active | yes   | [centrifuge_twin_manifest.md](centrifuge_twin_manifest.md)                       | MICRO 5424-R; lab_viewer id `centrifuge`                                                    |
| `ultrasonic_cleaner_twin`    | active | no    | [ultrasonic_cleaner_twin_manifest.md](ultrasonic_cleaner_twin_manifest.md)       | Ultrasonic cleaning bath with cavitation & degas; lab_viewer id `ultrasonic_cleaner`        |
| `high_pressure_reactor_twin` | active | no    | [high_pressure_reactor_twin_manifest.md](high_pressure_reactor_twin_manifest.md) | Parr 4560 600 mL 200-bar reactor with magnetic drive; lab_viewer id `high_pressure_reactor` |
| `muffle_furnace_twin`        | active | no    | [muffle_furnace_twin_manifest.md](muffle_furnace_twin_manifest.md)               | 9L 1200°C ceramic fibre furnace with MoSi2 rods; lab_viewer id `muffle_furnace`             |
| `ph_meter_twin`              | active | no    | [ph_meter_twin_manifest.md](ph_meter_twin_manifest.md)                           | Benchtop dual pH/mV meter with ATC & 3-point calibration; lab_viewer id `ph_meter`          |
| `rotovap_twin`               | active | yes   | [rotovap_twin_manifest.md](rotovap_twin_manifest.md)                             | Rotary evaporator with motorized lift, bath & Clausius-Clapeyron physics; lab_viewer id `rotovap` |
| `glove_box_twin`             | active | no    | [glove_box_twin_manifest.md](glove_box_twin_manifest.md)                         | Inert atmosphere glove box with vacuum lock; lab_viewer id `glove_box`                      |
| `balance_twin`               | active | yes   | [balance_twin_manifest.md](balance_twin_manifest.md)                             | 0.1 mg precision analytical balance with EMFR cell & draft doors; lab_viewer id `balance`   |
| `vacuum_pump_twin`           | active | yes   | [vacuum_pump_twin_manifest.md](vacuum_pump_twin_manifest.md)                     | Diaphragm vacuum pump with dual heads & gas ballast; lab_viewer id `vacuum_pump`            |
| `vortex_mixer_twin`          | active | yes   | [vortex_mixer_twin_manifest.md](vortex_mixer_twin_manifest.md)                   | Digital precision vortex mixer with tachometer, timer, pulse & forced vortex; lab_viewer id `vortex_mixer` |
| `hotplate_twin`              | active | yes   | [hotplate_twin_manifest.md](hotplate_twin_manifest.md)                             | Precision digital magnetic hotplate stirrer with PT1000 ATC; lab_viewer id `hotplate`      |
| `spectrophotometer_twin`     | active | yes   | [spectrophotometer_twin_manifest.md](spectrophotometer_twin_manifest.md)         | Dual-beam UV-Vis spectrophotometer with Czerny-Turner optics & 6-cell carousel; lab_viewer id `spectrophotometer` |
| `lab_viewer`                 | active | —     | (workspace shell)                                                                | Multi-machine desk under `Twins/lab_viewer/`                                                |

## How to add

1. Create `Twins/<name>_twin/` per `HOW_TO_BUILD_A_MACHINE.md`.
2. Add `registry/<name>_twin_manifest.md` from `templates/machine_manifest.md`.
3. Add a row here.
4. Register in `lab_viewer/machines/registry.js` for the desk picker.
5. Log the registration in `logs/master_change_log.md`.
