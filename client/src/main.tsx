import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import App from "./App";
import "./index.css";
import HomePage from "./pages/landingpage"; // Landing page for new users
import ErrorPage from "./pages/error";
import LoginPage from "./pages/login";
import CreateAccountPage from "./pages/register";
import MissionForm from "./pages/mission_form";
import ReviewPage from "./pages/saving_mission_review";
import MyReviews from "./pages/myreviews";
import Auth from "./utils/auth"; // Import auth to check login status
import LandingPage from "./pages/landingpage";

// Apollo Client Setup
const httpLink = createHttpLink({
  uri: "/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// Check if user is logged in
const isLoggedIn = Auth.loggedIn();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: isLoggedIn ? <Navigate to="/landingpage" replace /> : <HomePage /> },
      { path: "landingpage", element: <LandingPage /> }, // Separate page for logged-in users
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <CreateAccountPage /> },
      { path: "review", element: <MissionForm /> },
      { path: "save_mission", element: <ReviewPage /> },
      { path: "myreviews", element: <MyReviews /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
