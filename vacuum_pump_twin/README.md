# Diaphragm Vacuum Pump · Digital Twin

Portable training twin of a laboratory diaphragm vacuum pump (KNF Laboport N820 class).

## Lab desk (preferred)

From the **Twins workspace root** (the folder that contains `lab_viewer/` and `vacuum_pump_twin/`):

```bash
./scripts/serve.sh
```

Open **http://127.0.0.1:8765/lab_viewer/** and choose **Vacuum Pump**.  
That is the multi-machine lab desk (machine picker + desk switch). See `lab_viewer/README.md`.

## Standalone (this package only)

**This folder is self-contained.** You can move it to any parent and it still runs:

```bash
cd vacuum_pump_twin          # only if you are not already inside it
./scripts/serve.sh           # http://127.0.0.1:8765/viewer/
./scripts/test.sh            # controller unit tests
```

No external model dependencies are required for the student app (3D is generated procedurally).

---

## What you get

| Layer            | Location               | Purpose                                                         |
| ---------------- | ---------------------- | --------------------------------------------------------------- |
| Interactive twin | `software/viewer/`     | Three.js lab, instrument, speed control, Bourdon gauge, demo    |
| Controller       | `software/controller/` | Pure Python state machine + tests                               |
| Specs            | `docs/`                | BOM, Dimensions, Control Spec, Detailed Part Specifications     |
| Research         | `research/`            | Manuals, wiring, schematics, maintenance guide, sources         |

---

## Quick start (viewer)

```bash
./scripts/serve.sh
# open http://127.0.0.1:8765/viewer/
```

| Control            | Action                                                   |
| ------------------ | -------------------------------------------------------- |
| **Power Switch**   | Toggle pump ON/OFF                                       |
| **Gas Ballast**    | Knurled knob; adjust to allow vapor venting              |
| **Speed Control**  | Rotary pot; adjust motor RPM (1500–3000 RPM)             |
| **Bourdon Gauge**  | Analog dial displaying vacuum level (0–760 mmHg)         |
| **Continuous demo**| Guided student-facing loop of leak tests & vent cycles  |
| **Disassembly**    | View/highlight all 35+ components from the BOM           |
