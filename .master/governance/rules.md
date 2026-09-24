# Governance rules (OGA)

1. **One package per machine.** Path form: `Twins/<name>_twin/`. No nesting under render monorepos.
2. **Self-contained packages.** Runtime code must not require imports from `.master` or sibling twins.
3. **Gold sample.** `centrifuge_twin/` is the reference. New machines copy structure, not dead-end GLB runtime patterns.
4. **`.master` is authority for process.** Package `docs/STANDARD.md` remains authority for twin tech standard; both
   should stay aligned.
5. **History is intentional.** Do not delete `export/_history/`, `cad/_legacy/`, or pipeline docs without OGA + written
   change log.
6. **Agent SOP.** Every session follows `AGENT_SOP.md`. No session is complete without change log, troubleshooting log
   (or “none”), conversation log, and self report card.
7. **Naming & OEM.** LIAR clears public labels. Default to generic class names.
8. **Honesty in report cards.** Invented facts go in the hallucination section; scores use the rubric.
9. **Generated junk.** `__pycache__`, `.venv*`, screenshot spam are disposable; do not elevate them to manifests.
10. **Registry.** Every shippable twin has a row in `registry/machines.md` and a `registry/<name>_twin_manifest.md`.
11. **Lab desk.** Ready twins are listed in `lab_viewer/machines/registry.js`. Multi-machine entry point is
    `./scripts/serve.sh` → `/lab_viewer/` from the Twins workspace root.
12. **CRITICAL FIDELITY RULE:** Every single part needs complete procedural design. Every screw, every washer, every
    individual part of a twin must be fully modeled in code. Do not use abstract primitives to represent complex
    assemblies. Recreate the exact CAD models procedurally down to the finest detail.
