import Vex from "vexflow";

const durationMap: any = {
  "4": "q",
  "2": "8",
  "1": "16",
};

const getDuration = (measure: any) => {
  const durTxt: any = measure.duration[0]._TEXT;
  const durRaw = durationMap[durTxt];
  if (measure.pitch === undefined) {
    // rest
    return `${durRaw}r`;
  }
  return durRaw;
};

const getKeys = (measure: any) => {
  const pitch = measure.pitch;
  if (pitch === undefined) {
    return ["b/4"];
  }

  return pitch.map((el: any) => {
    const step = el.step[0]._TEXT;
    const oct = el.octave[0]._TEXT;
    return `${step}/${oct}`;
  });
};

const wrapArticulations = (vfNote: any, note: any) => {
  // Handle articulations
  if (note.notations) {
    const notat = note.notations[0];
    const artic = notat.articulations;
    if (artic) {
      const artics = artic[0];
      if (artics.staccato) {
        vfNote.addModifier(new Vex.Flow.Articulation("a."));
      }
      console.log(artic);
    }
  }
  return vfNote;
};

export const measureToVex = (measure: any) => {
  const clef = "treble";

  const newNotes = measure.note.map((el: any) => {
    const duration = getDuration(el);
    const keys = getKeys(el);
    const note = new Vex.Flow.StaveNote({ clef, keys, duration });

    return wrapArticulations(note, el);
  });

  return newNotes;
};
