# Twins

Chemistry-lab **instrument digital twins** workspace.

## Run the lab

This folder **is** the workspace root (do not `cd Twins` again if you are already here).

```bash
./scripts/serve.sh
```

Open the URL printed in the terminal:

**http://127.0.0.1:8765/lab_viewer/**

That is the **master lab desk**: pick a machine, load its controls and 3D, switch machines (current instrument leaves the desk, next loads).

If port 8765 is busy, the script chooses another port and prints it.

## Layout

| Path | Role |
|------|------|
| `lab_viewer/` | Multi-machine lab desk + picker |
| `centrifuge_twin/` | Gold sample twin (MICRO 5424-R) |
| `<name>_twin/` | Future instruments |
| `.master/` | Process, agent SOP, logs, report cards |
| `scripts/serve.sh` | Serve this whole tree |

## Standalone centrifuge only

```bash
cd centrifuge_twin
./scripts/serve.sh
# http://127.0.0.1:8765/viewer/
```

## Agents / process

Start every session: [`.master/AGENT_SOP.md`](.master/AGENT_SOP.md)  
Build a new machine: [`.master/HOW_TO_BUILD_A_MACHINE.md`](.master/HOW_TO_BUILD_A_MACHINE.md)  
Register desk machines: [`lab_viewer/machines/registry.js`](lab_viewer/machines/registry.js)
