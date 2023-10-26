import { DEBUG } from "./util/util";
import scoreInfo from "./scoreInfo.json";

/** Map video seconds to measure number. */
export type MeasureMap = { [key: number]: number };
export type ScoreInfo = {
  videoId: string;
  measureMap: MeasureMap;
  fileName: string;
  name: string;
};

export const scores: ScoreInfo[] = scoreInfo.map((el) => {
  const convertedMM: MeasureMap = {};
  Object.keys(el.measureMap).forEach((key) => {
    convertedMM[Number.parseInt(key)] = (el.measureMap as any)[key];
  });
  const newInfo = { ...el, measureMap: convertedMM };
  return newInfo;
});

if (DEBUG) {
  scores.push({
    videoId: "8spuxFUNIFw",
    measureMap: { 6: 2, 17: 4, 29: 6, 50: 11 },
    fileName: "Calibration",
    name: "Calibration",
  });
  console.log("All scores", scores);
}
