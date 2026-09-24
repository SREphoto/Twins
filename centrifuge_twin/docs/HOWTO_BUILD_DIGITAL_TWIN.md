# How to Build a Lab Instrument Digital Twin (Centrifuge Case Study)

This document teaches another engineer or AI how we built the **MICRO 5424-R class refrigerated microcentrifuge twin**
under `centrifuge_twin/`, and how to repeat the process for a different machine.

**Pipeline map (stages, artifacts, what to copy):** [`PIPELINE.md`](PIPELINE.md).  
**Normative process (short):** [`STANDARD.md`](STANDARD.md).  
**Architecture summary:** [`ARCHITECTURE.md`](ARCHITECTURE.md).  
**What shipped:** [`BUILD_LOG.md`](BUILD_LOG.md).  
**Next machine checklist:** [`../standards/machine_template.md`](../standards/machine_template.md).

It covers research, CAD, the interactive web app, 3D modeling conventions, controls, backlighting for AI tutors, sound,
and run-time architecture.

This package is **portable**: move `centrifuge_twin/` anywhere; run `./scripts/serve.sh` and `./scripts/test.sh` without
BlenderProc.

---

## 1. Goal and constraints

**Product:** A digital-only training twin of a real lab microcentrifuge (Eppendorf 5424 R class), for chemistry
students.

**Must have:**

- Piece-by-piece physical fidelity (body, lid, rotor, motor, PSU, screws, wires, power cord)
- Working keypad + LCD + run logic (speed, time, temp, short, open, start/stop)
- Sample tube rack, load/unload, fluid layers that “separate” after a good run
- Interactive web viewer (orbit, explode, wireframe, grab lid)
- Solid closed cabinet (not see-through junk geometry)
- Clear lid hinged at the **rear** only; tubes on a true circular pitch

**Stack decision (important):**

- **Primary student experience** = procedural **Three.js** model in the browser (`software/viewer/`)
- **CAD** (CadQuery / FreeCAD / Blender) = optional STEP/STL/GLB pipeline for parts library and export
- Do **not** depend on a fragile GLB for the live app; procedural mesh is easier to iterate and wire to software

---

## 2. Repository layout

```bash
centrifuge_twin/
  README.md
  requirements.txt              # general Python
  requirements-cq.txt           # CadQuery stack (Python 3.12)
  research/
    manuals/                    # OEM PDFs
    manuals_extracted/          # text dumps for search
    sources.md
  docs/
    HOWTO_BUILD_DIGITAL_TWIN.md # this file
    dimensions.md, BOM.md, control_spec.md, ...
  cad/
    cq/                         # CadQuery scripts (enclosure, chamber, rotor, fasteners)
    assemble_product_glb.py
    _legacy/                    # Stage 1 Blender experiments (reference)
  export/
    step/ glb/ mesh/ renders/   # intentional CAD outputs
    _history/                   # early dead-end GLB/STL (labeled reference)
  software/
    controller/                 # pure Python state machine (optional / tests)
    lcd/                        # Python LCD drawer (optional)
    viewer/                     # ★ LIVE APP
      index.html
      style.css
      app.js                    # state machine, UI, Three.js scene loop
      centrifuge3d.js           # procedural product model
      sfx.js                    # soft Web Audio clicks
```

---

## 3. Environment and tooling

### 3.1 Web app (required)

No npm build step. Static files + CDN Three.js.

```bash
cd centrifuge_twin/software
python3 -m http.server 8765
# open http://127.0.0.1:8765/viewer/
```

- **Three.js** `0.160.0` via import map in `index.html` (unpkg)
- Modern browser with ES modules
- Cache-bust module URLs with `?v=...` when iterating (`app.js?v=...`, `centrifuge3d.js?v=...`)

### 3.2 CadQuery (optional CAD path)

CadQuery 2.x + OCP needs **Python 3.12** (not 3.14 at time of build).

```bash
# create env, install from requirements-cq.txt
python3.12 -m venv .venv-cq
source .venv-cq/bin/activate
pip install -r requirements-cq.txt
# run builders under cad/cq/
```

Blender 4.x used only for optional GLB assembly / screenshots, not for the live twin.

### 3.3 Research inputs

1. Download OEM operating manuals (5424 / 5424 R class).
2. Extract text for dimensions, keypad map, RCF formula, safety interlocks.
3. Capture product photos for proportion (body vs lid vs panel).
4. Record units: we use **scene units ≈ 100 mm** (width `W = 2.9` ≈ 290 mm).

Key physics used in software:

\[ \mathrm{RCF} \approx 1.118 \times 10^{-5} \times r\_{\mathrm{cm}} \times \mathrm{RPM}^2 \]

with rotor radius \( r \approx 8.4\,\mathrm{cm}\) for FA-45-24-11 class.

---

## 4. Design process (the order we learned to use)

### Step A — Spec before mesh

Write down:

- Envelope dimensions (W × D × H)
- Front = which axis? (**we use Y-up, front = −Z**)
- Assemblies that explode: body, console, chamber, rotor, lid, rack, drive
- Key IDs (stable strings for UI + AI): `power`, `start`, `open`, `short`, `rpmrcf`, `speed-up`, …

### Step B — Software state machine first (or in parallel)

States: `LID_OPEN`, `READY`, `ACCEL`, `RUN`, `DECEL`, `END`, `ERR_*`

Rules that must match a real instrument:

- Cannot start with lid open
- Lid locks while spinning
- Imbalance check before run
- Timed run: elapsed advances; at set time → decelerate
- `short` = hold-to-spin (no program timer)
- `time_set_s = 0` = continuous until stop

LCD is a **canvas** (`#lcd`) drawn every frame and mapped as a `THREE.CanvasTexture` onto the 3D screen.

### Step C — Procedural body (avoid hollow junk)

**Wrong:** one solid box for the whole body (blocks chamber) **or** only corner pads (see-through).

**Right:**

1. Floor + four walls (hollow shell)
2. Continuous **top deck** with a circular hole (`ExtrudeGeometry` + hole path, **opposite winding**)
3. Open chamber bowl + rotor under the hole
4. **Lower front wall only**; **control fascia** is the upper front, pivoted at the deck lip so it hangs **outside** the
   machine

Critical geometry lesson:

- Tilting a panel around its center with `rotation.x > 0` drives the top **into** the body.
- Fix: pivot at the **top** of the fascia; place all panel geometry at local **y ≤ 0** and **z ≤ 0** so tilt hangs
  outward toward the user.

### Step D — Close visual leaks

After lower-front + fascia, you will still see dark gaps at the upper front corners. Fill with:

- Upper front bulkhead (behind fascia)
- Corner pillars / returns
- Horizontal seam belt at the lower/upper join
- Nearly full-width fascia + skin-colored cheeks

### Step E — Details that sell realism

- Rear IEC inlet + strain relief + trailing **power cord** + plug
- Internal cables (`TubeGeometry` along Catmull-Rom paths): mains, motor, PE, console harness, fan, compressor, temp
  probe
- Side **air vents** (louvers) left and right; rear vent slots
- Lid **stoppers** + front seal on deck; glass lid hinged at rear only
- Brand **3D badge** (canvas wordmark on raised plate + screws)
- Drive bay (motor, PSU, PCBs, screws) for explode view

### Step F — Keys that support AI tutors

Each key:

- Unique materials (not shared across keys) with **emissive**
- Face = canvas texture label (`MeshStandardMaterial` + map + emissive)
- API:
  - `setKeyGlow(model, id, { color, intensity })`
  - `setKeyGlows(model, map)`
  - `clearKeyGlows(model)`
  - `setKeysPoweredBacklight(model, on)` soft idle glow when powered

Exposed on the page for agents:

```js
window.CentrifugeTwin.highlightKeys({ start: true, open: 0xffaa00 });
window.CentrifugeTwin.pulseKey('start', { ms: 2000 });
window.CentrifugeTwin.guideSequence(['power', 'open', 'start']);
window.CentrifugeTwin.getState();
window.CentrifugeTwin.press('start');
```

### Step G — Subtle sound (no asset files)

`sfx.js` uses Web Audio oscillators + tiny noise for soft plastic clicks. Mute via UI. Keep gain low.

Resume `AudioContext` only after a user gesture (click/key).

---

## 5. Coordinate system and camera

| Convention                           | Value   |
| ------------------------------------ | ------- |
| Up                                   | +Y      |
| Front of instrument (LCD faces user) | −Z      |
| Right                                | +X      |
| Units                                | ~100 mm |

Default camera must look from **−Z** (front), not +Z (back / power cord).

```js
// front 3/4
camera.position.set(3.5, 3.35, -4.5);
controls.target.set(-0.2, 1.25, -0.15);
```

---

## 6. Live app architecture

### 6.1 `app.js`

- Global controller object `c` (powered, state, rpm, time, temp, lab tubes)
- `tick(dt)` advances accel/run/decel and the program timer
- `drawLcd(snap())` paints the 2D canvas every frame
- `handleKey` / rocker hold-to-ramp / short hold
- Three.js init: lights, OrbitControls, model, pointer pick (keys, tubes, lid)
- `window.CentrifugeTwin` tutor API

### 6.2 `centrifuge3d.js`

- `createCentrifugeModel(lcdTexture)` → `{ root, rotor, lid, buttons, lcdMesh, lcdMat, assemblies, ... }`
- `setExplodeAmount`, `setWireframe`, `syncLabTubes`
- Glow helpers for keys

### 6.3 `sfx.js`

- `playKeyClick`, `playLidThud`, `playRunStart`, `playRunEnd`, `playFault`, mute/volume

### 6.4 HTML UI

- Side panel mirrors 3D keys (`data-key="..."`)
- Same handlers for HTML and 3D
- CSS `.key.is-glow` mirrors 3D guide backlight

---

## 7. Control map (stable IDs)

| ID                        | Function                       |
| ------------------------- | ------------------------------ |
| `power`                   | Mains on/off                   |
| `start`                   | Start / stop run               |
| `open`                    | Release lid (when stopped)     |
| `short`                   | Hold-to-spin                   |
| `rpmrcf`                  | Toggle display mode            |
| `speed-up` / `speed-down` | RPM set (hold to ramp)         |
| `time-up` / `time-down`   | Program time (hold to ramp)    |
| `temp-up` / `temp-down`   | Setpoint °C (hold to ramp)     |
| `fast-temp`               | Moderate “fast cool” style run |

No menu keys on this trainer (real 5424 has menu; we removed stubs with no UI).

---

## 8. Student lab workflow

1. Pick sample material (dropdown).
2. With lid open: click rack tube in 3D → loads into rotor (or use balanced pair button).
3. Close lid (grab handle or Close lid).
4. Set speed / time / temp (hold rockers to ramp).
5. Start/stop. Timer counts **down** on the LCD while running.
6. After stop, fluids update if RCF/time/rpm thresholds met.
7. Open lid, unload tubes, inspect separation.

---

## 9. Lessons learned (do not repeat)

1. **Never** `Object.assign(mesh.position, …)` — use `position.set`.
2. Extrude hole winding must be **opposite** the outer path or the deck hole fails.
3. Full solid body box blocks the chamber; use hollow walls + deck hole.
4. Camera on +Z shows the **back** of a front=−Z machine.
5. Panel tilt around center sinks the panel into the body; pivot at top, geometry outside.
6. Fill upper-front corner gaps with bulkhead + pillars after cutting lower front only.
7. Multi-material LCD: keep texture on `lcdMat`, not `mesh.material` array.
8. Shared materials on keys mean one glow lights all keys — clone per key.
9. Cache-bust module imports while developing.
10. CadQuery on bleeding-edge Python often fails; pin 3.12 for CQ.

---

## 10. Recipe: build a _different_ machine twin

Use this checklist for e.g. a balance, pH meter, or PCR machine.

### 10.1 Research (½–1 day)

- [ ] Manuals + dimensions + control labels
- [ ] Axis convention written down
- [ ] State machine list (power, interlocks, run modes)
- [ ] Part list: shell, UI, consumables, cables

### 10.2 Software skeleton

- [ ] `index.html` + import map for three
- [ ] `app.js` controller + canvas “LCD” or status display
- [ ] `machine3d.js` `createModel(texture)`
- [ ] Stable `data-key` IDs shared by HTML and 3D

### 10.3 Body

- [ ] Hollow shell, no accidental see-through
- [ ] Continuous decks/holes with correct Shape winding
- [ ] UI fascia that does not intersect the shell
- [ ] Corners and seams filled

### 10.4 Interaction

- [ ] Raycast pick for controls and samples
- [ ] Hold-to-repeat for numeric up/down
- [ ] Emissive guide glow API for AI
- [ ] Soft SFX (optional)

### 10.5 Polish

- [ ] Front camera default
- [ ] Explode assemblies for teaching
- [ ] Power cord / vents / screws if they read as “real”
- [ ] HOWTO + control_spec for the next agent

### 10.6 AI wiring pattern

```js
// Tutor says “press start”
CentrifugeTwin.clearHighlights();
CentrifugeTwin.highlightKeys({ start: { color: 0x3dd68c, intensity: 1.4 } });

// After student presses start (listen to your own handleKey hook):
CentrifugeTwin.clearHighlights();
```

Hook your LLM tool calls to `window.CentrifugeTwin.*` or import the same functions from modules in a bundled app.

---

## 11. How to run this project today

```bash
cd /path/to/centrifuge_twin/software
python3 -m http.server 8765
```

Open: `http://127.0.0.1:8765/viewer/`

Hard refresh if assets look stale: `Cmd+Shift+R`.

Optional CadQuery:

```bash
cd /path/to/centrifuge_twin
python3.12 -m venv .venv-cq && source .venv-cq/bin/activate
pip install -r requirements-cq.txt
# run scripts under cad/cq/
```

---

## 12. File ownership (what to edit for what)

| Change                                           | Edit                              |
| ------------------------------------------------ | --------------------------------- |
| Body shape, vents, cord, badge, lid, keys layout | `software/viewer/centrifuge3d.js` |
| Run logic, timer, samples, camera, AI API        | `software/viewer/app.js`          |
| Click sounds                                     | `software/viewer/sfx.js`          |
| Side panel layout / CSS glow                     | `index.html`, `style.css`         |
| STEP parts                                       | `cad/cq/*`                        |
| Product photos / manuals                         | `research/`, `export/renders/`    |

---

## 13. Acceptance criteria we used

- [ ] Starts on **front** 3/4 view (LCD readable)
- [ ] Chamber open from above; sides opaque
- [ ] Lid hinges rear; seats on front stoppers
- [ ] Keys aligned; can glow via `CentrifugeTwin.highlightKeys`
- [ ] Soft click on press; mute works
- [ ] Timer counts down and ends the run
- [ ] Tubes circular pitch; fluids update after run
- [ ] Power cord + side vents present
- [ ] No black void gap between fascia and body corners

---

## 14. Version notes

Built as a greenfield twin under `Twins/centrifuge_twin/` without relying on BlenderProc monorepo experiments. Live path
is procedural Three.js; CadQuery is the offline CAD twin for STEP/mesh export. New machines should be siblings under
`Twins/` — see `docs/STANDARD.md` and `standards/machine_template.md`.

When extending, prefer small deterministic geometry helpers (`box`, `cyl`, `makeCable`, `deckWithHole`) over opaque
imported black-box models until the interaction model is stable.
