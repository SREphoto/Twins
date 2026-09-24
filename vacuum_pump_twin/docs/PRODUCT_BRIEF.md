# Product Brief — Diaphragm Vacuum Pump Twin

Detailed product definition for the KNF Laboport N820 diaphragm vacuum pump twin.

## 1. Instrument Class & Form Factor

- **Commercial Reference:** Based on KNF Laboport N820 (oil-free diaphragm vacuum pump).
- **Form Factor:** Benchtop laboratory vacuum pump, dual-head, dry operation.
- **Target Audience:** Chemistry students, lab technicians, and AI tutor agents.
- **Key Specifications:** 15 L/min max flow rate, 80 mbar absolute ultimate vacuum (single stage), 230V/0.25 kW motor.

## 2. Interactive Requirements

- **Power Switch:** Front-panel toggle switch to power the unit.
- **Gas Ballast Valve:** Knurled rotary knob to open/close ballast path, altering ultimate vacuum (condensate
  prevention).
- **Speed Potentiometer:** Rotary speed dial on the upper deck to adjust motor RPM (1500 to 3000 RPM) to match vacuum
  rates for different setups.
- **Vacuum Gauge:** Analog Bourdon dial (0–760 mmHg) on front face displaying current system pressure.

## 3. Visual Requirements

- **3D View:** Self-contained, procedural Three.js model of the pump. Lower housing (dark gray ABS squircle), upper
  housing, carry handle, feet, two cylinder-shaped pump heads (aluminum with cooling fins), and wetted internals (PTFE
  diaphragms and poppet check valves).
- **Lab Context:** Black bench surface, power outlet (IEC cord routing), walls, floor, and realistic lighting.
- **Gauge Readouts:** Dual readout: analog gauge needle + digital readout in the side panel (mbar and L/min).
- **Animations:**
  - Reciprocating diaphragms (PTFE EPDM)
  - Dual connecting rods and eccentric cams (counter-phase)
  - Valve poppets pulsing/fluttering on stroke transitions
  - Motor cooling fan spinning on shaft
  - Vacuum gauge needle tracking pressure dynamically

## 4. Safety & Interlocks

- **Thermal Cutout:** Simulated motor overheat fault at temperatures exceeding 130°C (requires cooling/reset period).
- **Vacuum Leakage:** System leak simulation when lines are not tightly connected or when gas ballast is opened.

## 5. Educational Integration (Demo & Disassembly)

- **Student Demo:** Guided loop demonstrating startup, leak test, evacuation curve, gas ballast condensation prevention,
  vent cycle, and shutdown.
- **BOM Explorer:** Exploded view separating the 35+ components (head covers, intermediate plates, poppets, springs,
  bearings, couplings, feet) with interactive labels mapping to the official BOM.
