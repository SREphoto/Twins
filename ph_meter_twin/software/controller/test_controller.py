"""
Unit tests for PHMeterController
Verifies Nernstian electrochemistry, temperature compensation, calibration algorithms,
stability convergence, and fault interlocks.
"""

import unittest
from ph_controller import PHMeterController, PHMeterState, MeasureMode, StandardBuffer


class TestPHMeterController(unittest.TestCase):
    def setUp(self):
        self.ctrl = PHMeterController(probe_slope_pct=99.2, probe_offset_mv=1.5)

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, PHMeterState.STANDBY)
        self.assertTrue(self.ctrl.probe_connected)
        self.assertTrue(self.ctrl.atc_connected)
        self.assertEqual(self.ctrl.mode, MeasureMode.PH)

    def test_power_cycle(self):
        self.ctrl.set_power(False)
        self.assertEqual(self.ctrl.state, PHMeterState.OFF)
        self.assertFalse(self.ctrl.start_measurement())

        self.ctrl.set_power(True)
        self.assertEqual(self.ctrl.state, PHMeterState.STANDBY)

    def test_nernst_slope_temperatures(self):
        # 0 °C (273.15 K)
        slope_0c = self.ctrl.nernst_slope_mv(0.0)
        self.assertAlmostEqual(slope_0c, 54.20, places=1)

        # 25 °C (298.15 K) - standard laboratory reference
        slope_25c = self.ctrl.nernst_slope_mv(25.0)
        self.assertAlmostEqual(slope_25c, 59.16, places=1)

        # 50 °C (323.15 K)
        slope_50c = self.ctrl.nernst_slope_mv(50.0)
        self.assertAlmostEqual(slope_50c, 64.12, places=1)

        # 100 °C (373.15 K)
        slope_100c = self.ctrl.nernst_slope_mv(100.0)
        self.assertAlmostEqual(slope_100c, 74.04, places=1)

    def test_start_and_hold_measurement(self):
        res = self.ctrl.start_measurement()
        self.assertTrue(res)
        self.assertEqual(self.ctrl.state, PHMeterState.MEASURING)

        self.ctrl.hold_measurement()
        self.assertEqual(self.ctrl.state, PHMeterState.HOLD)

        self.ctrl.resume_measurement()
        self.assertEqual(self.ctrl.state, PHMeterState.MEASURING)

    def test_probe_disconnect_fault(self):
        self.ctrl.start_measurement()
        self.ctrl.set_probe_connected(False)
        self.assertEqual(self.ctrl.state, PHMeterState.FAULT_PROBE_DISCONNECTED)

    def test_temperature_limits(self):
        self.assertTrue(self.ctrl.set_temperature(40.0))
        self.assertEqual(self.ctrl.current_temp_c, 40.0)

        # Out of bounds (< -5°C or > 105°C)
        self.assertFalse(self.ctrl.set_temperature(120.0))
        self.assertEqual(self.ctrl.state, PHMeterState.FAULT_TEMP_OUT_OF_RANGE)

    def test_buffer_calibration_routine(self):
        # Prepare: uncap and immerse in pH 7.00 buffer
        self.ctrl.set_storage_cap(False)
        self.ctrl.set_probe_immersed(True)
        self.ctrl.solution_ph_real = 7.00
        self.ctrl.start_measurement()

        # Step 1: Zero buffer calibration (pH 7.00)
        cal7 = self.ctrl.calibrate_buffer(StandardBuffer.PH_7_00)
        self.assertTrue(cal7)
        self.assertIn(7.00, self.ctrl.calibrated_buffers)
        self.assertAlmostEqual(self.ctrl.calib_offset_mv, 1.5, places=1)

        # Step 2: Slope buffer calibration (pH 4.01)
        self.ctrl.solution_ph_real = 4.01
        cal4 = self.ctrl.calibrate_buffer(StandardBuffer.PH_4_01)
        self.assertTrue(cal4)
        self.assertIn(4.01, self.ctrl.calibrated_buffers)
        # Slope should match simulated actual slope ~99.2%
        self.assertAlmostEqual(self.ctrl.calib_slope_percent, 99.2, places=1)

        # Step 3: Alkaline buffer calibration (pH 10.01)
        self.ctrl.solution_ph_real = 10.01
        cal10 = self.ctrl.calibrate_buffer(StandardBuffer.PH_10_01)
        self.assertTrue(cal10)
        self.assertEqual(len(self.ctrl.calibrated_buffers), 3)

    def test_buffer_mismatch_error(self):
        # Probe is in pH 4 solution, but user selects pH 7 buffer calibration
        self.ctrl.set_storage_cap(False)
        self.ctrl.set_probe_immersed(True)
        self.ctrl.solution_ph_real = 4.00
        self.ctrl.start_measurement()

        res = self.ctrl.calibrate_buffer(StandardBuffer.PH_7_00)
        self.assertFalse(res)
        self.assertEqual(self.ctrl.state, PHMeterState.FAULT_CALIBRATION_ERROR)
        self.assertEqual(self.ctrl.last_cal_error, "ERR_BUFF_MISMATCH")

    def test_slope_out_of_range_error(self):
        # A defective/aged electrode with only 80% efficiency
        bad_ctrl = PHMeterController(probe_slope_pct=78.0, probe_offset_mv=0.0)
        bad_ctrl.set_storage_cap(False)
        bad_ctrl.set_probe_immersed(True)
        bad_ctrl.start_measurement()

        # Zero cal at 7.00
        bad_ctrl.solution_ph_real = 7.00
        self.assertTrue(bad_ctrl.calibrate_buffer(7.00))

        # Slope cal at 4.01
        bad_ctrl.solution_ph_real = 4.01
        res = bad_ctrl.calibrate_buffer(4.01)
        self.assertFalse(res)
        self.assertEqual(bad_ctrl.state, PHMeterState.FAULT_CALIBRATION_ERROR)
        self.assertEqual(bad_ctrl.last_cal_error, "ERR_SLOPE")

    def test_stability_convergence(self):
        self.ctrl.set_storage_cap(False)
        self.ctrl.set_probe_immersed(True)
        self.ctrl.solution_ph_real = 6.50
        self.ctrl.start_measurement()

        # Simulate successive time steps
        for _ in range(10):
            self.ctrl.tick(dt_sec=1.0)

        # Should reach STABLE state
        self.assertEqual(self.ctrl.state, PHMeterState.STABLE)
        self.assertAlmostEqual(self.ctrl.measured_ph, 6.50, places=1)

    def test_telemetry_packet(self):
        self.ctrl.start_measurement()
        t = self.ctrl.get_telemetry()
        self.assertIn("measured_ph", t)
        self.assertIn("measured_mv", t)
        self.assertIn("temperature_c", t)
        self.assertIn("atc_active", t)
        self.assertIn("calib_slope_pct", t)


if __name__ == '__main__':
    unittest.main()
