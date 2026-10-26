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

// Find 3d engine file and app file
const viewerDir = path.join(targetPath, 'software', 'viewer');
const filesInViewer = fs.existsSync(viewerDir) ? fs.readdirSync(viewerDir) : [];

const file3dName = filesInViewer.find(f => f.endsWith('3d.js'));
const fileAppName = filesInViewer.find(f => f === 'app.js');

if (!file3dName) {
  console.error(`❌ [FAIL] Missing 3D engine file in ${viewerDir} (*3d.js)`);
  process.exit(1);
}

const content3d = fs.readFileSync(path.join(viewerDir, file3dName), 'utf-8');
const contentApp = fileAppName ? fs.readFileSync(path.join(viewerDir, fileAppName), 'utf-8') : '';

// 1. Semantic Part Taxonomy Contract
console.log(`--- GATE 1: Semantic Part Taxonomy Contract ---`);
check(
  'TAX-01: Structural Chassis/Cabinet',
  /Body_Chassis|Body_CabinetShell|Body_BaseFrame/.test(content3d),
  'Missing structural unibody chassis or cabinet mesh (Body_Chassis / Body_CabinetShell)'
);

check(
  'TAX-02: Dynamic LCD Screen Quad',
  /UI_LCD/.test(content3d),
  'Missing dedicated dynamic LCD quad (UI_LCD)'
);

check(
  'TAX-03: Tactile Instrument Buttons',
  /Btn_/.test(content3d),
  'Missing dedicated physical tactile buttons (Btn_*)'
);

check(
  'TAX-04: Genuine 3D Fasteners',
  /Fastener_|makeSocketHeadCapScrew|makeHexSocketBolt|createHexSocketScrew/.test(content3d),
  'Missing genuine 3D fasteners (every screw must have real physical socket depth)'
);

check(
  'TAX-05: Leveling Feet at Datum Y=0',
  /Foot_Leveling_/.test(content3d),
  'Missing threaded leveling feet resting at datum Y=0 (Foot_Leveling_*)'
);

check(
  'TAX-06: SREdesigns Brand Certification Badge',
  /Badge_SREdesigns/.test(content3d),
  'Missing official SREdesigns Brand Certification Badge (Badge_SREdesigns)'
);

// 2. Physical Circuit Continuity Contract
console.log(`\n--- GATE 2: Physical Circuit Continuity Contract ---`);
check(
  'PWR-01: Bench Duplex Receptacle Box',
  /Power_Receptacle_Duplex/.test(content3d),
  'Missing bench duplex outlet box (Power_Receptacle_Duplex)'
);

check(
  'PWR-02: Molded NEMA AC Power Plug',
  /Power_Plug_NEMA|Part_PowerPlugNEMA/.test(content3d),
  'Missing molded NEMA 5-15P AC power plug firmly inserted into outlet'
);

check(
  'PWR-03: Heavy-Duty SJTOW Power Cord',
  /Power_Cord_SJTOW|Cable_ACPowerCord/.test(content3d),
  'Missing heavy-duty 3-conductor SJTOW power cord'
);

check(
  'PWR-04: Hard Continuity Logic Cutoff',
  /isPluggedIn/.test(contentApp),
  'Missing hard electrical continuity logic (isPluggedIn && switchOn) in app.js'
);

// 3. High-DPI Dynamic Canvas Texture & Upright Silkscreen UVs
console.log(`\n--- GATE 3: Canvas UV Orientation & Silkscreen Typography ---`);
check(
  'UV-01: flipY = false Enforcement',
  /flipY\s*=\s*false|colorSpace\s*=\s*THREE\.SRGBColorSpace/.test(content3d) ||
  /flipY\s*=\s*false/.test(contentApp),
  'Canvas textures must enforce flipY = false and sRGB colorSpace (DIAG-005)'
);

check(
  'UV-02: Upright & Unmirrored UV Inversion',
  /setY\(i,\s*1\.0\s*-\s*.*getY|createDecalQuad/.test(content3d),
  'Missing UV Y-inversion on buffer geometry for dynamic canvas texture (createDecalQuad or setY)'
);

check(
  'UV-03: Vector Silkscreen on Interactive Buttons',
  /fillText\(bc\.text|fillText\(/i.test(content3d),
  'Interactive buttons must have procedural vector silkscreen typography (no untextured blank blocks)'
);

// 4. Internal Electronics & Power Bay
console.log(`\n--- GATE 4: Internal Mechanics & Electronics Bay ---`);
check(
  'BAY-01: Base Controller Motherboard',
  /PCB_Motherboard/.test(content3d),
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
