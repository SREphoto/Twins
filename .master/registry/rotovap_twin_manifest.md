# Manifest — `rotovap_twin`

Gold standard. Paths relative to `rotovap_twin/` unless noted.

## Runtime (must keep)

| Path                   | Role                                   |
| ---------------------- | -------------------------------------- |
| `software/viewer/`     | Live student app (procedural Three.js) |
| `software/controller/` | State machine + tests                  |
| `scripts/serve.sh`     | Serve viewer                           |
| `scripts/test.sh`      | Unit tests                             |
| `README.md`            | Human quick start                      |

## Specs & Process

| Path                   | Role                                   |
| ---------------------- | -------------------------------------- |
| `docs/control_spec.md` | States, keys, interlocks               |
| `docs/dimensions.md`   | Units, origin, sizes                   |
| `docs/BOM.md`          | Parts map & specifications             |

## Research

| Path                          | Role                                   |
| ----------------------------- | -------------------------------------- |
| `research/manuals/`           | Source PDFs (Büchi Rotavapor R-300)    |
| `research/sources.md`         | Citations & references                 |

## Key Features

- **Procedural 3D Model (`rotovap3d.js`)**: Cast aluminum base with leveling screws, vertical lift tower with stainless steel Acme lead screw and guide rails, linear carriage, 45° angled drive unit with hollow drive shaft, Combi-Clip quick release, borosilicate vapor duct (NS 29/32), PTFE composite vacuum seal, B-300 heating bath with PTFE coating and PT1000 probe, 1000 mL pear-shaped evaporating flask with liquid vortex, vertical double-spiral condenser (1500 cm²) with GL-14 nozzles, 1000 mL spherical receiving flask with S 35/20 ball joint clamp, falling condensate droplets, I-300 Pro controller with CanvasTexture display.
- **Physical Simulation (`app.js`)**: Antoine / Clausius-Clapeyron solvent vapor equilibrium database (Ethanol, Acetone, Methanol, Ethyl Acetate, Water), dynamic boiling point calculator, condensation rate calculation based on $\Delta T$, rotation RPM, and vacuum, volume transfer between flasks.
- **Workflow & Soundscape (`sfx.js`)**: Motorized lift actuator hum, rotation motor sound proportional to RPM, vacuum aeration stopcock hiss, water bath bubbling, and distillate drip ping sounds.
