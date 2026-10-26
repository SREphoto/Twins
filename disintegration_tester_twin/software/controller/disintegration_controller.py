"""
ERWEKA ZT 322 Tablet Disintegration Tester (USP <701>) Controller
Pure Python 3 Dual-Truth Reference State Machine & Physics Engine
"""

import math
import time
from typing import Dict, Any, List

class DisintegrationController:
    """
    Simulates the firmware, state machine, kinematics, thermodynamics,
    and USP <701> disintegration kinetics of the ERWEKA ZT 322.
    """

    def __init__(self):
        # Electrical Continuity (Rule 9 & DIAG-014)
        self.is_plugged_in: bool = True
        self.power_switch_on: bool = True
        self.state: str = 'STANDBY'  # 'POWER_OFF', 'STANDBY', 'HEATING', 'RUNNING_OSCILLATION', 'PAUSED', 'FAULT_OVERHEAT', 'FAULT_DRY_RUN'

        # Thermal System
        self.bath_temp_c: float = 21.5  # Ambient lab temperature
        self.target_temp_c: float = 37.0  # USP default
        self.heater_active: bool = False
        self.heater_power_w: float = 1500.0
        self.heater_duty_cycle: float = 0.0
        self.water_mass_kg: float = 6.0
        self.water_heat_capacity_j_per_kg_k: float = 4184.0
        self.ambient_heat_loss_w_per_k: float = 8.5
        self.bath_water_level_ok: bool = True
        self.overtemp_limit_c: float = 45.0

        # Kinematic Drive System (USP <701>)
        self.nominal_cpm: float = 30.0  # Strokes per minute (USP requires 29 - 32)
        self.stroke_amplitude_mm: float = 27.5  # Peak-to-peak 55.0 mm
        self.stroke_frequency_hz: float = 0.50  # 30 cpm / 60
        self.crank_angle_rad: float = 0.0
        self.basket_elevation_mm: float = 0.0  # Deviation from center rest
        self.baskets_lifted: bool = False  # Manual raised service position (+120 mm)
        self.oscillation_active: bool = False
        self.stroke_count: int = 0
        self.elapsed_test_time_s: float = 0.0
        self.test_duration_s: float = 900.0  # 15 minutes default

        # Dosage Form Samples (Station 1 and Station 2)
        # Type: 'IR_ASPIRIN', 'VITAMIN_C', 'ENTERIC_ACID', 'ENTERIC_BUFFER'
        self.station_1_type: str = 'IR_ASPIRIN'
        self.station_2_type: str = 'IR_ASPIRIN'
        self.station_1_tablets_intact: int = 6
        self.station_2_tablets_intact: int = 6
        self.station_1_mass_remaining_pct: List[float] = [100.0] * 6
        self.station_2_mass_remaining_pct: List[float] = [100.0] * 6

        # Telemetry & Audit Log
        self.audit_log: List[Dict[str, Any]] = []

    # --------------------------------------------------------------------------
    # Electrical Continuity & Power Interlocks
    # --------------------------------------------------------------------------
    @property
    def has_power(self) -> bool:
        return self.is_plugged_in and self.power_switch_on

    def plug_in(self) -> None:
        self.is_plugged_in = True
        if self.power_switch_on:
            self.state = 'STANDBY'

    def unplug(self) -> None:
        self.is_plugged_in = False
        self._emergency_power_cut()

    def set_power_switch(self, on: bool) -> None:
        self.power_switch_on = on
        if not on or not self.is_plugged_in:
            self._emergency_power_cut()
        else:
            self.state = 'STANDBY'

    def _emergency_power_cut(self) -> None:
        self.state = 'POWER_OFF'
        self.heater_active = False
        self.heater_duty_cycle = 0.0
        self.oscillation_active = False

    # --------------------------------------------------------------------------
    # Thermal Controls
    # --------------------------------------------------------------------------
    def toggle_heater(self, on: bool) -> bool:
        if not self.has_power:
            return False
        if not self.bath_water_level_ok and on:
            self.state = 'FAULT_DRY_RUN'
            return False
        self.heater_active = on
        if on and self.state == 'STANDBY':
            self.state = 'HEATING'
        elif not on and self.state == 'HEATING':
            self.state = 'STANDBY'
        return True

    def set_target_temp(self, celsius: float) -> None:
        if 20.0 <= celsius <= 45.0:
            self.target_temp_c = celsius

    def set_water_level_ok(self, ok: bool) -> None:
        self.bath_water_level_ok = ok
        if not ok and self.heater_active:
            self.heater_active = False
            self.heater_duty_cycle = 0.0
            self.state = 'FAULT_DRY_RUN'

    # --------------------------------------------------------------------------
    # Kinematic Controls (Start / Stop / Pause / Lift)
    # --------------------------------------------------------------------------
    def start_test(self, duration_minutes: float = 15.0) -> bool:
        if not self.has_power:
            return False
        if self.bath_temp_c > self.overtemp_limit_c:
            self.state = 'FAULT_OVERHEAT'
            return False

        self.test_duration_s = duration_minutes * 60.0
        self.elapsed_test_time_s = 0.0
        self.stroke_count = 0
        self.baskets_lifted = False
        self.oscillation_active = True
        self.state = 'RUNNING_OSCILLATION'
        return True

    def stop_test(self) -> None:
        if not self.has_power:
            return
        self.oscillation_active = False
        self.crank_angle_rad = 0.0
        self.basket_elevation_mm = 0.0
        if self.state in ('RUNNING_OSCILLATION', 'PAUSED'):
            self.state = 'STANDBY' if not self.heater_active else 'HEATING'

    def pause_test(self) -> None:
        if self.state == 'RUNNING_OSCILLATION':
            self.oscillation_active = False
            self.state = 'PAUSED'

    def resume_test(self) -> None:
        if self.state == 'PAUSED' and self.has_power:
            self.oscillation_active = True
            self.state = 'RUNNING_OSCILLATION'

    def toggle_basket_lift(self) -> None:
        """Toggles manual raised service elevation."""
        if not self.has_power:
            return
        if self.oscillation_active:
            self.stop_test()
        self.baskets_lifted = not self.baskets_lifted
        self.basket_elevation_mm = 120.0 if self.baskets_lifted else 0.0

    def load_samples(self, station_1_type: str = 'IR_ASPIRIN', station_2_type: str = 'IR_ASPIRIN') -> None:
        self.station_1_type = station_1_type
        self.station_2_type = station_2_type
        self.station_1_tablets_intact = 6
        self.station_2_tablets_intact = 6
        self.station_1_mass_remaining_pct = [100.0] * 6
        self.station_2_mass_remaining_pct = [100.0] * 6

    # --------------------------------------------------------------------------
    # Physics & Simulation Step
    # --------------------------------------------------------------------------
    def step(self, dt: float = 0.1) -> None:
        """Advances the simulation by dt seconds."""
        if not self.has_power:
            # Ambient cooling toward 21.5°C
            self.bath_temp_c += (21.5 - self.bath_temp_c) * 0.001 * dt
            return

        # 1. Thermal PID & Heat Balance
        if self.heater_active and self.bath_water_level_ok:
            error = self.target_temp_c - self.bath_temp_c
            if error > 0:
                self.heater_duty_cycle = min(1.0, max(0.0, error * 0.45))
            else:
                self.heater_duty_cycle = 0.0

            q_in = self.heater_power_w * self.heater_duty_cycle * dt
            q_loss = self.ambient_heat_loss_w_per_k * (self.bath_temp_c - 21.5) * dt
            net_energy = q_in - q_loss
            delta_t = net_energy / (self.water_mass_kg * self.water_heat_capacity_j_per_kg_k)
            self.bath_temp_c += delta_t

            # Thermal safety cutoff
            if self.bath_temp_c >= self.overtemp_limit_c:
                self.heater_active = False
                self.oscillation_active = False
                self.state = 'FAULT_OVERHEAT'
        else:
            self.heater_duty_cycle = 0.0
            q_loss = self.ambient_heat_loss_w_per_k * (self.bath_temp_c - 21.5) * dt
            self.bath_temp_c -= q_loss / (self.water_mass_kg * self.water_heat_capacity_j_per_kg_k)

        # 2. Harmonic Kinematics
        if self.oscillation_active:
            d_theta = 2.0 * math.pi * self.stroke_frequency_hz * dt
            self.crank_angle_rad = (self.crank_angle_rad + d_theta) % (2.0 * math.pi)
            
            # Harmonic displacement
            self.basket_elevation_mm = self.stroke_amplitude_mm * math.sin(self.crank_angle_rad)
            
            # Increment stroke count at top dead center
            if self.crank_angle_rad < d_theta:
                self.stroke_count += 1

            self.elapsed_test_time_s += dt

            # 3. Disintegration Kinetics
            self._update_tablet_kinetics(dt)

            # Test completion check
            if self.elapsed_test_time_s >= self.test_duration_s:
                self.stop_test()

        # Telemetry sample
        if int(self.elapsed_test_time_s) % 5 == 0 and self.oscillation_active:
            self._record_telemetry()

    def _update_tablet_kinetics(self, dt: float) -> None:
        # Base erosion factor depending on temperature and oscillation
        temp_factor = max(0.2, min(1.3, (self.bath_temp_c - 15.0) / 22.0))
        
        for stn_idx, (sample_type, intact_attr, mass_attr) in enumerate([
            (self.station_1_type, 'station_1_tablets_intact', 'station_1_mass_remaining_pct'),
            (self.station_2_type, 'station_2_tablets_intact', 'station_2_mass_remaining_pct')
        ]):
            mass_list = getattr(self, mass_attr)
            
            for i in range(6):
                if mass_list[i] <= 0.0:
                    continue
                
                # Disintegration rates
                if sample_type == 'IR_ASPIRIN':
                    # Disintegrates fully in ~210 seconds at 37°C
                    erosion_rate = (100.0 / 210.0) * temp_factor * (1.0 + 0.15 * (i % 3 - 1))
                elif sample_type == 'VITAMIN_C':
                    # Disintegrates fully in ~480 seconds at 37°C
                    erosion_rate = (100.0 / 480.0) * temp_factor * (1.0 + 0.10 * (i % 3 - 1))
                elif sample_type == 'ENTERIC_ACID':
                    # Gastric acid simulation: coating does not dissolve (< 0.01% erosion)
                    erosion_rate = 0.002
                elif sample_type == 'ENTERIC_BUFFER':
                    # Intestinal buffer: coating dissolves, tablet dissolves in ~300s
                    erosion_rate = (100.0 / 300.0) * temp_factor
                else:
                    erosion_rate = (100.0 / 300.0) * temp_factor

                mass_list[i] = max(0.0, mass_list[i] - erosion_rate * dt)
            
            # Count intact tablets (> 5% mass)
            intact_count = sum(1 for m in mass_list if m > 5.0)
            setattr(self, intact_attr, intact_count)

    def _record_telemetry(self) -> None:
        record = {
            'time_s': round(self.elapsed_test_time_s, 1),
            'strokes': self.stroke_count,
            'cpm': round(self.nominal_cpm, 1),
            'temp_c': round(self.bath_temp_c, 2),
            'stn1_intact': self.station_1_tablets_intact,
            'stn2_intact': self.station_2_tablets_intact,
            'heater': self.heater_active
        }
        self.audit_log.append(record)

    def get_telemetry(self) -> Dict[str, Any]:
        return {
            'state': self.state,
            'has_power': self.has_power,
            'is_plugged_in': self.is_plugged_in,
            'power_switch_on': self.power_switch_on,
            'bath_temp_c': round(self.bath_temp_c, 2),
            'target_temp_c': round(self.target_temp_c, 1),
            'heater_active': self.heater_active,
            'heater_duty_cycle': round(self.heater_duty_cycle, 3),
            'oscillation_active': self.oscillation_active,
            'strokes_per_minute': self.nominal_cpm if self.oscillation_active else 0.0,
            'stroke_count': self.stroke_count,
            'basket_elevation_mm': round(self.basket_elevation_mm, 2),
            'baskets_lifted': self.baskets_lifted,
            'elapsed_test_time_s': round(self.elapsed_test_time_s, 1),
            'test_duration_s': self.test_duration_s,
            'station_1_tablets_intact': self.station_1_tablets_intact,
            'station_2_tablets_intact': self.station_2_tablets_intact,
            'station_1_mass_pct': [round(m, 1) for m in self.station_1_mass_remaining_pct],
            'station_2_mass_pct': [round(m, 1) for m in self.station_2_mass_remaining_pct]
        }

    def export_glp_csv(self) -> str:
        lines = [
            "GLP Analytical Run Audit Trail: ERWEKA ZT 322 Tablet Disintegration Tester",
            "Compendial Standard: USP <701> / Ph. Eur. 2.9.1 / JP 6.09",
            f"Run Timestamp UTC: {time.strftime('%Y-%m-%d %H:%M:%SZ', time.gmtime())}",
            f"Target Temperature: {self.target_temp_c:.1f} C",
            f"Test Duration: {self.test_duration_s / 60.0:.1f} min",
            f"Station 1 Sample: {self.station_1_type}, Station 2 Sample: {self.station_2_type}",
            "Time (s),Strokes,CPM,Bath Temp (C),Station 1 Intact,Station 2 Intact,Heater State"
        ]
        for row in self.audit_log:
            lines.append(f"{row['time_s']},{row['strokes']},{row['cpm']},{row['temp_c']},{row['stn1_intact']},{row['stn2_intact']},{row['heater']}")
        return "\n".join(lines)
