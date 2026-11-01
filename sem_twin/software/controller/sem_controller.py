"""
sem_controller.py — Pure Python Finite State Machine & Interlock Logic
for Field Emission Scanning Electron Microscope (FE-SEM) Digital Twin.
"""

import time

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

    def __init__(self):
        # Electrical & Hardware Interlocks
        self.is_plugged_in = True
        self.main_power_switch = False
        self.chamber_door_closed = True
        self.nitrogen_vent_open = False
        
        # State Machine
        self.state = self.STATE_OFF
        
        # Vacuum System
        self.rough_pump_active = False
        self.turbo_pump_active = False
        self.chamber_pressure_pa = 101325.0  # Atmospheric pressure (Pa)
        self.target_high_vac_pa = 2.5e-4     # UHV threshold
        
        # Electron Column & Optics
        self.accel_voltage_kv = 5.0          # EHT (1.0 to 30.0 kV)
        self.probe_current_pa = 120.0        # Probe beam current (pA)
        self.magnification = 5000            # 50x to 300,000x
        self.working_distance_mm = 8.5       # WD (mm)
        self.focus_coarse = 50.0
        self.focus_fine = 50.0
        self.stigmator_x = 0.0
        self.stigmator_y = 0.0
        
        # 5-Axis Motorized Eucentric Stage
        self.stage_x_mm = 0.0                # -65 to +65 mm
        self.stage_y_mm = 0.0                # -65 to +65 mm
        self.stage_z_mm = 10.0               # 2 to 40 mm
        self.stage_tilt_deg = 0.0            # -5 to +70 deg
        self.stage_rotation_deg = 0.0        # 0 to 360 deg
        
        # Active Detector & Specimen
        self.active_detector = self.DET_SE2
        self.active_specimen_index = 0
        self.contrast = 55.0
        self.brightness = 50.0

    def connect_power_cable(self, plugged: bool):
        self.is_plugged_in = plugged
        if not self.is_plugged_in:
            self._emergency_shutdown()

    def set_main_power(self, power_on: bool):
        if not self.is_plugged_in and power_on:
            raise RuntimeError("Cannot power on: AC power cord is unplugged.")
        self.main_power_switch = power_on
        if self.main_power_switch:
            self.state = self.STATE_STANDBY
        else:
            self._emergency_shutdown()

    def _emergency_shutdown(self):
        self.main_power_switch = False
        self.rough_pump_active = False
        self.turbo_pump_active = False
        self.state = self.STATE_OFF

    def close_chamber_door(self, closed: bool):
        self.chamber_door_closed = closed
        if not closed and self.state not in (self.STATE_OFF, self.STATE_STANDBY, self.STATE_VENTED):
            # Interlock: Opening chamber door trips vacuum and beam instantly
            self.state = self.STATE_VENTED
            self.chamber_pressure_pa = 101325.0
            self.rough_pump_active = False
            self.turbo_pump_active = False

    def pump_down_chamber(self):
        """Initiates two-stage vacuum pump sequence: Roughing -> Turbomolecular."""
        if not self.main_power_switch:
            raise RuntimeError("Instrument is unpowered.")
        if not self.chamber_door_closed:
            raise RuntimeError("Chamber door is open; interlock prevents pump down.")
        
        self.nitrogen_vent_open = False
        self.state = self.STATE_VACUUM_ROUGHING
        self.rough_pump_active = True
        self.chamber_pressure_pa = 10.0  # Rough vacuum reached
        
        # Engage Turbomolecular Pump
        self.state = self.STATE_VACUUM_TURBO
        self.turbo_pump_active = True
        self.chamber_pressure_pa = self.target_high_vac_pa
        self.state = self.STATE_HIGH_VACUUM

    def vent_chamber(self):
        """Vents specimen chamber with dry nitrogen gas for sample exchange."""
        if self.state in (self.STATE_BEAM_ACTIVE, self.STATE_IMAGING):
            self.extinguish_beam()
        self.turbo_pump_active = False
        self.rough_pump_active = False
        self.nitrogen_vent_open = True
        self.state = self.STATE_VENTING
        self.chamber_pressure_pa = 101325.0
        self.state = self.STATE_VENTED

    def energize_electron_beam(self):
        """Energizes FEG cathode and establishes high voltage acceleration."""
        if self.state != self.STATE_HIGH_VACUUM and self.state != self.STATE_STANDBY:
            if self.chamber_pressure_pa > 1.0e-3:
                raise RuntimeError("Vacuum pressure too high for electron beam generation.")
        if not self.chamber_door_closed:
            raise RuntimeError("Safety interlock: specimen chamber open.")
            
        self.state = self.STATE_GUN_WARMUP
        self.state = self.STATE_BEAM_ACTIVE

    def extinguish_beam(self):
        if self.state in (self.STATE_BEAM_ACTIVE, self.STATE_IMAGING, self.STATE_GUN_WARMUP):
            self.state = self.STATE_HIGH_VACUUM

    def start_imaging(self):
        if self.state != self.STATE_BEAM_ACTIVE:
            raise RuntimeError("Electron beam must be energized before imaging.")
        self.state = self.STATE_IMAGING

    def set_magnification(self, mag: int):
        if mag < 50 or mag > 300000:
            raise ValueError("Magnification must be between 50x and 300,000x.")
        self.magnification = mag

    def set_voltage(self, kv: float):
        if kv < 0.5 or kv > 30.0:
            raise ValueError("Accelerating voltage must be between 0.5 and 30.0 kV.")
        self.accel_voltage_kv = kv

    def set_detector(self, det: str):
        valid = [self.DET_SE2, self.DET_IN_LENS, self.DET_BSE, self.DET_EDS]
        if det not in valid:
            raise ValueError(f"Unknown detector {det}. Must be one of {valid}")
        self.active_detector = det

    def move_stage(self, x=None, y=None, z=None, tilt=None, rot=None):
        if x is not None:
            self.stage_x_mm = max(-65.0, min(65.0, float(x)))
        if y is not None:
            self.stage_y_mm = max(-65.0, min(65.0, float(y)))
        if z is not None:
            self.stage_z_mm = max(2.0, min(40.0, float(z)))
        if tilt is not None:
            self.stage_tilt_deg = max(-5.0, min(70.0, float(tilt)))
        if rot is not None:
            self.stage_rotation_deg = float(rot) % 360.0

    def get_telemetry(self) -> dict:
        return {
            "state": self.state,
            "power_continuity": self.is_plugged_in and self.main_power_switch,
            "chamber_pressure_pa": self.chamber_pressure_pa,
            "chamber_door_closed": self.chamber_door_closed,
            "eht_kv": self.accel_voltage_kv,
            "probe_current_pa": self.probe_current_pa,
            "magnification": self.magnification,
            "working_distance_mm": self.working_distance_mm,
            "active_detector": self.active_detector,
            "specimen_index": self.active_specimen_index,
            "stage": {
                "x": self.stage_x_mm,
                "y": self.stage_y_mm,
                "z": self.stage_z_mm,
                "tilt": self.stage_tilt_deg,
                "rotation": self.stage_rotation_deg
            }
        }
