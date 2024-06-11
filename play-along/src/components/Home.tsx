import { Link } from "react-router-dom";
import { scores } from "../scores";
import { getRandomScore } from "../util/util";
import { wrapWithNav } from "./NavBar";
import { NewestScores } from "./NewestScores";
import { useTranslation } from "react-i18next";

/** Lets the user select the score and displays it. */
export const Home = () => {
  const { t } = useTranslation();
  const nScores = scores.length;
  const scoreComp = (
    <>
      <p>{t("intro")}</p>
      <h4>{t("allScores")}</h4>
      <p>
        There is a total of {nScores} scores available for playing along
        including the corresponding sheet music. They all can be accessed under{" "}
        <Link to="/listall">{t("allScores")}</Link>. Or just jump right in and
        choose a{" "}
        <Link to={`/yt/${getRandomScore().videoId}`}>Random Score</Link>.
      </p>
      <NewestScores nMostRecentSongs={20} />
    </>
  );

  return wrapWithNav(scoreComp);
};
