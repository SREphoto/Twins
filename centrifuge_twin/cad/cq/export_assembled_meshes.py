#!/usr/bin/env python3
"""
Export *assembled* (not exploded) mesh groups from the exact CadQuery model.

Three STLs in world coordinates (mm), origin = chamber axis / floor Z=0:
  export/mesh/body_static.stl   — housing, chamber, drive, rack, controls, screws…
  export/mesh/rotor_spin.stl    — D* rotor + tubes (spin about +Z)
  export/mesh/lid_hinge.stl     — B* lid (hinge about rear)

CLI:
  .venv-cq/bin/python cad/cq/export_assembled_meshes.py
"""

from __future__ import annotations

import math
import os
import sys

import cadquery as cq

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from exact_assembly import (  # noqa: E402
    geom_housing,
    geom_base_tub,
    geom_bezel,
    geom_rear_panel,
    geom_side,
    geom_vent_slat,
    geom_iec,
    geom_nameplate,
    geom_label,
    geom_tray,
    geom_chamber_bowl,
    geom_floor,
    geom_drive_cone,
    geom_boot,
    geom_gasket_ring,
    geom_sensor,
    geom_rotor_body,
    geom_rotor_lid,
    geom_oring,
    geom_lock_knob,
    geom_tube,
    geom_cap,
    geom_liquid,
    geom_lid_frame,
    geom_viewport,
    geom_viewport_gasket,
    geom_hinge,
    geom_latch,
    geom_handle,
    geom_key,
    geom_lcd,
    geom_lcd_bezel,
    geom_motor,
    geom_motor_plate,
    geom_pcb,
    geom_fan,
    geom_compressor,
    geom_condenser,
    geom_rack,
    placed,
    W,
    D,
    H,
    FOOT_H,
    FOOT_OD,
    FOOT_INSET,
    HOUSING_BOTTOM,
    CHAMBER_DEPTH,
    CHAMBER_ID,
    ROTOR_H,
    ROTOR_ANGLE,
    N_POCKETS,
    LID_D,
    HINGE_Y,
    BEZEL_W,
)
from lib.fasteners import pan_screw, socket_cap_screw, rubber_foot  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, "export", "mesh")
TOL = 0.35  # mesh deflection mm (balance quality/size)


def fuse(parts: list) -> cq.Workplane:
    """Union a list of Workplanes into one solid (skip failed fuses)."""
    if not parts:
        raise ValueError("empty")
    acc = parts[0]
    for p in parts[1:]:
        try:
            acc = acc.union(p)
        except Exception:
            try:
                acc = acc.fuse(p)
            except Exception as e:
                print(f"  skip fuse: {e}")
    return acc


def build_body() -> cq.Workplane:
    hz0 = HOUSING_BOTTOM
    parts = []

    parts.append(placed(geom_housing(), 0, 0, hz0))
    parts.append(placed(geom_base_tub(), 0, 0, hz0 + 5))
    parts.append(placed(geom_bezel(), 0, -D / 2 + 12, hz0 + H - 100, rx=-15))
    parts.append(placed(geom_rear_panel(), 0, D / 2 - 8, hz0 + 40))
    parts.append(placed(geom_side(8, D * 0.65, 120), -W / 2 + 8, 20, hz0 + 40))
    parts.append(placed(geom_side(42, D * 0.45, 130), W / 2 - 28, 50, hz0 + 35))

    half_w, half_d = W / 2 - FOOT_INSET, D / 2 - FOOT_INSET
    for fx, fy in [(-half_w, -half_d), (half_w, -half_d), (-half_w, half_d), (half_w, half_d)]:
        parts.append(placed(rubber_foot(FOOT_OD, FOOT_H), fx, fy, hz0 - FOOT_H))
        parts.append(placed(pan_screw(4.0, 12.0), fx, fy, hz0 - FOOT_H + 2))

    seam = []
    for x in (-100, -50, 0, 50, 100):
        seam.append((x, -D / 2 + 4, hz0 + 25, 90, 0, 0))
    for x in (-80, -30, 30, 80):
        seam.append((x, D / 2 - 4, hz0 + 50, 90, 0, 0))
    for y in (-80, 0, 80):
        seam.append((-W / 2 + 3, y, hz0 + 70, 0, 90, 0))
        seam.append((W / 2 - 3, y, hz0 + 70, 0, 90, 0))
    for x, y, z, rx, ry, rz in seam[:15]:
        parts.append(placed(pan_screw(3.0, 8.0), x, y, z, rx, ry, rz))

    parts.append(placed(geom_nameplate(), -90, -D / 2 + 1, hz0 + 45))
    parts.append(placed(geom_label(), 60, -D / 2 + 1, hz0 + 55))
    for i in range(6):
        parts.append(placed(geom_vent_slat(), -50, D / 2 - 6, hz0 + 70 + i * 12))
    parts.append(placed(geom_iec(), 85, D / 2 - 5, hz0 + 45))
    parts.append(placed(geom_tray(), 0, -D / 2 + 40, hz0 + 2))

    # chamber
    parts.append(placed(geom_chamber_bowl(), 0, 0, 0))
    parts.append(placed(geom_gasket_ring(), 0, 0, CHAMBER_DEPTH - 1))
    parts.append(placed(geom_floor(), 0, 0, 0))
    parts.append(placed(geom_drive_cone(), 0, 0, 2.5))
    parts.append(placed(geom_boot(), 0, 0, 0))
    parts.append(placed(geom_sensor(), CHAMBER_ID / 2 - 12, 0, 6))
    for ang_deg in (45, 135, 225, 315):
        a = math.radians(ang_deg)
        r = CHAMBER_ID / 2 + 10
        parts.append(
            placed(
                socket_cap_screw(4.0, 10.0),
                math.cos(a) * r,
                math.sin(a) * r,
                CHAMBER_DEPTH / 2,
            )
        )

    # controls (simplified block on front)
    bx, by, bz = 0.0, -D / 2 + 10, hz0 + H - 95
    parts.append(placed(cq.Workplane("XY").box(BEZEL_W - 8, 3, 55, centered=True), bx, by - 2, bz, rx=-15))
    parts.append(placed(geom_lcd_bezel(), bx - 40, by - 4, bz + 5, rx=-15))
    parts.append(placed(geom_lcd(), bx - 40, by - 6, bz + 5, rx=-15))
    for kx, kz in [(40, -10), (60, -10), (80, -10), (40, 10), (60, 10), (80, 10)]:
        parts.append(placed(geom_key(), bx + kx, by - 5, bz + kz, rx=-15))

    # drive bay
    parts.append(placed(geom_motor(), 0, 0, -75))
    parts.append(placed(geom_motor_plate(), 0, 0, -40))
    parts.append(placed(geom_pcb(90, 60), -70, -30, -55))
    parts.append(placed(geom_pcb(70, 50), 70, -30, -55))
    parts.append(placed(geom_fan(), 95, 70, -45))
    parts.append(placed(geom_compressor(), 95, 110, -50))
    parts.append(placed(geom_condenser(), 130, 40, 20))

    # rack left
    rx0 = -W / 2 - 90
    parts.append(placed(geom_rack(), rx0, 0, hz0))

    print(f"  body: fusing {len(parts)} solids…")
    return fuse(parts)


def build_rotor() -> cq.Workplane:
    rotor_z = 8.0
    parts = [
        placed(geom_rotor_body(), 0, 0, rotor_z),
        placed(geom_rotor_lid(), 0, 0, rotor_z + ROTOR_H + 1),
        placed(geom_oring(), 0, 0, rotor_z + ROTOR_H + 0.5),
        placed(geom_lock_knob(), 0, 0, rotor_z + ROTOR_H + 8),
    ]
    for i in range(N_POCKETS):
        ang = 2 * math.pi * i / N_POCKETS
        r = 50.0
        tx, ty, tz = math.cos(ang) * r, math.sin(ang) * r, rotor_z + 18
        rx = ROTOR_ANGLE * math.sin(ang)
        ry = -ROTOR_ANGLE * math.cos(ang)
        parts.append(placed(geom_tube(), tx, ty, tz, rx, ry))
        parts.append(placed(geom_cap(), tx, ty, tz + 28, rx, ry))
        if i % 3 == 0:
            parts.append(placed(geom_liquid(), tx, ty, tz + 5, rx, ry))
    print(f"  rotor: fusing {len(parts)} solids…")
    return fuse(parts)


def build_lid() -> cq.Workplane:
    lid_z = CHAMBER_DEPTH + 6
    parts = [
        placed(geom_lid_frame(), 0, 0, lid_z),
        placed(geom_viewport(), 0, 0, lid_z + 4),
        placed(geom_viewport_gasket(), 0, 0, lid_z + 3),
        placed(geom_hinge(), -45, HINGE_Y, lid_z - 2),
        placed(geom_hinge(), 45, HINGE_Y, lid_z - 2),
        placed(geom_latch(), 0, -LID_D / 2 + 20, lid_z + 2),
        placed(geom_handle(), 0, -LID_D / 2 + 35, lid_z + 10),
    ]
    print(f"  lid: fusing {len(parts)} solids…")
    return fuse(parts)


def export_stl(solid: cq.Workplane, path: str):
    cq.exporters.export(solid, path, tolerance=TOL, angularTolerance=0.2)
    print(f"  wrote {path} ({os.path.getsize(path) // 1024} KB)")


def main():
    os.makedirs(OUT, exist_ok=True)
    print("Building assembled body…")
    body = build_body()
    export_stl(body, os.path.join(OUT, "body_static.stl"))

    print("Building assembled rotor…")
    rotor = build_rotor()
    export_stl(rotor, os.path.join(OUT, "rotor_spin.stl"))

    print("Building assembled lid…")
    lid = build_lid()
    export_stl(lid, os.path.join(OUT, "lid_hinge.stl"))

    # Also combined for static product shot
    print("Building full compound…")
    full = fuse([body, rotor, lid])
    export_stl(full, os.path.join(OUT, "full_assembled.stl"))
    print("DONE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
