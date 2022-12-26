import { useEffect, useState } from "react";
import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { ScoreInfo } from "../scores";
import { getSingleXml, parseXml, transpose, transposeKeys } from "../util/util";
import { MovingSheet } from "./Score";
import { useYoutubePlayer, playerSizePx } from "./YtPlayer";

type PartSelectorState = {
  xml: Document;
  origXml: Document;
  parts: { id: string; name: string }[];
  currPartIdx: number;
  pitch: string;
  octave: number;
};

const allOctaves = [1, 0, -1];

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

/** Copy XML object. */
const cloneDoc = (doc: Document) => {
  const newDoc: any = doc.cloneNode(true);
  newDoc.xmlStandalone = (doc as any).xmlStandalone;
  return newDoc as Document;
};

const extractPartXml = (state: PartSelectorState) => {
  const partId = state.parts[state.currPartIdx].id;

  const parsedXML = cloneDoc(state.origXml);

  // Remove all but current part from part-list
  removeUnused(parsedXML, "part-list", "score-part", partId);

  // Remove all but current parts
  removeUnused(parsedXML, "score-partwise", "part", partId);

  // Transpose
  transpose(parsedXML, state.pitch, state.octave);

  return parsedXML;
};

/** Extracts a list with the part information from the XML score. */
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

const pitchStorageKey = "pitch";

/** Load pitch information from localStorage. */
const getPitch = () => {
  const pitch = localStorage.getItem(pitchStorageKey);
  if (pitch === null || !transposeKeys.includes(pitch)) {
    return transposeKeys[0];
  }
  return pitch;
};

const setPitch = (pitch: string) => {
  localStorage.setItem(pitchStorageKey, pitch);
};

export const PitchSetting = ({ title }: { title?: string }) => {
  const [pitch, setPitch] = useState(getPitch());

  return (
    <PitchSelectorDD currPitch={pitch} pitchSetter={setPitch} title={title} />
  );
};

const PitchSelectorDD = ({
  currPitch,
  pitchSetter,
  title,
}: {
  currPitch: string;
  pitchSetter: (el: string) => void;
  title?: string;
}) => {
  const ddTitle =
    title === undefined ? `Pitch: ${currPitch}` : `${title}${currPitch}`;
  return (
    <DropdownButton id="choose-pitch" title={ddTitle} as={ButtonGroup}>
      {transposeKeys.map((el) => {
        return (
          <Dropdown.Item
            key={el}
            onClick={() => {
              setPitch(el);
              pitchSetter(el);
            }}
          >
            {el}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

export const PartSelector = ({ scoreInfo }: { scoreInfo: ScoreInfo }) => {
  const [origXmlAndParts, setOrigXmlAndParts] =
    useState<null | PartSelectorState>(null);

  useEffect(() => {
    // Load XML sheet music from musicxml file and initialize state
    const loadLocal = async () => {
      const fileName = `./scores/${scoreInfo.fileName}.musicxml`;
      const xmlTxt = await loadXmlFile(fileName);
      const parsedXML = parseXml(xmlTxt);

      const baseState = {
        xml: parsedXML,
        parts: getParts(parsedXML),
        currPartIdx: 0,
        origXml: parsedXML,
        pitch: getPitch(),
        octave: 0,
      };
      setOrigXmlAndParts({
        ...baseState,
        xml: extractPartXml(baseState),
      });
    };
    loadLocal();
  }, [scoreInfo]);

  const { youtubeComp, getTime } = useYoutubePlayer(scoreInfo.videoId);

  if (origXmlAndParts !== null) {
    const currPitch = origXmlAndParts.pitch;
    const currPartIdx = origXmlAndParts.currPartIdx;
    const allParts = origXmlAndParts.parts;
    const currPart = allParts[currPartIdx];
    const currOctave = origXmlAndParts.octave;

    // Part changer
    const setPart = (
      newPartIdx: number,
      newPitch: string,
      newOctave: number
    ) => {
      if (
        newPartIdx === currPartIdx &&
        newPitch === currPitch &&
        newOctave === currOctave
      ) {
        return;
      }
      const newXmlAndParts = {
        ...origXmlAndParts,
        currPartIdx: newPartIdx,
        pitch: newPitch,
        octave: newOctave,
      };
      const xml = extractPartXml(newXmlAndParts);
      setOrigXmlAndParts({
        ...newXmlAndParts,
        xml: xml,
        currPartIdx: newPartIdx,
      });
    };

    // Only add part chooser dropdown if there are at least two parts.
    const partChooser =
      allParts.length <= 1 ? null : (
        <DropdownButton id="choose-part" title="Select Part" as={ButtonGroup}>
          {allParts.map((el, idx) => {
            return (
              <Dropdown.Item
                key={idx}
                onClick={() => setPart(idx, currPitch, currOctave)}
              >
                {el.name}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      );

    // Only add part chooser dropdown if there are at least two parts.
    const octToStr = (el: number) => (el > 0 ? `+${el}` : `${el}`);
    const octTitle =
      currOctave === 0 ? "Octave" : `Octave ${octToStr(currOctave)}`;
    const octaveChooser = (
      <DropdownButton id="choose-octave" title={octTitle} as={ButtonGroup}>
        {allOctaves.map((el) => {
          return (
            <Dropdown.Item
              key={el}
              onClick={() => setPart(currPartIdx, currPitch, el)}
            >
              {octToStr(el)}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
    );

    // Pitch selector dropdown
    const pitchSetter = (el: string) => setPart(currPartIdx, el, currOctave);
    const pitchSelector = (
      <DropdownButton
        id="choose-key"
        title={`Pitch: ${currPitch}`}
        as={ButtonGroup}
      >
        {transposeKeys.map((el) => {
          return (
            <Dropdown.Item key={el} onClick={() => pitchSetter(el)}>
              {el}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
    );

    // (Part and) pitch selector dropdowns
    const partSelectorDD = (
      <ButtonGroup>
        {partChooser}
        {pitchSelector}
        {octaveChooser}
      </ButtonGroup>
    );

    // Sheet music
    const score = (
      <MovingSheet
        xml={origXmlAndParts.xml}
        scoreInfo={scoreInfo}
        getTime={getTime}
        key={scoreInfo.videoId}
      ></MovingSheet>
    );

    // Info about current part and pitch and dropdown for changing
    const partInfo = (
      <div
        className="d-flex justify-content-between mt-1 mb-1"
        style={{ width: playerSizePx.width, margin: "auto" }}
      >
        <h4>Part: {currPart.name}</h4>
        <div className="d-flex">{partSelectorDD}</div>
      </div>
    );

    // Put all together
    return (
      <>
        {youtubeComp}
        {partInfo}
        {score}
      </>
    );
  }
  return <></>;
};
