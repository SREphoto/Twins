#!/bin/bash
set -e
echo "=== Running Labconco FreeZone 4.5L Controller Tests ==="
python3 freeze_dryer_twin/software/controller/test_controller.py
echo "=== Controller Tests Passed 100% ==="
