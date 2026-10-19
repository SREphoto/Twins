/**
 * Procedural Web Audio Sound Synthesizer for Metrohm Karl Fischer Titrator Twin.
 * Generates stepper motor clicks, ceramic valve thuds, magnetic stirrer rumble,
 * fluidic swirl noise, tactile button snaps, and endpoint completion chimes.
 */
class KarlFischerSfx {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.stirrerOsc = null;
    this.stirrerGain = null;
    this.fluidNoise = null;
    this.fluidGain = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
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
      this.stopStirrer();
    }
  }

  beep(freq = 1100, duration = 0.08, type = 'sine') {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  click() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }

  stepperStep() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.012);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.012);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.012);
  }

  valveRotate() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Ceramic disk valve rotation thud + detent
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(75, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);

    setTimeout(() => this.click(), 100);
  }

  startStirrer(rpm = 600) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (!this.stirrerOsc) {
      this.stirrerOsc = this.ctx.createOscillator();
      this.stirrerGain = this.ctx.createGain();

      this.stirrerOsc.type = 'triangle';
      const freq = 35 + (rpm / 1500) * 45; // 35 to 80 Hz
      this.stirrerOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      this.stirrerGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.stirrerGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.2);

      this.stirrerOsc.connect(this.stirrerGain);
      this.stirrerGain.connect(this.ctx.destination);

      this.stirrerOsc.start();
    } else {
      const freq = 35 + (rpm / 1500) * 45;
      this.stirrerOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
    }
  }

  stopStirrer() {
    if (this.stirrerOsc && this.ctx) {
      try {
        this.stirrerGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        setTimeout(() => {
          if (this.stirrerOsc) {
            this.stirrerOsc.stop();
            this.stirrerOsc.disconnect();
            this.stirrerOsc = null;
            this.stirrerGain = null;
          }
        }, 160);
      } catch (e) {
        this.stirrerOsc = null;
      }
    }
  }

  endpointChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [
      { f: 880, t: 0.0, d: 0.25 },
      { f: 1174, t: 0.12, d: 0.35 },
      { f: 1760, t: 0.26, d: 0.55 }
    ].forEach(tone => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(tone.f, now + tone.t);

      gain.gain.setValueAtTime(0.001, now + tone.t);
      gain.gain.linearRampToValueAtTime(0.12, now + tone.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + tone.t + tone.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + tone.t);
      osc.stop(now + tone.t + tone.d);
    });
  }
}

window.KarlFischerSfx = KarlFischerSfx;
