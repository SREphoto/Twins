# High-Pressure Reactor — Complete Build Resources

## Reference Design: Parr 4560 Mini Reactor (600 mL, 200 bar)

**Objective:** Find all resources needed to build each part of a fully functioning bench-top high-pressure stirred reactor, matching the Parr 4560 Mini Reactor specifications.

---

# TABLE OF CONTENTS

1. [Target Specifications](#1-target-specifications)
2. [Complete Bill of Materials (BOM)](#2-complete-bill-of-materials)
3. [System 1: Vessel Assembly](#3-system-1-vessel-assembly)
4. [System 2: Head Plate & Seals](#4-system-2-head-plate--seals)
5. [System 3: Stirrer & Magnetic Drive](#5-system-3-stirrer--magnetic-drive)
6. [System 4: Heating Jacket](#6-system-4-heating-jacket)
7. [System 5: Valves & Fittings](#7-system-5-valves--fittings)
8. [System 6: Instrumentation](#8-system-6-instrumentation)
9. [System 7: Safety Systems](#9-system-7-safety-systems)
10. [System 8: Stand & Frame](#10-system-8-stand--frame)
11. [System 9: Controller & Electrical](#11-system-9-controller--electrical)
12. [System 10: Test & Certification](#12-system-10-test--certification)

---

## 1. TARGET SPECIFICATIONS

| Parameter                   | Target Value                              |
| --------------------------- | ----------------------------------------- |
| **Vessel capacity**         | 600 mL (max working volume 420 mL @ 70%)  |
| **Max operating pressure**  | 200 bar (3,000 psi) @ 350°C               |
| **Max temperature**         | 350°C (316SS), 500°C (Hastelloy option)   |
| **Vessel material**         | 316L Stainless Steel (or Hastelloy C-276) |
| **Vessel ID**               | 100 mm                                    |
| **Vessel internal depth**   | 150 mm                                    |
| **Wall thickness**          | 15 mm minimum (for 200 bar @ 350°C)       |
| **Seal type**               | Flat gasket, PTFE or graphite             |
| **Closure**                 | 6-bolt flanged head (M12, Grade B7)       |
| **Stirrer type**            | Magnetic drive, overhead, 6-blade turbine |
| **Stirrer speed**           | 0-2,000 RPM, controllable                 |
| **Motor**                   | 1/8 HP DC, variable speed                 |
| **Heating**                 | Clamshell electric, 1,000 W               |
| **Temperature control**     | PID controller, ±1°C accuracy             |
| **Pressure measurement**    | Bourdon gauge, 0-3,000 psi                |
| **Overpressure protection** | Burst disc, 250 bar set pressure          |
| **Ports**                   | 4× 1/8" NPT, 1× 1/4" NPT                  |
| **Thermocouple**            | Type-J, in thermowell                     |
| **System weight**           | ~35 kg (vessel + stand + controller)      |
| **Dimensions**              | 600mm H × 200mm W × 200mm D               |

---

## 2. COMPLETE BILL OF MATERIALS (BOM)

### System 1: Vessel Assembly

| Item               | Qty | Description                                  | Material |
| ------------------ | --- | -------------------------------------------- | -------- |
| Vessel body        | 1   | Cylinder, Ø130mm OD × 200mm H, flanged top   | 316L SS  |
| Vessel flange      | 1   | Integral with body, Ø150mm OD, 12mm thick    | 316L SS  |
| Vessel bottom      | 1   | Welded bottom closure, 15mm thick            | 316L SS  |
| Compression spring | 1   | Coil spring, Ø50mm, 10mm wire, 100mm relaxed | 316 SS   |

### System 2: Head Plate & Seals

| Item          | Qty | Description                                     | Material        |
| ------------- | --- | ----------------------------------------------- | --------------- |
| Head plate    | 1   | Ø150mm × 16mm thick, 6-bolt pattern             | 316L SS         |
| Hex bolts     | 6   | M12 × 1.75 × 60mm, Grade B7                     | Alloy steel     |
| Flat washers  | 12  | M12 (bolt + nut side)                           | 316 SS          |
| Hex nuts      | 6   | M12 × 1.75                                      | 316 SS          |
| Gasket        | 1   | Flat ring gasket, Ø105mm ID × Ø125mm OD × 1.6mm | PTFE or Grafoil |
| Locating pins | 2   | Dowel pins, Ø6mm × 20mm                         | 316 SS          |

### System 3: Stirrer & Magnetic Drive

| Item                   | Qty | Description                               | Material      |
| ---------------------- | --- | ----------------------------------------- | ------------- |
| Magnetic drive housing | 1   | Top-mount, Ø60mm × 100mm                  | 316 SS        |
| Inner magnet assembly  | 1   | Internal magnet rotor with shaft coupling | SmCo magnets  |
| Outer magnet assembly  | 1   | External magnet rotor, motor-driven       | SmCo magnets  |
| Drive shaft            | 1   | Ø10mm × 200mm, keyed                      | 316 SS        |
| Turbine impeller       | 1   | 6-blade Rushton, Ø45mm                    | 316 SS        |
| Lower bearing          | 1   | Sleeve bearing                            | PTFE/graphite |
| Upper bearing          | 1   | Ball bearing                              | 440C SS       |
| Housing gasket         | 1   | O-ring, Ø60mm × 3mm                       | Viton         |

### System 4: Heating Jacket

| Item                  | Qty      | Description                            | Material       |
| --------------------- | -------- | -------------------------------------- | -------------- |
| Heater body (left)    | 1        | Clamshell half, Ø160mm × 150mm         | Aluminum       |
| Heater body (right)   | 1        | Clamshell half, Ø160mm × 150mm         | Aluminum       |
| Resistance wire       | 2 sets   | NiCr wire, 1000W total, 230V           | NiCr 80/20     |
| Mica insulation       | 2 sheets | Mica sheet, 1mm thick                  | Muscovite mica |
| Ceramic fiber         | 1 roll   | Insulation blanket, 10mm thick         | Ceramic fiber  |
| Outer shell (left)    | 1        | Clamshell half, Ø180mm × 160mm         | 304 SS sheet   |
| Outer shell (right)   | 1        | Clamshell half, Ø180mm × 160mm         | 304 SS sheet   |
| Hinge pins            | 2        | Ø4mm × 30mm                            | 304 SS         |
| Clamp band            | 1        | Latch band with turnbuckle             | 304 SS         |
| Power cable           | 1        | Silicone-jacketed, 3-conductor, 14 AWG | Silicone/Cu    |
| Compression terminals | 4        | M4 ring terminals                      | Copper         |

### System 5: Valves & Fittings

| Item                    | Qty    | Description                          | Material      |
| ----------------------- | ------ | ------------------------------------ | ------------- |
| Needle valve, gas inlet | 1      | 1/8" NPT, 200 bar rated, with handle | 316 SS        |
| Needle valve, vent      | 1      | 1/8" NPT, 200 bar rated, with handle | 316 SS        |
| Needle valve, dip tube  | 1      | 1/8" NPT, 200 bar rated, with tube   | 316 SS        |
| Dip tube                | 1      | Ø3mm × 200mm, 1/8" NPT fitting       | 316 SS        |
| Burst disc assembly     | 1      | 1/4" NPT holder + Ni disc, 250 bar   | 316 SS holder |
| Pressure gauge          | 1      | Ø60mm, 0-3,000 psi, 1/4" NPT bottom  | Brass/SS      |
| Thermowell              | 1      | Closed-end tube, 1/8" OD × 150mm     | 316 SS        |
| Pipe plugs              | 3      | 1/8" NPT, hex head                   | 316 SS        |
| Thread seal tape        | 1 roll | PTFE tape, 1/2" wide                 | PTFE          |

### System 6: Instrumentation

| Item                   | Qty | Description                         | Part Number    |
| ---------------------- | --- | ----------------------------------- | -------------- |
| Pressure gauge         | 1   | Bourdon tube, 0-3,000 psi, Ø60mm    | Ashcroft 1009  |
| Thermocouple           | 1   | Type-J, ungrounded, 1/8" OD × 150mm | Omega TJ36     |
| Temperature controller | 1   | PID, 1/16 DIN, relay output         | Omega CN732    |
| Motor controller       | 1   | Variable speed, DC, 0-90V, 2A       | KB Electronics |
| DC motor               | 1   | 1/8 HP, 90VDC, 2,500 RPM            | Bodine 42A     |

### System 7: Stand & Frame

| Item              | Qty | Description                   | Material           |
| ----------------- | --- | ----------------------------- | ------------------ |
| Base plate        | 1   | 200 × 200 × 15mm              | Cast iron or steel |
| Support rod       | 1   | Ø25mm × 500mm, threaded ends  | 304 SS             |
| Rod clamp (top)   | 1   | Split clamp, Ø25mm, with bolt | 304 SS             |
| Rod clamp (motor) | 1   | Motor mount bracket           | Aluminum           |
| Base screws       | 4   | M8 × 25mm hex bolts           | Steel              |
| Rubber feet       | 4   | Ø20mm, 5mm thick              | Rubber             |

---

## 3. SYSTEM 1: VESSEL ASSEMBLY

### 3.1 Vessel Body

- **Design**: Thick-walled cylinder with integral top flange
- **Fabrication**: Machined from 316L SS solid bar stock or forged billet
- **ID**: 100mm ±0.1mm, honed finish (Ra 0.8μm)
- **OD**: 130mm ±0.5mm
- **Wall thickness**: 15mm minimum
- **Flange OD**: 150mm
- **Flange thickness**: 12mm
- **Bolt holes**: 6 × Ø13mm through-holes on 120mm bolt circle
- **Bottom**: 15mm thick integral, radius internal corner (R=5mm)
- **Depth (internal)**: 150mm ±1mm
- **Hydrostatic test pressure**: 300 bar (1.5× operating)

### 3.2 Vessel Spring Mount

- Vessel sits on compression spring at base
- Spring: Ø50mm × 100mm relaxed, 316SS
- Spring rate: 50 N/mm
- Purpose: Allows thermal expansion of vessel without stress
- Compression at operating temp (~350°C): ~2mm

---

## 4. SYSTEM 2: HEAD PLATE & SEALS

### 4.1 Head Plate

- **Diameter**: 150mm ±0.2mm
- **Thickness**: 16mm ±0.1mm
- **Material**: 316L SS, solution annealed
- **Finish**: 0.8μm Ra on gasket sealing surface
- **Flatness**: 0.05mm over gasket surface
- **Bolt holes**: 6 × Ø13mm through, 120mm BC
- **Port holes**: 5 × 1/8" NPT threaded through, 1 × 1/4" NPT threaded through

### 4.2 Gasket Selection

- **PTFE gasket**: For temperatures up to 250°C
  - 105mm ID × 125mm OD × 1.6mm thick
  - Virgin PTFE, glass-filled for better creep resistance
- **Graphite gasket (Grafoil)**: For temperatures up to 350°C
  - 105mm ID × 125mm OD × 1.6mm thick
  - Flexible graphite with stainless steel insert
  - Higher temperature rating, better chemical resistance

### 4.3 Bolt Torque Specification

- **Bolt size**: M12 × 1.75 × 60mm, Grade B7
- **Torque**: 50 Nm ±5 Nm (for 200 bar seal)
- **Sequence**: Cross-pattern tightening in 3 stages
  - Stage 1: 20 Nm (all 6 bolts)
  - Stage 2: 35 Nm (all 6 bolts)
  - Stage 3: 50 Nm (all 6 bolts)
- **Lubrication**: Anti-seize compound on threads
- **Retorque after first heat cycle**: Yes, at 200°C

---

## 5. SYSTEM 3: STIRRER & MAGNETIC DRIVE

### 5.1 Principle of Operation

The magnetic drive transmits torque from the external motor to the internal stirrer through a sealed containment shell — no rotating shaft penetrates the pressure boundary. This eliminates the most common leak path in stirred pressure vessels.

### 5.2 Magnetic Coupling

- **Magnet type**: Samarium-Cobalt (SmCo) - chosen for high temperature stability
- **Temperature rating**: 350°C maximum (Sm₂Co₁₇ grade)
- **Poles**: 8-pole configuration (4 N/S pairs)
- **Torque rating**: 0.5 Nm continuous, 1.0 Nm peak
- **Air gap**: 2mm between inner and outer magnets
- **Containment shell**: 316 SS, 1mm thick (part of pressure boundary)

### 5.3 Impeller Design

- **Type**: 6-blade Rushton turbine
- **Diameter**: 45mm (0.45 × vessel diameter)
- **Blade height**: 10mm
- **Blade width**: 12mm
- **Clearance from bottom**: 15mm (1/10 × vessel height)
- **Shaft connection**: Keyed (4mm key) + set screw

### 5.4 Motor Specifications

- **Type**: DC permanent magnet, 1/8 HP
- **Voltage**: 90 VDC
- **Current**: 1.0 A
- **Base speed**: 2,500 RPM no load
- **Speed range**: 100-2,000 RPM (via controller)
- **Mounting**: Vertical, flange-mounted to magnetic drive housing

---

## 6. SYSTEM 4: HEATING JACKET

### 6.1 Heater Design

- **Configuration**: Split clamshell (two halves, hinged)
- **Inner diameter**: 135mm (fits over vessel OD of 130mm)
- **Height**: 150mm (matches vessel straight section)
- **Material**: Aluminum body for good thermal conductivity
- **Power**: 1,000 W total (500 W per half)
- **Voltage**: 230 VAC
- **Current**: 4.35 A per heater circuit
- **Watt density**: 5 W/cm² (safe for aluminum)
- **Max sheath temperature**: 500°C

### 6.2 Construction

1. Machine aluminum heater bodies to shape
2. Wind NiCr 80/20 resistance wire on mica frame
3. Embed wire in ceramic fiber insulation
4. Assemble into aluminum body
5. Add mica insulation layer between wire and body
6. Weld or form 304 SS outer shell
7. Install hinge pins and clamp band
8. Terminate power leads in junction box

### 6.3 Temperature Sensors

- **Type**: Type-J thermocouple in thermowell
- **Location**: Head plate thermowell extends into vessel
- **Length**: 150mm insertion, 120mm immersion into liquid
- **Sheath**: 316 SS, 1/8" OD, grounded junction
- **Connection**: Miniature Type-J connector

---

## 7. SYSTEM 5: VALVES & FITTINGS

### 7.1 Needle Valves

- **Type**: High-pressure needle valve, 1/8" NPT
- **Rating**: 200 bar (3,000 psi) minimum
- **Material**: 316 SS body and stem
- **Seat**: PTFE or PEEK soft seat for bubble-tight shutoff
- **Handle**: Black phenolic or aluminum, Ø25mm
- **Stem**: Non-rotating, rising stem design
- **Orifice**: 2mm diameter

### 7.2 Dip Tube

- **Material**: 316 SS, 3mm OD × 1mm wall
- **Length**: 200mm total (extends from head plate to near vessel bottom)
- **Bottom clearance**: 5mm from vessel bottom
- **Fitting**: 1/8" NPT compression fitting at head plate

### 7.3 Tubing & Connections

- **All tubing**: 316 SS, 1/8" OD × 0.035" wall (1.6mm ID)
- **Fittings**: Swagelok or Parker A-Lok brand
- **Working pressure**: 200 bar minimum
- **Test pressure**: 300 bar

---

## 8. SYSTEM 6: INSTRUMENTATION

### 8.1 Pressure Gauge

- **Type**: Bourdon tube, stainless steel movement
- **Range**: 0-3,000 psi (0-200 bar)
- **Dial**: Ø60mm, white face, black markings
- **Accuracy**: ±1.0% full scale (ASME Grade 1A)
- **Connection**: 1/4" NPT bottom-mount
- **Case**: 304 SS, weather-resistant
- **Liquid fill**: Glycerin (for vibration dampening)

### 8.2 Temperature Controller

- **Type**: PID controller with auto-tuning
- **Input**: Type-J thermocouple
- **Output**: Relay (SSR) for heater
- **Display**: Dual 4-digit LED (process + setpoint)
- **Control accuracy**: ±1°C
- **Safety**: Heater cutout on thermocouple failure

### 8.3 Motor Controller

- **Type**: Variable speed DC motor control
- **Input**: 115/230 VAC
- **Output**: 0-90 VDC armature voltage
- **Current**: 2 A
- **Speed regulation**: ±2% of set speed (tachometer feedback)
- **Features**: Forward/reverse, acceleration ramp

---

## 9. SYSTEM 7: SAFETY SYSTEMS

### 9.1 Burst Disc

- **Set pressure**: 250 bar (3,625 psi) at 22°C
- **Tolerance**: ±5%
- **Material**: Nickel 200 foil (Hastelloy for corrosive service)
- **Holder**: 316 SS, 1/4" NPT connection
- **Vent**: 1/4" tube to safe location (outside, or into vent hood)

### 9.2 Over-Temperature Protection

- **Independent high-limit controller**: Mechanical or electronic
- **Set point**: 380°C (30°C above max operating)
- **Action**: Cuts power to heating jacket, latches until manual reset

### 9.3 Motor Protection

- **Current limit**: 1.5 A max (protects motor from overload)
- **Thermal protection**: Integral thermal switch in motor windings
- **Action**: Motor stops on over-current or over-temperature

### 9.4 Grounding

- **Vessel grounding**: Braided copper strap from vessel to stand
- **Controller grounding**: Ground rod via AC power cord
- **Resistance**: <1Ω to earth ground

---

## 10. SYSTEM 8: STAND & FRAME

### 10.1 Base Plate

- **Material**: Cast iron or heavy steel plate
- **Dimensions**: 200 × 200 × 15mm
- **Weight**: ~5 kg (provides stability)
- **Finish**: Black painted, textured
- **Features**: 4 × mounting holes for rubber feet
- **Vessel spring seat**: Centered recess, Ø50mm × 5mm deep

### 10.2 Support Rod

- **Material**: 304 SS, Ø25mm
- **Length**: 500mm
- **Thread**: M20 × 1.5 on both ends (for nut mounting)
- **Mounting**: Threaded into base plate, lock nut
- **Clamp**: Split clamp at top for head plate alignment

---

## 11. SYSTEM 9: CONTROLLER & ELECTRICAL

### 11.1 Controller Enclosure

- **Type**: Wall-mount or bench-top enclosure
- **Material**: Steel or aluminum, painted gray
- **Dimensions**: 200 × 250 × 150mm
- **Protection rating**: IP54 (splash-resistant)

### 11.2 Front Panel Elements

- Temperature controller (1/16 DIN, 48 × 48mm cutout)
- Motor speed potentiometer (Ø20mm knob)
- Motor on/off switch (illuminated, Ø16mm)
- Heater on indicator (green LED)
- Alarm indicator (red LED)
- Main power switch (illuminated, Ø22mm)

### 11.3 Electrical Connections

- **Power input**: 230 VAC, 10 A, IEC C14 inlet
- **Heater output**: 230 VAC, 5 A, via SSR relay
- **Motor output**: 0-90 VDC, 2 A, via motor controller
- **Thermocouple input**: Type-J, compensated connection
- **Ground**: Green/yellow, all metal parts bonded

---

## 12. SYSTEM 10: TEST & CERTIFICATION

### 12.1 Hydrostatic Test (Per ASME Section VIII)

- **Medium**: Water (or other non-compressible fluid)
- **Pressure**: 300 bar (1.5 × max working pressure)
- **Hold time**: 30 minutes minimum
- **Acceptance criteria**: No visible leakage, no permanent deformation
- **Gauge accuracy**: ±0.5% full scale

### 12.2 Pneumatic Test (If hydrostatic not possible)

- **Medium**: Nitrogen or dry air
- **Pressure**: 220 bar (1.1 × max working pressure)
- **Hold time**: 10 minutes
- **Soap bubble test**: All joints and seals

### 12.3 Leak Test

- **Method**: Helium leak test or pressure decay test
- **Acceptance**: <1 × 10⁻⁶ mbar·L/s leakage

### 12.4 Certification Required

- ASME Section VIII, Div. 1 stamp (for commercial vessels)
- CE marking (for EU market)
- Hydrostatic test certificate
- Material test certificate (mill certs for 316L SS)

---

## 13. SUPPLIER DIRECTORY

### Vessel Fabrication

| Component           | Supplier               | Notes                    |
| ------------------- | ---------------------- | ------------------------ |
| Custom SS vessel    | Pressure Products Inc. | Custom to drawing        |
| Stock vessel (Parr) | Parr Instrument Co.    | Direct from manufacturer |
| CNC machining       | Xometry / Protolabs    | For custom fabrication   |

### Valves & Fittings

| Component              | Supplier         | Part Number        |
| ---------------------- | ---------------- | ------------------ |
| Needle valve, 1/8" NPT | Swagelok         | SS-1RS4            |
| Needle valve, 1/8" NPT | Parker           | 4MA-NV-1/8-NPT     |
| Burst disc assembly    | Fike             | SCRD-250 bar       |
| Burst disc assembly    | Continental Disc | CDC-250 bar        |
| Pressure gauge         | Ashcroft         | 1009SS-3000psi     |
| Type-J thermocouple    | Omega            | TJ36-CASS-116U-150 |

### Magnetic Drive

| Component               | Supplier     | Notes                        |
| ----------------------- | ------------ | ---------------------------- |
| Complete magnetic drive | Parr Inst.   | A1560GD (direct replacement) |
| SmCo magnets            | Magnet Sales | Custom assembly              |
| Motor (1/8 HP DC)       | Bodine       | 42A-5L                       |

### Heating

| Component                | Supplier        | Notes               |
| ------------------------ | --------------- | ------------------- |
| Custom clamshell heater  | Watlow / Tempco | Custom wound        |
| NiCr wire                | McMaster-Carr   | 8799K11             |
| Ceramic fiber insulation | McMaster-Carr   | 93565K11            |
| SSR relay                | Crydom          | D2425 (25A, 240VAC) |
| PID controller           | Omega           | CN732               |

### Electrical

| Component           | Supplier       | Part Number |
| ------------------- | -------------- | ----------- |
| DC motor controller | KB Electronics | KBIC-120    |
| Power supply        | Mean Well      | HDR-100-24  |

---

## 14. REFERENCE DOCUMENTS

### Standards

- **ASME Section VIII, Div. 1**: ASME Boiler & Pressure Vessel Code
- **ASTM A240**: Standard Spec for Cr/Ni SS Plate for Pressure Vessels
- **ISO 4126**: Safety devices for protection against excessive pressure

### Design References

- Parr 4560 Product Manual: https://www.parrinst.com/wp-content/uploads/2020/07/Parr-4560-Mini-Reactors-Product-Manual.pdf
- Swagelok Tube Fitting Guide: https://www.swagelok.com/downloads/webcatalogs/EN/MS-01-03.PDF
- ASME Section VIII Calculator: https://www.pveng.com/ASME/ASME-Design-Calculator/
