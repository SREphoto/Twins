# New machine twin — scaffold checklist

Copy this file to `docs/PRODUCT_BRIEF.md` for the new instrument and tick every section.

**Before scaffolding:** read the centrifuge gold sample’s [`docs/PIPELINE.md`](../docs/PIPELINE.md) (what was tried,
what shipped, what to skip).

## Home layout (`Twins/`)

Lab instrument twins live as **sibling packages** under the `Twins/` parent folder. They do **not** live inside a
BlenderProc (or other render) monorepo.

```text
Twins/                          # parent workspace for all lab twins
  .master/                      # governance, agents, logs (AGENT_SOP.md)
  lab_viewer/                   # master lab desk + machine picker
  scripts/serve.sh              # serve workspace → /lab_viewer/
  centrifuge_twin/              # gold sample (this package)
  <name>_twin/                  # next instrument — create here as a sibling
```

Multi-machine process, agent roles, and end-of-work report cards: `Twins/.master/`.

**Lab desk:** from Twins root run `./scripts/serve.sh` → open `http://127.0.0.1:8765/lab_viewer/`.  
Register new ready machines in `lab_viewer/machines/registry.js`.

Each `<name>_twin/` is self-contained: relative paths only, own `scripts/`, `software/`, `docs/`, `standards/`. No
required imports from `Twins/` or from any old monorepo parent.

## Product brief

- [ ] Instrument class / commercial reference (generic name for UI)
- [ ] Audience (students, training hours, AI tutor?)
- [ ] Must-have interactions (doors, knobs, setpoints, consumables)
- [ ] Safety interlocks (door, overtemp, spin, etc.)
- [ ] Samples / consumables model (yes/no)
- [ ] Branding / nameplate rules

## Research

- [ ] Manuals in `research/manuals/`
- [ ] Text extract + `research/sources.md`
- [ ] Key dimensions table → `docs/dimensions.md`
- [ ] Control map → `docs/control_spec.md`

## Package scaffold

- [ ] Create sibling folder `Twins/<name>_twin/` (not under BlenderProc)
- [ ] Layout from `docs/STANDARD.md` §2 (mirror `centrifuge_twin/`)
- [ ] `AGENTS.md`, `README.md`, `scripts/serve.sh`, `scripts/test.sh`
- [ ] `requirements.txt` (+ `requirements-cq.txt` if CAD)
- [ ] Copy or adapt `standards/` and `docs/STANDARD.md` into the new package

## Controller

- [ ] State enum + transitions documented
- [ ] Python implementation + tests in `software/controller/`
- [ ] Fault injection paths for training

## Viewer

- [ ] Procedural or stable GLB model in `software/viewer/`
- [ ] Lab environment (not void)
- [ ] Keypad/UI bound to state machine
- [ ] Demo or guided workflow for classroom
- [ ] Cache-bust query params after ship

## CAD (optional)

- [ ] Origin + units in `dimensions.md`
- [ ] Part IDs + BOM
- [ ] STEP export path documented in `standards/build_cad.md`

## Quality bar

- [ ] All items in `docs/STANDARD.md` §7 pass
- [ ] `./scripts/serve.sh` and `./scripts/test.sh` work from the package root alone
- [ ] Package still runs after move to a different parent directory (relocatable)
- [ ] Machine listed in `Twins/lab_viewer/machines/registry.js` when ready for the lab desk
