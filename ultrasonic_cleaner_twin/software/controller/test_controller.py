"""
Unit tests for UltrasonicController
Validates initialization, dual-frequency sweep (40/80 kHz), power modulation,
degas pulsed cavitation, heating loop with over-temp cutoff, dry-run float interlocks,
pause/resume state flow, fault clearing, and telemetry export.
"""

import unittest
from ultrasonic_controller import UltrasonicController, CleanerState


class TestUltrasonicController(unittest.TestCase):
    def setUp(self):
        self.ctrl = UltrasonicController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, CleanerState.IDLE)
        self.assertTrue(self.ctrl.liquid_level_ok)
        self.assertEqual(self.ctrl.frequency_khz, 40)
        self.assertEqual(self.ctrl.power_percent, 100)
        self.assertFalse(self.ctrl.heater_on)
        self.assertFalse(self.ctrl.transducer_active)

    def test_start_cleaning_normal(self):
        res = self.ctrl.start_cleaning(degas=False)
        self.assertTrue(res)
        self.assertEqual(self.ctrl.state, CleanerState.CLEANING)
        self.assertTrue(self.ctrl.transducer_active)

    def test_dry_run_interlock(self):
        self.ctrl.set_liquid_level(False)
        res = self.ctrl.start_cleaning()
        self.assertFalse(res)
        self.assertEqual(self.ctrl.state, CleanerState.FAULT_DRY_RUN)
        self.assertFalse(self.ctrl.transducer_active)

    def test_timer_countdown(self):
        self.ctrl.set_timer(10)
        self.ctrl.start_cleaning()
        self.ctrl.tick(5)
        self.assertEqual(self.ctrl.remaining_sec, 5)
        self.ctrl.tick(6)
        self.assertEqual(self.ctrl.remaining_sec, 0)
        self.assertEqual(self.ctrl.state, CleanerState.IDLE)
        self.assertFalse(self.ctrl.transducer_active)

    def test_dual_frequency_sweep(self):
        self.assertTrue(self.ctrl.set_frequency(80))
        self.assertEqual(self.ctrl.frequency_khz, 80)
        self.assertTrue(self.ctrl.set_frequency(40))
        self.assertEqual(self.ctrl.frequency_khz, 40)
        # Invalid frequency rejected
        self.assertFalse(self.ctrl.set_frequency(120))
        self.assertEqual(self.ctrl.frequency_khz, 40)

    def test_power_modulation(self):
        self.assertTrue(self.ctrl.set_power(70))
        self.assertEqual(self.ctrl.power_percent, 70)
        self.assertTrue(self.ctrl.set_power(100))
        self.assertEqual(self.ctrl.power_percent, 100)
        # Out of bounds
        self.assertFalse(self.ctrl.set_power(5))
        self.assertEqual(self.ctrl.power_percent, 100)

    def test_degas_pulsed_cavitation(self):
        self.ctrl.start_cleaning(degas=True)
        self.assertEqual(self.ctrl.state, CleanerState.DEGAS)
        self.assertTrue(self.ctrl.degas_mode)

        # First 5 seconds of period: active (ON phase)
        self.ctrl.tick(4.0)
        self.assertTrue(self.ctrl.transducer_active)

        # At 7 seconds into 8-second cycle: inactive (OFF pause phase)
        self.ctrl.tick(3.0)  # total 7.0s
        self.assertFalse(self.ctrl.transducer_active)

        # Past 8 seconds: wraps around to ON phase
        self.ctrl.tick(2.0)  # total 9.0s -> wrapped to 1.0s
        self.assertTrue(self.ctrl.transducer_active)

    def test_heating_and_overtemp_cutoff(self):
        self.assertTrue(self.ctrl.toggle_heater(True))
        self.assertTrue(self.ctrl.heater_on)

        # Heat up to target
        self.ctrl.set_target_temp(50.0)
        self.ctrl.tick(10.0)
        self.assertGreater(self.ctrl.current_temp, 22.0)

        # Trigger over-temp safety
        self.ctrl.current_temp = 85.0
        self.ctrl.tick(1.0)
        self.assertEqual(self.ctrl.state, CleanerState.FAULT_OVERTEMP)
        self.assertFalse(self.ctrl.heater_on)

    def test_dry_run_trips_during_active_cleaning(self):
        self.ctrl.start_cleaning()
        self.assertEqual(self.ctrl.state, CleanerState.CLEANING)

        # Liquid drained while running
        self.ctrl.set_liquid_level(False)
        self.assertEqual(self.ctrl.state, CleanerState.FAULT_DRY_RUN)
        self.assertFalse(self.ctrl.transducer_active)

    def test_pause_and_resume(self):
        self.ctrl.set_timer(60)
        self.ctrl.start_cleaning()
        self.ctrl.tick(10)
        self.assertEqual(self.ctrl.remaining_sec, 50)

        self.assertTrue(self.ctrl.pause())
        self.assertEqual(self.ctrl.state, CleanerState.PAUSED)
        self.assertFalse(self.ctrl.transducer_active)

        # Ticking while paused should not advance timer
        self.ctrl.tick(10)
        self.assertEqual(self.ctrl.remaining_sec, 50)

        self.assertTrue(self.ctrl.resume())
        self.assertEqual(self.ctrl.state, CleanerState.CLEANING)
        self.assertTrue(self.ctrl.transducer_active)

    def test_acknowledge_fault(self):
        self.ctrl.set_liquid_level(False)
        self.ctrl.start_cleaning()
        self.assertEqual(self.ctrl.state, CleanerState.FAULT_DRY_RUN)

        # Cannot clear while level still bad
        self.assertFalse(self.ctrl.acknowledge_fault())
        self.assertEqual(self.ctrl.state, CleanerState.FAULT_DRY_RUN)

        # Restoring level allows clearing fault
        self.ctrl.set_liquid_level(True)
        self.assertTrue(self.ctrl.acknowledge_fault())
        self.assertEqual(self.ctrl.state, CleanerState.IDLE)

    def test_telemetry_packet(self):
        telem = self.ctrl.get_telemetry()
        self.assertIn("state", telem)
        self.assertIn("current_temp_c", telem)
        self.assertIn("target_temp_c", telem)
        self.assertIn("timer_sec", telem)
        self.assertIn("remaining_sec", telem)
        self.assertIn("power_percent", telem)
        self.assertIn("frequency_khz", telem)
        self.assertIn("transducer_active", telem)
    def test_dry_run_trips_during_idle_preheating(self):
        # Pre-heating while IDLE
        self.ctrl.toggle_heater(True)
        self.assertTrue(self.ctrl.heater_on)
        self.assertEqual(self.ctrl.state, CleanerState.IDLE)

        # Bath is emptied
        self.ctrl.set_liquid_level(False)
        self.assertEqual(self.ctrl.state, CleanerState.FAULT_DRY_RUN)
        self.assertFalse(self.ctrl.heater_on)

    def test_cavitation_overtemp_cutoff_without_heater(self):
        # Heater OFF, cleaning active
        self.ctrl.start_cleaning()
        self.assertFalse(self.ctrl.heater_on)
        self.assertTrue(self.ctrl.transducer_active)

        # Hot liquid or intense cavitation reaches limit
        self.ctrl.current_temp = 81.0
        self.ctrl.tick(1.0)
        self.assertEqual(self.ctrl.state, CleanerState.FAULT_OVERTEMP)
        self.assertFalse(self.ctrl.transducer_active)


if __name__ == '__main__':
    unittest.main()

