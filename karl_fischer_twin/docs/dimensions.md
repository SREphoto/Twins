# Karl Fischer Titrator Dimensional Specifications & Spatial Layout

All dimensions are in millimeters ($1\text{ unit} = 1\text{ mm}$ in CAD, scaled $\times 0.1$ or $0.01$ as standard in Three.js).

---

## 1. Primary Structural Enclosure (901 Titrando Main Console)

- **Width ($X$)**: $142.0\text{ mm}$
- **Depth ($Z$)**: $231.0\text{ mm}$
- **Height ($Y$)**: $227.0\text{ mm}$
- **Housing Material**: Flame-retardant structural polyurethane / PBT casting with textured medical gray polyurethane coat (`#e6e8eb`).
- **Bezel Recesses**:
  - Touchscreen Display Recess: $118.0\text{ mm W} \times 92.0\text{ mm H}$, recessed $3.5\text{ mm}$ into sloped front upper face.
  - SREdesigns Brand Badge Recess: $42.0\text{ mm W} \times 14.0\text{ mm H}$, recessed $1.5\text{ mm}$ on front lower chin.
  - MSB (Metrohm Serial Bus) & Sensor Port Recess: Rear connector plate recessed $4.0\text{ mm}$.
- **Leveling Feet**: 4 vulcanized nitrile rubber leveling feet at corners, resting at $Y = 0.0\text{ mm}$ (bench datum).

---

## 2. Integrated Stand & Stirrer (803 Ti Stand + 801 Magnetic Stirrer)

- **Stand Base Width ($X$)**: $150.0\text{ mm}$
- **Stand Base Depth ($Z$)**: $220.0\text{ mm}$
- **Stand Base Height ($Y$)**: $58.0\text{ mm}$
- **Magnetic Stirrer Plate**: Centered at $(X = 145.0, Z = 30.0)$, stainless steel rim $\varnothing 90.0\text{ mm}$ with chemical-resistant white ceramic inlay.
- **Stand Vertical Rod**: 304 stainless steel solid rod $\varnothing 12.0\text{ mm} \times 350.0\text{ mm H}$.
- **Clamp & Cell Support Ring**: Anodized aluminum clamping bracket holding titration vessel securely over the magnetic plate.

---

## 3. Reagent Reservoir & 800 Dosino Dispensing Drive

- **Reagent Bottle**:
  - Amber borosilicate 3.3 laboratory bottle (1000 mL).
  - Diameter: $\varnothing 101.0\text{ mm}$
  - Height to shoulder: $175.0\text{ mm}$
  - Neck thread: Standard GL45 ($\varnothing 45.0\text{ mm} \times 25.0\text{ mm H}$).
  - Total bottle height: $225.0\text{ mm}$
- **800 Dosino Drive Unit**:
  - Direct mount onto bottle GL45 cap with locking collar ring.
  - Housing cylinder: $\varnothing 48.0\text{ mm} \times 150.0\text{ mm H}$
  - Integrated 4-port switching disk valve at top: $\varnothing 56.0\text{ mm} \times 28.0\text{ mm H}$.
  - Micro-stepper linear stroke: $0\text{ to }75.0\text{ mm}$ internal vertical travel ($10,000\text{ steps}$).
  - Dispensing capillary: Fluorinated ethylene propylene (FEP) tubing $\varnothing 2.0\text{ mm OD} \times 1.0\text{ mm ID} \times 320.0\text{ mm L}$ routed from Dosino Port 1 to the vessel dosing tip.

---

## 4. Borosilicate Titration Cell & Electrode Assembly

- **Titration Vessel**:
  - Clear borosilicate 3.3 cylindrical beaker with flat optical bottom.
  - Outer Diameter: $\varnothing 65.0\text{ mm}$
  - Inner Diameter: $\varnothing 60.0\text{ mm}$ (wall thickness $2.5\text{ mm}$)
  - Vessel Height: $110.0\text{ mm}$
  - Working volume: $20\text{ to }70\text{ mL}$
- **Vessel Multi-Port Sealing Cover (PTFE Head)**:
  - Outer diameter $\varnothing 75.0\text{ mm} \times 24.0\text{ mm H}$ with viton O-ring seal.
  - Five ground joint ports (ST 14/15 taper):
    1. Center Port: Electrode insert.
    2. Front-Right Port: Antidiffusion dosing tip.
    3. Rear-Right Port: Glass drying tube ($\varnothing 24.0\text{ mm} \times 110.0\text{ mm H}$) filled with blue/orange 3Å molecular sieve spheres.
    4. Front-Left Port: Septum injection screw cap ($\varnothing 18.0\text{ mm}$) with PTFE-faced silicone septum.
    5. Rear-Left Port: Waste siphon port with PTFE stopcock.
- **Double-Platinum Pin Electrode (Metrohm 6.0338.100)**:
  - Shaft: Borosilicate glass $\varnothing 12.0\text{ mm} \times 120.0\text{ mm L}$ with ground taper ST 14/15.
  - Platinum Pins: Twin parallel pins of 99.99% pure platinum, each $\varnothing 1.0\text{ mm} \times 12.0\text{ mm L}$, spaced $4.0\text{ mm}$ apart at bottom.
  - Top connector: Molded blue head with gold-plated coaxial BNC socket.

---

## 5. Bench Power Duplex Box & Cord

- **Duplex Box (`Power_Receptacle_Duplex`)**: $54.0\text{ mm W} \times 72.0\text{ mm D} \times 36.0\text{ mm H}$ cast aluminum junction box seated at datum $Y = 0$.
- **Receptacle Faceplate**: Brushed stainless steel with dual NEMA 5-15R ports (ground pin UP).
- **Power Plug**: Molded NEMA 5-15P 3-prong plug with strain relief boot.
- **Power Cord**: Black neoprene jacketed SJTOW 3-wire cord ($\varnothing 8.5\text{ mm}$), natural catenary curvature to rear power socket.
