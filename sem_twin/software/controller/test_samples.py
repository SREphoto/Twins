"""
test_samples.py — Specimen Catalog, Sputter Coating & EDS X-Ray Physics Tests.
"""

import unittest
from sem_controller import SEMController, SPECIMEN_CATALOG


class TestSEMSamplesAndEDS(unittest.TestCase):
    def setUp(self):
        self.sem = SEMController()
        self.sem.set_main_power(True)

    def test_specimen_catalog_completeness(self):
        self.assertEqual(len(SPECIMEN_CATALOG), 6)
        ids = [s["id"] for s in SPECIMEN_CATALOG]
        self.assertEqual(
            ids,
            ["ommatidia", "pollen", "morpho", "finfet", "zno_tetrapods", "al_cu_alloy"],
        )

    def test_dielectric_charging_vs_sputter_coating(self):
        # Select non-conductive ragweed pollen at 15 kV
        self.sem.select_specimen("pollen")
        self.sem.set_voltage(15.0)
        self.sem.set_sputter_coating(False)
        q_uncoated = self.sem.compute_optics_quality()
        self.assertGreater(q_uncoated["charging_index"], 0.0)

        # Apply 10 nm Au/Pd sputter coating -> charging drops to 0.0
        self.sem.set_sputter_coating(True, 10.0)
        q_coated = self.sem.compute_optics_quality()
        self.assertEqual(q_coated["charging_index"], 0.0)

    def test_eds_characteristic_peaks_and_overvoltage(self):
        self.sem.select_specimen("finfet")
        self.sem.set_sputter_coating(True)
        self.sem.set_voltage(15.0)
        peaks_15kv = self.sem.get_eds_spectrum()
        symbols_15kv = {p["symbol"] for p in peaks_15kv}
        self.assertIn("Si", symbols_15kv)
        self.assertIn("W", symbols_15kv)
        self.assertIn("Au", symbols_15kv)

        # At 1.0 kV, high-energy Si Kα (1.740 keV) and Au Mα (2.120 keV) cannot be excited
        self.sem.set_voltage(1.0)
        peaks_1kv = self.sem.get_eds_spectrum()
        symbols_1kv = {p["symbol"] for p in peaks_1kv}
        self.assertIn("O", symbols_1kv)
        self.assertNotIn("Si", symbols_1kv)
        self.assertNotIn("Au", symbols_1kv)


if __name__ == "__main__":
    unittest.main()
