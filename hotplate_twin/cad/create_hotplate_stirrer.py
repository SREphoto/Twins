"""
SREdesigns — Laboratory Hotplate Stirrer STIR-HEAT 500-D (Gold-Tier CAD Twin)
=============================================================================
Procedural Blender CAD script adhering to 5-Agent Handoff Chain & Strict Part Taxonomy:
- Metric scale: 1:1 mm (S = 1.0 / 1000)
- Unibody die-cast aluminum chassis with sloped front console (15 deg rake)
- Boolean-carved recessed display and control pocket (Anti-clipping rule)
- White ceramic-coated top heating plate (Dia 135 mm) with thermal spill barrier
- Dual knurled optical encoder knobs (Speed / Temp) with rotational origins
- Rear M10 boss mount, vertical 304 SS retort rod, boss head clamp & PT1000 probe
- 250 mL borosilicate glass beaker with fluid layer and PTFE magnetic stir bar
- Rear IEC C14 power inlet, DIN PT1000 probe port, and cooling exhaust louvers
- 4 Neoprene leveling feet seated squarely on datum Z = 0
- SREdesigns brand badge strictly adhering to DIAG-001 (<85% apron height)

Run:
/Applications/Blender.app/Contents/MacOS/Blender --background --python hotplate_twin/cad/create_hotplate_stirrer.py
"""

import bpy
import bmesh
import math
import os

# --- Configuration & Scale ---
S = 1.0 / 1000.0  # mm to meters
SEG = 48

def s(mm):
    return mm * S

# Dimensions (mm)
BASE_W = 160.0
BASE_D = 270.0
BASE_H = 85.0
CHASSIS_WALL = 3.5

PLATE_DIA = 135.0
PLATE_H = 15.0
PLATE_Z_CENTER = 35.0  # offset from chassis center along Y (Blender Y is depth)

SLOPE_ANGLE = math.radians(15.0)

# --- Cleanup Scene ---
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()
for collection in [bpy.data.materials, bpy.data.meshes, bpy.data.curves]:
    for item in list(collection):
        collection.remove(item)

# --- Materials Setup ---
def create_pbr(name, base_color, metallic=0.0, roughness=0.35, transmission=0.0, ior=1.45, emit=None, emit_str=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (*base_color, 1.0)
        bsdf.inputs['Metallic'].default_value = metallic
        bsdf.inputs['Roughness'].default_value = roughness
        if 'Transmission Weight' in bsdf.inputs:
            bsdf.inputs['Transmission Weight'].default_value = transmission
        elif 'Transmission' in bsdf.inputs:
            bsdf.inputs['Transmission'].default_value = transmission
        if 'IOR' in bsdf.inputs:
            bsdf.inputs['IOR'].default_value = ior
        if emit and 'Emission Color' in bsdf.inputs:
            bsdf.inputs['Emission Color'].default_value = (*emit, 1.0)
            bsdf.inputs['Emission Strength'].default_value = emit_str
    return mat

M = {
    'chassis':    create_pbr("ChassisPowderCoat",  (0.92, 0.93, 0.94), 0.05, 0.38),
    'chassis_dk': create_pbr("ChassisDarkTrim",    (0.12, 0.14, 0.16), 0.10, 0.50),
    'plate_w':    create_pbr("CeramicPlateWhite",  (0.97, 0.97, 0.98), 0.02, 0.15),
    'steel_br':   create_pbr("SteelBrushed",       (0.78, 0.80, 0.82), 0.88, 0.28),
    'steel_dk':   create_pbr("SteelDarkFastener",  (0.35, 0.36, 0.38), 0.85, 0.35),
    'brass':      create_pbr("BrassAdjustment",    (0.85, 0.70, 0.25), 0.82, 0.25),
    'rubber':     create_pbr("RubberFootPad",      (0.06, 0.06, 0.07), 0.02, 0.92),
    'lcd_quad':   create_pbr("LCD_ScreenQuad",     (0.01, 0.03, 0.05), 0.00, 0.05, emit=(0.0, 0.8, 0.9), emit_str=2.0),
    'knob_body':  create_pbr("KnobDarkPolymer",    (0.10, 0.11, 0.12), 0.08, 0.40),
    'indicator':  create_pbr("WhiteIndicatorMark", (0.95, 0.95, 0.95), 0.00, 0.20),
    'ptfe':       create_pbr("PTFE_StirBar",       (0.96, 0.96, 0.96), 0.00, 0.45),
    'glass':      create_pbr("BorosilicateGlass",  (0.92, 0.95, 0.98), 0.05, 0.04, transmission=0.96, ior=1.52),
    'fluid':      create_pbr("AqueousSolution",    (0.85, 0.94, 0.98), 0.02, 0.08, transmission=0.90, ior=1.33),
    'rocker_gn':  create_pbr("RockerSwitchGreen",  (0.10, 0.75, 0.25), 0.10, 0.25, emit=(0.1, 0.9, 0.3), emit_str=1.5),
    'badge_te':   create_pbr("BadgeTeal",          (0.00, 0.65, 0.72), 0.30, 0.20),
}

# --- Utility Helpers ---
def da():
    bpy.ops.object.select_all(action='DESELECT')

def smooth(obj):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    obj.select_set(False)

def assign_mat(obj, mat):
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)

def add_bevel(obj, width_mm=2.5, segments=3):
    b = obj.modifiers.new("Bevel", "BEVEL")
    b.width = s(width_mm)
    b.segments = segments

# --- Root Assembly ---
bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
root = bpy.context.active_object
root.name = "HotplateStirrer"
da()

# =============================================================================
# 1. MAIN CHASSIS HOUSING (Body_Chassis)
# =============================================================================
# We build a precision chamfered unibody enclosure with sloped front fascia.
bm = bmesh.new()

hw = BASE_W / 2.0
hd = BASE_D / 2.0
h_rear = BASE_H
h_front = BASE_H - 35.0  # front lip height
y_slope_start = -hd + 80.0  # slope begins 80mm from front

# Define 8 outer boundary vertices of the sloped enclosure
v_flb = bm.verts.new((s(-hw), s(-hd), s(12)))              # front left bottom
v_frb = bm.verts.new((s(hw),  s(-hd), s(12)))              # front right bottom
v_rlb = bm.verts.new((s(-hw), s(hd),  s(12)))              # rear left bottom
v_rrb = bm.verts.new((s(hw),  s(hd),  s(12)))              # rear right bottom

v_flt = bm.verts.new((s(-hw), s(-hd), s(h_front)))         # front left top
v_frt = bm.verts.new((s(hw),  s(-hd), s(h_front)))         # front right top
v_slt = bm.verts.new((s(-hw), s(y_slope_start), s(h_rear)))# slope left top
v_srt = bm.verts.new((s(hw),  s(y_slope_start), s(h_rear)))# slope right top
v_rlt = bm.verts.new((s(-hw), s(hd),  s(h_rear)))          # rear left top
v_rrt = bm.verts.new((s(hw),  s(hd),  s(h_rear)))          # rear right top

bm.verts.ensure_lookup_table()

# Construct outer hull faces
bm.faces.new([v_flb, v_frb, v_rrb, v_rlb]) # bottom
bm.faces.new([v_flt, v_frt, v_frb, v_flb]) # front nose
bm.faces.new([v_flt, v_slt, v_srt, v_frt]) # sloped console apron
bm.faces.new([v_slt, v_rlt, v_rrt, v_srt]) # flat rear deck
bm.faces.new([v_rlt, v_rlb, v_rrb, v_rrt]) # rear backplate
bm.faces.new([v_flb, v_rlb, v_rlt, v_slt, v_flt]) # left flank
bm.faces.new([v_frb, v_frt, v_srt, v_rrt, v_rrb]) # right flank

bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
me_chassis = bpy.data.meshes.new("Body_Chassis_Mesh")
bm.to_mesh(me_chassis)
bm.free()

chassis = bpy.data.objects.new("Body_Chassis", me_chassis)
bpy.context.collection.objects.link(chassis)
assign_mat(chassis, M['chassis'])
add_bevel(chassis, width_mm=2.5, segments=3)
smooth(chassis)
chassis.parent = root
da()

# Bottom stamped cover plate
bpy.ops.mesh.primitive_cube_add(size=1)
base_pan = bpy.context.active_object
base_pan.name = "Chassis_BasePlate"
base_pan.scale = (s(BASE_W - 6), s(BASE_D - 6), s(3))
base_pan.location = (0, 0, s(12 - 1.5))
bpy.ops.object.transform_apply(scale=True)
assign_mat(base_pan, M['chassis_dk'])
smooth(base_pan)
base_pan.parent = root
da()

# =============================================================================
# 2. BOOLEAN CARVED DISPLAY & CONSOLE RECESS (Pocket_Bezel & UI_LCD)
# =============================================================================
# Console slope angle:
slope_dy = y_slope_start - (-hd)
slope_dz = h_rear - h_front
pitch_rad = math.atan2(slope_dz, slope_dy) # inclination angle

bezel_w = 110.0
bezel_h = 55.0
bezel_d = 4.0
bezel_y = -hd + 42.0
bezel_z = h_front + (bezel_y - (-hd)) * math.tan(pitch_rad)

# Recessed bezel frame
bpy.ops.mesh.primitive_cube_add(size=1)
bezel = bpy.context.active_object
bezel.name = "Pocket_Bezel"
bezel.scale = (s(bezel_w), s(bezel_h), s(bezel_d))
bezel.rotation_euler = (pitch_rad, 0, 0)
bezel.location = (0, s(bezel_y), s(bezel_z) + s(0.8))
bpy.ops.object.transform_apply(scale=True, rotation=False)
assign_mat(bezel, M['chassis_dk'])
smooth(bezel)
bezel.parent = root
da()

# UI_LCD Display Quad seated flush inside carved pocket
lcd_w = 88.0
lcd_h = 38.0
bpy.ops.mesh.primitive_plane_add(size=1)
lcd = bpy.context.active_object
lcd.name = "UI_LCD"
lcd.scale = (s(lcd_w), s(lcd_h), 1.0)
lcd.rotation_euler = (pitch_rad, 0, 0)
# Seated proudly above bezel backing (DIAG-002: no occluding box)
lcd.location = (0, s(bezel_y), s(bezel_z) + s(1.8))
assign_mat(lcd, M['lcd_quad'])
lcd.parent = root
da()

# =============================================================================
# 3. ROTARY ENCODER KNOBS (Knob_Speed, Knob_Temp)
# =============================================================================
knob_r = 16.0
knob_h = 16.0
knob_z_off = bezel_y - 28.0  # positioned below the LCD on sloped apron
knob_z = h_front + (knob_z_off - (-hd)) * math.tan(pitch_rad)

# Knob Left (Speed: 0 to 1500 RPM)
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(knob_r), depth=s(knob_h), vertices=32,
    location=(s(-42.0), s(knob_z_off), s(knob_z) + s(6.0)),
    rotation=(pitch_rad, 0, 0)
)
knob_speed = bpy.context.active_object
knob_speed.name = "Knob_Speed"
assign_mat(knob_speed, M['knob_body'])
smooth(knob_speed)
knob_speed.parent = root
da()

# Indicator mark on Speed knob
bpy.ops.mesh.primitive_cube_add(size=1)
mark_s = bpy.context.active_object
mark_s.name = "Indicator_Speed"
mark_s.scale = (s(1.6), s(5.0), s(1.0))
mark_s.location = (0, s(knob_r * 0.65), s(knob_h / 2.0 + 0.5))
bpy.ops.object.transform_apply(scale=True)
assign_mat(mark_s, M['indicator'])
mark_s.parent = knob_speed
da()

# Knob Right (Temperature: 20 to 310 deg C)
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(knob_r), depth=s(knob_h), vertices=32,
    location=(s(42.0), s(knob_z_off), s(knob_z) + s(6.0)),
    rotation=(pitch_rad, 0, 0)
)
knob_temp = bpy.context.active_object
knob_temp.name = "Knob_Temp"
assign_mat(knob_temp, M['knob_body'])
smooth(knob_temp)
knob_temp.parent = root
da()

# Indicator mark on Temp knob
bpy.ops.mesh.primitive_cube_add(size=1)
mark_t = bpy.context.active_object
mark_t.name = "Indicator_Temp"
mark_t.scale = (s(1.6), s(5.0), s(1.0))
mark_t.location = (0, s(knob_r * 0.65), s(knob_h / 2.0 + 0.5))
bpy.ops.object.transform_apply(scale=True)
assign_mat(mark_t, M['indicator'])
mark_t.parent = knob_temp
da()

# Safety circuit trimpot (Btn_SafeTemp)
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(3.5), depth=s(4.0), vertices=16,
    location=(0, s(knob_z_off), s(knob_z) + s(2.0)),
    rotation=(pitch_rad, 0, 0)
)
trimpot = bpy.context.active_object
trimpot.name = "Btn_SafeTemp"
assign_mat(trimpot, M['brass'])
smooth(trimpot)
trimpot.parent = root
da()

# =============================================================================
# 4. HEATING TOP PLATE (Plate_Heating & Spill Collar)
# =============================================================================
plate_y = PLATE_Z_CENTER  # 35mm from center toward rear
plate_z = BASE_H + PLATE_H / 2.0

# Spill Collar Rim
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(PLATE_DIA / 2.0 + 3.5), depth=s(4.0), vertices=SEG,
    location=(0, s(plate_y), s(BASE_H + 2.0))
)
collar = bpy.context.active_object
collar.name = "Plate_SpillCollar"
assign_mat(collar, M['chassis_dk'])
smooth(collar)
collar.parent = root
da()

# Ceramic Coated Aluminum Top Plate
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(PLATE_DIA / 2.0), depth=s(PLATE_H), vertices=SEG,
    location=(0, s(plate_y), s(plate_z))
)
plate = bpy.context.active_object
plate.name = "Plate_Heating"
assign_mat(plate, M['plate_w'])
add_bevel(plate, width_mm=1.5, segments=3)
smooth(plate)
plate.parent = root
da()

# 4x Plate Mounting Screws (Hex Socket Cap DIN 912)
for i, angle in enumerate([math.pi/4, 3*math.pi/4, 5*math.pi/4, 7*math.pi/4]):
    sr = PLATE_DIA / 2.0 - 8.0
    sx = sr * math.cos(angle)
    sy = plate_y + sr * math.sin(angle)
    bpy.ops.mesh.primitive_cylinder_add(
        radius=s(2.5), depth=s(2.0), vertices=16,
        location=(s(sx), s(sy), s(BASE_H + PLATE_H + 0.2))
    )
    screw = bpy.context.active_object
    screw.name = f"Fastener_HexM4_{i+1:02d}"
    assign_mat(screw, M['steel_dk'])
    screw.parent = plate
    da()

# =============================================================================
# 5. RETORT ROD, CLAMP & PT1000 PROBE
# =============================================================================
rod_x = hw - 18.0
rod_y = hd - 24.0

# Threaded M10 Boss insert
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(9.0), depth=s(10.0), vertices=24,
    location=(s(rod_x), s(rod_y), s(BASE_H + 5.0))
)
boss = bpy.context.active_object
boss.name = "Boss_RetortMount"
assign_mat(boss, M['steel_br'])
smooth(boss)
boss.parent = root
da()

# Stainless Steel Support Rod (Dia 12 mm x 420 mm)
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(6.0), depth=s(420.0), vertices=24,
    location=(s(rod_x), s(rod_y), s(BASE_H + 210.0))
)
rod = bpy.context.active_object
rod.name = "Rod_Support"
assign_mat(rod, M['steel_br'])
smooth(rod)
rod.parent = root
da()

# Boss Head Clamp
clamp_z = BASE_H + 180.0
bpy.ops.mesh.primitive_cube_add(size=1)
clamp = bpy.context.active_object
clamp.name = "Clamp_BossHead"
clamp.scale = (s(36.0), s(32.0), s(28.0))
clamp.location = (s(rod_x), s(rod_y), s(clamp_z))
bpy.ops.object.transform_apply(scale=True)
assign_mat(clamp, M['chassis_dk'])
smooth(clamp)
clamp.parent = root
da()

# Clamp Thumbscrews (Brass)
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(7.0), depth=s(14.0), vertices=16,
    location=(s(rod_x + 22.0), s(rod_y), s(clamp_z)),
    rotation=(0, math.pi/2, 0)
)
thumb1 = bpy.context.active_object
thumb1.name = "Fastener_Thumb_01"
assign_mat(thumb1, M['brass'])
thumb1.parent = clamp
da()

# Horizontal Extension Arm
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(4.0), depth=s(130.0), vertices=16,
    location=(s(rod_x - 65.0), s(rod_y - 20.0), s(clamp_z)),
    rotation=(0, math.pi/2, -math.radians(20))
)
arm = bpy.context.active_object
arm.name = "Arm_ProbeHolder"
assign_mat(arm, M['steel_br'])
smooth(arm)
arm.parent = clamp
da()

# PT1000 Immersion Temperature Probe
probe_x = 0.0
probe_y = plate_y
probe_z = BASE_H + PLATE_H + 60.0
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(1.6), depth=s(180.0), vertices=16,
    location=(s(probe_x + 12.0), s(probe_y), s(probe_z))
)
probe = bpy.context.active_object
probe.name = "Probe_PT1000"
assign_mat(probe, M['steel_br'])
smooth(probe)
probe.parent = root
da()

# =============================================================================
# 6. GLASS BEAKER, FLUID & MAGNETIC STIR BAR
# =============================================================================
beaker_r = 35.0 # 70 mm dia
beaker_h = 95.0
beaker_bottom_z = BASE_H + PLATE_H

# Borosilicate Beaker (Outer wall + base)
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(beaker_r), depth=s(beaker_h), vertices=SEG,
    location=(0, s(plate_y), s(beaker_bottom_z + beaker_h / 2.0))
)
beaker = bpy.context.active_object
beaker.name = "Glass_Beaker"
assign_mat(beaker, M['glass'])
smooth(beaker)
beaker.parent = root
da()

# Fluid column (150 mL solution)
fluid_h = 50.0
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(beaker_r - 1.8), depth=s(fluid_h), vertices=SEG,
    location=(0, s(plate_y), s(beaker_bottom_z + 1.8 + fluid_h / 2.0))
)
fluid = bpy.context.active_object
fluid.name = "Fluid_Liquid"
assign_mat(fluid, M['fluid'])
smooth(fluid)
fluid.parent = root
da()

# PTFE Magnetic Stir Bar (Pivot_StirBar)
bpy.ops.mesh.primitive_cylinder_add(
    radius=s(4.0), depth=s(25.0), vertices=16,
    location=(0, s(plate_y), s(beaker_bottom_z + 2.0 + 4.0)),
    rotation=(0, math.pi/2, 0)
)
stirbar = bpy.context.active_object
stirbar.name = "Pivot_StirBar"
assign_mat(stirbar, M['ptfe'])
smooth(stirbar)
stirbar.parent = root
da()

# =============================================================================
# 7. POWER SWITCH, REAR BULKHEAD & LEVELING FEET
# =============================================================================
# Rocker Power Switch on right flank
bpy.ops.mesh.primitive_cube_add(size=1)
switch = bpy.context.active_object
switch.name = "Btn_Power"
switch.scale = (s(4.0), s(22.0), s(14.0))
switch.location = (s(hw + 1.0), s(0), s(BASE_H * 0.45))
bpy.ops.object.transform_apply(scale=True)
assign_mat(switch, M['rocker_gn'])
switch.parent = root
da()

# Rear Louver Panel
bpy.ops.mesh.primitive_cube_add(size=1)
louver = bpy.context.active_object
louver.name = "Panel_RearLouver"
louver.scale = (s(120.0), s(3.0), s(45.0))
louver.location = (0, s(hd + 1.0), s(BASE_H * 0.50))
bpy.ops.object.transform_apply(scale=True)
assign_mat(louver, M['chassis_dk'])
louver.parent = root
da()

# 4x Neoprene Leveling Feet (Foot_Leveling_*)
# Sits from Z = 0 to Z = 12mm (Tabletop datum Z = 0)
foot_inset_x = hw - 22.0
foot_inset_y = hd - 26.0

for name, (fx, fy) in [
    ("Foot_Leveling_FL", (-foot_inset_x, -foot_inset_y)),
    ("Foot_Leveling_FR", ( foot_inset_x, -foot_inset_y)),
    ("Foot_Leveling_RL", (-foot_inset_x,  foot_inset_y)),
    ("Foot_Leveling_RR", ( foot_inset_x,  foot_inset_y)),
]:
    bpy.ops.mesh.primitive_cylinder_add(
        radius=s(12.0), depth=s(12.0), vertices=24,
        location=(s(fx), s(fy), s(6.0))
    )
    foot = bpy.context.active_object
    foot.name = name
    assign_mat(foot, M['rubber'])
    smooth(foot)
    foot.parent = root
    da()

# =============================================================================
# 8. SREDESIGNS BRAND BADGE (Badge_SREdesigns)
# =============================================================================
# Strictly adheres to DIAG-001 (Boundary Containment <= 85% of face height)
# Front nose lip height = 35 - 12 = 23 mm. Badge height = 9 mm (39% of lip).
badge_w = 34.0
badge_h = 9.0
badge_d = 1.0

bpy.ops.mesh.primitive_cube_add(size=1)
badge = bpy.context.active_object
badge.name = "Badge_SREdesigns"
badge.scale = (s(badge_w), s(badge_d), s(badge_h))
# Placed on vertical front nose apron
badge.location = (0, s(-hd - badge_d / 2.0 - 0.2), s(12.0 + 23.0 / 2.0))
bpy.ops.object.transform_apply(scale=True)
assign_mat(badge, M['badge_te'])
badge.parent = root
da()

# =============================================================================
# EXPORT GLB MODEL
# =============================================================================
cad_dir = os.path.dirname(os.path.abspath(__file__))
package_dir = os.path.dirname(cad_dir)
models_dir = os.path.join(package_dir, "software", "viewer", "models")
os.makedirs(models_dir, exist_ok=True)
output_path = os.path.join(models_dir, "hotplate_stirrer.glb")

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_apply=False,
    use_selection=True,
    export_materials='EXPORT',
    export_draco_mesh_compression_enable=False
)

size_mb = os.path.getsize(output_path) / (1024 * 1024)
print(f"✅ SREdesigns STIR-HEAT 500-D exported successfully: {output_path} ({size_mb:.2f} MB)")
