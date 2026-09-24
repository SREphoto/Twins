#!/usr/bin/env python3
"""
Parametric ISO metric fastener library for FreeCAD.

Run inside FreeCAD:
  FreeCADCmd build_fasteners.py
Or open FreeCAD → Macro → execute this file.

Creates solids for common M2–M5 screws used in the MICRO 5424-R twin BOM.
Exports STEP files next to this script when FreeCAD is available.
"""

from __future__ import annotations

import math
import os
import sys

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# (major_d, pitch, hex/pan head_d, head_h, drive)
# Head dims approximate ISO 7045 pan / ISO 4762 socket cap.
PAN_HEAD = {
    2.0: dict(pitch=0.40, head_d=3.8, head_h=1.3),
    3.0: dict(pitch=0.50, head_d=5.6, head_h=1.8),
    4.0: dict(pitch=0.70, head_d=7.5, head_h=2.4),
    5.0: dict(pitch=0.80, head_d=9.2, head_h=3.0),
}

SOCKET_CAP = {
    3.0: dict(pitch=0.50, head_d=5.5, head_h=3.0, hex=2.5),
    4.0: dict(pitch=0.70, head_d=7.0, head_h=4.0, hex=3.0),
    5.0: dict(pitch=0.80, head_d=8.5, head_h=5.0, hex=4.0),
}

# BOM-driven lengths
PAN_LENGTHS = {
    2.0: [4, 6],
    3.0: [6, 8, 10, 12],
    4.0: [8, 12],
}

SOCKET_LENGTHS = {
    3.0: [8],
    4.0: [8, 10, 12],
    5.0: [12],
}


def _require_freecad():
    try:
        import FreeCAD  # noqa: F401
        import Part  # noqa: F401
        return True
    except ImportError:
        return False


def make_pan_screw(doc, major: float, length: float):
    import FreeCAD
    import Part

    spec = PAN_HEAD[major]
    # Simplified visual thread: smooth shank (LOD CAD). Full helix optional later.
    shank = Part.makeCylinder(major / 2.0, length)
    head = Part.makeCylinder(spec["head_d"] / 2.0, spec["head_h"])
    head.translate(FreeCAD.Vector(0, 0, length))
    solid = shank.fuse(head)
    # Phillips recess (boolean cross) — shallow
    slot_w = major * 0.35
    slot_d = spec["head_h"] * 0.55
    box1 = Part.makeBox(slot_w, spec["head_d"] * 0.7, slot_d)
    box1.translate(
        FreeCAD.Vector(-slot_w / 2, -spec["head_d"] * 0.35, length + spec["head_h"] - slot_d)
    )
    box2 = Part.makeBox(spec["head_d"] * 0.7, slot_w, slot_d)
    box2.translate(
        FreeCAD.Vector(-spec["head_d"] * 0.35, -slot_w / 2, length + spec["head_h"] - slot_d)
    )
    solid = solid.cut(box1.fuse(box2))
    name = f"G_M{int(major) if major == int(major) else major}x{int(length)}_PH_Pan"
    obj = doc.addObject("Part::Feature", name.replace(".", "_"))
    obj.Shape = solid
    obj.Label = name
    return obj, name


def make_socket_screw(doc, major: float, length: float):
    import FreeCAD
    import Part

    spec = SOCKET_CAP[major]
    shank = Part.makeCylinder(major / 2.0, length)
    head = Part.makeCylinder(spec["head_d"] / 2.0, spec["head_h"])
    head.translate(FreeCAD.Vector(0, 0, length))
    solid = shank.fuse(head)
    # Hex socket
    hex_r = spec["hex"] / math.sqrt(3)  # apothem-ish for circumscribed
    # Approximate hex with cylinder cut for FreeCAD simplicity
    socket = Part.makeCylinder(spec["hex"] / 2.0 * 0.9, spec["head_h"] * 0.7)
    socket.translate(FreeCAD.Vector(0, 0, length + spec["head_h"] * 0.3))
    solid = solid.cut(socket)
    name = f"G_M{int(major) if major == int(major) else major}x{int(length)}_SHCS"
    obj = doc.addObject("Part::Feature", name.replace(".", "_"))
    obj.Shape = solid
    obj.Label = name
    return obj, name


def make_washer(doc, major: float):
    import Part

    # ISO-ish flat washer
    od = {3.0: 7.0, 4.0: 9.0, 5.0: 10.0}[major]
    id_ = major + 0.3
    thick = 0.8 if major <= 3 else 1.0
    outer = Part.makeCylinder(od / 2.0, thick)
    inner = Part.makeCylinder(id_ / 2.0, thick + 0.1)
    solid = outer.cut(inner)
    name = f"G_Washer_M{int(major)}"
    obj = doc.addObject("Part::Feature", name)
    obj.Shape = solid
    obj.Label = name
    return obj, name


def make_rubber_foot(doc):
    """A07 reference master — Ø22 × 8 mm."""
    import FreeCAD
    import Part

    body = Part.makeCylinder(11.0, 7.0)
    pad = Part.makeCylinder(12.0, 1.0)
    solid = body.fuse(pad)
    # Blind hole for M4
    hole = Part.makeCylinder(2.1, 5.0)
    hole.translate(FreeCAD.Vector(0, 0, 3.0))
    solid = solid.cut(hole)
    name = "A07_RubberFoot"
    obj = doc.addObject("Part::Feature", name)
    obj.Shape = solid
    obj.Label = name
    return obj, name


def export_step(obj, name: str):
    import Import

    path = os.path.join(OUT_DIR, f"{name}.step")
    Import.export([obj], path)
    print(f"  wrote {path}")


def build_all(export=True):
    import FreeCAD

    doc = FreeCAD.newDocument("FastenerLibrary")
    names = []

    for major, lengths in PAN_LENGTHS.items():
        for length in lengths:
            obj, name = make_pan_screw(doc, major, float(length))
            names.append((obj, name))

    for major, lengths in SOCKET_LENGTHS.items():
        for length in lengths:
            obj, name = make_socket_screw(doc, major, float(length))
            names.append((obj, name))

    for major in (3.0, 4.0, 5.0):
        obj, name = make_washer(doc, major)
        names.append((obj, name))

    obj, name = make_rubber_foot(doc)
    names.append((obj, name))

    doc.recompute()
    fcstd = os.path.join(OUT_DIR, "fastener_library.FCStd")
    doc.saveAs(fcstd)
    print(f"Saved {fcstd} ({len(names)} parts)")

    if export:
        for obj, name in names:
            try:
                export_step(obj, name)
            except Exception as e:
                print(f"  STEP export failed for {name}: {e}")

    return doc


def dry_run_manifest():
    """No FreeCAD — print planned part names for CI / planning."""
    lines = []
    for major, lengths in PAN_LENGTHS.items():
        for length in lengths:
            m = int(major) if major == int(major) else major
            lines.append(f"G_M{m}x{length}_PH_Pan")
    for major, lengths in SOCKET_LENGTHS.items():
        for length in lengths:
            m = int(major) if major == int(major) else major
            lines.append(f"G_M{m}x{length}_SHCS")
    for major in (3, 4, 5):
        lines.append(f"G_Washer_M{major}")
    lines.append("A07_RubberFoot")
    return lines


def main():
    if not _require_freecad():
        print("FreeCAD not importable in this Python. Manifest only:\n")
        for n in dry_run_manifest():
            print(f"  {n}")
        manifest_path = os.path.join(OUT_DIR, "manifest.txt")
        with open(manifest_path, "w", encoding="utf-8") as f:
            f.write("\n".join(dry_run_manifest()) + "\n")
        print(f"\nWrote {manifest_path}")
        print("Run with FreeCADCmd for solids + STEP export.")
        return 0

    build_all(export=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
