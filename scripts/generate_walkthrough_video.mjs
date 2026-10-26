#!/usr/bin/env node
/**
 * OGA Automated Social Media Walkthrough Video & Voiceover Generator
 *
 * Renders a 10-chapter narrated MP4 walkthrough video (Stages 1–6 Operator Workflow
 * + Stages 7A–7D Internal Power Supply, Power Routing, All Motors, Sensors/45° Mirrors,
 * and Data/SSD/Wi-Fi/BLE 5.2 Architecture) using:
 *   1. Headless Chrome CDP (3D WebGL choreography + broadcast lower-third captions)
 *   2. macOS Native Speech Synthesis (/usr/bin/say) for $0.00 local voiceover audio
 *   3. FFmpeg (/usr/local/bin/ffmpeg) for H.264/AAC MP4 mastering
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn, execFileSync } from 'child_process';

const ROOT = process.cwd();
const TWIN_DIR = process.argv[2] || 'disintegration_tester_twin';
const OUT_MP4 = path.join(ROOT, TWIN_DIR, 'docs', 'ERWEKA_ZT322_Social_Walkthrough.mp4');
const ARTIFACT_MP4 = process.argv[3] || '';
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
    '--window-size=1600,1000',
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

    // Fetch chapter metadata from the live twin application
    const chaptersRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Import chapters via window.app
          const list = [];
          for (let i = 0; i < 10; i++) {
            const ch = window.app.applyTourChapter(i);
            if (ch) list.push({ idx: i, id: ch.id, badge: ch.badge, title: ch.title, voiceover: ch.voiceover, camPos: ch.camPos });
          }
          return JSON.stringify(list);
        })()
      `,
      returnByValue: true
    });

    const chapters = JSON.parse(chaptersRes.result.value);
    const segmentFiles = [];

    for (const ch of chapters) {
      console.log(`  🎙️  Synthesizing voiceover & capturing 3D motion for [${ch.badge}]...`);
      const aiffPath = path.join(tmpDir, `vo_${ch.idx}.aiff`);
      execFileSync('/usr/bin/say', ['-r', '185', '-o', aiffPath, ch.voiceover]);
      const durSec = getAudioDurationSec(aiffPath) + 0.5;

      // Activate chapter in 3D scene
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            // Collapse side panels during internal anatomy chapters 6..9 for maximum clarity
            const hidePanels = (${ch.idx} >= 6);
            document.querySelectorAll('aside.panel-collapsible').forEach(el => {
              el.style.display = hidePanels ? 'none' : '';
            });
            window.app.applyTourChapter(${ch.idx});
          })()
        `
      });
      await sleep(300);

      // Capture 12 animated frames across the chapter (smooth camera orbit + live stroke kinematics)
      const numFrames = 12;
      const frameDir = path.join(tmpDir, `frames_${ch.idx}`);
      fs.mkdirSync(frameDir);

      for (let f = 0; f < numFrames; f++) {
        const progress = f / (numFrames - 1);
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const eng = window.app.engine;
              // Advance crank oscillation & fan blades smoothly
              eng.crankAngle = (eng.crankAngle + 0.55) % (Math.PI * 2);
              if (eng.oscillationActive) {
                eng.basketElevation = 0.275 * Math.sin(eng.crankAngle);
              }
              // Subtle cinematic camera pan around chapter base position
              const base = ${JSON.stringify(ch.camPos)};
              const sway = Math.sin(${progress} * Math.PI) * 0.45;
              eng.camera.position.set(base[0] + sway, base[1] + sway * 0.15, base[2]);
              window.app.controls.update();
            })()
          `
        });
        await sleep(90);
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        const framePath = path.join(frameDir, `f_${String(f).padStart(3, '0')}.png`);
        fs.writeFileSync(framePath, Buffer.from(shot.data, 'base64'));
      }

      // Encode chapter segment MP4 matching voiceover duration
      const fps = (numFrames / durSec).toFixed(4);
      const segPath = path.join(tmpDir, `seg_${ch.idx}.mp4`);
      execFileSync('/usr/local/bin/ffmpeg', [
        '-y',
        '-f', 'image2',
        '-framerate', String(fps),
        '-i', path.join(frameDir, 'f_%03d.png'),
        '-i', aiffPath,
        '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=30',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-shortest',
        segPath
      ], { stdio: 'ignore' });

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
