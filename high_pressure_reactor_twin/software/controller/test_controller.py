"""
Unit tests for ReactorController
Validates initialization, PID heating dynamics, motor tachometer closed-loop ramp,
Gay-Lussac gas thermal pressure response, gas inlet pressurization, venting valve,
solenoid cooling, burst disc mechanical rupture, HTM over-temp cut-out,
thermocouple break detection, and telemetry export.
"""

import unittest
from reactor_controller import ReactorController, ReactorState


class TestReactorController(unittest.TestCase):
    def setUp(self):
        self.ctrl = ReactorController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, ReactorState.IDLE)
        self.assertEqual(self.ctrl.current_pressure_bar, 1.0)
        self.assertEqual(self.ctrl.current_temp_c, 22.0)
        self.assertEqual(self.ctrl.current_rpm, 0.0)

    def test_heating_and_stirring(self):
        self.assertTrue(self.ctrl.toggle_heater(True))
        self.assertTrue(self.ctrl.toggle_stirrer(True))
        self.assertEqual(self.ctrl.state, ReactorState.RUNNING)

    def test_thermal_pressure_rise(self):
        self.ctrl.toggle_heater(True)
        self.ctrl.tick(10.0)
        self.assertGreater(self.ctrl.current_temp_c, 22.0)
        self.assertGreater(self.ctrl.current_pressure_bar, 1.0)

    def test_burst_disc_overpressure_fault(self):
        self.ctrl.current_pressure_bar = 260.0
        self.ctrl.tick(1.0)
        self.assertEqual(self.ctrl.state, ReactorState.FAULT_OVERPRESSURE)
        self.assertFalse(self.ctrl.heater_on)
        self.assertTrue(self.ctrl.burst_disc_ruptured)

    def test_motor_speed_regulation(self):
        self.ctrl.set_target_rpm(800)
        self.ctrl.toggle_stirrer(True)
        self.assertEqual(self.ctrl.state, ReactorState.STIRRING)
        self.ctrl.tick(4.0)
        self.assertGreater(self.ctrl.current_rpm, 500.0)
        self.assertGreater(self.ctrl.motor_torque_nm, 0.0)
        self.assertGreater(self.ctrl.motor_current_amps, 0.25)

    def test_gas_inlet_pressurization(self):
        self.ctrl.toggle_gas_inlet(True)
        self.ctrl.tick(3.0)
        self.assertGreater(self.ctrl.current_pressure_bar, 40.0)
        self.ctrl.toggle_gas_inlet(False)
        p_held = self.ctrl.current_pressure_bar
        self.ctrl.tick(2.0)
        self.assertAlmostEqual(self.ctrl.current_pressure_bar, p_held, places=1)

    def test_vent_valve_depressurization(self):
        self.ctrl.current_pressure_bar = 50.0
        self.ctrl.charge_pressure_bar = 50.0
        self.ctrl.toggle_vent_valve(True)
        self.assertEqual(self.ctrl.state, ReactorState.VENTING)
        self.ctrl.tick(3.0)
        self.assertLess(self.ctrl.current_pressure_bar, 5.0)

    def test_solenoid_cooling_loop(self):
        self.ctrl.current_temp_c = 180.0
        self.ctrl.toggle_cooling(True)
        self.ctrl.tick(5.0)
        self.assertLess(self.ctrl.current_temp_c, 180.0)

    def test_htm_over_temp_cutout(self):
        self.ctrl.current_temp_c = 365.0  # max_temp_c (350) + 15
        self.ctrl.tick(1.0)
        self.assertEqual(self.ctrl.state, ReactorState.FAULT_OVERTEMP)
        self.assertFalse(self.ctrl.heater_on)

    def test_thermocouple_break_safety(self):
        self.ctrl.toggle_heater(True)
        self.ctrl.trigger_tc_fault(True)
        self.assertEqual(self.ctrl.state, ReactorState.FAULT_TC_BREAK)
        self.assertFalse(self.ctrl.heater_on)
        self.assertFalse(self.ctrl.toggle_heater(True))  # Cannot re-enable while fault latched

    def test_telemetry_packet(self):
        telem = self.ctrl.get_telemetry()
        self.assertIn("state", telem)
        self.assertIn("pv_temp_c", telem)
        self.assertIn("sv_temp_c", telem)
        self.assertIn("pressure_bar", telem)
        self.assertIn("stirrer_rpm", telem)
        self.assertIn("heater_power_pct", telem)
        self.assertIn("valves", telem)
        self.assertIn("safety", telem)

    def test_temperature_setpoint_bounds(self):
        self.assertTrue(self.ctrl.set_target_temp(250.0))
        self.assertEqual(self.ctrl.target_temp_c, 250.0)
        self.assertFalse(self.ctrl.set_target_temp(500.0))  # Exceeds max_temp_c
        self.assertEqual(self.ctrl.target_temp_c, 250.0)

    def test_burst_disc_rupture_prevents_repressurization(self):
        # Trigger rupture
        self.ctrl.current_pressure_bar = 260.0
        self.ctrl.tick(1.0)
        self.assertTrue(self.ctrl.burst_disc_ruptured)
        self.assertEqual(self.ctrl.current_pressure_bar, 1.0)

        # Attempt to inject gas through inlet valve
        self.ctrl.toggle_gas_inlet(True)
        self.ctrl.tick(5.0)
        # Pressure must remain at 1.0 bar (exhausted to atmosphere)
        self.assertEqual(self.ctrl.current_pressure_bar, 1.0)

    def test_operating_limit_overpressure_fault(self):
        # Pressure exceeds max_pressure_bar (200 bar) but below burst disc (250 bar)
        self.ctrl.toggle_heater(True)
        self.ctrl.current_pressure_bar = 210.0
        self.ctrl.charge_pressure_bar = 210.0
        self.ctrl.tick(1.0)
        self.assertEqual(self.ctrl.state, ReactorState.FAULT_OVERPRESSURE)
        self.assertFalse(self.ctrl.heater_on)
        self.assertFalse(self.ctrl.burst_disc_ruptured)  # Disc intact

        # Vented below MAWP, alarm can be acknowledged
        self.ctrl.current_pressure_bar = 150.0
        self.ctrl.charge_pressure_bar = 150.0
        self.assertTrue(self.ctrl.acknowledge_alarms())
        self.assertEqual(self.ctrl.state, ReactorState.IDLE)


if __name__ == '__main__':
    unittest.main()


