import { useState } from "react";
import {
  ButtonGroup,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  Row,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getAudioScores } from "../audio/util";
import { getCopiedScores } from "../util/util";
import { wrapWithNav } from "./NavBar";
import { ScoreTable } from "./ScoreTable";

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
    // Put undefined at the end
    const sa = a[sortState]?.toLowerCase();
    const sb = b[sortState]?.toLowerCase();
    if (sa === undefined) {
      return 1;
    }
    if (sb === undefined) {
      return -1;
    }
    if (sa < sb) {
      return -1;
    } else if (sa > sb) {
      return 1;
    }
    return 0;
  };

  return { sortDD, sortFun };
};

/** Hook for filtering and sorting scores. */
const useProcessedScores = (audio?: string) => {
  const [filterS, filterForm] = useScoreFilter();
  const { sortDD, sortFun } = useSortedScores();
  const comp = (
    <>
      <Row className="m-0 p-0 mb-3">
        <Col className="m-0 p-0">Search</Col>
        <Col className="m-0 p-0">{filterForm}</Col>
      </Row>
      <Row className="m-0 p-0 mb-3">
        <Col className="m-0 p-0">Sort by</Col>
        <Col className="m-0 p-0">{sortDD}</Col>
      </Row>
    </>
  );

  const filterAndSort = (
    scores: { name: string; artist: string; linkId: string }[]
  ) => {
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
    return scores;
  };

  let scores = null;
  if (audio === undefined) {
    scores = filterAndSort(getCopiedScores());
  }

  let audioScores = null;
  if (audio !== undefined) {
    audioScores = filterAndSort(getAudioScores(audio));
  }

  return { scores, audioScores, comp };
};

/** Lists all available scores. */
export const ListScores = () => {
  const params = useParams();
  const audioId = params.audioId;

  const { scores, audioScores, comp } = useProcessedScores(audioId);
  const scoreTable = scores ? <ScoreTable scores={scores} sub="yt" /> : null;
  const audioScoreTable = audioScores ? (
    <ScoreTable scores={audioScores} sub="audio" />
  ) : null;

  const fullComp = (
    <>
      {comp}
      {scoreTable}
      {audioScoreTable}
    </>
  );
  return wrapWithNav(fullComp, "All Scores");
};
