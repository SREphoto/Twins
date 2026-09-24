"""
C — Rotor chamber + drive cone (CadQuery). mm.
"""

from __future__ import annotations

import os

import cadquery as cq

CHAMBER_ID = 160.0
CHAMBER_DEPTH = 55.0
WALL = 3.0
CONE_H = 18.0
CONE_R1 = 11.0
CONE_R2 = 6.0

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "export", "step")


def make_bowl() -> cq.Workplane:
    outer = cq.Workplane("XY").circle(CHAMBER_ID / 2 + WALL).extrude(CHAMBER_DEPTH)
    inner = (
        cq.Workplane("XY")
        .workplane(offset=WALL)
        .circle(CHAMBER_ID / 2)
        .extrude(CHAMBER_DEPTH)
    )
    return outer.cut(inner)


def make_floor() -> cq.Workplane:
    return cq.Workplane("XY").circle(CHAMBER_ID / 2 - 1).extrude(WALL)


def make_drive_cone() -> cq.Workplane:
    # frustum along +Z
    return (
        cq.Workplane("XY")
        .workplane(offset=WALL)
        .circle(CONE_R1)
        .workplane(offset=CONE_H)
        .circle(CONE_R2)
        .loft()
    )


def make_gasket() -> cq.Workplane:
    # torus approx via revolve ring
    return (
        cq.Workplane("XY")
        .workplane(offset=CHAMBER_DEPTH)
        .center(CHAMBER_ID / 2 + 1, 0)
        .circle(2.0)
        .revolve(360, (0, 0, 0), (0, 0, 1))
    )


def build_compound() -> cq.Workplane:
    return make_bowl().union(make_floor()).union(make_drive_cone()).union(make_gasket())


result = build_compound()

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, "C_chamber.step")
    cq.exporters.export(result, path)
    print(f"Wrote {path}")
