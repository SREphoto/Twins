# Runtime Architecture — `sem_twin` (ZEISS GeminiSEM 500)

## 1. Runtime Modules (`software/viewer/`)
| File | Role |
| :--- | :--- |
| `index.html` | Centrifuge Gold Standard 3-panel collapsible shell (`01 Control panel`, `02 Part explorer`, `03 Lab bench`), topbar with ChemMate switcher, `🎬 GUIDED TOUR`, `⚡ CORD PLUGGED IN`, `MODERN / + RETRO / ☾ NIGHT`, camera/explode/cutaway/wireframe/light/mood toolbar, and interactive Scan Console |
| `style.css` | Gold Standard dark lab theme (`--bg: #0c1016`, `--panel: #131922`, `--cyan: #00f3ff`), responsive collapsible sidebars, and SmartSEM datazone styling |
| `sem3d.js` | Procedural 3D FE-SEM builder (`buildSEMModel(tex, options)`), standalone `VC-E` room (`includeLab !== false`), internal vacuum/HV/electronics bay, point-to-point wiring harnesses, genuine 3D fasteners, and Part Explorer isolation/explode hooks |
| `app.js` | Dual-truth client runtime mirroring `SEMController`, progressive line-by-line raster scan synthesizer (`InLens SE`, `SE2`, `4-Quad BSE`, `EDS`), live dual `UI_LCD` canvas sync, micrograph PNG & GLP CSV export, and 10-chapter `TOUR_CHAPTERS` automation |
| `sfx.js` | Procedural Web Audio API acoustic synthesizer (scroll roughing pump, 90k RPM turbo turbine whine, pneumatic valves, HV relays, scanline hum, tactile detents) |

## 2. Coordinate System
- **Up Axis**: `+Y` (`Y = 0.0` at finished floor surface).
- **Scale**: `1 scene unit = 100 mm` (`0.1 m`).
- **Front**: `-Z` (operator faces `+Z` when looking at the dual monitors and chamber door).
- **`lab_viewer` Integration**: Mounted in Zone 8 (`X: 1.0..8.0, Z: 9.5..18.3`) at `(4.2, 0.0, 15.0)` with `rotY = +Math.PI / 2` (front faces West `-X` toward the suite airlock doors) and `scale = 0.10`.
