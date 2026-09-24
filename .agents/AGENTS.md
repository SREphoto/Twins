# Workspace Rules

## 1. CRITICAL FIDELITY RULE: Exhaustive Procedural Detail (Zero File Size Limits)

**Every single part needs complete procedural design.** Every screw (with real hex socket or cross-recess depth), every
washer, bracket, gasket, and individual part of a twin must be fully modeled in genuine 3D physical geometry.

- Do not use abstract primitives to represent complex assemblies.
- Do not bake micro-fasteners into flat 2D normal maps out of fear of file size.
- Recreate the exact CAD models down to the finest mechanical detail.

## 2. 5-Agent Hybrid CAD-to-Web Pipeline

All machine twins follow the 5-Agent Handoff Chain:

1. **MDRA** (Research & Blueprints): Extract 1:1 mm dimensions and create the Parametric BOM.
2. **CAD-BA** (Blender CAD Builder): Script the physical solids in Blender Python (`bpy`), carving flush recessed bezels
   with real CAD booleans, modeling true kinematic pivot origins, and applying the Semantic Part Taxonomy.
3. **WEB-BA** (Three.js Web Runtime): Integrate the exported model into the web viewer, binding the live dynamic HTML5
   `CanvasTexture` to `UI_LCD` (`flipY = false`), wiring raycaster clicks to `Btn_*`, and controlling `Pivot_*`
   transforms.
4. **VQA** (Visual QA Auditor): Execute preflight visual audits from 4 standardized camera viewpoints (`CAM_ISO`,
   `CAM_FRONT`, `CAM_SIDE`, `CAM_EXPLODED`) using `browser_subagent`.
5. **LIA** (Lab Integration): Register the verified twin into `lab_viewer/machines/registry.js` on the shared lab desk.

## 3. Strict Semantic Part Taxonomy Contract

Every physical assembly must strictly adhere to this naming taxonomy across CAD and Web:

- `Body_Chassis`: Main structural unibody casting/housing.
- `UI_LCD`: Dedicated, flat UV-mapped quad seated in the boolean-carved pocket (bound to dynamic canvas).
- `Btn_<Action>`: Dedicated physical button meshes (e.g. `Btn_Tare`, `Btn_Cal`, `Btn_Power`, `Btn_Print`).
- `Pivot_<Assembly>`: Movable sub-assemblies with pivot origin set at the mechanical axis (e.g. `Pivot_DoorLeft`,
  `Pivot_DoorRight`, `Pivot_DoorTop`, `Pivot_PanWeighing`).
- `Glass_<Part>`: Optical components designated for Three.js refractive `MeshPhysicalMaterial` ($IOR = 1.52$).
- `Fastener_<Type>_<ID>`: Genuine 3D physical screws, washers, and nuts (e.g. `Fastener_HexM4_01`).
- `Foot_Leveling_<Corner>`: Threaded leveling feet with vulcanized rubber pads.
- `Badge_SREdesigns`: Dedicated plate for the official brand badge.

## 4. Recessed Bezel & Flush Mounting (Zero Wall Clipping)

Screens, membrane keypads, and badges must be seated in dedicated recessed pockets/bezels carved directly into the
chassis. Never allow displays or buttons to intersect solid walls or float in mid-air.

## 5. Ground Plane & Desk Clearance

Leveling feet and base pans must rest exactly on the datum plane ($Y = 0$ local, on top of the lab bench at $Y = 9.0$
lab world), with zero bench clipping or side overhang.

## 6. Strict Standard UI Alignment

**NEVER deviate from the established Gold Standard UI layout (e.g., `centrifuge_twin`) in the name of "efficiency" or
"simplification".** When building the viewer UI (`index.html`, `style.css`), you must conform to the established
standard components (e.g., `<aside class="instrument panel-collapsible">`, CSS variables like `--bg: #0c1016`). Do not
generate generic minimal HTML/CSS shells.

## 7. Closed-Loop Multi-Angle Visual QA Gate (Mandatory for Every Build)

**Every twin build must execute the standardized 6-viewpoint visual audit before signoff.** Refer to `.agents/skills/twin-visual-qa/SKILL.md`.

Before marking any part or twin complete, the agent must:
1. Start the local server (`http://127.0.0.1:8765`).
2. Run the automated CDP/browser verification script capturing all 6 standardized viewpoints:
   - `CAM_ISO`: 3/4 isometric perspective, bench clearance ($Y = 9.0$), seamless room walls.
   - `CAM_FRONT`: Upright typography, zero knob/control display occlusion, brand badge containment.
   - `CAM_SIDE`: Profile silhouette, flush switches/connectors, zero floating parts.
   - `CAM_TOP`: Plate/chamber/rotor layout, genuine 3D fasteners, sample vessel centering.
   - `CAM_EXPLODED`: Vertical separation of assemblies along clean kinematic axes.
   - `STATE_ACTIVE`: Live dynamic state (thermal glow, active RPM counters, parabolic meniscus vortex).
3. Save and visually audit all high-resolution screenshot artifacts (`view_file`).
4. Ensure zero browser console exceptions (`Total exceptions: 0`).
5. Run Python controller unit tests (`python3 <twin>/software/controller/test_controller.py`) with 100% pass rate.

## 8. Diagnostic & Troubleshooting Log Adherence

All agents must strictly cross-reference `.agents/TROUBLESHOOTING_LOG.md` before approving any twin. The audit must specifically test:
- **DIAG-001 (Boundary Containment)**: Outer dimensions of any component $\le 85\%$ of the planar face it is seated on.
- **DIAG-002 (Mesh Occlusion)**: Ensure decorative and canvas planes have positive relative Z clearance over backing boxes.
- **DIAG-003 (Coplanar Z-Fighting)**: No two solid meshes may share an identical planar coordinate. All edge trims must wrap outer perimeters.
- **DIAG-004 (Industrial Fidelity)**: Recreate authentic real-world instrument lineage (e.g. through-panel buttons without fabricated fantasy labels).
- **DIAG-005 (Dynamic Canvas LCD Orientation)**: Canvas textures must set `flipY = false`. Text inverted? Invert UV coordinates on buffer geometry (`uv.setX(i, 1.0 - uv.getX(i))`). Never apply negative scale matrices (`scale.x = -1`).

