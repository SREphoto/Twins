# Micro 5424-R Refrigerated Centrifuge — Spoken Presentation Script

**Title**: 10-Chapter Master Operator Experience & Internal Working Anatomy Walkthrough  
**Model**: Micro 5424-R High-Speed Refrigerated Microcentrifuge  
**Rotor**: FA-45-24-11 Aerosol-Tight 24-Place Fixed-Angle Rotor (Max 15,000 RPM / 21,130 ×g)  
**Total Run Duration**: ~3.8 minutes (10 sequential chapters)  
**Voice Profile**: Gemini Flash 3.8 TTS (`voice_r6j5bn13iimw`) / Studio Engineering Cadence (185 wpm)  
**Cadence**: Natural laboratory engineer cadence (~150 words per minute)  
**Audio Stems**: `centrifuge_twin/docs/audio/vo_{0..9}.mp3`

---

## Stage 0: Instrument Overview & Working Principle
* **Chapter Badge**: `STAGE 0 / 10 · OVERVIEW & OPERATION`
* **Scene / Camera Angle**: Sweeping 3/4 Isometric orbit `[4.2, 4.4, -5.4] -> [-0.25, 2.15, -0.1]`, encompassing full laboratory bench, open rotor chamber, tube rack, and front console.
* **Audio Stem**: `centrifuge_twin/docs/audio/vo_0.mp3`
* **Spoken Voiceover**:
> "The Micro fifty-four twenty-four R is a precision benchtop refrigerated microcentrifuge engineered for molecular biology, biochemistry, and clinical diagnostics. Centrifugation separates complex biological mixtures by applying intense centrifugal acceleration thousands of times stronger than Earth gravity. The physical force is governed by relative centrifugal force: one point one one eight times ten to the negative five times rotor radius in centimeters times RPM squared. Spinning at fifteen thousand RPM with an eight point four centimeter radius generates over twenty-one thousand times the force of gravity. Dense particles—such as packed red blood cells, cellular organelles, or precipitated nucleic acids—migrate rapidly outward toward the bottom of each tube, while lighter liquid floats inward. The instrument features a solid aluminum aerosol-tight twenty-four place rotor, an insulated stainless steel refrigeration bowl, a high-torque brushless DC motor, a motorized dual lid latch, and an onboard compressor cooling system that maintains sample temperatures from minus ten to plus forty degrees Celsius."

---

## Stage 1: Powering On & Electrical Continuity
* **Chapter Badge**: `STAGE 1 / 10 · POWER & CONTINUITY`
* **Scene / Camera Angle**: Rear bench electrical focus `[2.5, 3.8, 4.5] -> [0.8, 1.2, 1.2]`, highlighting the bench duplex outlet box, NEMA 5-15P plug, SJTOW cord, and rear rocker switch.
* **Audio Stem**: `centrifuge_twin/docs/audio/vo_1.mp3`
* **Spoken Voiceover**:
> "To power the instrument, the operator connects the heavy-duty SJTOW power cord into the bench duplex receptacle and flips the rear rocker switch. The internal power supply boots, self-test diagnostics verify the motor encoder and temperature sensors, and the console illuminates in standby mode."

---

## Stage 2: Labware & Sample Preparation
* **Chapter Badge**: `STAGE 2 / 10 · LABWARE & SAMPLE PREPARATION`
* **Scene / Camera Angle**: Tube prep rack focus `[-3.8, 3.8, -3.2] -> [-1.6, 1.8, -0.2]`, showing the 24-position polypropylene tube rack with 1.5 mL Eppendorf conical tubes.
* **Audio Stem**: `centrifuge_twin/docs/audio/vo_2.mp3`
* **Spoken Voiceover**:
> "The operator works from a twenty-four position rack loaded with one point five milliliter conical microcentrifuge tubes. Here we prepare whole blood, cell cultures, and buffer reagents. Balancing is essential: every sample tube must be counterbalanced by weight to within zero point one grams to avoid destructive vibration at high speeds."

---

## Stage 3: Rotor Loading & Safety Interlocks
* **Chapter Badge**: `STAGE 3 / 10 · ROTOR LOADING & SAFETY INTERLOCKS`
* **Scene / Camera Angle**: Top-down view into chamber `[0.0, 5.2, -1.8] -> [0.0, 2.3, 0.1]`, showing counterbalanced tubes loading into opposite rotor slots and lid closing.
* **Audio Stem**: `centrifuge_twin/docs/audio/vo_3.mp3`
* **Spoken Voiceover**:
> "Tubes are loaded into diametrically opposite rotor slots—such as positions one and thirteen—maintaining dynamic balance. The aerosol-tight rotor lid is threaded down securely to contain bioaerosols, and the main lid closes until motorized dual safety interlocks latch firmly."

---

## Stage 4: Console Setup & Parameter Programming
* **Chapter Badge**: `STAGE 4 / 10 · CONSOLE SETUP & PROGRAMMING`
* **Scene / Camera Angle**: Angled front console close-up `[-0.5, 2.8, -3.8] -> [-0.2, 1.8, -1.5]`, showing dynamic LCD and tactile rockers.
* **Audio Stem**: `centrifuge_twin/docs/audio/vo_4.mp3`
* **Spoken Voiceover**:
> "On the angled control panel, the operator adjusts parameters: setting speed to fourteen thousand RPM or eighteen thousand times gravity, setting a five-minute spin duration, and selecting four degrees Celsius to protect delicate biomolecules from thermal degradation."

---

## Stage 5: Active High-Speed Spin & Separation Dynamics
* **Chapter Badge**: `STAGE 5 / 10 · ACTIVE RUN & SEPARATION PHYSICS`
* **Scene / Camera Angle**: Spinning rotor bowl view `[1.2, 4.6, -2.4] -> [0.0, 2.3, 0.0]`, showing rotor blur, rising telemetry on LCD, and sample layer stratification.
* **Audio Stem**: `centrifuge_twin/docs/audio/vo_5.mp3`
* **Spoken Voiceover**:
> "Pressing start engages the brushless DC drive motor. As speed ramps to fourteen thousand RPM, centrifugal acceleration deforms the fluid meniscus into a steep parabolic shape. Dense red blood cells pack into the bottom tip, a buffy coat of white cells forms in the middle, and clear plasma separates at the top, while active refrigeration keeps the chamber chilled at four degrees."

---

## Stage 6: Deceleration, Dynamic Braking & GLP Export
* **Chapter Badge**: `STAGE 6 / 10 · DECELERATION & GLP AUDIT EXPORT`
* **Scene / Camera Angle**: Decelerating rotor and lid unlatching `[-1.8, 3.8, -3.4] -> [-0.3, 2.0, -0.5]`, separated tube layers, LCD completion banner.
* **Audio Stem**: `centrifuge_twin/docs/audio/vo_6.mp3`
* **Spoken Voiceover**:
> "At run completion, regenerative electric braking brings the rotor to a smooth stop without disturbing delicate pelleted layers. A chime sounds, the motorized lid unlatches automatically, and the controller saves a GLP-compliant run record and CSV audit trail to memory."

---

## Stage 7A: Internal Power Supply & Electrical Routing
* **Chapter Badge**: `STAGE 7A / 10 · INTERNAL POWER SUPPLY & ROUTING`
* **Scene / Camera Angle**: Exploded cutaway into power bay `[3.4, 2.8, 1.2] -> [0.6, 1.4, 0.2]`, showing IEC inlet, toroidal transformer, switching PSU, and wiring harnesses.
* **Audio Stem**: `centrifuge_twin/docs/audio/vo_7.mp3`
* **Spoken Voiceover**:
> "Inside the rear power bay, electricity enters through the fused IEC socket with line noise filtering. An isolation toroidal transformer and switching power supply board generate regulated DC voltages, while color-coded three-D wiring harnesses deliver high-voltage AC to the compressor and low-voltage power to the motherboard."

---

## Stage 7B: High-Torque Brushless Motor & Refrigeration
* **Chapter Badge**: `STAGE 7B / 10 · BRUSHLESS DC MOTOR & COMPRESSOR`
* **Scene / Camera Angle**: Lower mechanical drive bay `[-2.6, 2.2, 1.6] -> [0.0, 1.2, 0.2]`, showing brushless DC drive motor, vibration dampers, hermetic compressor, and fan.
* **Audio Stem**: `centrifuge_twin/docs/audio/vo_8.mp3`
* **Spoken Voiceover**:
> "The mechanical drive features a heavy-duty three-phase brushless DC motor mounted on elastomeric vibration-isolation dampers beneath the chamber. Beside it, a hermetic refrigeration compressor, copper condenser pack, and a convective blower fan circulate refrigerant to maintain sub-zero bowl temperatures under full aerodynamic drag."

---

## Stage 7C: Main Controller Motherboard & Data Ports
* **Chapter Badge**: `STAGE 7C / 10 · MOTHERBOARD, MCU, WI-FI / BLE & PORTS`
* **Scene / Camera Angle**: Electronics bay and rear bulkhead `[-2.8, 3.2, -1.6] -> [-0.7, 1.5, -0.2]`, showing main PCB, ARM Cortex MCU, RAM, SSD, wireless antenna, optical relay mirror, and rear I/O ports.
* **Audio Stem**: `centrifuge_twin/docs/audio/vo_9.mp3`
* **Spoken Voiceover**:
> "The multi-layer motherboard houses a thirty-two-bit ARM Cortex microprocessor, system RAM, solid-state flash memory, and an optical tachometer relay mirror. Rear bulkhead ports include RS-two-thirty-two serial, USB flash drive, Ethernet LAN, and a wireless module with external dipole antenna for automated lab data management."
