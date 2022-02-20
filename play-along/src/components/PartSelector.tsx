import { useEffect, useState } from "react";
import { js2xml, xml2js } from "xml-js";
import { ScoreInfo } from "../scores";
import { getAll, getSingle } from "../util/util";
import { Score } from "./Score";

type PartSelectorState = {
  xml: any;
  origXml: any;
  parts: { id: string; name: string }[];
  currPartIdx: number;
};

/** Loads a local xml file. */
const loadXmlFile = async (fileName: string) => {
  const res = await fetch(fileName);
  return res.text();
};

const getScorePartwise = (xml: any) => {
  const jasonized = xml2js(xml);
  const scorePartwise = getSingle(jasonized, "score-partwise");
  return { jasonized, scorePartwise };
};

const extractPartXml = (state: PartSelectorState) => {
  const partId = state.parts[state.currPartIdx].id;

  const { jasonized, scorePartwise } = getScorePartwise(state.origXml);
  const partList = getSingle(scorePartwise, "part-list");
  partList.elements = partList.elements.filter((el: any) => {
    return el.name === "score-part" && el.attributes.id === partId;
  });

  scorePartwise.elements = scorePartwise.elements.filter((el: any) => {
    if (el.name === "part") {
      return el.attributes.id === partId;
    }
    return true;
  });

  console.log(partId, scorePartwise, jasonized);
  return js2xml(jasonized);
};

export const PartSelector = (props: { scoreInfo: ScoreInfo }) => {
  const [origXmlAndParts, setOrigXmlAndParts] =
    useState<null | PartSelectorState>(null);

  useEffect(() => {
    const scoreInfo = props.scoreInfo;

    const loadLocal = async () => {
      const fileName = `./scores/${scoreInfo.fileName}.musicxml`;
      const xmlTxt = await loadXmlFile(fileName);

      const { scorePartwise } = getScorePartwise(xmlTxt);
      const partList = getSingle(scorePartwise, "part-list");
      const parts = getAll(partList, "score-part").map((el: any) => {
        return {
          id: el.attributes.id,
          name: getSingle(el, "part-name").elements[0].text,
        };
      });
      console.log("nice", partList, parts);
      const baseState = {
        xml: xmlTxt,
        parts,
        currPartIdx: 0,
        origXml: xmlTxt,
      };
      setOrigXmlAndParts({
        ...baseState,
        xml: extractPartXml(baseState),
      });
    };
    loadLocal();
  }, [props.scoreInfo]);

  if (origXmlAndParts !== null) {
    const nextPart = () => {
      const nParts = origXmlAndParts.parts.length;
      const currIdx = origXmlAndParts.currPartIdx;
      const newIndex = Math.min(currIdx + 1, nParts - 1);
      if (newIndex === currIdx) {
        return;
      }
      const xml = extractPartXml(origXmlAndParts);
      setOrigXmlAndParts({
        ...origXmlAndParts,
        xml: xml,
        currPartIdx: newIndex,
      });
    };
    const currPart = origXmlAndParts.parts[origXmlAndParts.currPartIdx];
    return (
      <>
        <p>Loaded part {currPart.name}</p>
        <button onClick={nextPart}>Next part</button>
        <Score xmlTxt={origXmlAndParts.xml} scoreInfo={props.scoreInfo}></Score>
      </>
    );
  }
  return <></>;
};
