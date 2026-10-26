# Manifest — `disintegration_tester_twin`

Important files for the **ERWEKA ZT 322 Tablet Disintegration Tester (USP <701>)** package. Paths relative to `disintegration_tester_twin/` unless noted.

## Runtime (must keep)

| Path                                           | Role                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| `software/viewer/index.html`                   | Live student interactive web shell with Part Explorer & collapsible instrument panels  |
| `software/viewer/style.css`                    | Gold Standard dark lab theme (`--bg: #0c1016`) + Retro/Night mode variables            |
| `software/viewer/app.js`                       | Client runtime, UI bindings, hard continuity logic (`isPluggedIn`), GLP CSV export     |
| `software/viewer/disintegration3d.js`          | Procedural Three.js 3D assembly, harmonic crank kinematics, dynamic Canvas `UI_LCD`    |
| `software/viewer/sfx.js`                       | Procedural Web Audio API synthesizer (gearmotor hum, harmonic slosh, Crydom SSR relay) |
| `software/controller/disintegration_controller.py` | Pure Python 3 dual-truth state machine, USP <701> kinetics, and PID thermal loop  |
| `software/controller/test_controller.py`       | 10-test unit suite verifying 100% pass rate across continuity, kinematics, and GLP     |
| `scripts/serve.sh`                             | Standalone local HTTP server (`127.0.0.1:8765`)                                        |
| `scripts/test.sh`                              | Automated Python controller test runner                                                |

## Specs & process

| Path                   | Role                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `docs/control_spec.md` | Finite-state machine, sinusoidal harmonic stroke equations, PID thermal balance        |
| `docs/dimensions.md`   | Locked 1:1 millimeter envelope ($430 \times 400 \times 660\text{ mm}$) at datum $Y=0$  |
| `docs/BOM.md`          | Exhaustive 95+ component Bill of Materials & genuine 3D fasteners                      |

## Research

| Path                          | Role                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `research/sources.md`         | Compendial USP <701>, Ph. Eur. 2.9.1, JP 6.09 & ERWEKA ZT 322 specifications    |

## Registry

Listed in `.master/registry/machines.md` as: `disintegration_tester_twin` (Gold Standard: `yes`, `lab_viewer` id: `disintegration_tester`).
