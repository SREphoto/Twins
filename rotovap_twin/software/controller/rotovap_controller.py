"""
Rotary Evaporator (Rotovap) Controller State Engine
Pure Python state machine for laboratory rotary evaporator with motorized lift and heating bath.
"""

from enum import Enum, auto

class RotovapState(Enum):
    IDLE = auto()
    ROTATING = auto()
    HEATING = auto()
    EVAPORATING = auto()
    FAULT_OVERTEMP = auto()

class RotovapController:
    def __init__(self, max_rpm: int = 280, max_bath_temp_c: float = 180.0):
        self.max_rpm = max_rpm
        self.max_bath_temp_c = max_bath_temp_c
        
        self.state = RotovapState.IDLE
        self.current_rpm = 0
        self.target_rpm = 120
        self.bath_temp_c = 22.0
        self.target_bath_temp_c = 50.0
        
        self.lift_height_mm = 0.0    # 0 = top, 150 = lowered into bath
        self.vacuum_mbar = 1013.0     # Atmospheric
        self.target_vacuum_mbar = 100.0
        
        self.rotation_on = False
        self.bath_heater_on = False
        self.vacuum_pump_on = False

    def set_target_rpm(self, rpm: int):
        if 0 <= rpm <= self.max_rpm:
            self.target_rpm = rpm

    def set_bath_temp(self, temp_c: float):
        if 0.0 <= temp_c <= self.max_bath_temp_c:
            self.target_bath_temp_c = temp_c

    def toggle_rotation(self, enable: bool):
        self.rotation_on = enable
        self._update_state()

    def toggle_heater(self, enable: bool):
        self.bath_heater_on = enable
        self._update_state()

    def set_lift_height(self, height_mm: float):
        self.lift_height_mm = max(0.0, min(150.0, height_mm))

    def _update_state(self):
        if self.rotation_on and self.bath_heater_on and self.lift_height_mm > 50:
            self.state = RotovapState.EVAPORATING
        elif self.rotation_on:
            self.state = RotovapState.ROTATING
        elif self.bath_heater_on:
            self.state = RotovapState.HEATING
        else:
            self.state = RotovapState.IDLE

    def tick(self, dt_sec: float = 1.0):
        if self.rotation_on:
            if self.current_rpm < self.target_rpm:
                self.current_rpm = min(self.target_rpm, self.current_rpm + int(20 * dt_sec))
            elif self.current_rpm > self.target_rpm:
                self.current_rpm = max(self.target_rpm, self.current_rpm - int(20 * dt_sec))
        else:
            self.current_rpm = max(0, self.current_rpm - int(40 * dt_sec))

        if self.bath_heater_on:
            if self.bath_temp_c < self.target_bath_temp_c:
                self.bath_temp_c += 0.4 * dt_sec
            if self.bath_temp_c > self.max_bath_temp_c + 10.0:
                self.state = RotovapState.FAULT_OVERTEMP
                self.bath_heater_on = False

        if self.vacuum_pump_on and self.vacuum_mbar > self.target_vacuum_mbar:
            self.vacuum_mbar = max(self.target_vacuum_mbar, self.vacuum_mbar - 50.0 * dt_sec)
