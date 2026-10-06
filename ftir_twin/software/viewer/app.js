/**
 * SREdesigns FTIR-7000x Fourier-Transform Infrared Spectrometer Web Application
 * Client Runtime with Three.js, Multi-Angle Camera Presets, iOS Touch Architecture,
 * Audio Synthesis, and GLP Analytical Log Generation.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FTIR3D } from './ftir3d.js?v=20261005-v4';

// Chemical Analyte Profiles
const SAMPLES = {
  isopropanol: {
    id: 'isopropanol',
    name: 'Isopropanol (IPA, 99.9%)',
    type: 'Liquid',
    desc: 'Secondary alcohol with intense broad H-bonded O-H stretch at 3350 cm⁻¹ and gem-dimethyl doublet (1381 & 1370 cm⁻¹).',
    bands: 'O-H (3350 cm⁻¹), C-H (2970 cm⁻¹), C-O (1129 cm⁻¹)',
    requiresClamp: false
  },
  acetone: {
    id: 'acetone',
    name: 'Acetone (HPLC Grade)',
    type: 'Liquid',
    desc: 'Diagnostic aliphatic ketone characterized by extremely strong carbonyl C=O stretch at 1715 cm⁻¹.',
    bands: 'C=O (1715 cm⁻¹), C-H (2925 cm⁻¹), C-C (1222 cm⁻¹)',
    requiresClamp: false
  },
  polystyrene: {
    id: 'polystyrene',
    name: 'Polystyrene Film (NIST SRM 1921b)',
    type: 'Solid Film',
    desc: 'Standard infrared calibration reference. Requires mechanical pressure clamp against diamond to optically couple with evanescent wave.',
    bands: 'Arom C-H (3026 cm⁻¹), Ring (1601 & 1492 cm⁻¹), Out-of-plane (698 cm⁻¹)',
    requiresClamp: true
  },
  toluene: {
    id: 'toluene',
    name: 'Toluene (Anhydrous)',
    type: 'Liquid',
    desc: 'Monosubstituted aromatic hydrocarbon exhibiting sharp ring vibrational quadrant stretches and out-of-plane deformation.',
    bands: 'Arom C-H (3028 cm⁻¹), C=C Ring (1496 cm⁻¹), Def (729 & 694 cm⁻¹)',
    requiresClamp: false
  },
  benzoic_acid: {
    id: 'benzoic_acid',
    name: 'Benzoic Acid Crystals',
    type: 'Solid Powder',
    desc: 'Aromatic carboxylic acid with broad hydrogen-bonded dimer Fermi resonance envelope (3100-2500 cm⁻¹) and conjugated carbonyl at 1686 cm⁻¹.',
    bands: 'O-H Dimer (2820 & 2650 cm⁻¹), C=O (1686 cm⁻¹), C-O (1292 cm⁻¹)',
    requiresClamp: true
  },
  air_blank: {
    id: 'air_blank',
    name: 'Clean Diamond / Ambient Air',
    type: 'Reference',
    desc: 'Optical baseline reference without sample analyte. Transmittance 100% across mid-IR.',
    bands: 'None (100% T Baseline)',
    requiresClamp: false
  }
};

class FTIRApp {
  constructor() {
    this.container = document.getElementById('viewport3d');
    this.hudTooltip = document.getElementById('hud-tooltip');
    this.glpConsole = document.getElementById('glp-log-console');

    // SFX
    this.sfx = new window.SpectroAudio();

    // Twin Core
    this.twin = new FTIR3D(this.container);

    // Orbit Controls
    this.controls = new OrbitControls(this.twin.camera, this.twin.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 1.1, 0);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent dipping beneath bench
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 18.0;

    // View Options
    this.autoRotate = false;
    this.orbitSpeed = 1.0;
    this.currentView = 'iso';

    // Touch Event Tracking (iOS Safari & WebKit tap reliability)
    this.touchStartPos = null;
    this.touchStartTime = 0;

    this.initUI();
    this.setupTouchAndPointer();
    this.setupViewPresets();
    this.logGLP('SYSTEM: SRE FTIR-7000x Digital Twin Initialized. 100-240V AC continuity established.');
  }

  initUI() {
    // Topbar Status
    this.statusPill = document.getElementById('status-pill');
    this.statusDetail = document.getElementById('status-detail');

    // Controls Buttons
    const btnBg = document.getElementById('btn-zero');
    if (btnBg) {
      btnBg.textContent = 'COLLECT BACKGROUND';
      btnBg.addEventListener('click', () => this.collectBackground());
    }

    const btnScan = document.getElementById('btn-scan');
    if (btnScan) {
      btnScan.textContent = 'SCAN SAMPLE';
      btnScan.addEventListener('click', () => this.collectSample());
    }

    const btnMode = document.getElementById('btn-mode');
    if (btnMode) {
      btnMode.textContent = 'CYCLE MODE (%T / A)';
      btnMode.addEventListener('click', () => this.cycleMode());
    }

    const btnSwivel = document.getElementById('btn-cell-next');
    if (btnSwivel) {
      btnSwivel.textContent = 'SWIVEL ATR TOWER';
      btnSwivel.addEventListener('click', () => this.toggleTower());
    }

    const btnChamber = document.getElementById('btn-chamber');
    if (btnChamber) {
      btnChamber.textContent = 'CYCLE CLAMP PRESSURE';
      btnChamber.addEventListener('click', () => this.cyclePressure());
    }

    const btnPower = document.getElementById('btn-power');
    if (btnPower) {
      btnPower.addEventListener('click', () => this.togglePower());
    }

    // Sample Selection Dropdown
    this.sampleSelect = document.getElementById('sample-select');
    if (this.sampleSelect) {
      this.sampleSelect.innerHTML = Object.values(SAMPLES).map(s =>
        `<option value="${s.id}">${s.name} (${s.type})</option>`
      ).join('');

      this.sampleSelect.addEventListener('change', (e) => {
        this.selectSample(e.target.value);
      });
    }

    // Export GLP Log
    const btnExport = document.getElementById('btn-export-glp');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportGLP());
    }

    // Sliders
    const orbitSpeedSlider = document.getElementById('orbit-speed');
    if (orbitSpeedSlider) {
      orbitSpeedSlider.addEventListener('input', (e) => {
        this.orbitSpeed = parseFloat(e.target.value);
        document.getElementById('orbit-speed-val').textContent = `${this.orbitSpeed.toFixed(1)}×`;
      });
    }

    const zoomSlider = document.getElementById('camera-zoom');
    if (zoomSlider) {
      zoomSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        document.getElementById('camera-zoom-val').textContent = `${val}%`;
        const dist = 8.5 - (val / 100) * 5.5;
        const dir = this.twin.camera.position.clone().sub(this.controls.target).normalize();
        this.twin.camera.position.copy(this.controls.target.clone().add(dir.multiplyScalar(dist)));
      });
    }

    const lightSlider = document.getElementById('lab-light');
    if (lightSlider) {
      lightSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        document.getElementById('lab-light-val').textContent = `${val.toFixed(1)}×`;
        // Scale directional and ambient lights
        this.twin.scene.traverse(node => {
          if (node.isDirectionalLight || node.isAmbientLight) {
            node.intensity = node.userData.baseIntensity ? node.userData.baseIntensity * val : val;
          }
        });
      });
    }

    const btnMute = document.getElementById('btn-sfx-mute');
    if (btnMute) {
      btnMute.addEventListener('click', () => {
        const muted = !this.sfx.muted;
        this.sfx.setMuted(muted);
        btnMute.textContent = muted ? 'Unmute SFX' : 'Mute SFX';
      });
    }

    // Panel collapse toggles
    document.querySelectorAll('.panel-collapse-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const panelId = btn.getAttribute('data-collapse');
        const panel = document.getElementById(`panel-${panelId}`);
        if (panel) {
          const isCollapsed = panel.classList.toggle('collapsed');
          btn.textContent = isCollapsed ? '▸' : '▾';
          btn.setAttribute('aria-expanded', !isCollapsed);
        }
      });
    });

    this.selectSample('isopropanol');
  }

  setupViewPresets() {
    const presets = {
      'btn-cam-iso': { pos: [5.6, 4.2, -7.2], target: [0.0, 1.15, -0.2] },
      'btn-cam-front': { pos: [0.0, 1.6, -8.2], target: [0.0, 1.15, -0.2] },
      'btn-cam-side': { pos: [8.6, 1.8, -0.1], target: [0.0, 1.1, -0.1] },
      'btn-cam-top': { pos: [0.0, 11.2, -0.21], target: [0.0, 1.0, -0.2] },
      'btn-cam-rear': { pos: [0.0, 2.6, 6.8], target: [0.0, 1.05, 0.6] },
      'btn-optics-view': { pos: [2.8, 4.2, -3.2], target: [0.5, 0.8, 0.5] }
    };

    Object.entries(presets).forEach(([btnId, cam]) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.animateCamera(new THREE.Vector3(...cam.pos), new THREE.Vector3(...cam.target));
          this.sfx.click();
        });
      }
    });

    const btnExplode = document.getElementById('btn-explode');
    if (btnExplode) {
      let isExploded = false;
      btnExplode.addEventListener('click', () => {
        isExploded = !isExploded;
        btnExplode.classList.toggle('active', isExploded);
        this.twin.setExploded(isExploded ? 1.0 : 0.0);
        this.sfx.shutter();
        this.logGLP(`MECHANICS: Exploded view ${isExploded ? 'ACTIVATED (+220mm offset)' : 'COLLAPSED'}`);
      });
    }

    const btnOptics = document.getElementById('btn-optics-view');
    if (btnOptics) {
      btnOptics.addEventListener('click', () => {
        this.twin.toggleOpticsView();
        btnOptics.classList.toggle('active', this.twin.opticsViewActive);
        this.logGLP(`OPTICS: Michelson interferometer ray path visualization ${this.twin.opticsViewActive ? 'ON' : 'OFF'}`);
      });
    }

    const btnRotate = document.getElementById('btn-auto-rotate');
    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        this.autoRotate = !this.autoRotate;
        this.controls.autoRotate = this.autoRotate;
        this.controls.autoRotateSpeed = this.orbitSpeed * 2.0;
        btnRotate.classList.toggle('active', this.autoRotate);
      });
    }

    const btnWireframe = document.getElementById('btn-wireframe');
    if (btnWireframe) {
      let wire = false;
      btnWireframe.addEventListener('click', () => {
        wire = !wire;
        btnWireframe.classList.toggle('active', wire);
        this.twin.scene.traverse(node => {
          if (node.isMesh && node.material) {
            node.material.wireframe = wire;
          }
        });
      });
    }
  }

  animateCamera(targetPos, targetLookAt) {
    const startPos = this.twin.camera.position.clone();
    const startTarget = this.controls.target.clone();
    let t = 0;

    const step = () => {
      t += 0.055;
      if (t > 1) t = 1;
      const ease = 0.5 - Math.cos(t * Math.PI) / 2;
      this.twin.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.lerpVectors(startTarget, targetLookAt, ease);
      this.controls.update();
      if (t < 1) requestAnimationFrame(step);
    };
    step();
  }

  setupTouchAndPointer() {
    const dom = this.twin.renderer.domElement;

    // Mobile / iPhone Touch tap detection
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        this.touchStartPos = { x: touch.clientX, y: touch.clientY };
        this.touchStartTime = performance.now();
      }
    }, { passive: true });

    dom.addEventListener('touchend', (e) => {
      if (!this.touchStartPos) return;
      const elapsed = performance.now() - this.touchStartTime;
      const touch = e.changedTouches[0];
      const dist = Math.hypot(touch.clientX - this.touchStartPos.x, touch.clientY - this.touchStartPos.y);

      if (dist < 28 && elapsed < 900) {
        this.handleActionAtPoint(touch.clientX, touch.clientY);
      }
      this.touchStartPos = null;
    });

    // Desktop Click
    dom.addEventListener('click', (e) => {
      this.handleActionAtPoint(e.clientX, e.clientY);
    });

    // Hover Tooltips
    dom.addEventListener('pointermove', (e) => {
      const rect = dom.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.twin.camera);
      const hits = this.raycaster.intersectObjects(this.twin.actionableMeshes, true);

      if (hits.length > 0) {
        const hit = hits[0].object;
        dom.style.cursor = 'pointer';
        if (this.hudTooltip && hit.userData && hit.userData.tooltip) {
          this.hudTooltip.style.display = 'block';
          this.hudTooltip.style.left = `${e.clientX + 14}px`;
          this.hudTooltip.style.top = `${e.clientY + 14}px`;
          this.hudTooltip.textContent = hit.userData.tooltip;
        }
      } else {
        dom.style.cursor = 'default';
        if (this.hudTooltip) this.hudTooltip.style.display = 'none';
      }
    });
  }

  handleActionAtPoint(clientX, clientY) {
    const rect = this.twin.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.twin.camera);
    const hits = this.raycaster.intersectObjects(this.twin.actionableMeshes, true);

    if (hits.length > 0) {
      const hit = hits[0].object;
      const action = hit.userData ? hit.userData.action : null;

      switch (action) {
        case 'toggle_plug':
          this.togglePowerCord();
          break;
        case 'toggle_switch':
          this.togglePowerSwitch();
          break;
        case 'toggle_swivel':
        case 'btn_swivel':
          this.toggleTower();
          break;
        case 'toggle_pressure':
          this.cyclePressure();
          break;
        case 'toggle_sample':
          this.cycleNextSample();
          break;
        case 'tap_screen':
        case 'btn_mode':
          this.cycleMode();
          break;
        case 'btn_bg':
          this.collectBackground();
          break;
        case 'btn_scan':
          this.collectSample();
          break;
        default:
          this.sfx.click();
      }
    }
  }

  // --- Analytical Operations ---
  togglePowerCord() {
    const newState = !this.twin.isPluggedIn;
    this.twin.setPowerCord(newState);
    this.sfx.relay();
    this.logGLP(`CONTINUITY: Power cord ${newState ? 'INSERTED into 120V duplex bench receptacle' : 'PULLED from receptacle (0V AC)'}`);
    this.updateStatus();
  }

  togglePowerSwitch() {
    const newState = !this.twin.powerSwitchOn;
    this.twin.setPowerSwitch(newState);
    this.sfx.click();
    this.logGLP(`POWER: Rear rocker switch ${newState ? 'ON' : 'OFF'}`);
    this.updateStatus();
  }

  togglePower() {
    this.togglePowerSwitch();
  }

  toggleTower() {
    this.twin.toggleSwivel();
    this.sfx.swivel();
    this.logGLP(`ATR TOWER: Swiveled ${this.twin.towerSwiveled ? 'OPEN (90° away from crystal)' : 'CLOSED (aligned over diamond)'}`);
  }

  cyclePressure() {
    const pressures = [0, 40, 80, 100];
    const currIdx = pressures.indexOf(this.twin.clampPressurePct);
    const nextPressure = pressures[(currIdx + 1) % pressures.length];
    this.twin.setPressure(nextPressure);
    this.sfx.ratchet();
    this.logGLP(`ATR CLAMP: Slip-clutch pressure set to ${nextPressure}% (${(nextPressure * 1.5).toFixed(0)} N)`);
  }

  selectSample(sampleId) {
    const smp = SAMPLES[sampleId] || SAMPLES.isopropanol;
    this.twin.setSample(smp.id);
    if (this.sampleSelect) this.sampleSelect.value = smp.id;

    // Update Sample Info Cards in panel
    const title = document.getElementById('sample-title');
    if (title) title.textContent = smp.name;
    const desc = document.getElementById('sample-desc');
    if (desc) desc.textContent = smp.desc;
    const bands = document.getElementById('sample-bands');
    if (bands) bands.textContent = `Diagnostic Bands: ${smp.bands}`;

    this.sfx.click();
    this.logGLP(`SAMPLE LOADED: ${smp.name} on Type IIa diamond prism.`);
  }

  cycleNextSample() {
    const keys = Object.keys(SAMPLES);
    const currIdx = keys.indexOf(this.twin.activeSampleId);
    const nextKey = keys[(currIdx + 1) % keys.length];
    this.selectSample(nextKey);
  }

  cycleMode() {
    const modes = ['T', 'A'];
    this.twin.scanMode = this.twin.scanMode === 'T' ? 'A' : 'T';
    this.sfx.beep(880, 0.05);
    this.logGLP(`VIEW MODE: Switched display to %${this.twin.scanMode === 'T' ? 'Transmittance (%T)' : 'Absorbance (A)'}`);
  }

  collectBackground() {
    if (!this.twin.hasPower) return;
    this.sfx.interferometerSweep();
    this.twin.startScan();
    this.logGLP('SCAN: Collecting 16 co-added background scans on clean diamond...');
    setTimeout(() => {
      this.sfx.beep(1200, 0.1);
      this.logGLP('SCAN: Background I0(v) recorded. Baseline normalized to 100.0% T.');
    }, 1800);
  }

  collectSample() {
    if (!this.twin.hasPower) return;

    const smp = SAMPLES[this.twin.activeSampleId];
    if (smp.requiresClamp && this.twin.clampPressurePct < 20) {
      this.sfx.beep(400, 0.2, 'sawtooth');
      this.logGLP(`WARNING: Solid sample [${smp.name}] requires mechanical clamp pressure for evanescent wave coupling!`);
    }

    this.sfx.interferometerSweep();
    this.twin.startScan();
    this.logGLP(`SCAN: Initiating interferometer scan of ${smp.name} (4000 to 400 cm⁻¹, res=4 cm⁻¹)...`);

    setTimeout(() => {
      this.sfx.beep(1400, 0.12);
      this.logGLP(`SCAN COMPLETE: FFT transformation finished. Characteristic peaks identified.`);
    }, 2400);
  }

  updateStatus() {
    if (!this.statusPill || !this.statusDetail) return;
    if (!this.twin.hasPower) {
      this.statusPill.textContent = 'UNPOWERED';
      this.statusPill.className = 'pill power-cut';
      this.statusDetail.textContent = 'Check bench receptacle power cord and switch';
    } else {
      this.statusPill.textContent = 'READY';
      this.statusPill.className = 'pill run';
      this.statusDetail.textContent = 'Ready for infrared absorption analysis';
    }
  }

  logGLP(msg) {
    const now = new Date();
    const ts = now.toTimeString().split(' ')[0];
    const line = `[${ts}] ${msg}\n`;
    if (this.glpConsole) {
      this.glpConsole.value += line;
      this.glpConsole.scrollTop = this.glpConsole.scrollHeight;
    }
  }

  exportGLP() {
    const text = this.glpConsole ? this.glpConsole.value : 'GLP Log Empty';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FTIR_7000x_GLP_LOG_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    this.sfx.beep(1600, 0.08);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.ftirApp = new FTIRApp();
});
