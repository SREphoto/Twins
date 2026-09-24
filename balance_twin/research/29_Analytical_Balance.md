# Analytical Balance

## Operation Principle

An analytical balance measures mass with extremely high precision (0.01 mg or 0.1 mg readability) using **electromagnetic force compensation**. When a sample is placed on the weighing pan, the gravitational force pulls it downward. A position sensor detects the displacement of the weighing cell, and an electromagnetic coil generates a counteracting force to return the cell to its null position. The current required to maintain this equilibrium is directly proportional to the mass (F = mg = BIL, where B is magnetic field, I is current, L is coil length). This current is digitized and converted to a mass reading on the display.

The balance must be on a level, vibration-free surface inside a **draft shield** — a glass-enclosed chamber with sliding doors that protects the weighing pan from air currents, temperature fluctuations, and dust. A **leveling bubble** and adjustable feet ensure precise leveling. Internal calibration weights (or external weights) are used for periodic recalibration to compensate for temperature changes, altitude, or gravitational variation. High-end balances include automatic internal calibration (isoCAL) triggered by temperature changes or time intervals.

## Key Functions

1. **Weighing** — Direct mass measurement of solids, liquids, and powders on a pan or weighing vessel.
2. **Tare** — Zero the display with a container on the pan; net weight readout.
3. **Parts Counting** — Determine the number of identical pieces by dividing total weight by average piece weight.
4. **Density Determination** — Measure mass of solid in air and in auxiliary liquid to calculate density using Archimedes' principle.
5. **Percent Weighing** — Display weight as percentage of a reference weight.
6. **Checkweighing** — Audible/visual alerts when weight is below, within, or above user-set limits.
7. **Peak Hold** — Capture and hold the highest weight reading (useful for dynamic weighing).
8. **Statistics** — Calculate min, max, mean, standard deviation of multiple weighings.
9. **Data Output** — GLP/GMP-compliant data transfer to PC, printer, or LIMS via RS-232/USB/Ethernet.
10. **Automatic Internal Calibration** — Self-calibration based on temperature change or timed interval (isoCAL).

## Complete Control Panel

### Mettler Toledo XSE204 — Front Panel

- **Display**: 5.7-inch color TFT touchscreen (640×480), capacitive, with SmartScreen UI
- **Power Button**: Top-right of display bezel; press to wake/sleep; press-hold 3s for power off
- **Home Button**: Touchscreen icon; returns to application selection
- **Status Light**: Touchless sensor — green (ready), yellow (busy/weighing), red (error/overload)
- **Touchless Sensor**: Hand-wave sensor; configurable — Tare, Print, Mode switch, or zero (wave hand in front of display without touching)
- **Application Selector**: Touchscreen icons — Weighing, Parts Counting, Percent Weighing, Density, Checkweighing, Statistics, Formulation
- **Status Bar**: Top of screen — date/time, application name, balance status, calibration status (isoCAL symbol), leveling status (green = level, red = unlevel), unit (g, mg, kg, ct, oz, etc.)
- **Weight Display**: Large digits (7-segment style) showing current weight; resolution 0.1 mg or 0.01 mg depending on model
- **Stability Indicator**: "○" circle icon — solid when stable, flashing when drifting
- **Tare Button** (touchscreen): Zero / tare the balance
- **Calibration Button** (touchscreen): Initiate internal calibration
- **Menu Button** (touchscreen): Access system settings, user management, device configuration
- **Numeric Keypad**: Touchscreen digits 0–9, decimal point, backspace, for entering values (target weight, piece weight, limits)
- **User Profiles**: Touchscreen-selectable user accounts with customizable workflows
- **Data Management**: Touchscreen access to weigh log, GLP-compliant reports, export via USB
- **Leveling Guide**: Touchscreen display of electronic level sensor with bubble graphic

### Mettler Toledo AE200 — Front Panel (older model)

- **Display**: 13-digit vacuum fluorescent display (VFD) or LCD (7-segment)
- **Control Buttons** (hard keys on front panel):
  - **ON/OFF** — Power toggle
  - **TARE** — Zero / tare the balance
  - **CAL** — Initiate calibration routine
  - **MODE** — Cycle through units (g, mg, ct, oz, etc.)
  - **PRINT** — Send current weight to serial port/printer
  - **FUNCTION** — Access additional functions (counting, percent, checkweighing)
  - **→0/T←** — Tare/zero
- **Status Indicators** (LEDs on display):
  - **STABLE** — Green LED (weight stable)
  - **NET** — Yellow LED (net weight displayed)
  - **CAL** — Flashing when calibration needed
  - **UNITS** — Displays current unit abbreviation (g, mg, etc.)
- **Analog Bar Display**: (on some models) — horizontal bar graph showing relative weight relative to target

### Draft Shield / Weighing Chamber

- **Chamber**: Glass enclosure (3 sliding doors or 2 side doors + 1 top door)
- **Doors**: Tempered glass panels with metal / plastic frames
- **Side Doors** (left and right): Sliding, with ergonomic finger pulls; vertical lift (full access) or horizontal slide (partial access)
- **Top Door**: Sliding (horizontal) on some models for tall containers
- **Door Dampers**: Soft-close mechanism to prevent air disturbance
- **Chamber Interior**: Stainless steel floor plate with rounded corners for easy cleaning
- **Weighing Pan**: Stainless steel (round, ~80 mm diameter), removable
- **Pan Support**: Cross-shaped or circular; precise fit into weighing cell
- **Draft Shield Light**: Internal LED (white) for chamber illumination; auto-dim after 10 sec
- **Anti-static Kit**: Optional ionizer bar inside chamber to dissipate static charge
- **Gyre/Hole**: Round opening below pan for weighing below balance (density kit suspension)

### Leveling System

- **Level Indicator**: Circular spirit level (bubble vial) on front panel or top of base
- **Leveling Feet**: 2 front adjustable feet (screw-type, knurled) + 2 rear fixed feet
- **Electronic Level Sensor**: Built-in digital sensor; displays level status on screen (green/red)
- **Leveling Range**: ±5 mm vertical adjustment
- **Leveling Knobs**: Large, textured plastic knobs on front feet

### Calibration System

- **Internal Calibration Weight**: Motorized; mass typically 50 g, 100 g, or 200 g (built-in)
- **isoCAL**: Automatic internal calibration triggered by:
  - Temperature change > 1.5°C
  - Time interval (2–4 hours default)
  - User-requested (manual CAL button)
- **External Calibration**: User places external calibration weight (e.g., OIML E2 class) on pan; balance adjusts
- **Calibration Report**: Prints calibration data with time/date, weight class, deviation

### Rear Panel Connectors

- **Power Adapter Input**: Round coaxial DC jack (12 VDC, 2.5 A); external AC/DC adapter
- **RS-232C**: DB9 female, 9600 baud (default), for PC / printer
- **USB-A**: For flash drive (data export, firmware updates) or USB printer
- **USB-B**: For PC connection (virtual COM port)
- **Ethernet**: RJ45 for network / LIMS connectivity (optional)
- **Second RS-232**: Optional (for barcode scanner / external keypad)
- **Bluetooth**: Optional built-in (for wireless printer / PC)
- **AUX**: 4-pin Mini-DIN for footswitch or external tare pedal
- **Anti-theft Slot**: Kensington lock slot

## Physical Features on the 3D Model

- **Base**: Robust metal or high-density plastic (approx 350 × 400 × 100 mm), painted (white, gray, or metallic)
- **Weighing Chamber**: Glass enclosure on top of base (approx 200 × 200 × 250 mm)
- **Front Bevel**: Angled control panel area; touchscreen flush with surface
- **Draft Shield Doors**: 3 glass panels — left (sliding, 100 mm width), right (sliding, 100 mm width), top (sliding, 150 mm width)
- **Door Handles**: Ergonomic molded finger grips on glass edges or metal handles
- **Weighing Pan**: Round, 80 mm dia, polished stainless steel, center of chamber floor
- **Level Indicator**: Circular bubble vial on front base (left of display or below display)
- **Leveling Feet**: 2 front knurled knobs; 2 rear non-adjustable feet
- **Footswitch Port**: Front-panel 3.5mm jack (on some models) for external tare pedal
- **Barcode Scanner Port**: Mini-DIN on front (optional)
- **Ventilation Slots**: Rear base panel; no forced fan (passive convection)
- **Power Adapter**: External "brick" style; DC plug at rear; adapter has IEC C7 figure-8 connector
- **Model Badge**: Front of base, brand logo and model name
- **GLP/GMP Labeling**: Calibration sticker area on rear or bottom

## Real-world Model References

### Mettler Toledo XSE204 / XSR204

- **Readability**: 0.1 mg (XSE204), 0.01 mg (XSE205)
- **Capacity**: 220 g
- **Repeatability**: 0.08 mg (XSE204)
- **Display**: 5.7-inch color touchscreen with SmartScreen
- **Control**: Touchscreen + Touchless sensor (hand-wave)
- **Calibration**: isoCAL (internal automatic)
- **Draft Shield**: SmartGrid (stainless steel floor with holes to reduce air turbulence)
- **Leveling**: electronic level sensor with guidance on display
- **Software**: LabX (PC) or onboard terminal

### Mettler Toledo AE200

- **Readability**: 0.1 mg
- **Capacity**: 205 g
- **Display**: VFD (13-digit) with analog bar
- **Control**: Physical buttons (Tare, Cal, Mode, Print, Function, On/Off)
- **Calibration**: External (manual weight placement) or internal (optional)
- **Draft Shield**: 3 glass doors (side-to-side sliding)
- **Leveling**: Circular bubble level on front base
- **Ports**: RS-232

### Sartorius Cubis II (MCA / MSE)

- **Readability**: 0.01 mg to 1 mg (depending on model)
- **Capacity**: 60 g to 1000 g
- **Display**: 8-inch color touchscreen with capacitive touch + 4 hardware function keys on bezel
- **Control**: Touchscreen + "Q-App" workflow system; user profiles
- **Calibration**: isoCAL (automatic internal), with calibration certificate
- **Draft Shield**: Motorized or manual glass doors; optional UV-lamp sterilization
- **Leveling**: Electronic level indicator on screen; motorized leveling feet (optional)
- **Unique**: Fully customizable user interface, 21 CFR Part 11 compliance
- **Ports**: 2 × USB, 2 × RS-232, Ethernet, Bluetooth

### Ohaus Explorer EX124

- **Readability**: 0.1 mg
- **Capacity**: 120 g
- **Display**: 4.3-inch color touchscreen (or VFD model)
- **Control**: Touchscreen with 2 physical buttons (Tare, Print/Menu)
- **Calibration**: AutoCal (internal), or external
- **Draft Shield**: 3 glass doors (2 side + 1 top); metal frame
- **Leveling**: Front-mounted bubble level + 2 adjustable feet
- **Ports**: RS-232, USB-A, USB-B, Ethernet (optional)
- **Software**: Ohaus LabPro / DDE

### Controls Summary (Mettler Toledo XSE204)

| Control              | Type                      | Function                                               |
| -------------------- | ------------------------- | ------------------------------------------------------ |
| Power                | Push-button on bezel      | On/Standby                                             |
| Home                 | Touchscreen icon          | App selection screen                                   |
| Tare                 | Touchscreen button        | Zero / tare weight                                     |
| Print                | Touchscreen button        | Send data to printer/PC                                |
| Cal                  | Touchscreen button        | Initiate internal calibration                          |
| Unit Select          | Touchscreen               | Change unit (g, mg, ct, oz, lb, etc.)                  |
| Mode Select          | Touchscreen               | Select application (weighing, counting, density, etc.) |
| Numeric Keypad       | Touchscreen               | Enter values (target weight, limit, piece weight)      |
| Checkweighing Limits | Touchscreen               | Set Min/Max thresholds                                 |
| Menu/Setup           | Touchscreen               | Balance config, user management, data export           |
| GLP Info             | Touchscreen               | Enter user ID, sample ID, batch #                      |
| Statistics           | Touchscreen               | Start/stop/clear weighing series                       |
| Touchless Sensor     | Optical hand-wave         | Configurable (Tare/Print/Mode)                         |
| Level Adjustment     | Front knobs               | Manual leveling via rotary feet                        |
| Draft Shield Door    | Sliding glass (hand)      | Access to weighing pan                                 |
| Footswitch           | External pedal (optional) | Hands-free tare/print                                  |
| Cal Weight           | Motorized (internal)      | Automatic internal calibration                         |

## Additional Physical Details for 3D Modeling

- **Door Rails**: Top and bottom tracks on draft shield with nylon bearings for smooth sliding
- **Door Stop**: Magnetic catch on side doors at fully open position
- **Pan Stop**: Small plastic or metal stop beneath pan for transport locking
- **Transport Lock**: Screw on underside secures weighing cell for shipping (must be removed before use)
- **Anti-theft Lock**: Kensington slot on rear panel
- **Serial Number Plate**: Rear or bottom; contains model, SN, voltage, date of manufacture
- **Calibration Sticker**: Space for annual calibration sticker on rear or side
- **Footswitch**: External option; 3.5mm jack on front panel
