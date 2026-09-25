# Bill of Materials — Digital Precision Vortex Mixer

## 1. Structural Mechanical Components
| Item | Part Taxonomy Node | Description | Material | Quantity |
| :--- | :--- | :--- | :--- | :--- |
| **Main Chassis** | `Body_Chassis` | Heavy unibody casting with flared skirt | Die-cast Zinc Alloy (Zamak 3) | 1 |
| **Console Bezel Pocket** | `Pocket_ConsoleBezel` | Carved recessed pocket (depth 2.0 mm) | Integrated into chassis casting | 1 |
| **Console Faceplate** | `Panel_Console` | Anodized brushed aluminum plate | Aluminum 6061-T6 | 1 |
| **Base Plate** | `Body_BasePlate` | Bottom chassis closure plate | Pressed Galvanized Steel (1.5 mm) | 1 |
| **Suction Feet** | `Foot_Leveling_FL/FR/RL/RR` | Damping suction cup feet (32 mm dia) | Vulcanized Neoprene / Brass M4 | 4 |
| **Rubber Cup Head** | `Pivot_CupHead` | Deep conical vortexing cup | Molded EPDM / Silicone 50 Shore A | 1 |
| **Fasteners** | `Fastener_HexM3_*` | DIN 912 Hex socket cap screws | Stainless Steel 304 | 8 |
| **Washers** | `Fastener_WasherM3_*` | DIN 125 Form A flat washers | Stainless Steel 304 | 8 |
| **Brand Badge** | `Badge_SREdesigns` | Diamond-cut metallic badge | Brushed Nickel Plated ABS | 1 |

## 2. Electro-Mechanical & Controls
| Item | Part Taxonomy Node | Description | Notes |
| :--- | :--- | :--- | :--- |
| **Drive Motor** | `Assembly_Motor` | Permanent split-capacitor AC induction motor | 150 W, 500–3200 RPM |
| **Eccentric Cam** | `Assembly_EccentricCam` | Precision machined brass offset counterweight | 2.0 mm eccentricity |
| **Mode Switch** | `Switch_Mode` | 3-position toggle switch (Touch / Off / Cont) | Chrome bat lever, knurled hex nut |
| **Speed Knob** | `Knob_Speed` | Optical rotary encoder with raised pointer | Molded ABS, 28 mm diameter |
| **Display Panel** | `UI_LCD` | High-DPI digital CanvasTexture quad | Live RPM, timer, status icons |
| **Push Buttons** | `Btn_Timer`, `Btn_Pulse`, `Btn_Power`| Tactile momentary membrane switches | Spring-loaded keycaps |
| **Status LED** | `LED_PowerRun` | 5 mm bi-color Fresnel dome LED | Amber (Standby) / Green (Active) |
| **Power Inlet** | `Assembly_PowerInlet` | IEC 60320 C14 with rocker switch & fuse drawer | Rear panel |

## 3. Laboratory Accessories & Glassware
| Item | Part Taxonomy Node | Description | Material |
| :--- | :--- | :--- | :--- |
| **15 mL Conical Tube** | `Glass_FalconTube` | Graduated centrifuge tube with blue cap | Polypropylene / HDPE |
| **1.5 mL Microcentrifuge Tube**| `Glass_MicroTube` | Clear microtube with attached flip cap | Optical Polypropylene |
| **Liquid Meniscus** | `Fluid_VortexMeniscus` | Dynamic rotational vortex liquid mesh | Shader with viscosity parameters |
