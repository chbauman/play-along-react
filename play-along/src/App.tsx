import "./App.css";
import { ScoreRoute, Home } from "./components/ScoreSelector";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Settings } from "./components/Settings";
import { Help } from "./components/Help";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <div className="App">
        <Home />
      </div>
    ),
  },
  { path: "/:scoreId", element: <ScoreRoute /> },
  { path: "/settings", element: <Settings /> },
  { path: "/help", element: <Help /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
