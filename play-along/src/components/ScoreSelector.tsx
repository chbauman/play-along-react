import { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { scores } from "../scores";
import { PartSelector } from "./PartSelector";

/** Lets the user select the score and displays it. */
export const ScoreSelector = () => {
  const [scoreIdx, setScoreIdx] = useState<number | null>(null);

  const scoreSelectorDD = (
    <DropdownButton id="choose-score" title="Choose Score">
      {scores.map((el, idx) => {
        return (
          <Dropdown.Item key={idx} onClick={() => setScoreIdx(idx)}>
            {el.name}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
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
      {scoreSelectorDD}
      {scoreComp}
    </>
  );
};
