"""
sem_controller.py — Pure Python Finite State Machine, Vacuum Kinetics,
Electron Optics & Multi-Detector Scan Logic for the ZEISS GeminiSEM 500 Digital Twin.

Implements exact hardware safety interlocks per:
- ZEISS GeminiSEM Series Instruction Manual (Doc. 349500-8038-000)
- ZEISS 105-mm 5-Axis DC Motorized Stage Manual (Doc. 349347-9013-000)
"""

from datetime import datetime, timezone
import math


SPECIMEN_CATALOG = [
    {
        "id": "ommatidia",
        "name": "Drosophila melanogaster Compound Eye",
        "category": "Biological · Entomology",
        "default_mag": 15000,
        "conductive_native": False,
        "mean_atomic_number": 6.8,
        "optimal_wd_mm": 8.5,
        "optimal_eht_kv": 5.0,
        "elements": [
            {"symbol": "C", "line": "Kα", "energy_kev": 0.277, "wt_pct": 54.2},
            {"symbol": "O", "line": "Kα", "energy_kev": 0.525, "wt_pct": 29.8},
            {"symbol": "N", "line": "Kα", "energy_kev": 0.392, "wt_pct": 12.4},
            {"symbol": "Ca", "line": "Kα", "energy_kev": 3.691, "wt_pct": 3.6},
        ],
    },
    {
        "id": "pollen",
        "name": "Hibiscus syriacus (Echinate Pollen Grain)",
        "category": "Biological · Palynology",
        "default_mag": 12000,
        "conductive_native": False,
        "mean_atomic_number": 6.5,
        "optimal_wd_mm": 9.0,
        "optimal_eht_kv": 3.0,
        "elements": [
            {"symbol": "C", "line": "Kα", "energy_kev": 0.277, "wt_pct": 60.5},
            {"symbol": "O", "line": "Kα", "energy_kev": 0.525, "wt_pct": 32.8},
            {"symbol": "Ca", "line": "Kα", "energy_kev": 3.691, "wt_pct": 3.4},
            {"symbol": "K", "line": "Kα", "energy_kev": 3.314, "wt_pct": 3.3},
        ],
    },
    {
        "id": "morpho",
        "name": "Morpho rhetenor Photonic Wing Scale",
        "category": "Biomimetic · Nanophotonics",
        "default_mag": 45000,
        "conductive_native": False,
        "mean_atomic_number": 6.4,
        "optimal_wd_mm": 6.5,
        "optimal_eht_kv": 2.0,
        "elements": [
            {"symbol": "C", "line": "Kα", "energy_kev": 0.277, "wt_pct": 56.5},
            {"symbol": "O", "line": "Kα", "energy_kev": 0.525, "wt_pct": 31.0},
            {"symbol": "N", "line": "Kα", "energy_kev": 0.392, "wt_pct": 12.5},
        ],
    },
    {
        "id": "finfet",
        "name": "5 nm FinFET CMOS Logic Gate Cross-Section",
        "category": "Semiconductor · Nanoelectronics",
        "default_mag": 120000,
        "conductive_native": True,
        "mean_atomic_number": 22.4,
        "optimal_wd_mm": 5.0,
        "optimal_eht_kv": 15.0,
        "elements": [
            {"symbol": "Si", "line": "Kα", "energy_kev": 1.740, "wt_pct": 48.5},
            {"symbol": "O", "line": "Kα", "energy_kev": 0.525, "wt_pct": 16.4},
            {"symbol": "W", "line": "Mα", "energy_kev": 1.775, "wt_pct": 21.8},
            {"symbol": "Hf", "line": "Mα", "energy_kev": 1.645, "wt_pct": 8.1},
            {"symbol": "Cu", "line": "Kα", "energy_kev": 8.040, "wt_pct": 5.2},
        ],
    },
    {
        "id": "zno_tetrapods",
        "name": "ZnO Wurtzite Tetrapod Nanowires",
        "category": "Nanomaterials · Metal Oxide",
        "default_mag": 65000,
        "conductive_native": True,
        "mean_atomic_number": 23.8,
        "optimal_wd_mm": 7.5,
        "optimal_eht_kv": 10.0,
        "elements": [
            {"symbol": "Zn", "line": "Lα", "energy_kev": 1.012, "wt_pct": 78.4},
            {"symbol": "O", "line": "Kα", "energy_kev": 0.525, "wt_pct": 19.6},
            {"symbol": "Al", "line": "Kα", "energy_kev": 1.486, "wt_pct": 2.0},
        ],
    },
    {
        "id": "al_cu_alloy",
        "name": "AA2024-T3 Al-Cu-Mg-Si Aerospace Alloy",
        "category": "Metallurgy · Backscatter Z-Contrast",
        "default_mag": 25000,
        "conductive_native": True,
        "mean_atomic_number": 13.9,
        "optimal_wd_mm": 8.5,
        "optimal_eht_kv": 20.0,
        "elements": [
            {"symbol": "Al", "line": "Kα", "energy_kev": 1.486, "wt_pct": 91.2},
            {"symbol": "Cu", "line": "Kα", "energy_kev": 8.040, "wt_pct": 4.8},
            {"symbol": "Mg", "line": "Kα", "energy_kev": 1.253, "wt_pct": 1.8},
            {"symbol": "Si", "line": "Kα", "energy_kev": 1.740, "wt_pct": 1.4},
            {"symbol": "Mn", "line": "Kα", "energy_kev": 5.898, "wt_pct": 0.8},
        ],
    },
]


class SEMController:
    # Operating States
    STATE_OFF = "OFF"
    STATE_STANDBY = "STANDBY"
    STATE_VACUUM_ROUGHING = "VACUUM_ROUGHING"
    STATE_VACUUM_TURBO = "VACUUM_TURBO"
    STATE_HIGH_VACUUM = "HIGH_VACUUM"
    STATE_GUN_WARMUP = "GUN_WARMUP"
    STATE_BEAM_ACTIVE = "BEAM_ACTIVE"
    STATE_IMAGING = "IMAGING"
    STATE_VENTING = "VENTING"
    STATE_VENTED = "VENTED"

    # Detectors
    DET_SE2 = "SE2_Everhart_Thornley"
    DET_IN_LENS = "InLens_Secondary"
    DET_BSE = "BSE_Backscatter"
    DET_EDS = "EDS_Silicon_Drift"

    # Scan Modes
    SCAN_FAST = "FAST_SURVEY_512"
    SCAN_SLOW = "SLOW_PHOTO_1024"
    SCAN_LINE = "LINE_PROFILE"
    SCAN_FROZEN = "FROZEN"

    VALID_APERTURES_UM = (30.0, 60.0, 120.0)
    ATM_PRESSURE_PA = 101325.0

    def __init__(self):
        # Electrical & Hardware Interlocks
        self.is_plugged_in = True
        self.main_power_switch = False
        self.chamber_door_closed = True
        self.nitrogen_vent_open = False
        self.column_valve_open = False
        self.bse_retracted = False
        self.water_chiller_flow_ok = True
        self.lens_temp_c = 20.5

        # State Machine
        self.state = self.STATE_OFF

        # Vacuum System (ZEISS GeminiSEM 500 + Pfeiffer HiPace 300 / HiScroll 6)
        self.rough_pump_active = False
        self.turbo_pump_active = False
        self.turbo_rpm = 0
        self.scroll_rpm = 0
        self.chamber_pressure_pa = self.ATM_PRESSURE_PA  # Atmospheric pressure (101,325 Pa = 1013.25 mbar)
        self.igp_pressure_pa = 2.0e-8                    # FEG gun chamber Ion Getter Pump UHV (2.0e-10 mbar)
        self.target_high_vac_pa = 1.4e-4                 # Operating ready UHV (1.4e-6 mbar)
        self.high_vac_threshold_pa = 2.5e-4              # UHV readiness threshold (<= 2.5e-4 Pa)

        # Electron Column & Optics
        self.accel_voltage_kv = 5.0          # EHT (0.02 to 30.0 kV)
        self.beam_booster_kv = 8.0           # Gemini +8 kV in-column beam booster
        self.probe_current_pa = 200.0        # Probe beam current (3 pA to 20,000 pA)
        self.aperture_um = 30.0              # 30, 60, or 120 um aperture strip
        self.magnification = 5000            # 50x to 300,000x
        self.working_distance_mm = 8.5       # Analytical WD (mm), coupled to stage Z
        self.focus_mm = 8.5                  # Objective lens focal distance (mm)
        self.focus_coarse = 50.0             # Normalized dial 0..100
        self.focus_fine = 50.0               # Normalized dial 0..100
        self.stigmator_x = 0.0               # -100 to +100 %
        self.stigmator_y = 0.0               # -100 to +100 %

        # 5-Axis Motorized Eucentric Stage (ZEISS 105-mm DC Stage 349347-9013-000)
        self.stage_x_mm = 0.0                # -52.5 to +52.5 mm (clamped +-65 mm max)
        self.stage_y_mm = 0.0                # -52.5 to +52.5 mm
        self.stage_z_mm = 8.5                # 2.0 to 40.0 mm
        self.stage_tilt_deg = 0.0            # -5.0 to +70.0 deg
        self.stage_rotation_deg = 0.0        # 0.0 to 360.0 deg

        # Active Detector, Specimen & Sputter Coating
        self.active_detector = self.DET_SE2
        self.active_specimen_index = 0
        self.is_sputter_coated = True        # 5.0 nm Au/Pd conductive film
        self.sputter_thickness_nm = 5.0
        self.contrast = 58.0
        self.brightness = 50.0

        # Raster Scan Acquisition State
        self.scan_mode = self.SCAN_FAST
        self.scan_resolution = (512, 384)
        self.dwell_time_us = 1.6
        self.scan_line = 0
        self.scan_progress = 0.0
        self.is_scanning = False
        self.captured_micrographs = []
        self.audit_log = []

    @property
    def has_power(self) -> bool:
        return bool(self.is_plugged_in and self.main_power_switch)

    @property
    def chamber_pressure_mbar(self) -> float:
        return self.chamber_pressure_pa * 0.01

    @property
    def igp_pressure_mbar(self) -> float:
        return self.igp_pressure_pa * 0.01

    def _log_event(self, event_name: str):
        self.audit_log.append({
            "timestamp_utc": datetime.now(timezone.utc).isoformat(),
            "event": event_name,
            "state": self.state,
            "chamber_pressure_pa": self.chamber_pressure_pa,
            "chamber_pressure_mbar": self.chamber_pressure_mbar,
            "eht_kv": self.accel_voltage_kv if self.state in (self.STATE_BEAM_ACTIVE, self.STATE_IMAGING) else 0.0,
            "magnification": self.magnification,
            "detector": self.active_detector,
            "specimen_id": SPECIMEN_CATALOG[self.active_specimen_index]["id"],
        })

    def connect_power_cable(self, plugged: bool):
        self.is_plugged_in = bool(plugged)
        if not self.is_plugged_in:
            self._emergency_shutdown()
        self._log_event("POWER_CABLE_CONNECTED" if self.is_plugged_in else "POWER_CABLE_UNPLUGGED")

    def set_main_power(self, power_on: bool):
        if not self.is_plugged_in and power_on:
            raise RuntimeError("Cannot power on: AC power cord is unplugged.")
        self.main_power_switch = bool(power_on)
        if self.main_power_switch:
            self.state = self.STATE_STANDBY if self.chamber_door_closed else self.STATE_VENTED
            self._log_event("MAIN_POWER_ON")
        else:
            self._emergency_shutdown()
            self._log_event("MAIN_POWER_OFF")

    def _emergency_shutdown(self):
        self.main_power_switch = False
        self.rough_pump_active = False
        self.turbo_pump_active = False
        self.column_valve_open = False
        self.is_scanning = False
        self.turbo_rpm = 0
        self.scroll_rpm = 0
        self.state = self.STATE_OFF

    def close_chamber_door(self, closed: bool):
        closed = bool(closed)
        if not closed:
            # Rule 3 (control_spec.md §1 & 349347-9013-000 §2.3.3 / §3.4):
            # Cannot open UHV door under vacuum (< 95,000 Pa) or while electron beam is active.
            if self.chamber_pressure_pa < 95000.0 or self.state in (
                self.STATE_VACUUM_ROUGHING,
                self.STATE_VACUUM_TURBO,
                self.STATE_HIGH_VACUUM,
                self.STATE_VENTING,
            ):
                raise RuntimeError("Cannot open chamber door under vacuum; vent chamber first.")
            if self.column_valve_open or self.is_scanning or self.state in (
                self.STATE_GUN_WARMUP,
                self.STATE_BEAM_ACTIVE,
                self.STATE_IMAGING,
            ):
                raise RuntimeError("Cannot open chamber door while electron beam is active; vent chamber first.")

            # Retract BSE detector & zero stage tilt safely to protect polepiece per 349347-9013-000
            self.bse_retracted = True
            self.stage_tilt_deg = 0.0
            self.chamber_door_closed = False
            if self.has_power:
                self.state = self.STATE_VENTED
            self._log_event("CHAMBER_DOOR_OPENED")
        else:
            self.chamber_door_closed = True
            self.nitrogen_vent_open = False
            if self.has_power and self.state == self.STATE_VENTED:
                self.state = self.STATE_STANDBY
            self._log_event("CHAMBER_DOOR_CLOSED")

    def pump_down_chamber(self, immediate: bool = True):
        """Initiates two-stage vacuum pump sequence: Roughing Scroll -> Pfeiffer HiPace 300 Turbo."""
        if not self.has_power:
            raise RuntimeError("Instrument is unpowered.")
        if not self.chamber_door_closed:
            raise RuntimeError("Chamber door is open; interlock prevents pump down.")

        self.nitrogen_vent_open = False
        self.state = self.STATE_VACUUM_ROUGHING
        self.rough_pump_active = True
        self.scroll_rpm = 1800

        if immediate:
            self.chamber_pressure_pa = 10.0
            self.state = self.STATE_VACUUM_TURBO
            self.turbo_pump_active = True
            self.turbo_rpm = 90000
            self.chamber_pressure_pa = self.target_high_vac_pa
            self.state = self.STATE_HIGH_VACUUM
            self._log_event("HIGH_VACUUM_REACHED")
        else:
            self._log_event("VACUUM_ROUGHING_STARTED")

    def step_vacuum(self, dt_sec: float = 0.5):
        """Advances progressive two-stage vacuum pumpdown or N2 venting."""
        if not self.has_power:
            return
        dt = max(0.01, float(dt_sec))
        if self.state == self.STATE_VACUUM_ROUGHING:
            self.chamber_pressure_pa = max(10.0, self.chamber_pressure_pa * math.exp(-dt * 2.2))
            self.scroll_rpm = min(1800, int(self.scroll_rpm + 900 * dt))
            if self.chamber_pressure_pa <= 10.5:
                self.chamber_pressure_pa = 10.0
                self.state = self.STATE_VACUUM_TURBO
                self.turbo_pump_active = True
        elif self.state == self.STATE_VACUUM_TURBO:
            self.chamber_pressure_pa = max(self.target_high_vac_pa, self.chamber_pressure_pa * (10.0 ** (-dt * 1.8)))
            self.turbo_rpm = min(90000, int(self.turbo_rpm + 45000 * dt))
            if self.chamber_pressure_pa <= self.high_vac_threshold_pa:
                if self.chamber_pressure_pa <= self.target_high_vac_pa * 1.05:
                    self.chamber_pressure_pa = self.target_high_vac_pa
                self.turbo_rpm = 90000
                self.state = self.STATE_HIGH_VACUUM
                self._log_event("HIGH_VACUUM_REACHED")
        elif self.state == self.STATE_HIGH_VACUUM and self.turbo_pump_active:
            if self.chamber_pressure_pa > self.target_high_vac_pa:
                self.chamber_pressure_pa = max(self.target_high_vac_pa, self.chamber_pressure_pa * (10.0 ** (-dt * 1.8)))
                if self.chamber_pressure_pa <= self.target_high_vac_pa * 1.05:
                    self.chamber_pressure_pa = self.target_high_vac_pa
        elif self.state == self.STATE_VENTING:
            self.chamber_pressure_pa = min(self.ATM_PRESSURE_PA, self.chamber_pressure_pa + 65000.0 * dt)
            self.turbo_rpm = max(0, int(self.turbo_rpm - 45000 * dt))
            if self.chamber_pressure_pa >= self.ATM_PRESSURE_PA:
                self.chamber_pressure_pa = self.ATM_PRESSURE_PA
                self.turbo_rpm = 0
                self.state = self.STATE_VENTED
                self._log_event("CHAMBER_VENTED")

    def vent_chamber(self):
        """Vents specimen chamber with dry nitrogen gas for sample exchange."""
        if not self.has_power:
            raise RuntimeError("Instrument is unpowered.")
        if self.state in (self.STATE_BEAM_ACTIVE, self.STATE_IMAGING, self.STATE_GUN_WARMUP):
            self.extinguish_beam()
        self.column_valve_open = False
        self.turbo_pump_active = False
        self.rough_pump_active = False
        self.turbo_rpm = 0
        self.scroll_rpm = 0
        self.nitrogen_vent_open = True
        self.state = self.STATE_VENTING
        self.chamber_pressure_pa = 101325.0
        self.state = self.STATE_VENTED
        self._log_event("CHAMBER_VENTED")

    def energize_electron_beam(self):
        """Energizes Schottky FEG cathode and opens pneumatic column gate valve."""
        if not self.has_power:
            raise RuntimeError("Instrument is unpowered.")
        if not self.chamber_door_closed:
            raise RuntimeError("Safety interlock: specimen chamber open.")
        if self.chamber_pressure_pa > 1.0e-3 or self.state not in (
            self.STATE_HIGH_VACUUM,
            self.STATE_GUN_WARMUP,
            self.STATE_BEAM_ACTIVE,
            self.STATE_IMAGING,
        ):
            raise RuntimeError("Vacuum pressure too high for electron beam generation; pump down to High Vacuum first.")

        self.state = self.STATE_GUN_WARMUP
        self.column_valve_open = True
        self.state = self.STATE_BEAM_ACTIVE
        self._log_event("BEAM_ENERGIZED")

    def extinguish_beam(self):
        self.is_scanning = False
        self.column_valve_open = False
        if self.state in (self.STATE_BEAM_ACTIVE, self.STATE_IMAGING, self.STATE_GUN_WARMUP):
            self.state = self.STATE_HIGH_VACUUM
            self._log_event("BEAM_EXTINGUISHED")

    def start_imaging(self, mode: str = None):
        if not self.has_power:
            raise RuntimeError("Instrument is unpowered.")
        if self.state not in (self.STATE_BEAM_ACTIVE, self.STATE_IMAGING):
            raise RuntimeError("Electron beam must be energized before imaging.")
        if mode is not None:
            self.set_scan_mode(mode)
        self.state = self.STATE_IMAGING
        self.is_scanning = self.scan_mode != self.SCAN_FROZEN
        self.scan_line = 0
        self.scan_progress = 0.0
        self._log_event(f"SCAN_STARTED_{self.scan_mode}")

    def stop_imaging(self):
        self.is_scanning = False
        self.scan_mode = self.SCAN_FROZEN
        if self.state == self.STATE_IMAGING:
            self.state = self.STATE_BEAM_ACTIVE
            self._log_event("SCAN_FROZEN")

    def set_scan_mode(self, mode: str):
        valid = {
            self.SCAN_FAST: ((512, 384), 1.6),
            self.SCAN_SLOW: ((1024, 768), 25.6),
            self.SCAN_LINE: ((512, 384), 6.4),
            self.SCAN_FROZEN: (self.scan_resolution, self.dwell_time_us),
        }
        if mode not in valid:
            raise ValueError(f"Unknown scan mode '{mode}'.")
        self.scan_mode = mode
        self.scan_resolution, self.dwell_time_us = valid[mode]
        if mode == self.SCAN_FROZEN:
            self.is_scanning = False

    def step_scan(self, lines: int = 32) -> dict:
        """Advances the progressive raster scanline sweep."""
        if not self.has_power or self.state != self.STATE_IMAGING or not self.is_scanning:
            return {"is_scanning": False, "scan_line": self.scan_line, "progress": self.scan_progress}
        total_lines = self.scan_resolution[1]
        self.scan_line = min(total_lines, self.scan_line + max(1, int(lines)))
        self.scan_progress = round(self.scan_line / float(total_lines), 4)
        if self.scan_line >= total_lines:
            if self.scan_mode == self.SCAN_SLOW:
                self.is_scanning = False
                self._capture_micrograph_record()
            else:
                self.scan_line = 0
        return {"is_scanning": self.is_scanning, "scan_line": self.scan_line, "progress": self.scan_progress}

    def _capture_micrograph_record(self):
        spec = SPECIMEN_CATALOG[self.active_specimen_index]
        record = {
            "timestamp_utc": datetime.now(timezone.utc).isoformat(),
            "specimen_id": spec["id"],
            "specimen_name": spec["name"],
            "detector": self.active_detector,
            "eht_kv": self.accel_voltage_kv,
            "probe_current_pa": self.probe_current_pa,
            "aperture_um": self.aperture_um,
            "magnification": self.magnification,
            "working_distance_mm": self.working_distance_mm,
            "resolution": f"{self.scan_resolution[0]}x{self.scan_resolution[1]}",
            "sputter_coated": self.is_sputter_coated,
            "sputter_thickness_nm": self.sputter_thickness_nm,
        }
        self.captured_micrographs.append(record)
        self._log_event("MICROGRAPH_CAPTURED")
        return record

    def set_magnification(self, mag: int):
        mag = int(mag)
        if mag < 50 or mag > 300000:
            raise ValueError("Magnification must be between 50x and 300,000x.")
        self.magnification = mag

    def set_voltage(self, kv: float):
        kv = float(kv)
        if kv < 0.02 or kv > 30.0:
            raise ValueError("Accelerating voltage must be between 0.02 and 30.0 kV.")
        self.accel_voltage_kv = round(kv, 3)

    def set_probe_current(self, current_pa: float):
        current_pa = float(current_pa)
        if current_pa < 3.0 or current_pa > 20000.0:
            raise ValueError("Probe current must be between 3.0 pA and 20,000 pA.")
        self.probe_current_pa = round(current_pa, 1)

    def set_aperture_um(self, um: float):
        if isinstance(um, bool):
            raise ValueError("Aperture must be 30, 60, or 120 um.")
        val = float(um)
        if val not in self.VALID_APERTURES_UM:
            raise ValueError(f"Invalid aperture {um} um; must be 30, 60, or 120 um.")
        self.aperture_um = val
        self._log_event(f"APERTURE_SET_{int(val)}UM")

    def set_focus(self, coarse: float = None, fine: float = None, focus_mm: float = None):
        if coarse is not None:
            self.focus_coarse = max(0.0, min(100.0, float(coarse)))
        if fine is not None:
            self.focus_fine = max(0.0, min(100.0, float(fine)))
        if focus_mm is not None:
            self.focus_mm = max(1.0, min(45.0, float(focus_mm)))
        else:
            offset = ((self.focus_coarse - 50.0) * 0.08) + ((self.focus_fine - 50.0) * 0.005)
            self.focus_mm = round(max(1.0, min(45.0, self.working_distance_mm + offset)), 4)

    def auto_focus(self):
        if not self.has_power:
            raise RuntimeError("Instrument is unpowered.")
        self.focus_coarse = 50.0
        self.focus_fine = 50.0
        self.focus_mm = self.working_distance_mm
        self.stigmator_x = 0.0
        self.stigmator_y = 0.0
        self._log_event("AUTO_FOCUS_COMPLETED")

    def auto_contrast_brightness(self):
        if not self.has_power:
            raise RuntimeError("Instrument is unpowered.")
        self.contrast = 62.0 if self.active_detector == self.DET_BSE else 58.0
        self.brightness = 50.0
        self._log_event("AUTO_CB_COMPLETED")

    def set_stigmator(self, sx: float = None, sy: float = None):
        if sx is not None:
            self.stigmator_x = max(-100.0, min(100.0, float(sx)))
        if sy is not None:
            self.stigmator_y = max(-100.0, min(100.0, float(sy)))

    def set_detector(self, det: str):
        valid = [self.DET_SE2, self.DET_IN_LENS, self.DET_BSE, self.DET_EDS]
        if det not in valid:
            raise ValueError(f"Unknown detector {det}. Must be one of {valid}")
        self.active_detector = det
        if det == self.DET_BSE:
            self.bse_retracted = not self.chamber_door_closed

    def select_specimen(self, index_or_id):
        if isinstance(index_or_id, int):
            if 0 <= index_or_id < len(SPECIMEN_CATALOG):
                self.active_specimen_index = index_or_id
                return SPECIMEN_CATALOG[self.active_specimen_index]
            raise ValueError("Specimen index out of range.")
        for idx, spec in enumerate(SPECIMEN_CATALOG):
            if spec["id"] == index_or_id:
                self.active_specimen_index = idx
                return spec
        raise ValueError(f"Unknown specimen '{index_or_id}'.")

    def set_sputter_coating(self, coated: bool, thickness_nm: float = 5.0):
        self.is_sputter_coated = bool(coated)
        self.sputter_thickness_nm = max(0.0, min(50.0, float(thickness_nm))) if self.is_sputter_coated else 0.0
        self._log_event("SPUTTER_COATED_AUPD" if self.is_sputter_coated else "SPUTTER_COATING_REMOVED")

    def move_stage(self, x=None, y=None, z=None, tilt=None, rot=None):
        # Per ZEISS 105-mm DC Stage Manual (349347-9013-000 §2.3.3):
        # When chamber door is open, Z and Tilt axes are locked for safety.
        if not self.chamber_door_closed and (z is not None or tilt is not None):
            raise RuntimeError("Stage safety interlock: Z and Tilt axes are locked while chamber door is open.")
        if x is not None:
            self.stage_x_mm = max(-65.0, min(65.0, float(x)))
        if y is not None:
            self.stage_y_mm = max(-65.0, min(65.0, float(y)))
        if z is not None:
            self.stage_z_mm = max(2.0, min(40.0, float(z)))
            self.working_distance_mm = self.stage_z_mm
        if tilt is not None:
            self.stage_tilt_deg = max(-5.0, min(70.0, float(tilt)))
        if rot is not None:
            self.stage_rotation_deg = float(rot) % 360.0

    def de_broglie_wavelength_pm(self) -> float:
        """Computes relativistic electron de Broglie wavelength (pm) at landing EHT."""
        h = 6.62607015e-34
        e = 1.602176634e-19
        m_e = 9.1093837015e-31
        c = 2.99792458e8
        v_volts = max(1.0, self.accel_voltage_kv * 1000.0)
        momentum = math.sqrt(2.0 * m_e * e * v_volts * (1.0 + (e * v_volts) / (2.0 * m_e * c * c)))
        return round((h / momentum) * 1.0e12, 4)

    def mean_free_path_m(self) -> float:
        """Computes gas/electron mean free path (m) from chamber pressure (6.8e-5 / P_mbar == 6.8e-3 / P_pa)."""
        mfp = 6.8e-3 / max(1.0e-12, self.chamber_pressure_pa)
        return float(f"{mfp:.6g}")

    def resolution_nm(self) -> float:
        """Computes practical Gemini II electron probe resolution (nm) from diffraction, Cs, defocus, and stigmator."""
        wavelength_nm = self.de_broglie_wavelength_pm() * 1.0e-3
        alpha_rad = 0.0085 * (self.aperture_um / 30.0)
        d_diff_nm = 0.61 * wavelength_nm / alpha_rad
        c_s_mm = 1.2 * ((max(2.0, self.working_distance_mm) / 8.5) ** 1.2)
        d_sph_nm = 0.5 * (c_s_mm * 1.0e6) * (alpha_rad ** 3)
        defocus_delta_mm = abs(self.focus_mm - self.working_distance_mm)
        d_defocus_nm = defocus_delta_mm * (alpha_rad * 1.0e3) * 1.5
        d_stig_nm = math.hypot(self.stigmator_x, self.stigmator_y) * 0.22
        return round(math.sqrt(d_diff_nm ** 2 + d_sph_nm ** 2 + d_defocus_nm ** 2 + d_stig_nm ** 2), 3)

    def compute_optics_quality(self) -> dict:
        """Computes physical defocus blur, astigmatism smear, charging level, resolution, and SNR."""
        spec = SPECIMEN_CATALOG[self.active_specimen_index]
        defocus_delta_mm = abs(self.focus_mm - self.working_distance_mm)
        defocus_blur_px = round(defocus_delta_mm * math.log10(max(50, self.magnification)) * 2.4, 3)
        stig_blur_px = round(math.hypot(self.stigmator_x, self.stigmator_y) * 0.08, 3)
        charging_index = 0.0
        if not spec["conductive_native"] and (not self.is_sputter_coated or self.sputter_thickness_nm <= 0.0) and self.accel_voltage_kv > 2.0:
            charging_index = round((self.accel_voltage_kv - 2.0) * (self.probe_current_pa / 200.0) * 0.25, 3)
        snr = round(math.sqrt(max(1.0, self.probe_current_pa * self.dwell_time_us)) * 0.85, 2)
        hfw_um = round(120000.0 / float(self.magnification), 4)
        return {
            "defocus_blur_px": defocus_blur_px,
            "stig_blur_px": stig_blur_px,
            "charging_index": charging_index,
            "snr": snr,
            "horizontal_field_width_um": hfw_um,
            "aperture_um": self.aperture_um,
            "de_broglie_wavelength_pm": self.de_broglie_wavelength_pm(),
            "resolution_nm": self.resolution_nm(),
            "mean_free_path_m": self.mean_free_path_m(),
        }

    def get_eds_spectrum(self) -> list:
        """Returns characteristic X-ray lines for the active specimen (+ Au/Pd coating if applied)."""
        spec = SPECIMEN_CATALOG[self.active_specimen_index]
        peaks = []
        for el in spec["elements"]:
            # Only excite lines whose critical excitation energy < EHT
            if el["energy_kev"] <= self.accel_voltage_kv * 0.85:
                peaks.append(dict(el))
        if self.is_sputter_coated and self.sputter_thickness_nm > 0.0 and self.accel_voltage_kv >= 2.5:
            # Scale Au/Pd coating signal subtly with film thickness around 5.0 nm baseline
            film_scale = (self.sputter_thickness_nm / 5.0) ** 0.7
            peaks.append({"symbol": "Au", "line": "Mα", "energy_kev": 2.120, "wt_pct": round(4.8 * film_scale, 2)})
            peaks.append({"symbol": "Pd", "line": "Lα", "energy_kev": 2.838, "wt_pct": round(1.2 * film_scale, 2)})
        return peaks

    def export_glp_csv(self) -> str:
        """Generates a GLP-compliant analytical CSV audit trail."""
        header = (
            "timestamp_utc,instrument_id,state,is_plugged_in,chamber_pressure_pa,chamber_pressure_mbar,"
            "igp_pressure_pa,igp_pressure_mbar,turbo_rpm,specimen_id,sputter_coated,sputter_thickness_nm,"
            "detector,eht_kv,probe_current_pa,aperture_um,magnification,"
            "working_distance_mm,focus_mm,stigmator_x,stigmator_y,stage_x_mm,stage_y_mm,stage_z_mm,"
            "stage_tilt_deg,stage_rot_deg,scan_mode,dwell_time_us,"
            "de_broglie_wavelength_pm,resolution_nm,mean_free_path_m,eds_dominant_peaks_kev"
        )
        spec = SPECIMEN_CATALOG[self.active_specimen_index]
        peaks_str = ";".join(f"{p['symbol']}:{p['energy_kev']}keV" for p in self.get_eds_spectrum())
        now_iso = datetime.now(timezone.utc).isoformat()
        row = (
            f"{now_iso},ZEISS-GEMINI-500,{self.state},{self.is_plugged_in},"
            f"{self.chamber_pressure_pa:.3e},{self.chamber_pressure_mbar:.3e},"
            f"{self.igp_pressure_pa:.3e},{self.igp_pressure_mbar:.3e},{self.turbo_rpm},"
            f"{spec['id']},{self.is_sputter_coated},{self.sputter_thickness_nm:.1f},"
            f"{self.active_detector},{self.accel_voltage_kv:.2f},{self.probe_current_pa:.1f},"
            f"{self.aperture_um:.1f},{self.magnification},"
            f"{self.working_distance_mm:.2f},{self.focus_mm:.3f},{self.stigmator_x:.1f},{self.stigmator_y:.1f},"
            f"{self.stage_x_mm:.2f},{self.stage_y_mm:.2f},{self.stage_z_mm:.2f},"
            f"{self.stage_tilt_deg:.1f},{self.stage_rotation_deg:.1f},"
            f"{self.scan_mode},{self.dwell_time_us:.1f},"
            f"{self.de_broglie_wavelength_pm():.4f},{self.resolution_nm():.3f},{self.mean_free_path_m():.4g},{peaks_str}"
        )
        return header + "\n" + row + "\n"

    def get_telemetry(self) -> dict:
        spec = SPECIMEN_CATALOG[self.active_specimen_index]
        return {
            "state": self.state,
            "power_continuity": self.has_power,
            "is_plugged_in": self.is_plugged_in,
            "main_power_switch": self.main_power_switch,
            "chamber_pressure_pa": self.chamber_pressure_pa,
            "chamber_pressure_mbar": self.chamber_pressure_mbar,
            "igp_pressure_pa": self.igp_pressure_pa,
            "igp_pressure_mbar": self.igp_pressure_mbar,
            "turbo_rpm": self.turbo_rpm,
            "scroll_rpm": self.scroll_rpm,
            "chamber_door_closed": self.chamber_door_closed,
            "column_valve_open": self.column_valve_open,
            "eht_kv": self.accel_voltage_kv,
            "beam_booster_kv": self.beam_booster_kv,
            "probe_current_pa": self.probe_current_pa,
            "aperture_um": self.aperture_um,
            "magnification": self.magnification,
            "working_distance_mm": self.working_distance_mm,
            "focus_mm": self.focus_mm,
            "stigmator_x": self.stigmator_x,
            "stigmator_y": self.stigmator_y,
            "de_broglie_wavelength_pm": self.de_broglie_wavelength_pm(),
            "resolution_nm": self.resolution_nm(),
            "mean_free_path_m": self.mean_free_path_m(),
            "active_detector": self.active_detector,
            "specimen_index": self.active_specimen_index,
            "specimen": spec,
            "is_sputter_coated": self.is_sputter_coated,
            "sputter_thickness_nm": self.sputter_thickness_nm,
            "scan_mode": self.scan_mode,
            "scan_progress": self.scan_progress,
            "is_scanning": self.is_scanning,
            "optics": self.compute_optics_quality(),
            "eds_peaks": self.get_eds_spectrum(),
            "stage": {
                "x": self.stage_x_mm,
                "y": self.stage_y_mm,
                "z": self.stage_z_mm,
                "tilt": self.stage_tilt_deg,
                "rotation": self.stage_rotation_deg,
            },
        }
