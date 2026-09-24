#!/usr/bin/env python3
"""Tests for samples + tube handling."""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from centrifuge_controller import CentrifugeController, State
from samples import MATERIALS, LabBench


def assert_true(c, m=""):
    if not c:
        raise AssertionError(m)


def test_blood_separates_after_run():
    c = CentrifugeController(
        rpm_set=5000,
        time_set_s=90,
        auto_open_on_end=False,
        check_balance_on_start=False,
    )
    # lid already open at init
    ids = c.load_balanced_demo("whole_blood")
    assert_true(len(ids) == 2)
    for tid in ids:
        assert_true(not c.lab.tubes[tid].separated)
    c.close_lid()
    c.press_start()
    for _ in range(2000):
        c.tick(0.1)
        if c.state == State.READY and c.rpm_actual == 0:
            break
    assert_true(c.state in (State.READY, State.END), c.state)
    for tid in ids:
        assert_true(c.lab.tubes[tid].separated, f"{tid} not separated")
        layers = c.lab.tubes[tid].layers()
        assert_true(len(layers) >= 3, layers)
    assert_true(len(c.last_separation_changes) >= 1)


def test_unload_to_rack():
    c = CentrifugeController(check_balance_on_start=False)
    ids = c.load_balanced_demo("bacterial_culture")
    tid = ids[0]
    slot = c.lab.tubes[tid].slot
    c.unload_rotor_slot(slot)
    assert_true(c.lab.tubes[tid].location.value == "RACK")
    assert_true(tid not in [x for x in c.lab.rotor if x])


def test_cannot_handle_tubes_while_running():
    c = CentrifugeController(
        rpm_set=3000, time_set_s=600, auto_open_on_end=False, check_balance_on_start=False
    )
    c.load_balanced_demo("water_buffer")
    c.close_lid()
    c.press_start()
    for _ in range(50):
        c.tick(0.1)
    try:
        c.unload_all_to_rack()
        raise AssertionError("should have blocked")
    except RuntimeError:
        pass


def test_pcr_min_conditions():
    mat = MATERIALS["pcr_mix"]
    bench = LabBench()
    # clear rack seed then place one tube in rotor manually
    tid = bench.rack[0]
    bench.load_rack_to_rotor(0, 0)
    bench.set_material(tid, "pcr_mix")
    tube = bench.tubes[tid]
    # too weak
    tube.apply_run_result(peak_rcf=10, spun_time_s=1, peak_rpm=100)
    assert_true(not tube.separated)
    tube.apply_run_result(
        peak_rcf=mat.min_rcf, spun_time_s=mat.min_time_s, peak_rpm=mat.min_rpm
    )
    assert_true(tube.separated)


def test_remix():
    c = CentrifugeController(check_balance_on_start=False, auto_open_on_end=False)
    ids = c.load_balanced_demo("ink_suspension")
    for tid in ids:
        c.lab.tubes[tid].separated = True
    c.remix_tube(ids[0])
    assert_true(not c.lab.tubes[ids[0]].separated)


def main():
    tests = [
        test_blood_separates_after_run,
        test_unload_to_rack,
        test_cannot_handle_tubes_while_running,
        test_pcr_min_conditions,
        test_remix,
    ]
    failed = 0
    for t in tests:
        try:
            t()
            print(f"  OK  {t.__name__}")
        except Exception as e:
            failed += 1
            print(f"  FAIL {t.__name__}: {e}")
    print(f"\n{len(tests) - failed}/{len(tests)} passed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
