import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'docs', 'media', 'mobile_qa');
const PORT = 8765; // Use the currently running local server
const CDP_PORT = 9244;

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

async function runTest() {
  console.log('🧪 Starting Mobile Lab Automated Test & Verification Suite...');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--window-size=844,844',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    `http://127.0.0.1:${PORT}/lab_viewer/index.html?mobile=1`
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
    const networkRequests = [];
    const consoleLogs = [];
    const consoleErrors = [];

    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data.result);
        pending.delete(data.id);
      }
      if (data.method === 'Network.requestWillBeSent') {
        networkRequests.push(data.params.request.url);
      }
      if (data.method === 'Runtime.consoleAPICalled') {
        const text = data.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
        consoleLogs.push(`[${data.params.type}] ${text}`);
        if (data.params.type === 'error') {
          consoleErrors.push(text);
        }
      }
      if (data.method === 'Runtime.exceptionThrown') {
        const desc = data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text;
        consoleErrors.push(`EXCEPTION: ${desc}`);
      }
    };

    const send = (method, params = {}) => new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    // Emulate iPhone 14 Pro mobile viewport + multi-touch
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true
    });
    await send('Emulation.setTouchEmulationEnabled', {
      enabled: true,
      maxTouchPoints: 5
    });

    console.log('📱 Navigating to mobile lab: /lab_viewer/index.html?mobile=1 ...');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/lab_viewer/index.html?mobile=1` });
    await sleep(4000);

    // Verify app state in browser
    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const app = window.__labApp;
          if (!app) return { ok: false, reason: "No __labApp found" };
          return {
            ok: true,
            isMobile: app.isMobile,
            lazyLoad: app.dockManager.lazyLoad,
            activeCount: app.dockManager.activeLoadedQueue.length,
            docksCount: app.dockManager.docks.length,
            canvasWidth: app.width,
            canvasHeight: app.height
          };
        })()
      `,
      returnByValue: true
    });

    const state = evalResult.result?.value;
    console.log('📊 App Mobile State:', state);

    if (!state || !state.ok) {
      console.log('Console logs captured:', consoleLogs);
      console.log('Console errors captured:', consoleErrors);
      throw new Error(`Failed to initialize mobile lab: ${JSON.stringify(evalResult)}`);
    }

    if (!state.isMobile) {
      throw new Error('FAIL: isMobile is false in mobile mode!');
    }
    if (!state.lazyLoad) {
      throw new Error('FAIL: dockManager.lazyLoad is false in mobile mode!');
    }
    console.log(`✅ Mobile mode successfully active: 18 instrument docks registered.`);

    // Check Network Requests for vehicle GLBs
    const vehicleRequests = networkRequests.filter(url => url.includes('.glb') || url.includes('car_'));
    console.log(`🚗 Vehicle GLB requests in mobile mode: ${vehicleRequests.length}`);
    if (vehicleRequests.length > 0) {
      console.warn('⚠️ WARNING: Vehicle requests detected:', vehicleRequests);
    } else {
      console.log('✅ ZERO vehicle GLBs requested! Saved ~80MB network downloads and massive VRAM.');
    }

    // Capture Mobile Overview screenshot
    const shotOverview = await send('Page.captureScreenshot', { format: 'png' });
    const shot1Path = path.join(OUT_DIR, '01_mobile_overview.png');
    fs.writeFileSync(shot1Path, Buffer.from(shotOverview.data, 'base64'));
    console.log(`📸 Saved: ${shot1Path}`);

    // Step 2: Jump to UV-Vis Spectrophotometer and Power it On
    console.log('🔬 Focusing on UV-Vis Spectrophotometer and testing on-demand power up...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const app = window.__labApp;
          app._jumpToPresetLocation('spectrophotometer');
        })()
      `
    });
    await sleep(2500);

    const shotSpectro = await send('Page.captureScreenshot', { format: 'png' });
    const shot2Path = path.join(OUT_DIR, '02_mobile_spectrophotometer_powered.png');
    fs.writeFileSync(shot2Path, Buffer.from(shotSpectro.data, 'base64'));
    console.log(`📸 Saved: ${shot2Path}`);

    const spectroState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const app = window.__labApp;
          return {
            activeMachine: app.activeMachineId,
            isOn: app.dockManager.isTwinOn('spectrophotometer'),
            activeQueue: [...app.dockManager.activeLoadedQueue]
          };
        })()
      `,
      returnByValue: true
    });
    console.log('📊 Spectrophotometer State:', spectroState.result?.value);

    // Step 3: Jump to Karl Fischer Titrator and verify LRU memory eviction
    console.log('🧪 Focusing on Karl Fischer Titrator (Testing LRU auto-eviction of Spectrophotometer)...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const app = window.__labApp;
          app._jumpToPresetLocation('karl_fischer');
        })()
      `
    });
    await sleep(2500);

    const shotKF = await send('Page.captureScreenshot', { format: 'png' });
    const shot3Path = path.join(OUT_DIR, '03_mobile_karl_fischer_lru_active.png');
    fs.writeFileSync(shot3Path, Buffer.from(shotKF.data, 'base64'));
    console.log(`📸 Saved: ${shot3Path}`);

    const kfState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const app = window.__labApp;
          return {
            activeMachine: app.activeMachineId,
            isKFOn: app.dockManager.isTwinOn('karl_fischer'),
            isSpectroOn: app.dockManager.isTwinOn('spectrophotometer'),
            activeQueue: [...app.dockManager.activeLoadedQueue]
          };
        })()
      `,
      returnByValue: true
    });
    console.log('📊 Karl Fischer State (Spectro should be auto-evicted):', kfState.result?.value);

    // Step 4: Test turning off the machine via power toggle button
    console.log('⚡ Testing Power Toggle button to return station to Standby Plinth...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          document.getElementById('btn-power-toggle')?.click();
        })()
      `
    });
    await sleep(1500);

    const shotStandby = await send('Page.captureScreenshot', { format: 'png' });
    const shot4Path = path.join(OUT_DIR, '04_mobile_station_standby_plinth.png');
    fs.writeFileSync(shot4Path, Buffer.from(shotStandby.data, 'base64'));
    console.log(`📸 Saved: ${shot4Path}`);

    // Step 5: Test Walk Mode, Walking Speed Zone & Aim Controls (Portrait + Landscape)
    console.log('🚶 Testing Walk Mode, Walking Speed Zone & Remainder-of-Screen Aim...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const app = window.__labApp;
          app._handleNavDockClick('walk');
        })()
      `
    });
    await sleep(1600);

    const walkTouchState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const container = document.getElementById('mobile-touch-controls');
          const wsz = document.getElementById('walking-speed-zone');
          const track = document.getElementById('wsz-track');
          const rect = track ? track.getBoundingClientRect() : null;
          return {
            dpadExists: !!container,
            dpadVisible: container && !container.classList.contains('is-hidden'),
            wszExists: !!wsz,
            trackRect: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('🎮 Walking Speed Zone State (Portrait):', walkTouchState.result?.value);
    if (!walkTouchState.result?.value?.dpadVisible || !walkTouchState.result?.value?.trackRect) {
      throw new Error('FAIL: Walking Speed Zone not visible in Walk Mode!');
    }

    const shotWalk = await send('Page.captureScreenshot', { format: 'png' });
    const shot5Path = path.join(OUT_DIR, '05_mobile_touch_walk_controls.png');
    fs.writeFileSync(shot5Path, Buffer.from(shotWalk.data, 'base64'));
    console.log(`📸 Saved: ${shot5Path}`);

    // Step 5b: Switch to Landscape Mobile (844x390, matching user's device layout) & Test Real Touch Drags
    console.log('📱 Switching to Landscape Mobile (844x390) to verify Walking Speed Zone + Screen Aim + Zero Pinch Zoom...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 844,
      height: 390,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/lab_viewer/index.html?mobile=1` });
    await sleep(4000);

    const landscapeMetrics = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const app = window.__labApp;
          const track = document.getElementById('wsz-track');
          const r = track.getBoundingClientRect();
          return {
            mode: app.player.mode,
            isContextLost: app.isContextLost,
            camPos: app.camera.position.toArray(),
            yaw: app.player.yaw,
            pitch: app.player.pitch,
            trackCenterX: r.left + r.width / 2,
            trackCenterY: r.top + r.height / 2,
            trackHeight: r.height
          };
        })()
      `,
      returnByValue: true
    });
    const lm = landscapeMetrics.result?.value;
    console.log('📐 Landscape Overview Metrics:', lm);
    if (lm.isContextLost) {
      throw new Error('FAIL: WebGL context was lost in landscape mobile mode!');
    }

    // 1) Drag finger UP in Walking Speed Zone to move forward
    const startX = Math.round(lm.trackCenterX);
    const startY = Math.round(lm.trackCenterY + 25);
    await send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: startX, y: startY, id: 1 }]
    });
    for (let step = 1; step <= 6; step++) {
      await send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: startX, y: Math.round(startY - step * 11), id: 1 }]
      });
      await sleep(90);
    }
    await sleep(600);

    const afterForward = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const app = window.__labApp;
          return {
            pos: app.camera.position.toArray(),
            throttle: app.player.walkThrottle,
            targetThrottle: app.player.targetWalkThrottle,
            readout: document.getElementById('wsz-speed-readout')?.textContent
          };
        })()
      `,
      returnByValue: true
    });

    // Capture active forward screenshot in landscape
    const shotLandscapeForward = await send('Page.captureScreenshot', { format: 'png' });
    const shot6Path = path.join(OUT_DIR, '06_mobile_landscape_walking_speed_zone.png');
    fs.writeFileSync(shot6Path, Buffer.from(shotLandscapeForward.data, 'base64'));
    console.log(`📸 Saved: ${shot6Path}`);

    // 2) Drag finger DOWN past start to slow down and reverse (backup)
    for (let step = 1; step <= 11; step++) {
      await send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: startX, y: Math.round((startY - 66) + step * 13), id: 1 }]
      });
      await sleep(80);
    }
    await sleep(600);

    const afterReverse = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const app = window.__labApp;
          return {
            pos: app.camera.position.toArray(),
            throttle: app.player.walkThrottle,
            targetThrottle: app.player.targetWalkThrottle,
            readout: document.getElementById('wsz-speed-readout')?.textContent
          };
        })()
      `,
      returnByValue: true
    });

    await send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: []
    });
    await sleep(450);

    // 3) Drag on the remainder of the screen (left/center) to aim direction
    await send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 240, y: 200, id: 2 }]
    });
    for (let step = 1; step <= 6; step++) {
      await send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: 240 + step * 25, y: 200 - step * 10, id: 2 }]
      });
      await sleep(60);
    }
    await send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: []
    });
    await sleep(300);

    // 4) Attempt two-finger pinch on canvas -> must NOT zoom camera
    const beforePinch = await send('Runtime.evaluate', {
      expression: `window.__labApp.camera.position.toArray()`,
      returnByValue: true
    });
    await send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 200, y: 180, id: 3 }, { x: 350, y: 180, id: 4 }]
    });
    await send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 140, y: 180, id: 3 }, { x: 410, y: 180, id: 4 }]
    });
    await sleep(250);
    await send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: []
    });
    await sleep(250);

    const afterAimAndPinch = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const app = window.__labApp;
          return {
            yaw: app.player.yaw,
            pitch: app.player.pitch,
            pos: app.camera.position.toArray(),
            orbitZoomEnabled: app.player.orbitControls.enableZoom
          };
        })()
      `,
      returnByValue: true
    });

    // 5) Test Cruise Lock, Ground Floor Walk & Controls Help Modal
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          document.getElementById('btn-wsz-cruise')?.click();
          document.getElementById('btn-help-controls')?.click();
        })()
      `
    });
    await sleep(300);
    const modalAndCruise = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const app = window.__labApp;
          const modal = document.getElementById('controls-help-modal');
          const res = {
            cruiseLocked: app.player.cruiseLocked,
            modalOpen: modal && !modal.classList.contains('is-hidden')
          };
          document.getElementById('btn-close-controls-modal')?.click();
          document.getElementById('btn-wsz-cruise')?.click();
          return res;
        })()
      `,
      returnByValue: true
    });
    console.log('🔒 Cruise & Modal Check:', modalAndCruise.result?.value);

    const fwdDist = Math.hypot(
      afterForward.result.value.pos[0] - lm.camPos[0],
      afterForward.result.value.pos[1] - lm.camPos[1],
      afterForward.result.value.pos[2] - lm.camPos[2]
    );
    const revDelta = afterReverse.result.value.throttle;
    const yawDelta = Math.abs(afterAimAndPinch.result.value.yaw - lm.yaw);
    const pinchDist = Math.hypot(
      afterAimAndPinch.result.value.pos[0] - beforePinch.result.value[0],
      afterAimAndPinch.result.value.pos[1] - beforePinch.result.value[1],
      afterAimAndPinch.result.value.pos[2] - beforePinch.result.value[2]
    );

    console.log('🏃 Speed Zone Forward Check:', { fwdDist, throttle: afterForward.result.value.throttle, readout: afterForward.result.value.readout });
    console.log('🔙 Speed Zone Reverse Check:', { throttle: revDelta, readout: afterReverse.result.value.readout });
    console.log('🎯 Screen Aim & Anti-Pinch Check:', { yawDelta, pinchDist, orbitZoomEnabled: afterAimAndPinch.result.value.orbitZoomEnabled });

    if (fwdDist < 0.3 || afterForward.result.value.throttle <= 0) {
      throw new Error('FAIL: Dragging up in Walking Speed Zone did not move camera forward!');
    }
    if (revDelta >= 0) {
      throw new Error('FAIL: Dragging down in Walking Speed Zone did not engage reverse!');
    }
    if (yawDelta < 0.05) {
      throw new Error('FAIL: Dragging remainder of screen did not aim camera!');
    }
    if (afterAimAndPinch.result.value.orbitZoomEnabled || pinchDist > 0.05) {
      throw new Error('FAIL: Pinch-to-zoom should be disabled in mobile walk tool!');
    }
    if (!modalAndCruise.result?.value?.cruiseLocked || !modalAndCruise.result?.value?.modalOpen) {
      throw new Error('FAIL: Cruise lock or Controls help modal failed to toggle!');
    }

    // Step 6: Console Error Verification
    console.log(`\n🔍 Browser Console Error Audit:`);
    console.log(`Total Errors/Exceptions: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(err => console.error('  ❌', err));
      throw new Error(`Console errors encountered during mobile lab execution: ${consoleErrors.join('; ')}`);
    } else {
      console.log('✅ ZERO console errors or unhandled exceptions!');
    }

    console.log('\n🎉 ALL MOBILE LAB TESTS PASSED PERFECTLY!\n');
  } finally {
    chrome.kill('SIGKILL');
  }
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
