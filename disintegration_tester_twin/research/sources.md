# ERWEKA ZT 322 Series Tablet Disintegration Tester: Technical & Regulatory Research

## 1. Instrument Identification & Lineage
- **Manufacturer**: ERWEKA GmbH, Heusenstamm, Germany
- **Target Model**: ERWEKA ZT 322 (2 Test Stations, USP Apparatus A)
- **Primary Function**: Pharmacopeial disintegration testing of solid oral dosage forms (tablets, capsules, pills, boluses)
- **Regulatory Compendia**:
  - United States Pharmacopeia (USP <701> Disintegration, USP <2040> Disintegration of Dietary Supplements)
  - European Pharmacopoeia (Ph. Eur. 2.9.1 Disintegration of tablets and capsules, Test A & Test B)
  - Japanese Pharmacopoeia (JP 6.09 Disintegration Test)
  - British Pharmacopoeia (BP Appendix XII A)

---

## 2. Compendial Physical Dimensions & Mechanical Requirements (USP <701> / Ph. Eur. 2.9.1)

### 2.1 The Basket-Rack Assembly (USP Apparatus A)
- **Tubes**: 6 vertical transparent glass or rigid acrylic tubes per basket assembly:
  - Length: $77.5 \pm 2.5\text{ mm}$
  - Internal Diameter: $21.5 \pm 0.5\text{ mm}$
  - Wall Thickness: approx. $2.0\text{ mm}$
- **Plates**: Two circular transparent acrylic/POM plates ($\varnothing 90.0 \pm 2.0\text{ mm} \times 6.0 \pm 0.5\text{ mm}$ thickness):
  - Each plate has 6 equidistant holes holding the vertical tubes equidistant from the center and each other.
  - Assembled via 3 stainless steel vertical tie rods with knurled cap nuts.
- **Wire Cloth Screen**:
  - Attached to the lower surface of the bottom plate.
  - Material: Corrosion-resistant Type 316 stainless steel woven wire cloth.
  - Wire diameter: $\varnothing 0.63 \pm 0.03\text{ mm}$ (approx. 23 AWG).
  - Aperture: Square opening size of $2.0 \pm 0.2\text{ mm}$ (approx. 10-mesh).
- **Fluted Cylindrical Acrylic Disks**:
  - Included for dosage forms specified in individual monographs:
  - Diameter: $20.7 \pm 0.15\text{ mm}$
  - Thickness: $9.5 \pm 0.15\text{ mm}$
  - Relative Density: $1.18\text{ to }1.20\text{ g/cm}^3$ (sinks gently in water)
  - Geometry: 5 trapezoidal V-shaped side flutes for fluid escape, flat top and bottom with cylindrical center bore.

### 2.2 Fluid Container (Vessel) & Immersion Bath
- **Beakers**: Two standard $1000\text{ mL}$ low-form Griffin glass beakers (Borosilicate 3.3, ISO 3819):
  - Outside Diameter: $105.0 \pm 1.0\text{ mm}$
  - Height: $145.0 \pm 2.0\text{ mm}$
  - Filled Volume: $800\text{ mL}$ test media (e.g. $0.1\text{ N HCl}$ simulated gastric fluid or pH 6.8 phosphate buffer).
- **Water Bath**:
  - Seamless molded clear acrylic tank ($W 380\text{ mm} \times D 210\text{ mm} \times H 190\text{ mm}$, $6\text{ mm}$ wall).
  - Fluid temperature maintained at $37.0 \pm 0.5^\circ\text{C}$ via high-efficiency external/flow-through circulation loop.
- **Immersion Kinematic Limits**:
  - Top Dead Center (TDC): Wire mesh screen descends no higher than $\ge 15.0\text{ mm}$ below the liquid surface.
  - Bottom Dead Center (BDC): Wire mesh screen descends no lower than $\ge 25.0\text{ mm}$ above the concave bottom of the beaker.
  - The upper ends of the tubes remain above the liquid surface at all times during the stroke.

---

## 3. Kinematic Drive Mechanics & Tolerances
- **Harmonic Oscillation Profile**: Pure vertical sinusoidal motion driven by an eccentric rotary crankshaft disc and crosshead slider:
  $$y(t) = y_0 + A \cdot \sin(2\pi \cdot f \cdot t)$$
- **Stroke Amplitude ($2A$)**: Exactly $55.0 \pm 2.0\text{ mm}$ vertical displacement.
- **Stroke Frequency ($f$)**: Exactly $29\text{ to }32\text{ cycles/min}$ (nominal $30.0 \pm 1.0\text{ strokes/min}$, $0.50 \pm 0.017\text{ Hz}$).
- **Guide Mechanism**: Dual precision ground stainless steel vertical guide shafts ($\varnothing 16.0\text{ mm}$) with recirculating linear ball bushings to eliminate lateral vibration or rocking ($\le 0.5\text{ mm}$ deflection).

---

## 4. Electrical & Thermal Specifications
- **Mains Voltage**: $115\text{ VAC}$ ($60\text{ Hz}$) / $230\text{ VAC}$ ($50\text{ Hz}$), single-phase.
- **Total Power Consumption**: $1620\text{ W}$ max:
  - Flow-through Incoloy water heater: $1500\text{ W}$
  - DC gearmotor drive & electronics: $120\text{ W}$
- **Temperature Control**:
  - Range: Ambient to $45.0^\circ\text{C}$ (accuracy $\pm 0.2^\circ\text{C}$, stability $\pm 0.1^\circ\text{C}$)
  - Sensor: Class A 4-wire Pt100 RTD immersion probe
  - Overheat Protection: Mechanical bimetallic thermal switch tripped at $45.0^\circ\text{C} \pm 2^\circ\text{C}$ + float switch dry-run protection.
- **Data Communication**: RS-232 DB-9 serial port (printer/PC GLP export), USB-B interface.
