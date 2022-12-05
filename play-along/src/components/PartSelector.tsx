import { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { ScoreInfo } from "../scores";
import { getSingleXml, parseXml, xmlToString } from "../util/util";
import { Score } from "./Score";
import { useYoutubePlayer, playerSizePx } from "./YtPlayer";

type PartSelectorState = {
  xml: string;
  origXml: string;
  parts: { id: string; name: string }[];
  currPartIdx: number;
};

/** Loads a local xml file. */
const loadXmlFile = async (fileName: string) => {
  const res = await fetch(fileName);
  return res.text();
};

const removeUnused = (
  baseEl: Document,
  parName: string,
  childName: string,
  partId: string
) => {
  const parEl = getSingleXml(baseEl, parName);
  parEl.childNodes.forEach((el) => {
    if (el.nodeName === childName && (el as any).id !== partId) {
      parEl.removeChild(el);
    }
  });
};

const extractPartXml = (state: PartSelectorState) => {
  const partId = state.parts[state.currPartIdx].id;

  const parsedXML = parseXml(state.origXml);

  // Remove all but current part from part-list
  removeUnused(parsedXML, "part-list", "score-part", partId);

  // Remove all but current parts
  removeUnused(parsedXML, "score-partwise", "part", partId);

  return xmlToString(parsedXML);
};

export const getParts = (xml: Document) => {
  const scorePwXml = getSingleXml(xml, "score-partwise");
  const parts = [];
  const els = scorePwXml.getElementsByTagName("score-part");
  for (let i = 0; i < els.length; ++i) {
    parts.push({
      id: els[i].id,
      name: els[i].getElementsByTagName("part-name")[0].textContent!,
    });
  }
  return parts;
};

export const PartSelector = (props: { scoreInfo: ScoreInfo }) => {
  const [origXmlAndParts, setOrigXmlAndParts] =
    useState<null | PartSelectorState>(null);

  useEffect(() => {
    const scoreInfo = props.scoreInfo;

    const loadLocal = async () => {
      const fileName = `./scores/${scoreInfo.fileName}.musicxml`;
      const xmlTxt = await loadXmlFile(fileName);

      const parsedXML = parseXml(xmlTxt);

      const parts = getParts(parsedXML);

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

  const { youtubeComp, getTime } = useYoutubePlayer(props.scoreInfo.videoId);

  if (origXmlAndParts !== null) {
    const setPart = (newPartIdx: number) => {
      if (newPartIdx === origXmlAndParts.currPartIdx) {
        return;
      }
      const newXmlAndParts = {
        ...origXmlAndParts,
        currPartIdx: newPartIdx,
      };
      const xml = extractPartXml(newXmlAndParts);
      setOrigXmlAndParts({
        ...newXmlAndParts,
        xml: xml,
        currPartIdx: newPartIdx,
      });
    };
    const currPart = origXmlAndParts.parts[origXmlAndParts.currPartIdx];
    const partSelectorDD = (
      <DropdownButton id="choose-part" title="Select Part">
        {origXmlAndParts.parts.map((el, idx) => {
          return (
            <Dropdown.Item key={idx} onClick={() => setPart(idx)}>
              {el.name}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
    );
    return (
      <>
        {youtubeComp}
        <div
          className="d-flex justify-content-between mt-1 mb-1"
          style={{ width: playerSizePx.width, margin: "auto" }}
        >
          <h4>Part: {currPart.name}</h4>
          {partSelectorDD}
        </div>
        <Score
          xmlTxt={origXmlAndParts.xml}
          scoreInfo={props.scoreInfo}
          getTime={getTime}
        ></Score>
      </>
    );
  }
  return <></>;
};
