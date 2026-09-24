"""
Unit tests for MuffleFurnaceController
"""

import unittest
from furnace_controller import MuffleFurnaceController, FurnaceState

class TestMuffleFurnaceController(unittest.TestCase):
    def setUp(self):
        self.ctrl = MuffleFurnaceController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, FurnaceState.IDLE)
        self.assertTrue(self.ctrl.door_closed)

    def test_start_program(self):
        res = self.ctrl.start_program()
        self.assertTrue(res)
        self.assertEqual(self.ctrl.state, FurnaceState.HEATING)

    def test_door_interlock(self):
        self.ctrl.start_program()
        self.ctrl.set_door_state(False)
        self.assertEqual(self.ctrl.state, FurnaceState.FAULT_DOOR_OPEN)
        self.assertFalse(self.ctrl.heater_on)

    def test_heating_to_soak_transition(self):
        self.ctrl.set_setpoint(30.0)
        self.ctrl.set_soak_time(1.0)
        self.ctrl.start_program()
        self.ctrl.tick(60)
        self.assertGreaterEqual(self.ctrl.current_pv, 30.0)
        self.assertEqual(self.ctrl.state, FurnaceState.SOAKING)

if __name__ == '__main__':
    unittest.main()
