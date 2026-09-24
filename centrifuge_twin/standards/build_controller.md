# Controller (Python)

Pure logic, no GUI. Mirrors viewer semantics for unit tests and future headless sims.

Run from the twin package root (e.g. `Twins/centrifuge_twin/`):

```bash
./scripts/test.sh
# or
cd software/controller && python3 test_controller.py && python3 test_samples.py
```

## Modules

| Module                     | Role                                             |
| -------------------------- | ------------------------------------------------ |
| `centrifuge_controller.py` | States, start/stop, lid, short, faults, snapshot |
| `samples.py`               | LabBench, materials, separation criteria         |
| `test_*.py`                | Regression locks for interlocks + samples        |

## When changing behavior

1. Update `docs/control_spec.md`.
2. Change Python controller + tests.
3. Match JS in `software/viewer/app.js` (`tick`, `pressStartStop`, load/unload).
4. Run `./scripts/test.sh`.
