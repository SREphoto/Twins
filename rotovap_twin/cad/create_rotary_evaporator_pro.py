"""
SREdesigns — Pro-Fidelity Rotary Evaporator (Rotovap) v1
=========================================================
Procedural Blender build for a professional benchtop rotary evaporator.
Features: motor head with LCD, rotating flask, condenser column,
water bath, vacuum port, lift mechanism, receiving flask.

Run: blender --background --python create_rotary_evaporator_pro.py
"""
import bpy, bmesh, math, os

# ── CONFIG ──
S = 1.0 / 1000  # mm → meters
SEG = 64

# Dimensions (mm)
BASE_W, BASE_D, BASE_H = 300, 250, 35
COLUMN_R, COLUMN_H = 18, 420
MOTOR_W, MOTOR_D, MOTOR_H = 140, 120, 100
BATH_R, BATH_H, BATH_WALL = 90, 85, 5
FLASK_R = 65
COND_R, COND_H = 22, 260
RECV_R = 45
LCD_W, LCD_H = 70, 35
KNOB_R = 8

def s(mm): return mm * S

# ── CLEANUP ──
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete()
for c in [bpy.data.materials, bpy.data.meshes, bpy.data.curves]:
    for x in list(c): c.remove(x)

# ── MATERIALS ──
def mat(name, col, metal=0.0, rough=0.5, emit=None, estr=0.0, alpha=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs['Base Color'].default_value = (*col, 1)
    p.inputs['Metallic'].default_value = metal
    p.inputs['Roughness'].default_value = rough
    if alpha < 1.0:
        p.inputs['Alpha'].default_value = alpha
        m.blend_method = 'BLEND' if hasattr(m, 'blend_method') else None
    if emit and 'Emission Color' in p.inputs:
        p.inputs['Emission Color'].default_value = (*emit, 1)
        p.inputs['Emission Strength'].default_value = estr
    return m

M = {
    'steel':    mat("BrushedSteel",      (.72,.71,.69), .90, .22),
    'dark':     mat("DarkHousing",       (.12,.12,.13), .10, .45),
    'panel':    mat("PanelSurface",      (.08,.08,.09), .05, .55),
    'lcd':      mat("LCD_Glow",          (.01,.04,.08),  0, .02, (.2,.5,1), 1.5),
    'chrome':   mat("ChromeAccent",      (.80,.80,.82), 1.0, .05),
    'rubber':   mat("RubberFoot",        (.04,.04,.04),  0, .92),
    'glass':    mat("BoroGlass",         (.88,.90,.92),  0, .02, None, 0, 0.3),
    'glass_s':  mat("GlassSolid",       (.85,.87,.90),  0, .08),
    'fluid':    mat("FluidGreen",        (.60,.78,.55),  0, .10, None, 0, 0.5),
    'bath_w':   mat("BathWater",         (.65,.80,.90),  0, .05, None, 0, 0.4),
    'white':    mat("WhiteLabel",        (.90,.90,.90),  0, .50),
    'label':    mat("PanelLabel",        (.15,.15,.16),  0, .40),
    'led_g':    mat("LED_Green",         (0,.1,0),       0, .10, (.1,.9,.2), 2),
    'led_r':    mat("LED_Red",           (.1,0,0),       0, .10, (.9,.1,.1), 2),
    'gasket':   mat("SealGasket",        (.06,.06,.07),  0, .70),
    'hinge':    mat("HingeMetal",        (.50,.50,.52), .80, .30),
    'knob':     mat("SatinKnob",         (.55,.54,.52), .75, .40),
}

# ── HELPERS ──
def assign(obj, m): obj.data.materials.append(m)
def smooth(o):
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.shade_smooth(); o.select_set(False)
def bevel(o, w=4, seg=3):
    b = o.modifiers.new("Bevel","BEVEL"); b.width = s(w); b.segments = seg
def da(): bpy.ops.object.select_all(action='DESELECT')

def cube(name, sx, sy, sz, loc, material, parent, bev_w=0, rot=None):
    bpy.ops.mesh.primitive_cube_add(size=1)
    o = bpy.context.active_object; o.name = name
    o.scale = (s(sx),s(sy),s(sz)); bpy.ops.object.transform_apply(scale=True)
    o.location = loc
    if rot: o.rotation_euler = rot
    if bev_w > 0: bevel(o, bev_w, 2)
    smooth(o); assign(o, material); o.parent = parent; da()
    return o

def cyl(name, r, depth, loc, material, parent, verts=32, rot=None):
    bpy.ops.mesh.primitive_cylinder_add(radius=s(r), depth=s(depth),
        vertices=verts, location=loc, rotation=rot or (0,0,0))
    o = bpy.context.active_object; o.name = name
    smooth(o); assign(o, material); o.parent = parent; da()
    return o

def sphere(name, r, loc, material, parent, seg=24, ring=12):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=s(r), segments=seg, ring_count=ring, location=loc)
    o = bpy.context.active_object; o.name = name
    smooth(o); assign(o, material); o.parent = parent; da()
    return o

def plane(name, sx, sy, loc, material, parent, rot=None):
    bpy.ops.mesh.primitive_plane_add(size=1)
    o = bpy.context.active_object; o.name = name
    o.scale = (s(sx), s(sy), 1); bpy.ops.object.transform_apply(scale=True)
    o.location = loc
    if rot: o.rotation_euler = rot
    smooth(o); assign(o, material); o.parent = parent; da()
    return o

# ── ROOT ──
bpy.ops.object.empty_add(type='PLAIN_AXES'); root = bpy.context.active_object
root.name = "RotaryEvaporator"; da()

# ═══════════════════════════════════════
# 1. BASE UNIT
# ═══════════════════════════════════════
cube("Base_Main", BASE_W, BASE_D, BASE_H, (0, 0, s(BASE_H/2)), M['dark'], root, bev_w=4)

# Rubber feet
for fi, (fx, fy) in enumerate([
    (BASE_W/2-25, BASE_D/2-25), (BASE_W/2-25, -BASE_D/2+25),
    (-BASE_W/2+25, BASE_D/2-25), (-BASE_W/2+25, -BASE_D/2+25),
]):
    bpy.ops.mesh.primitive_cone_add(radius1=s(12), radius2=s(10),
        depth=s(8), vertices=20, location=(s(fx), s(fy), s(-4)))
    f = bpy.context.active_object; f.name = f"Foot_{fi}"
    smooth(f); assign(f, M['rubber']); f.parent = root; da()

# ═══════════════════════════════════════
# 2. SUPPORT COLUMN & LIFT ARM
# ═══════════════════════════════════════
col_x = s(-BASE_W/2 + 40)
cyl("SupportColumn", COLUMN_R, COLUMN_H, (col_x, 0, s(BASE_H + COLUMN_H/2)), M['steel'], root)
cyl("ColumnCap", COLUMN_R + 4, 8, (col_x, 0, s(BASE_H + COLUMN_H + 4)), M['chrome'], root)
cyl("ColumnBase", COLUMN_R + 6, 12, (col_x, 0, s(BASE_H + 6)), M['chrome'], root)

# Lift slider block on column
slider_z = s(BASE_H + COLUMN_H * 0.5)
cube("LiftSlider", 50, 45, 65, (col_x, 0, slider_z), M['dark'], root, bev_w=3)

# Horizontal arm extending from slider
arm_len = 180
arm_end_x = col_x + s(arm_len)
cube("LiftArm", arm_len, 30, 25, (col_x + s(arm_len/2), 0, slider_z + s(10)), M['steel'], root, bev_w=2)

# ═══════════════════════════════════════
# 3. MOTOR HEAD UNIT (on end of arm)
# ═══════════════════════════════════════
motor_x = arm_end_x
motor_z = slider_z + s(10)

cube("MotorHead_Body", MOTOR_W, MOTOR_D, MOTOR_H,
    (motor_x, 0, motor_z), M['dark'], root, bev_w=4)

# LCD on front face of motor head
lcd_y = s(MOTOR_D/2 + 1)
lcd_z = motor_z + s(20)

cube("LCD_Bezel", LCD_W + 8, 3, LCD_H + 8,
    (motor_x, lcd_y, lcd_z), M['label'], root, bev_w=1)

plane("LCD_Screen", LCD_W, LCD_H,
    (motor_x, lcd_y + s(1.5), lcd_z), M['lcd'], root, rot=(-math.pi/2, 0, 0))

# Control knobs on motor head
for ki, (kx, kz, kn) in enumerate([
    (-30, -20, "Knob_Speed"),
    (30, -20, "Knob_Lift"),
]):
    cyl(kn, KNOB_R, 10, (motor_x + s(kx), lcd_y + s(5), motor_z + s(kz)),
        M['knob'], root, 24, (math.pi/2, 0, 0))
    # Knurling ring
    bpy.ops.mesh.primitive_torus_add(major_radius=s(KNOB_R+1), minor_radius=s(1),
        major_segments=24, minor_segments=6,
        location=(motor_x + s(kx), lcd_y + s(8), motor_z + s(kz)))
    kr = bpy.context.active_object; kr.name = f"KnobRing_{ki}"
    kr.rotation_euler = (math.pi/2, 0, 0)
    smooth(kr); assign(kr, M['chrome']); kr.parent = root; da()

# Buttons on motor head
for bi, (bx, bz, bn, bm) in enumerate([
    (-15, 25, "Btn_Start", M['led_g']),
    (0, 25, "Btn_Stop", M['led_r']),
    (15, 25, "Btn_Mode", M['label']),
]):
    cyl(bn, 4.5, 3, (motor_x + s(bx), lcd_y + s(1), motor_z + s(bz)),
        bm, root, 12, (math.pi/2, 0, 0))

# LEDs
cyl("LED_Power", 2, 2, (motor_x + s(30), lcd_y + s(1), lcd_z + s(LCD_H/2 + 5)),
    M['led_g'], root, 10, (math.pi/2, 0, 0))
cyl("LED_Heat", 2, 2, (motor_x + s(-30), lcd_y + s(1), lcd_z + s(LCD_H/2 + 5)),
    M['led_r'], root, 10, (math.pi/2, 0, 0))

# ═══════════════════════════════════════
# 4. ROTATING FLASK ASSEMBLY
# ═══════════════════════════════════════
# Drive shaft coming down from motor head at an angle
shaft_angle = math.radians(35)
shaft_x = motor_x
shaft_z = motor_z - s(MOTOR_H/2)

cyl("RotatingFlask_DriveShaft", 8, 60, (shaft_x, 0, shaft_z - s(25)),
    M['chrome'], root, 16, (shaft_angle, 0, 0))

# Flask clip adapter
clip_z = shaft_z - s(55)
cyl("RotatingFlask_ClipAdapter", 14, 20,
    (shaft_x + s(18), 0, clip_z), M['steel'], root, 20, (shaft_angle, 0, 0))

# Round-bottom flask (the rotating flask)
flask_x = shaft_x + s(35)
flask_z = clip_z - s(40)

sphere("RotatingFlask_Globe", FLASK_R, (flask_x, 0, flask_z), M['glass_s'], root, 32, 16)

# Flask neck
cyl("RotatingFlask_Neck", 12, 50, (shaft_x + s(22), 0, clip_z - s(5)),
    M['glass_s'], root, 16, (shaft_angle, 0, 0))

# Flask fluid inside
sphere("RotatingFlask_Fluid", FLASK_R - 8, (flask_x, 0, flask_z + s(5)),
    M['fluid'], root, 24, 12)

# ═══════════════════════════════════════
# 5. CONDENSER COLUMN
# ═══════════════════════════════════════
cond_x = motor_x + s(15)
cond_z = motor_z + s(MOTOR_H/2 + COND_H/2 + 5)

# Outer glass tube
cyl("Condenser_OuterTube", COND_R, COND_H,
    (cond_x, 0, cond_z), M['glass_s'], root, 32)
cyl("Condenser_InnerTube", COND_R - 6, COND_H - 20,
    (cond_x, 0, cond_z), M['glass'], root, 24)

# Spiral coil inside condenser
coil_turns = 8
coil_r = COND_R - 9
for i in range(coil_turns * 12):
    a = 2 * math.pi * i / 12
    cz = cond_z - s(COND_H/2 - 15) + s(i * (COND_H - 30) / (coil_turns * 12))
    cx = cond_x + s(coil_r * math.cos(a))
    cy = s(coil_r * math.sin(a))
    sphere(f"Condenser_Coil_{i}", 1.5, (cx, cy, cz), M['glass_s'], root, 6, 4)

# Coolant inlet/outlet ports on condenser
for pi, pz_off in enumerate([-COND_H/2 + 30, COND_H/2 - 30]):
    cyl(f"Condenser_Port_{pi}", 5, 18,
        (cond_x + s(COND_R + 8), 0, cond_z + s(pz_off)),
        M['glass_s'], root, 12, (0, math.pi/2, 0))
    # Barb fitting
    cyl(f"Condenser_Barb_{pi}", 3, 8,
        (cond_x + s(COND_R + 18), 0, cond_z + s(pz_off)),
        M['steel'], root, 10, (0, math.pi/2, 0))

# Top cap
cyl("Condenser_TopCap", COND_R + 3, 6, (cond_x, 0, cond_z + s(COND_H/2 + 3)),
    M['chrome'], root)

# Vacuum adapter at top
cyl("VacuumAdapter", 8, 25, (cond_x, 0, cond_z + s(COND_H/2 + 18)),
    M['glass_s'], root, 16)
cyl("VacuumPort", 5, 15, (cond_x + s(12), 0, cond_z + s(COND_H/2 + 25)),
    M['glass_s'], root, 12, (0, math.pi/4, 0))

# ═══════════════════════════════════════
# 6. RECEIVING FLASK
# ═══════════════════════════════════════
recv_x = cond_x
recv_z = motor_z - s(MOTOR_H/2 - 10)

# Collection adapter bend
cyl("ReceiveAdapter", 10, 30, (recv_x - s(10), 0, recv_z - s(10)),
    M['glass_s'], root, 14, (math.radians(20), 0, 0))

# Receiving flask
sphere("ReceivingFlask_Globe", RECV_R,
    (recv_x - s(15), 0, recv_z - s(60)), M['glass_s'], root, 24, 12)
cyl("ReceivingFlask_Neck", 10, 35,
    (recv_x - s(12), 0, recv_z - s(30)), M['glass_s'], root, 14, (math.radians(10), 0, 0))

# Collected fluid
sphere("ReceiveFluid", RECV_R - 10,
    (recv_x - s(15), 0, recv_z - s(55)), M['fluid'], root, 16, 8)

# ═══════════════════════════════════════
# 7. WATER BATH
# ═══════════════════════════════════════
bath_x = flask_x
bath_z = flask_z - s(FLASK_R + 5)

# Outer bath shell
cyl("Bath_Outer", BATH_R, BATH_H, (bath_x, 0, bath_z + s(BATH_H/2)),
    M['steel'], root)
# Inner cavity
cyl("Bath_Inner", BATH_R - BATH_WALL, BATH_H - BATH_WALL,
    (bath_x, 0, bath_z + s(BATH_H/2 + BATH_WALL/2)),
    M['steel'], root)
# Water surface
cyl("Bath_Water", BATH_R - BATH_WALL - 2, 3,
    (bath_x, 0, bath_z + s(BATH_H - 8)), M['bath_w'], root)
# Bath rim
bpy.ops.mesh.primitive_torus_add(major_radius=s(BATH_R), minor_radius=s(3),
    major_segments=32, minor_segments=8,
    location=(bath_x, 0, bath_z + s(BATH_H)))
br = bpy.context.active_object; br.name = "Bath_Rim"
smooth(br); assign(br, M['chrome']); br.parent = root; da()

# Bath heating element indicator
cyl("Bath_HeaterLED", 3, 2, (bath_x + s(BATH_R - 10), s(BATH_R - 10), bath_z + s(BATH_H + 2)),
    M['led_r'], root, 10)

# Bath lift jack (screw type)
cyl("Bath_LiftScrew", 10, 80, (bath_x, 0, bath_z - s(35)), M['chrome'], root, 16)
cube("Bath_LiftBase", 80, 80, 12, (bath_x, 0, bath_z - s(75)), M['dark'], root, bev_w=2)
cube("Bath_LiftPlatform", 65, 65, 8, (bath_x, 0, bath_z + s(2)), M['steel'], root, bev_w=1)

# ═══════════════════════════════════════
# 8. VACUUM & TUBING CONNECTIONS
# ═══════════════════════════════════════
# Vacuum valve on top
cyl("VacuumValve", 6, 12,
    (cond_x + s(COND_R + 30), 0, cond_z + s(COND_H/2 + 25)),
    M['dark'], root, 12, (0, math.pi/2, 0))
cube("VacuumValveHandle", 3, 16, 3,
    (cond_x + s(COND_R + 38), 0, cond_z + s(COND_H/2 + 25)),
    M['knob'], root, bev_w=0.5)

# ═══════════════════════════════════════
# 9. REAR PORTS (on motor head back)
# ═══════════════════════════════════════
rear_y = s(-MOTOR_D/2 - 1)
cube("Rear_PortBay", 80, 3, 50,
    (motor_x, rear_y, motor_z), M['panel'], root, bev_w=1)
cube("Rear_PowerInlet", 24, 2, 16,
    (motor_x - s(20), rear_y - s(1), motor_z + s(8)), M['label'], root, bev_w=0.8)
cube("Rear_PowerSwitch", 12, 2.5, 8,
    (motor_x + s(20), rear_y - s(1), motor_z + s(8)), M['label'], root, bev_w=0.5)
cyl("Rear_Fuse", 4.5, 3,
    (motor_x + s(20), rear_y - s(0.5), motor_z - s(8)),
    M['label'], root, 12, rot=(math.pi/2, 0, 0))
cube("Rear_USB", 12, 1, 5,
    (motor_x - s(20), rear_y - s(1), motor_z - s(12)), M['label'], root, bev_w=0.3)

# ═══════════════════════════════════════
# 10. BRAND LABELS
# ═══════════════════════════════════════
cube("BrandBadge", 45, 0.6, 12,
    (motor_x, s(MOTOR_D/2 + 0.5), motor_z + s(MOTOR_H/2 - 10)), M['label'], root, bev_w=0.4)
cube("SerialPlate", 30, 0.5, 8,
    (col_x + s(COLUMN_R + 0.5), 0, s(BASE_H + 40)), M['white'], root)

# Clamp at column joint
cube("ColumnClamp", 55, 55, 15,
    (col_x, 0, slider_z - s(40)), M['steel'], root, bev_w=2)
cube("ClampLever", 8, 40, 8,
    (col_x + s(30), 0, slider_z - s(40)), M['dark'], root, bev_w=1)

# ═══════════════════════════════════════
# EXPORT
# ═══════════════════════════════════════
output = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "models", "rotary_evaporator_pro.glb"
)
os.makedirs(os.path.dirname(output), exist_ok=True)

print("=== Object Names ===")
for obj in bpy.context.scene.objects:
    if obj.type == 'MESH':
        print(f"  {obj.name}")
print("====================")

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(
    filepath=output,
    export_format='GLB',
    export_apply=False,
    use_selection=True,
    export_materials='EXPORT',
    export_draco_mesh_compression_enable=False
)
sz = os.path.getsize(output) / 1024 / 1024
print(f"✅ Rotary Evaporator Pro exported: {output} ({sz:.2f} MB)")
print(f"   Objects: {len(bpy.context.scene.objects)}, Materials: {len(bpy.data.materials)}")
