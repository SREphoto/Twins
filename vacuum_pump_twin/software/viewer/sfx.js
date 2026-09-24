/**
 * Web Audio API Synthesizer for Vacuum Pump Sound Effects
 * Generates motor hums, start whines, ballast hisses, and fault alarm beeps.
 */

let ctx = null;
let muted = false;
let masterGainVal = 0.35;

// Synthesizer Nodes
let motorOsc = null;
let motorGain = null;
let ballastNode = null;
let ballastGain = null;
let alarmInterval = null;

function ensureCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function setSfxMuted(m) {
  muted = !!m;
  if (muted) {
    if (motorGain) motorGain.gain.setValueAtTime(0, ctx.currentTime);
    if (ballastGain) ballastGain.gain.setValueAtTime(0, ctx.currentTime);
  }
}

export function isSfxMuted() {
  return muted;
}

export function setSfxVolume(v) {
  masterGainVal = Math.max(0, Math.min(1, v));
  updateSfxVolumes();
}

function updateSfxVolumes() {
  if (muted || !ctx) return;
  // Dynamic scaling if running
}

// 1. Play Button/Switch Click
export function playClick() {
  if (muted) return;
  const ac = ensureCtx();
  if (!ac) return;

  const t0 = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(120, t0);
  osc.frequency.exponentialRampToValueAtTime(30, t0 + 0.05);

  g.gain.setValueAtTime(0.001, t0);
  g.gain.linearRampToValueAtTime(0.05 * masterGainVal, t0 + 0.002);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.05);

  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + 0.06);
}

// 2. Play Knob Click/Detent
export function playKnobTick() {
  if (muted) return;
  const ac = ensureCtx();
  if (!ac) return;

  const t0 = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, t0);
  osc.frequency.exponentialRampToValueAtTime(300, t0 + 0.015);

  g.gain.setValueAtTime(0.001, t0);
  g.gain.linearRampToValueAtTime(0.015 * masterGainVal, t0 + 0.001);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.015);

  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + 0.02);
}

// 3. Start Motor Hum Loop
export function startMotorHum() {
  const ac = ensureCtx();
  if (!ac) return;

  if (motorOsc) return; // already playing

  const t0 = ac.currentTime;
  motorOsc = ac.createOscillator();
  motorGain = ac.createGain();
  
  // Blend triangle + sine for realistic low frequency rumble
  motorOsc.type = "sawtooth";
  motorOsc.frequency.setValueAtTime(30.0, t0); // low startup hum

  motorGain.gain.setValueAtTime(0, t0);
  motorGain.gain.linearRampToValueAtTime(0.08 * masterGainVal, t0 + 0.5); // fade in

  // Lowpass filter to make it rumble rather than buzz
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(180, t0);

  motorOsc.connect(filter);
  filter.connect(motorGain);
  motorGain.connect(ac.destination);

  motorOsc.start(t0);
}

// Update Motor Frequency Based on RPM
export function updateMotorPitch(rpm) {
  if (!ctx || !motorOsc) return;
  const t0 = ctx.currentTime;
  // Map 0 - 3000 RPM to 30 Hz - 90 Hz
  const targetFreq = 30 + (rpm / 3000) * 60;
  motorOsc.frequency.setTargetAtTime(targetFreq, t0, 0.1);
  
  // Volume rises slightly with load/speed
  const targetGain = (0.04 + (rpm / 3000) * 0.06) * masterGainVal;
  if (!muted && motorGain) {
    motorGain.gain.setTargetAtTime(targetGain, t0, 0.2);
  }
}

// Stop Motor Hum Loop
export function stopMotorHum() {
  if (!motorOsc || !ctx) return;
  const t0 = ctx.currentTime;
  try {
    motorGain.gain.cancelScheduledValues(t0);
    motorGain.gain.linearRampToValueAtTime(0.001, t0 + 0.4); // fade out
    motorOsc.stop(t0 + 0.5);
  } catch (e) {}
  
  motorOsc = null;
  motorGain = null;
}

// 4. Gas Ballast Hiss (Filtered White Noise)
export function setGasBallastSound(open) {
  const ac = ensureCtx();
  if (!ac) return;

  if (open) {
    if (ballastNode) return; // already on
    
    const t0 = ac.currentTime;
    const bufferSize = ac.sampleRate * 2;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    ballastNode = ac.createBufferSource();
    ballastNode.buffer = buffer;
    ballastNode.loop = true;

    ballastGain = ac.createGain();
    ballastGain.gain.setValueAtTime(0, t0);
    ballastGain.gain.linearRampToValueAtTime(0.03 * masterGainVal, t0 + 0.2);

    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3200, t0);
    filter.Q.setValueAtTime(1.5, t0);

    ballastNode.connect(filter);
    filter.connect(ballastGain);
    ballastGain.connect(ac.destination);

    ballastNode.start(t0);
  } else {
    if (!ballastNode) return;
    const t0 = ac.currentTime;
    try {
      ballastGain.gain.cancelScheduledValues(t0);
      ballastGain.gain.linearRampToValueAtTime(0.001, t0 + 0.2);
      ballastNode.stop(t0 + 0.3);
    } catch (e) {}
    ballastNode = null;
    ballastGain = null;
  }
}

// 5. Thermal Cutout Alarm (Beeps)
export function startAlarm() {
  if (alarmInterval) return;
  const ac = ensureCtx();
  if (!ac) return;

  alarmInterval = setInterval(() => {
    if (muted) return;
    const t0 = ac.currentTime;
    const osc = ac.createOscillator();
    const g = ac.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2400, t0);

    g.gain.setValueAtTime(0.001, t0);
    g.gain.linearRampToValueAtTime(0.08 * masterGainVal, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.15);

    osc.connect(g);
    g.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + 0.2);
  }, 1000);
}

export function stopAlarm() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
}
