import unittest
from spectrophotometer_controller import (
    SpectrophotometerController,
    SpectroState,
    MeasureMode,
    STANDARD_SAMPLES
)


class TestSpectrophotometerController(unittest.TestCase):
    def setUp(self):
        self.ctrl = SpectrophotometerController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, SpectroState.READY)
        self.assertEqual(self.ctrl.active_cell_position, 1)
        self.assertEqual(self.ctrl.current_wavelength, 525.0)
        self.assertEqual(self.ctrl.active_lamp, "TUNGSTEN_VIS")

    def test_lamp_switchover(self):
        # Above 340 nm -> Tungsten Vis
        self.ctrl.set_wavelength(500.0)
        self.assertEqual(self.ctrl.active_lamp, "TUNGSTEN_VIS")

        # Below 340 nm -> Deuterium UV
        self.ctrl.set_wavelength(260.0)
        self.assertEqual(self.ctrl.active_lamp, "DEUTERIUM_UV")

    def test_chamber_lid_interlock(self):
        self.assertFalse(self.ctrl.chamber_lid_open)
        # Open lid during scan or measurement triggers fault
        self.ctrl.start_scan(400, 600)
        self.assertEqual(self.ctrl.state, SpectroState.SCANNING)
        self.ctrl.set_chamber_lid(True)
        self.assertEqual(self.ctrl.state, SpectroState.FAULT_LID_OPEN)

        # Cannot measure while lid open
        res = self.ctrl.measure()
        self.assertIsNone(res)

        # Close lid restores ready state
        self.ctrl.set_chamber_lid(False)
        self.assertEqual(self.ctrl.state, SpectroState.READY)

    def test_cell_selection_and_advance(self):
        self.ctrl.select_cell(2)  # KMnO4
        self.assertEqual(self.ctrl.active_cell_position, 2)
        next_cell = self.ctrl.advance_cell()
        self.assertEqual(next_cell, 3)  # DNA

        # Invalid cell position clamped/ignored
        self.assertFalse(self.ctrl.select_cell(99))

    def test_beer_lambert_measurement_and_zero(self):
        # Cell 2: KMnO4 at 525 nm
        self.ctrl.select_cell(2)
        self.ctrl.set_wavelength(525.0)
        reading = self.ctrl.measure()
        self.assertIsNotNone(reading)
        abs_val, t_pct = reading
        self.assertGreater(abs_val, 1.0)
        self.assertLess(t_pct, 10.0)

        # Auto-zero with Blank (Cell 1)
        self.ctrl.select_cell(1)
        self.ctrl.auto_zero()
        blank_read = self.ctrl.measure()
        self.assertAlmostEqual(blank_read[0], 0.0, places=3)
        self.assertAlmostEqual(blank_read[1], 100.0, delta=1.0)

    def test_spectrum_scan_execution(self):
        self.ctrl.select_cell(2)  # KMnO4
        started = self.ctrl.start_scan(start_nm=500.0, end_nm=550.0)
        self.assertTrue(started)
        self.assertEqual(self.ctrl.state, SpectroState.SCANNING)

        # Tick simulation to complete scan
        for _ in range(30):
            self.ctrl.tick(dt_sec=0.1)

        self.assertEqual(self.ctrl.state, SpectroState.READY)
        self.assertGreater(len(self.ctrl.scan_data), 10)


if __name__ == '__main__':
    unittest.main()
