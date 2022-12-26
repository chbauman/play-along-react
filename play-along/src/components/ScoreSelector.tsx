import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { scores } from "../scores";
import { NavBar } from "./NavBar";
import { NewestScores } from "./NewestScores";
import { PartSelector } from "./PartSelector";

export const ScoreRoute = () => {
  let { scoreId } = useParams();

  const scoreInfoCand = scores.filter((el) => el.videoId === scoreId);
  if (scoreInfoCand.length === 0) {
    return <h3>Score not found :(</h3>;
  }
  const scoreInfo = scoreInfoCand[0];
  const navBar = <NavBar title={scoreInfo.name} />;
  const partSel = <PartSelector scoreInfo={scoreInfo}></PartSelector>;

  return (
    <>
      {navBar}
      {partSel}
    </>
  );
};

/** Lets the user select the score and displays it. */
export const Home = () => {
  const scoreComp = (
    <Container className="mt-3">
      <h4>Getting Started</h4>
      <p>Start by selecting a score using the menu above on the right.</p>
      <NewestScores nMostRecentSongs={10} />
    </Container>
  );

  const navBar = <NavBar />;

  return (
    <>
      {navBar}
      {scoreComp}
    </>
  );
};
