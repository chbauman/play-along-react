"""Musicxml python package."""
from pathlib import Path
from typing import List
import xml.etree.ElementTree as ET


class Paths:
    MSCZ_SCORE_PATH = Path("C:/Users/Chrigi/Documents/GitHub/compositions/PlayAlong")
    MXLPY_PATH = Path(__file__).parent.resolve()
    PROJ_BASE_PATH = MXLPY_PATH.parent
    PLAY_ALONG_PATH = PROJ_BASE_PATH / "play-along"
    AUDIO_PATH = PLAY_ALONG_PATH / "public" / "audio"

    assert MSCZ_SCORE_PATH.exists, f"Score directory {MSCZ_SCORE_PATH} not found!"


def get_unrolled_measure_indices(measures: List[ET.Element]) -> List[int]:
    rep_start_idx = 0
    rep_end_idx = None
    done_repeats = set()
    done_houses = set()
    measure_indices = []

    ct = 0
    while ct < len(measures):
        meas = measures[ct]
        jump = None

        # Handle endings (houses)
        ending = meas.find(".//ending")
        if ending is not None:
            end_attrs = ending.attrib
            if end_attrs["number"] == "1" and end_attrs["type"] == "start":
                if ct not in done_houses:
                    done_houses.add(ct)
                else:
                    print("addd")
                    # Jump to the end of the house
                    ct = rep_end_idx + 1
                    continue

        print(ct)

        # Repeats ||:   :||
        reps = meas.findall(".//repeat")
        for rep in reps:
            direction = rep.attrib["direction"]
            if direction == "forward":
                rep_start_idx = ct
            else:
                assert direction == "backward", f"Unknown direction '{direction}'!"
            if direction == "backward":
                print(rep.attrib)
                if ct not in done_repeats:
                    assert rep_start_idx is not None, f"Backward at {ct}"
                    jump = rep_start_idx
                    done_repeats.add(ct)
                rep_start_idx = None
                rep_end_idx = ct

        # Remember index and go to next measure
        measure_indices.append(ct)
        if jump is not None:
            ct = jump
        else:
            ct += 1

    print(measure_indices)
    return measure_indices
