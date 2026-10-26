#!/usr/bin/env node
/**
 * Master Digital Twin Voiceover & Video Pipeline Runner
 *
 * Executes the complete end-to-end voiceover processing and 1080p video mastering
 * for ANY digital twin in the repository:
 *   Step 1: Ingest single raw audio (local file or Google Drive URL) & slice chapter stems.
 *   Step 2: Launch headless Chrome CDP & render cinematic 3D motion synchronized with voice.
 *   Step 3: Master final H.264/AAC 1080p MP4 walkthrough video.
 *
 * Usage:
 *   node scripts/build_twin_video.mjs <twin_dir> [--audio <file_or_gdrive_url>] [--artifact <dest_mp4>]
 */

import fs from 'fs';
import path from 'path';
import { execFileSync, spawnSync } from 'child_process';

const ROOT = process.cwd();
const args = process.argv.slice(2);

if (args.length === 0 || args[0].startsWith('--')) {
  console.log('Usage: node scripts/build_twin_video.mjs <twin_dir> [--audio <file_or_url>] [--artifact <path>]');
  process.exit(1);
}

const TWIN_DIR = args[0];
let AUDIO_SOURCE = '';
let ARTIFACT_PATH = '';

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--audio' && args[i + 1]) {
    AUDIO_SOURCE = args[i + 1];
    i++;
  } else if (args[i] === '--artifact' && args[i + 1]) {
    ARTIFACT_PATH = path.resolve(args[i + 1]);
    i++;
  }
}

const twinPath = path.join(ROOT, TWIN_DIR);
if (!fs.existsSync(twinPath)) {
  console.error(`❌ Error: Twin directory "${TWIN_DIR}" does not exist in ${ROOT}`);
  process.exit(1);
}

console.log('👑 ========================================================');
console.log(`👑 MASTER TWIN VOICEOVER & VIDEO PIPELINE: ${TWIN_DIR}`);
console.log('👑 ========================================================\n');

// Step 1: Voiceover Processing & Slicing (if audio provided or available)
const audioDir = path.join(twinPath, 'docs', 'audio');
let shouldProcessAudio = Boolean(AUDIO_SOURCE);

if (!shouldProcessAudio) {
  // Check if raw audio exists in twin docs/audio
  const rawCandidates = ['raw_voiceover.wav', 'master_voiceover.wav', 'erweka_full_voice.wav', 'voice.wav', 'voice.mp3'];
  for (const c of rawCandidates) {
    if (fs.existsSync(path.join(audioDir, c))) {
      AUDIO_SOURCE = path.join(audioDir, c);
      shouldProcessAudio = true;
      break;
    }
  }
}

if (shouldProcessAudio) {
  console.log('🎙️  [STEP 1/2] Processing audio & slicing synchronized chapter stems...');
  const procArgs = ['run', 'scripts/process_voiceover_audio.py', TWIN_DIR, '--audio', AUDIO_SOURCE];
  const pyResult = spawnSync('/usr/local/bin/uv', procArgs, {
    stdio: 'inherit',
    encoding: 'utf8'
  });
  if (pyResult.status !== 0) {
    console.error('❌ Error processing audio stems.');
    process.exit(pyResult.status || 1);
  }
} else {
  console.log('ℹ️  [STEP 1/2] No raw audio provided; checking existing stems or falling back to local TTS...');
}

// Step 2: 3D Motion Video Rendering & Mastering
console.log('\n🎬 [STEP 2/2] Rendering 3D motion kinematics and mastering 1080p MP4...');
const videoArgs = ['scripts/generate_walkthrough_video.mjs', TWIN_DIR];
if (ARTIFACT_PATH) {
  videoArgs.push('--artifact', ARTIFACT_PATH);
}

const vidResult = spawnSync('node', videoArgs, {
  stdio: 'inherit',
  encoding: 'utf8'
});

if (vidResult.status !== 0) {
  console.error('❌ Error rendering walkthrough video.');
  process.exit(vidResult.status || 1);
}

console.log('\n🎉 ========================================================');
console.log(`🎉 Digital Twin Walkthrough Video successfully built for: ${TWIN_DIR}`);
console.log('🎉 ========================================================\n');
