/**
 * Web Audio Sound Effects — Analytical Balance Twin
 * Synthesizes tactile clicks, motor hums, door friction, and chimes.
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

/** Soft tactile capacitive touchscreen tap */
export function playTouchBeep(freq = 1200) {
  if (sfxMuted) return;
  try {
    const ac = getAudioContext();
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.8, ac.currentTime + 0.04);

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

/** Glass door sliding track friction noise */
export function playDoorSlide() {
  if (sfxMuted) return;
  try {
    const ac = getAudioContext();
    const bufferSize = ac.sampleRate * 0.25; // 250ms of pink noise
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.08;
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ac.currentTime);
    filter.Q.setValueAtTime(2.0, ac.currentTime);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.08, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    noise.start();
  } catch (e) {
    console.warn('Audio error', e);
  }
}

/** Gentle glass-on-steel clink when placing weigh boat on pan */
export function playPanClink() {
  if (sfxMuted) return;
  try {
    const ac = getAudioContext();
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2800, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ac.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start();
    osc.stop(ac.currentTime + 0.085);
  } catch (e) {
    console.warn('Audio error', e);
  }
}

/** Stable reading acquired chime */
export function playStableChime() {
  if (sfxMuted) return;
  try {
    const ac = getAudioContext();
    const now = ac.currentTime;
    [1046.5, 1318.5].forEach((f, i) => { // C6, E6
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.08);

      gain.gain.setValueAtTime(0.1, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.35);
    });
  } catch (e) {
    console.warn('Audio error', e);
  }
}

/** Internal motorized calibration counterweight servo hum */
export function playMotorCalibHum() {
  if (sfxMuted) return;
  try {
    const ac = getAudioContext();
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, ac.currentTime);
    osc.frequency.linearRampToValueAtTime(220, ac.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(140, ac.currentTime + 1.2);

    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, ac.currentTime);

    gain.gain.setValueAtTime(0.08, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    osc.start();
    osc.stop(ac.currentTime + 1.45);
  } catch (e) {
    console.warn('Audio error', e);
  }
}

/** Overload warning beep */
export function playOverloadAlarm() {
  if (sfxMuted) return;
  try {
    const ac = getAudioContext();
    const now = ac.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(2400, now + i * 0.12);

      gain.gain.setValueAtTime(0.18, now + i * 0.12);
      gain.gain.setValueAtTime(0.0, now + i * 0.12 + 0.06);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.07);
    }
  } catch (e) {
    console.warn('Audio error', e);
  }
}
