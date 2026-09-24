# Build log — what we built (centrifuge twin)

Chronological product notes for the MICRO 5424-R class twin.

- **How stages fit together (start here for agents):** [`PIPELINE.md`](PIPELINE.md)
- **How to repeat:** [`HOWTO_BUILD_DIGITAL_TWIN.md`](HOWTO_BUILD_DIGITAL_TWIN.md), [`STANDARD.md`](STANDARD.md)
- **Next machine checklist:** [`../standards/machine_template.md`](../standards/machine_template.md)

## Research

- OEM-class manuals (5424 / 5424 R, related service docs) under `research/manuals/`.
- Extracted text under `research/manuals_extracted/` for search.
- Dimensions, RCF formula, keypad map captured into `docs/dimensions.md` + `docs/control_spec.md`.

## CAD (offline twin; not required to run the app)

- CadQuery assemblies: enclosure, chamber, rotor, fasteners (`cad/cq/`).
- Exact screw-level STEP export + `docs/PARTS_MAP.md` + `export/parts_catalog.json`.
- Product-look meshes → optional Blender GLB for stills (`cad/assemble_product_glb.py` →
  `export/glb/centrifuge_product.glb`).
- Stage 1 Blender/catalog experiments kept as reference under `cad/_legacy/` and `export/_history/` (not runtime).

## Software / viewer (what students open)

- Pure Python controller + sample model + unit tests (`software/controller/`).
- Interactive web twin (**procedural** Three.js — no GLB load):
  - Opaque hollow cabinet, clear rear-hinged lid, circular rotor pitch, 24 tubes.
  - Control fascia: LCD canvas, rockers, function row (POWER, rpm/rcf, short, open, START/STOP, fast cool).
  - Lab room environment (floor tiles, walls, ceiling panels, benches).
  - Lab rack + materials with multi-layer separation visuals.
  - Soft SFX, explode/wireframe, lid grab, AI key-glow hooks.
  - **Continuous demo** mode: rotates sample types through full load → run → unload loops.
  - Nameplate: **SRE designs.com / LAB SYSTEMS** (reference layout, SRE not SSS).

## Packaging for relocation

- Lives under the `Twins/` parent workspace (moved out of the BlenderProc monorepo).
- `scripts/serve.sh`, `scripts/test.sh` — no external monorepo dependency for daily use.
- `AGENTS.md` + `docs/STANDARD.md` + `standards/machine_template.md` — standard for the next lab machine as a sibling
  under `Twins/`.
- Pipeline archaeology labeled; early dead-end GLB/STL binaries live under `export/_history/`.

## Explicitly _not_ part of this package

Experiments that lived in the old BlenderProc monorepo root during prototyping (not required to run the twin):

- `impressive_demo.py`, root `build_*_centrifuge.py`, `centrifuge_agents/`, `web_viewer/`, root `badge_ref.*`

Those stay outside `Twins/`; this twin does not import them.
