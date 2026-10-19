# Metrohm 901 Titrando & 800 Dosino Karl Fischer Moisture Titrator

## 1. Instrument Overview & Technical Heritage

The **Metrohm 901 Titrando** is the global benchmark for volumetric Karl Fischer titration in pharmaceutical QA/QC, chemical manufacturing, and contract analytical research. Paired with the revolutionary **800 Dosino** top-mounted dispensing drive and the **803 Ti Stand / 801 Magnetic Stirrer**, the system eliminates air-locking, reagent crystal fouling, and ambient moisture intrusion.

### Key Functional Systems
1. **800 Dosino Buret Drive**: Unlike traditional piston burets that mount below the reagent bottle and require long intake hoses prone to bubble formation, the 800 Dosino mounts directly upside-down onto the GL45 neck of the brown glass titrant reservoir. The motor drives an internal precision ground borosilicate piston downwards to aspirate and upwards to dose, with an automated 4-port ceramic disk valve.
2. **Titration Cell & Electrode Station**: Borosilicate cell ($50\text{--}150\text{ mL}$) seated on an integrated magnetic stirrer base. Hermetically sealed with ground glass joints (ST 14/15) and PTFE sealing sleeves.
3. **Double-Platinum Pin Electrode**: Polarizable bi-amperometric electrode (`Metrohm 6.0338.100`) applying a stabilized AC or DC polarization current ($I_{pol} = 10\text{--}50\ \mu\text{A}$) across dual high-purity platinum pins.
4. **Moisture Trapping Train**: Multi-stage desiccator tubes packed with $3\text{Å}$ molecular sieves and self-indicating silica gel preventing atmospheric moisture from penetrating the reagent reservoir and cell.

---

## 2. Chemical Stoichiometry & Mathematical Physics

### 2.1 The Two-Step Karl Fischer Reaction
In methanol ($\text{CH}_3\text{OH}$) or modern non-toxic alcoholic solvents:

$$\text{CH}_3\text{OH} + \text{SO}_2 + \text{Base} \longrightarrow [\text{BaseH}][\text{SO}_3\text{CH}_3]$$

$$[\text{BaseH}][\text{SO}_3\text{CH}_3] + \text{H}_2\text{O} + \text{I}_2 + 2\,\text{Base} \longrightarrow [\text{BaseH}][\text{SO}_4\text{CH}_3] + 2\,[\text{BaseH}]\text{I}$$

Here, exactly $1\text{ mole of }\text{H}_2\text{O}$ reacts stoichiometrically with $1\text{ mole of }\text{I}_2$.

### 2.2 Volumetric Calculation & Drift Compensation
The total water content in the sample is calculated via:

$$W_{H_2O} (\text{mg}) = \left( V_{\text{consumed}} - V_{\text{blank}} \right) \cdot T - \left( \text{Drift} \cdot \Delta t \right)$$

Where:
- $V_{\text{consumed}}$ is the total titrant dosed by the Dosino ($\text{mL}$).
- $T$ is the titrant titer ($\text{mg } H_2O / \text{mL}$ titrant, typically $5.000\text{ mg/mL}$ for Hydranal-Composite 5).
- $\text{Drift}$ is the continuous background ambient moisture leak rate ($\mu\text{g } H_2O / \text{min}$), tracked dynamically before sample injection.
- $\Delta t$ is the titration duration ($\text{min}$).

### 2.3 Bipotentiometric Endpoint Detection
During titration under constant $I_{pol} = 20\ \mu\text{A}$:
- **Pre-equivalence**: Excess water is present; free iodine is immediately reduced to iodide:
  $$\text{I}_2 + \text{H}_2\text{O} \longrightarrow 2\text{I}^-$$
  The solution lacks the reversible redox couple $\text{I}_2 / \text{I}^-$. The potential across the platinum pins remains elevated ($U \ge 400\text{--}650\text{ mV}$).
- **Equivalence Point**: The last trace of water is oxidized. The first microscopic excess of unreacted $\text{I}_2$ ($< 10^{-5}\text{ M}$) completes the reversible pair with $\text{I}^-$.
- Rapid electrochemical depolarization occurs; the potential difference collapses:
  $$U \le U_{\text{threshold}} \approx 100\text{ mV}$$
  The titrator recognizes the endpoint when potential stays below $U_{\text{threshold}}$ for the programmed stop time ($t_{\text{stop}} = 15\text{ s}$).

---

## 3. Physical Dimensions & Mechanical Anatomy

| Component | Dimensions ($W \times D \times H$ mm) | Material | Mass (kg) |
| :--- | :--- | :--- | :--- |
| **Main Chassis (901 Titrando)** | $142 \times 231 \times 227$ | Polyurethane/PBT unibody | $3.8\text{ kg}$ |
| **803 Ti Stand & 801 Stirrer** | $150 \times 220 \times 65$ base; $350$ rod | Cast aluminum + 304SS rod | $2.4\text{ kg}$ |
| **Reagent Reservoir (1000 mL)** | $\varnothing 101 \times 225$ | Amber borosilicate 3.3 | $0.55\text{ kg}$ |
| **800 Dosino Dispensing Unit** | $\varnothing 48 \times 150$ | PEEK, PVDF, 316SS, ceramic | $0.75\text{ kg}$ |
| **Titration Cell (100 mL)** | $\varnothing 65 \times 110$ | Clear borosilicate 3.3 | $0.22\text{ kg}$ |
| **Double-Pt Electrode (6.0338.100)** | $\varnothing 12 \times 120$ | Glass, 99.99% Pt, gold pins | $0.05\text{ kg}$ |
| **Molecular Sieve Drying Tube** | $\varnothing 25 \times 110$ | Borosilicate 3.3 + 3Å zeolites | $0.08\text{ kg}$ |
| **Duplex Outlet Box** | $54 \times 72 \times 36$ | Cast aluminum, brushed 304SS | $0.35\text{ kg}$ |
| **Total Workstation Assembly** | $390 \times 320 \times 440$ envelope | Complete integrated twin | $8.2\text{ kg}$ |
