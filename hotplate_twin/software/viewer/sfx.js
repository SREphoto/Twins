/**
 * SREdesigns STIR-HEAT 500-D — Web Audio SFX Synthesizer
 * 
 * Synthesizes micron-accurate laboratory acoustics:
 * - Optical rotary encoder detent clicks
 * - Solid-state and electro-mechanical heater relay clicks
 * - Brushless DC motor magnetic hum (frequency dynamically tracking RPM)
 * - Glass beaker contact clink
 * - Stir bar tumbling rattle on magnetic spin-out / decouple
 * - Safety over-temperature warning buzzer
 */

let audioCtx = null;
let muted = false;

// Motor continuous hum node handles
let motorOsc = null;
let motorGain = null;

function getContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSfxMuted() {
  return muted;
}

export function setSfxMuted(val) {
  muted = Boolean(val);
  if (muted && motorGain) {
    motorGain.gain.setValueAtTime(0, audioCtx ? audioCtx.currentTime : 0);
  }
}

/** Soft mechanical click when turning rotary encoder knobs */
export function playEncoderClick() {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.012);

  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.015);
}

/** Sharp electro-mechanical relay click when heating cycles on/off */
export function playRelayClick(isEngaged = true) {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  const startFreq = isEngaged ? 880 : 660;
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.025);

  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.03);
}

/** Gentle glass-on-ceramic clink when placing the beaker */
export function playGlassClink() {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(2450, now);
  osc.frequency.exponentialRampToValueAtTime(1800, now + 0.12);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.15);
}

/** Rapid plastic rattle sound when stir bar decouples at high speed */
export function playStirDecoupleRattle() {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  for (let i = 0; i < 5; i++) {
    const t = now + i * 0.035;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900 + Math.random() * 400, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.02);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.025);
  }
}

/** Safety over-temperature warning alert beeps */
export function playSafetyAlarm() {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(3200, now);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.20);
}

/** Continuous brushless DC motor stirring hum, dynamic with RPM */
export function updateMotorHum(currentRPM) {
  if (muted || currentRPM < 15) {
    if (motorGain && audioCtx) {
      motorGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }
    return;
  }

  const ctx = getContext();
  if (!ctx) return;

  if (!motorOsc) {
    motorOsc = ctx.createOscillator();
    motorGain = ctx.createGain();

    motorOsc.type = 'sawtooth';
    motorGain.gain.setValueAtTime(0, ctx.currentTime);

    // Subtle low-pass filter to simulate instrument chassis dampening
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    motorOsc.connect(filter);
    filter.connect(motorGain);
    motorGain.connect(ctx.destination);

    motorOsc.start();
  }

  const now = ctx.currentTime;
  // Fundamental magnetic commutation frequency: ~35 Hz at 100 RPM, ~300 Hz at 1500 RPM
  const targetFreq = 25 + (currentRPM / 1500.0) * 275.0;
  motorOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);

  const targetVol = Math.min(0.045, 0.01 + (currentRPM / 1500.0) * 0.035);
  motorGain.gain.setTargetAtTime(targetVol, now, 0.08);
}
