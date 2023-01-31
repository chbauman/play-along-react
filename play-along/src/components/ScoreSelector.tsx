import { useParams } from "react-router-dom";
import { ScoreInfo, scores } from "../scores";
import { wrapWithNav } from "./NavBar";
import { PartSelector } from "./PartSelector";
import { useYoutubePlayer } from "./player/YtPlayer";

export const ScoreRoute = () => {
  let { scoreId } = useParams();

  const scoreInfoCand = scores.filter((el) => el.videoId === scoreId);
  if (scoreInfoCand.length === 0) {
    // No match for score ID found in list.
    const comp = <h3>YouTube score with ID '{scoreId}' not found :(</h3>;
    return wrapWithNav(comp, "404");
  }
  const scoreInfo = scoreInfoCand[0];
  return <FoundScore scoreInfo={scoreInfo} />;
};

const FoundScore = ({ scoreInfo }: { scoreInfo: ScoreInfo }) => {
  const player = useYoutubePlayer(scoreInfo.videoId);
  const fileName = `./scores/${scoreInfo.fileName}.musicxml`;
  const partSel = (
    <PartSelector
      measureMap={scoreInfo.measureMap}
      player={player}
      fileName={fileName}
    ></PartSelector>
  );

  // The score is not wrapped in a container, we use the full width
  // for the sheet music.
  return wrapWithNav(partSel, scoreInfo.name, false);
};
