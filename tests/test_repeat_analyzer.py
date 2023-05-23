from unittest import TestCase
from mxlpy.repeat_analyzer import RepeatAnalyzer
from tests.util import find_measures


class TestUnroll(TestCase):
    def test_unroll_repeats(self):
        measures = find_measures("Repeat")

        analyzer = RepeatAnalyzer()
        analyzer.analyze_measures(measures)

        assert analyzer.play_times(0) == 2
        assert analyzer.play_times(2) == 1
        assert analyzer.play_times(8) == 2
        assert analyzer.play_times(11) == 3
        assert analyzer.play_times(16) == 1

        # In 2nd house (of 3)
        assert analyzer.play_times(14) == 2
