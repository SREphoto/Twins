import unittest
from rotovap_controller import RotovapController, RotovapState

class TestRotovapController(unittest.TestCase):
    def setUp(self):
        self.ctrl = RotovapController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, RotovapState.IDLE)
        self.assertEqual(self.ctrl.current_rpm, 0)
        self.assertTrue(self.ctrl.is_powered)
        self.assertTrue(self.ctrl.is_plugged_in)
        self.assertTrue(self.ctrl.mains_switch_on)

    def test_power_continuity_unplugged(self):
        # Physical continuity rule: unplugging cord cuts power completely
        self.ctrl.set_power_cord_plugged(False)
        self.assertFalse(self.ctrl.is_powered)
        self.assertEqual(self.ctrl.state, RotovapState.UNPOWERED)
        
        # Commands should be rejected when unpowered
        self.ctrl.toggle_rotation(True)
        self.assertFalse(self.ctrl.rotation_enabled)
        self.ctrl.toggle_heater(True)
        self.assertFalse(self.ctrl.heater_enabled)

    def test_mains_switch_toggle(self):
        self.ctrl.set_mains_switch(False)
        self.assertFalse(self.ctrl.is_powered)
        self.assertEqual(self.ctrl.state, RotovapState.UNPOWERED)

        self.ctrl.set_mains_switch(True)
        self.assertTrue(self.ctrl.is_powered)
        self.assertEqual(self.ctrl.state, RotovapState.IDLE)

    def test_emergency_stop(self):
        self.ctrl.toggle_rotation(True)
        self.ctrl.tick(2.0)
        self.assertGreater(self.ctrl.current_rpm, 0)

        self.ctrl.trigger_emergency_stop()
        self.assertEqual(self.ctrl.state, RotovapState.EMERGENCY_STOP)
        self.assertFalse(self.ctrl.rotation_enabled)

        self.ctrl.reset_emergency_stop()
        self.assertEqual(self.ctrl.state, RotovapState.IDLE)

    def test_rotation_acceleration_and_braking(self):
        self.ctrl.set_target_rpm(160)
        self.ctrl.toggle_rotation(True)
        self.assertEqual(self.ctrl.state, RotovapState.ROTATING)

        self.ctrl.tick(2.0) # 40 rpm/s -> should be ~80 rpm
        self.assertGreater(self.ctrl.current_rpm, 50)
        self.assertLessEqual(self.ctrl.current_rpm, 160)

        self.ctrl.tick(3.0)
        self.assertEqual(self.ctrl.current_rpm, 160)

        self.ctrl.toggle_rotation(False)
        self.ctrl.tick(4.0)
        self.assertEqual(self.ctrl.current_rpm, 0)
        self.assertEqual(self.ctrl.state, RotovapState.IDLE)

    def test_motorized_lift_kinematics(self):
        self.assertEqual(self.ctrl.lift_pos_mm, 0.0)
        self.ctrl.set_target_lift_pos(100.0)
        self.assertTrue(self.ctrl.lift_moving)

        self.ctrl.tick(2.0) # 25 mm/s -> 50 mm
        self.assertAlmostEqual(self.ctrl.lift_pos_mm, 50.0, places=1)

        self.ctrl.tick(3.0) # reaches 100 mm
        self.assertAlmostEqual(self.ctrl.lift_pos_mm, 100.0, places=1)
        self.assertFalse(self.ctrl.lift_moving)

    def test_bath_seating_interlock(self):
        # Removing bath from pogo-pin contacts must prevent heating
        self.ctrl.set_bath_seated(False)
        self.ctrl.toggle_heater(True)
        self.assertFalse(self.ctrl.heater_enabled)

        # Re-seating bath allows heater activation
        self.ctrl.set_bath_seated(True)
        self.ctrl.toggle_heater(True)
        self.assertTrue(self.ctrl.heater_enabled)
        self.assertEqual(self.ctrl.state, RotovapState.HEATING)

        # Lifting bath while heating trips fault
        self.ctrl.set_bath_seated(False)
        self.assertEqual(self.ctrl.state, RotovapState.FAULT_UNSEATED_BATH)
        self.assertFalse(self.ctrl.heater_enabled)

    def test_bath_heating_and_thermal_limits(self):
        self.ctrl.set_target_bath_temp(50.0)
        self.ctrl.toggle_heater(True)
        initial_temp = self.ctrl.bath_temp_c

        self.ctrl.tick(5.0)
        self.assertGreater(self.ctrl.bath_temp_c, initial_temp)

        # Thermal runaway protection
        self.ctrl.bath_temp_c = 186.0
        self.ctrl.tick(0.5)
        self.assertEqual(self.ctrl.state, RotovapState.FAULT_OVERTEMP)
        self.assertFalse(self.ctrl.heater_enabled)

    def test_vacuum_pump_and_aeration(self):
        self.ctrl.set_target_vacuum(150.0)
        self.ctrl.toggle_vacuum_pump(True)
        self.ctrl.tick(5.0)
        self.assertLess(self.ctrl.vacuum_mbar, 1000.0)

        # Aeration valve opens and rapidly returns to atmospheric pressure
        self.ctrl.aerate()
        self.assertEqual(self.ctrl.state, RotovapState.AERATING)
        self.ctrl.tick(5.0)
        self.assertAlmostEqual(self.ctrl.vacuum_mbar, 1013.25, delta=5.0)

    def test_antoine_boiling_point_calculation(self):
        # For ethanol: at 1013 mbar boiling point should be ~78°C
        bp_atm = self.ctrl.get_boiling_temp_c(1013.25)
        self.assertAlmostEqual(bp_atm, 78.4, delta=2.0)

        # At 175 mbar boiling point drops to ~40°C (Delta 20 rule target)
        bp_vac = self.ctrl.get_boiling_temp_c(175.0)
        self.assertAlmostEqual(bp_vac, 40.0, delta=2.5)

    def test_evaporating_state_and_distillate_transfer(self):
        # Configure standard evaporation conditions:
        # Bath at 45°C, vacuum at 175 mbar (bp ~40°C), lift lowered, rotation active
        self.ctrl.set_target_vacuum(175.0)
        self.ctrl.vacuum_mbar = 175.0
        self.ctrl.bath_temp_c = 45.0
        self.ctrl.set_target_lift_pos(120.0)
        self.ctrl.lift_pos_mm = 120.0
        self.ctrl.toggle_rotation(True)
        self.ctrl.current_rpm = 120.0

        initial_evap = self.ctrl.evap_flask_vol_ml
        initial_rec = self.ctrl.rec_flask_vol_ml

        self.ctrl.tick(2.0)
        self.assertEqual(self.ctrl.state, RotovapState.EVAPORATING)
        self.assertLess(self.ctrl.evap_flask_vol_ml, initial_evap)
        self.assertGreater(self.ctrl.rec_flask_vol_ml, initial_rec)
        self.assertGreater(self.ctrl.distillate_rate_ml_min, 0)

    def test_telemetry_output(self):
        data = self.ctrl.get_telemetry()
        self.assertIn("state", data)
        self.assertIn("is_plugged_in", data)
        self.assertIn("current_rpm", data)
        self.assertIn("bath_temp_c", data)
        self.assertIn("vacuum_mbar", data)
        self.assertIn("distillate_rate_ml_min", data)

if __name__ == '__main__':
    unittest.main()
