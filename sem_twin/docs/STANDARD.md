# Digital Twin Standard — `sem_twin` (ZEISS GeminiSEM 500)

## 1. Product Definition
| Field | Value |
| :--- | :--- |
| **Package ID** | `sem_twin` |
| **Instrument Class** | Field Emission Scanning Electron Microscope (FE-SEM) |
| **Reference OEM** | Carl Zeiss Microscopy GmbH — ZEISS GeminiSEM 500 |
| **Canonical Envelope (`4771-CAD`)** | `1650 × 1082 × 1757 mm` (`1880 mm` w/ top `-30 kV` HV boot) |
| **Scene Scale & Datum** | `1 unit = 100 mm` (`0.1 m`), finished floor datum `Y = 0.00 u` |
| **Coordinate Handedness** | Front `-Z`, Up `+Y`; **`screenRight = -X`** (Plinth/Column at `X = -3.80 u`), **`screenLeft = +X`** (Console at `X = +4.50 u`, Prep Bench at `X = +14.80 u`) |
| **Dedicated Room** | `VC-E` Electron Microscopy Suite (Standalone `Body_LaboratoryRoom` & `lab_viewer` Zone 8) |

## 2. Package Layout (Self-Contained & Relocatable)
```text
sem_twin/
├── AGENTS.md
├── README.md
├── research/
│   └── sources.md
├── docs/
│   ├── STANDARD.md
│   ├── ARCHITECTURE.md
│   ├── dimensions.md
│   ├── BOM.md
│   ├── control_spec.md
│   ├── presentation_voiceover_script.md
│   ├── walkthrough.md
│   ├── SEM_GEMINI_Social_Walkthrough.mp4
│   └── audio/
│       └── vo_{0..9}.mp3
├── scripts/
│   ├── serve.sh
│   └── test.sh
└── software/
    ├── controller/
    │   ├── sem_controller.py
    │   ├── test_controller.py
    │   └── test_samples.py
    └── viewer/
        ├── index.html
        ├── style.css
        ├── app.js
        ├── sfx.js
        ├── sem3d.js              # Orchestrator importing modular sub-builders below:
        ├── sem_materials.js      # Shared PBR materials, textures, upright quads, fasteners, CF flanges & SRE badge
        ├── sem_chassis_power.js  # Plinth (X = -3.80 u), continuous isolators, fixed badge pocket & AC continuity
        ├── sem_chamber_column.js # Hollow extruded UHV chamber, outward door, 5-axis 9-slot carousel & Gemini II column
        ├── sem_internals.js      # Turbo/scroll pumps, 30 kV HV tank, PSU, toroid, motherboard, Wi-Fi/BLE & harnesses
        └── sem_console_room.js   # Screen-Left console (X = +4.50 u), dual 27" monitors, tactile panels & VC-E prep bench
```

## 3. Quality Bar (OGA 5-Gate Ship Checklist)
- [x] **Gate 1 — Semantic Taxonomy (`scripts/oga_validator.mjs`)**: 25/25 checks pass (`Body_*`, `UI_LCD`, `UI_LCD_ChamberScope`, `Btn_*`, `Knob_*`, `Pivot_*`, `Glass_*`, `Fastener_*`, `Foot_Leveling_*`, `Badge_SREdesigns` mounted in a `2.0 mm` carved pocket on the fixed lower-left front plinth rail).
- [x] **Gate 2 — Physical Circuit Continuity**: `Power_Receptacle_Duplex`, `Power_Plug_NEMA`, `Power_Cord_SJTOW`, and hard power cutoff when unplugged or switched off (`DIAG-014`).
- [x] **Gate 3 — Upright Dynamic Canvas UVs & Ergonomics**: `flipY = false`, `THREE.SRGBColorSpace`, `makeOperatorFacingQuadGeo` UV Y-inversion, `2.5 mm` carved recessed monitor pockets with `+0.4 mm` `Glass_DisplayCover`, `UI_LCD_ChamberScope` (Screen-Left `X = +6.65 u`) & `UI_LCD` (Screen-Right `X = +2.35 u`), CW-to-increase knurled encoders, `+Y` upward silkscreen legends, and `>= 4.0 mm` spacing.
- [x] **Gate 4 — Internal Electronics & Vacuum Bay**: Continuous `Body_PneumaticIsolator_01..04` (`Y = 0.95..6.95 u`), `PCB_Motherboard`, `Part_MCU_ARM`, `Part_RAM_Chip`, `Part_SSD_Module`, `WiFi_BLE`, `Antenna_WiFi`, `Assembly_PowerSupply`, `Part_ToroidalTransformer`, `Body_HVTank_30kV`, `Fan_CabinetCooling_Blower`, `Port_*`, `Motor_DriveTurboPump`, `Motor_DriveScrollPump`, and point-to-point `Body_Wire_*` harnesses.
- [x] **Gate 5 — Dual-Truth Tests, Visual QA & 2-Speaker Narrated Video**: 100% Python unit test pass rate (including `close_chamber_door(False)` under vacuum interlock, `5.0 nm` Au/Pd film, 6 canonical specimens, SI `Pa` + `mbar` equivalence), 0 browser console exceptions across all 6 viewpoints + Stage 7A–7D internals, 10-chapter `TOUR_CHAPTERS` (`Speaker 1` Stages 0–6, `Speaker 2` Stages 7A–7D -> `vo_0..vo_9`), and 1080p `SEM_GEMINI_Social_Walkthrough.mp4`.
