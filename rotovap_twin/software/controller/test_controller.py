import unittest
from rotovap_controller import RotovapController, RotovapState

class TestRotovapController(unittest.TestCase):
    def setUp(self):
        self.ctrl = RotovapController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, RotovapState.IDLE)
        self.assertEqual(self.ctrl.current_rpm, 0)

    def test_rotation_toggle(self):
        self.ctrl.toggle_rotation(True)
        self.assertEqual(self.ctrl.state, RotovapState.ROTATING)
        self.ctrl.tick(5)
        self.assertGreater(self.ctrl.current_rpm, 0)

    def test_evaporating_state(self):
        self.ctrl.set_lift_height(100)
        self.ctrl.toggle_rotation(True)
        self.ctrl.toggle_heater(True)
        self.assertEqual(self.ctrl.state, RotovapState.EVAPORATING)

if __name__ == '__main__':
    unittest.main()
