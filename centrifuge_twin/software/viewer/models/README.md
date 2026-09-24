# Viewer models (historical hand-off)

`centrifuge_assembly.glb` is a copy of the **product** GLB from `cad/assemble_product_glb.py` (same content as
`export/glb/centrifuge_product.glb`).

It was staged here when we still considered loading a GLB in the web app. The **live** twin does **not** load this file;
geometry is procedural in `centrifuge3d.js`.

Kept so a later agent can see the intended CAD → viewer hand-off and why it was abandoned for interaction work.

See `docs/PIPELINE.md`.
