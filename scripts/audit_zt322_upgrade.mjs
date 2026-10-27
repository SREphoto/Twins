import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ROOT = process.cwd();
const MEDIA_DIR = path.join(ROOT, 'disintegration_tester_twin', 'docs', 'media');
const SHOWCASE_DIR = path.join(ROOT, 'docs', 'media', 'showcase');
const ARTIFACT_DIR = '/Users/Samuel/.gemini/antigravity/brain/404ee9eb-4f25-4a92-8065-08d73fc60b5f';
const PORT = 8782;
const CDP_PORT = 9238;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = req.url.split('?')[0];
      const filePath = path.join(ROOT, cleanUrl === '/' ? 'index.html' : cleanUrl);
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

const SHOTS = [
  {
    name: 'ui_01_modern_dark_lab',
    expr: `
      window.app.stopGuidedTour();
      window.app.setTheme('modern');
      window.app.setCameraPreset('iso');
    `,
    wait: 1200
  },
  {
    name: 'ui_02_light_lab_mood',
    expr: `
      const m = document.getElementById('lab-light-mood');
      if (m) { m.value = 'bright'; m.dispatchEvent(new Event('change')); }
    `,
    wait: 1000
  },
  {
    name: 'ui_03_retro_chemmate',
    expr: `
      document.getElementById('btn-view-retro')?.click();
      window.app.setCameraPreset('iso');
    `,
    wait: 1200
  },
  {
    name: 'ui_04_night_red',
    expr: `
      document.getElementById('btn-view-night')?.click();
      window.app.setCameraPreset('iso');
    `,
    wait: 1200
  },
  {
    name: 'ui_05_wireframe_and_panels_hidden',
    expr: `
      document.getElementById('btn-view-modern')?.click();
      document.getElementById('btn-wireframe')?.click();
      document.getElementById('btn-toggle-panels')?.click();
    `,
    wait: 1200
  },
  {
    name: 'ui_06_part_explorer_isolate',
    expr: `
      document.getElementById('btn-toggle-panels')?.click();
      document.getElementById('btn-wireframe')?.click();
      window.app.focusPart({ id: 'Body_Motor_HarmonicStepper', label: 'M1: 24V BLDC Finned Servo Motor', group: 'Motors & Mechanics' });
    `,
    wait: 1200
  },
  {
    name: 'zt_STAGE7A_POWER_ROUTING',
    copyToMedia: true,
    copyToShowcase: 'zt322_internal_power',
    expr: `
      window.app.clearPartExplorer();
      window.app.engine.setCutaway(false);
      window.app.applyTourChapter(6);
      document.getElementById('tourOverlay')?.classList.add('hidden');
    `,
    wait: 1200
  },
  {
    name: 'zt_STAGE7B_MOTORS_ACTUATORS',
    copyToMedia: true,
    copyToShowcase: 'zt322_internal_motors',
    expr: `
      window.app.applyTourChapter(7);
      document.getElementById('tourOverlay')?.classList.add('hidden');
    `,
    wait: 1200
  },
  {
    name: 'zt_STAGE7C_SENSORS_OPTICS',
    copyToMedia: true,
    expr: `
      window.app.applyTourChapter(8);
      document.getElementById('tourOverlay')?.classList.add('hidden');
    `,
    wait: 1200
  },
  {
    name: 'zt_STAGE7D_DATA_COMMS',
    copyToMedia: true,
    copyToShowcase: 'zt322_internal_data',
    expr: `
      window.app.applyTourChapter(9);
      document.getElementById('tourOverlay')?.classList.add('hidden');
    `,
    wait: 1200
  },
  {
    name: 'zt_CAM_EXPLODED',
    copyToMedia: true,
    expr: `
      window.app.stopGuidedTour();
      window.app.setExplodedValue(1.0);
      window.app.engine.camera.position.set(-6.4, 5.8, -9.8);
      window.app.engine.controls.target.set(0.2, 3.2, -0.2);
      window.app.engine.controls.update();
    `,
    wait: 1200
  },
  {
    name: 'zt322_MECHANISM_ARTICULATION',
    copyToMedia: true,
    expr: `
      window.app.setExplodedValue(0);
      window.app.engine.setCutaway(true);
      window.app.engine.enclosureShell.visible = false;
      window.app.engine.bathGroup.visible = true;
      window.app.engine.driveGroup.visible = true;
      window.app.engine.driveHead.visible = true;
      window.app.engine.camera.position.set(-2.4, 4.8, -2.4);
      window.app.engine.controls.target.set(0.0, 4.4, 0.2);
      window.app.engine.controls.update();
    `,
    wait: 1200
  },
  {
    name: 'zt322_WIRING_BAY',
    copyToMedia: true,
    expr: `
      window.app.setExplodedValue(0);
      window.app.engine.setCutaway(true);
      window.app.engine.enclosureShell.visible = false;
      window.app.engine.bathGroup.visible = false;
      window.app.engine.driveGroup.visible = true;
      window.app.engine.camera.position.set(-1.9, 2.2, 0.4);
      window.app.engine.controls.target.set(-0.5, 0.6, 1.1);
      window.app.engine.controls.update();
    `,
    wait: 1200
  },
  {
    name: 'zt322_CONSOLE_TOUCH',
    copyToMedia: true,
    expr: `
      window.app.setExplodedValue(0);
      window.app.engine.setCutaway(false);
      window.app.engine.enclosureShell.visible = true;
      window.app.engine.bathGroup.visible = true;
      window.app.engine.camera.position.set(0.35, 1.62, -3.45);
      window.app.engine.controls.target.set(0.35, 1.40, -2.01);
      window.app.engine.controls.update();
    `,
    wait: 1200
  },
  {
    name: 'zt322_STATE_ACTIVE_REACTION',
    copyToMedia: true,
    expr: `
      window.app.setExplodedValue(0);
      window.app.engine.setCutaway(false);
      window.app.engine.enclosureShell.visible = true;
      window.app.engine.bathGroup.visible = true;
      window.app.selectSample('effervescent_alka');
      window.app.startTest();
      window.app.engine.camera.position.set(-1.8, 3.4, -3.8);
      window.app.engine.controls.target.set(0.0, 2.8, -0.85);
      window.app.engine.controls.update();
    `,
    wait: 1600
  }
];

async function run() {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  fs.mkdirSync(SHOWCASE_DIR, { recursive: true });

  const server = await startServer();
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--window-size=1600,1000',
    '--hide-scrollbars',
    '--mute-audio',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  let consoleExceptions = 0;

  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise((r) => ws.addEventListener('open', r));

    let msgId = 1;
    const pending = new Map();
    ws.addEventListener('message', (ev) => {
      const data = JSON.parse(ev.data);
      if (data.method === 'Runtime.exceptionThrown') {
        consoleExceptions++;
        const ed = data.params?.exceptionDetails;
        console.error('[BROWSER EXCEPTION]', ed?.text, ed?.exception?.description, ed?.url, ed?.lineNumber);
      }
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data);
        pending.delete(data.id);
      }
    });

    const send = (method, params = {}) =>
      new Promise((resolve) => {
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

    const url = `http://127.0.0.1:${PORT}/disintegration_tester_twin/software/viewer/index.html`;
    await send('Page.navigate', { url });
    await sleep(3200);

    for (const shot of SHOTS) {
      await send('Runtime.evaluate', { expression: shot.expr });
      await sleep(shot.wait || 1000);

      const snap = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(snap.result.data, 'base64');

      const artPath = path.join(ARTIFACT_DIR, `${shot.name}.png`);
      fs.writeFileSync(artPath, buf);
      console.log(`✅ Saved ${artPath}`);

      if (shot.copyToMedia) {
        fs.writeFileSync(path.join(MEDIA_DIR, `${shot.name}.png`), buf);
      }
      if (shot.copyToShowcase) {
        fs.writeFileSync(path.join(SHOWCASE_DIR, `${shot.copyToShowcase}.png`), buf);
      }
    }

    // Also update showcase iso and active shots
    await send('Runtime.evaluate', {
      expression: `
        window.app.stopGuidedTour();
        window.app.setTheme('modern');
        window.app.setCameraPreset('iso');
      `
    });
    await sleep(1000);
    const isoSnap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SHOWCASE_DIR, 'zt322_iso.png'), Buffer.from(isoSnap.result.data, 'base64'));

    await send('Runtime.evaluate', {
      expression: `
        window.app.startTest();
        window.app.engine.camera.position.set(-2.6, 3.6, -5.0);
        window.app.engine.controls.target.set(0.0, 2.8, -0.85);
        window.app.engine.controls.update();
      `
    });
    await sleep(1000);
    const actSnap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SHOWCASE_DIR, 'zt322_active_bath.png'), Buffer.from(actSnap.result.data, 'base64'));

    console.log(`\nTotal exceptions: ${consoleExceptions}`);
    ws.close();
    if (consoleExceptions > 0) process.exitCode = 1;
  } finally {
    chrome.kill();
    server.close();
  }
}

run();
