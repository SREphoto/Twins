# Build / run the web viewer

## Prerequisites

- Python 3.x (stdlib `http.server` only)
- Modern browser (ES modules, WebGL)

## Run

From the twin package root (e.g. `Twins/centrifuge_twin/`):

```bash
cd <package_root>   # e.g. Twins/centrifuge_twin/
./scripts/serve.sh          # default port 8765
./scripts/serve.sh 9000     # custom port
```

Open `http://127.0.0.1:8765/viewer/`.

Hard-refresh (Cmd+Shift+R) after JS/CSS edits. Bump `?v=` on script tags in `index.html` and the `centrifuge3d.js`
import in `app.js` when shipping.

No BlenderProc (or other monorepo) install is required. The viewer is static files under `software/viewer/`.

## File roles

| File              | Edit when…                                          |
| ----------------- | --------------------------------------------------- |
| `app.js`          | States, samples, demo loop, UI wiring, scene lights |
| `centrifuge3d.js` | Mesh layout, lab room, badge, keys, rotor           |
| `sfx.js`          | Click / lid / fault tones                           |
| `style.css`       | Side panels, keypad chrome                          |
| `index.html`      | DOM structure, import map, cache-bust               |

## Continuous demo

Control panel → **Continuous demo**: cycles materials through full load/run/unload loops with time-warp. Toggle again to
stop.

## Tests

Viewer has no automated browser tests yet. Behavioral locks live in:

```bash
./scripts/test.sh
```
