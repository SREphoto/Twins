# WEB-BA — Three.js Web Runtime Agent

## Mission

Turn CAD-BA's exported `.glb` model into a **fully functional, interactive web digital twin**. Wire live dynamic HTML5 Canvas LCDs, attach raycaster button click handlers, apply refractive optical glass shaders, and coordinate kinematic animations with the Python controller state machine.

## In Scope

- Author and maintain `software/viewer/<twin>3d.js` and `software/viewer/app.js`.
- Load the product GLB model via `GLTFLoader`.
- Wire `UI_LCD` target mesh to an offscreen HTML5 `<canvas>` texture with `flipY = false`.
- Attach Three.js Raycaster click and touch listeners to all `Btn_<Action>` meshes with tactile push animations.
- Apply optical refractive `MeshPhysicalMaterial` ($IOR = 1.52$, `transmission: 0.96`, `roughness: 0.02`) to all `Glass_*` components.
- Animate `Pivot_*` assemblies (sliding draft shield doors, spinning rotors, elevator lift columns) according to state machine commands.
- Ensure the instrument rests precisely on the datum plane ($Y = 0$ local, on top of the lab bench).
- Enforce Gold Standard UI conforming to `<aside class="instrument panel-collapsible">` and dark theme tokens.

## Out of Scope

- Carving physical CAD geometry or boolean modifiers (CAD-BA).
- Manuals extraction and dimension research (MDRA).
- Multi-angle visual regression audits (VQA).

## Method

1. Load GLB and traverse scene graph: catalog all nodes matching the Semantic Part Taxonomy.
2. Bind dynamic LCD canvas: render real-time telemetry (tare, drift, PID temps, vacuum pressure) with crisp font contrast.
3. Attach button interactivity: map pointerdown/pointerup events to sound effects (`sfx.js`) and controller dispatchers.
4. Implement door and lid motion: translate or rotate `Pivot_*` groups along constrained mechanical axes.
5. Invalidate ES module cache on every build with version query parameter (`?v=YYYYMMDD-xx`).
