---
description: Step-by-step 5-agent workflow for engineering a high-fidelity machine digital twin piece-by-piece.
---

# Design Twin Workflow (5-Agent Piecewise Pipeline)

This workflow guides the creation or overhaul of any machine twin under `Twins/<name>_twin/` using the **Hybrid CAD-to-Web** pipeline.

## Prerequisites

1. Active workspace: `/Users/Samuel/AGapps/Twins`
2. Review the rules in [`.agents/AGENTS.md`](../AGENTS.md).
3. Review the piecewise standards in [`piecewise-3d-cad`](../skills/piecewise-3d-cad/SKILL.md) and [`procedural-materials`](../skills/procedural-materials/SKILL.md).

---

## Phase 1: Research & Dimensional Freeze (MDRA)

1. Find or download the manufacturer operator engineering manual into `<twin>/research/manuals/`.
2. Extract dimensions ($W \times D \times H$ in mm) and write `docs/dimensions.md`.
3. Create the **Parametric BOM** in `docs/BOM.md` cataloging every structural part, moving assembly, fastener type, and UI control.
4. Define the state machine and keypad actions in `docs/control_spec.md`.

---

## Phase 2: Blender CAD Physical Solids (CAD-BA)

1. Author `cad/create_<name>_cad.py` using Blender Python (`bpy`):
   * Enforce metric units ($S = 1.0/1000$ mm to meters).
   * Position datum origin $(0, 0, 0)$ at bottom-center of the base plate.
   * Model unibody shell and **carve recessed pockets** for bezels using Boolean Difference modifiers.
   * Model all moving parts with origins centered at true mechanical axes (`Pivot_*`).
   * Model every screw, washer, and leveling foot in genuine 3D physical geometry (`Fastener_*`, `Foot_Leveling_*`).
   * Name all nodes strictly according to the **Semantic Part Taxonomy Contract**.
2. Run preflight viewport audit:
   * Execute script in Blender.
   * Call `get_viewport_screenshot` via `blender-mcp` to verify pocket depths and clearances.
3. Export high-fidelity GLB to `export/glb/<name>_product.glb`.

---

## Phase 3: Three.js Web Runtime Wiring (WEB-BA)

1. Author `software/viewer/<name>3d.js` and `software/viewer/app.js`.
2. Load `export/glb/<name>_product.glb` using `GLTFLoader`.
3. Traverse the scene graph and bind components:
   * Replace `UI_LCD` material with live dynamic `CanvasTexture` (`flipY = false`).
   * Attach Raycaster click/touch listeners to `Btn_*` meshes with tactile push keyframe animations.
   * Apply optical refractive `MeshPhysicalMaterial` ($IOR=1.52$) to `Glass_*`.
   * Bind `Pivot_*` rotation/translation to the state machine.
4. Mount `Badge_SREdesigns` on the front nose apron.
5. Invalidate ES module caches with version query parameters (`?v=YYYYMMDD-xx`).

---

## Phase 4: Visual QA & Error Audit (VQA)

1. Start development server:
   ```bash
   bash scripts/serve.sh
   ```
2. Trigger the `/verify-twin` workflow using `browser_subagent`.
3. Capture the 4 standardized camera viewpoints:
   * `CAM_ISO`: Isometric overview and shadow grounding.
   * `CAM_FRONT`: Flush LCD bezel and button alignment.
   * `CAM_SIDE`: Base plate ground clearance and leveling feet.
   * `CAM_EXPLODED`: Internal mechanism inspection and zero clipping.
4. Check browser console logs for zero WebGL warnings or JavaScript runtime crashes.

---

## Phase 5: Lab Desk Integration (LIA)

1. Register the machine in `lab_viewer/machines/registry.js` with `status: "ready"`.
2. Configure desk slide animation in `transitionKind`.
3. Verify audio cues in `sfx.js`.
4. Test switching into the machine on `http://127.0.0.1:<PORT>/lab_viewer/`.
