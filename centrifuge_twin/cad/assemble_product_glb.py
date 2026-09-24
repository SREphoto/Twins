#!/usr/bin/env python3
"""
Import product STLs (already in world mm) and export a clean GLB.

Does NOT explode parts. Does NOT re-place geometry.
Spin: Rotor_Spin empty at chamber axis.
Lid: Lid_Hinge empty at rear hinge.

  Blender --background --python cad/assemble_product_glb.py
"""

from __future__ import annotations

import math
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MESH = os.path.join(ROOT, "export", "mesh")
OUT_GLB = os.path.join(ROOT, "export", "glb", "centrifuge_product.glb")
VIEWER = os.path.join(ROOT, "software", "viewer", "models", "centrifuge_assembly.glb")
OUT_BLEND = os.path.join(ROOT, "cad", "centrifuge_product.blend")
PREVIEW = os.path.join(ROOT, "export", "renders", "product_preview.png")

# Product-look lid hinge (rear of 250mm lid, deck ~177)
HINGE = (0.0, 115.0, 182.0)


def main():
    import bpy
    from mathutils import Vector

    bpy.ops.wm.read_factory_settings(use_empty=True)

    bpy.context.scene.unit_settings.system = "METRIC"
    bpy.context.scene.unit_settings.scale_length = 0.001

    def new_mat(name, color, rough, metal=0.0, alpha=1.0):
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = (*color, 1.0)
        b.inputs["Roughness"].default_value = rough
        b.inputs["Metallic"].default_value = metal
        if alpha < 1.0:
            b.inputs["Alpha"].default_value = alpha
            m.blend_method = "HASHED"
            if "Transmission Weight" in b.inputs:
                b.inputs["Transmission Weight"].default_value = 0.55
        return m

    m_body = new_mat("BodyPaint", (0.86, 0.88, 0.90), 0.38, 0.08)
    m_rotor = new_mat("RotorMetal", (0.32, 0.34, 0.38), 0.22, 0.95)
    m_lid = new_mat("LidDark", (0.18, 0.19, 0.21), 0.35, 0.2)

    def load_stl(path, name, mat):
        before = set(bpy.data.objects)
        try:
            bpy.ops.wm.stl_import(filepath=path)
        except Exception:
            bpy.ops.import_mesh.stl(filepath=path)
        obj = list(set(bpy.data.objects) - before)[0]
        obj.name = name
        obj.location = (0, 0, 0)
        obj.rotation_euler = (0, 0, 0)
        obj.scale = (1, 1, 1)
        obj.data.materials.clear()
        obj.data.materials.append(mat)
        # shade smooth
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        try:
            bpy.ops.object.shade_smooth()
        except Exception:
            pass
        return obj

    body = load_stl(os.path.join(MESH, "body_static.stl"), "Body_Static", m_body)
    rotor = load_stl(os.path.join(MESH, "rotor_spin.stl"), "Rotor_Mesh", m_rotor)
    lid = load_stl(os.path.join(MESH, "lid_hinge.stl"), "Lid_Mesh", m_lid)

    # --- hierarchy: empties only, mesh stays in place via parent inverse ---
    def empty(name, loc):
        bpy.ops.object.empty_add(type="PLAIN_AXES", location=loc)
        e = bpy.context.active_object
        e.name = name
        e.empty_display_size = 20
        return e

    root = empty("Centrifuge_Root", (0, 0, 0))
    rotor_spin = empty("Rotor_Spin", (0, 0, 0))
    lid_hinge = empty("Lid_Hinge", HINGE)

    def parent_keep(child, parent):
        mw = child.matrix_world.copy()
        child.parent = parent
        child.matrix_parent_inverse = parent.matrix_world.inverted()
        child.matrix_world = mw

    parent_keep(body, root)
    parent_keep(rotor_spin, root)
    parent_keep(lid_hinge, root)

    # Rotor mesh: origin at spin axis (0,0,0) is fine — verts already around axis
    parent_keep(rotor, rotor_spin)

    # Lid: move origin to hinge WITHOUT moving mesh, then parent
    bpy.ops.object.select_all(action="DESELECT")
    lid.select_set(True)
    bpy.context.view_layer.objects.active = lid
    bpy.context.scene.cursor.location = Vector(HINGE)
    bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
    parent_keep(lid, lid_hinge)

    # Studio
    bpy.ops.object.light_add(type="AREA", location=(280, -350, 320))
    key = bpy.context.active_object
    key.data.energy = 1.5e6
    key.data.size = 600
    key.data.color = (1, 0.98, 0.94)

    bpy.ops.object.light_add(type="AREA", location=(-300, 50, 220))
    fill = bpy.context.active_object
    fill.data.energy = 5e5
    fill.data.size = 500
    fill.data.color = (0.8, 0.88, 1.0)

    bpy.ops.object.light_add(type="SUN", location=(100, 100, 400))
    sun = bpy.context.active_object
    sun.data.energy = 2.0

    # Camera 3/4 looking into chamber
    bpy.ops.object.camera_add(location=(340, -380, 280))
    cam = bpy.context.active_object
    cam.rotation_euler = (math.radians(58), 0, math.radians(42))
    bpy.context.scene.camera = cam
    cam.data.clip_end = 5000
    cam.data.lens = 50

    # Subtle ground
    bpy.ops.mesh.primitive_plane_add(size=1200, location=(0, 0, -8))
    ground = bpy.context.active_object
    ground.name = "Ground"
    mg = new_mat("Ground", (0.15, 0.16, 0.18), 0.9)
    ground.data.materials.append(mg)

    world = bpy.data.worlds.new("StudioWorld")
    bpy.context.scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.22, 0.24, 0.26, 1)
    world.node_tree.nodes["Background"].inputs[1].default_value = 0.8

    # Default: lid slightly open so rotor is visible
    lid_hinge.rotation_euler[0] = math.radians(-55)

    os.makedirs(os.path.dirname(OUT_GLB), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=OUT_GLB,
        export_format="GLB",
        use_selection=False,
        export_apply=False,
        export_yup=True,
        export_materials="EXPORT",
        export_extras=True,
    )
    print("Wrote", OUT_GLB)
    os.makedirs(os.path.dirname(VIEWER), exist_ok=True)
    shutil.copy2(OUT_GLB, VIEWER)
    print("Copied", VIEWER)

    # Preview render
    os.makedirs(os.path.dirname(PREVIEW), exist_ok=True)
    bpy.context.scene.render.resolution_x = 1280
    bpy.context.scene.render.resolution_y = 800
    bpy.context.scene.render.filepath = PREVIEW
    try:
        bpy.context.scene.render.engine = "BLENDER_EEVEE_NEXT"
    except Exception:
        try:
            bpy.context.scene.render.engine = "BLENDER_EEVEE"
        except Exception:
            bpy.context.scene.render.engine = "CYCLES"
            bpy.context.scene.cycles.samples = 24
    bpy.ops.render.render(write_still=True)
    print("Preview", PREVIEW)

    bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
    print("Wrote", OUT_BLEND)

    # Sanity: print bounds
    for o in (body, rotor, lid):
        print(o.name, "dims", [round(x, 1) for x in o.dimensions], "loc", [round(x, 1) for x in o.location])
    return 0


if __name__ == "__main__":
    try:
        import bpy  # noqa: F401
    except ImportError:
        print("Run inside Blender")
        sys.exit(1)
    sys.exit(main() or 0)
