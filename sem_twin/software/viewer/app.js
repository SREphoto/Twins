/**
 * app.js — Standalone Interactive Viewer for Zeiss Gemini FE-SEM Digital Twin
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { buildSEMModel } from "./sem3d.js";

class SEMApp {
  constructor() {
    this.canvas3D = document.getElementById("c3d");
    this.container = document.getElementById("viewport-container");
    this.microCanvas = document.getElementById("micrograph-canvas");
    this.mctx = this.microCanvas.getContext("2d");

    // Specimen library definitions
    this.specimens = [
      {
        name: "Drosophila melanogaster (Compound Eye)",
        type: "ommatidia",
        baseMag: 15000,
        defEHT: "5.00 kV",
        desc: "Hexagonal crystalline lens facets and interfacet mechanosensory bristles.",
        scaleUm: 1.0
      },
      {
        name: "Ambrosia artemisiifolia (Ragweed Pollen)",
        type: "pollen",
        baseMag: 8500,
        defEHT: "3.00 kV",
        desc: "Spherical echinate pollen grain with conical surface exine micro-spines.",
        scaleUm: 5.0
      },
      {
        name: "Morpho rhetenor (Iridescent Wing Scale)",
        type: "photonic",
        baseMag: 32000,
        defEHT: "5.00 kV",
        desc: "Parallel Christmas-tree photonic ridges producing structural interference blue.",
        scaleUm: 0.5
      },
      {
        name: "Intel 7nm FinFET Gate Cross-Section",
        type: "semiconductor",
        baseMag: 85000,
        defEHT: "15.00 kV",
        desc: "Trigate silicon channel fins, high-k metal gate stack, and cobalt barrier vias.",
        scaleUm: 0.05
      },
      {
        name: "Zinc Oxide (ZnO) Nanorod Tetrapods",
        type: "nanomaterial",
        baseMag: 65000,
        defEHT: "10.00 kV",
        desc: "Single-crystal wurtzite ZnO nanorods radiating from a central tetrahedral core.",
        scaleUm: 0.2
      }
    ];

    this.currentSpecimen = 0;
    this.mag = 15000;
    this.eht = 5.0;
    this.contrast = 65;
    this.brightness = 50;
    this.detector = "InLens_Secondary";
    this.isPowered = true;

    this._init3D();
    this._initUI();
    this._renderMicrograph();
  }

  _init3D() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060910);

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(1.6, 1.4, 2.0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas3D, antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    this.controls = new OrbitControls(this.camera, this.canvas3D);
    this.controls.target.set(0, 0.9, 0);
    this.controls.enableDamping = true;

    // Studio Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(amb);

    const dir1 = new THREE.DirectionalLight(0xe0f2fe, 1.2);
    dir1.position.set(3, 5, 4);
    this.scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0x38bdf8, 0.5);
    dir2.position.set(-3, 2, -3);
    this.scene.add(dir2);

    // Floor Grid
    const grid = new THREE.GridHelper(6, 24, 0x38bdf8, 0x1e293b);
    grid.position.y = 0;
    this.scene.add(grid);

    // Build Procedural SEM Twin
    this.semModel = buildSEMModel();
    this.scene.add(this.semModel);

    // Window Resize
    window.addEventListener("resize", () => {
      const nw = this.container.clientWidth;
      const nh = this.container.clientHeight;
      this.camera.aspect = nw / nh;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(nw, nh);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  _initUI() {
    // Camera Viewport Shortcuts
    document.querySelectorAll(".btn-cam").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.cam;
        if (mode === "iso") {
          this.camera.position.set(1.6, 1.4, 2.0);
          this.controls.target.set(0, 0.9, 0);
        } else if (mode === "column") {
          this.camera.position.set(-0.25, 1.5, 0.9);
          this.controls.target.set(-0.25, 1.4, 0.05);
        } else if (mode === "chamber") {
          this.camera.position.set(-0.25, 1.05, 0.85);
          this.controls.target.set(-0.25, 0.95, 0.05);
        } else if (mode === "console") {
          this.camera.position.set(0.35, 1.15, 0.75);
          this.controls.target.set(0.35, 1.05, 0);
        }
      });
    });

    // Specimen Buttons
    const specBtns = document.querySelectorAll(".btn-specimen");
    specBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        specBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        this.currentSpecimen = parseInt(btn.dataset.idx, 10);
        const spec = this.specimens[this.currentSpecimen];
        this.mag = spec.baseMag;
        document.getElementById("slider-mag").value = this.mag;
        document.getElementById("val-mag").textContent = `${this.mag.toLocaleString()}×`;
        this._renderMicrograph();
      });
    });

    // Magnification Slider
    const sliderMag = document.getElementById("slider-mag");
    sliderMag.addEventListener("input", (e) => {
      this.mag = parseInt(e.target.value, 10);
      document.getElementById("val-mag").textContent = `${this.mag.toLocaleString()}×`;
      document.getElementById("badge-mag").textContent = `MAG: ${this.mag.toLocaleString()}×`;
      this._renderMicrograph();
    });

    // Voltage Slider
    const sliderEHT = document.getElementById("slider-eht");
    sliderEHT.addEventListener("input", (e) => {
      this.eht = parseFloat(e.target.value);
      document.getElementById("val-eht").textContent = `${this.eht.toFixed(1)} kV`;
      document.getElementById("badge-eht").textContent = `EHT: ${this.eht.toFixed(2)} kV`;
      this._renderMicrograph();
    });

    // Detector Buttons
    const detBtns = document.querySelectorAll(".btn-det");
    detBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        detBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        this.detector = btn.dataset.det;
        document.getElementById("pill-detector").textContent = btn.textContent.split(" ")[0];
        this._renderMicrograph();
      });
    });

    // Power Button
    const pwrBtn = document.getElementById("btn-power");
    pwrBtn.addEventListener("click", () => {
      this.isPowered = !this.isPowered;
      pwrBtn.textContent = this.isPowered ? "PWR ON" : "PWR OFF";
      pwrBtn.classList.toggle("is-active", this.isPowered);
      this._renderMicrograph();
    });
  }

  _renderMicrograph() {
    const w = this.microCanvas.width;
    const h = this.microCanvas.height;
    const ctx = this.mctx;
    const spec = this.specimens[this.currentSpecimen];

    if (!this.isPowered) {
      ctx.fillStyle = "#020408";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "center";
      ctx.fillText("BEAM BLANKED / ELECTRON COLUMN STANDBY", w / 2, h / 2);
      return;
    }

    // Base vacuum scan field with authentic scanline raster & noise
    ctx.fillStyle = "#0c1017";
    ctx.fillRect(0, 0, w, h);

    // Render Procedural Micrograph Pattern based on active specimen monograph
    if (spec.type === "ommatidia") {
      this._drawOmmatidia(ctx, w, h);
    } else if (spec.type === "pollen") {
      this._drawPollen(ctx, w, h);
    } else if (spec.type === "photonic") {
      this._drawPhotonicRidges(ctx, w, h);
    } else if (spec.type === "semiconductor") {
      this._drawFinFET(ctx, w, h);
    } else if (spec.type === "nanomaterial") {
      this._drawNanotetrapods(ctx, w, h);
    }

    // Apply EDS Spectrum Overlay if EDS detector active
    if (this.detector === "EDS_Silicon_Drift") {
      this._drawEDSSpectrum(ctx, w, h);
    }

    // Update Bottom HUD Bar
    document.getElementById("hud-specimen").textContent = `SPECIMEN: ${spec.name}`;
    document.getElementById("hud-params").textContent = `EHT = ${this.eht.toFixed(2)} kV · WD = 8.5 mm · Signal A = ${this.detector.split("_")[0]}`;
    document.getElementById("hud-mag").textContent = `${this.mag.toLocaleString()} ×`;

    // Dynamic Scale Bar Calculation
    const effectiveScale = (spec.scaleUm * (spec.baseMag / this.mag)).toFixed(2);
    document.getElementById("scale-label").textContent = `${effectiveScale} µm`;
  }

  _drawOmmatidia(ctx, w, h) {
    const hexR = Math.max(12, Math.min(60, 24 * (this.mag / 15000)));
    const rows = 14;
    const cols = 20;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * hexR * 1.75 + (r % 2 ? hexR * 0.85 : 0);
        const cy = r * hexR * 1.5;

        const grad = ctx.createRadialGradient(cx - hexR * 0.2, cy - hexR * 0.2, 2, cx, cy, hexR);
        grad.addColorStop(0, "#cbd5e1");
        grad.addColorStop(0.7, "#475569");
        grad.addColorStop(1, "#0f172a");

        ctx.fillStyle = grad;
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const ang = (a * Math.PI) / 3;
          const x = cx + Math.cos(ang) * hexR;
          const y = cy + Math.sin(ang) * hexR;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Mechanosensory Interfacet Bristle at alternate vertices
        if ((r + c) % 3 === 0) {
          ctx.strokeStyle = "#f8fafc";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx + hexR * 0.8, cy);
          ctx.lineTo(cx + hexR * 1.4, cy - hexR * 0.5);
          ctx.stroke();
        }
      }
    }
  }

  _drawPollen(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2 - 20;
    const rad = Math.min(w, h) * 0.32 * (this.mag / 8500);

    const grad = ctx.createRadialGradient(cx - rad * 0.3, cy - rad * 0.3, rad * 0.1, cx, cy, rad);
    grad.addColorStop(0, "#e2e8f0");
    grad.addColorStop(0.6, "#64748b");
    grad.addColorStop(1, "#0f172a");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();

    // Spines (Exine echinate micro-spikes)
    const numSpines = 48;
    for (let i = 0; i < numSpines; i++) {
      const angle = (i * Math.PI * 2) / numSpines;
      const x1 = cx + Math.cos(angle) * rad;
      const y1 = cy + Math.sin(angle) * rad;
      const x2 = cx + Math.cos(angle) * (rad + 25);
      const y2 = cy + Math.sin(angle) * (rad + 25);

      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  _drawPhotonicRidges(ctx, w, h) {
    const count = 18;
    const spacing = w / count;

    for (let i = 0; i < count; i++) {
      const x = i * spacing;
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();

      // Horizontal Christmas-tree lamellae cross-ribs
      for (let y = 15; y < h; y += 18) {
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 12, y);
        ctx.lineTo(x + 12, y);
        ctx.stroke();
      }
    }
  }

  _drawFinFET(ctx, w, h) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(40, 60, w - 80, h - 140);

    // Silicon Fins
    const numFins = 6;
    const finW = 35;
    const gap = 55;
    for (let f = 0; f < numFins; f++) {
      const fx = 80 + f * (finW + gap);
      ctx.fillStyle = "#60a5fa";
      ctx.fillRect(fx, 120, finW, 220);

      // Gate Oxide Barrier
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 4;
      ctx.strokeRect(fx - 4, 116, finW + 8, 228);
    }
  }

  _drawNanotetrapods(ctx, w, h) {
    const pods = [
      { x: w / 2, y: h / 2 - 20, len: 140 },
      { x: w / 4, y: h / 3, len: 80 },
      { x: (w * 3) / 4, y: (h * 2) / 3, len: 110 }
    ];

    pods.forEach((p) => {
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 8;
      for (let a = 0; a < 4; a++) {
        const ang = (a * Math.PI) / 2 + Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + Math.cos(ang) * p.len, p.y + Math.sin(ang) * p.len);
        ctx.stroke();
      }
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  _drawEDSSpectrum(ctx, w, h) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(20, 20, w - 40, 160);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, w - 40, 160);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px monospace";
    ctx.fillText("EDS ENERGY DISPERSIVE X-RAY SPECTRUM (COUNTS vs keV)", 35, 45);

    // Spectrum Line
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(35, 160);
    const peaks = [
      { x: 80, label: "C Ka 0.28" },
      { x: 140, label: "O Ka 0.52" },
      { x: 260, label: "Si Ka 1.74" },
      { x: 420, label: "Au La 9.71" }
    ];
    for (let x = 35; x < w - 40; x += 4) {
      let y = 160 - Math.random() * 6;
      peaks.forEach((pk) => {
        const dist = Math.abs(x - pk.x);
        if (dist < 12) y -= (12 - dist) * 8;
      });
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "10px monospace";
    peaks.forEach((pk) => {
      ctx.fillText(pk.label, pk.x - 15, 80);
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new SEMApp();
});
