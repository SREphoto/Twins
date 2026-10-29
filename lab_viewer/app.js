/**
 * app.js — Master Coordinator for the Grand Chemistry & Pharmaceutical Complex
 * 
 * Orchestrates:
 * - Three.js WebGL Renderer & Scene Graph
 * - Modern Biotech Architectural Environment (LabEnvironment3D)
 * - SEFA Casework & Executive Millwork (LabCasework)
 * - Interactive Utilities: Running Water, Bunsen Burners, Reagents (LabUtilities)
 * - Instrument Twins Dock (LabDockManager)
 * - Hybrid FPS + Click-to-Glide Navigation (LabPlayerController)
 * - Situationally Aware Collapsible Assistant Sidebar
 * - Physicalized Data Outputs (PhysicalDataBus) & Spatial Audio (LabSFXMixer)
 */
import * as THREE from "three";
import { LabEnvironment3D } from "./engine/LabEnvironment3D.js";
import { LabCasework } from "./engine/LabCasework.js";
import { LabUtilities } from "./engine/LabUtilities.js";
import { LabDockManager } from "./engine/LabDockManager.js";
import { LabPlayerController } from "./engine/LabPlayerController.js";
import { physicalDataBus } from "./engine/PhysicalDataBus.js";
import { labAudio } from "./engine/LabSFXMixer.js";

class GrandLabApp {
  constructor() {
    this.host = document.getElementById("canvas-host");
    this.width = this.host.clientWidth || window.innerWidth;
    this.height = this.host.clientHeight || window.innerHeight;

    // Active Machine context for sidebar
    this.activeMachineId = "dissolution_tester";

    window.__labApp = this;
    window.THREE = THREE;

    this._initThree();
    this._initModules();
    this._initUI();
    this._onZoneOrModeChange("Grand Overview · Architectural Complex", "overview");
    this._initRaycasting();
    this._startLoop();
  }

  _initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e14);
    this.scene.fog = new THREE.FogExp2(0x0a0e14, 0.018);

    this.camera = new THREE.PerspectiveCamera(65, this.width / this.height, 0.1, 100);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.host.innerHTML = "";
    this.host.appendChild(this.renderer.domElement);

    window.addEventListener("resize", () => {
      this.width = this.host.clientWidth || window.innerWidth;
      this.height = this.host.clientHeight || window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });
  }

  _initModules() {
    // 1. Modern Architectural Shell (Walls, Pillars, Slat Panels, Airlock)
    this.environment = new LabEnvironment3D(this.scene);

    // 2. SEFA Casework, Fume Hoods & Office/Conference Furniture
    this.casework = new LabCasework(this.scene, this.environment.colliders);

    // 3. Interactive Utilities (Running water, Bunsen burners, reagents, power)
    this.utilities = new LabUtilities(this.scene, this.environment.colliders);

    // 4. Mount All 17 Instrument Digital Twins
    this.dockManager = new LabDockManager(this.scene);

    // 5. Hybrid Player Navigation Engine (WASD + Click-to-Glide)
    this.player = new LabPlayerController(
      this.camera,
      this.renderer.domElement,
      this.environment.colliders,
      (zoneName, mode) => this._onZoneOrModeChange(zoneName, mode)
    );
  }

  _initUI() {
    this.hudZonePill = document.getElementById("hud-zone-pill");
    this.crosshair = document.getElementById("hud-crosshair");
    this.promptPill = document.getElementById("interaction-prompt-pill");
    this.promptText = document.getElementById("prompt-text");

    // Sidebar Elements
    this.sidebar = document.getElementById("smart-sidebar");
    this.btnSidebarToggle = document.getElementById("btn-sidebar-toggle");
    this.sidebarToggleIcon = document.getElementById("sidebar-toggle-icon");
    this.sidebarBadge = document.getElementById("sidebar-context-badge");
    this.telemetryStationName = document.getElementById("telemetry-station-name");
    this.tStatus = document.getElementById("t-status");
    this.tParam1 = document.getElementById("t-param1");
    this.tTemp = document.getElementById("t-temp");
    this.tTimer = document.getElementById("t-timer");
    this.advisorText = document.getElementById("advisor-guidance-text");
    this.sopTitle = document.getElementById("sop-title");

    // Action buttons
    this.btnPrintSlip = document.getElementById("btn-print-slip");
    this.btnDownloadCsv = document.getElementById("btn-download-csv");
    this.btnAudioToggle = document.getElementById("btn-audio-toggle");
    this.quickTravelSelect = document.getElementById("quick-travel-select");

    // Sidebar Toggle Handler
    this.btnSidebarToggle.addEventListener("click", () => {
      const isCollapsed = this.sidebar.classList.toggle("is-collapsed");
      this.sidebarToggleIcon.textContent = isCollapsed ? "▶" : "◀";
      labAudio.playButtonClick();
    });

    // Keyboard shortcut for sidebar toggle (Tab)
    window.addEventListener("keydown", (e) => {
      if (e.code === "Tab") {
        e.preventDefault();
        const isCollapsed = this.sidebar.classList.toggle("is-collapsed");
        this.sidebarToggleIcon.textContent = isCollapsed ? "▶" : "◀";
      }
    });

    // Audio Mute Toggle
    this.btnAudioToggle.addEventListener("click", () => {
      const isMuted = labAudio.toggleMute();
      const icon = document.getElementById("audio-icon");
      icon.textContent = isMuted ? "🔇" : "🔊";
      labAudio.playButtonClick();
    });

    // Thermal Slip & USB CSV actions
    this.btnPrintSlip.addEventListener("click", () => {
      physicalDataBus.printThermalSlip(this.activeMachineId);
    });

    this.btnDownloadCsv.addEventListener("click", () => {
      physicalDataBus.downloadUsbCSV(this.activeMachineId);
    });

    // Quick Station Jump Dropdown
    this.quickTravelSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (!val) return;
      this._jumpToPresetLocation(val);
      e.target.value = "";
    });

    // Floating Bottom Navigation Dock
    this.navPills = document.querySelectorAll(".nav-pill");
    this.navPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const dest = pill.getAttribute("data-nav");
        this._handleNavDockClick(dest);
        labAudio.playButtonClick();
      });
    });

    // Help controls modal alert
    document.getElementById("btn-help-controls").addEventListener("click", () => {
      alert(
        "Grand Laboratory Navigation Controls:\n\n" +
        "• Overview Mode: Left-click drag to orbit/rotate, right-click to pan, scroll wheel to zoom.\n" +
        "• Walk Mode: W, A, S, D or Arrow keys, click viewport to lock pointer.\n" +
        "• Sprint: Hold Shift while walking.\n" +
        "• Click-to-Glide: Click any machine from across the room to inspect it up close.\n" +
        "• Escape / Overview Pill: Return to Grand Overview at any time.\n" +
        "• Assistant Sidebar: Press Tab to collapse/expand."
      );
    });
  }

  _handleNavDockClick(dest) {
    this._setActiveNavPill(dest);

    if (dest === "overview") {
      this.player.glideToOverview();
    } else if (dest === "reception") {
      this.player.glideToStation(
        new THREE.Vector3(12.0, 1.65, -6.5),
        new THREE.Vector3(12.0, 1.25, 1.2),
        "Zone 6: Grand Entrance Atrium & Waiting Lounge"
      );
    } else if (dest === "analytical") {
      this.player.glideToStation(
        new THREE.Vector3(-6.0, 1.65, -1.8),
        new THREE.Vector3(-10.2, 1.15, -4.0),
        "Zone 1: Main Analytical & QC Hall (UV-Vis & FTIR)"
      );
    } else if (dest === "pharma") {
      this.player.glideToStation(
        new THREE.Vector3(1.8, 1.65, -1.8),
        new THREE.Vector3(-2.5, 1.2, -4.0),
        "Zone 1: Pharmaceutical Testing Suite (Dissolution & Disintegration)"
      );
    } else if (dest === "synthesis") {
      this.player.glideToStation(
        new THREE.Vector3(-10.0, 1.65, 3.5),
        new THREE.Vector3(-11.5, 1.35, 8.0),
        "Zone 2: Synthesis & Reaction Bay (Fume Hoods & Rotovap)"
      );
    } else if (dest === "sampleprep") {
      this.player.glideToStation(
        new THREE.Vector3(0.5, 1.65, 3.5),
        new THREE.Vector3(-1.0, 1.25, 7.5),
        "Zone 3: Sample Prep & Lyophilization (Centrifuge & Freeze Dryer)"
      );
    } else if (dest === "office") {
      this.player.glideToStation(
        new THREE.Vector3(17.5, 1.65, -3.2),
        new THREE.Vector3(18.75, 1.15, -5.5),
        "Zone 9: User's Private Executive Office (LIMS Studio)"
      );
    } else if (dest === "conference") {
      this.player.glideToStation(
        new THREE.Vector3(18.5, 1.65, 3.2),
        new THREE.Vector3(22.0, 1.15, 5.5),
        "Zone 10: Grand Boardroom & Conference Suite"
      );
    } else if (dest === "facultysuite") {
      this.player.glideToStation(
        new THREE.Vector3(26.75, 1.65, -2.5),
        new THREE.Vector3(26.75, 1.15, -5.5),
        "Faculty Suite: Guest, Admin & Instructor Offices"
      );
    } else if (dest === "breakroom") {
      this.player.glideToStation(
        new THREE.Vector3(28.5, 1.65, 3.2),
        new THREE.Vector3(30.5, 1.15, 5.5),
        "Zone 11: Staff Break Room & Kitchenette"
      );
    } else if (dest === "menslockers") {
      this.player.glideToStation(
        new THREE.Vector3(33.5, 1.65, -3.2),
        new THREE.Vector3(35.5, 1.15, -5.5),
        "Zone 13: Men's Locker Room & Showers"
      );
    } else if (dest === "womenslockers") {
      this.player.glideToStation(
        new THREE.Vector3(39.0, 1.65, 0.0),
        new THREE.Vector3(42.0, 1.15, 0.0),
        "Zone 14: Women's Locker Room, Changing Suite & Showers"
      );
    } else if (dest === "restroom") {
      this.player.glideToStation(
        new THREE.Vector3(34.8, 1.65, 3.2),
        new THREE.Vector3(35.8, 1.15, 5.5),
        "Zone 12: Executive Restroom & Sanitation"
      );
    } else if (dest === "exterior") {
      this.player.glideToStation(
        new THREE.Vector3(13.0, 4.5, -28.0),
        new THREE.Vector3(13.0, 1.8, -9.0),
        "Exterior Campus: Parking Lot & Landscaping"
      );
    } else if (dest === "walk") {
      this.player.enterWalkMode();
    }
  }

  _setActiveNavPill(dest) {
    if (!this.navPills) return;
    this.navPills.forEach((p) => {
      if (p.getAttribute("data-nav") === dest) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });
  }

  _onZoneOrModeChange(zoneName, mode) {
    if (this.hudZonePill) {
      this.hudZonePill.textContent = zoneName;
    }

    // Dynamic Context Switching in Assistant Sidebar & Navigation Dock
    if (mode === "overview" || zoneName.includes("Grand Overview")) {
      this._setActiveNavPill("overview");
      this.sidebarBadge.textContent = "OVERVIEW";
      this.telemetryStationName.textContent = "Grand Complex Overview";
      this.tStatus.textContent = "17 TWINS READY";
      this.tParam1.textContent = "Casework Online";
      this.tTemp.textContent = "21.0 °C";
      this.tTimer.textContent = "Continuous";
      this.sopTitle.textContent = "Grand Chemistry & Pharma Complex";
      this.advisorText.textContent = "Grand Architectural Overview: Explore all 17 digital instrument twins, executive conference suite, and private LIMS office. Use the bottom navigation dock or click any machine to inspect up close.";
    } else if (mode === "walk") {
      this._setActiveNavPill("walk");
      this.sidebarBadge.textContent = "WALK MODE";
      this.telemetryStationName.textContent = zoneName;
      this.tStatus.textContent = "NAVIGATING";
      this.tParam1.textContent = "Eye-Level 1.65m";
      this.tTemp.textContent = "21.0 °C";
      this.tTimer.textContent = "WASD Active";
      this.sopTitle.textContent = "Laboratory Floor Walk";
      this.advisorText.textContent = "Walk freely using W, A, S, D or Arrow keys. Hold Shift to sprint. Click anywhere on a machine to focus, or press ESC to return to Grand Overview.";
    } else if (zoneName.includes("Grand Entrance") || zoneName.includes("Waiting Lounge")) {
      this._setActiveNavPill("reception");
      this.sidebarBadge.textContent = "RECEPTION";
      this.telemetryStationName.textContent = "Grand Entrance Atrium";
      this.tStatus.textContent = "ONLINE";
      this.tParam1.textContent = "Guest Check-In";
      this.tTemp.textContent = "21.5 °C";
      this.tTimer.textContent = "Atrium Live";
      this.sopTitle.textContent = "Visitor Reception & Security";
      this.advisorText.textContent = "Grand Entrance Atrium: Fluted travertine desk with guest check-in terminal, emerald velvet lounge, kinetic brass DNA double-helix sculpture, and living moss partition wall.";
    } else if (zoneName.includes("User's Private Executive Office")) {
      this._setActiveNavPill("office");
      this.sidebarBadge.textContent = "OFFICE & LIMS";
      this.telemetryStationName.textContent = "Executive LIMS Studio";
      this.tStatus.textContent = "READY";
      this.tParam1.textContent = "Dual 4K Curved";
      this.tTemp.textContent = "21.0 °C";
      this.tTimer.textContent = "Continuous";
      this.sopTitle.textContent = "Post-Run Review & Calculations";
      this.advisorText.textContent = "Doubled Executive Office: American walnut cantilever desk with Nero Marquina waterfall edge, dual 32\" curved displays, acoustic slat wall, executive credenza, espresso bar, and private collaboration lounge.";
    } else if (zoneName.includes("Grand Boardroom") || zoneName.includes("Conference Suite")) {
      this._setActiveNavPill("conference");
      this.sidebarBadge.textContent = "BOARDROOM";
      this.telemetryStationName.textContent = "Grand Conference Suite";
      this.tStatus.textContent = "BROADCAST";
      this.tParam1.textContent = "16-Seat Table";
      this.tTemp.textContent = "21.0 °C";
      this.tTimer.textContent = "110\" Laser Wall";
      this.sopTitle.textContent = "Lab Briefing & Presentation";
      this.advisorText.textContent = "Doubled Grand Boardroom: 16 ergonomic conference chairs, marble boat-shaped boardroom table with pop-up power raceways, presenter stage and fluted podium, and 110\" laser video wall.";
    } else if (zoneName.includes("Faculty Suite")) {
      this._setActiveNavPill("facultysuite");
      this.sidebarBadge.textContent = "FACULTY";
      this.telemetryStationName.textContent = "Faculty & Admin Suite";
      this.tStatus.textContent = "ACTIVE";
      this.tParam1.textContent = "3 Offices";
      this.tTemp.textContent = "21.0 °C";
      this.tTimer.textContent = "Academic";
      this.sopTitle.textContent = "Faculty Mentorship & Administration";
      this.advisorText.textContent = "Faculty Suite: Private offices for Guest Researchers, Administration (with commercial multifunction printer and lateral file archives), and the Instructor's Office.";
    } else if (zoneName.includes("Break Room")) {
      this._setActiveNavPill("breakroom");
      this.sidebarBadge.textContent = "BREAK ROOM";
      this.telemetryStationName.textContent = "Staff Lounge & Kitchenette";
      this.tStatus.textContent = "AMENITIES";
      this.tParam1.textContent = "Espresso & Café";
      this.tTemp.textContent = "21.0 °C";
      this.tTimer.textContent = "Break Active";
      this.sopTitle.textContent = "Staff Amenities & Dining";
      this.advisorText.textContent = "Staff Break Room: Full kitchenette with quartz waterfall island, commercial dual-group espresso station, microwave ovens, French door refrigerator, snack and beverage vending machines, and café seating.";
    } else if (zoneName.includes("Men's Locker Room")) {
      this._setActiveNavPill("menslockers");
      this.sidebarBadge.textContent = "LOCKERS (M)";
      this.telemetryStationName.textContent = "Men's Locker & Showers";
      this.tStatus.textContent = "SANITIZED";
      this.tParam1.textContent = "24 Steel Lockers";
      this.tTemp.textContent = "22.5 °C";
      this.tTimer.textContent = "Showers Active";
      this.sopTitle.textContent = "Sanitary & Gowning Facility";
      this.advisorText.textContent = "Men's Locker Room: 24 ventilated steel lockers with digital PIN locks, solid oak butcher dressing benches, 3 private rainfall shower stalls, and double grooming vanity.";
    } else if (zoneName.includes("Women's Locker Room")) {
      this._setActiveNavPill("womenslockers");
      this.sidebarBadge.textContent = "LOCKERS (W)";
      this.telemetryStationName.textContent = "Women's Changing Suite";
      this.tStatus.textContent = "SANITIZED";
      this.tParam1.textContent = "32 Gold Lockers";
      this.tTemp.textContent = "22.5 °C";
      this.tTimer.textContent = "Showers Active";
      this.sopTitle.textContent = "Sanitary & Gowning Facility";
      this.advisorText.textContent = "Women's Changing Suite: 32 champagne gold lockers, velvet circular lounge ottoman, 4-station illuminated Hollywood vanity bar with Dyson hair dryers, and 4 private rainfall shower suites.";
    } else if (zoneName.includes("Executive Restroom") || zoneName.includes("Restroom & Sanitation")) {
      this._setActiveNavPill("restroom");
      this.sidebarBadge.textContent = "RESTROOM";
      this.telemetryStationName.textContent = "Executive Restroom";
      this.tStatus.textContent = "ACCESSIBLE";
      this.tParam1.textContent = "Touchless Fixtures";
      this.tTemp.textContent = "21.0 °C";
      this.tTimer.textContent = "Active";
      this.sopTitle.textContent = "Sanitary & ADA Compliance";
      this.advisorText.textContent = "Executive Restroom: Floating quartz double vanity with backlit defogger mirrors, automatic sensor faucets, private full-height stalls with commercial wall-hung toilets, and Dyson Airblade dryers.";
    } else if (zoneName.includes("Exterior Campus") || zoneName.includes("Parking Lot")) {
      this._setActiveNavPill("exterior");
      this.sidebarBadge.textContent = "CAMPUS";
      this.telemetryStationName.textContent = "Biomedical Campus Grounds";
      this.tStatus.textContent = "ONLINE";
      this.tParam1.textContent = "EV Charging 32A";
      this.tTemp.textContent = "18.5 °C";
      this.tTimer.textContent = "Daylight LED";
      this.sopTitle.textContent = "Facility Site & Parking";
      this.advisorText.textContent = "Exterior campus grounds featuring asphalt parking lot, dedicated ADA van accessible stall, commercial dual-port EV charging station, concrete curbs, pedestrian promenade, boxwood shrubs, and birch tree planters.";
    } else if (zoneName.includes("Thermal Air-Lock")) {
      this.sidebarBadge.textContent = "AIRLOCK";
      this.telemetryStationName.textContent = "Entrance HVAC Buffer";
      this.tStatus.textContent = "SEALED";
      this.tParam1.textContent = "+0.03\" w.g.";
      this.tTemp.textContent = "21.0 °C";
      this.tTimer.textContent = "Cascade OK";
      this.sopTitle.textContent = "Safety & Gowning Protocol";
      this.advisorText.textContent = "Thermal Air-Lock Vestibule: Dual double-door buffer preventing drafts and temperature swings from destabilizing balances and dissolution baths.";
    } else if (zoneName.includes("Synthesis & Reaction") || zoneName.includes("Fume Hood")) {
      this._setActiveNavPill("synthesis");
      this.sidebarBadge.textContent = "SYNTHESIS";
      this.telemetryStationName.textContent = "Ducted Fume Hood Bay";
      this.tStatus.textContent = "ACTIVE";
      this.tParam1.textContent = "Sash 18\"";
      this.tTemp.textContent = "Exhaust 100 fpm";
      this.tTimer.textContent = "Purging";
      this.sopTitle.textContent = "Organic Synthesis Protocol";
      this.advisorText.textContent = "Synthesis Bay: Fume hoods active with Buchi Rotovap, Parr high-pressure reactor, and Bunsen burners with adjustable air collars.";
    } else if (zoneName.includes("Sample Prep") || zoneName.includes("Centrifuge") || zoneName.includes("Freeze Dryer")) {
      this._setActiveNavPill("sampleprep");
      this.sidebarBadge.textContent = "SAMPLE PREP";
      this.telemetryStationName.textContent = "Sample Prep & Cold Suite";
      this.tStatus.textContent = "STANDBY";
      this.tParam1.textContent = "-84.0 °C Condenser";
      this.tTemp.textContent = "21.0 °C";
      this.tTimer.textContent = "Ready";
      this.sopTitle.textContent = "Lyophilization & Centrifugation";
      this.advisorText.textContent = "Sample Prep Suite: Centrifuge fractions, sonicate samples, and lyophilize heat-labile pharmaceutical compounds in the -84°C freeze dryer.";
    } else if (zoneName.includes("Dissolution") || zoneName.includes("Disintegration") || zoneName.includes("Karl Fischer")) {
      this._setActiveNavPill("pharma");
    } else if (zoneName.includes("Analytical") || zoneName.includes("Spectrophotometer") || zoneName.includes("FTIR") || zoneName.includes("Balance")) {
      this._setActiveNavPill("analytical");
    } else {
      this.sidebarBadge.textContent = "LAB HALL";
    }
  }

  _initRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.centerMouse = new THREE.Vector2(0, 0); // Center of viewport (used during pointer lock)
    this.mousePos = new THREE.Vector2(-1000, -1000); // Screen cursor (used during orbit/overview)
    this.hoveredObject = null;

    // Track cursor for hover raycasting in overview mode
    this.renderer.domElement.addEventListener("pointermove", (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    // Viewport Click Handler
    this.renderer.domElement.addEventListener("click", (e) => {
      // If we clicked on an interactive utility (faucet, burner, beaker, bottle)
      if (this.hoveredObject) {
        if (this.hoveredObject.userData?.toggle) {
          this.hoveredObject.userData.toggle();
          return;
        }

        // If we clicked on an instrument dock from a distance -> Glide to it!
        if (this.hoveredObject.userData?.isTwinDock) {
          const cfg = this.hoveredObject.userData;
          this.activeMachineId = cfg.id;
          this._updateSidebarForInstrument(cfg);
          this.player.glideToStation(cfg.camConsole.pos, cfg.camConsole.look, `${cfg.name} (${cfg.tag})`);
          return;
        }
      }
    });
  }

  _updateSidebarForInstrument(cfg) {
    this.sidebarBadge.textContent = "OPERATOR";
    this.telemetryStationName.textContent = cfg.name;
    this.tStatus.textContent = "ONLINE";

    if (cfg.id === "dissolution_tester") {
      this.tParam1.textContent = "50 RPM";
      this.tTemp.textContent = "37.05 °C";
      this.tTimer.textContent = "00:15:00";
      this.sopTitle.textContent = "USP <711> Dissolution - Paddles";
      this.advisorText.textContent = "USP <711> active: Ensure bath temperature is 37.0°C ± 0.5°C before dropping dosage units. Pull 10 mL aliquot using filtered cannula.";
    } else if (cfg.id === "spectrophotometer") {
      this.tParam1.textContent = "590 nm";
      this.tTemp.textContent = "22.0 °C";
      this.tTimer.textContent = "Time-Drive";
      this.sopTitle.textContent = "NGSS HS-PS1-5 / AP Kinetics";
      this.advisorText.textContent = "Beer-Lambert Law: Ensure quartz cuvette optical faces are wiped with Kimwipes. Measure crystal violet absorbance decline at 590 nm.";
    } else if (cfg.id === "karl_fischer") {
      this.tParam1.textContent = "Drift: 12 uL/m";
      this.tTemp.textContent = "21.5 °C";
      this.tTimer.textContent = "Standby";
      this.sopTitle.textContent = "USP <921> Water Determination";
      this.advisorText.textContent = "Karl Fischer Titration: Conditioning complete. Drift is below 20 uL/min threshold. Inject sample using microsyringe through septum.";
    } else {
      this.tParam1.textContent = "Calibrated";
      this.tTemp.textContent = "21.0 °C";
      this.tTimer.textContent = "Ready";
      this.sopTitle.textContent = "Instrument Monograph";
      this.advisorText.textContent = `Operating ${cfg.name}. Use in-situ controls or press 'Thermal Slip' / 'USB CSV' to extract analytical data.`;
    }
  }

  _jumpToPresetLocation(val) {
    if (val === "reception") {
      this._handleNavDockClick("reception");
    } else if (val === "user_office" || val === "office") {
      this._handleNavDockClick("office");
    } else if (val === "conference") {
      this._handleNavDockClick("conference");
    } else if (val === "facultysuite") {
      this._handleNavDockClick("facultysuite");
    } else if (val === "breakroom") {
      this._handleNavDockClick("breakroom");
    } else if (val === "menslockers") {
      this._handleNavDockClick("menslockers");
    } else if (val === "womenslockers") {
      this._handleNavDockClick("womenslockers");
    } else if (val === "restroom") {
      this._handleNavDockClick("restroom");
    } else if (val === "exterior") {
      this._handleNavDockClick("exterior");
    } else {
      const dock = this.dockManager.getDockById(val);
      if (dock) {
        const cfg = dock.userData;
        this.activeMachineId = cfg.id;
        this._updateSidebarForInstrument(cfg);
        this.player.glideToStation(cfg.camConsole.pos, cfg.camConsole.look, `${cfg.name} (${cfg.tag})`);
      }
    }
  }

  _updateRaycasting() {
    const coords = (this.player && this.player.isPointerLocked) ? this.centerMouse : this.mousePos;
    this.raycaster.setFromCamera(coords, this.camera);

    // Objects to test: interactive utilities + clickable instrument dock hitboxes
    const targets = [
      ...this.utilities.interactiveObjects,
      ...this.dockManager.clickableDocks
    ];

    const intersects = this.raycaster.intersectObjects(targets, true);

    if (intersects.length > 0) {
      // Find top interactive parent
      let obj = intersects[0].object;
      while (obj && !obj.userData?.toggle && !obj.userData?.isTwinDock && obj.parent) {
        obj = obj.parent;
      }

      this.hoveredObject = obj;
      this.crosshair.classList.add("active");
      this.promptPill.classList.remove("is-hidden");

      if (obj.userData?.isHandle) {
        this.promptText.textContent = "Click to Toggle Running Water";
      } else if (obj.userData?.isCollar) {
        this.promptText.textContent = "Click to Adjust Flame Combustion";
      } else if (obj.userData?.isBeaker) {
        this.promptText.textContent = "Click to Titrate / Neutralize Solution";
      } else if (obj.userData?.isReagent) {
        this.promptText.textContent = `Inspect ${obj.userData.label}`;
      } else if (obj.userData?.isTwinDock) {
        this.promptText.textContent = `Click to Focus on ${obj.userData.name}`;
      }
    } else {
      this.hoveredObject = null;
      this.crosshair.classList.remove("active");
      this.promptPill.classList.add("is-hidden");
    }
  }

  _startLoop() {
    let lastTime = performance.now();

    const animate = (now) => {
      requestAnimationFrame(animate);
      const delta = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;

      // 1. Update Player Movement & Camera Lerp
      this.player.update(delta);

      // 2. Update Interactive Utilities (Flame flicker, water flow)
      this.utilities.update(now * 0.001);

      // 3. Update Center Raycasting
      this._updateRaycasting();

      // 4. Render Scene
      this.renderer.render(this.scene, this.camera);
    };

    requestAnimationFrame(animate);
  }
}

// Boot Grand Laboratory Application
window.addEventListener("DOMContentLoaded", () => {
  new GrandLabApp();
});
