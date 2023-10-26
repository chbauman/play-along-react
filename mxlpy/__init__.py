"""Musicxml python package."""
from pathlib import Path
import subprocess
from typing import List
import xml.etree.ElementTree as ET

from mxlpy.repeat_analyzer import RepeatAnalyzer, find_next_coda, handle_jump_back
from mxlpy.util import Paths
from mxlpy.clean_xml import reduce_file


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


def get_unrolled_measure_indices(measures: List[ET.Element]) -> List[int]:
    rep_start_idx = 0
    rep_end_idx = None
    done_repeats = {}

    done_houses = set()

    done_backward_jumps = set()
    last_segno = None
    ds_dc_no_repeat = False

    analyzer = RepeatAnalyzer()
    analyzer.analyze_measures(measures)

    to_coda = None
    fine = None

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

        if jump_kind == "fine":
            fine = ct
        elif jump_kind == "tocoda":
            to_coda = ct

        if jump_kind is not None and ct not in done_backward_jumps:
            is_da_capo = jump_kind.startswith("dacapo")
            is_dal_segno = jump_kind.startswith("dalsegno")
            if is_da_capo:
                jump = 0
            if is_dal_segno:
                jump = last_segno
                last_segno = None
            if is_da_capo or is_dal_segno:
                done_backward_jumps.add(ct)
                end_idx = fine if fine is not None else to_coda
                measure_indices.append(ct)
                new_indices = handle_jump_back(measure_indices, jump, end_idx, with_rep)
                measure_indices = new_indices

                if fine is not None:
                    print(f"Fine")
                    return measure_indices
                if to_coda is not None:
                    ct = find_next_coda(measures, ct)
                else:
                    ct += 1
                to_coda = None
                fine = None
                continue

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


__all__ = ["Paths", "get_unrolled_measure_indices", "export_mscz", "reduce_file"]
