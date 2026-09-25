# Centrifuge Subagent Guild Roster
## Specialized Domain Subagents for the Microcentrifuge Digital Twin

Every subagent in this roster owns a distinct physical, software, or pedagogical domain of the centrifuge build. All subagents operate under the supervision of **CBA (Centrifuge Build Architect)** and the governance of **OGA-CAD**.

---

## Master Roster Overview

| # | Subagent Domain | Code Name | Primary Focus | Primary Output Files |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Research & Specs** | `SA-RESEARCH` | OEM manuals, blueprints, parts manifests, electrical schematics | `research/`, `docs/dimensions.md`, `docs/BOM.md` |
| **02** | **Housing & Enclosure** | `SA-HOUSING` | Unibody casting, top deck, lid seat, seams, louvers, leveling feet | `cad/`, `software/viewer/centrifuge3d.js` (Chassis) |
| **03** | **Wiring & Electrical** | `SA-WIRING` | Internal harness, motor power leads, ground lugs, IEC C14, AC cord | `software/viewer/centrifuge3d.js` (Wiring/Power) |
| **04** | **Materials & Shaders** | `SA-MATERIALS` | PBR plastics, brushed stainless 316, anodized aluminum, liquids | `software/viewer/centrifuge3d.js` (Materials/PBR) |
| **05** | **LCD Panel & Display** | `SA-LCD` | Offscreen CanvasTexture (`flipY = false`), live tachometer, bezel inset | `software/viewer/centrifuge3d.js`, `app.js` (Canvas) |
| **06** | **Labels & Markings** | `SA-LABELS` | Serial tags, rating decals, biohazard warnings, `Badge_SREdesigns` | `software/viewer/centrifuge3d.js` (Badges/Decals) |
| **07** | **Environment & Bench** | `SA-ENV` | Lab room, `INSTRUMENT_BENCH`, epoxy tabletop, wall duplex outlet | `software/viewer/centrifuge3d.js` (Room/Desk) |
| **08** | **Controls & Mechanisms**| `SA-CONTROLS` | Push buttons (`Btn_*`), lid hinge pivot, solenoid latch, interlocks | `software/controller/`, `centrifuge3d.js` |
| **09** | **Animation & Physics** | `SA-ANIM` | Angular acceleration curves, rotor spin, fluid meniscus vortex | `software/viewer/app.js` (Physics/Animation) |
| **10** | **Lighting & Photonics**| `SA-LIGHTS` | 3-point scene lights, chamber LEDs, button backlights, shadows | `software/viewer/centrifuge3d.js` (Lights) |
| **11** | **Accessories & Labware**| `SA-ACCESSORIES`| 24-slot tube rack, 1.5mL tubes with flip-caps, pipettes | `software/viewer/centrifuge3d.js` (Rack/Tubes) |
| **12** | **UI Surface** | `SA-UI` | Collapsible panels, tachometer overlays, responsive CSS layout | `software/viewer/index.html`, `style.css` |
| **13** | **UX & Pedagogy** | `SA-UX` | Student workflow, click-and-drag tube handling, audio synthesizer | `software/viewer/app.js`, `sfx.js` |
| **14** | **Real-World Deliverables**| `SA-DELIVER` | Blood/DNA sedimentation protocols, GLP CSV/PDF run logs | `software/viewer/app.js` (Protocols/GLP) |

---

## Detailed Subagent Specifications

### 01. Research & Specs Subagent (`SA-RESEARCH`)
- **Mandate**: Ingests OEM user manuals, service handbooks, and exploded assembly diagrams (Eppendorf 5424 R, Drucker Horizon 24).
- **Deliverables**: Extracts exact bounding box ($290 \times 340 \times 163\text{ mm}$), RCF formulas ($RCF = 1.118 \times 10^{-5} \cdot r \cdot RPM^2$), electrical ratings ($120\text{V} / 60\text{Hz} / 350\text{W}$), and writes `docs/dimensions.md` and `docs/BOM.md`.
- **Constraint**: Zero hallucinated specifications. Every dimension must link to a citation in `research/sources.md`.

### 02. Housing & Enclosure Subagent (`SA-HOUSING`)
- **Mandate**: Constructs the physical structural shell of the centrifuge in procedural Three.js.
- **Deliverables**: Main unibody casting (`Body_Chassis`), base bottom pan, 4 knurled leveling feet with vulcanized rubber pads, rear ventilation exhaust louvers, $2\text{--}4\text{ mm}$ corner fillet bevels, and the deep cylindrical rotor chamber ($R = 0.7$, Depth $= 0.55$).
- **Constraint**: Leveling feet must touch the tabletop datum at local $Y = 0$. Anti-Clipping rule enforced on the $28^\circ$ front console apron.

### 03. Wiring & Electrical Subagent (`SA-WIRING`)
- **Mandate**: Models all internal and external electrical connections.
- **Deliverables**:
  - *Internal*: Three-phase brushless DC motor wiring harness, thermistor sensor leads, lid interlock solenoid harness, ground bonding lugs.
  - *External*: Rear IEC C14 3-pin chassis power inlet with fuse drawer, heavy-duty 3-conductor black power cable with molded strain relief boot, running across the bench to a dual AC wall duplex outlet on the laboratory backsplash.
- **Constraint**: Cable paths must follow real-world physics catenary curves (no straight rigid rods hovering in mid-air).

### 04. Materials & Shaders Subagent (`SA-MATERIALS`)
- **Mandate**: Crafts the physically based rendering (PBR) materials, shaders, and optical properties.
- **Deliverables**:
  - High-impact chemical-resistant polycarbonate casing (`casingPlastic`: roughness 0.38, metalness 0.08).
  - Anodized aircraft-grade 7075-T6 aluminum rotor and chamber bowl.
  - Transparent optical acrylic lid dome (`MeshPhysicalMaterial`: transmission 0.94, roughness 0.05).
  - High-purity polypropylene microcentrifuge tubes (semi-translucent with refraction).
  - Density-stratified liquid shaders (whole blood, buffy coat, plasma, cell lysate, DNA pellet).
- **Constraint**: No flat unshaded materials; contact shadows and subtle ambient occlusion required.

### 05. LCD Panel & Display Subagent (`SA-LCD`)
- **Mandate**: Engineers the digital instrument display and touchscreen HUD.
- **Deliverables**:
  - Offscreen HTML5 `<canvas>` rendered at high DPI ($1024 \times 512$).
  - Bound as `THREE.CanvasTexture` with mandatory `texture.flipY = false`.
  - Live tachometer readouts (`15,000 RPM` / `21,130 xg`), temperature PID indicator (`-10°C` to `+40°C`), countdown timer (`MM:SS`), and balance status indicator.
  - Flush mounting inside the boolean-carved pocket ($1.5\text{--}2.5\text{ mm}$ depth).
- **Constraint**: Never scale negatively (`scale.x = -1`). Invert UV buffer coordinates if typography is mirrored.

### 06. Labels & Markings Subagent (`SA-LABELS`)
- **Mandate**: Authors and places all technical typography, regulatory badges, and safety decals.
- **Deliverables**:
  - Official front apron nameplate: `Badge_SREdesigns`.
  - Laser/Biohazard warning decals on the rotor deck: "MAX 15000 RPM", "AEROSOL-TIGHT", "ALWAYS BALANCE ROTOR".
  - Rear metal foil serial number plate with voltage rating, model code, and CE certification marks.
  - Clear, high-contrast typography printed directly on membrane key faces.
- **Constraint**: Strict avoidance of trademarked OEM logos; generic classroom badging only.

### 07. Environment & Bench Subagent (`SA-ENV`)
- **Mandate**: Constructs the surrounding physical laboratory context.
- **Deliverables**:
  - Solid laboratory bench (`INSTRUMENT_BENCH`) with chemical-resistant black epoxy resin countertop.
  - Backsplash wall with mounted duplex 120V AC electrical outlet box.
  - Architectural lab room floor and wall planes with subtle studio ambient occlusion.
- **Constraint**: Zero black voids; the instrument must exist in an authentic scientific room setting.

### 08. Controls & Mechanisms Subagent (`SA-CONTROLS`)
- **Mandate**: Models physical control switches, pushbuttons, and mechanical moving parts.
- **Deliverables**:
  - 8 modeled keys: `START`, `STOP`, `OPEN`, `SHORT`, `FAST TEMP`, `TIME +/-`, `RPM/RCF +/-`, `TEMP +/-`.
  - Key travel animation (0.015 units downward on click) with tactile spring release.
  - Kinematic lid assembly (`Pivot_Lid`) with local rotation origin along the rear hinge axis.
  - Motorized latch hook and solenoid lock mechanism.
- **Constraint**: Software interlocks: Lid cannot be unlatched while rotor velocity $> 0$.

### 09. Animation & Physics Subagent (`SA-ANIM`)
- **Mandate**: Implements realistic mechanical kinetics, acceleration curves, and fluid dynamics.
- **Deliverables**:
  - Quadratic/exponential motor acceleration ($\tau = 3.5\text{ s}$ to 15,000 RPM) and decel curves ($\tau = 2.8\text{ s}$).
  - Dynamic fluid meniscus deformation (horizontal meniscus transforms into parabolic vertical vortex under high centrifugal force).
  - Lid opening/closing counter-balanced spring damping.
  - Exploded view translation offsets along clean Z/Y axes (`setExplodeAmount`).
- **Constraint**: Animation loops must be decoupled from frame rate, utilizing delta time (`clock.getDelta()`).

### 10. Lighting & Photonics Subagent (`SA-LIGHTS`)
- **Mandate**: Calibrates the optical lighting rig and active emissive indicators.
- **Deliverables**:
  - 3-point laboratory studio lighting (warm key light, cool fill light, subtle rim backlighting).
  - Directional shadow map casting crisp contact shadows onto the epoxy bench.
  - Internal rotor chamber inspection spotlight.
  - Active LED indicator lamps (Green `READY`, Amber `RUNNING`, Red `IMBALANCE_FAULT`).
  - Subtle glowing backlight behind membrane keys and LCD screen.
- **Constraint**: Maintain 60fps WebGL rendering performance without excessive dynamic light counts.

### 11. Accessories & Labware Subagent (`SA-ACCESSORIES`)
- **Mandate**: Creates the peripheral consumables and tools required for centrifugation.
- **Deliverables**:
  - 24-place laboratory tube rack situated adjacent to the centrifuge.
  - 24 individual 1.5 mL / 2.0 mL conical microcentrifuge tubes with hinged flip-caps.
  - Frosted writing surface on tube walls with volumetric graduation tick marks (0.5, 1.0, 1.5 mL).
  - Micropipette and sample transfer tubes.
- **Constraint**: Every accessory must use genuine 3D geometry and sit flush on the bench surface.

### 12. UI Surface Subagent (`SA-UI`)
- **Mandate**: Designs and styles the surrounding web application interface.
- **Deliverables**:
  - Collapsible instrument HUD sidebars conforming to Gold Standard CSS (`--bg: #0c1016`).
  - Speed/time numerical input controls, preset run profiles, and camera preset selectors (Isometric, Front Panel, Top Chamber, Tube Rack).
  - Responsive layout for desktop and tablet screens.
- **Constraint**: Zero intrusive framework dependencies; pure HTML5/CSS3 modern glassmorphism.

### 13. UX & Pedagogy Subagent (`SA-UX`)
- **Mandate**: Curates the student learning journey, Socratic hints, and interactive feedback.
- **Deliverables**:
  - Intuitive click-and-drag or tap-to-load tube insertion from rack to rotor slots.
  - Visual balancing guide highlighting symmetric opposing slots.
  - Comprehensive Web Audio synthesizer (`sfx.js`) generating realistic motor pitch whines, solenoid thuds, and completion chimes.
  - Dynamic warning notifications for improper rotor loading or unlatched lids.
- **Constraint**: Feedback must guide the student through scientific deduction without punitive roadblocks.

### 14. Real-World Deliverables Subagent (`SA-DELIVER`)
- **Mandate**: Connects virtual simulation to authentic scientific research outcomes.
- **Deliverables**:
  - Educational protocol modules:
    - *Blood Fractionation*: Plasma (50%), buffy coat (5%), erythrocyte pellet (45%).
    - *Cellular Fractionation*: Organelle separation and supernatant clarification.
    - *Nucleic Acid Extraction*: Ethanol DNA pellet precipitation.
  - Exportable Good Laboratory Practice (GLP) run audit report (timestamp, operator ID, set RPM, actual RCF, run duration, sample ID, temperature stability log).
  - Downloadable JSON/CSV run telemetry for classroom grading.
- **Constraint**: Sedimentation math and layer percentages must reflect empirical peer-reviewed laboratory values.
