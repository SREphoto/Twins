# FTIR Spectrometer Digital Twin

Interactive 3D physical digital twin of a laboratory Fourier-Transform Infrared (FTIR) Spectrometer (FTIR-7000x / Nicolet iS50 class) featuring a Michelson voice-coil interferometer, HeNe laser phase-lock reference (632.8 nm), monolithic Type IIa diamond ATR sampling station with calibrated slip-clutch pressure tower, dynamic FFT spectrum generation (4000–400 cm⁻¹), and authentic organic chemistry analytical standards.

## Quick Start

### Standalone Package Viewer
```bash
./scripts/serve.sh
# http://127.0.0.1:8765/viewer/
```

### Run Unit Tests
```bash
./scripts/test.sh
```

### Master Lab Desk
From the Twins root:
```bash
./scripts/serve.sh
# http://127.0.0.1:8765/lab_viewer/
```
Select "FTIR Spectrometer" from the instrument catalog dropdown.
