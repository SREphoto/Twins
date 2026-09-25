import fs from 'fs';
import path from 'path';

const CDP_PORT = 9222;
const TARGET_URL = 'http://127.0.0.1:8765/vortex_mixer_twin/software/viewer/index.html';
const ARTIFACT_DIR = '/Users/Samuel/.gemini/antigravity/brain/8cc9866e-5988-4e4f-978e-8c1ebb8dcbca/visual_qa_vortex';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function audit() {
  console.log('Connecting to Chrome CDP on port', CDP_PORT, '...');
  const listRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
  const tabs = await listRes.json();
  let targetTab = tabs.find(t => t.url && t.url.includes('vortex_mixer_twin'));
  if (!targetTab) {
    console.log('Opening new tab with URL:', TARGET_URL);
    const newRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(TARGET_URL)}`, { method: 'PUT' });
    targetTab = await newRes.json();
  }

  console.log('Target tab found:', targetTab.title, targetTab.url);
  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  const exceptions = [];
  const consoleMessages = [];

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      pending.set(curId, { resolve, reject });
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      console.error('🔴 Browser Exception:', msg.params.exceptionDetails);
      exceptions.push(msg.params.exceptionDetails);
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('💬 Browser Console:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
      consoleMessages.push(msg.params);
    }
  };

  await new Promise(r => ws.onopen = r);
  console.log('Connected to WebSocket!');
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.reload', { ignoreCache: true });
  console.log('Page reloaded, waiting 3.5s for WebGL initialization...');
  await new Promise(r => setTimeout(r, 3500));

  async function snap(name) {
    console.log(`Capturing screenshot: ${name}...`);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(ARTIFACT_DIR, `${name}.png`);
    fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved: ${filePath}`);
  }

  // 1. CAM_ISO
  await send('Runtime.evaluate', { expression: `window.setCameraPreset('iso')` });
  await new Promise(r => setTimeout(r, 1200));
  await snap('CAM_ISO');

  // 2. CAM_FRONT
  await send('Runtime.evaluate', { expression: `window.setCameraPreset('front')` });
  await new Promise(r => setTimeout(r, 1200));
  await snap('CAM_FRONT');

  // 3. CAM_SIDE
  await send('Runtime.evaluate', { expression: `window.setCameraPreset('side')` });
  await new Promise(r => setTimeout(r, 1200));
  await snap('CAM_SIDE');

  // 4. CAM_TOP
  await send('Runtime.evaluate', { expression: `window.setCameraPreset('top')` });
  await new Promise(r => setTimeout(r, 1200));
  await snap('CAM_TOP');

  // 5. CAM_EXPLODED (Isometric separation of assemblies)
  await send('Runtime.evaluate', { expression: `window.setCameraPreset('iso')` });
  await new Promise(r => setTimeout(r, 800));
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.state.isExploded = true;
      document.getElementById('btn-explode')?.classList.add('active');
      window.state.explodeProgress = 1.0;
      window.mixer3d.setExploded(1.0);
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));
  await snap('CAM_EXPLODED');

  // Reset exploded view completely
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.state.isExploded = false;
      document.getElementById('btn-explode')?.classList.remove('active');
      window.state.explodeProgress = 0.0;
      window.mixer3d.setExploded(0.0);
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  // 6. STATE_ACTIVE (Vortex active at 2800 RPM in CONTINUOUS mode, tube seated in cup head)
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.setCameraPreset('iso');
      window.state.mode = 'CONTINUOUS';
      window.state.setpointRpm = 2800;
      window.state.currentRpm = 2800;
      window.mixer3d.setModeSwitchState('CONTINUOUS');
    })()`
  });
  await new Promise(r => setTimeout(r, 2500));
  await snap('STATE_ACTIVE');

  ws.close();
  console.log('\n=======================================');
  console.log(`Audit Finished. Total exceptions: ${exceptions.length}`);
  console.log('=======================================');
  if (exceptions.length > 0) {
    throw new Error(`Visual audit failed with ${exceptions.length} browser exceptions!`);
  }
}

audit().catch(e => {
  console.error('Audit script error:', e);
  process.exit(1);
});
