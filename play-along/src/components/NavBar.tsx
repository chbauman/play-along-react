import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { scores } from "../scores";

export const getSortedScores = () => {
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
  return scoreCopy;
};

export const NavBar = ({ title }: { title?: string }) => {
  const defTitle = title === undefined ? "Youtube Play Along" : title;
  const navBrand = <Navbar.Brand>{defTitle}</Navbar.Brand>;
  const navLogo = (
    <Navbar.Brand className="mt-0 p-0" as={Link} to="/">
      <img
        src="/logo512.png"
        width="45"
        height="45"
        className="d-inline-block align-top"
        alt="Youtube Play Along logo"
      />
    </Navbar.Brand>
  );

  const scoreCopy = getSortedScores();

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {navLogo}
        {navBrand}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav>
            <NavDropdown
              align="end"
              title="Select Score"
              id="basic-nav-dropdown"
            >
              {scoreCopy.map((el) => {
                return (
                  <NavDropdown.Item
                    as={Link}
                    to={`/${el.score.videoId}`}
                    key={el.idx}
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
  );
};
