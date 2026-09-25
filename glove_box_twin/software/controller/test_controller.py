"""
Unit tests for GloveBoxController
Validates initialization, purge cycles, differential pressure loop,
foot pedal negative pressure assist, automated antechamber cycling,
door interlocks, and fault limit detection.
"""

import unittest
from glovebox_controller import GloveBoxController, GloveBoxState


class TestGloveBoxController(unittest.TestCase):
    def setUp(self):
        self.ctrl = GloveBoxController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, GloveBoxState.PURGED)
        self.assertLess(self.ctrl.o2_ppm, 1.0)
        self.assertLess(self.ctrl.h2o_ppm, 1.0)
        self.assertEqual(self.ctrl.pressure_mbar, 3.5)
        self.assertEqual(self.ctrl.gas_type, "Argon")

    def test_purge_cycle(self):
        self.ctrl.o2_ppm = 10.0
        self.ctrl.start_purge()
        self.assertEqual(self.ctrl.state, GloveBoxState.PURGING)
        self.ctrl.tick(20)
        self.assertLessEqual(self.ctrl.o2_ppm, 0.5)
        self.assertEqual(self.ctrl.state, GloveBoxState.PURGED)

    def test_gas_type_selection(self):
        self.assertTrue(self.ctrl.set_gas_type("Nitrogen"))
        self.assertEqual(self.ctrl.gas_type, "Nitrogen")
        self.assertFalse(self.ctrl.set_gas_type("Helium"))
        self.assertEqual(self.ctrl.gas_type, "Nitrogen")

    def test_pressure_setpoint_limits(self):
        self.assertTrue(self.ctrl.set_pressure_setpoint(4.0))
        self.assertEqual(self.ctrl.pressure_setpoint_mbar, 4.0)
        self.assertFalse(self.ctrl.set_pressure_setpoint(10.0))  # Exceeds max allowable
        self.assertEqual(self.ctrl.pressure_setpoint_mbar, 4.0)

    def test_foot_pedal_negative_pressure(self):
        self.ctrl.press_foot_pedal()
        self.assertTrue(self.ctrl.foot_pedal_active)
        for _ in range(5):
            self.ctrl.tick(1.0)
        self.assertLess(self.ctrl.pressure_mbar, 0.0)

        self.ctrl.release_foot_pedal()
        self.assertFalse(self.ctrl.foot_pedal_active)
        for _ in range(10):
            self.ctrl.tick(1.0)
        self.assertGreater(self.ctrl.pressure_mbar, 2.5)

    def test_single_antechamber_evac(self):
        self.assertTrue(self.ctrl.evacuate_antechamber())
        self.assertEqual(self.ctrl.state, GloveBoxState.ANTECHAMBER_EVAC)
        self.ctrl.tick(6.0)
        self.assertLessEqual(self.ctrl.antechamber_vacuum_mbar, 1.0)
        self.assertEqual(self.ctrl.state, GloveBoxState.PURGED)

    def test_automated_3_cycle_antechamber_sequence(self):
        self.assertTrue(self.ctrl.start_antechamber_sequence(cycles=2))
        self.assertEqual(self.ctrl.state, GloveBoxState.ANTECHAMBER_EVAC)
        # Tick through evac 1
        self.ctrl.tick(6.0)
        self.assertEqual(self.ctrl.state, GloveBoxState.ANTECHAMBER_REFILL)
        # Tick through refill 1
        self.ctrl.tick(5.0)
        self.assertEqual(self.ctrl.state, GloveBoxState.ANTECHAMBER_EVAC)
        self.assertEqual(self.ctrl.antechamber_cycles_completed, 1)
        # Tick through evac 2
        self.ctrl.tick(6.0)
        self.assertEqual(self.ctrl.state, GloveBoxState.ANTECHAMBER_REFILL)
        # Tick through refill 2
        self.ctrl.tick(5.0)
        self.assertEqual(self.ctrl.antechamber_cycles_completed, 2)
        self.assertEqual(self.ctrl.state, GloveBoxState.PURGED)

    def test_outer_inner_door_interlock(self):
        # Open outer door
        self.assertTrue(self.ctrl.open_outer_door())
        # Inner door cannot open while outer door is open
        self.assertFalse(self.ctrl.open_inner_door())
        self.ctrl.close_outer_door()

        # Cannot open inner door if antechamber is under vacuum
        self.ctrl.antechamber_vacuum_mbar = 50.0
        self.assertFalse(self.ctrl.open_inner_door())

        # Equalize to atmospheric
        self.ctrl.antechamber_vacuum_mbar = 1013.0
        self.assertTrue(self.ctrl.open_inner_door())
        # Outer door cannot open while inner door is open
        self.assertFalse(self.ctrl.open_outer_door())
        self.ctrl.close_inner_door()

    def test_purge_door_interlock(self):
        # Force both doors open
        self.ctrl.antechamber_outer_door_open = True
        self.ctrl.antechamber_inner_door_open = True
        self.assertFalse(self.ctrl.start_purge())
        self.assertNotEqual(self.ctrl.state, GloveBoxState.PURGING)

    def test_o2_high_alarm(self):
        self.ctrl.o2_ppm = 8.0  # max 1.0 + 5.0 = 6.0 threshold
        self.ctrl.tick(1.0)
        self.assertEqual(self.ctrl.state, GloveBoxState.FAULT_O2_ALARM)
        self.assertIn("HIGH O2 ALARM", self.ctrl.alarm_message)

    def test_overpressure_fault(self):
        self.ctrl.pressure_mbar = 9.5
        self.ctrl.tick(1.0)
        self.assertEqual(self.ctrl.state, GloveBoxState.FAULT_OVERPRESSURE)
        self.assertTrue(self.ctrl.vent_solenoid_open)

    def test_outer_door_opens_resets_antechamber_purge(self):
        # Simulate completed cycles
        self.ctrl.antechamber_cycles_completed = 3
        self.ctrl.open_outer_door()
        self.assertEqual(self.ctrl.antechamber_cycles_completed, 0)
        self.ctrl.close_outer_door()

        # Opening inner door without new purge cycles triggers leak ingress
        initial_o2 = self.ctrl.o2_ppm
        self.ctrl.open_inner_door()
        self.ctrl.tick(1.0)
        self.assertGreater(self.ctrl.o2_ppm, initial_o2)

    def test_telemetry_packet(self):
        telem = self.ctrl.get_telemetry()
        self.assertIn("state", telem)
        self.assertIn("o2_ppm", telem)
        self.assertIn("h2o_ppm", telem)
        self.assertIn("pressure_mbar", telem)
        self.assertIn("antechamber", telem)
    def test_acknowledge_alarms_requires_safe_pressure(self):
        self.ctrl.pressure_mbar = 9.5
        self.ctrl.tick(1.0)
        self.assertEqual(self.ctrl.state, GloveBoxState.FAULT_OVERPRESSURE)

        # Attempt to acknowledge while pressure is still 8.5 mbar
        self.ctrl.acknowledge_alarms()
        self.assertEqual(self.ctrl.state, GloveBoxState.FAULT_OVERPRESSURE)

        # Safe pressure allows reset
        self.ctrl.pressure_mbar = 3.5
        self.ctrl.acknowledge_alarms()
        self.assertEqual(self.ctrl.state, GloveBoxState.PURGED)


if __name__ == '__main__':
    unittest.main()

