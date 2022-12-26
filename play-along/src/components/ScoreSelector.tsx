import { useParams } from "react-router-dom";
import { scores } from "../scores";
import { wrapWithNav } from "./NavBar";
import { NewestScores } from "./NewestScores";
import { PartSelector } from "./PartSelector";

export const ScoreRoute = () => {
  let { scoreId } = useParams();

  const scoreInfoCand = scores.filter((el) => el.videoId === scoreId);
  if (scoreInfoCand.length === 0) {
    // No match for score ID found in list.
    const comp = <h3>Score with ID '{scoreId}' not found :(</h3>;
    return wrapWithNav(comp, "404");
  }
  const scoreInfo = scoreInfoCand[0];
  const partSel = <PartSelector scoreInfo={scoreInfo}></PartSelector>;

  // The score is not wrapped in a container, we use the full width
  // for the sheet music.
  return wrapWithNav(partSel, scoreInfo.name, false);
};

/** Lets the user select the score and displays it. */
export const Home = () => {
  const scoreComp = (
    <>
      <h4>Getting Started</h4>
      <p>Start by selecting a score using the menu above on the right.</p>
      <NewestScores nMostRecentSongs={10} />
    </>
  );

  return wrapWithNav(scoreComp);
};
