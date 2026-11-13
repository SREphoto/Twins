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
import { MobilePerfBudget } from "./engine/MobilePerfBudget.js";

class GrandLabApp {
  constructor() {
    this.host = document.getElementById("canvas-host");
    this.width = this.host.clientWidth || window.innerWidth;
    this.height = this.host.clientHeight || window.innerHeight;

    // Detect mobile device profile (URL override, localStorage preference, or user agent)
    const urlParams = new URLSearchParams(window.location.search);
    const mobileParam = urlParams.get("mobile");
    const modeParam = urlParams.get("mode");
    const storedMobile = localStorage.getItem("sre_lab_mobile_mode");

    if (mobileParam === "1" || modeParam === "mobile") {
      this.isMobile = true;
    } else if (mobileParam === "0" || modeParam === "desktop") {
      this.isMobile = false;
    } else {
      // Phones/tablets: mobile user agent, iPadOS (reports as Mac but has touch), touch + small
      // screen, or touch + low device memory. A stored "desktop" choice is ignored on phones,
      // because the full desktop scene does not fit in a phone's memory and crashes the tab.
      const ua = navigator.userAgent || "";
      const touch = navigator.maxTouchPoints > 1 || "ontouchstart" in window;
      const smallScreen = Math.min(window.screen?.width || 9999, window.screen?.height || 9999) < 900 ||
                          window.innerWidth < 1024;
      const lowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
      const isPhone = /Android.+Mobile|iPhone|iPod|Windows Phone|Mobi/i.test(ua) || (touch && smallScreen && window.innerWidth < 768);
      const detected = isPhone ||
                       /Android|iPad/i.test(ua) ||
                       (/Macintosh/i.test(ua) && touch) ||
                       (touch && smallScreen) ||
                       (touch && lowMemory) ||
                       window.innerWidth < 768;
      if (storedMobile !== null && !isPhone) {
        this.isMobile = storedMobile === "1";
      } else {
        this.isMobile = detected;
      }
    }
    document.documentElement.classList.toggle("is-mobile-lab", this.isMobile);

    // Mobile: no audio at all (no AudioContext, no generated sound buffers)
    if (this.isMobile) {
      labAudio.disable();
    }

    this.isContextLost = false;

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

    this.camera = new THREE.PerspectiveCamera(65, this.width / this.height, 0.1, 950);

    const rendererOptions = {
      antialias: !this.isMobile,
      powerPreference: this.isMobile ? "default" : "high-performance",
      failIfMajorPerformanceCaveat: false
    };

    try {
      this.renderer = new THREE.WebGLRenderer(rendererOptions);
    } catch (e) {
      console.warn("Primary WebGL context unavailable, initializing standard WebGL fallback:", e);
      this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "default", failIfMajorPerformanceCaveat: false });
    }
    this.renderer.setSize(this.width, this.height);

    // On mobile devices, clamp pixel ratio to 1.25 to prevent VRAM exhaustion and iOS WebKit GPU crash
    const lowMem = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
    const maxDpr = this.isMobile ? (lowMem ? 1.0 : 1.25) : 2.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));

    // Mobile: no shadow maps (saves a 4096px shadow texture and a second pass over ~1,400 meshes)
    this.renderer.shadowMap.enabled = !this.isMobile;
    this.renderer.shadowMap.type = this.isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // Handle WebGL context loss gracefully (common during mobile backgrounding / memory pressure)
    this.renderer.domElement.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      console.warn("WebGL context lost. Pausing render loop...");
      this.isContextLost = true;
    }, false);

    this.renderer.domElement.addEventListener("webglcontextrestored", () => {
      console.log("WebGL context restored. Resuming...");
      this.isContextLost = false;
      this.renderer.setSize(this.width, this.height);
    }, false);

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
    // 1. Modern Architectural Shell (Walls, Windows, Roof, Sky IBL & Campus Grounds)
    // On mobile / low-VRAM devices: skips heavy external car GLBs (~80MB) and dense outer vegetation
    this.environment = new LabEnvironment3D(this.scene, this.renderer, {
      loadVehicles: !this.isMobile,
      isMobile: this.isMobile
    });

    // 2. SEFA Casework, Fume Hoods & Bespoke Procedural Executive Furniture
    this.casework = new LabCasework(this.scene, this.environment.colliders, { isMobile: this.isMobile });

    // 3. Interactive Utilities (Running water, Bunsen burners, reagents, power)
    this.utilities = new LabUtilities(this.scene, this.environment.colliders);

    // 4. Mount All 18 Instrument Digital Twins
    // On mobile: lazyLoad = true mounts lightweight procedural standby plinths and instantiates
    // only active machines on demand (with LRU eviction) to prevent WebGL context loss
    this.dockManager = new LabDockManager(this.scene, {
      lazyLoad: this.isMobile,
      maxActiveMachines: 1,
      onTwinStateChange: (twinId, isOn) => {
        if (this.mobilePerf) this.mobilePerf.refresh();
        this._onTwinStateChanged(twinId, isOn);
      }
    });

    // 5. Global Transmission Neutralization:
    // Three.js r160 WebGL2 transmission pass fails on mobile GPUs & WebKit with:
    // "TypeError: Failed to execute 'texSubImage2D' on 'WebGL2RenderingContext': Overload resolution failed"
    // Converting transmission to pure alpha-blended physical transparency avoids the pass entirely.
    this.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (m && m.transmission && m.transmission > 0) {
            m.transmission = 0;
            m.transparent = true;
            if (m.opacity === undefined || m.opacity >= 1.0) m.opacity = 0.50;
          }
        });
      }
    });

    // 6. Hybrid Player Navigation Engine (WASD + Click-to-Glide)
    this.player = new LabPlayerController(
      this.camera,
      this.renderer.domElement,
      this.environment.colliders,
      (zoneName, mode) => this._onZoneOrModeChange(zoneName, mode)
    );

    // 7. Mobile-only memory & GPU budget (texture cap, 4 nearest point lights, small far detail culling)
    if (this.isMobile) {
      this.mobilePerf = new MobilePerfBudget(this.scene, this.camera, {
        maxTextureSize: 1024,
        maxPointLights: 4
      });
      if (this.casework.assetsReadyPromise) {
        this.casework.assetsReadyPromise.then(() => this.mobilePerf.refresh());
      }
    }
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

    // On mobile devices, start with the assistant sidebar collapsed to maximize 3D viewport
    if (this.isMobile && this.sidebar) {
      this.sidebar.classList.add("is-collapsed");
      if (this.sidebarToggleIcon) {
        this.sidebarToggleIcon.textContent = "▶";
      }
    }

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

    // Lighting Atmosphere & Time-of-Day Mood Switcher (Daylight / Dusk / Night)
    this.moodButtons = document.querySelectorAll(".mood-btn");
    this.moodButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mood = btn.getAttribute("data-mood") || "daylight";
        this.setMood(mood);
        labAudio.playButtonClick();
      });
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

    // Mobile Eco Mode Toggle
    this.btnMobileToggle = document.getElementById("btn-mobile-toggle");
    this.mobileToggleLabel = document.getElementById("mobile-toggle-label");
    if (this.btnMobileToggle) {
      if (this.isMobile) {
        this.btnMobileToggle.classList.add("is-active");
        if (this.mobileToggleLabel) this.mobileToggleLabel.textContent = "ECO MOBILE (ON)";
      } else {
        this.btnMobileToggle.classList.remove("is-active");
        if (this.mobileToggleLabel) this.mobileToggleLabel.textContent = "ECO MOBILE";
      }

      this.btnMobileToggle.addEventListener("click", () => {
        const nextMode = !this.isMobile;
        localStorage.setItem("sre_lab_mobile_mode", nextMode ? "1" : "0");
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("mobile", nextMode ? "1" : "0");
        window.location.href = newUrl.toString();
      });
    }

    // Active Instrument Power On / Off Toggle (Mobile memory & GPU conservation)
    this.btnPowerToggle = document.getElementById("btn-power-toggle");
    this.powerIndicatorDot = document.getElementById("power-indicator-dot");
    this.powerStateText = document.getElementById("power-state-text");
    if (this.btnPowerToggle) {
      this.btnPowerToggle.addEventListener("click", () => {
        if (!this.activeMachineId) return;
        this.dockManager.toggleTwin(this.activeMachineId);
        const isOn = this.dockManager.isTwinOn(this.activeMachineId);
        this._updatePowerUI(isOn);
        const dock = this.dockManager.getDockById(this.activeMachineId);
        if (dock) {
          this._updateSidebarForInstrument(dock.userData);
        }
        labAudio.playButtonClick();
      });
    }

    // Virtual Touch Controls for Walk Mode
    this._initTouchControls();

    // Help controls modal alert
    document.getElementById("btn-help-controls").addEventListener("click", () => {
      alert(
        "Grand Laboratory Navigation Controls:\n\n" +
        "• Overview Mode: Left-click drag to orbit/rotate, right-click to pan, scroll wheel to zoom.\n" +
        "• Walk Mode: W, A, S, D or Arrow keys, click viewport to lock pointer.\n" +
        "• Touch Walk Mode: On-screen virtual D-Pad for forward, reverse, strafe & sprint.\n" +
        "• Click-to-Glide: Click any machine from across the room to inspect it up close.\n" +
        "• Mobile Mode: Exterior vehicles and idle machines are kept off to save memory.\n" +
        "• Escape / Overview Pill: Return to Grand Overview at any time.\n" +
        "• Assistant Sidebar: Press Tab to collapse/expand."
      );
    });
  }

  _initTouchControls() {
    this.touchControls = document.getElementById("mobile-touch-controls");
    this.btnExitTouchWalk = document.getElementById("btn-exit-touch-walk");

    if (this.btnExitTouchWalk) {
      this.btnExitTouchWalk.addEventListener("click", () => {
        this._handleNavDockClick("overview");
      });
    }

    const touchButtons = document.querySelectorAll(".touch-btn[data-dir]");
    touchButtons.forEach((btn) => {
      const dir = btn.getAttribute("data-dir");
      const setKey = (val) => {
        if (this.player && this.player.keys) {
          if (dir === "forward") this.player.keys.forward = val;
          else if (dir === "backward") this.player.keys.backward = val;
          else if (dir === "left") this.player.keys.left = val;
          else if (dir === "right") this.player.keys.right = val;
          else if (dir === "sprint") this.player.keys.sprint = val;
        }
      };

      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        setKey(true);
      }, { passive: false });

      btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        setKey(false);
      }, { passive: false });

      btn.addEventListener("mousedown", () => setKey(true));
      btn.addEventListener("mouseup", () => setKey(false));
      btn.addEventListener("mouseleave", () => setKey(false));
    });
  }

  _updatePowerUI(forceState) {
    if (!this.activeMachineId) return;
    const isOn = (forceState !== undefined) ? forceState : this.dockManager.isTwinOn(this.activeMachineId);

    if (this.powerIndicatorDot) {
      this.powerIndicatorDot.classList.toggle("is-on", isOn);
    }
    if (this.powerStateText) {
      this.powerStateText.textContent = isOn ? "POWERED ON" : "STANDBY (OFF)";
      this.powerStateText.style.color = isOn ? "var(--green, #00ffaa)" : "#ffaa00";
    }
    if (this.btnPowerToggle) {
      this.btnPowerToggle.classList.toggle("is-off", !isOn);
      this.btnPowerToggle.textContent = isOn ? "⚡ TURN OFF" : "⚡ TURN ON";
    }
    if (this.tStatus) {
      this.tStatus.textContent = isOn ? "ONLINE" : "STANDBY";
    }
  }

  _onTwinStateChanged(twinId, isOn) {
    if (twinId === this.activeMachineId) {
      this._updatePowerUI(isOn);
      const dock = this.dockManager.getDockById(twinId);
      if (dock) {
        this._updateSidebarForInstrument(dock.userData);
      }
    }
  }

  setMood(mood = "daylight") {
    const normalized = ["daylight", "dusk", "night"].includes(mood) ? mood : "daylight";
    if (this.moodButtons) {
      this.moodButtons.forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-mood") === normalized);
      });
    }
    if (this.environment) {
      this.environment.setAtmosphereMood(normalized);
    }
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
        new THREE.Vector3(34.85, 1.65, -2.15),
        new THREE.Vector3(35.10, 1.15, -6.20),
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
    } else if (dest === "patio") {
      this.player.glideToStation(
        new THREE.Vector3(31.2, 2.35, 18.2),
        new THREE.Vector3(31.2, 1.25, 11.8),
        "Outdoor Break Room Staff Patio & Pergola"
      );
    } else if (dest === "guest_office") {
      this.player.glideToStation(
        new THREE.Vector3(23.25, 1.65, -2.5),
        new THREE.Vector3(23.25, 1.15, -5.8),
        "Faculty Suite: Visiting Scientist Office"
      );
    } else if (dest === "admin_office") {
      this.player.glideToStation(
        new THREE.Vector3(26.75, 1.65, -2.5),
        new THREE.Vector3(26.75, 1.15, -5.8),
        "Faculty Suite: Lab Administrator Office"
      );
    } else if (dest === "instructor_office") {
      this.player.glideToStation(
        new THREE.Vector3(30.25, 1.65, -2.5),
        new THREE.Vector3(30.25, 1.15, -5.8),
        "Faculty Suite: Lead Instructor Office"
      );
    } else if (dest === "coldrooms") {
      this.player.glideToStation(
        new THREE.Vector3(5.2, 1.65, 4.4),
        new THREE.Vector3(5.2, 1.40, 8.2),
        "Zone 5: Walk-In +4°C Cold Room & -20°C Cryo Freezer"
      );
    } else if (dest === "exterior") {
      this.player.glideToStation(
        new THREE.Vector3(12.2, 5.4, -29.5),
        new THREE.Vector3(13.2, 2.0, -9.5),
        "Exterior Campus: Herringbone Plaza, Portico & Grounds"
      );
    } else if (dest === "city_street") {
      this.player.glideToStation(
        new THREE.Vector3(2.5, 5.4, -55.8),
        new THREE.Vector3(14.0, 1.2, -37.0),
        "Biotech Parkway: 4-Lane City Street & Campus Gate Traffic"
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

    if (this.touchControls) {
      if (mode === "walk" && this.isMobile) {
        this.touchControls.classList.remove("is-hidden");
      } else {
        this.touchControls.classList.add("is-hidden");
      }
    }

    // Dynamic Context Switching in Assistant Sidebar & Navigation Dock
    if (mode === "overview" || zoneName.includes("Grand Overview")) {
      this._setActiveNavPill("overview");
      this.sidebarBadge.textContent = "OVERVIEW";
      this.telemetryStationName.textContent = "Grand Complex Overview";
      this.tStatus.textContent = "18 TWINS READY";
      this.tParam1.textContent = "Casework Online";
      this.tTemp.textContent = "21.0 °C";
      this.tTimer.textContent = "Continuous";
      this.sopTitle.textContent = "Grand Chemistry & Pharma Complex";
      this.advisorText.textContent = "Grand Architectural Overview: Explore all 18 digital instrument twins, executive suites, spa locker rooms, and landscaped biotech campus. Use the mood switcher, bottom dock, or click any machine to inspect up close.";
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
    } else if (zoneName.includes("Staff Patio") || zoneName.includes("Pergola")) {
      this._setActiveNavPill("breakroom");
      this.sidebarBadge.textContent = "STAFF PATIO";
      this.telemetryStationName.textContent = "Outdoor Pergola Terrace";
      this.tStatus.textContent = "OPEN AIR";
      this.tParam1.textContent = "Cedar Pergola";
      this.tTemp.textContent = "19.5 °C";
      this.tTimer.textContent = "Festoon LED";
      this.sopTitle.textContent = "Outdoor Break Terrace";
      this.advisorText.textContent = "Outdoor Staff Patio: Herringbone brick terrace connected directly to the Break Room via French glass doors, featuring a cedar-and-steel pergola, café tables, and shade trees.";
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

    const updatePointerPos = (clientX, clientY) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mousePos.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.mousePos.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    // Track cursor for hover raycasting in overview mode
    this.renderer.domElement.addEventListener("pointermove", (e) => {
      updatePointerPos(e.clientX, e.clientY);
    });

    // Viewport Click / Tap Handler
    const handleInteract = (clientX, clientY) => {
      updatePointerPos(clientX, clientY);
      this._updateRaycasting();

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
          if (this.dockManager.lazyLoad && !this.dockManager.isTwinOn(cfg.id)) {
            this.dockManager.turnOnTwin(cfg.id);
          }
          this._updateSidebarForInstrument(cfg);
          this.player.glideToStation(cfg.camConsole.pos, cfg.camConsole.look, `${cfg.name} (${cfg.tag})`);
          return;
        }
      }
    };

    this.renderer.domElement.addEventListener("click", (e) => {
      handleInteract(e.clientX, e.clientY);
    });
  }

  _updateSidebarForInstrument(cfg) {
    this.activeMachineId = cfg.id;
    this.sidebarBadge.textContent = "OPERATOR";
    this.telemetryStationName.textContent = cfg.name;

    const isOn = this.dockManager.isTwinOn(cfg.id);
    this._updatePowerUI(isOn);

    if (!isOn) {
      this.tStatus.textContent = "STANDBY";
      this.tParam1.textContent = "Power Standby";
      this.tTemp.textContent = "Ambient";
      this.tTimer.textContent = "00:00:00";
      this.sopTitle.textContent = "Instrument Monograph (Standby)";
      this.advisorText.textContent = `${cfg.name} is currently in Standby / Off mode to preserve GPU memory on mobile. Tap '⚡ TURN ON' to load and run the digital twin.`;
      return;
    }

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
    } else if (val === "guest_office" || val === "admin_office" || val === "instructor_office") {
      this._handleNavDockClick(val);
    } else if (val === "conference") {
      this._handleNavDockClick("conference");
    } else if (val === "facultysuite") {
      this._handleNavDockClick("facultysuite");
    } else if (val === "breakroom") {
      this._handleNavDockClick("breakroom");
    } else if (val === "patio") {
      this._handleNavDockClick("patio");
    } else if (val === "coldrooms") {
      this._handleNavDockClick("coldrooms");
    } else if (val === "menslockers") {
      this._handleNavDockClick("menslockers");
    } else if (val === "womenslockers") {
      this._handleNavDockClick("womenslockers");
    } else if (val === "restroom") {
      this._handleNavDockClick("restroom");
    } else if (val === "exterior" || val === "city_street") {
      this._handleNavDockClick(val);
    } else {
      const lookupId = val === "dissolution" ? "dissolution_tester" : val;
      const dock = this.dockManager.getDockById(lookupId);
      if (dock) {
        const cfg = dock.userData;
        this.activeMachineId = cfg.id;
        if (this.dockManager.lazyLoad && !this.dockManager.isTwinOn(cfg.id)) {
          this.dockManager.turnOnTwin(cfg.id);
        }
        this._updateSidebarForInstrument(cfg);
        this.player.glideToStation(cfg.camConsole.pos, cfg.camConsole.look, `${cfg.name} (${cfg.tag})`);
      }
    }
  }

  _updateRaycasting() {
    const coords = (this.player && this.player.isPointerLocked) ? this.centerMouse : this.mousePos;
    this.raycaster.setFromCamera(coords, this.camera);

    // Objects to test: interactive utilities + casework interactive objects + clickable instrument dock hitboxes
    const targets = [
      ...this.utilities.interactiveObjects,
      ...(this.casework?.interactiveObjects || []),
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
      } else if (obj.userData?.isUVCabinet) {
        this.promptText.textContent = obj.userData.isOpen ? "Click to Close UV-C Sanitizing Cabinet" : "Click to Open UV-C Cabinet & Inspect Goggles";
      } else if (obj.userData?.isGloveStation) {
        this.promptText.textContent = `Dispense ${obj.userData.label}`;
      } else if (obj.userData?.isSoapDispenser) {
        this.promptText.textContent = "Click to Dispense Antimicrobial Soap";
      } else if (obj.userData?.isGasTurret) {
        this.promptText.textContent = "Click to Toggle Laboratory Gas Supply";
      } else if (obj.userData?.isPetriDish) {
        this.promptText.textContent = `Inspect Culture: ${obj.userData.label}`;
      } else if (obj.userData?.isDesiccator) {
        this.promptText.textContent = "Inspect Vacuum Desiccator Chamber";
      } else if (obj.userData?.isFilterFlask) {
        this.promptText.textContent = "Inspect Büchner Vacuum Filtration";
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
      if (this.isContextLost) return;
      const delta = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;

      // 1. Update Player Movement & Camera Lerp
      this.player.update(delta);

      // 2. Update Smart Auto-Hiding Roof & Environment State
      this.environment.update(now * 0.001, this.camera, this.player.mode);

      // 3. Update Interactive Utilities (Flame flicker, water flow)
      this.utilities.update(now * 0.001);

      // 4. Update Center Raycasting
      this._updateRaycasting();

      if (this.mobilePerf) this.mobilePerf.update();

      // 5. Render Scene
      this.renderer.render(this.scene, this.camera);
    };

    requestAnimationFrame(animate);
  }
}

// Boot Grand Laboratory Application
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", () => {
    new GrandLabApp();
  });
} else {
  new GrandLabApp();
}
