#!/usr/bin/env node
/**
 * Gemini Flash 3.8 TTS Audio Stem Synthesizer
 *
 * Generates spoken audio stems for all 10 walkthrough chapters using Google Gemini Flash TTS
 * or Google Cloud Text-to-Speech API.
 *
 * Voice ID: voice_r6j5bn13iimw (or GEMINI_TTS_VOICE)
 * Output: disintegration_tester_twin/docs/audio/vo_{0..9}.mp3
 *
 * Usage:
 *   node scripts/synthesize_gemini_tts.mjs [--api-key <KEY>] [--voice <VOICE_ID>] [--out-dir <PATH>]
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const args = process.argv.slice(2);

let API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
let VOICE_ID = process.env.GEMINI_TTS_VOICE || 'voice_r6j5bn13iimw';
let OUT_DIR = path.join(ROOT, 'disintegration_tester_twin', 'docs', 'audio');

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--api-key' && args[i + 1]) {
    API_KEY = args[i + 1];
    i++;
  } else if (args[i] === '--voice' && args[i + 1]) {
    VOICE_ID = args[i + 1];
    i++;
  } else if (args[i] === '--out-dir' && args[i + 1]) {
    OUT_DIR = path.resolve(args[i + 1]);
    i++;
  }
}

// 10 Standard Chapter Spoken Texts
const CHAPTERS = [
  {
    idx: 0,
    badge: 'STAGE 0 / 10 · OVERVIEW & OPERATION',
    text: 'The Erweka Tablet Disintegration Tester is a benchtop laboratory instrument used by pharmaceutical scientists and quality control analysts to measure how long it takes for solid medicine tablets and capsules to completely break apart in liquid. When a patient swallows a pill, the pill must first soften, break down, and pass into solution before the active medicine can be absorbed by the body. This machine recreates the physical environment of the human stomach. It consists of a clear heated water bath held steadily at thirty-seven degrees Celsius, two one-liter glass beakers filled with test fluid, and two stainless steel basket assemblies. Mechanically, an internal electric motor turns a gearbox and crank arm that moves the baskets up and down thirty times every minute across a fifty-five millimeter stroke. Two independent motorized lead screws automatically lower the baskets into the fluid when a test begins and raise them out of the beakers when the timer finishes. As the tablets move through the warm fluid, the liquid softens the pill binder, and the movement washes the particles through the mesh screen. The operator then verifies that no firm core remains, and the digital controller records the exact disintegration time for compliance records.'
  },
  {
    idx: 1,
    badge: 'STAGE 1 / 10 · POWER & CONTINUITY',
    text: 'To start, the operator plugs the power cord into the bench outlet and turns on the rear power switch. Once powered, the machine completes a self-test and enters standby mode.'
  },
  {
    idx: 2,
    badge: 'STAGE 2 / 10 · PRODUCT & MEDIA SETUP',
    text: 'Next, the operator fills the water bath and places two one-liter glass beakers inside, filled with test liquid. Six tablets are placed into each of the two basket assemblies, with a plastic fluted disk set on top of each tablet to keep it submerged.'
  },
  {
    idx: 3,
    badge: 'STAGE 3 / 10 · INSERTION & SAFETY INTERLOCKS',
    text: 'The baskets snap onto the quick-release couplings on the upper arm. Motorized lead screws then lower the baskets into the beakers. A safety sensor prevents operation if the water level is too low.'
  },
  {
    idx: 4,
    badge: 'STAGE 4 / 10 · CONSOLE & SOFTWARE SETUP',
    text: 'On the front control panel, the operator selects the test profile, sets the fifteen-minute timer, and turns on the heater. The circulating water warms to thirty-seven degrees Celsius, matching human body temperature.'
  },
  {
    idx: 5,
    badge: 'STAGE 5 / 10 · ACTIVE RUN & DISINTEGRATION PHYSICS',
    text: 'Pressing start begins the test. The drive arm moves the baskets up and down thirty times per minute through the warm liquid. As the tablets absorb the fluid, they soften and break apart, passing through the wire mesh at the bottom of each tube.'
  },
  {
    idx: 6,
    badge: 'STAGE 6 / 10 · END-OF-RUN INSPECTION & GLP CSV',
    text: 'When the test finishes, the baskets lift automatically out of the beakers. The operator visually inspects the wire screens to confirm all tablets have completely broken down, and the instrument saves a test report to memory.'
  },
  {
    idx: 7,
    badge: 'STAGE 7A / 10 · INTERNAL POWER SUPPLY & ROUTING',
    text: 'Inside the lower cabinet, electricity enters through the rear power socket. It passes through an isolation transformer, a twenty-four-volt power supply, and a solid-state relay that controls the immersion heater. Bundled wiring harnesses distribute power to all internal parts.'
  },
  {
    idx: 8,
    badge: 'STAGE 7B / 10 · ALL 5 INTERNAL MOTORS & ACTUATORS',
    text: 'Five separate electric motors drive the mechanics. The main motor turns a gearbox and crank arm to move the test baskets up and down. Two stepper motors turn vertical screw shafts to lift and lower the arm. A small water pump circulates the bath, and a fan cools the cabinet.'
  },
  {
    idx: 9,
    badge: 'STAGE 7C / 10 · MOTHERBOARD, eMMC SSD, WI-FI / BLE & PORTS',
    text: 'The main computer board controls the entire instrument. It houses the central processor, system memory, solid-state storage for test records, and a battery backup for the clock. Network and serial ports on the rear panel allow data export to laboratory computers.'
  }
];

async function synthesizeChapter(ch) {
  const outFile = path.join(OUT_DIR, `vo_${ch.idx}.mp3`);
  console.log(`🎙️  Synthesizing [${ch.badge}] with voice [${VOICE_ID}]...`);

  if (!API_KEY) {
    throw new Error('API key missing. Provide --api-key <KEY> or set GEMINI_API_KEY environment variable.');
  }

  // Attempt Google Cloud / Gemini TTS synthesis endpoint
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
  const payload = {
    input: { text: ch.text },
    voice: {
      languageCode: 'en-US',
      name: VOICE_ID
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 1.0
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`TTS synthesis failed (${res.status}): ${errText}`);
  }

  const json = await res.json();
  if (json.audioContent) {
    fs.writeFileSync(outFile, Buffer.from(json.audioContent, 'base64'));
    console.log(`   ✅ Saved: ${outFile}`);
  } else {
    throw new Error(`No audioContent in API response: ${JSON.stringify(json)}`);
  }
}

async function main() {
  console.log('================================================================');
  console.log('🎙️  Gemini Flash 3.8 TTS Audio Stem Synthesizer');
  console.log(`   Target Voice: ${VOICE_ID}`);
  console.log(`   Destination:  ${OUT_DIR}`);
  console.log('================================================================');

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  if (!API_KEY) {
    console.log('\n⚠️  No GEMINI_API_KEY or --api-key provided.');
    console.log('   You can provide the key or drop custom audio files into:');
    console.log(`   ${OUT_DIR}/vo_{0..9}.mp3 (or .wav)`);
    console.log('\n   Chapter texts to speak:');
    CHAPTERS.forEach(ch => {
      console.log(`\n--- [${ch.badge}] (save as vo_${ch.idx}.mp3) ---\n${ch.text}`);
    });
    return;
  }

  for (const ch of CHAPTERS) {
    await synthesizeChapter(ch);
  }

  console.log('\n🎉 All 10 audio stems generated successfully!');
  console.log(`Run 'node scripts/generate_walkthrough_video.mjs' to master the complete MP4 video.`);
}

main().catch(err => {
  console.error('\n❌ Synthesis error:', err.message);
  process.exit(1);
});
