# AGENTS.md — UV-Vis Spectrophotometer Twin Rules

All agents touching `spectrophotometer_twin` must comply with `.agents/AGENTS.md` and this document:

1. **Exhaustive Procedural CAD Detail**:
   - Zero flat baked 2D screw decals. Use genuine 3D `createHexSocketScrew` and `createWasher` from `../../lab_viewer/shared/hardware_library.js`.
   - Chamber door `Pivot_ChamberLid` must pivot realistically on its hinge pin axis.
   - Motorized cuvette turret `Pivot_CellCarousel` must rotate around its center shaft with numbered cell slots.
2. **Dynamic Canvas LCD**:
   - CanvasTexture must set `flipY = false`.
   - UV coordinates correctly mapped.
   - Screen must render dynamic live scan curves, numeric readouts, and mode badges.
3. **Safety Interlock**:
   - When chamber door is open, the light beam must cut off to protect PMT detector and avoid ambient contamination.
4. **Standard UI**:
   - Use standard CSS variables (`--bg: #0c1016`, etc.) and collapsible `<aside class="panel-collapsible">` panels.
