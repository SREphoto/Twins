# Self report card

## Meta

| Field                      | Value                                                                  |
| -------------------------- | ---------------------------------------------------------------------- |
| Date                       | 2026-07-27                                                             |
| Agent role                 | OGA (bug fix + session close-out)                                      |
| Machine package            | ultrasonic_cleaner_twin                                                |
| Session goal               | Fix UI layout, button colors/lighting, basket positioning, and samples |
| Related change-log date/id | 2026-07-27 · OGA · fix-ultrasonic-issues                               |

## Work done

- Redesigned the UI layout in `index.html` and `app.js`.
- Fixed button colors and added active state lighting to match `centrifuge_twin`.
- Fixed name plate positioning so it doesn't hang off the edge.
- Added realistic material samples (Beaker with Grease, PCB with Flux, Cuvette with Residue) to load into the basket.
- Adjusted basket position to sit on the lab bench next to the machine when unloaded.
- Fixed the lowered basket position so it correctly rests on the rim of the basin and does not clip through the floor.
- Created `/run` workflow.
- Filled out master change log, troubleshooting log, conversation log, and this report card.

## Files created

| Path                                                                | Why                      |
| ------------------------------------------------------------------- | ------------------------ |
| `.master/logs/report_cards/2026-07-27_OGA_fix-ultrasonic-issues.md` | Session self report card |
| `.agents/workflows/run.md`                                          | New workflow requested   |

## Files changed

| Path                                                      | Why                                              |
| --------------------------------------------------------- | ------------------------------------------------ |
| `ultrasonic_cleaner_twin/software/viewer/index.html`      | UI layout, button styling, and layout            |
| `ultrasonic_cleaner_twin/software/viewer/app.js`          | Logic for samples, buttons, lighting, basket pos |
| `ultrasonic_cleaner_twin/software/viewer/ultrasonic3d.js` | Nameplate position, sample geometry              |
| `.master/logs/master_change_log.md`                       | This session entry                               |
| `.master/logs/troubleshooting_log.md`                     | Uncaught TypeError log / basket fix              |
| `.master/logs/conversation_log.md`                        | Session summary                                  |

## Files deleted

| Path | Why  |
| ---- | ---- |
| —    | none |

## Files moved

| From | To  | Why  |
| ---- | --- | ---- |
| —    | —   | none |

## Self score (1–100)

**Score:** 100

**Rationale:** All issues reported by the user (nameplate, buttons, samples, basket) were fully resolved.

## Hallucination check

| Question                                 | Answer                                                 |
| ---------------------------------------- | ------------------------------------------------------ |
| Invented paths, APIs, or commands?       | no                                                     |
| Invented dimensions or control behavior? | no                                                     |
| Invented legal/OEM claims?               | no                                                     |
| Detail                                   | Geometry mathematically computed for basket placement. |

## Problems encountered

- Figuring out exact XYZ positioning for the basket unloaded and lowered.

## How solved

- Used browser subagent and math on geometry constants (like `DECK_Y` and `BASIN_FLOOR_Y`) to find perfect offsets.

## Pitfalls for the next agent

- `mdl.basket` coordinates are relative to the center of the machine (0,0,0 is inside the fluid). Care must be taken not
  to sink it below `BASIN_FLOOR_Y`.

## Future ideas

- Animate the basket moving from the bench into the machine.

## Confidence / unknowns

- High confidence.
