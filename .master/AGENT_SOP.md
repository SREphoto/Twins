# Agent SOP — every session under `Twins/`

Single standard operating procedure for **all** agents (OGA, NBA, SAA, LIAR, SEOA, MDRA, BC, and unnamed helpers).

Related docs (detail, not substitutes):

| Doc                                                          | Role                                   |
| ------------------------------------------------------------ | -------------------------------------- |
| [AGENTS_MANDATE.md](AGENTS_MANDATE.md)                       | End-of-work logging detail + templates |
| [HOW_TO_BUILD_A_MACHINE.md](HOW_TO_BUILD_A_MACHINE.md)       | New machine build process              |
| [agents/](agents/)                                           | Role charters                          |
| [governance/rules.md](governance/rules.md)                   | Workspace rules                        |
| [governance/scoring_rubric.md](governance/scoring_rubric.md) | Report-card 1–100 scores               |
| [`lab_viewer/`](../lab_viewer/)                              | Master lab desk + machine picker       |

---

## 0. Before you touch files

1. Confirm workspace root is `Twins/` (packages are siblings like `centrifuge_twin/`). You are already in that folder if
the path ends with `Twins` — do not `cd Twins` again.
2. Read this SOP.
3. Identify your **role** (or the closest charter under `agents/`).
4. Read that role file.
5. If the task is a **new machine** or major scaffold: read `HOW_TO_BUILD_A_MACHINE.md`.
6. If the task touches the gold sample: skim `centrifuge_twin/docs/PIPELINE.md` and package `AGENTS.md`.
7. Note the **machine package** you will work in (`centrifuge_twin`, `<name>_twin`, `lab_viewer`, or `workspace` for `.master`only)
8. Know the **lab viewer**: multi-machine desk is `lab_viewer/`; serve with `./scripts/serve.sh` from Twins root → `http://127.0.0.1:8765/lab_viewer/`

Do **not** invent OEM branding, legal clearance, or dimensions without sources (LIAR / MDRA).

---

## 1. Session start checklist

- [ ] Role known; charter opened
- [ ] Target package known
- [ ] User goal restated in one sentence (keep for conversation log)
- [ ] Constraints noted (relocatable package, no monorepo imports, history keep policy)
- [ ] If multi-agent work: know who hands off next (see role README chain)

---

## 2. Do the work

### General

- Prefer gold-sample patterns in `centrifuge_twin/`.
- Keep each `<name>_twin/` **self-contained** (no required imports from `.master` or siblings).
- Paths in code/docs relative to package root unless documenting the workspace.
- Do not delete `export/_history/`, `cad/_legacy/`, or pipeline docs without OGA + change log.

### By role (short)

| Role     | Primary action                                          |
| -------- | ------------------------------------------------------- |
| **OGA**  | Structure, registry, mandate enforcement, approve names |
| **NBA**  | Scaffold/build twin: controller → viewer → optional CAD |
| **SAA**  | Schedule, handoffs, missing report-card chase           |
| **LIAR** | Naming, OEM, manuals use; no fake legal certainty       |
| **SEOA** | Public copy only if asked; no overclaims; plain writing |
| **MDRA** | Manuals, extracts, dimensions, control_spec, sources    |
| **BC**   | Quality bar / PIPELINE lessons; block GLB-only runtime  |

### Verify before closing code work

```bash
# multi-machine lab (from Twins root)
./scripts/serve.sh
# open http://127.0.0.1:<port>/lab_viewer/

# single package (from that package root) when relevant
./scripts/test.sh
./scripts/serve.sh   # centrifuge: …/viewer/
```

If you cannot run checks, say so in the report card and cap the score per rubric.

### New machine → lab desk

After shipping a ready twin, register it in `lab_viewer/machines/registry.js` (`status`, `viewerUrl`, `transitionKind`)
so it appears in the Machine picker.

---

## 3. Handoff (if another agent continues)

Write enough that the next agent does not need the chat:

1. What is done
2. What is not done
3. Exact paths that matter
4. Open risks / blockers
5. Suggested next role

Put that in the **conversation log** entry and point at your report card.

---

## 4. End of session (mandatory — no exceptions)

Complete **all four** before ending. Newest log entries go at the **top** of each log file.

| #   | Deliverable         | Where                                       | Template                              |
| --- | ------------------- | ------------------------------------------- | ------------------------------------- |
| 1   | Master change log   | `logs/master_change_log.md`                 | `templates/change_log_entry.md`       |
| 2   | Troubleshooting log | `logs/troubleshooting_log.md`               | `templates/troubleshooting_entry.md`  |
| 3   | Conversation log    | `logs/conversation_log.md`                  | `templates/conversation_log_entry.md` |
| 4   | Self report card    | `logs/report_cards/YYYY-MM-DD_ROLE_slug.md` | `templates/self_report_card.md`       |

### Report card must include

- Work done
- Files **created / changed / deleted / moved** + **why** each
- Self score **1–100** (`governance/scoring_rubric.md`)
- Hallucination check
- Problems + how solved
- Pitfalls for the next agent
- Future ideas (optional)
- Confidence / unknowns

If nothing broke, troubleshooting entry is still required with `Status: none`.

Detail: [AGENTS_MANDATE.md](AGENTS_MANDATE.md).

### Suggested order

1. Finish work + run checks
2. Write report card (forces accurate file lists)
3. Append change log (mirror file tables)
4. Append troubleshooting + conversation logs
5. Update `registry/` if a machine was added or shippable state changed

---

## 5. Done criteria

Session is complete only if:

- [ ] User goal addressed or blockers clearly stated
- [ ] All four log/report artifacts written
- [ ] No silent inventing of facts (or called out in hallucination section)
- [ ] Registry/manifest updated when a new twin was created

Incomplete without report card → treat as failed close-out (score cap **40** per rubric).

---

## Quick paths

```text
Twins/.master/AGENT_SOP.md          ← this file
Twins/.master/AGENTS_MANDATE.md
Twins/.master/HOW_TO_BUILD_A_MACHINE.md
Twins/.master/agents/<ROLE>.md
Twins/.master/logs/
Twins/lab_viewer/                   ← master lab desk (all machines)
Twins/scripts/serve.sh              ← serve workspace → /lab_viewer/
Twins/centrifuge_twin/              ← gold sample
Twins/<name>_twin/                  ← new machines
```
