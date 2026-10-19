#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "Running Karl Fischer Controller Unit Tests..."
python3 "$ROOT/software/controller/test_controller.py"
echo "All tests passed successfully."
