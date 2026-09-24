# Twins · `.master`

Organizational home for **all** lab instrument digital twins under `Twins/`.

Machine packages stay self-contained (`centrifuge_twin/`, `<name>_twin/`, …).  
This folder holds **how** we build them, **who** (which agent roles), and **records** of every work session.

```text
Twins/
  .master/                 ← you are here
  lab_viewer/              ← master lab desk + machine picker
  centrifuge_twin/         ← gold sample package
  <name>_twin/             ← next machines
  scripts/serve.sh         ← serve whole workspace
```

## Start here

| Doc                                                    | Use                                                       |
| ------------------------------------------------------ | --------------------------------------------------------- |
| [AGENT_SOP.md](AGENT_SOP.md)                           | **Session SOP** — start → work → handoff → close          |
| [HOW_TO_BUILD_A_MACHINE.md](HOW_TO_BUILD_A_MACHINE.md) | Process to scaffold and ship a new twin                   |
| [MANIFEST.md](MANIFEST.md)                             | Important files across the workspace                      |
| [AGENTS_MANDATE.md](AGENTS_MANDATE.md)                 | End-of-work logging detail + templates                    |
| [agents/README.md](agents/README.md)                   | Agent roster (OGA, NBA, SAA, LIAR, SEOA, MDRA, BC)        |
| [logs/README.md](logs/README.md)                       | Where change / trouble / conversation / report cards live |
| [registry/machines.md](registry/machines.md)           | Registered twin packages                                  |

## Run the lab (all machines)

Workspace root is already `Twins/` (do not `cd Twins` again).

```bash
./scripts/serve.sh
```

Open the URL printed in the terminal (default):

**<http://127.0.0.1:8765/lab_viewer/>**

- Top bar **Machine** select switches instruments on the shared lab desk.
- Centrifuge is the gold ready twin; other entries may be planned placeholders.
- Standalone package viewers still work under each `<name>_twin/`.

Details: [`lab_viewer/README.md`](../lab_viewer/README.md).

## Gold sample

`centrifuge_twin/` is the reference implementation.

- Pipeline archaeology: `centrifuge_twin/docs/PIPELINE.md`
- Normative standard: `centrifuge_twin/docs/STANDARD.md`
- Scaffold checklist: `centrifuge_twin/standards/machine_template.md`
- Desk registration: `lab_viewer/machines/registry.js`

## End-of-work rule (non-negotiable)

Follow **[AGENT_SOP.md](AGENT_SOP.md) §4**. Short form: every session must, before finishing:

1. Append **master change log**
2. Append **troubleshooting log** (or note “none”)
3. Append **conversation log** (session summary)
4. Write a **self report card** under `logs/report_cards/`

Templates: `templates/`. Detail: `AGENTS_MANDATE.md`.
