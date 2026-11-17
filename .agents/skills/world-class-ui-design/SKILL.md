---
name: world-class-ui-design
description: Anti-slop UI/UX craftsmanship, 10-site curated design benchmarks from Formula 1 Apex Legends, GLB submesh hygiene, and ChemMate Swiss Archival Paper aesthetic standards.
---

# World-Class Digital Twin & Educational UI Design Skill

This skill exists to **permanently eliminate generic AI dark-box UI slop, cluttered 3D scene billboards, and broken GLB prop geometry**. Every web interface and 3D scene overlay in `Twins` must achieve human-curated editorial and industrial craft.

---

## 1. The 10 Curated Human Design Benchmarks (Inherited from Formula 1 Apex Legends)

Before designing any landing portal, modal, HUD, or mobile companion, audit against these 10 standards:

1. **Recent.design** — Physical PBR lighting, tactile real-time 3D craft, sculpted anodized metals & archival paper surfaces rather than flat colored boxes.
2. **Godly (godly.website)** — Intentional atmospheric hierarchy, luminous precision focus, zero harsh clipping edges.
3. **Minimal Gallery** — Visual restraint, generous negative space, crisp 1px hairline dividers (`1px solid`), and strict typographic scale contrast.
4. **Mobbin** — Production-grade ergonomics: clean single-row tab headers, zero wrapped icon pills, unmistakable active states, predictable panel drawers.
5. **SiteInspire** — Spatial discipline separating the uninterrupted 3D stage from editorial chrome (no sprawling 380px sidebars obstructing 3D lessons).
6. **Awwwards** — Storytelling-first transitions: instant studio camera framing inside the scene, SVG leader-line callouts anchored directly to real 3D coordinates, and audio-synced state progression.
7. **Figma Community** — Semantic design tokens (never hardcoded one-off hex colors). Use token suites (`--cm-paper`, `--cm-ink`, `--cm-red` or Grand Lab `--bg`, `--cyan`, `--border`).
8. **Deck.gallery** — High-density tabular telemetry grids (`IBM Plex Mono`, `font-variant-numeric: tabular-nums`) so updating measurements (`5.0012 g`, `0.287 Abs`) NEVER cause jitter.
9. **Posts.design** — Unmistakable visual brand signatures:
   - **Grand Lab Complex Free-Explore**: Dark Biotech Engineering (`#070a0f`, `#00d4e8`, crisp glassmorphic panels).
   - **ChemMate Interactive Teaching Lab & Companion**: **Swiss Archival Paper Scientific Broadsheet** (`#F4F1EA` warm paper ground, `#FBF9F4` elevated cards, `#141413` obsidian grotesque ink, `#D6D0C4` 1px hairline rules, `#D61F1F` Swiss crimson accent square `[+]` / CTAs / leader pins, `#16794B` verified PASS state, registration `+` corner crosshairs).
10. **Land-book** — Unambiguous focal CTA hierarchy: one primary high-contrast CTA per card (`START LESSON →` / `ACTUATE IN 3D →`), paired with clean secondary triggers.

---

## 2. Hard Anti-Garbage Rules (Zero Tolerance)

1. **NEVER Ship Generic Dark Neon Card Slop in Editorial Contexts**:
   - In ChemMate Teaching Mode and `companion.html`, dark navy rectangles with cyan glowing borders (`#0b111e` + `#00f0ff`) are strictly **PROHIBITED**. Use the ChemMate Swiss Archival Paper design system (`#F4F1EA` / `#FBF9F4` / `#141413` / `#D61F1F`).
2. **NEVER Wrap or Truncate Header Badges**:
   - No 2-line clipped pills like `STEP 1 OF \n 4` or overflowing lesson names pushing `Pair Phone` / `Hide` vertically. Enforce `white-space: nowrap`, `flex-shrink: 0`, explicit width budgets, and clean ellipsis.
3. **NEVER Spawn Unrequested Floating 3D QR Billboards or Text Banners on Benches**:
   - Clean laboratory countertops must contain only real scientific instruments, glassware, reagents, and authentic hardware docks.
   - QR pairing codes belong inside an on-demand popover/modal inside the iPhone Companion HUD — **never** as giant glowing 3D placards sitting beside microscopes or balances.
   - Replace floating 3D sprite banners above buttons with **clean 2D projected SVG leader-line callouts** (Swiss crimson dot + elbow hairline + mono badge) paired with direct 3D mesh emissive pulsing.
4. **MANDATORY GLB Scene Graph Inspection Before Mounting (`CAM_PROP_CLOSEUP`)**:
   - Third-party `.glb` assets (Sketchfab, PolyHaven, etc.) frequently pack **duplicate side-by-side variants** (e.g., two phone copies facing opposite directions) or pre-baked demo textures (e.g., racecar wallpapers).
   - **ALWAYS** inspect node/mesh bounding boxes via Python (`trimesh` / `struct` + JSON GLTF chunk parser) before loading in Three.js.
   - Prune duplicate meshes/nodes, center the single canonical asset, normalize & re-orient its screen UVs when using `CanvasTexture` (`flipY = false`), hide any fallback primitive once GLB loads, and inspect a tight **close-up CDP render** (`view_file`) proving single clean geometry + upright live display.
5. **Instant Interior Framing on Guided Lesson Launch**:
   - Launching any `?lesson=` URL or lesson card MUST snap cleanly to the curated bench studio camera (`player.setCameraPose(...)` -> `glideToStation` adjustment) BEFORE any slow transitions so the student NEVER sees an empty campus parking lot on load.
6. **Non-Destructive Separation Between Grand Lab & ChemMate**:
   - Keep `lab_viewer/` Grand Lab Free-Explore dark engineering UI and standalone `*_twin/` viewers intact. Apply ChemMate Swiss Archival styling strictly via `body.chemmate-lesson-mode` (and inside `companion.html` / `#iphone-companion-hud`).
