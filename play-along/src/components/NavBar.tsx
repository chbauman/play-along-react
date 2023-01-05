import { ReactElement } from "react";
import { Container, Nav, Navbar, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MdHelp, MdList, MdSettings } from "react-icons/md";

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

  const buttSize = 26;

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {navLogo}
        {navBrand}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav>
            <NavLink as={Link} to="/listall">
              <MdList size={buttSize} />
            </NavLink>
            <NavLink as={Link} to="/settings">
              <MdSettings size={buttSize} />
            </NavLink>
            <NavLink as={Link} to="/help">
              <MdHelp size={buttSize} />
            </NavLink>
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
