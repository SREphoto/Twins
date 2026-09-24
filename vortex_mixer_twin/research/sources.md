# Research Sources — Vortex Mixer

Collected for building a real-world digital twin of a vortex mixer. Personal research use.

## Primary Reference Products

**Scientific Industries Vortex-Genie 2** — 1000–3200 rpm, touch/continuous  
**IKA MS 3 Digital** — 200–3000 rpm, digital display  
**Thermo Scientific LP Vortex Mixer** — Fixed speed, touch operation  
**VWR Analog Vortex Mixer** — Variable speed, 200–3000 rpm

General specs used for envelope and behaviour (see `docs/dimensions.md`):

| Item | Value |
|------|-------|
| Speed range | 200–3200 rpm |
| Operation | Touch (press to run) or continuous |
| Orbit diameter | ~4 mm (typical) |
| Cup head | Rubber cup, ~30 mm opening |
| Flat head (optional) | Foam pad for tubes/plates |
| Weight | ~10 lb (4.5 kg) |

## Source URLs

### Manufacturer Pages
- **Scientific Industries:** <https://www.scientificindustries.com/vortex-genie-2.html>
- **IKA:** <https://www.ika.com/en/Products/Vortex-Shakers/>
- **Thermo Fisher:** <https://www.thermofisher.com/>
- **VWR:** <https://us.vwr.com/>

### Manuals & Documentation
- Vortex-Genie 2 operating manual — available via scientificindustries.com
- IKA MS 3 manual — available via ika.com
- VWR vortex mixer manual — available via vwr.com

### Reference Images
- Manufacturer product media libraries
- Fisher Scientific product pages
- Cole-Parmer product pages

## Physical / Safety Behaviour

- **Eccentric drive** — motor with offset weight creates orbital vibration
- **Touch-start** — runs only when downward pressure applied
- **Continuous mode** — runs unattended at set speed
- **Suction feet** — 4 rubber suction cups for bench stability
- **Automatic shutoff** — thermal protection on motor overload

## Key Components (BOM)

| Component | Description | Notes |
|-----------|-------------|-------|
| Motor | AC induction or DC | 200–3200 rpm |
| Eccentric weight | Offset mass on motor shaft | Creates vibration |
| Cup head | Rubber cup, ~30 mm | For individual tubes |
| Flat head (optional) | Foam pad | For plates/multiple tubes |
| Speed control | Potentiometer or encoder | Variable speed |
| Mode switch | 3-position (touch/off/on) | Selects operation mode |
| Power switch | Rocker switch | Rear panel |
| Housing | Die-cast metal or plastic | Painted |
| Suction feet | 4 | Rubber, 30 mm dia |
| PCB | Speed control and motor drive | Triac or PWM |

## Uncertainties / Gaps

1. **Motor exact dimensions** — standard small motor; scale from housing
2. **Eccentric weight geometry** — internal; not visible
3. **Speed control circuit** — varies by model; standard triac or PWM
4. **Rubber cup head durometer** — ~40–60 Shore A, standard material

## Legal

- Specifications sourced from manufacturer public websites and product literature
- Digital twin uses publicly available dimensions and specifications only
- Avoid trademarked logos/wordmarks in public-facing exports unless licensed