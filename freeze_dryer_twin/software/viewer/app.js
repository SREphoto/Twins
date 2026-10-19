/**
 * Application Entry & Client Runtime: Labconco FreeZone 4.5L (-84°C)
 * Dual-Truth Simulation Synchronization, WebGL Event Handling, & GLP Reporting
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FreezeDryer3D } from './freeze_dryer3d.js';
import { FreezeDryerSfx } from './sfx.js';

const PART_CATALOG = [
  { id: 'Body_Chassis', label: 'Main Powder-Coated Glacier White Enclosure', cat: 'Chassis' },
  { id: 'Body_Fascia', label: 'Brushed 304 Stainless Steel Front Control Panel', cat: 'Chassis' },
  { id: 'Badge_SREdesigns', label: 'Official SREdesigns Certified Brand Badge', cat: 'Chassis' },
  { id: 'UI_LCD', label: '5.0-Inch Dynamic Lyo-Works Touchscreen Display', cat: 'Electronics' },
  { id: 'Glass_LCDLens', label: 'Anti-Reflective Protective Touchscreen Window', cat: 'Optical' },
  { id: 'Btn_Vacuum', label: 'Tactile Softkey: VACUUM PUMP CONTROL', cat: 'Controls' },
  { id: 'Btn_Refrig', label: 'Tactile Softkey: CASCADE REFRIGERATION', cat: 'Controls' },
  { id: 'Btn_Defrost', label: 'Tactile Softkey: DEFROST & DRAIN CYCLE', cat: 'Controls' },
  { id: 'Btn_Menu', label: 'Tactile Softkey: LYO-WORKS SYSTEM MENU', cat: 'Controls' },
  { id: 'Switch_Power', label: 'Illuminated Front DPST AC Power Rocker', cat: 'Power' },
  { id: 'Chamber_Collector', label: 'Seamless 316SS Electropolished 4.5L Collector', cat: 'Condenser' },
  { id: 'Coil_Evaporator', label: '5-Turn Helical Cascade Evaporator Coil', cat: 'Condenser' },
  { id: 'Frost_CondenserIce', label: 'Dynamic Procedural Frost Ice Accumulation Layer', cat: 'Sublimation' },
  { id: 'Gasket_CollectorRim', label: 'High-Purity Blue Silicone Hermetic Collector Gasket', cat: 'Seals' },
  { id: 'Manifold_DrumAcrylic', label: 'Clear Optical Acrylic 12-Port Drying Drum Manifold', cat: 'Manifold' },
  { id: 'Lid_ManifoldTop', label: 'Removable Optical Acrylic Top Lid Plate', cat: 'Manifold' },
  { id: 'Handle_LidCenter', label: 'Molded Silicone Center Lifting Knob', cat: 'Manifold' },
  { id: 'Valve_QuickSeal_01', label: 'Quick-Seal Neoprene Valve #1 (300mL Flask)', cat: 'Valves' },
  { id: 'Valve_QuickSeal_07', label: 'Quick-Seal Neoprene Valve #7 (600mL Flask)', cat: 'Valves' },
  { id: 'Flask_FastFreeze_01', label: '300 mL Borosilicate Fast-Freeze Flask (Front)', cat: 'Labware' },
  { id: 'Flask_FastFreeze_02', label: '600 mL Borosilicate Fast-Freeze Flask (Side)', cat: 'Labware' },
  { id: 'Cake_FrozenProduct_01', label: 'Frozen API Lyophile Cake #1 (Sublimating)', cat: 'Sublimation' },
  { id: 'Cake_FrozenProduct_02', label: 'Frozen API Lyophile Cake #2 (Sublimating)', cat: 'Sublimation' },
  { id: 'Pump_Vacuum_RV5', label: 'Edwards RV5 Dual-Stage Rotary Vane Vacuum Pump', cat: 'Vacuum' },
  { id: 'Hose_VacuumReinforced', label: 'Heavy-Wall Wire-Reinforced Clear Vacuum Hose', cat: 'Vacuum' },
  { id: 'Port_DrainFront', label: 'Front Defrost Condensate Drain Barb & Clamp', cat: 'Fluidics' },
  { id: 'Power_Receptacle_Duplex', label: 'Cast Aluminum Bench Duplex Receptacle (NEMA 5-15R)', cat: 'Power' },
  { id: 'Part_PowerPlugNEMA', label: 'Molded 3-Prong NEMA 5-15P AC Power Plug', cat: 'Power' },
  { id: 'Cable_ACPowerCord', label: 'Heavy-Duty 3-Wire SJTOW Neoprene AC Cord', cat: 'Power' }
];

class FreezeDryerApp {
  constructor() {
    this.container = document.getElementById('viewport3d');
    this.sfx = new FreezeDryerSfx();

    // 3D Engine
    this.twin = new FreezeDryer3D(this.container);
    window.__twin = this.twin;
    window.__app = this;

    // Controls
    this.controls = new OrbitControls(this.twin.camera, this.twin.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(-0.6, 3.8, 0.0);

    // Simulation State
    this.state = 'STANDBY';
    this.collectorTempC = 21.5;
    this.stage1TempC = 21.5;
    this.vacuumMbar = 1013.25;
    this.frostMassG = 0.0;
    this.compressorRunning = false;
    this.vacuumRunning = false;
    this.defrostActive = false;
    this.elapsedTimeS = 0.0;

    // 12 Valves
    this.valves = [];
    for (let i = 0; i < 12; i++) {
      this.valves.push({
        id: i,
        state: 'CLOSED', // 'CLOSED', 'VACUUM', 'VENT'
        hasFlask: (i === 0 || i === 6),
        cakeMassG: (i === 0 ? 50.0 : (i === 6 ? 120.0 : 0.0))
      });
    }

    this.glpRecords = [];

    this.initUI();
    this.initRaycasting();
    this.initSimLoop();
    this.populatePartExplorer();
    this.populateValveButtons();

    this.logGLP('SYSTEM: Labconco FreeZone 4.5L (-84°C) Digital Twin Initialized. AC continuity established.');
  }

  initUI() {
    // Camera Viewpoints
    const setCam = (px, py, pz, tx, ty, tz) => {
      this.twin.camera.position.set(px, py, pz);
      this.controls.target.set(tx, ty, tz);
      this.controls.update();
    };

    document.getElementById('btn-cam-iso')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-iso');
      setCam(9.8, 9.2, 13.8, -0.6, 3.8, 0.0);
    });

    document.getElementById('btn-cam-front')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-front');
      setCam(1.0, 4.2, 21.0, 0.5, 4.2, 0.0);
    });

    document.getElementById('btn-cam-collector')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-collector');
      setCam(-0.6, 8.5, 4.2, 0.0, 4.8, -0.6);
    });

    document.getElementById('btn-cam-manifold')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-manifold');
      setCam(-0.6, 7.0, 8.2, 0.0, 6.0, -0.6);
    });

    document.getElementById('btn-cam-side')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-side');
      setCam(16.5, 4.2, 0.0, 0.0, 3.8, -0.6);
    });

    document.getElementById('btn-cam-top')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-top');
      setCam(-0.6, 18.5, 0.0, -0.6, 0.0, 0.0);
    });

    document.getElementById('btn-cam-rear')?.addEventListener('click', () => {
      this.setActiveBtn('btn-cam-rear');
      setCam(-0.6, 4.5, -14.5, -0.6, 3.8, 0.0);
    });

    // Exploded View
    document.getElementById('btn-explode')?.addEventListener('click', () => {
      this.twin.toggleExplode();
      const btn = document.getElementById('btn-explode');
      if (btn) btn.classList.toggle('active', this.twin.exploded);
      this.sfx.playValveDetent();
    });

    // Wireframe
    let wire = false;
    document.getElementById('btn-wireframe')?.addEventListener('click', () => {
      wire = !wire;
      document.getElementById('btn-wireframe')?.classList.toggle('active', wire);
      this.twin.root.traverse(child => {
        if (child.isMesh && child.material && child.name !== 'UI_LCD') {
          child.material.wireframe = wire;
        }
      });
    });

    // Auto Rotate
    document.getElementById('btn-autorotate')?.addEventListener('click', () => {
      this.controls.autoRotate = !this.controls.autoRotate;
      document.getElementById('btn-autorotate')?.classList.toggle('active', this.controls.autoRotate);
    });

    // Sliders
    document.getElementById('slider-orbit')?.addEventListener('input', (e) => {
      this.controls.autoRotateSpeed = parseFloat(e.target.value) * 2.0;
    });

    document.getElementById('slider-zoom')?.addEventListener('input', (e) => {
      const fov = parseFloat(e.target.value);
      this.twin.camera.fov = fov;
      this.twin.camera.updateProjectionMatrix();
    });

    document.getElementById('slider-light')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.twin.ambientLight.intensity = 0.75 * val;
      this.twin.keyLight.intensity = 1.8 * val;
      this.twin.fillLight.intensity = 0.85 * val;
    });

    // Mute
    document.getElementById('btn-mute')?.addEventListener('click', () => {
      const muted = this.sfx.toggleMute();
      const btn = document.getElementById('btn-mute');
      if (btn) {
        btn.textContent = muted ? 'Unmute' : 'Mute SFX';
        btn.classList.toggle('active', muted);
      }
    });

    // AC Plug
    document.getElementById('btn-plug')?.addEventListener('click', () => {
      this.togglePlug();
    });

    // Instrument Action Buttons
    document.getElementById('btn-refrig')?.addEventListener('click', () => {
      this.toggleRefrigeration();
    });

    document.getElementById('btn-vacuum')?.addEventListener('click', () => {
      this.toggleVacuum();
    });

    document.getElementById('btn-vent')?.addEventListener('click', () => {
      this.ventChamber();
    });

    document.getElementById('btn-defrost')?.addEventListener('click', () => {
      this.startDefrost();
    });

    // Panel collapse toggles
    const setupCollapse = (btnId, panelId) => {
      const btn = document.getElementById(btnId);
      const panel = document.getElementById(panelId);
      if (btn && panel) {
        btn.addEventListener('click', () => {
          panel.classList.toggle('collapsed');
          btn.classList.toggle('active', !panel.classList.contains('collapsed'));
        });
      }
    };
    setupCollapse('btn-toggle-instrument', 'panel-instrument');
    setupCollapse('btn-close-instrument', 'panel-instrument');
    setupCollapse('btn-toggle-parts', 'panel-parts');
    setupCollapse('btn-close-parts', 'panel-parts');

    // Themes
    const setTheme = (name) => {
      document.body.className = name;
      ['btn-view-modern', 'btn-view-retro', 'btn-view-night'].forEach(id => {
        document.getElementById(id)?.classList.remove('active');
      });
    };
    document.getElementById('btn-view-modern')?.addEventListener('click', () => {
      setTheme('');
      document.getElementById('btn-view-modern')?.classList.add('active');
      this.twin.scene.background = new THREE.Color(0x0c1016);
    });
    document.getElementById('btn-view-retro')?.addEventListener('click', () => {
      setTheme('theme-retro');
      document.getElementById('btn-view-retro')?.classList.add('active');
      this.twin.scene.background = new THREE.Color(0xdcd6c8);
    });
    document.getElementById('btn-view-night')?.addEventListener('click', () => {
      setTheme('theme-night');
      document.getElementById('btn-view-night')?.classList.add('active');
      this.twin.scene.background = new THREE.Color(0x030712);
    });

    // GLP CSV Export
    document.getElementById('btn-export-csv')?.addEventListener('click', () => {
      this.exportCSV();
    });
  }

  setActiveBtn(activeId) {
    ['btn-cam-iso', 'btn-cam-front', 'btn-cam-collector', 'btn-cam-manifold', 'btn-cam-side', 'btn-cam-top', 'btn-cam-rear'].forEach(id => {
      document.getElementById(id)?.classList.remove('active');
    });
    document.getElementById(activeId)?.classList.add('active');
  }

  togglePlug() {
    this.twin.togglePlug();
    const btn = document.getElementById('btn-plug');
    const pill = document.getElementById('continuity-status');

    if (this.twin.isPluggedIn) {
      if (btn) btn.classList.remove('active');
      if (pill) pill.textContent = 'AC continuity established · 115/230V';
      if (this.twin.powerSwitchOn) {
        this.state = 'STANDBY';
      }
      this.logGLP('POWER: AC plug inserted into duplex receptacle.');
    } else {
      if (btn) btn.classList.add('active');
      if (pill) pill.textContent = 'DISCONNECTED: Zero electrical continuity';
      this.state = 'POWER_OFF';
      this.compressorRunning = false;
      this.vacuumRunning = false;
      this.defrostActive = false;
      this.twin.compressorRunning = false;
      this.twin.vacuumRunning = false;
      this.logGLP('POWER: AC plug disconnected! Emergency power cut.');
    }
    this.sfx.playSwitchSnap();
    this.updateUI();
  }

  togglePowerSwitch() {
    this.twin.powerSwitchOn = !this.twin.powerSwitchOn;
    this.twin.animGroups.switchRocker.material.emissiveIntensity = this.twin.powerSwitchOn ? 0.6 : 0.0;
    this.sfx.playSwitchSnap();

    if (!this.twin.powerSwitchOn) {
      this.state = 'POWER_OFF';
      this.compressorRunning = false;
      this.vacuumRunning = false;
      this.defrostActive = false;
      this.twin.compressorRunning = false;
      this.twin.vacuumRunning = false;
      this.logGLP('POWER: Front power switch switched OFF.');
    } else if (this.twin.isPluggedIn) {
      this.state = 'STANDBY';
      this.logGLP('POWER: Front power switch switched ON. System boots.');
    }
    this.twin.renderLCD();
    this.updateUI();
  }

  toggleRefrigeration() {
    if (!this.twin.isPluggedIn || !this.twin.powerSwitchOn) {
      this.sfx.playButtonClick();
      return;
    }
    this.compressorRunning = !this.compressorRunning;
    this.twin.compressorRunning = this.compressorRunning;
    this.sfx.playButtonClick();

    if (this.compressorRunning) {
      this.state = 'PRE_COOLING';
      this.logGLP('REFRIG: Cascade stage 1 started. Pulling collector to -84°C.');
    } else {
      if (this.state === 'PRE_COOLING') this.state = 'STANDBY';
      this.logGLP('REFRIG: Compressors stopped.');
    }
    this.updateUI();
  }

  toggleVacuum() {
    if (!this.twin.isPluggedIn || !this.twin.powerSwitchOn) {
      this.sfx.playButtonClick();
      return;
    }

    // Safety Interlock check: Collector must be <= -40.0°C!
    if (!this.vacuumRunning && this.collectorTempC > -40.0) {
      this.sfx.playAlarmChime();
      alert(`SAFETY INTERLOCK: Collector is warm (${this.collectorTempC.toFixed(1)}°C > -40.0°C).\nRefrigeration pre-cooling required to protect pump oil from water vapor!`);
      this.logGLP(`INTERLOCK: Vacuum start inhibited. Collector temp ${this.collectorTempC.toFixed(1)}°C > -40°C.`);
      return;
    }

    this.vacuumRunning = !this.vacuumRunning;
    this.twin.vacuumRunning = this.vacuumRunning;
    this.sfx.playSolenoidClunk();

    if (this.vacuumRunning) {
      this.state = 'PULL_DOWN';
      this.logGLP('VACUUM: Edwards RV5 started & solenoid opened. Pulling vacuum.');
    } else {
      if (this.state === 'PULL_DOWN' || this.state === 'PRIMARY_DRYING') {
        this.state = 'STANDBY';
      }
      this.logGLP('VACUUM: Vacuum pump stopped and solenoid isolated.');
    }
    this.updateUI();
  }

  ventChamber() {
    if (!this.twin.isPluggedIn || !this.twin.powerSwitchOn) return;
    this.vacuumRunning = false;
    this.twin.vacuumRunning = false;
    this.state = 'BREAK_VACUUM';
    this.sfx.playAirRush(1.4);
    this.logGLP('VENT: Aeration valve opened. Chamber returning to atmospheric pressure.');
    this.updateUI();
  }

  startDefrost() {
    if (!this.twin.isPluggedIn || !this.twin.powerSwitchOn) return;
    this.compressorRunning = false;
    this.vacuumRunning = false;
    this.twin.compressorRunning = false;
    this.twin.vacuumRunning = false;
    this.defrostActive = true;
    this.state = 'DEFROST';
    this.sfx.playSolenoidClunk();
    this.logGLP('DEFROST: Hot gas bypass defrost cycle initiated.');
    this.updateUI();
  }

  toggleValve(idx) {
    const v = this.valves[idx];
    if (!v) return;

    // Cycle states: CLOSED -> VACUUM -> VENT -> CLOSED
    if (v.state === 'CLOSED') {
      v.state = 'VACUUM';
      // Rotate lever to horizontal left
      this.twin.animGroups.valvePivots[idx].rotation.z = Math.PI / 2;
    } else if (v.state === 'VACUUM') {
      v.state = 'VENT';
      // Rotate lever to horizontal right
      this.twin.animGroups.valvePivots[idx].rotation.z = -Math.PI / 2;
      this.sfx.playAirRush(0.5);
    } else {
      v.state = 'CLOSED';
      // Rotate lever to vertical
      this.twin.animGroups.valvePivots[idx].rotation.z = 0;
    }

    this.sfx.playValveDetent();
    this.logGLP(`VALVE: Port #${idx+1} rotated to ${v.state}.`);

    // Check primary drying transition
    if (v.state === 'VACUUM' && this.vacuumMbar < 0.200 && v.hasFlask && v.cakeMassG > 0) {
      this.state = 'PRIMARY_DRYING';
    }

    this.updateValveButtons();
  }

  populateValveButtons() {
    const c = document.getElementById('valve-container');
    if (!c) return;
    c.innerHTML = '';

    this.valves.forEach((v, idx) => {
      const item = document.createElement('div');
      item.id = `valve-btn-${idx}`;
      item.className = 'valve-item' + (v.state === 'VACUUM' ? ' active' : '');
      item.innerHTML = `
        <span>Port #${idx+1} ${v.hasFlask ? '🧪' : ''}</span>
        <span style="font-family: var(--font-mono); font-weight: 700;">${v.state}</span>
      `;
      item.addEventListener('click', () => this.toggleValve(idx));
      c.appendChild(item);
    });
  }

  updateValveButtons() {
    this.valves.forEach((v, idx) => {
      const el = document.getElementById(`valve-btn-${idx}`);
      if (el) {
        el.className = 'valve-item' + (v.state === 'VACUUM' ? ' active' : '');
        el.innerHTML = `
          <span>Port #${idx+1} ${v.hasFlask ? '🧪' : ''}</span>
          <span style="font-family: var(--font-mono); font-weight: 700;">${v.state}</span>
        `;
      }
    });
  }

  initRaycasting() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.container.addEventListener('pointerdown', (e) => {
      const rect = this.container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.twin.camera);
      const intersects = raycaster.intersectObjects(this.twin.interactiveMeshes, true);

      if (intersects.length > 0) {
        let hit = intersects[0].object;
        while (hit && !hit.name && hit.parent) hit = hit.parent;
        const name = hit ? hit.name : '';

        if (name === 'Part_PowerPlugNEMA') {
          this.togglePlug();
        } else if (name === 'Switch_Power') {
          this.togglePowerSwitch();
        } else if (name === 'Btn_Refrig') {
          this.toggleRefrigeration();
        } else if (name === 'Btn_Vacuum') {
          this.toggleVacuum();
        } else if (name === 'Btn_Defrost') {
          this.startDefrost();
        } else if (name === 'UI_LCD') {
          this.sfx.playButtonClick();
        } else if (name.startsWith('Pivot_ValveLever_') || name.startsWith('Valve_QuickSeal_')) {
          const match = name.match(/\d+/);
          if (match) {
            const idx = parseInt(match[0], 10) - 1;
            this.toggleValve(idx);
          }
        }
      }
    });
  }

  initSimLoop() {
    let lastTime = performance.now();

    const loop = () => {
      requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      this.stepThermodynamics(dt);
      this.controls.update();
    };
    requestAnimationFrame(loop);
  }

  stepThermodynamics(dt) {
    if (!this.twin.isPluggedIn || !this.twin.powerSwitchOn) {
      // Passive warming
      this.collectorTempC += (21.5 - this.collectorTempC) * (0.01 * dt);
      this.vacuumMbar += (1013.25 - this.vacuumMbar) * (0.05 * dt);
      this.syncDisplay();
      return;
    }

    this.elapsedTimeS += dt;

    // 1. Thermal Cascade Simulation
    if (this.compressorRunning) {
      // Stage 1 pulls to -35°C
      this.stage1TempC += (-35.0 - this.stage1TempC) * (0.12 * dt);
      // Stage 2 pulls collector to -84°C
      if (this.stage1TempC <= -20.0) {
        this.collectorTempC += (-84.0 - this.collectorTempC) * (0.15 * dt);
      }
    } else if (this.defrostActive) {
      // Defrost heating to +30°C
      this.collectorTempC += (30.0 - this.collectorTempC) * (0.25 * dt);
      if (this.frostMassG > 0) {
        this.frostMassG = Math.max(0.0, this.frostMassG - 15.0 * dt);
      } else if (this.collectorTempC >= 20.0) {
        this.defrostActive = false;
        this.state = 'STANDBY';
        this.logGLP('DEFROST: Defrost complete. Chamber dry.');
      }
    } else {
      // Passive warming towards ambient
      this.collectorTempC += (21.5 - this.collectorTempC) * (0.02 * dt);
    }

    // 2. Vacuum Evacuation Simulation
    if (this.vacuumRunning) {
      this.vacuumMbar = 0.020 + (this.vacuumMbar - 0.020) * Math.exp(-0.35 * dt);
    } else if (this.state === 'BREAK_VACUUM') {
      this.vacuumMbar += (1013.25 - this.vacuumMbar) * (0.50 * dt);
      if (this.vacuumMbar >= 1010.0) {
        this.vacuumMbar = 1013.25;
        this.state = 'STANDBY';
      }
    }

    // 3. Sublimation Flux & Frost Accumulation
    const activeValves = this.valves.filter(v => v.state === 'VACUUM' && v.hasFlask && v.cakeMassG > 0);
    if (activeValves.length > 0 && this.vacuumMbar < 0.200 && this.collectorTempC <= -40.0) {
      this.state = 'PRIMARY_DRYING';
      let flux = 0.0;
      activeValves.forEach(v => {
        const sub = Math.min(v.cakeMassG, 0.85 * dt);
        v.cakeMassG -= sub;
        flux += sub;
      });
      this.frostMassG = Math.min(4500.0, this.frostMassG + flux);

      // Check if all cakes depleted
      const anyRemaining = this.valves.some(v => v.hasFlask && v.cakeMassG > 0);
      if (!anyRemaining) {
        this.state = 'SECONDARY_DRYING';
        this.logGLP('LYOPHILIZE: Primary drying complete. Sublimation ice depleted. Entering secondary desorption.');
        this.recordGLPBatch();
      }
    }

    // Sound acoustics update
    this.sfx.updateAcoustics(this.compressorRunning, this.vacuumRunning, this.twin.isPluggedIn && this.twin.powerSwitchOn);

    this.syncDisplay();
  }

  syncDisplay() {
    this.twin.displayState.state = this.state;
    this.twin.displayState.collector_temp_c = this.collectorTempC;
    this.twin.displayState.stage1_temp_c = this.stage1TempC;
    this.twin.displayState.vacuum_mbar = this.vacuumMbar;
    this.twin.displayState.frost_mass_g = this.frostMassG;
    this.twin.displayState.frost_thickness_mm = (this.frostMassG / 4500.0) * 8.0;
    this.twin.displayState.run_timer_s = this.elapsedTimeS;

    this.twin.renderLCD();
    this.updateUI();
  }

  updateUI() {
    // HTML Readouts
    const elTemp = document.getElementById('readout-temp');
    if (elTemp) elTemp.textContent = `${this.collectorTempC > 0 ? '+' : ''}${this.collectorTempC.toFixed(1)} °C`;

    const elVac = document.getElementById('readout-vacuum');
    if (elVac) elVac.textContent = `${this.vacuumMbar.toFixed(3)} mbar`;

    const elFrost = document.getElementById('readout-frost');
    if (elFrost) elFrost.textContent = `${this.frostMassG.toFixed(1)} g`;

    const elFrostSub = document.getElementById('readout-frost-sub');
    if (elFrostSub) elFrostSub.textContent = `Ice Capacity: 4.5 L · Thickness: ${((this.frostMassG / 4500.0) * 8.0).toFixed(2)} mm`;

    const statusPill = document.getElementById('status-pill');
    if (statusPill) {
      statusPill.textContent = this.state;
      if (this.state === 'STANDBY') statusPill.className = 'pill standby';
      else if (this.state === 'PRE_COOLING') statusPill.className = 'pill precool';
      else if (this.state === 'PULL_DOWN') statusPill.className = 'pill pulldown';
      else if (this.state === 'PRIMARY_DRYING' || this.state === 'SECONDARY_DRYING') statusPill.className = 'pill dry';
      else if (this.state === 'DEFROST') statusPill.className = 'pill defrost';
      else statusPill.className = 'pill off';
    }

    // Toggle button active styling
    document.getElementById('btn-refrig')?.classList.toggle('active', this.compressorRunning);
    document.getElementById('btn-vacuum')?.classList.toggle('active', this.vacuumRunning);
  }

  logGLP(msg) {
    console.log(`[GLP-LOG] ${msg}`);
  }

  recordGLPBatch() {
    const record = {
      time: new Date().toLocaleTimeString(),
      batch: `LYO-${Date.now().toString().slice(-4)}`,
      temp: `${this.collectorTempC.toFixed(1)} °C`,
      vac: `${this.vacuumMbar.toFixed(3)} mbar`,
      frost: `${this.frostMassG.toFixed(1)} g`
    };
    this.glpRecords.push(record);

    const tbody = document.getElementById('glp-log-body');
    if (tbody) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${record.time}</td>
        <td>${record.batch}</td>
        <td>${record.temp}</td>
        <td>${record.vac}</td>
        <td>${record.frost}</td>
      `;
      tbody.prepend(tr);
    }
  }

  exportCSV() {
    if (this.glpRecords.length === 0) {
      alert('No GLP batch runs recorded yet.');
      return;
    }
    let csv = 'Timestamp,Batch ID,Collector Temp,Chamber Vacuum,Frost Collected\n';
    this.glpRecords.forEach(r => {
      csv += `"${r.time}","${r.batch}","${r.temp}","${r.vac}","${r.frost}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Labconco_FreeZone_GLP_Report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.sfx.playButtonClick();
  }

  populatePartExplorer() {
    const list = document.getElementById('part-list');
    if (!list) return;
    list.innerHTML = '';

    PART_CATALOG.forEach(p => {
      const card = document.createElement('div');
      card.className = 'part-card';
      card.innerHTML = `
        <div class="part-info">
          <span class="part-name">${p.label}</span>
          <span class="part-cat">${p.cat}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        const obj = this.twin.root.getObjectByName(p.id);
        if (obj) {
          // Flash highlight
          const origHex = obj.material?.color ? obj.material.color.getHex() : 0xffffff;
          if (obj.material?.color) obj.material.color.setHex(0x00d4e8);
          setTimeout(() => {
            if (obj.material?.color) obj.material.color.setHex(origHex);
          }, 800);
        }
      });
      list.appendChild(card);
    });

    // Search filter
    document.getElementById('input-search-parts')?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.part-card').forEach(card => {
        const txt = card.textContent.toLowerCase();
        card.style.display = txt.includes(query) ? 'flex' : 'none';
      });
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new FreezeDryerApp();
});
