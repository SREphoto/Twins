"""
test_controller.py — 100% Pass Rate Unit Tests for ZEISS GeminiSEM 500 Controller.
"""

import csv
import io
import math
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
        self.assertEqual(self.sem.chamber_pressure_pa, 101325.0)
        self.assertAlmostEqual(self.sem.chamber_pressure_mbar, 1013.25, places=12)
        self.assertEqual(self.sem.igp_pressure_pa, 2.0e-8)
        self.assertAlmostEqual(self.sem.igp_pressure_mbar, 2.0e-10, places=16)
        self.assertTrue(self.sem.is_sputter_coated)
        self.assertEqual(self.sem.sputter_thickness_nm, 5.0)
        self.assertEqual(self.sem.aperture_um, 30.0)

    def test_power_continuity(self):
        self.sem.connect_power_cable(False)
        with self.assertRaises(RuntimeError):
            self.sem.set_main_power(True)

        self.sem.connect_power_cable(True)
        self.sem.set_main_power(True)
        self.assertEqual(self.sem.state, SEMController.STATE_STANDBY)
        self.assertTrue(self.sem.has_power)

        # Unplugging during active imaging cuts power, beam, scan, and pumps instantly
        self.sem.pump_down_chamber()
        self.sem.energize_electron_beam()
        self.sem.start_imaging(SEMController.SCAN_SLOW)
        self.sem.step_scan(128)
        self.assertTrue(self.sem.is_scanning)

        self.sem.connect_power_cable(False)
        self.assertEqual(self.sem.state, SEMController.STATE_OFF)
        self.assertEqual(self.sem.turbo_rpm, 0)
        self.assertEqual(self.sem.scroll_rpm, 0)
        self.assertFalse(self.sem.column_valve_open)
        self.assertFalse(self.sem.is_scanning)

        # Re-plugging does NOT auto-restart until main breaker is turned back on
        self.sem.connect_power_cable(True)
        self.assertEqual(self.sem.state, SEMController.STATE_OFF)
        self.assertFalse(self.sem.has_power)

    def test_unpowered_lockout_across_commands(self):
        """All powered commands and steppers must lock out when main switch off or cord unplugged."""
        for unplug_mode in (False, True):
            sem = SEMController()
            if unplug_mode:
                sem.set_main_power(True)
                sem.connect_power_cable(False)
                with self.assertRaises(RuntimeError):
                    sem.set_main_power(True)
            else:
                self.assertFalse(sem.has_power)

            with self.assertRaises(RuntimeError):
                sem.pump_down_chamber()
            with self.assertRaises(RuntimeError):
                sem.vent_chamber()
            with self.assertRaises(RuntimeError):
                sem.energize_electron_beam()
            with self.assertRaises(RuntimeError):
                sem.start_imaging(SEMController.SCAN_FAST)
            with self.assertRaises(RuntimeError):
                sem.auto_focus()
            with self.assertRaises(RuntimeError):
                sem.auto_contrast_brightness()

            # Steppers must remain completely inert while unpowered
            p_before = sem.chamber_pressure_pa
            sem.step_vacuum(1.0)
            self.assertEqual(sem.chamber_pressure_pa, p_before)
            self.assertEqual(sem.state, SEMController.STATE_OFF)

            scan_res = sem.step_scan(64)
            self.assertFalse(scan_res["is_scanning"])
            self.assertEqual(scan_res["scan_line"], 0)

        # Switching main breaker off mid-operation shuts everything down safely
        self.sem.set_main_power(True)
        self.sem.pump_down_chamber()
        self.sem.energize_electron_beam()
        self.sem.start_imaging(SEMController.SCAN_FAST)
        self.sem.set_main_power(False)
        self.assertEqual(self.sem.state, SEMController.STATE_OFF)
        self.assertFalse(self.sem.has_power)
        self.assertFalse(self.sem.column_valve_open)
        self.assertFalse(self.sem.is_scanning)
        self.assertEqual(self.sem.turbo_rpm, 0)

    def test_atmospheric_beam_interlock_blocked(self):
        """Regression test: beam MUST NEVER energize in STANDBY at 101,325 Pa."""
        self.sem.set_main_power(True)
        self.assertEqual(self.sem.state, SEMController.STATE_STANDBY)
        self.assertEqual(self.sem.chamber_pressure_pa, 101325.0)
        with self.assertRaises(RuntimeError):
            self.sem.energize_electron_beam()

        # Also blocked during roughing and turbo pumpdown before HIGH_VACUUM
        self.sem.pump_down_chamber(immediate=False)
        self.assertEqual(self.sem.state, SEMController.STATE_VACUUM_ROUGHING)
        with self.assertRaises(RuntimeError):
            self.sem.energize_electron_beam()

    def test_progressive_and_immediate_vacuum_pumpdown_and_units(self):
        self.sem.set_main_power(True)
        self.sem.pump_down_chamber(immediate=False)
        self.assertEqual(self.sem.state, SEMController.STATE_VACUUM_ROUGHING)
        for _ in range(25):
            self.sem.step_vacuum(1.0)
            self.assertAlmostEqual(
                self.sem.chamber_pressure_mbar,
                self.sem.chamber_pressure_pa * 0.01,
                places=15,
            )
            self.assertAlmostEqual(
                self.sem.igp_pressure_mbar,
                self.sem.igp_pressure_pa * 0.01,
                places=18,
            )

        self.assertEqual(self.sem.state, SEMController.STATE_HIGH_VACUUM)
        self.assertLessEqual(self.sem.chamber_pressure_pa, 2.5e-4)
        self.assertAlmostEqual(self.sem.chamber_pressure_pa, 1.4e-4, places=8)
        self.assertAlmostEqual(self.sem.chamber_pressure_mbar, 1.4e-6, places=10)
        self.assertEqual(self.sem.turbo_rpm, 90000)

        # Immediate pumpdown reaches exact operating ready pressure
        sem2 = SEMController()
        sem2.set_main_power(True)
        sem2.pump_down_chamber(immediate=True)
        self.assertEqual(sem2.state, SEMController.STATE_HIGH_VACUUM)
        self.assertEqual(sem2.chamber_pressure_pa, 1.4e-4)
        self.assertAlmostEqual(sem2.chamber_pressure_mbar, 1.4e-6, places=12)

    def test_door_vacuum_safety_interlock_and_vent_cycle(self):
        """Per control_spec.md §1 Rule 3: door cannot open under vacuum without venting first."""
        self.sem.set_main_power(True)
        self.sem.pump_down_chamber()
        self.sem.energize_electron_beam()
        self.sem.set_detector(SEMController.DET_BSE)
        self.sem.move_stage(tilt=25.0)
        self.assertFalse(self.sem.bse_retracted)

        # Attempting to open chamber door under roughing, high vacuum, or active beam/imaging must raise RuntimeError
        self.sem.start_imaging(SEMController.SCAN_FAST)
        with self.assertRaisesRegex(RuntimeError, "Cannot open chamber door under vacuum"):
            self.sem.close_chamber_door(False)
        self.sem.stop_imaging()
        with self.assertRaisesRegex(RuntimeError, "Cannot open chamber door under vacuum"):
            self.sem.close_chamber_door(False)
        # Vacuum, door, and beam states must remain intact (never silently vented!)
        self.assertTrue(self.sem.chamber_door_closed)
        self.assertEqual(self.sem.chamber_pressure_pa, 1.4e-4)
        self.assertEqual(self.sem.state, SEMController.STATE_BEAM_ACTIVE)
        self.assertTrue(self.sem.column_valve_open)

        # Even if pressure is artificially >= 95,000 Pa while beam/column valve is active, door remains locked
        self.sem.chamber_pressure_pa = 101325.0
        with self.assertRaisesRegex(RuntimeError, "Cannot open chamber door while electron beam is active"):
            self.sem.close_chamber_door(False)
        self.sem.chamber_pressure_pa = 1.4e-4

        # Even if power is cut while chamber is still evacuated, differential pressure locks door
        self.sem.set_main_power(False)
        with self.assertRaisesRegex(RuntimeError, "Cannot open chamber door under vacuum"):
            self.sem.close_chamber_door(False)
        self.assertTrue(self.sem.chamber_door_closed)

        # Also blocked during roughing vacuum phase
        self.sem.set_main_power(True)
        self.sem.vent_chamber()
        self.sem.pump_down_chamber(immediate=False)
        self.assertEqual(self.sem.state, SEMController.STATE_VACUUM_ROUGHING)
        with self.assertRaisesRegex(RuntimeError, "Cannot open chamber door under vacuum"):
            self.sem.close_chamber_door(False)

        # Restore power, vent with dry N2 first, then open door safely
        self.sem.set_main_power(True)
        self.sem.pump_down_chamber()
        self.sem.move_stage(tilt=25.0)
        self.sem.set_detector(SEMController.DET_BSE)
        self.sem.vent_chamber()
        self.assertEqual(self.sem.state, SEMController.STATE_VENTED)
        self.assertEqual(self.sem.chamber_pressure_pa, 101325.0)

        # Now opening door succeeds, retracts BSE, and zeroes stage tilt safely
        self.sem.close_chamber_door(False)
        self.assertFalse(self.sem.chamber_door_closed)
        self.assertTrue(self.sem.bse_retracted)
        self.assertEqual(self.sem.stage_tilt_deg, 0.0)

        # Z and Tilt locked while door is open; pump down also blocked while open
        with self.assertRaises(RuntimeError):
            self.sem.pump_down_chamber()
        with self.assertRaises(RuntimeError):
            self.sem.move_stage(z=15.0)
        with self.assertRaises(RuntimeError):
            self.sem.move_stage(tilt=25.0)

        # Closing door again + pumping returns cleanly to HIGH_VACUUM
        self.sem.close_chamber_door(True)
        self.assertTrue(self.sem.chamber_door_closed)
        self.assertEqual(self.sem.state, SEMController.STATE_STANDBY)
        self.sem.pump_down_chamber()
        self.assertEqual(self.sem.state, SEMController.STATE_HIGH_VACUUM)
        self.assertEqual(self.sem.chamber_pressure_pa, 1.4e-4)
        self.assertEqual(self.sem.turbo_rpm, 90000)

    def test_beam_generation_and_progressive_scanline_capture(self):
        self.sem.set_main_power(True)
        self.sem.pump_down_chamber()
        self.sem.energize_electron_beam()
        self.assertEqual(self.sem.state, SEMController.STATE_BEAM_ACTIVE)
        self.assertTrue(self.sem.column_valve_open)

        # Fast survey mode wraps continuously at 384 lines without archiving a still micrograph
        self.sem.start_imaging(SEMController.SCAN_FAST)
        self.assertEqual(self.sem.state, SEMController.STATE_IMAGING)
        self.assertTrue(self.sem.is_scanning)
        r1 = self.sem.step_scan(192)
        self.assertTrue(r1["is_scanning"])
        self.assertEqual(r1["scan_line"], 192)
        self.assertAlmostEqual(r1["progress"], 0.5, places=4)
        r2 = self.sem.step_scan(192)
        self.assertTrue(r2["is_scanning"])
        self.assertEqual(r2["scan_line"], 0)
        self.assertAlmostEqual(r2["progress"], 1.0, places=4)
        self.assertEqual(len(self.sem.captured_micrographs), 0)

        # Slow Photo 1024x768 progressive scanline sweep captures micrograph at line 768
        self.sem.start_imaging(SEMController.SCAN_SLOW)
        s1 = self.sem.step_scan(256)
        self.assertTrue(s1["is_scanning"])
        self.assertEqual(s1["scan_line"], 256)
        self.assertAlmostEqual(s1["progress"], 256 / 768.0, places=4)
        self.assertEqual(len(self.sem.captured_micrographs), 0)

        s2 = self.sem.step_scan(256)
        self.assertTrue(s2["is_scanning"])
        self.assertEqual(s2["scan_line"], 512)
        self.assertAlmostEqual(s2["progress"], 512 / 768.0, places=4)

        s3 = self.sem.step_scan(256)
        self.assertFalse(s3["is_scanning"])
        self.assertEqual(s3["scan_line"], 768)
        self.assertEqual(s3["progress"], 1.0)
        self.assertEqual(len(self.sem.captured_micrographs), 1)
        rec = self.sem.captured_micrographs[0]
        self.assertEqual(rec["resolution"], "1024x768")
        self.assertEqual(rec["aperture_um"], 30.0)
        self.assertEqual(rec["sputter_thickness_nm"], 5.0)

        # Freezing scan halts imaging and transitions back to BEAM_ACTIVE
        self.sem.start_imaging(SEMController.SCAN_FAST)
        self.sem.stop_imaging()
        self.assertFalse(self.sem.is_scanning)
        self.assertEqual(self.sem.scan_mode, SEMController.SCAN_FROZEN)
        self.assertEqual(self.sem.state, SEMController.STATE_BEAM_ACTIVE)

        # Venting extinguishes beam and closes column valve
        self.sem.vent_chamber()
        self.assertEqual(self.sem.state, SEMController.STATE_VENTED)
        self.assertFalse(self.sem.column_valve_open)

    def test_magnification_probe_current_and_aperture_validation(self):
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
            self.sem.set_voltage(0.01)
        with self.assertRaises(ValueError):
            self.sem.set_voltage(35.0)

        # Probe current bounds: 3.0 pA to 20,000.0 pA
        self.sem.set_probe_current(3.0)
        self.assertEqual(self.sem.probe_current_pa, 3.0)
        self.sem.set_probe_current(20000.0)
        self.assertEqual(self.sem.probe_current_pa, 20000.0)
        with self.assertRaises(ValueError):
            self.sem.set_probe_current(2.9)
        with self.assertRaises(ValueError):
            self.sem.set_probe_current(20000.1)

        # Aperture strip validation: only 30, 60, or 120 um
        for valid_um in (30, 60, 120, 30.0):
            self.sem.set_aperture_um(valid_um)
            self.assertEqual(self.sem.aperture_um, float(valid_um))
        for bad_um in (15, 45, 90, 200, 0, True, False):
            with self.assertRaises(ValueError):
                self.sem.set_aperture_um(bad_um)

    def test_optics_physics_de_broglie_resolution_and_mfp(self):
        self.sem.set_main_power(True)
        # Mean free path at atmospheric pressure vs UHV
        mfp_atm = self.sem.mean_free_path_m()
        self.assertGreater(mfp_atm, 0.0)
        self.assertLess(mfp_atm, 1.0e-6)

        self.sem.pump_down_chamber()
        mfp_uhv = self.sem.mean_free_path_m()
        self.assertAlmostEqual(mfp_uhv, 6.8e-5 / 1.4e-6, places=2)
        self.assertGreater(mfp_uhv, 40.0)

        # Relativistic de Broglie wavelength validation against exact physics
        self.sem.set_voltage(15.0)
        lam_15 = self.sem.de_broglie_wavelength_pm()
        self.assertAlmostEqual(lam_15, 9.9408, delta=0.02)

        self.sem.set_voltage(1.0)
        lam_1 = self.sem.de_broglie_wavelength_pm()
        self.assertAlmostEqual(lam_1, 38.764, delta=0.05)

        self.sem.set_voltage(30.0)
        lam_30 = self.sem.de_broglie_wavelength_pm()
        self.assertAlmostEqual(lam_30, 6.9791, delta=0.02)
        self.assertLess(lam_30, lam_15)
        self.assertLess(lam_15, lam_1)

        # Practical resolution scales with EHT, aperture, defocus, and stigmator
        self.sem.set_voltage(15.0)
        self.sem.set_aperture_um(30)
        self.sem.auto_focus()
        res_30 = self.sem.resolution_nm()
        self.assertAlmostEqual(res_30, 0.80, delta=0.08)

        self.sem.set_aperture_um(120)
        res_120 = self.sem.resolution_nm()
        self.assertGreater(res_120, res_30)
        self.sem.set_aperture_um(30)

        self.sem.set_focus(coarse=80.0, fine=60.0)
        q_defocused = self.sem.compute_optics_quality()
        self.assertGreater(q_defocused["defocus_blur_px"], 0.0)
        self.assertGreater(q_defocused["resolution_nm"], res_30)

        self.sem.auto_focus()
        q_focused = self.sem.compute_optics_quality()
        self.assertEqual(q_focused["defocus_blur_px"], 0.0)
        self.assertEqual(q_focused["resolution_nm"], res_30)

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
        self.sem.set_aperture_um(60)
        self.sem.set_voltage(15.0)

        t = self.sem.get_telemetry()
        for key in (
            "state",
            "chamber_pressure_pa",
            "chamber_pressure_mbar",
            "igp_pressure_pa",
            "igp_pressure_mbar",
            "eht_kv",
            "probe_current_pa",
            "aperture_um",
            "sputter_thickness_nm",
            "de_broglie_wavelength_pm",
            "resolution_nm",
            "mean_free_path_m",
            "optics",
            "eds_peaks",
        ):
            self.assertIn(key, t)

        self.assertAlmostEqual(t["chamber_pressure_mbar"], t["chamber_pressure_pa"] * 0.01, places=12)
        self.assertAlmostEqual(t["igp_pressure_mbar"], t["igp_pressure_pa"] * 0.01, places=16)
        self.assertEqual(t["aperture_um"], 60.0)
        self.assertEqual(t["sputter_thickness_nm"], 5.0)
        self.assertGreater(t["de_broglie_wavelength_pm"], 0.0)
        self.assertGreater(t["resolution_nm"], 0.0)
        self.assertGreater(t["mean_free_path_m"], 0.0)

        csv_text = self.sem.export_glp_csv()
        rows = list(csv.DictReader(io.StringIO(csv_text)))
        self.assertEqual(len(rows), 1)
        row = rows[0]
        self.assertEqual(row["instrument_id"], "ZEISS-GEMINI-500")
        self.assertEqual(row["state"], "HIGH_VACUUM")
        self.assertAlmostEqual(float(row["chamber_pressure_pa"]), 1.4e-4, places=7)
        self.assertAlmostEqual(float(row["chamber_pressure_mbar"]), 1.4e-6, places=9)
        self.assertAlmostEqual(float(row["igp_pressure_pa"]), 2.0e-8, places=11)
        self.assertAlmostEqual(float(row["igp_pressure_mbar"]), 2.0e-10, places=13)
        self.assertEqual(float(row["aperture_um"]), 60.0)
        self.assertEqual(float(row["sputter_thickness_nm"]), 5.0)
        self.assertAlmostEqual(float(row["de_broglie_wavelength_pm"]), t["de_broglie_wavelength_pm"], places=3)
        self.assertAlmostEqual(float(row["resolution_nm"]), t["resolution_nm"], places=2)
        self.assertAlmostEqual(float(row["mean_free_path_m"]), t["mean_free_path_m"], delta=0.1)


if __name__ == "__main__":
    unittest.main()
