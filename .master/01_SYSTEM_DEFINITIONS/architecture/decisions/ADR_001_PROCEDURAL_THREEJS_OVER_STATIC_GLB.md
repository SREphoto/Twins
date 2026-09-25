# ADR 001: Procedural Three.js Meshes Over Monolithic Static GLBs

- **Status**: ACCEPTED
- **Date**: 2026-07-25
- **Deciders**: OGA, BC, WEB-BA, CAD-BA

## Context
When engineering 3D digital twins for interactive web deployment in ChemMate, developers face a choice between:
1. Exporting a single, monolithic, pre-baked `.glb` / `.gltf` binary from Blender or CAD software.
2. Generating the 3D meshes procedurally in Three.js (or composing modular procedural assemblies).

In early trials with `centrifuge_twin` (documented in `centrifuge_twin/docs/PIPELINE.md`), baking the entire machine into a single static GLB created major bottlenecks:
- Inability to dynamically swap PBR materials (e.g. changing glass refraction or dynamic heating plate colors) without re-exporting.
- Difficulty targeting individual child nodes for kinematic animation and Raycaster click listeners.
- Heavy download payloads and WebGL asset decimation issues on mobile devices.

## Decision
Twins adopts a **Hybrid Procedural Standard**:
1. All core assemblies, kinematics, and display bezels must be generated or bound via procedural Three.js primitives and materials.
2. If external meshes are imported, they must be broken into discrete, semantic parts adhering to the Semantic Part Taxonomy (`Body_Chassis`, `UI_LCD`, `Pivot_*`).
3. Under no circumstances may a monolithic, unseparated GLB be used as the sole interactive mechanism for a machine twin.

## Consequences
- **Positive**: Direct runtime control over materials, live canvas textures, and kinematic joints; zero reliance on fragile binary asset paths; instant re-theming.
- **Negative**: Requires rigorous procedural math and coordinate alignment in Three.js scripts.
