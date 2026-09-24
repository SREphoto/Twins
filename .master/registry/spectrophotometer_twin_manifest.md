# Manifest — `spectrophotometer_twin`

Gold standard. Paths relative to `spectrophotometer_twin/` unless noted.

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
| `docs/PRODUCT_BRIEF.md`| Product brief & educational objectives |
| `docs/control_spec.md` | States, keys, interlocks, optics math  |
| `docs/dimensions.md`   | Units, origin, sizes                   |
| `docs/BOM.md`          | Parts map & specifications             |
| `docs/STANDARD.md`     | Normative twin standard                |
| `AGENTS.md`            | Package agent rules                    |

## Research

| Path                          | Role                                   |
| ----------------------------- | -------------------------------------- |
| `research/sources.md`         | Citations & references                 |

## Key Features

- **Procedural 3D Model (`spectrophotometer3d.js`)**: Die-cast aluminum/polymer unibody chassis, recessed display bezel with dynamic CanvasTexture LCD (`flipY = false`), physical tactile buttons (`Btn_Power`, `Btn_Zero`, `Btn_Scan`, `Btn_Mode`, `Btn_CellNext`, `Btn_Lid`), spring-hinged sample chamber lid (`Pivot_ChamberLid`) with perimeter gasket, 6-position motorized cuvette carousel (`Pivot_CellCarousel`), genuine optical cuvettes (`Glass_Cuvette_01` to `06`) with borosilicate/quartz refraction ($IOR = 1.52$) containing chemical solutions, internal optics bay with Deuterium UV lamp, Tungsten-Halogen lamp, Czerny-Turner monochromator, dynamic monochromatic probe beam whose emissive color matches the active wavelength $\lambda$, and silicon photodiode detector.
- **Genuine 3D Fasteners & Connectors**: DIN 912 hex socket screws, DIN 125 washers, vulcanized rubber leveling feet, IEC C14 inlet, rocker switch, USB ports, DB9 RS-232 serial port, and BNC external trigger.
- **Physical Simulation & Metrology**: Deterministic Beer-Lambert law ($A = \varepsilon b c$) and transmittance calculations, continuous spectrum scan sweep (190–1100 nm), automated baseline blank zeroing, lamp switchover at 340 nm, and safety interlock shutter when the chamber door is open.
- **Workflow & Soundscape (`sfx.js`)**: Stepper motor drive sound, solenoid shutter clicks, lid latch sound, zeroing calibration chime, and GLP compliance report output.
