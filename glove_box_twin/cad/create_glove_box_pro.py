"""
SREdesigns — Pro-Fidelity Glove Box v1
========================================
Inert atmosphere glove box with acrylic front panel,
port holes with gloves, antechamber, gas connections,
and pressure controller.

Run: blender --background --python create_glove_box_pro.py
"""
import bpy, bmesh, math, os

S = 1.0 / 1000; SEG = 64
BODY_W, BODY_D, BODY_H = 1000, 650, 600
BASE_H = 800  # on legs, working height ~800mm
WINDOW_W, WINDOW_H = 850, 450
GLOVE_PORT_R = 75

def s(mm): return mm * S

bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete()
for c in [bpy.data.materials, bpy.data.meshes, bpy.data.curves]:
    for x in list(c): c.remove(x)

def mat(name, col, metal=0.0, rough=0.5, emit=None, estr=0.0, alpha=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs['Base Color'].default_value = (*col, 1)
    p.inputs['Metallic'].default_value = metal; p.inputs['Roughness'].default_value = rough
    if alpha < 1.0: p.inputs['Alpha'].default_value = alpha
    if emit and 'Emission Color' in p.inputs:
        p.inputs['Emission Color'].default_value = (*emit, 1)
        p.inputs['Emission Strength'].default_value = estr
    return m

M = {
    'body':    mat("BoxBody",        (.72,.72,.70), .10, .40),
    'dark':    mat("DarkPanel",      (.08,.08,.09), .05, .55),
    'panel':   mat("ControlPanel",   (.12,.12,.14), .05, .45),
    'lcd':     mat("LCD_Glow",       (.005,.015,.06), 0, .02, (.2,.5,1), 3.0),
    'chrome':  mat("ChromeAccent",   (.80,.80,.82), 1.0, .05),
    'rubber':  mat("RubberFoot",     (.04,.04,.04),  0, .92),
    'acrylic': mat("AcrylicWindow",  (.92,.93,.95),  0, .02, None, 0, 0.2),
    'glove':   mat("ButylGlove",     (.08,.06,.04),  0, .85),
    'port':    mat("PortRing",       (.65,.65,.67), .80, .25),
    'chamber': mat("ChamberSteel",   (.68,.68,.66), .90, .15),
    'gasket':  mat("SealGasket",     (.06,.06,.07),  0, .70),
    'label':   mat("PanelLabel",     (.15,.15,.16),  0, .40),
    'white':   mat("WhiteLabel",     (.90,.90,.90),  0, .50),
    'led_g':   mat("LED_Green",      (0,.1,0),       0, .10, (.1,.9,.2), 2),
    'led_y':   mat("LED_Yellow",     (.1,.08,0),     0, .10, (.9,.8,.1), 2),
    'valve':   mat("GasValve",       (.65,.60,.30), .70, .30),
    'frame':   mat("FrameSteel",     (.55,.55,.57), .50, .35),
}

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

def plane(name, sx, sy, loc, material, parent, rot=None):
    bpy.ops.mesh.primitive_plane_add(size=1)
    o = bpy.context.active_object; o.name = name
    o.scale = (s(sx), s(sy), 1); bpy.ops.object.transform_apply(scale=True)
    o.location = loc
    if rot: o.rotation_euler = rot
    smooth(o); assign(o, material); o.parent = parent; da()
    return o

bpy.ops.object.empty_add(type='PLAIN_AXES'); root = bpy.context.active_object
root.name = "GloveBox"; da()

box_base = s(BASE_H)
top_z = box_base + s(BODY_H)

# 1. SUPPORT FRAME (steel legs)
for fi, (fx, fy) in enumerate([
    (BODY_W/2 - 40, BODY_D/2 - 40), (BODY_W/2 - 40, -BODY_D/2 + 40),
    (-BODY_W/2 + 40, BODY_D/2 - 40), (-BODY_W/2 + 40, -BODY_D/2 + 40),
]):
    cube(f"Leg_{fi}", 40, 40, BASE_H,
        (s(fx), s(fy), s(BASE_H/2)), M['frame'], root, bev_w=2)
    cyl(f"Foot_{fi}", 22, 8, (s(fx), s(fy), s(4)), M['rubber'], root, 16)

# Cross braces
cube("Brace_Front", BODY_W - 80, 30, 30,
    (0, s(BODY_D/2 - 40), s(BASE_H * 0.3)), M['frame'], root, bev_w=1)
cube("Brace_Back", BODY_W - 80, 30, 30,
    (0, s(-BODY_D/2 + 40), s(BASE_H * 0.3)), M['frame'], root, bev_w=1)

# 2. MAIN CHAMBER
cube("Chamber_Main", BODY_W, BODY_D, BODY_H,
    (0, 0, box_base + s(BODY_H/2)), M['body'], root, bev_w=5)

# Interior (stainless)
cube("Chamber_Interior", BODY_W - 30, BODY_D - 30, BODY_H - 30,
    (0, 0, box_base + s(BODY_H/2)), M['chamber'], root, bev_w=2)

# 3. FRONT WINDOW (large acrylic panel)
front_y = s(BODY_D/2)
cube("FrontWindow", WINDOW_W, 12, WINDOW_H,
    (0, front_y + s(6), box_base + s(BODY_H/2 + 20)),
    M['acrylic'], root, bev_w=3)

# Window frame
cube("WindowFrame_Top", WINDOW_W + 20, 8, 15,
    (0, front_y + s(4), box_base + s(BODY_H/2 + 20 + WINDOW_H/2 + 7)),
    M['dark'], root, bev_w=1)
cube("WindowFrame_Bot", WINDOW_W + 20, 8, 15,
    (0, front_y + s(4), box_base + s(BODY_H/2 + 20 - WINDOW_H/2 - 7)),
    M['dark'], root, bev_w=1)

# 4. GLOVE PORTS (2 ports in front window)
for side, lbl in [(-1, "L"), (1, "R")]:
    px = s(side * BODY_W/4)
    pz = box_base + s(BODY_H/2)
    # Port ring
    bpy.ops.mesh.primitive_torus_add(major_radius=s(GLOVE_PORT_R), minor_radius=s(8),
        major_segments=32, minor_segments=8, location=(px, front_y + s(12), pz))
    pr = bpy.context.active_object; pr.name = f"GlovePort_{lbl}"
    pr.rotation_euler = (math.pi/2, 0, 0)
    smooth(pr); assign(pr, M['port']); pr.parent = root; da()

    # Glove (simplified as tapered cylinder)
    cyl(f"Glove_{lbl}", GLOVE_PORT_R - 10, 250,
        (px, front_y + s(120), pz - s(40)), M['glove'], root, 16, (math.radians(70), 0, s(side * 0.1)))

# 5. ANTECHAMBER (right side)
ante_x = s(BODY_W/2)
ante_z = box_base + s(BODY_H/2)
cube("Antechamber", 250, 250, 250,
    (ante_x + s(140), 0, ante_z), M['body'], root, bev_w=4)
# Ante door
cyl("AnteDoor", 80, 15,
    (ante_x + s(270), 0, ante_z), M['body'], root, 32, (0, math.pi/2, 0))
# Ante handle
cube("AnteHandle", 8, 60, 8,
    (ante_x + s(280), 0, ante_z + s(60)), M['chrome'], root, bev_w=2)
# Ante gasket
bpy.ops.mesh.primitive_torus_add(major_radius=s(82), minor_radius=s(4),
    major_segments=32, minor_segments=8, location=(ante_x + s(265), 0, ante_z))
ag = bpy.context.active_object; ag.name = "AnteGasket"
ag.rotation_euler = (0, math.pi/2, 0)
smooth(ag); assign(ag, M['gasket']); ag.parent = root; da()

# 6. GAS CONNECTIONS (rear)
rear_y = s(-BODY_D/2 - 1)
for gi, (gx, gn) in enumerate([(-100, "N2_Inlet"), (0, "Vacuum"), (100, "Exhaust")]):
    cyl(f"GasPort_{gn}", 10, 20,
        (s(gx), rear_y - s(8), box_base + s(BODY_H - 80)),
        M['chrome'], root, 12, (math.pi/2, 0, 0))
    # Valve
    cyl(f"GasValve_{gn}", 6, 12,
        (s(gx), rear_y - s(20), box_base + s(BODY_H - 80)),
        M['valve'], root, 10, (math.pi/2, 0, 0))

# 7. CONTROL PANEL (top-right front)
cp_z = top_z + s(5)
cube("ControlPanel", 200, 120, 40,
    (s(BODY_W/4), s(BODY_D/4), cp_z + s(20)), M['panel'], root, bev_w=3)

lcd_z2 = cp_z + s(42)
cube("LCD_Bezel", 100, 50, 2,
    (s(BODY_W/4), s(BODY_D/4), lcd_z2), M['dark'], root, bev_w=1.2)
plane("LCD_Screen", 96, 46,
    (s(BODY_W/4), s(BODY_D/4), lcd_z2 + s(1)), M['lcd'], root)

# Pressure/O2 LEDs
cyl("LED_Pressure", 4, 3, (s(BODY_W/4 + 60), s(BODY_D/4), lcd_z2), M['led_g'], root, 10)
cyl("LED_O2", 4, 3, (s(BODY_W/4 + 75), s(BODY_D/4), lcd_z2), M['led_y'], root, 10)

# 8. BRAND
cube("BrandBadge", 80, 0.6, 14,
    (s(-BODY_W/4), front_y + s(0.5), top_z - s(15)), M['label'], root, bev_w=0.4)

# EXPORT
output = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "models", "glove_box_pro.glb")
os.makedirs(os.path.dirname(output), exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=output, export_format='GLB', export_apply=False,
    use_selection=True, export_materials='EXPORT', export_draco_mesh_compression_enable=False)
sz = os.path.getsize(output) / 1024 / 1024
print(f"✅ Glove Box Pro exported: {output} ({sz:.2f} MB)")
print(f"   Objects: {len(bpy.context.scene.objects)}, Materials: {len(bpy.data.materials)}")
