# Manifest — `vacuum_pump_twin`

Important files for this package. Paths relative to package root unless noted.

## Runtime (must keep)

| Path                   | Role                  |
| ---------------------- | --------------------- |
| `software/viewer/`     | Live student app      |
| `software/controller/` | State machine + tests |
| `scripts/serve.sh`     | Serve viewer          |
| `scripts/test.sh`      | Unit tests            |
| `README.md`            | Human quick start     |
| `AGENTS.md`            | Package agent rules   |

## Specs & process

| Path                          | Role                                                                       |
| ----------------------------- | -------------------------------------------------------------------------- |
| `docs/control_spec.md`        | States, keys, interlocks                                                   |
| `docs/dimensions.md`          | Units, origin, sizes                                                       |
| `docs/BOM.md`                 | Bill of Materials                                                          |
| `docs/PART_SPECIFICATIONS.md` | Detailed part specifications (washers, screws, bolts, shims, spring rates) |
| `docs/STANDARD.md`            | Process (or link)                                                          |
| `docs/PIPELINE.md`            | Build archaeology if present                                               |
| `standards/`                  | Build procedures + template                                                |

## Research

| Path                            | Role                            |
| ------------------------------- | ------------------------------- |
| `research/manuals/`             | Source PDFs                     |
| `research/manuals_extracted/`   | Searchable text                 |
| `research/sources.md`           | Citations                       |
| `research/96_Vacuum_Pump.md`    | Technical Reference             |
| `research/maintenance_guide.md` | Service & troubleshooting guide |
| `research/schematics.md`        | Pneumatic & wiring schematics   |

## CAD (optional)

| Path                             | Role                               |
| -------------------------------- | ---------------------------------- |
| `cad/create_vacuum_pump_gold.py` | CadQuery modeling source           |
| `export/`                        | Generated; note `_history` if used |

## Do not treat as runtime

| Path                                     | Notes                                                        |
| ---------------------------------------- | ------------------------------------------------------------ |
| `software/viewer/models/vacuum_pump.glb` | Stage 0 reference GLB model (will be moved to `export/glb/`) |

## Registry

Listed in `.master/registry/machines.md` as: `vacuum_pump_twin`
