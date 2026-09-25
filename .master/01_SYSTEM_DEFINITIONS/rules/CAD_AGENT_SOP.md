# SOP: 3D Machine Agent Operations & Workflows

**Author**: OGA-CAD (Master Orchestrator)  
**Applies To**: ALL AI Agents (Antigravity, Gemini CLI, Claude, Copilot) operating within `Twins`.  
**Enforcement**: Mandatory. Failure to follow this SOP results in rollback of changes and logging of non-compliance in `.master/logs/conversation_log.md`.

---

## 🛑 Phase 1: Pre-Execution (Before Writing Code or 3D Meshes)

Before writing any logic, modifying Blender scripts, or editing WebGL viewers, an agent MUST complete the following verification loop:

1. **Initialize Session**: Run `/start` or `/cad-start`. Adopt the **OGA-CAD** persona and acknowledge the **Dimensional Freeze (Code 4771-CAD)**.
2. **Verify Authorization**: Are you modifying the exterior spatial envelope or chassis proportions? If so, did the USER provide authorization code `4771` (or `4771-CAD`)? If no, **STOP** and ask for it.
3. **Consult the Source of Truth**:
   - Check `.master/DIRECTORY.md` to identify the machine's manifest and existing standards.
   - Read the machine package's `docs/PRODUCT_BRIEF.md`, `docs/dimensions.md`, and `docs/control_spec.md`.
4. **Check the Manifests & Utilities**:
   - Consult `.master/05_PERSONAL_MISC/tools/TOOLS_MANIFEST.md` to verify available test and server scripts (`scripts/serve.sh`, `scripts/verify_twin.sh`, `scripts/test.sh`).
5. **State Your Intent**: Briefly output your proposed technical approach so the user can verify alignment.

---

## 🛠️ Phase 2: Execution & Development Standards

When actively manipulating files within `Twins`, adhere to the following standards:

1. **Exhaustive Procedural Detail (Zero File Size Limits)**:
   - Every single part needs complete procedural design. Every screw (with real hex socket or cross-recess depth), washer, bracket, and gasket must be modeled in genuine 3D geometry.
   - Do not bake micro-fasteners into flat 2D normal maps out of fear of file size.
2. **The 8-Stage Piece-by-Piece Assembly Sequence**:
   - Stage 1: Spatial Envelope & Datum Freeze
   - Stage 2: Base Plate & Leveling Feet
   - Stage 3: Unibody Outer Chassis & Louvers
   - Stage 4: Console Pocket & Recessed Bezel (Anti-Clipping Rule)
   - Stage 5: Kinematic Assemblies & Mechanical Pivots
   - Stage 6: Fluidics, Glassware & Optics
   - Stage 7: Electronics, Membrane Buttons & LCD
   - Stage 8: Fasteners, Hardware & Power Socket
3. **Semantic Part Taxonomy**: Enforce standard node naming (`Body_Chassis`, `UI_LCD`, `Btn_<Action>`, `Pivot_<Assembly>`, `Glass_<Part>`, `Fastener_*`, `Foot_Leveling_*`, `Badge_SREdesigns`).
4. **Dynamic Canvas LCD Texture Rule**:
   - High-DPI canvas ($1024 \times 512$ or $2048 \times 1024$).
   - Mandatory: `texture.flipY = false`.
   - Never apply negative scale matrices (`scale.x = -1`). If typography is reversed, invert the buffer geometry UV coordinates: `uv.setX(i, 1.0 - uv.getX(i))`.
5. **Controller Decoupling**:
   - Implement machine state logic and safety interlocks in `software/controller/`.
   - Ensure `./scripts/test.sh` passes 100% of unit tests before web integration.

---

## 📝 Phase 3: Post-Execution & Verification Pipeline

Your task is **NOT COMPLETE** when the mesh renders. The task is only complete when the following pipeline is executed:

1. **Local Verification**:
   - Start local viewer (`./scripts/serve.sh` on port 8765) and inspect.
   - Run Python controller tests (`./scripts/test.sh`).
2. **Visual QA Check (SOA / VQA)**:
   - Verify all 6 viewpoints: `CAM_ISO`, `CAM_FRONT`, `CAM_SIDE`, `CAM_TOP`, `CAM_EXPLODED`, `STATE_ACTIVE`.
   - Ensure zero browser console exceptions.
3. **Log the Work**:
   - Append an entry to `.master/logs/master_change_log.md` detailing date, agent, machine package, and files modified.
   - If a bug or diagnostic issue was addressed, record an entry in `.master/logs/troubleshooting_log.md` adhering to the `[ISS-XXX]` schema.
4. **Issue a Self-Report Card**:
   - Fill out `.master/01_SYSTEM_DEFINITIONS/rules/REPORT_CARD_TEMPLATE.md`, score your work honestly (1–100), disclose any hallucinations or guessed parameters, and save to `.master/logs/report_cards/`.
5. **Run Automated Validation**:
   - Execute `node .master/05_PERSONAL_MISC/tools/cad_validator.mjs`.

---

_Authored under OGA-CAD Master Governance — ChemMate & Twins Systems Engineering._
