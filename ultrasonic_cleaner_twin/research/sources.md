# Research Sources — Ultrasonic Cleaner

Collected for building a real-world digital twin of an ultrasonic cleaner. Personal research use.

## Primary Reference Products

**Branson 5800** — 5.5 L, 40 kHz, mechanical timer  
**Branson 7800** — 9.5 L, 40 kHz, digital display  
**Elma Elmasonic S 300** — 12.75 L, 37 kHz, digital  
**Elma Elmasonic P 300** — 12.75 L, 37 kHz, with sweep/pulse

General specs used for envelope and behaviour (see `docs/dimensions.md`):

| Item | Value |
|------|-------|
| Frequency | 37–40 kHz (standard) |
| Tank capacity | 5.5 L (Branson 5800), 9.5 L (Branson 7800) |
| Heater power | 100–500 W |
| Ultrasonic power | 100–300 W |
| Timer | 0–30 min (mechanical or digital) |
| Temperature | Ambient to 80°C |
| Transducers | 2–6 PZT piezoelectric elements |

## Source URLs

### Manufacturer Pages
- **Branson (Emerson):** <https://www.emerson.com/en-us/automation/branson>
- **Elma:** <https://www.elma-ultrasonic.com/en/products/>

### Manuals & Documentation
- Branson 5800/7800 operating manual — available via emerson.com
- Elma Elmasonic S/P/Xtra manual — available via elma-ultrasonic.com

### Reference Images
- Manufacturer product media libraries
- Fisher Scientific product pages
- Cole-Parmer product pages

## Physical / Safety Behaviour

- **Cavitation** — high-frequency sound waves create microscopic bubbles that implode
- **Degassing** — removes dissolved gases from liquids
- **Sweep mode** — frequency modulation for uniform cavitation
- **Pulse mode** — intermittent ultrasonic bursts for delicate items
- **Heater** — thermostatic control, overtemp protection
- **Empty tank protection** — heater and ultrasonic disabled if no liquid

## Key Components (BOM)

| Component | Description | Notes |
|-----------|-------------|-------|
| Tank | Stainless steel, welded | 304 SS, 0.8–1.5 mm wall |
| Transducers | PZT piezoelectric elements | Bonded to tank bottom |
| Generator | High-frequency power supply | 37–40 kHz, 100–300 W |
| Heater | Tubular or film heater | 100–500 W |
| Controller | Digital or analog control board | Timer, temp, ultrasonic |
| Display | LED or LCD | Timer, temperature, status |
| Drain valve | Ball valve or petcock | Tank bottom |
| Lid | Stainless steel or plastic | Seals tank |
| Basket | Perforated SS accessory | For small parts |

## Uncertainties / Gaps

1. **Transducer count and placement** — varies by model; 2–6 typical
2. **Generator PCB layout** — not published; treat as black box
3. **Heater element geometry** — tubular or film; not visible externally
4. **Tank wall thickness** — ~0.8–1.5 mm; estimate from weight

## Legal

- Specifications sourced from manufacturer public websites and product literature
- Digital twin uses publicly available dimensions and specifications only
- Avoid trademarked logos/wordmarks in public-facing exports unless licensed