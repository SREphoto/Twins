#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const ROOT = process.cwd();
const AUDIO_DIR = path.join(ROOT, 'centrifuge_twin', 'docs', 'audio');
fs.mkdirSync(AUDIO_DIR, { recursive: true });

const CHAPTERS = [
  {
    idx: 0,
    text: "The Micro fifty-four twenty-four R is a precision benchtop refrigerated microcentrifuge engineered for molecular biology, biochemistry, and clinical diagnostics. Centrifugation separates complex biological mixtures by applying intense centrifugal acceleration thousands of times stronger than Earth gravity. The physical force is governed by relative centrifugal force: one point one one eight times ten to the negative five times rotor radius in centimeters times RPM squared. Spinning at fifteen thousand RPM with an eight point four centimeter radius generates over twenty-one thousand times the force of gravity. Dense particles—such as packed red blood cells, cellular organelles, or precipitated nucleic acids—migrate rapidly outward toward the bottom of each tube, while lighter liquid floats inward. The instrument features a solid aluminum aerosol-tight twenty-four place rotor, an insulated stainless steel refrigeration bowl, a high-torque brushless DC motor, a motorized dual lid latch, and an onboard compressor cooling system that maintains sample temperatures from minus ten to plus forty degrees Celsius."
  },
  {
    idx: 1,
    text: "To power the instrument, the operator connects the heavy-duty SJTOW power cord into the bench duplex receptacle and flips the rear rocker switch. The internal power supply boots, self-test diagnostics verify the motor encoder and temperature sensors, and the console illuminates in standby mode."
  },
  {
    idx: 2,
    text: "The operator works from a twenty-four position rack loaded with one point five milliliter conical microcentrifuge tubes. Here we prepare whole blood, cell cultures, and buffer reagents. Balancing is essential: every sample tube must be counterbalanced by weight to within zero point one grams to avoid destructive vibration at high speeds."
  },
  {
    idx: 3,
    text: "Tubes are loaded into diametrically opposite rotor slots—such as positions one and thirteen—maintaining dynamic balance. The aerosol-tight rotor lid is threaded down securely to contain bioaerosols, and the main lid closes until motorized dual safety interlocks latch firmly."
  },
  {
    idx: 4,
    text: "On the angled control panel, the operator adjusts parameters: setting speed to fourteen thousand RPM or eighteen thousand times gravity, setting a five-minute spin duration, and selecting four degrees Celsius to protect delicate biomolecules from thermal degradation."
  },
  {
    idx: 5,
    text: "Pressing start engages the brushless DC drive motor. As speed ramps to fourteen thousand RPM, centrifugal acceleration deforms the fluid meniscus into a steep parabolic shape. Dense red blood cells pack into the bottom tip, a buffy coat of white cells forms in the middle, and clear plasma separates at the top, while active refrigeration keeps the chamber chilled at four degrees."
  },
  {
    idx: 6,
    text: "At run completion, regenerative electric braking brings the rotor to a smooth stop without disturbing delicate pelleted layers. A chime sounds, the motorized lid unlatches automatically, and the controller saves a GLP-compliant run record and CSV audit trail to memory."
  },
  {
    idx: 7,
    text: "Inside the rear power bay, electricity enters through the fused IEC socket with line noise filtering. An isolation toroidal transformer and switching power supply board generate regulated DC voltages, while color-coded three-D wiring harnesses deliver high-voltage AC to the compressor and low-voltage power to the motherboard."
  },
  {
    idx: 8,
    text: "The mechanical drive features a heavy-duty three-phase brushless DC motor mounted on elastomeric vibration-isolation dampers beneath the chamber. Beside it, a hermetic refrigeration compressor, copper condenser pack, and a convective blower fan circulate refrigerant to maintain sub-zero bowl temperatures under full aerodynamic drag."
  },
  {
    idx: 9,
    text: "The multi-layer motherboard houses a thirty-two-bit ARM Cortex microprocessor, system RAM, solid-state flash memory, and an optical tachometer relay mirror. Rear bulkhead ports include RS-two-thirty-two serial, USB flash drive, Ethernet LAN, and a wireless module with external dipole antenna for automated lab data management."
  }
];

console.log('🎙️ Generating 10 studio audio stems for Centrifuge twin...');
for (const ch of CHAPTERS) {
  const tmpAiff = `/tmp/vo_${ch.idx}.aiff`;
  const outMp3 = path.join(AUDIO_DIR, `vo_${ch.idx}.mp3`);
  console.log(`  Stem ${ch.idx} (${ch.text.length} chars)...`);
  execFileSync('/usr/bin/say', ['-v', 'Samantha', '-r', '175', '-o', tmpAiff, ch.text]);
  execFileSync('/usr/local/bin/ffmpeg', [
    '-y',
    '-i', tmpAiff,
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    outMp3
  ], { stdio: 'ignore' });
  try { fs.unlinkSync(tmpAiff); } catch (e) {}
}

console.log('✅ All 10 audio stems generated in', AUDIO_DIR);
