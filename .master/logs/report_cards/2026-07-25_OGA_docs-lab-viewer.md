# Self report card

## Meta

| Field                      | Value                                                                 |
| -------------------------- | --------------------------------------------------------------------- |
| Date                       | 2026-07-25                                                            |
| Agent role                 | OGA (docs + session close-out)                                        |
| Machine package            | workspace / lab_viewer                                                |
| Session goal               | Document lab_viewer everywhere; complete mandate logs after serve fix |
| Related change-log date/id | 2026-07-25 · OGA · docs-lab-viewer                                    |

## Work done

- Clarified how to run the multi-machine lab desk (Twins root, no nested `cd Twins`)
- Documented lab_viewer in SOP, HOW_TO, README, rules, NBA charter
- Documented lab desk in centrifuge README, AGENTS, STANDARD, PIPELINE, machine_template, skill
- Earlier in session chain: serve.sh free-port fallback; killed stuck servers
- Filled master change log, troubleshooting log, conversation log, this report card

## Files created

| Path                                                          | Why                                    |
| ------------------------------------------------------------- | -------------------------------------- |
| `.master/logs/report_cards/2026-07-25_OGA_docs-lab-viewer.md` | Session self report card               |
| `README.md` (Twins root)                                      | Workspace entry pointing at lab_viewer |

## Files changed

| Path                                                       | Why                                  |
| ---------------------------------------------------------- | ------------------------------------ |
| `.master/README.md`                                        | Run the lab section                  |
| `.master/AGENT_SOP.md`                                     | Lab desk + register machines + paths |
| `.master/HOW_TO_BUILD_A_MACHINE.md`                        | Lab desk preamble + sanity commands  |
| `.master/agents/NBA.md`                                    | Desk registration in build order     |
| `.master/governance/rules.md`                              | Rule 11 lab desk                     |
| `.master/logs/master_change_log.md`                        | This session entry                   |
| `.master/logs/troubleshooting_log.md`                      | Port / cd Twins issue                |
| `.master/logs/conversation_log.md`                         | Session summary                      |
| `lab_viewer/README.md`                                     | Correct run instructions (prior fix) |
| `scripts/serve.sh`                                         | Free-port fallback (prior fix)       |
| `centrifuge_twin/README.md`                                | Preferred lab desk vs standalone     |
| `centrifuge_twin/AGENTS.md`                                | Lab desk + registry                  |
| `centrifuge_twin/docs/STANDARD.md`                         | Layout + §8 desk steps               |
| `centrifuge_twin/docs/PIPELINE.md`                         | Lab desk run commands                |
| `centrifuge_twin/standards/machine_template.md`            | Layout + checklist item              |
| `centrifuge_twin/.agents/skills/lab-digital-twin/SKILL.md` | Lab viewer commands + register       |

## Files deleted

| Path | Why  |
| ---- | ---- |
| —    | none |

## Files moved

| From | To  | Why  |
| ---- | --- | ---- |
| —    | —   | none |

## Self score (1–100)

**Score:** 91

**Rationale:** Instructions now consistently feature lab_viewer as the multi-machine entry; serve pitfalls documented
and mitigated; full AGENT_SOP close-out completed with accurate file tables. Not 95+ only because full browser QA of
every doc link was not re-run after this docs pass.

## Hallucination check

| Question                                 | Answer                                                                        |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| Invented paths, APIs, or commands?       | no                                                                            |
| Invented dimensions or control behavior? | no                                                                            |
| Invented legal/OEM claims?               | no                                                                            |
| Detail                                   | URLs match scripts/serve.sh output; lab_viewer path verified earlier HTTP 200 |

## Problems encountered

- User blocked by port-in-use and misleading `cd Twins` docs.
- Some search-replace misses on first pass due to table formatting; re-read and fixed.

## How solved

- Kill listeners; serve auto-port; rewrite run docs to assume Twins as cwd.
- Re-applied edits after reading current file contents.

## Pitfalls for the next agent

- Always say “from Twins workspace root” not bare `cd Twins`.
- After new ready twins, forgetful agents skip `lab_viewer/machines/registry.js` — SOP now calls it out.
- Do not paste markdown `#` comment lines into the shell.

## Future ideas

- Root `Twins/README.md` one-pager pointing only at lab_viewer + .master.
- `?embed=1` on package viewers to hide duplicate chrome inside the lab iframe.

## Confidence / unknowns

- High confidence on doc paths; low need for further serve changes unless user wants a fixed alternate default port.
