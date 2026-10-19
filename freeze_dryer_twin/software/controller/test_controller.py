"""
Unit Test Suite: Labconco FreeZone 4.5L (-84°C) Lyophilizer Controller
Verifies 100% test pass rate across thermodynamic state machine, safety interlocks,
physical continuity, and GLP reporting.
"""

import unittest
from freeze_dryer_controller import FreezeDryerController

class TestFreezeDryerController(unittest.TestCase):

    def setUp(self):
        self.ctrl = FreezeDryerController()

    def test_01_initial_continuity_and_standby(self):
        """Verify initial electrical state and standby conditions."""
        self.assertTrue(self.ctrl.is_plugged_in)
        self.assertTrue(self.ctrl.power_switch_on)
        self.assertEqual(self.ctrl.state, 'STANDBY')
        self.assertEqual(self.ctrl.collector_temp_c, 21.5)
        self.assertEqual(self.ctrl.vacuum_mbar, 1013.25)
        self.assertFalse(self.ctrl.compressor_stage1)
        self.assertFalse(self.ctrl.compressor_stage2)
        self.assertFalse(self.ctrl.vacuum_pump)

    def test_02_continuity_unplug_safety(self):
        """Rule 9: Unplugging power cord immediately shuts down all active components."""
        self.ctrl.start_refrigeration()
        self.assertTrue(self.ctrl.compressor_stage1)

        # Unplug cord
        self.ctrl.unplug()
        self.assertFalse(self.ctrl.is_plugged_in)
        self.assertEqual(self.ctrl.state, 'POWER_OFF')
        self.assertFalse(self.ctrl.compressor_stage1)
        self.assertFalse(self.ctrl.compressor_stage2)
        self.assertFalse(self.ctrl.vacuum_pump)

        # Re-plug
        self.ctrl.plug_in()
        self.assertTrue(self.ctrl.is_plugged_in)
        self.assertEqual(self.ctrl.state, 'STANDBY')

    def test_03_power_rocker_switch(self):
        """Toggling power switch off cuts power immediately."""
        self.ctrl.set_power_switch(False)
        self.assertFalse(self.ctrl.power_switch_on)
        self.assertEqual(self.ctrl.state, 'POWER_OFF')

        self.ctrl.set_power_switch(True)
        self.assertTrue(self.ctrl.power_switch_on)
        self.assertEqual(self.ctrl.state, 'STANDBY')

    def test_04_cascade_refrigeration_cooling(self):
        """Test dual-stage cascade pull-down to -84°C."""
        self.ctrl.start_refrigeration()
        self.assertEqual(self.ctrl.state, 'PRE_COOLING')
        self.assertTrue(self.ctrl.compressor_stage1)

        # Simulate cooling steps
        for _ in range(50):
            self.ctrl.step(1.0)

        # Stage 1 must be cold and Stage 2 active
        self.assertTrue(self.ctrl.compressor_stage2)
        self.assertLess(self.ctrl.stage1_temp_c, -20.0)
        self.assertLess(self.ctrl.collector_temp_c, -60.0)

        # Further steps pull collector to near -84°C
        for _ in range(50):
            self.ctrl.step(1.0)
        self.assertAlmostEqual(self.ctrl.collector_temp_c, -84.0, delta=1.5)

    def test_05_vacuum_warm_collector_interlock(self):
        """Verify safety interlock: starting vacuum when collector > -40°C is blocked."""
        # Collector is at ambient (+21.5°C)
        started = self.ctrl.start_vacuum()
        self.assertFalse(started)
        self.assertFalse(self.ctrl.vacuum_pump)
        self.assertTrue(any('INTERLOCK: Collector warm' in a for a in self.ctrl.alarms))

    def test_06_vacuum_pull_down_when_cold(self):
        """Verify vacuum evacuation once collector is <= -40°C."""
        # Pre-cool to -84°C
        self.ctrl.start_refrigeration()
        for _ in range(80):
            self.ctrl.step(1.0)
        self.assertLessEqual(self.ctrl.collector_temp_c, -40.0)

        # Now start vacuum
        started = self.ctrl.start_vacuum()
        self.assertTrue(started)
        self.assertTrue(self.ctrl.vacuum_pump)
        self.assertEqual(self.ctrl.state, 'PULL_DOWN')

        # Simulate evacuation steps
        for _ in range(30):
            self.ctrl.step(1.0)
        self.assertLess(self.ctrl.vacuum_mbar, 0.100)

    def test_07_primary_drying_sublimation_and_frost(self):
        """Test sublimation flux, cake depletion, and frost accumulation."""
        # Cool down and pull vacuum
        self.ctrl.start_refrigeration()
        for _ in range(80):
            self.ctrl.step(1.0)
        self.ctrl.start_vacuum()
        for _ in range(30):
            self.ctrl.step(1.0)

        # Open Quick-Seal valve 0 (connected to 300 mL flask)
        initial_cake = self.ctrl.valves[0]['cake_thickness_mm']
        self.assertEqual(initial_cake, 12.0)

        self.ctrl.set_valve_state(0, 'VACUUM')
        self.ctrl.step(1.0)
        self.assertEqual(self.ctrl.state, 'PRIMARY_DRYING')

        # Simulate sublimation
        for _ in range(40):
            self.ctrl.step(1.0)

        # Frost must accumulate and product cake must decrease
        self.assertGreater(self.ctrl.frost_mass_g, 0.0)
        self.assertGreater(self.ctrl.frost_thickness_mm, 0.0)
        self.assertLess(self.ctrl.valves[0]['cake_thickness_mm'], initial_cake)

    def test_08_vacuum_break_and_venting(self):
        """Test breaking vacuum restores atmospheric pressure."""
        self.ctrl.start_refrigeration()
        for _ in range(80):
            self.ctrl.step(1.0)
        self.ctrl.start_vacuum()
        for _ in range(30):
            self.ctrl.step(1.0)
        self.assertLess(self.ctrl.vacuum_mbar, 0.100)

        # Vent chamber
        self.ctrl.vent_chamber()
        self.assertEqual(self.ctrl.state, 'BREAK_VACUUM')

        for _ in range(20):
            self.ctrl.step(1.0)
        self.assertAlmostEqual(self.ctrl.vacuum_mbar, 1013.25, delta=1.0)

    def test_09_defrost_cycle(self):
        """Test defrost melts collector frost and resets chamber."""
        # Manually seed frost
        self.ctrl.frost_mass_g = 250.0
        self.ctrl.frost_thickness_mm = 0.44

        self.ctrl.start_defrost()
        self.assertEqual(self.ctrl.state, 'DEFROST')
        self.assertTrue(self.ctrl.defrost_active)

        for _ in range(30):
            self.ctrl.step(1.0)

        self.assertEqual(self.ctrl.frost_mass_g, 0.0)
        self.assertEqual(self.ctrl.frost_thickness_mm, 0.0)

    def test_10_glp_telemetry_and_record(self):
        """Verify telemetry dictionary and GLP record creation."""
        telem = self.ctrl.get_telemetry()
        self.assertIn('collector_temp_c', telem)
        self.assertIn('vacuum_mbar', telem)
        self.assertIn('frost_mass_g', telem)

        rec = self.ctrl.record_glp_batch('BATCH-FREEZONE-TEST')
        self.assertEqual(rec['batch_id'], 'BATCH-FREEZONE-TEST')
        self.assertEqual(rec['status'], 'PASS')
        self.assertEqual(len(self.ctrl.glp_records), 1)

if __name__ == '__main__':
    unittest.main()
