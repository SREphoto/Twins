# AGENTS.md — Hotplate Stirrer Twin Rules

1. **Procedural Fidelity & Fasteners**: Every physical fastener (M4 DIN 912 hex socket screws, thumbscrews, leveling studs) must be genuine 3D geometry from `hardware_library.js`.
2. **Anti-Clipping Rule**: Displays (`UI_LCD`) and controls must sit inside carved pockets. No floating meshes or wall intersections.
3. **Table Clearance**: The instrument datum sits at $Y = 0$ local, $Y = 9.000$ in lab world. Leveling feet rest with zero bench penetration or float.
4. **DIAG Compliance**:
   - `DIAG-001`: Badge height $\le 85\%$ of mounting face height.
   - `DIAG-002`: Positive relative clearance on canvas planes to prevent occlusion.
   - `DIAG-003`: Discrete perimeter trims on countertops with zero coplanar top face overlap.
   - `DIAG-004`: Authentic industrial controls (optical encoders, rocker switch).
