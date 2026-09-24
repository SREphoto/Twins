/**
 * Shared lab desk + machine slide animation for lab_viewer machine switches.
 * Uses gold-sample lab geometry and optional centrifuge instrument mesh.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  buildLabRoom,
  INSTRUMENT_BENCH,
  createCentrifugeModel,
} from "../centrifuge_twin/software/viewer/centrifuge3d.js?v=20260725-lab";

/**
 * @param {HTMLElement} host
 */
export function createTransitionScene(host) {
  const w = host.clientWidth || 800;
  const h = host.clientHeight || 500;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xd0d8e0);
  scene.fog = new THREE.Fog(0xd0d8e0, 32, 70);

  const camera = new THREE.PerspectiveCamera(38, w / h, 0.05, 140);
  camera.position.set(4.0, 4.35, -5.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.innerHTML = "";
  host.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(-0.25, 2.15, -0.1);
  controls.enableDamping = true;
  controls.minDistance = 2.2;
  controls.maxDistance = 40;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.update();

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xfff8f0, 0.95);
  key.position.set(2, 16, -5);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xeef4ff, 0x8a9098, 0.55));
  const top = new THREE.DirectionalLight(0xf0f6ff, 0.65);
  top.position.set(0, 18, 0);
  scene.add(top);

  const envRoot = new THREE.Group();
  envRoot.name = "Lab_Env_Root";
  scene.add(envRoot);
  const labInfo = buildLabRoom(envRoot);

  const dock = new THREE.Group();
  dock.name = "Machine_Dock";
  dock.position.set(INSTRUMENT_BENCH.cx, labInfo.surfaceY, INSTRUMENT_BENCH.cz);
  scene.add(dock);

  let currentRoot = null;
  let anim = null;
  let raf = 0;
  let running = true;

  function clearDock() {
    while (dock.children.length) {
      const ch = dock.children[0];
      dock.remove(ch);
      ch.traverse((o) => {
        if (o.geometry) o.geometry.dispose?.();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => m.dispose?.());
        }
      });
    }
    currentRoot = null;
  }

  function makePlaceholder(kind) {
    const g = new THREE.Group();
    g.name = `Placeholder_${kind}`;
    const mat = new THREE.MeshStandardMaterial({
      color: kind === "centrifuge" ? 0xe8ecf2 : 0xb8c0c8,
      roughness: 0.4,
      metalness: 0.12,
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 2.8), mat);
    body.position.y = 0.75;
    body.castShadow = true;
    g.add(body);
    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.08, 2.9),
      new THREE.MeshStandardMaterial({ color: 0x2a313a, roughness: 0.35, metalness: 0.2 })
    );
    lid.position.y = 1.54;
    g.add(lid);
    return g;
  }

  async function setDockMachine(transitionKind) {
    clearDock();
    if (transitionKind === "centrifuge") {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 32;
        const tex = new THREE.CanvasTexture(canvas);
        const model = createCentrifugeModel(tex, { includeLab: false });
        currentRoot = model.root;
        dock.add(currentRoot);
        return;
      } catch (e) {
        console.warn("Centrifuge transition mesh failed, using box", e);
      }
    }
    currentRoot = makePlaceholder(transitionKind || "box");
    dock.add(currentRoot);
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function animateMs(durationMs, onFrame) {
    return new Promise((resolve) => {
      const t0 = performance.now();
      anim = {
        tick(now) {
          const u = Math.min(1, (now - t0) / durationMs);
          onFrame(easeInOut(u), u);
          if (u >= 1) {
            anim = null;
            resolve();
          }
        },
      };
    });
  }

  /**
   * Slide current dock machine off the desk, then bring the next kind on.
   * @param {{ outKind: string, inKind: string, durationMs?: number }} opts
   */
  async function playSwitch({ outKind, inKind, durationMs = 1000 }) {
    const half = Math.max(280, durationMs / 2);

    await setDockMachine(outKind);
    if (currentRoot) {
      currentRoot.position.set(0, 0, 0);
      currentRoot.rotation.set(0, 0, 0);
    }

    await animateMs(half, (e) => {
      if (!currentRoot) return;
      currentRoot.position.x = e * 8.5;
      currentRoot.position.y = e * 0.12;
      currentRoot.rotation.y = e * 0.35;
    });

    clearDock();
    await setDockMachine(inKind);
    if (currentRoot) {
      currentRoot.position.set(-8.5, 0.12, 0);
      currentRoot.rotation.set(0, -0.35, 0);
    }

    await animateMs(half, (e) => {
      if (!currentRoot) return;
      currentRoot.position.x = -8.5 * (1 - e);
      currentRoot.position.y = 0.12 * (1 - e);
      currentRoot.rotation.y = -0.35 * (1 - e);
    });

    if (currentRoot) {
      currentRoot.position.set(0, 0, 0);
      currentRoot.rotation.set(0, 0, 0);
    }
  }

  function loop(now) {
    if (!running) return;
    if (anim?.tick) anim.tick(now);
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  function resize() {
    const nw = host.clientWidth || 800;
    const nh = host.clientHeight || 500;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  }

  function dispose() {
    running = false;
    cancelAnimationFrame(raf);
    clearDock();
    renderer.dispose();
    host.innerHTML = "";
  }

  function setVisible(vis) {
    host.style.visibility = vis ? "visible" : "hidden";
    host.style.pointerEvents = vis ? "auto" : "none";
    if (vis) resize();
  }

  return {
    setDockMachine,
    playSwitch,
    resize,
    dispose,
    setVisible,
    dock,
    labInfo,
  };
}
