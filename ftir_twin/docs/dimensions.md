# Dimensions — FTIR Spectrometer (Fourier-Transform Infrared Spectrometer)

Specifications for 3D procedural modeling based on Thermo Scientific Nicolet iS50 / Bruker Alpha II / INVENIO FTIR.

---

## 1. Overall Main Enclosure (Chassis)

| Parameter | Imperial | Metric | Notes |
| :--- | :--- | :--- | :--- |
| Width ($X$) | 18.5 in | 470.0 mm | Rugged cast aluminum base with powder-coated top cover |
| Depth ($Z$) | 20.5 in | 520.0 mm | Front bezel to rear I/O fan guard |
| Height ($Y$) | 10.2 in | 260.0 mm | Including leveling feet |
| Datum Plane | — | $Y = 0.0$ local | Sits flush on lab bench ($Y = 9.0$ lab world) |
| Front Bezel Angle | ~22° | 22.0° | Ergonomic control deck slope |

---

## 2. ATR (Attenuated Total Reflection) Sampling Station

| Parameter | Imperial | Metric | Notes |
| :--- | :--- | :--- | :--- |
| ATR Module Recess | 5.5 × 6.3 in | 140 × 160 mm | Center-left top sampling deck |
| Diamond Crystal | $\varnothing 0.08$ in | $\varnothing 2.0$ mm | Monolithic Type IIa diamond prism brazed in tungsten carbide |
| Top Plate | 4.7 × 4.7 in | 120 × 120 mm | 316L stainless steel mirror-polished plate |
| Pressure Tower | Pivot arm | $Y = 160.0$ mm | Articulated swiveling clamp arm with calibrated slip-clutch knob |
| Clamp Pressure Tip | $\varnothing 0.24$ in | $\varnothing 6.0$ mm | Interchangeable concave/flat sapphire anvil for solid powders |
| Sample Volume | Micro-drop | $2\text{--}10\ \mu\text{L}$ | Liquids placed directly on diamond; solids pressed with clamp |

---

## 3. Michelson Interferometer Optical Bench

| Parameter | Location | Dimensions | Function |
| :--- | :--- | :--- | :--- |
| Polaris Ever-Glo IR Source | Sealed left pod | $\varnothing 28 \times 65$ mm | Stabilized ceramic emitter ($9600\text{--}50\text{ cm}^{-1}$, $1200\ ^\circ\text{C}$) |
| HeNe Reference Laser | Left optical rail | $\varnothing 32 \times 180$ mm | Red gas laser tube ($632.8\text{ nm}$, $1\text{ mW}$) for optical path phase lock |
| Beam Splitter Substrate | Optical center | $45 \times 45 \times 8$ mm | KBr (Potassium Bromide) coated with Ge for mid-IR |
| Fixed Mirror | Orthogonal port | $\varnothing 38 \times 12$ mm | Gold-coated planar mirror with micrometer tilt screws |
| Moving Mirror Assembly | Linear rail port | $\varnothing 38 \times 12$ mm | Frictionless electromagnetic voice-coil linear drive (air bearing) |
| DTGS Detector | Right optical port | $\varnothing 40 \times 55$ mm | Deuterated triglycine sulfate pyroelectric detector with KBr window |

---

## 4. Control Panel & Display (`UI_LCD`)

| Parameter | Imperial | Metric | Notes |
| :--- | :--- | :--- | :--- |
| Display Diagonal | 7.0 in | 177.8 mm | High-DPI color touchscreen |
| Display Width | 6.0 in | 152.4 mm | Screen active area |
| Display Height | 3.6 in | 91.4 mm | Screen active area |
| Bezel Recess Depth | 0.16 in | 4.0 mm | Recessed pocket in chassis face |
| Tilt Angle | 22° | 22.0° | Upright silkscreen typography |

---

## 5. Electrical & Facilities Connectivity

| Parameter | Specification | Notes |
| :--- | :--- | :--- |
| Power Inlet | IEC 60320 C14 | Rear chassis panel at $X = -1.40$ |
| Line Rating | 100–240 VAC, 50/60 Hz, 150 W | Universal input SMPS |
| Power Cord | NEMA 5-15P to IEC C13, 18 AWG SJTOW | Firmly plugged into duplex bench outlet |
| Main Power Switch | DPST Rocker with I/O silkscreen and green LED | Rear chassis panel |
| Cooling Fan | 80 mm brushless DC fan (12V) | Relocated to power supply bay, exhausting outside |
| Purge Port | 1/4" Swagelok brass fitting | Dry air / $N_2$ purge to eliminate $H_2O$ and $CO_2$ atmospheric bands |
