"""
SREdesigns — KNF N820-G Vacuum Pump (Gold Tier)
==================================================
Complete 35-part procedural model built bottom-up following the
VACUUM_PUMP_MANUFACTURING_PLAN.md assembly sequence.

Part Groups:
  A: Pump Head Assembly (8 parts × 2 heads)
  B: Drive Mechanism (5 parts)
  C: Motor & Power (4 parts)
  D: Housing & Enclosure (7 parts)
  E: Front Panel & Controls (6 parts)
  F: Exhaust & Silencer (3 parts)
  G: Seals (visible O-rings)
  H: Hardware (visible fasteners)

Run via:
  blender --background --python scripts/creation/create_vacuum_pump_gold.py
"""
import bpy, bmesh, math, os, sys, shutil

# Add libraries path
script_dir = os.path.dirname(os.path.abspath(__file__))
samslab_dir = os.path.dirname(os.path.dirname(script_dir))
lib_dir = os.path.join(samslab_dir, "scripts", "libraries")
if lib_dir not in sys.path:
    sys.path.append(lib_dir)

from lib_materials_v2 import LabMaterialsV2
import lib_geometry_v2 as geom

S = geom.S
def s(mm): return mm * S


# ══════════════════════════════════════════════════════════════════════════
# 1. CLEANUP
# ══════════════════════════════════════════════════════════════════════════
geom.cleanup()


# ══════════════════════════════════════════════════════════════════════════
# 2. MATERIALS
# ══════════════════════════════════════════════════════════════════════════
M = LabMaterialsV2.create_all(tier='gold')
M['knf_dark'] = M['dark']  # KNF charcoal housing color

# Custom pump-specific materials
M['valve_rubber'] = LabMaterialsV2.mat(
    "ValveRubber", (0.85, 0.25, 0.1), 0, 0.6)
M['motor_copper'] = LabMaterialsV2.mat(
    "CopperCoils", (0.8, 0.4, 0.2), 0.9, 0.25)
M['ptfe'] = LabMaterialsV2.mat(
    "PTFE_White", (0.94, 0.94, 0.93), 0, 0.35, clearcoat=0.15)
M['pvdf'] = LabMaterialsV2.mat(
    "PVDF_Gray", (0.65, 0.65, 0.68), 0, 0.4)
M['ffpm'] = LabMaterialsV2.mat(
    "FFPM_Seal", (0.05, 0.05, 0.06), 0, 0.75)


# ══════════════════════════════════════════════════════════════════════════
# 3. ROOT & DIMENSIONAL CONSTANTS
# ══════════════════════════════════════════════════════════════════════════
root = geom.create_root("Vacuum_Pump")

# Housing shape ── squircle cross-section, Y-scaled for depth
SQ_R    = 80.0      # squircle radius  → 160 mm width  (target 163)
Y_SCALE = 1.5       # Y scale factor   → 240 mm depth  (target 259)
SQ_EXP  = 3.2       # exponent (rounded rectangle)
HW      = SQ_R                # half-width  (X) = 80 mm
HD      = SQ_R * Y_SCALE      # half-depth  (Y) = 120 mm

# Vertical stack (Z axis, mm from ground) ─────────────────────────────
# NOTE: All geom.cyl() and squircle_cyl() create objects centered on Z.
#   So Z_position = bottom_of_part + (height/2)
FOOT_H    = 15.0                        # D4  rubber foot height
BASE_Z    = FOOT_H                      # 15  bottom edge of lower housing
LOW_H     = 130.0                       # D1  lower housing height
LOW_TOP   = BASE_Z + LOW_H             # 145 housing split line (bottom edge)
UP_H      = 60.0                        # D2  upper housing height
UP_TOP    = LOW_TOP + UP_H             # 205 top of upper housing (bottom edge)
HANDLE_H  = 15.0                        # D3  handle height

# Motor & shaft (horizontal along Y) ─────────────────────────────────
MOT_Z     = BASE_Z + LOW_H * 0.47      # ~76 mm  motor centreline
MOT_R     = 42.0                        # stator outer radius
MOT_L     = 90.0                        # stator length

# Pump head Y offsets (dual-head, counter-phase) ──────────────────────
HEAD_Y_F  = 48.0                        # front head
HEAD_Y_B  = -48.0                       # back head

# Eccentric drive ─────────────────────────────────────────────────────
ECC_OFF   = 4.0     # eccentricity offset from shaft centre  (Z)
ECC_R     = 14.0    # eccentric journal radius
ECC_L     = 12.0    # eccentric journal length (along Y)

# Diaphragm Z baseline ────────────────────────────────────────────────
DIAPH_Z   = LOW_TOP + 12.0             # 157 mm

# Head-stack layer heights (above diaphragm) ──────────────────────────
DIAPH_TOP = 4.0     # diaphragm protrusion above DIAPH_Z
INTER_H   = 12.0    # A6  intermediate plate
COVER_H   = 16.0    # A3  head cover
PLATE_H   = 3.0     # A2  pressure plate
SCREW_H   = 5.0     # A1  screw head

# Front panel ─────────────────────────────────────────────────────────
PANEL_Z    = BASE_Z + LOW_H * 0.55     # ~86 mm  panel centre height
PANEL_TILT = -15.0                      # degrees (tilts panel face upward)


# ══════════════════════════════════════════════════════════════════════════
# 4. GROUP D4 — RUBBER VIBRATION FEET  (×4)
# ══════════════════════════════════════════════════════════════════════════
foot_x = HW - 18.0
foot_y = HD - 22.0
for i, (fx, fy) in enumerate([
    (-foot_x, -foot_y), (-foot_x, foot_y),
    ( foot_x, -foot_y), ( foot_x, foot_y),
]):
    geom.cyl(f"Foot_{i}", 10.0, FOOT_H,
             (s(fx), s(fy), s(FOOT_H / 2)),  # centered in Z
             M['rubber'], root, verts=16)


# ══════════════════════════════════════════════════════════════════════════
# 5. GROUP D1 — LOWER HOUSING  (with boolean cutouts)
# ══════════════════════════════════════════════════════════════════════════
housing_lower = geom.squircle_cyl("Housing_Lower", SQ_R, LOW_H, SQ_EXP)
housing_lower.scale.y = Y_SCALE
bpy.ops.object.select_all(action='DESELECT')
housing_lower.select_set(True)
bpy.context.view_layer.objects.active = housing_lower
bpy.ops.object.transform_apply(scale=True)
geom.da()
housing_lower.location = (0, 0, s(BASE_Z + LOW_H / 2))  # center of lower housing
housing_lower.parent = root
geom.assign(housing_lower, M['knf_dark'])
geom.smooth(housing_lower)

# Side ventilation slots (4 per side)
for side_x in [-1, 1]:
    for i in range(4):
        vent_z = BASE_Z + 40.0 + i * 22.0
        vent = geom.cube(f"Vent_{side_x}_{i}", 15, 50, 5,
                         (s(side_x * (HW + 1)), 0, s(vent_z)),
                         M['knf_dark'], root)
        geom.boolean_subtract(housing_lower, vent, apply=True)

# Rear IEC-C14 cutout
iec_cut = geom.cube("IEC_Cut", 50, 5, 28,
                     (0, s(-(HD + 1)), s(BASE_Z + 28)),
                     M['knf_dark'], root)
geom.boolean_subtract(housing_lower, iec_cut, apply=True)

# Rear exhaust opening
exh_cut = geom.cube("Exhaust_Cut", 44, 5, 34,
                     (0, s(-(HD + 1)), s(LOW_TOP - 22)),
                     M['knf_dark'], root)
geom.boolean_subtract(housing_lower, exh_cut, apply=True)

# Front panel angled recess
panel_cut = geom.cube("Panel_Cutter", 100, 30, 80,
                       (0, s(HD - 8), s(PANEL_Z)),
                       M['knf_dark'], root)
panel_cut.rotation_euler = (math.radians(PANEL_TILT), 0, 0)
bpy.context.view_layer.update()
geom.boolean_subtract(housing_lower, panel_cut, apply=True)


# ══════════════════════════════════════════════════════════════════════════
# 6. GROUP D6 — MOTOR BRACKET / MOUNTING PLATE
# ══════════════════════════════════════════════════════════════════════════
motor_bracket = geom.cube("Part_D6_Motor_Bracket", 100, 4, 90,
                           (0, 0, s(MOT_Z)), M['alum'], root)  # MOT_Z is already the centreline


# ══════════════════════════════════════════════════════════════════════════
# 7. GROUP C1 — BRUSHLESS DC MOTOR
# ══════════════════════════════════════════════════════════════════════════
motor_stator = geom.cyl("Motor_Stator", MOT_R, MOT_L,
                         (0, 0, s(MOT_Z)), M['knf_dark'], root, verts=32,
                         rot=(math.radians(90), 0, 0))
# Copper coil end-bells
geom.cyl("Motor_Coils_F", 35.0, 15.0,
         (0, s(MOT_L / 2 - 7), s(MOT_Z)),
         M['motor_copper'], motor_stator, verts=24,
         rot=(math.radians(90), 0, 0))
geom.cyl("Motor_Coils_B", 35.0, 15.0,
         (0, s(-(MOT_L / 2 - 7)), s(MOT_Z)),
         M['motor_copper'], motor_stator, verts=24,
         rot=(math.radians(90), 0, 0))


# ══════════════════════════════════════════════════════════════════════════
# 8. GROUP C2 — AC-DC POWER SUPPLY
# ══════════════════════════════════════════════════════════════════════════
geom.cube("Part_C2_Power_Supply", 80, 100, 28,
          (0, s(-15), s(BASE_Z + 14)), M['alum'], root)


# ══════════════════════════════════════════════════════════════════════════
# 9. GROUP C3 — IEC C14 POWER INLET  (rear panel)
# ══════════════════════════════════════════════════════════════════════════
inlet_socket = geom.cube("Part_C3_Power_Inlet", 48, 24, 28,
                          (0, s(-(HD + 1)), s(BASE_Z + 28)),
                          M['knf_dark'], root)
geom.cube("Fuse_Holder", 10, 5, 12,
          (s(12), s(-(HD + 2)), s(BASE_Z + 28)),
          M['steel'], inlet_socket)


# ══════════════════════════════════════════════════════════════════════════
# 10. GROUP C4 — EMI LINE FILTER
# ══════════════════════════════════════════════════════════════════════════
geom.cube("Part_C4_EMI_Filter", 45, 30, 22,
          (s(-28), s(-65), s(BASE_Z + 11)), M['steel'], root)


# ══════════════════════════════════════════════════════════════════════════
# 11. GROUP B — DRIVE MECHANISM
# ══════════════════════════════════════════════════════════════════════════

# ── B5: Shaft Coupling  (motor half + eccentric half + elastomer spider)
geom.cyl("Part_B5_Coupling_Motor", 12.0, 15.0,
         (0, s(12), s(MOT_Z)), M['alum'], root, verts=16,
         rot=(math.radians(90), 0, 0))
geom.cyl("Part_B5_Coupling_Eccentric", 12.0, 15.0,
         (0, s(-12), s(MOT_Z)), M['alum'], root, verts=16,
         rot=(math.radians(90), 0, 0))
geom.cyl("Part_B5_Coupling_Spider", 11.5, 6.0,
         (0, 0, s(MOT_Z)), M['valve_rubber'], root, verts=8,
         rot=(math.radians(90), 0, 0))

# ── Central rotor shaft (runs along Y through both head positions)
rotor_shaft = geom.cyl("Rotor_Shaft", 6.0, 130.0,
                        (0, 0, s(MOT_Z)), M['steel'], root, verts=16,
                        rot=(math.radians(90), 0, 0))

# ── B1: Eccentric Cams (×2, offset ±Z from shaft for stroke)
rotor_ecc_f = geom.cyl("Rotor_Eccentric_Front", ECC_R, ECC_L,
                        (0, s(HEAD_Y_F), s(MOT_Z + ECC_OFF)),
                        M['steel'], root, verts=24,
                        rot=(math.radians(90), 0, 0))
rotor_ecc_b = geom.cyl("Rotor_Eccentric_Back", ECC_R, ECC_L,
                        (0, s(HEAD_Y_B), s(MOT_Z - ECC_OFF)),
                        M['steel'], root, verts=24,
                        rot=(math.radians(90), 0, 0))

# ── B3: Needle Roller Bearings (×2)
for suffix, y_pos, z_off in [("Front", HEAD_Y_F,  ECC_OFF),
                               ("Back",  HEAD_Y_B, -ECC_OFF)]:
    brg = geom.cyl(f"Part_B3_Needle_Bearing_{suffix}",
                    15.8, ECC_L - 2,
                    (0, s(y_pos), s(MOT_Z + z_off)),
                    M['steel'], root, verts=16,
                    rot=(math.radians(90), 0, 0))
    brg_cut = geom.cyl(f"BrgHole_{suffix}",
                        ECC_R + 0.3, ECC_L,
                        (0, s(y_pos), s(MOT_Z + z_off)),
                        M['steel'], root, verts=16,
                        rot=(math.radians(90), 0, 0))
    geom.boolean_subtract(brg, brg_cut, apply=True)

# ── B2: Connecting Rods (×2) — big-end ring + vertical shaft
for suffix, y_pos, z_off in [("Front", HEAD_Y_F,  ECC_OFF),
                               ("Back",  HEAD_Y_B, -ECC_OFF)]:
    # Big-end ring around eccentric bearing
    rod_ring = geom.cyl(f"Rod_Ring_{suffix}", 18.0, 6.0,
                         (0, s(y_pos), s(MOT_Z + z_off)),
                         M['alum'], root, verts=24,
                         rot=(math.radians(90), 0, 0))
    rod_hole = geom.cyl(f"Rod_Hole_{suffix}", ECC_R + 0.5, 8.0,
                         (0, s(y_pos), s(MOT_Z + z_off)),
                         M['alum'], root, verts=24,
                         rot=(math.radians(90), 0, 0))
    geom.boolean_subtract(rod_ring, rod_hole, apply=True)

    # Vertical shaft from eccentric up toward diaphragm
    rod_len = DIAPH_Z - (MOT_Z + z_off) - 2.0
    rod_shaft = geom.cube(f"Rotor_Rod_{suffix}", 10, 6, rod_len,
                           (0, s(y_pos),
                            s(MOT_Z + z_off + rod_len / 2 + 1)),
                           M['alum'], root)

    # Join ring + shaft into one mesh (keeps showcase animation working)
    bpy.ops.object.select_all(action='DESELECT')
    rod_ring.select_set(True)
    rod_shaft.select_set(True)
    bpy.context.view_layer.objects.active = rod_shaft
    bpy.ops.object.join()
    rod_shaft.name = f"Rotor_Rod_{suffix}"

# ── B4: Thrust Bearings (×2) — between rod top and diaphragm hub
geom.cyl("Part_B4_Thrust_Bearing_Front", 10.0, 2.0,
         (0, s(HEAD_Y_F), s(DIAPH_Z - 2)), M['brass'], root, verts=16)
geom.cyl("Part_B4_Thrust_Bearing_Back", 10.0, 2.0,
         (0, s(HEAD_Y_B), s(DIAPH_Z - 2)), M['brass'], root, verts=16)


# ══════════════════════════════════════════════════════════════════════════
# 12. GROUP A — DUAL PUMP HEAD ASSEMBLIES  (×2 heads, counter-phase)
#     Bottom-up stack:  Shims → Diaphragm → Intermediate Plate →
#                       Valves + Pin → Head Cover → Pressure Plate → Screw
# ══════════════════════════════════════════════════════════════════════════

# Diaphragm lathe profile (matches create_vacuum_pump_head_gold.py)
diaphragm_points = [
    (0.0, -4.0), (3.0, -4.0), (3.0, 2.0), (12.0, 2.0),
    (17.0, 4.0), (21.0, 1.0), (25.0, 1.0), (25.0, -1.0),
    (27.0, -1.0), (27.0, 2.0), (0.0, 2.0)
]

for side, y_pos in [("Front", HEAD_Y_F), ("Back", HEAD_Y_B)]:
    z = DIAPH_Z          # running stack height

    # ── A8: Shim Rings
    geom.cyl(f"Part_8_Shim_Rings_{side}", 6.0, 1.0,
             (0, s(y_pos), s(z - 1.0)), M['steel'], root, verts=16)

    # ── A7: PTFE-Coated Diaphragm  (lathe profile)
    diaph = geom.lathe_profile(
        f"Rotor_Diaphragm_{side}", diaphragm_points, segments=32)
    diaph.parent = root
    diaph.location = (0, s(y_pos), s(z))
    geom.assign(diaph, M['knf_dark'])
    geom.smooth(diaph)
    z += DIAPH_TOP                       # +4 mm

    # ── A6: Intermediate Plate  (with valve-seat recesses)
    inter_z = z + INTER_H / 2
    inter = geom.cyl(f"Part_6_Intermediate_Plate_{side}",
                      28.0, INTER_H,
                      (0, s(y_pos), s(inter_z)),
                      M['ptfe'], root, verts=32)
    for seat_x in [-11.0, 11.0]:
        seat = geom.cyl("Seat_Cut", 5.5, 2.5,
                         (s(seat_x), s(y_pos),
                          s(inter_z + INTER_H / 2 - 1)),
                         M['ptfe'], root, verts=16)
        geom.boolean_subtract(inter, seat, apply=True)
    z += INTER_H                         # +12 mm

    # ── A4: Poppet Valve Plates  (×2 per head, seated in recesses)
    geom.cyl(f"Part_4_Valve_L_{side}", 5.0, 1.0,
             (s(-11), s(y_pos), s(z - 0.5)),
             M['valve_rubber'], root, verts=16)
    geom.cyl(f"Part_4_Valve_R_{side}", 5.0, 1.0,
             (s(11), s(y_pos), s(z - 0.5)),
             M['valve_rubber'], root, verts=16)

    # ── A5: Locating Dowel Pin
    geom.cyl(f"Part_5_Locating_Pin_{side}", 1.4, 8.0,
             (0, s(y_pos + 18), s(z + 2)),
             M['steel'], root, verts=8)

    # ── A3: Head Cover
    cover_z = z + COVER_H / 2
    geom.cyl(f"Part_3_Head_Cover_{side}", 28.0, COVER_H,
             (0, s(y_pos), s(cover_z)),
             M['ptfe'], root, verts=32)
    z += COVER_H                         # +16 mm

    # ── A2: Upper Pressure Plate  (with alignment notch)
    plate_z = z + PLATE_H / 2
    press = geom.cyl(f"Part_2_Pressure_Plate_{side}",
                      25.0, PLATE_H,
                      (0, s(y_pos), s(plate_z)),
                      M['alum'], root, verts=24)
    notch = geom.cube("Notch", 6, 6, PLATE_H + 2,
                       (s(24), s(y_pos), s(plate_z)),
                       M['alum'], root)
    geom.boolean_subtract(press, notch, apply=True)
    z += PLATE_H                         # +3 mm

    # ── A1: Central Clamping Screw  (shaft + hex socket head)
    shaft_len = COVER_H + INTER_H + 8.0
    # Screw shaft: centered at plate_z - shaft_len/2 + PLATE_H/2
    geom.cyl(f"Part_1_Screw_{side}", 2.0, shaft_len,
             (0, s(y_pos),
              s(plate_z - shaft_len / 2 + PLATE_H / 2)),
             M['steel'], root, verts=16)
    # Screw head: centered at z + SCREW_H/2
    geom.cyl(f"Part_1_Screw_Head_{side}", 4.0, SCREW_H,
             (0, s(y_pos), s(z + SCREW_H / 2)),
             M['steel'], root, verts=16)

# ── Connecting Tube (Verschaltungsrohr) between the two head covers
tube_z = DIAPH_Z + DIAPH_TOP + INTER_H + COVER_H / 2   # 181 mm
tube_span = HEAD_Y_F - HEAD_Y_B                          # 96 mm
geom.cyl("Connecting_Tube", 4.0, tube_span,
         (0, 0, s(tube_z)), M['lgray'], root, verts=16,
         rot=(math.radians(90), 0, 0))


# ══════════════════════════════════════════════════════════════════════════
# 13. GROUP E — FRONT PANEL & CONTROLS
# ══════════════════════════════════════════════════════════════════════════

# Angled panel face  (sits in recess cut from housing in §5)
panel_y = HD - 12.0                     # 108 mm — inside housing front face
panel = geom.cube("Panel_Front", 95, 3, 75,
                   (0, s(panel_y), s(PANEL_Z)),
                   M['knf_dark'], root)
panel.rotation_euler = (math.radians(PANEL_TILT), 0, 0)
bpy.context.view_layer.update()

# E1: Vacuum Gauge  (will receive canvas texture in the showcase viewer)
gauge_z = PANEL_Z + 15
gauge = geom.cyl("UI_Gauge", 22.0, 5.0,
                  (0, s(panel_y - 1), s(gauge_z)),
                  M['white'], panel, verts=24)
gauge.rotation_euler = (math.radians(90 + PANEL_TILT), 0, 0)

# E3: Toggle Switch — On/Off power
toggle_z = PANEL_Z - 15
toggle = geom.cube("Btn_Power", 8, 12, 8,
                    (s(-28), s(panel_y), s(toggle_z)),
                    M['btn_chrome'], panel)
toggle.rotation_euler = (math.radians(90 + PANEL_TILT), 0, 0)

# E6: Status LED
led = geom.cyl("LED_Status", 3.0, 3.0,
                (s(28), s(panel_y), s(toggle_z)),
                M['led_g'], panel, verts=8)
led.rotation_euler = (math.radians(90 + PANEL_TILT), 0, 0)

# E2: Speed Control Potentiometer  (knob on upper deck)
geom.cyl("Knob_Speed", 10.0, 12.0,
         (s(48), 0, s(LOW_TOP + 5)),
         M['chrome'], root, verts=24)

# E4: Gas Ballast Knob  (side-mounted, near front head)
geom.cyl("Knob_Ballast", 12.0, 10.0,
         (s(-(HW + 2)), s(HEAD_Y_F), s(DIAPH_Z + 10)),
         M['knf_dark'], root, verts=24,
         rot=(0, math.radians(90), 0))

# E5: PVDF Hose Connector  (inlet, protruding from front of machine)
geom.cyl("Inlet_Port", 6.0, 22.0,
         (0, s(HD + 8), s(tube_z)),
         M['pvdf'], root, verts=16,
         rot=(math.radians(90), 0, 0))


# ══════════════════════════════════════════════════════════════════════════
# 14. GROUP D2 — UPPER HOUSING
# ══════════════════════════════════════════════════════════════════════════
housing_upper = geom.squircle_cyl("Housing_Upper", SQ_R, UP_H, SQ_EXP)
housing_upper.scale.y = Y_SCALE
bpy.ops.object.select_all(action='DESELECT')
housing_upper.select_set(True)
bpy.context.view_layer.objects.active = housing_upper
bpy.ops.object.transform_apply(scale=True)
geom.da()
housing_upper.location = (0, 0, s(LOW_TOP + UP_H / 2))  # center of upper housing
housing_upper.parent = root
geom.assign(housing_upper, M['knf_dark'])
geom.smooth(housing_upper)

# D3: Carry Handle
handle = geom.cube("Handle", 180, 30, HANDLE_H,
                    (0, 0, s(UP_TOP + HANDLE_H / 2)),  # centered in Z
                    M['knf_dark'], root)

# D5: Exhaust Hex Mesh Grill  (rear opening cover)
geom.cube("Part_D5_Exhaust_Grill", 42, 2, 32,
          (0, s(-(HD + 1)), s(LOW_TOP - 22)),
          M['steel'], root)

# D7: Cable Management Clips (×2)
geom.cube("Part_D7_Cable_Clip_0", 8, 8, 6,
          (s(38), s(22), s(BASE_Z + 8)), M['knf_dark'], root)
geom.cube("Part_D7_Cable_Clip_1", 8, 8, 6,
          (s(-38), s(-22), s(BASE_Z + 8)), M['knf_dark'], root)


# ══════════════════════════════════════════════════════════════════════════
# 15. GROUP F — EXHAUST SYSTEM
# ══════════════════════════════════════════════════════════════════════════

# F1: Exhaust Silencer Body  (cylindrical muffler protruding from rear)
geom.cyl("Exhaust_Silencer", 14.0, 40.0,
         (0, s(-(HD + 15)), s(LOW_TOP - 22)),
         M['knf_dark'], root, verts=24,
         rot=(math.radians(90), 0, 0))

# F2: Exhaust Gasket  (annular seal ring)
gasket = geom.cyl("Part_F2_Exhaust_Gasket", 15.0, 2.0,
                   (0, s(-(HD - 1)), s(LOW_TOP - 22)),
                   M['rubber'], root, verts=16,
                   rot=(math.radians(90), 0, 0))
gasket_h = geom.cyl("Gasket_Hole", 13.0, 4.0,
                     (0, s(-(HD - 1)), s(LOW_TOP - 22)),
                     M['rubber'], root, verts=16,
                     rot=(math.radians(90), 0, 0))
geom.boolean_subtract(gasket, gasket_h, apply=True)

# F3: Exhaust Drip Tray / Condensate Catch
geom.cube("Part_F3_Drip_Tray", 35, 25, 10,
          (0, s(-(HD + 15)), s(LOW_TOP - 48)),
          M['lgray'], root)


# ══════════════════════════════════════════════════════════════════════════
# 16. GROUP G — SEALS  (visible O-rings at diaphragm clamp joints)
# ══════════════════════════════════════════════════════════════════════════
for side, y_pos in [("Front", HEAD_Y_F), ("Back", HEAD_Y_B)]:
    bpy.ops.mesh.primitive_torus_add(
        major_radius=s(26), minor_radius=s(1.0),
        major_segments=24, minor_segments=6,
        location=(0, s(y_pos), s(DIAPH_Z + DIAPH_TOP)))
    oring = bpy.context.active_object
    oring.name = f"ORing_Diaph_{side}"
    geom.smooth(oring)
    geom.assign(oring, M['ffpm'])
    oring.parent = root
    geom.da()


# ══════════════════════════════════════════════════════════════════════════
# 17. GROUP H — VISIBLE HARDWARE  (housing split-line screws)
# ══════════════════════════════════════════════════════════════════════════
# 8 self-tapping screws around the housing split line
for i in range(8):
    angle = 2 * math.pi * i / 8
    sx_mm = (HW - 6) * math.cos(angle)
    sy_mm = (HD - 6) * math.sin(angle)
    geom.cyl(f"Screw_Housing_{i}", 1.5, 6.0,
             (s(sx_mm), s(sy_mm), s(LOW_TOP)),
             M['steel'], root, verts=6)


# ══════════════════════════════════════════════════════════════════════════
# 18. PRODUCTION MODIFIERS
# ══════════════════════════════════════════════════════════════════════════
for obj in [housing_lower, housing_upper, handle, panel]:
    geom.set_edge_sharpness(obj, select_all=True,
                             crease=0.7, bevel_weight=0.8)

geom.apply_production_modifiers(housing_lower,
                                 bevel_width=0.015, subdiv_levels=2)
geom.apply_production_modifiers(housing_upper,
                                 bevel_width=0.012, subdiv_levels=2)
geom.apply_production_modifiers(handle,
                                 bevel_width=0.008, subdiv_levels=2)
geom.apply_production_modifiers(panel,
                                 bevel_width=0.005, subdiv_levels=2)


# ══════════════════════════════════════════════════════════════════════════
# 19. EXPORT
# ══════════════════════════════════════════════════════════════════════════
base_dir = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Primary export → public/models/procedural/
output_primary = os.path.join(
    base_dir, "public", "models", "procedural", "vacuum_pump.glb")
os.makedirs(os.path.dirname(output_primary), exist_ok=True)
geom.export_glb(output_primary, apply_modifiers=True, bake_textures=False)

# Copy to completed_assets
output_asset = os.path.join(
    base_dir, "completed_assets", "Vacuum_Pump", "vacuum_pump.glb")
shutil.copy2(output_primary, output_asset)

print(f"✅ Full vacuum pump model (35+ parts) export complete")
print(f"   Primary: {output_primary}")
print(f"   Asset:   {output_asset}")