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
const imalrMM = {
  8: 9,
  106: 105,
  112: 110,
};
const destMM = {
  27: 1,
  64: 13,
  70: 15,
  92: 29,
  100: 34,
  107: 36,
  131: 51,
};
const freundMM = {
  40: 15,
  145: 127,
  213: 199,
  219: 205,
  249: 236,
};

const cahiMM = {
  5: 1,
  44: 29,
  81: 55,
  107: 73,
};

const kingMM = {
  9: 2,
  47: 26,
  105: 62,
  156: 94,
};

const rockCivMM = {
  159: 2,
  249: 58,
};

const rightNowMM = {
  13: 9,
  192: 121,
};

const blosEMM = {
  22: 12,
  59: 30,
  100: 50,
  132: 66,
  146: 73,
  152: 76,
};
const champsMM = {
  3: 2,
  21: 10,
  57: 26,
  93: 42,
  129: 58,
};
const ukrAnthMM = {
  6: 2,
  65: 19,
  110: 32,
  115: 33,
};
const sambaMM = {
  16: 2,
  59: 26,
  96: 47,
  128: 65,
};
const hochMM = {
  11: 2,
  30: 9,
  50: 21,
  116: 61,
};
const laylMM = {
  8: 6,
  160: 90,
};
const wwwMM = {
  1: 2,
  94: 72,
};
const partypMM = {
  2: 3,
  180: 98,
};
const ownTheNightMM = {
  2: 3,
  41: 27,
  108: 68,
  222: 138,
};
const oliviaMM = {
  8: 6,
  72: 44,
  170: 102,
};
const botAnnaMM = {
  1: 3,
  203: 121,
};
const richiMM = {
  7: 6,
  120: 68,
};
const fightMM = {
  74: 3,
  183: 71,
};
const poundingMM = {
  107: 2,
  142: 24,
  152: 28,
  240: 83,
};
const canCanMM = {
  12: 5,
  41: 44,
  81: 98,
  104: 129,
};
const beatItMM = {
  53: 2,
  88: 22,
  107: 33,
  164: 66,
};
const deprecatedScores: ScoreInfo[] = [
  {
    videoId: "5AWltYjY1y4",
    measureMap: waterfallMM,
    fileName: "Waterfall",
    name: "Waterfall - Neelix ft. The Gardener and The Tree",
  },
  {
    videoId: "n3FrFQNRj9w",
    measureMap: zirkusMM,
    fileName: "Zirkus",
    name: "Die ganze Welt ist ein Zirkus - Grausame Töchter",
  },
  {
    videoId: "z_6FajEhLAU",
    measureMap: horrMM,
    fileName: "Horrortrip",
    name: "Der Horrortrip - Klatschkind",
  },
  {
    videoId: "NMvMR-jNSKg",
    measureMap: bambolaMM,
    fileName: "Bambola",
    name: "Bambola - Betta Lemme",
  },
  {
    videoId: "XM7BVj_C7PI",
    measureMap: klangMM,
    fileName: "Klaangzang",
    name: "Klaangzang - Sefa",
  },
  {
    videoId: "d7eEZrRwc_0",
    measureMap: brainsMM,
    fileName: "Brains",
    name: "Brains - Klaypex ft. Kings High",
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
];

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
    videoId: "7I0vkKy504U",
    measureMap: sfMM,
    fileName: "San_Francisco",
    name: "San Francisco - Scott McKenzie",
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
    videoId: "ha-edv6PVqY",
    measureMap: imalrMM,
    fileName: "Im_Alright",
    name: "I'm Alright - Sportfreunde Stiller",
  },
  {
    videoId: "dv2NtTtwVVY",
    measureMap: destMM,
    fileName: "Destiny",
    name: "Destiny - Headhunterz",
  },
  {
    videoId: "0vB7xV1sqkU",
    measureMap: freundMM,
    fileName: "VonFreund",
    name: "Von Freund zu Freund - Junger Schwung Tirol",
  },
  {
    videoId: "7wW33aOPAqs",
    measureMap: cahiMM,
    fileName: "Cahi_En_La",
    name: "Cahi en la Trampa - Manu Chao",
  },
  {
    videoId: "e1kwr-C78mI",
    measureMap: kingMM,
    fileName: "The_King",
    name: "The King - Timmy Trumpet & Vitas",
  },
  {
    videoId: "LotJFb90iZ8",
    measureMap: rockCivMM,
    fileName: "Rock_Civilization",
    name: "Rock Civilization - Headhunterz",
  },
  {
    videoId: "USlp4lbJ0kQ",
    measureMap: rightNowMM,
    fileName: "Right_Now",
    name: "Right Now - TNT & Sound Rush",
  },
  {
    videoId: "mRIIUNbuiD4",
    measureMap: blosEMM,
    fileName: "Blos_E_Chlini",
    name: "Blos e chlini Stadt - Dieter Wiesmann",
  },
  {
    videoId: "7B4CLQGxHmI",
    measureMap: champsMM,
    fileName: "Champs_Elysees",
    name: "Aux Champs Elysées - Joe Dassin (Pomplamoose)",
  },
  {
    videoId: "bHzHlSLhtmM",
    measureMap: ukrAnthMM,
    fileName: "Ukrainian_Anthem",
    name: "Ukrainian National Anthem",
  },
  {
    videoId: "HAiHEQblKeQ",
    measureMap: sambaMM,
    fileName: "Samba_De_Janeiro",
    name: "Samba de Janeiro - Bellini",
  },
  {
    videoId: "QCTkqF6lX-c",
    measureMap: hochMM,
    fileName: "Hoch_Die_Haende",
    name: "Hoch die Hände Wochenende - Fäaschtbänkler, Finch & HBz",
  },
  {
    videoId: "2seCB54Bv-c",
    measureMap: laylMM,
    fileName: "Lay_All_Your_Love",
    name: "Lay All your Love on Me - ABBA",
  },
  {
    videoId: "WiR-5swzlvE",
    measureMap: wwwMM,
    fileName: "Was_Wollen_Wir",
    name: "Was wollen wir trinken - dArtagnan",
  },
  {
    videoId: "-4nB-9dmHoc",
    measureMap: partypMM,
    fileName: "Partyplanet",
    name: "Partyplanet - Fäaschtbänkler",
  },
  {
    videoId: "5b7m5mENslY",
    measureMap: ownTheNightMM,
    fileName: "Own_The_Night",
    name: "Own The Night - Showtek ft. MC DV8",
  },
  {
    videoId: "w0FE4xmAEq4",
    measureMap: oliviaMM,
    fileName: "Olivia",
    name: "Olivia - Die Zipfelbuben",
  },
  {
    videoId: "1XK5-n4rR7Q",
    measureMap: botAnnaMM,
    fileName: "Boten_Anna",
    name: "Boten Anna - Basshunter",
  },
  {
    videoId: "o5aVBKtXWwo",
    measureMap: richiMM,
    fileName: "Richi",
    name: "Richi - Stubete Gäng",
  },
  {
    videoId: "I_TKhQ7KK1Y",
    measureMap: fightMM,
    fileName: "Fight_The_Resistance",
    name: "Fight The Resistance - Brennan Heart & Zatox",
  },
  {
    videoId: "6BaysTL48SQ",
    measureMap: poundingMM,
    fileName: "Pounding_Senses",
    name: "Pounding Senses (deeper inside mix) - Southstylers",
  },
  {
    videoId: "4Diu2N8TGKA",
    measureMap: canCanMM,
    fileName: "Can_Can",
    name: "Can Can - Offenbach",
  },
  {
    videoId: "oRdxUFDoQe0",
    measureMap: beatItMM,
    fileName: "Beat_It",
    name: "Beat It - Michael Jackson",
  },
];

const deprNames = deprecatedScores.map((el) => el.name);
console.log("Not showing", deprNames);
