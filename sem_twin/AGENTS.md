# Agent instructions — `sem_twin`

This folder is a **portable product package** under `Twins/`. When you edit here, keep the package **self-contained** so the whole `sem_twin/` directory can be copied into another repo without broken links.

Workspace-level governance (roles, 4771-CAD freeze, report cards, changelog) lives in **`Twins/.master/`** — read `.master/AGENT_SOP.md` and `.master/AGENTS_MANDATE.md` when workinginside the full Twins repo.

Integration into the shared **Lab Desk** (`Twins/lab_viewer/`) is declared in `lab_viewer/machines/registry.js` (`id: "sem"`, `packageDir: "sem_twin"`).

## Scope

| In scope | Out of scope (unless explicitly asked) |
| :--- | :--- |
| `software/viewer/` (Three.js FE-SEM, VC-E room, live scan engine, SFX) | Modifying unrelated sibling `*_twin/` packages |
| `software/controller/` (pure Python `SEMController` + unit/sample tests) | External paid cloud APIs |
| `docs/`, `research/`, `scripts/` | Unverified primitive placeholder geometry |

## Source of truth

1. **Interactive twin**: `software/viewer/index.html`, `app.js`, `sem3d.js`, `sfx.js`, `style.css`.
2. **State / physics / interlocks**: `software/controller/sem_controller.py` (`test_controller.py`, `test_samples.py`) mirrored 1:1 in `software/viewer/app.js`.
3. **Dimensions & BOM (Code 4771-CAD)**: `docs/dimensions.md`, `docs/BOM.md`, `docs/control_spec.md`, `research/sources.md`.
4. **Standards**: `docs/STANDARD.md`, `docs/ARCHITECTURE.md`, and `.agents/OGA_TWINS.md`.

## Do

- Use **relative paths** inside `sem_twin/`.
- Bump `?v=` query strings in `software/viewer/index.html` when changing `style.css`, `app.js`, `sem3d.js`, or `sfx.js`.
- Keep the **S R E** lower-frame branding (`Badge_SREdesigns` via `makeSREdesignsBadge()`).
- Run `./scripts/test.sh` after controller edits and `node ../scripts/oga_validator.mjs sem_twin` after 3D/viewer edits.

## Don't

- Commit `__pycache__/`, `.venv/`, or temporary scratch files inside `sem_twin/`.
- Use generic raw primitives without genuine 3D fasteners, flanges, grommets, and point-to-point wiring harnesses.

## Quick commands

```bash
./scripts/serve.sh          # http://127.0.0.1:8765/viewer/
./scripts/test.sh           # controller + sample unit tests
```
