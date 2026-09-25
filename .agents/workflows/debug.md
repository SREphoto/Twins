---
description: Structured CAD & WebGL troubleshooting workflow adhering to the 15-step SHAA-3D protocol
---

# CAD Troubleshooting Workflow (/debug)

Use this workflow whenever a machine twin fails to render, throws a browser exception, loses WebGL context, or exhibits mechanical mesh clipping.

## 1. Reproduce the Failure
Start the local server and verify on `http://127.0.0.1:8765`:
```bash
./scripts/serve.sh
```

## 2. Check SHAA-3D Fixes Compendium
Consult `.master/02_AGENT_WORKFORCE/agents/SHAA_CAD_FIXES_COMPENDIUM.md` for known patterns:
- WebGL context loss -> `disposeThreeScene`
- Inverted LCD canvas -> `texture.flipY = false` & UV buffer inversion
- Z-fighting -> Recessed pocket carving
- Black borosilicate glass -> Refractive `MeshPhysicalMaterial` settings

## 3. Apply Minimal Safe Fix
Apply the smallest necessary change to the CAD script or viewer code. Do not rewrite unaffected components.

## 4. Multi-Angle Verification
Rerun visual inspection across standardized camera viewpoints (`CAM_ISO`, `CAM_FRONT`, `CAM_SIDE`, `CAM_TOP`). Ensure zero browser console exceptions.

## 5. Document Incident
Append an entry to `.master/logs/troubleshooting_log.md` with:
```markdown
### [ISS-XXX] YYYY-MM-DD: [Title]
- **Component**: `<twin>/software/viewer/...`
- **Error Signature**: [Console error or visual defect]
- **Root Cause**: [Geometrical or WebGL cause]
- **Resolution**: [Exact fix applied]
- **Status**: Resolved
- **Brain Ref**: `YYYY-MM-DD_SHAA-3D_[slug].md`
```
