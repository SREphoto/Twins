# Research sources

Collected for reverse-engineering a 5424 R–class refrigerated microcentrifuge digital twin. Personal research use.

## Primary reference product

**Eppendorf Centrifuge 5424 R** (refrigerated) with rotor **FA-45-24-11**.

Public specs used for envelope and behaviour (see `docs/dimensions.md`):

| Item              | Value                                  |
| ----------------- | -------------------------------------- |
| Max RPM           | 15,000 (50 rpm steps)                  |
| Max RCF           | ~21,130 × g (with FA-45-24-11)         |
| Capacity          | 24 × 1.5/2.0 mL                        |
| Rotor             | Fixed-angle 45°, max tube Ø 11 mm      |
| Dimensions (R)    | ~290 × 480 × 260 mm (W×D×H)            |
| Height lid open   | ~510 mm                                |
| Weight w/o rotor  | ~21 kg                                 |
| Temperature range | ~−10 °C to 40 °C                       |
| Lid               | Soft-touch close; auto-open end of run |
| Controls          | Keypad variant + digital display       |

## Manuals archived locally

Under `research/manuals/`:

| File                                       | Source                                                | Role                                                       |
| ------------------------------------------ | ----------------------------------------------------- | ---------------------------------------------------------- |
| `eppendorf_5424_operating_manual_ornl.pdf` | ORNL / Eppendorf 5424 operating manual mirror         | Front/rear views, control layout, rotor notes              |
| `eppendorf_5424R_operating_manual.pdf`     | Eppendorf product media (5424 R)                      | R-specific dimensions / operation                          |
| `drucker_horizon_24_service.pdf`           | Drucker Diagnostics HORIZON 24 service                | Spare-parts list pattern, clinical centrifuge construction |
| `allegra_x12_service_ozark.pdf`            | Beckman Allegra X-12/X-15R service (Ozark Biomedical) | Chamber interior callouts, schematics, parts               |
| `ozark_centrifuge_service_8c.pdf`          | Ozark Biomedical service manual                       | Additional service procedures (verify page integrity)      |

## Online source URLs (bookmark)

### Operator / product

- <https://www.eppendorf.com/product-media/doc/en/330723/Centrifugation_Operating-manual_Centrifuge-5424-R.pdf>
- <https://www.eppendorf.com/product-media/doc/en/173548/Eppendorf_Centrifugation_Operating-manual_Centrifuge-5424-R.pdf>
- <https://neutrons.ornl.gov/sites/default/files/lab/Eppendorf%205424%20Centrifuge.pdf>
- <http://www.frankshospitalworkshop.com/equipment/centrifuges_equipment.html> (manual index)
- <http://www.frankshospitalworkshop.com/equipment/centrifuges_service_manuals.html>

### Service / parts / construction patterns

- <https://www.laboratory-equipment.com/media/asset-library/s/e/service-manual-horizon-24-centrifuge-drucker-diagnostics.pdf>
- <https://www.ozarkbiomedical.com/manuals/BX15.pdf> (Allegra X-12/R, X-15R)
- <https://www.ozarkbiomedical.com/pdf/8C_SM.pdf>
- Beckman Allegra chamber notes: drive shaft, tapered sleeve, neoprene boot, rotor detector, thermistor, rim gasket

### Rotor

- FA-45-24-11: 24 places, 45° angle, aerosol-tight aluminum lid, max tube diameter 11 mm, R_max ≈ 8.4 cm (confirm in
  rotor datasheet when refining RCF)

### Physics / safety behaviour (cross-brand)

- RCF ≈ `1.118e-5 × r_cm × RPM²`
- Lid interlock: no open while spinning; no start while open
- Imbalance detection aborts run
- Tacho / speed sensor failure → error
- Emergency lid release access underside (service manuals)

### CAD / visual references (not production twins)

- GrabCAD tag `centrifuge` — incomplete teaching CAD
- Sketchfab laboratory centrifuge props — low poly
- Printables / Thingiverse DIY centrifuges — hobby, not commercial form

## Photo board checklist (to capture into `research/photos/`)

Obtain product photos (official marketing, manuals, or your own unit photos). Aim for:

- [ ] Front, lid closed
- [ ] Front, lid open (chamber + rotor)
- [ ] ¾ view left and right
- [ ] Top down, lid open
- [ ] Rear (IEC inlet, vents, nameplate)
- [ ] Underside (feet, emergency release)
- [ ] Control panel macro (keypad + LCD)
- [ ] Rotor alone + rotor with lid
- [ ] Tube load pattern (balanced 24-place)

## Legal

- Manuals retained for reverse-engineering dimensions and behaviour only.
- Digital twin uses original control software (not OEM firmware dumps).
- Avoid trademarked wordmarks/logos in public-facing exports unless licensed.
