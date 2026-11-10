import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('scratch_audit/audit_report.json', 'utf8'));

console.log('=== CASEWORK BENCHES & TABLES ===');
const tables = [];
data.casework.forEach(c => {
  if (c.name.includes('Island') || c.name.includes('Bench') || c.name.includes('Desk') || c.name.includes('Table') || c.name.includes('Fume_Hood')) {
    tables.push(c);
    console.log(`Table: ${c.name.padEnd(35)} X: [${c.min[0]}, ${c.max[0]}]  Y: [${c.min[1]}, ${c.max[1]}]  Z: [${c.min[2]}, ${c.max[2]}]`);
  }
});

console.log('\n=== DOCK INSTRUMENTS AUDIT ===');
data.docks.forEach(d => {
  // Find bench under dock
  const table = tables.find(t => 
    d.pos[0] >= t.min[0] - 0.2 && d.pos[0] <= t.max[0] + 0.2 &&
    d.pos[2] >= t.min[2] - 0.2 && d.pos[2] <= t.max[2] + 0.2
  );
  
  const benchTop = table ? table.max[1] : 0;
  const isFloating = d.min[1] > benchTop + 0.05;
  const isClipping = d.min[1] < benchTop - 0.15 && table;
  const hangsX = table ? (d.min[0] < table.min[0] || d.max[0] > table.max[0]) : false;
  const hangsZ = table ? (d.min[2] < table.min[2] || d.max[2] > table.max[2]) : false;

  console.log(`Dock: ${d.id.padEnd(22)} (${d.name})`);
  console.log(`  Pos: [${d.pos}]  Bounds: X[${d.min[0]}, ${d.max[0]}] Y[${d.min[1]}, ${d.max[1]}] Z[${d.min[2]}, ${d.max[2]}]`);
  if (!table) {
    console.log(`  ⚠️  NO BENCH FOUND UNDER INSTRUMENT!`);
  } else {
    console.log(`  Table: ${table.name} (Top Y: ${benchTop})`);
    if (isFloating) console.log(`  🚨 FLOATING! minY: ${d.min[1]} > benchTop: ${benchTop} (diff: +${(d.min[1] - benchTop).toFixed(3)}m)`);
    if (isClipping) console.log(`  ⚠️  CLIPPING! minY: ${d.min[1]} < benchTop: ${benchTop} (diff: ${(d.min[1] - benchTop).toFixed(3)}m)`);
    if (hangsX) console.log(`  🚨 HANGING OFF X! bench X: [${table.min[0]}, ${table.max[0]}], dock X: [${d.min[0]}, ${d.max[0]}]`);
    if (hangsZ) console.log(`  🚨 HANGING OFF Z! bench Z: [${table.min[2]}, ${table.max[2]}], dock Z: [${d.min[2]}, ${d.max[2]}]`);
  }
});

console.log('\n=== UTILITIES & ACCESSORIES AUDIT ===');
const floatingUtils = [];
const hangingUtils = [];
const noBenchUtils = [];

data.utilities.forEach(u => {
  // Find bench under object
  const table = tables.find(t => 
    u.pos[0] >= t.min[0] - 0.2 && u.pos[0] <= t.max[0] + 0.2 &&
    u.pos[2] >= t.min[2] - 0.2 && u.pos[2] <= t.max[2] + 0.2
  );

  const benchTop = table ? table.max[1] : 0;
  // Floor objects (like gas cylinders) have Y near 0
  const isFloor = u.pos[1] < 0.3;
  if (!table && !isFloor) {
    noBenchUtils.push({ u, benchTop });
  } else if (table) {
    const isFloating = u.min[1] > benchTop + 0.05;
    const isClipping = u.min[1] < benchTop - 0.10;
    const hangsX = u.min[0] < table.min[0] - 0.02 || u.max[0] > table.max[0] + 0.02;
    const hangsZ = u.min[2] < table.min[2] - 0.02 || u.max[2] > table.max[2] + 0.02;

    if (isFloating) floatingUtils.push({ u, benchTop, diff: u.min[1] - benchTop, table: table.name });
    if (hangsX || hangsZ) hangingUtils.push({ u, benchTop, table: table.name, hangsX, hangsZ, tMin: [table.min[0], table.min[2]], tMax: [table.max[0], table.max[2]] });
  }
});

console.log(`\n🚨 FOUND ${floatingUtils.length} FLOATING UTILITIES/ACCESSORIES:`);
floatingUtils.forEach(f => {
  console.log(`  - ${f.u.name.padEnd(30)} pos: [${f.u.pos}] minY: ${f.u.min[1]} (benchTop: ${f.benchTop}, +${f.diff.toFixed(3)}m) on ${f.table}`);
});

console.log(`\n🚨 FOUND ${hangingUtils.length} HANGING OFF TABLE UTILITIES/ACCESSORIES:`);
hangingUtils.forEach(h => {
  console.log(`  - ${h.u.name.padEnd(30)} pos: [${h.u.pos}] X[${h.u.min[0]}, ${h.u.max[0]}] Z[${h.u.min[2]}, ${h.u.max[2]}]`);
  console.log(`      on ${h.table} X[${h.tMin[0]}, ${h.tMax[0]}] Z[${h.tMin[1]}, ${h.tMax[1]}]`);
});

console.log(`\n⚠️  FOUND ${noBenchUtils.length} UTILITIES NOT ON ANY TABLE OR FLOOR:`);
noBenchUtils.forEach(n => {
  console.log(`  - ${n.u.name.padEnd(30)} pos: [${n.u.pos}] bounds Y[${n.u.min[1]}, ${n.u.max[1]}]`);
});
