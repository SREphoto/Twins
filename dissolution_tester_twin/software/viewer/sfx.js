/**
 * Procedural Web Audio API Sound Synthesizer: Agilent 708-DS USP Tablet Dissolution Apparatus
 * Synthesizes motorized vertical elevator whine, 8-spindle timing belt hum,
 * hydrodynamic vessel agitation, heater circulator water pump, tablet drop clinks,
 * and relay snaps without external audio files.
 */

export class DissolutionSfx {
  constructor() {
    this.ctx = null;
    this.muted = false;

    // Continuous audio nodes
    this.masterGain = null;

    // 1. Spindle timing belt & bearings
    this.spindleGain = null;
    this.spindleOsc1 = null;
    this.spindleOsc2 = null;

    // 2. Elevator lead screw motor whine
    this.elevatorGain = null;
    this.elevatorOsc = null;

    // 3. Water bath heater circulator pump
    this.circulatorGain = null;
    this.circulatorOsc = null;

    // 4. Hydrodynamic water swirling
    this.vesselGain = null;
    this.vesselNoise = null;

    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // --- Spindles continuous drive belt & bearing sound ---
      this.spindleGain = this.ctx.createGain();
      this.spindleGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      this.spindleOsc1 = this.ctx.createOscillator();
      this.spindleOsc1.type = 'sawtooth';
      this.spindleOsc1.frequency.setValueAtTime(60.0, this.ctx.currentTime);

      this.spindleOsc2 = this.ctx.createOscillator();
      this.spindleOsc2.type = 'triangle';
      this.spindleOsc2.frequency.setValueAtTime(120.0, this.ctx.currentTime);

      const spindleFilter = this.ctx.createBiquadFilter();
      spindleFilter.type = 'lowpass';
      spindleFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.spindleOsc1.connect(spindleFilter);
      this.spindleOsc2.connect(spindleFilter);
      spindleFilter.connect(this.spindleGain);
      this.spindleGain.connect(this.masterGain);

      this.spindleOsc1.start();
      this.spindleOsc2.start();

      // --- Motorized Elevator Lead Screw Motor ---
      this.elevatorGain = this.ctx.createGain();
      this.elevatorGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      this.elevatorOsc = this.ctx.createOscillator();
      this.elevatorOsc.type = 'square';
      this.elevatorOsc.frequency.setValueAtTime(440.0, this.ctx.currentTime); // Stepper PWM whine

      const elevFilter = this.ctx.createBiquadFilter();
      elevFilter.type = 'bandpass';
      elevFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
      elevFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      this.elevatorOsc.connect(elevFilter);
      elevFilter.connect(this.elevatorGain);
      this.elevatorGain.connect(this.masterGain);

      this.elevatorOsc.start();

      // --- Water Bath Heater Circulator Pump ---
      this.circulatorGain = this.ctx.createGain();
      this.circulatorGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      this.circulatorOsc = this.ctx.createOscillator();
      this.circulatorOsc.type = 'sine';
      this.circulatorOsc.frequency.setValueAtTime(118.0, this.ctx.currentTime); // 60Hz 2nd harmonic pump

      const circFilter = this.ctx.createBiquadFilter();
      circFilter.type = 'lowpass';
      circFilter.frequency.setValueAtTime(200, this.ctx.currentTime);

      this.circulatorOsc.connect(circFilter);
      circFilter.connect(this.circulatorGain);
      this.circulatorGain.connect(this.masterGain);

      this.circulatorOsc.start();

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not allowed before user gesture:', e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0.0 : 0.7, this.ctx.currentTime);
    }
    return this.muted;
  }

  updateAcoustics(rpm, isElevating, heaterOn, isPowered) {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;

    if (!isPowered) {
      this.spindleGain.gain.setTargetAtTime(0.0001, now, 0.05);
      this.elevatorGain.gain.setTargetAtTime(0.0001, now, 0.05);
      this.circulatorGain.gain.setTargetAtTime(0.0001, now, 0.05);
      return;
    }

    // 1. Spindles
    if (rpm > 1.0) {
      const normRpm = Math.min(1.0, rpm / 250.0);
      const targetGain = 0.08 + normRpm * 0.18;
      const baseFreq = 30.0 + (rpm / 50.0) * 35.0;

      this.spindleGain.gain.setTargetAtTime(targetGain, now, 0.1);
      this.spindleOsc1.frequency.setTargetAtTime(baseFreq, now, 0.1);
      this.spindleOsc2.frequency.setTargetAtTime(baseFreq * 2.0, now, 0.1);
    } else {
      this.spindleGain.gain.setTargetAtTime(0.0001, now, 0.15);
    }

    // 2. Elevator
    if (isElevating) {
      this.elevatorGain.gain.setTargetAtTime(0.12, now, 0.05);
      this.elevatorOsc.frequency.setTargetAtTime(520.0, now, 0.1);
    } else {
      this.elevatorGain.gain.setTargetAtTime(0.0001, now, 0.08);
    }

    // 3. Heater Circulator Pump
    if (heaterOn) {
      this.circulatorGain.gain.setTargetAtTime(0.09, now, 0.2);
    } else {
      this.circulatorGain.gain.setTargetAtTime(0.0001, now, 0.2);
    }
  }

  playSwitchSnap() {
    this.ensureContext();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.03);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  playRelayThud() {
    this.ensureContext();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  playTabletDrop() {
    this.ensureContext();
    if (!this.ctx || this.muted) return;
    // 8 simultaneous tiny glass clinks & liquid splashes
    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const dt = i * 0.02 + Math.random() * 0.01;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600 + Math.random() * 800, now + dt);
      osc.frequency.exponentialRampToValueAtTime(400, now + dt + 0.06);

      gain.gain.setValueAtTime(0.12, now + dt);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dt + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + dt);
      osc.stop(now + dt + 0.08);
    }
  }

  playAlertChime(success = true) {
    this.ensureContext();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const freqs = success ? [587.33, 880.0] : [440.0, 311.13];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.2, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.38);
    });
  }
}
