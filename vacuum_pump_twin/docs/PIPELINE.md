# Rebuild Archaeology & Build Pipeline

This document logs the development history and architectural transitions of the diaphragm vacuum pump twin package.

## Stage 0: 3D CAD Mockup
* **Mesh:** High-poly `vacuum_pump.glb` (8.7 MB) created from manual specs and dimensions.
* **Limitations:** Not suitable for interactive wetted-surface web viewing due to high asset size, lack of named part groups for engine animations (driveshaft, connecting rods, valves), and long load times.

## Stage 1: Monolithic Single-File Prototype (Anti-pattern)
* **Design:** Monolithic 1674-line `index.html` file that embedded all CSS and JavaScript.
* **Outcome:** Extremely difficult to maintain, lacked state machine separation, and loaded the heavy Stage 0 GLB at runtime, leading to poor page speeds and visual artifacts.

## Stage 2: Modular Conversion
* **Design:** Rebuilt from scratch per `.master` governance.
* **Outcome:** Split index.html into specialized modular components:
  * `index.html` — Thin container shell.
  * `style.css` — CSS design variables and layouts.
  * `app.js` — Core browser logic, UI, and physics tick mirror.
  * `vacuum_pump3d.js` — Procedural WebGL geometry builder (Three.js).
  * `sfx.js` — Synthesized Web Audio API effects.

## Stage 3: Procedural WebGL Implementation (Current)
* **Design:** Completely oil-free procedural geometry. Every assembly (housing, pump heads, eccentric cams, diaphragms, Bourdon tube gauge, motor, fan) is drawn in code.
* **Outcome:** Loads instantly (<50 ms), has zero asset file requests, supports full disassembly (exploded view) down to M4 washers/Belleville springs, and can be driven directly by the physics tick engine.
