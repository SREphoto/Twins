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
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
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
    '--disable-gpu',
    `--remote-debugging-port=${CDP_PORT}`,
    '--hide-scrollbars',
    '--window-size=1920,1080',
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
        name: 'audit_01_internals_wiring_overhaul',
        expr: `
          const app = window.app;
          const eng = app.engine;
          eng.setCutaway(true);
          eng.enclosureShell.visible = false;
          eng.bathGroup.visible = true;
          app.isPluggedIn = true;
          app.powerSwitchOn = true;
          app.heaterActive = true;
          app.state = 'STANDBY';
          app.syncToEngine();
          // Angle matching user's red-circled image looking down at PSU, SSR & PCB
          eng.camera.position.set(-2.8, 1.85, 0.4);
          eng.controls.target.set(-0.85, 0.50, 0.25);
          eng.controls.update();
          eng.render();
        `,
        wait: 600
      },
      {
        name: 'audit_02_console_screen_and_buttons',
        expr: `
          const app = window.app;
          const eng = app.engine;
          eng.setCutaway(false);
          eng.enclosureShell.visible = true;
          app.isPluggedIn = true;
          app.powerSwitchOn = true;
          app.state = 'STANDBY';
          app.syncToEngine();
          // Straight on close-up of front console UI_LCD and physical buttons
          eng.camera.position.set(0.35, 1.40, -4.2);
          eng.controls.target.set(0.35, 1.35, -2.01);
          eng.controls.update();
          eng.render();
        `,
        wait: 600
      },
      {
        name: 'audit_03_boot_screen_sredesigns',
        expr: `
          const app = window.app;
          const eng = app.engine;
          eng.setCutaway(false);
          eng.enclosureShell.visible = true;
          app.isPluggedIn = true;
          app.powerSwitchOn = true;
          app.state = 'BOOTING';
          app.bootProgress = 0.65;
          app.syncToEngine();
          eng.camera.position.set(0.35, 1.48, -3.8);
          eng.controls.target.set(0.35, 1.45, -2.01);
          eng.controls.update();
          eng.render();
        `,
        wait: 600
      },
      {
        name: 'audit_04_exterior_fit_finish_and_fan',
        expr: `
          const app = window.app;
          const eng = app.engine;
          eng.setCutaway(false);
          eng.enclosureShell.visible = true;
          app.isPluggedIn = true;
          app.powerSwitchOn = true;
          app.state = 'STANDBY';
          app.syncToEngine();
          // 3/4 rear-side isometric showing corner rails, fan exhaust port & stainless bath rim
          eng.camera.position.set(4.8, 3.2, 4.2);
          eng.controls.target.set(0.2, 1.6, 0.0);
          eng.controls.update();
          eng.render();
        `,
        wait: 600
      }
    ];

    for (const s of shots) {
      console.log(`Capturing [${s.name}]...`);
      await send('Runtime.evaluate', { expression: s.expr });
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
