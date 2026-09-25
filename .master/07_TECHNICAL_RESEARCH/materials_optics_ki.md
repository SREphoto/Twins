# KI: Materials & Laboratory Optics (`twins_materials_optics`)

## Canonical PBR Material Presets
- **Casing Plastic**: `MeshStandardMaterial({ color: 0xf2f4f8, roughness: 0.38, metalness: 0.08, envMapIntensity: 1.0 })`
- **Dark Housing**: `MeshStandardMaterial({ color: 0x16191f, roughness: 0.45, metalness: 0.12 })`
- **Brushed Stainless 316**: `MeshStandardMaterial({ color: 0xd8dadf, roughness: 0.18, metalness: 0.88, envMapIntensity: 1.5 })`
- **Anodized Aluminum**: `MeshStandardMaterial({ color: 0x8a929e, roughness: 0.28, metalness: 0.75 })`
- **Vulcanized Rubber**: `MeshStandardMaterial({ color: 0x111315, roughness: 0.92, metalness: 0.02 })`
- **Optical Borosilicate Glass 3.3**:
  `MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.96, opacity: 1.0, transparent: true, roughness: 0.015, metalness: 0.0, ior: 1.52, thickness: 2.0, clearcoat: 1.0, depthWrite: false, side: THREE.DoubleSide })`

## Dynamic Canvas LCD Standards
- Render offscreen `<canvas>` at $1024 \times 512$ or $2048 \times 1024$ for crisp anti-aliased digits.
- Mandatory: `texture.flipY = false`.
- Linear background gradient (`#0a141e` to `#04080e`), monospace measurement text (`#00e5ff` or `#ffffff`).
