import "./App.css";
import { YtScoreRoute } from "./components/player/YtPlayer";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Settings } from "./components/Settings";
import { Help } from "./components/Help";
import { ListScores } from "./components/ListScores";
import { AudioScoreRoute } from "./components/player/AudioPlayer";
import { Home } from "./components/Home";
import { SCScoreRoute } from "./components/player/SoundCloudPlayer";

const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/yt/:scoreId", element: <YtScoreRoute /> },
  { path: "/sc/:scoreId", element: <SCScoreRoute /> },
  { path: "/sc/listall", element: <ListScores sub="sc" /> },
  { path: "/settings", element: <Settings /> },
  { path: "/help", element: <Help /> },
  { path: "/listall", element: <ListScores sub="yt" /> },
  { path: "/:audioId", element: <ListScores /> },
  { path: "/:audioId/listall", element: <ListScores /> },
  { path: "/:audioId/settings", element: <Settings /> },
  { path: "/:audioId/help", element: <Help /> },
  { path: "/:audioId/:scoreId", element: <AudioScoreRoute /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
