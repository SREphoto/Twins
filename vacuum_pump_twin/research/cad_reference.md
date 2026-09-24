# Vacuum Pump — CAD Reference & Assembly Guide

For 3D modeling and digital twin construction of the KNF Laboport N820 diaphragm vacuum pump.

## Assembly Overview

The pump consists of 35+ parts organized into 8 groups:

| Group | Description                   | Parts             |
| ----- | ----------------------------- | ----------------- |
| A     | Pump Head Assembly (×2 heads) | 8 parts per head  |
| B     | Drive Mechanism               | 5 parts           |
| C     | Motor & Power                 | 4 parts           |
| D     | Housing & Enclosure           | 7 parts           |
| E     | Front Panel & Controls        | 6 parts           |
| F     | Exhaust & Silencer            | 3 parts           |
| G     | Seals                         | 2 visible O-rings |
| H     | Hardware                      | 8 housing screws  |

## Overall Dimensions

| Parameter  | Value  |
| ---------- | ------ |
| Width (X)  | 300 mm |
| Depth (Y)  | 160 mm |
| Height (Z) | 210 mm |
| Weight     | 6.5 kg |

## Housing Shape

The housing uses a squircle (rounded rectangle) cross-section:

- Squircle radius: 80 mm → 160 mm width
- Y-scale: 1.5 → 240 mm depth
- Squircle exponent: 3.2
- The actual depth is 160 mm, so the squircle is trimmed at front/rear

## Vertical Stack (Z axis from ground)

| Component     | Bottom Z (mm) | Top Z (mm) | Height (mm) |
| ------------- | ------------- | ---------- | ----------- |
| Rubber feet   | 0             | 15         | 15          |
| Lower housing | 15            | 145        | 130         |
| Upper housing | 145           | 205        | 60          |
| Carry handle  | 205           | 220        | 15          |
| **Total**     | 0             | 220        | 220         |

## Key Component Positions

### Motor & Drive

- Motor centreline Z: ~76 mm from ground
- Motor radius: 42 mm (stator outer)
- Motor length: 90 mm (along Y axis)
- Eccentric offset: 4 mm (Z direction)
- Eccentric radius: 14 mm
- Eccentric length: 12 mm
- Head Y positions: Front +48 mm, Back -48 mm

### Pump Heads

- Diaphragm Z baseline: ~157 mm
- Head stack layers (above diaphragm):
  - Diaphragm protrusion: 4 mm
  - Intermediate plate: 12 mm
  - Head cover: 16 mm
  - Pressure plate: 3 mm
  - Screw head: 5 mm

### Front Panel

- Panel centre height Z: ~86 mm
- Panel tilt: -15 degrees (angled upward)
- Panel Y position: ~108 mm (inside housing front face)

## Component Dimensions

### Pump Head (per head)

| Part               | Diameter (mm) | Height (mm) | Material         |
| ------------------ | ------------- | ----------- | ---------------- |
| Diaphragm          | 50 (approx)   | 4           | PTFE-coated EPDM |
| Intermediate plate | 56            | 12          | PTFE             |
| Head cover         | 56            | 16          | PTFE             |
| Pressure plate     | 50            | 3           | Aluminum         |
| Central screw (M4) | 4             | 20+         | Steel            |
| Locating pin       | 2.8           | 8           | Steel            |
| Valve (poppet)     | 10            | 3           | FFPM             |
| Shim ring          | 12            | 1           | Steel            |

### Motor

| Part                   | Dimension    | Value |
| ---------------------- | ------------ | ----- |
| Stator diameter        | Outer        | 84 mm |
| Stator length          | Axial        | 90 mm |
| Coil end-bell diameter | 70 mm        |       |
| Coil end-bell length   | 15 mm (each) |       |
| Shaft diameter         | 12 mm        |       |
| Cooling fan diameter   | ~60 mm       |       |

### Bearings

| Bearing                   | Outer Dia (mm) | Inner Dia (mm) | Width (mm) |
| ------------------------- | -------------- | -------------- | ---------- |
| Needle roller (eccentric) | 16             | 8              | 10         |
| Thrust bearing            | 20             | 10             | 2          |
| Motor bearing (6200)      | 30             | 10             | 9          |
| Motor bearing (6201)      | 32             | 12             | 10         |

### Vacuum Gauge

| Parameter     | Value      |
| ------------- | ---------- |
| Dial diameter | 50 mm      |
| Body diameter | 42 mm      |
| Body height   | 25 mm      |
| Connection    | 1/8" NPT   |
| Range         | 0–760 mmHg |

### Controls

| Control          | Dimension              | Notes         |
| ---------------- | ---------------------- | ------------- |
| Power switch     | 20 × 12 × 15 mm        | Toggle/rocker |
| Gas ballast knob | 20 mm diameter × 10 mm | Knurled       |
| Status LED       | 6 mm diameter × 3 mm   | Green         |

### Ports & Fittings

| Port         | Standard     | Outer Dia (mm) | Notes                |
| ------------ | ------------ | -------------- | -------------------- |
| Inlet        | KF25 (NW 25) | 25             | Quick-release flange |
| Exhaust port | 20 mm tube   | 20             | Sintered muffler     |
| Power inlet  | IEC C14      | Standard       | Rear panel           |

### Housing

| Part          | Width (mm) | Depth (mm)     | Height (mm) | Material      |
| ------------- | ---------- | -------------- | ----------- | ------------- |
| Lower housing | 160        | 120 (squircle) | 130         | ABS           |
| Upper housing | 160        | 120 (squircle) | 60          | ABS           |
| Carry handle  | 200        | 30             | 15          | Plastic/metal |
| Rubber foot   | 20 dia     | —              | 15          | Rubber        |
| Exhaust grill | 42         | 2              | 32          | Steel         |

### Fasteners

| Fastener          | Size    | Head Type       | Quantity       |
| ----------------- | ------- | --------------- | -------------- |
| Head cover screws | M4 × 20 | Socket head cap | 8 (4 per head) |
| Central screw     | M4 × 25 | Socket head cap | 2 (1 per head) |
| Housing screws    | M4 × 12 | Self-tapping    | 8              |
| Motor bolts       | M5 × 16 | Hex head        | 4              |

## Spring Specifications (Poppet Valves)

| Parameter     | Value               |
| ------------- | ------------------- |
| Wire diameter | 0.3 mm              |
| Coil diameter | 6 mm                |
| Free length   | 6 mm                |
| Active coils  | 4                   |
| Material      | Stainless steel 301 |
| Spring rate   | ~0.5 N/mm           |

## CAD Modeling Notes

### Boolean Operations

The housing requires these Boolean cutouts:

1. Side ventilation slots (4 per side) — 15 × 50 × 5 mm
2. Rear IEC C14 cutout — 50 × 5 × 28 mm
3. Rear exhaust opening — 44 × 5 × 34 mm
4. Front panel angled recess — 100 × 30 × 80 mm at -15°

### Materials Reference

| Material               | Color (RGB)        | Roughness | Metallic |
| ---------------------- | ------------------ | --------- | -------- |
| ABS housing (KNF dark) | (0.2, 0.2, 0.22)   | 0.7       | 0        |
| Aluminum (brushed)     | (0.6, 0.6, 0.62)   | 0.3       | 0.8      |
| Stainless steel        | (0.7, 0.7, 0.72)   | 0.2       | 0.9      |
| Brass                  | (0.7, 0.5, 0.2)    | 0.3       | 0.8      |
| PTFE (white)           | (0.94, 0.94, 0.93) | 0.35      | 0        |
| PVDF (gray)            | (0.65, 0.65, 0.68) | 0.4       | 0        |
| FFPM (black)           | (0.05, 0.05, 0.06) | 0.75      | 0        |
| Rubber                 | (0.05, 0.05, 0.05) | 0.6       | 0        |
| Copper                 | (0.8, 0.4, 0.2)    | 0.25      | 0.9      |
| Valve rubber           | (0.85, 0.25, 0.1)  | 0.6       | 0        |

### Export Settings

- Format: GLB (binary glTF)
- Apply modifiers: Yes
- Bake textures: No (procedural materials)
- Subdivision levels: 2 for housing, 0–1 for small parts
- Bevel width: 0.5–1.5 mm depending on part

## Alternative Model: Welch Wob-L 2522C-01

| Parameter | Value        |
| --------- | ------------ |
| Width     | 254 mm (10") |
| Depth     | 152 mm (6")  |
| Height    | 203 mm (8")  |
| Weight    | 6.8 kg       |
| Motor     | 0.25 kW      |
| Flow      | 18 L/min     |
| Vacuum    | 100 mbar     |

The Welch uses a wobble-piston mechanism instead of a diaphragm but has similar external form factor.

## Alternative Model: Vacuubrand MD 4C

| Parameter | Value                |
| --------- | -------------------- |
| Width     | ~320 mm              |
| Depth     | ~240 mm              |
| Height    | ~240 mm              |
| Weight    | 16.0 kg              |
| Motor     | 0.25 kW              |
| Flow      | 3.4 m³/h (~57 L/min) |
| Vacuum    | 2 mbar               |

The MD 4C is a four-head chemistry diaphragm pump with higher flow and deeper vacuum.

## GrabCAD & 3D Model References

Search these platforms for reference models:

- **GrabCAD:** `grabcad.com/library?q=vacuum+pump` — search for "diaphragm pump", "KNB", "Laboport"
- **TraceParts:** `traceparts.com` — industrial component CAD models
- **Thingiverse:** `thingiverse.com/search?q=vacuum+pump` — 3D printable reference models
- **Printables:** `printables.com/search?q=vacuum+pump` — 3D printable reference models

## Sketchfab / Online 3D Viewers

Search for interactive 3D views:

- `sketchfab.com/tags/vacuum-pump`
- `sketchfab.com/tags/diaphragm-pump`
- `sketchfab.com/tags/laboratory-pump`
