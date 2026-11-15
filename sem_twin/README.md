# GEMINI-500 · Field Emission Scanning Electron Microscope digital twin

Self-contained **3D interactive digital twin** of a **ZEISS GeminiSEM 500** class ultra-high-resolution Field Emission Scanning Electron Microscope (FE-SEM) with a dedicated **VC-E Electron Microscopy Suite**, dual-stage UHV turbomolecular vacuum system, 5-axis eucentric motorized stage, multi-detector electron optics (`InLens SE`, `SE2 Everhart-Thornley`, `4-Quad BSE`, `EDS Silicon Drift`), progressive line-by-line raster scan acquisition, and pure-Python dual-truth controller.

## Lab desk (preferred)

From the **Twins** repository root:

```bash
./scripts/serve.sh
```

Open **`http://127.0.0.1:8765/lab_viewer/`** and click **`🔬 SEM Suite`** in the bottom navigation dock (or select **Zeiss Gemini FE-SEM** from the Quick Travel menu) to enter the dedicated Zone 8 Electron Microscopy Suite.

## Standalone (this package only)

```bash
./scripts/serve.sh
# → http://127.0.0.1:8765/viewer/
```

## What you get

| Layer | Location | Purpose |
| :--- | :--- | :--- |
| **3D viewer & scan engine** | `software/viewer/` | Three.js procedural FE-SEM (`sem3d.js`), dedicated VC-E room, dual live `UI_LCD` monitors, progressive raster scan synthesizer (`app.js`), Web Audio acoustics (`sfx.js`), 10-chapter guided tour |
| **Logic & safety interlocks** | `software/controller/` | Pure Python `SEMController` (`sem_controller.py`) + unit & specimen tests (`test_controller.py`, `test_samples.py`) |
| **Engineering docs & specs** | `docs/`, `research/` | OEM sources (`research/sources.md`), Code 4771-CAD dimensions (`docs/dimensions.md`), 14-domain BOM (`docs/BOM.md`), state/physics spec (`docs/control_spec.md`), voiceover script & 1080p walkthrough video |

## Quick start (viewer)

| Control | Action |
| :--- | :--- |
| **⚡ Cord Plugged In / Main Power** | Establish physical circuit continuity (`Power_Plug_NEMA` in `Power_Receptacle_Duplex`) and flip rear IEC breaker |
| **03 Lab Bench → Sputter Coater** | Apply `10 nm Au/Pd` conductive coating to prevent dielectric charging on non-conductive specimens |
| **Vent / Chamber Door / Pump Down** | Vent chamber to `101,325 Pa`, open `Pivot_DoorChamber`, load specimen stub onto 5-axis stage, close door, and engage Rough Scroll → 90,000 RPM Pfeiffer HiPace 300 Turbo pumpdown (`≤ 2.5e-4 Pa`) |
| **HV Beam & Optics** | Enable `EHT` (`0.02–30.0 kV`), adjust `WD / Focus`, `Magnification` (`50×–300,000×`), `Stigmator X/Y`, `Probe Current`, and select detector (`InLens SE`, `SE2`, `4-Quad BSE`, `EDS SDD`) |
| **Acquire Scan / Export** | Run progressive raster scan (`Fast 512px`, `Slow Photo 1024px`, `Line Profile`, `Spot EDS`), capture micrographs to the filmstrip, download `PNG` with Zeiss datazone footer, or export GLP `CSV` |
| **🎬 Guided Tour** | Automated 10-chapter narrated walkthrough covering operation and Stage 7A–7C internal anatomy |

## Documentation map

| Doc | Use |
| :--- | :--- |
| [docs/STANDARD.md](file:///home/antigravity/SREphoto/Twins/sem_twin/docs/STANDARD.md) | Package architecture & quality bar |
| [docs/ARCHITECTURE.md](file:///home/antigravity/SREphoto/Twins/sem_twin/docs/ARCHITECTURE.md) | Runtime modules, coordinate system & data flow |
| [docs/dimensions.md](file:///home/antigravity/SREphoto/Twins/sem_twin/docs/dimensions.md) | Code 4771-CAD spatial envelope & sub-assembly coordinates |
| [docs/BOM.md](file:///home/antigravity/SREphoto/Twins/sem_twin/docs/BOM.md) | Full 14-domain Bill of Materials & 3D fasteners |
| [docs/control_spec.md](file:///home/antigravity/SREphoto/Twins/sem_twin/docs/control_spec.md) | Dual-truth state machine, electron optics equations & GLP CSV schema |
| [docs/walkthrough.md](file:///home/antigravity/SREphoto/Twins/sem_twin/docs/walkthrough.md) | 7-Stage Visual Operator Walkthrough & Internal Anatomy Guide |
| [research/sources.md](file:///home/antigravity/SREphoto/Twins/sem_twin/research/sources.md) | OEM manuals, schematics & site vibration/EMI standards |
