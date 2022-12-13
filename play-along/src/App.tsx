import "./App.css";
import { ScoreRoute, Home } from "./components/ScoreSelector";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="App">
        <Home />
      </div>
    ),
  },
  { path: "/:scoreId", element: <ScoreRoute /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
