# Agent rules — lab instrument digital twin package

This folder is a **portable product package** under the `Twins/` workspace. It must keep working if moved to any other parent.

Workspace governance (all twins): `Twins/.master/` — start with `AGENT_SOP.md`; end-of-work detail in `AGENTS_MANDATE.md`.

**Lab desk:** `Twins/lab_viewer/` — multi-machine picker. Serve from Twins root: `./scripts/serve.sh` → `/lab_viewer/`.  
This package is registered as machine id `vacuum_pump` in `lab_viewer/machines/registry.js`.

## Scope

| In scope                                                                   | Out of scope                                                                              |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `vacuum_pump_twin/` (this package)                                         | Old BlenderProc monorepo demos or experiment scripts                                      |
| Sibling twins under `Twins/<name>_twin/` when scaffolding the next machine | Editing unrelated apps outside `Twins/` unless asked                                      |
| Lab desk registration via `lab_viewer/machines/registry.js`                |                                                                                           |

## Source of truth

1. **Live student app** = `software/viewer/` (Three.js, no npm).
2. **Run logic (Python mirror + tests)** = `software/controller/`.
3. **CAD (optional)** = `cad/` → STEP/STL/GLB export.
4. **Standards** = `docs/PIPELINE.md` (how this one was built) + `docs/STANDARD.md` + `standards/*` — follow these for the next machine.

Do **not** reintroduce a hard dependency on a fragile GLB as the only 3D path. Procedural `vacuum_pump3d.js` is the interactive model.

## Do

- Keep the package self-contained: paths relative to package root.
- Cache-bust `app.js` / `vacuum_pump3d.js` query strings when changing viewer code.
- After behavior changes: `scripts/test.sh` and a hard-refresh of the viewer.
- When adding a **new lab machine**, create `Twins/<name>_twin/` as a sibling and follow `.master/HOW_TO_BUILD_A_MACHINE.md`.

## Don't

- Commit `__pycache__`, `.venv`, `.venv-cq`, or screenshot spam.
- Point the live viewer at external monorepo paths.
- Invent OEM branding beyond licensed/generic labels (`Laboport N820` class).

## Quick commands

```bash
# from Twins root — lab desk (all machines)
./scripts/serve.sh          # http://127.0.0.1:8765/lab_viewer/

# from this package — standalone twin
./scripts/serve.sh          # http://127.0.0.1:8765/viewer/
./scripts/test.sh           # controller unit tests
```
