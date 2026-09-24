"""
MICRO 5424-R behavioural controller (digital twin).

Pure Python, no GUI. See docs/control_spec.md.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional

try:
    from samples import LabBench, list_materials
except ImportError:  # package import
    from .samples import LabBench, list_materials


R_CM = 8.4
RCF_FACTOR = 1.118e-5
RPM_MIN = 100
RPM_MAX = 15000
RPM_STEP = 50
TEMP_MIN = -10.0
TEMP_MAX = 40.0
ACCEL_TIME_S = 20.0
DECEL_TIME_S = 15.0


class State(str, Enum):
    LID_OPEN = "LID_OPEN"
    READY = "READY"
    ACCEL = "ACCEL"
    RUN = "RUN"
    DECEL = "DECEL"
    END = "END"
    ERR_LID = "ERR_LID"
    ERR_IMBALANCE = "ERR_IMBALANCE"
    ERR_TACHO = "ERR_TACHO"
    ERR_OVERSPEED = "ERR_OVERSPEED"
    ERR_MOTOR = "ERR_MOTOR"


class DisplayMode(str, Enum):
    RPM = "RPM"
    RCF = "RCF"
    TIME = "TIME"
    TEMP = "TEMP"


class Focus(str, Enum):
    RPM = "RPM"
    TIME = "TIME"
    TEMP = "TEMP"


def rpm_to_rcf(rpm: float, r_cm: float = R_CM) -> float:
    return RCF_FACTOR * r_cm * (rpm ** 2)


def rcf_to_rpm(rcf: float, r_cm: float = R_CM) -> float:
    if rcf <= 0:
        return 0.0
    return (rcf / (RCF_FACTOR * r_cm)) ** 0.5


def clamp_rpm(rpm: float) -> int:
    rpm = max(RPM_MIN, min(RPM_MAX, rpm))
    # snap to step
    stepped = int(round(rpm / RPM_STEP) * RPM_STEP)
    return max(RPM_MIN, min(RPM_MAX, stepped))


@dataclass
class CentrifugeController:
    """Firmware-style state machine for the digital twin."""

    state: State = State.LID_OPEN
    rpm_set: int = 14800
    rpm_actual: float = 0.0
    time_set_s: int = 15 * 60
    time_elapsed_s: float = 0.0
    temp_set_c: float = 4.0
    temp_actual_c: float = 22.0
    lid_open: bool = True
    lid_locked: bool = False
    display_mode: DisplayMode = DisplayMode.RPM
    focus: Focus = Focus.RPM
    short_held: bool = False
    auto_open_on_end: bool = True
    error: Optional[str] = None
    require_lid_open_for_tubes: bool = True
    check_balance_on_start: bool = True
    lab: LabBench = field(default_factory=LabBench)
    last_separation_changes: List[str] = field(default_factory=list)
    _run_active: bool = field(default=False, repr=False)
    _run_peak_rpm: float = field(default=0.0, repr=False)
    _run_peak_rcf: float = field(default=0.0, repr=False)
    _run_spin_time_s: float = field(default=0.0, repr=False)
    _separation_applied: bool = field(default=False, repr=False)

    # --- derived ---
    @property
    def rcf_set(self) -> float:
        return rpm_to_rcf(self.rpm_set)

    @property
    def rcf_actual(self) -> float:
        return rpm_to_rcf(self.rpm_actual)

    @property
    def led_run(self) -> bool:
        return self.state in (State.ACCEL, State.RUN, State.DECEL)

    @property
    def led_fault(self) -> bool:
        return self.state.name.startswith("ERR_")

    def can_access_tubes(self) -> bool:
        if self.rpm_actual > 0.5:
            return False
        if self.state in (State.ACCEL, State.RUN, State.DECEL):
            return False
        if self.require_lid_open_for_tubes and not self.lid_open:
            return False
        return True

    def snapshot(self) -> Dict[str, Any]:
        return {
            "state": self.state.value,
            "rpm_set": self.rpm_set,
            "rpm_actual": round(self.rpm_actual, 1),
            "rcf_set": round(self.rcf_set, 1),
            "rcf_actual": round(self.rcf_actual, 1),
            "time_set_s": self.time_set_s,
            "time_elapsed_s": round(self.time_elapsed_s, 1),
            "temp_set_c": self.temp_set_c,
            "temp_actual_c": round(self.temp_actual_c, 2),
            "lid_open": self.lid_open,
            "lid_locked": self.lid_locked,
            "display_mode": self.display_mode.value,
            "focus": self.focus.value,
            "error": self.error,
            "led_run": self.led_run,
            "led_fault": self.led_fault,
            "can_access_tubes": self.can_access_tubes(),
            "last_separation_changes": list(self.last_separation_changes),
            "lab": self.lab.snapshot(),
            "materials": list_materials(),
        }

    # --- sensors / UI events ---
    def close_lid(self) -> None:
        if self.rpm_actual > 0.5:
            return
        self.lid_open = False
        self.lid_locked = True
        if self.state in (State.LID_OPEN, State.END) or (
            self.state.name.startswith("ERR_") and self.rpm_actual < 0.5
        ):
            self.state = State.READY
            self.error = None

    def open_lid_physical(self) -> None:
        """Called when interlock releases and lid moves open."""
        if self.lid_locked and self.rpm_actual > 0.5:
            return
        self.lid_open = True
        self.lid_locked = False
        self.state = State.LID_OPEN
        self.rpm_actual = 0.0
        self._run_active = False

    def press_start(self) -> None:
        if self.lid_open:
            self.state = State.ERR_LID
            self.error = "E-01 LID"
            return
        if self.state not in (State.READY, State.END):
            return
        if self.check_balance_on_start:
            bal = self.lab.balance_report()
            if not bal["balanced"] and bal["occupied_slots"]:
                self.state = State.ERR_IMBALANCE
                self.error = "E-02 IMBALANCE"
                return
        self.time_elapsed_s = 0.0
        self.lid_locked = True
        self.state = State.ACCEL
        self._run_active = True
        self.error = None
        self.last_separation_changes = []
        self._run_peak_rpm = 0.0
        self._run_peak_rcf = 0.0
        self._run_spin_time_s = 0.0
        self._separation_applied = False

    def press_stop(self) -> None:
        if self.state in (State.ACCEL, State.RUN):
            self.state = State.DECEL
            self.short_held = False
            return
        if self.state.name.startswith("ERR_") and self.rpm_actual < 0.5:
            self.error = None
            self.state = State.READY if not self.lid_open else State.LID_OPEN

    def press_open(self) -> None:
        if self.rpm_actual > 0.5 or self.state in (State.ACCEL, State.RUN, State.DECEL):
            return
        self.lid_locked = False
        self.open_lid_physical()

    def short_down(self) -> None:
        if self.lid_open:
            self.state = State.ERR_LID
            self.error = "E-01 LID"
            return
        if self.state not in (State.READY, State.END, State.RUN, State.ACCEL):
            return
        self.short_held = True
        self.lid_locked = True
        if self.state in (State.READY, State.END):
            self.state = State.ACCEL
            self._run_active = True
            self.time_elapsed_s = 0.0

    def short_up(self) -> None:
        if self.short_held:
            self.short_held = False
            if self.state in (State.ACCEL, State.RUN):
                self.state = State.DECEL

    def toggle_rpm_rcf(self) -> None:
        if self.display_mode == DisplayMode.RPM:
            self.display_mode = DisplayMode.RCF
        elif self.display_mode == DisplayMode.RCF:
            self.display_mode = DisplayMode.RPM
        else:
            self.display_mode = DisplayMode.RPM

    def focus_time(self) -> None:
        self.focus = Focus.TIME
        self.display_mode = DisplayMode.TIME

    def focus_temp(self) -> None:
        self.focus = Focus.TEMP
        self.display_mode = DisplayMode.TEMP

    def focus_speed(self) -> None:
        self.focus = Focus.RPM
        if self.display_mode not in (DisplayMode.RPM, DisplayMode.RCF):
            self.display_mode = DisplayMode.RPM

    def nudge(self, direction: int) -> None:
        """direction: +1 or -1."""
        if self.state in (State.ACCEL, State.RUN, State.DECEL):
            return
        if self.focus == Focus.RPM:
            if self.display_mode == DisplayMode.RCF:
                rcf = self.rcf_set + direction * 100
                self.rpm_set = clamp_rpm(rcf_to_rpm(max(0, rcf)))
            else:
                self.rpm_set = clamp_rpm(self.rpm_set + direction * RPM_STEP)
        elif self.focus == Focus.TIME:
            self.time_set_s = max(0, self.time_set_s + direction * 30)
        elif self.focus == Focus.TEMP:
            self.temp_set_c = max(TEMP_MIN, min(TEMP_MAX, self.temp_set_c + direction))

    def inject_imbalance(self) -> None:
        if self.state in (State.ACCEL, State.RUN):
            self.state = State.DECEL
            self.error = "E-02 IMBALANCE"
            # fault latched after stop in tick

    def inject_tacho_fail(self) -> None:
        if self.state in (State.ACCEL, State.RUN):
            self.state = State.DECEL
            self.error = "E-03 TACHO"

    # --- tube / rack operations (lid open, stopped) ---
    def _require_tube_access(self) -> None:
        if not self.can_access_tubes():
            raise RuntimeError("open lid and stop rotor before handling tubes")

    def set_tube_material(self, tube_id: str, material_id: str) -> None:
        self._require_tube_access()
        self.lab.set_material(tube_id, material_id)

    def unload_rotor_slot(self, rotor_slot: int) -> str:
        self._require_tube_access()
        return self.lab.unload_rotor_to_rack(rotor_slot)

    def load_rack_slot(self, rack_slot: int, rotor_slot: Optional[int] = None) -> str:
        self._require_tube_access()
        return self.lab.load_rack_to_rotor(rack_slot, rotor_slot)

    def unload_all_to_rack(self) -> int:
        self._require_tube_access()
        return self.lab.unload_all_rotor_to_rack()

    def load_balanced_demo(self, material_id: str) -> List[str]:
        self._require_tube_access()
        return self.lab.load_balanced_pair(material_id)

    def remix_tube(self, tube_id: str) -> None:
        self._require_tube_access()
        self.lab.remix_tube(tube_id)

    def _finalize_separation(self) -> None:
        if self._separation_applied:
            return
        # Only separate on clean end (not imbalance abort mid-run unless they got spin time)
        if self.error in ("E-02 IMBALANCE", "E-03 TACHO") and self._run_spin_time_s < 5:
            self._separation_applied = True
            return
        changed = self.lab.apply_centrifugation(
            peak_rcf=self._run_peak_rcf,
            spun_time_s=self._run_spin_time_s,
            peak_rpm=self._run_peak_rpm,
        )
        self.last_separation_changes = changed
        self._separation_applied = True

    def tick(self, dt: float) -> None:
        """Advance simulation by dt seconds."""
        if dt <= 0:
            return

        # Thermal lag toward setpoint when lid closed
        if not self.lid_open:
            tau = 30.0
            self.temp_actual_c += (self.temp_set_c - self.temp_actual_c) * min(1.0, dt / tau)
        else:
            self.temp_actual_c += (22.0 - self.temp_actual_c) * min(1.0, dt / 60.0)

        if self.state == State.ACCEL:
            rate = self.rpm_set / ACCEL_TIME_S
            self.rpm_actual = min(self.rpm_set, self.rpm_actual + rate * dt)
            self._run_peak_rpm = max(self._run_peak_rpm, self.rpm_actual)
            self._run_peak_rcf = max(self._run_peak_rcf, self.rcf_actual)
            if self.rpm_actual >= self.rpm_set - 0.5:
                self.rpm_actual = float(self.rpm_set)
                self.state = State.RUN

        elif self.state == State.RUN:
            self.rpm_actual = float(self.rpm_set)
            self._run_peak_rpm = max(self._run_peak_rpm, self.rpm_actual)
            self._run_peak_rcf = max(self._run_peak_rcf, self.rcf_actual)
            self._run_spin_time_s += dt
            if not self.short_held and self.time_set_s > 0:
                self.time_elapsed_s += dt
                if self.time_elapsed_s >= self.time_set_s:
                    self.state = State.DECEL

        elif self.state == State.DECEL:
            rate = max(self.rpm_set, 1) / DECEL_TIME_S
            self.rpm_actual = max(0.0, self.rpm_actual - rate * dt)
            if self.rpm_actual <= 0.5:
                self.rpm_actual = 0.0
                self._run_active = False
                self._finalize_separation()
                if self.error == "E-02 IMBALANCE":
                    self.state = State.ERR_IMBALANCE
                elif self.error == "E-03 TACHO":
                    self.state = State.ERR_TACHO
                else:
                    self.state = State.END
                    if self.auto_open_on_end:
                        self.lid_locked = False
                        self.open_lid_physical()
                    else:
                        self.state = State.READY
