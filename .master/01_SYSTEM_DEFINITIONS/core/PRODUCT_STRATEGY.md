# Twins Product Strategy: SRE Laboratory Digital Twin Ecosystem

## 1. Vision & Core Mission

`Twins` is the precision 3D engineering workshop for ChemMate. It produces photorealistic, procedurally generated, and interactive digital twins of real-world scientific instruments. These digital twins power ChemMate's virtual laboratories, giving students and researchers authentic tactile, kinematic, and quantitative instrument experience before they ever enter a physical laboratory.

---

## 2. Core Pillars of Execution

### Pillar 1: Zero-Defect Dimensional Discipline
Instruments are never guessed or artistically approximated. Every dimension ($W \times D \times H$ mm) is extracted directly from original manufacturer (OEM) service manuals by MDRA. Tabletop origins ($Y = 0$) and mechanical clearances are strictly verified.

### Pillar 2: Exhaustive Procedural Detail
Every screw, washer, leveling foot, ventilation louver, and fluidic joint is modeled in genuine 3D physical geometry. We reject flat normal-map baking of critical mechanical parts.

### Pillar 3: Interactive Kinematics & Decoupled State
Machines are not static statues. Centrifuges spin with real angular acceleration curves; rotovap elevator columns raise and lower via motorized kinematic pivots; digital balances react dynamically to sample masses. Controllers are written in decoupled Python and ES modules with 100% automated test coverage.

### Pillar 4: SRE Neutral Branding & Classroom Parity
To guarantee open educational deployment without OEM trademark disputes, LIAR clears branding and mounts the official neutral `Badge_SREdesigns` across all instrument front aprons.

---

## 3. Product Deliverables & Output Formats

1. **Standalone Package Viewers**: Each machine package (e.g. `centrifuge_twin/`) contains its own relocatable HTTP viewer (`scripts/serve.sh` -> `/viewer/`).
2. **The Lab Desk (`lab_viewer/`)**: A multi-machine interactive workbench where users can slide instruments on and off the shared lab bench and interact with multiple machines concurrently.
3. **ChemMate Virtual Lab Integration**: Exportable Three.js/R3F procedural modules ready for direct embedding into ChemMate's curriculum modules.
