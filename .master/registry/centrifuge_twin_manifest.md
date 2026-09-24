# Manifest — `centrifuge_twin`

Gold sample. Paths relative to `centrifuge_twin/` unless noted.

## Runtime (must keep)

| Path                   | Role                                   |
| ---------------------- | -------------------------------------- |
| `software/viewer/`     | Live student app (procedural Three.js) |
| `software/controller/` | State machine + tests                  |
| `scripts/serve.sh`     | Serve viewer                           |
| `scripts/test.sh`      | Unit tests                             |
| `README.md`            | Human quick start                      |
| `AGENTS.md`            | Package agent rules                    |

## Specs & process

| Path                               | Role                                |
| ---------------------------------- | ----------------------------------- |
| `docs/PIPELINE.md`                 | Build stages + artifact archaeology |
| `docs/STANDARD.md`                 | Normative twin standard             |
| `docs/control_spec.md`             | States, keys, interlocks            |
| `docs/dimensions.md`               | Units, origin, sizes                |
| `docs/ARCHITECTURE.md`             | Runtime layout                      |
| `docs/BUILD_LOG.md`                | What shipped                        |
| `docs/HOWTO_BUILD_DIGITAL_TWIN.md` | Case study                          |
| `docs/BOM.md`, `PARTS_MAP.md`      | Parts                               |
| `standards/*`                      | Build procedures + machine_template |

## Research

| Path                                      | Role                |
| ----------------------------------------- | ------------------- |
| `research/manuals/`                       | Source PDFs         |
| `research/manuals_extracted/`             | Searchable text     |
| `research/sources.md`                     | Citations           |
| `research/photos/sre_badge_reference.png` | Nameplate reference |

## CAD (optional offline)

| Path                                | Role                                 |
| ----------------------------------- | ------------------------------------ |
| `cad/cq/`                           | CadQuery sources                     |
| `cad/assemble_product_glb.py`       | Product GLB builder                  |
| `export/glb/centrifuge_product.glb` | Current product GLB                  |
| `export/mesh/`                      | Product motion meshes                |
| `export/step/`                      | Exact + product STEP                 |
| `export/parts_catalog.json`         | Instance catalog                     |
| `export/_history/`                  | Stage 1 dead-end GLB/STL (reference) |
| `cad/_legacy/`                      | Stage 1 scripts + blends             |

## Do not treat as runtime

| Path                           | Notes                                      |
| ------------------------------ | ------------------------------------------ |
| `software/viewer/models/*.glb` | Historical hand-off; app does not load GLB |
| `export/_history/`             | Dead ends                                  |
| `.venv`, `.venv-cq`            | Local envs                                 |

## Workspace process

See `Twins/.master/` for multi-machine governance.
