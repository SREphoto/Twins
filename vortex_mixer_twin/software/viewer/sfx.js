/**
 * Vortex Mixer Web Audio Procedural Synthesizer
 * Generates synthetic motor vibration, AC hum, harmonic resonance,
 * mechanical toggle switch snaps, dial detent clicks, and tube contact rattle.
 */

export class VortexSFX {
  constructor() {
    this.ctx = null;
    this.muted = false;

    // Motor synthesis nodes
    this.motorOsc1 = null; // Fundamental rotational frequency
    this.motorOsc2 = null; // 2nd harmonic (pole passing)
    this.motorOsc3 = null; // 3rd harmonic (vibration chassis rattle)
    this.motorGain = null;
    this.filterNode = null;

    // Contact chatter noise nodes
    this.noiseNode = null;
    this.noiseGain = null;

    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master motor gain
      this.motorGain = this.ctx.createGain();
      this.motorGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      // Low-pass filter to simulate cast zinc chassis acoustic damping
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);

      // 1. Fundamental Motor Osc (triangular wave)
      this.motorOsc1 = this.ctx.createOscillator();
      this.motorOsc1.type = 'triangle';
      this.motorOsc1.frequency.setValueAtTime(20, this.ctx.currentTime);

      // 2. Second Harmonic Osc (sawtooth for AC stator buzz)
      this.motorOsc2 = this.ctx.createOscillator();
      this.motorOsc2.type = 'sawtooth';
      this.motorOsc2.frequency.setValueAtTime(40, this.ctx.currentTime);

      // 3. High-Frequency Motor Bearing Whine
      this.motorOsc3 = this.ctx.createOscillator();
      this.motorOsc3.type = 'sine';
      this.motorOsc3.frequency.setValueAtTime(120, this.ctx.currentTime);

      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.value = 0.35;
      const osc3Gain = this.ctx.createGain();
      osc3Gain.gain.value = 0.15;

      this.motorOsc1.connect(this.filterNode);
      this.motorOsc2.connect(osc2Gain);
      osc2Gain.connect(this.filterNode);
      this.motorOsc3.connect(osc3Gain);
      osc3Gain.connect(this.filterNode);

      this.filterNode.connect(this.motorGain);
      this.motorGain.connect(this.ctx.destination);

      this.motorOsc1.start();
      this.motorOsc2.start();
      this.motorOsc3.start();

      // Tube chatter noise generator
      this._initNoiseGenerator();

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio initialization prevented:', e);
    }
  }

  _initNoiseGenerator() {
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.ctx.destination);

    whiteNoise.start();
  }

  updateMotorSound(rpm, hasTubeContact = false) {
    if (!this.initialized || this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    if (rpm < 50) {
      this.motorGain.gain.setTargetAtTime(0.0001, t, 0.05);
      if (this.noiseGain) {
        this.noiseGain.gain.setTargetAtTime(0.0001, t, 0.05);
      }
      return;
    }

    // Rotational frequency in Hz: f = RPM / 60
    const f0 = Math.max(12, rpm / 60.0);
    this.motorOsc1.frequency.setTargetAtTime(f0, t, 0.03);
    this.motorOsc2.frequency.setTargetAtTime(f0 * 2.0, t, 0.03);
    this.motorOsc3.frequency.setTargetAtTime(f0 * 6.0, t, 0.03);

    // Motor volume scales with RPM
    const volume = Math.min(0.28, 0.04 + (rpm / 3200.0) * 0.24);
    this.motorGain.gain.setTargetAtTime(volume, t, 0.05);

    // Filter cutoff opens up as motor spins faster
    const cutoff = 250 + (rpm / 3200.0) * 750;
    this.filterNode.frequency.setTargetAtTime(cutoff, t, 0.05);

    // Liquid / tube contact chatter
    if (this.noiseGain) {
      const noiseVol = hasTubeContact && rpm > 300 ? Math.min(0.18, 0.02 + (rpm / 3200.0) * 0.16) : 0.0001;
      this.noiseGain.gain.setTargetAtTime(noiseVol, t, 0.04);
    }
  }

  playToggleClick() {
    if (!this.initialized || this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.04);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {
      // Audio suppressed
    }
  }

  playDialTick() {
    if (!this.initialized || this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.015);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.02);
    } catch (e) {
      // Audio suppressed
    }
  }

  playButtonBeep() {
    if (!this.initialized || this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    } catch (e) {
      // Audio suppressed
    }
  }

  playTubeContact() {
    if (!this.initialized || this.muted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.08);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch (e) {
      // Audio suppressed
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.muted && this.motorGain && this.ctx) {
      this.motorGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      if (this.noiseGain) {
        this.noiseGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      }
    }
  }
}
