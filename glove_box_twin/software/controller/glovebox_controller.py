"""
Glove Box Controller State Engine
Pure Python state machine for inert atmosphere laboratory glove box
(e.g., MBraun UNIlab Pro SP with Siemens/BOSCH PLC architecture).
"""

from enum import Enum, auto
from typing import Dict, Any


class GloveBoxState(Enum):
    PURGED = auto()
    PURGING = auto()
    ANTECHAMBER_EVAC = auto()
    ANTECHAMBER_REFILL = auto()
    RECIRCULATING = auto()
    REGENERATING = auto()
    FAULT_O2_ALARM = auto()
    FAULT_H2O_ALARM = auto()
    FAULT_OVERPRESSURE = auto()
    FAULT_UNDERPRESSURE = auto()


class GloveBoxController:
    """Industrial glove box atmosphere and antechamber transfer controller."""

    def __init__(self, max_o2_ppm: float = 1.0, max_h2o_ppm: float = 1.0):
        self.max_o2_ppm = float(max_o2_ppm)
        self.max_h2o_ppm = float(max_h2o_ppm)

        self.state = GloveBoxState.PURGED
        self.o2_ppm = 0.2
        self.h2o_ppm = 0.1
        self.pressure_mbar = 3.5  # Positive working pressure (+0.14 in H2O)
        self.pressure_setpoint_mbar = 3.5

        # Antechamber hardware status
        self.antechamber_inner_door_open = False
        self.antechamber_outer_door_open = False
        self.antechamber_vacuum_mbar = 1013.0
        self.antechamber_cycles_completed = 0
        self.target_antechamber_cycles = 3
        self.auto_antechamber_cycling = False

        # Gas supply & circulation
        self.gas_type = "Argon"  # "Argon" or "Nitrogen"
        self.purging_active = False
        self.purge_flow_lpm = 0.0
        self.circulation_active = True
        self.blower_flow_lpm = 150.0

        # Operator foot pedal (depress for temporary negative pressure assist)
        self.foot_pedal_active = False

        # Solenoid valves
        self.inlet_solenoid_open = False
        self.vent_solenoid_open = False

        self.alarm_message = ""

    def set_gas_type(self, gas: str) -> bool:
        if gas in ("Argon", "Nitrogen"):
            self.gas_type = gas
            return True
        return False

    def set_pressure_setpoint(self, mbar: float) -> bool:
        if 0.5 <= mbar <= 6.0:
            self.pressure_setpoint_mbar = float(mbar)
            return True
        return False

    def start_purge(self) -> bool:
        """Initiate high-volume chamber purge. Requires doors to not be simultaneously open."""
        if self.antechamber_inner_door_open and self.antechamber_outer_door_open:
            return False
        self.purging_active = True
        self.purge_flow_lpm = 45.0
        self.state = GloveBoxState.PURGING
        return True

    def stop_purge(self) -> None:
        self.purging_active = False
        self.purge_flow_lpm = 0.0
        if self.state == GloveBoxState.PURGING:
            self.state = GloveBoxState.PURGED

    def press_foot_pedal(self) -> None:
        """Foot pedal depression: creates slight negative pressure assist (-1.5 mbar) for gloves."""
        self.foot_pedal_active = True

    def release_foot_pedal(self) -> None:
        """Foot pedal release: restores positive pressure equilibrium."""
        self.foot_pedal_active = False

    def open_outer_door(self) -> bool:
        """Open antechamber outer loading door (atmosphere side). Interlocked against inner door."""
        if self.antechamber_inner_door_open:
            return False
        # Cannot open if deep vacuum in antechamber
        if self.antechamber_vacuum_mbar < 950.0:
            return False
        self.antechamber_outer_door_open = True
        # Exposing antechamber to atmospheric air invalidates previous purge cycles
        self.antechamber_cycles_completed = 0
        return True

    def close_outer_door(self) -> bool:
        self.antechamber_outer_door_open = False
        return True

    def open_inner_door(self) -> bool:
        """Open antechamber inner transfer door (box side). Interlocked against outer door and air."""
        if self.antechamber_outer_door_open:
            return False
        # Cannot open if antechamber has not been purged or is at atmospheric air without evac
        if self.antechamber_vacuum_mbar < 950.0:
            return False  # Must be equalized to box pressure
        if self.state == GloveBoxState.ANTECHAMBER_EVAC:
            return False
        self.antechamber_inner_door_open = True
        return True

    def close_inner_door(self) -> bool:
        self.antechamber_inner_door_open = False
        return True

    def evacuate_antechamber(self, auto_cycle: bool = False) -> bool:
        """Start vacuum roughing pump on antechamber."""
        if self.antechamber_inner_door_open or self.antechamber_outer_door_open:
            return False
        self.auto_antechamber_cycling = auto_cycle
        self.state = GloveBoxState.ANTECHAMBER_EVAC
        return True

    def refill_antechamber(self) -> bool:
        """Refill antechamber with inert working gas from chamber supply."""
        if self.antechamber_inner_door_open or self.antechamber_outer_door_open:
            return False
        self.state = GloveBoxState.ANTECHAMBER_REFILL
        return True

    def start_antechamber_sequence(self, cycles: int = 3) -> bool:
        """Start 3-cycle automated evacuate & refill sequence for clean sample ingress."""
        if self.antechamber_inner_door_open or self.antechamber_outer_door_open:
            return False
        self.target_antechamber_cycles = max(1, min(cycles, 5))
        self.antechamber_cycles_completed = 0
        return self.evacuate_antechamber(auto_cycle=True)

    def acknowledge_alarms(self) -> None:
        """Reset latching alarm states if values returned to safe range."""
        if self.state in (
            GloveBoxState.FAULT_O2_ALARM,
            GloveBoxState.FAULT_H2O_ALARM,
            GloveBoxState.FAULT_OVERPRESSURE,
            GloveBoxState.FAULT_UNDERPRESSURE,
        ):
            if (
                self.o2_ppm <= self.max_o2_ppm
                and self.h2o_ppm <= self.max_h2o_ppm
                and -4.0 <= self.pressure_mbar <= 7.0
            ):
                self.alarm_message = ""
                self.state = GloveBoxState.PURGED

    def tick(self, dt_sec: float = 1.0) -> None:
        """Execute physical dynamics loop: gas purity, differential pressure, vacuum cycle."""
        dt = max(0.001, dt_sec)

        # 1. Purge dynamics
        if self.purging_active:
            # Purge gas rapidly displaces O2 and H2O
            self.o2_ppm = max(0.1, self.o2_ppm - 0.5 * dt)
            self.h2o_ppm = max(0.1, self.h2o_ppm - 0.5 * dt)
            if self.o2_ppm <= 0.5 and self.h2o_ppm <= 0.5:
                self.purging_active = False
                self.purge_flow_lpm = 0.0
                self.state = GloveBoxState.PURGED

        # 2. Circulation & catalyst scrubbing
        if self.circulation_active and not self.purging_active:
            # Copper catalyst & molecular sieve scrub residual O2 and H2O
            if self.o2_ppm > 0.05:
                self.o2_ppm = max(0.05, self.o2_ppm - 0.02 * dt)
            if self.h2o_ppm > 0.05:
                self.h2o_ppm = max(0.05, self.h2o_ppm - 0.02 * dt)

        # 3. Antechamber Evacuation & Refill loop
        if self.state == GloveBoxState.ANTECHAMBER_EVAC:
            # Vacuum pump pulls down to 0.1 mbar
            self.antechamber_vacuum_mbar = max(0.1, self.antechamber_vacuum_mbar - 200.0 * dt)
            if self.antechamber_vacuum_mbar <= 1.0:
                if self.auto_antechamber_cycling:
                    self.state = GloveBoxState.ANTECHAMBER_REFILL
                else:
                    self.state = GloveBoxState.PURGED

        elif self.state == GloveBoxState.ANTECHAMBER_REFILL:
            # Inert gas refills antechamber back to atmospheric 1013 mbar
            self.antechamber_vacuum_mbar = min(1013.0, self.antechamber_vacuum_mbar + 250.0 * dt)
            if self.antechamber_vacuum_mbar >= 1012.0:
                if self.auto_antechamber_cycling:
                    self.antechamber_cycles_completed += 1
                    if self.antechamber_cycles_completed < self.target_antechamber_cycles:
                        self.state = GloveBoxState.ANTECHAMBER_EVAC
                    else:
                        self.auto_antechamber_cycling = False
                        self.state = GloveBoxState.PURGED
                else:
                    self.state = GloveBoxState.PURGED

        # 4. Chamber differential pressure control loop
        target_p = -1.5 if self.foot_pedal_active else self.pressure_setpoint_mbar
        p_diff = target_p - self.pressure_mbar

        if p_diff > 0.2:
            # Need more gas
            self.inlet_solenoid_open = True
            self.vent_solenoid_open = False
            self.pressure_mbar = min(target_p, self.pressure_mbar + 1.2 * dt)
        elif p_diff < -0.2:
            # Overpressure: vent
            self.inlet_solenoid_open = False
            self.vent_solenoid_open = True
            self.pressure_mbar = max(target_p, self.pressure_mbar - 1.5 * dt)
        else:
            self.inlet_solenoid_open = False
            self.vent_solenoid_open = False

        # 5. Leak ingress if inner door opened to unpurged antechamber
        if self.antechamber_inner_door_open and self.antechamber_cycles_completed == 0:
            self.o2_ppm = min(500.0, self.o2_ppm + 15.0 * dt)
            self.h2o_ppm = min(500.0, self.h2o_ppm + 12.0 * dt)

        # 6. Safety interlock alarms
        if self.o2_ppm > self.max_o2_ppm + 5.0:
            self.state = GloveBoxState.FAULT_O2_ALARM
            self.alarm_message = f"HIGH O2 ALARM: {self.o2_ppm:.1f} ppm (Limit: {self.max_o2_ppm:.1f})"
        elif self.h2o_ppm > self.max_h2o_ppm + 5.0:
            self.state = GloveBoxState.FAULT_H2O_ALARM
            self.alarm_message = f"HIGH H2O ALARM: {self.h2o_ppm:.1f} ppm (Limit: {self.max_h2o_ppm:.1f})"
        elif self.pressure_mbar >= 7.5:
            self.state = GloveBoxState.FAULT_OVERPRESSURE
            self.alarm_message = f"OVERPRESSURE: {self.pressure_mbar:.1f} mbar"
            self.vent_solenoid_open = True
        elif self.pressure_mbar < -4.5:
            self.state = GloveBoxState.FAULT_UNDERPRESSURE
            self.alarm_message = f"UNDERPRESSURE: {self.pressure_mbar:.1f} mbar"
            self.inlet_solenoid_open = True

    def get_telemetry(self) -> Dict[str, Any]:
        """Export comprehensive telemetry packet for UI and remote monitoring."""
        return {
            "state": self.state.name,
            "o2_ppm": round(self.o2_ppm, 3),
            "h2o_ppm": round(self.h2o_ppm, 3),
            "pressure_mbar": round(self.pressure_mbar, 2),
            "pressure_setpoint_mbar": self.pressure_setpoint_mbar,
            "gas_type": self.gas_type,
            "purging_active": self.purging_active,
            "purge_flow_lpm": round(self.purge_flow_lpm, 1),
            "circulation_active": self.circulation_active,
            "blower_flow_lpm": self.blower_flow_lpm,
            "foot_pedal_active": self.foot_pedal_active,
            "antechamber": {
                "vacuum_mbar": round(self.antechamber_vacuum_mbar, 1),
                "inner_door_open": self.antechamber_inner_door_open,
                "outer_door_open": self.antechamber_outer_door_open,
                "cycles_completed": self.antechamber_cycles_completed,
                "target_cycles": self.target_antechamber_cycles,
                "auto_cycling": self.auto_antechamber_cycling,
            },
            "solenoids": {
                "inlet_open": self.inlet_solenoid_open,
                "vent_open": self.vent_solenoid_open,
            },
            "alarm_message": self.alarm_message,
        }
