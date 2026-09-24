"""
Vortex Mixer Controller State Engine
Pure Python state machine for laboratory benchtop vortex mixer.
"""

from enum import Enum, auto

class VortexMixerState(Enum):
    IDLE = auto()
    RUNNING_TOUCH = auto()
    RUNNING_CONTINUOUS = auto()

class VortexMixerController:
    def __init__(self, max_rpm: int = 3000):
        self.max_rpm = max_rpm

        self.state = VortexMixerState.IDLE
        self.mode = "TOUCH"  # "TOUCH" or "CONTINUOUS"
        self.target_rpm = 2500
        self.current_rpm = 0
        self.touch_pressed = False

    def set_mode(self, mode: str):
        if mode.upper() in ("TOUCH", "CONTINUOUS"):
            self.mode = mode.upper()
            self._update_state()

    def set_speed_rpm(self, rpm: int):
        if 500 <= rpm <= self.max_rpm:
            self.target_rpm = rpm

    def set_touch_pressed(self, pressed: bool):
        self.touch_pressed = pressed
        self._update_state()

    def _update_state(self):
        if self.mode == "CONTINUOUS":
            self.state = VortexMixerState.RUNNING_CONTINUOUS
        elif self.mode == "TOUCH" and self.touch_pressed:
            self.state = VortexMixerState.RUNNING_TOUCH
        else:
            self.state = VortexMixerState.IDLE

    def tick(self, dt_sec: float = 1.0):
        if self.state in (VortexMixerState.RUNNING_TOUCH, VortexMixerState.RUNNING_CONTINUOUS):
            self.current_rpm = self.target_rpm
        else:
            self.current_rpm = 0
