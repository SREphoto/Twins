import * as THREE from "three";

// Provide minimal browser mock for canvas & document
if (typeof document === "undefined") {
  global.document = {
    createElement(tag) {
      if (tag === "canvas") {
        return {
          width: 512,
          height: 512,
          getContext: () => ({
            fillStyle: "",
            strokeStyle: "",
            lineWidth: 1,
            font: "",
            textAlign: "",
            fillRect: () => {},
            strokeRect: () => {},
            fillText: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            stroke: () => {},
            arc: () => {},
            fill: () => {},
            closePath: () => {},
            createLinearGradient: () => ({ addColorStop: () => {} }),
            createRadialGradient: () => ({ addColorStop: () => {} })
          })
        };
      }
      return {};
    }
  };
}

const { LabCasework } = await import("../lab_viewer/engine/LabCasework.js");
const { LabEnvironment3D } = await import("../lab_viewer/engine/LabEnvironment3D.js");
const { LabUtilities } = await import("../lab_viewer/engine/LabUtilities.js");

console.log("Instantiating test scene...");
const scene = new THREE.Scene();
const colliders = [];

console.log("Testing LabEnvironment3D...");
const env = new LabEnvironment3D(scene, colliders);

console.log("Testing LabCasework...");
const casework = new LabCasework(scene, colliders);

console.log("Testing LabUtilities...");
const utils = new LabUtilities(scene, colliders);

let totalMeshes = 0;
let totalMaterials = 0;
let mappedMaterials = 0;
let invalidTextures = 0;

function auditObject(obj, source) {
  obj.traverse((child) => {
    if (child.isMesh && child.material) {
      totalMeshes++;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        totalMaterials++;
        if (mat.map) {
          mappedMaterials++;
          if (!mat.map.matrix || !mat.map.matrix.elements) {
            console.error(`[FAIL] ${source} child '${child.name || "unnamed"}' material '${mat.name || "unnamed"}' map is missing matrix!`, mat.map);
            invalidTextures++;
          } else {
            // Verify Three.js matrix update
            try {
              if (mat.map.matrixAutoUpdate) mat.map.updateMatrix();
              const testM = new THREE.Matrix3();
              testM.copy(mat.map.matrix);
            } catch (err) {
              console.error(`[FAIL] Matrix3.copy failed on texture matrix:`, err);
              invalidTextures++;
            }
          }
        }
      });
    }
  });
}

auditObject(env.root, "LabEnvironment3D");
auditObject(casework.root, "LabCasework");
auditObject(utils.root, "LabUtilities");

console.log("--- AUDIT RESULTS ---");
console.log(`Total Meshes Audited: ${totalMeshes}`);
console.log(`Total Materials: ${totalMaterials}`);
console.log(`Materials with Texture Map: ${mappedMaterials}`);
console.log(`Invalid Texture Matrix Errors: ${invalidTextures}`);

if (invalidTextures > 0) {
  console.error("TEST FAILED with invalid textures!");
  process.exit(1);
} else {
  console.log("ALL TEXTURES VALID AND COMPATIBLE WITH Three.js Matrix3.copy!");
}
