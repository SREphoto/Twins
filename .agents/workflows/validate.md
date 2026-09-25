---
description: Run the OGA-CAD compliance and dimensional governance validator
---

# CAD Validation Workflow (/validate)

1. Run the CAD governance validator:
```bash
node .master/05_PERSONAL_MISC/tools/cad_validator.mjs
```

2. If any violations are returned (missing changelog, missing report card, non-compliant node names, inverted LCD UVs), fix them immediately.
3. When the audit passes with 0 violations, you are cleared to commit or conclude the task.
