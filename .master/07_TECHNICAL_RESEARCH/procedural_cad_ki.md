# KI: Procedural CAD & Boolean Modeling (`twins_procedural_cad_patterns`)

## The 8-Stage Piece-by-Piece Assembly Sequence
1. **Stage 1 (Spatial Envelope)**: Ingest $W \times D \times H$ mm from `docs/dimensions.md`. Establish master bounding envelope.
2. **Stage 2 (Base Plate & Feet)**: Structural bottom pan + 4 knurled leveling feet with vulcanized rubber pads.
3. **Stage 3 (Unibody Chassis)**: Exterior casing with $2\text{--}4\text{ mm}$ corner fillet bevels and ventilation louvers.
4. **Stage 4 (Console & Recessed Pocket)**: Ergonomic sloped apron ($20^\circ\text{--}35^\circ$) with boolean carved pocket ($1.5\text{--}2.5\text{ mm}$ depth). `UI_LCD` quad sits flush inside pocket.
5. **Stage 5 (Kinematics & Pivots)**: Independent movable parts with local origin positioned exactly at mechanical axis of motion (`Pivot_*`).
6. **Stage 6 (Fluidics & Glassware)**: Borosilicate lathe profiles ($1.8\text{--}2.5\text{ mm}$ wall thickness), standard tapers (ST 24/40), helical cooling coils.
7. **Stage 7 (Electronics & Keypad)**: Push buttons (`Btn_*`), rotary knobs (`Knob_*`), status LEDs, dynamic LCD quad.
8. **Stage 8 (Hardware & Power)**: Real 3D hex socket cap screws (M3/M4), rear IEC C14 power socket with ground pin.
