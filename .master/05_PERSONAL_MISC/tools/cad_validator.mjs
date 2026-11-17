/**
 * cad_validator.mjs — OGA-CAD Governance & Compliance Engine for Twins
 * Enforces Zero-Defect Dimensional Discipline, Part Taxonomy, Changelog & Report Cards.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('👑 [OGA-CAD] Starting Machine Twin Governance Audit...');

const cliArgs = process.argv.slice(2);
const twinArgIdx = cliArgs.indexOf('--twin');
const explicitTwin = twinArgIdx !== -1 ? cliArgs[twinArgIdx + 1] : null;

const VALID_PREFIXES = [
    'Body_', 'UI_LCD', 'Btn_', 'Knob_', 'Pivot_', 'Glass_', 'Fastener_', 'Foot_', 'Badge_',
    'Power_', 'Port_', 'PCB_', 'Part_', 'Assembly_', 'Sensor_', 'Mirror_', 'Motor_', 'Fan_',
    'WiFi_', 'Antenna_', 'USB_', 'Trackball_', 'Lab_', 'Ground'
];

function stripComments(src) {
    return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1');
}

function auditCadFiles(filesToCheck) {
    let localViolations = 0;
    const invalidNodes = [];

    filesToCheck.forEach(file => {
        if (!fs.existsSync(file)) return;
        const raw = fs.readFileSync(file, 'utf8');
        if (/validatorToken/.test(raw)) {
            console.log(`\n❌ [CAD GOVERNANCE VIOLATION]: validatorToken string-gaming detected in ${file}!`);
            localViolations++;
        }
        const code = stripComments(raw);
        const nameMatches = code.matchAll(/(?:[A-Za-z_$][A-Za-z0-9_$]*)\.name\s*=\s*["']([^"']+)["']/g);
        for (const match of nameMatches) {
            const nodeName = match[1];
            if (!VALID_PREFIXES.some(p => nodeName.startsWith(p))) {
                invalidNodes.push({ file, nodeName });
            }
        }
        if (code.includes('THREE.CanvasTexture') && !code.includes('flipY = false')) {
            console.log(`\n❌ [CAD GOVERNANCE VIOLATION]: Missing flipY = false on CanvasTexture in ${file}!`);
            localViolations++;
        }
    });

    if (invalidNodes.length > 0) {
        console.log('\n❌ [CAD GOVERNANCE VIOLATION]: Non-compliant 3D Node Names detected!');
        invalidNodes.forEach(({ file, nodeName }) => {
            console.log(`     - File: ${file} | Invalid Node Name: "${nodeName}"`);
        });
        console.log('   ⚠️  Node names must follow Semantic Part Taxonomy (e.g. Body_*, UI_LCD*, Btn_*, Knob_*, Pivot_*, Glass_*, Fastener_*, Foot_*, Badge_*).');
        localViolations++;
    } else {
        console.log('   ✅ Semantic Part Taxonomy respected across 3D CAD modules.');
    }

    return localViolations;
}

try {
    if (explicitTwin) {
        const viewerDir = path.resolve(process.cwd(), explicitTwin, 'software', 'viewer');
        if (!fs.existsSync(viewerDir)) {
            console.error(`❌ Twin viewer directory not found: ${viewerDir}`);
            process.exit(1);
        }
        const cadFiles = fs.readdirSync(viewerDir)
            .filter(f => f.endsWith('.js') && f !== 'app.js' && f !== 'sfx.js' && !f.endsWith('.test.js'))
            .map(f => path.join(viewerDir, f));
        const violations = auditCadFiles(cadFiles);
        if (violations > 0) {
            console.log(`\n🛑 [OGA-CAD] Direct twin audit FAILED with ${violations} violations.`);
            process.exit(1);
        }
        console.log(`\n🌟 [OGA-CAD] Direct audit PASSED for ${explicitTwin}!`);
        process.exit(0);
    }

    const gitDiffCached = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
    const gitDiffUnstaged = execSync('git diff --name-only', { encoding: 'utf-8' });
    const untracked = execSync('git ls-files --others --exclude-standard', { encoding: 'utf-8' });

    const modifiedFiles = [...new Set([
        ...gitDiffCached.split('\n'),
        ...gitDiffUnstaged.split('\n'),
        ...untracked.split('\n')
    ])].filter(Boolean);

    if (modifiedFiles.length === 0) {
        console.log('   ✅ No pending changes detected. Machine workspace clean.');
        process.exit(0);
    }

    let violations = 0;

    // 1. Enforce Master Changelog Policy
    const changelogInDiff = modifiedFiles.some(f => f.includes('master_change_log.md') || f.includes('MASTER_CHANGELOG.md'));
    if (!changelogInDiff) {
        console.log('\n❌ [CAD GOVERNANCE VIOLATION]: Missing Master Changelog update!');
        console.log('   Files were modified, but `.master/logs/master_change_log.md` was not updated.');
        violations++;
    } else {
        console.log('   ✅ Master Changelog updated.');
    }

    // 2. Enforce Agent Self-Report Card
    const reportCardInDiff = modifiedFiles.some(f => f.includes('.master/logs/report_cards/') && f.endsWith('.md'));
    const hasMachineChanges = modifiedFiles.some(f => f.includes('_twin/') || f.includes('lab_viewer/'));

    if (hasMachineChanges && !reportCardInDiff) {
        console.log('\n❌ [CAD GOVERNANCE VIOLATION]: Missing Agent Report Card!');
        console.log('   Machine code was modified, but no new report card was added to `.master/logs/report_cards/`.');
        violations++;
    } else {
        console.log('   ✅ Agent Report Card validated.');
    }

    // 3. Enforce Troubleshooting Log on Bug Fixes
    const isTroubleshootModified = modifiedFiles.some(f => f.includes('troubleshooting_log.md'));
    let isBugFix = false;
    let hasIssueId = false;

    modifiedFiles.filter(f => f.includes('report_cards/') && f.endsWith('.md')).forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf8');
            if (/fix|bug|remedy|repair|crash|glitch/i.test(content)) isBugFix = true;
            if (/\[ISS-\d{3}\]|\[DIAG-\d{3}\]/i.test(content)) hasIssueId = true;
        } catch (e) {}
    });

    if (isBugFix && !isTroubleshootModified && !hasIssueId) {
        console.log('\n❌ [CAD GOVERNANCE VIOLATION]: Bug fix session without [ISS-XXX] entry!');
        console.log('   Document the issue in `.master/logs/troubleshooting_log.md`.');
        violations++;
    } else {
        console.log('   ✅ Troubleshooting log compliance verified.');
    }

    // 4. Enforce Semantic Part Taxonomy & Canvas flipY on Modified 3D CAD Files
    const meshCodeFiles = modifiedFiles.filter(f =>
        (f.endsWith('.js') || f.endsWith('.jsx')) &&
        f.includes('_twin/') &&
        !f.endsWith('/app.js') &&
        !f.endsWith('/sfx.js') &&
        !f.endsWith('.test.js')
    );
    violations += auditCadFiles(meshCodeFiles);

    if (violations > 0) {
        console.log(`\n🛑 [OGA-CAD] Audit FAILED with ${violations} violations. Resolve them before committing.`);
        process.exit(1);
    } else {
        console.log('\n🌟 [OGA-CAD] Audit PASSED. All machine twins meet dimensional & governance standards!');
        process.exit(0);
    }

} catch (err) {
    if (err.message && err.message.includes('not a git repository')) {
        console.log('⚠️ [OGA-CAD INFO] Git is not initialized or changes were already committed. Bypassing check.');
        process.exit(0);
    } else {
        console.error('⚠️ [OGA-CAD ERROR]:', err.message);
        process.exit(1);
    }
}
