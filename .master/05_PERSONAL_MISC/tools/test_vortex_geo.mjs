import * as THREE from 'three';

console.log('Testing Vortex Parametric Geometry...');

const N = 24;
const M1 = 12; // Wall
const M2 = 12; // Funnel

// Calculate total vertices
// Wall: (M1 + 1) * (N + 1)
// Funnel: (M2 + 1) * (N + 1)
// Bottom cap: (N + 2)
const wallVertCount = (M1 + 1) * (N + 1);
const funnelVertCount = (M2 + 1) * (N + 1);
const totalVerts = wallVertCount + funnelVertCount + (N + 2);

console.log('Total Vertices:', totalVerts);

const positions = new Float32Array(totalVerts * 3);
const indices = [];

// Build indices for wall grid
for (let j = 0; j < M1; j++) {
  for (let i = 0; i < N; i++) {
    const a = j * (N + 1) + i;
    const b = (j + 1) * (N + 1) + i;
    const c = (j + 1) * (N + 1) + (i + 1);
    const d = j * (N + 1) + (i + 1);
    indices.push(a, b, d);
    indices.push(b, c, d);
  }
}

// Build indices for funnel grid
const funnelOffset = wallVertCount;
for (let j = 0; j < M2; j++) {
  for (let i = 0; i < N; i++) {
    const a = funnelOffset + j * (N + 1) + i;
    const b = funnelOffset + (j + 1) * (N + 1) + i;
    const c = funnelOffset + (j + 1) * (N + 1) + (i + 1);
    const d = funnelOffset + j * (N + 1) + (i + 1);
    indices.push(a, b, d);
    indices.push(b, c, d);
  }
}

// Bottom cap indices
const capOffset = wallVertCount + funnelVertCount;
const centerIdx = capOffset + N + 1;
for (let i = 0; i < N; i++) {
  indices.push(centerIdx, capOffset + i, capOffset + i + 1);
}

console.log('Total Triangles:', indices.length / 3);

const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geo.setIndex(indices);

function updateMesh(rpm, depthMm, theta) {
  const pos = geo.attributes.position.array;
  const yBot = 2.0;
  const yRest = 42.0;
  const rpmRatio = Math.min(1.0, rpm / 3200.0);
  
  // Wall climbs from 42 to 74 mm
  const wallClimb = depthMm * 0.85;
  const yWall = yRest + wallClimb;
  
  // Eye plunges from 42 down to 10 mm
  const yEye = Math.max(10.0, yRest - depthMm * 0.95);
  
  let ptr = 0;
  // 1. Wall vertices
  for (let j = 0; j <= M1; j++) {
    const u = j / M1;
    const y = yBot + u * (yWall - yBot);
    const r = (y < 22.0) ? (1.5 + (8.1 - 1.5) * (y / 22.0)) : 8.1;
    for (let i = 0; i <= N; i++) {
      const angle = (i / N) * Math.PI * 2;
      pos[ptr++] = Math.cos(angle) * r;
      pos[ptr++] = y;
      pos[ptr++] = Math.sin(angle) * r;
    }
  }

  // 2. Funnel vertices (from rim rho = 1 down to eye rho = 0)
  for (let j = 0; j <= M2; j++) {
    const rho = 1.0 - (j / M2); // 1 at rim, 0 at eye
    const r = rho * 8.1;
    for (let i = 0; i <= N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const wave = (rho > 0.3 && rpm > 100) ? Math.sin(3.0 * angle - theta) * (rpmRatio * 1.5 * rho) : 0.0;
      const y = yEye + Math.pow(rho, 2) * (yWall - yEye) + wave;
      pos[ptr++] = Math.cos(angle) * r;
      pos[ptr++] = y;
      pos[ptr++] = Math.sin(angle) * r;
    }
  }

  // 3. Bottom cap
  for (let i = 0; i <= N; i++) {
    const angle = (i / N) * Math.PI * 2;
    pos[ptr++] = Math.cos(angle) * 1.5;
    pos[ptr++] = yBot;
    pos[ptr++] = Math.sin(angle) * 1.5;
  }
  // Center vertex
  pos[ptr++] = 0;
  pos[ptr++] = yBot;
  pos[ptr++] = 0;

  geo.attributes.position.needsUpdate = true;
  geo.computeVertexNormals();
}

updateMesh(0, 0, 0);
console.log('Update at 0 RPM OK!');
updateMesh(2400, 26, 1.5);
console.log('Update at 2400 RPM OK!');
console.log('Y bounds:', geo.computeBoundingBox(), geo.boundingBox);
console.log('Test PASSED!');
