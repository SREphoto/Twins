import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ROOT = process.cwd();
const PORT = 8790;
const CDP_PORT = 9245;
const OUT_DIR = path.join(ROOT, 'docs', 'media', 'audit_wires');
fs.mkdirSync(OUT_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4'
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let cleanUrl = req.url.split('?')[0];
      if (cleanUrl.endsWith('/')) cleanUrl += 'index.html';
      let filePath = path.join(ROOT, cleanUrl);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 35; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const pages = await res.json();
      const page = pages.find((p) => p.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (e) {}
    await sleep(300);
  }
  throw new Error('Could not connect to Chrome CDP');
}

async function run() {
  const server = await startServer();
  console.log(`Local web server listening on http://127.0.0.1:${PORT}`);

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--window-size=1920,1080',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    `http://127.0.0.1:${PORT}/disintegration_tester_twin/software/viewer/index.html`
  ]);

  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise((resolve) => ws.onopen = resolve);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const curId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('BROWSER LOG:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
      } else if (msg.method === 'Runtime.exceptionThrown') {
        console.error('BROWSER EXCEPTION:', msg.params.exceptionDetails);
      }
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });

    await sleep(2500);

    const shots = [
      {
        name: 'audit_fix1_fan_antenna_rear_panel',
        expr: `
          (() => {
            const app = window.app;
            const eng = app.engine;
            document.querySelectorAll('.panel-collapsible').forEach(el => el.style.display = 'none');
            eng.onWindowResize();
            eng.setCutaway(false);
            eng.enclosureShell.visible = true;
            app.isPluggedIn = true;
            app.powerSwitchOn = true;
            app.state = 'STANDBY';
            app.syncToEngine();
            // Rear view close-up of fan exhaust and Wi-Fi antenna
            eng.camera.position.set(1.10, 0.85, 4.40);
            eng.controls.target.set(1.10, 0.85, 2.00);
            eng.controls.update();
            eng.renderer.render(eng.scene, eng.camera);
          })()
        `,
        wait: 600
      },
      {
        name: 'audit_fix2_internal_no_labels',
        expr: `
          (() => {
            const app = window.app;
            const eng = app.engine;
            eng.setCutaway(true);
            eng.enclosureShell.visible = false;
            eng.bathGroup.visible = true;
            app.isPluggedIn = true;
            app.powerSwitchOn = true;
            app.state = 'STANDBY';
            app.syncToEngine();
            // Looking at PCB, PSU, toroid, and M1 showing all internal spec labels removed
            eng.camera.position.set(-2.8, 2.60, 0.80);
            eng.controls.target.set(-0.60, 0.90, 0.10);
            eng.controls.update();
            eng.renderer.render(eng.scene, eng.camera);
          })()
        `,
        wait: 600
      },
      {
        name: 'audit_fix3_power_switch_inlet_rear',
        expr: `
          (() => {
            const app = window.app;
            const eng = app.engine;
            eng.setCutaway(false);
            eng.enclosureShell.visible = true;
            app.isPluggedIn = true;
            app.powerSwitchOn = true;
            app.state = 'STANDBY';
            app.syncToEngine();
            // Close-up of rear AC inlet and red rocker switch
            eng.camera.position.set(-1.12, 0.48, 3.80);
            eng.controls.target.set(-1.12, 0.48, 2.00);
            eng.controls.update();
            eng.renderer.render(eng.scene, eng.camera);
          })()
        `,
        wait: 600
      },
      {
        name: 'audit_fix4_water_bath_rear_no_green_wire',
        expr: `
          (() => {
            const app = window.app;
            const eng = app.engine;
            eng.setCutaway(true);
            eng.enclosureShell.visible = false;
            eng.bathGroup.visible = true;
            app.isPluggedIn = true;
            app.powerSwitchOn = true;
            app.state = 'STANDBY';
            app.syncToEngine();
            // Angle matching user's Image 4: looking through water bath toward tower
            eng.camera.position.set(1.40, 3.40, -2.40);
            eng.controls.target.set(0.00, 3.00, 0.20);
            eng.controls.update();
            eng.renderer.render(eng.scene, eng.camera);
          })()
        `,
        wait: 600
      },
      {
        name: 'audit_fix5_toroid_center_power_feed',
        expr: `
          (() => {
            const app = window.app;
            const eng = app.engine;
            eng.setCutaway(true);
            eng.enclosureShell.visible = false;
            app.isPluggedIn = true;
            app.powerSwitchOn = true;
            app.state = 'STANDBY';
            app.syncToEngine();
            // Angle matching user's Image 5 looking down at toroidal transformer and center feed
            eng.camera.position.set(-2.10, 1.35, -0.45);
            eng.controls.target.set(-1.20, 0.45, -1.02);
            eng.controls.update();
            eng.renderer.render(eng.scene, eng.camera);
            eng.controls.update();
            eng.renderer.render(eng.scene, eng.camera);
          })()
        `,
        wait: 600
      },
      {
        name: 'audit_fix6_m1_motor_tower_conduit',
        expr: `
          (() => {
            const app = window.app;
            const eng = app.engine;
            eng.setCutaway(true);
            eng.enclosureShell.visible = false;
            app.isPluggedIn = true;
            app.powerSwitchOn = true;
            app.state = 'STANDBY';
            app.syncToEngine();
            // Angle matching user's Image 1 looking at M1 motor and rear tower conduit
            eng.camera.position.set(1.60, 4.60, 0.60);
            eng.controls.target.set(0.00, 4.20, 0.80);
            eng.controls.update();
            eng.renderer.render(eng.scene, eng.camera);
          })()
        `,
        wait: 600
      }
    ];

    for (const s of shots) {
      console.log(`Capturing [${s.name}]...`);
      const evalRes = await send('Runtime.evaluate', { expression: s.expr });
      if (evalRes && evalRes.exceptionDetails) {
        console.error(`  Eval error in [${s.name}]:`, evalRes.exceptionDetails);
      }
      await sleep(s.wait);
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const outPath = path.join(OUT_DIR, `${s.name}.png`);
      fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
      console.log(`  Saved to ${outPath}`);
    }

    ws.close();
  } finally {
    chrome.kill();
    server.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
