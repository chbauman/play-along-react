import { Button, Col, Row } from "react-bootstrap";
import { scores } from "../scores";

const nMostRecentSongs = 5;

export const NewestScores = ({
  setScore,
}: {
  setScore: (idx: number) => void;
}) => {
  const scoreAndIdx = scores.map((scoreInfo, idx) => {
    return { scoreInfo, idx };
  });
  scoreAndIdx.reverse();
  const newestScores = scoreAndIdx
    .filter((el) => el.idx > scores.length - nMostRecentSongs - 1)
    .map((el) => {
      const nameAndArtist = el.scoreInfo.name;
      const [name, artist] = nameAndArtist.split(" - ");
      return (
        <Row key={el.idx} className="mt-1">
          <Col xs="4">{name}</Col>
          <Col xs="4">{artist}</Col>
          <Col xs="4">
            <Button onClick={() => setScore(el.idx)}>Play Along</Button>
          </Col>
        </Row>
      );
    });

  return (
    <div className="mb-3">
      <h4>Newest Scores</h4>
      <p>The most recently added songs are listed below.</p>
      <Row className="mt-1">
        <Col xs="4">
          <h5>Name</h5>
        </Col>
        <Col xs="4">
          <h5>Artist</h5>
        </Col>
      </Row>
      {newestScores}
    </div>
  );
};
