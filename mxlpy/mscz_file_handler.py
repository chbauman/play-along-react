import json
import os
from pathlib import Path
import subprocess
import tempfile

from mxlpy.util import Paths


export_dir = Path(r"C:\Users\Chrigi\Desktop\ExportedScores")


class MSCZFileHandler:
    """MSCZ file handler.

    Basically a wrapper for the MuseScore executable.
    """

    exe_path: Path
    verbose: int = 1

    def __init__(self, musescore_exe_path: Path | None = None):
        """Constructor."""
        if musescore_exe_path is None:
            musescore_exe_path = Paths.MUSESCORE_EXE_PATH

        self.exe_path = musescore_exe_path

    def export_file_to(
        self, src_mscz: Path, dst_file: Path, options: list[str] | None = None
    ) -> None:
        """Export the MSCZ file."""
        if options is None:
            options = []

        args = ["-o", str(dst_file), str(src_mscz), *options]
        self._run_muse_score(args)
        assert dst_file.exists(), f"Export failed for {src_mscz}"

    def _run_muse_score(self, args: list[str]) -> None:
        all_args = [str(self.exe_path), *args]
        if self.verbose > 1:
            print(f"Running {' '.join(all_args)}")
        ret = subprocess.run(all_args)
        if ret.stderr is not None:
            print(ret.stderr)
        if ret.stdout is not None:
            print(ret.stdout)

    def _run_wich_changed_work_dir(self, args: list[str], dir: Path) -> None:
        wd = os.getcwd()
        os.chdir(str(dir))
        self._run_muse_score(args)
        os.chdir(wd)

    def _check_out_dir(self, dir_path: Path) -> None:
        assert dir_path.is_dir(), "Destination does not exist."

    def export_as_musicxml(
        self, src_mscz: Path, dst_dir: Path, *, compressed: bool = False
    ) -> None:
        """Export MSCZ file as musicXML into a given directory."""
        self._check_out_dir(dst_dir)
        ext = "mxl" if compressed else "musicxml"
        out_path = dst_dir / f"{src_mscz.stem}.{ext}"
        self.export_file_to(src_mscz, out_path)

    def export_as_pdf(
        self, src_mscz: Path, dst_dir: Path, *, export_parts: bool = True
    ) -> None:
        """Export MSCZ file as PDF into a given directory."""
        self._check_out_dir(dst_dir)
        out_path = dst_dir / f"{src_mscz.stem}.pdf"
        options = ["-P"] if export_parts else []
        self.export_file_to(src_mscz, out_path, options)

    def export_pdf_parts(self, src_mscz: Path, dst_dir: Path) -> None:
        # Seems to work (at least on Windows)
        self._check_out_dir(dst_dir)
        out_path = dst_dir / f"{src_mscz.stem}.pdf"
        json_obj = [
            {
                "in": str(src_mscz),
                "out": [[f"{dst_dir / src_mscz.stem}-", ".pdf"]],
            }
        ]
        with tempfile.TemporaryDirectory() as td:
            td_path = Path(td)
            out_path = td_path / "out.json"
            with open(out_path, "w") as f:
                json.dump(json_obj, f)

            args = ["-j", str(out_path)]
            self._run_wich_changed_work_dir(args, td_path)

        if self.verbose > 0:
            print(f"Files in {dst_dir}")
            for p in dst_dir.iterdir():
                print(p.name)

    pass


def iter_and_export(mscz_dir: Path, out_dir: Path) -> None:
    handler = MSCZFileHandler()
    handler.verbose = 0

    for sub_dir in mscz_dir.iterdir():
        sd_name = sub_dir.name
        if sub_dir.is_dir() and "backup" not in sd_name:
            print(f"Directory: {sd_name}")
            out_sub_dir = out_dir / sd_name
            out_sub_dir.mkdir(exist_ok=True)
            for sub_path in sub_dir.iterdir():
                if sub_path.suffix.endswith("mscz"):
                    print(f"\tProcessing {sub_path.name}")
                    handler.export_pdf_parts(sub_path, out_sub_dir)


def mscz_main() -> None:
    """Main module function."""

    bau_stei_dir = Paths.COMPOSITIONS_PATH / "BauSteiTrio"
    iter_and_export(bau_stei_dir, export_dir)


if __name__ == "__main__":
    mscz_main()
