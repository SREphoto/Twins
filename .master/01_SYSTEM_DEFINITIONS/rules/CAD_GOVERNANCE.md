# Twins CAD & Web Governance Rules (CGR-3D)

This document establishes the non-negotiable engineering standards for the `Twins` 3D Machine Builder repository.

---

## 1. Dimensional Freeze (Code: 4771-CAD)

- **Status**: ACTIVE & MANDATORY
- **Rule**: Major modifications to exterior bounding dimensions ($W \times D \times H$ mm), chassis aspect ratios, or primary console slopes ($20^\circ\text{--}35^\circ$) require explicit human authorization code **"4771"** (or **"4771-CAD"**).
- **Scope**: Parameter files (`docs/dimensions.md`), Blender solid extrusions (`create_*.py`), and Three.js scene bounds.
- **Reference**: Dimensions are locked to real-world manufacturer service manuals ingested by MDRA.

---

## 2. Zero-Defect Dimensional Discipline & Tabletop Datum

- **Tabletop Datum Plane $(0, 0, 0)$**:
  - The machine origin MUST be placed at the **bottom-center of the base plate**.
  - In Three.js: Local $Y = 0$ rests directly on top of the lab bench ($Y = 9.0$ lab world).
  - In Blender: Local $Z = 0$ rests on the ground plane.
  - No machine part or leveling foot may penetrate or clip into the tabletop surface.
- **Unit Scaling**:
  - Blender: `bpy.context.scene.unit_settings.system = 'METRIC'`, scale factor $S = 1.0 / 1000.0$ (mm to meters).
  - Three.js: $1\text{ unit} = 0.1\text{ m} = 100\text{ mm}$ (or $1\text{ unit} = 1\text{ mm}$ with scene root scale $0.001$).

---

## 3. The Anti-Clipping Rule (Recessed Console Bezels)

- **Rule**: Displays (`UI_LCD`), membrane keypads, and nameplates can **never** be placed directly over an uncarved, solid outer chassis wall.
- **Protocol**:
  1. Use a CAD boolean difference modifier or procedural inset to carve out a recessed bezel pocket.
  2. Depth: $1.5\text{--}2.5\text{ mm}$ into the chassis.
  3. Inside this carved pocket, seat the `UI_LCD` quad flush with the pocket lip.

---

## 4. Strict Semantic Part Taxonomy Contract

Every physical assembly must strictly follow this naming taxonomy across CAD scripts and WebGL runtimes:

| Node Name | Function | Three.js Runtime Binding |
| :--- | :--- | :--- |
| `Body_Chassis` | Main unibody casting | Static mesh with PBR powder-coat plastic material |
| `UI_LCD` | Flat display quad | Receives live HTML5 CanvasTexture (`flipY = false`) |
| `Btn_<Action>` | Tactile button mesh | Attaches Three.js Raycaster click listeners + push animations |
| `Knob_<Action>` | Rotary dial | Receives PointerDrag listeners for continuous angle rotation |
| `Pivot_<Assembly>` | Kinematic moving joint | Rotates or translates around its local mechanical origin |
| `Glass_<Part>` | Optical glassware | Refractive `MeshPhysicalMaterial` ($IOR=1.52$, `transmission=0.96`) |
| `Fastener_*` | Screws, washers, nuts | Physical hardware solids (hex socket M3/M4 with real recess) |
| `Foot_Leveling_*` | Leveling feet pads | Sits squarely on tabletop with zero ground penetration |
| `Badge_SREdesigns` | Brand nameplate | Official SRE badge shader / neutral label |

---

## 5. Performance Report Cards & Session Deliverables

- Every agent session must generate a performance report card saved under `.master/logs/report_cards/`.
- Score honesty is mandatory (1–100). Agents must disclose any guessed dimensions, unverifiable mechanical assumptions, or missing unit test runs.
- Bug fixes must reference an existing or newly logged issue using `Resolved: [ISS-XXX]`.

---

## 6. Anti-AI Sludge & Scientific Claims

- Use precise technical and mechanical terms (e.g. "planetary gear carrier", "borosilicate 3.3 thermal shock expansion coefficient", "optical encoder feedback").
- Do not use marketing hype vocabulary or contrast setups ("not X, but Y"). State facts directly.

---

_Authored under OGA-CAD Master Governance — ChemMate & Twins Systems Engineering._
