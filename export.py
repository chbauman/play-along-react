"""This python script generates the XML files.

It uses the MuseScore executable to export .mscz files to .musicxml
and then reduces the exported XML files by removing certain tags 
and attributes from the XML document.
"""
import argparse
import copy
import json
import subprocess
from typing import Optional
import xml.etree.ElementTree as ET
from pathlib import Path

# PATHS
MSCZ_SCORE_PATH = Path("C:/Users/Chrigi/Documents/GitHub/compositions/PlayAlong")
MUSESCORE_EXE_PATH = Path("C:/Program Files/MuseScore 3/bin/MuseScore3.exe")
PUBLIC_PATH = Path("play-along/public")
XML_SCORES_PATH = PUBLIC_PATH / "scores"

assert MSCZ_SCORE_PATH.exists, f"Score directory {MSCZ_SCORE_PATH} not found!"
assert MUSESCORE_EXE_PATH.exists(), f"Musescore not found at {MUSESCORE_EXE_PATH}!"
assert XML_SCORES_PATH, f"XML output dir {XML_SCORES_PATH} does not exist!"

REMOVE_ELEMENTS = [
    "defaults",
    "credit",
    "print",
    "work",
    "midi-device",
    "midi-instrument",
    "encoding-date",
    "sound",
    "voice",
    # "type", # Needed for small notes
    # "beam", # Beams are not added automatically
    "stem",
]
REMOVE_ATRS = ["default-x", "default-y", "width", "relative-y"]
XML_DEC = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
"""


def reduce_file(path: Path):
    """Removes some unneeded tags from the xml."""

    tree = ET.parse(path)
    root = tree.getroot()
    for el_name in REMOVE_ELEMENTS:
        for el in root.findall(f".//*/..[{el_name}]"):
            for sub_el in el.findall(el_name):
                el.remove(sub_el)

    for attr_name in REMOVE_ATRS:
        for el in root.findall(f".//*[@{attr_name}]"):
            el.attrib.pop(attr_name)
            pass

    # Overwrite file with reduced version
    write_xml(tree, path)


def write_xml(tree: ET, out_path: Path):
    with open(out_path, "wb") as f:
        f.write(XML_DEC.encode("UTF-8"))
        tree.write(f, encoding="UTF-8")


def main(n_process: Optional[int]):
    """Main function."""

    # Find all scores
    all_paths = list(MSCZ_SCORE_PATH.rglob("*.mscz"))
    tot = len(all_paths)
    all_paths = reversed(sorted(all_paths, key=lambda p: p.lstat().st_mtime))

    for ct, mscz_path in enumerate(all_paths):
        if n_process is not None and ct == n_process:
            print("Stopping")
            break

        out_path = XML_SCORES_PATH / f"{mscz_path.stem}.musicxml"

        # Export to musicxml
        subprocess.run([str(MUSESCORE_EXE_PATH), "-o", str(out_path), str(mscz_path)])
        assert out_path.exists(), f"Export failed!"

        # Reduce XML file
        reduce_file(out_path)

        # Print progress
        print(f"Processed [{ct + 1} / {tot}] {out_path.stem}")


def check_positive(value):
    ivalue = int(value)
    if ivalue <= 0:
        raise argparse.ArgumentTypeError("%s is an invalid positive int value" % value)
    return ivalue


parser = argparse.ArgumentParser("Export script")
parser.add_argument("n", type=check_positive, default=None)
parser.add_argument("-a", "--audio", action="store_true", default=False, required=False)


audio_files = [
    # "Gugge/Blinging.mscz",
    # "Gugge/Love_Is_Like_Oxygen.mscz",
    # "Gugge/Seasons_in_the_Sun.mscz",
    # "PracticalDozen/Beat_It.mscz",
    # "PracticalDozen/You're_The_one_That_I_Want.mscz",
    "PlayAlong/Current/Calibration.mscz",
]


def export_audio():
    for a_file in audio_files:
        # Export mp3 and musicxml
        out_mxml, out_json = export_files(a_file)

        # Reduce XML file
        reduce_file(out_mxml)

        unroll_repeats(out_mxml)

        time_s, bar_n = extract_measure_map(out_mxml)

        json_dat = {
            "times": time_s,
            "bars": bar_n,
        }

        with open(out_json, "w") as f:
            json.dump(json_dat, f)

    print("Success")


def export_files(a_file: str):
    mscz_path = Path(rf"C:\Users\Chrigi\Documents\GitHub\compositions\{a_file}")
    assert mscz_path.exists()

    XML_AUDIO_PATH = XML_SCORES_PATH.parent / "audio"
    out_mp3 = XML_AUDIO_PATH / f"{mscz_path.stem}.mp3"
    out_mxml = XML_AUDIO_PATH / f"{mscz_path.stem}.musicxml"
    out_json = XML_AUDIO_PATH / f"{mscz_path.stem}.json"
    # subprocess.run([str(MUSESCORE_EXE_PATH), "-o", str(out_mp3), str(mscz_path)])
    subprocess.run([str(MUSESCORE_EXE_PATH), "-o", str(out_mxml), str(mscz_path)])
    assert out_mp3.exists() and out_mxml.exists(), f"Export failed!"
    return out_mxml, out_json


def unroll_repeats(out_mxml: Path):
    tree = ET.parse(out_mxml)
    root = tree.getroot()

    measures = root.findall(f".//part[@id='P1']/measure")

    # Search for repetitions in first part
    reps = []
    curr_start = None
    first_house_start = None

    for ct, meas in enumerate(measures):
        # Handle endings (houses)
        ending = meas.find(".//ending")
        if ending is not None:
            end_attrs = ending.attrib
            print(f"Found ending: {end_attrs}")
            if end_attrs["number"] == "1" and end_attrs["type"] == "start":
                first_house_start = ct

        # Repeats ||:   :||
        rep = meas.find(".//repeat")
        if rep is not None:
            direction = rep.attrib["direction"]
            if direction == "forward":
                assert curr_start is None
                curr_start = ct
            elif direction == "backward":
                assert curr_start is not None, f"Backward at {ct}"
                reps.append((curr_start, first_house_start, ct))
                curr_start = None
            else:
                raise ValueError(f"Unknown direction {direction}!")

    # Nothing to do if there are no repetitions
    n_reps = len(reps)
    if n_reps == 0:
        return

    print(f"Found {n_reps} repetitions: {reps}")

    # Extend all parts
    parts = root.findall(f".//part")
    for part in parts:

        print(f"Part {part.attrib['id']}")
        curr_measures = part.findall(f"./measure")

        curr_offset = 0
        for rep in reps:
            start_ct, first_h, end_ct = rep
            n_measures = curr_offset + end_ct - start_ct + 1

            end_range = end_ct + 1
            if first_h is not None:
                end_range = first_h
            for curr_ct in range(start_ct, end_range):
                meas_to_dup = curr_measures[curr_ct]
                new_meas = copy.deepcopy(meas_to_dup)
                part.insert(curr_ct + n_measures, new_meas)
            curr_offset += end_range - start_ct

    write_xml(tree, out_mxml)


def extract_measure_map(out_mxml: Path):
    tree = ET.parse(out_mxml)
    root = tree.getroot()
    measures = root.findall(f".//part[@id='P1']/measure")
    n_measures = len(measures)
    print(f"Found {n_measures} measures.")

    curr_n_quarts = 4
    curr_time = 0
    curr_meas_idx = 0
    curr_tempo_bpm = 120
    curr_tempo_unit = 4
    curr_beat_type = 4

    time_s = []
    bar_n = []

    meas_set = set()
    for ct, meas in enumerate(measures):

        def _set_anchor(curr_time):
            nonlocal curr_meas_idx, curr_n_quarts, curr_tempo_bpm

            if ct in meas_set:
                return curr_time
            curr_time += (
                (ct - curr_meas_idx)
                * curr_n_quarts
                * 60
                / curr_tempo_bpm
                / curr_tempo_unit
                * curr_beat_type
            )
            time_s.append(curr_time)
            bar_n.append(ct + 1)
            curr_meas_idx = ct
            meas_set.add(ct)
            return curr_time

        # Check if there is a tempo change
        tempo = meas.find(".//*/metronome")
        if tempo is not None:
            beat_unit = tempo.find("beat-unit").text
            print(f"Found tempo {beat_unit}={curr_tempo_bpm}")
            if beat_unit == "quarter":
                curr_tempo_unit = 4
            elif beat_unit == "half":
                curr_tempo_unit = 2
            else:
                raise ValueError(f"Unit {beat_unit} is not supported!")

            curr_time = _set_anchor(curr_time)
            curr_tempo_bpm = int(tempo.find("per-minute").text)

        # Check if time signature changed
        time = meas.find(".//*/time")
        if time is not None:
            n_beats = int(time.find("beats").text)
            beat_type = int(time.find("beat-type").text)
            curr_beat_type = beat_type
            print(f"Found time signature change {n_beats}/{curr_beat_type}")

            curr_time = _set_anchor(curr_time)
            curr_n_quarts = n_beats

    curr_time += (ct - curr_meas_idx) * curr_n_quarts * 60 / curr_tempo_bpm
    time_s.append(curr_time)
    bar_n.append(ct + 1)
    return time_s, bar_n


if __name__ == "__main__":
    args = parser.parse_args()
    if args.audio:
        export_audio()

    main(args.n)
