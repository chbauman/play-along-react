import { Col, Row } from "react-bootstrap";
import { getCopiedScores } from "../util/util";
import { ScoreTable } from "./ScoreTable";

export const NewestScores = ({
  nMostRecentSongs = 5,
}: {
  nMostRecentSongs: number;
}) => {
  const allScores = getCopiedScores();
  let scores = allScores.filter(
    (el, idx) => idx > allScores.length - nMostRecentSongs - 1
  );
  scores = scores.reverse();
  const newestScores = <ScoreTable scores={scores} />;

  return (
    <div className="mb-3">
      <h4>Recent Scores</h4>
      <p>
        The most recently added scores are listed below. Choose a song by
        clicking on it and start playing right away.
      </p>
      {newestScores}
    </div>
  );
};
