"""This python script generates the XML files.

It uses the MuseScore executable to export .mscz files to .musicxml
and then reduces the exported XML files by removing certain tags 
and attributes from the XML document.
"""
import argparse
import copy
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, Optional

from mxlpy import Paths, export_mscz, get_unrolled_measure_indices
from mxlpy.clean_xml import reduce_file
from mxlpy.util import write_xml


def main(n_process: Optional[int]):
    """Main function."""

    # Find all scores
    all_paths = list(Paths.MSCZ_SCORE_PATH.rglob("*.mscz"))
    tot = len(all_paths)
    all_paths = reversed(sorted(all_paths, key=lambda p: p.lstat().st_mtime))

    for ct, mscz_path in enumerate(all_paths):
        if n_process is not None and ct == n_process:
            print("Stopping")
            break

        out_path = Paths.XML_SCORES_PATH / f"{mscz_path.stem}.musicxml"

        # Export to musicxml
        export_mscz(mscz_path, out_path)

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
parser.add_argument(
    "-m", "--no-mp3", action="store_true", default=False, required=False
)


def _group_includes(target_grp: str) -> bool:
    def _inner(x: Dict):
        grp = x["group"]
        if isinstance(grp, str):
            return grp == target_grp
        return target_grp in grp

    return _inner


def export_audio(n_export: int, export_mp3: bool = True):
    # Load JSON with info
    JSON_AUDIO = "audio.json"
    with open(JSON_AUDIO, "r", encoding="utf8") as f:
        scores = json.load(f)

    # Get groups
    groups = set()
    for score in scores:
        grp = score["group"]
        if isinstance(grp, str):
            groups.add(grp)
        else:
            for g in grp:
                groups.add(g)

    # Create a json file for each group
    for group in groups:
        rel_scores = list(filter(_group_includes(group), scores))
        with open(Paths.SRC_PATH / f"audio/{group}.json", "w") as f:
            json.dump(rel_scores, f)

    # Create a dict mapping relative path to score info
    path_to_info = {}
    for score in scores:
        dir_name, file_name = score["dir"], score["fileName"]
        a_file = f"{dir_name}/{file_name}.mscz"
        path_to_info[a_file] = score

    # Sort acc. to most recently modified
    sorted_names = reversed(
        sorted(
            path_to_info.keys(),
            key=lambda p: (Paths.COMPOSITIONS_PATH / p).lstat().st_mtime,
        )
    )
    for ct, a_file in enumerate(sorted_names):
        if ct == n_export:
            print("Stopping early")
            break

        score = path_to_info[a_file]
        print(f"Processing: {a_file}")

        # Export mp3 and musicxml
        out_mxml, out_json = export_files(a_file, export_mp3)

        # Edit XML file
        reduce_file(out_mxml)
        transpose_to_c(out_mxml)
        unroll_repeats(out_mxml)

        time_s, bar_n = extract_measure_map(out_mxml)

        json_dat = {
            "times": time_s,
            "bars": bar_n,
            **score,
        }

        with open(out_json, "w", encoding="utf8") as f:
            json.dump(json_dat, f, ensure_ascii=False)

    print("Success")


def export_files(a_file: str, export_mp3: bool = True):
    mscz_path = Paths.COMPOSITIONS_PATH / a_file
    assert mscz_path.exists(), f"{mscz_path}"

    out_mp3 = Paths.AUDIO_PATH / f"{mscz_path.stem}.mp3"
    out_mxml = Paths.AUDIO_PATH / f"{mscz_path.stem}.musicxml"
    out_json = Paths.AUDIO_PATH / f"{mscz_path.stem}.json"

    if export_mp3:
        export_mscz(mscz_path, out_mp3)
    export_mscz(mscz_path, out_mxml)
    return out_mxml, out_json


def extract_info(xml: Path):
    """Extract information from the score."""
    tree = ET.parse(xml)
    root = tree.getroot()

    # Find keys
    fifths = root.findall(f".//fifths")
    all_keys = [int(fifth.text) for fifth in fifths]

    return {"keys": all_keys}


def transpose_to_c(out_mxml: Path):
    tree = ET.parse(out_mxml)
    root = tree.getroot()

    _SCALE = ["C", "D", "E", "F", "G", "A", "B"]
    _CHROM = [0, 2, 4, 5, 7, 9, 11]
    _FIFTH_DIFF = {-2: -2, -9: -3, -7: -1}
    scale_len = len(_SCALE)

    parts = root.findall(f".//part")

    for part in parts:
        transposes = part.findall(f".//transpose")
        n_trp = len(transposes)
        if n_trp == 1:
            trp = transposes[0]
            dia = int(trp.findall(f".//diatonic")[0].text)
            chrom = int(trp.findall(f".//chromatic")[0].text)
            if chrom == 0:
                continue
            print(f"Transposition: Dia: {dia}, chrom: {chrom}")

            # Change keys
            fifths = part.findall(f".//fifths")
            for fifth in fifths:
                f_val = int(fifth.text)
                fifth.text = str(f_val + _FIFTH_DIFF[chrom])

            # Change individual notes
            all_pitches = part.findall(f".//pitch")
            for pitch in all_pitches:
                step_el = pitch.findall(".//step")[0]
                oct_el = pitch.findall(".//octave")[0]
                alt_el = pitch.findall(".//alter")
                has_alter = len(alt_el) > 0
                alt_num = int(alt_el[0].text) if has_alter else 0
                idx = _SCALE.index(step_el.text)
                new_idx = (idx + dia) % scale_len
                new_oct = int(oct_el.text) + (idx + dia) // scale_len
                step_el.text = _SCALE[new_idx]
                oct_el.text = f"{new_oct}"

                chrom_diff = (_CHROM[new_idx] - _CHROM[idx]) % 12
                chrom_diff_exp = chrom % 12
                exp_alter = chrom_diff_exp - chrom_diff
                if exp_alter != 0:
                    alt_num += exp_alter

                    if alt_num == 0 and has_alter:
                        pitch.remove(alt_el[0])
                    elif alt_num != 0 and has_alter:
                        alt_el[0].text = f"{alt_num}"
                    elif alt_num != 0 and not has_alter:
                        # Add new
                        alt_el = ET.SubElement(pitch, "alter")
                        alt_el.text = f"{alt_num}"

    write_xml(tree, out_mxml)


def unroll_repeats(out_mxml: Path):
    tree = ET.parse(out_mxml)
    root = tree.getroot()

    measures = root.findall(f".//part[@id='P1']/measure")
    measure_indices = get_unrolled_measure_indices(measures)

    # Extend all parts
    parts = root.findall(f".//part")
    for part in parts:
        print(f"Part {part.attrib['id']}")
        curr_measures = part.findall(f"./measure")
        n_meas = len(curr_measures)

        # Insert new elements according to measure indices
        for ct, extra_ct in enumerate(measure_indices):
            meas_to_dup = curr_measures[extra_ct]
            new_meas = copy.deepcopy(meas_to_dup)
            part.insert(n_meas + ct, new_meas)

        # Remove original (linear) measures
        for el in curr_measures:
            part.remove(el)

    write_xml(tree, out_mxml)


def extract_measure_map(out_mxml: Path):
    tree = ET.parse(out_mxml)
    root = tree.getroot()
    measures = root.findall(f".//part[@id='P1']/measure")
    n_measures = len(measures)
    print(f"Found {n_measures} measures.")

    curr_n_beats = 4
    curr_time = 0
    curr_meas_idx = 0
    curr_tempo_bpm = 120
    curr_tempo_unit = 4
    curr_tempo_unit_dot = False
    curr_beat_type = 4

    time_s = []
    bar_n = []

    meas_set = set()
    for ct, meas in enumerate(measures):

        def _set_anchor(curr_time, _ct=ct):
            nonlocal curr_meas_idx, curr_n_beats, curr_tempo_bpm, curr_tempo_unit_dot

            if _ct in meas_set:
                return curr_time
            dot_fac = 3 / 2 if curr_tempo_unit_dot else 1
            beat_diff = _ct - curr_meas_idx
            time_sig = curr_n_beats * curr_tempo_unit / dot_fac / curr_beat_type
            dt = beat_diff * 60 / curr_tempo_bpm * time_sig
            curr_time += dt
            time_s.append(curr_time)
            bar_n.append(_ct + 1)
            curr_meas_idx = _ct
            meas_set.add(_ct)
            return curr_time

        # Check if there is a tempo change
        tempo = meas.find(".//*/metronome")
        if tempo is not None:
            curr_time = _set_anchor(curr_time)

            beat_unit = tempo.find("beat-unit").text
            curr_tempo_bpm = int(tempo.find("per-minute").text)
            curr_tempo_unit_dot = tempo.find("beat-unit-dot") is not None
            dot = " dot" if curr_tempo_unit_dot else ""
            print(f"Measure {ct}: Found tempo {beat_unit}{dot}={curr_tempo_bpm}")

            if beat_unit == "quarter":
                curr_tempo_unit = 4
            elif beat_unit == "half":
                curr_tempo_unit = 2
            else:
                raise ValueError(f"Unit {beat_unit} is not supported!")

        # Check if time signature changed
        time = meas.find(".//*/time")
        if time is not None:
            n_beats = int(time.find("beats").text)
            beat_type = int(time.find("beat-type").text)
            print(
                f"Measure {ct}: Found time signature change {n_beats}/{curr_beat_type}"
            )

            curr_time = _set_anchor(curr_time)
            curr_n_beats = n_beats
            curr_beat_type = beat_type

    # Place last anchor
    dot_fac = 3 / 2 if curr_tempo_unit_dot else 1
    beat_diff = ct - curr_meas_idx
    time_sig = curr_n_beats * curr_tempo_unit / dot_fac / curr_beat_type
    dt = beat_diff * 60 / curr_tempo_bpm * time_sig
    curr_time += dt
    time_s.append(curr_time)
    bar_n.append(ct + 1)
    return time_s, bar_n


if __name__ == "__main__":
    args = parser.parse_args()
    if args.audio:
        export_audio(args.n, not args.no_mp3)

    main(args.n)
