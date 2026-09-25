"""
High Pressure Reactor Controller State Engine
Pure Python state machine for industrial Parr 4560 mini high-pressure stirred reactor
with Parr 4848 modular digital controller (PTM, MCM, PDM, SVM, HTM).
"""

from enum import Enum, auto
from typing import Dict, Any


class ReactorState(Enum):
    IDLE = auto()
    HEATING = auto()
    STIRRING = auto()
    RUNNING = auto()       # Both heating & stirring active
    VENTING = auto()
    COOLING = auto()
    FAULT_OVERPRESSURE = auto()
    FAULT_OVERTEMP = auto()
    FAULT_TC_BREAK = auto()


class ReactorController:
    """Industrial Parr 4560 / 4848 reactor control system with PID thermal dynamics,

    closed-loop motor tachometer, Gay-Lussac gas pressure, and redundant safety interlocks.
    """

    def __init__(
        self,
        max_pressure_bar: float = 200.0,
        burst_disc_bar: float = 250.0,
        max_temp_c: float = 350.0,
        max_rpm: int = 1700,
    ):
        self.max_pressure_bar = float(max_pressure_bar)
        self.burst_disc_bar = float(burst_disc_bar)
        self.max_temp_c = float(max_temp_c)
        self.max_rpm = int(max_rpm)

        self.state = ReactorState.IDLE
        self.current_temp_c = 22.0
        self.target_temp_c = 150.0
        self.ambient_temp_c = 22.0
        self.current_pressure_bar = 1.0  # Atmospheric (1 bar abs)
        self.charge_pressure_bar = 1.0
        self.charge_temp_c = 22.0
        self.current_rpm = 0.0
        self.target_rpm = 500

        # Physical constants for Parr 4566 (300 mL 316SS vessel)
        self.thermal_mass_j_k = 1200.0   # J/K for vessel + 150 mL solvent
        self.heater_max_watts = 780.0    # 780 W clamshell mantle
        self.convective_loss_w_k = 1.85  # W/K ambient heat loss
        self.cooling_capacity_w = 450.0  # Water cooling coil capacity

        # PID parameters for PTM module
        self.kp = 4.5
        self.ki = 0.08
        self.kd = 12.0
        self.integral_err = 0.0
        self.prev_err = 0.0
        self.heater_power_pct = 0.0      # 0 to 100%

        # Actuators and valves
        self.heater_on = False
        self.stirrer_on = False
        self.cooling_solenoid_open = False
        self.gas_inlet_valve_open = False
        self.vent_valve_open = False
        self.burst_disc_ruptured = False
        self.tc_broken = False

        # Fluid properties
        self.fluid_viscosity_cp = 1.0    # Water = 1.0 cP
        self.motor_torque_nm = 0.0
        self.motor_current_amps = 0.0

        self.alarm_message = ""

    def set_target_temp(self, temp_c: float) -> bool:
        if 0.0 <= temp_c <= self.max_temp_c:
            self.target_temp_c = float(temp_c)
            return True
        return False

    def set_target_rpm(self, rpm: int) -> bool:
        if 0 <= rpm <= self.max_rpm:
            self.target_rpm = int(rpm)
            return True
        return False

    def toggle_heater(self, enable: bool) -> bool:
        if self.state in (
            ReactorState.FAULT_OVERPRESSURE,
            ReactorState.FAULT_OVERTEMP,
            ReactorState.FAULT_TC_BREAK,
        ):
            return False
        if enable and (self.burst_disc_ruptured or self.tc_broken):
            return False

        self.heater_on = enable
        if enable:
            self.prev_err = self.target_temp_c - self.current_temp_c
            self.integral_err = 0.0
        else:
            self.heater_power_pct = 0.0
            self.integral_err = 0.0
        self._update_state()
        return True

    def toggle_stirrer(self, enable: bool) -> bool:
        if self.state in (ReactorState.FAULT_OVERPRESSURE, ReactorState.FAULT_OVERTEMP):
            return False
        self.stirrer_on = enable
        self._update_state()
        return True

    def toggle_gas_inlet(self, open_valve: bool) -> None:
        self.gas_inlet_valve_open = open_valve

    def toggle_vent_valve(self, open_valve: bool) -> None:
        self.vent_valve_open = open_valve
        if open_valve:
            self.state = ReactorState.VENTING
        else:
            self._update_state()

    def toggle_cooling(self, enable: bool) -> None:
        self.cooling_solenoid_open = enable

    def trigger_tc_fault(self, fault: bool = True) -> None:
        self.tc_broken = fault
        if fault:
            self.heater_on = False
            self.heater_power_pct = 0.0
            self.state = ReactorState.FAULT_TC_BREAK
            self.alarm_message = "FAULT: THERMOCOUPLE OPEN CIRCUIT"

    def acknowledge_alarms(self) -> bool:
        if self.burst_disc_ruptured:
            return False  # Hardware replacement required
        if self.tc_broken:
            return False
        if self.current_temp_c <= self.max_temp_c and self.current_pressure_bar <= self.max_pressure_bar:
            self.alarm_message = ""
            self.state = ReactorState.IDLE
            self._update_state()
            return True
        return False

    def _update_state(self) -> None:
        if self.state in (
            ReactorState.FAULT_OVERPRESSURE,
            ReactorState.FAULT_OVERTEMP,
            ReactorState.FAULT_TC_BREAK,
        ):
            return

        if self.vent_valve_open:
            self.state = ReactorState.VENTING
        elif self.cooling_solenoid_open and self.current_temp_c > self.ambient_temp_c + 5.0:
            self.state = ReactorState.COOLING
        elif self.heater_on and self.stirrer_on:
            self.state = ReactorState.RUNNING
        elif self.heater_on:
            self.state = ReactorState.HEATING
        elif self.stirrer_on:
            self.state = ReactorState.STIRRING
        else:
            self.state = ReactorState.IDLE

    def tick(self, dt_sec: float = 1.0) -> None:
        """Execute physical simulation tick: PID thermal loop, Gay-Lussac gas expansion,

        motor tachometer regulation, and safety interlocks.
        """
        dt = max(0.001, dt_sec)

        # 1. Overpressure / Burst Disc check (Pre-check)
        if self.current_pressure_bar >= self.burst_disc_bar:
            self.state = ReactorState.FAULT_OVERPRESSURE
            self.burst_disc_ruptured = True
            self.heater_on = False
            self.stirrer_on = False
            self.heater_power_pct = 0.0
            self.current_pressure_bar = 1.0  # Instant mechanical venting
            self.vent_valve_open = True
            self.alarm_message = f"ALARM: BURST DISC RUPTURE AT {self.burst_disc_bar:.0f} BAR!"
            return

        if self.current_pressure_bar > self.max_pressure_bar:
            self.state = ReactorState.FAULT_OVERPRESSURE
            self.heater_on = False
            self.heater_power_pct = 0.0
            self.alarm_message = f"ALARM: OVERPRESSURE ({self.current_pressure_bar:.1f} bar > {self.max_pressure_bar:.0f} bar)"
            return

        # 2. Over-temperature check (Pre-check)
        if self.current_temp_c >= self.max_temp_c + 10.0:
            self.state = ReactorState.FAULT_OVERTEMP
            self.heater_on = False
            self.heater_power_pct = 0.0
            self.alarm_message = f"ALARM: HTM OVER-TEMP CUTOUT ({self.current_temp_c:.1f}°C)"
            return

        # 3. Motor speed tachometer & torque loop
        if self.stirrer_on:
            ramp_step = 250.0 * dt
            if self.current_rpm < self.target_rpm:
                self.current_rpm = min(float(self.target_rpm), self.current_rpm + ramp_step)
            elif self.current_rpm > self.target_rpm:
                self.current_rpm = max(float(self.target_rpm), self.current_rpm - ramp_step)
            # Torque estimation (A1120HC6 magnetic drive)
            rpm_ratio = self.current_rpm / 1000.0
            self.motor_torque_nm = 0.08 + (0.35 * self.fluid_viscosity_cp * rpm_ratio)
            self.motor_current_amps = 0.25 + (self.motor_torque_nm * 0.65)
        else:
            self.current_rpm = max(0.0, self.current_rpm - 350.0 * dt)
            self.motor_torque_nm = 0.0
            self.motor_current_amps = 0.0

        # 4. Temperature control (PTM Module PID)
        if self.heater_on and not self.tc_broken:
            err = self.target_temp_c - self.current_temp_c
            self.integral_err = max(-100.0, min(100.0, self.integral_err + err * dt))
            derivative = (err - self.prev_err) / dt if dt > 0 else 0.0
            self.prev_err = err

            raw_output = (self.kp * err) + (self.ki * self.integral_err) + (self.kd * derivative)
            self.heater_power_pct = max(0.0, min(100.0, raw_output))
        else:
            self.heater_power_pct = 0.0

        # Thermal heat transfer
        p_in = (self.heater_power_pct / 100.0) * self.heater_max_watts
        q_loss = self.convective_loss_w_k * (self.current_temp_c - self.ambient_temp_c)
        q_cool = self.cooling_capacity_w if self.cooling_solenoid_open else 0.0

        net_q = p_in - q_loss - q_cool
        delta_t = (net_q / self.thermal_mass_j_k) * dt
        self.current_temp_c = max(self.ambient_temp_c, self.current_temp_c + delta_t)

        # 5. Pressure Dynamics (Gay-Lussac + Gas Inlet + Venting)
        if self.burst_disc_ruptured:
            self.current_pressure_bar = 1.0
        elif self.gas_inlet_valve_open:
            # Gas supply pushes pressure up towards 150 bar
            self.current_pressure_bar = min(180.0, self.current_pressure_bar + 20.0 * dt)
            self.charge_pressure_bar = self.current_pressure_bar
            self.charge_temp_c = self.current_temp_c

        if self.vent_valve_open:
            self.current_pressure_bar = max(1.0, self.current_pressure_bar - 25.0 * dt)
            self.charge_pressure_bar = self.current_pressure_bar
            self.charge_temp_c = self.current_temp_c
            if self.current_pressure_bar <= 1.05:
                self.vent_valve_open = False
                self._update_state()

        # Sealed thermal expansion response: P = P0 * (T / T0)
        if not self.gas_inlet_valve_open and not self.vent_valve_open and not self.burst_disc_ruptured:
            temp_k = self.current_temp_c + 273.15
            charge_k = max(273.15, self.charge_temp_c + 273.15)
            # Gas thermal expansion + vapor pressure component
            thermal_p = self.charge_pressure_bar * (temp_k / charge_k)
            # Add solvent expansion effect if heating above 100°C
            if self.current_temp_c > 100.0:
                vapor_delta = ((self.current_temp_c - 100.0) / 50.0) ** 2.0 * 2.5
                thermal_p += vapor_delta
            self.current_pressure_bar = max(1.0, thermal_p)

        # 6. High pressure limit warning / heater cutoff
        if self.current_pressure_bar > self.max_pressure_bar:
            self.state = ReactorState.FAULT_OVERPRESSURE
            self.heater_on = False
            self.heater_power_pct = 0.0
            self.alarm_message = f"ALARM: OVERPRESSURE ({self.current_pressure_bar:.1f} bar > {self.max_pressure_bar:.0f} bar)"

    def get_telemetry(self) -> Dict[str, Any]:
        """Export comprehensive telemetry packet for UI and data logging."""
        return {
            "state": self.state.name,
            "pv_temp_c": round(self.current_temp_c, 1),
            "sv_temp_c": self.target_temp_c,
            "pressure_bar": round(self.current_pressure_bar, 1),
            "pressure_psi": round(self.current_pressure_bar * 14.5038, 1),
            "stirrer_rpm": round(self.current_rpm),
            "target_rpm": self.target_rpm,
            "heater_power_pct": round(self.heater_power_pct, 1),
            "motor_torque_nm": round(self.motor_torque_nm, 3),
            "motor_current_amps": round(self.motor_current_amps, 2),
            "valves": {
                "inlet_open": self.gas_inlet_valve_open,
                "vent_open": self.vent_valve_open,
                "cooling_open": self.cooling_solenoid_open,
            },
            "safety": {
                "burst_disc_intact": not self.burst_disc_ruptured,
                "tc_intact": not self.tc_broken,
                "alarm_message": self.alarm_message,
            },
        }
