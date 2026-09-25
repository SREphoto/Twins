#!/usr/bin/env bash
# verify_twin.sh — Syntax, Cache-Bust, and Structural Sanity Check for Machine Twins
set -euo pipefail

TWIN="${1:-balance_twin}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TWIN_DIR="${ROOT}/${TWIN}"

echo "========================================================"
echo "Verifying Digital Twin Package: ${TWIN}"
echo "Location: ${TWIN_DIR}"
echo "========================================================"

if [ ! -d "${TWIN_DIR}" ]; then
  echo "❌ ERROR: Twin directory does not exist: ${TWIN_DIR}"
  exit 1
fi

ERRORS=0

# 1. Check required directory structure
echo "Checking required directories..."
for req in "research" "docs" "software/viewer"; do
  if [ ! -d "${TWIN_DIR}/${req}" ]; then
    echo "  ⚠️ Warning: Missing directory '${req}'"
  else
    echo "  ✅ Found '${req}'"
  fi
done

# 2. Check JavaScript syntax via Node.js
VIEWER_DIR="${TWIN_DIR}/software/viewer"
if [ -d "${VIEWER_DIR}" ]; then
  echo "Running JavaScript syntax checks..."
  for js in "${VIEWER_DIR}"/*.js; do
    if [ -f "${js}" ]; then
      if node --experimental-vm-modules -e '
        import fs from "fs";
        import vm from "vm";
        const code = fs.readFileSync(process.argv[1], "utf8");
        new vm.SourceTextModule(code);
      ' "${js}" >/dev/null 2>&1; then
        echo "  ✅ Syntax OK: $(basename "${js}")"
      else
        echo "  ❌ SYNTAX ERROR in: $(basename "${js}")"
        ERRORS=$((ERRORS + 1))
      fi
    fi
  done
fi

# 3. Check cache-busting discipline in index.html
INDEX_HTML="${VIEWER_DIR}/index.html"
if [ -f "${INDEX_HTML}" ]; then
  echo "Checking cache-busting query parameters in index.html..."
  if grep -E 'src="[^"]+\.js\?v=' "${INDEX_HTML}" >/dev/null 2>&1; then
    echo "  ✅ Cache-busting query parameter (?v=...) present in index.html"
  else
    echo "  ⚠️ WARNING: index.html does not appear to use '?v=' cache busting for script tags!"
  fi
fi

# 4. Check official SRE badge presence
JS_FILES=$(ls "${VIEWER_DIR}"/*.js 2>/dev/null || true)
if [ -n "${JS_FILES}" ]; then
  if grep -rn "makeSREdesignsBadge" ${JS_FILES} >/dev/null 2>&1; then
    echo "  ✅ Official SREdesigns badge integration found."
  else
    echo "  ⚠️ WARNING: 'makeSREdesignsBadge' not found in viewer JS!"
  fi
fi

echo "========================================================"
if [ ${ERRORS} -eq 0 ]; then
  echo "🎉 Verification PASSED with 0 syntax errors."
  exit 0
else
  echo "❌ Verification FAILED with ${ERRORS} error(s)."
  exit 1
fi
