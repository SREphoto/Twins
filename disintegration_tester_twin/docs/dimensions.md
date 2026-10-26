# ERWEKA ZT 322 Tablet Disintegration Tester: 1:1 Physical Dimensions

## 1. Spatial Envelope & Datum Freeze (Code 4771-CAD)

All physical dimensions are derived from OEM engineering specifications and compendial requirements (USP <701> / Ph. Eur. 2.9.1).

- **Global Coordinate Datum**:
  - Origin $(0, 0, 0)$ is centered horizontally at the machine's footprint on the tabletop surface.
  - Tabletop datum: $Y = 0.0\text{ mm}$ local (sits on `INSTRUMENT_BENCH` at $Y = 9.0\text{ dm}$ in lab space).
  - Front-facing direction: Facing $-Z$ toward the operator.
- **Total Machine Bounding Box**:
  - **Width ($X$)**: $430.0\text{ mm}$
  - **Depth ($Z$)**: $400.0\text{ mm}$
  - **Height ($Y$) (Parked / Rest Position)**: $660.0\text{ mm}$
  - **Height ($Y$) (Stroke Peak)**: $715.0\text{ mm}$

---

## 2. Sub-Assembly Breakdown & Coordinates

### 2.1 Lower Structural Cabinet (`Body_Chassis`)
- **Main Base Pan**: $430.0\text{ mm W} \times 400.0\text{ mm D} \times 240.0\text{ mm H}$
- **Front Step-Down Deck (Bath Cradle)**:
  - Width: $390.0\text{ mm}$
  - Depth: $220.0\text{ mm}$
  - Recessed Deck Elevation: $Y = 20.0\text{ mm}$ (features molded locating perimeter lip for the acrylic bath)
- **Rear Electronics & Motor Housing**:
  - Width: $430.0\text{ mm}$
  - Depth: $180.0\text{ mm}$
  - Height: $Y = 20.0\text{ mm to } 240.0\text{ mm}$ (slopes gently from $Z = +10.0\text{ mm}$ to $Z = +180.0\text{ mm}$)
- **Leveling Feet (`Foot_Leveling_FL, FR, RL, RR`)**:
  - 4 vulcanized neoprene rubber feet with $M10 \times 25\text{ mm}$ threaded stainless steel leveling studs.
  - Foot diameter: $\varnothing 40.0\text{ mm}$, height $12.0\text{ mm}$.
  - Positions: $X = \pm 185.0\text{ mm}$, $Z = -170.0\text{ mm}$ (front) and $+170.0\text{ mm}$ (rear).
  - Bottom plane rests precisely at $Y = 0.0\text{ mm}$.

### 2.2 Upright Drive Tower & Oscillation Arm
- **Vertical Drive Tower**:
  - Width: $360.0\text{ mm}$
  - Depth: $160.0\text{ mm}$
  - Height: Extends from $Y = 240.0\text{ mm}$ to $Y = 620.0\text{ mm}$ ($380.0\text{ mm}$ column height).
  - Centered at $Z = +100.0\text{ mm}$.
- **Vertical Guide Shafts**:
  - Dual ground and polished chrome steel shafts ($\varnothing 16.0\text{ mm} \times 340.0\text{ mm L}$).
  - Spacing: $X = \pm 80.0\text{ mm}$.
- **Horizontal Drive Bridge Arm (`Body_DriveHead`)**:
  - Cast aluminum rigid crossbar: $340.0\text{ mm W} \times 90.0\text{ mm D} \times 40.0\text{ mm H}$.
  - Mounts two quick-release knurled suspension collets for the basket assemblies.
  - Suspension Collet Spacing: $X = \pm 82.5\text{ mm}$ (matching beaker centers).
  - Resting Height: $Y = 560.0\text{ mm}$.
  - Oscillation Stroke: $Y(t) = 560.0\text{ mm} + 27.5\text{ mm} \cdot \sin(2\pi \cdot 0.5\text{ Hz} \cdot t)$.
  - Total vertical stroke travel: $55.0\text{ mm}$ peak-to-peak.

### 2.3 Fluid Containers & Heating Bath (`Body_Bath`)
- **Seamless Acrylic Water Bath Tank**:
  - Outer Dimensions: $380.0\text{ mm W} \times 210.0\text{ mm D} \times 190.0\text{ mm H}$.
  - Wall Thickness: $6.0\text{ mm}$ clear optical PMMA.
  - Position: Centered at $X = 0.0\text{ mm}$, $Z = -85.0\text{ mm}$, resting at $Y = 20.0\text{ mm}$.
  - Internal Cavity: $368.0\text{ mm W} \times 198.0\text{ mm D} \times 184.0\text{ mm H}$.
  - Drain Valve: Brass/PTFE quarter-turn drain petcock on right flank ($X = +190.0\text{ mm}$, $Y = 26.0\text{ mm}$).
- **Beakers (`Glass_Beaker_01, Glass_Beaker_02`)**:
  - Two $1000\text{ mL}$ standard low-form Griffin glass beakers (Borosilicate 3.3).
  - Diameter: Outer $\varnothing 105.0\text{ mm}$, Inner $\varnothing 100.0\text{ mm}$.
  - Height: $145.0\text{ mm}$.
  - Bottom resting plane inside bath: $Y = 26.0\text{ mm}$.
  - Top rim elevation: $Y = 171.0\text{ mm}$.
  - Centers: Station 1 at $X = -82.5\text{ mm}, Z = -85.0\text{ mm}$; Station 2 at $X = +82.5\text{ mm}, Z = -85.0\text{ mm}$.
  - Liquid Level: $800\text{ mL}$ test fluid per beaker, surface at $Y = 138.0\text{ mm}$ ($112.0\text{ mm}$ fluid depth).

### 2.4 Basket-Rack Assemblies (`Pivot_BasketArm_Left, Right`)
- **Basket Dimensions (USP Apparatus A)**:
  - Overall Diameter: $\varnothing 90.0\text{ mm}$.
  - Tube Array: 6 tubes arranged in a regular hexagon on $\varnothing 54.0\text{ mm}$ bolt circle.
  - Tube Dimensions: Inner $\varnothing 21.5\text{ mm}$, Outer $\varnothing 25.5\text{ mm}$, Length $77.5\text{ mm}$.
  - Acrylic Upper & Lower Plates: $\varnothing 90.0\text{ mm} \times 6.0\text{ mm}$ thick.
  - Stainless Steel Mesh Bottom: Type 316 wire mesh, aperture $2.0\text{ mm}$, wire $\varnothing 0.63\text{ mm}$.
  - Suspension Rod: Stainless steel central rod ($\varnothing 6.0\text{ mm} \times 320.0\text{ mm L}$) extending upward from top plate to knurled quick-release coupling.
- **Kinematic Immersion Coordinates (Relative to Beaker Liquid at $Y = 138.0\text{ mm}$)**:
  - Top Dead Center (TDC, stroke peak): Bottom mesh at $Y = 106.5\text{ mm}$ ($31.5\text{ mm}$ below fluid surface, satisfying $\ge 15.0\text{ mm}$ compendial rule).
  - Bottom Dead Center (BDC, stroke bottom): Bottom mesh at $Y = 51.5\text{ mm}$ ($25.5\text{ mm}$ above beaker bottom, satisfying $\ge 25.0\text{ mm}$ compendial rule).
  - Tube Tops: Always remain $\ge 20.0\text{ mm}$ above fluid level throughout the entire stroke.

### 2.5 Operator Console & Displays (`UI_LCD, Btn_*`)
- **Sloped Console Face**:
  - Located on the upper angled brow of the upright tower ($Z \in [-10.0\text{ mm}, +40.0\text{ mm}]$, $Y \in [480.0\text{ mm}, 580.0\text{ mm}]$).
  - Incline Angle: $22.5^\circ$ back from vertical for natural seated operator sightlines.
- **LCD Display (`UI_LCD`)**:
  - Seated in carved recessed pocket: $132.0\text{ mm W} \times 68.0\text{ mm H} \times 3.0\text{ mm}$ depth.
  - Quad size: $128.0\text{ mm W} \times 64.0\text{ mm H}$.
  - Position: Centered at $X = 0.0\text{ mm}, Y = 535.0\text{ mm}$.
  - Positive Z clearance over pocket back: $+0.4\text{ mm}$.
- **Tactile Keypad Buttons (`Btn_Start`, `Btn_Stop`, `Btn_Temp`, `Btn_Time`, `Btn_Lift`)**:
  - 5 primary control keys seated in dedicated bezel pockets below the display.
  - Keycap size: $22.0\text{ mm W} \times 16.0\text{ mm H} \times 3.5\text{ mm}$ thickness with $0.8\text{ mm}$ chrome bevel.
  - Spacing: $30.0\text{ mm}$ pitch ($8.0\text{ mm}$ physical separation, well exceeding the $\ge 3.5\text{ mm}$ rule).
- **Brand Certification Badge (`Badge_SREdesigns`)**:
  - Placed on the **lower frame** (bottom-left corner of the main chassis).
  - Coordinates: $X = -170.0\text{ mm}, Y = 35.0\text{ mm}, Z = -198.5\text{ mm}$.
  - Dimensions: $50.0\text{ mm W} \times 18.0\text{ mm H} \times 1.2\text{ mm}$ relief, facing $-Z$.
