"""MusicXML utility module."""

import json
from typing import Any
import xml.etree.ElementTree as ET
from pathlib import Path


class Paths:
    """Static class holding some paths."""

    MUSESCORE_EXE_PATH = Path("C:/Program Files/MuseScore 3/bin/MuseScore3.exe")
    COMPOSITIONS_PATH = Path("C:/Users/Chrigi/Documents/GitHub/compositions")
    MSCZ_SCORE_PATH = COMPOSITIONS_PATH / "PlayAlong"
    MXLPY_PATH = Path(__file__).parent.resolve()
    PROJ_BASE_PATH = MXLPY_PATH.parent
    PLAY_ALONG_PATH = PROJ_BASE_PATH / "play-along"
    PUBLIC_PATH = PLAY_ALONG_PATH / "public"
    AUDIO_PATH = PUBLIC_PATH / "audio"
    XML_SCORES_PATH = PUBLIC_PATH / "scores"
    SRC_PATH = PLAY_ALONG_PATH / "src"
    GENERATED_SCORE_INFO_FILE = SRC_PATH / "scoreInfoGenerated.json"
    SCORE_INFO_FILE = SRC_PATH / "scoreInfo.json"

    assert MSCZ_SCORE_PATH.exists, f"Score directory {MSCZ_SCORE_PATH} not found!"
    assert MUSESCORE_EXE_PATH.exists(), f"Musescore not found at {MUSESCORE_EXE_PATH}!"
    assert XML_SCORES_PATH, f"XML output dir {XML_SCORES_PATH} does not exist!"


XML_DEC = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
"""


def write_xml(tree: ET, out_path: Path) -> None:
    with open(out_path, "wb") as f:
        f.write(XML_DEC.encode("UTF-8"))
        tree.write(f, encoding="UTF-8")


def read_json(p: Path):
    """Read data from JSON."""
    with open(p, "r", encoding="utf8") as f:
        return json.load(f)


def write_json(p: Path, data: Any, **kwargs) -> None:
    """Write data to JSON."""
    with open(p, "w", encoding="utf8") as f:
        json.dump(data, f, **kwargs)
