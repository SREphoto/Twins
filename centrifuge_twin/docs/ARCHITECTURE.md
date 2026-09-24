# Architecture — MICRO 5424-R twin

## Runtime (what students open)

```text
Browser
  └─ software/viewer/index.html
       ├─ app.js              Controller state, keypad UI, lab bench UI, rAF loop
       ├─ centrifuge3d.js     Procedural instrument + lab room + tubes
       ├─ sfx.js              Soft key / lid / run Web Audio
       └─ Three.js (CDN)      WebGL
```

No Node build. Serve `software/` as static root:

```bash
./scripts/serve.sh
# → http://127.0.0.1:8765/viewer/
```

### Main loops

1. **`tick(dt)`** — physics-ish state: accel/run/decel, temperature lag, separation apply.
2. **`tickDemoLoop(now)`** — optional continuous demo: unload → load material → close → start → show → next.
3. **`frame`** — Three.js: rotor spin, lid lerp, LCD texture, key glow, explode.

### Coordinate system (viewer)

- Y-up, meters-ish scaled so body width ≈ 2.9 (≈ 290 mm).
- Instrument front = **−Z** (keypad faces user when camera is at +X/−Z).
- Lid hinge at rear (+Z); open = rotate lid up about local +X.

### Critical modules

| File                                      | Role                                               |
| ----------------------------------------- | -------------------------------------------------- |
| `app.js` `c` object                       | Live instrument state                              |
| `app.js` MATERIALS                        | Sample recipes (layers, min rpm/rcf/time)          |
| `centrifuge3d.js` `createCentrifugeModel` | Body, chamber, rotor, lid, console, rack, lab room |
| `centrifuge3d.js` `makeSREdesignsBadge`   | Canvas nameplate **S·R·E designs.com**             |
| `controller/*.py`                         | Same semantics for unit tests / future sync        |

## CAD / export (optional path)

```text
cad/cq/*.py  →  export/step, export/mesh
assemble_product_glb.py (Blender)  →  export/glb/centrifuge_product.glb
                                     (+ historical copy under software/viewer/models/)
```

The live app does **not** load a GLB; geometry is procedural. Early GLB experiments are under `export/_history/`. See
`docs/PIPELINE.md`.

## Data flow — one run

```text
load tubes (lid open)
  → close lid → READY
  → START → ACCEL → RUN → (timer) → DECEL → applySeparation
  → END → auto open lid → LID_OPEN
```

Separation mutates tube `separated` flag when peak RCF/time/rpm meet material mins; 3D fluid layers switch from `before`
to `after`.

## Portability

Home workspace is `Twins/` (siblings = other instrument twins). The package is still relocatable:

```bash
# already: Twins/centrifuge_twin/
# or move elsewhere:
mv centrifuge_twin ~/Twins/centrifuge_twin
cd ~/Twins/centrifuge_twin
./scripts/serve.sh
./scripts/test.sh
```

No BlenderProc install required for the student app.
