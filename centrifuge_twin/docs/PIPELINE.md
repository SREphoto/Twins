# Pipeline map — how this centrifuge twin was built

**Audience:** a human or agent scaffolding the next lab machine under `Twins/<name>_twin/`.

**Policy:** keep intentional pipeline stages as reference. Dead-end experiments stay under `export/_history/` and
`cad/_legacy/` so you can see what was tried and why the live path is procedural Three.js. Do not treat history as the
runtime.

---

## What shipped (the product)

| Layer                   | Path                                                          | Required to run?                     |
| ----------------------- | ------------------------------------------------------------- | ------------------------------------ |
| Interactive student app | `software/viewer/` (`app.js`, `centrifuge3d.js`, `sfx.js`, …) | **Yes**                              |
| Controller + unit tests | `software/controller/`                                        | Tests: **yes**. App runs without it. |
| Serve / test scripts    | `scripts/serve.sh`, `scripts/test.sh`                         | **Yes** for daily use                |
| Specs & process         | `docs/`, `standards/`, `AGENTS.md`                            | For the next build                   |
| Research                | `research/`                                                   | Design source of truth               |
| CAD library + exports   | `cad/`, `export/`                                             | **No** for the live app              |

```bash
# preferred: multi-machine lab desk (from Twins workspace root)
./scripts/serve.sh
# → http://127.0.0.1:8765/lab_viewer/  (choose MICRO 5424-R)

# standalone package
cd centrifuge_twin
./scripts/serve.sh    # http://127.0.0.1:8765/viewer/
./scripts/test.sh
```

The live 3D model is **procedural** (`createCentrifugeModel` in `centrifuge3d.js`). No GLB is loaded at runtime.

Lab desk shell: `Twins/lab_viewer/` (machine picker + desk switch). Registry: `lab_viewer/machines/registry.js`.

---

## Chronological stages (what it took)

### Stage 0 — Product brief + research

1. Freeze class of instrument (5424 R–class microcentrifuge).
2. Drop manuals into `research/manuals/`; extract text to `research/manuals_extracted/`.
3. Capture dimensions, RCF, keypad map → `docs/dimensions.md`, `docs/control_spec.md`.
4. BOM / part IDs → `docs/BOM.md` (then refined by CAD).

**Keep:** all of `research/`, those docs. This is how every new machine should start.

### Stage 1 — Early Blender geometry (dead end for the live app)

**Goal then:** quick 3D in Blender, export GLB for web.

| Script                              | Output (now under history)                                                                                | Lesson                                                                         |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `cad/_legacy/build_assembly.py`     | `export/_history/glb/centrifuge_assembly.glb`, group STLs, `cad/_legacy/blends/centrifuge_assembly.blend` | Primitive / exploded white-box look; hard to wire to real controls             |
| `cad/_legacy/build_from_catalog.py` | `export/_history/glb/centrifuge_exact.glb`, `…/centrifuge_exact.blend`                                    | Catalog-driven coords improved structure; still not a good interactive product |

**Keep scripts + one sample of each output** under `cad/_legacy/` and `export/_history/`.  
**Do not** use this path for a new machine’s student app.

### Stage 2 — CadQuery parts library (kept; offline twin)

Real solids, mm, chamber origin. Two intentional branches:

| Branch                             | Entry script                                                       | Outputs                                                                                                            | Purpose                                                                   |
| ---------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Exact / screw-level                | `cad/cq/exact_assembly.py`                                         | `export/step/MICRO_5424R_EXACT.step`, `export/step/parts/*.step`, `docs/PARTS_MAP.md`, `export/parts_catalog.json` | BOM fidelity, coordinates, manufacturing-style archive                    |
| Product-look meshes                | `cad/cq/build_product_look.py`                                     | `export/mesh/{body_static,rotor_spin,lid_hinge,full_assembled}.stl`, `export/step/MICRO_5424R_PRODUCT.step`        | Cleaner visual solids for stills / optional GLB                           |
| Module experiments                 | `cad/cq/enclosure.py`, `chamber.py`, `rotor.py`, `build_all_cq.py` | `A_enclosure*.step`, `C_chamber.step`, `D_rotor.step`, `MICRO_5424R_assembly.step`                                 | Incremental CQ while building the full assembly                           |
| Mesh from exact (earlier mesh try) | `cad/cq/export_assembled_meshes.py`                                | same `export/mesh/*` pattern from exact geometry                                                                   | Superseded for _looks_ by `build_product_look.py`; keep as alternate path |

**Optional product GLB (marketing / offline, not runtime):**

```text
build_product_look.py  →  export/mesh/*.stl
assemble_product_glb.py → export/glb/centrifuge_product.glb
                       → cad/centrifuge_product.blend
                       → software/viewer/models/centrifuge_assembly.glb  (hand-off copy; unused by app)
                       → export/renders/product_preview.png
```

**Keep** all Stage 2 sources and current exports. They document the offline CAD twin and how motion groups (body / rotor
/ lid) were defined.

### Stage 3 — Live twin = procedural Three.js + Python controller (what students use)

1. Spec states / interlocks in `docs/control_spec.md`.
2. Implement pure Python + tests: `software/controller/`.
3. Procedural product + lab room: `software/viewer/centrifuge3d.js`.
4. UI, demo loops, samples: `software/viewer/app.js`.
5. Soft SFX: `sfx.js`. Optional headless LCD draw: `software/lcd/draw_lcd.py` (reference; browser draws its own canvas).

**Why procedural won over GLB for the app:** keys, lid hinge, tube load/unload, explode, LCD texture, and demos need
stable named handles and cheap iteration. GLB stayed optional for CAD stills.

### Stage 4 — Portable package under `Twins/`

- Self-contained package; no BlenderProc monorepo imports.
- Standard for machine #2: `docs/STANDARD.md`, `standards/machine_template.md`.
- This file: build archaeology so you do not re-learn Stage 1 the hard way.

---

## Artifact inventory

### Active / intentional (keep)

| Path                                                                        | Role                                                                                                           |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `software/viewer/*.js,html,css`                                             | Live app                                                                                                       |
| `software/controller/`                                                      | Behavior lock + tests                                                                                          |
| `software/lcd/draw_lcd.py`                                                  | Optional offline LCD sample                                                                                    |
| `cad/cq/*.py`, `cad/cq/lib/`                                                | CadQuery source of truth                                                                                       |
| `cad/assemble_product_glb.py`                                               | Optional product GLB builder                                                                                   |
| `cad/centrifuge_product.blend`                                              | Last product Blender scene (regenerable)                                                                       |
| `export/glb/centrifuge_product.glb`                                         | Current product GLB export                                                                                     |
| `export/mesh/*.stl`                                                         | Product motion-group meshes                                                                                    |
| `export/step/MICRO_5424R_EXACT.step` + `parts/`                             | Exact library                                                                                                  |
| `export/step/MICRO_5424R_PRODUCT.step`                                      | Product solid                                                                                                  |
| `export/step/A_*.step`, `C_*.step`, `D_*.step`, `MICRO_5424R_assembly.step` | Intermediate CQ module exports from the build-up                                                               |
| `export/parts_catalog.json`                                                 | Machine-readable part instances (feeds history catalog path)                                                   |
| `export/renders/product_preview.png`, `lcd_sample.png`                      | Documented stills                                                                                              |
| `docs/*`, `standards/*`, `research/*`                                       | Spec + process + evidence                                                                                      |
| `software/viewer/models/centrifuge_assembly.glb`                            | **Copy of product GLB** staged for a GLB-based viewer that was never adopted; keep as “we tried this hand-off” |

### History / dead-end (keep labeled; do not ship as runtime)

| Path                                          | Role                                            |
| --------------------------------------------- | ----------------------------------------------- |
| `cad/_legacy/`                                | Source for early Blender assembly + catalog GLB |
| `export/_history/glb/centrifuge_assembly.glb` | Stage 1 white-box GLB                           |
| `export/_history/glb/centrifuge_exact.glb`    | Stage 1 catalog GLB                             |
| `export/_history/stl/*`                       | Stage 1 group STLs from Blender assembly        |

### Not part of this package’s story

- Old BlenderProc monorepo scripts outside `Twins/` (`impressive_demo.py`, root `web_viewer/`, etc.).
- Local envs `.venv`, `.venv-cq` (regenerate; do not treat as product).
- `__pycache__`, `.DS_Store`.

---

## How to build the _next_ machine (short)

1. Create sibling `Twins/<name>_twin/` — see `standards/machine_template.md`.
2. Copy layout from `docs/STANDARD.md` §2 (mirror this package).
3. Repeat **Stage 0** (research + control_spec + dimensions).
4. Implement **Stage 3 first** for classroom value: controller tests → procedural (or carefully structured) viewer + lab
   environment.
5. Add **Stage 2 CAD** only if you need STEP/BOM/stills.
6. Skip **Stage 1**-style GLB-as-runtime unless you have a strong reason; this package already paid that tax.
7. Pass `docs/STANDARD.md` §7 quality bar; prove `./scripts/serve.sh` from package root alone.

Deep case study narrative: `docs/HOWTO_BUILD_DIGITAL_TWIN.md`.  
What shipped checklist: `docs/BUILD_LOG.md`.  
CAD commands: `standards/build_cad.md`.

---

## Three GLBs explained (quick)

| File                                             | Stage                        | Use today                                            |
| ------------------------------------------------ | ---------------------------- | ---------------------------------------------------- |
| `export/_history/glb/centrifuge_assembly.glb`    | 1 early Blender              | Reference only                                       |
| `export/_history/glb/centrifuge_exact.glb`       | 1 catalog Blender            | Reference only                                       |
| `export/glb/centrifuge_product.glb`              | 2 product CAD                | Optional stills / offline; **not** loaded by the app |
| `software/viewer/models/centrifuge_assembly.glb` | 2→3 hand-off copy of product | Same bytes as product GLB; app does not load it      |

If disk pressure bites, regenerate Stage 2 from scripts; keep Stage 1 sources under `cad/_legacy/` even if history
binaries are dropped.
