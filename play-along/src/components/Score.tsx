import { useEffect, useRef, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import YouTube from "react-youtube";
import React from "react";

const fullW = 40000;

/** Map video seconds to measure number. */
const matchData = {
  0: 1,
  12: 7,
  20: 11,
  39: 21,
};

const loadFile = async (fileName: string) => {
  const res = await fetch(fileName);
  const txt = await res.text();
  const osmd = new OpenSheetMusicDisplay("osmd", {
    drawCredits: false,
    drawPartNames: false,
  });
  await osmd.load(txt);
  osmd.setCustomPageFormat(fullW, 2000);
  osmd.render();
  return osmd;
};

export const Score = () => {
  const osmdRef = useRef<any>();
  const playerRef = useRef<any>();

  const [currXPos, setCurrXPos] = useState(0);
  const [osmdLoaded, setLoaded] = useState(false);

  const [elapsed, setElapsed] = useState("0");
  console.log(elapsed);

  const getTime = async () => {
    return await playerRef.current.getInternalPlayer().getCurrentTime();
  };

  const loadLocal = async () => {
    const fileName = "./scores/soviet_march_test.musicxml";
    const osmd = await loadFile(fileName);
    osmdRef.current = osmd;
    console.log("osmd", osmd);
    setLoaded(true);
  };

  useEffect(() => {
    loadLocal();
  }, []);

  useEffect(() => {
    const osmd = osmdRef.current;
    if (osmd) {
      const staveNr = 35;
      const currMeasure = osmd.GraphicSheet.MeasureList[staveNr];
      const xPos = (currMeasure[0] as any).stave.x;
      setCurrXPos(xPos);
    }
  }, [osmdLoaded]);

  const { innerWidth: width } = window;
  const marginRight = Math.round(fullW - currXPos - width);

  useEffect(() => {
    const interval = setInterval(async () => {
      const elapsedSec = await getTime();

      // calculations
      const elapsed_ms = Math.floor(elapsedSec * 1000);
      const ms = elapsed_ms % 1000;
      const min = Math.floor(elapsed_ms / 60000);
      const seconds = Math.floor((elapsed_ms - min * 60000) / 1000);

      const resStr =
        min.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0") +
        ":" +
        ms.toString().padStart(3, "0");

      setElapsed(resStr);
    }, 100); // 100 ms refresh. increase it if you don't require millisecond precision

    return () => {
      clearInterval(interval);
    };
  }, []);

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  // This is a hack for shutting up typescript compiler!
  const yt: any = React.createElement(YouTube as any, {
    videoId: "lDQ7hXMLxGc",
    opts,
    ref: playerRef,
    onReady: () => console.log("Fuck"),
  });

  return (
    <>
      {yt}
      <div style={{ overflow: "hidden" }}>
        <div
          id="osmd"
          style={{
            height: "200px",
            width: `${fullW}px`,
            backgroundColor: "darkgreen",
            marginLeft: `-${currXPos}px`,
            marginRight: `-${marginRight}px`,
          }}
        ></div>
      </div>
    </>
  );
};
