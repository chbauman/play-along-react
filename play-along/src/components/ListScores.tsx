import { useState } from "react";
import {
  ButtonGroup,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getSortedScores } from "../util/util";
import { wrapWithNav } from "./NavBar";

const sortBy = ["name", "artist"] as const;
const sortByNames = { name: "Song Name", artist: "Artist" };
type SortBy = typeof sortBy[number];
type ScoreNameArtist = typeof sortByNames;

/** Hook providing form to enter text for filtering scores. */
const useScoreFilter = () => {
  const [filterS, setFilterS] = useState<string | undefined>(undefined);
  const filterForm = (
    <Form.Control
      type="text"
      placeholder="Enter keyword"
      onChange={(ev) => setFilterS(ev.target.value)}
      value={filterS}
    />
  );
  return [filterS, filterForm] as const;
};

/** Hook for sorting the scores. */
const useSortedScores = () => {
  const [sortState, setSortState] = useState<SortBy>(sortBy[0]);

  const sortStateLabel = sortByNames[sortState];
  const sortDD = (
    <DropdownButton id="choose-sort" title={sortStateLabel} as={ButtonGroup}>
      {sortBy.map((el) => {
        return (
          <Dropdown.Item
            key={el}
            onClick={() => {
              setSortState(el);
            }}
          >
            {sortByNames[el]}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
  const sortFun = (a: ScoreNameArtist, b: ScoreNameArtist) => {
    if (a[sortState] < b[sortState]) {
      return -1;
    } else if (a[sortState] > b[sortState]) {
      return 1;
    }
    return 0;
  };

  return { sortDD, sortFun };
};

/** Hook for filtering and sorting scores. */
const useProcessedScores = () => {
  const [filterS, filterForm] = useScoreFilter();
  const { sortDD, sortFun } = useSortedScores();
  const comp = (
    <>
      <Row className="m-0 p-0 mb-3">
        <Col className="m-0 p-0">Sort by</Col>
        <Col className="m-0 p-0">{sortDD}</Col>
      </Row>
      <Row className="m-0 p-0 mb-3">
        <Col className="m-0 p-0">Search</Col>
        <Col className="m-0 p-0">{filterForm}</Col>
      </Row>
    </>
  );

  const scoreCopy = getSortedScores();
  let scores = scoreCopy.map((el) => {
    const [name, artist] = el.score.name.split("-");
    return { name, artist, linkId: el.score.videoId };
  });
  if (filterS) {
    // Apply filter
    const fLow = filterS.toLocaleLowerCase();
    scores = scores.filter(
      (el) =>
        el.name?.toLocaleLowerCase().includes(fLow) ||
        el.artist?.toLocaleLowerCase().includes(fLow)
    );
  }

  scores.sort(sortFun);
  return { scores, comp };
};

/** Lists all available scores. */
export const ListScores = () => {
  const navi = useNavigate();
  const { scores, comp } = useProcessedScores();

  const scoreTable = (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Song Name</th>
          <th>Artist</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((el) => {
          return (
            <tr key={el.linkId} onClick={() => navi(`/${el.linkId}`)}>
              <td className="col-6">{el.name?.trim()}</td>
              <td className="col-6">{el.artist?.trim()}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
  const fullComp = (
    <>
      {comp}
      {scoreTable}
    </>
  );
  return wrapWithNav(fullComp, "All Scores");
};
