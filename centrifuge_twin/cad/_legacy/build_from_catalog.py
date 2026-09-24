#!/usr/bin/env python3
"""
Build Blender scene from export/parts_catalog.json (exact assembly coords).

LEGACY Stage 1 — not used by the live viewer. See docs/PIPELINE.md.

Each BOM instance becomes a named mesh. Parents:
  Rotor_Spin  — all D* parts (spin about +Z through chamber axis)
  Lid_Hinge   — all B* parts (open about hinge)

Run:
  Blender --background --python cad/_legacy/build_from_catalog.py

Exports (history only):
  export/_history/glb/centrifuge_exact.glb
  cad/_legacy/blends/centrifuge_exact.blend
"""

from __future__ import annotations

import json
import math
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CATALOG = os.path.join(ROOT, "export", "parts_catalog.json")
OUT_GLB = os.path.join(ROOT, "export", "_history", "glb", "centrifuge_exact.glb")
OUT_BLEND = os.path.join(ROOT, "cad", "_legacy", "blends", "centrifuge_exact.blend")


def main():
    import bpy
    from mathutils import Euler, Vector

    # Clear
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in (bpy.data.meshes, bpy.data.materials):
        for b in list(block):
            block.remove(b)

    bpy.context.scene.unit_settings.system = "METRIC"
    bpy.context.scene.unit_settings.scale_length = 0.001

    with open(CATALOG, encoding="utf-8") as f:
        data = json.load(f)
    parts = data["parts"]
    print(f"Catalog: {len(parts)} parts")

    # Materials
    def mk_mat(name, col, rough=0.4, metal=0.0, alpha=1.0, emit=None):
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        bsdf = m.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = (*col, 1.0)
        bsdf.inputs["Roughness"].default_value = rough
        bsdf.inputs["Metallic"].default_value = metal
        if alpha < 1.0:
            bsdf.inputs["Alpha"].default_value = alpha
            m.blend_method = "HASHED"
        if emit:
            if "Emission Color" in bsdf.inputs:
                bsdf.inputs["Emission Color"].default_value = (*emit[:3], 1.0)
            if "Emission Strength" in bsdf.inputs:
                bsdf.inputs["Emission Strength"].default_value = emit[3]
        return m

    mats = {
        "white": mk_mat("M_White", (0.92, 0.93, 0.95), 0.35),
        "dark": mk_mat("M_Dark", (0.12, 0.13, 0.15), 0.45),
        "rubber": mk_mat("M_Rubber", (0.03, 0.03, 0.03), 0.9),
        "steel": mk_mat("M_Steel", (0.7, 0.72, 0.74), 0.25, 0.9),
        "alum": mk_mat("M_Alum", (0.4, 0.43, 0.47), 0.3, 0.85),
        "gasket": mk_mat("M_Gasket", (0.06, 0.06, 0.06), 0.9),
        "smoked": mk_mat("M_Smoked", (0.08, 0.08, 0.1), 0.1, 0.0, 0.35),
        "pp": mk_mat("M_PP", (0.85, 0.9, 0.95), 0.15, 0.0, 0.45),
        "cap": mk_mat("M_Cap", (0.15, 0.4, 0.85), 0.4),
        "blood": mk_mat("M_Blood", (0.5, 0.0, 0.0), 0.5),
        "pcb": mk_mat("M_PCB", (0.1, 0.38, 0.15), 0.5),
        "zinc": mk_mat("M_Zinc", (0.75, 0.75, 0.78), 0.35, 0.8),
        "lcd": mk_mat("M_LCD", (0.02, 0.08, 0.12), 0.2, 0.0, 1.0, (0.0, 0.5, 0.6, 2.0)),
        "rack": mk_mat("M_Rack", (0.88, 0.9, 0.92), 0.4),
        "label_y": mk_mat("M_LabelY", (0.9, 0.75, 0.1), 0.5),
        "label_r": mk_mat("M_LabelR", (0.85, 0.15, 0.15), 0.5),
        "foam": mk_mat("M_Foam", (0.9, 0.9, 0.85), 0.8),
    }

    def mat_for(pid: str):
        if pid.startswith("A07") or pid.startswith("R03") or "Boot" in pid or "Gasket" in pid or "ORing" in pid or "Handle" in pid:
            return mats["rubber"]
        if "Screw" in pid or "Pin" in pid or pid.startswith("A08") or pid.startswith("A09"):
            return mats["zinc"]
        if pid.startswith("D01") or pid.startswith("D02") or pid.startswith("D04") or "DriveCone" in pid or "Nameplate" in pid or "Latch" in pid or "Condenser" in pid:
            return mats["alum"]
        if pid.startswith("C01") or pid.startswith("C03") or "Motor" in pid or "Compressor" in pid or "Striker" in pid:
            return mats["steel"]
        if pid.startswith("D05"):
            return mats["pp"]
        if pid.startswith("D06"):
            return mats["cap"]
        if pid.startswith("D07"):
            return mats["blood"]
        if "PCB" in pid or "Sensor" in pid or "Thermistor" in pid or "Microswitch" in pid or "Imbalance" in pid:
            return mats["pcb"]
        if "LCD" in pid or "LED_Run" in pid:
            return mats["lcd"]
        if "LED_Fault" in pid:
            return mats["label_r"]
        if "Viewport" in pid or "Monitoring" in pid or "Smoked" in pid:
            return mats["smoked"]
        if "Biohazard" in pid:
            return mats["label_y"]
        if "HighSpeed" in pid:
            return mats["label_r"]
        if "Insulation" in pid:
            return mats["foam"]
        if pid.startswith("R01"):
            return mats["rack"]
        if pid.startswith("A01") or pid.startswith("A05") or pid.startswith("A06"):
            return mats["white"]
        return mats["dark"]

    def size_for(pid: str):
        """Return (primitive, dims) — dims depend on type."""
        # (type, scale_xyz or radius/depth)
        if "Screw" in pid or pid.startswith("A08") or pid.startswith("A09") or pid.startswith("B07") or pid.startswith("C08") or pid.startswith("E16") or pid.startswith("F03") or pid.startswith("F13"):
            # approximate M3/M4/M5
            if "M5" in pid:
                return ("cyl", 2.5, 14)
            if "M4" in pid:
                return ("cyl", 2.0, 12)
            return ("cyl", 1.5, 8)
        if "Foot" in pid and "Screw" not in pid:
            return ("cyl", 11.0, 8.0) if pid.startswith("A07") else ("cyl", 6.0, 4.0)
        if "Pin" in pid:
            return ("cyl", 2.5, 24)
        if "LED" in pid:
            return ("cyl", 1.5, 3)
        if "Thermistor" in pid:
            return ("cyl", 1.5, 14)
        if "Fan" in pid:
            return ("cyl", 28, 16)
        if "MotorHousing" in pid:
            return ("cyl", 35, 70)
        if "Solenoid" in pid:
            return ("cyl", 8, 30)
        if "Harness" in pid:
            return ("cyl", 4, 70)
        if "Fuse" in pid or "Emergency" in pid:
            return ("cyl", 6, 8)
        if pid.startswith("C01"):
            return ("cyl", 83, 55)
        if pid.startswith("C02"):
            return ("cyl", 82, 3)
        if pid.startswith("C03"):
            return ("cyl", 78, 2.5)
        if pid.startswith("C04"):
            return ("cone", 11, 6, 18)
        if pid.startswith("C05"):
            return ("cyl", 14, 6)
        if pid.startswith("C09"):
            return ("cyl", 88, 12)
        if pid.startswith("D01"):
            return ("cyl", 70, 45)
        if pid.startswith("D02"):
            return ("cyl", 72, 10)
        if pid.startswith("D03"):
            return ("cyl", 64, 2)
        if pid.startswith("D04"):
            return ("cyl", 12, 20)
        if pid.startswith("D05"):
            return ("cyl", 5.4, 39)
        if pid.startswith("D06"):
            return ("cyl", 6.5, 8)
        if pid.startswith("D07"):
            return ("cyl", 4.5, 14)
        if pid.startswith("B02"):
            return ("cyl", 69, 3)
        if pid.startswith("B03"):
            return ("cyl", 72, 2)
        if "Vent" in pid:
            return ("box", 90, 2, 5)
        if "IEC" in pid:
            return ("box", 30, 10, 22)
        if "Nameplate" in pid:
            return ("box", 70, 1.2, 22)
        if "Label" in pid:
            return ("box", 40, 0.5, 25)
        if "Tray" in pid:
            return ("box", 110, 45, 10)
        if "Bezel" in pid or "Faceplate" in pid:
            return ("box", 260, 6, 60)
        if "LCD" in pid and "Bezel" in pid:
            return ("box", 100, 4, 50)
        if "LCD" in pid:
            return ("box", 90, 2, 40)
        if "Key" in pid:
            return ("box", 12, 3, 10)
        if "Hinge" in pid and "Screw" not in pid and "Pin" not in pid:
            return ("box", 18, 22, 14)
        if "Latch" in pid or "Striker" in pid:
            return ("box", 28, 14, 10)
        if "Handle" in pid:
            return ("box", 55, 16, 6)
        if "Sensor" in pid or "Microswitch" in pid or "Interlock" in pid:
            return ("box", 10, 8, 6)
        if "PCB" in pid:
            return ("box", 80, 55, 1.6)
        if "MotorPlate" in pid:
            return ("box", 90, 90, 6)
        if "Compressor" in pid:
            return ("box", 120, 100, 140)
        if "Condenser" in pid:
            return ("box", 25, 180, 100)
        if "Rack" in pid:
            return ("box", 130, 90, 28)
        if "Housing" in pid or pid.startswith("A01"):
            return ("box", 290, 480, 252)
        if "BaseTub" in pid:
            return ("box", 284, 474, 18)
        if "RearPanel" in pid:
            return ("box", 274, 5, 140)
        if "SideMolding_L" in pid:
            return ("box", 8, 312, 120)
        if "SideMolding_R" in pid:
            return ("box", 42, 216, 130)
        if "LidFrame" in pid:
            return ("box", 280, 280, 12)
        if "Damper" in pid:
            return ("cyl", 6, 40)
        if "Switch" in pid or "Service" in pid:
            return ("box", 16, 10, 12)
        return ("box", 20, 20, 20)

    def make_obj(pid: str, spec):
        if spec[0] == "cyl":
            _, r, depth = spec
            bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=(0, 0, 0), vertices=24)
        elif spec[0] == "cone":
            _, r1, r2, depth = spec
            bpy.ops.mesh.primitive_cone_add(radius1=r1, radius2=r2, depth=depth, location=(0, 0, 0), vertices=24)
        else:
            _, sx, sy, sz = spec
            bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
            obj = bpy.context.active_object
            obj.scale = (sx / 2, sy / 2, sz / 2)
            bpy.ops.object.transform_apply(scale=True)
            obj = bpy.context.active_object
            obj.name = pid
            if obj.data.materials:
                obj.data.materials[0] = mat_for(pid)
            else:
                obj.data.materials.append(mat_for(pid))
            return obj
        obj = bpy.context.active_object
        obj.name = pid
        if obj.data.materials:
            obj.data.materials[0] = mat_for(pid)
        else:
            obj.data.materials.append(mat_for(pid))
        return obj

    # Empties for animation
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 30))
    rotor_empty = bpy.context.active_object
    rotor_empty.name = "Rotor_Spin"

    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, -120, 61))
    lid_empty = bpy.context.active_object
    lid_empty.name = "Lid_Hinge"

    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    root = bpy.context.active_object
    root.name = "Centrifuge_Root"

    created = []
    for p in parts:
        pid = p["id"]
        spec = size_for(pid)
        obj = make_obj(pid, spec)
        # CadQuery placed: rotate rx,ry,rz then translate
        obj.rotation_euler = Euler(
            (math.radians(p["rx_deg"]), math.radians(p["ry_deg"]), math.radians(p["rz_deg"])),
            "XYZ",
        )
        obj.location = Vector((p["x"], p["y"], p["z"]))
        # cylinders default center at origin mid-height — CQ extrude from z=0
        # shift cylinders up by half height for bottom-origin match
        if spec[0] == "cyl":
            # local +Z offset before world rotation is complex; approx for upright parts
            if abs(p["rx_deg"]) < 1 and abs(p["ry_deg"]) < 1:
                obj.location.z += spec[2] / 2
        elif spec[0] == "cone":
            if abs(p["rx_deg"]) < 1 and abs(p["ry_deg"]) < 1:
                obj.location.z += spec[3] / 2
        created.append((pid, obj))

    # Parent under root / rotor / lid
    def parent_keep(child, parent):
        child.parent = parent
        child.matrix_parent_inverse = parent.matrix_world.inverted()

    for pid, obj in created:
        if pid.startswith("D"):
            parent_keep(obj, rotor_empty)
        elif pid.startswith("B"):
            parent_keep(obj, lid_empty)
        else:
            parent_keep(obj, root)

    parent_keep(rotor_empty, root)
    parent_keep(lid_empty, root)

    # Camera + light
    bpy.ops.object.camera_add(location=(420, -420, 280))
    cam = bpy.context.active_object
    cam.name = "Cam_Product"
    cam.rotation_euler = (math.radians(58), 0, math.radians(45))
    bpy.context.scene.camera = cam
    bpy.ops.object.light_add(type="AREA", location=(200, -250, 400))
    light = bpy.context.active_object
    light.data.energy = 800000
    light.data.size = 400

    # Export GLB
    os.makedirs(os.path.dirname(OUT_GLB), exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=OUT_GLB,
        export_format="GLB",
        use_selection=False,
        export_apply=False,
        export_yup=True,
    )
    print(f"Wrote {OUT_GLB}")

    # Do not overwrite software/viewer/models/ — that copy is the product-GLB hand-off.
    os.makedirs(os.path.dirname(OUT_BLEND), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
    print(f"Wrote {OUT_BLEND}")
    print(f"DONE — {len(created)} meshes")
    return 0


if __name__ == "__main__":
    try:
        import bpy  # noqa: F401
    except ImportError:
        print("Run inside Blender --background --python")
        sys.exit(1)
    sys.exit(main() or 0)
