import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getAudioScores } from "../audio/util";
import { strLatinise } from "../util/sorting";
import { NormalizedScoreInfo, getCopiedScores } from "../util/util";
import { wrapWithNav } from "./NavBar";
import { ScoreTable } from "./ScoreTable";
import { getCopiedSCScores } from "./player/SoundCloudPlayer";
import ExtendedScoreInfo from "../scoreInfoGenerated.json";
import TimeSignatures from "../timeSignatures.json";

export const sortBy = ["name", "artist"] as const;
export const sortByNames = { name: "Song Name", artist: "Artist" };
export type SortBy = (typeof sortBy)[number];
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

const useTimeSignatureFilter = () => {
  const initTimes = TimeSignatures.map(() => true);
  const [chosenTimes, setChosenTimes] = useState<boolean[]>(initTimes);
  const comp = (
    <Col>
      <div className="d-flex justify-content-between">
        {TimeSignatures.map((el, idx) => (
          <Form.Check
            type="checkbox"
            key={`time-${el}`}
            label={`${el[0]}/${el[1]}`}
            checked={chosenTimes[idx]}
            onChange={() => {
              const newTimes = [...chosenTimes];
              newTimes[idx] = !newTimes[idx];
              setChosenTimes(newTimes);
            }}
          />
        ))}
      </div>
    </Col>
  );
  const allowedTimes = new Set(
    TimeSignatures.filter((_el, idx) => chosenTimes[idx]).map(
      (el) => `${el[0]},${el[1]}`
    )
  );
  return [comp, allowedTimes] as const;
};

/** Hook for filtering based on key signature. */
const useKeyFilter = () => {
  const flats = [1, 2, 3, 4, 5, 6];
  const sharps = [1, 2, 3, 4, 5];
  const negFlats = flats.map((el) => -el);
  const initValue = [0, ...sharps, ...negFlats];
  const [chosenKeys, setChosenKeys] = useState<number[]>(initValue);

  const sharpIsSet = (sharpIdx: number) => chosenKeys.includes(sharpIdx);
  const setSharp = (sharpIdx: number) => {
    const idx = chosenKeys.indexOf(sharpIdx);
    if (idx === -1) {
      setChosenKeys([sharpIdx, ...chosenKeys]);
    } else {
      setChosenKeys(chosenKeys.filter((el) => el !== sharpIdx));
    }
  };
  const comp = (
    <Col>
      <div className="d-flex justify-content-between">
        {sharps.map((el) => (
          <Form.Check
            type="checkbox"
            key={`sharp-${el}`}
            label={`${el} #`}
            checked={sharpIsSet(el)}
            onChange={() => setSharp(el)}
          />
        ))}
      </div>
      <div>
        <Form.Check
          type="checkbox"
          id={`none`}
          label={`0 ♭ / #`}
          checked={sharpIsSet(0)}
          onChange={() => setSharp(0)}
        />
      </div>
      <div className="d-flex justify-content-between">
        {flats.map((el) => (
          <Form.Check
            type="checkbox"
            key={`flat-${el}`}
            label={`${el} ♭`}
            checked={sharpIsSet(-el)}
            onChange={() => setSharp(-el)}
          />
        ))}
      </div>
    </Col>
  );
  return [chosenKeys, comp] as const;
};

/** Hook for filtering and sorting scores. */
const useProcessedScores = (
  extendedScoreInfo: { [key: string]: { keys: number[]; times: number[][] } },
  audioCollId?: string,
  sub?: string
) => {
  const subNN = sub ? sub : audioCollId;
  const [filterS, filterForm] = useScoreFilter();
  const sortInfo = useSortedScores();
  const [keys, keyFilterComp] = useKeyFilter();
  const [timeFilterComp, times] = useTimeSignatureFilter();

  const enableKeyFiltering = subNN === "yt";
  const filterComp = enableKeyFiltering && (
    <>
      {" "}
      <Row className="m-0 p-0 mb-3">Filter</Row>
      <Row className="m-0 p-0 mb-3">
        <Col className="m-0 p-0">Key Signature</Col>
        <Col className="m-0 p-0">{keyFilterComp}</Col>
      </Row>
      <Row className="m-0 p-0 mb-3">
        <Col className="m-0 p-0">Time Signature</Col>
        <Col className="m-0 p-0">{timeFilterComp}</Col>
      </Row>
    </>
  );
  const comp = (
    <>
      <Row className="m-0 p-0 mb-3">
        <Col className="m-0 p-0">Search</Col>
        <Col className="m-0 p-0">{filterForm}</Col>
      </Row>
      {filterComp}
    </>
  );
  const filterKeys = (el: NormalizedScoreInfo) => {
    if (el.linkId in extendedScoreInfo) {
      const currKeys = extendedScoreInfo[el.linkId].keys;
      const allowedTimes = extendedScoreInfo[el.linkId].times
        .map((el) => `${el[0]},${el[1]}`)
        .filter((el) => times.has(el));
      if (allowedTimes.length == 0) {
        return false;
      }
      const allowedKeys = currKeys.filter((el) => keys.includes(el));
      if (allowedKeys.length === 0) {
        return false;
      }
    }
    return true;
  };
  const filterAndSort = (scores: NormalizedScoreInfo[]) => {
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

  let scores = null;
  if (subNN === "yt") {
    scores = filterAndSort(getCopiedScores());
  } else if (subNN === "sc") {
    scores = filterAndSort(getCopiedSCScores());
  } else {
    scores = filterAndSort(getAudioScores(audioCollId));
  }
  if (enableKeyFiltering) {
    scores = scores.filter(filterKeys);
  }
  return { scores, comp, sortInfo };
};

/** Lists all available scores. */
export const ListScores = ({ sub }: { sub?: string }) => {
  const params = useParams();
  const audioId = params.audioId;
  const { scores, comp, sortInfo } = useProcessedScores(
    ExtendedScoreInfo,
    audioId,
    sub
  );
  const subNN = sub ? sub : audioId;
  const scoreTable = (
    <ScoreTable scores={scores} sortInfo={sortInfo} sub={subNN!} />
  );

  const fullComp = (
    <>
      {comp}
      <Row className="m-0 p-0 mb-3">Scores in list: {scores.length}</Row>
      {scoreTable}
    </>
  );
  return wrapWithNav(fullComp, "All Scores");
};
