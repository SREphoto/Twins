# Dimensions — Parr 4560 Series Mini Reactor

For 3D model construction. Based on official Parr specifications and cross-referenced with product photos.

## Primary Model Target: 4566 (300 mL Fixed-Head) with 4848 Controller

This is the most commonly depicted configuration in product photos.

## Vessel Assembly

### Cylinder (Vessel Body)

| Parameter              | Imperial         | Metric          | Source / Notes                          |
| ---------------------- | ---------------- | --------------- | --------------------------------------- |
| **Internal diameter**  | 2.5 in           | 63.5 mm         | Official spec (all models except 4565)  |
| **Internal depth**     | 4.0 in (4566)    | 101.6 mm        | Varies by model (see table below)       |
| **Wall thickness**     | ~0.5 in (est.)   | ~12.7 mm        | Not published; estimated for 200 bar    |
| **External diameter**  | ~3.5 in (est.)   | ~89 mm          | Estimated from ID + wall thickness      |
| **Material**           | 316 SS           | 316 SS          | Standard; Hastelloy C-276 optional      |

### Cylinder Dimensions by Model

| Model  | Volume (mL) | ID × Depth (in) | ID × Depth (mm) | Cylinder Weight (lb) | Cylinder Weight (kg) |
| ------ | ----------- | --------------- | ---------------- | -------------------- | -------------------- |
| 4565   | 100         | 2.0 × 2.0       | 50.8 × 50.8      | 3.3                  | 1.50                 |
| 4564   | 160         | 2.5 × 2.0       | 63.5 × 50.8      | 2.4                  | 1.09                 |
| 4561   | 300         | 2.5 × 4.0       | 63.5 × 101.6     | 3.7                  | 1.68                 |
| 4566   | 300         | 2.5 × 4.0       | 63.5 × 101.6     | 3.7                  | 1.68                 |
| 4562   | 450         | 2.5 × 6.0       | 63.5 × 152.4     | 4.9                  | 2.22                 |
| 4567   | 450         | 2.5 × 6.0       | 63.5 × 152.4     | 4.9                  | 2.22                 |
| 4563   | 600         | 2.5 × 8.0       | 63.5 × 203.2     | 6.2                  | 2.81                 |
| 4568   | 600         | 2.5 × 8.0       | 63.5 × 203.2     | 6.2                  | 2.81                 |

### Head Plate

| Parameter              | Imperial         | Metric          | Source / Notes                          |
| ---------------------- | ---------------- | --------------- | --------------------------------------- |
| **Diameter**           | ~5.9 in (est.)   | ~150 mm         | Estimated from build resources          |
| **Thickness**          | ~0.63 in (est.)  | ~16 mm          | Estimated from build resources          |
| **Bolt circle**        | ~4.7 in (est.)   | ~120 mm         | 6-bolt pattern                          |
| **Bolt size**          | M12 × 1.75       | M12 × 1.75      | Grade B7, ~50 mm length                 |
| **Number of bolts**    | 6                | 6               | Split-ring closure                      |
| **Ports**              | 5+               | 5+              | 1/8" NPT (valves, TC, burst disc, etc.) |
| **Material**           | 316 SS           | 316 SS          | Standard                                |

### Gasket

| Parameter              | Imperial              | Metric           | Source / Notes                          |
| ---------------------- | --------------------- | ---------------- | --------------------------------------- |
| **Type**               | Flat ring             | Flat ring        | PTFE or flexible graphite (Grafoil)     |
| **ID**                 | ~4.1 in (est.)        | ~105 mm          | Estimated from build resources          |
| **OD**                 | ~4.9 in (est.)        | ~125 mm          | Estimated from build resources          |
| **Thickness**          | ~0.063 in             | ~1.6 mm          | Standard                                |

## Magnetic Drive Assembly

| Parameter              | Imperial         | Metric          | Source / Notes                          |
| ---------------------- | ---------------- | --------------- | --------------------------------------- |
| **Model**              | A1120HC6         | A1120HC6        | Official part number                    |
| **Max torque**         | 16 in-lb         | 1.81 N·m        | Official spec                           |
| **Housing diameter**   | ~2.4 in (est.)   | ~60 mm          | Estimated from build resources          |
| **Housing height**     | ~3.9 in (est.)   | ~100 mm         | Estimated from build resources          |
| **Shaft diameter**     | ~0.39 in (est.)  | ~10 mm          | Estimated from build resources          |
| **Shaft length**       | ~7.9 in (est.)   | ~200 mm         | Estimated from build resources          |
| **Impeller type**      | 4-blade turbine  | 4-blade turbine | Official spec (6-blade Rushton optional)|
| **Impeller diameter**  | 1.38 in          | 35.1 mm         | Official spec                           |

## Stirrer Motor

| Parameter              | Imperial         | Metric          | Source / Notes                          |
| ---------------------- | ---------------- | --------------- | --------------------------------------- |
| **Power**              | 1/8 hp           | 93 W            | Official spec                           |
| **Type**               | DC variable speed| DC variable     | Official spec                           |
| **Speed range**        | 0-1700 rpm       | 0-1700 rpm      | Official spec (support system limit)    |
| **Motor diameter**     | ~3.5 in (est.)   | ~89 mm          | Typical for 1/8 hp DC motor             |
| **Motor height**       | ~5 in (est.)     | ~127 mm         | Typical for 1/8 hp DC motor             |

## Heater (Clamshell)

| Parameter              | Imperial         | Metric          | Source / Notes                          |
| ---------------------- | ---------------- | --------------- | --------------------------------------- |
| **Type**               | Mantle (std)     | Mantle          | Clamp-on for some models                |
| **Power (4566)**       | 780 W            | 780 W           | Official spec (varies by model)         |
| **Power (4564)**       | 510 W            | 510 W           | Official spec                           |
| **Power (4565)**       | 590 W            | 590 W           | Official spec                           |
| **Power (4566B/C)**    | 525 W            | 525 W           | Official spec                           |
| **HT option**          | Ceramic fiber    | Ceramic fiber   | 800-1100 W                              |
| **Inner diameter**     | ~3.7 in (est.)   | ~94 mm          | Fits over vessel OD                     |
| **Height**             | ~4.0 in (est.)   | ~102 mm         | Matches cylinder depth                  |
| **Electrical**         | 115/230 VAC      | 115/230 VAC     | Official spec                           |

## Stand & Support

| Parameter              | Imperial         | Metric          | Source / Notes                          |
| ---------------------- | ---------------- | --------------- | --------------------------------------- |
| **Base width**         | 12 in            | 305 mm          | Official spec                           |
| **Base depth**         | 18 in            | 457 mm          | Official spec                           |
| **Base height**        | ~0.6 in (est.)   | ~15 mm          | Estimated from build resources          |
| **Support rod dia.**   | ~1.0 in (est.)   | ~25 mm          | Estimated from build resources          |
| **Support rod height** | ~20 in (est.)    | ~500 mm         | Estimated from build resources          |
| **Overall height**     | ~30 in (est.)    | ~762 mm         | Estimated (base + rod + motor)          |

## 4848 Controller

| Parameter              | Imperial         | Metric          | Source / Notes                          |
| ---------------------- | ---------------- | --------------- | --------------------------------------- |
| **Width**              | 11.1 in          | 282 mm          | Official spec                           |
| **Height**             | 9.7 in           | 246 mm          | Official spec                           |
| **Depth**              | 11.3 in          | 287 mm          | Official spec                           |
| **4848B Width**        | 13.6 in          | 345 mm          | Official spec                           |
| **4848B Height**       | 9.6 in           | 244 mm          | Official spec                           |
| **4848B Depth**        | 11.3 in          | 287 mm          | Official spec                           |
| **Weight**             | ~15 lb (est.)    | ~7 kg           | Estimated                               |

## Pressure Gauge

| Parameter              | Imperial         | Metric          | Source / Notes                          |
| ---------------------- | ---------------- | --------------- | --------------------------------------- |
| **Dial diameter**      | 3.5 in           | 89 mm           | Official spec                           |
| **Range (standard)**   | 0-3000 psi       | 0-207 bar       | Official spec                           |
| **Range (HT)**         | 0-2000 psi       | 0-138 bar       | Official spec                           |
| **Connection**         | 1/4" NPT         | 1/4" NPT        | Bottom mount                            |

## Overall System (4566 + 4848)

| Parameter              | Imperial         | Metric          | Source / Notes                          |
| ---------------------- | ---------------- | --------------- | --------------------------------------- |
| **Width**              | ~12 in           | ~305 mm         | Stand width                             |
| **Depth**              | ~18 in           | ~457 mm         | Stand depth                             |
| **Height (reactor)**   | ~30 in (est.)    | ~762 mm         | Base to motor top                       |
| **Height (controller)**| ~10 in           | ~246 mm         | Controller height                       |
| **Total weight**       | ~35 lb (est.)    | ~16 kg          | Vessel + stand + motor + controller     |

## Notes

- Dimensions marked "(est.)" are not officially published by Parr and are estimated from:
  - Known cylinder ID (2.5 in = 63.5 mm)
  - Product photos with known reference objects
  - Existing build resources document
  - Typical dimensions for 1/8 hp DC motors and magnetic drives
- The 600 mL model (4563/4568) has the same ID but 8.0 in depth — the tallest cylinder
- The 100 mL model (4565) has a smaller ID (2.0 in) and is the only non-2.5" ID model
- Final dimensions should be verified against actual unit or detailed Parr drawings
- For 3D modeling, the 4566 (300 mL fixed-head) is recommended as the primary target
