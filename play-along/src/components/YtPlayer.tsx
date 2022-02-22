import YouTube from "react-youtube";
import React, { useCallback, useRef } from "react";

const playerSize = {
  height: "390",
  width: "640",
};
export const playerSizePx = {
  height: "390px",
  width: "640px",
};

export const YoutubePlayer = ({
  videoId,
  playerRef,
}: {
  videoId: string;
  playerRef: any;
}) => {
  const opts = {
    ...playerSize,
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
    onReady: () => console.log("I'm ready!"),
  });
  return <div style={{ ...playerSizePx, margin: "auto" }}>{yt}</div>;
};

/** YouTube player hook. */
export const useYoutubePlayer = (videoId: string) => {
  const playerRef = useRef<any>();

  const getTime = useCallback(async () => {
    return await playerRef.current.getInternalPlayer().getCurrentTime();
  }, [playerRef]);

  const comp = (
    <YoutubePlayer playerRef={playerRef} videoId={videoId}></YoutubePlayer>
  );

  return { youtubeComp: comp, getTime };
};
