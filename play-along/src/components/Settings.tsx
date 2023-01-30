import { useState } from "react";
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { wrapWithNav } from "./NavBar";
import { PitchSetting } from "./PartSelector";

const clefs = ["Treble", "Bass"];
const clefKey = "clef";

export const getClef = () => {
  const ret = localStorage.getItem(clefKey);
  return ret ? ret : clefs[0];
};

const ClefSetting = () => {
  // Only add part chooser dropdown if there are at least two parts.
  const [clef, setClef] = useState(getClef());
  const set = (newClef: string) => {
    localStorage.setItem(clefKey, newClef);
    setClef(newClef);
  };

  return (
    <DropdownButton id="choose-clef" title={clef}>
      {clefs.map((el, idx) => {
        return (
          <Dropdown.Item key={idx} onClick={() => set(el)}>
            {el}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

export const Settings = () => {
  const pitchSelector = (
    <>
      <Row>
        <Col>Default pitch</Col>
        <Col>
          <PitchSetting title="" />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>Clef</Col>
        <Col>
          <ClefSetting />
        </Col>
      </Row>
    </>
  );
  return wrapWithNav(pitchSelector, "Settings");
};
