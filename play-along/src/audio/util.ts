import streetBandScores from "./street-band.json";
import artRoseScores from "./art-rose.json";
import debugScores from "./debug.json";
import bauSteiScores from "./bau-stei.json";
import bauSteiBaslerScores from "./bau-stei-basler.json";
import { esi } from "../util/util";

export const getAudioScores = (audioId?: string) => {
  let scores = null;
  if (audioId === "art-rose") {
    scores = artRoseScores;
  } else if (audioId === "debug") {
    console.log("Debugging");
    scores = debugScores;
  } else if (audioId === "bau-stei") {
    scores = bauSteiScores;
  } else if (audioId === "street-band") {
    scores = streetBandScores;
  } else if (audioId === "bau-stei-basler") {
    scores = bauSteiBaslerScores;
  }

  if (scores === null) {
    console.log(`No scores with ID ${audioId}`);
    return [];
  }

  return scores.map((el) => {
    return {
      linkId: el.fileName,
      name: el.title,
      artist: el.interpret,
      keys: esi[el.fileName].keys,
    };
  });
};
