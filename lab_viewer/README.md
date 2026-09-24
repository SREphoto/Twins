# Lab viewer (Twins master)

Shared **lab desk** for all instrument twins under `Twins/`.

- Choose a machine in the top bar.
- **Ready** machines load their full package viewer (controls + 3D + demos).
- Switching runs a desk transition: current instrument slides off, next slides on, then the interactive twin loads.
- **Planned** machines show a placeholder until their package is built.

## Run

Your project root **is** the `Twins` folder (e.g. `AGapps/Twins`). Do **not** run `cd Twins` if you are already there.

```bash
# from the Twins workspace root (where lab_viewer/ and centrifuge_twin/ live)
./scripts/serve.sh
```

Then open the URL printed in the terminal, usually:

`http://127.0.0.1:8765/lab_viewer/`

If port 8765 is busy, the script picks the next free port and prints that URL.

Optional query: `?machine=centrifuge` (default).

### Standalone centrifuge only

```bash
cd centrifuge_twin
./scripts/serve.sh
```

Open: `http://127.0.0.1:8765/viewer/` (that server’s document root is `software/`, so the path is `/viewer/`).

## Layout

```text
lab_viewer/
  index.html           # chrome + machine select + iframe + transition host
  app.js               # switch logic
  transition_scene.js  # shared lab desk + slide animation
  style.css
  machines/registry.js # machine list
  placeholders/        # planned twins
```

## Register a new machine

1. Build `Twins/<name>_twin/` (see `.master/HOW_TO_BUILD_A_MACHINE.md`).
2. Add an entry in `machines/registry.js`:
   - `status: "ready"`
   - `viewerUrl` pointing at that package’s web viewer
   - `transitionKind` (`centrifuge` mesh or `box` placeholder)
3. Log the change in `.master` per `AGENT_SOP.md`.

## Architecture note

Interactive twins keep their own full UI (iframe) so each package stays relocatable and complete. The lab viewer owns **selection + desk choreography**. Later, machines can optionally export a native dock mesh for richer transitions (centrifuge already supports `createCentrifugeModel(tex, { includeLab: false })`).
