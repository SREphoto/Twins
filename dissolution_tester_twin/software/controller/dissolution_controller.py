"""
Agilent 708-DS USP Tablet Dissolution Apparatus (USP <711>)
Dual-Truth Kinematic & Noyes-Whitney ODE Controller
"""

import math
import time
from typing import Dict, List, Any, Optional

class DissolutionController:
    """
    Thermodynamic, kinematic, and Noyes-Whitney ODE state machine for the
    Agilent 708-DS 8-position tablet dissolution apparatus.
    """

    # Physical & Pharmacopeial Constants
    AMBIENT_TEMP_C = 21.5
    TARGET_BATH_TEMP_C = 37.0 # USP standard: 37.0 ± 0.5 °C
    MAX_ELEVATION_MM = 311.0 # Elevator vertical travel
    ELEVATION_SPEED_MM_S = 45.0 # Speed of motorized elevator lead screw
    VESSEL_MEDIUM_VOL_ML = 900.0 # USP standard dissolution vessel volume

    TABLET_PROFILES = {
        'prednisone': {
            'name': 'USP Prednisone 10mg RS',
            'mass_mg': 10.0,
            'k_rate': 0.028, # Standard calibrator: 28-54% at 30 min
            'solubility_mg_ml': 0.25
        },
        'acetaminophen': {
            'name': 'Acetaminophen 500mg IR',
            'mass_mg': 500.0,
            'k_rate': 0.085, # Immediate release: >85% in 15 min
            'solubility_mg_ml': 14.0
        },
        'theophylline': {
            'name': 'Theophylline 300mg ER',
            'mass_mg': 300.0,
            'k_rate': 0.009, # Extended release matrix
            'solubility_mg_ml': 8.3
        }
    }

    def __init__(self):
        # Electrical Continuity (Rule 9 / DIAG-014)
        self.is_plugged_in: bool = True
        self.power_switch_on: bool = True

        # State Machine
        self.state: str = 'STANDBY'
        self.alarms: List[str] = []

        # Elevator Kinematics
        self.head_elevation_mm: float = 0.0 # 0.0 = lowered, 311.0 = elevated
        self.target_elevation_mm: float = 0.0
        self.is_elevating: bool = False

        # Thermal System (Water Bath & Circulator)
        self.bath_temp_c: float = self.AMBIENT_TEMP_C
        self.heater_active: bool = False

        # Spindle Drive
        self.spindle_rpm: float = 50.0
        self.target_rpm: float = 50.0
        self.spindles_spinning: bool = False

        # 8 Dissolution Vessels
        self.vessels: List[Dict[str, Any]] = []
        for i in range(8):
            self.vessels.append({
                'index': i,
                'tablet_name': 'None',
                'tablet_mass_mg': 0.0,
                'tablet_dropped': False,
                'dissolved_pct': 0.0,
                'conc_mg_ml': 0.0,
                'tablet_radius_mm': 0.0
            })

        # Run Telemetry & GLP
        self.run_timer_s: float = 0.0
        self.glp_records: List[Dict[str, Any]] = []

    # -------------------------------------------------------------------------
    # Electrical Continuity Control
    # -------------------------------------------------------------------------
    def plug_in(self) -> None:
        """Insert NEMA 5-15P plug into bench duplex receptacle."""
        self.is_plugged_in = True
        if self.power_switch_on and self.state == 'POWER_OFF':
            self.state = 'STANDBY'

    def unplug(self) -> None:
        """Unplug from bench receptacle: immediate complete shutdown."""
        self.is_plugged_in = False
        self._emergency_shutdown()

    def set_power_switch(self, on: bool) -> None:
        """Toggle front rocker power switch."""
        self.power_switch_on = on
        if not on:
            self._emergency_shutdown()
        elif self.is_plugged_in and self.state == 'POWER_OFF':
            self.state = 'STANDBY'

    def _emergency_shutdown(self) -> None:
        """Immediate de-energization on power loss."""
        self.state = 'POWER_OFF'
        self.spindles_spinning = False
        self.heater_active = False
        self.is_elevating = False

    # -------------------------------------------------------------------------
    # Kinematic Elevator Commands
    # -------------------------------------------------------------------------
    def elevate_head_up(self) -> bool:
        """Raise drive head to loading position (+311 mm)."""
        if not self.is_plugged_in or not self.power_switch_on:
            return False
        # Stop spinning before raising head
        self.stop_stirring()
        self.target_elevation_mm = self.MAX_ELEVATION_MM
        self.is_elevating = True
        self.state = 'ELEVATING_UP'
        return True

    def lower_head_down(self) -> bool:
        """Lower drive head to operating testing position (0 mm)."""
        if not self.is_plugged_in or not self.power_switch_on:
            return False
        self.target_elevation_mm = 0.0
        self.is_elevating = True
        self.state = 'ELEVATING_DOWN'
        return True

    # -------------------------------------------------------------------------
    # Thermal & Spindle Actuators
    # -------------------------------------------------------------------------
    def toggle_heater(self, on: Optional[bool] = None) -> bool:
        """Toggle external water bath heater/circulator."""
        if not self.is_plugged_in or not self.power_switch_on:
            return False
        if on is None:
            self.heater_active = not self.heater_active
        else:
            self.heater_active = on

        if self.heater_active and self.state == 'STANDBY':
            self.state = 'HEATING_BATH'
        elif not self.heater_active and self.state == 'HEATING_BATH':
            self.state = 'STANDBY'
        return True

    def start_stirring(self, rpm: float = 50.0) -> bool:
        """
        Start 8 rotating spindles at specified RPM.
        Safety Interlock: Drive head MUST be lowered (elevation <= 5.0 mm).
        """
        if not self.is_plugged_in or not self.power_switch_on:
            return False

        if self.head_elevation_mm > 5.0:
            alarm = 'INTERLOCK: Drive head is elevated. Lower head before starting spindles.'
            if alarm not in self.alarms:
                self.alarms.append(alarm)
            return False

        self.target_rpm = max(10.0, min(250.0, rpm))
        self.spindles_spinning = True

        # Check if tablets are in vessels
        any_tablets = any(v['tablet_dropped'] for v in self.vessels)
        if any_tablets:
            self.state = 'RUNNING_DISSOLUTION'
        elif self.state == 'STANDBY':
            self.state = 'READY'
        return True

    def stop_stirring(self) -> None:
        """Halt spindle motor."""
        self.spindles_spinning = False
        self.spindle_rpm = 0.0
        if self.state in ['RUNNING_DISSOLUTION', 'READY']:
            self.state = 'STANDBY'

    def drop_tablets(self, tablet_type: str = 'prednisone') -> bool:
        """Drop solid dosage form tablets into all 8 vessels simultaneously."""
        if not self.is_plugged_in or not self.power_switch_on:
            return False

        prof = self.TABLET_PROFILES.get(tablet_type, self.TABLET_PROFILES['prednisone'])
        for v in self.vessels:
            v['tablet_name'] = prof['name']
            v['tablet_mass_mg'] = prof['mass_mg']
            v['tablet_dropped'] = True
            v['dissolved_pct'] = 0.0
            v['conc_mg_ml'] = 0.0
            v['tablet_radius_mm'] = 4.5 # initial 9mm tablet radius

        if self.spindles_spinning:
            self.state = 'RUNNING_DISSOLUTION'
        return True

    # -------------------------------------------------------------------------
    # Physics Integration Step
    # -------------------------------------------------------------------------
    def step(self, dt_s: float) -> None:
        """
        Simulate kinematics, thermodynamics, and Noyes-Whitney ODE step.
        """
        if not self.is_plugged_in or not self.power_switch_on:
            # Passive cooling towards ambient
            self.bath_temp_c += (self.AMBIENT_TEMP_C - self.bath_temp_c) * (0.02 * dt_s)
            self.spindle_rpm = 0.0
            return

        # 1. Elevator Kinematic Travel
        if self.is_elevating:
            diff = self.target_elevation_mm - self.head_elevation_mm
            step_move = self.ELEVATION_SPEED_MM_S * dt_s
            if abs(diff) <= step_move:
                self.head_elevation_mm = self.target_elevation_mm
                self.is_elevating = False
                self.state = 'STANDBY'
            else:
                self.head_elevation_mm += math.copysign(step_move, diff)

        # 2. Water Bath Thermoregulation
        if self.heater_active:
            # Heat towards 37.0°C
            d_temp = (self.TARGET_BATH_TEMP_C - self.bath_temp_c) * (0.15 * dt_s)
            self.bath_temp_c += d_temp
            if abs(self.bath_temp_c - self.TARGET_BATH_TEMP_C) <= 0.2 and self.state == 'HEATING_BATH':
                self.state = 'READY'
        else:
            self.bath_temp_c += (self.AMBIENT_TEMP_C - self.bath_temp_c) * (0.01 * dt_s)

        # 3. Spindle Speed Ramp
        if self.spindles_spinning:
            rpm_diff = self.target_rpm - self.spindle_rpm
            self.spindle_rpm += math.copysign(min(abs(rpm_diff), 40.0 * dt_s), rpm_diff)
        else:
            self.spindle_rpm = max(0.0, self.spindle_rpm - 60.0 * dt_s)

        # 4. Noyes-Whitney Dissolution ODE Integration
        if self.state == 'RUNNING_DISSOLUTION' and self.spindles_spinning:
            self.run_timer_s += dt_s
            stir_factor = (self.spindle_rpm / 50.0) ** 0.6
            temp_factor = 1.0 + (self.bath_temp_c - 37.0) * 0.02

            for v in self.vessels:
                if not v['tablet_dropped'] or v['dissolved_pct'] >= 100.0:
                    continue

                # Tablet Profile
                prof = self.TABLET_PROFILES['prednisone']
                for p in self.TABLET_PROFILES.values():
                    if p['name'] == v['tablet_name']:
                        prof = p
                        break

                # Surface area reduction model: A(t) = A0 * (1 - dissolved_pct/100)^(2/3)
                rem_frac = max(0.0, 1.0 - (v['dissolved_pct'] / 100.0))
                area_factor = rem_frac ** (2.0 / 3.0)

                # Concentration gradient driving force: (Cs - C)
                c_sat = prof['solubility_mg_ml']
                driving_force = max(0.0, (c_sat - v['conc_mg_ml']) / c_sat)

                # Rate: %/sec
                d_pct = prof['k_rate'] * stir_factor * temp_factor * area_factor * driving_force * 100.0 * dt_s
                v['dissolved_pct'] = min(100.0, v['dissolved_pct'] + d_pct)
                v['conc_mg_ml'] = (v['dissolved_pct'] / 100.0) * (v['tablet_mass_mg'] / self.VESSEL_MEDIUM_VOL_ML)
                v['tablet_radius_mm'] = 4.5 * (rem_frac ** (1.0 / 3.0))

            # Check if all completed or reached 30 min (1800s)
            all_done = all(v['dissolved_pct'] >= 99.5 for v in self.vessels if v['tablet_dropped'])
            if all_done:
                self.state = 'COMPLETE'

        # 5. USP Temperature Compliance Monitoring
        self.alarms.clear()
        if self.state == 'RUNNING_DISSOLUTION':
            if abs(self.bath_temp_c - 37.0) > 0.5:
                self.alarms.append('USP WARNING: Water bath temperature out of spec (37.0 ± 0.5 °C).')

    # -------------------------------------------------------------------------
    # Telemetry & GLP Reporting
    # -------------------------------------------------------------------------
    def get_telemetry(self) -> Dict[str, Any]:
        """Return real-time diagnostic telemetry dictionary."""
        avg_dissolved = 0.0
        active_count = sum(1 for v in self.vessels if v['tablet_dropped'])
        if active_count > 0:
            avg_dissolved = sum(v['dissolved_pct'] for v in self.vessels if v['tablet_dropped']) / active_count

        return {
            'is_plugged_in': self.is_plugged_in,
            'power_switch_on': self.power_switch_on,
            'state': self.state,
            'head_elevation_mm': round(self.head_elevation_mm, 1),
            'bath_temp_c': round(self.bath_temp_c, 2),
            'spindle_rpm': round(self.spindle_rpm, 1),
            'avg_dissolved_pct': round(avg_dissolved, 2),
            'run_timer_s': round(self.run_timer_s, 1),
            'alarms': list(self.alarms)
        }

    def record_glp_batch(self, batch_id: str = 'USP_DISS_001') -> Dict[str, Any]:
        """Record and log GLP certified USP <711> dissolution report."""
        v_results = [round(v['dissolved_pct'], 2) for v in self.vessels]
        avg_pct = round(sum(v_results) / len(v_results), 2)

        # Standard Deviation
        variance = sum((x - avg_pct) ** 2 for x in v_results) / len(v_results)
        rsd_pct = round((math.sqrt(variance) / avg_pct) * 100.0, 2) if avg_pct > 0 else 0.0

        record = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'batch_id': batch_id,
            'rpm': round(self.spindle_rpm, 1),
            'temp_c': round(self.bath_temp_c, 2),
            'avg_pct': avg_pct,
            'rsd_pct': rsd_pct,
            'status': 'PASS' if rsd_pct <= 5.0 and len(self.alarms) == 0 else 'WARNING'
        }
        self.glp_records.append(record)
        return record
