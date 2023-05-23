from unittest import TestCase
from mxlpy import get_unrolled_measure_indices
import xml.etree.ElementTree as ET

from tests.util import TestPaths


class TestUnroll(TestCase):
    def _find_measures(self, name: str):
        unroll_test_file = TestPaths.TEST_DATA_PATH / f"{name}.musicxml"
        assert unroll_test_file.exists()
        tree = ET.parse(unroll_test_file)
        root = tree.getroot()
        measures = root.findall(f".//part[@id='P1']/measure")
        return measures

    def _cmp_indices(self, indices, exp_indices):
        assert len(indices) == len(exp_indices)
        for ct, exp_idx in enumerate(exp_indices):
            assert exp_idx == indices[ct], f"Difference at position '{ct}'!"
        print(indices)

    def test_unroll_repeats(self):
        measures = self._find_measures("Repeat")

        indices = get_unrolled_measure_indices(measures)
        first_line = [0, 1, 0, 1, 2, 3, 3, 4]
        second_line = [5, 6, 5, 6, 5, 6, 7, 8, 9, 8, 10]
        expected_indices = (
            first_line
            + second_line
            + [11, 12, 13, 11, 12, 14, 11, 12, 15, 16, 17, 18, 17, 18]
        )

        self._cmp_indices(indices, expected_indices)

    def test_unroll_jumps(self):
        measures = self._find_measures("Coda")
        indices = get_unrolled_measure_indices(measures)
        expected_indices = [0, 1, 0, 1, 2, 3, 4, 5, 6, 3, 4, 7, 8, 9]
        self._cmp_indices(indices, expected_indices)

        measures = self._find_measures("Coda2")
        indices = get_unrolled_measure_indices(measures)
        expected_indices = [0, 1, 1, 2, 3, 4, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5]
        self._cmp_indices(indices, expected_indices)
