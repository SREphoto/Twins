"""
High Pressure Reactor Controller State Engine
Pure Python state machine for industrial Parr 4560 mini high-pressure stirred reactor.
"""

from enum import Enum, auto

class ReactorState(Enum):
    IDLE = auto()
    HEATING = auto()
    STIRRING = auto()
    RUNNING = auto()      # Heating + Stirring active
    VENTING = auto()
    FAULT_OVERPRESSURE = auto()
    FAULT_OVERTEMP = auto()

class ReactorController:
    def __init__(
        self,
        max_pressure_bar: float = 200.0,
        burst_disc_bar: float = 250.0,
        max_temp_c: float = 350.0,
        max_rpm: int = 2000
    ):
        self.max_pressure_bar = max_pressure_bar
        self.burst_disc_bar = burst_disc_bar
        self.max_temp_c = max_temp_c
        self.max_rpm = max_rpm

        self.state = ReactorState.IDLE
        self.current_temp_c = 22.0
        self.target_temp_c = 150.0
        self.current_pressure_bar = 1.0  # Atmospheric pressure
        self.current_rpm = 0
        self.target_rpm = 500
        
        self.heater_on = False
        self.stirrer_on = False
        self.gas_inlet_valve_open = False
        self.vent_valve_open = False

    def set_target_temp(self, temp_c: float):
        if 0.0 <= temp_c <= self.max_temp_c:
            self.target_temp_c = temp_c

    def set_target_rpm(self, rpm: int):
        if 0 <= rpm <= self.max_rpm:
            self.target_rpm = rpm

    def toggle_heater(self, enable: bool):
        if self.state in (ReactorState.FAULT_OVERPRESSURE, ReactorState.FAULT_OVERTEMP):
            return False
        self.heater_on = enable
        self._update_state()
        return True

    def toggle_stirrer(self, enable: bool):
        if self.state in (ReactorState.FAULT_OVERPRESSURE, ReactorState.FAULT_OVERTEMP):
            return False
        self.stirrer_on = enable
        self._update_state()
        return True

    def toggle_vent_valve(self, open_valve: bool):
        self.vent_valve_open = open_valve
        if open_valve:
            self.state = ReactorState.VENTING

    def _update_state(self):
        if self.heater_on and self.stirrer_on:
            self.state = ReactorState.RUNNING
        elif self.heater_on:
            self.state = ReactorState.HEATING
        elif self.stirrer_on:
            self.state = ReactorState.STIRRING
        elif not self.vent_valve_open:
            self.state = ReactorState.IDLE

    def tick(self, dt_sec: float = 1.0):
        """Simulate thermal dynamics, gas pressure rise (PV=nRT approximation), and motor ramp."""
        # Stirrer ramp
        if self.stirrer_on:
            if self.current_rpm < self.target_rpm:
                self.current_rpm = min(self.target_rpm, self.current_rpm + int(100 * dt_sec))
            elif self.current_rpm > self.target_rpm:
                self.current_rpm = max(self.target_rpm, self.current_rpm - int(100 * dt_sec))
        else:
            self.current_rpm = max(0, self.current_rpm - int(200 * dt_sec))

        # Heating dynamics
        if self.heater_on:
            if self.current_temp_c < self.target_temp_c:
                self.current_temp_c += 0.5 * dt_sec
            # Ideal gas temperature pressure response: P2 = P1 * (T2/T1)
            temp_k = self.current_temp_c + 273.15
            self.current_pressure_bar = max(1.0, 1.0 + (temp_k / 295.15 - 1.0) * 45.0)

        # Venting valve drops pressure
        if self.vent_valve_open:
            self.current_pressure_bar = max(1.0, self.current_pressure_bar - 10.0 * dt_sec)
            if self.current_pressure_bar <= 1.05:
                self.vent_valve_open = False
                self._update_state()

        # Interlock checks
        if self.current_pressure_bar >= self.burst_disc_bar:
            self.state = ReactorState.FAULT_OVERPRESSURE
            self.heater_on = False
            self.stirrer_on = False
            self.vent_valve_open = True  # Burst disc ruptures
        elif self.current_temp_c >= self.max_temp_c + 10.0:
            self.state = ReactorState.FAULT_OVERTEMP
            self.heater_on = False
