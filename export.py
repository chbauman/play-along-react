"""This python script generates the XML files.

It uses the MuseScore executable to export .mscz files to .musicxml
and then reduces the exported XML files by removing certain tags 
and attributes from the XML document.
"""
import subprocess
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
        for el in root.findall(f".//*[{el_name}]"):
            for sub_el in el.findall(el_name):
                el.remove(sub_el)

    for attr_name in REMOVE_ATRS:
        for el in root.findall(f".//*[@{attr_name}]"):
            el.attrib.pop(attr_name)
            pass

    # Overwrite file with reduced version
    with open(path, "wb") as f:
        f.write(XML_DEC.encode("UTF-8"))
        tree.write(f, encoding="UTF-8")


def main():
    """Main function."""

    # Find all scores
    all_paths = list(MSCZ_SCORE_PATH.rglob("*.mscz"))
    tot = len(all_paths)
    for ct, mscz_path in enumerate(all_paths):

        out_path = XML_SCORES_PATH / f"{mscz_path.stem}.musicxml"

        # Export to musicxml
        subprocess.run([str(MUSESCORE_EXE_PATH), "-o", str(out_path), str(mscz_path)])
        assert out_path.exists(), f"Export failed!"

        # Reduce XML file
        reduce_file(out_path)

        # Print progress
        print(f"Processed [{ct + 1} / {tot}] {out_path.stem}")


if __name__ == "__main__":
    main()
