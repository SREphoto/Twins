#!/usr/bin/env node

/**
 * 👑 OGA Validator (oga_validator.mjs)
 * Deterministic Mechanical Gate Linter for the Twins Repo
 *
 * Verifies that any digital twin adheres strictly to:
 * 1. Semantic Part Taxonomy Contract (Body_*, UI_LCD, Btn_*, Fastener_*, Foot_Leveling_*, Badge_SREdesigns)
 * 2. High-DPI Dynamic Canvas Texture UV Orientation (flipY = false, upright & unmirrored UVs)
 * 3. Tactile Button Silkscreen Completeness (all buttons must have silkscreen labels)
 * 4. Badge Location & Orientation Contract (lower frame, non-obtrusive, upright)
 * 5. Physical Circuit Continuity (Duplex outlet box, NEMA plug, SJTOW cord, hard power cutoff)
 * 6. Internal Mechanics & Electronics Bay (motherboard, MCU, RAM, SSD, PSU, heatsink, cooling fan)
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/oga_validator.mjs <twin_directory_name>');
  console.error('Example: node scripts/oga_validator.mjs muffle_furnace_twin');
  process.exit(1);
}

const twinDir = args[0];
const repoRoot = process.cwd();
const targetPath = path.resolve(repoRoot, twinDir);

if (!fs.existsSync(targetPath)) {
  console.error(`[OGA-LINT FATAL] Directory not found: ${targetPath}`);
  process.exit(1);
}

console.log(`\n👑 ========================================================`);
console.log(`👑 OGA MECHANICAL GATE VALIDATOR: ${twinDir}`);
console.log(`👑 Enforcing Centrifuge Gold Standard Real-World Fidelity`);
console.log(`👑 ========================================================\n`);

let totalErrors = 0;
let totalWarnings = 0;

function check(ruleName, condition, failMsg, isWarning = false) {
  if (!condition) {
    if (isWarning) {
      console.warn(`⚠️  [WARN] ${ruleName}: ${failMsg}`);
      totalWarnings++;
    } else {
      console.error(`❌ [FAIL] ${ruleName}: ${failMsg}`);
      totalErrors++;
    }
  } else {
    console.log(`✅ [PASS] ${ruleName}`);
  }
}

// Aggregate 3D engine file and any modular CAD submodules in software/viewer/
// (excluding app.js, sfx.js, and *.test.js so puzzle subagents can use clean ES modules)
const viewerDir = path.join(targetPath, 'software', 'viewer');
const filesInViewer = fs.existsSync(viewerDir) ? fs.readdirSync(viewerDir) : [];

const file3dName = filesInViewer.find(f => f.endsWith('3d.js'));
const fileAppName = filesInViewer.find(f => f === 'app.js');
const fileIndexName = filesInViewer.find(f => f === 'index.html');
const fileStyleName = filesInViewer.find(f => f === 'style.css');
const module3dFiles = filesInViewer.filter(
  f => f.endsWith('.js') && f !== 'app.js' && f !== 'sfx.js' && !f.endsWith('.test.js')
);

if (!file3dName) {
  console.error(`❌ [FAIL] Missing 3D engine file in ${viewerDir} (*3d.js)`);
  process.exit(1);
}

const raw3d = module3dFiles
  .map(f => fs.readFileSync(path.join(viewerDir, f), 'utf-8'))
  .join('\n');
const rawApp = fileAppName ? fs.readFileSync(path.join(viewerDir, fileAppName), 'utf-8') : '';
const contentHtml = fileIndexName ? fs.readFileSync(path.join(viewerDir, fileIndexName), 'utf-8') : '';
const contentCss = fileStyleName ? fs.readFileSync(path.join(viewerDir, fileStyleName), 'utf-8') : '';

function stripCommentsAndTokens(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:\\])\/\/.*$/gm, '$1')
    .replace(/^.*\.userData\.validatorToken.*$/gm, '');
}

const content3d = stripCommentsAndTokens(raw3d);
const contentApp = stripCommentsAndTokens(rawApp);

// Extract explicit scene-graph .name = "..." or template literals assigned on Three.js nodes
const assignedNames = [];
for (const m of content3d.matchAll(/\.name\s*=\s*["'`]([^"'`]+)["'`]/g)) {
  assignedNames.push(m[1]);
}
const assignedNameBlob = assignedNames.join('\n');

// 0. Anti-Gaming & Authenticity Gate
console.log(`--- GATE 0: Anti-Gaming & Code Authenticity ---`);
check(
  'GAMING-01: Zero validatorToken Cheats',
  !/validatorToken/.test(raw3d) && !/validatorToken/.test(rawApp),
  'Detected .userData.validatorToken string-gaming hacks! Every semantic identifier must exist on real 3D geometry.'
);

check(
  'GAMING-02: Genuine Three.js Node Naming',
  assignedNames.length >= 12,
  `Expected >= 12 real Three.js node '.name =' assignments; found only ${assignedNames.length}.`
);

// 1. Semantic Part Taxonomy Contract
console.log(`\n--- GATE 1: Semantic Part Taxonomy Contract ---`);
check(
  'TAX-01: Structural Chassis/Cabinet',
  /Body_Chassis|Body_CabinetShell|Body_BaseFrame/.test(assignedNameBlob) ||
  /Body_Chassis|Body_CabinetShell|Body_BaseFrame/.test(content3d),
  'Missing structural unibody chassis or cabinet mesh (Body_Chassis / Body_CabinetShell)'
);

check(
  'TAX-02: Dynamic LCD Screen Quad',
  /UI_LCD/.test(assignedNameBlob),
  'Missing dedicated dynamic LCD quad with actual node .name = "UI_LCD"'
);

check(
  'TAX-03: Tactile Instrument Buttons',
  /Btn_/.test(content3d) && (/Btn_/.test(assignedNameBlob) || /buttons\.set/.test(content3d)),
  'Missing dedicated physical tactile buttons (Btn_*)'
);

check(
  'TAX-04: Genuine 3D Fasteners',
  /(Fastener_|makeSocketHeadCapScrew|makeHexSocketBolt|createHexSocketScrew)/.test(content3d),
  'Missing genuine 3D fasteners (every screw must have real physical socket depth)'
);

check(
  'TAX-05: Leveling Feet at Datum Y=0',
  /Foot_Leveling_/.test(assignedNameBlob),
  'Missing threaded leveling feet resting at datum Y=0 with node .name = "Foot_Leveling_*"'
);

check(
  'TAX-06: SREdesigns Brand Certification Badge',
  /Badge_SREdesigns/.test(assignedNameBlob) && /makeSREdesignsBadge/.test(content3d),
  'Missing official SREdesigns Brand Certification Badge (Badge_SREdesigns / makeSREdesignsBadge)'
);

// 2. Physical Circuit Continuity Contract
console.log(`\n--- GATE 2: Physical Circuit Continuity Contract ---`);
check(
  'PWR-01: Bench Duplex Receptacle Box',
  /Power_Receptacle_Duplex/.test(assignedNameBlob),
  'Missing bench duplex outlet box (node .name = "Power_Receptacle_Duplex")'
);

check(
  'PWR-02: Molded NEMA AC Power Plug',
  /Power_Plug_NEMA|Part_PowerPlugNEMA/.test(assignedNameBlob),
  'Missing molded NEMA 5-15P AC power plug (node .name = "Power_Plug_NEMA")'
);

check(
  'PWR-03: Heavy-Duty SJTOW Power Cord',
  /Power_Cord_SJTOW|Cable_ACPowerCord/.test(assignedNameBlob) || /makeCable|TubeGeometry/.test(content3d),
  'Missing heavy-duty 3-conductor SJTOW power cord mesh'
);

check(
  'PWR-04: Hard Continuity Logic Cutoff',
  /isPluggedIn/.test(contentApp),
  'Missing hard electrical continuity logic (isPluggedIn && switchOn) in app.js'
);

// 3. High-DPI Dynamic Canvas Texture & Upright Silkscreen UVs
console.log(`\n--- GATE 3: Canvas UV Orientation & Silkscreen Typography ---`);
check(
  'UV-01: flipY = false & sRGB Enforcement',
  (/flipY\s*=\s*false/.test(content3d) || /flipY\s*=\s*false/.test(contentApp)) &&
  /colorSpace\s*=\s*THREE\.SRGBColorSpace/.test(content3d),
  'Dynamic LCD/panel CanvasTextures must enforce flipY = false and THREE.SRGBColorSpace (DIAG-005)'
);

check(
  'UV-02: Upright & Unmirrored UV Inversion (No Negative Scale Hacks)',
  (/setY\(i,\s*1\.0\s*-\s*.*getY|createDecalQuad|makeOperatorFacingQuadGeo/.test(content3d)) &&
  !/scale\.[xy]\s*=\s*-1\b/.test(content3d),
  'Missing UV Y-inversion on buffer geometry or detected forbidden negative scale mirroring (-1)'
);

check(
  'UV-03: Vector Silkscreen on Interactive Buttons',
  /fillText\(/i.test(content3d),
  'Interactive buttons must have procedural vector silkscreen typography (no untextured blank blocks)'
);

// 4. Internal Electronics & Power Bay
console.log(`\n--- GATE 4: Internal Mechanics & Electronics Bay ---`);
check(
  'BAY-01: Base Controller Motherboard',
  /PCB_Motherboard/.test(assignedNameBlob) || /PCB_Motherboard/.test(content3d),
  'Missing internal base controller motherboard (PCB_Motherboard)'
);

check(
  'BAY-02: Microprocessor / MCU IC',
  /Part_MCU_|ARM Cortex|Microcontroller/i.test(content3d),
  'Missing 32-bit microprocessor IC with silkscreen laser markings'
);

check(
  'BAY-03: RAM & Solid-State Storage',
  /Part_RAM_Chip|Part_SSD_Module/.test(content3d),
  'Missing RAM IC memory and solid-state flash storage drive module'
);

check(
  'BAY-04: Power Supply Section',
  /Assembly_PowerSupply|Part_ToroidalTransformer|Transformer_Auxiliary_Power/.test(content3d),
  'Missing internal power supply module or transformer'
);

check(
  'BAY-05: Forced Convection Cooling Fan',
  /Fan_CabinetCooling_Blower|Fan_BaseMotherboard|Fan_Circulator/.test(content3d),
  'Missing convective cooling blower fan with wire finger guard grille'
);

check(
  'BAY-06: Rear I/O Communication Ports',
  /Port_RS|Port_USB|Port_RJ45|Port_IEC/.test(content3d),
  'Missing physical rear I/O communication and power inlet ports'
);

// 5. Deep Internal Anatomy, Sensors, Mirrors, Wireless & Guided Walkthrough Presentation
console.log(`\n--- GATE 5: Deep Internal Anatomy, Wireless & Walkthrough Presentation ---`);
check(
  'INT-01: End-to-End Color-Coded 3D Power Routing Harnesses',
  /Body_Wire_|makeWiringHarness|TubeGeometry/.test(content3d),
  'Missing color-coded 3D internal power & signal wiring harnesses (Body_Wire_*)'
);

check(
  'INT-02: Multi-Motor & Actuator Suite',
  /Motor_Harmonic|Motor_Drive|Motor_Lift|Motor_BathPump/.test(content3d),
  'Missing complete internal motor & actuator suite (Drive motor, Lift actuators, Pump)'
);

check(
  'INT-03: Internal Sensors & 45-Degree Optical Relay Mirrors',
  /Sensor_PT100/.test(content3d) && /Mirror_OpticalRelay/.test(content3d),
  'Missing internal sensors (PT100, Tachometer/Encoder, Float/Limit) or 45-degree optical relay mirrors'
);

check(
  'INT-04: Wireless (Wi-Fi / Bluetooth BLE) & Removable USB Storage',
  /WiFi_BLE|Antenna_WiFi/.test(content3d) && /Port_RJ45|USB_Drive/.test(content3d),
  'Missing shielded Wi-Fi/BLE radio module, external dipole antenna, RJ45 LAN, or removable USB flash drive'
);

check(
  'PRES-01: Guided Walkthrough Tour & Voiceover Presentation Support',
  /TOUR_CHAPTERS|startGuidedTour/.test(contentApp),
  'Missing 10-chapter guided walkthrough tour & voiceover presentation support in app.js'
);

const docsDir = path.join(targetPath, 'docs');
const docsFiles = fs.existsSync(docsDir) ? fs.readdirSync(docsDir) : [];
check(
  'PRES-02: Standalone Narrated Social Media Walkthrough Video (.mp4)',
  docsFiles.some(f => f.endsWith('_Social_Walkthrough.mp4') || f.endsWith('_Walkthrough.mp4')),
  'Missing standalone narrated social media walkthrough video (*_Social_Walkthrough.mp4) in docs/'
);

// 6. Gold Standard Web Shell, Theme Parity & Lighting Controls
console.log(`\n--- GATE 6: Centrifuge Gold Standard UI & Environment Controls ---`);
check(
  'UI-01: Gold Standard 3-Panel Collapsible Sidebars',
  /<aside[^>]*class="[^"]*instrument\s+panel-collapsible/.test(contentHtml) &&
  /<aside[^>]*class="[^"]*parts\s+panel-collapsible/.test(contentHtml) &&
  /<aside[^>]*class="[^"]*lab\s+panel-collapsible/.test(contentHtml),
  'index.html must include all 3 Centrifuge Gold Standard collapsible sidebars (instrument, parts, lab)'
);

check(
  'UI-02: Dark Lab Theme & View Switcher + Archival Plate Overlay',
  /--bg:\s*#0c1016/i.test(contentCss) &&
  /id="btn-view-modern"/.test(contentHtml) &&
  /id="btn-view-retro"/.test(contentHtml) &&
  /id="btn-view-night"/.test(contentHtml) &&
  /id="cm-plate-overlay"/.test(contentHtml) &&
  /id="cm-stage-switcher"/.test(contentHtml),
  'index.html / style.css missing Gold Standard dark theme (#0c1016), view switcher, or #cm-plate-overlay'
);

check(
  'UI-03: Interactive Lab Light & Mood Controls Wired in app.js',
  /id="lab-light"/.test(contentHtml) &&
  /id="lab-light-mood"/.test(contentHtml) &&
  /getElementById\(["']lab-light-mood["']\)/.test(contentApp) &&
  /getElementById\(["']btn-view-retro["']\)/.test(contentApp),
  'Lighting Mood (#lab-light-mood) or View Switcher (#btn-view-retro) missing active handler in app.js'
);

// Summary & Gate Decision
console.log(`\n========================================================`);
if (totalErrors === 0) {
  console.log(`👑 [OGA GATE PASSED]: Twin "${twinDir}" clears all mechanical gates!`);
  console.log(`👑 Total Errors: 0, Total Warnings: ${totalWarnings}`);
  console.log(`========================================================\n`);
  process.exit(0);
} else {
  console.error(`🚨 [OGA GATE REJECTED]: Twin "${twinDir}" failed ${totalErrors} mechanical gates!`);
  console.error(`🚨 Fix all errors above before requesting visual QA signoff.`);
  console.error(`========================================================\n`);
  process.exit(1);
}
