import * as THREE from 'three';

// Minimal canvas mock if in Node
if (typeof document === 'undefined') {
  global.document = {
    createElement(tag) {
      if (tag === 'canvas') {
        const ctx = {
          fillStyle: '',
          strokeStyle: '',
          lineWidth: 1,
          font: '',
          textAlign: '',
          fillRect: () => {},
          strokeRect: () => {},
          fillText: () => {},
          beginPath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          stroke: () => {},
          arc: () => {},
          ellipse: () => {},
          bezierCurveTo: () => {},
          fill: () => {},
          save: () => {},
          restore: () => {},
          scale: () => {},
          translate: () => {},
          rotate: () => {},
          createLinearGradient: () => ({ addColorStop: () => {} }),
          createRadialGradient: () => ({ addColorStop: () => {} })
        };
        return {
          width: 512,
          height: 512,
          getContext: () => ctx
        };
      }
      return {};
    }
  };
}

console.log('Testing canvas texture generators...');

function generateBrickTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#b5aba1';
  ctx.fillRect(0, 0, 1024, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 4);
  return tex;
}

const tex = generateBrickTexture();
console.log('Generated brick texture:', tex.uuid, 'repeat:', tex.repeat.x, tex.repeat.y);
console.log('Success!');
