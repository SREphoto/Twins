import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'docs', 'media', 'showcase');
const PORT = 8780;
const CDP_PORT = 9235;

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

const TARGETS = [
  {
    name: 'centrifuge_iso',
    url: '/centrifuge_twin/software/viewer/index.html',
    wait: 3000,
  },
  {
    name: 'centrifuge_exploded',
    url: '/centrifuge_twin/software/viewer/index.html',
    action: `document.getElementById('btn-explode')?.click()`,
    wait: 2000,
  },
  {
    name: 'balance_iso',
    url: '/balance_twin/software/viewer/index.html',
    wait: 3000,
  },
  {
    name: 'rotovap_iso',
    url: '/rotovap_twin/software/viewer/index.html',
    wait: 3000,
  },
  {
    name: 'hotplate_iso',
    url: '/hotplate_twin/software/viewer/index.html',
    wait: 3000,
  },
  {
    name: 'reactor_iso',
    url: '/high_pressure_reactor_twin/software/viewer/index.html',
    wait: 3000,
  },
  {
    name: 'reactor_exploded',
    url: '/high_pressure_reactor_twin/software/viewer/index.html',
    action: `document.getElementById('btn-cam-exploded')?.click()`,
    wait: 2000,
  },
  {
    name: 'glovebox_iso',
    url: '/glove_box_twin/software/viewer/index.html',
    wait: 3000,
  }
];

async function main() {
  console.log('📸 Launching automated showcase screenshot capture...');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const server = await startServer();

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--window-size=1600,1000',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    `http://127.0.0.1:${PORT}/index.html`
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
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data.result);
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

    for (const t of TARGETS) {
      console.log(`📷 Capturing ${t.name} from ${t.url}...`);
      await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${t.url}` });
      await sleep(t.wait || 2500);

      if (t.action) {
        await send('Runtime.evaluate', { expression: t.action });
        await sleep(1500);
      }

      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      const outPath = path.join(OUT_DIR, `${t.name}.png`);
      fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
      console.log(`✅ Saved ${t.name}.png (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
    }

    // Also copy disintegration tester showcases into OUT_DIR for unified referencing
    const ztMedia = path.join(ROOT, 'disintegration_tester_twin', 'docs', 'media');
    const ztCopies = [
      ['zt_CAM_ISO.png', 'zt322_iso.png'],
      ['zt_STAGE5_RUNNING_BATH_CLOSEUP.png', 'zt322_active_bath.png'],
      ['zt_CAM_EXPLODED.png', 'zt322_exploded.png'],
      ['zt_STAGE7A_POWER_ROUTING.png', 'zt322_power_routing.png'],
      ['zt_STAGE7B_MOTORS_ACTUATORS.png', 'zt322_motors_actuators.png'],
      ['zt_STAGE7C_SENSORS_OPTICS.png', 'zt322_sensors_optics.png'],
      ['zt_STAGE7D_DATA_COMMS.png', 'zt322_data_comms.png']
    ];

    for (const [src, dst] of ztCopies) {
      const srcPath = path.join(ztMedia, src);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, path.join(OUT_DIR, dst));
        console.log(`✅ Copied ${dst}`);
      }
    }

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    server.close();
  }
  console.log('🎉 Showcase screenshot generation complete!');
}

main().catch(err => {
  console.error('❌ Error during capture:', err);
  process.exit(1);
});
