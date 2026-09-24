# Manifest — `hotplate_twin`

Important files for this package. Paths relative to `hotplate_twin/` root unless noted.

## Runtime (must keep)

| Path | Role |
| :--- | :--- |
| `software/viewer/index.html` | Live WebGL app entry point |
| `software/viewer/style.css` | Viewer UI styling (gold standard layout) |
| `software/viewer/app.js` | Application controller, PID loop, vortex simulation |
| `software/viewer/hotplate3d.js` | Procedural Three.js 3D assembly & lab room |
| `software/viewer/sfx.js` | Web Audio procedural sound synthesizer |
| `software/viewer/models/hotplate_stirrer.glb` | Blender CAD exported GLB model |
| `software/controller/hotplate_controller.py` | Headless Python state machine model |
| `software/controller/test_controller.py` | Controller unit tests |
| `scripts/serve.sh` | Standalone local viewer server |
| `scripts/test.sh` | Unit test execution runner |
| `README.md` | Human quick start documentation |
| `AGENTS.md` | Strict procedural CAD and DIAG adherence rules |

## Specs & Process

| Path | Role |
| :--- | :--- |
| `docs/control_spec.md` | States, thermal ODE, vortex physics, interlocks |
| `docs/dimensions.md` | 1:1 mm dimensions, origins, clearances |
| `docs/BOM.md` | Parametric Bill of Materials & Three.js taxonomy |
| `research/sources.md` | Equipment references & engineering standards |

## CAD & Pipeline

| Path | Role |
| :--- | :--- |
| `cad/create_hotplate_stirrer.py` | Procedural Blender Python CAD builder |

## Registry

Listed in `.master/registry/machines.md` as: `hotplate_twin`
Registered in `lab_viewer/machines/registry.js` as: `hotplate`
