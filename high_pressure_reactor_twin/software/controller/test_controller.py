"""
Unit tests for ReactorController
"""

import unittest
from reactor_controller import ReactorController, ReactorState

class TestReactorController(unittest.TestCase):
    def setUp(self):
        self.ctrl = ReactorController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, ReactorState.IDLE)
        self.assertEqual(self.ctrl.current_pressure_bar, 1.0)

    def test_heating_and_stirring(self):
        self.ctrl.toggle_heater(True)
        self.ctrl.toggle_stirrer(True)
        self.assertEqual(self.ctrl.state, ReactorState.RUNNING)

    def test_thermal_pressure_rise(self):
        self.ctrl.toggle_heater(True)
        self.ctrl.tick(10)
        self.assertGreater(self.ctrl.current_temp_c, 22.0)
        self.assertGreater(self.ctrl.current_pressure_bar, 1.0)

    def test_burst_disc_overpressure_fault(self):
        self.ctrl.current_pressure_bar = 260.0
        self.ctrl.tick(1)
        self.assertEqual(self.ctrl.state, ReactorState.FAULT_OVERPRESSURE)
        self.assertFalse(self.ctrl.heater_on)

if __name__ == '__main__':
    unittest.main()
