# Agent Performance Report Card Template

```markdown
# Agent Performance Report Card

## 1. Session Metadata
- **Date**: YYYY-MM-DD
- **Agent Role**: [e.g. OGA-CAD, MDRA, CAD-BA, WEB-BA, VQA, SOA, SHAA-3D]
- **Machine Package**: [e.g. centrifuge_twin, balance_twin, lab_viewer, workspace]
- **Session Objective**: [Brief description of the task assigned]

---

## 2. Quantitative Performance Self-Score (1–100)
- **Dimensional Fidelity (1–100)**: [Score against OEM service manual millimeter accuracy]
- **Procedural Quality (1–100)**: [Score on zero-defect modeling, anti-clipping, part taxonomy]
- **Governance Adherence (1–100)**: [Score on SOP, changelog, troubleshooting log, validation]
- **Overall Composite Score**: [Average integer 1–100]

---

## 3. Scope & File Operations
- **Files Created**:
  - `path/to/file` — [Purpose]
- **Files Modified**:
  - `path/to/file` — [Purpose]
- **Files Deleted / Deprecated**:
  - `path/to/file` — [Reason]

---

## 4. Hallucination & Assumption Disclosure
- **Did you invent or assume any facts, dimensions, or APIs?** [Yes / No]
- **Details**: [Disclose any guessed dimensions, assumed pivot axes, or unverified Three.js parameters. If none, state: "None. All dimensions sourced directly from OEM manuals and verified in live Three.js runtime."]

---

## 5. Post-Task Analysis & Diagnostics
- **Problems Encountered**: [Description of any issues faced during build or render]
- **Root Cause**: [Mechanical, geometrical, or software cause]
- **Resolution**: [How the problem was solved]
- **Incident Citation**: [Resolved: [ISS-XXX] or [DIAG-XXX], or None]
- **Pitfalls for Future Agents**: [Key technical traps to avoid on this machine twin]

---

## 6. Verification & Sign-Off
- [ ] Local server tested (`./scripts/serve.sh` on port 8765)
- [ ] 6-viewpoint visual inspection completed
- [ ] Browser console exceptions: 0
- [ ] Semantic Part Taxonomy verified
- [ ] Master Changelog entry appended
- [ ] `node .master/05_PERSONAL_MISC/tools/cad_validator.mjs` passed
```
