import { useState } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { scores } from "../scores";
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
  }
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          {scoreName}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            className="justify-content-end"
            id="basic-navbar-nav"
          >
            <Nav>
              <NavDropdown title="Select Score" id="basic-nav-dropdown">
                {scores.map((el, idx) => {
                  return (
                    <NavDropdown.Item
                      key={idx}
                      onClick={() => setScoreIdx(idx)}
                    >
                      {el.name}
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
