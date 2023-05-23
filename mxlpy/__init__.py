"""Musicxml python package."""
from pathlib import Path
import subprocess
from typing import List
import xml.etree.ElementTree as ET


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


def _parse_txt(txt: str):
    lower_txt = txt.lower()
    if lower_txt == "to coda" or "to " in lower_txt:
        return "tocoda"

    if "d.s" in lower_txt:
        return "dalsegno"

    if "capo" in lower_txt or "d.c" in lower_txt:
        return "dacapo"

    if "fine" in lower_txt:
        return "fine"

    print(f"Did not understand {txt}")
    return None


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

    done_jumps = set()
    enabled_coda_jumps_or_fine = set()
    found_to_coda_or_fine = set()
    last_segno = None

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
            print(f"FounD SEGNO")
            last_segno = ct
        jump_kind = None
        directions = meas.findall(".//direction-type")
        for direct in directions:
            words = direct.find("words")
            if words is not None:
                txt = words.text
                jump_kind = _parse_txt(txt)
        if jump_kind == "dacapo" and ct not in done_jumps:
            print(f"Jump to Capo")
            jump = 0
            done_jumps.add(ct)
        if jump_kind == "dalsegno" and ct not in done_jumps:
            print(f"Jump to SEGNO")
            jump = last_segno
            done_jumps.add(ct)
            last_segno = None

        if jump is not None:
            for to_coda in found_to_coda_or_fine:
                if jump < to_coda <= ct:
                    enabled_coda_jumps_or_fine.add(to_coda)

        if jump_kind == "fine":
            found_to_coda_or_fine.add(ct)
            if ct in enabled_coda_jumps_or_fine:
                print(f"Fine {ct}")
                measure_indices.append(ct)
                return measure_indices

        if jump_kind == "tocoda":
            found_to_coda_or_fine.add(ct)
            if ct in enabled_coda_jumps_or_fine:
                print(f"Jumping TO CODA {ct}")
                jump = find_next_coda(measures, ct)
                print(f"Jumping TO CODA {ct}, {jump}")
            pass

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
                if ct not in done_repeats:
                    assert rep_start_idx is not None, f"Backward at {ct}"
                    jump = rep_start_idx
                    done_repeats[ct] = times - 2
                elif done_repeats[ct] > 0:
                    assert rep_start_idx is not None, f"Backward at {ct}"
                    jump = rep_start_idx
                    done_repeats[ct] = done_repeats[ct] - 1
                else:
                    # Done repeating
                    rep_start_idx = None
                    del done_repeats[ct]
                rep_end_idx = ct

        # Remember index and go to next measure
        print(ct)
        measure_indices.append(ct)
        if jump is not None:
            ct = jump
        else:
            ct += 1

    return measure_indices
