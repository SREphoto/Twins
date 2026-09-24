/**
 * Soft instrument SFX + generative background music.
 * Music uses Google Magenta MusicRNN when available (browser ML),
 * with a musical Web Audio fallback (chords + arpeggio + melody — not a drone).
 */

let ctx = null;
let muted = false;
let masterGain = 0.35; // SFX scale

function ensureCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function setSfxMuted(m) {
  muted = !!m;
}

export function isSfxMuted() {
  return muted;
}

export function setSfxVolume(v) {
  masterGain = Math.max(0, Math.min(1, v));
}

function tone({ type = "triangle", freq = 200, freqEnd = null, dur = 0.05, gain = 0.06, attack = 0.004 }) {
  if (muted) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t0 = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1800;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd != null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), t0 + dur);
  }

  const peak = gain * masterGain;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(filter);
  filter.connect(g);
  g.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export function playKeyClick(kind = "normal") {
  const table = {
    normal: { freq: 210, freqEnd: 95, gain: 0.055, dur: 0.045 },
    rock: { freq: 175, freqEnd: 85, gain: 0.045, dur: 0.04 },
    power: { freq: 140, freqEnd: 70, gain: 0.06, dur: 0.055 },
    go: { freq: 240, freqEnd: 110, gain: 0.065, dur: 0.05 },
    cool: { freq: 190, freqEnd: 100, gain: 0.05, dur: 0.045 },
  };
  const p = table[kind] || table.normal;
  tone({ type: "triangle", ...p, attack: 0.003 });
  if (muted) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t0 = ac.currentTime;
  const bufSize = Math.floor(ac.sampleRate * 0.02);
  const buffer = ac.createBuffer(1, bufSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.25));
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const g = ac.createGain();
  const f = ac.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 1200;
  f.Q.value = 0.8;
  g.gain.value = 0.025 * masterGain;
  src.connect(f);
  f.connect(g);
  g.connect(ac.destination);
  src.start(t0);
}

export function playLidThud() {
  tone({ type: "sine", freq: 90, freqEnd: 45, dur: 0.12, gain: 0.05, attack: 0.008 });
}

export function playPowerOn() {
  tone({ type: "sine", freq: 320, freqEnd: 480, dur: 0.1, gain: 0.04, attack: 0.01 });
}

export function playPowerOff() {
  tone({ type: "sine", freq: 280, freqEnd: 120, dur: 0.12, gain: 0.035, attack: 0.008 });
}

export function playRunStart() {
  tone({ type: "sine", freq: 440, freqEnd: 520, dur: 0.08, gain: 0.03, attack: 0.01 });
}

export function playRunEnd() {
  tone({ type: "sine", freq: 360, freqEnd: 220, dur: 0.14, gain: 0.035, attack: 0.012 });
}

export function playFault() {
  tone({ type: "square", freq: 180, freqEnd: 140, dur: 0.1, gain: 0.03, attack: 0.005 });
}

export function keyClickKind(keyId) {
  if (keyId === "power") return "power";
  if (keyId === "start") return "go";
  if (keyId === "fast-temp") return "cool";
  if (
    String(keyId).includes("up") ||
    String(keyId).includes("down") ||
    String(keyId).startsWith("speed") ||
    String(keyId).startsWith("time") ||
    String(keyId).startsWith("temp")
  )
    return "rock";
  return "normal";
}

// ===========================================================================
// Background music — styles, instruments, Magenta when available, chat API
// ===========================================================================

let musicOn = false;
let musicMuted = false;
let musicVolume = 0.16;
let musicMaster = null;
let musicDest = null; // dry bus for notes
let musicTimers = [];
let musicCleanup = [];
let magentaReady = null;
let magentaRnn = null;
let magentaMm = null;
let musicMode = "none"; // "magenta" | "procedural" | "none"
let musicRestarting = false;

/** Live performance config (mutated by music chat) */
export const musicConfig = {
  style: "lab",
  bpm: 78,
  energy: 0.55,
  preferMagenta: true,
  instruments: {
    pad: true,
    piano: true,
    bass: true,
    melody: true,
    arpeggio: true,
    drums: false,
    strings: false,
    pluck: false,
    bells: false,
  },
};

const STYLES = {
  lab: {
    label: "Lab ambient",
    bpm: 78,
    energy: 0.45,
    instruments: { pad: true, piano: true, bass: true, melody: true, arpeggio: true, drums: false, strings: false, pluck: false, bells: false },
    prog: 0,
    scale: [0, 3, 5, 7, 8, 10, 12],
  },
  jazz: {
    label: "Soft jazz",
    bpm: 92,
    energy: 0.55,
    instruments: { pad: true, piano: true, bass: true, melody: true, arpeggio: false, drums: true, strings: false, pluck: false, bells: false },
    prog: 1,
    scale: [0, 2, 3, 5, 7, 9, 10, 12],
  },
  ambient: {
    label: "Deep ambient",
    bpm: 60,
    energy: 0.3,
    instruments: { pad: true, piano: false, bass: true, melody: false, arpeggio: true, drums: false, strings: true, pluck: false, bells: true },
    prog: 2,
    scale: [0, 3, 5, 7, 10, 12],
  },
  electronic: {
    label: "Electronic",
    bpm: 110,
    energy: 0.7,
    instruments: { pad: true, piano: false, bass: true, melody: true, arpeggio: true, drums: true, strings: false, pluck: true, bells: false },
    prog: 0,
    scale: [0, 2, 3, 5, 7, 8, 10, 12],
  },
  classical: {
    label: "Classical chamber",
    bpm: 72,
    energy: 0.5,
    instruments: { pad: false, piano: true, bass: true, melody: true, arpeggio: true, drums: false, strings: true, pluck: false, bells: false },
    prog: 1,
    scale: [0, 2, 4, 5, 7, 9, 11, 12],
  },
  lofi: {
    label: "Lo-fi study",
    bpm: 84,
    energy: 0.4,
    instruments: { pad: true, piano: true, bass: true, melody: false, arpeggio: true, drums: true, strings: false, pluck: false, bells: false },
    prog: 0,
    scale: [0, 3, 5, 7, 10, 12],
  },
  cinematic: {
    label: "Cinematic",
    bpm: 70,
    energy: 0.65,
    instruments: { pad: true, piano: false, bass: true, melody: true, arpeggio: false, drums: false, strings: true, pluck: false, bells: true },
    prog: 2,
    scale: [0, 2, 3, 5, 7, 8, 10, 12],
  },
  upbeat: {
    label: "Upbeat pop",
    bpm: 118,
    energy: 0.8,
    instruments: { pad: true, piano: true, bass: true, melody: true, arpeggio: true, drums: true, strings: false, pluck: true, bells: false },
    prog: 1,
    scale: [0, 2, 4, 5, 7, 9, 11, 12],
  },
};

const INSTRUMENT_ALIASES = {
  pad: ["pad", "pads", "synth pad", "atmosphere"],
  piano: ["piano", "keys", "keyboard", "rhodes"],
  bass: ["bass", "sub", "bassline"],
  melody: ["melody", "lead", "lead synth", "solo"],
  arpeggio: ["arpeggio", "arp", "arpeggiator"],
  drums: ["drums", "drum", "percussion", "beats", "kick", "beat"],
  strings: ["strings", "string", "orchestra", "violin", "cello"],
  pluck: ["pluck", "plucked", "guitar", "harp"],
  bells: ["bells", "bell", "chimes", "glock"],
};

const NOTE_HZ = {
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
  Bb2: 116.54, Bb3: 233.08, Bb4: 466.16,
};

function midiToHz(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

export function isMusicOn() {
  return musicOn && !musicMuted;
}
export function isMusicMuted() {
  return musicMuted;
}
export function getMusicMode() {
  return musicMode;
}
export function getMusicConfig() {
  return {
    style: musicConfig.style,
    bpm: musicConfig.bpm,
    energy: musicConfig.energy,
    preferMagenta: musicConfig.preferMagenta,
    instruments: { ...musicConfig.instruments },
    styleLabel: STYLES[musicConfig.style]?.label || musicConfig.style,
    mode: musicMode,
    on: isMusicOn(),
  };
}

export function setMusicMuted(m) {
  musicMuted = !!m;
  if (musicMaster) {
    const ac = ensureCtx();
    const t = ac ? ac.currentTime : 0;
    musicMaster.gain.cancelScheduledValues(t);
    musicMaster.gain.setTargetAtTime(musicMuted || !musicOn ? 0.0001 : musicVolume, t, 0.05);
  }
}

export function setMusicVolume(v) {
  musicVolume = Math.max(0, Math.min(0.45, v));
  if (musicMaster && musicOn && !musicMuted) {
    const ac = ensureCtx();
    musicMaster.gain.setTargetAtTime(musicVolume, ac?.currentTime || 0, 0.05);
  }
}

function clearMusicTimers() {
  for (const id of musicTimers) clearTimeout(id);
  musicTimers = [];
}
function scheduleTimeout(fn, ms) {
  const id = setTimeout(fn, ms);
  musicTimers.push(id);
  return id;
}

function playSoftNote(ac, dest, freq, when, dur, gain = 0.04, type = "sine") {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  const f = ac.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = type === "square" ? 1200 : 2400;
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(30, freq), when);
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), when + 0.02);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain * 0.5), when + dur * 0.5);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(f);
  f.connect(g);
  g.connect(dest);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

function playNoiseHit(ac, dest, when, dur, gain, freq = 180) {
  const bufSize = Math.floor(ac.sampleRate * Math.min(0.2, dur));
  const buffer = ac.createBuffer(1, bufSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.2));
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const g = ac.createGain();
  const f = ac.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(gain, when + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  src.connect(f);
  f.connect(g);
  g.connect(dest);
  src.start(when);
}

// --- Magenta ---
async function loadMagenta() {
  if (magentaReady) return magentaReady;
  magentaReady = (async () => {
    if (!window.mm) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@magenta/music@1.23.1";
        s.async = true;
        s.onload = resolve;
        s.onerror = () => reject(new Error("Magenta script failed"));
        document.head.appendChild(s);
      });
    }
    const mm = window.mm;
    if (!mm?.MusicRNN) throw new Error("MusicRNN missing");
    const rnn = new mm.MusicRNN(
      "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn"
    );
    await rnn.initialize();
    magentaMm = mm;
    magentaRnn = rnn;
    return { mm, rnn };
  })().catch((err) => {
    console.warn("[music] Magenta unavailable:", err?.message || err);
    magentaReady = null;
    return null;
  });
  return magentaReady;
}

function seedNoteSequence(mm) {
  const style = musicConfig.style;
  const seeds = {
    jazz: [60, 62, 63, 65, 67, 70, 67],
    classical: [60, 64, 67, 72, 71, 67, 64],
    electronic: [60, 60, 63, 67, 70, 67, 63],
    upbeat: [60, 64, 67, 64, 69, 67, 64, 60],
    ambient: [48, 55, 60, 63, 67],
    lofi: [60, 63, 65, 67, 65, 63],
    cinematic: [48, 55, 60, 58, 55, 51],
    lab: [60, 63, 67, 70, 67],
  };
  const pitches = seeds[style] || seeds.lab;
  const notes = pitches.map((pitch, i) => ({
    pitch,
    startTime: i * 0.35,
    endTime: i * 0.35 + 0.32,
  }));
  return mm.sequences.quantizeNoteSequence(
    {
      ticksPerQuarter: 220,
      totalTime: pitches.length * 0.35 + 0.2,
      timeSignatures: [{ time: 0, numerator: 4, denominator: 4 }],
      tempos: [{ time: 0, qpm: musicConfig.bpm }],
      notes,
    },
    4
  );
}

function playMagentaSequence(seq, ac, dest) {
  if (!seq?.notes?.length) return 2;
  let maxT = 0;
  const e = musicConfig.energy;
  const types = {
    piano: "triangle",
    melody: "triangle",
    pluck: "sine",
    bells: "sine",
  };
  const leadType = musicConfig.instruments.pluck
    ? "sine"
    : musicConfig.instruments.piano
      ? "triangle"
      : "sine";
  for (const n of seq.notes) {
    const start = n.startTime != null ? n.startTime : (n.quantizedStartStep || 0) * 0.25 * (60 / musicConfig.bpm);
    const end =
      n.endTime != null
        ? n.endTime
        : ((n.quantizedEndStep || (n.quantizedStartStep || 0) + 1) * 0.25 * (60 / musicConfig.bpm));
    const dur = Math.max(0.1, end - start);
    const when = ac.currentTime + start + 0.05;
    const freq = midiToHz(n.pitch);
    if (musicConfig.instruments.melody || musicConfig.instruments.piano) {
      playSoftNote(ac, dest, freq, when, dur * 0.95, 0.04 * e + 0.015, leadType);
    }
    if (musicConfig.instruments.strings) {
      playSoftNote(ac, dest, freq * 0.5, when, dur * 1.1, 0.02 * e, "sine");
    }
    if (musicConfig.instruments.bells) {
      playSoftNote(ac, dest, freq * 2, when + 0.01, dur * 0.35, 0.012 * e, "sine");
    }
    maxT = Math.max(maxT, end);
  }
  return Math.max(2, maxT + 0.4);
}

async function magentaLoop(ac, dest) {
  if (!musicConfig.preferMagenta || !musicConfig.instruments.melody && !musicConfig.instruments.piano) {
    return false;
  }
  const loaded = await loadMagenta();
  if (!loaded || !musicOn) return false;
  const { mm, rnn } = loaded;
  musicMode = "magenta";
  let seed = seedNoteSequence(mm);
  const temp = 0.9 + musicConfig.energy * 0.4;

  const step = async () => {
    if (!musicOn) return;
    try {
      const cont = await rnn.continueSequence(seed, 28 + Math.floor(musicConfig.energy * 12), temp);
      if (!musicOn) return;
      const secs = playMagentaSequence(cont, ac, dest);
      seed = cont;
      scheduleTimeout(() => {
        if (musicOn) step();
      }, secs * 1000 * 0.9);
    } catch (e) {
      console.warn("[music] Magenta continue failed", e);
      musicMode = "procedural";
      startProceduralMusic(ac, dest);
    }
  };
  if (musicConfig.instruments.pad || musicConfig.instruments.strings) startPadBed(ac, dest);
  await step();
  return true;
}

const PROGRESSIONS = [
  [
    ["A2", "E3", "A3", "C4"],
    ["F2", "C3", "F3", "A3"],
    ["C3", "G3", "C4", "E4"],
    ["G2", "D3", "G3", "B3"],
  ],
  [
    ["D2", "A2", "D3", "F3"],
    ["Bb2", "F3", "Bb3", "D4"],
    ["F2", "C3", "F3", "A3"],
    ["C3", "G3", "C4", "E4"],
  ],
  [
    ["E2", "B2", "E3", "G3"],
    ["C3", "G3", "C4", "E4"],
    ["A2", "E3", "A3", "C4"],
    ["B2", "F3", "B3", "D4"],
  ],
];

function startPadBed(ac, dest) {
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 500 + musicConfig.energy * 400;
  filter.connect(dest);
  musicCleanup.push(filter);
  const lfo = ac.createOscillator();
  const lfoG = ac.createGain();
  lfo.frequency.value = 0.04 + musicConfig.energy * 0.04;
  lfoG.gain.value = 180;
  lfo.connect(lfoG);
  lfoG.connect(filter.frequency);
  lfo.start();
  musicCleanup.push(lfo, lfoG);
  const freqs = musicConfig.instruments.strings ? [98, 146.83, 196, 246.94] : [110, 164.81, 220];
  const gain = musicConfig.instruments.pad ? 0.014 : 0.008;
  for (const f of freqs) {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.value = f;
    o.detune.value = (Math.random() - 0.5) * 8;
    g.gain.value = gain * musicConfig.energy;
    o.connect(g);
    g.connect(filter);
    o.start();
    musicCleanup.push(o, g);
  }
}

function startProceduralMusic(ac, dest) {
  musicMode = "procedural";
  const styleDef = STYLES[musicConfig.style] || STYLES.lab;
  if (musicConfig.instruments.pad || musicConfig.instruments.strings) startPadBed(ac, dest);

  const bpm = musicConfig.bpm || styleDef.bpm;
  const beat = 60 / bpm;
  const e = musicConfig.energy;
  let bar = 0;
  const progIdx = styleDef.prog || 0;
  const scale = styleDef.scale || STYLES.lab.scale;

  const tickBar = () => {
    if (!musicOn) return;
    const prog = PROGRESSIONS[progIdx % PROGRESSIONS.length];
    const chord = prog[bar % prog.length];
    const t0 = ac.currentTime + 0.05;
    const root = NOTE_HZ[chord[0]] || 110;

    if (musicConfig.instruments.piano || musicConfig.instruments.pad) {
      chord.forEach((n, i) => {
        const hz = NOTE_HZ[n] || 220;
        const type = musicConfig.instruments.piano ? "triangle" : "sine";
        playSoftNote(ac, dest, hz, t0 + i * 0.015, beat * 3.4, (0.03 - i * 0.004) * e, type);
      });
    }

    if (musicConfig.instruments.bass) {
      playSoftNote(ac, dest, root, t0, beat * 1.5, 0.05 * e, "triangle");
      playSoftNote(ac, dest, root, t0 + beat * 2, beat * 1.2, 0.04 * e, "triangle");
    }

    if (musicConfig.instruments.arpeggio) {
      const arp = [...chord, chord[1], chord[2], chord[0]];
      arp.forEach((n, i) => {
        const hz = (NOTE_HZ[n] || 220) * 2;
        playSoftNote(ac, dest, hz, t0 + beat * 0.25 + i * (beat * 0.4), beat * 0.35, 0.028 * e, "sine");
      });
    }

    if (musicConfig.instruments.melody) {
      const motif = [0, 2, 4, 2, 5, 4, 3, 0];
      motif.forEach((idx, i) => {
        if (i % 2 === 1 && bar % 2 === 0 && e < 0.6) return;
        const hz = root * Math.pow(2, scale[idx % scale.length] / 12) * 2;
        const type = musicConfig.instruments.pluck ? "sine" : "triangle";
        playSoftNote(ac, dest, hz, t0 + i * (beat * 0.5), beat * 0.4, 0.036 * e, type);
      });
    }

    if (musicConfig.instruments.pluck && !musicConfig.instruments.melody) {
      [0, 4, 7, 12].forEach((semi, i) => {
        playSoftNote(ac, dest, root * Math.pow(2, semi / 12) * 2, t0 + i * beat * 0.5, beat * 0.25, 0.03 * e, "sine");
      });
    }

    if (musicConfig.instruments.bells) {
      playSoftNote(ac, dest, root * 4, t0 + beat * 1.5, beat * 0.8, 0.02 * e, "sine");
      playSoftNote(ac, dest, root * 5, t0 + beat * 3, beat * 0.6, 0.015 * e, "sine");
    }

    if (musicConfig.instruments.strings && !musicConfig.instruments.pad) {
      chord.forEach((n, i) => {
        playSoftNote(ac, dest, (NOTE_HZ[n] || 220) * 0.5, t0, beat * 3.8, 0.02 * e, "sine");
      });
    }

    if (musicConfig.instruments.drums) {
      // soft kick + hat
      playSoftNote(ac, dest, 50, t0, beat * 0.25, 0.06 * e, "sine");
      playSoftNote(ac, dest, 50, t0 + beat * 2, beat * 0.2, 0.05 * e, "sine");
      playNoiseHit(ac, dest, t0 + beat, 0.05, 0.025 * e, 6000);
      playNoiseHit(ac, dest, t0 + beat * 3, 0.05, 0.02 * e, 7000);
      if (e > 0.6) playNoiseHit(ac, dest, t0 + beat * 1.5, 0.04, 0.018 * e, 4000);
    }

    bar += 1;
    scheduleTimeout(tickBar, beat * 4 * 1000);
  };

  tickBar();
}

async function bootMusicEngine() {
  const ac = ensureCtx();
  if (!ac) return;
  clearMusicTimers();
  for (const n of musicCleanup) {
    try {
      if (n.stop) n.stop();
      if (n.disconnect) n.disconnect();
    } catch { /* ignore */ }
  }
  musicCleanup = [];

  if (musicMaster) {
    try { musicMaster.disconnect(); } catch { /* ignore */ }
  }

  const master = ac.createGain();
  master.gain.value = musicMuted ? 0.0001 : musicVolume;
  master.connect(ac.destination);
  musicMaster = master;

  const delay = ac.createDelay(1.0);
  delay.delayTime.value = musicConfig.style === "ambient" ? 0.4 : 0.26;
  const fb = ac.createGain();
  fb.gain.value = musicConfig.style === "ambient" ? 0.32 : 0.2;
  const delayMix = ac.createGain();
  delayMix.gain.value = 0.18 + musicConfig.energy * 0.08;
  delay.connect(fb);
  fb.connect(delay);
  delay.connect(delayMix);
  delayMix.connect(master);

  const dry = ac.createGain();
  dry.gain.value = 0.85;
  dry.connect(master);
  dry.connect(delay);
  musicDest = dry;

  musicOn = true;
  if (musicConfig.preferMagenta) {
    try {
      const ok = await magentaLoop(ac, dry);
      if (ok) return;
    } catch (e) {
      console.warn("[music] Magenta error", e);
    }
  }
  startProceduralMusic(ac, dry);
}

export async function startMusic() {
  const ac = ensureCtx();
  if (!ac) return;
  if (musicOn && !musicRestarting) {
    setMusicMuted(false);
    return;
  }
  musicMuted = false;
  await bootMusicEngine();
}

export function stopMusic() {
  if (!musicOn && !musicMaster) return;
  musicOn = false;
  clearMusicTimers();
  const ac = ensureCtx();
  if (musicMaster && ac) {
    musicMaster.gain.setTargetAtTime(0.0001, ac.currentTime, 0.08);
  }
  for (const n of musicCleanup) {
    try {
      if (n.stop) n.stop();
      if (n.disconnect) n.disconnect();
    } catch { /* ignore */ }
  }
  musicCleanup = [];
  scheduleTimeout(() => {
    try { musicMaster?.disconnect(); } catch { /* ignore */ }
    musicMaster = null;
    musicDest = null;
    musicMode = "none";
  }, 200);
}

export async function restartMusic() {
  musicRestarting = true;
  stopMusic();
  await new Promise((r) => setTimeout(r, 250));
  musicRestarting = false;
  await startMusic();
}

export async function toggleMusic() {
  if (musicOn && !musicMuted) {
    setMusicMuted(true);
    return false;
  }
  if (musicOn && musicMuted) {
    setMusicMuted(false);
    return true;
  }
  await startMusic();
  return true;
}

// --- Chat / natural language control ---

function listActiveInstruments() {
  return Object.entries(musicConfig.instruments)
    .filter(([, on]) => on)
    .map(([k]) => k);
}

function matchInstrument(text) {
  const t = text.toLowerCase();
  for (const [id, aliases] of Object.entries(INSTRUMENT_ALIASES)) {
    for (const a of aliases) {
      if (t.includes(a)) return id;
    }
  }
  return null;
}

function matchStyle(text) {
  const t = text.toLowerCase().replace(/lo-fi|lo fi/, "lofi");
  for (const key of Object.keys(STYLES)) {
    if (t.includes(key)) return key;
    if (t.includes(STYLES[key].label.toLowerCase())) return key;
  }
  if (t.includes("synth") || t.includes("edm") || t.includes("techno")) return "electronic";
  if (t.includes("chill") || t.includes("study")) return "lofi";
  if (t.includes("film") || t.includes("epic") || t.includes("orchestra")) return "cinematic";
  if (t.includes("happy") || t.includes("pop") || t.includes("fun")) return "upbeat";
  if (t.includes("calm") || t.includes("space") || t.includes("drone")) return "ambient";
  if (t.includes("science") || t.includes("lab") || t.includes("sci-fi") || t.includes("scifi")) return "lab";
  return null;
}

/**
 * Parse a music-chat line and apply config.
 * Returns { reply: string, restarted: boolean }
 */
export async function applyMusicChat(userText) {
  const raw = String(userText || "").trim();
  if (!raw) return { reply: "Say something like “make it jazz” or “add drums”.", restarted: false };

  const t = raw.toLowerCase();
  let changed = false;
  const notes = [];

  // Help
  if (/^(help|\?|commands)$/i.test(raw.trim())) {
    return {
      reply:
        "Try:\n• make it jazz / ambient / electronic / classical / lo-fi / cinematic / upbeat / lab\n• add drums · add strings · add piano · remove bass\n• only pad and bells\n• faster / slower · more energy / calmer\n• quieter / louder\n• use magenta / no magenta\n• status · stop / play",
      restarted: false,
    };
  }

  // Status
  if (/\bstatus\b|\bwhat('s| is) playing\b|\bcurrent\b/.test(t)) {
    const cfg = getMusicConfig();
    return {
      reply: `Style: ${cfg.styleLabel} · ${cfg.bpm} BPM · energy ${Math.round(cfg.energy * 100)}%\nInstruments: ${listActiveInstruments().join(", ") || "none"}\nEngine: ${cfg.mode || "off"} · ${cfg.on ? "playing" : "stopped/muted"}`,
      restarted: false,
    };
  }

  // Play / stop
  if (/\b(stop|mute|silence|quiet music|turn off)\b/.test(t) && !/\bunmute\b/.test(t)) {
    if (/\bmute\b/.test(t) && musicOn) {
      setMusicMuted(true);
      return { reply: "Muted. Say “play” or “unmute” to hear it again.", restarted: false };
    }
    stopMusic();
    return { reply: "Music stopped.", restarted: false };
  }
  if (/\b(play|start|unmute|resume)\b/.test(t)) {
    await startMusic();
    setMusicMuted(false);
    return { reply: `Playing · ${STYLES[musicConfig.style]?.label || musicConfig.style}.`, restarted: true };
  }

  // Volume
  if (/\b(quieter|softer|lower volume|turn down)\b/.test(t)) {
    setMusicVolume(musicVolume * 0.7);
    notes.push(`Volume → ${Math.round(musicVolume * 100)}%`);
  }
  if (/\b(louder|turn up|raise volume)\b/.test(t)) {
    setMusicVolume(Math.min(0.4, musicVolume * 1.35));
    notes.push(`Volume → ${Math.round(musicVolume * 100)}%`);
  }

  // Tempo / energy
  if (/\b(faster|speed up|quicker|uptempo)\b/.test(t)) {
    musicConfig.bpm = Math.min(140, Math.round(musicConfig.bpm * 1.12));
    musicConfig.energy = Math.min(1, musicConfig.energy + 0.1);
    changed = true;
    notes.push(`BPM ${musicConfig.bpm}, energy up`);
  }
  if (/\b(slower|slow down|downtempo)\b/.test(t)) {
    musicConfig.bpm = Math.max(50, Math.round(musicConfig.bpm * 0.9));
    musicConfig.energy = Math.max(0.15, musicConfig.energy - 0.08);
    changed = true;
    notes.push(`BPM ${musicConfig.bpm}, energy down`);
  }
  if (/\b(more energy|more intense|driving|hype)\b/.test(t)) {
    musicConfig.energy = Math.min(1, musicConfig.energy + 0.15);
    changed = true;
    notes.push(`Energy ${Math.round(musicConfig.energy * 100)}%`);
  }
  if (/\b(calmer|chill|less energy|gentle|soft)\b/.test(t)) {
    musicConfig.energy = Math.max(0.15, musicConfig.energy - 0.15);
    changed = true;
    notes.push(`Energy ${Math.round(musicConfig.energy * 100)}%`);
  }

  // Magenta preference
  if (/\b(use magenta|magenta on|google music|ml melody|neural)\b/.test(t)) {
    musicConfig.preferMagenta = true;
    changed = true;
    notes.push("Magenta ML melody preferred");
  }
  if (/\b(no magenta|magenta off|procedural only|without magenta)\b/.test(t)) {
    musicConfig.preferMagenta = false;
    changed = true;
    notes.push("Procedural engine only");
  }

  // Full style swap
  const style = matchStyle(t);
  if (style && (/\bmake it\b|\bswitch to\b|\bchange to\b|\bset (to|style)\b|\bstyle\b|\bbecome\b|\bgo\b/.test(t) || Object.keys(STYLES).some((k) => t === k || t.includes(`make it ${k}`)))) {
    applyStyle(style);
    changed = true;
    notes.push(`Style → ${STYLES[style].label}`);
  } else if (style && !/\badd\b|\bremove\b|\bwith\b/.test(t)) {
    // bare "jazz" / "make jazz"
    if (t.length < 40) {
      applyStyle(style);
      changed = true;
      notes.push(`Style → ${STYLES[style].label}`);
    }
  }

  // "only X and Y"
  const onlyMatch = t.match(/\bonly\s+(.+)/);
  if (onlyMatch) {
    const part = onlyMatch[1];
    const keep = new Set();
    for (const [id, aliases] of Object.entries(INSTRUMENT_ALIASES)) {
      if (aliases.some((a) => part.includes(a))) keep.add(id);
    }
    if (keep.size) {
      for (const id of Object.keys(musicConfig.instruments)) {
        musicConfig.instruments[id] = keep.has(id);
      }
      changed = true;
      notes.push(`Only: ${[...keep].join(", ")}`);
    }
  }

  // add / remove instruments (supports "add drums and remove bass")
  for (const [id, aliases] of Object.entries(INSTRUMENT_ALIASES)) {
    let idPos = -1;
    for (const a of aliases) {
      const i = t.indexOf(a);
      if (i >= 0 && (idPos < 0 || i < idPos)) idPos = i;
    }
    if (idPos < 0) continue;
    const before = t.slice(0, idPos);
    const lastAdd = Math.max(before.lastIndexOf("add"), before.lastIndexOf("with"));
    const lastRem = Math.max(
      before.lastIndexOf("remove"),
      before.lastIndexOf("drop"),
      before.lastIndexOf("without"),
      before.lastIndexOf(" no ")
    );
    if (lastRem > lastAdd && lastRem >= 0) {
      musicConfig.instruments[id] = false;
      changed = true;
      notes.push("− " + id);
    } else if (lastAdd >= 0) {
      musicConfig.instruments[id] = true;
      changed = true;
      notes.push("+ " + id);
    } else if (/\b(remove|drop|without)\b/.test(t) && aliases.some((a) => t.includes(a))) {
      // "remove drums" without needing order tricks when single intent
      if (/\b(remove|drop|without)\b/.test(t) && !/\badd\b/.test(t)) {
        musicConfig.instruments[id] = false;
        changed = true;
        notes.push("− " + id);
      }
    }
  }

  // "with drums" without add
  if (/\bwith\b/.test(t)) {
    for (const [id, aliases] of Object.entries(INSTRUMENT_ALIASES)) {
      if (aliases.some((a) => t.includes(`with ${a}`) || t.includes(`and ${a}`))) {
        musicConfig.instruments[id] = true;
        changed = true;
        notes.push(`+ ${id}`);
      }
    }
  }

  if (!changed && notes.length === 0) {
    // try style alone
    if (style) {
      applyStyle(style);
      changed = true;
      notes.push(`Style → ${STYLES[style].label}`);
    } else {
      const inst = matchInstrument(t);
      if (inst) {
        musicConfig.instruments[inst] = true;
        changed = true;
        notes.push(`+ ${inst}`);
      } else {
        return {
          reply: "I didn’t catch that. Try “make it jazz”, “add drums”, “remove bass”, “calmer”, or “help”.",
          restarted: false,
        };
      }
    }
  }

  // Ensure at least one instrument
  if (!listActiveInstruments().length) {
    musicConfig.instruments.pad = true;
    musicConfig.instruments.melody = true;
    notes.push("(kept pad + melody so something plays)");
  }

  let restarted = false;
  if (changed) {
    if (musicOn || !musicMuted) {
      await restartMusic();
      restarted = true;
    }
  }

  const cfg = getMusicConfig();
  const reply = `${notes.join(" · ")}\nNow: ${cfg.styleLabel} @ ${cfg.bpm} BPM · ${listActiveInstruments().join(", ")}`;
  return { reply, restarted };
}

function applyStyle(styleKey) {
  const s = STYLES[styleKey];
  if (!s) return;
  musicConfig.style = styleKey;
  musicConfig.bpm = s.bpm;
  musicConfig.energy = s.energy;
  musicConfig.instruments = { ...s.instruments };
}

export function listMusicStyles() {
  return Object.entries(STYLES).map(([id, s]) => ({ id, label: s.label }));
}

export function listMusicInstruments() {
  return Object.keys(musicConfig.instruments);
}
