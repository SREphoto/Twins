# Vacuum Pump Twin Rebuild — Agent Handoff & Context Map

**Created:** 2026-07-29  
**Purpose:** Enable any incoming agent (Gemini, Claude, etc.) to quickly gather the same context that was built during
this planning session. If usage runs out, point the next agent at this document first.

---

## TL;DR — What Happened This Session

1. User requested a **from-scratch rebuild** of `vacuum_pump_twin/` per the `.master/` framework
2. Agent role: **OGA** (Organizational Governance Agent) — planning phase only
3. Read **~25 files** across `.master/`, `centrifuge_twin/` (gold sample), and `vacuum_pump_twin/`
4. Produced an **implementation plan** (6 phases, 13 steps) — awaiting user approval
5. **No code was written or modified** — this was planning and context-gathering only
6. 4 open questions remain for the user before execution can begin

---

## How to Reproduce This Context (Reading List)

A new agent should read these files **in this exact order**. This is the minimum set to understand what needs to happen
and why.

### Step 1: Understand the Framework (read all 5)

| #   | File                                   | What You Learn                                                                                                                                                                  |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `.master/AGENT_SOP.md`                 | **Start here.** Session procedure for ALL agents. Tells you to identify your role, read your charter, understand the target package, and what's mandatory at end-of-session.    |
| 2   | `.master/HOW_TO_BUILD_A_MACHINE.md`    | The normative 8-step process for building any twin. Roles table (who does what), package scaffold layout, and the critical rule: "controller before chrome."                    |
| 3   | `.master/AGENTS_MANDATE.md`            | End-of-session deliverables. **4 mandatory logs**: change log, troubleshooting log, conversation log, self report card. Templates linked. No session is complete without all 4. |
| 4   | `.master/governance/rules.md`          | 11 workspace rules. Key ones: self-contained packages, gold sample is centrifuge, no GLB-only runtime, history is intentional, every twin registered.                           |
| 5   | `.master/governance/scoring_rubric.md` | How to score your own report card (1–100). Caps: no tests = cap 80, guessed facts = cap 70, no logs = cap 40.                                                                   |

### Step 2: Understand the Role

| #   | File                    | What You Learn                                                                                                                               |
| --- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 6   | `.master/agents/OGA.md` | OGA charter: owns structure, standards, registry, mandate enforcement. Does NOT implement viewers (that's NBA) or do research (that's MDRA). |

> **Key insight:** The actual build work is **NBA** (New Build Agent) role. OGA planned. The executing agent should
> adopt the **NBA** role for implementation phases 2–5.

### Step 3: Study the Gold Sample

| #   | File                                            | What You Learn                                                                                                                                                                                                                  |
| --- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7   | `centrifuge_twin/docs/PIPELINE.md`              | **CRITICAL.** How the centrifuge was actually built. 4 stages. Stage 1 (Blender GLB) was a dead end. Stage 3 (procedural Three.js) is what shipped. Key lesson: **GLB-loading viewers are anti-pattern for interactive twins.** |
| 8   | `centrifuge_twin/docs/STANDARD.md`              | The reference twin standard. §2 = required package layout. §3 = architecture layers. §4 = controller pattern. §5 = viewer pattern. §7 = quality bar checklist. §8 = steps to build the next machine.                            |
| 9   | `centrifuge_twin/standards/machine_template.md` | Scaffold checklist for new machines. Copy to `docs/PRODUCT_BRIEF.md` and tick every section.                                                                                                                                    |

**Gold sample viewer structure** (the pattern to follow):

```
centrifuge_twin/software/viewer/
  index.html     (12 KB — slim shell, links CSS/JS modules)
  style.css      (21 KB — extracted styles)
  app.js         (109 KB — UI, state machine, demo loops)
  centrifuge3d.js (67 KB — procedural Three.js geometry)
  sfx.js         (30 KB — Web Audio sound effects)
  models/        (optional GLB, NOT loaded by app)
```

### Step 4: Understand What Exists in vacuum_pump_twin

| #   | File                            | What You Learn                                                                                                                                                              | Status     |
| --- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 10  | `research/RESEARCH_SUMMARY.md`  | Index of all 9 downloaded files + 5 created research docs. **Research is DONE — do not redo.**                                                                              | ✅ Keep    |
| 11  | `research/96_Vacuum_Pump.md`    | Complete technical reference: operation principle, physical specs, control layout, materials, safety systems, moving parts.                                                 | ✅ Keep    |
| 12  | `research/cad_reference.md`     | Dimensional specs for all 35+ parts, materials with color/roughness/metallic values, assembly positions, vertical stack. **Essential for building procedural 3D geometry.** | ✅ Keep    |
| 13  | `research/schematics.md`        | Electrical system, motor specs, state machine, wiring.                                                                                                                      | ✅ Keep    |
| 14  | `research/maintenance_guide.md` | Service documentation, troubleshooting, diaphragm replacement steps.                                                                                                        | ✅ Keep    |
| 15  | `research/sources.md`           | All URLs, citations, legal notes.                                                                                                                                           | ✅ Keep    |
| 16  | `docs/BOM.md`                   | 7-section bill of materials. 118 lines, detailed.                                                                                                                           | ✅ Keep    |
| 17  | `docs/dimensions.md`            | Overall dimensions + per-component.                                                                                                                                         | ✅ Keep    |
| 18  | `docs/control_spec.md`          | Current control spec — **too minimal** (4 states, no transitions, no key map). Needs expansion.                                                                             | ⚠️ Enhance |
| 18a | `docs/PART_SPECIFICATIONS.md`   | **🔑 NEW KEY SPECIFICATION.** Detailed physical specs of every component (washers, screws, bolts, shims, disk springs, thread sizes, spring rates).                          | ✅ Keep    |

### Step 5: Understand What Must Be Replaced

| #   | File                                     | Problem                                                                                                                                                                        | Action                                |
| --- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| 19  | `software/viewer/index.html`             | **1674 lines**, monolithic single file. Inlines all CSS + JS. Loads 8.7 MB GLB at runtime. Uses "SREdesigns Gold-Tier" branding. This is the PIPELINE.md Stage 1 anti-pattern. | 🔴 Replace entirely                   |
| 20  | `software/viewer/models/vacuum_pump.glb` | 8.7 MB GLB loaded at runtime.                                                                                                                                                  | 🔴 Move to `export/glb/` as reference |
| 21  | `software/controller/pump_controller.py` | Only 52 lines, 4 states, no fault handling, no `snap()` method, no physics model.                                                                                              | 🔴 Rewrite                            |
| 22  | `software/controller/test_controller.py` | Only 2 tests (initial state + basic evacuation).                                                                                                                               | 🔴 Rewrite with 15+ tests             |

---

## Key Architectural Decisions Already Made

These were discovered from reading the gold sample and `.master/` docs — they are NOT open questions:

1. **Procedural Three.js, not GLB runtime.** The centrifuge learned this the hard way (PIPELINE Stage 1). Build geometry
   in code with named handles for animation.
2. **Controller before chrome.** Python state machine + tests must work before any viewer polish.
3. **Modular files, not monolithic.** Split into `index.html` (shell), `style.css`, `app.js`, `vacuum_pump3d.js`,
   `sfx.js` — following the centrifuge pattern.
4. **Lab environment in-scene.** Floor, walls, bench, lighting — never a void.
5. **Self-contained package.** No imports from `.master/` or sibling twins at runtime.
6. **CDN Three.js via import map.** No bundler required. Cache-bust `?v=` on ship.

---

## Open Questions — RESOLVED ✅

All 4 questions were answered by the user on 2026-07-29:

1. **Speed control?** → **YES.** "As much functionality as a real lab would need." Include speed control dial (1500–3000 RPM).
2. **Vacuum gauge display?** → **BOTH.** Analog Bourdon canvas texture on 3D model + digital readout in UI panel.
3. **Demo loop scenario?** → **Student-oriented educational demo.** Startup → leak check → evacuation curve → gas ballast demo → controlled vent → shutdown, with on-screen annotations.
4. **Maintenance trainer?** → **YES.** "Research is in hopes of gaining understanding about all individual parts." Build exploded view labeling each BOM component.

---

## Registry Status

The vacuum pump is **already registered** in all three locations:

| Location                                        | Status                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ |
| `.master/registry/machines.md`                  | Row exists, `status: active`                                                         |
| `.master/registry/vacuum_pump_twin_manifest.md` | File exists                                                                          |
| `lab_viewer/machines/registry.js`               | Entry exists, `status: "ready"`, `viewerUrl: "../vacuum_pump_twin/software/viewer/"` |

These entries will need verification after rebuild but should not need major changes.

---

## Implementation Plan Location

The full implementation plan (6 phases, 13 steps, verification checklist) was created in this session's artifacts
directory at:

```
.gemini/antigravity-ide/brain/906d6925-3c50-4e41-bf15-060b558608c1/implementation_plan.md
```

> **NOTE:** That path is conversation-specific. If a new agent cannot access it, the plan contents are summarized below
> and can be reconstructed from this handoff document.

### Plan Summary (6 Phases)

1. **Phase 1 — Scaffold & Docs:** Create AGENTS.md, README.md, PRODUCT_BRIEF.md, STANDARD.md. Expand control_spec.md to
   7 states with full transition table.
2. **Phase 2 — Python Controller:** Full rewrite of pump_controller.py with 7 states, exponential evacuation physics,
   gas ballast modeling, thermal faults, `snap()` method. Comprehensive test_controller.py (15+ tests).
3. **Phase 3 — Procedural Viewer:** Replace monolithic index.html with modular files: `vacuum_pump3d.js` (procedural
   geometry), `app.js` (UI + state), `sfx.js` (audio), `style.css`, slim `index.html`.
4. **Phase 4 — Package Finalization:** Move GLB to export/glb/, add PIPELINE.md, standards/, verify relocatable.
5. **Phase 5 — Registry:** Verify all 3 registry entries are current after rebuild.
6. **Phase 6 — Logs:** All 4 mandatory end-of-session deliverables per AGENTS_MANDATE.md.

---

## Files That Must NOT Be Touched

| Path                                  | Why                                    |
| ------------------------------------- | -------------------------------------- |
| `vacuum_pump_twin/research/*`         | Research is complete and authoritative |
| `vacuum_pump_twin/docs/BOM.md`        | Complete 7-section BOM                 |
| `vacuum_pump_twin/docs/dimensions.md` | Verified dimensions                    |
| `vacuum_pump_twin/research/manuals/`  | 6 downloaded PDFs                      |
| `vacuum_pump_twin/research/photos/`   | 3 reference images                     |
| `centrifuge_twin/*`                   | Gold sample — read-only reference      |
| `.master/governance/*`                | Authority docs                         |
| `.master/agents/*`                    | Role charters                          |
| `.master/templates/*`                 | Log templates                          |

---

## Log Templates Location

When the build is complete, the agent MUST write 4 mandatory end-of-session deliverables using:

| Template                                      | Destination                                      |
| --------------------------------------------- | ------------------------------------------------ |
| `.master/templates/change_log_entry.md`       | Prepend to `.master/logs/master_change_log.md`   |
| `.master/templates/troubleshooting_entry.md`  | Prepend to `.master/logs/troubleshooting_log.md` |
| `.master/templates/conversation_log_entry.md` | Prepend to `.master/logs/conversation_log.md`    |
| `.master/templates/self_report_card.md`       | New file in `.master/logs/report_cards/`         |

---

## Quick Start for Next Agent

```
1. Read this file (you're already doing that)
2. Read .master/AGENT_SOP.md (session procedure)
3. Read .master/HOW_TO_BUILD_A_MACHINE.md (build process)
4. Read centrifuge_twin/docs/PIPELINE.md (gold sample build history — CRITICAL)
5. Read centrifuge_twin/docs/STANDARD.md (the standard to follow)
6. Read vacuum_pump_twin/research/cad_reference.md (dimensions for 3D)
7. Read vacuum_pump_twin/research/96_Vacuum_Pump.md (technical reference)
8. Read vacuum_pump_twin/docs/control_spec.md (current — needs expansion)
9. Read the implementation plan (artifact or reconstruct from this doc)
10. Ask user: proceed with plan, or modify?
11. Adopt NBA role. Execute phases 1–6.
12. Write all 4 mandatory end-of-session logs.
```
