import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import HomePage from "./pages/landingpage";
import ErrorPage from "./pages/error";
import LoginPage from "./pages/login";
import CreateAccountPage from "./pages/register";
import MissionForm from "./pages/mission_form";
import ReviewPage from "./pages/saving_mission_review";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Uses App.tsx as the layout
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <CreateAccountPage /> },
      { path: "review", element: <MissionForm /> },
      { path: "save_mission", element: <ReviewPage /> },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
