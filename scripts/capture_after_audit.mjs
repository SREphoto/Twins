import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'docs', 'media', 'audit');
const CDP_PORT = 9269;
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

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--user-data-dir=/tmp/chrome_audit_profile_' + Date.now(),
    '--window-size=1600,1000',
    '--hide-scrollbars',
    '--mute-audio',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise((r) => ws.addEventListener('open', r));

    let msgId = 1;
    const pending = new Map();
    ws.addEventListener('message', (ev) => {
      const data = JSON.parse(ev.data);
      if (data.method === 'Runtime.exceptionThrown') {
        const ed = data.params?.exceptionDetails;
        console.error('[BROWSER EXCEPTION]', ed?.text, ed?.exception?.description);
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

    const url = 'http://127.0.0.1:8765/lab_viewer/index.html';
    console.log('Navigating to', url);
    await send('Page.navigate', { url });
    await sleep(4000);

    const shots = [
      {
        name: 'after_living_wall',
        expr: `
          window.__labApp.player.glideToStation(
            new window.THREE.Vector3(4.8, 1.65, -4.5),
            new window.THREE.Vector3(7.92, 1.65, -4.5),
            "Living Wall Close-up"
          );
        `,
        wait: 2500
      },
      {
        name: 'after_living_wall_wide',
        expr: `
          window.__labApp.player.glideToStation(
            new window.THREE.Vector3(3.5, 1.75, -2.0),
            new window.THREE.Vector3(7.92, 1.60, -4.5),
            "Living Wall Oblique"
          );
        `,
        wait: 2500
      },
      {
        name: 'after_exterior_campus',
        expr: `
          window.__labApp.player.glideToStation(
            new window.THREE.Vector3(13.0, 4.5, -28.0),
            new window.THREE.Vector3(13.0, 1.8, -9.0),
            "Exterior Campus Promenade"
          );
        `,
        wait: 2500
      },
      {
        name: 'after_trees_planters',
        expr: `
          window.__labApp.player.glideToStation(
            new window.THREE.Vector3(18.0, 2.5, -16.0),
            new window.THREE.Vector3(15.8, 1.8, -11.75),
            "River Birch & Teak Bench"
          );
        `,
        wait: 2500
      },
      {
        name: 'after_exterior_wall',
        expr: `
          window.__labApp.player.glideToStation(
            new window.THREE.Vector3(-2.0, 2.5, -16.0),
            new window.THREE.Vector3(-2.0, 1.8, -9.5),
            "Exterior Brick Facade"
          );
        `,
        wait: 2500
      },
      {
        name: 'after_japanese_maple',
        expr: `
          window.__labApp.player.glideToStation(
            new window.THREE.Vector3(5.5, 2.2, -15.5),
            new window.THREE.Vector3(3.5, 1.7, -12.4),
            "Japanese Red Maple & Promenade"
          );
        `,
        wait: 2500
      }
    ];

    for (const shot of shots) {
      console.log('Capturing:', shot.name);
      await send('Runtime.evaluate', { expression: shot.expr });
      await sleep(shot.wait || 2000);

      const snap = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(snap.result.data, 'base64');
      const p = path.join(OUT_DIR, `${shot.name}.png`);
      fs.writeFileSync(p, buf);
      console.log(`✅ Saved ${p} (${(buf.length / 1024).toFixed(1)} KB)`);
    }

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
  }
}

main().then(() => console.log('🎉 Audit captures complete!')).catch(console.error);
