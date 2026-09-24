import unittest
from balance_controller import BalanceController, BalanceState

class TestBalanceController(unittest.TestCase):
    def setUp(self):
        self.ctrl = BalanceController()

    def test_initial_state(self):
        self.assertEqual(self.ctrl.state, BalanceState.IDLE)
        self.assertEqual(self.ctrl.displayed_weight_g, 0.0)

    def test_weighing_and_tare(self):
        self.ctrl.place_sample(15.4321)
        self.ctrl.tick()
        self.assertAlmostEqual(self.ctrl.displayed_weight_g, 15.4321, places=4)
        self.ctrl.tare()
        self.ctrl.tick()
        self.assertAlmostEqual(self.ctrl.displayed_weight_g, 0.0, places=4)

    def test_overload_protection(self):
        res = self.ctrl.place_sample(300.0)
        self.assertFalse(res)
        self.assertEqual(self.ctrl.state, BalanceState.FAULT_OVERLOAD)

if __name__ == '__main__':
    unittest.main()
