/**
 * SREdesigns FTIR-7000x Fourier-Transform Infrared Spectrometer Web Application
 * Client Runtime with Three.js, Multi-Angle Camera Presets, Capacitive Touchscreen,
 * Physical Tactile Keycaps, Part Explorer, Audio Synthesis, and GLP Audit Logging.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FTIR3D } from './ftir3d.js?v=20261017-v7';
import { initChemMateTheme } from '../../../lab_viewer/shared/chemmate_theme_manager.js';

// Chemical Analyte Profiles
const SAMPLES = {
  isopropanol: {
    id: 'isopropanol',
    name: 'Isopropanol (IPA, 99.9%)',
    type: 'Liquid',
    desc: 'Secondary alcohol with intense broad H-bonded O-H stretch at 3350 cm⁻¹ and gem-dimethyl doublet (1381 & 1370 cm⁻¹).',
    bands: 'O-H (3350 cm⁻¹), C-H (2970 cm⁻¹), C-O (1129 cm⁻¹)',
    requiresClamp: false,
    defaultPeakWn: 3350
  },
  acetone: {
    id: 'acetone',
    name: 'Acetone (HPLC Grade)',
    type: 'Liquid',
    desc: 'Diagnostic aliphatic ketone characterized by extremely strong carbonyl C=O stretch at 1715 cm⁻¹.',
    bands: 'C=O (1715 cm⁻¹), C-H (2925 cm⁻¹), C-C (1222 cm⁻¹)',
    requiresClamp: false,
    defaultPeakWn: 1715
  },
  polystyrene: {
    id: 'polystyrene',
    name: 'Polystyrene Film (NIST SRM 1921b)',
    type: 'Solid Film',
    desc: 'Standard infrared calibration reference. Requires mechanical pressure clamp against diamond to optically couple with evanescent wave.',
    bands: 'Arom C-H (3026 cm⁻¹), Ring (1601 & 1492 cm⁻¹), Out-of-plane (698 cm⁻¹)',
    requiresClamp: true,
    defaultPeakWn: 1601
  },
  toluene: {
    id: 'toluene',
    name: 'Toluene (Anhydrous)',
    type: 'Liquid',
    desc: 'Monosubstituted aromatic hydrocarbon exhibiting sharp ring vibrational quadrant stretches and out-of-plane deformation.',
    bands: 'Arom C-H (3028 cm⁻¹), C=C Ring (1496 cm⁻¹), Def (729 & 694 cm⁻¹)',
    requiresClamp: false,
    defaultPeakWn: 1496
  },
  benzoic_acid: {
    id: 'benzoic_acid',
    name: 'Benzoic Acid Crystals',
    type: 'Solid Powder',
    desc: 'Aromatic carboxylic acid with broad hydrogen-bonded dimer Fermi resonance envelope (3100-2500 cm⁻¹) and conjugated carbonyl at 1686 cm⁻¹.',
    bands: 'O-H Dimer (2820 & 2650 cm⁻¹), C=O (1686 cm⁻¹), C-O (1292 cm⁻¹)',
    requiresClamp: true,
    defaultPeakWn: 1686
  }
};

const PART_CATALOG = [
  { id: 'Assembly_Motherboard_DSP', label: 'TI C6748 32-Bit DSP Motherboard', cat: 'Electronics' },
  { id: 'IC_DSP_Processor', label: 'TI TMS320C6748 Floating-Point DSP + Heatsink', cat: 'Electronics' },
  { id: 'IC_ADC_24Bit', label: 'Analog Devices AD7799 24-Bit Sigma-Delta ADC', cat: 'Electronics' },
  { id: 'IC_Flash_eMMC', label: '8 GB Non-Volatile eMMC Flash Memory', cat: 'Electronics' },
  { id: 'Module_HeNe_Inverter', label: 'HeNe Laser High-Voltage Ballast Inverter', cat: 'Electronics' },
  { id: 'Driver_VoiceCoil_Servo', label: 'Modular Daughterboard: Voice-Coil Servo', cat: 'Electronics' },
  { id: 'Driver_IRSource_Regulator', label: 'Modular Daughterboard: 1200°C IR Regulator', cat: 'Electronics' },
  { id: 'Driver_Purge_Telemetry', label: 'Modular Daughterboard: Load-Cell & N₂ Purge', cat: 'Electronics' },
  { id: 'Battery_RTC_CR2032', label: 'CR2032 Lithium Coin Cell Backup Battery', cat: 'Electronics' },
  { id: 'PCB_LCD_Controller', label: '7-Inch Touchscreen LCD Controller Sub-Board', cat: 'Electronics' },
  { id: 'Subsystem_PowerSupply_SMPS', label: 'Switch-Mode Power Supply (SMPS) Assembly', cat: 'Electronics' },
  { id: 'Transformer_SMPS_Toroid', label: 'Copper Toroidal Power Transformer', cat: 'Electronics' },
  { id: 'TerminalBlock_SMPS_Mains', label: '6-Position Barrier Terminal Strip & Spade Crimps', cat: 'Electronics' },
  { id: 'Fan_SMPS_Cooling', label: '50mm SMPS Brushless Side Fan & Exhaust Duct', cat: 'Electronics' },
  { id: 'Fan_80mm_Exhaust', label: '80mm Rear Convective Exhaust Fan & Bracket', cat: 'Electronics' },
  { id: 'Subsystem_Michelson_Interferometer', label: 'Michelson Interferometer & Optical Breadboard', cat: 'Optics' },
  { id: 'Beam_IR_Modulated', label: 'Modulated Mid-IR Optical Beam Path', cat: 'Optics' },
  { id: 'Beam_HeNe_632nm', label: '632.8 nm HeNe Laser Reference Beam', cat: 'Optics' },
  { id: 'Subsystem_Diamond_ATR_Station', label: '316L Stainless Diamond ATR Sampling Deck', cat: 'ATR' },
  { id: 'Diamond_ATR_Crystal', label: 'Monolithic Type IIa Synthetic Diamond Prism', cat: 'ATR' },
  { id: 'Tower_Clamp_Swivel', label: '180° Swiveling Slip-Clutch Pressure Tower', cat: 'ATR' },
  { id: 'Assembly_ATR_TransferOptics', label: 'Under-Deck 45° Gold ZnSe Transfer Mirrors', cat: 'ATR' },
  { id: 'Sensor_LoadCell_ATR', label: 'Strain-Gauge Load-Cell Force Transducer', cat: 'ATR' },
  { id: 'FPC_TouchscreenRibbon_Kapton', label: '30-Pin Kapton FPC Touchscreen Ribbon Cable', cat: 'Wiring' },
  { id: 'Cable_DTGS_Detector_RG174', label: 'Shielded RG-174 Coax with 50Ω Gold SMA Plugs', cat: 'Wiring' },
  { id: 'Cable_HeNe_HighVoltage_Anode', label: 'Silicone HV Anode Lead & Red Alden Connector', cat: 'Wiring' },
  { id: 'Harness_DC_24V', label: 'SMPS to Motherboard Regulated DC Bus Harness', cat: 'Wiring' },
  { id: 'Harness_DB9_RS232', label: 'Rear DB-9 RS-232 / USB / RJ45 Data Harnesses', cat: 'Wiring' },
  { id: 'UI_LCD', label: '7-Inch Capacitive Touchscreen Display (UI_LCD)', cat: 'Chassis' },
  { id: 'Chassis_SlopedConsole', label: '15.5° Ergonomic Sloped Operator Console Wedge', cat: 'Chassis' },
  { id: 'Badge_SREdesigns', label: 'Official SREdesigns Jewel-Enamel Brand Badge', cat: 'Chassis' },
  { id: 'Assembly_PowerContinuity', label: 'Benchtop 120V AC Duplex Pedestal & NEMA Plug', cat: 'Chassis' },
];

class FTIRApp {
  constructor() {
    this.container = document.getElementById('viewport3d');
    this.hudTooltip = document.getElementById('hud-tooltip');
    this.glpConsole = document.getElementById('glp-log-console');

    // Raycaster & Pointer (Mandatory for 3D touchscreen & button interaction)
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    // SFX
    this.sfx = new window.SpectroAudio();

    // Twin Core
    this.twin = new FTIR3D(this.container);

    // Orbit Controls
    this.controls = new OrbitControls(this.twin.camera, this.twin.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 1.15, -0.2);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
    this.controls.minDistance = 0.9;
    this.controls.maxDistance = 18.0;

    // View & Part Explorer State
    this.autoRotate = false;
    this.orbitSpeed = 1.0;
    this.selectedPartId = null;
    this.isolatedPartId = null;

    // Touch Event Tracking (iOS Safari & WebKit tap reliability)
    this.touchStartPos = null;
    this.touchStartTime = 0;
    this.lastHandledTime = 0;

    this.initUI();
    this.initPartExplorer();
    this.initSchematicsModal();
    this.setupTouchAndPointer();
    this.setupViewPresets();

    // ChemMate Theme Controller (Modern, Retro, Night)
    this.themeManager = initChemMateTheme({
      twinName: 'FTIRTwin',
      scene: this.twin.scene,
      ambLight: this.twin.ambientLight,
      dirLight: this.twin.keyLight,
      onThemeChange: () => {
        this.twin.renderLCD();
      },
    });

    this.logGLP('SYSTEM: SRE FTIR-7000x Digital Twin Initialized. 100-240V AC continuity established.');
  }

  initUI() {
    this.statusPill = document.getElementById('status-pill');
    this.statusDetail = document.getElementById('status-detail');

    const btnBg = document.getElementById('btn-zero');
    if (btnBg) {
      btnBg.addEventListener('click', () => {
        this.twin.triggerKeycapPress('Btn_Background');
        this.collectBackground();
      });
    }

    const btnScan = document.getElementById('btn-scan');
    if (btnScan) {
      btnScan.addEventListener('click', () => {
        this.twin.triggerKeycapPress('Btn_Scan');
        this.collectSample();
      });
    }

    const btnMode = document.getElementById('btn-mode');
    if (btnMode) {
      btnMode.addEventListener('click', () => {
        this.twin.triggerKeycapPress('Btn_Mode');
        this.cycleMode();
      });
    }

    const btnSwivel = document.getElementById('btn-cell-next');
    if (btnSwivel) {
      btnSwivel.addEventListener('click', () => {
        this.twin.triggerKeycapPress('Btn_Tower');
        this.toggleTower();
      });
    }

    const btnChamber = document.getElementById('btn-chamber');
    if (btnChamber) {
      btnChamber.addEventListener('click', () => this.cyclePressure());
    }

    const btnPower = document.getElementById('btn-power');
    if (btnPower) {
      btnPower.addEventListener('click', () => {
        this.twin.triggerKeycapPress('Btn_Power');
        this.togglePower();
      });
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
        if (this.twin.ambientLight) this.twin.ambientLight.intensity = 1.05 * val;
        if (this.twin.keyLight) this.twin.keyLight.intensity = 2.2 * val;
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

    // Panel collapse toggles (clicking header or button)
    document.querySelectorAll('.panel-collapse-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const panelId = btn.getAttribute('data-collapse');
        const panel = document.getElementById(`panel-${panelId}`);
        if (panel) {
          const isCollapsed = panel.classList.toggle('collapsed');
          btn.textContent = isCollapsed ? '▸' : '▾';
          btn.setAttribute('aria-expanded', !isCollapsed);
          setTimeout(() => this.twin.onWindowResize(), 260);
        }
      });
    });

    document.querySelectorAll('.panel-collapsible .panel-header').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const panel = hdr.closest('.panel-collapsible');
        if (panel && panel.classList.contains('collapsed')) {
          const btn = hdr.querySelector('.panel-collapse-btn');
          if (btn) btn.click();
        }
      });
    });

    this.selectSample('isopropanol');
  }

  initPartExplorer() {
    this.partListEl = document.getElementById('part-list');
    this.partFilterEl = document.getElementById('part-filter');
    this.partSearchEl = document.getElementById('part-search');
    this.btnIsolate = document.getElementById('btn-isolate');
    this.btnShowAll = document.getElementById('btn-show-all');

    const renderList = () => {
      if (!this.partListEl) return;
      const cat = this.partFilterEl ? this.partFilterEl.value : 'all';
      const q = (this.partSearchEl ? this.partSearchEl.value : '').trim().toLowerCase();

      const filtered = PART_CATALOG.filter(p => {
        if (cat !== 'all' && p.cat !== cat) return false;
        if (q && !p.label.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) return false;
        return true;
      });

      this.partListEl.innerHTML = filtered.map(p => `
        <li class="part-item ${this.selectedPartId === p.id ? 'selected' : ''}" data-part="${p.id}">
          <span>${p.label}</span>
          <span class="part-cat">${p.cat}</span>
        </li>
      `).join('');

      this.partListEl.querySelectorAll('.part-item').forEach(li => {
        li.addEventListener('click', () => {
          const partId = li.getAttribute('data-part');
          this.selectPart(partId);
          renderList();
        });
      });
    };

    if (this.partFilterEl) this.partFilterEl.addEventListener('change', renderList);
    if (this.partSearchEl) this.partSearchEl.addEventListener('input', renderList);

    if (this.btnIsolate) {
      this.btnIsolate.addEventListener('click', () => {
        if (!this.selectedPartId) return;
        this.isolatedPartId = (this.isolatedPartId === this.selectedPartId) ? null : this.selectedPartId;
        this.applyPartIsolation();
      });
    }

    if (this.btnShowAll) {
      this.btnShowAll.addEventListener('click', () => {
        this.isolatedPartId = null;
        this.selectedPartId = null;
        if (this.btnIsolate) {
          this.btnIsolate.disabled = true;
          this.btnIsolate.textContent = 'Isolate Part';
        }
        this.applyPartIsolation();
        renderList();
      });
    }

    renderList();
  }

  selectPart(partId) {
    this.selectedPartId = partId;
    if (this.btnIsolate) {
      this.btnIsolate.disabled = !partId;
    }

    // Automatically enable Optics View when inspecting internal Optics/Electronics/Wiring parts
    const entry = PART_CATALOG.find(p => p.id === partId);
    if (entry && (entry.cat === 'Electronics' || entry.cat === 'Optics' || entry.cat === 'Wiring')) {
      this.twin.setOpticsView(true);
      const btnOptics = document.getElementById('btn-optics-view');
      if (btnOptics) btnOptics.classList.add('active');
    }

    const obj = this.twin.scene.getObjectByName(partId);
    if (obj) {
      const box = new THREE.Box3().setFromObject(obj);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      const dist = Math.max(1.8, Math.max(size.x, size.y, size.z) * 2.4);
      const offset = new THREE.Vector3(-0.6, 0.75, -0.85).normalize().multiplyScalar(dist);
      this.animateCamera(center.clone().add(offset), center);
      this.sfx.click();
      this.logGLP(`INSPECTOR: Focused on component [${partId}]`);
    }
  }

  applyPartIsolation() {
    if (!this.isolatedPartId) {
      this.twin.rootGroup.traverse(node => {
        if (node.isMesh) node.visible = true;
      });
      if (this.twin.opticsRoof) {
        this.twin.opticsRoof.visible = !this.twin.xRayMode;
      }
      if (this.btnIsolate) this.btnIsolate.textContent = 'Isolate Part';
      return;
    }

    const targetObj = this.twin.scene.getObjectByName(this.isolatedPartId);
    if (!targetObj) return;

    const keepSet = new Set();
    targetObj.traverse(n => keepSet.add(n));
    let curr = targetObj.parent;
    while (curr) {
      keepSet.add(curr);
      curr = curr.parent;
    }

    this.twin.rootGroup.traverse(node => {
      if (node.isMesh) {
        let insideTarget = false;
        let p = node;
        while (p) {
          if (p === targetObj) {
            insideTarget = true;
            break;
          }
          p = p.parent;
        }
        node.visible = insideTarget;
      }
    });

    if (this.btnIsolate) this.btnIsolate.textContent = 'Un-Isolate';
  }

  initSchematicsModal() {
    const modal = document.getElementById('schematic-modal');
    const btnOpen = document.getElementById('btn-schematics');
    const btnClose = document.getElementById('btn-schematic-close');
    if (!modal) return;

    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        modal.style.display = 'flex';
        this.sfx.click();
      });
    }
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        modal.style.display = 'none';
        this.sfx.click();
      });
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    modal.querySelectorAll('.schematic-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');
        modal.querySelectorAll('.schematic-tab').forEach(t => t.classList.remove('active'));
        modal.querySelectorAll('.schematic-pane').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const pane = document.getElementById(targetId);
        if (pane) pane.classList.add('active');
        this.sfx.click();
      });
    });
  }

  setupViewPresets() {
    const presets = {
      'btn-cam-iso': { pos: [5.6, 4.2, -7.2], target: [0.0, 1.15, -0.2] },
      'btn-cam-front': { pos: [0.0, 1.6, -8.2], target: [0.0, 1.15, -0.2] },
      'btn-cam-console': { pos: [-1.09, 2.96, -3.32], target: [-1.09, 1.56, -1.16] },
      'btn-cam-side': { pos: [9.4, 2.0, 0.0], target: [0.0, 1.05, 0.0] },
      'btn-cam-top': { pos: [0.0, 11.2, -0.21], target: [0.0, 1.0, -0.2] },
      'btn-cam-rear': { pos: [0.0, 2.3, 8.2], target: [0.0, 1.00, 0.4] },
    };

    Object.entries(presets).forEach(([btnId, cam]) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#btn-cam-iso, #btn-cam-front, #btn-cam-console, #btn-cam-side, #btn-cam-top, #btn-cam-rear').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.animateCamera(new THREE.Vector3(...cam.pos), new THREE.Vector3(...cam.target));
          this.sfx.click();
        });
      }
    });

    const btnExplode = document.getElementById('btn-explode');
    if (btnExplode) {
      btnExplode.addEventListener('click', () => {
        this.toggleExploded();
      });
    }

    const btnOptics = document.getElementById('btn-optics-view');
    if (btnOptics) {
      btnOptics.addEventListener('click', () => {
        this.toggleOpticsView();
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

  setExploded(isExp, animate = true) {
    this.isExploded = Boolean(isExp);
    const btnExplode = document.getElementById('btn-explode');
    if (btnExplode) btnExplode.classList.toggle('active', this.isExploded);
    this.twin.setExploded(this.isExploded ? 1.0 : 0.0);
    if (!animate) {
      if (this.twin.atrStationGroup) this.twin.atrStationGroup.position.y = 0.90 + (this.isExploded ? 0.85 : 0.0);
      if (this.twin.chassisShellGroup) this.twin.chassisShellGroup.position.y = this.isExploded ? 2.15 : 0.0;
    } else if (this.isExploded) {
      this.animateCamera(new THREE.Vector3(6.6, 5.4, -8.4), new THREE.Vector3(0.0, 1.75, -0.1));
    }
    this.sfx.shutter();
    this.logGLP(`MECHANICS: Exploded view ${this.isExploded ? 'ACTIVATED (Two-tier +850mm / +2150mm elevation)' : 'COLLAPSED'}`);
  }

  toggleExploded() {
    this.setExploded(!this.isExploded);
  }

  setOpticsView(isOpt, animate = true) {
    const active = Boolean(isOpt);
    this.twin.setOpticsView(active);
    const btnOptics = document.getElementById('btn-optics-view');
    if (btnOptics) btnOptics.classList.toggle('active', active);
    if (animate && active) {
      this.animateCamera(new THREE.Vector3(-4.0, 4.9, -4.8), new THREE.Vector3(-0.1, 0.85, 0.0));
    }
    this.sfx.click();
    this.logGLP(`OPTICS VIEW: Internal optics, DSP motherboard & SMPS X-Ray mode ${active ? 'ON' : 'OFF'}`);
  }

  toggleOpticsView() {
    this.setOpticsView(!this.twin.opticsViewActive);
  }

  setCameraImmediate(pos, target) {
    if (this.animCamReqId) {
      cancelAnimationFrame(this.animCamReqId);
      this.animCamReqId = null;
    }
    this.twin.camera.position.set(pos[0], pos[1], pos[2]);
    this.controls.target.set(target[0], target[1], target[2]);
    this.controls.update();
  }

  animateCamera(targetPos, targetLookAt) {
    if (this.animCamReqId) {
      cancelAnimationFrame(this.animCamReqId);
      this.animCamReqId = null;
    }
    const startPos = this.twin.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startTime = performance.now();
    const duration = 300;

    const step = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      const ease = 0.5 - Math.cos(t * Math.PI) / 2;
      this.twin.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.lerpVectors(startTarget, targetLookAt, ease);
      this.controls.update();
      if (t < 1) {
        this.animCamReqId = requestAnimationFrame(step);
      } else {
        this.animCamReqId = null;
      }
    };
    step();
  }

  resolveActionableHit(hits) {
    for (const h of hits) {
      let curr = h.object;
      while (curr) {
        if (curr.userData && (curr.userData.action || curr.userData.id)) {
          return { hit: h, target: curr, data: curr.userData };
        }
        curr = curr.parent;
      }
    }
    return null;
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
        this.lastHandledTime = performance.now();
        this.handleActionAtPoint(touch.clientX, touch.clientY);
      }
      this.touchStartPos = null;
    });

    // Desktop Click
    dom.addEventListener('click', (e) => {
      if (performance.now() - this.lastHandledTime < 350) return;
      this.handleActionAtPoint(e.clientX, e.clientY);
    });

    // Hover Tooltips
    dom.addEventListener('pointermove', (e) => {
      const rect = dom.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.twin.camera);
      const hits = this.raycaster.intersectObjects(this.twin.actionableMeshes, true);
      const resolved = this.resolveActionableHit(hits);

      if (resolved) {
        dom.style.cursor = 'pointer';
        if (this.hudTooltip && resolved.data.tooltip) {
          this.hudTooltip.style.display = 'block';
          this.hudTooltip.style.left = `${e.clientX}px`;
          this.hudTooltip.style.top = `${e.clientY - 12}px`;
          this.hudTooltip.textContent = resolved.data.tooltip;
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
    const resolved = this.resolveActionableHit(hits);
    if (!resolved) return;

    const { hit, target, data } = resolved;
    const action = data.action || data.id;

    // 1. Capacitive Touchscreen (`UI_LCD`)
    if (data.name === 'UI_LCD' || action === 'tap_screen') {
      this.handleTouchscreenHit(hit);
      return;
    }

    // 2. Physical Tactile Keycaps (`Btn_Power`, `Btn_Background`, `Btn_Scan`, `Btn_Mode`, `Btn_Tower`)
    if (data.id && data.id.startsWith('Btn_')) {
      this.twin.triggerKeycapPress(data.id);
    }

    switch (action) {
      case 'Btn_Power':
      case 'btn_pwr':
        this.togglePower();
        break;
      case 'Btn_Background':
      case 'btn_bg':
        this.collectBackground();
        break;
      case 'Btn_Scan':
      case 'btn_scan':
        this.collectSample();
        break;
      case 'Btn_Mode':
      case 'btn_mode':
        this.cycleMode();
        break;
      case 'Btn_Tower':
      case 'btn_tower':
      case 'toggle_tower':
      case 'toggle_swivel':
        this.toggleTower();
        break;
      case 'cycle_pressure':
      case 'toggle_pressure':
        this.cyclePressure();
        break;
      case 'cycle_sample':
      case 'toggle_sample':
        this.cycleNextSample();
        break;
      case 'toggle_plug':
        this.togglePowerCord();
        break;
      case 'toggle_switch':
        if (target && target.userData && typeof target.userData.toggle === 'function') {
          target.userData.toggle();
          this.sfx.click();
          this.logGLP(`POWER: Rear rocker switch ${this.twin.switchOn ? 'ON' : 'OFF'}`);
          this.updateStatus();
        } else {
          this.togglePowerSwitch();
        }
        break;
      default:
        this.sfx.click();
    }
  }

  handleTouchscreenHit(hit) {
    if (!hit || !hit.uv) return;

    // Because UI_LCD has flipY = false and calibrated UVs, hit.uv maps 1:1 to 1024x600 canvas pixels!
    const touchX = hit.uv.x * 1024;
    const touchY = hit.uv.y * 600;

    // Spawn expanding cyan capacitive touch ripple
    this.twin.touchRipples.push({
      x: touchX,
      y: touchY,
      birth: performance.now()
    });
    this.twin.renderLCD();

    // If unpowered, only the top-right [POWER] softkey wakes the instrument from standby
    if (!this.twin.hasPower) {
      if (touchX >= 840 && touchY >= 60 && touchY <= 140 && this.twin.isPluggedIn) {
        this.togglePowerSwitch();
      } else {
        this.sfx.click();
      }
      return;
    }

    // 1. Right-Column Capacitive Softkeys (X: 845 - 1015)
    if (touchX >= 845 && touchX <= 1015) {
      if (touchY >= 64 && touchY <= 136) {
        this.twin.triggerKeycapPress('Btn_Power');
        this.togglePower();
        return;
      }
      if (touchY >= 137 && touchY <= 209) {
        this.twin.triggerKeycapPress('Btn_Background');
        this.collectBackground();
        return;
      }
      if (touchY >= 210 && touchY <= 282) {
        this.twin.triggerKeycapPress('Btn_Scan');
        this.collectSample();
        return;
      }
      if (touchY >= 283 && touchY <= 355) {
        this.twin.triggerKeycapPress('Btn_Mode');
        this.cycleMode();
        return;
      }
      if (touchY >= 356 && touchY <= 428) {
        this.twin.triggerKeycapPress('Btn_Tower');
        this.toggleTower();
        return;
      }
      if (touchY >= 429 && touchY <= 505) {
        this.cyclePressure();
        return;
      }
    }

    // 2. Bottom Analyte Selector Pills (Y: 508 - 590, X: 60 - 840)
    if (touchY >= 508 && touchY <= 590 && touchX >= 60 && touchX <= 840) {
      const pillIds = ['isopropanol', 'acetone', 'polystyrene', 'toluene', 'benzoic_acid'];
      const idx = Math.min(4, Math.max(0, Math.floor(((touchX - 65) / 770) * 5)));
      const chosenId = pillIds[idx];
      if (chosenId) {
        this.selectSample(chosenId);
        return;
      }
    }

    // 3. Interactive Spectrum Plot Area (X: 65 - 835, Y: 68 - 468)
    if (touchX >= 65 && touchX <= 835 && touchY >= 68 && touchY <= 468) {
      const frac = Math.max(0, Math.min(1, (touchX - 65) / 770));
      const wn = Math.round(4000 - frac * 3600);
      this.twin.cursorWn = wn;
      this.twin.renderLCD();
      this.sfx.beep(1040, 0.04);
      this.logGLP(`TOUCHSCREEN CURSOR: Selected wavenumber ν̃ = ${wn} cm⁻¹`);
      return;
    }

    this.sfx.beep(920, 0.04);
  }

  // --- Analytical Operations ---
  togglePowerCord() {
    this.twin.togglePowerPlug();
    this.sfx.relay();
    this.logGLP(`CONTINUITY: Power cord ${this.twin.isPluggedIn ? 'INSERTED into 120V duplex bench receptacle' : 'PULLED from receptacle (0V AC)'}`);
    this.updateStatus();
  }

  togglePowerSwitch() {
    const newState = !this.twin.switchOn;
    if (this.twin.rockerSwitch && this.twin.rockerSwitch.userData && typeof this.twin.rockerSwitch.userData.toggle === 'function') {
      if (this.twin.rockerSwitch.userData.isOn !== newState) {
        this.twin.rockerSwitch.userData.toggle();
      }
    } else {
      this.twin.setPowerSwitch(newState);
    }
    this.sfx.click();
    this.logGLP(`POWER: System power ${newState ? 'ON (Active)' : 'STANDBY (Off)'}`);
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
    const pressures = [40, 80, 100, 0];
    const currIdx = pressures.indexOf(this.twin.clampPressurePct);
    const nextPressure = pressures[(currIdx + 1) % pressures.length];
    this.twin.setPressure(nextPressure);
    this.sfx.ratchet();
    this.logGLP(`ATR CLAMP: Slip-clutch pressure set to ${nextPressure}% (${(nextPressure * 1.5).toFixed(0)} N)`);
  }

  selectSample(sampleId) {
    const smp = SAMPLES[sampleId] || SAMPLES.isopropanol;
    this.twin.cursorWn = smp.defaultPeakWn || 3350;
    this.twin.setSample(smp.id);
    if (this.sampleSelect) this.sampleSelect.value = smp.id;

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
    this.twin.cycleViewMode();
    this.sfx.beep(880, 0.05);
    this.logGLP(`VIEW MODE: Switched display to ${this.twin.viewMode === 'transmittance' ? '% Transmittance (%T)' : 'Absorbance (Abs)'}`);
  }

  collectBackground() {
    if (!this.twin.hasPower) return;
    this.sfx.interferometerSweep();
    this.twin.startScan(() => {
      this.sfx.beep(1200, 0.1);
      this.logGLP('SCAN: Background I0(ν̃) recorded. Baseline normalized to 100.0% T.');
    });
    this.logGLP('SCAN: Collecting 16 co-added background scans on clean diamond...');
  }

  collectSample() {
    if (!this.twin.hasPower) return;

    const smp = SAMPLES[this.twin.activeSampleId] || SAMPLES.isopropanol;
    if (smp.requiresClamp && this.twin.clampPressurePct < 20) {
      this.sfx.beep(400, 0.2, 'sawtooth');
      this.logGLP(`WARNING: Solid sample [${smp.name}] requires mechanical clamp pressure for evanescent wave coupling!`);
    }

    this.sfx.interferometerSweep();
    this.logGLP(`SCAN: Initiating interferometer scan of ${smp.name} (4000 to 400 cm⁻¹, res=4 cm⁻¹)...`);
    this.twin.startScan(() => {
      this.sfx.beep(1400, 0.12);
      this.logGLP(`SCAN COMPLETE: Radix-2 FFT finished for ${smp.name}. Diagnostic peaks identified.`);
    });
  }

  updateStatus() {
    if (!this.statusPill || !this.statusDetail) return;
    if (!this.twin.hasPower) {
      this.statusPill.textContent = 'UNPOWERED';
      this.statusPill.className = 'pill fault';
      this.statusDetail.textContent = 'Check bench receptacle power cord and rear switch';
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
  window.app = window.ftirApp;
});
