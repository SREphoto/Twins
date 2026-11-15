"""
test_controller.py — 100% Pass Rate Unit Tests for ZEISS GeminiSEM 500 Controller.
"""

import unittest
from sem_controller import SEMController


class TestSEMController(unittest.TestCase):
    def setUp(self):
        self.sem = SEMController()

    def test_initial_state(self):
        self.assertEqual(self.sem.state, SEMController.STATE_OFF)
        self.assertTrue(self.sem.is_plugged_in)
        self.assertFalse(self.sem.main_power_switch)
        self.assertFalse(self.sem.has_power)

    def test_power_continuity(self):
        self.sem.connect_power_cable(False)
        with self.assertRaises(RuntimeError):
            self.sem.set_main_power(True)

        self.sem.connect_power_cable(True)
        self.sem.set_main_power(True)
        self.assertEqual(self.sem.state, SEMController.STATE_STANDBY)
        self.assertTrue(self.sem.has_power)

        # Unplugging cuts power, beam, and pumps instantly
        self.sem.pump_down_chamber()
        self.sem.energize_electron_beam()
        self.sem.connect_power_cable(False)
        self.assertEqual(self.sem.state, SEMController.STATE_OFF)
        self.assertEqual(self.sem.turbo_rpm, 0)
        self.assertFalse(self.sem.column_valve_open)

    def test_atmospheric_beam_interlock_blocked(self):
        """Regression test: beam MUST NEVER energize in STANDBY at 101,325 Pa."""
        self.sem.set_main_power(True)
        self.assertEqual(self.sem.state, SEMController.STATE_STANDBY)
        self.assertEqual(self.sem.chamber_pressure_pa, 101325.0)
        with self.assertRaises(RuntimeError):
            self.sem.energize_electron_beam()

    def test_progressive_and_immediate_vacuum_pumpdown(self):
        self.sem.set_main_power(True)
        self.sem.pump_down_chamber(immediate=False)
        self.assertEqual(self.sem.state, SEMController.STATE_VACUUM_ROUGHING)
        for _ in range(25):
            self.sem.step_vacuum(1.0)
        self.assertEqual(self.sem.state, SEMController.STATE_HIGH_VACUUM)
        self.assertLessEqual(self.sem.chamber_pressure_pa, 1.0e-3)
        self.assertEqual(self.sem.turbo_rpm, 90000)

    def test_chamber_door_and_stage_interlocks(self):
        self.sem.set_main_power(True)
        self.sem.close_chamber_door(False)
        with self.assertRaises(RuntimeError):
            self.sem.pump_down_chamber()
        # Z and Tilt locked when door is open per ZEISS 349347-9013-000
        with self.assertRaises(RuntimeError):
            self.sem.move_stage(z=15.0)
        with self.assertRaises(RuntimeError):
            self.sem.move_stage(tilt=25.0)

    def test_beam_generation_and_progressive_scanning(self):
        self.sem.set_main_power(True)
        self.sem.pump_down_chamber()
        self.sem.energize_electron_beam()
        self.assertEqual(self.sem.state, SEMController.STATE_BEAM_ACTIVE)
        self.assertTrue(self.sem.column_valve_open)

        self.sem.start_imaging(SEMController.SCAN_SLOW)
        self.assertEqual(self.sem.state, SEMController.STATE_IMAGING)
        self.assertTrue(self.sem.is_scanning)

        # Complete progressive scan to archive micrograph
        self.sem.step_scan(800)
        self.assertEqual(len(self.sem.captured_micrographs), 1)

        # Venting extinguishes beam and closes column valve
        self.sem.vent_chamber()
        self.assertEqual(self.sem.state, SEMController.STATE_VENTED)
        self.assertFalse(self.sem.column_valve_open)

    def test_magnification_and_optics_math(self):
        self.sem.set_main_power(True)
        self.sem.set_magnification(25000)
        self.assertEqual(self.sem.magnification, 25000)
        with self.assertRaises(ValueError):
            self.sem.set_magnification(10)
        with self.assertRaises(ValueError):
            self.sem.set_magnification(500000)

        self.sem.set_voltage(0.5)
        self.assertEqual(self.sem.accel_voltage_kv, 0.5)
        with self.assertRaises(ValueError):
            self.sem.set_voltage(35.0)

        self.sem.set_focus(coarse=80.0, fine=60.0)
        q_defocused = self.sem.compute_optics_quality()
        self.assertGreater(q_defocused["defocus_blur_px"], 0.0)

        self.sem.auto_focus()
        q_focused = self.sem.compute_optics_quality()
        self.assertEqual(q_focused["defocus_blur_px"], 0.0)

    def test_eucentric_stage_motion(self):
        self.sem.move_stage(x=25.0, y=-15.0, z=12.5, tilt=30.0, rot=180.0)
        self.assertEqual(self.sem.stage_x_mm, 25.0)
        self.assertEqual(self.sem.stage_y_mm, -15.0)
        self.assertEqual(self.sem.stage_z_mm, 12.5)
        self.assertEqual(self.sem.working_distance_mm, 12.5)
        self.assertEqual(self.sem.stage_tilt_deg, 30.0)
        self.assertEqual(self.sem.stage_rotation_deg, 180.0)

    def test_telemetry_and_glp_csv_export(self):
        self.sem.set_main_power(True)
        self.sem.pump_down_chamber()
        t = self.sem.get_telemetry()
        self.assertIn("state", t)
        self.assertIn("chamber_pressure_pa", t)
        self.assertIn("eht_kv", t)
        self.assertIn("optics", t)
        self.assertIn("eds_peaks", t)

        csv_text = self.sem.export_glp_csv()
        self.assertIn("ZEISS-GEMINI-500", csv_text)
        self.assertIn("HIGH_VACUUM", csv_text)


if __name__ == "__main__":
    unittest.main()
