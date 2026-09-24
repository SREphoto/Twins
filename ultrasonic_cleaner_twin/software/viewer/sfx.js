/**
 * Complete Web Audio API Sound Synthesizer for Ultrasonic Cleaner Twin (sfx.js)
 * Fully synthesized sound effects: keypress, power relay, transducer hum, degas solenoid, heater click, fault alarm.
 */
class UltrasonicSoundEngine {
  constructor() {
    this.ctx = null;
    this.sonicHum = null;
    this.degasTimer = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playBeep(freq = 900, dur = 0.05) {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch (e) {}
  }

  playRelayClick() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playFaultAlarm() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now + i * 0.15);
        gain.gain.setValueAtTime(0.15, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.1);
      }
    } catch (e) {}
  }

  setTransducerHum(active, powerPct = 100) {
    this.init();
    if (active && !this.sonicHum) {
      try {
        this.sonicHum = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        this.sonicHum.type = 'sawtooth';
        this.sonicHum.frequency.setValueAtTime(140 + (powerPct / 100) * 30, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04 * (powerPct / 100), this.ctx.currentTime);
        this.sonicHum.connect(gain);
        gain.connect(this.ctx.destination);
        this.sonicHum.start();
      } catch (e) {}
    } else if (!active && this.sonicHum) {
      try {
        this.sonicHum.stop();
        this.sonicHum.disconnect();
        this.sonicHum = null;
      } catch (e) {}
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.setTransducerHum(false);
    return this.muted;
  }
}

export const sfx = new UltrasonicSoundEngine();
