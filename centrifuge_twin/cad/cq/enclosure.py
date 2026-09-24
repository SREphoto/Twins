"""
A — Enclosure (CadQuery). 5424 R class, mm.

CLI:  centrifuge_twin/.venv-cq/bin/python cad/cq/enclosure.py
VS Code CadQuery: open this file, run cq-server, Alt+V, save to preview.
"""

from __future__ import annotations

import os

import cadquery as cq

W, D, H = 290.0, 480.0, 260.0
FOOT_H = 8.0
FOOT_R = 11.0
WALL = 4.0
CHAMBER_ID = 160.0
CHAMBER_Y = 40.0

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "export", "step")


def make_housing() -> cq.Workplane:
    outer = cq.Workplane("XY").box(W, D, H - FOOT_H, centered=(True, True, False))
    inner = (
        cq.Workplane("XY")
        .workplane(offset=WALL)
        .box(W - 2 * WALL, D - 2 * WALL, H - FOOT_H - WALL - 2, centered=(True, True, False))
    )
    shell = outer.cut(inner)
    top_z = H - FOOT_H
    chamber = (
        cq.Workplane("XY")
        .workplane(offset=top_z - 80)
        .center(0, CHAMBER_Y)
        .circle(CHAMBER_ID / 2 + 2)
        .extrude(90)
    )
    shell = shell.cut(chamber)
    return shell.edges("|Z").fillet(2.5)


def make_feet() -> cq.Workplane:
    inset = 25.0
    positions = [
        (-W / 2 + inset, -D / 2 + inset),
        (W / 2 - inset, -D / 2 + inset),
        (-W / 2 + inset, D / 2 - inset),
        (W / 2 - inset, D / 2 - inset),
    ]
    feet = None
    for x, y in positions:
        f = (
            cq.Workplane("XY")
            .workplane(offset=-FOOT_H)
            .center(x, y)
            .circle(FOOT_R)
            .extrude(FOOT_H)
        )
        feet = f if feet is None else feet.union(f)
    return feet


def make_rear_panel() -> cq.Workplane:
    return (
        cq.Workplane("XY")
        .workplane(offset=20)
        .center(0, D / 2 - 3)
        .box(W - 20, 6, H * 0.55, centered=(True, True, False))
    )


def make_iec() -> cq.Workplane:
    return (
        cq.Workplane("XY")
        .workplane(offset=40)
        .center(80, D / 2 - 2)
        .box(30, 8, 22, centered=(True, True, False))
    )


def build_assembly() -> cq.Assembly:
    assy = cq.Assembly(name="A_Enclosure")
    assy.add(make_housing(), name="A01_MainUpperHousing", color=cq.Color(0.92, 0.93, 0.95))
    assy.add(make_feet(), name="A07_RubberFeet", color=cq.Color(0.05, 0.05, 0.05))
    assy.add(make_rear_panel(), name="A04_RearPanel", color=cq.Color(0.15, 0.15, 0.17))
    assy.add(make_iec(), name="A14_IEC_Inlet", color=cq.Color(0.2, 0.2, 0.22))
    return assy


def build_compound() -> cq.Workplane:
    """Single solid for quick preview (union of parts)."""
    return (
        make_housing()
        .union(make_feet())
        .union(make_rear_panel())
        .union(make_iec())
    )


# CadQuery VS Code server previews top-level `result` if present
result = build_compound()

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, "A_enclosure.step")
    build_assembly().save(path, exportType="STEP")
    print(f"Wrote {path}")
    cq.exporters.export(result, os.path.join(OUT, "A_enclosure_compound.step"))
    print("Wrote compound STEP")
