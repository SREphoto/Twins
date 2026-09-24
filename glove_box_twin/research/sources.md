# Research Sources — Glove Box (Inert Atmosphere)

Collected for building a real-world digital twin of an inert atmosphere glove box. Personal research use.

## Primary Reference Products

**MBraun UNIlab Pro SP** — Standard 2-glove workstation, 36"×24"×30" chamber  
**MBraun LABstar Pro** — Compact 2-glove, 36"×24"×24"  
**MBraun LABmaster Pro** — Modular 2-4 glove, up to 72" wide  
**Vacuum Atmospheres (VAC) OMNI-LAB** — 2-glove, 36"×24"×24"  
**Labconco Protector** — 2-glove, 36"×24"×24" with HEPA/UV

General specs used for envelope and behaviour (see `docs/dimensions.md`):

| Item | Value |
|------|-------|
| Chamber (W×D×H) | 36" × 24" × 24" (standard 2-glove) |
| Overall (with antechamber) | ~48" × 28" × 60" |
| Glove ports | 2 (standard), 4 (dual workstation) |
| Port diameter | 8" (203 mm) |
| Antechamber | ~10" dia × 14" length |
| Purity | < 1 ppm O₂, < 1 ppm H₂O |
| Circulation | 30–100 CFM blower |
| Gas | Argon or Nitrogen (99.999%) |
| Pressure | ±15" H₂O differential |

## Source URLs

### Manufacturer Pages
- **MBraun:** <https://www.mbraun.com/en/products/glovebox-workstations.html>
- **MBraun UNIlab Pro SP:** <https://www.mbraun.com/en/products/glovebox-workstations/unilab-pro-sp>
- **Vacuum Atmospheres:** <https://www.vac-atm.com/>
- **Labconco:** <https://www.labconco.com/category/glove-boxes>
- **Innovative Technology:** <https://www.gloveboxes.com/>

### Manuals & Documentation
- MBraun product brochures available via mbraun.com
- Labconco Protector manuals via labconco.com
- VAC OMNI-LAB documentation via vac-atm.com

### Reference Images
- MBraun product media library (high-res product photos)
- Labconco product gallery
- Fisher Scientific product pages

## Physical / Safety Behaviour

- **Positive pressure** — chamber maintained at slight positive pressure (~0.05–0.15" H₂O)
- **Negative pressure operation** — foot switch for temporary negative pressure (glove work)
- **O₂ depletion hazard** — inert gas displaces oxygen; breathing atmosphere is lethal
- **Glove failure** — automatic inward gas flow >0.5 m/s prevents atmosphere escape
- **Leak tightness** — < 1 vol%/h (MBraun standard)
- **Regeneration** — heated purge with 5% H₂/N₂ at 200–300°C
- **Catalyst columns** — copper catalyst (O₂) + molecular sieve (H₂O)

## Key Components (BOM)

| Component | Description | Notes |
|-----------|-------------|-------|
| Chamber body | Stainless steel or acrylic | Welded SS or clear acrylic |
| Glove ports | Anodized aluminum rings | 8" or 6" diameter |
| Gloves | Butyl rubber, neoprene, or hypalon | Sizes 7–10 |
| Antechamber | SS or acrylic tube | ~10" dia × 14" L |
| Antechamber doors | Hinged with O-ring seal | Inner + outer |
| Purification columns | Catalyst + molecular sieve | O₂ + H₂O removal |
| Circulation blower | 30–100 CFM | Recirculates chamber gas |
| O₂ sensor | Electrochemical or paramagnetic | < 1 ppm |
| H₂O sensor | Capacitive or aluminum oxide | < 1 ppm |
| Pressure gauge | Manometer ±15" H₂O | Analog or digital |
| HEPA filter | 0.3 µm | On gas inlet/outlet |
| Control system | PLC with touch panel | BOSCH (MBraun) or Siemens |

## Uncertainties / Gaps

1. **Exact wall thickness** — SS ~1.5 mm, acrylic ~12.7–25.4 mm
2. **Purification column dimensions** — not published; scale from circulation rate
3. **Internal bracing** — structural reinforcement not visible externally
4. **Antechamber door mechanism** — hinge and latch detail varies by manufacturer
5. **Glove port O-ring groove dimensions** — standard but not published
6. **Control box internal layout** — varies by manufacturer

## Legal

- Specifications sourced from manufacturer public websites and product literature
- Digital twin uses publicly available dimensions and specifications only
- Avoid trademarked logos/wordmarks in public-facing exports unless licensed