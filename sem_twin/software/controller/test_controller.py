"""
test_controller.py — 100% Pass Rate Unit Tests for SEM Controller.
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

    def test_power_continuity(self):
        # Powering on while unplugged must fail
        self.sem.connect_power_cable(False)
        with self.assertRaises(RuntimeError):
            self.sem.set_main_power(True)
        
        # Plug in and power on
        self.sem.connect_power_cable(True)
        self.sem.set_main_power(True)
        self.assertEqual(self.sem.state, SEMController.STATE_STANDBY)

        # Unplugging cuts power instantly
        self.sem.connect_power_cable(False)
        self.assertEqual(self.sem.state, SEMController.STATE_OFF)

    def test_vacuum_pumpdown_sequence(self):
        self.sem.set_main_power(True)
        self.sem.pump_down_chamber()
        self.assertEqual(self.sem.state, SEMController.STATE_HIGH_VACUUM)
        self.assertLessEqual(self.sem.chamber_pressure_pa, 1.0e-3)
        self.assertTrue(self.sem.turbo_pump_active)

    def test_chamber_interlock(self):
        self.sem.set_main_power(True)
        self.sem.close_chamber_door(False)
        with self.assertRaises(RuntimeError):
            self.sem.pump_down_chamber()

    def test_beam_generation_and_imaging(self):
        self.sem.set_main_power(True)
        self.sem.pump_down_chamber()
        self.sem.energize_electron_beam()
        self.assertEqual(self.sem.state, SEMController.STATE_BEAM_ACTIVE)
        
        self.sem.start_imaging()
        self.assertEqual(self.sem.state, SEMController.STATE_IMAGING)

        # Venting resets beam
        self.sem.vent_chamber()
        self.assertEqual(self.sem.state, SEMController.STATE_VENTED)

    def test_magnification_and_optics(self):
        self.sem.set_magnification(25000)
        self.assertEqual(self.sem.magnification, 25000)
        with self.assertRaises(ValueError):
            self.sem.set_magnification(10)
        with self.assertRaises(ValueError):
            self.sem.set_magnification(500000)

    def test_eucentric_stage_motion(self):
        self.sem.move_stage(x=25.0, y=-15.0, z=12.5, tilt=30.0, rot=180.0)
        self.assertEqual(self.sem.stage_x_mm, 25.0)
        self.assertEqual(self.sem.stage_y_mm, -15.0)
        self.assertEqual(self.sem.stage_z_mm, 12.5)
        self.assertEqual(self.sem.stage_tilt_deg, 30.0)
        self.assertEqual(self.sem.stage_rotation_deg, 180.0)

    def test_telemetry_schema(self):
        t = self.sem.get_telemetry()
        self.assertIn("state", t)
        self.assertIn("chamber_pressure_pa", t)
        self.assertIn("eht_kv", t)
        self.assertIn("stage", t)

if __name__ == "__main__":
    unittest.main()
