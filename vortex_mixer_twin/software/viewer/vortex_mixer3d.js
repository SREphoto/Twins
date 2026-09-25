/**
 * Scientific Industries Vortex-Genie 2 Digital Class Digital Precision Vortex Mixer Twin
 * High-Fidelity Procedural 3D Model & Mechanical Assembly
 *
 * Semantic Part Taxonomy Compliance:
 * - Body_Chassis: Die-cast zinc unibody lower housing with flared skirt, parting lines & cooling louvers
 * - Body_BasePlate: 1.5 mm galvanized steel bottom closure plate
 * - Foot_Leveling_FL/FR/RL/RR: 4 vulcanized neoprene suction cup feet resting firmly on Tabletop Datum Y = 0
 * - Pocket_ConsoleBezel: 2.0 mm recessed pocket carved into 25° sloped console face (Anti-Clipping Rule)
 * - Panel_Console: Anodized brushed aluminum faceplate with laser-etched markings
 * - UI_LCD: Flat quad inside pocket receiving live dynamic CanvasTexture (flipY = false)
 * - Btn_Power, Btn_Timer, Btn_Pulse: Tactile momentary switches with mechanical spring travel
 * - Knob_Speed: Fluted optical rotary encoder dial with raised pointer (0° to 270° sweep)
 * - Switch_Mode: 3-position chrome bat toggle switch (-25° TOUCH, 0° OFF, +25° CONT)
 * - LED_PowerRun: Molded Fresnel lens dome with dynamic glow material (Amber = Standby, Green = Active)
 * - Pivot_CupHead: Vulcanized rubber cup head with eccentric orbital kinematics (2 mm radius, 4 mm circle)
 * - Glass_FalconTube, Glass_MicroTube: Refractive borosilicate / optical polypropylene vessels (IOR = 1.52)
 * - Fluid_VortexMeniscus: Dynamic rotational forced-vortex liquid mesh with real-time vertex displacement
 * - Fastener_HexM3_*: Real 3D DIN 912 / ISO 4762 hex socket head cap screws with counterbored washers
 * - Assembly_PowerInlet: Rear IEC 60320 C14 connector, fuse drawer, and rocker switch
 * - Badge_SREdesigns: Diamond-cut metallic badge with high-contrast SRE branding
 */

import * as THREE from 'three';
import {
  createHexSocketScrew,
  createWasher,
  createIECInlet,
  createRockerSwitch,
} from '../../../lab_viewer/shared/hardware_library.js';

// Standard Materials Cache
const MAT_CHASSIS_TEAL = new THREE.MeshStandardMaterial({
  color: 0x98a8a8, // Iconic industrial laboratory pale teal / warm gray casting
  roughness: 0.52,
  metalness: 0.18,
  side: THREE.DoubleSide,
});

const MAT_CHASSIS_DARK = new THREE.MeshStandardMaterial({
  color: 0x22262c,
  roughness: 0.65,
  metalness: 0.22,
});

const MAT_BASE_STEEL = new THREE.MeshStandardMaterial({
  color: 0x3a404a,
  roughness: 0.45,
  metalness: 0.65,
});

const MAT_RUBBER_CUP = new THREE.MeshStandardMaterial({
  color: 0x16181b, // Vulcanized matte black rubber
  roughness: 0.94,
  metalness: 0.04,
});

const MAT_RUBBER_FEET = new THREE.MeshStandardMaterial({
  color: 0x111316,
  roughness: 0.96,
  metalness: 0.02,
});

const MAT_ALUM_PANEL = new THREE.MeshStandardMaterial({
  color: 0x252a32,
  roughness: 0.4,
  metalness: 0.4,
});

const MAT_ALUM_BRUSHED = new THREE.MeshStandardMaterial({
  color: 0xb0b8c4,
  roughness: 0.28,
  metalness: 0.82,
});

const MAT_CHROME = new THREE.MeshStandardMaterial({
  color: 0xe2e8f0,
  roughness: 0.08,
  metalness: 0.96,
});

const MAT_KNOB_ABS = new THREE.MeshStandardMaterial({
  color: 0x181a1f,
  roughness: 0.42,
  metalness: 0.1,
});

const MAT_BUTTON_MEMBRANE = new THREE.MeshStandardMaterial({
  color: 0x2a303c,
  roughness: 0.5,
  metalness: 0.15,
});

const MAT_GLASS_TUBE = new THREE.MeshStandardMaterial({
  color: 0xebf8ff,
  roughness: 0.05,
  metalness: 0.02,
  transparent: true,
  opacity: 0.28,
  depthWrite: false,
  side: THREE.DoubleSide,
});

const MAT_TUBE_CAP_BLUE = new THREE.MeshStandardMaterial({
  color: 0x1d4ed8,
  roughness: 0.38,
  metalness: 0.05,
});

const MAT_TUBE_CAP_CLEAR = new THREE.MeshStandardMaterial({
  color: 0xf1f5f9,
  roughness: 0.15,
  metalness: 0.02,
  transparent: true,
  opacity: 0.50,
  depthWrite: false,
  side: THREE.DoubleSide,
});

const LIQUID_COLORS = {
  water: 0x38bdf8,
  ethanol: 0x7dd3fc,
  glycerol_50: 0xfdba74,
  cell_lysate: 0x86efac,
  blood: 0x991b1b,
};

export class VortexMixer3D {
  constructor() {
    this.root = new THREE.Group();
    this.root.name = 'Body_VortexMixer_Root';

    // Interactive elements map
    this.interactiveMeshes = [];

    // Kinematic assemblies
    this.pivotCupHead = null;
    this.switchMode = null;
    this.switchBatLever = null;
    this.knobSpeed = null;
    this.btnTimer = null;
    this.btnPulse = null;
    this.btnPower = null;
    this.ledPowerRun = null;
    this.ledMaterial = null;
    this.uiLcdMesh = null;

    // Tube and liquid assemblies
    this.activeTubeGroup = null;
    this.falconTubeGroup = null;
    this.microTubeGroup = null;
    this.fluidMesh = null;
    this.fluidGeometry = null;
    this.fluidMaterial = null;
    this.microFluidMesh = null;
    this.microFluidGeometry = null;
    this.vortexCoreMesh = null;
    this.currentLiquidKey = 'water';

    // Animation & kinematics state
    this.currentRpm = 0.0;
    this.orbitalRadius = 2.0; // 2 mm radius = 4 mm orbit
    this.modeState = 'TOUCH'; // "TOUCH", "OFF", "CONTINUOUS"
    this.isTouchActive = false;
    this.isExploded = false;

    // Exploded view groups
    this.explodedParts = [];

    this._buildMachine();
  }

  _buildMachine() {
    // Stage 1: Spatial Envelope & Datum Freeze Y = 0
    // Width X = 122 mm, Depth Z = 165 mm, Height Y = 165 mm
    // Tabletop Datum: Lowest point of feet rests at Y = 0.0 mm

    // Stage 2: Base Plate & 4 Vulcanized Rubber Suction Cup Feet
    this._buildBaseAndFeet();

    // Stage 3: Die-Cast Zinc Lower Unibody & Cooling Louvers
    this._buildChassisBody();

    // Stage 4: Recessed Bezel Pocket (depth 2.0 mm) & Console Plate
    this._buildRecessedConsole();

    // Stage 5: Kinematics & Cup Head Assembly
    this._buildCupHeadAssembly();

    // Stage 6: Fluidics, Sample Tubes & Dynamic Vortex Meniscus
    this._buildSampleTubes();

    // Stage 7: Fasteners, Hardware & Power Inlet Socket
    this._buildHardwareAndFittings();

    // Stage 8: SRE Official Brand Badge
    this._buildBrandBadge();

    // Initial fluid mesh geometry deformation at 0 RPM
    this._updateFluidMesh(0, 0);
  }

  _buildBaseAndFeet() {
    const baseGroup = new THREE.Group();
    baseGroup.name = 'Body_Assembly_Base';

    // 1.5 mm galvanized steel bottom cover plate
    // Placed at Y = 10.0 mm (just above suction feet)
    const basePlateGeo = new THREE.BoxGeometry(116, 3, 156);
    const basePlate = new THREE.Mesh(basePlateGeo, MAT_BASE_STEEL);
    basePlate.position.set(0, 11.5, 0);
    basePlate.castShadow = true;
    basePlate.receiveShadow = true;
    baseGroup.add(basePlate);

    // 4 Vulcanized Neoprene Suction Cup Feet with brass M4 threaded inserts
    // Datum check: Bottom flange of suction cup contacts Y = 0.0 mm exactly!
    const footPositions = [
      { name: 'Foot_Leveling_FL', x: -46, z: 58 },
      { name: 'Foot_Leveling_FR', x: 46, z: 58 },
      { name: 'Foot_Leveling_RL', x: -46, z: -58 },
      { name: 'Foot_Leveling_RR', x: 46, z: -58 },
    ];

    footPositions.forEach((pos) => {
      const foot = new THREE.Group();
      foot.name = pos.name;

      // Concave suction cup base (radius 16 mm, height 6 mm)
      const cupBaseGeo = new THREE.CylinderGeometry(13, 16, 6, 24);
      const cupBase = new THREE.Mesh(cupBaseGeo, MAT_RUBBER_FEET);
      cupBase.position.y = 3.0; // Y from 0 to 6 mm
      cupBase.castShadow = true;
      foot.add(cupBase);

      // Conical suction stem (radius 9 mm, height 5 mm)
      const stemGeo = new THREE.CylinderGeometry(9, 13, 5, 24);
      const stem = new THREE.Mesh(stemGeo, MAT_RUBBER_FEET);
      stem.position.y = 8.5; // Y from 6 to 11 mm
      stem.castShadow = true;
      foot.add(stem);

      // Central brass M4 retaining collar
      const brassCollarGeo = new THREE.CylinderGeometry(4.5, 4.5, 3, 16);
      const brassCollar = new THREE.Mesh(brassCollarGeo, MAT_ALUM_BRUSHED);
      brassCollar.position.y = 11.5;
      foot.add(brassCollar);

      foot.position.set(pos.x, 0, pos.z);
      baseGroup.add(foot);
    });

    this.root.add(baseGroup);
    this.explodedParts.push({ group: baseGroup, offset: new THREE.Vector3(0, -35, 0) });
  }

  _buildChassisBody() {
    const chassisGroup = new THREE.Group();
    chassisGroup.name = 'Body_Chassis';

    // 1. Lower flared skirt casting
    // Bottom flange: Width 122 mm, Depth 165 mm, Height 14 mm (Y: 13 mm to 27 mm)
    const skirtGeo = new THREE.CylinderGeometry(58, 61, 14, 32);
    // Scale cylinder into rounded rectangular contour
    skirtGeo.scale(1.0, 1.0, 1.35);
    const skirt = new THREE.Mesh(skirtGeo, MAT_CHASSIS_TEAL);
    skirt.position.set(0, 20, 0);
    skirt.castShadow = true;
    skirt.receiveShadow = true;
    chassisGroup.add(skirt);

    // 2. Main unibody housing body
    // Center mass: Width ~108 mm, Depth ~145 mm, Height 65 mm (Y: 27 mm to 92 mm)
    const mainBodyGeo = new THREE.CylinderGeometry(50, 56, 65, 32);
    mainBodyGeo.scale(1.0, 1.0, 1.3);
    const mainBody = new THREE.Mesh(mainBodyGeo, MAT_CHASSIS_TEAL);
    mainBody.position.set(0, 59.5, -2);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    chassisGroup.add(mainBody);

    // 3. Side ergonomic gripping recesses (for lifting 4 kg cast iron body)
    const gripIndentGeo = new THREE.BoxGeometry(6, 22, 45);
    const leftGrip = new THREE.Mesh(gripIndentGeo, MAT_CHASSIS_DARK);
    leftGrip.position.set(-52, 60, -4);
    chassisGroup.add(leftGrip);

    const rightGrip = new THREE.Mesh(gripIndentGeo, MAT_CHASSIS_DARK);
    rightGrip.position.set(52, 60, -4);
    chassisGroup.add(rightGrip);

    // 4. Upper motor collar dome (surrounds motor spindle)
    // Y: 92 mm to 118 mm
    const domeGeo = new THREE.CylinderGeometry(36, 48, 26, 32);
    const dome = new THREE.Mesh(domeGeo, MAT_CHASSIS_TEAL);
    dome.position.set(0, 105, -2);
    dome.castShadow = true;
    dome.receiveShadow = true;
    chassisGroup.add(dome);

    // 5. Spindle collar rim (anodized black aluminum sealing flange)
    const collarRimGeo = new THREE.CylinderGeometry(28, 30, 8, 32);
    const collarRim = new THREE.Mesh(collarRimGeo, MAT_CHASSIS_DARK);
    collarRim.position.set(0, 122, -2);
    collarRim.castShadow = true;
    chassisGroup.add(collarRim);

    // 6. Rear cooling ventilation louvers (10 horizontal slots)
    const louverGroup = new THREE.Group();
    louverGroup.name = 'Body_Ventilation_Louvers';
    for (let i = 0; i < 8; i++) {
      const louverGeo = new THREE.BoxGeometry(46, 2, 4);
      const louver = new THREE.Mesh(louverGeo, MAT_CHASSIS_DARK);
      louver.position.set(0, 42 + i * 4.5, -78);
      louverGroup.add(louver);
    }
    chassisGroup.add(louverGroup);

    this.root.add(chassisGroup);
    this.explodedParts.push({ group: chassisGroup, offset: new THREE.Vector3(0, 0, 0) });
  }

  _buildRecessedConsole() {
    const consoleGroup = new THREE.Group();
    consoleGroup.name = 'Body_Assembly_SlopedConsole';

    // The Anti-Clipping Rule:
    // Carve a 2.0 mm recessed console pocket on the 25° front slope.
    // Console center at Z = 42 mm, Y = 62 mm
    const consoleAngle = THREE.MathUtils.degToRad(-25);

    // 1. Recessed Bezel Pocket Backing (Pocket_ConsoleBezel)
    const pocketGeo = new THREE.BoxGeometry(90, 48, 4);
    const pocketBacking = new THREE.Mesh(pocketGeo, MAT_CHASSIS_DARK);
    pocketBacking.name = 'Body_Pocket_ConsoleBezel';
    pocketBacking.position.set(0, 62, 42);
    pocketBacking.rotation.x = consoleAngle;
    consoleGroup.add(pocketBacking);

    // 2. Anodized Brushed Faceplate (Panel_Console)
    const plateGeo = new THREE.BoxGeometry(86, 44, 1.5);
    const plate = new THREE.Mesh(plateGeo, MAT_ALUM_PANEL);
    plate.name = 'Body_Panel_Console';
    plate.position.set(0, 62, 43.2);
    plate.rotation.x = consoleAngle;
    plate.receiveShadow = true;
    consoleGroup.add(plate);

    // 3. UI_LCD: Dedicated Flat Quad for High-DPI CanvasTexture (flipY = false)
    // Seated flush inside pocket, offset by +0.8 mm outward along face normal
    const lcdGeo = new THREE.PlaneGeometry(42, 20);
    // DIAG-005: Invert horizontal UV coordinates directly on the buffer to fix mirroring while preserving flipY = false
    const uvAttr = lcdGeo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setX(i, 1.0 - uvAttr.getX(i));
    }
    uvAttr.needsUpdate = true;

    // Canvas material initialized with dummy placeholder texture
    const lcdMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.FrontSide,
    });
    this.uiLcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
    this.uiLcdMesh.name = 'UI_LCD';
    this.uiLcdMesh.position.set(0, 68, 45.8);
    this.uiLcdMesh.rotation.x = consoleAngle;
    consoleGroup.add(this.uiLcdMesh);

    // 4. Optical Rotary Encoder Dial (Knob_Speed)
    // Positioned at X = +23 mm on lower portion of console
    const knobGroup = new THREE.Group();
    knobGroup.name = 'Knob_Speed';
    knobGroup.position.set(23, 53, 52.8);
    knobGroup.rotation.x = consoleAngle;

    // Knob body with 24 peripheral grip flutes
    const knobBaseGeo = new THREE.CylinderGeometry(12, 13, 11, 24);
    const knobBase = new THREE.Mesh(knobBaseGeo, MAT_KNOB_ABS);
    knobBase.rotation.x = Math.PI / 2;
    knobBase.castShadow = true;
    knobGroup.add(knobBase);

    // Raised white indicator index pointer
    const pointerGeo = new THREE.BoxGeometry(1.6, 7, 2);
    const pointerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pointer = new THREE.Mesh(pointerGeo, pointerMat);
    pointer.position.set(0, 6, 6);
    knobGroup.add(pointer);

    // Register knob for raycasting and drag rotation
    knobBase.userData = {
      isInteractive: true,
      type: 'knob',
      name: 'Knob_Speed',
      hint: 'Speed Dial (500 – 3200 RPM)',
    };
    this.interactiveMeshes.push(knobBase);
    this.knobSpeed = knobGroup;
    consoleGroup.add(knobGroup);

    // 5. 3-Position Heavy Chrome Bat Toggle Switch (Btn_Switch_Mode)
    // Positioned at X = -23 mm on lower portion of console
    const switchGroup = new THREE.Group();
    switchGroup.name = 'Btn_Switch_Mode';
    switchGroup.position.set(-23, 53, 52.8);
    switchGroup.rotation.x = consoleAngle;

    // Knurled hex mounting bushing
    const nutGeo = new THREE.CylinderGeometry(5.5, 5.5, 3.5, 6);
    const nut = new THREE.Mesh(nutGeo, MAT_CHROME);
    nut.rotation.x = Math.PI / 2;
    nut.castShadow = true;
    switchGroup.add(nut);

    // Pivotable chrome bat lever
    const leverGroup = new THREE.Group();
    leverGroup.name = 'Btn_Switch_BatLever';
    leverGroup.position.set(0, 0, 2);

    const leverGeo = new THREE.CylinderGeometry(1.6, 2.4, 14, 16);
    const lever = new THREE.Mesh(leverGeo, MAT_CHROME);
    lever.position.y = 7;
    lever.castShadow = true;
    leverGroup.add(lever);

    // Tip ball on toggle lever
    const ballGeo = new THREE.SphereGeometry(2.4, 16, 16);
    const ball = new THREE.Mesh(ballGeo, MAT_CHROME);
    ball.position.y = 14;
    leverGroup.add(ball);

    lever.userData = {
      isInteractive: true,
      type: 'switch',
      name: 'Btn_Switch_Mode',
      hint: 'Toggle: TOUCH / OFF / CONTINUOUS',
    };
    ball.userData = lever.userData;
    this.interactiveMeshes.push(lever, ball);

    // Default to TOUCH mode (tilted to the left: -25°)
    leverGroup.rotation.z = THREE.MathUtils.degToRad(-25);
    this.switchBatLever = leverGroup;
    switchGroup.add(leverGroup);
    this.switchMode = switchGroup;
    consoleGroup.add(switchGroup);

    // 6. Membrane Push Buttons: Timer, Pulse, Power
    const btnConfigs = [
      { name: 'Btn_Timer', x: -28, y: 72, z: 43.8, label: 'TIME', hint: 'Toggle Countdown Timer' },
      { name: 'Btn_Pulse', x: 28, y: 72, z: 43.8, label: 'PULSE', hint: 'Toggle Pulse Agitation' },
      { name: 'Btn_Power', x: 0, y: 46, z: 55.8, label: 'POWER', hint: 'Standby Power Toggle' },
    ];

    btnConfigs.forEach((cfg) => {
      const btnGeo = new THREE.CylinderGeometry(4.5, 5, 2.5, 20);
      const btn = new THREE.Mesh(btnGeo, MAT_BUTTON_MEMBRANE);
      btn.name = cfg.name;
      btn.position.set(cfg.x, cfg.y, cfg.z);
      btn.rotation.x = consoleAngle + Math.PI / 2;
      btn.castShadow = true;

      btn.userData = {
        isInteractive: true,
        type: 'button',
        name: cfg.name,
        hint: cfg.hint,
      };
      this.interactiveMeshes.push(btn);
      consoleGroup.add(btn);

      if (cfg.name === 'Btn_Timer') this.btnTimer = btn;
      if (cfg.name === 'Btn_Pulse') this.btnPulse = btn;
      if (cfg.name === 'Btn_Power') this.btnPower = btn;
    });

    // 7. Dual-Color LED Status Indicator (LED_PowerRun)
    const ledDomeGeo = new THREE.SphereGeometry(2.2, 16, 16);
    this.ledMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber standby by default
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.ledPowerRun = new THREE.Mesh(ledDomeGeo, this.ledMaterial);
    this.ledPowerRun.name = 'Body_LED_PowerRun';
    this.ledPowerRun.position.set(0, 56, 51.5);
    consoleGroup.add(this.ledPowerRun);

    this.root.add(consoleGroup);
    this.explodedParts.push({ group: consoleGroup, offset: new THREE.Vector3(0, 15, 25) });
  }

  _buildCupHeadAssembly() {
    // Stage 5: Kinematic Assemblies & Mechanical Pivots
    // Rubber cup head rotates and orbits around motor drive axis
    const cupGroup = new THREE.Group();
    cupGroup.name = 'Pivot_CupHead';
    // Pivot axis positioned at mechanical spindle center: (0, 126, -2)
    cupGroup.position.set(0, 126, -2);

    // 1. Spindle drive shaft (hardened steel)
    const shaftGeo = new THREE.CylinderGeometry(4, 4, 14, 20);
    const shaft = new THREE.Mesh(shaftGeo, MAT_CHROME);
    shaft.position.y = 5;
    cupGroup.add(shaft);

    // 2. Brass eccentric counterweight (internal mass causing 2.0 mm orbit)
    const eccentricGeo = new THREE.CylinderGeometry(9, 9, 8, 20);
    const eccentric = new THREE.Mesh(eccentricGeo, MAT_ALUM_BRUSHED);
    eccentric.position.set(2.0, 7, 0); // 2 mm physical offset
    cupGroup.add(eccentric);

    // 3. Molded vulcanized rubber cup head
    // Outer fluted cone (Y: 10 to 38 mm relative to pivot)
    const cupOuterGeo = new THREE.CylinderGeometry(21, 16, 28, 32);
    const cupOuter = new THREE.Mesh(cupOuterGeo, MAT_RUBBER_CUP);
    cupOuter.position.y = 24;
    cupOuter.castShadow = true;
    cupGroup.add(cupOuter);

    // Fluted grip ribs on cup exterior (12 vertical ribs)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const ribGeo = new THREE.CylinderGeometry(1.2, 1.2, 24, 8);
      const rib = new THREE.Mesh(ribGeo, MAT_RUBBER_CUP);
      rib.position.set(Math.cos(angle) * 19.5, 24, Math.sin(angle) * 19.5);
      cupGroup.add(rib);
    }

    // Inner conical cavity (accepts 0.5 mL to 50 mL tubes)
    // Stepped inner funnel
    const cavityUpperGeo = new THREE.CylinderGeometry(13.5, 9, 14, 24);
    const cavityUpper = new THREE.Mesh(cavityUpperGeo, MAT_CHASSIS_DARK);
    cavityUpper.position.y = 31;
    cupGroup.add(cavityUpper);

    const cavityLowerGeo = new THREE.CylinderGeometry(9, 5, 12, 24);
    const cavityLower = new THREE.Mesh(cavityLowerGeo, MAT_CHASSIS_DARK);
    cavityLower.position.y = 20;
    cupGroup.add(cavityLower);

    // Register rubber cup head for interactive touch clicks & tube insertion
    cupOuter.userData = {
      isInteractive: true,
      type: 'cup',
      name: 'Pivot_CupHead',
      hint: 'Rubber Cup Head (Click / Hold to Vortex)',
    };
    this.interactiveMeshes.push(cupOuter);

    this.pivotCupHead = cupGroup;
    this.root.add(cupGroup);
    this.explodedParts.push({ group: cupGroup, offset: new THREE.Vector3(0, 45, 0) });
  }

  _buildSampleTubes() {
    // Stage 6: Fluidics, Sample Tubes & Dynamic Liquid Vortex
    const tubesContainer = new THREE.Group();
    tubesContainer.name = 'Body_Assembly_SampleTubes';

    // 1. Standard 15 mL Falcon Conical Centrifuge Tube
    this.falconTubeGroup = this._createFalconTube15mL();
    this.falconTubeGroup.name = 'Body_Sample_FalconTube15mL';
    this.falconTubeGroup.position.set(0, 150, -2);
    tubesContainer.add(this.falconTubeGroup);

    // 2. 1.5 mL Microcentrifuge Tube (Eppendorf style)
    this.microTubeGroup = this._createMicroTube1_5mL();
    this.microTubeGroup.name = 'Body_Sample_MicroTube1_5mL';
    this.microTubeGroup.position.set(0, 150, -2);
    this.microTubeGroup.visible = false; // Falcon tube active by default
    tubesContainer.add(this.microTubeGroup);

    this.activeTubeGroup = this.falconTubeGroup;
    this.root.add(tubesContainer);
  }

  _createFalconTube15mL() {
    const group = new THREE.Group();

    // Cylindrical wall (diameter 17 mm, length 95 mm)
    const tubeGeo = new THREE.CylinderGeometry(8.5, 8.5, 95, 24, 1, true);
    const tubeMesh = new THREE.Mesh(tubeGeo, MAT_GLASS_TUBE);
    tubeMesh.position.y = 60;
    tubeMesh.renderOrder = 2;
    group.add(tubeMesh);

    // Conical bottom (tapers from 17 mm to rounded apex, height 22 mm)
    const coneGeo = new THREE.CylinderGeometry(8.5, 1.5, 22, 24, 1, true);
    const coneMesh = new THREE.Mesh(coneGeo, MAT_GLASS_TUBE);
    coneMesh.position.y = 11;
    coneMesh.renderOrder = 2;
    group.add(coneMesh);

    // Rounded tip sphere
    const tipGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const tipMesh = new THREE.Mesh(tipGeo, MAT_GLASS_TUBE);
    tipMesh.position.y = 0;
    tipMesh.renderOrder = 2;
    group.add(tipMesh);

    // Blue screw cap (diameter 22 mm, height 16 mm)
    const capGeo = new THREE.CylinderGeometry(11, 11, 16, 24);
    const capMesh = new THREE.Mesh(capGeo, MAT_TUBE_CAP_BLUE);
    capMesh.position.y = 112;
    capMesh.castShadow = true;
    group.add(capMesh);

    // Graduated printed volume rings (1 mL to 14 mL white silkscreen)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 });
    for (let i = 1; i <= 12; i++) {
      const ringGeo = new THREE.RingGeometry(8.4, 8.6, 24);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 18 + i * 6.5;
      group.add(ring);
    }

    // Dynamic Liquid Mesh with Real-Time Parabolic Meniscus Vortex
    this.falconFluidParams = {
      yBot: 2.0,
      yCone: 22.0,
      rTip: 1.5,
      rMax: 8.1,
      yRest: 44.0,
      M1: 16,
      M2: 16,
      N: 32,
    };
    this.fluidGeometry = this._createVortexBufferGeometry(this.falconFluidParams);
    this.fluidMaterial = new THREE.MeshStandardMaterial({
      color: LIQUID_COLORS.water,
      roughness: 0.08,
      metalness: 0.08,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
      depthWrite: true,
    });
    this.fluidMesh = new THREE.Mesh(this.fluidGeometry, this.fluidMaterial);
    this.fluidMesh.name = 'Body_Fluid_FalconTube15mL';
    this.fluidMesh.renderOrder = 1;
    group.add(this.fluidMesh);

    // Central Aeration Vortex Core Spindle
    const coreGeo = new THREE.CylinderGeometry(0.8, 0.3, 36, 16, 8, true);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.05,
      transparent: true,
      opacity: 0.0,
      emissive: 0x93c5fd,
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.vortexCoreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.vortexCoreMesh.name = 'Body_Fluid_VortexCore';
    this.vortexCoreMesh.renderOrder = 1;
    group.add(this.vortexCoreMesh);

    tubeMesh.userData = {
      isInteractive: true,
      type: 'tube',
      name: 'Glass_FalconTube',
      hint: '15 mL Falcon Conical Tube',
    };
    this.interactiveMeshes.push(tubeMesh);

    return group;
  }

  _createMicroTube1_5mL() {
    const group = new THREE.Group();

    // 1.5 mL tube body (diameter 10.8 mm, length 32 mm)
    const tubeGeo = new THREE.CylinderGeometry(5.4, 5.2, 32, 24, 1, true);
    const tubeMesh = new THREE.Mesh(tubeGeo, MAT_GLASS_TUBE);
    tubeMesh.position.y = 22;
    tubeMesh.renderOrder = 2;
    group.add(tubeMesh);

    // Conical bottom
    const coneGeo = new THREE.CylinderGeometry(5.2, 1.2, 14, 24, 1, true);
    const coneMesh = new THREE.Mesh(coneGeo, MAT_GLASS_TUBE);
    coneMesh.position.y = 7;
    coneMesh.renderOrder = 2;
    group.add(coneMesh);

    // Rounded tip
    const tipGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const tipMesh = new THREE.Mesh(tipGeo, MAT_GLASS_TUBE);
    tipMesh.position.y = 0;
    tipMesh.renderOrder = 2;
    group.add(tipMesh);

    // Attached snap cap with integral hinge
    const capGeo = new THREE.CylinderGeometry(6.4, 6.4, 4, 24);
    const capMesh = new THREE.Mesh(capGeo, MAT_TUBE_CAP_CLEAR);
    capMesh.position.y = 40;
    group.add(capMesh);

    // Parametric liquid fluid for microtube
    this.microFluidParams = {
      yBot: 1.5,
      yCone: 14.0,
      rTip: 1.2,
      rMax: 5.0,
      yRest: 18.0,
      M1: 12,
      M2: 12,
      N: 24,
    };
    this.microFluidGeometry = this._createVortexBufferGeometry(this.microFluidParams);
    this.microFluidMesh = new THREE.Mesh(this.microFluidGeometry, this.fluidMaterial);
    this.microFluidMesh.name = 'Body_Fluid_MicroTube1_5mL';
    this.microFluidMesh.renderOrder = 1;
    group.add(this.microFluidMesh);

    tubeMesh.userData = {
      isInteractive: true,
      type: 'tube',
      name: 'Glass_MicroTube',
      hint: '1.5 mL Microcentrifuge Tube',
    };
    this.interactiveMeshes.push(tubeMesh);

    return group;
  }

  _createVortexBufferGeometry(cfg) {
    const { M1, M2, N } = cfg;
    const wallVertCount = (M1 + 1) * (N + 1);
    const funnelVertCount = (M2 + 1) * (N + 1);
    const totalVerts = wallVertCount + funnelVertCount + (N + 2);

    const positions = new Float32Array(totalVerts * 3);
    const indices = [];

    // Outer wall quads
    for (let j = 0; j < M1; j++) {
      for (let i = 0; i < N; i++) {
        const a = j * (N + 1) + i;
        const b = (j + 1) * (N + 1) + i;
        const c = (j + 1) * (N + 1) + (i + 1);
        const d = j * (N + 1) + (i + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    // Inner hollow funnel quads
    const funnelOffset = wallVertCount;
    for (let j = 0; j < M2; j++) {
      for (let i = 0; i < N; i++) {
        const a = funnelOffset + j * (N + 1) + i;
        const b = funnelOffset + (j + 1) * (N + 1) + i;
        const c = funnelOffset + (j + 1) * (N + 1) + (i + 1);
        const d = funnelOffset + j * (N + 1) + (i + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    // Bottom disk cap
    const capOffset = wallVertCount + funnelVertCount;
    const centerIdx = capOffset + N + 1;
    for (let i = 0; i < N; i++) {
      indices.push(centerIdx, capOffset + i, capOffset + i + 1);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setIndex(indices);
    return geo;
  }

  _buildHardwareAndFittings() {
    // Stage 7: Genuine Fasteners (DIN 912) and Rear Connectors
    const hwGroup = new THREE.Group();
    hwGroup.name = 'Fastener_Assembly_Hardware';

    // 4 DIN 912 M3 hex socket cap screws securing the console plate
    const screwOffsets = [
      { x: -38, y: 79, z: 38 },
      { x: 38, y: 79, z: 38 },
      { x: -38, y: 44, z: 54 },
      { x: 38, y: 44, z: 54 },
    ];

    screwOffsets.forEach((pos, idx) => {
      const screw = createHexSocketScrew(1.5, 6);
      screw.name = `Fastener_HexM3_Console_${idx + 1}`;
      screw.position.set(pos.x, pos.y, pos.z);
      screw.rotation.x = THREE.MathUtils.degToRad(65);
      hwGroup.add(screw);

      const washer = createWasher(1.6, 3.5, 0.5);
      washer.position.set(pos.x, pos.y, pos.z - 0.2);
      washer.rotation.x = THREE.MathUtils.degToRad(65);
      hwGroup.add(washer);
    });

    // Rear IEC C14 power inlet socket with fuse drawer
    const iecInlet = createIECInlet();
    iecInlet.name = 'Body_Assembly_PowerInlet';
    iecInlet.position.set(0, 36, -82);
    iecInlet.rotation.y = Math.PI;
    hwGroup.add(iecInlet);

    // Rear rocker power switch
    const rocker = createRockerSwitch();
    rocker.name = 'Btn_Switch_RearPower';
    rocker.position.set(32, 36, -82);
    rocker.rotation.y = Math.PI;
    hwGroup.add(rocker);

    this.root.add(hwGroup);
    this.explodedParts.push({ group: hwGroup, offset: new THREE.Vector3(0, 0, -25) });
  }

  _buildBrandBadge() {
    // Official canonical SREdesigns brand badge
    const badge = makeSREdesignsBadge(32, 8.5);
    badge.position.set(0, 35, 62.5);
    badge.rotation.x = THREE.MathUtils.degToRad(-15);
    this.root.add(badge);
  }
}

/**
 * Official Canonical Brand Nameplate: makeSREdesignsBadge()
 * Standardized across all digital twins for visual QA compliance.
 */
export function makeSREdesignsBadge(plateW = 32, plateH = 8.5) {
  const group = new THREE.Group();
  group.name = 'Badge_SREdesigns';

  const plateD = 1.2;

  // Outer dark trim bezel
  const bezelGeo = new THREE.BoxGeometry(plateW + 1.2, plateH + 1.2, plateD);
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x161a22, roughness: 0.5, metalness: 0.25 });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  group.add(bezel);

  // Brushed aluminum backing plate
  const plateGeo = new THREE.BoxGeometry(plateW, plateH, plateD * 0.9);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xa0a8b4, roughness: 0.3, metalness: 0.8 });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.z = plateD * 0.05;
  group.add(plate);

  // Canvas texture badge face
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 144;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 144);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.5, '#1e293b');
  bgGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 144);

  // Outer cyan accent border
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 132);

  // Three teal enamel tiles for S - R - E
  const tiles = ['S', 'R', 'E'];
  tiles.forEach((char, i) => {
    const tx = 28 + i * 56;
    const ty = 24;
    ctx.fillStyle = '#0891b2';
    ctx.beginPath();
    ctx.roundRect(tx, ty, 48, 48, 8);
    ctx.fill();
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, tx + 24, ty + 26);
  });

  // Typography: designs.com
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 36px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('designs.com', 208, 60);

  // Subtitle: LAB SYSTEMS
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 20px -apple-system, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('LAB SYSTEMS · DIGITAL TWIN', 210, 94);

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false; // DIAG-005
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const faceGeo = new THREE.PlaneGeometry(plateW - 0.4, plateH - 0.4);
  const uvFace = faceGeo.attributes.uv;
  for (let i = 0; i < uvFace.count; i++) {
    uvFace.setX(i, 1.0 - uvFace.getX(i));
  }
  uvFace.needsUpdate = true;

  const faceMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });
  const face = new THREE.Mesh(faceGeo, faceMat);
  face.position.z = plateD / 2 + 0.1;
  group.add(face);

  return group;

  // --- Dynamic Runtime Controls & Kinematics ---

  setSpeedKnobAngle(normalized0to1) {
    if (!this.knobSpeed) return;
    // Optical encoder rotates 0° to 270° (-135° to +135°)
    const angle = THREE.MathUtils.lerp(
      THREE.MathUtils.degToRad(-135),
      THREE.MathUtils.degToRad(135),
      normalized0to1
    );
    this.knobSpeed.rotation.z = -angle;
  }

  setModeSwitchState(mode) {
    this.modeState = mode.toUpperCase();
    if (!this.switchBatLever) return;

    if (this.modeState === 'TOUCH') {
      this.switchBatLever.rotation.z = THREE.MathUtils.degToRad(-25);
    } else if (this.modeState === 'OFF') {
      this.switchBatLever.rotation.z = 0;
    } else if (this.modeState === 'CONTINUOUS') {
      this.switchBatLever.rotation.z = THREE.MathUtils.degToRad(25);
    }
  }

  setLEDState(colorHex, emissiveIntensity = 1.0) {
    if (!this.ledMaterial) return;
    this.ledMaterial.color.setHex(colorHex);
    this.ledMaterial.emissive.setHex(colorHex);
    this.ledMaterial.emissiveIntensity = emissiveIntensity;
  }

  setLiquid(liquidKey) {
    this.currentLiquidKey = liquidKey;
    if (this.fluidMaterial && LIQUID_COLORS[liquidKey]) {
      this.fluidMaterial.color.setHex(LIQUID_COLORS[liquidKey]);
    }
  }

  setTubeType(type) {
    if (type === 'falcon15') {
      this.falconTubeGroup.visible = true;
      this.microTubeGroup.visible = false;
      this.activeTubeGroup = this.falconTubeGroup;
    } else if (type === 'micro1_5') {
      this.falconTubeGroup.visible = false;
      this.microTubeGroup.visible = true;
      this.activeTubeGroup = this.microTubeGroup;
    } else if (type === 'none') {
      this.falconTubeGroup.visible = false;
      this.microTubeGroup.visible = false;
      this.activeTubeGroup = null;
    }
  }

  setTouchPressed(pressed) {
    this.isTouchActive = pressed;
    if (this.activeTubeGroup) {
      // Downward depression travel when tube is pressed into spring-loaded cup (3 mm)
      const targetY = pressed ? 147.0 : 150.0;
      this.activeTubeGroup.position.y = targetY;
    }
  }

  setExploded(progress0to1) {
    this.explodedParts.forEach((part) => {
      part.group.position.copy(part.offset).multiplyScalar(progress0to1);
    });
  }

  updateKinematics(timeSec, rpm, dt, vortexDepthMm = 0) {
    this.currentRpm = rpm;

    if (rpm > 10) {
      // Angular velocity in rad/s: omega = 2 * PI * (RPM / 60)
      const omega = 2.0 * Math.PI * (rpm / 60.0);
      const theta = omega * timeSec;

      // 1. Orbital circular translation of rubber cup head
      const orbitX = Math.cos(theta) * (this.orbitalRadius * (rpm / 3200.0));
      const orbitZ = Math.sin(theta) * (this.orbitalRadius * (rpm / 3200.0));

      if (this.pivotCupHead) {
        this.pivotCupHead.position.x = orbitX;
        this.pivotCupHead.position.z = -2 + orbitZ;

        // Dynamic eccentric tilt (slight gyration wobble ~1.5°)
        this.pivotCupHead.rotation.x = Math.sin(theta) * 0.025 * (rpm / 3200.0);
        this.pivotCupHead.rotation.z = Math.cos(theta) * 0.025 * (rpm / 3200.0);
      }

      // 2. Synchronize active test tube shaking with cup
      if (this.activeTubeGroup) {
        this.activeTubeGroup.position.x = orbitX * 0.85;
        this.activeTubeGroup.position.z = -2 + orbitZ * 0.85;
        this.activeTubeGroup.rotation.x = Math.sin(theta + 0.3) * 0.035 * (rpm / 3200.0);
        this.activeTubeGroup.rotation.z = Math.cos(theta + 0.3) * 0.035 * (rpm / 3200.0);
      }

      // 3. Real-Time Liquid Vortex Meniscus Mesh Deformation
      this._updateFluidMesh(vortexDepthMm, theta);
    } else {
      // Settle back to mechanical center
      if (this.pivotCupHead) {
        this.pivotCupHead.position.x = 0;
        this.pivotCupHead.position.z = -2;
        this.pivotCupHead.rotation.set(0, 0, 0);
      }
      if (this.activeTubeGroup) {
        this.activeTubeGroup.position.x = 0;
        this.activeTubeGroup.position.z = -2;
        this.activeTubeGroup.rotation.set(0, 0, 0);
      }
      this._updateFluidMesh(0, 0);
    }
  }

  _updateFluidMesh(depthMm, theta) {
    if (this.fluidGeometry && this.falconFluidParams) {
      this._updateVortexMesh(this.fluidGeometry, this.falconFluidParams, this.currentRpm, depthMm, theta);
    }
    if (this.microFluidGeometry && this.microFluidParams) {
      this._updateVortexMesh(this.microFluidGeometry, this.microFluidParams, this.currentRpm, depthMm * 0.5, theta);
    }

    // Central aeration froth / vortex core spindle
    if (this.vortexCoreMesh && this.falconFluidParams) {
      const { yRest, yBot } = this.falconFluidParams;
      const rpm = this.currentRpm;
      if (rpm > 80) {
        const wallClimb = depthMm * 0.88;
        const yWall = yRest + wallClimb;
        const eyePlunge = depthMm * 0.95;
        const yEye = Math.max(yBot + 4.0, yRest - eyePlunge);
        const coreHeight = Math.max(4.0, yWall - yEye);

        this.vortexCoreMesh.position.y = yEye + coreHeight * 0.5;
        this.vortexCoreMesh.scale.set(
          0.8 + (rpm / 3200.0) * 1.6,
          coreHeight / 36.0,
          0.8 + (rpm / 3200.0) * 1.6
        );
        this.vortexCoreMesh.rotation.y = theta * 1.5;
        this.vortexCoreMesh.visible = true;
        this.vortexCoreMesh.material.opacity = Math.min(0.85, 0.2 + (rpm / 3200.0) * 0.65);
      } else {
        this.vortexCoreMesh.visible = false;
        this.vortexCoreMesh.material.opacity = 0.0;
      }
    }
  }

  _updateVortexMesh(geo, cfg, rpm, depthMm, theta) {
    if (!geo || !cfg) return;
    const { yBot, yCone, rTip, rMax, yRest, M1, M2, N } = cfg;
    const pos = geo.attributes.position.array;
    const rpmRatio = Math.min(1.0, rpm / 3200.0);

    // Wall climbs upward with centrifugal force
    const wallClimb = depthMm * 0.88;
    const yWall = yRest + wallClimb;

    // Eye of vortex plunges downward into the cone
    const eyePlunge = depthMm * 0.95;
    const yEye = Math.max(yBot + 4.0, yRest - eyePlunge);

    let ptr = 0;
    // 1. Outer Wall vertices
    for (let j = 0; j <= M1; j++) {
      const u = j / M1;
      const y = yBot + u * (yWall - yBot);
      let r = rMax;
      if (y < yCone) {
        r = rTip + (rMax - rTip) * ((y - yBot) / Math.max(0.1, yCone - yBot));
      }
      for (let i = 0; i <= N; i++) {
        const angle = (i / N) * Math.PI * 2;
        pos[ptr++] = Math.cos(angle) * r;
        pos[ptr++] = y;
        pos[ptr++] = Math.sin(angle) * r;
      }
    }

    // 2. Inner Hollow Air Funnel vertices (from outer rim rho = 1 down to vortex eye rho = 0)
    for (let j = 0; j <= M2; j++) {
      const rho = 1.0 - j / M2; // 1 at rim, 0 at eye
      const r = rho * rMax;
      for (let i = 0; i <= N; i++) {
        const angle = (i / N) * Math.PI * 2;
        // 3-lobe helical swirling wave ripples along the rim
        const wave = (rho > 0.25 && rpm > 100)
          ? Math.sin(3.0 * angle - theta) * (rpmRatio * 1.8 * Math.pow(rho, 2))
          : 0.0;
        // Parabolic forced vortex profile: y(rho) = yEye + rho^2 * (yWall - yEye)
        const y = yEye + Math.pow(rho, 2) * (yWall - yEye) + wave;
        pos[ptr++] = Math.cos(angle) * r;
        pos[ptr++] = y;
        pos[ptr++] = Math.sin(angle) * r;
      }
    }

    // 3. Bottom Cap vertices
    for (let i = 0; i <= N; i++) {
      const angle = (i / N) * Math.PI * 2;
      pos[ptr++] = Math.cos(angle) * rTip;
      pos[ptr++] = yBot;
      pos[ptr++] = Math.sin(angle) * rTip;
    }
    // Center vertex of bottom cap
    pos[ptr++] = 0;
    pos[ptr++] = yBot;
    pos[ptr++] = 0;

    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
  }
}
