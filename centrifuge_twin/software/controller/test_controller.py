#!/usr/bin/env python3
"""Unit tests for CentrifugeController — run: python3 test_controller.py"""

from __future__ import annotations

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from centrifuge_controller import (
    CentrifugeController,
    State,
    DisplayMode,
    rpm_to_rcf,
    clamp_rpm,
)


def assert_eq(a, b, msg=""):
    if a != b:
        raise AssertionError(f"{msg}: {a!r} != {b!r}")


def assert_true(cond, msg=""):
    if not cond:
        raise AssertionError(msg)


def test_rcf_at_max():
    rcf = rpm_to_rcf(15000)
    assert_true(20000 < rcf < 22000, f"RCF out of range: {rcf}")


def test_cannot_start_lid_open():
    c = CentrifugeController()
    assert_eq(c.state, State.LID_OPEN)
    c.press_start()
    assert_eq(c.state, State.ERR_LID)


def test_full_run_cycle():
    c = CentrifugeController(time_set_s=5, rpm_set=3000, auto_open_on_end=False)
    c.close_lid()
    assert_eq(c.state, State.READY)
    c.press_start()
    assert_eq(c.state, State.ACCEL)
    # accelerate
    for _ in range(500):
        c.tick(0.05)
        if c.state == State.RUN:
            break
    assert_eq(c.state, State.RUN)
    # run out timer
    for _ in range(200):
        c.tick(0.05)
        if c.state != State.RUN:
            break
    assert_true(c.state in (State.DECEL, State.END, State.READY), c.state)
    for _ in range(500):
        c.tick(0.05)
        if c.state == State.READY:
            break
    assert_eq(c.state, State.READY)
    assert_eq(c.rpm_actual, 0.0)


def test_stop_mid_run():
    c = CentrifugeController(rpm_set=6000, auto_open_on_end=False)
    c.close_lid()
    c.press_start()
    for _ in range(100):
        c.tick(0.1)
    c.press_stop()
    assert_eq(c.state, State.DECEL)
    for _ in range(300):
        c.tick(0.1)
    assert_true(c.rpm_actual == 0.0)
    assert_eq(c.state, State.READY)


def test_open_rejected_while_running():
    c = CentrifugeController(rpm_set=5000)
    c.close_lid()
    c.press_start()
    for _ in range(50):
        c.tick(0.1)
    assert_true(c.rpm_actual > 100)
    c.press_open()
    assert_true(not c.lid_open)


def test_imbalance():
    c = CentrifugeController(rpm_set=4000, auto_open_on_end=False)
    c.close_lid()
    c.press_start()
    for _ in range(100):
        c.tick(0.1)
    c.inject_imbalance()
    assert_eq(c.state, State.DECEL)
    for _ in range(300):
        c.tick(0.1)
    assert_eq(c.state, State.ERR_IMBALANCE)


def test_rpm_rcf_toggle():
    c = CentrifugeController()
    c.toggle_rpm_rcf()
    assert_eq(c.display_mode, DisplayMode.RCF)
    c.toggle_rpm_rcf()
    assert_eq(c.display_mode, DisplayMode.RPM)


def test_nudge_rpm():
    c = CentrifugeController()
    c.close_lid()
    c.focus_speed()
    before = c.rpm_set
    c.nudge(+1)
    assert_eq(c.rpm_set, clamp_rpm(before + 50))


def test_short_spin():
    c = CentrifugeController(rpm_set=2000, auto_open_on_end=False)
    c.close_lid()
    c.short_down()
    assert_eq(c.state, State.ACCEL)
    for _ in range(100):
        c.tick(0.1)
    c.short_up()
    assert_eq(c.state, State.DECEL)


import unittest

class TestCentrifugeController(unittest.TestCase):
    def test_rcf_at_max(self):
        test_rcf_at_max()

    def test_cannot_start_lid_open(self):
        test_cannot_start_lid_open()

    def test_full_run_cycle(self):
        test_full_run_cycle()

    def test_stop_mid_run(self):
        test_stop_mid_run()

    def test_open_rejected_while_running(self):
        test_open_rejected_while_running()

    def test_imbalance(self):
        test_imbalance()

    def test_rpm_rcf_toggle(self):
        test_rpm_rcf_toggle()

    def test_nudge_rpm(self):
        test_nudge_rpm()

    def test_short_spin(self):
        test_short_spin()


def main():
    unittest.main()


if __name__ == "__main__":
    unittest.main()

