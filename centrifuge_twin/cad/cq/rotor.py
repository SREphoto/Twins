"""
D — FA-45-24-11 class rotor, piece-by-piece (CadQuery). mm.

Parts:
  D01 body (24 × 45° pockets), D02 lid, D03 O-ring, D04 lock knob,
  D05 tubes ×24, D06 caps ×24, D07 liquid (even pockets)

CLI: .venv-cq/bin/python cad/cq/rotor.py
"""

from __future__ import annotations

import math
import os
import sys

import cadquery as cq

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from exact_assembly import (  # noqa: E402
    geom_rotor_body,
    geom_rotor_lid,
    geom_oring,
    geom_lock_knob,
    geom_tube,
    geom_cap,
    geom_liquid,
    ROTOR_H,
    ROTOR_ANGLE,
    N_POCKETS,
    placed,
)

ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, "export", "step")
OUT_PARTS = os.path.join(OUT, "parts")


def build_rotor_assembly() -> cq.Assembly:
    assy = cq.Assembly(name="D_Rotor")
    assy.add(geom_rotor_body(), name="D01_RotorBody", color=cq.Color(0.45, 0.48, 0.52))
    assy.add(
        geom_rotor_lid(),
        name="D02_RotorLid",
        loc=cq.Location(cq.Vector(0, 0, ROTOR_H + 1)),
        color=cq.Color(0.5, 0.52, 0.55),
    )
    assy.add(
        geom_oring(),
        name="D03_RotorLidORing",
        loc=cq.Location(cq.Vector(0, 0, ROTOR_H + 0.5)),
        color=cq.Color(0.05, 0.05, 0.05),
    )
    assy.add(
        geom_lock_knob(),
        name="D04_RotorLockKnob",
        loc=cq.Location(cq.Vector(0, 0, ROTOR_H + 8)),
        color=cq.Color(0.15, 0.15, 0.18),
    )

    for i in range(N_POCKETS):
        ang = 2 * math.pi * i / N_POCKETS
        r = 50.0
        tx, ty, tz = math.cos(ang) * r, math.sin(ang) * r, 18.0
        rx = ROTOR_ANGLE * math.sin(ang)
        ry = -ROTOR_ANGLE * math.cos(ang)
        tube = placed(geom_tube(), tx, ty, tz, rx, ry, 0)
        cap = placed(geom_cap(), tx, ty, tz + 28, rx, ry, 0)
        assy.add(tube, name=f"D05_Microtube_{i:02d}", color=cq.Color(0.85, 0.9, 0.95))
        assy.add(cap, name=f"D06_MicrotubeCap_{i:02d}", color=cq.Color(0.2, 0.4, 0.85))
        if i % 2 == 0:
            liq = placed(geom_liquid(), tx, ty, tz + 5, rx, ry, 0)
            assy.add(liq, name=f"D07_Liquid_{i:02d}", color=cq.Color(0.5, 0, 0))
    return assy


def build_compound() -> cq.Workplane:
    return geom_rotor_body()


result = build_compound()

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(OUT_PARTS, exist_ok=True)
    assy = build_rotor_assembly()
    path = os.path.join(OUT, "D_rotor.step")
    assy.save(path, exportType="STEP")
    print(f"Wrote {path} (named assembly)")
    cq.exporters.export(geom_rotor_body(), os.path.join(OUT_PARTS, "D01_RotorBody.step"))
    cq.exporters.export(geom_rotor_lid(), os.path.join(OUT_PARTS, "D02_RotorLid.step"))
    print("Wrote D01/D02 part STEP files")
