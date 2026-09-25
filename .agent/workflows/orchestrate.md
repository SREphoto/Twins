---
description: Automated parallel execution for CAD subagents — spawn MDRA, CAD-BA, and WEB-BA across isolated tasks
---

# Parallel CAD Orchestration (/orchestrate)

Use this workflow when building or upgrading machine twins across independent parallel tracks.

## 1. Plan Work Streams
1. **Track A (Research & Specifications)**: MDRA ingests manuals and extracts $W \times D \times H$ mm.
2. **Track B (Controller Logic)**: Writes Python state machines and unit tests in `software/controller/`.
3. **Track C (Solid Modeling)**: CAD-BA scripts Blender solids in `cad/`.

## 2. Spawn Subagents
Assign explicit agent instructions:
- Agent 1: MDRA -> `research/manuals/` to `docs/dimensions.md`
- Agent 2: CAD-BA -> `cad/create_[machine].py`
- Agent 3: WEB-BA -> `software/viewer/`

## 3. Merge & Governance Gate
Once parallel tasks complete:
1. OGA-CAD verifies part taxonomy and dimensional constraints.
2. Run `node .master/05_PERSONAL_MISC/tools/cad_validator.mjs`.
3. Log entries to `.master/logs/master_change_log.md`.
