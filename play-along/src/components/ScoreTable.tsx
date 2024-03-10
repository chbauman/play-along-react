import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { sortBy, SortBy, sortByNames } from "./ListScores";

type ScoresT = { name?: string; artist?: string; linkId: string }[];

export const ScoreTable = ({
  scores,
  sub,
  sortInfo,
}: {
  scores: ScoresT;
  sub: string;
  sortInfo?: {
    by: SortBy;
    ascending: boolean;
    sortClick: (by: SortBy) => void;
  };
}) => {
  const navi = useNavigate();

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
        {sortByNames[el]}
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
                ></img>
              </td>
              {sortBy.map((field) => {
                return (
                  <td className="col-6" key={`td-${field}`}>
                    {el[field]?.trim()}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
