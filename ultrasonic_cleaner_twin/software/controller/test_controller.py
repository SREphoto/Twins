"""
Unit tests for UltrasonicController
"""

import unittest
from ultrasonic_controller import UltrasonicController, CleanerState

class TestUltrasonicController(unittest.TestCase):
    def setUp(self):
        self.ctrl = UltrasonicController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, CleanerState.IDLE)
        self.assertTrue(self.ctrl.liquid_level_ok)

    def test_start_cleaning_normal(self):
        res = self.ctrl.start_cleaning(degas=False)
        self.assertTrue(res)
        self.assertEqual(self.ctrl.state, CleanerState.CLEANING)

    def test_dry_run_interlock(self):
        self.ctrl.set_liquid_level(False)
        res = self.ctrl.start_cleaning()
        self.assertFalse(res)
        self.assertEqual(self.ctrl.state, CleanerState.FAULT_DRY_RUN)

    def test_timer_countdown(self):
        self.ctrl.set_timer(10)
        self.ctrl.start_cleaning()
        self.ctrl.tick(5)
        self.assertEqual(self.ctrl.remaining_sec, 5)
        self.ctrl.tick(6)
        self.assertEqual(self.ctrl.remaining_sec, 0)
        self.assertEqual(self.ctrl.state, CleanerState.IDLE)

if __name__ == '__main__':
    unittest.main()
