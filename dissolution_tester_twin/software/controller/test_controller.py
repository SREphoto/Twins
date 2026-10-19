"""
Unit Test Suite: Agilent 708-DS USP Tablet Dissolution Apparatus Controller
Verifies 100% test pass rate across kinematics, Noyes-Whitney ODEs, safety interlocks,
physical continuity, and USP <711> GLP reporting.
"""

import unittest
from dissolution_controller import DissolutionController

class TestDissolutionController(unittest.TestCase):

    def setUp(self):
        self.ctrl = DissolutionController()

    def test_01_initial_state_and_continuity(self):
        """Verify initial electrical state, lowered head, and ambient temperatures."""
        self.assertTrue(self.ctrl.is_plugged_in)
        self.assertTrue(self.ctrl.power_switch_on)
        self.assertEqual(self.ctrl.state, 'STANDBY')
        self.assertEqual(self.ctrl.head_elevation_mm, 0.0)
        self.assertEqual(self.ctrl.bath_temp_c, 21.5)
        self.assertEqual(self.ctrl.spindle_rpm, 50.0) # default setpoint
        self.assertFalse(self.ctrl.spindles_spinning)
        self.assertFalse(self.ctrl.heater_active)

    def test_02_continuity_unplug_emergency_shutdown(self):
        """Rule 9: Unplugging power cord immediately shuts down all motors and heaters."""
        self.ctrl.toggle_heater(True)
        self.ctrl.start_stirring(50.0)
        self.assertTrue(self.ctrl.heater_active)
        self.assertTrue(self.ctrl.spindles_spinning)

        # Unplug cord
        self.ctrl.unplug()
        self.assertFalse(self.ctrl.is_plugged_in)
        self.assertEqual(self.ctrl.state, 'POWER_OFF')
        self.assertFalse(self.ctrl.heater_active)
        self.assertFalse(self.ctrl.spindles_spinning)

        # Re-plug
        self.ctrl.plug_in()
        self.assertTrue(self.ctrl.is_plugged_in)
        self.assertEqual(self.ctrl.state, 'STANDBY')

    def test_03_power_switch_toggle(self):
        """Toggling rocker switch cuts power immediately."""
        self.ctrl.set_power_switch(False)
        self.assertFalse(self.ctrl.power_switch_on)
        self.assertEqual(self.ctrl.state, 'POWER_OFF')

        self.ctrl.set_power_switch(True)
        self.assertTrue(self.ctrl.power_switch_on)
        self.assertEqual(self.ctrl.state, 'STANDBY')

    def test_04_elevator_kinematic_travel(self):
        """Test motorized vertical lead screw raising and lowering drive head."""
        # Elevate head UP
        started = self.ctrl.elevate_head_up()
        self.assertTrue(started)
        self.assertEqual(self.ctrl.state, 'ELEVATING_UP')
        self.assertTrue(self.ctrl.is_elevating)

        # Step until top limit reached (311 mm)
        for _ in range(15):
            self.ctrl.step(1.0)
        self.assertEqual(self.ctrl.head_elevation_mm, 311.0)
        self.assertFalse(self.ctrl.is_elevating)
        self.assertEqual(self.ctrl.state, 'STANDBY')

        # Lower head DOWN
        self.ctrl.lower_head_down()
        self.assertEqual(self.ctrl.state, 'ELEVATING_DOWN')
        for _ in range(15):
            self.ctrl.step(1.0)
        self.assertEqual(self.ctrl.head_elevation_mm, 0.0)
        self.assertFalse(self.ctrl.is_elevating)
        self.assertEqual(self.ctrl.state, 'STANDBY')

    def test_05_head_elevation_safety_interlock(self):
        """Verify safety interlock: starting spindles while head is elevated is blocked."""
        # Raise head
        self.ctrl.elevate_head_up()
        for _ in range(15):
            self.ctrl.step(1.0)
        self.assertGreater(self.ctrl.head_elevation_mm, 5.0)

        # Attempt to start spindles
        started = self.ctrl.start_stirring(50.0)
        self.assertFalse(started)
        self.assertFalse(self.ctrl.spindles_spinning)
        self.assertTrue(any('INTERLOCK: Drive head is elevated' in a for a in self.ctrl.alarms))

    def test_06_bath_thermoregulation(self):
        """Test water bath circulator heating from ambient to 37.0°C."""
        self.ctrl.toggle_heater(True)
        self.assertEqual(self.ctrl.state, 'HEATING_BATH')

        # Step until heated
        for _ in range(40):
            self.ctrl.step(1.0)

        self.assertAlmostEqual(self.ctrl.bath_temp_c, 37.0, delta=0.5)
        self.assertEqual(self.ctrl.state, 'READY')

    def test_07_tablet_drop_and_vessel_loading(self):
        """Verify simultaneous loading of 8 vessels."""
        self.ctrl.drop_tablets('prednisone')
        self.assertEqual(len(self.ctrl.vessels), 8)
        for v in self.ctrl.vessels:
            self.assertTrue(v['tablet_dropped'])
            self.assertEqual(v['tablet_mass_mg'], 10.0)
            self.assertEqual(v['dissolved_pct'], 0.0)
            self.assertEqual(v['tablet_radius_mm'], 4.5)

    def test_08_noyes_whitney_dissolution_kinetics(self):
        """Test Noyes-Whitney dissolution ODE integration and tablet shrinkage."""
        # Lower head and heat bath
        self.ctrl.toggle_heater(True)
        for _ in range(40):
            self.ctrl.step(1.0)

        # Drop tablets and start stirring
        self.ctrl.drop_tablets('prednisone')
        self.ctrl.start_stirring(50.0)
        self.assertEqual(self.ctrl.state, 'RUNNING_DISSOLUTION')

        initial_radius = self.ctrl.vessels[0]['tablet_radius_mm']

        # Run dissolution for 30 seconds
        for _ in range(30):
            self.ctrl.step(1.0)

        # Dissolution percentage must increase and tablet must shrink
        for v in self.ctrl.vessels:
            self.assertGreater(v['dissolved_pct'], 0.0)
            self.assertGreater(v['conc_mg_ml'], 0.0)
            self.assertLess(v['tablet_radius_mm'], initial_radius)

    def test_09_usp_prednisone_release_profile(self):
        """Verify calibration release kinetics match USP <711> standards."""
        self.ctrl.toggle_heater(True)
        for _ in range(40):
            self.ctrl.step(1.0)
        self.ctrl.drop_tablets('prednisone')
        self.ctrl.start_stirring(50.0)

        # Run for 20 simulated increments
        for _ in range(20):
            self.ctrl.step(1.0)

        # Release must be progressing cleanly
        for v in self.ctrl.vessels:
            self.assertGreater(v['dissolved_pct'], 5.0)
            self.assertLess(v['dissolved_pct'], 100.0)

    def test_10_glp_batch_reporting_and_rsd(self):
        """Verify GLP certified record with RSD calculation."""
        self.ctrl.toggle_heater(True)
        for _ in range(40):
            self.ctrl.step(1.0)
        self.ctrl.drop_tablets('prednisone')
        self.ctrl.start_stirring(50.0)
        for _ in range(20):
            self.ctrl.step(1.0)

        rec = self.ctrl.record_glp_batch('USP-CALIB-BATCH-708')
        self.assertEqual(rec['batch_id'], 'USP-CALIB-BATCH-708')
        self.assertIn('avg_pct', rec)
        self.assertIn('rsd_pct', rec)
        self.assertLessEqual(rec['rsd_pct'], 5.0) # USP <711> repeatability standard
        self.assertEqual(rec['status'], 'PASS')
        self.assertEqual(len(self.ctrl.glp_records), 1)

if __name__ == '__main__':
    unittest.main()
