import { useEffect, useRef, useState } from "react";
import Vex from "vexflow";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { getSingle, xml2json } from "../util/util";
import { measureToVex } from "../util/vexUtil";

const VF = Vex.Flow;

export const Score = () => {
  const osmdRef = useRef<any>();
  const xmlRef = useRef<any>();
  const [osmdSet, setOsmd] = useState(false);

  const loadLocal = async () => {
    const fileName = "./scores/soviet_march_test.musicxml";
    const res = await fetch(fileName);
    const txt = await res.text();

    var osmd = new OpenSheetMusicDisplay("osmd");
    await osmd.load(txt);
    osmdRef.current = osmd;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(txt, "text/xml");
    xmlRef.current = xmlDoc;
    setOsmd(true);
    console.log("Loaded xml");
    return txt;
  };

  useEffect(() => {
    loadLocal();
  }, []);

  useEffect(() => {
    if (osmdSet) {
      const xmlDoc = xmlRef.current as Document;
      console.log(xmlDoc);

      const jsonRes = xml2json(xmlDoc);
      console.log("JSON", jsonRes);

      const scorePartwise = getSingle(jsonRes, "score-partwise");
      const partList = getSingle(scorePartwise, "part-list");

      const partIdList = partList["score-part"].map((el: any) => el._ATTRS.id);
      console.log("Parts", partIdList);

      const firstPartId = partIdList[0];
      const firstPart = scorePartwise["part"].filter(
        (el: any) => el._ATTRS.id === firstPartId
      )[0];
      const firstPartMeasures = firstPart.measure;
      console.log("First part measures", firstPartMeasures);

      const notes = measureToVex(firstPartMeasures[0]);

      ////////////////////////////////////////////////////////

      // Create an SVG renderer and attach it to the DIV element named "vf-extended-test".
      var div: any = document.getElementById("vf-extended-test");
      var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
      renderer.resize(500, 180); // Size our SVG:
      var context = renderer.getContext();

      // Create a stave at position 10, 40 of width 400 on the canvas.
      var stave = new VF.Stave(10, 40, 400);

      // Add a clef and time signature.
      stave.addClef("treble").addTimeSignature("4/4");

      // Connect it to the rendering context and draw!
      stave.setContext(context).draw();

      // Create a voice in 4/4 and add the notes from above
      var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables(notes);

      // Auto-format and draw
      var beams = VF.Beam.generateBeams(notes);
      Vex.Flow.Formatter.FormatAndDraw(context, stave, notes);
      beams.forEach(function (b) {
        b.setContext(context).draw();
      });
    }
  }, [osmdSet]);

  return (
    <>
      <div
        id="vf-extended-test"
        style={{
          height: "200px",
          width: "4000px",
          backgroundColor: "green",
          overflowX: "hidden",
          maxWidth: "100%",
        }}
      ></div>
      <div
        style={{
          height: "20px",
        }}
      ></div>
      <div
        id="osmd"
        style={{
          height: "200px",
          width: "4000px",
          backgroundColor: "green",
          overflowX: "hidden",
          maxWidth: "100%",
        }}
      ></div>
      <div id="osmd" style={{ width: "100%" }}></div>
      <div
        style={{
          height: "20px",
        }}
      ></div>
      <div id="xml-direct" style={{ width: "100%", height: "200px" }}></div>
    </>
  );
};
