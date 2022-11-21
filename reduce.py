import xml.etree.ElementTree as ET
from pathlib import Path


PUBLIC_PATH = Path("play-along/public")
RAW_SCORES_PATH = PUBLIC_PATH / "scores"
REDUCED_SCORES_PATH = PUBLIC_PATH / "reduced"

REDUCED_SCORES_PATH = PUBLIC_PATH / "scores"

REMOVE_ELEMENTS = [
    "defaults",
    "credit",
    "print",
    "work",
    "midi-device",
    "midi-instrument",
    "voice",
    "type",
    # "beam",
    "stem",
]
REMOVE_ATRS = ["default-x", "default-y", "width"]
XML_DEC = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
"""


def reduce_file(path: Path):
    out_path = REDUCED_SCORES_PATH / path.name

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

    print(path)
    with open(out_path, "wb") as f:
        f.write(XML_DEC.encode("UTF-8"))
        tree.write(f, encoding="UTF-8")


def main():
    for p in RAW_SCORES_PATH.iterdir():
        reduce_file(path=p)


if __name__ == "__main__":
    main()
