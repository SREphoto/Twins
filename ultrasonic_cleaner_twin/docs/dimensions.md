# Engineering Dimensions & Kinematic Specifications: Ultrasonic Cleaner 3000-PRO

**Document ID:** SPEC-DIM-USC-3000PRO-001  
**Equipment Designation:** SREdesigns Ultrasonic Cleaner 3000-PRO  
**Primary OEM References:** Emerson Branson CPX5800H / 5800 Series & Elma Elmasonic S 300 / S 60  
**Coordinate Conventions:**  
- **Blender CAD Space:** $+X$ Right, $+Y$ Forward (Front Face), $+Z$ Up (Vertical Datum)  
- **Three.js WebGL Runtime:** $+X$ Right, $+Y$ Up (Vertical Datum), $-Z$ Forward  
- **Three.js Model Scale:** Units $\approx 100\text{ mm}$ (e.g. Body Width $3.2\text{ units} = 320\text{ mm}$; Front = $-Z$)  
- **Ground Datum ($Y = 0$ / $Z = 0$):** Bottom tangent plane of rubber leveling feet resting on laboratory bench  

---

## 1. Complete Physical Dimensional Envelope

```
       ◄─────────────────────── 320 mm Overall Width ────────────────────────►
       ┌─────────────────────┬───────────────────────────────────────────────┐  ▲
       │   LEFT CONTROL ZONE │             RIGHT BASIN ZONE                  │  │
       │      (80 mm W)      │                (240 mm W)                     │  │
       │                     │  ┌─────────────────────────────────────────┐  │  │
       │  ┌───────────────┐  │  │                                         │  │  │
       │  │    UI_LCD     │  │  │            STAINLESS BASIN              │  │  │ 200 mm
       │  │ (58 x 30 mm)  │  │  │          (230 x 164 x 145 mm)           │  │  │ Enclosure
       │  └───────────────┘  │  │               (5.5 Liters)              │  │  │ Depth
       │   [TIME]  [TEMP]    │  │                                         │  │  │ (214 mm w/ PEM)
       │    KNOB    KNOB     │  │                                         │  │  │
       │   [DEGAS] [SWEEP]   │  │                                         │  │  │
       │                     │  └─────────────────────────────────────────┘  │  │
       └─────────────────────┴───────────────────────────────────────────────┘  ▼
         ◄───►
        18 mm Left
        Margin
```

### 1.1 External Cabinet & Enclosure Specifications

| Assembly / Feature | Width ($X$) | Depth ($Y$) | Height ($Z$) | Units (Metric) | Runtime Units (Three.js) | OEM Notes & Tolerances |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Outer Cabinet Unibody** | **320.0 mm** | **200.0 mm** | **168.0 mm** | mm | $3.20 \times 2.00 \times 1.68$ | Heavy-gauge cold-rolled steel, powder coated |
| **Overall Depth with Rear PEM** | **320.0 mm** | **214.0 mm** | **168.0 mm** | mm | $3.20 \times 2.14 \times 1.68$ | Includes $14\text{ mm}$ IEC C14 power entry module |
| **Lower Base Plinth Skirt** | 324.0 mm | 204.0 mm | 14.0 mm | mm | $3.24 \times 2.04 \times 0.14$ | Recessed Dark Charcoal base skirt (`#1e293b`) |
| **Deck Surface Height (Datum $Y=0$)**| 320.0 mm | 200.0 mm | **186.0 mm** | mm | $Y = 1.86\text{ units}$ | Sum of leveling feet + plinth + cabinet body |
| **Total Height with Closed Lid** | 250.0 mm | 184.0 mm | **222.0 mm** | mm | $Y = 2.22\text{ units}$ | Measured to apex of brushed 304SS grab handle |
| **Total Height with Lid Fully Open** | 250.0 mm | 184.0 mm | **385.0 mm** | mm | $Y = 3.85\text{ units}$ | Lid opened $85^\circ$ on rear stainless barrel hinges |
| **Outer Sheet Steel Wall Thickness** | **1.20 mm** | **1.20 mm** | **1.20 mm** | mm | — | 18-gauge cold-rolled structural steel |
| **Acoustic Decoupling Air Gap** | 15.0 mm | 15.0 mm | 18.0 mm | mm | — | Decouples vibrating basin from outer casing |
| **Control Zone Left-Margin Clearance**| **18.0 mm** | — | — | mm | $0.18\text{ units}$ | $\ge 15\text{--}20\text{ mm}$ clearance from outer edge to bezels |
| **Leveling Foot Stance (Center-to-Center)**| 270.0 mm | 160.0 mm | — | mm | $2.70 \times 1.60\text{ units}$ | 4× knurled M6 leveling feet with NBR pads |
| **Leveling Foot Dimensions** | $\varnothing 22.0$ | $\varnothing 22.0$ | 12.0 mm | mm | $\varnothing 0.22 \times 0.12$ | Vulcanized NBR rubber pad on M6 threaded stud |
| **Net Weight (Empty Unit)** | — | — | — | **6.50 kg** | — | Certified empty weight per Branson 5800 |

---

## 2. Tank & Cleaning Basin Specifications

The internal fluid basin is stamped and deep-drawn from a single sheet of cavitation-resistant AISI 304 stainless steel with electropolished interior surfaces.

```
       ◄──────────────────── 230 mm Basin Width ────────────────────►
       ┌────────────────────────────────────────────────────────────┐  ▲
       │  Upper Perimeter Rim Flange (5 mm Lip x 3 mm Thickness)   │  │
       ├────────────────────────────────────────────────────────────┤  │
       │ │   ▲                                                  │ │ │  │
       │ │   │ MAX Fill Line (5.5 L Mark)                       │ │ │  │ 145 mm
       │ │ 120 mm Working Depth                                 │ │ │  │ Total Basin
       │ │   │                                                  │ │ │  │ Height
       │ │   ▼ MIN Fill Line (3.5 L Mark)                       │ │ │  │
       │ │                                                      │ │ │  │
       │ ├──────────────────────────────────────────────────────┤ │ │  │
       │ │  R = 15 mm Radiused Bottom Acoustic Corners          │ │ │  │
       └─┴───────────────────────┬──────────────────────────────┴─┴─┘  ▼
                                 │
                         [3/8" Drain Well] ──► [Ball Valve to Right Wall]
```

### 2.1 Basin Internal Geometry

| Basin Parameter | Specification (Metric) | Specification (Imperial) | Tolerances / Engineering Standards |
| :--- | :--- | :--- | :--- |
| **Working Liquid Capacity** | **5.50 Liters** | 1.45 gal (US) | Measured at internal MAX graduation line |
| **Total Brim-Full Volume** | **5.90 Liters** | 1.56 gal (US) | Geometric capacity to top perimeter rim |
| **Internal Basin Width ($w$)** | **230.0 mm** | 9.06 in | Deep-drawn AISI 304 stainless steel |
| **Internal Basin Depth ($d$)** | **164.0 mm** | 6.46 in | Deep-drawn AISI 304 stainless steel |
| **Internal Basin Height ($h$)** | **145.0 mm** | 5.71 in | Total vertical depth from floor to rim lip |
| **Effective Working Fluid Depth** | **120.0 mm** | 4.72 in | Liquid level at nominal $5.5\text{ L}$ fill volume |
| **Basin Wall Thickness** | **1.00 mm** (20 ga) | 0.039 in | Cavitation erosion-resistant electropolished finish |
| **Radiused Bottom Corners ($R$)** | **15.0 mm** | 0.59 in | Eliminates standing-wave dead zones |
| **Basin Center Lateral Offset ($X_{basin}$)**| **+40.0 mm** | +1.57 in | Centered in the right $240\text{ mm}$ basin zone ($+0.40$ Three.js units) |
| **Drain Port Well Diameter & Depth** | $\varnothing 32.0 \times 6.0\text{ mm}$ | $\varnothing 1.26 \times 0.24\text{ in}$ | Stamped sump recess in rear-right corner |
| **Drain Connection Thread** | **3/8" NPT** (Female) | — | 304SS welded female boss on bottom basin skin |
| **Drain Ball Valve Body** | $\varnothing 22.0 \times 35.0\text{ mm}$ | $\varnothing 0.87 \times 1.38\text{ in}$ | Heavy-duty 304SS body with PTFE ball seats |
| **Drain Valve Spout & Hose Barb** | $\varnothing 10.0 \times 18.0\text{ mm}$ | $\varnothing 0.39 \times 0.71\text{ in}$ | Protrudes from right lower chassis wall at $X = +160 \to +182\text{ mm}$ |
| **Drain Valve Handle Length** | 45.0 mm | 1.77 in | Quarter-turn manual lever ($90^\circ$ swing) |

---

## 3. Wire Basket Dimensions & Bench Placement Kinematics

```
       ================ WIRE BASKET & BENCH KINEMATICS ================
       
             IN TANK POSITION                       REMOVED BENCH REST POSITION
        ┌─────────────────────────┐               ┌─────────────────────────┐
        │ [=== Handle Hooks ===]  │               │ [=== Handle Hooks ===]  │
        │ ┌─────────────────────┐ │               │ ┌─────────────────────┐ │
        │ │ Welded Wire Mesh    │ │               │ │ Welded Wire Mesh    │ │
        │ │ (8 x 8 mm Grid)     │ │               │ │ (8 x 8 mm Grid)     │ │
        │ └─────────────────────┘ │               │ └─────────────────────┘ │
        │  [15 mm Standoff Legs]  │               │  [15 mm Standoff Legs]  │
        └────────────┬────────────┘               └────────────┬────────────┘
                     │                                         │
        Basin Center X = +40 mm                   Bench Rest Datum X >= 265 mm
        (Inside Tank Fluid)                       (X >= 2.65 Three.js Runtime Units)
                                                  *COMPLETELY CLEAR of Right Wall (+160 mm)
                                                   and Drain Spout (+182 mm)*
```

### 3.1 Wire Basket Dimensional Schedule

| Basket Parameter | Specification (Metric) | Specification (Imperial) | Engineering Function |
| :--- | :--- | :--- | :--- |
| **Basket Outer Width** | **215.0 mm** | 8.46 in | Leaves $7.5\text{ mm}$ fluid circulation clearance per side |
| **Basket Outer Depth** | **148.0 mm** | 5.83 in | Leaves $8.0\text{ mm}$ fluid circulation clearance front/back |
| **Basket Wall Height** | **105.0 mm** | 4.13 in | Submerged containment basket height |
| **Mesh Aperture Spacing** | **$8.0 \times 8.0\text{ mm}$** | $0.31 \times 0.31\text{ in}$ | Acoustically transparent square welded mesh grid |
| **Mesh Wire Diameter** | **$\varnothing 1.20\text{ mm}$** | 0.047 in | AISI 304 electropolished stainless steel wire |
| **Top Perimeter Rim Rod** | **$\varnothing 3.00\text{ mm}$** | 0.118 in | Heavy structural perimeter reinforcement rim |
| **Bottom Standoff Legs (4×)** | **$15.0\text{ mm}$ height** | 0.59 in | $\varnothing 2.5\text{ mm}$ wire legs with vulcanized silicone foot boots |
| **Clearance Above Diaphragm** | **25.0 mm** | 0.98 in | Prevents damping of transducer radiating tank bottom |
| **Dual Suspension Handles** | Formed $\varnothing 3.0\text{ mm}$ wire | Height $35.0\text{ mm}$ | Flanged hooks rest securely on basin perimeter rim |
| **Resting Bench Position ($X_{bench}$)**| **$X \ge 265.0\text{ mm}$** | $X \ge 10.43\text{ in}$ | Three.js runtime **$X \ge 2.65\text{ units}$** |
| **Bench Clearance Margin** | **$+83.0\text{ mm}$** | $+3.27\text{ in}$ | Clearance past right chassis wall ($+160\text{ mm}$) and drain ($+182\text{ mm}$) |

---

## 4. Ultrasonic Transducers & Heating System Dimensions

### 4.1 Langevin PZT Piezoelectric Transducers (Quad Array)

```
        UNDER-TANK TRANSDUCER & HEATER LAYOUT (BOTTOM VIEW)
        
        ┌────────────────────────────────────────────────────────┐
        │                                                        │
        │    [Transducer 1]                  [Transducer 2]      │
        │    (Ø 45 mm Horn)                  (Ø 45 mm Horn)      │
        │                                                        │
        │    ┌──────────────────────────────────────────────┐    │
        │    │    FLEXIBLE SILICONE RUBBER HEATING PAD      │    │
        │    │        (210 x 140 mm, 160 Watts)             │    │
        │    └──────────────────────────────────────────────┘    │
        │                                                        │
        │    [Transducer 3]                  [Transducer 4]      │
        │    (Ø 45 mm Horn)                  (Ø 45 mm Horn)      │
        │                                                        │
        └────────────────────────────────────────────────────────┘
```

| Component / Parameter | Dimensions ($W \times D \times H$) | Material Specification | Engineering Function |
| :--- | :--- | :--- | :--- |
| **Transducer Count & Topology**| **4× Langevin Transducers** | $2 \times 2$ symmetric matrix | Bolt-clamped piezoelectric sandwich |
| **Lateral Center-to-Center Spacing**| **110.0 mm** | Spaced symmetrically on $X$ | Uniform acoustic pressure distribution |
| **Longitudinal Center-to-Center Spacing**| **80.0 mm** | Spaced symmetrically on $Y$ | Prevents cavitation localized node nulls |
| **Front Radiating Horn Mass** | $\varnothing 45.0\text{ mm} \times 22.0\text{ mm}$ | Aerospace 6061-T6 aluminum | Acoustic impedance matching to stainless tank |
| **PZT Piezoelectric Ceramic Rings (2×)**| $\varnothing 38.0\text{ OD} \times \varnothing 15.0\text{ ID} \times 5.0\text{ mm}$ | Lead Zirconate Titanate (Navy Type III / PZT-8) | Converts 40 kHz AC voltage into acoustic motion |
| **Electrode Shims (3×)** | $\varnothing 38.0\text{ mm} \times 0.30\text{ mm}$ | Beryllium Copper (CuBe2), silver-plated | Positive and ground electrode terminations |
| **Rear Backing Mass** | $\varnothing 38.0\text{ mm} \times 16.0\text{ mm}$ | AISI 304 Stainless Steel | Inertial mass reflecting acoustic energy downward |
| **Pre-Stress Center Bolt** | M10 $\times 1.25\text{ mm} \times 55\text{ mm}$ | High-tensile alloy steel Grade 10.9 | Torqued to $35\text{ Nm}$ across Belleville spring stack |
| **Belleville Spring Washers (2×)**| $\varnothing 25.0\text{ OD} \times \varnothing 10.2\text{ ID} \times 1.5\text{ mm}$ | 51CrV4 spring steel, phosphated | Maintains $> 45\text{ MPa}$ constant pre-stress |
| **Structural Epoxy Bond Line** | Layer thickness $60\text{ }\mu\text{m}$ | Master Bond EP30HT ceramic-filled epoxy | $T_g = 145^\circ\text{C}$, shear strength $> 20\text{ MPa}$ |

### 4.2 Tank Heating Pad & Temperature Sensors

| Component | Dimensions ($W \times D \times H$) | Electrical / Material Spec | Engineering Function |
| :--- | :--- | :--- | :--- |
| **Silicone Surface Heating Pad** | $210.0 \times 140.0 \times 1.5\text{ mm}$ | Inconel etched foil in fiberglass silicone | **160 Watts** at 120/240V AC; $0.55\text{ W/cm}^2$ |
| **Primary Temperature Sensor** | $\varnothing 8.0\text{ mm} \times 5.0\text{ mm}$ button | Class A PT100 RTD (3-wire, $100\text{ }\Omega$ @ $0^\circ\text{C}$) | Spring-loaded contact against tank bottom |
| **Safety Thermal Cutout Switch** | $16.0 \times 12.0 \times 10.0\text{ mm}$ | Bimetallic snap-action switch (NC, $85^\circ\text{C}$ open) | Protects against dry-run boiling damage |
| **Secondary Thermal Fuse** | $\varnothing 4.0\text{ mm} \times 12.0\text{ mm}$ | One-time thermal cutoff fuse ($105^\circ\text{C}$, 10A) | Final non-resettable catastrophic protection |

---

## 5. Control Console, Electronics Bay & Power Components

### 5.1 Control Console & Ergonomics

| Feature / Part | Dimensions ($W \times D \times H$) | Three.js Runtime Coordinates | Engineering Function |
| :--- | :--- | :--- | :--- |
| **Left Control Panel Zone** | $80.0 \times 168.0 \times 4.0\text{ mm}$ | $X \in [-160, -80\text{ mm}]$ | Recessed dark charcoal console deck |
| **Ergonomic Left Edge Margin** | **18.0 mm** | $X = -160 \to -142\text{ mm}$ | Prevents finger pinch against left enclosure wall |
| **Digital LCD Window (`UI_LCD`)** | $58.0 \times 30.0\text{ mm}$ | Centered at $X = -120\text{ mm}, Y = +25\text{ mm}$ | Bound to dynamic high-DPI CanvasTexture (`flipY=false`) |
| **LCD Bezel Protrusion** | $64.0 \times 36.0 \times 2.0\text{ mm}$ | Flush with console deck | Matte black polycarbonate protective surround |
| **Rotary Time Encoder Knob** | $\varnothing 16.0\text{ mm} \times 8.0\text{ mm}$ | $X = -134\text{ mm}, Y = -42\text{ mm}$ | Satin knurled aluminum dial with pointer notch |
| **Rotary Temp Encoder Knob** | $\varnothing 16.0\text{ mm} \times 8.0\text{ mm}$ | $X = -106\text{ mm}, Y = -42\text{ mm}$ | Satin knurled aluminum dial with pointer notch |
| **Tactile Pushbuttons (3×)** | $\varnothing 7.0\text{ mm} \times 3.5\text{ mm}$ | Spaced along $X$ at $Y = -60\text{ mm}$ | `Btn_StartStop`, `Btn_Degas`, `Btn_Sweep` |
| **LED Indicators (2×)** | $\varnothing 3.0\text{ mm}$ LEDs | $X = \pm 10\text{ mm}$ above LCD | Green (Power / Sonics), Amber (Heater Active) |

### 5.2 Electronics Bay Modules

| Module / Component | Dimensions ($W \times D \times H$) | Electrical Specification | Engineering Function |
| :--- | :--- | :--- | :--- |
| **Main Motherboard (`PCB_Motherboard`)**| $160.0 \times 120.0 \times 1.6\text{ mm}$ | 2 oz FR-4 glass-epoxy, ENIG gold | System control, sensor conditioning, logic |
| **ARM Cortex-M4 Microcontroller** | LQFP-64 ($10.0 \times 10.0 \times 1.4\text{ mm}$) | 32-bit RISC core @ 84 MHz, hardware FPU | Precision PID, countdown timers, sweep generator |
| **Ultrasonic Generator PCB** | $140.0 \times 90.0 \times 1.6\text{ mm}$ | High-voltage FR-4 with isolated traces | 40 kHz half-bridge resonant inverter |
| **Power MOSFET Heatsink** | $75.0 \times 50.0 \times 25.0\text{ mm}$ | Extruded 6063-T6 aluminum (8 vertical fins)| Thermal dissipation for 2× IRFP460 MOSFETs |
| **Impedance-Matching Ferrite Transformer**| $42.0 \times 42.0 \times 35.0\text{ mm}$ | MnZn 3C90 ferrite pot core with Litz wire | Steps up 160V DC bus to 650 Vpp driving voltage |
| **Auxiliary Toroidal Transformer** | $\varnothing 70.0\text{ mm} \times 32.0\text{ mm}$ | Talema 30VA, 120/240V to 18V/12V AC | Low-noise step-down power for control electronics |
| **Switching Power Supply Module** | $100.0 \times 60.0 \times 30.0\text{ mm}$ | Mean Well 45W universal AC/DC module | Regulated +24V, +12V, +5V, +3.3V DC rails |
| **Convective Cooling Fan** | $60.0 \times 60.0 \times 15.0\text{ mm}$ | ebm-papst 12V DC, 0.12A, 19.5 CFM | Convective cooling through side louvers |
| **Fan Stamped Wire Grille** | $\varnothing 56.0\text{ mm} \times 4.0\text{ mm}$ | Formed zinc-plated steel wire grill | Conforms to IEC 61010-1 safety requirements |
| **Rear Power Entry Module (PEM)** | $48.0 \times 28.0 \times 38.0\text{ mm}$ | IEC C14 inlet + dual $5 \times 20\text{ mm}$ fuses + filter | AC line filtering and 5A overcurrent protection |
| **Illuminated Rocker Switch** | $21.0 \times 15.0 \times 25.0\text{ mm}$ | DPST 10A 250V AC with silicone splash boot | Master AC mains disconnect on rear panel |

---

## 6. Fastener Dimensional Standards Reference

Every mechanical joint across the digital twin assembly is documented with exact metric thread specifications:

| Fastener Standard | Thread & Nominal Length | Head $\varnothing \times H$ | Tool Drive | Application in Cleaner Twin |
| :--- | :--- | :--- | :--- | :--- |
| **DIN 912 / ISO 4762** | M4 $\times 0.70 \times 12\text{ mm}$ | $\varnothing 7.0 \times 4.0\text{ mm}$ | 3.0 mm Hex | Heatsink mounting to internal chassis bracket |
| **DIN 912 / ISO 4762** | M4 $\times 0.70 \times 16\text{ mm}$ | $\varnothing 7.0 \times 4.0\text{ mm}$ | 3.0 mm Hex | Toroidal transformer center bracket clamp |
| **DIN 7985 / ISO 7045** | M3 $\times 0.50 \times 8\text{ mm}$ | $\varnothing 5.6 \times 2.4\text{ mm}$ | PH1 Phillips | PCB motherboard & generator board mounting |
| **DIN 7985 / ISO 7045** | M3 $\times 0.50 \times 25\text{ mm}$ | $\varnothing 5.6 \times 2.4\text{ mm}$ | PH1 Phillips | 60 mm convective cooling fan through-mounting |
| **DIN 7991 / ISO 10642**| M3 $\times 0.50 \times 8\text{ mm}$ | $\varnothing 6.0 \times 1.7\text{ mm}$ ($90^\circ$ CSK)| 2.0 mm Hex | Control console fascia plate flush mounting |
| **DIN 7991 / ISO 10642**| M3 $\times 0.50 \times 10\text{ mm}$ | $\varnothing 6.0 \times 1.7\text{ mm}$ ($90^\circ$ CSK)| 2.0 mm Hex | Rear IEC power inlet socket mounting |
| **DIN 7981 / ISO 7049** | ST3.5 $\times 9.5\text{ mm}$ | $\varnothing 6.9 \times 2.6\text{ mm}$ | PH2 Phillips | Outer casing bottom and side panel retention |
| **DIN 933 / ISO 4017** | M5 $\times 0.80 \times 20\text{ mm}$ | 8.0 mm AF $\times 3.5\text{ mm}$ | 8 mm Wrench | Solid brass protective earth (PE) chassis stud |
| **DIN 933 / ISO 4017** | M6 $\times 1.00 \times 20\text{ mm}$ | 10.0 mm AF $\times 4.0\text{ mm}$ | 10 mm Wrench | Threaded studs for 4 leveling feet |
| **DIN 985 / ISO 10511** | M3 $\times 0.50$ Nyloc | 5.5 mm AF $\times 4.0\text{ mm}$ | 5.5 mm Wrench | Fan and rear connector locking nuts |
| **DIN 125 / ISO 7089**  | M3, M4 Flat Washers | Varies by size | — | Load distribution under screw heads |
| **DIN 127 / ISO 7091**  | M3, M4 Spring Washers | Varies by size | — | Vibration-loosening prevention under ultrasound |
| **DIN 6798-A**          | M5 Star Lock Washers | $\varnothing 10.0 \times 0.6\text{ mm}$ | — | Paint-biting washers on brass PE ground stud |