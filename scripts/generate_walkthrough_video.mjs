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

// Fallback search in <TWIN_DIR>/docs/audio if not explicitly given
if (!CUSTOM_AUDIO_DIR) {
  const defaultAudioDir = path.join(ROOT, TWIN_DIR, 'docs', 'audio');
  if (fs.existsSync(defaultAudioDir)) {
    CUSTOM_AUDIO_DIR = defaultAudioDir;
  }
}

const OUT_MP4 = path.join(ROOT, TWIN_DIR, 'docs', 'ERWEKA_ZT322_Social_Walkthrough.mp4');
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

    const CHAPTERS = [
      {
        idx: 0,
        badge: 'STAGE 0 / 10 · OVERVIEW & OPERATION',
        title: 'Erweka Tablet Disintegration Tester Overview',
        voiceover: 'The Erweka Tablet Disintegration Tester is a benchtop laboratory instrument used by pharmaceutical scientists and quality control analysts to measure how long it takes for solid medicine tablets and capsules to completely break apart in liquid. When a patient swallows a pill, the pill must first soften, break down, and pass into solution before the active medicine can be absorbed by the body. This machine recreates the physical environment of the human stomach. It consists of a clear heated water bath held steadily at thirty-seven degrees Celsius, two one-liter glass beakers filled with test fluid, and two stainless steel basket assemblies. Mechanically, an internal electric motor turns a gearbox and crank arm that moves the baskets up and down thirty times every minute across a fifty-five millimeter stroke. Two independent motorized lead screws automatically lower the baskets into the fluid when a test begins and raise them out of the beakers when the timer finishes. As the tablets move through the warm fluid, the liquid softens the pill binder, and the movement washes the particles through the mesh screen. The operator then verifies that no firm core remains, and the digital controller records the exact disintegration time for compliance records.',
        camPos: [-5.4, 4.2, -7.2]
      },
      {
        idx: 1,
        badge: 'STAGE 1 / 10 · POWER & CONTINUITY',
        title: 'Powering On & Electrical Continuity',
        voiceover: 'To start, the operator plugs the power cord into the bench outlet and turns on the rear power switch. Once powered, the machine completes a self-test and enters standby mode.',
        camPos: [-5.8, 4.4, -7.8]
      },
      {
        idx: 2,
        badge: 'STAGE 2 / 10 · PRODUCT & MEDIA SETUP',
        title: 'Preparing Water Bath, Beakers, Tablets & Disks',
        voiceover: 'Next, the operator fills the water bath and places two one-liter glass beakers inside, filled with test liquid. Six tablets are placed into each of the two basket assemblies, with a plastic fluted disk set on top of each tablet to keep it submerged.',
        camPos: [-3.8, 4.8, -6.2]
      },
      {
        idx: 3,
        badge: 'STAGE 3 / 10 · INSERTION & SAFETY INTERLOCKS',
        title: 'Coupling Quick-Release Baskets & Lowering into Immersion',
        voiceover: 'The baskets snap onto the quick-release couplings on the upper arm. Motorized lead screws then lower the baskets into the beakers. A safety sensor prevents operation if the water level is too low.',
        camPos: [-2.8, 3.9, -5.6]
      },
      {
        idx: 4,
        badge: 'STAGE 4 / 10 · CONSOLE & SOFTWARE SETUP',
        title: 'Selecting Monograph & Pre-Heating Bath to 37.0 °C',
        voiceover: 'On the front control panel, the operator selects the test profile, sets the fifteen-minute timer, and turns on the heater. The circulating water warms to thirty-seven degrees Celsius, matching human body temperature.',
        camPos: [0.35, 1.65, -4.6]
      },
      {
        idx: 5,
        badge: 'STAGE 5 / 10 · ACTIVE RUN & DISINTEGRATION PHYSICS',
        title: '30 Strokes Per Minute & Hydrodynamic Shear Breakdown',
        voiceover: 'Pressing start begins the test. The drive arm moves the baskets up and down thirty times per minute through the warm liquid. As the tablets absorb the fluid, they soften and break apart, passing through the wire mesh at the bottom of each tube.',
        camPos: [-2.6, 3.6, -5.0]
      },
      {
        idx: 6,
        badge: 'STAGE 6 / 10 · END-OF-RUN INSPECTION & GLP CSV',
        title: 'Automatic Basket Lift, Screen Inspection & Report Export',
        voiceover: 'When the test finishes, the baskets lift automatically out of the beakers. The operator visually inspects the wire screens to confirm all tablets have completely broken down, and the instrument saves a test report to memory.',
        camPos: [-2.8, 4.3, -5.4]
      },
      {
        idx: 7,
        badge: 'STAGE 7A / 10 · INTERNAL POWER SUPPLY & ROUTING',
        title: 'Power Inlet, Transformer, 24V Supply & Wiring Harnesses',
        voiceover: 'Inside the lower cabinet, electricity enters through the rear power socket. It passes through an isolation transformer, a twenty-four-volt power supply, and a solid-state relay that controls the immersion heater. Bundled wiring harnesses distribute power to all internal parts.',
        camPos: [-3.2, 2.4, -2.6]
      },
      {
        idx: 8,
        badge: 'STAGE 7B / 10 · ALL 5 INTERNAL MOTORS & ACTUATORS',
        title: 'Main Stroke Motor, Lift Screws, Water Pump & Blower Fan',
        voiceover: 'Five separate electric motors drive the mechanics. The main motor turns a gearbox and crank arm to move the test baskets up and down. Two stepper motors turn vertical screw shafts to lift and lower the arm. A small water pump circulates the bath, and a fan cools the cabinet.',
        camPos: [-3.6, 4.2, -4.4]
      },
      {
        idx: 9,
        badge: 'STAGE 7C / 10 · MOTHERBOARD, eMMC SSD, WI-FI / BLE & PORTS',
        title: 'Controller Motherboard, Processor, Storage & Rear Ports',
        voiceover: 'The main computer board controls the entire instrument. It houses the central processor, system memory, solid-state storage for test records, and a battery backup for the clock. Network and serial ports on the rear panel allow data export to laboratory computers.',
        camPos: [1.85, 2.15, -2.35]
      }
    ];

    const segmentFiles = [];

    for (const ch of CHAPTERS) {
      // Check for custom audio stem (e.g. Gemini Flash 3.8 TTS voice_r6j5bn13iimw)
      let audioPath = null;
      if (CUSTOM_AUDIO_DIR && fs.existsSync(CUSTOM_AUDIO_DIR)) {
        const candidates = [
          path.join(CUSTOM_AUDIO_DIR, `vo_${ch.idx}.mp3`),
          path.join(CUSTOM_AUDIO_DIR, `vo_${ch.idx}.wav`),
          path.join(CUSTOM_AUDIO_DIR, `vo_${ch.idx}.m4a`),
          path.join(CUSTOM_AUDIO_DIR, `vo_${ch.idx}.aiff`),
          path.join(CUSTOM_AUDIO_DIR, `chapter_${ch.idx + 1}.mp3`),
          path.join(CUSTOM_AUDIO_DIR, `chapter_${ch.idx + 1}.wav`)
        ];
        for (const cand of candidates) {
          if (fs.existsSync(cand) && fs.statSync(cand).size > 0) {
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
      const durSec = getAudioDurationSec(audioPath) + 0.5;

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
        '-i', audioPath,
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
