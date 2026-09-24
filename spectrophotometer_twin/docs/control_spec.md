# Control Specification — UV-Vis Spectrophotometer

Defines the mathematical modeling, state machine transitions, interlocks, and control algorithms for `spectrophotometer_twin`.

---

## 1. Physical Principles & Mathematical Models

### A. Beer-Lambert Law

Absorbance $A$ is related to sample properties:
$$A = \varepsilon \cdot b \cdot c$$
Where:
- $\varepsilon$ is the molar extinction coefficient ($L \cdot mol^{-1} \cdot cm^{-1}$) at wavelength $\lambda$.
- $b$ is the optical pathlength ($1.0\text{ cm}$).
- $c$ is the analyte concentration ($mol \cdot L^{-1}$).

Transmittance $T$ and percent transmittance $\%T$:
$$T = 10^{-A} = \frac{I}{I_0}, \quad \%T = 100 \times 10^{-A}$$
$$A = -\log_{10}(T) = 2 - \log_{10}(\%T)$$

### B. Analytical Sample Spectra Models

The twin includes analytical absorption Gaussian peak profiles for 5 standard reagents:

1. **Cell 1: Blank / Solvent ($H_2O$)**
   $$A(\lambda) \approx 0.000 \pm 0.001$$
2. **Cell 2: Potassium Permanganate ($KMnO_4$)**
   - Visible purple solution with vibronic fine structure:
   - Primary peak $\lambda_{max} = 525.0\text{ nm}$ ($\varepsilon \approx 2380$), secondary peaks at $508\text{ nm}$ and $546\text{ nm}$.
3. **Cell 3: Calf Thymus DNA (Oligonucleotide)**
   - UV absorbing aromatic heterocyclic bases (adenine, guanine, cytosine, thymine):
   - Strong absorbance peak $\lambda_{max} = 260.0\text{ nm}$, trough at $230\text{ nm}$, $A_{260}/A_{280} \approx 1.85$.
4. **Cell 4: Bovine Serum Albumin (BSA) with Coomassie Blue (Bradford Assay)**
   - Dye-binding protein complex:
   - Peak $\lambda_{max} = 595.0\text{ nm}$.
5. **Cell 5: Methylene Blue Dye**
   - Cationic thiazine dye:
   - Intense peak at $\lambda_{max} = 664.0\text{ nm}$ with dimer shoulder at $612\text{ nm}$.

### C. Wavelength to RGB Beam Color Conversion

To render genuine visual feedback of the monochromatic light beam passing through the cuvette:
- $\lambda < 380\text{ nm}$ (UV): Invisible/fluorescent violet glow (`#8b5cf6`, high-energy ultraviolet).
- $380 \le \lambda < 440\text{ nm}$: Deep violet.
- $440 \le \lambda < 490\text{ nm}$: Blue.
- $490 \le \lambda < 510\text{ nm}$: Cyan.
- $510 \le \lambda < 580\text{ nm}$: Green.
- $580 \le \lambda < 645\text{ nm}$: Yellow/Amber.
- $645 \le \lambda \le 750\text{ nm}$: Deep red.
- $\lambda > 750\text{ nm}$ (NIR): Faint infrared deep maroon.

---

## 2. State Machine

```
[POWER_OFF] ──(Power On)──> [INITIALIZING] ──(Selftest Complete)──> [READY]
                                                                      │
     ┌───────────────────┬───────────────────┬────────────────────────┼────────────────────────┐
     ▼                   ▼                   ▼                        ▼                        ▼
[MEASURING]         [SCANNING]          [ZEROING]               [CELL_INDEXING]          [FAULT_LID_OPEN]
(Fixed λ read)     (Spectrum sweep)   (Blank baseline)        (Advance carousel)       (Lid open interlock)
```

### State Definitions

- `POWER_OFF`: Unit powered down. LCD black, lamps off, beam extinguished.
- `INITIALIZING`: Internal selftest; grating home calibration; D2/Tungsten warmup sequence (~2 s in simulator).
- `READY`: Monochromator parked at target wavelength; lamps active; ready for command.
- `MEASURING`: Performing photometric read at current fixed $\lambda$.
- `SCANNING`: Monochromator grating stepping continuously from $\lambda_{start}$ to $\lambda_{end}$; spectra rendered live onto canvas.
- `ZEROING`: Acquires $I_0$ baseline with reference cell, setting $A = 0.000$ AU ($100.0\% T$).
- `CELL_INDEXING`: Motorized carousel rotates to user-selected cell position (1–6).
- `FAULT_LID_OPEN`: Safety interlock state. Triggered when `Pivot_ChamberLid` is open ($> 5^\circ$). High-intensity beam shutter closes to prevent PMT saturation and stray ambient light corruption.
