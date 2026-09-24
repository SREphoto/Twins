# Ultrasonic Cleaner — Real-World Manufacturing Research

Consolidated from real-world service manuals, teardowns, manufacturer datasheets, and engineering references for
Branson, Elma, Crest, and generic benchtop ultrasonic cleaners.

---

## 1. Reference Machines & Dimensions

### Branson 5800 Series (40 kHz, 9.5 L)

| Parameter                  | Value                                                                        |
| -------------------------- | ---------------------------------------------------------------------------- |
| Tank capacity              | 9.5 L (2.5 gal)                                                              |
| Tank dimensions (internal) | 295 × 241 × 152 mm                                                           |
| Overall unit dimensions    | 396 × 394 × 368 mm (L × W × D)                                               |
| Weight                     | 6.35 kg (14 lbs)                                                             |
| Frequency                  | 40 kHz                                                                       |
| Controls                   | Membrane keypad: ON/OFF, HEAT, TIMER ▲/▼, TEMP ▲/▼, START/STOP, DEGAS, SWEEP |
| LED indicators             | POWER (green), ULTRASONIC (green), HEAT (amber)                              |
| Construction               | Painted steel outer housing, stainless steel 304 tank                        |

### Elma Elmasonic P Series (37/80 kHz, dual frequency)

| Model | Tank (L) | Internal (W×H×D mm) | External (W×H×D mm) |
| ----- | -------- | ------------------- | ------------------- |
| P30H  | 2.75     | 240 × 137 × 100     | 300 × 179 × 221     |
| P60H  | 5.75     | 300 × 151 × 150     | 365 × 186 × 271     |
| P120H | 12.75    | 300 × 240 × 200     | 365 × 278 × 321     |
| P180H | 18.0     | 327 × 300 × 200     | 390 × 340 × 321     |

### Crest Powersonic Benchtop

- All-stainless steel enclosures
- IEC power inlet on rear panel
- Controls front-mounted
- Sizes from 0.75 to 7+ gallons

---

## 2. Chassis Construction (Double-Wall / Air Gap)

Real ultrasonic cleaners use **double-wall construction** with an intentional air gap:

- **Outer housing** (painted steel or stainless steel) — structural chassis
- **Air gap** (typically 10-25mm) — serves three critical purposes:
  1. **Vibration isolation** — tank vibrates freely as a resonant membrane without coupling to outer housing
  2. **Thermal management** — insulates outer chassis from heater heat
  3. **Electronics protection** — keeps wiring and PCBs away from moisture/condensation
- **Inner tank** (stainless steel 304/316, deep-drawn) — suspended from its rim or mounted on vibration-dampening
  standoffs
- The air gap is where **transducers, heater elements, wiring, and PCBs** are located

### Key Manufacturing Detail

> The tank is NOT rigidly welded to the chassis. It is **suspended by its rim** or mounted using vibration-dampening
> materials so the tank remains a resonant body.

---

## 3. IEC C14 Power Inlet (Rear Panel)

### Placement

- **Always on the rear panel** — isolates high-voltage AC from user interface and cleaning fluid
- Positioned at **mid-to-upper height** on the rear panel (not at the bottom)
- Integrated Power Entry Module (PEM) typically combines: IEC C14 inlet + fuse holder + EMI filter + sometimes power
  switch
- Mounted via snap-in (plastic chassis) or screw-mount/flange-mount (metal panels)

### Components at Inlet Area

1. **IEC C14 receptacle** — standard 3-pin (Live, Neutral, Earth)
2. **Fuse holder** — immediately adjacent, often with external finger-grip drawer for user serviceability
3. **EMI/RFI filter** — conducts electrical noise filtering; critical because ultrasonic drivers generate significant
   EMI
4. **Power rocker switch** — often integrated into PEM or adjacent on rear panel
5. **Strain relief** — where the cord exits, to prevent cable pull stress on internal connections

### Real-World Reference (from CAD script)

The existing CAD script positions the inlet correctly:

- `rear_z = BASE_H(14) + BODY_H(168) - 28 = 154mm` from chassis floor
- This is approximately **92%** up the body — on the upper rear panel

---

## 4. Power Supply Architecture

### Circuit Topology

Two common approaches in commercial ultrasonic cleaners:

#### A. Self-Oscillating Royer Converter (low-cost units)

- Two high-voltage bipolar transistors + transformer in feedback configuration
- Naturally locks onto transducer resonant frequency
- **Connected directly to mains voltage** — no isolation transformer
- Simple, self-tuning, cost-effective
- Common in consumer/small lab units

#### B. Half-Bridge Resonant Converter (professional units)

- Driver IC (e.g., IR2153, IRS2795) switches two MOSFETs
- LC resonant tank drives the transducer
- More controlled, higher power capability
- Dead-time critical to prevent MOSFET shoot-through
- Used in Branson, Elma, Crest professional models

### Internal Component List (Power Section)

| Component                  | Description                         | Typical Location              |
| -------------------------- | ----------------------------------- | ----------------------------- |
| **Rectifier bridge**       | AC→DC conversion                    | Near IEC inlet                |
| **Filter capacitors**      | Electrolytic, smoothing             | On PSU board                  |
| **MOSFET/transistor pair** | High-frequency switching (40 kHz)   | On driver board, heat-sinked  |
| **Transformer/inductor**   | Impedance matching, voltage step-up | On driver board               |
| **Heatsink**               | Aluminum finned, for MOSFETs        | Bolted to chassis or on board |
| **Feedback winding**       | Monitors transducer resonance       | Part of transformer assembly  |
| **Microcontroller/IC**     | Timer, display, mode control        | On controller PCB             |

### Board Layout (from Elma Elmasonic S series service manual)

- **PCB Control** — clips into unit, handles UI/timer/logic
- **PCB Interference Filter** — at rear of unit, where mains socket connects
- **Transducer driver** — often combined with or adjacent to PSU board
- Common failure components: solder joints, capacitors, driver chips (e.g., L6384ED)

---

## 5. Transducer Placement & Bonding

### Location

- **Bonded to exterior bottom of stainless steel tank** (standard for <50 gal units)
- Some units also have side-mounted transducers for deep/narrow tanks
- Typical count: **4–12 per tank** depending on size
- Frequency: 37 kHz (standard), 25 kHz (heavy), 45–130 kHz (delicate)

### Bonding Method

- Structural adhesive (high-temperature epoxy) — creates direct mechanical link
- Tank bottom acts as vibrating diaphragm/membrane
- **Critical**: No air gaps, bubbles, or uneven glue — these weaken energy transmission and cause failure

### Wiring

- Each transducer has 2 wire leads (+ and -)
- Wires route from transducer terminals → along the air gap space → to driver board
- Connections are soldered, not crimped
- Common failure point: loose or broken solder joints at transducer terminals

---

## 6. Heater Element Placement

### Location

- **Underneath or against the exterior walls/bottom of the tank** (external to cleaning solution)
- Heats through conduction via stainless steel wall
- Typically resistive sheathed element, 100–500 W
- Temperature range: 30–80°C

### Wiring

- Heater leads route from element → through air gap → to heater relay on controller PCB
- Thermistor/thermocouple sensor also mounted on tank exterior for temperature feedback

### Important

- Heaters can create localized hot spots — always run ultrasonic power simultaneously to circulate liquid
- Running dry damages both heaters and transducers

---

## 7. Control Panel Design

### Layout Principles

- **Front-mounted** membrane keypad (sealed against moisture/splashes)
- Functional zoning:
  - **Power/System State** — ON/OFF switch with master status LED
  - **Parameter Settings** — TIME ▲/▼ and TEMP ▲/▼ clusters
  - **Process Controls** — DEGAS, SWEEP, HEAT, START/STOP
- Primary controls (START/STOP) are larger or color-highlighted
- Digital LCD display centered or at top of panel
- Buttons spaced for gloved operation

### LED Indicators

- **Power** (green) — system ON
- **Ultrasonic/Sonics** (green) — transducers active
- **Heat** (amber/orange) — heater element active
- **Degas** (blue, some models) — degassing cycle active
- **Fault** (red) — dry run, over-temperature, etc.
- LEDs positioned within or immediately adjacent to their button icons

### Knobs (Analog Models)

- Timer knob (0–30 min mechanical)
- Temperature knob (some models)
- Power level knob (some models, e.g., Crest TROn)

---

## 8. Lid & Hinge Design

### Materials

- **Stainless steel** (304/316) — noise reduction, durability, chemical resistance
- **Polycarbonate** — lighter duty, observation window; sensitive to certain chemicals
- Often combination: stainless frame + polycarbonate window

### Hinge Mechanism

- Rear-mounted, typically continuous (piano) hinge or dual barrel hinges
- Must be vibration-resistant (locking washers or vibration-resistant adhesive)
- Designed to direct condensation drips back into tank
- Sealed bearings to prevent particulate generation

### Gasket/Seal

- **Silicone perimeter gasket** — temperature resistant, elastic, chemical compatible
- Seated in recessed channel to prevent dislodging during frequent open/close cycles
- Purpose: reduce noise, prevent evaporation, retain heat
- Vent holes for pressure equalization (some models)

### Opening Angle

- Typically 65–90° depending on hinge design
- Some models have friction stays to hold lid at any angle

---

## 9. Wire Basket & Sample Holders

### Construction

- **Stainless steel (304/316)** welded wire mesh
- Cross-points welded to prevent independent vibration (which absorbs ultrasonic energy)
- Open mesh design to maximize acoustic transparency

### Dimensions

- Sized to fit inside tank with clearance on all sides for fluid circulation
- **Must sit 25–50mm above tank bottom** to avoid interfering with transducer diaphragm
- Supported by handles that rest on tank rim
- Typical clearance: 2–5mm per side from tank walls

### Critical Rules

- Never place parts directly on tank bottom (blocks diaphragm vibration)
- No rubber/soft materials inside tank (absorbs ultrasonic energy)
- Use dividers to separate parts and prevent contact damage

---

## 10. Drain Valve

### Location

- **Back or side of unit**, near bottom of tank
- On larger units (6L+), typically ball valve with hose barb connection
- Smaller tabletop models may not have a drain
- Handle perpendicular to body = closed; in-line = open

### Installation

- Metal drain tube protrudes from machine
- Elbow/adapter connects to tube with retaining nut
- Hose barb on adapter accepts drain tubing
- Some models include pinch clamp on tubing

---

## 11. Anti-Vibration Feet

### Placement

- **Four corners** of bottom chassis (extreme corners for maximum stability)
- Material: natural rubber, silicone, or TPE (thermoplastic elastomer)
- Height: typically 5–8mm

### Design Requirements

- Must support full weight (unit + liquid + parts) without bottoming out
- No metal-to-metal contact between machine and support surface
- Must be regularly checked — ultrasonic vibrations can loosen fasteners over time
- Even load distribution across all four feet

---

## 12. Internal Wiring Routing (Manufacturing Standard)

### General Principles

1. **All wiring stays inside the chassis** — nothing exits below the housing
2. Wires route through the **air gap** between tank and outer housing
3. Cables are secured with **cable ties/tie wraps** at routing intersection points
4. **Cable clips** along wall paths hold wires in place
5. Strain relief at all connector entry points
6. Wire colors follow IEC standard: Brown (Live), Blue (Neutral), Green-Yellow (Earth)

### Routing Path

```
IEC Inlet → EMI Filter → PSU/Driver Board (rear of chassis)
                              ↓
                    Controller PCB (left side, behind control panel)
                    ↓              ↓              ↓
              Console harness   Transducer    Heater leads
              (to front panel)  leads (to     (to heater pad
                                tank bottom)  under tank)
```

### Wire Management

- Loom tie wraps at 3-4 intersection points minimum
- No loose/dangling wires
- All cables routed along walls (never across open air gap)
- Sufficient slack at connection points for maintenance access
- Ground wire connected to chassis ground lug near IEC inlet

---

## Sources

- Branson 5800 Operator Manual (Emerson)
- Elma Elmasonic S/P Series Service Manual
- Crest Powersonic Benchtop Catalog
- PCBWay engineering teardowns
- Hackaday.io ultrasonic driver projects
- EEVblog reverse engineering threads
- All About Circuits transducer driver forums
- ON Semiconductor / Infineon application notes (IRS2795, IR2153)
- Industry manufacturing guides (LR Ultrasonics, Omega Sonics, Blackstone-NEY, Granbo)
