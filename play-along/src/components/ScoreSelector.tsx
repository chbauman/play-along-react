import { useState } from "react";
import { Container } from "react-bootstrap";
import { scores } from "../scores";
import ContactForm from "./FormSpree";
import { NavBar } from "./NavBar";
import { NewestScores } from "./NewestScores";
import { PartSelector } from "./PartSelector";

/** Lets the user select the score and displays it. */
export const ScoreSelector = () => {
  const [scoreIdx, setScoreIdx] = useState<number | null>(null);

  let scoreComp = <></>;
  let title = undefined;
  if (scoreIdx !== null) {
    const scoreInfo = scores[scoreIdx];
    title = scoreInfo.name;
    scoreComp = <PartSelector scoreInfo={scoreInfo}></PartSelector>;
  } else {
    scoreComp = (
      <Container className="mt-3">
        <h4>Getting Started</h4>
        <p>Start by selecting a score using the menu above on the right.</p>
        <NewestScores setScore={setScoreIdx} />
        <ContactForm />
      </Container>
    );
  }

  const navBar = <NavBar title={title} setScoreIdx={setScoreIdx} />;

  return (
    <>
      {navBar}
      {scoreComp}
    </>
  );
};
