"""
SREdesigns — Vortex Mixer Pro-Fidelity v5 (Reference Matched)
============================================================
Reference: Pyramidal Teal Housing on Weighted Grey Base.
Workflow: bmesh tapered squircle, integrated sloped panel.

Run: /Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/create_vortex_mixer.py
"""
import bpy, bmesh, math, os

# ── CONFIG ──
S = 1.0 / 1000  # mm → meters
SEG = 64

# Proportions (mm)
BASE_W, BASE_T, BASE_H = 130, 116, 25
BODY_W, BODY_T, BODY_H = 110, 50, 85
CUP_R_BOT, CUP_R_TOP, CUP_H = 15, 42, 50
KNOB_R, KNOB_D = 15, 12

TILT = math.atan(((BODY_W - BODY_T) / 2) / BODY_H)

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
    'teal':   mat("IndustrialTeal", (.00,.18,.21), .6, .45), # Matte Metallic Teal
    'grey':   mat("IndustrialGrey", (.16,.16,.18), 0, .7),  # Matte Powder-coat grey
    'rubber': mat("HeavyRubber",    (.04,.04,.05), 0, .95), 
    'chrome': mat("ChromeDial",     (.01,.01,.01), 0, .8),  # Matte Black Plastic Knob
    'glass':  mat("PanelGlass",     (.005,.01,.01), 0, .4, (.01,.05,.05), 0.5), # Deep LCD Screen
    'led_g':  mat("LED_Green",      (0,.1,0), 0, .1, (.1,.9,.2), 2),
}

# ── HELPERS ──
def assign(obj, m): obj.data.materials.append(m)
def smooth(o):
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.shade_smooth(); o.select_set(False)
def bevel(o, w=5, seg=3):
    b = o.modifiers.new("Bevel","BEVEL"); b.width = s(w); b.segments = seg
def da(): bpy.ops.object.select_all(action='DESELECT')

def tapered_squircle(name, r_bot, r_top, height, exp=3.5):
    bm = bmesh.new(); bv, tv = [], []
    for i in range(SEG):
        a = 2*math.pi*i/SEG; ca, sa = math.cos(a), math.sin(a)
        e = 2.0/exp
        xb, yb = r_bot * abs(ca)**e * (1 if ca>=0 else -1), r_bot * abs(sa)**e * (1 if sa>=0 else -1)
        xt, yt = r_top * abs(ca)**e * (1 if ca>=0 else -1), r_top * abs(sa)**e * (1 if sa>=0 else -1)
        bv.append(bm.verts.new((s(xb),s(yb),0)))
        tv.append(bm.verts.new((s(xt),s(yt),s(height))))
    bm.verts.ensure_lookup_table()
    bm.faces.new(bv[::-1]); bm.faces.new(tv)
    for i in range(SEG):
        ni = (i+1)%SEG
        bm.faces.new([bv[i],bv[ni],tv[ni],tv[i]])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(f"{name}_M"); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o)
    return o

# ── ROOT ──
bpy.ops.object.empty_add(type='PLAIN_AXES'); root = bpy.context.active_object
root.name = "VortexMixer"; da()

# ═══ 1. WEIGHTED BASE ═══
base = tapered_squircle("BaseRim", BASE_W/2, BASE_T/2, BASE_H, 3.8)
bevel(base, 4, 3); smooth(base); assign(base, M['grey']); base.parent = root; da()

# ═══ 2. MAIN TEAL HOUSING (Pyramidal Taper) ═══
body = tapered_squircle("Body", BODY_W/2, BODY_T/2, BODY_H, 3.5)
body.location.z = s(BASE_H - 1) 
bevel(body, 3, 3); smooth(body); assign(body, M['teal']); body.parent = root; da()

# ═══ 3. INTEGRATED CONTROL PANEL (Ergonomic Fix: LCD Top, Knob Bottom) ═══
# LCD Panel (Lowered position for better fit)
lcd_z_offset = BODY_H * 0.6
lcd_z = s(BASE_H + lcd_z_offset)
lcd_y = s(BODY_W/2 - (lcd_z_offset/BODY_H)*((BODY_W-BODY_T)/2))

bpy.ops.mesh.primitive_cube_add(size=1)
panel = bpy.context.active_object; panel.name = "ControlPanel"
# Re-scaled to a realistic small lab bezel
panel.scale = (s(40), s(1.8), s(24)); bpy.ops.object.transform_apply(scale=True)
panel.location = (0, -lcd_y - s(0.5), lcd_z); panel.rotation_euler = (-TILT, 0, 0)
smooth(panel); assign(panel, M['grey']); panel.parent = root; bevel(panel, 1, 2); da()

# LCD Active Screen Area (Dark, slightly emissive)
bpy.ops.mesh.primitive_cube_add(size=1)
scr = bpy.context.active_object; scr.name = "LCDScreen"
scr.scale = (s(36), s(0.4), s(18)); bpy.ops.object.transform_apply(scale=True)
# Placement: Panel is 1.8mm thick (0.9 front/back). 
# Center is at -lcd_y - 0.5. Front face is at -lcd_y - 0.5 - 0.9 = -lcd_y - 1.4.
# Screen sits 0.1mm in front of that.
scr.location = (0, -lcd_y - s(1.5), lcd_z); scr.rotation_euler = (-TILT, 0, 0)
smooth(scr); assign(scr, M['glass']); scr.parent = root; da()

# Selector Knob (Lower position, between LCD and Base)
knob_z_offset = BODY_H * 0.3
knob_z_p = s(BASE_H + knob_z_offset)
knob_y_p = s(BODY_W/2 - (knob_z_offset/BODY_H)*((BODY_W-BODY_T)/2))

# Positioned center-front below the LCD (Matte Black Plastic)
k_loc = (0, -knob_y_p - s(2.4), knob_z_p)
bpy.ops.mesh.primitive_cylinder_add(radius=s(6.5), depth=s(9), vertices=32,
    location=k_loc, rotation=(math.pi/2 - TILT, 0, 0))
knob = bpy.context.active_object; knob.name = "Knob_Main"
smooth(knob); assign(knob, M['chrome']); knob.parent = root; da()

# Knob Indicator Mark (White Line - Fixed Local Parenting)
bpy.ops.mesh.primitive_cube_add(size=1)
mark = bpy.context.active_object; mark.name = "KnobIndicator"
mark.scale = (s(1.2), s(1), s(4.5)); bpy.ops.object.transform_apply(scale=True)
# Sits at the top edge of the knob face (+Z radial, +Y depth in local)
# Note: For a rotated cylinder primitive, local Z is depth.
mark.location = (0, s(3.5), s(4.6)) 
smooth(mark); assign(mark, M['grey']); mark.parent = knob; da()

# 3 Small Buttons (Lower row below knob)
for i, dx in enumerate([-10, 0, 10]):
    btn_z_off = knob_z_offset - 12
    btn_z = s(BASE_H + btn_z_off)
    btn_y = s(BODY_W/2 - (btn_z_off/BODY_H)*((BODY_W-BODY_T)/2))
    bpy.ops.mesh.primitive_cylinder_add(radius=s(2.5), depth=s(2), vertices=16,
        location=(s(dx), -btn_y - s(1.5), btn_z), rotation=(math.pi/2 - TILT, 0, 0))
    btn = bpy.context.active_object; btn.name = f"Button_{i}"
    smooth(btn); assign(btn, M['grey']); btn.parent = root; da()

# ═══ 4. MIXER CUP ASSEMBLY (Inverted Cone) ═══
neck_z = s(BASE_H + BODY_H - 5)
bpy.ops.mesh.primitive_cylinder_add(radius=s(CUP_R_BOT + 2), depth=s(12), vertices=32, location=(0,0,neck_z + s(6)))
neck = bpy.context.active_object; neck.name = "Neck"
smooth(neck); assign(neck, M['grey']); neck.parent = root; da()

bpy.ops.mesh.primitive_cone_add(radius1=s(CUP_R_BOT), radius2=s(CUP_R_TOP), depth=s(C_H:=CUP_H), vertices=SEG,
    location=(0, 0, neck_z + s(12 + C_H/2)))
cup = bpy.context.active_object; cup.name = "Cup_Main"
smooth(cup); assign(cup, M['rubber']); cup.parent = root; da()
# Top Lip torus
bpy.ops.mesh.primitive_torus_add(major_radius=s(CUP_R_TOP - 1.5), minor_radius=s(1.5), major_segments=SEG, minor_segments=8,
    location=(0, 0, neck_z + s(12 + C_H)))
lip = bpy.context.active_object; lip.name = "Cup_Lip"
smooth(lip); assign(lip, M['rubber']); lip.parent = root; da()

# ═══ EXPORT ═══
output = os.path.join(os.getcwd(), "public", "models", "procedural", "vortex_mixer.glb")
os.makedirs(os.path.dirname(output), exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=output, export_format='GLB', export_apply=False,
    use_selection=True, export_materials='EXPORT', export_draco_mesh_compression_enable=False)
sz = os.path.getsize(output) / 1024 / 1024
print(f"✅ Vortex Mixer Pro (Reference Match) exported: {output} ({sz:.2f} MB)")

