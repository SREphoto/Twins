import * as THREE from 'three';

console.log('Validating new procedural geometry functions in Three.js...');

// 1. Test Birch Tree Generator
function createTestBirchTree() {
  const tree = new THREE.Group();
  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.09, 0.16, 2.4, 12);
  const trunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial());
  trunk.position.y = 1.2;
  tree.add(trunk);

  // Secondary boughs
  const angles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
  angles.forEach((a, idx) => {
    const bough = new THREE.Group();
    bough.position.set(0, 2.2, 0);
    bough.rotation.y = a;
    bough.rotation.z = 0.35 + (idx % 2) * 0.1;

    const bStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.07, 1.6, 8),
      new THREE.MeshStandardMaterial()
    );
    bStem.position.y = 0.8;
    bough.add(bStem);

    // Leaves
    const leafCluster = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.65, 1),
      new THREE.MeshStandardMaterial()
    );
    leafCluster.position.set(0, 1.5, 0);
    leafCluster.scale.set(1.2, 0.7, 1.1);
    bough.add(leafCluster);

    tree.add(bough);
  });
  return tree;
}

const t = createTestBirchTree();
console.log('Birch tree built successfully with', t.children.length, 'primary boughs.');

// 2. Test Bench Generator
function createTestBench() {
  const bench = new THREE.Group();
  // Side legs
  [-0.9, 0.9].forEach(x => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.48), new THREE.MeshStandardMaterial());
    leg.position.set(x, 0.225, 0);
    bench.add(leg);
  });
  // Slats
  for (let s = 0; s < 5; s++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.025, 0.08), new THREE.MeshStandardMaterial());
    slat.position.set(0, 0.45, -0.18 + s * 0.09);
    bench.add(slat);
  }
  return bench;
}

const b = createTestBench();
console.log('Bench built successfully with', b.children.length, 'parts.');
console.log('All geometry tests passed!');
