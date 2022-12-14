import { useEffect, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { MeasureMap, ScoreInfo } from "../scores";
import Spline from "typescript-cubic-spline";

const fullW = 40000;
const screenAnchorFactor = 0.3;
const osmdId = "osmd";

/** Load the score from the xml. */
const loadOsmd = async (xml: Document) => {
  const osmd = new OpenSheetMusicDisplay(osmdId, {
    drawCredits: false,
    drawPartNames: false,
  });

  await osmd.load(xml);
  osmd.setCustomPageFormat(fullW, 2000);
  osmd.render();
  return osmd;
};

/** Creates an interpolator function that maps from seconds to x position. */
const getInterpolator = (
  osmd: OpenSheetMusicDisplay,
  measureMap: MeasureMap
) => {
  const measureList = osmd.GraphicSheet.MeasureList;
  const measureXList = measureList.map((el) => (el[0] as any)?.stave.x);

  let mmEntries = Object.entries(measureMap);
  const lastEntry = mmEntries[mmEntries.length - 1];
  const idxNr = parseInt(lastEntry[0]);
  const endEntries: [string, number][] = [1, 2, 3, 4, 5].map((el) => {
    return [`${idxNr + el * 5}`, lastEntry[1]];
  });
  const start: [string, number] = ["0", 0];
  mmEntries = [start].concat(mmEntries).concat(endEntries);

  const nEntries = mmEntries.length;
  const getFromEntry = (idx: number) => {
    const [secStr, measIdx] = mmEntries[idx];
    return [parseFloat(secStr), measIdx];
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

  // Create a Spline object
  const spline = new Spline(secs, xVals);
  return (val: number) => {
    const offset = screenAnchorFactor * window.innerWidth;
    return Math.max(0, spline.at(val) - offset);
  };
};

/** The sheet music component. */
export const Score = (props: {
  xml: Document;
  scoreInfo: ScoreInfo;
  getTime: () => Promise<number>;
}) => {
  const [currXPos, setCurrXPos] = useState(0);
  const [ipOrNull, setIpOrNull] = useState<{
    ip: (n: number) => number;
  } | null>(null);

  const { getTime, scoreInfo, xml } = props;
  useEffect(() => {
    // Load the sheet music display and create interpolator.
    const loadLocal = async () => {
      const osmd = await loadOsmd(xml);
      const ipObj = getInterpolator(osmd, scoreInfo.measureMap);
      setIpOrNull({ ip: ipObj });
    };
    loadLocal();
    return () => {
      setIpOrNull(null);
    };
  }, [xml, scoreInfo.measureMap]);

  const marginRight = Math.round(fullW - currXPos - window.innerWidth);

  useEffect(() => {
    // Register callback that adjusts the sheet according to the video
    if (ipOrNull !== null) {
      const ipObj = ipOrNull.ip;
      const interval = setInterval(async () => {
        const elapsedSec = await getTime();
        const xPos = ipObj(elapsedSec);
        setCurrXPos(xPos);
      }, 20); // ms refresh.

      return () => {
        clearInterval(interval);
      };
    }
  }, [getTime, ipOrNull]);

  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <div
          id={osmdId}
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
