#!/usr/bin/env node
/**
 * GitHub Pages Integrity & Deployment Auditor
 *
 * Validates index.html, presentations.html, and all digital twin links, media assets,
 * and relative path contracts prior to pushing to GitHub Pages.
 *
 * Usage:
 *   node scripts/update_github_pages.mjs [--fix]
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const INDEX_HTML = path.join(ROOT, 'index.html');
const PRESENTATIONS_HTML = path.join(ROOT, 'presentations.html');

let totalChecks = 0;
let errors = 0;
let warnings = 0;

function pass(msg) {
  totalChecks++;
  console.log(`  ✅ [PASS] ${msg}`);
}

function fail(msg) {
  totalChecks++;
  errors++;
  console.error(`  ❌ [FAIL] ${msg}`);
}

function warn(msg) {
  totalChecks++;
  warnings++;
  console.warn(`  ⚠️  [WARN] ${msg}`);
}

console.log('👑 ========================================================');
console.log('👑 GITHUB PAGES INTEGRITY & DEPLOYMENT AUDITOR');
console.log('👑 Enforcing Relative Path Integrity & Zero Broken Assets');
console.log('👑 ========================================================\n');

// 1. Check Root HTML Pages Exist
console.log('--- 1. Hub Core Document Verification ---');
if (fs.existsSync(INDEX_HTML)) {
  pass('index.html exists at repository root');
} else {
  fail('index.html missing at repository root');
}

if (fs.existsSync(PRESENTATIONS_HTML)) {
  pass('presentations.html exists at repository root');
} else {
  fail('presentations.html missing at repository root');
}

// 2. Scan for Localhost / 127.0.0.1 Leaks
console.log('\n--- 2. Relative URL & Localhost Leak Audit ---');
const indexContent = fs.readFileSync(INDEX_HTML, 'utf8');
const presContent = fs.readFileSync(PRESENTATIONS_HTML, 'utf8');

const leakRegex = /(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?/gi;

const indexLeaks = indexContent.match(leakRegex);
if (indexLeaks) {
  fail(`index.html contains hardcoded localhost/127.0.0.1 references: ${indexLeaks.join(', ')}`);
} else {
  pass('index.html has ZERO hardcoded localhost/127.0.0.1 URLs');
}

const presLeaks = presContent.match(leakRegex);
if (presLeaks) {
  fail(`presentations.html contains hardcoded localhost/127.0.0.1 references: ${presLeaks.join(', ')}`);
} else {
  pass('presentations.html has ZERO hardcoded localhost/127.0.0.1 URLs');
}

// 3. Verify Active Twin Directories
console.log('\n--- 3. Digital Twin Catalog Coverage ---');
const twinDirs = fs.readdirSync(ROOT).filter(item => {
  return item.endsWith('_twin') && fs.statSync(path.join(ROOT, item)).isDirectory();
});

console.log(`  Found ${twinDirs.length} active digital twin packages on disk.`);

for (const twin of twinDirs) {
  const viewerIndex = path.join(ROOT, twin, 'software', 'viewer', 'index.html');
  if (fs.existsSync(viewerIndex)) {
    // Check if linked in index.html
    const expectedLink = `${twin}/software/viewer/index.html`;
    if (indexContent.includes(expectedLink)) {
      pass(`Twin catalog entry present and linked: ${twin}`);
    } else {
      warn(`Twin package ${twin} has viewer but is not linked in index.html`);
    }
  }
}

// 4. Asset Reference Integrity in index.html & presentations.html
console.log('\n--- 4. Asset Reference & Media Integrity ---');

function verifyAssetLinks(htmlContent, fileName) {
  // Regex for src and href
  const linkRegex = /(?:src|href)=["']([^"']+)["']/g;
  let match;
  let checked = 0;
  let missing = 0;

  while ((match = linkRegex.exec(htmlContent)) !== null) {
    const link = match[1].split('?')[0].split('#')[0];
    if (!link || link.startsWith('http://') || link.startsWith('https://') || link.startsWith('#') || link.startsWith('javascript:') || link.startsWith('data:')) {
      continue;
    }

    checked++;
    const targetPath = path.resolve(ROOT, link);
    if (!fs.existsSync(targetPath)) {
      fail(`In ${fileName}: referenced asset does not exist: "${link}"`);
      missing++;
    }
  }

  if (missing === 0) {
    pass(`All ${checked} relative asset links in ${fileName} resolve to real files on disk`);
  }
}

verifyAssetLinks(indexContent, 'index.html');
verifyAssetLinks(presContent, 'presentations.html');

// 5. Video Presentations Validation
console.log('\n--- 5. Cinema Video Walkthrough Validation ---');
const videoRegex = /<video[^>]*>[\s\S]*?<source\s+src=["']([^"']+)["']/gi;
let vidMatch;
let videoCount = 0;

while ((vidMatch = videoRegex.exec(presContent)) !== null) {
  videoCount++;
  const vidSrc = vidMatch[1].split('?')[0];
  const absPath = path.resolve(ROOT, vidSrc);
  if (fs.existsSync(absPath)) {
    const stat = fs.statSync(absPath);
    const sizeMb = (stat.size / (1024 * 1024)).toFixed(1);
    pass(`Video source verified (${sizeMb} MB): ${vidSrc}`);
  } else {
    fail(`Video source missing on disk: ${vidSrc}`);
  }
}

if (videoCount === 0) {
  warn('No <video> tags detected in presentations.html');
}

// Summary
console.log('\n========================================================');
if (errors === 0) {
  console.log(`👑 [GITHUB PAGES AUDIT PASSED]: All ${totalChecks} checks cleared!`);
  console.log(`👑 Total Errors: 0, Total Warnings: ${warnings}`);
  console.log('👑 Repository is 100% READY for GitHub Pages deployment.');
  console.log('========================================================\n');
  process.exit(0);
} else {
  console.error(`❌ [GITHUB PAGES AUDIT FAILED]: ${errors} errors found out of ${totalChecks} checks.`);
  console.error('❌ Please fix the missing assets or broken paths above before deploying.');
  console.log('========================================================\n');
  process.exit(1);
}
