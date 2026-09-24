# Dimensions — Magnetic Hotplate Stirrer (`STIR-HEAT 500-D`)

For 3D CAD modeling and Three.js procedural runtime assembly. Based on the archetypal IKA RCT basic / RET control-visc laboratory hotplate stirrer with ceramic coated top plate and PT1000 temperature immersion probe.

Scale standard: $1\text{ unit} = 100\text{ mm} = 0.1\text{ m}$ in Three.js runtime; $1\text{ unit} = 1\text{ mm}$ with scale $S = 0.001$ in Blender.
Tabletop datum: Table surface at $Y = 0$ local ($Y = 9.000$ in lab world).

---

## 1. Overall Spatial Envelope

| Subsystem | Metric (mm) | Three.js Units | Notes / Source |
| :--- | :--- | :--- | :--- |
| **Total Width** | 160 mm | 1.60 | Side-to-side footprint |
| **Total Depth** | 270 mm | 2.70 | Front-to-back footprint |
| **Total Height (Base only)** | 100 mm | 1.00 | Ground feet to top of heating plate |
| **Total Height (With Rod)** | 480 mm | 4.80 | With vertical retort rod installed |
| **Base Chassis Height** | 85 mm | 0.85 | Die-cast aluminum main enclosure |
| **Weight** | ~2.5 kg | — | Solid die-cast metal body |

---

## 2. Main Chassis Housing (`Body_Chassis`)

| Feature | Metric (mm) | Three.js Units | Notes |
| :--- | :--- | :--- | :--- |
| **Base Width (Lower)** | 156 mm | 1.56 | Chamfered corner returns ($R = 8\text{ mm}$) |
| **Base Depth (Lower)** | 266 mm | 2.66 | Chamfered corner returns |
| **Front Apron Slope** | $15^\circ$ | — | Forward rake for ergonomic viewing |
| **Console Slope Length** | 75 mm | 0.75 | Spans $Z = -0.55$ to $Z = -1.30$ |
| **Flat Rear Deck** | 180 mm | 1.80 | Flat upper surface supporting heating plate |
| **Corner Fillet Bevels** | 3.5 mm | 0.035 | Applied along all outer casting edges |
| **Rear Cooling Louvers** | 8 slots | — | Horizontal ventilation slits on rear panel |
| **Side Grip Recesses** | Dual | — | Molded side indents for safe transport |

---

## 3. Heating Top Plate (`Plate_Heating`)

| Feature | Metric (mm) | Three.js Units | Notes |
| :--- | :--- | :--- | :--- |
| **Plate Shape** | Circular | — | Flush circular top plate |
| **Diameter** | $\varnothing 135\text{ mm}$ | 1.35 | White chemical-resistant ceramic enamel |
| **Thickness / Lip** | 15 mm | 0.15 | Elevated proud of chassis deck |
| **Plate Center Offset** | $Z = 0.35$ | 0.35 | Centered over rear internal drive motor |
| **Thermal Spill Ring** | $\varnothing 142\text{ mm}$ | 1.42 | Silicone/stainless raised drainage barrier |
| **Insulation Core** | 12 mm | 0.12 | Internal ceramic fiber insulation pad |

---

## 4. Control Console & Display (`UI_LCD`, Knobs, Buttons)

| Component | Metric (mm) | Three.js Units | Notes |
| :--- | :--- | :--- | :--- |
| **Display Bezel Recess** | $92 \times 44 \times 2\text{ mm}$ | $0.92 \times 0.44 \times 0.02$ | **Boolean carved pocket** into sloped apron |
| **Active LCD (`UI_LCD`)** | $84 \times 36\text{ mm}$ | $0.84 \times 0.36$ | Flush quad seated inside carved recess |
| **Left Knob (Speed)** | $\varnothing 32\text{ mm} \times 16\text{ mm}$ | $\varnothing 0.32 \times 0.16$ | Optical rotary encoder + push click (0–1500 RPM) |
| **Right Knob (Temp)** | $\varnothing 32\text{ mm} \times 16\text{ mm}$ | $\varnothing 0.32 \times 0.16$ | Optical rotary encoder + push click ($20\text{--}310\text{ }^\circ\text{C}$) |
| **Knob Flute / Grip** | 24 ribs | — | Knurled perimeter with white top index notch |
| **Safety Potentiometer** | $\varnothing 6\text{ mm}$ | $\varnothing 0.06$ | Recessed slotted trimpot (Limit $50\text{--}360\text{ }^\circ\text{C}$) |
| **Main Power Rocker** | $22 \times 14\text{ mm}$ | $0.22 \times 0.14$ | Right side flank illuminated rocker switch |
| **SREdesigns Badge** | $32 \times 9\text{ mm}$ | $0.32 \times 0.09$ | Front nose lip (strictly $\le 85\%$ lip height, DIAG-001) |

---

## 5. Retort Stand, Clamp & Immersion Probe

| Component | Metric (mm) | Three.js Units | Notes |
| :--- | :--- | :--- | :--- |
| **Threaded M10 Socket** | Rear-right | $X = 0.62, Z = 1.05$ | Threaded receptacle for vertical support rod |
| **Support Rod** | $\varnothing 12\text{ mm} \times 450\text{ mm}$ | $\varnothing 0.12 \times 4.50$ | Polished 304 stainless steel rod |
| **Boss Head Clamp** | $38 \times 32 \times 28\text{ mm}$ | $0.38 \times 0.32 \times 0.28$ | Die-cast aluminum dual clamp with brass thumbscrews |
| **Probe Holding Arm** | $\varnothing 8\text{ mm} \times 140\text{ mm}$ | $\varnothing 0.08 \times 1.40$ | Horizontal extension arm reaching beaker center |
| **PT1000 Probe** | $\varnothing 3\text{ mm} \times 200\text{ mm}$ | $\varnothing 0.03 \times 2.00$ | Stainless steel sheath with rounded sensing tip |
| **Spiral Coiled Lead** | $\varnothing 14\text{ mm}$ coil | $\varnothing 0.14$ | Silicone spiral cable running to rear DIN/LEMO port |

---

## 6. Glass Beaker, Fluid & Magnetic Stir Bar

| Item | Metric (mm) | Three.js Units | Notes |
| :--- | :--- | :--- | :--- |
| **250 mL Glass Beaker** | $\varnothing 70\text{ mm} \times 95\text{ mm}$ | $\varnothing 0.70 \times 0.95$ | Low-form Griffin beaker with pour spout and markings |
| **Wall Thickness** | 1.8 mm | 0.018 | Borosilicate 3.3 optical glass |
| **Fluid Level (150 mL)** | $\varnothing 66.4\text{ mm} \times 50\text{ mm}$ | $\varnothing 0.664 \times 0.50$ | Translucent liquid with dynamic vortex cone |
| **PTFE Stir Bar** | $\varnothing 8\text{ mm} \times 25\text{ mm}$ | $\varnothing 0.08 \times 0.25$ | Octagonal white PTFE bar with center pivot ring |

---

## 7. Leveling Feet & Rear Bulkhead

| Feature | Metric (mm) | Three.js Units | Notes |
| :--- | :--- | :--- | :--- |
| **4x Leveling Feet** | $\varnothing 24\text{ mm} \times 12\text{ mm}$ | $\varnothing 0.24 \times 0.12$ | Neoprene anti-vibration feet at $Y \in [-0.12, 0]$ |
| **Foot Inset** | 18 mm | 0.18 | Inside base footprint (zero perimeter overhang) |
| **IEC C14 Inlet** | $50 \times 32\text{ mm}$ | $0.50 \times 0.32$ | Rear panel IEC 60320 inlet with integral 5x20mm fuse |
| **PT1000 Jack** | DIN 5-pin / LEMO | $\varnothing 0.14$ | Rear panel connector for temperature probe |
| **RS-232 Port** | DB9 female | $0.31 \times 0.15$ | Laboratory automation interface |
