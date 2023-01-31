import "./App.css";
import { ScoreRoute } from "./components/ScoreSelector";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Settings } from "./components/Settings";
import { Help } from "./components/Help";
import { ListScores } from "./components/ListScores";
import { AudioPlayer } from "./components/AudioPlayer";
import { Home } from "./components/Home";

const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/:scoreId", element: <ScoreRoute /> },
  { path: "/settings", element: <Settings /> },
  { path: "/experimental", element: <AudioPlayer /> },
  { path: "/help", element: <Help /> },
  { path: "/listall", element: <ListScores /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
