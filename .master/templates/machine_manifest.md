# Manifest — `<name>_twin`

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

| Path                   | Role                         |
| ---------------------- | ---------------------------- |
| `docs/control_spec.md` | States, keys, interlocks     |
| `docs/dimensions.md`   | Units, origin, sizes         |
| `docs/STANDARD.md`     | Process (or link)            |
| `docs/PIPELINE.md`     | Build archaeology if present |
| `standards/`           | Build procedures + template  |

## Research

| Path                          | Role            |
| ----------------------------- | --------------- |
| `research/manuals/`           | Source PDFs     |
| `research/manuals_extracted/` | Searchable text |
| `research/sources.md`         | Citations       |

## CAD (optional)

| Path      | Role                               |
| --------- | ---------------------------------- |
| `cad/cq/` | CadQuery sources                   |
| `export/` | Generated; note `_history` if used |

## Do not treat as runtime

| Path | Notes |
| ---- | ----- |
|      |       |

## Registry

Listed in `.master/registry/machines.md` as: `<name>_twin`
