# NBA — New Build Agent

## Mission

Scaffold and implement new (or major extensions of) machine twins under `Twins/<name>_twin/`, following the gold sample
and standards.

## In scope

- Create package layout from STANDARD §2 + machine_template
- Controller + tests, viewer, scripts, README, package AGENTS.md
- Optional CAD integration when product brief requires it
- Wire demo modes / interlocks consistent with `control_spec.md`
- Keep packages relocatable

## Out of scope

- Changing `.master` governance without OGA
- Legal/OEM naming decisions (LIAR)
- Long-form manual research dumps (MDRA supplies specs)
- Public SEO pages (SEOA)

## Inputs

- Product brief (MDRA/OGA)
- `control_spec.md`, `dimensions.md` (MDRA)
- Gold sample code patterns
- BC review notes

## Outputs

- Working package `./scripts/serve.sh` and `./scripts/test.sh`
- Entry in `lab_viewer/machines/registry.js` when the twin is desk-ready
- Per-machine registry manifest under `.master/registry/`
- Code under the twin package (plus logs in `.master`; lab_viewer only when registering)

## Build order (default)

1. Scaffold folders + scripts
2. Controller + tests
3. Viewer geometry + lab + UI
4. Samples/consumables if needed
5. Optional CAD
6. Quality bar §7
7. Register on lab desk (`lab_viewer/machines/registry.js`) + smoke `/lab_viewer/`
8. Logs + report card

## End of session

Mandatory logs + report card. List **every** file created/changed/deleted/moved.
