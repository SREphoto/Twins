"""
Diaphragm Vacuum Pump Controller State Engine
Pure Python state machine simulating KNF Laboport N820 vacuum pump physics.
"""

from enum import Enum
import math

class VacuumPumpState(str, Enum):
    OFF = "OFF"
    IDLE = "IDLE"
    STARTING = "STARTING"
    RUNNING = "RUNNING"
    RUNNING_BALLAST = "RUNNING_BALLAST"
    STOPPING = "STOPPING"
    FAULT_OVERHEAT = "FAULT_OVERHEAT"

class VacuumPumpController:
    def __init__(self, ultimate_vacuum_mbar: float = 80.0, max_flow_lmin: float = 15.0):
        self.ultimate_vacuum_mbar = ultimate_vacuum_mbar
        self.max_flow_lmin = max_flow_lmin
        
        # State variables
        self.state = VacuumPumpState.OFF
        self.power_on = False
        self.gas_ballast_open = False
        
        # Physical variables
        self.system_vacuum_mbar = 1013.0
        self.motor_speed_rpm = 0.0
        self.target_rpm = 1500.0  # Range: 1500 to 3000
        self.motor_temp_c = 22.0  # Ambient
        self.ambient_temp_c = 22.0
        
        # Constant limits
        self.overheat_temp_c = 130.0
        self.reset_temp_c = 80.0
        
    def set_power(self, enabled: bool):
        self.power_on = enabled
        if not enabled:
            if self.state != VacuumPumpState.OFF:
                self.state = VacuumPumpState.STOPPING
        else:
            if self.state == VacuumPumpState.OFF:
                self.state = VacuumPumpState.IDLE
                
    def set_target_rpm(self, rpm: float):
        # Speed dial clamping
        self.target_rpm = max(1500.0, min(3000.0, rpm))
        
    def set_gas_ballast(self, open_ballast: bool):
        self.gas_ballast_open = open_ballast
        if self.state == VacuumPumpState.RUNNING and open_ballast:
            self.state = VacuumPumpState.RUNNING_BALLAST
        elif self.state == VacuumPumpState.RUNNING_BALLAST and not open_ballast:
            self.state = VacuumPumpState.RUNNING

    def trigger_thermal_fault(self):
        """Force a thermal fault for training simulations."""
        self.motor_temp_c = self.overheat_temp_c + 1.0
        self.state = VacuumPumpState.FAULT_OVERHEAT

    def tick(self, dt_sec: float = 0.1):
        # 1. Temperature Simulation
        if self.state in (VacuumPumpState.STARTING, VacuumPumpState.RUNNING, VacuumPumpState.RUNNING_BALLAST):
            # Heating rate scales with RPM squared (I^2*R losses)
            rpm_ratio = self.motor_speed_rpm / 3000.0
            heating_rate = 1.2 * (rpm_ratio ** 2) + 0.2
            self.motor_temp_c += heating_rate * dt_sec
        else:
            # Cooling towards ambient
            cooling_rate = 0.5
            self.motor_temp_c = max(self.ambient_temp_c, self.motor_temp_c - cooling_rate * dt_sec)
            
        # 2. Thermal Cutout Interlock
        if self.motor_temp_c >= self.overheat_temp_c and self.state != VacuumPumpState.FAULT_OVERHEAT:
            self.state = VacuumPumpState.FAULT_OVERHEAT
            
        if self.state == VacuumPumpState.FAULT_OVERHEAT:
            if self.motor_temp_c <= self.reset_temp_c:
                self.state = VacuumPumpState.IDLE if self.power_on else VacuumPumpState.OFF

        # 3. State Transitions & Motor Speed Ramp
        if self.state == VacuumPumpState.OFF:
            # Decelerate if power cut
            self.motor_speed_rpm = max(0.0, self.motor_speed_rpm - 1500.0 * dt_sec)
            
        elif self.state == VacuumPumpState.IDLE:
            self.motor_speed_rpm = max(0.0, self.motor_speed_rpm - 1500.0 * dt_sec)
            if self.power_on:
                self.state = VacuumPumpState.STARTING
                
        elif self.state == VacuumPumpState.STARTING:
            if not self.power_on:
                self.state = VacuumPumpState.STOPPING
            else:
                # Accelerate motor
                self.motor_speed_rpm = min(self.target_rpm, self.motor_speed_rpm + 1000.0 * dt_sec)
                if self.motor_speed_rpm >= self.target_rpm:
                    self.state = VacuumPumpState.RUNNING_BALLAST if self.gas_ballast_open else VacuumPumpState.RUNNING
                    
        elif self.state in (VacuumPumpState.RUNNING, VacuumPumpState.RUNNING_BALLAST):
            if not self.power_on:
                self.state = VacuumPumpState.STOPPING
            else:
                # Adjust speed to setpoint dial
                if self.motor_speed_rpm < self.target_rpm:
                    self.motor_speed_rpm = min(self.target_rpm, self.motor_speed_rpm + 1000.0 * dt_sec)
                elif self.motor_speed_rpm > self.target_rpm:
                    self.motor_speed_rpm = max(self.target_rpm, self.motor_speed_rpm - 1000.0 * dt_sec)
                    
        elif self.state == VacuumPumpState.STOPPING:
            self.motor_speed_rpm = max(0.0, self.motor_speed_rpm - 1500.0 * dt_sec)
            if self.motor_speed_rpm <= 0.0:
                self.state = VacuumPumpState.IDLE if self.power_on else VacuumPumpState.OFF
                
        elif self.state == VacuumPumpState.FAULT_OVERHEAT:
            self.motor_speed_rpm = max(0.0, self.motor_speed_rpm - 1500.0 * dt_sec)

        # 4. Vacuum Physics Simulation (Evacuation & Leakage)
        is_pumping = self.state in (VacuumPumpState.STARTING, VacuumPumpState.RUNNING, VacuumPumpState.RUNNING_BALLAST)
        
        if is_pumping and self.motor_speed_rpm > 100.0:
            # Ultimate vacuum is higher (worse) when gas ballast is open
            limit_p = (self.ultimate_vacuum_mbar + 40.0) if self.gas_ballast_open else self.ultimate_vacuum_mbar
            # Pump rate depends on motor speed (RPM)
            rpm_factor = self.motor_speed_rpm / 1500.0
            evac_rate = 0.15 * rpm_factor
            # Exponential pump down curve
            self.system_vacuum_mbar += (limit_p - self.system_vacuum_mbar) * (1.0 - math.exp(-evac_rate * dt_sec))
        else:
            # Passive leak-back to atmospheric pressure
            leak_rate = 0.08
            self.system_vacuum_mbar += (1013.0 - self.system_vacuum_mbar) * (1.0 - math.exp(-leak_rate * dt_sec))

        # Clamp boundaries
        self.system_vacuum_mbar = max(self.ultimate_vacuum_mbar, min(1013.0, self.system_vacuum_mbar))

    def get_flow_rate(self) -> float:
        """Calculate flow rate based on pressure difference and speed."""
        if self.motor_speed_rpm <= 100.0:
            return 0.0
        # Flow is maximum at atmospheric pressure and drops to zero at ultimate vacuum
        p_ratio = (self.system_vacuum_mbar - self.ultimate_vacuum_mbar) / (1013.0 - self.ultimate_vacuum_mbar)
        p_ratio = max(0.0, min(1.0, p_ratio))
        speed_factor = self.motor_speed_rpm / 1500.0
        return self.max_flow_lmin * speed_factor * p_ratio

    def snap(self) -> dict:
        """Return system snapshot for displays and telemetry."""
        return {
            "state": self.state.value,
            "power_on": self.power_on,
            "gas_ballast_open": self.gas_ballast_open,
            "pressure_mbar": round(self.system_vacuum_mbar, 1),
            "flow_lmin": round(self.get_flow_rate(), 2),
            "motor_rpm": round(self.motor_speed_rpm, 1),
            "motor_temp_c": round(self.motor_temp_c, 1),
            "target_rpm": self.target_rpm
        }
