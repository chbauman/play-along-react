"""This python script generates the XML files.

It uses the MuseScore executable to export .mscz files to .musicxml
and then reduces the exported XML files by removing certain tags 
and attributes from the XML document.
"""
import argparse
import json
from typing import Optional

from mxlpy import Paths, export_mscz
from mxlpy.clean_xml import reduce_file
from mxlpy.collect_info import extract_all_information
from mxlpy.mscz_to_audio import export_audio
from mxlpy.util import read_json, write_json


def export_yt(n_process: Optional[int]):
    """Export scores corresponding to YouTube videos."""

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
parser.add_argument("n", type=check_positive)
parser.add_argument("-a", "--audio", action="store_true", default=False, required=False)
parser.add_argument(
    "-m", "--no-mp3", action="store_true", default=False, required=False
)


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


if __name__ == "__main__":
    args = parser.parse_args()

    if args.audio:
        export_audio(args.n, not args.no_mp3)

    export_yt(args.n)

    # Extract info from musicXML directly
    score_info = read_json(Paths.SCORE_INFO_FILE)
    extracted_info = extract_all_information(score_info, Paths.XML_SCORES_PATH)
    _write_generated(extracted_info)
