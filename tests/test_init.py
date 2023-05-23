from unittest import TestCase
from mxlpy import clear_repeats, get_unrolled_measure_indices

from tests.util import find_measures


class TestUnroll(TestCase):
    def _cmp_indices(self, indices, exp_indices):
        assert len(indices) == len(exp_indices)
        for ct, exp_idx in enumerate(exp_indices):
            assert exp_idx == indices[ct], f"Difference at position '{ct}'!"
        print(indices)

    def test_unroll_repeats(self):
        measures = find_measures("Repeat")

        indices = get_unrolled_measure_indices(measures)
        first_line = [0, 1, 0, 1, 2, 3, 3, 4]
        second_line = [5, 6, 5, 6, 5, 6, 7, 8, 9, 8, 10]
        expected_indices = (
            first_line
            + second_line
            + [11, 12, 13, 11, 12, 14, 11, 12, 15, 16, 17, 18, 17, 18]
        )

        self._cmp_indices(indices, expected_indices)

    def test_clear_repeats(self):
        self._cmp_indices(clear_repeats([0, 1, 2, 1, 2, 3]), [0, 1, 2, 3])
        self._cmp_indices(clear_repeats([0, 1, 0, 2, 3]), [0, 2, 3])

    def test_unroll_jumps(self):
        measures = find_measures("Coda")
        indices = get_unrolled_measure_indices(measures)
        expected_indices = [0, 1, 0, 1, 2, 3, 4, 5, 6, 3, 4, 7, 8, 9]
        self._cmp_indices(indices, expected_indices)

        measures = find_measures("Coda2")
        indices = get_unrolled_measure_indices(measures)
        expected_indices = [0, 1, 1, 2, 3, 4, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5]
        self._cmp_indices(indices, expected_indices)
