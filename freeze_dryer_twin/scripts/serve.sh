#!/bin/bash
set -e
PORT=${1:-8765}
echo "[FreezeDryerTwin] Serving on http://127.0.0.1:${PORT}/freeze_dryer_twin/software/viewer/index.html"
python3 -m http.server "${PORT}"
