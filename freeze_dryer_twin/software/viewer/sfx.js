/**
 * Procedural Web Audio API Sound Synthesizer: Labconco FreeZone 4.5L Freeze Dryer
 * Synthesizes dual-stage cascade compressors, rotary vane vacuum pump, solenoid clunks,
 * aeration air rush, and alert chimes without external audio assets.
 */

export class FreezeDryerSfx {
  constructor() {
    this.ctx = null;
    this.muted = false;

    // Continuous audio nodes
    this.compressorGain = null;
    this.compressorOsc1 = null;
    this.compressorOsc2 = null;

    this.vacuumGain = null;
    this.vacuumOsc = null;
    this.vacuumNoiseNode = null;

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

      // --- Dual Compressors Continuous Sub-Bass Loop ---
      this.compressorGain = this.ctx.createGain();
      this.compressorGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      this.compressorOsc1 = this.ctx.createOscillator();
      this.compressorOsc1.type = 'sawtooth';
      this.compressorOsc1.frequency.setValueAtTime(58.0, this.ctx.currentTime); // 60Hz mains harmonic

      this.compressorOsc2 = this.ctx.createOscillator();
      this.compressorOsc2.type = 'sine';
      this.compressorOsc2.frequency.setValueAtTime(116.0, this.ctx.currentTime);

      const compFilter = this.ctx.createBiquadFilter();
      compFilter.type = 'lowpass';
      compFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

      this.compressorOsc1.connect(compFilter);
      this.compressorOsc2.connect(compFilter);
      compFilter.connect(this.compressorGain);
      this.compressorGain.connect(this.masterGain);

      this.compressorOsc1.start();
      this.compressorOsc2.start();

      // --- Vacuum Pump Continuous Loop (Low chug + oil bubbling) ---
      this.vacuumGain = this.ctx.createGain();
      this.vacuumGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      this.vacuumOsc = this.ctx.createOscillator();
      this.vacuumOsc.type = 'triangle';
      this.vacuumOsc.frequency.setValueAtTime(28.0, this.ctx.currentTime); // 1750 RPM 2-pole motor chug

      const vacFilter = this.ctx.createBiquadFilter();
      vacFilter.type = 'bandpass';
      vacFilter.frequency.setValueAtTime(220, this.ctx.currentTime);
      vacFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      this.vacuumOsc.connect(vacFilter);
      vacFilter.connect(this.vacuumGain);
      this.vacuumGain.connect(this.masterGain);

      this.vacuumOsc.start();

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

  updateAcoustics(compressorOn, vacuumOn, isPowered) {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Silence if unpowered or muted
    if (!isPowered || this.muted) {
      this.compressorGain.gain.setTargetAtTime(0.0001, now, 0.05);
      this.vacuumGain.gain.setTargetAtTime(0.0001, now, 0.05);
      return;
    }

    // Compressors
    const targetComp = compressorOn ? 0.18 : 0.0001;
    this.compressorGain.gain.setTargetAtTime(targetComp, now, 0.2);

    // Vacuum Pump
    const targetVac = vacuumOn ? 0.22 : 0.0001;
    this.vacuumGain.gain.setTargetAtTime(targetVac, now, 0.15);
  }

  playSwitchSnap() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playButtonClick() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  playValveDetent() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playSolenoidClunk() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(85, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.40, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playAirRush(duration = 1.2) {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    // Synthesize white noise burst for air venting
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.30, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }

  playAlarmChime() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1174.66, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }
}

window.FreezeDryerSfx = FreezeDryerSfx;
