"""Parametric metric fasteners (visual CAD LOD — head + shank, no full helix)."""

from __future__ import annotations

import cadquery as cq

# ISO-ish head sizes (mm)
PAN = {
    2.0: dict(head_d=3.8, head_h=1.3, pitch=0.4),
    3.0: dict(head_d=5.6, head_h=1.8, pitch=0.5),
    4.0: dict(head_d=7.5, head_h=2.4, pitch=0.7),
    5.0: dict(head_d=9.2, head_h=3.0, pitch=0.8),
}

SHCS = {
    3.0: dict(head_d=5.5, head_h=3.0),
    4.0: dict(head_d=7.0, head_h=4.0),
    5.0: dict(head_d=8.5, head_h=5.0),
}


def pan_screw(major: float, length: float) -> cq.Workplane:
    """Pan head Phillips-style (smooth shank). Axis +Z, head on top of shank."""
    s = PAN[major]
    shank = cq.Workplane("XY").circle(major / 2).extrude(length)
    head = (
        cq.Workplane("XY")
        .workplane(offset=length)
        .circle(s["head_d"] / 2)
        .extrude(s["head_h"])
    )
    return shank.union(head)


def socket_cap_screw(major: float, length: float) -> cq.Workplane:
    s = SHCS[major]
    shank = cq.Workplane("XY").circle(major / 2).extrude(length)
    head = (
        cq.Workplane("XY")
        .workplane(offset=length)
        .circle(s["head_d"] / 2)
        .extrude(s["head_h"])
    )
    solid = shank.union(head)
    # hex socket recess
    socket = (
        cq.Workplane("XY")
        .workplane(offset=length + s["head_h"] * 0.25)
        .circle(major * 0.45)
        .extrude(s["head_h"] * 0.6)
    )
    return solid.cut(socket)


def washer(major: float) -> cq.Workplane:
    od = {3.0: 7.0, 4.0: 9.0, 5.0: 10.0}[major]
    id_ = major + 0.3
    thick = 0.8 if major <= 3 else 1.0
    return (
        cq.Workplane("XY")
        .circle(od / 2)
        .circle(id_ / 2)
        .extrude(thick)
    )


def rubber_foot(od: float = 22.0, h: float = 8.0, hole_r: float = 2.1) -> cq.Workplane:
    body = cq.Workplane("XY").circle(od / 2).extrude(h)
    hole = (
        cq.Workplane("XY")
        .workplane(offset=h * 0.35)
        .circle(hole_r)
        .extrude(h)
    )
    return body.cut(hole)
