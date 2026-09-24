import unittest
from glovebox_controller import GloveBoxController, GloveBoxState

class TestGloveBoxController(unittest.TestCase):
    def setUp(self):
        self.ctrl = GloveBoxController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, GloveBoxState.PURGED)
        self.assertLess(self.ctrl.o2_ppm, 1.0)

    def test_purge_cycle(self):
        self.ctrl.o2_ppm = 10.0
        self.ctrl.start_purge()
        self.assertEqual(self.ctrl.state, GloveBoxState.PURGING)
        self.ctrl.tick(20)
        self.assertLessEqual(self.ctrl.o2_ppm, 0.5)
        self.assertEqual(self.ctrl.state, GloveBoxState.PURGED)

if __name__ == '__main__':
    unittest.main()
