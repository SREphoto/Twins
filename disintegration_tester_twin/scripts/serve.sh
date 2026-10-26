#!/bin/bash
PORT=8765
echo "Serving ERWEKA ZT 322 Disintegration Tester Digital Twin at http://127.0.0.1:${PORT}/disintegration_tester_twin/software/viewer/"
python3 -m http.server ${PORT}
