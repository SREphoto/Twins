"""
Glove Box Controller State Engine
Pure Python state machine for inert atmosphere laboratory glove box.
"""

from enum import Enum, auto

class GloveBoxState(Enum):
    PURGED = auto()
    PURGING = auto()
    ANTECHAMBER_EVAC = auto()
    FAULT_O2_ALARM = auto()
    FAULT_H2O_ALARM = auto()

class GloveBoxController:
    def __init__(self, max_o2_ppm: float = 1.0, max_h2o_ppm: float = 1.0):
        self.max_o2_ppm = max_o2_ppm
        self.max_h2o_ppm = max_h2o_ppm
        
        self.state = GloveBoxState.PURGED
        self.o2_ppm = 0.2
        self.h2o_ppm = 0.1
        self.pressure_mbar = 3.5  # Slight positive pressure
        
        self.antechamber_inner_door_open = False
        self.antechamber_outer_door_open = False
        self.antechamber_vacuum_mbar = 1013.0
        
        self.purging_active = False

    def start_purge(self):
        if self.antechamber_inner_door_open and self.antechamber_outer_door_open:
            return False
        self.purging_active = True
        self.state = GloveBoxState.PURGING
        return True

    def evacuate_antechamber(self):
        if self.antechamber_inner_door_open or self.antechamber_outer_door_open:
            return False
        self.state = GloveBoxState.ANTECHAMBER_EVAC
        return True

    def tick(self, dt_sec: float = 1.0):
        if self.purging_active:
            self.o2_ppm = max(0.1, self.o2_ppm - 0.5 * dt_sec)
            self.h2o_ppm = max(0.1, self.h2o_ppm - 0.5 * dt_sec)
            if self.o2_ppm <= 0.5 and self.h2o_ppm <= 0.5:
                self.purging_active = False
                self.state = GloveBoxState.PURGED

        if self.state == GloveBoxState.ANTECHAMBER_EVAC:
            self.antechamber_vacuum_mbar = max(0.1, self.antechamber_vacuum_mbar - 200.0 * dt_sec)
            if self.antechamber_vacuum_mbar <= 1.0:
                self.state = GloveBoxState.PURGED

        if self.o2_ppm > self.max_o2_ppm + 5.0:
            self.state = GloveBoxState.FAULT_O2_ALARM
