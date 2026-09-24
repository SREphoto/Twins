---
name: piecewise-3d-cad
description:
  Step-by-step procedural CAD and boolean modeling protocol for Blender (bpy) and Three.js machine digital twins.
---

# Piecewise 3D CAD & Boolean Modeling Protocol

This skill provides normative instructions for engineering machine digital twins piece-by-piece using the **Hybrid
CAD-to-Web** pipeline.

## 1. Zero-Defect Dimensional Discipline

- **Scale Standard**:
  - In Blender: `bpy.context.scene.unit_settings.system = 'METRIC'`, scale factor `S = 1.0 / 1000.0` (mm to meters).
  - In Three.js: $1\text{ unit} = 0.1\text{ m} = 100\text{ mm}$ (or $1\text{ unit} = 1\text{ mm}$ with scene root scale
    $0.001$).
- **Datum Origin $(0, 0, 0)$**:
  - The origin MUST be at the bottom-center of the machine base plate on the tabletop surface.
  - In Three.js: $Y = 0$ local (stands directly on the lab bench at $Y = 9.0$ lab world).
  - In Blender: $Z = 0$ local (rests on the ground plane).

## 2. The 8-Stage Piece-by-Piece Assembly Sequence

### Stage 1: Spatial Envelope & Datum Freeze

- Retrieve exact $W \times D \times H$ in millimeters from `docs/dimensions.md` (authored by MDRA from OEM manuals).
- Establish the base bounding box and master clearance envelope.

### Stage 2: Base Plate & Leveling Feet

- Model the structural bottom pan.
- Model 4 individual leveling feet:
  - Threaded brass/steel adjustment stem (`CylinderGeometry`).
  - Knurled adjustment collar.
  - Vulcanized rubber vibration-damping base pad.
  - Leveling feet MUST be positioned squarely beneath the base plate (never protruding past side walls).

### Stage 3: Unibody Outer Chassis

- Extrude or mold the main outer housing.
- Apply subtle fillet bevels ($2\text{--}4\text{ mm}$) to all exterior corners.
- Cut ventilation louvers, heat exhaust grilles, and rear service panels.

### Stage 4: Console & Recessed Pockets (The Anti-Clipping Rule)

- Create the ergonomic sloped user console ($20^\circ \text{--} 35^\circ$).
- **MANDATORY**: Use a Boolean Difference modifier to carve out a recessed pocket for the display bezel:
  - Pocket depth: $1.5\text{--}2.5\text{ mm}$ into the chassis.
  - Inside this carved pocket, seat the `UI_LCD` quad flush with the pocket lip.
  - A screen can NEVER be placed directly over an uncarved solid wall.

### Stage 5: Kinematic Assemblies & Mechanical Pivots

- For any moving part (draft shield sliding glass, doors, centrifuge lid, rotor, motorized elevator lift column):
  - Model the part as an independent object.
  - **Set object origin exactly at the physical axis of rotation or translation**.
  - Name the object `Pivot_<Assembly>` (e.g. `Pivot_DoorLeft`, `Pivot_DoorRight`, `Pivot_Rotor`).

### Stage 6: Fluidics, Glassware & Optics

- Borosilicate glass lathe profiles:
  - Inner and outer wall thickness ($1.8\text{--}2.5\text{ mm}$).
  - Ground glass joints (Standard Taper ST 24/40, ST 29/32) with frosted surface roughness.
  - Condenser cooling coils: helical paths modeled via `CatmullRomCurve3` + `TubeGeometry`.

### Stage 7: Electronics, Membrane Buttons & Badging

- Place dedicated physical button meshes inside the console pocket: `Btn_Tare`, `Btn_Cal`, `Btn_Power`.
- Add status LED light-pipe lenses (`LED_Green`, `LED_Amber`).
- Mount the official `Badge_SREdesigns` on the front nose apron.

### Stage 8: Fasteners, Power & Hardware (Zero Size Limits)

- Model every screw in genuine 3D geometry:
  - Hex socket cap screws (M3, M4) with real internal hexagonal recess depth.
  - Silicone and neoprene sealing gaskets.
  - Rear IEC C14 power socket with ground pin.
  - Grounded black power cord with molded strain relief boot.

## 3. The Semantic Part Taxonomy Contract

Every physical assembly must strictly follow this naming convention:

| Node Name          | Function                | Three.js Runtime Binding                                        |
| :----------------- | :---------------------- | :-------------------------------------------------------------- |
| `Body_Chassis`     | Main unibody housing    | Static mesh with PBR powder-coat plastic material               |
| `UI_LCD`           | Flat display quad       | Receives live HTML5 CanvasTexture (`flipY = false`)             |
| `Btn_<Action>`     | Tactile button mesh     | Attaches Three.js Raycaster click listeners + push animations   |
| `Pivot_<Assembly>` | Movable kinematic joint | Rotates or translates around its local origin                   |
| `Glass_<Part>`     | Transparent glassware   | Receives optical refractive `MeshPhysicalMaterial` ($IOR=1.52$) |
| `Fastener_*`       | Screws, washers, nuts   | Physical hardware solids                                        |
| `Foot_Leveling_*`  | Leveling feet           | Sits on tabletop with zero ground penetration                   |
| `Badge_SREdesigns` | Brand nameplate         | Official SRE badge shader/texture                               |
