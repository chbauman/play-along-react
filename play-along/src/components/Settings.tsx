import React, { useState } from "react";
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { wrapWithNav } from "./NavBar";
import { PitchSetting } from "./PartSelector";
import { ReactComponent as BassClef } from "../img/bass.svg";
import { ReactComponent as TrebleClef } from "../img/treble.svg";
import { FingerType } from "../util/util";
import { useTranslation } from "react-i18next";
import { getSelectorInfo } from "../i18n";

const clefOptions = ["treble", "bass"];
const clefKey = "clef";

/** Returns the currently selected clef from local storage. */
export const getClef = () => {
  const ret = localStorage.getItem(clefKey);
  return ret ? ret : clefOptions[0];
};

type DDInfo = {
  settingKey: string;
  options: string[];
  currentValue: string;
  getComp: (opKey: string) => any;
  afterChange?: any;
};

/** Setting that can be changed by dropdown. */
const DDSetting = ({ ddInfo }: { ddInfo: DDInfo }) => {
  const [val, setClef] = useState(ddInfo.currentValue);
  const set = (newVal: string) => {
    localStorage.setItem(ddInfo.settingKey, newVal);
    setClef(newVal);
    ddInfo.afterChange?.();
  };

  const titleComp = ddInfo.getComp(val);
  return (
    <DropdownButton id={`choose-${ddInfo.settingKey}`} title={titleComp}>
      {ddInfo.options.map((el) => {
        return (
          <Dropdown.Item key={el} onClick={() => set(el)}>
            {ddInfo.getComp(el)}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

const fingerKey = "finger-mode";
const fingerKeys = ["none", "valve", "trombone"];

/** Returns the currently selected finger mode from local storage. */
export const getFinger = () => {
  const ret = localStorage.getItem(fingerKey);
  const retNotNull = ret ? ret : fingerKeys[0];
  return retNotNull as FingerType;
};

/** Setting component. */
export const Settings = () => {
  const { t, i18n } = useTranslation();
  const langSettingInfo = getSelectorInfo(t);

  const onLangChange = () => i18n.changeLanguage(langSettingInfo.getCurr());

  const clefInfo: DDInfo = {
    settingKey: clefKey,
    options: clefOptions,
    currentValue: getClef(),
    getComp: (opKey: string) => {
      if (opKey === "bass") {
        return (
          <>
            {t("bassClef")} <BassClef height={"3em"} />
          </>
        );
      }
      return (
        <>
          {t("trebleClef")} <TrebleClef height={"3em"} />
        </>
      );
    },
  };

  const fingerMap: { [key: string]: React.JSX.Element } = {
    none: <>{t("fingerNone")}</>,
    valve: <>{t("fingerThreeValves")}</>,
    trombone: <>{t("fingerTrombone")}</>,
  };
  const fingerInfo: DDInfo = {
    settingKey: fingerKey,
    options: fingerKeys,
    currentValue: getFinger(),
    getComp: (opKey: string) => fingerMap[opKey],
  };

  const pitchSelector = (
    <>
      <Row>
        <Col>{t("language")}</Col>
        <Col>
          <DDSetting
            ddInfo={{ ...langSettingInfo, afterChange: onLangChange }}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>{t("instrumentKey")}</Col>
        <Col>
          <PitchSetting title="" />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>{t("clef")}</Col>
        <Col>
          <DDSetting ddInfo={clefInfo} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>{t("fingering")}</Col>
        <Col>
          <DDSetting ddInfo={fingerInfo} />
        </Col>
      </Row>
    </>
  );
  return wrapWithNav(pitchSelector, t("settingsTitle"));
};
