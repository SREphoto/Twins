import fs from 'fs';
import net from 'net';
import path from 'path';
import { spawn } from 'child_process';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'docs', 'media', 'walking_tool_qa');
const PORT = 8765;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function getWsUrl(cdpPort) {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
      const pages = await res.json();
      const page = pages.find((p) => p.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (e) {}
    await sleep(200);
  }
  throw new Error(`Could not connect to Chrome CDP on port ${cdpPort}`);
}

async function runWalkingToolTest() {
  const t0 = Date.now();
  const ts = () => `+${((Date.now() - t0) / 1000).toFixed(1)}s`;
  console.log('🚶 Starting Invisible Walking Tool QA Suite...');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const cdpPort = await getFreePort();
  const profileDir = `/tmp/walking_qa_profile_${process.pid}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=844,844',
    '--disable-gpu-sandbox',
    '--disable-dev-shm-usage',
    '--no-sandbox',
    'about:blank'
  ], { detached: true });

  let ws = null;
  try {
    const wsUrl = await getWsUrl(cdpPort);
    ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const pending = new Map();
    const consoleErrors = [];

    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data.result);
        pending.delete(data.id);
      }
      if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') {
        consoleErrors.push(data.params.args.map((a) => a.value || JSON.stringify(a)).join(' '));
      }
      if (data.method === 'Runtime.exceptionThrown') {
        const desc = data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text;
        consoleErrors.push(`EXCEPTION: ${desc}`);
      }
    };

    const send = (method, params = {}, timeoutMs = 60000) => new Promise((resolve, reject) => {
      const id = msgId++;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`CDP timeout (${timeoutMs}ms) on ${method}`));
      }, timeoutMs);
      pending.set(id, (res) => {
        clearTimeout(timer);
        resolve(res);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });

    const evalJS = async (expression) => {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    };

    const touch = async (type, points) => {
      await send('Input.dispatchTouchEvent', {
        type,
        touchPoints: points.map((p) => ({
          id: p.id ?? 0,
          x: Math.round(p.x),
          y: Math.round(p.y)
        }))
      });
    };

    const saveShot = async (filename) => {
      const ctxLost = await evalJS(`!!window.__labApp?.isContextLost`);
      if (ctxLost) throw new Error(`WebGL context lost before capturing ${filename}`);
      console.log(`  [${ts()}] Capturing ${filename}...`);
      const shot = await send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
      fs.writeFileSync(path.join(OUT_DIR, filename), Buffer.from(shot.data, 'base64'));
      console.log(`  [${ts()}] 📸 Saved ${filename}`);
    };

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });

    // ---------------------------------------------------------
    // 1. Portrait Mobile (390x844): Zero Overlay + Crisp Topbar
    // ---------------------------------------------------------
    console.log(`[${ts()}] Loading portrait 390x844...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390, height: 844, deviceScaleFactor: 1, mobile: true, hasTouch: true
    });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/lab_viewer/index.html?mobile=1` });

    let ready = false;
    for (let i = 0; i < 60; i++) {
      ready = await evalJS(`!!(window.__labApp && window.__labApp.player && window.__labApp.renderer)`);
      if (ready) break;
      await sleep(250);
    }
    if (!ready) throw new Error('Lab App did not initialize in time');
    await sleep(600);
    console.log(`[${ts()}] Portrait ready!`);

    const portraitCheck = await evalJS(`(() => {
      const p = window.__labApp.player;
      const topbar = document.querySelector('.topbar');
      return {
        hasWszBox: !!document.getElementById('walking-speed-zone'),
        hasTouchOverlay: !!document.getElementById('mobile-touch-controls'),
        walkToolEnabled: p.walkToolEnabled,
        mode: p.mode,
        enableZoom: p.orbitControls.enableZoom,
        enablePan: p.orbitControls.enablePan,
        topbarHeight: topbar ? Math.round(topbar.getBoundingClientRect().height) : 0,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    })()`);
    console.log('1. Portrait Mobile Check:', portraitCheck);
    if (portraitCheck.hasWszBox || portraitCheck.hasTouchOverlay) {
      throw new Error('Expected zero visible walking box/overlay on screen');
    }
    if (!portraitCheck.walkToolEnabled || portraitCheck.enableZoom || portraitCheck.enablePan) {
      throw new Error('Pinch-to-zoom/pan must be disabled when Walking Tool is active on mobile');
    }
    await saveShot('01_portrait_clean_viewport.png');

    // ---------------------------------------------------------
    // 2. Landscape Mobile (844x390): Clean Fresh Load + Viewport
    // ---------------------------------------------------------
    console.log(`[${ts()}] Loading landscape 844x390...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 844, height: 390, deviceScaleFactor: 1, mobile: true, hasTouch: true
    });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/lab_viewer/index.html?mobile=1` });

    let landReady = false;
    for (let i = 0; i < 60; i++) {
      landReady = await evalJS(`!!(window.__labApp && window.__labApp.player && window.__labApp.renderer)`);
      if (landReady) break;
      await sleep(250);
    }
    if (!landReady) throw new Error('Lab App landscape did not initialize in time');
    await sleep(600);

    const landscapeMeta = await evalJS(`(() => {
      const c = window.__labApp.renderer.domElement;
      const r = c.getBoundingClientRect();
      return {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
        rightZoneX: Math.round(r.left + r.width * 0.86),
        leftAimX: Math.round(r.left + r.width * 0.30),
        midY: Math.round(r.top + r.height * 0.56)
      };
    })()`);
    console.log('2. Landscape Geometry:', landscapeMeta);
    await saveShot('02_landscape_clean_viewport.png');

    // ---------------------------------------------------------
    // 3. Drag UP in Invisible Right-Side Zone -> Move Forward
    // ---------------------------------------------------------
    const pBeforeFwd = await evalJS(`window.__labApp.camera.position.toArray()`);
    const sx = landscapeMeta.rightZoneX;
    const sy = landscapeMeta.midY + 35;

    await touch('touchStart', [{ id: 1, x: sx, y: sy }]);
    for (let step = 1; step <= 3; step++) {
      await touch('touchMove', [{ id: 1, x: sx, y: sy - step * 32 }]);
      await sleep(120);
    }
    await sleep(500);

    const fwdThrottle = await evalJS(`window.__labApp.player.walkThrottle`);
    const pAfterFwd = await evalJS(`window.__labApp.camera.position.toArray()`);
    const fwdDist = Math.hypot(
      pAfterFwd[0] - pBeforeFwd[0],
      pAfterFwd[1] - pBeforeFwd[1],
      pAfterFwd[2] - pBeforeFwd[2]
    );
    console.log(`3. Right-Zone Drag UP Forward: throttle=${fwdThrottle.toFixed(2)}, dist=${fwdDist.toFixed(2)}m`);
    if (fwdThrottle < 0.25 || fwdDist < 0.8) {
      throw new Error(`Expected forward motion on right-zone UP drag; got throttle=${fwdThrottle}, dist=${fwdDist}`);
    }
    await saveShot('03_landscape_walk_forward.png');

    await touch('touchEnd', []);
    let stopThrottle = 1;
    for (let i = 0; i < 20; i++) {
      await sleep(150);
      stopThrottle = await evalJS(`window.__labApp.player.walkThrottle`);
      if (Math.abs(stopThrottle) <= 0.08) break;
    }
    console.log(`   After release smooth stop: throttle=${stopThrottle.toFixed(3)}`);
    if (Math.abs(stopThrottle) > 0.08) {
      throw new Error(`Expected smooth deceleration on finger release; got throttle=${stopThrottle}`);
    }

    // ---------------------------------------------------------
    // 4. Drag DOWN in Invisible Right-Side Zone -> Reverse / Back Up
    // ---------------------------------------------------------
    const pBeforeRev = await evalJS(`window.__labApp.camera.position.toArray()`);
    await touch('touchStart', [{ id: 1, x: sx, y: sy - 60 }]);
    for (let step = 1; step <= 3; step++) {
      await touch('touchMove', [{ id: 1, x: sx, y: (sy - 60) + step * 38 }]);
      await sleep(120);
    }
    await sleep(500);

    const revThrottle = await evalJS(`window.__labApp.player.walkThrottle`);
    const pAfterRev = await evalJS(`window.__labApp.camera.position.toArray()`);
    const revDeltaDot =
      (pAfterRev[0] - pBeforeRev[0]) * (pAfterFwd[0] - pBeforeFwd[0]) +
      (pAfterRev[1] - pBeforeRev[1]) * (pAfterFwd[1] - pBeforeFwd[1]) +
      (pAfterRev[2] - pBeforeRev[2]) * (pAfterFwd[2] - pBeforeFwd[2]);
    console.log(`4. Right-Zone Drag DOWN Reverse: throttle=${revThrottle.toFixed(2)}, dotVsFwd=${revDeltaDot.toFixed(2)}`);
    if (revThrottle > -0.25 || revDeltaDot >= 0) {
      throw new Error(`Expected reverse throttle and backward displacement; got throttle=${revThrottle}, dot=${revDeltaDot}`);
    }
    await saveShot('04_landscape_walk_reverse.png');

    await touch('touchEnd', []);
    await sleep(350);

    // ---------------------------------------------------------
    // 5. Remainder-of-Screen Aim + Simultaneous Multi-Touch
    // ---------------------------------------------------------
    const aimBefore = await evalJS(`({ yaw: window.__labApp.player.yaw, pitch: window.__labApp.player.pitch, pos: window.__labApp.camera.position.toArray() })`);
    const ax = landscapeMeta.leftAimX;
    const ay = landscapeMeta.midY;

    // Put both fingers down: id 0 on left aim zone, id 1 on right walking speed zone
    await touch('touchStart', [{ id: 0, x: ax, y: ay }, { id: 1, x: sx, y: sy }]);
    for (let step = 1; step <= 3; step++) {
      await touch('touchMove', [
        { id: 0, x: ax - step * 40, y: ay - step * 14 },
        { id: 1, x: sx, y: sy - step * 30 }
      ]);
      await sleep(100);
    }
    await sleep(400);

    const aimAfter = await evalJS(`({ yaw: window.__labApp.player.yaw, pitch: window.__labApp.player.pitch, throttle: window.__labApp.player.walkThrottle, pos: window.__labApp.camera.position.toArray() })`);
    const yawDelta = Math.abs(aimAfter.yaw - aimBefore.yaw);
    const pitchDelta = Math.abs(aimAfter.pitch - aimBefore.pitch);
    const comboDist = Math.hypot(
      aimAfter.pos[0] - aimBefore.pos[0],
      aimAfter.pos[1] - aimBefore.pos[1],
      aimAfter.pos[2] - aimBefore.pos[2]
    );
    console.log(`5. Multi-Touch Aim + Walk: dYaw=${yawDelta.toFixed(3)}, dPitch=${pitchDelta.toFixed(3)}, throttle=${aimAfter.throttle.toFixed(2)}, dist=${comboDist.toFixed(2)}m`);
    if (yawDelta < 0.08 || pitchDelta < 0.02 || comboDist < 0.5) {
      throw new Error(`Expected simultaneous aim + walk movement; dYaw=${yawDelta}, dPitch=${pitchDelta}, dist=${comboDist}`);
    }
    await touch('touchEnd', []);
    await sleep(320);

    // ---------------------------------------------------------
    // 6. Pinch-to-Zoom Disabled Check (Even in Orbit/Station Focus)
    // ---------------------------------------------------------
    await evalJS(`window.__labApp.player.setCameraPose({ x: 6, y: 2.2, z: -4 }, { x: 2, y: 1.4, z: -4 }, 'station_focus')`);
    await sleep(200);
    const pBeforePinch = await evalJS(`window.__labApp.camera.position.toArray()`);
    await touch('touchStart', [{ id: 0, x: ax - 30, y: ay }, { id: 1, x: ax + 90, y: ay }]);
    for (let step = 1; step <= 3; step++) {
      await touch('touchMove', [
        { id: 0, x: ax - 30 - step * 24, y: ay },
        { id: 1, x: ax + 90 + step * 24, y: ay }
      ]);
      await sleep(60);
    }
    await touch('touchEnd', []);
    await sleep(180);

    const pAfterPinch = await evalJS(`window.__labApp.camera.position.toArray()`);
    const radiusBefore = Math.hypot(pBeforePinch[0] - 2, pBeforePinch[1] - 1.4, pBeforePinch[2] + 4);
    const radiusAfter = Math.hypot(pAfterPinch[0] - 2, pAfterPinch[1] - 1.4, pAfterPinch[2] + 4);
    const pinchRadiusDelta = Math.abs(radiusAfter - radiusBefore);
    console.log(`6. Pinch-to-Zoom Disabled: orbitRadiusDelta=${pinchRadiusDelta.toFixed(4)}m`);
    if (pinchRadiusDelta > 0.05) {
      throw new Error(`Pinch zoom still moved camera radius by ${pinchRadiusDelta}m`);
    }

    // ---------------------------------------------------------
    // 7. Ground Floor Lab Walk (Analytical Hall Y = 1.65m) via Right Speed Zone
    // ---------------------------------------------------------
    await evalJS(`document.querySelector('[data-nav="analytical"]').click()`);
    for (let i = 0; i < 40; i++) {
      await sleep(200);
      const done = await evalJS(`!window.__labApp.player.isLerping && window.__labApp.player.mode === 'walk'`);
      if (done) break;
    }

    const floorBefore = await evalJS(`({ mode: window.__labApp.player.mode, pos: window.__labApp.camera.position.toArray() })`);
    await touch('touchStart', [{ id: 1, x: sx, y: sy + 20 }]);
    for (let step = 1; step <= 3; step++) {
      await touch('touchMove', [{ id: 1, x: sx, y: (sy + 20) - step * 32 }]);
      await sleep(100);
    }
    await sleep(450);
    const floorAfter = await evalJS(`({ mode: window.__labApp.player.mode, elev: window.__labApp.player.walkElevationMode, pos: window.__labApp.camera.position.toArray() })`);
    const floorDist = Math.hypot(
      floorAfter.pos[0] - floorBefore.pos[0],
      floorAfter.pos[2] - floorBefore.pos[2]
    );
    console.log(`7. Ground Floor Walk: mode=${floorAfter.mode}, Y=${floorAfter.pos[1].toFixed(2)}m, xzDist=${floorDist.toFixed(2)}m`);
    if (floorAfter.mode !== 'walk' || Math.abs(floorAfter.pos[1] - 1.65) > 0.05 || floorDist < 0.35) {
      throw new Error(`Expected Y=1.65m floor walk displacement; got ${JSON.stringify(floorAfter)}, dist=${floorDist}`);
    }
    await saveShot('05_landscape_ground_walk.png');

    await touch('touchEnd', []);
    await sleep(250);

    // ---------------------------------------------------------
    // 8. Controls Help Modal
    // ---------------------------------------------------------
    await evalJS(`document.getElementById('btn-help-controls').click()`);
    await sleep(280);
    const modalText = await evalJS(`document.getElementById('controls-help-modal')?.innerText || ''`);
    if (!modalText.includes('27%') || !modalText.includes('Zero Pinch-to-Zoom')) {
      throw new Error('Controls help modal missing updated mobile walking tool description');
    }
    await saveShot('06_controls_modal.png');
    await evalJS(`document.getElementById('btn-close-controls-modal').click()`);
    await sleep(180);

    console.log(`8. Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error(consoleErrors);
      throw new Error(`Encountered ${consoleErrors.length} browser console errors`);
    }

    console.log('✅ Invisible Mobile Walking Tool QA Passed!');
  } finally {
    if (ws) {
      try { ws.close(); } catch (e) {}
    }
    try { process.kill(-chrome.pid, 'SIGKILL'); } catch (e) {
      try { chrome.kill('SIGKILL'); } catch (_) {}
    }
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (e) {}
  }
}

runWalkingToolTest().catch((err) => {
  console.error('❌ Test Failed:', err);
  process.exit(1);
});
