"""
Muffle Furnace Controller State Engine
High-fidelity Python state machine for 9L 1200°C laboratory muffle furnace.
Models closed-loop PID thermal dynamics, Stefan-Boltzmann radiative transfer,
multi-segment ramp & soak profiles, door safety cutoff interlock, and over-temperature limits.
"""

import math
from enum import Enum, auto
from typing import Dict, Optional


class FurnaceState(Enum):
    OFF = auto()
    IDLE = auto()       # Standby, door closed, heaters off
    HEATING = auto()    # Controlled PID temperature ramp
    SOAKING = auto()    # Constant temperature dwell/soak
    COOLING = auto()    # Controlled or natural convective cooling
    FAULT_DOOR_OPEN = auto()
    FAULT_OVERTEMP = auto()
    FAULT_THERMOCOUPLE = auto()


class MuffleFurnaceController:
    """
    Simulated Nabertherm L 9/11 / Carbolite CWF 1100 Industrial Muffle Furnace.
    Chamber: 9 L (235 mm W x 240 mm D x 170 mm H).
    Maximum Continuous Temperature: 1200 °C.
    Heating Power: 3.0 kW embedded Kanthal / FeCrAl resistance elements.
    """

    # Physical Constants
    SIGMA = 5.670374419e-8  # Stefan-Boltzmann constant (W / m^2 K^4)
    CHAMBER_AREA_M2 = 0.38   # Internal wall area of 9L muffle
    CHAMBER_EMISSIVITY = 0.88 # Vacuum-formed aluminosilicate ceramic fiber
    MAX_HEATING_POWER_W = 3000.0 # 3.0 kW elements
    THERMAL_MASS_J_K = 6000.0    # Effective thermal capacitance of chamber

    def __init__(self, max_temp_c: float = 1200.0, max_ramp_rate: float = 30.0):
        self.max_temp_c = max_temp_c
        self.max_ramp_rate = max_ramp_rate
        self.ambient_temp_c = 22.0

        self.power_switch: bool = True
        self.state: FurnaceState = FurnaceState.IDLE
        self.door_closed: bool = True
        self.thermocouple_ok: bool = True

        # Process & Setpoint Variables
        self.current_pv: float = 22.0          # Process Value (°C)
        self.setpoint_sv: float = 800.0         # Final Setpoint Target (°C)
        self.ramp_sv: float = 22.0             # Dynamic ramp setpoint trajectory
        self.ramp_sv_start: float = 22.0       # Starting temperature of ramp trajectory
        self.ramp_rate_c_min: float = 10.0      # Ramp rate (°C / min)
        self.soak_time_min: float = 30.0        # Soak duration (minutes)
        self.remaining_soak_sec: float = 0.0

        # PID Controller Parameters (Tuned for ceramic muffle furnace)
        self.kp: float = 18.0
        self.ki: float = 0.05
        self.kd: float = 4.0
        self.integral_err: float = 0.0
        self.prev_err: float = 0.0

        # Actuator Outputs
        self.heater_on: bool = False
        self.heating_power_percent: float = 0.0
        self.cooling_damper_open: bool = False

        self.last_fault_msg: Optional[str] = None

    def set_power_switch(self, power: bool):
        self.power_switch = power
        if not power:
            self.state = FurnaceState.OFF
            self.heater_on = False
            self.heating_power_percent = 0.0
        else:
            self.state = FurnaceState.IDLE

    def set_setpoint(self, temp_c: float) -> bool:
        if 0.0 <= temp_c <= self.max_temp_c:
            self.setpoint_sv = temp_c
            return True
        return False

    def set_ramp_rate(self, rate_c_min: float) -> bool:
        if 1.0 <= rate_c_min <= self.max_ramp_rate:
            self.ramp_rate_c_min = rate_c_min
            return True
        return False

    def set_soak_time(self, minutes: float) -> bool:
        if minutes >= 0.0:
            self.soak_time_min = minutes
            return True
        return False

    def set_damper(self, open_damper: bool):
        self.cooling_damper_open = open_damper

    def set_door_state(self, closed: bool):
        """
        Safety interlock: door microswitch instantly cuts power to coils if opened
        while in active heating or soak states.
        """
        self.door_closed = closed
        if not closed and self.state in (FurnaceState.HEATING, FurnaceState.SOAKING):
            self.state = FurnaceState.FAULT_DOOR_OPEN
            self.heater_on = False
            self.heating_power_percent = 0.0
            self.last_fault_msg = "DOOR_SAFETY_INTERLOCK_TRIP"

    def reset_fault(self) -> bool:
        """Attempts to clear faults if interlocks are satisfied."""
        if not self.power_switch:
            return False
        if not self.door_closed:
            return False
        if not self.thermocouple_ok:
            return False
        if self.current_pv > self.max_temp_c + 15.0:
            return False

        self.state = FurnaceState.IDLE
        self.last_fault_msg = None
        return True

    def start_program(self) -> bool:
        """Starts the automated ramp, soak, and cooling firing cycle."""
        if not self.power_switch:
            return False
        if not self.door_closed:
            self.state = FurnaceState.FAULT_DOOR_OPEN
            self.last_fault_msg = "DOOR_OPEN_START_PREVENTED"
            return False
        if not self.thermocouple_ok:
            self.state = FurnaceState.FAULT_THERMOCOUPLE
            return False
        if self.current_pv > self.max_temp_c + 15.0:
            self.state = FurnaceState.FAULT_OVERTEMP
            return False

        self.heater_on = True
        self.ramp_sv_start = self.current_pv
        self.ramp_sv = self.current_pv
        self.remaining_soak_sec = self.soak_time_min * 60.0
        self.integral_err = 0.0
        self.prev_err = 0.0
        self.state = FurnaceState.HEATING
        return True

    def stop(self):
        """Halts program execution and shuts down heating coils."""
        self.state = FurnaceState.IDLE
        self.heater_on = False
        self.heating_power_percent = 0.0
        self.integral_err = 0.0

    def tick(self, dt_sec: float = 1.0):
        """
        Executes one simulation time step:
        - Safety interlock verification
        - Dynamic ramp setpoint progression
        - PID power calculation
        - Net thermal balance (Joule heating vs Stefan-Boltzmann & convective losses)
        """
        if not self.power_switch:
            self.state = FurnaceState.OFF
            self._apply_ambient_cooling(dt_sec)
            return

        # 1. Door Safety Interlock Check
        if not self.door_closed and self.state in (FurnaceState.HEATING, FurnaceState.SOAKING):
            self.state = FurnaceState.FAULT_DOOR_OPEN
            self.heater_on = False
            self.heating_power_percent = 0.0
            self.last_fault_msg = "DOOR_OPEN_SAFETY_CUTOUT"

        # 2. Independent Over-Temperature Protection Cutoff
        if self.current_pv > self.max_temp_c + 20.0 or self.current_pv > 1250.0:
            self.state = FurnaceState.FAULT_OVERTEMP
            self.heater_on = False
            self.heating_power_percent = 0.0
            self.last_fault_msg = "OVERTEMP_SAFETY_CUTOUT"

        # 3. Thermocouple Break Interlock
        if not self.thermocouple_ok and self.state in (FurnaceState.HEATING, FurnaceState.SOAKING):
            self.state = FurnaceState.FAULT_THERMOCOUPLE
            self.heater_on = False
            self.heating_power_percent = 0.0
            self.last_fault_msg = "THERMOCOUPLE_BREAK_CUTOUT"

        # 4. State-Specific Firing Control
        if self.state == FurnaceState.HEATING:
            # Advance ramp setpoint trajectory
            ramp_step = (self.ramp_rate_c_min / 60.0) * dt_sec
            is_heating_ramp = self.setpoint_sv >= getattr(self, "ramp_sv_start", 22.0)
            if self.ramp_sv < self.setpoint_sv:
                self.ramp_sv = min(self.setpoint_sv, self.ramp_sv + ramp_step)
            elif self.ramp_sv > self.setpoint_sv:
                self.ramp_sv = max(self.setpoint_sv, self.ramp_sv - ramp_step)

            # Calculate PID control signal with ramp feedforward
            err = self.ramp_sv - self.current_pv
            self.integral_err = max(-1000.0, min(1000.0, self.integral_err + err * dt_sec))
            derivative_err = (err - self.prev_err) / max(0.001, dt_sec)
            self.prev_err = err

            feedforward = (self.ramp_rate_c_min / self.max_ramp_rate) * 50.0 if is_heating_ramp else 0.0
            pid_out = (self.kp * err) + (self.ki * self.integral_err) + (self.kd * derivative_err) + feedforward
            self.heating_power_percent = max(0.0, min(100.0, pid_out))

            # Transition check: reached setpoint
            if is_heating_ramp:
                if self.current_pv >= self.setpoint_sv - 1.5:
                    self.state = FurnaceState.SOAKING
            else:
                if self.current_pv <= self.setpoint_sv + 1.5:
                    self.state = FurnaceState.SOAKING

        elif self.state == FurnaceState.SOAKING:
            self.ramp_sv = self.setpoint_sv
            err = self.setpoint_sv - self.current_pv
            self.integral_err = max(-500.0, min(500.0, self.integral_err + err * dt_sec))
            derivative_err = (err - self.prev_err) / max(0.001, dt_sec)
            self.prev_err = err

            # Steady-state maintenance power
            pid_out = (self.kp * err) + (self.ki * self.integral_err) + (self.kd * derivative_err)
            # Baseline maintenance power to counter radiative loss at high temp
            rad_base_pct = min(40.0, (self.setpoint_sv / self.max_temp_c) ** 3 * 35.0)
            self.heating_power_percent = max(0.0, min(100.0, pid_out + rad_base_pct))

            # Decrement soak countdown timer
            self.remaining_soak_sec -= dt_sec
            if self.remaining_soak_sec <= 0.0:
                self.remaining_soak_sec = 0.0
                self.state = FurnaceState.COOLING
                self.heater_on = False
                self.heating_power_percent = 0.0

        elif self.state == FurnaceState.COOLING:
            self.heater_on = False
            self.heating_power_percent = 0.0
            if self.current_pv <= self.ambient_temp_c + 3.0:
                self.state = FurnaceState.IDLE

        elif self.state in (FurnaceState.IDLE, FurnaceState.FAULT_DOOR_OPEN, FurnaceState.FAULT_OVERTEMP):
            self.heater_on = False
            self.heating_power_percent = 0.0

        # 4. Integrate Thermal Mass Balance
        self._apply_thermal_dynamics(dt_sec)

    def _apply_thermal_dynamics(self, dt_sec: float):
        """Solves heat transfer equations into refractory chamber."""
        # 1. Electrical Joule heating power (Watts)
        p_elec = (self.heating_power_percent / 100.0) * self.MAX_HEATING_POWER_W

        # 2. Stefan-Boltzmann radiative heat loss through insulation / seals
        t_chamber_k = self.current_pv + 273.15
        t_amb_k = self.ambient_temp_c + 273.15
        p_radiation = self.CHAMBER_EMISSIVITY * self.SIGMA * self.CHAMBER_AREA_M2 * (t_chamber_k**4 - t_amb_k**4)

        # 3. Convective and chimney losses
        cooling_mult = 3.5 if self.cooling_damper_open else 1.0
        if not self.door_closed:
            cooling_mult = 12.0  # Massive cooling rush if door is opened

        p_convective = 8.5 * cooling_mult * (self.current_pv - self.ambient_temp_c)

        # Net thermal power
        p_net = p_elec - p_radiation - p_convective
        delta_temp = (p_net / self.THERMAL_MASS_J_K) * dt_sec

        self.current_pv = max(self.ambient_temp_c, self.current_pv + delta_temp)

    def _apply_ambient_cooling(self, dt_sec: float):
        cooling_rate = 0.25 * dt_sec
        if self.current_pv > self.ambient_temp_c:
            self.current_pv = max(self.ambient_temp_c, self.current_pv - cooling_rate)

    def get_telemetry(self) -> Dict:
        """Returns complete digital telemetry packet."""
        return {
            "state": self.state.name,
            "power_switch": self.power_switch,
            "door_closed": self.door_closed,
            "pv_temp_c": round(self.current_pv, 1),
            "setpoint_sv": round(self.setpoint_sv, 1),
            "ramp_rate_c_min": round(self.ramp_rate_c_min, 1),
            "soak_time_min": round(self.soak_time_min, 1),
            "remaining_soak_sec": max(0, int(self.remaining_soak_sec)),
            "heating_power_pct": round(self.heating_power_percent, 1),
            "heater_on": self.heater_on,
            "damper_open": self.cooling_damper_open,
            "last_fault": self.last_fault_msg,
        }
