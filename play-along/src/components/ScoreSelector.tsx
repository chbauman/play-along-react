import { useState } from "react";
import { scores } from "../scores";
import { PartSelector } from "./PartSelector";

/** Lets the user select the score and displays it. */
export const ScoreSelector = () => {
  const nScores = scores.length;
  const [scoreIdx, setScoreIdx] = useState<number | null>(null);

  const selectNext = () => {
    if (scoreIdx === null) {
      setScoreIdx(0);
      return;
    }
    const newIdx = Math.min(scoreIdx + 1, nScores - 1);
    setScoreIdx(newIdx);
  };
  const scoreSelectorComp = <button onClick={selectNext}>Next Score</button>;
  let scoreComp = <></>;
  if (scoreIdx !== null) {
    const scoreInfo = scores[scoreIdx];
    scoreComp = (
      <>
        <PartSelector scoreInfo={scoreInfo}></PartSelector>
      </>
    );
  }
  return (
    <>
      {scoreSelectorComp}
      {scoreComp}
    </>
  );
};
