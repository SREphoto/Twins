# Workspace manifest — important files

Paths relative to `Twins/` unless noted.

## Governance (this folder)

| Path                                   | Why it matters                      |
| -------------------------------------- | ----------------------------------- |
| `.master/README.md`                    | Index                               |
| `.master/AGENT_SOP.md`                 | **Session SOP** for all agents      |
| `.master/HOW_TO_BUILD_A_MACHINE.md`    | New machine process                 |
| `.master/AGENTS_MANDATE.md`            | End-of-work logging detail          |
| `.master/agents/*.md`                  | Role charters                       |
| `.master/templates/*`                  | Blank forms for logs / report cards |
| `.master/logs/master_change_log.md`    | Append-only change history          |
| `.master/logs/troubleshooting_log.md`  | Problems + fixes                    |
| `.master/logs/conversation_log.md`     | Session conversation summaries      |
| `.master/logs/report_cards/`           | Per-session self report cards       |
| `.master/registry/machines.md`         | List of twin packages               |
| `.master/registry/*_manifest.md`       | Per-machine important files         |
| `.master/governance/rules.md`          | OGA rules                           |
| `.master/governance/scoring_rubric.md` | 1–100 self-score guide              |

## Lab viewer (workspace)

| Path                              | Why it matters                   |
| --------------------------------- | -------------------------------- |
| `lab_viewer/`                     | Master lab desk + machine picker |
| `lab_viewer/machines/registry.js` | Which machines can load          |
| `scripts/serve.sh`                | Serve whole Twins tree           |

## Gold sample — `centrifuge_twin/`

Full inventory: [registry/centrifuge_twin_manifest.md](registry/centrifuge_twin_manifest.md).

| Path                                            | Why it matters                         |
| ----------------------------------------------- | -------------------------------------- |
| `centrifuge_twin/docs/PIPELINE.md`              | How it was built; dead ends labeled    |
| `centrifuge_twin/docs/STANDARD.md`              | Normative twin standard                |
| `centrifuge_twin/docs/control_spec.md`          | States, keys, interlocks               |
| `centrifuge_twin/docs/dimensions.md`            | Geometry / units truth                 |
| `centrifuge_twin/AGENTS.md`                     | Package agent rules                    |
| `centrifuge_twin/standards/machine_template.md` | Scaffold checklist                     |
| `centrifuge_twin/software/viewer/`              | **Live student app**                   |
| `centrifuge_twin/software/controller/`          | Behavior + tests                       |
| `centrifuge_twin/scripts/serve.sh`              | Run viewer                             |
| `centrifuge_twin/scripts/test.sh`               | Unit tests                             |
| `centrifuge_twin/research/`                     | Manuals + sources                      |
| `centrifuge_twin/cad/cq/`                       | Optional CAD sources                   |
| `centrifuge_twin/export/`                       | Generated CAD; `_history/` = dead ends |

## Runtime vs reference (all machines)

| Class         | Examples                                               | Delete carelessly?              |
| ------------- | ------------------------------------------------------ | ------------------------------- |
| Runtime       | `software/viewer/`, `software/controller/`, `scripts/` | No                              |
| Specs         | `docs/control_spec.md`, `dimensions.md`, `STANDARD.md` | No                              |
| Research      | `research/manuals*`                                    | No without LIAR/MDRA            |
| CAD sources   | `cad/cq/*.py`                                          | No if twin keeps CAD            |
| Generated CAD | `export/step`, `export/mesh`, `export/glb`             | Regenerable; log if purged      |
| History       | `export/_history/`, `cad/_legacy/`                     | Reference; OGA approval to drop |
| Local envs    | `.venv`, `.venv-cq`                                    | OK to ignore / not commit       |

## Adding a new machine to this manifest

1. Create `registry/<name>_twin_manifest.md` from template.
2. Add a row in `registry/machines.md`.
3. Link from this file under a new section when stable.
