import { Col, Row } from "react-bootstrap";
import { wrapWithNav } from "./NavBar";
import { PitchSetting } from "./PartSelector";

export const Settings = () => {
  const pitchSelector = (
    <>
      <Row>
        <Col>Choose default pitch</Col>
        <Col>
          <PitchSetting title="" />
        </Col>
      </Row>
    </>
  );
  return wrapWithNav(pitchSelector, "Settings");
};
