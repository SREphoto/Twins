# Digital Twin Standard — `sem_twin` (ZEISS GeminiSEM 500)

## 1. Product Definition
| Field | Value |
| :--- | :--- |
| **Package ID** | `sem_twin` |
| **Instrument Class** | Field Emission Scanning Electron Microscope (FE-SEM) |
| **Reference OEM** | Carl Zeiss Microscopy GmbH — ZEISS GeminiSEM 500 |
| **Scene Scale** | `1 unit = 100 mm` (`0.1 m`), floor datum `Y = 0.0` |
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
        ├── sem3d.js
        └── sfx.js
```

## 3. Quality Bar (OGA 5-Gate Ship Checklist)
- [x] **Gate 1 — Semantic Taxonomy (`scripts/oga_validator.mjs`)**: 25/25 checks pass (`Body_*`, `UI_LCD`, `Btn_*`, `Knob_*`, `Pivot_*`, `Glass_*`, `Fastener_*`, `Foot_Leveling_*`, `Badge_SREdesigns`).
- [x] **Gate 2 — Physical Circuit Continuity**: `Power_Receptacle_Duplex`, `Power_Plug_NEMA`, `Power_Cord_SJTOW`, and hard power cutoff when unplugged or switched off.
- [x] **Gate 3 — Upright Dynamic Canvas UVs**: `flipY = false`, `THREE.SRGBColorSpace`, and `makeOperatorFacingQuadGeo` UV Y-inversion.
- [x] **Gate 4 — Internal Electronics & Vacuum Bay**: `PCB_Motherboard`, `Part_MCU_ARM`, `Part_RAM_Chip`, `Part_SSD_Module`, `WiFi_BLE`, `Antenna_WiFi`, `Assembly_PowerSupply`, `Part_ToroidalTransformer`, `Body_HVTank_30kV`, `Fan_CabinetCooling_Blower`, `Port_*`, `Motor_DriveTurboPump`, `Motor_DriveScrollPump`, and point-to-point `Body_Wire_*` harnesses.
- [x] **Gate 5 — Dual-Truth Tests, Visual QA & Narrated Video**: 100% Python unit test pass rate, 0 browser console exceptions across all 6 viewpoints + Stage 7A–7D internals, `TOUR_CHAPTERS`, and 1080p `SEM_GEMINI_Social_Walkthrough.mp4`.
