import { useEffect, useState } from "react";
import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { ScoreInfo } from "../scores";
import { getSingleXml, parseXml, transpose, transposeKeys } from "../util/util";
import { Score } from "./Score";
import { useYoutubePlayer, playerSizePx } from "./YtPlayer";

type PartSelectorState = {
  xml: Document;
  origXml: Document;
  parts: { id: string; name: string }[];
  currPartIdx: number;
  pitch: string;
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

const clodeDoc = (doc: Document) => {
  const newDoc: any = doc.cloneNode(true);
  newDoc.xmlStandalone = (doc as any).xmlStandalone;
  return newDoc as Document;
};

const extractPartXml = (state: PartSelectorState) => {
  const partId = state.parts[state.currPartIdx].id;

  const parsedXML = clodeDoc(state.origXml);

  // Remove all but current part from part-list
  removeUnused(parsedXML, "part-list", "score-part", partId);

  // Remove all but current parts
  removeUnused(parsedXML, "score-partwise", "part", partId);

  // Transpose
  transpose(parsedXML, state.pitch);

  return parsedXML;
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
        xml: parsedXML,
        parts,
        currPartIdx: 0,
        origXml: parsedXML,
        pitch: transposeKeys[0],
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
    const setPart = (newPartIdx: number, newPitch: string) => {
      if (
        newPartIdx === origXmlAndParts.currPartIdx &&
        newPitch === origXmlAndParts.pitch
      ) {
        return;
      }
      const newXmlAndParts = {
        ...origXmlAndParts,
        currPartIdx: newPartIdx,
        pitch: newPitch,
      };
      const xml = extractPartXml(newXmlAndParts);
      setOrigXmlAndParts({
        ...newXmlAndParts,
        xml: xml,
        currPartIdx: newPartIdx,
      });
    };
    const allParts = origXmlAndParts.parts;
    const currPart = allParts[origXmlAndParts.currPartIdx];
    const currPitch = origXmlAndParts.pitch;
    const partChooser =
      allParts.length <= 1 ? null : (
        <DropdownButton id="choose-part" title="Select Part" as={ButtonGroup}>
          {origXmlAndParts.parts.map((el, idx) => {
            return (
              <Dropdown.Item key={idx} onClick={() => setPart(idx, currPitch)}>
                {el.name}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      );
    const partSelectorDD = (
      <ButtonGroup>
        {partChooser}
        <DropdownButton id="choose-key" title="Select Pitch" as={ButtonGroup}>
          {transposeKeys.map((el) => {
            return (
              <Dropdown.Item
                key={el}
                onClick={() => setPart(origXmlAndParts.currPartIdx, el)}
              >
                {el}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </ButtonGroup>
    );
    return (
      <>
        {youtubeComp}
        <div
          className="d-flex justify-content-between mt-1 mb-1"
          style={{ width: playerSizePx.width, margin: "auto" }}
        >
          <h4>
            Part: {currPart.name}, {currPitch}
          </h4>
          <div className="d-flex">{partSelectorDD}</div>
        </div>
        <Score
          xml={origXmlAndParts.xml}
          scoreInfo={props.scoreInfo}
          getTime={getTime}
          key={props.scoreInfo.videoId}
        ></Score>
      </>
    );
  }
  return <></>;
};
