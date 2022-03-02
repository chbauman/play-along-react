import { useEffect, useRef, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { MeasureMap, ScoreInfo } from "../scores";
import Spline from "typescript-cubic-spline";

const fullW = 40000;
const leftStaveMarginPx = 1000;

const loadOsmd = async (xmlTxt: string) => {
  const osmd = new OpenSheetMusicDisplay("osmd", {
    drawCredits: false,
    drawPartNames: false,
  });

  await osmd.load(xmlTxt);
  osmd.setCustomPageFormat(fullW, 2000);
  osmd.render();
  return osmd;
};

/** Interpolates from seconds to x position. */
const interpolate = (
  osmd: OpenSheetMusicDisplay | null,
  measureMap: MeasureMap
) => {
  if (!osmd) {
    return null;
  }
  const measureList = osmd.GraphicSheet.MeasureList;
  const measureXList = measureList.map((el) => (el[0] as any)?.stave.x);

  const mmEntries = Object.entries(measureMap);
  const nEntries = mmEntries.length;
  const getFromEntry = (idx: number) => {
    const [secStr, measIdx] = mmEntries[idx];
    return [parseInt(secStr), measIdx];
  };
  let [currSec, currMeasIdx] = getFromEntry(0);

  const secs = [];
  const xVals = [];
  for (let k = 0; k < nEntries - 1; ++k) {
    let [nextSec, nextMeasIdx] = getFromEntry(k + 1);
    const nextX = measureXList[nextMeasIdx - 1];
    if (nextX === undefined) {
      continue;
    }
    // Do stuff
    for (let i = currMeasIdx; i < nextMeasIdx; ++i) {
      const x = measureXList[i - 1];
      if (x !== undefined) {
        const ipSecs =
          currSec +
          ((nextSec - currSec) * (i - currMeasIdx)) /
            (nextMeasIdx - currMeasIdx);
        secs.push(ipSecs);
        xVals.push(x);
      }
    }

    currSec = nextSec;
    currMeasIdx = nextMeasIdx;
  }
  secs.push(currSec);
  xVals.push(measureXList[currMeasIdx - 1]);

  // new a Spline object
  const spline = new Spline(secs, xVals);
  return (val: number) => Math.max(0, spline.at(val) - leftStaveMarginPx);
};

export const Score = (props: {
  xmlTxt: string;
  scoreInfo: ScoreInfo;
  getTime: () => Promise<any>;
}) => {
  const osmdRef = useRef<any>();

  const [currXPos, setCurrXPos] = useState(0);
  const [osmdSet, setOsmdSet] = useState(false);

  useEffect(() => {
    const loadLocal = async () => {
      const osmd = await loadOsmd(props.xmlTxt);
      osmdRef.current = osmd;
      setOsmdSet(true);
    };
    loadLocal();
    return () => {
      setOsmdSet(false);
      osmdRef.current = null;
    };
  }, [props.xmlTxt]);

  const { innerWidth: width } = window;
  const marginRight = Math.round(fullW - currXPos - width);

  const { getTime, scoreInfo } = props;
  useEffect(() => {
    const ipObj = interpolate(osmdRef.current, scoreInfo.measureMap);
    const interval = setInterval(async () => {
      if (ipObj) {
        const elapsedSec = await getTime();
        const xPos = ipObj(elapsedSec);
        setCurrXPos(xPos);
      }
    }, 20); // ms refresh.

    return () => {
      clearInterval(interval);
    };
  }, [getTime, scoreInfo, osmdSet]);

  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <div
          id="osmd"
          style={{
            height: "200px",
            width: `${fullW}px`,
            marginLeft: `-${currXPos}px`,
            marginRight: `-${marginRight}px`,
          }}
        ></div>
      </div>
    </>
  );
};
