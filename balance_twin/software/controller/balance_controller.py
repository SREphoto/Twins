"""
Analytical Balance Controller State Engine
Pure Python state machine for 0.1 mg precision laboratory analytical balance.
"""

from enum import Enum, auto

class BalanceState(Enum):
    IDLE = auto()
    WEIGHING = auto()
    CALIBRATING = auto()
    FAULT_OVERLOAD = auto()
    FAULT_DRAFT_OPEN = auto()

class BalanceController:
    def __init__(self, max_capacity_g: float = 220.0, readability_g: float = 0.0001):
        self.max_capacity_g = max_capacity_g
        self.readability_g = readability_g

        self.state = BalanceState.IDLE
        self.draft_doors_closed = True
        self.tare_offset_g = 0.0
        self.gross_weight_g = 0.0
        self.displayed_weight_g = 0.0
        self.stable = True

    def set_draft_doors(self, closed: bool):
        self.draft_doors_closed = closed
        self.stable = closed

    def place_sample(self, mass_g: float):
        if mass_g > self.max_capacity_g:
            self.state = BalanceState.FAULT_OVERLOAD
            return False
        self.gross_weight_g = mass_g
        self.state = BalanceState.WEIGHING
        return True

    def tare(self):
        self.tare_offset_g = self.gross_weight_g
        self.displayed_weight_g = 0.0

    def calibrate(self):
        if not self.draft_doors_closed:
            self.state = BalanceState.FAULT_DRAFT_OPEN
            return False
        self.state = BalanceState.CALIBRATING
        return True

    def tick(self, dt_sec: float = 1.0):
        if self.gross_weight_g > self.max_capacity_g:
            self.state = BalanceState.FAULT_OVERLOAD
            return
            
        net_g = self.gross_weight_g - self.tare_offset_g
        # Readability rounding
        self.displayed_weight_g = round(net_g / self.readability_g) * self.readability_g
        if self.state == BalanceState.CALIBRATING:
            self.state = BalanceState.IDLE
