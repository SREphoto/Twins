# MICRO 5424-R · Centrifuge digital twin

Portable training twin of a refrigerated benchtop microcentrifuge (Eppendorf 5424 R _class_).

## Lab desk (preferred)

From the **Twins workspace root** (the folder that contains `lab_viewer/` and `centrifuge_twin/`):

```bash
./scripts/serve.sh
```

Open **http://127.0.0.1:8765/lab_viewer/** and choose **MICRO 5424-R**.  
That is the multi-machine lab desk (machine picker + desk switch). See `lab_viewer/README.md`.

## Standalone (this package only)

**This folder is self-contained.** You can move it to any parent and it still runs:

```bash
cd centrifuge_twin          # only if you are not already inside it
./scripts/serve.sh          # http://127.0.0.1:8765/viewer/
./scripts/test.sh           # controller unit tests
```

No BlenderProc install is required for the student app.

---

## What you get

| Layer                          | Location               | Purpose                                                         |
| ------------------------------ | ---------------------- | --------------------------------------------------------------- |
| Interactive twin               | `software/viewer/`     | Three.js lab, instrument, keypad, LCD, samples, continuous demo |
| Controller                     | `software/controller/` | Pure Python state machine + tests                               |
| CAD (optional)                 | `cad/cq/`              | CadQuery STEP/STL; optional Blender GLB                         |
| Research                       | `research/`            | Manuals + sources                                               |
| **Standard for next machines** | `docs/STANDARD.md`     | How to build the next lab instrument twin                       |

---

## Quick start (viewer)

```bash
./scripts/serve.sh
# open http://127.0.0.1:8765/viewer/
```

| Control                         | Action                                             |
| ------------------------------- | -------------------------------------------------- |
| **start/stop**                  | Start run (lid closed) or brake                    |
| **open**                        | Unlock/open lid when stopped                       |
| **short** (hold)                | Momentary spin                                     |
| **rpm/rcf**                     | Toggle display mode                                |
| **speed / time / temp ▲▼**      | Set parameters (hold to ramp)                      |
| **Continuous demo**             | Full load → run → unload loops across sample types |
| Lab: load pair / unload / remix | Sample handling                                    |

Shortcuts: `Space` start/stop · `O` open · `C` close lid · hold `S` short

3D: orbit / zoom · grab lid · click rack tube to load · explode / wireframe toolbar.

---

## Layout

```text
centrifuge_twin/
  AGENTS.md                 # rules for AI agents
  README.md                 # this file
  scripts/serve.sh  test.sh
  software/viewer/          # ★ live app
  software/controller/      # Python + tests
  docs/STANDARD.md          # gold standard for all lab twins
  docs/ARCHITECTURE.md
  docs/BUILD_LOG.md         # what we built
  docs/HOWTO_BUILD_DIGITAL_TWIN.md
  docs/control_spec.md  dimensions.md  BOM.md  …
  standards/                # build procedures + machine_template
  cad/cq/                   # optional CadQuery
  export/                   # generated STEP/mesh/GLB/renders
  research/
```

---

## Design choices

| Choice   | Value                                      |
| -------- | ------------------------------------------ |
| Form     | 5424 R class refrigerated microcentrifuge  |
| Live 3D  | Procedural Three.js (not GLB-dependent)    |
| Controls | Keypad + digital LCD + lab rack            |
| CAD      | CadQuery → STEP/STL → optional Blender GLB |
| Scale    | CAD mm 1:1 · viewer units ≈ 100 mm         |
| Branding | `MICRO 5424-R` + SRE nameplate             |

---

## CAD rebuild (optional)

Python **3.12** recommended for CadQuery:

```bash
python3.12 -m venv .venv-cq
source .venv-cq/bin/activate
pip install -r requirements-cq.txt

.venv-cq/bin/python cad/cq/build_product_look.py
.venv-cq/bin/python cad/cq/exact_assembly.py
# optional GLB:
# Blender --background --python cad/assemble_product_glb.py
```

See `standards/build_cad.md`.

---

## Documentation map

| Doc                                                                  | Use                                                     |
| -------------------------------------------------------------------- | ------------------------------------------------------- |
| [docs/PIPELINE.md](docs/PIPELINE.md)                                 | **Build stages + artifact map** (start here for agents) |
| [docs/STANDARD.md](docs/STANDARD.md)                                 | How to build any lab machine twin                       |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)                         | Runtime + data flow                                     |
| [docs/BUILD_LOG.md](docs/BUILD_LOG.md)                               | What was delivered in this project                      |
| [docs/HOWTO_BUILD_DIGITAL_TWIN.md](docs/HOWTO_BUILD_DIGITAL_TWIN.md) | Deep case study                                         |
| [docs/control_spec.md](docs/control_spec.md)                         | Keys, states, interlocks                                |
| [standards/machine_template.md](standards/machine_template.md)       | Checklist for machine #2                                |
| [AGENTS.md](AGENTS.md)                                               | Rules for coding agents                                 |

---

## Relocating this package

This package already lives under `Twins/`. To copy it elsewhere:

```bash
cp -R centrifuge_twin /path/to/Twins/centrifuge_twin
cd /path/to/Twins/centrifuge_twin
./scripts/serve.sh
./scripts/test.sh
```

New instruments go beside this folder as `Twins/<name>_twin/` — see `docs/STANDARD.md` and
`standards/machine_template.md`.

Agent skill for this workflow: `.agents/skills/lab-digital-twin/` (inside this package).

---

## License / branding

Use generic labels (`MICRO 5424-R`) unless you have rights to OEM marks. SRE nameplate is intentional product branding
for this twin.
