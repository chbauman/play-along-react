import streetBandScores from "./street-band.json";
import artRoseScores from "./art-rose.json";
import debugScores from "./debug.json";

export const getAudioScores = (audioId?: string) => {
  let scores = null;
  if (audioId === "art-rose") {
    scores = artRoseScores;
  } else if (audioId === "debug") {
    console.log("Debugging");
    scores = debugScores;
  } else if (audioId === "street-band") {
    scores = streetBandScores;
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
    };
  });
};
