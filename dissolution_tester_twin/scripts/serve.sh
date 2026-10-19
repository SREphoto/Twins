#!/bin/bash
set -e
PORT=${1:-8765}
echo "[DissolutionTesterTwin] Serving on http://127.0.0.1:${PORT}/dissolution_tester_twin/software/viewer/index.html"
python3 -m http.server "${PORT}"
