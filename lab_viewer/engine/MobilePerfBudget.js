/**
 * MobilePerfBudget.js — keeps the Grand Lab inside a phone's memory and GPU budget.
 * Only constructed when the app runs in mobile mode; desktop never loads this path.
 *
 * 1. Texture cap: any texture larger than maxTextureSize is redrawn at that size before upload.
 * 2. Light budget: three.js compiles every visible light into every lit shader. The full lab has
 *    ~96 point/spot lights, which makes huge shaders and very long frames on phone GPUs (the
 *    usual cause of iOS/Android killing the tab). On mobile only the N point lights nearest the
 *    camera stay on; the count never changes, so shaders compile once.
 * 3. Detail culling: small meshes far from the camera are moved to a hidden layer so they are not
 *    drawn. Large shapes (walls, roofs, ground) are always drawn.
 */
import * as THREE from "three";

const HIDDEN_LAYER = 7;

export class MobilePerfBudget {
  constructor(scene, camera, options = {}) {
    this.scene = scene;
    this.camera = camera;
    this.maxTextureSize = options.maxTextureSize || 1024;
    this.maxPointLights = options.maxPointLights ?? 4;
    this.cullBase = options.cullBase ?? 14; // metres
    this.cullPerMetre = options.cullPerMetre ?? 55; // extra metres of draw distance per metre of object radius
    this.neverCullRadius = options.neverCullRadius ?? 3.0;

    this._seen = new WeakSet();
    this._texSeen = new WeakSet();
    this._cullables = [];
    this._pointLights = [];
    this._frame = 0;
    this._tmp = new THREE.Vector3();
    this._sphere = new THREE.Sphere();

    this.refresh();
  }

  /** Re-scan the scene for new meshes, lights and textures (cheap, only new objects are processed). */
  refresh() {
    const pointLights = [];
    const alive = [];
    this.scene.traverse((o) => {
      if (o.isPointLight) {
        pointLights.push(o);
      } else if (o.isSpotLight || o.isRectAreaLight) {
        o.visible = false;
      } else if (o.isMesh) {
        if (!this._seen.has(o)) {
          this._seen.add(o);
          this._capMaterialTextures(o.material);
          this._registerCullable(o);
        }
      }
    });
    // Drop cullables that were removed from the scene (disposed machines etc.)
    for (const c of this._cullables) {
      let root = c.mesh;
      while (root.parent) root = root.parent;
      if (root === this.scene) alive.push(c);
    }
    this._cullables = alive;
    this._pointLights = pointLights;
    this._updateLights();
    this._updateCulling();
  }

  _capMaterialTextures(material) {
    const mats = Array.isArray(material) ? material : [material];
    for (const m of mats) {
      if (!m) continue;
      for (const key in m) {
        const t = m[key];
        if (t && t.isTexture && !this._texSeen.has(t)) {
          this._texSeen.add(t);
          this._capTexture(t);
        }
      }
    }
  }

  _capTexture(t) {
    const img = t.image;
    if (!img || t.isDataTexture || t.isCompressedTexture || t.isVideoTexture) return;
    const w = img.width || 0;
    const h = img.height || 0;
    const max = this.maxTextureSize;
    if (w <= max && h <= max) return;
    if (typeof document === "undefined") return;
    const s = max / Math.max(w, h);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * s));
    canvas.height = Math.max(1, Math.round(h * s));
    try {
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      if (typeof img.close === "function") img.close(); // free ImageBitmap memory
      t.image = canvas;
      t.needsUpdate = true;
    } catch (e) {
      console.warn("MobilePerfBudget: could not downscale texture", e);
    }
  }

  _registerCullable(mesh) {
    if (mesh.isInstancedMesh || mesh.isSkinnedMesh || mesh.frustumCulled === false) return;
    const g = mesh.geometry;
    if (!g) return;
    if (!g.boundingSphere) g.computeBoundingSphere();
    if (!g.boundingSphere || !isFinite(g.boundingSphere.radius)) return;
    mesh.updateWorldMatrix(true, false);
    this._sphere.copy(g.boundingSphere).applyMatrix4(mesh.matrixWorld);
    const r = this._sphere.radius;
    if (r >= this.neverCullRadius) return;
    const d = this.cullBase + r * this.cullPerMetre;
    this._cullables.push({ mesh, center: this._sphere.center.clone(), maxDistSq: d * d, hidden: false });
  }

  _updateLights() {
    const cam = this.camera.position;
    const lights = this._pointLights;
    if (!lights.length) return;
    const ranked = lights
      .map((l) => ({ l, d: l.getWorldPosition(this._tmp).distanceToSquared(cam) }))
      .sort((a, b) => a.d - b.d);
    ranked.forEach((e, i) => {
      e.l.visible = i < this.maxPointLights;
    });
  }

  _updateCulling() {
    const cam = this.camera.position;
    for (const c of this._cullables) {
      const far = c.center.distanceToSquared(cam) > c.maxDistSq;
      if (far !== c.hidden) {
        c.hidden = far;
        if (far) c.mesh.layers.set(HIDDEN_LAYER);
        else c.mesh.layers.set(0);
      }
    }
  }

  update() {
    this._frame++;
    if (this._frame % 150 === 0) this.refresh(); // pick up lazily loaded machines and GLBs
    else if (this._frame % 15 === 0) this._updateLights();
    if (this._frame % 6 === 0) this._updateCulling();
  }
}
