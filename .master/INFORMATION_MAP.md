# Twins Information Map (IM)
## Dependency Cascade Matrix for 3D Machine Digital Twins

This document tracks dependencies between files across the `Twins` repository. Use this to ensure that when one component, mesh, or controller changes, all related CAD documents, manifests, and viewer registries are updated.

---

## 🗺️ Machine Dependency Matrix

| If you change... | You MUST also update... |
| :--- | :--- |
| **Machine Dimensions ($W \times D \times H$)** | `<twin>/docs/dimensions.md`, `<twin>/docs/control_spec.md`, `.master/06_MACHINES/MACHINE_CATALOGUE.md`, `.master/registry/<twin>_manifest.md` |
| **CAD Procedural Script (`create_*.py`)** | `<twin>/docs/BOM.md`, `<twin>/export/glb/`, `.master/registry/<twin>_manifest.md`, execute `/validate` |
| **Dynamic Canvas LCD / Display Layout** | `<twin>/software/viewer/`, verify `flipY = false`, check UV buffer coordinates, `.master/02_AGENT_WORKFORCE/agents/SHAA_CAD_FIXES_COMPENDIUM.md` |
| **Controller State Logic / Interlocks** | `<twin>/software/controller/`, `<twin>/docs/control_spec.md`, run `<twin>/scripts/test.sh` |
| **Semantic Node Names (Meshes/Pivots)** | CAD script, Three.js viewer raycasters/animations, `.master/01_SYSTEM_DEFINITIONS/rules/CAD_GOVERNANCE.md` |
| **Lab Desk Integration / Switcher** | `lab_viewer/machines/registry.js`, `lab_viewer/index.html`, `.master/06_MACHINES/MACHINE_CATALOGUE.md` |
| **PBR Materials / Shaders / Textures** | `.master/07_TECHNICAL_RESEARCH/materials_optics_ki.md`, `.agents/skills/procedural-materials/SKILL.md` |
| **Agent Logic / Boundaries** | `.master/02_AGENT_WORKFORCE/agents/[AGENT].md`, `.master/agents/[AGENT].md`, `.agents/AGENTS.md` |
| **Bug Fix / Runtime Diagnosis** | `.master/logs/troubleshooting_log.md` with `[ISS-XXX]`, `.agents/TROUBLESHOOTING_LOG.md`, cite in Session Report Card |
| **Master Documentation Structure** | `.master/DIRECTORY.md`, `.master/README.md`, `.master/01_SYSTEM_DEFINITIONS/system/DOCUMENTATION_MANIFEST.json` |
| **Workspace Version / Standards** | `.master/01_SYSTEM_DEFINITIONS/system/VERSION.md`, `package.json` |

---

## 🔄 Sync Status

- [x] **2026-07-25**: Initial Twins workspace scaffolding and gold sample (Centrifuge) established.
- [x] **2026-09-22**: 5-Agent Handoff Chain (MDRA, CAD-BA, WEB-BA, VQA, LIA) and multi-angle visual QA gate defined.
- [x] **2026-09-25**: ChemMate-parity CMDS architecture deployed: Numbered `.master/` hierarchy, OGA-CAD, SOA (Synthetic Operator Agent), SHAA-3D, and automated CAD validator.
