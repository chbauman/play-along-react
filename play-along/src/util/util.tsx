export const parseXml = (xmlStr: string) => {
  return new window.DOMParser().parseFromString(xmlStr, "text/xml");
};

export const xmlToString = (xml: Document) =>
  new XMLSerializer().serializeToString(xml);

export const getSingleXml = (xml: Document, name: string) => {
  const elList = xml.getElementsByTagName(name);
  console.assert(elList.length === 1);
  return elList[0];
};

const scale = ["C", "D", "E", "F", "G", "A", "B"];
const sLen = scale.length;
const increase = (val: string, oct: number, n: number) => {
  const idx = scale.indexOf(val);
  const newIdx = (idx + n) % sLen;
  const newOct = idx + n >= sLen ? oct + 1 : oct;
  const newStep = scale[newIdx];
  return [newStep, newOct] as const;
};

export const transpose = (xml: Document, steps: number = 1) => {
  console.log(xml);
  const elements = xml.getElementsByTagName("pitch");
  for (let i = 0; i < elements.length; ++i) {
    const el = elements[i];
    const step = el.getElementsByTagName("step")[0];
    const oct = el.getElementsByTagName("octave")[0];
    const octNum = Number.parseInt(oct.textContent!);
    const [newStep, newOct] = increase(step.textContent!, octNum, steps);
    if (newStep === undefined) {
      console.log(newStep, step.textContent);
    }
    step.textContent = newStep;
    oct.textContent = newOct.toString();
  }
};
