#!/usr/bin/env node
/**
 * OGA Automated Social Media Walkthrough Video & Voiceover Generator
 *
 * Renders a 10-chapter narrated MP4 walkthrough video (Stage 0 Overview + Stages 1–6
 * Operator Workflow + Stages 7A–7C Internal Power, Motors, Sensors & Motherboard) using:
 *   1. Headless Chrome CDP (smooth multi-keyframe 3D WebGL camera & mechanical choreography)
 *   2. Modern, non-obstructive phrase-synchronized cinema subtitles
 *   3. Pre-sliced Gemini Flash 3.8 voice stems (or macOS /usr/bin/say fallback)
 *   4. FFmpeg (/usr/local/bin/ffmpeg) for 30 FPS H.264/AAC MP4 mastering
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn, execFileSync } from 'child_process';

const ROOT = process.cwd();

// Parse CLI flags and arguments
const args = process.argv.slice(2);
let TWIN_DIR = '';
let ARTIFACT_MP4 = '';
let CUSTOM_AUDIO_DIR = '';
let VOICE_ID = process.env.GEMINI_TTS_VOICE || 'voice_r6j5bn13iimw';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--audio-dir' && args[i + 1]) {
    CUSTOM_AUDIO_DIR = path.resolve(args[i + 1]);
    i++;
  } else if (args[i] === '--voice' && args[i + 1]) {
    VOICE_ID = args[i + 1];
    i++;
  } else if (args[i] === '--artifact' && args[i + 1]) {
    ARTIFACT_MP4 = path.resolve(args[i + 1]);
    i++;
  } else if (!args[i].startsWith('--')) {
    if (!TWIN_DIR) {
      TWIN_DIR = args[i];
    } else if (!ARTIFACT_MP4) {
      ARTIFACT_MP4 = path.resolve(args[i]);
    }
  }
}

if (!TWIN_DIR) {
  TWIN_DIR = 'disintegration_tester_twin';
}

if (!CUSTOM_AUDIO_DIR) {
  const defaultAudioDir = path.join(ROOT, TWIN_DIR, 'docs', 'audio');
  if (fs.existsSync(defaultAudioDir)) {
    CUSTOM_AUDIO_DIR = defaultAudioDir;
  }
}

const defaultOutName = TWIN_DIR === 'disintegration_tester_twin'
  ? 'ERWEKA_ZT322_Social_Walkthrough.mp4'
  : `${TWIN_DIR.toUpperCase()}_Social_Walkthrough.mp4`;
const OUT_MP4 = path.join(ROOT, TWIN_DIR, 'docs', defaultOutName);
const PORT = 8772;
const CDP_PORT = 9229;

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

function getAudioDurationSec(audioPath) {
  const out = execFileSync('/usr/local/bin/ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    audioPath
  ], { encoding: 'utf8' });
  return parseFloat(out.trim()) || 8.0;
}

async function main() {
  console.log('🎬 Starting OGA Social Media Walkthrough Video & Voiceover Generator...');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oga-video-'));
  const server = await startServer();

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--window-size=1600,900',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    `http://127.0.0.1:${PORT}/${TWIN_DIR}/software/viewer/index.html`
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
    await sleep(2500);

    // Wait for window.app to initialize
    for (let retry = 0; retry < 30; retry++) {
      const readyRes = await send('Runtime.evaluate', {
        expression: 'Boolean(window.app && window.app.engine && window.app.applyTourChapter)',
        returnByValue: true
      });
      if (readyRes && readyRes.result && readyRes.result.value) {
        break;
      }
      await sleep(300);
    }

    // Query browser for chapters from window.app
    let CHAPTERS = [];
    try {
      const chRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            if (!window.app || !window.app.applyTourChapter) return null;
            const list = [];
            for (let i = 0; i < 15; i++) {
              const ch = window.app.applyTourChapter(i);
              if (ch) list.push({ idx: i, badge: ch.badge || ('STAGE ' + i), title: ch.title || '', voiceover: ch.voiceover || '', camPos: ch.camPos || [-5.4, 4.2, -7.2], camTarget: ch.camTarget || [0, 2.8, -0.5] });
              else break;
            }
            return list.length ? JSON.stringify(list) : null;
          })()
        `,
        returnByValue: true
      });
      if (chRes && chRes.result && chRes.result.value) {
        CHAPTERS = JSON.parse(chRes.result.value);
        console.log(`  📋 Loaded ${CHAPTERS.length} chapters dynamically from live 3D viewer app`);
      }
    } catch (e) {}

    // Prepare clean full-screen stage mode for video recording
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Hide bottom clutter hints so only the sleek 3D stage and modern caption pill appear
          const hint = document.querySelector('.stage-hint');
          if (hint) hint.style.display = 'none';
          const status = document.getElementById('viewport-status');
          if (status) status.style.display = 'none';
          const toolbar = document.querySelector('.view-toolbar');
          if (toolbar) toolbar.style.display = 'none';
          if (window.app && window.app.setPanelsHidden) {
            window.app.setPanelsHidden(true);
          }
        })()
      `
    });
    // Set explicit 1080p viewport via CDP emulation
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Pre-compile the choreography step function once on window for 4x faster per-frame evaluation
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          window.__stepTourFrame = (idx, p, timeSec) => {
            const app = window.app;
            if (!app || !app.engine) return;
            const eng = app.engine;

            // Update synchronized phrase-by-phrase subtitle
            if (app.updateTourCaptionForProgress) {
              app.updateTourCaptionForProgress(idx, p);
            }

            // Hide side panels by default; only show specific panel briefly when directly referenced
            let showInstrumentPanel = false;
            let showLabPanel = false;
            if (idx === 4 && p >= 0.48 && p <= 0.88) {
              showInstrumentPanel = true;
            } else if (idx === 6 && p >= 0.62 && p <= 0.94) {
              showLabPanel = true;
            }
            document.querySelectorAll('.panel-collapsible').forEach((el) => {
              if (el.id === 'panel-instrument') {
                el.style.display = showInstrumentPanel ? '' : 'none';
                el.classList.toggle('is-collapsed', !showInstrumentPanel);
              } else if (el.id === 'panel-lab') {
                el.style.display = showLabPanel ? '' : 'none';
                el.classList.toggle('is-collapsed', !showLabPanel);
              } else {
                el.style.display = 'none';
              }
            });
            eng.onWindowResize();

            const lerp = (a, b, t) => a + (b - a) * t;
            const smooth = (t) => t * t * (3 - 2 * t);
            const setCam = (pos, tgt) => {
              eng.camera.position.set(pos[0], pos[1], pos[2]);
              eng.controls.target.set(tgt[0], tgt[1], tgt[2]);
              eng.controls.update();
            };

            // Chapter-specific live mechanical choreography & multi-shot camera movement
            if (idx === 0) {
              // 92-second Overview: 5 dynamic shots matching every spoken topic
              eng.enclosureShell.visible = true;
              eng.bathGroup.visible = true;
              eng.driveGroup.visible = true;
              eng.driveHead.visible = true;
              app.isPluggedIn = true;
              app.powerSwitchOn = true;
              app.heaterActive = true;
              app.bathTempC = 37.0;

              if (p < 0.27) {
                // Shot 0A (0..25s): Sweeping 180-degree isometric orbit around full benchtop tester
                const t = smooth(p / 0.27);
                eng.setCutaway(false);
                app.setExplodedValue(0);
                app.oscillationActive = true;
                app.state = 'RUNNING';
                eng.manualLiftProgress = 1.0;
                eng.crankPhase = timeSec * Math.PI;
                const ang = lerp(-2.35, -0.75, t);
                const rad = lerp(8.4, 6.8, Math.sin(t * Math.PI));
                setCam([Math.cos(ang) * rad, lerp(4.6, 3.8, t), Math.sin(ang) * rad], [0.0, 3.1, -0.4]);
              } else if (p < 0.54) {
                // Shot 0B (25..50s): Close-up push-in & orbit around 37C water bath, 2 beakers & 12 basket tubes
                const t = smooth((p - 0.27) / 0.27);
                eng.setCutaway(false);
                app.oscillationActive = false;
                app.state = 'STANDBY';
                eng.manualLiftProgress = lerp(0.0, 0.35, Math.sin(t * Math.PI));
                app.resetTablets();
                setCam(
                  [lerp(-3.4, 3.4, t), lerp(4.3, 3.9, Math.sin(t * Math.PI)), lerp(-4.8, -4.5, Math.sin(t * Math.PI))],
                  [0.0, 3.55, -0.85]
                );
              } else if (p < 0.70) {
                // Shot 0C (50..64s): Internal motor, planetary gearbox & crank arm reciprocating 30 CPM across 55mm stroke
                const t = smooth((p - 0.54) / 0.16);
                eng.setCutaway(true);
                eng.manualLiftProgress = 1.0;
                app.oscillationActive = true;
                app.state = 'RUNNING';
                eng.crankPhase = timeSec * Math.PI;
                setCam(
                  [lerp(-3.6, 2.8, t), lerp(4.8, 4.4, t), lerp(-4.2, -3.8, Math.sin(t * Math.PI))],
                  [0.0, 4.35, 0.15]
                );
              } else if (p < 0.84) {
                // Shot 0D (64..77s): Dual motorized lead screws automatically lowering & raising the baskets
                const t = (p - 0.70) / 0.14;
                eng.setCutaway(true);
                app.oscillationActive = false;
                // Lower from 0->1 in first half, raise 1->0 in second half
                eng.manualLiftProgress = t < 0.5 ? smooth(t * 2) : smooth((1 - t) * 2);
                for (const ls of eng.animNodes.leadScrews) ls.rotation.y = eng.manualLiftProgress * 28.0;
                setCam(
                  [lerp(-3.2, -2.2, smooth(t)), lerp(4.5, 4.1, smooth(t)), lerp(-5.2, -4.4, smooth(t))],
                  [0.0, 3.85, -0.45]
                );
              } else {
                // Shot 0E (77..92s): Tablets moving through warm fluid, softening & disintegrating through mesh screen
                const t = smooth((p - 0.84) / 0.16);
                eng.setCutaway(false);
                eng.manualLiftProgress = 1.0;
                app.oscillationActive = true;
                app.state = 'RUNNING';
                eng.crankPhase = timeSec * Math.PI;
                app.tabletFractions = app.tabletFractions.map((_, i) => Math.max(0.05, 1.0 - t * (0.85 + (i % 3) * 0.06)));
                setCam(
                  [lerp(-2.5, 2.2, t), lerp(3.5, 3.2, t), lerp(-4.3, -4.1, Math.sin(t * Math.PI))],
                  [0.0, 3.15, -0.85]
                );
              }
              app.syncToEngine();
            } else if (idx === 1) {
              // Stage 1: Powering On & Electrical Continuity (plugging in cord & self-test boot)
              const t = smooth(p);
              eng.setCutaway(false);
              eng.manualLiftProgress = 0.0;
              app.isPluggedIn = p >= 0.22;
              app.powerSwitchOn = p >= 0.35;
              app.state = app.hasPower ? 'STANDBY' : 'POWER_OFF';
              app.syncToEngine();
              setCam(
                [lerp(-6.2, -3.8, t), lerp(3.1, 4.1, t), lerp(-6.4, -7.2, t)],
                [lerp(-1.5, -0.1, t), lerp(1.6, 2.7, t), -0.3]
              );
            } else if (idx === 2) {
              // Stage 2: Product & Media Setup (water bath, 2 beakers, 12 tablets + fluted disks)
              const t = smooth(p);
              eng.setCutaway(false);
              eng.manualLiftProgress = 0.0;
              app.resetTablets();
              app.syncToEngine();
              setCam(
                [lerp(-3.6, 3.6, t), lerp(4.8, 4.5, Math.sin(t * Math.PI)), lerp(-5.2, -4.8, Math.sin(t * Math.PI))],
                [0.0, 3.75, -0.85]
              );
            } else if (idx === 3) {
              // Stage 3: Coupling Baskets & Motorized Lowering into Beakers
              const t = smooth(p);
              eng.setCutaway(false);
              eng.manualLiftProgress = smooth(Math.min(1, Math.max(0, (p - 0.12) / 0.72)));
              for (const ls of eng.animNodes.leadScrews) ls.rotation.y = eng.manualLiftProgress * 28.0;
              app.basketLowered = eng.manualLiftProgress > 0.5;
              app.syncToEngine();
              setCam(
                [lerp(-3.2, 2.4, t), lerp(4.6, 3.6, t), lerp(-5.2, -4.6, t)],
                [0.0, lerp(4.1, 3.2, t), -0.85]
              );
            } else if (idx === 4) {
              // Stage 4: Operator Console & Pre-Heating Bath to 37.0 C
              const t = smooth(p);
              eng.setCutaway(false);
              eng.manualLiftProgress = 1.0;
              app.heaterActive = true;
              app.bathTempC = lerp(24.5, 37.0, Math.min(1, p * 1.35));
              app.syncToEngine();
              setCam(
                [lerp(-1.1, 1.3, t), lerp(1.95, 1.75, t), lerp(-4.3, -4.1, Math.sin(t * Math.PI))],
                [0.35, 1.45, -2.0]
              );
            } else if (idx === 5) {
              // Stage 5: Active 30 CPM Harmonic Run & Tablet Disintegration Breakdown
              const t = smooth(p);
              eng.setCutaway(false);
              eng.manualLiftProgress = 1.0;
              app.oscillationActive = true;
              app.state = 'RUNNING';
              eng.crankPhase = timeSec * Math.PI;
              app.elapsedSeconds = Math.round(lerp(15, 195, p));
              app.strokeCount = Math.round(app.elapsedSeconds * 0.5);
              app.tabletFractions = app.tabletFractions.map((_, i) => Math.max(0.04, 1.0 - p * (0.88 + (i % 3) * 0.05)));
              app.syncToEngine();
              setCam(
                [lerp(-2.7, 2.7, t), lerp(3.5, 3.25, Math.sin(t * Math.PI)), lerp(-4.4, -4.0, Math.sin(t * Math.PI))],
                [0.0, 3.15, -0.85]
              );
            } else if (idx === 6) {
              // Stage 6: Automatic Basket Lift Out of Beakers & Screen Inspection
              const t = smooth(p);
              eng.setCutaway(false);
              app.oscillationActive = false;
              app.state = 'COMPLETE';
              eng.manualLiftProgress = 1.0 - smooth(Math.min(1, p * 1.45));
              for (const ls of eng.animNodes.leadScrews) ls.rotation.y = eng.manualLiftProgress * 28.0;
              app.basketLowered = false;
              app.tabletFractions = new Array(12).fill(0);
              app.syncToEngine();
              setCam(
                [lerp(-2.8, 2.2, t), lerp(3.6, 4.5, t), lerp(-4.8, -4.5, t)],
                [0.0, lerp(3.3, 4.1, t), -0.85]
              );
            } else if (idx === 7) {
              // Stage 7A: Internal Power Supply, Toroidal Transformer, 24V PSU, SSR & Wiring Harnesses
              const t = smooth(p);
              eng.setCutaway(true);
              eng.enclosureShell.visible = false;
              eng.bathGroup.visible = true;
              eng.manualLiftProgress = 0.0;
              app.heaterActive = true;
              app.syncToEngine();
              setCam(
                [lerp(-3.2, -2.4, t), lerp(2.1, 1.65, t), lerp(2.1, -2.7, t)],
                [lerp(-0.9, -0.75, t), 0.52, lerp(0.45, -0.1, t)]
              );
            } else if (idx === 8) {
              // Stage 7B: All 5 Electric Motors & Actuators (Main BLDC, Crank, 2 NEMA17 Steppers, Pump, Fan)
              const t = smooth(p);
              eng.setCutaway(true);
              eng.enclosureShell.visible = false;
              eng.bathGroup.visible = true;
              eng.manualLiftProgress = 0.5 + 0.35 * Math.sin(p * Math.PI * 2);
              app.oscillationActive = true;
              app.state = 'RUNNING';
              eng.crankPhase = timeSec * Math.PI;
              for (const ls of eng.animNodes.leadScrews) ls.rotation.y = eng.manualLiftProgress * 28.0;
              app.syncToEngine();
              setCam(
                [lerp(-3.6, 3.4, t), lerp(3.8, 4.5, t), lerp(-4.2, 2.8, t)],
                [0.0, lerp(2.8, 4.1, t), 0.25]
              );
            } else if (idx === 9) {
              // Stage 7C: Main Controller Motherboard, MCU, SSD, Wi-Fi/BLE & Rear I/O Ports + Final Exploded Finale
              const t = smooth(p);
              eng.setCutaway(true);
              eng.enclosureShell.visible = p > 0.72;
              eng.bathGroup.visible = true;
              if (p <= 0.72) {
                const subT = smooth(p / 0.72);
                app.setExplodedValue(0);
                setCam(
                  [lerp(2.1, 2.5, subT), lerp(1.75, 1.55, subT), lerp(-2.3, 2.1, subT)],
                  [0.35, 0.45, lerp(0.25, 0.85, subT)]
                );
              } else {
                const subT = smooth((p - 0.72) / 0.28);
                app.setExplodedValue(Math.sin(subT * Math.PI) * 0.65);
                setCam(
                  [lerp(4.5, -5.6, subT), lerp(3.6, 4.6, subT), lerp(-5.8, -7.6, subT)],
                  [0.0, 3.0, -0.3]
                );
              }
              app.syncToEngine();
            }
            eng.render();
          };
        })()
      `
    });
    await sleep(200);

    const segmentFiles = [];

    for (const ch of CHAPTERS) {
      let audioPath = null;
      if (CUSTOM_AUDIO_DIR && fs.existsSync(CUSTOM_AUDIO_DIR)) {
        const candidates = [
          path.join(CUSTOM_AUDIO_DIR, `vo_${ch.idx}.mp3`),
          path.join(CUSTOM_AUDIO_DIR, `vo_${ch.idx}.wav`),
          path.join(CUSTOM_AUDIO_DIR, `vo_${ch.idx}.m4a`),
          path.join(CUSTOM_AUDIO_DIR, `vo_${ch.idx}.aiff`)
        ];
        for (const cand of candidates) {
          if (fs.existsSync(cand) && fs.statSync(cand).size > 1000) {
            audioPath = cand;
            break;
          }
        }
      }

      if (audioPath) {
        console.log(`  🎙️  [Gemini Flash 3.8 Voice: ${VOICE_ID}] Using audio stem for [${ch.badge}]: ${path.basename(audioPath)}`);
      } else {
        console.log(`  🎙️  [Local Synthesis Fallback /usr/bin/say] Synthesizing voiceover for [${ch.badge}]...`);
        audioPath = path.join(tmpDir, `vo_${ch.idx}.aiff`);
        execFileSync('/usr/bin/say', ['-r', '185', '-o', audioPath, ch.voiceover]);
      }
      const durSec = getAudioDurationSec(audioPath) + 0.25;

      // Activate chapter baseline in 3D scene
      await send('Runtime.evaluate', {
        expression: `window.app.applyTourChapter(${ch.idx}, 0);`
      });
      await sleep(150);

      // High-density frame capture (30 FPS, fast JPEG 80) for silky-smooth 30p 3D motion
      const TARGET_FPS = 30;
      const numFrames = Math.ceil(durSec * TARGET_FPS);
      const frameDir = path.join(tmpDir, `frames_${ch.idx}`);
      fs.mkdirSync(frameDir);

      console.log(`  📸 Capturing ${numFrames} frames at 30 FPS for [${ch.badge}]...`);
      for (let f = 0; f < numFrames; f++) {
        const p = f / Math.max(1, numFrames - 1);
        const timeSec = f / TARGET_FPS;
        await send('Runtime.evaluate', {
          expression: `window.__stepTourFrame(${ch.idx}, ${p}, ${timeSec});`
        });
        const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
        const framePath = path.join(frameDir, `f_${String(f).padStart(5, '0')}.jpg`);
        fs.writeFileSync(framePath, Buffer.from(shot.data, 'base64'));
      }

      // Encode chapter segment MP4 matching voiceover duration
      const segPath = path.join(tmpDir, `seg_${ch.idx}.mp4`);
      execFileSync('/usr/local/bin/ffmpeg', [
        '-y',
        '-f', 'image2',
        '-framerate', String(TARGET_FPS),
        '-i', path.join(frameDir, 'f_%05d.jpg'),
        '-i', audioPath,
        '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '24',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-ar', '44100',
        '-ac', '2',
        '-shortest',
        segPath
      ]);

      segmentFiles.push(segPath);
    }

    // Concatenate all 10 chapters into final MP4
    const concatListPath = path.join(tmpDir, 'concat.txt');
    fs.writeFileSync(
      concatListPath,
      segmentFiles.map(f => `file '${f}'`).join('\n')
    );

    execFileSync('/usr/local/bin/ffmpeg', [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', concatListPath,
      '-c', 'copy',
      OUT_MP4
    ], { stdio: 'ignore' });

    console.log(`✅ Saved Master Walkthrough Video: ${OUT_MP4}`);
    if (ARTIFACT_MP4) {
      fs.copyFileSync(OUT_MP4, ARTIFACT_MP4);
      console.log(`✅ Copied Walkthrough Video to Artifact Directory: ${ARTIFACT_MP4}`);
    }

    ws.close();
  } finally {
    chrome.kill();
    server.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
