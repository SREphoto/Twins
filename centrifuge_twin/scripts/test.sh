#!/usr/bin/env bash
# Pure-Python controller + sample tests (no browser, no CadQuery).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/software/controller"
python3 test_controller.py
python3 test_samples.py
echo "All controller tests passed."
