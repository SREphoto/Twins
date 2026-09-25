"""
Unit Test Suite for Digital Precision Vortex Mixer Controller
Covers state transitions, inertia ramping, countdown timers, pulse mode,
and fluid rotational vortex calculations.
"""

import unittest
from vortex_controller import (
    VortexMixerController,
    VortexState,
    MixMode,
    STANDARD_LIQUIDS,
)


class TestVortexMixerController(unittest.TestCase):
    def setUp(self):
        self.ctrl = VortexMixerController()

    def test_initial_state(self):
        self.assertTrue(self.ctrl.power_on)
        self.assertEqual(self.ctrl.mode, MixMode.TOUCH)
        self.assertEqual(self.ctrl.state, VortexState.IDLE)
        self.assertEqual(self.ctrl.setpoint_rpm, 2400)
        self.assertEqual(self.ctrl.current_rpm, 0.0)
        self.assertFalse(self.ctrl.touch_pressed)

    def test_power_toggle(self):
        self.ctrl.set_power(False)
        self.assertEqual(self.ctrl.state, VortexState.POWER_OFF)
        self.assertEqual(self.ctrl.current_rpm, 0.0)

        self.ctrl.set_power(True)
        self.assertEqual(self.ctrl.state, VortexState.IDLE)

    def test_speed_limits(self):
        self.ctrl.set_speed_rpm(200)
        self.assertEqual(self.ctrl.setpoint_rpm, 500)  # clamped to min

        self.ctrl.set_speed_rpm(4000)
        self.assertEqual(self.ctrl.setpoint_rpm, 3200)  # clamped to max

        self.ctrl.set_speed_rpm(1850)
        self.assertEqual(self.ctrl.setpoint_rpm, 1850)

    def test_touch_mode_operation(self):
        self.ctrl.set_mode(MixMode.TOUCH)
        self.assertEqual(self.ctrl.state, VortexState.IDLE)

        # Press tube downward into cup
        self.ctrl.set_touch_pressed(True)
        self.assertEqual(self.ctrl.state, VortexState.RUNNING_TOUCH)

        # Step time forward and check motor ramp
        for _ in range(10):
            self.ctrl.tick(dt_sec=0.05)
        self.assertGreater(self.ctrl.current_rpm, 2000.0)

        # Release tube
        self.ctrl.set_touch_pressed(False)
        self.assertEqual(self.ctrl.state, VortexState.IDLE)

        for _ in range(20):
            self.ctrl.tick(dt_sec=0.05)
        self.assertLess(self.ctrl.current_rpm, 100.0)

    def test_continuous_mode_operation(self):
        self.ctrl.set_mode(MixMode.CONTINUOUS)
        self.assertEqual(self.ctrl.state, VortexState.RUNNING_CONTINUOUS)

        # Switch to OFF
        self.ctrl.set_mode(MixMode.OFF)
        self.assertEqual(self.ctrl.state, VortexState.IDLE)

    def test_countdown_timer(self):
        self.ctrl.set_mode(MixMode.CONTINUOUS)
        self.ctrl.set_timer(seconds=2)
        self.assertEqual(self.ctrl.countdown_remaining_sec, 2.0)

        # Run 1 second
        for _ in range(20):
            self.ctrl.tick(dt_sec=0.05)
        self.assertEqual(self.ctrl.state, VortexState.RUNNING_CONTINUOUS)
        self.assertAlmostEqual(self.ctrl.countdown_remaining_sec, 1.0, places=1)

        # Run past 2 seconds
        for _ in range(25):
            self.ctrl.tick(dt_sec=0.05)
        self.assertEqual(self.ctrl.state, VortexState.TIME_EXPIRED)

    def test_pulse_mode(self):
        self.ctrl.set_mode(MixMode.CONTINUOUS)
        self.ctrl.toggle_pulse_mode()
        self.assertTrue(self.ctrl.pulse_enabled)
        self.assertEqual(self.ctrl.state, VortexState.RUNNING_PULSE)

        # Active phase: 2 seconds
        for _ in range(30):
            self.ctrl.tick(dt_sec=0.05)
        self.assertEqual(self.ctrl.pulse_phase, "ACTIVE")

        # Move to rest phase: after 2.0s
        for _ in range(20):
            self.ctrl.tick(dt_sec=0.05)
        self.assertEqual(self.ctrl.pulse_phase, "REST")

    def test_fluid_vortex_depth_and_viscosity(self):
        self.ctrl.set_mode(MixMode.CONTINUOUS)
        self.ctrl.set_speed_rpm(3000)

        # Settle motor speed
        for _ in range(20):
            self.ctrl.tick(dt_sec=0.05)

        # Water depth
        self.ctrl.select_liquid("water")
        depth_water = self.ctrl.get_vortex_depth_mm()
        self.assertGreater(depth_water, 10.0)

        # 50% Glycerol (higher viscosity, should have shallower vortex)
        self.ctrl.select_liquid("glycerol_50")
        depth_glycerol = self.ctrl.get_vortex_depth_mm()
        self.assertLess(depth_glycerol, depth_water)

    def test_additional_liquids(self):
        self.ctrl.set_mode(MixMode.CONTINUOUS)
        self.ctrl.set_speed_rpm(3000)
        for _ in range(20):
            self.ctrl.tick(dt_sec=0.05)

        self.ctrl.select_liquid("ethanol")
        depth_ethanol = self.ctrl.get_vortex_depth_mm()
        self.assertGreater(depth_ethanol, 0.0)

        self.ctrl.select_liquid("blood")
        depth_blood = self.ctrl.get_vortex_depth_mm()
        self.assertLess(depth_blood, depth_ethanol)

    def test_touch_mode_with_timer(self):
        self.ctrl.set_mode(MixMode.TOUCH)
        self.ctrl.set_timer(seconds=1)
        self.ctrl.set_touch_pressed(True)
        self.assertEqual(self.ctrl.state, VortexState.RUNNING_TOUCH)

        for _ in range(25):
            self.ctrl.tick(dt_sec=0.05)
        self.assertEqual(self.ctrl.state, VortexState.TIME_EXPIRED)


if __name__ == "__main__":
    unittest.main()
