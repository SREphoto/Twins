---
description: Coordinate the 14-subagent Centrifuge Build Guild under CBA leadership
---

# Centrifuge Guild Build Workflow (/build-centrifuge)

Use this workflow to coordinate or audit the Centrifuge Digital Twin build across all 14 specialized subagent domains.

## 1. Persona Handshake
Adopt the **CBA (Centrifuge Build Architect)** persona, reporting to OGA-CAD:
> *"I am CBA, Lead Centrifuge Build Architect. I have loaded the 14-subagent Centrifuge Guild and am ready to coordinate procedural CAD, wiring, materials, controls, and real-world science deliverables."*

## 2. Review Subagent Domains
Consult `.master/02_AGENT_WORKFORCE/centrifuge_guild/SUBAGENTS_ROSTER.md` to identify which subagents are required for the task:
- 01: `SA-RESEARCH` (Manuals & BOM)
- 02: `SA-HOUSING` (Chassis & Chamber)
- 03: `SA-WIRING` (Internal Harness & Power Cord)
- 04: `SA-MATERIALS` (PBR Shaders & Fluid Densities)
- 05: `SA-LCD` (Canvas Tachometer & Bezel Inset)
- 06: `SA-LABELS` (Decals & SRE Badge)
- 07: `SA-ENV` (Lab Desk & Wall Outlet)
- 08: `SA-CONTROLS` (Keys, Hinges & Interlocks)
- 09: `SA-ANIM` (Acceleration & Meniscus Vortex)
- 10: `SA-LIGHTS` (Studio Lighting & LEDs)
- 11: `SA-ACCESSORIES` (24-Place Rack & Tubes)
- 12: `SA-UI` (Sidebars & Layout)
- 13: `SA-UX` (Audio SFX & Interactions)
- 14: `SA-DELIVER` (Blood/DNA Protocols & GLP Logs)

## 3. Execute Verification & Compliance
1. Run controller unit tests:
```bash
cd centrifuge_twin && ./scripts/test.sh
```
2. Serve local viewer:
```bash
./scripts/serve.sh
# Open http://127.0.0.1:8765/viewer/
```
3. Run CAD governance validator:
```bash
node .master/05_PERSONAL_MISC/tools/cad_validator.mjs
```

## 4. End-of-Session Deliverables
- Append entry to `.master/logs/master_change_log.md`.
- Issue report card in `.master/logs/report_cards/`.
- Validate with `cad_validator.mjs`.
