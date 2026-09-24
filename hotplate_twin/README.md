# SREdesigns STIR-HEAT 500-D · Digital Magnetic Hotplate Stirrer Twin

High-fidelity digital twin of a laboratory magnetic hotplate stirrer with ceramic top plate and immersion PT1000 temperature probe (IKA RCT basic / RET control class).

## Multi-Machine Lab Desk (Preferred)

From the workspace root:

```bash
./scripts/serve.sh
# Open http://127.0.0.1:8765/lab_viewer/ and select Hotplate Stirrer
```

## Standalone Package Use

This package is fully self-contained:

```bash
cd hotplate_twin
./scripts/serve.sh     # http://127.0.0.1:8765/viewer/
./scripts/test.sh      # Run controller state machine unit tests
```

## Package Structure

| Layer | Location | Purpose |
| :--- | :--- | :--- |
| **Interactive Viewer** | `software/viewer/` | Three.js procedural runtime, live LCD CanvasTexture, thermal ODE + vortex physics |
| **Controller Model** | `software/controller/` | Python state machine and physics unit tests |
| **Procedural CAD** | `cad/` | Blender Python script (`create_hotplate_stirrer.py`) exporting GLB model |
| **Engineering Docs** | `docs/` | 1:1 mm dimensions, parametric BOM, control specification |
| **Research Sources** | `research/` | Instrument manuals, standards (DIN 12878, IEC 61010) |
