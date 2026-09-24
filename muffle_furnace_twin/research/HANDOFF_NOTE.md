# Muffle Furnace Gold-Tier Upgrade — Handoff Note

## Overall Project Goal

The ChemKitchen LabFactory is building a complete virtual chemistry laboratory with 66 instruments (59 existing + 7 new)
that must operate with **real-world functional, physical, and UI fidelity**. The goal is to achieve **NGSS/NGCC
accreditation** so the virtual lab can be used as a real chemistry lab for homeschooling — eliminating the need for
expensive home chemistry kits. Every instrument must look, feel, and behave like its real-world counterpart.

## Required Skills (READ THESE FIRST)

The following project-local skills must be loaded and followed:

- **`skills/lab-equipment-3d/SKILL.md`** — The primary pipeline skill. Covers Blender scripting patterns, naming
  conventions (`Btn_*`, `Lid_*`, `LED_*`, `Foot_*`), coordinate system mapping (Blender +Z up → Three.js +Y up),
  hinge/animation patterns, material system, and showcase template structure.
- **`skills/blender/SKILL.md`** — Blender-specific conventions and headless CLI export patterns.
- **`skills/blender-mcp/SKILL.md`** — MCP integration for Blender if needed for debugging.
- **`skills/3d-web-experience/SKILL.md`** — Three.js, WebGL, and interactive 3D scene best practices.
- **`skills/threejs-3d-graphics/SKILL.md`** — Three.js rendering pipeline (bloom, tone mapping, post-processing).

## Key Reference Documents (READ BEFORE CODING)

### `docs/INSTRUMENT_ERRORS_AND_FIXES.md`

Past bugs that MUST be avoided:

- **LCD screens must be Plane primitives** (not cubes) for clean UV mapping ✅ (already done in gold script)
- **Canvas texture: set `flipY = false`** on the CanvasTexture in Three.js
- **Button labels must use contrasting material** (not same color as bezel) ✅ (done)
- **All interactive meshes must have semantic `Btn_*` names** for Raycaster ✅ (done)
- **Always implement Raycaster** — the 3D model must be a functional control interface, not a static prop

### `docs/MASTER_INSTRUCTION_MANUAL.md`

Gold-tier rendering requirements for the showcase:

- **Tone mapping:** `NeutralToneMapping` (NOT ACESFilmic — current showcase uses wrong one)
- **Post-processing:** `UnrealBloomPass` (strength: 0.3, radius: 0.4, threshold: 0.85)
- **Lighting:** 5-point studio setup (key, fill, rim, bottom hemisphere, accent spot)
- **Environment:** PMREM from HDR or `RoomEnvironment` for physically-correct reflections
- **Modifier stack:** `export_apply=True` to bake Bevel + Subdiv + Weighted Normals ✅ (done)
- **Interactive checklist:** orbit controls, auto-rotate, wireframe, explode, x-ray, feature cards, raycaster buttons,
  LCD CanvasTexture, LED toggling, moving parts (door hinge)

### `docs/INSTRUMENT_CONTROLS_MASTER_SPEC.md`

Defines the required control panel elements for each instrument category. The muffle furnace falls under "Thermal
Processing" instruments requiring:

- PID temperature controller with PV/SV display
- Programmable ramp/soak segments
- Door interlock safety
- Over-temperature alarm/cutoff

### Other references

- **Research:** `completed_assets/Muffle_Furnace/58_Muffle_Furnace.md`
- **Conventions:** `LAB_CONVENTIONS.md` — Blender→Three.js pipeline, coordinate systems, naming
- **Accreditation Plan:** see conversation `f2c607ef` artifacts for NGSS gap analysis

## Status: BLENDER SCRIPT DONE ✅ — SHOWCASE HTML DONE ✅

## What Was Completed

### New Blender Script: `create_muffle_furnace_gold.py`

- **Location:** `completed_assets/Muffle_Furnace/create_muffle_furnace_gold.py`
- **GLB exported to:** `public/models/procedural/muffle_furnace.glb` (0.33 MB, 88 objects, 17 materials)
- **Run command:**
  `/Applications/Blender.app/Contents/MacOS/Blender --background --python completed_assets/Muffle_Furnace/create_muffle_furnace_gold.py`

### Improvements in Gold script over original `create_muffle_furnace.py`:

1. **Correct export path** — uses 3-step dirname to reach LabFactory root
2. **`export_apply=True`** — bakes all modifiers (Bevel etc.) into mesh
3. **Foot\_\* rubber pads** — proper naming per skill spec (was casters before)
4. **Visible MoSi₂ heating elements** — 6 glowing vertical rods on chamber side walls
5. **Refractory hearth plate** — Al₂O₃ flat plate on chamber floor per research
6. **Proper Btn\_\* naming** — all buttons use Btn\_ prefix for raycaster matching
7. **LED\_\* status indicators** — LED_Heat, LED_Ready, LED_Error per spec
8. **Btn_Program** — for ramp/soak programmable segments
9. **LED PV/SV blocks** — dual display blocks for process value / setpoint
10. **Chimney with damper ring** — torus ring at top
11. **Door viewport window** — small observation port (Nabertherm style)
12. **Power cable entry** — rear bottom with rubber clamp
13. **Badge plate** — brand plate on front
14. **Better proportions** — 380×460×430mm based on 9L research specs
15. **100mm ceramic fibre insulation** — realistic wall thickness

## What Still Needs To Be Done

### 1. New Showcase HTML (`muffle_furnace_showcase.html`)

The existing showcase needs these upgrades based on research + skill spec:

#### Rendering Pipeline

- Change `ACESFilmicToneMapping` → `NeutralToneMapping` (Gold spec)
- Add `EffectComposer` + `UnrealBloomPass` for heating element glow
- Add HDR environment support (or keep studio lighting)

#### Door Hinge Fix

- Current showcase uses `lidPivot.rotation.y` (swings sideways like a book)
- Should use `lidPivot.rotation.x` (swings upward/away) — muffle furnaces have a front-hinged door that swings DOWN or
  opens like an oven
- Actually per research: muffle furnace doors typically swing LEFT (book-style) on left-side hinges, so `rotation.y` IS
  correct but the pivot position needs recalculating for the new geometry

#### Door Interlock Safety

- When door slider > 10%, heater should AUTO-OFF (research: "Door interlock — heater off when door opens")
- Show toast: "⚠️ Door interlock: heater disabled"
- Prevent START when door is open

#### Over-Temperature Safety

- If currentTemp > 1100°C (max for Type K thermocouple), auto-stop
- Show error LED and toast

#### Ramp/Soak Program Editor

- Research says "Programmable (up to 8–16 segments)"
- Add a simple segment editor in the side panel:
  - Each segment: target temp + hold time
  - Run through segments sequentially
  - Display current segment on LCD

#### LCD Updates

- Show PV (process value = current temp) and SV (setpoint value = target temp)
- Show ramp rate (°C/min)
- Show current segment number if running a program

#### New Button Mappings (raycaster names changed)

```
Btn_Power   → toggle power
Btn_Start   → start run
Btn_Stop    → stop run  (NEW — separate from Start)
Btn_TempUp  → increase target temp by 50°C
Btn_TempDn  → decrease target temp by 50°C
Btn_TimeUp  → increase timer by 5 min
Btn_TimeDn  → decrease timer by 5 min
Btn_Program → cycle through program segments editor
```

#### Element Glow

- Heating elements are now named `Element_L_0`, `Element_L_1`, `Element_L_2`, `Element_R_0` etc.
- Should glow orange→white based on temperature
- Chimney_Inner should also glow during high-temp runs

#### Feature Cards Update

- Add "Hearth Plate" feature card
- Add "Heating Elements" feature card
- Update camera targets for new geometry proportions

#### Status Bar

- Add: Setpoint display
- Add: Ramp rate (°C/min)
- Add: Program segment indicator

### 2. Copy GLB to local showcase folder

The showcase HTML currently loads from `./muffle_furnace.glb` (relative). Need to either:

- Copy GLB to `completed_assets/Muffle_Furnace/muffle_furnace.glb` for local dev
- Or update MODEL_PATH to `../../public/models/procedural/muffle_furnace.glb`

## Key Files

| File                                                            | Purpose                                 |
| --------------------------------------------------------------- | --------------------------------------- |
| `completed_assets/Muffle_Furnace/create_muffle_furnace_gold.py` | NEW Gold-tier Blender script            |
| `completed_assets/Muffle_Furnace/create_muffle_furnace.py`      | OLD original script (keep as reference) |
| `completed_assets/Muffle_Furnace/muffle_furnace_showcase.html`  | EXISTING showcase (needs full rewrite)  |
| `completed_assets/Muffle_Furnace/58_Muffle_Furnace.md`          | Research data                           |
| `public/models/procedural/muffle_furnace.glb`                   | Exported GLB (0.33 MB)                  |
| `skills/lab-equipment-3d/SKILL.md`                              | Skill spec to follow                    |

## Technical Notes

- Blender coordinate: +Z up, +Y forward (front face with controls)
- Three.js/GLTF: +Y up, -Z forward
- Door hinges are on LEFT side → `rotation.y` for book-style swing in Three.js
- All parts parented to root empty "Muffle_Furnace"
- Wire trays are direct children (no sub-empties in gold version)
