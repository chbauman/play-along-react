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

const waterfallMM = {
  1: 2,
  15: 10,
  50: 30,
  71: 42,
  91: 54,
  119: 70,
  133: 78,
  145: 85,
};
const sfMM = {
  6: 3,
  42: 20,
  79: 37,
  110: 52,
  143: 67,
};

const zirkusMM = {
  8: 2,
  24: 9,
  43: 18,
  60: 26,
  78: 34,
  101: 45,
  116: 52,
  133: 60,
  157: 71,
  189: 86,
};
const amenoMM = {
  18: 3,
  32: 9,
  36: 11,
  50: 17,
  53: 19,
  77: 29,
  91: 35,
  104: 41,
  121: 48,
  142: 57,
  158: 64,
  170: 69,
  181: 74,
  198: 81,
  221: 91,
};

const tddiMM = {
  69: 5,
  111: 21,
  142: 33,
  185: 49,
  216: 61,
  247: 73,
  251: 74,
  284: 86,
  292: 90,
};

const wbdMM = {
  3: 2,
  36: 13,
  91: 31,
  115: 39,
  146: 49,
  170: 57,
  194: 65,
  219: 73,
};

const zeitMM = {
  6: 1,
  37: 17,
  84: 41,
  98: 48,
  101: 50,
  117: 58,
  133: 66,
  146: 73,
  160: 80,
  189: 95,
};

const saufiSaufiMM = {
  2: 1,
  14: 8,
  16: 9,
  30: 17,
  58: 33,
  72: 41,
  79: 45,
  107: 61,
  124: 71,
  138: 79,
  157: 90,
  200: 115,
};

const sosMM = {
  3: 3,
  37: 33,
  71: 63,
  106: 94,
  140: 125,
  172: 153,
};

const htrjMM = {
  6: 6,
  25: 20,
  39: 30,
  61: 46,
  78: 58,
  97: 72,
  114: 84,
};

const ritgMM = {
  9: 2,
  49: 24,
  80: 41,
  107: 56,
  149: 79,
};

const horrMM = {
  5: 2,
  37: 26,
  69: 50,
  101: 74,
  133: 98,
};

const sidnrMM = {
  1: 1,
  21: 13,
  41: 25,
  53: 32,
  68: 41,
  81: 49,
  95: 57,
  108: 65,
  120: 72,
  135: 81,
  189: 113,
};

const oktoberMM = {
  14: 6,
  36: 13,
  38: 13,
  51: 22,
  64: 30,
  77: 38,
  90: 46,
  115: 62,
};

const lolitaMM = {
  45: 2,
  81: 35,
  100: 52,
  137: 85,
  172: 116,
};

const bambolaMM = {
  10: 10,
  41: 36,
  72: 62,
  101: 86,
  124: 106,
  143: 121,
};

const youtheoneMM = {
  8: 2,
  46: 25,
  79: 45,
  125: 73,
  179: 106,
  202: 120,
};

const oskarMM = {
  12: 5,
  46: 17,
  104: 37,
};
const brainsMM = {
  10: 7,
  96: 59,

  202: 123,
};
const klangMM = {
  11: 1,
  84: 55,
  103: 69,
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
  {
    videoId: "5AWltYjY1y4",
    measureMap: waterfallMM,
    fileName: "Waterfall",
    name: "Waterfall - Neelix ft. The Gardener and The Tree",
  },
  {
    videoId: "7I0vkKy504U",
    measureMap: sfMM,
    fileName: "San_Francisco",
    name: "San Francisco - Scott McKenzie",
  },
  {
    videoId: "n3FrFQNRj9w",
    measureMap: zirkusMM,
    fileName: "Zirkus",
    name: "Die ganze Welt ist ein Zirkus - Grausame Töchter",
  },
  {
    videoId: "6xUnSVTh8fI",
    measureMap: amenoMM,
    fileName: "Ameno",
    name: "Ameno - ERA",
  },
  {
    videoId: "XEEasR7hVhA",
    measureMap: tddiMM,
    fileName: "The_Devil_In_I",
    name: "The Devil in I - Slipknot",
  },
  {
    videoId: "ERCybZO3BTk",
    measureMap: wbdMM,
    fileName: "Wo_Bist_Du",
    name: "Wo Bist Du - Rammstein",
  },
  {
    videoId: "EbHGS_bVkXY",
    measureMap: zeitMM,
    fileName: "Zeit",
    name: "Zeit - Rammstein",
  },
  {
    videoId: "MJRQYboCV7Q",
    measureMap: saufiSaufiMM,
    fileName: "Saufi_Saufi",
    name: "Saufi saufi - Tobee",
  },
  {
    videoId: "nkUOACGtGfA",
    measureMap: sosMM,
    fileName: "Sound_Of_Silence",
    name: "The Sound Of Silence - Simon And Garfunkel",
  },
  {
    videoId: "SrnWp5O0DEs",
    measureMap: htrjMM,
    fileName: "Hit_The_Road",
    name: "Hit the Road Jack - Ray Charles",
  },
  {
    videoId: "LTIOFW7Pwgc",
    measureMap: ritgMM,
    fileName: "Rave_In_The_Grave",
    name: "Rave in the Grave - AronChupa & Little Sis Nora",
  },
  {
    videoId: "z_6FajEhLAU",
    measureMap: horrMM,
    fileName: "Horrortrip",
    name: "Der Horrortrip - Klatschkind",
  },
  {
    videoId: "1-8_gHs-Lww",
    measureMap: sidnrMM,
    fileName: "Saufen_ist_das_neue_Reden",
    name: "Saufen ist das neue Reden - Timo Turbine",
  },
  {
    videoId: "tg_-uIzzSRs",
    measureMap: oktoberMM,
    fileName: "Oktoberfest",
    name: "Oktoberfest - DJ Blyatman & Russian Village Boys",
  },
  {
    videoId: "QpbHdIrtpNo",
    measureMap: lolitaMM,
    fileName: "Lolita",
    name: "Moi... Lolita - Alizée",
  },
  {
    videoId: "NMvMR-jNSKg",
    measureMap: bambolaMM,
    fileName: "Bambola",
    name: "Bambola - Betta Lemme",
  },
  {
    videoId: "FcyzvRfRIEU",
    measureMap: youtheoneMM,
    fileName: "You're_The_one_That_I_Want",
    name: "You're The one That I Want (Reggae Version) - Joudas ft. Ranja",
  },
  {
    videoId: "Uxk4tw9dWUE",
    measureMap: oskarMM,
    fileName: "Oskar_der_Elefant",
    name: "Oskar der Elefant - K.I.Z",
  },
  {
    videoId: "d7eEZrRwc_0",
    measureMap: brainsMM,
    fileName: "Brains",
    name: "Brains - Klaypex ft. Kings High",
  },
  {
    videoId: "XM7BVj_C7PI",
    measureMap: klangMM,
    fileName: "Klaangzang",
    name: "Klaangzang - Sefa",
  },
];
