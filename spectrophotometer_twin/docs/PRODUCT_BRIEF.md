# Product Brief — UV-Vis Spectrophotometer Twin

## 1. Executive Summary

- **Package:** `spectrophotometer_twin`
- **Machine Name:** UV-1900i Dual-Beam UV-Vis Spectrophotometer
- **Category:** Analytical Instrumentation (Zone C)
- **Primary Archetype:** Shimadzu UV-1900i / Agilent Cary 3500 / Thermo Scientific Genesys 150
- **Purpose:** Interactive 3D physical digital twin for university-level chemistry education, teaching spectrophotometry, Beer-Lambert quantitative analysis ($A = \varepsilon b c$), monochromator optical kinematics, and wavelength spectral scanning (190–1100 nm).

---

## 2. Key Physical Features

1. **Benchtop Chassis (`Body_Chassis`)**:
   - Die-cast structural polyurethane/aluminum housing with chamfered front fascia.
   - Recessed mounting bezel containing a 7-inch color graphic capacitive touchscreen display (`UI_LCD`).
   - SREdesigns brand emblem (`Badge_SREdesigns`) seated in flush front pocket.
2. **Sample Compartment (`Pivot_ChamberLid`)**:
   - Light-tight, spring-hinged sample chamber lid with ergonomic finger latch.
   - Microswitch interlock detecting open state to protect optical detector and operator from stray light.
   - 6-position motorized cuvette changer carousel (`Pivot_CellCarousel`) housing standard 10 mm optical pathlength cuvettes (`Glass_Cuvette`).
3. **Internal Optical Assembly**:
   - Dual light sources: Deuterium lamp (190–340 nm, UV) and Tungsten-Halogen lamp (340–1100 nm, Vis).
   - Sealed Czerny-Turner monochromator grating driven by precision stepper motor.
   - Beam splitter and optical beam path passing through the active sample cuvette.
   - Low-noise silicon photodiode / PMT optical detector bay.
4. **Fasteners & Connectors**:
   - Genuine 3D DIN 912 hex socket screws (`Fastener_HexM4_*`) and DIN 125 washers throughout.
   - Threaded leveling feet (`Foot_Leveling_*`) resting cleanly on the datum bench.
   - Rear bulkhead with IEC C14 power inlet, rocker switch, USB-A, USB-B, RS-232 DB9, and BNC trigger.

---

## 3. Metrological & Control Specifications

- **Wavelength Range:** 190.0 to 1100.0 nm (0.1 nm display step).
- **Spectral Bandwidth:** 1.0 nm.
- **Photometric Range:** Absorbance: -0.500 to +4.000 AU; Transmittance: 0.0% to 400.0% T.
- **Wavelength Scan Speeds:** 100 to 24,000 nm/min.
- **Measurement Modes:**
  - **Photometric (Fixed $\lambda$):** Instantaneous Absorbance / Transmittance / Concentration.
  - **Spectrum Scan:** Continuous wavelength sweep with live canvas spectrum plotting.
  - **Kinetics:** Time-course monitoring ($\Delta A / \Delta t$) for reaction rate constant determination.
  - **Multi-Cell Automation:** Automatic indexing through cuvette slots 1–6.
