import YouTube from "react-youtube";
import React, { useCallback, useRef } from "react";
import { Player } from "./util";
import { useParams } from "react-router-dom";
import { ScoreInfo, scores } from "../../scores";
import { wrapWithNav } from "../NavBar";
import { PartSelector } from "../PartSelector";

export const playerSizePx = {
  height: "390px",
  width: "640px",
};

export const YtScoreRoute = () => {
  let { scoreId } = useParams();

  const scoreInfoCand = scores.filter((el) => el.videoId === scoreId);
  if (scoreInfoCand.length === 0) {
    // No match for score ID found in list.
    const comp = <h3>YouTube score with ID '{scoreId}' not found :(</h3>;
    return wrapWithNav(comp, "404");
  }
  const scoreInfo = scoreInfoCand[0];
  return <FoundYtScore scoreInfo={scoreInfo} />;
};

const FoundYtScore = ({ scoreInfo }: { scoreInfo: ScoreInfo }) => {
  const player = useYoutubePlayer(scoreInfo.videoId);
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
const useYoutubePlayer = (videoId: string) => {
  const playerRef = useRef<any>();

  const getTime = useCallback(async () => {
    return await playerRef.current.getInternalPlayer().getCurrentTime();
  }, [playerRef]);

  const comp = (
    <YoutubePlayer playerRef={playerRef} videoId={videoId}></YoutubePlayer>
  );

  return { comp, getTime } as Player;
};

/** Youtube video player component. */
const YoutubePlayer = ({
  videoId,
  playerRef,
}: {
  videoId: string;
  playerRef: any;
}) => {
  const opts = {
    ...playerSizePx,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  // This is a hack for shutting up typescript compiler!
  const yt: any = React.createElement(YouTube as any, {
    videoId,
    opts,
    ref: playerRef,
    onReady: () => console.log(`I'm ready, loaded ${videoId}!`),
  });
  return <div style={{ ...playerSizePx, margin: "auto" }}>{yt}</div>;
};
