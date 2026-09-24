#!/usr/bin/env python3
"""
Product-look MICRO 5424-R class model (mm).

Not an exploded catalog dump — three solid groups that *look* like a lab
centrifuge from outside: stepped body, sloped front panel, openable lid with
window, visible chamber + rotor when lid open.

  body_static.stl  / rotor_spin.stl / lid_hinge.stl  (+ full_assembled.stl)

CLI:
  .venv-cq/bin/python cad/cq/build_product_look.py
"""

from __future__ import annotations

import math
import os

import cadquery as cq

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "export", "mesh")
TOL = 0.25

# Published envelope
W, D, H = 290.0, 480.0, 260.0
# Visual layout (Z up, chamber axis X=Y=0)
CH_R = 72.0  # chamber inner radius
CH_Z0 = 95.0  # chamber floor height above bench (visual)
CH_DEPTH = 52.0
BODY_H = 175.0  # main body top deck under lid
FOOT = 8.0


def export(solid, name):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name)
    cq.exporters.export(solid, path, tolerance=TOL, angularTolerance=0.15)
    print(f"  {name}: {os.path.getsize(path)//1024} KB")


def body_static() -> cq.Workplane:
    """Main instrument shell — not a solid brick: deck hole, front panel, base, feet."""
    # --- base plinth ---
    base = (
        cq.Workplane("XY")
        .box(W + 6, D + 6, 22, centered=(True, True, False))
        .edges("|Z")
        .fillet(6)
    )

    # --- main mass (rear bulk taller / deeper for R-class look) ---
    main = (
        cq.Workplane("XY")
        .workplane(offset=18)
        .box(W, D - 40, BODY_H - 18, centered=(True, True, False))
        .edges("|Z")
        .fillet(8)
    )
    # shift main slightly back so front panel reads
    main = main.translate((0, 15, 0))

    # --- front control block (lower, protruding) ---
    front = (
        cq.Workplane("XY")
        .workplane(offset=18)
        .center(0, -D / 2 + 55)
        .box(W - 30, 90, 95, centered=(True, True, False))
        .edges("|Z")
        .fillet(5)
    )

    # slanted face cut on front (wedge)
    wedge = (
        cq.Workplane("XY")
        .workplane(offset=70)
        .center(0, -D / 2 + 10)
        .box(W, 80, 80, centered=(True, True, False))
        .rotate((0, 0, 0), (1, 0, 0), -28)
        .translate((0, -20, 40))
    )
    # Use main+front as shell pieces
    shell = base.union(main).union(front)

    # --- top deck recess / chamber bore (so you see into machine) ---
    bore = (
        cq.Workplane("XY")
        .workplane(offset=BODY_H - 5)
        .circle(CH_R + 8)
        .extrude(40)
    )
    shell = shell.cut(bore)

    # deep chamber well
    well = (
        cq.Workplane("XY")
        .workplane(offset=CH_Z0)
        .circle(CH_R + 4)
        .extrude(CH_DEPTH + 10)
    )
    shell = shell.cut(well)

    # --- stainless-looking chamber insert (union a thin bowl) ---
    bowl_outer = (
        cq.Workplane("XY")
        .workplane(offset=CH_Z0)
        .circle(CH_R + 3)
        .extrude(CH_DEPTH)
    )
    bowl_inner = (
        cq.Workplane("XY")
        .workplane(offset=CH_Z0 + 2)
        .circle(CH_R)
        .extrude(CH_DEPTH)
    )
    bowl = bowl_outer.cut(bowl_inner)
    shell = shell.union(bowl)

    # drive cone
    cone = (
        cq.Workplane("XY")
        .workplane(offset=CH_Z0 + 2)
        .circle(12)
        .workplane(offset=16)
        .circle(6)
        .loft()
    )
    shell = shell.union(cone)

    # --- LCD pocket + keys shelf on front face ---
    lcd_pocket = (
        cq.Workplane("XY")
        .workplane(offset=95)
        .center(0, -D / 2 + 48)
        .box(100, 8, 48, centered=(True, True, False))
        .rotate((0, 0, 0), (1, 0, 0), -18)
    )
    shell = shell.cut(lcd_pocket)

    # key row nubs (raised, dark later)
    keys = None
    for i, x in enumerate([-50, -25, 0, 25, 50, 75]):
        k = (
            cq.Workplane("XY")
            .workplane(offset=78)
            .center(x, -D / 2 + 62)
            .box(14, 6, 10, centered=(True, True, False))
            .rotate((0, 0, 0), (1, 0, 0), -18)
        )
        keys = k if keys is None else keys.union(k)
    shell = shell.union(keys)

    # rear vents (slots)
    for i in range(7):
        slot = (
            cq.Workplane("XY")
            .workplane(offset=50 + i * 14)
            .center(0, D / 2 - 2)
            .box(100, 8, 6, centered=(True, True, False))
        )
        shell = shell.cut(slot)

    # IEC brick
    iec = (
        cq.Workplane("XY")
        .workplane(offset=40)
        .center(70, D / 2 - 5)
        .box(32, 12, 24, centered=(True, True, False))
    )
    shell = shell.union(iec)

    # rubber feet
    for x, y in [(-110, -200), (110, -200), (-110, 200), (110, 200)]:
        foot = (
            cq.Workplane("XY")
            .workplane(offset=-FOOT)
            .center(x, y)
            .circle(12)
            .extrude(FOOT + 2)
        )
        shell = shell.union(foot)

    # R-class side bulge (compressor fairing)
    bulge = (
        cq.Workplane("XY")
        .workplane(offset=20)
        .center(W / 2 - 10, 80)
        .box(50, 160, 140, centered=(True, True, False))
        .edges("|Z")
        .fillet(10)
    )
    shell = shell.union(bulge)

    # condensation tray lip front
    tray = (
        cq.Workplane("XY")
        .workplane(offset=10)
        .center(0, -D / 2 + 35)
        .box(120, 40, 12, centered=(True, True, False))
    )
    shell = shell.union(tray)

    return shell


def rotor_spin() -> cq.Workplane:
    """Fixed-angle style rotor + tubes, sitting in chamber."""
    z0 = CH_Z0 + 6
    body = (
        cq.Workplane("XY")
        .workplane(offset=z0)
        .circle(62)
        .extrude(36)
    )
    # hub
    hub = (
        cq.Workplane("XY")
        .workplane(offset=z0 - 2)
        .circle(14)
        .extrude(20)
    )
    body = body.union(hub)
    # angled pockets + tubes
    for i in range(24):
        ang = 2 * math.pi * i / 24
        r = 42
        x, y = math.cos(ang) * r, math.sin(ang) * r
        # pocket hole
        cut = (
            cq.Workplane("XY")
            .workplane(offset=z0 + 8)
            .center(x, y)
            .circle(5.8)
            .extrude(40)
            .rotate((x, y, z0 + 20), (x - math.cos(ang), y - math.sin(ang), z0 + 20 + 1), 0)  # noop-ish
        )
        # simpler vertical cut then tubes tilted visually
        cut = (
            cq.Workplane("XY")
            .workplane(offset=z0 + 5)
            .center(x, y)
            .circle(5.8)
            .extrude(35)
        )
        try:
            body = body.cut(cut)
        except Exception:
            pass
        # tube
        tube = (
            cq.Workplane("XY")
            .workplane(offset=z0 + 10)
            .center(x, y)
            .circle(5.2)
            .extrude(32)
        )
        # tilt tube outward 45° about tangent
        # approximate by rotating around Y then Z
        tube = tube.rotate((0, 0, 0), (0, 1, 0), 45 * math.cos(ang) * 0)  # keep vertical for robust boolean
        cap = (
            cq.Workplane("XY")
            .workplane(offset=z0 + 40)
            .center(x, y)
            .circle(6.2)
            .extrude(6)
        )
        body = body.union(tube).union(cap)

    # rotor lid
    rlid = (
        cq.Workplane("XY")
        .workplane(offset=z0 + 36)
        .circle(64)
        .extrude(8)
    )
    knob = (
        cq.Workplane("XY")
        .workplane(offset=z0 + 44)
        .circle(11)
        .extrude(12)
    )
    body = body.union(rlid).union(knob)
    try:
        body = body.edges(">Z").fillet(1.2)
    except Exception:
        pass
    return body


def lid_hinge() -> cq.Workplane:
    """Top lid with smoked window; closed position over chamber."""
    z = BODY_H + 2
    frame = (
        cq.Workplane("XY")
        .workplane(offset=z)
        .box(250, 250, 14, centered=(True, True, False))
        .edges("|Z")
        .fillet(10)
    )
    window = (
        cq.Workplane("XY")
        .workplane(offset=z - 1)
        .circle(CH_R - 2)
        .extrude(18)
    )
    frame = frame.cut(window)
    # glass disc (slightly thinner, stays in lid group)
    glass = (
        cq.Workplane("XY")
        .workplane(offset=z + 4)
        .circle(CH_R - 4)
        .extrude(3)
    )
    # hinge knuckles rear
    for x in (-50, 50):
        knuckle = (
            cq.Workplane("XY")
            .workplane(offset=z - 4)
            .center(x, 115)
            .circle(8)
            .extrude(20)
        )
        frame = frame.union(knuckle)
    # front lip / handle
    handle = (
        cq.Workplane("XY")
        .workplane(offset=z + 10)
        .center(0, -100)
        .box(70, 18, 8, centered=(True, True, False))
        .edges("|Z")
        .fillet(3)
    )
    return frame.union(glass).union(handle)


def main():
    print("Product-look body…")
    b = body_static()
    export(b, "body_static.stl")

    print("Product-look rotor…")
    r = rotor_spin()
    export(r, "rotor_spin.stl")

    print("Product-look lid…")
    lid = lid_hinge()
    export(lid, "lid_hinge.stl")

    print("Full compound…")
    full = b.union(r).union(lid)
    export(full, "full_assembled.stl")
    # STEP for CAD apps
    step = os.path.join(ROOT, "export", "step", "MICRO_5424R_PRODUCT.step")
    os.makedirs(os.path.dirname(step), exist_ok=True)
    cq.exporters.export(full, step)
    print(f"  STEP {step}")
    print("DONE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
