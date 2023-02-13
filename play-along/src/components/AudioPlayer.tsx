import { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { Container } from "react-bootstrap";
import { MeasureMap } from "../scores";
import { wrapWithNav } from "./NavBar";
import { PartSelector } from "./PartSelector";
import { useParams } from "react-router-dom";
import { getAudioScores } from "../util/util";
import { playerSizePx } from "./player/YtPlayer";

export const AudioScoreRoute = () => {
  let { scoreId } = useParams();
  const audioScores = getAudioScores();

  const scoreInfoCand = audioScores.filter((el) => el.linkId === scoreId);
  if (scoreInfoCand.length === 0) {
    // No match for score ID found in list.
    const comp = <h3>Score with ID '{scoreId}' not found :(</h3>;
    return wrapWithNav(comp, "404");
  }
  const scoreInfo = scoreInfoCand[0];
  return <AudioPlayer scoreInfo={scoreInfo} />;
};

export const AudioPlayer = ({
  scoreInfo,
}: {
  scoreInfo: { linkId: string; name: string; artist: string };
}) => {
  const title = `${scoreInfo.name} - ${scoreInfo.artist}`;
  const fileName = scoreInfo.linkId;
  const testFilePath = `audio/${fileName}.mp3`;
  const testMusicXMLPath = `audio/${fileName}.musicxml`;
  const measureJson = `audio/${fileName}.json`;

  const [measureMap, setMM] = useState<null | MeasureMap>(null);

  useEffect(() => {
    // Todo: Rewrite with await
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
        style={{ width: playerSizePx.width, margin: "auto" }}
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
