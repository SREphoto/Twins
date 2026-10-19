# Bill of Materials — PH-7000 Pro Digital Twin

Comprehensive Bill of Materials for the SREdesigns PH-7000 Pro digital laboratory twin (Mettler Toledo SevenExcellence S470 / Thermo Orion Star A211 benchmark).

## 1. External Enclosure & Chassis (Body_Chassis)

| Part ID | Qty | Description | Material & Finish |
| :--- | :--- | :--- | :--- |
| `Body_Chassis` | 1 | Sloped unibody console enclosure | Flame-retardant ABS/PC blend, RAL 9003 signal white |
| `Body_BaseChassisPan` | 1 | Rigid structural base chassis plate | Die-cast ADC12 aluminum, zinc passivated |
| `Foot_Leveling_FrontLeft` | 1 | Vibration isolation leveling foot | 70 Shore A vulcanized neoprene rubber, M4 threaded stud |
| `Foot_Leveling_FrontRight`| 1 | Vibration isolation leveling foot | 70 Shore A vulcanized neoprene rubber, M4 threaded stud |
| `Foot_Leveling_RearLeft` | 1 | Vibration isolation leveling foot | 70 Shore A vulcanized neoprene rubber, M4 threaded stud |
| `Foot_Leveling_RearRight` | 1 | Vibration isolation leveling foot | 70 Shore A vulcanized neoprene rubber, M4 threaded stud |
| `Fastener_HexM3_01`..`08` | 8 | Base pan socket head cap screws | 316 stainless steel, genuine M3 hex socket depth |
| `Badge_SREdesigns` | 1 | SREdesigns certified brand plate | Anodized brushed aluminum, laser engraved |

---

## 2. Display, Optics & Tactile Controls

| Part ID | Qty | Description | Material & Finish |
| :--- | :--- | :--- | :--- |
| `Body_Bezel` | 1 | Recessed console pocket bezel | Injection molded matte charcoal polycarbonate |
| `UI_LCD` | 1 | 7.0-inch widescreen dynamic display quad | 800×480 WVGA active-matrix TFT, dynamic canvas |
| `Glass_ScreenLens` | 1 | Protective optical display lens | 1.2 mm chemically toughened float glass, anti-glare AR |
| `Btn_Read` | 1 | Tactile measurement trigger key | Beveled PBT keycap, deep blue with polished chrome rim |
| `Btn_Cal` | 1 | Tactile calibration routine key | Beveled PBT keycap, emerald green with polished chrome rim |
| `Btn_Mode` | 1 | Tactile mode toggle key (pH/mV/ORP)| Beveled PBT keycap, slate gray with polished chrome rim |
| `Btn_Setup` | 1 | Tactile system configuration key | Beveled PBT keycap, slate gray with polished chrome rim |
| `Btn_Hold` | 1 | Tactile reading lock / hold key | Beveled PBT keycap, amber gold with polished chrome rim |
| `Btn_Power` | 1 | Master DC power rocker switch | 2-position rocker switch with integrated green LED |

---

## 3. Internal Mechanics & Electronics Bay

| Part ID | Qty | Description | Specification |
| :--- | :--- | :--- | :--- |
| `PCB_Motherboard` | 1 | Main system motherboard | 4-layer FR-4, immersion gold (ENIG), green solder mask |
| `Part_MCU_STM32` | 1 | 32-bit ARM Cortex-M4 Microcontroller | STM32F407VET6, 168 MHz, 512 KB Flash, 192 KB SRAM |
| `Part_RAM_Chip` | 1 | High-speed SDRAM memory IC | ISSI IS42S16160J 32 MB SDRAM, TSOP-54 |
| `Part_SSD_Module` | 1 | Non-volatile solid-state NAND flash | Winbond W25N01GV 128 MB SPI NAND flash storage |
| `Shield_Electrometer_Faraday`| 1 | RF Faraday shielding can | Drawn 0.5 mm nickel-plated copper alloy, soldered grounded |
| `IC_Electrometer_OpAmp` | 1 | Ultra-high impedance electrometer amp | Texas Instruments ADA4530-1, <20 fA input bias current |
| `IC_ADC_24Bit` | 1 | Precision delta-sigma ADC | Analog Devices AD7190, 24-bit 4.8 kHz low noise |
| `Assembly_PowerSupply` | 1 | Internal DC-DC regulation section | Linear Technology low-noise LDOs (±15V, +5V, +3.3V, +1.2V)|
| `Fan_CabinetCooling_Blower` | 1 | Forced convection cooling blower fan | 40×40×10 mm brushless blower with steel finger guard |
| `Cable_Ribbon_Display` | 1 | 40-pin FFC flexible flat ribbon cable | 0.5 mm pitch Gold-plated contacts to LCD driver |
| `Audio_PiezoBuzzer` | 1 | Resonant acoustic sounder | Murata PKLCS1212E4001, 4.0 kHz SPL >75 dB |

---

## 4. Rear I/O Bulkhead & Industrial Connectors

| Part ID | Qty | Description | Specification |
| :--- | :--- | :--- | :--- |
| `Plate_RearIO_Bulkhead` | 1 | Connector mounting bulkhead plate | 1.5 mm brushed 5052 aluminum, anodized |
| `Port_BNC_pH` | 1 | MIL-STD-348 BNC female coaxial jack | Amphenol gold-plated center pin, PTFE dielectric |
| `Port_ATC_Temp` | 1 | 4-pin circular mini-DIN connector | Switchcraft mini-DIN female jack for PT1000 |
| `Port_RS232` | 1 | DB-9 female D-Sub serial port | Amphenol Commercial DB9F, gold-plated contacts |
| `Port_USB` | 1 | Stacked USB-A female & USB-B female | Amphenol USB 2.0 dual receptacle |
| `Port_IEC` | 1 | 2.1 mm DC power barrel input jack | Switchcraft 712A locking DC coaxial receptacle |

---

## 5. Articulated Electrode Stand (Body_StandAssembly)

| Part ID | Qty | Description | Specification |
| :--- | :--- | :--- | :--- |
| `Body_StandBase` | 1 | Die-cast zinc anti-tip counterweight | 1.8 kg Zamak 3 die casting, textured powder coat |
| `Foot_StandPad_1`..`3` | 3 | Base non-slip rubber pads | High-friction synthetic nitrile rubber |
| `Body_StandMast` | 1 | Vertical guide mast column | ⌀14 mm 304 centerless ground stainless steel rod |
| `Pivot_ArmBase` | 1 | Height-adjustable swivel clamp collar | CNC machined aluminum with knurled thumbscrew `Knob_MastClamp` |
| `Pivot_ArmLower` | 1 | Lower parallel dual-linkage rods | ⌀4 mm twin polished 316 stainless rods, $L=150\text{ mm}$ |
| `Pivot_ArmElbow` | 1 | Counterbalance knuckle pivot joint | Sealed ball bearings with internal torsion spring |
| `Pivot_ArmUpper` | 1 | Upper parallel dual-linkage rods | ⌀4 mm twin polished 316 stainless rods, $L=140\text{ mm}$ |
| `Pivot_HolderHead` | 1 | Parallelogram self-leveling clamp head | Chemical-resistant POM clamping head for 3 sensors |
| `Fastener_CableClip_1`..`3`| 3 | Molded articulated cable routing clips | Polypropylene snap-clips securing coax & ATC wires |

---

## 6. Sensor Electrodes & Optics

| Part ID | Qty | Description | Specification |
| :--- | :--- | :--- | :--- |
| `Glass_ElectrodeStem` | 1 | Combination pH electrode shaft | ⌀12 mm Schott DURAN borosilicate glass 3.3 ($IOR=1.52$) |
| `Glass_PHBulb` | 1 | Thin pH-sensitive membrane bulb | High-alkali low-resistance lithium glass membrane |
| `Body_ElectrolyteGel` | 1 | Reference electrolyte column | 3M KCl saturated gel with AgCl, translucent cyan |
| `Body_RefWire` | 1 | Internal reference electrode wire | 99.99% pure silver wire coated with AgCl |
| `Body_CeramicDiaphragm` | 1 | Liquid reference junction frit | Porous ceramic diaphragm (leak rate 15–20 µL/hr) |
| `Body_StorageCap` | 1 | Wetting storage cap with screw seal | Translucent HDPE vial filled with 3M KCl solution |
| `Body_ATCProbeAssembly` | 1 | Automatic temperature compensator | ⌀3 mm 316L SS sheath, PT1000 Class A platinum RTD |
| `Body_ElectrodeCoaxCable`| 1 | Low-noise shielded coaxial cable | RG-174A/U low-microphonic cable with strain reliefs |
| `Body_ATCCable` | 1 | 2-wire shielded sensor cable | Flexible silicone rubber jacketed twisted pair |

---

## 7. Glassware & Benchtop Accessories

| Part ID | Qty | Description | Specification |
| :--- | :--- | :--- | :--- |
| `Glass_Beaker` | 1 | 150 mL Griffin low-form beaker | Borosilicate 3.3, fire-polished rim, pour spout ($IOR=1.52$) |
| `Body_BeakerGrads` | 1 | Fired-on white ceramic graduations | 50, 100, 150 mL scale rings with marking spot |
| `Glass_SolutionLiquid` | 1 | Aqueous sample/buffer solution | Refractive liquid ($IOR=1.333$), transmission: 0.92, curved meniscus |
| `Body_BufferBottle_4` | 1 | 100 mL calibration buffer bottle pH 4.01 | Red cap, HDPE bottle, NIST traceable phthalate buffer |
| `Body_BufferBottle_7` | 1 | 100 mL calibration buffer bottle pH 7.00 | Yellow cap, HDPE bottle, NIST traceable phosphate buffer |
| `Body_BufferBottle_10` | 1 | 100 mL calibration buffer bottle pH 10.01| Blue cap, HDPE bottle, NIST traceable carbonate buffer |
| `Body_WashBottle` | 1 | 500 mL laboratory wash bottle | Translucent LDPE body, curved dispensing spout, deionized water |

---

## 8. Power Supply & Bench Continuity

| Part ID | Qty | Description | Specification |
| :--- | :--- | :--- | :--- |
| `Power_Receptacle_Duplex`| 1 | Laboratory bench duplex receptacle box | 120V/20A industrial NEMA 5-15R pedestal box |
| `Power_Plug_NEMA` | 1 | Molded 3-prong NEMA 5-15P AC plug | Solid brass blades, grounding pin, vinyl strain relief |
| `Power_Cord_SJTOW` | 1 | 3-conductor heavy-duty line cord | 18 AWG 300V oil/water resistant SJTOW flexible cable |
| `Body_PowerAdapter_Brick`| 1 | Desktop 12V 2.5A power adapter | Medical grade IEC 60601-1 SMPS adapter with green LED |
| `Cable_DC_Power` | 1 | Low-voltage DC umbilical cable | 18 AWG 2-conductor copper wire with 2.1 mm barrel plug |
