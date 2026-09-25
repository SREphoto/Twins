"""
Unit tests for MuffleFurnaceController
Verifies PID thermal dynamics, multi-segment ramp & soak profiles,
door safety interlocks, over-temperature limits, and cooling cycles.
"""

import unittest
from furnace_controller import MuffleFurnaceController, FurnaceState


class TestMuffleFurnaceController(unittest.TestCase):
    def setUp(self):
        self.ctrl = MuffleFurnaceController(max_temp_c=1200.0, max_ramp_rate=30.0)

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, FurnaceState.IDLE)
        self.assertTrue(self.ctrl.door_closed)
        self.assertTrue(self.ctrl.power_switch)
        self.assertFalse(self.ctrl.heater_on)
        self.assertEqual(self.ctrl.heating_power_percent, 0.0)

    def test_parameter_bounds(self):
        # Setpoint within limits
        self.assertTrue(self.ctrl.set_setpoint(950.0))
        self.assertEqual(self.ctrl.setpoint_sv, 950.0)

        # Setpoint out of limits (> 1200°C)
        self.assertFalse(self.ctrl.set_setpoint(1350.0))
        self.assertEqual(self.ctrl.setpoint_sv, 950.0)

        # Ramp rate within limits
        self.assertTrue(self.ctrl.set_ramp_rate(15.0))
        self.assertEqual(self.ctrl.ramp_rate_c_min, 15.0)

        # Ramp rate out of limits (> 30°C/min)
        self.assertFalse(self.ctrl.set_ramp_rate(45.0))
        self.assertEqual(self.ctrl.ramp_rate_c_min, 15.0)

        # Soak time
        self.assertTrue(self.ctrl.set_soak_time(45.0))
        self.assertEqual(self.ctrl.soak_time_min, 45.0)

    def test_start_program_and_power_output(self):
        self.ctrl.set_setpoint(500.0)
        res = self.ctrl.start_program()
        self.assertTrue(res)
        self.assertEqual(self.ctrl.state, FurnaceState.HEATING)
        self.assertTrue(self.ctrl.heater_on)

        # First tick should generate positive PID heating power
        self.ctrl.tick(dt_sec=1.0)
        self.assertGreater(self.ctrl.heating_power_percent, 0.0)

    def test_door_open_safety_interlock(self):
        self.ctrl.set_setpoint(800.0)
        self.ctrl.start_program()
        self.ctrl.tick(dt_sec=1.0)
        self.assertGreater(self.ctrl.heating_power_percent, 0.0)

        # Trip door interlock
        self.ctrl.set_door_state(False)
        self.assertEqual(self.ctrl.state, FurnaceState.FAULT_DOOR_OPEN)
        self.assertFalse(self.ctrl.heater_on)
        self.assertEqual(self.ctrl.heating_power_percent, 0.0)
        self.assertEqual(self.ctrl.last_fault_msg, "DOOR_SAFETY_INTERLOCK_TRIP")

        # Tick while door is open should stay in fault
        self.ctrl.tick(dt_sec=1.0)
        self.assertEqual(self.ctrl.state, FurnaceState.FAULT_DOOR_OPEN)
        self.assertEqual(self.ctrl.heating_power_percent, 0.0)

        # Close door and reset fault
        self.ctrl.set_door_state(True)
        self.assertTrue(self.ctrl.reset_fault())
        self.assertEqual(self.ctrl.state, FurnaceState.IDLE)

    def test_door_open_prevents_start(self):
        self.ctrl.set_door_state(False)
        res = self.ctrl.start_program()
        self.assertFalse(res)
        self.assertEqual(self.ctrl.state, FurnaceState.FAULT_DOOR_OPEN)

    def test_overtemp_safety_interlock(self):
        # Inject artificial temperature spike exceeding 1200 + 20 °C
        self.ctrl.current_pv = 1235.0
        self.ctrl.start_program()
        self.ctrl.tick(dt_sec=1.0)

        self.assertEqual(self.ctrl.state, FurnaceState.FAULT_OVERTEMP)
        self.assertFalse(self.ctrl.heater_on)
        self.assertEqual(self.ctrl.heating_power_percent, 0.0)

    def test_ramp_to_soak_to_cooling_cycle(self):
        # Quick simulation with 1-second soak
        self.ctrl.set_setpoint(30.0)
        self.ctrl.set_ramp_rate(30.0)
        self.ctrl.set_soak_time(0.05) # 3 seconds
        self.ctrl.start_program()

        # Step until setpoint reached
        for _ in range(60):
            if self.ctrl.state == FurnaceState.SOAKING:
                break
            self.ctrl.tick(dt_sec=1.0)

        self.assertEqual(self.ctrl.state, FurnaceState.SOAKING)

        # Soak for 4 seconds to trigger cooldown
        for _ in range(5):
            self.ctrl.tick(dt_sec=1.0)

        self.assertEqual(self.ctrl.state, FurnaceState.COOLING)
        self.assertFalse(self.ctrl.heater_on)

    def test_damper_cooling_acceleration(self):
        self.ctrl.current_pv = 500.0
        self.ctrl.state = FurnaceState.COOLING

        # Cool with damper closed
        self.ctrl.set_damper(False)
        self.ctrl.tick(dt_sec=10.0)
        pv_closed = self.ctrl.current_pv

        # Cool with damper open
        self.ctrl.current_pv = 500.0
        self.ctrl.set_damper(True)
        self.ctrl.tick(dt_sec=10.0)
        pv_open = self.ctrl.current_pv

        # Damper open should have cooled more
        self.assertLess(pv_open, pv_closed)

    def test_stop_command(self):
        self.ctrl.start_program()
        self.ctrl.stop()
        self.assertEqual(self.ctrl.state, FurnaceState.IDLE)
        self.assertFalse(self.ctrl.heater_on)

    def test_power_switch_off(self):
        self.ctrl.start_program()
        self.ctrl.set_power_switch(False)
        self.assertEqual(self.ctrl.state, FurnaceState.OFF)
        self.assertFalse(self.ctrl.heater_on)

    def test_controlled_cooling_ramp(self):
        # Start at 400°C and ramp down to 300°C
        self.ctrl.current_pv = 400.0
        self.ctrl.set_setpoint(300.0)
        self.ctrl.set_ramp_rate(20.0)
        self.ctrl.start_program()

        self.assertEqual(self.ctrl.state, FurnaceState.HEATING)
        # On tick 1, should NOT jump straight to SOAKING
        self.ctrl.tick(dt_sec=1.0)
        self.assertEqual(self.ctrl.state, FurnaceState.HEATING)
        self.assertLessEqual(self.ctrl.ramp_sv, 400.0)
        # Power should be 0 because it needs to cool down
        self.assertEqual(self.ctrl.heating_power_percent, 0.0)

    def test_thermocouple_break_during_heating(self):
        self.ctrl.start_program()
        self.assertEqual(self.ctrl.state, FurnaceState.HEATING)
        self.assertTrue(self.ctrl.heater_on)

        # Thermocouple breaks mid-run
        self.ctrl.thermocouple_ok = False
        self.ctrl.tick(dt_sec=1.0)
        self.assertEqual(self.ctrl.state, FurnaceState.FAULT_THERMOCOUPLE)
        self.assertFalse(self.ctrl.heater_on)
        self.assertEqual(self.ctrl.heating_power_percent, 0.0)

        # Attempt to reset fault while thermocouple is still broken
        self.assertFalse(self.ctrl.reset_fault())
        self.assertEqual(self.ctrl.state, FurnaceState.FAULT_THERMOCOUPLE)

        # Replacing thermocouple allows reset
        self.ctrl.thermocouple_ok = True
        self.assertTrue(self.ctrl.reset_fault())
        self.assertEqual(self.ctrl.state, FurnaceState.IDLE)


if __name__ == '__main__':
    unittest.main()


