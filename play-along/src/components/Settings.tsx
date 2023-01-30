import { ReactElement, useState } from "react";
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { wrapWithNav } from "./NavBar";
import { PitchSetting } from "./PartSelector";
import { ReactComponent as BassClef } from "../img/bass.svg";
import { ReactComponent as TrebleClef } from "../img/treble.svg";

const clefs: { [key: string]: ReactElement } = {
  Treble: <TrebleClef height={"3em"} />,
  Bass: <BassClef height={"3em"} />,
};
const clefKey = "clef";

export const getClef = () => {
  const ret = localStorage.getItem(clefKey);
  return ret ? ret : Object.keys(clefs)[0];
};

const ClefSetting = () => {
  // Only add part chooser dropdown if there are at least two parts.
  const [clef, setClef] = useState(getClef());
  const set = (newClef: string) => {
    localStorage.setItem(clefKey, newClef);
    setClef(newClef);
  };

  const titleComp = (
    <>
      {clef} {clefs[clef]}
    </>
  );
  return (
    <DropdownButton id="choose-clef" title={titleComp}>
      {Object.entries(clefs).map((el, idx) => {
        return (
          <Dropdown.Item key={idx} onClick={() => set(el[0])}>
            {el[0]} {el[1]}
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
