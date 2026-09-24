# Agent roster

Task-specific agents for the Twins workspace. Charters are the source of truth for scope and handoffs.

| Code       | Name                                   | Charter                |
| ---------- | -------------------------------------- | ---------------------- |
| **MDRA**   | Machine Documents and Researcher Agent | [MDRA.md](MDRA.md)     |
| **CAD-BA** | Blender CAD Build Agent                | [CAD-BA.md](CAD-BA.md) |
| **WEB-BA** | Three.js Web Runtime Agent             | [WEB-BA.md](WEB-BA.md) |
| **VQA**    | Visual Quality & Preflight Auditor     | [VQA.md](VQA.md)       |
| **LIA**    | Lab Integration Agent                  | [LIA.md](LIA.md)       |
| **MIA**    | Migration & Asset Ingestion Agent      | [MIA.md](MIA.md)       |
| **OGA**    | Organizational Governance Agent        | [OGA.md](OGA.md)       |
| **NBA**    | New Build Agent (Legacy/General)       | [NBA.md](NBA.md)       |
| **SAA**    | Scheduling and Administrative Agent    | [SAA.md](SAA.md)       |
| **LIAR**   | Legal Information Agent and Researcher | [LIAR.md](LIAR.md)     |
| **SEOA**   | SEO Agent                              | [SEOA.md](SEOA.md)     |
| **BC**     | Building Coach                         | [BC.md](BC.md)         |

## Shared rules

1. Follow **[AGENT_SOP.md](../AGENT_SOP.md)** every session (start → work → close).
2. Work under `Twins/`; respect relocatable packages.
3. Obey the **5-Agent Hybrid CAD-to-Web Pipeline** in [AGENTS.md](../../.agents/AGENTS.md).
4. Complete [AGENTS_MANDATE.md](../AGENTS_MANDATE.md) **every** session (log detail).
5. Zero compromises on file size: model every screw, washer, thread, and foot in genuine 3D physical geometry.
6. Do not invent OEM branding or legal clearance (defer to LIAR).

## Standard 5-Agent Handoff Chain (Machine Twin Creation)

```text
MDRA (Extract 1:1 mm dimensions & BOM from PDF manuals)
  → CAD-BA (Script Blender CAD solids, boolean-carved pockets, physical fasteners & GLB export)
  → WEB-BA (Load GLB in Three.js, bind live dynamic canvas LCD, attach raycaster clicks)
  → VQA (Execute 4-camera visual audit via browser_subagent and verify console)
  → LIA (Register machine in lab_viewer desk & connect audio/transitions)
```
