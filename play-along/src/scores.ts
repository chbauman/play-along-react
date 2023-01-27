import { DEBUG } from "./util/util";

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
const ritgMM = { 9: 2, 49: 24, 80: 41, 107: 56, 149: 79 };
const horrMM = { 5: 2, 37: 26, 69: 50, 101: 74, 133: 98 };
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
const lolitaMM = { 45: 2, 81: 35, 100: 52, 137: 85, 172: 116 };
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
const brainsMM = { 10: 7, 96: 59, 202: 123 };
const klangMM = { 11: 1, 84: 55, 103: 69 };
const imalrMM = { 8: 9, 106: 105, 112: 110 };
const freundMM = { 40: 15, 145: 127, 213: 199, 219: 205, 249: 236 };
const kingMM = { 9: 2, 47: 26, 105: 62, 156: 94 };
const rockCivMM = { 159: 2, 249: 58 };
const rightNowMM = { 13: 9, 192: 121 };
const blosEMM = { 22: 12, 59: 30, 100: 50, 132: 66, 146: 73, 152: 76 };
const champsMM = { 3: 2, 21: 10, 57: 26, 93: 42, 129: 58 };
const ukrAnthMM = { 6: 2, 65: 19, 110: 32, 115: 33 };
const hochMM = { 11: 2, 30: 9, 50: 21, 116: 61 };
const laylMM = { 8: 6, 160: 90 };
const wwwMM = { 1: 2, 94: 72 };
const partypMM = { 2: 3, 180: 98 };
const ownTheNightMM = { 2: 3, 41: 27, 108: 68, 222: 138 };
const oliviaMM = { 8: 6, 72: 44, 170: 102 };
const richiMM = { 7: 6, 120: 68 };
const fightMM = { 74: 3, 183: 71 };
const poundingMM = { 107: 2, 142: 24, 152: 28, 240: 83 };
const canCanMM = { 12: 5, 41: 44, 81: 98, 104: 129 };
const misirlouMM = { 4: 2, 67: 25, 150: 55 };
const dropTahtMM = { 4: 4, 72: 40 };
const cordulaMM = { 9.5: 5, 70: 36, 185: 95 };
const vicSongMM = { 5: 2, 103: 43, 151: 63 };
const chickenMM = { 6: 7, 142: 118 };
const rhythmIsAMM = { 2: 3, 31: 18, 62: 34, 108: 58, 123.5: 66 };
const sombToLoveMM = { 7: 2, 18: 6, 26: 8, 33: 10, 56: 17, 95: 29, 129: 39 };
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
];

export const scores: ScoreInfo[] = [
  {
    videoId: "XEEasR7hVhA",
    measureMap: tddiMM,
    fileName: "The_Devil_In_I",
    name: "The Devil in I - Slipknot",
  },
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
    measureMap: { 6: 3, 42: 20, 79: 37, 110: 52, 143: 67, 161: 76 },
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
    measureMap: {
      6: 1,
      37: 16,
      84: 41,
      101: 50,
      117: 58,
      133: 65,
      148: 73,
      160: 79,
      189: 94,
      289: 145,
    },
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
    measureMap: { 12: 5, 46: 17, 104: 37, 159: 56 },
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
    measureMap: {
      27: 1,
      64: 13,
      70: 15,
      92: 29,
      100: 34,
      107: 36,
      131: 51,
      200: 94,
    },
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
    measureMap: { 5: 1, 44: 29, 81: 55, 107: 73, 141: 97 },
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
    measureMap: { 16: 2, 59: 26, 96: 47, 128: 65, 164: 85 },
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
    measureMap: { 1: 3, 203: 121 },
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
    measureMap: { 53: 2, 88: 22, 107: 33, 164: 66, 290: 137 },
    fileName: "Beat_It",
    name: "Beat It - Michael Jackson",
  },
  {
    videoId: "sQR2-Q-k_9Y",
    measureMap: { 4: 2, 64: 39, 131: 81, 168: 104 },
    fileName: "Savage_Love",
    name: "Savage Love - Jason Derulo",
  },
  {
    videoId: "x4-sfeHGAYU",
    measureMap: vicSongMM,
    fileName: "Victory_Song",
    name: "Victory Song - Broken Minds & D-Frek",
  },
  {
    videoId: "wXTJBr9tt8Q",
    measureMap: { 26: 2, 79: 24, 115: 39, 132: 46 },
    fileName: "Yesterday",
    name: "Yesterday - The Beatles",
  },
  {
    videoId: "Hd8SmiJHEQM",
    measureMap: misirlouMM,
    fileName: "Misirlou",
    name: "Misirlou - The Big Band Royale",
  },
  {
    videoId: "souJM4aCk6w",
    measureMap: dropTahtMM,
    fileName: "Drop_That",
    name: "Drop That Low - Tujamo",
  },
  {
    videoId: "Eco4z98nIQY",
    measureMap: { 9: 6, 43: 22, 58: 29, 94: 46, 181: 87 },
    fileName: "Booty_Swing",
    name: "Booty Swing - Parov Stelar",
  },
  {
    videoId: "GKARuQGhrO4",
    measureMap: { 13: 10, 79: 50, 92: 58, 161: 100 },
    fileName: "Recalled",
    name: "Recalled To Life - Dutch Master",
  },
  {
    videoId: "sKyK1Mme9Sc",
    measureMap: { 10: 6, 136: 57, 178: 74 },
    fileName: "Sun",
    name: "Sun - Two Door Cinema Club",
  },
  {
    videoId: "1LEfacrCU9M",
    measureMap: {
      9: 6,
      58: 25,
      105: 61,
      115: 69,
      131: 75,
      136: 77,
      173: 105,
      180: 108,
    },
    fileName: "Soul_Split",
    name: "Soul Split - Irradiate",
  },
  {
    videoId: "Xw-g6X8qob0",
    measureMap: cordulaMM,
    fileName: "Cordula",
    name: "Cordula Grün - Die Draufgänger",
  },
  {
    videoId: "qeMFqkcPYcg",
    measureMap: { 8: 5, 50: 27, 92: 49, 134: 71, 149.5: 79, 207: 109 },
    fileName: "Sweet_Dreams",
    name: "Sweet Dreams - Eurhythmics",
  },
  {
    videoId: "-xvVsZsvD4c",
    measureMap: chickenMM,
    fileName: "Chicken_Dance",
    name: "The Chicken Dance",
  },
  {
    videoId: "U_JFLb1IItM",
    measureMap: { 8: 7, 104: 79 },
    fileName: "Tequila",
    name: "Tequila - The Champs",
  },
  {
    videoId: "sZn1GXdzY9g",
    measureMap: { 7: 6, 57: 37 },
    fileName: "El_Cumbanchero",
    name: "El Cumbanchero - Daniel Santos",
  },
  {
    videoId: "p3l7fgvrEKM",
    measureMap: { 13: 9, 80: 45, 205: 112 },
    fileName: "Freed",
    name: "Freed From Desire - GALA",
  },
  {
    videoId: "JYIaWeVL1JM",
    measureMap: rhythmIsAMM,
    fileName: "Rhythm_Is_A_Dancer",
    name: "Rhythm Is A Dancer - Snap!",
  },
  {
    videoId: "xat1GVnl8-k",
    measureMap: { 17: 3, 110.5: 51, 242: 118 },
    fileName: "The_Bad_Touch",
    name: "The Bad Touch - Bloodhound Gang",
  },
  {
    videoId: "ZbZSe6N_BXs",
    measureMap: { 7: 2, 100: 64 },
    fileName: "Happy",
    name: "Happy - Pharrell Williams",
  },
  {
    videoId: "k85mRPqvMbE",
    measureMap: { 7: 2, 75: 41, 160: 90 },
    fileName: "Crazy_Frog",
    name: "Axel F - Crazy Frog",
  },
  {
    videoId: "w8KQmps-Sog",
    measureMap: { 6: 2, 107: 56 },
    fileName: "Uprising",
    name: "Uprising - Muse",
  },
  {
    videoId: "BERFZja9wb0",
    measureMap: { 11: 5, 150: 69, 226: 104 },
    fileName: "Cambodia",
    name: "Cambodia - Kim Wilde",
  },
  {
    videoId: "S4nwKLxEboo",
    measureMap: { 11: 9, 157: 154 },
    fileName: "Ievan_Polkka",
    name: "Ievan Polkka - Loituma",
  },
  {
    videoId: "qYyaKNvcKEA",
    measureMap: { 12: 3, 56: 45, 104: 92 },
    fileName: "Santiano",
    name: "Santiano - Les Marins D'Iroise",
  },
  {
    videoId: "9lfgOfMY2FI",
    measureMap: { 3: 3, 94: 38, 128: 51 },
    fileName: "Les_Choristes",
    name: "Les Choristes - Bruno Coulais",
  },
  {
    videoId: "kijpcUv-b8M",
    measureMap: sombToLoveMM,
    fileName: "Somebody_To_Love",
    name: "Somebody To Love - Queen",
  },
  {
    videoId: "Bkj3IVIO2Os",
    measureMap: { 6: 2, 167: 88, 201: 106, 210: 111 },
    fileName: "Die_Immer_Lacht",
    name: "Die Immer Lacht - Stereoact ft. Kerstin Ott",
  },
  {
    videoId: "F9Y9u0rAp9o",
    measureMap: { 4: 3, 144: 73, 176: 89 },
    fileName: "Detached_Motion",
    name: "Detached Motion - Worakls",
  },
  {
    videoId: "CVbTtJ2tbyg",
    measureMap: { 5: 5, 101: 81 },
    fileName: "Love_On_Rave",
    name: "Love On Rave - ДЕТИ RAVE",
  },
  {
    videoId: "x-64CaD8GXw",
    measureMap: { 10: 3, 47: 23 },
    fileName: "Shipping_Up",
    name: "I'm Shipping Up To Boson - Dropkick Murphys",
  },
  {
    videoId: "1rPAnxsSk40",
    measureMap: { 2: 2, 107: 57 },
    fileName: "Ku_Ku_Jodel",
    name: "Ku Ku Jodel - Oesch's die Dritten",
  },
  {
    videoId: "YyolLXRWsxc",
    measureMap: { 54: 3, 110: 35, 175: 72 },
    fileName: "Kirschen",
    name: "Kirschenblüten Jodler - Takeo Ischi & Rudy Schneyder",
  },
  {
    videoId: "ZqcXgODTeOU",
    measureMap: { 2: 1, 59: 37, 77: 48, 115: 72 },
    fileName: "People_Shit",
    name: "People Equals Shit - Richard Cheese",
  },
  {
    videoId: "2SjAexwwtBA",
    measureMap: { 6: 5, 145: 99, 178: 121 },
    fileName: "Confetti",
    name: "Confetti in m'n Sokken - Gekkenhuys ft. Fleur",
  },
  {
    videoId: "6fMwrdWmExg",
    measureMap: { 12: 6, 113: 51, 205: 92 },
    fileName: "Luchtballon",
    name: "10.000 Luchtballonnen - K3",
  },
  {
    videoId: "aQUlA8Hcv4s",
    measureMap: { 22: 2, 91: 52, 231: 156, 237: 160 },
    fileName: "Mr_Blue_Sky",
    name: "Mr. Blue Sky - Electric Light Orchestra",
  },
  {
    videoId: "aNgjX8y_HHU",
    measureMap: { 15: 1, 50: 16, 134.5: 53 },
    fileName: "Chlini",
    name: "Chlini Händ - Kunz",
  },
  {
    videoId: "TR3Vdo5etCQ",
    measureMap: { 30: 1, 235: 66 },
    fileName: "Dont_Speak",
    name: "Don't Speak - No Doubt",
  },
  {
    videoId: "y8ndu0CYwGU",
    measureMap: { 64: 2, 120: 46 },
    fileName: "Feeling_Good",
    name: "Feeling Good - Ibrahim Maalouf & Dear Silas",
  },
  {
    videoId: "KQRaj1vcnrs",
    measureMap: { 6: 5, 159: 109 },
    fileName: "Major_Tom",
    name: "Major Tom - Peter Schilling",
  },
  {
    videoId: "9BXNKyoW_Ow",
    measureMap: { 8: 5, 51: 27, 94: 49, 141: 73, 180: 93 },
    fileName: "Fallen_Leaves",
    name: "Fallen Leaves - Billy Talent",
  },
  {
    videoId: "lLocq-Yulro",
    measureMap: { 3: 3, 12: 8, 79: 40 },
    fileName: "Gigue",
    name: "Water Music in G: Gigue - G. F. Händel",
  },
  {
    videoId: "9d8SzG4FPyM",
    measureMap: { 3: 1, 90: 40 },
    fileName: "Rose_Tattoo",
    name: "Rose Tattoo - Dropkick Murphys",
  },
  {
    videoId: "RAOnUF8t20w",
    measureMap: { 12: 5, 240: 88 },
    fileName: "Rusted",
    name: "Rusted From The Rain - Billy Talent",
  },
  {
    videoId: "luodBWXwneg",
    measureMap: { 20: 1, 299: 181 },
    fileName: "Raging_Shadows",
    name: "Raging Shadows - JDX ft. Alizay",
  },
  {
    videoId: "4VQwQzoGF_o",
    measureMap: { 2: 4, 116: 160 },
    fileName: "La_Valse_des_Monstres",
    name: "La Valse des Monstres - Yann Tiersen",
  },
  {
    videoId: "JGCsyshUU-A",
    measureMap: { 4: 3, 149: 79, 212: 112 },
    fileName: "Shadows",
    name: "Shadows - Lindsey Stirling",
  },
  {
    videoId: "okE6M78TL_0",
    measureMap: { 14: 11, 92: 71 },
    fileName: "La_Noyee",
    name: "La Noyee - Yann Tiersen",
  },
  {
    videoId: "A6VV7__LaHU",
    measureMap: { 16: 9, 104: 56, 179: 96 },
    fileName: "Firebird",
    name: "Tale of the Firebird - Derek Fiechter",
  },
  {
    videoId: "qP-7GNoDJ5c",
    measureMap: { 3: 2, 71: 29, 151: 61 },
    fileName: "Wellerman",
    name: "Wellerman - Nathan Evans",
  },
  {
    videoId: "LNBjMRvOB5M",
    measureMap: { 4: 1, 157: 79 },
    fileName: "Go_West",
    name: "Go West - Pet Shop Boys",
  },
  {
    videoId: "0J2QdDbelmY",
    measureMap: { 3: 1, 122: 62, 176: 89, 227: 115 },
    fileName: "Seven_Nation_Army",
    name: "Seven Nation Army - The White Stripes",
  },
  {
    videoId: "wTCpQdsoKOc",
    measureMap: { 5: 5, 103: 85, 162: 134 },
    fileName: "La_Valette",
    name: "La Valette - Perły i Łotry",
  },
  {
    videoId: "j09hpp3AxIE",
    measureMap: { 11: 5, 257: 105 },
    fileName: "Tage_Wie_Diese",
    name: "Tage wie diese - Die Toten Hosen",
  },
  {
    videoId: "fqwIpH6phJs",
    measureMap: { 8: 4, 106: 42, 109: 43 },
    fileName: "Java",
    name: "Java - Al Hirt",
  },
  {
    videoId: "ONsp-SMT6is",
    measureMap: { 7: 10, 192: 241 },
    fileName: "Aldapan_Gora",
    name: "Aldapan Gora - Huntza",
  },
  {
    videoId: "zOvsyamoEDg",
    measureMap: { 12: 3, 31: 12, 111: 50, 250: 116 },
    fileName: "Federkleid",
    name: "Federkleid - FAUN",
  },
  {
    videoId: "79fzeNUqQbQ",
    measureMap: { 14: 1, 42: 14, 299: 134 },
    fileName: "Like_A_Prayer",
    name: "Like A Prayer - Madonna",
  },
  {
    videoId: "-9pySXuNO5A",
    measureMap: { 4: 3, 102: 65, 110: 70, 114: 73 },
    fileName: "Randy_Dandy",
    name: "Randy Dandy Oh - The Dreadnoughts",
  },
  {
    videoId: "ql9-82oV2JE",
    measureMap: { 19: 1, 190: 91 },
    fileName: "Go_Far_Kid",
    name: "You're Gonna Go Far, Kid - The Offspring",
  },
  {
    videoId: "6Cp6mKbRTQY",
    measureMap: { 4: 3, 246: 134 },
    fileName: "Hey_Brother",
    name: "Hey Brother - Avicii",
  },
  {
    videoId: "oRoEo7lZO6s",
    measureMap: { 13: 9, 231: 148, 234: 150, 238: 152 },
    fileName: "Hornpipe",
    name: "Water Music in D: Hornpipe - G. F. Händel",
  },
  {
    videoId: "i0xOSxgs6w8",
    measureMap: { 4: 3, 99: 55, 100: 56, 180: 100, 181: 101, 262: 146 },
    fileName: "Moskau",
    name: "Moskau - Dschingis Khan",
  },
  {
    videoId: "J_e9BUGVc08",
    measureMap: { 3: 3, 109: 54 },
    fileName: "Rejouissance",
    name: "Music for the Royal Firework: La réjouissance - G. F. Händel",
  },
  {
    videoId: "QGJuMBdaqIw",
    measureMap: { 7: 1, 216: 109, 228: 115 },
    fileName: "Firework",
    name: "Firework - Katy Perry",
  },
  {
    videoId: "98WtmW-lfeE",
    measureMap: { 4: 3, 218: 110 },
    fileName: "Teenage_Dream",
    name: "Teenage Dream - Katy Perry",
  },
  {
    videoId: "OkShTJdNBjc",
    measureMap: { 1: 2, 118: 128 },
    fileName: "Tarantella_Napoletana",
    name: "Tarantella Napoletana - Yuri Sazonoff & Jerry Caringi",
  },
  {
    videoId: "NjGpEqt_hws",
    measureMap: { 7: 5, 144: 82 },
    fileName: "Bergbauern",
    name: "Bergbauern Style - Florian Andreas",
  },
  {
    videoId: "PJ0u5c9EF1E",
    measureMap: { 10: 5, 118: 48, 122: 50, 229: 93 },
    fileName: "Just_The_Two",
    name: "Just The Two of Us - Grover Washington Jr. ft. Bill Withers",
  },
  {
    videoId: "kB_67zLhbEs",
    measureMap: { 8: 2, 79: 34, 153: 68 },
    fileName: "Red_Roses",
    name: "Red roses for a blue lady - Vic Dana",
  },
  {
    videoId: "34CZjsEI1yU",
    measureMap: { 14: 1, 29: 9, 294: 147, 302: 151 },
    fileName: "Diggy_Hole",
    name: "Diggy Diggy Hole - Wind Rose",
  },
];

if (DEBUG) {
  scores.push({
    videoId: "8spuxFUNIFw",
    measureMap: { 6: 2, 17: 4, 29: 6, 50: 11 },
    fileName: "Calibration",
    name: "Calibration",
  });
}

const deprNames = deprecatedScores.map((el) => el.name);
console.log("Not showing", deprNames);
