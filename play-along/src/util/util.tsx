import { getClef } from "../components/Settings";
import { scores } from "../scores";

export const DEBUG = false;

export const parseXml = (xmlStr: string) => {
  return new window.DOMParser().parseFromString(xmlStr, "text/xml");
};

export const getSingleXml = (xml: Document, name: string) => {
  const elList = xml.getElementsByTagName(name);
  console.assert(elList.length === 1);
  return elList[0];
};

const pitchMap: { [key: string]: number } = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};
const sharpScale = [
  ["C", 0],
  ["C", 1],
  ["D", 0],
  ["D", 1],
  ["E", 0],
  ["F", 0],
  ["F", 1],
  ["G", 0],
  ["G", 1],
  ["A", 0],
  ["A", 1],
  ["B", 0],
];
const flatScale = [
  ["C", 0],
  ["D", -1],
  ["D", 0],
  ["E", -1],
  ["E", 0],
  ["F", 0],
  ["G", -1],
  ["G", 0],
  ["A", -1],
  ["A", 0],
  ["B", -1],
  ["B", 0],
];
const transposeOptions: { [key: string]: [number, number] } = {
  C: [0, 0],
  "B♭": [2, 2],
  F: [7, 1],
  "E♭": [9, 3],
};
export const transposeKeys = Object.keys(transposeOptions);
const sLen = flatScale.length;
const increase = (
  val: string,
  oct: number,
  alterNum: number,
  n: number,
  scale: any
) => {
  const idx = pitchMap[val];
  const newIdxTot = idx + n + alterNum;
  const newIdx = newIdxTot % sLen;
  const newOct = newIdxTot >= sLen ? oct + 1 : oct;
  const [newPitch, newAlter] = scale[newIdx];
  return [newPitch, newAlter, newOct] as const;
};

/** Find the scale of the given measure if present. */
const getScaleUpdate = (measure: any, fifths: number) => {
  const attrs = measure.getElementsByTagName("attributes")[0];
  if (!attrs) {
    return null;
  }
  const fifthsEls = attrs.getElementsByTagName("fifths");
  if (fifthsEls.length === 0) {
    return null;
  }
  const fifthsEl = fifthsEls[0];
  const fifthsNum = parseInt(fifthsEl.textContent!);
  const newFifths = fifthsNum + fifths;
  fifthsEl.textContent = `${newFifths}`;
  const usedScale = newFifths >= 0 ? sharpScale : flatScale;
  return usedScale;
};

export type FingerType = "none" | "valve" | "trombone";
type Fingering = { [key: number]: (string | undefined)[] };
const valveFingering: Fingering = {
  3: [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    "123",
    "13",
    "23",
    "12",
    "1",
    "2",
  ],
  4: ["0", "123", "13", "23", "12", "1", "2", "0", "23", "12", "1", "2"],
  5: ["0", "12", "1", "2", "0", "1", "2", "0", "23", "12", "1", "2"],
  6: ["0", "12", "1"],
};
const toTrombone: { [key: string]: string } = {
  "0": "1",
  "2": "2",
  "1": "3",
  "12": "4",
  "23": "5",
  "13": "6",
  "123": "7",
};

/** Transpose score to desired pitch. */
export const transpose = (
  xml: Document,
  pitch: string,
  octave: number,
  fingering: FingerType = "trombone"
) => {
  const [chrom, fifths] = transposeOptions[pitch];
  const measures = xml.getElementsByTagName("measure");

  // Handle bass clef
  const clef = getClef();
  if (clef === "Bass") {
    octave = octave - 1; // Set score one octave lower for bass clef
    const clefEl = xml.getElementsByTagName("clef")[0]; // Assuming only one clef!
    for (let k = 0; k < clefEl.children.length; ++k) {
      const childEl = clefEl.children[k];
      const currTag = childEl.tagName;
      if (currTag === "sign") {
        childEl.textContent = "F";
      } else if (currTag === "line") {
        childEl.textContent = "4";
      }
    }
  }

  let usedScale = null;
  for (let measI = 0; measI < measures.length; ++measI) {
    const currMeas = measures[measI];
    const newScaleOrNull = getScaleUpdate(currMeas, fifths);
    if (newScaleOrNull !== null) {
      usedScale = newScaleOrNull;
    }
    console.assert(usedScale !== null, "Invalid scale!");

    const elements = currMeas.getElementsByTagName("note");
    for (let i = 0; i < elements.length; ++i) {
      const noteEl = elements[i];
      const el = noteEl.getElementsByTagName("pitch")[0];
      if (!el) {
        continue;
      }
      const step = el.getElementsByTagName("step")[0];
      const oct = el.getElementsByTagName("octave")[0];
      const alter = el.getElementsByTagName("alter")[0];
      const alterNum = alter ? Number.parseInt(alter.textContent!) : 0;
      const octNum = Number.parseInt(oct.textContent!);
      const [newPitch, newAlter, newOct] = increase(
        step.textContent!,
        octNum + octave,
        alterNum,
        chrom,
        usedScale
      );
      step.textContent = newPitch;
      oct.textContent = newOct.toString();
      if (alter) {
        if (newAlter !== 0) {
          alter.textContent = newAlter.toString();
        } else {
          el.removeChild(alter);
        }
      } else if (newAlter !== 0) {
        const newEl = xml.createElement("alter");
        newEl.textContent = newAlter.toString();
        el.appendChild(newEl);
      }
      if (fingering !== null) {
        const idx = pitchMap[newPitch] + newAlter;
        const oct = clef === "bass" ? newOct + 1 : newOct;
        const valOct = valveFingering[oct];
        let val = valOct !== undefined ? valOct[idx] : undefined;
        if (val !== undefined) {
          if (fingering === "trombone") {
            val = toTrombone[val];
          }

          const notFound = noteEl.getElementsByTagName("notations")[0];
          const notation = notFound ? notFound : xml.createElement("notations");
          const tech = xml.createElement("technical");
          const fing = xml.createElement("fingering");

          fing.textContent = val;
          notation.appendChild(tech);
          tech.appendChild(fing);
          if (!notFound) {
            noteEl.appendChild(notation);
          }
        }
      }

      // Remove any accidentals, they are handled by the "alter" element.
      const acc = noteEl.getElementsByTagName("accidental")[0];
      if (acc) {
        noteEl.removeChild(acc);
      }
    }
  }
};

export const getCopiedScores = () => {
  const scoresWithIndex = scores.map((score) => {
    // Score name must NOT contain dashes (-)!!
    // Artist name may contain dashes.
    const parts = score.name.split("-");
    const artistRaw = parts.slice(1).join("-");
    const name = parts[0].trimStart().trimEnd();
    const artist = artistRaw?.trimStart().trimEnd();
    return { linkId: score.videoId, name, artist };
  });
  return [...scoresWithIndex];
};
