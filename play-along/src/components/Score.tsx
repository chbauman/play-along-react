import { useEffect, useRef, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { xml2js } from "xml-js";
import { getSingle } from "../util/util";
import { useYoutubePlayer } from "./YtPlayer";
import { MeasureMap, scores } from "../scores";

const fullW = 40000;

const leftStaveMarginPx = 1000;

const secsToMeasureNr = (secs: number, matchData: MeasureMap) => {
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
  console.log("json", scorePartwise);
  await osmd.load(txt);
  osmd.setCustomPageFormat(fullW, 2000);
  osmd.render();
  return osmd;
};

const interpolatedMap = (
  secs: number,
  osmd: OpenSheetMusicDisplay | null,
  measureMap: MeasureMap
) => {
  if (!osmd) {
    return 0;
  }

  // Interpolate again
  const measureNr = secsToMeasureNr(secs, measureMap);
  const staveNr = Math.floor(measureNr);
  const currMeasure = osmd.GraphicSheet.MeasureList[staveNr - 1];
  const nextMeasure = osmd.GraphicSheet.MeasureList[staveNr];
  const xPos = (currMeasure[0] as any).stave.x;
  const xPosNext = (nextMeasure[0] as any).stave.x;
  const xPosInterpolated = xPos + (xPosNext - xPos) * (measureNr - staveNr);
  return xPosInterpolated - leftStaveMarginPx;
};

export const ScoreSelector = () => {
  const nScores = scores.length;
  const [scoreIdx, setScoreIdx] = useState<number | null>(null);

  const selectNext = () => {
    if (scoreIdx === null) {
      setScoreIdx(0);
      return;
    }
    const newIdx = Math.min(scoreIdx + 1, nScores - 1);
    setScoreIdx(newIdx);
  };
  const scoreSelectorComp = <button onClick={selectNext}>Next Score</button>;
  const scoreComp =
    scoreIdx === null ? <></> : <Score scoreIdx={scoreIdx}></Score>;
  return (
    <>
      {scoreSelectorComp}
      {scoreComp}
    </>
  );
};

export const Score = (props: { scoreIdx: number }) => {
  const scoreInfo = scores[props.scoreIdx];
  const osmdRef = useRef<any>();

  const { youtubeComp, getTime } = useYoutubePlayer(scoreInfo.videoId);

  const [currXPos, setCurrXPos] = useState(0);

  useEffect(() => {
    const loadLocal = async () => {
      const fileName = `./scores/${scoreInfo.fileName}.musicxml`;
      const osmd = await loadFile(fileName);

      const parts = osmd.Sheet.Parts;
      const partIdx = 0;

      // osmd.Sheet.Parts = osmd.Sheet.Parts.filter((el, idx) => idx === partIdx);
      osmdRef.current = { osmd, parts, partIdx };
      console.log("osmd", osmd);
    };
    loadLocal();
  }, [scoreInfo]);

  const { innerWidth: width } = window;
  const marginRight = Math.round(fullW - currXPos - width);

  useEffect(() => {
    const interval = setInterval(async () => {
      const elapsedSec = await getTime();
      const xPos = interpolatedMap(
        elapsedSec,
        osmdRef.current.osmd,
        scoreInfo.measureMap
      );
      setCurrXPos(xPos);
    }, 20); // ms refresh.

    return () => {
      clearInterval(interval);
    };
  }, [getTime, scoreInfo]);

  return (
    <>
      {youtubeComp}
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
