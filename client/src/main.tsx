import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import App from "./App";
import "./index.css";
import Home from "./pages/home"; // Landing page for new users
import ErrorPage from "./pages/error";
import LoginPage from "./pages/login";
import CreateAccountPage from "./pages/register";
import MissionForm from "./pages/mission_form";
import ReviewPage from "./pages/saving_mission_review";
import MyReviews from "./pages/myreviews";
// import Auth from "./utils/auth"; // Import auth to check login status
import LandingPage from "./pages/landingpage";
import { setContext } from "@apollo/client/link/context";

// Apollo Client Setup
const httpLink = createHttpLink({
  uri: "/graphql",
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Check if user is logged in
// const isLoggedIn = Auth.loggedIn();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/landingpage" replace />},
      { path: "landingpage", element: <LandingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <CreateAccountPage /> },
      { path: "mission/new", element: <MissionForm /> },
      { path: "mission/review", element: <ReviewPage /> },
      { path: "mission/:id", element: <ReviewPage /> },
      { path: "myreviews", element: <MyReviews /> },
      { path: "home", element: <Home /> }, // Add this line to include the Home component
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
