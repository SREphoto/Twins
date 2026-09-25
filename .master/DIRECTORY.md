# Twins Master Directory Index
## Authoritative Architecture & Operations Registry for ChemMate 3D Machine Digital Twins

This is the central index of all authoritative files in the `Twins` ecosystem, establishing full architectural parity with ChemMate's numbered master directory system (CMDS).

---

## 🚀 Start Here & Grounding

- [**Master README**](./README.md) — Twins workspace overview and quickstart
- [**Agent Mandate**](./AGENTS_MANDATE.md) — Non-negotiable session deliverables (Changelog, Troubleshooting, Conversation, Report Cards)
- [**Master SOP**](./01_SYSTEM_DEFINITIONS/rules/CAD_AGENT_SOP.md) (and [Legacy SOP](./AGENT_SOP.md)) — Pre, Execution, and Post-Execution protocols
- [**Information Map**](./INFORMATION_MAP.md) — The dependency ripple matrix: If you change X, update Y
- [**How to Build a Machine**](./HOW_TO_BUILD_A_MACHINE.md) — Normative 8-stage assembly sequence from OEM specs to Lab Desk

---

## 🏢 01. System Definitions & Rules (`01_SYSTEM_DEFINITIONS/`)

- [Product Strategy](./01_SYSTEM_DEFINITIONS/core/PRODUCT_STRATEGY.md) — SRE Laboratory Digital Twin vision, fidelity standards, classroom delivery
- [Architecture Blueprint](./01_SYSTEM_DEFINITIONS/system/ARCHITECTURE_BLUEPRINT.md) — Hybrid CAD-to-Web pipeline, Three.js, Python controllers, WebGL lab viewer
- [Tech Stack & Tooling](./01_SYSTEM_DEFINITIONS/system/TECH_STACK.md) — Three.js, Blender `bpy`, Python 3, WebGL, HTML5 Canvas LCD, Lucide
- [Documentation Manifest](./01_SYSTEM_DEFINITIONS/system/DOCUMENTATION_MANIFEST.json) — Integrity registry for all master files
- [Version Registry](./01_SYSTEM_DEFINITIONS/system/VERSION.md) — Release notes and component versions
- [CAD Governance Rules](./01_SYSTEM_DEFINITIONS/rules/CAD_GOVERNANCE.md) — Dimensional freeze (Code 4771-CAD), Anti-clipping rule, Tabletop datum $Y=0$
- [Agent SOP](./01_SYSTEM_DEFINITIONS/rules/CAD_AGENT_SOP.md) — The 3-Phase standard operating procedure for all CAD & Web agents
- [Report Card Template](./01_SYSTEM_DEFINITIONS/rules/REPORT_CARD_TEMPLATE.md) — Performance self-assessment template with 1–100 scoring
- [ADR 001: Procedural Three.js over Static GLB](./01_SYSTEM_DEFINITIONS/architecture/decisions/ADR_001_PROCEDURAL_THREEJS_OVER_STATIC_GLB.md) — Core interactive architectural decision
- [ADR Template](./01_SYSTEM_DEFINITIONS/architecture/decisions/ADR_TEMPLATE.md) — Architecture Decision Record template

---

## 🤖 02. Agent Workforce (`02_AGENT_WORKFORCE/`)

### Cornerstone Triad
- [**OGA-CAD**](./02_AGENT_WORKFORCE/agents/OGA_CAD.md) — Master CAD Orchestration & Governance Controller (Chief of Staff)
- [**SOA**](./02_AGENT_WORKFORCE/agents/SOA.md) — Synthetic Operator Agent (Empirical Outside-In Machine Tester & Ergonomic Auditor)
- [**SHAA-3D**](./02_AGENT_WORKFORCE/agents/SHAA_3D.md) — Self-Healing CAD & Visual Diagnostics Agent ([Fixes Compendium](./02_AGENT_WORKFORCE/agents/SHAA_CAD_FIXES_COMPENDIUM.md))

### 5-Agent Hybrid Pipeline & Specialists
- [MDRA](./agents/MDRA.md) — Machine Dimension & Reference Agent (Ingests OEM manuals, extracts $W \times D \times H$ mm)
- [CAD-BA](./agents/CAD-BA.md) — CAD Build Agent (Procedural Blender `bpy` solids, booleans, kinematic origins)
- [WEB-BA](./agents/WEB-BA.md) — Web Build Agent (Three.js WebGL runtime, dynamic LCD canvas, raycasting buttons)
- [VQA](./agents/VQA.md) — Visual QA Auditor (6-viewpoint automated camera verification: `CAM_ISO`, `CAM_FRONT`, `CAM_SIDE`, `CAM_TOP`, `CAM_EXPLODED`, `STATE_ACTIVE`)
- [LIA](./agents/LIA.md) — Lab Integration Agent (Registers verified twins into `lab_viewer/machines/registry.js`)
- [LIAR](./agents/LIAR.md) — Legal, IP & Asset Rights (OEM brand name clearance, generic SRE badging)
- [BC](./agents/BC.md) — Build Coach (Pitfalls, quality standards, procedural modeling guidance)
- [SAA](./agents/SAA.md) — Scheduling & Assignment Agent (Sprint tracking, daily pulses, report card logging)
- [SEOA](./agents/SEOA.md) — Discoverability & Public Metadata Agent
- [Workforce Map & Matrix](./02_AGENT_WORKFORCE/agents/WORKFORCE_MAP.md) — Cross-agent communication and handoff contract

### 🌀 Centrifuge Subagent Guild (`centrifuge_guild/`)
- [**CBA**](./02_AGENT_WORKFORCE/centrifuge_guild/CENTRIFUGE_BUILD_ARCHITECT.md) — Centrifuge Build Architect (Lead Orchestrator)
- [**Subagents Roster**](./02_AGENT_WORKFORCE/centrifuge_guild/SUBAGENTS_ROSTER.md) — 14 specialized domain subagents (`SA-RESEARCH`, `SA-HOUSING`, `SA-WIRING`, `SA-MATERIALS`, `SA-LCD`, `SA-LABELS`, `SA-ENV`, `SA-CONTROLS`, `SA-ANIM`, `SA-LIGHTS`, `SA-ACCESSORIES`, `SA-UI`, `SA-UX`, `SA-DELIVER`)

---

## 🧠 03. Operations & Memory (`03_OPERATIONS/`)

- [Master Change Log](./logs/master_change_log.md) — Mandatory session activity log (Root & Master mirrored)
- [Troubleshooting Log](./logs/troubleshooting_log.md) — AST-compliant incident log with `[ISS-XXX]` and `[DIAG-XXX]` records
- [Conversation Log](./logs/conversation_log.md) — Durable session goals, decisions, and open human questions
- [Agent Report Cards Archive](./logs/report_cards/) — Stored self-assessments
- [Post-Task Analysis & Ideas Digest](./03_OPERATIONS/brain/POST_TASK_ANALYSIS_AND_IDEAS_DIGEST.md) — Long-term architectural ideas and lessons learned
- [CAD Implementation Plan Template](./03_OPERATIONS/implementation_plans/CAD_IMPLEMENTATION_PLAN_TEMPLATE.md) — Structured template for new machine twins

---

## 🗄️ 04. Archive & Cold Storage (`04_ARCHIVE/`)

- [Archive Manifest](./04_ARCHIVE/ARCHIVE_MANIFEST.md) — Registry of superseded CAD scripts, deprecated geometries, and historical experiments

---

## 🛠️ 05. Personal Misc & Developer Tools (`05_PERSONAL_MISC/`)

- [Tools Manifest](./05_PERSONAL_MISC/tools/TOOLS_MANIFEST.md) — CLI tools, serve scripts, test harnesses, and validators
- [CAD Validator (`cad_validator.mjs`)](./05_PERSONAL_MISC/tools/cad_validator.mjs) — Automated governance gate enforcing dimensions, taxonomy, and changelog

---

## 🔬 06. Machine Catalogue & Registry (`06_MACHINES/`)

- [Master Machine Catalogue](./06_MACHINES/MACHINE_CATALOGUE.md) — Complete specifications, status, and dimensions of all 13 machine twins
- [Machines Index](./registry/machines.md) — Machine status and maturity tracker
- Per-Machine Manifests:
  - [Centrifuge Twin Manifest](./registry/centrifuge_twin_manifest.md) (Gold Standard)
  - [Analytical Balance Twin Manifest](./registry/balance_twin_manifest.md)
  - [Hotplate Stirrer Twin Manifest](./registry/hotplate_twin_manifest.md)
  - [Rotary Evaporator Twin Manifest](./registry/rotovap_twin_manifest.md)
  - [Spectrophotometer Twin Manifest](./registry/spectrophotometer_twin_manifest.md)
  - [Vacuum Pump Twin Manifest](./registry/vacuum_pump_twin_manifest.md)

---

## 💡 07. Technical Research & Knowledge DNA (`07_TECHNICAL_RESEARCH/`)

- [Knowledge Manifest](./07_TECHNICAL_RESEARCH/KNOWLEDGE_MANIFEST.md) — Index of core Knowledge Items (KIs)
- [CAD Governance KI](./07_TECHNICAL_RESEARCH/cad_governance_ki.md) (`twins_cad_governance`) — Zero-defect dimensional discipline, 4771-CAD
- [Procedural CAD KI](./07_TECHNICAL_RESEARCH/procedural_cad_ki.md) (`twins_procedural_cad_patterns`) — 8-stage assembly sequence, boolean pocket carving
- [Materials & Optics KI](./07_TECHNICAL_RESEARCH/materials_optics_ki.md) (`twins_materials_optics`) — PBR library, borosilicate glass (IOR 1.52), Canvas LCDs
- [Kinematics KI](./07_TECHNICAL_RESEARCH/kinematics_ki.md) (`twins_kinematics_mechanisms`) — Mechanical pivot placement, translation rails, rotor physics
- [Web Runtime KI](./07_TECHNICAL_RESEARCH/web_runtime_ki.md) (`twins_web_runtime`) — Three.js rendering loops, event raycasting, lab desk integration

---

## 🔗 Executable Workflows (`.agent/workflows/` and `.agents/workflows/`)

- `/start` or `/cad-start` (`start.md`) — Session initialization: OGA-CAD persona handshake & governance grounding
- `/plan` (`plan.md`) — Machine architecture planning, OEM BOM decomposition, 8-stage assembly breakdown
- `/run` (`run.md`) — Start local lab desk viewer (`./scripts/serve.sh` on port 8765)
- `/validate` (`validate.md`) — Run OGA-CAD compliance validator (`cad_validator.mjs`)
- `/report` (`report.md`) — Post-task master sync, changelog update, and performance report card generation
- `/orchestrate` (`orchestrate.md`) — Parallel subagent execution across MDRA, CAD-BA, and WEB-BA
- `/debug` (`debug.md`) — 15-step structured CAD/Three.js bug diagnosis adhering to SHAA-3D protocol
- `/sync-master` (`sync-master.md`) — Reconciles `.master` with machine manifests

---

_Keep this index updated whenever a new master file or machine twin is registered._
