"""
SREdesigns — Ultrasonic Cleaning Bath Pro-Fidelity v3
======================================================
Fixes: Body built as shell (open basin), LCD naming for texture mapping.

Run: /Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/create_ultrasonic_cleaner.py
"""
import bpy, bmesh, math, os

# ── CONFIG ──
S = 1.0 / 1000
SEG = 64

# Enclosure (mm)
BODY_W = 320
BODY_D = 200
BODY_H = 168
BASE_H = 14
WALL_T = 8

# Layout: left zone = controls, right zone = open basin
PANEL_ZONE_W = 80
BASIN_W = BODY_W - PANEL_ZONE_W - WALL_T
BASIN_D = BODY_D - 2 * WALL_T
BASIN_H = BODY_H - 18
BASIN_CX_MM = (BODY_W / 2) - WALL_T - BASIN_W / 2  # Right-shifted center

# Control panel
PANEL_W = PANEL_ZONE_W - 2 * WALL_T
PANEL_D_MM = BODY_D - 4 * WALL_T

# LCD
LCD_W = 58
LCD_H = 30

# Knobs
KNOB_R = 8
KNOB_D = 8

# Lid
LID_H = 7
HANDLE_W = 50
HANDLE_H = 22

# Drain
DRAIN_R = 7
DRAIN_D = 16

# Basket
BASKET_GAP = 5
BASKET_LEG = 12

# Feet
FOOT_R = 10
FOOT_H = 6

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
    'steel':     mat("BrushedSteel",     (.72,.71,.69), .90, .22),
    'basin':     mat("BasinSteel",       (.62,.62,.64), .92, .12),
    'dark':      mat("DarkPanel",        (.05,.05,.06),  0,  .55),
    'knob':      mat("SatinKnob",        (.55,.54,.52), .75, .40),
    'knob_ring': mat("KnobRing",         (.45,.45,.47), .80, .30),
    'rubber':    mat("RubberFoot",       (.04,.04,.04),  0,  .92),
    'gasket':    mat("SealGasket",       (.08,.08,.09),  0,  .7),
    'lcd':       mat("LCD_Glow",         (.005,.015,.06), 0, .02, (.2,.5,1.0), 8.0),
    'led_g':     mat("LED_Green",        (0,.1,0),        0, .1,  (.1,.9,.2), 2),
    'led_a':     mat("LED_Amber",        (.1,.05,0),      0, .1,  (.9,.6,.1), 2),
    'label':     mat("PanelLabel",       (.14,.14,.15),   0, .4),
    'white':     mat("WhiteText",        (.88,.88,.88),   0, .5),
    'wire':      mat("WireBasket",       (.55,.55,.57),  .70, .35),
    'valve':     mat("ValvePlastic",     (.12,.12,.14),   0, .6),
    'lid_s':     mat("LidSurface",       (.68,.67,.65),  .88, .24),
    'hinge':     mat("HingeMetal",       (.50,.50,.52),  .80, .30),
    'fluid':     mat("FluidWater",       (.55,.75,.85),   0, .08),
}

# ── HELPERS ──
def assign(obj, m): obj.data.materials.append(m)
def smooth(o):
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.shade_smooth(); o.select_set(False)
def bevel(o, w=5, seg=3):
    b = o.modifiers.new("Bevel","BEVEL"); b.width = s(w); b.segments = seg
def da(): bpy.ops.object.select_all(action='DESELECT')

def cube(name, sx, sy, sz, loc, material, parent, bev_w=0, rot=None):
    bpy.ops.mesh.primitive_cube_add(size=1)
    o = bpy.context.active_object; o.name = name
    o.scale = (s(sx), s(sy), s(sz)); bpy.ops.object.transform_apply(scale=True)
    o.location = loc
    if rot: o.rotation_euler = rot
    if bev_w > 0: bevel(o, bev_w, 2)
    smooth(o); assign(o, material); o.parent = parent; da()
    return o

def cyl(name, r, depth, loc, material, parent, verts=24, rot=None):
    bpy.ops.mesh.primitive_cylinder_add(radius=s(r), depth=s(depth),
        vertices=verts, location=loc, rotation=rot or (0,0,0))
    o = bpy.context.active_object; o.name = name
    smooth(o); assign(o, material); o.parent = parent; da()
    return o

# ── ROOT ──
bpy.ops.object.empty_add(type='PLAIN_AXES'); root = bpy.context.active_object
root.name = "UltrasonicCleaner"; da()


# ═══════════════════════════════════════════════
#  GEOMETRY — Body built as SHELL with open basin
# ═══════════════════════════════════════════════

body_z0 = BASE_H           # bottom of body
body_z1 = BASE_H + BODY_H  # top of body
basin_floor_z = body_z1 - BASIN_H
basin_cx = s(BASIN_CX_MM)

# ═══ 1. LOWER BODY SLAB (solid base, below basin floor, full width) ═══
lower_h = basin_floor_z - BASE_H + 4  # extends slightly into basin floor
cube("Body_Lower", BODY_W, BODY_D, lower_h,
    (0, 0, s(BASE_H + lower_h/2)),
    M['steel'], root, bev_w=4)

# ═══ 2. LEFT SECTION (panel zone, full height, solid) ═══
left_w = PANEL_ZONE_W + WALL_T  # width of the left solid block
left_cx = -(BODY_W/2) + left_w/2
upper_h = BODY_H - lower_h
cube("Body_LeftBlock", left_w, BODY_D, upper_h,
    (s(left_cx), 0, s(BASE_H + lower_h + upper_h/2)),
    M['steel'], root, bev_w=4)

# ═══ 3. BASIN WALLS (upper right, forming the open cavity) ═══
# These are the walls around the basin opening, above the lower slab
wall_base_z = s(BASE_H + lower_h)
wall_h = upper_h

# Front wall (Blender +Y)
cube("Body_WallFront", BASIN_W + WALL_T, WALL_T, wall_h,
    (basin_cx, s(BODY_D/2 - WALL_T/2), wall_base_z + s(wall_h/2)),
    M['steel'], root, bev_w=2)

# Back wall (Blender -Y)
cube("Body_WallBack", BASIN_W + WALL_T, WALL_T, wall_h,
    (basin_cx, s(-(BODY_D/2 - WALL_T/2)), wall_base_z + s(wall_h/2)),
    M['steel'], root, bev_w=2)

# Right wall (Blender +X)
cube("Body_WallRight", WALL_T, BODY_D, wall_h,
    (s(BODY_W/2 - WALL_T/2), 0, wall_base_z + s(wall_h/2)),
    M['steel'], root, bev_w=2)

# ═══ 4. BASIN INTERIOR (polished stainless) ═══
# Floor
cube("Basin_Floor", BASIN_W, BASIN_D, 3,
    (basin_cx, 0, s(basin_floor_z + 1.5)),
    M['basin'], root, bev_w=1)

# Interior walls (thinner, polished)
inner_wall = 3
# Front inner
cube("Basin_InnerFront", BASIN_W, inner_wall, BASIN_H - 4,
    (basin_cx, s(BASIN_D/2 - inner_wall/2), s(basin_floor_z + (BASIN_H-4)/2 + 2)),
    M['basin'], root)
# Back inner
cube("Basin_InnerBack", BASIN_W, inner_wall, BASIN_H - 4,
    (basin_cx, s(-(BASIN_D/2 - inner_wall/2)), s(basin_floor_z + (BASIN_H-4)/2 + 2)),
    M['basin'], root)
# Right inner
cube("Basin_InnerRight", inner_wall, BASIN_D, BASIN_H - 4,
    (basin_cx + s(BASIN_W/2 - inner_wall/2), 0, s(basin_floor_z + (BASIN_H-4)/2 + 2)),
    M['basin'], root)
# Left inner (divider between panel and basin)
cube("Basin_InnerLeft", inner_wall, BASIN_D, BASIN_H - 4,
    (basin_cx - s(BASIN_W/2 - inner_wall/2), 0, s(basin_floor_z + (BASIN_H-4)/2 + 2)),
    M['basin'], root)

# ═══ 5. BASIN RIM (polished lip) ═══
rim_z = s(body_z1 + 1)
cube("BasinRim_Front", BASIN_W + 2*WALL_T, 5, 3,
    (basin_cx, s(BODY_D/2 - 2), rim_z), M['steel'], root, bev_w=1)
cube("BasinRim_Back", BASIN_W + 2*WALL_T, 5, 3,
    (basin_cx, s(-(BODY_D/2 - 2)), rim_z), M['steel'], root, bev_w=1)
cube("BasinRim_Right", 5, BODY_D, 3,
    (s(BODY_W/2 - 2), 0, rim_z), M['steel'], root, bev_w=1)
cube("BasinRim_Left", 5, BODY_D, 3,
    (basin_cx - s(BASIN_W/2 + WALL_T/2), 0, rim_z), M['steel'], root, bev_w=1)

# ═══ 6. FLUID SURFACE (translucent plane visible from above) ═══
fluid_z = s(body_z1 - 25)  # 25mm below top
cube("FluidSurface", BASIN_W - 6, BASIN_D - 6, 2,
    (basin_cx, 0, fluid_z),
    M['fluid'], root)


# ═══ 7. BASE RIM ═══
cube("BaseRim", BODY_W + 4, BODY_D + 4, BASE_H,
    (0, 0, s(BASE_H/2)),
    M['dark'], root, bev_w=3)

# ═══ 8. RUBBER FEET ═══
for fi, (fx, fy) in enumerate([
    ( BODY_W/2-25,  BODY_D/2-20), ( BODY_W/2-25, -BODY_D/2+20),
    (-BODY_W/2+25,  BODY_D/2-20), (-BODY_W/2+25, -BODY_D/2+20),
]):
    cyl(f"Foot_{fi}", FOOT_R, FOOT_H, (s(fx), s(fy), s(FOOT_H/2)),
        M['rubber'], root, 16)


# ═══ 9. CONTROL PANEL (on left block top surface) ═══
# Center the panel between the machine left edge and the basin rim
machine_left_edge = -BODY_W / 2
basin_rim_left = BASIN_CX_MM - BASIN_W / 2 - WALL_T / 2
panel_cx = s((machine_left_edge + basin_rim_left) / 2)
panel_z = s(body_z1 + 0.5)

# Dark panel backing
cube("ControlPanel", PANEL_W, PANEL_D_MM, 4,
    (panel_cx, 0, panel_z), M['dark'], root, bev_w=2)

# LCD — NAMED "LCDScreen" (no underscore) for reliable Three.js matching
lcd_x = panel_cx
lcd_y = s(PANEL_D_MM / 4 - 5)
lcd_z = panel_z + s(3)

cube("LCDBezel", LCD_W + 6, LCD_H + 6, 2,
    (lcd_x, lcd_y, lcd_z - s(0.5)), M['label'], root, bev_w=1)

# LCD as a PLANE (not cube) so the canvas texture maps to a single face with correct UVs
bpy.ops.mesh.primitive_plane_add(size=1, location=(lcd_x, lcd_y, lcd_z + s(0.8)))
lcd_obj = bpy.context.active_object
lcd_obj.name = "LCDScreen"
lcd_obj.scale = (s(LCD_W), s(LCD_H), 1)
bpy.ops.object.transform_apply(scale=True)
smooth(lcd_obj); assign(lcd_obj, M['lcd']); lcd_obj.parent = root; da()

# Knobs (satin metal)
knob_y = s(-PANEL_D_MM / 4 + 8)
knob_z = panel_z + s(3)

cyl("Knob_Timer", KNOB_R, KNOB_D,
    (panel_cx - s(14), knob_y, knob_z), M['knob'], root, 32)
bpy.ops.mesh.primitive_torus_add(
    major_radius=s(KNOB_R + 1), minor_radius=s(1.2),
    major_segments=32, minor_segments=8,
    location=(panel_cx - s(14), knob_y, knob_z + s(KNOB_D/2 - 1)))
kr = bpy.context.active_object; kr.name = "Knob_Timer_Ring"
smooth(kr); assign(kr, M['knob_ring']); kr.parent = root; da()
cube("Knob_Timer_Mark", 1.2, 0.8, KNOB_R - 3,
    (panel_cx - s(14), knob_y + s(0.5), knob_z + s(KNOB_D / 2 + 0.3)),
    M['white'], root)

cyl("Knob_Temp", KNOB_R, KNOB_D,
    (panel_cx + s(14), knob_y, knob_z), M['knob'], root, 32)
bpy.ops.mesh.primitive_torus_add(
    major_radius=s(KNOB_R + 1), minor_radius=s(1.2),
    major_segments=32, minor_segments=8,
    location=(panel_cx + s(14), knob_y, knob_z + s(KNOB_D/2 - 1)))
kr2 = bpy.context.active_object; kr2.name = "Knob_Temp_Ring"
smooth(kr2); assign(kr2, M['knob_ring']); kr2.parent = root; da()
cube("Knob_Temp_Mark", 1.2, 0.8, KNOB_R - 3,
    (panel_cx + s(14), knob_y + s(0.5), knob_z + s(KNOB_D / 2 + 0.3)),
    M['white'], root)

# Push buttons
btn_y = knob_y - s(18)
for bi, bx_off in enumerate([-14, 0, 14]):
    cyl(f"Button_{bi}", 3.5, 2.5,
        (panel_cx + s(bx_off), btn_y, knob_z - s(1)),
        M['label'], root, 12)

# LEDs
led_y = lcd_y + s(LCD_H / 2 + 6)
cyl("LED_Power", 2, 1.5, (panel_cx - s(10), led_y, lcd_z), M['led_g'], root, 12)
cyl("LED_Heat", 2, 1.5, (panel_cx + s(10), led_y, lcd_z), M['led_a'], root, 12)

# Badge
cube("PanelBadge", 35, 6, 0.8,
    (panel_cx, s(PANEL_D_MM / 2 - 6), lcd_z - s(0.5)), M['label'], root, bev_w=0.5)


# ═══ 10. WIRE BASKET ═══
bsk_w = BASIN_W - 2 * BASKET_GAP
bsk_d = BASIN_D - 2 * BASKET_GAP
bsk_h = BASIN_H - BASKET_LEG - 25
bsk_z = s(basin_floor_z + BASKET_LEG + bsk_h / 2 + 4)

for i, (fw, fd) in enumerate([(bsk_w, 3), (3, bsk_d)]):
    cube(f"Basket_Bot_{i}", fw, fd, 1.5,
        (basin_cx, 0, bsk_z - s(bsk_h / 2)), M['wire'], root, bev_w=0.3)
for i, (fw, fd) in enumerate([(bsk_w, 3), (3, bsk_d)]):
    cube(f"Basket_Top_{i}", fw, fd, 1.5,
        (basin_cx, 0, bsk_z + s(bsk_h / 2)), M['wire'], root, bev_w=0.3)

for ci, (cx, cy) in enumerate([
    (bsk_w/2-1, bsk_d/2-1), (bsk_w/2-1, -bsk_d/2+1),
    (-bsk_w/2+1, bsk_d/2-1), (-bsk_w/2+1, -bsk_d/2+1),
]):
    cube(f"Basket_Post_{ci}", 2, 2, bsk_h,
        (basin_cx + s(cx), s(cy), bsk_z), M['wire'], root, bev_w=0.3)

for wi in range(5):
    wx = -bsk_w / 2 + (wi + 1) * bsk_w / 6
    cube(f"Basket_WireX_{wi}", 1.2, bsk_d - 6, 1.2,
        (basin_cx + s(wx), 0, bsk_z - s(bsk_h / 2) + s(1.5)), M['wire'], root)
for wi in range(3):
    wy = -bsk_d / 2 + (wi + 1) * bsk_d / 4
    cube(f"Basket_WireY_{wi}", bsk_w - 6, 1.2, 1.2,
        (basin_cx, s(wy), bsk_z - s(bsk_h / 2) + s(1.5)), M['wire'], root)

for hi, hx_s in enumerate([1, -1]):
    hx = basin_cx + s(hx_s * (bsk_w / 2 + 3))
    cube(f"Basket_Handle_{hi}", 3, 24, 2.5,
        (hx, 0, bsk_z + s(bsk_h / 2 + 5)), M['wire'], root, bev_w=0.8)
    for ly_s in [1, -1]:
        cube(f"Basket_HLeg_{hi}_{0 if ly_s > 0 else 1}", 2.5, 2.5, 10,
            (hx, s(ly_s * 10), bsk_z + s(bsk_h / 2 + 1)), M['wire'], root)


# ═══ 11. DRAIN VALVE ═══
drain_x = s(BODY_W / 2 + 1)
drain_z = s(BASE_H + 30)
drain_y = s(-BODY_D / 4)

cyl("DrainValve_Body", DRAIN_R, DRAIN_D,
    (drain_x + s(DRAIN_D / 2 - 2), drain_y, drain_z),
    M['valve'], root, 16, rot=(0, math.pi / 2, 0))
cube("DrainValve_Handle", 3, 18, 3,
    (drain_x + s(DRAIN_D + 1), drain_y, drain_z), M['knob'], root, bev_w=0.8)
cyl("DrainValve_Spout", 4.5, 7,
    (drain_x + s(DRAIN_D + 7), drain_y, drain_z),
    M['knob'], root, 12, rot=(0, math.pi / 2, 0))


# ═══ 12. LID ═══
lid_w = BASIN_W + 2 * WALL_T + 6
lid_d = BASIN_D + 2 * WALL_T + 6
lid_z = s(body_z1 + 3)

cube("Lid_Plate", lid_w, lid_d, LID_H,
    (basin_cx, 0, lid_z + s(LID_H / 2)), M['lid_s'], root, bev_w=2)

for gi, (gw, gd, gx, gy) in enumerate([
    (lid_w - 6, 2.5, basin_cx, s(lid_d / 2 - 2)),
    (lid_w - 6, 2.5, basin_cx, s(-lid_d / 2 + 2)),
    (2.5, lid_d - 6, basin_cx + s(lid_w / 2 - 2), 0),
    (2.5, lid_d - 6, basin_cx - s(lid_w / 2 - 2), 0),
]):
    cube(f"Lid_Gasket_{gi}", gw, gd, 1.5, (gx, gy, lid_z - s(0.5)), M['gasket'], root)

handle_z = lid_z + s(LID_H + 1)
cube("Lid_Handle_Bar", HANDLE_W, 5, 3.5,
    (basin_cx, 0, handle_z + s(HANDLE_H / 2)), M['knob'], root, bev_w=1)
for ui, ux_s in enumerate([1, -1]):
    cube(f"Lid_Handle_Upright_{ui}", 4.5, 5, HANDLE_H,
        (basin_cx + s(ux_s * HANDLE_W / 2), 0, handle_z), M['knob'], root, bev_w=1)

hinge_y = s(-lid_d / 2 - 1)
for hi, hx_off in enumerate([-35, 35]):
    cube(f"Lid_Hinge_{hi}", 10, 7, 5,
        (basin_cx + s(hx_off), hinge_y, lid_z), M['hinge'], root, bev_w=1)
    cyl(f"Lid_HingePin_{hi}", 1.8, 12,
        (basin_cx + s(hx_off), hinge_y, lid_z), M['knob'], root, 12)


# ═══ 13. REAR PORTS ═══
rear_y = s(-(BODY_D / 2 + 0.5))
rear_z = s(BASE_H + BODY_H - 28)
cube("Rear_PortBay", 90, 2.5, 26, (0, rear_y, rear_z), M['dark'], root, bev_w=1)
cube("Rear_PowerInlet", 24, 1.5, 16, (s(-22), rear_y - s(0.3), rear_z), M['label'], root, bev_w=0.8)
cube("Rear_PowerSwitch", 14, 2.5, 9, (s(18), rear_y - s(0.3), rear_z + s(2)), M['label'], root, bev_w=0.5)
cyl("Rear_Fuse", 4.5, 3, (s(18), rear_y - s(0.5), rear_z - s(7)),
    M['label'], root, 12, rot=(math.pi / 2, 0, 0))


# ═══ 14. LABELS ═══
cube("Brand_Badge", 55, 0.8, 10,
    (s(-BODY_W / 4), s(BODY_D / 2 + 0.5), s(BASE_H + BODY_H / 2)),
    M['label'], root, bev_w=0.4)
cube("Serial_Plate", 0.8, 36, 9,
    (s(-BODY_W / 2 - 0.3), 0, s(BASE_H + 22)),
    M['white'], root, bev_w=0.3)


# ═══════════════════════════════════════════════
#  EXPORT
# ═══════════════════════════════════════════════
output = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public", "models", "procedural", "ultrasonic_cleaner.glb"
)
os.makedirs(os.path.dirname(output), exist_ok=True)

# Print all object names for debugging Three.js matching
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
print(f"✅ Ultrasonic Cleaner v3 exported: {output} ({sz:.2f} MB)")
print(f"   Objects: {len(bpy.context.scene.objects)}, Materials: {len(bpy.data.materials)}")
