"""
Unit tests for KarlFischerController.

Verifies:
1. Electrical continuity interlocks (plugged in & power switch).
2. Conditioning cycle and stable drift transition to READY.
3. Sample injection and active titration simulation.
4. Bipotentiometric depolarization and endpoint detection.
5. GLP batch record computation and telemetry export.
"""

import unittest
from karl_fischer_controller import KarlFischerController, State, DosingSpeed


class TestKarlFischerController(unittest.TestCase):

    def setUp(self):
        self.ctrl = KarlFischerController(
            titer_mg_per_ml=5.0,
            ambient_drift_ug_min=10.0,
            stop_potential_mv=100.0,
            stop_delay_s=5.0
        )

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, State.STANDBY)
        self.assertTrue(self.ctrl.is_plugged_in)
        self.assertTrue(self.ctrl.power_switch_on)
        self.assertGreater(self.ctrl.potential_mv, 500.0)

    def test_electrical_continuity_unplugged(self):
        self.ctrl.set_plugged_in(False)
        self.assertEqual(self.ctrl.state, State.UNPLUGGED)
        self.assertFalse(self.ctrl.stir_enabled)
        self.assertEqual(self.ctrl.potential_mv, 0.0)

        # Simulation step should do nothing while unplugged
        self.ctrl.step(1.0)
        self.assertEqual(self.ctrl.elapsed_time_s, 0.0)

        # Re-plug
        self.ctrl.set_plugged_in(True)
        self.assertEqual(self.ctrl.state, State.STANDBY)

    def test_power_switch_off(self):
        self.ctrl.set_power_switch(False)
        self.assertEqual(self.ctrl.state, State.POWER_OFF)
        self.assertFalse(self.ctrl.stir_enabled)
        self.assertEqual(self.ctrl.potential_mv, 0.0)

        self.ctrl.set_power_switch(True)
        self.assertEqual(self.ctrl.state, State.STANDBY)

    def test_stirrer_speed_limits(self):
        self.ctrl.set_stir_speed(2000.0)
        self.assertEqual(self.ctrl.stir_speed_rpm, 1500.0)

        self.ctrl.set_stir_speed(-50.0)
        self.assertEqual(self.ctrl.stir_speed_rpm, 0.0)

        self.ctrl.set_stir_speed(750.0)
        self.assertEqual(self.ctrl.stir_speed_rpm, 750.0)

    def test_conditioning_and_ready_transition(self):
        self.assertTrue(self.ctrl.start_conditioning())
        self.assertEqual(self.ctrl.state, State.PRE_TITR)

        # Step forward until cell is dry and reaches READY
        for _ in range(120):
            self.ctrl.step(1.0)
            if self.ctrl.state == State.READY:
                break

        self.assertEqual(self.ctrl.state, State.READY)
        self.assertLessEqual(self.ctrl.cell_water_ug, 15.0)

    def test_sample_injection_and_titration(self):
        # First condition to READY
        self.ctrl.start_conditioning()
        for _ in range(120):
            self.ctrl.step(1.0)
            if self.ctrl.state == State.READY:
                break

        self.assertEqual(self.ctrl.state, State.READY)

        # Inject 1.0 g of a 0.2% water sample (2.0 mg H2O = 2000 µg H2O)
        injected = self.ctrl.inject_sample(
            name="Hydranal Water Standard 0.2%",
            mass_g=1.0000,
            water_content_expected_pct=0.2
        )
        self.assertTrue(injected)
        self.assertEqual(self.ctrl.state, State.TITRATING)
        self.assertGreater(self.ctrl.potential_mv, 500.0)

        # Step through active titration until COMPLETE
        for _ in range(300):
            self.ctrl.step(1.0)
            if self.ctrl.state == State.COMPLETE:
                break

        self.assertEqual(self.ctrl.state, State.COMPLETE)
        self.assertLessEqual(self.ctrl.potential_mv, 100.0)
        self.assertEqual(len(self.ctrl.records), 1)

        rec = self.ctrl.records[0]
        self.assertEqual(rec.sample_name, "Hydranal Water Standard 0.2%")
        self.assertAlmostEqual(rec.water_content_pct, 0.2, delta=0.03)

    def test_overfill_protection(self):
        # Set tiny buret volume to force overfill
        self.ctrl.buret_volume_ml = 0.05
        self.ctrl.start_conditioning()
        for _ in range(60):
            self.ctrl.step(1.0)
            if self.ctrl.state == State.READY:
                break

        # Inject sample requiring more titrant than buret holds
        self.ctrl.inject_sample("Large Water Sample", mass_g=5.0, water_content_expected_pct=1.0)
        for _ in range(60):
            self.ctrl.step(1.0)
            if self.ctrl.state == State.ERR_OVERFILL:
                break
        self.assertEqual(self.ctrl.state, State.ERR_OVERFILL)

    def test_stir_toggle(self):
        self.assertTrue(self.ctrl.stir_enabled)
        state1 = self.ctrl.toggle_stirrer()
        self.assertFalse(state1)
        self.assertFalse(self.ctrl.stir_enabled)
        state2 = self.ctrl.toggle_stirrer()
        self.assertTrue(state2)
        self.assertTrue(self.ctrl.stir_enabled)

    def test_telemetry_output(self):
        telem = self.ctrl.get_telemetry()
        self.assertIn("state", telem)
        self.assertIn("potential_mv", telem)
        self.assertIn("volume_dosed_ml", telem)
        self.assertIn("drift_ug_min", telem)
        self.assertIn("stir_speed_rpm", telem)


if __name__ == "__main__":
    unittest.main()
