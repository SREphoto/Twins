---
description: Starts the local development server and opens the twin viewer in the browser.
---

# Run Workflow

This workflow starts the local HTTP development server for the Twins project and opens the 3D twin viewer in your browser.

## Steps

1. **Start the Development Server**
   Use `run_command` to execute the server script in the background:
   ```bash
   bash /Users/Samuel/AGapps/Twins/scripts/serve.sh
   ```

2. **Determine Target Viewer URL**
   * Multi-Machine Lab Desk: `http://127.0.0.1:8765/lab_viewer/`
   * Analytical Balance: `http://127.0.0.1:8765/balance_twin/software/viewer/`
   * Rotary Evaporator: `http://127.0.0.1:8765/rotovap_twin/software/viewer/`
   * Centrifuge: `http://127.0.0.1:8765/centrifuge_twin/software/viewer/`

3. **Open and Verify via `browser_subagent`**
   Use `browser_subagent` to open the target URL, capture a verification screenshot, and confirm that WebGL initializes cleanly.
