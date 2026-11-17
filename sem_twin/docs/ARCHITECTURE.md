# Architecture — `sem_twin` (ZEISS GeminiSEM 500)

## 1. Runtime Architecture & Modular Viewer Layout

```text
Browser
  └─ software/viewer/index.html
       ├─ style.css              Gold Standard dark lab theme (--bg: #0c1016, --cyan: #00f3ff)
       ├─ app.js                 Dual-truth FSM, progressive raster scanner, 6 specimens, 10-chapter Tour
       ├─ sfx.js                 Procedural Web Audio synthesizer (scroll, turbo 90k RPM, HV, switches)
       ├─ sem3d.js               Top-level 3D orchestrator (buildSEMModel) importing sub-modules:
       │    ├─ sem_materials.js       Industrial PBR materials, textures, upright quads, screws, CF flanges, SRE badge
       │    ├─ sem_chassis_power.js   Plinth (X = -3.80 u), continuous isolators, fixed badge pocket & AC continuity
       │    ├─ sem_chamber_column.js  Hollow extruded UHV chamber, outward door, 5-axis 9-slot carousel & Gemini II column
       │    ├─ sem_internals.js       Turbo/scroll pumps, 30 kV HV tank, PSU, toroid, motherboard, Wi-Fi/BLE & harnesses
       │    └─ sem_console_room.js    Screen-Left console (X = +4.50 u), dual 27" monitors, tactile panels & VC-E prep bench
       └─ Three.js (CDN v0.160)  WebGL2 ACES Filmic Renderer
```

No Node build or bundler is required for the live interactive viewer. Serve `software/` statically via `./scripts/serve.sh` (`http://127.0.0.1:8765/viewer/`) or launch inside the shared multi-machine `lab_viewer` (`http://127.0.0.1:8765/lab_viewer/`).

---

## 2. Coordinate System, Handedness & Scene Framing

- **Scale**: **`1 scene unit (u) = 100 mm = 0.1 m` (`1 dm`)**.
- **Datum**: **`Y = 0.00 u`** finished laboratory floor. All leveling feet (`Foot_Leveling_FL..RR`) and desk glides sit flush on `Y = 0.00 u`.
- **Right-Handed Coordinate Handedness (Operator-Facing `-Z`)**:
  - Up = `+Y`; Front = `-Z` (operator sits at `-Z` facing `+Z`).
  - Therefore **`screenRight = forward(+Z) × up(+Y) = -X`**, and **`screenLeft = +X`**:
    - **Screen-RIGHT Bay (`X = -3.80 u`)**: Plinth + Hollow 316L UHV Chamber + Gemini II Column (`X = -7.80..+0.20 u`, `Z = -5.10..+5.10 u`, `Y = 0.00..17.57 u`, max `18.80 u` w/ HV boot).
    - **Screen-LEFT Bay (`X = +4.50 u`)**: Operator Console Desk (`X = +0.50..+8.50 u`, `Y = 0.00..7.60 u`), under-desk HP Z4 workstation (`Body_WorkstationPC`), central articulated VESA column supporting **Screen-Left `UI_LCD_ChamberScope` (`X = +6.65 u`)** and **Screen-Right `UI_LCD` (`X = +2.35 u`)**, Dual-Rotary Control Panel (`X = +2.45 u`), and Dual-Joystick Stage Box (`X = +6.35 u`).
    - **Far Screen-LEFT Prep Bay (`X = +14.80 u`, when `options.includeLab !== false`)**: Standalone `VC-E` room with Specimen Prep Bench, Au/Pd Sputter Coater (`5.0 nm` film), and hinged smoked-acrylic `12.7 mm` stub box.

---

## 3. Shared Lab Integration (`lab_viewer` Zone 8 — `VC-E` Suite)

- **`lab_viewer/machines/registry.js`**: Declares `id: "sem"`, `packageDir: "sem_twin"`, `viewerUrl: "../sem_twin/software/viewer/"`.
- **`lab_viewer/engine/LabEnvironment3D.js`**: Constructs `_buildVCESEMSuite()` in Zone 8 (`X: 1.0..8.0 m, Z: 9.5..18.3 m`, `61.6 m²` Rear North L-Wing) with decoupled concrete inertia slab, neoprene vibration joint, double PDLC airlock doors (`SEM_SUITE_DOOR`), blackout blinds, dimmable lights, and capacitive wall touch panel.
- **`lab_viewer/engine/LabDockManager.js`**: Imports `buildSEMModel` from `../../sem_twin/software/viewer/sem3d.js` with `{ includeLab: false }` and mounts the complete twin in Zone 8:
  - **World Position**: **`(4.5, 0.0, 15.0)`** (`m`)
  - **Rotation**: **`rotY = +Math.PI / 2`** (rotates `-Z` operator front to **West `-X`**, facing the `X = 1.0 m` double airlock doors)
  - **Scale**: **`scale = 0.10`** (`1 dm × 0.10 = 0.1 m`)
  - **`camConsole`**: Centered directly on the operator console desk (local `X = +4.50 u` → world `(4.50, 1.15, 14.55)`, viewed from `(2.20, 1.45, 14.55)`).

---

## 4. Dual-Truth Runtime & Scan Pipeline

| Layer | File | Responsibility |
| :--- | :--- | :--- |
| **Python Reference Controller** | `software/controller/sem_controller.py` | Pure-Python 10-state FSM, SI `Pa` & `mbar` (`1 mbar = 100 Pa`) kinetics, UHV/door/EHT interlocks (`RuntimeError` if opening door `< 95,000 Pa`), relativistic optics, 6 specimens, `5.0 nm` Au/Pd charging, GLP CSV export |
| **Unit & Sample Tests** | `test_controller.py`, `test_samples.py` | Locks state transitions, vacuum/door interlocks, `0.02–30.0 kV` / `3–20,000 pA` / `50–300,000×` bounds, dielectric charging & EDS peaks |
| **3D Procedural CAD** | `sem3d.js` + `sem_*.js` | 1:1 procedural geometry, continuous isolators (`Y = 0.95..6.95 u`), hollow `0.32 u`-wall chamber, outward door, 9-slot `40°` carousel, `UI_LCD` & `UI_LCD_ChamberScope`, harnesses & DIN 912 fasteners |
| **Client Runtime & Scanner** | `software/viewer/app.js` | Mirrors `SEMController` 1:1; synthesizes live progressive raster scans (`InLens_Secondary`, `SE2_Everhart_Thornley`, `BSE_Backscatter`, `EDS_Silicon_Drift`), micrograph filmstrip, PNG & GLP CSV export, and 10-chapter `TOUR_CHAPTERS` |
| **Acoustic Engine** | `software/viewer/sfx.js` | Web Audio API synthesis for scroll pulsation, 90k RPM turbo whine, HV hum, pneumatic valves, and CW rotary detents |

### One Analytical Run Data Flow
```text
Plug NEMA cord & flip main breaker  →  STANDBY (101,325 Pa / 1,013.25 mbar)
  → Vent & open outward chamber door  →  Load 9-slot 40° carousel + 5.0 nm Au/Pd coat  →  Seal door
  → Rough Scroll (10.0 Pa / 0.10 mbar) → HiPace 300 Turbo (<= 2.5e-4 Pa; 1.4e-4 Pa / 1.4e-6 mbar)
  → Energize EHT (0.02–30.0 kV) & Beam Booster (+8.0 kV)  →  BEAM_ACTIVE
  → Progressive Raster Scan (InLens / SE2 / 4Q-BSE / SDD EDS)  →  IMAGING
  → Slow Photo 1024px Capture  →  Filmstrip + PNG Download + GLP CSV Audit Export
```
