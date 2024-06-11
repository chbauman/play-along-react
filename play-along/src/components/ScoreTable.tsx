import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { intToKey, sortBy, SortBy } from "./ListScores";
import { NormalizedScoreInfo } from "../util/util";
import { useTranslation } from "react-i18next";

export const ScoreTable = ({
  scores,
  sub,
  sortInfo,
}: {
  scores: NormalizedScoreInfo[];
  sub: string;
  sortInfo?: {
    by: SortBy;
    ascending: boolean;
    sortClick: (by: SortBy) => void;
  };
}) => {
  const navi = useNavigate();
  const { t } = useTranslation();

  const th = sortBy.map((el) => {
    let ex = "";
    if (sortInfo !== undefined) {
      if (sortInfo.by === el) {
        ex = sortInfo.ascending ? "▴" : "▾";
      }
    }
    return (
      <th
        key={el}
        onClick={() => sortInfo?.sortClick(el)}
        style={{ cursor: "pointer" }}
        className="score-table-header"
      >
        {t(el)}
        {ex}
      </th>
    );
  });
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
          {th}
          <th>Pitch</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((el) => {
          return (
            <tr
              key={el.linkId}
              onClick={() => navi(`/${sub}/${el.linkId}`)}
              style={{ cursor: "pointer" }}
            >
              <td>
                <img
                  src={`https://img.youtube.com/vi/${el.linkId}/default.jpg`}
                  alt={`YouTube thumbnail of ${el.name} by ${el.artist}`}
                ></img>
              </td>
              {sortBy.map((field) => {
                return (
                  <td className="col-5" key={`td-${field}`}>
                    {el[field]?.trim()}
                  </td>
                );
              })}
              <td className="col-1">{getKeys(el.keys)}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

const getKeys = (keyInts: number[]) => {
  return keyInts.map(intToKey).join(", ");
};
