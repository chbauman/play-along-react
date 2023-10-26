"""Collection of information from MusicXML files."""


import warnings
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, List

from tqdm import tqdm


def _make_unique(inp: list) -> list:
    return list(set(inp))


def extract_info(xml: Path):
    """Extract information from the score."""
    tree = ET.parse(xml)
    root = tree.getroot()

    # Find keys
    fifths = root.findall(f".//fifths")
    all_keys = [int(fifth.text) for fifth in fifths]
    all_keys = _make_unique(all_keys)
    assert len(all_keys) > 0, f"Key must be set for {xml.name}"
    if len(all_keys) == 0:
        print(f"No key signature: {xml.name}")

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


def extract_all_information(score_info: List[Dict[str, str]], base_mxl_dir: Path):
    """Collect information from all scores in the given list."""

    generated_info = {}
    for score in tqdm(score_info):
        file_name = score["fileName"]
        file_path = base_mxl_dir / f"{file_name}.musicxml"
        assert file_path.exists(), f"Did not find file at {file_path}"

        generated_info[score["videoId"]] = extract_info(file_path)
    return generated_info
