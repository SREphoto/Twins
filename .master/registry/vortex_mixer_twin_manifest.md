# Manifest — `vortex_mixer_twin`

Gold standard. Paths relative to `vortex_mixer_twin/` unless noted.

## Runtime (must keep)

| Path                   | Role                                              |
| ---------------------- | ------------------------------------------------- |
| `software/viewer/`     | Live student app (procedural Three.js runtime)    |
| `software/controller/` | Pure Python state machine + test suite            |
| `scripts/serve.sh`     | Serve package standalone viewer                   |
| `scripts/test.sh`      | Controller unit test runner                       |
| `README.md`            | Human quick start guide                           |

## Specs & Process

| Path                   | Role                                              |
| ---------------------- | ------------------------------------------------- |
| `docs/PRODUCT_BRIEF.md`| Product brief & educational objectives            |
| `docs/control_spec.md` | States, controls, timer, pulse & fluidics math    |
| `docs/dimensions.md`   | 1:1 metric geometry specifications ($122\times 165\times 165\text{ mm}$) |
| `docs/BOM.md`          | Parametric bill of materials                      |
| `docs/STANDARD.md`     | Normative twin standard                           |

## Research

| Path                          | Role                                       |
| ----------------------------- | ------------------------------------------ |
| `research/sources.md`         | OEM citations & technical references       |
| `research/14_Vortex_Mixer.md` | Instrument background & operating theories |

## Key Features

- **Procedural 3D Model (`vortex_mixer3d.js`)**: Die-cast zinc alloy unibody lower housing with flared skirt, parting lines, and rear ventilation louvers. Recessed $2.0\text{ mm}$ console bezel pocket (`Body_Pocket_ConsoleBezel`) with brushed aluminum plate (`Body_Panel_Console`), dynamic CanvasTexture LCD (`UI_LCD`, `flipY = false`), optical rotary encoder speed dial (`Knob_Speed`), 3-position chrome bat toggle switch (`Btn_Switch_Mode`), tactile buttons (`Btn_Timer`, `Btn_Pulse`, `Btn_Power`), and bi-color status LED (`Body_LED_PowerRun`).
- **Kinematics & Forced-Vortex Dynamics**: High-durability vulcanized rubber cup head (`Pivot_CupHead`) undergoing eccentric orbital translation ($R = 2.0\text{ mm}$, $4.0\text{ mm}$ peak-to-peak orbit). Real-time vertex-deformed liquid mesh (`Glass_Fluid_VortexMeniscus`) simulating Navier-Stokes forced vortex parabolic depression ($z(r) \propto \omega^2 r^2 / 2g$) inside 15 mL Falcon conical tubes (`Glass_FalconTube`) and 1.5 mL microcentrifuge tubes (`Glass_MicroTube`) with viscosity damping.
- **Genuine 3D Fasteners & Hardware**: 4 vulcanized neoprene suction cup feet (`Foot_Leveling_FL/FR/RL/RR`) at Tabletop Datum $Y = 0$, DIN 912 hex socket cap screws (`Fastener_HexM3_*`), DIN 125 flat washers, rear IEC C14 power inlet socket (`Body_Assembly_PowerInlet`), rocker switch (`Btn_Switch_RearPower`), and canonical diamond-cut SRE brand plate (`Badge_SREdesigns`).
- **Web Audio Soundscape (`sfx.js`)**: Real-time synthesized motor vibration and AC hum (frequency proportional to RPM), mechanical toggle switch spring impulse clicks, dial detent friction, and tube contact chatter.
- **GLP Compliance**: Electronic batch record audit logging recording run duration, mode, setpoint/actual RPM, and sample fluid type with CSV export.
