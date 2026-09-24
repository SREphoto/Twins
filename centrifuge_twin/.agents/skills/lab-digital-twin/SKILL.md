---
name: lab-digital-twin
description:
  Build and maintain portable chemistry-lab instrument digital twins (centrifuge first). Use when working on this
  package, lab twins, instrument viewers, control specs, CadQuery lab CAD, continuous demo mode, or scaffolding a new
  lab machine twin.
---

# Lab digital twin skill

## Package root

This skill ships **inside** the relocatable twin package (`.agents/skills/lab-digital-twin/`).

Home layout: twins are siblings under the **`Twins/`** parent (not inside BlenderProc):

```text
Twins/
  .master/             # session SOP, agents, logs (AGENT_SOP.md)
  lab_viewer/          # master lab desk + machine picker
  scripts/serve.sh     # serve → /lab_viewer/
  centrifuge_twin/     # this package
  <name>_twin/         # next instrument
```

Workspace session procedure: `Twins/.master/AGENT_SOP.md` (every agent session).

**Lab desk:** from Twins root, `./scripts/serve.sh` → `http://127.0.0.1:8765/lab_viewer/`.  
Register new machines in `lab_viewer/machines/registry.js`.

Standards of truth (paths relative to package root):

- `docs/PIPELINE.md` — how this centrifuge was built (stages, artifacts, dead ends)
- `docs/STANDARD.md` — how to build **any** lab machine twin
- `AGENTS.md` — agent rules
- `docs/ARCHITECTURE.md` — runtime layout
- `standards/machine_template.md` — checklist for machine #2+

## What is in scope

| Path                               | Role                         |
| ---------------------------------- | ---------------------------- |
| `software/viewer/`                 | Live Three.js student app    |
| `software/controller/`             | Python state machine + tests |
| `cad/cq/`                          | Optional CadQuery            |
| `docs/` + `standards/`             | Specs and process            |
| `.agents/skills/lab-digital-twin/` | This skill                   |

## Out of scope

Old BlenderProc monorepo experiments (`impressive_demo.py`, root `build_*_centrifuge.py`, etc.) unless the user
explicitly asks.

## Daily commands

```bash
# from Twins root — multi-machine lab desk
./scripts/serve.sh          # http://127.0.0.1:8765/lab_viewer/

# from package root — this twin alone
./scripts/serve.sh          # http://127.0.0.1:8765/viewer/
./scripts/test.sh
```

After viewer edits: bump `?v=` cache busters; hard-refresh the browser.

## Conventions (do not break)

1. Package stays **self-contained** — no required imports from `Twins/` parent or siblings.
2. Live 3D is **procedural** `centrifuge3d.js`, not GLB-only.
3. Nameplate letters are **S R E** (not SSS).
4. Lid hinge rear (+Z); front of machine −Z; Y-up.
5. Tube access only when lid open and rotor stopped.
6. Match Python controller semantics when changing JS run logic.
7. New machines: sibling under `Twins/`; follow `docs/STANDARD.md` + `standards/machine_template.md`.

## Adding a new instrument

1. Create `Twins/<name>_twin/` (sibling of `centrifuge_twin/`) using STANDARD §2 layout.
2. Fill product brief from `standards/machine_template.md`.
3. Spec controls → Python tests → viewer.
4. Lab environment in-scene.
5. Optional CAD library.
6. Pass STANDARD §7 quality bar.
7. Ensure `./scripts/serve.sh` works after moving the folder.
8. Register in `lab_viewer/machines/registry.js` and smoke `/lab_viewer/`.

## Cleanup policy

Do not commit: `__pycache__`, `.venv`, `.venv-cq`, screenshot spam, experimental badge crops under `export/renders/`.
Prefer documented exports only (`product_preview.png`, `lcd_sample.png`).
