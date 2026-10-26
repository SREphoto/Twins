#!/bin/bash
set -e
echo "=== Running ERWEKA ZT 322 Disintegration Tester Controller Tests ==="
python3 disintegration_tester_twin/software/controller/test_controller.py
echo "=== Controller Tests Passed 100% ==="
