import { ReactElement, useState } from "react";
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { wrapWithNav } from "./NavBar";
import { PitchSetting } from "./PartSelector";
import { ReactComponent as BassClef } from "../img/bass.svg";
import { ReactComponent as TrebleClef } from "../img/treble.svg";
import { FingerType } from "../util/util";

type ValToEl = { [key: string]: ReactElement };

const clefs: ValToEl = {
  Treble: (
    <>
      Treble <TrebleClef height={"3em"} />
    </>
  ),
  Bass: (
    <>
      Bass <BassClef height={"3em"} />
    </>
  ),
};
const clefKey = "clef";

/** Returns the currently selected clef from local storage. */
export const getClef = () => {
  const ret = localStorage.getItem(clefKey);
  return ret ? ret : Object.keys(clefs)[0];
};

/** Setting that can be changed by dropdown. */
const DDSetting = ({
  settingKey,
  getter,
  map,
}: {
  settingKey: string;
  getter: () => string;
  map: ValToEl;
}) => {
  const [val, setClef] = useState(getter());
  const set = (newVal: string) => {
    localStorage.setItem(settingKey, newVal);
    setClef(newVal);
  };

  const titleComp = <>{map[val]}</>;
  return (
    <DropdownButton id={`choose-${settingKey}`} title={titleComp}>
      {Object.entries(map).map((el, idx) => {
        return (
          <Dropdown.Item key={idx} onClick={() => set(el[0])}>
            {el[1]}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

const fingerKey = "finger-mode";
const fingerMap = {
  none: <>None</>,
  valve: <>3 Valves</>,
  trombone: <>Trombone</>,
};

/** Returns the currently selected finger mode from local storage. */
export const getFinger = () => {
  const ret = localStorage.getItem(fingerKey);
  const retNotNull = ret ? ret : Object.keys(fingerMap)[0];
  return retNotNull as FingerType;
};

/** Setting component. */
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
          <DDSetting settingKey={clefKey} map={clefs} getter={getClef} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>Fingering</Col>
        <Col>
          <DDSetting
            settingKey={fingerKey}
            map={fingerMap}
            getter={getFinger}
          />
        </Col>
      </Row>
    </>
  );
  return wrapWithNav(pitchSelector, "Settings");
};
