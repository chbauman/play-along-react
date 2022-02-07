import { useEffect, useRef, useState } from "react";
import Vex from "vexflow";
import { OpenSheetMusicDisplay, Pitch, Note } from "opensheetmusicdisplay";

const noteToStr = (el: Note) => {
  // Find note pitch
  let retVal = "B4";
  const isRest = el.isRest();
  if (!isRest) {
    const str = Pitch.getNoteEnumString(el.Pitch.FundamentalNote);
    retVal = `${str}${el.Pitch.Octave + 3}`;
  }

  // Find length
  const den = el.Length.Denominator;
  if (den !== 1) {
    retVal = `${retVal}/${den}`;
  }

  // Handle rests
  if (el.isRest()) {
    retVal = `${retVal}/r`;
  }
  return retVal;
};

const collectBeams = (noteStrings: string[], noteList: Note[]) => {
  const nNotes = noteStrings.length;
  let currCollection: string[] = [];
  const res = [];

  let prevIsBeam = noteList[0].NoteBeam?.BeamNumber !== undefined;
  currCollection.push(noteStrings[0]);

  for (let i = 1; i < nNotes; ++i) {
    const el = noteList[i];
    const currIsBeam = el.NoteBeam?.BeamNumber !== undefined;
    if (currIsBeam === prevIsBeam) {
      currCollection.push(noteStrings[i]);
    } else if (prevIsBeam) {
      res.push({ type: "beam", els: currCollection.join(", ") });
      currCollection = [noteStrings[i]];
    } else {
      res.push({ type: "normal", els: currCollection.join(", ") });
      currCollection = [noteStrings[i]];
    }
    prevIsBeam = currIsBeam;
  }

  if (prevIsBeam) {
    res.push({ type: "beam", els: currCollection.join(", ") });
  } else {
    res.push({ type: "normal", els: currCollection.join(", ") });
  }

  return res;
};

const toNotes = (
  score: any,
  res: { type: "beam" | "normal"; els: string }[]
) => {
  let fullRes: any = null;

  res.forEach((el) => {
    let retVal =
      el.type === "beam"
        ? score.beam(score.notes(el.els))
        : score.notes(el.els);
    if (fullRes === null) {
      fullRes = retVal;
    } else {
      fullRes = fullRes.concat(retVal);
    }
  });

  return fullRes;
};

export const Score = () => {
  const osmdRef = useRef<any>();
  const [osmdSet, setOsmd] = useState(false);

  const loadLocal = async () => {
    const fileName = "./scores/soviet_march_test.musicxml";
    const res = await fetch(fileName);
    const txt = await res.text();

    var osmd = new OpenSheetMusicDisplay("vf");
    osmd.setOptions({
      backend: "svg",
      drawTitle: false,
      // drawingParameters: "compacttight" // don't display title, composer etc., smaller margins
    });
    await osmd.load(txt);
    osmd.render();
    osmdRef.current = osmd;
    setOsmd(true);

    const sheet = osmd.Sheet;
    const first = sheet.SelectionStart.WholeValue;
    const end = sheet.SelectionEnd.WholeValue;

    console.log("Rendered", first, end, osmd.Sheet);
    return txt;
  };

  useEffect(() => {
    loadLocal();
  }, []);

  useEffect(() => {
    var vf = new Vex.Flow.Factory({ renderer: { elementId: "vf-test" } });
    var score = vf.EasyScore();
    var system = vf.System();
    if (osmdSet) {
      const osmd = osmdRef.current as OpenSheetMusicDisplay;
      const sourceMeasures = osmd.Sheet.SourceMeasures;
      let beamed: any = null;
      sourceMeasures.map((bar, idx) => {
        const noteList = bar.VerticalSourceStaffEntryContainers.map(
          (el) => el.StaffEntries[0].VoiceEntries[0].Notes[0]
        );
        const noteStrings = noteList.map(noteToStr);
        if (idx === 0) {
          beamed = collectBeams(noteStrings, noteList);
        }
        return noteStrings.join(", ");
      });

      const allNOtes = toNotes(score, beamed);
      system
        .addStave({
          voices: [score.voice(allNOtes, {})],
        })
        .addClef("treble")
        .addTimeSignature("4/4");

      vf.draw();
    }
  }, [osmdSet]);

  return (
    <>
      <div
        id="vf-test"
        style={{
          height: "200px",
          width: "4000px",
          backgroundColor: "green",
          overflowX: "hidden",
          maxWidth: "100%",
        }}
      ></div>
      <div
        style={{
          height: "20px",
        }}
      ></div>
      <div
        id="vf"
        style={{
          height: "200px",
          width: "4000px",
          backgroundColor: "green",
          overflowX: "hidden",
          maxWidth: "100%",
        }}
      ></div>
      <div id="osmd" style={{ width: "100%" }}></div>
    </>
  );
};
