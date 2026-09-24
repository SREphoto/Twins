#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/software/controller"
python3 test_controller.py
echo "Hotplate Stirrer controller unit tests passed."
