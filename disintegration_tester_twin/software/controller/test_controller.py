"""
Unit Test Suite: ERWEKA ZT 322 Tablet Disintegration Tester Controller
Verifies 100% test pass rate across physical continuity, harmonic kinematics,
thermodynamic PID loops, USP <701> disintegration kinetics, and GLP audit logging.
"""

import unittest
from disintegration_controller import DisintegrationController

class TestDisintegrationController(unittest.TestCase):

    def setUp(self):
        self.ctrl = DisintegrationController()

    def test_01_initial_state_and_continuity(self):
        """Verify initial electrical state, parked head, and default parameters."""
        self.assertTrue(self.ctrl.is_plugged_in)
        self.assertTrue(self.ctrl.power_switch_on)
        self.assertTrue(self.ctrl.has_power)
        self.assertEqual(self.ctrl.state, 'STANDBY')
        self.assertEqual(self.ctrl.basket_elevation_mm, 0.0)
        self.assertEqual(self.ctrl.bath_temp_c, 21.5)
        self.assertEqual(self.ctrl.target_temp_c, 37.0)
        self.assertFalse(self.ctrl.oscillation_active)
        self.assertFalse(self.ctrl.heater_active)
        self.assertEqual(self.ctrl.station_1_tablets_intact, 6)
        self.assertEqual(self.ctrl.station_2_tablets_intact, 6)

    def test_02_continuity_unplug_emergency_shutdown(self):
        """Rule 9: Unplugging power cord immediately shuts down all motors and heaters."""
        self.ctrl.toggle_heater(True)
        self.ctrl.start_test(15.0)
        self.assertTrue(self.ctrl.heater_active)
        self.assertTrue(self.ctrl.oscillation_active)

        # Unplug cord
        self.ctrl.unplug()
        self.assertFalse(self.ctrl.is_plugged_in)
        self.assertFalse(self.ctrl.has_power)
        self.assertEqual(self.ctrl.state, 'POWER_OFF')
        self.assertFalse(self.ctrl.heater_active)
        self.assertFalse(self.ctrl.oscillation_active)

        # Re-plug
        self.ctrl.plug_in()
        self.assertTrue(self.ctrl.is_plugged_in)
        self.assertTrue(self.ctrl.has_power)
        self.assertEqual(self.ctrl.state, 'STANDBY')

    def test_03_rear_power_switch(self):
        """Toggling rear power rocker cuts power immediately."""
        self.ctrl.start_test(10.0)
        self.assertTrue(self.ctrl.oscillation_active)
        
        self.ctrl.set_power_switch(False)
        self.assertFalse(self.ctrl.has_power)
        self.assertEqual(self.ctrl.state, 'POWER_OFF')
        self.assertFalse(self.ctrl.oscillation_active)

        self.ctrl.set_power_switch(True)
        self.assertTrue(self.ctrl.has_power)
        self.assertEqual(self.ctrl.state, 'STANDBY')

    def test_04_heater_pid_and_thermal_rise(self):
        """Verify flow-through heater raises temperature toward 37.0 C."""
        self.ctrl.toggle_heater(True)
        self.assertTrue(self.ctrl.heater_active)
        self.assertEqual(self.ctrl.state, 'HEATING')

        # Simulate 120 seconds of heating
        for _ in range(120):
            self.ctrl.step(1.0)

        # Temperature should have increased from 21.5 C
        self.assertGreater(self.ctrl.bath_temp_c, 23.0)
        self.assertLess(self.ctrl.bath_temp_c, 45.0)

    def test_05_dry_fire_protection_water_level(self):
        """Float switch cuts heater if bath water level drops."""
        self.ctrl.toggle_heater(True)
        self.assertTrue(self.ctrl.heater_active)

        # Water level drops
        self.ctrl.set_water_level_ok(False)
        self.assertFalse(self.ctrl.heater_active)
        self.assertEqual(self.ctrl.state, 'FAULT_DRY_RUN')

        # Try to turn heater back on while dry
        success = self.ctrl.toggle_heater(True)
        self.assertFalse(success)
        self.assertFalse(self.ctrl.heater_active)

    def test_06_harmonic_stroke_kinematics(self):
        """Verify stroke frequency is exactly 30 strokes/min and amplitude is 27.5 mm."""
        self.ctrl.start_test(5.0)
        self.assertTrue(self.ctrl.oscillation_active)
        self.assertEqual(self.ctrl.state, 'RUNNING_OSCILLATION')

        # One full cycle = 2.0 seconds (0.50 Hz)
        # At t = 0.5s (quarter cycle, 90 deg), elevation should be peak ~ +27.5 mm
        self.ctrl.step(0.5)
        self.assertAlmostEqual(self.ctrl.basket_elevation_mm, 27.5, delta=0.5)

        # At t = 1.5s (three-quarter cycle, 270 deg), elevation should be trough ~ -27.5 mm
        self.ctrl.step(1.0) # total 1.5s
        self.assertAlmostEqual(self.ctrl.basket_elevation_mm, -27.5, delta=0.5)

        # Total peak-to-peak travel = 55.0 mm
        # Run for 60 seconds -> exactly 30 strokes
        for _ in range(585): # 58.5s remaining
            self.ctrl.step(0.1)
        self.assertEqual(self.ctrl.stroke_count, 30)

    def test_07_basket_manual_lift(self):
        """Verify manual basket service lift raises carrier by +120 mm."""
        self.assertFalse(self.ctrl.baskets_lifted)
        self.assertEqual(self.ctrl.basket_elevation_mm, 0.0)

        self.ctrl.toggle_basket_lift()
        self.assertTrue(self.ctrl.baskets_lifted)
        self.assertEqual(self.ctrl.basket_elevation_mm, 120.0)

        self.ctrl.toggle_basket_lift()
        self.assertFalse(self.ctrl.baskets_lifted)
        self.assertEqual(self.ctrl.basket_elevation_mm, 0.0)

    def test_08_tablet_disintegration_kinetics_ir(self):
        """Verify Immediate-Release Aspirin disintegrates within ~210 seconds."""
        self.ctrl.load_samples('IR_ASPIRIN', 'IR_ASPIRIN')
        self.ctrl.bath_temp_c = 37.0 # At optimal compendial temperature
        self.ctrl.start_test(10.0)

        # Initially 6 intact
        self.assertEqual(self.ctrl.station_1_tablets_intact, 6)

        # Run for 250 seconds
        for _ in range(2500):
            self.ctrl.step(0.1)

        # All 6 tablets should have fully disintegrated through the 10-mesh screen
        self.assertEqual(self.ctrl.station_1_tablets_intact, 0)
        self.assertEqual(self.ctrl.station_2_tablets_intact, 0)

    def test_09_enteric_coated_acid_resistance(self):
        """Verify Enteric-coated tablets remain intact in gastric acid simulation."""
        self.ctrl.load_samples('ENTERIC_ACID', 'IR_ASPIRIN')
        self.ctrl.bath_temp_c = 37.0
        self.ctrl.start_test(15.0)

        # Run for 300 seconds
        for _ in range(3000):
            self.ctrl.step(0.1)

        # Station 1 (Enteric in acid) must still have all 6 tablets intact!
        self.assertEqual(self.ctrl.station_1_tablets_intact, 6)
        # Station 2 (IR Aspirin) must have 0 intact
        self.assertEqual(self.ctrl.station_2_tablets_intact, 0)

    def test_10_glp_audit_trail_and_csv_export(self):
        """Verify GLP analytical audit logging and CSV generation."""
        self.ctrl.start_test(5.0)
        for _ in range(150): # 15 seconds
            self.ctrl.step(0.1)
        
        csv_data = self.ctrl.export_glp_csv()
        self.assertIn("GLP Analytical Run Audit Trail", csv_data)
        self.assertIn("USP <701>", csv_data)
        self.assertIn("Time (s),Strokes,CPM", csv_data)
        self.assertGreater(len(self.ctrl.audit_log), 0)

if __name__ == '__main__':
    unittest.main()
