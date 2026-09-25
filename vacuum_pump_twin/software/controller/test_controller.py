import unittest
from pump_controller import VacuumPumpController, VacuumPumpState

class TestVacuumPumpController(unittest.TestCase):
    def setUp(self):
        self.ctrl = VacuumPumpController(ultimate_vacuum_mbar=80.0, max_flow_lmin=15.0)

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, VacuumPumpState.OFF)
        self.assertFalse(self.ctrl.power_on)
        self.assertEqual(self.ctrl.system_vacuum_mbar, 1013.0)
        self.assertEqual(self.ctrl.motor_speed_rpm, 0.0)
        self.assertEqual(self.ctrl.motor_temp_c, 22.0)

    def test_power_transitions(self):
        self.ctrl.set_power(True)
        self.assertEqual(self.ctrl.state, VacuumPumpState.IDLE)
        self.assertTrue(self.ctrl.power_on)
        
        self.ctrl.set_power(False)
        self.assertEqual(self.ctrl.state, VacuumPumpState.STOPPING)
        self.assertFalse(self.ctrl.power_on)

    def test_motor_acceleration(self):
        self.ctrl.set_power(True)
        # IDLE -> STARTING on tick if power_on is True
        self.ctrl.tick(0.1)
        self.assertEqual(self.ctrl.state, VacuumPumpState.STARTING)
        
        # Accelerate towards target_rpm (1500)
        # Ramps at 1000 RPM/s. In 1 second, speed should reach 1000
        self.ctrl.tick(1.0)
        self.assertEqual(self.ctrl.motor_speed_rpm, 1000.0)
        self.assertEqual(self.ctrl.state, VacuumPumpState.STARTING)
        
        # Another 1 second should hit and lock at target_rpm (1500)
        self.ctrl.tick(1.0)
        self.assertEqual(self.ctrl.motor_speed_rpm, 1500.0)
        self.assertEqual(self.ctrl.state, VacuumPumpState.RUNNING)

    def test_motor_deceleration(self):
        # Start and run
        self.ctrl.set_power(True)
        for _ in range(30):
            self.ctrl.tick(0.1)
        self.assertEqual(self.ctrl.state, VacuumPumpState.RUNNING)
        self.assertEqual(self.ctrl.motor_speed_rpm, 1500.0)
        
        # Power OFF
        self.ctrl.set_power(False)
        self.assertEqual(self.ctrl.state, VacuumPumpState.STOPPING)
        
        # Ramps down at 1500 RPM/s
        self.ctrl.tick(0.5)
        self.assertEqual(self.ctrl.motor_speed_rpm, 750.0)
        
        self.ctrl.tick(0.6)
        self.assertEqual(self.ctrl.motor_speed_rpm, 0.0)
        self.assertEqual(self.ctrl.state, VacuumPumpState.OFF)

    def test_evacuation_curve(self):
        self.ctrl.set_power(True)
        # Run until normal RUNNING state is reached
        for _ in range(30):
            self.ctrl.tick(0.1)
        
        self.assertEqual(self.ctrl.state, VacuumPumpState.RUNNING)
        self.assertLess(self.ctrl.system_vacuum_mbar, 1013.0)
        
        # Keep running to reach near ultimate vacuum
        for _ in range(100):
            self.ctrl.tick(0.5)
            
        # Should converge close to 80.0 mbar
        self.assertLess(self.ctrl.system_vacuum_mbar, 81.0)
        self.assertGreaterEqual(self.ctrl.system_vacuum_mbar, 80.0)

    def test_gas_ballast_influence(self):
        self.ctrl.set_gas_ballast(True)
        self.assertTrue(self.ctrl.gas_ballast_open)
        
        # Start and run
        self.ctrl.set_power(True)
        for _ in range(30):
            self.ctrl.tick(0.1)
            
        self.assertEqual(self.ctrl.state, VacuumPumpState.RUNNING_BALLAST)
        
        # Evacuate with ballast open
        for _ in range(100):
            self.ctrl.tick(0.5)
            
        # Ultimate vacuum with ballast open should be higher (~120.0 mbar)
        self.assertLess(self.ctrl.system_vacuum_mbar, 121.0)
        self.assertGreaterEqual(self.ctrl.system_vacuum_mbar, 120.0)

    def test_speed_control_potentiometer(self):
        self.ctrl.set_target_rpm(2500)
        self.assertEqual(self.ctrl.target_rpm, 2500.0)
        
        # Clamping checks
        self.ctrl.set_target_rpm(1000)
        self.assertEqual(self.ctrl.target_rpm, 1500.0) # clamped to min
        
        self.ctrl.set_target_rpm(4000)
        self.assertEqual(self.ctrl.target_rpm, 3000.0) # clamped to max

    def test_passive_leak_back(self):
        self.ctrl.system_vacuum_mbar = 100.0
        
        # Tick while OFF
        self.ctrl.tick(1.0)
        self.assertGreater(self.ctrl.system_vacuum_mbar, 100.0)
        
        # Convergence to atmospheric (1013)
        for _ in range(200):
            self.ctrl.tick(1.0)
        self.assertAlmostEqual(self.ctrl.system_vacuum_mbar, 1013.0, delta=0.1)

    def test_thermal_cutout_and_cooldown(self):
        self.ctrl.set_power(True)
        # Force heating past 130
        self.ctrl.motor_temp_c = 130.1
        self.ctrl.tick(0.1)
        self.assertEqual(self.ctrl.state, VacuumPumpState.FAULT_OVERHEAT)
        self.assertEqual(self.ctrl.motor_speed_rpm, 0.0)
        
        # Verify cooling while faulted
        temp_prev = self.ctrl.motor_temp_c
        self.ctrl.tick(10.0)
        self.assertLess(self.ctrl.motor_temp_c, temp_prev)
        
        # Force cool down below 80
        self.ctrl.motor_temp_c = 79.9
        self.ctrl.tick(0.1)
        # Cutout auto-resets when cooled
        self.assertNotEqual(self.ctrl.state, VacuumPumpState.FAULT_OVERHEAT)
        # Power switch is still ON, so it should be restarting
        self.assertEqual(self.ctrl.state, VacuumPumpState.STARTING)

    def test_manual_thermal_fault_trigger(self):
        self.ctrl.set_power(True)
        for _ in range(30):
            self.ctrl.tick(0.1)
        self.assertEqual(self.ctrl.state, VacuumPumpState.RUNNING)
        
        self.ctrl.trigger_thermal_fault()
        self.assertEqual(self.ctrl.state, VacuumPumpState.FAULT_OVERHEAT)
        self.assertGreaterEqual(self.ctrl.motor_temp_c, 130.0)

    def test_flow_rate_calculation(self):
        # Flow rate should be 0 when motor is stopped
        self.assertEqual(self.ctrl.get_flow_rate(), 0.0)
        
        # Manually set running state at atmospheric pressure (1013)
        self.ctrl.motor_speed_rpm = 1500.0
        self.ctrl.system_vacuum_mbar = 1013.0
        # Flow should be max (15.0)
        self.assertEqual(self.ctrl.get_flow_rate(), 15.0)
        
        # Set halfway pressure
        self.ctrl.system_vacuum_mbar = 80.0 + (1013.0 - 80.0) / 2
        # Flow should be approx 7.5
        self.assertAlmostEqual(self.ctrl.get_flow_rate(), 7.5, delta=0.1)

    def test_snap_output_format(self):
        snap = self.ctrl.snap()
        self.assertIn("state", snap)
        self.assertIn("pressure_mbar", snap)
        self.assertIn("flow_lmin", snap)
        self.assertIn("motor_rpm", snap)
        self.assertIn("motor_temp_c", snap)
        self.assertIn("target_rpm", snap)
        self.assertEqual(snap["state"], "OFF")

    def test_power_on_while_overheated(self):
        # Motor is hot from previous run
        self.ctrl.motor_temp_c = 135.0
        self.ctrl.set_power(True)
        self.assertEqual(self.ctrl.state, VacuumPumpState.FAULT_OVERHEAT)
        self.assertEqual(self.ctrl.motor_speed_rpm, 0.0)


if __name__ == '__main__':
    unittest.main()

