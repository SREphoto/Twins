# Twins Technology Stack & Standards

| Layer | Technology | Usage & Standard |
| :--- | :--- | :--- |
| **3D Rendering** | Three.js (r128+) | WebGL runtime, PBR materials, lights, OrbitControls |
| **CAD Solid Modeling** | Blender 3.x / 4.x (`bpy`) | Procedural Python scripting, CAD boolean operations |
| **Parametric Modeling** | CadQuery / OpenCASCADE (optional) | Precise STEP exports and technical drawings |
| **Interactive Displays** | HTML5 Canvas + `CanvasTexture` | High-DPI dynamic instrument LCDs (`flipY = false`) |
| **Optics & Glass** | `MeshPhysicalMaterial` | Borosilicate 3.3 glass (IOR = 1.52, transmission = 0.96) |
| **Controllers** | Python 3 + `unittest` | Machine state machines, interlocks, and sensor logic |
| **Web Runtime UI** | Vanilla HTML5 / CSS3 / ES Modules | Modern glassmorphic instrument HUDs and sidebars |
| **Icons** | Lucide React / Lucide Vanilla | Standardized mechanical and electrical symbols |
| **Local Serving** | Python `http.server` | Lightweight, zero-dependency local runner on port 8765 |
| **Automation** | Node.js ESM (`.mjs`) | Governance validators, changelog linters, daily pulses |
| **Testing** | Playwright / Chrome DevTools MCP | Multi-angle automated visual QA (`twin-visual-qa`) |
