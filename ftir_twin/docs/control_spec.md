# Control Specification — FTIR Spectrometer

Defines the mathematical modeling, state machine transitions, interlocks, and control algorithms for `ftir_twin`.

---

## 1. Physical Principles & Mathematical Models

### A. Michelson Interferometer & Optical Path Difference (OPD)

The core optical component is a two-beam Michelson interferometer:
- A collimated infrared beam from a ceramic source ($1200\ ^\circ\text{C}$ Polaris Ever-Glo) strikes a 50:50 beam splitter (KBr coated with Ge).
- Half the beam reflects to a fixed mirror; half transmits to a moving mirror mounted on an electromagnetic voice-coil linear motor.
- When the moving mirror translates by distance $x$, the optical path difference is:
  $$\delta = 2x$$
- For monochromatic light of wavenumber $\bar{\nu}$ ($\text{cm}^{-1}$), the modulated intensity at the detector is:
  $$I(\delta) = 0.5 \cdot I(\bar{\nu}) \cdot [1 + \cos(2\pi \bar{\nu} \delta)]$$
- For polychromatic broadband infrared light, the interferogram is the integral:
  $$I(\delta) = \int_{0}^{\infty} B(\bar{\nu}) \cdot \cos(2\pi \bar{\nu} \delta) \, d\bar{\nu}$$
  At $\delta = 0$ (Zero Path Difference, ZPD), all wavelengths constructively interfere, creating a massive **centerburst**.

### B. Fast Fourier Transform (FFT) & Single-Beam Spectrum

The raw interferogram $I(\delta)$ collected in the time/distance domain is transformed into the frequency/wavenumber domain spectrum $B(\bar{\nu})$ via continuous cosine Fourier inversion:
$$B(\bar{\nu}) = \int_{-\infty}^{+\infty} [I(\delta) - I(\infty)] \cdot \cos(2\pi \bar{\nu} \delta) \, d\delta$$

### C. Background Subtraction & Transmittance / Absorbance

To eliminate instrumental response (source emission curve, beam splitter transmission, detector sensitivity, and atmospheric $H_2O$ and $CO_2$ vapor lines):
1. **Background Spectrum** $I_0(\bar{\nu})$ is collected on a clean diamond crystal.
2. **Sample Spectrum** $I(\bar{\nu})$ is collected with analyte on the diamond.
3. Transmittance:
   $$\%T(\bar{\nu}) = \frac{I(\bar{\nu})}{I_0(\bar{\nu})} \times 100\%$$
4. Absorbance:
   $$A(\bar{\nu}) = -\log_{10}\left(\frac{\%T(\bar{\nu})}{100}\right) = 2 - \log_{10}(\%T(\bar{\nu}))$$

### D. Attenuated Total Reflection (ATR) Evanescent Wave Physics

The beam undergoes Total Internal Reflection (TIR) inside the monolithic Type IIa diamond prism ($n_1 = 2.417$) at angle $\theta = 45^\circ$, higher than the critical angle:
$$\theta_c = \arcsin\left(\frac{n_2}{n_1}\right) \approx \arcsin\left(\frac{1.4}{2.417}\right) \approx 35.4^\circ$$
An evanescent electromagnetic wave penetrates into the sample with depth:
$$d_p = \frac{\lambda}{2\pi \sqrt{n_1^2 \sin^2\theta - n_2^2}} \approx 1.0\text{ to }2.0\ \mu\text{m}$$
For solid films and crystals (Polystyrene, Benzoic acid), physical pressure ($\ge 50\text{ N}$) from the slip-clutch clamp tower is essential to ensure optical contact within the sub-micron evanescent zone.

---

## 2. State Machine

```
[POWER_OFF] ──(AC Power On)──> [INITIALIZING] ──(HeNe Lock)──> [READY]
                                                                  │
      ┌──────────────────────────┬────────────────────────────────┼────────────────────────┐
      ▼                          ▼                                ▼                        ▼
[SCAN_BACKGROUND]         [SCAN_SAMPLE]                  [ATR_TOWER_SWIVEL]       [FAULT_UNPLUGGED]
      │                          │                                │                        │
(Store I0 FFT)            (Ratio I / I0)                   (Position Switch)       (Cut V, Displays 0)
      │                          │                                │                        │
      └──────────────────────────┴────────────────────────────────┴────────────────────────┘
                                 ▼
                              [READY]
```
