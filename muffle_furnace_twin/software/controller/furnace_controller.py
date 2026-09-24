"""
Muffle Furnace Controller State Engine
Pure Python state machine for 9L 1200°C laboratory muffle furnace.
"""

from enum import Enum, auto

class FurnaceState(Enum):
    IDLE = auto()
    HEATING = auto()
    SOAKING = auto()
    COOLING = auto()
    FAULT_DOOR_OPEN = auto()
    FAULT_OVERTEMP = auto()

class MuffleFurnaceController:
    def __init__(self, max_temp_c: float = 1200.0, max_ramp_rate: float = 20.0):
        self.max_temp_c = max_temp_c
        self.max_ramp_rate = max_ramp_rate

        self.state = FurnaceState.IDLE
        self.door_closed = True
        self.current_pv = 22.0          # Process Value (°C)
        self.setpoint_sv = 800.0         # Setpoint Value (°C)
        self.ramp_rate_c_min = 10.0      # °C / minute
        self.soak_time_min = 30.0        # Soak duration in minutes
        self.remaining_soak_sec = 0.0

        self.heating_power_percent = 0.0
        self.heater_on = False

    def set_setpoint(self, temp_c: float):
        if 0.0 <= temp_c <= self.max_temp_c:
            self.setpoint_sv = temp_c

    def set_ramp_rate(self, rate_c_min: float):
        if 1.0 <= rate_c_min <= self.max_ramp_rate:
            self.ramp_rate_c_min = rate_c_min

    def set_soak_time(self, minutes: float):
        if minutes >= 0:
            self.soak_time_min = minutes

    def set_door_state(self, closed: bool):
        self.door_closed = closed
        if not closed and self.state in (FurnaceState.HEATING, FurnaceState.SOAKING):
            self.state = FurnaceState.FAULT_DOOR_OPEN
            self.heater_on = False
            self.heating_power_percent = 0.0

    def start_program(self):
        if not self.door_closed:
            self.state = FurnaceState.FAULT_DOOR_OPEN
            return False
        if self.current_pv > self.max_temp_c + 20.0:
            self.state = FurnaceState.FAULT_OVERTEMP
            return False

        self.heater_on = True
        self.remaining_soak_sec = self.soak_time_min * 60.0
        self.state = FurnaceState.HEATING
        return True

    def stop(self):
        self.state = FurnaceState.IDLE
        self.heater_on = False
        self.heating_power_percent = 0.0

    def tick(self, dt_sec: float = 1.0):
        """Simulate thermal dynamics, PID heating, and soak cycle timer."""
        if not self.door_closed and self.state in (FurnaceState.HEATING, FurnaceState.SOAKING):
            self.state = FurnaceState.FAULT_DOOR_OPEN
            self.heater_on = False
            self.heating_power_percent = 0.0
            return

        if self.current_pv > self.max_temp_c + 20.0:
            self.state = FurnaceState.FAULT_OVERTEMP
            self.heater_on = False
            self.heating_power_percent = 0.0
            return

        if self.state == FurnaceState.HEATING:
            # Thermal ramp
            ramp_per_sec = (self.ramp_rate_c_min / 60.0) * dt_sec
            if self.current_pv < self.setpoint_sv:
                self.current_pv = min(self.setpoint_sv, self.current_pv + ramp_per_sec)
                self.heating_power_percent = min(100.0, (self.setpoint_sv - self.current_pv) * 2.0)
            
            if self.current_pv >= self.setpoint_sv:
                self.state = FurnaceState.SOAKING

        elif self.state == FurnaceState.SOAKING:
            self.heating_power_percent = 15.0  # Maintain setpoint
            self.remaining_soak_sec -= dt_sec
            if self.remaining_soak_sec <= 0:
                self.remaining_soak_sec = 0.0
                self.state = FurnaceState.COOLING
                self.heater_on = False

        elif self.state == FurnaceState.COOLING:
            self.heating_power_percent = 0.0
            # Natural convective cooling
            if self.current_pv > 25.0:
                self.current_pv -= 0.3 * dt_sec
            else:
                self.state = FurnaceState.IDLE
