import { Link } from "react-router-dom";
import { scores } from "../scores";
import { getRandomScore } from "../util/util";
import { wrapWithNav } from "./NavBar";
import { NewestScores } from "./NewestScores";
import { Trans, useTranslation } from "react-i18next";

/** Lets the user select the score and displays it. */
export const Home = () => {
  const { t } = useTranslation();
  const nScores = scores.length;
  const parInfo = {
    num: <>{`${nScores}`}</>,
    all: <Link to="/listall">{t("allScores")}</Link>,
    random: (
      <Link to={`/yt/${getRandomScore().videoId}`}>{t("randomScore")}</Link>
    ),
  };
  const secondPar = <Trans i18nKey={"allScoresTxt"} components={parInfo} m />;
  const scoreComp = (
    <>
      <p>{t("intro")}</p>
      <h4>{t("allScores")}</h4>
      <p>{secondPar}</p>
      <NewestScores nMostRecentSongs={20} />
    </>
  );

  return wrapWithNav(scoreComp);
};
