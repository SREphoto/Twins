# CAD

Units: **mm**. World origin: chamber axis `(X,Y)=(0,0)`, chamber floor `Z=0`, `+Z` up.

Offline twin only. The live student app does **not** require rebuilding CAD.

## Layout

```
cad/
  cq/                     # CadQuery source (real geometry)
    build_product_look.py # product mesh (body / rotor / lid)
    exact_assembly.py     # full screw-level STEP + PARTS_MAP
    export_assembled_meshes.py  # earlier mesh export from exact (kept for reference)
    rotor.py / enclosure.py / chamber.py / build_all_cq.py
    lib/fasteners.py
  assemble_product_glb.py # Blender: mesh STLs → product GLB
  library/fasteners/      # optional FreeCAD fastener script
  centrifuge_product.blend
  _legacy/                # Stage 1 experiments (see README there)
```

Outputs: `export/` (see `export/README.md` and `docs/PIPELINE.md`).

## Usual commands

```bash
cd centrifuge_twin

# 1) Product-looking solids (CadQuery)
.venv-cq/bin/python cad/cq/build_product_look.py

# 2) Screw-level exact STEP + docs/PARTS_MAP.md
.venv-cq/bin/python cad/cq/exact_assembly.py

# 3) Optional product GLB (stills / offline — not loaded by the live viewer)
"/Applications/Blender.app/Contents/MacOS/Blender" --background --python cad/assemble_product_glb.py
# → export/glb/centrifuge_product.glb
# → software/viewer/models/centrifuge_assembly.glb (historical hand-off copy)
```

## Naming

BOM IDs from `docs/BOM.md`, e.g. `A01_MainUpperHousing`, `D05_Microtube_03`.
