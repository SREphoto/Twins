"""
Ultrasonic Cleaner Controller State Engine
High-fidelity Python state machine for laboratory ultrasonic cleaning baths
(e.g., Branson CPX Series / Elmasonic P Digital class with dual-frequency sweep).
"""

from enum import Enum, auto
from typing import Dict, Any, Optional


class CleanerState(Enum):
    IDLE = auto()
    CLEANING = auto()
    DEGAS = auto()
    PAUSED = auto()
    FAULT_DRY_RUN = auto()
    FAULT_OVERTEMP = auto()


class UltrasonicController:
    """
    Simulated Branson CPX Series / Elmasonic P Industrial Ultrasonic Bath.
    Features:
    - 40 kHz (heavy duty) and 80 kHz (fine parts/optics) dual-frequency sweep
    - Degas pulsed cavitation mode to eliminate entrained air bubbles
    - Closed-loop heating PID with over-temp safety (>80°C)
    - Low-liquid dry run float switch interlock
    - Power modulation (100% High / 70% Low)
    - Precision digital countdown timer with auto-shutoff
    - Comprehensive telemetry export
    """

    def __init__(
        self,
        max_temp_c: float = 80.0,
        max_timer_sec: int = 5940,  # 99 minutes
        nominal_power_w: float = 160.0,
        heater_power_w: float = 300.0,
    ):
        self.max_temp_c = float(max_temp_c)
        self.max_timer_sec = int(max_timer_sec)
        self.nominal_power_w = float(nominal_power_w)
        self.heater_power_w = float(heater_power_w)

        self.state = CleanerState.IDLE
        self.liquid_level_ok = True
        self.current_temp = 22.0
        self.ambient_temp = 22.0
        self.target_temp = 40.0
        self.timer_sec = 600  # Default 10 min
        self.remaining_sec = 0.0

        # Ultrasonic Transducer Control
        self.power_percent = 100
        self.frequency_khz = 40  # 40 kHz or 80 kHz
        self.degas_mode = False
        self.degas_pulse_period = 8.0  # 6s ON, 2s OFF
        self.degas_timer = 0.0
        self.transducer_active = False

        # Heating Element Control
        self.heater_on = False
        self.alarm_message = ""

    def set_target_temp(self, temp_c: float) -> bool:
        if 0.0 <= temp_c <= self.max_temp_c:
            self.target_temp = float(temp_c)
            return True
        return False

    def set_timer(self, seconds: int) -> bool:
        if 0 <= seconds <= self.max_timer_sec:
            self.timer_sec = int(seconds)
            return True
        return False

    def set_power(self, percent: int) -> bool:
        if 10 <= percent <= 100:
            self.power_percent = int(percent)
            return True
        return False

    def set_frequency(self, freq_khz: int) -> bool:
        if freq_khz in (40, 80):
            self.frequency_khz = int(freq_khz)
            return True
        return False

    def set_liquid_level(self, ok: bool) -> None:
        self.liquid_level_ok = ok
        if not ok:
            if self.state in (CleanerState.CLEANING, CleanerState.DEGAS, CleanerState.PAUSED) or self.heater_on:
                self.state = CleanerState.FAULT_DRY_RUN
                self.heater_on = False
                self.transducer_active = False
                self.alarm_message = "FAULT: DRY RUN DETECTED (LOW LIQUID LEVEL)"

    def toggle_heater(self, enable: bool) -> bool:
        if enable and not self.liquid_level_ok:
            self.state = CleanerState.FAULT_DRY_RUN
            self.heater_on = False
            self.alarm_message = "FAULT: DRY RUN DETECTED (HEATER INHIBITED)"
            return False
        if enable and self.current_temp > self.max_temp_c:
            self.state = CleanerState.FAULT_OVERTEMP
            self.heater_on = False
            self.alarm_message = f"FAULT: OVER-TEMPERATURE ({self.current_temp:.1f}°C > {self.max_temp_c:.0f}°C)"
            return False
        self.heater_on = enable
        return True

    def start_cleaning(self, degas: bool = False) -> bool:
        if not self.liquid_level_ok:
            self.state = CleanerState.FAULT_DRY_RUN
            self.transducer_active = False
            self.alarm_message = "FAULT: DRY RUN DETECTED"
            return False
        if self.current_temp > self.max_temp_c:
            self.state = CleanerState.FAULT_OVERTEMP
            self.transducer_active = False
            self.alarm_message = "FAULT: OVER-TEMPERATURE CUTOUT"
            return False

        self.degas_mode = degas
        self.remaining_sec = float(self.timer_sec)
        self.degas_timer = 0.0
        self.transducer_active = True
        self.state = CleanerState.DEGAS if degas else CleanerState.CLEANING
        self.alarm_message = ""
        return True

    def pause(self) -> bool:
        if self.state in (CleanerState.CLEANING, CleanerState.DEGAS):
            self.state = CleanerState.PAUSED
            self.transducer_active = False
            return True
        return False

    def resume(self) -> bool:
        if self.state == CleanerState.PAUSED:
            if not self.liquid_level_ok:
                self.state = CleanerState.FAULT_DRY_RUN
                return False
            self.state = CleanerState.DEGAS if self.degas_mode else CleanerState.CLEANING
            self.transducer_active = True
            return True
        return False

    def stop(self) -> None:
        self.state = CleanerState.IDLE
        self.remaining_sec = 0.0
        self.transducer_active = False

    def acknowledge_fault(self) -> bool:
        if not self.liquid_level_ok:
            return False
        if self.current_temp > self.max_temp_c:
            return False
        self.state = CleanerState.IDLE
        self.alarm_message = ""
        return True

    def tick(self, dt_seconds: float = 1.0) -> None:
        """Simulate time progression for cleaning timer, cavitation duty, and thermal balance."""
        dt = max(0.001, dt_seconds)

        # 1. Thermal heating simulation
        if self.heater_on:
            if not self.liquid_level_ok:
                self.state = CleanerState.FAULT_DRY_RUN
                self.heater_on = False
                self.alarm_message = "FAULT: DRY RUN DETECTED"
            else:
                if self.current_temp < self.target_temp:
                    self.current_temp += 0.25 * dt
        else:
            # Natural ambient cooling
            if self.current_temp > self.ambient_temp:
                self.current_temp = max(self.ambient_temp, self.current_temp - 0.02 * dt)

        # 2. Cavitation energy adds slight bath heating when cleaning
        if self.transducer_active:
            self.current_temp += 0.04 * (self.power_percent / 100.0) * dt

        # Global over-temperature safety cutoff
        if self.current_temp > self.max_temp_c:
            self.state = CleanerState.FAULT_OVERTEMP
            self.heater_on = False
            self.transducer_active = False
            self.alarm_message = f"FAULT: OVER-TEMPERATURE ({self.current_temp:.1f}°C > {self.max_temp_c:.0f}°C)"

        # 3. Degas pulsed cavitation modulation (6s ON, 2s OFF)
        if self.state == CleanerState.DEGAS:
            self.degas_timer = (self.degas_timer + dt) % self.degas_pulse_period
            self.transducer_active = self.degas_timer < 6.0
        elif self.state == CleanerState.CLEANING:
            self.transducer_active = True
        else:
            self.transducer_active = False

        # 4. Timer countdown
        if self.state in (CleanerState.CLEANING, CleanerState.DEGAS):
            self.remaining_sec -= dt
            if self.remaining_sec <= 0:
                self.remaining_sec = 0.0
                self.state = CleanerState.IDLE
                self.transducer_active = False

    def get_telemetry(self) -> Dict[str, Any]:
        """Export comprehensive telemetry packet for UI and remote data logging."""
        effective_power = self.nominal_power_w * (self.power_percent / 100.0) if self.transducer_active else 0.0
        return {
            "state": self.state.name,
            "current_temp_c": round(self.current_temp, 1),
            "target_temp_c": round(self.target_temp, 1),
            "timer_sec": self.timer_sec,
            "remaining_sec": max(0, int(self.remaining_sec)),
            "power_percent": self.power_percent,
            "frequency_khz": self.frequency_khz,
            "degas_mode": self.degas_mode,
            "transducer_active": self.transducer_active,
            "heater_on": self.heater_on,
            "liquid_level_ok": self.liquid_level_ok,
            "effective_power_w": round(effective_power, 1),
            "alarm_message": self.alarm_message,
        }
