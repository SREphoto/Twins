"""
Ultrasonic Cleaner Controller State Engine
Pure Python state machine for laboratory ultrasonic cleaning baths.
"""

from enum import Enum, auto

class CleanerState(Enum):
    IDLE = auto()
    CLEANING = auto()
    DEGAS = auto()
    FAULT_DRY_RUN = auto()
    FAULT_OVERTEMP = auto()

class UltrasonicController:
    def __init__(self, max_temp_c: float = 80.0, max_timer_sec: int = 3600):
        self.max_temp_c = max_temp_c
        self.max_timer_sec = max_timer_sec
        
        self.state = CleanerState.IDLE
        self.liquid_level_ok = True
        self.current_temp = 22.0
        self.target_temp = 40.0
        self.timer_sec = 600  # Default 10 min
        self.remaining_sec = 0
        self.power_percent = 100
        self.degas_mode = False
        self.heater_on = False

    def set_target_temp(self, temp_c: float):
        if 0.0 <= temp_c <= self.max_temp_c:
            self.target_temp = temp_c

    def set_timer(self, seconds: int):
        if 0 <= seconds <= self.max_timer_sec:
            self.timer_sec = seconds

    def set_power(self, percent: int):
        if 10 <= percent <= 100:
            self.power_percent = percent

    def set_liquid_level(self, ok: bool):
        self.liquid_level_ok = ok
        if not ok and self.state in (CleanerState.CLEANING, CleanerState.DEGAS):
            self.state = CleanerState.FAULT_DRY_RUN
            self.heater_on = False

    def toggle_heater(self, enable: bool):
        if enable and not self.liquid_level_ok:
            self.state = CleanerState.FAULT_DRY_RUN
            self.heater_on = False
            return False
        self.heater_on = enable
        return True

    def start_cleaning(self, degas: bool = False):
        if not self.liquid_level_ok:
            self.state = CleanerState.FAULT_DRY_RUN
            return False
        if self.current_temp > self.max_temp_c:
            self.state = CleanerState.FAULT_OVERTEMP
            return False
            
        self.degas_mode = degas
        self.remaining_sec = self.timer_sec
        self.state = CleanerState.DEGAS if degas else CleanerState.CLEANING
        return True

    def stop(self):
        self.state = CleanerState.IDLE
        self.remaining_sec = 0

    def tick(self, dt_seconds: float = 1.0):
        """Simulate time progression for cleaning timer and thermal heating."""
        if self.heater_on:
            if self.current_temp < self.target_temp:
                self.current_temp += 0.2 * dt_seconds
            if self.current_temp > self.max_temp_c:
                self.state = CleanerState.FAULT_OVERTEMP
                self.heater_on = False
                
        if self.state in (CleanerState.CLEANING, CleanerState.DEGAS):
            self.remaining_sec -= dt_seconds
            if self.remaining_sec <= 0:
                self.remaining_sec = 0
                self.state = CleanerState.IDLE
