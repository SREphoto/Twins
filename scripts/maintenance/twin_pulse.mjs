#!/usr/bin/env node
/**
 * twin_pulse.mjs — Daily Operational & Health Dispatch for Twins
 * Verifies machine packages, executes controller unit tests, and validates governance.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('⚡ [TWIN PULSE] Initiating Daily Operational Machine Sweep...');

const ROOT = process.cwd();

const MACHINES = [
    'centrifuge_twin',
    'balance_twin',
    'hotplate_twin',
    'rotovap_twin',
    'spectrophotometer_twin',
    'vacuum_pump_twin',
    'glove_box_twin',
    'muffle_furnace_twin',
    'ph_meter_twin',
    'ultrasonic_cleaner_twin',
    'vortex_mixer_twin',
    'high_pressure_reactor_twin'
];

let passes = 0;
let warnings = 0;

console.log('\n--- 1. Auditing Machine Controller Test Suites ---');
MACHINES.forEach(machine => {
    const testScript = path.join(ROOT, machine, 'scripts', 'test.sh');
    const controllerDir = path.join(ROOT, machine, 'software', 'controller');
    
    if (fs.existsSync(testScript)) {
        try {
            execSync(`bash ${testScript}`, { cwd: path.join(ROOT, machine), stdio: 'pipe' });
            console.log(`  ✅ ${machine.padEnd(28)} : Controller Tests PASS`);
            passes++;
        } catch (e) {
            console.log(`  ⚠️  ${machine.padEnd(28)} : Tests threw notice (check dependencies)`);
            warnings++;
        }
    } else if (fs.existsSync(controllerDir)) {
        console.log(`  ℹ️  ${machine.padEnd(28)} : Scaffolded (no test.sh yet)`);
    } else {
        console.log(`  ⚠️  ${machine.padEnd(28)} : Missing software/controller`);
        warnings++;
    }
});

console.log('\n--- 2. Auditing Lab Desk Registry Integration ---');
const labRegistryPath = path.join(ROOT, 'lab_viewer', 'machines', 'registry.js');
if (fs.existsSync(labRegistryPath)) {
    const regContent = fs.readFileSync(labRegistryPath, 'utf8');
    const registeredCount = (regContent.match(/id\s*:/g) || []).length;
    console.log(`  ✅ Lab Desk Registry Active: ${registeredCount} instruments configured.`);
} else {
    console.log(`  ⚠️  Lab Desk registry missing at ${labRegistryPath}`);
    warnings++;
}

console.log('\n--- 3. Running OGA-CAD Governance Validator ---');
try {
    execSync('node .master/05_PERSONAL_MISC/tools/cad_validator.mjs', { stdio: 'inherit' });
    console.log('  ✅ Governance and changelog check passed.');
} catch (e) {
    console.log('  ⚠️  Governance validator notice.');
}

console.log(`\n🌟 [TWIN PULSE COMPLETE] Sweep finished with ${passes} passes and ${warnings} notices.`);
