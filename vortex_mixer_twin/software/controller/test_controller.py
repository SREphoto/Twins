import unittest
from vortex_controller import VortexMixerController, VortexMixerState

class TestVortexMixerController(unittest.TestCase):
    def setUp(self):
        self.ctrl = VortexMixerController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, VortexMixerState.IDLE)

    def test_touch_activation(self):
        self.ctrl.set_touch_pressed(True)
        self.assertEqual(self.ctrl.state, VortexMixerState.RUNNING_TOUCH)

    def test_continuous_mode(self):
        self.ctrl.set_mode("CONTINUOUS")
        self.assertEqual(self.ctrl.state, VortexMixerState.RUNNING_CONTINUOUS)

if __name__ == '__main__':
    unittest.main()
