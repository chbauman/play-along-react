from typing import List
from mxlpy import Paths, export_mscz
import xml.etree.ElementTree as ET


class TestPaths:
    TEST_PKG_PATH = Paths.PROJ_BASE_PATH / "tests"
    TEST_DATA_PATH = TEST_PKG_PATH / "data"

    TEST_DATA_PATH.mkdir(exist_ok=True)


def find_measures(name: str) -> List[ET.Element]:
    test_file = TestPaths.TEST_DATA_PATH / f"{name}.musicxml"
    assert test_file.exists()
    tree = ET.parse(test_file)
    root = tree.getroot()
    measures = root.findall(f".//part[@id='P1']/measure")
    return measures


if __name__ == "__main__":
    out_dir = TestPaths.TEST_DATA_PATH
    export_files = [
        "Debug/Coda.mscz",
        "Debug/Coda2.mscz",
        "Debug/Repeat.mscz",
    ]
    for f in export_files:
        src_path = Paths.COMPOSITIONS_PATH / f
        out_mxl = out_dir / f"{src_path.stem}.musicxml"
        export_mscz(src_path, out_mxl)
    pass
