# Research Sources — Vacuum Pump (Diaphragm)

Collected for building a real-world digital twin of a laboratory diaphragm vacuum pump. Personal research use.

## Primary Reference Products

| Model | Type | Flow Rate | Ultimate Vacuum | Power | Weight |
|-------|------|-----------|-----------------|-------|--------|
| **KNF Laboport N820** | Oil-free diaphragm | 15 L/min | 80 mbar | 0.25 kW | 6.5 kg |
| **KNF Laboport N840** | Oil-free diaphragm | 20 L/min | 60 mbar | 0.30 kW | 8.0 kg |
| **Welch Wob-L 2522C-01** | Oil-free piston | 18 L/min | 100 mbar | 0.25 kW | 6.8 kg |
| **Edwards nXDS10i** | Scroll pump | 10 L/min | 0.01 mbar | 0.20 kW | 10.0 kg |
| **Vacuubrand MD 4C** | Diaphragm pump | 3.4 m³/h | 2 mbar | 0.25 kW | 16.0 kg |

## Primary Model Target: KNF Laboport N820

Oil-free diaphragm vacuum pump, 15 L/min, 80 mbar ultimate vacuum.

### General Specifications

| Item | Value |
|------|-------|
| Type | Oil-free diaphragm (primary) |
| Flow rate | 15–20 L/min |
| Ultimate vacuum | 80 mbar (single stage), 2 mbar (two-stage) |
| Power | 0.25 kW |
| Inlet | KF25 or 1/4" Swagelok |
| Weight | 6.5 kg (N820) |
| Dimensions | 300W × 160D × 210H mm |
| Noise Level | < 50 dB(A) |
| Operating Temperature | 5–40°C |
| Motor | Brushless DC, maintenance-free, 60–80W |

## Source URLs

### Manufacturer Pages

- **KNF:** https://knf.com/en/us/products/laboratory-pumps/
- **Welch:** https://www.welchvacuum.com/en-us/products/
- **Edwards:** https://www.edwardsvacuum.com/en-us/pumps/
- **Vacuubrand:** https://www.vacuubrand.com/en/products/
- **Vacuubrand Shop (MD 4C):** https://shop.vacuubrand.com/en/diaphragm-pumps/chemistry-diaphragm-pumps.html

### Manuals & Documentation

- **KNF Laboport N820 operating manual** — available via knf.com support section
- **Welch Wob-L manual** — available via welchvacuum.com support
- **Vacuubrand MD 4C manual** — available via vacuubrand.com downloads
- **Vacuubrand diaphragm/valve replacement guide:** https://www.vacuubrand.com/en/news/bloguebersicht/changing-diaphragms-and-valves
- **Vacuubrand FAQ:** https://www.vacuubrand.com/en/service-advice/tips-tools/faq-laboratory-vacuum-technology
- **Vacuubrand vacuum pump selection guide:** https://www.vacuubrand.com/en/service-advice/tips-tools/vacuum-pump-selection-guide
- **Vacuubrand vacuum technology applications:** https://www.vacuubrand.com/en/service-advice/tips-tools/vacuum-technology-applications
- **Edwards nXDS maintenance:** https://www.edwardsvacuum.com/en-us/vacuum-pumps/services/vacuum-pump-do-it-yourself-maintenance
- **Edwards parts:** https://www.edwardsvacuum.com/en-us/vacuum-pumps/services/vacuum-pump-parts
- **Edwards repair/rebuild:** https://www.edwardsvacuum.com/en-us/vacuum-pumps/services/vacuum-pump-repair-rebuild

### CAD & 3D Model Resources

- **GrabCAD:** https://grabcad.com/library?q=vacuum+pump (search for "vacuum pump" — various models available)
- **TraceParts:** https://www.traceparts.com (CAD model library — search for vacuum pump components)
- **Thingiverse:** https://www.thingiverse.com/search?q=vacuum+pump (3D printable models)
- **Printables:** https://www.printables.com/search?q=vacuum+pump (3D printable models)

### Reference Images

- Manufacturer product media libraries
- Fisher Scientific product pages: https://www.fishersci.com/
- Cole-Parmer product pages: https://www.coleparmer.com/
- Google Images: KNF N820, Welch 2522C, Vacuubrand MD 4C cross-section views

### Technical Standards

- **KF25 Flange Standard:** ISO 2861 (NW 25 quick-release flange, 25 mm bore)
- **Bourdon Tube Gauge:** EN 837-1 (0–760 mmHg / 0–1013 mbar)
- **Vacuum Measurement:** mbar absolute (SI), mmHg (conventional)
- **Motor Standards:** IEC 60034 (rotating electrical machines)

## Physical / Safety Behaviour

- **Oil-free operation** — no oil changes, no exhaust mist
- **Diaphragm** — PTFE-coated for chemical resistance
- **Gas ballast** — reduces condensate buildup
- **Overload protection** — thermal cutout on motor
- **Chemical resistance** — PTFE/FFKM wetted materials
- **Noise level** — < 50 dB(A) with muffler
- **Operating temperature** — 5–40°C ambient

## Key Components (BOM)

| Component | Description | Material | Notes |
|-----------|-------------|----------|-------|
| Motor | Brushless DC or AC induction | — | 60–80W (BLDC), 0.25 kW (AC) |
| Diaphragm head (×2) | PTFE-coated diaphragm | PTFE/EPDM | Reciprocating, convoluted |
| Valves (×4) | Inlet/outlet check valves | PTFE/FFPM | Conical spring-loaded poppet |
| Pump head body (×2) | Cylindrical head housing | PTFE/PVDF | With gas channels |
| Intermediate plate (×2) | Valve seat plate | PTFE | Houses poppet valve seats |
| Pressure plate (×2) | Clamping plate | Aluminum | Distributes clamping force |
| Connecting rod (×2) | Eccentric drive link | Steel | Dual, counter-phase |
| Eccentric cam (×2) | Offset cam on shaft | Steel | 4 mm offset |
| Needle bearing (×2) | Roller bearing | Steel | On eccentric journals |
| Thrust bearing (×2) | Between rod & diaphragm | Brass/Steel | — |
| Rotor shaft | Central drive shaft | Steel | Runs through both heads |
| Shaft coupling | Motor-to-shaft coupler | Aluminum + rubber | With elastomer spider |
| Vacuum gauge | Bourdon tube | Brass/Steel | 0–760 mmHg, 50 mm dial |
| Power switch | Toggle or rocker | — | Front panel |
| Gas ballast knob | Knurled rotary | Plastic | Front panel |
| Housing (lower) | Body shell | ABS plastic | Dark gray, textured |
| Housing (upper) | Top cover | ABS plastic | Dark gray, textured |
| Carry handle | Top handle | Plastic/metal | 200×30×20 mm |
| Rubber feet (×4) | Anti-vibration | Rubber | — |
| Exhaust muffler | Sintered metal | Porous metal | Rear panel |
| Inlet port | KF25 flange | PVDF/Stainless | Front panel |
| Power supply | AC-DC converter | — | Internal |
| EMI filter | Line filter | — | Internal |
| IEC C14 inlet | Power connector | — | Rear panel |
| O-rings (×2) | Diaphragm seal | FFPM/Viton | At diaphragm clamp joints |

## Internal Drive Mechanism Details

Based on KNF N820 dual-head counter-phase design:

| Component | Specification |
|-----------|--------------|
| Crank drive | Coaxial motor shaft, dual eccentric cams |
| Eccentric offset | 4 mm (provides diaphragm stroke) |
| Connecting rods | Steel (Pleuel), dual counter-phase |
| Diaphragm type | Convoluted PTFE-coated EPDM rubber |
| Valve type | Conical spring-loaded poppet (FFPM) |
| Seals | FFPM and Viton chemical-resistant O-rings |
| Bearings | Needle roller on eccentric, thrust at rod top |

## Pump Head Assembly (8 parts per head)

1. **Central Screw**: M4 socket head cap screw clamping the pressure plate
2. **Pressure Plate**: Distributes clamping force over PTFE cover
3. **Head Cover**: PTFE cylinder with gas channels and PVDF ports
4. **Valve Plates/Seals**: Conical FFPM check valves (intake/discharge)
5. **Locating Pin**: Positioning pin to align head cover
6. **Intermediate Plate**: Houses poppet valve seats and gas ballast path
7. **Diaphragm**: Convoluted elastomer diaphragm flexing to expand/contract chamber
8. **Shim Rings**: Steel depth-adjustment washers for dead clearance volume

## Maintenance Information

### Diaphragm Replacement Procedure (Vacuubrand reference)
1. Remove pump head cover (4 screws)
2. Remove pressure plate and old diaphragm
3. Clean valve seats and intermediate plate
4. Install new diaphragm, ensuring correct orientation
5. Reassemble head cover with new O-ring seal
6. Torque screws to specification (typically 2–4 Nm for M4)
7. Test for leaks and proper vacuum

### Recommended Maintenance Schedule
- **Diaphragm inspection**: Every 6 months or 3000 operating hours
- **Valve cleaning**: Every 3 months or as needed
- **O-ring replacement**: Annually
- **Full rebuild**: Every 2–3 years depending on usage

### Troubleshooting
- **Low vacuum**: Check diaphragm for cracks, valve seats for debris
- **Excessive noise**: Check bearings, connecting rod wear
- **Overheating**: Check cooling fan, ambient temperature
- **Leaking**: Check O-rings, head cover seal, inlet connections

## Uncertainties / Gaps

1. **Internal diaphragm geometry** — not published; standard reciprocating design
2. **Motor specifications** — power known, exact dimensions estimated
3. **Valve plate design** — internal; not visible without disassembly
4. **Gauge internal mechanism** — standard Bourdon tube
5. **Exact bearing part numbers** — estimated from typical sizes
6. **PCB layout / electronics schematic** — not publicly available
7. **Motor winding configuration** — not published

## Legal

- Specifications sourced from manufacturer public websites and product literature
- Digital twin uses publicly available dimensions and specifications only
- Avoid trademarked logos/wordmarks in public-facing exports unless licensed
- Manuals retained for reverse-engineering dimensions and behaviour only
- Digital twin uses original control software (not OEM firmware dumps)