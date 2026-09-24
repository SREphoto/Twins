/**
 * Web Audio API Sound Engine for pH Meter Twin (sfx.js)
 */
class PHSoundEngine {
  constructor() { this.ctx = null; }
  init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
  beep(freq = 800, dur = 0.06) {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator(), g = this.ctx.createGain();
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    g.gain.setValueAtTime(0.12, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(g); g.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + dur);
  }
}
export const sfx = new PHSoundEngine();
