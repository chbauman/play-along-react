import { useState } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { scores } from "../scores";
import ContactForm from "./FormSpree";
import { NewestScores } from "./NewestScores";
import { PartSelector } from "./PartSelector";

/** Lets the user select the score and displays it. */
export const ScoreSelector = () => {
  const [scoreIdx, setScoreIdx] = useState<number | null>(null);

  let scoreComp = <></>;
  let scoreName = <Navbar.Brand>Youtube Play Along</Navbar.Brand>;
  if (scoreIdx !== null) {
    const scoreInfo = scores[scoreIdx];
    scoreName = <Navbar.Brand>{scoreInfo.name}</Navbar.Brand>;
    scoreComp = (
      <>
        <PartSelector scoreInfo={scoreInfo}></PartSelector>
      </>
    );
  } else {
    scoreComp = (
      <Container className="mt-3">
        <h4>Getting Started</h4>
        <p>Start by selecting a score using the menu above on the right.</p>
        <NewestScores setScore={setScoreIdx} />
        <ContactForm />
      </Container>
    );
  }
  const scoresWithIndex = scores.map((score, idx) => {
    return { score, idx };
  });
  const scoreCopy = [...scoresWithIndex];
  scoreCopy.sort((a, b) => {
    if (a.score.name < b.score.name) {
      return -1;
    } else if (a.score.name > b.score.name) {
      return 1;
    }
    return 0;
  });

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand className="mt-0 p-0" onClick={() => setScoreIdx(null)}>
            <img
              src="/logo512.png"
              width="45"
              height="45"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          {scoreName}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            className="justify-content-end"
            id="basic-navbar-nav"
          >
            <Nav>
              <NavDropdown
                align="end"
                title="Select Score"
                id="basic-nav-dropdown"
              >
                {scoreCopy.map((el) => {
                  return (
                    <NavDropdown.Item
                      key={el.idx}
                      onClick={() => setScoreIdx(el.idx)}
                    >
                      {el.score.name}
                    </NavDropdown.Item>
                  );
                })}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {scoreComp}
    </>
  );
};
