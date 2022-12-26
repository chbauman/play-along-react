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
  Bb: [2, 2],
  F: [7, 1],
  Eb: [9, 3],
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
  const fifthsEl = attrs.getElementsByTagName("fifths")[0];
  if (!fifthsEl) {
    return null;
  }
  const fifthsNum = parseInt(fifthsEl.textContent!);
  const newFifths = fifthsNum + fifths;
  fifthsEl.textContent = `${newFifths}`;
  const usedScale = newFifths >= 0 ? sharpScale : flatScale;
  return usedScale;
};

/** Transpose score to desired pitch. */
export const transpose = (xml: Document, pitch: string) => {
  const [chrom, fifths] = transposeOptions[pitch];
  const measures = xml.getElementsByTagName("measure");

  let usedScale = getScaleUpdate(measures[0], fifths);
  console.assert(usedScale !== null, "Invalid scale!");

  for (let measI = 0; measI < measures.length; ++measI) {
    const currMeas = measures[measI];
    const newScaleOrNull = getScaleUpdate(currMeas, fifths);
    if (newScaleOrNull !== null) {
      usedScale = newScaleOrNull;
    }

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
        octNum,
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

      // Remove any accidentals, they are handled by the "alter" element.
      const acc = noteEl.getElementsByTagName("accidental")[0];
      if (acc) {
        noteEl.removeChild(acc);
      }
    }
  }
};
