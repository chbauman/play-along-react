import { Link, useParams } from "react-router-dom";
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
  const nScores = scores.length;
  const scoreComp = (
    <>
      <p>
        Welcome to our sheet music website! We are pleased to offer a wide
        variety of sheet music for a variety of musical styles and instruments.
        Our website features interactive sheet music that is synced with
        corresponding music videos, allowing you to play along with the video as
        you practice. Whether you are a seasoned musician or a beginner looking
        to learn a new instrument, we have something for everyone.
      </p>
      <h4>All Scores</h4>
      <p>
        There is a total of {nScores} scores available for playing along
        including the corresponding sheet music. They all can be accessed under{" "}
        <Link to="/listall">All Scores</Link>.
      </p>
      <NewestScores nMostRecentSongs={10} />
      <p>
        We hope you enjoy using our website and that it helps you improve your
        musical skills. If you have any questions or suggestions, please don't
        hesitate to contact us. Happy playing!
      </p>
    </>
  );

  return wrapWithNav(scoreComp);
};
