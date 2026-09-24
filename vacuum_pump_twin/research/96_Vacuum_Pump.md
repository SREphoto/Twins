# Vacuum Pump — KNF Laboport N820 (Diaphragm)

## Operation Principle

Diaphragm vacuum pump using a reciprocating diaphragm to create vacuum pressure. Oil-free operation suitable for
laboratory applications including filtration, vacuum ovens, and rotary evaporators.

The pump uses a brushless DC motor driving a central shaft with dual eccentric cams (4 mm offset, counter-phase). Each
eccentric drives a connecting rod that reciprocates a PTFE-coated diaphragm. The diaphragm flexes to expand and contract
the pump chamber volume, creating vacuum on the intake stroke and compression on the discharge stroke. Conical
spring-loaded poppet check valves (FFPM perfluoroelastomer) control gas flow direction.

## Physical Specifications

- **Dimensions**: 300W × 160D × 210H mm
- **Weight**: 6.5 kg
- **Material**: ABS/aluminum body, stainless steel diaphragm
- **Power**: 230V/50Hz, 0.25 kW
- **Flow Rate**: 15 L/min max
- **Ultimate Vacuum**: 80 mbar absolute (single stage)
- **Noise Level**: < 50 dB(A)
- **Operating Temperature**: 5–40°C
- **Maximum Ambient**: 40°C

## Control Panel Layout

- **Front Panel**:
  - Vacuum gauge: Ø50mm dial on angled front panel (Bourdon tube, 0–760 mmHg)
  - On/Off toggle switch on front panel
  - Gas ballast knob (Knob_Ballast, Ø20mm knurled)
  - Status LED (green when powered)
- **Rear Panel**:
  - KF25 inlet port (front-left, Ø25mm collar)
  - Muffled exhaust (rear, hex mesh grill)
  - IEC C14 power inlet (rear-bottom)
  - Fuse holder (next to power inlet)
- **Top**:
  - Carry handle: 200×30×20mm
- **Bottom**:
  - 4 rubber vibration-absorbing feet
  - Ventilation slots

## Key Functions

1. Vacuum generation for filtration and evaporation
2. Gas ballast for vapor handling (reduces condensate buildup)
3. Oil-free operation for chemical compatibility
4. Quiet operation with muffled exhaust
5. Portable with carry handle
6. Thermal overload protection with auto-reset

## Safety Systems

- Thermal overload protection (bimetallic cutout, auto-reset after cooling)
- No oil contamination (oil-free design)
- Pressure relief valve (internal)
- Chemical-resistant wetted materials (PTFE, FFPM, PVDF)

## Moving Parts

- Motor rotor (internal, brushless DC)
- Central drive shaft with dual eccentric cams
- Connecting rods (×2, counter-phase)
- Diaphragms (×2, reciprocating)
- Poppet valves (×4, spring-loaded)
- Cooling fan (on motor shaft)
- Vacuum gauge needle (analog)
- Gas ballast knob (rotary)

## Materials & Finishes

- ABS housing: dark gray, textured finish
- Aluminum components: brushed finish
- Stainless steel: polished
- Rubber feet: black
- PTFE diaphragm: white/translucent
- PVDF head components: light gray
- FFPM seals: black
- Copper motor windings: copper color

## Rear Panel / Connectors

- KF25 inlet port (front-left, 25 mm bore quick-release flange)
- Exhaust port (rear, with sintered metal muffler)
- Power cord entry (rear-bottom, IEC C14)
- Fuse holder (rear-bottom, next to power inlet)
- Ventilation slots (rear and sides)

## Technical Specifications

- **Motor**: Brushless DC, maintenance-free, 60–80W
- **Crank Drive**: Coaxial motor shaft, dual eccentric cams (4mm offset, counter-phase), dual steel connecting rods
  (Pleuel)
- **Diaphragm**: PTFE-coated convoluted EPDM rubber diaphragm
- **Valves**: Conical spring-loaded poppet check valves (FFPM perfluoroelastomer)
- **Seals**: FFPM and Viton chemical-resistant O-rings
- **Bearings**: Needle roller bearings on eccentric journals, thrust bearings at rod tops
- **Shaft Coupling**: Two-piece aluminum with elastomer spider
- **Power Supply**: Internal AC-DC converter
- **EMI Filter**: Internal line filter

## Diaphragm Pump Head Components

The N820 diaphragm pump head assembly consists of 8 main parts for maintenance training:

1. **Central Screw**: M4 socket head cap screw clamping the pressure plate.
2. **Pressure Plate**: Distributes the clamping force evenly over the PTFE cover.
3. **Head Cover**: PTFE cylinder containing the gas channels and PVDF ports.
4. **Valve Plates/Seals**: Conical FFPM check valves that control intake/discharge.
5. **Locating Pin**: Positioning pin to align the head cover.
6. **Intermediate Plate**: Houses the poppet valve seats and gas ballast path.
7. **Diaphragm**: Convoluted elastomer diaphragm flexing to expand/contract the chamber.
8. **Shim Rings**: Steel depth-adjustment washers used to minimize dead clearance volume.

## Internal Drive Mechanism

The pump uses a dual-head counter-phase design for smooth operation:

```diagram
Motor → Shaft Coupling → Central Rotor Shaft
                              ├── Eccentric Cam (Front, +4mm Z offset)
                              │       └── Needle Bearing
                              │           └── Connecting Rod (Front)
                              │               └── Thrust Bearing
                              │                   └── Diaphragm (Front Head)
                              │
                              └── Eccentric Cam (Back, -4mm Z offset)
                                      └── Needle Bearing
                                          └── Connecting Rod (Back)
                                              └── Thrust Bearing
                                                  └── Diaphragm (Back Head)
```

The counter-phase arrangement means one diaphragm is at maximum displacement while the other is at minimum, providing
smoother flow and reduced vibration.

## Real-World References

- KNF Laboport N820 diaphragm pump (primary reference)
- KNF Laboport N840 (larger variant, 20 L/min)
- Welch 2546B (similar form factor, oil-free piston)
- Vacuubrand MD 4C (chemistry diaphragm pump, 2 mbar ultimate)
- Edwards nXDS10i (dry scroll pump, higher vacuum)

## NGSS Alignment

- HS-PS3-3: Design and refine a device that works within given constraints to convert one form of energy into another
  form of energy
- HS-ETS1-2: Design a solution to a complex real-world problem by breaking it down into smaller, more manageable
  problems
- HS-ETS1-3: Evaluate a solution to a complex real-world problem based on prioritized criteria and trade-offs

## Cross-Section View (Text Diagram)

```diagram
                    ┌─────────────────────────────┐
                    │        Carry Handle         │
                    ├─────────────────────────────┤
                    │     Upper Housing (ABS)     │
            ┌───────┤                             ├───────┐
            │       │  ┌─────────────────────┐    │       │
            │       │  │  Head Cover (PTFE)  │    │       │
            │       │  │    ┌───┐   ┌───┐    │    │       │
            │       │  │    │ V │   │ V │    │    │       │
            │       │  │    └───┘   └───┘    │    │       │
            │       │  │  Intermediate Plate │    │       │
            │       │  │    ┌───┐   ┌───┐    │    │       │
            │       │  │    │ V │   │ V │    │    │       │
            │       │  │    └───┘   └───┘    │    │       │
            │       │  ├─────────────────────┤    │       │
            │       │  │   Diaphragm (PTFE)  │    │       │
            │       │  └─────────────────────┘    │       │
            │       │           │                 │       │
            │       │    Connecting Rod           │       │
            │       │           │                 │       │
            │       │    Eccentric Cam            │       │
            │       │    ──── Motor ────          │       │
            │       │         Shaft               │       │
            │       │                             │       │
            │       │    Lower Housing (ABS)      │       │
            │       │    ┌─────────────────┐      │       │
            │       │    │  Power Supply   │      │       │
            │       │    └─────────────────┘      │       │
            │       │    ┌─────────────────┐      │       │
            │       │    │   EMI Filter    │      │       │
            │       │    └─────────────────┘      │       │
            └───────┤                             ├───────┘
                    ├─────────────────────────────┤
                    │     Rubber Feet (×4)        │
                    └─────────────────────────────┘
```

## Vacuum Gauge Details

- **Type**: Bourdon tube, analog
- **Dial Diameter**: 50 mm
- **Range**: 0–760 mmHg (0–1013 mbar)
- **Connection**: 1/8" NPT bottom mount
- **Location**: Angled front panel for visibility
- **Standard**: EN 837-1

## Gas Ballast System

- **Purpose**: Reduces condensate buildup by admitting controlled air into the pump chamber
- **Control**: Knurled rotary knob on front panel
- **Effect**: Slightly reduces ultimate vacuum but prevents liquid accumulation
- **Usage**: Recommended when pumping vapors or humid gases
