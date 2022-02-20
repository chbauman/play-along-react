/** Map video seconds to measure number. */
export type MeasureMap = { [key: number]: number };
export type ScoreInfo = {
  videoId: string;
  measureMap: MeasureMap;
  fileName: string;
};

const matchData: MeasureMap = {
  0: 1,
  12: 7,
  20: 11,
  39: 21,
  63: 33,
};

export const scores: ScoreInfo[] = [
  { videoId: "lDQ7hXMLxGc", measureMap: matchData, fileName: "soviet_march" },
];
