# KI: Kinematics & Mechanical Assemblies (`twins_kinematics_mechanisms`)

## Kinematic Pivot Rules
1. **Mechanical Origin Alignment**: Any moving part (`Pivot_*`) must have its local coordinate origin set directly on the physical axis of rotation or translation line.
2. **Translation Assemblies**: Elevator lift columns, sliding glass panels, and cuvette lids move strictly along local axes (`position.y += delta`, `position.x += delta`).
3. **Rotary Assemblies**: Centrifuge rotors, vacuum pump impellers, and stirrer magnets rotate around their local axis of symmetry (`rotation.y += angularVelocity * dt`).
4. **Collision Envelopes**: Movable parts must never intersect adjacent solid static meshes during any point of their trajectory.
