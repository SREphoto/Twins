# Dimensions (v1 — freeze for CAD)

Units: **millimetres**. Origin for assembly: chamber axis at XY = (0,0), chamber floor Z = 0, +Z up. Rotor spins about
+Z.

Values marked **PUB** are from published 5424 R class data. Values marked **EST** are engineering estimates for CAD
until photo-calibrated.

## Envelope — chassis (refrigerated)

| Dim                         | Value                                                                                                                                                   | Source                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Width (X)                   | 290                                                                                                                                                     | PUB                          |
| Depth (Y)                   | 480                                                                                                                                                     | PUB                          |
| Height closed (Z)           | 260                                                                                                                                                     | PUB                          |
| Height lid fully open       | 510                                                                                                                                                     | PUB                          |
| Weight w/o rotor            | 21.0 kg                                                                                                                                                 | PUB (mass only; not modeled) |
| Rotor FA-45-24-11 mass      | 800 g                                                                                                                                                   | PUB                          |
| Max RCF / RPM               | 21 130 × g / 15 000 rpm                                                                                                                                 | PUB                          |
| Temp range                  | −10 °C … +40 °C                                                                                                                                         | PUB                          |
| Product callouts (Fig. 3-1) | Lid, monitoring glass, display, control panel, emergency release, name plate, power switch, IEC inlet, fuse, service interface, condensation water tray | PUB                          |

## Chamber (EST — refine from photos)

| Dim                      | Value | Notes                                  |
| ------------------------ | ----- | -------------------------------------- |
| Bowl inner diameter      | 160   | Fits FA-45-24-11 class rotor clearance |
| Bowl depth               | 55    |                                        |
| Rim gasket cross-section | Ø 4   | Round seal on chamber lip              |
| Drive cone height        | 18    | Tapered aluminum adapter               |
| Drive cone base Ø        | 22    |                                        |
| Drive cone tip Ø         | 12    |                                        |

## Rotor FA-45-24-11 class (mixed)

| Dim                | Value              | Source                      |
| ------------------ | ------------------ | --------------------------- |
| Places             | 24                 | PUB                         |
| Fixed angle        | 45°                | PUB                         |
| Max tube diameter  | 11                 | PUB                         |
| Max radius R_max   | 84                 | PUB-class (~8.4 cm) for RCF |
| Rotor body outer Ø | 140                | EST                         |
| Rotor body height  | 45                 | EST                         |
| Pocket depth       | 38                 | EST for 1.5/2.0 mL          |
| Hub bore / taper   | matches drive cone | EST                         |
| Rotor lid outer Ø  | 145                | EST                         |
| Rotor lid height   | 12                 | EST                         |
| Lid O-ring         | Ø 2 section        | EST                         |

## Microtubes (standard 1.5 mL approx.)

| Dim          | Value | Source  |
| ------------ | ----- | ------- |
| Body outer Ø | 10.8  | typical |
| Body height  | 39    | typical |
| Cap height   | 8     | EST     |
| Cap outer Ø  | 13    | EST     |

## Lid assembly (EST)

| Dim                | Value     | Notes                      |
| ------------------ | --------- | -------------------------- |
| Lid outer W×D      | 280 × 280 | Over chamber region        |
| Viewport thickness | 3         | Smoked PC                  |
| Hinge axis Y       | −120      | From chamber center (rear) |
| Open angle         | 75°       | From closed                |
| Latch engage depth | 8         | Front                      |

## Control panel — keypad (EST)

| Dim                | Value   | Notes            |
| ------------------ | ------- | ---------------- |
| Bezel width        | 270     | Front face       |
| Bezel height       | 70      |                  |
| Tilt from vertical | 15°     | Receding upward  |
| LCD active area    | 90 × 40 | Display plane    |
| Soft key size      | 12 × 10 | Each             |
| Soft key pitch     | 16      | Center-to-center |
| Status LED Ø       | 3       |                  |

## Base / feet (EST)

| Dim                     | Value | Notes          |
| ----------------------- | ----- | -------------- |
| Foot outer Ø            | 22    | Rubber         |
| Foot height             | 8     |                |
| Foot inset from corners | 25    | To foot center |

## Refrigeration bay (EST — right/rear bulk)

| Dim                 | Value           | Notes            |
| ------------------- | --------------- | ---------------- |
| Compressor envelope | 120 × 100 × 140 | Simplified solid |
| Condenser coil pack | 180 × 30 × 120  | Rear             |

## Fastener defaults

| Use           | Screw             | Notes |
| ------------- | ----------------- | ----- |
| Rubber feet   | M4×12 pan         | 4×    |
| Housing seams | M3×8 pan / socket | ~16×  |
| Chamber mount | M4×10 socket      | 4×    |
| Motor mount   | M5×12 socket      | 4×    |
| Panel / bezel | M3×6 pan          | ~8×   |
| PCB standoffs | M3×6              | 8×    |

## RCF formula (software)

```python
RCF = 1.118e-5 * R_cm * RPM^2
R_cm = 8.4   # default FA-45-24-11 class
```

At 15,000 RPM → RCF ≈ 21,130 × g (matches published max class).

## Photo calibration log

| Date | What adjusted | Old → new |
| ---- | ------------- | --------- |
| —    | v1 freeze     | —         |
