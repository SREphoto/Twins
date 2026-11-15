#!/usr/bin/env bash
# Serve the interactive SEM twin (static files). No build step.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-8765}"
cd "$ROOT/software"
echo "GEMINI-500 FE-SEM twin → http://127.0.0.1:${PORT}/viewer/"
echo "Ctrl+C to stop"
exec python3 -m http.server "$PORT"
