/**
 * SREdesigns Parr 4560 / 4848 High-Pressure Stirred Mini-Reactor — Procedural Three.js 3D Twin Architecture
 * 
 * Gold-Tier Procedural Laboratory Twin adhering strictly to the Centrifuge Standard & Semantic Part Taxonomy:
 * 
 * 1. Structural & Stand Support (Body_StandAssembly):
 *    - Heavy cast iron base plate (Body_StandBase) with bevel edges & textured coating
 *    - 4 Vulcanized neoprene leveling feet (Foot_Leveling_FL, FR, RL, RR) at datum Y = 0
 *    - Center spring well & 316SS helical compression coil spring (Spring_VesselSupport)
 *    - Ground chrome 304SS vertical support mast (Body_SupportRod, Ø25mm × 500mm)
 *    - Heavy cast iron split mounting collar bracket (Body_MountingCollar) with DIN 912 clamp bolts
 * 
 * 2. Pressure Vessel Assembly (Body_VesselAssembly):
 *    - Machined 316L SS thick-walled reaction cylinder (Body_VesselCylinder, 300 mL 4566 geometry)
 *    - Integral heavy top sealing flange (Body_VesselFlange) with precision gasket face
 *    - Welded 15mm thick hemispherical bottom head (Body_VesselBottom)
 *    - Two-piece drop-band split-ring closure clamp (Body_SplitRing_Left, Body_SplitRing_Right)
 *    - 6 High-tensile Grade B7 hex socket cap screws (Fastener_FlangeBolt_1 through 6) with DIN 125 flat washers
 *    - High-temperature virgin PTFE / Grafoil flat ring gasket (Gasket_PTFE_Grafoil)
 * 
 * 3. Reactor Head Plate & Internal Probes (Body_HeadAssembly):
 *    - Solid 150 mm dia × 16 mm thick precision-machined 316SS disc (Body_HeadPlate)
 *    - Serpentine 316SS internal cooling water loop (Body_CoolingLoop) with head barb fittings
 *    - Closed-end 1/8" OD 316SS thermowell tube (Body_Thermowell) housing Type-J thermocouple probe
 *    - 1/8" OD liquid sampling dip tube (Body_DipTube) extending to bottom of vessel
 * 
 * 4. Magnetic Drive & Motor Transmission (Body_StirrerAssembly):
 *    - Parr A1120HC6 hermetic magnetic coupling housing (Body_MagDriveHousing) rated to 200 bar
 *    - Non-magnetic 316SS containment shell (Body_ContainmentShell)
 *    - SmCo permanent magnet inner rotor (Body_SmCo_InnerRotor) & outer rotor (Body_SmCo_OuterRotor)
 *    - Knurled brass water-cooling jacket (Body_CoolingJacket) with cooling water ports
 *    - Precision 440C stainless steel ball bearings and PTFE/graphite guide sleeve
 *    - Central 316SS drive shaft (Pivot_StirrerShaft) with lock nuts
 *    - 6-blade Rushton turbine gas-dispersion impeller (Pivot_Impeller)
 *    - 1/8 HP Bodine DC variable-speed motor in industrial blue (Body_StirrerMotor)
 *    - Motor mounting bracket, drive pulley, driven pulley, timing belt, and belt guard (Body_MotorBeltGuard)
 * 
 * 5. Heating System & Dynamic Thermal Glow (Body_HeaterAssembly):
 *    - Dual-hinged clamshell electric resistance mantle (Pivot_Heater_Left, Pivot_Heater_Right)
 *    - Brushed aluminum inner reflector, ceramic fiber blanket insulation, and stainless steel outer shroud
 *    - Helical coiled Kanthal / FeCrAl resistance wire heating grooves (Body_HeatingCoil_Elements)
 *    - Stainless steel hinge pins and toggle clamp draw latch (Body_HeaterLatch)
 *    - Dynamic procedural blackbody thermal glow mesh & PointLight (Body_ThermalGlow)
 * 
 * 6. High-Pressure Fittings, Valves & Instrumentation (Body_FittingsAssembly):
 *    - 1/8" NPT Gas inlet needle valve (Body_Valve_Inlet, Knob_GasInletValve)
 *    - 1/8" NPT Gas vent needle valve (Body_Valve_Vent, Knob_VentValve)
 *    - 1/8" NPT Liquid sampling needle valve (Body_Valve_LiquidSample, Knob_LiquidSampleValve)
 *    - Hexagonal rupture disc safety head (Body_RuptureDiscSafetyHead) & discharge tube (Body_DischargeTube)
 *    - 3.5" (89 mm) Analog Bourdon tube pressure gauge:
 *      * Stainless steel bayonet case (Body_PressureGaugeBezel)
 *      * High-DPI procedural silkscreen dial face (Body_GaugeDial) with dual PSI / BAR scales
 *      * Dynamic red indicator needle (Pivot_GaugeNeedle)
 *      * Optical glass lens (Glass_GaugeLens, IOR = 1.52)
 * 
 * 7. Parr 4848 Modular Digital Benchtop Controller (Body_ControllerAssembly):
 *    - Powder-coated steel instrument cabinet (Body_ControllerChassis) with 4 rubber feet
 *    - Front console with carved bezel pocket and dedicated CanvasTexture LCD quad (UI_LCD, flipY = false)
 *    - PTM Temperature, MCM Tachometer, and PDM Pressure modules with dual-LED readouts
 *    - Knurled speed potentiometer dial (Knob_SpeedPot) with calibrated radial tick marks (>= 3.5mm clearance)
 *    - Illuminated AC Mains rocker switch (Btn_PowerRocker) and Heater SSR switch (Btn_HeaterRocker)
 *    - Official brand badge (Badge_SREdesigns) strictly adhering to boundary containment
 *    - Rear panel: IEC C14 power inlet, heater socket, thermocouple jack, motor port, louvers, ground lug
 * 
 * 8. Lab Room & Physical Circuit Continuity (DIAG-014):
 *    - Standard high-bay lab room with elevated ceiling (Y >= 28.0 m) and single-sided backface culling
 *    - Polished black epoxy benchtop (INSTRUMENT_BENCH) at datum Y = 0 with 4-sided steel trim strips
 *    - Heavy-duty cast aluminum bench duplex outlet box (Power_Receptacle_Duplex) with NEMA 5-15R receptacles
 *    - Heavy-duty SJTOW AC mains power cord (Body_PowerCord) with molded NEMA 5-15P plug (Power_Plug)
 *    - Hard circuit continuity: unplugged cord cuts 100% power (screen black, RPM = 0, heater 0W, SFX silent)
 * 
 * Units: 1 unit ≈ 100 mm (stand base 2.0 × 2.0 = 200×200 mm; mast height 5.0 = 500 mm). Y-up, front = -Z.
 */

import * as THREE from 'three';
import {
  createHexSocketScrew,
  createWasher,
  createVibrationFoot,
  createIECInlet,
  createDB9Port,
} from '../../../lab_viewer/shared/hardware_library.js';

// ---------------------------------------------------------------------------
// Standard Laboratory Workbench Datum & Bench Outlet
// ---------------------------------------------------------------------------
export const INSTRUMENT_BENCH = {
  cx: 0.0,
  cz: 0.0,
  sx: 9.6,
  sz: 5.4,
  bodyH: 0.88,
  topT: 0.07,
  get surfaceY() {
    return this.bodyH + this.topT;
  },
  get outlet() {
    return {
      x: 1.45,
      y: this.surfaceY + 0.12,
      z: this.cz + this.sz / 2 - 0.05,
    };
  },
};

// ---------------------------------------------------------------------------
// Standard Camera Viewpoint Presets
// ---------------------------------------------------------------------------
export const REACTOR_CAMERAS = {
  CAM_ISO: {
    pos: [2.5, 4.4, -8.6],
    target: [1.35, 2.30, 0.0],
    fov: 44,
  },
  CAM_FRONT: {
    pos: [1.35, 2.45, -8.8],
    target: [1.35, 2.45, 0.0],
    fov: 42,
  },
  CAM_SIDE: {
    pos: [-8.2, 2.40, -0.15],
    target: [0.0, 2.40, -0.15],
    fov: 40,
  },
  CAM_TOP: {
    pos: [1.35, 12.5, 0.1],
    target: [1.35, 1.80, 0.1],
    fov: 42,
  },
  CAM_EXPLODED: {
    pos: [1.35, 3.80, -11.2],
    target: [1.35, 2.20, 0.0],
    fov: 46,
  },
  STATE_ACTIVE: {
    pos: [2.5, 4.4, -8.6],
    target: [1.35, 2.30, 0.0],
    fov: 44,
  },
};

// ---------------------------------------------------------------------------
// Material Helpers
// ---------------------------------------------------------------------------
const M = (color, o = {}) => new THREE.MeshStandardMaterial({
  color,
  roughness: o.r ?? 0.35,
  metalness: o.m ?? 0.15,
  transparent: o.o != null && o.o < 1,
  opacity: o.o ?? 1,
  emissive: new THREE.Color(o.e ?? o.emissive ?? 0x000000),
  emissiveIntensity: o.ei ?? o.emissiveIntensity ?? 0,
  side: o.side ?? THREE.FrontSide,
  depthWrite: o.dw ?? true,
});

function box(w, h, d, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cyl(rT, rB, h, mat, segs = 32) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, segs), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// ---------------------------------------------------------------------------
// Procedural Materials
// ---------------------------------------------------------------------------
const matSSPolished    = M(0xe4e8ec, { r: 0.12, m: 0.95, side: THREE.DoubleSide });
const matSSBrushed     = M(0xcad0d8, { r: 0.30, m: 0.88, side: THREE.DoubleSide });
const matCastIron      = M(0x23272e, { r: 0.75, m: 0.30 });
const matChromeRod     = M(0xf0f4f8, { r: 0.08, m: 0.98 });
const matBrass         = M(0xd4af37, { r: 0.25, m: 0.85 });
const matBodineBlue    = M(0x1d4ed8, { r: 0.38, m: 0.35 });
const matAluHeater     = M(0xb8c0ca, { r: 0.40, m: 0.70 });
const matCeramicFiber  = M(0xdfdbd4, { r: 0.88, m: 0.05, side: THREE.DoubleSide });
const matKanthalWire   = M(0x3e444c, { r: 0.50, m: 0.65 });
const matGasketGrafoil = M(0x2c2e33, { r: 0.82, m: 0.10 });
const matSmCoMagnet    = M(0x4b5563, { r: 0.30, m: 0.80 });
const matRubber        = M(0x131519, { r: 0.92, m: 0.05 });
const matCableSJTOW    = M(0x14161a, { r: 0.85, m: 0.05 });
const matCtrlCabinet   = M(0x1e232d, { r: 0.55, m: 0.25 });
const matCtrlBezel     = M(0x101318, { r: 0.45, m: 0.15 });
const matNeedleRed     = M(0xef4444, { r: 0.25, m: 0.10, e: 0xef4444, ei: 0.4 });
const matGaugeGlass    = M(0xffffff, { r: 0.02, m: 0.10, o: 0.22, side: THREE.DoubleSide, dw: false });

// Dynamic thermal glow shader material
const matThermalGlow = M(0x100300, {
  r: 0.85,
  m: 0.05,
  e: 0xff3b00,
  ei: 0.0,
  side: THREE.DoubleSide,
});

// ---------------------------------------------------------------------------
// High-DPI Procedural Silkscreen Dial Face for Bourdon Pressure Gauge
// ---------------------------------------------------------------------------
function createBourdonGaugeDialTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Background Dial Face (Clean white enamel with subtle brushed vignette)
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(512, 512, 500, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(512, 512, 490, 0, Math.PI * 2);
  ctx.stroke();

  // ASME B40.1 / EN 837-1 Dual Scale Arc (270° sweep, from 135° to 405° / 45°)
  const startAng = Math.PI * 0.75; // 135°
  const endAng   = Math.PI * 2.25; // 405°
  const sweep    = endAng - startAng;

  // Red Danger Zone Arc (> 200 bar / > 3000 psi)
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 18;
  ctx.beginPath();
  const dangerStart = startAng + sweep * 0.80;
  ctx.arc(512, 512, 420, dangerStart, endAng);
  ctx.stroke();

  // Calibration Scale 1: Outer Scale (0 to 3000 PSI, black ticks & labels)
  const maxPsi = 3000;
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let psi = 0; psi <= maxPsi; psi += 100) {
    const frac = psi / maxPsi;
    const ang = startAng + frac * sweep;
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);

    const isMajor = psi % 500 === 0;
    const isMid   = psi % 250 === 0 && !isMajor;
    const tickLen = isMajor ? 38 : isMid ? 26 : 16;
    const rOuter  = 460;
    const rInner  = rOuter - tickLen;

    ctx.strokeStyle = psi > 2400 ? '#ef4444' : '#0f172a';
    ctx.lineWidth = isMajor ? 7 : isMid ? 4.5 : 2.5;
    ctx.beginPath();
    ctx.moveTo(512 + cos * rOuter, 512 + sin * rOuter);
    ctx.lineTo(512 + cos * rInner, 512 + sin * rInner);
    ctx.stroke();

    if (isMajor) {
      const rText = 380;
      ctx.font = 'bold 36px "IBM Plex Sans", -apple-system, sans-serif';
      ctx.fillText(psi.toString(), 512 + cos * rText, 512 + sin * rText);
    }
  }

  // Calibration Scale 2: Inner Scale (0 to 200 BAR, red/maroon ticks & labels)
  const maxBar = 200;
  for (let bar = 0; bar <= maxBar; bar += 10) {
    const frac = bar / maxBar;
    const ang = startAng + frac * sweep;
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);

    const isMajor = bar % 50 === 0;
    const tickLen = isMajor ? 26 : 14;
    const rOuter  = 330;
    const rInner  = rOuter - tickLen;

    ctx.strokeStyle = bar > 160 ? '#ef4444' : '#991b1b';
    ctx.lineWidth = isMajor ? 5 : 2.5;
    ctx.beginPath();
    ctx.moveTo(512 + cos * rOuter, 512 + sin * rOuter);
    ctx.lineTo(512 + cos * rInner, 512 + sin * rInner);
    ctx.stroke();

    if (isMajor) {
      const rText = 275;
      ctx.fillStyle = bar > 160 ? '#ef4444' : '#991b1b';
      ctx.font = '600 28px "IBM Plex Sans", -apple-system, sans-serif';
      ctx.fillText(bar.toString(), 512 + cos * rText, 512 + sin * rText);
    }
  }

  // Dial Center Typography & Brand Mark
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 34px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.fillText('PARR INSTRUMENT CO.', 512, 340);

  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 26px "IBM Plex Mono", monospace';
  ctx.fillText('PSI', 512, 420);

  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 24px "IBM Plex Mono", monospace';
  ctx.fillText('BAR', 512, 455);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 20px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.fillText('316SS TUBE & SOCKET · ASME B40.1', 512, 640);
  ctx.fillText('CL. 1.0 · MAX 200 BAR @ 350°C', 512, 670);

  // Center needle pivot cap
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(512, 512, 28, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------------------------------------------------------------------------
// High-DPI Official SREdesigns Metal Brand Badge Texture
// ---------------------------------------------------------------------------
function createBadgeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Brushed gold / brass background
  const grad = ctx.createLinearGradient(0, 0, 1024, 256);
  grad.addColorStop(0, '#785b12');
  grad.addColorStop(0.3, '#d4af37');
  grad.addColorStop(0.7, '#fef08a');
  grad.addColorStop(1, '#926a15');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 256);

  // Inset dark enamel badge plaque
  ctx.fillStyle = '#0b1320';
  ctx.fillRect(16, 16, 992, 224);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, 992, 224);

  // SREdesigns certified logo
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 44px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SREdesigns · CERTIFIED DIGITAL TWIN', 512, 85);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 36px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.fillText('PARR 4560 / 4848 MINI-REACTOR', 512, 145);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 24px "IBM Plex Mono", monospace';
  ctx.fillText('300 mL · 200 BAR · 350°C · 1:1 CAD FIDELITY', 512, 195);

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------------------------------------------------------------------------
// High-DPI Procedural Faceplate Silkscreen for Parr 4848 Controller (DIAG-017)
// ---------------------------------------------------------------------------
function createControllerFaceplateTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 880;
  const ctx = canvas.getContext('2d');

  // Heavy powder-coated matte dark slate faceplate background
  ctx.fillStyle = '#141a24';
  ctx.fillRect(0, 0, 1024, 880);

  // Outer recessed bevel perimeter border
  ctx.strokeStyle = '#2b3648';
  ctx.lineWidth = 12;
  ctx.strokeRect(10, 10, 1004, 860);

  ctx.strokeStyle = '#090d14';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, 988, 844);

  // Modular header band
  ctx.fillStyle = '#1c2533';
  ctx.fillRect(20, 20, 984, 80);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 30px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PARR 4848', 45, 72);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 20px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.fillText('MODULAR DIGITAL REACTOR CONTROLLER', 230, 70);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 16px "IBM Plex Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('SERIES 4560 MINI-BENCHTOP', 980, 70);

  // Center vertical module separator seam
  ctx.strokeStyle = '#283446';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(512, 100);
  ctx.lineTo(512, 760);
  ctx.stroke();

  // LEFT MODULE: PTM 4848 Temperature Controller
  ctx.fillStyle = '#18202d';
  ctx.fillRect(35, 110, 460, 48);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PTM · PRIMARY TEMPERATURE MODULE', 265, 142);

  // Recessed pocket outline for LCD
  ctx.fillStyle = '#070a0f';
  ctx.fillRect(45, 175, 440, 310);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;
  ctx.strokeRect(45, 175, 440, 310);

  // PTM Controls Silkscreen
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 16px "IBM Plex Mono", monospace';
  ctx.fillText('▲ UP', 150, 525);
  ctx.fillText('▼ DOWN', 265, 525);
  ctx.fillText('ENTER', 380, 525);

  // Heater SSR Switch Silkscreen
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(175, 595, 180, 140);
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 18px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.fillText('HEATER SSR', 265, 622);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 16px "IBM Plex Mono", monospace';
  ctx.fillText('I  ON', 265, 650);
  ctx.fillText('O  OFF', 265, 720);

  // RIGHT MODULE: MCM 4848 Motor / Tachometer Controller
  ctx.fillStyle = '#18202d';
  ctx.fillRect(530, 110, 460, 48);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 20px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.fillText('MCM · MOTOR CONTROLLER MODULE', 760, 142);

  // Calibrated radial speed potentiometer silkscreen dial around (760, 320)
  const potX = 760;
  const potY = 320;
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  const potStart = Math.PI * 0.75;
  const potEnd = Math.PI * 2.25;
  ctx.arc(potX, potY, 130, potStart, potEnd);
  ctx.stroke();

  // Dial ticks & numbers: 0 to 1700 RPM
  const maxRpm = 1700;
  for (let rpm = 0; rpm <= maxRpm; rpm += 100) {
    const frac = rpm / maxRpm;
    const ang = potStart + frac * (potEnd - potStart);
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    const isMajor = rpm % 300 === 0;
    const rOuter = 130;
    const rInner = isMajor ? 108 : 118;

    ctx.strokeStyle = isMajor ? '#38bdf8' : '#64748b';
    ctx.lineWidth = isMajor ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(potX + cos * rOuter, potY + sin * rOuter);
    ctx.lineTo(potX + cos * rInner, potY + sin * rInner);
    ctx.stroke();

    if (isMajor) {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 18px "IBM Plex Mono", monospace';
      ctx.fillText((rpm / 100).toString(), potX + cos * 88, potY + sin * 88);
    }
  }

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.fillText('RPM × 100', potX, potY - 35);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 14px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.fillText('CW SPEED SET', potX, potY + 45);

  // AC Mains Power Switch Silkscreen
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  ctx.strokeRect(670, 595, 180, 140);
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 18px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.fillText('AC MAINS', 760, 622);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 16px "IBM Plex Mono", monospace';
  ctx.fillText('I  POWER', 760, 650);
  ctx.fillText('O  STANDBY', 760, 720);

  // Bottom Footer Metadata Band
  ctx.fillStyle = '#0d121a';
  ctx.fillRect(20, 770, 984, 85);
  ctx.fillStyle = '#64748b';
  ctx.font = '600 16px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PARR INSTRUMENT COMPANY · MOLINE, ILLINOIS USA', 45, 810);
  ctx.font = '500 14px "IBM Plex Mono", monospace';
  ctx.fillText('120V AC · 15A · 50/60 Hz · CLASS 1 DIV 2 COMPLIANT', 45, 835);

  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'right';
  ctx.font = 'bold 16px "IBM Plex Sans", -apple-system, sans-serif';
  ctx.fillText('SREdesigns CERTIFIED DIGITAL TWIN', 980, 815);

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------------------------------------------------------------------------
// 3D Helical Coil Spring Generator
// ---------------------------------------------------------------------------
function createHelicalSpring(radius, wireRadius, height, turns = 8, segs = 180) {
  const points = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const angle = t * Math.PI * 2 * turns;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (t - 0.5) * height;
    points.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, segs, wireRadius, 10, false);
  const mesh = new THREE.Mesh(geo, matSSPolished);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// ---------------------------------------------------------------------------
// Main 3D High Pressure Reactor Builder
// ---------------------------------------------------------------------------
export function buildReactor3D(options = {}) {
  const root = new THREE.Group();
  root.name = 'Body_ReactorSystemRoot';

  const assemblies = {
    stand: new THREE.Group(),
    vessel: new THREE.Group(),
    head: new THREE.Group(),
    stirrer: new THREE.Group(),
    heater: new THREE.Group(),
    fittings: new THREE.Group(),
    controller: new THREE.Group(),
    room: new THREE.Group(),
  };

  assemblies.stand.name = 'Body_StandAssembly';
  assemblies.vessel.name = 'Body_VesselAssembly';
  assemblies.head.name = 'Body_HeadAssembly';
  assemblies.stirrer.name = 'Body_StirrerAssembly';
  assemblies.heater.name = 'Body_HeaterAssembly';
  assemblies.fittings.name = 'Body_FittingsAssembly';
  assemblies.controller.name = 'Body_ControllerAssembly';
  assemblies.room.name = 'Body_LaboratoryRoom';

  const refs = {
    stirrerShaft: null,
    impeller: null,
    gaugeNeedle: null,
    thermalGlow: null,
    chamberLight: null,
    heaterLeft: null,
    heaterRight: null,
    heaterLatch: null,
    lcdMesh: null,
    speedKnob: null,
    heaterRocker: null,
    powerRocker: null,
    inletKnob: null,
    ventKnob: null,
    liquidKnob: null,
    powerPlug: null,
    powerCord: null,
  };

  const interactiveMeshes = [];
  const partsList = [];

  function registerPart(mesh, category = 'Structure', description = '') {
    if (!mesh) return;
    partsList.push({
      name: mesh.name,
      category,
      description,
      mesh,
    });
  }

  // Dimensions & Coordinates (1 unit ≈ 100 mm)
  const STAND_W = 2.00; // 200 mm
  const STAND_D = 2.00; // 200 mm
  const STAND_BASE_H = 0.16; // 16 mm
  const MAST_H = 5.20; // 520 mm
  const MAST_R = 0.125; // 25 mm dia
  const MAST_X = 0.00;
  const MAST_Z = 0.72; // Rear edge of stand
  const VESSEL_CENTER_Y = 2.20;
  const VESSEL_CENTER_Z = -0.15;

  // -------------------------------------------------------------------------
  // 1. Cast Iron Base Stand, Leveling Feet, and Support Rod
  // -------------------------------------------------------------------------
  const standGroup = new THREE.Group();
  standGroup.name = 'Body_StandBase';
  standGroup.position.set(0, 0, 0);

  // Cast iron base plate with chamfered top edges
  const baseMesh = box(STAND_W, STAND_BASE_H, STAND_D, matCastIron);
  baseMesh.name = 'Body_StandBasePlate';
  baseMesh.position.set(0, STAND_BASE_H / 2 + 0.06, 0);
  standGroup.add(baseMesh);
  registerPart(baseMesh, 'Stand', 'Heavy cast iron A-frame base plate with vibration damping mass');

  // Official SREdesigns Brand Badge mounted proudly on front face of stand base
  const badgeTex = createBadgeTexture();
  const badgeMat = new THREE.MeshBasicMaterial({
    map: badgeTex,
    side: THREE.DoubleSide,
  });
  const badgeMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.12), badgeMat);
  badgeMesh.name = 'Badge_SREdesigns';
  badgeMesh.position.set(0, STAND_BASE_H / 2 + 0.06, -STAND_D / 2 - 0.008);
  badgeMesh.rotation.y = Math.PI; // Face the camera at -Z
  const uvBadge = badgeMesh.geometry.attributes.uv;
  for (let i = 0; i < uvBadge.count; i++) {
    uvBadge.setY(i, 1.0 - uvBadge.getY(i));
  }
  uvBadge.needsUpdate = true;
  standGroup.add(badgeMesh);
  registerPart(badgeMesh, 'Stand', 'Official SREdesigns certified digital twin metadata badge');

  // 4 Industrial Neoprene Leveling Feet with Threaded Studs
  const footX = STAND_W / 2 - 0.22;
  const footZ = STAND_D / 2 - 0.22;
  const feetCoords = [
    [-footX, -footZ, 'Foot_Leveling_FL'],
    [ footX, -footZ, 'Foot_Leveling_FR'],
    [-footX,  footZ, 'Foot_Leveling_RL'],
    [ footX,  footZ, 'Foot_Leveling_RR'],
  ];

  feetCoords.forEach(([fx, fz, fName]) => {
    const foot = createVibrationFoot(0.04, 0.14, 0.08);
    foot.name = fName;
    foot.position.set(fx, 0.0, fz);
    standGroup.add(foot);
    registerPart(foot, 'Stand', 'Vulcanized neoprene leveling foot with knurled aluminum lock ring');
  });

  // Center spring well pocket machined into base
  const springWell = cyl(0.28, 0.28, 0.06, matCastIron, 24);
  springWell.name = 'Body_BaseSpringWell';
  springWell.position.set(0, STAND_BASE_H + 0.03, VESSEL_CENTER_Z);
  standGroup.add(springWell);

  // 316SS Helical Compression Coil Spring supporting vessel
  const springMesh = createHelicalSpring(0.22, 0.024, 0.65, 7);
  springMesh.name = 'Spring_VesselSupport';
  springMesh.position.set(0, STAND_BASE_H + 0.38, VESSEL_CENTER_Z);
  standGroup.add(springMesh);
  registerPart(springMesh, 'Vessel', '316SS helical compression coil spring absorbing thermal expansion');

  // Ground chrome vertical support mast (304SS)
  const mast = cyl(MAST_R, MAST_R, MAST_H, matChromeRod, 32);
  mast.name = 'Body_SupportRod';
  mast.position.set(MAST_X, STAND_BASE_H + MAST_H / 2 + 0.06, MAST_Z);
  standGroup.add(mast);
  registerPart(mast, 'Stand', 'Precision-ground 304SS vertical support mast rod (Ø25 mm × 500 mm)');

  // Base mast retention boss & clamping bolt
  const mastBoss = cyl(MAST_R + 0.08, MAST_R + 0.08, 0.35, matCastIron, 24);
  mastBoss.name = 'Body_MastRetentionBoss';
  mastBoss.position.set(MAST_X, STAND_BASE_H + 0.20, MAST_Z);
  standGroup.add(mastBoss);

  const mastBolt = createHexSocketScrew(0.035, 0.18);
  mastBolt.name = 'Fastener_MastClampBolt';
  mastBolt.rotation.z = Math.PI / 2;
  mastBolt.position.set(MAST_X + MAST_R + 0.06, STAND_BASE_H + 0.22, MAST_Z);
  standGroup.add(mastBolt);

  // Heavy cast iron split mounting collar bracket clamping reactor head to rod
  const collarGroup = new THREE.Group();
  collarGroup.name = 'Body_MountingCollar';
  collarGroup.position.set(0, VESSEL_CENTER_Y + 0.25, (MAST_Z + VESSEL_CENTER_Z) / 2);

  const collarBlock = box(0.95, 0.42, 0.95, matCastIron);
  collarBlock.name = 'Body_CollarClampBody';
  collarGroup.add(collarBlock);

  // 2x DIN 912 M8 Socket Head Cap Screws securing collar
  for (const xOff of [-0.35, 0.35]) {
    const collarScrew = createHexSocketScrew(0.04, 0.25);
    collarScrew.rotation.x = Math.PI / 2;
    collarScrew.position.set(xOff, 0, 0.46);
    collarGroup.add(collarScrew);
  }
  standGroup.add(collarGroup);
  registerPart(collarGroup, 'Stand', 'Heavy cast iron split mounting bracket clamping fixed head to mast');

  assemblies.stand.add(standGroup);

  // -------------------------------------------------------------------------
  // 2. 300 mL 316SS Reaction Cylinder Vessel & Split-Ring Closure
  // -------------------------------------------------------------------------
  const vesselGroup = new THREE.Group();
  vesselGroup.name = 'Body_VesselGroup';
  vesselGroup.position.set(0, VESSEL_CENTER_Y, VESSEL_CENTER_Z);

  const cylOD = 0.92; // 92 mm OD
  const cylH  = 1.15; // 115 mm cylinder depth
  const flangeOD = 1.48; // 148 mm flange
  const flangeH  = 0.16;

  // Main thick-walled reaction cylinder
  const vesselCyl = cyl(cylOD / 2, cylOD / 2, cylH, matSSPolished, 36);
  vesselCyl.name = 'Body_VesselCylinder';
  vesselCyl.position.y = -cylH / 2;
  vesselGroup.add(vesselCyl);
  registerPart(vesselCyl, 'Vessel', '316L stainless steel thick-walled cylinder body rated to 200 bar');

  // Welded 15mm thick hemispherical bottom head
  const bottomHeadGeo = new THREE.SphereGeometry(cylOD / 2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const bottomHead = new THREE.Mesh(bottomHeadGeo, matSSPolished);
  bottomHead.name = 'Body_VesselBottom';
  bottomHead.rotation.x = Math.PI;
  bottomHead.position.y = -cylH;
  vesselGroup.add(bottomHead);
  registerPart(bottomHead, 'Vessel', '15 mm thick integral hemispherical bottom closure head');

  // Integral top sealing flange
  const vesselFlange = cyl(flangeOD / 2, flangeOD / 2, flangeH, matSSBrushed, 36);
  vesselFlange.name = 'Body_VesselFlange';
  vesselFlange.position.y = 0;
  vesselGroup.add(vesselFlange);
  registerPart(vesselFlange, 'Vessel', 'Precision-machined integral top sealing flange with gasket groove');

  // Sealing flat ring gasket (PTFE / Grafoil)
  const gasketMesh = cyl(flangeOD / 2 - 0.14, flangeOD / 2 - 0.14, 0.02, matGasketGrafoil, 32);
  gasketMesh.name = 'Gasket_PTFE_Grafoil';
  gasketMesh.position.y = flangeH / 2 + 0.01;
  vesselGroup.add(gasketMesh);
  registerPart(gasketMesh, 'Vessel', 'Flat ring sealing gasket (PTFE up to 250°C / Grafoil up to 350°C)');

  // Two-piece drop-band split-ring closure clamp (Left & Right halves)
  const splitLeftGroup = new THREE.Group();
  splitLeftGroup.name = 'Body_SplitRing_Left';
  const splitRightGroup = new THREE.Group();
  splitRightGroup.name = 'Body_SplitRing_Right';

  const splitRingGeo = new THREE.CylinderGeometry(flangeOD / 2 + 0.15, flangeOD / 2 + 0.15, 0.28, 28, 1, false, 0, Math.PI);
  const splitMat = matSSBrushed;

  const splitLeftMesh = new THREE.Mesh(splitRingGeo, splitMat);
  splitLeftMesh.rotation.y = Math.PI / 2;
  splitLeftGroup.add(splitLeftMesh);

  const splitRightMesh = new THREE.Mesh(splitRingGeo, splitMat);
  splitRightMesh.rotation.y = -Math.PI / 2;
  splitRightGroup.add(splitRightMesh);

  vesselGroup.add(splitLeftGroup);
  vesselGroup.add(splitRightGroup);
  registerPart(splitLeftGroup, 'Closure', 'Drop-band split-ring closure clamp (Left half)');
  registerPart(splitRightGroup, 'Closure', 'Drop-band split-ring closure clamp (Right half)');

  // 6 High-tensile Grade B7 hex socket cap screws (Fastener_FlangeBolt_1 to 6)
  const boltRadius = flangeOD / 2 - 0.08;
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const bx = Math.cos(angle) * boltRadius;
    const bz = Math.sin(angle) * boltRadius;

    const boltGroup = new THREE.Group();
    boltGroup.name = `Fastener_FlangeBolt_${i + 1}`;

    const screw = createHexSocketScrew(0.045, 0.32);
    screw.position.y = 0.18;
    boltGroup.add(screw);

    const washer = createWasher(0.046, 0.09, 0.02);
    washer.position.y = 0.18;
    boltGroup.add(washer);

    boltGroup.position.set(bx, 0, bz);
    vesselGroup.add(boltGroup);
    registerPart(boltGroup, 'Closure', `Grade B7 M12 compression cap screw & hardened DIN 125 washer (#${i + 1})`);
  }

  assemblies.vessel.add(vesselGroup);

  // -------------------------------------------------------------------------
  // 3. Fixed 316SS Reactor Head Plate & Internal Probes
  // -------------------------------------------------------------------------
  const headGroup = new THREE.Group();
  headGroup.name = 'Body_HeadGroup';
  headGroup.position.set(0, VESSEL_CENTER_Y, VESSEL_CENTER_Z);

  // Solid 150 mm dia × 16 mm thick precision-machined 316SS head plate disc
  const headPlate = cyl(flangeOD / 2, flangeOD / 2, flangeH + 0.02, matSSPolished, 36);
  headPlate.name = 'Body_HeadPlate';
  headPlate.position.y = flangeH + 0.02;
  headGroup.add(headPlate);
  registerPart(headPlate, 'Head', 'Fixed 316L SS head plate with 6 NPT service ports and seal face');

  // Internal Cooling Loop: Serpentine 316SS U-tube descending into cylinder
  const coolLoopGroup = new THREE.Group();
  coolLoopGroup.name = 'Body_CoolingLoop';

  const coolLeg1 = cyl(0.03, 0.03, cylH * 0.85, matSSBrushed, 16);
  coolLeg1.position.set(-0.20, -cylH * 0.42, 0.0);
  coolLoopGroup.add(coolLeg1);

  const coolLeg2 = cyl(0.03, 0.03, cylH * 0.85, matSSBrushed, 16);
  coolLeg2.position.set(0.20, -cylH * 0.42, 0.0);
  coolLoopGroup.add(coolLeg2);

  // Bottom U-bend connecting legs
  const uBendCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.20, -cylH * 0.84, 0),
    new THREE.Vector3(0.0, -cylH * 0.94, 0),
    new THREE.Vector3(0.20, -cylH * 0.84, 0)
  );
  const uBendGeo = new THREE.TubeGeometry(uBendCurve, 16, 0.03, 8, false);
  const uBend = new THREE.Mesh(uBendGeo, matSSBrushed);
  coolLoopGroup.add(uBend);

  headGroup.add(coolLoopGroup);
  registerPart(coolLoopGroup, 'Internals', 'Internal 316SS serpentine water-cooling loop with U-bend');

  // Thermowell tube housing Type-J thermocouple
  const thermowell = cyl(0.028, 0.028, cylH * 0.82, matSSBrushed, 16);
  thermowell.name = 'Body_Thermowell';
  thermowell.position.set(0, -cylH * 0.41, 0.20);
  headGroup.add(thermowell);
  registerPart(thermowell, 'Sensors', '1/8" OD 316SS thermowell tube housing Type-J primary thermocouple');

  // Liquid sampling dip tube extending near bottom
  const dipTube = cyl(0.024, 0.024, cylH * 0.92, matSSBrushed, 16);
  dipTube.name = 'Body_DipTube';
  dipTube.position.set(0, -cylH * 0.46, -0.20);
  headGroup.add(dipTube);
  registerPart(dipTube, 'Sampling', '1/8" OD liquid sampling dip tube terminating 5 mm above bottom');

  assemblies.head.add(headGroup);

  // -------------------------------------------------------------------------
  // 4. Parr A1120HC6 Magnetic Stirrer Drive Coupling & DC Motor
  // -------------------------------------------------------------------------
  const stirrerGroup = new THREE.Group();
  stirrerGroup.name = 'Body_StirrerDrive';
  stirrerGroup.position.set(0, VESSEL_CENTER_Y, VESSEL_CENTER_Z);

  // Stainless steel magnetic drive housing bolted atop head plate
  const magHousing = cyl(0.32, 0.32, 1.05, matSSBrushed, 28);
  magHousing.name = 'Body_MagDriveHousing';
  magHousing.position.y = flangeH + 0.65;
  stirrerGroup.add(magHousing);
  registerPart(magHousing, 'Agitation', 'Parr A1120HC6 hermetic magnetic coupling drive housing');

  // Internal containment shell (pressure boundary)
  const contShell = cyl(0.22, 0.22, 0.95, matSSPolished, 24);
  contShell.name = 'Body_ContainmentShell';
  contShell.position.y = flangeH + 0.65;
  stirrerGroup.add(contShell);

  // Inner SmCo magnet rotor assembly
  const innerRotor = cyl(0.18, 0.18, 0.70, matSmCoMagnet, 16);
  innerRotor.name = 'Body_SmCo_InnerRotor';
  innerRotor.position.y = flangeH + 0.65;
  stirrerGroup.add(innerRotor);
  registerPart(innerRotor, 'Agitation', 'High-temp SmCo internal permanent magnet rotor on drive shaft');

  // Water-cooling jacket around magnetic drive
  const coolJacket = cyl(0.40, 0.40, 0.58, matBrass, 28);
  coolJacket.name = 'Body_CoolingJacket';
  coolJacket.position.y = flangeH + 0.55;
  stirrerGroup.add(coolJacket);
  registerPart(coolJacket, 'Agitation', 'Knurled brass water-cooling jacket protecting SmCo magnets from heat');

  // Cooling water hose barbs
  for (const zDir of [-0.42, 0.42]) {
    const barb = cyl(0.04, 0.05, 0.14, matBrass, 12);
    barb.rotation.x = Math.PI / 2;
    barb.position.set(0, flangeH + 0.55, zDir);
    stirrerGroup.add(barb);
  }

  // 1/8 HP Variable Speed DC Motor (Bodine Blue)
  const motorGroup = new THREE.Group();
  motorGroup.name = 'Body_StirrerMotor';
  motorGroup.position.set(0, 2.35, 0.55);

  const motorCyl = cyl(0.42, 0.42, 1.25, matBodineBlue, 28);
  motorGroup.add(motorCyl);

  // Motor cooling fins
  for (let f = -0.4; f <= 0.4; f += 0.16) {
    const fin = cyl(0.46, 0.46, 0.02, matCastIron, 24);
    fin.position.y = f;
    motorGroup.add(fin);
  }

  // Motor terminal junction box
  const motorJbox = box(0.24, 0.28, 0.22, matCastIron);
  motorJbox.position.set(0.38, 0.10, 0);
  motorGroup.add(motorJbox);

  stirrerGroup.add(motorGroup);
  registerPart(motorGroup, 'Agitation', '1/8 HP variable-speed DC stirrer motor (0–1700 RPM)');

  // Motor pulley belt guard housing
  const beltGuard = box(0.68, 0.32, 1.15, matSSBrushed);
  beltGuard.name = 'Body_MotorBeltGuard';
  beltGuard.position.set(0, 1.62, 0.28);
  stirrerGroup.add(beltGuard);
  registerPart(beltGuard, 'Agitation', 'Stainless steel protective motor drive belt guard');

  // Stirrer drive shaft passing through head plate into vessel
  const shaftGroup = new THREE.Group();
  shaftGroup.name = 'Pivot_StirrerShaft';
  shaftGroup.position.set(0, flangeH + 0.02, 0);

  const shaftRod = cyl(0.05, 0.05, cylH + 0.40, matSSPolished, 20);
  shaftRod.position.y = -cylH / 2;
  shaftGroup.add(shaftRod);

  // 6-Blade Rushton Gas-Dispersion Impeller
  const impellerGroup = new THREE.Group();
  impellerGroup.name = 'Pivot_Impeller';
  impellerGroup.position.set(0, -cylH * 0.85, 0);

  const hub = cyl(0.10, 0.10, 0.12, matSSPolished, 16);
  impellerGroup.add(hub);

  const discCenter = cyl(0.22, 0.22, 0.02, matSSPolished, 24);
  impellerGroup.add(discCenter);

  for (let i = 0; i < 6; i++) {
    const bladeAngle = (i * Math.PI * 2) / 6;
    const blade = box(0.16, 0.09, 0.015, matSSPolished);
    blade.position.set(Math.cos(bladeAngle) * 0.20, 0, Math.sin(bladeAngle) * 0.20);
    blade.rotation.y = bladeAngle + Math.PI / 2;
    impellerGroup.add(blade);
  }

  shaftGroup.add(impellerGroup);
  stirrerGroup.add(shaftGroup);

  refs.stirrerShaft = shaftGroup;
  refs.impeller = impellerGroup;
  registerPart(shaftGroup, 'Agitation', 'Central 316SS drive shaft with 6-blade Rushton gas-dispersion turbine');

  assemblies.stirrer.add(stirrerGroup);

  // -------------------------------------------------------------------------
  // 5. Clamshell Electric Heating Mantle & Dynamic Thermal Glow
  // -------------------------------------------------------------------------
  const heaterGroup = new THREE.Group();
  heaterGroup.name = 'Body_HeaterMantle';
  heaterGroup.position.set(0, VESSEL_CENTER_Y, VESSEL_CENTER_Z);

  const mantleOD = cylOD + 0.38;
  const mantleH  = cylH + 0.10;

  // Split clamshell left and right halves with realistic hinges
  const heaterLeft = new THREE.Group();
  heaterLeft.name = 'Pivot_Heater_Left';
  const heaterRight = new THREE.Group();
  heaterRight.name = 'Pivot_Heater_Right';

  const shellHalfGeo = new THREE.CylinderGeometry(mantleOD / 2, mantleOD / 2, mantleH, 28, 1, false, 0, Math.PI);
  const innerReflectorGeo = new THREE.CylinderGeometry(cylOD / 2 + 0.04, cylOD / 2 + 0.04, mantleH - 0.06, 28, 1, false, 0, Math.PI);

  // Left clamshell half
  const shellL = new THREE.Mesh(shellHalfGeo, matAluHeater);
  shellL.rotation.y = Math.PI / 2;
  heaterLeft.add(shellL);

  const reflL = new THREE.Mesh(innerReflectorGeo, matCeramicFiber);
  reflL.rotation.y = Math.PI / 2;
  heaterLeft.add(reflL);

  // Right clamshell half
  const shellR = new THREE.Mesh(shellHalfGeo, matAluHeater);
  shellR.rotation.y = -Math.PI / 2;
  heaterRight.add(shellR);

  const reflR = new THREE.Mesh(innerReflectorGeo, matCeramicFiber);
  reflR.rotation.y = -Math.PI / 2;
  heaterRight.add(reflR);

  heaterLeft.position.y = -cylH / 2;
  heaterRight.position.y = -cylH / 2;
  heaterGroup.add(heaterLeft);
  heaterGroup.add(heaterRight);

  refs.heaterLeft = heaterLeft;
  refs.heaterRight = heaterRight;
  registerPart(heaterLeft, 'Heater', '780W electric resistance heating mantle (Left hinged clamshell)');
  registerPart(heaterRight, 'Heater', '780W electric resistance heating mantle (Right hinged clamshell)');

  // Toggle Draw Latch Clamp on front
  const latch = box(0.14, 0.22, 0.06, matSSBrushed);
  latch.name = 'Body_HeaterLatch';
  latch.position.set(0, -cylH / 2, -mantleOD / 2 - 0.04);
  heaterGroup.add(latch);
  refs.heaterLatch = latch;

  // Helical coiled resistance heating elements inside mantle
  const coilGroup = new THREE.Group();
  coilGroup.name = 'Body_HeatingCoil_Elements';
  for (let yC = -cylH * 0.40; yC <= cylH * 0.40; yC += 0.20) {
    const coilRing = cyl(cylOD / 2 + 0.02, cylOD / 2 + 0.02, 0.03, matKanthalWire, 32);
    coilRing.position.y = yC;
    coilGroup.add(coilRing);
  }
  heaterGroup.add(coilGroup);

  // Dynamic procedural blackbody thermal glow mesh
  const glowMesh = cyl(cylOD / 2 + 0.015, cylOD / 2 + 0.015, cylH * 0.96, matThermalGlow, 28);
  glowMesh.name = 'Body_ThermalGlow';
  glowMesh.position.y = -cylH / 2;
  heaterGroup.add(glowMesh);
  refs.thermalGlow = matThermalGlow;

  // Dynamic PointLight for thermal cavity illumination
  const chLight = new THREE.PointLight(0xff3b00, 0, 3.2);
  chLight.name = 'Body_ThermalPointLight';
  chLight.position.set(0, -cylH / 2, 0);
  heaterGroup.add(chLight);
  refs.chamberLight = chLight;

  assemblies.heater.add(heaterGroup);

  // -------------------------------------------------------------------------
  // 6. High-Pressure Service Fittings: Valves, Rupture Disc, Pressure Gauge
  // -------------------------------------------------------------------------
  const fittingsGroup = new THREE.Group();
  fittingsGroup.name = 'Body_Fittings';
  fittingsGroup.position.set(0, VESSEL_CENTER_Y + flangeH + 0.02, VESSEL_CENTER_Z);

  // Gas Inlet Needle Valve (Left side, Swagelok-style 316SS forged body)
  const inletGroup = new THREE.Group();
  inletGroup.name = 'Body_Valve_Inlet';
  inletGroup.position.set(-0.46, 0.18, -0.26);

  const inletBody = box(0.18, 0.20, 0.18, matSSBrushed);
  inletGroup.add(inletBody);

  const inletKnob = cyl(0.12, 0.12, 0.15, matRubber, 20);
  inletKnob.name = 'Knob_GasInletValve';
  inletKnob.position.y = 0.18;
  inletGroup.add(inletKnob);
  refs.inletKnob = inletKnob;
  interactiveMeshes.push({ mesh: inletKnob, id: 'inlet', hint: 'Toggle Gas Inlet Valve' });

  fittingsGroup.add(inletGroup);
  registerPart(inletGroup, 'Valves', '1/8" NPT 316SS gas inlet needle valve rated to 200 bar');

  // Gas Vent Needle Valve (Right side)
  const ventGroup = new THREE.Group();
  ventGroup.name = 'Body_Valve_Vent';
  ventGroup.position.set(0.46, 0.18, -0.26);

  const ventBody = box(0.18, 0.20, 0.18, matSSBrushed);
  ventGroup.add(ventBody);

  const ventKnob = cyl(0.12, 0.12, 0.15, matRubber, 20);
  ventKnob.name = 'Knob_VentValve';
  ventKnob.position.y = 0.18;
  ventGroup.add(ventKnob);
  refs.ventKnob = ventKnob;
  interactiveMeshes.push({ mesh: ventKnob, id: 'vent', hint: 'Toggle Vent Needle Valve' });

  fittingsGroup.add(ventGroup);
  registerPart(ventGroup, 'Valves', '1/8" NPT 316SS gas vent needle valve for controlled depressurization');

  // Liquid Sampling Needle Valve (Front)
  const liquidGroup = new THREE.Group();
  liquidGroup.name = 'Body_Valve_LiquidSample';
  liquidGroup.position.set(0, 0.18, -0.46);

  const liquidBody = box(0.16, 0.18, 0.16, matSSBrushed);
  liquidGroup.add(liquidBody);

  const liquidKnob = cyl(0.11, 0.11, 0.14, matRubber, 20);
  liquidKnob.name = 'Knob_LiquidSampleValve';
  liquidKnob.position.y = 0.16;
  liquidGroup.add(liquidKnob);
  refs.liquidKnob = liquidKnob;
  interactiveMeshes.push({ mesh: liquidKnob, id: 'sample', hint: 'Toggle Liquid Sampling Valve' });

  fittingsGroup.add(liquidGroup);
  registerPart(liquidGroup, 'Valves', '1/8" NPT liquid sampling needle valve connected to internal dip tube');

  // Hexagonal Rupture Disc Safety Head & Discharge Tube (Rear Left)
  const burstDiscGroup = new THREE.Group();
  burstDiscGroup.name = 'Body_RuptureDiscSafetyHead';
  burstDiscGroup.position.set(-0.38, 0.16, 0.36);

  const burstDiscHead = cyl(0.14, 0.14, 0.24, matSSBrushed, 6);
  burstDiscGroup.add(burstDiscHead);

  const dischargeTube = cyl(0.04, 0.04, 0.65, matSSPolished, 16);
  dischargeTube.name = 'Body_DischargeTube';
  dischargeTube.position.set(0, 0.42, 0);
  burstDiscGroup.add(dischargeTube);

  fittingsGroup.add(burstDiscGroup);
  registerPart(burstDiscGroup, 'Safety', '1/4" NPT hexagonal rupture disc safety head with 250 bar burst rating');

  // 3.5" (89 mm) Analog Bourdon Tube Pressure Gauge (0-3000 PSI / 0-200 BAR)
  const gaugeGroup = new THREE.Group();
  gaugeGroup.name = 'Body_PressureGaugeBezel';
  gaugeGroup.position.set(0.40, 0.65, -0.36);

  // Stainless steel bayonet case outer ring (open-ended so front face is clear)
  const bezelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.18, 32, 1, true);
  const gaugeBezel = new THREE.Mesh(bezelGeo, matSSPolished);
  gaugeBezel.rotation.x = Math.PI / 2;
  gaugeGroup.add(gaugeBezel);

  // Closed back plate at rear of case (+Z)
  const backGeo = new THREE.CircleGeometry(0.44, 32);
  const backMesh = new THREE.Mesh(backGeo, matSSBrushed);
  backMesh.position.z = 0.088;
  gaugeGroup.add(backMesh);

  // High-DPI procedural silkscreen dial face (DIAG-005 & DIAG-015: upright & front-facing)
  const dialTex = createBourdonGaugeDialTexture();
  const dialMat = new THREE.MeshBasicMaterial({ map: dialTex, side: THREE.DoubleSide });
  const dialFace = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.82), dialMat);
  dialFace.name = 'Body_GaugeDial';
  dialFace.position.z = 0.055;
  dialFace.rotation.y = Math.PI; // Face the camera at -Z
  // Ensure upright UVs
  const uvAttr = dialFace.geometry.attributes.uv;
  for (let i = 0; i < uvAttr.count; i++) {
    uvAttr.setY(i, 1.0 - uvAttr.getY(i));
  }
  uvAttr.needsUpdate = true;
  gaugeGroup.add(dialFace);

  // Dial needle pivoting with vessel pressure
  const needlePivot = new THREE.Group();
  needlePivot.name = 'Pivot_GaugeNeedle';
  needlePivot.position.set(0, 0, 0.040);
  needlePivot.rotation.y = Math.PI;

  const needle = box(0.018, 0.32, 0.008, matNeedleRed);
  needle.position.y = 0.14;
  needlePivot.add(needle);
  needlePivot.rotation.z = Math.PI * 0.75; // Initial 0 PSI position
  gaugeGroup.add(needlePivot);
  refs.gaugeNeedle = needlePivot;

  // Optical glass lens covering the front of the bezel (Z = -0.075)
  const dialLens = cyl(0.43, 0.43, 0.015, matGaugeGlass, 32);
  dialLens.name = 'Glass_GaugeLens';
  dialLens.rotation.x = Math.PI / 2;
  dialLens.position.z = -0.075;
  gaugeGroup.add(dialLens);

  fittingsGroup.add(gaugeGroup);
  registerPart(gaugeGroup, 'Instrumentation', '3.5" (89 mm) analog Bourdon pressure dial gauge (0–3000 PSI / 0–200 BAR)');

  assemblies.fittings.add(fittingsGroup);

  // -------------------------------------------------------------------------
  // 7. Parr 4848 Modular Digital Benchtop Controller Cabinet
  // -------------------------------------------------------------------------
  const ctrlGroup = new THREE.Group();
  ctrlGroup.name = 'Body_ControllerChassis';
  // Position controller adjacent to the reactor stand on the right bench (Y=1.13 rests feet on datum Y=0)
  ctrlGroup.position.set(2.60, 1.13, 0.10);

  const ctrlW = 2.45; // 245 mm
  const ctrlH = 2.10; // 210 mm
  const ctrlD = 2.65; // 265 mm

  // Heavy steel instrument enclosure
  const ctrlBox = box(ctrlW, ctrlH, ctrlD, matCtrlCabinet);
  ctrlGroup.add(ctrlBox);
  registerPart(ctrlBox, 'Controller', 'Parr 4848 modular industrial digital controller chassis');

  // Front bezel faceplate backing box
  const ctrlBezel = box(ctrlW - 0.14, ctrlH - 0.14, 0.05, matCtrlBezel);
  ctrlBezel.position.set(0, 0, -ctrlD / 2 - 0.02);
  ctrlGroup.add(ctrlBezel);

  // High-DPI procedural silkscreen faceplate (DIAG-015 & DIAG-017)
  const faceplateTex = createControllerFaceplateTexture();
  const matFaceplate = new THREE.MeshBasicMaterial({
    map: faceplateTex,
    side: THREE.DoubleSide,
  });
  const faceplateMesh = new THREE.Mesh(new THREE.PlaneGeometry(ctrlW - 0.16, ctrlH - 0.16), matFaceplate);
  faceplateMesh.name = 'Body_ControllerFaceplate';
  faceplateMesh.position.set(0, 0, -ctrlD / 2 - 0.048);
  faceplateMesh.rotation.y = Math.PI; // Face the camera at -Z
  // Invert UV Y for flipY = false
  const uvFp = faceplateMesh.geometry.attributes.uv;
  for (let i = 0; i < uvFp.count; i++) {
    uvFp.setY(i, 1.0 - uvFp.getY(i));
  }
  uvFp.needsUpdate = true;
  ctrlGroup.add(faceplateMesh);
  registerPart(faceplateMesh, 'Controller', 'High-DPI procedural silkscreen faceplate for Parr 4848 controller');

  // Dedicated dynamic high-DPI Canvas LCD quad (UI_LCD)
  const lcdGeo = new THREE.PlaneGeometry(0.98, 0.68);
  const lcdMat = new THREE.MeshBasicMaterial({ color: 0x05070a, side: THREE.DoubleSide });
  const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.name = 'UI_LCD';
  lcdMesh.position.set(0.55, 0.25, -ctrlD / 2 - 0.052);
  lcdMesh.rotation.y = Math.PI; // Face camera at -Z
  ctrlGroup.add(lcdMesh);
  refs.lcdMesh = lcdMesh;
  registerPart(lcdMesh, 'Controller', 'PTM/MCM dynamic dual-LED telemetry display quad (UI_LCD)');

  // Knurled Stirrer Speed Potentiometer Dial (MCM Module) centered on calibrated arc
  const speedKnobGroup = new THREE.Group();
  speedKnobGroup.name = 'Knob_SpeedPot';
  speedKnobGroup.position.set(-0.55, 0.26, -ctrlD / 2 - 0.06);

  const knobBody = cyl(0.20, 0.20, 0.14, matRubber, 24);
  knobBody.rotation.x = Math.PI / 2;
  speedKnobGroup.add(knobBody);

  const knobCap = cyl(0.16, 0.16, 0.02, matSSBrushed, 24);
  knobCap.rotation.x = Math.PI / 2;
  knobCap.position.z = -0.08;
  speedKnobGroup.add(knobCap);

  // Indicator line on knob
  const knobLine = box(0.018, 0.09, 0.01, matNeedleRed);
  knobLine.position.set(0, 0.07, -0.085);
  speedKnobGroup.add(knobLine);

  ctrlGroup.add(speedKnobGroup);
  refs.speedKnob = speedKnobGroup;
  interactiveMeshes.push({ mesh: knobBody, id: 'speedKnob', hint: 'Adjust Stirrer Speed Potentiometer' });
  registerPart(speedKnobGroup, 'Controller', 'MCM knurled speed potentiometer dial (0–1700 RPM)');

  // Illuminated Rocker Switches: Heater SSR & AC Mains Power
  const heaterRocker = box(0.18, 0.26, 0.08, M(0xf59e0b, { e: 0xf59e0b, ei: 0.5 }));
  heaterRocker.name = 'Btn_HeaterRocker';
  heaterRocker.position.set(0.55, -0.50, -ctrlD / 2 - 0.055);
  ctrlGroup.add(heaterRocker);
  refs.heaterRocker = heaterRocker;
  interactiveMeshes.push({ mesh: heaterRocker, id: 'heaterRocker', hint: 'Toggle Heater SSR Power' });
  registerPart(heaterRocker, 'Controller', 'Illuminated amber rocker switch controlling 780W heater SSR');

  const powerRocker = box(0.18, 0.26, 0.08, M(0x22c55e, { e: 0x22c55e, ei: 0.6 }));
  powerRocker.name = 'Btn_PowerRocker';
  powerRocker.position.set(-0.55, -0.50, -ctrlD / 2 - 0.055);
  ctrlGroup.add(powerRocker);
  refs.powerRocker = powerRocker;
  interactiveMeshes.push({ mesh: powerRocker, id: 'powerRocker', hint: 'Toggle AC Mains Power' });
  registerPart(powerRocker, 'Controller', 'Illuminated green AC Mains primary power rocker switch');

  // 4 Rubber vibration-damping feet under controller
  const cfX = ctrlW / 2 - 0.25;
  const cfZ = ctrlD / 2 - 0.25;
  [
    [-cfX, -cfZ, 'Foot_ControllerFoot_FL'],
    [ cfX, -cfZ, 'Foot_ControllerFoot_FR'],
    [-cfX,  cfZ, 'Foot_ControllerFoot_RL'],
    [ cfX,  cfZ, 'Foot_ControllerFoot_RR'],
  ].forEach(([cx, cz, cName]) => {
    const cFoot = cyl(0.12, 0.12, 0.08, matRubber, 16);
    cFoot.name = cName;
    cFoot.position.set(cx, -ctrlH / 2 - 0.04, cz);
    ctrlGroup.add(cFoot);
  });

  // Rear panel: IEC C14 inlet, heater twist-lock, thermocouple socket, RS-232 DB9
  const iecInlet = createIECInlet();
  iecInlet.name = 'Body_IECInlet';
  iecInlet.rotation.y = Math.PI;
  iecInlet.position.set(-0.60, -0.30, ctrlD / 2 + 0.01);
  ctrlGroup.add(iecInlet);

  const db9 = createDB9Port();
  db9.name = 'Body_RS232Port';
  db9.rotation.y = Math.PI;
  db9.position.set(0.60, -0.30, ctrlD / 2 + 0.01);
  ctrlGroup.add(db9);

  assemblies.controller.add(ctrlGroup);

  // -------------------------------------------------------------------------
  // 8. Laboratory Room Environment & Physical Circuit Continuity (DIAG-014)
  // -------------------------------------------------------------------------
  const roomGroup = new THREE.Group();
  roomGroup.name = 'Body_LaboratoryRoom';

  const benchY = INSTRUMENT_BENCH.surfaceY;
  const matCountertop = M(0x10151c, { r: 0.18, m: 0.25 });
  const matSteelTrim   = M(0xa8b0b8, { r: 0.25, m: 0.90 });

  // Black epoxy countertop slab
  const countertop = box(INSTRUMENT_BENCH.sx, 0.08, INSTRUMENT_BENCH.sz, matCountertop);
  countertop.name = 'Body_Countertop';
  countertop.position.set(0, -0.04, 0);
  roomGroup.add(countertop);

  // 4-sided perimeter steel trim strips (DIAG-003: zero top-face overlap)
  const trimW = 0.03;
  const trimT = 0.08;
  const trimY = -0.04;
  const halfX = INSTRUMENT_BENCH.sx / 2;
  const halfZ = INSTRUMENT_BENCH.sz / 2;

  const edgeF = box(INSTRUMENT_BENCH.sx + trimW * 2, trimT, trimW, matSteelTrim);
  edgeF.position.set(0, trimY, -halfZ - trimW / 2);
  roomGroup.add(edgeF);

  const edgeB = box(INSTRUMENT_BENCH.sx + trimW * 2, trimT, trimW, matSteelTrim);
  edgeB.position.set(0, trimY, halfZ + trimW / 2);
  roomGroup.add(edgeB);

  const edgeL = box(trimW, trimT, INSTRUMENT_BENCH.sz, matSteelTrim);
  edgeL.position.set(-halfX - trimW / 2, trimY, 0);
  roomGroup.add(edgeL);

  const edgeR = box(trimW, trimT, INSTRUMENT_BENCH.sz, matSteelTrim);
  edgeR.position.set(halfX + trimW / 2, trimY, 0);
  roomGroup.add(edgeR);

  // Laboratory floor
  const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), M(0x0a0e14, { r: 0.8, m: 0.05 }));
  floorMesh.name = 'Body_Floor';
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = -benchY;
  floorMesh.receiveShadow = true;
  roomGroup.add(floorMesh);

  // Elevated laboratory room ceiling (Y >= 28.0 m) with single-sided backface culling
  const ceilingGeo = new THREE.PlaneGeometry(60, 60);
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x1e2838,
    roughness: 0.9,
    metalness: 0.05,
    side: THREE.FrontSide, // Culled when looking down from above!
  });
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceiling.name = 'Body_Ceiling';
  ceiling.rotation.x = Math.PI / 2; // Downward facing
  ceiling.position.y = 28.0;
  roomGroup.add(ceiling);

  // Backsplash Wall
  const wallH = 14.0;
  const wallD = 0.25;
  const wallW = 32.0;
  const wallZ = halfZ + wallD / 2 + 0.02;
  const wall = box(wallW, wallH, wallD, M(0x475569, { r: 0.85, m: 0.02 }));
  wall.name = 'Body_Wall';
  wall.position.set(0, wallH / 2 - 0.04, wallZ);
  wall.receiveShadow = true;
  roomGroup.add(wall);

  // Heavy-duty cast aluminum bench duplex receptacle box (Power_Receptacle_Duplex)
  const outletGroup = new THREE.Group();
  outletGroup.name = 'Power_Receptacle_Duplex';
  outletGroup.position.set(INSTRUMENT_BENCH.outlet.x, 0.0, INSTRUMENT_BENCH.outlet.z - 0.40);

  const jbox = box(0.54, 0.72, 0.36, M(0x8a9199, { r: 0.32, m: 0.85 }));
  jbox.position.y = 0.36;
  outletGroup.add(jbox);

  const plate = box(0.50, 0.68, 0.02, M(0xd1d5db, { r: 0.22, m: 0.92 }));
  plate.position.set(0, 0.36, -0.19);
  outletGroup.add(plate);

  // Dual NEMA 5-15R Receptacles (Ground Pin UP)
  for (const yOut of [0.48, 0.24]) {
    const recFace = cyl(0.14, 0.14, 0.02, matRubber, 28);
    recFace.rotation.x = Math.PI / 2;
    recFace.position.set(0, yOut, -0.20);
    outletGroup.add(recFace);

    // Ground pin hole (U-shaped, top)
    const gndHole = cyl(0.018, 0.018, 0.04, M(0x05070a), 16);
    gndHole.rotation.x = Math.PI / 2;
    gndHole.position.set(0, yOut + 0.055, -0.205);
    outletGroup.add(gndHole);

    // Neutral & Hot slots
    const neutSlot = box(0.02, 0.08, 0.04, M(0x05070a));
    neutSlot.position.set(-0.055, yOut - 0.02, -0.205);
    outletGroup.add(neutSlot);

    const hotSlot = box(0.016, 0.065, 0.04, M(0x05070a));
    hotSlot.position.set(0.055, yOut - 0.02, -0.205);
    outletGroup.add(hotSlot);
  }
  roomGroup.add(outletGroup);
  registerPart(outletGroup, 'Electrical', 'Laboratory bench duplex electrical receptacle box (120V/20A)');

  // Heavy-duty SJTOW AC mains power cord with molded NEMA 5-15P plug
  const cordGroup = new THREE.Group();
  cordGroup.name = 'Body_Assembly_PowerCord';

  // Molded 3-prong NEMA 5-15P plug
  const plugGroup = new THREE.Group();
  plugGroup.name = 'Power_Plug';
  plugGroup.position.set(INSTRUMENT_BENCH.outlet.x, 0.48, INSTRUMENT_BENCH.outlet.z - 0.40 - 0.22);

  const plugBody = box(0.24, 0.28, 0.32, matRubber);
  plugGroup.add(plugBody);

  // Brass ground pin & hot/neutral blades
  const gndPin = cyl(0.016, 0.016, 0.22, matBrass, 12);
  gndPin.rotation.x = Math.PI / 2;
  gndPin.position.set(0, 0.055, 0.16);
  plugGroup.add(gndPin);

  const bladeL = box(0.018, 0.075, 0.18, matBrass);
  bladeL.position.set(-0.055, -0.02, 0.16);
  plugGroup.add(bladeL);

  const bladeR = box(0.015, 0.060, 0.18, matBrass);
  bladeR.position.set(0.055, -0.02, 0.16);
  plugGroup.add(bladeR);

  cordGroup.add(plugGroup);
  refs.powerPlug = plugGroup;
  interactiveMeshes.push({ mesh: plugBody, id: 'powerPlug', hint: 'Connect / Disconnect AC Mains Plug' });

  // Flexible power cord spline running between plug and controller rear IEC inlet
  const p0 = new THREE.Vector3(INSTRUMENT_BENCH.outlet.x, 0.48, INSTRUMENT_BENCH.outlet.z - 0.40 - 0.45);
  const p1 = new THREE.Vector3(INSTRUMENT_BENCH.outlet.x - 0.10, 0.04, INSTRUMENT_BENCH.outlet.z - 0.85);
  const p2 = new THREE.Vector3(ctrlGroup.position.x - 0.40, 0.04, 0.95);
  const p3 = new THREE.Vector3(ctrlGroup.position.x - 0.60, ctrlGroup.position.y - 0.30, ctrlGroup.position.z + ctrlD / 2 + 0.02);

  const cordCurve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
  const cordGeo = new THREE.TubeGeometry(cordCurve, 32, 0.035, 10, false);
  const cordMesh = new THREE.Mesh(cordGeo, matCableSJTOW);
  cordMesh.name = 'Body_PowerCord';
  cordMesh.castShadow = true;
  cordGroup.add(cordMesh);
  refs.powerCord = cordGroup;

  roomGroup.add(cordGroup);
  registerPart(cordGroup, 'Electrical', 'SJTOW 14 AWG 3-conductor laboratory power cord & NEMA 5-15P plug');

  assemblies.room.add(roomGroup);

  // Add all assemblies to root
  Object.values(assemblies).forEach((grp) => root.add(grp));

  // -------------------------------------------------------------------------
  // Exploded View & Kinematics Control API
  // -------------------------------------------------------------------------
  let isExploded = false;

  function setExploded(exploded) {
    isExploded = !!exploded;
    const factor = isExploded ? 1.0 : 0.0;

    // Clean vertical and lateral kinematic separation:
    // 1. Clamshell heater halves open laterally and lower
    if (refs.heaterLeft && refs.heaterRight) {
      refs.heaterLeft.position.x = -1.15 * factor;
      refs.heaterRight.position.x = 1.15 * factor;
      assemblies.heater.position.y = -1.50 * factor;
    }

    // 2. Reaction vessel body and split rings descend
    assemblies.vessel.position.y = -2.20 * factor;
    if (splitLeftGroup && splitRightGroup) {
      splitLeftGroup.position.x = -0.85 * factor;
      splitRightGroup.position.x = 0.85 * factor;
    }

    // 3. Motor belt guard and drive assembly lift vertically
    assemblies.stirrer.position.y = 1.60 * factor;

    // 4. Service fittings elevate slightly for inspection
    assemblies.fittings.position.y = 0.75 * factor;

    // 5. Controller slides rightwards
    assemblies.controller.position.x = 1.80 * factor;
  }

  function setStirrerRotation(rad) {
    if (refs.stirrerShaft) {
      refs.stirrerShaft.rotation.y = rad;
    }
  }

  function setPressureGaugeSweep(bar) {
    // 0 bar = 135° (0.75 PI), 250 bar = 405° (2.25 PI) -> sweep of 1.5 PI
    if (refs.gaugeNeedle) {
      const ratio = Math.max(0, Math.min(1.0, bar / 250.0));
      // In Three.js screen space, needle rotates clockwise with negative Z angle
      refs.gaugeNeedle.rotation.z = Math.PI * 0.75 - ratio * (Math.PI * 1.5);
    }
  }

  function updateThermalGlow(tempC, heaterActive) {
    if (refs.thermalGlow && refs.chamberLight) {
      if (!heaterActive || tempC < 45.0) {
        refs.thermalGlow.emissiveIntensity = 0.0;
        refs.chamberLight.intensity = 0.0;
        return;
      }
      const heatFrac = Math.max(0, Math.min(1.0, (tempC - 45.0) / 300.0));
      refs.thermalGlow.emissiveIntensity = heatFrac * 2.2;
      refs.thermalGlow.emissive.setHSL(0.08 - heatFrac * 0.05, 1.0, 0.48);
      refs.chamberLight.intensity = heatFrac * 2.8;
      refs.chamberLight.color.setHSL(0.08 - heatFrac * 0.05, 1.0, 0.48);
    }
  }

  function setWireframe(enabled) {
    root.traverse((node) => {
      if (node.isMesh && node.material && node.name !== 'UI_LCD' && node.name !== 'Body_GaugeDial') {
        node.material.wireframe = !!enabled;
      }
    });
  }

  function focusPart(partName) {
    let targetMesh = null;
    root.traverse((node) => {
      if (node.name === partName) {
        targetMesh = node;
      }
    });

    if (!targetMesh) return null;

    // Ghost non-selected parts in wireframe, highlight focused part
    root.traverse((node) => {
      if (node.isMesh && node.material && node.name !== 'UI_LCD') {
        const isTarget = node === targetMesh || node.parent === targetMesh;
        node.material.wireframe = !isTarget;
        node.material.opacity = isTarget ? 1.0 : 0.25;
        node.material.transparent = !isTarget;
      }
    });

    const box = new THREE.Box3().setFromObject(targetMesh);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    return { center, size, name: partName };
  }

  function clearFocus() {
    root.traverse((node) => {
      if (node.isMesh && node.material && node.name !== 'UI_LCD') {
        node.material.wireframe = false;
        node.material.opacity = 1.0;
        node.material.transparent = false;
      }
    });
  }

  return {
    root,
    refs,
    assemblies,
    partsList,
    interactiveMeshes,
    setExploded,
    setStirrerRotation,
    setPressureGaugeSweep,
    updateThermalGlow,
    setWireframe,
    focusPart,
    clearFocus,
  };
}
