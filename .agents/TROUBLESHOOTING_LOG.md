# Digital Twin Diagnostic & Troubleshooting Log

**SRE Laboratory Systems · Digital Twin Engineering Division** Authoritative Reference for Rapid Identification, Root
Cause Analysis, and Mathematical Fixes

---

## Quick Reference Index

| Issue ID     | Category                 | Symptom / Visual Tell                                     | Root Cause                                                       | Fix Protocol                                                         |
| :----------- | :----------------------- | :-------------------------------------------------------- | :--------------------------------------------------------------- | :------------------------------------------------------------------- |
| **DIAG-001** | Geometry Containment     | Badge / plaque exceeds mounting surface; overhangs desk   | Hardcoded dimensions larger than extruded parent face            | 85% Surface Boundary Rule (`scale = 0.32`)                           |
| **DIAG-002** | Material / Occlusion     | Badge renders as solid pitch-black box; texture missing   | Solid dark recess box sitting in front of canvas plane           | Remove occluding box; set `tex.needsUpdate = true`                   |
| **DIAG-003** | Z-Fighting / Depth       | Tabletop flashes black & white zebra stripes on orbit     | Two solid coplanar boxes (`islandTop` & `edge`) at $Y = 9.000$   | 4-sided outer perimeter trim; zero top-face overlap                  |
| **DIAG-004** | Industrial Architecture  | Power button is an arcade chrome knob with neon halo      | Fabricated button instead of true through-panel design           | Real-life integration through LED panel; unlabelled                  |
| **DIAG-005** | UV / Projection          | Screen text mirrored / inverted at low angles             | `rotation.z = Math.PI` on plane geometry with inverted normal    | Correct local coordinate mapping & canvas orientation                |
| **DIAG-006** | Material / Optics        | Fluid inside tube invisible; tube appears solid/opaque    | Three.js transmission pass without PMREM occluding child mesh    | High-clarity MeshStandardMaterial; tube renderOrder=2, fluid=1       |
| **DIAG-009** | Assembly Containment     | Chamber hangs over LCD; rear white box hovers in air      | Chamber depth $2.40$ exceeded flat deck; floating drive column   | Bound chamber depth to $1.90$; grounded rear unibody tower           |
| **DIAG-010** | Mechanical Retention     | 45 mm gap above side glass; missing top track capture     | Side glass height $2.31$ reached only $Y=2.355$ (top at $2.40$)  | Extruded U-channel top tracks; captive $2.365$ glass (zero gap)      |
| **DIAG-011** | Sensor / Logic Inversion | Doors closed says "Air draft detected"; open says "Ready" | Asymptotic lerp float $>0$; `updateUI` not called on stable lerp | Snap lerp $<0.002$; threshold $>0.03$; reactive UI updates           |
| **DIAG-012** | Z-Fighting / Coplanar    | Metal top of rear box flickers between white and grey     | `towerCasting` & `towerCap` both shared top plane at $Y = 2.450$ | Bound casting to $Y = 2.425$; place cap from $2.425$ to $2.450$      |
| **DIAG-013** | Placement / Lighting     | Spirit level uncentered; casts shadow onto weighing base  | Off-center at $X = -1.38$; proud puck with `castShadow = true`   | Center at $X = -1.49, Z = -0.52$; flush recess; `castShadow = false` |

---

## Detailed Case Analyses

### DIAG-001: Boundary Containment Failure (Oversized Badge Overhanging Surface)

- **Visual Symptom**: The brand/model plaque extends past the top and bottom of the front chassis lip, protruding into
  empty air above the nose bevel and hanging down into the desk clearance gap.
- **Why It Occurred**: The vertical front apron of the extruded unibody spans $Y = 0.08$ to $Y = 0.20$ (total height:
  $12\text{ mm}$). The badge function was instantiated with a default height of $28\text{ mm}$ (plus $33\text{ mm}$
  bezel), making it nearly $3\times$ taller than the physical mounting face.
- **Why QA Missed It**: "Checklist Tunnel Vision." Auditors confirmed the _existence_ of the badge mesh and readable
  text, but failed to test _relative geometric containment_ against the parent face.
- **Enforced Rule (AGENTS.md & CAD Protocol)**:
  $$\text{Height}_{\text{component}} \le 0.85 \times \text{Height}_{\text{mounting surface}}$$ No component may ever
  intersect bevel transitions or overhang datum edges.
- **Code Fix**:

  ```javascript
  // balance3d.js
  export function makeSREdesignsBadge(scale = 0.32) {
    const plateW = 0.98 * scale; // 31.4 mm
    const plateH = 0.28 * scale; // 8.9 mm (centered in 12 mm lip with 1.5 mm margins)
    ...
  }
  // Placed at Y = 0.14, Z = -2.008
  ```

---

### DIAG-002: Mesh Occlusion (Solid Pitch-Black Badge Surface)

- **Visual Symptom**: The plaque body and corner screws render correctly, but the face texture (teal S-R-E tiles,
  `designs.com`, `LAB SYSTEMS`) is completely pitch black.
- **Why It Occurred**: An inner dark box (`recess`) with depth $0.004$ was placed at $Z = \text{plateD}/2 - 0.0005$.
  Because box geometry centers around its origin, its front face reached:
  $$Z_{\text{front}} = (\text{plateD}/2 - 0.0005) + 0.0020 = \text{plateD}/2 + 0.0015$$ The `face` plane containing the
  `CanvasTexture` was placed at $Z = \text{plateD}/2 + 0.0010$. The opaque dark recess box sat $0.0005\text{ units}$ in
  front of the texture plane, completely occluding it from the camera.
- **Code Fix**:
  1. Remove the occluding solid box.
  2. Advance the face plane proudly: `face.position.z = plateD / 2 + 0.0015`.
  3. Ensure `tex.needsUpdate = true` and `side: THREE.DoubleSide`.

---

### DIAG-003: Bench Z-Fighting (Black & White Zebra Striping / Flickering)

- **Visual Symptom**: When orbiting, panning, or zooming the camera, the black lab countertop rapidly flickers with
  alternating black and white/grey horizontal stripes (moiré patterns).
- **Why It Occurred**: In `buildLabRoom()`:
  - `islandTop`: Solid epoxy resin box ($10.15\text{ m} \times 5.75\text{ m}$), top surface at $Y = 9.000$. Material:
    `#141820` (black).
  - `edge`: Intended as edge trim, but created as a **full solid box**
    ($10.18\text{ m} \times 5.78\text{ m} \times 0.03\text{ m}$), top surface ALSO at $Y = 9.000$. Material: `#9aa3ac`
    (light steel grey). Because two solid geometries shared the exact same top plane across $58\text{ m}^2$, the GPU
    depth buffer produced severe Z-fighting.
- **Code Fix**: Replace the solid `edge` box with **4 discrete perimeter trim strips** that wrap around the outside
  borders ($X$ and $Z$ flanks), leaving the top surface exclusively to `islandTop`:

  ```javascript
  // Front & Back perimeter trims
  const edgeF = box(ib.sx + 0.15 + trimW * 2, trimT, trimW, matSteel);
  edgeF.position.set(ib.cx, trimY, ib.cz - halfZ - trimW / 2);
  const edgeB = box(ib.sx + 0.15 + trimW * 2, trimT, trimW, matSteel);
  edgeB.position.set(ib.cx, trimY, ib.cz + halfZ + trimW / 2);

  // Left & Right perimeter trims
  const edgeL = box(trimW, trimT, ib.sz + 0.15, matSteel);
  edgeL.position.set(ib.cx - halfX - trimW / 2, trimY, ib.cz);
  const edgeR = box(trimW, trimT, ib.sz + 0.15, matSteel);
  edgeR.position.set(ib.cx + halfX + trimW / 2, trimY, ib.cz);
  ```

---

### DIAG-004: Industrial Design Deviations (Power Button Location, Size, Labeling)

- **Visual Symptom**: A protruding chrome cylinder with a glowing neon green halo ring sits on the upper right corner of
  the console plastic bezel, labeled `"Capacitive Power Button (Click to Toggle Power)"`.
- **Physical Machine Reality**:
  1. **Through-Panel Integration**: On the real Mettler Toledo XSE/XP terminal, the power button actually passes
     **directly through the front LED/glass panel assembly**. It is not an asymmetric widget glued onto a plastic bezel
     shoulder.
  2. **Unlabelled Cleanliness**: In real scientific equipment, this control is unlabelled (or carries only a universal
     flush $\text{IEC 60417-5009}$ standby symbol). Lab instruments avoid verbose text tags like "Capacitive Power
     Button".
  3. **Label vs. Form Contradiction**: The code labeled it "Capacitive", but modeled it as a physical raised chrome
     cylinder with mechanical travel and a sci-fi LED halo. A capacitive sensor has no moving plunger.
  4. **Hygiene & Metrology Violations**: In wet chemical environments, protruding mechanical buttons collect powder
     spills and trap corrosive reagents. Modern balances utilize continuous sealed front panels with through-glass
     capacitive or membrane action.

---

### DIAG-005: Dynamic Canvas LCD Inversion & Horizontal Mirroring (UI_LCD Orientation)

- **Visual Symptom**: Dynamic digital display text (e.g. `SREdesigns STIR-HEAT 500-D`, `SAFE: 320°C`, `HEATER`,
  `STIRRER`) renders upside down, or when rotated $180^\circ$ renders mirrored right-to-left.
- **Why It Occurred**:
  1. A manual compensation `lcdMesh.rotation.z = Math.PI` was applied to the display quad. This flipped both axes in
     screen space, causing the text to render completely upside-down.
  2. Standard Three.js canvas texturing requires `flipY = false` to avoid vertical GPU inversion. However, when mounted
     on a sloped chamfer console with rotated local coordinates, the horizontal UV coordinates mapped right-to-left.
  3. Naively applying negative scaling (`scale.x = -1`) inverts the matrix determinant, reversing triangle winding order
     which causes backface culling failures, inverted surface normals, and inaccurate pointer raycasting.
- **Enforced Rule (AGENTS.md & CAD Protocol)**:
  - Dynamic canvas textures bound to `UI_LCD` must explicitly set `flipY = false` at creation.
  - Never use negative scale matrices (`scale.x = -1`) to flip textures on solid interactive meshes.
  - Invert horizontal UV coordinates directly on the buffer geometry attribute:
    $$U_{\text{corrected}} = 1.0 - U_{\text{original}}$$
- **Code Fix**:

  ```javascript
  // hotplate3d.js
  const lcdGeo = new THREE.PlaneGeometry(bezelW - 0.08, bezelH - 0.08);
  // Invert UV X coordinate directly on the buffer to fix horizontal mirroring while strictly preserving flipY = false
  const uvAttr = lcdGeo.attributes.uv;
  for (let i = 0; i < uvAttr.count; i++) {
    uvAttr.setX(i, 1.0 - uvAttr.getX(i));
  }
  uvAttr.needsUpdate = true;
  ```

---

### DIAG-006: Kinetic Collision with Wall Backsplash (Door Slide Over-Travel)

- **Visual Symptom**: When the draft doors slide backwards to open, the glass panels physically penetrate the electrical
  backsplash and table wall.
- **Root Cause**: The lab bench depth was only $5.60\text{ units}$ ($Z_{\text{backsplash}} = 2.76$), while the door
  stroke ($MAX\_SLIDE = 1.40$) drove the glass rear edge to $Z = 2.74$, intersecting the wall face.
- **Code Fix**:
  1. Deepen the precision balance bench to standard $720\text{ mm}$ depth (`BENCH.sz = 7.2`), pushing the backsplash
     back to $Z = 3.56$.
  2. Tune realistic door stroke to $MAX\_SLIDE = 1.15$, providing $> 48\text{ cm}$ of open-air clearance.

---

### DIAG-007: Floating Glass Panes (Missing Extruded Guide Tracks)

- **Visual Symptom**: The sliding glass panels float in mid-air between corner posts without runners or retention
  channels.
- **Physical Machine Reality**: Precision balances feature dual-channel extruded aluminum lower runner rails and upper
  header tracks.
- **Code Fix**: Modeled authentic lower U-channel rails with inset glide grooves (`railW = 0.06, railH = 0.05`) and
  front/rear threshold seals.

---

### DIAG-008: Solid Opaque Roof Blocking Sliding Pipette Aperture

- **Visual Symptom**: The top of the draft shield is covered by a solid aluminum slab, preventing pipetting even when
  the top glass door is retracted.
- **Physical Machine Reality**: The draft shield ceiling is an **open rectangular frame**. Sliding the top glass door
  backwards exposes a wide open vertical aperture directly over the weighing pan.
- **Code Fix**: Replaced the solid ceiling slab with an open 4-sided perimeter header frame (`topTrackL`, `topTrackR`,
  `topHeaderF`, `topHeaderB`), allowing direct vertical sample loading.

---

### DIAG-009: Chamber Cantilever Overhang & Floating Drive Column

- **Visual Symptom**: The weighing chamber glass and lower threshold rails jet out over the top of the sloped
  touchscreen console; a narrow white rectangular box (`driveColumn`) hovers in mid-air off the rear chassis lip.
- **Root Cause**: The unibody flat deck spans $Z \in [-0.60, 1.90]$. When chamber depth was $2.40\text{ m}$ centered at
  $Z = 0.40$, its front reached $Z = -0.80$ ($20\text{ cm}$ cantilever into empty air over the console bevel). The drive
  column was placed behind the chamber at $Z = 1.68$ to $2.01$ without structural base grounding.
- **Physical Machine Reality**: In metrological balances (e.g. Mettler Toledo XSE), the weighing chamber sits flush on
  the flat deck behind the terminal. Behind the chamber sits the **Rear Unibody Electronics & Motor Tower**
  ($Z \in [1.35, 1.90]$), solidly grounded to the base underpan and housing internal drive belts, RS-232, Ethernet, and
  cooling vents.
- **Code Fix**:
  1. Bound chamber depth to $1.90\text{ m}$ centered at $Z = 0.40$ (chamber spans $Z \in [-0.55, 1.35]$), terminating
     $5\text{ cm}$ behind the slope transition $Z = -0.60$ with zero console overhang.
  2. Model the authentic, grounded rear unibody tower from $Z = 1.35$ to $1.90$, spanning $Y \in [0, 2.45]$ flush with
     the unibody rear face.

---

### DIAG-010: Upper Side-Glass Air Gap & Captive Dual-Track Guide Rails

- **Visual Symptom**: A noticeable $45\text{ mm}$ gap exists between the top edge of the side door glass and the upper
  frame; glass panels lack upper track capture.
- **Root Cause**: Upper track rail sat at $Y = 2.40$ to $2.45$, while side glass height was $2.31$ centered at
  $Y = 1.20$ ($Y_{\text{max}} = 2.355$). The top rails also lacked downward retention flanges.
- **Physical Machine Reality**: Precision balances feature dual-extrusion guide tracks with upper inverted U-channels
  capturing the top glass edge to ensure dust exclusion and draft isolation.
- **Code Fix**:
  1. Model extruded downward U-channel lips on top rails ($Y = 2.37$ to $2.40$) with dark glide channels.
  2. Extend side door glass height to $2.365\text{ m}$ centered at $Y = 1.2125$. The glass extends $20\text{ mm}$ down
     into the lower track groove ($Y \le 0.05$) and $25\text{ mm}$ up into the upper U-channel ($Y \ge 2.37$),
     eliminating all air gaps.

---

### DIAG-011: Inverted Draft Shield Status Logic & Asymptotic Floating Lerp

- **Visual Symptom**: Status displays "Air draft detected" when all doors are closed, and "Ready to tare / weigh" when a
  door is opened.
- **Root Cause**: Two-fold:
  1. Asymptotic float lerp (`currentDoor += (target - current) * dt * speed`) never hits exact `0.0` (remaining
     $\approx 10^{-11} > 0$).
  2. `updateUI()` was called only on discrete user button clicks, never when `state.isStable` transitioned inside
     `updatePhysics()`. When doors finished closing, the UI stayed frozen on "Air draft detected". Opening a door
     triggered a click event while `isStable` happened to be true, briefly flashing "Ready".
- **Code Fix**:
  1. Snap asymptotic door lerp values to target when `Math.abs(current - target) < 0.002`.
  2. Use draft detection threshold `anyDoorOpen = (currentDoor* > 0.03)`.
  3. Call `updateUI()` reactively whenever stability state transitions inside `updatePhysics()`.

---

### DIAG-012: Coplanar Z-Fighting Flickering on Rear Electronics Tower Metal Top

- **Visual Symptom**: The brushed aluminum metal top plate on the rear unibody electronics tower flickers rapidly
  between white and metallic grey when rotating or moving the camera.
- **Root Cause**: The unibody tower casting body (`towerCasting`) had a height of $2.450$, and the aluminum top cap
  (`towerCap`) had a height of $0.030$ centered at $Y = 2.435$ ($Y_{\text{top}} = 2.450$). Both the white chassis solid
  and the brushed aluminum metal plate shared an identical top plane coordinate ($Y = 2.450$) over a surface area of
  $2.38 \times 0.53$, creating GPU depth buffer contention.
- **Physical Machine Reality**: In precision machinery, a top metal trim plate sits strictly _on top_ of the chassis
  body casting, not inside the same volume.
- **Code Fix**:
  1. Restrict the casting body height to $Y = 2.425$ (`castingH = 2.425`, centered at $Y = 1.2125$).
  2. Place the brushed aluminum cap plate from $Y = 2.425$ to $Y = 2.450$ (`capT = 0.025`, centered at $Y = 2.4375$).
  3. The casting ends exactly where the cap plate begins, with zero coplanar overlap on the top surface.

---

### DIAG-013: Spirit Level Uncentered Placement & Unwanted Shadow Projection

- **Visual Symptom**: The spirit level looks uncentered and awkwardly jammed against the weighing chamber
  ($X = -1.38, Z = -0.40$), and its cylindrical body casts an unnatural dark shadow across the aluminum base and track
  of the weighing box.
- **Root Cause**:
  1. The left shoulder spans $X \in [-1.78, -1.20]$ (center $X = -1.49$). Placing it at $X = -1.38$ left only
     $18\text{ mm}$ clearance to the chamber but $40\text{ mm}$ to the outer edge, making it heavily off-center.
  2. Placing it at $Z = -0.40$ positioned it halfway back along the side of the weighing chamber rather than at the
     front corner.
  3. The sub-meshes had `castShadow = true` by default from the `cyl()` helper, and sat proud of the deck
     ($45\text{ mm}$ high), throwing a long directional shadow across the weighing box floor.
- **Physical Machine Reality**: In Swiss/German metrology balances, spirit levels are **flush-recessed** into the
  unibody casting at the front-left shoulder ($X = -1.49, Z = -0.52$), in front of the side door travel path, and seated
  flush within a low-profile chamfered chrome bezel.
- **Code Fix**:
  1. Center `levelGroup` mathematically at $X = -1.49$ (equal $0.29\text{ m}$ margins on both sides) and $Z = -0.52$
     (aligned with the front corner of the flat deck).
  2. Model a flush-recessed pocket well with a low-profile chamfered chrome bezel ring.
  3. Explicitly set `castShadow = false` on all spirit level sub-meshes (`well`, `bezelRing`, `fluid`, `ring`,
     `bubbleMesh`, `dome`), eliminating all shadow projection onto the weighing box.

---

## How to Use This Log in Future Visual Audits

1. **Pre-flight Moiré / Z-Fighting Scan**: Orbit camera $360^\circ$ at shallow grazing angles ($15^\circ$ to
   $30^\circ$). If any surface flashes striped patterns, check for overlapping coplanar primitives at identical
   coordinates.
2. **Component Containment Check**: Measure component outer bounds against parent face dimensions ($< 85\%$). Verify
   zero protrusion past chamfers, fillets, or datum planes.
3. **Occlusion Audit**: If a textured canvas or badge appears completely black or uniform in color, check the Z-depth of
   adjacent meshes to ensure no backing box or bezel is rendering in front of the texture plane.
4. **Kinetic Boundary Clearance**: Open all sliding assemblies (`Door_Left`, `Door_Right`, `Door_Top`) to $100\%$ stroke
   and verify zero intersection with walls, cords, or adjacent equipment.
5. **Aperture & Functional Opening Verification**: Ensure sliding covers expose true open apertures rather than sliding
   over solid underlying geometry.
