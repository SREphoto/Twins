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
    badge: 'STAGE 1 / 10 · POWER & CONTINUITY',
    text: 'Welcome to the S R E designs Digital Twin of the ERWEKA Z T 322 U S P 701 Tablet Disintegration Tester. Physical circuit continuity is enforced. Plugging the NEMA 5-15P cord into the bench duplex receptacle and engaging the rear breaker powers up the system into Standby.'
  },
  {
    idx: 1,
    badge: 'STAGE 2 / 10 · PRODUCT & MEDIA SETUP',
    text: 'In Stage 2, the operator fills the optical acrylic bath, seats two one-thousand milliliter borosilicate Griffin beakers with simulated gastric fluid, and loads twelve dosage units with fluted cylindrical disks into the two U S P Apparatus A baskets.'
  },
  {
    idx: 2,
    badge: 'STAGE 3 / 10 · INSERTION & SAFETY INTERLOCKS',
    text: 'In Stage 3, each basket locks into the quick-release stainless steel collets on the horizontal bridge arm and lowers smoothly into the test media via dual trapezoidal lead screws, protected by low-water float cutoffs and stroke immersion clearances.'
  },
  {
    idx: 3,
    badge: 'STAGE 4 / 10 · CONSOLE & SOFTWARE SETUP',
    text: 'In Stage 4, the analyst selects the Immediate-Release Aspirin monograph on the front console, verifies the fifteen-minute timer, and engages the one-thousand-watt P I D immersion heater to equilibrate the water bath to thirty-seven degrees Celsius.'
  },
  {
    idx: 4,
    badge: 'STAGE 5 / 10 · ACTIVE RUN & DISINTEGRATION PHYSICS',
    text: 'In Stage 5, pressing Start engages pure sinusoidal vertical oscillation at thirty strokes per minute across a fifty-five millimeter stroke. Hydrodynamic fluid shear and excipient swelling break down the tablets through the ten-mesh stainless screens while live telemetry streams to the L C D.'
  },
  {
    idx: 5,
    badge: 'STAGE 6 / 10 · END-OF-RUN INSPECTION & GLP CSV',
    text: 'In Stage 6, as soon as all twelve tablets disintegrate through the ten-mesh wire screens, the harmonic drive parks automatically, the baskets lift for visual inspection confirming zero firm cores remain, and a complete 21 C F R Part 11 C S V audit trail is exported.'
  },
  {
    idx: 6,
    badge: 'STAGE 7A / 10 · INTERNAL POWER SUPPLY & ROUTING',
    text: 'Now let us inspect the internal engineering. In Stage 7A, AC mains power enters through the rear I E C inlet into a helical copper-wound toroidal isolation transformer, a Mean Well twenty-four volt switching power supply with perforated honeycomb cage and seven-screw barrier strip, and an eleven-fin solid-state heater relay, with cable-tied harnesses routing power across the floor pan.'
  },
  {
    idx: 7,
    badge: 'STAGE 7B / 10 · ALL 5 INTERNAL MOTORS & ACTUATORS',
    text: 'In Stage 7B, we see all five internal motors: Motor 1 is the sixteen-fin brushless servo coupled to a two-stage planetary gearbox and counterbalanced crank flywheel; Motors 2 and 3 are laminated silicon-steel NEMA 17 steppers with red elastomer jaw spider couplings driving trapezoidal lead screws; Motor 4 is the magnetic-drive circulation pump with brass hose barbs; and Motor 5 is the rear cooling fan.'
  },
  {
    idx: 8,
    badge: 'STAGE 7C / 10 · INTERNAL SENSORS & 45° DIELECTRIC MIRRORS',
    text: 'In Stage 7C, internal sensors monitor every degree of freedom: a Class A P T 100 bath probe with stainless knurled union, slotted optical stroke interrupter, quadrature shaft encoder, roller-lever limit microswitches, magnetic reed float switch, and collimated laser detectors with forty-five-degree dielectric mirrors in kinematic gimbals.'
  },
  {
    idx: 9,
    badge: 'STAGE 7D / 10 · MOTHERBOARD, eMMC SSD, WI-FI / BLE & PORTS',
    text: 'Finally, in Stage 7D, the multi-layer FR-4 motherboard features gull-wing Q F P leads on the S T M 32 microcontroller, L P D D R 4 memory, a sixteen-gigabyte e M M C flash vault, twenty-four-bit A D C, C R 2032 battery socket, Phoenix Contact terminal blocks, and a shielded Wi-Fi and Bluetooth B L E module feeding the rear dipole antenna alongside R S-232, U S B, and Ethernet ports.'
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
