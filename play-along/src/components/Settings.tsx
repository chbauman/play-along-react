import { Col, Container, Row } from "react-bootstrap";
import ContactForm from "./FormSpree";
import { NavBar } from "./NavBar";
import { PitchSetting } from "./PartSelector";

export const Settings = () => {
  const navBar = <NavBar title="Settings" />;
  const contact = <ContactForm />;
  const pitchSelector = (
    <>
      <h4>Settings</h4>
      <Row>
        <Col>Choose default pitch</Col>
        <Col>
          <PitchSetting title="" />
        </Col>
      </Row>
    </>
  );
  return (
    <>
      {navBar}
      <Container className="mt-3">
        {pitchSelector}
        {contact}
      </Container>
    </>
  );
};
