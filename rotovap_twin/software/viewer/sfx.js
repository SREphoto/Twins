/**
 * Web Audio Sound Effects — Rotary Evaporator Twin (Büchi R-300 Class)
 * Synthesizes motorized lift, drive rotation, vacuum hisses, boiling bubbles, and drips.
 */

let ctx = null;
let sfxMuted = false;

function getAudioContext() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioCtx();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

export function setSfxMuted(muted) {
  sfxMuted = muted;
}

export function isSfxMuted() {
  return sfxMuted;
}

/** Motorized linear lift actuator hum */
export function playLiftMotor(isUp = true) {
  if (sfxMuted) return;
  try {
    const ac = getAudioContext();
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sawtooth';
    const startF = isUp ? 140 : 180;
    const endF = isUp ? 180 : 140;
    osc.frequency.setValueAtTime(startF, ac.currentTime);
    osc.frequency.linearRampToValueAtTime(endF, ac.currentTime + 0.6);

    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ac.currentTime);

    gain.gain.setValueAtTime(0.08, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    osc.start();
    osc.stop(ac.currentTime + 0.62);
  } catch (e) {
    console.warn('Audio error', e);
  }
}

/** Rotation motor continuous whine, scaled with RPM */
let rotOsc = null;
let rotGain = null;

export function setRotationSound(rpm) {
  if (sfxMuted || rpm < 5) {
    if (rotGain && ctx) {
      rotGain.gain.setTargetAtTime(0.0, ctx.currentTime, 0.1);
    }
    return;
  }
  try {
    const ac = getAudioContext();
    if (!rotOsc) {
      rotOsc = ac.createOscillator();
      rotOsc.type = 'triangle';

      rotGain = ac.createGain();
      rotGain.gain.setValueAtTime(0.01, ac.currentTime);

      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ac.currentTime);

      rotOsc.connect(filter);
      filter.connect(rotGain);
      rotGain.connect(ac.destination);
      rotOsc.start();
    }

    const freq = 60 + (rpm / 280) * 160;
    rotOsc.frequency.setTargetAtTime(freq, ac.currentTime, 0.05);
    rotGain.gain.setTargetAtTime(0.045, ac.currentTime, 0.05);
  } catch (e) {
    console.warn('Audio error', e);
  }
}

/** Condensate liquid droplet falling into receiving flask */
export function playDripSound() {
  if (sfxMuted) return;
  try {
    const ac = getAudioContext();
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(3200, ac.currentTime + 0.035);

    gain.gain.setValueAtTime(0.12, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start();
    osc.stop(ac.currentTime + 0.045);
  } catch (e) {
    console.warn('Audio error', e);
  }
}

/** Vacuum Aeration Stopcock Hiss */
export function playVacuumHiss() {
  if (sfxMuted) return;
  try {
    const ac = getAudioContext();
    const bufferSize = ac.sampleRate * 0.4;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, ac.currentTime);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.12, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    noise.start();
  } catch (e) {
    console.warn('Audio error', e);
  }
}

/** Rotary push-knob tactile click */
export function playKnobClick() {
  if (sfxMuted) return;
  try {
    const ac = getAudioContext();
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.02);

    gain.gain.setValueAtTime(0.08, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start();
    osc.stop(ac.currentTime + 0.022);
  } catch (e) {
    console.warn('Audio error', e);
  }
}
