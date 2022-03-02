/** Map video seconds to measure number. */
export type MeasureMap = { [key: number]: number };
export type ScoreInfo = {
  videoId: string;
  measureMap: MeasureMap;
  fileName: string;
  name: string;
};

const matchDataSovietMarch: MeasureMap = {
  0: 1,
  12: 7,
  20: 11,
  39: 21,
  63: 33,
  79: 41,
  95: 49,
  114: 59,
};

const myMotherMatchData: MeasureMap = {
  3: 1,
  16: 6,
  21: 7,
  32: 11,
  57: 20,
  81: 29,
  103: 37,
  109: 39,
  133: 48,
  157: 57,
  179: 65,
  188: 68,
  192: 69,
};

const kannibalenliedMeasureMap: MeasureMap = {
  26: 2,
  35: 6,
  67: 21,
  69: 22,
  86: 30,
  119: 45,
  120: 46,
  137: 54,
  170: 69,
  171: 70,
  189: 78,
  204: 85,
  221: 94,
  245: 105,
};

const linksRadSchlagerMM: MeasureMap = {
  14: 2,
  20: 6,
  48: 22,
  63: 31,
  92: 48,
  99: 52,
  127: 68,
  142: 77,
  171: 94,
  190: 105,
  198: 109,
  208: 115,
  234: 130,
};

export const scores: ScoreInfo[] = [
  {
    videoId: "lDQ7hXMLxGc",
    measureMap: matchDataSovietMarch,
    fileName: "soviet_march",
    name: "Soviet March - Red Alert 3 Theme",
  },
  {
    videoId: "4dIiN57DQOI",
    measureMap: myMotherMatchData,
    fileName: "My_Mother_Told_Me",
    name: "My Mother Told Me - Saltatio Mortis",
  },
  {
    videoId: "bF4TmtNwM_4",
    measureMap: kannibalenliedMeasureMap,
    fileName: "Kannibalenlied",
    name: "Kannibalenlied - K.I.Z.",
  },
  {
    videoId: "7ST1YbLwZhs",
    measureMap: linksRadSchlagerMM,
    fileName: "Linksradikaler_Schlager",
    name: "Linksradikaler Schlager - SWISS",
  },
];

// Sort alphabetically based on name
scores.sort((a, b) => {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
});
