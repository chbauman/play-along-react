from mxlpy import Paths, get_unrolled_measure_indices
import xml.etree.ElementTree as ET


def test_unroll():
    unroll_test_file = Paths.AUDIO_PATH / "RepeatAndCoda.musicxml"
    assert unroll_test_file.exists()

    tree = ET.parse(unroll_test_file)
    root = tree.getroot()

    measures = root.findall(f".//part[@id='P1']/measure")
    indices = get_unrolled_measure_indices(measures)
    expected_indices = [0, 1, 0, 1, 2, 3, 3, 4]
    for ct, exp_idx in enumerate(expected_indices):
        assert exp_idx == indices[ct], f"Difference at position '{ct}'!"
    print(indices)
    pass
