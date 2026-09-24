# Research Sources — pH Meter

Collected for building a real-world digital twin of a benchtop pH meter. Personal research use.

## Primary Reference Products

**Mettler Toledo SevenExcellence S470** — 7" touchscreen, 0.001 pH resolution  
**Thermo Scientific Orion Star A320** — Graphic LCD, 0.01 pH resolution  
**Hach HQ430D** — Multi-parameter, 0.01 pH resolution  
**Mettler Toledo SevenCompact S220** — 4.3" touchscreen, 0.001 pH

General specs used for envelope and behaviour (see `docs/dimensions.md`):

| Item | Value |
|------|-------|
| pH range | 0.00–14.00 |
| Resolution | 0.01 or 0.001 pH |
| Accuracy | ±0.002 pH |
| mV range | ±2000 mV |
| Temperature | −5 to 105°C (ATC) |
| Calibration | 1–5 point, auto buffer recognition |
| Display | 7" TFT touchscreen (premium) or graphic LCD (standard) |
| Electrode | Combination glass electrode, BNC or Mini-DIN |

## Source URLs

### Manufacturer Pages
- **Mettler Toledo SevenExcellence:** <https://www.mt.com/us/en/home/products/Laboratory_ph-meter/SevenExcellence.html>
- **Thermo Orion Star:** <https://www.thermofisher.com/us/en/home/industrial/water-analysis-equipment.html>
- **Hach HQ Series:** <https://www.hach.com/hq-series>

### Manuals & Documentation
- Mettler Toledo SevenExcellence manual — available via mt.com
- Thermo Orion Star A320 manual — available via thermofisher.com
- Hach HQ430D manual — available via hach.com

### Reference Images
- Manufacturer product media libraries
- Fisher Scientific product pages
- Cole-Parmer product pages

## Physical / Safety Behaviour

- **High impedance input** — >10¹² Ω for glass electrode
- **Automatic temperature compensation** — via ATC probe
- **Electrode condition monitoring** — slope and offset display
- **Calibration reminder** — configurable time interval
- **GLP compliance** — data logging, user management, audit trail

## Key Components (BOM)

| Component | Description | Notes |
|-----------|-------------|-------|
| Housing | Benchtop enclosure | Plastic/metal |
| Display | 7" TFT or graphic LCD | Touchscreen or keypad |
| Main PCB | High-impedance amplifier + ADC | >10¹² Ω input |
| Electrode input | BNC or Mini-DIN | Combination electrode |
| ATC input | Mini-DIN or RCA | PT1000 or NTC |
| Electrode arm | Articulated arm with holder | Stainless steel |
| Power supply | External AC/DC adapter | 12–24 VDC |
| RS-232 port | DB9 female | Printer/PC |
| USB ports | USB-A + USB-B | Data export, PC |
| Ethernet | RJ45 (optional) | Network/LIMS |

## Uncertainties / Gaps

1. **Internal PCB layout** — not published; treat as black box
2. **Electrode internal construction** — glass membrane + reference; standard design
3. **Electrode arm dimensions** — varies by model; estimate from photos
4. **Display bezel dimensions** — scale from display size specs

## Legal

- Specifications sourced from manufacturer public websites and product literature
- Digital twin uses publicly available dimensions and specifications only
- Avoid trademarked logos/wordmarks in public-facing exports unless licensed