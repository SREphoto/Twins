/**
 * LabPlayerController.js — Hybrid FPS & Click-to-Glide Camera Kinematics Engine
 * 
 * Features:
 * - Free First-Person Navigation (WASD + mouse look / Pointer Lock) at eye-level Y = 1.65m
 * - AABB boundary collision against benches, walls, office desks, and fume hoods
 * - Dynamic footstep audio based on surface (terrazzo vs. carpet)
 * - Click-to-Glide Camera Interpolation: Click any machine, office desk, or conference table
 *   from across the room to smoothly lerp directly into the operator viewpoint
 * - Interactive raycasting on handles, burners, beakers, printers, and USB sticks
 */
import * as THREE from "three";
import { labAudio } from "./LabSFXMixer.js";

export class LabPlayerController {
  constructor(camera, domElement, colliders = [], onZoneChange = null) {
    this.camera = camera;
    this.domElement = domElement;
    this.colliders = colliders;
    this.onZoneChange = onZoneChange;

    // Player State
    this.mode = "walk"; // "walk" or "station_focus"
    this.position = new THREE.Vector3(13.0, 1.65, -7.0); // Spawn in Entrance Airlock
    this.camera.position.copy(this.position);
    this.cameraTarget = new THREE.Vector3(13.0, 1.65, -4.0); // Looking forward into lab

    // Rotation
    this.pitch = 0;
    this.yaw = Math.PI; // Looking North (-Z into room)
    this.isPointerLocked = false;

    // Movement keys
    this.keys = { forward: false, backward: false, left: false, right: false, sprint: false };
    this.velocity = new THREE.Vector3();
    this.speed = 2.6; // m/s
    this.sprintMultiplier = 1.6;

    // Camera Glide Lerp State
    this.isLerping = false;
    this.lerpStartPos = new THREE.Vector3();
    this.lerpEndPos = new THREE.Vector3();
    this.lerpStartTarget = new THREE.Vector3();
    this.lerpEndTarget = new THREE.Vector3();
    this.lerpProgress = 0;
    this.lerpDuration = 1.2; // seconds

    // Audio & Footsteps
    this.stepTimer = 0;
    this.currentZone = "Zone 8: Thermal Air-Lock Vestibule";

    // Raycasting for interactive 3D objects
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this._setupEventListeners();
  }

  _setupEventListeners() {
    // Keyboard Listeners
    window.addEventListener("keydown", (e) => {
      if (this.mode === "station_focus" && e.code === "Escape") {
        this.stepBackToWalk();
        return;
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

    // Pointer Lock & Mouse Look
    this.domElement.addEventListener("click", () => {
      if (this.mode === "walk" && !this.isPointerLocked) {
        this.domElement.requestPointerLock?.();
      }
    });

    document.addEventListener("pointerlockchange", () => {
      this.isPointerLocked = document.pointerLockElement === this.domElement;
    });

    window.addEventListener("mousemove", (e) => {
      if (this.isPointerLocked && this.mode === "walk") {
        const sens = 0.0022;
        this.yaw -= e.movementX * sens;
        this.pitch -= e.movementY * sens;
        this.pitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.pitch));
      }
    });
  }

  // Glide Camera to a Station Pose
  glideToStation(targetPos, lookAtTarget, stationName = "Focused Station") {
    this.mode = "station_focus";
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }

    this.isLerping = true;
    this.lerpProgress = 0;
    this.lerpStartPos.copy(this.camera.position);
    this.lerpEndPos.copy(targetPos);

    this.lerpStartTarget.copy(this.cameraTarget);
    this.lerpEndTarget.copy(lookAtTarget);

    this.currentZone = stationName;
    if (this.onZoneChange) this.onZoneChange(stationName, "station_focus");
  }

  // Smoothly step back into Walk Mode
  stepBackToWalk() {
    this.mode = "walk";
    this.isLerping = true;
    this.lerpProgress = 0;

    // Step back 1.2m along look vector
    const dir = new THREE.Vector3().subVectors(this.cameraTarget, this.camera.position).normalize();
    const returnPos = new THREE.Vector3().copy(this.camera.position).sub(dir.clone().multiplyScalar(1.2));
    returnPos.y = 1.65; // Return to eye level

    this.lerpStartPos.copy(this.camera.position);
    this.lerpEndPos.copy(returnPos);

    this.lerpStartTarget.copy(this.cameraTarget);
    this.lerpEndTarget.copy(returnPos.clone().add(dir.multiplyScalar(3.0)));

    if (this.onZoneChange) this.onZoneChange(this._detectZone(returnPos.x, returnPos.z), "walk");
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

    if (this.mode === "walk") {
      this._updateWalkMovement(delta);
    }
  }

  _updateWalkMovement(delta) {
    const move = new THREE.Vector3();
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();

    if (this.keys.forward) move.add(forward);
    if (this.keys.backward) move.sub(forward);
    if (this.keys.left) move.sub(right);
    if (this.keys.right) move.add(right);

    if (move.lengthSq() > 0) {
      move.normalize();
      const actualSpeed = this.speed * (this.keys.sprint ? this.sprintMultiplier : 1.0);
      const nextPos = this.camera.position.clone().addScaledVector(move, actualSpeed * delta);

      // Check AABB Collisions against environment benches and walls
      if (!this._checkCollision(nextPos)) {
        this.camera.position.copy(nextPos);
      }

      // Footstep audio
      this.stepTimer += delta * (this.keys.sprint ? 1.5 : 1.0);
      if (this.stepTimer > 0.45) {
        const isCarpet = this.camera.position.x > 8.0 && this.camera.position.z > 0;
        labAudio.playFootstep(isCarpet ? "carpet" : "terrazzo");
        this.stepTimer = 0;
      }
    }

    // Update Look Target based on yaw & pitch
    const lookDir = new THREE.Vector3(
      -Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * Math.cos(this.pitch)
    ).normalize();

    this.cameraTarget.copy(this.camera.position).add(lookDir);
    this.camera.lookAt(this.cameraTarget);

    // Track active zone
    const detectedZone = this._detectZone(this.camera.position.x, this.camera.position.z);
    if (detectedZone !== this.currentZone) {
      this.currentZone = detectedZone;
      if (this.onZoneChange) this.onZoneChange(detectedZone, "walk");
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
    if (x > 8.0 && z > 4.5) return "Zone 9: User's Private Executive Office";
    if (x > 8.0 && z > 0 && z <= 4.5) return "Zone 10: Executive Conference Room";
    if (x > 8.0 && z <= 0 && z > -4.5) return "Zone 7: Restroom & Sanitation Suite";
    if (x > 8.0 && z <= -4.5) return "Zone 8: Thermal Air-Lock Vestibule & Entrance";
    if (x <= 8.0 && x > 2.0 && z > 1.0) return "Zone 5: Chemical & Reagent Storage Vault";
    if (x <= 8.0 && x > 2.0 && z <= 1.0) return "Zone 4: Controlled Atmosphere & Glove Box Bay";
    if (x <= 2.0 && x > -5.0 && z > 1.0) return "Zone 3: Sample Prep & Lyophilization Suite";
    if (x <= -5.0 && z > 1.0) return "Zone 2: Synthesis & Reaction Bay";
    return "Zone 1: Main Analytical & Pharmaceutical QC Hall";
  }
}
