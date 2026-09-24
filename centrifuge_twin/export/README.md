# Export artifacts

Generated files only. Source of truth is `cad/` (and for the live app, `software/viewer/`).

| Path                                                                 | Pipeline stage            | Runtime?               |
| -------------------------------------------------------------------- | ------------------------- | ---------------------- |
| `glb/centrifuge_product.glb`                                         | Product CAD → Blender     | No (optional stills)   |
| `mesh/*.stl`                                                         | Product-look CadQuery     | No (feeds product GLB) |
| `step/MICRO_5424R_EXACT.step` + `parts/`                             | Exact screw-level         | No (parts library)     |
| `step/MICRO_5424R_PRODUCT.step`                                      | Product solid             | No                     |
| `step/A_*.step`, `C_*.step`, `D_*.step`, `MICRO_5424R_assembly.step` | Intermediate CQ modules   | No                     |
| `parts_catalog.json`                                                 | Exact assembly catalog    | No                     |
| `renders/`                                                           | Documented stills         | No                     |
| `_history/`                                                          | Early GLB/STL experiments | No — reference only    |

See `docs/PIPELINE.md` for how these fit the build story.
