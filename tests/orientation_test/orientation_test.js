import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Setup Three.js Scene
const container = document.getElementById('viewport');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0f18);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3.5, -9.0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0);
controls.enableDamping = true;

// Laboratory Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 12, -8);
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.8);
dirLight2.position.set(-8, 8, 5);
scene.add(dirLight2);

// Workbench surface datum
const benchGeo = new THREE.BoxGeometry(16, 0.2, 8);
const benchMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
const bench = new THREE.Mesh(benchGeo, benchMat);
bench.position.set(0, -0.1, 0);
scene.add(bench);

// Grid helper on bench
const grid = new THREE.GridHelper(16, 16, 0x38bdf8, 0x334155);
grid.position.y = 0.01;
scene.add(grid);

/**
 * Standardized High-DPI Canvas Label Generator
 */
function createDecalCanvas(title, sub, angleText) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, 320);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#1e293b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 320);

  // Outer border
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 312);

  // TOP Indicator Banner
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(8, 8, 496, 42);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('▲ ▲ ▲   TOP / UPPER EDGE   ▲ ▲ ▲', 256, 38);

  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 256, 105);

  // Angle / Type
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(angleText, 256, 150);

  // Left-to-Right verification arrow
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 24px monospace';
  ctx.fillText('[LEFT]  ────────▶  [RIGHT]', 256, 205);

  // Subtext
  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px sans-serif';
  ctx.fillText(sub, 256, 245);

  // BOTTOM Indicator Banner
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(8, 270, 496, 42);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('▼ ▼ ▼   BOTTOM / LOWER EDGE   ▼ ▼ ▼', 256, 300);

  return canvas;
}

/**
 * Universal Guaranteed Upright Decal Factory
 * 
 * Works for ANY surface: horizontal, sloped at any angle, vertical front, vertical rear, or side flanks.
 * 
 * Mathematical Contract:
 * - normal: Target direction pointing outward from surface toward viewer.
 * - upHint: Desired "Up" direction for text (default world +Y; for horizontal +Y planes, use +Z).
 */
export function createUniversalDecalQuad(width, height, normal, upHint, title, sub, angleText) {
  const canvas = createDecalCanvas(title, sub, angleText);
  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // 1. Plane starts in XY plane facing +Z
  // Default UVs: (-w/2, +h/2) has (0, 1), (+w/2, +h/2) has (1, 1), etc.
  const geo = new THREE.PlaneGeometry(width, height);

  // 2. We construct an orthonormal basis [Right, Up, Normal] in world coordinates:
  const n = normal.clone().normalize();
  let vUp = upHint ? upHint.clone().normalize() : new THREE.Vector3(0, 1, 0);

  // If normal is strictly parallel to vUp (only true horizontal decks facing pure +Y or -Y):
  if (Math.abs(n.dot(vUp)) > 0.999) {
    // For horizontal top surface facing operator at -Z, top edge points away in +Z:
    vUp = n.y > 0 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 0, -1);
  }

  // Orthogonalize vUp with respect to n: vUp = normalize(vUp - (vUp · n) * n)
  vUp.sub(n.clone().multiplyScalar(vUp.dot(n))).normalize();

  // The text must read from Left to Right when an observer looks along -n at the surface:
  // When an observer looks at the surface from the direction of +n:
  // Observer's Right vector is uRight.
  // In the observer's view: uRight × vUp points along +n!
  // Therefore: uRight = vUp × n (Wait! Let's check cross: (vUp × n) × vUp = (vUp · vUp) n = n!)
  // In Three.js:
  // If uRight = vUp × n, then uRight × vUp = n.
  // Let's verify for front-facing plane (n = 0, 0, -1; vUp = 0, 1, 0):
  // vUp × n = (0, 1, 0) × (0, 0, -1) = (-1, 0, 0).
  // But for an operator at -Z looking towards +Z, RIGHT is (+1, 0, 0)!
  // Why is uRight = (-1, 0, 0)?
  // Because in right-hand rule, looking down -Z, X is right and Y is up, but X × Y = +Z (AWAY from viewer)!
  // So a viewer looking at a front face has (Right × Up) = -n!
  // Therefore, for the text to appear right-side up and unmirrored to that viewer:
  // We align the plane so:
  // - Top points along vUp
  // - Right points along the viewer's perceived right: uViewerRight = n × vUp!
  const uRight = new THREE.Vector3().crossVectors(n, vUp).normalize();

  // Now, what basis can we use to rotate PlaneGeometry?
  // Since PlaneGeometry in local space has localX = (1, 0, 0), localY = (0, 1, 0), localZ = (0, 0, 1):
  // Notice that localX × localY = localZ (+1 determinant)!
  // But uRight × vUp = (n × vUp) × vUp = -n (determinant is -1)!
  // You cannot achieve a left-handed frame using a pure 3D rotation alone!
  // Three.js PlaneGeometry by default faces +Z, and from +Z: Right is +X, Up is +Y.
  // If we rotate it by 180° around Y (so it faces -Z):
  // Local +X now points to -X (mirrored)!
  // TO UN-MIRROR IT: We simply invert the UV X attribute on the geometry:
  // u = 1.0 - u!
  // AND because flipY = false, we invert UV Y attribute:
  // v = 1.0 - v!

  // Apply canonical UV transformation on PlaneGeometry:
  // With flipY = false, V = 0 is top of canvas, V = 1 is bottom.
  // Three.js PlaneGeometry by default has V = 1 at top (+Y), so setY flips V upright.
  // U is already left-to-right (0 to 1), so do NOT invert X.
  const uvAttr = geo.attributes.uv;
  for (let i = 0; i < uvAttr.count; i++) {
    uvAttr.setY(i, 1.0 - uvAttr.getY(i)); // Fix vertical flip for flipY = false
  }
  uvAttr.needsUpdate = true;

  // Now the plane has:
  // When rotated so local +Z = n, and local +Y = vUp:
  // Text will be 100% upright and 100% unmirrored!
  // Basis for pure rotation:
  // We need a right-handed basis where local +Z = n, local +Y = vUp, and local +X = vUp × n:
  const localX = new THREE.Vector3().crossVectors(vUp, n).normalize();
  const rotMatrix = new THREE.Matrix4().makeBasis(localX, vUp, n);

  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.setRotationFromMatrix(rotMatrix);

  // Add a thin dark backing plate so it looks like a real physical display bezel
  const bezelGeo = new THREE.BoxGeometry(width + 0.04, height + 0.04, 0.02);
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.5 });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  bezel.position.z = -0.012; // Just behind decal plane
  mesh.add(bezel);

  return mesh;
}

// ---------------------------------------------------------------------------
// 10 Benchmark Planes at Real-World Laboratory Instrument Angles
// ---------------------------------------------------------------------------
const planeConfigs = [
  // 1. Horizontal Desk Surface (0° pitch, Y-up)
  {
    title: 'PLANE 1: HORIZONTAL',
    sub: 'Flat benchtop deck facing UP',
    angleText: 'PITCH: 0.0° (Y-UP)',
    normal: new THREE.Vector3(0, 1, 0),
    upHint: new THREE.Vector3(0, 0, 1),
    pos: new THREE.Vector3(-4.5, 0.02, -1.8),
  },
  // 2. Sloped Console 15° (Shimadzu UV-Vis / Benchtop pH deck)
  {
    title: 'PLANE 2: SLOPED 15°',
    sub: 'Gentle sloped console deck',
    angleText: 'PITCH: 15.0°',
    normal: new THREE.Vector3(0, Math.cos(15 * Math.PI / 180), -Math.sin(15 * Math.PI / 180)),
    upHint: new THREE.Vector3(0, 1, 0),
    pos: new THREE.Vector3(-2.2, 0.35, -1.8),
  },
  // 3. Sloped Console 25° (Mettler S470 touchscreen slope)
  {
    title: 'PLANE 3: SLOPED 25°',
    sub: 'Ergonomic laboratory touchscreen',
    angleText: 'PITCH: 25.0°',
    normal: new THREE.Vector3(0, Math.cos(25 * Math.PI / 180), -Math.sin(25 * Math.PI / 180)),
    upHint: new THREE.Vector3(0, 1, 0),
    pos: new THREE.Vector3(0.0, 0.55, -1.8),
  },
  // 4. Sloped Console 35° (Analytical balance keypad)
  {
    title: 'PLANE 4: SLOPED 35°',
    sub: 'Steep instrument console panel',
    angleText: 'PITCH: 35.0°',
    normal: new THREE.Vector3(0, Math.cos(35 * Math.PI / 180), -Math.sin(35 * Math.PI / 180)),
    upHint: new THREE.Vector3(0, 1, 0),
    pos: new THREE.Vector3(2.2, 0.75, -1.8),
  },
  // 5. Sloped Console 45° (Chamfered bevel / display pod)
  {
    title: 'PLANE 5: SLOPED 45°',
    sub: '45-degree angled bezel',
    angleText: 'PITCH: 45.0°',
    normal: new THREE.Vector3(0, Math.cos(45 * Math.PI / 180), -Math.sin(45 * Math.PI / 180)),
    upHint: new THREE.Vector3(0, 1, 0),
    pos: new THREE.Vector3(4.5, 0.95, -1.8),
  },
  // 6. Vertical Front Apron (90° vertical, facing front operator at -Z)
  {
    title: 'PLANE 6: VERTICAL FRONT',
    sub: 'Vertical front fascia / apron',
    angleText: 'PITCH: 90.0° (FACING -Z)',
    normal: new THREE.Vector3(0, 0, -1),
    upHint: new THREE.Vector3(0, 1, 0),
    pos: new THREE.Vector3(-4.5, 1.6, 0.6),
  },
  // 7. Vertical Rear Bulkhead (90° vertical, facing rear +Z)
  {
    title: 'PLANE 7: VERTICAL REAR',
    sub: 'Rear I/O panel / connectors',
    angleText: 'PITCH: 90.0° (FACING +Z)',
    normal: new THREE.Vector3(0, 0, 1),
    upHint: new THREE.Vector3(0, 1, 0),
    pos: new THREE.Vector3(-2.2, 1.6, 0.6),
  },
  // 8. Vertical Left Flank (facing -X)
  {
    title: 'PLANE 8: LEFT FLANK',
    sub: 'Left sidewall housing panel',
    angleText: 'YAW: -90.0° (FACING -X)',
    normal: new THREE.Vector3(-1, 0, 0),
    upHint: new THREE.Vector3(0, 1, 0),
    pos: new THREE.Vector3(0.0, 1.6, 0.6),
  },
  // 9. Vertical Right Flank (facing +X)
  {
    title: 'PLANE 9: RIGHT FLANK',
    sub: 'Right sidewall mains switch',
    angleText: 'YAW: +90.0° (FACING +X)',
    normal: new THREE.Vector3(1, 0, 0),
    upHint: new THREE.Vector3(0, 1, 0),
    pos: new THREE.Vector3(2.2, 1.6, 0.6),
  },
  // 10. Compound 3D Yaw + Pitch (Articulated swing arm / swivel display)
  {
    title: 'PLANE 10: COMPOUND 3D',
    sub: 'Swivel display (25° pitch + 30° yaw)',
    angleText: 'COMPOUND 3D SWIVEL',
    normal: new THREE.Vector3(
      Math.sin(30 * Math.PI / 180) * Math.cos(25 * Math.PI / 180),
      Math.sin(25 * Math.PI / 180),
      -Math.cos(30 * Math.PI / 180) * Math.cos(25 * Math.PI / 180)
    ).normalize(),
    upHint: new THREE.Vector3(0, 1, 0),
    pos: new THREE.Vector3(4.5, 1.6, 0.6),
  },
];

const planeMeshes = [];
planeConfigs.forEach((cfg, idx) => {
  const mesh = createUniversalDecalQuad(
    1.6,
    1.0,
    cfg.normal,
    cfg.upHint,
    cfg.title,
    cfg.sub,
    cfg.angleText
  );
  mesh.position.copy(cfg.pos);
  mesh.name = `DecalPlane_${idx + 1}`;
  scene.add(mesh);
  planeMeshes.push(mesh);
});

// Window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Camera Presets
const presets = {
  front: { pos: new THREE.Vector3(0, 3.2, -8.5), target: new THREE.Vector3(0, 1.2, -0.6) },
  iso:   { pos: new THREE.Vector3(7.5, 5.5, -7.5), target: new THREE.Vector3(0, 1.2, -0.6) },
  top:   { pos: new THREE.Vector3(0, 9.5, -0.6), target: new THREE.Vector3(0, 0, -0.6) },
  side:  { pos: new THREE.Vector3(9.5, 3.0, -0.6), target: new THREE.Vector3(0, 1.2, -0.6) },
};

function setView(key) {
  const p = presets[key];
  if (!p) return;
  camera.position.copy(p.pos);
  controls.target.copy(p.target);
  controls.update();
}

document.getElementById('btn-front')?.addEventListener('click', () => setView('front'));
document.getElementById('btn-iso')?.addEventListener('click', () => setView('iso'));
document.getElementById('btn-top')?.addEventListener('click', () => setView('top'));
document.getElementById('btn-side')?.addEventListener('click', () => setView('side'));

window.camera = camera;
window.controls = controls;
window.setView = setView;
window.focusPlane = (idx) => {
  const cfg = planeConfigs[idx - 1];
  if (!cfg) return;
  const n = cfg.normal.clone().normalize();
  controls.target.copy(cfg.pos);
  if (Math.abs(n.y) > 0.9) {
    camera.position.copy(cfg.pos).add(new THREE.Vector3(0, 2.2, -1.8));
  } else {
    camera.position.copy(cfg.pos).add(n.multiplyScalar(2.8));
  }
  controls.update();
};
window.__ready = true;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
