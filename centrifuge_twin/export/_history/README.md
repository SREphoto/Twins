# Export history (dead-end / early pipeline)

These binaries came from **Stage 1** experiments while finding the product shape. They are **not** used by the live
viewer.

| Path                          | From                                | Notes                                          |
| ----------------------------- | ----------------------------------- | ---------------------------------------------- |
| `glb/centrifuge_assembly.glb` | `cad/_legacy/build_assembly.py`     | Early Blender primitives; poor product look    |
| `glb/centrifuge_exact.glb`    | `cad/_legacy/build_from_catalog.py` | Catalog coords; still not the interactive path |
| `stl/*`                       | same assembly script                | Per-group STLs from that era                   |

**Current** optional product GLB lives at `export/glb/centrifuge_product.glb` (from `cad/assemble_product_glb.py`).

Full story: `docs/PIPELINE.md`.
