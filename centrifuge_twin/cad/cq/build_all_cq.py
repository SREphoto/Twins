#!/usr/bin/env python3
"""Export all CadQuery STEP parts for the MICRO 5424-R twin."""

from __future__ import annotations

import os
import sys

# ensure local imports
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import cadquery as cq
import enclosure
import chamber
import rotor

ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, "export", "step")


def main():
    os.makedirs(OUT, exist_ok=True)

    parts = {
        "A_enclosure_compound.step": enclosure.build_compound(),
        "C_chamber.step": chamber.build_compound(),
        "D_rotor.step": rotor.build_compound(),
    }

    # Full assembly as Assembly
    assy = cq.Assembly(name="MICRO_5424R")
    assy.add(enclosure.build_compound(), name="A_Enclosure", color=cq.Color(0.9, 0.91, 0.93))
    # chamber raised into housing
    assy.add(
        chamber.build_compound(),
        name="C_Chamber",
        loc=cq.Location(cq.Vector(0, 40, 160)),
        color=cq.Color(0.7, 0.72, 0.75),
    )
    assy.add(
        rotor.build_compound(),
        name="D_Rotor",
        loc=cq.Location(cq.Vector(0, 40, 168)),
        color=cq.Color(0.4, 0.42, 0.45),
    )

    for name, solid in parts.items():
        path = os.path.join(OUT, name)
        cq.exporters.export(solid, path)
        print(f"Wrote {path}")

    assy_path = os.path.join(OUT, "MICRO_5424R_assembly.step")
    assy.save(assy_path, exportType="STEP")
    print(f"Wrote {assy_path}")

    enclosure.build_assembly().save(os.path.join(OUT, "A_enclosure.step"), exportType="STEP")
    print("Wrote A_enclosure.step (named assembly)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
