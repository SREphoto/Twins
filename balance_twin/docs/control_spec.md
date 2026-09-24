# Control Specification — Analytical Balance

Based on Mettler Toledo XSE204 and AE200 behavior.

## States

| State | Description | Display | Pan Status |
|-------|-------------|---------|------------|
| OFF | Unit powered down; standby (touchscreen blank) | Dark | Locked (transport lock engaged) |
| STANDBY | Low power; wake on touch/button | Dim/screen saver | Free |
| READY | Stable weight reading, no load change | Weight display at zero (0.00000 g) | Free |
| WEIGHING | Sample on pan; reading updating | Dynamic weight display, stability indicator flashing | Loaded |
| STABLE | Weight reading locked | Solid weight display with stability icon | Loaded, stable |
| TARE | Zero adjustment active | Display shows 0.00000 g or tare weight | Loaded or empty |
| CALIBRATION | Internal/external calibration in progress | "CAL" message, time remaining | Auto (internal weight engaged) |
| MENU | User configuration menu | Menu system on display | Free |
| PRINT | Data transmission active | "PRINT" or "SEND" indicator | Maintains current state |
| OVERLOAD | Weight exceeds maximum capacity | "O" or "OVERLOAD" error | Load removed automatically |
| UNDERLOAD | Pan not properly engaged | "U" or "UNDERLOAD" error | Check pan seating |
| ERROR | System fault | Error code on display | Locked |

## Transitions

- OFF → STANDBY: Press power button
- STANDBY → READY: Power button or touch screen (auto-wake)
- READY → WEIGHING: Place sample on pan (mass detected)
- WEIGHING → STABLE: No mass change for ~2 seconds
- STABLE → READY: Remove sample (returns to zero)
- READY → TARE: Press Tare button (with or without container)
- TARE → READY: Immediate (weight offset applied)
- READY → CALIBRATION: Press Cal button or automatic isoCAL trigger
- CALIBRATION → READY: Calibration complete (self-test passes)
- Any → ERROR: Hardware fault detected
- ERROR → STANDBY: Power cycle or menu reset

## Controls

### Touchscreen (XSE204)

| Control | Type | Function |
|---------|------|----------|
| Power | Hardware button (bezel) | On/Standby |
| Home | Touchscreen icon | Return to app selection |
| Tare | Touchscreen button | Zero/tare weight |
| Print | Touchscreen button | Send to printer/PC |
| Cal | Touchscreen button | Start calibration |
| Menu | Touchscreen icon | System settings |
| SmartScreen | Touchscreen (capacitive) | Weight display + app selection |
| Numeric keypad | Touchscreen | Enter values (target weight, limits) |
| Swipe | Touchscreen gesture | Navigate between screens |

### Touchless Sensor (XSE204)

| Gesture | Configurable Action | Default |
|---------|---------------------|---------|
| Wave left-to-right | Tare, Print, Mode switch | Tare |
| Wave right-to-left | Tare, Print, Mode switch | Print |
| Hold hand over sensor | Tare, Print, Mode switch | Mode switch |

### Hard Keys (AE200)

| Key | Function |
|-----|----------|
| ON/OFF | Power toggle |
| TARE | Zero/tare |
| CAL | Start calibration |
| MODE | Cycle units (g, mg, ct, oz) |
| PRINT | Send to serial port |
| FUNCTION | Access advanced functions |

### External Controls

| Device | Connection | Function |
|--------|------------|----------|
| Footswitch | 3.5mm front panel jack | Hands-free tare/print |
| Barcode scanner | RS-232 or USB | Sample ID entry |
| PC software | USB-B, RS-232, Ethernet | Data logging, remote control |

## Display Layout (XSE204 Touchscreen)

```
┌─────────────────────────────────────────┐
│ [Home]  [Date/Time]  Status  Cal  Unit │ ← Status bar
├─────────────────────────────────────────┤
│                                         │
│         1234.56789  g                   │ ← Weight display (large digits)
│           ┌───┐                         │
│           │ ○ │ ← Stability indicator   │
│           └───┘                         │
│                                         │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│ │ Tare │ │ Cal  │ │Print │ │ Menu │   │ ← Action buttons
│ └──────┘ └──────┘ └──────┘ └──────┘   │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│ │  g   │ │  mg  │ │  ct  │ │  %   │   │ ← Quick unit selection
│ └──────┘ └──────┘ └──────┘ └──────┘   │
└─────────────────────────────────────────┘
```

## Status Indicators (XSE204)

| Icon | Location | Meaning |
|------|----------|---------|
| ○ (solid) | Weight display | Stable reading |
| ○ (flashing) | Weight display | Reading in progress |
| isoCAL symbol | Status bar | Calibration OK / running |
| Green/Red bubble | Status bar | Level status |
| Battery (if applicable) | Status bar | Power status |
| USB/RS-232 icon | Status bar | Active data connection |

## Communication Protocol

| Interface | Protocol | Default Settings |
|-----------|----------|-----------------|
| RS-232 | ASCII serial | 9600 baud, 8-N-1, no flow control |
| USB-B | Virtual COM port | Same as RS-232 |
| Ethernet | TCP/IP, port 8000 | DHCP or static |
| Data format | MT-SICS | Mettler Toledo Standard Interface Command Set |

## Alarms & Interlocks

| Condition | Behavior |
|-----------|----------|
| Overload (>220 g) | Display "O", no weight readout, remove load to clear |
| Underload (no pan) | Display "U", install pan |
| Temperature change >1.5°C | Auto-trigger isoCAL (if enabled) |
| Level sensor red | Prompt to level balance, calibration blocked |
| Calibration overdue | Flashing CAL indicator, recommend calibration |
| Door open (stability) | Stability prevented until door closed |
| Transport lock engaged | Weighing disabled, warning on display |

## Calibration

| Type | Trigger | Duration | Accuracy |
|------|---------|----------|----------|
| Internal (isoCAL) | Temperature change >1.5°C or timed interval | ~30 seconds | ±0.1 mg |
| Internal (manual) | User presses Cal button | ~30 seconds | ±0.1 mg |
| External | User places certified weight | ~15 seconds | Depends on weight class |