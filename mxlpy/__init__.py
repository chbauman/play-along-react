"""Musicxml python package."""
from pathlib import Path
import subprocess
from typing import Dict, List
import xml.etree.ElementTree as ET

from mxlpy.repeat_analyzer import RepeatAnalyzer


class Paths:
    """Static class holding some paths."""

    MUSESCORE_EXE_PATH = Path("C:/Program Files/MuseScore 3/bin/MuseScore3.exe")
    COMPOSITIONS_PATH = Path("C:/Users/Chrigi/Documents/GitHub/compositions")
    MSCZ_SCORE_PATH = COMPOSITIONS_PATH / "PlayAlong"
    MXLPY_PATH = Path(__file__).parent.resolve()
    PROJ_BASE_PATH = MXLPY_PATH.parent
    PLAY_ALONG_PATH = PROJ_BASE_PATH / "play-along"
    AUDIO_PATH = PLAY_ALONG_PATH / "public" / "audio"

    assert MSCZ_SCORE_PATH.exists, f"Score directory {MSCZ_SCORE_PATH} not found!"
    assert MUSESCORE_EXE_PATH.exists(), f"Musescore not found at {MUSESCORE_EXE_PATH}!"


def export_mscz(mscz_src: Path, out_path: Path) -> None:
    subprocess.run([str(Paths.MUSESCORE_EXE_PATH), "-o", str(out_path), str(mscz_src)])
    assert out_path.exists(), f"Export failed {mscz_src}"


_to_std_map = {
    "fine": "Fine",
    "tocoda": "To Coda",
    "dalsegno": "D.S.",
    "dalsegnoalfine": "D.S. al Fine",
    "dacapo": "D.C.",
    "dacapoalfine": "D.C. al Fine",
}


def _parse_txt(txt: str):
    lower_txt = txt.lower()
    contains_fine = "fine" in lower_txt
    with_rep = "with" in lower_txt or "con" in lower_txt or "mit" in lower_txt
    if lower_txt == "to coda" or "to " in lower_txt:
        return "tocoda", False

    if "d.s" in lower_txt:
        if contains_fine:
            return "dalsegnoalfine", with_rep
        return "dalsegno", with_rep

    if "capo" in lower_txt or "d.c" in lower_txt:
        if contains_fine:
            return "dacapoalfine", with_rep
        return "dacapo", with_rep

    if contains_fine:
        return "fine", False

    print(f"Did not understand {txt}")
    return None, False


def find_next_coda(measures: List[ET.Element], curr_ct: int) -> int:
    for ct, meas in enumerate(measures[curr_ct:]):
        coda = meas.find(".//coda")
        if coda is not None:
            return ct + curr_ct
    return curr_ct


def get_unrolled_measure_indices(measures: List[ET.Element]) -> List[int]:
    rep_start_idx = 0
    rep_end_idx = None
    done_repeats = {}
    done_houses = set()

    done_backward_jumps = set()
    enabled_coda_jumps_or_fine = set()
    found_to_coda_or_fine = {}
    last_segno = None
    ds_dc_no_repeat = False

    analyzer = RepeatAnalyzer()
    analyzer.analyze_measures(measures)

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
                    # Jump to the end of the house
                    ct = rep_end_idx + 1
                    continue

        # Jumps
        segno = meas.find(".//segno")
        if segno is not None:
            last_segno = ct
        jump_kind = None
        with_rep = False
        directions = meas.findall(".//direction-type")
        for direct in directions:
            words = direct.find("words")
            if words is not None:
                txt = words.text
                jump_kind, with_rep = _parse_txt(txt)
                if jump_kind is not None:
                    words.text = _to_std_map[jump_kind]

        if jump_kind is not None and ct not in done_backward_jumps:
            if jump_kind.startswith("dacapo"):
                jump = 0
                done_backward_jumps.add(ct)
                ds_dc_no_repeat = not with_rep
                done_repeats = {}
                done_houses = set()
            if jump_kind.startswith("dalsegno"):
                jump = last_segno
                done_backward_jumps.add(ct)
                ds_dc_no_repeat = not with_rep
                last_segno = None
                done_repeats = {}
                done_houses = set()

        if jump is not None:
            for to_coda in found_to_coda_or_fine:
                if jump < to_coda <= ct:
                    enabled_coda_jumps_or_fine.add(to_coda)

        # Fine or coda jumps
        if jump_kind in ["fine", "tocoda"]:
            execute_jump = False
            if ct in enabled_coda_jumps_or_fine:
                if ds_dc_no_repeat:
                    execute_jump = True
                else:
                    found_to_coda_or_fine[ct] -= 1
                    execute_jump = found_to_coda_or_fine[ct] == 0
            else:
                # Cound number of time that measure was passed
                if ct not in found_to_coda_or_fine:
                    found_to_coda_or_fine[ct] = 1
                else:
                    found_to_coda_or_fine[ct] += 1

            if execute_jump:
                if jump_kind == "fine":
                    print(f"Fine {ct}")
                    measure_indices.append(ct)
                    return measure_indices
                jump = find_next_coda(measures, ct)

        # Repeats ||:   :||
        reps = meas.findall(".//repeat")
        for rep in reps:
            direction = rep.attrib["direction"]
            if direction == "forward":
                rep_start_idx = ct
            else:
                assert direction == "backward", f"Unknown direction '{direction}'!"
            if direction == "backward":
                times = int(rep.attrib.get("times", "2"))
                if not ds_dc_no_repeat:
                    if ct not in done_repeats:
                        assert rep_start_idx is not None, f"Backward at {ct}"
                        jump = rep_start_idx
                        done_repeats[ct] = times - 2
                        jump_kind = "repeating"
                    elif done_repeats[ct] > 0:
                        assert rep_start_idx is not None, f"Backward at {ct}"
                        jump = rep_start_idx
                        done_repeats[ct] = done_repeats[ct] - 1
                        jump_kind = "repeating"
                    rep_end_idx = ct

        # Remember index and go to next measure
        measure_indices.append(ct)
        if jump is not None:
            print(f"{jump_kind}: jump from {ct} to {jump} :)")
            ct = jump
        else:
            ct += 1

    return measure_indices
