import { useEffect, useRef, useState } from "react";
import "./App.css";
import YouTube from "react-youtube";
import React from "react";
import { Score } from "./components/Score";

function App() {
  const [elapsed, setElapsed] = useState("0");
  const playerRef = useRef<any>();

  const getTime = async () => {
    return await playerRef.current.getInternalPlayer().getCurrentTime();
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const elapsed_sec = await getTime();

      // calculations
      const elapsed_ms = Math.floor(elapsed_sec * 1000);
      const ms = elapsed_ms % 1000;
      const min = Math.floor(elapsed_ms / 60000);
      const seconds = Math.floor((elapsed_ms - min * 60000) / 1000);

      const resStr =
        min.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0") +
        ":" +
        ms.toString().padStart(3, "0");

      setElapsed(resStr);
    }, 1000); // 100 ms refresh. increase it if you don't require millisecond precision

    return () => {
      clearInterval(interval);
    };
  }, []);

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  // This is a hack for shutting up typescript compiler!
  const yt: any = React.createElement(YouTube as any, {
    videoId: "lDQ7hXMLxGc",
    opts,
    ref: playerRef,
    onReady: () => console.log("Fuck"),
  });

  return (
    <div className="App">
      <header className="App-header">
        {yt}
        <p>Elapsed: {elapsed}</p>
        <Score></Score>
      </header>
    </div>
  );
}

export default App;
