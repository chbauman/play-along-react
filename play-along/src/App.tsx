import "./App.css";
import { ScoreRoute } from "./components/ScoreSelector";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Settings } from "./components/Settings";
import { Help } from "./components/Help";
import { ListScores } from "./components/ListScores";
import { AudioScoreRoute } from "./components/AudioPlayer";
import { Home } from "./components/Home";

const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/yt/:scoreId", element: <ScoreRoute /> },
  { path: "/settings", element: <Settings /> },
  { path: "/help", element: <Help /> },
  { path: "/listall", element: <ListScores /> },
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
