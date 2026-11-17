"""
test_samples.py — Specimen Catalog, Sputter Coating & EDS X-Ray Physics Tests.
"""

import unittest
from sem_controller import SEMController, SPECIMEN_CATALOG


class TestSEMSamplesAndEDS(unittest.TestCase):
    def setUp(self):
        self.sem = SEMController()
        self.sem.set_main_power(True)

    def test_specimen_catalog_completeness_and_canonical_specs(self):
        self.assertEqual(len(SPECIMEN_CATALOG), 6)
        ids = [s["id"] for s in SPECIMEN_CATALOG]
        self.assertEqual(
            ids,
            ["ommatidia", "pollen", "morpho", "finfet", "zno_tetrapods", "al_cu_alloy"],
        )

        expected = {
            "ommatidia": {
                "name": "Drosophila melanogaster Compound Eye",
                "default_mag": 15000,
                "conductive_native": False,
                "elements": {"C": 0.277, "O": 0.525, "N": 0.392, "Ca": 3.691},
            },
            "pollen": {
                "name": "Hibiscus syriacus (Echinate Pollen Grain)",
                "default_mag": 12000,
                "conductive_native": False,
                "elements": {"C": 0.277, "O": 0.525, "Ca": 3.691, "K": 3.314},
            },
            "morpho": {
                "name": "Morpho rhetenor Photonic Wing Scale",
                "default_mag": 45000,
                "conductive_native": False,
                "elements": {"C": 0.277, "O": 0.525, "N": 0.392},
            },
            "finfet": {
                "name": "5 nm FinFET CMOS Logic Gate Cross-Section",
                "default_mag": 120000,
                "conductive_native": True,
                "elements": {"Si": 1.740, "O": 0.525, "W": 1.775, "Hf": 1.645, "Cu": 8.040},
            },
            "zno_tetrapods": {
                "name": "ZnO Wurtzite Tetrapod Nanowires",
                "default_mag": 65000,
                "conductive_native": True,
                "elements": {"Zn": 1.012, "O": 0.525, "Al": 1.486},
            },
            "al_cu_alloy": {
                "name": "AA2024-T3 Al-Cu-Mg-Si Aerospace Alloy",
                "default_mag": 25000,
                "conductive_native": True,
                "elements": {"Al": 1.486, "Cu": 8.040, "Mg": 1.253, "Si": 1.740, "Mn": 5.898},
            },
        }

        for spec in SPECIMEN_CATALOG:
            exp = expected[spec["id"]]
            self.assertEqual(spec["name"], exp["name"])
            self.assertEqual(spec["default_mag"], exp["default_mag"])
            self.assertEqual(spec["conductive_native"], exp["conductive_native"])
            elem_map = {el["symbol"]: el["energy_kev"] for el in spec["elements"]}
            self.assertEqual(elem_map, exp["elements"])

        # Unknown specimen selection raises ValueError
        with self.assertRaises(ValueError):
            self.sem.select_specimen("nonexistent_sample")
        with self.assertRaises(ValueError):
            self.sem.select_specimen(99)

    def test_canonical_5nm_sputter_coating_and_dielectric_charging(self):
        # Default sputter film is 5.0 nm Au/Pd
        self.assertTrue(self.sem.is_sputter_coated)
        self.assertEqual(self.sem.sputter_thickness_nm, 5.0)

        # Select non-conductive Hibiscus pollen at 15 kV
        self.sem.select_specimen("pollen")
        self.sem.set_voltage(15.0)
        self.sem.set_sputter_coating(False)
        self.assertEqual(self.sem.sputter_thickness_nm, 0.0)
        q_uncoated = self.sem.compute_optics_quality()
        self.assertGreater(q_uncoated["charging_index"], 0.0)

        # Apply canonical default 5.0 nm Au/Pd sputter coating -> charging drops to 0.0
        self.sem.set_sputter_coating(True)
        self.assertEqual(self.sem.sputter_thickness_nm, 5.0)
        q_coated = self.sem.compute_optics_quality()
        self.assertEqual(q_coated["charging_index"], 0.0)

        # Conductive specimens (e.g., 5 nm FinFET, AA2024-T3) never charge even uncoated
        for cond_id in ("finfet", "zno_tetrapods", "al_cu_alloy"):
            self.sem.select_specimen(cond_id)
            self.sem.set_sputter_coating(False)
            self.assertEqual(self.sem.compute_optics_quality()["charging_index"], 0.0)

    def test_eds_characteristic_peaks_overvoltage_and_coating_scaling(self):
        # 5 nm FinFET at 15 kV excites Si, O, W, Hf, Cu plus Au/Pd coating
        self.sem.select_specimen("finfet")
        self.sem.set_sputter_coating(True)
        self.sem.set_voltage(15.0)
        peaks_15kv = {p["symbol"]: p for p in self.sem.get_eds_spectrum()}
        for sym in ("Si", "O", "W", "Hf", "Cu", "Au", "Pd"):
            self.assertIn(sym, peaks_15kv)
        self.assertEqual(peaks_15kv["Au"]["energy_kev"], 2.120)
        self.assertEqual(peaks_15kv["Pd"]["energy_kev"], 2.838)

        # Subtle scaling of Au/Pd peak intensity with sputter film thickness
        au_5nm = peaks_15kv["Au"]["wt_pct"]
        self.sem.set_sputter_coating(True, 10.0)
        peaks_10nm = {p["symbol"]: p for p in self.sem.get_eds_spectrum()}
        self.assertGreater(peaks_10nm["Au"]["wt_pct"], au_5nm)
        self.sem.set_sputter_coating(True)

        # At 2.5 kV boundary, Au Mα (2.120) and Pd Lα (2.838) are present; below 2.5 kV they drop out
        self.sem.set_voltage(2.5)
        peaks_25kv = {p["symbol"] for p in self.sem.get_eds_spectrum()}
        self.assertIn("Au", peaks_25kv)
        self.assertIn("Pd", peaks_25kv)

        self.sem.set_voltage(2.4)
        peaks_24kv = {p["symbol"] for p in self.sem.get_eds_spectrum()}
        self.assertNotIn("Au", peaks_24kv)
        self.assertNotIn("Pd", peaks_24kv)

        # At 1.0 kV (0.85 keV excitation ceiling), Si/W/Hf/Cu/Au/Pd cannot be excited; O Kα remains
        self.sem.set_voltage(1.0)
        peaks_1kv = {p["symbol"] for p in self.sem.get_eds_spectrum()}
        self.assertIn("O", peaks_1kv)
        for unexcited in ("Si", "W", "Hf", "Cu", "Au", "Pd"):
            self.assertNotIn(unexcited, peaks_1kv)

        # Hibiscus pollen at 10 kV excites C, O, Ca, K + Au, Pd
        self.sem.select_specimen("pollen")
        self.sem.set_voltage(10.0)
        pollen_syms = {p["symbol"] for p in self.sem.get_eds_spectrum()}
        self.assertTrue({"C", "O", "Ca", "K", "Au", "Pd"}.issubset(pollen_syms))

        # AA2024-T3 alloy: Cu Kα (8.040 keV) requires EHT >= 9.46 kV (0.85 * EHT >= 8.040)
        self.sem.select_specimen("al_cu_alloy")
        self.sem.set_sputter_coating(False)
        self.sem.set_voltage(5.0)
        alloy_5kv = {p["symbol"] for p in self.sem.get_eds_spectrum()}
        self.assertTrue({"Al", "Mg", "Si"}.issubset(alloy_5kv))
        self.assertNotIn("Cu", alloy_5kv)
        self.assertNotIn("Mn", alloy_5kv)

        self.sem.set_voltage(20.0)
        alloy_20kv = {p["symbol"] for p in self.sem.get_eds_spectrum()}
        self.assertEqual(alloy_20kv, {"Al", "Cu", "Mg", "Si", "Mn"})


if __name__ == "__main__":
    unittest.main()
