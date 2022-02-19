import { useEffect, useRef, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import YouTube from "react-youtube";
import React from "react";
import { xml2js } from "xml-js";
import { getSingle } from "../util/util";

const fullW = 40000;

const leftStaveMarginPx = 1000;

/** Map video seconds to measure number. */
const matchData: { [key: number]: number } = {
  0: 1,
  12: 7,
  20: 11,
  39: 21,
  63: 33,
};

const secsToMeasureNr = (secs: number) => {
  let minIdx: number | null = null;
  let minDist: number | null = null;
  let maxIdx: number | null = null;
  let maxDist: number | null = null;
  Object.keys(matchData).forEach((el) => {
    const elInt = parseInt(el);
    if (elInt >= secs) {
      const diff = elInt - secs;
      if (maxDist === null || maxDist > diff) {
        maxIdx = elInt;
        maxDist = diff;
      }
    }
    if (elInt <= secs) {
      const diff = secs - elInt;
      if (minDist === null || minDist > diff) {
        minIdx = elInt;
        minDist = diff;
      }
    }
  });

  if (minIdx === null) {
    if (maxIdx === null) {
      throw new Error("Fuck");
    }
    return matchData[maxIdx];
  } else if (maxIdx === null) {
    return matchData[minIdx];
  }

  if (minDist === null || maxDist === null) {
    throw new Error("Shit sucks!");
  }

  const frac = minDist / (minDist + maxDist);
  const [minMeas, maxMeas] = [matchData[minIdx], matchData[maxIdx]];
  const measureNrFloat = minMeas + (maxMeas - minMeas) * frac;
  return measureNrFloat;
};

const loadFile = async (fileName: string) => {
  const res = await fetch(fileName);
  const txt = await res.text();
  const osmd = new OpenSheetMusicDisplay("osmd", {
    drawCredits: false,
    drawPartNames: false,
  });

  const jasonized = xml2js(txt);
  const scorePartwise = getSingle(jasonized, "score-partwise");
  console.log("jason", scorePartwise);
  await osmd.load(txt);
  osmd.setCustomPageFormat(fullW, 2000);
  osmd.render();
  return osmd;
};

const interpolatedMap = (secs: number, osmd: OpenSheetMusicDisplay | null) => {
  if (!osmd) {
    return 0;
  }

  // Interpolate again
  const measureNr = secsToMeasureNr(secs);
  const staveNr = Math.floor(measureNr);
  const currMeasure = osmd.GraphicSheet.MeasureList[staveNr - 1];
  const nextMeasure = osmd.GraphicSheet.MeasureList[staveNr];
  const xPos = (currMeasure[0] as any).stave.x;
  const xPosNext = (nextMeasure[0] as any).stave.x;
  const xPosInterpolated = xPos + (xPosNext - xPos) * (measureNr - staveNr);
  return xPosInterpolated - leftStaveMarginPx;
};

export const Score = () => {
  const osmdRef = useRef<any>();
  const playerRef = useRef<any>();

  const [currXPos, setCurrXPos] = useState(0);

  const getTime = async () => {
    return await playerRef.current.getInternalPlayer().getCurrentTime();
  };

  const loadLocal = async () => {
    const fileName = "./scores/soviet_march.musicxml";
    const osmd = await loadFile(fileName);

    const parts = osmd.Sheet.Parts;
    const partIdx = 0;

    // osmd.Sheet.Parts = osmd.Sheet.Parts.filter((el, idx) => idx === partIdx);
    osmdRef.current = { osmd, parts, partIdx };
    console.log("osmd", osmd);
  };

  useEffect(() => {
    loadLocal();
  }, []);

  const { innerWidth: width } = window;
  const marginRight = Math.round(fullW - currXPos - width);

  useEffect(() => {
    const interval = setInterval(async () => {
      const elapsedSec = await getTime();
      const xPos = interpolatedMap(elapsedSec, osmdRef.current.osmd);
      setCurrXPos(xPos);
    }, 20); // 100 ms refresh. increase it if you don't require millisecond precision

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
