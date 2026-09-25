"""
Digital Precision Vortex Mixer Controller State Engine
Pure Python state machine and fluid dynamics model for laboratory vortex mixers.
Simulates Scientific Industries Vortex-Genie 2 Digital and IKA MS 3 Digital.
"""

from enum import Enum, auto
import math
from typing import Dict, Optional, Tuple


class VortexState(Enum):
    POWER_OFF = auto()
    IDLE = auto()
    RUNNING_TOUCH = auto()
    RUNNING_CONTINUOUS = auto()
    RUNNING_PULSE = auto()
    TIME_EXPIRED = auto()
    OVERLOAD = auto()


class MixMode(Enum):
    TOUCH = "TOUCH"
    OFF = "OFF"
    CONTINUOUS = "CONTINUOUS"


class LiquidProfile:
    """Fluid characteristics influencing forced vortex meniscus depression."""
    def __init__(self, name: str, viscosity_cp: float, density_g_ml: float, description: str):
        self.name = name
        self.viscosity_cp = viscosity_cp  # centipoise (mPa·s)
        self.density_g_ml = density_g_ml
        self.description = description


STANDARD_LIQUIDS: Dict[str, LiquidProfile] = {
    "water": LiquidProfile("Deionized Water", 1.0, 1.00, "Reference standard aqueous solution"),
    "ethanol": LiquidProfile("Absolute Ethanol", 1.2, 0.789, "Organic solvent, low surface tension"),
    "glycerol_50": LiquidProfile("50% Glycerol", 6.0, 1.13, "Viscous cryoprotectant / enzyme buffer"),
    "cell_lysate": LiquidProfile("Cell Lysis Buffer", 2.5, 1.04, "Proteinaceous detergent buffer"),
    "blood": LiquidProfile("Whole Blood", 4.0, 1.06, "Non-Newtonian biological suspension"),
}


class VortexMixerController:
    """
    Tier-1 Digital Precision Vortex Mixer State Machine.
    Controls speed (500–3200 RPM), 3-position toggle switch, timer, pulse mode,
    and calculates real-time fluid forced-vortex depth.
    """
    def __init__(
        self,
        min_rpm: int = 500,
        max_rpm: int = 3200,
        tau_ramp: float = 0.12,  # motor acceleration time constant in seconds
    ):
        self.min_rpm = min_rpm
        self.max_rpm = max_rpm
        self.tau_ramp = tau_ramp

        self.power_on: bool = True
        self.mode: MixMode = MixMode.TOUCH
        self.state: VortexState = VortexState.IDLE

        self.setpoint_rpm: int = 2400
        self.current_rpm: float = 0.0
        self.touch_pressed: bool = False

        # Timer: None indicates continuous timer; positive integer indicates countdown in seconds
        self.countdown_total_sec: Optional[int] = None
        self.countdown_remaining_sec: float = 0.0

        # Pulse agitation: 2.0s running, 1.0s pause
        self.pulse_enabled: bool = False
        self.pulse_active_period: float = 2.0
        self.pulse_rest_period: float = 1.0
        self.pulse_timer: float = 0.0
        self.pulse_phase: str = "ACTIVE"  # "ACTIVE" or "REST"

        # Liquid sample & fluid mechanics
        self.current_liquid: LiquidProfile = STANDARD_LIQUIDS["water"]
        self.tube_radius_mm: float = 7.5  # standard 15 mL Falcon tube inner radius

        # Cumulative metrics & GLP logging
        self.total_run_time_sec: float = 0.0
        self.session_mix_count: int = 0
        self.motor_temperature_c: float = 24.0

    def set_power(self, power: bool) -> None:
        """Toggles main AC power."""
        self.power_on = power
        if not self.power_on:
            self.state = VortexState.POWER_OFF
            self.current_rpm = 0.0
        else:
            self._evaluate_state()

    def set_mode(self, mode: MixMode | str) -> None:
        """Sets the 3-position mode toggle switch."""
        if isinstance(mode, str):
            mode = MixMode(mode.upper())
        self.mode = mode
        self._evaluate_state()

    def set_speed_rpm(self, rpm: int) -> None:
        """Sets the target RPM between min_rpm and max_rpm."""
        self.setpoint_rpm = max(self.min_rpm, min(self.max_rpm, int(rpm)))

    def set_touch_pressed(self, pressed: bool) -> None:
        """Simulates downward tube pressure on the rubber cup head."""
        self.touch_pressed = pressed
        self._evaluate_state()

    def set_timer(self, seconds: Optional[int]) -> None:
        """Sets countdown timer in seconds, or None for continuous mode."""
        if seconds is not None and seconds > 0:
            self.countdown_total_sec = seconds
            self.countdown_remaining_sec = float(seconds)
        else:
            self.countdown_total_sec = None
            self.countdown_remaining_sec = 0.0

    def toggle_pulse_mode(self) -> bool:
        """Enables or disables pulse agitation mode."""
        self.pulse_enabled = not self.pulse_enabled
        self.pulse_timer = 0.0
        self.pulse_phase = "ACTIVE"
        self._evaluate_state()
        return self.pulse_enabled

    def select_liquid(self, liquid_id: str) -> None:
        """Selects the liquid profile for vortexing."""
        if liquid_id in STANDARD_LIQUIDS:
            self.current_liquid = STANDARD_LIQUIDS[liquid_id]

    def _evaluate_state(self) -> None:
        """Evaluates state transitions based on mode, power, timer, and pressure."""
        if not self.power_on:
            self.state = VortexState.POWER_OFF
            return

        if self.mode == MixMode.OFF:
            self.state = VortexState.IDLE
            return

        # Check if countdown timer has expired
        if self.countdown_total_sec is not None and self.countdown_remaining_sec <= 0.001:
            if self.state in (VortexState.RUNNING_TOUCH, VortexState.RUNNING_CONTINUOUS, VortexState.RUNNING_PULSE):
                self.state = VortexState.TIME_EXPIRED
                return

        # Touch mode activation
        if self.mode == MixMode.TOUCH:
            if self.touch_pressed:
                if self.pulse_enabled:
                    self.state = VortexState.RUNNING_PULSE
                else:
                    self.state = VortexState.RUNNING_TOUCH
            else:
                self.state = VortexState.IDLE
            return

        # Continuous mode activation
        if self.mode == MixMode.CONTINUOUS:
            if self.pulse_enabled:
                self.state = VortexState.RUNNING_PULSE
            else:
                self.state = VortexState.RUNNING_CONTINUOUS
            return

    def tick(self, dt_sec: float = 0.05) -> None:
        """
        Advances the simulation clock by dt_sec.
        Updates motor RPM ramping, timer decrements, and pulse cycles.
        """
        if not self.power_on:
            self.current_rpm = 0.0
            return

        # Pulse agitation cycle handling
        target_rpm_now = float(self.setpoint_rpm)
        if self.state == VortexState.RUNNING_PULSE:
            self.pulse_timer += dt_sec
            if self.pulse_phase == "ACTIVE":
                if self.pulse_timer >= self.pulse_active_period:
                    self.pulse_phase = "REST"
                    self.pulse_timer = 0.0
            else:  # REST
                target_rpm_now = 0.0
                if self.pulse_timer >= self.pulse_rest_period:
                    self.pulse_phase = "ACTIVE"
                    self.pulse_timer = 0.0
        elif self.state in (VortexState.RUNNING_TOUCH, VortexState.RUNNING_CONTINUOUS):
            target_rpm_now = float(self.setpoint_rpm)
        else:
            target_rpm_now = 0.0

        # Exponential motor speed ramping: dω/dt = (ω_target - ω) / tau
        alpha = 1.0 - math.exp(-dt_sec / self.tau_ramp)
        self.current_rpm += (target_rpm_now - self.current_rpm) * alpha

        if abs(self.current_rpm) < 1.0:
            self.current_rpm = 0.0

        # Timer countdown if running
        if self.state in (VortexState.RUNNING_TOUCH, VortexState.RUNNING_CONTINUOUS, VortexState.RUNNING_PULSE):
            self.total_run_time_sec += dt_sec
            # Motor thermal accumulation
            self.motor_temperature_c += (0.015 * (self.current_rpm / 3200.0) ** 2) * dt_sec

            if self.countdown_total_sec is not None:
                self.countdown_remaining_sec = max(0.0, self.countdown_remaining_sec - dt_sec)
                if self.countdown_remaining_sec <= 0.001:
                    self.state = VortexState.TIME_EXPIRED
        else:
            # Motor thermal dissipation
            self.motor_temperature_c = max(24.0, self.motor_temperature_c - 0.005 * dt_sec)

    def get_vortex_depth_mm(self) -> float:
        """
        Calculates the central depression depth (in mm) of the forced liquid vortex.
        Based on orbital angular acceleration and viscous shear damping:
        h = h_max * (RPM / RPM_max)^2 / (1 + k_visc * (mu - 1))
        """
        if self.current_rpm < 200.0:
            return 0.0

        # Max meniscus depression depth in a standard 15 mL Falcon tube is ~36 mm
        rpm_ratio = self.current_rpm / float(self.max_rpm)
        base_h = 36.0 * (rpm_ratio ** 2)

        # Dynamic viscosity damping relative to pure water (1.0 cP)
        mu = max(0.5, self.current_liquid.viscosity_cp)
        visc_damping = 1.0 + 0.28 * (mu - 1.0)

        depth = base_h / max(0.8, visc_damping)
        return min(38.0, round(depth, 2))

    def get_telemetry(self) -> Dict[str, any]:
        """Returns comprehensive GLP machine telemetry."""
        return {
            "power_on": self.power_on,
            "mode": self.mode.value,
            "state": self.state.name,
            "setpoint_rpm": self.setpoint_rpm,
            "current_rpm": round(self.current_rpm, 1),
            "touch_pressed": self.touch_pressed,
            "countdown_total_sec": self.countdown_total_sec,
            "countdown_remaining_sec": round(self.countdown_remaining_sec, 1),
            "pulse_enabled": self.pulse_enabled,
            "pulse_phase": self.pulse_phase,
            "liquid_name": self.current_liquid.name,
            "vortex_depth_mm": self.get_vortex_depth_mm(),
            "motor_temp_c": round(self.motor_temperature_c, 1),
            "total_run_time_sec": round(self.total_run_time_sec, 2),
        }
