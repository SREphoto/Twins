# Twins Developer Tools & Utilities Manifest

This catalog documents the operational scripts, test harnesses, and validators available in `Twins` to prevent redundant script creation.

---

## 🛠️ CLI Utilities & Test Scripts

| Script | Location | Usage | Purpose |
| :--- | :--- | :--- | :--- |
| **Lab Desk Server** | `./scripts/serve.sh` | `./scripts/serve.sh` | Serves root workspace and lab desk on `http://127.0.0.1:8765/lab_viewer/` |
| **Twin Visual Verifier** | `./scripts/verify_twin.sh` | `./scripts/verify_twin.sh <twin_name>` | Runs automated visual check and console exception audit |
| **CAD Validator** | `.master/05_PERSONAL_MISC/tools/cad_validator.mjs` | `node .master/05_PERSONAL_MISC/tools/cad_validator.mjs` | Validates git diff, changelog, report cards, taxonomy, and UV orientation |
| **Standalone Serve** | `<twin>/scripts/serve.sh` | `cd <twin> && ./scripts/serve.sh` | Starts dedicated HTTP server for single machine twin |
| **Standalone Test** | `<twin>/scripts/test.sh` | `cd <twin> && ./scripts/test.sh` | Runs Python controller unit tests (`unittest`) |
