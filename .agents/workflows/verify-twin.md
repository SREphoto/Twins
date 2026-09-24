---
description: Automated 4-angle visual QA audit and console error check for machine digital twins using browser_subagent.
---

# Verify Twin Workflow (4-Angle Visual QA Protocol)

This workflow executes automated preflight visual inspections of any machine twin viewer to guarantee zero geometry penetrations, zero floating parts, and clean console logs.

## Steps

1. **Start the Local HTTP Server**:
   Check if the server is running on port 8765 (or alternate). If not, launch in the background:
   ```bash
   bash /Users/Samuel/AGapps/Twins/scripts/serve.sh
   ```

2. **Determine Target Twin**:
   Target package URL: `http://127.0.0.1:8765/<twin_name>/software/viewer/` (e.g. `balance_twin`).

3. **Execute 4-Angle Visual Audit via `browser_subagent`**:
   Invoke `browser_subagent` with the task:
   * Navigate to the viewer URL.
   * Wait 2 seconds for WebGL canvas and textures to render.
   * **Angle 1 (`CAM_ISO`)**: Set camera to standard isometric framing ($35^\circ$ azimuth, eye-level). Capture screenshot.
   * **Angle 2 (`CAM_FRONT`)**: Orbit to front orthographic view of the console. Verify that the LCD is seated flush in its pocket (zero wall clipping) and typography is upright. Capture screenshot.
   * **Angle 3 (`CAM_SIDE`)**: Orbit to side elevation at table height. Verify that leveling feet sit squarely on the tabletop with zero ground clipping or side overhang. Capture screenshot.
   * **Angle 4 (`CAM_EXPLODED`)**: Drag the exploded view slider to 100%. Verify internal components, weighing column, and motor assemblies separate cleanly without collision. Capture screenshot.
   * **Interactive Test**: Click on `Btn_Tare` or primary control button. Verify LCD readout changes and button depresses.
   * **Console Check**: Inspect browser console logs to confirm zero WebGL shader errors or uncaught exceptions.

4. **Review Report Card**:
   * Inspect all 4 captured screenshots using `view_file`.
   * Verify PASS criteria:
     - [ ] Zero mesh penetration or wall clipping.
     - [ ] LCD text is crisp, glowing, and right-side up (`flipY = false`).
     - [ ] Leveling feet rest squarely beneath the base plate.
     - [ ] Official `Badge_SREdesigns` is present.
     - [ ] Zero WebGL shader or runtime errors in console.
