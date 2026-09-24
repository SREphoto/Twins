# Agent rules — lab instrument digital twin package

This folder is a **portable product package** under the `Twins/` workspace. It must keep working if moved to any other
parent.

Workspace governance (all twins): `Twins/.master/` — start with `AGENT_SOP.md`; end-of-work detail in `AGENTS_MANDATE.md`.

**Lab desk:** `Twins/lab_viewer/` — multi-machine picker. Serve from Twins root: `./scripts/serve.sh` → `/lab_viewer/`.  
This package is registered as machine id `centrifuge` in `lab_viewer/machines/registry.js`.

## Scope

| In scope                                                                   | Out of scope                                                                              |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `centrifuge_twin/` (this package)                                          | Old BlenderProc monorepo demos (`impressive_demo.py`, root `build_*_centrifuge.py`, etc.) |
| Sibling twins under `Twins/<name>_twin/` when scaffolding the next machine | Editing unrelated apps outside `Twins/` unless asked                                      |
| Lab desk registration via `lab_viewer/machines/registry.js`                |                                                                                           |
| `.agents/skills/lab-digital-twin/` inside this package                     |                                                                                           |

## Source of truth

1. **Live student app** = `software/viewer/` (Three.js, no npm).
2. **Run logic (Python mirror + tests)** = `software/controller/`.
3. **CAD (optional)** = `cad/cq/` → STEP/STL/GLB export.
4. **Standards** = `docs/PIPELINE.md` (how this one was built) + `docs/STANDARD.md` + `standards/*` — follow these for
   the next machine.

Do **not** reintroduce a hard dependency on BlenderProc, root-level experiment scripts, or a fragile GLB as the only 3D
path. Procedural `centrifuge3d.js` is the interactive model.

## Do

- Keep the package self-contained: paths relative to package root.
- Cache-bust `app.js` / `centrifuge3d.js` query strings when changing viewer code.
- Preserve SRE nameplate as **S R E** (not SSS).
- After behavior changes: `scripts/test.sh` and a hard-refresh of the viewer.
- When adding a **new lab machine**, create `Twins/<name>_twin/` as a sibling and follow `docs/STANDARD.md` +
  `standards/machine_template.md`.

## Don't

- Commit `__pycache__`, `.venv`, `.venv-cq`, or screenshot spam under `export/renders/`.
- Point the live viewer at external monorepo `web_viewer/` or root blender scripts.
- Mix BlenderProc render pipelines into this package’s required run path.
- Invent OEM branding beyond licensed/generic labels (`MICRO 5424-R` class).

## Quick commands

```bash
# from Twins root — lab desk (all machines)
./scripts/serve.sh          # http://127.0.0.1:8765/lab_viewer/

# from this package — standalone twin
./scripts/serve.sh          # http://127.0.0.1:8765/viewer/
./scripts/test.sh           # controller unit tests
```

CadQuery (optional): Python **3.12** venv + `requirements-cq.txt` — see `standards/build_cad.md`.
