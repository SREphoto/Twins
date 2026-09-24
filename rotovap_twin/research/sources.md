# Research Sources — Rotary Evaporator (Rotovap)

Collected for building a real-world digital twin of a rotary evaporator. Personal research use.

## Primary Reference Products

**Buchi Rotavapor R-300** — Modular system, 5 L max flask, 220°C bath  
**Buchi Rotavapor R-100** — Entry-level, 3 L max flask, 95°C bath  
**IKA RV 10 Digital** — 3 L max flask, programmable  
**Heidolph Hei-VAP Precision** — 3 L max flask, touch display

General specs used for envelope and behaviour (see `docs/dimensions.md`):

| Item | Value |
|------|-------|
| Max flask size | 5 L (R-300), 3 L (R-100, RV 10) |
| Rotation speed | 20–280 rpm |
| Bath temperature | Up to 220°C (R-300), 95°C (R-100) |
| Condenser types | V (vertical), C (coiled), A (angled), S (Soxhlet) |
| Lift | Electric (R-300, R-100), Manual (R-80) |
| Vacuum control | V-300 or V-100 interface (optional) |

## Source URLs

### Manufacturer Pages
- **Buchi R-300:** <https://www.buchi.com/en/products/instruments/rotavapor-r-300>
- **Buchi R-100:** <https://www.buchi.com/en/products/instruments/rotavapor-r-100>
- **IKA RV 10:** <https://www.ika.com/en/Products/Rotary-Evaporators/>
- **Heidolph Hei-VAP:** <https://heidolph-instruments.com/products/rotary-evaporators/>

### Manuals & Documentation
- Buchi R-300 operating instructions — available via buchi.com
- IKA RV 10 manual — available via ika.com
- Heidolph Hei-VAP manual — available via heidolph.com

### Reference Images
- Manufacturer product media libraries
- Fisher Scientific product pages
- Cole-Parmer product pages

## Physical / Safety Behaviour

- **Lift mechanism** — motorized (auto lift at end of run, power failure lift)
- **Rotation** — digital speed control with feedback
- **Bath overtemp** — independent safety thermostat
- **Condenser flooding** — overflow protection via level sensor (optional)
- **Vacuum release** — automatic on power failure
- **Solvent detection** — optional (Buchi FOXX sensor)

## Key Components (BOM)

| Component | Description | Notes |
|-----------|-------------|-------|
| Glass assembly | Evaporation flask, condenser, receiving flask | Borosilicate glass |
| Drive unit | Motor + rotation mechanism | 20–280 rpm |
| Heating bath | Temperature-controlled water/oil bath | Stainless steel, up to 220°C |
| Condenser | Glass coil or cold finger | Various types |
| Lift mechanism | Motorized or manual vertical lift | Electric standard |
| Control panel | 4.3" TFT touchscreen | Main user interface |
| Vacuum controller | V-300 or V-100 (optional) | Digital vacuum regulation |
| Stand | Support frame | Epoxy-coated steel or aluminum |
| PTFE seal | Vacuum seal between flask and drive | PTFE base + FKM lip |

## Uncertainties / Gaps

1. **Glass assembly exact dimensions** — varies by condenser type and flask size
2. **Internal motor and drive mechanism** — not visible externally
3. **Heating bath internal element layout** — not published
4. **Stand base weight/thickness** — stability requirement, estimate from photos
5. **PTFE seal internal geometry** — standard design, size varies by model

## Legal

- Specifications sourced from manufacturer public websites and product literature
- Digital twin uses publicly available dimensions and specifications only
- Avoid trademarked logos/wordmarks in public-facing exports unless licensed