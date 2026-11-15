# Manifest — `sem_twin`

Important files for the **ZEISS GeminiSEM 500 Field-Emission Scanning Electron Microscope (FE-SEM)** package (`VC-E` Electron Microscopy Suite). Paths relative to `sem_twin/` unless noted.

## Runtime (must keep)

| Path                                  | Role                                                                                                     |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `software/viewer/index.html`          | Live interactive web shell with SmartSEM Scan Console, Part Explorer, 9-stub carousel & filmstrip        |
| `software/viewer/style.css`           | Gold Standard dark lab theme (`--bg: #0c1016`) + Retro/Night mode variables                              |
| `software/viewer/app.js`              | Progressive raster scan engine (InLens SE, SE2, 4Q-BSE, SDD EDS), 6 specimens, hard continuity, GLP CSV  |
| `software/viewer/sem3d.js`            | 1:1 procedural Three.js CAD assembly, VC-E room, Gemini II column, HiPace 300 turbo, dual 27" 4K LCDs    |
| `software/viewer/sfx.js`              | Procedural Web Audio API synthesizer (dry scroll pump, 90k RPM turbo whine, EHT hum, encoder detents)    |
| `software/controller/sem_controller.py` | Pure Python 3 dual-truth state machine, de Broglie wavelength, mean free path, and interlock logic     |
| `software/controller/test_controller.py` | 12-test unit suite verifying 100% pass rate across continuity, UHV interlocks, optics, and GLP CSV    |
| `scripts/serve.sh`                    | Standalone local HTTP server (`127.0.0.1:8765`)                                                          |
| `scripts/test.sh`                     | Automated Python controller test runner                                                                  |

## Specs & process

| Path                                  | Role                                                                                                     |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `docs/control_spec.md`                | Finite-state machine, de Broglie resolution equations, SE/BSE/EDS detector physics & interlocks          |
| `docs/dimensions.md`                  | Locked 1:1 millimeter envelope ($1250 \times 1350 \times 2180\text{ mm}$) on `VC-E` inertia slab ($Y=0$) |
| `docs/BOM.md`                         | Exhaustive 75+ component Bill of Materials, point-to-point harnesses & genuine 3D DIN 912 fasteners      |
| `docs/STANDARD.md`                    | 5-Gate OGA & 14-Subagent Centrifuge Gold Standard compliance specification                               |
| `docs/ARCHITECTURE.md`                | Dual-truth Python/JS architecture, progressive raster scan pipeline & `lab_viewer` VC-E Suite docking    |
| `docs/walkthrough.md`                 | Complete 8-Stage Visual Operator Experience Walkthrough & Internal Working Anatomy Guide                 |
| `docs/SEM_GEMINI_Social_Walkthrough.mp4` | 1080p H.264/AAC 10-chapter narrated walkthrough video                                                 |

## Research

| Path                                  | Role                                                                                                     |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `research/sources.md`                 | OEM ZEISS GeminiSEM 500 (`349500-8038-000`), 5-Axis Stage (`349347-9013-000`), Pfeiffer & Oxford specs   |

## Registry

Listed in `.master/registry/machines.md` as: `sem_twin` (Gold Standard: `yes`, `lab_viewer` id: `sem`).
