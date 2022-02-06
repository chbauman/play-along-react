import { useEffect } from "react";
import Vex from "vexflow";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

export const Score = () => {
  useEffect(() => {
    const VF = Vex.Flow;
    // Create an SVG renderer and attach it to the DIV element named "vf".
    const div = document.getElementById("vf") as HTMLDivElement;
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(500, 500);
    const context = renderer.getContext();
    context.setFont("Arial", 10);

    // Create a stave of width 400 at position 10, 40 on the canvas.
    const stave = new VF.Stave(10, 40, 400);

    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
  }, []);

  useEffect(() => {
    var osmd = new OpenSheetMusicDisplay("osmd");
    osmd.setOptions({
      backend: "svg",
      drawTitle: true,
      // drawingParameters: "compacttight" // don't display title, composer etc., smaller margins
    });
    osmd
      .load("https://downloads2.makemusic.com/musicxml/MozaVeilSample.xml")
      .then(function () {
        osmd.render();
        console.log("Rendered");
      });
  }, []);

  return (
    <>
      <div id="vf"></div>
      <div id="osmd" style={{ height: "50px", width: "50px" }}></div>
    </>
  );
};
