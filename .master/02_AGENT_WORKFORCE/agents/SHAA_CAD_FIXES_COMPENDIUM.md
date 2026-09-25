# SHAA-3D Fixes Compendium: Fast-Reference CAD & WebGL Cookbook

This document collects verified code patterns, diagnostic heuristics, and drop-in fixes for common 3D WebGL and CAD failure modes in `Twins`.

---

## 1. WebGL Context Loss on Viewer Switch
- **Symptom**: `WARNING: Too many active WebGL contexts. Oldest context will be lost` when switching machines on the lab desk.
- **Cause**: Unmounting Three.js canvas without explicitly disposing of geometries, materials, and renderer context.
- **Fix**:
```javascript
function disposeThreeScene(renderer, scene) {
  scene.traverse((node) => {
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
      if (Array.isArray(node.material)) {
        node.material.forEach((m) => m.dispose());
      } else {
        node.material.dispose();
      }
    }
  });
  renderer.dispose();
  renderer.forceContextLoss();
}
```

---

## 2. Inverted Typography on Dynamic Canvas LCD
- **Symptom**: LCD digits and units render mirrored or upside-down on the instrument display quad.
- **Rule**: Never apply a negative scale matrix (`scale.x = -1`), which breaks raycasting and face culling.
- **Fix**:
```javascript
// Step 1: Ensure texture.flipY is false
texture.flipY = false;

// Step 2: If typography is mirrored horizontally, invert the UV coordinates on the quad buffer
const uvAttribute = geometry.attributes.uv;
for (let i = 0; i < uvAttribute.count; i++) {
  uvAttribute.setX(i, 1.0 - uvAttribute.getX(i));
}
uvAttribute.needsUpdate = true;
```

---

## 3. Z-Fighting on Chassis Panels and Display Bezels
- **Symptom**: Flickering visual artifacts where two planar surfaces overlap.
- **Cause**: Display quad and chassis wall sharing the exact same coordinate plane ($Z = 0$).
- **Fix**: Carve a recessed pocket $1.5\text{--}2.5\text{ mm}$ into the chassis, seat the screen inside the pocket, and add a $+0.2\text{ mm}$ positive clearance on decorative overlays.

---

## 4. Black / Dark Artifacts on Refractive Borosilicate Glass
- **Symptom**: Glass draft shields, condensers, or flasks appear black or opaque.
- **Cause**: Missing environment map, wrong refractive index, or incorrect transparency settings.
- **Fix**:
```javascript
const borosilicateGlassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.96,
  opacity: 1.0,
  transparent: true,
  roughness: 0.015,
  metalness: 0.0,
  ior: 1.52, // True optical borosilicate glass
  thickness: 2.0,
  clearcoat: 1.0,
  depthWrite: false, // Prevents z-sorting artifacts through multiple layers
  side: THREE.DoubleSide,
});
```
