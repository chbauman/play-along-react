import xml.etree.ElementTree as ET
from pathlib import Path


PUBLIC_PATH = Path("play-along/public")
RAW_SCORES_PATH = PUBLIC_PATH / "scores"
REDUCED_SCORES_PATH = PUBLIC_PATH / "reduced"

REDUCED_SCORES_PATH = PUBLIC_PATH / "scores"

REMOVE_ELEMENTS = ["scaling", "page-layout"]
XML_DEC = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
"""

def reduce_file(path: Path):
    out_path = REDUCED_SCORES_PATH / path.name

    tree = ET.parse(path)
    root = tree.getroot()
    for el_name in REMOVE_ELEMENTS:
        for el in root.findall(el_name):
            root.remove(el)
    print(path)
    with open(out_path, 'wb') as f:
        f.write(XML_DEC.encode("UTF-8"))
        tree.write(f, encoding="UTF-8")


def main():
    for p in RAW_SCORES_PATH.iterdir():
        reduce_file(path=p)


if __name__ == "__main__":
    main()
