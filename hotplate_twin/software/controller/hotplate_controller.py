"""
Hotplate Stirrer Headless Controller & State Machine
Mirrors the web viewer state machine and thermal/stirring ODEs for headless simulation.
"""

from enum import Enum

class HotplateState(Enum):
    STANDBY = "STANDBY"
    HEATING = "HEATING"
    STIRRING = "STIRRING"
    RUN_BOTH = "RUN_BOTH"
    FAULT_OVERTEMP = "FAULT_OVERTEMP"

class HotplateController:
    def __init__(self):
        self.power_on = True
        self.state = HotplateState.STANDBY
        self.set_temp_c = 80.0
        self.plate_temp_c = 22.0
        self.fluid_temp_c = 22.0
        self.safe_temp_c = 320.0

        self.set_rpm = 450
        self.current_rpm = 0.0
        self.stir_bar_decoupled = False

        self.beaker_loaded = True
        self.probe_dipped = True

    def toggle_power(self):
        self.power_on = not self.power_on
        if not self.power_on:
            self.state = HotplateState.STANDBY
            self.current_rpm = 0.0

    def start_heating(self):
        if not self.power_on:
            return False
        if self.state == HotplateState.STIRRING:
            self.state = HotplateState.RUN_BOTH
        else:
            self.state = HotplateState.HEATING
        return True

    def stop_heating(self):
        if self.state == HotplateState.RUN_BOTH:
            self.state = HotplateState.STIRRING
        elif self.state == HotplateState.HEATING:
            self.state = HotplateState.STANDBY

    def start_stirring(self):
        if not self.power_on:
            return False
        if self.state == HotplateState.HEATING:
            self.state = HotplateState.RUN_BOTH
        else:
            self.state = HotplateState.STIRRING
        return True

    def stop_stirring(self):
        if self.state == HotplateState.RUN_BOTH:
            self.state = HotplateState.HEATING
        elif self.state == HotplateState.STIRRING:
            self.state = HotplateState.STANDBY

    def tick(self, dt=0.1):
        if not self.power_on:
            # Passive cooling
            self.plate_temp_c = max(22.0, self.plate_temp_c - 0.2 * dt)
            self.fluid_temp_c = max(22.0, self.fluid_temp_c - 0.1 * dt)
            self.current_rpm = max(0.0, self.current_rpm - 300.0 * dt)
            return

        # Stirring ramp
        if self.state in (HotplateState.STIRRING, HotplateState.RUN_BOTH) and not self.stir_bar_decoupled:
            if self.current_rpm < self.set_rpm:
                self.current_rpm = min(self.set_rpm, self.current_rpm + 200.0 * dt)
            else:
                self.current_rpm = max(self.set_rpm, self.current_rpm - 200.0 * dt)
        else:
            self.current_rpm = max(0.0, self.current_rpm - 300.0 * dt)

        # Heating simulation
        if self.state in (HotplateState.HEATING, HotplateState.RUN_BOTH):
            if self.plate_temp_c < self.set_temp_c:
                self.plate_temp_c += 1.5 * dt
            if self.beaker_loaded and self.fluid_temp_c < self.plate_temp_c:
                self.fluid_temp_c += 0.8 * dt

            # Over-temperature safety check
            if self.plate_temp_c >= self.safe_temp_c:
                self.state = HotplateState.FAULT_OVERTEMP
