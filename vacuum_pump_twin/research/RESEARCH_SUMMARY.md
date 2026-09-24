# Vacuum Pump Research — Complete Summary

## What Was Researched

I conducted comprehensive research on the **KNF Laboport N820** diaphragm vacuum pump (primary target), plus reference
models (N840, Welch Wob-L 2522C-01, Edwards nXDS10i, Vacuubrand MD 4C).

## Files Downloaded (9 actual files)

### Manuals (6 PDFs in `research/manuals/`)

Downloaded from KNF's official servers and lab equipment distributors:

1. **`BA121209-121371_LABOPORT_AL-en004_0414__2_.pdf`** (617 KB) — KNF Laboport AL operating manual
2. **`BA121722-121728_LABOPORT_SC-en009_0617.pdf`** (1.9 MB) — KNF Laboport SC operating manual
3. **`KNF_Neuberger_Laboport_UN820_840_860.3FT.40P_Operating_Instructions.pdf`** (384 KB) — UN820/840/860 instructions
4. **`KNF_Pump_Diaphragm_N10FT.18_N820FT.18...manual.pdf`** (1.1 MB) — N820/N840 diaphragm pump manual
5. **`KNFn820ft.pdf`** (1.6 MB) — N820 FT series datasheet with specifications
6. **`knf_next_generation_laboport_-_vacuum_pumps_manual.pdf`** (3.4 MB) — Complete next-gen Laboport manual

### Reference Images & Diagrams (3 files in `research/photos/`)

1. **`Diaphragm_pump_animated.gif`** (208 KB) — Animated diaphragm pump operation
2. **`Diaphragm_Type_Pump.jpg`** (903 KB) — Cross-section photo of diaphragm pump
3. **`Membraanpomp.svg`** (11 KB) — Vector diagram of diaphragm pump mechanism

## Documents Created (5 files in `research/`)

### `sources.md` — Research Sources

- Manufacturer URLs: KNF, Welch, Edwards, Vacuubrand
- CAD model resources: GrabCAD, TraceParts, Thingiverse, Printables
- Technical standards: KF25 (ISO 2861), Bourdon gauge (EN 837-1), motor (IEC 60034)
- Complete component table with materials and dimensions
- Internal drive mechanism details (eccentric cam, connecting rod, diaphragm)
- Pump head assembly breakdown (8 parts per head × 2 heads)
- Maintenance procedures and troubleshooting
- Legal/disclaimer section

### `96_Vacuum_Pump.md` — Technical Reference

- Operation principle and physics
- Physical specifications with exact dimensions
- Control panel layout (front/rear/top/bottom)
- Safety systems (thermal overload, pressure relief)
- Materials and finishes reference
- Technical specifications (motor, crank drive, diaphragm, valves, seals)
- Diaphragm pump head components (8 parts detailed)
- Internal drive mechanism diagram (text-based)
- Cross-section view (text-based diagram of entire pump)
- Vacuum gauge details (Bourdon tube, 50mm, 0–760 mmHg)
- Gas ballast system explanation
- NGSS alignment

### `maintenance_guide.md` — Service Documentation

- Safety precautions
- Recommended maintenance schedule (daily through 2–3 years)
- Tools required list
- Step-by-step diaphragm replacement (8 steps with torque specs)
- Valve cleaning procedure (4 steps)
- Gas ballast maintenance
- Vacuum gauge replacement
- Motor replacement procedure
- Complete troubleshooting guide (symptom → cause → solution)
- Torque specifications table (6 fastener types)
- Chemical compatibility chart (7 materials)
- Parts life expectancy table (7 components)

### `schematics.md` — Wiring & Schematics

- Electrical system overview diagram
- Power supply specifications (100–240VAC → 24VDC, 100–120W)
- BLDC motor controller specs
- Motor specifications (60–80W, 24V, 3-phase, 8-pole)
- Wiring diagram (text-based, IEC C14 to motor)
- Connector pinouts (IEC C14, motor connector, potentiometer)
- Fuse specifications (T2A, 250V, 5×20mm)
- EMI filter specs (single-stage, EN 55011 Class B)
- Thermal protection details (motor, PSU, controller)
- Pneumatic/flow schematic (text-based, full gas path)
- Control state machine (OFF → IDLE → RUNNING)
- State transition table
- PCB layout estimates (power board, motor controller, front panel)
- Grounding scheme

### `cad_reference.md` — CAD & Assembly Guide

- Assembly overview (8 groups, 35+ parts)
- Overall dimensions (300W × 160D × 210H mm)
- Housing shape (squircle cross-section)
- Vertical stack dimensions (Z axis from ground)
- Key component positions (motor, drive, pump heads, front panel)
- Component dimensions (pump head, motor, bearings, gauge, controls, ports, housing, fasteners)
- Spring specifications (poppet valves)
- Boolean operations for housing (ventilation slots, cutouts)
- Materials reference (10 materials with color, roughness, metallic values)
- Export settings (GLB, subdivision, bevel)
- Alternative model comparisons (Welch, Vacuubrand)

### `docs/BOM.md` — Enhanced Bill of Materials (updated)

- 7-section BOM: Pump Head, Drive Mechanism, Housing, Controls, Electronics, Accessories, Fasteners
- Each item includes: quantity, description, material, dimensions, notes
- Estimated replacement part numbers section

## Key Technical Specifications Discovered

| Parameter       | Value                                          |
| --------------- | ---------------------------------------------- |
| Motor           | Brushless DC, 60–80W, 24VDC                    |
| Crank drive     | Dual eccentric cams, 4mm offset, counter-phase |
| Diaphragm       | PTFE-coated convoluted EPDM                    |
| Valves          | Conical spring-loaded poppet (FFPM)            |
| Ultimate vacuum | 80 mbar (single stage), 2 mbar (two-stage)     |
| Flow rate       | 15–20 L/min                                    |
| Noise level     | < 50 dB(A)                                     |
| Dimensions      | 300W × 160D × 210H mm                          |
| Weight          | 6.5 kg                                         |
| Bearings        | Needle roller on eccentric, thrust at rod top  |
| Seals           | FFPM and Viton chemical-resistant O-rings      |

## How to Give This to Your Main AI

Copy-paste the following prompt to your main AI:

---

**PROMPT:**

Research has been completed for the vacuum pump digital twin (KNF Laboport N820). All files are in
`vacuum_pump_twin/research/` and include:

**Downloaded files (9 actual files):**

- 6 PDF manuals in `research/manuals/` — KNF Laboport operating manuals, datasheets, and pump documentation (total ~9.5
  MB)
- 3 reference images in `research/photos/` — animated diaphragm pump GIF, cross-section photo, vector diagram

**Created research documents (5 files in `research/`):**

- `sources.md` — All manufacturer URLs, CAD sources, component specs, drive mechanism details, maintenance info, legal
- `96_Vacuum_Pump.md` — Complete technical reference with operation principle, physical specs, control layout,
  cross-section diagram, drive mechanism layout, materials, gas ballast
- `maintenance_guide.md` — Full service documentation: safety, schedules, step-by-step diaphragm replacement (8 steps),
  valve cleaning, troubleshooting guide (13 symptoms), torque specs, chemical compatibility, parts life
- `schematics.md` — Electrical system, wiring diagram, connector pinouts, pneumatic flow schematic, control state
  machine, PCB layout estimates, grounding scheme
- `cad_reference.md` — Complete dimensional specs for all 35+ parts, assembly guide, materials reference (10 materials
  with color/roughness/metallic), Boolean operations, export settings, alternative model comparisons

**Updated document:**

- `docs/BOM.md` — 7-section BOM: Pump Head (×2), Drive Mechanism, Housing, Controls, Electronics, Accessories, Fasteners
  — each with qty, description, material, dimensions, notes, torque specs, replacement part numbers

**Key specs:**

- KNF Laboport N820, oil-free diaphragm, 15 L/min, 80 mbar, 300×160×210 mm, 6.5 kg
- Brushless DC motor 60–80W, 24VDC, dual eccentric cams (4mm offset, counter-phase)
- PTFE-coated EPDM diaphragm, FFPM poppet valves, 8-part head assembly ×2 heads

**Server:** Running at http://127.0.0.1:8765/ with all twin viewers verified.
