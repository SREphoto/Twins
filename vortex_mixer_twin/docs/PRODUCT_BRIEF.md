# Vortex Mixer Digital Twin — Product Brief & Objectives

## 1. Executive Summary & Purpose
The **Vortex Mixer Digital Twin** (`vortex_mixer_twin`) is a Tier-1 research-grade laboratory instrument simulation engineered for ChemMate's virtual chemistry ecosystem. Based on the industrial lineage of the **Scientific Industries Vortex-Genie 2 Digital** and **IKA MS 3 Digital**, this twin combines an indestructible die-cast zinc unibody chassis with microprocessor-controlled digital precision (exact RPM tachometer, digital countdown timer, programmable pulse agitation, and real-time Navier-Stokes rotational liquid vortex mechanics).

## 2. Core Educational & Laboratory Objectives
1. **Quantitative Protocol Reproducibility**: Teach students and research trainees the critical distinction between qualitative mixing (arbitrary 1–10 dial) and validated GLP/GMP digital operating procedures (e.g. 2,400 RPM for 30 s).
2. **Fluid Vortex Dynamics**: Demonstrate centrifugal forced-vortex behavior ($z \propto \omega^2 r^2 / 2g$) and the impact of dynamic liquid viscosity (water vs ethanol vs 50% glycerol) on meniscus depression and homogenization efficiency.
3. **Ergonomics & Operating Modes**: Master hands-on tactile touch-start operation (downward pressure triggering) versus hands-free continuous runs and pulse intervals for pellet resuspension.
4. **GLP Run Logging**: Generate validated electronic batch records documenting run duration, mean speed, sample identity, and compliance timestamps.

## 3. High-Fidelity Engineering Pillars
- **Zero-Defect Dimensional Discipline**: Strict adherence to the $122.0\text{ mm} \times 165.0\text{ mm} \times 165.0\text{ mm}$ bounding box under Dimensional Freeze (Code 4771-CAD) with Tabletop Datum $Y = 0$.
- **Exhaustive Procedural CAD**: 100% Three.js procedural solids, genuine DIN 912 fasteners, vulcanized elastomeric suction cup feet, and carved $2.0\text{ mm}$ recessed console bezel.
- **Microprocessor State Engine**: Decoupled Python controller with motor inertia ramping, thermal duty tracking, and 100% test coverage.
- **Dynamic Offscreen Canvas LCD**: High-DPI digital CanvasTexture (`flipY = false`) rendering live digital tachometer, run timer, and pulse status.
