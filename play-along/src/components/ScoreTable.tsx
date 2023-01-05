import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type ScoresT = { name?: string; artist?: string; linkId: string }[];

export const ScoreTable = ({ scores }: { scores: ScoresT }) => {
  const navi = useNavigate();
  return (
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
            <tr
              key={el.linkId}
              onClick={() => navi(`/${el.linkId}`)}
              style={{ cursor: "pointer" }}
            >
              <td className="col-6">{el.name?.trim()}</td>
              <td className="col-6">{el.artist?.trim()}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
