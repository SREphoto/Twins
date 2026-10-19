# Bill of Materials (BOM) & Semantic Part Taxonomy: Labconco FreeZone 4.5L

All components adhere to the strict semantic naming contract required by `.agents/AGENTS.md`.

## 1. Structural Enclosure & Housing

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Body_Chassis` | Main unibody powder-coated cold-rolled steel chassis ($571 \times 673 \times 469\text{ mm}$) | Textured epoxy Glacier White (`#e2e8f0`), $R=0.45, M=0.05$ | Root |
| `Body_Fascia` | Brushed 304 stainless steel front control panel faceplate | Directional brushed stainless steel, $R=0.22, M=0.88$ | `Body_Chassis` |
| `Badge_SREdesigns` | Official SREdesigns precision branded identity badge | Brushed aluminum plate with cyan/white silkscreen logo | `Body_Fascia` |
| `Foot_Leveling_FL` | Front-Left M12 knurled leveling foot with vulcanized pad | Hard vulcanized nitrile rubber & zinc-plated steel | `Body_Chassis` |
| `Foot_Leveling_FR` | Front-Right M12 knurled leveling foot with vulcanized pad | Hard vulcanized nitrile rubber & zinc-plated steel | `Body_Chassis` |
| `Foot_Leveling_RL` | Rear-Left M12 knurled leveling foot with vulcanized pad | Hard vulcanized nitrile rubber & zinc-plated steel | `Body_Chassis` |
| `Foot_Leveling_RR` | Rear-Right M12 knurled leveling foot with vulcanized pad | Hard vulcanized nitrile rubber & zinc-plated steel | `Body_Chassis` |
| `Louver_AirIntake` | Front and side ventilation cooling louvers for refrigeration condensing unit | Stamped cold-rolled steel slots | `Body_Chassis` |

---

## 2. Refrigeration & Collector Chamber

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Chamber_Collector` | Seamless 316 stainless steel deep-drawn collector ($4.5\text{ L}$) | Mirror electropolished 316SS, $R=0.10, M=0.92$ | `Body_Chassis` |
| `Coil_Evaporator` | 5-turn helical refrigeration evaporator tube ($\varnothing 12.7\text{ mm}$) | Stainless steel tubing lining collector wall | `Chamber_Collector` |
| `Frost_CondenserIce` | Dynamic procedural frost accumulation layer on evaporator coil | Translucent crystalline ice shader, $R=0.35, M=0.0$, alpha-blended | `Coil_Evaporator` |
| `Gasket_CollectorRim` | Molded blue silicone hermetic collector rim gasket | High-purity food-grade silicone, $R=0.60$ | `Chamber_Collector` |
| `Compressor_Stage1` | 1/3 HP hermetic reciprocating refrigeration compressor (R404A/R513A) | Gloss black enameled cast steel, $R=0.30, M=0.20$ | `Body_Chassis` |
| `Compressor_Stage2` | 1/3 HP ultra-low-temp hermetic compressor (R508B/R290) | Gloss black enameled cast steel, $R=0.30, M=0.20$ | `Body_Chassis` |
| `Exchanger_Cascade` | Brazed stainless steel plate interstage cascade heat exchanger | Copper-brazed stainless steel plates | `Body_Chassis` |
| `Radiator_CondenserFan` | Copper fin condenser radiator coil with motorized axial fan | Copper tubes with aluminum fins & black fan blades | `Body_Chassis` |

---

## 3. Acrylic Drying Drum Manifold & Valves

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Manifold_DrumAcrylic` | $\varnothing 305\text{ mm} \times 381\text{ mm}$ cast optical acrylic drying cylinder | Optical acrylic (`MeshPhysicalMaterial`, $IOR=1.49, T=0.96$) | `Body_Chassis` |
| `Lid_ManifoldTop` | $\varnothing 320\text{ mm} \times 12.7\text{ mm}$ clear acrylic top cover plate | Optical acrylic (`MeshPhysicalMaterial`, $IOR=1.49, T=0.96$) | `Manifold_DrumAcrylic` |
| `Handle_LidCenter` | Molded silicone center lifting knob | Matte silicone elastomer, $R=0.70$ | `Lid_ManifoldTop` |
| `Valve_QuickSeal_01`..`12` | 12 neoprene Quick-Seal freeze-dry valves with 3-pos handles | Matte black neoprene body with chemical-resistant delrin | `Manifold_DrumAcrylic` |
| `Pivot_ValveLever_01`..`12`| Kinematic 3-position valve levers (`CLOSED`, `VACUUM`, `VENT`) | Molded gray polyacetal handle with position detents | `Valve_QuickSeal_01`..`12` |
| `Gasket_DrumBase` | Molded silicone bottom sealing ring for drum manifold | Royal blue silicone rubber, $R=0.55$ | `Manifold_DrumAcrylic` |

---

## 4. Consumable Fast-Freeze Lyophilization Vessels

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Flask_FastFreeze_01` | $300\text{ mL}$ wide-mouth borosilicate lyophilization flask | Optical borosilicate glass ($IOR=1.52, T=0.95$) | `Valve_QuickSeal_01` |
| `Flask_FastFreeze_02` | $600\text{ mL}$ wide-mouth borosilicate lyophilization flask | Optical borosilicate glass ($IOR=1.52, T=0.95$) | `Valve_QuickSeal_07` |
| `Cap_SiliconeTop_01`..`02` | Flexible molded silicone rubber flask sealing cover | Dark red silicone elastomer | `Flask_FastFreeze_*` |
| `Adapter_GlassElbow_01`..`02`| $3/4"$ borosilicate $45^\circ$ adapter connecting cap to valve | Borosilicate glass tubing | `Flask_FastFreeze_*` |
| `Cake_FrozenProduct_01`..`02`| Frozen pharmaceutical API lyophile cake undergoing sublimation | Porous crystalline white/ivory matrix (`#fdf4dc`) | `Flask_FastFreeze_*` |

---

## 5. Vacuum System & Interconnects

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `Pump_Vacuum_RV5` | Edwards RV5 dual-stage rotary vane vacuum pump twin | Industrial orange/gray powder coat, $R=0.40, M=0.20$ | Scene Root |
| `Hose_VacuumReinforced` | Heavy-wall wire-reinforced clear PVC vacuum hose ($\varnothing 25\text{ mm}$) | Translucent wire-spiral vacuum hose | `Body_Chassis` |
| `Flange_KF25_Chassis` | Rear stainless steel KF25 quick-release vacuum clamp flange | 304 stainless steel with aluminum wing-nut clamp | `Body_Chassis` |
| `Sensor_PiraniGauge` | Internal micro-Pirani vacuum gauge transducer | Machined aluminum sensor cell with gold-plated wire | `Body_Chassis` |
| `Valve_VacuumSolenoid` | Internal electronic vacuum anti-suckback solenoid valve | Cast brass body with molded epoxy solenoid coil | `Body_Chassis` |
| `Port_DrainFront` | Front collector defrost condensate drain with silicone line & clamp | Molded hose with stainless pinch clamp | `Body_Fascia` |

---

## 6. Electronics, Display & Power Continuity

| Semantic Part ID | Description | Material / PBR Spec | Parent Node |
| :--- | :--- | :--- | :--- |
| `UI_LCD` | 5.0-Inch dynamic CanvasTexture touchscreen display quad | Dynamic CanvasTexture (`flipY=false, sRGB`), unpowered blackout | `Body_Fascia` |
| `Glass_LCDLens` | Protective anti-reflective acrylic/glass touchscreen window | Optical transparent overlay (`opacity=0.06, R=0.05`) | `Body_Fascia` |
| `Btn_Vacuum` | Backlit tactile push button: VACUUM PUMP CONTROL | Silicone keycap with illuminated vacuum symbol | `Body_Fascia` |
| `Btn_Refrig` | Backlit tactile push button: REFRIGERATION CASCADE | Silicone keycap with illuminated snowflake symbol | `Body_Fascia` |
| `Btn_Defrost` | Backlit tactile push button: DEFROST / DRAIN CYCLE | Silicone keycap with illuminated heat wave symbol | `Body_Fascia` |
| `Btn_Menu` | Tactile push button: LYO-WORKS PARAMETERS / GLP | Slate gray silicone keycap | `Body_Fascia` |
| `Switch_Power` | Main illuminated DPST red rocker AC power switch | Translucent red rocker with internal neon lamp | `Body_Fascia` |
| `Power_Receptacle_Duplex` | Cast aluminum bench duplex receptacle box (NEMA 5-15R) | Cast aluminum housing with stainless faceplate | Bench Root |
| `Part_PowerPlugNEMA` | Molded 3-prong NEMA 5-15P grounded AC power plug | Molded black PVC with brass blades and ground pin | `Power_Receptacle_Duplex` |
| `Cable_ACPowerCord` | 3-wire 14 AWG heavy-duty SJTOW neoprene AC power cord | Flexible black rubber tube routing to rear IEC inlet | `Body_Chassis` |

---

## 7. Fasteners & Mechanical Assembly Hardware

| Semantic Part ID | Description | Dimensions / Standard | Qty |
| :--- | :--- | :--- | :--- |
| `Fastener_HexM4_Chassis_*` | Hex socket cap screws securing front fascia & side panels | M4 x 10mm ISO 4762 304SS | 16 |
| `Fastener_FlangeClamp_KF25`| Quick-release aluminum hinge clamp with centering O-ring | ISO-KF NW25 aluminum wing-nut | 2 |
| `Fastener_HexM6_Base_*` | Hex head bolts securing dual hermetic compressors | M6 x 20mm Grade 8.8 steel | 8 |
| `Fastener_Mount_Vibration_*`| Neoprene elastomeric vibration dampers beneath compressors | $\varnothing 32\text{ mm} \times 25\text{ mm}$ cylindrical mounts | 8 |
