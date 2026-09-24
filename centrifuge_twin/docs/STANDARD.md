# Lab instrument digital twin — STANDARD

This is the **reference process** for every chemistry-lab machine twin (centrifuge first, then balances, hotplates,
spectrophotometers, etc.).

Lab twins live under the **`Twins/`** parent workspace. The centrifuge package (`centrifuge_twin/`) is the gold sample.
New machines are **sibling folders** under `Twins/` — they copy this package’s structure, not anything from a
BlenderProc or other render monorepo.

```text
Twins/
  .master/             # process, agents, logs
  lab_viewer/          # master lab desk + machine picker
  scripts/serve.sh     # serve workspace → /lab_viewer/
  centrifuge_twin/     # gold sample
  <name>_twin/         # next instrument
```

**Lab desk (all machines):** from Twins root, `./scripts/serve.sh` → `http://127.0.0.1:8765/lab_viewer/`.  
Register ready twins in `lab_viewer/machines/registry.js`.

**How the centrifuge was actually built** (stages, kept artifacts, dead ends): [`PIPELINE.md`](PIPELINE.md). Read that
before inventing a new GLB-first path.

---

## 1. Product definition (write first)

Before geometry or code, freeze a one-page product brief:

| Field               | Example (centrifuge)                                     |
| ------------------- | -------------------------------------------------------- |
| Class / form factor | Refrigerated benchtop microcentrifuge, 5424 R class      |
| Audience            | Chemistry students + AI tutor agents                     |
| Delivery            | Digital only (web app + optional CAD exports)            |
| Units               | CAD: mm, 1:1. Viewer: scene units ≈ 100 mm               |
| Branding            | Generic product name; SRE nameplate if applicable        |
| Non-goals           | Full OEM firmware clone; physical manufacturing drawings |

Store research under `research/` (manuals, extracted text, `sources.md`).

---

## 2. Package layout (required)

```text
<machine>_twin/                 # e.g. centrifuge_twin — relocatable root
  AGENTS.md                     # rules for AI agents
  README.md                     # human quick start
  requirements.txt              # optional Python tools
  requirements-cq.txt           # CadQuery (if used)
  scripts/
    serve.sh                    # static web server for viewer
    test.sh                     # unit tests
  research/
    manuals/  manuals_extracted/  photos/  sources.md
  docs/
    STANDARD.md                 # this file (or link to shared standard)
    ARCHITECTURE.md
    control_spec.md
    dimensions.md
    BOM.md
    samples_and_rack.md         # if samples apply
    HOWTO_BUILD_DIGITAL_TWIN.md # narrative case study
  standards/
    build_viewer.md
    build_controller.md
    build_cad.md
    machine_template.md         # checklist for the next instrument
  software/
    controller/                 # pure Python state machine + tests
    lcd/                        # optional headless display render
    viewer/                     # ★ primary student experience
      index.html  style.css  app.js  *3d.js  sfx.js  models/
  cad/                          # optional
    cq/                         # CadQuery sources
    assemble_*_glb.py
  export/                       # generated artifacts (see export/README.md)
    step/  mesh/  glb/  renders/
    _history/                   # optional: labeled dead-end experiments
```

**Relocatable rule:** every path is relative to `<machine>_twin/`. No imports from `Twins/` siblings, from a BlenderProc
monorepo, or from any other parent.

---

## 3. Architecture layers

```text
┌─────────────────────────────────────────────┐
│  viewer/  (Three.js + HTML UI)              │  students + AI tutors live here
│  - scene / materials / keys / lab rack      │
│  - state machine in JS (or WASM later)      │
└──────────────────▲──────────────────────────┘
                   │ same semantics
┌──────────────────┴──────────────────────────┐
│  controller/  (pure Python)                 │  tests + optional headless sims
│  - states, interlocks, RCF, samples         │
└──────────────────▲──────────────────────────┘
                   │ optional
┌──────────────────┴──────────────────────────┐
│  cad/cq + export/                           │  STEP/STL/GLB parts library
└─────────────────────────────────────────────┘
```

### Rules

1. **Interactive fidelity beats CAD purity.** Prefer a procedural Three.js product model that wires cleanly to controls
   over a heavy GLB that is hard to animate.
2. **One behavioral truth.** Document states in `control_spec.md`. Python tests lock safety interlocks; JS implements
   the same transitions for the app.
3. **CAD is a library, not the runtime.** STEP/BOM for documentation and future manufacturing; GLB optional for
   marketing stills.
4. **Lab context in-scene.** Floor, walls, lighting, benches — never a pure black void for student builds.
5. **Samples when relevant.** Tubes/fluids with before/after separation layers teach procedure, not just buttons.

---

## 4. Control software pattern

Minimum state set for powered lab gear with a door/lid:

- `LID_OPEN` / `READY` / `ACCEL` / `RUN` / `DECEL` / `END`
- Faults: lid open on start, imbalance, overspeed, sensor fail (as applicable)

Hard rules (centrifuge reference):

- No tube load/unload unless lid open and rotor stopped.
- No start if lid open.
- Balance check on start when occupied.
- Auto-open lid on successful end is optional but good for training UX.
- Hold-to-run (`short`) is separate from timed program.

Document every key, LED, and display field in `control_spec.md`.

---

## 5. Viewer pattern (Three.js)

| Concern      | Convention                                                 |
| ------------ | ---------------------------------------------------------- |
| Units        | ≈ 100 mm per scene unit; Y-up; front of instrument = −Z    |
| Modules      | `app.js` logic + UI; `*3d.js` geometry; `sfx.js` audio     |
| Keys         | Textured keycaps with labels; `userData.keyId` for picking |
| LCD          | Canvas texture, updated each frame from `snap()`           |
| Lab          | `buildLabRoom()` or equivalent environment group           |
| Demo         | Continuous loop: load → close → run → show → next material |
| Cache        | `?v=YYYYMMDD-note` on module imports when shipping changes |
| Dependencies | CDN Three.js via import map — no bundler required          |

AI tutor hooks (optional but standardized): glow keys, press key API, mute SFX, read snapshot.

---

## 6. CAD pattern (CadQuery)

| Concern   | Convention                                                       |
| --------- | ---------------------------------------------------------------- |
| Kernel    | CadQuery + OCP on **Python 3.12**                                |
| Origin    | Documented once in `dimensions.md` (chamber axis, floor Z=0, mm) |
| Part IDs  | Stable `A01_…`, `E03_…` style names in STEP + PARTS_MAP          |
| Fasteners | Shared library under `cad/cq/lib/` or `cad/library/`             |
| Export    | STEP assembly + per-part STEP; STL mesh groups; optional GLB     |

Do not treat `cad/_legacy/` or `export/_history/` as runtime. See `PIPELINE.md` for why they exist.

---

## 7. Quality bar (ship checklist)

- [ ] `scripts/serve.sh` opens a usable twin on a blank machine with only Python 3 + browser
- [ ] `scripts/test.sh` passes
- [ ] Lid/door interlock cannot be bypassed in normal UI
- [ ] Exploded / wireframe / reset view work if 3D assemblies exist
- [ ] Continuous or guided demo exercises full workflow
- [ ] `README.md` + `docs/control_spec.md` match actual keys
- [ ] Package has no required path outside its root
- [ ] Branding/legal OK for classroom use

---

## 8. Building the next machine

1. Create `Twins/<name>_twin/` as a **sibling** of `centrifuge_twin/` (see `standards/machine_template.md`).
2. Copy `standards/machine_template.md` → fill product brief.
3. Scaffold folders from §2 (mirror `centrifuge_twin/`).
4. Research manuals → `research/`.
5. Implement `control_spec.md` + Python controller tests **before** polishing chrome.
6. Procedural Three.js shell + lab room + controls.
7. Samples / consumables if the instrument has them.
8. Optional CadQuery library + exports.
9. Run quality bar §7.
10. Register on the lab desk: `lab_viewer/machines/registry.js` + `.master/registry/machines.md`.
11. Add a short case study section under `docs/` for that instrument.
12. From Twins root, smoke `./scripts/serve.sh` → `/lab_viewer/` and select the new machine.

The centrifuge twin is the template implementation of this standard. Workspace process: `Twins/.master/`.
