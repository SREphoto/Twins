"""
Metrohm 901/917 Karl Fischer Titrator Behavioral Controller (Digital Twin).

Pure Python, zero external dependencies. Implements the dual-truth state machine,
electrical continuity interlock, Karl Fischer stoichiometry, Bunsen/Faraday ODEs,
bipotentiometric endpoint detection, and GLP batch run logging.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional


class State(str, Enum):
    UNPLUGGED = "UNPLUGGED"
    POWER_OFF = "POWER_OFF"
    STANDBY = "STANDBY"
    PRE_TITR = "PRE_TITR"      # Conditioning / measuring background drift
    READY = "READY"            # Drift stabilized, ready for sample addition
    TITRATING = "TITRATING"    # Actively dosing titrant with Dosino
    COMPLETE = "COMPLETE"      # Equivalence point reached & held
    ERR_LEAK = "ERR_LEAK"      # Drift exceeds seal limit
    ERR_OVERFILL = "ERR_OVERFILL"


class DosingSpeed(str, Enum):
    SLOW = "SLOW"      # 0.5 mL/min (precision trace moisture)
    MEDIUM = "MEDIUM"  # 2.0 mL/min (standard)
    FAST = "FAST"      # 5.0 mL/min (rough assay)


@dataclass
class TitrationRecord:
    timestamp: str
    sample_name: str
    sample_weight_g: float
    titrant_consumed_ml: float
    water_mass_mg: float
    water_content_pct: float
    water_content_ppm: float
    duration_s: float
    drift_ug_min: float
    endpoint_potential_mv: float


class KarlFischerController:
    """
    Controller state machine for the Metrohm 901 Karl Fischer Titrator.
    """

    def __init__(
        self,
        titer_mg_per_ml: float = 5.000,     # Hydranal Composite 5
        blank_ml: float = 0.000,
        stop_potential_mv: float = 100.0,   # Bi-amperometric endpoint cutoff
        stop_delay_s: float = 15.0,         # Minimum hold time below cutoff
        ambient_drift_ug_min: float = 8.5   # Typical background moisture ingress
    ):
        # Electrical Continuity State
        self.is_plugged_in: bool = True
        self.power_switch_on: bool = True

        # Titration parameters
        self.titer: float = titer_mg_per_ml
        self.blank: float = blank_ml
        self.stop_potential_mv: float = stop_potential_mv
        self.stop_delay_s: float = stop_delay_s
        self.ambient_drift: float = ambient_drift_ug_min

        # Stirrer settings
        self.stir_speed_rpm: float = 600.0  # 0 to 1500 RPM
        self.stir_enabled: bool = True

        # Live telemetry
        self.state: State = State.STANDBY
        self.cell_water_ug: float = 250.0   # Current unreacted water in cell
        self.potential_mv: float = 540.0    # Measured bivoltammetric potential
        self.volume_dosed_ml: float = 0.0   # Total titrant dispensed this run
        self.elapsed_time_s: float = 0.0
        self.stop_timer_s: float = 0.0
        self.current_drift_ug_min: float = ambient_drift_ug_min

        # Sample data
        self.sample_name: str = "Water Standard 1.0%"
        self.sample_mass_g: float = 1.0000

        # Hardware limits & Dosino buret
        self.buret_volume_ml: float = 20.0
        self.dosing_speed: DosingSpeed = DosingSpeed.MEDIUM
        self.piston_step_resolution_ul: float = 0.1  # 0.1 µL/step

        # History / GLP log
        self.records: List[TitrationRecord] = []
        self._update_continuity()

    # --- Electrical Continuity & Power ---

    def set_plugged_in(self, plugged: bool) -> None:
        self.is_plugged_in = plugged
        self._update_continuity()

    def set_power_switch(self, switch_on: bool) -> None:
        self.power_switch_on = switch_on
        self._update_continuity()

    def _update_continuity(self) -> None:
        if not self.is_plugged_in:
            self.state = State.UNPLUGGED
            self.stir_enabled = False
            self.potential_mv = 0.0
        elif not self.power_switch_on:
            self.state = State.POWER_OFF
            self.stir_enabled = False
            self.potential_mv = 0.0
        elif self.state in (State.UNPLUGGED, State.POWER_OFF):
            self.state = State.STANDBY
            self.potential_mv = 520.0
            self.stir_enabled = True

    # --- Stirrer Control ---

    def set_stir_speed(self, rpm: float) -> None:
        if not (self.is_plugged_in and self.power_switch_on):
            return
        self.stir_speed_rpm = max(0.0, min(1500.0, rpm))

    def toggle_stirrer(self) -> bool:
        if not (self.is_plugged_in and self.power_switch_on):
            return False
        self.stir_enabled = not self.stir_enabled
        return self.stir_enabled

    # --- User Commands ---

    def start_conditioning(self) -> bool:
        """Start pre-titration cell conditioning to reach stable drift."""
        if self.state not in (State.STANDBY, State.COMPLETE):
            return False
        self.state = State.PRE_TITR
        self.volume_dosed_ml = 0.0
        self.elapsed_time_s = 0.0
        self.stop_timer_s = 0.0
        return True

    def inject_sample(self, name: str, mass_g: float, water_content_expected_pct: float = 0.5) -> bool:
        """Add sample to titration cell while in READY state."""
        if self.state != State.READY:
            return False
        self.sample_name = name
        self.sample_mass_g = max(0.0001, mass_g)
        added_water_mg = (mass_g * 1000.0) * (water_content_expected_pct / 100.0)
        self.cell_water_ug += added_water_mg * 1000.0
        self.potential_mv = 580.0
        self.state = State.TITRATING
        self.volume_dosed_ml = 0.0
        self.elapsed_time_s = 0.0
        self.stop_timer_s = 0.0
        return True

    def start_titration(self) -> bool:
        """Explicit start command."""
        if self.state == State.READY:
            self.state = State.TITRATING
            self.elapsed_time_s = 0.0
            self.stop_timer_s = 0.0
            return True
        elif self.state == State.STANDBY:
            return self.start_conditioning()
        return False

    def stop_titration(self) -> bool:
        """Abort or stop current titration."""
        if self.state in (State.TITRATING, State.PRE_TITR):
            self.state = State.STANDBY
            return True
        return False

    # --- Simulation Step (ODE Integration) ---

    def step(self, dt_s: float) -> None:
        """Advance physical simulation by dt_s seconds."""
        if not (self.is_plugged_in and self.power_switch_on):
            return

        self.elapsed_time_s += dt_s

        # Dosing speed translation
        dose_rate_ml_s = {
            DosingSpeed.SLOW: 0.5 / 60.0,
            DosingSpeed.MEDIUM: 2.0 / 60.0,
            DosingSpeed.FAST: 5.0 / 60.0
        }[self.dosing_speed]

        if self.state == State.PRE_TITR:
            # Condition cell: titrate until water is 0 and slight free iodine is present
            if self.cell_water_ug > 0.0:
                dosed_ml = min(dose_rate_ml_s * dt_s, (self.cell_water_ug / (self.titer * 1000.0)) + 0.0005)
                self.volume_dosed_ml += dosed_ml
                water_consumed_ug = dosed_ml * self.titer * 1000.0
                self.cell_water_ug = max(0.0, self.cell_water_ug - water_consumed_ug)
            else:
                # Add background ingress
                self.cell_water_ug += (self.ambient_drift / 60.0) * dt_s
                # Maintenance pulse
                if self.cell_water_ug > 1.5:
                    pulse_ml = self.cell_water_ug / (self.titer * 1000.0)
                    self.cell_water_ug = 0.0
                    self.volume_dosed_ml += pulse_ml

            self.current_drift_ug_min = self.ambient_drift + (self.cell_water_ug * 0.2)
            self._update_potential()

            # Condition reached when water is virtually 0 and potential is low
            if self.potential_mv <= self.stop_potential_mv:
                self.stop_timer_s += dt_s
                if self.stop_timer_s >= 3.0:
                    self.state = State.READY
                    self.stop_timer_s = 0.0
            else:
                self.stop_timer_s = 0.0

        elif self.state == State.TITRATING:
            # Active titration: dose titrant proportional to remaining water
            adaptive_factor = max(0.08, min(1.0, self.cell_water_ug / 150.0))
            active_dose_ml_s = dose_rate_ml_s * adaptive_factor
            dosed_step_ml = active_dose_ml_s * dt_s

            if self.volume_dosed_ml + dosed_step_ml > self.buret_volume_ml:
                self.state = State.ERR_OVERFILL
                return

            self.volume_dosed_ml += dosed_step_ml
            water_consumed_ug = dosed_step_ml * self.titer * 1000.0
            ambient_ingress_ug = (self.ambient_drift / 60.0) * dt_s

            self.cell_water_ug = max(0.0, self.cell_water_ug - water_consumed_ug + ambient_ingress_ug)
            self._update_potential()

            # Check endpoint condition
            if self.potential_mv <= self.stop_potential_mv:
                self.stop_timer_s += dt_s
                if self.stop_timer_s >= self.stop_delay_s:
                    self.state = State.COMPLETE
                    self._record_result()
            else:
                self.stop_timer_s = 0.0

    def _update_potential(self) -> None:
        """Calculate bipotentiometric depolarization curve across Pt pins."""
        # When cell_water_ug > 0, potential is high (~500-600 mV)
        # When cell_water_ug == 0, excess iodine depolarizes pins down to ~40-60 mV
        u_min = 45.0   # mV with excess iodine / endpoint
        u_max = 590.0  # mV with unreacted moisture
        km = 2.0       # µg sensitivity threshold

        if self.cell_water_ug <= 0.05:
            self.potential_mv = u_min
        else:
            ratio = self.cell_water_ug / (self.cell_water_ug + km)
            self.potential_mv = u_min + (u_max - u_min) * ratio

    def _record_result(self) -> None:
        """Create GLP compliant batch record."""
        # Calculate water mass: (V - Vblank) * Titer - (Drift * time)
        gross_water_mg = (self.volume_dosed_ml - self.blank) * self.titer
        drift_correction_mg = (self.ambient_drift * (self.elapsed_time_s / 60.0)) / 1000.0
        net_water_mg = max(0.0, gross_water_mg - drift_correction_mg)

        pct = (net_water_mg / (self.sample_mass_g * 1000.0)) * 100.0
        ppm = pct * 10000.0

        rec = TitrationRecord(
            timestamp="2026-10-18T20:30:00Z",
            sample_name=self.sample_name,
            sample_weight_g=round(self.sample_mass_g, 4),
            titrant_consumed_ml=round(self.volume_dosed_ml, 4),
            water_mass_mg=round(net_water_mg, 4),
            water_content_pct=round(pct, 4),
            water_content_ppm=round(ppm, 1),
            duration_s=round(self.elapsed_time_s, 1),
            drift_ug_min=round(self.ambient_drift, 2),
            endpoint_potential_mv=round(self.potential_mv, 1)
        )
        self.records.append(rec)

    def get_telemetry(self) -> Dict[str, Any]:
        """Return real-time dictionary of instrument telemetry."""
        return {
            "state": self.state.value,
            "is_plugged_in": self.is_plugged_in,
            "power_switch_on": self.power_switch_on,
            "potential_mv": round(self.potential_mv, 1),
            "volume_dosed_ml": round(self.volume_dosed_ml, 4),
            "cell_water_ug": round(self.cell_water_ug, 1),
            "drift_ug_min": round(self.current_drift_ug_min, 1),
            "stir_speed_rpm": self.stir_speed_rpm if self.stir_enabled else 0.0,
            "stir_enabled": self.stir_enabled,
            "elapsed_time_s": round(self.elapsed_time_s, 1),
            "records_count": len(self.records)
        }
