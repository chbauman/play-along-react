"""Collection of information from MusicXML files."""

import json
import warnings
import xml.etree.ElementTree as ET
from pathlib import Path

from tqdm import tqdm

from mxlpy.util import Paths, read_json


def _make_unique(inp: list) -> list:
    return list(set(inp))


def extract_info(xml: Path):
    """Extract information from the score."""
    tree = ET.parse(xml)
    root = tree.getroot()

    # Find all parts (excluding drum sets)
    score_parts = root.findall(".//score-part")
    used_part_ids = []
    for part in score_parts:
        id = part.attrib["id"]
        name = part.find("part-name").text
        if "drum" not in name.lower():
            used_part_ids.append(id)

    # Find keys, exclude drum parts
    all_keys = []
    for part_id in used_part_ids:
        part = root.find(f".//part[@id='{part_id}']")
        fifths = part.findall(f".//fifths")
        all_keys += [int(fifth.text) for fifth in fifths]
    all_keys = _make_unique(all_keys)

    assert len(all_keys) > 0, f"Key must be set for {xml.name}"
    for key in all_keys:
        if key > 6 or key < -6:
            warnings.warn(f"Bad key signature {key} in {xml.name}")

    # Find time signatures
    times = []
    time_els = root.findall(".//*/time")
    for time_el in time_els:
        n_beats = int(time_el.find("beats").text)
        beat_type = int(time_el.find("beat-type").text)
        times.append((n_beats, beat_type))
    times = _make_unique(times)
    if len(times) == 0:
        warnings.warn(f"No time signature: {xml.name}")

    return {"keys": all_keys, "times": times}


def extract_all_information():
    """Collect information from all scores in the given list."""

    score_info = read_json(Paths.SCORE_INFO_FILE)
    audio_info = read_json(Paths.JSON_AUDIO)

    generated_info: dict[str, list] = {}
    yt_xml_dir = Paths.XML_SCORES_PATH
    for score in tqdm(score_info):
        file_name = score["fileName"]

        file_path = yt_xml_dir / f"{file_name}.musicxml"
        generated_info[score["videoId"]] = extract_auto_info(file_path)

    audio_xml_dir = Paths.AUDIO_PATH
    for score in tqdm(audio_info):
        file_name = score["fileName"]
        file_path = audio_xml_dir / f"{file_name}.musicxml"
        generated_info[file_name] = extract_auto_info(file_path)

    _write_generated(generated_info)


def extract_auto_info(score_path: Path):
    """Automatically extracts information from mscz files.

    Also checcks the path name's capitalization.
    """

    # Check file exists
    assert score_path.exists(), f"Did not find file at {score_path}"

    # Check correct capitalization which is important on linux.
    actual_name = score_path.resolve().stem
    assert (
        actual_name == score_path.stem
    ), f"Score info: {score_path.stem}, should be {actual_name}"

    return extract_info(score_path)


def _write_generated(info: dict[str, list]) -> None:
    with open(Paths.GENERATED_SCORE_INFO_FILE, "w") as f:
        f.write("{\n")
        n_items = len(info)
        keys = sorted(info.keys())
        for ct, score_id in enumerate(keys):
            sub_dict = info[score_id]
            f.write(f'  "{score_id}": {json.dumps(sub_dict)}')
            if ct != n_items - 1:
                f.write(",")
            f.write("\n")
        f.write("}\n")

    all_time_signatures = set()
    for score_info in info.values():
        for ts in score_info["times"]:
            all_time_signatures.add(tuple(ts))
    with open(Paths.TIME_SIGNATURES_FILE, "w") as f:
        f.write(json.dumps(list(sorted(all_time_signatures))))
