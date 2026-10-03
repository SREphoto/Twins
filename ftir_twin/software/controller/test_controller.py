"""
Unit Tests for FTIR Spectrometer Controller
Verifies physical continuity, Michelson scanning, ATR clamp coupling,
and spectral peak identification.
"""

import unittest
from ftir_controller import FTIRController, FTIRState, SampleState, IR_LIBRARY


class TestFTIRController(unittest.TestCase):
    def setUp(self):
        self.controller = FTIRController()

    def test_power_continuity(self):
        """Rule 9 & DIAG-014: Instrument cannot operate without electrical continuity."""
        self.assertTrue(self.controller.has_power)
        self.assertEqual(self.controller.state, FTIRState.READY)

        # Pull plug from duplex wall outlet
        self.controller.set_power_cord(False)
        self.assertFalse(self.controller.has_power)
        self.assertEqual(self.controller.state, FTIRState.POWER_OFF)
        self.assertFalse(self.controller.acquire_sample_scan())

        # Re-plug
        self.controller.set_power_cord(True)
        self.assertTrue(self.controller.has_power)
        self.controller.set_power_switch(True)
        self.assertEqual(self.controller.state, FTIRState.READY)

        # Toggle rear rocker switch off
        self.controller.set_power_switch(False)
        self.assertFalse(self.controller.has_power)
        self.assertEqual(self.controller.state, FTIRState.POWER_OFF)

    def test_background_acquisition(self):
        """Verifies single-beam I0 background recording on clean diamond."""
        self.assertFalse(self.controller.has_valid_background)
        success = self.controller.acquire_background()
        self.assertTrue(success)
        self.assertTrue(self.controller.has_valid_background)
        self.assertGreater(len(self.controller.background_spectrum), 800)
        self.assertEqual(self.controller.state, FTIRState.READY)

    def test_liquid_sample_acetone(self):
        """Tests scan of Acetone with diagnostic carbonyl C=O peak at 1715 cm⁻¹."""
        self.controller.set_sample(SampleState.ACETONE)
        success = self.controller.acquire_sample_scan()
        self.assertTrue(success)

        # Find 1715 cm⁻¹ peak in detected peaks
        peak_found = False
        for wn, t_pct, label in self.controller.detected_peaks:
            if abs(wn - 1715.0) < 5.0 and "C=O" in label:
                peak_found = True
                self.assertLess(t_pct, 15.0)  # Strong absorption -> low %T
                break
        self.assertTrue(peak_found, "Carbonyl C=O peak at 1715 cm⁻¹ was not identified.")

    def test_liquid_sample_isopropanol(self):
        """Tests scan of Isopropanol with broad O-H stretch at 3350 cm⁻¹."""
        self.controller.set_sample(SampleState.ISOPROPANOL)
        success = self.controller.acquire_sample_scan()
        self.assertTrue(success)

        peak_found = False
        for wn, t_pct, label in self.controller.detected_peaks:
            if abs(wn - 3350.0) < 10.0 and "O-H" in label:
                peak_found = True
                self.assertLess(t_pct, 20.0)
                break
        self.assertTrue(peak_found, "Alcohol O-H stretch at 3350 cm⁻¹ was not identified.")

    def test_solid_sample_clamp_coupling(self):
        """
        Tests that solid samples (Polystyrene film) require physical pressure
        from the ATR clamp tower to optically couple with the evanescent wave.
        """
        self.controller.set_sample(SampleState.POLYSTYRENE)

        # Case A: Tower disengaged (no pressure)
        self.controller.set_clamp_tower(engaged=False, pressure_pct=0.0)
        self.controller.acquire_sample_scan()
        self.assertEqual(len(self.controller.detected_peaks), 0, "Solid should not register peaks without clamp pressure.")

        # Case B: Tower engaged with 80% slip-clutch pressure
        self.controller.set_clamp_tower(engaged=True, pressure_pct=80.0)
        self.controller.acquire_sample_scan()
        self.assertGreater(len(self.controller.detected_peaks), 3, "Solid should register distinct peaks under pressure.")

    def test_glp_log_export(self):
        """Verifies 21 CFR Part 11 GLP audit log format."""
        self.controller.set_sample(SampleState.BENZOIC_ACID)
        self.controller.set_clamp_tower(engaged=True, pressure_pct=90.0)
        self.controller.acquire_sample_scan()
        log = self.controller.export_glp_log()

        self.assertIn("GLP AUDIT RECORD", log)
        self.assertIn("Benzoic Acid", log)
        self.assertIn("Monolithic Diamond", log)
        self.assertIn("4000 to 400 cm⁻¹", log)


if __name__ == "__main__":
    unittest.main()
