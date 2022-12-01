"""This python script reduces the sizes of the xml files."""
import json
import os
import requests
import xml.etree.ElementTree as ET
from pathlib import Path


PUBLIC_PATH = Path("play-along/public")
RAW_SCORES_PATH = PUBLIC_PATH / "scores"
REDUCED_SCORES_PATH = PUBLIC_PATH / "scores"
JSON_SCORE_INFO = PUBLIC_PATH / "score_info.json"

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

    with open(out_path, "wb") as f:
        f.write(XML_DEC.encode("UTF-8"))
        tree.write(f, encoding="UTF-8")

    print(f"Processed {path.name}")


def main():
    for p in RAW_SCORES_PATH.iterdir():
        reduce_file(path=p)


if __name__ == "__main__":
    # main()

    with open(JSON_SCORE_INFO) as f:
        json_info = json.load(f)

    for info in json_info:
        print(info)

    url = (
        "https://data.mongodb-api.com/app/data-iydcr/endpoint/data/v1/action/insertOne"
    )
    payload = json.dumps(
        {
            "collection": "scores",
            "database": "ytp",
            "dataSource": "Cluster0",
            "document": {"test": "another test"},
        }
    )
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": os.environ.get("MDB_API_KEY"),
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)
