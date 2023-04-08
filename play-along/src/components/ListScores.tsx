import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getAudioScores } from "../audio/util";
import { strLatinise } from "../util/sorting";
import { getCopiedScores } from "../util/util";
import { wrapWithNav } from "./NavBar";
import { ScoreTable } from "./ScoreTable";
import { getCopiedSCScores } from "./player/SoundCloudPlayer";

export const sortBy = ["name", "artist"] as const;
export const sortByNames = { name: "Song Name", artist: "Artist" };
export type SortBy = typeof sortBy[number];
type SortSetting = { by: SortBy; ascending: boolean };
type ScoreNameArtist = typeof sortByNames;

/** Hook providing form to enter text for filtering scores. */
const useScoreFilter = () => {
  const [filterS, setFilterS] = useState<string | undefined>(undefined);
  const filterForm = (
    <Form.Control
      type="text"
      placeholder="Enter keyword"
      onChange={(ev: { target: any }) => setFilterS(ev.target.value)}
      value={filterS}
    />
  );
  return [filterS, filterForm] as const;
};

/** Hook for sorting the scores. */
const useSortedScores = () => {
  const [sortSetting, setSortSetting] = useState<SortSetting>({
    by: "name",
    ascending: true,
  });

  const sortClick = (by: SortBy) => {
    const newSetting = { ...sortSetting };
    newSetting.ascending = !newSetting.ascending;
    if (newSetting.by !== by) {
      newSetting.ascending = true;
      newSetting.by = by;
    }
    setSortSetting(newSetting);
  };

  const sortFun = (a: ScoreNameArtist, b: ScoreNameArtist) => {
    // Put undefined at the end
    const sa = strLatinise(a[sortSetting.by]?.toLowerCase());
    const sb = strLatinise(b[sortSetting.by]?.toLowerCase());
    const pos = sortSetting.ascending ? 1 : -1;
    if (sa === undefined) {
      return pos;
    }
    if (sb === undefined) {
      return -pos;
    }
    if (sa < sb) {
      return -pos;
    } else if (sa > sb) {
      return pos;
    }
    return 0;
  };

  return { sortFun, sortClick, ...sortSetting };
};

/** Hook for filtering and sorting scores. */
const useProcessedScores = (audioCollId?: string, sub?: string) => {
  const [filterS, filterForm] = useScoreFilter();
  const sortInfo = useSortedScores();
  const comp = (
    <>
      <Row className="m-0 p-0 mb-3">
        <Col className="m-0 p-0">Search</Col>
        <Col className="m-0 p-0">{filterForm}</Col>
      </Row>
    </>
  );

  const filterAndSort = (
    scores: { name: string; artist: string; linkId: string }[]
  ) => {
    if (filterS) {
      // Apply filter
      const fLow = strLatinise(filterS.toLocaleLowerCase());
      scores = scores.filter(
        (el) =>
          strLatinise(el.name)?.toLocaleLowerCase().includes(fLow) ||
          strLatinise(el.artist)?.toLocaleLowerCase().includes(fLow)
      );
    }
    scores.sort(sortInfo.sortFun);
    return scores;
  };

  const subNN = sub ? sub : audioCollId;
  let scores = null;
  if (subNN === "yt") {
    scores = filterAndSort(getCopiedScores());
  } else if (subNN === "sc") {
    scores = filterAndSort(getCopiedSCScores());
  } else {
    scores = filterAndSort(getAudioScores(audioCollId));
  }

  return { scores, comp, sortInfo };
};

/** Lists all available scores. */
export const ListScores = ({ sub }: { sub?: string }) => {
  const params = useParams();
  const audioId = params.audioId;

  const { scores, comp, sortInfo } = useProcessedScores(audioId, sub);
  const subNN = sub ? sub : audioId;
  const scoreTable = (
    <ScoreTable scores={scores} sortInfo={sortInfo} sub={subNN!} />
  );

  const fullComp = (
    <>
      {comp}
      {scoreTable}
    </>
  );
  return wrapWithNav(fullComp, "All Scores");
};
