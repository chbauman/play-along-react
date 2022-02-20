import { useEffect, useState } from "react";
import { xml2js } from "xml-js";
import { ScoreInfo } from "../scores";
import { getAll, getSingle } from "../util/util";
import { Score } from "./Score";

const loadXmlFile = async (fileName: string) => {
  const res = await fetch(fileName);
  return res.text();
};

export const PartSelector = (props: { scoreInfo: ScoreInfo }) => {
  const [origXmlAndParts, setOrigXmlAndParts] = useState<null | {
    xml: any;
    parts: { id: string; name: string }[];
    currPartIdx: number;
  }>(null);

  useEffect(() => {
    const scoreInfo = props.scoreInfo;

    const loadLocal = async () => {
      const fileName = `./scores/${scoreInfo.fileName}.musicxml`;
      const xmlTxt = await loadXmlFile(fileName);

      const jasonized = xml2js(xmlTxt);
      const scorePartwise = getSingle(jasonized, "score-partwise");
      const partList = getSingle(scorePartwise, "part-list");
      const parts = getAll(partList, "score-part").map((el: any) => {
        return {
          id: el.attributes.id,
          name: getSingle(el, "part-name").elements[0].text,
        };
      });
      console.log("nice", partList, parts);
      setOrigXmlAndParts({ xml: xmlTxt, parts, currPartIdx: 0 });
    };
    loadLocal();
  }, [props.scoreInfo]);

  if (origXmlAndParts !== null) {
    const currPart = origXmlAndParts.parts[origXmlAndParts.currPartIdx];
    return (
      <>
        <p>Loaded part {currPart.name}</p>
        <Score xmlTxt={origXmlAndParts.xml} scoreInfo={props.scoreInfo}></Score>
      </>
    );
  }
  return <></>;
};
