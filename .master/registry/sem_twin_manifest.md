# Machine Manifest — `sem_twin` (ZEISS GeminiSEM 500)

| Field              | Value |
| ------------------ | ----- |
| **ID**             | `sem` (`sem_twin`) |
| **Instrument**     | ZEISS GeminiSEM 500 Field-Emission Scanning Electron Microscope (FE-SEM) |
| **Gold Standard**  | **YES** (5-Gate OGA Centrifuge Standard · `25/25` validator checks · `lab_viewer` Zone 8) |
| **Package Dir**    | `Twins/sem_twin/` (self-contained, portable) |
| **Lab Zone**       | Zone 8 — Dedicated `VC-E` Electron Microscopy Suite (`X: 1.0..8.0 m, Z: 9.5..18.3 m`, `61.6 m²`) |
| **Scale & Datum**  | `1 u = 100 mm = 0.1 m` (`scale: 0.10` in `lab_viewer`); Floor `Y = 0.00 u`; Front `-Z` (`screenRight = -X`, `screenLeft = +X`) |
| **Envelope (`4771`)** | `1650 × 1082 × 1757 mm` (`1880 mm` max w/ top `-30 kV` HV boot) on `VC-E` inertia slab (`Y = 0`) |
| **Key Physics**    | Dual-stage scroll/turbo UHV (`101,325 Pa` / `1,013.25 mbar` -> `1.4e-4 Pa` / `1.4e-6 mbar`), FEG IGP (`2.0e-8 Pa` / `2.0e-10 mbar`), `0.02–30.0 kV` EHT, `3.0–20,000.0 pA` probe, `50×–300,000×` mag (`HFW = 120,000 / Mag µm`), `2.0–40.0 mm` WD, `+8 kV` Beam Booster, `InLens` / `SE2` / `4Q-BSE` / `SDD EDS`, `5.0 nm` Au/Pd sputter charging |

## Runtime & Verification Files

| Layer | Path | Description |
| :--- | :--- | :--- |
| **Viewer Entry** | `sem_twin/software/viewer/index.html` | Gold Standard 3-panel collapsible web UI (`SmartSEM Scan Console`, `Part Explorer`, `Stage, Prep & Filmstrip`) |
| **3D CAD Orchestrator** | `sem_twin/software/viewer/sem3d.js` | Top-level `buildSEMModel(tex, opts)` orchestrator importing `sem_materials.js`, `sem_chassis_power.js`, `sem_chamber_column.js`, `sem_internals.js`, `sem_console_room.js` |
| **CAD Sub-Modules** | `sem_twin/software/viewer/sem_*.js` | Modular builders for PBR materials/fasteners, plinth (`X = -3.80 u`) + fixed badge + AC continuity, hollow UHV chamber + outward door + column, lower bay pumps/HV/PCB, and Screen-Left console (`X = +4.50 u`) + dual 27" monitors + prep bench (`X = +14.80 u`) |
| **Scan & Tour Runtime** | `sem_twin/software/viewer/app.js` | Line-by-line raster scan synthesizer, 6 specimens + 3 calibration substrates (`9 × 40°` carousel), PNG & GLP CSV export, `TOUR_CHAPTERS` |
| **Acoustics** | `sem_twin/software/viewer/sfx.js` | Web Audio API synthesizer (dry scroll, 90k RPM turbo turbine, HV hum, valves, CW rotary detents) |
| **Python Controller** | `sem_twin/software/controller/sem_controller.py` | Pure-Python 10-state FSM & hardware safety interlocks (`test_controller.py`, `test_samples.py`) |
| **Shared Lab Mount** | `lab_viewer/engine/LabDockManager.js` | Zone 8 mount at `(4.5, 0.0, 15.0)`, `rotY = +Math.PI / 2`, `scale = 0.10`, `camConsole` centered on console desk |
| **Engineering Docs** | `sem_twin/docs/*.md`, `research/sources.md` | Single-source-of-truth specs (`dimensions.md`, `BOM.md`, `control_spec.md`, `STANDARD.md`, `ARCHITECTURE.md`, `walkthrough.md`) |
| **2-Speaker Script & Video** | `sem_twin/docs/presentation_voiceover_script.md`, `SEM_GEMINI_Social_Walkthrough.mp4` | 10-chapter 2-speaker AI Studio narration (`Speaker 1` Stages 0–6, `Speaker 2` Stages 7A–7D -> `vo_0..vo_9`) & 1080p H.264/AAC walkthrough video |

## Validation & Smoke Commands

```bash
# Python dual-truth unit & specimen tests
./sem_twin/scripts/test.sh

# OGA 5-Gate Mechanical & Presentation Validator (25/25 checks)
node scripts/oga_validator.mjs sem_twin

# Standalone Viewer & Shared Lab Suite
./sem_twin/scripts/serve.sh          # http://127.0.0.1:8765/viewer/
./scripts/serve.sh                   # http://127.0.0.1:8765/lab_viewer/
```
