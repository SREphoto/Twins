"""
SREdesigns — Pro-Fidelity Analytical Balance v2 (Gold-Tier)
=================================================
Complete redesign using lib_geometry_v2.py and lib_materials_v2.py.
Bakes 2K texture maps for photorealistic micro-imperfections.

Run: /Applications/Blender.app/Contents/MacOS/Blender --background --python completed_assets/Analytical_Balance/create_analytical_balance_pro.py
"""
import sys
import os
import math
import bpy

# Add libraries path
script_dir = os.path.dirname(os.path.abspath(__file__))
samslab_dir = os.path.dirname(os.path.dirname(script_dir))
lib_dir = os.path.join(samslab_dir, "scripts", "libraries")
if lib_dir not in sys.path:
    sys.path.append(lib_dir)

import lib_geometry_v2 as geom
from lib_materials_v2 import LabMaterialsV2

# Clean scene
geom.cleanup()

# Dimensions (mm)
BODY_W, BODY_D, BODY_H = 210, 250, 90
BASE_H = 12
SHIELD_W, SHIELD_D, SHIELD_H = 165, 160, 220
SHIELD_WALL = 3
PAN_R = 40
LCD_W, LCD_H = 120, 45

def s(mm): return mm * (1.0 / 1000)

# Create gold-tier materials
M = {
    'body':     LabMaterialsV2.mat("InstrumentBody",    (.78,.77,.75), .10, .38, imperfections=True),
    'dark':     LabMaterialsV2.mat("DarkHousing",       (.10,.10,.11), .08, .50, imperfections=True),
    'panel':    LabMaterialsV2.mat("ControlPanel",      (.14,.14,.16), .05, .45, imperfections=True),
    'lcd':      LabMaterialsV2.mat("LCD_Glow",          (.005,.015,.06), 0, .02, emit=(.25,.55,1.0), estr=3.0),
    'chrome':   LabMaterialsV2.mat("ChromeAccent",      (.82,.82,.84), 1.0, .04, clearcoat=0.5),
    'rubber':   LabMaterialsV2.mat("RubberFoot",        (.04,.04,.04),  0, .92, imperfections=True, bump_strength=0.08),
    'glass':    LabMaterialsV2.mat("ShieldGlass",       (.90,.92,.95),  0, .01, transmission=0.95, ior=1.52, clearcoat=0.8),
    'glass_f':  LabMaterialsV2.mat("ShieldFrame",       (.60,.60,.62), .40, .30, imperfections=True),
    'pan':      LabMaterialsV2.mat("WeighingPan",       (.78,.78,.80), .85, .12, imperfections=True, bump_strength=0.02),
    'white':    LabMaterialsV2.mat("WhiteLabel",        (.90,.90,.90),  0, .50),
    'label':    LabMaterialsV2.mat("PanelLabel",        (.15,.15,.16),  0, .40),
    'led_g':    LabMaterialsV2.mat("LED_Green",         (0,.1,0),       0, .10, emit=(.1,.9,.2), estr=2),
    'led_y':    LabMaterialsV2.mat("LED_Yellow",        (.1,.08,0),     0, .10, emit=(.9,.8,.1), estr=2),
    'btn_dark': LabMaterialsV2.mat("BtnDark",           (.18,.18,.20), .05, .50),
    'btn_tare': LabMaterialsV2.mat("BtnTare",           (.22,.22,.28),  0, .45),
    'btn_cal':  LabMaterialsV2.mat("BtnCal",            (.20,.25,.22),  0, .45),
    'btn_prt':  LabMaterialsV2.mat("BtnPrint",          (.22,.20,.18),  0, .45),
    'level':    LabMaterialsV2.mat("LevelBubble",       (.70,.90,.70),  0, .05),
    'level_r':  LabMaterialsV2.mat("LevelRing",         (.30,.30,.32), .50, .40),
    'cal_wt':   LabMaterialsV2.mat("CalWeight",         (.70,.70,.72), .90, .10),
    'sensor':   LabMaterialsV2.mat("SensorCol",         (.50,.50,.52), .60, .35),
    'handle':   LabMaterialsV2.mat("DoorHandle",        (.45,.45,.47), .60, .35),
    'gasket':   LabMaterialsV2.mat("ShieldGasket",      (.06,.06,.07),  0, .70),
}

# Root object
root = geom.create_root("AnalyticalBalance")

top_z = s(BASE_H + BODY_H)

# 1. MAIN BODY
body_main = geom.cube("Body_Main", BODY_W, BODY_D, BODY_H,
                      (0, 0, s(BASE_H + BODY_H/2)), M['body'], root)
geom.set_edge_sharpness(body_main, select_all=True, crease=1.0, bevel_weight=1.0)
geom.apply_production_modifiers(body_main, bevel_width=s(4), bevel_segments=3, subdiv_levels=2)

# Base Rim
base_rim = geom.cube("BaseRim", BODY_W + 6, BODY_D + 6, BASE_H,
                     (0, 0, s(BASE_H/2)), M['dark'], root)
geom.set_edge_sharpness(base_rim, select_all=True, crease=1.0, bevel_weight=1.0)
geom.apply_production_modifiers(base_rim, bevel_width=s(3), bevel_segments=3, subdiv_levels=2)

# Reusable Component: Anti-vibration rubber feet
geom.add_rubber_feet("Balance", BODY_W/2 - 18, BODY_D/2 - 20, 0.0, root, M['rubber'], M['dark'])

# 2. DRAFT SHIELD CHAMBER
shield_cx = 0
shield_cy = s(-15)  # offset toward rear

# Shield floor
shield_floor = geom.cube("Shield_Floor", SHIELD_W + 4, SHIELD_D + 4, 3,
                         (shield_cx, shield_cy, top_z + s(1.5)), M['body'], root)
geom.set_edge_sharpness(shield_floor, select_all=True, crease=1.0, bevel_weight=1.0)
geom.apply_production_modifiers(shield_floor, bevel_width=s(1), bevel_segments=3, subdiv_levels=2)

# Glass panels - REAR
geom.cube("Shield_Back", SHIELD_W, SHIELD_WALL, SHIELD_H,
          (shield_cx, shield_cy - s(SHIELD_D/2 - SHIELD_WALL/2), top_z + s(SHIELD_H/2)),
          M['glass'], root)

# Glass panel - TOP
geom.cube("Shield_Top", SHIELD_W, SHIELD_D, SHIELD_WALL,
          (shield_cx, shield_cy, top_z + s(SHIELD_H - SHIELD_WALL/2)),
          M['glass'], root)

# Glass panels - LEFT fixed side
geom.cube("Shield_LeftFixed", SHIELD_WALL, SHIELD_D * 0.3, SHIELD_H,
          (s(-SHIELD_W/2 + SHIELD_WALL/2), shield_cy + s(SHIELD_D * 0.35), top_z + s(SHIELD_H/2)),
          M['glass'], root)

# Glass panels - RIGHT fixed side
geom.cube("Shield_RightFixed", SHIELD_WALL, SHIELD_D * 0.3, SHIELD_H,
          (s(SHIELD_W/2 - SHIELD_WALL/2), shield_cy + s(SHIELD_D * 0.35), top_z + s(SHIELD_H/2)),
          M['glass'], root)

# 3. SLIDING DOORS
# Left sliding door
geom.cube("Door_Left", SHIELD_WALL, SHIELD_D * 0.68, SHIELD_H - 8,
          (s(-SHIELD_W/2 + SHIELD_WALL/2), shield_cy - s(SHIELD_D * 0.02), top_z + s(SHIELD_H/2 - 4)),
          M['glass'], root)
# Left door handle
geom.cube("Door_Left_Handle", 2, 10, 20,
          (s(-SHIELD_W/2 - 1), shield_cy + s(15), top_z + s(SHIELD_H/2)),
          M['handle'], root, bev_w=1)

# Right sliding door
geom.cube("Door_Right", SHIELD_WALL, SHIELD_D * 0.68, SHIELD_H - 8,
          (s(SHIELD_W/2 - SHIELD_WALL/2), shield_cy - s(SHIELD_D * 0.02), top_z + s(SHIELD_H/2 - 4)),
          M['glass'], root)
# Right door handle
geom.cube("Door_Right_Handle", 2, 10, 20,
          (s(SHIELD_W/2 + 1), shield_cy + s(15), top_z + s(SHIELD_H/2)),
          M['handle'], root, bev_w=1)

# Front door (slides up)
geom.cube("Door_Top", SHIELD_W - 2*SHIELD_WALL, SHIELD_WALL, SHIELD_H - 8,
          (shield_cx, shield_cy + s(SHIELD_D/2 - SHIELD_WALL/2), top_z + s(SHIELD_H/2 - 4)),
          M['glass'], root)
# Front door handle
geom.cube("Door_Top_Handle", 30, 2, 7,
          (shield_cx, shield_cy + s(SHIELD_D/2 + 1), top_z + s(SHIELD_H * 0.4)),
          M['handle'], root, bev_w=1)

# Shield frame corners
for sx_s, sy_s in [(1,1),(1,-1),(-1,1),(-1,-1)]:
    fx = s(sx_s * (SHIELD_W/2 - 1))
    fy = shield_cy + s(sy_s * (SHIELD_D/2 - 1))
    frame_col = geom.cube(f"ShieldFrame_{sx_s}_{sy_s}", 4, 4, SHIELD_H,
                          (fx, fy, top_z + s(SHIELD_H/2)),
                          M['glass_f'], root)
    geom.set_edge_sharpness(frame_col, select_all=True, crease=1.0, bevel_weight=1.0)
    geom.apply_production_modifiers(frame_col, bevel_width=s(0.5), bevel_segments=3, subdiv_levels=2)

# 4. WEIGHING PAN & SENSOR
pan_z = top_z + s(22)

# Sensor column
geom.cyl("Sensor_Column", 10, 16,
         (shield_cx, shield_cy, top_z + s(8)), M['sensor'], root, 32)

# Pan support post
geom.cyl("Pan_Support", 3.5, 10,
         (shield_cx, shield_cy, pan_z - s(5)), M['chrome'], root, 24)

# Weighing pan
weighing_pan = geom.cyl("WeighingPan", PAN_R, 2,
                        (shield_cx, shield_cy, pan_z), M['pan'], root, 64)
geom.set_edge_sharpness(weighing_pan, select_all=True, crease=0.5, bevel_weight=1.0)
geom.apply_production_modifiers(weighing_pan, bevel_width=s(0.2), bevel_segments=3, subdiv_levels=2)

# Pan rim
bpy.ops.mesh.primitive_torus_add(major_radius=s(PAN_R - 1), minor_radius=s(0.7),
    major_segments=64, minor_segments=8,
    location=(shield_cx, shield_cy, pan_z + s(0.8)))
pr = bpy.context.active_object; pr.name = "Pan_Rim"
geom.smooth(pr); geom.assign(pr, M['chrome']); pr.parent = root; geom.da()

# 5. MOTORIZED INTERNAL CALIBRATION WEIGHT (inside body)
cal_z = s(BASE_H + BODY_H/2)
# Internal calibration weight housing
geom.cube("CalWeight_Housing", 40, 40, 35,
          (s(BODY_W/4), s(-BODY_D/4), cal_z), M['dark'], root, bev_w=2)
# Cylindrical internal calibration weight body
geom.cyl("CalWeight_Body", 12, 25,
         (s(BODY_W/4), s(-BODY_D/4), cal_z), M['cal_wt'], root, 32)

# 6. FRONT CONTROL PANEL & LCD
front_y = s(BODY_D/2 + 1)
panel_z = s(BASE_H + BODY_H/2 + 12)
tilt = math.radians(12)

# Control panel background
geom.cube("ControlPanel", BODY_W - 15, 3, 50,
          (0, front_y, panel_z), M['panel'], root, bev_w=2, rot=(tilt, 0, 0))

# LCD Membrane Touch Screen
lcd_y = front_y + s(3)
lcd_z = panel_z

geom.cube("LCD_Bezel", BODY_W - 17, 1.5, 48,
          (0, lcd_y, lcd_z), M['dark'], root, bev_w=1.0, rot=(tilt, 0, 0))

# Plane for LCD texture mapping
bpy.ops.mesh.primitive_plane_add(size=1)
lcd_scr = bpy.context.active_object; lcd_scr.name = "LCD_Screen"
lcd_scr.scale = (s(BODY_W - 19), s(46), 1); bpy.ops.object.transform_apply(scale=True)
lcd_scr.location = (0, lcd_y + s(1), lcd_z)
lcd_scr.rotation_euler = (-math.pi/2 + tilt, 0, 0)
geom.smooth(lcd_scr); geom.assign(lcd_scr, M['lcd']); lcd_scr.parent = root; geom.da()

# 7. SPIRIT LEVEL
level_y = front_y + s(1)
level_z = panel_z - s(22)
geom.add_spirit_level("Level", 8, (s(BODY_W/2 - 20), level_y, level_z), root, M['level_r'], M['glass'], M['level'], M['white'], (math.pi/2, 0, 0))

# 8. STATUS LEDS
# Predefined status LEDs near screen (Green and Yellow)
geom.add_status_led("Green", 2, (s(-BODY_W/2 + 25), lcd_y, lcd_z + s(10)), root, M['dark'], M['led_g'], (math.pi/2, 0, 0))
geom.add_status_led("Yellow", 2, (s(-BODY_W/2 + 25), lcd_y, lcd_z - s(10)), root, M['dark'], M['led_y'], (math.pi/2, 0, 0))

# 9. REAR PORTS (IEC C14 power inlet, USB, RS-232)
rear_y = s(-BODY_D/2 - 1)
rear_z = s(BASE_H + BODY_H/2)

geom.cube("Rear_PortBay", 75, 2.5, 35, (0, rear_y, rear_z), M['dark'], root, bev_w=1)
# Reusable IEC C14 power inlet
geom.add_power_inlet("PowerInlet", (s(-20), rear_y - s(0.5), rear_z + s(5)), root, M['dark'], M['chrome'])
# USB & RS232 slots
geom.cube("Rear_USB", 11, 1.5, 5, (s(10), rear_y - s(0.5), rear_z + s(8)), M['label'], root, bev_w=0.3)
geom.cube("Rear_RS232", 15, 1.5, 8, (s(10), rear_y - s(0.5), rear_z - s(4)), M['label'], root, bev_w=0.4)

# 10. VENT SLOTS (on bottom sides)
for vi in range(4):
    for side in [-1, 1]:
        geom.cube(f"Vent_{side}_{vi}", 2, 25, 3,
                  (s(side * (BODY_W/2 + 0.5)), s(-BODY_D/4 + vi * 20), s(BASE_H + 12)),
                  M['dark'], root)

# Export path
output = os.path.join(script_dir, "analytical_balance_pro.glb")

print("=== Object Names ===")
for obj in bpy.context.scene.objects:
    if obj.type == 'MESH':
        print(f"  {obj.name}")
print("====================")

# Gold Tier Export: cycles bake of procedural maps at 2K resolution
geom.export_glb(output, apply_modifiers=True, bake_textures=True, bake_tex_size=2048)
