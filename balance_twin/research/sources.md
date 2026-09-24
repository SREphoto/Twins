# Research Sources — Analytical Balance

Collected for building a real-world digital twin of an analytical balance. Personal research use.

## Primary Reference Products

**Mettler Toledo XSE204 / XSR204** — 220 g capacity, 0.1 mg readability  
**Mettler Toledo AE200** — 205 g capacity, 0.1 mg readability (classic hard-key model)  
**Sartorius Cubis II MCA** — 60–1000 g capacity, 0.01 mg readability  
**Ohaus Explorer EX124** — 120 g capacity, 0.1 mg readability

General specs used for envelope and behaviour (see `docs/dimensions.md`):

| Item | Value |
|------|-------|
| Readability | 0.1 mg (standard), 0.01 mg (micro) |
| Capacity | 120–220 g typical analytical |
| Repeatability | 0.08–0.15 mg |
| Calibration | Internal motorized (isoCAL) or external weight |
| Display | 5.7" color TFT touchscreen (modern) or VFD (classic) |
| Draft shield | 3-panel glass (2 side sliding + 1 top) |
| Leveling | 2 front adjustable feet + bubble level / electronic sensor |
| Interfaces | RS-232, USB-A, USB-B, Ethernet (optional), Bluetooth |

## Source URLs

### Manufacturer Pages
- **Mettler Toledo XSE:** <https://www.mt.com/us/en/home/products/Laboratory_Weighing_Solutions/analytical-balances/XSE-Analytical-Balances.html>
- **Mettler Toledo XSR:** <https://www.mt.com/us/en/home/products/Laboratory_Weighing_Solutions/analytical-balances/XSR-Analytical-Balances.html>
- **Sartorius Cubis II:** <https://www.sartorius.com/en/products/weighing/analytical-balances>
- **Ohaus Explorer:** <https://www.ohaus.com/en/products/balances-scales/explorer-balances>

### Manuals & Documentation
- **Mettler Toledo XSE Operating Instructions:** Available via MT.com product page → Downloads
- **Mettler Toledo AE200 Manual:** Available via labequip.com / manualslib.com
- **Sartorius Cubis II User Manual:** Available via sartorius.com product page
- **Ohaus Explorer Manual:** Available via ohaus.com

### Reference Images
- Mettler Toledo product media library
- Labequip.com product galleries
- Fisher Scientific product pages

## Physical / Safety Behaviour

- **Electromagnetic force compensation** — no mechanical knife-edge (modern)
- **Motorized internal calibration weight** — automatic when temperature changes >1.5°C
- **Leveling sensor** — electronic display with guidance; red/green indicator
- **Overload protection** — mechanical stop beneath pan
- **Transport lock** — screw on underside to secure cell during shipping
- **Anti-static kit (optional)** — ionizer bar inside draft shield
- **GLP/GMP compliance** — data logging, calibration reports, user management

## Key Components (BOM)

| Component | Description | Notes |
|-----------|-------------|-------|
| Weighing cell | Electromagnetic force compensation | Core sensor |
| Draft shield | 3 glass panels (tempered) | Left/right slide + top slide |
| Display | 5.7" color TFT or VFD | Varies by model |
| Touchless sensor | Optical hand-wave | Configurable (tare/print/mode) |
| Leveling feet | 2 front adjustable | Knurled knobs |
| Internal weight | Motorized 50–200 g | For isoCAL |
| Pan | Stainless steel, ~80 mm | Removable for cleaning |
| Pan support | Cross or circular | Precision fit to cell |
| RS-232 port | DB9 female | For printer/PC |
| USB ports | USB-A + USB-B | Data export, PC connection |

## Uncertainties / Gaps

1. **Weighing cell internal dimensions** — not published; treat as black box
2. **Draft shield glass thickness** — ~4–6 mm tempered; estimate from photos
3. **Internal calibration weight mass** — 50 g, 100 g, or 200 g depending on model
4. **Full 3D door track mechanism** — internal rail detail not published
5. **Touchscreen bezel dimensions** — vary by model; scale from display size specs
6. **Internal electronics board layout** — not accessible without teardown

## Legal

- Specifications sourced from manufacturer public websites and product literature
- Manuals obtained from public manual archives and manufacturer download portals
- Digital twin uses publicly available dimensions and specifications only
- Avoid trademarked logos/wordmarks in public-facing exports unless licensed