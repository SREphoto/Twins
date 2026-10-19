/**
 * Application Entry & Client Runtime: Agilent 708-DS USP Tablet Dissolution Apparatus
 * Dual-Truth Simulation Synchronization, WebGL Event Handling, & USP <711> GLP Reporting
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Dissolution3D } from './dissolution3d.js';
import { DissolutionSfx } from './sfx.js';

const PART_CATALOG = [
  { id: 'Body_Chassis', label: 'Main Structural Base Pan Casting (622x590x140mm)', cat: 'Chassis' },
  { id: 'Foot_Leveling_FL', label: 'Threaded Leveling Foot Front-Left (Y=0 datum)', cat: 'Chassis' },
  { id: 'Foot_Leveling_FR', label: 'Threaded Leveling Foot Front-Right (Y=0 datum)', cat: 'Chassis' },
  { id: 'Foot_Leveling_RL', label: 'Threaded Leveling Foot Rear-Left (Y=0 datum)', cat: 'Chassis' },
  { id: 'Foot_Leveling_RR', label: 'Threaded Leveling Foot Rear-Right (Y=0 datum)', cat: 'Chassis' },
  { id: 'Assembly_Elevator', label: 'Dual Ground Guide Shafts & Acme Ball Lead Screw', cat: 'Kinematics' },
  { id: 'Pivot_DriveHead', label: 'Motorized Vertical Drive Head Assembly (0-311mm)', cat: 'Kinematics' },
  { id: 'UI_LCD', label: 'Dynamic Firmware Color Graphic LCD Quad', cat: 'Electronics' },
  { id: 'Glass_LCDLens', label: 'Anti-Reflective Optical Protective Display Window', cat: 'Optical' },
  { id: 'Btn_ElevUp', label: 'Tactile Pushbutton: ELEVATOR HEAD UP (▲)', cat: 'Controls' },
  { id: 'Btn_ElevDown', label: 'Tactile Pushbutton: ELEVATOR HEAD DOWN (▼)', cat: 'Controls' },
  { id: 'Btn_Start', label: 'Tactile Pushbutton: START SPINDLE STIRRING (▶)', cat: 'Controls' },
  { id: 'Btn_Stop', label: 'Tactile Pushbutton: STOP SPINDLE DRIVE (⏹)', cat: 'Controls' },
  { id: 'Switch_Rocker', label: 'Illuminated Rear AC Rocker Switch DPST', cat: 'Power' },
  { id: 'Badge_SREdesigns', label: 'Official SREdesigns Brand Certification Badge', cat: 'Chassis' },
  { id: 'Bath_Chamber', label: 'Seamless Molded Optical Acrylic Water Bath (5.8L)', cat: 'Water Bath' },
  { id: 'Bath_Water', label: 'Thermoregulated Heated Water Volume (37.0°C)', cat: 'Water Bath' },
  { id: 'TruCenter_Ring_01', label: 'TruCenter Vessel Centering Collar Ring #1', cat: 'Centering' },
  { id: 'TruCenter_Ring_05', label: 'TruCenter Vessel Centering Collar Ring #5', cat: 'Centering' },
  { id: 'Glass_Vessel_01', label: 'Precision 1000 mL Borosilicate Glass Vessel #1', cat: 'Labware' },
  { id: 'Glass_Vessel_05', label: 'Precision 1000 mL Borosilicate Glass Vessel #5', cat: 'Labware' },
  { id: 'Liquid_Medium_01', label: '900 mL Deaerated Dissolution Medium with Vortex #1', cat: 'Fluidics' },
  { id: 'Tablet_Solid_01', label: 'Prednisone 10mg USP Solid Dosage Form #1', cat: 'Dosage' },
  { id: 'Spindle_Paddle_01', label: 'Rotating 316SS Shaft & Apparatus 2 Paddle #1', cat: 'Spindles' },
  { id: 'Spindle_Paddle_05', label: 'Rotating 316SS Shaft & Apparatus 2 Paddle #5', cat: 'Spindles' },
  { id: 'Assembly_TimingBeltDrive', label: 'Synchronous Timing Belt Drive & 24V DC Stepper', cat: 'Internal' },
  { id: 'Part_HeaterCirculatorAutoTemp', label: 'AutoTemp 1150W External Heater / Circulator', cat: 'Thermoregulation' },
  { id: 'Hose_Circulator_Supply', label: 'Silicone Quick-Disconnect Supply Hose', cat: 'Fluidics' },
  { id: 'Power_Receptacle_Duplex', label: 'Cast Aluminum Bench Duplex Receptacle Box', cat: 'Power' },
  { id: 'Part_PowerPlugNEMA', label: 'Molded 3-Prong NEMA 5-15P AC Power Plug', cat: 'Power' },
  { id: 'Cable_ACPowerCord', label: 'Heavy-Duty 3-Conductor SJTOW Power Cord', cat: 'Power' }
];

class DissolutionApp {
  constructor() {
    this.container = document.getElementById('viewport3d');
    this.sfx = new DissolutionSfx();

    // 3D Procedural Engine
    this.twin = new Dissolution3D(this.container);
    window.__twin = this.twin;
    window.__app = this;

    // Orbit Controls
    this.controls = new OrbitControls(this.twin.camera, this.twin.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(-0.8, 3.8, 0.0);

    // Dual-Truth Physics Simulation State
    this.isPluggedIn = true;
    this.powerSwitchOn = true;
    this.state = 'STANDBY';

    // Kinematics
    this.headElevationMm = 0.0;
    this.targetElevationMm = 0.0;
    this.isElevating = false;

    // Thermoregulation
    this.bathTempC = 21.50;
    this.targetBathTempC = 37.00;
    this.heaterActive = false;

    // Spindles
    this.spindleRpm = 0.0;
    this.targetRpm = 50.0;
    this.spindlesSpinning = false;

    // Vessels & Noyes-Whitney ODE
    this.runTimerS = 0.0;
    this.vessels = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      tablet_name: 'Prednisone USP 10mg',
      tablet_mass_mg: 10.0,
      solubility_mg_ml: 0.312,
      k_rate: 0.0035,
      tablet_dropped: false,
      dissolved_pct: 0.0,
      conc_mg_ml: 0.0,
      tablet_radius_mm: 4.5
    }));

    this.glpRecords = [];
    this.lastTime = performance.now();

    this.initUI();
    this.initRaycasting();
    this.populatePartExplorer();
    this.populateVesselGrid();
    this.initSimLoop();

    this.logGLP('SYSTEM: Agilent 708-DS USP Dissolution Apparatus Digital Twin initialized. AC continuity established.');
  }

  initUI() {
    const setCam = (px, py, pz, tx, ty, tz) => {
      this.twin.camera.position.set(px, py, pz);
      this.controls.target.set(tx, ty, tz);
      this.controls.update();
    };

    // Camera preset buttons
    document.getElementById('btn-cam-iso')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-iso');
      setCam(8.5, 9.8, 14.5, -0.8, 3.8, 0.0);
    });

    document.getElementById('btn-cam-front')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-front');
      setCam(-0.8, 4.8, 13.5, -0.8, 4.2, 0.0);
    });

    document.getElementById('btn-cam-spindles')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-spindles');
      setCam(-0.8, 3.5, 7.5, -0.8, 2.8, 0.0);
    });

    document.getElementById('btn-cam-bath')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-bath');
      setCam(-0.8, 4.2, 6.8, -0.8, 2.2, 0.0);
    });

    document.getElementById('btn-cam-side')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-side');
      setCam(13.5, 4.8, 0.2, -0.8, 4.0, 0.0);
    });

    document.getElementById('btn-cam-top')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-top');
      setCam(0.0, 14.2, 3.2, 0.0, 2.2, 0.0);
    });

    document.getElementById('btn-cam-rear')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-rear');
      setCam(-0.8, 5.0, -13.0, -0.8, 3.8, 0.0);
    });

    // Exploded View Button
    const btnExplode = document.getElementById('btn-explode');
    btnExplode?.addEventListener('click', () => {
      const isExp = this.twin.toggleExploded();
      btnExplode.classList.toggle('active', isExp);
      this.sfx.playRelayThud();
      this.logGLP(`VIEW: Exploded view ${isExp ? 'engaged' : 'collapsed'}.`);
    });

    // Wireframe Button
    const btnWire = document.getElementById('btn-wireframe');
    let wire = false;
    btnWire?.addEventListener('click', () => {
      wire = !wire;
      btnWire.classList.toggle('active', wire);
      this.twin.setWireframe(wire);
      this.sfx.playSwitchSnap();
    });

    // Auto-rotate Button
    const btnAuto = document.getElementById('btn-autorotate');
    btnAuto?.addEventListener('click', () => {
      this.controls.autoRotate = !this.controls.autoRotate;
      btnAuto.classList.toggle('active', this.controls.autoRotate);
    });

    // Sliders
    const sOrbit = document.getElementById('slider-orbit');
    sOrbit?.addEventListener('input', e => {
      this.controls.autoRotateSpeed = parseFloat(e.target.value) * 2.0;
    });

    const sZoom = document.getElementById('slider-zoom');
    sZoom?.addEventListener('input', e => {
      this.twin.camera.fov = parseFloat(e.target.value);
      this.twin.camera.updateProjectionMatrix();
    });

    const sLight = document.getElementById('slider-light');
    sLight?.addEventListener('input', e => {
      this.twin.setLightIntensity(parseFloat(e.target.value));
    });

    // Mute Button
    const btnMute = document.getElementById('btn-mute');
    btnMute?.addEventListener('click', () => {
      const muted = this.sfx.toggleMute();
      btnMute.textContent = muted ? 'Unmute SFX' : 'Mute SFX';
      btnMute.classList.toggle('active', muted);
    });

    // AC Plug Continuity Toggle Button
    const btnPlug = document.getElementById('btn-plug');
    btnPlug?.addEventListener('click', () => {
      this.togglePlugContinuity();
    });

    // View Chooser (Modern, Retro, Night)
    document.getElementById('btn-view-modern')?.addEventListener('click', () => {
      document.body.className = '';
      this.setActiveViewBtn('btn-view-modern');
      this.twin.scene.background = new THREE.Color(0x0c1016);
    });

    document.getElementById('btn-view-retro')?.addEventListener('click', () => {
      document.body.className = 'theme-retro';
      this.setActiveViewBtn('btn-view-retro');
      this.twin.scene.background = new THREE.Color(0xdcd6c8);
    });

    document.getElementById('btn-view-night')?.addEventListener('click', () => {
      document.body.className = 'theme-night';
      this.setActiveViewBtn('btn-view-night');
      this.twin.scene.background = new THREE.Color(0x030712);
    });

    // Side Panels Collapsible Toggles
    const panelInst = document.getElementById('panel-instrument');
    const panelParts = document.getElementById('panel-parts');
    const btnToggleInst = document.getElementById('btn-toggle-instrument');
    const btnToggleParts = document.getElementById('btn-toggle-parts');

    btnToggleInst?.addEventListener('click', () => {
      panelInst.classList.toggle('collapsed');
      btnToggleInst.textContent = panelInst.classList.contains('collapsed') ? '▸ Controls' : '▾ Controls';
    });

    document.getElementById('btn-close-instrument')?.addEventListener('click', () => {
      panelInst.classList.add('collapsed');
      btnToggleInst.textContent = '▸ Controls';
    });

    btnToggleParts?.addEventListener('click', () => {
      panelParts.classList.toggle('collapsed');
      btnToggleParts.textContent = panelParts.classList.contains('collapsed') ? '▸ Parts' : '▾ Parts';
    });

    document.getElementById('btn-close-parts')?.addEventListener('click', () => {
      panelParts.classList.add('collapsed');
      btnToggleParts.textContent = '▸ Parts';
    });

    // Instrument Action Buttons
    document.getElementById('btn-elev-up')?.addEventListener('click', () => {
      this.elevateHeadUp();
    });

    document.getElementById('btn-elev-down')?.addEventListener('click', () => {
      this.lowerHeadDown();
    });

    document.getElementById('btn-start-stirring')?.addEventListener('click', () => {
      this.startStirring();
    });

    document.getElementById('btn-stop-stirring')?.addEventListener('click', () => {
      this.stopStirring();
    });

    document.getElementById('btn-toggle-heater')?.addEventListener('click', () => {
      this.toggleHeater();
    });

    document.getElementById('btn-drop-tablets')?.addEventListener('click', () => {
      this.dropTablets();
    });

    // RPM Slider
    const sliderRpm = document.getElementById('slider-spindle-rpm');
    sliderRpm?.addEventListener('input', e => {
      this.targetRpm = parseFloat(e.target.value);
      document.getElementById('setpoint-rpm-val').textContent = `${this.targetRpm} RPM`;
      if (this.spindlesSpinning) {
        this.sfx.playSwitchSnap();
      }
    });

    // GLP CSV Export
    document.getElementById('btn-export-csv')?.addEventListener('click', () => {
      this.exportGLPReportCSV();
    });
  }

  setActiveBtn(id) {
    document.querySelectorAll('.toolbar-container .btn-tool').forEach(b => {
      if (!['btn-explode', 'btn-wireframe', 'btn-autorotate', 'btn-mute', 'btn-plug', 'btn-toggle-instrument', 'btn-toggle-parts'].includes(b.id)) {
        b.classList.remove('active');
      }
    });
    document.getElementById(id)?.classList.add('active');
  }

  setActiveViewBtn(id) {
    document.querySelectorAll('.header-center .btn-tool').forEach(b => b.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  }

  // ----------------------------------------------------------------------------
  // Physical Power Continuity Logic (Rule 9 / DIAG-014)
  // ----------------------------------------------------------------------------
  togglePlugContinuity() {
    this.twin.togglePlug();
    this.isPluggedIn = this.twin.isPluggedIn;

    const cp = document.getElementById('continuity-status');
    const btnPlug = document.getElementById('btn-plug');

    if (!this.isPluggedIn) {
      cp.className = 'continuity-pill unplugged';
      cp.textContent = 'AC continuity broken · 0V';
      btnPlug.classList.add('active');
      this.state = 'POWER_OFF';
      this.spindlesSpinning = false;
      this.spindleRpm = 0.0;
      this.heaterActive = false;
      this.isElevating = false;
      this.sfx.playRelayThud();
      this.logGLP('POWER: NEMA 5-15P plug removed. Physical power continuity broken.');
    } else {
      cp.className = 'continuity-pill';
      cp.textContent = 'AC continuity established · 115/230V';
      btnPlug.classList.remove('active');
      this.state = 'STANDBY';
      this.sfx.playRelayThud();
      this.logGLP('POWER: NEMA 5-15P plug inserted into duplex box. Continuity established.');
    }
    this.updateUI();
  }

  togglePowerSwitch() {
    this.powerSwitchOn = !this.powerSwitchOn;
    this.twin.powerSwitchOn = this.powerSwitchOn;
    this.sfx.playSwitchSnap();

    if (!this.powerSwitchOn) {
      this.state = 'POWER_OFF';
      this.spindlesSpinning = false;
      this.spindleRpm = 0.0;
      this.heaterActive = false;
      this.isElevating = false;
      this.logGLP('POWER: Rear rocker switch turned OFF.');
    } else if (this.isPluggedIn) {
      this.state = 'STANDBY';
      this.logGLP('POWER: Rear rocker switch turned ON. Firmware boots.');
    }
    this.updateUI();
  }

  // ----------------------------------------------------------------------------
  // Kinematic & Operational Machine Controls
  // ----------------------------------------------------------------------------
  elevateHeadUp() {
    if (!this.isPluggedIn || !this.powerSwitchOn) {
      this.sfx.playSwitchSnap();
      return;
    }

    if (this.spindlesSpinning) {
      this.stopStirring();
      this.logGLP('SAFETY: Spindles halted automatically before head elevation.');
    }

    this.targetElevationMm = 311.0;
    this.isElevating = true;
    this.state = 'ELEVATING_UP';
    this.sfx.playRelayThud();
    this.logGLP('ELEVATOR: Motorized lead screw raising drive head to +311.0 mm.');
    this.updateUI();
  }

  lowerHeadDown() {
    if (!this.isPluggedIn || !this.powerSwitchOn) {
      this.sfx.playSwitchSnap();
      return;
    }

    this.targetElevationMm = 0.0;
    this.isElevating = true;
    this.state = 'ELEVATING_DOWN';
    this.sfx.playRelayThud();
    this.logGLP('ELEVATOR: Lowering drive head to 0.0 mm operating datum.');
    this.updateUI();
  }

  startStirring() {
    if (!this.isPluggedIn || !this.powerSwitchOn) {
      this.sfx.playSwitchSnap();
      return;
    }

    // Safety Interlock: cannot start if drive head is elevated!
    if (this.headElevationMm > 5.0) {
      this.sfx.playAlertChime(false);
      alert('SAFETY INTERLOCK: Drive head is elevated (+311 mm).\nPaddles must be lowered into vessels before starting stirring!');
      this.logGLP('INTERLOCK: Stirring inhibited because drive head is elevated.');
      return;
    }

    this.spindlesSpinning = true;
    this.sfx.playSwitchSnap();

    const anyDropped = this.vessels.some(v => v.tablet_dropped);
    if (anyDropped) {
      this.state = 'RUNNING_DISSOLUTION';
      this.logGLP(`DISSOLUTION: Spindles active at ${this.targetRpm} RPM. Noyes-Whitney ODE active.`);
    } else {
      this.state = 'READY';
      this.logGLP(`SPINDLES: Stirring started at ${this.targetRpm} RPM.`);
    }
    this.updateUI();
  }

  stopStirring() {
    this.spindlesSpinning = false;
    this.sfx.playSwitchSnap();
    if (this.state === 'RUNNING_DISSOLUTION' || this.state === 'READY') {
      this.state = 'STANDBY';
    }
    this.logGLP('SPINDLES: Spindle motor halted.');
    this.updateUI();
  }

  toggleHeater() {
    if (!this.isPluggedIn || !this.powerSwitchOn) {
      this.sfx.playSwitchSnap();
      return;
    }

    this.heaterActive = !this.heaterActive;
    this.sfx.playSwitchSnap();

    if (this.heaterActive) {
      if (this.state === 'STANDBY') this.state = 'HEATING_BATH';
      this.logGLP('HEATER: AutoTemp 1150W circulator engaged. Thermoregulating to 37.0°C.');
    } else {
      if (this.state === 'HEATING_BATH') this.state = 'STANDBY';
      this.logGLP('HEATER: Circulator heater disengaged.');
    }
    this.updateUI();
  }

  dropTablets() {
    if (!this.isPluggedIn || !this.powerSwitchOn) return;

    this.vessels.forEach(v => {
      v.tablet_dropped = true;
      v.dissolved_pct = 0.0;
      v.conc_mg_ml = 0.0;
      v.tablet_radius_mm = 4.5;
    });

    this.sfx.playTabletDrop();
    this.logGLP('DOSAGE: 8x Prednisone 10mg USP tablets dropped into vessels simultaneously.');

    if (this.spindlesSpinning) {
      this.state = 'RUNNING_DISSOLUTION';
    }
    this.updateUI();
  }

  // ----------------------------------------------------------------------------
  // Raycasting for 3D Interactive Parts
  // ----------------------------------------------------------------------------
  initRaycasting() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('pointerdown', e => {
      if (e.target !== this.twin.renderer.domElement) return;

      const rect = this.twin.renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.twin.camera);
      const hits = raycaster.intersectObjects(this.twin.interactiveMeshes, true);

      if (hits.length > 0) {
        let obj = hits[0].object;
        while (obj && !obj.name && obj.parent) obj = obj.parent;
        const name = obj ? obj.name : hits[0].object.name;

        if (name === 'Part_PowerPlugNEMA' || obj.name === 'Part_PowerPlugNEMA') {
          this.togglePlugContinuity();
        } else if (name === 'Switch_Rocker') {
          this.togglePowerSwitch();
        } else if (name === 'Btn_ElevUp') {
          this.elevateHeadUp();
        } else if (name === 'Btn_ElevDown') {
          this.lowerHeadDown();
        } else if (name === 'Btn_Start') {
          this.startStirring();
        } else if (name === 'Btn_Stop') {
          this.stopStirring();
        }
      }
    });
  }

  // ----------------------------------------------------------------------------
  // Real-Time Physics Integration Loop
  // ----------------------------------------------------------------------------
  initSimLoop() {
    const loop = () => {
      requestAnimationFrame(loop);

      const now = performance.now();
      const dt = Math.min(0.1, (now - this.lastTime) / 1000.0);
      this.lastTime = now;

      this.stepPhysics(dt);
    };
    requestAnimationFrame(loop);
  }

  stepPhysics(dt) {
    if (!this.isPluggedIn || !this.powerSwitchOn) {
      // Passive cooling
      this.bathTempC += (21.5 - this.bathTempC) * (0.02 * dt);
      this.spindleRpm = 0.0;
      this.sfx.updateAcoustics(0, false, false, false);
      this.syncToTwin();
      return;
    }

    // 1. Elevator Travel
    if (this.isElevating) {
      const diff = this.targetElevationMm - this.headElevationMm;
      const step = 45.0 * dt; // 45 mm/s
      if (Math.abs(diff) <= step) {
        this.headElevationMm = this.targetElevationMm;
        this.isElevating = false;
        if (this.state.startsWith('ELEVATING')) {
          this.state = 'STANDBY';
        }
        this.sfx.playRelayThud();
      } else {
        this.headElevationMm += Math.sign(diff) * step;
      }
    }

    // 2. Thermoregulation
    if (this.heaterActive) {
      this.bathTempC += (this.targetBathTempC - this.bathTempC) * (0.15 * dt);
      if (Math.abs(this.bathTempC - 37.0) <= 0.2 && this.state === 'HEATING_BATH') {
        this.state = 'READY';
      }
    } else {
      this.bathTempC += (21.5 - this.bathTempC) * (0.01 * dt);
    }

    // 3. Spindle Speed Ramping
    if (this.spindlesSpinning) {
      const diff = this.targetRpm - this.spindleRpm;
      this.spindleRpm += Math.sign(diff) * Math.min(Math.abs(diff), 40.0 * dt);
    } else {
      this.spindleRpm = Math.max(0.0, this.spindleRpm - 60.0 * dt);
    }

    // 4. Noyes-Whitney Dissolution ODE Integration
    if (this.state === 'RUNNING_DISSOLUTION' && this.spindlesSpinning) {
      this.runTimerS += dt;
      const stirFactor = Math.pow(this.spindleRpm / 50.0, 0.6);
      const tempFactor = 1.0 + (this.bathTempC - 37.0) * 0.02;

      this.vessels.forEach(v => {
        if (!v.tablet_dropped || v.dissolved_pct >= 100.0) return;

        // Surface area reduction factor
        const remFrac = Math.max(0.0, 1.0 - (v.dissolved_pct / 100.0));
        const areaFactor = Math.pow(remFrac, 2.0 / 3.0);

        // Driving force
        const drivingForce = Math.max(0.0, (v.solubility_mg_ml - v.conc_mg_ml) / v.solubility_mg_ml);

        // Noyes-Whitney rate
        const dPct = v.k_rate * stirFactor * tempFactor * areaFactor * drivingForce * 100.0 * dt;
        v.dissolved_pct = Math.min(100.0, v.dissolved_pct + dPct);
        v.conc_mg_ml = (v.dissolved_pct / 100.0) * (v.tablet_mass_mg / 900.0);
        v.tablet_radius_mm = 4.5 * Math.pow(remFrac, 1.0 / 3.0);
      });

      // Check if all complete
      const allDone = this.vessels.every(v => !v.tablet_dropped || v.dissolved_pct >= 99.5);
      if (allDone && this.vessels.some(v => v.tablet_dropped)) {
        this.state = 'COMPLETE';
        this.sfx.playAlertChime(true);
        this.recordGLPBatch();
      }
    }

    this.sfx.updateAcoustics(this.spindleRpm, this.isElevating, this.heaterActive, true);
    this.syncToTwin();
    this.updateUI();
  }

  syncToTwin() {
    const avgPct = this.vessels.reduce((acc, v) => acc + v.dissolved_pct, 0) / 8.0;

    this.twin.updateState({
      is_plugged_in: this.isPluggedIn,
      power_switch_on: this.powerSwitchOn,
      state: this.state,
      bath_temp_c: this.bathTempC,
      target_temp_c: this.targetBathTempC,
      spindle_rpm: this.spindleRpm,
      head_elevation_mm: this.headElevationMm,
      avg_dissolved_pct: avgPct,
      run_timer_s: this.runTimerS,
      vessels: this.vessels
    });
  }

  updateUI() {
    // Status pill
    const pill = document.getElementById('status-pill');
    if (pill) {
      pill.textContent = this.state;
      pill.className = `pill ${this.state.toLowerCase()}`;
      if (this.state === 'RUNNING_DISSOLUTION') pill.className = 'pill running';
      if (this.state === 'READY') pill.className = 'pill active';
    }

    // Readouts
    const rTemp = document.getElementById('readout-temp');
    if (rTemp) rTemp.textContent = `${this.bathTempC.toFixed(2)} °C`;

    const rRpm = document.getElementById('readout-rpm');
    if (rRpm) rRpm.textContent = `${this.spindleRpm.toFixed(1)} RPM`;

    const avgPct = this.vessels.reduce((acc, v) => acc + v.dissolved_pct, 0) / 8.0;
    const rRel = document.getElementById('readout-release');
    if (rRel) rRel.textContent = `${avgPct.toFixed(2)} %`;

    const rElev = document.getElementById('readout-elevation');
    if (rElev) rElev.textContent = `${this.headElevationMm.toFixed(1)} mm`;

    // Update 8 vessel cards
    this.vessels.forEach((v, idx) => {
      const card = document.getElementById(`vcard-${idx + 1}`);
      if (card) {
        if (v.tablet_dropped) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
        const pctEl = card.querySelector('.vessel-pct');
        if (pctEl) pctEl.textContent = `${v.dissolved_pct.toFixed(1)}%`;
        const concEl = card.querySelector('.vessel-conc');
        if (concEl) concEl.textContent = `${(v.conc_mg_ml * 1000).toFixed(1)} µg/mL`;
      }
    });
  }

  populateVesselGrid() {
    const c = document.getElementById('vessel-container');
    if (!c) return;
    c.innerHTML = '';

    for (let i = 1; i <= 8; i++) {
      const card = document.createElement('div');
      card.id = `vcard-${i}`;
      card.className = 'vessel-card';
      card.innerHTML = `
        <span class="vessel-name">Vessel ${i}</span>
        <span class="vessel-pct">0.0%</span>
        <span class="vessel-conc">0.0 µg/mL</span>
      `;
      c.appendChild(card);
    }
  }

  populatePartExplorer() {
    const list = document.getElementById('parts-tree');
    if (!list) return;
    list.innerHTML = '';

    PART_CATALOG.forEach(p => {
      const item = document.createElement('div');
      item.className = 'part-item';
      item.innerHTML = `
        <span style="font-weight: 600;">${p.label}</span>
        <span class="part-meta">${p.id}</span>
      `;
      item.addEventListener('click', () => {
        document.querySelectorAll('.part-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        this.highlightPart(p.id);
      });
      list.appendChild(item);
    });

    const search = document.getElementById('parts-search');
    search?.addEventListener('input', e => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.part-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
      });
    });
  }

  highlightPart(partId) {
    this.twin.scene.traverse(node => {
      if (node.isMesh && node.material && node.name !== 'UI_LCD') {
        const match = (node.name === partId) || (node.parent && node.parent.name === partId);
        if (match) {
          if (node.material.emissive) {
            node.material.emissive.setHex(0x00d4e8);
            node.material.emissiveIntensity = 0.5;
            setTimeout(() => {
              if (node.material && node.material.emissive) {
                node.material.emissive.setHex(0x000000);
                node.material.emissiveIntensity = 0.0;
              }
            }, 1200);
          }
        }
      }
    });
  }

  recordGLPBatch() {
    const vResults = this.vessels.map(v => v.dissolved_pct);
    const avg = vResults.reduce((a, b) => a + b, 0) / 8.0;
    const variance = vResults.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / 8.0;
    const rsd = avg > 0 ? (Math.sqrt(variance) / avg) * 100.0 : 0.0;

    const rec = {
      batch: `USP-${Date.now().toString().slice(-4)}`,
      rpm: this.spindleRpm.toFixed(1),
      temp: this.bathTempC.toFixed(2),
      avg: avg.toFixed(2),
      rsd: rsd.toFixed(2),
      status: rsd <= 5.0 ? 'PASS' : 'WARNING'
    };

    this.glpRecords.unshift(rec);
    this.updateGLPTable();
  }

  updateGLPTable() {
    const tbody = document.getElementById('glp-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    this.glpRecords.slice(0, 5).forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color: var(--cyan); font-weight:700;">${r.batch}</td>
        <td>${r.rpm}</td>
        <td>${r.temp}°C</td>
        <td>${r.avg}%</td>
        <td>${r.rsd}%</td>
        <td style="color: ${r.status === 'PASS' ? 'var(--green)' : 'var(--amber)'}; font-weight:700;">${r.status}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  exportGLPReportCSV() {
    if (this.glpRecords.length === 0) {
      this.recordGLPBatch();
    }

    let csv = 'Timestamp,Batch_ID,Apparatus,Spindle_RPM,Bath_Temp_C,V1_Pct,V2_Pct,V3_Pct,V4_Pct,V5_Pct,V6_Pct,V7_Pct,V8_Pct,Mean_Pct,RSD_Pct,Status\n';
    const now = new Date().toISOString();
    const vPcts = this.vessels.map(v => v.dissolved_pct.toFixed(2));
    const avg = (vPcts.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / 8.0).toFixed(2);
    const rsd = this.glpRecords[0] ? this.glpRecords[0].rsd : '0.00';

    csv += `${now},USP-BATCH-708,Apparatus 2 Paddles,${this.spindleRpm.toFixed(1)},${this.bathTempC.toFixed(2)},${vPcts.join(',')},${avg},${rsd},PASS\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `USP_711_Dissolution_Report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.sfx.playAlertChime(true);
  }

  logGLP(msg) {
    console.log(`[GLP Log] ${msg}`);
  }
}

// Instantiate on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  new DissolutionApp();
});
