# How to build a new machine twin

Normative process for any new package under `Twins/<name>_twin/`.

## Lab desk (how students open machines)

Multi-machine **lab viewer** lives at `Twins/lab_viewer/`. From the **Twins workspace root** (not `cd Twins`
 if you are already there):

```bash
./scripts/serve.sh
# open the printed URL, e.g. http://127.0.0.1:8765/lab_viewer/
```

- Machine picker loads each twin’s control panels and 3D.
- Switching slides the current instrument off the shared desk, then loads the next.
- Gold sample on the desk: **centrifuge** (`centrifuge_twin`).
- Register every shippable twin in `lab_viewer/machines/registry.js` (see §8).

Standalone package viewers remain available (e.g. `centrifuge_twin/scripts/serve.sh` → `/viewer/`).

## Roles involved

| Phase                                  | Primary agent | Support  |
| -------------------------------------- | ------------- | -------- |
| Scope, naming, governance              | **OGA**       | BC       |
| Legal / branding / manuals rights      | **LIAR**      | MDRA     |
| Research manuals, dimensions, controls | **MDRA**      | LIAR     |
| Scaffold + implement twin              | **NBA**       | BC, MDRA |
| Scheduling / tracking work             | **SAA**       | OGA      |
| Discoverability / public copy (if any) | **SEOA**      | OGA      |
| Quality coaching, pitfalls             | **BC**        | all      |

Agent definitions: [agents/README.md](agents/README.md).

## Preconditions

1. Read [AGENT_SOP.md](AGENT_SOP.md) (session procedure).
2. Read this file and [MANIFEST.md](MANIFEST.md).
3. Read gold sample:
   - `centrifuge_twin/docs/PIPELINE.md` (what was tried; what shipped)
   - `centrifuge_twin/docs/STANDARD.md`
   - `centrifuge_twin/standards/machine_template.md`
4. Register intent in [registry/machines.md](registry/machines.md) (draft row OK).
5. LIAR clears generic naming / OEM constraints before public-facing labels.

## Steps

### 1. Product brief

Copy `centrifuge_twin/standards/machine_template.md` →  
`Twins/<name>_twin/docs/PRODUCT_BRIEF.md` and fill it.

### 2. Scaffold package

Create sibling folder (not inside BlenderProc):

```text
Twins/<name>_twin/
  AGENTS.md
  README.md
  requirements.txt
  requirements-cq.txt          # if CAD
  scripts/serve.sh  test.sh
  research/
  docs/          # include STANDARD link or copy, control_spec, dimensions, …
  standards/
  software/
    controller/
    viewer/
  cad/           # optional
  export/        # optional generated
```

Mirror layout from `centrifuge_twin/docs/STANDARD.md` §2.

### 3. Research (MDRA)

- Manuals → `research/manuals/`
- Extracts → `research/manuals_extracted/`
- `research/sources.md`
- `docs/dimensions.md`, `docs/control_spec.md`

### 4. Controller before chrome (NBA)

- States + interlocks in `control_spec.md`
- Python + tests in `software/controller/`
- `./scripts/test.sh` must pass

### 5. Viewer (NBA)

- Prefer **procedural** Three.js (or carefully structured assets) for the live app
- Lab environment in-scene
- Do **not** make a fragile GLB the only interactive path (see centrifuge PIPELINE Stage 1 lesson)
- Cache-bust `?v=` on ship

### 6. Optional CAD

- CadQuery / STEP / mesh only if needed for BOM or stills
- Commands pattern: gold `standards/build_cad.md`

### 7. Quality bar

From gold `docs/STANDARD.md` §7, including:

- `./scripts/serve.sh` works with only Python 3 + browser
- Package relocatable (no required paths outside package root)
- Branding OK for classroom (LIAR)

### 8. Register + log

- Update [registry/machines.md](registry/machines.md)
- Write per-machine important-files list from [templates/machine_manifest.md](templates/machine_manifest.md) →
  `registry/<name>_twin_manifest.md`
- Add the machine to the **lab desk picker**: `lab_viewer/machines/registry.js`
  (`status: "ready"`, `viewerUrl`, `transitionKind`)
- Complete all end-of-work logs ([AGENTS_MANDATE.md](AGENTS_MANDATE.md))

### Lab viewer (all machines)

```bash
# from Twins/
./scripts/serve.sh
# http://127.0.0.1:8765/lab_viewer/
```

Shared desk + machine switch: `lab_viewer/`. Each package keeps its own viewer for standalone use.

## What not to do

- Do not put new machines inside a render monorepo root
- Do not import from sibling twins as a hard runtime dependency
- Do not invent OEM marks without LIAR clearance
- Do not delete gold-sample history (`export/_history/`, `cad/_legacy/`) without OGA approval
- Do not skip report cards “because the change was small”

## Commands (sanity)

```bash
# lab desk (from Twins workspace root)
./scripts/serve.sh
# → http://127.0.0.1:8765/lab_viewer/

# gold sample package alone
cd centrifuge_twin
./scripts/serve.sh
./scripts/test.sh
```
