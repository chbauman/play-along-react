import { Link } from "react-router-dom";
import { scores } from "../scores";
import { getRandomScore } from "../util/util";
import { wrapWithNav } from "./NavBar";
import { NewestScores } from "./NewestScores";

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
        <Link to="/listall">All Scores</Link>. Or just jump right in and let
        destiny choose a song for you:{" "}
        <Link to={`/yt/${getRandomScore().videoId}`}>Random Score</Link>.
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
