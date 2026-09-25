# 🌪️ Vortex Build Guild: 14 Specialized Subagents Roster

Every subagent is an autonomous domain expert responsible for a distinct slice of the **Vortex Mixer Digital Twin** (`vortex_mixer_twin`). All subagents report directly to **VBA (Vortex Build Architect)** and adhere to the governance rules enforced by **OGA-CAD**.

---

## Constellation Overview

| ID | Agent Name | Domain Focus | Primary Target Artifacts |
| :--- | :--- | :--- | :--- |
| `SA-01` | **Research & Specs** | OEM Manuals & BOM | `docs/dimensions.md`, `docs/BOM.md` |
| `SA-02` | **Housing & Enclosure** | Die-Cast Unibody & Bezels | `software/viewer/vortex_mixer3d.js` |
| `SA-03` | **Wiring & Electrical** | Shaded Pole Motor & Drive | `software/viewer/vortex_mixer3d.js` |
| `SA-04` | **Materials & Shaders** | PBR Coatings & Glass Optics | `software/viewer/vortex_mixer3d.js` |
| `SA-05` | **LCD Panel & Display** | High-DPI CanvasTexture | `software/viewer/app.js` |
| `SA-06` | **Labels & Markings** | SRE Badge & Silkscreen | `software/viewer/vortex_mixer3d.js` |
| `SA-07` | **Environment & Bench** | Datum $Y=0$ & Lighting Rig | `software/viewer/app.js` |
| `SA-08` | **Controls & Mechanisms** | Toggle Switch & Rotary Dial | `software/controller/vortex_controller.py` |
| `SA-09` | **Vortex Physics** | Parabolic Meniscus & Wave | `software/viewer/vortex_mixer3d.js` |
| `SA-10` | **Lighting & Photonics** | Status LED & ACES Filmic | `software/viewer/app.js` |
| `SA-11` | **Accessories & Labware** | 15mL Falcon & 1.5mL Tubes | `software/viewer/vortex_mixer3d.js` |
| `SA-12` | **UI Surface** | Collapsible Console & GLP | `software/viewer/index.html`, `style.css` |
| `SA-13` | **UX & Audio Synth** | Web Audio Motor Harmonics | `software/viewer/sfx.js` |
| `SA-14` | **Real-World Deliverables**| GLP Logging & Telemetry | `software/viewer/app.js` |

---

## Detailed Subagent Profiles

### SA-01: Research & Specs Subagent (`SA-RESEARCH`)
- **Mission**: Ingest OEM technical specifications (Scientific Industries Vortex-Genie 2 Digital, IKA MS 3 Digital).
- **Core Parameters**:
  - Footprint: $122.0\text{ mm (W)} \times 165.0\text{ mm (D)} \times 165.0\text{ mm (H)}$.
  - Orbit Diameter: $4.0\text{ mm}$ circular orbit ($2.0\text{ mm}$ eccentricity).
  - Speed Range: $200\text{--}3200\text{ RPM}$ electronic feedback control.
  - Weight: $4.0\text{ kg}$ cast zinc base for high vibration dampening.

### SA-02: Housing & Enclosure Subagent (`SA-HOUSING`)
- **Mission**: Procedurally generate the zinc die-cast lower chassis unibody, stepped motor collar, top rubber shroud, and 4 vulcanized rubber suction feet contacting Tabletop Datum $Y = 0$.
- **Anti-Clipping Rule**: Carve flush $2.0\text{ mm}$ recessed pocket for the sloped front console panel.

### SA-03: Wiring & Electrical Subagent (`SA-WIRING`)
- **Mission**: Model internal shaded pole AC motor, brass eccentric counterweight spindle, 3-position toggle switch bat, and rear IEC C14 power inlet socket with integral fuse drawer.

### SA-04: Materials & Shaders Subagent (`SA-MATERIALS`)
- **Mission**: Author PBR materials: textured polyester powder coat (`roughness: 0.52, metalness: 0.12`), vulcanized cup rubber (`roughness: 0.88`), brushed aluminum (`roughness: 0.32, metalness: 0.85`), and high-transparency borosilicate glass (`transparent: true, opacity: 0.28, depthWrite: false`).

### SA-05: LCD Panel & Display Subagent (`SA-LCD`)
- **Mission**: Maintain the $1024 \times 512$ high-DPI HTML5 dynamic CanvasTexture. Enforce `flipY = false` (DIAG-005). Renders digital RPM tachometer, countdown timer, pulsing status indicators, and GLP audit telemetry.

### SA-06: Labels & Markings Subagent (`SA-LABELS`)
- **Mission**: Render crisp silkscreen markings on the sloped console plate (`TOUCH`, `OFF`, `CONTINUOUS`), DIN fastener accents, and the canonical official `makeSREdesignsBadge` brand plate.

### SA-07: Environment & Bench Subagent (`SA-ENV`)
- **Mission**: Position the instrument resting on the tabletop bench plane ($Y=0.0$). Construct key, fill, and rim lighting with PCF soft shadow maps and ACES Filmic tone mapping.

### SA-08: Controls & Mechanisms Subagent (`SA-CONTROLS`)
- **Mission**: Bind interactive 3D pointer events to physical meshes (`Btn_Switch_Mode`, `Knob_SpeedEncoder`, `Btn_Timer`, `Btn_Pulse`, `Btn_Power`, `Pivot_CupHead`). Synchronize tactile feedback with the Python state machine controller.

### SA-09: Vortex Physics Subagent (`SA-PHYSICS`)
- **Mission**: Model genuine forced vortex fluid mechanics:
  $$z(r) = z_0 + \frac{\omega^2 r^2}{2g}$$
  Liquid climbs the tube wall as centrifugal force pulls the central air cone downward to the vortex eye, forming a hollow paraboloid with 3-lobe helical swirling wave ripples ($\sin(3\theta - \omega t)$) and an inner air core spindle.

### SA-10: Lighting & Photonics Subagent (`SA-LIGHTS`)
- **Mission**: Dual-color status LED dome (`Body_LED_PowerRun`) transitioning between amber standby (`#f59e0b`) and active mixing green (`#22c55e`), with dynamic emissive intensity.

### SA-11: Accessories & Labware Subagent (`SA-ACCESSORIES`)
- **Mission**: 15 mL conical Falcon centrifuge tube with printed volumetric white graduations and blue screw cap, plus 1.5 mL microcentrifuge tube with integral snap-cap hinge.

### SA-12: UI Surface Subagent (`SA-UI`)
- **Mission**: Build the Gold-Standard collapsible side inspector (`instrument panel-collapsible`), GLP run log audit table, responsive viewport canvas, and telemetry cards.

### SA-13: UX & Audio Synthesizer Subagent (`SA-UX`)
- **Mission**: Web Audio API oscillator bank synthesizing multi-harmonic AC motor hum ($60\text{ Hz}$ base + $120/240\text{ Hz}$ harmonics), toggle snap, dial detent clicks, and tube glass chatter.

### SA-14: Real-World Deliverables Subagent (`SA-DELIVER`)
- **Mission**: Maintain the real-time GLP analytical run audit log with timestamps, mode, actual RPM, run duration, and solvent type. Exportable telemetry state.
