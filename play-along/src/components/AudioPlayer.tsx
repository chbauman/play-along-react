import { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { Container } from "react-bootstrap";
import { MeasureMap } from "../scores";
import { wrapWithNav } from "./NavBar";
import { PartSelector } from "./PartSelector";

const audioScores = [
  {
    fileName: "Beat_It",
    title: "Beat It",
    interpret: "Michael Jackson",
  },
  {
    fileName: "Blinging",
    title: "Blinding Lights",
    interpret: "The Weeknd",
  },
  {
    fileName: "Seasons_in_the_Sun",
    title: "Seasons in the Sun",
    interpret: "Terry Jacks",
  },
  {
    fileName: "Love_Is_Like_Oxygen",
    title: "Love Is Like Oxygen",
    interpret: "Sweet",
  },
];

export const AudioPlayer = () => {
  const fileName = "Love_Is_Like_Oxygen";

  const fileInfoCand = audioScores.filter((el) => el.fileName === fileName);
  console.assert(fileInfoCand.length === 1);
  const fileInfo = fileInfoCand[0];
  const title = `${fileInfo.title} - ${fileInfo.interpret}`;

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
  }, [measureJson]);

  if (measureMap === null) {
    // Still loading json
    return <></>;
  }

  let time = 0;
  const comp = (
    <Container className="text-center">
      <ReactAudioPlayer
        src={testFilePath}
        autoPlay
        controls
        listenInterval={20}
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
  return wrapWithNav(partSel, title, false);
};
