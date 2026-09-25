/**
 * Web Audio API Procedural Sound Engine for High Pressure Reactor Twin (sfx.js)
 * High-fidelity synthetic audio for SSR contactor clicks, variable-RPM motor whine,
 * high-pressure gas pressurization, needle valve venting hiss, burst disc rupture, and alarms.
 */

class ReactorSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.motorNode = null;
    this.inletNode = null;
    this.ventNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = !!muted;
    if (this.muted) {
      this.stopContinuousSounds();
    }
  }

  isMuted() {
    return this.muted;
  }

  playTouchBeep(freq = 1050, dur = 0.04) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + dur);
  }

  playRelayClick(on = true) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(on ? 480 : 360, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.03);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.035);
  }

  startMotorHum(rpm = 500) {
    if (this.muted || this.motorNode) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    const baseFreq = 45 + (rpm / 1700) * 160;

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(baseFreq, t);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 2.0, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.3);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);

    this.motorNode = { osc1, osc2, gain, filter };
  }

  updateMotorRpm(rpm) {
    if (!this.motorNode || !this.ctx) return;
    const t = this.ctx.currentTime;
    const baseFreq = 45 + (rpm / 1700) * 160;
    this.motorNode.osc1.frequency.linearRampToValueAtTime(baseFreq, t + 0.1);
    this.motorNode.osc2.frequency.linearRampToValueAtTime(baseFreq * 2.0, t + 0.1);
  }

  stopMotorHum() {
    if (!this.motorNode || !this.ctx) return;
    const t = this.ctx.currentTime;
    const { osc1, osc2, gain } = this.motorNode;

    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    setTimeout(() => {
      try {
        osc1.stop();
        osc2.stop();
      } catch (e) {}
    }, 350);

    this.motorNode = null;
  }

  startGasInletHiss() {
    if (this.muted || this.inletNode) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufSize = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buf;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, t);
    filter.Q.setValueAtTime(2.2, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.09, t + 0.2);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(t);
    this.inletNode = { whiteNoise, gain };
  }

  stopGasInletHiss() {
    if (!this.inletNode || !this.ctx) return;
    const t = this.ctx.currentTime;
    const { whiteNoise, gain } = this.inletNode;

    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    setTimeout(() => {
      try {
        whiteNoise.stop();
      } catch (e) {}
    }, 220);

    this.inletNode = null;
  }

  startVentHiss() {
    if (this.muted || this.ventNode) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufSize = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buf;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, t);
    filter.Q.setValueAtTime(1.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.15);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(t);
    this.ventNode = { whiteNoise, gain };
  }

  stopVentHiss() {
    if (!this.ventNode || !this.ctx) return;
    const t = this.ctx.currentTime;
    const { whiteNoise, gain } = this.ventNode;

    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    setTimeout(() => {
      try {
        whiteNoise.stop();
      } catch (e) {}
    }, 280);

    this.ventNode = null;
  }

  playRuptureBlast() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufSize = Math.floor(this.ctx.sampleRate * 0.6);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
    }

    const blast = this.ctx.createBufferSource();
    blast.buffer = buf;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.40, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    blast.connect(gain);
    gain.connect(this.ctx.destination);

    blast.start(t);
  }

  playAlarm() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1046.5, t);
    osc.frequency.setValueAtTime(784.0, t + 0.12);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.32);
  }

  stopContinuousSounds() {
    this.stopMotorHum();
    this.stopGasInletHiss();
    this.stopVentHiss();
  }
}

export const sfx = new ReactorSoundEngine();
