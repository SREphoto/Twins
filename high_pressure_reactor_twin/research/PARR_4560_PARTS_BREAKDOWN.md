# Parr 4560 Mini Reactor — Complete Parts Breakdown

> Based on: Parr 4560 Product Manual, Manufacturing Plan, and Research References
> Matching mesh names to real equipment components

---

## 1. Structural & Support

| #   | Part Name              | Mesh Name(s)    | Material                 | Qty | Notes                                         |
| --- | ---------------------- | --------------- | ------------------------ | --- | --------------------------------------------- |
| 1   | **Stand Base**         | _(Stand_Base)_  | Cast iron, black painted | 1   | 200×200×15mm, heavy base prevents tipping     |
| 2   | **Support Rod**        | _(Support_Rod)_ | 304 SS                   | 1   | M20×1.5 threaded, 500mm height                |
| 3   | **Top Clamp**          | _(Top_Clamp)_   | Steel                    | 1   | Split clamp securing head plate to rod        |
| 4   | **Compression Spring** | `Spring`        | Steel                    | 1   | Between base and vessel for thermal expansion |

## 2. Pressure Vessel

| #   | Part Name          | Mesh Name(s)                        | Material             | Qty | Notes                                |
| --- | ------------------ | ----------------------------------- | -------------------- | --- | ------------------------------------ |
| 5   | **Vessel Body**    | `Body_Vessel`                       | 316 SS, brushed      | 1   | Ø100mm ID × 150mm depth, 600 mL      |
| 6   | **Vessel Flange**  | _(part of Body_Vessel or separate)_ | 316 SS               | 1   | Ø150mm, 12mm thick with 6 bolt holes |
| 7   | **Head Plate**     | `Head_Plate`                        | 316 SS, brushed      | 1   | Ø150mm × 16mm, 6-bolt closure        |
| 8   | **PTFE Gasket**    | `Gasket`                            | PTFE (dark gray)     | 1   | Flat ring seal between vessel & head |
| 9   | **Hex Bolts (×6)** | `Bolt_Head`, `Bolt_Shaft`           | Grade B7 alloy steel | 6   | M12 × ~50mm, torqued to 50 Nm        |

## 3. Mixing Assembly

| #   | Part Name                    | Mesh Name(s)           | Material              | Qty | Notes                             |
| --- | ---------------------------- | ---------------------- | --------------------- | --- | --------------------------------- |
| 10  | **Overhead DC Motor**        | `Motor`, `Rotor_Motor` | Blue painted aluminum | 1   | 1/8 HP, variable speed 0-2000 RPM |
| 11  | **Magnetic Drive Housing**   | `Stirrer_Drive`        | 316 SS                | 1   | Contains inner/outer SmCo magnets |
| 12  | **Stirrer Shaft**            | `Rotor_Shaft`          | 316 SS                | 1   | Ø10mm × ~200mm                    |
| 13  | **Rushton Turbine Impeller** | `Rotor_Impeller`       | 316 SS                | 1   | 6-blade, Ø45mm, gas-dispersion    |

## 4. Heating System

| #   | Part Name                    | Mesh Name(s)                                              | Material           | Qty | Notes                                   |
| --- | ---------------------------- | --------------------------------------------------------- | ------------------ | --- | --------------------------------------- |
| 14  | **Clamshell Heater (Left)**  | `Lid_Heater_Left`                                         | AL body + SS shell | 1   | Hinged half, 500W, with resistance wire |
| 15  | **Clamshell Heater (Right)** | `Lid_Heater_Right`                                        | AL body + SS shell | 1   | Hinged half, 500W, with resistance wire |
| 16  | **Heater Hinges**.           | `Hinge_Left`, `Hinge_Right`                               | Stainless steel    | 2   | Vertical hinge pins                     |
| 17  | **Heater Clasp/Band**        | `Lasp_Left`, `Lasp_Right` _(NOTE: typo, should be Clasp)_ | Stainless steel    | 2   | Locking clamp band                      |

## 5. Ports & Valves (Head Plate)

| #   | Part Name                    | Mesh Name(s)                      | Material | Qty | Notes                               |
| --- | ---------------------------- | --------------------------------- | -------- | --- | ----------------------------------- |
| 18  | **Gas Inlet Needle Valve**   | `Valve_Inlet`, `Knob_Valve_Inlet` | 316 SS   | 1   | 1/8" NPT, black knob handle         |
| 19  | **Vent Needle Valve**        | `Valve_Vent`, `Knob_Valve_Vent`   | 316 SS   | 1   | 1/8" NPT, black knob handle         |
| 20  | **Burst Disc Assembly**      | `Burst_Disc`                      | 316 SS   | 1   | 250 bar rupture disc + holder       |
| 21  | **Dip Tube / Sampling Tube** | `Dip_Tube`                        | 316 SS   | 1   | 1/8" OD, reaches near vessel bottom |
| 22  | **Thermowell**               | `Thermowell`                      | 316 SS   | 1   | 1/8" OD × 120mm immersion           |

## 6. Instrumentation

| #   | Part Name               | Mesh Name(s)                 | Material             | Qty | Notes                                  |
| --- | ----------------------- | ---------------------------- | -------------------- | --- | -------------------------------------- |
| 23  | **Pressure Gauge**      | `Gauge_Needle`, `UI_Gauge_*` | Brass/SS, steel case | 1   | Ø60mm, 0-3000 psi, bourdon tube        |
| 24  | **Type-J Thermocouple** | _(integrated in Thermowell)_ | 316 SS sheath        | 1   | In thermowell, connected to controller |

## 7. Controller (Parr 4848)

| #   | Part Name                     | Mesh Name(s)      | Material               | Qty | Notes                             |
| --- | ----------------------------- | ----------------- | ---------------------- | --- | --------------------------------- |
| 25  | **Controller Enclosure**      | `Controller_*`    | Gray steel             | 1   | 200×250×150mm, IP54               |
| 26  | **LCD Display Screen**        | `lcdscreen`       | Canvas-rendered        | 1   | 48×48mm, shows PV/SV/pressure/RPM |
| 27  | **Main Power Button**         | `Btn_Power`       | Plastic/metal          | 1   | Rocker switch                     |
| 28  | **Heater Toggle Button**      | `Btn_Heater`      | Plastic/metal          | 1   | Rocker switch                     |
| 29  | **Stirrer Speed Knob**        | `Knob_Speed`      | Plastic                | 1   | Potentiometer dial                |
| 30  | **Temperature Setpoint Knob** | `Knob_Temp`       | Plastic                | 1   | Potentiometer dial                |
| 31  | **Power LED Indicator**       | `LED_Power_Lens`  | Clear lens, green LED  | 1   | System power status               |
| 32  | **Heater LED Indicator**      | `LED_Heater_Lens` | Clear lens, orange LED | 1   | Heater active status              |
| 33  | **Alarm LED Indicator**       | `LED_Alarm_Lens`  | Clear lens, red LED    | 1   | Over-temp/pressure alarm          |

---

## Known Issues in Current 3D Model

| Issue                                               | Severity | Fix                      |
| --------------------------------------------------- | -------- | ------------------------ |
| `Lasp_Left` / `Lasp_Right` typo (should be `Clasp`) | Low      | Rename in Blender source |
| Missing stand base and support rod meshes           | Medium   | Add to GLB model         |
| Missing separate bolt meshes (bolted to head)       | Low      | Add detail bolts         |
| No heater clasp/band geometry                       | Low      | Add band clamp           |
| Missing dip tube (sampling tube) geometry           | Low      | Add to head plate        |
| Vessel body and flange may be single mesh           | Medium   | Split flange for explode |

## Explode View Grouping (Per Schematics)

Based on Parr 4560 assembly order (bottom-up):

```
Group 5: Vessel & Gasket (↓ 0.06)
  ├── Body_Vessel
  └── Gasket
  └── Spring (↓ 0.03)

Group 3: Left Heater (← 0.07, Z+0.02)
  ├── Lid_Heater_Left
  ├── Hinge_Left
  └── Lasp_Left (typo: Clasp)

Group 4: Right Heater (→ 0.07, Z+0.02)
  ├── Lid_Heater_Right
  ├── Hinge_Right
  └── Lasp_Right (typo: Clasp)

Group 2: Head Plate Assembly (↑ 0.08)
  ├── Head_Plate
  ├── Stirrer_Drive
  ├── Bolt_Head (×6)
  ├── Bolt_Shaft (×6)
  ├── Gauge_Needle
  ├── UI_Gauge_*
  ├── Valve_Inlet / Valve_Vent
  ├── Knob_Valve_Inlet / Knob_Valve_Vent
  ├── Burst_Disc
  ├── Thermowell
  ├── Dip_Tube
  ├── Rotor_Shaft
  └── Rotor_Impeller

Group 1: Motor Assembly (↑ 0.15)
  ├── Motor
  └── Rotor_Motor

Group 6: Controller (→ 0.08)
  ├── Controller_*
  ├── lcdscreen
  ├── Knob_Speed
  ├── Knob_Temp
  ├── Btn_Power / Btn_Heater
  └── LED_*_Lens
```

> **Correct assembly order (bottom to top):** Stand → Spring → Vessel → Gasket → Head Plate → Bolts → Drive → Impeller → Motor
> **Heater attaches around vessel** after head plate is torqued down
> **Controller** is separate benchtop unit connected via cables
