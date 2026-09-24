---
name: twin-visual-qa
description: Mandatory multi-angle automated visual QA and preflight verification protocol for all digital twins.
---

# Mandatory Digital Twin Visual QA & Verification Protocol

Every digital twin build must undergo this exact closed-loop automated verification protocol before completion or handoff. No twin is considered complete without passing this verification gate.

---

## 1. The 6 Standard Viewpoint Audits

Every machine twin must capture and verify high-resolution screenshot artifacts from 6 mandatory camera positions:

| View Preset | Target Verification Focus | Rejection Criteria |
| :--- | :--- | :--- |
| `CAM_ISO` | 3/4 isometric perspective, bench clearance ($Y = 9.0$), room enclosure | Wall cutoffs, floating geometry, table clipping |
| `CAM_FRONT` | Upright typography, LCD screen clarity, brand badge, dial clearance | Mirrored/upside-down text, knob occluding display |
| `CAM_SIDE` | Profile silhouette, flush rocker switch, rear IEC inlet & cord | Protruding buttons floating in air, missing cord |
| `CAM_TOP` | Heating plate, chamber deck, sample vessels, 3D fasteners | Flat 2D baked screws, off-center accessories |
| `CAM_EXPLODED` | Clean kinematic vertical separation of sub-assemblies | Meshes exploding into chaotic or intersecting directions |
| `STATE_ACTIVE` | Active dynamic state: thermal glow, live RPM counter, parabolic vortex | Flat static fluid, uniform accordion scaling, frozen UI |

---

## 2. Automated CDP / Browser Verification Script

Use Chrome DevTools Protocol (CDP on port `9222`) or Playwright to run an automated audit script against the local HTTP server (`http://127.0.0.1:8765`).

### Standard Script Template (`scratch/verify_twin.js`):
```javascript
const fs = require('fs');
const path = require('path');

const CDP_PORT = 9222;
const TARGET_URL = 'http://127.0.0.1:8765/<twin_dir>/software/viewer/index.html';
const ARTIFACT_DIR = '<artifact_dir>';

async function audit() {
  const listRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
  const tabs = await listRes.json();
  let targetTab = tabs.find(t => t.url && t.url.includes('<twin_dir>'));
  if (!targetTab) {
    const newRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(TARGET_URL)}`, { method: 'PUT' });
    targetTab = await newRes.json();
  }

  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  const exceptions = [];

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      pending.set(curId, { resolve, reject });
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      exceptions.push(msg.params.exceptionDetails);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 2000));

  async function snap(name) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `${name}.png`), Buffer.from(shot.data, 'base64'));
  }

  // 1. CAM_ISO
  await send('Runtime.evaluate', { expression: `window.setCameraPreset('iso')` });
  await new Promise(r => setTimeout(r, 1000));
  await snap('twin_CAM_ISO');

  // 2. CAM_FRONT
  await send('Runtime.evaluate', { expression: `window.setCameraPreset('front')` });
  await new Promise(r => setTimeout(r, 1000));
  await snap('twin_CAM_FRONT');

  // 3. CAM_SIDE
  await send('Runtime.evaluate', { expression: `window.setCameraPreset('side')` });
  await new Promise(r => setTimeout(r, 1000));
  await snap('twin_CAM_SIDE');

  // 4. CAM_TOP
  await send('Runtime.evaluate', { expression: `window.setCameraPreset('top')` });
  await new Promise(r => setTimeout(r, 1000));
  await snap('twin_CAM_TOP');

  // 5. CAM_EXPLODED
  await send('Runtime.evaluate', { expression: `document.getElementById('btn-explode')?.click()` });
  await new Promise(r => setTimeout(r, 1000));
  await snap('twin_CAM_EXPLODED');
  await send('Runtime.evaluate', { expression: `document.getElementById('btn-explode')?.click()` }); // reset

  // 6. STATE_ACTIVE (Engage operational controls)
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.getElementById('btn-heat-toggle')?.click();
      document.getElementById('btn-stir-toggle')?.click();
      document.getElementById('btn-start')?.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));
  await snap('twin_STATE_ACTIVE');

  ws.close();
  if (exceptions.length > 0) {
    throw new Error(`Visual audit failed with ${exceptions.length} browser exceptions!`);
  }
}
audit().catch(console.error);
```

---

## 3. Strict Preflight Verification Checklist

Before approving any build:

1. **LCD Display Alignment (`UI_LCD`)**:
   - `flipY = false` explicitly configured on `CanvasTexture`.
   - UV coordinates mapped properly on the buffer geometry attribute (`uv.setX(i, 1.0 - uv.getX(i))`).
   - Zero negative scale matrices (`scale.x = -1`).
   - Text readable left-to-right from normal operator viewing angles.

2. **Boundary Containment (DIAG-001 & DIAG-002)**:
   - Outer dimensions of bezels, buttons, plaques $\le 85\%$ of mounting planar face.
   - Knobs, levers, and handles must not occlude or intersect display surfaces.

3. **Coplanar Z-Fighting (DIAG-003)**:
   - Zero overlapping coplanar primitives at identical coordinates.
   - Lab countertops must use 4-sided perimeter trim strips instead of overlapping solid slabs.

4. **Genuine 3D Fasteners (Rule 1)**:
   - Every screw has real 3D physical geometry with hex socket or cross-recess depth.
   - Zero flat 2D normal-mapped micro-fasteners.

5. **Fluid Dynamics & CFD Fidelity**:
   - Liquid stirring must use parabolic surface vertex displacement ($\Delta y \sim (r/R)^2$) with volume conservation.
   - Never use uniform accordion scaling (`scale.y`).

6. **Controller State Machine Gate**:
   - Run Python controller unit tests (`python3 <twin>/software/controller/test_controller.py`).
   - 100% of unit tests must pass.

7. **Lab Desk Registry**:
   - Register the twin in `lab_viewer/machines/registry.js` with `"status": "ready"`.
