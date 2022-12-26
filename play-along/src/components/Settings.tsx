import { Col, Row } from "react-bootstrap";
import ContactForm from "./FormSpree";
import { wrapWithNav } from "./NavBar";
import { PitchSetting } from "./PartSelector";

export const Settings = () => {
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
  const fullComp = (
    <>
      {pitchSelector}
      {contact}
    </>
  );
  return wrapWithNav(fullComp, "Settings");
};
