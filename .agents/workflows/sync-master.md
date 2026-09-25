---
description: Reconcile documentation drift between machine packages and .master/ registries
---

# Sync Master Workflow (/sync-master)

1. Verify all machine twins in `Twins/` are registered in `.master/06_MACHINES/MACHINE_CATALOGUE.md` and `lab_viewer/machines/registry.js`.
2. Ensure every machine twin has an active manifest in `.master/registry/<twin>_manifest.md`.
3. Update `.master/01_SYSTEM_DEFINITIONS/system/DOCUMENTATION_MANIFEST.json` with any newly added or renamed master files.
4. Execute validation:
```bash
node .master/05_PERSONAL_MISC/tools/cad_validator.mjs
```
