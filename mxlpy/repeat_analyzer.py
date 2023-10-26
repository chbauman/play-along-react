import xml.etree.ElementTree as ET
from typing import List, Dict


def find_next_coda(measures: List[ET.Element], curr_ct: int) -> int:
    for ct, meas in enumerate(measures[curr_ct:]):
        coda = meas.find(".//coda")
        if coda is not None:
            return ct + curr_ct
    return curr_ct


def clear_repeats(indices: List[int]) -> List[int]:
    rev_idx = []
    curr_min = indices[-1] + 1
    for idx in reversed(indices):
        if idx < curr_min:
            curr_min = idx
            rev_idx.append(idx)

    return list(reversed(rev_idx))


def handle_jump_back(
    curr_indices: List[int], to_idx: int, end_idx: int, with_repeats: bool
):
    found_ct = None
    first_end_encounter = None
    last_end_encounter = None
    for ct, idx in enumerate(curr_indices):
        if idx == to_idx and found_ct is None:
            found_ct = ct
        if idx == end_idx:
            if first_end_encounter is None:
                first_end_encounter = ct
            last_end_encounter = ct

    end = last_end_encounter if with_repeats else first_end_encounter
    if end is None:
        end = len(curr_indices) - 1

    add_indices = curr_indices[found_ct : (end + 1)]
    if not with_repeats:
        add_indices = clear_repeats(add_indices)
    return [*curr_indices] + add_indices


class RepeatAnalyzer:
    """Analyze score for repeats."""

    repeats: Dict

    last_draw_ct = 0
    end = ""
    curr_str = ""

    def _add(self, ct, new_s: str, new_end: str = ""):
        bars_passed = ct - self.last_draw_ct
        if bars_passed > 0:
            self.curr_str += f" {bars_passed} "
            self.last_draw_ct = ct
        self.curr_str += self.end
        self.end = new_end
        self.curr_str += new_s

    def play_times(self, ct: int) -> int:
        play_times = 1
        for start_idx, data in self.repeats.items():
            for d in data["endings"]:
                if ct >= start_idx and ct <= d["end_ct"]:
                    if d["ending"] is None:
                        play_times += d["times"] - 1
                    else:
                        if ct <= d["ending"]["end_ct"]:
                            play_times += 1
        return play_times

    def analyze_measures(self, measures: List[ET.Element]):
        repeats = {}

        start_idx = 0
        endings = []

        curr_end = None

        self._add(0, "||")
        for ct, meas in enumerate(measures):
            # Handle endings |‾1‾:||‾2‾|
            ending = meas.find(".//ending")
            if ending is not None:
                end_attrs = ending.attrib
                if end_attrs["type"] == "start":
                    end_nr = int(end_attrs["number"])
                    curr_end = {"end_ct": ct, "end_nr": end_nr}
                    self._add(ct, f"|{end_nr}.‾", "‾")

            # Repeats ||:   :||
            reps = meas.findall(".//repeat")
            for rep in reps:
                direction = rep.attrib["direction"]
                if direction == "forward":
                    self._add(ct, "|:")
                    if len(endings) > 0:
                        repeats[start_idx] = {"start": start_idx, "endings": endings}
                        endings = []
                    start_idx = ct
                else:
                    assert direction == "backward", f"Unknown direction '{direction}'!"

                if direction == "backward":
                    times = int(rep.attrib.get("times", "2"))
                    endings.append({"end_ct": ct, "times": times, "ending": curr_end})
                    curr_end = None
                    self._add(ct + 1, ":|")

        self._add(ct, "||")
        print(self.curr_str)
        self.repeats = repeats

        return repeats
