# Research Sources — Muffle Furnace

Collected for building a real-world digital twin of a muffle furnace. Personal research use.

## Primary Reference Products

**Nabertherm L 9/11** — 1100°C, 9 L chamber  
**Nabertherm L 3/11** — 1100°C, 3 L chamber  
**Carbolite ELF 11/14B** — 1100°C, 14 L  
**Thermo Scientific Lindberg/Blue M** — 1100–1200°C, various sizes

Primary reference model for 3D: **Nabertherm L 9/11** (matches existing Blender model proportions).

General specs used for envelope and behaviour (see `docs/dimensions.md`):

| Item | Value |
|------|-------|
| Max temperature | 1100 °C or 1200 °C |
| Chamber (L 9/11) | 235 × 240 × 170 mm (W×D×H) |
| External (L 9/11) | 415 × 455 × 515 mm (+240 mm door overhang) |
| Heating | Ceramic heating plates (two or three sides) |
| Controller | Digital PID with auto-tune, ramp/soak |
| Door | Flap door (work platform) or lift door |
| Thermocouple | Type N (1100 °C) or Type S (1200 °C) |

## Source URLs

### Manufacturer Pages
- **Nabertherm:** <https://nabertherm.com/en/products/laboratory-furnaces/>
- **Nabertherm L-series:** Catalog available on nabertherm.com
- **Carbolite Gero:** <https://www.carbolite-gero.com/products/>

### Manuals & Documentation
- Nabertherm laboratory catalog (PDF) — saved locally as `research/manuals/nabertherm_laboratory_catalog.pdf`
- Carbolite ELF manual — available via carbolite-gero.com
- Thermo Scientific Lindberg/Blue M — available via thermofisher.com

### Reference Images
- Nabertherm product media library
- Thermo Fisher product pages
- Fisher Scientific product pages

## Physical / Safety Behaviour

- **Heating elements** — ceramic heating plates on two or three sides
- **Door interlock** — heater cuts off when door opens (on some models)
- **Over-temperature limiter** — adjustable cutout temperature
- **Protective gas connection** — optional for non-flammable process gases
- **Exhaust** — chimney, chimney with fan, or catalytic converter (optional)

## Key Components (BOM)

| Component | Description | Notes |
|-----------|-------------|-------|
| Ceramic heating plates | Embedded heating elements | Two or three sides |
| Insulation | Ceramic fiber (alumina-silica) | 4-8" thick |
| Hearth plate | Alumina or recrystallized SiC | Chamber floor |
| Door | Flap or lift type | Flap doubles as work platform |
| Thermocouple | Type N or Type S | Temperature feedback |
| PID controller | Digital with ramp/soak | Auto-tune |
| SSR relay | Solid state output | Heater power control |
| Chimney/exhaust | Optional vent | Natural or fan-assisted |

## Uncertainties / Gaps

1. **Insulation thickness** — not explicitly published; ~4-8" estimated
2. **Heating element geometry** — embedded in ceramic plates; internal structure not visible
3. **Door hinge mechanism** — varies by model; estimate from photos
4. **Controller internal PCB** — not accessible without teardown
5. **Chimney dimensions** — optional; scale from catalog photos

## Legal

- Specifications sourced from manufacturer public websites and product literature
- Nabertherm catalog PDF downloaded from public product page
- Digital twin uses publicly available dimensions and specifications only
- Avoid trademarked logos/wordmarks in public-facing exports unless licensed