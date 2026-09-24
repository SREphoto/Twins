# Build CAD (MICRO 5424-R twin)

Optional path. The live student app does not need CAD rebuilds.

## Stack

| Tool                            | Role                                   |
| ------------------------------- | -------------------------------------- |
| CadQuery (Python **3.12** venv) | Solids → STEP / STL                    |
| Blender 4.x headless            | Optional product GLB for web/marketing |

## Setup

Run from the twin package root (under the `Twins/` workspace):

```bash
cd <package_root>   # e.g. Twins/centrifuge_twin/
python3.12 -m venv .venv-cq
source .venv-cq/bin/activate
pip install -r requirements-cq.txt
```

All CAD paths below are relative to that package root. Do not reach into a BlenderProc monorepo or sibling twins for
geometry.

## Commands

```bash
# Product-looking assembled meshes (body / rotor / lid)
.venv-cq/bin/python cad/cq/build_product_look.py
# → export/mesh/*.stl
# → export/step/MICRO_5424R_PRODUCT.step

# Screw-level exact assembly
.venv-cq/bin/python cad/cq/exact_assembly.py
# → export/step/MICRO_5424R_EXACT.step
# → export/step/parts/<PartID>.step
# → docs/PARTS_MAP.md
# → export/parts_catalog.json

# Optional product GLB (stills / offline — live viewer does not load GLB)
Blender --background --python cad/assemble_product_glb.py
# → export/glb/centrifuge_product.glb
# → software/viewer/models/centrifuge_assembly.glb  (historical hand-off copy)
```

## Origin

Chamber axis `(X,Y)=(0,0)`, chamber floor `Z=0`, mm, `+Z` up. Details in `docs/dimensions.md`.

## History

Stage 1 Blender/catalog experiments: `cad/_legacy/` + `export/_history/`. Full map: `docs/PIPELINE.md`.
