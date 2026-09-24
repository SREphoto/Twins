/**
 * Lab machine registry — packages under Twins/ that can sit on the lab desk.
 *
 * status:
 *   ready   — full interactive twin (viewerUrl loads control panel + 3D)
 *   planned — placeholder until NBA ships the package
 *
 * transitionKind drives the desk exit/enter animation silhouette.
 */
export const MACHINES = [
  {
    id: "centrifuge",
    name: "MICRO 5424-R",
    tag: "Refrigerated microcentrifuge",
    packageDir: "centrifuge_twin",
    status: "ready",
    viewerUrl: "../centrifuge_twin/software/viewer/",
    transitionKind: "centrifuge",
    panelHint: "Keypad, LCD, lid interlock, samples, continuous demo",
  },
  {
    id: "ultrasonic_cleaner",
    name: "Ultrasonic Cleaner",
    tag: "Acoustic Cavitation Cleaning Bath",
    packageDir: "ultrasonic_cleaner_twin",
    status: "ready",
    viewerUrl: "../ultrasonic_cleaner_twin/software/viewer/",
    transitionKind: "box",
    panelHint: "Piezo transducers, heater PID, degas mode, cavitation particles",
  },
  {
    id: "high_pressure_reactor",
    name: "High Pressure Reactor",
    tag: "Parr 4560 600mL 200-Bar Stirred Mini-Reactor",
    packageDir: "high_pressure_reactor_twin",
    status: "ready",
    viewerUrl: "../high_pressure_reactor_twin/software/viewer/",
    transitionKind: "box",
    panelHint: "6-bolt flange head, SmCo magnetic drive, burst disc safety vent",
  },
  {
    id: "muffle_furnace",
    name: "Muffle Furnace",
    tag: "9L 1200°C High-Temp Ceramic Fibre Furnace",
    packageDir: "muffle_furnace_twin",
    status: "ready",
    viewerUrl: "../muffle_furnace_twin/software/viewer/",
    transitionKind: "box",
    panelHint: "MoSi2 heating rods, PID ramp/soak, door interlock thermal cutoff",
  },
  {
    id: "ph_meter",
    name: "pH Meter",
    tag: "Benchtop Dual pH/mV Meter with ATC",
    packageDir: "ph_meter_twin",
    status: "ready",
    viewerUrl: "../ph_meter_twin/software/viewer/",
    transitionKind: "box",
    panelHint: "Glass combination electrode, ATC thermistor, 3-point calibration",
  },
  {
    id: "rotovap",
    name: "Rotary Evaporator",
    tag: "Motorized Lift Rotovap with Heating Bath",
    packageDir: "rotovap_twin",
    status: "ready",
    viewerUrl: "../rotovap_twin/software/viewer/",
    transitionKind: "box",
    panelHint: "Motorized lift, rotation speed knob, heating bath PID, vacuum controller",
  },
  {
    id: "glove_box",
    name: "Glove Box",
    tag: "Inert Atmosphere Glove Box with Vacuum Lock",
    packageDir: "glove_box_twin",
    status: "ready",
    viewerUrl: "../glove_box_twin/software/viewer/",
    transitionKind: "box",
    panelHint: "Antechamber vacuum evacuation, butyl gloves, O2/H2O sensors",
  },
  {
    id: "balance",
    name: "Analytical Balance",
    tag: "0.1 mg Precision Balance with Draft Shield",
    packageDir: "balance_twin",
    status: "ready",
    viewerUrl: "../balance_twin/software/viewer/",
    transitionKind: "box",
    panelHint: "0.1 mg readability, sliding glass doors, tare/calib routines",
  },
  {
    id: "vacuum_pump",
    name: "Vacuum Pump",
    tag: "Laboratory Diaphragm Vacuum Pump",
    packageDir: "vacuum_pump_twin",
    status: "ready",
    viewerUrl: "../vacuum_pump_twin/software/viewer/",
    transitionKind: "box",
    panelHint: "Head pressure gauge, speed pot, gas ballast valve",
  },
  {
    id: "vortex_mixer",
    name: "Vortex Mixer",
    tag: "Touch & Continuous Test Tube Mixer",
    packageDir: "vortex_mixer_twin",
    status: "ready",
    viewerUrl: "../vortex_mixer_twin/software/viewer/",
    transitionKind: "box",
    panelHint: "Touch/continuous mode switch, speed control knob",
  },
  {
    id: "hotplate",
    name: "Hotplate Stirrer",
    tag: "Digital Magnetic Stirrer & Hotplate with PT1000 ATC",
    packageDir: "hotplate_twin",
    status: "ready",
    viewerUrl: "../hotplate_twin/software/viewer/",
    transitionKind: "box",
    panelHint: "Thermal PID loop, magnetic vortex, PT1000 probe, residual heat warning",
  },
  {
    id: "spectrophotometer",
    name: "Spectrophotometer",
    tag: "Dual-Beam UV-Vis Spectrophotometer",
    packageDir: "spectrophotometer_twin",
    status: "ready",
    viewerUrl: "../spectrophotometer_twin/software/viewer/",
    transitionKind: "box",
    panelHint: "Czerny-Turner optics, Beer-Lambert law, 6-cell carousel, spectrum scan",
  },
];

export function getMachine(id) {
  return MACHINES.find((m) => m.id === id) || MACHINES[0];
}

export function listMachines() {
  return MACHINES.slice();
}
