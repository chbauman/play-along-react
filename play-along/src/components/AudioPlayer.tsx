import { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { Container } from "react-bootstrap";
import { MeasureMap } from "../scores";
import { wrapWithNav } from "./NavBar";
import { PartSelector } from "./PartSelector";

const audioScores = [
  {
    fileName: "Beat_It",
    name: "Beat It - Michael Jackson",
  },
];

export const AudioPlayer = () => {
  const fileName = "Beat_It";
  const testFilePath = `audio/${fileName}.mp3`;
  const testMusicXMLPath = `audio/${fileName}.musicxml`;
  const measureJson = `audio/${fileName}.json`;

  const [measureMap, setMM] = useState<null | MeasureMap>(null);

  useEffect(() => {
    fetch(measureJson)
      .then((res) => res.json())
      .then((jData) => {
        const measureMap: MeasureMap = {};
        const [times, bars] = [jData.times, jData.bars];
        const nAnchors = bars.length;
        for (let k = 0; k < nAnchors; ++k) {
          measureMap[times[k]] = bars[k];
        }
        setMM(measureMap);
      });
  }, []);

  if (measureMap === null) {
    // Still loading json
    return <></>;
  }

  let time = 0;
  const comp = (
    <Container>
      <ReactAudioPlayer
        src={testFilePath}
        autoPlay
        controls
        listenInterval={50}
        onListen={(e: any) => {
          time = e;
        }}
      />
    </Container>
  );
  const getTime = async () => time;

  const partSel = (
    <PartSelector
      measureMap={measureMap}
      player={{ comp, getTime }}
      fileName={testMusicXMLPath}
    ></PartSelector>
  );
  return wrapWithNav(partSel, fileName, false);
};
