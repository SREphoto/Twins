import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ROOT = process.cwd();
const SCRATCH = path.join(ROOT, 'scratch_audit');
fs.mkdirSync(SCRATCH, { recursive: true });

const PORT = 8765;
const CDP_PORT = 9250;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 35; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const pages = await res.json();
      const page = pages.find(p => p.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (e) {}
    await sleep(300);
  }
  throw new Error('Could not connect to Chrome CDP');
}

async function main() {
  console.log('Starting headless Chrome...');
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--window-size=1600,1000',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    `http://127.0.0.1:${PORT}/lab_viewer/index.html`
  ]);

  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const pending = new Map();
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        const text = data.params.args.map(a => a.value || a.description || '').join(' ');
        if (data.params.type === 'error') {
          console.error(`[BROWSER ERROR]`, text);
        } else {
          console.log(`[BROWSER LOG]`, text);
        }
      } else if (data.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER EXCEPTION]', data.params.exceptionDetails);
      }

      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data);
        pending.delete(data.id);
      }
    };

    const send = (method, params = {}) => new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Catch texSubImage2D errors gracefully
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        (() => {
          const orig = WebGL2RenderingContext.prototype.texSubImage2D;
          WebGL2RenderingContext.prototype.texSubImage2D = function(...args) {
            try {
              return orig.apply(this, args);
            } catch (err) {
              console.error("[CAUGHT texSubImage2D]", err.message, args.map(a => typeof a === 'object' && a ? a.constructor?.name : a));
            }
          };
        })()
      `
    });

    console.log('Navigating to lab viewer...');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/lab_viewer/index.html` });
    await sleep(4000);

    const detailedAudit = await send('Runtime.evaluate', {
      expression: `
        (() => {
          try {
            const app = window.__labApp;
            const THREE = window.THREE;
            const res = { islands: [], docks: [], utilities: [], casework: [] };

            // Find all casework benches / desks
            app.casework.root.children.forEach(c => {
              const b = new THREE.Box3().setFromObject(c);
              res.casework.push({
                name: c.name,
                pos: [c.position.x, c.position.y, c.position.z].map(v => +v.toFixed(3)),
                min: [b.min.x, b.min.y, b.min.z].map(v => +v.toFixed(3)),
                max: [b.max.x, b.max.y, b.max.z].map(v => +v.toFixed(3)),
                size: [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z].map(v => +v.toFixed(3))
              });
            });

            // Find all mounted twin docks
            app.dockManager.docks.forEach(d => {
              const b = new THREE.Box3().setFromObject(d);
              res.docks.push({
                id: d.userData.id,
                name: d.userData.name,
                pos: [d.position.x, d.position.y, d.position.z].map(v => +v.toFixed(3)),
                min: [b.min.x, b.min.y, b.min.z].map(v => +v.toFixed(3)),
                max: [b.max.x, b.max.y, b.max.z].map(v => +v.toFixed(3)),
                size: [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z].map(v => +v.toFixed(3))
              });
            });

            // Find all utilities items (accessories, reagents, etc.)
            app.utilities.root.children.forEach(u => {
              const b = new THREE.Box3().setFromObject(u);
              res.utilities.push({
                name: u.name,
                pos: [u.position.x, u.position.y, u.position.z].map(v => +v.toFixed(3)),
                min: [b.min.x, b.min.y, b.min.z].map(v => +v.toFixed(3)),
                max: [b.max.x, b.max.y, b.max.z].map(v => +v.toFixed(3)),
                size: [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z].map(v => +v.toFixed(3))
              });
            });

            return res;
          } catch (e) {
            return { error: e.stack || e.message };
          }
        })()
      `,
      returnByValue: true
    });

    const auditData = detailedAudit.result?.result?.value;
    fs.writeFileSync(path.join(SCRATCH, 'audit_report.json'), JSON.stringify(auditData, null, 2));
    console.log('Saved audit_report.json');

    // Camera viewpoints for visual confirmation
    const views = [
      { name: 'analytical_island', pos: [-10.0, 1.8, -2.2], look: [-10.0, 0.95, -4.5] },
      { name: 'analytical_west_end', pos: [-14.0, 1.5, -4.0], look: [-12.0, 1.0, -4.0] },
      { name: 'pharma_island', pos: [-2.0, 1.8, -2.2], look: [-2.0, 0.95, -4.5] },
      { name: 'sample_prep_island', pos: [-0.5, 1.8, 2.5], look: [-0.5, 0.95, 4.65] },
      { name: 'synthesis_bay', pos: [-11.0, 1.8, 6.2], look: [-11.0, 1.1, 8.0] },
      { name: 'wet_titration', pos: [-10.0, 1.8, -6.5], look: [-10.0, 1.0, -8.3] },
      { name: 'microscopy_suite', pos: [3.8, 1.8, -3.0], look: [5.5, 1.1, -2.5] },
      { name: 'chemical_storage_vault', pos: [4.5, 1.8, 6.0], look: [4.5, 1.2, 8.4] },
      { name: 'overview', pos: [-5.0, 6.0, 0.0], look: [-5.0, 0.9, -1.0] }
    ];

    for (const v of views) {
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const app = window.__labApp;
            app.camera.position.set(${v.pos[0]}, ${v.pos[1]}, ${v.pos[2]});
            app.camera.lookAt(${v.look[0]}, ${v.look[1]}, ${v.look[2]});
            if (app.player) {
              app.player.position.set(${v.pos[0]}, ${v.pos[1]}, ${v.pos[2]});
            }
            app.renderer.render(app.scene, app.camera);
          })()
        `
      });
      await sleep(400);
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      if (shot.result?.data) {
        fs.writeFileSync(path.join(SCRATCH, `view_${v.name}.png`), Buffer.from(shot.result.data, 'base64'));
        console.log(`Saved view_${v.name}.png`);
      }
    }

  } finally {
    chrome.kill('SIGTERM');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
