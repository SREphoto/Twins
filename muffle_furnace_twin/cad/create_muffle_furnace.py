import bpy, bmesh, math, os

# ── CONFIG ──
S = 1.0 / 1000  # mm → meters
SEG = 64

BODY_W = 340
BODY_D = 400
BODY_H = 420
BASE_H = 20

WALL_L = 60
WALL_R = 60
WALL_B = 50
WALL_T = 150
WALL_BACK = 70

def s(mm): return mm * S

# ── CLEANUP ──
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete()
for c in [bpy.data.materials, bpy.data.meshes, bpy.data.curves]:
    for x in list(c): c.remove(x)

# ── MATERIALS ──
def mat(name, col, metal=0.0, rough=0.5, emit=None, estr=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs['Base Color'].default_value = (*col, 1)
    p.inputs['Metallic'].default_value = metal
    p.inputs['Roughness'].default_value = rough
    if emit and 'Emission Color' in p.inputs:
        p.inputs['Emission Color'].default_value = (*emit, 1)
        p.inputs['Emission Strength'].default_value = estr
    return m

M = {
    'alum':    mat("BrushedAluminium", (.7,.7,.7), .6, .4),
    'housing': mat("PaintedHousing",   (.20,.20,.22), 0.1, .45), # Darker sleek grey 
    'dark':    mat("DarkCharcoal",     (.05,.05,.06), 0.3, .35),

    'lcd':     mat("LCD_Glow",         (.01,.04,.08), 0, .02, (.2,.8,1), 1.5),
    'chrome':  mat("ChromeKnob",       (.8,.8,.8), 1, .1),
    'rubber':  mat("RubberFoot",       (.04,.04,.04), 0, .9),
    'ceramic': mat("CeramicLiner",     (.9,.88,.85), 0, .95),
    'heater':  mat("HeatElement",      (.2,.2,.2), .5, .8, (1.0, 0.4, 0.05), 15.0),
    'led_g':   mat("LED_Green",        (0,.1,0),      0, .1, (.1,.9,.2), 2),
    'led_r':   mat("LED_Red",          (.1,0,0),      0, .1, (.9,.1,.1), 2),
    'label':   mat("PanelLabel",       (.15,.15,.16), 0, .4),
    'white':   mat("WhiteText",        (.9,.9,.9),    0, .5),
}

# ── HELPERS ──
def assign(obj, m): obj.data.materials.append(m)
def smooth(o):
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.shade_smooth(); o.select_set(False)
def bevel(o, w=4, seg=3):
    b = o.modifiers.new("Bevel","BEVEL"); b.width = s(w); b.segments = seg
def da(): bpy.ops.object.select_all(action='DESELECT')

def ptext(name, text, size, loc, material, parent, rot=None):
    bpy.ops.object.text_add(location=loc, rotation=rot or (0,0,0))
    t = bpy.context.active_object
    t.name = name
    t.data.body = text
    t.data.size = s(size)
    t.data.extrude = s(0.4)
    t.data.align_x = 'CENTER'
    t.data.align_y = 'CENTER'
    smooth(t); assign(t, material); t.parent = parent; da()
    return t

def plane(name, sx, sy, loc, material, parent, rot=None):
    bpy.ops.mesh.primitive_plane_add(size=1)
    o = bpy.context.active_object; o.name = name
    o.scale = (s(sx), s(sy), 1); bpy.ops.object.transform_apply(scale=True)
    o.location = loc
    if rot: o.rotation_euler = rot
    smooth(o); assign(o, material); o.parent = parent; da()
    return o

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

# ── ROOT EMPTY ──
bpy.ops.object.empty_add(type='PLAIN_AXES'); root = bpy.context.active_object
root.name = "muffle_furnace"; da()

# ═══════════════════════════════════════════════
# GEOMETRY
# ═══════════════════════════════════════════════

Z_CH_CENTER = BASE_H + WALL_B + (BODY_H - WALL_B - WALL_T)/2
CH_W = BODY_W - WALL_L - WALL_R
CH_H = BODY_H - WALL_B - WALL_T
CH_D = BODY_D - WALL_BACK

# 1. Base
cube("Base", BODY_W + 10, BODY_D + 10, BASE_H, (0, 0, s(BASE_H/2)), M['dark'], root, bev_w=2)
# Casters instead of feet
for fi, (fx, fy) in enumerate([(1,1),(1,-1),(-1,-1),(-1,1)]):
    px, py = s((BODY_W/2 - 25)*fx), s((BODY_D/2 - 25)*fy)
    cube(f"CasterBracket_{fi}", 20, 20, 15, (px, py, s(-15)), M['housing'], root)
    cyl(f"CasterWheel_{fi}", 16, 12, (px, py, s(-25)), M['dark'], root, rot=(0, math.pi/2, 0))

# 2. Main Housing BLOCKS (creates hollow chamber without booleans)
# Using Boolean for a single seamless piece

# Outer Box (Seamless)
cube("Housing_Main", BODY_W, BODY_D, BODY_H, (0, 0, s(BASE_H + BODY_H/2)), M['housing'], root, bev_w=3)

# Cutout tool for the inner chamber opening
cutout_d = CH_D + 50
cutout_y = BODY_D/2 - cutout_d/2 + 20
cube("Housing_Cutout", CH_W, cutout_d, CH_H, (0, s(cutout_y), s(Z_CH_CENTER)), M['alum'], None)

# Apply Boolean 
hm = bpy.data.objects["Housing_Main"]
mod = hm.modifiers.new("Boolean", 'BOOLEAN')
mod.operation = 'DIFFERENCE'
mod.object = bpy.data.objects["Housing_Cutout"]
mod.solver = 'EXACT'

bpy.context.view_layer.objects.active = hm
bpy.ops.object.modifier_apply(modifier="Boolean")
bpy.data.objects.remove(bpy.data.objects["Housing_Cutout"])

# 3. Chamber Ceramic Liner
LT = 12 # liner thickness
LX_W = CH_W - 2*LT
LX_H = CH_H - 2*LT
LX_D = CH_D - LT

cube("Liner_L", LT, LX_D, CH_H, (s(-CH_W/2 + LT/2), s(BODY_D/2 - LX_D/2), s(Z_CH_CENTER)), M['ceramic'], root)
cube("Liner_R", LT, LX_D, CH_H, (s(CH_W/2 - LT/2), s(BODY_D/2 - LX_D/2), s(Z_CH_CENTER)), M['ceramic'], root)
cube("Liner_T", LX_W, LX_D, LT, (0, s(BODY_D/2 - LX_D/2), s(Z_CH_CENTER + CH_H/2 - LT/2)), M['ceramic'], root)
cube("Liner_B", LX_W, LX_D, LT, (0, s(BODY_D/2 - LX_D/2), s(Z_CH_CENTER - CH_H/2 + LT/2)), M['ceramic'], root)
cube("Liner_Back", LX_W, LT, LX_H, (0, s(BODY_D/2 - CH_D + LT/2), s(Z_CH_CENTER)), M['ceramic'], root)

# 4. Chamber Inside Rails & 3 Wire Trays
levels = [-70, 0, 70]
for lv, dz in enumerate(levels):
    lz = Z_CH_CENTER + dz
    cube(f"LinerRail_L{lv}", 6, LX_D, 6, (s(-CH_W/2 + LT + 3), s(BODY_D/2 - LX_D/2), s(lz)), M['ceramic'], root)
    cube(f"LinerRail_R{lv}", 6, LX_D, 6, (s(CH_W/2 - LT - 3), s(BODY_D/2 - LX_D/2), s(lz)), M['ceramic'], root)

    # Wire tray object
    bpy.ops.object.empty_add(type='PLAIN_AXES')
    tray_root = bpy.context.active_object
    tray_root.name = f"WireTray_Root_{lv}"
    tray_root.location = (0, s(BODY_D/2 - LX_D/2), s(lz + 4))
    tray_root.parent = root
    da()

    tray_w = CH_W - 2*LT - 14
    tray_d = LX_D - 10
    cube(f"TrayWire_F{lv}", tray_w, 3, 3, (0, s(-tray_d/2), 0), M['chrome'], tray_root)
    cube(f"TrayWire_B{lv}", tray_w, 3, 3, (0, s(tray_d/2), 0), M['chrome'], tray_root)
    cube(f"TrayWire_L{lv}", 3, tray_d, 3, (s(-tray_w/2), 0, 0), M['chrome'], tray_root)
    cube(f"TrayWire_R{lv}", 3, tray_d, 3, (s(tray_w/2), 0, 0), M['chrome'], tray_root)

    for i in range(11):
        cube(f"TrayWireY{lv}_{i}", 1.5, tray_d, 1.5, (s(-tray_w/2 + 3 + i*(tray_w-6)/10), 0, s(0.75)), M['alum'], tray_root)
    for i in range(16):
        cube(f"TrayWireX{lv}_{i}", tray_w, 1.5, 1.5, (0, s(-tray_d/2 + 3 + i*(tray_d-6)/15), s(-0.75)), M['alum'], tray_root)

# 5. Top Control Panel (Restored flat design)
Z_CP = BASE_H + BODY_H - WALL_T/2
cube("CP_Panel_Dark", 240, 4, 100, (0, s(BODY_D/2 + 1), s(Z_CP)), M['dark'], root, bev_w=1)

# Large LCD Backing
cube("LCD_Bezel", 140, 2, 70, (s(-40), s(BODY_D/2 + 2), s(Z_CP)), M['dark'], root)
# The actual screen plane we will texture in Three.js
# Rotated -90 deg on X so the +Z normal faces +Y (front)
plane("LCD_Screen", 136, 66, (s(-40), s(BODY_D/2 + 3.1), s(Z_CP)), M['lcd'], root, rot=(-math.pi/2, 0, 0))

# Buttons
cyl("Btn_TempUp", 6, 4, (s(50), s(BODY_D/2 + 2), s(Z_CP + 20)), M['led_g'], root, rot=(math.pi/2, 0, 0))
cyl("Btn_TempDn", 6, 4, (s(50), s(BODY_D/2 + 2), s(Z_CP - 20)), M['led_r'], root, rot=(math.pi/2, 0, 0))
cyl("Btn_TimeUp", 6, 4, (s(80), s(BODY_D/2 + 2), s(Z_CP + 20)), M['led_g'], root, rot=(math.pi/2, 0, 0))
cyl("Btn_TimeDn", 6, 4, (s(80), s(BODY_D/2 + 2), s(Z_CP - 20)), M['led_r'], root, rot=(math.pi/2, 0, 0))
cyl("Btn_Power",  8, 4, (s(105), s(BODY_D/2 + 2), s(Z_CP + 20)), M['chrome'], root, rot=(math.pi/2, 0, 0))
cyl("Btn_Start",  8, 4, (s(105), s(BODY_D/2 + 2), s(Z_CP - 20)), M['led_g'],  root, rot=(math.pi/2, 0, 0))

# Button Labels (Rotated math.pi around Z so it's not backwards when facing +Y)
py = BODY_D/2 + 3.1
text_rot = (math.pi/2, 0, math.pi)

ptext("Lbl_Temp", "TEMP", 8, (s(50), s(py), s(Z_CP + 35)), M['white'], root, rot=text_rot)
ptext("Lbl_Time", "TIME", 8, (s(80), s(py), s(Z_CP + 35)), M['white'], root, rot=text_rot)
ptext("Lbl_Powr", "PWR", 6, (s(105), s(py), s(Z_CP + 35)), M['white'], root, rot=text_rot)
ptext("Lbl_Strt", "START", 6, (s(105), s(py), s(Z_CP - 35)), M['white'], root, rot=text_rot)
ptext("Lbl_Up", "UP", 5, (s(65), s(py), s(Z_CP + 20)), M['white'], root, rot=text_rot)
ptext("Lbl_Dn", "DN", 5, (s(65), s(py), s(Z_CP - 20)), M['white'], root, rot=text_rot)

# 6. Chimney Vent (Rear Top)
cyl("Chimney_Pipe", 22, 50, (0, s(-BODY_D/2 + 60), s(BASE_H + BODY_H + 20)), M['alum'], root)
cyl("Chimney_Hole", 16, 52, (0, s(-BODY_D/2 + 60), s(BASE_H + BODY_H + 20)), M['dark'], root)

# 7. Front Door (Lid) prefix must be Lid_
DOOR_W = BODY_W - 40
DOOR_H = CH_H + 30
DOOR_T = 60

# Add physical hinges for realism
hx = s(-DOOR_W/2)
hy = s(BODY_D/2 + 10)
for hz in [Z_CH_CENTER + DOOR_H/2 - 20, Z_CH_CENTER - DOOR_H/2 + 20]:
    cube(f"HingeBody_{hz}", 20, 30, 20, (hx - s(10), hy - s(15), s(hz)), M['housing'], root)
    cyl(f"HingePin_{hz}", 6, 30, (hx, hy, s(hz)), M['chrome'], root)
    cube(f"Lid_HingeAttach_{hz}", 25, 20, 15, (hx + s(10), hy, s(hz)), M['housing'], root)

# Door outer faceplate sitting in front of body
cube("Lid_DoorOuter", DOOR_W, 25, DOOR_H, (0, s(BODY_D/2 + 12.5), s(Z_CH_CENTER - 5)), M['housing'], root, bev_w=3)

# Door inner insulated plug (goes into chamber)
cube("Lid_DoorInner", CH_W - 8, DOOR_T, CH_H - 8, (0, s(BODY_D/2 - DOOR_T/2), s(Z_CH_CENTER)), M['ceramic'], root)

# Side Handle on Door (right side, vertical)
cyl("Lid_HandleSt1", 8, 30, (s(DOOR_W/2 - 25), s(BODY_D/2 + 35), s(Z_CH_CENTER + 40)), M['dark'], root, rot=(math.pi/2, 0, 0))
cyl("Lid_HandleSt2", 8, 30, (s(DOOR_W/2 - 25), s(BODY_D/2 + 35), s(Z_CH_CENTER - 40)), M['dark'], root, rot=(math.pi/2, 0, 0))
cyl("Lid_HandleGrip", 10, 140, (s(DOOR_W/2 - 25), s(BODY_D/2 + 50), s(Z_CH_CENTER)), M['chrome'], root)

# ═══════════════════════════════════════════════
# EXPORT
# ═══════════════════════════════════════════════
output = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public", "models", "procedural", "muffle_furnace.glb"
)
os.makedirs(os.path.dirname(output), exist_ok=True)
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
print(f"✅ Muffle Furnace exported: {output} ({sz:.2f} MB)")
print(f"   Objects: {len(bpy.context.scene.objects)}, Materials: {len(bpy.data.materials)}")
