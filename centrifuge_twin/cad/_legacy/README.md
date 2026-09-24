# Legacy CAD experiments (Stage 1)

Reference only. These scripts produced early GLB/STL attempts while finding the product approach.

| Script                  | Historical outputs                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| `build_assembly.py`     | `export/_history/glb/centrifuge_assembly.glb`, `export/_history/stl/*`, `blends/centrifuge_assembly.blend`      |
| `build_from_catalog.py` | `export/_history/glb/centrifuge_exact.glb`, `blends/centrifuge_exact.blend` (needs `export/parts_catalog.json`) |

**Do not** use these for the live student app or as the template path for machine #2.

**What won instead:**

1. Offline CAD: `cad/cq/build_product_look.py` + `exact_assembly.py` (+ optional `assemble_product_glb.py`).
2. Live app: procedural Three.js in `software/viewer/centrifuge3d.js`.

Full narrative: `docs/PIPELINE.md`.
