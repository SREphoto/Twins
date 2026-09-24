"""
pH Meter Controller State Engine
Pure Python state machine for laboratory benchtop dual pH/mV meter with ATC.
"""

import math
from enum import Enum, auto

class PHMeterState(Enum):
    IDLE = auto()
    MEASURING = auto()
    CALIBRATING = auto()
    HOLD = auto()
    FAULT_PROBE_DISCONNECTED = auto()
    FAULT_CALIBRATION_ERROR = auto()

class PHMeterController:
    # Physical constants for Nernst equation
    R = 8.3144626   # Gas constant (J / mol K)
    F = 96485.3321  # Faraday constant (C / mol)

    def __init__(self):
        self.state = PHMeterState.IDLE
        self.probe_connected = True
        self.probe_immersed = True
        
        self.current_temp_c = 25.0
        self.solution_ph_real = 7.00
        
        # Display readings
        self.measured_ph = 7.00
        self.measured_mv = 0.0
        
        # Calibration state (slope % and offset mV)
        self.calib_offset_mv = 0.0
        self.calib_slope_percent = 100.0
        self.calibrated_buffers = set()

    def set_probe_connected(self, connected: bool):
        self.probe_connected = connected
        if not connected:
            self.state = PHMeterState.FAULT_PROBE_DISCONNECTED

    def set_probe_immersed(self, immersed: bool):
        self.probe_immersed = immersed

    def nernst_slope_mv(self, temp_c: float) -> float:
        """Calculate ideal Nernst slope: -2.303 * R * T / F in mV per pH unit."""
        temp_k = temp_c + 273.15
        slope_v = (2.302585 * self.R * temp_k) / self.F
        return slope_v * 1000.0  # ~ -59.16 mV / pH at 25°C

    def start_measurement(self):
        if not self.probe_connected:
            self.state = PHMeterState.FAULT_PROBE_DISCONNECTED
            return False
        self.state = PHMeterState.MEASURING
        return True

    def hold_measurement(self):
        if self.state == PHMeterState.MEASURING:
            self.state = PHMeterState.HOLD

    def calibrate_buffer(self, buffer_ph: float):
        if not self.probe_connected or not self.probe_immersed:
            self.state = PHMeterState.FAULT_CALIBRATION_ERROR
            return False
            
        self.state = PHMeterState.CALIBRATING
        # Ideal mV at this buffer value relative to pH 7.00 (isopotential)
        ideal_mv = (7.00 - buffer_ph) * self.nernst_slope_mv(self.current_temp_c)
        self.calib_offset_mv = ideal_mv - (7.00 - self.solution_ph_real) * self.nernst_slope_mv(self.current_temp_c)
        self.calibrated_buffers.add(round(buffer_ph, 2))
        self.state = PHMeterState.MEASURING
        return True

    def tick(self, dt_sec: float = 1.0):
        """Simulate electrode stabilization and temperature compensation."""
        if not self.probe_connected:
            self.state = PHMeterState.FAULT_PROBE_DISCONNECTED
            return

        if self.state in (PHMeterState.MEASURING, PHMeterState.HOLD):
            if not self.probe_immersed:
                # Open circuit noise
                self.measured_ph = 7.00
                self.measured_mv = 0.0
            else:
                # Calculate real mV output from Nernst equation
                ideal_slope = self.nernst_slope_mv(self.current_temp_c) * (self.calib_slope_percent / 100.0)
                raw_mv = (7.00 - self.solution_ph_real) * ideal_slope + self.calib_offset_mv
                
                # Smooth sensor convergence
                self.measured_mv += (raw_mv - self.measured_mv) * min(1.0, 2.0 * dt_sec)
                calc_ph = 7.00 - (self.measured_mv - self.calib_offset_mv) / ideal_slope
                self.measured_ph += (calc_ph - self.measured_ph) * min(1.0, 2.0 * dt_sec)
