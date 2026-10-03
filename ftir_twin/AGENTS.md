# FTIR Spectrometer Digital Twin — Subagent Manifest

Adheres strictly to the 13-Subagent Puzzle Architecture (`.agents/AGENTS.md`).

## Subagent Responsibilities & Verification Gates
1. **twin_spec_researcher**: Specifications based on Thermo Scientific Nicolet iS50 / Bruker Alpha II (`docs/dimensions.md`, `docs/control_spec.md`).
2. **twin_chassis_builder**: External casting, seam lines, leveling feet at $Y=0$, recessed badge pocket, `Badge_SREdesigns`.
3. **twin_power_circuit_engineer**: Bench duplex outlet box (`Power_Receptacle_Duplex`), NEMA 5-15P plug, SJTOW cord, IEC C14 inlet socket, rear rocker switch (`Switch_Power`), SMPS, fan louvers at $X=-1.40$, physical circuit continuity.
4. **twin_sensor_data_engineer**: HeNe 632.8 nm laser lock sensor, DTGS pyroelectric detector, ATR contact pressure sensor, dry gas purge sensor.
5. **twin_display_silkscreen_engineer**: Dynamic high-DPI CanvasTexture (`flipY = false`), upright UVs (`1.0 - uv.getY()`), real-time FTIR spectrum (4000 to 400 cm⁻¹), interferogram mode.
6. **twin_controls_ergonomics_engineer**: Membrane keys, calibrated slip-clutch knob, swiveling pressure clamp tower kinematics ($0^\circ \to 90^\circ$).
7. **twin_internal_mechanics_builder**: Michelson interferometer (KBr beam splitter, fixed gold mirror with kinematic adjusters, moving gold mirror on voice-coil linear motor, Ever-Glo ceramic source, HeNe laser tube, breadboard baseplate).
8. **twin_environment_lighting_director**: Standard lab room setting, black epoxy bench (`INSTRUMENT_BENCH`) at datum $Y=0$, 3-point studio lighting, standardized interactive toolbar.
9. **twin_labware_fluid_specialist**: Type IIa diamond prism ATR stage, analyte deposits (Isopropanol, Acetone, Polystyrene NIST film, Toluene, Benzoic acid).
10. **twin_audio_sfx_synthesizer**: Web Audio API sound synthesizer (`sfx.js`): voice-coil frequency sweep, ratchet detent clicks, relay snaps, power switch clicks.
11. **twin_controller_logic_engineer**: Pure Python controller (`software/controller/ftir_controller.py`) with 100% test pass rate (`test_controller.py`).
12. **twin_web_ui_architect**: Gold standard collapsible side panels, dark lab theme CSS (`--bg: #0c1016`), camera view presets, mobile/iPhone touch tap architecture.
13. **twin_visual_qa_auditor**: Preflight audit capturing all viewpoints, closed-loop visual review using `view_file`, zero browser console errors.
