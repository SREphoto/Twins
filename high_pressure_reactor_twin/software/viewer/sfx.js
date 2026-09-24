/**
 * Web Audio API Sound Engine for High Pressure Reactor Twin (sfx.js)
 */
class ReactorSoundEngine {
  constructor() { this.ctx = null; this.motorHum = null; }
  init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
  click() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator(), g = this.ctx.createGain();
    osc.frequency.setValueAtTime(500, this.ctx.currentTime);
    g.gain.setValueAtTime(0.1, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(g); g.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.05);
  }
  toggleMotor(active) {
    this.init();
    if (!this.ctx) return;
    if (active && !this.motorHum) {
      this.motorHum = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      this.motorHum.type = 'sawtooth';
      this.motorHum.frequency.setValueAtTime(90, this.ctx.currentTime);
      g.gain.setValueAtTime(0.05, this.ctx.currentTime);
      this.motorHum.connect(g); g.connect(this.ctx.destination);
      this.motorHum.start();
    } else if (!active && this.motorHum) {
      this.motorHum.stop(); this.motorHum.disconnect(); this.motorHum = null;
    }
  }
}
export const sfx = new ReactorSoundEngine();
