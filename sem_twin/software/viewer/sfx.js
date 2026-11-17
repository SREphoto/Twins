/**
 * sfx.js — Procedural Web Audio API Acoustic Synthesizer for ZEISS GeminiSEM 500
 *
 * Synthesizes authentic physical acoustics:
 * - Oil-free dry scroll roughing pump pulsation (30 Hz fundamental + 60 Hz harmonic)
 * - Pfeiffer HiPace 300 turbomolecular turbine whine (0 -> 90,000 RPM = 0 -> 1,500 Hz)
 * - High-voltage 30 kV inverter & beam deflection coil hum
 * - Pneumatic UHV column gate-valve & N2 vent solenoid clacks
 * - Mechanical rotary encoder detents, pushbutton microswitch clicks & breaker snaps
 */

export class SEMSoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.powered = false;

    this.masterGain = null;
    this.scrollOsc = null;
    this.scrollGain = null;
    this.turboOsc = null;
    this.turboHarmonicOsc = null;
    this.turboGain = null;
    this.beamOsc = null;
    this.beamGain = null;
  }

  _ensureContext() {
    if (this.muted) return false;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.25;
      this.masterGain.connect(this.ctx.destination);
      this._initContinuousLoops();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  _initContinuousLoops() {
    const now = this.ctx.currentTime;

    // 1. Dry Scroll Roughing Pump (30 Hz low-frequency mechanical thrum)
    this.scrollOsc = this.ctx.createOscillator();
    this.scrollOsc.type = 'triangle';
    this.scrollOsc.frequency.setValueAtTime(30, now);
    this.scrollGain = this.ctx.createGain();
    this.scrollGain.gain.setValueAtTime(0.0, now);
    this.scrollOsc.connect(this.scrollGain);
    this.scrollGain.connect(this.masterGain);
    this.scrollOsc.start();

    // 2. Pfeiffer HiPace 300 Turbomolecular Pump (ramps 120 Hz -> 1,500 Hz at 90k RPM)
    this.turboOsc = this.ctx.createOscillator();
    this.turboOsc.type = 'sine';
    this.turboOsc.frequency.setValueAtTime(140, now);

    this.turboHarmonicOsc = this.ctx.createOscillator();
    this.turboHarmonicOsc.type = 'sine';
    this.turboHarmonicOsc.frequency.setValueAtTime(280, now);

    this.turboGain = this.ctx.createGain();
    this.turboGain.gain.setValueAtTime(0.0, now);

    const harmonicGain = this.ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.28, now);

    this.turboOsc.connect(this.turboGain);
    this.turboHarmonicOsc.connect(harmonicGain);
    harmonicGain.connect(this.turboGain);
    this.turboGain.connect(this.masterGain);

    this.turboOsc.start();
    this.turboHarmonicOsc.start();

    // 3. EHT 30 kV + Scan Coil Raster Hum
    this.beamOsc = this.ctx.createOscillator();
    this.beamOsc.type = 'sawtooth';
    this.beamOsc.frequency.setValueAtTime(420, now);
    const beamFilter = this.ctx.createBiquadFilter();
    beamFilter.type = 'lowpass';
    beamFilter.frequency.setValueAtTime(950, now);

    this.beamGain = this.ctx.createGain();
    this.beamGain.gain.setValueAtTime(0.0, now);

    this.beamOsc.connect(beamFilter);
    beamFilter.connect(this.beamGain);
    this.beamGain.connect(this.masterGain);
    this.beamOsc.start();
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0.0 : 0.25, this.ctx.currentTime, 0.04);
    }
  }

  updateContinuousState({ hasPower, scrollRpm = 0, turboRpm = 0, beamActive = false, isScanning = false, scanMode = 'FAST_SURVEY_512' }) {
    this.powered = Boolean(hasPower);
    if (!this.ctx || !this.scrollGain || !this.turboGain || !this.beamGain) return;

    const now = this.ctx.currentTime;
    if (!hasPower || this.muted) {
      this.scrollGain.gain.setTargetAtTime(0.0, now, 0.05);
      this.turboGain.gain.setTargetAtTime(0.0, now, 0.08);
      this.beamGain.gain.setTargetAtTime(0.0, now, 0.04);
      return;
    }

    // Scroll pump acoustic level
    const scrollNorm = Math.min(1.0, Math.max(0.0, scrollRpm / 1800));
    this.scrollOsc.frequency.setTargetAtTime(24 + scrollNorm * 14, now, 0.1);
    this.scrollGain.gain.setTargetAtTime(scrollNorm * 0.12, now, 0.12);

    // Turbo pump frequency & level (90,000 RPM = 1,500 Hz)
    const turboNorm = Math.min(1.0, Math.max(0.0, turboRpm / 90000));
    const turboFreq = 120 + turboNorm * 1380;
    this.turboOsc.frequency.setTargetAtTime(turboFreq, now, 0.15);
    this.turboHarmonicOsc.frequency.setTargetAtTime(turboFreq * 2.0, now, 0.15);
    this.turboGain.gain.setTargetAtTime(turboNorm * 0.075, now, 0.15);

    // Beam & Raster Scan Coil hum
    if (beamActive) {
      const scanFreq = isScanning ? (scanMode === 'SLOW_PHOTO_1024' ? 260 : 680) : 400;
      this.beamOsc.frequency.setTargetAtTime(scanFreq, now, 0.08);
      this.beamGain.gain.setTargetAtTime(isScanning ? 0.045 : 0.02, now, 0.08);
    } else {
      this.beamGain.gain.setTargetAtTime(0.0, now, 0.05);
    }
  }

  playClick(pitch = 920) {
    if (!this._ensureContext()) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.028);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  playEncoderDetent(clockwise = true) {
    this.playClick(clockwise ? 1180 : 940);
  }

  playBreakerSnap(on = true) {
    if (!this._ensureContext()) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(on ? 280 : 190, now);
    osc.frequency.exponentialRampToValueAtTime(on ? 620 : 110, now + 0.065);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  playPneumaticValve() {
    if (!this._ensureContext()) return;
    const now = this.ctx.currentTime;
    // Metallic valve clack + brief gas hiss
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.09);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  updateContinuousAudio({
    powered = false,
    turboRpm = 0,
    scrollRpm = 1720,
    beamOn = false,
    scanning = false,
    scanSpeed = 'FAST_SURVEY_512',
  } = {}) {
    this._ensureContext();
    this.updateContinuousState({
      hasPower: powered,
      scrollRpm: powered ? scrollRpm : 0,
      turboRpm: powered ? turboRpm : 0,
      beamActive: powered && beamOn,
      isScanning: powered && beamOn && scanning,
      scanMode: scanSpeed,
    });
  }

  playSwitchSnap(on = true) {
    this.playBreakerSnap(on);
  }

  playValveThud() {
    this.playPneumaticValve();
  }

  playEhtChime() {
    this.playScanCompleteChime();
  }

  playInterlockBuzz() {
    if (!this._ensureContext()) return;
    const now = this.ctx.currentTime;
    [0, 0.14].forEach((offset) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(165, now + offset);
      gain.gain.setValueAtTime(0.16, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.10);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + offset);
      osc.stop(now + offset + 0.11);
    });
  }

  playAlarm() {
    this.playInterlockBuzz();
  }

  playScanCompleteChime() {
    if (!this._ensureContext()) return;
    const now = this.ctx.currentTime;
    [660, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t0 = now + idx * 0.09;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.14, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.19);
    });
  }
}

export const sfx = new SEMSoundEffects();
export default sfx;

