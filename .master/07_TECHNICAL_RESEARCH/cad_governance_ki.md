# KI: CAD Governance & Dimensional Standards (`twins_cad_governance`)

## Core Directives
1. **Rule 4771-CAD**: No agent may modify exterior dimensions ($W \times D \times H$ mm) without authorization code 4771-CAD.
2. **Tabletop Origin**: Origin $(0, 0, 0)$ is fixed at the bottom-center of the base plate on the tabletop surface.
   - Three.js: $Y = 0$ local, stands on bench at $Y = 9.0$ lab world.
   - Blender: $Z = 0$ local, resting on ground plane.
3. **Metric Unit Scale**:
   - Blender: Metric, scale factor $1.0 / 1000.0$ (mm to meters).
   - Three.js: $1\text{ unit} = 0.1\text{ m} = 100\text{ mm}$ (or $1\text{ unit} = 1\text{ mm}$ with scene root scale $0.001$).
4. **Mandatory Report Cards**: Every code/CAD task must conclude with an agent performance report card in `.master/logs/report_cards/`.
