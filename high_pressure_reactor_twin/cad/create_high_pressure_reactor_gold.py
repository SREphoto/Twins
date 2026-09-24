"""
SREdesigns — Parr 4560 High-Pressure Reactor (Gold Tier)
=========================================================
Complete procedural model built bottom-up following the
HIGH_PRESSURE_REACTOR_MANUFACTURING_PLAN.md assembly sequence.

Run via:
  blender --background --python SamsLab/completed_assets/High_Pressure_Reactor/create_high_pressure_reactor_gold.py
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

# Custom material additions for High-Pressure Reactor
M['motor_blue'] = LabMaterialsV2.mat(
    "MotorBlue", (0.05, 0.28, 0.7), 0.1, 0.45)
M['vessel_steel'] = LabMaterialsV2.mat(
    "BrushedVesselSteel", (0.78, 0.78, 0.8), 0.9, 0.18)
M['brass'] = LabMaterialsV2.mat(
    "BrassFittings", (0.78, 0.65, 0.28), 0.85, 0.2)
M['pointer_red'] = LabMaterialsV2.mat(
    "PointerRed", (0.85, 0.05, 0.05), 0.0, 0.2, emit=(0.85, 0.05, 0.05), estr=1.2)
M['heater_metal'] = LabMaterialsV2.mat(
    "HeaterOuter", (0.6, 0.6, 0.62), 0.85, 0.3)
M['fabric_well'] = LabMaterialsV2.mat(
    "HeatingFabric", (0.4, 0.38, 0.35), 0.0, 0.8)

# ══════════════════════════════════════════════════════════════════════════
# 3. ROOT & DIMENSIONAL CONSTANTS
# ══════════════════════════════════════════════════════════════════════════
root = geom.create_root("High_Pressure_Reactor")

# DIMENSIONAL VARIABLES (mm)
BASE_W = 200
BASE_D = 200
BASE_H = 15

ROD_D = 25
ROD_H = 500
ROD_Y = -80  # Position at the back edge of the base plate

VESSEL_R = 65    # 130mm OD
VESSEL_H = 200
VESSEL_Z = 90    # Bottom of vessel Z height above ground (spring space)

FLANGE_R = 75    # 150mm OD
FLANGE_H = 12

GASKET_H = 1.6

HEAD_R = 75      # 150mm OD
HEAD_H = 16

DRIVE_R = 30     # 60mm OD
DRIVE_H = 100

MOTOR_R = 35     # 70mm OD
MOTOR_H = 120

HEATER_ID = 66
HEATER_OD = 80
HEATER_H = 150
HEATER_Z = 165   # Center Z of clamshell heater

CONTROLLER_W = 200
CONTROLLER_D = 250
CONTROLLER_H = 150
CONTROLLER_X = 70  # Overlaps with stand base right portion. Controller (200mm wide) spans -30mm to +170mm, overlapping the stand base which spans -100mm to +100mm.

# ══════════════════════════════════════════════════════════════════════════
# 4. STAND ASSEMBLY (System 8)
# ══════════════════════════════════════════════════════════════════════════

# Cast iron base plate
stand_base = geom.cube("Stand_Base", BASE_W, BASE_D, BASE_H,
                       (0, 0, s(BASE_H / 2)), M['dark'], root)

# Center recess for spring
spring_recess = geom.cyl("Base_Spring_Recess", 26.0, 5.0,
                         (0, 0, s(BASE_H - 2.5)), M['dark'], root)
geom.boolean_subtract(stand_base, spring_recess, apply=True)

# Four rubber feet
geom.add_rubber_feet("Stand", BASE_W / 2 - 15, BASE_D / 2 - 15, 0, root,
                     M['rubber'], M['steel'], radius_mm=10, height_mm=8, adjustment_ring=True)

# Vertical support rod (back edge)
stand_rod = geom.cyl("Stand_Rod", ROD_D / 2, ROD_H,
                     (0, s(ROD_Y), s(ROD_H / 2)), M['steel'], root, verts=24)

# Top split mounting clamp on rod aligning with head plate
clamp_z = VESSEL_Z + VESSEL_H + HEAD_H / 2  # aligned with head plate height
clamp_body = geom.cube("Stand_Clamp", 40, 60, 20,
                       (0, s(ROD_Y + 15), s(clamp_z)), M['steel'], root, bev_w=2)
clamp_hole = geom.cyl("Stand_Clamp_Hole", ROD_D / 2 + 0.1, 30.0,
                      (0, s(ROD_Y), s(clamp_z)), M['steel'], root, verts=24)
geom.boolean_subtract(clamp_body, clamp_hole, apply=True)

# ══════════════════════════════════════════════════════════════════════════
# 5. VESSEL ASSEMBLY (System 1)
# ══════════════════════════════════════════════════════════════════════════

# Compression spring at base
spring_center_z = BASE_H + (VESSEL_Z - BASE_H) / 2
geom.cyl("Compression_Spring", 25.0, VESSEL_Z - BASE_H,
         (0, 0, s(spring_center_z)), M['steel'], root, verts=16)

# Vessel body cylinder
vessel_center_z = VESSEL_Z + VESSEL_H / 2
vessel = geom.cyl("Body_Vessel", VESSEL_R, VESSEL_H,
                  (0, 0, s(vessel_center_z)), M['vessel_steel'], root, verts=48)

# Flange ring at top of vessel
flange_z = VESSEL_Z + VESSEL_H - FLANGE_H / 2
vessel_flange = geom.cyl("Body_Flange", FLANGE_R, FLANGE_H,
                         (0, 0, s(flange_z)), M['vessel_steel'], root, verts=48)

# Weld / join flange and vessel
bpy.ops.object.select_all(action='DESELECT')
vessel.select_set(True)
vessel_flange.select_set(True)
bpy.context.view_layer.objects.active = vessel
bpy.ops.object.join()
vessel.name = "Body_Vessel"

# Inner cavity bore (100mm ID, 150mm depth from top, 15mm bottom thickness)
cavity_z = VESSEL_Z + 15 + 150/2 + 25  # top aligned, depth 150
vessel_bore = geom.cyl("Body_Cavity", 50.0, 152.0,
                       (0, 0, s(cavity_z)), M['vessel_steel'], root, verts=32)
geom.boolean_subtract(vessel, vessel_bore, apply=True)

# Flat gasket ring (PTFE/graphite) on top of vessel flange
gasket_z = VESSEL_Z + VESSEL_H + GASKET_H / 2
geom.cyl("Gasket", 62.5, GASKET_H,
         (0, 0, s(gasket_z)), M['gasket'], root, verts=32)

# ══════════════════════════════════════════════════════════════════════════
# 6. HEAD PLATE & FASTENERS (System 2)
# ══════════════════════════════════════════════════════════════════════════

# Head plate cylinder
head_z = VESSEL_Z + VESSEL_H + GASKET_H + HEAD_H / 2
head_plate = geom.cyl("Head_Plate", HEAD_R, HEAD_H,
                      (0, 0, s(head_z)), M['vessel_steel'], root, verts=48)

# 6 closure hex bolts (M12 on a 120mm Bolt Circle)
bc_radius = 60.0  # mm
bolt_base_z = VESSEL_Z + VESSEL_H + GASKET_H + HEAD_H
for i in range(6):
    angle = math.radians(60 * i)
    bx = bc_radius * math.cos(angle)
    by = bc_radius * math.sin(angle)
    
    # Bolt head (hex)
    geom.cyl(f"Bolt_Head_{i}", 10.0, 10.0,
             (s(bx), s(by), s(bolt_base_z + 5.0)),
             M['steel'], root, verts=6)
    # Bolt shaft extending through head and flange
    geom.cyl(f"Bolt_Shaft_{i}", 6.0, 40.0,
             (s(bx), s(by), s(bolt_base_z - 20.0)),
             M['steel'], root, verts=16)

# ══════════════════════════════════════════════════════════════════════════
# 7. STIRRER & OVERHEAD MOTOR (System 3)
# ══════════════════════════════════════════════════════════════════════════

# Central Magnetic Drive Housing
drive_z = bolt_base_z + DRIVE_H / 2
geom.cyl("Stirrer_Drive", DRIVE_R, DRIVE_H,
         (0, 0, s(drive_z)), M['steel'], root, verts=32)

# Overhead vertical DC Motor (blue-painted)
motor_z = bolt_base_z + DRIVE_H + MOTOR_H / 2
motor = geom.cyl("Rotor_Motor", MOTOR_R, MOTOR_H,
                 (0, 0, s(motor_z)), M['motor_blue'], root, verts=32)

# Detailing: motor top cap (charcoal)
geom.cyl("Rotor_Motor_Cap", MOTOR_R + 1.0, 10.0,
         (0, 0, s(motor_z + MOTOR_H / 2 + 5.0)), M['dark'], root, verts=32)

# Detailing: motor base collar (steel)
geom.cyl("Rotor_Motor_Collar", MOTOR_R - 5.0, 8.0,
         (0, 0, s(motor_z - MOTOR_H / 2 - 4.0)), M['steel'], root, verts=32)

# Internal rotating shaft
shaft_len = 180.0
shaft_z = VESSEL_Z + 15 + shaft_len / 2
geom.cyl("Rotor_Shaft", 5.0, shaft_len,
         (0, 0, s(shaft_z)), M['steel'], root, verts=16)

# 6-blade Rushton turbine impeller (Ø45mm)
impeller_hub_z = VESSEL_Z + 25.0
impeller_hub = geom.cyl("Rotor_Impeller_Hub", 10.0, 12.0,
                         (0, 0, s(impeller_hub_z)), M['steel'], root, verts=16)

for i in range(6):
    ang = math.radians(60 * i)
    ix = 18.0 * math.cos(ang)
    iy = 18.0 * math.sin(ang)
    blade = geom.cube(f"Rotor_Impeller_Blade_{i}", 16, 1.2, 10,
                       (s(ix), s(iy), s(impeller_hub_z)), M['steel'], root,
                       rot=(0, 0, ang))
    # Join blades into the hub to preserve a clean single object for R3F/Showcase rotation
    bpy.ops.object.select_all(action='DESELECT')
    impeller_hub.select_set(True)
    blade.select_set(True)
    bpy.context.view_layer.objects.active = impeller_hub
    bpy.ops.object.join()
    impeller_hub.name = "Rotor_Impeller"

# ══════════════════════════════════════════════════════════════════════════
# 8. HEATING JACKET CLAMSHELL (System 4)
# ══════════════════════════════════════════════════════════════════════════

# We construct the clamshell halves. 
# Create a thick ring cylinder and cut/separate into Left and Right halves.
# Heater OD = 160, ID = 132, height = 150, centered at Z = 165
heater_outer = geom.cyl("Heater_Jacket_Temp", HEATER_OD, HEATER_H,
                        (0, 0, s(HEATER_Z)), M['heater_metal'], root, verts=48)
heater_inner = geom.cyl("Heater_Inner_Temp", HEATER_ID, HEATER_H + 5,
                        (0, 0, s(HEATER_Z)), M['heater_metal'], root, verts=48)
geom.boolean_subtract(heater_outer, heater_inner, apply=True)

# Cut into Left and Right clamshells
cutter_left = geom.cube("Cutter_Left", 200, 200, HEATER_H + 5,
                        (s(100), 0, s(HEATER_Z)), M['dark'], root)
cutter_right = geom.cube("Cutter_Right", 200, 200, HEATER_H + 5,
                         (s(-100), 0, s(HEATER_Z)), M['dark'], root)

# Separate Left Clamshell
heater_left = heater_outer
geom.boolean_subtract(heater_left, cutter_left, apply=True)
heater_left.name = "Lid_Heater_Left"

# Create Right Clamshell
heater_right = geom.cyl("Heater_Jacket_Temp_R", HEATER_OD, HEATER_H,
                        (0, 0, s(HEATER_Z)), M['heater_metal'], root, verts=48)
heater_inner_r = geom.cyl("Heater_Inner_Temp_R", HEATER_ID, HEATER_H + 5,
                          (0, 0, s(HEATER_Z)), M['heater_metal'], root, verts=48)
geom.boolean_subtract(heater_right, heater_inner_r, apply=True)
geom.boolean_subtract(heater_right, cutter_right, apply=True)
heater_right.name = "Lid_Heater_Right"

# Add hinge details at the back of the clamshell halves (Z = HEATER_Z)
# Left half hinge at X = -10, Y = -80 (rod side)
geom.cyl("Lid_Hinge_Left", 4.0, HEATER_H,
         (s(-10), s(ROD_Y + 15), s(HEATER_Z)), M['steel'], heater_left, verts=12)
# Right half hinge
geom.cyl("Lid_Hinge_Right", 4.0, HEATER_H,
         (s(10), s(ROD_Y + 15), s(HEATER_Z)), M['steel'], heater_right, verts=12)

# Add clasp latch band on the front of the clamshell
geom.cube("Lid_Lasp_Left", 10, 4, 15,
          (s(-10), s(HEATER_OD - 2), s(HEATER_Z)), M['steel'], heater_left)
geom.cube("Lid_Lasp_Right", 10, 4, 15,
          (s(10), s(HEATER_OD - 2), s(HEATER_Z)), M['steel'], heater_right)

# ══════════════════════════════════════════════════════════════════════════
# 9. VALVES, FITTINGS, INSTRUMENTATION (Systems 5, 6, 7)
# ══════════════════════════════════════════════════════════════════════════

# 9.1 Bourdon Pressure Gauge (Ashcroft 1009) — Left Side (X = -40, Y = 0)
# Stem / connector
geom.cyl("Gauge_Stem", 4.0, 30.0,
         (s(-40), 0, s(bolt_base_z + 15.0)), M['steel'], root, verts=12)
# Round casing (facing forward, so Y is depth of cylinder, rotated 90 deg)
gauge_body = geom.cyl("Gauge_Body", 30.0, 15.0,
                      (s(-40), s(-10), s(bolt_base_z + 45.0)), M['steel'], root, verts=24,
                      rot=(math.radians(90), 0, 0))
# White face
gauge_face = geom.cyl("UI_Gauge_Face", 27.0, 1.0,
                      (s(-40), s(-17.2), s(bolt_base_z + 45.0)), M['white'], root, verts=24,
                      rot=(math.radians(90), 0, 0))
# Red needle (rotates around Y-axis in Three.js)
geom.cyl("Gauge_Needle", 1.0, 24.0,
         (s(-40), s(-18.0), s(bolt_base_z + 45.0)), M['pointer_red'], root, verts=8,
         rot=(0, 0, 0))

# 9.2 Needle Valves — Gas Inlet (Right-Front), Vent (Right-Rear), Dip Tube (Front)
def add_needle_valve(name, val_loc):
    # Hex valve base body
    geom.cyl(f"Valve_Body_{name}", 8.0, 15.0,
             (val_loc[0], val_loc[1], s(bolt_base_z + 7.5)), M['brass'], root, verts=6)
    # Valve stem vertical extension
    geom.cyl(f"Valve_Stem_{name}", 3.0, 25.0,
             (val_loc[0], val_loc[1], s(bolt_base_z + 12.5)), M['steel'], root, verts=12)
    # Black dial handle on top
    geom.cyl(f"Knob_Valve_{name}", 12.0, 8.0,
             (val_loc[0], val_loc[1], s(bolt_base_z + 28.0)), M['dark'], root, verts=20)

add_needle_valve("Inlet", (s(35), s(20)))
add_needle_valve("Vent", (s(35), s(-20)))
add_needle_valve("DipTube", (0, s(40)))

# Dip tube extension running inside the vessel (Front fitting)
geom.cyl("Dip_Tube_Rod", 2.0, 180.0,
         (0, s(40), s(VESSEL_Z + 15 + 90.0)), M['steel'], root, verts=12)

# 9.3 Burst Disc Assembly (Back-Left X = -30, Y = -30)
geom.cyl("Burst_Disc_Body", 8.0, 16.0,
         (s(-30), s(-30), s(bolt_base_z + 8.0)), M['steel'], root, verts=6)
geom.cyl("Burst_Disc_Holder", 6.0, 8.0,
         (s(-30), s(-30), s(bolt_base_z + 20.0)), M['steel'], root, verts=12)

# 9.4 Thermowell (Back-Right X = 30, Y = 30)
geom.cyl("Thermowell_Body", 5.0, 14.0,
         (s(30), s(30), s(bolt_base_z + 7.0)), M['steel'], root, verts=12)
# Internal thermocouple probe rod running inside vessel
geom.cyl("Thermowell_Probe", 2.0, 150.0,
         (s(30), s(30), s(VESSEL_Z + 15 + 75.0)), M['steel'], root, verts=12)

# ══════════════════════════════════════════════════════════════════════════
# 10. PARR 4848 DIGITAL CONTROLLER (System 9)
# ══════════════════════════════════════════════════════════════════════════

# Main box enclosure
controller = geom.cube("Controller_Body", CONTROLLER_W, CONTROLLER_D, CONTROLLER_H,
                       (s(CONTROLLER_X), 0, s(CONTROLLER_H / 2)), M['beige'], root, bev_w=4.0)

# Sloped front panel cover
panel_y = CONTROLLER_D / 2 - 2
controller_panel = geom.cube("Controller_Panel", CONTROLLER_W - 10, 3, CONTROLLER_H - 10,
                             (s(CONTROLLER_X), s(panel_y), s(CONTROLLER_H / 2)), M['label'], root)

# LCD Touchscreen plane (displays temperature/PID parameters)
# In R3F/Three.js, we apply CanvasTexture to it for live data updates.
geom.cube("lcdscreen", 90, 2, 55,
          (s(CONTROLLER_X - 35), s(panel_y + 1), s(CONTROLLER_H / 2 + 15)), M['lcd'], root)

# Motor speed control potentiometer knob
geom.cyl("Knob_Speed", 12.0, 12.0,
         (s(CONTROLLER_X + 45), s(panel_y + 6), s(CONTROLLER_H / 2 + 30)), M['chrome'], root, verts=24,
         rot=(math.radians(90), 0, 0))

# Temperature control dial / up-down buttons (we model a second dial for UX clarity)
geom.cyl("Knob_Temp", 12.0, 12.0,
         (s(CONTROLLER_X + 45), s(panel_y + 6), s(CONTROLLER_H / 2)), M['chrome'], root, verts=24,
         rot=(math.radians(90), 0, 0))

# Power rocker switch (Btn_Power)
geom.cube("Btn_Power", 12, 4, 18,
          (s(CONTROLLER_X + 25), s(panel_y + 2), s(CONTROLLER_H / 2 - 35)), M['estop'], root)

# Heater toggle switch (Btn_Heater)
geom.cube("Btn_Heater", 12, 4, 18,
          (s(CONTROLLER_X + 55), s(panel_y + 2), s(CONTROLLER_H / 2 - 35)), M['dark'], root)

# Status indicators (LEDs)
geom.add_status_led("Power", 3.0, (s(CONTROLLER_X - 70), s(panel_y + 1), s(CONTROLLER_H / 2 - 35)),
                    root, M['chrome'], M['led_g'], rot=(math.radians(90), 0, 0))
geom.add_status_led("Heater", 3.0, (s(CONTROLLER_X - 40), s(panel_y + 1), s(CONTROLLER_H / 2 - 35)),
                    root, M['chrome'], M['led_a'], rot=(math.radians(90), 0, 0))
geom.add_status_led("Alarm", 3.0, (s(CONTROLLER_X - 10), s(panel_y + 1), s(CONTROLLER_H / 2 - 35)),
                    root, M['chrome'], M['led_r'], rot=(math.radians(90), 0, 0))

# Standard rear power inlet on controller back
geom.add_power_inlet("Controller_Inlet", (s(CONTROLLER_X), s(-CONTROLLER_D / 2), s(30)),
                     root, M['dark'], M['steel'])

# ══════════════════════════════════════════════════════════════════════════
# 11. PRODUCTION MODIFIERS & EXPORT (System 10)
# ══════════════════════════════════════════════════════════════════════════

# Enforce smooth shading and edge creases on complex parts
for obj in [stand_base, clamp_body, vessel, head_plate, heater_left, heater_right, controller, controller_panel, gauge_body]:
    geom.set_edge_sharpness(obj, select_all=True, crease=0.7, bevel_weight=0.8)

geom.apply_production_modifiers(stand_base, bevel_width=0.015, subdiv_levels=0)
geom.apply_production_modifiers(clamp_body, bevel_width=0.005, subdiv_levels=0)
geom.apply_production_modifiers(vessel, bevel_width=0.012, subdiv_levels=0)
geom.apply_production_modifiers(head_plate, bevel_width=0.008, subdiv_levels=0)
geom.apply_production_modifiers(heater_left, bevel_width=0.008, subdiv_levels=0)
geom.apply_production_modifiers(heater_right, bevel_width=0.008, subdiv_levels=0)
geom.apply_production_modifiers(controller, bevel_width=0.012, subdiv_levels=0)
geom.apply_production_modifiers(controller_panel, bevel_width=0.005, subdiv_levels=0)
geom.apply_production_modifiers(gauge_body, bevel_width=0.004, subdiv_levels=0)

# Base project path (4 levels up from completed_assets/High_Pressure_Reactor/)
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Primary export path in local web server public/
output_primary = os.path.join(base_dir, "public", "models", "procedural", "high_pressure_reactor.glb")
os.makedirs(os.path.dirname(output_primary), exist_ok=True)
geom.export_glb(output_primary, apply_modifiers=True, bake_textures=False)

# Copy GLB to Completed Asset folder
output_asset = os.path.join(base_dir, "SamsLab", "completed_assets", "High_Pressure_Reactor", "high_pressure_reactor.glb")
shutil.copy2(output_primary, output_asset)

print(f"✅ High-Pressure Reactor procedural model (28+ parts) export complete")
print(f"   Primary path: {output_primary}")
print(f"   Asset path:   {output_asset}")
