# Bill of Materials — Vacuum Pump (Diaphragm)

Based on KNF Laboport N820. For digital twin component identification and maintenance training.

## System Overview

1. **Pump Head** — Diaphragm, valves, head body (×2 heads)
2. **Drive Mechanism** — Motor, shaft, eccentric cams, connecting rods
3. **Housing** — Enclosure, carry handle, feet
4. **Controls** — Switch, gas ballast, gauge, LED
5. **Electronics** — Power supply, motor controller, EMI filter
6. **Accessories** — Muffler, inlet fittings, exhaust system

## 1. Pump Head Assembly (×2)

| Item                  | Qty    | Description                            | Material         | Dimensions  | Notes                                 |
| --------------------- | ------ | -------------------------------------- | ---------------- | ----------- | ------------------------------------- |
| Head cover            | 2      | Cylindrical head with gas channels     | PTFE/PVDF        | Ø56 × 16 mm | Contains inlet/outlet ports           |
| Diaphragm             | 2      | Convoluted reciprocating diaphragm     | PTFE-coated EPDM | Ø50 × 4 mm  | Chemical resistant, 3000–5000 hr life |
| Intermediate plate    | 2      | Valve seat plate with gas ballast path | PTFE             | Ø56 × 12 mm | Houses poppet valve seats             |
| Inlet valve (poppet)  | 2      | Conical spring-loaded check valve      | FFPM             | Ø10 × 3 mm  | Intake control                        |
| Outlet valve (poppet) | 2      | Conical spring-loaded check valve      | FFPM             | Ø10 × 3 mm  | Discharge control                     |
| Pressure plate        | 2      | Clamping plate for diaphragm           | Aluminum         | Ø50 × 3 mm  | Distributes clamping force            |
| Central screw         | 2      | Socket head cap screw                  | Steel (M4)       | M4 × 25 mm  | Clamps pressure plate                 |
| Locating pin          | 2      | Alignment dowel pin                    | Steel            | Ø2.8 × 8 mm | Aligns head cover                     |
| Shim rings            | 2 sets | Depth-adjustment washers               | Steel            | Ø12 × 1 mm  | Minimizes dead clearance              |
| O-ring (head seal)    | 2      | Diaphragm clamp joint seal             | FFPM/Viton       | Ø52 × 2 mm  | Replace annually                      |

## 2. Drive Mechanism

| Item                       | Qty | Description                       | Material    | Dimensions      | Notes                 |
| -------------------------- | --- | --------------------------------- | ----------- | --------------- | --------------------- |
| Motor (BLDC)               | 1   | Brushless DC, 60–80W              | —           | Ø84 × 90 mm     | 24 VDC, 1500–3000 rpm |
| Motor cooling fan          | 1   | Axial fan on motor shaft          | Plastic     | Ø60 mm          | Self-ventilated       |
| Shaft coupling (motor)     | 1   | Coupling half, motor side         | Aluminum    | Ø24 × 15 mm     | —                     |
| Shaft coupling (eccentric) | 1   | Coupling half, shaft side         | Aluminum    | Ø24 × 15 mm     | —                     |
| Coupling spider            | 1   | Elastomer insert                  | Rubber      | Ø23 × 6 mm      | Vibration damping     |
| Central rotor shaft        | 1   | Drive shaft through both heads    | Steel       | Ø12 × 130 mm    | Runs along Y axis     |
| Eccentric cam (front)      | 1   | Offset cam, +4mm Z                | Steel       | Ø28 × 12 mm     | 4 mm offset           |
| Eccentric cam (back)       | 1   | Offset cam, -4mm Z                | Steel       | Ø28 × 12 mm     | 4 mm offset           |
| Needle bearing (front)     | 1   | Roller bearing on front eccentric | Steel       | Ø16 × 8 × 10 mm | —                     |
| Needle bearing (back)      | 1   | Roller bearing on back eccentric  | Steel       | Ø16 × 8 × 10 mm | —                     |
| Connecting rod (front)     | 1   | Eccentric-to-diaphragm link       | Steel       | 10 × 6 × ~75 mm | Counter-phase         |
| Connecting rod (back)      | 1   | Eccentric-to-diaphragm link       | Steel       | 10 × 6 × ~75 mm | Counter-phase         |
| Thrust bearing (front)     | 1   | Between rod and diaphragm         | Brass/Steel | Ø20 × 10 × 2 mm | —                     |
| Thrust bearing (back)      | 1   | Between rod and diaphragm         | Brass/Steel | Ø20 × 10 × 2 mm | —                     |
| Motor bracket              | 1   | Mounting plate for motor          | Aluminum    | 100 × 4 × 90 mm | —                     |

## 3. Housing & Enclosure

| Item          | Qty | Description         | Material      | Dimensions         | Notes               |
| ------------- | --- | ------------------- | ------------- | ------------------ | ------------------- |
| Lower housing | 1   | Main body shell     | ABS plastic   | 160 × 120 × 130 mm | Dark gray, textured |
| Upper housing | 1   | Top cover           | ABS plastic   | 160 × 120 × 60 mm  | Dark gray, textured |
| Carry handle  | 1   | Top-mounted handle  | Plastic/metal | 200 × 30 × 15 mm   | —                   |
| Rubber feet   | 4   | Anti-vibration pads | Rubber        | Ø20 × 15 mm        | —                   |
| Exhaust grill | 1   | Hex mesh rear cover | Steel         | 42 × 2 × 32 mm     | Painted black       |
| Cable clip    | 2   | Cable management    | ABS           | 8 × 8 × 6 mm       | —                   |

## 4. Controls & Display

| Item                | Qty | Description             | Dimensions           | Notes                 |
| ------------------- | --- | ----------------------- | -------------------- | --------------------- |
| Power switch        | 1   | Toggle or rocker switch | 20 × 12 × 15 mm      | Front panel           |
| Gas ballast knob    | 1   | Knurled rotary knob     | Ø20 × 10 mm          | Front panel           |
| Vacuum gauge        | 1   | Bourdon tube, analog    | Ø50 dial, 0–760 mmHg | Angled front panel    |
| Status LED          | 1   | Green LED               | Ø6 × 3 mm            | Power indicator       |
| Speed potentiometer | 1   | 10kΩ rotary pot         | Ø10 × 12 mm          | Upper deck (optional) |

## 5. Electronics

| Item               | Qty | Description                  | Dimensions      | Notes                 |
| ------------------ | --- | ---------------------------- | --------------- | --------------------- |
| AC-DC power supply | 1   | 100–240VAC → 24VDC           | 80 × 60 × 28 mm | 100–120W              |
| Motor controller   | 1   | BLDC 3-phase driver          | 60 × 50 × 15 mm | Hall sensor input     |
| EMI filter         | 1   | Single-stage line filter     | 45 × 30 × 22 mm | EN 55011 Class B      |
| IEC C14 inlet      | 1   | Power inlet with fuse holder | 48 × 24 × 28 mm | Rear panel            |
| Fuse               | 1   | T2A, 250V, 5×20mm            | 5 × 20 mm       | Time-delay glass tube |

## 6. Accessories & Fittings

| Item             | Qty | Description                  | Material       | Dimensions      | Notes                       |
| ---------------- | --- | ---------------------------- | -------------- | --------------- | --------------------------- |
| Inlet port       | 1   | KF25 quick-release flange    | PVDF/Stainless | Ø25 mm bore     | Front panel                 |
| Exhaust silencer | 1   | Cylindrical sintered muffler | Sintered metal | Ø28 × 40 mm     | Rear panel                  |
| Exhaust gasket   | 1   | Annular seal ring            | Rubber         | Ø30 × 2 mm      | Between housing and muffler |
| Drip tray        | 1   | Condensate catch             | Plastic        | 35 × 25 × 10 mm | Below exhaust               |
| Connecting tube  | 1   | Inter-head gas connection    | PTFE           | Ø8 × 96 mm      | Between pump heads          |
| Power cord       | 1   | Line cord with C13 connector | —              | 2m typical      | Detachable                  |

## 7. Fasteners & Hardware

| Item             | Qty | Description           | Size       | Notes                         |
| ---------------- | --- | --------------------- | ---------- | ----------------------------- |
| Head cover screw | 8   | Socket head cap screw | M4 × 20 mm | 4 per head, torque 2.0–3.0 Nm |
| Central screw    | 2   | Socket head cap screw | M4 × 25 mm | 1 per head, torque 2.5–3.5 Nm |
| Housing screw    | 8   | Self-tapping screw    | M4 × 12 mm | Housing split line            |
| Motor bolt       | 4   | Hex head bolt         | M5 × 16 mm | Motor to bracket              |
| Gauge fitting    | 1   | NPT adapter           | 1/8" NPT   | Gauge connection              |

## Estimated Replacement Part Numbers

| Component          | Estimated Part #            | Source                                         |
| ------------------ | --------------------------- | ---------------------------------------------- |
| Diaphragm (N820)   | KNF 020279                  | KNF spare parts                                |
| Valve set (N820)   | KNF 020280                  | KNF spare parts                                |
| O-ring set (N820)  | KNF 020281                  | KNF spare parts                                |
| Rebuild kit (N820) | KNF 020282                  | KNF spare parts (diaphragm + valves + O-rings) |
| Motor (N820)       | KNF 020283                  | KNF spare parts                                |
| Vacuum gauge       | Generic 50mm Bourdon        | Various suppliers                              |
| Power supply       | Mean Well RS-100-24         | Mean Well (equivalent)                         |
| EMI filter         | Schaffner FN2010-2-06       | Schaffner (equivalent)                         |
| Inlet port KF25    | KF25 centering ring + clamp | Vacuum components suppliers                    |
| Exhaust muffler    | Sintered silencer Ø28       | Various suppliers                              |

**Note**: Part numbers are estimated based on typical KNF numbering patterns. Verify with KNF directly for exact
numbers.
