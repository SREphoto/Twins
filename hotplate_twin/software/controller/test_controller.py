import unittest
from hotplate_controller import HotplateController, HotplateState

class TestHotplateController(unittest.TestCase):
    def setUp(self):
        self.ctrl = HotplateController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, HotplateState.STANDBY)
        self.assertEqual(self.ctrl.current_rpm, 0.0)
        self.assertEqual(self.ctrl.plate_temp_c, 22.0)

    def test_heating_and_stirring_transitions(self):
        self.ctrl.start_heating()
        self.assertEqual(self.ctrl.state, HotplateState.HEATING)

        self.ctrl.start_stirring()
        self.assertEqual(self.ctrl.state, HotplateState.RUN_BOTH)

        self.ctrl.stop_heating()
        self.assertEqual(self.ctrl.state, HotplateState.STIRRING)

        self.ctrl.stop_stirring()
        self.assertEqual(self.ctrl.state, HotplateState.STANDBY)

    def test_speed_ramp(self):
        self.ctrl.set_rpm = 500
        self.ctrl.start_stirring()
        for _ in range(30):
            self.ctrl.tick(0.1)
        self.assertAlmostEqual(self.ctrl.current_rpm, 500.0, delta=10.0)

    def test_overtemp_cutoff(self):
        self.ctrl.safe_temp_c = 100.0
        self.ctrl.set_temp_c = 150.0
        self.ctrl.plate_temp_c = 99.0
        self.ctrl.start_heating()
        self.ctrl.tick(1.0)
        self.assertEqual(self.ctrl.state, HotplateState.FAULT_OVERTEMP)

if __name__ == '__main__':
    unittest.main()
