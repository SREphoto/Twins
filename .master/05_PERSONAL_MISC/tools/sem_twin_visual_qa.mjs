// sem_twin_visual_qa.mjs — Permanent 19-shot CDP visual QA harness for sem_twin.
// Usage: QA_ARTIFACT_DIR=<dir> node .master/05_PERSONAL_MISC/tools/sem_twin_visual_qa.mjs
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

const ROOT = '/home/antigravity/SREphoto/Twins';
const QA_DIR = path.join(ROOT, 'sem_twin', 'docs', 'qa');
const ARTIFACT_DIR = process.env.QA_ARTIFACT_DIR || '';
const PORT = 8779;
const CDP_PORT = 9249;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg'
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = (req.url || '/').split('?')[0];
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

async function getWsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const pages = await res.json();
      const page = pages.find((p) => p.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('Could not connect to Chrome CDP');
}

async function main() {
  const server = await startServer();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sem-qa-'));
  const chrome = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    `--user-data-dir=${tmpDir}`,
    `--remote-debugging-port=${CDP_PORT}`,
    '--window-size=1600,900',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    '--ignore-certificate-errors',
    ...(process.env.HTTPS_PROXY || process.env.HTTP_PROXY
      ? [
          `--proxy-server=${process.env.HTTPS_PROXY || process.env.HTTP_PROXY}`,
          '--proxy-bypass-list=localhost;127.0.0.1'
        ]
      : []),
    '--mute-audio',
    `http://127.0.0.1:${PORT}/sem_twin/software/viewer/index.html`
  ]);

  let exceptions = 0;
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let msgId = 1;
    const pending = new Map();
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(new Error(JSON.stringify(data.error)));
        else resolve(data.result);
      } else if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') {
        exceptions++;
        console.error('CONSOLE ERROR:', JSON.stringify(data.params.args).slice(0, 400));
      } else if (data.method === 'Runtime.exceptionThrown') {
        exceptions++;
        console.error('PAGE EXCEPTION:', JSON.stringify(data.params));
      }
    };
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Wait until window.app is ready
    let ready = false;
    for (let i = 0; i < 60; i++) {
      const chk = await send('Runtime.evaluate', {
        expression: 'Boolean(window.app && window.app.semModel)',
        returnByValue: true
      });
      if (chk?.result?.value) {
        ready = true;
        break;
      }
      await sleep(250);
    }
    if (!ready) throw new Error('window.app failed to initialize within timeout');
    await sleep(600);

    const shots = [
      ['CAM_ISO', `window.app.setPanelsHidden(true); window.app.setCutawayMode(false); window.app.setExplodedValue(0); window.app.semModel.setDoorOpen(0); window.app.semModel.setPluggedIn(true); window.app.state.isPluggedIn=true; window.app.state.beamOn=true; window.app.setCameraPreset('CAM_ISO'); window.app.renderNow();`],
      ['CAM_FRONT', `window.app.setPanelsHidden(true); window.app.setCameraPreset('CAM_FRONT'); window.app.renderNow();`],
      ['CAM_SIDE', `window.app.setPanelsHidden(true); window.app.setCameraPreset('CAM_SIDE'); window.app.renderNow();`],
      ['CAM_TOP', `window.app.setPanelsHidden(true); window.app.setCameraPreset('CAM_TOP'); window.app.renderNow();`],
      ['CAM_EXPLODED', `window.app.setPanelsHidden(true); window.app.setCutawayMode(false); window.app.setExplodedValue(0.85); window.app.setCameraPreset('CAM_EXPLODED'); window.app.renderNow();`],
      ['CAM_CONSOLE', `window.app.setPanelsHidden(false); window.app.setExplodedValue(0); window.app.setCutawayMode(false); window.app.setCameraPreset('CAM_CONSOLE'); window.app.renderNow();`],
      ['CAM_PROCESS_CLOSEUP', `window.app.setPanelsHidden(false); window.app.setExplodedValue(0); window.app.setCutawayMode(true); window.app.setCameraPreset('CAM_COLUMN'); window.app.renderNow();`],
      ['STATE_ACTIVE', `window.app.setPanelsHidden(false); window.app.setExplodedValue(0); window.app.setCutawayMode(true); window.app.setCameraPreset('CAM_ISO'); window.app.renderNow();`],
      ['STATE_COMPLETE', `window.app.setPanelsHidden(false); window.app.setCutawayMode(false); window.app.captureCurrentScanToFilmstrip(); window.app.setCameraPreset('CAM_CONSOLE'); window.app.renderNow();`],
      ['STATE_LABWARE_PREP', `window.app.setPanelsHidden(false); window.app.setCutawayMode(false); window.app.camera.position.set(14.8, 10.4, -4.8); window.app.controls.target.set(14.8, 8.6, 1.3); window.app.controls.update(); window.app.renderNow();`],
      ['STATE_INSERTION_SAFETY', `window.app.setPanelsHidden(false); window.app.setCutawayMode(false); window.app.semModel.setDoorOpen(1.0); window.app.camera.position.set(-8.0, 10.6, -6.2); window.app.controls.target.set(-4.15, 9.5, -0.2); window.app.controls.update(); window.app.renderNow();`],
      ['STATE_STANDBY', `window.app.setPanelsHidden(false); window.app.semModel.setDoorOpen(0); window.app.state.isPluggedIn=true; window.app.state.beamOn=false; window.app.semModel.setPluggedIn(true); window.app.semModel.setBeamActive(false, 0); window.app.camera.position.set(-4.8, 3.8, 9.2); window.app.controls.target.set(-2.4, 1.8, 5.4); window.app.controls.update(); window.app.renderNow();`],
      ['STATE_UNPLUGGED', `window.app.setPanelsHidden(false); window.app.state.isPluggedIn=false; window.app.state.beamOn=false; window.app.semModel.setPluggedIn(false); window.app.semModel.setBeamActive(false, 0); window.app.camera.position.set(-4.8, 3.8, 9.2); window.app.controls.target.set(-2.4, 1.8, 5.4); window.app.controls.update(); window.app.renderNow();`],
      ['STAGE7_POWER_ROUTING', `window.app.setPanelsHidden(true); window.app.state.isPluggedIn=true; window.app.state.beamOn=true; window.app.semModel.setPluggedIn(true); window.app.setCutawayMode(true); window.app.setCameraPreset('STAGE7_POWER_ROUTING'); window.app.renderNow();`],
      ['STAGE7_MOTORS_ACTUATORS', `window.app.setPanelsHidden(true); window.app.setCutawayMode(true); window.app.setCameraPreset('STAGE7_MOTORS_ACTUATORS'); window.app.renderNow();`],
      ['STAGE7_SENSORS_OPTICS', `window.app.setPanelsHidden(true); window.app.setCutawayMode(true); window.app.setCameraPreset('STAGE7_SENSORS_OPTICS'); window.app.renderNow();`],
      ['STAGE7_DATA_COMMS', `window.app.setPanelsHidden(true); window.app.setCutawayMode(true); window.app.setCameraPreset('STAGE7_DATA_COMMS'); window.app.renderNow();`],
      ['LAB_SEM_SUITE_AIRLOCK', `window.app.setPanelsHidden(true); window.app.setExplodedValue(0); window.app.setCutawayMode(true); window.app.camera.position.set(13.5, 13.0, -16.5); window.app.controls.target.set(0.0, 8.8, 0.5); window.app.controls.update(); window.app.renderNow();`],
      ['LAB_SEM_SUITE_CONSOLE', `window.app.setPanelsHidden(true); window.app.setExplodedValue(0); window.app.setCutawayMode(false); window.app.camera.position.set(-10.5, 12.2, -16.5); window.app.controls.target.set(-0.5, 8.8, 0.2); window.app.controls.update(); window.app.renderNow();`]
    ];

    for (const [name, expr] of shots) {
      await send('Runtime.evaluate', { expression: expr });
      await sleep(300);
      const snap = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(snap.data, 'base64');
      fs.writeFileSync(path.join(QA_DIR, `${name}.png`), buf);
      if (ARTIFACT_DIR) fs.writeFileSync(path.join(ARTIFACT_DIR, `${name}.png`), buf);
      console.log(`Captured ${name}.png (${(buf.length / 1024).toFixed(1)} KB)`);
    }

    console.log(`Total exceptions: ${exceptions}`);
    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    server.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
