"""
Unit tests for PHMeterController
"""

import unittest
from ph_controller import PHMeterController, PHMeterState

class TestPHMeterController(unittest.TestCase):
    def setUp(self):
        self.ctrl = PHMeterController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, PHMeterState.IDLE)
        self.assertTrue(self.ctrl.probe_connected)

    def test_start_measurement(self):
        res = self.ctrl.start_measurement()
        self.assertTrue(res)
        self.assertEqual(self.ctrl.state, PHMeterState.MEASURING)

    def test_nernst_slope_at_25c(self):
        slope = self.ctrl.nernst_slope_mv(25.0)
        self.assertAlmostEqual(slope, 59.16, places=1)

    def test_buffer_calibration(self):
        self.ctrl.solution_ph_real = 7.00
        self.ctrl.start_measurement()
        res = self.ctrl.calibrate_buffer(7.00)
        self.assertTrue(res)
        self.assertIn(7.00, self.ctrl.calibrated_buffers)

if __name__ == '__main__':
    unittest.main()
