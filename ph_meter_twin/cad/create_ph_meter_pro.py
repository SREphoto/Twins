"""
SREdesigns — Pro-Fidelity Benchtop pH Meter v2
================================================
Complete redesign for correct orientation and proportions.
Front face (+Y in Blender → -Z in Three.js) holds the LCD and controls.
Rear face (-Y → +Z) hold data ports.
Electrode arm mounted on the right side with properly proportioned bracket.

Run: blender --background --python create_ph_meter_pro.py
"""
import bpy, bmesh, math, os

# ── CONFIG ──
S = 1.0 / 1000  # mm → meters
SEG = 64

# Dimensions (mm) - compact benchtop form factor
BODY_W, BODY_D, BODY_H = 240, 200, 70
BASE_H = 10
LCD_W, LCD_H = 110, 48
FRONT_PANEL_TILT = math.radians(15)  # angled front face
PROBE_R, PROBE_L = 5.5, 150
ARM_POST_H = 200
ARM_REACH = 150

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
    if emit and 'Emission Color' in p.inputs:
        p.inputs['Emission Color'].default_value = (*emit, 1)
        p.inputs['Emission Strength'].default_value = estr
    return m

M = {
    'body':     mat("InstrumentBody",    (.75,.74,.72), .10, .40),
    'dark':     mat("DarkPanel",         (.08,.08,.09), .05, .55),
    'panel':    mat("ControlPanel",      (.12,.12,.14), .05, .45),
    'lcd':      mat("LCD_Glow",          (.005,.015,.06), 0, .02, (.2,.5,1.0), 3.0),
    'chrome':   mat("ChromeAccent",      (.80,.80,.82), 1.0, .05),
    'rubber':   mat("RubberFoot",        (.04,.04,.04),  0, .92),
    'glass':    mat("GlassElectrode",    (.82,.84,.88),  0, .04),
    'bnc':      mat("BNCConnector",      (.55,.55,.57), .80, .25),
    'probe_tip':mat("ProbeTipAg",        (.62,.62,.64), .70, .30),
    'white':    mat("WhiteLabel",        (.90,.90,.90),  0, .50),
    'label':    mat("PanelLabel",        (.15,.15,.16),  0, .40),
    'led_g':    mat("LED_Green",         (0,.1,0),       0, .10, (.1,.9,.2), 2),
    'led_y':    mat("LED_Yellow",        (.1,.08,0),     0, .10, (.9,.8,.1), 2),
    'btn_blue': mat("BtnBlue",           (.15,.25,.50),  0, .50),
    'btn_grey': mat("BtnGrey",           (.30,.30,.32),  0, .50),
    'btn_grn':  mat("BtnGreen",          (.10,.35,.15),  0, .50),
    'bottle':   mat("BufferBottle",      (.85,.88,.90),  0, .08),
    'fluid_4':  mat("Buffer_pH4",        (.85,.30,.25),  0, .15),
    'fluid_7':  mat("Buffer_pH7",        (.25,.70,.30),  0, .15),
    'fluid_10': mat("Buffer_pH10",       (.25,.35,.80),  0, .15),
    'stirrer':  mat("StirrerPlate",      (.65,.65,.67), .50, .35),
    'magnet':   mat("StirBarTeflon",     (.90,.90,.92),  0, .30),
    'cable':    mat("CableBlack",        (.05,.05,.06),  0, .80),
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

def sphere(name, r, loc, material, parent, seg=20, ring=10):
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
root.name = "PHMeter"; da()

# ═══════════════════════════════════════
# 1. MAIN BODY — compact rectangle
# ═══════════════════════════════════════
top_z = s(BASE_H + BODY_H)

cube("Body_Main", BODY_W, BODY_D, BODY_H,
    (0, 0, s(BASE_H + BODY_H/2)), M['body'], root, bev_w=5)

# Base rim
cube("BaseRim", BODY_W + 6, BODY_D + 6, BASE_H,
    (0, 0, s(BASE_H/2)), M['dark'], root, bev_w=3)

# Rubber feet (4 corners)
for fi, (fx, fy) in enumerate([
    (BODY_W/2-20, BODY_D/2-18), (BODY_W/2-20, -BODY_D/2+18),
    (-BODY_W/2+20, BODY_D/2-18), (-BODY_W/2+20, -BODY_D/2+18),
]):
    cyl(f"Foot_{fi}", 8, 5, (s(fx), s(fy), s(2.5)), M['rubber'], root, 16)

# ═══════════════════════════════════════
# 2. FRONT CONTROL PANEL — angled on the FRONT face (+Y)
#    In Blender: +Y = front → In Three.js: -Z = facing camera
# ═══════════════════════════════════════
front_y = s(BODY_D/2 + 1)  # just outside front face
panel_z = s(BASE_H + BODY_H/2 + 8)  # upper-center of front face
tilt = FRONT_PANEL_TILT

# Dark control panel background (sits on front surface, angled slightly back)
cube("ControlPanel", BODY_W - 20, 3, 55,
    (0, front_y, panel_z), M['panel'], root, bev_w=2, rot=(tilt, 0, 0))

# LCD Display — front-facing on the control panel
lcd_y = front_y + s(16)
lcd_z = panel_z + s(4)

cube("LCD_Bezel", BODY_W - 20, 1.5, BODY_H - 12,
    (0, lcd_y, lcd_z), M['dark'], root, bev_w=1.5, rot=(tilt, 0, 0))

# We use a plane for perfect mapping (0,0 to 1,1).
plane("LCD_Screen", BODY_W - 22, BODY_H - 14,
    (0, lcd_y + s(1), lcd_z), M['lcd'], root, rot=(-math.pi/2 + tilt, 0, 0))
# ═══════════════════════════════════════
# 4. INTEGRATED MAGNETIC STIRRER (recessed into top surface)
# ═══════════════════════════════════════
stir_x = s(10)  # slightly right of center
stir_y = s(20)  # center-forward on top

# Stirrer well (recessed ring on top)
cyl("Stirrer_Plate", 55, 4,
    (stir_x, stir_y, top_z - s(2)), M['stirrer'], root, 32)
# Center marking
cyl("Stirrer_CenterMark", 4, 0.5,
    (stir_x, stir_y, top_z), M['white'], root, 16)
# Concentric guide ring
bpy.ops.mesh.primitive_torus_add(major_radius=s(30), minor_radius=s(1),
    major_segments=32, minor_segments=6, location=(stir_x, stir_y, top_z))
tr = bpy.context.active_object; tr.name = "Stirrer_GuideRing"
smooth(tr); assign(tr, M['dark']); tr.parent = root; da()

# Stir bar
cube("StirBar", 22, 4, 4,
    (stir_x, stir_y, top_z + s(1)), M['magnet'], root, bev_w=1.5)

# Speed control knob (front-right of top surface)
cyl("Knob_StirSpeed", 10, 10,
    (s(BODY_W/2 - 30), s(BODY_D/2 - 30), top_z + s(5)), M['chrome'], root, 24)
# Knob grip lines
for i in range(12):
    a = 2 * math.pi * i / 12
    kx = s(BODY_W/2 - 30) + s(9 * math.cos(a))
    ky = s(BODY_D/2 - 30) + s(9 * math.sin(a))
    cyl(f"KnobGrip_{i}", 0.5, 11,
        (kx, ky, top_z + s(5)), M['dark'], root, 4)

# ═══════════════════════════════════════
# 5. ELECTRODE ARM — mounted on right side
# ═══════════════════════════════════════
arm_x = s(BODY_W/2 + 20)

# Vertical post
cyl("ProbeArm_Post", 8, ARM_POST_H,
    (arm_x, 0, s(BASE_H + ARM_POST_H/2)), M['chrome'], root, 16)

# Post base plate
cyl("ProbeArm_Base", 22, 8,
    (arm_x, 0, s(BASE_H + 4)), M['dark'], root, 20)

# Post cap
cyl("ProbeArm_Cap", 10, 5,
    (arm_x, 0, s(BASE_H + ARM_POST_H + 2.5)), M['chrome'], root, 16)

# Horizontal arm (extends over the stirrer area)
cube("ProbeArm_Horizontal", ARM_REACH, 12, 12,
    (arm_x - s(ARM_REACH/2 - 5), 0, s(BASE_H + ARM_POST_H - 15)),
    M['chrome'], root, bev_w=2)

# Clamp block at end of arm
clamp_x = arm_x - s(ARM_REACH - 25)
clamp_z = s(BASE_H + ARM_POST_H - 15)
cube("ProbeArm_Clamp", 16, 16, 22,
    (clamp_x, 0, clamp_z - s(12)), M['dark'], root, bev_w=1.5)
# Clamp screw
cyl("ProbeArm_ClampScrew", 3, 10,
    (clamp_x + s(10), 0, clamp_z - s(12)), M['chrome'], root, 10, (0, math.pi/2, 0))

# ═══════════════════════════════════════
# 6. ELECTRODE PROBE — hanging from clamp
# ═══════════════════════════════════════
probe_x = clamp_x
probe_top_z = clamp_z - s(25)

# Probe connector (top)
cyl("Probe_Connector", PROBE_R + 2, 14,
    (probe_x, 0, probe_top_z + s(2)), M['dark'], root, 16)

# Probe body (glass)
cyl("Probe_Body", PROBE_R, PROBE_L,
    (probe_x, 0, probe_top_z - s(PROBE_L/2)), M['glass'], root, 20)

# Probe tip (Ag/AgCl)
cyl("Probe_Tip", PROBE_R - 1, 8,
    (probe_x, 0, probe_top_z - s(PROBE_L) - s(2)), M['probe_tip'], root, 16)

# BNC cable from probe upward
cyl("Probe_Cable", 2.5, 60,
    (probe_x + s(10), 0, probe_top_z + s(30)), M['cable'], root, 8, (math.radians(20), 0, 0))

# ═══════════════════════════════════════
# 7. BNC / ATC PORTS ON RIGHT SIDE
# ═══════════════════════════════════════
port_x = s(BODY_W/2 + 1)
port_z = s(BASE_H + BODY_H/2)

# BNC input
cyl("BNC_Input", 5, 10,
    (port_x, s(20), port_z + s(10)), M['bnc'], root, 16, (0, math.pi/2, 0))
cyl("BNC_Ring", 7, 3,
    (port_x + s(3), s(20), port_z + s(10)), M['chrome'], root, 16, (0, math.pi/2, 0))

# ATC port
cyl("ATC_Port", 4, 8,
    (port_x, s(-15), port_z - s(5)), M['bnc'], root, 12, (0, math.pi/2, 0))

# ═══════════════════════════════════════
# 8. BUFFER BOTTLES (beside the meter, to the left at -X)
# ═══════════════════════════════════════
for bi, (by_off, fluid_m, lbl) in enumerate([
    (-35, M['fluid_4'], "pH4"),
    (0, M['fluid_7'], "pH7"),
    (35, M['fluid_10'], "pH10"),
]):
    bot_x = s(-BODY_W/2 - 28)
    cyl(f"Buffer_{lbl}_Body", 13, 50,
        (bot_x, s(by_off), s(BASE_H + 25)), M['bottle'], root, 16)
    cyl(f"Buffer_{lbl}_Cap", 7, 8,
        (bot_x, s(by_off), s(BASE_H + 50 + 4)), fluid_m, root, 12)
    cyl(f"Buffer_{lbl}_Fluid", 11, 32,
        (bot_x, s(by_off), s(BASE_H + 18)), fluid_m, root, 14)

# ═══════════════════════════════════════
# 9. REAR PORTS (-Y side)
# ═══════════════════════════════════════
rear_y = s(-BODY_D/2 - 1)
rear_z = s(BASE_H + BODY_H/2)

cube("Rear_PortBay", 90, 2.5, 30, (0, rear_y, rear_z), M['dark'], root, bev_w=1)
cube("Rear_PowerInlet", 22, 1.5, 14, (s(-25), rear_y - s(0.5), rear_z + s(3)), M['label'], root, bev_w=0.6)
cube("Rear_USB", 11, 1, 5, (s(10), rear_y - s(0.5), rear_z + s(8)), M['label'], root, bev_w=0.3)
cube("Rear_RS232", 16, 1, 8, (s(10), rear_y - s(0.5), rear_z - s(4)), M['label'], root, bev_w=0.4)
cube("Rear_PowerSwitch", 10, 2, 7, (s(30), rear_y - s(0.5), rear_z), M['label'], root, bev_w=0.4)

# ═══════════════════════════════════════
# 10. BRAND LABELS
# ═══════════════════════════════════════
cube("BrandBadge", 45, 0.6, 8,
    (s(55), front_y + s(0.5), s(BASE_H + BODY_H - 8)), M['label'], root, bev_w=0.4)
cube("SerialPlate", 30, 0.5, 7,
    (0, rear_y + s(0.5), s(BASE_H + 15)), M['white'], root)


# ═══════════════════════════════════════
# EXPORT
# ═══════════════════════════════════════
output = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "models", "ph_meter_pro.glb"
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
print(f"✅ pH Meter Pro exported: {output} ({sz:.2f} MB)")
print(f"   Objects: {len(bpy.context.scene.objects)}, Materials: {len(bpy.data.materials)}")
