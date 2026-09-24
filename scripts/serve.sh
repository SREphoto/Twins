#!/usr/bin/env bash
# Serve the Twins workspace (lab_viewer + all machine packages).
# Run from anywhere; always serves the Twins root that contains this script.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-8765}"

# If default port is busy, try the next few
if ! command -v lsof >/dev/null 2>&1; then
  :
elif lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${PORT} is already in use."
  for try in $(seq "$PORT" $((PORT + 10))); do
    if ! lsof -nP -iTCP:"$try" -sTCP:LISTEN >/dev/null 2>&1; then
      echo "Using free port ${try} instead."
      PORT="$try"
      break
    fi
  done
  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "No free port found near ${1:-8765}. Stop the other server or pass a port:"
    echo "  $0 8790"
    exit 1
  fi
fi

cd "$ROOT"
echo "Serving: $ROOT"
echo "Lab viewer  → http://127.0.0.1:${PORT}/lab_viewer/"
echo "Centrifuge  → http://127.0.0.1:${PORT}/centrifuge_twin/software/viewer/"
echo "Ctrl+C to stop"
exec python3 -m http.server "$PORT"
