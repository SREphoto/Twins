/**
 * Metrohm 901 Titrando Karl Fischer Moisture Titrator Web Application
 * Client Runtime with Three.js, Multi-Angle Camera Presets, Dynamic Bipotentiometric LCD,
 * Physical Tactile Keycaps, Part Explorer, Web Audio Synthesis, and GLP Audit Logging.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { KarlFischer3D } from './karl_fischer3d.js?v=20261018-kf1';
import { initChemMateTheme } from '../../../lab_viewer/shared/chemmate_theme_manager.js';

// Chemical Analyte Profiles
const SAMPLES = {
  water_std_1: {
    id: 'water_std_1',
    name: 'Hydranal Water Standard 1.0%',
    mass_g: 1.0000,
    expected_pct: 1.000,
    desc: 'Ampouled certified secondary reference material (10.0 mg H2O/g) for volumetric titer determination.'
  },
  water_std_01: {
    id: 'water_std_01',
    name: 'Hydranal Water Standard 0.1%',
    mass_g: 2.0000,
    expected_pct: 0.100,
    desc: 'Trace water standard (1.0 mg H2O/g) for low-level validation.'
  },
  pure_methanol: {
    id: 'pure_methanol',
    name: 'HPLC Anhydrous Methanol',
    mass_g: 5.0000,
    expected_pct: 0.015,
    desc: 'Residual moisture assay in chromatographic grade anhydrous reagent.'
  },
  pharma_api: {
    id: 'pharma_api',
    name: 'Lyophilized API Powder',
    mass_g: 0.2500,
    expected_pct: 0.850,
    desc: 'Purified active pharmaceutical ingredient hygroscopic moisture verification.'
  },
  custom_water: {
    id: 'custom_water',
    name: 'Custom Pure Water Standard',
    mass_g: 0.0100,
    expected_pct: 100.0,
    desc: 'Direct micro-syringe injection of 10.0 µL high-purity water.'
  }
};

const PART_CATALOG = [
  { id: 'Body_Chassis', label: 'Metrohm 901 Titrando Unibody Console', cat: 'Chassis' },
  { id: 'UI_LCD', label: '5.7-Inch Dynamic Touchscreen Display Quad', cat: 'Electronics' },
  { id: 'Glass_LCDLens', label: 'Anti-Reflective Optical Glass Display Window', cat: 'Optical' },
  { id: 'Badge_SREdesigns', label: 'SREdesigns Official Brand Identity Badge', cat: 'Chassis' },
  { id: 'Btn_Start', label: 'Tactile Silicone Keycap: START (Green)', cat: 'Controls' },
  { id: 'Btn_Stop', label: 'Tactile Silicone Keycap: STOP (Red)', cat: 'Controls' },
  { id: 'Btn_Stir', label: 'Tactile Silicone Keycap: STIR (Blue)', cat: 'Controls' },
  { id: 'Btn_Dose', label: 'Tactile Silicone Keycap: DOSE (Amber)', cat: 'Controls' },
  { id: 'Btn_Tare', label: 'Tactile Silicone Keycap: TARE (Slate)', cat: 'Controls' },
  { id: 'Body_StandBase', label: '803 Ti Stand & 801 Stirrer Cast Base', cat: 'Stand' },
  { id: 'Plate_MagneticStirrer', label: 'Ceramic Inlay Magnetic Stirrer Plate', cat: 'Stirrer' },
  { id: 'Knob_StirSpeed', label: 'Knurled Stirrer Speed Potentiometer Dial', cat: 'Controls' },
  { id: 'Shaft_StandRod', label: '304 Stainless Steel Support Rod Ø12mm', cat: 'Stand' },
  { id: 'Bracket_VesselClamp', label: 'Anodized Aluminum Clamping Arm Bracket', cat: 'Stand' },
  { id: 'Glass_TitrationCell', label: '100 mL Clear Borosilicate Titration Cell', cat: 'Glassware' },
  { id: 'Fluid_MeniscusVortex', label: 'Karl Fischer Working Reagent & Vortex Meniscus', cat: 'Fluidics' },
  { id: 'Part_MagneticStirBar', label: 'Octagonal PTFE Magnetic Stir Flea Ø6x20mm', cat: 'Stirrer' },
  { id: 'Lid_VesselPTFE', label: '5-Port Ground-Joint Hermetic Cell Cover (PTFE)', cat: 'Glassware' },
  { id: 'Electrode_DoublePt_Assembly', label: 'Double-Platinum Pin Electrode (6.0338.100)', cat: 'Sensor' },
  { id: 'Metal_PlatinumPins', label: 'Twin 99.99% Pure Platinum Polarized Pins', cat: 'Sensor' },
  { id: 'Assembly_DryingTube', label: 'Desiccant Tube with 3Å Molecular Sieve Beads', cat: 'Desiccant' },
  { id: 'Part_AntidiffusionTip', label: 'PTFE Antidiffusion Dosing Delivery Tip', cat: 'Fluidics' },
  { id: 'Cap_SeptumInjection', label: 'Septum Screw Cap for Syringe Sample Addition', cat: 'Glassware' },
  { id: 'Glass_ReagentBottle', label: '1000 mL Amber Glass Reagent Reservoir (GL45)', cat: 'Glassware' },
  { id: 'Body_DosinoDrive', label: 'Metrohm 800 Dosino Top-Mounted Buret Housing', cat: 'Dosino' },
  { id: 'Valve_DosinoDisk', label: '4-Port Ceramic Switching Disk Valve', cat: 'Dosino' },
  { id: 'Shaft_DosinoPiston', label: 'Micro-Stepper Lead Screw & PTFE Piston Head', cat: 'Dosino' },
  { id: 'Tube_DeliveryCapillary', label: 'Fluoropolymer FEP Delivery Capillary Line', cat: 'Fluidics' },
  { id: 'Cable_ElectrodeCoaxial', label: 'Shielded Low-Noise Coaxial BNC Sensor Cable', cat: 'Electronics' },
  { id: 'Power_Receptacle_Duplex', label: 'Cast Aluminum Bench Receptacle Box (NEMA 5-15R)', cat: 'Power' },
  { id: 'Part_PowerPlugNEMA', label: 'Molded NEMA 5-15P AC Power Plug', cat: 'Power' },
  { id: 'Cable_ACPowerCord', label: 'Heavy-Duty 3-Wire SJTOW Neoprene AC Cord', cat: 'Power' },
  { id: 'Switch_Power', label: 'Illuminated Rear SPST Rocker Power Switch', cat: 'Power' }
];

class KarlFischerApp {
  constructor() {
    this.container = document.getElementById('viewport3d');
    this.sfx = new window.KarlFischerSfx();

    // Twin 3D Engine
    this.twin = new KarlFischer3D(this.container);
    window.__twin = this.twin;
    window.__app = this;

    // OrbitControls setup
    this.controls = new OrbitControls(this.twin.camera, this.twin.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0.65, 1.85, 0.0);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
    this.controls.minDistance = 0.8;
    this.controls.maxDistance = 15.0;

    // State Variables
    this.selectedPartId = null;
    this.isolatedPartId = null;
    this.autoRotate = false;
    this.orbitSpeed = 1.0;

    // Dual-Truth Simulation Engine
    this.titer = 4.985; // mg H2O / mL
    this.ambientDrift = 8.5; // µg / min
    this.stopPotential = 100.0; // mV
    this.cellWaterUg = 12.0;
    this.potentialMv = 540.0;
    this.volumeDosedMl = 0.0;
    this.elapsedTimeS = 0.0;
    this.holdTimerS = 0.0;
    this.state = 'STANDBY';
    this.currentSample = SAMPLES.water_std_1;
    this.glpRecords = [];

    // Raycaster for Pointer/Touch interaction
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.initUI();
    this.initPartExplorer();
    this.setupViewPresets();
    this.setupTouchAndPointer();

    // ChemMate Theme Controller (Modern, Retro, Night)
    this.themeManager = initChemMateTheme({
      twinName: 'KarlFischerTwin',
      scene: this.twin.scene,
      ambLight: this.twin.ambientLight,
      dirLight: this.twin.keyLight,
      onThemeChange: () => {
        this.twin.renderLCD();
      }
    });

    // Start Simulation Loop
    this.lastTime = performance.now();
    this.simLoop = this.simLoop.bind(this);
    requestAnimationFrame(this.simLoop);

    // Initial GLP log entry
    this.logGLP('SYSTEM: Metrohm 901 Titrando Digital Twin Initialized. 100-240V AC continuity established.');
  }

  initUI() {
    this.statusPill = document.getElementById('status-pill');
    this.statusDetail = document.getElementById('status-detail');

    // Button Listeners
    const btnCond = document.getElementById('btn-condition');
    if (btnCond) btnCond.addEventListener('click', () => this.startConditioning());

    const btnStart = document.getElementById('btn-start');
    if (btnStart) btnStart.addEventListener('click', () => this.startTitration());

    const btnInject = document.getElementById('btn-inject');
    if (btnInject) btnInject.addEventListener('click', () => this.injectSample());

    const btnStop = document.getElementById('btn-stop');
    if (btnStop) btnStop.addEventListener('click', () => this.stopTitration());

    // Sample Select
    const sampleSel = document.getElementById('sample-select');
    if (sampleSel) {
      sampleSel.addEventListener('change', (e) => {
        this.currentSample = SAMPLES[e.target.value] || SAMPLES.water_std_1;
        this.twin.displayState.sample_name = this.currentSample.name;
        this.twin.displayState.sample_mass_g = this.currentSample.mass_g;
        this.twin.renderLCD();
      });
    }

    // Stirrer Slider
    const stirSlider = document.getElementById('stir-speed-slider');
    const stirVal = document.getElementById('stir-speed-val');
    if (stirSlider && stirVal) {
      stirSlider.addEventListener('input', (e) => {
        const rpm = parseFloat(e.target.value);
        stirVal.textContent = `${rpm} RPM`;
        this.twin.stirrerSpeedRpm = rpm;
        if (rpm > 0 && this.twin.isPluggedIn && this.twin.powerSwitchOn) {
          this.sfx.startStirrer(rpm);
        } else {
          this.sfx.stopStirrer();
        }
      });
    }

    // Plug Toggle
    const btnPlug = document.getElementById('btn-plug-toggle');
    if (btnPlug) {
      btnPlug.addEventListener('click', () => {
        this.twin.togglePlug();
        this.sfx.click();
        this.updateContinuity();
      });
    }

    // CSV Export
    const btnExport = document.getElementById('btn-export-csv');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportCSV());
    }

    // Panel Collapse Handlers
    document.querySelectorAll('.panel-collapse-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const panelId = btn.getAttribute('data-collapse');
        const panel = document.getElementById(`panel-${panelId}`);
        if (panel) {
          panel.classList.toggle('collapsed');
          const isCollapsed = panel.classList.contains('collapsed');
          btn.textContent = isCollapsed ? '◂' : '▾';
          btn.setAttribute('aria-expanded', !isCollapsed);
        }
      });
    });
  }

  initPartExplorer() {
    const list = document.getElementById('part-list');
    const search = document.getElementById('part-search');
    if (!list) return;

    const renderList = (filter = '') => {
      list.innerHTML = '';
      const f = filter.toLowerCase();
      PART_CATALOG.forEach(part => {
        if (!f || part.label.toLowerCase().includes(f) || part.cat.toLowerCase().includes(f)) {
          const div = document.createElement('div');
          div.className = `part-item ${this.selectedPartId === part.id ? 'active' : ''}`;
          div.innerHTML = `
            <span>${part.label}</span>
            <span class="part-cat">${part.cat}</span>
          `;
          div.addEventListener('click', () => this.selectPart(part.id));
          list.appendChild(div);
        }
      });
    };

    renderList();
    if (search) {
      search.addEventListener('input', (e) => renderList(e.target.value));
    }
  }

  selectPart(partId) {
    this.selectedPartId = partId;
    this.sfx.click();
    this.initPartExplorer();

    // Highlight part in 3D scene
    this.twin.scene.traverse(node => {
      if (node.isMesh && node.material && node.name !== 'UI_LCD') {
        const isMatch = (node.name === partId || node.parent?.name === partId);
        if (isMatch) {
          node.material.emissive = new THREE.Color(0x00f3ff);
          node.material.emissiveIntensity = 0.45;
          setTimeout(() => {
            if (node.material) {
              node.material.emissive = new THREE.Color(0x000000);
              node.material.emissiveIntensity = 0.0;
            }
          }, 1200);
        }
      }
    });
  }

  setupViewPresets() {
    const presets = {
      'btn-cam-iso': { pos: [3.8, 3.8, 6.2], target: [0.65, 1.85, 0.0] },
      'btn-cam-front': { pos: [0.65, 2.2, 7.2], target: [0.65, 1.85, 0.0] },
      'btn-cam-console': { pos: [-0.45, 1.9, 2.8], target: [-0.45, 1.7, 0.2] },
      'btn-cam-cell': { pos: [0.95, 1.7, 3.0], target: [0.95, 1.3, 0.35] },
      'btn-cam-dosino': { pos: [1.95, 2.6, 3.2], target: [1.95, 2.2, -0.15] },
      'btn-cam-side': { pos: [6.8, 2.2, 0.0], target: [0.65, 1.85, 0.0] },
      'btn-cam-top': { pos: [0.65, 7.8, 0.0], target: [0.65, 1.85, 0.0] },
      'btn-cam-rear': { pos: [0.65, 2.2, -7.2], target: [0.65, 1.85, 0.0] }
    };

    Object.entries(presets).forEach(([btnId, cfg]) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.view-toolbar .view-btn').forEach(b => {
            if (b.id.startsWith('btn-cam-')) b.classList.remove('active');
          });
          btn.classList.add('active');
          this.sfx.click();
          this.animateCamera(cfg.pos, cfg.target);
        });
      }
    });

    // Exploded View Toggle
    const btnExp = document.getElementById('btn-explode');
    if (btnExp) {
      btnExp.addEventListener('click', () => {
        const isExp = !this.twin.exploded;
        this.twin.setExploded(isExp);
        btnExp.classList.toggle('active', isExp);
        this.sfx.valveRotate();
      });
    }

    // Wireframe Toggle
    const btnWire = document.getElementById('btn-wireframe');
    if (btnWire) {
      btnWire.addEventListener('click', () => {
        btnWire.classList.toggle('active');
        const wire = btnWire.classList.contains('active');
        this.twin.scene.traverse(node => {
          if (node.isMesh && node.material && node.name !== 'UI_LCD') {
            node.material.wireframe = wire;
          }
        });
        this.sfx.click();
      });
    }

    // Auto-Rotate Toggle
    const btnRotate = document.getElementById('btn-auto-rotate');
    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        this.autoRotate = !this.autoRotate;
        btnRotate.classList.toggle('active', this.autoRotate);
        this.sfx.click();
      });
    }

    // Toolbar Sliders
    const orbitSpeedSlider = document.getElementById('orbit-speed');
    const orbitSpeedVal = document.getElementById('orbit-speed-val');
    if (orbitSpeedSlider && orbitSpeedVal) {
      orbitSpeedSlider.addEventListener('input', (e) => {
        this.orbitSpeed = parseFloat(e.target.value);
        orbitSpeedVal.textContent = `${this.orbitSpeed.toFixed(1)}×`;
      });
    }

    const zoomSlider = document.getElementById('camera-zoom');
    const zoomVal = document.getElementById('camera-zoom-val');
    if (zoomSlider && zoomVal) {
      zoomSlider.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10);
        zoomVal.textContent = `${pct}%`;
        const dist = 1.0 + (100 - pct) * 0.08;
        const dir = this.twin.camera.position.clone().sub(this.controls.target).normalize();
        this.twin.camera.position.copy(this.controls.target).add(dir.multiplyScalar(dist));
      });
    }

    const lightSlider = document.getElementById('lab-light');
    const lightVal = document.getElementById('lab-light-val');
    if (lightSlider && lightVal) {
      lightSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        lightVal.textContent = `${val.toFixed(1)}×`;
        this.twin.keyLight.intensity = 1.35 * val;
        this.twin.ambientLight.intensity = 0.75 * val;
        this.twin.fillLight.intensity = 0.65 * val;
      });
    }

    const btnMute = document.getElementById('btn-sfx-mute');
    if (btnMute) {
      btnMute.addEventListener('click', () => {
        btnMute.classList.toggle('active');
        const isMuted = btnMute.classList.contains('active');
        this.sfx.setMuted(isMuted);
        btnMute.textContent = isMuted ? 'Unmute SFX' : 'Mute SFX';
      });
    }
  }

  animateCamera(targetPos, targetLookAt) {
    const startPos = this.twin.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const endPos = new THREE.Vector3(...targetPos);
    const endTarget = new THREE.Vector3(...targetLookAt);

    let progress = 0;
    const animate = () => {
      progress += 0.04;
      if (progress < 1.0) {
        this.twin.camera.position.lerpVectors(startPos, endPos, progress);
        this.controls.target.lerpVectors(startTarget, endTarget, progress);
        this.controls.update();
        requestAnimationFrame(animate);
      } else {
        this.twin.camera.position.copy(endPos);
        this.controls.target.copy(endTarget);
        this.controls.update();
      }
    };
    animate();
  }

  setupTouchAndPointer() {
    const dom = this.twin.renderer.domElement;
    const hud = document.getElementById('hud-tooltip');

    const handleInteract = (clientX, clientY) => {
      const rect = dom.getBoundingClientRect();
      this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.twin.camera);
      const intersects = this.raycaster.intersectObjects(this.twin.interactiveMeshes, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const name = hit.name || hit.parent?.name;

        // 3D Soft Touchscreen Interaction
        if (hit.name === 'UI_LCD') {
          const uv = intersects[0].uv;
          if (uv && uv.y > 0.85) {
            // Soft key clicked (bottom area)
            const btnIdx = Math.floor(uv.x * 5);
            if (btnIdx === 0) this.startConditioning();
            else if (btnIdx === 1) this.injectSample();
            else if (btnIdx === 2) this.startTitration();
            else if (btnIdx === 3) this.stopTitration();
            else if (btnIdx === 4) this.primeDosino();
            this.sfx.click();
            return;
          }
        }

        // Tactile Keycaps
        if (name === 'Btn_Start') { this.depressKeycap(hit.parent); this.startTitration(); }
        else if (name === 'Btn_Stop') { this.depressKeycap(hit.parent); this.stopTitration(); }
        else if (name === 'Btn_Stir') { this.depressKeycap(hit.parent); this.toggleStirrer(); }
        else if (name === 'Btn_Dose') { this.depressKeycap(hit.parent); this.primeDosino(); }
        else if (name === 'Btn_Tare') { this.depressKeycap(hit.parent); this.tareSystem(); }
        else if (name === 'Switch_Power') { this.togglePowerSwitch(); }
        else if (name === 'Part_PowerPlugNEMA') { this.twin.togglePlug(); this.updateContinuity(); }
        else if (name === 'Knob_StirSpeed') { this.cycleStirSpeed(); }
      }
    };

    dom.addEventListener('pointerdown', (e) => handleInteract(e.clientX, e.clientY));

    // Pointer hover for HUD Tooltip
    dom.addEventListener('pointermove', (e) => {
      const rect = dom.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.twin.camera);
      const hits = this.raycaster.intersectObjects(this.twin.scene.children, true);
      if (hits.length > 0) {
        const topNode = hits[0].object;
        const match = PART_CATALOG.find(p => p.id === topNode.name || p.id === topNode.parent?.name);
        if (match && hud) {
          hud.style.display = 'block';
          hud.style.left = `${e.clientX + 14}px`;
          hud.style.top = `${e.clientY + 14}px`;
          hud.innerHTML = `<strong>${match.label}</strong><br><span style="color: var(--cyan);">${match.cat}</span>`;
          return;
        }
      }
      if (hud) hud.style.display = 'none';
    });
  }

  depressKeycap(keyGroup) {
    if (!keyGroup) return;
    this.sfx.click();
    keyGroup.position.z -= 0.02; // 1.0mm depress
    setTimeout(() => {
      keyGroup.position.z += 0.02;
    }, 120);
  }

  togglePowerSwitch() {
    this.twin.powerSwitchOn = !this.twin.powerSwitchOn;
    if (this.twin.animGroups.switchRocker) {
      this.twin.animGroups.switchRocker.rotation.x = this.twin.powerSwitchOn ? -0.25 : 0.25;
    }
    this.sfx.click();
    this.updateContinuity();
  }

  toggleStirrer() {
    this.twin.stirrerRunning = !this.twin.stirrerRunning;
    if (this.twin.stirrerRunning && this.twin.stirrerSpeedRpm > 0) {
      this.sfx.startStirrer(this.twin.stirrerSpeedRpm);
    } else {
      this.sfx.stopStirrer();
    }
  }

  cycleStirSpeed() {
    const speeds = [300, 600, 900, 1200, 0];
    const cur = speeds.indexOf(this.twin.stirrerSpeedRpm);
    const nextRpm = speeds[(cur + 1) % speeds.length];
    this.twin.stirrerSpeedRpm = nextRpm;

    const slider = document.getElementById('stir-speed-slider');
    const label = document.getElementById('stir-speed-val');
    if (slider) slider.value = nextRpm;
    if (label) label.textContent = `${nextRpm} RPM`;

    if (nextRpm > 0 && this.twin.stirrerRunning) {
      this.sfx.startStirrer(nextRpm);
    } else {
      this.sfx.stopStirrer();
    }
  }

  updateContinuity() {
    const hasPower = this.twin.isPluggedIn && this.twin.powerSwitchOn;
    if (!hasPower) {
      this.statusPill.className = 'pill fault';
      this.statusPill.textContent = !this.twin.isPluggedIn ? 'UNPLUGGED' : 'SWITCH OFF';
      this.statusDetail.textContent = 'Zero electrical power · LCD dark · Motor offline';
      this.sfx.stopStirrer();
      this.twin.dosingActive = false;
    } else {
      this.statusPill.className = 'pill run';
      this.statusPill.textContent = this.state;
      this.statusDetail.textContent = 'AC continuity established · 100-240V';
    }
    this.twin.renderLCD();
  }

  // --- Scientific Titration Control ---

  startConditioning() {
    if (!this.twin.isPluggedIn || !this.twin.powerSwitchOn) return;
    this.state = 'PRE_TITR';
    this.elapsedTimeS = 0.0;
    this.holdTimerS = 0.0;
    this.sfx.beep(880, 0.08);
    this.sfx.valveRotate();
    this.logGLP('ACTION: Started pre-titration cell conditioning.');
  }

  injectSample() {
    if (!this.twin.isPluggedIn || !this.twin.powerSwitchOn) return;
    const addedWaterMg = (this.currentSample.mass_g * 1000.0) * (this.currentSample.expected_pct / 100.0);
    this.cellWaterUg += addedWaterMg * 1000.0;
    this.potentialMv = 585.0;
    this.state = 'TITRATING';
    this.volumeDosedMl = 0.0;
    this.elapsedTimeS = 0.0;
    this.holdTimerS = 0.0;
    this.twin.dosingActive = true;
    this.sfx.beep(980, 0.12);
    this.logGLP(`SAMPLE: Injected ${this.currentSample.name} (${this.currentSample.mass_g.toFixed(4)} g).`);
  }

  startTitration() {
    if (!this.twin.isPluggedIn || !this.twin.powerSwitchOn) return;
    if (this.state === 'READY') {
      this.injectSample();
    } else if (this.state === 'STANDBY' || this.state === 'COMPLETE') {
      this.startConditioning();
    }
  }

  stopTitration() {
    this.state = 'STANDBY';
    this.twin.dosingActive = false;
    this.sfx.beep(440, 0.15);
    this.logGLP('ACTION: Titration aborted by operator.');
  }

  primeDosino() {
    this.sfx.valveRotate();
    this.twin.dosingActive = true;
    setTimeout(() => {
      this.twin.dosingActive = false;
    }, 1500);
    this.logGLP('MAINT: 800 Dosino buret primed with Hydranal-5.');
  }

  tareSystem() {
    this.volumeDosedMl = 0.0;
    this.sfx.click();
    this.logGLP('ACTION: Volume counter tared to 0.0000 mL.');
  }

  simLoop() {
    requestAnimationFrame(this.simLoop);

    const now = performance.now();
    const dt = Math.min(0.1, (now - this.lastTime) / 1000.0);
    this.lastTime = now;

    // Controls update
    if (this.autoRotate) {
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 2.0 * this.orbitSpeed;
    } else {
      this.controls.autoRotate = false;
    }
    this.controls.update();

    if (!this.twin.isPluggedIn || !this.twin.powerSwitchOn) {
      return;
    }

    this.elapsedTimeS += dt;

    if (this.state === 'PRE_TITR') {
      if (this.cellWaterUg > 0.0) {
        const dose = Math.min(0.04 * dt, (this.cellWaterUg / (this.titer * 1000.0)) + 0.0002);
        this.volumeDosedMl += dose;
        this.cellWaterUg = Math.max(0.0, this.cellWaterUg - dose * this.titer * 1000.0);
        this.sfx.stepperStep();
      } else {
        this.cellWaterUg += (this.ambientDrift / 60.0) * dt;
        if (this.cellWaterUg > 1.2) {
          const p = this.cellWaterUg / (this.titer * 1000.0);
          this.cellWaterUg = 0.0;
          this.volumeDosedMl += p;
        }
      }
      this.updatePotential();

      if (this.potentialMv <= this.stopPotential) {
        this.holdTimerS += dt;
        if (this.holdTimerS >= 2.5) {
          this.state = 'READY';
          this.holdTimerS = 0.0;
          this.sfx.beep(1320, 0.15);
          this.logGLP('STATUS: Pre-titration conditioned. Drift stable at 8.5 µg/min. Ready for sample.');
        }
      } else {
        this.holdTimerS = 0.0;
      }
    } else if (this.state === 'TITRATING') {
      const adaptive = Math.max(0.1, Math.min(1.0, this.cellWaterUg / 120.0));
      const dose = 0.05 * adaptive * dt;
      this.volumeDosedMl += dose;
      const consumed = dose * this.titer * 1000.0;
      this.cellWaterUg = Math.max(0.0, this.cellWaterUg - consumed + (this.ambientDrift / 60.0) * dt);
      this.updatePotential();
      this.twin.dosingActive = true;
      this.sfx.stepperStep();

      if (this.potentialMv <= this.stopPotential) {
        this.holdTimerS += dt;
        if (this.holdTimerS >= 5.0) {
          this.state = 'COMPLETE';
          this.twin.dosingActive = false;
          this.sfx.endpointChime();
          this.recordGLPBatch();
        }
      } else {
        this.holdTimerS = 0.0;
      }
    }

    // Telemetry Sync
    this.syncTelemetry();
  }

  updatePotential() {
    const uMin = 45.0, uMax = 590.0, km = 2.0;
    if (this.cellWaterUg <= 0.05) {
      this.potentialMv = uMin;
    } else {
      const r = this.cellWaterUg / (this.cellWaterUg + km);
      this.potentialMv = uMin + (uMax - uMin) * r;
    }
  }

  syncTelemetry() {
    const grossWaterMg = this.volumeDosedMl * this.titer;
    const netWaterMg = Math.max(0.0, grossWaterMg - (this.ambientDrift * (this.elapsedTimeS / 60.0)) / 1000.0);
    const pct = (netWaterMg / (this.currentSample.mass_g * 1000.0)) * 100.0;
    const ppm = pct * 10000.0;

    // Update 3D LCD display state
    this.twin.displayState.state = this.state;
    this.twin.displayState.potential_mv = this.potentialMv;
    this.twin.displayState.volume_dosed_ml = this.volumeDosedMl;
    this.twin.displayState.water_content_pct = pct;
    this.twin.displayState.cell_water_ug = this.cellWaterUg;
    this.twin.renderLCD();

    // Update HTML readouts
    const elPot = document.getElementById('readout-potential');
    if (elPot) elPot.textContent = `${this.potentialMv.toFixed(0)} mV`;

    const elVol = document.getElementById('readout-volume');
    if (elVol) elVol.textContent = `${this.volumeDosedMl.toFixed(4)} mL`;

    const elWater = document.getElementById('readout-water');
    if (elWater) elWater.textContent = `${pct.toFixed(3)} %`;

    const elPpm = document.getElementById('readout-ppm');
    if (elPpm) elPpm.textContent = `${ppm.toFixed(1)} ppm · Drift: ${this.ambientDrift.toFixed(1)} µg/min`;

    if (this.statusPill) {
      this.statusPill.textContent = this.state;
      if (this.state === 'READY' || this.state === 'COMPLETE') {
        this.statusPill.className = 'pill run';
      } else if (this.state === 'TITRATING' || this.state === 'PRE_TITR') {
        this.statusPill.className = 'pill scan';
      } else {
        this.statusPill.className = 'pill open';
      }
    }
  }

  recordGLPBatch() {
    const grossWaterMg = this.volumeDosedMl * this.titer;
    const netWaterMg = Math.max(0.0, grossWaterMg - (this.ambientDrift * (this.elapsedTimeS / 60.0)) / 1000.0);
    const pct = (netWaterMg / (this.currentSample.mass_g * 1000.0)) * 100.0;

    const record = {
      time: new Date().toLocaleTimeString(),
      sample: this.currentSample.name,
      mass: `${this.currentSample.mass_g.toFixed(4)} g`,
      vol: `${this.volumeDosedMl.toFixed(4)} mL`,
      pct: `${pct.toFixed(3)} %`
    };
    this.glpRecords.unshift(record);

    const tbody = document.getElementById('glp-tbody');
    if (tbody) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${record.time}</td>
        <td>${record.sample}</td>
        <td>${record.mass}</td>
        <td>${record.vol}</td>
        <td style="color: var(--green); font-weight: 700;">${record.pct}</td>
      `;
      tbody.prepend(tr);
    }
    this.logGLP(`COMPLETE: Equivalence point recognized. Result: ${pct.toFixed(3)}% H2O (${record.vol} titrant consumed).`);
  }

  logGLP(msg) {
    console.log(`[GLP-LOG] ${msg}`);
  }

  exportCSV() {
    if (this.glpRecords.length === 0) {
      alert('No GLP batch records recorded yet.');
      return;
    }
    let csv = 'Timestamp,Sample Name,Sample Mass (g),Titrant Consumed (mL),Water Content (%)\n';
    this.glpRecords.forEach(r => {
      csv += `"${r.time}","${r.sample}","${r.mass}","${r.vol}","${r.pct}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Metrohm_901_GLP_Report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.sfx.beep(1200, 0.08);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new KarlFischerApp();
});
