#!/usr/bin/env python3
"""
Exact piece-by-piece MICRO 5424-R class assembly (CadQuery).

World origin (docs/dimensions.md):
  - Chamber axis at XY = (0, 0)
  - Chamber floor at Z = 0
  - +Z up; rotor spins about +Z

Every BOM part is a named Assembly child with Location.
Fasteners are individual instances (A08_01 …).

CLI:
  centrifuge_twin/.venv-cq/bin/python cad/cq/exact_assembly.py

Outputs:
  export/step/parts/*.step          — one file per part (or small group)
  export/step/MICRO_5424R_EXACT.step
  docs/PARTS_MAP.md                 — coordinates of every instance
  export/parts_catalog.json
"""

from __future__ import annotations

import json
import math
import os
import sys
from dataclasses import dataclass, asdict
from typing import Any, Dict, List, Optional, Tuple

import cadquery as cq

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from lib.fasteners import pan_screw, socket_cap_screw, rubber_foot, washer  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(HERE))
OUT_STEP = os.path.join(ROOT, "export", "step")
OUT_PARTS = os.path.join(OUT_STEP, "parts")
OUT_JSON = os.path.join(ROOT, "export", "parts_catalog.json")
OUT_MAP = os.path.join(ROOT, "docs", "PARTS_MAP.md")

# --- Envelope / published ---
W, D, H = 290.0, 480.0, 260.0
FOOT_H, FOOT_OD, FOOT_INSET = 8.0, 22.0, 25.0

# Housing: chamber floor Z=0; housing sits around chamber.
# Bottom of housing near Z = -90 (motor bay), top near Z = 170 → ~260 span with feet
HOUSING_BOTTOM = -90.0
HOUSING_TOP = HOUSING_BOTTOM + (H - FOOT_H)  # 162

CHAMBER_ID = 160.0
CHAMBER_DEPTH = 55.0
CHAMBER_WALL = 3.0

ROTOR_OD = 140.0
ROTOR_H = 45.0
ROTOR_ANGLE = 45.0  # deg fixed-angle
N_POCKETS = 24
R_MAX = 84.0  # tube bottom radius for RCF
TUBE_OD, TUBE_H = 10.8, 39.0
TUBE_CAP_OD, TUBE_CAP_H = 13.0, 8.0
POCKET_DEPTH = 38.0

LID_W, LID_D, LID_T = 280.0, 280.0, 12.0
VIEWPORT_R, VIEWPORT_T = 70.0, 3.0
HINGE_Y = -120.0  # rear of chamber

BEZEL_W, BEZEL_H = 270.0, 70.0


@dataclass
class PartRec:
    id: str
    name: str
    qty_index: int
    x: float
    y: float
    z: float
    rx_deg: float
    ry_deg: float
    rz_deg: float
    notes: str = ""


CATALOG: List[PartRec] = []


def placed(
    solid: cq.Workplane,
    x=0.0,
    y=0.0,
    z=0.0,
    rx=0.0,
    ry=0.0,
    rz=0.0,
) -> cq.Workplane:
    """Rotate about origin (deg) then translate (mm)."""
    s = solid
    if rx:
        s = s.rotate((0, 0, 0), (1, 0, 0), rx)
    if ry:
        s = s.rotate((0, 0, 0), (0, 1, 0), ry)
    if rz:
        s = s.rotate((0, 0, 0), (0, 0, 1), rz)
    if x or y or z:
        s = s.translate((x, y, z))
    return s


def add(
    assy: cq.Assembly,
    solid: cq.Workplane,
    part_id: str,
    x=0.0,
    y=0.0,
    z=0.0,
    rx=0.0,
    ry=0.0,
    rz=0.0,
    color: Optional[cq.Color] = None,
    notes: str = "",
    qty_index: int = 1,
    export_individual: bool = True,
) -> None:
    name = part_id
    world = placed(solid, x, y, z, rx, ry, rz)
    assy.add(
        world,
        name=name,
        color=color or cq.Color(0.7, 0.7, 0.7),
    )
    CATALOG.append(
        PartRec(part_id, name, qty_index, x, y, z, rx, ry, rz, notes)
    )
    if export_individual:
        path = os.path.join(OUT_PARTS, f"{part_id}.step")
        try:
            # export local geometry (unplaced) for reuse / BOM
            cq.exporters.export(solid, path)
        except Exception as e:
            print(f"  warn export {part_id}: {e}")


# ---------------------------------------------------------------------------
# Geometry builders (local part coordinates: origin at part natural center/bottom)
# ---------------------------------------------------------------------------

def geom_housing() -> cq.Workplane:
    h = H - FOOT_H
    # local: bottom at z=0, top at z=h; we'll place so world floor of chamber = 0
    outer = cq.Workplane("XY").box(W, D, h, centered=(True, True, False))
    # hollow
    wall = 4.0
    inner = (
        cq.Workplane("XY")
        .workplane(offset=wall)
        .box(W - 2 * wall, D - 2 * wall, h - wall - 2, centered=(True, True, False))
    )
    shell = outer.cut(inner)
    # chamber bore from top, centered XY in housing local (chamber at y offset later)
    # housing world Y=0 is chassis center; chamber at y=0 in world
    cut = (
        cq.Workplane("XY")
        .workplane(offset=h - 85)
        .circle(CHAMBER_ID / 2 + 3)
        .extrude(100)
    )
    shell = shell.cut(cut)
    # front control recess (shallow)
    recess = (
        cq.Workplane("XY")
        .workplane(offset=h - 90)
        .center(0, -D / 2 + 20)
        .box(BEZEL_W + 4, 25, 50, centered=(True, True, False))
    )
    shell = shell.cut(recess)
    try:
        shell = shell.edges("|Z").fillet(2.0)
    except Exception:
        pass
    return shell


def geom_base_tub() -> cq.Workplane:
    return cq.Workplane("XY").box(W - 6, D - 6, 18, centered=(True, True, False))


def geom_bezel() -> cq.Workplane:
    return cq.Workplane("XY").box(BEZEL_W, 8, BEZEL_H, centered=(True, True, False))


def geom_rear_panel() -> cq.Workplane:
    return cq.Workplane("XY").box(W - 16, 5, 140, centered=(True, True, False))


def geom_side(thick: float, depth: float, height: float) -> cq.Workplane:
    return cq.Workplane("XY").box(thick, depth, height, centered=(True, True, False))


def geom_vent_slat() -> cq.Workplane:
    return cq.Workplane("XY").box(90, 2, 5, centered=(True, True, False))


def geom_iec() -> cq.Workplane:
    body = cq.Workplane("XY").box(30, 10, 22, centered=(True, True, False))
    # pins
    for dx in (-6, 0, 6):
        pin = cq.Workplane("XY").workplane(offset=22).center(dx, 0).circle(1.2).extrude(6)
        body = body.union(pin)
    return body


def geom_nameplate() -> cq.Workplane:
    return cq.Workplane("XY").box(70, 1.2, 22, centered=(True, True, False))


def geom_label() -> cq.Workplane:
    return cq.Workplane("XY").box(40, 0.5, 25, centered=(True, True, False))


def geom_tray() -> cq.Workplane:
    return cq.Workplane("XY").box(110, 45, 10, centered=(True, True, False))


def geom_chamber_bowl() -> cq.Workplane:
    outer = cq.Workplane("XY").circle(CHAMBER_ID / 2 + CHAMBER_WALL).extrude(CHAMBER_DEPTH)
    inner = (
        cq.Workplane("XY")
        .workplane(offset=CHAMBER_WALL)
        .circle(CHAMBER_ID / 2)
        .extrude(CHAMBER_DEPTH)
    )
    return outer.cut(inner)


def geom_floor() -> cq.Workplane:
    return cq.Workplane("XY").circle(CHAMBER_ID / 2 - 1).extrude(2.5)


def geom_drive_cone() -> cq.Workplane:
    return (
        cq.Workplane("XY")
        .circle(11.0)
        .workplane(offset=18.0)
        .circle(6.0)
        .loft()
    )


def geom_boot() -> cq.Workplane:
    return cq.Workplane("XY").circle(14).extrude(6)


def geom_gasket_ring() -> cq.Workplane:
    # annular gasket on rim
    return (
        cq.Workplane("XY")
        .circle(CHAMBER_ID / 2 + 3)
        .circle(CHAMBER_ID / 2 - 1)
        .extrude(3)
    )


def geom_sensor() -> cq.Workplane:
    return cq.Workplane("XY").box(10, 8, 6, centered=(True, True, False))


def geom_thermistor() -> cq.Workplane:
    return cq.Workplane("XY").circle(1.5).extrude(14)


def geom_rotor_body() -> cq.Workplane:
    """Fixed-angle 45° pockets for 24 × 1.5 mL tubes."""
    body = cq.Workplane("XY").circle(ROTOR_OD / 2).extrude(ROTOR_H)
    # taper hub for drive cone
    hub = (
        cq.Workplane("XY")
        .workplane(offset=-1)
        .circle(9)
        .workplane(offset=20)
        .circle(6.5)
        .loft()
    )
    body = body.cut(hub)

    tube_r = TUBE_OD / 2 + 0.25
    # Pocket axis: at 45°, tube bottom near R_max
    # Place pocket entrance on top face, angled outward
    for i in range(N_POCKETS):
        ang = 2 * math.pi * i / N_POCKETS
        # radial position of pocket axis at mid-height
        r_axis = 48.0
        x = math.cos(ang) * r_axis
        y = math.sin(ang) * r_axis
        # Build cutter: cylinder then rotate to 45° outward
        # CadQuery: create cylinder along Z, rotate about Y by 45°, then rotate about Z by ang
        cutter = cq.Workplane("XY").circle(tube_r).extrude(POCKET_DEPTH + 15)
        # rotate: tilt outward in XZ then spin to ang
        cutter = cutter.rotate((0, 0, 0), (0, 1, 0), ROTOR_ANGLE)
        cutter = cutter.rotate((0, 0, 0), (0, 0, 1), math.degrees(ang))
        # shift so pocket starts near top surface and goes down/out
        # after 45° rot about Y, extend into body
        ox = math.cos(ang) * 22.0
        oy = math.sin(ang) * 22.0
        oz = ROTOR_H - 8.0
        cutter = cutter.translate((ox, oy, oz))
        try:
            body = body.cut(cutter)
        except Exception:
            # fallback vertical pocket if boolean fails
            c2 = (
                cq.Workplane("XY")
                .workplane(offset=6)
                .center(math.cos(ang) * 50, math.sin(ang) * 50)
                .circle(tube_r)
                .extrude(ROTOR_H)
            )
            body = body.cut(c2)
    try:
        body = body.edges(">Z").fillet(1.0)
    except Exception:
        pass
    return body


def geom_rotor_lid() -> cq.Workplane:
    lid = cq.Workplane("XY").circle(ROTOR_OD / 2 + 2.5).extrude(10)
    # recess underside for seal
    recess = (
        cq.Workplane("XY")
        .workplane(offset=-0.1)
        .circle(ROTOR_OD / 2 - 3)
        .extrude(3)
    )
    lid = lid.cut(recess)
    # center hole for lock
    lid = lid.faces(">Z").workplane().circle(7).cutThruAll()
    return lid


def geom_oring() -> cq.Workplane:
    return (
        cq.Workplane("XY")
        .circle(ROTOR_OD / 2 - 4)
        .circle(ROTOR_OD / 2 - 6)
        .extrude(2)
    )


def geom_lock_knob() -> cq.Workplane:
    stem = cq.Workplane("XY").circle(5).extrude(14)
    knurl = cq.Workplane("XY").workplane(offset=10).circle(12).extrude(10)
    return stem.union(knurl)


def geom_tube() -> cq.Workplane:
    # conical microtube approx
    body = cq.Workplane("XY").circle(TUBE_OD / 2).extrude(TUBE_H * 0.7)
    tip = (
        cq.Workplane("XY")
        .workplane(offset=-8)
        .circle(1.2)
        .workplane(offset=8)
        .circle(TUBE_OD / 2)
        .loft()
    )
    return body.union(tip)


def geom_cap() -> cq.Workplane:
    return cq.Workplane("XY").circle(TUBE_CAP_OD / 2).extrude(TUBE_CAP_H)


def geom_liquid() -> cq.Workplane:
    return cq.Workplane("XY").circle(TUBE_OD / 2 - 0.6).extrude(TUBE_H * 0.35)


def geom_lid_frame() -> cq.Workplane:
    frame = cq.Workplane("XY").box(LID_W, LID_D, LID_T, centered=(True, True, False))
    hole = cq.Workplane("XY").workplane(offset=-1).circle(VIEWPORT_R).extrude(LID_T + 2)
    return frame.cut(hole)


def geom_viewport() -> cq.Workplane:
    return cq.Workplane("XY").circle(VIEWPORT_R - 1).extrude(VIEWPORT_T)


def geom_viewport_gasket() -> cq.Workplane:
    return (
        cq.Workplane("XY")
        .circle(VIEWPORT_R + 2)
        .circle(VIEWPORT_R - 2)
        .extrude(2)
    )


def geom_hinge() -> cq.Workplane:
    return cq.Workplane("XY").box(18, 22, 14, centered=(True, True, False))


def geom_hinge_pin() -> cq.Workplane:
    return cq.Workplane("XY").circle(2.5).extrude(24)


def geom_latch() -> cq.Workplane:
    return cq.Workplane("XY").box(28, 14, 10, centered=(True, True, False))


def geom_handle() -> cq.Workplane:
    return cq.Workplane("XY").box(55, 16, 6, centered=(True, True, False))


def geom_switch() -> cq.Workplane:
    return cq.Workplane("XY").box(12, 8, 10, centered=(True, True, False))


def geom_solenoid() -> cq.Workplane:
    return cq.Workplane("XY").circle(8).extrude(30)


def geom_key() -> cq.Workplane:
    return cq.Workplane("XY").box(12, 3, 10, centered=(True, True, False))


def geom_lcd() -> cq.Workplane:
    return cq.Workplane("XY").box(90, 2, 40, centered=(True, True, False))


def geom_lcd_bezel() -> cq.Workplane:
    return cq.Workplane("XY").box(100, 4, 50, centered=(True, True, False))


def geom_led() -> cq.Workplane:
    return cq.Workplane("XY").circle(1.5).extrude(3)


def geom_motor() -> cq.Workplane:
    return cq.Workplane("XY").circle(35).extrude(70)


def geom_motor_plate() -> cq.Workplane:
    return cq.Workplane("XY").box(90, 90, 6, centered=(True, True, False))


def geom_pcb(w: float, d: float) -> cq.Workplane:
    return cq.Workplane("XY").box(w, d, 1.6, centered=(True, True, False))


def geom_fan() -> cq.Workplane:
    return cq.Workplane("XY").circle(28).extrude(16)


def geom_compressor() -> cq.Workplane:
    return cq.Workplane("XY").box(120, 100, 140, centered=(True, True, False))


def geom_condenser() -> cq.Workplane:
    # tube pack envelope
    return cq.Workplane("XY").box(25, 180, 100, centered=(True, True, False))


def geom_rack() -> cq.Workplane:
    # 4x6 wells
    body = cq.Workplane("XY").box(130, 90, 28, centered=(True, True, False))
    pitch = 20.0
    for row in range(4):
        for col in range(6):
            x = -50 + col * pitch
            y = -30 + row * pitch
            well = (
                cq.Workplane("XY")
                .workplane(offset=8)
                .center(x, y)
                .circle(6.2)
                .extrude(25)
            )
            body = body.cut(well)
    return body


# ---------------------------------------------------------------------------
# Assembly
# ---------------------------------------------------------------------------

def build() -> cq.Assembly:
    os.makedirs(OUT_PARTS, exist_ok=True)
    CATALOG.clear()
    assy = cq.Assembly(name="MICRO_5424R_EXACT")

    C_W = {
        "white": cq.Color(0.92, 0.93, 0.95),
        "dark": cq.Color(0.12, 0.13, 0.15),
        "rubber": cq.Color(0.05, 0.05, 0.05),
        "steel": cq.Color(0.72, 0.74, 0.76),
        "alum": cq.Color(0.45, 0.48, 0.52),
        "gasket": cq.Color(0.08, 0.08, 0.08),
        "smoked": cq.Color(0.1, 0.1, 0.12),
        "pp": cq.Color(0.85, 0.9, 0.95),
        "cap": cq.Color(0.2, 0.45, 0.85),
        "blood": cq.Color(0.5, 0.0, 0.0),
        "pcb": cq.Color(0.1, 0.4, 0.15),
        "zinc": cq.Color(0.78, 0.78, 0.8),
        "lcd": cq.Color(0.05, 0.15, 0.2),
    }

    # Housing local bottom at z=0 of part; place so top is near chamber top
    # chamber floor world z=0; housing bottom = HOUSING_BOTTOM
    hz0 = HOUSING_BOTTOM

    # --- A Enclosure ---
    add(assy, geom_housing(), "A01_MainUpperHousing", 0, 0, hz0, color=C_W["white"],
        notes="Outer shell 290x480xH; chamber bore on top")
    add(assy, geom_base_tub(), "A02_LowerBaseTub", 0, 0, hz0 + 5, color=C_W["dark"],
        notes="Structural base inside shell")
    # Bezel on front, tilted -15° about X
    add(assy, geom_bezel(), "A03_FrontControlBezel", 0, -D / 2 + 12, hz0 + H - 100,
        rx=-15, color=C_W["dark"], notes="Keypad face, 15° tilt")
    add(assy, geom_rear_panel(), "A04_RearPanel", 0, D / 2 - 8, hz0 + 40, color=C_W["dark"],
        notes="Rear service panel")
    add(assy, geom_side(8, D * 0.65, 120), "A05_SideMolding_L", -W / 2 + 8, 20, hz0 + 40,
        color=C_W["white"], notes="Left cosmetic/structure")
    add(assy, geom_side(42, D * 0.45, 130), "A06_SideMolding_R", W / 2 - 28, 50, hz0 + 35,
        color=C_W["white"], notes="Right refrigeration bulk")

    # Feet + foot screws
    half_w, half_d = W / 2 - FOOT_INSET, D / 2 - FOOT_INSET
    foot_xy = [(-half_w, -half_d), (half_w, -half_d), (-half_w, half_d), (half_w, half_d)]
    for i, (fx, fy) in enumerate(foot_xy, 1):
        add(assy, rubber_foot(FOOT_OD, FOOT_H), f"A07_RubberFoot_{i:02d}",
            fx, fy, hz0 - FOOT_H, color=C_W["rubber"], qty_index=i,
            notes=f"Corner foot {i}")
        add(assy, pan_screw(4.0, 12.0), f"A08_FootScrew_M4x12_{i:02d}",
            fx, fy, hz0 - FOOT_H + 2, color=C_W["zinc"], qty_index=i,
            notes="M4×12 pan through foot into base")

    # Housing screws M3×8 — seam pattern
    seam_pts = []
    # front bottom seam
    for x in (-100, -50, 0, 50, 100):
        seam_pts.append((x, -D / 2 + 4, hz0 + 25, 90, 0, 0))
    # rear seam
    for x in (-80, -30, 30, 80):
        seam_pts.append((x, D / 2 - 4, hz0 + 50, 90, 0, 0))
    # left/right mid
    for y in (-80, 0, 80):
        seam_pts.append((-W / 2 + 3, y, hz0 + 70, 0, 90, 0))
        seam_pts.append((W / 2 - 3, y, hz0 + 70, 0, 90, 0))
    for i, (x, y, z, rx, ry, rz) in enumerate(seam_pts[:16], 1):
        add(assy, pan_screw(3.0, 8.0), f"A09_HousingScrew_M3x8_{i:02d}",
            x, y, z, rx=rx, ry=ry, rz=rz, color=C_W["zinc"], qty_index=i,
            notes="Housing seam M3×8")

    add(assy, geom_nameplate(), "A10_Nameplate", -90, -D / 2 + 1, hz0 + 45, color=C_W["alum"],
        notes="Serial / model plate front-left")
    add(assy, geom_label(), "A11_Label_Biohazard", 60, -D / 2 + 1, hz0 + 55, color=cq.Color(0.9, 0.7, 0.1),
        notes="Warning label")
    add(assy, geom_label(), "A12_Label_HighSpeed", 60, -D / 2 + 1, hz0 + 85, color=cq.Color(0.9, 0.2, 0.2),
        notes="High-speed rotor warning")

    for i in range(6):
        add(assy, geom_vent_slat(), f"A13_VentSlat_{i+1:02d}",
            -50, D / 2 - 6, hz0 + 70 + i * 12, color=C_W["dark"], qty_index=i + 1,
            notes="Rear vent grille slat")

    add(assy, geom_iec(), "A14_IEC_Inlet", 85, D / 2 - 5, hz0 + 45, color=C_W["dark"],
        notes="IEC C14 inlet rear")

    # --- C Chamber (floor Z=0) ---
    add(assy, geom_chamber_bowl(), "C01_ChamberBowl", 0, 0, 0, color=C_W["steel"],
        notes="Stainless bowl ID160 depth55")
    add(assy, geom_gasket_ring(), "C02_RimGasket", 0, 0, CHAMBER_DEPTH - 1, color=C_W["gasket"],
        notes="Rim seal under lid")
    add(assy, geom_floor(), "C03_FloorPlate", 0, 0, 0, color=C_W["steel"],
        notes="Chamber floor")
    add(assy, geom_drive_cone(), "C04_DriveCone", 0, 0, 2.5, color=C_W["alum"],
        notes="Motor shaft taper adapter")
    add(assy, geom_boot(), "C05_ShaftBoot", 0, 0, 0, color=C_W["gasket"],
        notes="Neoprene shaft boot")
    add(assy, geom_sensor(), "C06_TachoSensor", CHAMBER_ID / 2 - 12, 0, 6, color=C_W["pcb"],
        notes="Speed / rotor sensor")
    add(assy, geom_thermistor(), "C07_Thermistor", -CHAMBER_ID / 2 + 18, 15, 10, color=C_W["steel"],
        notes="Chamber temperature probe")
    for i, ang_deg in enumerate([45, 135, 225, 315], 1):
        a = math.radians(ang_deg)
        r = CHAMBER_ID / 2 + 10
        add(assy, socket_cap_screw(4.0, 10.0), f"C08_ChamberScrew_M4x10_{i:02d}",
            math.cos(a) * r, math.sin(a) * r, CHAMBER_DEPTH / 2,
            color=C_W["zinc"], qty_index=i, notes="Chamber flange M4×10 SHCS")
    add(assy, cq.Workplane("XY").circle(CHAMBER_ID / 2 + 8).extrude(12),
        "C09_InsulationFoam", 0, 0, -12, color=cq.Color(0.9, 0.9, 0.85),
        notes="Under-floor insulation (R)")

    # --- D Rotor (on drive cone) ---
    rotor_z = 8.0
    add(assy, geom_rotor_body(), "D01_RotorBody", 0, 0, rotor_z, color=C_W["alum"],
        notes="FA-45-24-11 class, 24×45° pockets")
    add(assy, geom_rotor_lid(), "D02_RotorLid", 0, 0, rotor_z + ROTOR_H + 1, color=C_W["alum"],
        notes="Aerosol-tight aluminum lid")
    add(assy, geom_oring(), "D03_RotorLidORing", 0, 0, rotor_z + ROTOR_H + 0.5, color=C_W["gasket"],
        notes="Lid seal O-ring")
    add(assy, geom_lock_knob(), "D04_RotorLockKnob", 0, 0, rotor_z + ROTOR_H + 8, color=C_W["dark"],
        notes="Quick-lock / bayonet knob")

    # Tubes at 45° in pockets
    for i in range(N_POCKETS):
        ang = 2 * math.pi * i / N_POCKETS
        # approximate tube position along pocket axis
        r = 50.0
        tx = math.cos(ang) * r
        ty = math.sin(ang) * r
        tz = rotor_z + 18
        # tilt: rotate about axis perpendicular to radial
        # ry about Y then rz — use ang for Z, 45 for tilt about -radial tangent
        # Simplified: ry = 45*cos, rx = 45*sin
        rx = ROTOR_ANGLE * math.sin(ang)
        ry = -ROTOR_ANGLE * math.cos(ang)
        add(assy, geom_tube(), f"D05_Microtube_{i:02d}",
            tx, ty, tz, rx=rx, ry=ry, color=C_W["pp"], qty_index=i,
            notes=f"1.5mL tube pocket {i}")
        add(assy, geom_cap(), f"D06_MicrotubeCap_{i:02d}",
            tx, ty, tz + 28, rx=rx, ry=ry, color=C_W["cap"], qty_index=i,
            notes=f"Snap cap pocket {i}")
        if i % 2 == 0:
            add(assy, geom_liquid(), f"D07_Liquid_{i:02d}",
                tx, ty, tz + 5, rx=rx, ry=ry, color=C_W["blood"], qty_index=i,
                notes="Sample liquid visual")

    # --- B Lid ---
    lid_z = CHAMBER_DEPTH + 6
    add(assy, geom_lid_frame(), "B01_LidFrame", 0, 0, lid_z, color=C_W["dark"],
        notes="Lid frame over chamber")
    add(assy, geom_viewport(), "B02_Viewport", 0, 0, lid_z + 4, color=C_W["smoked"],
        notes="Smoked PC window")
    add(assy, geom_viewport_gasket(), "B03_ViewportGasket", 0, 0, lid_z + 3, color=C_W["gasket"],
        notes="Viewport seal")
    add(assy, geom_hinge(), "B04_Hinge_L", -45, HINGE_Y, lid_z - 2, color=C_W["dark"],
        notes="Left rear hinge")
    add(assy, geom_hinge(), "B05_Hinge_R", 45, HINGE_Y, lid_z - 2, color=C_W["dark"],
        notes="Right rear hinge")
    for i, hx in enumerate([-45, 45], 1):
        add(assy, geom_hinge_pin(), f"B06_HingePin_{i:02d}",
            hx, HINGE_Y, lid_z + 4, ry=90, color=C_W["zinc"], qty_index=i,
            notes="Hinge pin")
    for i, (hx, hy) in enumerate([(-45, HINGE_Y - 8), (-45, HINGE_Y + 8), (45, HINGE_Y - 8), (45, HINGE_Y + 8)], 1):
        add(assy, pan_screw(3.0, 8.0), f"B07_HingeScrew_M3x8_{i:02d}",
            hx, hy, lid_z, color=C_W["zinc"], qty_index=i, notes="Hinge attach M3×8")
    add(assy, cq.Workplane("XY").circle(6).extrude(40), "B08_SoftCloseDamper",
        80, HINGE_Y + 10, lid_z - 20, rx=90, color=C_W["dark"],
        notes="Lid damper")
    add(assy, geom_latch(), "B09_LatchHook", 0, -LID_D / 2 + 20, lid_z + 2, color=C_W["alum"],
        notes="Front latch hook")
    add(assy, geom_latch(), "B10_LatchStriker", 0, -LID_D / 2 + 5, lid_z - 15, color=C_W["steel"],
        notes="Housing striker")
    add(assy, geom_handle(), "B11_HandleInsert", 0, -LID_D / 2 + 35, lid_z + 10, color=C_W["rubber"],
        notes="Soft-touch open area")
    add(assy, cq.Workplane("XY").box(10, 8, 6, centered=True), "B12_InterlockCam",
        30, -LID_D / 2 + 25, lid_z, color=C_W["dark"], notes="Lid closed cam/magnet")
    add(assy, geom_switch(), "B13_LidMicroswitch", 35, -LID_D / 2 + 10, lid_z - 18, color=C_W["pcb"],
        notes="Lid closed switch")
    add(assy, geom_solenoid(), "B14_LatchSolenoid", -25, -LID_D / 2 + 15, lid_z - 35, rx=90,
        color=C_W["steel"], notes="Electric lid lock")

    # --- E Controls on bezel ---
    # Bezel world pos approx
    bx, by, bz = 0.0, -D / 2 + 10, hz0 + H - 95
    add(assy, cq.Workplane("XY").box(BEZEL_W - 8, 3, BEZEL_H - 8, centered=True),
        "E01_Faceplate", bx, by - 2, bz, rx=-15, color=C_W["dark"], notes="Keypad faceplate")
    add(assy, geom_lcd_bezel(), "E02_LCD_Bezel", bx - 50, by - 4, bz + 8, rx=-15, color=C_W["dark"])
    add(assy, geom_lcd(), "E03_LCD_Display", bx - 50, by - 6, bz + 8, rx=-15, color=C_W["lcd"],
        notes="Active display plane for UI texture")

    keys = [
        ("E04_Key_StartStop", 30, -12),
        ("E05_Key_Open", 50, -12),
        ("E06_Key_Short", 70, -12),
        ("E07_Key_RpmRcf", 30, 8),
        ("E08a_Key_SpeedUp", 50, 8),
        ("E08b_Key_SpeedDown", 70, 8),
        ("E09a_Key_TimeUp", 30, 28),
        ("E09b_Key_TimeDown", 50, 28),
        ("E10a_Key_TempUp", 70, 28),
        ("E10b_Key_TempDown", 90, 28),
        ("E11_Key_FastTemp", 90, 8),
        ("E12_Key_MenuEnter", 90, -12),
        ("E13a_Key_MenuUp", 110, 8),
        ("E13b_Key_MenuDown", 110, 28),
    ]
    for kid, kx, kz in keys:
        add(assy, geom_key(), kid, bx + kx, by - 5, bz + kz, rx=-15, color=C_W["dark"],
            notes="Soft key")

    add(assy, geom_led(), "E14_LED_Run", bx + 10, by - 6, bz + 25, rx=-15, color=cq.Color(0, 0.9, 0.3))
    add(assy, geom_led(), "E15_LED_Fault", bx + 18, by - 6, bz + 25, rx=-15, color=cq.Color(0.9, 0.1, 0.1))
    for i, sx in enumerate([-80, -40, 0, 40, 80, 100], 1):
        add(assy, pan_screw(3.0, 6.0), f"E16_BezelScrew_M3x6_{i:02d}",
            bx + sx, by, bz - 25, rx=-15, color=C_W["zinc"], qty_index=i,
            notes="Bezel mount M3×6")

    add(assy, cq.Workplane("XY").circle(8).extrude(2), "E17_MonitoringGlass",
        55, -30, lid_z + 11, color=C_W["smoked"], notes="Small rotor-stop window")
    add(assy, geom_tray(), "E18_CondensationWaterTray", 0, -D / 2 + 40, hz0 + 2, color=C_W["dark"],
        notes="Front condensate tray")
    add(assy, cq.Workplane("XY").circle(6).extrude(3), "E19_EmergencyRelease",
        0, 20, hz0 - FOOT_H - 2, color=C_W["dark"], notes="Underside manual lid release")
    add(assy, cq.Workplane("XY").box(18, 12, 14, centered=True), "E20_MainsSwitch",
        -70, D / 2 - 8, hz0 + 55, color=C_W["dark"], notes="Power switch rear")
    add(assy, cq.Workplane("XY").circle(7).extrude(12), "E21_FuseHolder",
        -40, D / 2 - 6, hz0 + 55, ry=90, color=C_W["dark"], notes="Fuse holder rear")
    add(assy, cq.Workplane("XY").box(16, 8, 10, centered=True), "E22_ServicePort",
        40, D / 2 - 6, hz0 + 100, color=C_W["dark"], notes="Service USB/update port")

    # --- F Drive bay ---
    add(assy, geom_motor(), "F01_MotorHousing", 0, 0, -75, color=C_W["steel"],
        notes="Brushless motor envelope")
    add(assy, geom_motor_plate(), "F02_MotorPlate", 0, 0, -40, color=C_W["steel"],
        notes="Motor mount plate")
    for i, (mx, my) in enumerate([(-30, -30), (30, -30), (-30, 30), (30, 30)], 1):
        add(assy, socket_cap_screw(5.0, 12.0), f"F03_MotorScrew_M5x12_{i:02d}",
            mx, my, -38, color=C_W["zinc"], qty_index=i, notes="Motor plate M5×12")
    add(assy, geom_pcb(90, 60), "F04_MainPCB", -70, -30, -55, color=C_W["pcb"],
        notes="Main controller PCB")
    add(assy, geom_pcb(70, 50), "F05_PowerPCB", 70, -30, -55, color=C_W["pcb"],
        notes="PSU board")
    add(assy, cq.Workplane("XY").circle(4).extrude(80), "F06_HarnessA",
        -40, 0, -70, ry=90, color=cq.Color(0.1, 0.1, 0.1), notes="Wire bundle A")
    add(assy, cq.Workplane("XY").circle(3.5).extrude(60), "F07_HarnessB",
        40, 20, -65, ry=90, color=cq.Color(0.1, 0.1, 0.1), notes="Wire bundle B")
    add(assy, geom_fan(), "F08_Fan", 95, 70, -45, color=C_W["dark"], notes="Cooling fan")
    add(assy, geom_compressor(), "F09_Compressor", 95, 110, -50, color=C_W["steel"],
        notes="Refrigeration compressor (R)")
    add(assy, geom_condenser(), "F10_Condenser", 130, 40, 20, color=C_W["alum"],
        notes="Condenser pack rear/right")
    add(assy, geom_sensor(), "F11_ImbalanceSensor", 25, -25, -35, color=C_W["pcb"],
        notes="Imbalance detector mount")
    for i, (px, py) in enumerate([(-35, -20), (-10, -20), (15, -20), (40, -20),
                                   (-35, 5), (-10, 5), (15, 5), (40, 5)], 1):
        add(assy, pan_screw(3.0, 6.0), f"F13_PCB_StandoffScrew_M3x6_{i:02d}",
            px - 70, py - 30, -53, color=C_W["zinc"], qty_index=i, notes="PCB standoff screw")

    # --- R Rack (bench left) ---
    rx0, ry0, rz0 = -W / 2 - 90, 0, hz0
    add(assy, geom_rack(), "R01_TubeRackBody", rx0, ry0, rz0, color=cq.Color(0.88, 0.9, 0.92),
        notes="4×6 microtube rack beside unit")
    for i in range(4):
        add(assy, rubber_foot(12, 4), f"R03_RackFoot_{i+1:02d}",
            rx0 + (-40 if i % 2 == 0 else 40),
            ry0 + (-25 if i < 2 else 25),
            rz0 - 4, color=C_W["rubber"], qty_index=i + 1, notes="Rack foot")

    return assy


def write_catalog():
    data = [asdict(p) for p in CATALOG]
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump({"origin": "chamber axis XY=0, floor Z=0, mm", "parts": data}, f, indent=2)
    print(f"Wrote {OUT_JSON} ({len(data)} parts)")

    lines = [
        "# Parts map — MICRO 5424-R exact assembly",
        "",
        "Origin: **chamber axis (X,Y)=(0,0)**, **chamber floor Z=0**, millimetres, +Z up.",
        "",
        f"**Total instances:** {len(CATALOG)}",
        "",
        "| Part ID | X | Y | Z | Rx° | Ry° | Rz° | Notes |",
        "|---------|---|---|---|-----|-----|-----|-------|",
    ]
    for p in CATALOG:
        lines.append(
            f"| `{p.id}` | {p.x:.1f} | {p.y:.1f} | {p.z:.1f} | "
            f"{p.rx_deg:.0f} | {p.ry_deg:.0f} | {p.rz_deg:.0f} | {p.notes} |"
        )
    lines.extend([
        "",
        "## Screw summary",
        "",
        "| Family | Spec | Count | Where |",
        "|--------|------|-------|-------|",
        "| A08 | M4×12 pan | 4 | Through each rubber foot into base |",
        "| A09 | M3×8 pan | 16 | Housing seams (front/rear/sides) |",
        "| B07 | M3×8 pan | 4 | Lid hinges to frame/housing |",
        "| C08 | M4×10 SHCS | 4 | Chamber flange at 45°/135°/225°/315° |",
        "| E16 | M3×6 pan | 6 | Control bezel to housing |",
        "| F03 | M5×12 SHCS | 4 | Motor plate corners |",
        "| F13 | M3×6 pan | 8 | Main PCB standoffs |",
        "",
        "## Major subassemblies (Z stack)",
        "",
        "1. Feet / base (Z ≈ housing bottom − 8)",
        "2. Drive bay + motor (Z < 0)",
        "3. Chamber floor Z=0, bowl to Z=55",
        "4. Rotor on cone (Z ≈ 8…55)",
        "5. Lid (Z ≈ 61+)",
        "6. Housing envelope around all",
        "7. Rack parked at X ≈ −235 (left of unit)",
        "",
        "Individual STEP files: `export/step/parts/<PartID>.step`",
        "Full assembly: `export/step/MICRO_5424R_EXACT.step`",
        "",
    ])
    with open(OUT_MAP, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Wrote {OUT_MAP}")


def main():
    print("Building exact assembly…")
    assy = build()
    os.makedirs(OUT_STEP, exist_ok=True)
    out = os.path.join(OUT_STEP, "MICRO_5424R_EXACT.step")
    print(f"Saving assembly STEP ({len(CATALOG)} catalog entries)…")
    assy.save(out, exportType="STEP")
    print(f"Wrote {out}")
    write_catalog()
    # Also export D_rotor refined as compound for quick open
    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
