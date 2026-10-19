# Engineering Dimensions & Kinematic Specifications: Nabertherm LT 9/11 Box Furnace

**Document ID:** SPEC-DIM-NAB-LT911-001  
**Equipment Designation:** SREdesigns THERMO-1200 / Nabertherm LT 9/11 Laboratory Box Furnace  
**Primary Temperature Controller:** Eurotherm 3216 (1/16 DIN Precision PID)  
**OEM Reference Source:** *Nabertherm Laboratory Furnaces Catalog* (pp. 6–7, 13–15, 84), DIN 17052-1, DIN 43700  
**Coordinate Conventions:**  
- **Blender CAD Space:** $+X$ Right, $+Y$ Forward (Front Face), $+Z$ Up (Vertical Datum)  
- **Three.js WebGL Runtime:** $+X$ Right, $+Y$ Up (Vertical Datum), $-Z$ Forward  
- **Ground Datum ($Y = 0$ / $Z = 0$):** Bottom tangent plane of rubber leveling feet resting on laboratory bench  

---

## 1. Complete Physical Dimensional Envelope

```
                      ┌────────────────────────┐
                      │      TOP CHIMNEY       │  ▲
                      │     (Ø 48 x 90 mm)     │  │
             ▲        ├────────────────────────┤  │ H_open = 755 mm
             │        │    RAISED LIFT DOOR    │  │ (Max Door Stroke)
             │        │   (In Open Position)   │  │
             │        ├────────────────────────┤  ▼
             │        │                        │
H_closed =   │        │     FURNACE CASING     │
 515 mm      │        │    (Double-Walled)     │
             │        │                        │
             │        ├────────────────────────┤
             │        │  LOWER ELECTRONICS BAY │
             ▼        └────────────────────────┘
                      └───┴────────────────┴───┘
                         W = 415 mm / 485 mm
                         D = 455 mm (555 w/ Flue)
```

### 1.1 External Cabinet & Enclosure Specifications

| Assembly / Feature | Width ($X$) | Depth ($Y$) | Height ($Z$) | Units | OEM Source / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Outer Cabinet Unibody (Closed)** | **415.0** | **455.0** | **515.0** | mm | Certified OEM catalog (p. 7). Baseline structural shell. |
| **Outer Cabinet Envelope (Max Width)** | **485.0** | **455.0** | **515.0** | mm | Catalog p. 8/13 variant with side conduit / bracket / flange. |
| **Outer Cabinet Height (Door Fully Open)**| **415.0** | **455.0** | **755.0** | mm | $H_{closed} + \Delta Y_{lift} = 515\text{ mm} + 240\text{ mm} = 755\text{ mm}$. |
| **Overall Depth with Rear Chimney Spigot**| **415.0** | **555.0** | **515.0** | mm | Includes $100\text{ mm}$ rear exhaust tube protrusion. |
| **Base Frame Skirt** | 415.0 | 455.0 | 95.0 | mm | Lower dark charcoal mounting plinth housing electronics. |
| **Recessed Control Fascia Bezel** | 385.0 | 18.0 | 78.0 | mm | Recessed $15\text{ mm}$ behind base skirt front face. |
| **Leveling Foot Stance (Center-to-Center)**| 375.0 | 395.0 | — | mm | Stance pattern for 4 knurled M12 leveling feet. |
| **Leveling Foot Diameter & Height** | $\varnothing 40.0$ | $\varnothing 40.0$ | 22.0 | mm | Vulcanized NBR rubber suction base on M12 threaded stud. |
| **Airflow Cooling Gap (Double Shell)** | 25.0 | 25.0 | 25.0 | mm | Air cavity between refractory chamber and outer sheet steel. |
| **Brand Badge (`Badge_SREdesigns`)** | 70.0 | 2.5 | 22.0 | mm | Flush pocket on upper right front casing ($Z = 475\text{ mm}$). |
| **Total Net Weight (Furnace Empty)** | — | — | — | **35 kg** | Certified OEM specification (p. 7). |

---

## 2. Refractory Chamber & Thermal Workspace Dimensions

The internal heating muffle is constructed from vacuum-formed high-purity alumina-silica ceramic fiber ($1300^\circ\text{C}$ classification) providing low thermal mass and rapid heating cycles.

```
       ◄──────────────────── 235 mm ────────────────────►
       ┌────────────────────────────────────────────────┐  ▲
       │       Top Ceramic Insulation Crown (100 mm)    │  │
       ├────────────────────────────────────────────────┤  │
       │ │   ▲                                      │ │ │  │
       │ │   │                                      │ │ │  │
       │ │   │                                      │ │ │  │ 170 mm
       │ │ 120 mm      DIN 17052-1 WORKSPACE        │ │ │  │ Chamber
       │ │   │            (180 x 150 mm)            │ │ │  │ Height
       │ │   ▼                                      │ │ │  │
       │ ├──────────────────────────────────────────┤ │ │  │
       │ │         SiC Hearth Plate (12 mm)         │ │ │  │
       ├─┴──────────────────────────────────────────┴─┴─┤  ▼
       │     Bottom Ceramic Insulation Base (100 mm)    │
       └────────────────────────────────────────────────┘
         ◄─►                                      ◄─►
       Side Wall (90 mm)                        Side Wall (90 mm)
```

### 2.1 Muffle Chamber Geometry

| Chamber Parameter | Metric (mm) | Imperial (in) | Tolerance / Standard |
| :--- | :--- | :--- | :--- |
| **Internal Chamber Width ($w$)** | **235.0 mm** | 9.25 in | $\pm 2.0\text{ mm}$ between ceramic element plates |
| **Internal Chamber Depth ($d$)** | **240.0 mm** | 9.45 in | $\pm 2.0\text{ mm}$ from throat collar to rear refractory |
| **Internal Chamber Height ($h$)** | **170.0 mm** | 6.69 in | $\pm 2.0\text{ mm}$ from hearth surface to muffle crown |
| **Usable Chamber Volume** | **9.00 Liters** | 549.2 $\text{in}^3$ | Usable geometric internal volume |
| **DIN 17052-1 Uniformity Width ($w_u$)** | **180.0 mm** | 7.09 in | $\pm 5\text{ K}$ thermal uniformity zone ($T \ge 800^\circ\text{C}$) |
| **DIN 17052-1 Uniformity Depth ($d_u$)** | **150.0 mm** | 5.91 in | $\pm 5\text{ K}$ thermal uniformity zone ($T \ge 800^\circ\text{C}$) |
| **DIN 17052-1 Uniformity Height ($h_u$)**| **120.0 mm** | 4.72 in | $\pm 5\text{ K}$ thermal uniformity zone ($T \ge 800^\circ\text{C}$) |
| **Side Wall Insulation Thickness** | 90.0 mm | 3.54 in | Vacuum-formed alumina-silica fiber ($0.12\text{ W/m}\cdot\text{K}$) |
| **Crown Insulation Thickness** | 100.0 mm | 3.94 in | Multi-layer ceramic fiber board |
| **Floor Insulation Thickness** | 100.0 mm | 3.94 in | High-density load-bearing fiber backup board |
| **Rear Wall Insulation Thickness** | 105.0 mm | 4.13 in | Incorporates ceramic thermocouple feedthrough bushings |
| **Throat Sealing Gasket** | $\varnothing 12.0\text{ mm}$ | 0.47 in | High-temp braided ceramic fiber rope ($1300^\circ\text{C}$ rated) |

---

## 3. Kinematic Parallel Lift Door Mechanism

The Nabertherm **LT** (Lift Door) architecture utilizes a vertical sliding guillotine kinematics system fully enclosed within the double-wall cabinet side cavities.

```
       ================ LIFT DOOR SCHEMATIC ================
       
        [Top Crown Sheave]                 [Top Crown Sheave]
             (Ø 40 mm)                          (Ø 40 mm)
              /     \                            /     \
             /       \                          /       \
            /         \                        /         \
       [Steel Cable] [Counterweight]      [Steel Cable] [Counterweight]
          │             (3.55 kg)            │             (3.55 kg)
          │                                  │
          ▼                                  ▼
       ┌──────────────────────────────────────────────┐
       │             LIFT DOOR CASING SHEET           │
       │   ┌──────────────────────────────────────┐   │
       │   │   Stepped Fiber Refractory Plug      │   │
       │   │     (232 x 167 x 85 mm insertion)    │   │
       │   └──────────────────────────────────────┘   │
       │                                              │
       │       [Adjustable Air Inlet Slide Disc]      │
       └──────────────────────────────────────────────┘
          │                                          │
       ┌──┴──────────────────────────────────────────┴──┐
       │   Brushed 304SS Grab Handle (Ø 20 x 320 mm)    │
       └────────────────────────────────────────────────┘
          │                                          │
       [Guide Channel]                            [Guide Channel]
       (20 x 15 x 420 mm)                         (20 x 15 x 420 mm)
```

### 3.1 Kinematic Parameters & Component Dimensions

| Mechanism Component | Dimensions ($W \times D \times H$) | Material / Construction | Kinematic Function |
| :--- | :--- | :--- | :--- |
| **Total Vertical Travel Stroke ($\Delta Y$)**| **240.0 mm** (9.45 in) | Linear vertical axis | Stroke from closed datum ($H=515$) to fully open ($H=755$) |
| **Door Assembly Outer Dimensions** | $360.0 \times 140.0 \times 255.0\text{ mm}$ | 304SS textured sheet & fiber | Total door assembly moving mass $\approx 7.10\text{ kg}$ |
| **Stepped Refractory Plug** | $232.0 \times 85.0 \times 167.0\text{ mm}$ | Alumina-silica fiber ($R=0.92$) | Protrudes $85\text{ mm}$ into chamber throat with $1.5\text{ mm}$ clearance |
| **Vertical Guide C-Channels (2×)** | $20.0 \times 15.0 \times 420.0\text{ mm}$ | Cold-drawn 304 stainless steel | Channel thickness $2.0\text{ mm}$; mounted inside side cavities |
| **Sliding Guide Shoes (4×)** | $18.5 \times 13.5 \times 25.0\text{ mm}$ | Phosphor bronze CuSn8 / PTFE | Flanged shoulder sliding blocks; coefficient of friction $\mu < 0.15$ |
| **Guide Shoe Shoulder Pins (4×)** | $\varnothing 8.0\text{ mm} \times 16.0\text{ mm}$ | DIN 7379 alloy steel shoulder | Ground shoulder pins with M6 threads into door carriage |
| **Counterbalance Weights (2×)** | $40.0 \times 35.0 \times 320.0\text{ mm}$ | Cast iron / lead ballast | Mass $3.55\text{ kg}$ each ($7.10\text{ kg}$ total); 1:1 mass balance |
| **Aircraft Suspension Cables (2×)** | $\varnothing 2.0\text{ mm}$, length $680\text{ mm}$ | AISI 316 stainless, $7 \times 19$ strand | Minimum breaking strength: $2.8\text{ kN}$ ($285\text{ kgf}$) |
| **Crown Pulley Sheaves (2×)** | $\varnothing 40.0\text{ mm} \times 10.0\text{ mm}$ | Machined 304 stainless steel | Cable groove radius $r=1.2\text{ mm}$; dual sealed 608ZZ bearings |
| **Ergonomic Door Handle Bar** | $\varnothing 20.0\text{ mm} \times 320.0\text{ mm}$ | Brushed AISI 304 stainless steel | Thermal standoffs keep handle temperature $< 38^\circ\text{C}$ |
| **Handle Standoff Brackets (2×)** | $\varnothing 25.0\text{ mm} \times 35.0\text{ mm}$ | Stainless steel with ceramic isolators | Fixed to lower front door casing via DIN 912 M6 bolts |
| **Safety Interlock Microswitch** | $28.0 \times 10.3 \times 16.0\text{ mm}$ | Phenolic housing, SPDT snap-action | Trips within first $10.0\text{ mm}$ of vertical lift |
| **Adjustable Fresh Air Inlet Disc** | $\varnothing 60.0\text{ mm} \times 3.0\text{ mm}$ | Rotatable 304SS perforated disc | Centered at lower front door face ($Z = 190\text{ mm}$) |

---

## 4. Resistance Heating & Hearth Plate Dimensions

### 4.1 Kanthal FeCrAl Heating Elements

| Element Parameter | Value | Engineering Specification |
| :--- | :--- | :--- |
| **Element Material Grade** | **Kanthal A-1** | Ferritic FeCrAl alloy (73% Fe, 22% Cr, 5.8% Al) |
| **Maximum Wire Temperature** | **1400 °C** (2552 °F) | Excellent oxidation resistance via $\text{Al}_2\text{O}_3$ scale |
| **Heating Geometry** | Dual lateral embedded panels | Left and right chamber walls |
| **Resistance Wire Diameter** | **$\varnothing 1.60\text{ mm}$ (14 AWG)** | Heavy gauge for extended high-temperature life |
| **Coil Outer Diameter ($D_{coil}$)** | **$\varnothing 14.0\text{ mm}$** | Wound on precision helical mandrels |
| **Coil Pitch ($p$)** | **4.50 mm** | $2.8 \times$ wire diameter for optimal radiation |
| **Passes Per Side Panel** | 4 horizontal coiled rows | Spaced $35.0\text{ mm}$ vertically on center |
| **Total Connected Load** | **3.30 kW** (3300 W) | At nominal 230 V AC line voltage |
| **Nominal Operating Current** | **14.35 A RMS** | $I = 3300\text{ W} / 230\text{ V} = 14.348\text{ A}$ |
| **Total Cold Resistance ($R_{20}$)** | **15.42 $\Omega$** | Measured at $20^\circ\text{C}$ |
| **Total Hot Resistance ($R_{1000}$)** | **16.03 $\Omega$** | Factor $C_t = 1.04$ at $1000^\circ\text{C}$ |
| **Terminal Feedthrough Rods** | $4\times \varnothing 4.0\text{ mm} \times 180\text{ mm}$ | Solid Kanthal rods exiting rear wall with steatite bushings |

### 4.2 Silicon Carbide (SiC) Hearth Plate

| Plate Parameter | Specification | Engineering Function |
| :--- | :--- | :--- |
| **Material Grade** | Recrystallized Silicon Carbide (R-SiC) | Bulk density $2.70\text{ g/cm}^3$, porosity $< 15\%$ |
| **Plate Width** | **230.0 mm** | Leaves $2.5\text{ mm}$ expansion gap on each side |
| **Plate Depth** | **235.0 mm** | Leaves $2.5\text{ mm}$ front and rear expansion gaps |
| **Plate Floor Thickness** | **12.0 mm** | Heavy-duty load support (up to 5 kg crucibles) |
| **Perimeter Retention Lip Height** | **5.0 mm** | Lip along left, right, and back edges ($W_{lip} = 6.0\text{ mm}$) |
| **Thermal Conductivity ($k$)** | $45\text{--}80\text{ W/m}\cdot\text{K}$ | Promotes rapid, uniform bottom heat conduction |
| **Chemical Resistance** | Inert to molten ash / slag / borax | Protects porous fiber floor from flux attack |

### 4.3 High-Temperature Thermocouple Probe

| Probe Parameter | Value | Engineering Specification |
| :--- | :--- | :--- |
| **Thermocouple Type** | **NIST/IEC Type S** | Positive: Pt-10% Rhodium; Negative: Pure Platinum |
| **Measurement Range** | $0\text{ to }1600^\circ\text{C}$ | Ultra-low drift class 1 calibration |
| **Protection Sheath Material** | Alsint 99.7% $\text{Al}_2\text{O}_3$ (Ker 710) | Recrystallized impervious alumina ceramic |
| **Sheath Outer Diameter** | **$\varnothing 6.0\text{ mm}$** | Thin wall for fast response ($\tau_{63} \approx 4.5\text{ s}$) |
| **Sheath Insertion Length** | **250.0 mm** | Penetrates $145\text{ mm}$ into rear upper chamber |
| **Terminal Head Type** | DIN Form B Miniature Head | Die-cast aluminum alloy, IP65 weatherproof |
| **Head Dimensions** | $75.0 \times 65.0 \times 60.0\text{ mm}$ | Internal steatite 2-pole ceramic terminal block |
| **Cable Gland** | M16 $\times 1.5$ brass gland | Accepts shielded Type S extension wire (Pt/PtRh) |

---

## 5. Control Console, Power Bay & Cooling Dimensions

### 5.1 Eurotherm 3216 Temperature Controller

```
       ◄──────────────── 48.0 mm ────────────────►
       ┌─────────────────────────────────────────┐  ▲
       │  EUROTHERM 3216   [ALM] [RUN] [HLD]     │  │
       │  ┌───────────────────────────────────┐  │  │
       │  │    1 0 5 0 °C   (PV - Green)      │  │  │ 48.0 mm
       │  │    S P   1 0 5 0   (SV - Green)   │  │  │
       │  └───────────────────────────────────┘  │  │
       │   [ 📄 ]    [ 📜 ]     [ ▼ ]    [ ▲ ]   │  │
       │   PAGE      SCROLL     DOWN      UP     │  │
       └─────────────────────────────────────────┘  ▼
             ◄──────── Cutout 45 x 45 mm ────────►
             ◄────── Behind Panel Depth 90 mm ───►
```

| Dimension Parameter | Specification | Notes / Tolerances |
| :--- | :--- | :--- |
| **Front Bezel Width & Height** | **$48.0 \times 48.0\text{ mm}$** | Standard 1/16 DIN (DIN 43700) |
| **Front Bezel Protrusion** | **11.0 mm** | From front of console fascia |
| **Panel Cutout Width & Height** | **$45.0 \times 45.0\text{ mm}$** | $-0.0\text{ mm}, +0.6\text{ mm}$ tolerance |
| **Depth Behind Panel** | **90.0 mm** | Terminal sleeve clearance |
| **Total Assembly Depth** | **101.0 mm** | Includes rear barrier screw terminal blocks |
| **Active Display Window Area** | $36.0 \times 28.0\text{ mm}$ | Anti-glare coated polycarbonate lens |
| **PV Display Character Height** | **10.0 mm** (0.39 in) | 4-digit 7-segment high-intensity green/red LED |
| **SV Display Character Height** | **8.0 mm** (0.31 in) | 5-character 16-segment green starburst text |
| **Tactile Pushbuttons (4×)** | $7.0 \times 5.0\text{ mm}$, stroke $1.0\text{ mm}$ | Silicone snap-dome keys with contrasting chrome bezels |
| **Silkscreen Symbols** | Folded page, Scroll, Down, Up | Crisp high-contrast procedural silkscreen |
| **Microprocessor Core** | 32-bit ARM Cortex-M4 @ 72 MHz | Hardware FPU, 256 KB Flash, 64 KB SRAM |

### 5.2 Power Bay Components & Convective Cooling Fan

| Component | Dimensions ($W \times D \times H$) | Mounting / Hardware | Function & Rating |
| :--- | :--- | :--- | :--- |
| **Solid-State Relay (Crydom D2440)** | $44.5 \times 57.3 \times 22.6\text{ mm}$ | 2× DIN 912 M4 $\times 12\text{ mm}$ screws | 40A / 280VAC zero-crossing heater drive |
| **Extruded Aluminum Heatsink** | $80.0 \times 100.0 \times 40.0\text{ mm}$ | 4× DIN 7985 M4 $\times 10\text{ mm}$ screws | 12 vertical cooling fins; $R_{\theta sa} = 1.2\text{ }^\circ\text{C/W}$ |
| **Toroidal Control Transformer** | $\varnothing 80.0\text{ mm} \times 35.0\text{ mm}$ | Center M6 $\times 50\text{ mm}$ stud & dish washer | Noratel 50VA, 230V to dual 12V/24V secondaries |
| **Convective DC Cooling Fan** | $80.0 \times 80.0 \times 25.0\text{ mm}$ | 4× DIN 7985 M4 $\times 35\text{ mm}$ screws | ebm-papst 8412 NGL, 12V DC, 33 CFM ($56\text{ m}^3/\text{h}$) |
| **Fan Finger Guard** | $\varnothing 76.0\text{ mm}$, height $5.0\text{ mm}$ | Formed zinc-plated steel wire grill | DIN EN ISO 13857 safety compliance |
| **Main Rotary Disconnect Switch** | $65.0 \times 65.0\text{ mm}$ front face | 4× M4 front screws, depth $68.0\text{ mm}$ | 2-pole 20A / 690V padlockable rotary switch |
| **Rotary Switch Knob** | $\varnothing 42.0\text{ mm} \times 28.0\text{ mm}$ | Safety orange polycarbonate knob | $90^\circ$ clockwise rotation ($0 \to 1$) |
| **Rear AC Power Inlet** | $48.0 \times 32.0 \times 38.0\text{ mm}$ | 2× DIN 7991 M3 countersunk screws | IEC 60320 C19 heavy-duty 16A/250V inlet |
| **Chassis PE Protective Ground Stud** | $\varnothing 12.0\text{ mm}$ flange $\times 25.0\text{ mm}$ | DIN 933 M6 brass bolt & dual nuts | Low-impedance ($< 0.1\text{ }\Omega$) chassis ground |
| **RS-485 Modbus Serial Port** | $31.0 \times 12.5 \times 15.0\text{ mm}$ | 2× 4-40 UNC jackscrews | Standard D-Sub 9-pin female connector |

---

## 6. Exhaust Flue & Chimney Dimensions

| Flue Feature | Specification | Engineering Function |
| :--- | :--- | :--- |
| **Flue Tube Outer Diameter** | **$\varnothing 48.0\text{ mm}$** (1.89 in) | AISI 304 seamless stainless steel tube |
| **Flue Tube Wall Thickness** | $1.50\text{ mm}$ | Rigid structural duct |
| **Chimney Height Above Casing** | **90.0 mm** (3.54 in) | Provides natural thermal updraft draft |
| **Internal Damper Plate** | $\varnothing 44.0\text{ mm} \times 2.0\text{ mm}$ | Pivoting butterfly slide plate inside flue duct |
| **Damper Lever Handle** | Length $45.0\text{ mm}$, insulated ball grip | Manual rotary adjustment of draft velocity |

---

## 7. Fastener Dimensional Standards Reference

Every mechanical joint across the digital twin utilizes standardized metric fasteners complying with DIN / ISO specifications:

| Fastener Standard | Nominal Size & Pitch | Head $\varnothing \times H$ | Tool Drive | Application in Muffle Twin |
| :--- | :--- | :--- | :--- | :--- |
| **DIN 912 / ISO 4762** | M4 $\times 0.70 \times 12\text{ mm}$ | $\varnothing 7.0 \times 4.0\text{ mm}$ | 3.0 mm Hex | Crydom SSR mounting to heatsink |
| **DIN 912 / ISO 4762** | M5 $\times 0.80 \times 16\text{ mm}$ | $\varnothing 8.5 \times 5.0\text{ mm}$ | 4.0 mm Hex | Base frame skirt to main chassis unibody |
| **DIN 912 / ISO 4762** | M6 $\times 1.00 \times 25\text{ mm}$ | $\varnothing 10.0 \times 6.0\text{ mm}$ | 5.0 mm Hex | Door handle standoff mounting |
| **DIN 7991 / ISO 10642**| M4 $\times 0.70 \times 10\text{ mm}$ | $\varnothing 8.0 \times 2.3\text{ mm}$ ($90^\circ$ CSK)| 2.5 mm Hex | Vertical guide C-channels to chassis walls |
| **DIN 7991 / ISO 10642**| M4 $\times 0.70 \times 12\text{ mm}$ | $\varnothing 8.0 \times 2.3\text{ mm}$ ($90^\circ$ CSK)| 2.5 mm Hex | Stainless throat collar mounting |
| **DIN 7981 / ISO 7049** | ST3.5 $\times 9.5\text{ mm}$ | $\varnothing 6.9 \times 2.6\text{ mm}$ | PH2 Phillips | Outer stainless sheet metal casing panels |
| **DIN 7379 / ISO 7379** | M6 thread, $\varnothing 8 \times 16\text{ mm}$ shoulder | $\varnothing 13.0 \times 5.5\text{ mm}$ | 4.0 mm Hex | Precision shoulder pins for guide shoes |
| **DIN 933 / ISO 4017** | M6 $\times 1.00 \times 25\text{ mm}$ | 10.0 mm AF $\times 4.0\text{ mm}$ | 10 mm Wrench | CW614N Brass chassis protective ground stud |
| **DIN 933 / ISO 4017** | M12 $\times 1.75 \times 50\text{ mm}$ | 19.0 mm AF $\times 7.5\text{ mm}$ | 19 mm Wrench | Threaded studs for 4 leveling feet |
| **DIN 985 / ISO 10511** | M8 $\times 1.25$ Nyloc | 13.0 mm AF $\times 8.0\text{ mm}$ | 13 mm Wrench | Cable pulley axle pivot retention nuts |
| **DIN 125 / ISO 7089**  | M4, M5, M6 Flat Washers | Varies by size | — | Load distribution under screw heads |
| **DIN 127 / ISO 7091**  | M4, M5, M6 Spring Washers | Varies by size | — | Vibration-loosening prevention in frame |
