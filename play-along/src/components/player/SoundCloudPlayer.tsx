import { useParams } from "react-router-dom";
import { wrapWithNav } from "../NavBar";
import { ScoreInfo } from "../../scores";
import { PartSelector } from "../PartSelector";
import { Player } from "./util";
import { useCallback, useEffect, useRef, useState } from "react";
import { SC } from "../../util/sc.js";
import { playerSizePx } from "./YtPlayer";
import { getCopiedScores } from "../../util/util";

const soundCloudScores: ScoreInfo[] = [
  {
    videoId: "1422120235",
    measureMap: {
      3: 1,
      33: 15,
      65: 30,
      123: 57,
      162: 75,
      222: 103,
      273: 127,
      333: 155,
      385: 179,
      1226: 192,
      1362: 256
    },
    fileName: "Foerderband",
    name: "Foerderband - Codenzi",
  },
];

export const getCopiedSCScores = () => {
  return getCopiedScores(soundCloudScores);
};
export const SCScoreRoute = () => {
  let { scoreId } = useParams();

  const scoreInfoCand = soundCloudScores.filter((el) => {
    return el.videoId === scoreId;
  });
  if (scoreInfoCand.length === 0) {
    // No match for score ID found in list.
    const comp = <h3>SoundCloud score with ID '{scoreId}' not found :(</h3>;
    return wrapWithNav(comp, "404");
  }
  const scoreInfo = scoreInfoCand[0];
  return <FoundYtScore scoreInfo={scoreInfo} />;
};

const FoundYtScore = ({ scoreInfo }: { scoreInfo: ScoreInfo }) => {
  const player = useSoundCloudPlayer(scoreInfo.videoId);
  const fileName = `./scores/${scoreInfo.fileName}.musicxml`;
  const partSel = (
    <PartSelector
      measureMap={scoreInfo.measureMap}
      player={player}
      fileName={fileName}
    ></PartSelector>
  );

  // The score is not wrapped in a container, we use the full width
  // for the sheet music.
  return wrapWithNav(partSel, scoreInfo.name, false);
};

/** YouTube player hook. */
const useSoundCloudPlayer = (videoId: string) => {
  const playerRef = useRef<any>();
  const posRef = useRef<any>();
  const [loaded, setLoded] = useState(false);

  const getTime = useCallback(async () => {
    playerRef.current.getPosition((pos: any) => {
      posRef.current = pos;
    });
    return posRef.current / 1000;
  }, [playerRef]);

  const src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${videoId}`;
  const comp = (
    <div style={{ width: playerSizePx.width, margin: "auto" }}>
      <iframe
        title="sc"
        width="100%"
        height="166"
        allow="autoplay"
        src={src}
        id="myIframe"
      ></iframe>
    </div>
  );

  const startPolling = () => {
    const iframe = document.getElementById("myIframe");
    if (iframe) {
      console.log("iframe is ready");
      setLoded(true);
      return;
    }
    setTimeout(startPolling, 1000);
  };

  useEffect(() => {
    if (loaded) {
      const widget1 = SC.Widget("myIframe");
      playerRef.current = widget1;
    } else {
      startPolling();
    }
  });

  return { comp, getTime } as Player;
};
