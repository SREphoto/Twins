#!/usr/bin/env python3
"""
MICRO 5424-R class assembly builder (Blender headless) — LEGACY Stage 1.

CAD-first dimensions from docs/dimensions.md (mm). Each BOM part is a
separate object with correct name. Origin: chamber axis XY=0, chamber floor Z=0.

Not used by the live viewer. See docs/PIPELINE.md.

Run:
  Blender --background --python cad/_legacy/build_assembly.py

Exports (history only):
  export/_history/glb/centrifuge_assembly.glb
  export/_history/stl/*.stl  (per major group)
  cad/_legacy/blends/centrifuge_assembly.blend
"""

from __future__ import annotations

import math
import os
import sys

# ---------------------------------------------------------------------------
# Paths (package root = centrifuge_twin/)
# ---------------------------------------------------------------------------
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXPORT_GLB = os.path.join(ROOT, "export", "_history", "glb")
EXPORT_STL = os.path.join(ROOT, "export", "_history", "stl")
EXPORT_BLEND = os.path.join(ROOT, "cad", "_legacy", "blends", "centrifuge_assembly.blend")

# ---------------------------------------------------------------------------
# Dimensions (mm) — match docs/dimensions.md
# ---------------------------------------------------------------------------
W, D, H = 290.0, 480.0, 260.0  # enclosure envelope
# Chamber floor at Z=0; enclosure sits so top is ~H above base feet
FOOT_H = 8.0
BASE_H = 40.0
# Place chamber center in upper-front of footprint (refrigeration bulk rear/right)
# Chassis center XY at 0; chamber axis at origin per docs.
CHAMBER_ID = 160.0
CHAMBER_DEPTH = 55.0
CHAMBER_WALL = 3.0
DRIVE_CONE_H = 18.0
DRIVE_CONE_BASE_R = 11.0
DRIVE_CONE_TIP_R = 6.0

ROTOR_OD = 140.0
ROTOR_H = 45.0
ROTOR_ANGLE_DEG = 45.0
ROTOR_POCKETS = 24
TUBE_OD = 10.8
TUBE_H = 39.0
TUBE_CAP_H = 8.0
TUBE_CAP_OD = 13.0
R_MAX = 84.0  # mm to tube bottom center approx

LID_W, LID_D = 280.0, 280.0
LID_T = 12.0
VIEWPORT_T = 3.0
HINGE_Y = -120.0

BEZEL_W, BEZEL_H, BEZEL_T = 270.0, 70.0, 8.0
LCD_W, LCD_H = 90.0, 40.0

RACK_COLS, RACK_ROWS = 6, 4
RACK_PITCH = 20.0


def ensure_bpy():
    try:
        import bpy  # noqa: F401
        return True
    except ImportError:
        return False


def clear_scene(bpy):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.collections):
        for b in list(block):
            block.remove(b)


def collection(bpy, name: str):
    if name in bpy.data.collections:
        return bpy.data.collections[name]
    col = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(col)
    return col


def link(obj, col):
    # unlink from scene root if present
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    col.objects.link(obj)


def mat(bpy, name, color, rough=0.4, metal=0.0, alpha=1.0, emission=None):
    if name in bpy.data.materials:
        m = bpy.data.materials[name]
    else:
        m = bpy.data.materials.new(name)
        m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*color[:3], 1.0)
        bsdf.inputs["Roughness"].default_value = rough
        bsdf.inputs["Metallic"].default_value = metal
        if "Alpha" in bsdf.inputs:
            bsdf.inputs["Alpha"].default_value = alpha
        if alpha < 1.0:
            m.blend_method = "HASHED"
        if emission is not None:
            if "Emission Color" in bsdf.inputs:
                bsdf.inputs["Emission Color"].default_value = (*emission[:3], 1.0)
            if "Emission Strength" in bsdf.inputs:
                bsdf.inputs["Emission Strength"].default_value = emission[3] if len(emission) > 3 else 2.0
    return m


def assign(obj, material):
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)


def box(bpy, name, size, loc, col, material):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    assign(obj, material)
    link(obj, col)
    return obj


def cylinder(bpy, name, radius, depth, loc, col, material, vertices=48):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius, depth=depth, location=loc, vertices=vertices
    )
    obj = bpy.context.active_object
    obj.name = name
    assign(obj, material)
    link(obj, col)
    return obj


def cone(bpy, name, r1, r2, depth, loc, col, material, vertices=32):
    bpy.ops.mesh.primitive_cone_add(
        radius1=r1, radius2=r2, depth=depth, location=loc, vertices=vertices
    )
    obj = bpy.context.active_object
    obj.name = name
    assign(obj, material)
    link(obj, col)
    return obj


def torus(bpy, name, major, minor, loc, col, material):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major, minor_radius=minor, location=loc
    )
    obj = bpy.context.active_object
    obj.name = name
    assign(obj, material)
    link(obj, col)
    return obj


def boolean_difference(bpy, obj, cutter, name_cutter=None):
    mod = obj.modifiers.new(name="Bool", type="BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = cutter
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cutter, do_unlink=True)


def bevel(obj, width=1.0, segments=3):
    mod = obj.modifiers.new(name="Bevel", type="BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"


# ---------------------------------------------------------------------------
# Builders
# ---------------------------------------------------------------------------

def build_materials(bpy):
    return {
        "housing": mat(bpy, "M_PowderCoatWhite", (0.92, 0.93, 0.95), rough=0.35),
        "base": mat(bpy, "M_DarkPlastic", (0.12, 0.13, 0.15), rough=0.45),
        "rubber": mat(bpy, "M_RubberBlack", (0.02, 0.02, 0.02), rough=0.85),
        "steel": mat(bpy, "M_Stainless", (0.7, 0.72, 0.74), rough=0.25, metal=0.9),
        "aluminum": mat(bpy, "M_AnodizedAl", (0.35, 0.38, 0.42), rough=0.3, metal=0.85),
        "gasket": mat(bpy, "M_Gasket", (0.05, 0.05, 0.05), rough=0.9),
        "smoked": mat(bpy, "M_SmokedPC", (0.05, 0.05, 0.08), rough=0.1, alpha=0.35),
        "console": mat(bpy, "M_Console", (0.15, 0.16, 0.18), rough=0.4),
        "lcd": mat(bpy, "M_LCD", (0.02, 0.05, 0.08), rough=0.2, emission=(0.0, 0.6, 0.7, 1.5)),
        "button": mat(bpy, "M_SoftKey", (0.2, 0.22, 0.25), rough=0.5),
        "pp": mat(bpy, "M_PP_Clear", (0.85, 0.9, 0.95), rough=0.15, alpha=0.45),
        "cap": mat(bpy, "M_TubeCap", (0.15, 0.4, 0.85), rough=0.4),
        "blood": mat(bpy, "M_SampleBlood", (0.45, 0.0, 0.0), rough=0.5),
        "plasma": mat(bpy, "M_SamplePlasma", (1.0, 0.95, 0.75), rough=0.3),
        "rack": mat(bpy, "M_Rack", (0.85, 0.88, 0.9), rough=0.4),
        "pcb": mat(bpy, "M_PCB", (0.1, 0.35, 0.15), rough=0.5),
        "fastener": mat(bpy, "M_SteelZinc", (0.75, 0.75, 0.78), rough=0.35, metal=0.8),
    }


def build_enclosure(bpy, mats):
    col = collection(bpy, "A_Enclosure")
    # Lower base tub — bottom of unit at Z = -BASE_H - small, chamber floor Z=0
    # Chamber sits in housing; housing top near Z = H - FOOT_H relative to bench...
    # Docs: chamber floor Z=0. Housing extends below chamber into motor bay.
    base_z = -BASE_H / 2 - 20  # motor bay below chamber
    # Full outer shell as hollow-ish box
    shell_h = H - FOOT_H
    shell_z = shell_h / 2 - 30  # shift so chamber opening near top
    # Simpler: base at z=-30 (bottom), top at z=230 → height 260 from feet
    # Feet bottom at z = -30 - FOOT_H
    bottom_z = -30.0
    housing = box(
        bpy,
        "A01_MainUpperHousing",
        (W, D, shell_h),
        (0, 0, bottom_z + shell_h / 2),
        col,
        mats["housing"],
    )
    bevel(housing, width=4.0, segments=3)

    # Chamber cutout (vertical cylinder through top)
    cutter = bpy.ops.mesh.primitive_cylinder_add(
        radius=CHAMBER_ID / 2 + 2,
        depth=shell_h + 20,
        location=(0, 40, bottom_z + shell_h / 2 + 20),
        vertices=64,
    )
    cutter_obj = bpy.context.active_object
    cutter_obj.name = "_cut_chamber"
    boolean_difference(bpy, housing, cutter_obj)

    # Lower base plate
    base = box(
        bpy,
        "A02_LowerBaseTub",
        (W - 4, D - 4, BASE_H * 0.5),
        (0, 0, bottom_z + 10),
        col,
        mats["base"],
    )

    # Front control bezel (tilted slightly — approximate with box on front face)
    bezel = box(
        bpy,
        "A03_FrontControlBezel",
        (BEZEL_W, BEZEL_T, BEZEL_H),
        (0, -D / 2 + BEZEL_T / 2 + 2, bottom_z + shell_h - 50),
        col,
        mats["console"],
    )
    bezel.rotation_euler[0] = math.radians(-15)

    # Rear panel
    rear = box(
        bpy,
        "A04_RearPanel",
        (W - 10, 6, shell_h * 0.7),
        (0, D / 2 - 8, bottom_z + shell_h * 0.4),
        col,
        mats["base"],
    )

    # Side moldings (R bulk for refrigeration)
    box(
        bpy,
        "A05_SideMolding_L",
        (8, D * 0.7, shell_h * 0.6),
        (-W / 2 + 6, 20, bottom_z + shell_h * 0.4),
        col,
        mats["housing"],
    )
    box(
        bpy,
        "A06_SideMolding_R",
        (40, D * 0.5, shell_h * 0.55),
        (W / 2 - 25, 60, bottom_z + shell_h * 0.35),
        col,
        mats["housing"],
    )

    # Feet + screws
    foot_inset = 25.0
    half_w, half_d = W / 2 - foot_inset, D / 2 - foot_inset
    foot_positions = [
        (-half_w, -half_d),
        (half_w, -half_d),
        (-half_w, half_d),
        (half_w, half_d),
    ]
    foot_z = bottom_z - FOOT_H / 2
    for i, (fx, fy) in enumerate(foot_positions, 1):
        cylinder(
            bpy,
            f"A07_RubberFoot_{i:02d}",
            11.0,
            FOOT_H,
            (fx, fy, foot_z),
            col,
            mats["rubber"],
            vertices=24,
        )
        # M4x12 pan screw visual
        cylinder(
            bpy,
            f"A08_FootScrew_{i:02d}",
            2.0,
            12.0,
            (fx, fy, foot_z + 2),
            col,
            mats["fastener"],
            vertices=12,
        )

    # Housing screws along front seam (sample set)
    for i, x in enumerate([-100, -50, 0, 50, 100], 1):
        cylinder(
            bpy,
            f"A09_HousingScrew_{i:02d}",
            1.5,
            8.0,
            (x, -D / 2 + 3, bottom_z + 30),
            col,
            mats["fastener"],
            vertices=10,
        )
        bpy.context.active_object.rotation_euler[0] = math.radians(90)

    # IEC inlet
    box(
        bpy,
        "A14_IEC_Inlet",
        (30, 8, 22),
        (80, D / 2 - 4, bottom_z + 50),
        col,
        mats["base"],
    )

    # Vent grille rear (slats)
    for i in range(6):
        box(
            bpy,
            f"A13_VentSlat_{i+1:02d}",
            (80, 2, 4),
            (-40, D / 2 - 5, bottom_z + 80 + i * 10),
            col,
            mats["base"],
        )

    # Nameplate
    box(
        bpy,
        "A10_Nameplate",
        (60, 1, 20),
        (-80, -D / 2 + 1, bottom_z + 40),
        col,
        mats["aluminum"],
    )

    # Condensation tray
    box(
        bpy,
        "E18_CondensationWaterTray",
        (100, 40, 8),
        (0, -D / 2 + 30, bottom_z + 4),
        col,
        mats["base"],
    )

    return col


def build_chamber(bpy, mats):
    col = collection(bpy, "C_Chamber")
    # Bowl: outer cylinder minus inner (approximate with single wall cylinder + floor)
    bowl_z = CHAMBER_DEPTH / 2
    outer = cylinder(
        bpy,
        "C01_ChamberBowl",
        CHAMBER_ID / 2 + CHAMBER_WALL,
        CHAMBER_DEPTH,
        (0, 40, bowl_z),
        col,
        mats["steel"],
        vertices=64,
    )
    # hollow
    cutter = bpy.ops.mesh.primitive_cylinder_add(
        radius=CHAMBER_ID / 2,
        depth=CHAMBER_DEPTH - CHAMBER_WALL,
        location=(0, 40, bowl_z + CHAMBER_WALL / 2),
        vertices=64,
    )
    cutter_obj = bpy.context.active_object
    boolean_difference(bpy, outer, cutter_obj)

    # Rim gasket
    torus(
        bpy,
        "C02_RimGasket",
        CHAMBER_ID / 2 + 1,
        2.0,
        (0, 40, CHAMBER_DEPTH),
        col,
        mats["gasket"],
    )

    # Floor plate
    cylinder(
        bpy,
        "C03_FloorPlate",
        CHAMBER_ID / 2 - 2,
        3.0,
        (0, 40, 1.5),
        col,
        mats["steel"],
        vertices=48,
    )

    # Drive cone
    cone(
        bpy,
        "C04_DriveCone",
        DRIVE_CONE_BASE_R,
        DRIVE_CONE_TIP_R,
        DRIVE_CONE_H,
        (0, 40, DRIVE_CONE_H / 2 + 3),
        col,
        mats["aluminum"],
    )

    # Shaft boot
    cylinder(
        bpy,
        "C05_ShaftBoot",
        14.0,
        6.0,
        (0, 40, 3),
        col,
        mats["gasket"],
        vertices=24,
    )

    # Sensors (envelopes)
    box(
        bpy,
        "C06_TachoSensor",
        (8, 8, 6),
        (CHAMBER_ID / 2 - 10, 40, 8),
        col,
        mats["pcb"],
    )
    cylinder(
        bpy,
        "C07_Thermistor",
        2.0,
        12.0,
        (-CHAMBER_ID / 2 + 15, 40, 20),
        col,
        mats["steel"],
        vertices=12,
    )

    for i, ang in enumerate([0, 90, 180, 270], 1):
        rad = math.radians(ang)
        x = math.cos(rad) * (CHAMBER_ID / 2 + 8)
        y = 40 + math.sin(rad) * (CHAMBER_ID / 2 + 8)
        cylinder(
            bpy,
            f"C08_ChamberScrew_{i:02d}",
            2.0,
            10.0,
            (x, y, CHAMBER_DEPTH / 2),
            col,
            mats["fastener"],
            vertices=10,
        )

    return col


def build_rotor(bpy, mats, n_tubes=24, fill_material="blood"):
    col = collection(bpy, "D_Rotor")
    cy = 40.0  # chamber Y
    rotor_z = 8.0 + ROTOR_H / 2

    rotor = cylinder(
        bpy,
        "D01_RotorBody",
        ROTOR_OD / 2,
        ROTOR_H,
        (0, cy, rotor_z),
        col,
        mats["aluminum"],
        vertices=64,
    )

    # Pockets as boolean cylinders at 45° around circle
    pocket_r = R_MAX * 0.75  # radial position of tube centerline mid
    for i in range(ROTOR_POCKETS):
        ang = 2 * math.pi * i / ROTOR_POCKETS
        # fixed-angle: tubes tilt outward
        px = math.cos(ang) * pocket_r
        py = cy + math.sin(ang) * pocket_r
        pz = rotor_z + 5
        bpy.ops.mesh.primitive_cylinder_add(
            radius=TUBE_OD / 2 + 0.3,
            depth=ROTOR_H * 0.85,
            location=(px, py, pz),
            vertices=16,
        )
        cut = bpy.context.active_object
        # tilt 45° outward
        cut.rotation_euler[1] = math.radians(ROTOR_ANGLE_DEG) * math.cos(ang)
        cut.rotation_euler[0] = math.radians(ROTOR_ANGLE_DEG) * math.sin(ang)
        boolean_difference(bpy, rotor, cut)

    # Rotor lid
    cylinder(
        bpy,
        "D02_RotorLid",
        ROTOR_OD / 2 + 2,
        8.0,
        (0, cy, rotor_z + ROTOR_H / 2 + 5),
        col,
        mats["aluminum"],
        vertices=48,
    )
    torus(
        bpy,
        "D03_RotorLidORing",
        ROTOR_OD / 2 - 2,
        1.0,
        (0, cy, rotor_z + ROTOR_H / 2 + 2),
        col,
        mats["gasket"],
    )
    cylinder(
        bpy,
        "D04_RotorLockKnob",
        10.0,
        12.0,
        (0, cy, rotor_z + ROTOR_H / 2 + 14),
        col,
        mats["console"],
        vertices=24,
    )

    # Tubes in pockets (first 8 loaded with sample for demo; rest empty-looking)
    for i in range(ROTOR_POCKETS):
        ang = 2 * math.pi * i / ROTOR_POCKETS
        px = math.cos(ang) * pocket_r
        py = cy + math.sin(ang) * pocket_r
        pz = rotor_z + 2
        body = cylinder(
            bpy,
            f"D05_Microtube_{i:02d}",
            TUBE_OD / 2,
            TUBE_H,
            (px, py, pz + TUBE_H / 2 - 5),
            col,
            mats["pp"],
            vertices=16,
        )
        body.rotation_euler[1] = math.radians(ROTOR_ANGLE_DEG) * math.cos(ang)
        body.rotation_euler[0] = math.radians(ROTOR_ANGLE_DEG) * math.sin(ang)

        cap = cylinder(
            bpy,
            f"D06_MicrotubeCap_{i:02d}",
            TUBE_CAP_OD / 2,
            TUBE_CAP_H,
            (px, py, pz + TUBE_H - 2),
            col,
            mats["cap"],
            vertices=16,
        )
        cap.rotation_euler[1] = body.rotation_euler[1]
        cap.rotation_euler[0] = body.rotation_euler[0]

        # Sample liquid (lower half) — demo blood-like for even slots
        if i % 2 == 0:
            liq = cylinder(
                bpy,
                f"D07_Liquid_{i:02d}",
                TUBE_OD / 2 - 0.5,
                TUBE_H * 0.4,
                (px, py, pz + TUBE_H * 0.15),
                col,
                mats["blood"],
                vertices=12,
            )
            liq.rotation_euler[1] = body.rotation_euler[1]
            liq.rotation_euler[0] = body.rotation_euler[0]

    return col


def build_lid(bpy, mats):
    col = collection(bpy, "B_Lid")
    cy = 40.0
    lid_z = CHAMBER_DEPTH + 8 + LID_T / 2

    frame = box(
        bpy,
        "B01_LidFrame",
        (LID_W, LID_D, LID_T),
        (0, cy, lid_z),
        col,
        mats["console"],
    )
    bevel(frame, width=2.0, segments=2)

    # Viewport cutout + smoked glass
    bpy.ops.mesh.primitive_cylinder_add(
        radius=70,
        depth=LID_T + 5,
        location=(0, cy, lid_z),
        vertices=48,
    )
    cut = bpy.context.active_object
    boolean_difference(bpy, frame, cut)

    cylinder(
        bpy,
        "B02_Viewport",
        68,
        VIEWPORT_T,
        (0, cy, lid_z),
        col,
        mats["smoked"],
        vertices=48,
    )

    # Hinges at rear of lid
    for name, x in (("B04_Hinge_L", -40), ("B05_Hinge_R", 40)):
        box(
            bpy,
            name,
            (16, 20, 14),
            (x, cy + LID_D / 2 - 20, lid_z - 4),
            col,
            mats["base"],
        )
        cylinder(
            bpy,
            name.replace("Hinge", "HingePin").replace("B04", "B06").replace("B05", "B06"),
            2.5,
            22,
            (x, cy + LID_D / 2 - 20, lid_z - 4),
            col,
            mats["fastener"],
            vertices=12,
        )
        bpy.context.active_object.rotation_euler[1] = math.radians(90)

    # Latch front
    box(
        bpy,
        "B09_LatchHook",
        (30, 12, 10),
        (0, cy - LID_D / 2 + 15, lid_z - 2),
        col,
        mats["aluminum"],
    )
    box(
        bpy,
        "B11_HandleInsert",
        (50, 15, 6),
        (0, cy - LID_D / 2 + 25, lid_z + 4),
        col,
        mats["rubber"],
    )

    # Monitoring glass small
    cylinder(
        bpy,
        "E17_MonitoringGlass",
        8,
        2,
        (50, cy - 40, lid_z + 5),
        col,
        mats["smoked"],
        vertices=16,
    )

    return col


def build_controls(bpy, mats):
    col = collection(bpy, "E_Controls")
    # Place on front bezel region
    z = 180.0
    y = -D / 2 + 15

    box(
        bpy,
        "E01_Faceplate",
        (BEZEL_W - 10, 4, BEZEL_H - 10),
        (0, y, z),
        col,
        mats["console"],
    )
    box(
        bpy,
        "E02_LCD_Bezel",
        (LCD_W + 6, 3, LCD_H + 6),
        (-40, y - 2, z + 5),
        col,
        mats["base"],
    )
    lcd = box(
        bpy,
        "E03_LCD_Display",
        (LCD_W, 1.5, LCD_H),
        (-40, y - 4, z + 5),
        col,
        mats["lcd"],
    )

    keys = [
        ("E04_Key_StartStop", 40, -15),
        ("E05_Key_Open", 60, -15),
        ("E06_Key_Short", 80, -15),
        ("E07_Key_RpmRcf", 40, 5),
        ("E08a_Key_SpeedUp", 60, 5),
        ("E08b_Key_SpeedDown", 80, 5),
        ("E09a_Key_TimeUp", 40, 25),
        ("E09b_Key_TimeDown", 60, 25),
        ("E10a_Key_TempUp", 80, 25),
        ("E10b_Key_TempDown", 100, 25),
        ("E11_Key_FastTemp", 100, 5),
        ("E12_Key_MenuEnter", 100, -15),
    ]
    for name, kx, kz in keys:
        box(bpy, name, (12, 3, 10), (kx, y - 3, z + kz), col, mats["button"])

    cylinder(bpy, "E14_LED_Run", 1.5, 2, (20, y - 5, z + 25), col, mats["lcd"], 12)
    cylinder(bpy, "E15_LED_Fault", 1.5, 2, (28, y - 5, z + 25), col, mats["blood"], 12)

    return col


def build_rack(bpy, mats):
    col = collection(bpy, "R_Rack")
    # Place to the left of centrifuge
    ox, oy, oz = -W / 2 - 80, 0, -20
    rack_w = RACK_COLS * RACK_PITCH + 10
    rack_d = RACK_ROWS * RACK_PITCH + 10
    box(
        bpy,
        "R01_TubeRackBody",
        (rack_w, rack_d, 25),
        (ox, oy, oz + 12),
        col,
        mats["rack"],
    )

    n = 0
    for row in range(RACK_ROWS):
        for col_i in range(RACK_COLS):
            n += 1
            x = ox - rack_w / 2 + 15 + col_i * RACK_PITCH
            y = oy - rack_d / 2 + 15 + row * RACK_PITCH
            # empty well
            cylinder(
                bpy,
                f"R02_Well_{n:02d}",
                6.0,
                18,
                (x, y, oz + 15),
                col,
                mats["base"],
                vertices=12,
            )
            # parked empty tube
            cylinder(
                bpy,
                f"R04_RackTube_{n:02d}",
                TUBE_OD / 2,
                TUBE_H * 0.7,
                (x, y, oz + 28),
                col,
                mats["pp"],
                vertices=12,
            )
            cylinder(
                bpy,
                f"R04_RackCap_{n:02d}",
                TUBE_CAP_OD / 2 * 0.9,
                5,
                (x, y, oz + 28 + TUBE_H * 0.35),
                col,
                mats["cap"],
                vertices=12,
            )

    return col


def build_drive_bay(bpy, mats):
    col = collection(bpy, "F_Drive")
    box(
        bpy,
        "F01_MotorHousing",
        (70, 70, 80),
        (0, 40, -50),
        col,
        mats["steel"],
    )
    box(
        bpy,
        "F04_MainPCB",
        (80, 50, 2),
        (-60, -20, -40),
        col,
        mats["pcb"],
    )
    box(
        bpy,
        "F05_PowerPCB",
        (60, 40, 2),
        (60, -20, -40),
        col,
        mats["pcb"],
    )
    cylinder(
        bpy,
        "F08_Fan",
        25,
        15,
        (90, 80, -30),
        col,
        mats["base"],
        vertices=24,
    )
    box(
        bpy,
        "F09_Compressor",
        (100, 80, 90),
        (90, 100, -20),
        col,
        mats["steel"],
    )
    box(
        bpy,
        "F10_Condenser",
        (20, 120, 80),
        (120, 60, 20),
        col,
        mats["aluminum"],
    )
    return col


def export_all(bpy):
    os.makedirs(EXPORT_GLB, exist_ok=True)
    os.makedirs(EXPORT_STL, exist_ok=True)

    # Select all mesh objects
    bpy.ops.object.select_all(action="DESELECT")
    for obj in bpy.data.objects:
        if obj.type == "MESH" and not obj.name.startswith("_"):
            obj.select_set(True)

    glb_path = os.path.join(EXPORT_GLB, "centrifuge_assembly.glb")
    bpy.ops.export_scene.gltf(
        filepath=glb_path,
        export_format="GLB",
        use_selection=False,
        export_apply=True,
    )
    print(f"Wrote {glb_path}")

    # Per-collection STL
    for col in bpy.data.collections:
        if col.name.startswith(("A_", "B_", "C_", "D_", "E_", "F_", "R_")):
            bpy.ops.object.select_all(action="DESELECT")
            for obj in col.objects:
                if obj.type == "MESH":
                    obj.select_set(True)
            if not any(o.select_get() for o in bpy.data.objects):
                continue
            stl_path = os.path.join(EXPORT_STL, f"{col.name}.stl")
            try:
                bpy.ops.wm.stl_export(filepath=stl_path, export_selected_objects=True)
            except Exception:
                try:
                    bpy.ops.export_mesh.stl(filepath=stl_path, use_selection=True)
                except Exception as e:
                    print(f"STL export failed for {col.name}: {e}")
                    continue
            print(f"Wrote {stl_path}")

    os.makedirs(os.path.dirname(EXPORT_BLEND), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=EXPORT_BLEND)
    print(f"Wrote {EXPORT_BLEND}")


def main():
    if not ensure_bpy():
        print("This script must be run inside Blender:")
        print(
            "  /Applications/Blender.app/Contents/MacOS/Blender --background --python cad/build_assembly.py"
        )
        return 1

    import bpy

    # Unit scale: Blender default meters — we work in mm numerically but scale scene to mm
    bpy.context.scene.unit_settings.system = "METRIC"
    bpy.context.scene.unit_settings.scale_length = 0.001  # 1 Blender unit = 1 mm display

    clear_scene(bpy)
    mats = build_materials(bpy)

    print("Building A_Enclosure...")
    build_enclosure(bpy, mats)
    print("Building C_Chamber...")
    build_chamber(bpy, mats)
    print("Building D_Rotor...")
    build_rotor(bpy, mats)
    print("Building B_Lid...")
    build_lid(bpy, mats)
    print("Building E_Controls...")
    build_controls(bpy, mats)
    print("Building R_Rack...")
    build_rack(bpy, mats)
    print("Building F_Drive...")
    build_drive_bay(bpy, mats)

    # Camera + light for optional render
    bpy.ops.object.camera_add(location=(400, -400, 300))
    cam = bpy.context.active_object
    cam.name = "Cam_Product"
    cam.rotation_euler = (math.radians(60), 0, math.radians(45))
    bpy.context.scene.camera = cam
    bpy.ops.object.light_add(type="AREA", location=(200, -200, 400))
    light = bpy.context.active_object
    light.data.energy = 500000  # mm-scale scene needs high energy
    light.data.size = 300

    n_mesh = sum(1 for o in bpy.data.objects if o.type == "MESH")
    print(f"Mesh objects: {n_mesh}")
    export_all(bpy)
    print("DONE")
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
