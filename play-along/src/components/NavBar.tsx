import { ReactElement } from "react";
import { Container, Nav, Navbar, NavDropdown, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";
import { scores } from "../scores";
import { MdHelp, MdSettings } from "react-icons/md";

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

const NavBar = ({ title }: { title: string }) => {
  const navBrand = <Navbar.Brand>{title}</Navbar.Brand>;
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
            <NavLink as={Link} to="/settings">
              <MdSettings />
            </NavLink>
            <NavLink as={Link} to="/help">
              <MdHelp />
            </NavLink>
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

export const wrapWithNav = (
  comp: ReactElement,
  navTitle = "Youtube Play Along",
  wrapInCont = true
) => {
  const navBar = <NavBar title={navTitle} />;
  const cmp = wrapInCont ? (
    <Container className="mt-3 mb-5">{comp}</Container>
  ) : (
    <div className="mt-3 mb-5">{comp}</div>
  );
  return (
    <>
      {navBar}
      {cmp}
    </>
  );
};
