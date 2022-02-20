/** Map video seconds to measure number. */
export type MeasureMap = { [key: number]: number };

const matchData: MeasureMap = {
  0: 1,
  12: 7,
  20: 11,
  39: 21,
  63: 33,
};

export const scores = [{ videoId: "lDQ7hXMLxGc", measureMap: matchData }];
