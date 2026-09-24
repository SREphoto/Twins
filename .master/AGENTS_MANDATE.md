# Agents mandate — end of every work session

**Full session procedure:** [AGENT_SOP.md](AGENT_SOP.md) (start → work → handoff → close).  
This file is the **detail** for the four end-of-work deliverables only.

Applies to **every** agent role (OGA, NBA, SAA, LIAR, SEOA, MDRA, BC) and any unnamed agent working under `Twins/`.

If you changed files, answered a build question that produced decisions, or altered logs: **complete all four
deliverables** before ending the session.

---

## 1. Master change log

**File:** `logs/master_change_log.md`  
**Template:** `templates/change_log_entry.md`

Append one entry. Include:

- Date (ISO), agent role, session id (short free-form OK)
- Summary of intent
- Files **created / changed / deleted / moved** (paths + one-line why each)
- Related machine package (`centrifuge_twin`, `balance_twin`, `workspace`, …)

---

## 2. Troubleshooting log

**File:** `logs/troubleshooting_log.md`  
**Template:** `templates/troubleshooting_entry.md`

Append one entry. If nothing broke:

```text
Status: none
```

Otherwise: problem → symptoms → cause (if known) → fix → prevention.

---

## 3. Conversation log

**File:** `logs/conversation_log.md`  
**Template:** `templates/conversation_log_entry.md`

Short session record:

- User request (paraphrase)
- Decisions made
- Open questions left for human
- Pointers to report card + change log entry

Do **not** dump full chat transcripts. Capture durable intent and outcomes.

---

## 4. Self report card

**Directory:** `logs/report_cards/`  
**Template:** `templates/self_report_card.md`  
**Filename:** `YYYY-MM-DD_<role>_<short-slug>.md`  
Example: `2026-07-25_NBA_scaffold-hotplate.md`

### Required sections

| Section              | Content                                                           |
| -------------------- | ----------------------------------------------------------------- |
| Meta                 | Date, role, machine package, session goal                         |
| Work done            | Plain bullets of what was accomplished                            |
| Files created        | Path + why                                                        |
| Files changed        | Path + why                                                        |
| Files deleted        | Path + why                                                        |
| Files moved          | From → to + why                                                   |
| Self score           | Integer **1–100** (see `governance/scoring_rubric.md`)            |
| Hallucination check  | Did you invent facts, APIs, paths, or OEM claims? Yes/no + detail |
| Problems encountered | What went wrong                                                   |
| How solved           | What you did                                                      |
| Pitfalls seen        | Traps for the next agent                                          |
| Future ideas         | Optional improvements (not commitments)                           |
| Confidence           | What you are unsure about                                         |

### Scoring honesty

- Score quality of **this session’s output**, not ego.
- If you guessed dimensions or control behavior without sources, say so and lower the score.
- If tests were not run, say so.

---

## Order of operations (suggested)

1. Do the work.
2. Run relevant checks (`./scripts/test.sh`, serve smoke, etc.).
3. Write report card (forces accurate file lists).
4. Append change log (can mirror report card file tables).
5. Append troubleshooting + conversation logs.
6. If registry/manifest needs update, do that and note it in the change log.

---

## Enforcement

- OGA may reject a session as incomplete if logs/report card are missing.
- BC should refuse to “sign off” quality without a report card for material NBA work.
- SAA tracks open sessions missing report cards in scheduling notes when asked.
