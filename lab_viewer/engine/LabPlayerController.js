/**
 * LabPlayerController.js — Hybrid FPS, Mobile Walking Tool & Click-to-Glide Camera Kinematics Engine
 * 
 * Features:
 * - Architectural Overview & Station Inspection via OrbitControls (pinch-to-zoom disabled on mobile walk tool)
 * - Free First-Person Navigation (WASD + mouse look / Pointer Lock) at eye-level Y = 1.65m
 * - Mobile Dual-Zone Walking Tool: Invisible right-side Walking Speed Zone (relX >= 0.73: drag up for forward speed,
 *   drag down to slow down and back up) paired with full-screen damped touch aiming on the remainder of the viewport (multi-touch isolated)
 * - Free-Aim 3D Roam ("free_walk") & Ground-Locked Walk ("walk") with smooth X/Z wall collision sliding
 * - Dynamic footstep audio based on surface (terrazzo vs. carpet)
 * - Click-to-Glide Camera Interpolation to any machine, room, or office workstation
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { labAudio } from "./LabSFXMixer.js";

export class LabPlayerController {
  constructor(camera, domElement, colliders = [], onZoneChange = null, options = {}) {
    this.camera = camera;
    this.domElement = domElement;
    this.colliders = colliders;
    this.onZoneChange = onZoneChange;
    this.isMobile = !!options.isMobile;
    this.walkToolEnabled = options.walkToolEnabled !== undefined ? !!options.walkToolEnabled : this.isMobile;
    this.onWalkStateChange = typeof options.onWalkStateChange === "function" ? options.onWalkStateChange : null;

    // OrbitControls for Architectural Overview & Machine Inspection
    this.orbitControls = new OrbitControls(this.camera, this.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.08;
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent clipping through floor
    this.orbitControls.minDistance = 1.0;
    this.orbitControls.maxDistance = 220.0;

    // Default Overview Pose (Grand Campus & L-Wing Complex Sightline)
    this.position = new THREE.Vector3(-22.0, 24.5, -62.0);
    this.camera.position.copy(this.position);
    this.cameraTarget = new THREE.Vector3(8.0, 1.8, -10.0);
    this.orbitControls.target.copy(this.cameraTarget);
    this.camera.lookAt(this.cameraTarget);

    // Derive initial yaw & pitch from overview look vector so switching to aim/walk is seamless
    const initDir = new THREE.Vector3().subVectors(this.cameraTarget, this.camera.position).normalize();
    this.yaw = Math.atan2(-initDir.x, -initDir.z);
    this.pitch = Math.asin(Math.max(-0.95, Math.min(0.95, initDir.y)));
    this.targetYaw = this.yaw;
    this.targetPitch = this.pitch;

    // First-Person Walk & Speed Zone Kinematics
    this.isPointerLocked = false;
    this.keys = { forward: false, backward: false, left: false, right: false, sprint: false };
    this.velocity = new THREE.Vector3();
    this.speed = 2.8; // m/s at 1.0x walk throttle
    this.sprintMultiplier = 1.6;
    this.walkThrottle = 0; // Normalized [-1.0 reverse .. +1.6 sprint forward]
    this.targetWalkThrottle = 0;
    this.cruiseLocked = false;
    this.isThrottleDragging = false;
    this.walkElevationMode = "free"; // "free" (3D aim vector) or "ground" (locked at Y = 1.65m)

    // Multi-touch isolated tracking:
    // - Left/center viewport (relX < 0.73): Aim camera yaw/pitch
    // - Invisible right-side speed zone (relX >= 0.73): Drag UP = forward, drag DOWN = slow/reverse
    this.speedZoneSplitX = 0.73;
    this.speedTouchId = null;
    this._speedStartY = 0;
    this._speedMoveDist = 0;
    this._speedEngaged = false;
    this.aimTouchId = null;
    this._aimLastX = 0;
    this._aimLastY = 0;
    this._aimMoveDist = 0;
    this._lastAimDragEndTime = 0;

    // Camera Glide Lerp State
    this.isLerping = false;
    this.lerpStartPos = new THREE.Vector3();
    this.lerpEndPos = new THREE.Vector3();
    this.lerpStartTarget = new THREE.Vector3();
    this.lerpEndTarget = new THREE.Vector3();
    this.lerpProgress = 0;
    this.lerpDuration = 1.1; // seconds

    // Audio & Footsteps
    this.stepTimer = 0;
    this.currentZone = "Grand Overview · Architectural Complex";

    // Raycasting for interactive 3D objects
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Prevent browser native pinch/scroll gestures on WebGL canvas
    this.domElement.style.touchAction = "none";

    // Start in Free-Walk Aim mode at the Overview pose when Walking Tool is active on mobile
    if (this.walkToolEnabled) {
      this.mode = "free_walk";
      this.orbitControls.enabled = false;
    } else {
      this.mode = "overview"; // "overview", "station_focus", "walk", or "free_walk"
    }
    this._syncOrbitTouchPolicy();

    this._setupEventListeners();
  }

  _syncOrbitTouchPolicy() {
    if (!this.orbitControls) return;
    if (this.walkToolEnabled || this.isMobile) {
      // Disable pinch-to-zoom for movement; use Walking Speed Zone instead
      this.orbitControls.enableZoom = false;
      this.orbitControls.enablePan = false;
      this.orbitControls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.ROTATE
      };
    } else {
      this.orbitControls.enableZoom = true;
      this.orbitControls.enablePan = true;
      this.orbitControls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
    }
  }

  setWalkToolEnabled(enabled) {
    this.walkToolEnabled = !!enabled;
    this._syncOrbitTouchPolicy();

    if (this.walkToolEnabled) {
      if (this.mode === "overview") {
        this.enterWalkFromCurrentPose("free");
      }
    } else {
      this.setWalkThrottle(0, true);
      if (this.mode === "free_walk" || this.mode === "walk") {
        this.mode = "overview";
        this.orbitControls.target.copy(this.cameraTarget);
        this.orbitControls.enabled = true;
        this.orbitControls.update();
        if (this.onZoneChange) this.onZoneChange(this.currentZone, this.mode);
      }
    }
    this._emitWalkState();
  }

  setWalkThrottle(normalizedValue, immediate = false) {
    const clamped = Math.max(-1.0, Math.min(1.6, Number(normalizedValue) || 0));
    this.targetWalkThrottle = Math.abs(clamped) < 0.04 ? 0 : clamped;
    if (immediate) {
      this.walkThrottle = this.targetWalkThrottle;
    }
    this._emitWalkState();
  }

  setThrottleDragging(active) {
    this.isThrottleDragging = !!active;
    if (!this.isThrottleDragging && !this.cruiseLocked) {
      this.setWalkThrottle(0);
    }
  }

  setCruiseLocked(locked) {
    this.cruiseLocked = !!locked;
    if (!this.cruiseLocked && !this.isThrottleDragging) {
      this.setWalkThrottle(0);
    }
    this._emitWalkState();
  }

  setWalkElevationMode(elevMode) {
    this.walkElevationMode = elevMode === "ground" ? "ground" : "free";
    if (this.walkElevationMode === "ground") {
      if (this.camera.position.y > 2.2) {
        const dropPos = new THREE.Vector3(this.camera.position.x, 1.65, this.camera.position.z);
        const lookDir = new THREE.Vector3(
          -Math.sin(this.yaw) * Math.cos(this.pitch),
          0,
          -Math.cos(this.yaw) * Math.cos(this.pitch)
        );
        if (lookDir.lengthSq() < 0.001) lookDir.set(0, 0, -1);
        lookDir.normalize();
        this.glideToStation(dropPos, dropPos.clone().addScaledVector(lookDir, 4.0), this._detectZone(dropPos.x, dropPos.z), "walk");
      } else {
        this.mode = "walk";
        this.orbitControls.enabled = false;
        if (this.onZoneChange) this.onZoneChange(this._detectZone(this.camera.position.x, this.camera.position.z), "walk");
      }
    } else {
      this.mode = "free_walk";
      this.orbitControls.enabled = false;
      if (this.onZoneChange) this.onZoneChange(this._detectZone(this.camera.position.x, this.camera.position.z), "free_walk");
    }
    this._emitWalkState();
  }

  getActiveLinearSpeedMps() {
    const altScale = this.walkElevationMode === "free"
      ? 1.0 + Math.min(4.2, Math.max(0, this.camera.position.y - 2.0) * 0.22)
      : 1.0;
    return this.walkThrottle * this.speed * altScale;
  }

  wasRecentlyDragging() {
    return this.aimTouchId !== null || this._speedEngaged || (performance.now() - this._lastAimDragEndTime) < 280;
  }

  _emitWalkState() {
    if (this.onWalkStateChange) {
      this.onWalkStateChange({
        mode: this.mode,
        walkToolEnabled: this.walkToolEnabled,
        throttle: this.targetWalkThrottle,
        actualThrottle: this.walkThrottle,
        speedMps: this.getActiveLinearSpeedMps(),
        cruiseLocked: this.cruiseLocked,
        elevationMode: this.walkElevationMode
      });
    }
  }

  _syncYawPitchFromCamera() {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    dir.normalize();
    this.yaw = Math.atan2(-dir.x, -dir.z);
    this.pitch = Math.asin(Math.max(-0.95, Math.min(0.95, dir.y)));
    this.targetYaw = this.yaw;
    this.targetPitch = this.pitch;
  }

  // Seamlessly enter walk/free-walk from the exact current camera pose (used when dragging Speed Zone)
  enterWalkFromCurrentPose(preferredElevation = null) {
    this.isLerping = false;
    this.orbitControls.enabled = false;
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }
    this._syncYawPitchFromCamera();

    const elev = preferredElevation || (this.camera.position.y > 2.2 ? "free" : "ground");
    this.walkElevationMode = elev;
    this.mode = elev === "ground" ? "walk" : "free_walk";

    const zone = this.camera.position.y > 12.0
      ? "Grand Overview · Free-Aim Roam"
      : this._detectZone(this.camera.position.x, this.camera.position.z);
    this.currentZone = zone;
    if (this.onZoneChange) this.onZoneChange(zone, this.mode);
    this._emitWalkState();
  }

  _setupEventListeners() {
    // Keyboard Listeners
    window.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        if (this.mode === "walk" || this.mode === "free_walk" || this.mode === "station_focus") {
          this.glideToOverview();
          return;
        }
      }

      // If user presses movement keys, enter walk mode if currently in overview
      const isMoveKey = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code);
      if (isMoveKey && this.mode !== "walk" && this.mode !== "free_walk" && !this.isLerping) {
        this.enterWalkMode();
      }

      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          this.keys.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          this.keys.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          this.keys.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          this.keys.right = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          this.keys.sprint = true;
          break;
      }
    });

    window.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          this.keys.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          this.keys.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          this.keys.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          this.keys.right = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          this.keys.sprint = false;
          break;
      }
    });

    // Pointer Lock & Mouse Look (Only during Walk Mode on desktop)
    this.domElement.addEventListener("click", () => {
      if ((this.mode === "walk" || this.mode === "free_walk") && !this.isPointerLocked && !this.isMobile) {
        if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
          try {
            this.domElement.requestPointerLock?.();
          } catch (e) {}
        }
      }
    });

    document.addEventListener("pointerlockchange", () => {
      this.isPointerLocked = document.pointerLockElement === this.domElement;
    });

    window.addEventListener("mousemove", (e) => {
      if (this.isPointerLocked && (this.mode === "walk" || this.mode === "free_walk")) {
        const sens = 0.0022;
        this.targetYaw -= e.movementX * sens;
        this.targetPitch -= e.movementY * sens;
        this.targetPitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.targetPitch));
        this.yaw = this.targetYaw;
        this.pitch = this.targetPitch;
      }
    });

    // Multi-Touch Isolated Controls on Canvas (Nothing drawn on screen):
    // - Right zone (relX >= speedZoneSplitX): Invisible Walking Speed Zone (drag UP = forward, DOWN = slow/reverse)
    // - Remainder (relX < speedZoneSplitX): Camera Aim (yaw & pitch)
    this.domElement.addEventListener("touchstart", (e) => {
      if (!this.walkToolEnabled) return;
      const rect = this.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const relX = (touch.clientX - rect.left) / rect.width;

        if (relX >= this.speedZoneSplitX) {
          if (this.speedTouchId === null) {
            this.speedTouchId = touch.identifier;
            this._speedStartY = touch.clientY;
            this._speedMoveDist = 0;
            this._speedEngaged = false;
            if (this.mode === "station_focus") {
              e.stopPropagation();
            }
          }
        } else if ((this.mode === "walk" || this.mode === "free_walk") && this.aimTouchId === null) {
          this.aimTouchId = touch.identifier;
          this._aimLastX = touch.clientX;
          this._aimLastY = touch.clientY;
          this._aimMoveDist = 0;
        }
      }
    }, { capture: true, passive: false });

    window.addEventListener("touchmove", (e) => {
      if (this.speedTouchId === null && this.aimTouchId === null) return;
      const rect = this.domElement.getBoundingClientRect();

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];

        if (touch.identifier === this.speedTouchId) {
          if (e.cancelable) e.preventDefault();
          const dy = this._speedStartY - touch.clientY;
          this._speedMoveDist = Math.max(this._speedMoveDist, Math.abs(dy));

          if (!this._speedEngaged && this._speedMoveDist >= 5) {
            this._speedEngaged = true;
            if ((this.mode !== "walk" && this.mode !== "free_walk") || this.isLerping) {
              this.enterWalkFromCurrentPose();
            }
            this.setThrottleDragging(true);
          }

          if (this._speedEngaged) {
            const halfSpan = Math.max(58, Math.min(130, rect.height * 0.34));
            const raw = dy / halfSpan;
            const throttle = raw >= 0 ? Math.min(1.6, raw * 1.45) : Math.max(-1.0, raw * 1.15);
            this.setWalkThrottle(Math.abs(throttle) < 0.05 ? 0 : throttle);
          }
        } else if (touch.identifier === this.aimTouchId && (this.mode === "walk" || this.mode === "free_walk")) {
          if (e.cancelable) e.preventDefault();
          const dx = touch.clientX - this._aimLastX;
          const dy = touch.clientY - this._aimLastY;
          this._aimLastX = touch.clientX;
          this._aimLastY = touch.clientY;
          this._aimMoveDist += Math.hypot(dx, dy);

          const minDim = Math.max(320, Math.min(window.innerWidth, window.innerHeight));
          const sens = 1.65 / minDim;
          this.targetYaw -= dx * sens;
          this.targetPitch -= dy * sens;
          this.targetPitch = Math.max(-Math.PI / 2.25, Math.min(Math.PI / 2.25, this.targetPitch));
        }
      }
    }, { passive: false });

    const releaseTouches = (e) => {
      if (this.speedTouchId === null && this.aimTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.speedTouchId) {
          if (this._speedMoveDist > 8) {
            this._lastAimDragEndTime = performance.now();
          }
          this.speedTouchId = null;
          this._speedEngaged = false;
          this.setThrottleDragging(false);
        } else if (touch.identifier === this.aimTouchId) {
          if (this._aimMoveDist > 8) {
            this._lastAimDragEndTime = performance.now();
          }
          this.aimTouchId = null;
        }
      }
    };
    window.addEventListener("touchend", releaseTouches, { passive: true });
    window.addEventListener("touchcancel", releaseTouches, { passive: true });

    const clearAllTouches = () => {
      this.speedTouchId = null;
      this.aimTouchId = null;
      this._speedEngaged = false;
      this.setThrottleDragging(false);
    };
    window.addEventListener("blur", clearAllTouches);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearAllTouches();
    });
  }

  // Glide Camera to a Station Pose
  glideToStation(targetPos, lookAtTarget, stationName = "Focused Station", mode = "station_focus") {
    this.mode = mode;
    this.orbitControls.enabled = false;
    this.speedTouchId = null;
    this.aimTouchId = null;
    this._speedEngaged = false;
    this.isThrottleDragging = false;
    this.setWalkThrottle(0, true);
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }

    if (mode === "walk") {
      this.walkElevationMode = "ground";
    } else if (mode === "free_walk") {
      this.walkElevationMode = "free";
    }

    this.isLerping = true;
    this.lerpProgress = 0;
    this.lerpStartPos.copy(this.camera.position);
    this.lerpEndPos.copy(targetPos);

    this.lerpStartTarget.copy(this.cameraTarget);
    this.lerpEndTarget.copy(lookAtTarget);

    this.currentZone = stationName;
    if (this.onZoneChange) this.onZoneChange(stationName, mode);
    this._emitWalkState();
  }

  // Glide to Grand Overview
  glideToOverview() {
    const targetMode = this.walkToolEnabled ? "free_walk" : "overview";
    this.glideToStation(
      new THREE.Vector3(-22.0, 24.5, -62.0),
      new THREE.Vector3(8.0, 1.8, -10.0),
      "Grand Overview · Architectural Complex",
      targetMode
    );
  }

  // Instant Teleport / Precise Pose Setting (used by automated QA & Viewport Evaluators)
  setCameraPose(pos, target, mode = "station_focus") {
    this.mode = mode;
    this.isLerping = false;
    this.camera.position.copy(pos);
    this.cameraTarget.copy(target);
    this.orbitControls.target.copy(target);
    this.camera.lookAt(target);
    this._syncYawPitchFromCamera();
    if (mode === "walk" || mode === "free_walk") {
      this.orbitControls.enabled = false;
      this.walkElevationMode = mode === "walk" ? "ground" : "free";
    } else {
      this.orbitControls.enabled = true;
      this.orbitControls.update();
    }
    this._emitWalkState();
  }

  // Transition to First-Person Walk Mode
  enterWalkMode(pos = null, target = null) {
    let startPos = pos;
    let lookTarget = target;

    if (!startPos) {
      if (this.camera.position.y > 2.2) {
        startPos = new THREE.Vector3(4.0, 1.65, -3.0);
        lookTarget = target || new THREE.Vector3(-2.0, 1.65, -3.0);
      } else {
        startPos = new THREE.Vector3(this.camera.position.x, 1.65, this.camera.position.z);
        const curDir = new THREE.Vector3();
        this.camera.getWorldDirection(curDir);
        curDir.y = 0;
        if (curDir.lengthSq() < 0.001) curDir.set(-1, 0, 0);
        curDir.normalize();
        lookTarget = target || startPos.clone().addScaledVector(curDir, 3.0);
      }
    }

    this.glideToStation(startPos, lookTarget, this._detectZone(startPos.x, startPos.z), "walk");
  }

  // Smoothly step back from station focus
  stepBackToWalk() {
    if (this.camera.position.y > 2.2) {
      this.glideToOverview();
      return;
    }

    const dir = new THREE.Vector3().subVectors(this.cameraTarget, this.camera.position).normalize();
    const returnPos = new THREE.Vector3().copy(this.camera.position).sub(dir.clone().multiplyScalar(1.5));
    returnPos.y = 1.65; // Return to eye level

    this.glideToStation(
      returnPos,
      returnPos.clone().add(dir.multiplyScalar(3.0)),
      this._detectZone(returnPos.x, returnPos.z),
      "walk"
    );
  }

  update(delta) {
    if (this.isLerping) {
      this.lerpProgress += delta / this.lerpDuration;
      if (this.lerpProgress >= 1.0) {
        this.lerpProgress = 1.0;
        this.isLerping = false;
        this.camera.position.copy(this.lerpEndPos);
        this.cameraTarget.copy(this.lerpEndTarget);
        this.camera.lookAt(this.cameraTarget);

        if (this.mode !== "walk" && this.mode !== "free_walk") {
          this.orbitControls.target.copy(this.cameraTarget);
          this.orbitControls.enabled = true;
        } else {
          // Initialize yaw and pitch from look vector
          const dir = new THREE.Vector3().subVectors(this.cameraTarget, this.camera.position).normalize();
          this.yaw = Math.atan2(-dir.x, -dir.z);
          this.pitch = Math.asin(Math.max(-0.95, Math.min(0.95, dir.y)));
          this.targetYaw = this.yaw;
          this.targetPitch = this.pitch;
        }
      } else {
        // Cubic Hermite easing
        const t = this.lerpProgress;
        const ease = t * t * (3 - 2 * t);

        this.camera.position.lerpVectors(this.lerpStartPos, this.lerpEndPos, ease);
        this.cameraTarget.lerpVectors(this.lerpStartTarget, this.lerpEndTarget, ease);
        this.camera.lookAt(this.cameraTarget);
      }
      return;
    }

    if (this.mode === "walk" || this.mode === "free_walk") {
      this._updateWalkMovement(delta);
    } else {
      this.orbitControls.update();
      this.cameraTarget.copy(this.orbitControls.target);
    }
  }

  _moveWithSlideCollision(nextPos) {
    if (!this._checkCollision(nextPos)) {
      this.camera.position.copy(nextPos);
      return true;
    }
    const slideX = this.camera.position.clone();
    slideX.x = nextPos.x;
    slideX.y = nextPos.y;
    if (!this._checkCollision(slideX)) {
      this.camera.position.copy(slideX);
      return true;
    }
    const slideZ = this.camera.position.clone();
    slideZ.z = nextPos.z;
    slideZ.y = nextPos.y;
    if (!this._checkCollision(slideZ)) {
      this.camera.position.copy(slideZ);
      return true;
    }
    return false;
  }

  _updateWalkMovement(delta) {
    // Damped touch aim interpolation
    const aimAlpha = 1 - Math.exp(-24 * delta);
    this.yaw += (this.targetYaw - this.yaw) * aimAlpha;
    this.pitch += (this.targetPitch - this.pitch) * aimAlpha;

    // Damped walk speed throttle interpolation
    const throttleAlpha = 1 - Math.exp(-14 * delta);
    this.walkThrottle += (this.targetWalkThrottle - this.walkThrottle) * throttleAlpha;
    if (Math.abs(this.walkThrottle) < 0.004 && Math.abs(this.targetWalkThrottle) < 0.004) {
      this.walkThrottle = 0;
    }

    const forwardXZ = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
    const rightXZ = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();
    const lookDir = new THREE.Vector3(
      -Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * Math.cos(this.pitch)
    ).normalize();

    let keyFwd = 0;
    if (this.keys.forward) keyFwd += 1;
    if (this.keys.backward) keyFwd -= 1;
    let keyStrafe = 0;
    if (this.keys.right) keyStrafe += 1;
    if (this.keys.left) keyStrafe -= 1;

    const keyMult = this.keys.sprint ? this.sprintMultiplier : 1.0;
    const effectiveFwd = keyFwd !== 0 ? keyFwd * keyMult : this.walkThrottle;
    const effectiveStrafe = keyStrafe * keyMult;

    let moved = false;
    if (Math.abs(effectiveFwd) > 0.001 || Math.abs(effectiveStrafe) > 0.001) {
      const isGroundWalk = this.walkElevationMode === "ground" || this.mode === "walk";
      const altScale = isGroundWalk ? 1.0 : 1.0 + Math.min(4.2, Math.max(0, this.camera.position.y - 2.0) * 0.22);

      const moveStep = new THREE.Vector3();
      if (isGroundWalk) {
        moveStep.addScaledVector(forwardXZ, effectiveFwd * this.speed * delta);
      } else {
        moveStep.addScaledVector(lookDir, effectiveFwd * this.speed * altScale * delta);
      }
      moveStep.addScaledVector(rightXZ, effectiveStrafe * this.speed * altScale * delta);

      const nextPos = this.camera.position.clone().add(moveStep);
      nextPos.x = Math.max(-120, Math.min(120, nextPos.x));
      nextPos.z = Math.max(-120, Math.min(120, nextPos.z));

      if (isGroundWalk) {
        nextPos.y = this.camera.position.y + (1.65 - this.camera.position.y) * Math.min(1, delta * 10);
        moved = this._moveWithSlideCollision(nextPos);
      } else {
        nextPos.y = Math.max(1.65, Math.min(90.0, nextPos.y));
        if (nextPos.y <= 2.15) {
          moved = this._moveWithSlideCollision(nextPos);
        } else {
          this.camera.position.copy(nextPos);
          moved = true;
        }
      }

      // Footstep audio only when walking near ground level
      if (moved && this.camera.position.y <= 2.1) {
        const pace = Math.max(0.4, Math.min(1.8, Math.hypot(effectiveFwd, effectiveStrafe)));
        this.stepTimer += delta * pace;
        if (this.stepTimer > 0.45) {
          const isCarpet = this.camera.position.x > 8.0 && this.camera.position.z > 0;
          labAudio.playFootstep(isCarpet ? "carpet" : "terrazzo");
          this.stepTimer = 0;
        }
      }
    } else if (this.walkElevationMode === "ground" || this.mode === "walk") {
      // Gently settle to eye level if dropped into ground mode
      this.camera.position.y += (1.65 - this.camera.position.y) * Math.min(1, delta * 8);
    }

    // Update Look Target based on damped yaw & pitch
    this.cameraTarget.copy(this.camera.position).add(lookDir);
    this.camera.lookAt(this.cameraTarget);

    // Emit live speed updates while decelerating/accelerating
    if (this.onWalkStateChange && (Math.abs(this.walkThrottle) > 0.001 || Math.abs(this.targetWalkThrottle) > 0.001)) {
      this._emitWalkState();
    }

    // Track active zone
    const detectedZone = this.camera.position.y > 12.0
      ? "Grand Overview · Free-Aim Roam"
      : this._detectZone(this.camera.position.x, this.camera.position.z);
    if (detectedZone !== this.currentZone) {
      this.currentZone = detectedZone;
      if (this.onZoneChange) this.onZoneChange(detectedZone, this.mode);
    }
  }

  _checkCollision(pos) {
    // Player cylindrical radius 0.35m
    const r = 0.35;
    const playerBox = new THREE.Box3(
      new THREE.Vector3(pos.x - r, 0.1, pos.z - r),
      new THREE.Vector3(pos.x + r, 1.8, pos.z + r)
    );

    for (const collider of this.colliders) {
      if (collider.intersectsBox(playerBox)) {
        return true;
      }
    }
    return false;
  }

  _detectZone(x, z) {
    if (z > 9.5 && x >= 25.0 && x <= 36.0) return "Outdoor Break Room Staff Patio & Pergola";
    if (x <= -14.5 && x >= -22.0 && z >= 22.0 && z <= 27.5) return "Cold Storage Suite: Walk-In Refrigerator (+4°C) & Freezer (-20°C)";
    if (z > 9.5 && z <= 18.3 && x >= 1.0 && x <= 8.0) return "Zone 8: VC-E Electron Microscopy Suite (ZEISS GeminiSEM 500)";
    if (z > 9.5 && z <= 27.5 && x >= -22.0 && x <= 8.0) return "Zone 2B: North High-Bay Research L-Wing";
    if (z < -9.5 || (z > 9.5 && (x < -22.0 || x > 8.0 || z > 27.5)) || x < -22.0 || x > 44.0 || (x > 38.0 && Math.abs(z) > 8.0)) {
      return "Exterior Campus: Biotech Grounds & Parking";
    }
    if (x >= 38.0 && x <= 44.0 && z >= -8.0 && z <= 8.0) return "Zone 14: Women's Locker Room, Changing Suite & Showers";
    if (x >= 16.0 && x <= 27.0 && z > 1.5) return "Zone 10: Grand Boardroom & Conference Suite";
    if (x > 27.0 && x <= 33.5 && z > 1.5) return "Zone 11: Staff Break Room & Kitchenette";
    if (x > 33.5 && x < 38.0 && z > 1.5) return "Zone 12: Executive Restroom & Sanitation";
    if (x >= 16.0 && x < 38.0 && z >= -1.5 && z <= 1.5) return "Central Circulation Spine & Gallery Hallway";
    if (x >= 16.0 && x < 21.5 && z < -1.5) return "Zone 9: User's Private Executive Office";
    if (x >= 21.5 && x < 25.0 && z < -1.5) return "Faculty Suite: Guest Office";
    if (x >= 25.0 && x < 28.5 && z < -1.5) return "Faculty Suite: Administration Office";
    if (x >= 28.5 && x < 32.0 && z < -1.5) return "Faculty Suite: Instructor's Office";
    if (x >= 32.0 && x < 38.0 && z < -1.5) return "Zone 13: Men's Locker Room & Showers";
    if (x >= 8.0 && x < 16.0) return "Zone 6: Grand Entrance Atrium & Waiting Lounge";
    if (x <= 8.0 && x > 2.0 && z > 1.0) return "Zone 5: Chemical & Reagent Storage Vault";
    if (x <= 8.0 && x > 2.0 && z <= 1.0) return "Zone 4: Controlled Atmosphere & Glove Box Bay";
    if (x <= 2.0 && x > -5.0 && z > 1.0) return "Zone 3: Sample Prep & Lyophilization Suite";
    if (x <= -5.0 && z > 1.0) return "Zone 2: Synthesis & Reaction Bay";
    return "Zone 1: Main Analytical & Pharmaceutical QC Hall";
  }
}
