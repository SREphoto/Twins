"""
Labconco FreeZone 4.5L (-84°C) Benchtop Freeze Dryer / Lyophilizer
Dual-Truth Thermodynamic State Machine Controller
"""

import math
import time
from typing import Dict, List, Any, Optional

class FreezeDryerController:
    """
    Thermodynamic state machine and physics model for the Labconco FreeZone 4.5L (-84°C)
    cascade benchtop lyophilizer.
    """

    # Physical Constants
    AMBIENT_TEMP_C = 21.5
    TARGET_STAGE1_TEMP_C = -35.0
    TARGET_COLLECTOR_TEMP_C = -84.0
    ATMOSPHERIC_PRESSURE_MBAR = 1013.25
    ULTIMATE_VACUUM_MBAR = 0.020
    VACUUM_PERMISSIVE_TEMP_C = -40.0 # Safety interlock: condenser must be <= -40°C
    MAX_FROST_CAPACITY_G = 4500.0 # 4.5 L ice capacity

    def __init__(self):
        # Electrical Continuity (Rule 9 / DIAG-014)
        self.is_plugged_in: bool = True
        self.power_switch_on: bool = True

        # State Machine
        self.state: str = 'STANDBY'
        self.alarms: List[str] = []

        # Thermal State
        self.collector_temp_c: float = self.AMBIENT_TEMP_C
        self.stage1_temp_c: float = self.AMBIENT_TEMP_C
        self.compressor_stage1: bool = False
        self.compressor_stage2: bool = False

        # Vacuum State
        self.vacuum_mbar: float = self.ATMOSPHERIC_PRESSURE_MBAR
        self.vacuum_pump: bool = False
        self.solenoid_valve_open: bool = False

        # 12 Quick-Seal Ports & Vessels
        self.valves: List[Dict[str, Any]] = []
        for i in range(12):
            self.valves.append({
                'index': i,
                'state': 'CLOSED', # 'CLOSED', 'VACUUM', 'VENT'
                'has_flask': (i in [0, 6]), # Flask 0 (300mL) and Flask 6 (600mL) mounted by default
                'sample_name': f'Pharma Lyophile #{i+1}' if i in [0, 6] else 'Empty Port',
                'sample_mass_g': 50.0 if i == 0 else (120.0 if i == 6 else 0.0),
                'cake_thickness_mm': 12.0 if i in [0, 6] else 0.0,
                'sublimated_mass_g': 0.0
            })

        # Frost Accumulation
        self.frost_mass_g: float = 0.0
        self.frost_thickness_mm: float = 0.0

        # Defrost & Drain
        self.defrost_active: bool = False
        self.drain_open: bool = False

        # Timers & GLP Logging
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
        """Unplug from bench duplex receptacle: cuts all electrical power immediately."""
        self.is_plugged_in = False
        self._emergency_shutdown()

    def set_power_switch(self, on: bool) -> None:
        """Toggle front illuminated power rocker switch."""
        self.power_switch_on = on
        if not on:
            self._emergency_shutdown()
        elif self.is_plugged_in and self.state == 'POWER_OFF':
            self.state = 'STANDBY'

    def _emergency_shutdown(self) -> None:
        """Immediate de-energization of all actuators on continuity loss."""
        self.state = 'POWER_OFF'
        self.compressor_stage1 = False
        self.compressor_stage2 = False
        self.vacuum_pump = False
        self.solenoid_valve_open = False
        self.defrost_active = False

    # -------------------------------------------------------------------------
    # Actuator Commands & Interlocks
    # -------------------------------------------------------------------------
    def start_refrigeration(self) -> bool:
        """Start dual-stage cascade refrigeration pull-down."""
        if not self.is_plugged_in or not self.power_switch_on:
            return False
        if self.defrost_active:
            self.defrost_active = False

        self.compressor_stage1 = True
        self.state = 'PRE_COOLING'
        return True

    def stop_refrigeration(self) -> None:
        """Shut off refrigeration compressors."""
        self.compressor_stage1 = False
        self.compressor_stage2 = False
        if self.state in ['PRE_COOLING']:
            self.state = 'STANDBY'

    def start_vacuum(self) -> bool:
        """
        Start external Edwards RV5 vacuum pump.
        Safety Interlock: Condenser collector must be <= -40.0°C to prevent pump oil contamination.
        """
        if not self.is_plugged_in or not self.power_switch_on:
            return False

        if self.collector_temp_c > self.VACUUM_PERMISSIVE_TEMP_C:
            alarm_msg = f'INTERLOCK: Collector warm ({self.collector_temp_c:.1f}°C > {self.VACUUM_PERMISSIVE_TEMP_C}°C). Pre-cool required.'
            if alarm_msg not in self.alarms:
                self.alarms.append(alarm_msg)
            return False

        self.vacuum_pump = True
        self.solenoid_valve_open = True
        self.state = 'PULL_DOWN'
        return True

    def stop_vacuum(self) -> None:
        """Stop vacuum pump and close anti-suckback solenoid valve."""
        self.vacuum_pump = False
        self.solenoid_valve_open = False
        if self.state in ['PULL_DOWN', 'PRIMARY_DRYING', 'SECONDARY_DRYING']:
            self.state = 'STANDBY'

    def set_valve_state(self, valve_index: int, state: str) -> bool:
        """
        Set Quick-Seal valve state ('CLOSED', 'VACUUM', 'VENT').
        """
        if valve_index < 0 or valve_index >= len(self.valves):
            return False
        if state not in ['CLOSED', 'VACUUM', 'VENT']:
            return False

        self.valves[valve_index]['state'] = state

        # If vacuum is open to a flask with product, initiate primary drying
        if state == 'VACUUM' and self.vacuum_mbar < 0.500 and self.valves[valve_index]['has_flask']:
            if self.state in ['PULL_DOWN', 'STANDBY']:
                self.state = 'PRIMARY_DRYING'

        # If venting
        if state == 'VENT':
            # Air enters through valve port
            pass

        return True

    def start_defrost(self) -> bool:
        """Initiate hot gas / warm air defrost of collector ice."""
        if not self.is_plugged_in or not self.power_switch_on:
            return False

        # Stop cooling and vacuum before defrosting
        self.stop_refrigeration()
        self.stop_vacuum()
        self.defrost_active = True
        self.state = 'DEFROST'
        return True

    def vent_chamber(self) -> None:
        """Break vacuum and aerate manifold drum to atmosphere."""
        self.solenoid_valve_open = False
        self.vacuum_pump = False
        self.state = 'BREAK_VACUUM'

    # -------------------------------------------------------------------------
    # Physics Integration Step
    # -------------------------------------------------------------------------
    def step(self, dt_s: float) -> None:
        """
        Simulate one thermodynamic time increment dt_s.
        """
        if not self.is_plugged_in or not self.power_switch_on:
            # Passive warming towards ambient and atmospheric leakage
            self.collector_temp_c += (self.AMBIENT_TEMP_C - self.collector_temp_c) * (0.01 * dt_s)
            self.stage1_temp_c += (self.AMBIENT_TEMP_C - self.stage1_temp_c) * (0.01 * dt_s)
            self.vacuum_mbar += (self.ATMOSPHERIC_PRESSURE_MBAR - self.vacuum_mbar) * (0.05 * dt_s)
            return

        self.run_timer_s += dt_s

        # 1. Thermal Cascade Simulation
        if self.compressor_stage1:
            # Stage 1 pulls to -35°C
            d_t1 = (self.TARGET_STAGE1_TEMP_C - self.stage1_temp_c) * (0.12 * dt_s)
            self.stage1_temp_c += d_t1

            # When stage 1 <= -20°C, stage 2 auto-starts
            if self.stage1_temp_c <= -20.0:
                self.compressor_stage2 = True

        if self.compressor_stage2:
            # Stage 2 pulls collector to -84°C
            d_tc = (self.TARGET_COLLECTOR_TEMP_C - self.collector_temp_c) * (0.15 * dt_s)
            self.collector_temp_c += d_tc
        elif not self.defrost_active:
            # Passive warming if compressors off
            self.collector_temp_c += (self.AMBIENT_TEMP_C - self.collector_temp_c) * (0.02 * dt_s)

        if self.defrost_active:
            # Warm collector to +30°C to melt frost
            self.collector_temp_c += (30.0 - self.collector_temp_c) * (0.25 * dt_s)
            if self.frost_mass_g > 0.0:
                melt_rate = 15.0 * dt_s # 15 g/s
                self.frost_mass_g = max(0.0, self.frost_mass_g - melt_rate)
                self.frost_thickness_mm = max(0.0, (self.frost_mass_g / self.MAX_FROST_CAPACITY_G) * 8.0)
            if self.frost_mass_g <= 0.0 and self.collector_temp_c >= 20.0:
                self.defrost_active = False
                self.state = 'STANDBY'

        # 2. Vacuum Evacuation Simulation
        if self.vacuum_pump and self.solenoid_valve_open:
            # Exponential pump-down to ultimate vacuum
            decay_rate = 0.35 * dt_s
            self.vacuum_mbar = self.ULTIMATE_VACUUM_MBAR + (self.vacuum_mbar - self.ULTIMATE_VACUUM_MBAR) * math.exp(-decay_rate)
        elif self.state == 'BREAK_VACUUM':
            # Fast venting
            vent_rate = 0.50 * dt_s
            self.vacuum_mbar += (self.ATMOSPHERIC_PRESSURE_MBAR - self.vacuum_mbar) * vent_rate
            if self.vacuum_mbar >= self.ATMOSPHERIC_PRESSURE_MBAR - 5.0:
                self.vacuum_mbar = self.ATMOSPHERIC_PRESSURE_MBAR
                self.state = 'STANDBY'

        # 3. Sublimation & Frost Accumulation
        active_sublimating_valves = [
            v for v in self.valves
            if v['state'] == 'VACUUM' and v['has_flask'] and (v['sample_mass_g'] - v['sublimated_mass_g']) > 0.0
        ]

        if active_sublimating_valves and self.vacuum_mbar < 0.500 and self.collector_temp_c <= -40.0:
            self.state = 'PRIMARY_DRYING'
            total_flux = 0.0
            for v in active_sublimating_valves:
                # Sublimation rate depends on driving pressure difference
                rate_g_per_s = 0.85 * dt_s # typical benchtop sublimation rate
                remaining_cake = v['sample_mass_g'] - v['sublimated_mass_g']
                actual_sub = min(remaining_cake, rate_g_per_s)

                v['sublimated_mass_g'] += actual_sub
                v['cake_thickness_mm'] = max(0.0, 12.0 * (1.0 - v['sublimated_mass_g'] / v['sample_mass_g']))
                total_flux += actual_sub

            # Frost condenses on collector coil
            self.frost_mass_g = min(self.MAX_FROST_CAPACITY_G, self.frost_mass_g + total_flux)
            self.frost_thickness_mm = (self.frost_mass_g / self.MAX_FROST_CAPACITY_G) * 8.0 # up to 8mm thickness

            # Check if all cakes are depleted -> Secondary drying
            any_remaining = any(
                v['has_flask'] and (v['sample_mass_g'] - v['sublimated_mass_g']) > 0.0
                for v in self.valves
            )
            if not any_remaining:
                self.state = 'SECONDARY_DRYING'

        # 4. Safety Alarm Monitoring
        self.alarms.clear()
        if self.state in ['PRIMARY_DRYING', 'PULL_DOWN'] and self.vacuum_mbar > 0.450 and self.run_timer_s > 60.0:
            self.alarms.append('ALARM: High vacuum pressure (> 0.450 mbar). Check seals and valves.')
        if self.state in ['PRIMARY_DRYING'] and self.collector_temp_c > -60.0:
            self.alarms.append('ALARM: Warm collector temperature (> -60°C). Risk of melt-back.')

    # -------------------------------------------------------------------------
    # Telemetry & GLP Reporting
    # -------------------------------------------------------------------------
    def get_telemetry(self) -> Dict[str, Any]:
        """Return real-time diagnostic telemetry dictionary."""
        return {
            'is_plugged_in': self.is_plugged_in,
            'power_switch_on': self.power_switch_on,
            'state': self.state,
            'collector_temp_c': round(self.collector_temp_c, 1),
            'stage1_temp_c': round(self.stage1_temp_c, 1),
            'vacuum_mbar': round(self.vacuum_mbar, 4),
            'compressor_stage1': self.compressor_stage1,
            'compressor_stage2': self.compressor_stage2,
            'vacuum_pump': self.vacuum_pump,
            'frost_mass_g': round(self.frost_mass_g, 1),
            'frost_thickness_mm': round(self.frost_thickness_mm, 2),
            'run_timer_s': round(self.run_timer_s, 1),
            'alarms': list(self.alarms)
        }

    def record_glp_batch(self, batch_id: str = 'LYO_BATCH_001') -> Dict[str, Any]:
        """Record and log GLP certified analytical lyophilization record."""
        record = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'batch_id': batch_id,
            'collector_temp_c': round(self.collector_temp_c, 1),
            'vacuum_mbar': round(self.vacuum_mbar, 4),
            'total_frost_g': round(self.frost_mass_g, 1),
            'duration_s': round(self.run_timer_s, 1),
            'status': 'PASS' if len(self.alarms) == 0 else 'WARNING'
        }
        self.glp_records.append(record)
        return record
