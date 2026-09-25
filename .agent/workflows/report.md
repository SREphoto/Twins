---
description: Phase 3 completion workflow — log the work and issue an agent performance report card
---

# Session Report Workflow (/report)

Use this workflow at the end of every major CAD, mesh, or code manipulation session in `Twins`.

## 1. Run Verification
Verify controller tests and governance:
```bash
node .master/05_PERSONAL_MISC/tools/cad_validator.mjs
```

## 2. Update Master Change Log
Append an entry to `.master/logs/master_change_log.md`:
```markdown
- **YYYY-MM-DD | [Agent Role] | [Machine Package]**: [Description of what was modeled, fixed, or verified].
```

## 3. Issue Performance Report Card
Create a new file in `.master/logs/report_cards/YYYY-MM-DD_[ROLE]_[SLUG].md` using `.master/01_SYSTEM_DEFINITIONS/rules/REPORT_CARD_TEMPLATE.md`.
Disclose:
- 1–100 self-scores across Dimensional Fidelity, Procedural Quality, and Governance.
- Any mechanical assumptions or guessed dimensions.
- Incident cross-reference (`Resolved: [ISS-XXX]`).

## 4. Run Final Validation
Confirm all checks pass:
```bash
node .master/05_PERSONAL_MISC/tools/cad_validator.mjs
```
