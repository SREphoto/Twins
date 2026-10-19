# Dimensional Specifications & Spatial Tolerances: Agilent 708-DS Dissolution Tester

All dimensions are derived from official Agilent 708-DS Dissolution Apparatus specifications (Doc 70-9058) and USP <711> mechanical qualification standards. Units are in millimeters [mm] in 1:1 scale.

## 1. Instrument Spatial Envelope

| Component | Width (X) [mm] | Depth (Z) [mm] | Height (Y) [mm] | Datum Elevation (Y) |
| :--- | :--- | :--- | :--- | :--- |
| **Main Base Pan** | $622.0$ | $590.0$ | $140.0$ | $Y = 0.0\text{ to }140.0$ |
| **Acrylic Water Bath** | $580.0$ | $440.0$ | $240.0$ | $Y = 140.0\text{ to }380.0$ |
| **Lowered Drive Head** | $610.0$ | $480.0$ | $180.0$ | $Y = 380.0\text{ to }680.0$ |
| **Elevated Drive Head**| $610.0$ | $480.0$ | $180.0$ | $Y = 691.0\text{ to }991.0$ |
| **External Heater/Circulator**| $180.0$| $320.0$ | $260.0$ | $Y = 0.0\text{ to }260.0$ |
| **Bench Receptacle Box** | $54.0$ | $72.0$ | $36.0$ | $Y = 0.0\text{ to }36.0$ |

---

## 2. Molded Acrylic Water Bath & Vessel Grid
- **Bath Material**: High-clarity seamless molded optical acrylic ($8.0\text{ mm}$ wall thickness).
- **Vessel Configuration**: 8 positions arranged in a $4 \times 2$ matrix:
  - **Front Row (Positions 1 to 4)**: $Z = +75.0\text{ mm}$; $X = -202.5, -67.5, +67.5, +202.5\text{ mm}$ (Pitch: $135.0\text{ mm}$).
  - **Rear Row (Positions 5 to 8)**: $Z = -75.0\text{ mm}$; $X = -202.5, -67.5, +67.5, +202.5\text{ mm}$ (Pitch: $135.0\text{ mm}$).
- **Vessel Flange Recesses**: Molded circular indexing pockets $\varnothing 120.0\text{ mm}$ with TruCenter alignment rings.
- **Water Circulation Ports**: Rear-mounted quick-disconnect fluid inlet and outlet ports ($\varnothing 12.0\text{ mm}$ barb) routing to external circulator.

---

## 3. USP Borosilicate Glass Vessels (8x)
- **Material**: Precision USP Type I clear borosilicate glass.
- **Nominal Capacity**: $1000\text{ mL}$ ($900\text{ mL}$ standard operating volume).
- **Internal Diameter**: $\varnothing 100.0 \pm 1.0\text{ mm}$.
- **Cylindrical Height**: $168.0\text{ mm}$.
- **Hemispherical Bottom**: True spherical radius $r = 50.0\text{ mm}$.
- **Concentricity Tolerance**: TruCenter collar maintains shaft-to-vessel axis concentricity $\le 1.0\text{ mm}$ throughout rotation.

---

## 4. Drive Head & Spindle Kinematics
- **Vertical Elevator Columns**: Twin polished 304SS guide rods $\varnothing 25.4\text{ mm}$ ($1.0"$) and precision stainless steel ball lead screw ($\varnothing 16.0\text{ mm}$, pitch $5.0\text{ mm}$).
- **Elevator Stroke**: $+311.0\text{ mm}$ vertical kinematic travel ($Y = 380.0\text{ mm} \to 691.0\text{ mm}$).
- **8 Spindles**: Precision ground 316 stainless steel shafts $\varnothing 9.525\text{ mm}$ ($3/8"$), overall length $380.0\text{ mm}$.
- **Apparatus 2 Paddles**: 316 stainless steel blades:
  - Blade width: $74.5 \pm 0.5\text{ mm}$.
  - Blade height: $19.0 \pm 0.5\text{ mm}$.
  - Blade thickness: $4.0 \pm 1.0\text{ mm}$.
  - Clearance to vessel bottom: $25.0 \pm 2.0\text{ mm}$ (verified via calibration spacer tool).
- **Timing Belt Drive**: Synchronous HTD 5M timing belt coupling 8 drive pulleys to high-torque brushless DC servo motor with optical encoder ($10\text{ to }250\text{ RPM}$).

---

## 5. Controls, Fascia & Touchscreen
- **Display Pocket**: $145.0\text{ mm W} \times 95.0\text{ mm H} \times 6.0\text{ mm D}$ carved directly into the front fascia of the drive head at a $15^\circ$ forward slope.
- **UI_LCD Quad**: $130.0\text{ mm W} \times 80.0\text{ mm H}$ active area, seated with $+2.0\text{ mm}$ relative Z clearance.
- **Dedicated Push Buttons**:
  - `Btn_ElevateUp`: Green chevron tactile key (raise head)
  - `Btn_ElevateDown`: Amber chevron tactile key (lower head)
  - `Btn_StirStart`: Blue tactile key (start spindles)
  - `Btn_StirStop`: Red tactile key (stop spindles)
  - `Btn_Heater`: Cyan tactile key (bath circulator toggle)
- **Power Switch**: Red illuminated DPST rocker switch located on front base pan.
- **Brand Identity Badge**: `Badge_SREdesigns` seated in dedicated recessed pocket on drive head top ($80.0\text{ mm W} \times 26.0\text{ mm H}$).
