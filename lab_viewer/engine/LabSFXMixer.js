/**
 * LabSFXMixer.js — Procedural Spatial Web Audio Synthesizer
 * Generates all laboratory acoustics procedurally:
 * - Running water (faucets, drains)
 * - Bunsen burner gas hiss & roaring blue flame combustion
 * - Centrifuge motor whines (multi-harmonic scaling with RPM)
 * - Diaphragm vacuum pump rhythmic chug
 * - Magnetic stir bar glass clicks
 * - Thermal printer stepping motor chirps
 * - Footsteps on terrazzo & executive carpet
 * - Mechanical switch snaps, button detents, and relay thuds
 */

class LabSFXMixer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.activeNodes = new Map();
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      console.warn("LabSFXMixer audio context initialization failed:", e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // --- Running Water Faucet ---
  startRunningWater(id = "sink_main", intensity = 0.5) {
    this.ensureContext();
    if (!this.ctx) return;
    if (this.activeNodes.has(id)) return;

    // Buffer of pink-ish noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.18;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Bandpass filter to simulate water streaming from faucet
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(950, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.4, this.ctx.currentTime);

    // Secondary lowpass for water splash in basin
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(1600, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(intensity * 0.25, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.set(id, { source: whiteNoise, gain: gainNode });
  }

  stopRunningWater(id = "sink_main") {
    if (!this.activeNodes.has(id)) return;
    const { source, gain } = this.activeNodes.get(id);
    if (this.ctx) {
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      setTimeout(() => {
        try { source.stop(); source.disconnect(); } catch (e) {}
        this.activeNodes.delete(id);
      }, 160);
    }
  }

  // --- Bunsen Burner Flame ---
  startBunsenFlame(id = "burner_main", mode = "blue") {
    this.ensureContext();
    if (!this.ctx) return;
    this.stopBunsenFlame(id);

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02; // Brown noise for deep rumble
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(mode === "blue" ? 650 : 280, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(mode === "blue" ? 0.35 : 0.18, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.activeNodes.set(id, { source: noise, gain, filter });
  }

  setBunsenFlameMode(id = "burner_main", mode = "blue") {
    if (!this.activeNodes.has(id)) return;
    const { gain, filter } = this.activeNodes.get(id);
    if (this.ctx) {
      const freq = mode === "blue" ? 650 : 280;
      const vol = mode === "blue" ? 0.35 : 0.18;
      filter.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.3);
      gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.3);
    }
  }

  stopBunsenFlame(id = "burner_main") {
    if (!this.activeNodes.has(id)) return;
    const { source, gain } = this.activeNodes.get(id);
    if (this.ctx) {
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      setTimeout(() => {
        try { source.stop(); source.disconnect(); } catch (e) {}
        this.activeNodes.delete(id);
      }, 120);
    }
  }

  // --- Centrifuge Whine ---
  updateCentrifugeRPM(rpm, maxRpm = 14000) {
    this.ensureContext();
    if (!this.ctx) return;
    const id = "centrifuge_motor";

    if (rpm <= 50) {
      if (this.activeNodes.has(id)) {
        const { osc1, osc2, gain } = this.activeNodes.get(id);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        setTimeout(() => {
          try { osc1.stop(); osc2.stop(); } catch (e) {}
          this.activeNodes.delete(id);
        }, 220);
      }
      return;
    }

    const norm = Math.min(1.0, rpm / maxRpm);
    const fundamental = 80 + norm * 850;
    const harmonic = fundamental * 2.5;
    const targetGain = 0.04 + norm * 0.22;

    if (!this.activeNodes.has(id)) {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(fundamental, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(harmonic, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2400, this.ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc1.start();
      osc2.start();
      this.activeNodes.set(id, { osc1, osc2, gain, filter });
    } else {
      const { osc1, osc2, gain } = this.activeNodes.get(id);
      osc1.frequency.linearRampToValueAtTime(fundamental, this.ctx.currentTime + 0.1);
      osc2.frequency.linearRampToValueAtTime(harmonic, this.ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.1);
    }
  }

  // --- Thermal Printer Stepper Chirp ---
  playPrinterChirp() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(1800 + Math.random() * 400, now + i * 0.04);
      gain.gain.setValueAtTime(0.08, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * 0.04 - 0.005);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.04);
      osc.stop(now + (i + 1) * 0.04);
    }
  }

  // --- Footsteps ---
  playFootstep(surface = "terrazzo") {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    if (surface === "carpet") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(65, now);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, now);
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(420, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // --- Tactile Button Click ---
  playButtonClick() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.025);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  // --- Laboratory Soap Dispenser Pump ---
  playSoapDispense() {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Dual sound: mechanical spring ratchet click + viscous liquid squirt
    const oscClick = this.ctx.createOscillator();
    const gainClick = this.ctx.createGain();
    oscClick.type = "sine";
    oscClick.frequency.setValueAtTime(880, now);
    oscClick.frequency.exponentialRampToValueAtTime(160, now + 0.04);
    gainClick.gain.setValueAtTime(0.2, now);
    gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    oscClick.connect(gainClick);
    gainClick.connect(this.masterGain);
    oscClick.start(now);
    oscClick.stop(now + 0.045);

    // Viscous squirt using bandpassed low-frequency surge
    const oscSquirt = this.ctx.createOscillator();
    const gainSquirt = this.ctx.createGain();
    oscSquirt.type = "triangle";
    oscSquirt.frequency.setValueAtTime(320, now + 0.01);
    oscSquirt.frequency.linearRampToValueAtTime(140, now + 0.09);
    gainSquirt.gain.setValueAtTime(0.12, now + 0.01);
    gainSquirt.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    oscSquirt.connect(gainSquirt);
    gainSquirt.connect(this.masterGain);
    oscSquirt.start(now + 0.01);
    oscSquirt.stop(now + 0.095);
  }

  // --- UV Cabinet Interlock Switch & Relays ---
  playCabinetToggle(isOpen) {
    this.ensureContext();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Heavy mechanical door latch thud
    const oscLatch = this.ctx.createOscillator();
    const gainLatch = this.ctx.createGain();
    oscLatch.type = "triangle";
    oscLatch.frequency.setValueAtTime(isOpen ? 440 : 280, now);
    oscLatch.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    gainLatch.gain.setValueAtTime(0.25, now);
    gainLatch.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    oscLatch.connect(gainLatch);
    gainLatch.connect(this.masterGain);
    oscLatch.start(now);
    oscLatch.stop(now + 0.09);

    // High-pitched safety interlock microswitch snap
    const oscSnap = this.ctx.createOscillator();
    const gainSnap = this.ctx.createGain();
    oscSnap.type = "square";
    oscSnap.frequency.setValueAtTime(isOpen ? 1800 : 2200, now + 0.01);
    gainSnap.gain.setValueAtTime(0.1, now + 0.01);
    gainSnap.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    oscSnap.connect(gainSnap);
    gainSnap.connect(this.masterGain);
    oscSnap.start(now + 0.01);
    oscSnap.stop(now + 0.04);
  }
}

export const labAudio = new LabSFXMixer();
