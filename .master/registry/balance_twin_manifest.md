# Manifest — `balance_twin`

Gold standard. Paths relative to `balance_twin/` unless noted.

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
| `research/manuals/`           | Source PDFs (Mettler Toledo XSE204)    |
| `research/manuals_extracted/` | Searchable text extracts               |
| `research/sources.md`         | Citations & references                 |

## Key Features

- **Procedural 3D Model (`balance3d.js`)**: Die-cast aluminum chassis, 3 independent sliding glass draft shields (left, right, top), SmartGrid perforated stainless steel floor, mirror-polished weighing pan (Ø 80 mm) on spider support, cylindrical draft ring (Ø 90 mm), internal EMFR force restoration voice coil, permanent magnet, optical null detector, motorized calibration weight (100g Class E2), front spirit bubble level, rear connectivity panel (IEC inlet, DB9 RS-232, dual USB ports, Kensington slot).
- **Physical Simulation (`app.js`)**: EMFR settling response curve, real-time air draft turbulence when doors are open, stability detection circle `(*)`, tare/zero logic, automated proFACT motorized internal calibration.
- **Workflow & Soundscape (`sfx.js`)**: Glass weigh boats, stainless micro-spatula, crystalline sample piles (NaCl, CuSO4, Aspirin), 100g test weight, GLP compliance print log.
