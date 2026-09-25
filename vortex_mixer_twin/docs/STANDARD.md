# Vortex Mixer Digital Twin — Package Normative Standard

## 1. Dimensional Standards & Coordinate System
- **Spatial Bounding Box**: $122.0\text{ mm (Width)} \times 165.0\text{ mm (Depth)} \times 165.0\text{ mm (Height)}$.
- **Datum Plane ($0, 0, 0$)**: Local $Y = 0$ corresponds to the laboratory tabletop surface. The base plate and 4 rubber suction feet sit directly on $Y = 0$ with zero benchtop penetration.
- **Unit Scale**:
  - Three.js: Metric world coordinates where 1 scene unit = 1 mm (root container scaled 0.001 or 1 unit = 0.1 m).

## 2. Semantic Part Taxonomy Contract
All CAD meshes and Three.js scene graph nodes must strictly follow this naming convention:
- `Body_Chassis`: Die-cast zinc alloy main unibody with flared lower skirt and ventilation louvers.
- `Foot_Leveling_FL`, `Foot_Leveling_FR`, `Foot_Leveling_RL`, `Foot_Leveling_RR`: Molded rubber suction cup feet.
- `Pocket_ConsoleBezel`: Recessed pocket carved into chassis with $2.0\text{ mm}$ clearance depth.
- `UI_LCD`: Dynamic offscreen HTML5 Canvas quad (`flipY = false`).
- `Btn_Power`: Standby power push-button.
- `Btn_Timer`: Timer toggle / set push-button.
- `Btn_Pulse`: Pulse interval agitation push-button.
- `Knob_Speed`: Optical rotary encoder dial with knurled grip ring.
- `Switch_Mode`: 3-position chrome bat toggle switch (`TOUCH` / `OFF` / `CONT`).
- `LED_PowerRun`: Dual-color indicator lens (Amber = Standby, Green = Active Mixing).
- `Pivot_CupHead`: High-durability vulcanized rubber cup head with eccentric orbital kinematic axis.
- `Glass_FalconTube`, `Glass_MicroTube`: Optical refractive vessels ($IOR = 1.52$, `transmission = 0.92`).
- `Fluid_VortexMeniscus`: Real-time vertex-deformed liquid mesh.
- `Badge_SREdesigns`: Official diamond-cut metallic brand badge.
- `Fastener_HexM3_*`: Genuine DIN 912 hex socket cap screws and DIN 125 washers.

## 3. UI/UX Conformance
- Strict conformance to the Gold Standard layout: collapsible panels (`<aside class="instrument panel-collapsible">`), CSS variables (`--bg: #0c1016`, `--panel: #141b26`, `--cyan: #00d4e8`), and Web Audio synthesis (`sfx.js`).
