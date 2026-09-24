---
name: procedural-materials
description:
  Standardized PBR materials, optical borosilicate glass shaders, and dynamic canvas LCD textures for Three.js and
  Blender digital twins.
---

# Procedural Materials & Optics Standards

This skill defines the canonical PBR material presets, refractive glass parameters, and dynamic canvas LCD rendering
techniques for chemistry lab digital twins.

## 1. Laboratory PBR Material Library

```javascript
export const LabMaterials = {
  // Powder-coated chemical-resistant polymer casing
  casingPlastic: (color = 0xf2f4f8) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.38,
      metalness: 0.08,
      envMapIntensity: 1.0,
    }),

  // Dark instrument bezel & recessed housing
  darkHousing: () =>
    new THREE.MeshStandardMaterial({
      color: 0x16191f,
      roughness: 0.45,
      metalness: 0.12,
    }),

  // Laboratory grade 316 brushed stainless steel (weighing pans, centrifuge rotors)
  brushedStainless: () =>
    new THREE.MeshStandardMaterial({
      color: 0xd8dadf,
      roughness: 0.18,
      metalness: 0.88,
      envMapIntensity: 1.5,
    }),

  // Anodized aluminum (brackets, knobs, structural columns)
  anodizedAluminum: (color = 0x8a929e) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.28,
      metalness: 0.75,
    }),

  // Vulcanized non-slip rubber (leveling foot pads, gaskets)
  vulcanizedRubber: () =>
    new THREE.MeshStandardMaterial({
      color: 0x111315,
      roughness: 0.92,
      metalness: 0.02,
    }),

  // Optical borosilicate glass 3.3 (draft shields, flasks, condensers)
  borosilicateGlass: () =>
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      opacity: 1.0,
      transparent: true,
      roughness: 0.015,
      metalness: 0.0,
      ior: 1.52, // True borosilicate glass refractive index
      thickness: 2.0, // Optical depth in scene units
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      depthWrite: false, // Prevents z-sorting artifacts through multiple glass layers
      side: THREE.DoubleSide,
    }),

  // Tactile membrane switch buttons (normal state)
  membraneButton: (color = 0x242832) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.5,
      metalness: 0.05,
    }),

  // Status indicator LEDs
  statusLED: (color = 0x00ff66) =>
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 2.5,
      roughness: 0.1,
    }),
};
```

## 2. Dynamic Canvas LCD & OLED Screens

Never use static bitmap images for instrument displays. Use an offscreen HTML5 `<canvas>` bound as a
`THREE.CanvasTexture`:

### Critical Technical Rules

1. **`texture.flipY = false`**: Mandatory when binding canvas to Three.js PBR materials or imported GLTF quads to
   prevent upside-down or mirrored typography.
2. **High-DPI Internal Resolution**: Render canvas at $1024 \times 512$ or $2048 \times 1024$ for crisp anti-aliased
   digits, even when camera zooms in close.
3. **Subtle Backlight Glow**: Draw a slight gradient background (`#08121a` to `#04080d`) with faint scanline contrast
   and active primary digits (`#00e5ff` or `#ffffff`).

```javascript
export function createDynamicLCDTexture(width = 1024, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  function update(state) {
    // 1. Dark glowing LCD background
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#0a141e');
    grad.addColorStop(1, '#04080e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Primary Measurement Digits (e.g. 0.0000 g)
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 110px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(state.readingText || '0.0000', width - 120, height / 2 + 40);

    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(state.unitText || 'g', width - 95, height / 2 + 35);

    // 3. Status Flags (Stability, Tare, Net)
    ctx.font = '28px sans-serif';
    ctx.fillStyle = state.isStable ? '#00ff88' : '#ffaa00';
    ctx.fillText(state.isStable ? '● STABLE' : '○ STABILIZING...', 60, 80);

    texture.needsUpdate = true;
  }

  return { texture, update };
}
```

## 3. Official Canonical Brand Nameplate: `makeSREdesignsBadge()`

Every machine twin must carry the official SREdesigns badge on its front nose apron or service plate:

```javascript
export function makeSREdesignsBadge(width = 0.55, height = 0.14) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Brushed titanium backdrop
  const grad = ctx.createLinearGradient(0, 0, 512, 128);
  grad.addColorStop(0, '#1c1f26');
  grad.addColorStop(0.5, '#2c323d');
  grad.addColorStop(1, '#1a1d24');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 128);

  // Subtle border bevel
  ctx.strokeStyle = '#3a4454';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 506, 122);

  // SRE Logo Text
  ctx.fillStyle = '#00e5ff';
  ctx.font = 'bold 52px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SRE DESIGNS', 256, 52);

  ctx.fillStyle = '#8a99ad';
  ctx.font = 'bold 22px monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('VIRTUAL LABS', 256, 92);

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;

  const geo = new THREE.PlaneGeometry(width, height);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.25,
    metalness: 0.8,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'Badge_SREdesigns';
  return mesh;
}
```
