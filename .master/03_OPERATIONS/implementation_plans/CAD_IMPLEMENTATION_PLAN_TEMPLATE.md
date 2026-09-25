# Implementation Plan: [Machine Name] Twin

## 1. Machine Overview & Objectives
- **Machine Name**: [e.g. Ultrasonic Cleaner, Centrifuge, Rotovap]
- **Package Directory**: `Twins/<machine>_twin/`
- **OEM Reference**: [Manufacturer, Model Number, Manual Source]
- **Target Envelope**: $W \times D \times H$ mm

---

## 2. Dimensional Blueprint & Datum Origin
- **Base Dimensions**: Width [X] mm, Depth [Y] mm, Height [Z] mm
- **Datum Origin**: Tabletop bottom-center $(0, 0, 0)$
- **Key Ergonomic Slopes**: Console angle [e.g. 25°]
- **Clearance & Envelopes**: [Door swing radius, lift column height]

---

## 3. The 8-Stage Assembly Breakdown
- [ ] **Stage 1**: Spatial Envelope & Datum Freeze
- [ ] **Stage 2**: Base Plate & Leveling Feet
- [ ] **Stage 3**: Unibody Outer Chassis & Louvers
- [ ] **Stage 4**: Console Pocket & Recessed Bezel (Anti-Clipping)
- [ ] **Stage 5**: Kinematic Assemblies & Pivots
- [ ] **Stage 6**: Fluidics, Glassware & Optics
- [ ] **Stage 7**: Electronics, Membrane Buttons & Dynamic LCD
- [ ] **Stage 8**: Fasteners, Hardware & Power Socket

---

## 4. Decoupled Controller & Interlocks
- **States**: `IDLE`, `RUNNING`, `PAUSED`, `ERROR`, `INTERLOCK_TRIGGERED`
- **Test Suite**: `software/controller/test_controller.py`

---

## 5. Verification Plan
- [ ] `./scripts/serve.sh` on port 8765 loads correctly
- [ ] `./scripts/test.sh` passes 100% of unit tests
- [ ] 6-viewpoint visual inspection completed
- [ ] Zero browser console exceptions
- [ ] `node .master/05_PERSONAL_MISC/tools/cad_validator.mjs` exits with code 0
