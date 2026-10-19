#!/bin/bash
set -e
echo "=== Running Agilent 708-DS Dissolution Apparatus Controller Tests ==="
python3 dissolution_tester_twin/software/controller/test_controller.py
echo "=== Controller Tests Passed 100% ==="
