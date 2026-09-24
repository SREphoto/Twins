# Troubleshooting log

Newest first. Template: `templates/troubleshooting_entry.md`.

---

## 2026-07-29 · NBA · rebuild-vacuum-pump-cad

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | none                |
| Machine  | vacuum_pump_twin |
| Severity | none                     |

**Problem:** N/A (Standard session closeout)

**Symptoms:** N/A

**Cause:** N/A

**Fix:** N/A

**Prevention:** N/A



## 2026-07-27 · OGA · fix-ultrasonic-details

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | resolved                |
| Machine  | ultrasonic_cleaner_twin |
| Severity | low                     |

**Problem:** Button labels faced backwards (invisible from outside). Buttons didn't glow while depressed. Basket hung
off the lab bench.

**Symptoms:** Labels couldn't be read in normal view. Poor interaction feedback. Broken geometry collision.

**Cause:** The +Z face of a `BoxGeometry` faces away from the user in this scene layout, but it was assigned the
texture. Emissive glowing was only tied to logical state, not physical mouse events. The lab bench was too narrow for
both the machine and basket.

**Fix:** Rotated button meshes 180 degrees. Added `state.pressed` dictionary tracking `mousedown`/`mouseup` and fed it
into `emissiveIntensity` logic. Elongated `INSTRUMENT_BENCH.sx` to 9.6.

**Prevention:** Remember that ThreeJS `BoxGeometry` places index 4 on the +Z face and index 5 on the -Z face.

---

## 2026-07-27 · OGA · fix-ultrasonic-issues

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | resolved                |
| Machine  | ultrasonic_cleaner_twin |
| Severity | med                     |

**Problem:** Basket sank through floor when lowered, basket floated in air unloaded, nameplate was off-edge. UI was
dysfunctional.

**Symptoms:** Visual artifacts and incorrect machine behavior.

**Cause:** Hardcoded position values for the basket (`(0,0,0)` was too low, `1.5` was floating), layout lacked proper
CSS.

**Fix:** Redesigned `index.html` UI with flexbox, mathematically computed `basketBaseY` offsets based on machine
dimensions to set basket positions. Repositioned nameplate.

**Prevention:** Cross-reference 3D model geometry bounds (like `DECK_Y` and `BASIN_FLOOR_Y`) when positioning moving
parts.

---

## 2026-07-26 · OGA · fix-unload-error

| Field    | Value                   |
| -------- | ----------------------- |
| Status   | resolved                |
| Machine  | ultrasonic_cleaner_twin |
| Severity | high                    |

**Problem:** `app.js:912 Uncaught TypeError: Cannot set properties of null (setting 'onclick')` and 404 error on
`favicon.ico`.

**Symptoms:** Twin UI crashes during script execution due to an obsolete DOM element.

**Cause:** The `btn-unload-sample` button was removed from `index.html` during the basket workflow update, but its
`onclick` listener was still being attached in `app.js`.

**Fix:** Removed the obsolete `btn-unload-sample` listener in `app.js`. (The 404 for `favicon.ico` is a benign warning
from the local server and can be ignored).

**Prevention:** Ensure all script event listeners are updated or use optional chaining when removing elements from the
DOM.

---

## 2026-07-25 · OGA · docs-lab-viewer

| Field    | Value                |
| -------- | -------------------- |
| Status   | resolved             |
| Machine  | lab_viewer / scripts |
| Severity | med                  |

**Problem:** User ran serve instructions; `cd Twins` failed (already in Twins root); port 8765 in use; comment line
pasted as command.

**Symptoms:** `cd: no such file or directory: Twins`; `OSError: [Errno 48] Address already in use`;
`zsh: command not found: #`.

**Cause:** Docs said `cd Twins` as if nested; prior Python http.server still listening; user pasted markdown comments.

**Fix:** Killed PIDs on 8765/8766; `scripts/serve.sh` now auto-selects next free port; README/SOP/build docs say
workspace root is already Twins and print the real URL.

**Prevention:** Never document `cd Twins` without “only if not already there”; serve script must not assume port free.

---

## 2026-07-25 · NBA · lab-viewer

| Field    | Value      |
| -------- | ---------- |
| Status   | resolved   |
| Machine  | lab_viewer |
| Severity | low        |

**Problem:** Transition `playSwitch` promise/async flow was fragile (nested setDockMachine in rAF).

**Fix:** Rewrite with sequential `animateMs` helpers.

**Prevention:** Keep switch animation linear async/await.

---

## 2026-07-25 · OGA · agent-sop

| Field    | Value     |
| -------- | --------- |
| Status   | none      |
| Machine  | workspace |
| Severity | —         |

---

## 2026-07-25 · OGA · create-master

| Field    | Value     |
| -------- | --------- |
| Status   | none      |
| Machine  | workspace |
| Severity | —         |

No blockers while creating `.master` structure.
