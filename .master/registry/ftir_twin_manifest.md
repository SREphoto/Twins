# Manifest — `ftir_twin`

Gold standard. Paths relative to `ftir_twin/` unless noted.

## Runtime (must keep)

| Path                   | Role                                   |
| ---------------------- | -------------------------------------- |
| `software/viewer/`     | Live student app (procedural Three.js) |
| `software/controller/` | State machine + tests                  |
| `scripts/serve.sh`     | Serve viewer                           |
| `scripts/test.sh`      | Unit tests                             |
| `README.md`            | Human quick start                      |

## Specs & Process

| Path                   | Role                                   |
| ---------------------- | -------------------------------------- |
| `docs/control_spec.md` | States, keys, interlocks, optics math  |
| `docs/dimensions.md`   | Units, origin, sizes                   |
| `AGENTS.md`            | Package agent rules                    |

## Key Features

- **Procedural 3D Model (`ftir3d.js`)**: Die-cast aluminum/polymer unibody chassis, recessed display bezel with dynamic CanvasTexture LCD (`flipY = false`), physical tactile keys (`Btn_Background`, `Btn_Scan`, `Btn_Mode`, `Btn_Swivel`), Attenuated Total Reflection (ATR) sampling deck with monolithic Type IIa diamond prism ($IOR = 2.417$), swiveling pressure clamp tower (`Pivot_ATRTower`) with knurled slip-clutch knob and sapphire anvil, internal Michelson interferometer optical bay with Polaris Ever-Glo ceramic IR source ($1200\ ^\circ\text{C}$), HeNe red reference gas laser tube ($632.8\text{ nm}$), KBr beam splitter substrate, fixed gold mirror with kinematic adjusters, moving gold mirror on frictionless electromagnetic voice-coil linear motor, DTGS pyroelectric detector, and dynamic 3D ray tracing.
- **Genuine 3D Fasteners & Connectors**: DIN 912 hex socket screws, DIN 125 washers, vulcanized rubber leveling feet at datum $Y=0$, bench duplex outlet box (`Power_Receptacle_Duplex`), NEMA 5-15P plug, SJTOW cord, rear IEC C14 inlet at $X = -1.40$, cooling fan with exhaust louvers at $X = -1.40$, rocker switch, and communication ports.
- **Physical Simulation & Metrology**: Deterministic Fast Fourier Transform (FFT) interferogram generation and baseline ratioing, mid-IR spectrum generation ($4000\text{ to }400\text{ cm}^{-1}$), automated peak identification of characteristic organic functional groups ($O-H$ stretch, carbonyl $C=O$, aromatic overtones, fingerprint region), and evanescent coupling pressure physics.
- **Workflow & Soundscape (`sfx.js`)**: Voice-coil linear mirror frequency sweep, ratchet detent clicks for slip-clutch knob, relay snaps, power switch clicks, and GLP audit report output.
