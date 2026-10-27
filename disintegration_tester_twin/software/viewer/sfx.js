/**
 * Procedural Web Audio Sound Synthesizer for ERWEKA ZT 322 Tablet Disintegration Tester.
 * Generates eccentric gearmotor whine, sinusoidal fluidic slosh harmonics,
 * heavy solid-state relay switching, circulation pump buzz, tactile clicks, and alarm chimes.
 */
export class DisintegrationSfx {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.motorOsc = null;
    this.motorGain = null;
    this.pumpOsc = null;
    this.pumpGain = null;
    this.sloshNoise = null;
    this.sloshGain = null;
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
      this.stopMotor();
      this.stopPump();
    }
  }

  click() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }

  touchBeep() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1850, this.ctx.currentTime);
    osc.frequency.setValueAtTime(2400, this.ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.045);
  }

  startFizz() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.fizzNode) return;

    // Buffer of white noise with high-pass filter for sparkling effervescent fizzing
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.4 ? 1 : 0.2);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    this.fizzGain = this.ctx.createGain();
    this.fizzGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.fizzGain.gain.linearRampToValueAtTime(0.07, this.ctx.currentTime + 0.3);

    noise.connect(filter);
    filter.connect(this.fizzGain);
    this.fizzGain.connect(this.ctx.destination);
    noise.start();
    this.fizzNode = noise;
  }

  stopFizz() {
    if (this.fizzGain && this.ctx) {
      this.fizzGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      setTimeout(() => {
        if (this.fizzNode) {
          try { this.fizzNode.stop(); } catch (e) {}
          this.fizzNode = null;
        }
      }, 220);
    }
  }

  relayThud() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.20, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  startMotor(cpm = 30.0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.motorOsc) return;

    this.motorOsc = this.ctx.createOscillator();
    this.motorGain = this.ctx.createGain();

    this.motorOsc.type = 'sawtooth';
    const freq = 65.0 + (cpm / 30.0) * 15.0; // Low planetary gearbox rumble
    this.motorOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Low pass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, this.ctx.currentTime);

    this.motorGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.motorGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.2);

    this.motorOsc.connect(filter);
    filter.connect(this.motorGain);
    this.motorGain.connect(this.ctx.destination);
    this.motorOsc.start();
  }

  stopMotor() {
    if (this.motorGain && this.ctx) {
      try {
        this.motorGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        setTimeout(() => {
          if (this.motorOsc) {
            this.motorOsc.stop();
            this.motorOsc.disconnect();
            this.motorOsc = null;
          }
          this.motorGain = null;
        }, 160);
      } catch (e) {
        this.motorOsc = null;
        this.motorGain = null;
      }
    }
  }

  startPump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || this.pumpOsc) return;

    this.pumpOsc = this.ctx.createOscillator();
    this.pumpGain = this.ctx.createGain();
    this.pumpOsc.type = 'sine';
    this.pumpOsc.frequency.setValueAtTime(120.0, this.ctx.currentTime); // 120 Hz line hum

    this.pumpGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.pumpGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.2);

    this.pumpOsc.connect(this.pumpGain);
    this.pumpGain.connect(this.ctx.destination);
    this.pumpOsc.start();
  }

  stopPump() {
    if (this.pumpGain && this.ctx) {
      try {
        this.pumpGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        setTimeout(() => {
          if (this.pumpOsc) {
            this.pumpOsc.stop();
            this.pumpOsc.disconnect();
            this.pumpOsc = null;
          }
          this.pumpGain = null;
        }, 110);
      } catch (e) {
        this.pumpOsc = null;
        this.pumpGain = null;
      }
    }
  }

  chime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }
}
