# Samples, rack, and visual separation

## Overview

- **24 rotor slots** (FA-45-24-11 class)
- **24-position bench rack** (4×6) beside the instrument
- Tubes move between rack ↔ rotor only when **lid open** and **rotor stopped**
- Each tube has a **sample material**; after a completed run, layers update to a **separated** look when RCF/time/RPM
  thresholds are met

## Sample materials

| ID                  | Label             | After centrifugation (visual)     |
| ------------------- | ----------------- | --------------------------------- |
| `whole_blood`       | Whole blood       | Packed RBCs / buffy coat / plasma |
| `blood_serum_clot`  | Clotted blood     | Clot / gel / serum                |
| `bacterial_culture` | Bacterial culture | Cell pellet + clear supernatant   |
| `plasmid_miniprep`  | Plasmid lysate    | Debris pellet + cleared lysate    |
| `pcr_mix`           | PCR mix           | Nearly unchanged clear liquid     |
| `soil_slurry`       | Soil slurry       | Sediment + silty + cloudy water   |
| `milk`              | Milk              | Body + light cream band           |
| `ink_suspension`    | Ink suspension    | Dark pellet + clear carrier       |
| `gradient_sucrose`  | Sucrose gradient  | Multi-band gradient               |
| `water_buffer`      | Clear buffer      | No visible change                 |
| `oil_water`         | Oil + water       | Aqueous bottom, oil top           |
| `empty`             | Empty             | No liquid                         |

Thresholds live in `software/controller/samples.py` (`min_rcf`, `min_time_s`, `min_rpm`).

## Lab operations (API)

```python
c = CentrifugeController()
c.load_balanced_demo("whole_blood")   # two opposite tubes
c.set_tube_material(tube_id, "soil_slurry")
c.unload_rotor_slot(0)                # → rack
c.load_rack_slot(3, rotor_slot=5)     # rack → rotor
c.unload_all_to_rack()
c.remix_tube(tube_id)                 # clear separation (vortex)
```

## Viewer

1. Choose material
2. Click **rack** well → loads into next free rotor slot (or selected rotor slot)
3. Click **rotor** tube → unloads to rack
4. Run centrifuge (balanced pairs recommended)
5. After stop, tubes show layered colours; log lists which IDs separated

## 3D / CAD notes (later)

- BOM add: `R01` tube rack body, rack wells
- Tube liquid mesh or shader: stack materials by `layers[]`
- Parent tubes to rack empty when `location == RACK`
