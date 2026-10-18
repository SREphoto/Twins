"""
SREdesigns BÜCHI Rotavapor R-300 Class Digital Twin State Machine & Controller
Pure Python dual-truth state engine with physical circuit continuity, motorized lift
kinematics, BLDC drive control, thermodynamic vapor pressure physics, and safety interlocks.
"""

from enum import Enum, auto
import math
from typing import Dict, Any, Optional

class RotovapState(Enum):
    UNPOWERED = auto()
    IDLE = auto()
    ROTATING = auto()
    HEATING = auto()
    EVAPORATING = auto()
    AERATING = auto()
    FAULT_OVERTEMP = auto()
    FAULT_UNSEATED_BATH = auto()
    FAULT_LIFT_LIMIT = auto()
    EMERGENCY_STOP = auto()

class RotovapController:
    def __init__(
        self,
        max_rpm: int = 280,
        max_bath_temp_c: float = 180.0,
        lift_travel_mm: float = 150.0,
        atmospheric_mbar: float = 1013.25,
    ):
        self.max_rpm = max_rpm
        self.max_bath_temp_c = max_bath_temp_c
        self.lift_travel_mm = lift_travel_mm
        self.atmospheric_mbar = atmospheric_mbar

        # Physical Electrical Continuity (DIAG-014)
        self.is_plugged_in: bool = True
        self.mains_switch_on: bool = True

        # Safety & Hardware Interlocks
        self.bath_seated: bool = True
        self.emergency_stop: bool = False
        self.vapor_duct_mounted: bool = True
        self.receiving_flask_mounted: bool = True

        # Kinematics & Drive State
        self.lift_pos_mm: float = 0.0  # 0.0 = top limit, 150.0 = fully lowered in bath
        self.target_lift_pos_mm: float = 0.0
        self.lift_moving: bool = False
        self.lift_speed_mm_s: float = 25.0

        self.current_rpm: float = 0.0
        self.target_rpm: float = 120.0
        self.rotation_enabled: bool = False

        # Thermal & Heating Bath Subsystem (B-300)
        self.bath_temp_c: float = 22.0
        self.ambient_temp_c: float = 22.0
        self.target_bath_temp_c: float = 45.0
        self.heater_enabled: bool = False
        self.heater_power_watts: float = 1300.0

        # Vacuum & Aeration Subsystem (V-300 / I-300 Pro)
        self.vacuum_mbar: float = 1013.25
        self.target_vacuum_mbar: float = 175.0
        self.vacuum_pump_enabled: bool = False
        self.aeration_valve_open: bool = False

        # Distillation Chemistry & Solvent Database
        self.solvent_name: str = "Ethanol"
        self.antoine_a: float = 5.24677
        self.antoine_b: float = 1598.673
        self.antoine_c: float = -46.424
        self.latent_heat_j_g: float = 846.0

        # Fluid Quantities
        self.evap_flask_vol_ml: float = 800.0
        self.rec_flask_vol_ml: float = 50.0
        self.distillate_rate_ml_min: float = 0.0

        self.state: RotovapState = RotovapState.IDLE
        self._update_state()

    # -------------------------------------------------------------------------
    # Physical Continuity & Mains Power
    # -------------------------------------------------------------------------
    def set_power_cord_plugged(self, plugged: bool):
        self.is_plugged_in = plugged
        if not plugged:
            self._cut_all_power()
        self._update_state()

    def set_mains_switch(self, on: bool):
        self.mains_switch_on = on
        if not on:
            self._cut_all_power()
        self._update_state()

    def trigger_emergency_stop(self):
        self.emergency_stop = True
        self._cut_all_power()
        self.state = RotovapState.EMERGENCY_STOP

    def reset_emergency_stop(self):
        self.emergency_stop = False
        self._update_state()

    def _cut_all_power(self):
        self.rotation_enabled = False
        self.heater_enabled = False
        self.vacuum_pump_enabled = False
        self.lift_moving = False

    @property
    def is_powered(self) -> bool:
        return self.is_plugged_in and self.mains_switch_on and not self.emergency_stop

    # -------------------------------------------------------------------------
    # Heating Bath Seating & Interlocks
    # -------------------------------------------------------------------------
    def set_bath_seated(self, seated: bool):
        self.bath_seated = seated
        if not seated and self.heater_enabled:
            self.heater_enabled = False
            self.state = RotovapState.FAULT_UNSEATED_BATH
        else:
            self._update_state()

    # -------------------------------------------------------------------------
    # Drive Head Rotation Control
    # -------------------------------------------------------------------------
    def set_target_rpm(self, rpm: float):
        if not self.is_powered:
            return
        self.target_rpm = max(0.0, min(float(self.max_rpm), rpm))

    def toggle_rotation(self, enable: Optional[bool] = None):
        if not self.is_powered:
            self.rotation_enabled = False
            return
        if enable is None:
            self.rotation_enabled = not self.rotation_enabled
        else:
            self.rotation_enabled = bool(enable)
        self._update_state()

    # -------------------------------------------------------------------------
    # Motorized Lift Control
    # -------------------------------------------------------------------------
    def set_target_lift_pos(self, pos_mm: float):
        if not self.is_powered:
            return
        self.target_lift_pos_mm = max(0.0, min(self.lift_travel_mm, pos_mm))
        self.lift_moving = abs(self.target_lift_pos_mm - self.lift_pos_mm) > 0.5

    def lower_lift(self):
        self.set_target_lift_pos(self.lift_travel_mm)

    def raise_lift(self):
        self.set_target_lift_pos(0.0)

    # -------------------------------------------------------------------------
    # Heating Bath Temperature Control
    # -------------------------------------------------------------------------
    def set_target_bath_temp(self, temp_c: float):
        if not self.is_powered:
            return
        self.target_bath_temp_c = max(self.ambient_temp_c, min(self.max_bath_temp_c, temp_c))

    def toggle_heater(self, enable: Optional[bool] = None):
        if not self.is_powered or not self.bath_seated:
            self.heater_enabled = False
            return
        if enable is None:
            self.heater_enabled = not self.heater_enabled
        else:
            self.heater_enabled = bool(enable)
        self._update_state()

    # -------------------------------------------------------------------------
    # Vacuum & Aeration Control
    # -------------------------------------------------------------------------
    def set_target_vacuum(self, mbar: float):
        if not self.is_powered:
            return
        self.target_vacuum_mbar = max(5.0, min(self.atmospheric_mbar, mbar))

    def toggle_vacuum_pump(self, enable: Optional[bool] = None):
        if not self.is_powered:
            self.vacuum_pump_enabled = False
            return
        if enable is None:
            self.vacuum_pump_enabled = not self.vacuum_pump_enabled
        else:
            self.vacuum_pump_enabled = bool(enable)
        if self.vacuum_pump_enabled:
            self.aeration_valve_open = False
        self._update_state()

    def aerate(self):
        self.aeration_valve_open = True
        self.vacuum_pump_enabled = False
        self._update_state()

    # -------------------------------------------------------------------------
    # Solvent Selection & Vapor Pressure
    # -------------------------------------------------------------------------
    def set_solvent(self, name: str, a: float, b: float, c: float, latent_heat: float):
        self.solvent_name = name
        self.antoine_a = a
        self.antoine_b = b
        self.antoine_c = c
        self.latent_heat_j_g = latent_heat

    def get_boiling_temp_c(self, pressure_mbar: float) -> float:
        """Calculates boiling temperature at given pressure using Antoine equation."""
        p_bar = pressure_mbar / 1000.0
        if p_bar <= 0:
            return -273.15
        # log10(P_bar) = A - B / (T_K + C)
        # B / (T_K + C) = A - log10(P_bar)
        # T_K + C = B / (A - log10(P_bar))
        denom = self.antoine_a - math.log10(p_bar)
        if abs(denom) < 1e-6:
            return 999.0
        t_kelvin = (self.antoine_b / denom) - self.antoine_c
        return t_kelvin - 273.15

    # -------------------------------------------------------------------------
    # State Engine Resolution
    # -------------------------------------------------------------------------
    def _update_state(self):
        if not self.is_powered:
            self.state = RotovapState.UNPOWERED
            return
        if self.emergency_stop:
            self.state = RotovapState.EMERGENCY_STOP
            return
        if not self.bath_seated and self.heater_enabled:
            self.state = RotovapState.FAULT_UNSEATED_BATH
            return
        if self.bath_temp_c > self.max_bath_temp_c + 5.0:
            self.state = RotovapState.FAULT_OVERTEMP
            return

        if self.aeration_valve_open and self.vacuum_mbar < self.atmospheric_mbar - 10.0:
            self.state = RotovapState.AERATING
            return

        # Check if actively evaporating
        flask_immersed = self.lift_pos_mm > 60.0
        bp_c = self.get_boiling_temp_c(self.vacuum_mbar)
        is_boiling = flask_immersed and (self.bath_temp_c >= bp_c) and self.rotation_enabled

        if is_boiling:
            self.state = RotovapState.EVAPORATING
        elif self.rotation_enabled and self.heater_enabled:
            self.state = RotovapState.ROTATING
        elif self.rotation_enabled:
            self.state = RotovapState.ROTATING
        elif self.heater_enabled:
            self.state = RotovapState.HEATING
        else:
            self.state = RotovapState.IDLE

    # -------------------------------------------------------------------------
    # Simulation Step (Tick)
    # -------------------------------------------------------------------------
    def tick(self, dt_sec: float = 0.1):
        if not self.is_powered:
            # Passive spin-down, cooling, and leak
            if self.current_rpm > 0:
                self.current_rpm = max(0.0, self.current_rpm - 35.0 * dt_sec)
            if self.bath_temp_c > self.ambient_temp_c:
                self.bath_temp_c = max(self.ambient_temp_c, self.bath_temp_c - 0.08 * dt_sec)
            self._update_state()
            return

        # 1. Motorized Lift Kinematics
        if self.lift_moving:
            diff = self.target_lift_pos_mm - self.lift_pos_mm
            step = math.copysign(min(abs(diff), self.lift_speed_mm_s * dt_sec), diff)
            self.lift_pos_mm += step
            if abs(self.target_lift_pos_mm - self.lift_pos_mm) < 0.5:
                self.lift_pos_mm = self.target_lift_pos_mm
                self.lift_moving = False

        # 2. BLDC Drive Motor Rotation Acceleration / Deceleration
        if self.rotation_enabled:
            if self.current_rpm < self.target_rpm:
                self.current_rpm = min(self.target_rpm, self.current_rpm + 40.0 * dt_sec)
            elif self.current_rpm > self.target_rpm:
                self.current_rpm = max(self.target_rpm, self.current_rpm - 40.0 * dt_sec)
        else:
            self.current_rpm = max(0.0, self.current_rpm - 50.0 * dt_sec)

        # 3. Heating Bath Thermodynamics (PID approximation)
        if self.heater_enabled and self.bath_seated:
            if self.bath_temp_c < self.target_bath_temp_c:
                self.bath_temp_c += 0.85 * dt_sec
            elif self.bath_temp_c > self.target_bath_temp_c + 0.5:
                self.bath_temp_c -= 0.10 * dt_sec
            # Safety overtemp trip
            if self.bath_temp_c > self.max_bath_temp_c:
                self.heater_enabled = False
                self.state = RotovapState.FAULT_OVERTEMP
        else:
            if self.bath_temp_c > self.ambient_temp_c:
                self.bath_temp_c = max(self.ambient_temp_c, self.bath_temp_c - 0.06 * dt_sec)

        # 4. Vacuum & Aeration Dynamics
        if self.aeration_valve_open:
            self.vacuum_mbar = min(self.atmospheric_mbar, self.vacuum_mbar + 250.0 * dt_sec)
            if self.vacuum_mbar >= self.atmospheric_mbar - 2.0:
                self.vacuum_mbar = self.atmospheric_mbar
                self.aeration_valve_open = False
        elif self.vacuum_pump_enabled:
            if self.vacuum_mbar > self.target_vacuum_mbar:
                self.vacuum_mbar = max(self.target_vacuum_mbar, self.vacuum_mbar - 120.0 * dt_sec)
        else:
            # Slow ambient leak through seals
            if self.vacuum_mbar < self.atmospheric_mbar:
                self.vacuum_mbar = min(self.atmospheric_mbar, self.vacuum_mbar + 1.2 * dt_sec)

        # 5. Evaporation & Distillate Transfer
        flask_immersed = self.lift_pos_mm > 60.0
        bp_c = self.get_boiling_temp_c(self.vacuum_mbar)
        if flask_immersed and self.bath_temp_c >= bp_c and self.rotation_enabled and self.evap_flask_vol_ml > 5.0:
            delta_t = max(1.0, self.bath_temp_c - bp_c)
            evap_rate_ml_s = (delta_t * 0.15) * (self.current_rpm / 120.0)
            transferred = min(self.evap_flask_vol_ml, evap_rate_ml_s * dt_sec)
            self.evap_flask_vol_ml -= transferred
            self.rec_flask_vol_ml += transferred
            self.distillate_rate_ml_min = evap_rate_ml_s * 60.0
        else:
            self.distillate_rate_ml_min = 0.0

        self._update_state()

    def get_telemetry(self) -> Dict[str, Any]:
        return {
            "state": self.state.name,
            "is_plugged_in": self.is_plugged_in,
            "mains_switch_on": self.mains_switch_on,
            "is_powered": self.is_powered,
            "bath_seated": self.bath_seated,
            "lift_pos_mm": round(self.lift_pos_mm, 1),
            "current_rpm": round(self.current_rpm, 1),
            "target_rpm": round(self.target_rpm, 1),
            "bath_temp_c": round(self.bath_temp_c, 1),
            "target_bath_temp_c": round(self.target_bath_temp_c, 1),
            "vacuum_mbar": round(self.vacuum_mbar, 1),
            "target_vacuum_mbar": round(self.target_vacuum_mbar, 1),
            "evap_vol_ml": round(self.evap_flask_vol_ml, 1),
            "rec_vol_ml": round(self.rec_flask_vol_ml, 1),
            "distillate_rate_ml_min": round(self.distillate_rate_ml_min, 1),
        }
