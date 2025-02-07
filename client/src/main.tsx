import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import App from "./App";
import "./index.css";
import HomePage from "./pages/landingpage";
import ErrorPage from "./pages/error";
import LoginPage from "./pages/login";
import CreateAccountPage from "./pages/register";
import MissionForm from "./pages/mission_form";
import ReviewPage from "./pages/saving_mission_review";
import MyReviews from "./pages/myreviews";

// ✅ Create Apollo Client with correct URI
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql", // Make sure this matches your server's GraphQL URL
  credentials: "include", // If using authentication
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// ✅ Define Routes
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
      { path: "myreviews", element: <MyReviews /> },
    ],
  },
]);

// ✅ Wrap the app with ApolloProvider
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);