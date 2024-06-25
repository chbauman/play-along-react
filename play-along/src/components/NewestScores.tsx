import { useTranslation } from "react-i18next";
import { getCopiedScores } from "../util/util";
import { ScoreTable } from "./ScoreTable";

export const NewestScores = ({
  nMostRecentSongs = 5,
}: {
  nMostRecentSongs: number;
}) => {
  const allScores = getCopiedScores();
  const { t } = useTranslation();

  // Select only most recent scores
  let scores = allScores.filter(
    (_el, idx) => idx > allScores.length - nMostRecentSongs - 1
  );
  scores = scores.reverse();
  const newestScores = <ScoreTable scores={scores} sub="yt" />;

  return (
    <div className="mb-3">
      <h4>{t("recentScores")}</h4>
      <p>{t("recentTxt")}</p>
      {newestScores}
    </div>
  );
};
