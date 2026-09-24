# Assembly hierarchy

FreeCAD body names and Blender object names should match.

```text
Centrifuge_Root
├── A_Enclosure
│   ├── A01_MainUpperHousing
│   ├── A02_LowerBaseTub
│   ├── A03_FrontControlBezel
│   ├── A04_RearPanel
│   ├── A05_SideMolding_L
│   ├── A06_SideMolding_R
│   ├── A07_RubberFoot_01 … _04
│   ├── A08_FootScrew_01 … _04
│   ├── A09_HousingScrew_*
│   ├── A10_Nameplate
│   ├── A11_Label_Biohazard
│   ├── A12_Label_HighSpeed
│   ├── A13_VentGrille_Rear
│   └── A14_IEC_Inlet
├── C_Chamber
│   ├── C01_ChamberBowl
│   ├── C02_RimGasket
│   ├── C03_FloorPlate
│   ├── C04_DriveCone
│   ├── C05_ShaftBoot
│   ├── C06_TachoSensor
│   ├── C07_Thermistor
│   ├── C08_ChamberScrew_*
│   └── C09_InsulationFoam
├── D_RotorAssembly                    # rotates about +Z when running
│   ├── D01_RotorBody
│   ├── D02_RotorLid
│   ├── D03_RotorLidORing
│   ├── D04_RotorLockKnob
│   ├── D05_Microtube_00 … _23
│   ├── D06_MicrotubeCap_00 … _23
│   └── D07_Liquid_00 … _23            # optional
├── B_LidAssembly                      # hinges about rear axis
│   ├── B01_LidFrame
│   ├── B02_Viewport
│   ├── B03_ViewportGasket
│   ├── B04_Hinge_L
│   ├── B05_Hinge_R
│   ├── B06_HingePin_*
│   ├── B08_Damper
│   ├── B09_LatchHook
│   ├── B11_HandleInsert
│   ├── B12_InterlockCam
│   ├── B13_LidMicroswitch
│   └── B14_LatchSolenoid
├── E_ControlPanel
│   ├── E01_Faceplate
│   ├── E02_LCD_Bezel
│   ├── E03_LCD_Display                # dynamic texture target
│   ├── E04…E13_SoftKeys
│   ├── E14_LED_Run
│   ├── E15_LED_Fault
│   └── E16_BezelScrew_*
└── F_DriveBay                         # optional cutaway
    ├── F01_MotorHousing
    ├── F02_MotorPlate
    ├── F04_MainPCB
    ├── F05_PowerPCB
    ├── F08_Fan
    ├── F09_Compressor
    ├── F10_Condenser
    ├── F11_ImbalanceSensor
    └── F12_EmergencyRelease
```

## Motion parents

| Child group               | Parent                               | DOF             |
| ------------------------- | ------------------------------------ | --------------- |
| All tubes/caps/liquids    | `D01_RotorBody` or `D_RotorAssembly` | Spin with rotor |
| Rotor lid + O-ring + knob | `D_RotorAssembly`                    | Spin with rotor |
| Entire lid assembly       | `B_LidAssembly` hinge empty          | Open 0–75°      |
| Soft keys / LCD           | `E_ControlPanel`                     | Static          |
| Drive cone                | `C_Chamber` / motor                  | Static (visual) |

## Export LODs

| LOD  | Contents                              |
| ---- | ------------------------------------- |
| LOD0 | Everything                            |
| LOD1 | No individual fasteners (G instances) |
| LOD2 | Outer shell + lid + rotor + LCD only  |
