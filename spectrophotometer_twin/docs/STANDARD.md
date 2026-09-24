# Normative Twin Standard — UV-Vis Spectrophotometer

Package standard for `spectrophotometer_twin`. Aligns strictly with `centrifuge_twin/docs/STANDARD.md` and workspace rules in `.agents/AGENTS.md`.

---

## 1. Compliance Requirements

1. **Procedural Physical Solid**: Every part (chassis, recessed bezel, display quad, door, turret, cuvettes, lamps, DIN 912 screws, DIN 125 washers, leveling feet, ports) must be procedurally constructed in Three.js geometry.
2. **Semantic Part Taxonomy**:
   - `Body_Chassis`: Main structural unibody casting.
   - `UI_LCD`: Dynamic CanvasTexture screen with `flipY = false`.
   - `Btn_*`: Clickable physical control keys (`Btn_Power`, `Btn_Zero`, `Btn_Scan`, `Btn_Mode`, `Btn_CellNext`, `Btn_Lid`).
   - `Pivot_*`: Kinematic sub-assemblies (`Pivot_ChamberLid`, `Pivot_CellCarousel`).
   - `Glass_*`: Optical components with refractive `MeshPhysicalMaterial` (`Glass_Cuvette_*`).
   - `Fastener_HexM4_*`: Genuine 3D screws from `../../lab_viewer/shared/hardware_library.js`.
   - `Foot_Leveling_*`: Threaded leveling feet resting flush at $Y=0$.
   - `Badge_SREdesigns`: Flush chrome brand badge.
3. **Gold Standard UI**:
   - HTML shell with standard topbar (`brand`, `topbar-status`).
   - Stage toolbar (`btn-explode`, `btn-wireframe`, `btn-auto-rotate`, orbit speed, zoom, light, SFX mute).
   - Collapsible panels `<aside class="instrument panel-collapsible">` and `<aside class="lab panel-collapsible">`.
   - Styling adhering to `--bg: #0c1016`, `--panel-bg: #141a23`, `--accent: #3b82f6`.
4. **Deterministic Simulation & Python Controller**:
   - Pure Python controller with unit test suite in `software/controller/`.
   - `./scripts/test.sh` passing 100%.
   - `./scripts/serve.sh` for standalone preview.
