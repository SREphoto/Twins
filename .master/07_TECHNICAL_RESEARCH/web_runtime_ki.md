# KI: WebGL Runtime & Lab Desk Integration (`twins_web_runtime`)

## Three.js Architecture & Performance
1. **Scene Disposal**: When switching machine views or unmounting, traverse scene and dispose all geometries, materials, and textures (`renderer.forceContextLoss()`).
2. **Raycasting**:
   - Filter raycast intersections exclusively to interactive nodes matching `Btn_*` or `Knob_*`.
   - Apply tactile spring push animation on `pointerdown` and release on `pointerup`.
3. **Lab Desk Multi-Machine Switcher**:
   - `lab_viewer/machines/registry.js` contains entries with `id`, `name`, `status: "ready"`, `viewerUrl`.
   - Desk sliding animation: translates current machine $-2.5\text{ m}$ along X, unmounts, translates incoming machine from $+2.5\text{ m}$ to $0.0\text{ m}$.
