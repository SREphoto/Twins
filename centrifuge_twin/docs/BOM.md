# Bill of Materials (v1)

**Product:** MICRO 5424-R class digital twin (refrigerated, keypad)  
**Rule:** One CAD object per line item (or per instance). Naming: `{ID}_{Name}` or `{ID}_{Name}_{nn}`.

Status: `TODO` | `WIP` | `DONE`

**Exact CAD:** run `.venv-cq/bin/python cad/cq/exact_assembly.py` →  
`export/step/MICRO_5424R_EXACT.step`, `export/step/parts/*.step`, `docs/PARTS_MAP.md` (coordinates of every instance).

---

## A — External enclosure

| ID  | Part                          | Qty | Material                     | CAD status |
| --- | ----------------------------- | --- | ---------------------------- | ---------- |
| A01 | Main upper housing shell      | 1   | Powder-coat white plastic    | TODO       |
| A02 | Lower base tub                | 1   | Structural plastic           | TODO       |
| A03 | Front control bezel           | 1   | Dark grey plastic            | TODO       |
| A04 | Rear panel                    | 1   | Plastic + vent pattern       | TODO       |
| A05 | Side molding L                | 1   | Plastic                      | TODO       |
| A06 | Side molding R                | 1   | Plastic (R bulk for cooling) | TODO       |
| A07 | Rubber isolation foot         | 4   | Black NBR                    | TODO       |
| A08 | Foot mounting screw M4×12 pan | 4   | Steel zinc                   | TODO       |
| A09 | Housing screw M3×8 pan        | 16  | Steel zinc                   | TODO       |
| A10 | Nameplate plate               | 1   | Aluminum sticker geom        | TODO       |
| A11 | Warning label biohazard       | 1   | Vinyl plane                  | TODO       |
| A12 | Warning label high-speed      | 1   | Vinyl plane                  | TODO       |
| A13 | Vent grille rear              | 1   | Plastic                      | TODO       |
| A14 | IEC power inlet               | 1   | Plastic + metal pins         | TODO       |

## B — Lid assembly

| ID  | Part                     | Qty | Material             | CAD status |
| --- | ------------------------ | --- | -------------------- | ---------- |
| B01 | Lid outer frame          | 1   | Dark plastic         | TODO       |
| B02 | Smoked viewport window   | 1   | Polycarbonate smoked | TODO       |
| B03 | Viewport gasket          | 1   | Black rubber         | TODO       |
| B04 | Hinge body left          | 1   | Plastic/metal        | TODO       |
| B05 | Hinge body right         | 1   | Plastic/metal        | TODO       |
| B06 | Hinge pin                | 2   | Steel                | TODO       |
| B07 | Hinge screw M3×8         | 4   | Steel                | TODO       |
| B08 | Soft-close damper body   | 1   | Plastic              | TODO       |
| B09 | Front latch hook         | 1   | Plastic              | TODO       |
| B10 | Latch striker (housing)  | 1   | Plastic/metal        | TODO       |
| B11 | Lid handle recess insert | 1   | Soft-touch plastic   | TODO       |
| B12 | Lid interlock cam/magnet | 1   | Plastic + magnet     | TODO       |
| B13 | Lid-closed microswitch   | 1   | Switch body          | TODO       |
| B14 | Latch solenoid assembly  | 1   | Metal/plastic        | TODO       |

## C — Rotor chamber

| ID  | Part                       | Qty | Material         | CAD status |
| --- | -------------------------- | --- | ---------------- | ---------- |
| C01 | Chamber bowl               | 1   | Stainless / alum | TODO       |
| C02 | Chamber rim gasket         | 1   | Black rubber     | TODO       |
| C03 | Chamber floor plate        | 1   | Metal            | TODO       |
| C04 | Motor drive cone           | 1   | Aluminum         | TODO       |
| C05 | Shaft seal / neoprene boot | 1   | Black rubber     | TODO       |
| C06 | Rotor / tacho sensor       | 1   | Sensor body      | TODO       |
| C07 | Chamber thermistor         | 1   | Probe            | TODO       |
| C08 | Chamber mount screw M4×10  | 4   | Steel            | TODO       |
| C09 | Chamber insulation foam    | 1   | Foam (R)         | TODO       |

## D — Rotor + samples (FA-45-24-11 class)

| ID  | Part                       | Qty | Material           | CAD status |
| --- | -------------------------- | --- | ------------------ | ---------- |
| D01 | Fixed-angle rotor body 45° | 1   | Anodized aluminum  | TODO       |
| D02 | Aerosol rotor lid          | 1   | Aluminum           | TODO       |
| D03 | Rotor lid O-ring           | 1   | Rubber             | TODO       |
| D04 | Rotor lid lock knob        | 1   | Plastic/metal      | TODO       |
| D05 | Microtube body 1.5 mL      | 24  | Clear PP           | TODO       |
| D06 | Microtube snap cap         | 24  | Colored PP         | TODO       |
| D07 | Sample liquid meniscus     | 24  | Optional glass mat | TODO       |

\*\*Note:(Tube pockets are features of D01, not separate BOM lines.)

## E — Control panel (keypad)

| ID   | Part                     | Qty | Material                            | CAD status |
| ---- | ------------------------ | --- | ----------------------------------- | ---------- |
| E01  | Console faceplate        | 1   | Dark grey                           | TODO       |
| E02  | LCD module bezel         | 1   | Plastic                             | TODO       |
| E03  | LCD display plane        | 1   | Glass + emissive map                | TODO       |
| E04  | Key start/stop           | 1   | Membrane/plastic                    | TODO       |
| E05  | Key open                 | 1   | Lid release                         | TODO       |
| E06  | Key short                | 1   | Momentary spin                      | TODO       |
| E07  | Key rpm/rcf              | 1   | Toggle display mode                 | TODO       |
| E08a | Key speed up             | 1   |                                     | TODO       |
| E08b | Key speed down           | 1   |                                     | TODO       |
| E09a | Key time up              | 1   |                                     | TODO       |
| E09b | Key time down            | 1   |                                     | TODO       |
| E10a | Key temp up              | 1   | Refrigerated                        | TODO       |
| E10b | Key temp down            | 1   |                                     | TODO       |
| E11  | Key fast temp            | 1   | FT precool run                      | TODO       |
| E12  | Key menu/enter           | 1   |                                     | TODO       |
| E13a | Key menu up              | 1   |                                     | TODO       |
| E13b | Key menu down            | 1   |                                     | TODO       |
| E17  | Monitoring glass (lid)   | 1   | Small viewport for rotor stop check | TODO       |
| E18  | Condensation water tray  | 1   | Front/bottom tray (R)               | TODO       |
| E19  | Emergency release access | 1   | Underside                           | TODO       |
| E20  | Mains switch             | 1   | Rear/side                           | TODO       |
| E21  | Fuse holder              | 1   | Rear                                | TODO       |
| E22  | Service interface port   | 1   | Software updates (dummy)            | TODO       |
| E14  | Status LED run           | 1   | Green emissive                      | TODO       |
| E15  | Status LED fault         | 1   | Red emissive                        | TODO       |
| E16  | Bezel screw M3×6         | 6   | Steel                               | TODO       |

## F — Drive & electronics (envelope detail)

| ID  | Part                         | Qty | Material         | CAD status |
| --- | ---------------------------- | --- | ---------------- | ---------- |
| F01 | Motor housing                | 1   | Metal            | TODO       |
| F02 | Motor mounting plate         | 1   | Steel            | TODO       |
| F03 | Motor mount screw M5×12      | 4   | Steel            | TODO       |
| F04 | Main control PCB             | 1   | FR4 green        | TODO       |
| F05 | Power supply PCB             | 1   | FR4              | TODO       |
| F06 | Wire harness A               | 1   | Bundle           | TODO       |
| F07 | Wire harness B               | 1   | Bundle           | TODO       |
| F08 | Cooling fan + shroud         | 1   | Plastic          | TODO       |
| F09 | Compressor (R)               | 1   | Metal envelope   | TODO       |
| F10 | Condenser coil pack (R)      | 1   | Tube array       | TODO       |
| F11 | Imbalance sensor mount       | 1   | Plastic          | TODO       |
| F12 | Emergency lid release access | 1   | Cap + cable path | TODO       |
| F13 | PCB standoff M3              | 8   | Plastic/metal    | TODO       |

## R — Bench tube rack (digital twin lab)

| ID  | Part                        | Qty | Material                    | CAD status |
| --- | --------------------------- | --- | --------------------------- | ---------- |
| R01 | Microtube rack body 4×6     | 1   | PP / acrylic                | TODO       |
| R02 | Rack well / sleeve          | 24  | features of R01             | TODO       |
| R03 | Rack feet                   | 4   | Rubber/plastic              | TODO       |
| R04 | Tube liquid volume (visual) | 24  | Transparent material layers | TODO       |

## G — Fastener library (parametric masters)

Model once under `cad/library/fasteners/`, instance in assemblies.

| ID  | Part                    | Spec                            |
| --- | ----------------------- | ------------------------------- |
| G01 | Pan head Phillips screw | M2×4, M2×6                      |
| G02 | Pan head Phillips screw | M3×6, M3×8, M3×10, M3×12        |
| G03 | Socket cap screw        | M3×8, M4×8, M4×10, M4×12, M5×12 |
| G04 | Countersunk screw       | M3×8, M4×10                     |
| G05 | Flat washer             | M3, M4, M5                      |
| G06 | Lock washer             | M3, M4                          |
| G07 | Hex nut                 | M3, M4                          |
| G08 | Plastic push rivet      | Ø5 panel clip                   |

---

## Instance totals (approx.)

| Category                | Unique types | Instances      |
| ----------------------- | ------------ | -------------- |
| A Enclosure             | 14           | ~40+           |
| B Lid                   | 14           | ~20            |
| C Chamber               | 9            | ~12            |
| D Rotor/tubes           | 7            | ~75            |
| E Controls              | 16           | ~20            |
| F Drive                 | 13           | ~20            |
| G Fasteners (library)   | 8 families   | many instances |
| **Rough total objects** |              | **~200+**      |

## Modeling order

1. G fasteners + materials
2. A enclosure + feet
3. C chamber
4. D rotor + tubes
5. B lid
6. E keypad + LCD plane
7. F drive bay (cutaway)
