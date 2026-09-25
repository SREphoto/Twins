# Twins Agent Workforce Communication & Handoff Matrix

```mermaid
graph LR
    Human[User / Director] --> OGA[OGA-CAD: Master Orchestration]
    OGA --> MDRA[MDRA: Specifications & OEM Manuals]
    MDRA --> CADBA[CAD-BA: Blender Solid Modeling]
    CADBA --> WEBBA[WEB-BA: Three.js Interactive Runtime]
    WEBBA --> VQA[VQA / SOA: 6-Viewpoint Visual QA & Simulation]
    VQA --> LIA[LIA: Lab Desk Registration]
    
    subgraph Governance & Immunity
        OGA -.-> SHAA[SHAA-3D: Diagnostics & Triage]
        OGA -.-> LIAR[LIAR: Legal & IP Clearance]
        OGA -.-> SAA[SAA: Scheduling & Pulse]
    end
```

| Agent | Input From | Primary Output | Hand Off To |
| :--- | :--- | :--- | :--- |
| **OGA-CAD** | Human User | Approved project plan & constraints | MDRA / CAD-BA |
| **MDRA** | OEM Service Manuals | `docs/dimensions.md` & `BOM.md` | CAD-BA, LIAR |
| **CAD-BA** | `dimensions.md` | Procedural solids (`create_*.py`), recessed bezels | WEB-BA |
| **WEB-BA** | CAD script / export | Three.js viewer, dynamic LCD, raycasting controls | VQA / SOA |
| **VQA / SOA** | Live viewer on port 8765 | 6-viewpoint visual inspection & 6-pillar report | LIA (if pass) or SHAA-3D (if fail) |
| **SHAA-3D** | Error logs & visual flaws | Minimal non-breaking fix & `[ISS-XXX]` entry | OGA-CAD / WEB-BA |
| **LIA** | Verified twin package | `lab_viewer/machines/registry.js` registration | OGA-CAD for sign-off |
