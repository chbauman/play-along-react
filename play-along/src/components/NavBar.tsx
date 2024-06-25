import { ReactElement } from "react";
import { Container, Nav, Navbar, NavLink } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { MdHelp, MdList, MdSettings } from "react-icons/md";
import { useTranslation } from "react-i18next";

const NavBar = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  const params = useParams();
  const audioId = params.audioId;

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
  const getRoute = (base: string) => {
    if (audioId === undefined) {
      return `/${base}`;
    }
    return `/${audioId}/${base}`;
  };

  const navTxtStyle = { fontWeight: "500" };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {navLogo}
        {navBrand}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav style={navTxtStyle}>
            <NavLink as={Link} to={getRoute("listall")}>
              <MdList size={buttSize} /> {t("allScores")}
            </NavLink>
            <NavLink as={Link} to={getRoute("settings")}>
              <MdSettings size={buttSize} /> {t("settingsTitle")}
            </NavLink>
            <NavLink as={Link} to={getRoute("help")}>
              <MdHelp size={buttSize} /> {t("helpTitle")}
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
      <Container style={{ width: "100%", color: "red", textAlign: "center" }}>
        <h3>
          This website will move to <a href="https://ytpa.ch">ytpa.ch</a>
        </h3>
      </Container>
      {cmp}
    </>
  );
};
