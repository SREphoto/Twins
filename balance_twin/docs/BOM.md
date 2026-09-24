# Bill of Materials — Analytical Balance

Based on Mettler Toledo XSE204/XSR204. For digital twin component identification.

## System Overview

1. **Base Assembly** — Housing, leveling feet, electronics
2. **Weighing Cell** — Electromagnetic force compensation sensor
3. **Draft Shield** — Glass enclosure with sliding doors
4. **Control Panel** — Touchscreen display, touchless sensor
5. **Calibration System** — Internal motorized weight
6. **Interface Board** — RS-232, USB, Ethernet
7. **Power Supply** — External AC/DC adapter

## 1. Base Assembly

| Item | Qty | Description | Material | Notes |
|------|-----|-------------|----------|-------|
| Base housing | 1 | Enclosure for electronics and cell | Metal/plastic | Painted white/gray |
| Front bezel | 1 | Angled panel for display | Plastic | ~45° angle |
| Leveling feet (front) | 2 | Adjustable screw feet | Metal/plastic | Knurled knobs |
| Leveling feet (rear) | 2 | Fixed feet | Rubber | Non-adjustable |
| Bubble level | 1 | Circular spirit level | Glass/plastic | Front panel |
| Ventilation grille | 1 | Rear panel slots | Metal | Passive convection |
| Kensington lock slot | 1 | Anti-theft | Metal | Rear panel |

## 2. Weighing Cell

| Item | Qty | Description | Material | Notes |
|------|-----|-------------|----------|-------|
| Electromagnetic coil | 1 | Force compensation coil | Copper | Core sensor |
| Permanent magnet | 1 | Magnetic field source | NdFeB | High strength |
| Position sensor | 1 | Capacitive or optical | Various | Null position detection |
| Flexure guide | 1 | Parallel guide mechanism | Aluminum/SS | Precision flexures |
| Pan support | 1 | Cross or circular | Aluminum | Connects pan to cell |
| Overload stop | 1 | Mechanical limit | Metal | Prevents cell damage |
| Transport lock | 1 | Screw mechanism | Metal | Engages for shipping |

## 3. Draft Shield

| Item | Qty | Description | Material | Notes |
|------|-----|-------------|----------|-------|
| Left door | 1 | Sliding glass panel | Tempered glass | ~4" wide |
| Right door | 1 | Sliding glass panel | Tempered glass | ~4" wide |
| Top door | 1 | Sliding glass panel | Tempered glass | ~6" wide |
| Door handles | 3 | Ergonomic finger pulls | Metal/plastic | On glass edges |
| Door rails | 2 sets | Top and bottom tracks | Metal | Nylon bearings |
| Door dampers | 3 | Soft-close mechanism | Plastic/metal | Prevents air disturbance |
| Chamber floor | 1 | Stainless steel plate | 304 SS | SmartGrid (perforated) |
| Chamber walls | 3 | Glass panels (rear/sides) | Tempered glass | Fixed |
| Chamber ceiling | 1 | Glass panel | Tempered glass | Fixed |

## 4. Control Panel

| Item | Qty | Description | Material | Notes |
|------|-----|-------------|----------|-------|
| TFT display | 1 | 5.7" color touchscreen | Glass/LCD | 640×480 |
| Touch panel | 1 | Capacitive touch overlay | Glass | Multi-touch |
| Touchless sensor | 1 | Optical hand-wave sensor | PCB/LED | Configurable |
| Power button | 1 | Tactile switch | Plastic | Bezel mounted |
| Display PCB | 1 | Driver board | PCB | Behind display |

## 5. Calibration System

| Item | Qty | Description | Material | Notes |
|------|-----|-------------|----------|-------|
| Calibration weight | 1 | 50–200 g mass | Stainless steel | Motorized |
| Motor drive | 1 | Small DC motor | Various | Lifts weight onto cell |
| Weight mechanism | 1 | Lever/arm assembly | Metal | Engages weight |

## 6. Interface Board

| Item | Qty | Description | Notes |
|------|-----|-------------|-------|
| Main PCB | 1 | System board | Includes MCU, ADC, memory |
| RS-232 transceiver | 1 | DB9 female | 9600 baud |
| USB controller | 1 | USB-A + USB-B | Data + host |
| Ethernet PHY | 1 | RJ45 (optional) | Network |
| Power regulation | 1 | DC-DC converters | 12 VDC input → various rails |

## 7. Power Supply

| Item | Qty | Description | Notes |
|------|-----|-------------|-------|
| AC/DC adapter | 1 | External "brick" | 12 VDC, 2.5 A |
| Power cable | 1 | IEC C7 figure-8 | To adapter |
| DC jack | 1 | Coaxial, ~2.5 mm pin | Rear panel |

## 8. Accessories (Optional)

| Item | Description | Notes |
|------|-------------|-------|
| Footswitch | External tare/print pedal | 3.5mm jack |
| Barcode scanner | Sample ID entry | RS-232 or USB |
| Density kit | For density determination | Suspension below pan |
| Anti-static kit | Ionizer bar | Inside draft shield |
| Printer | GLP-compliant report printer | RS-232 or USB |
| LabX software | PC data management | Ethernet or USB |

## Notes

- Qty marked "1" unless otherwise noted
- "Standard" indicates included with base system
- "Optional" indicates available as add-on
- Part numbers reference Mettler Toledo catalog
- For 3D modeling, prioritize visible exterior components